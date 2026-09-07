import { createAdminClient } from '@/lib/supabase/server';
import { sendPasswordResetEmail } from '@/lib/auth-email';

/**
 * Issue a recovery link and deliver it ourselves.
 *
 * Two deliberate choices.
 *
 * The link points at /auth/confirm, which verifies the token server side and
 * sets a cookie, instead of the fragment link Supabase's own mailer sends. A
 * fragment only works if the receiving page reads it, and it cannot survive
 * being requested on one device and opened on another. That is the failure that
 * locked the founder out.
 *
 * The answer to the caller never says whether the address has an account. An
 * unknown address takes the same path and returns the same words, because a
 * reset form that distinguishes the two is a way to enumerate customers.
 */
export async function issuePasswordReset(email, { origin }) {
  const target = String(email || '').trim();
  if (!target) {
    return { ok: false, message: 'Enter your email address above, then select Forgot password.' };
  }

  const neutral = {
    ok: true,
    message: 'If that address has an account, a password reset link is on its way. It lasts one hour.',
  };

  const supabase = await createAdminClient();
  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email: target,
    options: { redirectTo: `${origin}/portal/reset-password` },
  });

  if (error) {
    // An address with no account is not an error the caller should be able to
    // see. Anything else is ours, and is logged rather than shown.
    const unknown = error.status === 404 || /not found/i.test(error.message || '');
    if (!unknown) {
      console.error('[auth.reset] generateLink failed:', error.status, error.message);
      return {
        ok: false,
        message: error.status === 429
          ? 'Too many reset requests just now. Please wait a minute and try again.'
          : 'We could not send a reset link just now. Please try again shortly.',
      };
    }
    return neutral;
  }

  const tokenHash = data?.properties?.hashed_token;
  if (!tokenHash) {
    console.error('[auth.reset] generateLink returned no hashed_token');
    return { ok: false, message: 'We could not send a reset link just now. Please try again shortly.' };
  }

  const link = `${origin}/auth/confirm?token_hash=${encodeURIComponent(tokenHash)}`
    + `&type=recovery&next=${encodeURIComponent('/portal/reset-password')}`;

  const delivery = await sendPasswordResetEmail({ to: target, link });
  if (!delivery.sent) {
    console.error('[auth.reset] could not deliver reset email:', delivery.reason);
    return { ok: false, message: 'We could not send a reset link just now. Please try again shortly.' };
  }

  return neutral;
}
