import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { createClient } from '@supabase/supabase-js';
import { reconcileConversationTasks } from '../provision';

/**
 * The Staff AI reliability engineer.
 *
 * The health sweep detects. This diagnoses, and where the fix is small and
 * reversible, applies it. It exists because the alternative is that every
 * failure waits for a human to wake up, which is exactly the state that let
 * four tenant runtimes sit dead while the product reported them healthy.
 *
 * Two rules shape everything here.
 *
 * It may only do things on the allowlist below. The model chooses *which*
 * allowlisted action to take and against which organization; it cannot invent
 * an action, and an action it names that is not on the list is refused by code,
 * not by prompt. Nothing here deletes, deploys, rotates a credential, touches
 * billing or DNS, or reaches a customer.
 *
 * It may act on one organization per action and a small number of actions per
 * incident. A remediation loop that can act broadly turns one bad diagnosis
 * into an outage.
 */

const MODEL = process.env.RELIABILITY_MODEL || 'deepseek/deepseek-v4-pro';
const MAX_ACTIONS_PER_INCIDENT = 3;

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } });
}

function model() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;
  const openrouter = createOpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    headers: { 'HTTP-Referer': 'https://getstaffai.com', 'X-Title': 'Staff AI Reliability Engineer' },
  });
  return openrouter(MODEL);
}

/**
 * Every action the engineer may take. Each is reversible, scoped to one
 * organization, and does something a human would do by hand from the product.
 */
const ACTIONS = {
  redeliver_tasks: {
    describe: 'Deliver any finished task whose result never reached its conversation, for one organization.',
    async run({ orgId }) {
      if (!orgId) throw new Error('orgId is required');
      const result = await reconcileConversationTasks(orgId, { limit: 25 });
      return { delivered: result.delivered, considered: result.considered };
    },
  },

  resume_provisioning: {
    describe: 'Resume a workforce setup that stalled, for one organization. Refuses if a run is already in flight.',
    async run({ orgId }) {
      if (!orgId) throw new Error('orgId is required');
      const db = admin();
      const { data: operation } = await db.from('provisioning_operations')
        .select('state').eq('org_id', orgId).eq('operation_key', 'initial-workforce:v1').maybeSingle();
      if (operation?.state === 'running') {
        return { resumed: false, reason: 'a provisioning run is already in flight' };
      }
      // Clearing the terminal state is what lets the product's own resume path
      // pick it up on the next dashboard load or retry, rather than this code
      // re-implementing provisioning.
      const { error } = await db.from('organizations')
        .update({ workforce_status: 'retryable', workforce_error: null }).eq('id', orgId);
      if (error) throw new Error(error.message);
      return { resumed: true, note: 'marked retryable so the workforce setup path can pick it up' };
    },
  },

  escalate: {
    describe: 'Take no automated action. Write the incident up for a human. Always available, and the right answer when unsure.',
    async run({ orgId, summary }) {
      return { escalated: true, orgId: orgId || null, summary: summary || null };
    },
  },
};

const SYSTEM = `You are Staff AI's reliability engineer. A health sweep has failed and you decide what to do about it.

You are not a chat assistant. You produce a diagnosis and a short list of actions, and you are held to being right rather than being helpful.

THE ONLY ACTIONS THAT EXIST:
${Object.entries(ACTIONS).map(([name, a]) => `- ${name}: ${a.describe}`).join('\n')}

RULES:
- Choose "escalate" whenever you are not confident, whenever the cause looks like infrastructure rather than data, and whenever the failing check is about the marketing site, the application itself, the sales agent, or the Provision control plane. None of those can be fixed by the actions above, so acting would be theatre.
- Only "workforces" and "taskDelivery" failures have a remediation available.
- Name a specific organization id for every action except escalate. If you cannot identify one from the evidence, escalate instead.
- Never propose more than ${MAX_ACTIONS_PER_INCIDENT} actions.
- Your diagnosis must cite the specific evidence you used. Do not speculate about causes the evidence does not support.

Answer as strict JSON and nothing else:
{"diagnosis": "...", "confidence": "high|medium|low", "actions": [{"action": "...", "orgId": "...", "why": "..."}]}`;

