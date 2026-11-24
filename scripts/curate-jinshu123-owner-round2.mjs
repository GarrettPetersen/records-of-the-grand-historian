#!/usr/bin/env node
/**
 * Jinshu 123 owner round-2 after native apply of 45 accepts (+ 4 claim revisions).
 * - Adds paired literal repairs for s0093 / s0240 as proposed-only
 * - Merges F4 within-chapter false splits (not p120 into Murong Ke)
 * - Corrects unsupported p120 Murong Ke attribution; removes p111→p120 parent claim
 * - Adds p126 family-summary for 攜妻子 on s0244
 * - Preserves unresolved chronology; no membership seals / self-approvals
 */
import fs from 'node:fs';
import path from 'node:path';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';
import { validatePeopleExtraction } from './validate-people-extraction.mjs';
import {
  expandPeopleExtraction,
  compactPeopleExtraction,
  serializeCompactPeopleExtraction,
} from './lib/people-compact.mjs';
import {
  PEOPLE_DIR,
  REPO_ROOT,
  readJson,
  writeJsonAtomic,
  writeTextAtomic,
  sha256,
} from './lib/people-content.mjs';

const book = 'jinshu';
const chapter = '123';
const ns = `${book}:${chapter}`;

const MERGE_INTO = new Map([
  ['p001', ['p029', 'p057', 'p092', 'p129']], // Murong Chui
  ['p013', ['p028', 'p058', 'p114']], // Fu Jian
  ['p038', ['p060', 'p093']], // Fu Pi
  ['p016', ['p055', 'p075', 'p096', 'p141']], // Murong Bao
  ['p018', ['p054', 'p079', 'p101', 'p131']], // Murong De
  ['p008', ['p043', 'p080', 'p123']], // Murong Wei
  ['p045', ['p067', 'p094', 'p138']], // Murong Nong
  ['p046', ['p077', 'p111', 'p137']], // Murong Kai (NOT p120)
  ['p047', ['p112', 'p143']], // Murong Shao
  ['p076', ['p122', 'p146']], // Murong Long
  ['p025', ['p031', 'p063']], // Han Xin
  ['p039', ['p062']], // Fu Hui
  ['p041', ['p061']], // Fu Feilong
  ['p036', ['p068']], // Shi Yue
  ['p040', ['p071']], // Zhai Bin
  ['p051', ['p097']], // Kuruguan Wei
  ['p048', ['p113']], // Murong Zhou
  ['p072', ['p100']], // Feng Heng
  ['p085', ['p119']], // Zhai Liao
  ['p088', ['p095']], // Xu Yan
  ['p002', ['p104']], // Murong Huang
  ['p102', ['p142']], // Murong Lin
  ['p128', ['p139']], // Murong Guo
  ['p099', ['p133']], // Zhang Chong
]);

const NEW_LITERALS = [
  {
    unit: 's0093',
    field: 'literal',
    before: 'His soldiers are weary and his veterans spent—he may be attacked and taken."',
    after: 'His generals are old and his soldiers weary—he may be attacked and taken."',
    reason: '將老兵疲 pairs old generals with weary soldiers; the literal reversed the terms into weary soldiers and spent veterans.',
    confidence: 'high',
  },
  {
    unit: 's0240',
    field: 'literal',
    before: 'Chui smiled and said, "How can this boy accomplish anything—I will be your carp and kill him for you."',
    after: 'Chui smiled and said, "How can this brat accomplish anything—I shall kill him for you all."',
    reason: 'Parallel to accepted idiomatic: 堅子 is contemptuous brat; 為卿等殺之 means kill him for you all, not “be your carp”.',
    confidence: 'high',
  },
];

function fullId(short) {
  return short.includes(':') ? short : `${ns}:${short}`;
}

function retargetId(value, mapping) {
  if (typeof value !== 'string') return value;
  return mapping.get(value) ?? value;
}

function mapNestedIds(value, mapping) {
  if (Array.isArray(value)) return value.map((item) => mapNestedIds(item, mapping));
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = mapNestedIds(v, mapping);
    return out;
  }
  return retargetId(value, mapping);
}

