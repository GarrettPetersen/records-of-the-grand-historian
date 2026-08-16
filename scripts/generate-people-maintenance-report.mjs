#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  PEOPLE_DIR,
  REPO_ROOT,
  readJson,
  writeJsonAtomic,
} from './lib/people-content.mjs';
import { connectedBlockComponents } from './lib/people-resolution.mjs';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

function parseArgs(argv) {
  const options = {
    catalog: path.join(PEOPLE_DIR, 'generated', 'catalog.json'),
    candidates: path.join(PEOPLE_DIR, 'generated', 'resolution-candidates.json'),
    out: path.join(PEOPLE_DIR, 'generated', 'maintenance-report.json'),
    markdownOut: path.join(PEOPLE_DIR, 'generated', 'maintenance-report.md'),
    limit: 25,
    selfTest: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const nextPath = () => {
      const value = argv[++index];
      if (!value) throw new Error(`${arg} requires a path`);
      return path.resolve(REPO_ROOT, value);
    };
    if (arg === '--catalog') options.catalog = nextPath();
    else if (arg === '--candidates') options.candidates = nextPath();
    else if (arg === '--out') options.out = nextPath();
    else if (arg === '--markdown-out') options.markdownOut = nextPath();
    else if (arg === '--limit') {
      const value = argv[++index];
      if (!/^\d+$/u.test(value ?? '') || Number(value) < 1 || Number(value) > 500) {
        throw new Error('--limit must be an integer from 1 to 500');
      }
      options.limit = Number(value);
    } else if (arg === '--self-test') options.selfTest = true;
    else if (arg === '--help' || arg === '-h') {
      console.log(`Usage: node scripts/generate-people-maintenance-report.mjs [options]

Options:
  --catalog PATH       Compiled people catalog.
  --candidates PATH    Compiled identity-candidate dossier.
  --out PATH           Full JSON maintenance queues.
  --markdown-out PATH  Human-readable priority report.
  --limit N            Rows per Markdown queue (default: 25, max: 500).
  --self-test           Run report fixtures.`);
      process.exit(0);
    } else throw new Error(`Unknown option: ${arg}`);
  }
  return options;
}

function localScope(localId) {
  const match = localId.match(/^([^:]+):(\d{3}):p\d+$/u);
  if (!match) throw new Error(`Invalid local person ID ${localId}`);
  return { book: match[1], chapter: match[2], scope: `${match[1]}/${match[2]}` };
}

function displayName(person) {
  return person.preferredName?.en || person.preferredName?.pinyin || person.preferredName?.zh || person.id;
}

function westernYearLabels(value, { includeStrings = false } = {}) {
  const labels = new Set();
  const visit = (current) => {
    if (Array.isArray(current)) current.forEach(visit);
    else if (includeStrings && typeof current === 'string') {
      for (const match of current.matchAll(/\b(BC|AD)\s+(\d{1,4})\b/giu)) {
        labels.add(`${match[1].toUpperCase()} ${Number(match[2])}`);
      }
    } else if (current && typeof current === 'object') {
      if (['BC', 'AD'].includes(current.era) && Number.isInteger(current.year)) {
        labels.add(`${current.era} ${current.year}`);
      } else Object.values(current).forEach(visit);
    }
  };
  visit(value);
  return [...labels].sort((left, right) => {
    const point = (label) => {
      const [era, year] = label.split(' ');
      return era === 'BC' ? -Number(year) : Number(year);
    };
    return point(left) - point(right);
  });
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((left, right) => left.localeCompare(right));
}

function personImpact(people) {
  const references = new Map();
  const mentions = new Set();
  for (const person of people) {
    for (const reference of person.references ?? []) {
      const key = `${reference.book}:${reference.chapter}:${reference.unitId}`;
      references.set(key, reference);
      for (const mention of reference.mentionRefs ?? []) mentions.add(mention);
    }
  }
  const values = [...references.values()];
  return {
    citedPassages: values.length,
    mentionOccurrences: mentions.size,
    books: uniqueSorted(values.map((reference) => reference.book)),
    chapters: uniqueSorted(values.map((reference) => `${reference.book}/${reference.chapter}`)),
  };
}

function compareImpact(left, right) {
  return right.citedPassages - left.citedPassages ||
    right.mentionOccurrences - left.mentionOccurrences ||
    right.books.length - left.books.length ||
    right.chapters.length - left.chapters.length ||
    String(left.componentId ?? left.personId).localeCompare(String(right.componentId ?? right.personId));
}

function compareChronology(left, right) {
  const historicalRank = (item) => ['historical', 'uncertain'].includes(item.historicity) ? 0 : 1;
  return historicalRank(left) - historicalRank(right) || compareImpact(left, right);
}

