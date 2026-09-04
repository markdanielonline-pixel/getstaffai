import { createClient } from '@supabase/supabase-js';

const TERMINAL_STATUSES = new Set(['done', 'failed', 'blocked', 'cancelled']);

function adminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function config() {
  const baseUrl = process.env.PROVISION_BASE_URL?.replace(/\/+$/, '');
  const token = process.env.PROVISION_INTEGRATION_TOKEN;
  if (!baseUrl || !token) throw new Error('Provision runtime is not configured');
  return { baseUrl, token };
}

async function request(path, options = {}) {
  const { baseUrl, token } = config();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 30_000);
  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`,
        ...(options.body ? { 'content-type': 'application/json' } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
      cache: 'no-store',
    }).catch((cause) => {
      // Transport failures surface as an opaque "fetch failed". Name the origin
      // being dialled (never the token) so misconfiguration is diagnosable.
      let origin = 'unparseable';
      try { origin = new URL(baseUrl).origin; } catch { /* keep placeholder */ }
      throw new Error(`Provision unreachable at ${origin}${path} (${cause?.cause?.code || cause?.message || 'transport error'})`);
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload.message || payload.error || `Provision returned HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return payload;
  } finally {
    clearTimeout(timer);
  }
}

function data(result, operation) {
  if (result.error) throw new Error(`${operation}: ${result.error.message}`);
  return result.data;
}

export async function provisionTeamRuntime(organization) {
  const runtime = await request('/api/integrations/staffai/teams', {
    method: 'POST',
    timeoutMs: 90_000,
    body: {
      external_id: organization.id,
      name: organization.name,
      company_description: organization.description ?? null,
      timezone: organization.timezone ?? 'UTC',
    },
  });
  // external_id is the tenant binding and is never relaxed: Provision must agree
  // the team belongs to THIS organization.
  if (runtime.external_id !== organization.id) {
    throw new Error(`Provision team ownership mismatch (returned external_id=${runtime.external_id}, expected ${organization.id}; returned team=${runtime.id}, mapped ${organization.provision_team_id})`);
  }
  const supabase = adminClient();
  // A tenant's Provision team can be legitimately recreated (host rebuild), which
  // leaves a stale mapping and would otherwise strand the tenant permanently.
  // Adopting the successor is allowed ONLY here, in the explicit provisioning
  // action, never in the readiness verifier, and is recorded as an audit event.
  const supersededTeamId = organization.provision_team_id && organization.provision_team_id !== runtime.id
    ? organization.provision_team_id : null;
  if (supersededTeamId) {
    console.warn(`[provision.team] org=${organization.id} adopting successor team ${runtime.id}, superseding ${supersededTeamId}`);
    data(await supabase.from('staffai_events').insert({
      org_id: organization.id,
      event_type: 'provision.team.superseded',
      source: 'provisionTeamRuntime',
      status: 'recorded',
      data: {
        external_id: organization.id,
        superseded_team_id: supersededTeamId,
        adopted_team_id: runtime.id,
        adopted_server_id: runtime.server_id ?? null,
      },
    }), 'Record Provision team succession');
  }
  data(await supabase.from('organizations').update({
    provision_team_id: runtime.id,
    provision_connection_status: runtime.runtime_status,
    provision_last_synced_at: new Date().toISOString(),
    provision_error: null,
  }).eq('id', organization.id), 'Save Provision team mapping');
  return runtime;
}

export async function syncProvisionTeam(organizationId) {
  const runtime = await request(`/api/integrations/staffai/teams/${encodeURIComponent(organizationId)}`, { timeoutMs: 90_000 });
  const supabase = adminClient();
  const organization = data(await supabase.from('organizations').select('provision_team_id').eq('id', organizationId).single(), 'Verify team mapping');
  // Deliberately strict: this is the readiness verifier. It must never adopt a
  // successor team, so readiness can never silently self-heal onto a different
  // runtime. Recovery happens only through the explicit provisioning action.
  if (runtime.external_id !== organizationId || (organization.provision_team_id && organization.provision_team_id !== runtime.id)) throw new Error(`Provision team ownership mismatch (returned external_id=${runtime.external_id}, expected ${organizationId}; returned team=${runtime.id}, mapped ${organization.provision_team_id})`);
  data(await supabase.from('organizations').update({
    provision_team_id: runtime.id,
    provision_connection_status: runtime.runtime_status,
    provision_last_synced_at: new Date().toISOString(),
    provision_error: null,
  }).eq('id', organizationId), 'Synchronize Provision team status');
  return runtime;
}

