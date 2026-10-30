import test from 'node:test';
import os from 'node:os';
import { applyReviewedIdentityUncertainty } from './lib/people-chapter-identity.mjs';
import { fixtureIdentityCoverage } from './lib/people-identity-test-fixtures.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { compilePeopleCatalog, projectPeopleProduct, unresolvedCandidateState } from './compile-people-catalog.mjs';
import { stableCanonicalPersonId, resolvePeopleClusters } from './lib/people-resolution.mjs';
import { assertChapterGates, assertProductScope, assertScopedIdentity, assertEbookPeopleCertificate } from './lib/ebook-certified-people.mjs';
import { assertIdentitySeal, peopleDigest } from './lib/people-identity-seal.mjs';
import { buildEbookPeople, renderEbookPeopleIndex, renderEbookGlossaryShard, ebookPersonHref } from './lib/ebook-people-render.mjs';
import { verifyCertifiedEbookPeople } from './lib/ebook-certified-verification.mjs';
import { planEbookContentDocuments } from './lib/ebook-content-layout.mjs';
import { renderUnitWithPeople } from './lib/people-site.mjs';
import { editorialDecisionSeed, validateAppliedEditorialDecisions } from './lib/people-editorial-decisions.mjs';
import { buildPeopleExtractionPacket, buildPeopleExtractionSeed } from './build-people-extraction-packet.mjs';
import { validatePeopleExtraction } from './validate-people-extraction.mjs';
import { peopleCatalogIsPublishable } from './lib/people-publication.mjs';
import { REPO_ROOT, buildInputFingerprint, contentUnits } from './lib/people-content.mjs';
import { assertCertifiedEbookRoot, assertCertifiedEbookSources } from './lib/ebook-certified-source.mjs';

const audited = { status: 'audited', auditVersion: 1 };
const product = { slug: 'jinshu', book: 'jinshu', chapters: ['001', '002'] };
const manifest = { products: [product] };
const locator = { id: 's0001', kind: 'paragraph-sentence', blockIndex: 0, collection: 'sentences', itemIndex: 0 };
function member(book, chapter, en, zh) {
  const scope = `${book}:${chapter}`;
  const localId = `${scope}:p001`;
  return { localId, book, chapter, promptVersion: 7,
    preferredNameSuggestion: { en, zh, pinyin: en }, historicity: 'historical',
    descriptorSuggestion: 'Official of the Jin court',
    identityHints: { nativePlaces: [], relatedLocalPeople: [], activeDateHints: ['AD 300'], polityHints: [] },
    claims: [
      { id: `${scope}:c0001`, subject: localId, predicate: 'name', value: { kind: 'personal', en, zh, pinyin: en }, certainty: 'explicit', evidence: [`${scope}:s0001`] },
      { id: `${scope}:c0002`, subject: localId, predicate: 'role', value: { roleId: 'official' }, certainty: 'explicit', evidence: [`${scope}:s0001`] },
      { id: `${scope}:c0003`, subject: localId, predicate: 'attestation', value: { sourceDate: { text: 'first year' }, westernYear: { era: 'AD', year: 300, precision: 'year' } }, certainty: 'explicit', evidence: [`${scope}:s0001`] },
    ],
    mentions: [{ id: `${scope}:m0001`, person: localId, unit: locator, kind: 'personal-name', candidateRefs: [],
      spans: { zh: [{ exact: zh, occurrence: 0 }], en: [{ exact: en, occurrence: 0, startCodePoint: 0, endCodePoint: en.length }] } }] };
}
function fixture() {
  const a = member('jinshu', '001', 'Jin Father', '晉父');
  const b = member('jinshu', '002', 'Jin Son', '晉子');
  a.claims.push({ id: 'jinshu:001:c0004', subject: a.localId, predicate: 'family-relationship',
    value: { relation: 'parent-of', personId: b.localId }, certainty: 'explicit', evidence: ['jinshu:001:s0001'] });
  const outside = member('shiji', '001', 'Outside Alias', '外名');
  const aid = stableCanonicalPersonId(a.localId);
  const bid = stableCanonicalPersonId(b.localId);
  const globalCatalog = { identityReviewByChapter: {}, currentPromptVersion: 7, generatedAt: '2026-10-24T00:00:00.000Z', complete: false,
    localPersonMap: { [a.localId]: aid, [b.localId]: bid, [outside.localId]: aid },
    people: [{ id: aid, slug: 'global-stable-father', localPeople: [a.localId, outside.localId], retiredIds: [],
      preferredName: { en: 'Outside Alias', zh: '外名' }, description: { en: 'Outside Descriptor' },
      names: [{ en: 'Outside Alias' }], roles: [{ label: 'Outside Role' }],
      life: { birth: [{ value: { westernYear: { era: 'BC', year: 123 } } }] },
      familyRelationships: [{ value: { personId: 'outside-person', relation: 'spouse-of' } }] },
    { id: bid, slug: 'global-stable-son', localPeople: [b.localId], retiredIds: [] }] };
  const extraction = person => ({ book: person.book, chapter: person.chapter,
    run: { promptVersion: 7, agentId: 'extractor' }, translationRepairs: [],
    input: { chapterFingerprint: `sha256:${'a'.repeat(64)}` }, people: [person], claims: person.claims, mentions: person.mentions });
  const corpus = { localPeople: new Map([[a.localId, a], [b.localId, b]]),
    chapters: [a, b].map(person => ({ extraction: extraction(person) })) };
  const projected = projectPeopleProduct(corpus, globalCatalog, new Map([['official', 'Official']]), {}, () => audited);
  const identity = fixtureIdentityCoverage(corpus, globalCatalog, new Map([...corpus.localPeople, [outside.localId, outside]]));
  applyReviewedIdentityUncertainty(projected.catalog, identity.certificates);
  const context = { active: true, preview: false, ...projected,
    certificate: { schemaVersion: 1, kind: 'certified-ebook-people', scope: product, projection: peopleDigest(projected) },
    peopleById: new Map(projected.catalog.people.map(person => [person.id, person])) };
  const data = new Map([a, b].map(person => [person.chapter, { meta: { title: { en: `Chapter ${person.chapter}` } },
    content: [{ type: 'paragraph', sentences: [{ id: 's0001', zh: `${person.preferredNameSuggestion.zh}至。`,
      idiomatic: `${person.preferredNameSuggestion.en} arrived.` }] }] }]));
  context.certificate.gates = [...data].map(([chapter, source]) => {
    const input = buildInputFingerprint(contentUnits(source));
    return { chapter, source: peopleDigest(source), inputFingerprint: input.chapterFingerprint, inputUnitCount: input.unitCount };
  });
  return { a, b, aid, bid, outside, globalCatalog, corpus, context, data, extraction };
}

