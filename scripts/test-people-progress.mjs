#!/usr/bin/env node

import fs from 'node:fs';
import { buildPeopleGlossaryProgress, peopleProgressFromExtraction } from '../generate-progress.js';

const compact = {
  schemaVersion: 2,
  book: 'fixture',
  chapter: '001',
  input: { unitCount: 3 },
  run: { promptVersion: 7 },
  people: [
    ['p001', ['Fan Ye', '范曄', null], 'historical', 'Historian', {}, [[{}, 'explicit', ['s0001']]], [['historian', 'explicit', ['s0001']]]],
    ['p002', ['Caizao', '採藻', null], 'historical', 'Maid', {}, [], [['maid', 'explicit', ['s0002']]]],
  ],
  claims: [
    ['p001', 'attestation', {}, 'explicit', ['s0001']],
    ['p002', 'family-relationship', {}, 'explicit', ['s0002']],
  ],
  translationRepairs: [
    ['s0001', 'idiomatic', 'before', 'after', 'reason', 'high', 'applied'],
    ['s0002', 'idiomatic', 'before', 'after', 'reason', 'medium', 'proposed'],
  ],
};

const current = peopleProgressFromExtraction(compact, 7);
if (current.state !== 'current' || current.peopleRecords !== 2 || current.factClaims !== 5 ||
    current.attestations !== 1 || current.familyRelationships !== 1 ||
    current.appliedTranslationRepairs !== 1 || current.pendingTranslationRepairs !== 1) {
  throw new Error(`Unexpected compact people progress: ${JSON.stringify(current)}`);
}

const legacy = peopleProgressFromExtraction({ ...compact, run: { promptVersion: 6 } }, 7);
if (legacy.state !== 'rereview') throw new Error('Older extraction was not marked for rereview');

const manifest = JSON.parse(fs.readFileSync('./data/manifest.json', 'utf8'));
const corpus = buildPeopleGlossaryProgress(manifest);
const chapterStates = [...corpus.byChapter.values()];
const countedCurrent = chapterStates.filter((chapter) => chapter.state === 'current').length;
const countedRereview = chapterStates.filter((chapter) => chapter.state === 'rereview').length;
const countedMissing = chapterStates.filter((chapter) => chapter.state === 'missing').length;
if (corpus.summary.sourceChapters !== chapterStates.length ||
    corpus.summary.currentChapters !== countedCurrent ||
    corpus.summary.rereviewChapters !== countedRereview ||
    corpus.summary.missingChapters !== countedMissing) {
  throw new Error(`Corpus people progress is inconsistent: ${JSON.stringify(corpus.summary)}`);
}

console.log(
  `people progress tests passed (${countedCurrent} current, ${countedRereview} rereview, ${countedMissing} missing)`,
);
