# Staff AI — As-Built Diagrams, 2026-09-05

Companion to `STAFFAI-AS-BUILT-2026-09-05.md`. Every diagram here describes what
is deployed and observed, not intended architecture. Dashed lines mark paths
that exist in code but are not reachable in production.

---

## 1. System topology as built

```mermaid
graph TB
  subgraph Internet
    V[Anonymous visitor]
    C[Customer browser]
  end

  subgraph VercelDist["Vercel project &quot;dist&quot; (no git link)"]
    MKT["getstaffai.com / www.getstaffai.com<br/>static SPA, no AI agent"]
  end

  subgraph VercelApp["Vercel project &quot;staffai-app&quot; (repo getstaffai)"]
    APP["app.getstaffai.com<br/>Next.js App Router"]
    SALES["/api/chat — public Sales Agent"]
    SUCCESS["/api/support/agent — Success Agent"]
    EMPCHAT["/api/employees/chat"]
    HOOK["/api/webhooks/stripe"]
    NA["/api/auth/* NextAuth+Authentik<br/>returns 500, dead"]
  end

  subgraph Supabase["Supabase project StaffAi2 (tthoguhefuqnahellnrg)"]
    AUTH[(auth.users)]
    DB[(public schema<br/>50 tables, RLS on all)]
  end

  subgraph VPS["VPS 158.220.123.254 — Ubuntu 24.04, Docker 29.1.3, ufw INACTIVE"]
    NPM["stack-npm-1<br/>nginx-proxy-manager :80/:443"]
    subgraph PC["provision_default + provision_control-plane"]
      PAPP["provision-app-1<br/>Laravel + Horizon + Reverb<br/>127.0.0.1:8000"]
      PDB[("provision-database-1<br/>MariaDB 11.4")]
      PRD[("provision-redis-1")]
      RT1["provision-runtime-&lt;serverId&gt;<br/>OpenClaw 2026.7.1-2 pinned"]
      RTN["... one container per tenant"]
    end
    subgraph STACK["stack_default — 35 containers, shared"]
      LEG["staffai-web:3000<br/>LEGACY staffai-v2"]
      N8N[n8n]
      ESPO[EspoCRM]
      POSTIZ[Postiz]
      KUMA["Uptime Kuma<br/>Beacon monitors only"]
      CAL["lynkwe-calcom<br/>serves Beacon"]
      FR["frappe_docker-* ERPNext<br/>Beacon sites"]
      FB["stack-formbricks-1<br/>COMPROMISED, stopped"]
    end
  end

  subgraph External
    STRIPE[Stripe acct_1JCwmm...<br/>shared with Beacon/Lynkwe]
    OR[OpenRouter]
    RS[Resend]
    OS[Outscraper]
  end

  V --> MKT
  MKT -->|links only| APP
  V --> SALES
  C --> APP
  APP --> AUTH
  APP --> DB
  APP --> SALES
  APP --> SUCCESS
  APP --> EMPCHAT
  SALES --> OR
  SUCCESS --> OR
  EMPCHAT -->|bearer token, HTTPS| NPM
  NPM -->|provision.getstaffai.com| PAPP
  PAPP --> PDB
  PAPP --> PRD
  PAPP -->|docker exec| RT1
  PAPP -->|docker exec| RTN
  RT1 -->|OpenRouter key in runtime .env| OR
  RT1 -->|open egress| Internet
  RT1 -.->|reachable: control-plane DB port| PDB
  STRIPE -->|checkout.session.completed| HOOK
  APP --> RS
  NPM --> MKT
  NPM --> LEG

  classDef dead fill:#eee,stroke:#999,stroke-dasharray: 4 3;
  class LEG,NA,FB,CAL,FR,ESPO,POSTIZ,N8N,OS dead;
```

Legend: grey/dashed nodes are present on the host but not part of the live
Staff AI production path.

---

## 2. Customer journey as built

```mermaid
sequenceDiagram
  autonumber
  actor U as Visitor
  participant MKT as getstaffai.com (Vercel "dist")
  participant APP as app.getstaffai.com (Next.js)
  participant SB as Supabase
  participant ST as Stripe
  participant PV as Provision Core (VPS)
  participant RT as Tenant runtime (OpenClaw)
  participant OR as OpenRouter

  U->>MKT: browse marketing SPA
  Note over MKT: no AI sales agent on this host
  U->>APP: /portal/signup?billing=monthly
  APP->>SB: auth.signUp(emailRedirectTo=/auth/callback)
  SB-->>U: confirmation email (Supabase default sender)
  U->>APP: /auth/callback then /portal/incorporate
  APP->>SB: create ceos + organizations + organization_members
  APP->>ST: POST /api/checkout (mode=subscription, trial 7d)
  U->>ST: card details on Stripe Checkout
  ST-->>APP: webhook checkout.session.completed (signed)
  APP->>SB: ceos.status='active', subscriptions upsert
  U->>APP: /portal/dashboard
  APP->>PV: POST /integrations/staffai/teams (bearer)
  PV->>PV: ProvisionDockerServerJob -> docker create/start
  PV->>RT: container from pinned digest sha256:986c1f50...
  APP->>PV: POST teams/{id}/agents  (EA, then GM)
  PV->>RT: CreateAgentOnServerJob (per-server lock, 40 tries)
  RT->>RT: install agent, restart gateway (setsid)
  APP->>PV: GET agents/{id} until operational
  APP->>SB: employees.status='active', workforce_status='ready'
  APP->>SB: first-contact message from EA
  U->>APP: message an employee
  APP->>PV: POST /integrations/staffai/tasks
  PV->>RT: task to agent
  RT->>OR: model call (qwen/qwen3.8-flash by default)
  RT-->>PV: result_summary
  APP->>PV: poll GET tasks/{id} (in the customer's request)
  alt request survives
    APP->>SB: write employee message, stamp delivered_at
  else request dies (>300s, tab closed, 504)
    Note over APP: task left undelivered
    U->>APP: open conversation later
    APP->>PV: reconcileConversationTasks
    APP->>SB: write employee message (delivered_by=reconcile)
  end
```

