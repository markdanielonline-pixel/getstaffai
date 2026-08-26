import { redirect } from 'next/navigation';
import PortalHeader from '@/components/PortalHeader';
import PortalSidebar from '@/components/PortalSidebar';
import { getCEO } from '@/app/actions/auth';
import { createClient } from '@/lib/supabase/server';

export default async function Conversations() {
  const ceo = await getCEO();
  if (!ceo) redirect('/portal/login');
  if (ceo.status === 'provisional') redirect('/portal/incorporate');

  const supabase = await createClient();
  const { data: conversation } = await supabase
    .from('conversations')
    .select('id')
    .eq('ceo_id', ceo.id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (conversation) {
    redirect(`/portal/dashboard/conversations/${conversation.id}`);
  }

  return (
    <>
      <PortalHeader title="Conversations & Transcripts" />
      <main style={{ padding: '7rem 2.5rem 2.5rem 2.5rem', minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)' }}>
        <PortalSidebar />
        <div style={{ flex: 1, marginLeft: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Your team is still being assembled. Conversations will appear here shortly.
          </p>
        </div>
      </main>
    </>
  );
}
