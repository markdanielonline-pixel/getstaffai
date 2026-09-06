import { createClient } from '@supabase/supabase-js';

/**
 * The Staff AI health sweep.
 *
 * Nothing watched this product. An audit on 2026-09-05 found four of six tenant
 * runtimes dead while the control plane reported them running, a stale Stripe
 * webhook 404ing on every delivery, and finished customer work being dropped -
 * all discovered by looking, none by being told. This is what tells us instead.
 *
 * Every check answers one question a customer would notice, and each returns a
 * plain object rather than throwing, so one broken dependency cannot hide the
 * state of everything else.
 */

const SITE = 'https://www.getstaffai.com';
const APP = 'https://app.getstaffai.com';
const PROVISION = process.env.PROVISION_BASE_URL || 'https://provision.getstaffai.com';

// A tenant that has been provisioning for longer than this is not slow, it is
// stuck: the longest healthy run measured end to end is about five minutes.
const PROVISIONING_STALL_MS = 20 * 60 * 1000;
// A finished task that has not reached its conversation after this long means
// the durable-delivery path is not running.
const UNDELIVERED_STALL_MS = 30 * 60 * 1000;

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } });
}

async function timed(name, fn) {
  const started = Date.now();
  try {
    const result = await fn();
    return { name, ok: result.ok !== false, ms: Date.now() - started, ...result };
  } catch (error) {
    return { name, ok: false, ms: Date.now() - started, detail: error?.message || String(error) };
  }
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 15_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal, cache: 'no-store' });
  } finally {
    clearTimeout(timer);
  }
}

