import { redirect } from 'next/navigation';
import PortalHeader from '@/components/PortalHeader';
import PortalSidebar from '@/components/PortalSidebar';
import AdminRolesView from '@/components/AdminRolesView';
import { getCEO } from '@/app/actions/auth';
import { createClient } from '@/lib/supabase/server';

export default async function AdminRolesPage() {
  const ceo = await getCEO();
  if (!ceo) redirect('/portal/login');

  // Verify super-admin status in a real implementation
  // if (!ceo.is_super_admin) redirect('/portal/dashboard');

  const supabase = await createClient();
  const { data: roleTemplatesData } = await supabase.from('role_templates').select('*').order('created_at', { ascending: false });
  const roleTemplates = roleTemplatesData || [];

  return (
    <>
      <PortalHeader title="Admin: Role Templates" />
      <main style={{ padding: '7rem 2.5rem 2.5rem 2.5rem', minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)' }}>
        <PortalSidebar />
        <AdminRolesView initialTemplates={roleTemplates} />
      </main>
    </>
  );
}
