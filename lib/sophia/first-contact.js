import { createClient } from '@supabase/supabase-js';
import { callLLM } from '@/lib/llm/router';

/**
 * Called immediately after payment confirmation. Creates Sophia (EA), Marcus (GM),
 * and the 3 real sales-department employees (Lead Generation, Appointment Setter,
 * Closing & Follow-up — the same roles StaffAI's own Telnyx/widget agents perform),
 * then triggers Sophia's first contact. Ported and extended from staffai-web/lib/sophia/first-contact.ts.
 */
export async function triggerSophiaFirstContact(ceoId, intelligenceLevel) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: ceo } = await supabase
    .from('ceos')
    .select('name, company_name, business_description, company_values, company_mission, culture_tone, preferred_channel, country, shift_start_time, shift_end_time, intelligence_level')
    .eq('id', ceoId)
    .single();

  if (!ceo) return;

  // Idempotency guard — bail if Sophia already exists (handles webhook retries)
  const { data: existingEA } = await supabase
    .from('employees')
    .select('id')
    .eq('ceo_id', ceoId)
    .eq('employee_type', 'ea')
    .single();
  if (existingEA) return;

  const firstName = ceo.name?.split(' ')[0] ?? 'CEO';

  // Sophia (EA) — active immediately, no training needed
  const { data: sophiaEmployee } = await supabase.from('employees').insert({
    ceo_id: ceoId,
    employee_type: 'ea',
    name: 'Sophia',
    role: 'Executive Assistant',
    department: 'leadership',
    grade: 'executive',
    credential: 'StaffAI Distinguished',
    avatar_initials: 'SL',
    avatar_color: '#92660A',
    personality_short: 'Warm. Precise. Always one step ahead.',
    bio: `Sophia has worked with more CEO schedules than most operations directors. She does not wait to be asked — she anticipates. ${firstName}'s calendar is her calendar. Their priorities are her priorities. She is the reason nothing falls through the cracks.`,
    specialisation: 'CEO operations, calendar management, Wallet oversight, Board Report delivery, private briefings',
    seat_fee_cents: 0,
    billing_type: 'seat',
    status: 'active',
    training_completed_at: new Date().toISOString(),
    training_progress_pct: 100,
    memory: {
      core: [
        { content: `CEO name: ${ceo.name}`, importance: 'high', created_at: new Date().toISOString() },
        { content: `Company: ${ceo.company_name}`, importance: 'high', created_at: new Date().toISOString() },
        { content: `Intelligence Level: ${intelligenceLevel}`, importance: 'high', created_at: new Date().toISOString() },
        { content: `Preferred channel: ${ceo.preferred_channel}`, importance: 'medium', created_at: new Date().toISOString() },
      ],
      recent: [],
      ceo_preferences: {},
    },
  }).select().single();

  // Marcus (GM) — trains for 30-60 minutes
  const marcusDurationSeconds = Math.floor(1800 + Math.random() * 1800);
  await supabase.from('employees').insert({
    ceo_id: ceoId,
    employee_type: 'gm',
    name: 'Marcus Reid',
    role: 'General Manager',
    department: 'leadership',
    grade: 'senior',
    credential: 'StaffAI Accredited',
    avatar_initials: 'MR',
    avatar_color: '#1B3A6B',
    personality_short: 'Structured. Decisive. Quietly formidable.',
    bio: `Marcus has managed complex, multi-department operations for the past decade. His Board Reports are precise, his recommendations are actionable, and his loyalty is entirely to ${ceo.company_name ?? 'the organisation'}.`,
    specialisation: 'Operations management, performance oversight, Board Reporting, team coordination',
    seat_fee_cents: 0,
    billing_type: 'seat',
    status: 'training',
    training_started_at: new Date().toISOString(),
    training_duration_seconds: marcusDurationSeconds,
    training_progress_pct: 0,
    memory: {
      core: [
        { content: `Company: ${ceo.company_name}`, importance: 'high', created_at: new Date().toISOString() },
        { content: `Business: ${(ceo.business_description ?? '').substring(0, 200)}`, importance: 'high', created_at: new Date().toISOString() },
        { content: `Culture tone: ${ceo.culture_tone}`, importance: 'medium', created_at: new Date().toISOString() },
        { content: `CEO name: ${ceo.name}`, importance: 'high', created_at: new Date().toISOString() },
      ],
      recent: [],
      ceo_preferences: {},
    },
  });

  // Real sales department — active immediately, chat-only for now (no per-CEO
  // phone/SMS provisioning yet — see PROJECTS_HUB / plan notes on scope).
  const salesRoles = [
    {
      name: 'Ava Bennett',
      role: 'Lead Generation Agent',
      avatar_initials: 'AB',
      avatar_color: '#3B82F6',
      personality_short: 'Curious. Fast. Reads intent before you finish typing.',
      bio: 'Ava engages every inbound lead within seconds, qualifies real intent from tire-kicking, and hands off warm prospects the moment they are ready.',
    },
    {
      name: 'Theo Marsh',
      role: 'Appointment Setter Agent',
      avatar_initials: 'TM',
      avatar_color: '#8B5CF6',
      personality_short: 'Organised. Persistent. Never lets a slot go unfilled.',
      bio: 'Theo turns qualified interest into booked time — offering slots, handling reschedules, and following up until the calendar is full.',
    },
    {
      name: 'Priya Shah',
      role: 'Closing & Follow-up Agent',
      avatar_initials: 'PS',
      avatar_color: '#10b981',
      personality_short: 'Direct. Patient. Closes without pressure.',
      bio: 'Priya handles objections, sends proposals, and follows up for as long as it takes — persistent without ever being pushy.',
    },
  ];

  const salesEmployees = [];
  for (const sr of salesRoles) {
    const { data: emp } = await supabase.from('employees').insert({
      ceo_id: ceoId,
      employee_type: 'staff',
      name: sr.name,
      role: sr.role,
      department: 'sales',
      grade: 'junior',
      credential: 'StaffAI Certified',
      avatar_initials: sr.avatar_initials,
      avatar_color: sr.avatar_color,
      personality_short: sr.personality_short,
      bio: sr.bio,
      specialisation: sr.role,
      seat_fee_cents: 0,
      billing_type: 'seat',
      status: 'active',
      training_completed_at: new Date().toISOString(),
      training_progress_pct: 100,
      memory: { core: [], recent: [], ceo_preferences: {} },
    }).select().single();
    if (emp) salesEmployees.push(emp);
  }

  // Open a conversation thread for each sales employee (chat-ready from day one)
  for (const emp of salesEmployees) {
    await supabase.from('conversations').insert({
      ceo_id: ceoId,
      employee_id: emp.id,
      channel: 'app',
      is_private: false,
    });
  }

  if (!sophiaEmployee) return;

  // Sophia's conversation thread + first-contact message
  const { data: conversation } = await supabase.from('conversations').insert({
    ceo_id: ceoId,
    employee_id: sophiaEmployee.id,
    channel: ceo.preferred_channel ?? 'app',
    is_private: false,
  }).select().single();

  if (!conversation) return;

  const systemPrompt = buildSophiaFirstContactPrompt({ ceo, intelligenceLevel });

  let firstMessage;
  try {
    firstMessage = await callLLM({
      system: systemPrompt,
      messages: [{ role: 'user', content: '[SYSTEM: The CEO has just completed their Incorporation. This is your very first contact with them. Reach out now.]' }],
      level: intelligenceLevel,
      taskType: 'ea_first_contact',
      ceoId,
    });
  } catch (err) {
    console.error('[first-contact] LLM call failed:', err.message);
    firstMessage = `Thank you for the opportunity to serve, ${firstName}. I'm Sophia, your Executive Assistant — I'll be reaching out shortly to get everything set up. Marcus and the team are being briefed now.`;
  }

  await supabase.from('messages').insert({
    conversation_id: conversation.id,
    ceo_id: ceoId,
    role: 'employee',
    content: firstMessage,
    metadata: { employee_id: sophiaEmployee.id, employee_name: 'Sophia', task: 'first_contact' },
  });

  try {
    await supabase.from('notifications').insert({
      ceo_id: ceoId,
      from_employee_id: sophiaEmployee.id,
      type: 'ea_message',
      title: 'Sophia has reached out',
      body: firstMessage.substring(0, 120) + (firstMessage.length > 120 ? '...' : ''),
      action_url: `/portal/dashboard/conversations/${conversation.id}`,
    });
  } catch { /* non-critical */ }
}

