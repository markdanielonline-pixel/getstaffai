import { publishEvent } from './events';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * Staff AI Cost Guardrails
 * Meters and restricts usage to protect margins.
 */

const MARGIN_THRESHOLDS = {
  YELLOW: 50.0, // Warning at $50 variable COGS
  ORANGE: 100.0, // Critical at $100 variable COGS
  RED: 200.0 // Cutoff at $200 variable COGS
};

export async function meterUsage(orgId, employeeId, costType, amount) {
  // In reality, this updates a Redis counter or specialized ledger.
  console.log(`[Cost] Metering $${amount} for ${employeeId} (${costType})`);

  // Example: Check if the organization breached a threshold
  const supabase = await createAdminClient();
  const { data: org } = await supabase.from('organizations').select('settings').eq('id', orgId).single();
  
  let currentSpend = (org?.settings?.current_cogs || 0) + amount;
  await supabase.from('organizations').update({ settings: { ...org?.settings, current_cogs: currentSpend } }).eq('id', orgId);

  let zone = 'GREEN';
  if (currentSpend > MARGIN_THRESHOLDS.RED) zone = 'RED';
  else if (currentSpend > MARGIN_THRESHOLDS.ORANGE) zone = 'ORANGE';
  else if (currentSpend > MARGIN_THRESHOLDS.YELLOW) zone = 'YELLOW';

  if (zone !== (org?.settings?.margin_zone || 'GREEN')) {
    // We crossed a threshold boundary
    await publishEvent({
      event_type: 'cost.threshold_crossed',
      org_id: orgId,
      source: 'cost_guardrail',
      data: { previous_zone: org?.settings?.margin_zone || 'GREEN', new_zone: zone, current_cogs: currentSpend }
    });

    await supabase.from('organizations').update({ settings: { ...org?.settings, current_cogs: currentSpend, margin_zone: zone } }).eq('id', orgId);
    
    if (zone === 'RED') {
      console.warn(`[Cost] RED ZONE BREACH for Org ${orgId}. Halting employee tasks.`);
      // Enforce rate limiting / pausing employees here.
    }
  }
}
