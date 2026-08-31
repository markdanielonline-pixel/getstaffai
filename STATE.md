# StaffAi — current state

**Rewritten in place, never appended.** Facts below were verified against the
working tree, git history, and the live Supabase schema on **2026-08-30**.
History belongs in commit messages, not here.

## Authoritative architecture (2026-08-30 reconciliation)

Execution path: **CEO/customer → Staff AI web/PWA → Staff AI proprietary control
plane → Executive Assistant / General Manager orchestration → Provision Core
workforce engine → Staff AI employees → business systems / provider adapters →
results returned through Staff AI.** Customers experience a company/workforce,
never exposed infrastructure.

- **Control plane:** Staff AI's own control plane (Supabase-backed) is
  authoritative for tenants/organizations, users/memberships, RBAC, employee
  entitlements, product configuration, approvals/autonomy controls, and
  orchestration metadata. Frappe/ERPNext does **not** replace it.
- **Workforce engine:** **Provision Core**, version-pinned in
  `infra/provision/PINNED_VERSION` (provisiond 0.5.0). Do not replace it.
- **Business OS:** **Frappe + ERPNext** with isolated client sites/databases
  (one ERPNext site per tenant). Supersedes the Twenty CRM direction.
- **Model layer:** provider-agnostic via `lib/llm/router.js` /
  `lib/engine.js`; **OpenRouter** is the initial upstream gateway but must not
  be hard-coded. Intended models: **Qwen 3.8 Flash** (customer-facing
  workforce), **GLM-5.3** (internal Staff AI system engineering/maintenance).
- **Social media subsystem:** **OutReply** is the current provisional choice,
  pending final API/integration confirmation.

## Implemented and verified

- Git checkpoint of the full reconciliation tree (commit `5adcd4d`, 2026-08-30).
- Live Supabase schema includes all reconciliation migrations through
  `20260830024500_add_frappe_tenant_mappings.sql` (verified read-only via REST:
  `organizations.frappe_site_domain` / `frappe_connection_status` and the
  Provision runtime mapping columns exist).
- `lib/provision.js` — real Provision Core REST client: team/agent/task
  provisioning, idempotency keys, tenant-correlation guards, result polling.
- Initial workforce foundation: EA/GM use the existing factory and Provision
  integration with tenant-scoped SQL leases, durable employee reservations and
  resumable mappings. Active/training claims require fresh operational evidence,
  not merely Provision Active records. Dashboard checks readiness live and offers
  authenticated resume. See `docs/P1-WORKFORCE-FOUNDATION.md`.
- Local validation: 16 PostgreSQL-backed foundation tests; Provision 33 targeted
  tests (151 assertions); real disposable Redis network isolation fixture passed.
  These are integration fixtures, not proof of a production employee task.
- Control-plane hardening: operational-table security, CEO/org/scheduling
  unification, idempotency constraints, SMS conversation memory, support/ops
  tables (migrations 2026-08-28).
- Production execution engine (`lib/engine.js`): raw OpenRouter loop replacing
  the Vercel AI SDK (root cause: SDK Zod validation stripped tool args).
- Validation at checkpoint time: `npm run lint` clean; `npm run build` succeeds
  (full route table builds).

## Implemented but unverified

- **Frappe site/user provisioning** (`lib/frappe.js`, `lib/factory.js`
  `provisionTools`): code complete and wired, but every organization in the
  live DB is still `frappe_connection_status='disconnected'` — no end-to-end
  Frappe provisioning has ever succeeded.
- Provision Core end-to-end dispatch (checkout → workforce → agent task →
  result): code paths exist and checkout/stripe hooks call
  `provisionInitialWorkforce`, but no verified production run is recorded.
- New initial-workforce SQL migration and Provision dedicated daemon-heartbeat
  migration are local only. Earlier runtime/Redis isolation and these foundation
  changes require an authorized rollout before production workforce use.
- Deployment: `Dockerfile`, `docker-compose*.yml`, `vps_deploy.sh` exist;
  current live deployment state (Vercel vs Contabo VPS) not verified from here.

## Missing

- **`frappe-provisioner` microservice** — `lib/frappe.js` calls
  `http://frappe-provisioner:9000/provision`, but no such service exists in
  this repo. This is the blocking seam for the Frappe direction.
- **ERPNext business adapters** — CRM, leads, opportunities, quotes, invoices,
  accounting, projects, support, HR, procurement, inventory, reporting,
  appointments: no adapter code yet (only site/user provisioning).
- Env wiring for Frappe: `FRAPPE_TENANT_DOMAIN_SUFFIX`,
  `FRAPPE_ADMIN_PASSWORD`/Infisical, wildcard DNS strategy.
- Role templates listing `frappe`/`erpnext` in `required_tools`.
- Model layer not yet aligned: `lib/engine.js` defaults to `z-ai/glm-5.2:free`
  and `lib/provision.js` defaults to `z-ai/glm-4.7` — neither matches the
  intended Qwen 3.8 Flash (customer) / GLM-5.3 (internal) decision.
- OutReply integration: no code present yet (provisional decision only).

## Superseded / historical (do not build on; do not delete until dependencies mapped)

- **Twenty CRM** as primary Business OS (replaced by Frappe/ERPNext).
- **LiteLLM / Ollama** as required primary model architecture.
- `lib/crm/moxie.js`, `lib/systeme.js` (Moxie/systeme.io adapters) — legacy
  CRM/marketing direction; classify before removing.
- LangGraph-era experiments (`studio9_*.py`, `service_main*.py`) and
  n8n scripts — untracked debris, left in the working tree for triage.
- Old self-hosted launch-plan assumptions in `STAFFAI-LAUNCH-PLAN.md` /
  `PHASE_2_INFRASTRUCTURE.md` that conflict with the reconciled architecture.
- `Team-Comms/` multi-agent board (April 2026, dormant) — now gitignored.

## Open hygiene items

- Tracked-in-history archives/logs: `staffai.zip`, `compliance.zip`,
  `document.zip`, `build_output.log` (predate the checkpoint; leave for a
  later history-cleanup decision).
- Founder-side Stripe account cleanup (revoke Beacon's leftover keys/prices/
  webhook `we_1TwE4E…`) — still outstanding since July.
- ~180 disposable debug scripts remain untracked at the repo root; triage
  before any cleanup.

## First thing to do in a new session here

1. Read this file top to bottom.
2. `git log --oneline -5` and `git status` — expect the checkpoint commits and
   only untracked debris.
3. Review the P1 foundation checkpoint and rollout prerequisites first. The next
   production gate is authorized migration/runtime rollout followed by two-tenant
   provisioning and a real employee task. Frappe/model work remains separately
   scoped; do not deploy or start another phase without founder authorization.
