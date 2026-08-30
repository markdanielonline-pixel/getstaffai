import { redirect } from 'next/navigation';
import PortalHeader from '@/components/PortalHeader';
import AccountSettingsForm from '@/components/AccountSettingsForm';
import SupportForm from '@/components/SupportForm';
import { getCEO, getUser } from '@/app/actions/auth';
import { createAdminClient } from '@/lib/supabase/server';

export default async function SettingsPage() {
  const [ceo, user] = await Promise.all([getCEO(), getUser()]);
  if (!ceo || !user) redirect('/portal/login');
  if (ceo.status === 'provisional') redirect('/portal/incorporate');

  const admin = await createAdminClient();
  const { data: subscription } = await admin
    .from('subscriptions')
    .select('status, intelligence_level, billing_period, current_period_end')
    .eq('ceo_id', ceo.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <>
      <PortalHeader title="Settings" />
      <main className="portal-main">
        <section className="settings-hero">
          <div>
            <span className="settings-kicker">Customer operations</span>
            <h1>Account, billing, and support</h1>
            <p>
              Manage access, plan details, and service requests from one place.
            </p>
          </div>
        </section>

        <AccountSettingsForm user={user} ceo={ceo} subscription={subscription} />

        <section className="settings-panel settings-panel-wide">
          <div>
            <span className="settings-kicker">Support</span>
            <h2>Need help from StaffAI?</h2>
            <p>Billing, login trouble, email access changes, technical issues, and urgent incidents are routed here.</p>
          </div>
          <SupportForm
            source="portal"
            compact
            defaults={{
              name: ceo.name || '',
              email: user.email || ceo.email || '',
              companyName: ceo.company_name || '',
              category: 'technical',
            }}
          />
        </section>
      </main>
    </>
  );
}