async function gatherEvidence(sweep) {
  const db = admin();
  const [orgs, recentEvents, undelivered] = await Promise.all([
    db.from('organizations').select('id, name, workforce_status, updated_at').then(r => r.data || []),
    db.from('staffai_events').select('event_type, status, created_at, data')
      .order('created_at', { ascending: false }).limit(25).then(r => r.data || []),
    db.from('employee_tasks').select('id, org_id, provision_status, created_at, metadata')
      .is('delivered_at', null).not('provision_task_id', 'is', null).limit(25).then(r => r.data || []),
  ]);

  return {
    failing: sweep.results.filter(r => !r.ok),
    warnings: sweep.warningResults?.filter(r => !r.ok) || [],
    organizations: orgs.map(o => ({ id: o.id, name: o.name, workforce_status: o.workforce_status, updated_at: o.updated_at })),
    undeliveredTasks: undelivered
      .filter(t => t.metadata?.conversation_id)
      .map(t => ({ id: t.id, org_id: t.org_id, status: t.provision_status, created_at: t.created_at })),
    recentEvents: recentEvents.map(e => ({ type: e.event_type, status: e.status, at: e.created_at })),
  };
}

export async function investigate(sweep) {
  const llm = model();
  if (!llm) {
    return { ok: false, reason: 'OPENROUTER_API_KEY is not configured', diagnosis: null, actions: [] };
  }

  const evidence = await gatherEvidence(sweep);
  const { text } = await generateText({
    model: llm,
    system: SYSTEM,
    prompt: `Failing checks and supporting evidence:\n\n${JSON.stringify(evidence, null, 2)}`,
    temperature: 0,
  });

  let parsed;
  try {
    // Models wrap JSON in prose or fences often enough that being strict here
    // would make the engineer fail for a formatting reason rather than a real one.
    const match = text.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(match ? match[0] : text);
  } catch {
    return { ok: false, reason: 'the engineer did not return usable JSON', raw: text.slice(0, 600), actions: [] };
  }

  const actions = Array.isArray(parsed.actions) ? parsed.actions.slice(0, MAX_ACTIONS_PER_INCIDENT) : [];
  return { ok: true, diagnosis: parsed.diagnosis, confidence: parsed.confidence, actions, model: MODEL };
}

export async function applyActions(actions, { dryRun = false } = {}) {
  const applied = [];
  for (const proposed of actions) {
    const definition = ACTIONS[proposed.action];
    if (!definition) {
      applied.push({ ...proposed, executed: false, error: `"${proposed.action}" is not an allowed action` });
      continue;
    }
    if (dryRun) {
      applied.push({ ...proposed, executed: false, dryRun: true });
      continue;
    }
    try {
      const result = await definition.run(proposed);
      applied.push({ ...proposed, executed: true, result });
    } catch (error) {
      applied.push({ ...proposed, executed: false, error: error?.message || String(error) });
    }
  }
  return applied;
}

/**
 * One incident, start to finish: diagnose, act within the allowlist, write it
 * down, and tell a human what was decided and what was done.
 */
export async function handleIncident(sweep, { dryRun = false } = {}) {
  const investigation = await investigate(sweep);
  const actions = investigation.ok ? await applyActions(investigation.actions, { dryRun }) : [];

  const db = admin();
  const incident = {
    event_type: 'reliability.incident',
    source: 'reliability-engineer',
    status: investigation.ok ? 'handled' : 'failed',
    data: {
      failing: sweep.failing,
      diagnosis: investigation.diagnosis || investigation.reason,
      confidence: investigation.confidence || null,
      model: investigation.model || MODEL,
      actions,
      dryRun,
    },
  };
  const { error: incidentError } = await db.from('staffai_events').insert(incident);
  if (incidentError) console.error('[reliability] could not record the incident:', incidentError.message);

  if (process.env.RESEND_API_KEY && process.env.STAFFAI_SUPPORT_EMAIL) {
    const lines = [
      `Failing: ${sweep.failing.join(', ') || 'none'}`,
      '',
      `Diagnosis (${investigation.confidence || 'n/a'} confidence, ${investigation.model || MODEL}):`,
      investigation.diagnosis || investigation.reason || 'none',
      '',
      'Actions:',
      ...(actions.length
        ? actions.map(a => `- ${a.action}${a.orgId ? ` on ${a.orgId}` : ''}: ${a.executed ? 'done' : (a.dryRun ? 'proposed only' : 'failed - ' + a.error)}${a.why ? ` (${a.why})` : ''}`)
        : ['- none']),
    ].join('\n');

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'StaffAI <ai@getstaffai.com>',
        to: process.env.STAFFAI_SUPPORT_EMAIL,
        subject: `Staff AI incident: ${sweep.failing.join(', ') || 'investigated'}`,
        text: lines,
      }),
    }).catch(() => { /* the incident row is the durable record */ });
  }

  return { investigation, actions };
}

export const ALLOWED_ACTIONS = Object.keys(ACTIONS);
