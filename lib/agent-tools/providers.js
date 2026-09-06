/**
 * Integrations that are built but not yet paid for.
 *
 * Each one is complete and each one is dark until its key exists in the
 * environment. Nothing here needs a deploy to switch on: adding the key makes
 * the capability appear, the roles that depend on it become sellable, and the
 * employees that need it are told they have it. Removing the key makes all of
 * that go away again, which is the behaviour you want when a vendor account
 * lapses.
 *
 * This is the shape agreed on 2026-09-06: build now, buy when a customer asks.
 */

// --- Outscraper: volume lead lists ------------------------------------------
// The Lead Generation Specialist researches at quality and low volume by
// reading real pages. This is the other half: hundreds of businesses from
// Google Maps in one call, with contacts extracted. Lower quality per record,
// which is why verification below exists.

export function outscraperConfigured() {
  return Boolean(process.env.OUTSCRAPER_API_KEY);
}

export async function outscraperSearch({ query, limit = 100 }) {
  const key = process.env.OUTSCRAPER_API_KEY;
  if (!key) throw new Error('OUTSCRAPER_API_KEY is not configured');
  if (!query?.trim()) throw new Error('query is required, for example "plumbers, Brooklyn, NY"');

  const capped = Math.min(Math.max(Number(limit) || 100, 1), 500);
  const url = new URL('https://api.app.outscraper.com/maps/search-v2');
  url.searchParams.set('query', query.trim());
  url.searchParams.set('limit', String(capped));
  url.searchParams.set('async', 'false');
  url.searchParams.set('extractContacts', 'true');

  const res = await fetch(url, { headers: { 'X-API-KEY': key } });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Outscraper returned ${res.status}: ${body?.message || 'unknown error'}`);

  // The API nests one result array per query.
  const rows = Array.isArray(body?.data?.[0]) ? body.data[0] : (body?.data || []);
  return rows.map(row => ({
    name: row.name || null,
    website: row.site || row.website || null,
    phone: row.phone || null,
    email: row.email_1 || (Array.isArray(row.emails) ? row.emails[0] : null) || null,
    address: row.full_address || row.address || null,
    category: row.category || row.type || null,
    rating: row.rating ?? null,
    reviews: row.reviews ?? null,
  })).filter(row => row.name);
}

// --- BillionVerify: email verification --------------------------------------
// Scraped addresses bounce, and bounces are what burn a sending domain. Nothing
// goes into an outreach campaign without passing through here.

export function verificationConfigured() {
  return Boolean(process.env.BILLIONVERIFY_API_KEY);
}

export async function verifyEmail(email) {
  const key = process.env.BILLIONVERIFY_API_KEY;
  if (!key) throw new Error('BILLIONVERIFY_API_KEY is not configured');
  if (!email?.includes('@')) throw new Error('a valid email address is required');

  const url = new URL(process.env.BILLIONVERIFY_URL || 'https://api.billionverify.com/v1/verify');
  url.searchParams.set('email', email.trim());
  url.searchParams.set('key', key);

  const res = await fetch(url);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`BillionVerify returned ${res.status}`);

  // Providers disagree on vocabulary, so normalise to a decision rather than
  // making every caller interpret a vendor's status string.
  const status = String(body.status || body.result || '').toLowerCase();
  const deliverable = ['valid', 'deliverable', 'ok'].includes(status);
  const risky = ['catch_all', 'catchall', 'accept_all', 'unknown', 'risky'].includes(status);
  return { email, status: status || 'unknown', deliverable, risky, sendable: deliverable, raw: body };
}

export async function verifyEmails(emails = []) {
  const results = [];
  for (const email of emails.slice(0, 200)) {
    try {
      results.push(await verifyEmail(email));
    } catch (error) {
      results.push({ email, status: 'error', deliverable: false, risky: false, sendable: false, error: error.message });
    }
  }
  return results;
}

// --- Elastic Email: bulk sending, one sub-account per customer ---------------
// Resend stays for product mail: receipts, password resets, notifications. If a
// customer's campaign damages a sending reputation it must damage only theirs,
// which is what the sub-account gives us, and it must never be able to take
// down password resets for everybody.

export function bulkSendingConfigured() {
  return Boolean(process.env.ELASTIC_EMAIL_API_KEY);
}

const ELASTIC_BASE = process.env.ELASTIC_EMAIL_BASE_URL || 'https://api.elasticemail.com/v4';

async function elastic(path, options = {}) {
  const key = process.env.ELASTIC_EMAIL_API_KEY;
  if (!key) throw new Error('ELASTIC_EMAIL_API_KEY is not configured');
  const res = await fetch(ELASTIC_BASE + path, {
    ...options,
    headers: { 'X-ElasticEmail-ApiKey': key, 'content-type': 'application/json', ...(options.headers || {}) },
  });
  const text = await res.text();
  let body;
  try { body = text ? JSON.parse(text) : {}; } catch { body = { raw: text.slice(0, 300) }; }
  if (!res.ok) throw new Error(`Elastic Email ${path} returned ${res.status}: ${body?.Error || body?.raw || ''}`);
  return body;
}

export async function sendBulkEmail({ to, subject, body, fromEmail, fromName }) {
  if (!to?.length) throw new Error('at least one recipient is required');
  if (!subject || !body) throw new Error('subject and body are required');
  const sender = fromEmail || process.env.ELASTIC_EMAIL_FROM;
  if (!sender) throw new Error('no sending address configured for this organization');

  return elastic('/emails', {
    method: 'POST',
    body: JSON.stringify({
      Recipients: to.map(address => ({ Email: address })),
      Content: {
        From: fromName ? `${fromName} <${sender}>` : sender,
        Subject: subject,
        Body: [{ ContentType: 'PlainText', Content: body }],
      },
    }),
  });
}

/**
 * What is switched on right now, and what each missing key would unlock. The
 * capability model reads this, so a purchased key changes what the product
 * sells without anyone editing a list of roles.
 */
export function providerStatus() {
  return {
    lead_volume: { configured: outscraperConfigured(), env: 'OUTSCRAPER_API_KEY', unlocks: 'Lead lists at volume from Google Maps.' },
    email_verification: { configured: verificationConfigured(), env: 'BILLIONVERIFY_API_KEY', unlocks: 'Verifying addresses before an outreach campaign sends to them.' },
    bulk_sending: { configured: bulkSendingConfigured(), env: 'ELASTIC_EMAIL_API_KEY', unlocks: 'Campaign sending isolated per customer, kept away from product email.' },
  };
}
