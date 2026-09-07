import PortalSidebar from '@/components/PortalSidebar';
import { PortalIdentityProvider } from '@/components/PortalIdentity';
import { getCEO } from '@/app/actions/auth';
import { createAdminClient } from '@/lib/supabase/server';
import { entitlementLabel, listOrganizationsForCeo } from '@/lib/entitlement';
import { switchOrganizationAction, createOrganizationAction } from '@/app/actions/organizations';

// Loaded once here rather than in each page: the header and sidebar are
// rendered on every dashboard route and previously displayed hardcoded
// placeholder identity and a permanently green workforce indicator.
export default async function DashboardLayout({ children }) {
  const ceo = await getCEO();
  let workforceStatus = null;
  let subscriptionLevel = null;
  let organizations = [];

  if (ceo?.id) {
    const admin = await createAdminClient();
    const [organization, subscription, memberships] = await Promise.all([
      ceo.org_id
        ? admin.from('organizations').select('workforce_status').eq('id', ceo.org_id).maybeSingle()
        : Promise.resolve({ data: null }),
      admin.from('subscriptions').select('status, intelligence_level').eq('ceo_id', ceo.id)
        .order('created_at', { ascending: false }).limit(1).maybeSingle(),
      listOrganizationsForCeo(ceo.id),
    ]);
    workforceStatus = organization.data?.workforce_status ?? null;
    subscriptionLevel = subscription.data?.intelligence_level ?? null;
    organizations = memberships;
  }

  const identity = {
    name: ceo?.name || null,
    companyName: ceo?.company_name || null,
    // Founder access is labelled as what it is, never disguised as a purchased plan.
    planLabel: entitlementLabel(ceo, subscriptionLevel),
    workforceStatus,
    isFounder: ceo?.is_founder === true,
  };

  return (
    <PortalIdentityProvider value={identity}>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <PortalSidebar
          organizations={organizations}
          activeOrgId={ceo?.org_id || null}
          canCreateOrganization={ceo?.is_founder === true}
          switchOrganizationAction={switchOrganizationAction}
          createOrganizationAction={createOrganizationAction}
        />
        {/* The sidebar is position:fixed, so it occupies no space in this flex
            row. Combining flex:1 with a 280px left margin therefore gave this
            element the full viewport width AND pushed it right by the sidebar,
            leaving every portal page exactly 280px wider than the window. The
            Send button in the EA conversation ended up past the right edge,
            unreachable. Width is now what is actually left over. */}
        <div style={{
          width: 'calc(100% - 280px)',
          minWidth: 0,
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