function impactTier(impact) {
  if (impact.citedPassages >= 100 || impact.books.length >= 4) return 'critical';
  if (impact.citedPassages >= 25 || impact.books.length >= 2) return 'high';
  if (impact.citedPassages >= 5) return 'medium';
  return 'low';
}

function localHints(localIds, candidatePeople) {
  return localIds.flatMap((localId) => {
    const hints = candidatePeople[localId]?.activeDateHints ?? [];
    return hints.map((hint) => ({ localPersonId: localId, hint }));
  });
}

function rankedSeedChapters(localIds, candidatePeople) {
  const chapters = new Map();
  for (const localId of localIds) {
    const scope = localScope(localId).scope;
    chapters.set(scope, (chapters.get(scope) ?? 0) + (candidatePeople[localId]?.mentions ?? 0));
  }
  return [...chapters].sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([scope]) => scope);
}

function identityQueue(catalog, candidates, peopleById) {
  const unresolvedIds = new Set(catalog.unresolvedCandidateBlockIds);
  const blocksById = new Map(candidates.blocks.map((block) => [block.id, block]));
  for (const blockId of unresolvedIds) {
    if (!blocksById.has(blockId)) throw new Error(`Catalog refers to missing identity block ${blockId}`);
  }
  const canonicalByLocal = new Map(Object.entries(catalog.localPersonMap));
  const components = connectedBlockComponents(
    [...unresolvedIds].map((blockId) => blocksById.get(blockId)),
    canonicalByLocal,
  );
  return components.map((blocks) => {
    const blockIds = blocks.map((block) => block.id).sort();
    const localPeople = uniqueSorted(blocks.flatMap((block) => block.localPeople));
    const canonicalIds = uniqueSorted(localPeople.map((localId) => {
      const canonicalId = catalog.localPersonMap[localId];
      if (!canonicalId) throw new Error(`${blockIds[0]} contains unmapped local person ${localId}`);
      return canonicalId;
    }));
    const canonicalPeople = canonicalIds.map((personId) => {
      const person = peopleById.get(personId);
      if (!person) throw new Error(`${blockIds[0]} maps to missing canonical person ${personId}`);
      return person;
    });
    const impact = personImpact(canonicalPeople);
    const sharedNamesByKey = new Map();
    for (const shared of blocks.flatMap((block) => block.sharedNames)) {
      const current = sharedNamesByKey.get(shared.key) ?? [];
      current.push(...shared.forms.map((form) => form.value));
      sharedNamesByKey.set(shared.key, current);
    }
    const sharedNames = [...sharedNamesByKey].sort(([left], [right]) => left.localeCompare(right))
      .map(([key, values]) => ({ key, language: key.split(':', 1)[0], values: uniqueSorted(values) }));
    return {
      componentId: blockIds.length === 1 ? blockIds[0] : `component_${blockIds[0].slice(6)}_${blockIds.length}`,
      blockIds,
      blockCount: blockIds.length,
      priority: impactTier(impact),
      ambiguity: blocks.some((block) => block.ambiguity === 'very-high') ? 'very-high' :
        blocks.some((block) => block.ambiguity === 'high') ? 'high' : 'normal',
      ...impact,
      localPeople,
      currentCanonicalPeople: canonicalPeople.map((person) => ({
        personId: person.id,
        slug: person.slug,
        name: displayName(person),
        zh: person.preferredName?.zh ?? null,
        citedPassages: person.references?.length ?? 0,
      })).sort((left, right) => right.citedPassages - left.citedPassages || left.personId.localeCompare(right.personId)),
      sharedNames,
      activeDateHints: localHints(localPeople, candidates.people),
      seedChapters: rankedSeedChapters(localPeople, candidates.people),
      reviewMode: canonicalPeople.length > 100 || blockIds.length > 20 ? 'seeded-batches' : 'component',
    };
  }).sort(compareImpact);
}

