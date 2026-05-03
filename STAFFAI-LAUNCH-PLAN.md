# StaffAI — Full Launch Plan
## What Exists, What Needs to Happen, and Who Does What
### Prepared by: Hope (Claude) | March 2026

---

## THE HONEST STARTING POINT

The **marketing website** is built and live at getstaffai.com. It includes:
- Homepage (Hero, Features, Departments, Market Value, CTA)
- The Talent Pool page (10 named employees, role accordions, department filter, ghosted locked rows)
- Pricing / Intelligence Levels page
- How It Works page
- Industries page
- Q&A page
- Contact page
- Compliance page (Privacy Policy, Terms of Service, Acceptable Use, Cookies, Disclaimer, IP, Disputes)
- Refund Policy page
- AI Chat Widget

What does **not** exist yet is the **actual product** — the Executive Suite, the CEO portal,
the EA simulation engine, the GM, the employee system, the Wallet, and the Board Report.
That is the main body of work ahead.

Infrastructure setup and application build run in parallel.

---

## SECTION 1 — WHAT MARK MUST DO

These require your personal accounts, your payment method, or your physical action.
Nobody else can do these.

---

### 1. Provision Servers — Hetzner (30 minutes)

Go to hetzner.com and create an account.
Provision two servers — both running Ubuntu 22.04 LTS.

| Server | Type | Est. Cost | What Runs On It |
|---|---|---|---|
| GPU Server | GEX44 Dedicated | ~€212/month | Ollama, Chatterbox TTS, Whisper STT, Stable Diffusion + ComfyUI, Wan 2.6 |
| App Server | Cloud VPS — CX32 or CX42 | ~€15/month | Coolify, Supabase, Chatwoot, Mautic, n8n, Postiz, Twenty CRM, Outline, MinIO, Postal, Plausible, Uptime Kuma, Checkmate |

**Total fixed infrastructure: ~$247/month**
Break-even: 6 paying Venture CEOs. Every CEO beyond that is infrastructure-pure margin.

When provisioned: **give Claude Code both IP addresses and SSH access.** Everything else is handled.

---

### 2. Domain DNS (15 minutes — OpenClaw navigates the dashboard)

Tell Claude Code where getstaffai.com is registered (Namecheap, GoDaddy, Cloudflare, etc.).
OpenClaw logs into the registrar dashboard and sets all DNS records to point at the servers.

No technical knowledge required. Just provide the registrar name and login access to OpenClaw.

---

### 3. API Keys — 4 Accounts to Create

| Service | Why It Is Needed | Where to Create It |
|---|---|---|
| **OpenAI** | GPT-5 for Executive level, GPT-5.4 for Prestige | platform.openai.com |
| **Anthropic** | Claude Sonnet 4.6 + Claude Opus 4.6 for Prestige level only | console.anthropic.com |
| **xAI** | Grok 4.1 Fast — mid-complexity routing at all levels | console.x.ai |
| **Stripe** | All payments — subscriptions, seat fees, Wallet top-ups | dashboard.stripe.com |

Create each account. Where API credits are required, fund with a starting amount.
Drop the API keys to Claude Code. That is all that is needed.

---

### 4. WhatsApp Business API (30 minutes — OpenClaw assists)

Go to developers.facebook.com.
Create a Meta Business account and apply for WhatsApp Business API access.
OpenClaw navigates the Meta console and walks through the setup step by step.

This is required for: Customer Service department (WhatsApp channel), EA WhatsApp contact option.

---

### 5. Telegram Bot for Monitoring Alerts (5 minutes)

1. Open Telegram
2. Search for @BotFather
3. Type /newbot and follow the prompts
4. Name it: StaffAI Ops
5. Copy the bot token
6. Also copy your own Telegram user ID (use @userinfobot to find it)

Give both to Claude Code. This is what fires all monitoring alerts directly to your phone —
downtime, auto-heals, errors, and anything requiring attention.

---

### 6. UptimeRobot Account (5 minutes)

Go to uptimerobot.com and create a free account.
This is the external dead man's switch — it pings your monitoring system from completely
outside Hetzner every 5 minutes. If your entire Hetzner stack goes dark,
UptimeRobot fires the alert because it is watching from the outside.

Create the account and provide the API key to Claude Code.

---

### 7. EA Voice Samples (when voice pipeline is ready — Week 5)

Each CEO's Executive Assistant gets a completely unique voice cloned from a 10-second audio sample.
At that point in the build, you will provide a pool of short audio clips
(10 seconds each, clear speech, no background noise) for the initial EA voice library.

