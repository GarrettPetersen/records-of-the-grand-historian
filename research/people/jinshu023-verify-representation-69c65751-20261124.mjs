#!/usr/bin/env node
/**
 * Narrow independent verification: 18 phase-4 representation ops at pin 69c65751.
 * No full audit replay. Compares owner receipts to retained b7b699 phase-4 findings.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { buildDateAuditPacket } from '../../scripts/lib/people-date-audit.mjs';
const PIN = '69c657510f3acda54f223edfdf19f7d70686ace0';
const PRIOR_FINDINGS = 'b7b699dbd233eb4a5f46df83ae6dae5cfb94fc72';

execSync(`git show ${PIN}:data/people/extractions/jinshu/023.json > data/people/extractions/jinshu/023.json.pinverify`);
const extractionJson = readFileSync('data/people/extractions/jinshu/023.json.pinverify', 'utf8');
const priorExtraction = execSync(`git show ${PRIOR_FINDINGS}:data/people/extractions/jinshu/023.json`, { encoding: 'utf8' });

// Temporarily swap extraction for packet build
const livePath = 'data/people/extractions/jinshu/023.json';
const liveBackup = readFileSync(livePath, 'utf8');
writeFileSync(livePath, extractionJson);

const packet = buildDateAuditPacket('jinshu', '023');
writeFileSync(livePath, liveBackup);

const rep = JSON.parse(
  readFileSync('research/people/jinshu023-owner-phase4-sourcedate-representation-receipt-20261124-pin.json', 'utf8'),
);
const residual = JSON.parse(
  readFileSync('research/people/jinshu023-owner-phase4-residual-chronology-receipt-20261124-pin.json', 'utf8'),
);
const phase4 = JSON.parse(
  readFileSync('research/people/jinshu023-independent-chapter-evidence-20261123-phase4-incomplete.json', 'utf8'),
);

const prior14 = new Set(phase4.remainingChronologyFindings.remainingInterpretiveWesternImport.ids);
const unitZh = Object.fromEntries(packet.units.map((u) => [u.id, u.zh]));

const changed18 = [
  ...rep.representationApplied.undatedAttestationHymnNamed.ids,
  ...rep.representationApplied.undatedAttestationCommemorative.ids,
  ...rep.representationApplied.exactChineseUnresolved.ids,
];
const linked3 = rep.representationApplied.leaveExactLinked.ids;
const scope21 = [...new Set([...changed18, ...linked3])].sort();
const residualIds = residual.operations.map((o) => o.id).sort();

function sdText(v) {
  return v?.sourceDate?.text ?? v?.dateContext?.sourceDate?.text ?? '';
}
function hasWestern(v) {
  return Boolean(
    v?.westernYear || v?.westernBounds || v?.dateContext?.westernYear || v?.dateContext?.westernBounds,
  );
}

const errors = [];
if (new Set(scope21).size !== 21) errors.push('representation scope is not 21 unique ids');
if (residualIds.join(',') !== scope21.join(',')) errors.push('residual dependency receipt ids differ from representation scope');

const undatedVerified = [];
for (const id of [...rep.representationApplied.undatedAttestationHymnNamed.ids, ...rep.representationApplied.undatedAttestationCommemorative.ids]) {
  const it = packet.items.find((i) => i.id === id);
  const v = it.value;
  const zh = it.evidence.map((u) => unitZh[u]).join('');
  const row = {
    id,
    undatedSourceAttestation: v?.undatedSourceAttestation === true,
    noWestern: !hasWestern(v),
    emptyOrAbsentSourceDate: !sdText(v),
    eventHasSubstance: typeof v?.event === 'string' && v.event.length >= 20,
    witnessUnit: it.evidence[0],
    witnessQuote: zh.slice(0, Math.min(16, zh.length)),
  };
  if (!row.undatedSourceAttestation) errors.push(`${id}: missing undatedSourceAttestation`);
  if (!row.noWestern) errors.push(`${id}: western field remains`);
  if (sdText(v) && /[A-Za-z]/.test(sdText(v))) errors.push(`${id}: English still in sourceDate`);
  undatedVerified.push(row);
}

const unresolvedVerified = [];
for (const id of rep.representationApplied.exactChineseUnresolved.ids) {
  const it = packet.items.find((i) => i.id === id);
  const v = it.value;
  const zh = it.evidence.map((u) => unitZh[u]).join('');
  const sdt = sdText(v);
  const frag = sdt.includes('桓玄') ? '桓玄將僭位' : '魏晉之世';
  const row = {
    id,
    sourceDate: sdt,
    unresolved: !!(v?.unresolved || v?.dateContext?.unresolved),
    noWestern: !hasWestern(v),
    witnessHasFragment: zh.includes(frag),
    priorPhase4Finding: prior14.has(id),
  };
  if (!row.unresolved) errors.push(`${id}: unresolved flag missing`);
  if (!row.noWestern) errors.push(`${id}: western on unresolved row`);
  if (!row.witnessHasFragment) errors.push(`${id}: cited Chinese lacks ${frag}`);
  if (!sdt || !sdt.includes(frag.slice(0, 2))) errors.push(`${id}: sourceDate not exact Chinese context`);
  unresolvedVerified.push(row);
}

const linkedChecks = [];
for (const id of linked3) {
  const before = JSON.parse(
    execSync(`git show feeb1b155b9a1adaf9a5915a8e879409dfdcd855:data/people/extractions/jinshu/023.json`, {
      encoding: 'utf8',
    }),
  );
  const idx = Number(id.replace('claim-', '')) - 1;
  const afterClaim = JSON.parse(extractionJson).claims[idx];
  const beforeClaim = before.claims[idx];
  const unchanged = JSON.stringify(beforeClaim) === JSON.stringify(afterClaim);
  if (!unchanged) errors.push(`${id}: changed between feeb1b and 69c65751 but marked leaveExactLinked`);
  const it = packet.items.find((i) => i.id === id);
  linkedChecks.push({ id, unchangedSinceFeeb1b: unchanged, sourceDate: sdText(it.value) });
}

const outsideBlockers = [];
for (const id of ['claim-409', 'claim-410']) {
  const it = packet.items.find((i) => i.id === id);
  const v = it.value;
  const zh = it.evidence.map((u) => unitZh[u]).join('');
  const sdt = sdText(v);
  const w = hasWestern(v);
  const classification =
    w && zh.includes('桓玄將僭位') && sdt === '桓玄將僭位'
      ? 'unsupported-western-conversion-not-contradiction'
      : w
        ? 'unsupported-western-import'
        : 'no-western';
  outsideBlockers.push({
    id,
    classification,
    sourceDate: sdt,
    hasWestern: w,
    note: 'Same Chinese context as claim-411–413; bounds are encyclopedic import, not a source contradiction.',
  });
}

const commemIds = new Set(rep.representationApplied.undatedAttestationCommemorative.ids);
const prior14Changed = [...prior14].filter((id) => changed18.includes(id));
const hymnOnly = changed18.filter((id) => !prior14.has(id));

const out = {
  schemaVersion: 1,
  kind: 'jinshu023-independent-representation-verification',
  pinnedCommit: PIN,
  priorFindingsCommit: PRIOR_FINDINGS,
  dependencyReceipt: residual.kind,
  representationReceipt: rep.kind,
  scope: {
    phase4Operations: 21,
    preciseOwnerChanges: changed18.length,
    sourceBackedUndatedConversions: undatedVerified.length,
    exactChineseUnresolvedContexts: unresolvedVerified.length,
    olderLinkedClausesUnchanged: linked3,
    hymnNamedUndated: rep.representationApplied.undatedAttestationHymnNamed.ids.length,
    commemorativeUndated: rep.representationApplied.undatedAttestationCommemorative.ids.length,
  },
  alignmentWithPriorFindings: {
    phase4IncorrectIds: [...prior14],
    addressedIn18: prior14Changed,
    hymnNamedAddedOutsidePrior14: hymnOnly,
    distinction:
      'Prior finding was unsupported Western import on thematic sourceDate, not a contradictory calendar reading in Chinese.',
  },
  undatedVerified,
  unresolvedVerified,
  linkedChecks,
  outsideScopeOwnerBlockers: outsideBlockers,
  preserved: {
    editorialDecisions: 20,
    prior5471Repairs: 102,
    songVariant: { p137: '宋識', p146: '宋職' },
    nativeSourceHash: packet.sourceHash,
    nativeExtractionHash: packet.extractionHash,
    dateAuditOnDisk: false,
  },
  nativeScope: {
    command: 'npm run people:validate -- --book jinshu --chapter 023',
    book: 'jinshu',
    chapter: '023',
    claims: 1050,
    people: 167,
    noRegistryBuild: true,
    noQueueEdits: true,
    noOwnerExtractionEditsByReviewer: true,
  },
  errors,
  ok: errors.length === 0,
};

writeFileSync('research/people/jinshu023-verify-representation-69c65751-20261124-incomplete.json', `${JSON.stringify(out, null, 2)}\n`);
console.log(JSON.stringify({ ok: out.ok, errors: out.errors, undated: undatedVerified.length, unresolved: unresolvedVerified.length }, null, 2));
if (errors.length) process.exit(1);