test('scoped projection retains global identities and URLs while excluding outside aliases, life, roles, description and family', () => {
  const { context, aid, bid } = fixture();
  assert.equal(context.catalog.complete, false);
  const father = context.peopleById.get(aid);
  assert.equal(father.slug, 'global-stable-father');
  assert.equal(father.preferredName.en, 'Jin Father');
  assert.equal(father.life.birth.length, 0);
  assert.deepEqual(father.roles.map(role => role.label), ['Official']);
  assert(!JSON.stringify(context).includes('Outside'));
  assert.deepEqual(father.familyRelationships.map(item => item.value.personId), [bid]);
  assert.equal(context.peopleById.get(bid).familyRelationships[0].value.relation, 'child-of');
  assert(context.peopleById.get(bid).familyRelationships[0].derivedInverse);
  assert(context.catalog.people.every(person => person.references.every(ref => ref.book === 'jinshu')));
  assert(buildEbookPeople(context, product).ready);
});

test('a compiled cross-book cluster can remain globally incomplete while its independently qualified book projects cleanly', () => {
  const f = fixture();
  const spouse = member('shiji', '002', 'Outside Spouse', '外妻');
  f.outside.descriptorSuggestion = 'Outside Descriptor';
  f.outside.claims.push(
    { id: 'shiji:001:c0004', subject: f.outside.localId, predicate: 'birth',
      value: { sourceDate: { text: 'an outside-book date' }, westernYear: { era: 'AD', year: 250, precision: 'year' } },
      certainty: 'explicit', evidence: ['shiji:001:s0001'] },
    { id: 'shiji:001:c0005', subject: f.outside.localId, predicate: 'family-relationship',
      value: { relation: 'spouse-of', personId: spouse.localId }, certainty: 'explicit', evidence: ['shiji:001:s0001'] });
  f.outside.claims.find(claim => claim.predicate === 'role').value.roleId = 'historian';
  const members = [f.a, f.b, f.outside, spouse];
  const globalCorpus = { localPeople: new Map(members.map(person => [person.localId, person])),
    chapters: members.map(person => ({ extraction: f.extraction(person) })),
    coverage: { sourceChapters: 5, extractedChapters: 4, missingChapterIds: ['hanshu:001'] } };
  const result = compilePeopleCatalog(globalCorpus, [{ authority: 'curated', batch: 'synthetic', decisions: [
    { decision: 'merge', localPeople: [f.a.localId, f.outside.localId] }] }], {},
  { getDateStatus: (book) => book === 'jinshu' ? audited : { status: 'un-audited', auditVersion: 1 } });
  assert.equal(peopleCatalogIsPublishable(result.catalog), false);
  const id = result.catalog.localPersonMap[f.a.localId];
  const global = result.catalog.people.find(person => person.id === id);
  assert(global.names.some(name => name.en === 'Outside Alias'));
  assert.equal(global.life.birth.length, 1);
  assert(global.roles.some(role => role.roleId === 'historian'));
  assert(global.familyRelationships.some(relation => relation.value.relation === 'spouse-of'));
  const identity = fixtureIdentityCoverage(f.corpus, result.catalog, globalCorpus.localPeople);
  assertScopedIdentity(f.corpus, identity.view, identity.certificates);
  const projected = projectPeopleProduct(f.corpus, result.catalog, new Map([['official', 'Official']]), {}, () => audited);
  const person = projected.catalog.people.find(person => person.id === id);
  assert.equal(person.life.birth.length, 0);
  assert(!person.names.some(name => name.en === 'Outside Alias'));
  assert(!person.roles.some(role => role.roleId === 'historian'));
  assert(!person.familyRelationships.some(relation => relation.value.relation === 'spouse-of'));
  assert.equal(peopleCatalogIsPublishable(result.catalog), false);
});

