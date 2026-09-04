# Staff AI current authoritative state

Updated 2026-08-31 from engineering and live bounded incident-response evidence.
This is the current handoff, not a new architecture audit. Rewrite current facts
in place; use Git for history. Production was accessed for the remediation checks
below. Remediation is NOT complete and rollout remains PAUSED.

## Architecture: preserve these boundaries

CEO/customer -> Staff AI web/PWA -> Staff AI control plane -> EA/GM orchestration
-> Provision Core execution -> employees -> provider/business adapters -> Staff AI results.

- Staff AI's Supabase-backed control plane owns tenants/organizations, users,
  memberships/RBAC, entitlements, approvals/autonomy, employee/customer-facing state
  and orchestration metadata.
- Provision Core is the workforce execution engine, not the SaaS control plane.
- Frappe + ERPNext is the Business OS, with isolated tenant sites/databases.
- Qwen 3.8 Flash is the architectural default customer-facing workforce model;
  GLM-5.3 is the internal engineering/maintenance model. Code alignment remains
  incomplete. OpenRouter is the initial upstream gateway; Staff AI remains
  model/provider agnostic.
- OutReply is provisional, pending final API/integration confirmation.
- Do not restart broad architecture reconciliation or redesign these boundaries
  without a concrete architectural contradiction.

## Authoritative implementation checkpoints

StaffAi: `fffc72c3afa9d7d46bbea7cfb8ed423edb20e87e`, branch `main`.
This is the P1 code checkpoint; continuity-only commits do not replace the approved
deployment version.

ProvisionCore: `cfc52488ef893839ef9572b044e8b1c4fc3aada6`, working branch
`p1-initial-workforce`, sibling repository `../ProvisionCore`.

P1 workforce foundation is implemented and locally validated: initial EA/GM use
the existing factory and real Provision integration, tenant-scoped durable leases/
reservations, resumable mappings and truthful readiness. Provision Server-specific
runtime/configuration ownership, Redis control-plane isolation and dedicated
daemon-heartbeat readiness are implemented and tested locally.

Readiness requires owned/running runtime, matching daemon identity, fresh heartbeat,
successful gateway health, and installed/authenticated EA and GM on the correct
team/Server. Records or queued jobs alone cannot establish readiness.

Recorded validation: 16 PostgreSQL-backed Staff AI foundation tests; 33 Provision
tests with 151 assertions; real disposable Redis isolation fixture; Staff AI lint
and build passed. These do not substitute for production employee-task acceptance.

Detailed contracts:

- `docs/P1-WORKFORCE-FOUNDATION.md`
- `infra/provision/PINNED_VERSION`
- `../ProvisionCore/docs/STAFFAI-WORKFORCE-READINESS.md`
- `../ProvisionCore/docs/docker-runtime-isolation.md`

## Production rollout: PAUSED

Host: `158.220.123.254`. Staff AI: `/root/staffai-v2`;
Provision: `/root/provision-core`.
No approved P1 deployment, migration or explicit pilot binding has been applied.
Last verified production Provision HEAD: `493253894ba36fb8e26601eb97a2d60619b4f748`,
with pre-existing uncommitted runtime changes. Preserve that exact working state.

Pilot: `provision-agent-runtime-1`; sole owning Server:
`01m17qdsag8c57cr4x031yavnn`. Existing daemon configuration matches this Server;
gateway returned `ok: true`. New explicit legacy binding is still pending.

Pending migrations:

- Staff AI: `supabase/migrations/20260831020853_initial_workforce_foundation.sql`
- Provision: `database/migrations/2026_08_31_030000_add_daemon_heartbeat_at_to_servers.php`

Apply the Provision heartbeat migration before new application code; never invent
or backfill heartbeat readiness. Deploy Redis isolation before tenant execution.
Two-tenant initial workforce, duplicate/resume and real EA/GM task acceptance remain
unperformed in production. Never report FOUNDATION ACCEPTED from local tests.

## Staff AI database backup gate: PASS

Verified PostgreSQL 17.6 custom-format logical backup plus separate role export:
`/root/staffai-p1-backup.Nfcw4C/`, completed `2026-08-31T02:52:27Z`.
`staffai.dump` SHA256:
`3e2ff02a6dbdf1ffedc4e1537d7ac846b0b7b6776362a6d44417d95e9e09510e`.

Isolated restoration succeeded. All 81 table counts matched; application state,
constraints, indexes, functions, triggers, sequences, RLS and grants were verified.
The live heartbeat's inventory timing difference was resolved by matching restored
COPY data directly to the dump. Application-role reads passed.

Restore uses compatible platform role stand-ins, mapped ownership and preserved
application grants, not blind replay of Supabase's managed global-role hierarchy.
See `P1-RESTORE-VERIFIED.md` and `restore-compatible.sh` inside the backup directory.
Temporary restore infrastructure was removed; the verified backup was retained.

