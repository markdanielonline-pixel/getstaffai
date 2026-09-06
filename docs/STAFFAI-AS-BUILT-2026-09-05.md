# Staff AI — Complete As-Built System Map and CEO Requirements Audit

**Audit window:** 2026-09-05 21:00 UTC to 2026-09-06 01:00 UTC
**Baseline:** `launch-certified-2026-09-05`
**Method:** direct inspection of both repositories, the production VPS, the Docker
environment, Vercel projects and environment, the Supabase project and its RLS,
the Stripe account, live HTTP probes of every Staff AI hostname, and live
network probes between tenant runtimes. `STATE.md`, `FORENSIC-BACKLOG.md` and git
history were used as supporting evidence only; every load-bearing claim below was
re-verified against the running system.

**Nothing was changed during this audit.** No code, configuration, container,
database row or credential was modified. Two live issues were found that would
normally be fixed on sight; both are reported, not acted on, per the mandate.

Companion diagrams: [`STAFFAI-AS-BUILT-DIAGRAMS-2026-09-05.md`](./STAFFAI-AS-BUILT-DIAGRAMS-2026-09-05.md)

---

# PART 1 — Certified baseline confirmation

| Item | Value | Verified |
|---|---|---|
| StaffAi branch | `codex/reconcile-sept3-20260904` | `git rev-parse --abbrev-ref HEAD` |
| StaffAi HEAD | `2546c499342f1efbc260e48ead4429f3d0b8d541` | `git rev-parse HEAD` |
| StaffAi tag `launch-certified-2026-09-05` | present, points at `2546c499` | `git rev-list -n1` |
| StaffAi tag `functional-acceptance-2026-09-05` | present | `git tag --list` |
| StaffAi tracked working tree | clean (untracked scratch files only) | `git status --porcelain -uno` empty |
| StaffAi remote | `github.com/markdanielonline-pixel/getstaffai`, branch and tags pushed | `git push` output |
| ProvisionCore branch (local) | `p1-initial-workforce` | `git rev-parse --abbrev-ref HEAD` |
| ProvisionCore HEAD | `939d5f6c3e67587f79bfa1109ca2804ee257373e` | `git rev-parse HEAD` |
| ProvisionCore tag `launch-certified-2026-09-05` | present, points at `939d5f6c` | `git rev-list -n1` |
| ProvisionCore tracked working tree | clean | `git status --porcelain -uno` empty |
| **Deployed** ProvisionCore on VPS | `/root/provision-core`, branch `canonical-deploy2`, HEAD `939d5f6c` — **identical to the tag** | ssh + `git rev-parse` |
| Deployed ProvisionCore local modifications | `bootstrap/cache/*.php`, `package-lock.json` only (build artefacts) | `git status` on host |
| Deployed Staff AI app | Vercel project `staffai-app` (`prj_yqXTb7de...`), production deployment `dpl_...3hpt4juby`, built from HEAD `4c77f45` + docs commit `2546c499` | `vercel deploy --prod` result, live behaviour |
| Rollback point | `functional-acceptance-2026-09-05` in both repos, plus `vps-snapshot-20260904` in ProvisionCore | tag list |

**The certified baseline is intact and matches production.** ProvisionCore on the
VPS is byte-identical to the tagged commit. The Vercel deployment is one commit
ahead of nothing — `2546c499` is a documentation-only commit on top of the code
that was deployed and certified.

---

# PART 2 — Status language

`LIVE + PROVEN` · `LIVE + NOT PROVEN` · `PARTIAL` · `BLOCKED` · `PLANNED` · `NOT PRESENT`,
used exactly as defined in the mandate. No status is upgraded on assumption.

---

# PART 3 — Executive system overview

## What Staff AI is today

Staff AI is a multi-tenant SaaS that sells named AI employees on a monthly
subscription. A customer buys a **Company Office** ($199/mo) which provisions an
Executive Assistant and a General Manager, then hires additional specialists as
seats. Each tenant gets a **dedicated Docker container** on a single VPS running
the OpenClaw agent harness; every employee is an agent inside that container with
a shell, outbound web access, a headless browser and a filesystem. The customer
talks to employees in a web chat; messages become tasks dispatched to that
tenant's runtime, executed against a model on OpenRouter, and written back into
the conversation.

It is **three deployed applications plus one control plane**, and they do not all
live in the same place:

1. **Marketing site** — `getstaffai.com` / `www.getstaffai.com`. A static SPA on
   Vercel project **`dist`**, which has **no linked git repository** and no source
   in this workspace.
2. **Product application** — `app.getstaffai.com`. Next.js App Router on Vercel
   project `staffai-app`, built from the `getstaffai` repo. This is the real
   product: signup, billing, dashboard, conversations, workforce, both AI agents.
3. **Provision Core** — `provision.getstaffai.com`. Laravel + Horizon + Reverb on
   the VPS, the authoritative workforce control plane. Owns servers, teams,
   agents and tasks, and is the only thing that touches tenant containers.
4. **Supabase project `StaffAi2`** (`tthoguhefuqnahellnrg`) — authentication and
   the business data model.

## Architectural layers

| Layer | Implementation | Status |
|---|---|---|
| Marketing / acquisition | Static SPA on Vercel (`dist`) | LIVE + PROVEN |
| Business OS / product | Next.js on Vercel (`staffai-app`) | LIVE + PROVEN |
| Identity | Supabase Auth (email + password) | LIVE + PROVEN |
| Business data | Supabase Postgres, 50 tables, RLS enabled on all | LIVE + PROVEN |
| Billing | Stripe live mode, Checkout + one signed webhook | LIVE + PROVEN |
| Workforce control plane | Provision Core (Laravel/Horizon) on VPS | LIVE + PROVEN |
| Workforce execution | Per-tenant Docker container, OpenClaw 2026.7.1-2 | LIVE + PROVEN |
| Model routing | OpenRouter, per-organization policy | LIVE + PROVEN |
| Transactional email | Resend, `getstaffai.com` verified sender | LIVE + PROVEN (see Part 17 caveat) |
| Observability | none for Staff AI | NOT PRESENT |
| Synthetic testing | Playwright, 38 tests, desktop + mobile | LIVE + PROVEN (30/38 running) |
| Reliability engineer | none | NOT PRESENT |
| Social / voice / calendar / accounting | none reachable from an employee | BLOCKED |

## Tenant model

One Supabase row set per organization; one Provision **team** per organization
(keyed by the org UUID as `external_id`); one Provision **server** per team; one
Docker container per server named `provision-runtime-<serverId>`; one OpenClaw
agent per employee inside that container. `organization_members` is the tenant
boundary for humans, `provision_team_id` for runtimes.

## Model / provider architecture

All employee execution goes to **OpenRouter** using a key stored in each tenant
runtime's `.env`. Routing is per organization: `organizations.model_policy`, read
on every agent creation. Null means the customer default `qwen/qwen3.8-flash`;
founder-created organizations are set to `openai/gpt-5-nano`. Staff AI's own
customer-facing agents (sales and success) run on
`openrouter:openai/gpt-5-nano` from the Vercel app.

## Current production boundaries

- Everything customer-facing is on Vercel. Nothing customer-facing runs on the VPS.
- The VPS runs the control plane and every tenant runtime, alongside roughly 35
  unrelated containers from other businesses on a shared Docker network, with
  **no host firewall**.
- The public marketing site and the product application are separate deployments
  with separate source-control situations.

See the diagrams document for the topology, sequence and entity diagrams.

---

# PART 4 — Infrastructure / server map

**Host:** `158.220.123.254`, Ubuntu 24.04.4 LTS, kernel 6.8.0-137,
Docker 29.1.3, Compose 2.40.3, 23 GB RAM (14 used), 387 GB disk (50% used,
194 GB free), uptime 26 days. **`ufw status` = inactive.**

## Staff AI production components

| Component | Container/service | Purpose | Networks | Exposure | Persistence | Status | Evidence |
|---|---|---|---|---|---|---|---|
| Control plane | `provision-app-1` | Laravel API, Horizon queues, Reverb, scheduler | `provision_default`, `provision_control-plane`, `stack_default` | `127.0.0.1:8000`, `127.0.0.1:8086` → public via NPM at `provision.getstaffai.com` | code volume | LIVE + PROVEN | health 302→/login; integration API answers 401 unauthenticated |
| Control-plane DB | `provision-database-1` | MariaDB 11.4, teams/servers/agents/tasks | `provision_default` | container-only :3306 | volume | LIVE + PROVEN | queried live |
| Control-plane cache/queue | `provision-redis-1` | Horizon queues, locks | `provision_control-plane` | container-only | volume | LIVE + PROVEN | Horizon supervisors running |
| Tenant runtime (proof) | `provision-runtime-01m1spw830a4d5f6ddjs414zre` | Pinned Runtime Proof tenant | `provision_default` | `6080/tcp` container-only, bound to 127.0.0.1 inside | 2 volumes | LIVE + PROVEN | OpenClaw 2026.7.1-2, 5493 dist files |
| Tenant runtime (cert) | `provision-runtime-01m1shq8zc51zs57f76vw6nc45` | Certification Co tenant | `provision_default` | as above | 2 volumes | LIVE + PROVEN | running, noVNC closed |
| Reverse proxy / TLS | `stack-npm-1` | nginx-proxy-manager, Let's Encrypt | `stack_default`, `npm_network`, `provision_edge` | `0.0.0.0:80`, `0.0.0.0:443`, `127.0.0.1:81` | volume | LIVE + PROVEN | serves provision.getstaffai.com |

## Orphaned Staff AI runtimes (control-plane drift)

| Container | Image | State | Provision server row | Owner org |
|---|---|---|---|---|
| `provision-runtime-01m1qd8e6qqamtp1v6rjrnz46v` | old `provision-agent-runtime` | **Up 24h** | **none** | unknown |
| `provision-runtime-01m1rxnf7qc5sz9twr9ww6ehm7` | old | Up 10h | **none** | org "Staff AI" points at team `01m1rxnf...` which no longer exists |
| `provision-runtime-01m1ryes3cqz3w74yp1gdhnt35` | old | Up 10h | **none** | org "MDV Group" |
| `provision-runtime-01m1sep628fx4vhtv43k8zv1gj` | `:openclaw-2026.7.1-2` | Up 5h | **none** | org "Launch Verification Co" |
| `provision-runtime-01m1fcybpvhpb420xzn3estc5p` | old | **exited 137** | `running` | Acceptance Alpha |
| `provision-runtime-01m1gy0aec8a7fh1ae88crdf4m` | old | **exited 137** | `running` | Acceptance Beta |
| `provision-runtime-01m1mrgbp9f3d5fdwkeptds6vw` | old | **exited 137** | `running` | Synthetic Audit |
| (none) | — | **missing** | `running` | Acme Corp (`01m17qds...`) |

**Four of six Provision servers are recorded `running` while their container is
exited or absent, and four containers run with no owning server row.** There is
no reconciler between the control plane and Docker reality. Classified `PARTIAL`.

## Legacy and unrelated infrastructure on the same host

Explicitly **not** part of production Staff AI, and must not be mistaken for it:

| Container | What it is | Note |
|---|---|---|
| `staffai-web` (`:3000`, public) | **Legacy `staffai-v2` build**, created 2026-09-04 | Carries the retired five-tier price IDs (OPERATOR/ACCELERATOR/AUTHORITY/DOMINANCE), `APP_URL=https://getstaffai.com`, `PROVISION_DEFAULT_MODEL=z-ai/glm-4.7`. On **both** `provision_default` and `stack_default`. Publicly reachable on `:3000`. |
| `staffai-reminder-worker` | curl loop every 30s | Polls the **legacy** `staffai-web:3000`, not production |
| `frappe_docker-*` (9 containers) | ERPNext v16 | Beacon's: sites are `tenant1..3.dev.caribbeacon.com` plus one `staffai-cd461b5f.dev.caribbeacon.com` |
| `frappe-provisioner` | site provisioner, `staffai-v2/frappe-provisioner` | runs with `FRAPPE_PROVISION_WEBHOOK_SECRET=dummy-secret` and Beacon's DB root password |
| `lynkwe-calcom` (`:3011`, public) | Cal.com | `NEXT_PUBLIC_WEBAPP_URL=booking.caribbeacon.com` — Beacon's |
| `stack-espocrm-1` (`:8012`, public) | EspoCRM, already installed | not wired to Staff AI |
| `stack-postiz-1` (`:5000`, public) | Postiz social scheduler | not wired to Staff AI |
| `stack-uptime-kuma-1` (`:3001`, public) | Uptime Kuma | 16 monitors, **all Beacon**, zero Staff AI |
| `stack-n8n-1` (`:5678`, public) | n8n | not in any Staff AI path |
| `stack-formbricks-1` | **confirmed compromised**, stopped, `restart=no` | see Part 10 |
| `stack-formbricks-rebuilt-1` | replacement, isolated on `formbricks_db`/`formbricks_edge` | no longer on `stack_default` |
| `stack-authentik-*`, `stack-chatwoot-*`, `lynkwe-*`, `stack-baserow-1`, `stack-wekan-*`, `stack-minio-1`, `stack-temporal-*`, `stack-invoiceshelf-1`, `stack-easyappointments-1`, `stack-ollama-1`, `stack-voice-api-1`, `stack-onboarding-api-1`, `studio9-*`, `portainer` | other businesses / experiments | share `stack_default` with `provision-app-1` |
| `crawl4ai-api` | crash-looping (`Restarting (255)`) | unrelated |
| `/tmp/sms_listener.py` (host process, **not** a container) | root Python HTTP server on `0.0.0.0:8080` since 13 Aug, appends any POST body to `/tmp/sms.log` | see Part 10 |

