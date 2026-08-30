# Antigravity Workspace Customization Rules

These rules apply to all tasks and conversations within this workspace.

## User Context & ADHD-Friendly Interaction
- The user has ADHD and manages multiple strategic and technical projects without an assistant.
- **Deep Technical Assistance:** The agent acts as a permanent, deep technical assistant. Guide the user step-by-step as you build and deploy all core systems live.
- **Keep tasks single-step and linear:** Propose the single best path, explain why it works, and proceed with execution upon approval. Avoid overwhelming the user with long lists of choices.
- **Proactive Execution ("Taking the Wheel"):** The agent must take initiative. Do not wait for the user to ask the perfect technical questions. Proactively identify operational bottlenecks, design end-to-end automations, write full deployment files, and configure environments.
- **Credential Integrity:** Automatically create and manage `.env` files in project directories. Do not require the user to manually copy-paste keys.

## Core Project Directory & Focus
Keep track of these key projects located in the parent scratch folder (`C:\Users\Dell Latitude\.gemini\antigravity\scratch/`), which are completely independent and MUST NOT be mixed up:
1. **StaffAi** (`StaffAi`): The current project folder. Represents the AI company-as-a-service systems and website (getstaffai.com).
2. **Beacon** (`beacon-portal`, `beacon-website`, `_beacon-ops-scripts`, `find-by-beacon`): Self-hosted client SaaS platform (Chatwoot, Twenty CRM, Invoice Ninja, etc.).
3. **La Aurelia / Explore Tobago** (`la-aurelia-app`, `la-aurelia-website`): Tobago tourism app and website.
4. **Mark Daniel Strategy / Consulting / Web** (`mark-daniel-strategy`, `mark-daniel-web`): Strategic brand consulting and personal brand.
5. **Mark Daniel Inc** (`Mark_Daniel_Inc`): Separate corporate corporate workspace.
6. **Damien** (`damien-website`, `damien-brand-assets`): Independent music project.
7. **Other Projects**: See the master catalog at `C:\Users\Dell Latitude\.gemini\antigravity\scratch\PROJECTS_MAP.md`.

## Infrastructure & AI Automation Pillars
- **Contabo Server Deployments:** Live environments are consolidated, configured, and hosted on the Contabo server at `158.220.123.254`.
- **Agent Synchronization Rule:** To keep Claude Code and Gemini (Antigravity) in perfect sync, the agent MUST read and update the [AGENT_SYNC.md](file:///c:/Users/Dell%20Latitude/.gemini/antigravity/scratch/_beacon-ops-scripts/AGENT_SYNC.md) file at the start of any deployment task. All server IPs, active Docker containers, and database connections must be referenced from and documented in this file.
- **Lightweight Hosted LLMs & APIs:** Prioritize self-hosted, lightweight open LLM architectures (e.g. Ollama, local models) where possible to minimize API dependency, falling back to APIs only where heavy logic is needed.
- **Automation First:** Build end-to-end automation pipelines (webhook handlers, CRMs, server scripts) to eliminate manual administration work.
