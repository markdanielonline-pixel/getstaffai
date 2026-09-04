# Forensic / hardening backlog — NOT for this session

Deferred by explicit directive on 2026-09-04. This session finishes functional
production acceptance only. A comprehensive forensic/security/reliability sweep
happens in a **new session** after functional completion.

Rule in force: if a finding directly prevents the required safe customer
journey, fix it. Otherwise record it here and continue immediately. Do not
investigate these further in this session.

## Observability / attribution

- **No per-task model, token or cost attribution.** `execution_logs` has the
  right shape but is empty for every org; its only writer `lib/engine.js` is
  orphaned and the live Provision path never writes it. Blocks usage billing
  and cost-anomaly detection. Explicitly not a launch gate.
- **Alpha's serving model unconfirmed.** Alpha's successful task
  (Provision task `01m1q44s6sm9ww4vktk7fdr6zm`, 2026-09-04T21:10:39–21:10:54Z)
  returned the correct token, but which model served it was never confirmed
  from the OpenRouter activity log.

## Auth / UX

- **Supabase built-in SMTP is the mail sender** (`noreply@mail.app.supabase.io`).
  Delivery is verified working, but it is rate limited (we hit
  "email rate limit exceeded" during testing) and unbranded. Move Auth email to
  the existing Resend integration before real signup volume.

- **EA dashboard panel is honest but not wired.** Fabricated activity was
  removed and replaced with real empty states; it is still not connected to
  live conversation state.

## Infrastructure hardening

- **OpenClaw is installed into the runtime, not baked into the digest-pinned
  image.** The patches at `infra/provision/patches/` make installation
  deterministic and self-verifying; baking it into `AGENT_RUNTIME_IMAGE` would
  remove the class of problem entirely.
- **Provision Laravel emits `http://` absolute redirects** behind the proxy
  (`/` → `http://provision.getstaffai.com/login`). NPM's 301 corrects it, so
  API calls are unaffected. Set `APP_URL` / trusted proxies.
- **Provision integration token rotation** is still deferred. Safe to do now
  that TLS is verified; needs a second valid token for an overlap window.

## Operational traps worth documenting

- **`vercel env ls` shows creation date, not last-modified.** It reported a
  freshly rotated `STRIPE_SECRET_KEY` as `175d ago`, which reads exactly like
  "the change didn't land". Test behavior instead.

## Cleanup

- Delete synthetic audit org `b1972d68-89e3-4530-b833-5777f0e5d534`
  ("SYNTHETIC AUDIT COMPANY - SAFE TO DELETE") and its two employees.
- Tenant Gamma (`markdanielphd+staffai-gamma-0904@gmail.com`) has a CEO record,
  no org, no Stripe customer, no charge.
- Alpha and Beta CEO passwords were administratively reset during acceptance;
  rotate or reset if that is not desired.