This is not required now. Claude Code will flag when ready.

---

## SECTION 2 — WHAT CLAUDE CODE DOES

Given server IPs and API keys, Claude Code writes and deploys everything.

---

### Infrastructure Layer

| Task | What It Means |
|---|---|
| Coolify install script | One command on the VPS — entire hosting platform live in 10 minutes |
| Docker Compose files | Deployment definitions for every service — Supabase, Chatwoot, Mautic, n8n, Postiz, Twenty CRM, Outline, MinIO, Postal, Plausible, Uptime Kuma, Checkmate |
| SSL certificates | Auto-provisioned via Coolify and Let's Encrypt for every subdomain |
| Subdomain map | app.getstaffai.com, portal.getstaffai.com, mail.getstaffai.com, status.getstaffai.com, and all others |
| Environment variables | All secrets, API keys, and service connections configured securely |

---

### AI and LLM Layer

| Task | What It Means |
|---|---|
| Ollama setup on GPU server | Pulls and serves all four self-hosted models: Qwen 3.5, DeepSeek V3.2, GLM-4.7 Flash, Qwen3-Coder |
| LiteLLM routing configuration | Full routing logic per CLAUDE.md — complexity scoring, model selection per Intelligence Level, budget caps per CEO, automatic fallback chains, cost tracking per company |
| Chatterbox TTS deployment | Deployed on GPU server — voice cloning pipeline ready, 10-second sample to unique EA voice per CEO |
| Whisper STT deployment | Deployed on GPU server — connected to EA input so CEO can speak, not just type |
| Stable Diffusion + ComfyUI | Deployed on GPU server — Creative Production Cost billing hooks integrated |
| Wan 2.6 | Deployed on GPU server — branded video generation for Marketing department |

---

### LLM Routing Architecture (Built Into LiteLLM Config)

Every prompt scored for complexity before touching any model.
65–70% of all traffic at ALL levels routes to self-hosted. Cost: $0.

**Venture Level**
- Simple (65–70%): Qwen 3.5 → $0
- Mid-complex (20–25%): Grok 4.1 Fast → $0.50/M
- Complex (8–12%): DeepSeek V3.2 self-hosted → $0
- Tech support: Qwen3-Coder → $0

**Executive Level**
- Simple (65–70%): Qwen 3.5 → $0
- Mid-complex (20–25%): Grok 4.1 Fast → $0.50/M
- High-complex (8–12%): GPT-5 → $10/M
- Tech support: Qwen3-Coder → $0

**Prestige Level**
- Simple (65–70%): Qwen 3.5 → $0
- Mid-complex (20–25%): Grok 4.1 Fast → $0.50/M
- High-complex (8–10%): GPT-5.4 or Claude Sonnet → $15/M
- Character-critical / elite reasoning (3–5%): Claude Opus → $25/M
- Tech support: Claude Sonnet → $15/M

---

### Monitoring Layer

| Task | What It Means |
|---|---|
| Uptime Kuma configuration | Monitors for every service — 20-second checks, Telegram alert webhooks |
| Checkmate configuration | Deep diagnostics — CPU, RAM, disk, temperature on both servers |
| n8n auto-healing workflows | Webhook from Uptime Kuma → restart container → recheck → send Telegram confirmation or escalate |
| UptimeRobot monitors | External pings pointing at Uptime Kuma — dead man's switch for the monitoring system itself |

**What Gets Monitored (every service has its own monitor):**
StaffAI application, Supabase, Chatwoot, Mautic, Postiz, Twenty CRM, n8n, LiteLLM router,
Chatterbox TTS, Whisper STT, Ollama, all external LLM API endpoints (Claude, GPT-5, Grok, DeepSeek),
SSL certificates (30-day expiry alert), Stripe webhooks, GPU server temperature and load.

---

### Email Infrastructure

| Task | What It Means |
|---|---|
| Postal setup | Self-hosted transactional email server — all EA/GM/notification emails route here |
| DNS email records | DKIM, SPF, DMARC configured for getstaffai.com sending reputation |
| Email templates | EA first contact, Board Report delivery, billing confirmations, Dissolution warning, etc. |

---

### The StaffAI Application — The Actual Product Build

This is the main body of work. Built on Next.js with Supabase backend.