## Docker networks

| Network | Membership | Note |
|---|---|---|
| `provision_default` | `provision-app-1`, `provision-database-1`, all tenant runtimes, **and `staffai-web`** | tenant runtimes share a network with the control-plane database |
| `provision_control-plane` | `provision-app-1`, `provision-redis-1` | correctly isolated |
| `provision_edge` | `provision-app-1`, `stack-npm-1` | ingress |
| `stack_default` | 35 containers **including `provision-app-1`** | broad blast radius |
| `formbricks_db` / `formbricks_edge` | rebuilt Formbricks only | isolation done correctly |

---

# PART 5 — Domain / application map

| Hostname | DNS | Serves | Auth | TLS / proxy | Production status | Customer-facing |
|---|---|---|---|---|---|---|
| `getstaffai.com` | `216.198.79.1`, `64.29.17.1` (Vercel) | Vercel project **`dist`** — static marketing SPA | none | Vercel | LIVE + PROVEN (`200`, `Server: Vercel`) | yes, entry point |
| `www.getstaffai.com` | `cname.vercel-dns.com` | same `dist` project | none | Vercel | LIVE + PROVEN | yes |
| `app.getstaffai.com` | `216.198.79.65`, `64.29.17.1` (Vercel) | Vercel project **`staffai-app`** — the product | Supabase session for `/portal/*` | Vercel | LIVE + PROVEN | yes |
| `provision.getstaffai.com` | `158.220.123.254` | `provision-app-1` via nginx-proxy-manager | Laravel session for UI; bearer token for `/api/integrations/staffai/*` | Let's Encrypt via NPM | LIVE + PROVEN (`302 → /login`) | no, internal |
| `158.220.123.254:3000` | direct IP | **legacy `staffai-web`** | — | none (plain HTTP) | LIVE, legacy | should not be |
| `158.220.123.254:3001/5678/8010/8011/8012/8013/8085/9005/…` | direct IP | Uptime Kuma, n8n, Baserow, Wekan, EspoCRM, EasyAppointments, Frappe, Portainer, … | each app's own | none | LIVE, unrelated | no |

**Two findings.**

1. `app.getstaffai.com/` returns **307 → `getstaffai.com`** for anonymous
   visitors. The product's own marketing pages (`/pricing`, `/how-it-works`,
   `/why-staffai`, `/the-talent-pool`, `/qa`, `/roadmap`) are live and reachable
   on `app.` but the root sends visitors to the static site instead. The AI Sales
   Agent lives only on `app.` (see Part 14).
2. The VPS still holds an **nginx-proxy-manager host for `getstaffai.com` /
   `www.getstaffai.com` pointing at `staffai-web:3000`**. DNS no longer points
   there, so it is inert — but if DNS were ever repointed at the VPS, the retired
   five-tier product would be served as the marketing site.

---

# PART 6 — Customer journey, browser to completed work

| # | Step | Frontend | Backend | Data | External | Auth | Failure behaviour | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | Visitor lands | `getstaffai.com` static SPA | none | none | — | none | static | LIVE + PROVEN |
| 2 | Public sales conversation | `components/AIChatWidget.js` in the **app** layout | `POST /api/chat` | `sales_leads` | OpenRouter | none | degrades to a plain message; never leaks provider errors | LIVE + PROVEN (endpoint), **PARTIAL (placement)** |
| 3 | Signup | `/portal/signup` + `SignupForm` | `app/actions/auth.js signUp()` | `auth.users`, `ceos` | Supabase | anon | server action error surfaces on page | LIVE + PROVEN |
| 4 | Email confirmation | link → `/auth/callback`, `/auth/confirm` | route handlers | `auth.users.confirmed_at` | Supabase default sender | token | invalid token → login with notice | LIVE + NOT PROVEN (no confirmation email observed in this audit) |
| 5 | Login | `/portal/login` + `LoginForm` | `signInWithPassword` | session cookie | Supabase | password | error rendered | LIVE + PROVEN |
| 6 | Onboarding + organization | `/portal/incorporate` | `app/actions/*`, `lib/onboarding.js` | `organizations`, `organization_members`, `ceos.org_id` | — | session | — | LIVE + PROVEN |
| 7 | Checkout | `/portal/incorporate` | `POST /api/checkout` | `ceos.stripe_customer_id` | Stripe Checkout, `mode=subscription`, `trial_period_days: 7` | session | Stripe-hosted | LIVE + PROVEN |
| 8 | Webhook → entitlement | — | `POST /api/webhooks/stripe` | `ceos.status='active'`, `subscriptions`, `staffai_events` | Stripe signature `STRIPE_WEBHOOK_SECRET` | signature | bad signature → 400; unhandled events ignored | LIVE + PROVEN |
| 9 | Company Office provisioning | `WorkforceProvisioningStatus` | `retryInitialWorkforce` → `lib/workforce.js` | `provisioning_operations`, `employees` | Provision bearer API | session | in-flight guard; 60s backstop resume | LIVE + PROVEN |
| 10 | Team + server + container | — | `POST /integrations/staffai/teams` → `ProvisionDockerServerJob` | Provision `teams`, `servers` | Docker | bearer | job retries; **failure message now names the docker command** | LIVE + PROVEN |
| 11 | Agent install (EA then GM) | — | `POST teams/{id}/agents` → `CreateAgentOnServerJob` | Provision `agents` | Docker exec | bearer | per-server lock, 40 tries, backoff 10/15/20/30 | LIVE + PROVEN |
| 12 | Readiness | dashboard poll | `awaitProvisionAgentOperational` → `GET agents/{id}` | `employees.status` | — | bearer | readers never demote | LIVE + PROVEN |
| 13 | First contact | conversation list | `lib/workforce.js firstContact` | `conversations`, `messages`, `notifications` | — | — | idempotent | LIVE + PROVEN |
| 14 | Customer sends work | conversation page | `POST /api/employees/chat` (`maxDuration = 300`) | `messages` (ceo), `employee_tasks` | Provision | session + ownership check | 409 with detail on pre-flight failure | LIVE + PROVEN |
| 15 | Task dispatch | — | `dispatchTaskToAgent` → `POST /integrations/staffai/tasks` | `employee_tasks.provision_task_id` | Provision | bearer | **`429 Too Many Attempts` under concurrency** | PARTIAL |
| 16 | Model call | — | OpenClaw inside the tenant container | — | OpenRouter | runtime `.env` key | provider error can be returned as a *successful* result | PARTIAL |
| 17 | Tool execution | — | OpenClaw built-ins: shell, fetch, headless browser, files | — | open internet | — | — | LIVE + PROVEN |
| 18 | Result | — | `pollProvisionTask` in the customer's own request | `employee_tasks.result` | — | — | 504 at 300s | LIVE + PROVEN |
| 19 | **Durable delivery** | conversation page load | `reconcileConversationTasks` | `messages` (`delivered_by: reconcile`), `employee_tasks.delivered_at` | Provision | session | idempotent on task id | LIVE + PROVEN |

**Gaps in this journey that do not exist at all:**

- No email is sent by Staff AI at signup; confirmation is Supabase's own sender.
- No onboarding, welcome, trial-ending or renewal email exists.
- No push, SMS or mobile notification on task completion.
- No customer-visible task queue or progress indicator between steps 14 and 19.

