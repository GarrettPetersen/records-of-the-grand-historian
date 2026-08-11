#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildPeopleChunkWorkerPacket,
  buildPeopleExtractionPacket,
  buildPeopleWorkerPacket,
} from './build-people-extraction-packet.mjs';
import { buildPeopleChunkPacket } from './lib/people-extraction-chunks.mjs';
import {
  PEOPLE_DIR,
  REPO_ROOT,
  exactSpanAt,
  normalizedChapterId,
  readJson,
  writeTextAtomic,
  writeJsonAtomic,
} from './lib/people-content.mjs';
import { createPeopleSchemaValidator, formatSchemaErrors } from './lib/people-schema.mjs';
import {
  compactInputErrors,
  expandPeopleExtraction,
  isCompactPeopleExtraction,
  serializeCompactPeopleExtraction,
} from './lib/people-compact.mjs';

const EXTRACTION_SCHEMA_ID = 'https://24histories.com/schema/people/extraction-v1.json';
const PACKET_SCHEMA_ID = 'https://24histories.com/schema/people/extraction-packet-v1.json';
const COMPACT_SCHEMA_ID = 'https://24histories.com/schema/people/compact-extraction-v2.json';
const V6_COMPLETION_FLAGS = [
  'allNamedPeopleAndMentionsCaptured',
  'allDurableFactsCaptured',
  'allChronologyCaptured',
  'editorialPassCompleted',
];
const V7_COMPLETION_FLAGS = [
  ...V6_COMPLETION_FLAGS,
  'allPersonEventsCaptured',
  'allClaimProvenanceCaptured',
  'allFamilyRelationshipsCaptured',
];
const FAMILY_RELATIONS = new Set([
  'parent-of',
  'child-of',
  'sibling-of',
  'spouse-of',
  'betrothed-to',
  'ancestor-of',
  'descendant-of',
  'kin-of',
]);
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

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function normalizeClaims(claims, namespace) {
  const merged = [];
  const byFact = new Map();
  for (const original of claims) {
    const claim = structuredClone(original);
    if (claim.predicate === 'role') claim.value = { roleId: claim.value.roleId };
    const key = canonicalJson([claim.subject, claim.predicate, claim.value, claim.certainty]);
    const existing = byFact.get(key);
    if (existing) {
      existing.evidence = [...new Set([...existing.evidence, ...claim.evidence])];
      continue;
    }
    byFact.set(key, claim);
    merged.push(claim);
  }
  for (const [index, claim] of merged.entries()) {
    claim.id = `${namespace}:c${String(index + 1).padStart(4, '0')}`;
  }
  return merged;
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

function nestedPersonReferences(value, found = []) {
  if (Array.isArray(value)) {
    for (const item of value) nestedPersonReferences(item, found);
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      if (/personId$/iu.test(key)) found.push([key, item]);
      if (/personIds$/iu.test(key)) {
        if (Array.isArray(item)) {
          for (const personId of item) found.push([key, personId]);
        } else {
          found.push([key, item]);
        }
      }
      nestedPersonReferences(item, found);
    }
  }
  return found;
}

function validateWesternYear(value, label, errors) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    errors.push(`${label} must be an object`);
    return;
  }
  if (!['BC', 'AD'].includes(value.era)) errors.push(`${label}.era must be BC or AD`);
  if (!Number.isInteger(value.year) || value.year < 1) {
    errors.push(`${label}.year must be a positive integer`);
  }
  if (!['year', 'circa'].includes(value.precision)) {
    errors.push(`${label}.precision must be year or circa`);
  }
}

