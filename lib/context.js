import { createAdminClient } from '@/lib/supabase/server';

/**
 * Retrieves organizational context for an employee.
 * Abstracted so Phase 2 can seamlessly replace this with a pgvector/RAG query.
 */
export async function getCompanyContext(orgId, query = null) {
  const supabase = await createAdminClient();
  
  // For Phase 1: Retrieve the structured JSON directly from the org record
  const { data: org, error } = await supabase
    .from('organizations')
    .select('settings')
    .eq('id', orgId)
    .single();

  if (error || !org) {
    console.error("[Context] Failed to load org context:", error);
    return "No company context available.";
  }

  const brain = org.settings?.company_brain;
  if (!brain) return "No company context available.";

  // Return formatted string for the system prompt
  return `
--- COMPANY CONTEXT ---
Mission & Overview: ${brain.overview || 'Unknown'}
Target Audience (ICP): ${brain.target_audience || 'Unknown'}
Tone & Voice: ${brain.tone_and_voice || 'Professional'}
Products/Services: ${(brain.products_and_services || []).join(', ')}
Key Policies: ${(brain.key_policies || []).join('\n- ')}
-----------------------
  `.trim();
}
