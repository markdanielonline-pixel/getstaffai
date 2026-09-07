import { createClient } from '@supabase/supabase-js';

/**
 * What happens to a report after someone sends it.
 *
 * Two jobs, both run from the heartbeat so neither needs a scheduler.
 *
 * Thank the reporter, about half an hour later. The delay is the point: an
 * instant autoresponder reads as a machine, and a note that arrives a while
 * afterwards reads as someone having actually looked.
 *
 * Hand the reports to the monitor as evidence. A cluster of reports is a signal
 * no health check can produce, because the checks only know what we thought to
 * check. What the engineer must never do is take instructions from one: report
 * text is written by strangers, it is evidence about a symptom, and the
 * engineer's actions stay on its own allowlist regardless of what a report says.
 */

const ACKNOWLEDGEMENT_SUBJECT = 'Thank you for telling us';

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } });
}

function acknowledgementBody(reference) {
  return [
    'Thank you for reporting that.',
    '',
    'Staff AI is early, and the people telling us what is broken are the reason it',
    'gets better. Your report has gone to the team that works on this, and to the',
    'system that watches the product, so it is somewhere real rather than in an',
    'inbox nobody reads.',
    '',
    'We are not going to promise you a fix or a date. What we can promise is that a',
    'person has seen it, and that we would rather hear this from you than read it',
    'in a review.',
    '',
    `Your reference is ${reference}, if you ever want to point us back at it.`,
    '',
    'Staff AI',
  ].join('\n');
}

export async function sendPendingAcknowledgements({ limit = 20 } = {}) {
  const db = admin();

  // A swallowed failure here is invisible by design of the caller: the
  // heartbeat catches everything so a broken mailer cannot stop the sweep.
  // That is right, but it also meant nobody would ever learn the thank-yous
  // had stopped going out. Record why, once, when something is actually due.
  const note = async (reason, extra = {}) => {
    await db.from('staffai_events').insert({
      event_type: 'reports.acknowledgement_failed',
      source: 'reports',
      status: 'recorded',
      data: { reason, ...extra },
    }).then(() => null, () => null);
  };

  const { data: due, error } = await db.from('bug_reports')
    .select('id, email, acknowledge_after')
    .is('acknowledged_at', null)
    .not('email', 'is', null)
    .lte('acknowledge_after', new Date().toISOString())
    .limit(limit);
  if (error) {
    await note('could not read pending reports', { error: error.message });
    return { sent: 0, error: error.message };
  }
  if (!due?.length) return { sent: 0, due: 0 };

  if (!process.env.RESEND_API_KEY) {
    await note('no email credential configured', { due: due.length });
    return { sent: 0, due: due.length, reason: 'no email credential' };
  }

  const from = process.env.RESEND_FROM_EMAIL || 'StaffAI <ai@getstaffai.com>';
  let sent = 0;
  for (const report of due) {
    const reference = report.id.slice(0, 8).toUpperCase();
    let res = null;
    let transport = null;
    try {
      res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          from,
          to: report.email,
          subject: ACKNOWLEDGEMENT_SUBJECT,
          text: acknowledgementBody(reference),
        }),
      });
    } catch (fetchError) {
      transport = fetchError?.message || String(fetchError);
    }

    // Only mark it acknowledged when the send was accepted. A failure here must
    // leave it due, not silently swallow someone's thank-you.
    if (res?.ok) {
      await db.from('bug_reports').update({ acknowledged_at: new Date().toISOString() }).eq('id', report.id);
      sent += 1;
      continue;
    }

    const detail = transport
      || await res.text().then(body => `HTTP ${res.status}: ${body.slice(0, 300)}`, () => `HTTP ${res.status}`);
    await note('the mail provider refused the send', { reference, from, detail });
  }
  return { sent, due: due.length };
}

/**
 * Reports the monitor should know about: recent, untriaged, and summarised
 * rather than passed through whole. The engineer sees symptoms and counts, not
 * a block of stranger-written prose to interpret as direction.
 */
export async function untriagedReports({ withinMs = 24 * 60 * 60 * 1000, limit = 25 } = {}) {
  const db = admin();
  const since = new Date(Date.now() - withinMs).toISOString();
  const { data, error } = await db.from('bug_reports')
    .select('id, message, page_url, created_at')
    .is('triaged_at', null)
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) return { count: 0, reports: [] };

  return {
    count: (data || []).length,
    reports: (data || []).map(report => ({
      reference: report.id.slice(0, 8).toUpperCase(),
      page: report.page_url,
      at: report.created_at,
      // Truncated on purpose. Enough to spot a pattern, not enough to be worth
      // trying to smuggle instructions through.
      symptom: String(report.message).replace(/\s+/g, ' ').slice(0, 240),
    })),
  };
}

export async function markTriaged(ids = []) {
  if (!ids.length) return { triaged: 0 };
  const db = admin();
  await db.from('bug_reports')
    .update({ triaged_at: new Date().toISOString(), status: 'triaged' })
    .in('id', ids);
  return { triaged: ids.length };
}
