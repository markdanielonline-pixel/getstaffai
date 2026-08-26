import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * Universal Sensory Inbox
 * Catches all incoming messages (SMS, Email, Chatwoot) across the entire platform,
 * resolves them to the correct AI Employee, and kicks off their Execution Engine.
 */
export async function POST(req) {
  try {
    const body = await req.json();
    let source = 'unknown';
    let senderId = '';
    let receiverId = '';
    let messageText = '';

    // 1. Detect Source Platform
    if (body.data && body.data.event_type === 'message.received') {
       // Telnyx SMS
       source = 'telnyx';
       messageText = body.data.payload.text;
       senderId = body.data.payload.from.phone_number;
       receiverId = body.data.payload.to?.[0]?.phone_number;
    } else if (body.event === 'message_created' && body.message_type === 'incoming') {
       // Chatwoot (Lynkwe) Webhook
       source = 'chatwoot';
       messageText = body.content;
       senderId = body.sender?.identifier || body.sender?.email || String(body.sender?.id);
       receiverId = body.inbox?.id; // Inbox ID maps to an employee
    } else if (body.type === 'email' || body.html || body.text) {
       // Email (Resend/Sendgrid)
       source = 'email';
       messageText = body.text || body.html;
       senderId = body.from;
       receiverId = body.to;
    } else {
       return NextResponse.json({ success: true, message: 'Unhandled payload type' });
    }

    if (!messageText) return NextResponse.json({ success: true, message: 'No text content' });

    console.log(`[Universal Webhook] Source: ${source}, From: ${senderId}, To: ${receiverId}`);

    const supabase = await createAdminClient();

    // 2. Identify the target AI Employee based on receiverId
    // We check the employees table where virtual_phone, email, or inbox_id matches.
    const { data: employee } = await supabase
      .from('employees')
      .select('id, org_id, status')
      .or(`virtual_phone.eq.${receiverId},virtual_email.eq.${receiverId},chatwoot_inbox_id.eq.${receiverId}`)
      .eq('status', 'active')
      .maybeSingle();

    if (!employee) {
       console.log(`[Universal Webhook] No active AI Employee mapped to receiver: ${receiverId}. Dropping message.`);
       return NextResponse.json({ success: true, dropped: true });
    }

    const taskDescription = `
New incoming message from ${senderId} via ${source}:
"${messageText}"

Read the message context, use your tools if needed (e.g., check calendar, check CRM), and formulate a direct response to the sender using the appropriate reply tool.
    `.trim();

    // 3. Hand off to the Execution Worker
    const workerUrl = new URL('/api/worker/execute', req.url);
    const workerResponse = await fetch(workerUrl.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            orgId: employee.org_id,
            employeeId: employee.id,
            description: taskDescription,
            idempotencyKey: `msg_${Date.now()}_${senderId}`
        })
    });

    if (!workerResponse.ok) {
        throw new Error('Failed to dispatch to worker');
    }

    const workerResult = await workerResponse.json();

    return NextResponse.json({ 
        success: true, 
        dispatched: true, 
        task_id: workerResult.taskId 
    });

  } catch (err) {
    console.error("[Universal Webhook] Error processing incoming payload:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
