import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

// Each fixture authors only three source chapters. Individual schemas and chronology
// are dependencies, never a corpus/worktree/public/node_modules copy.
const file = fileURLToPath(import.meta.url);
const code = path.resolve(path.dirname(file), '..');
if (!['--fixture-child', '--preview-fixture-child'].includes(process.argv[2])) {
  const runFixture = mode => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'people-qualified-site-'));
    try {
      for (const dir of ['schema', 'chronology']) {
        const source = path.join(process.env.PEOPLE_REPO_ROOT || code, 'data/people', dir);
        for (const name of fs.readdirSync(source).filter(name => name.endsWith('.json'))) {
          fs.mkdirSync(path.join(root, 'data/people', dir), { recursive: true });
          fs.copyFileSync(path.join(source, name), path.join(root, 'data/people', dir, name));
        }
      }
      for (const name of ['config.json', 'curation/role-vocabulary.json']) {
        const target = path.join(root, 'data/people', name);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.copyFileSync(path.join(process.env.PEOPLE_REPO_ROOT || code, 'data/people', name), target);
      }
      const result = spawnSync(process.execPath, [file, mode], {
        env: { ...process.env, PEOPLE_REPO_ROOT: root }, encoding: 'utf8', timeout: 170_000,
      });
      assert.equal(result.status, 0, result.stdout + result.stderr);
    } finally { fs.rmSync(root, { recursive: true, force: true }); }
  };
  test('ordinary compiler, certified subset, real pages/handler and all publication holds', { timeout: 180_000 }, () => runFixture('--fixture-child'));
  test('formerly complete catalogs cannot promote explicit previews after current approval disappears', { timeout: 180_000 }, () => runFixture('--preview-fixture-child'));
} else {
  const { REPO_ROOT: root, writeJsonAtomic: write } = await import('./lib/people-content.mjs');
  const { buildPeopleExtractionPacket, buildPeopleExtractionSeed } = await import('./build-people-extraction-packet.mjs');
  const { validatePeopleExtraction } = await import('./validate-people-extraction.mjs');
  const { buildDateAuditPacket, recordDateAudit } = await import('./lib/people-date-audit.mjs');
  const { editorialDecisionSeed, editorialDecisionPath } = await import('./lib/people-editorial-decisions.mjs');
  const { loadCertifiedPeopleSite, assertPeopleSiteCertificate } = await import('./lib/people-certified-site.mjs');
  const { loadPeopleSiteContext, chapterPeopleContext, renderUnitWithPeople } = await import('./lib/people-site.mjs');
  const { generatePeoplePages } = await import('./generate-people-pages.mjs');
  const { onRequestGet } = await import('../functions/people/[slug].js');
  const { personIdSlugSuffix } = await import('../functions/lib/people-shards.js');
  const writeAt = (file, value) => write(path.join(root, file), value);
  const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  writeAt('package.json', { type: 'module' });
  writeAt('data/glossary.json', {});
  writeAt('data/people/curation/overrides.json', { schemaVersion: 1, people: {} });
  fs.mkdirSync(path.join(root, 'scripts'));
  const sources = new Map();
  const extractions = new Map();
  for (const [book, chapter, en, zh] of [['jinshu','001','Jia','甲'], ['jinshu','002','Yi','乙'], ['shiji','001','Outside Alias','外名']]) {
    const scope = `${book}:${chapter}`;
    const source = { meta: { book, chapter, sentenceCount: 1, translatedCount: 1, title: { en: 'Synthetic chapter', zh: '測試' } },
      content: [{ type: 'paragraph', sentences: [{ id: 's0001', zh: `${zh}至。`, literal: `${en} arrived.`, idiomatic: `${en} arrived.` }] }] };
    writeAt(`data/${book}/${chapter}.json`, source);
    sources.set(scope, source);
    const packet = buildPeopleExtractionPacket(book, chapter);
    const extraction = buildPeopleExtractionSeed(packet, 'synthetic-offline-extractor');
    extraction.run.agentId = 'synthetic-extractor';
    for (const key of Object.keys(extraction.coverage)) if (typeof extraction.coverage[key] === 'boolean') extraction.coverage[key] = true;
    const id = `${scope}:p001`;
    extraction.people = [{ localId: id, preferredNameSuggestion: { en, zh, pinyin: en }, historicity: 'historical',
      descriptorSuggestion: book === 'shiji' ? 'Outside Descriptor' : 'Synthetic traveller',
      identityHints: { nativePlaces: [], relatedLocalPeople: [], activeDateHints: ['AD 300'] } }];
    extraction.claims = [
      { id: `${scope}:c0001`, subject: id, predicate: 'name', value: { kind: 'personal', en, zh, pinyin: en }, certainty: 'explicit', evidence: [`${scope}:s0001`] },
      { id: `${scope}:c0002`, subject: id, predicate: 'role', value: { roleId: book === 'shiji' ? 'historian' : 'named-individual' }, certainty: 'explicit', evidence: [`${scope}:s0001`] },
      { id: `${scope}:c0003`, subject: id, predicate: 'attestation', value: { sourceDate: { text: 'synthetic year' }, westernYear: { era: 'AD', year: 300, precision: 'year' } }, certainty: 'explicit', evidence: [`${scope}:s0001`] },
    ];
    if (book === 'shiji') extraction.claims.push({ id: `${scope}:c0004`, subject: id, predicate: 'birth',
      value: { sourceDate: { text: 'synthetic birth' }, westernYear: { era: 'AD', year: 250, precision: 'year' } }, certainty: 'explicit', evidence: [`${scope}:s0001`] });
    const unit = Object.fromEntries(Object.entries(packet.units[0]).filter(([key]) => ['id', 'kind', 'blockIndex', 'collection', 'itemIndex'].includes(key)));
    extraction.mentions = [{ id: `${scope}:m0001`, person: id, unit, kind: 'personal-name', candidateRefs: packet.preflight.candidates.map(candidate => candidate.id),
      spans: { zh: [{ exact: zh, occurrence: 0 }], en: [{ exact: en, occurrence: 0, startCodePoint: 0, endCodePoint: en.length }] } }];
    validatePeopleExtraction(extraction, packet, { strictAliasDispositions: true });
    writeAt(`data/people/extractions/${book}/${chapter}.json`, extraction);
    extractions.set(scope, extraction);
    if (book === 'shiji') continue;
    const review = editorialDecisionSeed(extraction);
    Object.assign(review.reviewer, { kind: 'codex', name: 'Independent synthetic editor', model: 'offline-fixture', agentId: 'synthetic-independent-editor', completedAt: '2026-10-24T12:00:00Z' });
    write(editorialDecisionPath(book, chapter), review);
    const audit = buildDateAuditPacket(book, chapter);
    const check = id => ({ id, verdict: 'supported', event: 'Synthetic traveller arrived in this source passage.',
      reason: 'Authored synthetic fixture; no historical assertion.', evidence: [{ unit: 's0001', quote: `${zh}至` }] });
    recordDateAudit({ schemaVersion: 1, auditVersion: 1, book, chapter, sourceHash: audit.sourceHash, extractionHash: audit.extractionHash, status: 'audited',
      reviewer: { name: 'Independent synthetic date reviewer', independentOfExtractor: true }, reviewedAt: '2026-10-24T12:00:00Z',
      summary: 'Complete authored synthetic chapter date review.', reviewedUnits: ['s0001'], itemChecks: audit.items.map(item => check(item.id)), personChecks: audit.people.map(person => check(person.id)), findings: [], references: [] });
  }
  writeAt('data/people/resolutions/synthetic.json', { schemaVersion: 1, authority: 'curated', batch: 'synthetic', decisions: [
    { decision: 'merge', localPeople: ['jinshu:001:p001','shiji:001:p001'], basis: ['Synthetic cross-book test identity.'], confidence: 'high' }] });
  const { writeFixtureIdentityReviews } = await import('./lib/people-identity-test-fixtures.mjs');
  const compile = () => {
    writeFixtureIdentityReviews([{ book: 'jinshu', chapter: '001' }, { book: 'jinshu', chapter: '002' }]);
    const result = spawnSync(process.execPath, [fileURLToPath(import.meta.resolve('./compile-people-catalog.mjs'))], { env: process.env, encoding: 'utf8', timeout: 60_000 });
    assert.equal(result.status, 0, result.stdout + result.stderr);
  };
  // A broad current-extraction outside inventory is missing date approval. The normal
  // compiler seals these inputs; they must never trigger packet validation here.
  for (let number = 2; number <= 65; number += 1) {
    const chapter = String(number).padStart(3, '0');
    writeAt(`data/outside/${chapter}.json`, { meta: { book: 'outside', chapter },
      content: [{ type: 'paragraph', sentences: [{ id: 's0001', zh: '雨。', idiomatic: 'It rained.' }] }] });
    const outsidePacket = buildPeopleExtractionPacket('outside', chapter);
    const outsideExtraction = buildPeopleExtractionSeed(outsidePacket, 'synthetic-outside-extractor');
    for (const key of Object.keys(outsideExtraction.coverage)) if (typeof outsideExtraction.coverage[key] === 'boolean') outsideExtraction.coverage[key] = true;
    validatePeopleExtraction(outsideExtraction, outsidePacket, { strictAliasDispositions: true });
    writeAt(`data/people/extractions/outside/${chapter}.json`, outsideExtraction);
  }
  if (process.argv[2] === '--preview-fixture-child') {
    // Start with an ordinary, genuinely complete two-chapter generation. Date
    // approvals are intentionally not identity inputs; removing one is the P1
    // reproduction and must not make the old complete flag authoritative.
    for (const book of ['outside', 'shiji']) {
      fs.rmSync(path.join(root, 'data', book), { recursive: true, force: true });
      fs.rmSync(path.join(root, 'data/people/extractions', book), { recursive: true, force: true });
    }
    writeAt('data/people/resolutions/synthetic.json', { schemaVersion: 1, authority: 'curated', batch: 'synthetic-preview', decisions: [] });
    compile();
    const before = loadPeopleSiteContext({ allowPreview: false });
    assert.equal(before.catalog.complete, true);
    assert(before.catalog.people.every(person => person.curation.notes.some(note => note.includes('not yet established'))));
    assert.equal(before.publication.qualifiedChapters, 2);
    const completeDiagnostic = loadPeopleSiteContext({ allowPreview: true });
    assert.equal(completeDiagnostic.catalog.complete, true);
    assert.equal(completeDiagnostic.preview, true);
    assert.equal(completeDiagnostic.publication.publishedChapters, 0);
    assert.equal(completeDiagnostic.publication.publishedNonemptyChapters, 0);
    const approvedPerson = before.catalog.people.find(person => person.localPeople.includes('jinshu:002:p001'));
    const stalePerson = before.catalog.people.find(person => person.localPeople.includes('jinshu:001:p001'));
    fs.unlinkSync(path.join(root, 'data/people/date-audits/jinshu/001.json'));
    process.env.PEOPLE_SITE_PREVIEW = '1';
    const diagnostic = loadPeopleSiteContext();
    assert.equal(diagnostic.preview, true);
    assert.equal(diagnostic.catalog.complete, false);
    assert.equal(diagnostic.publication.mode, 'diagnostic-preview');
    assert.equal(diagnostic.publication.qualifiedChapters, 1);
    assert.equal(diagnostic.publication.publishedChapters, 0);
    assert.equal(diagnostic.publication.publishedNonemptyChapters, 0);
    assert.equal(diagnostic.publication.publishedPeople, 0);
    assert(diagnostic.certificate);
    assert(!diagnostic.peopleById.has(stalePerson.id));
    const outputRoot = path.join(root, 'public');
    generatePeoplePages({ outputRoot });
    const status = read('public/data/people/site-status.json');
    assert.equal(status.preview, true);
    assert.equal(status.published, false);
    assert.equal(status.publication.publishedChapters, 0);
    assert.equal(status.publication.publishedPeople, 0);
    assert.equal(status.certificate.kind, 'certified-website-people');
    for (const name of fs.readdirSync(path.join(outputRoot, 'data/people/pages'))) {
      assert.equal(read(`public/data/people/pages/${name}`).v, 2);
    }
    const assets = { async fetch(request) {
      const file = path.join(outputRoot, decodeURIComponent(new URL(request.url).pathname));
      return fs.existsSync(file) && fs.statSync(file).isFile() ? new Response(fs.readFileSync(file)) : new Response(null, { status: 404 });
    } };
    const request = slug => onRequestGet({ params: { slug: `${slug}.html` }, request: new Request(`https://24histories.com/people/${slug}.html`), env: { ASSETS: assets } });
    assert.equal((await request(approvedPerson.slug)).status, 503);
    assert.equal((await request(stalePerson.slug)).status, 503);
    assert.match(fs.readFileSync(path.join(outputRoot, 'people/index.html'), 'utf8'), /noindex/);
    const seal = path.join(root, 'data/people/generated/catalog.json.identity-seal.json');
    fs.renameSync(seal, `${seal}.held`);
    assert.throws(() => loadPeopleSiteContext(), /ENOENT/);
    fs.renameSync(`${seal}.held`, seal);
    delete process.env.PEOPLE_SITE_PREVIEW;
    const production = loadPeopleSiteContext({ allowPreview: false });
    assert.equal(production.preview, false);
    assert.equal(production.catalog.complete, false);
    assert.equal(production.publication.publishedChapters, 1);
    assert.equal(production.publication.mode, 'certified-scope');
    assert.equal(loadPeopleSiteContext({ allowPreview: true }).preview, true);
    generatePeoplePages({ outputRoot });
    assert.equal((await request(approvedPerson.slug)).status, 200);
    assert.equal((await request(stalePerson.slug)).status, 404);
    console.log('preview promotion regression: formerly complete=2, removed date => diagnostic preview publishes 0 and handler refuses 503; normal fresh production publishes only 1');
    process.exit(0);
  }
  compile();
  // Normal registry, preparation and host-captured record APIs use the same
  // native validators as publication, without a pair document or paid worker.
  const { buildIdentityDossierRegistry } = await import('./lib/people-identity-registry-workflow.mjs');
  const { buildChapterIdentityReviewPacket, prepareChapterIdentityReview } = await import('./prepare-people-chapter-identity.mjs');
  const { recordChapterIdentityReview, identityArtifactHash } = await import('./lib/people-identity-review-record.mjs');
  const { loadValidatedPeopleCorpus, loadValidatedResolutionDocuments, sourceChapterIds } = await import('./lib/people-corpus.mjs');
  const { resolveAcceptedPeopleClusters, localNameKeys } = await import('./lib/people-resolution.mjs');
  const { buildIdentityDossierIndex } = await import('./lib/people-identity-dossiers.mjs');
  const { acceptedCatalogIdentityView } = await import('./lib/people-chapter-identity.mjs');
  const { loadValidatedPeopleChapter } = await import('./lib/people-validated-chapter.mjs');
  const { fixtureIdentityBundle } = await import('./lib/people-identity-test-fixtures.mjs');
  const registry = path.join(root, 'identity-registry');
  const registryResult = buildIdentityDossierRegistry({ out: registry, revision: '1'.repeat(40) });
  assert.equal(registryResult.generatedPairs, 0);
  const prepared = await buildChapterIdentityReviewPacket({ book: 'jinshu', chapter: '001', registry });
  assert.equal(prepared.plan.metrics.generatedPairs, 0);
  const reused = await prepareChapterIdentityReview({ book: 'jinshu', chapter: '001', registry, out: path.join(root, 'reused-identity-proof') });
  assert.equal(reused.status, 'identity-review-current');
  assert.equal(reused.newReviewCases, 0);
  assert.equal(fs.existsSync(path.join(root, 'reused-identity-proof/transport-packet.json')), false);
  assert(prepared.plan.cases.every(item => item.candidateDossiers.length <= 8));
  const whole = loadValidatedPeopleCorpus(), decisions = loadValidatedResolutionDocuments(whole.localPeople);
  const groups = resolveAcceptedPeopleClusters(whole.localPeople, decisions).clusters;
  const registryIndex = buildIdentityDossierIndex(whole.localPeople, groups, localNameKeys);
  const fixtureView = acceptedCatalogIdentityView({ localPersonMap: Object.fromEntries(registryIndex.localPersonMap), people: groups.map(group => ({ id: group.canonicalPersonId, retiredIds: group.retiredIds })) });
  const identitySources = new Map(['jinshu:001','jinshu:002','shiji:001'].map(key => { const [book,chapter] = key.split(':'); return [key,loadValidatedPeopleChapter(book,chapter)]; }));
  const authored = fixtureIdentityBundle(registryIndex, fixtureView, identitySources, prepared.plan.scope, prepared.plan.inputs);
  assert.equal(authored.bundle.plan.fingerprint, prepared.plan.fingerprint);
  const commandDir = path.join(root, 'data/people/generated/identity-command-fixture');
  fs.mkdirSync(commandDir, { recursive: true });
  const packetFile = path.join(commandDir, 'packet.json'), reportFile = path.join(commandDir, 'report.json'), jobFile = path.join(commandDir, 'job.json');
  fs.writeFileSync(packetFile, JSON.stringify(prepared.packet, null, 2) + '\n');
  fs.writeFileSync(reportFile, JSON.stringify(authored.bundle.report));
  const capture = { schemaVersion: 1, kind: 'captured-independent-identity-review', phase: 'report-recorded', scope: prepared.plan.scope,
    agentId: authored.bundle.report.reviewer.agentId, runId: 'offline-authored-review-run', sourcePacketSha256: identityArtifactHash(fs.readFileSync(packetFile)), reportSha256: identityArtifactHash(fs.readFileSync(reportFile)) };
  fs.writeFileSync(jobFile, JSON.stringify(capture));
  const recordOptions = { packet: packetFile, report: reportFile, job: jobFile, registry, out: path.join(commandDir, 'accepted.json') };
  assert.equal((await recordChapterIdentityReview(recordOptions)).reviewedCases, 1);
  assert.equal((await recordChapterIdentityReview(recordOptions)).unchanged, true);
  const acceptedBytes = fs.readFileSync(recordOptions.out);
  fs.appendFileSync(reportFile, ' ');
  await assert.rejects(recordChapterIdentityReview(recordOptions), /byte hashes do not match/);
  assert.deepEqual(fs.readFileSync(recordOptions.out), acceptedBytes);
  // Progress distinguishes reviewed source identities/uncertainty from a live receipt.
  const progressManifest = { books: {} };
  for (const key of sourceChapterIds()) { const [book,chapter] = key.split(':'); progressManifest.books[book] ??= { chapters: [] }; progressManifest.books[book].chapters.push({ chapter }); }
  const { buildPeopleGlossaryProgress } = await import('../generate-progress.js');
  const originalCwd = process.cwd();
  try {
    process.chdir(root);
    const progress = buildPeopleGlossaryProgress(progressManifest);
    assert.equal(progress.summary.preliminaryChapters, 2);
    assert.equal(progress.summary.identityReviewedChapters, 2);
    assert.equal(progress.summary.reviewedAmbiguousCases, 2);
    assert.equal(progress.summary.zeroPersonExtractions, 64);
    assert.equal(progress.summary.identityPendingCases, 1);
  } finally { process.chdir(originalCwd); }
  const context = loadPeopleSiteContext();
  assert(context.active);
  assert(!context.preview);
  assert.equal(context.catalog.complete, false);
  assert.equal(context.publication.qualifiedChapters, 2);
  assert.equal(context.publication.publishedChapters, 2);
  assert.equal(context.publication.publishedPeople, 2);
  assert.equal(context.globalStats.dateAuditPendingChapters, 65);
  assert.equal(context.certificate.holds.length, 65);
  assert.deepEqual(context.publication.qualificationWorkload, { scopeChapters: 67, candidateChapters: 2, validatedChapters: 2 });
  assert(!JSON.stringify(context.catalog.people).includes('Outside'));
  assert(context.catalog.people.every(person => person.life.birth.length === 0 && person.references.every(ref => ref.book === 'jinshu')));
  const person = context.catalog.people.find(person => person.localPeople.includes('jinshu:001:p001'));
  assert.equal(chapterPeopleContext(context, 'shiji', '001'), null);
  for (const chapter of ['001','002']) {
    const chapterContext = chapterPeopleContext(context, 'jinshu', chapter);
    const html = renderUnitWithPeople({ unitId: 's0001', text: sources.get(`jinshu:${chapter}`).content[0].sentences[0].idiomatic,
      language: 'en', chapterContext, chineseWordSpans: false });
    assert.match(html, /data-person-id=/);
  }
  const outputRoot = path.join(root, 'public');
  writeAt('ebooks/publication-descriptions.json', {});
  const { generateChapterHTML } = await import('../generate-static-pages.js');
  for (const [scope, source] of sources) {
    const [book, chapter] = scope.split(':');
    const chapterHtml = generateChapterHTML(book, source, book === 'jinshu' ? ['001','002'] : ['001']);
    if (book === 'jinshu') {
      assert.match(chapterHtml, /id="en-s0001"/);
      assert.match(chapterHtml, /data-person-id=/);
      assert(chapterHtml.includes(`../people/${context.catalog.people.find(person => person.references.some(ref => ref.chapter === chapter)).slug}.html`));
    } else assert(!chapterHtml.includes('data-person-id='));
    fs.mkdirSync(path.join(outputRoot, book), { recursive: true });
    fs.writeFileSync(path.join(outputRoot, book, `${chapter}.html`), chapterHtml);
  }
  const changedSource = structuredClone(sources.get('jinshu:001'));
  changedSource.content[0].sentences[0].idiomatic = 'Jia secretly abdicated.';
  assert.throws(() => generateChapterHTML('jinshu', changedSource, ['001','002']), /differs from certified/);
  const result = generatePeoplePages({ outputRoot });
  assert.equal(result.generated, 2);
  const status = read('public/data/people/site-status.json');
  assert(status.published && !status.complete);
  assert.equal(status.publication.publishedChapters, 2);
  const assets = { async fetch(request) {
    const file = path.join(outputRoot, decodeURIComponent(new URL(request.url).pathname));
    return fs.existsSync(file) && fs.statSync(file).isFile() ? new Response(fs.readFileSync(file), { status: 200 }) : new Response(null, { status: 404 });
  } };
  const request = slug => onRequestGet({ params: { slug: `${slug}.html` }, request: new Request(`https://24histories.com/people/${slug}.html`), env: { ASSETS: assets } });
  fs.writeFileSync(path.join(outputRoot, 'people-record.js'), '// Authored fixture runtime marker.');
  const { verifyPeopleSite } = await import('./verify-people-site.mjs');
  assert.equal(verifyPeopleSite({ outputRoot }).people, 2);
  const served = await request(person.slug);
  assert.equal(served.status, 200);
  const html = await served.text();
  assert.match(html, /application\/ld\+json/);
  const structured = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/u)[1]);
  assert(structured['@graph'].find(row => row['@type'] === 'Person').description.includes('not yet established'));
  assert.match(html, /person-lede[^>]*>[^<]*not yet established/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /jinshu\/001\.html#en-s0001/);
  assert(!html.includes('Outside'));
  assert.equal((await request('unknown-person')).status, 404);
  const retired = person.retiredIds[0];
  assert(retired);
  const redirect = await request(`retired-name-${personIdSlugSuffix(retired)}`);
  assert.equal(redirect.status, 301);
  assert(redirect.headers.get('location').endsWith(`/${person.slug}.html`));
  writeAt('data/manifest.json', { generatedAt: '2026-10-24T12:00:00Z', books: {
    jinshu: { chapters: [{ chapter: '001' }, { chapter: '002' }] }, shiji: { chapters: [{ chapter: '001' }] } } });
  const sitemap = spawnSync(process.execPath, [fileURLToPath(import.meta.resolve('./generate-sitemap.mjs'))], { env: process.env, encoding: 'utf8' });
  assert.equal(sitemap.status, 0, sitemap.stdout + sitemap.stderr);
  const xml = fs.readFileSync(path.join(outputRoot, 'sitemap.xml'), 'utf8');
  for (const person of context.catalog.people) assert(xml.includes(`/people/${person.slug}.html`));
  assert(!xml.includes('outside-alias'));
  const search = read('public/data/people/search/index.json');
  assert.equal(search.people, 2);
  assert(JSON.stringify(search).includes('not yet established'));
  assert(!JSON.stringify(search).includes('Outside'));
  const statusFile = path.join(root, 'public/data/people/site-status.json');
  fs.renameSync(statusFile, `${statusFile}.held`);
  assert.equal((await request(person.slug)).status, 503);
  fs.renameSync(`${statusFile}.held`, statusFile);
  const badStatus = structuredClone(status); badStatus.certificate.projection = 'stale';
  write(statusFile, badStatus);
  assert.equal((await request(person.slug)).status, 503);
  write(statusFile, status);
  // Exercise local rollback after earlier targets have already been replaced.
  const rename = fs.renameSync;
  let injected = false;
  fs.renameSync = (source, destination) => {
    if (!injected && source.includes('.people-publication-') && source.endsWith(path.join('data','people'))) {
      injected = true;
      throw new Error('Synthetic atomic replacement failure');
    }
    return rename(source, destination);
  };
  try { assert.throws(() => generatePeoplePages({ outputRoot }), /Synthetic atomic replacement failure/); }
  finally { fs.renameSync = rename; }
  assert(injected);
  assert.equal((await request(person.slug)).status, 200);
  assert.equal(fs.readFileSync(statusFile, 'utf8'), JSON.stringify(status, null, 2) + '\n');
  // A gate change after rendering started must fail before replacement.
  const copy = fs.copyFileSync;
  const heldDateFile = path.join(root, 'data/people/date-audits/jinshu/001.json');
  const heldDateBytes = fs.readFileSync(heldDateFile);
  let changedGate = false;
  fs.copyFileSync = (...args) => {
    const result = copy(...args);
    if (!changedGate) { changedGate = true; fs.unlinkSync(heldDateFile); }
    return result;
  };
  try { assert.throws(() => generatePeoplePages({ outputRoot }), /missing or stale/); }
  finally { fs.copyFileSync = copy; fs.writeFileSync(heldDateFile, heldDateBytes); }
  assert(changedGate);
  assert.equal((await request(person.slug)).status, 200);
  const cert = context.certificate;
  assert.doesNotThrow(() => assertPeopleSiteCertificate(cert));
  assert.throws(() => loadCertifiedPeopleSite({ expectedInputs: 'stale' }), /expected input pin/);
  const dateFile = 'data/people/date-audits/jinshu/001.json';
  const date = read(dateFile);
  fs.unlinkSync(path.join(root, dateFile));
  assert.equal(loadCertifiedPeopleSite().publication.qualifiedChapters, 1);
  assert.throws(() => assertPeopleSiteCertificate(cert), /missing or stale/);
  writeAt(dateFile, date);
  const editorFile = editorialDecisionPath('jinshu','001');
  const editor = JSON.parse(fs.readFileSync(editorFile, 'utf8'));
  const self = structuredClone(editor); self.reviewer.agentId = 'synthetic-extractor';
  write(editorFile, self);
  assert.equal(loadCertifiedPeopleSite().publication.qualifiedChapters, 1);
  write(editorFile, editor);
  fs.unlinkSync(editorFile);
  // Established gate: no repair proposals/applied repairs need no empty history.
  assert.equal(loadCertifiedPeopleSite().publication.qualifiedChapters, 2);
  write(editorFile, editor);
  const source = sources.get('jinshu:001');
  writeAt('data/jinshu/001.json', { ...source, meta: { ...source.meta, changed: true } });
  assert.throws(() => loadCertifiedPeopleSite(), /identity seal/);
  writeAt('data/jinshu/001.json', source);
  const sealFile = 'data/people/generated/catalog.json.identity-seal.json';
  const seal = read(sealFile);
  fs.unlinkSync(path.join(root, sealFile));
  assert.throws(() => loadCertifiedPeopleSite(), /ENOENT/);
  writeAt(sealFile, seal);
  writeAt('data/people/curation/overrides.json', { schemaVersion: 1, people: { [person.id]: { preferredDescription: 'Outside Descriptor', reason: 'Synthetic outside-only curation.' } } });
  compile();
  assert.throws(() => loadCertifiedPeopleSite(), /lacks scoped source support/);
  // A failed publication cannot destroy the last reviewed artifact.
  assert.throws(() => generatePeoplePages({ outputRoot }), /lacks scoped source support/);
  assert.equal(fs.readFileSync(statusFile, 'utf8'), JSON.stringify(status, null, 2) + '\n');
  writeAt('data/people/curation/overrides.json', { schemaVersion: 1, people: {} });
  compile();
  for (const chapter of ['001','002']) fs.unlinkSync(path.join(root, `data/people/date-audits/jinshu/${chapter}.json`));
  assert.equal(loadCertifiedPeopleSite().active, false);
  assert.equal(generatePeoplePages({ outputRoot }).generated, 0);
  assert(!fs.existsSync(path.join(outputRoot, 'data/people')));
  console.log('qualified website integration: ordinary compiler + 2 approved chapters, outside cross-book cluster, generator/handler/search/redirects and explicit holds passed');
}