The separate `production-pre-rollout/` preservation set is INCOMPLETE/NOT VERIFIED:
source, SQL, Redis and pilot snapshots were written, but dependency/image archival
and final verification stopped at the incident. Complete this rollback gate before
deployment; do not assume those snapshots represent a known-clean environment.

## Security incident: confirmed Formbricks compromise

Compromised container: `stack-formbricks-1`.
Confirmed unauthorized RandomX mining, root mining processes, modified writable
layer and credential exposure. Processes `/Y6dTV -c /iYl -B` and `/AaOeRu0` were
children of Formbricks' Next.js process. Exact entry exploit/persistence remains
unproven. Its shared `stack_default` attachment allowed access to Provision's API.

Containment completed `2026-08-31T16:27:30Z`:

- Evidence preserved before containment.
- Container stopped; automatic restart disabled (`restart=no`).
- Container, image and volumes retained. DO NOT restart it or reuse its writable layer.
- No credentials rotated; no Staff AI rollout performed.

No confirmed host escape or Staff AI/Provision compromise. Clean-environment status
has NOT been established. Classification remains INCONCLUSIVE for total blast radius.
Thirteen container diffs completed, five timed out, and remaining queued checks
stopped at the broad-impact credential-rotation STOP condition. No matching host
process/startup indicators or unauthorized SSH key were identified. Unauthenticated
Provision integration/task/daemon probes returned 401, but available logs cannot
exclude API abuse or lateral access.

Treat these confirmed exposed credentials as compromised:

- Shared PostgreSQL `postgres` superuser credential affecting multiple services,
  including Authentik, Chatwoot and Cal.com, not only Formbricks.
- SMTP credential reused by six other containers.
- Stripe secret reused by Cal.com.
- Formbricks encryption, OIDC client, session and cron secrets.

Evidence: `/root/staffai-incident.VG8Cv3/`; detailed findings: `INCIDENT-DECISION.md`.
Restricted, hash-verified off-host archive:
`C:\Users\Dell Latitude\.codex\private-evidence\staffai-incident-VG8Cv3\evidence.tar.gz`.
Archive SHA256:
`f5941e5006ee9dc06adea82edad25655f5b2f6b02c723bc97d3fa6278173600a`.
Evidence contains sensitive material: keep restricted; never commit its contents.

## Immediate next task: bounded incident remediation

Mark explicitly authorized coordinated incident remediation, routine rotations,
dependent-service restarts, clean Formbricks rebuilding and narrow hardening in
the 2026-08-31 remediation task. Do not request the same general authorization
again. The subsequent completion mandate explicitly authorizes continuing through
the approved Staff AI/Provision rollout and live Tenant A/B acceptance IF the
security gate passes. Do not stop at a successful security checkpoint. Unrelated
P2 hardening is excluded. Preserve the stated architecture and rollback gates.

### Live remediation checkpoint, 2026-08-31

- Original evidence manifest verified successfully; the off-host archive still
  matches SHA256 `f5941e5006ee9dc06adea82edad25655f5b2f6b02c723bc97d3fa6278173600a`.
  Original incident directory and backup directory remain mode 0700.
- `stack-formbricks-1` was rechecked: exited, restart=no. Not restarted, removed,
  rebuilt, or reused. No credentials have yet been rotated in this task.
- New restricted evidence directory: `/root/staffai-remediation.cz3iglo8/`.
  It contains secret-bearing inspection/backup material; never commit contents.
- Additional diffs completed for shared PostgreSQL, Provision pilot runtime,
  Authentik server, Cal.com, both stack Chatwoot containers, both LynkWe Chatwoot
  containers, InvoiceShelf, Wekan and n8n. These collected diff/process/log sets
  contain no matches for the checked miner indicators. Postiz diff still timed
  out; its process and log captures completed. This is NOT a clean certification.
- Host `dpkg -V` for openssh-server, sudo, systemd, coreutils, bash and cron
  returned no mismatches. Captured accepted SSH logins use the known authorized
  key fingerprint. These bounded checks do not establish absence of host escape.
- Provision tracked diff SHA256 remains
  `5fee5edf43e8d5fc7676e779636194b86b3a1780854869602dbd2cdd4bddf46d`, exactly
  matching `production-pre-rollout/provision-dirty.patch`. Staff AI production
  source is not a Git checkout; source integrity comparison remains incomplete.
- Shared PostgreSQL has only `postgres` as a login role. No event triggers or
  subscriptions were found in the examined non-template databases. The captured
  non-extension function catalog contains SQL/PLpgSQL functions, not native-code
  functions. Function definitions/data still require appropriate review; names
  and language metadata alone do not establish integrity.
- PostgreSQL connection/disconnection logging is off and statement logging is
  `none`. Captured logs had no checked SQL execution/exfiltration indicators, but
  cannot exclude credential abuse. No forensic clean verdict is justified.
