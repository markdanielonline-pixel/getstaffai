/**
 * Password reset email, sent by us rather than by Supabase.
 *
 * Supabase's built-in mailer sends from noreply@mail.app.supabase.io. On a paid
 * product that reads as broken before anyone clicks, and it puts the most
 * security-sensitive email we send on a shared domain we do not control. The
 * usual fix is to paste Resend's SMTP details into the Supabase dashboard.
 * Doing it here instead buys three things that the dashboard route does not.
 *
 * The sender is ours, from a domain already verified in Resend.
 *
 * The copy is ours, so it can say plainly how long the link lasts and what to
 * do when it fails, which is most of what a locked-out person needs.
 *
 * Most importantly the link shape is ours. Supabase's own link hands the token
 * to the browser in a URL fragment, which only works if the page that receives
 * it knows to look there. This one goes through /auth/confirm, which verifies
 * the token on the server and sets a cookie, so it works when the reset is
 * requested on a laptop and opened on a phone. That exact case is what locked
 * the founder out of his own product.
 */

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

export function passwordResetEmail({ link }) {
  const safeLink = escapeHtml(link);

  const text = [
    'You asked to reset your Staff AI password.',
    '',
    'Open this link to choose a new one:',
    link,
    '',
    'The link lasts one hour and can only be used once. It is safe to open on any',
    'device, including a phone, even if you asked for it somewhere else.',
    '',
    'If you did not ask for this, you can ignore it. Your password stays as it is',
    'until someone opens the link above.',
    '',
    'Staff AI',
  ].join('\n');

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:520px;margin:0 auto;padding:2rem 1.5rem;color:#0f172a;line-height:1.6;">
      <p style="margin:0 0 1.25rem;font-size:1rem;">You asked to reset your Staff AI password.</p>
      <p style="margin:0 0 1.75rem;">
        <a href="${safeLink}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:0.85rem 1.5rem;border-radius:8px;font-weight:600;font-size:1rem;">Choose a new password</a>
      </p>
      <p style="margin:0 0 1.25rem;font-size:0.9rem;color:#475569;">
        The link lasts one hour and can only be used once. It is safe to open on any
        device, including a phone, even if you asked for it somewhere else.
      </p>
      <p style="margin:0 0 1.25rem;font-size:0.9rem;color:#475569;">
        If you did not ask for this you can ignore it. Your password stays as it is
        until someone opens the link.
      </p>
      <p style="margin:1.75rem 0 0;font-size:0.8rem;color:#94a3b8;word-break:break-all;">
        If the button does not work, paste this into your browser:<br>${safeLink}
      </p>
    </div>
  `;

  return { subject: 'Reset your Staff AI password', text, html };
}

export async function sendPasswordResetEmail({ to, link }) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return { sent: false, reason: 'no email credential' };

  const { subject, text, html } = passwordResetEmail({ link });

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${resendKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || 'Staff AI <ai@getstaffai.com>',
      to,
      subject,
      text,
      html,
    }),
  }).catch(error => ({ ok: false, status: 0, _error: error?.message }));

  if (!response.ok) {
    const detail = response._error
      || await response.text?.().then(body => `HTTP ${response.status}: ${body.slice(0, 200)}`, () => `HTTP ${response.status}`);
    return { sent: false, reason: detail };
  }

  return { sent: true };
}
