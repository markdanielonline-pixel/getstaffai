import { embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { Client } from 'pg';
import { createFrappeUser, provisionFrappeSite } from './frappe';
import { createClient } from '@supabase/supabase-js';
import { provisionAgentRuntime, syncProvisionAgent } from './provision';
import { runEmployeeFactory } from './factory-core';
import { checked } from './provisioning-operation';

export async function instantiateEmployee({
  orgId, roleTemplateId, roleTemplate: suppliedTemplate, managerId, departmentId,
  onboardingAnswers = {}, idempotencyKey, persona = {}, existingEmployeeId = null,
}) {
  if (!orgId || !idempotencyKey) throw new Error('Tenant and idempotency key are required');
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } });
  const roleTemplate = suppliedTemplate || checked(await supabase.from('role_templates').select('*')
    .eq('id', roleTemplateId).single(), 'Load role template');
  if (!existingEmployeeId && !suppliedTemplate) {
    const legacy = checked(await supabase.from('employee_tasks').select('employee_id,result')
      .eq('org_id', orgId).eq('idempotency_key', `hire-${idempotencyKey}`).maybeSingle(), 'Read legacy hiring result');
    if (legacy?.employee_id) existingEmployeeId = legacy.employee_id;
  }
  const employeeName = persona.name || generatePersonaName(roleTemplate.title_default);
  return runEmployeeFactory({
    db: supabase, orgId, key: idempotencyKey, existingId: existingEmployeeId,
    employeeInput: {
      org_id: orgId, role_template_id: roleTemplateId || null, department_id: departmentId || null,
      manager_id: managerId || null, name: employeeName, title: roleTemplate.title_default,
      role: roleTemplate.title_default, tools_authorized: roleTemplate.required_tools || [],
      virtual_email: null, ...persona,
    },
    prepare: async employee => {
      // Initial orchestration context goes directly to Provision; no new business-tool
      // identities are required. Existing non-initial factory adapters remain unchanged.
      if (!suppliedTemplate) {
        await bindKnowledge(orgId, employee.id, onboardingAnswers, roleTemplate);
        await provisionTools(supabase, orgId, employee.id, roleTemplate.required_tools,
          employee.virtual_email || `ai-${employee.id}@getstaffai.com`, employee.name);
      }
      for (const kpi of roleTemplate.default_kpis || []) {
        const existing = checked(await supabase.from('kpis').select('id').eq('employee_id', employee.id)
          .eq('metric_name', kpi.metric_name).limit(1), 'Read KPI');
        if (!existing.length) checked(await supabase.from('kpis').insert({
          employee_id: employee.id, metric_name: kpi.metric_name, target_value: kpi.target_value,
        }), 'Create KPI');
      }
    },
    provision: employee => provisionAgentRuntime(orgId, employee.id, roleTemplate, onboardingAnswers),
    inspect: employee => syncProvisionAgent(employee.id, orgId),
  });
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
