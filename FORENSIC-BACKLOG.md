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

## Added 2026-09-05 (functional session, not investigated further)

### Isolation

- **Tenant runtimes can reach each other's noVNC.** Every
  `provision-runtime-*` container sits on the shared `provision_default` Docker
  network, and each runs an unauthenticated noVNC/websockify on port 6080
  (`x11vnc ... -nopw`). From inside Gamma's container,
  `http://172.24.0.2:6080/` and `/vnc.html` both return **HTTP 200** — that is
  a neighbouring tenant's virtual display. The OpenClaw gateway itself is
  correctly bound to loopback and is *not* reachable, and volumes, tokens and
  ownership labels are properly per-tenant; this is the one hole. Fix by giving
  each runtime its own network, binding 6080 to loopback, or dropping VNC from
  the production image. Confirmed exposure, not a functional blocker.

- **`WorkforceReadiness` trusts the config file, not the live gateway.** It
  checks `openclaw.json`'s agent list, which is why it reported both Gamma
  agents installed while the running gateway answered "Unknown agent". The
  underlying restart bug is fixed, so config and gateway now agree, but
  readiness would not catch a recurrence.

### Billing

- **Two dead Stripe webhook endpoints remain enabled** pointing at
  `getstaffai.com` (`/api/webhooks/stripe` and `/api/billing/webhook`); both
  404. They will accumulate delivery failures and Stripe may auto-disable them.
  Disable or delete once the correct endpoint is live.

- **Hiring does not add a Stripe subscription item.** `hireEmployeeAction`
  installs a real agent and stores `seat_fee_cents` from the catalog, but no
  seat is added to the customer's subscription, so an extra employee is not
  billed. Gated behind the entitlement check, so it cannot be reached by a
  provisional CEO, but it is revenue leakage the moment a tenant is entitled.

- **`vercel env pull` returns empty values for env vars marked sensitive.**
  `PROVISION_BASE_URL`, `PROVISION_INTEGRATION_TOKEN`,
  `STRIPE_PRICE_COMPANY_OFFICE` and the per-role price ids all read as `""`
  locally while working fine in production. Reads exactly like "the variable is
  missing". Related to the existing `vercel env ls` date trap below.

### Provisioning efficiency

- **`runInitialWorkforce` re-runs the whole sequence when readiness evidence
  ages out.** `operational()` requires `checked_at` within 60s, and each hire
  takes ~51s, so the EA's evidence has usually expired by the time the GM
  finishes — the run throws "Readiness evidence expired" and the dashboard's
  auto-resume starts over. It converges (Gamma took about four minutes and three
  passes) but does two to three times the necessary work. Either widen the
  freshness window for the final all-clear or re-sample only the stale ones.

- **`CreateAgentOnServerJob` skips deploy entirely when the agent is already
  `Active`.** Correct for idempotency, but it means re-provisioning can never
  repair a runtime whose config drifted — which is why Gamma needed an explicit
  `RestartGatewayJob` after the pkill fix rather than another retry.

### Data hygiene

- **`role_templates` holds 14 rows that are the same two roles seeded once per
  org**, with no `org_id` column to scope them. `lib/hiring.js` deliberately
  bypasses the table and supplies templates inline. The table should either be
  properly org-scoped or dropped.

### Auth

- **Supabase Site URL is `http://localhost:3000`** and
  `https://app.getstaffai.com/**` is not in the redirect allow-list, so signup
  confirmation lands on a dead page and password reset is a dead end. Recorded
  here as well as in STATE because it is a *blocker*, not a backlog item — it
  needs a console change only Mark can make.

## Added 2026-09-05 from the acceptance run itself

- **`seat_fee_cents` is silently dropped on hire.** `hireAdditionalEmployee`
  passes `seat_fee_cents` and `billing_type` in the persona, but
  `reserve_provisioning_employee` inserts a fixed column list, so Casey was
  created with `seat_fee_cents = 0`. Compounds the unbilled-seat gap already
  recorded: neither the Stripe subscription item nor the local price survives a
  hire.

- **Cross-tenant DELETE answers `{"deleted": true, "already_absent": true}`.**
  Deleting an agent while naming the wrong tenant's organization correctly does
  nothing — verified, both agents survived — but the 200 response reads like
  success. It should be a 404, matching the task endpoint, so a client cannot
  mistake a refused cross-tenant call for a completed one.

- **Every agent install and removal restarts the tenant gateway**, which briefly
  makes the tenant's *other* employees read non-operational. The 20s confirm
  window absorbs it, but each hire and dismissal still visibly flaps the roster
  for a minute. Suppressing readiness demotion while a restart is known to be in
  flight (the `gateway_restart:<serverId>` cache key already exists) would remove
  the flap entirely.

- **The new Stripe endpoint is missing two handled events.**
  `app.getstaffai.com/api/webhooks/stripe` sends `checkout.session.completed`,
  `customer.subscription.deleted` and `invoice.payment_failed`. The handler also
  handles `customer.subscription.updated` and `invoice.payment_succeeded`, so
  renewals and plan changes are not reaching it. Two checkboxes in the Stripe
  dashboard.

- **Orphan unconfirmed auth user** `markdanielonline+staffai-delta-20260905@gmail.com`
  (`eb775249-43cb-49d2-9628-e2f491b04fda`), created when the first acceptance
  signup used a mailbox that turned out not to be the connected one. Delete
  alongside the other cleanup entries.

- **Delta is a real paying tenant.** It carries a live Stripe subscription
  (`sub_1UC9IJBe48ha5T2sbvqmizEV`, trialing, 7-day trial). Cancel it before the
  trial converts if Delta is not meant to be kept.
