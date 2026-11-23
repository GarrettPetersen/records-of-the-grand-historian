# Jinshu 115 independent native identity review (PR #5483)

**Inputs:** CI run `45289597546`, artifact `jinshu-115-native-identity-evidence` (`14874351563`), overlay `1fb25e99e2fc07ba0ee8fbd89369d44c482c4326`.

**Unchanged:** Native chronology evidence `5118131b4…` (496 items); editorial approvals.

## Artifacts

| File | Role |
|------|------|
| `artifact-hash-manifest.json` | Sealed receipt/part hash crosswalk + aggregate report pin |
| `native-part-report-{001..011}.json` | Closed-schema part reports (11 transport parts, 229 cases) |
| `native-identity-report.json` | Assembled report (no chapter record / no self-approval) |
| `identity-residual-blockers.json` | **7** witness holds (abbreviated or rhetorical Chinese) |
| `run-native-identity-review.mjs` | Reproduces review from `JINHSU115_IDENTITY_ARTIFACT` |

## Outcome

- **222 / 229** cases `approve` with pinned target + anchor Chinese witnesses; **193** retain `unresolvedIdentity: true` (overflow / candidates).
- **7** cases `hold` — primary name witness cannot be pinned without inventing equivalence (e.g. `p030` 齊桓公 vs `桓文`; `p227–p230` abbreviated s0325 權薛 / 鄧·張).
- No new canonical merges or splits; `grantsNewMerges: false`.

Download artifact: `gh run download 45289597546 -R GarrettPetersen/records-of-the-grand-historian -n jinshu-115-native-identity-evidence -D /tmp/jinshu115-native-identity`