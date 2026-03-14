import { processVoiceInteraction } from '@/lib/agents/closer';
import { NextResponse } from 'next/server';

/**
 * Handle Telnyx Call Control Webhooks for the Closer Agent
 * Uses Telnyx TeXML (or JSON commands) to instruct Telnyx what to say
 * back to the user via Google Neural2 TTS.
 */
export async function POST(req) {
  try {
    const body = await req.json();
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper to issue REST commands to Telnyx Call Control API
async function sendTelnyxCommand(callControlId, action, data) {
    if (!process.env.TELNYX_API_KEY) {
        console.warn("[Voice Webhook] Missing TELNYX_API_KEY. Mocking command:", action, data);
        return;
    }
    
    /* PRODUCTION IMPLEMENTATION:
    await fetch(`https://api.telnyx.com/v2/calls/${callControlId}/actions/${action}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`
        },
        body: JSON.stringify(data)
    });
    */
}
