# Staff AI continuity

Read `STATE.md` first, then Git status/history. Use Git checkpoints and repository
documentation as engineering memory; update `STATE.md` after consequential completed work.

- Staff AI control plane owns tenants/organizations, users/memberships/RBAC,
  entitlements, approvals/autonomy and orchestration metadata.
- Provision Core is the workforce execution engine; Frappe + ERPNext is the Business OS.
- Qwen 3.8 Flash is the architectural default customer-facing workforce model;
  GLM-5.3 is the internal engineering/maintenance model. Implementation alignment
  remains separately scoped. OpenRouter is the initial upstream gateway;
  Staff AI must remain model/provider agnostic.
- OutReply is the provisional social-management integration.
- Do not redesign these boundaries without a concrete architectural contradiction.
- Do not touch historical/untracked artifacts without explicit authorization.

Architecture and current release gate: `STATE.md`. Detailed P1 execution contract:
`docs/P1-WORKFORCE-FOUNDATION.md`. Provision pin: `infra/provision/PINNED_VERSION`.
In sibling `../ProvisionCore`, see `docs/STAFFAI-WORKFORCE-READINESS.md` and
`docs/docker-runtime-isolation.md`.

Production rollout is paused for incident remediation. Follow the security gate
in `STATE.md`; do not restart compromised Formbricks or reuse its writable layer.
