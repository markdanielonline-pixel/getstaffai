import { tool } from 'ai';
import { z } from 'zod';

export const send_email = tool({
  description: 'Sends an email to a recipient on behalf of the company using the Resend API.',
  parameters: z.object({
    recipient: z.string().describe('The email address of the recipient.'),
    subject: z.string().describe('The subject line of the email.'),
    body: z.string().describe('The HTML or plain text body of the email.')
  }),
  execute: async ({ recipient, subject, body }, { toolOptions }) => {
    const { orgId, employeeId } = toolOptions || {};
    console.log(`[Tool: send_email] Org: ${orgId} | Emp: ${employeeId} | To: ${recipient}`);

    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY missing. Simulating email send.");
      return { success: true, message: `Simulated email to ${recipient}.` };
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
          to: recipient,
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
  description: 'Sends an SMS text message to a recipient using the Telnyx API.',
  parameters: z.object({
    recipientPhone: z.string().describe('The phone number of the recipient in E.164 format (e.g., +15551234567).'),
    message: z.string().describe('The text message to send.')
  }),
  execute: async ({ recipientPhone, message }, { toolOptions }) => {
    const { orgId, employeeId } = toolOptions || {};
    console.log(`[Tool: send_sms] Org: ${orgId} | Emp: ${employeeId} | To: ${recipientPhone}`);

    if (!process.env.TELNYX_API_KEY) {
      console.warn("TELNYX_API_KEY missing. Simulating SMS send.");
      return { success: true, message: `Simulated SMS to ${recipientPhone}.` };
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
          to: recipientPhone,
          text: message
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