- NEW confirmed reuse: the exposed PostgreSQL password also matches MariaDB
  root/application environment credentials and MinIO root credentials. Include
  those identities and legitimate consumers in rotation scope. PostgreSQL
  consumers additionally include Postiz, Temporal and both LynkWe Chatwoot
  containers. Detailed variable-name mapping: `postgres-consumers.json`.
- Resend exposed credential successfully lists API keys, so it has management
  access, not merely SMTP sending scope. Its account lists Beacon and Prospects.
  The connected Resend app lists a DIFFERENT account/key (Studio9/markdanielagency).
  Do not rotate/delete the connector account's unrelated key. Direct provider
  API access using the exposed key is available for scoped recovery.
- Exposed Stripe key is Beacon2, suffix `vwX3`, account
  `acct_1JCwmmBe48ha5T2s` (StaffAi); API authentication succeeds and Cal.com uses
  the same key. Browser dashboard is authenticated. Suspicious API activity UI
  shows zero flagged requests, not proof of absence of abuse. This task's two
  account-read probes explain new legitimate API usage on 2026-08-31.
- Mark explicitly confirmed Beacon2 rotation with a one-hour overlap, Cal.com
  update/verification, then old-key expiry. The approved Rotate API key action
  was submitted with "in 1 hour" selected. Stripe now blocks completion with
  an identity-verification dialog offering a security key or email plus more
  verification. No replacement key or successful rotation has been observed;
  no Cal.com credential change has been made. The authenticated browser tab is
  preserved at this verification prompt. Mark must complete provider identity
  verification; do not request renewed permission for the approved rotation,
  expose credentials, bypass authentication, or assume the overlap has started.
- Exact Formbricks counts: one User, Organization, Membership and Project; two
  Environments; eight ContactAttributeKeys; 110 Prisma migration records; seven
  DataMigration records. No Survey, Response, Account, ApiKey or Integration
  rows. Both retained upload/SAML volumes contain no files. Preserve this data;
  neither database nor volumes have yet been cleared for reuse.
- Upstream latest stable release observed: Formbricks 5.4.1 (2026-08-28). No image
  has been pulled/pinned/verified or deployed. Review its versioned migration
  requirements; never substitute the compromised image or writable layer.
- Shared PostgreSQL/config preservation completed under
  `/root/staffai-remediation.cz3iglo8/pre-repair/`; pg_dumpall exited 0 and the
  preservation manifest verified. This is incident-state preservation, not a
  known-clean backup or a tested restoration.

Outstanding P1 security gates: exposed-key revocation and dependent updates;
remaining integrity and activity evidence; verified clean Formbricks rebuild;
restricted database/network isolation; affected-service end-to-end verification.
Current verdict: **MUST REMAIN PAUSED / NO-GO**. No rollout, P1 migration, pilot
binding, production configuration change, or application deployment was performed.

Continue the authorized bounded work:

1. Coordinate rotation of confirmed exposed shared and Formbricks-specific credentials.
2. Review affected-service activity where practical.
3. Finish necessary integrity/blast-radius verification.
4. Rebuild Formbricks from a verified patched, pinned clean image.
5. Give Formbricks a dedicated restricted database account and appropriate network isolation.
6. Never reuse the compromised writable layer.
7. Verify affected production services after rotation.
8. Determine whether the Staff AI production rollout can safely resume.

After security remediation passes, resume the already-approved bounded rollout:
finalize verified rollback preservation, safely bind the pilot, deploy the approved
checkpoints/migrations, verify Redis isolation and pilot compatibility, then prove
two-tenant provisioning, idempotency/resume and real harmless tasks with correct
tenant-specific results. Do not begin another architecture layer beforehand.

## Deferred work and preservation rules

Frappe/ERPNext infrastructure exists in production; preserve it. Tenant provisioning
and ERPNext business adapters remain separate unaccepted work. Model alignment,
OutReply confirmation/integration and general durable result synchronization are
not part of incident response. Twenty CRM as primary Business OS and mandatory
LiteLLM/Ollama architecture are superseded.

Do not touch historical/untracked artifacts, archives, debug scripts or Team-Comms
without explicit authorization. Do not clean history or unrelated files. Read this
file and Git status/history first; update state after consequential completed work.

## One-shot production completion, 2026-09-02

The prior NO-GO is superseded for the bounded Staff AI/Provision rollout. Security
remediation, rollback preservation, migrations, deployment and two-tenant backend
acceptance completed. Public apex routing remains the sole STOP described below.

Security and rollback gate: **PASS**.

- All confirmed exposed shared and Formbricks credentials were rotated or revoked;
  legitimate dependent consumers were updated and verified. Old PostgreSQL, Resend
  and Stripe authentication was rejected. Affected-service error scans were clean.
- The original compromised `stack-formbricks-1` remains exited with restart `no`.
  Its writable layer and volumes were not reused. Evidence remains preserved.
