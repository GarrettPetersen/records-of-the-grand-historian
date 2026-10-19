import assert from 'node:assert/strict';
import { compilePeopleCatalog } from './compile-people-catalog.mjs';
import { slicePeopleCorpusEvidence } from './lib/people-evidence-slice.mjs';

// Synthetic inputs only: these fixtures are neither a review nor authorization
// to publish. Exercise the real catalog compiler after slicing local inputs.
function chapter(chapterNumber, secret) {
  const scope = `fixture:${chapterNumber}`;
  const id = `${scope}:p001`;
  const evidence = [`${scope}:s0001`];
  const person = {
    localId: id,
    preferredNameSuggestion: { en: 'Fan Ye', zh: '范曄', pinyin: 'Fan Ye' },
    historicity: 'historical', descriptorSuggestion: secret ? 'Hidden Historian' : 'Official',
    identityHints: { nativePlaces: [], relatedLocalPeople: [], activeDateHints: ['AD 1'], polityHints: [] },
  };
  const claims = [
    { id: `${scope}:c0001`, subject: id, predicate: 'name', value: { kind: 'personal', en: 'Fan Ye', zh: '范曄' }, certainty: 'explicit', evidence },
    { id: `${scope}:c0002`, subject: id, predicate: 'role', value: { roleId: 'official' }, certainty: 'explicit', evidence },
    { id: `${scope}:c0003`, subject: id, predicate: 'attestation', value: { sourceDate: { text: secret ? 'Hidden Date' : 'first year' }, westernYear: { era: 'AD', year: 1, precision: 'year' } }, certainty: 'explicit', evidence },
    ...(secret ? [{ id: `${scope}:c0004`, subject: id, predicate: 'name', value: { kind: 'alternate-name', en: 'Hidden Alias' }, certainty: 'explicit', evidence }] : []),
  ];
  const mentions = [{ id: `${scope}:m0001`, person: id,
    unit: { id: 's0001', kind: 'paragraph-sentence', blockIndex: 0, collection: 'sentences', itemIndex: 0 },
    kind: 'personal-name', spans: { zh: [{ exact: '范曄', occurrence: 1 }], en: [{ exact: 'Fan Ye', occurrence: 1 }] }, candidateRefs: [] }];
  return { extraction: { book: 'fixture', chapter: chapterNumber, run: { promptVersion: 7 }, people: [person], claims, mentions, translationRepairs: [] } };
}

const chapters = [chapter('001', false), chapter('002', true), chapter('003', false)];
const localPeople = new Map(chapters.map(({ extraction }) => {
  const person = extraction.people[0];
  return [person.localId, { ...person, book: extraction.book, chapter: extraction.chapter,
    promptVersion: 7, claims: extraction.claims, mentions: extraction.mentions }];
}));
const corpus = { chapters, localPeople, coverage: { sourceChapters: 4, extractedChapters: 3, missingChapterIds: ['fixture:004'] } };
const resolution = [{ schemaVersion: 1, batch: 'fixture', decisions: [
  { decision: 'merge', localPeople: ['fixture:001:p001', 'fixture:002:p001'], basis: ['synthetic'], confidence: 'high' },
  { decision: 'merge', localPeople: ['fixture:002:p001', 'fixture:003:p001'], basis: ['synthetic'], confidence: 'high' },
] }];
const mixed = compilePeopleCatalog(corpus, resolution).catalog;
assert.equal(mixed.people.length, 1);
assert.match(JSON.stringify(mixed.people[0]), /Hidden Alias/);

