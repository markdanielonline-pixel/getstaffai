import PortalSidebar from '@/components/PortalSidebar';
import { PortalIdentityProvider } from '@/components/PortalIdentity';
import { getCEO } from '@/app/actions/auth';
import { createAdminClient } from '@/lib/supabase/server';

// Loaded once here rather than in each page: the header and sidebar are
// rendered on every dashboard route and previously displayed hardcoded
// placeholder identity and a permanently green workforce indicator.
export default async function DashboardLayout({ children }) {
  const ceo = await getCEO();
  let workforceStatus = null;
  let planLabel = null;

  if (ceo?.org_id) {
    const admin = await createAdminClient();
    const [organization, subscription] = await Promise.all([
      admin.from('organizations').select('workforce_status').eq('id', ceo.org_id).maybeSingle(),
      admin.from('subscriptions').select('status, intelligence_level').eq('ceo_id', ceo.id)
        .order('created_at', { ascending: false }).limit(1).maybeSingle(),
    ]);
    workforceStatus = organization.data?.workforce_status ?? null;
    // A provisional CEO has no subscription yet; saying so beats inventing a tier.
    planLabel = subscription.data?.intelligence_level
      ? `${subscription.data.intelligence_level[0].toUpperCase()}${subscription.data.intelligence_level.slice(1)} plan`
      : 'No active plan';
  }

  const identity = {
    name: ceo?.name || null,
    companyName: ceo?.company_name || null,
    planLabel: planLabel || 'No active plan',
    workforceStatus,
  };

  return (
    <PortalIdentityProvider value={identity}>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <PortalSidebar />
        <div style={{
          flex: 1,
          marginLeft: '280px',
          paddingRight: '0',
          background: 'radial-gradient(circle at top right, rgba(139,92,246,0.05), transparent 40%)',
        }}>
          {children}
        </div>
      </div>
    </PortalIdentityProvider>
  );
}
