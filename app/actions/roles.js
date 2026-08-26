'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createRoleTemplate(data) {
  const supabase = await createAdminClient();
  
  const { data: newRole, error } = await supabase
    .from('role_templates')
    .insert({
      id: data.id, // e.g., 'sales_rep_v1'
      title_default: data.title_default,
      description: data.description,
      system_prompt: data.system_prompt,
      tools_available: data.tools_available,
      required_tools: data.required_tools,
      onboarding_schema: data.onboarding_schema || {},
      version: 1
    })
    .select()
    .single();

  if (error) {
    console.error("Create role error:", error);
    throw new Error(error.message);
  }

  revalidatePath('/portal/admin/roles');
  return { success: true, data: newRole };
}

export async function updateRoleTemplate(id, updates) {
  const supabase = await createAdminClient();
  
  const { error } = await supabase
    .from('role_templates')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error("Update role error:", error);
    throw new Error(error.message);
  }

  revalidatePath('/portal/admin/roles');
  return { success: true };
}
