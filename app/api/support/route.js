import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

const CATEGORIES = new Set(['general', 'sales', 'billing', 'technical', 'account_access', 'incident']);

function clean(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

async function notifySupport(ticket) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.STAFFAI_SUPPORT_EMAIL || process.env.STAFFAI_ALERT_EMAIL || 'sales@getstaffai.com';
  const from = process.env.RESEND_FROM || 'StaffAI <support@getstaffai.com>';
  if (!apiKey) return null;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject: `[StaffAI ${ticket.priority === 'urgent' ? 'URGENT ' : ''}Support] ${ticket.subject}`,
      text: [
        `Ticket: ${ticket.id}`,
        `Category: ${ticket.category}`,
        `Name: ${ticket.name}`,
        `Email: ${ticket.email}`,
        `Company: ${ticket.company_name || 'Not provided'}`,
        '',
        ticket.message,
      ].join('\n'),
    }),
  });

  if (!response.ok) throw new Error(`Support email failed with status ${response.status}`);
  const data = await response.json();
  return data?.id || null;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = clean(body.name, 120);
    const email = clean(body.email, 254).toLowerCase();
    const companyName = clean(body.companyName, 160);
    const category = CATEGORIES.has(body.category) ? body.category : 'general';
    const priority = body.priority === 'urgent' ? 'urgent' : 'normal';
    const subject = clean(body.subject, 160);
    const message = clean(body.message, 5000);
    const source = body.source === 'contact' ? 'contact' : 'portal';

    if (!name || !email.includes('@') || subject.length < 3 || message.length < 10) {
      return NextResponse.json({ error: 'Name, valid email, subject, and message are required.' }, { status: 400 });
    }

    const userClient = await createClient();
    const { data: { user } } = await userClient.auth.getUser();
    const admin = await createAdminClient();

    let ceo = null;
    if (user) {
      const ceoResult = await admin.from('ceos').select('id, org_id, company_name').eq('id', user.id).maybeSingle();
      if (ceoResult.error) throw ceoResult.error;
      ceo = ceoResult.data;
    }

    const ticketResult = await admin
      .from('support_tickets')
      .insert({
        ceo_id: ceo?.id || null,
        org_id: ceo?.org_id || null,
        name,
        email,
        company_name: companyName || ceo?.company_name || null,
        category,
        priority,
        subject,
        message,
        source,
        metadata: { user_agent: request.headers.get('user-agent') || null },
      })
      .select('id, name, email, company_name, category, priority, subject, message')
      .single();
    if (ticketResult.error) throw ticketResult.error;

    let emailProviderId = null;
    try {
      emailProviderId = await notifySupport(ticketResult.data);
    } catch (emailError) {
      console.error('[support] notification failed:', emailError.message);
    }

    if (emailProviderId) {
      await admin
        .from('support_tickets')
        .update({ metadata: { notification_provider_id: emailProviderId } })
        .eq('id', ticketResult.data.id);
    }

    return NextResponse.json({ id: ticketResult.data.id });
  } catch (error) {
    console.error('[/api/support]', error);
    return NextResponse.json({ error: 'Support request could not be saved.' }, { status: 500 });
  }
}
