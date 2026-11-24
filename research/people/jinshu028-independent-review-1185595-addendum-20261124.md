# Jinshu 028 — #5477 @ `1185595` (GrokBot authorship restore)

**Reviewer:** `bc-0dff1b5a-cee1-497c-a682-50af5e1e208b`  
**Change:** metadata-only `run.chunks[].agentId` → `grokbot-28` on all **12** chunk IDs.

## Verified

| Check | Result |
|-------|--------|
| Historical assignment (**PR #4698**, worker `grokbot-28`) | **12/12** chunk IDs and order ranges match `jinshu028-historical-grokbot-authorship-20261124.json` |
| Representation parity vs accepted **f581** audit | **863 / 887 / 403**; all item **values** identical; `sourceHash` unchanged |
| Content without `run` | **Identical** (`sha256:e878870c…` prior full = pre-restore packet) |
| Date audit | Re-validated **`audited`** on new native packet: `jinshu028-independent-date-audit-1185595-20261124.json` |

No manual hash substitution; no author or source edits reviewed beyond authorship metadata.