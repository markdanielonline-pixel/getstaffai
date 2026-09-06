import { createClient } from '@supabase/supabase-js';
import { toolBriefing } from './agent-tools/briefing';
import { toolsForRole } from './agent-tools/registry';
import { operational } from './initial-workforce.js';

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

// Provision creates a team/agent record immediately and installs its runtime
// asynchronously (container lifecycle, then a per-server-locked agent install).
// A single readiness sample taken the moment the create call returns therefore
// reads not-operational for whichever install is still in flight, which is what
// made two-employee provisioning alternate one active / one error between
// retries even though Provision itself converged seconds later. Readiness
// evidence stays exactly as strict; this only stops sampling it too early.
async function awaitOperational(sample, { timeoutMs, intervalMs = 5_000, label }) {
  const deadline = Date.now() + timeoutMs;
  let runtime = await sample();
  while (!operational(runtime) && Date.now() < deadline) {
    await new Promise(resolve => setTimeout(resolve, intervalMs));
    // Ownership mismatches throw straight out of here and are never retried:
    // waiting is only ever for an install that has not finished yet.
    runtime = await sample();
  }
  if (!operational(runtime)) console.warn(`[provision.await] ${label} did not become operational within ${timeoutMs}ms`);
  // The caller keeps its own strict verification; this only decides when to look.
  return runtime;
}

// options.demote === false makes this purely a reader. Readiness verifiers use
// it that way: they report what they observe without writing a lifecycle change
// that only the provisioning path can undo.
export async function awaitProvisionAgentOperational(employeeId, orgId, options = {}) {
  const runtime = await awaitOperational(() => syncProvisionAgent(employeeId, orgId, { demote: false }), {
    timeoutMs: options.timeoutMs ?? 180_000,
    intervalMs: options.intervalMs ?? 5_000,
    label: `agent employee=${employeeId}`,
  });
  if (operational(runtime) || options.demote === false) return runtime;
  // Only a reading that stayed non-operational for the whole budget, taken by
  // the provisioning path rather than by a reader, is written down.
  return syncProvisionAgent(employeeId, orgId);
}

export function awaitProvisionTeamOperational(organizationId, options = {}) {
  return awaitOperational(() => syncProvisionTeam(organizationId), {
    timeoutMs: options.timeoutMs ?? 240_000,
    intervalMs: options.intervalMs ?? 5_000,
    label: `team org=${organizationId}`,
  });
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
    .select('id, name, provision_team_id, provision_connection_status, model_policy')
    .eq('id', orgId).single(), 'Load organization runtime mapping');
  if (!organization.provision_team_id || organization.provision_connection_status !== 'running') {
    throw new Error('Provision team runtime is not running');
  }
  const employee = data(await supabase.from('employees')
    .select('id, name, title, role, manager_id, provision_agent_id, employee_type').eq('id', employeeId).eq('org_id', orgId).single(), 'Load employee');
  const runtime = await request(`/api/integrations/staffai/teams/${encodeURIComponent(organization.provision_team_id)}/agents`, {
    method: 'POST',
    timeoutMs: 90_000,
    body: {
      external_id: employee.id,
      name: employee.name,
      role: employee.title || employee.role || roleTemplate.title_default,
      // The tool credential is derived from the employee id, which only exists
      // by this point, so the briefing is appended here rather than built into
      // the playbook prompt.
      system_prompt: [
        roleTemplate.base_prompt_template || `You are ${employee.name}, working for ${organization.name}.`,
        roleTemplate.withToolToken
          ? toolBriefing(employee.id, toolsForRole(employee.title || employee.role || roleTemplate.title_default))
          : '',
      ].filter(Boolean).join('\n'),
      // Organization-level routing policy, resolved from the organization row
      // on every agent creation, so it survives initial provisioning,
      // reprovisioning, employee creation and runtime replacement without any
      // manual edit to a runtime container. Null policy means the customer
      // default: Qwen 3.8 Flash, the architectural default customer-facing
      // workforce model per AGENTS.md.
      model: organization.model_policy || process.env.PROVISION_DEFAULT_MODEL || 'qwen/qwen3.8-flash',
      reports_to_external_id: employee.manager_id || null,
      capabilities: roleTemplate.required_tools || [],
      // Who may hand work to someone else. The customer speaks only to their
      // Executive Assistant, which passes anything about the business to the
      // General Manager, which runs the company and assigns the specialists.
      // A specialist does the work it is given; it does not reassign it, which
      // is what stops a task looping between employees with nobody finishing it.
      delegation_enabled: ['ea', 'gm'].includes(employee.employee_type),
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

// options.demote === false takes a reading without writing the lifecycle
// demotion. Installing a second agent restarts the tenant gateway, so a
// single sample taken during that window reads not-operational for an
// employee who is fine - and the demotion to 'training' is sticky, because
// only the employee factory ever writes 'active' back. Callers that poll
// therefore read without demoting and record the verdict once, at the end.
export async function syncProvisionAgent(employeeId, orgId, options = {}) {
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
    ...(options.demote !== false && runtime.readiness?.operational !== true && ['active', 'training'].includes(employee.status)
      ? { status: 'training', training_progress_pct: 0, training_completed_at: null } : {}),
  }).eq('id', employeeId).eq('org_id', employee.org_id), 'Synchronize Provision agent status');
  return runtime;
}

