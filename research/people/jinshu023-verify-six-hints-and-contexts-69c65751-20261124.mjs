#!/usr/bin/env node
/**
 * Narrow follow-up: six hint rows + unresolved contexts named in phase4b only.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { buildDateAuditPacket } from '../../scripts/lib/people-date-audit.mjs';

const PIN = '69c657510f3acda54f223edfdf19f7d70686ace0';
const PRIOR_EVIDENCE = 'cf34382f02672845023f425ec96a3ce79dab19da';

const livePath = 'data/people/extractions/jinshu/023.json';
const backup = readFileSync(livePath, 'utf8');
writeFileSync(livePath, execSync(`git show ${PIN}:data/people/extractions/jinshu/023.json`, { encoding: 'utf8' }));

const packet = buildDateAuditPacket('jinshu', '023');
writeFileSync(livePath, backup);

const unitZh = Object.fromEntries(packet.units.map((u) => [u.id, u.zh]));
const HINT_PERSONS = ['p027', 'p028', 'p030', 'p032', 'p137', 'p146'];

function claimWestern(v) {
  return Boolean(
    v?.westernYear || v?.westernBounds || v?.dateContext?.westernYear || v?.dateContext?.westernBounds,
  );
}

const hintFindings = [];
for (const pid of HINT_PERSONS) {
  const person = packet.people.find((p) => p.id === pid);
  const hints = person?.hints ?? [];
  const claims = packet.items.filter((i) => i.personId === pid && !i.id.startsWith('hints'));
  const anchor = claims[0]?.evidence?.[0];
  const zh = anchor ? unitZh[anchor] : '';
  const frag =
    pid === 'p137' ? '宋識' : pid === 'p146' ? '宋職' : zh.slice(0, Math.min(12, zh.length));
  const undatedMain = claims.find((c) => c.predicate === 'attestation' && c.value?.undatedSourceAttestation);
  const hasDated = claims.some((c) => claimWestern(c.value));

  let verdict;
  let ownerFinding;
  if (['p027', 'p028', 'p030', 'p032'].includes(pid)) {
    if (hints.length === 0 && undatedMain && !hasDated) {
      verdict = 'supported';
      ownerFinding =
        'Stale Western active-date hints cleared; consistent with verified undated hymn-named attestation (claims 121/125/135/141 in the 18-op set).';
    } else if (hints.some((h) => /(?:AD|BC)\s*\d/.test(String(h)))) {
      verdict = 'incorrect';
      ownerFinding = 'Western active-date hint remains while owned attestations are undated without source-pinned bounds.';
    } else {
      verdict = 'research-blocked';
      ownerFinding = 'Hint state does not match expected post-18-op undated alignment.';
    }
  } else if (pid === 'p137') {
    verdict = 'research-blocked';
    ownerFinding =
      'Song-variant hold (宋識 p137): empty hint acceptable; claim-530 keeps exact 魏晉之世 unresolved — do not merge with p146 or re-import Western scheduling.';
  } else {
    const qualitative = hints.every((h) => !/(?:AD|BC)\s*\d/.test(String(h)));
    verdict = qualitative ? 'supported' : 'incorrect';
    ownerFinding = qualitative
      ? 'Qualitative non-calendar hint documents missing reign-year conversion; claim-556 keeps exact 魏晉之世 unresolved with 宋職.'
      : 'Remove Western digits from Song Zhi hint row.';
  }

  hintFindings.push({
    id: `hints-${pid}`,
    personId: pid,
    verdict,
    hints,
    witnessUnit: anchor,
    witnessQuote: frag,
    undatedAttestationClaim: undatedMain?.id ?? null,
    ownerFinding,
  });
}

const contextFindings = [];
for (const id of ['claim-409', 'claim-410']) {
  const it = packet.items.find((i) => i.id === id);
  const zh = it.evidence.map((u) => unitZh[u]).join('');
  const v = it.value;
  contextFindings.push({
    id,
    verdict: claimWestern(v) ? 'incorrect' : 'supported',
    classification: 'unsupported-western-conversion-not-contradiction',
    sourceDate: v?.sourceDate?.text,
    witnessHas: zh.includes('桓玄將僭位'),
    ownerFinding:
      claimWestern(v)
        ? 'Align with claim-411–413: drop westernBounds while keeping exact 桓玄將僭位, or unresolved hold without encyclopedic bounds.'
        : 'Resolved.',
  });
}

const s0429 = packet.units.find((u) => u.id === 's0429');
const citing = packet.items.filter((i) => !i.id.startsWith('hints') && i.evidence?.includes('s0429'));
const temporalCiting = citing.filter(
  (i) => i.value?.sourceDate?.text || i.value?.dateContext?.sourceDate?.text,
);
contextFindings.push({
  id: 'unit-s0429',
  verdict: temporalCiting.length ? 'supported' : 'research-blocked',
  explicitChinese: s0429?.zh,
  citingClaimIds: citing.map((c) => c.id),
  temporalCitingIds: temporalCiting.map((c) => c.id),
  ownerFinding:
    temporalCiting.length >= 2
      ? 'Packet now links 泰始中 via claim-424/467 with unresolved dateContext (linked clauses from phase4b); calendar line is composition metadata, not a blocked omission.'
      : 'No temporal claim cites s0429; restore packet linkage or document metadata-only line.',
});

const openActions = [
  ...contextFindings.filter((c) => c.verdict === 'incorrect').map((c) => ({ scope: c.id, action: c.ownerFinding })),
  ...hintFindings.filter((h) => h.verdict === 'research-blocked').map((h) => ({ scope: h.id, action: h.ownerFinding })),
  {
    scope: 'native-date-record',
    action:
      'Host `people:dates:record` at extractionHash sha256:b5448a172a9382dd36028ca5b4cde88a87e4c5d864479fdd18fdfbfe0c9aef08; no `dateAudits/jinshu/023.json` on pin.',
  },
];

const out = {
  schemaVersion: 1,
  kind: 'jinshu023-independent-consolidated-owner-findings',
  pinnedStagingCommit: PIN,
  priorIndependentEvidence: PRIOR_EVIDENCE,
  preservedWithoutRereview: {
    representationChangesVerified: 18,
    prior5471Checks: 102,
    editorialDecisionsApplied: 20,
  },
  approvalStatus: 'not-approved',
  hintPlane: hintFindings,
  unresolvedSourceContexts: contextFindings,
  consolidatedOwnerFindings: openActions,
  nativeScope: {
    book: 'jinshu',
    chapter: '023',
    nativeExtractionHash: packet.extractionHash,
    scopedValidateOnly: true,
  },
};

writeFileSync(
  'research/people/jinshu023-consolidated-owner-findings-69c65751-20261124-incomplete.json',
  `${JSON.stringify(out, null, 2)}\n`,
);
console.log(JSON.stringify({ hints: hintFindings.map((h) => [h.id, h.verdict]), contexts: contextFindings }, null, 2));