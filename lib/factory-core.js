import { withProvisioningOperation } from './provisioning-operation.js';
import { operational } from './initial-workforce.js';

// The factory transaction; adapters stay in factory.js. No task execution here.
export async function runEmployeeFactory({ db, orgId, key, employeeInput, existingId, prepare, provision, inspect }) {
  return withProvisioningOperation(db, orgId, `hire:${key}`, async operation => {
    const employee = await operation.reserve(employeeInput, existingId);
    try {
      await operation.updateEmployee({ status: 'training', provision_runtime_status: 'provisioning', provision_error: null });
      if (!operation.data.prepared) {
        await prepare(employee);
        await operation.save({ prepared: true });
      }
      // Provision's upsert is keyed by this durable employee UUID, including after ambiguous HTTP failures.
      await operation.save();
      await provision(employee);
      await operation.save({ provisionRequested: true });
      const runtime = await inspect(employee);
      if (runtime.external_id !== employee.id || !operational(runtime)) {
        throw new Error('Provision employee is not operational; retry after runtime recovery');
      }
      const result = await operation.updateEmployee({ status: 'active', provision_runtime_status: 'active', provision_error: null });
      await operation.save({ verifiedAt: runtime.readiness.checked_at });
      return result;
    } catch (error) {
      await operation.updateEmployee({ status: 'training', provision_runtime_status: 'error', provision_error: error.message }).catch(() => {});
      throw error;
    }
  });
}
