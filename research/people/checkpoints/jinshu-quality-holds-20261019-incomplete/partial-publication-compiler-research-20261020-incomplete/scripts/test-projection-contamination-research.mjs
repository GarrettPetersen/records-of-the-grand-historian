// Research demonstration, not a publication gate or historical source review.
import assert from 'node:assert/strict';
import { compilePeopleCatalog } from './compile-people-catalog.mjs';

const person = (chapter, descriptor, extraName) => {
  const id = `fixture:${chapter}:p001`, evidence = [`fixture:${chapter}:s0001`];
  return {
    localId: id, book: 'fixture', chapter, promptVersion: 7,
    preferredNameSuggestion: { en: 'Fan Ye', zh: '范曄', pinyin: 'Fan Ye' },
    historicity: 'historical', descriptorSuggestion: descriptor,
    identityHints: { nativePlaces: [], relatedLocalPeople: [], activeDateHints: ['AD 1'], polityHints: [] },
    claims: [
      { id: `fixture:${chapter}:c0001`, subject: id, predicate: 'name', value: { kind: 'personal', en: 'Fan Ye', zh: '范曄' }, certainty: 'explicit', evidence },
      { id: `fixture:${chapter}:c0002`, subject: id, predicate: 'role', value: { roleId: 'official' }, certainty: 'explicit', evidence },
      { id: `fixture:${chapter}:c0003`, subject: id, predicate: 'attestation', value: { sourceDate: { text: 'first year' }, westernYear: { era: 'AD', year: 1, precision: 'year' } }, certainty: 'explicit', evidence },
      ...(extraName ? [{ id: `fixture:${chapter}:c0004`, subject: id, predicate: 'name', value: { kind: 'alternate-name', en: extraName }, certainty: 'explicit', evidence }] : []),
    ],
    mentions: [{ id: `fixture:${chapter}:m0001`, person: id, unit: { id: 's0001', kind: 'paragraph-sentence', blockIndex: 0, collection: 'sentences', itemIndex: 0 }, kind: 'personal-name', spans: { zh: [{ exact: '范曄' }], en: [{ exact: 'Fan Ye' }] }, candidateRefs: [] }],
  };
};
const first = person('001', 'Official', null);
const second = person('002', 'Historian and compiler of the Book of Later Han', 'Unreviewed Alias');
const extraction = chapter => ({ book: 'fixture', chapter, run: { promptVersion: 7 }, mentions: [], translationRepairs: [] });
const corpus = { chapters: ['001', '002'].map(chapter => ({ extraction: extraction(chapter) })),
  localPeople: new Map([[first.localId, first], [second.localId, second]]),
  coverage: { sourceChapters: 2, extractedChapters: 2, missingChapterIds: [] } };
const resolution = [{ schemaVersion: 1, batch: 'fixture', decisions: [{ decision: 'merge', localPeople: [first.localId, second.localId], basis: ['synthetic fixture'], confidence: 'high' }] }];
const { catalog } = compilePeopleCatalog(corpus, resolution);
const merged = catalog.people.find(p => p.localPeople.includes(first.localId));
assert.ok(merged.localPeople.includes(second.localId));
assert.ok(merged.names.some(n => n.en === 'Unreviewed Alias' && n.claimRefs.includes('fixture:002:c0004')));
assert.ok(merged.references.some(r => r.chapter === '002'));
assert.match(merged.description.en, /Historian/);
assert.ok(merged.description.claimRefs.every(ref => /:c0002$/.test(ref)));
assert.ok(merged.life.attestedActivity.some(c => c.claimRefs.includes('fixture:002:c0003')));
// No approved chapter is created here: this proves that selecting the whole
// canonical person just because 001 is eligible would leak 002's content.
const naiveSelectedPerson = catalog.people.filter(p => p.localPeople.includes(first.localId))[0];
assert.equal(naiveSelectedPerson, merged);
console.log('PASS: full-catalog person selection retains an unrelated chapter alias, description, dates, and backlinks');