test('outside-only preferred overrides and unsupported family targets fail visibly', () => {
  const { corpus, globalCatalog, aid, a } = fixture();
  const roles = new Map([['official', 'Official']]);
  assert.throws(() => projectPeopleProduct(corpus, globalCatalog, roles,
    { [aid]: { preferredName: { en: 'Outside Alias' } } }, () => audited), /lacks scoped source support/);
  assert.throws(() => projectPeopleProduct(corpus, globalCatalog, roles,
    { [aid]: { preferredDescription: 'Outside Descriptor' } }, () => audited), /lacks scoped source support/);
  a.claims.find(claim => claim.predicate === 'family-relationship').value.personId = 'shiji:999:p001';
  assert.throws(() => projectPeopleProduct(corpus, globalCatalog, roles, {}, () => audited), /unresolved local person reference/);
});

test('complete-book and volume scope cannot be skipped, duplicated, reordered or forged', () => {
  assert.doesNotThrow(() => assertProductScope(product, manifest, ['001', '002']));
  for (const chapters of [['001'], ['002', '001'], ['001', '001'], ['001', '003']]) {
    assert.throws(() => assertProductScope({ ...product, chapters }, manifest, ['001', '002']));
  }
  assert.throws(() => assertProductScope(product, manifest, ['001', '002', '003']), /Whole-book/);
  const volume = { ...product, slug: 'jinshu-volume-1', chapters: ['001'] };
  assert.doesNotThrow(() => assertProductScope(volume, { products: [volume] }, ['001', '002']));
  assert.throws(() => assertProductScope({ ...volume, slug: 'jinshu' }, { products: [volume] }, ['001', '002']));
});

test('each local prompt, editorial and date gate fails independently', () => {
  const { a, extraction } = fixture();
  const value = extraction(a);
  assert.doesNotThrow(() => assertChapterGates(value, 7, audited, null));
  for (const version of [undefined, null, 0, 6, 8]) {
    assert.throws(() => assertChapterGates({ ...value, run: { promptVersion: version } }, 7, audited, null), /prompt/);
  }
  assert.throws(() => assertChapterGates({ ...value, translationRepairs: [{ status: 'proposed' }] }, 7, audited, null), /Pending/);
  assert.throws(() => assertChapterGates({ ...value, translationRepairs: [{ status: 'applied' }] }, 7, audited, null), /history/);
  for (const status of ['un-audited', 'stale', 'needs-revision', 'research-blocked']) {
    assert.throws(() => assertChapterGates(value, 7, { ...audited, status }, null), /date audit/);
  }
  assert.throws(() => assertChapterGates(value, 7, { ...audited, auditVersion: 2 }, null), /date audit/);
});

