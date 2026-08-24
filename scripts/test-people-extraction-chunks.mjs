#!/usr/bin/env node

import { buildPeopleChunkWorkerPacket } from './build-people-extraction-packet.mjs';
import { buildInputFingerprint } from './lib/people-content.mjs';
import { buildCompactInput } from './lib/people-compact.mjs';
import {
  assembleCompactPeopleChunks,
  buildPeopleChunkPacket,
  normalizePeopleExtractionChunkPlan,
  peopleChunkRunRecord,
  planPeopleExtractionChunks,
  splitPeopleExtractionChunk,
} from './lib/people-extraction-chunks.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const names = [
  ['甲', 'Alice'],
  ['乙', 'Bob'],
  ['丙', 'Carol'],
  ['丁', 'David'],
  ['戊', 'Eve'],
];
const units = names.map(([zh, en], index) => ({
  id: `s${String(index + 1).padStart(4, '0')}`,
  kind: 'paragraph-sentence',
  blockIndex: Math.floor(index / 2),
  collection: 'sentences',
  itemIndex: index % 2,
  zh: `${zh}來。`,
  en: `${en} came.`,
  literal: `${en} came.`,
}));
const candidates = units.flatMap((unit, index) => [
  {
    id: `fixture:001:cand_${String(index * 2 + 1).padStart(16, '0')}`,
    unit: unit.id,
    language: 'zh',
    exact: names[index][0],
    occurrence: 0,
    startCodePoint: 0,
    endCodePoint: 1,
    detectors: [{ kind: 'fixture' }],
  },
  {
    id: `fixture:001:cand_${String(index * 2 + 2).padStart(16, '0')}`,
    unit: unit.id,
    language: 'en',
    exact: names[index][1],
    occurrence: 0,
    startCodePoint: 0,
    endCodePoint: names[index][1].length,
    detectors: [{ kind: 'fixture' }],
  },
]);
const packet = {
  schemaVersion: 1,
  book: 'fixture',
  chapter: '001',
  source: { path: 'data/fixture/001.json', title: { zh: '測試', en: 'Fixture' } },
  input: buildInputFingerprint(units),
  units,
  preflight: { scannerVersion: 2, candidates },
  context: {
    westernEraStyle: 'BC_AD',
    roles: [{ id: 'named-individual', label: 'Named Individual' }],
    polities: [],
    reigns: [],
  },
};

function compactPart(chunk) {
  const owned = buildPeopleChunkPacket(packet, chunk);
  const people = owned.units.map((unit, index) => {
    const sourceIndex = units.findIndex((item) => item.id === unit.id);
    const [zh, en] = names[sourceIndex];
    const id = `p${String(index + 1).padStart(3, '0')}`;
    return [
      id,
      [en, zh, null],
      'historical',
      'Named Individual',
      { n: [], r: index === 0 && owned.units.length > 1 ? ['p002'] : [], a: [], p: [], x: null },
      [[{ kind: 'personal', en, zh }, 'explicit', [unit.id]]],
      [['named-individual', 'explicit', [unit.id]]],
    ];
  });
  const surfaces = owned.units.flatMap((unit, index) => {
    const sourceIndex = units.findIndex((item) => item.id === unit.id);
    const [zh, en] = names[sourceIndex];
    const person = `p${String(index + 1).padStart(3, '0')}`;
    return [
      [person, 'personal-name', 'zh', zh, [[unit.id, [0]]]],
      [person, 'personal-name', 'en', en, [[unit.id, [0]]]],
    ];
  });
  return {
    schemaVersion: 2,
    book: packet.book,
    chapter: packet.chapter,
    input: buildCompactInput(owned),
    run: { model: 'fixture', promptVersion: 2 },
    people,
    surfaces,
    claims: owned.units.length > 1
      ? [['p001', 'relationship', { kind: 'associate', person: 'p002' }, 'explicit', [owned.units[0].id]]]
      : [],
    translationRepairs: [],
    candidateDispositions: [],
    coverage: {
      allUnitsVisited: true,
      preflightCandidatesAccountedFor: true,
      unresolvedReferences: [],
    },
  };
}

const chunks = planPeopleExtractionChunks(packet, {
  maxUnits: 2,
  maxCandidates: 4,
  contextUnits: 1,
});
if (chunks.length !== 3 || chunks.map((chunk) => chunk.units).join(',') !== '2,2,1') {
  throw new Error(`Unexpected chunk plan: ${JSON.stringify(chunks)}`);
}
const worker = buildPeopleChunkWorkerPacket(packet, chunks[1]);
if (worker.version !== 2 || worker.readOnlyContext.before.length !== 1 || worker.readOnlyContext.after.length !== 1) {
  throw new Error('Chunk worker context was not bounded as expected');
}

const split = splitPeopleExtractionChunk(packet, chunks[0], { contextUnits: 1 });
const adaptive = normalizePeopleExtractionChunkPlan(packet, [
  ...split,
  ...chunks.slice(1),
], { contextUnits: 1 });
if (
  adaptive.length !== 4 ||
  adaptive.map((chunk) => `${chunk.id}:${chunk.start}-${chunk.end}`).join(',') !==
    '001a:0-1,001b:1-2,002:2-4,003:4-5'
) {
  throw new Error(`Adaptive chunk split did not preserve exact coverage: ${JSON.stringify(adaptive)}`);
}
const adaptiveWorker = buildPeopleChunkWorkerPacket(packet, adaptive[1]);
if (adaptiveWorker.scope.start !== 1 || adaptiveWorker.scope.end !== 2 || adaptiveWorker.scope.chunkId !== '001b') {
  throw new Error('Explicit adaptive worker scope was not preserved');
}

const parts = adaptive.map((chunk) => {
  const extraction = compactPart(chunk);
  validateCompactPeopleExtraction(extraction, buildPeopleChunkPacket(packet, chunk));
  return { chunk, extraction };
});
const assembled = assembleCompactPeopleChunks(packet, parts, {
  model: 'fixture-chunked',
  promptVersion: 2,
  agentId: null,
  runId: null,
  completedAt: '2026-08-10T00:00:00.000Z',
  chunks: parts.map(({ chunk, extraction }) => peopleChunkRunRecord(chunk, extraction)),
});
const validated = validateCompactPeopleExtraction(assembled, packet);
if (validated.stats.people !== 5 || assembled.people.at(-1)[0] !== 'p005') {
  throw new Error('Chunk assembly did not rebase all local people contiguously');
}
if (assembled.people[2][4].r[0] !== 'p004' || assembled.claims[0][2].person !== 'p004') {
  throw new Error('Chunk assembly did not rebase nested local-person references');
}
console.log('people extraction chunk self-test: ok (3 chunks, 5 people, complete candidate coverage)');
