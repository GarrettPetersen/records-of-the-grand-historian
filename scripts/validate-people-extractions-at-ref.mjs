#!/usr/bin/env node

import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction, validatePeopleExtraction } from './validate-people-extraction.mjs';
import { buildCompactInput, isCompactPeopleExtraction, serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';

const PACKET_DEPENDENCIES = [
  'data/glossary.json',
  'data/people/config.json',
  'data/people/curation/role-vocabulary.json',
];

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

function usage() {
  console.log('Usage: node scripts/validate-people-extractions-at-ref.mjs --ref GIT_REF [--out PATH] [--repair-input-dir DIR]');
}

function parseArgs(argv) {
  let ref = null;
  let out = null;
  let repairInputDir = null;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--ref') ref = argv[++index];
    else if (arg === '--out') out = argv[++index];
    else if (arg === '--repair-input-dir') repairInputDir = argv[++index];
    else if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else throw new Error(`Unknown option: ${arg}`);
  }
  if (!ref) throw new Error('--ref is required');
  return { ref, out, repairInputDir };
}

function assertPacketDependenciesMatch(ref) {
  const status = spawnSync('git', ['diff', '--quiet', ref, '--', ...PACKET_DEPENDENCIES]).status;
  if (status === 0) return;
  throw new Error(
    `Cannot validate ${ref} with the current packet builder: packet dependencies differ (${PACKET_DEPENDENCIES.join(', ')})`,
  );
}

function extractionFiles(ref) {
  return git(['ls-tree', '-r', '--name-only', ref, '--', 'data/people/extractions'])
    .trim().split('\n').filter(Boolean);
}

function parseScope(file) {
  const parts = file.split('/');
  const book = parts.at(-2);
  const chapterFile = parts.at(-1);
  if (!book || !/^\d{3}\.json$/u.test(chapterFile)) throw new Error(`Unexpected extraction path ${file}`);
  return { book, chapter: chapterFile.slice(0, -5), chapterFile };
}

function loadAtRef(ref, file, matcher) {
  const { book, chapter, chapterFile } = parseScope(file);
  const raw = JSON.parse(git(['show', `${ref}:${file}`]));
  const sourcePath = `data/${book}/${chapterFile}`;
  const chapterData = JSON.parse(git(['show', `${ref}:${sourcePath}`]));
  const packet = buildPeopleExtractionPacket(book, chapter, {
    chapterData,
    chapterFile: path.resolve(sourcePath),
    properNounMatcher: matcher,
  });
  return { raw, packet };
}

function validateAtRef(ref, file, matcher) {
  const { raw, packet } = loadAtRef(ref, file, matcher);
  const result = isCompactPeopleExtraction(raw)
    ? validateCompactPeopleExtraction(raw, packet)
    : validatePeopleExtraction(raw, packet);
  return result.stats;
}

const { ref, out, repairInputDir } = parseArgs(process.argv.slice(2));
assertPacketDependenciesMatch(ref);
const matcher = loadProperNounMatcher();
const failures = [];
let checked = 0;
for (const file of extractionFiles(ref)) {
  try {
    const { raw, packet } = loadAtRef(ref, file, matcher);
    (isCompactPeopleExtraction(raw) ? validateCompactPeopleExtraction : validatePeopleExtraction)(raw, packet);
    checked += 1;
  } catch (error) {
    let repaired = false;
    try {
      const { raw, packet } = loadAtRef(ref, file, matcher);
      if (!repairInputDir || !isCompactPeopleExtraction(raw)) throw error;
      const candidate = { ...raw, input: buildCompactInput(packet) };
      validateCompactPeopleExtraction(candidate, packet);
      const output = path.join(repairInputDir, file);
      fs.mkdirSync(path.dirname(output), { recursive: true });
      fs.writeFileSync(output, serializeCompactPeopleExtraction(candidate));
      checked += 1;
      repaired = true;
    } catch {
      // Report the original failure below; a fingerprint change must never mask another defect.
    }
    if (repaired) continue;
    failures.push({
      file,
      error: String(error?.message ?? error).split('\n').slice(0, 8).join('\n'),
    });
  }
}
const report = JSON.stringify({ ref, checked, failures }, null, 2);
if (out) fs.writeFileSync(out, `${report}\n`);
console.log(report);
if (failures.length) process.exitCode = 1;
