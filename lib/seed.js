import { createAdminClient } from '@/lib/supabase/server';
import { instantiateEmployee } from './factory';

export async function seedDemoTenant() {
  const supabase = await createAdminClient();

  console.log('--- Starting Demo Tenant Seeding ---');

  // 1. Create Organization
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert([{
      name: 'Acme Corp',
      domain: 'acme.com',
      industry: 'Technology',
      subscription_tier: 'enterprise',
      status: 'active'
    }])
    .select()
    .single();

  if (orgError) throw orgError;
  console.log(`Created Org: ${org.name} (${org.id})`);

  // 2. Create Departments
  const { data: execDept } = await supabase
    .from('departments')
    .insert([{ org_id: org.id, name: 'Executive Office' }])
    .select().single();

  const { data: salesDept } = await supabase
    .from('departments')
    .insert([{ org_id: org.id, name: 'Sales & Growth' }])
    .select().single();

  // 3. Create Role Templates
  const { data: eaTemplate } = await supabase
    .from('role_templates')
    .insert([{
      title_default: 'Executive Assistant',
      description: 'The CEO\'s right hand. Manages schedule, priorities, and delegates cross-department work.',
      base_prompt_template: 'You are the Executive Assistant to the CEO of {company_name}. You are highly capable, warm, and business-focused.',
      required_tools: ['calendar', 'email', 'task_delegation'],
      default_kpis: [
        { metric_name: 'tasks_delegated_successfully', target_value: 100 }
      ]
    }])
    .select().single();

  const { data: sdrTemplate } = await supabase
    .from('role_templates')
    .insert([{
      title_default: 'Sales Development Representative',
      description: 'Handles outbound prospecting and inbound lead qualification.',
      base_prompt_template: 'You are an SDR for {company_name}. Your goal is to qualify leads.',
      required_tools: ['crm_access', 'email'],
      default_kpis: [
        { metric_name: 'qualified_appointments', target_value: 25 }
      ]
    }])
    .select().single();

  // 4. Run Employee Factory
  console.log('Instantiating EA...');
  const ea = await instantiateEmployee({
    orgId: org.id,
    roleTemplateId: eaTemplate.id,
    departmentId: execDept.id,
    onboardingAnswers: { ceo_preferences: 'Prefers concise updates in the morning.' }
  });

  console.log('Instantiating SDR...');
  const sdr = await instantiateEmployee({
    orgId: org.id,
    roleTemplateId: sdrTemplate.id,
    departmentId: salesDept.id,
    onboardingAnswers: { icp: 'B2B SaaS companies over $1M ARR.' }
  });

  // 5. Update Department Managers
  await supabase.from('departments').update({ manager_id: ea.id }).eq('id', execDept.id);
  
  // Set EA as SDR's manager for demo purposes (acting as GM)
  await supabase.from('employees').update({ manager_id: ea.id }).eq('id', sdr.id);

  console.log('--- Demo Tenant Seeding Complete ---');
  return org;
}