function validateAttestationClaim(claim, errors) {
  const value = claim.value;
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    errors.push(`${claim.id} attestation value must be an object`);
    return;
  }
  const allowedKeys = new Set([
    'sourceDate',
    'westernYear',
    'westernInterval',
    'qualitative',
    'unresolved',
  ]);
  for (const key of Object.keys(value)) {
    if (!allowedKeys.has(key)) errors.push(`${claim.id} attestation has unknown key ${key}`);
  }
  if (value.sourceDate !== undefined) {
    if (!value.sourceDate || typeof value.sourceDate !== 'object' || Array.isArray(value.sourceDate)) {
      errors.push(`${claim.id} sourceDate must be an object`);
    } else {
      if (typeof value.sourceDate.text !== 'string' || !value.sourceDate.text.trim()) {
        errors.push(`${claim.id} sourceDate.text must be nonempty`);
      }
      if (value.sourceDate.regnalYear !== undefined &&
          (!Number.isInteger(value.sourceDate.regnalYear) || value.sourceDate.regnalYear < 1)) {
        errors.push(`${claim.id} sourceDate.regnalYear must be a positive integer`);
      }
    }
  }
  if (value.westernYear !== undefined) {
    validateWesternYear(value.westernYear, `${claim.id} westernYear`, errors);
  }
  if (value.westernInterval !== undefined) {
    if (!value.westernInterval || typeof value.westernInterval !== 'object' ||
        Array.isArray(value.westernInterval)) {
      errors.push(`${claim.id} westernInterval must be an object`);
    } else {
      validateWesternYear(value.westernInterval.start, `${claim.id} westernInterval.start`, errors);
      validateWesternYear(value.westernInterval.end, `${claim.id} westernInterval.end`, errors);
    }
  }
  if (value.qualitative !== undefined &&
      (typeof value.qualitative !== 'string' || !value.qualitative.trim())) {
    errors.push(`${claim.id} qualitative chronology must be nonempty`);
  }
  if (value.unresolved !== undefined && typeof value.unresolved !== 'boolean') {
    errors.push(`${claim.id} unresolved must be boolean`);
  }
  if (value.westernYear !== undefined && value.westernInterval !== undefined) {
    errors.push(`${claim.id} must use westernYear or westernInterval, not both`);
  }
  const hasResolvedTime = value.westernYear !== undefined ||
    value.westernInterval !== undefined || value.qualitative !== undefined;
  if (!hasResolvedTime && !(value.sourceDate && value.unresolved === true)) {
    errors.push(`${claim.id} attestation needs a Western date, qualitative chronology, or unresolved sourceDate`);
  }
  if ((value.westernYear !== undefined || value.westernInterval !== undefined) && !value.sourceDate) {
    errors.push(`${claim.id} Western attestation must preserve sourceDate`);
  }
}

