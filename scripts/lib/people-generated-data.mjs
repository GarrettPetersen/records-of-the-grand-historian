import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { readJson, writeJsonAtomic } from './people-content.mjs';

const PEOPLE_PER_SHARD = 250;
const FAMILY_EDGES_PER_SHARD = 2_000;
const MAP_ENTRIES_PER_SHARD = 10_000;
const CANDIDATE_BLOCKS_PER_SHARD = 1_000;
const CHAPTERS_PER_SHARD = 32;

function chunks(values, size) {
  const result = [];
  for (let index = 0; index < values.length; index += size) {
    result.push(values.slice(index, index + size));
  }
  return result;
}

function relativeShardPath(file, shardFile) {
  return path.relative(path.dirname(file), shardFile).split(path.sep).join('/');
}

function shardGeneration(file, generatedAt) {
  const stem = path.basename(file, path.extname(file));
  const generation = crypto.createHash('sha256')
    .update(`${generatedAt}:${process.pid}`)
    .digest('hex')
    .slice(0, 16);
  const root = path.join(path.dirname(file), `${stem}-shards`);
  return { root, directory: path.join(root, `g-${generation}`) };
}

function writeArrayShards(file, directory, prefix, values, size) {
  return chunks(values, size).map((items, index) => {
    const shardFile = path.join(directory, `${prefix}-${String(index + 1).padStart(4, '0')}.json`);
    writeJsonAtomic(shardFile, { schemaVersion: 1, items });
    return { file: relativeShardPath(file, shardFile), count: items.length };
  });
}

function writeMapShards(file, directory, prefix, value, size) {
  return chunks(Object.entries(value), size).map((entries, index) => {
    const shardFile = path.join(directory, `${prefix}-${String(index + 1).padStart(4, '0')}.json`);
    writeJsonAtomic(shardFile, { schemaVersion: 1, entries });
    return { file: relativeShardPath(file, shardFile), count: entries.length };
  });
}

function cleanupOldGenerations(root, currentDirectory) {
  if (!fs.existsSync(root)) return;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const directory = path.join(root, entry.name);
    if (directory !== currentDirectory) fs.rmSync(directory, { recursive: true, force: true });
  }
}

function readShard(file, part, key) {
  if (!part?.file || !Number.isInteger(part.count) || part.count < 0) {
    throw new Error(`Invalid ${key} shard descriptor in ${file}`);
  }
  const base = path.resolve(path.dirname(file));
  const shardFile = path.resolve(base, part.file);
  if (!shardFile.startsWith(`${base}${path.sep}`)) {
    throw new Error(`Generated shard escapes its manifest directory: ${part.file}`);
  }
  const shard = readJson(shardFile);
  const values = shard[key];
  if (shard.schemaVersion !== 1 || !Array.isArray(values) || values.length !== part.count) {
    throw new Error(`Invalid or stale generated shard ${shardFile}`);
  }
  return values;
}

function readArrayParts(file, parts, key = 'items') {
  if (!Array.isArray(parts)) throw new Error(`Invalid sharded manifest ${file}`);
  return parts.flatMap((part) => readShard(file, part, key));
}

function readMapParts(file, parts) {
  const entries = readArrayParts(file, parts, 'entries');
  const value = Object.fromEntries(entries);
  if (Object.keys(value).length !== entries.length) {
    throw new Error(`Duplicate key in sharded map ${file}`);
  }
  return value;
}

function assertGeneratedCount(file, label, actual, expected) {
  if (!Number.isInteger(expected) || expected < 0) {
    throw new Error(`Generated manifest ${file} has invalid ${label} count`);
  }
  if (actual !== expected) {
    throw new Error(
      `Generated manifest ${file} expected ${expected} ${label}, hydrated ${actual}`,
    );
  }
}

export function writePeopleCatalog(file, catalog) {
  const { people, familyEdges, localPersonMap, ...metadata } = catalog;
  const generation = shardGeneration(file, catalog.generatedAt);
  fs.mkdirSync(generation.directory, { recursive: true });
  const manifest = {
    ...metadata,
    schemaVersion: 2,
    format: 'sharded-people-catalog',
    shards: {
      people: writeArrayShards(file, generation.directory, 'people', people, PEOPLE_PER_SHARD),
      familyEdges: writeArrayShards(
        file,
        generation.directory,
        'family-edges',
        familyEdges,
        FAMILY_EDGES_PER_SHARD,
      ),
      localPersonMap: writeMapShards(
        file,
        generation.directory,
        'local-person-map',
        localPersonMap,
        MAP_ENTRIES_PER_SHARD,
      ),
    },
  };
  writeJsonAtomic(file, manifest);
  cleanupOldGenerations(generation.root, generation.directory);
}

