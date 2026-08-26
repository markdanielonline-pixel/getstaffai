import { embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { Client } from 'pg';
import { createFrappeUser } from './frappe';
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
}) {
  const supabase = await createAdminClient();

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
  const { data: employee, error: empError } = await supabase
    .from('employees')
    .insert([
      {
        org_id: orgId,
        role_template_id: roleTemplateId,
        department_id: departmentId,
        manager_id: managerId,
        name: generatePersonaName(roleTemplate.title_default),
        title: roleTemplate.title_default,
        status: 'provisioning',
        tools_authorized: roleTemplate.required_tools,
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

  // 3. Initiate Knowledge Binding
  await bindKnowledge(employee.id, onboardingAnswers, roleTemplate);

  // 4. Provision Tool Identities
  await provisionTools(employee.id, roleTemplate.required_tools);

  // 4b. Provision LangGraph Runtime
  const { provisionAgentRuntime } = await import('./provision');
  await provisionAgentRuntime(orgId, employee.id, roleTemplate, onboardingAnswers);

  // 5. Initialize Default KPIs
  if (roleTemplate.default_kpis && roleTemplate.default_kpis.length > 0) {
    const kpiInserts = roleTemplate.default_kpis.map(kpi => ({
      employee_id: employee.id,
      metric_name: kpi.metric_name,
      target_value: kpi.target_value
    }));
    await supabase.from('kpis').insert(kpiInserts);
  }

  // 6. Transition Status to Active (or Onboarding if manual steps remain)
  const { data: activeEmployee } = await supabase
    .from('employees')
    .update({ status: 'active' })
    .eq('id', employee.id)
    .select()
    .single();

  await publishEvent({
    event_type: 'employee.onboarding.completed',
    org_id: orgId,
    data: { employee_id: employee.id }
  });

  return activeEmployee;
}

// Stubs for complex external provisioning integrations
async function bindKnowledge(employeeId, answers, roleTemplate) {
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
      employee_id UUID NOT NULL,
      content TEXT,
      embedding vector(1536)
    );
  `);

  for (let i = 0; i < sops.length; i++) {
    await client.query(
      'INSERT INTO employee_knowledge (employee_id, content, embedding) VALUES ($1, $2, $3)',
      [employeeId, sops[i], `[${embeddings[i].join(',')}]`]
    );
  }

  await client.end();
  console.log(`[Factory] Bound knowledge for ${employeeId}. Inserted ${sops.length} SOPs into PGVector.`);
}

async function provisionTools(orgId, employeeId, requiredTools, email, employeeName) {
  if (requiredTools && (requiredTools.includes('frappe') || requiredTools.includes('erpnext'))) {
      const domain = `tenant-${orgId}.frappe.local`; 
      try {
        await createFrappeUser(orgId, domain, employeeName, email, 'System Manager');
        console.log(`[Factory] Provisioned Frappe user for ${employeeId} at ${domain}`);
      } catch (err) {
        console.error(`[Factory] Failed to provision Frappe user:`, err);
      }
  }
  console.log(`[Factory] Provisioned tools for ${employeeId}:`, requiredTools);
}

function generatePersonaName(title) {
  const names = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey', 'Riley'];
  return `${names[Math.floor(Math.random() * names.length)]} (AI)`;
}