test('production extraction validator rejects stale source fingerprints before scoped qualification', () => {
  const source = { meta: { book: 'fixture', chapter: '001', title: { en: 'Weather', zh: '雨' } },
    content: [{ type: 'paragraph', sentences: [{ id: 's0001', zh: '雨。', idiomatic: 'It rained.' }] }] };
  const packet = buildPeopleExtractionPacket('fixture', '001', { chapterData: source });
  const extraction = buildPeopleExtractionSeed(packet, 'synthetic-offline-fixture');
  for (const key of Object.keys(extraction.coverage)) if (typeof extraction.coverage[key] === 'boolean') extraction.coverage[key] = true;
  assert.doesNotThrow(() => validatePeopleExtraction(extraction, packet, { strictAliasDispositions: true }));
  source.content[0].sentences[0].idiomatic = 'It rained heavily.';
  const fresh = buildPeopleExtractionPacket('fixture', '001', { chapterData: source });
  assert.throws(() => validatePeopleExtraction(extraction, fresh, { strictAliasDispositions: true }), /fingerprint|hash|stale/i);
});

test('independent applied-editorial history cannot be invalid, self-reviewed or apply a rejection', () => {
  const { a, extraction } = fixture();
  const pending = extraction(a);
  const repair = { id: 'jinshu:001:r0001', unit: locator, field: 'idiomatic', before: 'Jin Father arrived.',
    after: 'Jin Father came.', reason: 'A proposed word choice.', confidence: 'medium', status: 'proposed' };
  pending.translationRepairs = [repair];
  const review = editorialDecisionSeed(pending);
  review.reviewer = { kind: 'codex', name: 'Independent reviewer', model: null, agentId: 'reviewer', runId: null, completedAt: '2026-10-24T00:00:00Z' };
  review.decisions[0] = { repairId: repair.id, decision: 'accept', after: null,
    reason: 'Use the reviewed translation.', sourceWitness: { source: 'chapter-text', citation: 'jinshu:001:s0001', excerpt: null } };
  const applied = { ...pending, translationRepairs: [{ ...repair, status: 'applied', reason: review.decisions[0].reason }] };
  assert.doesNotThrow(() => assertChapterGates(applied, 7, audited, review));
  assert.throws(() => assertChapterGates(applied, 7, audited, { ...review, reviewer: { ...review.reviewer, agentId: 'extractor' } }), /cannot review its own/);
  assert.throws(() => assertChapterGates(applied, 7, audited, { ...review, decisions: [{ ...review.decisions[0], decision: 'reject' }] }), /rejected.*applied/);
  assert.throws(() => assertChapterGates(applied, 7, audited, { ...review, input: {} }), /fingerprint|schema/);
  const empty = extraction(a);
  const emptyReview = editorialDecisionSeed(empty);
  emptyReview.reviewer = { ...review.reviewer, agentId: 'extractor' };
  assert.throws(() => assertChapterGates(empty, 7, audited, emptyReview), /cannot review its own/);
});