export function readPeopleCatalog(file) {
  const manifest = readJson(file);
  if (manifest.schemaVersion === 1) return manifest;
  if (manifest.schemaVersion !== 2 || manifest.format !== 'sharded-people-catalog') {
    throw new Error(`Unsupported generated people catalog format in ${file}`);
  }
  const { format, shards, ...metadata } = manifest;
  const people = readArrayParts(file, shards.people);
  const familyEdges = readArrayParts(file, shards.familyEdges);
  const localPersonMap = readMapParts(file, shards.localPersonMap);
  assertGeneratedCount(file, 'canonical people', people.length, metadata.stats?.canonicalPeople);
  assertGeneratedCount(file, 'family edges', familyEdges.length, metadata.stats?.familyEdges);
  assertGeneratedCount(file, 'local people', Object.keys(localPersonMap).length, metadata.stats?.localPeople);
  return {
    ...metadata,
    schemaVersion: 1,
    people,
    familyEdges,
    localPersonMap,
  };
}

export function writePeopleSiteIndex(file, siteIndex) {
  const { chapters, ...metadata } = siteIndex;
  const generation = shardGeneration(file, siteIndex.generatedAt);
  fs.mkdirSync(generation.directory, { recursive: true });
  const byBook = new Map();
  for (const [chapterId, chapter] of Object.entries(chapters)) {
    if (!byBook.has(chapter.book)) byBook.set(chapter.book, {});
    byBook.get(chapter.book)[chapterId] = chapter;
  }
  const chapterShards = [...byBook.entries()].sort(([left], [right]) => left.localeCompare(right))
    .flatMap(([book, records]) => chunks(Object.entries(records), CHAPTERS_PER_SHARD)
      .map((entries, index) => {
        const shardFile = path.join(
          generation.directory,
          `chapters-${book}-${String(index + 1).padStart(4, '0')}.json`,
        );
        writeJsonAtomic(shardFile, { schemaVersion: 1, entries });
        return { file: relativeShardPath(file, shardFile), count: entries.length };
      }));
  writeJsonAtomic(file, {
    ...metadata,
    schemaVersion: 3,
    format: 'sharded-people-site-index',
    chapterCount: Object.keys(chapters).length,
    shards: { chapters: chapterShards },
  });
  cleanupOldGenerations(generation.root, generation.directory);
}

export function readPeopleSiteIndex(file) {
  const manifest = readJson(file);
  if (manifest.schemaVersion === 2) return manifest;
  if (manifest.schemaVersion !== 3 || manifest.format !== 'sharded-people-site-index') {
    throw new Error(`Unsupported generated people site-index format in ${file}`);
  }
  const { format, chapterCount, shards, ...metadata } = manifest;
  const chapters = readMapParts(file, shards.chapters);
  assertGeneratedCount(file, 'chapters', Object.keys(chapters).length, chapterCount);
  return {
    ...metadata,
    schemaVersion: 2,
    chapters,
  };
}

export function writePeopleResolutionCandidates(file, candidates) {
  const {
    people,
    blocks,
    explicitSamePerson,
    explicitDifferentPerson,
    ...metadata
  } = candidates;
  const generation = shardGeneration(file, candidates.generatedAt);
  fs.mkdirSync(generation.directory, { recursive: true });
  writeJsonAtomic(file, {
    ...metadata,
    schemaVersion: 2,
    format: 'sharded-people-resolution-candidates',
    shards: {
      people: writeMapShards(
        file,
        generation.directory,
        'people',
        people,
        MAP_ENTRIES_PER_SHARD,
      ),
      blocks: writeArrayShards(
        file,
        generation.directory,
        'blocks',
        blocks,
        CANDIDATE_BLOCKS_PER_SHARD,
      ),
      explicitSamePerson: writeArrayShards(
        file,
        generation.directory,
        'explicit-same-person',
        explicitSamePerson,
        CANDIDATE_BLOCKS_PER_SHARD,
      ),
      explicitDifferentPerson: writeArrayShards(
        file,
        generation.directory,
        'explicit-different-person',
        explicitDifferentPerson,
        CANDIDATE_BLOCKS_PER_SHARD,
      ),
    },
  });
  cleanupOldGenerations(generation.root, generation.directory);
}

export function readPeopleResolutionCandidates(file) {
  const manifest = readJson(file);
  if (manifest.schemaVersion === 1) return manifest;
  if (manifest.schemaVersion !== 2 || manifest.format !== 'sharded-people-resolution-candidates') {
    throw new Error(`Unsupported generated people resolution-candidate format in ${file}`);
  }
  const { format, shards, ...metadata } = manifest;
  const people = readMapParts(file, shards.people);
  const blocks = readArrayParts(file, shards.blocks);
  const explicitSamePerson = readArrayParts(file, shards.explicitSamePerson);
  const explicitDifferentPerson = readArrayParts(file, shards.explicitDifferentPerson);
  assertGeneratedCount(file, 'candidate people', Object.keys(people).length, metadata.stats?.localPeople);
  assertGeneratedCount(file, 'candidate blocks', blocks.length, metadata.stats?.candidateBlocks);
  assertGeneratedCount(
    file,
    'explicit same-person assertions',
    explicitSamePerson.length,
    metadata.stats?.explicitSamePerson,
  );
  assertGeneratedCount(
    file,
    'explicit different-person assertions',
    explicitDifferentPerson.length,
    metadata.stats?.explicitDifferentPerson,
  );
  return {
    ...metadata,
    schemaVersion: 1,
    people,
    blocks,
    explicitSamePerson,
    explicitDifferentPerson,
  };
}