const before = JSON.stringify(chapters);
const slice = slicePeopleCorpusEvidence(corpus, ['fixture:001', 'fixture:003']);
assert.equal(JSON.stringify(chapters), before);
assert.deepEqual(slice.coverage, { sourceChapters: 4, extractedChapters: 2, missingChapterIds: ['fixture:002', 'fixture:004'] });
const compiledSlice = compilePeopleCatalog(slice);
const projected = compiledSlice.catalog;
assert.equal(projected.complete, false);
assert.equal(projected.people.length, 2, 'an excluded person cannot bridge the two included records');
assert.doesNotMatch(JSON.stringify(projected), /Hidden Alias|Hidden Historian|Hidden Date|fixture:002:/);
assert.deepEqual(Object.keys(compiledSlice.siteIndex.chapters).sort(), ['fixture:001', 'fixture:003']);
assert.doesNotMatch(JSON.stringify(compiledSlice.siteIndex), /Hidden Alias|Hidden Historian|Hidden Date|fixture:002:/);
assert.equal(JSON.stringify(chapters), before, 'compilation must not mutate source chapter inputs');
slice.chapters[0].extraction.people[0].descriptorSuggestion = 'Modified';
assert.equal(chapters[0].extraction.people[0].descriptorSuggestion, 'Official');

const referenced = structuredClone(corpus);
referenced.chapters[0].extraction.claims[0].value.nested = [{ target: 'fixture:002:p001' }];
assert.throws(() => slicePeopleCorpusEvidence(referenced, ['fixture:001']), /outside the evidence slice/);
const hiddenHint = structuredClone(corpus);
hiddenHint.chapters[0].extraction.people[0].identityHints.relatedLocalPeople = ['fixture:002:p001'];
assert.throws(() => slicePeopleCorpusEvidence(hiddenHint, ['fixture:001']), /outside the evidence slice/);
const unknownReference = structuredClone(corpus);
unknownReference.chapters[0].extraction.claims[0].value.target = 'fixture:999:p001';
assert.throws(() => slicePeopleCorpusEvidence(unknownReference, ['fixture:001']), /outside the evidence slice/);
const foreignEvidence = structuredClone(corpus);
foreignEvidence.chapters[0].extraction.claims[0].evidence = ['fixture:002:s0001'];
assert.throws(() => slicePeopleCorpusEvidence(foreignEvidence, ['fixture:001']), /evidence outside its source chapter/);
const includedCrossReference = structuredClone(corpus);
includedCrossReference.chapters[0].extraction.claims[0].value.relatedPersonId = 'fixture:003:p001';
assert.doesNotThrow(() => slicePeopleCorpusEvidence(includedCrossReference, ['fixture:001', 'fixture:003']));
assert.throws(() => slicePeopleCorpusEvidence(corpus, ['fixture:004']), /not extracted/);
assert.throws(() => slicePeopleCorpusEvidence(corpus, ['fixture:001', 'fixture:001']), /unique valid/);
const badCoverage = structuredClone(corpus);
badCoverage.coverage.missingChapterIds = [];
assert.throws(() => slicePeopleCorpusEvidence(badCoverage, ['fixture:001']), /coverage is inconsistent/);
const duplicateChapter = structuredClone(corpus);
duplicateChapter.chapters.push(duplicateChapter.chapters[0]);
assert.throws(() => slicePeopleCorpusEvidence(duplicateChapter, ['fixture:001']), /duplicate extracted chapter/);
const duplicatePerson = structuredClone(corpus);
duplicatePerson.chapters[0].extraction.people.push(duplicatePerson.chapters[0].extraction.people[0]);
assert.throws(() => slicePeopleCorpusEvidence(duplicatePerson, ['fixture:001']), /duplicate person ID/);
const badSubject = structuredClone(corpus);
badSubject.chapters[0].extraction.claims[0].subject = 'fixture:003:p001';
assert.throws(() => slicePeopleCorpusEvidence(badSubject, ['fixture:001', 'fixture:003']), /Invalid claim subject/);
const contaminatedMap = structuredClone(corpus);
contaminatedMap.localPeople.get('fixture:001:p001').descriptorSuggestion = 'Hidden map content';
assert.equal(slicePeopleCorpusEvidence(contaminatedMap, ['fixture:001']).localPeople.get('fixture:001:p001').descriptorSuggestion, 'Official');
console.log('PASS: evidence slice isolates selected local records before canonical aggregation');