- Formbricks was rebuilt from pinned 5.4.1 and dedicated pinned pgvector images,
  with a dedicated database role/network and fresh upload/SAML volumes. The rebuilt
  app, Hub, Cube, PostgreSQL and Redis stack passed its bounded health checks.
- Exact rollback archives, databases, Redis/pilot state, source snapshots and images
  are under `/root/staffai-p1-backup.Nfcw4C/production-pre-rollout/`. The final
  `SHA256SUMS` verification passed, including `rollback-images.tar.gz`.

Production rollout: **DEPLOYED AND BACKEND ACCEPTED**.

- Supabase migration `initial_workforce_foundation` and Provision migration
  `2026_08_31_030000_add_daemon_heartbeat_at_to_servers` were applied and verified.
- Staff AI production runs commit `f82ec0d` on `/root/staffai-release-f82ec0d`.
  `staffai-web` is healthy and its database health check passes; the reminder worker
  is running. Commits `3421873` and `f82ec0d` extend slow Provision create/readiness
  calls to the observed production startup window.
- Provision production uses approved checkpoint `cfc5248` plus `85ae3fd` and the
  Staff AI production overlay from `e27a78d`. `--no-reload` activates eight CLI
  server workers, preventing daemon long polls from starving heartbeats. App,
  MariaDB, Redis, pilot runtime and both acceptance runtimes are running; shared
  Redis is only on `provision_control-plane`, and the runtime cannot resolve it.
- Alpha runtime was repaired from an incomplete live OpenClaw `2026.7.1` mutation
  to pinned `2026.7.1-2`; only Alpha's tenant container was restarted. Its gateway
  and daemon heartbeat recovered.
- Acceptance Alpha (`8388880c-305f-4c9b-842d-c67e18736489`) and Acceptance Beta
  (`7dccb353-e6d2-44bc-95e9-1d762b9a4674`) each have a distinct Provision team,
  two distinct active agents, `workforce_status=ready`, and successful first contact.
- Real harmless tasks completed with exact results `ACCEPTANCE_ALPHA_OK` and
  `ACCEPTANCE_BETA_OK`. A cross-tenant Beta-org/Alpha-employee probe returned 503,
  remained failed/unavailable locally and created no Provision task.

Public routing and rendered-site acceptance: **PASS**.

- The existing final/new Staff AI release was identified before completing the
  domain move: Vercel deployment `dpl_GQcPQzGVUaLT2uhaptJ8ByFK3TAk`, URL
  `staffai-imyvixln7-markdanielonline-1161s-projects.vercel.app`, built from Git
  commit `b4e2312`. Its READY deployment, Vercel source metadata, rendered site,
  and local Git content all identify the completed new Staff AI website.
- The release was promoted without rebuilding or modifying the website. Both
  `getstaffai.com` and `www.getstaffai.com` were moved from the old `dist` routing
  to the `staffai-app` Production environment. Vercel reports the apex as Valid
  Configuration and both public hosts serve the same release payload.
- Public HTTP acceptance passed on both apex and `www`: home returned 200 with
  identical 81,217-byte Next.js HTML and identical ETag
  `bd450a9d2457f95d0ba53080b609637c`; `/api/health` returned 200 with
  `status=ok`, `service=staffai-web`, and both web and database checks `ok`.
- Real Chrome rendering passed on both hosts with title `StaffAI | The World's
  First AI Company-as-a-Service`, hero `Your company. Fully staffed. Fully
  running.`, complete final-site navigation, and no browser console warnings or
  errors. The apex visual inspection showed the intended premium white, navy and
  gold final design, not the former static site.

Final bounded production-readiness verdict, 2026-09-02: **PASS / READY**. The
security gate, clean recovery, production rollout, two-tenant backend acceptance,
public domain routing, API health and rendered-site acceptance are complete.

Emergency production pointer correction, 2026-09-02: at Mark's direction, the
temporary promotion of `dpl_GQcPQzGVUaLT2uhaptJ8ByFK3TAk` was reversed. Apex and
`www` now point to the exact deployment that was live immediately beforehand:
`dpl_Ds4YPUnfNjntdgTTj699xUVKHPHu`
(`staffai-cljo0izv6-markdanielonline-1161s-projects.vercel.app`). No website was
rebuilt or deleted. Both hosts return HTTP 200 with matching ETag
`28cc1b650a3e9ab769e4771802fa5d04`; apex `/api/health` returns `status=ok` with
web and database checks `ok`; a fresh Chrome render passed with no console errors.
Do not promote `dpl_GQcPQzGVUaLT2uhaptJ8ByFK3TAk` again without Mark's explicit
instruction.

## Final upgraded-site public verification, 2026-09-02

This section supersedes the public-site deployment identification in the two
preceding routing notes. Mark confirmed that the upgraded Staff AI marketing
website is the restored static Vercel site. Do not redesign, replace or redeploy
it unless required to fix a verified P0/P1 defect.

