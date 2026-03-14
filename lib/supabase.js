import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Client Portal will not function.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

/**
 * Helper function to safely read data from Supabase
 */
export async function getLeads() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
  return data;
}

/**
 * Helper function to log a conversation message
 */
export async function logMessage(leadId, agentRole, messageText, isAi) {
  const { error } = await supabase
    .from('conversations')
    .insert([
      { lead_id: leadId, role: agentRole, content: messageText, is_ai: isAi }
    ]);

  if (error) {
    console.error('Error logging message to Supabase:', error);
  }
}
