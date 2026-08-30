import { processSmsReply } from '@/lib/agents/setter';
import { NextResponse } from 'next/server';
import { TelnyxWebhookAuthenticationError, TelnyxWebhookConfigurationError, verifyTelnyxWebhook } from '@/lib/telnyx-webhook';

export async function POST(req) {
  try {
    const body = await verifyTelnyxWebhook(req);
    
    // Validate Telnyx Webhook payload
    if (body.data && body.data.event_type === 'message.received') {
      const incomingMessage = body.data.payload.text;
      const fromNumber = body.data.payload.from.phone_number;
      // Get the exact virtual number that received the SMS to route multi-tenant replies correctly
      const receivedNumber = body.data.payload.to?.[0]?.phone_number || process.env.TELNYX_PHONE_NUMBER;
      
      // Load verified business booking calendar link
      const calendarLink = process.env.TIDYCAL_LINK || "https://tidycal.com/staffai/sales";

      console.log(`[Telnyx Webhook] SMS Received from ${fromNumber} targeting ${receivedNumber}. Processing reply.`);

      // Pass the text to our LangChain Setter Agent
      const agentResponse = await processSmsReply(
        fromNumber, 
        incomingMessage, 
        calendarLink
      );

      const replyText = agentResponse.replyText || "Thanks for your interest. We will get back to you shortly!";

      // Dispatches actual outbound message back to Telnyx API
      const telnyxKey = process.env.TELNYX_API_KEY;
      if (telnyxKey) {
        const response = await fetch('https://api.telnyx.com/v2/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${telnyxKey}`
          },
          body: JSON.stringify({
            from: receivedNumber,
            to: fromNumber,
            text: replyText
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error("[Telnyx Webhook] Failed to dispatch outbound SMS via Telnyx API:", errText);
          throw new Error(`Telnyx outbound SMS failed with status ${response.status}`);
        } else {
          console.log(`[Telnyx Webhook] Outbound reply dispatched successfully to ${fromNumber}`);
        }
      } else {
        throw new TelnyxWebhookConfigurationError('TELNYX_API_KEY is not configured');
      }

      return NextResponse.json({ 
        success: true, 
        reply: replyText,
        toolsUsed: agentResponse.toolsTriggered || []
      });
    }

    return NextResponse.json({ success: true, message: "Ignored non-message event" });
    
  } catch (error) {
    console.error("SMS Webhook Error:", error);
    const status = error instanceof TelnyxWebhookAuthenticationError ? 403
      : error instanceof TelnyxWebhookConfigurationError ? 503 : 500;
    return NextResponse.json({ error: status === 403 ? 'Forbidden' : 'Webhook processing failed' }, { status });
  }
}
