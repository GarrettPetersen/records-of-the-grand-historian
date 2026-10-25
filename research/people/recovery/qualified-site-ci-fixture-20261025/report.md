# Production-build fixture correction

One-file, test-only artifact pinned to canonical base
`5d652c2cded7074ad5bfe3727cff639b1f07e1f1`. Frozen V2 is unchanged.

- Patch SHA-256: `863417ad12a360499fee8a6d6fc84d62b10f2c002a0687bccf64de5c241ee937`.
- Final `scripts/test-people-production-build.mjs` SHA-256:
  `8172082bd94b88cfc3d019a87e817485e2aa120aaba9a791a30cc1f1a83ba7cc`.
- The actual canonical production guard/npm/sentinel portion is byte-identical.
  Only the obsolete final fixture expectation changes.

The fixture now forces its exact identity-seal read to throw `ENOENT` with the
exact `.path`. Assertions require that exact error for environment preview,
explicit preview, and normal loading. It cannot activate an unsealed context or
accidentally accept an unrelated exception. Existing file/environment monkeypatch
restoration is retained. An existing real seal cannot be read or used to hash the
corpus: the exact-path interception throws before qualification reaches input hashing.
Positive certified preview coverage remains in the ordinary-compiler integration.

Validation used the canonical `package.json`, unchanged actual guard and sentinel
contract, with only this test's `people-site.mjs` import redirected to frozen V2.
`npm --prefix source run people:production-build:self-test` passed both without a
fixture seal and with an authored poison seal physically present. The poison would
fail parsing if read, so that second pass confirms exact interception. The 26 focused
V2 regressions also pass. Logs and exact patch application/preservation evidence are
under `evidence/`; the envelope hashes each.

Reproduction from the repository root (expand the two artifact paths):

```sh
PEOPLE_REPO_ROOT="$PWD/data/people/generated/code-drafts/qualified-site-production-test-fix-20261026/source" \
NODE_OPTIONS="--experimental-loader=$PWD/data/people/generated/code-drafts/qualified-site-production-test-fix-20261026/fixture-loader.mjs" \
npm --prefix data/people/generated/code-drafts/qualified-site-production-test-fix-20261026/source run people:production-build:self-test
```

No production behavior, canonical files, Git state, runtime or queue were changed.
No full local build was run. Both independent peers were given this sealed fix for
quick review. The host owns exact-file adoption against the current PR head CAS.