---

## 3. Control-plane data model (architecture-critical only)

```mermaid
erDiagram
  AUTH_USERS ||--|| CEOS : "id = id"
  CEOS ||--o{ ORGANIZATION_MEMBERS : "ceo_id"
  ORGANIZATIONS ||--o{ ORGANIZATION_MEMBERS : "org_id"
  CEOS }o--|| ORGANIZATIONS : "org_id = ACTIVE org"
  ORGANIZATIONS ||--o{ EMPLOYEES : "org_id"
  CEOS ||--o{ EMPLOYEES : "ceo_id"
  EMPLOYEES ||--o| CONVERSATIONS : "employee_id"
  CONVERSATIONS ||--o{ MESSAGES : "conversation_id"
  EMPLOYEES ||--o{ EMPLOYEE_TASKS : "employee_id"
  CEOS ||--o{ SUBSCRIPTIONS : "ceo_id"
  ORGANIZATIONS ||--o| PROVISIONING_OPERATIONS : "org_id"
  CEOS ||--o{ SUPPORT_TICKETS : "ceo_id"

  CEOS {
    uuid id PK "= auth.users.id"
    text status "provisional | active"
    bool is_founder "internal grant"
    uuid org_id "active organization"
  }
  ORGANIZATIONS {
    uuid id PK
    text workforce_status "not_ready|provisioning|ready|retryable"
    text provision_team_id "Provision team ULID"
    text model_policy "per-org model route, null = customer default"
  }
  EMPLOYEES {
    uuid id PK
    uuid org_id FK
    text role
    text status "training|active|alumni"
    text provision_agent_id
    text provision_runtime_status
  }
  EMPLOYEE_TASKS {
    uuid id PK
    text provision_task_id
    jsonb metadata "conversation_id for durable delivery"
    timestamptz delivered_at
  }
```

Tenant boundary: `organization_members` decides which organizations a CEO may
act as; `ceos.org_id` is the one currently active. Every org-scoped query filters
on `ceo.org_id`. RLS additionally restricts direct client reads to
`auth.uid() = ceo_id`, and `organizations` to rows the caller is a member of.

---

## 4. Runtime ownership and the OpenClaw pin

```mermaid
flowchart LR
  A[Staff AI: provisionAgentRuntime] -->|POST teams/{team}/agents| B[StaffAiIntegrationController]
  B --> C[CreateAgentOnServerJob<br/>tries=40, backoff 10/15/20/30]
  C --> D{Cache::lock<br/>docker-runtime:serverId<br/>lease 360s}
  D -->|acquired| E[AgentUpdateScriptService<br/>generateOpenClawScript]
  E --> F["flock /var/lock/openclaw-install.lock -c<br/>'if ! &lt;dist check literal&gt;; then rm -rf ...; fi;<br/>openclaw update --tag <b>2026.7.1-2</b> --yes --json<br/>|| npm install -g <b>openclaw@2026.7.1-2</b>'"]
  F --> G[verify version + dist integrity<br/>fail closed]
  G --> H[pkill -f 'openclaw[- ][g]ateway'<br/>setsid nohup openclaw gateway ... disown]
  H --> I[WorkforceReadiness.inspect<br/>accepts agents.list and agents.entries]
  I --> J[Staff AI polls GET agents/{id}<br/>until operational]

  style F fill:#dfd,stroke:#2a2
  style H fill:#ffd,stroke:#aa2
```

The green box is the corrected defect. It previously read
`"openclaw@$PINNED_OPENCLAW_VERSION"` inside a single-quoted `flock -c` payload.
`flock -c` runs a new shell; the variable was never exported, so the payload
expanded to `npm install -g "openclaw@"` (newest release) and the integrity test
degraded to `sh -c ""` (always true, so a corrupt tree was never cleared).

The yellow box is the known interruption: installing or dismissing an employee
restarts the tenant's single shared gateway, so the whole workforce is briefly
offline and in-flight work on that runtime can be lost.
