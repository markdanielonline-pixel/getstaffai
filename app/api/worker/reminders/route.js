import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { hasValidWorkerAuthorization } from '@/lib/worker-auth';
import { sendReminderEmail } from '@/lib/email';

export async function POST(request) {
  if (!hasValidWorkerAuthorization(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createAdminClient();
  const { data: dueTasks, error } = await supabase
    .from('employee_tasks')
    .select('id, org_id, description, metadata, retry_count')
    .eq('task_type', 'reminder')
    .eq('status', 'scheduled')
    .lte('scheduled_for', new Date().toISOString())
    .order('scheduled_for')
    .limit(25);

  if (error) return NextResponse.json({ error: 'Unable to read due reminders' }, { status: 500 });

  let delivered = 0;
  for (const task of dueTasks) {
    const claim = await supabase
      .from('employee_tasks')
      .update({ status: 'processing', claimed_at: new Date().toISOString() })
      .eq('id', task.id)
      .eq('status', 'scheduled')
      .select('id')
      .maybeSingle();
    if (claim.error || !claim.data) continue;

    try {
      const ceoResult = await supabase.from('ceos').select('id, email, name, preferred_channel').eq('org_id', task.org_id).single();
      if (ceoResult.error) throw new Error('Reminder owner could not be resolved');
      const ceo = ceoResult.data;
      const topic = task.metadata?.topic || task.description;

      let providerId = null;
      if (ceo.preferred_channel === 'email') {
        providerId = await sendReminderEmail({ email: ceo.email, name: ceo.name, topic });
      }

      const notificationResult = await supabase.from('notifications').insert({
        ceo_id: ceo.id,
        type: 'ea_message',
        title: 'Reminder',
        body: topic,
        metadata: { task_id: task.id, provider_id: providerId },
      });
      if (notificationResult.error) throw new Error(`Notification creation failed: ${notificationResult.error.message}`);

      const completeResult = await supabase.from('employee_tasks').update({
        status: 'completed',
        delivered_at: new Date().toISOString(),
        result: providerId ? `Delivered by email (${providerId})` : 'Delivered in app',
        error_details: null,
      }).eq('id', task.id);
      if (completeResult.error) throw completeResult.error;
      delivered += 1;
    } catch (deliveryError) {
      const retries = (task.retry_count || 0) + 1;
      await supabase.from('employee_tasks').update({
        status: retries >= 5 ? 'failed' : 'scheduled',
        retry_count: retries,
        scheduled_for: retries >= 5 ? null : new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        error_details: deliveryError.message,
      }).eq('id', task.id);
    }
  }

  return NextResponse.json({ inspected: dueTasks.length, delivered });
}
