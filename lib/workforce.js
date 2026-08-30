import { createClient } from '@supabase/supabase-js';
import { callLLM } from '@/lib/llm/router';

function assertResult(result, operation) {
  if (result.error) throw new Error(`${operation}: ${result.error.message}`);
  return result.data;
}

function memoryFor(ceo, intelligenceLevel) {
  const now = new Date().toISOString();
  return {
    core: [
      { content: `CEO name: ${ceo.name || 'CEO'}`, importance: 'high', created_at: now },
      { content: `Company: ${ceo.company_name || 'the company'}`, importance: 'high', created_at: now },
      { content: `Intelligence Level: ${intelligenceLevel}`, importance: 'high', created_at: now },
      { content: `Preferred channel: ${ceo.preferred_channel || 'app'}`, importance: 'medium', created_at: now },
    ],
    recent: [],
    ceo_preferences: {},
  };
}

const SALES_ROLES = [
  {
    name: 'Ava Bennett', role: 'Lead Generation Agent', initials: 'AB', color: '#3B82F6',
    personality: 'Curious. Fast. Reads intent before you finish typing.',
    bio: 'Ava engages every inbound lead within seconds, qualifies real intent from tire-kicking, and hands off warm prospects the moment they are ready.',
  },
  {
    name: 'Theo Marsh', role: 'Appointment Setter Agent', initials: 'TM', color: '#8B5CF6',
    personality: 'Organised. Persistent. Never lets a slot go unfilled.',
    bio: 'Theo turns qualified interest into booked time, offering slots, handling reschedules, and following up until the calendar is full.',
  },
  {
    name: 'Priya Shah', role: 'Closing & Follow-up Agent', initials: 'PS', color: '#10b981',
    personality: 'Direct. Patient. Closes without pressure.',
    bio: 'Priya handles objections, sends proposals, and follows up for as long as it takes, persistent without becoming pushy.',
  },
];

export async function provisionInitialWorkforce(ceoId, intelligenceLevel) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const ceo = assertResult(await supabase
    .from('ceos')
    .select('id, org_id, name, company_name, business_description, culture_tone, preferred_channel')
    .eq('id', ceoId)
    .single(), 'Load CEO for workforce provisioning');

  if (!ceo.org_id) throw new Error('CEO organization is missing');
  const firstName = ceo.name?.split(' ')[0] || 'CEO';
  const now = new Date().toISOString();
  const sharedMemory = memoryFor(ceo, intelligenceLevel);

  const sophia = assertResult(await supabase.from('employees').upsert({
    ceo_id: ceoId, org_id: ceo.org_id, employee_type: 'ea', name: 'Sophia', role: 'Executive Assistant',
    department: 'leadership', grade: 'executive', credential: 'StaffAI Distinguished', avatar_initials: 'SL',
    avatar_color: '#92660A', personality_short: 'Warm. Precise. Always one step ahead.',
    bio: `Sophia protects ${firstName}'s time, priorities, and company operations.`,
    specialisation: 'CEO operations, calendar management, Wallet oversight, Board Report delivery, private briefings',
    seat_fee_cents: 0, billing_type: 'seat', status: 'active', training_completed_at: now,
    training_progress_pct: 100, memory: sharedMemory,
  }, { onConflict: 'ceo_id,role' }).select().single(), 'Provision Sophia');

  assertResult(await supabase.from('employees').upsert({
    ceo_id: ceoId, org_id: ceo.org_id, employee_type: 'gm', name: 'Marcus Reid', role: 'General Manager',
    department: 'leadership', grade: 'senior', credential: 'StaffAI Accredited', avatar_initials: 'MR',
    avatar_color: '#1B3A6B', personality_short: 'Structured. Decisive. Quietly formidable.',
    bio: `Marcus coordinates performance and operations for ${ceo.company_name || 'the organisation'}.`,
    specialisation: 'Operations management, performance oversight, Board Reporting, team coordination',
    seat_fee_cents: 0, billing_type: 'seat', status: 'training', training_started_at: now,
    training_duration_seconds: 1800, training_progress_pct: 0, memory: sharedMemory,
  }, { onConflict: 'ceo_id,role' }), 'Provision Marcus');

  for (const member of SALES_ROLES) {
    const employee = assertResult(await supabase.from('employees').upsert({
      ceo_id: ceoId, org_id: ceo.org_id, employee_type: 'staff', name: member.name, role: member.role,
      department: 'sales', grade: 'junior', credential: 'StaffAI Certified', avatar_initials: member.initials,
      avatar_color: member.color, personality_short: member.personality, bio: member.bio,
      specialisation: member.role, seat_fee_cents: 0, billing_type: 'seat', status: 'active',
      training_completed_at: now, training_progress_pct: 100, memory: { core: [], recent: [], ceo_preferences: {} },
    }, { onConflict: 'ceo_id,role' }).select().single(), `Provision ${member.name}`);

    assertResult(await supabase.from('conversations').upsert({
      ceo_id: ceoId, employee_id: employee.id, channel: 'app', is_private: false,
    }, { onConflict: 'ceo_id,employee_id,channel' }), `Create ${member.name} conversation`);
  }

  const conversation = assertResult(await supabase.from('conversations').upsert({
    ceo_id: ceoId, employee_id: sophia.id, channel: 'app', is_private: false,
  }, { onConflict: 'ceo_id,employee_id,channel' }).select().single(), 'Create Sophia conversation');

  const existingMessage = assertResult(await supabase.from('messages')
    .select('content')
    .eq('idempotency_key', `workforce-first-contact:${ceoId}`)
    .maybeSingle(), 'Check existing first-contact message');

  let firstMessage = existingMessage?.content;
  try {
    if (!firstMessage) firstMessage = await callLLM({
      system: `You are Sophia, the Executive Assistant to ${ceo.name || 'the CEO'} at ${ceo.company_name || 'their company'}. Thank the CEO for the opportunity to serve. Briefly explain that Marcus is training and the sales team is active. Ask one simple onboarding question. Never claim a tool action occurred unless it did.`,
      messages: [{ role: 'user', content: '[SYSTEM: Send your first contact message now.]' }],
      level: intelligenceLevel,
      taskType: 'ea_first_contact',
      ceoId,
    });
  } catch (error) {
    console.error('[Workforce] First-contact LLM failed:', error.message);
    firstMessage = `Thank you for the opportunity to serve, ${firstName}. I’m Sophia, your Executive Assistant. Marcus is completing his company training, and Ava, Theo, and Priya are active. What is the first priority you would like me to organise?`;
  }

  assertResult(await supabase.from('messages').upsert({
    conversation_id: conversation.id, ceo_id: ceoId, role: 'employee', content: firstMessage,
    idempotency_key: `workforce-first-contact:${ceoId}`,
    metadata: { employee_id: sophia.id, employee_name: 'Sophia', task: 'first_contact' },
  }, { onConflict: 'idempotency_key' }), 'Create first-contact message');

  assertResult(await supabase.from('notifications').upsert({
    ceo_id: ceoId, from_employee_id: sophia.id, type: 'ea_message', title: 'Sophia has reached out',
    body: firstMessage.substring(0, 120) + (firstMessage.length > 120 ? '...' : ''),
    action_url: `/portal/dashboard/conversations/${conversation.id}`,
    idempotency_key: `workforce-first-contact:${ceoId}`,
  }, { onConflict: 'idempotency_key' }), 'Create first-contact notification');

  return { ceoId, orgId: ceo.org_id, employeeCount: 5, conversationId: conversation.id };
}
