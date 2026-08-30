import Telnyx from 'telnyx';

export class TelnyxWebhookConfigurationError extends Error {}
export class TelnyxWebhookAuthenticationError extends Error {}

export async function verifyTelnyxWebhook(request) {
  const publicKey = process.env.TELNYX_PUBLIC_KEY;
  if (!publicKey) throw new TelnyxWebhookConfigurationError('TELNYX_PUBLIC_KEY is not configured');

  const rawBody = await request.text();
  const client = new Telnyx({
    apiKey: process.env.TELNYX_API_KEY || 'webhook-verification-only',
    publicKey,
  });

  try {
    return await client.webhooks.unwrap(rawBody, {
      headers: Object.fromEntries(request.headers.entries()),
    });
  } catch (error) {
    console.warn('[Telnyx Webhook] Rejected invalid signature:', error.message);
    throw new TelnyxWebhookAuthenticationError('Invalid webhook signature');
  }
}