test('source-current strictly valid extraction cannot add an applied repair absent from independent history', () => {
  const source = { meta: { book: 'fixture', chapter: '001', title: { en: 'Weather', zh: '雨' } },
    content: [{ type: 'paragraph', sentences: [
      { id: 's0001', zh: '雨。', idiomatic: 'Correct name.' },
      { id: 's0002', zh: '雪。', idiomatic: 'Unreviewed replacement.' },
    ] }] };
  const packet = buildPeopleExtractionPacket('fixture', '001', { chapterData: source });
  const seeded = buildPeopleExtractionSeed(packet, 'synthetic-offline-fixture');
  for (const key of Object.keys(seeded.coverage)) if (typeof seeded.coverage[key] === 'boolean') seeded.coverage[key] = true;
  seeded.run.agentId = 'extractor';
  const repair = { id: 'fixture:001:r0001', unit: locator, field: 'idiomatic', before: 'Old name.',
    after: 'Correct name.', reason: 'Correct the name.', confidence: 'high', status: 'proposed' };
  const history = editorialDecisionSeed({ ...seeded, translationRepairs: [repair] });
  history.reviewer = { kind: 'codex', name: 'Independent reviewer', model: null,
    agentId: 'independent', runId: null, completedAt: '2026-10-24T00:00:00Z' };
  history.decisions[0] = { repairId: repair.id, decision: 'accept', after: null,
    reason: repair.reason, sourceWitness: { source: 'chapter-text', citation: 'fixture:001:s0001', excerpt: null } };
  const extra = { ...repair, id: 'fixture:001:r0002', unit: { ...locator, id: 's0002', itemIndex: 1 },
    before: 'Original second sentence.', after: 'Unreviewed replacement.', reason: 'Never independently reviewed.', status: 'applied' };
  seeded.translationRepairs = [{ ...repair, status: 'applied' }, extra];
  const { normalized } = validatePeopleExtraction(seeded, packet, { strictAliasDispositions: true });
  assert.throws(() => validateAppliedEditorialDecisions(history, normalized), /r0002.*no matching independent/);
  assert.throws(() => assertChapterGates(normalized, 7, audited, history), /r0002.*no matching independent/);
  const approvedOnly = { ...normalized, translationRepairs: [normalized.translationRepairs[0]] };
  assert.doesNotThrow(() => assertChapterGates(approvedOnly, 7, audited, history));
  const emptyHistory = editorialDecisionSeed({ ...seeded, translationRepairs: [] });
  emptyHistory.reviewer = history.reviewer;
  assert.throws(() => assertChapterGates(approvedOnly, 7, audited, emptyHistory), /r0001.*no matching independent/);
  // An unrelated valid history cannot authorize even one altered field of a
  // repair contract, or a same-agent review, by virtue of existing on disk.
  for (const change of [
    { unit: { ...repair.unit, itemIndex: 9 } }, { field: 'literal' }, { before: 'Other before.' },
    { after: 'Other after.' }, { reason: 'Unreviewed reasoning.' },
  ]) {
    const changed = { ...approvedOnly, translationRepairs: [{ ...approvedOnly.translationRepairs[0], ...change }] };
    assert.throws(() => validateAppliedEditorialDecisions(history, changed), /no matching independent/);
  }
  assert.throws(() => validateAppliedEditorialDecisions({ ...history,
    reviewer: { ...history.reviewer, agentId: 'extractor' } }, approvedOnly), /cannot review its own/);
});

test('reviewed chapter identities qualify with cross-chapter uncertainty; historical pairs alone grant no proof', () => {
  const f = fixture(), { corpus, globalCatalog } = f;
  const identity = fixtureIdentityCoverage(corpus, globalCatalog, new Map([...corpus.localPeople, [f.outside.localId, f.outside]]));
  assert.doesNotThrow(() => assertScopedIdentity(corpus, identity.view, identity.certificates));
  assert.throws(() => assertScopedIdentity(corpus, identity.view, []), /Missing independent person coverage/);
  assert.throws(() => assertScopedIdentity(corpus, identity.view, { unresolvedCanonicalPeople: [] }), /validated person certificates/);
  const a = member('jinshu', '001', 'Same Name', '同名');
  const b = member('shiji', '001', 'Same Name', '同名');
  const locals = new Map([[a.localId, a], [b.localId, b]]);
  const resolved = resolvePeopleClusters(locals, [{ authority: 'curated', batch: 'fixture', decisions: [
    { decision: 'possible-same-as', localPeople: [a.localId, b.localId] }] }]);
  assert.equal(resolved.clusters.length, 2);
  const mapping = new Map(resolved.clusters.flatMap(cluster => cluster.localPeople.map(id => [id, cluster.canonicalPersonId])));
  const block = { id: 'block_fixture', localPeople: [a.localId, b.localId] };
  assert.equal(unresolvedCandidateState({ blocks: [block] }, mapping, resolved.keepSeparate).blocks.length, 1);
  assert.equal(unresolvedCandidateState({ blocks: [block] }, mapping, resolved.keepSeparate, resolved.possibleSameAs).blocks.length, 0);
});

