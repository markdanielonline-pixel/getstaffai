# StaffAI — Everything Needed to Go Fully Functional

---

## CREDENTIALS & API KEYS

**Infrastructure**
- Hetzner account access (GEX44 GPU server + CX32 VPS) — SSH keys or root passwords
- Domain registrar access for getstaffai.com — to point DNS

**Payment & Banking**
- Stripe account — API keys (publishable + secret), webhook signing secret
- Mercury Bank account — read-only API token + read-write API token
- Backup processor decision: Whop or Dodo Payments (account if chosen)

**LLM APIs**
- xAI API key (Grok 3 Fast — Venture + Executive + Prestige mid-complexity)
- OpenAI API key (GPT-5 — Executive + Prestige high-complexity)
- Anthropic API key (Claude Sonnet + Opus — Prestige only)

**Communications**
- Meta WhatsApp Business API — account + phone number + API credentials
- Google Workspace API credentials — for Admin Department (Calendar, Drive, Gmail)
- Telegram Bot token — for monitoring alerts and Claude Code Channels

**Monitoring**
- UptimeRobot account — free tier (external dead man's switch)

**Accounting Sync**
- QuickBooks or Xero account — for Mercury bank feed sync

---

## CONTENT & BRAND ASSETS

**Brand**
- Final logo files (SVG + PNG) in Navy #1B3A6B and Gold #C9A84C
- Typography decision — which executive-feel font(s) to use
- Any brand guidelines beyond colours already documented

**Legal Copy (must be human-reviewed)**
- Terms of Service — can be drafted, but needs legal review before going live
- Privacy Policy — must disclose Veritas logging practices (GDPR/CCPA compliant)
- Refund and cancellation policy — the text that appears on checkout confirmations
- Billing descriptor — exact text that appears on CEO credit card statements (must match Stripe exactly)

**EA Characters**
- Default EA names — how many unique EA names in the pool? (e.g. 10–20 names)
- 10-second voice samples for EA voice cloning — one per EA name (can be AI-generated if no real ones)
- GM name(s) and voice sample(s) for Vocal GM add-on
- Receptionist name(s) and voice sample(s)

**Talent Pool**
- Decision: how many employees per department in the initial Talent Pool? (e.g. 3 per role = 45+ profiles)
- Employee names — globally diverse approach confirmed?
- AI-generated employee photos — confirm which tool to use (This Person Does Not Exist, or Stable Diffusion on GPU)
- Employee bios and personality descriptions — tone and depth to confirm

---

## BUSINESS DECISIONS NEEDED

**Incorporation Flow**
- What company culture questions will the EA ask during Step 5? (values, mission, tone, operational hours, holidays)
- What are the default shift hours shown during Incorporation if CEO doesn't specify?
- Which country's public holidays are used as default before CEO sets their location?

**EA Behaviour**
- The EA's first message — approve exact script or draft for review?
- Morning briefing default time — what time is shown as default during setup?
- Pre-approved Wallet payment categories — initial list the EA can action without interrupting the CEO?

**Provisional Portal**
- What does the limited EA say when she surfaces what she can't do without a team? (key psychological pull lines)
- Which Talent Pool profiles are visible (ghosted) at Provisional — all roles, or a curated selection?

**Pricing & Billing**
- Wallet top-up minimum amount — what's the minimum a CEO can load?
- Low balance default threshold suggestion the EA uses as a starting point
- Payment above $500 confirmation flow — email, app notification, or both?

**Board Report**
- What day and time is the default weekly Board Report delivery? (CEO can change, but what's the default?)

---

## INFRASTRUCTURE SETUP CONFIRMATION

- Confirm Coolify is already deployed on the VPS, or does that need to be set up first?
- Confirm which Ollama models are already pulled on the GPU server (Qwen3-30B, DeepSeek-V3, Qwen3-8B, Qwen3-Coder)
- Confirm Chatterbox TTS and Whisper are running, or do they need to be deployed?
- Confirm if any of the app stack (Supabase, Chatwoot, n8n, etc.) is already deployed via Coolify

---

## ONE-TIME DECISIONS

- White-label at Prestige — architecture needs to support CEO branding. What does that look like visually?
- Moxie CRM integration — for CEOs who already use Moxie. Launch or post-launch?
- CEO Network — confirmed post-launch, not blocking anything now
- Transactional email domain — which domain runs through Postal? (e.g. mail.getstaffai.com?)

---

## PRIORITY ORDER (Critical Path)

1. Hetzner server access + domain DNS
2. Stripe + API keys (xAI, OpenAI, Anthropic)
3. Legal copy approved (ToS, Privacy Policy, billing descriptor)
4. EA names + voice samples
5. Talent Pool employee profiles confirmed
6. Incorporation flow questions approved

Everything else can be built in parallel or added post-launch.
