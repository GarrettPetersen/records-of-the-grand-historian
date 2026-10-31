import { chapterIdentityEvidenceScopes } from './people-chapter-identity.mjs';
import { loadValidatedPeopleChapter } from './people-validated-chapter.mjs';

// External chapters provide identity evidence only. Their alias-disposition
// diagnostics cannot change normalized identity keys or witnesses; only the
// target chapter must pass the full publication contract here.
export function loadCurrentIdentityEvidence(bundle, own, properNounMatcher, cache = new Map()) {
  const ownKey = `${own.extraction.book}:${own.extraction.chapter}`, sources = new Map([[ownKey, own]]);
  for (const scope of chapterIdentityEvidenceScopes(bundle)) {
    const key = `${scope.book}:${scope.chapter}`;
    if (key === ownKey) continue;
    if (!cache.has(key)) cache.set(key, loadValidatedPeopleChapter(scope.book, scope.chapter,
      { properNounMatcher, strictAliasDispositions: false }));
    sources.set(key, cache.get(key));
  }
  return sources;
}