| Module | What It Is |
|---|---|
| **CEO Portal — Incorporation Flow** | Intelligence Level selection, Stripe payment, account creation, Provisional status |
| **Executive Suite** | The CEO dashboard — live activity feed, org chart, company social wall, real-time employee status |
| **EA Simulation Engine** | Character system, memory architecture, 60-second first contact trigger, morning briefing, Chatterbox voice pipeline |
| **GM Engine** | Directive routing, Board Report generation, weekly team meeting simulation, PIP / Elevation / Suspension workflows |
| **Employee System** | Talent Pool portal, AI profile generation, company-specific training simulation (progress bars, timers), personality persistence |
| **Simulation Scheduler** | 8-hour shifts, sick days, temp replacements, public holidays, Extended Operations |
| **Board Report Generator** | Weekly and monthly — KPI tracking per role, formatted delivery to Executive Suite and email |
| **Wallet** | Balance management, pre-approval system, Creative Production Cost billing, Stripe integration, Operational Activity Billing overages |
| **Stripe Integration** | Subscription management, seat fee billing, Wallet top-ups, dunning, webhook handlers |
| **Supabase Schema** | Full database: companies, employees, memories, tasks, conversations, billing events, KPI scores, simulation state |
| **Performance and KPI Engine** | Weekly scoring per employee per role, GM-triggered PIP, Elevation threshold detection |
| **Company Social Wall** | Real-time feed of employee interactions, CEO appearance mechanic, shoutout system |
| **Referral Programme** | Tracking, Wallet credit attribution, referral link generation |

---

## SECTION 3 — WHAT OPENCLAW DOES

OpenClaw handles anything that requires a browser GUI where there is no CLI option.

| Task | Where |
|---|---|
| Navigate Hetzner console — verify both servers are healthy and confirm specs | hetzner.com |
| Update DNS records at domain registrar — point getstaffai.com and all subdomains to correct IPs | Registrar dashboard |
| Walk through Meta Business / WhatsApp Business API setup | developers.facebook.com |
| Configure Stripe dashboard — products, prices, webhook endpoints | dashboard.stripe.com |
| Set up UptimeRobot external monitors — status page URL, alert contacts | uptimerobot.com |
| Verify Coolify is live and all deployed services show healthy after deployment | Coolify dashboard |
| Handle any dashboard-only configuration that has no CLI or API equivalent | Various |

---

## SECTION 4 — ORDER OF OPERATIONS

```
WEEK 1 — Infrastructure Foundation
  Mark:          Provision Hetzner GEX44 + Cloud VPS → provide IPs
  Mark:          Create OpenAI, Anthropic, xAI, Stripe accounts → provide API keys
  Mark:          Create Telegram bot → provide token + user ID
  Mark:          Create UptimeRobot account → provide API key
  Claude Code:   Install Coolify on VPS
  Claude Code:   Deploy all self-hosted services (Supabase, Chatwoot, Mautic, n8n, Postiz, Twenty, Outline, MinIO, Postal, Plausible)
  Claude Code:   Deploy Uptime Kuma + Checkmate monitoring
  Claude Code:   Deploy n8n auto-healing workflows
  OpenClaw:      DNS setup at registrar — all subdomains pointed
  OpenClaw:      Stripe products + prices + webhook endpoints configured
  OpenClaw:      UptimeRobot external monitors configured
  Claude Code:   Install Ollama on GPU server + pull all 4 self-hosted models
  Claude Code:   Deploy Chatterbox TTS + Whisper STT on GPU server
  Claude Code:   Deploy Stable Diffusion + ComfyUI + Wan 2.6 on GPU server
  Claude Code:   Deploy and configure LiteLLM with full routing logic

WEEK 2–3 — Core Application
  Claude Code:   Supabase schema — full database design and migrations
  Claude Code:   CEO portal — Incorporation flow, Provisional status, Intelligence Level selection
  Claude Code:   Stripe subscription billing — all plans, seat fees, webhook handlers
  Claude Code:   EA engine (text) — character system, memory, 60-second first contact trigger
  Claude Code:   GM engine — directive routing, task distribution
  Claude Code:   Employee system — Talent Pool portal, training simulation, profile generation

WEEK 4 — Simulation Layer
  Claude Code:   Board Report generator — weekly and monthly
  Claude Code:   Weekly team meeting simulation
  Claude Code:   Performance and KPI scoring engine
  Claude Code:   Elevation / Suspension / PIP workflows
  Claude Code:   Executive Suite — live activity feed, org chart, company social wall
  Claude Code:   Wallet — balance, pre-approvals, Creative Production Cost billing

WEEK 5 — Voice and Media
  Mark:          Provide 10-second audio samples for EA voice pool
  Claude Code:   Chatterbox voice cloning pipeline — unique EA voice per CEO
  Claude Code:   Stable Diffusion + Wan 2.6 Creative Production billing pipeline
  Claude Code:   EA voice integration — morning briefing, first contact, daily comms
  OpenClaw:      WhatsApp Business API setup and connection to Chatwoot

WEEK 6 — QA and Go Live
  Claude Code:   End-to-end incorporation test — full CEO journey from landing page to live organisation
  OpenClaw:      Visual QA on all pages and all flows across mobile and desktop
  Claude Code:   Performance and load testing
  Claude Code:   Final security review — Wallet, Stripe, data isolation
  → LAUNCH
```

