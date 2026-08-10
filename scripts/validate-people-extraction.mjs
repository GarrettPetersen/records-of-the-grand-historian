#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import {
  PEOPLE_DIR,
  REPO_ROOT,
  exactSpanAt,
  normalizedChapterId,
  readJson,
  writeJsonAtomic,
} from './lib/people-content.mjs';
import { createPeopleSchemaValidator, formatSchemaErrors } from './lib/people-schema.mjs';

const EXTRACTION_SCHEMA_ID = 'https://24histories.com/schema/people/extraction-v1.json';
const PACKET_SCHEMA_ID = 'https://24histories.com/schema/people/extraction-packet-v1.json';
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

export class PeopleExtractionValidationError extends Error {
  constructor(errors) {
    super(`Person extraction validation failed:\n${errors.map((error) => `- ${error}`).join('\n')}`);
    this.name = 'PeopleExtractionValidationError';
    this.errors = errors;
  }
}

function deepEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function uniqueIds(items, label, errors, idKey = 'id') {
  const seen = new Set();
  for (const item of items) {
    const id = item[idKey];
    if (seen.has(id)) errors.push(`duplicate ${label} ID ${id}`);
    seen.add(id);
  }
  return seen;
}

function requireOrderedIds(items, prefix, digits, label, errors, idKey = 'id') {
  for (const [index, item] of items.entries()) {
    const expected = `${prefix}${String(index + 1).padStart(digits, '0')}`;
    if (item[idKey] !== expected) errors.push(`${label} ${index + 1} must have ID ${expected}, found ${item[idKey]}`);
  }
}

function nestedValuesWithKey(value, wantedKey, found = []) {
  if (Array.isArray(value)) {
    for (const item of value) nestedValuesWithKey(item, wantedKey, found);
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      if (key === wantedKey) found.push(item);
      nestedValuesWithKey(item, wantedKey, found);
    }
  }
  return found;
}

function validateClaimVocabulary(claim, packet, errors) {
  if (claim.predicate === 'role') {
    const roleId = claim.value?.roleId;
    const known = new Set(packet.context.roles.map((role) => role.id));
    if (!known.has(roleId)) errors.push(`${claim.id} uses unknown roleId ${JSON.stringify(roleId)}`);
  }
  for (const polityId of nestedValuesWithKey(claim.value, 'polityId')) {
    if (!packet.context.polities.some((polity) => polity.id === polityId)) {
      errors.push(`${claim.id} uses polityId ${JSON.stringify(polityId)} not supplied in its packet`);
    }
  }
  for (const reignId of nestedValuesWithKey(claim.value, 'reignId')) {
    if (!packet.context.reigns.some((reign) => reign.id === reignId)) {
      errors.push(`${claim.id} uses reignId ${JSON.stringify(reignId)} not supplied in its packet`);
    }
  }
}