export async function provisionDispatcher(provisionTeamId) {
  const dispatcher = await request(`/api/integrations/staffai/teams/${encodeURIComponent(provisionTeamId)}/dispatcher`, {
    method: 'POST', body: {}, timeoutMs: 90_000,
  });
  if (dispatcher.team_id !== provisionTeamId || !dispatcher.id) throw new Error('Provision dispatcher ownership mismatch');
  return dispatcher;
}

export async function provisionAgentRuntime(orgId, employeeId, roleTemplate, onboardingAnswers = {}) {
  const supabase = adminClient();
  const organization = data(await supabase.from('organizations')
    .select('id, name, provision_team_id, provision_connection_status')
    .eq('id', orgId).single(), 'Load organization runtime mapping');
  if (!organization.provision_team_id || organization.provision_connection_status !== 'running') {
    throw new Error('Provision team runtime is not running');
  }
  const employee = data(await supabase.from('employees')
    .select('id, name, title, role, manager_id, provision_agent_id').eq('id', employeeId).eq('org_id', orgId).single(), 'Load employee');
  const runtime = await request(`/api/integrations/staffai/teams/${encodeURIComponent(organization.provision_team_id)}/agents`, {
    method: 'POST',
    timeoutMs: 90_000,
    body: {
      external_id: employee.id,
      name: employee.name,
      role: employee.title || employee.role || roleTemplate.title_default,
      system_prompt: roleTemplate.base_prompt_template || `You are ${employee.name}, working for ${organization.name}.`,
      // AGENTS.md: Qwen 3.8 Flash is the architectural default customer-facing
      // workforce model. The previous fallback (z-ai/glm-4.7) was neither that
      // nor the internal engineering model, and is the misalignment AGENTS.md
      // records. Slug confirmed present in OpenRouter's public model list.
      model: process.env.PROVISION_DEFAULT_MODEL || 'qwen/qwen3.8-flash',
      reports_to_external_id: employee.manager_id || null,
      capabilities: roleTemplate.required_tools || [],
      onboarding_context: onboardingAnswers,
    },
  });
  // external_id binds the agent to THIS employee and team_id binds it to THIS
  // tenant's team. Both stay strict and are never relaxed.
  if (runtime.external_id !== employee.id || runtime.team_id !== organization.provision_team_id) {
    throw new Error(`Provision agent ownership mismatch (returned external_id=${runtime.external_id}, expected ${employee.id}; returned team=${runtime.team_id}, expected ${organization.provision_team_id})`);
  }
  // An agent is recreated whenever its team is recreated, leaving a stale
  // provision_agent_id. Adopt the successor only here, in the explicit
  // provisioning action, and record it. syncProvisionAgent stays strict.
  const supersededAgentId = employee.provision_agent_id && employee.provision_agent_id !== runtime.id
    ? employee.provision_agent_id : null;
  if (supersededAgentId) {
    console.warn(`[provision.agent] employee=${employee.id} adopting successor agent ${runtime.id}, superseding ${supersededAgentId}`);
    data(await supabase.from('staffai_events').insert({
      org_id: orgId,
      event_type: 'provision.agent.superseded',
      source: 'provisionAgentRuntime',
      status: 'recorded',
      data: {
        employee_id: employee.id,
        superseded_agent_id: supersededAgentId,
        adopted_agent_id: runtime.id,
        team_id: organization.provision_team_id,
      },
    }), 'Record Provision agent succession');
  }
  data(await supabase.from('employees').update({
    provision_agent_id: runtime.id,
    provision_runtime_status: runtime.status,
    provision_last_synced_at: new Date().toISOString(),
    provision_error: null,
  }).eq('id', employeeId).eq('org_id', orgId), 'Save Provision agent mapping');
  return runtime;
}

export async function syncProvisionAgent(employeeId, orgId) {
  const supabase = adminClient();
  const employee = data(await supabase.from('employees').select('id, org_id, status, provision_agent_id').eq('id', employeeId).single(), 'Verify employee mapping');
  if (orgId && employee.org_id !== orgId) throw new Error('Employee tenant mismatch');
  const organization = data(await supabase.from('organizations').select('provision_team_id').eq('id', employee.org_id).single(), 'Verify agent team');
  const runtime = await request(`/api/integrations/staffai/agents/${encodeURIComponent(employeeId)}`, { timeoutMs: 90_000 });
  // Deliberately strict, as with syncProvisionTeam: the readiness verifier never
  // adopts a successor agent, so readiness cannot silently self-heal.
  if (runtime.external_id !== employeeId || runtime.team_id !== organization.provision_team_id
    || (employee.provision_agent_id && employee.provision_agent_id !== runtime.id)) throw new Error(`Provision agent ownership mismatch (returned external_id=${runtime.external_id}, expected ${employeeId}; returned agent=${runtime.id}, mapped ${employee.provision_agent_id}; returned team=${runtime.team_id}, expected ${organization.provision_team_id})`);
  data(await supabase.from('employees').update({
    provision_agent_id: runtime.id,
    provision_runtime_status: runtime.readiness?.operational === true ? 'active' : 'provisioning',
    provision_last_synced_at: new Date().toISOString(),
    provision_error: null,
    ...(runtime.readiness?.operational !== true && ['active', 'training'].includes(employee.status)
      ? { status: 'training', training_progress_pct: 0, training_completed_at: null } : {}),
  }).eq('id', employeeId).eq('org_id', employee.org_id), 'Synchronize Provision agent status');
  return runtime;
}