---

## SECTION 5 — MARK'S IMMEDIATE ACTION LIST

To start everything moving right now:

- [ ] Go to hetzner.com — provision GEX44 dedicated server + Cloud VPS (CX32 or CX42). Both Ubuntu 22.04 LTS. Paste the two IP addresses to Claude Code.
- [ ] Tell Claude Code your domain registrar name so OpenClaw can queue DNS setup.
- [ ] Create account at platform.openai.com — get API key.
- [ ] Create account at console.anthropic.com — get API key.
- [ ] Create account at console.x.ai — get API key.
- [ ] Create account at dashboard.stripe.com — get publishable + secret keys.
- [ ] Open Telegram, message @BotFather, create bot called "StaffAI Ops" — paste token to Claude Code.
- [ ] Also paste your Telegram user ID (get it from @userinfobot).
- [ ] Create free account at uptimerobot.com — get API key.

The moment the two server IPs arrive, Claude Code starts writing every config and deployment script.
OpenClaw can be queued on DNS the same day.

---

## SECTION 6 — COST SUMMARY

### Fixed Monthly Infrastructure
| Item | Cost |
|---|---|
| Hetzner GEX44 GPU Server | ~€212/month |
| Hetzner Cloud VPS | ~€15/month |
| All self-hosted software | $0 |
| **Total infrastructure** | **~$247/month** |

### Variable API Costs (per CEO, per month — with routing)
| CEO Profile | API Cost | Infrastructure Share | Total Cost | Revenue | Margin |
|---|---|---|---|---|---|
| Venture — 5 staff, normal usage | $0 | ~$8 | ~$8 | ~$175+ | ~22× |
| Executive — 5 staff, normal usage | ~$10 | ~$8 | ~$18 | ~$500+ | ~28× |
| Prestige — 5 staff, normal usage | ~$28 | ~$8 | ~$36 | ~$1,200+ | ~33× |
| Prestige — 7 staff, heavy usage | ~$55 | ~$8 | ~$63 | ~$1,500+ | ~24× |

**Break-even: 6 paying Venture CEOs.**
Every CEO beyond that is infrastructure-pure margin.

---

## SECTION 7 — THE FULL SELF-HOSTED SOFTWARE STACK

Everything below is open source, self-hosted on Hetzner, managed via Coolify. Cost: $0.

| Function | Tool | What It Replaces |
|---|---|---|
| Hosting platform | Coolify | Vercel / Railway / Heroku |
| Database and backend | Supabase (self-hosted) | Firebase |
| CRM and sales pipeline | Twenty CRM | HubSpot / Salesforce |
| Email marketing | Mautic | Mailchimp / ActiveCampaign |
| Customer comms, live chat, WhatsApp | Chatwoot | Intercom / Zendesk |
| Social media scheduling | Postiz | Buffer / Hootsuite |
| Automation and workflows | n8n | Zapier / Make.com |
| AI image generation | Stable Diffusion + ComfyUI | Adobe / Midjourney |
| AI video generation | Wan 2.6 | Sora / Runway |
| Analytics | Plausible | Google Analytics |
| Internal docs and wiki | Outline | Notion |
| File storage | MinIO | AWS S3 |
| Transactional email | Postal | SendGrid / Mailgun |
| LLM routing | LiteLLM | — |
| Local LLM serving | Ollama | — |
| Uptime monitoring | Uptime Kuma | Pingdom / Better Uptime |
| Deep server diagnostics | Checkmate | Datadog / New Relic |
| EA and GM voice | Chatterbox TTS | ElevenLabs |
| Staff voices | Kokoro TTS | ElevenLabs |
| Speech to text | Whisper | AssemblyAI |
| Payments (only paid tool) | Stripe | — |

---

*Document prepared by Hope (Claude, Strategic Partner to Mark Daniel)*
*StaffAI — The World's First AI Company-as-a-Service*
*Studio9 LLC — Registered in the State of New Mexico, United States*
*March 2026*