export function validatePeopleExtraction(extraction, packet) {
  const errors = [];
  const ajv = createPeopleSchemaValidator();
  const validatePacket = ajv.getSchema(PACKET_SCHEMA_ID);
  const validateExtraction = ajv.getSchema(EXTRACTION_SCHEMA_ID);
  if (!validatePacket(packet)) {
    errors.push(...formatSchemaErrors(validatePacket.errors).map((error) => `packet schema: ${error}`));
  }
  if (!validateExtraction(extraction)) {
    errors.push(...formatSchemaErrors(validateExtraction.errors).map((error) => `extraction schema: ${error}`));
  }
  if (errors.length > 0) throw new PeopleExtractionValidationError(errors);

  const normalized = structuredClone(extraction);
  const namespace = `${packet.book}:${packet.chapter}`;
  if (normalized.book !== packet.book || normalized.chapter !== packet.chapter) {
    errors.push(`extraction scope ${normalized.book}/${normalized.chapter} does not match packet ${packet.book}/${packet.chapter}`);
  }
  if (!deepEqual(normalized.input, packet.input)) {
    errors.push('input fingerprints or unit digests do not exactly match the current packet');
  }

  const unitById = new Map(packet.units.map((unit) => [unit.id, unit]));
  const personIds = uniqueIds(normalized.people, 'local person', errors, 'localId');
  uniqueIds(normalized.mentions, 'mention', errors);
  uniqueIds(normalized.claims, 'claim', errors);
  uniqueIds(normalized.translationRepairs, 'translation repair', errors);
  requireOrderedIds(normalized.people, `${namespace}:p`, 3, 'local person', errors, 'localId');
  requireOrderedIds(normalized.mentions, `${namespace}:m`, 4, 'mention', errors);
  requireOrderedIds(normalized.claims, `${namespace}:c`, 4, 'claim', errors);
  requireOrderedIds(normalized.translationRepairs, `${namespace}:r`, 4, 'translation repair', errors);

  for (const person of normalized.people) {
    const suggestedName = person.preferredNameSuggestion;
    if (![suggestedName.en, suggestedName.zh].some((value) => typeof value === 'string' && value.trim())) {
      errors.push(`${person.localId} has no nonempty English or Chinese preferred-name suggestion`);
    }
    for (const related of person.identityHints.relatedLocalPeople) {
      if (!personIds.has(related)) errors.push(`${person.localId} refers to unknown related local person ${related}`);
    }
  }

  const candidateById = new Map(packet.preflight.candidates.map((candidate) => [candidate.id, candidate]));
  const accountedCandidates = new Map();
  const intervals = new Map();
  const mentionsByPerson = new Map();

  for (const mention of normalized.mentions) {
    if (!personIds.has(mention.person)) errors.push(`${mention.id} refers to unknown local person ${mention.person}`);
    mentionsByPerson.set(mention.person, (mentionsByPerson.get(mention.person) ?? 0) + 1);
    const currentUnit = unitById.get(mention.unit.id);
    if (!currentUnit) {
      errors.push(`${mention.id} refers to missing unit ${mention.unit.id}`);
      continue;
    }
    for (const key of ['kind', 'blockIndex', 'collection', 'itemIndex']) {
      if (mention.unit[key] !== currentUnit[key]) {
        errors.push(`${mention.id} unit ${key} is stale: expected ${currentUnit[key]}, found ${mention.unit[key]}`);
      }
    }

    let spanCount = 0;
    for (const language of ['zh', 'en']) {
      const text = currentUnit[language];
      for (const [spanIndex, span] of mention.spans[language].entries()) {
        spanCount += 1;
        try {
          const located = exactSpanAt(text, span.exact, span.occurrence);
          mention.spans[language][spanIndex] = located;
          const intervalKey = `${currentUnit.id}:${language}`;
          const existing = intervals.get(intervalKey) ?? [];
          for (const other of existing) {
            if (located.startCodePoint < other.endCodePoint && other.startCodePoint < located.endCodePoint) {
              errors.push(`${mention.id} ${language} span overlaps ${other.mentionId} in unit ${currentUnit.id}`);
            }
          }
          existing.push({ ...located, mentionId: mention.id });
          intervals.set(intervalKey, existing);
        } catch (error) {
          errors.push(`${mention.id} ${language} span ${spanIndex}: ${error.message}`);
        }
      }
    }
    if (spanCount === 0) errors.push(`${mention.id} has no Chinese or English span`);

    for (const candidateId of mention.candidateRefs) {
      const candidate = candidateById.get(candidateId);
      if (!candidate) {
        errors.push(`${mention.id} refers to unknown candidate ${candidateId}`);
        continue;
      }
      if (accountedCandidates.has(candidateId)) {
        errors.push(`${candidateId} is accounted for more than once (${accountedCandidates.get(candidateId)} and ${mention.id})`);
        continue;
      }
      accountedCandidates.set(candidateId, mention.id);
      if (candidate.unit !== currentUnit.id) {
        errors.push(`${mention.id} candidate ${candidateId} belongs to unit ${candidate.unit}, not ${currentUnit.id}`);
      }
      const containingSpan = mention.spans[candidate.language].some((span) =>
        span.startCodePoint <= candidate.startCodePoint && span.endCodePoint >= candidate.endCodePoint
      );
      if (!containingSpan) {
        errors.push(`${mention.id} does not contain its ${candidate.language} candidate ${candidateId} within a mention span`);
      }
    }
  }

  for (const person of normalized.people) {
    if (!mentionsByPerson.has(person.localId) && !person.mentionException) {
      errors.push(`${person.localId} has no mention and no explicit mentionException`);
    }
  }

  for (const disposition of normalized.candidateDispositions) {
    const candidateId = disposition.candidate;
    if (!candidateById.has(candidateId)) {
      errors.push(`candidate disposition refers to unknown candidate ${candidateId}`);
      continue;
    }
    if (accountedCandidates.has(candidateId)) {
      errors.push(`${candidateId} is accounted for more than once (${accountedCandidates.get(candidateId)} and disposition)`);
      continue;
    }
    accountedCandidates.set(candidateId, 'disposition');
    if (disposition.reason === 'other' && !disposition.note) {
      errors.push(`${candidateId} uses disposition reason "other" without a note`);
    }
  }
  for (const candidateId of candidateById.keys()) {
    if (!accountedCandidates.has(candidateId)) errors.push(`preflight candidate ${candidateId} is not accounted for`);
  }

  const evidencePrefix = `${namespace}:`;
  const claimsByPerson = new Map();
  for (const claim of normalized.claims) {
    if (!personIds.has(claim.subject)) errors.push(`${claim.id} refers to unknown subject ${claim.subject}`);
    if (!claimsByPerson.has(claim.subject)) claimsByPerson.set(claim.subject, []);
    claimsByPerson.get(claim.subject).push(claim);
    for (const evidence of claim.evidence) {
      if (!evidence.startsWith(evidencePrefix)) {
        errors.push(`${claim.id} evidence ${evidence} is outside assigned chapter ${namespace}`);
        continue;
      }
      const unitId = evidence.slice(evidencePrefix.length);
      if (!unitById.has(unitId)) errors.push(`${claim.id} evidence refers to missing unit ${evidence}`);
    }
    validateClaimVocabulary(claim, packet, errors);
  }
  for (const person of normalized.people) {
    const personClaims = claimsByPerson.get(person.localId) ?? [];
    if (!personClaims.some((claim) => claim.predicate === 'name')) {
      errors.push(`${person.localId} has no name claim`);
    }
    if (!personClaims.some((claim) => claim.predicate === 'role')) {
      errors.push(`${person.localId} has no role claim; use named-individual when the chapter establishes no narrower role`);
    }
  }

  const repairedFields = new Set();
  for (const repair of normalized.translationRepairs) {
    const currentUnit = unitById.get(repair.unit.id);
    if (!currentUnit) {
      errors.push(`${repair.id} refers to missing unit ${repair.unit.id}`);
      continue;
    }
    for (const key of ['kind', 'blockIndex', 'collection', 'itemIndex']) {
      if (repair.unit[key] !== currentUnit[key]) {
        errors.push(`${repair.id} unit ${key} is stale: expected ${currentUnit[key]}, found ${repair.unit[key]}`);
      }
    }
    const fieldKey = repair.field === 'idiomatic' ? 'en' : 'literal';
    const repairKey = `${repair.unit.id}:${repair.field}`;
    if (repairedFields.has(repairKey)) errors.push(`${repair.id} duplicates a repair for ${repairKey}`);
    repairedFields.add(repairKey);
    if (repair.before === repair.after) errors.push(`${repair.id} replacement is identical to its original text`);
    const expected = repair.status === 'applied' ? repair.after : repair.before;
    if (currentUnit[fieldKey] !== expected) {
      errors.push(
        `${repair.id} ${repair.status} ${repair.field} text does not match packet unit ${repair.unit.id}`,
      );
    }
  }

  if (errors.length > 0) throw new PeopleExtractionValidationError(errors);
  return {
    normalized,
    stats: {
      units: packet.units.length,
      candidates: packet.preflight.candidates.length,
      people: normalized.people.length,
      mentions: normalized.mentions.length,
      claims: normalized.claims.length,
      repairs: normalized.translationRepairs.length,
      dispositions: normalized.candidateDispositions.length,
    },
  };
}

