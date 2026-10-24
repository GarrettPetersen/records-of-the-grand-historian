# Jinshu 053 p038 repair v1: independent, limited delta review

**Research-only review; not approval to publish, an editorial decision, or an
identity/date audit.** I did not author the candidate or its generator. I
compared its parsed JSON with its manifest-pinned predecessor, read the Chinese
of 053 s0034–s0036, s0065, s0073–s0074, s0177 and the separately held 096
s0098–s0099 and s0101, and inspected the retained name surfaces and family
claims. The previous source review was available to me, so this is independent
authorship of the delta review, not a blind assessment.

## Pinned bytes

All hashes below are SHA-256 of actual file bytes, not chapter or packet
fingerprints. All inputs matched the v1 manifest when checked.

| Artifact | SHA-256 |
| --- | --- |
| `jinshu053-middle-supported-v1-incomplete-20261020/candidate.json` | `c949bca3448d5603596f16cb318228653f43ef4ca5f9fa7731a799da3804ba9b` |
| v1 `candidate.json` | `ac482159e165f669fcbefd5aaee74cad5606485dbde8f73f9c68201860fe8545` |
| predecessor and v1 `source.json` | `d7a16811f2ded3f7ec283eaf09219048fc9971f34f1813bc79acf9b71f20939a` |
| predecessor and v1 `editorial-history.json` | `201f44fefe758038e144c1570794c39d6a71f7779eb2b65d0155bce9bd4699b9` |
| v1 `manifest.json` | `2203c3d13b0451a33b199f9894a22652082a84bec61f61a8f379c1ab421e83fd` |
| `data/jinshu/096.json` | `be8370803176c863317a6ec0bf918bea32f05c0c0f31168f6c5978c9bac60be2` |

The only semantic differences in the candidate JSON are the p038 names and
consort evidence, and the two p038 spouse/child claims enumerated below. All
surfaces, other people and claims, date-bearing rows, repair records,
dispositions and coverage are unchanged. This is not an approval of inherited
content. I did not rerun the pinned-staging validator for this candidate. Its
manifest reports a prior strict pass; that prior report is not a fresh test or a
current-checkout compatibility pass.

## Judgment on the exact changed fields

1. **Surname/title corrections: supported in principle.** S0065 has
   太子妃王氏 and s0177 has 妃王氏 and 太孫太妃. Replacing the purported
   full bilingual personal name `Wang Huifeng` / `王氏` with a Wang/王 surname
   avoids claiming 惠風 was present in those units; aligning the normalized
   title with the retained English surface `Taifei of the Grandson-Heir` is
   defensible. The latter is a rendering, not an exact English quotation from
   the Chinese. Limiting explicit consort evidence to s0065 is appropriate;
   s0035 describes a betrothal, not the realized consort status by itself.
2. **Spousal and child qualifier changes: supported in principle.** S0073
   says the consort's father Wang Yan petitioned for divorce, not that it was
   granted. Removing `relationshipState: divorced` is warranted. S0065 and
   s0073 identify a consort and her father, and 096 s0099–s0101 provides strong
   contextual corroboration for the p038 link, but the reviewer must retain
   that attribution and identity inference rather than treating the 053 title
   as a verbatim full name. S0035 says Wang Yan's younger daughter; removing a
   separately asserted biological-parentage qualifier is conservative and
   does not deny the relationship.
3. **Huifeng categorical representation: unresolved; candidate not ready for
   integration.** 053 s0035 supplies 惠風; 096 s0099 calls 惠風 a courtesy
   name. Removing the misclassified `personal-name` claim avoids calling it an
   explicitly stated given name in 053, but v1 removes the only structured
   Huifeng name claim while retaining both s0035 surfaces as `personal-name`.
   The preferred label and occurrence remain, but they do not establish a
   source-backed courtesy-name claim. That leftover classification requires a
   schema-aware review: determine whether `personal-name` on a mention means
   a generic person-name surface or a specifically given/personal name in the
   display and resolver, and use a truthful representation with attributable
   evidence. Do not mark 096 s0099 as a 053-local evidence unit or fabricate an
   explicit local 053 courtesy-name statement. A citation-preserving
   cross-chapter curation path may be necessary; do not silently drop the
   occurrence or assert the desired schema outcome without testing it.

## Remaining material holds

- An inherited p039-to-p038 sibling claim still asserts `sharedParentage:
  full`. S0035–s0036 identify Wang Yan's younger and elder daughters; that
  alone does not establish they share a mother. Review it and the accompanying
  kinship labels and certainty against the actual schema and any attributable
  additional evidence. Removing p038's `parentage` qualifier does not repair
  this separate assertion.
- The exact predecessor still contains the source-translation discrepancy in
  s0035 idiomatic (“forced”) and s0065's `heir guardian` wording. The seven
  v3 decisions and this p038 candidate belong to different predecessor chains;
  neither can be assumed incorporated into the other. Integrate and reconcile
  only via an owner-controlled sealed decision workflow on the selected final
  source; fresh fingerprints and independent validation are required.
- Preferred label provenance, claims for the letter recipient and s0177,
  s0035 date/hints, the research-blocked date audit, source variants,
  complete editorial coverage and actual reviewer provenance, cross-chapter
  identity, backlinks, catalog and ebook checks remain open. The 096 witness is
  useful evidence but is not itself an independent decision. Nothing here
  approves existing historic resolution decisions after extraction changes.

No canonical source, extraction, decision, queue, lock, lease, build, shared
Git index, or worktree was modified.