const checks = {
  // The marketing site is the front door, and the sales agent has to be on it.
  // It was absent for the whole of the pre-launch period without anyone noticing.
  async marketingSite() {
    const res = await fetchWithTimeout(SITE + '/');
    if (!res.ok) return { ok: false, detail: `getstaffai.com returned ${res.status}` };
    const body = await res.text();
    if (!body.includes('staffai-agent.js')) {
      return { ok: false, detail: 'getstaffai.com is up but the sales agent script is not on the page' };
    }
    return { ok: true };
  },

  async salesAgentScript() {
    const res = await fetchWithTimeout(SITE + '/staffai-agent.js');
    if (!res.ok) return { ok: false, detail: `sales agent script returned ${res.status}` };
    return { ok: true };
  },

  async application() {
    const res = await fetchWithTimeout(APP + '/api/health');
    if (!res.ok) return { ok: false, detail: `app health returned ${res.status}` };
    const body = await res.json();
    const database = body?.checks?.database?.status;
    if (body.status !== 'ok' || database !== 'ok') {
      return { ok: false, detail: `app health reports status=${body.status} database=${database}` };
    }
    return { ok: true };
  },

  // A degraded sales agent still answers, so a status code proves nothing. The
  // route sets `degraded` when it has no usable model credential.
  async salesAgent() {
    const res = await fetchWithTimeout(APP + '/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'What does the Company Office cost?' }] }),
    }, 45_000);
    if (!res.ok) return { ok: false, detail: `sales agent returned ${res.status}` };
    const body = await res.json();
    if (body.degraded) return { ok: false, detail: 'sales agent is answering in degraded mode - no usable model credential' };
    if (!body.text) return { ok: false, detail: 'sales agent returned an empty answer' };
    return { ok: true, model: body.model };
  },

  async provisionControlPlane() {
    const res = await fetchWithTimeout(PROVISION + '/api/integrations/staffai/teams/monitor-probe', {
      headers: { authorization: 'Bearer ' + (process.env.PROVISION_INTEGRATION_TOKEN || '') },
    });
    // 404 is the healthy answer here: authentication passed and the probe team
    // does not exist. 401 means our token is wrong, anything 5xx means the
    // control plane is unwell, and a network error means it is unreachable.
    if (res.status === 404) return { ok: true };
    if (res.status === 401) return { ok: false, detail: 'Provision rejected the Staff AI integration token' };
    if (res.status === 429) return { ok: false, detail: 'Provision is rate limiting Staff AI' };
    if (res.status >= 500) return { ok: false, detail: `Provision returned ${res.status}` };
    return { ok: true, detail: `unexpected but not failing: ${res.status}` };
  },

  // The one a customer feels first: their workforce is supposed to be ready and
  // one of their employees has no live runtime.
  async workforces() {
    const db = admin();
    const { data: allOrgs, error } = await db.from('organizations')
      .select('id, name, workforce_status, updated_at, provision_team_id');
    if (error) return { ok: false, detail: `could not read organizations: ${error.message}` };

    // Only organizations with a real owner can page anyone. The database also
    // holds abandoned acceptance tenants whose CEO never got past 'provisional',
    // and letting those fail the sweep would leave it permanently red - which is
    // how a genuine customer outage gets missed. They are surfaced as a warning
    // instead, in leftoverTenants below.
    const { data: owners, error: ownerError } = await db.from('ceos')
      .select('id, org_id, status, is_founder');
    if (ownerError) return { ok: false, detail: `could not read ceos: ${ownerError.message}` };
    const live = new Set((owners || [])
      .filter(c => c.org_id && (c.is_founder === true || c.status === 'active'))
      .map(c => c.org_id));
    const { data: members } = await db.from('organization_members').select('org_id, ceo_id');
    const entitledCeos = new Set((owners || [])
      .filter(c => c.is_founder === true || c.status === 'active').map(c => c.id));
    for (const m of members || []) if (entitledCeos.has(m.ceo_id)) live.add(m.org_id);
    const orgs = (allOrgs || []).filter(o => live.has(o.id));

    const { data: employees, error: employeeError } = await db.from('employees')
      .select('id, org_id, role, status, provision_runtime_status').neq('status', 'alumni');
    if (employeeError) return { ok: false, detail: `could not read employees: ${employeeError.message}` };

    const problems = [];
    for (const org of orgs || []) {
      const staff = (employees || []).filter(e => e.org_id === org.id);
      if (org.workforce_status === 'ready') {
        const broken = staff.filter(e => e.provision_runtime_status !== 'active');
        if (broken.length) {
          problems.push(`${org.name}: ready but ${broken.length} of ${staff.length} employees have no live runtime`);
        }
      }
      if (org.workforce_status === 'provisioning'
        && Date.now() - new Date(org.updated_at).getTime() > PROVISIONING_STALL_MS) {
        problems.push(`${org.name}: stuck provisioning since ${org.updated_at}`);
      }
    }

    // Staff AI's own columns are a cache. The authority on whether a tenant's
    // runtime is alive is Provision, which now reconciles itself against Docker
    // every five minutes. Without asking it, four organizations sat marked
    // `ready` with active employees while their containers were gone.
    const ready = (orgs || []).filter(o => o.workforce_status === 'ready' && o.provision_team_id);
    const runtimes = await Promise.all(ready.map(async org => {
      try {
        const res = await fetchWithTimeout(
          `${PROVISION}/api/integrations/staffai/teams/${encodeURIComponent(org.id)}`,
          { headers: { authorization: 'Bearer ' + (process.env.PROVISION_INTEGRATION_TOKEN || '') } },
          10_000,
        );
        if (res.status === 404) return `${org.name}: Provision has no team for this organization`;
        if (!res.ok) return null; // provisionControlPlane covers control-plane faults
        const payload = await res.json();
        if (payload.runtime_status !== 'running') {
          return `${org.name}: runtime is ${payload.runtime_status}`;
        }
        return null;
      } catch {
        return null;
      }
    }));
    problems.push(...runtimes.filter(Boolean));

    return problems.length ? { ok: false, detail: problems.join('; ') } : { ok: true, organizations: orgs.length };
  },

  // Work that finished and never reached the customer. This is the canary for
  // the delivery gap that dropped five completed research tasks.
  async taskDelivery() {
    const db = admin();
    const cutoff = new Date(Date.now() - UNDELIVERED_STALL_MS).toISOString();
    const { data, error } = await db.from('employee_tasks')
      .select('id, org_id, provision_status, created_at, metadata')
      .is('delivered_at', null)
      .not('provision_task_id', 'is', null)
      .lt('created_at', cutoff)
      .in('provision_status', ['done', 'failed'])
      .limit(100);
    if (error) return { ok: false, detail: `could not read employee_tasks: ${error.message}` };
    // A task with no conversation recorded was never destined for one - the
    // worker path dispatches those, and 29 such rows predate conversation ids
    // being recorded at all. Counting them would make this permanently red and
    // useless as a regression signal.
    const undelivered = (data || []).filter(task => task.metadata?.conversation_id);
    if (undelivered.length) {
      return { ok: false, detail: `${undelivered.length} finished task(s) never reached their conversation` };
    }
    return { ok: true };
  },
};

/**
 * Conditions that are real and worth knowing, but that no amount of automated
 * retrying will clear because they are waiting on a decision. These are
 * reported and mailed when they change, and they deliberately do not make the
 * sweep fail - a monitor that is permanently red teaches everyone to ignore it.
 */
