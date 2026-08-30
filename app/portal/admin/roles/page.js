import { redirect } from 'next/navigation';
import PortalHeader from '@/components/PortalHeader';
import PortalSidebar from '@/components/PortalSidebar';
import AdminRolesView from '@/components/AdminRolesView';
import { getStaffAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/server';

export default async function AdminRolesPage() {
  const admin = await getStaffAdmin();
  if (!admin) redirect('/portal/dashboard');

  const supabase = await createAdminClient();
  const { data: roleTemplatesData, error } = await supabase.from('role_templates').select('*').order('created_at', { ascending: false });
  if (error) throw new Error('Unable to load role templates');
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
