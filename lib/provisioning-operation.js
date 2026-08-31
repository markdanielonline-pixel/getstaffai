import { randomUUID } from 'node:crypto';

export function checked(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`);
  return result.data;
}

// Short DB leases survive worker crashes. Every checkpoint is owner/expiry fenced.
// External resources use durable employee UUIDs, never lease IDs, as identity keys.
export async function withProvisioningOperation(db, orgId, key, work) {
  const owner = randomUUID();
  const args = { p_org: orgId, p_key: key, p_owner: owner };
  const claim = checked(await db.rpc('claim_provisioning_operation', args), 'Claim provisioning');
  if (claim.busy) throw Object.assign(new Error('Provisioning already in progress; retry shortly'), { retryable: true });
  let state = claim.data || {};
  let lost = false;
  // Heartbeats serialize with checkpoints so an older snapshot cannot overwrite progress.
  let pending = Promise.resolve();
  function save(patch = {}, status = 'running', error = null) {
    pending = pending.then(async () => {
      if (lost) throw new Error('Provisioning lease lost');
      state = { ...state, ...patch };
      try {
        checked(await db.rpc('save_provisioning_operation', { ...args, p_data: state, p_state: status, p_error: error }), 'Checkpoint provisioning');
      } catch (failure) { lost = true; throw failure; }
    });
    return pending;
  }
  const timer = setInterval(() => { save().catch(() => {}); }, 20_000);
  try {
    const result = await work({
      get data() { return state; }, save,
      async updateEmployee(patch) {
        await save();
        return checked(await db.rpc('update_provisioning_employee', { ...args, p_patch: patch }), 'Update employee readiness');
      },
      async reserve(employee, existingId = null) {
        await save();
        const row = checked(await db.rpc('reserve_provisioning_employee', { ...args, p_employee: employee, p_existing: existingId }), 'Reserve employee');
        await save({ employeeId: row.id });
        return row;
      },
    });
    clearInterval(timer);
    await save({}, 'completed');
    return result;
  } catch (error) {
    clearInterval(timer);
    if (!lost) await save({}, 'retryable', error.message).catch(() => {});
    throw Object.assign(error, { retryable: true });
  }
}
