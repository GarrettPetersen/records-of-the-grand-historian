# Independent review: Jinshu 123 (PR #5439)

**Status:** `needs-revision` — chapter **not** approved.  
**Candidate revision:** `8083686dee7d69302e06e3e920224dc24e2d967e`  
**Reviewer agent:** `bc-985e5c79-a8bc-4040-8f8d-4f1fba0f38b2`  
**Lookup generation:** `cb756c508e0265caad63cdac5c50b49c06d4ca2d2d19bb6e1ef9bde48db40aac` (manifest matched)

This directory is an independent reviewer consolidation for the original owner (`cursor-github-nov24-1` / `bc-64160cca-fb61-4c6e-ba29-27cd0fc0ada1`). Native schema3 editorial accepts are also recorded at `data/people/editorial-decisions/jinshu/123.json`. This is **not** a date-audit approval, identity seal, or publication receipt.

## Verdict

| Gate | Result |
|------|--------|
| 45 proposed English repairs vs Chinese / paired fields | **Accepted** (native schema3); includes false-death s0148 and reversed-battle s0205 |
| Claim sync tied to repairs | **Accepted** 4 revisions (Liuxia Hui, Kuruguan Wei, 建節 office, 請降 event) |
| Residual paired literals s0093 / s0240 | Still defective; not in proposal set |
| Chronology | **Blocked** — prior audit stale; residual date-packet hashes unverified |
| Canonical identity | **Blocked** — extensive false splits; unsupported p120 Murong Ke |
| Scoped extraction validator | OK (`repairs=45`) |
| Scoped `people:validate` | OK with this editorial document |

## Owner must fix before re-review (one batch)

1. Apply the 45 accepts + 4 claim revisions through native editorial apply tooling.
2. Add literal repairs for s0093 and s0240; get accepts only for those new proposals.
3. Merge within-chapter duplicate clusters (Murong Chui / Fu Jian / Bao / De / …).
4. Hold or evidence p120 (太原王); remove unsupported Murong Ke name + p111 parent claim until supported.
5. Fresh `people:dates:packet` + independent date audit; preserve original stale report.
6. Bounded identity certification after merges on the same pinned lookup generation.

See `consolidation.json` for repair-by-repair dispositions, lookup bounds, and exact blockers.