// Staff AI had no way to remove an agent from a tenant's runtime, so a
// dismissed employee kept a live, installed agent on the gateway. The
// deletion is idempotent on Provision's side, so a retry after an ambiguous
// failure converges instead of stranding the employee half-removed.
export async function decommissionAgentRuntime(employeeId, orgId) {
  const supabase = adminClient();
  const employee = data(await supabase.from('employees').select('id, org_id, name, provision_agent_id')
    .eq('id', employeeId).eq('org_id', orgId).single(), 'Load employee for decommission');
  const organization = data(await supabase.from('organizations').select('id, provision_team_id')
    .eq('id', orgId).single(), 'Load organization for decommission');
  if (!organization.provision_team_id) throw new Error('Organization has no Provision runtime to remove from');
  if (employee.provision_agent_id) {
    // team_external_id is the tenant binding, and Provision keys teams by the
    // organization UUID - not by its own team id. Sending provision_team_id here
    // was rejected outright as a non-UUID. dispatchTaskToAgent already uses the
    // organization id for the same field; this now matches it.
    await request(`/api/integrations/staffai/agents/${encodeURIComponent(employeeId)}`, {
      method: 'DELETE', timeoutMs: 90_000, body: { team_external_id: organization.id },
    });
  }
  data(await supabase.from('employees').update({
    provision_agent_id: null,
    provision_runtime_status: 'unprovisioned',
    provision_last_synced_at: new Date().toISOString(),
    provision_error: null,
  }).eq('id', employeeId).eq('org_id', orgId), 'Clear Provision agent mapping');
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
      // Where the answer has to end up. Recorded before dispatch so a task
      // that outlives the request which started it can still be delivered.
      metadata: options.conversationId ? { conversation_id: options.conversationId } : {},
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

/**
 * Deliver the result of any task that finished after the request that started
 * it had already gone.
 *
 * The chat route dispatches a task and then polls for it inside the customer's
 * own HTTP request. Nothing else ever writes the answer back. So a task that
 * outlives that request - a long research job, a closed tab, a dropped mobile
 * connection, or the route hitting its own execution limit - ran to completion
 * in the runtime and was silently dropped: the employee did the work and the
 * customer saw an empty thread. Observed live with five research tasks that all
 * completed in Provision and none of which reached a conversation.
 *
 * This is the catch-up path. It is safe to call on every conversation load:
 * delivery is idempotent on the task id, and a task is only ever delivered once.
 */
export async function reconcileConversationTasks(orgId, { limit = 10, maxAgeMs = 86_400_000 } = {}) {
  const supabase = adminClient();
  const since = new Date(Date.now() - maxAgeMs).toISOString();
  const pending = data(await supabase.from('employee_tasks')
    .select('id, employee_id, org_id, metadata, provision_task_id, delivered_at, created_at')
    .eq('org_id', orgId)
    .is('delivered_at', null)
    .not('provision_task_id', 'is', null)
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(limit), 'Load undelivered tasks');

  let delivered = 0;
  for (const task of pending || []) {
    const conversationId = task.metadata?.conversation_id;
    if (!conversationId) continue;
    let runtimeTask;
    try {
      runtimeTask = await request(`/api/integrations/staffai/tasks/${encodeURIComponent(task.id)}`);
    } catch {
      continue; // Transient: the next conversation load tries again.
    }
    if (!TERMINAL_STATUSES.has(runtimeTask.status)) continue;

    const conversation = data(await supabase.from('conversations')
      .select('id, ceo_id').eq('id', conversationId).maybeSingle(), 'Load conversation for delivery');
    if (!conversation) continue;
    const employee = data(await supabase.from('employees')
      .select('id, name').eq('id', task.employee_id).maybeSingle(), 'Load employee for delivery');

    const succeeded = runtimeTask.status === 'done';
    const content = succeeded
      ? runtimeTask.result_summary
      : `I could not complete that request. ${runtimeTask.result_summary || 'The task ended as ' + runtimeTask.status + '.'}`;
    if (!content) continue;

    data(await supabase.from('messages').upsert({
      conversation_id: conversationId,
      ceo_id: conversation.ceo_id,
      role: 'employee',
      content,
      idempotency_key: `task-result:${task.id}`,
      metadata: {
        employee_id: task.employee_id,
        employee_name: employee?.name || null,
        task_id: task.id,
        provision_task_id: runtimeTask.id,
        delivered_by: 'reconcile',
      },
    }, { onConflict: 'idempotency_key', ignoreDuplicates: true }), 'Deliver task result');

    data(await supabase.from('employee_tasks').update({
      status: succeeded ? 'completed' : 'failed',
      provision_status: runtimeTask.status,
      result: runtimeTask.result_summary ?? null,
      delivered_at: new Date().toISOString(),
      provision_last_synced_at: new Date().toISOString(),
    }).eq('id', task.id), 'Mark task delivered');
    data(await supabase.from('conversations').update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId), 'Touch conversation');
    delivered += 1;
  }
  return { delivered, considered: pending?.length || 0 };
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