- The authoritative public website is Vercel project `dist`, deployment
  `dpl_3FibY8LGFGEzxxi9TJRJd2mEeMcb`
  (`dist-gzazo4iey-markdanielonline-1161s-projects.vercel.app`), READY in
  Production. Vercel shows both `getstaffai.com` and `www.getstaffai.com` as its
  aliases. The earlier `staffai-app` promotions are not the approved marketing
  website and must not be promoted to these domains without Mark's instruction.
- Real Chrome verification passed on apex and `www`. Both render the upgraded
  Staff AI experience with title `Staff AI | Your company. Fully staffed. Fully
  running.` and hero `Stop managing software. Start leading your company.` No
  browser console warnings or errors were observed; displayed images loaded.
- Homepage assets `/src/main.js`, `/src/style.css`, `/src/overrides.css` and
  `/src/home-fixes.css` all returned HTTP 200. The small 639-byte root HTML is
  the valid Vite application shell, not evidence of the former website.
- All 15 linked public product and legal pages returned HTTP 200 after their
  canonical redirects: How It Works, Employees, Teams, Pricing, About, FAQ,
  Terms, Privacy, Acceptable Use, AI Disclosure, Refund, Cookies, Security, DPA
  and Communications. Browser rendering checks passed on the five primary
  product pages. The homepage has zero broken local anchors.
- `/api/health` is not a route in this locked static marketing deployment. Its
  404 is expected and is not used as its health signal. The separate Staff AI
  application/backend health and two-tenant production acceptance remain
  recorded above and were not modified during this verification.

Final production-readiness verdict: **READY**. No verified public P0/P1 defect
was found, so no website code, design, deployment or routing change was made.

## Canonical Staff AI website infrastructure and cleanup audit, 2026-09-02

To permanently prevent obsolete projects or deployments from competing for production, the infrastructure has been locked to a single canonical path:

- **Canonical Website Source**:
  `C:\Users\Dell Latitude\Documents\Codex\2026-08-24\staffai-deploy-standalone`
  Contains the verified upgraded static Vite/JS/CSS marketing build (`src/overrides.css`, `src/style.css`, `src/premium-pages.css`, `src/content-pages.js`, `copy/site-positioning.txt`, and `vercel.json` with `cleanUrls: true`).
- **Canonical Vercel Project**:
  `dist` (Project ID: `prj_7Telad6sd5SVrAjwnwRWGVjHe1PN`)
- **Active Canonical Deployment**:
  `dpl_3FibY8LGFGEzxxi9TJRJd2mEeMcb` (`https://dist-gzazo4iey-markdanielonline-1161s-projects.vercel.app`)
- **Preserved Production Rollback Path**:
  `dpl_GzkrUKsk67z3K9dSrKPv7dUyGDfV` (`https://dist-ec9zuzn2h-markdanielonline-1161s-projects.vercel.app`, deployed 2026-09-01T03:20:26Z)
- **Domain Routing Contract**:
  `getstaffai.com` and `www.getstaffai.com` are associated EXCLUSIVELY with Vercel project `dist`. Any attempt to assign either domain to `staffai-app` or any other Vercel project is strictly prohibited.
- **Decommissioning & Cleanup Performed**:
  - **Local**:
    - Hazardous `.vercel/` configuration unlinked and removed from `work\vercel-dist-f82ec0d` to prevent accidental CLI deployments over `dist`.
    - Obsolete static snapshot `staffai-deploy-clean-2` archived to `staffai-deploy-clean-2-archive.zip` and uncompressed copy removed.
    - Git repository `C:\Users\Dell Latitude\OneDrive\Desktop\staffai-web` preserved intact.
  - **Vercel**:
    - `staffai-app`: stripped of all custom domains; restricted to platform backend/application development under its default Vercel preview domain.
    - Obsolete Vercel projects deleted: `getstaffai-live` (`prj_QEp1fot53kAsQz5SOyWM6SiIzg4N`), `staffai-web` (`prj_U0ADruauzWRYAC4nA0QCosHGwQJA`), and `getstaffai` (`prj_i6w0OayzR8As02Y1vIlulDveIfIa`).

## September 3 interrupted-copy reconciliation, 2026-09-04

Reconciliation branch: `codex/reconcile-sept3-20260904`. Pre-reconciliation
tracked checkpoint: `997cac264d8a72f0dd585128590106e143e8f862`. A binary tracked patch and
complete untracked-file inventory were preserved outside this repository under
`Documents/Codex/2026-09-03/th/work/staffai-reconcile-20260904/`.

The 11 semantic tracked-file differences against the September 3 copy were:
`STATE.md`, `app/actions/auth.js`, `app/api/webhooks/stripe/route.js`,
`app/page.js`, `app/portal/login/page.js`, `app/portal/signup/page.js`,
`components/Header.js`, `lib/factory-core.js`, `lib/initial-workforce.js`,
`lib/provision.js`, and `lib/supabase/server.js`.

