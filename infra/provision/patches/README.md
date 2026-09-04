# ProvisionCore patches — deterministic OpenClaw installation

These three patches fix the defect that repeatedly corrupted the OpenClaw
install inside tenant runtimes. They exist as patch files because the commits
were authored in a local ProvisionCore working copy whose `origin`
(`github.com/provision-org/provision-core`) is an upstream repository we do not
push to, so the VPS checkout at `/root/provision-core` had no way to see them.

**Base commit:** `85ae3fdff0bc73cd843c6f8f6c046e25219bd111`
("fix: enable concurrent production HTTP workers")

Apply in numeric order:

```
cd /root/provision-core
git am 0001-*.patch 0002-*.patch 0003-*.patch
```

If the working tree is dirty or not a clean git checkout, use:

```
cd /root/provision-core
patch -p1 < 0001-*.patch && patch -p1 < 0002-*.patch && patch -p1 < 0003-*.patch
```

All three are required. `0003` broadens the integrity check to cover
side-effect imports, `export * from`, and dynamic `import()`, and removes a
literal single quote that broke the enclosing shell argument. Applying only
`0001`+`0002` ships a check that misses three of the four ways `dist/` can be
corrupt — worse than no check, because it certifies a broken tree as healthy.

## What the defect was

The version guard extracted the installed version with
`grep -oE '[0-9]{4}\.[0-9]+\.[0-9]+'`, which cannot represent a build suffix.
Against the pinned `2026.7.1-2` the token truncated to `2026.7.1`, never
satisfied the guard, and re-ran a global `npm install -g openclaw` on every
provisioning pass. Unserialised repeated installs are how `dist/` ended up
holding bundle chunks from two different builds, producing
`ERR_MODULE_NOT_FOUND` at gateway start.

`openclaw --version` still succeeds on a mixed tree, which is why a runtime
could pass strict readiness with fresh heartbeats while being unable to execute
any task.

## What the patches change

- Version regex admits the build suffix, in both the live path
  (`ChatGPTAuthService`) and the generated update script
  (`AgentUpdateScriptService`).
- Exact comparison against the pin instead of `>=`; a pin is a contract, not a
  floor.
- Installs serialised under `flock /var/lock/openclaw-install.lock`, and a
  corrupt tree removed before installing so npm writes a clean build rather
  than layering onto a partial one.
- `DIST_INTEGRITY_CHECK` detects the real failure mode: a chunk importing a
  hashed sibling that was never written.
- Convergence verified after installing; the update script aborts with
  `FATAL: openclaw did not converge` instead of restarting the gateway onto an
  unusable tree.
- `config/provision.php` default corrected `2026.7.1` → `2026.7.1-2`.

## Why this still matters even though Alpha currently works

Alpha's runtime was repaired by a manual, in-container reinstall. That fix
lives only in that container's filesystem. Any container recreation, tenant
reprovision, or new tenant goes through the unpatched code path and is exposed
to the same corruption. Until these patches are deployed, the repair is not
reproducible and production depends on a hand-mutated container.
