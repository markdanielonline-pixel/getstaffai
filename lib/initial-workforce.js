import { withProvisioningOperation } from './provisioning-operation.js';

export const INITIAL_ROLES = [
  { type: 'ea', name: 'Sophia', title: 'Executive Assistant' },
  { type: 'gm', name: 'Marcus Reid', title: 'General Manager' },
];

export function operational(runtime) {
  const age = Date.now() - Date.parse(runtime?.readiness?.checked_at);
  return runtime?.readiness?.operational === true && age >= -5000 && age < 60000;
}

export async function runInitialWorkforce({ db, ceo, ensureTeam, dispatcher, hire, inspect, firstContact }) {
  if (!ceo.org_id) throw new Error('CEO organization is missing');
  return withProvisioningOperation(db, ceo.org_id, 'initial-workforce:v1', async op => {
    const team = await ensureTeam();
    if (team.external_id !== ceo.org_id || !operational(team)) throw new Error('Provision team is not operational; retry after runtime recovery');
    await op.save({ teamId: team.id, serverId: team.server_id });
    const dispatch = await dispatcher(team.id);
    if (dispatch.team_id !== team.id || dispatch.status !== 'active') throw new Error('Dispatcher is unavailable or belongs to another tenant');
    await op.save({ dispatcherId: dispatch.id });
    const employees = [];
    for (const role of INITIAL_ROLES) {
      const employee = await hire(role, employees[0]?.id || null);
      if (employee.org_id !== ceo.org_id) throw new Error('Factory returned a foreign employee');
      employees.push(employee);
      await op.save({ [role.type]: employee.id });
    }
    // Re-check both after GM installation/restarts; an earlier EA check is insufficient.
    const verified = [];
    for (const employee of employees) {
      const runtime = await inspect(employee.id);
      if (runtime.external_id !== employee.id || runtime.team_id !== team.id
        || runtime.server_id !== team.server_id || !operational(runtime)) {
        throw new Error('Initial workforce is incomplete or unhealthy; retry safely');
      }
      verified.push(runtime);
    }
    await firstContact(employees[0]);
    if (!verified.every(operational)) throw new Error('Readiness evidence expired; retry verification');
    await op.save({ verifiedAt: verified.map(r => r.readiness.checked_at).sort()[0] });
    return { ceoId: ceo.id, orgId: ceo.org_id, employeeCount: employees.length, ready: true };
  });
}
