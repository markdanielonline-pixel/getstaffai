import { createClient } from '@/lib/supabase/server';

function configuredAdminEmails() {
  return new Set(
    (process.env.STAFFAI_ADMIN_EMAILS || '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

export async function getStaffAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user?.email) return null;

  return configuredAdminEmails().has(user.email.toLowerCase()) ? user : null;
}

export async function requireStaffAdmin() {
  const admin = await getStaffAdmin();
  if (!admin) throw new Error('Unauthorized');
  return admin;
}