function validateClaimVocabulary(claim, packet, errors) {
  if (claim.predicate === 'role') {
    const roleId = claim.value?.roleId;
    const known = new Set(packet.context.roles.map((role) => role.id));
    if (!known.has(roleId)) errors.push(`${claim.id} uses unknown roleId ${JSON.stringify(roleId)}`);
  }
  if (claim.predicate === 'attestation') validateAttestationClaim(claim, errors);
  if (claim.predicate === 'assessment' &&
      (!claim.value?.provenance || typeof claim.value.provenance !== 'object' ||
       typeof claim.value.provenance.mode !== 'string' || !claim.value.provenance.mode.trim())) {
    errors.push(`${claim.id} assessment requires provenance.mode`);
  }
  if (claim.value?.provenance !== undefined &&
      (!claim.value.provenance || typeof claim.value.provenance !== 'object' ||
       Array.isArray(claim.value.provenance) || typeof claim.value.provenance.mode !== 'string' ||
       !claim.value.provenance.mode.trim())) {
    errors.push(`${claim.id} provenance must be an object with a nonempty mode`);
  }
  for (const negated of nestedValuesWithKey(claim.value, 'negated')) {
    if (typeof negated !== 'boolean') errors.push(`${claim.id} negated must be boolean`);
  }
  if (claim.predicate === 'event-participation') {
    if (typeof claim.value?.kind !== 'string' || !claim.value.kind.trim()) {
      errors.push(`${claim.id} event-participation requires a nonempty kind`);
    }
    if (![claim.value?.role, claim.value?.action].some((item) => typeof item === 'string' && item.trim())) {
      errors.push(`${claim.id} event-participation requires a role or action`);
    }
  }
  if (claim.predicate === 'family-relationship') {
    if (!FAMILY_RELATIONS.has(claim.value?.relation)) {
      errors.push(`${claim.id} family-relationship uses unknown relation ${JSON.stringify(claim.value?.relation)}`);
    }
    if (typeof claim.value?.personId !== 'string') {
      errors.push(`${claim.id} family-relationship requires personId`);
    } else if (claim.value.personId === claim.subject) {
      errors.push(`${claim.id} family-relationship cannot link a person to itself`);
    }
    if (claim.value?.generationDistance !== undefined &&
        (!Number.isInteger(claim.value.generationDistance) || claim.value.generationDistance < 1)) {
      errors.push(`${claim.id} generationDistance must be a positive integer`);
    }
  }
  if (claim.predicate === 'family-summary') {
    if (typeof claim.value?.kinshipRole !== 'string' || !claim.value.kinshipRole.trim()) {
      errors.push(`${claim.id} family-summary requires kinshipRole`);
    }
    if (claim.value?.count !== undefined &&
        (!Number.isInteger(claim.value.count) || claim.value.count < 0)) {
      errors.push(`${claim.id} family-summary count must be a nonnegative integer`);
    }
    if (claim.value?.count === undefined &&
        (typeof claim.value?.quantity !== 'string' || !claim.value.quantity.trim())) {
      errors.push(`${claim.id} family-summary requires count or quantity`);
    }
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
  const personById = new Map(normalized.people.map((person) => [person.localId, person]));
  uniqueIds(normalized.mentions, 'mention', errors);
  uniqueIds(normalized.claims, 'claim', errors);
  normalized.claims = normalizeClaims(normalized.claims, namespace);
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
    if (normalized.run.promptVersion >= 6) {
      for (const key of ['dateContext', 'startDate', 'endDate']) {
        for (const value of nestedValuesWithKey(claim.value, key)) {
          validateAttestationClaim({ id: `${claim.id} ${key}`, value }, errors);
        }
      }
      if (['same-person', 'different-person'].includes(claim.predicate)) {
        if (typeof claim.value?.personId !== 'string') {
          errors.push(`${claim.id} ${claim.predicate} value must name the other local person in value.personId`);
        } else if (!personIds.has(claim.value.personId)) {
          errors.push(`${claim.id} ${claim.predicate} refers to unknown local person ${claim.value.personId}`);
        } else if (claim.value.personId === claim.subject) {
          errors.push(`${claim.id} ${claim.predicate} cannot refer to its own subject`);
        }
      }
      for (const [key, value] of nestedPersonReferences(claim.value)) {
        if (typeof value !== 'string' || !personIds.has(value)) {
          errors.push(`${claim.id} ${key} refers to unknown local person ${JSON.stringify(value)}`);
        }
      }
      if (normalized.run.promptVersion >= 7 && claim.predicate === 'family-relationship' &&
          personIds.has(claim.subject) && personIds.has(claim.value?.personId)) {
        const targetId = claim.value.personId;
        if (!personById.get(claim.subject).identityHints.relatedLocalPeople.includes(targetId)) {
          errors.push(`${claim.id} family target ${targetId} is missing from the subject's relatedLocalPeople hints`);
        }
        if (!personById.get(targetId).identityHints.relatedLocalPeople.includes(claim.subject)) {
          errors.push(`${claim.id} family subject ${claim.subject} is missing from the target's relatedLocalPeople hints`);
        }
      }
    }
  }
  for (const person of normalized.people) {
    const personClaims = claimsByPerson.get(person.localId) ?? [];
    if (!personClaims.some((claim) => claim.predicate === 'name')) {
      errors.push(`${person.localId} has no name claim`);
    }
    if (!personClaims.some((claim) => claim.predicate === 'role')) {
      errors.push(`${person.localId} has no role claim; use named-individual when the chapter establishes no narrower role`);
    }
    if (normalized.run.promptVersion >= 5) {
      if (person.identityHints.activeDateHints.length === 0) {
        errors.push(`${person.localId} has no active-date hint required by prompt v5`);
      }
      if (!personClaims.some((claim) => claim.predicate === 'attestation')) {
        errors.push(`${person.localId} has no evidence-backed attestation required by prompt v5`);
      }
    }
  }
  if (normalized.run.promptVersion >= 6) {
    const completionFlags = normalized.run.promptVersion >= 7 ? V7_COMPLETION_FLAGS : V6_COMPLETION_FLAGS;
    for (const key of completionFlags) {
      if (normalized.coverage[key] !== true) {
        errors.push(`coverage.${key} must be true for prompt v${normalized.run.promptVersion}`);
      }
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

export function validateCompactPeopleExtraction(compact, packet) {
  const ajv = createPeopleSchemaValidator();
  const validate = ajv.getSchema(COMPACT_SCHEMA_ID);
  const errors = [];
  if (!validate(compact)) {
    errors.push(...formatSchemaErrors(validate.errors).map((item) => `compact schema: ${item}`));
  }
  errors.push(...compactInputErrors(compact, packet));
  if (errors.length > 0) throw new PeopleExtractionValidationError(errors);
  return validatePeopleExtraction(expandPeopleExtraction(compact, packet), packet);
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

function isPeopleWorkerPacket(value) {
  return [1, 2].includes(value?.version) && Array.isArray(value.units) &&
    (value.units.length === 0 || Array.isArray(value.units[0]));
}

function resolveValidationPacket(extraction, packetFile) {
  const rebuilt = () => buildPeopleExtractionPacket(
    extraction.book,
    normalizedChapterId(extraction.chapter),
  );
  if (!packetFile) return rebuilt();

  const supplied = readJson(packetFile);
  if (!isPeopleWorkerPacket(supplied)) return supplied;

  const packet = rebuilt();
  if (supplied.version === 1 && !deepEqual(supplied, buildPeopleWorkerPacket(packet))) {
    throw new PeopleExtractionValidationError([
      'compact worker packet does not exactly match the current chapter and extraction configuration',
    ]);
  }
  if (supplied.version === 1) return packet;

  const scope = supplied.scope;
  const chunk = scope && {
    id: scope.chunkId,
    index: scope.chunkIndex,
    count: scope.chunkCount,
    start: scope.start,
    end: scope.end,
    contextStart: scope.contextStart,
    contextEnd: scope.contextEnd,
    maxUnits: scope.maxUnits,
    maxCandidates: scope.maxCandidates,
    contextUnits: scope.contextUnits,
  };
  let expected;
  try {
    expected = buildPeopleChunkWorkerPacket(packet, chunk);
  } catch (error) {
    throw new PeopleExtractionValidationError([
      `invalid compact chunk scope: ${error instanceof Error ? error.message : String(error)}`,
    ]);
  }
  if (!deepEqual(supplied, expected)) {
    throw new PeopleExtractionValidationError([
      'compact chunk packet does not exactly match the current chapter, ownership range, and context',
    ]);
  }
  return buildPeopleChunkPacket(packet, chunk);
}

function validateFile(file, opts) {
  const extraction = readJson(file);
  const packet = resolveValidationPacket(extraction, opts.packet);
  const compact = isCompactPeopleExtraction(extraction);
  const result = compact
    ? validateCompactPeopleExtraction(extraction, packet)
    : validatePeopleExtraction(extraction, packet);
  if (opts.normalize && !compact) writeJsonAtomic(opts.out ?? file, result.normalized);
  if (opts.normalize && compact) {
    writeTextAtomic(opts.out ?? file, serializeCompactPeopleExtraction(extraction));
  }
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
      scannerVersion: 2,
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

  const temporal = structuredClone(extraction);
  temporal.run.promptVersion = 5;
  temporal.people[0].identityHints.activeDateHints = ['AD 1'];
  temporal.claims.push({
    id: 'testbook:001:c0003',
    subject: 'testbook:001:p001',
    predicate: 'attestation',
    value: {
      sourceDate: { text: 'first year' },
      westernYear: { era: 'AD', year: 1, precision: 'year' },
    },
    certainty: 'explicit-event-contextual-date',
    evidence: ['testbook:001:s0001'],
  });
  validatePeopleExtraction(temporal, packet);
  const missingTemporal = structuredClone(temporal);
  missingTemporal.claims.pop();
  try {
    validatePeopleExtraction(missingTemporal, packet);
    throw new Error('Prompt-v5 extraction without an attestation unexpectedly passed');
  } catch (error) {
    if (!(error instanceof PeopleExtractionValidationError)) throw error;
  }

  const comprehensive = structuredClone(temporal);
  comprehensive.run.promptVersion = 7;
  Object.assign(comprehensive.coverage, Object.fromEntries(V7_COMPLETION_FLAGS.map((key) => [key, true])));
  validatePeopleExtraction(comprehensive, packet);
  const incompleteComprehensive = structuredClone(comprehensive);
  incompleteComprehensive.coverage.allDurableFactsCaptured = false;
  try {
    validatePeopleExtraction(incompleteComprehensive, packet);
    throw new Error('Prompt-v7 extraction with an incomplete source-pass audit unexpectedly passed');
  } catch (error) {
    if (!(error instanceof PeopleExtractionValidationError)) throw error;
  }

  const invalidFamily = structuredClone(comprehensive);
  invalidFamily.claims.push({
    id: 'testbook:001:c0004',
    subject: 'testbook:001:p001',
    predicate: 'family-relationship',
    value: { relation: 'father-of', personId: 'testbook:001:p999' },
    certainty: 'explicit',
    evidence: ['testbook:001:s0001'],
  });
  try {
    validatePeopleExtraction(invalidFamily, packet);
    throw new Error('Invalid family relationship unexpectedly passed');
  } catch (error) {
    if (!(error instanceof PeopleExtractionValidationError)) throw error;
  }

  const workerPacket = buildPeopleWorkerPacket(packet);
  if (!isPeopleWorkerPacket(workerPacket)) throw new Error('Compact worker packet was not recognized');
  if (!deepEqual(workerPacket, buildPeopleWorkerPacket(packet))) {
    throw new Error('Compact worker packet comparison is not deterministic');
  }

  const duplicatedClaim = structuredClone(extraction);
  duplicatedClaim.claims.push({
    ...structuredClone(duplicatedClaim.claims[0]),
    id: 'testbook:001:c0003',
  });
  const deduplicated = validatePeopleExtraction(duplicatedClaim, packet);
  if (deduplicated.normalized.claims.length !== 2) throw new Error('Duplicate claims were not consolidated');

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
