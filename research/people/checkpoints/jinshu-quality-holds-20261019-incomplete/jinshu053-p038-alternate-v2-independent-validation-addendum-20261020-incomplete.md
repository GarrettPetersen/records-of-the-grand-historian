# Jinshu 053 alternate v2: independent scoped validation addendum

**Research only.** This supplements the independently authored exact-delta
review; it is neither publication nor whole-chapter approval. No generator was
executed, and no candidate, canonical file, queue, lock or index was changed.

The actual v2 bytes checked were: source SHA-256
`a1fe01f4178470c5328f84ce651327df84042f11165cd45587bd16e5ce700d7d`, extraction
`e535984fa43b609bcbce77e346f53327d850061e09c82db63674b63e316c2bf1`, and
editorial history `da4433a63b8da668e271c27d9ab9714e00c22a155a7c6397ba2234c129291be7`.
All were checked immediately before invoking the code.

The existing `/tmp/jinshu053-strict-5ce.NuGR9k1r` fixture's packet builder,
extraction validator and applied-history validator have matching Git blob IDs
with staging revision `729b0ab0d4f84781b168cba48f4c0d4d5ea0c08c`. Their
respective SHA-256 hashes are
`6561e28aed4a472fb6bba80b84728b395b3254f893a4b9b42c8939ecff195245`,
`33b59627388be1735eae3a05fb0b36b4580eb8b2c4924b063f2f7ad66e1af2c6`, and
`8c61394d8376d4c13263341f2a054a55bd67ed227da63f11a822050cfc1f0af6`.
A recursive regex scan of static relative imports and literal relative dynamic
imports from those three modules found 12 fixture modules, all byte-equivalent
to staging Git blobs, with no missing relative modules. A broader check of
tracked fixture scripts and schemas found 554 matching and 15 differing files;
none of those 15 appeared in that limited relative-import graph. That scan
does not prove the provenance of nonliteral imports, runtime filesystem inputs,
or dependencies under the fixture's symlink to the shared `node_modules`.

I called `buildPeopleExtractionPacket` on the exact candidate source, then
`validatePeopleExtraction(candidate, packet, {strictAliasDispositions:true})`
and `validateAppliedEditorialDecisions(history, normalized)` in a read-only
Node process. Exact output:

```json
{
  "sourceSha256": "a1fe01f4178470c5328f84ce651327df84042f11165cd45587bd16e5ce700d7d",
  "extractionSha256": "e535984fa43b609bcbce77e346f53327d850061e09c82db63674b63e316c2bf1",
  "editorialHistorySha256": "da4433a63b8da668e271c27d9ab9714e00c22a155a7c6397ba2234c129291be7",
  "packetFingerprint": "sha256:ff9a510d9110982e5a0fbd25ef15709067b33a52ae787c11c8b4b13a71594c88",
  "stats": {
    "units": 209,
    "candidates": 364,
    "people": 71,
    "mentions": 492,
    "claims": 538,
    "repairs": 114,
    "dispositions": 145,
    "aliasDispositionConflicts": 0
  },
  "editorialResult": { "errors": [] },
  "status": "PASS"
}
```

This is a structural scoped check, not evidence that inherited historical
claims or approvals are correct. The original review's source attribution,
editorial, chronology, identity, publication and ebook holds remain unchanged.