function usage() {
  console.log(`Usage:
  node scripts/validate-people-extraction.mjs PATH [--packet PATH] [--normalize] [--out PATH]
  node scripts/validate-people-extraction.mjs --all
  node scripts/validate-people-extraction.mjs --self-test

The default packet is rebuilt from the current chapter, making stale input fail.
--normalize writes host-computed span offsets and hashes to --out or back to PATH.`);
}

function parseArgs(argv) {
  const opts = { file: null, packet: null, normalize: false, out: null, all: false, selfTest: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => {
      const value = argv[++index];
      if (!value || value.startsWith('--')) throw new Error(`${arg} requires a value`);
      return value;
    };
    if (arg === '--packet') opts.packet = path.resolve(REPO_ROOT, next());
    else if (arg === '--normalize') opts.normalize = true;
    else if (arg === '--out') opts.out = path.resolve(REPO_ROOT, next());
    else if (arg === '--all') opts.all = true;
    else if (arg === '--self-test') opts.selfTest = true;
    else if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else if (!arg.startsWith('--') && !opts.file) opts.file = path.resolve(REPO_ROOT, arg);
    else throw new Error(`Unknown option: ${arg}`);
  }
  return opts;
}

function extractionFiles() {
  const root = path.join(PEOPLE_DIR, 'extractions');
  if (!fs.existsSync(root)) return [];
  const files = [];
  for (const book of fs.readdirSync(root).sort()) {
    const directory = path.join(root, book);
    if (!fs.statSync(directory).isDirectory()) continue;
    for (const name of fs.readdirSync(directory).filter((file) => /^\d{3}\.json$/u.test(file)).sort()) {
      files.push(path.join(directory, name));
    }
  }
  return files;
}

