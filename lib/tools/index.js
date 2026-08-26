import { tool, jsonSchema } from 'ai';

export const send_email = tool({
  description: 'Sends an email to a recipient on behalf of the company using the Resend API.',
  parameters: jsonSchema({
    type: 'object',
    properties: {
      to: { type: 'string', description: 'The email address of the recipient.' },
      subject: { type: 'string', description: 'The subject line of the email.' },
      body: { type: 'string', description: 'The HTML or plain text body of the email.' }
    },
    required: ['to', 'subject', 'body']
  }),
  execute: async ({ to, subject, body }, { toolOptions }) => {
    const { orgId, employeeId } = toolOptions || {};
    console.log(`[Tool: send_email] Org: ${orgId} | Emp: ${employeeId} | To: ${to}`);

    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY missing. Simulating email send.");
      return { success: true, message: `Simulated email to ${to}.` };
    }

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Staff AI <ai@getstaffai.com>', // Replace with dynamic tenant email later
          to: to,
          subject: subject,
          html: body
        })
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return { success: true, message: `Email successfully sent to ${recipient}. ID: ${data.id}` };
    } catch (err) {
      console.error("[Tool: send_email] Failed:", err.message);
      return { success: false, error: err.message };
    }
  }
});

export const send_sms = tool({
  description: 'Sends an SMS text message to a recipient on behalf of the company using the Telnyx API.',
  parameters: jsonSchema({
    type: 'object',
    properties: {
      recipient: { type: 'string', description: 'The phone number of the recipient in E.164 format.' },
      body: { type: 'string', description: 'The text body of the SMS message.' }
    },
    required: ['recipient', 'body']
  }),
  execute: async ({ recipient, body }, { toolOptions }) => {
    const { orgId, employeeId } = toolOptions || {};
    console.log(`[Tool: send_sms] Org: ${orgId} | Emp: ${employeeId} | To: ${recipient}`);

    if (!process.env.TELNYX_API_KEY) {
      console.warn("TELNYX_API_KEY missing. Simulating SMS send.");
      return { success: true, message: `Simulated SMS to ${recipient}.` };
    }

    try {
      const res = await fetch('https://api.telnyx.com/v2/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.TELNYX_PHONE_NUMBER || '+15055200001',
          to: recipient,
          text: body
        })
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return { success: true, message: `SMS successfully sent to ${recipientPhone}. ID: ${data.data.id}` };
    } catch (err) {
      console.error("[Tool: send_sms] Failed:", err.message);
      return { success: false, error: err.message };
    }
  }
});

export const ToolRegistry = {
  send_email,
  send_sms,
  email: send_email, // Map 'email' capability to send_email tool
  sms: send_sms      // Map 'sms' capability to send_sms tool
};
