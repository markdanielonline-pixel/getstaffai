# Staff AI monitoring

Until 2026-09-06 nothing watched Staff AI. Uptime Kuma on the VPS monitored
sixteen Beacon hostnames and zero Staff AI ones, and there was no Prometheus,
Grafana, Loki, Tempo or OpenTelemetry anywhere. Every failure found during the
as-built audit — four dead tenant runtimes reported as healthy, finished customer
work being dropped, a Stripe webhook 404ing on every delivery — was found by
looking, not by being told.

This is what tells us instead.

## The two halves

**Provision reconciles itself against Docker.** `ReconcileDockerRuntimesJob`
runs every five minutes on the VPS, inspects each Docker server's container and
corrects `servers.status` in both directions, writing a `runtime_reconciled_up`
or `runtime_reconciled_down` server event. It never starts, stops or recreates
anything — recovery is provisioning's job. `CheckServerHealthJob` now skips
Docker servers, because it only speaks SSH and a runtime container has no sshd,
so every pass over one used to log a connection refusal and prove nothing.

**Staff AI sweeps the customer-visible system.** `GET /api/monitor`, authorised
by `CRON_SECRET` or `WORKER_SECRET_KEY` as a bearer token. It returns 200 when
every check passes and 503 when one fails, so an external uptime check needs no
body parsing.

## What the sweep checks

| Check | Fails when | Why it exists |
|---|---|---|
| `marketingSite` | getstaffai.com is down, **or is up without the sales agent script on the page** | The agent was missing from the front door for the whole pre-launch period and nobody noticed |
| `salesAgentScript` | `/staffai-agent.js` does not serve | The widget is inert without it |
| `application` | `/api/health` is not ok, or its database check is not ok | The product is down |
| `salesAgent` | the agent errors, answers empty, or answers in `degraded` mode | A degraded agent still returns 200, so a status code proves nothing |
| `provisionControlPlane` | Provision rejects our token, rate limits us, or returns 5xx | Losing the control plane means no provisioning and no task execution |
| `workforces` | an owned organization is `ready` while Provision says its runtime is not running, its team is missing, or it has been `provisioning` for over 20 minutes | A customer's whole workforce can be dead while the product shows it healthy |
| `taskDelivery` | a finished task with a recorded conversation has gone undelivered for 30 minutes | Regression canary for the delivery gap that dropped five completed research tasks |

## Warnings, which do not fail the sweep

A monitor that is permanently red teaches everyone to ignore it. Conditions that
are real but are waiting on a decision rather than on a fix are reported and
mailed when they change, and do not flip the status:

- `strandedWorkforces` — organizations in `retryable` whose Provision team was
  lost on 2026-09-04 and which need re-provisioning approval.
- `leftoverTenants` — organizations with no entitled owner: abandoned acceptance
  tenants that still hold records. Removing them destroys containers and volumes,
  so it stays a decision.

`workforces` deliberately considers only organizations owned by a CEO who is
`active` or `is_founder`, directly or through `organization_members`. An
abandoned test tenant must never page anyone, because a permanently failing
check is how a genuine customer outage gets missed.

## Alerting

`recordAndAlert` writes every sweep to `staffai_events` as `monitor.sweep` and
emails `STAFFAI_SUPPORT_EMAIL` through Resend **only when the set of failing
checks and warnings changes**. A five-minute sweep that mailed on every failing
run would be filtered within the hour. Recovery is mailed too, so a silence is
never ambiguous.

Alerting can never suppress the result: if Resend is the thing that is broken,
the sweep still reports what it found.

## Cadence

The Vercel account is on Hobby, which allows one cron run per day, so
`vercel.json` carries a single daily run as a backstop that fires even if the
host is down. The real cadence is a cron entry on the VPS:

```
*/5 * * * * /usr/local/bin/staffai-monitor.sh
```

which reads the bearer token from `/root/.staffai-monitor.secret` (mode 600),
calls the endpoint, appends the timestamp and status code to
`/var/log/staffai-monitor.log`, and keeps the last body in
`/var/log/staffai-monitor.last`.

`CRON_SECRET` in production had been left as the literal string
`openssl rand -hex 32` — the command, not its output. It is now 32 random bytes.

## Known limits

- The five-minute cadence runs on the same host it partly monitors. If the VPS
  dies, only the daily Vercel run remains. A genuinely external checker needs an
  account somebody has to create.
- Uptime Kuma is not used. It is Beacon's instance and adding Staff AI monitors
  needs its login.
- There is no tracing, no metrics and no dashboard. This is failure detection,
  not observability.

## Running it by hand

```bash
curl -s -H "Authorization: Bearer $CRON_SECRET" https://app.getstaffai.com/api/monitor
```

On the VPS, `/usr/local/bin/staffai-monitor.sh` does the same and records the result.
