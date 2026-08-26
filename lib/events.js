import { createAdminClient } from '@/lib/supabase/server';

/**
 * Event Bus Service for Staff AI v2
 * Uses Supabase (PostgreSQL) as the canonical event store to ensure durability and idempotency.
 */

export async function publishEvent({ event_type, org_id, source = 'staffai_app', data = {} }) {
  const supabase = await createAdminClient();
  
  const { data: event, error } = await supabase
    .from('staffai_events')
    .insert([
      {
        event_type,
        org_id,
        source,
        data,
        status: 'pending'
      }
    ])
    .select()
    .single();

  if (error) {
    console.error(`[EventBus] Failed to publish ${event_type}:`, error);
    throw new Error(`Event publish failed: ${error.message}`);
  }

  // If using webhooks (e.g. n8n) for external glue, we can optionally dispatch here asynchronously
  // triggerExternalWebhook(event);

  return event;
}

export async function markEventCompleted(event_id) {
  const supabase = await createAdminClient();
  
  await supabase
    .from('staffai_events')
    .update({ status: 'completed', processed_at: new Date().toISOString() })
    .eq('id', event_id);
}

export async function markEventFailed(event_id, error_message = '') {
  const supabase = await createAdminClient();
  
  // Note: in a production setting we would increment retry_count 
  // and use a job scheduler to re-process pending/failed events.
  await supabase
    .from('staffai_events')
    .update({ 
      status: 'failed', 
      data: { error: error_message } // Append error context 
    })
    .eq('id', event_id);
}