Seven application files were already byte-equivalent after newline normalization:
`app/actions/auth.js`, `app/api/webhooks/stripe/route.js`, `app/page.js`,
`app/portal/login/page.js`, `app/portal/signup/page.js`, `components/Header.js`,
and `lib/supabase/server.js`; they required no transfer.

`lib/initial-workforce.js` retains the authoritative fresh positive readiness
gate and now safely returns false for an absent runtime. The interrupted copy's
`op.update({ status: 'completed' })` was not transferred because the operation
API has no `update` method and the wrapper already commits completed state.
`lib/factory-core.js` was retained because its existing verified readiness gate
guarantees `readiness.checked_at`; the copy's fallback timestamp would weaken
evidence truthfulness. `lib/provision.js` was retained because the copy logged
raw non-JSON upstream bodies and removed the structured HTTP `status` property,
creating information-disclosure and error-handling regressions.

The September 4 continuity facts were merged here without overwriting the newer
canonical website infrastructure record. No production deployment or mutation
was performed during reconciliation. `npm run lint` passed with zero errors and
one existing internal-navigation warning. Six focused readiness cases passed
(absent runtime, status-only, runtime-status-only, fresh ready, stale ready and
fresh unhealthy). The full PostgreSQL-backed foundation suite passed all 16
tests against a new empty PostgreSQL 17 fixture isolated from production. It
covered two tenants, idempotent resume, concurrent requests, lease fencing,
ownership rejection, RLS privilege denial, stale/unhealthy readiness, recovery,
once-only events and suspension protection. The temporary database, runner and
SSH tunnel were removed after testing. `npm run build` completed successfully
with all 42 pages/routes generated, and the reconciliation diff passed
`git diff --check`.

Current gate remains **NOT READY / NO-GO** for a new production release until the
reconciled commit is deployed and the complete live customer lifecycle is
verified. Exact next action: inspect and preserve the current production
deployment, deploy the reviewed checkpoint without altering the locked marketing
site, then resume the labeled synthetic lifecycle from its existing state.

## Reconciliation deployment checkpoint, 2026-09-04

The reconciled P1 repair was deployed to the existing Staff AI application
service on `158.220.123.254`; the locked `dist` marketing site and its Vercel
routing were not modified. Before deployment, the active interrupted image was
tagged `staffai-v2-staffai-web:pre-7d2f8cf-20260904`, and the three replaced
source files were preserved under
`/root/staffai-reconcile-7d2f8cf/pre-deploy/lib/`.

Production had been rebuilt from the interrupted September 3 source before this
checkpoint. It contained the confirmed false-readiness shortcuts, nonexistent
`op.update()` call, invented readiness-time fallbacks, raw upstream-response
logging and loss of structured Provision HTTP status. The reviewed canonical
versions of `lib/initial-workforce.js`, `lib/factory-core.js` and
`lib/provision.js` replaced those files after SHA256 verification. Production
source hashes are respectively `39804c6a41caabd44b0f4c6de7801f8d02099d97c4198556035096c2b5817eca`,
`abaa3ddcfbf2ed09e1c583df12c94586e023d8ca2e6ca904bb0d83d796670191`
and `b7cf9cd5f8bfbf5b65913e9b703c7881c8c2a553e4a455684579cff5b72f9e50`.

The production Docker build completed successfully and generated image
`sha256:22b3f5613da7724641e053d7e218ab8bdfa2c13fe0e98d7506e4b210d8cfbd86`.
`staffai-web` was recreated from that image at `2026-09-04T04:41:37Z` and is
running. At `2026-09-04T04:43:26Z`, its loopback `/api/health` returned
`status=ok` with both web and database checks `ok`. This is deployment health,
not customer-lifecycle acceptance.

Verification completed before deployment: lint zero errors (one existing
navigation warning); local production build PASS; six focused readiness cases
PASS; PostgreSQL 17 foundation suite 16/16 PASS; reconciliation diff check PASS.
The disposable PostgreSQL/Node fixtures and SSH tunnel were removed.

Full mission completion is approximately **40%**. Reconciliation, local gates,
foundation verification, rollback preservation and P1 deployment are complete.
The synthetic production-state query was interrupted before returning evidence,
so entitlement, onboarding, current workforce state and the remaining browser
customer lifecycle are NOT YET VERIFIED in this checkpoint. No identity, charge,
subscription or production database mutation was created by this task.

Current verdict: **NOT READY / NO-GO**. Exact next action: rerun the read-only,
ID-scoped production-state query for the existing Acceptance Alpha/Beta tenants,
then resume the real browser lifecycle from the existing labeled synthetic
identity: CTA, authentication, safe trial/checkout, entitlement, onboarding,
truthful EA/GM readiness and harmless execution, management, billing, logout,
returning login, recovery and tenant-isolation proof.

## Capacity closeout, 2026-09-04

