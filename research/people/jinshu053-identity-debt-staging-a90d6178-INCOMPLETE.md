# Jinshu 053 identity debt: pinned research, not closure

Read-only inspection against staged Git commit
`a90d6178d99cf62575964d129727dcd149ec647d` and the then-latest retained
noncanonical `jinshu053-opening-s0204-refined-v1-incomplete-20261020` draft.
No live graph refresh, lock, claim, production mutation, full build, or
historical identity determination was made. The draft is still under editorial
and chronology review; it is not approved for publication.

## Fingerprints and scope

- Staged chapter `data/jinshu/053.json` byte SHA-256
  `85bc5ea59ed954d7a8543981b3d2c778802e08bf6505ea2c79dcaedc98af4407`.
- Staged 053 compact extraction byte SHA-256
  `464b3ed3765bb67971793b7fb03fa3aaa50d78c8302d320521e408dba94d1e69`.
- Retained draft source byte SHA-256
  `c8d769853ce0e58cf35aab43b923d7cb1f53ee055983587c6555c7206b7e12cc`;
  draft candidate byte SHA-256
  `692ac0c8d26710f72309d25d3b8e40a3e4098c1f6658d9aa3b17e6c480f3b980`.
- Dossier `deadline-resolution-4af83725d42a6546` manifest byte SHA-256
  `6f6cb0539eab05da7ac39f445e63cfd5ebcf44df297ef2ca67d7e53b8405b964`;
  shard 006 byte SHA-256
  `980c6eeecf9b5fd7db2961385a2d3af053c6a287087619a9259b78704d2c6511`.
  The manifest fingerprints the staged 053 chapter and extraction shown above,
  not this draft. It targets other chapters; 053 appears as collateral context.

All 245 resolution files listed in the dossier manifest byte-match the staged
files; one additional staged resolution file,
`deadline-resolution-84222f9eedb101e5.json`, was not in the manifest. It does
not reference the p037 canonical group or any of the 18 p037 pair sides listed
below. This check did **not** validate every other dossier dependency or rerun
current resolver logic. The ignored October 6 candidate graph is older and is
not proof of current remaining pairs.

## Specific retained comparisons

The shard's group `per_E5EB4BCMGK9X0W7RB5T4` comprises
`jinshu:053:p037` and `weishu:091:p119`: both dossier entries name Wang Yan
王衍. In block `block_VJ1Q9QR8BVX44AY2` (shared English `wang yan`), that
group appears in **18 historical `reviewPairs`** against these canonical
groups, each represented in the dossier by the local person shown:

`jiuwudaishi:013:p118`, `jiuwudaishi:032:p058`, `jiuwudaishi:076:p168`,
`jiuwudaishi:084:p169`, `jiuwudaishi:084:p214`, `jiuwudaishi:090:p054`,
`jiuwudaishi:110:p120`, `jiuwudaishi:110:p142`, `jiuwudaishi:112:p122`,
`jiuwudaishi:114:p121`, `jiuwudaishi:114:p180`, `jiuwudaishi:131:p040`,
`nanshi:043:p079`, `nanshi:043:p109`, `songshi:024:p212`,
`xinwudaishi:054:p091`, `xinwudaishi:063:p108`, `xinwudaishi:063:p139`.

The entire block has 73 current groups and 2,375 historical review pairs;
these numbers are not the number of 053-specific pairs. Most listed records
have different Chinese spellings and/or reported periods, but dossier date
hints are not themselves independently approved historical evidence. Apply
current candidate pruning and check primary sources before deciding any pair.
None of the 18 is established to be still open for today's final extraction.

The old compact p037 name and hints match the current draft in the fields
inspected apart from adding an empty `e` hint property; this does not make the
whole changed extraction, dossier, reviewer coverage, or graph current.

## Retained decisions and changed people

At this staged commit, 80 resolution files contain 595 decision records
mentioning 45 distinct 053 local people: 542 `keep-separate`, 33 `merge`, and
20 `possible-same-as`. These are decision-record counts, **not** independent
pair counts or automatic stale/invalid determinations. Group decisions and
duplicates make raw counts misleading.

For example, a staged 3-person merge of `jinshu:053:p054` (Sima Lun 司馬倫),
`jinshu:041:p112`, and `jinshu:127:p051` appears in
`data/people/resolutions/deadline-resolution-33a8a25268586edf.json`. The draft
changes p054's title claim from the inverted `Prince Zhao of Lun` to `Lun,
Prince of Zhao`; it does not change his displayed personal name. A retained
separation of p037 and `jiuwudaishi:031:p016` is recorded in
`cohort-2026-08-27-01.json`, citing different eras and polities. These decisions
are useful recoverable historical evidence, not fresh approval of the draft;
their underlying sources, date support, and current canonical grouping must be
checked. Do not delete or blindly reapprove all 595.

Another draft identity change is p051 `Sima Tong` → `Sima Rong` for 司馬肜,
with changed name-claim certainty and wording. No staged resolution decision
directly mentioning p051 was found in the 80 matching files. The corrected
reading and affected aliases need independent source review and a fresh
candidate search; lack of a prior p051 decision does not mean no comparison
debt. The extraction fingerprint changed as a whole even for untouched people.

## Practical next step

Continue bounded, independently reviewed source research in the shared
checkout using the 18 historical pair references as leads, and preserve the
retained decisions and their reasoning. Do not put the old dossier on a worker
as though current. Once the final 053 source and extraction are independently
reviewed and frozen, the host should verify ownership and exact hashes, use the
supported resolver freshness/invalidation workflow, and prepare a **fresh**
053-scoped dossier against the current corpus and current resolutions. Require
independent decisions only on its actual remaining `reviewPairs`, including
new p051/p054 candidates; check inherited decisions against exact new evidence
and preserve old records until safely reconciled. Full refreshed global
identity/candidate verification and production publication remain necessary;
because free disk was 12 GiB, do not launch a global build or new checkout for
this research. No 053 identity-clean claim follows from these historical counts.
