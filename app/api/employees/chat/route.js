import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { executeTask } from '@/lib/engine';

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

    // 1. Fetch chat history
    const { data: history } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(20);

    const historyMessages = (history ?? []).reverse().map(m => ({
      role: m.role === 'employee' ? 'assistant' : 'user',
      content: m.content,
    }));

    // 2. Record the CEO's incoming message
    const admin = await createAdminClient();
    await admin.from('messages').insert({
      conversation_id: conversationId,
      ceo_id: user.id,
      role: 'ceo',
      content: message.trim(),
      metadata: {},
    });

    // 3. Create an Execution Engine Task for this message
    const idempotencyKey = `chat_${conversationId}_${Date.now()}`;
    const { data: task, error: taskError } = await admin
        .from('employee_tasks')
        .insert({
          org_id: employee.org_id,
          employee_id: employee.id,
          description: message.trim(),
          idempotency_key: idempotencyKey,
          status: 'pending'
        })
        .select('id')
        .single();
    
    if (taskError) throw taskError;

    // 4. Execute the Task Synchronously (for now, to match UI expectations)
    const engineResult = await executeTask(task.id, { chatHistory: historyMessages });

    if (!engineResult.success) {
      throw new Error(`Engine execution failed: ${engineResult.error || engineResult.reason}`);
    }

    const responseText = engineResult.result;

    // 4. Save the Engine's response back to the chat history
    const { data: savedMsg } = await admin.from('messages').insert({
      conversation_id: conversationId,
      ceo_id: user.id,
      role: 'employee',
      content: responseText,
      metadata: { employee_id: employee.id, employee_name: employee.name, task_id: task.id },
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