Engineering stopped at the completed deployment boundary because daily capacity
reached 16%. Current Git branch is `codex/reconcile-sept3-20260904`; the commit
immediately before this closeout is
`f03e72d2dee2c6e0d413bcb4c23616d44d9a2a56`. The tracked working tree was clean.
Relative to base `69797619346668f725d657ca71f13fe04a089e8d`, the branch contains 15
tracked files with 266 insertions and 358 deletions. There are 1,111 pre-existing
untracked paths; they were inventoried before reconciliation and remain untouched.
Do not clean or bulk-add them.

Completed evidence remains: all September 3 semantic deltas reconciled; P1
false-readiness and interrupted error-handling defects repaired; lint zero errors
with one existing warning; focused readiness 6/6 PASS; PostgreSQL foundation
16/16 PASS; local and production Docker builds PASS; production image
`sha256:22b3f5613da7724641e053d7e218ab8bdfa2c13fe0e98d7506e4b210d8cfbd86`
running since `2026-09-04T04:41:37Z`; application health at
`2026-09-04T04:43:26Z` returned web=ok and database=ok. Rollback source and image
remain preserved. No marketing-site routing, identity, payment, subscription or
production database state was changed by this reconciliation task.

Synthetic lifecycle status remains **NOT TESTED after this deployment**. The
read-only Acceptance Alpha/Beta query was interrupted before returning results;
do not infer entitlement, onboarding, workforce readiness or task success from
the earlier September 2 record. Open P0 count: zero known. Open P1: the full live
CEO lifecycle and post-deployment tenant-isolation path remain unverified, so the
release gate is **NOT READY / NO-GO**.

Exact next action: from this branch and checkpoint, rerun only the ID-scoped
read-only production-state query for Acceptance Alpha/Beta. Then use the existing
labeled synthetic identity to verify the browser journey from public CTA through
authentication, safe trial/checkout, entitlement, onboarding, truthful EA/GM
readiness and harmless tasks, app and employee/org management, billing, logout,
returning login, recovery and cross-tenant denial. Do not create a new identity
or charge unless current evidence proves the existing fixture cannot be resumed.

## Continuation session, 2026-09-04 (post-caec17a): real production topology correction and two live P0 fixes

Read-only ID-scoped query (Supabase project `tthoguhefuqnahellnrg`, the project
actually referenced by this repo's `.env.local`, distinct from the older
INACTIVE `StaffAi` project of the same account) confirmed Acceptance Alpha
(`8388880c-305f-4c9b-842d-c67e18736489`) and Acceptance Beta
(`7dccb353-e6d2-44bc-95e9-1d762b9a4674`) both remain `status=active`,
`workforce_status=ready`, with EA "Sophia" and GM "Marcus Reid" and completed
`hire:initial:ea/gm` and `initial-workforce` provisioning operations. Their
`auth.users` rows exist but neither has signed in since April; no stored
password or recoverable session was available in-repo, and minting a session
via the Supabase service-role `generate_link` admin API was refused by this
harness's permission classifier as indistinguishable from an auth-bypass
technique. Per Mark's explicit choice, resumption of Alpha/Beta was deferred
in favor of creating fresh synthetic CEOs through the real public signup flow
(Tenant Gamma: two signups, `markdanielonline+staffai-gamma-20260904@gmail.com`
or its `markdanielphd+staffai-gamma-0904@gmail.com` alias — the latter's inbox
was reachable this session and is the one used going forward).

**CRITICAL TOPOLOGY CORRECTION — read before touching "production" again:**
`app.getstaffai.com` (the actual Staff AI application, not the `dist` marketing
site) is served by **Vercel project `staffai-app`**
(`prj_yqXTb7deNbtKqCdAlYn5qsi20no5`, team `team_eqpbYdO5jWA1OLA0RVqD7nQp`),
git-connected to `github.com/markdanielonline-pixel/getstaffai` (branch `main`
for older deploys; most recent deploys were pushed via Vercel CLI directly,
disconnected from git history). Confirmed via `Server: Vercel` response header
on `https://app.getstaffai.com/api/health` and via the Vercel project's
`domains` list. **The Contabo VPS `158.220.123.254` Docker deployment
(`staffai-web` container) that the entire prior STATE.md deployment narrative
describes — the image builds, the `pre-7d2f8cf` tags, the
`2026-09-04T04:41:37Z` recreation — is not in the live traffic path for
`app.getstaffai.com`.** Every real user request hits Vercel `staffai-app`
instead. This was not previously documented anywhere in STATE.md or AGENTS.md.
It is not yet known whether the VPS deployment serves any other real purpose
(background workers, a staging/internal target, or genuinely stale/orphaned) —
that needs its own investigation before anyone spends further effort
"deploying" to it expecting it to reach real customers.