**End-to-end evidence (this audit's fresh tenant, "Pinned Runtime Proof"):**
organization created in the UI 21:15:09 UTC → workforce `ready` 21:19:45 →
real task returning live page content and `uname -r` output 21:33:41 → six
specialist hires each active in ~90s → five role-certification tasks executed →
two results delivered by the reconcile path after their originating request died.

---

# PART 7 — Authentication and authorization

| Capability | Implementation | Status |
|---|---|---|
| Supabase project in use | `tthoguhefuqnahellnrg` ("StaffAi2"). The similarly named "StaffAi" project `vrophknoancgiutaokwb` is **INACTIVE** and unused. | LIVE + PROVEN |
| Signup | `supabase.auth.signUp` with `emailRedirectTo=/auth/callback` | LIVE + PROVEN |
| Email confirmation | `/auth/callback`, `/auth/confirm` route handlers | LIVE + NOT PROVEN |
| Login | `signInWithPassword` | LIVE + PROVEN |
| Password reset | `resetPasswordForEmail` → `/portal/reset-password`; deliberately does not reveal whether an address exists | LIVE + PROVEN |
| Session handling | Supabase SSR cookies via `lib/supabase/server.js` | LIVE + PROVEN |
| **Google OAuth** | **Not enabled and not present in the UI.** No `signInWithOAuth`, no provider button in `LoginForm`/`SignupForm`. Intentionally removed. | NOT PRESENT (by decision) |
| **NextAuth + Authentik** | `auth.js` + `/api/auth/[...nextauth]` are deployed, configured for **Beacon's** Authentik (`auth.caribbeacon.com`), with no env set. `GET /api/auth/providers` returns **500** in production. | PARTIAL — dead code, live error surface |
| RBAC | none beyond `organization_members.role` (recorded, not enforced anywhere) | NOT PRESENT |
| Organization membership | `organization_members`, enforced by `listOrganizationsForCeo` and `switchOrganizationAction` | LIVE + PROVEN |
| Tenant authorization | every org-scoped query filters `ceo.org_id`; Provision cross-checks `external_id` and `team_id` on every agent operation and aborts 409 on mismatch | LIVE + PROVEN |
| Founder / internal | `ceos.is_founder` + `lib/entitlement.js isEntitled()` — exactly two sources, a real Stripe subscription or an explicit founder grant | LIVE + PROVEN |
| Employee permissions | none. `role_templates.required_tools` and the `capabilities` array sent to Provision are stored and **never provision or restrict anything** | NOT PRESENT |
| Approval model | `Approval` model exists in Provision; Staff AI shows an "Approval inbox" that is always empty; no approval is ever created | PLANNED |
| Service-to-service | Staff AI → Provision: bearer token compared with `hash_equals`, group throttled at 120 req/min. Worker routes: `lib/worker-auth.js` bearer check, 401 otherwise | LIVE + PROVEN |

---

# PART 8 — Control plane and data model

Supabase `public` schema holds **50 tables**. RLS is **enabled on all 50**.
23 have no policy at all, which under RLS is fail-closed for client roles; the
service role used by server actions bypasses RLS entirely.

Architecture-critical entities and the tenant boundary are in the diagrams
document (section 3). Key relationships:

- `ceos.id` **is** `auth.users.id`. There is no separate user table.
- `ceos.org_id` is the **active** organization; `organization_members` is the set
  the CEO may switch between. Both are required for access.
- `organizations.provision_team_id` binds a tenant to its Provision team.
  `employees.provision_agent_id` binds an employee to its agent.
- `employee_tasks` is the durable task record: `provision_task_id`,
  `metadata.conversation_id`, `delivered_at`.

**Tenant isolation enforcement, three layers:**

1. **Application** — every query is filtered by `ceo.org_id`; hiring, dismissal
   and dispatch all re-load the employee scoped to the org.
2. **RLS** — `auth.uid() = ceo_id` on `ceos`, `employees`, `conversations`,
   `messages`, `notifications`, `support_tickets`; `organizations` readable only
   through a matching `organization_members` row.
3. **Control plane** — Provision aborts 409 if an agent's `team_id` or
   `server_id` does not match the team named in the request.

**Two data-model concerns found:**

- The Supabase project is **shared with Beacon's data model**: `beacon_accounts`,
  `beacon_account_members`, `beacon_member_desk_roles`, `businesses`,
  `business_profiles`, `bookings`, `quotes`, `reviews`, `veritas_*`, `wallets`,
  `wallet_transactions` all live in the same `public` schema.
- `role_templates` holds only two distinct roles (Executive Assistant, Sales
  Development Representative) duplicated seven times each — dead seed data. Real
  role definitions now come from `lib/roles/playbooks.js`.

---

# PART 9 — Provision Core and OpenClaw

## Execution architecture

Staff AI → `https://provision.getstaffai.com/api/integrations/staffai/*` with a
bearer token. Nine endpoints: upsert/show team, upsert dispatcher, upsert agent,
show/destroy agent, dispatch/show task. Whole group throttled `120,1`.

Server identity is a 26-character ULID; the container is
`provision-runtime-<lowercased serverId>`, and `DockerExecutor` refuses to act on
any container whose `provision.server-id` / `provision.team-id` labels do not
match, and refuses to touch the legacy shared runtime at all.

- **Runtime creation** — `ProvisionDockerServerJob` → `DockerExecutor::ensureRuntime()`:
  inspect, verify labels and both volume mounts, else create from
  `config('provision.docker.runtime_image')` with `--restart unless-stopped`,
  `--security-opt no-new-privileges:true`, then start.
- **Image pin** — production `.env` sets
  `PROVISION_DOCKER_RUNTIME_IMAGE=sha256:986c1f50086971e42010cef5a948808f2f488f5b53064ab0de89f001f4be158a`
  and `OPENCLAW_VERSION=2026.7.1-2`. Verified in the running app:
  `config('provision.docker.runtime_image')` returns that digest.
- **Agent install** — `CreateAgentOnServerJob`, `tries = 40`,
  `backoff = [10,15,20,30]`, guarded by `Cache::lock('docker-runtime:'.$serverId, 360)`.
- **Readiness** — `WorkforceReadiness::inspect()` accepts both the `agents.list`
  (2026.7) and `agents.entries` (2026.9) config shapes.
- **Gateway** — one OpenClaw gateway per tenant container, restarted with
  `pkill -f "openclaw[- ][g]ateway"` then
  `setsid nohup openclaw gateway … < /dev/null & disown`.
- **Result retrieval** — Staff AI polls `GET tasks/{externalId}`;
  `pollProvisionTask` persists status and `result_summary` into `employee_tasks`.
- **Durable delivery** — `reconcileConversationTasks` on conversation load.
- **Dismissal** — `DELETE agents/{externalId}` with `team_external_id` = org UUID,
  then `DestroyTeamJob` for a whole tenant (verified: destroying the failed
  "Cert Two" tenant removed team, server, container and both volumes cleanly).

## The OpenClaw version-drift / mixed-dist incident — root cause and correction

`AgentUpdateScriptService` emitted:

```sh
PINNED_OPENCLAW_VERSION='2026.7.1-2'
OPENCLAW_DIST_CHECK='node -e ...'
flock /var/lock/openclaw-install.lock -c 'sh -c "$OPENCLAW_DIST_CHECK" \
  || rm -rf /usr/lib/node_modules/openclaw; \
  openclaw update --tag "$PINNED_OPENCLAW_VERSION" --yes --json \
  || npm install -g "openclaw@$PINNED_OPENCLAW_VERSION"'
```

`flock -c` runs its payload in a **new shell**. Neither variable was exported, so
the payload saw both as empty:

- `npm install -g "openclaw@"` → npm resolves `openclaw@*` → **newest release**.
- `sh -c ""` → exit 0 → the corrupt-tree cleanup **never ran**, so the new build
  was layered over the old one, producing the mixed `dist/` whose gateway returns
  500 with `ENOENT`.

Every agent install and every agent update therefore took the tenant off the pin,
no matter what the image carried. **Direct evidence before the fix:** the
Certification Co runtime's npm debug log records
`verbose argv "install" "--global" "openclaw@"`, and its
`/usr/lib/node_modules/openclaw/package.json` read `2026.9.2` while Provision's
own database recorded `2026.7.1-2` for that same server.

**Correction (`939d5f6c`):** the version and the integrity check are interpolated
as **literals**, matching the already-correct path in `ChatGPTAuthService`; an
empty pin now raises instead of emitting an unpinned install; the regression test
that had asserted the broken form now asserts the literal and rejects the variable
form. Verified on the live control plane — the generated script contains:

```
... openclaw update --tag '2026.7.1-2' --yes --json || npm install -g 'openclaw@2026.7.1-2'
```

**Recurrence prevention, proven not asserted:** on the fresh tenant, after six
agent installs (EA, GM and four specialists), the runtime still reports
`OpenClaw 2026.7.1-2 (0790d9f)` with an intact 5,493-file `dist/`, and the
container's npm logs contain **zero** `openclaw@` install attempts.

## Known behaviour: hiring interrupts the tenant

Installing or dismissing an employee restarts that tenant's **single shared
gateway** (`AgentInstallScriptService` line 313/319, `OpenClawDriver::restartGateway`).
The whole workforce for that customer is briefly offline and in-flight work on
that runtime can be terminated.

**Mitigation implemented:** `/api/employees/chat` calls
`awaitProvisionAgentOperational(…, 90s)` before dispatch, so a message sent during
the window is delayed rather than lost.

**Classification: PARTIAL — architectural.** The mitigation covers the customer's
*next* message; it does not protect a task already running when a hire lands. A
real fix is per-agent isolation or a gateway reload that does not drop sessions.
This is a design property of one-gateway-per-tenant, not a bug to patch.

## Concurrency behaviour (measured this audit)

- Five simultaneous dispatches returned **five `409 Too Many Attempts`** from the
  Provision integration API (group throttle `120,1` shared across all tenants).
- Of five tasks that did run concurrently on one runtime, **two ended
  `fetch failed`** and **one returned the runtime's own `LLM request timed out`
  text as its answer**.
- The same five tasks run one at a time all succeeded.

---

# PART 10 — Tenant isolation and security

## Status of the previously identified cross-tenant noVNC exposure

**Fixed at the image level; one pre-fix container is still exposed.**

Probe run from inside the fresh tenant runtime against every other running
runtime on `provision_default`:

| Target runtime | Image | noVNC :6080 from another tenant |
|---|---|---|
| `01m1spw830a4d5f6ddjs414zre` (self, loopback) | pinned digest | **200** (expected, `127.0.0.1`) |
| `01m1shq8zc51zs57f76vw6nc45` | post-fix | **refused** |
| `01m1sep628fx4vhtv43k8zv1gj` | post-fix | **refused** |
| `01m1rxnf7qc5sz9twr9ww6ehm7` | post-fix | **refused** |
| `01m1ryes3cqz3w74yp1gdhnt35` | post-fix | **refused** |
| **`01m1qd8e6qqamtp1v6rjrnz46v`** | **pre-fix**, up 24 h, **orphan with no server row** | **200 — unauthenticated desktop reachable from another tenant** |

The entrypoint fix (`x11vnc … -localhost`, `websockify … 127.0.0.1:6080`) is
correct and effective. One container created before it is still running and still
exposed. It has no owning Provision server row, so no customer depends on it.

## Isolation matrix

| Control | Finding | Status |
|---|---|---|
| Database isolation | Single Supabase Postgres, logical isolation by `org_id` + RLS. Shared with Beacon tables. | PARTIAL |
| RLS | Enabled on all 50 tables; correct owner policies on the customer-facing ones | LIVE + PROVEN |
| Runtime isolation | One container per tenant, ownership-labelled, `no-new-privileges` | LIVE + PROVEN |
| Docker network isolation | Tenant runtimes **can reach `provision-database-1:3306`, `provision-app-1:8000` and `staffai-web:3000`**; cannot reach `provision-redis-1` or anything on `stack_default` | **PARTIAL — control-plane DB port reachable from every tenant agent** |
| Redis isolation | `provision_control-plane` only; unreachable from tenants | LIVE + PROVEN |
| Runtime ownership | Label check on create, exec and destroy; refuses mismatches | LIVE + PROVEN |
| Cross-tenant communication | Only via the one legacy container above | PARTIAL |
| Egress | Tenant runtimes have unrestricted internet egress (required for research) | by design |
| Secrets | OpenRouter key inside each runtime `.env`; Provision team API keys encrypted at rest; Vercel env encrypted and now unreadable via CLI | LIVE + PROVEN |
| Privileged APIs | Provision integration API bearer-authenticated, 401 verified unauthenticated | LIVE + PROVEN |
| External attack surface | **No host firewall.** ~20 services listening on `0.0.0.0` | **BLOCKED-grade risk** |

## Unresolved 2026-08-31 security incident

`STATE.md` records a **confirmed compromise of `stack-formbricks-1`**:
unauthorized RandomX mining as root, modified writable layer, credential
exposure, with the container attached to `stack_default` — the same network
`provision-app-1` is still on. Verified now: the container is **still stopped
with `restart=no`** and the replacement runs on isolated networks. Good.

But the recorded remediation state is: **"No credentials rotated"**, and the
verdict was **"MUST REMAIN PAUSED / NO-GO"**. Confirmed exposed and, per the
record, still unrotated:

- shared PostgreSQL superuser credential (Authentik, Chatwoot, Cal.com and
  others), which the record notes also matches MariaDB root and MinIO root;
- an SMTP credential reused by six containers;
- a **Stripe secret key ("Beacon2", suffix `vwX3`) on account
  `acct_1JCwmmBe48ha5T2s`** — the *same live Stripe account Staff AI bills
  through*. Rotation was started and blocked at Stripe's identity-verification
  dialog and never completed.

Staff AI's own `STRIPE_SECRET_KEY` is a different key on that account, so the
product itself was not using the exposed one — but a key that can create charges
and refunds on Staff AI's live account has been exposed for six days.

## Other exposure found in this audit

| Finding | Detail | Severity |
|---|---|---|
| `ufw` inactive | Verified `Status: inactive`. Externally confirmed reachable from outside: Uptime Kuma `:3001` (302), Portainer `:9005` (307), EspoCRM `:8012` (200), n8n `:5678` (200), Frappe `:8085` (404), legacy staffai-web `:3000` (307) | HIGH |
| Root Python listener on `0.0.0.0:8080` | `/tmp/sms_listener.py`, running as root since 13 Aug (23 days), appends **any** POST body from **any** internet host to `/tmp/sms.log`. Content reviewed: benign leftover debug webhook, not malicious. Unauthenticated unbounded disk write. | MEDIUM |
| Pre-fix noVNC container | `provision-runtime-01m1qd8e...`, above | MEDIUM |
| Tenant → control-plane DB reachability | any tenant agent can open TCP to `provision-database-1:3306` | MEDIUM |
| `provision-app-1` on `stack_default` | reachable from 34 unrelated containers, which is exactly the path the incident report flagged | MEDIUM |
| `provision.getstaffai.com` redirect downgrade | `Location: http://provision.getstaffai.com/login` (HTTP, not HTTPS) | LOW |
| `/api/auth/providers` returns 500 | dead NextAuth/Authentik handler publicly exposed | LOW |
| No `robots.txt` on the marketing site | `404` | LOW |

No credential values appear anywhere in this document.

---

# PART 11 — Model and AI routing

| Path | Implementation | Credential | Status | Evidence |
|---|---|---|---|---|
| Gateway/provider layer | **OpenRouter** for everything | `OPENROUTER_API_KEY` in Vercel; a key inside each tenant runtime `.env` | LIVE + PROVEN | live sales response returned `"model":"openrouter:openai/gpt-5-nano"` |
| Customer default model | `qwen/qwen3.8-flash` via `organization.model_policy \|\| PROVISION_DEFAULT_MODEL \|\| 'qwen/qwen3.8-flash'` in `lib/provision.js` | runtime key | LIVE + PROVEN | all five role certifications ran on it |
| Founder / internal routing | `createOrganizationAction` sets `model_policy = 'openai/gpt-5-nano'` on founder-created orgs | runtime key | LIVE + PROVEN | three founder orgs carry it; the fresh proof org was moved to the customer default for certification |
| Per-organization routing | `organizations.model_policy`, re-read on **every** agent creation | — | LIVE + PROVEN | survives provisioning, re-provisioning, hiring, runtime replacement |
| Per-role routing | none | — | NOT PRESENT | `provisionAgentRuntime` has no role branch |
| Staff AI's own agents | `lib/sales/model.js`: OpenRouter preferred, `openai/gpt-5-nano`; Google Gemini 2.5 Flash as historical fallback; reports "no usable credential" rather than leaking a provider error | `OPENROUTER_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY` | LIVE + PROVEN | live probe |
| **DeepSeek reliability model** | not referenced in any live path | — | **NOT PRESENT** | `deepseek` appears only in the dead `lib/llm/router.js` and in `lib/roles/playbooks.js` prose |
| Fallback behaviour | Sales/success: OpenRouter → Google → honest degradation. Employee execution: **no fallback** — a provider failure surfaces as a failed or garbage task | — | PARTIAL | two `fetch failed` and one `LLM request timed out` observed |
| Legacy 4-tier router | `lib/llm/router.js` (DeepSeek R1 / Grok 4 / Claude Sonnet ceilings) | — | NOT PRESENT (dead) | imported by nothing |
| Economics | `openai/gpt-5-nano` $0.05/$0.40 per M; `qwen/qwen3.8-flash` $0.15/$0.47 per M — founder routing is *cheaper* than the customer default, not free | — | verified earlier this week | recorded in `STATE.md` |

**Unverified:** `deepseek/deepseek-v4-pro` availability at $0.85/$1.70 per M is
carried from an earlier session's note. Not re-verified in this audit, and
nothing consumes it.

---

# PART 12 — Employee / role capability matrix

Every runtime ships the **same** toolset: shell, outbound web fetch, headless
browser, filesystem. `required_tools` and `capabilities` are recorded and
provision nothing. A role is therefore distinguished **only by its brief**
(`lib/roles/playbooks.js`) and by whether the systems its advertised outcome
needs are reachable from the employee.

## SELLABLE TODAY

| Role | Playbook | Model | Tools available | Integrations | Tested production task | Evidence | Status |
|---|---|---|---|---|---|---|---|
| **Executive Assistant** (Company Office) | `company_office` | org policy | shell, web, browser, files | none | fetch a live page and run a shell command | returned `Example Domain` and `6.8.0-137-generic`; `PINNED_RUNTIME_PROOF_OK` | LIVE + PROVEN |
| **General Manager** (Company Office) | `company_office` | org policy | same | none | provisioned and active on the fresh tenant; **no GM-specific task executed** | agent active, no conversation opened for GM | LIVE + NOT PROVEN |
| **Administrative Assistant** | `administrative_assistant` | `qwen/qwen3.8-flash` | shell, web, browser, files | none | extract every plan and price published on the pricing page | returned all twelve products at correct prices matching `lib/billing/catalog.js`, saved raw evidence, flagged the page is bot-walled | LIVE + PROVEN |
| **Lead Generation Specialist** | `lead_generation_specialist` | `qwen/qwen3.8-flash` | shell, web, browser, files | none (no Outscraper in the employee path) | find three real operating Austin bookkeeping firms | Ameen & Momin CPA, Financial Foothold, Bargsley Totaro Andrews & Steinbach — real URLs opened, addresses, phones, quoted services | LIVE + PROVEN |
| **Marketing Manager** | `marketing_manager` | `qwen/qwen3.8-flash` | shell, web, browser, files | none | positioning brief vs a named competitor | rendered the SPA with headless Chrome, chose Lindy, wrote a brief to file, cited four URLs, named a real gap | LIVE + PROVEN |
| **Marketing Specialist** | `marketing_specialist` | `qwen/qwen3.8-flash` | shell, web, browser, files | none | 120-word landing section from on-site claims only | publishable copy + URL used; delivered via the reconcile path | LIVE + PROVEN |
| **Customer Service Representative** | `customer_service_representative` | `qwen/qwen3.8-flash` | shell, web, browser, files | none | what the Company Office includes and costs | $199/mo with the exact inclusion list, terms, trial, and an explicit statement of three things the site does not say | LIVE + PROVEN |

Permissions for all of the above: none beyond the runtime. Knowledge/context: the
role brief plus `ceo.business_description`; **no company knowledge base, no
document store, no memory beyond a 20-entry `employees.memory.recent` list**.
Workflows: none — each is a single request/response task.

## COMING SOON (implemented as a role, refused at hire)

| Role | Blocker | What would make it genuinely production-capable |
|---|---|---|
| **Bookkeeper** | `accounting_system` unreachable. No `FRAPPE_*` or `INFISICAL_*` in production; `lib/frappe.js` defaults to `http://frappe-provisioner:9000` (a Docker name Vercel cannot resolve) and Infisical at `158.220.123.254:8080` — **no Infisical container exists**; the running ERPNext is Beacon's | Staff AI's own Frappe deployment or site namespace, a public HTTPS endpoint, credentials in Vercel, a per-tenant site provisioning flow, and an employee-callable ledger tool |
| **Receptionist** | `calendar_booking` + `telephony`. No Cal.com instance or key of Staff AI's own; `TELNYX_MESSAGING_PROFILE_ID` set without `TELNYX_API_KEY`; no employee path places or answers a call | Staff AI Cal.com, a Telnyx key and number, inbound voice webhook wiring, and an employee-callable booking tool |
| **Social Media Manager** | `social_publishing`. No OutReply credentials in production, no publish path, and no per-customer social account connection flow | OutReply credentials, an account-connect screen storing `page_id` per org, and an employee-callable publish tool |
| **Sales Representative** | `outbound_email` + `crm`. `lib/tools/send_email` (Resend) and `lib/crm/moxie.js` exist and `MOXIE_API_KEY` is set, but `lib/engine.js` — the only module that registers a tool for an employee — is **imported by nothing** | A tool bridge the OpenClaw agent can call, plus a CRM decision (Moxie is out; EspoCRM is already running on the host, Frappe CRM is the reuse option) |

Both **Sales Team** and **Marketing Team** are catalog bundles. They are excluded
from `HIREABLE_ROLES` (bundles are filtered out), so they can be **bought at
checkout** but not hired from the roster. Each contains at least one Coming Soon
role (Sales Representative; Social Media Manager). **Neither bundle should be
sold today.**

## NOT IMPLEMENTED

No role has: a knowledge base, document memory, scheduled/recurring work, multi
step workflows, delegation between employees (`delegation_enabled = false` on
every agent), KPI tracking, or performance review — all of which the marketing
site and `the-talent-pool` page imply.

---

# PART 13 — Founder / internal Staff AI

| Requirement | Implementation | Status |
|---|---|---|
| Founder entitlement | `ceos.is_founder = true` + `isEntitled()`; label shown honestly as "Founder access" | LIVE + PROVEN |
| No fake Stripe subscription | Verified: `subscriptions` table has **0 rows**; all 9 Stripe subscriptions on the account are `canceled` | LIVE + PROVEN |
| Billing bypass | entitlement has exactly two sources; founder grant is one | LIVE + PROVEN |
| Multiple organizations | Mark is a member of **5**: Staff AI, MDV Group, Launch Verification Co, Certification Co, Pinned Runtime Proof | LIVE + PROVEN |
| Organization selector | `components/OrganizationSwitcher.js` — full-width select plus create form | LIVE + PROVEN |
| Same customer paths | organization creation, provisioning, hiring, dismissal, conversations all use the identical code paths | LIVE + PROVEN |
| EA/GM provisioning | proven twice today on founder orgs | LIVE + PROVEN |
| Employee hiring | six hires today, each active in ~90s | LIVE + PROVEN |
| Task execution | proven on EA and five specialists | LIVE + PROVEN |
| Founder model policy | `openai/gpt-5-nano` set automatically on founder-created orgs | LIVE + PROVEN |
| **Mobile / PWA** | responsive layout only. **No manifest, no service worker, not installable** (`/manifest.json`, `/manifest.webmanifest`, `/sw.js` all 404) | NOT PRESENT |

**What Mark can do today from his phone,** in a mobile browser at
`app.getstaffai.com` (not an installed app):

log in; see the Command Center; switch between his five companies; create a new
company and watch it provision; open the AI Workforce roster and see real runtime
state; hire any of the five sellable roles; dismiss a specialist; open a
conversation with any employee; send real work and receive a real result; read
support tickets in Settings; reach the authenticated Success Agent.

**What he cannot do from his phone:** install it as an app, receive any
notification, approve anything (the approval inbox is empty by construction),
or see billing beyond a "Manage billing" link.

**Three of his five organizations are broken.** "Staff AI", "MDV Group" and
"Launch Verification Co" are all `workforce_status = retryable` and point at
Provision teams (`01m1rxnf…`, `01m1ryes…`, `01m1sep6…`) that **no longer exist in
the Provision database** — casualties of the control-plane loss on 2026-09-04.
Their containers are still running as orphans. Only Certification Co and Pinned
Runtime Proof are healthy.

---

# PART 14 — Public AI Sales Agent

**Determination: Staff AI has a genuine public AI Sales Agent, and it is not on
the website customers visit.**

The widget (`components/AIChatWidget.js`) is mounted in the **Next.js app's**
root layout and posts to `/api/chat` for anonymous visitors. The marketing site
at `getstaffai.com` is a separate static Vercel project whose only outbound
references to the app are a login link and a signup button — verified by fetching
`/src/main.js` and `/src/content-pages.js`. So the agent is reachable at
`app.getstaffai.com/pricing` and similar, but **not at `getstaffai.com`**, and
`app.getstaffai.com/` itself 307-redirects anonymous visitors away to the static
site.

| Capability | Status | Evidence / note |
|---|---|---|
| Placement on the marketing site | **NOT PRESENT** | static SPA carries no agent |
| Placement on the app's public pages | LIVE + PROVEN | widget in root layout |
| Product knowledge | LIVE + PROVEN | derived from `lib/billing/catalog.js` at build time |
| Pricing knowledge | LIVE + PROVEN | live probe returned $199/mo, $1,990/yr correctly |
| Role knowledge | LIVE + PROVEN | catalog-derived |
| Company Office knowledge | LIVE + PROVEN | live probe listed EA + GM, trial, guarantee |
| Trial / guarantee knowledge | LIVE + PROVEN | 7-day trial, 30-day guarantee both stated correctly |
| States what is *not* ready | LIVE + PROVEN | `lib/sales/product-knowledge.js` includes an explicit no-telephony instruction |
| FAQs | PARTIAL | answers from the catalog prompt; no FAQ corpus |
| Objection handling | PARTIAL | model-improvised, no playbook |
| Company qualification | PARTIAL | asks about the business, no scoring or routing |
| Recommended workforce generation | PARTIAL | recommends in prose; no structured basket, no cart |
| Lead capture | **LIVE + NOT PROVEN** | `captureLead` tool writes `sales_leads`; **the table has 0 rows** — no lead has ever been captured in production |
| Signup / checkout routing | LIVE + PROVEN | returns the real signup URL |
| Follow-up creation | NOT PRESENT | `sales_followups` scaffolding exists; nothing dispatches |
| Escalation to Mark | NOT PRESENT | the sales agent has no escalate tool |
| AI-guided product demonstration | NOT PRESENT | no demo flow of any kind |
| Voice capability | NOT PRESENT | — |
| Durable prospect context | NOT PRESENT | each request is stateless; only the browser holds the thread |

The authenticated Success Agent is a **separate** endpoint and is not being
counted here.

---

# PART 15 — Authenticated Customer Success

`POST /api/support/agent`, same widget, selected when the visitor is inside
`/portal`. Verified unreachable without a session (Playwright asserts this).

| Capability | Status | Note |
|---|---|---|
| Knows Staff AI deeply | LIVE + PROVEN | shares the catalog-derived product knowledge |
| Knows authorized customer context | LIVE + PROVEN | loads the caller's organization and workforce |
| Answers product questions | LIVE + NOT PROVEN | no production transcript reviewed in this audit |
| Answers operational questions | PARTIAL | can describe workforce state; cannot inspect runtime health |
| Can perform safe actions | **NOT PRESENT** | its only tool is `escalate`; it cannot retry provisioning, restart a runtime, or re-send anything |
| Diagnoses common problems | NOT PRESENT | no diagnostic access |
| Creates durable escalations | LIVE + PROVEN | inserts `support_tickets`; **2 rows exist** |
| Follows unresolved issues | NOT PRESENT | no follow-up loop |
| Escalates to a human | PARTIAL | writes a ticket and emails `STAFFAI_SUPPORT_EMAIL`; no SLA, no queue, no assignment |
| Preserves conversation context | NOT PRESENT | stateless per request |

Its instruction set is notably honest: *"Never tell a customer to contact support
— you are support, and escalation is your job, not theirs."* The gap is that it
has no ability to act on anything it diagnoses.

---

# PART 16 — Billing / Stripe

Live account `acct_1JCwmmBe48ha5T2s`, display name **StaffAi**, US,
`charges_enabled = true`. **This account is shared** with Beacon, Lynkwe, DRM and
Cal.com — ten webhook endpoints are registered on it, seven of them Beacon's.

| Item | Finding | Status |
|---|---|---|
| Pricing | 12 products, monthly + annual, matching `lib/billing/catalog.js` and the live site | LIVE + PROVEN |
| Products/prices in env | 24 `STRIPE_PRICE_*` variables set in Vercel production; 8 retired ones (`OPERATOR`, `ACCELERATOR`, `AUTHORITY`, `DOMINANCE` ±annual) still present but unused by the catalog | LIVE + PROVEN / cleanup pending |
| Customer creation | `/api/checkout` creates or reuses `ceos.stripe_customer_id` | LIVE + PROVEN |
| Checkout | `mode: 'subscription'`, `trial_period_days: 7`, success → `/portal/incorporate/success` | LIVE + PROVEN |
| Webhook hostname | `https://app.getstaffai.com/api/webhooks/stripe` — **enabled and correct** | LIVE + PROVEN |
| Webhook signing | `stripe.webhooks.constructEvent` with `STRIPE_WEBHOOK_SECRET`; 400 on bad signature | LIVE + PROVEN |
| Events subscribed | `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed` | PARTIAL |
| Events handled in code but **not delivered** | `customer.subscription.updated` | **PARTIAL — configuration gap** |
| Entitlement | `ceos.status='active'` + `subscriptions` upsert on checkout completion; idempotency via `staffai_events` | LIVE + PROVEN |
| Subscription state | 9 subscriptions on the account, **all `canceled`**; `subscriptions` table has 0 rows | consistent — zero paying customers today |
| Cancellation | `customer.subscription.deleted` handled | LIVE + PROVEN (proven when Delta was cancelled) |
| Billing UI | "Manage billing →" link to `/portal/dashboard/settings`; `/api/billing/portal` exists | LIVE + NOT PROVEN |
| Founder bypass | no Stripe object involved | LIVE + PROVEN |
| **Stale enabled webhook** | `https://getstaffai.com/api/billing/webhook` is **enabled** with 5 events, but that hostname is now the static marketing site — **every delivery 404s** | defect |
| Disabled legacy webhook | `https://www.getstaffai.com/api/stripe-webhook` — disabled, harmless | — |

**Production acceptance evidence** (earlier this week, recorded in `STATE.md`):
tenant "Delta" completed signup → Stripe Checkout → live webhook → entitlement →
provisioning → real task execution, then was cancelled and torn down on
instruction. That is the only real paid journey ever completed.

**Still unproven:** trial-to-paid conversion, renewal, dunning after
`invoice.payment_failed`, plan upgrade/downgrade, seat proration, and the
customer-facing billing portal.

---

# PART 17 — Email / Resend

| Path | Implementation | Status |
|---|---|---|
| Supabase auth email (confirmation, reset) | Supabase's **default** sender; no custom SMTP configured | LIVE + NOT PROVEN |
| Resend credential | replaced by Mark earlier today; `getstaffai.com` verified on that account | LIVE + PROVEN (earlier today) |
| Support / escalation email | `/api/support` and the success agent send to `STAFFAI_SUPPORT_EMAIL` | LIVE + PROVEN (earlier today) |
| Onboarding email | none | NOT PRESENT |
| Reminder email | `/api/worker/reminders` exists; the only caller is `staffai-reminder-worker`, which polls the **legacy** container | PARTIAL |
| Transactional email (trial ending, renewal, receipt, workforce ready) | none | NOT PRESENT |
| Sales email / outreach | none | NOT PRESENT |
| Follow-up email | none | NOT PRESENT |
| Employee email capability | `lib/tools/send_email` exists; unreachable | BLOCKED |

**On the "invalid Resend API key" from the previous known state: it is resolved.**
Mark supplied a new key today, it was set in Vercel production, `getstaffai.com`
is verified on that Resend account, the missing `sales@getstaffai.com` mailbox
was created, Resend's suppression from the earlier hard bounces was cleared, and
a real email sent through the live support workflow reached the inbox.

**Audit limitation, stated plainly:** I could not re-verify the key value in this
audit. Vercel's CLI now returns empty strings for recently-created encrypted
variables, and the Resend account connected to my tooling is a **different**
account (it holds only `caribbeacon.com`). The Resend status above rests on this
morning's live delivery evidence, not on a probe run during this audit.

---

# PART 18 — Lead generation, verification, sales follow-up

| Stage | Implementation | Wired into production? | Status |
|---|---|---|---|
| Lead discovery (automated) | `lib/agents/lead-gen.js` — Outscraper Google Maps `search-v2` with `extract_contacts=true`; `OUTSCRAPER_API_KEY` **is set** in Vercel production | **No — imported by nothing** | NOT PRESENT (dead code) |
| Lead discovery (by employee) | Lead Generation Specialist doing live web research | Yes | LIVE + PROVEN |
| Qualification | none | — | NOT PRESENT |
| Contact discovery | Outscraper contact extraction, in the dead module | No | NOT PRESENT |
| **Email verification** | **No provider is named anywhere** in either repository, `STATE.md`, `FORENSIC-BACKLOG.md`, the launch plan, or the Vercel environment. A Stripe price `STRIPE_PRICE_ADDON_LEAD_VERIFICATION` exists as a purchasable add-on with **no implementation behind it**. | No | **UNKNOWN / NOT PRESENT** |
| Outreach | `lib/tools/send_email` (Resend) | No — `lib/engine.js` imported by nothing | BLOCKED |
| Response / context | `lib/agents/setter.js` (SMS) via `/api/webhooks/telnyx/sms` | Route deployed; requires `TELNYX_PUBLIC_KEY` which is **not set** | BLOCKED |
| Sales follow-up | `sales_followups` scaffolding; no dispatcher | No | PLANNED |
| Conversion / escalation | `lib/agents/closer.js` via `/api/webhooks/telnyx/voice` | Route deployed; unconfigured | BLOCKED |
| CRM | `lib/crm/moxie.js`, called only by `/api/webhooks/systemeio` (Systeme.io funnel webhook from the retired product) | Not in any employee path | NOT PRESENT for the current product |
| Lead capture from the sales agent | `lib/sales/leads.js` → `sales_leads` | Yes | LIVE + NOT PROVEN (**0 rows**) |

**Direct answer on Moxie / send_email / engine.js:** none of them is wired into
the current product's employee execution path. `lib/engine.js` — the only module
that builds a tool registry for an employee — is imported by **no file in the
repository** (verified by full-tree search). `send_email` and `send_sms` are
therefore unreachable regardless of credentials. `moxie.js` is reachable only
from the Systeme.io webhook, which belongs to the retired five-tier funnel.

---

# PART 19 — Social media

| Item | Finding | Status |
|---|---|---|
| OutReply credentials in production | **absent** from Vercel env | BLOCKED |
| OutReply SDK / client code | **none** in the repository | NOT PRESENT |
| Publishing path | none | NOT PRESENT |
| Scheduling | none in Staff AI. `stack-postiz-1` (Postiz) runs on the host, publicly on `:5000`, unconnected to Staff AI | NOT PRESENT |
| Analytics | none | NOT PRESENT |
| Per-customer account connection | **none** — and this is the real gap: OutReply's API needs a `page_id` from an authorised social account per customer, so a connect-accounts screen is required, not just a key | NOT PRESENT |
| Social Media Manager workflows | role brief only; hire refused | BLOCKED |
| Marketing workflows | Marketing Manager and Specialist are certified for research and copy; neither can publish anywhere | PARTIAL by design |

**OutReply is an architectural selection only.** Nothing has been built.

---

# PART 20 — Voice, telephony, calendar

| Item | Finding | Status |
|---|---|---|
| `TELNYX_API_KEY` | **not set** in production | BLOCKED |
| `TELNYX_MESSAGING_PROFILE_ID` | set (176 days) | — |
| `TELNYX_PUBLIC_KEY` (webhook signature) | **not set** — `lib/telnyx-webhook.js` requires it | BLOCKED |
| Inbound SMS | `/api/webhooks/telnyx/sms` → `lib/agents/setter.js` deployed | BLOCKED (unconfigured) |
| Inbound voice | `/api/webhooks/telnyx/voice` → `lib/agents/closer.js` deployed | BLOCKED (unconfigured) |
| Outbound SMS | `lib/tools/send_sms` exists, unreachable | BLOCKED |
| Outbound voice | none | NOT PRESENT |
| Phone numbers | none provisioned for Staff AI | NOT PRESENT |
| Voice model / provider | `stack-voice-api-1` runs on the host (`:8002`, public) and is not referenced by Staff AI | NOT PRESENT |
| Cal.com | `lynkwe-calcom` runs on the host but is configured for `booking.caribbeacon.com` — **Beacon's**. Staff AI has none. Zero `cal.com` references in the Staff AI repository | NOT PRESENT |
| Scheduling / booking | none | NOT PRESENT |
| Receptionist workflows | role brief only; hire refused | BLOCKED |
| Consent / opt-out handling | none | NOT PRESENT |
| Call context persistence | `sms_conversation_memory` table exists, unused | PLANNED |

Everything in this part is **architecture only**. Nothing is production-ready.

---

# PART 21 — Observability

| Component | Present? | Connected to Staff AI? |
|---|---|---|
| Prometheus | **no container anywhere** | — |
| Grafana | **no container anywhere** | — |
| Loki | no | — |
| Tempo | no | — |
| OpenTelemetry | no instrumentation in either repository | — |
| Grafana Alloy | no | — |
| Uptime Kuma | **yes**, `stack-uptime-kuma-1`, healthy, public on `:3001` | **No.** 16 monitors, every one a `caribbeacon.com` host or a Beacon backup push. **Zero Staff AI monitors** |
| Application telemetry | `console.log`/`console.error` to Vercel runtime logs only | partial |
| Provision telemetry | Laravel log at `/root/provision-core/storage/logs/laravel.log` (25 MB, unrotated) + Horizon UI | partial |
| Runtime telemetry | per-container `docker logs`; agent gateway log inside each container | partial |
| Task telemetry | `employee_tasks` rows and Provision `tasks` rows | partial |
| Model/provider failure alerting | none | NOT PRESENT |
| Customer-journey failure alerting | none | NOT PRESENT |
| Billing failure alerting | none | NOT PRESENT |
| Alerts of any kind | none for Staff AI | NOT PRESENT |

**Nobody is watching Staff AI.** Every failure found in this audit — four dead
tenant runtimes, a 504 losing customer work, a stale Stripe webhook 404ing, a
crash-looping container — was found by looking, not by being told.

A meaningful detail: the Provision log is *only* readable because it is
unrotated; it is 25 MB and growing on a 194 GB-free disk with no logrotate rule.

---

# PART 22 — Playwright / synthetic customer

`playwright.config.js`: `workers: 1`, `retries: 1` in CI, `trace`/`video`
retain-on-failure, `screenshot` only-on-failure, base URL
`https://app.getstaffai.com`. **Two projects**: `desktop` (Desktop Chrome) and
`mobile` (Pixel 7). 19 tests × 2 projects = 38 runs.

| Suite | Tests | Covers |
|---|---|---|
| `public-journey.spec.js` | 6 | login page offers no sign-in method that cannot work; signup accepts required details; pricing states what checkout sells; `/api/health`; **the public sales agent never returns a raw provider error to a visitor**; the authenticated success agent is unreachable signed-out |
| `product-consistency.spec.js` | 3 (one parameterised over 7 pages) | no retired product language on any of 7 public pages; the billing catalog still matches the live site; the sales agent never quotes a price the catalog does not contain |
| `customer-journey.spec.js` | 4 | signed-in customer: real account facts in the chrome, real roster + runtime state, entitlement gate agrees with the displayed plan; founder: reaches the product without buying it and can switch companies |

**Last run: 30 passed, 8 skipped, 1.9 minutes.**

## What the 8 skipped tests mean

All 8 are the 4 `customer-journey` tests × 2 projects, skipped by
`test.skip(!EMAIL || !PASSWORD, …)` and `test.skip(!FOUNDER_EMAIL || !FOUNDER_PASSWORD, …)`.

They are **the only tests that exercise anything behind a login**. With them
skipped, the suite proves the public surface and product-price consistency and
proves *nothing at all* about the product a paying customer uses. Specifically,
none of this is currently covered by automation:

- that a signed-in customer's dashboard shows their real account rather than
  placeholder copy;
- that the workforce roster reflects real runtime state;
- that the entitlement gate and the displayed plan agree — the exact class of bug
  that let an unentitled tenant look entitled;
- that founder access works without a purchase, and that organization switching works.

Required to enable them, as four environment variables:
`STAFFAI_E2E_EMAIL`, `STAFFAI_E2E_PASSWORD`, `STAFFAI_E2E_FOUNDER_EMAIL` and
`STAFFAI_E2E_FOUNDER_PASSWORD`.

**They should be synthetic accounts, not Mark's personal credentials.** The
customer pair should be a dedicated entitled test tenant; the founder pair is the
awkward one, because founder access is a property of a specific CEO row. The
right answer is a **second founder-granted CEO** created for testing
(`is_founder = true`, a synthetic mailbox), never Mark's own login. Storing
Mark's password in CI would put a live billing-capable account into a secret
store for no benefit.

Not covered by any test, at any level: provisioning, hiring, dismissal, task
execution, delivery, webhooks, or the Provision API. There are **no unit or
integration tests in the Staff AI repository at all** — Playwright is the entire
test suite. ProvisionCore has a Pest suite (including the OpenClaw pin regression
test updated in this baseline) which was **not run during this audit**.

---

# PART 23 — Reliability engineer

**NOT PRESENT.** Nothing exists.

No DeepSeek integration in any live path. No monitoring inputs (there is no
monitoring). No diagnostic agent, no remediation permissions model, no safety
boundaries, no reversible-action allowlist, no retest loop, no incident
documentation pipeline, no escalation, no scheduled health check, and no
incident-triggered investigation.

The only automated health signal that exists at all is `staffai-reminder-worker`
curling `/api/health` on the **legacy** container every 30 seconds, and nothing
consumes its result.

---

# PART 24 — PWA / mobile

| Item | Finding | Status |
|---|---|---|
| Installability | **no** | NOT PRESENT |
| Web app manifest | `/manifest.json` and `/manifest.webmanifest` both **404**; no `manifest` reference in `app/layout.js` | NOT PRESENT |
| Service worker | `/sw.js` **404**; no service worker in the repository | NOT PRESENT |
| `theme-color`, apple touch icons, splash | none | NOT PRESENT |
| Responsive interface | yes — the whole portal is fluid; `OrganizationSwitcher` is explicitly built phone-first | LIVE + PROVEN |
| Login on mobile viewport | covered by the `mobile` Playwright project | LIVE + PROVEN |
| Founder mode on mobile | covered by a Playwright test — **currently skipped** | LIVE + NOT PROVEN |
| EA/GM conversation on mobile | not covered | LIVE + NOT PROVEN |
| Employee management on mobile | not covered | LIVE + NOT PROVEN |
| Approvals | nothing to approve | NOT PRESENT |
| Billing on mobile | not covered | LIVE + NOT PROVEN |
| Notifications | `notifications` table is written; **no push, no email, no badge** | PARTIAL |
| Real task delegation from mobile | not covered by automation | LIVE + NOT PROVEN |

**All mobile evidence to date is browser emulation** — Playwright's Pixel 7
device profile and a 1280×900 desktop viewport in the in-app browser during this
audit. **Nothing has been tested on a physical mobile device.** An earlier
session recorded a founder journey "on a phone-sized viewport", which is
emulation, not a handset.

---

# PART 25 — Staff AI running Staff AI (Customer Zero)

Mark's own "Staff AI" organization exists and has an EA and a GM — but it is one
of the three organizations whose Provision team was lost on 2026-09-04. Its
`workforce_status` is `retryable` and its runtime is an orphaned container with no
control-plane record. **Staff AI's own workforce is currently down.**

| Function | State | Detail |
|---|---|---|
| Executive assistance | **BLOCKED** | EA exists in the "Staff AI" org; its Provision team is gone |
| GM / company coordination | **BLOCKED** | same |
| Lead generation | **PARTIAL** | the capability is certified — on *other* tenants. Staff AI's own org cannot run it today |
| Lead qualification | PLANNED | no qualification logic anywhere |
| Sales | **PARTIAL** | the public Sales Agent works, but is not on the marketing site and has captured 0 leads |
| Sales follow-up | PLANNED | no dispatcher |
| Marketing | PARTIAL | Marketing Manager and Specialist certified on other tenants; nothing scheduled or recurring |
| Social media | BLOCKED | no OutReply, no publish path |
| Customer success | PARTIAL | the Success Agent answers and escalates; it cannot act |
| Support / escalation | PARTIAL | `support_tickets` (2 rows) + email; no queue, no assignment, no SLA |
| Reporting | PLANNED | `board_reports` table exists, unused |
| Bookkeeping / finance | BLOCKED | no accounting system reachable |
| Receptionist | BLOCKED | no calendar, no phone |
| Voice outreach | BLOCKED | no Telnyx key |

## Can Staff AI currently use Staff AI to operate Staff AI?

**No.**

Precisely: Staff AI can *demonstrate* to itself that its employees do real work —
that has been proven repeatedly today on two healthy tenants. But it cannot
operate itself, for three independent reasons.

1. Its own organization's workforce is **down** (orphaned runtime, missing team).
2. Even healthy, its employees can only research, analyse and draft. They cannot
   send an email, publish a post, book a meeting, make a call, or record a
   transaction — so no business function completes end to end without a human
   carrying the output somewhere else.
3. There is no scheduling, no recurring work and no delegation between employees,
   so nothing runs unless Mark types a message.

Staff AI is Customer Zero for **workforce provisioning and task execution**. It is
not yet Customer Zero for **running a company**.

---

# PART 26 — External dependency / integration inventory

| Service | Purpose | Account? | Credential configured? | Production configured? | Integration implemented? | Integration proven? | Required for launch? | For which capability | Who acts | Exact next requirement |
|---|---|---|---|---|---|---|---|---|---|---|
| **Supabase** (`StaffAi2`) | auth + business data | yes | yes | yes | yes | yes | **Yes** | everything | — | none |
| **Vercel** | hosts marketing site + app | yes | yes | yes | yes | yes | **Yes** | everything | — | link the `dist` project to a git repo |
| **Stripe** | billing | yes (shared account) | yes | yes | yes | yes | **Yes** | subscriptions | Mark (key rotation) | complete identity verification, revoke the exposed `vwX3` key, delete the stale `getstaffai.com/api/billing/webhook` endpoint, add `customer.subscription.updated` |
| **OpenRouter** | model gateway | yes | yes | yes | yes | yes | **Yes** | all agents | — | none |
| **OpenAI (direct)** | `OPENAI_API_KEY` set | yes | yes | yes | not used by any live path | n/a | No | — | — | remove or adopt |
| **Google Generative AI** | sales-agent fallback | yes | yes | yes | yes | not proven | No | fallback only | — | none |
| **Qwen** (via OpenRouter) | customer default model | n/a | via OpenRouter | yes | yes | yes | **Yes** | all customer employees | — | none |
| **Resend** | transactional email | yes | yes | yes | yes | yes (this morning) | **Yes** | support + escalation | — | none |
| **DeepSeek** | reliability engineer | no | no | no | **no** | no | No | reliability engineer | Claude then Mark | build it first |
| **Telnyx** | SMS + voice | yes | **key now supplied, not yet installed** | no | webhooks only | no | No | Receptionist, SMS | Mark (number) then Claude | install key, buy/authorise a number, set `TELNYX_PUBLIC_KEY` |
| **Cal.com** | booking | **no Staff AI account** | no | no | **no code at all** | no | No | Receptionist | Mark | create a Staff AI Cal.com account or instance |
| **OutReply** | social publishing | yes | **token now supplied, not yet installed** | no | **no code at all** | no | No | Social Media Manager | Mark then Claude | install token, connect at least one social page, build publish tool |
| **Frappe / ERPNext** | accounting ledger | Beacon's instance only | no | no | partial (`lib/frappe.js`) | no | No | Bookkeeper | Mark (decision) then Claude | decide dedicated vs shared deployment |
| **Infisical** | secret storage for Frappe | **no container exists** | no | no | referenced in `lib/frappe.js` | no | No | Bookkeeper | Claude | drop it and use Vercel env, or deploy it |
| **Outscraper** | lead/contact data | yes | yes (176 d) | yes | dead module | no | No | automated lead gen | Claude | wire it or delete it |
| **Moxie** | CRM | yes | yes | yes | retired-funnel webhook only | no | **No — being replaced** | Sales Representative | Mark (decision) | choose Frappe CRM or EspoCRM |
| **Systeme.io** | retired funnel | yes | — | webhook route live | yes | — | No | retired product | Claude | delete the route |
| **Authentik** | SSO | Beacon's | no | no | NextAuth handler returns 500 | no | No | none | Claude | delete `auth.js` and the route |
| **DNS / domain provider** | `getstaffai.com` | yes | — | yes | — | yes | **Yes** | all hostnames | — | none |
| **Email verification / contact data** | verify prospect emails | **UNKNOWN** | no | no | **no** | no | No | Lead Gen add-on already priced in Stripe | Mark (choose vendor) | pick a provider, or unpublish the add-on |
| **Hetzner/VPS provider** | the host | yes | — | yes | — | yes | **Yes** | control plane + runtimes | Mark | none |

---

# PART 27 — CEO ACTIONS — WHAT CLAUDE NEEDS FROM MARK

---

### 1. Complete Stripe identity verification and revoke the exposed key

**PRIORITY: LAUNCH BLOCKER**

**WHAT:** Finish the Stripe identity-verification step that is blocking key
rotation, then revoke the exposed secret key on the Staff AI account.

**WHY:** A secret key on the live account Staff AI bills through was exposed in
the 2026-08-31 compromise and, per the record, has never been rotated. Anyone
holding it can create charges and refunds on the account that will take real
customer money.

**EXACTLY WHAT MARK MUST DO:** Open the Stripe dashboard, complete the identity
verification prompt (security key, or email plus additional verification), then
in Developers → API keys revoke the secret key named **Beacon2** (suffix `vwX3`).
Cal.com uses that key, so revoke it after telling me, and I will confirm nothing
of Staff AI's breaks.

**WHAT CLAUDE WILL DO AFTERWARD:** Verify Staff AI's own key still works,
re-run the paid-journey check, delete the stale `getstaffai.com/api/billing/webhook`
endpoint, and add `customer.subscription.updated` to the live endpoint.

**CREDENTIAL/INFORMATION REQUIRED:** none from you to me — confirmation only.

**EXPECTED RESULT:** No exposed credential can move money on the account that
processes customer payments.

---

### 2. Decide and complete credential rotation for the shared compromised secrets

**PRIORITY: LAUNCH BLOCKER**

**WHAT:** Authorise, and where the provider requires an account owner, perform
rotation of the shared PostgreSQL superuser credential (which also matches
MariaDB root and MinIO root) and the SMTP credential reused by six containers.

**WHY:** These were confirmed exposed six days ago and have not been rotated.
They are not Staff AI's own credentials, but they are on the same host that runs
Staff AI's control plane and every tenant runtime.

**EXACTLY WHAT MARK MUST DO:** Tell me to proceed, and accept that rotating them
will briefly interrupt Authentik, Chatwoot, Cal.com, Postiz, Temporal, MinIO and
InvoiceShelf — all Beacon and Lynkwe services, none of them Staff AI. Confirm you
are willing to take that interruption, and when.

**WHAT CLAUDE WILL DO AFTERWARD:** Rotate each credential, update every consumer
from the mapping already captured in `postgres-consumers.json`, restart the
dependent services and verify each one comes back.

**CREDENTIAL/INFORMATION REQUIRED:** none — a decision and a maintenance window.

**EXPECTED RESULT:** No known-exposed credential remains live on the host that
runs Staff AI.

---

### 3. Authorise host firewall and legacy shutdown

**PRIORITY: LAUNCH BLOCKER**

**WHAT:** Approve enabling a host firewall on the VPS and stopping the legacy
`staffai-web` container.

**WHY:** `ufw` is inactive and about twenty services are reachable from the open
internet on raw ports, including Portainer, n8n, EspoCRM, Baserow, Wekan and
MinIO. Separately, a legacy Staff AI build serving the retired five-tier pricing
is publicly reachable on port 3000. This is a first-paying-customer risk and a
brand risk.

**EXACTLY WHAT MARK MUST DO:** Confirm two things: (a) that only ports 22, 80 and
443 need to be open to the internet, and everything else can be reached through
the reverse proxy or over SSH; (b) that the legacy `staffai-web` container and
its reminder worker can be stopped. If you use any of those raw ports directly
from your laptop, tell me which and I will keep them open to your IP.

**WHAT CLAUDE WILL DO AFTERWARD:** Enable `ufw` with that policy, stop the legacy
container and its worker, remove the stale nginx host that maps
`getstaffai.com` to it, kill the root `/tmp/sms_listener.py` process, and stop the
one pre-fix tenant container that still exposes noVNC.

**CREDENTIAL/INFORMATION REQUIRED:** none.

**EXPECTED RESULT:** The host presents SSH plus HTTP/HTTPS to the internet, and
nothing retired is publicly serving Staff AI branding.

---

### 4. Decide the CRM

**PRIORITY: ROLE ACTIVATION** (Sales Representative)

**WHAT:** Choose between Frappe CRM on Staff AI's own Frappe deployment, and
EspoCRM, which is already installed on the host.

**WHY:** Moxie is out. The Sales Representative cannot be sold until an employee
can record a touch somewhere real.

**EXACTLY WHAT MARK MUST DO:** Pick one. My recommendation is **Frappe CRM**,
because it shares the deployment, tenant model, auth and API that the Bookkeeper
will need anyway, so one decision serves two roles.

**WHAT CLAUDE WILL DO AFTERWARD:** Build the CRM tool the employee can call, wire
it per tenant, and certify the Sales Representative against a real prospect record.

**CREDENTIAL/INFORMATION REQUIRED:** none if Frappe (it follows item 5); an admin
API key if EspoCRM.

**EXPECTED RESULT:** Sales Representative moves from Coming Soon to sellable.

---

### 5. Decide the Frappe/ERPNext deployment model

**PRIORITY: ROLE ACTIVATION** (Bookkeeper, and CRM if item 4 goes Frappe)

**WHAT:** Choose between a dedicated Frappe/ERPNext deployment for Staff AI, and
a separate site namespace on the instance already running.

**WHY:** The running stack is Beacon's — its sites are on `dev.caribbeacon.com`,
its provisioner runs with a placeholder webhook secret and Beacon's database
password. Staff AI production has no Frappe configuration at all, and the code
points at Docker-internal hostnames that Vercel cannot resolve.

**EXACTLY WHAT MARK MUST DO:** Pick one, and confirm a subdomain for customer
ledgers (I suggest `books.getstaffai.com`, with each tenant at
`<tenant>.books.getstaffai.com`). My recommendation is a **dedicated deployment**:
you are about to sell to strangers, and "our accounting runs on the same instance
as the founder's other company" is not a question you want to answer in a
customer's diligence.

**WHAT CLAUDE WILL DO AFTERWARD:** Deploy or namespace it, put a public HTTPS
endpoint in front of it, replace the Infisical dependency with Vercel environment
variables, wire per-tenant site provisioning, build the ledger tool, and certify
the Bookkeeper against a real transaction.

**CREDENTIAL/INFORMATION REQUIRED:** a DNS record I can point (or permission to
add it), and confirmation of the subdomain.

**EXPECTED RESULT:** Bookkeeper moves from Coming Soon to sellable.

---

### 6. Create a Staff AI Cal.com account or instance

**PRIORITY: ROLE ACTIVATION** (Receptionist)

**WHAT:** A Cal.com account or self-hosted instance belonging to Staff AI.

**WHY:** The Cal.com on the host is configured for `booking.caribbeacon.com` and
serves Beacon. Projects do not share infrastructure, and the Receptionist cannot
book anything without a calendar of its own.

**EXACTLY WHAT MARK MUST DO:** Either sign up for a Cal.com plan for Staff AI and
give me an API key, or tell me to self-host a second instance on the VPS and give
me a subdomain to use.

**WHAT CLAUDE WILL DO AFTERWARD:** Build the client-facing booking layer with
Cal.com as the engine, wire per-tenant event types, and certify the Receptionist.

**CREDENTIAL/INFORMATION REQUIRED:** `CALCOM_API_KEY` (name only), or hosting
approval plus a subdomain.

**EXPECTED RESULT:** The booking half of the Receptionist becomes real.

---

### 7. Buy or authorise a Telnyx phone number

**PRIORITY: ROLE ACTIVATION** (Receptionist, SMS)

**WHAT:** A production phone number on the Telnyx account, and confirmation of
which messaging profile it belongs to.

**WHY:** You have given me the API key. A key alone cannot answer a call or send
a text — a number must exist and be attached to a profile, and purchasing it
spends money on your account.

**EXACTLY WHAT MARK MUST DO:** In the Telnyx portal, buy one number, attach it to
the existing messaging profile, and tell me the number. Also tell me whether
Staff AI may use it for outbound SMS to customers' prospects, which has
regulatory consequences I should not decide for you.

**WHAT CLAUDE WILL DO AFTERWARD:** Install the API key and public key in Vercel,
point the SMS and voice webhooks at the live routes, wire the SMS tool into the
employee tool bridge, and certify the SMS path.

**CREDENTIAL/INFORMATION REQUIRED:** the phone number, and `TELNYX_PUBLIC_KEY`
(name only — it is in the portal under the webhook signing settings).

**EXPECTED RESULT:** Staff AI can send and receive SMS on its own number.

---

### 8. Connect at least one social account inside OutReply

**PRIORITY: ROLE ACTIVATION** (Social Media Manager)

**WHAT:** Authorise a Facebook, Instagram or LinkedIn page inside OutReply so a
`page_id` exists.

**WHY:** You have given me the OutReply token. Their API needs a `page_id` from an
authorised page; the token alone cannot publish anywhere.

**EXACTLY WHAT MARK MUST DO:** In OutReply, connect one social account — Staff
AI's own is the right first one — and tell me it is done. I will read the page id
through the API.

**WHAT CLAUDE WILL DO AFTERWARD:** Install the token, build the publish tool and
the per-customer account-connect screen, and certify the Social Media Manager
against a real scheduled post.

**CREDENTIAL/INFORMATION REQUIRED:** none beyond the token already supplied.

**EXPECTED RESULT:** Social Media Manager moves from Coming Soon to sellable.

---

### 9. Choose an email-verification provider, or unpublish the add-on

**PRIORITY: POST-LAUNCH**

**WHAT:** Decide whether Staff AI verifies prospect email addresses, and with whom.

**WHY:** A Stripe price called **Lead Verification** exists as a purchasable
add-on with **no implementation behind it and no provider named anywhere**. It
should not be sellable in that state.

**EXACTLY WHAT MARK MUST DO:** Either name a provider and create an account, or
tell me to archive the Stripe price. Either answer is fine; leaving it as-is is
the only bad option.

**WHAT CLAUDE WILL DO AFTERWARD:** Wire the provider into the lead pipeline, or
archive the price and remove any reference to it.

**CREDENTIAL/INFORMATION REQUIRED:** the provider's API key (name only), if you
choose one.

**EXPECTED RESULT:** Nothing is purchasable that does not exist.

---

### 10. Decide the fate of the three stranded organizations

**PRIORITY: POST-LAUNCH** (but it blocks Staff AI running Staff AI)

**WHAT:** Approve re-provisioning "Staff AI", "MDV Group" and "Launch Verification
Co", whose Provision teams were lost on 2026-09-04.

**WHY:** Their runtimes are orphaned containers with no control-plane record.
Re-provisioning creates fresh runtimes; the old containers get destroyed. This is
destructive to whatever state is inside them, so I am not doing it unasked.

**EXACTLY WHAT MARK MUST DO:** Confirm nothing inside those three runtimes needs
preserving, and that I may destroy the orphaned containers and re-provision.

**WHAT CLAUDE WILL DO AFTERWARD:** Destroy the orphans, re-provision each
organization through the normal path, and verify a real task on each.

**CREDENTIAL/INFORMATION REQUIRED:** none.

**EXPECTED RESULT:** Staff AI's own workforce is alive again, which is the
precondition for Staff AI running Staff AI.

---

### 11. Approve creating synthetic test accounts

**PRIORITY: POST-LAUNCH**

**WHAT:** Approve creating a dedicated entitled test tenant and a second
founder-granted CEO for automated testing.

**WHY:** The 8 skipped Playwright tests are the only automated coverage of the
signed-in product. Enabling them needs credentials, and those must not be yours.

**EXACTLY WHAT MARK MUST DO:** Confirm I may create two accounts on mailboxes you
control (`markdanielphd+staffai-e2e@gmail.com` and
`markdanielphd+staffai-founder-e2e@gmail.com` would do), and that the test tenant
may hold a real Stripe subscription on a test-friendly plan or a founder grant.

**WHAT CLAUDE WILL DO AFTERWARD:** Create them, store the four variables in
Vercel and locally, and turn the 8 skipped tests on permanently.

**CREDENTIAL/INFORMATION REQUIRED:** none — I generate and store the passwords.

**EXPECTED RESULT:** The signed-in customer journey is covered by automation on
every run.

---

## A. MARK MUST DO BEFORE LAUNCH

1. Complete Stripe identity verification and revoke the exposed key (item 1).
2. Authorise rotation of the shared compromised credentials and give me a window (item 2).
3. Approve the host firewall and legacy shutdown (item 3).

## B. MARK CAN DO TO ACTIVATE COMING-SOON ROLES

4. Decide the CRM (item 4) → Sales Representative.
5. Decide the Frappe deployment model (item 5) → Bookkeeper.
6. Provide a Staff AI Cal.com account or instance (item 6) → Receptionist.
7. Buy a Telnyx number and confirm outbound SMS policy (item 7) → Receptionist, SMS.
8. Connect one social account in OutReply (item 8) → Social Media Manager.

## C. MARK CAN DO AFTER LAUNCH

9. Choose an email-verification provider or unpublish the add-on (item 9).
10. Approve re-provisioning the three stranded organizations (item 10).
11. Approve creating synthetic test accounts (item 11).

**None of items 4 through 11 blocks launch.** Staff AI can sell the Company
Office plus five certified specialists without any of them.

---

# PART 28 — ENGINEERING WORK CLAUDE CAN COMPLETE WITHOUT MARK

| # | Issue / capability | Priority | Current status | Work required | Risk | Before launch? |
|---|---|---|---|---|---|---|
| 1 | **Put the AI Sales Agent on the marketing site** | Critical | agent LIVE, but only on `app.` | Either embed the widget into the `dist` SPA pointing at `app.getstaffai.com/api/chat` with CORS, or move the marketing pages onto the app project | Low | **Yes** |
| 2 | **Control plane vs Docker reconciler** | Critical | 4 of 6 servers `running` with no live container | A scheduled job that compares `servers` to `docker ps`, marks reality, and alerts | Low | **Yes** |
| 3 | **Any monitoring at all for Staff AI** | Critical | zero monitors | Add Uptime Kuma monitors for `getstaffai.com`, `app.getstaffai.com/api/health`, `provision.getstaffai.com`, plus a per-tenant runtime check | Low | **Yes** |
| 4 | Delete the stale Stripe webhook endpoint and add `customer.subscription.updated` | High | stale endpoint 404s on every delivery | Two Stripe API calls | Low | **Yes** |
| 5 | Provision dispatch queueing / backoff | High | five concurrent dispatches → five 409s | Client-side serialisation per tenant in `lib/provision.js`, or raise the throttle for the integration token | Low | **Yes** |
| 6 | Catch provider errors masquerading as results | High | `LLM request timed out` was written into a customer conversation as the employee's answer | Detect runtime-error shapes in `result_summary` and present a real failure instead | Low | **Yes** |
| 7 | Remove the dead NextAuth/Authentik handler | Medium | `/api/auth/providers` returns 500 publicly | Delete `auth.js` and the route | Low | Yes |
| 8 | Log rotation on the Provision host | Medium | 25 MB unrotated `laravel.log` | logrotate rule | Low | Yes |
| 9 | Employee tool bridge | High | `lib/engine.js` unreachable; no employee can call any Staff AI tool | Authenticated per-employee, per-tenant endpoint the OpenClaw agent can call; handlers added per integration | Medium | No — but it unblocks four roles |
| 10 | Unique employee names within an organization | Medium | two hires both named "Taylor (AI)" | Check existing names at generation | Low | Yes |
| 11 | Remove the retired five-tier Stripe price variables | Low | 8 unused `STRIPE_PRICE_*` in production | Delete from Vercel | Low | No |
| 12 | Delete the retired Systeme.io webhook route | Low | live route for a dead funnel | Delete | Low | No |
| 13 | Decide the fate of `lib/agents/*`, `lib/llm/router.js`, `lib/engine.js`, `lib/tools`, `lib/crm/moxie.js` | Medium | dead code that looks live and misleads audits | Delete or adopt each | Low | No |
| 14 | PWA manifest and service worker | Medium | not installable | Manifest, icons, minimal offline shell | Low | No |
| 15 | Customer-visible task progress | Medium | a long task looks like nothing is happening | Show queued/running tasks in the conversation from `employee_tasks` | Low | No |
| 16 | Fix the `provision.getstaffai.com` HTTP redirect downgrade | Low | `Location: http://…` | NPM setting | Low | No |
| 17 | Move `provision-app-1` off `stack_default` | High | reachable from 34 unrelated containers | Give it a dedicated network with only what it needs | Medium — needs care with NPM routing | No |
| 18 | Block tenant runtimes from the control-plane database | High | every tenant agent can open `provision-database-1:3306` | Put the DB on `provision_control-plane` only | Medium | No |
| 19 | Run the ProvisionCore Pest suite in this baseline | Medium | not run during this audit | `php artisan test` on the host or locally | Low | Yes |
| 20 | GM-specific certification task | Low | GM active but never given work | One real coordination task | Low | Yes |

---

# PART 29 — LAUNCH BLOCKERS

Strictly: things that mean Staff AI should not accept a paying customer today.
An incomplete future role is **not** a blocker.

### B1 — An exposed Stripe secret key on the live billing account has not been revoked

**Evidence:** `STATE.md` incident record — key "Beacon2", suffix `vwX3`, account
`acct_1JCwmmBe48ha5T2s` (StaffAi), confirmed exposed 2026-08-31; rotation was
started, blocked at Stripe's identity-verification dialog, and never completed;
the record states "No credentials rotated". The account is live and
`charges_enabled = true`.
**Impact:** anyone holding that key can create charges and refunds against the
account that will take real customer money.
**Owner:** Mark (identity verification is account-owner only), then Claude.
**Resolution:** CEO action item 1.
**Verification:** the key no longer authenticates; Staff AI's own key still does;
a fresh paid journey completes.

### B2 — Confirmed compromised shared credentials remain live on the host that runs the control plane and every tenant runtime

**Evidence:** confirmed root-level cryptominer in `stack-formbricks-1`, which was
attached to `stack_default`; `provision-app-1` is **still on `stack_default`**
(verified in this audit); exposed PostgreSQL superuser, SMTP and MinIO/MariaDB
root credentials, none rotated; blast radius formally recorded as INCONCLUSIVE.
**Impact:** an attacker with those credentials has a plausible path to the
Provision control plane, which owns every tenant runtime.
**Owner:** Mark (authorisation and window), then Claude.
**Resolution:** CEO action item 2, plus engineering item 17.
**Verification:** every exposed credential rotated, every consumer restarted and
healthy, and `provision-app-1` no longer sharing a network with unrelated services.

### B3 — The host has no firewall and exposes ~20 services to the internet

**Evidence:** `ufw status` = inactive. Externally confirmed reachable from
outside the host: Portainer `:9005` (307), n8n `:5678` (200), EspoCRM `:8012`
(200), Uptime Kuma `:3001` (302), Frappe `:8085` (404), legacy Staff AI `:3000`
(307). Plus a root Python process on `0.0.0.0:8080` writing any POST body to
`/tmp/sms.log`.
**Impact:** the machine holding every customer's runtime has a wide management
surface open to the internet, on a box with an unresolved compromise.
**Owner:** Mark (one confirmation), then Claude.
**Resolution:** CEO action item 3.
**Verification:** external scan shows only 22, 80 and 443.

### B4 — The AI Sales Agent is absent from the website customers actually visit

**Evidence:** `getstaffai.com` is Vercel project `dist`, a static SPA; its
`main.js` and `content-pages.js` reference `app.getstaffai.com` only as login and
signup links. The widget is mounted in the **app's** layout. `app.getstaffai.com/`
307-redirects anonymous visitors to the static site.
**Impact:** the entire pre-sale experience the launch depends on is invisible to
visitors, and `sales_leads` has **0 rows**, which is consistent with that.
**Owner:** Claude.
**Resolution:** engineering item 1.
**Verification:** a visitor on `getstaffai.com` can open the agent, and a captured
lead appears in `sales_leads`.

### B5 — Nothing monitors Staff AI, and the control plane silently disagrees with reality

**Evidence:** zero Prometheus/Grafana/Loki/Tempo/Alloy/OTel anywhere; Uptime
Kuma's 16 monitors are all Beacon's; four of six Provision servers are recorded
`running` while their container is exited or missing, and nothing noticed.
**Impact:** a paying customer's workforce can be dead while the product reports
it healthy, and no one would know until the customer complained.
**Owner:** Claude.
**Resolution:** engineering items 2 and 3.
**Verification:** a deliberately stopped tenant container raises an alert and is
marked unhealthy in the product within minutes.

### Explicitly **not** launch blockers

Bookkeeper, Receptionist, Social Media Manager and Sales Representative being
Coming Soon; the missing PWA; the absent reliability engineer; the stranded
founder organizations; the dead legacy modules; the 8 skipped Playwright tests.
All are real gaps. None of them means a paying customer would be harmed by
buying the Company Office plus a certified specialist today.

---

# PART 30 — As-built vs product vision gap matrix

| Capability | Current state | Intended state | Gap | Launch blocker? | Owner | Next action |
|---|---|---|---|---|---|---|
| Company Office | LIVE + PROVEN | LIVE | none | No | — | none |
| Executive Assistant | LIVE + PROVEN | LIVE | none | No | — | none |
| General Manager | LIVE + NOT PROVEN | LIVE | never given a real task | No | Claude | one GM certification task |
| 5 certified specialists | LIVE + PROVEN | LIVE | no memory, no scheduling, no workflows | No | Claude | post-launch |
| 4 Coming Soon roles | BLOCKED | LIVE | tool bridge + external systems | No | Mark + Claude | CEO items 4-8, engineering item 9 |
| Team bundles (Sales, Marketing) | purchasable at checkout, contain blocked roles | LIVE | should not be sellable yet | **Yes, minor** | Claude | hide both from checkout |
| Founder / internal | LIVE + PROVEN | LIVE | own workforce is down | No | Mark | CEO item 10 |
| Multi-organization | LIVE + PROVEN | LIVE | 3 of 5 orgs stranded | No | Mark | CEO item 10 |
| Model routing | LIVE + PROVEN | LIVE | no per-role routing, no fallback | No | Claude | post-launch |
| Public Sales Agent | LIVE + PROVEN endpoint, **absent from the marketing site** | on every public page | placement | **Yes (B4)** | Claude | engineering item 1 |
| AI-guided sales demo | NOT PRESENT | guided demo | everything | No | Claude | post-launch |
| Customer Success Agent | PARTIAL | can act safely | has only `escalate` | No | Claude | after the tool bridge |
| Lead generation | LIVE + PROVEN (by employee) | automated pipeline | Outscraper module dead | No | Claude | wire or delete |
| Email verification | NOT PRESENT, **but already priced in Stripe** | verified contacts | provider undecided | No | Mark | CEO item 9 |
| Outreach | BLOCKED | employees send email | tool bridge | No | Claude | engineering item 9 |
| Follow-up | PLANNED | automated cadence | everything | No | Claude | post-launch |
| Social | NOT PRESENT | OutReply publishing | no code at all | No | Mark + Claude | CEO item 8 |
| Voice / SMS | BLOCKED | Telnyx inbound + outbound | key not installed, no number | No | Mark + Claude | CEO item 7 |
| Calendar | NOT PRESENT | Cal.com behind a Staff AI layer | no account, no code | No | Mark | CEO item 6 |
| Frappe / accounting | BLOCKED | tenant-isolated ledger | deployment undecided | No | Mark | CEO item 5 |
| Billing | LIVE + PROVEN | LIVE | stale webhook, missing event, unproven renewal | No | Claude | engineering item 4 |
| Email | PARTIAL | full lifecycle | only support mail exists | No | Claude | post-launch |
| Observability | NOT PRESENT | Grafana + Alloy + Kuma | everything | **Yes (B5)** | Claude | engineering items 2, 3 |
| Playwright | LIVE + PROVEN (30/38) | 38/38 | no authenticated coverage | No | Mark + Claude | CEO item 11 |
| Reliability engineer | NOT PRESENT | DeepSeek engineer with bounded remediation | everything | No | Claude | after observability |
| Mobile / PWA | responsive only | installable PWA | manifest, SW, real-device test | No | Claude | post-launch |
| Staff AI running Staff AI | **No** | Customer Zero | own workforce down; employees cannot act on the world | No | Mark + Claude | CEO item 10, then the tool bridge |
| Host security | **no firewall, unrotated exposed credentials** | hardened | see B1-B3 | **Yes** | Mark + Claude | CEO items 1-3 |

---

# PART 31 — Final architect verdict

**1. What Staff AI is today.** A working multi-tenant AI workforce product. A
customer can sign up, pay, and within about five minutes have a dedicated
container running a pinned OpenClaw harness with named employees who do real,
verifiable work — open live pages, run commands, research real businesses,
produce publishable output. The provisioning path is deterministic and was proven
today on a genuinely fresh tenant, end to end, with no manual repair.

**2. What is sellable today.** Company Office ($199/mo) with Executive Assistant
and General Manager, plus four specialists as seats: Administrative Assistant
($99), Lead Generation Specialist ($149), Marketing Manager ($199), Marketing
Specialist ($149), Customer Service Representative ($149). Each has a real brief
and a real production task behind it. The two team bundles should be hidden until
their constituent roles are certified.

**3. What works but remains unproven.** The General Manager. Email confirmation
and password reset delivery. Trial-to-paid conversion, renewal, dunning and the
billing portal. The Customer Success Agent in production. Everything behind a
login on mobile. Lead capture — the tool is live and has never captured a lead.

**4. What is partial.** The public Sales Agent, which is excellent and in the
wrong place. Concurrency, which produces 409s and provider failures under load.
Hiring, which briefly takes a tenant's whole workforce offline. Control-plane
accuracy, which currently disagrees with Docker on four of six servers. Support,
which can escalate but cannot act.

**5. What is blocked.** Bookkeeper, Receptionist, Social Media Manager and Sales
Representative — all four for the same underlying reason: no employee can call
any Staff AI tool, because the module that would register one is imported by
nothing. Credentials alone will not fix any of them.

**6. What is planned or absent.** Observability of any kind. The reliability
engineer. The AI-guided sales demo. Follow-up. Email verification. PWA. Employee
memory, scheduling, delegation, KPIs and approvals — all of which the marketing
site implies exist.

**7. What Claude can finish without Mark.** Put the sales agent on the marketing
site; build a control-plane reconciler; add monitoring; fix the Stripe webhook
configuration; serialise dispatch; stop provider errors reaching customers as
answers; delete the dead auth handler and the retired funnel route; rotate logs;
build the employee tool bridge; unique employee names; hide the team bundles;
run the ProvisionCore test suite. Twenty items, listed in Part 28.

**8. What Mark must provide.** Three things before launch: complete Stripe
identity verification and revoke the exposed key; authorise rotation of the
shared compromised credentials with a maintenance window; approve the host
firewall and legacy shutdown. Everything else he could provide activates a
Coming Soon role or improves testing, and none of it blocks launch.

**9. True launch blockers.** Five, in Part 29: an unrevoked exposed Stripe key on
the live billing account (B1); unrotated compromised credentials on the host that
runs the control plane (B2); no host firewall with ~20 services on the open
internet (B3); the AI Sales Agent absent from the site customers visit (B4); no
monitoring at all, with a control plane that already disagrees with reality on
four of six tenants (B5).

**10. Is the current system ready to accept the first paying customer?**

## NOT READY

The product itself is closer to ready than the estimate a week ago would have
suggested: the workforce works, the money path works, and five roles are
genuinely certified. What is not ready is everything around it. Taking a paying
customer today would mean putting their money through an account with a
known-exposed key, running their workforce on an unfirewalled host with unrotated
compromised credentials, with nothing watching it and no way to know if their
employees died — and it would mean pointing them at a marketing site where the
salesperson we built is not present.

Four of the five blockers are hours of work, not weeks. Three of them need one
decision each from Mark. None of them requires a new feature.
