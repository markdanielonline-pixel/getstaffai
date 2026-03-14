import { processSmsReply } from '@/lib/agents/setter';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Validate Telnyx Webhook payload
    if (body.data && body.data.event_type === 'message.received') {
      const incomingMessage = body.data.payload.text;
      const fromNumber = body.data.payload.from.phone_number;
      
      // We would load this from the User's Moxie CRM profile in Postgres/KV
      const mockCalendarLink = "https://moxie.com/book/demo";

      // Pass the text to our LangChain Setter Agent
      const agentResponse = await processSmsReply(
        fromNumber, 
        incomingMessage, 
        mockCalendarLink
      );

      // In a real production setup, we then call Telnyx's API to actually send the SMS
      /* 
      await fetch('https://api.telnyx.com/v2/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${process.env.TELNYX_API_KEY}\`
        },
        body: JSON.stringify({
          from: process.env.TELNYX_PHONE_NUMBER,
          to: fromNumber,
          text: agentResponse.replyText
        })
      });
      */

      return NextResponse.json({ 
        success: true, 
        reply: agentResponse.replyText,
        toolsUsed: agentResponse.toolsTriggered 
      });
    }

    return NextResponse.json({ success: true, message: "Ignored non-message event" });
    
  } catch (error) {
    console.error("SMS Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
