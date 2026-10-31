# Conservative Chinese variant comparison data

This fixed Unicode 17.0.0 input supports **retaining English-name candidate comparisons** when Chinese identity-name spellings may be documented variants. It never supplies an alias, changes a source/name key or display string, or asserts that people are the same. The resolver and its identity constraints are unchanged.

The complete official `Unihan_Variants.txt` is retained for reproducible offline generation. Only that archive entry was extracted; the ZIP and other Unihan files are not vendored. The full Unicode License V3 accompanies the data and permits redistribution subject to retaining its notice. Exact download URLs, byte counts and SHA-256 hashes are in `provenance.json`.

The generator uses these UAX #38 revision 39 properties:

- `kSimplifiedVariant` and `kTraditionalVariant`: character conversion variants, including ambiguous one-to-many relations.
- `kSemanticVariant`: semantic variants.
- `kSpecializedSemanticVariant`: context-limited semantic variants. Retaining an extra comparison is conservative even when a relation applies outside a particular personal name.
- `kZVariant`: documented glyph/encoding variants.

`kSpoofingVariant` is excluded: visual confusability alone is not a documented semantic or glyph variant relation. Existing name normalization already uses NFKC; the generator applies the same NFKC to relation endpoints before calculating undirected, transitive classes. These classes express **possible equivalence only**, including intentional false-positive comparisons from ambiguous relations. For example, the resulting class containing 陸 also contains 六. It cannot merge their records.

The derived map is used only inside the disjoint-Chinese guard for a shared English identity form. English support is checked on each actual member's shared English key. A preferred-only/unsupported English member or a member lacking specific Chinese identity evidence retains comparisons with every partition. Multiple Chinese aliases can bridge partitions without making unrelated endpoints comparable. No title-kind, weak-name or direct Chinese blocking rule is changed.

Regenerate or verify offline from the repository root:

```sh
node scripts/generate-people-chinese-variants.mjs
node scripts/generate-people-chinese-variants.mjs --check
node scripts/test-people-resolution.mjs
```

The generator fails on a different raw-data hash; upgrading Unicode requires an explicit data/provenance change and review. Tests cover 韓壽/韩寿, 陸機/陆机, mixed script names, transitive documented classes, unknown third members, multiple aliases and distinct birth names. 王衍/王儼 and 黃帝/炎帝 remain distinguishable. These checks do not claim an exhaustive historical orthographic dictionary.

Primary documentation: [fixed release ReadMe](https://www.unicode.org/Public/17.0.0/ucd/ReadMe.txt), [UAX #38 revision 39](https://www.unicode.org/reports/tr38/tr38-39.html), [Unicode License V3](https://www.unicode.org/license.txt).
