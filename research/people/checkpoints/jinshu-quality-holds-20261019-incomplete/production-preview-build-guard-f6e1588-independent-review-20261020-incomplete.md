# Independent review: production preview build guard

Reviewed patch SHA-256 `251951cd6b0a37f6a144494328bbf559b99ef8aff7d2f3decd516eb9787a054c` against staging commit `f6e1588ed0a2b426c19e6902a208d59f7f87dce4`, which was the remote staging head when checked. `git apply --check` succeeded in an isolated script-only fixture built from that commit.

## Findings

1. **Normal-build portability regression.** The new self-test is required by every `npm run build`, but unconditionally invokes `/bin/sh` and relies on an extensionless POSIX shell shim being discoverable and executable as `node`. Standard Windows installations have neither guarantee, so a normal production build can fail even with preview disabled. `path.delimiter` alone does not make `/bin/sh` or shebang execution portable. Decide whether Unix-only builds are an explicit supported-project constraint; otherwise use a portable test strategy or a fail-fast, explicit platform policy and add Windows coverage.
2. **Narrow entrypoint and output boundary.** The guard is the first command of `npm run build` and blocks the exact value `PEOPLE_SITE_PREVIEW=1`, matching `scripts/lib/people-site.mjs`'s preview switch. It does not fence direct invocations of the preview generator, other build/deploy commands, or manual serving and uploading of an existing preview output tree. A preview HTML `noindex` tag is not access control; such pages and search shards can expose unapproved claims when served publicly. The guard neither removes pre-existing output nor proves that a failed or alternate deployment cannot publish it. Production build configuration and deployment behavior must be verified separately.

## Independent checks

In a temporary directory containing only the pinned package file, scripts/lib, schemas/config and the two patched scripts, with a symlink to the existing dependencies:

- `PEOPLE_SITE_PREVIEW=1 npm run build` returned exit code 1 and printed the guard refusal. The script had the actual package build command; the first guard exited before the following generators could run. This was not a full build.
- `node scripts/test-people-production-build.mjs` passed on the current macOS host. Its first-command assertion, node shim and marker tested both preview refusal and the normal command chain's progression without actually running generators. The in-memory fixture exercised the local preview context and restored its filesystem hooks and environment.
- `node scripts/assert-people-production-build.mjs` exited 0 with the preview variable unset.

These checks do not establish Windows behavior by execution, run CI, build actual public output, confirm the live Cloudflare build settings, inspect the deployed output, or validate the truthfulness of any chapter or person. The correct preview failure is a safety check, not evidence that earlier preview artifacts are inaccessible. No canonical files, existing fixtures, claims, Git index, or locks were modified.
