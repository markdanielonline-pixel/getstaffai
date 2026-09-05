import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { dispatchTaskToAgent, awaitProvisionAgentOperational } from '@/lib/provision';

// Real work takes minutes, and the route polls Provision until the task is done.
export const maxDuration = 300;

export async function POST(req) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

    const body = await req.json();
    const { conversationId, message } = body;

    if (!conversationId || !message?.trim()) {
      return NextResponse.json({ error: 'Missing conversationId or message' }, { status: 400 });
    }

    // Verify conversation belongs to this CEO
    const { data: conversation } = await supabase
      .from('conversations')
      .select('*, employees(*)')
      .eq('id', conversationId)
      .eq('ceo_id', user.id)
      .single();

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const employee = conversation.employees;
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // 1. Record the CEO's incoming message
    const admin = await createAdminClient();
    await admin.from('messages').insert({
      conversation_id: conversationId,
      ceo_id: user.id,
      role: 'ceo',
      content: message.trim(),
      metadata: {},
    });

    // 2. Dispatch the message to the employee's real Provision workforce runtime.
    const idempotencyKey = `chat_${conversationId}_${Date.now()}`;
    // Installing or dismissing an employee restarts the tenant's shared gateway,
    // which briefly takes the whole workforce offline. Without this the customer
    // just gets "not available right now" for about a minute after any hire, and
    // any message they send in that window is lost rather than delayed.
    await awaitProvisionAgentOperational(employee.id, employee.org_id, {
      timeoutMs: 90_000, intervalMs: 5_000, demote: false,
    }).catch(() => { /* dispatch reports the real reason below */ });

    // A pre-flight failure here (runtime not active, organization runtime
    // unavailable) used to fall through to the bare 500 below, which told the
    // customer nothing and hid a diagnosable cause.
    let engineResult;
    try {
      engineResult = await dispatchTaskToAgent(employee.id, message.trim(), {
        idempotencyKey,
        title: `CEO message to ${employee.name}`,
        waitForResult: true,
        // If this request dies before the task finishes, the conversation load
        // path delivers the answer instead of losing it.
        conversationId,
      });
    } catch (dispatchError) {
      console.error(`[employees/chat] dispatch to ${employee.id} failed:`, dispatchError?.message || dispatchError);
      return NextResponse.json({
        error: `${employee.name} is not available right now.`,
        detail: dispatchError?.message || 'Runtime unavailable',
      }, { status: 409 });
    }

    if (!engineResult.success) {
      // pollProvisionTask reports terminal outcomes as `status`/`result`; it never
      // sets `error`/`reason`, so reading those produced "failed: undefined" and
      // hid the real cause (e.g. an upstream model-gateway failure).
      const detail = engineResult.result || engineResult.status || 'unknown terminal state';
      console.error(`[employees/chat] task ${engineResult.taskId} ended ${engineResult.status}: ${detail}`);
      return NextResponse.json({
        error: `${employee.name} could not complete this request.`,
        detail,
        taskId: engineResult.taskId,
        status: engineResult.status,
      }, { status: 502 });
    }

    const responseText = engineResult.result;

    // Provision can report a task as done a moment before its result summary is
    // persisted, so a successful poll can still hand back a null result. Writing
    // that inserted a null message body, which the insert rejected silently, and
    // then crashed on responseText.substring below - a 500 for the customer and a
    // task marked delivered with nothing delivered. Leave it undelivered instead;
    // opening the conversation picks the answer up once the summary lands.
    if (!responseText) {
      console.warn(`[employees/chat] task ${engineResult.taskId} reported ${engineResult.status} with no result yet`);
      return NextResponse.json({
        pending: true,
        message: `${employee.name} is still writing this up. It will appear in this conversation shortly.`,
        taskId: engineResult.taskId,
      }, { status: 202 });
    }

    // 4. Save the Engine's response back to the chat history
    const { data: savedMsg, error: saveError } = await admin.from('messages').insert({
      conversation_id: conversationId,
      ceo_id: user.id,
      role: 'employee',
      content: responseText,
      metadata: { employee_id: employee.id, employee_name: employee.name, task_id: engineResult.taskId, provision_task_id: engineResult.provisionTaskId },
    }).select().single();

    // A failed write here used to pass unnoticed: the customer got a 200 with the
    // answer in the response body and an empty thread on reload.
    if (saveError) throw saveError;

    await admin.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', conversationId);
    // Delivered in-request, so the catch-up path must not deliver it again.
    await admin.from('employee_tasks').update({ delivered_at: new Date().toISOString() }).eq('id', engineResult.taskId);

    // 5. Update Employee Recent Memory (Optional lightweight tracking)
    const currentMemory = employee.memory ?? { core: [], recent: [], ceo_preferences: {} };
    const recentEntry = {
      content: `CEO: "${message.trim().substring(0, 100)}" -> ${employee.name}: "${responseText.substring(0, 100)}"`,
      importance: 'low',
      created_at: new Date().toISOString(),
    };
    const updatedRecent = [recentEntry, ...((currentMemory.recent) ?? []).slice(0, 19)];
    await admin.from('employees').update({ memory: { ...currentMemory, recent: updatedRecent } }).eq('id', employee.id);

    return NextResponse.json({
      message: responseText,
      messageId: savedMsg?.id,
      employeeName: employee.name,
    });
  } catch (err) {
    console.error('[employees/chat] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
