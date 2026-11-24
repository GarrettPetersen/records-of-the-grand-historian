import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { DATA_DIR } from './people-content.mjs';
import { loadProperNounMatcher } from './people-candidates.mjs';
import { visitValidatedPeopleCorpus } from './people-corpus.mjs';
import { loadValidatedPeopleChapter } from './people-validated-chapter.mjs';

const fileHash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');

export function loadPinnedPeopleChapter(pin, properNounMatcher) {
  const key = `${pin.book}:${pin.chapter}`;
  const matches = () => fileHash(pin.file) === pin.extractionHash && fileHash(pin.source) === pin.sourceHash;
  if (!matches()) throw new Error(`Validated chapter inputs changed: ${key}`);
  // Match visitValidatedPeopleCorpus: global alias debt is reported separately;
  // focused chapter validation and publication retain their existing strict gates.
  const value = loadValidatedPeopleChapter(pin.book, pin.chapter, { properNounMatcher, strictAliasDispositions: false });
  if (!matches()) throw new Error(`Validated chapter inputs changed while reading: ${key}`);
  return value;
}

// Catalog-only read-through access does not change dossier-registry construction.
export function loadValidatedPeopleCorpusOnDemand() {
  const pins = new Map(), matcher = loadProperNounMatcher();
  return createPeopleCorpusReader(consume => visitValidatedPeopleCorpus(value => {
    const { extraction, file } = value, source = path.join(DATA_DIR, extraction.book, `${extraction.chapter}.json`);
    pins.set(`${extraction.book}:${extraction.chapter}`, { book: extraction.book, chapter: extraction.chapter,
      file, source, extractionHash: fileHash(file), sourceHash: fileHash(source) });
    consume(value);
  }), key => {
    const pin = pins.get(key);
    if (!pin) throw new Error(`Missing validated chapter pin: ${key}`);
    return loadPinnedPeopleChapter(pin, matcher);
  });
}

// Keep only validated identities and chapter metadata resident. The bounded
// loader must revalidate the original chapter files, never a partial projection.
export function createPeopleCorpusReader(visitChapters, loadChapter, { cacheSize = 4 } = {}) {
  if (!Number.isInteger(cacheSize) || cacheSize < 1) throw new Error('Positive chapter cache size required');
  const chapters = [], locations = new Map(), constraints = new Map(), promptVersionCounts = new Map(), cache = new Map();
  let chapterLoads = 0;
  const load = key => {
    if (cache.has(key)) { const value = cache.get(key); cache.delete(key); cache.set(key, value); return value; }
    const value = loadChapter(key);
    if (!(value?.localPeople instanceof Map) || `${value.extraction?.book}:${value.extraction?.chapter}` !== key) throw new Error(`Wrong validated chapter ${key}`);
    const expected = chaptersByKey.get(key).ids;
    if (value.localPeople.size !== expected.length || expected.some(id => !value.localPeople.has(id))) throw new Error(`Changed validated chapter people ${key}`);
    cache.set(key, value);
    chapterLoads++;
    if (cache.size > cacheSize) cache.delete(cache.keys().next().value);
    return value;
  };
  const chaptersByKey = new Map();
  const { coverage } = visitChapters(({ file, extraction, localPeople }) => {
    const { book, chapter, run } = extraction, key = `${book}:${chapter}`;
    if (chaptersByKey.has(key)) throw new Error(`Duplicate validated chapter ${key}`);
    const ids = [...localPeople.keys()];
    chaptersByKey.set(key, { ids });
    for (const [id, person] of localPeople) {
      if (id !== person.localId || locations.has(id)) throw new Error(`Duplicate or invalid validated person ${id}`);
      locations.set(id, key);
      constraints.set(id, { localId: id, claims: person.claims.filter(claim => ['same-person', 'different-person'].includes(claim.predicate)) });
      promptVersionCounts.set(person.promptVersion, (promptVersionCounts.get(person.promptVersion) ?? 0) + 1);
    }
    // These are the only extraction fields consumed by catalog/proof assessment.
    // Run provenance stays exact; mentions and repairs come from full validation.
    chapters.push({ file, extraction: { book, chapter, run,
      get mentions() { return load(key).extraction.mentions; },
      get translationRepairs() { return load(key).extraction.translationRepairs; },
    } });
  });
  const localPeople = {
    get size() { return locations.size; },
    has(id) { return locations.has(id); },
    get(id) { const key = locations.get(id); return key === undefined ? undefined : load(key).localPeople.get(id); },
    keys() { return locations.keys(); },
    *values() { for (const id of locations.keys()) yield this.get(id); },
    *entries() { for (const id of locations.keys()) yield [id, this.get(id)]; },
    [Symbol.iterator]() { return this.entries(); },
  };
  return { chapters, localPeople, coverage, identityConstraints: constraints, promptVersionCounts,
    metrics: { get chapterLoads() { return chapterLoads; } } };
}
