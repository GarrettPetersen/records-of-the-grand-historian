#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import {
  REPO_ROOT,
  extractionPath,
  readJson,
  writeTextAtomic,
} from './lib/people-content.mjs';
import {
  compactPeopleExtraction,
  isCompactPeopleExtraction,
  serializeCompactPeopleExtraction,
} from './lib/people-compact.mjs';
import {
  invalidateResolutionPeople,
  pruneResolutionPeople,
} from './lib/people-resolution-invalidation.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const NON_PERSON_REASONS = new Set([
  'place',
  'office',
  'organization',
  'title',
  'book-title',
  'collective',
  'deity',
  'reign-period',
  'polity',
  'not-a-name',
]);

function usage() {
  console.log(`Usage:
  node scripts/remove-false-people.mjs --person BOOK:NNN:pNNN=REASON [--person ...] [--dry-run]
  node scripts/remove-false-people.mjs --self-test

Removes source-audited false person records, classifies candidates previously
covered by their mentions, and invalidates only the affected identity-resolution
references. REASON must be one of: ${[...NON_PERSON_REASONS].join(', ')}.`);
}

function parsePerson(value) {
  const separator = value.lastIndexOf('=');
  const localId = value.slice(0, separator);
  const reason = value.slice(separator + 1);
  const match = /^([a-z0-9_-]+):(\d{3}):(p\d+)$/u.exec(localId);
  if (separator < 1 || !match || !NON_PERSON_REASONS.has(reason)) {
    throw new Error(`Invalid --person value: ${value}`);
  }
  return { localId, book: match[1], chapter: match[2], reason };
}

function parseArgs(argv) {
  const opts = { people: [], dryRun: false, selfTest: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--person') {
      const value = argv[++index];
      if (!value || value.startsWith('--')) throw new Error('--person requires a value');
      opts.people.push(parsePerson(value));
    } else if (arg === '--dry-run') opts.dryRun = true;
    else if (arg === '--self-test') opts.selfTest = true;
    else if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else throw new Error(`Unknown option: ${arg}`);
  }
  if (!opts.selfTest && opts.people.length === 0) throw new Error('At least one --person is required');
  const duplicate = opts.people.find((item, index) => (
    opts.people.findIndex((other) => other.localId === item.localId) !== index
  ));
  if (duplicate) throw new Error(`Duplicate --person: ${duplicate.localId}`);
  return opts;
}

function containsLocalPerson(value, localPeople) {
  if (typeof value === 'string') return localPeople.has(value);
  if (Array.isArray(value)) return value.some((item) => containsLocalPerson(item, localPeople));
  if (value && typeof value === 'object') {
    return Object.values(value).some((item) => containsLocalPerson(item, localPeople));
  }
  return false;
}

function removePeople(extraction, targets) {
  const targetById = new Map(targets.map((target) => [target.localId, target]));
  const localPeople = new Set(targetById.keys());
  for (const localId of localPeople) {
    if (!extraction.people.some((person) => person.localId === localId)) {
      throw new Error(`Person not found in extraction: ${localId}`);
    }
    if (!extraction.mentions.some((mention) => mention.person === localId)) {
      throw new Error(`Refusing to remove person without an auditable mention: ${localId}`);
    }
  }

  const externalClaims = extraction.claims.filter((claim) => (
    !localPeople.has(claim.subject) && containsLocalPerson(claim.value, localPeople)
  ));
  if (externalClaims.length > 0) {
    throw new Error(
      'Remaining claims reference removed people: ' +
      externalClaims.map((claim) => claim.id).join(', '),
    );
  }

  const existingDispositions = new Set(
    extraction.candidateDispositions.map((item) => item.candidate),
  );
  const removedMentions = extraction.mentions.filter((mention) => localPeople.has(mention.person));
  const dispositions = [];
  for (const mention of removedMentions) {
    const target = targetById.get(mention.person);
    for (const candidate of mention.candidateRefs) {
      if (existingDispositions.has(candidate)) {
        throw new Error(`Candidate is both mentioned and already disposed: ${candidate}`);
      }
      existingDispositions.add(candidate);
      dispositions.push({
        candidate,
        disposition: 'not-person',
        reason: target.reason,
        note: `Removed after source audit: ${target.reason.replaceAll('-', ' ')} reference, not an individual.`,
      });
    }
  }

  return {
    extraction: {
      ...extraction,
      people: extraction.people
        .filter((person) => !localPeople.has(person.localId))
        .map((person) => ({
          ...person,
          identityHints: {
            ...person.identityHints,
            relatedLocalPeople: person.identityHints.relatedLocalPeople
              .filter((localId) => !localPeople.has(localId)),
          },
        })),
      mentions: extraction.mentions.filter((mention) => !localPeople.has(mention.person)),
      claims: extraction.claims.filter((claim) => !localPeople.has(claim.subject)),
      candidateDispositions: [...extraction.candidateDispositions, ...dispositions],
    },
    stats: {
      people: localPeople.size,
      mentions: removedMentions.length,
      claims: extraction.claims.filter((claim) => localPeople.has(claim.subject)).length,
      dispositions: dispositions.length,
    },
  };
}

