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
again. This does NOT authorize resuming the Staff AI rollout in that task.

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
- Stripe rotation dialog is open, not submitted. Browser safety rules require
  action-time confirmation for creating/rotating persistent credentials. Mark
  was asked to confirm Beacon2 rotation with a one-hour overlap, consumer update,
  and old-key expiry after verification. Await that specific confirmation, not
  credentials or renewed general operational permission.
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