export async function dispatchTaskToAgent(employeeId, taskDescription, options = {}) {
  const supabase = adminClient();
  const employee = data(await supabase.from('employees')
    .select('id, org_id, name, provision_agent_id, provision_runtime_status')
    .eq('id', employeeId).single(), 'Load mapped employee');
  if (!employee.provision_agent_id || employee.provision_runtime_status !== 'active') {
    throw new Error(`Employee ${employee.name} does not have an active Provision runtime`);
  }
  const organization = data(await supabase.from('organizations')
    .select('id, provision_team_id, provision_connection_status')
    .eq('id', employee.org_id).single(), 'Load mapped organization');
  if (!organization.provision_team_id || organization.provision_connection_status !== 'running') {
    throw new Error('Organization Provision runtime is unavailable');
  }

  const idempotencyKey = options.idempotencyKey || crypto.randomUUID();
  let localTask = data(await supabase.from('employee_tasks')
    .select('*').eq('idempotency_key', idempotencyKey).maybeSingle(), 'Check task idempotency');
  if (localTask && (localTask.employee_id !== employee.id || localTask.org_id !== employee.org_id)) {
    throw new Error('Task correlation does not belong to the employee tenant');
  }
  if (!localTask) {
    localTask = data(await supabase.from('employee_tasks').insert({
      org_id: employee.org_id,
      employee_id: employee.id,
      description: taskDescription,
      idempotency_key: idempotencyKey,
      status: 'pending',
      provision_status: 'dispatching',
    }).select('*').single(), 'Create Staff AI task correlation');
  }

  if (!localTask.provision_task_id) {
    try {
      const provisionTask = await request('/api/integrations/staffai/tasks', {
        method: 'POST',
        body: {
          external_id: localTask.id,
          team_external_id: organization.id,
          agent_external_id: employee.id,
          title: options.title || taskDescription.slice(0, 200),
          description: taskDescription,
          priority: options.priority || 'medium',
        },
      });
      localTask = data(await supabase.from('employee_tasks').update({
        provision_task_id: provisionTask.id,
        provision_status: provisionTask.status,
        provision_last_synced_at: new Date().toISOString(),
        status: 'running',
      }).eq('id', localTask.id).select('*').single(), 'Save Provision task mapping');
    } catch (error) {
      data(await supabase.from('employee_tasks').update({
        status: 'failed', provision_status: 'unavailable', error_details: error.message,
        provision_last_synced_at: new Date().toISOString(),
      }).eq('id', localTask.id), 'Record Provision dispatch failure');
      throw error;
    }
  }
  if (options.waitForResult === false) return { success: true, taskId: localTask.id, status: 'running' };
  return pollProvisionTask(localTask.id, options);
}

export async function pollProvisionTask(localTaskId, options = {}) {
  const supabase = adminClient();
  const deadline = Date.now() + (options.timeoutMs ?? 660_000);
  while (Date.now() < deadline) {
    const runtimeTask = await request(`/api/integrations/staffai/tasks/${encodeURIComponent(localTaskId)}`);
    const terminal = TERMINAL_STATUSES.has(runtimeTask.status);
    const localStatus = runtimeTask.status === 'done' ? 'completed'
      : ['failed', 'cancelled'].includes(runtimeTask.status) ? 'failed' : runtimeTask.status;
    data(await supabase.from('employee_tasks').update({
      status: localStatus,
      provision_status: runtimeTask.status,
      result: runtimeTask.result_summary ?? null,
      error_details: runtimeTask.status === 'failed' ? (runtimeTask.result_summary || 'Provision execution failed') : null,
      provision_last_synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', localTaskId), 'Persist Provision task result');
    if (terminal) return {
      success: runtimeTask.status === 'done', taskId: localTaskId,
      provisionTaskId: runtimeTask.id, status: runtimeTask.status, result: runtimeTask.result_summary,
    };
    await new Promise(resolve => setTimeout(resolve, options.pollIntervalMs ?? 2_000));
  }
  throw new Error(`Provision task ${localTaskId} did not complete before timeout`);
}
