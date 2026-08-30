import { processVoiceInteraction } from '@/lib/agents/closer';
import { NextResponse } from 'next/server';
import { TelnyxWebhookAuthenticationError, TelnyxWebhookConfigurationError, verifyTelnyxWebhook } from '@/lib/telnyx-webhook';

/**
 * Handle Telnyx Call Control Webhooks for the Closer Agent
 * Uses Telnyx TeXML (or JSON commands) to instruct Telnyx what to say
 * back to the user via Google Neural2 TTS.
 */
export async function POST(req) {
  try {
    const body = await verifyTelnyxWebhook(req);
    const eventType = body?.data?.event_type;
    const callControlId = body?.data?.payload?.call_control_id;

    if (!callControlId) return NextResponse.json({ success: true });

    console.log(`[Voice Webhook] Received Event: ${eventType}`);

    // 1. Call Answered -> Greet the user
    if (eventType === 'call.answered') {
      const greeting = "Hi, this is Staff AI's autonomous Closer. How can I help you unlock revenue today?";
      await sendTelnyxCommand(callControlId, 'speak', { 
        payload: greeting,
        voice: 'Google.en-US-Neural2-F', // Using Google Neural2 TTS
        language: 'en-US'
      });
      return NextResponse.json({ success: true });
    }

    // 2. Transcription Received -> Pass to Closer Agent
    if (eventType === 'call.transcription') {
      const transcript = body.data.payload.transcription_data.transcript;
      
      const agentResponse = await processVoiceInteraction(callControlId, transcript);

      if (agentResponse.action === 'transfer') {
         // Tell Telnyx to bridge the call to the founder/human
         await sendTelnyxCommand(callControlId, 'transfer', {
            to: process.env.HUMAN_ESCALATION_NUMBER || '+1234567890'
         });
      } else {
         // Tell Telnyx to Speak the LLM's response
         await sendTelnyxCommand(callControlId, 'speak', { 
            payload: agentResponse.textToSay,
            voice: 'Google.en-US-Neural2-F',
            language: 'en-US'
         });
      }
      return NextResponse.json({ success: true, action: agentResponse.action });
    }

    // Ignore other events (ringing, hangup, etc)
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Voice Webhook Error:", error);
    const status = error instanceof TelnyxWebhookAuthenticationError ? 403
      : error instanceof TelnyxWebhookConfigurationError ? 503 : 500;
    return NextResponse.json({ error: status === 403 ? 'Forbidden' : 'Webhook processing failed' }, { status });
  }
}

// Helper to issue REST commands to Telnyx Call Control API
async function sendTelnyxCommand(callControlId, action, data) {
    const telnyxKey = process.env.TELNYX_API_KEY;
    if (!telnyxKey) {
        throw new TelnyxWebhookConfigurationError('TELNYX_API_KEY is not configured');
    }
    
    try {
      const response = await fetch(`https://api.telnyx.com/v2/calls/${callControlId}/actions/${action}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${telnyxKey}`
          },
          body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`[Voice Webhook] Telnyx API command ${action} failed:`, errText);
        throw new Error(`Telnyx command ${action} failed with status ${response.status}`);
      }
    } catch (err) {
      console.error(`[Voice Webhook] Connection error posting to Telnyx API:`, err.message);
      throw err;
    }
}
