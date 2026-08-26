#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import {
  extractionPath,
  normalizedChapterId,
  readJson,
  writeTextAtomic,
} from './lib/people-content.mjs';
import {
  compactPeopleExtraction,
  isCompactPeopleExtraction,
  serializeCompactPeopleExtraction,
} from './lib/people-compact.mjs';
import {
  validateCompactPeopleExtraction,
  validatePeopleExtraction,
} from './validate-people-extraction.mjs';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

function usage() {
  console.log(`Usage:
  node scripts/link-local-person-records.mjs --book BOOK --chapter NNN \\
    --same p001=p042 [--same p001=p087 ...]

Adds reviewer-confirmed reciprocal same-person claims between local records in one
chapter. The command validates the current extraction and the revised extraction
before writing. It never infers pairs automatically.`);
}

function parseArgs(argv) {
  const opts = { book: null, chapter: null, pairs: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => {
      const value = argv[++index];
      if (!value || value.startsWith('--')) throw new Error(`${arg} requires a value`);
      return value;
    };
    if (arg === '--book') opts.book = next();
    else if (arg === '--chapter') opts.chapter = normalizedChapterId(next());
    else if (arg === '--same') opts.pairs.push(next());
    else if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else throw new Error(`Unknown option: ${arg}`);
  }
  if (!opts.book || !opts.chapter || opts.pairs.length === 0) {
    throw new Error('--book, --chapter, and at least one --same pair are required');
  }
  return opts;
}

function fullLocalId(value, namespace) {
  if (/^p\d{3,}$/u.test(value)) return `${namespace}:${value}`;
  if (value.startsWith(`${namespace}:p`)) return value;
  throw new Error(`Invalid local person ID for ${namespace}: ${value}`);
}

function orderedPair(left, right) {
  return left < right ? `${left}\u0000${right}` : `${right}\u0000${left}`;
}

function claimEvidence(extraction, personIds) {
  const evidence = new Set();
  for (const claim of extraction.claims) {
    if (!personIds.has(claim.subject) || claim.predicate !== 'name') continue;
    for (const item of claim.evidence) evidence.add(item);
  }
  if (evidence.size === 0) throw new Error('Same-person records must have name evidence');
  return [...evidence];
}

function hasIdentityClaim(extraction, subject, predicate, target) {
  return extraction.claims.some((claim) =>
    claim.subject === subject &&
    claim.predicate === predicate &&
    claim.value?.personId === target
  );
}

function addRelatedHint(person, related) {
  if (!person.identityHints.relatedLocalPeople.includes(related)) {
    person.identityHints.relatedLocalPeople.push(related);
    person.identityHints.relatedLocalPeople.sort();
  }
}

export function linkLocalPersonRecords(extraction, rawPairs) {
  const namespace = `${extraction.book}:${extraction.chapter}`;
  const personById = new Map(extraction.people.map((person) => [person.localId, person]));
  const seen = new Set();
  let addedClaims = 0;

  for (const rawPair of rawPairs) {
    const parts = rawPair.split('=');
    if (parts.length !== 2) throw new Error(`Invalid --same pair: ${rawPair}`);
    const left = fullLocalId(parts[0], namespace);
    const right = fullLocalId(parts[1], namespace);
    if (left === right) throw new Error(`A record cannot be linked to itself: ${rawPair}`);
    if (!personById.has(left) || !personById.has(right)) {
      throw new Error(`Unknown person in --same pair: ${rawPair}`);
    }
    const key = orderedPair(left, right);
    if (seen.has(key)) throw new Error(`Duplicate --same pair: ${rawPair}`);
    seen.add(key);
    if (
      hasIdentityClaim(extraction, left, 'different-person', right) ||
      hasIdentityClaim(extraction, right, 'different-person', left)
    ) {
      throw new Error(`Pair contradicts an existing different-person claim: ${rawPair}`);
    }

    addRelatedHint(personById.get(left), right);
    addRelatedHint(personById.get(right), left);
    const evidence = claimEvidence(extraction, new Set([left, right]));
    const note = 'Reviewer-confirmed duplicate local records within this chapter.';
    for (const [subject, target] of [[left, right], [right, left]]) {
      if (hasIdentityClaim(extraction, subject, 'same-person', target)) continue;
      extraction.claims.push({
        id: `${namespace}:pending-same-person`,
        subject,
        predicate: 'same-person',
        value: { personId: target, note },
        certainty: 'explicit',
        evidence,
      });
      addedClaims += 1;
    }
  }
  return { pairCount: seen.size, addedClaims };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const file = extractionPath(opts.book, opts.chapter);
  const packet = buildPeopleExtractionPacket(opts.book, opts.chapter);
  const stored = readJson(file);
  const current = isCompactPeopleExtraction(stored)
    ? validateCompactPeopleExtraction(stored, packet).normalized
    : validatePeopleExtraction(stored, packet).normalized;
  const result = linkLocalPersonRecords(current, opts.pairs);
  const compact = compactPeopleExtraction(current, packet);
  validateCompactPeopleExtraction(compact, packet);
  writeTextAtomic(file, serializeCompactPeopleExtraction(compact));
  console.log(
    `Linked ${result.pairCount} local pair(s) in ${opts.book}/${opts.chapter}; ` +
    `added ${result.addedClaims} reciprocal claim(s).`,
  );
}

if (isMain) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
