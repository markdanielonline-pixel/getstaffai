import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

/**
 * Where a customer or a visitor tells us something is wrong.
 *
 * Two rules shape this endpoint.
 *
 * It is public and unauthenticated, because the moment you make someone sign in
 * to report a problem you stop hearing about the problems that stop people
 * signing in. That means it will be found by bots, so it is rate limited by
 * address and everything it accepts is bounded.
 *
 * Everything in a report is untrusted text. It is stored as evidence and shown
 * to a human, and it is never allowed to become an instruction to the
 * reliability engineer. The engineer may read a report to understand a symptom;
 * it may not be told what to do by one.
 */

const ALLOWED_ORIGINS = new Set(['https://getstaffai.com', 'https://www.getstaffai.com', 'https://app.getstaffai.com']);
const MAX_MESSAGE = 4000;
const ACKNOWLEDGE_DELAY_MS = 30 * 60 * 1000;

// Deliberately in-memory. A serverless instance holds this only for its own
// lifetime, which is enough to blunt a burst without adding a dependency, and
// the database constraints below are the real backstop.
const recent = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function corsHeaders(req) {
  const origin = req.headers.get('origin');
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export async function OPTIONS(req) {
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}

function rateLimited(key) {
  const now = Date.now();
  const hits = (recent.get(key) || []).filter(at => now - at < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 5000) recent.clear();
  return hits.length > MAX_PER_WINDOW;
}

export async function POST(req) {
  const headers = corsHeaders(req);

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body must be JSON' }, { status: 400, headers });
  }

  const message = String(body?.message || '').trim();
  if (!message) {
    return NextResponse.json({ error: 'Tell us what went wrong.' }, { status: 400, headers });
  }
  if (message.length > MAX_MESSAGE) {
    return NextResponse.json({ error: 'That is longer than we can take. Please keep it under 4000 characters.' }, { status: 400, headers });
  }

  const email = String(body?.email || '').trim().slice(0, 200);
  // Deliberately permissive: a reporter who mistypes their address should still
  // have their report land. The address only decides whether we can thank them.
  const emailUsable = email.includes('@') && email.length > 4;

  const address = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(address)) {
    return NextResponse.json({ error: 'You have sent several reports just now. Give it a few minutes.' }, { status: 429, headers });
  }

  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } });

  const { data, error } = await db.from('bug_reports').insert({
    email: emailUsable ? email : null,
    message,
    page_url: String(body?.pageUrl || '').slice(0, 500) || null,
    user_agent: (req.headers.get('user-agent') || '').slice(0, 300) || null,
    acknowledge_after: emailUsable ? new Date(Date.now() + ACKNOWLEDGE_DELAY_MS).toISOString() : null,
  }).select('id').single();

  if (error) {
    console.error('[report] could not record:', error.message);
    // Never make the reporter carry our failure. They did us a favour.
    return NextResponse.json({
      error: 'We could not save that, which is embarrassing given what you were reporting. Please email ' + (process.env.STAFFAI_SUPPORT_EMAIL || 'the team') + ' instead.',
    }, { status: 500, headers });
  }

  return NextResponse.json({
    received: true,
    reference: data.id.slice(0, 8).toUpperCase(),
    acknowledged: emailUsable,
  }, { headers });
}