test('identity generation seals and product certificates reject missing, stale and altered evidence', () => {
  const { globalCatalog, context } = fixture();
  const seal = { schemaVersion: 2, kind: 'people-accepted-identity-seal', inputs: 'current-inputs',
    catalog: peopleDigest(globalCatalog), siteIndex: peopleDigest(context.siteIndex), identityReviews: peopleDigest(globalCatalog.identityReviewByChapter) };
  assert.doesNotThrow(() => assertIdentitySeal(seal, globalCatalog, context.siteIndex, 'current-inputs'));
  for (const bad of [null, { ...seal, inputs: 'stale' }, { ...seal, catalog: 'altered' }, { ...seal, siteIndex: 'altered' }, { ...seal, identityReviews: 'altered' }]) {
    assert.throws(() => assertIdentitySeal(bad, globalCatalog, context.siteIndex, 'current-inputs'), /identity seal/);
  }
  assert.throws(() => assertEbookPeopleCertificate({ ...context.certificate, projection: 'forged' }, context.certificate), /certificate/);
});

test('required source roots reject legitimate split-root configuration before generation or validation writes', t => {
  const draft = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const other = fs.mkdtempSync(path.join(os.tmpdir(), 'ebook-certified-split-root-'));
  t.after(() => fs.rmSync(other, { recursive: true, force: true }));
  assert.doesNotThrow(() => assertCertifiedEbookRoot(REPO_ROOT, 'same-root fixture'));
  assert.throws(() => assertCertifiedEbookRoot(other, 'generator executable root'), /differs from certified people root/);
  assert.throws(() => assertCertifiedEbookRoot(other, 'validator working directory'), /differs from certified people root/);
});

test('actual loaded chapter objects must match full certified source and production input fingerprints', () => {
  const f = fixture();
  const chapters = [...f.data].map(([chapter, data]) => ({ chapter, data }));
  assert.doesNotThrow(() => assertCertifiedEbookSources(f.context, product, chapters));
  const preloaded = structuredClone(chapters);
  chapters[0].data.content[0].sentences.push({ id: 's0002', zh: '甲祕密讓位。', idiomatic: 'Jia secretly abdicated.' });
  assert.throws(() => assertCertifiedEbookSources(f.context, product, chapters), /Actual ebook source differs/);
  // A source object read before certification must not be accepted just because
  // it shares a root, chapter ID and all the original person anchors.
  const changed = chapters[0].data;
  const input = buildInputFingerprint(contentUnits(changed));
  f.context.certificate.gates[0] = { chapter: '001', source: peopleDigest(changed),
    inputFingerprint: input.chapterFingerprint, inputUnitCount: input.unitCount };
  assert.throws(() => assertCertifiedEbookSources(f.context, product, preloaded), /Actual ebook source differs/);
  const g = fixture();
  const original = [...g.data].map(([chapter, data]) => ({ chapter, data }));
  g.context.certificate.gates[0].inputFingerprint = `sha256:${'0'.repeat(64)}`;
  assert.throws(() => assertCertifiedEbookSources(g.context, product, original), /Actual ebook source differs/);
  const h = fixture();
  h.data.get('001').meta.title.en = 'Unreviewed title';
  assert.throws(() => assertCertifiedEbookSources(h.context, product,
    [...h.data].map(([chapter, data]) => ({ chapter, data }))), /Actual ebook source differs/);
});

function renderedFixture() {
  const f = fixture();
  const state = buildEbookPeople(f.context, product);
  const layout = planEbookContentDocuments(product.chapters, { hasAbout: false, peopleActive: true, peopleShards: state.shards.length });
  const files = new Map([['EPUB/people/certificate.json', JSON.stringify(f.context.certificate)],
    ['EPUB/people/index.xhtml', renderEbookPeopleIndex(state)]]);
  const titles = new Map([...f.data].map(([chapter, data]) => [chapter, data.meta.title.en]));
  for (const shard of state.shards) files.set(`EPUB/people/${shard.file}`, renderEbookGlossaryShard(shard, state, titles, layout, f.data));
  for (const chapter of product.chapters) {
    const entry = `EPUB/text/${layout.documentByChapter.get(chapter).file}`;
    const unit = f.data.get(chapter).content[0].sentences[0];
    const html = renderUnitWithPeople({ unitId: unit.id, text: unit.idiomatic, language: 'en', chineseWordSpans: false,
      chapterContext: state.chapterContexts.get(chapter), hrefForPerson: ({ personId }) => ebookPersonHref(state, personId) });
    files.set(entry, (files.get(entry) ?? '') + html);
  }
  return { ...f, state, files, verify: () => verifyCertifiedEbookPeople({ product, context: f.context, chapterData: f.data,
    entries: [...files.keys()], readEntry: entry => { if (!files.has(entry)) throw new Error(`Missing ${entry}`); return files.get(entry); }, hasAbout: false }) };
}

