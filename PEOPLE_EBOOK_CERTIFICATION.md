# Verified people glossaries for ebooks

An ebook can qualify its own complete chapter scope without waiting for unrelated
histories to finish. Qualification preserves the global canonical person IDs,
slugs and conservative identity decisions. It does not mark the global catalog
complete or enable website publication.

From the same authoritative checkout used for source and approvals:

```sh
npm run people:disk:check
npm run people:catalog
node scripts/generate-ebook.mjs --book jinshu --require-people-glossary
node scripts/validate-ebook.mjs --require-people-glossary dist/ebooks/jinshu/jinshu.epub
```

Use the actual product slug and chapter order from `ebooks/manifest.json`; a
full-book product must include every source chapter. A manifest-defined volume
qualifies only its explicit chapter scope. Qualification checks current extraction,
independent editorial decisions, independent date approvals and identity ambiguity
for that scope. A missing, stale or incomplete gate fails closed.

The ordinary catalog compiler writes an identity seal alongside the catalog
manifest. It pins current source, extraction, identity inputs and compiler code,
and the compiled catalog/index content. Rebuild the catalog after relevant changes;
do not manufacture a seal for an old generation. Digesting is incremental so the
catalog need not fit in one JavaScript string.

The ebook rebuilds person facts, aliases, chronology, relationships and excerpts
from its qualified chapter scope. A globally merged person's unsupported facts
from another history must not enter the ebook. Required generation and verification
check the actual source files and embedded certificate, regenerate glossary
content and verify person links. They reject a different source root or changed
source body before accepting the artifact. Keep `PEOPLE_REPO_ROOT`, when set,
consistent with the generator's checkout.

Passing the automated certificate checks does not replace visual/manual ebook QA
or external EPUB conformance validation. Synthetic integration fixtures establish
the code contract; they do not establish real Jinshu release readiness. Preview
output cannot satisfy required-glossary publication.