function mergeSameNameClaims(claims) {
  const seen = new Map();
  const out = [];
  for (const claim of claims) {
    if (claim.predicate !== 'name') {
      out.push(claim);
      continue;
    }
    const key = `${claim.subject}\u0000${JSON.stringify(claim.value)}`;
    if (seen.has(key)) {
      const existing = seen.get(key);
      existing.evidence = [...new Set([...existing.evidence, ...claim.evidence])];
      continue;
    }
    seen.set(key, claim);
    out.push(claim);
  }
  return out;
}

function absorbPerson(extraction, keepShort, absorbShorts, mapping) {
  const keep = fullId(keepShort);
  for (const abs of absorbShorts) {
    const from = fullId(abs);
    mapping.set(from, keep);
    for (const mention of extraction.mentions) {
      if (mention.person === from) mention.person = keep;
    }
    for (const claim of extraction.claims) {
      if (claim.subject === from) claim.subject = keep;
      claim.value = mapNestedIds(claim.value, mapping);
    }
    for (const person of extraction.people) {
      person.identityHints.relatedLocalPeople = person.identityHints.relatedLocalPeople.map((id) =>
        retargetId(id, mapping),
      );
    }
    extraction.people = extraction.people.filter((p) => p.localId !== from);
  }
}

function syncFamilyHints(extraction) {
  const byId = new Map(extraction.people.map((p) => [p.localId, p]));
  for (const claim of extraction.claims) {
    if (claim.predicate !== 'family-relationship') continue;
    const target = claim.value?.personId;
    const subject = claim.subject;
    if (!byId.has(subject) || !byId.has(target)) continue;
    const sub = byId.get(subject);
    const obj = byId.get(target);
    if (!sub.identityHints.relatedLocalPeople.includes(target)) {
      sub.identityHints.relatedLocalPeople.push(target);
    }
    if (!obj.identityHints.relatedLocalPeople.includes(subject)) {
      obj.identityHints.relatedLocalPeople.push(subject);
    }
  }
}

function nextClaimId(extraction) {
  return `${ns}:c${String(extraction.claims.length + 1).padStart(4, '0')}`;
}