test('actual shared ebook renderer emits only scoped facts, scoped inverse family, bilingual snippets and links', () => {
  const f = renderedFixture();
  const result = f.verify();
  assert.equal(result.people, 2);
  const glossary = f.files.get('EPUB/people/glossary-001.xhtml');
  assert(!glossary.includes('Outside'));
  assert(glossary.includes('晉父至。'));
  assert(glossary.includes('Jin Father arrived.'));
  assert(glossary.includes('Child of'));
  assert(glossary.includes('not yet established whether this person is the same'));
  assert(glossary.includes(`#person-${f.aid}`));
});

test('real artifact comparison rejects fact leakage, forged certificates, missing entries and altered English links', () => {
  for (const mutate of [
    f => f.files.set('EPUB/people/glossary-001.xhtml', f.files.get('EPUB/people/glossary-001.xhtml').replace('Jin Father', 'Outside Alias')),
    f => f.files.set('EPUB/people/certificate.json', '{}'),
    f => f.files.delete('EPUB/people/index.xhtml'),
    f => { const file = [...f.files.keys()].find(name => name.startsWith('EPUB/text/')); f.files.set(file, f.files.get(file).replace('data-person-id=', 'data-forged-id=')); },
    f => f.files.set('EPUB/people/extra.xhtml', '<p>Outside leak</p>'),
  ]) {
    const f = renderedFixture(); mutate(f); assert.throws(f.verify);
  }
});

test('whole-source binding rejects an extra unmentioned person event even when every glossary/person anchor is unchanged', () => {
  const f = renderedFixture();
  f.data.get('001').content[0].sentences.push({ id: 's0002', zh: '甲祕密讓位。', idiomatic: 'Jia secretly abdicated.' });
  const document = [...f.files.keys()].find(file => file.startsWith('EPUB/text/'));
  f.files.set(document, f.files.get(document) + '<p>Jia secretly abdicated.</p>');
  assert.throws(f.verify, /Actual ebook source differs from certified chapter/);
});

test('global preview cannot be promoted into certified required glossary output', () => {
  const f = renderedFixture();
  f.context.preview = true;
  assert.throws(f.verify, /non-preview/);
});

test('packaged EPUB ZIP transport preserves independently checked glossary facts, snippets, certificate and mention links', t => {
  const f = renderedFixture();
  const draft = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ebook-certified-synthetic-epub-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const content = path.join(directory, 'content');
  const unpacked = path.join(directory, 'unpacked');
  for (const [entry, html] of f.files) {
    const file = path.join(content, entry);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
  }
  fs.writeFileSync(path.join(content, 'mimetype'), 'application/epub+zip');
  const archive = path.join(directory, 'fixture.epub');
  execFileSync('zip', ['-q', '-0', archive, 'mimetype'], { cwd: content });
  execFileSync('zip', ['-q', '-r', archive, 'EPUB'], { cwd: content });
  execFileSync('unzip', ['-q', archive, '-d', unpacked]);
  const entries = execFileSync('unzip', ['-Z1', archive], { encoding: 'utf8' }).trim().split('\n').filter(entry => !entry.endsWith('/'));
  const result = verifyCertifiedEbookPeople({ product, context: f.context, chapterData: f.data,
    entries, readEntry: entry => fs.readFileSync(path.join(unpacked, entry), 'utf8'), hasAbout: false });
  assert.equal(result.expectedMentionLinks, 2);
  fs.appendFileSync(path.join(unpacked, 'EPUB/people/glossary-001.xhtml'), '<p>Outside birth date</p>');
  assert.throws(() => verifyCertifiedEbookPeople({ product, context: f.context, chapterData: f.data,
    entries, readEntry: entry => fs.readFileSync(path.join(unpacked, entry), 'utf8'), hasAbout: false }), /differs/);
});
