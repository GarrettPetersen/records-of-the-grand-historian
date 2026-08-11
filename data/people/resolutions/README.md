# Person identity resolutions

Tracked JSON shards in this directory record reviewed cross-chapter identity
decisions. Chapter extraction files remain immutable evidence; these shards say
which chapter-local records represent the same individual.

Each file validates against `data/people/schema/resolution.schema.json`:

```json
{
  "schemaVersion": 1,
  "batch": "hanshu-emperor-wu-001",
  "decisions": [
    {
      "decision": "merge",
      "canonicalPersonId": "per_0123456789ABCDEFGHJK",
      "localPeople": ["hanshu:006:p002", "hanshu:008:p002"],
      "basis": ["same-Chinese-name", "compatible-dates", "same-polity"],
      "confidence": "high",
      "notes": []
    }
  ]
}
```

Use `merge` only when the evidence establishes one person. Use `keep-separate`
for homonyms or reused titles, and `possible-same-as` when the evidence remains
insufficient. A false merge is worse than a temporary duplicate.

Run `npm run people:resolution-candidates` to rebuild the ignored resolver
dossier and `npm run people:catalog` to compile the current canonical catalog.
`npm run people:catalog -- --require-resolved` is the publication gate: it fails
while any chapter still needs the current source pass or any name block lacks a
merge/separation decision.