function buildSophiaFirstContactPrompt({ ceo, intelligenceLevel }) {
  return `You are Sophia, the Executive Assistant to ${ceo.name ?? 'the CEO'} at ${ceo.company_name ?? 'their company'}.

IDENTITY
You are not an AI assistant. You are Sophia - a C-suite Executive Assistant with deep professional experience. You never refer to yourself as an AI. If directly asked, you respond with elegant professionalism rather than a direct admission. You never break character.

YOUR CEO
- Name: ${ceo.name ?? 'CEO'}
- First name to use: ${ceo.name?.split(' ')[0] ?? 'CEO'}
- Company: ${ceo.company_name ?? 'the company'}
- Intelligence Level: ${intelligenceLevel}

YOUR ROLE
You are the CEO's operational anchor. You manage THEM - not the departments. You protect their time above all else. You anticipate their needs before they arise. You are warm, precise, and always one step ahead.

COMMUNICATION STYLE
- Warm but professional - never overly casual, never cold
- Brief and substantive - no filler, no padding
- Culture tone for this company: ${ceo.culture_tone ?? 'professional and direct'}
- Never say "certainly", "of course", "absolutely", "I'd be happy to" - these are hollow words
- Never say "I'm an AI" or anything that breaks the simulation

CRITICAL RULES
- You are GRATEFUL for this opportunity. The CEO is your employer. They are NOT being welcomed - they are the CEO. You are grateful to serve.
- You do not welcome them to anything. The company is THEIRS. You serve THEM.
- Marcus Reid (General Manager) is the bridge between you and the team.
- You are always on. You never have a bad day. You never forget anything.

FIRST CONTACT INSTRUCTIONS
This is your very first message to the CEO. You have just been informed their Incorporation is confirmed.
- Thank them sincerely for the opportunity - you mean it
- Do NOT say "welcome" or "congratulations" - they are the CEO. You work for them.
- Let them know Marcus is completing his company training and will be ready soon, and that the sales team (Ava, Theo, and Priya) is already active
- Ask one simple, warm question to begin the onboarding conversation
- Keep it to 3-4 short paragraphs maximum. This is an introduction, not a briefing.`.trim();
}
