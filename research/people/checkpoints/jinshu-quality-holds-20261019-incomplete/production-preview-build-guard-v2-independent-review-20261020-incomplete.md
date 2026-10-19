# Independent review: portable production preview guard v2

Patch SHA-256 `451a53aa1a8d423f313f1bead97f09bf20db6fb3337b665ea17e86fd23f5879c`. The remote staging head when checked was `d0cd5d3a6d54f88dc648df78b77f1b1d19bd1b86`; the patch and the inspected context libraries are unchanged from the named `f6e1588ed0a2b426c19e6902a208d59f7f87dce4` base. `git apply --check` succeeded against an isolated script-only snapshot of the current staging head.

## Assessment

The revised self-test replaces v1's hard-coded `/bin/sh` and extensionless shell shim with a Node-launched npm CLI and a temporary project. Its copied package runs the actual `build` script. The temporary replacement for the test script writes a marker and exits 93, so a non-preview nested invocation cannot recursively run the self-test or proceed to a generator; a preview invocation must fail in the guard before the marker. Its direct guard test also checks the unset and `0` cases. The in-memory catalog/context test restores its filesystem hooks and environment. Temporary writes are confined to a new `mkdtemp` directory that the test removes.

`npm_execpath` is explicitly required and checked. On this host an npm invocation supplied `/usr/local/lib/node_modules/npm/bin/npm-cli.js`, and the actual outer npm build reached and completed the self-test. Running the test directly with `node` and no npm-provided path fails intentionally; the package supplies an npm self-test command. Launching the Node CLI directly, using platform `path` helpers and letting npm choose its script shell removes the identified hard-coded POSIX dependency and is plausibly Windows-portable. Windows and nonstandard npm wrappers were not empirically tested; npm CLI semantics and temporary-directory access are still prerequisites.

The guard covers `npm run build` with the exact preview value `1`, consistent with the preview switch. It does not prevent directly generating, manually uploading, or publicly serving a preview, does not remove pre-existing public output, and does not itself validate deployment configuration. Preview pages may contain unreviewed claims and `noindex` is not an access-control boundary. Verify the actual release path and any existing output separately.

## Independent execution on macOS

- `npm run people:production-build:self-test`: passed.
- `PEOPLE_SITE_PREVIEW=1 npm run build`: exited 1 at the guard with the expected refusal, before later steps.
- `npm run build` with preview unset: the guard and its nested npm self-test passed, then the outer command stopped with `MODULE_NOT_FOUND` for the deliberately omitted `scripts/test-site-urls.mjs`. This demonstrates that the actual npm build supplied the expected environment and avoided recursive testing; it is **not** a successful production build.

Only a small staging-pinned script/library/schema fixture was used; it lacked the real later build scripts and corpus, so these commands could not execute a full build or mutate production output. These focused tests do not prove Windows execution, CI, Cloudflare configuration, deployment safety, or historical accuracy and are not release approval.