function main() {
  const chapterFile = path.join(REPO_ROOT, 'data', book, `${chapter}.json`);
  const extractionFile = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
  const chapterData = readJson(chapterFile);
  const stored = readJson(extractionFile);
  const matcher = loadProperNounMatcher();
  const packet = buildPeopleExtractionPacket(book, chapter, {
    chapterData,
    chapterFile,
    properNounMatcher: matcher,
  });
  const extraction = expandPeopleExtraction(stored, packet);

  // 1) Proposed residual literals for the same reviewer
  for (const repair of NEW_LITERALS) {
    const unit = packet.units.find((u) => u.id === repair.unit);
    if (!unit) throw new Error(`missing unit ${repair.unit}`);
    const current = unit.literal;
    if (current !== repair.before) {
      throw new Error(`Literal before mismatch for ${repair.unit}: ${JSON.stringify(current)}`);
    }
    extraction.translationRepairs.push({
      id: `${ns}:r${String(extraction.translationRepairs.length + 1).padStart(4, '0')}`,
      unit: {
        id: unit.id,
        kind: unit.kind,
        blockIndex: unit.blockIndex,
        collection: unit.collection,
        itemIndex: unit.itemIndex,
      },
      field: repair.field,
      before: repair.before,
      after: repair.after,
      reason: repair.reason,
      confidence: repair.confidence,
      status: 'proposed',
    });
  }

  // 2) Merge F4 clusters (explicitly exclude p120→p009)
  const mapping = new Map();
  for (const [keep, absorb] of MERGE_INTO) {
    for (const abs of absorb) {
      if (abs === 'p120' || keep === 'p120') {
        throw new Error('Refuse to merge p120 in F4 pass');
      }
    }
    absorbPerson(extraction, keep, absorb, mapping);
  }
  extraction.claims = mergeSameNameClaims(
    extraction.claims.map((claim) => ({
      ...claim,
      subject: retargetId(claim.subject, mapping),
      value: mapNestedIds(claim.value, mapping),
    })),
  );

  // 3) p120: keep source-form Prince of Taiyuan; strip unsupported Murong Ke preferred name
  const p120 = extraction.people.find((p) => p.localId === fullId('p120'));
  if (!p120) throw new Error('p120 missing after merges');
  p120.preferredNameSuggestion = { en: 'Prince of Taiyuan', zh: '太原王' };
  p120.descriptorSuggestion = 'Source-form title 太原王 at s0221; personal identity unresolved';
  p120.historicity = 'historical';
  // Drop any personal-name claims asserting Murong Ke on p120
  extraction.claims = extraction.claims.filter((claim) => {
    if (claim.subject !== fullId('p120')) return true;
    if (claim.predicate !== 'name') return true;
    const en = claim.value?.en || '';
    const zh = claim.value?.zh || '';
    if (/Murong Ke|慕容恪/.test(`${en}${zh}`)) return false;
    return true;
  });
  // Ensure title name claim remains
  const hasTitle = extraction.claims.some(
    (c) =>
      c.subject === fullId('p120') &&
      c.predicate === 'name' &&
      (c.value?.zh === '太原王' || c.value?.en === 'Prince of Taiyuan'),
  );
  if (!hasTitle) {
    extraction.claims.push({
      id: nextClaimId(extraction),
      subject: fullId('p120'),
      predicate: 'name',
      value: { kind: 'title', en: 'Prince of Taiyuan', zh: '太原王' },
      certainty: 'explicit',
      evidence: [`${ns}:s0221`],
    });
  }
  // Remove unsupported p111→p120 (now possibly remapped if p111 merged into p046) parent claim
  extraction.claims = extraction.claims.filter((claim) => {
    if (claim.predicate !== 'family-relationship') return true;
    const sub = claim.subject;
    const obj = claim.value?.personId;
    // Original was p111 child-of p120; after merge p111→p046
    if (obj === fullId('p120') && (sub === fullId('p111') || sub === fullId('p046'))) {
      return false;
    }
    return true;
  });
  // Drop mutual relatedLocalPeople links between p120 and Murong Kai cluster
  for (const person of extraction.people) {
    if (person.localId === fullId('p120')) {
      person.identityHints.relatedLocalPeople = person.identityHints.relatedLocalPeople.filter(
        (id) => id !== fullId('p111') && id !== fullId('p046'),
      );
    }
    if (person.localId === fullId('p046')) {
      person.identityHints.relatedLocalPeople = person.identityHints.relatedLocalPeople.filter(
        (id) => id !== fullId('p120'),
      );
    }
  }
  // Preserve explicit uncertainty on p120 attestation
  for (const claim of extraction.claims) {
    if (claim.subject !== fullId('p120') || claim.predicate !== 'attestation') continue;
    claim.value = {
      sourceDate: { text: '太原王' },
      unresolved: true,
      unresolvedReason:
        's0221 supplies only the title 太原王; identifying this figure as Murong Ke (or any other named person) is not supported by this chapter alone and remains unresolved for independent identity review.',
      event: claim.value?.event || 'Retrospective title reference',
    };
    claim.certainty = 'uncertain';
  }

  // 4) family-summary for Zhai Zhao p126 on s0244 (攜妻子)
  const p126 = extraction.people.find((p) => p.localId === fullId('p126'));
  if (!p126) throw new Error('p126 missing');
  const hasFamilySummary = extraction.claims.some(
    (c) => c.subject === fullId('p126') && c.predicate === 'family-summary',
  );
  if (!hasFamilySummary) {
    extraction.claims.push({
      id: nextClaimId(extraction),
      subject: fullId('p126'),
      predicate: 'family-summary',
      value: {
        kinshipRole: 'wife',
        count: 1,
        note: 's0244 攜妻子: unnamed wife taken north toward Bailu Mountain',
      },
      certainty: 'explicit',
      evidence: [`${ns}:s0244`],
    });
    extraction.claims.push({
      id: nextClaimId(extraction),
      subject: fullId('p126'),
      predicate: 'family-summary',
      value: {
        kinshipRole: 'children',
        quantity: 'unspecified',
        note: 's0244 攜妻子: unnamed children taken with him; count not stated',
      },
      certainty: 'explicit',
      evidence: [`${ns}:s0244`],
    });
  }

  syncFamilyHints(extraction);

  // Drop empty related hints that point to deleted people
  const live = new Set(extraction.people.map((p) => p.localId));
  for (const person of extraction.people) {
    person.identityHints.relatedLocalPeople = person.identityHints.relatedLocalPeople.filter((id) =>
      live.has(id),
    );
  }

  // Drop claims whose subjects vanished
  extraction.claims = extraction.claims.filter((claim) => live.has(claim.subject));
  extraction.mentions = extraction.mentions.filter((mention) => live.has(mention.person));

  // Clear mentionException when mentions exist
  const mentioned = new Set(extraction.mentions.map((m) => m.person));
  for (const person of extraction.people) {
    if (mentioned.has(person.localId) && person.mentionException) delete person.mentionException;
  }

  // Re-account leftover candidates if uniquely contained
  const disposed = new Set(extraction.candidateDispositions.map((d) => d.candidate));
  for (const mention of extraction.mentions) {
    for (const id of mention.candidateRefs) disposed.add(id);
  }
  for (const candidate of packet.preflight.candidates) {
    if (disposed.has(candidate.id)) continue;
    const containing = extraction.mentions.filter((mention) => {
      if (mention.unit.id !== candidate.unit) return false;
      return mention.spans[candidate.language].some(
        (span) =>
          span.startCodePoint <= candidate.startCodePoint &&
          span.endCodePoint >= candidate.endCodePoint,
      );
    });
    if (containing.length === 1) {
      containing[0].candidateRefs.push(candidate.id);
      disposed.add(candidate.id);
    }
  }

  extraction.mentions.forEach((mention, index) => {
    mention.id = `${ns}:m${String(index + 1).padStart(4, '0')}`;
  });
  extraction.claims.forEach((claim, index) => {
    claim.id = `${ns}:c${String(index + 1).padStart(4, '0')}`;
  });
  extraction.translationRepairs.forEach((repair, index) => {
    repair.id = `${ns}:r${String(index + 1).padStart(4, '0')}`;
  });

  const validated = validatePeopleExtraction(extraction, packet, { strictAliasDispositions: true });
  const compact = compactPeopleExtraction(validated.normalized, packet);
  writeTextAtomic(extractionFile, serializeCompactPeopleExtraction(compact));

  const receipt = {
    schemaVersion: 1,
    kind: 'jinshu123-owner-round2-curation',
    book,
    chapter,
    curatedAt: new Date().toISOString(),
    agentId: 'bc-64160cca-fb61-4c6e-ba29-27cd0fc0ada1',
    baseAfterEditorialApply: true,
    priorReview: {
      pr: 5444,
      revision: '8eabe20e957fa8baa0243e5fe98c886c60cf8a39',
      accepts: 45,
      claimRevisions: 4,
    },
    operations: {
      proposedLiteralRepairs: NEW_LITERALS.map((r) => `${r.unit}/${r.field}`),
      localMerges: [...MERGE_INTO.entries()].map(([keep, absorb]) => ({ keep, absorb })),
      p120Correction:
        'Preferred name reset to source-form Prince of Taiyuan / 太原王; Murong Ke assertion removed; p111/p046→p120 child-of claim removed; attestation unresolved',
      familySummaryAdded: 'p126 s0244 攜妻子',
      excludedFromMerges: ['p120 not merged into p009'],
    },
    validation: validated.stats,
    extractionSha256: sha256(serializeCompactPeopleExtraction(compact)),
    chapterFingerprint: packet.input.chapterFingerprint,
  };
  const outDir = path.join(REPO_ROOT, 'research/people/checkpoints/jinshu123-owner-round2-20261123');
  fs.mkdirSync(outDir, { recursive: true });
  writeJsonAtomic(path.join(outDir, 'curation-receipt.json'), receipt);
  console.log(
    JSON.stringify(
      {
        ok: true,
        stats: validated.stats,
        receipt: path.relative(REPO_ROOT, path.join(outDir, 'curation-receipt.json')),
      },
      null,
      2,
    ),
  );
}

main();
