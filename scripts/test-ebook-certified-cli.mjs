import test from 'node:test';
import os from 'node:os';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { PEOPLE_DIR } from './lib/people-content.mjs';

// A tiny actual publication, with production extraction/date validation and the
// normal compiler. No source, identity, editorial or date gate is mocked.
test('required CLI binds the full publication to one certified root; split-root unmentioned events reject', { timeout: 180_000 }, () => {
  const codeRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ebook-certified-cli-fixture-'));
  try {
    const a = path.join(directory, 'approved-a');
    const b = path.join(directory, 'unapproved-b');
    const write = (root, file, value) => {
      const target = path.join(root, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`);
    };
    for (const name of ['scripts', 'data/people/extractions', 'data/people/resolutions']) {
      fs.mkdirSync(path.join(a, name), { recursive: true });
    }
    // Required individual schemas/chronology are fixture dependencies; no book,
    // corpus, public asset directory, repository or dependency tree is copied.
    for (const name of ['schema', 'chronology']) {
      for (const file of fs.readdirSync(path.join(PEOPLE_DIR, name)).filter(file => file.endsWith('.json'))) {
        write(a, `data/people/${name}/${file}`, JSON.parse(fs.readFileSync(path.join(PEOPLE_DIR, name, file), 'utf8')));
      }
    }
    for (const file of ['config.json', 'curation/role-vocabulary.json']) {
      write(a, `data/people/${file}`, JSON.parse(fs.readFileSync(path.join(PEOPLE_DIR, file), 'utf8')));
    }
    write(a, 'package.json', { type: 'module' });
    write(a, 'data/glossary.json', {});
    write(a, 'data/people/curation/overrides.json', { schemaVersion: 1, people: {} });
    const product = { slug: 'jinshu-synthetic-test', book: 'jinshu', chapters: ['001'],
      title: 'Synthetic Integration Test', subtitle: 'Fictional test fixture', author: 'Synthetic Author',
      translator: 'Garrett M. Petersen', publisher: 'Synthetic Testing',
      rights: 'Synthetic test fixture only. English translation and edition are copyright (c) 2026 Garrett M. Petersen.',
      description: 'A fictional integration testing artifact. No real publication claim.',
      aiDisclosure: 'This synthetic English translation was generated with AI tools for local integration testing.',
      editionNote: 'Testing edition only.', editionStatus: 'Synthetic test edition', language: 'en',
      sourceAttribution: ['Synthetic authored fixture'],
      kdp: { suggestedListPriceUsd: '9.99', publishingRights: 'This is not a public domain translation. Synthetic testing artifact only.',
        aiGeneratedContent: 'Yes', categories: ['History'], keywords: ['river crossings', 'autumn gardens', 'northern mountains',
          'southern orchards', 'western villages', 'eastern valleys', 'winter journeys'] } };
    write(a, 'ebooks/manifest.json', { schemaVersion: 1, products: [product] });
    const source = { meta: { book: 'jinshu', chapter: '001', sentenceCount: 1, translatedCount: 1,
      title: { en: 'Synthetic chapter', zh: '測試' } },
    content: [{ type: 'paragraph', sentences: [{ id: 's0001', zh: '甲至。', literal: 'Jia arrived.', idiomatic: 'Jia arrived.' }] }] };
    write(a, 'data/jinshu/001.json', source);
    write(a, 'data/outside/001.json', { meta: { book: 'outside', chapter: '001' },
      content: [{ type: 'paragraph', sentences: [{ id: 's0001', zh: '雨。', idiomatic: 'It rained.' }] }] });
    const generator = fileURLToPath(import.meta.resolve('./generate-ebook.mjs'));
    for (const root of [a, b]) {
      fs.mkdirSync(path.join(root, 'scripts'), { recursive: true });
      fs.copyFileSync(generator, path.join(root, 'scripts/generate-ebook.mjs'));
    }
    // Executables retain their real fixture location. Only their dependency
    // imports use the existing code installation, as in a sparse installation.
    const loader = path.join(directory, 'fixture-loader.mjs');
    fs.writeFileSync(loader, `export async function resolve(specifier, context, nextResolve) {
      const entries = ${JSON.stringify([a, b].map(root => pathToFileURL(path.join(root, 'scripts/generate-ebook.mjs')).href))};
      return nextResolve(specifier, entries.includes(context.parentURL)
        ? { ...context, parentURL: ${JSON.stringify(pathToFileURL(generator).href)} } : context);
    }\n`);
    const modules = Object.fromEntries(['build-people-extraction-packet.mjs', 'validate-people-extraction.mjs',
      'lib/people-content.mjs', 'lib/people-date-audit.mjs', 'lib/people-identity-test-fixtures.mjs'].map(file => [file, import.meta.resolve(`./${file}`)]));
    const seed = path.join(a, 'seed.mjs');
    fs.writeFileSync(seed, `const modules = ${JSON.stringify(modules)};
      const { buildPeopleExtractionPacket, buildPeopleExtractionSeed } = await import(modules['build-people-extraction-packet.mjs']);
      const { validatePeopleExtraction } = await import(modules['validate-people-extraction.mjs']);
      const { REPO_ROOT, writeJsonAtomic } = await import(modules['lib/people-content.mjs']);
      const { buildDateAuditPacket, recordDateAudit } = await import(modules['lib/people-date-audit.mjs']);
      const packet = buildPeopleExtractionPacket('jinshu', '001');
      const extraction = buildPeopleExtractionSeed(packet, 'synthetic-offline-extractor');
      extraction.run.agentId = 'synthetic-extractor';
      for (const key of Object.keys(extraction.coverage)) if (typeof extraction.coverage[key] === 'boolean') extraction.coverage[key] = true;
      const id = 'jinshu:001:p001';
      extraction.people = [{ localId: id, preferredNameSuggestion: { en: 'Jia', zh: '甲', pinyin: 'Jia' },
        historicity: 'historical', descriptorSuggestion: 'Synthetic traveller',
        identityHints: { nativePlaces: [], relatedLocalPeople: [], activeDateHints: ['AD 300'] } }];
      extraction.claims = [
        { id: 'jinshu:001:c0001', subject: id, predicate: 'name', value: { kind: 'personal', en: 'Jia', zh: '甲', pinyin: 'Jia' }, certainty: 'explicit', evidence: ['jinshu:001:s0001'] },
        { id: 'jinshu:001:c0002', subject: id, predicate: 'role', value: { roleId: 'named-individual' }, certainty: 'explicit', evidence: ['jinshu:001:s0001'] },
        { id: 'jinshu:001:c0003', subject: id, predicate: 'attestation', value: { sourceDate: { text: 'synthetic year' }, westernYear: { era: 'AD', year: 300, precision: 'year' } }, certainty: 'explicit', evidence: ['jinshu:001:s0001'] },
      ];
      const unit = Object.fromEntries(Object.entries(packet.units[0]).filter(([key]) => ['id', 'kind', 'blockIndex', 'collection', 'itemIndex'].includes(key)));
      extraction.mentions = [{ id: 'jinshu:001:m0001', person: id, unit, kind: 'personal-name',
        candidateRefs: packet.preflight.candidates.map(candidate => candidate.id),
        spans: { zh: [{ exact: '甲', occurrence: 0 }], en: [{ exact: 'Jia', occurrence: 0, startCodePoint: 0, endCodePoint: 3 }] } }];
      validatePeopleExtraction(extraction, packet, { strictAliasDispositions: true });
      writeJsonAtomic(REPO_ROOT + '/data/people/extractions/jinshu/001.json', extraction);
      const audit = buildDateAuditPacket('jinshu', '001');
      const check = id => ({ id, verdict: 'supported', event: 'Synthetic Jia arrived in the source passage.',
        reason: 'Synthetic fixture checks full source ownership; no historical assertion.', evidence: [{ unit: 's0001', quote: '甲至' }] });
      recordDateAudit({ schemaVersion: 1, auditVersion: 1, book: 'jinshu', chapter: '001',
        sourceHash: audit.sourceHash, extractionHash: audit.extractionHash, status: 'audited',
        reviewer: { name: 'Independent synthetic reviewer', independentOfExtractor: true }, reviewedAt: '2026-10-24T12:00:00Z',
        summary: 'Synthetic complete source review.', reviewedUnits: ['s0001'], itemChecks: audit.items.map(item => check(item.id)),
        personChecks: audit.people.map(person => check(person.id)), findings: [], references: [] });
      const { writeFixtureIdentityReviews } = await import(modules['lib/people-identity-test-fixtures.mjs']);
      writeFixtureIdentityReviews([{ book: 'jinshu', chapter: '001' }]);
    `);
    const inheritedLoaders = [];
    for (let index = 0; index < process.execArgv.length; index += 1) {
      if (process.execArgv[index] === '--loader' || process.execArgv[index] === '--experimental-loader') {
        inheritedLoaders.push(process.execArgv[index], process.execArgv[++index]);
      }
    }
    const run = (args, cwd = a) => {
      const result = spawnSync(process.execPath, [...inheritedLoaders, '--loader', loader, ...args],
        { cwd, env: { ...process.env, PEOPLE_REPO_ROOT: a, TMPDIR: directory }, encoding: 'utf8', timeout: 90_000 });
      return { status: result.status, output: result.stdout + result.stderr, error: result.error?.message };
    };
    for (const args of [[seed], [fileURLToPath(import.meta.resolve('./compile-people-catalog.mjs'))],
      [path.join(a, 'scripts/generate-ebook.mjs'), '--book', 'jinshu', '--require-people-glossary']]) {
      const result = run(args);
      assert.equal(result.status, 0, `${args.join(' ')}\n${result.output}\n${result.error ?? ''}`);
    }
    const validator = fileURLToPath(import.meta.resolve('./validate-ebook.mjs'));
    const epub = path.join(a, `dist/ebooks/${product.slug}/${product.slug}.epub`);
    const positive = run([validator, '--require-people-glossary', epub]);
    assert.equal(positive.status, 0, positive.output);
    assert.match(positive.output, /EPUB validation passed/);
    write(b, 'ebooks/manifest.json', { schemaVersion: 1, products: [product] });
    const unapproved = structuredClone(source);
    unapproved.content[0].sentences.push({ id: 's0002', zh: '甲祕密讓位。', literal: 'Jia secretly abdicated.', idiomatic: 'Jia secretly abdicated.' });
    unapproved.meta.sentenceCount = 2;
    unapproved.meta.translatedCount = 2;
    write(b, 'data/jinshu/001.json', unapproved);
    const splitGenerator = run([path.join(b, 'scripts/generate-ebook.mjs'), '--book', 'jinshu', '--require-people-glossary'], b);
    assert.notEqual(splitGenerator.status, 0);
    assert.match(splitGenerator.output, /generator executable root.*differs from certified people root/);
    assert.equal(fs.existsSync(path.join(b, 'dist')), false, 'Mixed-root generation must fail before creating output');
    const splitValidator = run([validator, '--require-people-glossary', epub], b);
    assert.notEqual(splitValidator.status, 0);
    assert.match(splitValidator.output, /validator working directory.*differs from certified people root/);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
