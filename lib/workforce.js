import { createClient } from '@supabase/supabase-js';
import { instantiateEmployee } from './factory';
import {
  provisionTeamRuntime, provisionDispatcher, syncProvisionAgent, syncProvisionTeam,
  awaitProvisionAgentOperational, awaitProvisionTeamOperational,
} from './provision';
import { checked } from './provisioning-operation';
import { runInitialWorkforce, operational } from './initial-workforce';

export async function inspectInitialWorkforce(orgId) {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  let op;
  try {
    op = checked(await db.from('provisioning_operations').select('state,data,error')
      .eq('org_id', orgId).eq('operation_key', 'initial-workforce:v1').maybeSingle(), 'Read initial workforce');
    if (!op || op.state !== 'completed' || !op.data.ea || !op.data.gm) return { ready: false, status: op?.state || 'not_ready' };
    const team = await syncProvisionTeam(orgId);
    if (!operational(team)) throw new Error(`Team runtime not operational (status=${team?.status ?? 'none'}, server=${team?.server_id ?? 'none'})`);
    if (team.id !== op.data.teamId) throw new Error(`Team identity mismatch (live=${team.id}, recorded=${op.data.teamId})`);
    const verified = [team];
    for (const id of [op.data.ea, op.data.gm]) {
      const employee = checked(await db.from('employees').select('status').eq('id', id).eq('org_id', orgId).single(), 'Read employee lifecycle');
      if (employee.status !== 'active') throw new Error(`Employee ${id} is not operational (status=${employee.status})`);
      const agent = await syncProvisionAgent(id, orgId);
      if (!operational(agent)) throw new Error(`Agent ${id} not operational (status=${agent?.status ?? 'none'})`);
      if (agent.server_id !== team.server_id) throw new Error(`Agent ${id} server mismatch (agent=${agent.server_id}, team=${team.server_id})`);
      verified.push(agent);
    }
    if (!verified.every(operational)) throw new Error('Readiness evidence expired');
    return { ready: true, status: 'ready' };
  } catch (reason) {
    // Server-side only: readiness failures are otherwise silent, making them
    // undiagnosable without host access. Never surfaced to the client.
    console.error(`[workforce.readiness] org=${orgId} not ready:`, reason?.message || reason);
    if (op?.state === 'completed') {
      // rpc() returns a thenable builder without .catch(); guard with try/catch so a
      // failed invalidation can never mask the readiness result with a 500.
      try {
        await db.rpc('invalidate_workforce_readiness', { p_org: orgId, p_verified_at: op.data.verifiedAt });
      } catch { /* readiness invalidation is best-effort */ }
    }
    return { ready: false, status: 'retryable' };
  }
}

export async function provisionInitialWorkforce(ceoId, intelligenceLevel) {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } });
  const ceo = checked(await db.from('ceos').select('id,org_id,name,company_name,business_description').eq('id', ceoId).single(), 'Load CEO');
  const organization = checked(await db.from('organizations').select('*').eq('id', ceo.org_id).single(), 'Load organization');
  return runInitialWorkforce({
    db, ceo,
    // Provision the team, then wait for its container/daemon/gateway to come up
    // rather than failing the whole run on the first sample. provisionTeamRuntime
    // stays the only place a successor team may be adopted; the wait re-reads
    // through the strict verifier, which never adopts.
    ensureTeam: async () => {
      const created = await provisionTeamRuntime(organization);
      return operational(created) ? created : awaitProvisionTeamOperational(ceo.org_id);
    },
    dispatcher: provisionDispatcher,
    hire: (role, managerId) => instantiateEmployee({
      orgId: ceo.org_id, idempotencyKey: `initial:${role.type}:v1`,
      managerId: role.type === 'gm' ? managerId : null,
      persona: { ceo_id: ceo.id, employee_type: role.type, name: role.name },
      roleTemplate: {
        title_default: role.title, required_tools: [], default_kpis: [],
        base_prompt_template: `You are ${role.name}, ${role.title} for ${ceo.company_name || organization.name}.
Staff AI owns approvals and autonomy. Follow its authorized instructions; never claim an unperformed action.
Company context: ${JSON.stringify({ description: ceo.business_description, intelligenceLevel })}`,
      },
      onboardingAnswers: { company_name: ceo.company_name, intelligenceLevel },
    }),
    inspect: id => awaitProvisionAgentOperational(id, ceo.org_id),
    firstContact: async employee => {
      const conversation = checked(await db.from('conversations').upsert({
        ceo_id: ceo.id, employee_id: employee.id, channel: 'app', is_private: false,
      }, { onConflict: 'ceo_id,employee_id,channel' }).select().single(), 'Create EA conversation');
      const content = `Hello ${ceo.name?.split(' ')[0] || 'CEO'}. I’m Sophia, your Executive Assistant. Marcus and I have completed our runtime setup. What is your first company priority?`;
      const key = `workforce-first-contact:${ceo.org_id}:v1`;
      checked(await db.from('messages').upsert({
        conversation_id: conversation.id, ceo_id: ceo.id, role: 'employee', content,
        idempotency_key: key, metadata: { employee_id: employee.id, task: 'first_contact' },
      }, { onConflict: 'idempotency_key', ignoreDuplicates: true }), 'Create first contact');
      checked(await db.from('notifications').upsert({
        ceo_id: ceo.id, from_employee_id: employee.id, type: 'ea_message', title: 'Your initial workforce is ready',
        body: content, action_url: `/portal/dashboard/conversations/${conversation.id}`, idempotency_key: key,
      }, { onConflict: 'idempotency_key', ignoreDuplicates: true }), 'Create first-contact notification');
    },
  });
}
