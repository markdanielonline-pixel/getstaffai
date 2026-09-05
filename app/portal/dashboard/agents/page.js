import { redirect } from 'next/navigation';
import PortalHeader from '@/components/PortalHeader';
import WorkforceRoster from '@/components/WorkforceRoster';
import { getCEO } from '@/app/actions/auth';
import { hireEmployeeAction, dismissEmployeeAction } from '@/app/actions/workforce';
import { HIREABLE_ROLES } from '@/lib/hiring';
import { createClient } from '@/lib/supabase/server';

// Hiring installs a real agent into the tenant runtime (about a minute) and
// dismissal tears one down, so the segment hosting those actions needs more
// than a default execution budget.
export const maxDuration = 300;

export default async function AIWorkforce() {
  const ceo = await getCEO();
  if (!ceo) redirect('/portal/login');

  const supabase = await createClient();
  const orgId = ceo.org_id;

  const { data: employeesData } = orgId
    ? await supabase.from('employees').select('*').eq('org_id', orgId).order('created_at')
    : { data: [] };
  const employees = employeesData || [];

  return (
    <>
      <PortalHeader title="Org Chart" />
      <main style={{ padding: '7rem 2.5rem 2.5rem 2.5rem', minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)' }}>
        <div style={{ flex: 1, marginLeft: '2rem' }}>
          <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Your AI Workforce</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Hire new employees, see their runtime state, and dismiss the ones you no longer need.</p>
          </div>

          <WorkforceRoster
            employees={employees}
            roles={HIREABLE_ROLES}
            canHire={ceo.status !== 'provisional'}
            hireAction={hireEmployeeAction}
            dismissAction={dismissEmployeeAction}
          />
        </div>
      </main>
    </>
  );
}
