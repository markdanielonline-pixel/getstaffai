import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { dispatchTaskToAgent } from '@/lib/provision';

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
    const engineResult = await dispatchTaskToAgent(employee.id, message.trim(), {
      idempotencyKey,
      title: `CEO message to ${employee.name}`,
      waitForResult: true,
    });

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

    // 4. Save the Engine's response back to the chat history
    const { data: savedMsg } = await admin.from('messages').insert({
      conversation_id: conversationId,
      ceo_id: user.id,
      role: 'employee',
      content: responseText,
      metadata: { employee_id: employee.id, employee_name: employee.name, task_id: engineResult.taskId, provision_task_id: engineResult.provisionTaskId },
    }).select().single();

    await admin.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', conversationId);

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
