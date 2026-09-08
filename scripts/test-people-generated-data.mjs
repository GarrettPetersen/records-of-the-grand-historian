#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
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
