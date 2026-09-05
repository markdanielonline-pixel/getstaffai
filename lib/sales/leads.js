import { createClient } from '@supabase/supabase-js';

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } });
}

// A lead is only worth capturing if it can be acted on later, so the row carries
// the qualification and the recommendation the agent made, not just an address.
export async function captureLead(lead) {
  const db = admin();
  const row = {
    email: lead.email?.trim() || null,
    name: lead.name?.trim() || null,
    company_name: lead.companyName?.trim() || null,
    industry: lead.industry?.trim() || null,
    qualification: lead.qualification || {},
    recommended_setup: lead.recommendedSetup || {},
    conversation_summary: lead.summary || null,
    stage: lead.stage || 'qualified',
    escalate: lead.escalate === true,
    escalation_reason: lead.escalationReason || null,
    updated_at: new Date().toISOString(),
  };

  // Re-contact by the same person updates the existing lead rather than creating
  // a duplicate, so follow-up context accumulates instead of fragmenting.
  if (row.email) {
    const { data: existing } = await db.from('sales_leads')
      .select('id').ilike('email', row.email).order('created_at', { ascending: false }).limit(1).maybeSingle();
    if (existing) {
      const { data, error } = await db.from('sales_leads').update(row).eq('id', existing.id).select('id').single();
      if (error) throw new Error(`Unable to update lead: ${error.message}`);
      return data.id;
    }
  }

  const { data, error } = await db.from('sales_leads').insert(row).select('id').single();
  if (error) throw new Error(`Unable to capture lead: ${error.message}`);
  return data.id;
}

export async function listOpenLeads(limit = 25) {
  const db = admin();
  const { data, error } = await db.from('sales_leads')
    .select('*').in('stage', ['qualified', 'new', 'following_up'])
    .is('followup_dispatched_at', null)
    .order('created_at', { ascending: false }).limit(limit);
  if (error) throw new Error(`Unable to read leads: ${error.message}`);
  return data || [];
}

export async function markFollowupDispatched(leadId, taskId) {
  const db = admin();
  const { error } = await db.from('sales_leads').update({
    followup_task_id: taskId || null,
    followup_dispatched_at: new Date().toISOString(),
    stage: 'following_up',
    updated_at: new Date().toISOString(),
  }).eq('id', leadId);
  if (error) throw new Error(`Unable to record follow-up dispatch: ${error.message}`);
}
