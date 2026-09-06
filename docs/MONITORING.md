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

---

## Update, 2026-09-06: interface monitoring, the engineer, and what broke

### staffai_events.org_id was NOT NULL

Every system-level event was being silently rejected, because no caller checked
the insert error. The sweep, the interface report and the reliability engineer's
incidents all failed to persist, which meant change detection found no previous
row on every run and mailed every time instead of when the picture changed.
`org_id` is now nullable for system events and all three inserts are checked.

### Interface monitoring

Playwright reports into the same alerting path as the backend sweep, through
`tests/e2e/report-to-monitor.js` and `POST /api/monitor/ui`. It runs on the VPS,
because Playwright cannot run on Vercel.

Two things that came out of running it, both of which matter:

**Vercel challenges headless browsers from datacenter addresses.** The account
is on Hobby, where IP bypass rules are unavailable (`Number of IP bypass rules
exceeds limit: 0`) and an automation bypass secret cannot be created. So the
suite gets the Security Checkpoint instead of the site. A challenged run is
reported as **blocked**, not failed: a run that could not happen and a product
that is broken must not look the same in an alert. If any check is explicitly
challenged, the whole run is classified blocked, because the collateral failures
do not mention the checkpoint - a page that never rendered just looks like a
missing element.

**Running the suite got the whole address flagged**, which broke the
five-minute monitor cron from that same host. The synthetic-customer cron is
therefore **not scheduled**; the script remains at
`/usr/local/bin/staffai-synthetic-customer.sh` and can be run by hand. Restoring
a scheduled interface check needs one of: a Vercel Pro plan so the address can
be allowlisted, or a different address to run it from.

### The heartbeat

Because the VPS cron can be blocked at the edge, `lib/heartbeat.js` runs the
sweep from inside the application on ordinary traffic, at most once every five
minutes. The interval is enforced in the database rather than in memory, because
serverless instances are plural and short-lived. It cannot be blocked by an edge
rule because it never crosses the edge.

It is not a replacement for an external checker: it cannot tell you the site is
down, because if the site were down nothing would trigger it. Current cadence is
therefore the heartbeat on traffic, the daily Vercel cron as a floor, the VPS
cron whenever the edge lets it through, and Provision's own reconciler every
five minutes locally.

### The reliability engineer

`lib/reliability/engineer.js`, on `deepseek/deepseek-v4-pro` (verified live on
OpenRouter at $0.75/M in, $1.50/M out, 1M context).

It runs only when a sweep fails, and only when `RELIABILITY_ENGINEER=on`. It
ships with `RELIABILITY_ENGINEER_DRY_RUN=on`, so today it diagnoses, proposes
and writes up without executing.

The model chooses which allowlisted action to take and against which
organization. It cannot invent an action: one it names that is not on the list
is refused by code, not by prompt. The list is `redeliver_tasks`,
`resume_provisioning` and `escalate`. Nothing deletes, deploys, rotates a
credential, touches billing or DNS, or reaches a customer. Three actions per
incident, one organization each. Every incident is written to `staffai_events`
as `reliability.incident` and mailed with the diagnosis, the confidence and what
was actually done.

To take it out of dry run, set `RELIABILITY_ENGINEER_DRY_RUN=off`. Do that only
after reading a few incidents and agreeing with what it proposed.
