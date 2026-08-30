import { embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { Client } from 'pg';
import { createFrappeUser, provisionFrappeSite } from './frappe';
import { createAdminClient } from '@/lib/supabase/server';
import { publishEvent } from './events';

/**
 * Staff AI Employee Factory
 * Handles the idempotent instantiation of an AI employee from a role template.
 */
export async function instantiateEmployee({
  orgId,
  roleTemplateId,
  managerId,
  departmentId,
  onboardingAnswers,
  idempotencyKey,
}) {
  if (!idempotencyKey) throw new Error("idempotencyKey is required for safe provisioning");

  const supabase = await createAdminClient();

  // Check Idempotency
  const { data: existingTask } = await supabase
    .from('employee_tasks')
    .select('id, result')
    .eq('idempotency_key', `hire-${idempotencyKey}`)
    .maybeSingle();
    
  if (existingTask && existingTask.result) {
    return JSON.parse(existingTask.result); // Return the already provisioned employee
  }

  // 1. Fetch Role Template
  const { data: roleTemplate, error: roleError } = await supabase
    .from('role_templates')
    .select('*')
    .eq('id', roleTemplateId)
    .single();
    
  if (roleError || !roleTemplate) {
    throw new Error(`Failed to load role template: ${roleError?.message}`);
  }

  // 2. Create Employee Record (Status: Provisioning)
  const employeeName = generatePersonaName(roleTemplate.title_default);
  const { data: employee, error: empError } = await supabase
    .from('employees')
    .insert([
      {
        org_id: orgId,
        role_template_id: roleTemplateId,
        department_id: departmentId,
        manager_id: managerId,
        name: employeeName,
        title: roleTemplate.title_default,
        status: 'provisioning',
        tools_authorized: roleTemplate.required_tools,
        virtual_email: `ai-${Date.now()}@getstaffai.com`
      }
    ])
    .select()
    .single();

  if (empError) {
    throw new Error(`Failed to create employee record: ${empError.message}`);
  }

  await publishEvent({
    event_type: 'employee.hired',
    org_id: orgId,
    data: { employee_id: employee.id, role: employee.title }
  });

  try {
    // 3. Initiate Knowledge Binding
    await bindKnowledge(orgId, employee.id, onboardingAnswers, roleTemplate);

    // 4. Provision Tool Identities
    await provisionTools(supabase, orgId, employee.id, roleTemplate.required_tools, employee.virtual_email, employeeName);

    // 4b. Provision the real Provision workforce runtime. A Staff AI employee
    // remains non-operational until Provision confirms the harness agent active.
    const { provisionAgentRuntime, syncProvisionAgent } = await import('./provision');
    await provisionAgentRuntime(orgId, employee.id, roleTemplate, onboardingAnswers);
    const runtime = await waitForProvisionAgent(employee.id, syncProvisionAgent);

    // 5. Initialize Default KPIs
    if (roleTemplate.default_kpis && roleTemplate.default_kpis.length > 0) {
      const kpiInserts = roleTemplate.default_kpis.map(kpi => ({
        employee_id: employee.id,
        metric_name: kpi.metric_name,
        target_value: kpi.target_value
      }));
      await supabase.from('kpis').insert(kpiInserts);
    }

    // 6. Transition to active only after Provision reports a real active agent.
    const { data: activeEmployee } = await supabase
      .from('employees')
      .update({
        status: 'active',
        provision_agent_id: runtime.id,
        provision_runtime_status: runtime.status,
        provision_last_synced_at: new Date().toISOString(),
        provision_error: null,
      })
      .eq('id', employee.id)
      .select()
      .single();

    await publishEvent({
      event_type: 'employee.onboarding.completed',
      org_id: orgId,
      data: { employee_id: employee.id }
    });

    // Record Success for Idempotency
    await supabase.from('employee_tasks').insert({
      org_id: orgId,
      employee_id: employee.id,
      idempotency_key: `hire-${idempotencyKey}`,
      description: `Factory Provisioning for ${employeeName}`,
      status: 'completed',
      result: JSON.stringify(activeEmployee)
    });

    return activeEmployee;

  } catch (provisioningError) {
    // Preserve the control-plane record and audit trail, but never expose a
    // configuration-only employee as operational.
    console.error(`[Factory] Provisioning failed for ${employee.id}.`, provisioningError);
    await supabase.from('employees').update({
      status: 'provisioning',
      provision_runtime_status: 'error',
      provision_error: provisioningError.message,
      provision_last_synced_at: new Date().toISOString(),
    }).eq('id', employee.id);
    
    await publishEvent({
      event_type: 'employee.hired.failed',
      org_id: orgId,
      data: { error: provisioningError.message }
    });
    
    throw provisioningError;
  }
}

async function waitForProvisionAgent(employeeId, syncProvisionAgent) {
  const deadline = Date.now() + 300_000;
  while (Date.now() < deadline) {
    const runtime = await syncProvisionAgent(employeeId);
    if (runtime.status === 'active') return runtime;
    if (runtime.status === 'error') throw new Error('Provision agent deployment failed');
    await new Promise(resolve => setTimeout(resolve, 3_000));
  }
  throw new Error('Provision agent did not become active before the provisioning timeout');
}

// Stubs for complex external provisioning integrations
async function bindKnowledge(orgId, employeeId, answers, roleTemplate) {
  if (!process.env.VECTOR_DB_URL) {
    console.warn("[Factory] VECTOR_DB_URL missing, skipping knowledge binding");
    return;
  }
  
  const sops = [];
  for (const key of Object.keys(answers)) {
    const questionDef = roleTemplate.onboarding_schema?.find(q => q.id === key);
    if (questionDef) {
       sops.push(`Q: ${questionDef.question}\nA: ${answers[key]}`);
    } else {
       sops.push(`Onboarding Info (${key}): ${answers[key]}`);
    }
  }
  
  if (sops.length === 0) return;

  let embeddings = [];
  if (!process.env.OPENAI_API_KEY) {
    console.warn("[Factory] OPENAI_API_KEY missing, using mock embeddings for local dev.");
    embeddings = sops.map(() => Array(1536).fill(0.1));
  } else {
    const res = await embedMany({
      model: openai.embedding('text-embedding-3-small'),
      values: sops
    });
    embeddings = res.embeddings;
  }

  const client = new Client({ connectionString: process.env.VECTOR_DB_URL });
  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS employee_knowledge (
      id SERIAL PRIMARY KEY,
      org_id UUID NOT NULL,
      employee_id UUID NOT NULL,
      content TEXT,
      embedding vector(1536)
    );
  `);

  for (let i = 0; i < sops.length; i++) {
    await client.query(
      'INSERT INTO employee_knowledge (org_id, employee_id, content, embedding) VALUES ($1, $2, $3, $4)',
      [orgId, employeeId, sops[i], `[${embeddings[i].join(',')}]`]
    );
  }

  await client.end();
  console.log(`[Factory] Bound knowledge for ${employeeId}. Inserted ${sops.length} SOPs into PGVector.`);
}

async function provisionTools(supabase, orgId, employeeId, requiredTools, email, employeeName) {
  if (requiredTools && (requiredTools.includes('frappe') || requiredTools.includes('erpnext'))) {
      const suffix = process.env.FRAPPE_TENANT_DOMAIN_SUFFIX;
      if (!suffix) throw new Error('FRAPPE_TENANT_DOMAIN_SUFFIX is not configured');
      const { data: organization, error: orgError } = await supabase.from('organizations')
        .select('id, frappe_site_domain, frappe_connection_status').eq('id', orgId).single();
      if (orgError) throw orgError;
      const domain = organization.frappe_site_domain || `staffai-${orgId.slice(0, 8)}.${suffix}`;
      try {
        if (organization.frappe_connection_status !== 'connected') {
          await provisionFrappeSite(orgId, domain);
          await supabase.from('organizations').update({
            frappe_site_domain: domain,
            frappe_connection_status: 'connected',
            frappe_last_synced_at: new Date().toISOString(),
            frappe_error: null,
          }).eq('id', orgId);
        }
        const frappeUser = await createFrappeUser(orgId, domain, employeeName, email, 'Standard User');
        await supabase.from('employees').update({ frappe_user_id: frappeUser.user_id }).eq('id', employeeId);
        console.log(`[Factory] Provisioned Frappe user for ${employeeId} at ${domain}`);
      } catch (err) {
        await supabase.from('organizations').update({
          frappe_connection_status: 'error',
          frappe_error: err.message,
          frappe_last_synced_at: new Date().toISOString(),
        }).eq('id', orgId);
        console.error(`[Factory] Failed to provision Frappe user:`, err);
        throw new Error(`Tool Provisioning Failed: ${err.message}`);
      }
  }
  console.log(`[Factory] Provisioned tools for ${employeeId}:`, requiredTools);
}

function generatePersonaName(title) {
  const names = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey', 'Riley'];
  return `${names[Math.floor(Math.random() * names.length)]} (AI)`;
}