function chronologyQueues(catalog, candidates) {
  const chronology = [];
  const attestation = [];
  for (const person of catalog.people) {
    const impact = personImpact([person]);
    const hints = localHints(person.localPeople, candidates.people);
    const hintYears = westernYearLabels(hints.map(({ hint }) => hint), { includeStrings: true });
    const allLifeClaims = [
      ...(person.life?.birth ?? []),
      ...(person.life?.death ?? []),
      ...(person.life?.attestedActivity ?? []),
    ];
    const structuredYears = westernYearLabels(allLifeClaims);
    const attestedYears = westernYearLabels(person.life?.attestedActivity ?? []);
    const base = {
      personId: person.id,
      slug: person.slug,
      name: displayName(person),
      zh: person.preferredName?.zh ?? null,
      description: person.description?.en ?? 'Named Individual',
      historicity: person.historicity,
      priority: impactTier(impact),
      ...impact,
      localPeople: person.localPeople,
      legacySource: person.curation?.notes?.some((note) => note.startsWith('Requires prompt-v')) ?? false,
      activeDateHints: hints,
      hintYears,
    };
    if (structuredYears.length === 0) {
      chronology.push({
        ...base,
        gap: ['legendary', 'literary'].includes(person.historicity) ? 'nonhistorical-undated' :
          hintYears.length > 0 ? 'active-hint-needs-evidence' : 'no-western-year',
        hasBirthClaim: (person.life?.birth ?? []).length > 0,
        hasDeathClaim: (person.life?.death ?? []).length > 0,
        hasAttestationClaim: (person.life?.attestedActivity ?? []).length > 0,
      });
    }
    if ((person.life?.attestedActivity ?? []).length === 0 || attestedYears.length === 0) {
      attestation.push({
        ...base,
        gap: (person.life?.attestedActivity ?? []).length === 0 ? 'missing-attestation' : 'undated-attestation',
        structuredYears,
      });
    }
  }
  chronology.sort(compareChronology);
  attestation.sort(compareChronology);
  return { chronology, attestation };
}

function legacyChapterQueue(catalog, candidates) {
  const chapters = new Map();
  for (const [localId, person] of Object.entries(candidates.people)) {
    if (person.promptVersion >= catalog.currentPromptVersion) continue;
    const scope = localScope(localId);
    const current = chapters.get(scope.scope) ?? {
      scope: scope.scope,
      book: scope.book,
      chapter: scope.chapter,
      localPeople: 0,
      mentionOccurrences: 0,
      promptVersions: new Set(),
    };
    current.localPeople += 1;
    current.mentionOccurrences += person.mentions ?? 0;
    current.promptVersions.add(person.promptVersion);
    chapters.set(scope.scope, current);
  }
  return [...chapters.values()].map((chapter) => ({
    ...chapter,
    promptVersions: [...chapter.promptVersions].sort((a, b) => a - b),
  })).sort((left, right) =>
    right.mentionOccurrences - left.mentionOccurrences || left.scope.localeCompare(right.scope)
  );
}

export function buildPeopleMaintenanceReport(catalog, candidates, generatedAt = new Date().toISOString()) {
  if (catalog.schemaVersion !== 1 || candidates.schemaVersion !== 1) {
    throw new Error('People maintenance requires schema-version 1 catalog and candidate documents');
  }
  const peopleById = new Map(catalog.people.map((person) => [person.id, person]));
  const identities = identityQueue(catalog, candidates, peopleById);
  const { chronology, attestation } = chronologyQueues(catalog, candidates);
  const legacyChapters = legacyChapterQueue(catalog, candidates);
  if (identities.reduce((sum, item) => sum + item.blockCount, 0) !== catalog.stats.unresolvedCandidateBlocks) {
    throw new Error('Identity queue does not account for every unresolved block');
  }
  if (legacyChapters.length !== catalog.stats.legacyChapters) {
    throw new Error('Legacy chapter queue does not match catalog legacy-chapter count');
  }
  return {
    schemaVersion: 1,
    generatedAt,
    catalogGeneratedAt: catalog.generatedAt,
    summary: {
      sourceChapters: catalog.stats.sourceChapters,
      extractedChapters: catalog.stats.extractedChapters,
      missingChapters: catalog.stats.missingChapters,
      canonicalPeople: catalog.stats.canonicalPeople,
      unresolvedIdentityComponents: identities.length,
      unresolvedIdentityNameBlocks: catalog.stats.unresolvedCandidateBlocks,
      unresolvedIdentityCitedPassages: identities.reduce((sum, item) => sum + item.citedPassages, 0),
      oversizedIdentityComponents: identities.filter((item) => item.reviewMode === 'seeded-batches').length,
      peopleWithoutStructuredYear: chronology.length,
      historicalPeopleWithoutStructuredYear: chronology.filter((item) => item.historicity === 'historical').length,
      currentHistoricalPeopleWithoutStructuredYear: chronology.filter((item) =>
        item.historicity === 'historical' && !item.legacySource
      ).length,
      nonhistoricalPeopleWithoutStructuredYear: chronology.filter((item) =>
        ['legendary', 'literary'].includes(item.historicity)
      ).length,
      peopleWithRecoverableYearHints: chronology.filter((item) => item.hintYears.length > 0).length,
      peopleWithoutDatedAttestation: attestation.length,
      legacyChapters: legacyChapters.length,
      legacyLocalPeople: catalog.stats.legacyLocalPeople,
    },
    identityQueue: identities,
    chronologyQueue: chronology,
    attestationQueue: attestation,
    legacyChapterQueue: legacyChapters,
  };
}

