import { tool } from 'ai';
import { z } from 'zod';

export const send_email = ({ orgId, employeeId, taskId }) => tool({
  description: 'Sends an email to a recipient on behalf of the company using the Resend API.',
  parameters: z.object({
    to: z.string().describe('The email address of the recipient.'),
    subject: z.string().describe('The subject line of the email.'),
    body: z.string().describe('The HTML or plain text body of the email.')
  }),
  execute: async ({ to, subject, body }) => {
    console.log(`[Tool: send_email] Org: ${orgId} | Emp: ${employeeId} | Task: ${taskId} | To: ${to}`);

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
          from: process.env.RESEND_FROM_EMAIL || 'Staff AI <onboarding@resend.dev>',
          to: to,
          subject: subject,
          html: body
        })
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("[Tool: send_email] Error:", err);
        return { success: false, error: err };
      }

      return { success: true, message: 'Email sent successfully.' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
});

export const send_sms = ({ orgId, employeeId, taskId }) => tool({
  description: 'Sends an SMS text message to a recipient on behalf of the company using the Telnyx API.',
  parameters: z.object({
    recipient: z.string().describe('The phone number of the recipient in E.164 format (e.g. +1234567890).'),
    body: z.string().describe('The text content of the SMS message.')
  }),
  execute: async ({ recipient, body }) => {
    console.log(`[Tool: send_sms] Org: ${orgId} | Emp: ${employeeId} | Task: ${taskId} | To: ${recipient}`);

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
      return { success: true, message: `SMS successfully sent to ${recipient}. ID: ${data.data.id}` };
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
