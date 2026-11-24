#!/usr/bin/env node
/**
 * Jinshu 047 owner apply: 13 review-proposed source-only chronology corrections
 * from research/people/jinshu047-independent-remaining-hold-native-candidates-20261124.json
 * (independent evidence f16848b526f34bad6919e8243e7dcb6aa198dcb8) at PR tip 9da941f77e.
 *
 * Preserve accepted English and all non-listed date facts. No invented Western years
 * beyond claim-527 reuse of already-supported 正始中 AD 240–249. No self-approval/merge.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, writeJsonAtomic } from './lib/people-content.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';

const book = 'jinshu';
const chapter = '047';
const candidates = readJson(
  'research/people/jinshu047-independent-remaining-hold-native-candidates-20261124.json',
);
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const extraction = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter, { extraction });

if (packet.extractionHash !== candidates.fingerprints.extractionHash) {
  throw new Error(`extractionHash drift: live ${packet.extractionHash} vs receipt ${candidates.fingerprints.extractionHash}`);
}
if (packet.sourceHash !== candidates.fingerprints.sourceHash) {
  throw new Error(`sourceHash drift`);
}

const APPLY_IDS = candidates.assessmentSummary.exactNativeCandidates.map((id) =>
  Number(id.replace('claim-', '')),
);
const PRESERVE_VERIFIED_14 = candidates.constraintsHonored.preservedVerified14Edits.map((id) =>
  Number(id.replace('claim-', '')),
);
const CONVERTED_21 = [
  102, 106, 111, 114, 150, 192, 196, 211, 239, 254, 257, 260, 263, 265,
  416, 476, 477, 877, 883, 884, 885,
];
const CLAIM_148 = structuredClone(extraction.claims[147]);
const ENGLISH_BEFORE = extraction.translationRepairs.filter((row) => row[6] === 'applied').length;

function indentClaim(claim) {
  return JSON.stringify(claim, null, 2)
    .split('\n')
    .map((line) => `    ${line}`)
    .join('\n');
}

function indentPerson(person) {
  return JSON.stringify(person, null, 2)
    .split('\n')
    .map((line) => `    ${line}`)
    .join('\n');
}

const final = structuredClone(extraction);
const changes = [];
const hintChanges = [];

for (const claimId of candidates.assessmentSummary.exactNativeCandidates) {
  const cand = candidates.candidatesById[claimId];
  const idx = Number(claimId.replace('claim-', '')) - 1;
  const beforeRow = structuredClone(final.claims[idx]);
  if (JSON.stringify(beforeRow[2]) !== JSON.stringify(cand.before)) {
    throw new Error(`${claimId} before-state mismatch`);
  }
  const afterRow = structuredClone(beforeRow);
  afterRow[2] = structuredClone(cand.after);
  final.claims[idx] = afterRow;
  changes.push({ id: claimId, before: beforeRow, after: afterRow, form: cand.form });

  if (cand.hintUpdates) {
    const person = final.people.find((p) => p[0] === cand.hintUpdates.personId);
    if (!person) throw new Error(`missing person ${cand.hintUpdates.personId}`);
    const beforePerson = structuredClone(person);
    const hints = person[4]?.a || [];
    const normalizeHint = (s) => String(s).replace(/Yang\s*Jun/gi, 'Yangjun');
    const liveNorm = hints.map(normalizeHint);
    const receiptNorm = cand.hintUpdates.from.map(normalizeHint);
    if (JSON.stringify(liveNorm) !== JSON.stringify(receiptNorm)) {
      throw new Error(`hint from-mismatch for ${cand.hintUpdates.personId}: live=${JSON.stringify(hints)} receipt=${JSON.stringify(cand.hintUpdates.from)}`);
    }
    person[4].a = structuredClone(cand.hintUpdates.to);
    hintChanges.push({
      personId: cand.hintUpdates.personId,
      claimId,
      before: beforePerson,
      after: structuredClone(person),
      fromLive: hints,
      fromReceipt: cand.hintUpdates.from,
      to: cand.hintUpdates.to,
      fromOrthographyNote: JSON.stringify(hints) === JSON.stringify(cand.hintUpdates.from)
        ? null
        : 'live extraction uses spaced Yang Jun orthography; receipt from-text collapsed Yangjun — applied against live text',
    });
  }
}

if (JSON.stringify(final.claims[147]) !== JSON.stringify(CLAIM_148)) {
  throw new Error('claim-148 drifted');
}
for (const id of CONVERTED_21) {
  if (final.claims[id - 1][2]?.undatedSourceAttestation !== true) {
    throw new Error(`undated conversion claim-${id} drifted`);
  }
}

const english = final.translationRepairs.filter((row) => row[6] === 'applied').length;
if (english !== ENGLISH_BEFORE || english !== 16) {
  throw new Error(`English drifted: ${english}`);
}

for (const id of PRESERVE_VERIFIED_14) {
  if (APPLY_IDS.includes(id)) continue;
  if (JSON.stringify(final.claims[id - 1]) !== JSON.stringify(extraction.claims[id - 1])) {
    throw new Error(`verified disposition claim-${id} drifted`);
  }
}

for (const claimId of candidates.assessmentSummary.exactNativeCandidates) {
  const cand = candidates.candidatesById[claimId];
  const idx = Number(claimId.replace('claim-', '')) - 1;
  if (JSON.stringify(final.claims[idx][2]) !== JSON.stringify(cand.after)) {
    throw new Error(`${claimId} after-state mismatch`);
  }
  const value = final.claims[idx][2] || {};
  const dc = value.dateContext || {};
  if (value.unresolved === true || dc.unresolved === true) {
    throw new Error(`${claimId} still unresolved after apply`);
  }
  if (claimId === 'claim-527') {
    if (!dc.westernInterval || dc.westernInterval.start?.year !== 240 || dc.westernInterval.end?.year !== 249) {
      throw new Error('claim-527 missing reused Zhengshi interval');
    }
    continue;
  }
  if (value.westernBounds || value.westernYear || value.westernInterval
    || dc.westernBounds || dc.westernYear || dc.westernInterval) {
    throw new Error(`${claimId} invented Western chronology`);
  }
}

const untouchedClaims = [];
for (let i = 0; i < extraction.claims.length; i += 1) {
  const id = i + 1;
  if (APPLY_IDS.includes(id)) continue;
  if (JSON.stringify(final.claims[i]) !== JSON.stringify(extraction.claims[i])) {
    throw new Error(`untouched claim-${id} changed`);
  }
  untouchedClaims.push(`claim-${id}`);
}

const extPacket = buildPeopleExtractionPacket(book, chapter, {
  properNounMatcher: loadProperNounMatcher(),
});
validateCompactPeopleExtraction(final, extPacket, { strictAliasDispositions: true });

let pretty = readFileSync(extractionPath, 'utf8');
for (const change of changes) {
  const beforeIndented = indentClaim(change.before);
  const afterIndented = indentClaim(change.after);
  if (!pretty.includes(beforeIndented)) {
    throw new Error(`surgical miss for ${change.id}`);
  }
  pretty = pretty.replace(beforeIndented, afterIndented);
}
for (const hint of hintChanges) {
  const beforeIndented = indentPerson(hint.before);
  const afterIndented = indentPerson(hint.after);
  if (!pretty.includes(beforeIndented)) {
    throw new Error(`surgical person miss for ${hint.personId}`);
  }
  pretty = pretty.replace(beforeIndented, afterIndented);
}

const verify = JSON.parse(pretty);
for (const id of APPLY_IDS) {
  if (JSON.stringify(verify.claims[id - 1]) !== JSON.stringify(final.claims[id - 1])) {
    throw new Error(`surgical verify mismatch for claim-${id}`);
  }
}
if (JSON.stringify(verify.claims[147]) !== JSON.stringify(CLAIM_148)) {
  throw new Error('surgical write drifted claim-148');
}
for (const hint of hintChanges) {
  const person = verify.people.find((p) => p[0] === hint.personId);
  if (JSON.stringify(person[4].a) !== JSON.stringify(hint.to)) {
    throw new Error(`surgical hint miss for ${hint.personId}`);
  }
}
if (JSON.stringify(verify.translationRepairs) !== JSON.stringify(extraction.translationRepairs)) {
  throw new Error('translationRepairs drifted in surgical write');
}
writeFileSync(extractionPath, pretty);

const afterPacket = buildDateAuditPacket(book, chapter);

const receipt = {
  schemaVersion: 1,
  kind: 'owner-remaining-hold-native-apply-receipt',
  book,
  chapter,
  pullRequest: 5423,
  baseOwnerCommit: '9da941f77e4e64ad65430940cd27ddd9370b88c8',
  independentEvidenceCommit: 'f16848b526f34bad6919e8243e7dcb6aa198dcb8',
  independentCandidates: 'research/people/jinshu047-independent-remaining-hold-native-candidates-20261124.json',
  beforeExtractionHash: packet.extractionHash,
  afterExtractionHash: afterPacket.extractionHash,
  sourceHash: afterPacket.sourceHash,
  approvalStatus: 'not-self-approved',
  exactChangedIds: candidates.assessmentSummary.exactNativeCandidates.slice(),
  changedByForm: Object.fromEntries(
    candidates.assessmentSummary.exactNativeCandidates.map((id) => {
      const cand = candidates.candidatesById[id];
      return [id, {
        form: cand.form,
        personId: final.claims[Number(id.replace('claim-', '')) - 1][0],
        predicate: final.claims[Number(id.replace('claim-', '')) - 1][1],
        packageWith: cand.packageWith || null,
        hintUpdate: cand.hintUpdates
          ? {
            personId: cand.hintUpdates.personId,
            fromReceipt: cand.hintUpdates.from,
            to: cand.hintUpdates.to,
          }
          : null,
        reusedFrom: cand.reusedFrom || null,
      }];
    }),
  ),
  hintUpdatesApplied: hintChanges.map((h) => ({
    personId: h.personId,
    claimId: h.claimId,
    fromLive: h.fromLive,
    fromReceipt: h.fromReceipt,
    fromOrthographyNote: h.fromOrthographyNote,
    to: h.to,
  })),
  preserved: {
    claim148: true,
    approvedEnglishApplied: english,
    undatedConversions21: CONVERTED_21.map((id) => `claim-${id}`),
    verifiedDispositionEditsUnchangedExceptOverlaps: PRESERVE_VERIFIED_14
      .filter((id) => !APPLY_IDS.includes(id))
      .map((id) => `claim-${id}`),
    overlappingVerifiedThenClosed: PRESERVE_VERIFIED_14
      .filter((id) => APPLY_IDS.includes(id))
      .map((id) => `claim-${id}`),
    untouchedClaimCount: untouchedClaims.length,
    noInventedWesternExceptClaim527Reuse: true,
  },
  notDone: [
    'no self-approval',
    'no merge',
    'no full chapter re-audit',
    'no invented AD dates for 五等建 / regency / 會丙寅',
    'focused independent re-check of these 13 still required',
  ],
};

writeJsonAtomic('research/people/jinshu047-owner-remaining-hold-native-apply-receipt-20261124.json', receipt);

console.log(JSON.stringify({
  changedIds: receipt.exactChangedIds,
  hintUpdates: receipt.hintUpdatesApplied,
  beforeExtractionHash: packet.extractionHash,
  afterExtractionHash: afterPacket.extractionHash,
  english,
}, null, 2));
console.log('PASS');