function markdownCell(value) {
  return String(value ?? '').replace(/\|/gu, '\\|').replace(/\s+/gu, ' ').trim();
}

function personLink(item) {
  const label = markdownCell(`${item.name}${item.zh ? ` (${item.zh})` : ''}`);
  return `[${label}](https://24histories.com/people/${item.slug}.html)`;
}

function markdownTable(headers, rows) {
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.map(markdownCell).join(' | ')} |`),
  ].join('\n');
}

function compactList(values, limit = 8) {
  if (values.length <= limit) return values.join(',');
  return `${values.slice(0, limit).join(',')} (+${values.length - limit})`;
}

export function renderPeopleMaintenanceMarkdown(report, limit = 25) {
  const summary = report.summary;
  const identityRows = report.identityQueue.slice(0, limit).map((item, index) => [
    index + 1,
    item.priority,
    compactList(item.sharedNames.flatMap((name) => name.values), 10),
    item.currentCanonicalPeople.length,
    item.blockCount,
    item.citedPassages,
    compactList(item.books, 8),
    item.reviewMode,
    compactList(item.seedChapters),
  ]);
  const chronologyRows = report.chronologyQueue.slice(0, limit).map((item, index) => [
    index + 1,
    item.priority,
    personLink(item),
    item.gap,
    item.legacySource ? 'legacy reread' : item.historicity,
    item.citedPassages,
    item.hintYears.join(' - ') || 'none',
    item.chapters.join(','),
  ]);
  const attestationRows = report.attestationQueue.slice(0, limit).map((item, index) => [
    index + 1,
    item.priority,
    personLink(item),
    item.gap,
    item.citedPassages,
    item.structuredYears.join(' - ') || item.hintYears.join(' - ') || 'none',
  ]);
  const legacyRows = report.legacyChapterQueue.slice(0, limit).map((item, index) => [
    index + 1,
    item.scope,
    item.promptVersions.join(', '),
    item.localPeople,
    item.mentionOccurrences,
  ]);
  return `# People maintenance priorities

Generated ${report.generatedAt}. This is a deterministic triage report; it does not make identity or chronology claims.

| Measure | Count |
| --- | ---: |
| Extracted chapters | ${summary.extractedChapters} / ${summary.sourceChapters} |
| Missing chapters | ${summary.missingChapters} |
| Canonical people | ${summary.canonicalPeople} |
| Unresolved identity components | ${summary.unresolvedIdentityComponents} |
| Unresolved name blocks | ${summary.unresolvedIdentityNameBlocks} |
| Oversized identity components | ${summary.oversizedIdentityComponents} |
| Cited passages touched by unresolved blocks | ${summary.unresolvedIdentityCitedPassages} |
| People without a structured Western year | ${summary.peopleWithoutStructuredYear} |
| Historical people without a structured Western year | ${summary.historicalPeopleWithoutStructuredYear} |
| Current historical people without a structured Western year | ${summary.currentHistoricalPeopleWithoutStructuredYear} |
| Legendary/literary people without a structured Western year | ${summary.nonhistoricalPeopleWithoutStructuredYear} |
| Of those, people with a recoverable year hint | ${summary.peopleWithRecoverableYearHints} |
| People without a dated attestation | ${summary.peopleWithoutDatedAttestation} |
| Legacy chapters | ${summary.legacyChapters} |

## Identity queue

Ranked by cited passages, then mention count and cross-book reach. Oversized connected components are marked \`seeded-batches\`; use their best seed chapters with \`npm run people:resolve -- --batch NAME --chapters BOOK/NNN,...\` instead of sending the entire component to one worker.

${markdownTable(['#', 'Priority', 'Shared names', 'Current records', 'Name blocks', 'Passages', 'Books', 'Mode', 'Best seed chapters'], identityRows)}

## Chronology queue

People with no structured BC/AD year in birth, death, or attestation claims. Historical records are listed before legendary and literary figures. A recoverable hint still needs source evidence before becoming a claim.

${markdownTable(['#', 'Priority', 'Person', 'Gap', 'Source pass', 'Passages', 'Hint years', 'Chapters'], chronologyRows)}

## Attestation queue

Prominent people with no dated attestation. Birth and death claims may still supply a public time indicator.

${markdownTable(['#', 'Priority', 'Person', 'Gap', 'Passages', 'Known years'], attestationRows)}

## Legacy chapter queue

Old-prompt chapters ranked by the number of person mentions that a reread can improve.

${markdownTable(['#', 'Chapter', 'Prompt', 'People', 'Mentions'], legacyRows)}
`;
}