function groupTargets(targets) {
  const groups = new Map();
  for (const target of targets) {
    const key = `${target.book}:${target.chapter}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(target);
  }
  return groups;
}

function prepareChapter(book, chapter, targets) {
  const packet = buildPeopleExtractionPacket(book, chapter);
  const file = extractionPath(book, chapter);
  const compact = readJson(file);
  if (!isCompactPeopleExtraction(compact)) {
    throw new Error(`False-person removal requires compact extraction v2: ${path.relative(REPO_ROOT, file)}`);
  }
  const extraction = validateCompactPeopleExtraction(compact, packet).normalized;
  const removed = removePeople(extraction, targets);
  const revisedCompact = compactPeopleExtraction(removed.extraction, packet);
  validateCompactPeopleExtraction(revisedCompact, packet);
  return {
    file,
    serialized: serializeCompactPeopleExtraction(revisedCompact),
    stats: removed.stats,
  };
}

function selfTest() {
  const document = {
    decisions: [
      {
        decision: 'merge',
        localPeople: ['book:001:p001', 'book:001:p002', 'book:002:p001'],
        canonicalPersonId: 'per_fixture',
      },
      { decision: 'keep-separate', localPeople: ['book:001:p001', 'book:003:p001'] },
      { decision: 'keep-separate', localPeople: ['book:004:p001', 'book:005:p001'] },
    ],
  };
  const result = pruneResolutionPeople(document, ['book:001:p001']);
  if (
    result.stats.removedReferences !== 2 ||
    result.stats.touchedDecisions !== 2 ||
    result.stats.removedDecisions !== 1 ||
    result.document.decisions.length !== 2 ||
    result.document.decisions[0].localPeople.length !== 2 ||
    'canonicalPersonId' in result.document.decisions[0]
  ) {
    throw new Error('Person-specific resolution invalidation failed');
  }
  console.log('False-person removal self-test passed.');
}

function main(argv) {
  const opts = parseArgs(argv);
  if (opts.selfTest) return selfTest();

  const prepared = [];
  for (const [key, targets] of groupTargets(opts.people)) {
    const [book, chapter] = key.split(':');
    prepared.push({ book, chapter, ...prepareChapter(book, chapter, targets) });
  }

  for (const item of prepared) {
    console.log(
      `${opts.dryRun ? 'Would update' : 'Updating'} ${item.book}/${item.chapter}: ` +
      `remove ${item.stats.people} people, ${item.stats.mentions} mentions, ` +
      `${item.stats.claims} claims; classify ${item.stats.dispositions} candidates.`,
    );
    if (!opts.dryRun) writeTextAtomic(item.file, item.serialized);
  }

  if (!opts.dryRun) {
    const invalidated = invalidateResolutionPeople(opts.people.map((item) => item.localId));
    console.log(
      `Invalidated ${invalidated.removedReferences} references in ` +
      `${invalidated.touchedDecisions} decisions across ${invalidated.filesChanged} files; ` +
      `removed ${invalidated.removedDecisions} decisions left with fewer than two people.`,
    );
  }
}

if (isMain) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
