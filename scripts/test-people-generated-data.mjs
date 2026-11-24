#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import {
  readPeopleCatalog,
  readPeopleResolutionCandidates,
  readPeopleSiteIndex,
  writePeopleCatalog,
  writePeopleResolutionCandidates,
  writePeopleSiteIndex,
} from './lib/people-generated-data.mjs';
import { readJson, writeJsonAtomic } from './lib/people-content.mjs';

const directory = fs.mkdtempSync(path.join(os.tmpdir(), '24histories-people-generated-'));
try {
  const catalogFile = path.join(directory, 'catalog.json');
  const catalog = {
    schemaVersion: 1,
    generatedAt: '2026-09-08T00:00:00.000Z',
    complete: false,
    currentPromptVersion: 7,
    stats: { canonicalPeople: 251, familyEdges: 2_001, localPeople: 10_001 },
    people: Array.from({ length: 251 }, (_, index) => ({ id: `person-${index}` })),
    familyEdges: Array.from({ length: 2_001 }, (_, index) => ({ id: `edge-${index}` })),
    localPersonMap: Object.fromEntries(
      Array.from({ length: 10_001 }, (_, index) => [`local-${index}`, `person-${index % 251}`]),
    ),
    unresolvedCandidateBlockIds: [],
    resolutionWorkByChapter: {},
    missingChapterIds: [],
  };
  writePeopleCatalog(catalogFile, catalog);
  assert.equal(readJson(catalogFile).schemaVersion, 2);
  assert.deepEqual(readPeopleCatalog(catalogFile), catalog);

  const siteIndexFile = path.join(directory, 'site-index.json');
  const siteIndex = {
    schemaVersion: 2,
    generatedAt: catalog.generatedAt,
    complete: false,
    currentPromptVersion: 7,
    chapters: {
      'alpha:001': { book: 'alpha', chapter: '001', promptVersion: 7, mentions: [] },
      'beta:001': { book: 'beta', chapter: '001', promptVersion: 7, mentions: [] },
    },
  };
  writePeopleSiteIndex(siteIndexFile, siteIndex);
  assert.equal(readJson(siteIndexFile).schemaVersion, 3);
  assert.deepEqual(readPeopleSiteIndex(siteIndexFile), siteIndex);

  const specialChapter = {
    book: 'special', chapter: '001', mentions: [], unicode: '史記😀\ud800',
    escaped: '\"\\\n\t', omitted: undefined, fn: () => {}, symbol: Symbol('omitted'),
    array: [undefined, , NaN, Infinity, -0, null, {}, []],
    date: new Date('2026-11-18T00:00:00Z'),
    custom: { toJSON(key) { return { key, value: 'converted' }; } },
    boxed: [new Number(3), new String('text'), new Boolean(false)],
    long: '漢😀'.repeat(30_000),
  };
  const specialFile = path.join(directory, 'special.json');
  writePeopleSiteIndex(specialFile, { ...siteIndex, chapters: { 'special:001': specialChapter } });
  const specialPart = readJson(specialFile).shards.chapters[0];
  assert.equal(fs.readFileSync(path.join(directory, specialPart.file), 'utf8'),
    JSON.stringify({ schemaVersion: 1, entries: [['special:001', specialChapter]] }, null, 2) + '\n');
  const specialManifest = fs.readFileSync(specialFile);
  const circular = { book: 'special' }; circular.self = circular;
  assert.throws(() => writePeopleSiteIndex(specialFile, {
    ...siteIndex, generatedAt: '2026-11-18T00:01:00Z', chapters: { 'special:001': circular },
  }), /circular/);
  assert.deepEqual(fs.readFileSync(specialFile), specialManifest, 'failed shard must preserve the published manifest');
  assert.throws(() => writePeopleSiteIndex(specialFile, {
    ...siteIndex, generatedAt: '2026-11-18T00:02:00Z', chapters: { 'special:001': { book: 'special', invalid: Object(1n) } },
  }), /BigInt/);
  assert.deepEqual(fs.readFileSync(specialFile), specialManifest);
  assert.deepEqual(readPeopleSiteIndex(specialFile).chapters, JSON.parse(JSON.stringify({ 'special:001': specialChapter })));
  for (const generation of fs.readdirSync(path.join(directory, 'special-shards'))) {
    assert(!fs.readdirSync(path.join(directory, 'special-shards', generation)).some(name => name.endsWith('.tmp')));
  }

  // Exercise serialization headroom, without loading or copying the corpus.
  // A single ~50 MiB shard must write under a 32 MiB V8 heap using shared text.
  const boundedWriter = spawnSync(process.execPath, ['--max-old-space-size=32', '--input-type=module', '-e', `
    import fs from 'node:fs';
    import path from 'node:path';
    import { writePeopleSiteIndex } from ${JSON.stringify(pathToFileURL(path.resolve('scripts/lib/people-generated-data.mjs')).href)};
    const file = path.join(process.argv[1], 'bounded.json');
    const text = 'x'.repeat(200_000);
    writePeopleSiteIndex(file, { schemaVersion: 2, generatedAt: 'bounded', chapters: {
      'fixture:001': { book: 'fixture', chapter: '001', mentions: Array.from({ length: 256 }, () => ({ en: text })) },
    } });
    const manifest = JSON.parse(fs.readFileSync(file));
    if (fs.statSync(path.join(process.argv[1], manifest.shards.chapters[0].file)).size < 50_000_000) throw Error('Missing bounded output');
  `, directory], { encoding: 'utf8', timeout: 30_000, maxBuffer: 16_384 });
  assert.ifError(boundedWriter.error);
  assert.equal(boundedWriter.status, 0, boundedWriter.stderr);

  const candidatesFile = path.join(directory, 'resolution-candidates.json');
  const candidates = {
    schemaVersion: 1,
    generatedAt: catalog.generatedAt,
    stats: {
      localPeople: 10_001,
      candidateBlocks: 1_001,
      explicitSamePerson: 1,
      explicitDifferentPerson: 1,
    },
    people: Object.fromEntries(
      Array.from({ length: 10_001 }, (_, index) => [`local-${index}`, { id: `local-${index}` }]),
    ),
    blocks: Array.from({ length: 1_001 }, (_, index) => ({ id: `block-${index}` })),
    explicitSamePerson: [{ id: 'same-1' }],
    explicitDifferentPerson: [{ id: 'different-1' }],
  };
  writePeopleResolutionCandidates(candidatesFile, candidates);
  assert.equal(readJson(candidatesFile).schemaVersion, 2);
  assert.deepEqual(readPeopleResolutionCandidates(candidatesFile), candidates);

  const duplicateMapFile = path.join(directory, 'duplicate-map.json');
  const duplicateDirectory = path.join(directory, 'duplicate-map-shards', 'g-fixture');
  fs.mkdirSync(duplicateDirectory, { recursive: true });
  writeJsonAtomic(path.join(duplicateDirectory, 'chapters-0001.json'), {
    schemaVersion: 1,
    entries: [['alpha:001', {}], ['alpha:001', {}]],
  });
  writeJsonAtomic(duplicateMapFile, {
    schemaVersion: 3,
    format: 'sharded-people-site-index',
    chapterCount: 2,
    shards: {
      chapters: [{ file: 'duplicate-map-shards/g-fixture/chapters-0001.json', count: 2 }],
    },
  });
  assert.throws(() => readPeopleSiteIndex(duplicateMapFile), /Duplicate key in sharded map/u);

  const legacyFile = path.join(directory, 'legacy.json');
  writeJsonAtomic(legacyFile, catalog);
  assert.deepEqual(readPeopleCatalog(legacyFile), catalog);

  const firstGeneration = readJson(catalogFile).shards.people[0].file.split('/')[1];
  writePeopleCatalog(catalogFile, {
    ...catalog,
    generatedAt: '2026-09-08T00:01:00.000Z',
  });
  const secondGeneration = readJson(catalogFile).shards.people[0].file.split('/')[1];
  assert.notEqual(firstGeneration, secondGeneration);
  assert.deepEqual(
    fs.readdirSync(path.join(directory, 'catalog-shards')),
    [secondGeneration],
  );
} finally {
  fs.rmSync(directory, { recursive: true, force: true });
}

console.log('people generated-data shard tests: ok');