const warnings = {
  // Acceptance tenants left behind by earlier runs. Dead, unowned, and safe to
  // remove, but removal destroys containers and volumes so it stays a decision.
  async leftoverTenants() {
    const db = admin();
    const { data: orgs } = await db.from('organizations').select('id, name, workforce_status');
    const { data: owners } = await db.from('ceos').select('id, org_id, status, is_founder');
    const { data: members } = await db.from('organization_members').select('org_id, ceo_id');
    const entitled = new Set((owners || [])
      .filter(c => c.is_founder === true || c.status === 'active').map(c => c.id));
    const owned = new Set([
      ...(owners || []).filter(c => c.is_founder === true || c.status === 'active').map(c => c.org_id),
      ...(members || []).filter(m => entitled.has(m.ceo_id)).map(m => m.org_id),
    ].filter(Boolean));
    const orphans = (orgs || []).filter(o => !owned.has(o.id));
    if (orphans.length) {
      return { ok: false, detail: `${orphans.length} unowned test organization(s) still hold records: ${orphans.map(o => o.name).join(', ')}` };
    }
    return { ok: true };
  },
  async strandedWorkforces() {
    const db = admin();
    const { data, error } = await db.from('organizations')
      .select('name, workforce_status, provision_team_id')
      .eq('workforce_status', 'retryable');
    if (error) return { ok: false, detail: `could not read organizations: ${error.message}` };
    if (data?.length) {
      return { ok: false, detail: `${data.length} organization(s) need re-provisioning: ${data.map(o => o.name).join(', ')}` };
    }
    return { ok: true };
  },
};

export async function runHealthSweep() {
  const [results, warningResults] = await Promise.all([
    Promise.all(Object.entries(checks).map(([name, fn]) => timed(name, fn))),
    Promise.all(Object.entries(warnings).map(([name, fn]) => timed(name, fn))),
  ]);
  const failing = results.filter(r => !r.ok);
  const warned = warningResults.filter(r => !r.ok);
  return {
    ok: failing.length === 0,
    checkedAt: new Date().toISOString(),
    failing: failing.map(f => f.name),
    warnings: warned.map(w => w.name),
    results,
    warningResults,
  };
}

/**
 * Alert only when the set of failing checks changes. A five-minute sweep that
 * mailed on every failing run would be ignored inside an hour, which is the
 * same as having no alerting at all.
 */
export async function recordAndAlert(sweep) {
  const db = admin();
  const signature = [...sweep.failing, ...sweep.warnings.map(w => 'warn:' + w)].sort().join(',');

  const { data: previous } = await db.from('staffai_events')
    .select('data')
    .eq('event_type', 'monitor.sweep')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const previousSignature = previous?.data?.signature ?? null;
  const changed = previousSignature !== signature;

  // Checked, because this insert failing silently is exactly what broke change
  // detection: org_id was NOT NULL, every system event was rejected, and the
  // previous-signature lookup therefore found nothing on every single run.
  const { error: recordError } = await db.from('staffai_events').insert({
    event_type: 'monitor.sweep',
    source: 'monitor',
    status: sweep.ok ? 'ok' : 'failing',
    data: { signature, failing: sweep.failing, warnings: sweep.warnings, results: sweep.results },
  });
  if (recordError) console.error('[monitor] could not record the sweep:', recordError.message);

  if (!changed) return { alerted: false, changed: false };

  const recipient = process.env.STAFFAI_SUPPORT_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;
  if (!recipient || !resendKey) return { alerted: false, changed: true, detail: 'no alert destination configured' };

  const recovered = sweep.ok && previousSignature;
  const subject = sweep.failing.length
    ? `Staff AI: ${sweep.failing.join(', ')}`
    : recovered
      ? 'Staff AI recovered'
      : `Staff AI: ${sweep.warnings.join(', ')}`;
  const lines = [...sweep.results, ...sweep.warningResults]
    .map(r => `${r.ok ? 'OK  ' : (sweep.results.includes(r) ? 'FAIL' : 'WARN')}  ${r.name}${r.detail ? ' - ' + r.detail : ''} (${r.ms}ms)`)
    .join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${resendKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || 'StaffAI <ai@getstaffai.com>',
      to: recipient,
      subject,
      text: `${sweep.checkedAt}\n\n${lines}\n`,
    }),
  });

  return { alerted: res.ok, changed: true, status: res.status };
}