function validateFile(file, opts) {
  const extraction = readJson(file);
  const packet = opts.packet
    ? readJson(opts.packet)
    : buildPeopleExtractionPacket(extraction.book, normalizedChapterId(extraction.chapter));
  const result = validatePeopleExtraction(extraction, packet);
  if (opts.normalize) writeJsonAtomic(opts.out ?? file, result.normalized);
  console.log(
    `${path.relative(REPO_ROOT, file)}: ok (${result.stats.people} people, ` +
    `${result.stats.mentions} mentions, ${result.stats.claims} claims, ${result.stats.candidates} candidates)`,
  );
  return result;
}

function selfTest() {
  const input = {
    unitCount: 1,
    chapterFingerprint: `sha256:${'1'.repeat(64)}`,
    chineseFingerprint: `sha256:${'2'.repeat(64)}`,
    englishFingerprint: `sha256:${'3'.repeat(64)}`,
    unitDigests: [{
      id: 's0001',
      zh: `sha256:${'4'.repeat(64)}`,
      en: `sha256:${'5'.repeat(64)}`,
      literal: `sha256:${'6'.repeat(64)}`,
    }],
  };
  const locator = { id: 's0001', kind: 'paragraph-sentence', blockIndex: 0, collection: 'sentences', itemIndex: 0 };
  const packet = {
    schemaVersion: 1,
    book: 'testbook',
    chapter: '001',
    source: { path: 'data/testbook/001.json', title: { zh: '', en: '' } },
    input,
    units: [{ ...locator, zh: '艾麗絲來。', en: 'Alice came.', literal: 'Alice came.' }],
    preflight: {
      scannerVersion: 1,
      candidates: [
        { id: 'testbook:001:cand_1111111111111111', unit: 's0001', language: 'zh', exact: '艾麗絲', occurrence: 0, startCodePoint: 0, endCodePoint: 3, detectors: [{ kind: 'fixture' }] },
        { id: 'testbook:001:cand_2222222222222222', unit: 's0001', language: 'en', exact: 'Alice', occurrence: 0, startCodePoint: 0, endCodePoint: 5, detectors: [{ kind: 'fixture' }] },
      ],
    },
    context: { westernEraStyle: 'BC_AD', roles: [{ id: 'official', label: 'Official' }], polities: [], reigns: [] },
  };
  const extraction = {
    schemaVersion: 1,
    book: 'testbook',
    chapter: '001',
    input,
    run: { model: 'fixture', promptVersion: 2 },
    people: [{
      localId: 'testbook:001:p001',
      preferredNameSuggestion: { en: 'Alice', zh: '艾麗絲' },
      historicity: 'historical',
      descriptorSuggestion: 'Official',
      identityHints: { nativePlaces: [], relatedLocalPeople: [], activeDateHints: [] },
    }],
    mentions: [{
      id: 'testbook:001:m0001',
      person: 'testbook:001:p001',
      unit: locator,
      kind: 'personal-name',
      spans: { zh: [{ exact: '艾麗絲', occurrence: 0 }], en: [{ exact: 'Alice', occurrence: 0 }] },
      candidateRefs: ['testbook:001:cand_1111111111111111', 'testbook:001:cand_2222222222222222'],
    }],
    claims: [{
      id: 'testbook:001:c0001',
      subject: 'testbook:001:p001',
      predicate: 'name',
      value: { kind: 'personal', en: 'Alice', zh: '艾麗絲' },
      certainty: 'explicit',
      evidence: ['testbook:001:s0001'],
    }, {
      id: 'testbook:001:c0002',
      subject: 'testbook:001:p001',
      predicate: 'role',
      value: { roleId: 'official' },
      certainty: 'explicit',
      evidence: ['testbook:001:s0001'],
    }],
    translationRepairs: [],
    candidateDispositions: [],
    coverage: { allUnitsVisited: true, preflightCandidatesAccountedFor: true, unresolvedReferences: [] },
  };

  const valid = validatePeopleExtraction(extraction, packet);
  if (valid.normalized.mentions[0].spans.zh[0].endCodePoint !== 3) throw new Error('Span normalization failed');

  const stale = structuredClone(extraction);
  stale.mentions[0].spans.en[0].exact = 'Alicia';
  try {
    validatePeopleExtraction(stale, packet);
    throw new Error('Stale span fixture unexpectedly passed');
  } catch (error) {
    if (!error.message.includes('Could not find occurrence')) throw error;
  }

  const overlapping = structuredClone(extraction);
  overlapping.mentions.push({
    ...structuredClone(overlapping.mentions[0]),
    id: 'testbook:001:m0002',
    candidateRefs: [],
  });
  try {
    validatePeopleExtraction(overlapping, packet);
    throw new Error('Overlap fixture unexpectedly passed');
  } catch (error) {
    if (!error.message.includes('overlaps')) throw error;
  }

  const unaccounted = structuredClone(extraction);
  unaccounted.mentions[0].candidateRefs = ['testbook:001:cand_1111111111111111'];
  try {
    validatePeopleExtraction(unaccounted, packet);
    throw new Error('Unaccounted candidate fixture unexpectedly passed');
  } catch (error) {
    if (!error.message.includes('is not accounted for')) throw error;
  }
  console.log('validate-people-extraction self-test: ok');
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.selfTest) return selfTest();
  if (opts.all) {
    const files = extractionFiles();
    for (const file of files) validateFile(file, opts);
    console.log(`Validated ${files.length} person extraction file(s).`);
    return;
  }
  if (!opts.file) throw new Error('Provide an extraction file, --all, or --self-test');
  validateFile(opts.file, opts);
}

if (isMain) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
