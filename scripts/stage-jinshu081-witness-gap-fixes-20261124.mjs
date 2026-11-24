#!/usr/bin/env node
/**
 * Jinshu 081: fix four real Chinese witness gaps from independent sweep @9eb48dd.
 *
 * - p238 琰 @ s0433, p355 燾 @ s0548, p358 序 @ arc units: add name.zh + zh surfaces
 * - p354/p358: preserve IDs; propose source-backed same-person reconciliation in receipt
 * - p397: s0601 is era 太興 only — do NOT tag era as person/posthumous; detach false
 *   Emperor Yuan gloss; document dependent memberships on existing 元帝 locals
 *
 * Preserve prior authorized claims/chronology. No prior-review rewrite, canonical
 * writes, or merge.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';

const book = 'jinshu';
const chapter = '081';
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const extraction = readJson(extractionPath);
const beforePacket = buildDateAuditPacket(book, chapter, { extraction });
const unitZh = Object.fromEntries(
  (beforePacket.units || []).map((unit) => [unit.id, unit.zh || '']),
);

const changed = {
  peopleNameZh: [],
  surfacesAdded: [],
  surfacesRemoved: [],
  p397Detached: [],
};

function personRow(pid) {
  const row = extraction.people.find((item) => item[0] === pid);
  if (!row) throw new Error(`Missing ${pid}`);
  return row;
}

function addOrReplaceZhSurface(personId, kind, exact, unitIds) {
  const existing = extraction.surfaces.find(
    (row) => row[0] === personId && row[1] === kind && row[2] === 'zh' && row[3] === exact,
  );
  const occurrences = unitIds.map((unitId) => {
    const text = unitZh[unitId] || '';
    if (!text.includes(exact)) {
      throw new Error(`${personId} zh surface ${exact} not found in ${unitId}: ${text}`);
    }
    return [unitId, [0]];
  });
  if (existing) {
    const merged = new Map(existing[4].map(([unitId, occ]) => [unitId, occ]));
    for (const [unitId, occ] of occurrences) merged.set(unitId, occ);
    existing[4] = [...merged.entries()];
  } else {
    extraction.surfaces.push([personId, kind, 'zh', exact, occurrences]);
  }
  changed.surfacesAdded.push({ personId, kind, exact, unitIds });
}

function setPersonalNameZh(personId, zh, { alsoMononymSurface, mononym, units } = {}) {
  const row = personRow(personId);
  const nameEntry = row[5][0];
  const value = nameEntry[0];
  if (value.zh && value.zh !== zh) {
    throw new Error(`${personId} already has zh ${value.zh}, refusing overwrite with ${zh}`);
  }
  if (!value.zh) {
    value.zh = zh;
    changed.peopleNameZh.push({ personId, zh });
  }
  if (alsoMononymSurface) {
    addOrReplaceZhSurface(personId, 'personal-name', mononym, units);
  }
}

// --- p238: 琰 at s0433 ---
{
  const text = unitZh.s0433;
  if (!/琰/.test(text) || !/安子琰/.test(text)) {
    throw new Error(`p238 anchor proof failed on s0433: ${text}`);
  }
  // Avoid overlap with existing 謝琰 full-name surfaces on other units (p136/p367).
  setPersonalNameZh('p238', '謝琰', {
    alsoMononymSurface: true,
    mononym: '琰',
    units: ['s0433'],
  });
}

// --- p355: 燾 at s0548 (父燾; biography of p354 starts s0547) ---
{
  const text = unitZh.s0548;
  if (!/父燾/.test(text)) throw new Error(`p355 anchor proof failed on s0548: ${text}`);
  const bio = unitZh.s0547;
  if (!/^朱序/.test(bio)) throw new Error(`p354 biography open failed on s0547: ${bio}`);
  setPersonalNameZh('p355', '朱燾', {
    alsoMononymSurface: true,
    mononym: '燾',
    units: ['s0548'],
  });
}

// --- p358: 序 mononyms on arc units; preferred zh 朱序; do not borrow p354 s0547 ---
{
  const nameEntry = personRow('p358')[5][0];
  const evidenceUnits = nameEntry[2];
  const mononymUnits = [];
  for (const unitId of evidenceUnits) {
    const text = unitZh[unitId] || '';
    if (!text.includes('序')) {
      throw new Error(`p358 evidence unit ${unitId} lacks 序: ${text}`);
    }
    // Prefer mononym 序 (actual graph); full 朱序 is on p354@s0547 only in this arc.
    if (text.includes('朱序')) {
      throw new Error(`Unexpected full 朱序 on p358 unit ${unitId}; check overlap with p354`);
    }
    mononymUnits.push(unitId);
  }
  setPersonalNameZh('p358', '朱序', {
    alsoMononymSurface: true,
    mononym: '序',
    units: mononymUnits,
  });

  // Keep existing English surfaces (including units like s0588 where English continues
  // the name without a fresh 序 token). Add zh 序 only where Chinese really has 序.
  const enSurface = extraction.surfaces.find(
    (row) => row[0] === 'p358' && row[1] === 'personal-name' && row[2] === 'en' && row[3] === 'Zhu Xu',
  );
  if (enSurface) {
    const extra = enSurface[4]
      .map((item) => item[0])
      .filter((unitId) => !mononymUnits.includes(unitId) && (unitZh[unitId] || '').includes('序'));
    if (extra.length) {
      addOrReplaceZhSurface('p358', 'personal-name', '序', [...new Set([...mononymUnits, ...extra])]);
    }
  }
}

// --- p397: era 太興 only on s0601; never tag as person/posthumous name ---
{
  const text = unitZh.s0601;
  if (!/太興/.test(text)) throw new Error(`p397 expected 太興 on s0601: ${text}`);
  if (/元帝|司馬睿/.test(text)) {
    throw new Error('s0601 unexpectedly names 元帝/司馬睿; revisit p397 handling');
  }

  // Remove false English posthumous surface tying Emperor Yuan to era gloss unit.
  const beforeLen = extraction.surfaces.length;
  extraction.surfaces = extraction.surfaces.filter((row) => !(
    row[0] === 'p397'
    && row[1] === 'posthumous-name'
    && row[2] === 'en'
    && row[3] === 'Emperor Yuan'
  ));
  if (extraction.surfaces.length !== beforeLen) {
    changed.p397Detached.push({ surfaceRemoved: 'posthumous-name/en/Emperor Yuan@s0601' });
  }

  // Keep preferred identity labels; never set zh from 太興.
  const row = personRow('p397');
  const nameEntry = row[5][0];
  const value = nameEntry[0];
  if (value.zh === '太興') delete value.zh;
  if (!value.en) value.en = 'Emperor Yuan';
  nameEntry[2] = ['s0601'];

  // Explicit mentionException: chapter unit supplies era only; no Chinese person token.
  row[4].x = 's0601 states era 太興 only; English “Emperor Yuan” is a translator gloss, not a primary named mention. No zh person/posthumous span may be minted from the era name.';
  changed.p397Detached.push({
    mentionException: row[4].x,
    nameClaim: 'retained English posthumous stub without zh; 太興 not linked as name',
    reason: 's0601 Chinese is era 太興 only; Emperor Yuan in English is translator gloss',
  });

  // Ensure no zh surface 太興 exists for p397
  extraction.surfaces = extraction.surfaces.filter((rowSurface) => !(
    rowSurface[0] === 'p397' && rowSurface[2] === 'zh' && rowSurface[3] === '太興'
  ));
}

// Overlap guards: no second full-name surfaces on units already owned.
function assertNoOverlap(personId, exact, unitId) {
  const conflicts = extraction.surfaces.filter((row) =>
    row[0] !== personId &&
    row[2] === 'zh' &&
    row[3] === exact &&
    row[4].some(([id]) => id === unitId),
  );
  if (conflicts.length) {
    throw new Error(`Overlap: ${personId} ${exact}@${unitId} conflicts with ${conflicts.map((row) => row[0]).join(',')}`);
  }
}
assertNoOverlap('p238', '琰', 's0433');
assertNoOverlap('p355', '燾', 's0548');
for (const unitId of personRow('p358')[5][0][2]) {
  assertNoOverlap('p358', '序', unitId);
}

const extPacket = buildPeopleExtractionPacket(book, chapter, { properNounMatcher: loadProperNounMatcher() });
validateCompactPeopleExtraction(extraction, extPacket, { strictAliasDispositions: true });
writeTextAtomic(extractionPath, serializeCompactPeopleExtraction(extraction));

const afterPacket = buildDateAuditPacket(book, chapter);

// Materialize independent sweep artifacts for the PR
mkdirSync('research/people/checkpoints/jinshu081-native-identity-20261124', { recursive: true });
writeFileSync(
  'research/people/checkpoints/jinshu081-native-identity-20261124/witness-author-gap-proposals.json',
  readFileSync('/tmp/jinshu081-witness-gaps.json'),
);
writeFileSync(
  'research/people/checkpoints/jinshu081-native-identity-20261124/witness-assert-audit-readonly.json',
  readFileSync('/tmp/jinshu081-witness-audit.json'),
);

const yuanLocals = ['p038', 'p057', 'p092', 'p314'].map((pid) => {
  const row = personRow(pid);
  return {
    localId: pid,
    preferred: row[1],
    nameZh: row[5]?.[0]?.[0]?.zh || null,
    evidenceUnits: row[5]?.[0]?.[2] || [],
  };
});

const receipt = {
  schemaVersion: 1,
  kind: 'owner-witness-gap-receipt',
  book,
  chapter,
  pullRequest: 5478,
  independentSweepCommit: '9eb48ddbcf7b93c4fd3185401389531d60ac49cd',
  independentGapProposals: 'research/people/checkpoints/jinshu081-native-identity-20261124/witness-author-gap-proposals.json',
  beforeExtractionHash: beforePacket.extractionHash,
  afterExtractionHash: afterPacket.extractionHash,
  sourceHash: afterPacket.sourceHash,
  approvalStatus: 'not-self-approved',
  exactChangedIds: {
    people: ['p238', 'p355', 'p358', 'p397'],
    nameClaimZhAdded: changed.peopleNameZh,
    surfacesAdded: changed.surfacesAdded,
    surfacesRemoved: changed.surfacesRemoved,
    p397: changed.p397Detached,
  },
  identityImpact: {
    p238: {
      change: 'Linked mononym 琰 on s0433; name.zh 謝琰',
      overlapAvoided: 'Did not add full 謝琰 surface on s0433 (text has 琰 only); distinct from p136/p367 謝琰 on other units',
      dateImpact: 'none — chronology/claims unchanged',
    },
    p355: {
      change: 'Linked mononym 燾 on s0548; name.zh 朱燾',
      context: 's0547 opens 朱序 biography (p354); s0548 父燾 is father line',
      dateImpact: 'none — chronology/claims unchanged',
    },
    p354_p358: {
      preservedIds: ['p354', 'p358'],
      observation: 'Locally split Zhu Xu: p354 biography (朱序 @ s0547+) vs p358 narrative arc (序 mononyms)',
      proposedReconciliation: {
        kind: 'same-person-candidate',
        left: 'p354',
        right: 'p358',
        witnesses: [
          { unitId: 's0547', zh: unitZh.s0547, role: 'biography open 朱序' },
          { unitId: 's0562', zh: unitZh.s0562, role: 'arc mononym 序 continuation' },
        ],
        note: 'Propose identity merge/same-person after independent identity review; owner preserves both local IDs this pass (no canonical write).',
      },
      dateImpact: 'p358 retains existing AD 393 death chronology untouched',
    },
    p397: {
      change: 'Refused gap proposal to tag 太興 as posthumous/person name; detached English Emperor Yuan surface from s0601',
      chineseOnS0601: unitZh.s0601,
      finding: 's0601 contains era 太興 only; English “Emperor Yuan\'s Taixing” is translator gloss, not a primary named mention',
      dependentCanonicalMemberships: {
        existingYuanEmperorLocalsWith元帝: yuanLocals,
        recommendation: 'p397 should not mint a new Emperor Yuan witness from s0601; identity membership depends on existing 元帝-backed locals (p038/p057/p092/p314). No canonical write this pass.',
      },
      dateImpact: 'p397 undated attestation/status claims preserved; no Western invented; no era→person chronology upgrade',
    },
  },
  preserved: {
    priorAuthorizedClaims: true,
    chronologyUntouchedExceptWitnessLinkage: true,
    noCanonicalWrites: true,
    noPriorReviewRewrite: true,
  },
  notDone: [
    'no merge',
    'no canonical identity publication',
    'p397 remains English-stub until independent identity reconciliation',
    'p354/p358 same-person not sealed',
  ],
};

writeJsonAtomic('research/people/jinshu081-owner-witness-gap-receipt-20261124.json', receipt);

console.log(JSON.stringify({
  changed: receipt.exactChangedIds,
  beforeExtractionHash: beforePacket.extractionHash,
  afterExtractionHash: afterPacket.extractionHash,
}, null, 2));
console.log('PASS');