function selfTest() {
  const reference = (book, chapter, unitId, mentionRefs) => ({ book, chapter, unitId, mentionRefs });
  const person = (id, slug, name, localPeople, references, life = {}) => ({
    id, slug, preferredName: { en: name, zh: null }, description: { en: 'Official' }, historicity: 'historical',
    localPeople, references,
    life: { birth: [], death: [], attestedActivity: [], ...life }, curation: { notes: [] },
  });
  const catalog = {
    schemaVersion: 1,
    generatedAt: '2026-08-15T00:00:00.000Z',
    currentPromptVersion: 7,
    stats: {
      sourceChapters: 4, extractedChapters: 3, missingChapters: 1, canonicalPeople: 3,
      unresolvedCandidateBlocks: 1, legacyChapters: 1, legacyLocalPeople: 1,
    },
    localPersonMap: {
      'a:001:p001': 'per_a', 'b:002:p001': 'per_b', 'a:003:p001': 'per_c',
    },
    unresolvedCandidateBlockIds: ['block_one'],
    people: [
      person('per_a', 'alpha', 'Alpha', ['a:001:p001'], [
        reference('a', '001', 's0001', ['m1']), reference('a', '001', 's0002', ['m2']),
      ]),
      person('per_b', 'beta', 'Beta', ['b:002:p001'], [reference('b', '002', 's0001', ['m3'])], {
        death: [{ value: { westernYear: { era: 'AD', year: 12 } } }],
      }),
      person('per_c', 'gamma', 'Gamma', ['a:003:p001'], [reference('a', '003', 's0001', ['m4'])], {
        attestedActivity: [{ value: { westernYear: { era: 'AD', year: 20 } } }],
      }),
    ],
  };
  const candidates = {
    schemaVersion: 1,
    people: {
      'a:001:p001': { activeDateHints: ['AD 10'], mentions: 2, promptVersion: 6 },
      'b:002:p001': { activeDateHints: [], mentions: 1, promptVersion: 7 },
      'a:003:p001': { activeDateHints: ['AD 20'], mentions: 1, promptVersion: 7 },
    },
    blocks: [{
      id: 'block_one', localPeople: ['a:001:p001', 'b:002:p001'], ambiguity: 'normal',
      sharedNames: [{ key: 'en:same', forms: [{ value: 'Same' }] }],
    }],
  };
  const report = buildPeopleMaintenanceReport(catalog, candidates, '2026-08-15T01:00:00.000Z');
  assert.equal(report.identityQueue[0].citedPassages, 3);
  assert.deepEqual(report.identityQueue[0].books, ['a', 'b']);
  assert.equal(report.identityQueue[0].priority, 'high');
  assert.equal(report.chronologyQueue.length, 1);
  assert.equal(report.chronologyQueue[0].personId, 'per_a');
  assert.equal(report.chronologyQueue[0].gap, 'active-hint-needs-evidence');
  assert.deepEqual(report.chronologyQueue[0].hintYears, ['AD 10']);
  assert.deepEqual(report.attestationQueue.map((item) => item.personId), ['per_a', 'per_b']);
  assert.equal(report.legacyChapterQueue[0].scope, 'a/001');
  assert.match(renderPeopleMaintenanceMarkdown(report, 1), /Best seed chapters/u);
  console.log('people maintenance report self-test: ok');
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.selfTest) return selfTest();
  for (const file of [options.catalog, options.candidates]) {
    if (!fs.existsSync(file)) {
      throw new Error(`Missing ${path.relative(REPO_ROOT, file)}; run npm run people:catalog first`);
    }
  }
  const report = buildPeopleMaintenanceReport(readJson(options.catalog), readJson(options.candidates));
  writeJsonAtomic(options.out, report);
  fs.mkdirSync(path.dirname(options.markdownOut), { recursive: true });
  fs.writeFileSync(options.markdownOut, renderPeopleMaintenanceMarkdown(report, options.limit));
  console.log(
    `people maintenance: ${report.summary.unresolvedIdentityComponents} identity component(s), ` +
    `${report.summary.peopleWithoutStructuredYear} person record(s) without a structured year, ` +
    `${report.summary.legacyChapters} legacy chapter(s) -> ` +
    `${path.relative(REPO_ROOT, options.markdownOut)}`,
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
