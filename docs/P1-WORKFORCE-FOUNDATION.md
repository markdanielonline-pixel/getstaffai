# Initial workforce foundation

Scope: required EA Sophia and GM Marcus, through the existing factory and
Provision integration. Staff AI owns organization/employee/control-plane state.
Provision owns runtime execution. No production deployment or migrations applied.

## Execution and durable state

Checkout/Stripe or authenticated worker -> provisionInitialWorkforce ->
organization operation -> existing Provision team/Server -> dispatcher ->
instantiateEmployee (EA then GM reporting to EA) -> real Provision agent upsert ->
fresh verification of both agents -> first-contact records -> completion.
The former first-contact hiring entrypoint delegates to this same implementation.
Initial EA/GM do not need new Frappe/tool identities. Existing additional sales
employees are preserved; this phase no longer fabricates three active sales hires.

The migration adds provisioning_operations keyed by (org_id, operation_key),
accessible only by service-role operations. Root key is initial-workforce:v1;
factory keys are hire:initial:ea:v1 and hire:initial:gm:v1.
Atomic SQL claims acquire a 90-second lease, renewed every 20 seconds. Each
checkpoint, employee reservation and activation is fenced by owner and expiry.
Expired workers cannot publish completion. Another worker can reclaim after expiry.
Concurrent callers receive a retryable response rather than duplicating work.

Employee UUID reservation and operation mapping commit together. Provision uses
organization and employee UUIDs as unique external identities. Lost HTTP responses
therefore retry the same resources. Preparation and successful EA/GM mappings are
durable. A unique legacy initial employee is adopted; ambiguous duplicates fail
closed for explicit reconciliation, never deleted. Tenant ownership is checked
for CEO, manager, local mappings and every remote team/agent response.

## Readiness

Both EA and GM must have matching team/Server/employee identities and fresh
Provision operational evidence (under 60 seconds, 5-second clock skew allowance).
Provision itself verifies owned/running runtime, matching daemon configuration,
daemon heartbeat under 120 seconds, healthy gateway, installed active workforce
agent and matching gateway credential. Recheck both after GM installation.

Only verified employees become active with training_progress_pct=100. Pending or
failed ones use the existing employee enum value training, with separate runtime
status/error fields. SQL respects the existing enum types and required memory.
Automatic retries cannot override suspension, leave or alumni lifecycle states.
The completion timestamp stores evidence time, not an invented readiness time.

Dashboard readiness is checked live. Failed checks invalidate the saved completed
snapshot with a compare-and-set so an old request cannot overwrite a newer retry.
Known active initial employees are demoted and the company becomes retryable.
Missing/failed database access also renders non-ready, never a success fallback.
The dashboard retry action derives organization from the authenticated CEO.

Provisioning is asynchronous: a first call may return retryable while Provision
jobs run. Worker/webhook retries or Resume workforce setup continue durable work.
No database insert, queued job or first-contact LLM text is proof of execution.
The initial greeting is a fixed setup notification, not an agent-generated task.

## Verification

16 Node tests run the actual factory/orchestration/lease code against an empty
disposable PostgreSQL database, using service_role and the deployed employee enum
definitions. Coverage: two independent tenants, repeats, simultaneous requests,
partial remote success, worker expiry, ownership rejection, legacy adoption,
unhealthy/expired evidence, recovery, saved-readiness invalidation and once-only
factory success events committed atomically with verified employee activation.
Provision adapters are deterministic test doubles in this suite; the separate
Provision Laravel API suites verify its actual upserts, ownership and runtime
resolution. No production data or provider task is used.

Run against a NEW disposable database only:

    P1_TEST_DATABASE_URL=postgres://postgres@127.0.0.1:55439/postgres node --test tests/foundation.test.mjs

The suite refuses another host/port or a nonempty public schema. Its database
bootstrap requires a superuser; application RPC execution uses service_role.
Existing Provision runtime/network isolation suites also passed. npm run lint
and npm run build are required before checkpointing.

## Next gate and deferred work

Before production use, approve rollout of the pinned Provision repair plus its
heartbeat migration, the earlier isolated Redis topology and this Staff AI
migration. Retain existing resources and explicit legacy ownership. Then prove
two real organizations provision and complete a real task through provisiond.
Local integration tests do not substitute for that live acceptance gate.

Deferred: optional non-initial business-adapter crash-gap idempotency, broader
dashboard demo content/UI polish, model-policy alignment, Frappe business adapters
and durable task-result synchronization. No provider or model policy changed.