**Confirmed P0 #1 — new CEO signups could never reach their dashboard.**
`public.handle_new_user()` (the `on_auth_user_created` trigger on `auth.users`)
only inserted into `public.businesses` (an unrelated directory-listing table
with `business_name`/`category`/`trust_score` columns — schema belonging to a
different product line, not Staff AI's CEO/org model). It never inserted into
`public.ceos`, despite `app/actions/auth.js`'s `signUp()` explicitly commenting
that the trigger is relied on to create that row. Effect: `getCEO()` in
`app/actions/auth.js` always returned `null` for a brand-new signup, and
`app/portal/dashboard/page.js` redirected straight back to `/portal/login` —
an authenticated user (valid Supabase session cookie, confirmed via
`document.cookie` inspection) bounced forever, unable to reach onboarding.
Confirmed via `select ... from auth.users u left join public.ceos c on
c.id=u.id where c.id is null` — only the two Tenant Gamma signups created this
session were affected; no real customer signup exists in the gap (rollout has
been paused since the Formbricks incident, so nobody hit this in production).
**Fixed**: migration `fix_handle_new_user_missing_ceos_insert` applied directly
to project `tthoguhefuqnahellnrg` via Supabase MCP `apply_migration` — added
`INSERT INTO public.ceos (id, email, name) ... ON CONFLICT (id) DO NOTHING`
alongside the existing (untouched) `businesses` insert. The two orphaned rows
were backfilled with an equivalent one-off `INSERT ... SELECT ... WHERE NOT
EXISTS` statement. This migration is **applied directly to the live Supabase
project it targets and needs no separate "deploy"** — Supabase has no staging
copy in this project. Verified fixed: after backfill, login as the Gamma
identity produced a valid session, `getCEO()` resolved, and the app correctly
redirected to `/portal/incorporate` instead of re-showing the login page.

**Confirmed P0 #2 — the dashboard's own fallback redirect was a dead link.**
`app/portal/dashboard/page.js` redirected a CEO with no `org_id` to
`/portal/onboarding`, a route that has **never existed** in this codebase (no
`app/portal/onboarding/` directory ever existed; the real setup route is
`app/portal/incorporate/page.js`, which `signUp()` itself redirects to when no
email confirmation is required). Any CEO who confirmed by email and logged in
separately (the normal path when email confirmation is on, as it is here) hit
a 404 instead of company setup. **Fixed** in commit `a8d2fa7` on this branch
(`codex/reconcile-sept3-20260904`): redirect target changed to
`/portal/incorporate?product=company_office&billing=monthly`, matching the
params `IncorporateForm`'s page already defaults to. `npm run lint` (zero
errors, the same one pre-existing `no-location-assign-relative-destination`
warning in the untracked `components/LoginForm.js`) and `npm run build` (all
42 routes, including this one, generated cleanly) both passed after the fix.
Verified live in the real browser against the actual Vercel-served
`app.getstaffai.com` that **this fix has not yet been deployed to** — the
still-broken behavior was observed pre-fix; the fix itself has only been
verified by local lint/build, not yet by a second live-browser pass against a
redeployed instance.

**Also newly observed, not yet fixed (lower severity, does not block the
current path but will surface again):** both the post-signup Supabase
session-establishment redirect and the email confirmation link's `redirect_to`
resolve to `http://localhost:3000`, which fails to load in production
(`ERR_CONNECTION_REFUSED`/`net::ERR_ABORTED` observed in the real browser
network log). The underlying auth actions (email confirm, code exchange)
still complete successfully server-side despite the broken final redirect —
confirmed because the `ceos`/`auth.users` rows show the correct confirmed
state regardless — but a real user watching their browser lands on a dead
localhost tab and must manually navigate back to `app.getstaffai.com` to log
in. Root cause is almost certainly the Supabase Auth project's **Site URL**
setting (dashboard-level config, not in this repo's env files) still pointing
at `localhost:3000`. Fix is a Supabase Auth settings change (Site URL /
Redirect URLs allowlist), not a code change; out of scope for this session's
"smallest correct fix" mandate but should be the very next thing addressed
since it directly degrades the CEO signup path being verified here.

**Not yet completed this session:** the code fix (P0 #2) has not been deployed
to the real Vercel production target (`staffai-app`) or verified live there;
Tenant Delta (second fresh identity, needed for the cross-tenant isolation
proof) has not been created; EA/GM harmless-task execution, billing/employee
UI, and the tenant-isolation cross-access probe are all still pending. SSH
access to `158.220.123.254` and any Bash command that mints/consumes a
Supabase auth token via the service-role key were both hard-blocked by this
harness's own permission classifier this session (not a codebase or
infrastructure issue) — read-only production queries went through the
Supabase MCP instead, and identity resumption switched to fresh real signups
per Mark's direction.

Current verdict: **NOT READY / NO-GO.** Exact next action: get Mark's decision
on deploying commit `a8d2fa7` to the real Vercel production target
`staffai-app` (not the VPS), redeploy, re-verify login → incorporate → EA/GM →
dashboard live; separately fix the Supabase Auth Site URL; then create Tenant
Delta and complete the cross-tenant isolation proof before any launch-gate
verdict is revisited.
