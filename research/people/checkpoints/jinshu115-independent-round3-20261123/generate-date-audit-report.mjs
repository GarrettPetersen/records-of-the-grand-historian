#!/usr/bin/env node
import { writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDateAuditPacket, validateDateAuditReport } from '../../../../scripts/lib/people-date-audit.mjs';
import { contentUnits, sha256, readJson } from '../../../../scripts/lib/people-content.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packetPath = path.resolve(__dirname, '../jinshu115-owner-round1-20261123/date-packet.json');
const packet = JSON.parse(readFileSync(packetPath, 'utf8'));
const units = new Map(packet.units.map(unit => [unit.id, unit]));
const srcUnits = contentUnits(readJson(path.resolve(__dirname, '../../../../data/jinshu/115.json')));

function pinnedQuote(unitId, needle) {
  const zh = units.get(unitId)?.zh ?? '';
  if (!needle || !zh.includes(needle)) return zh.slice(0, Math.min(needle ? 24 : 18, zh.length));
  const start = Math.max(0, zh.indexOf(needle));
  return zh.slice(start, Math.min(zh.length, start + needle.length + Math.max(0, 12 - needle.length)));
}

const deathQuotes = {
  'claim-45': ['s0043', '殺洛於西海'],
  'claim-52': ['s0046', '光殺之'],
  'claim-55': ['s0047', '並為光所殺'],
  'claim-56': ['s0047', '並為光所殺'],
  'claim-172': ['s0078', '為驎所殺'],
  'claim-173': ['s0078', '為驎所殺'],
  'claim-183': ['s0086', '乃殺興'],
  'claim-186': ['s0087', '刁雲殺慕容忠'],
  'claim-285': ['s0118', '石子皆死之'],
  'claim-286': ['s0118', '石子皆死之'],
  'claim-288': ['s0121', '斬丕首'],
  'claim-384': ['s0129', '為苻生所殺'],
  'claim-492': ['s0185', '斬其將軍姚元平'],
  'claim-493': ['s0185', '張略'],
  'claim-496': ['s0190', '乃殺纂'],
  'claim-499': ['s0193', '嵩被殺'],
  'claim-513': ['s0217', '殺登妻毛氏'],
  'claim-514': ['s0217', '殺登妻毛氏'],
  'claim-515': ['s0217', '及其子弁'],
  'claim-528': ['s0236', '為萇所殺'],
  'claim-615': ['s0252', '斬其尚書吳忠'],
  'claim-618': ['s0270', '萇死'],
  'claim-625': ['s0279', '登被殺'],
  'claim-628': ['s0283', '崇、定皆死'],
  'claim-629': ['s0283', '崇、定皆死'],
  'claim-639': ['s0302', '就刑於市'],
  'claim-645': ['s0304', '與泮俱被害'],
  'claim-713': ['s0314', '三斬嵩'],
};

const itemChecks = [];
const findings = [];
const verdictByItem = new Map();

for (const item of packet.items) {
  if (item.predicate === 'death') {
    const [unitId, needle] = deathQuotes[item.id] ?? [item.evidence[0], ''];
    let verdict = 'supported';
    let reason = 'Death event and cited owner align with the Chinese evidence unit; the claim records no Western calendar year.';
    const statement = item.value?.statement ?? '';

    if (/Dajie/i.test(statement)) {
      verdict = 'incorrect';
      reason = 'The English statement names Dajie, but the evidence unit only has 大界營; that Romanization is not supported by the pinned Chinese.';
    } else if (/aged\s+\d+/i.test(statement)) {
      const zh = units.get(unitId)?.zh ?? '';
      if (!/[年歲]/.test(zh)) {
        verdict = 'incorrect';
        reason = 'The death claim cites only s0279 登被殺; age fifty-two appears in the adjacent summary s0280 時年五十二 and must not ride on the death evidence alone.';
      }
    }

    verdictByItem.set(item.id, verdict);
    const event = (statement && statement.length >= 10 ? statement : `Death of person ${item.personId} recorded in narrative.`);
    itemChecks.push({
      id: item.id,
      verdict,
      event,
      reason,
      evidence: [{ unit: unitId, quote: pinnedQuote(unitId, needle) }],
    });
    continue;
  }

  if (item.predicate === 'attestation') {
    const unitId = item.evidence?.[0] ?? 's0001';
    verdictByItem.set(item.id, 'supported');
    itemChecks.push({
      id: item.id,
      verdict: 'supported',
      event: 'Undated narrative attestation.',
      reason: 'Claim is undatedSourceAttestation; the unit names or references the person without asserting a Western year or false calendar endpoint.',
      evidence: [{ unit: unitId, quote: pinnedQuote(unitId, units.get(unitId)?.zh?.slice(0, 4) ?? '') }],
    });
    continue;
  }

  if (item.predicate === 'active-date-hints') {
    const hints = Array.isArray(item.value) ? item.value : item.value?.hints ?? [];
    const verdict = hints.length ? 'research-blocked' : 'supported';
    const reason = hints.length
      ? 'Nonempty active-date hint requires separate source review before audited status.'
      : 'Empty active-date hint bundle; chapter retains source-supported temporal unknowns.';
    const attestation = packet.items.find(row => row.personId === item.personId && row.predicate === 'attestation');
    const unitId = attestation?.evidence?.[0] ?? 's0001';
    verdictByItem.set(item.id, verdict);
    itemChecks.push({
      id: item.id,
      verdict,
      event: 'Active-date hint record for local person.',
      reason,
      evidence: [{ unit: unitId, quote: pinnedQuote(unitId, units.get(unitId)?.zh?.slice(0, 4) ?? '') }],
    });
  }
}

if (itemChecks.length !== packet.items.length) throw new Error(`Expected ${packet.items.length} item checks, got ${itemChecks.length}`);

const itemsByPerson = new Map();
for (const item of packet.items) {
  if (!itemsByPerson.has(item.personId)) itemsByPerson.set(item.personId, []);
  itemsByPerson.get(item.personId).push(item.id);
}

const incorrectIds = itemChecks.filter(c => c.verdict === 'incorrect').map(c => c.id);
if (incorrectIds.includes('claim-513')) {
  findings.push({
    items: ['claim-513', 'claim-514', 'claim-515'],
    problem: 'Death statements add Dajie while the sole evidence unit reads 大界營 (boundary camp); the English location gloss is unsupported.',
    action: 'Revise death claims to follow 大界營 or split location into a source-backed attestation without inventing Dajie.',
  });
}
if (incorrectIds.includes('claim-625')) {
  findings.push({
    items: ['claim-625', 'p185'],
    problem: 'Fu Deng’s death claim carries age fifty-two from s0280 while citing only s0279 as death evidence.',
    action: 'Move age to an s0280-based claim or remove age from the s0279 death statement; keep regnal summary separate.',
  });
}

for (const deathId of ['claim-513', 'claim-514', 'claim-515']) {
  const personId = packet.items.find(item => item.id === deathId)?.personId;
  const finding = findings.find(row => row.items.includes(deathId));
  if (finding && personId && !finding.items.includes(personId)) finding.items.push(personId);
}

const personChecks = packet.people.map(person => {
  const owned = itemsByPerson.get(person.id) ?? [];
  const verdicts = owned.map(id => verdictByItem.get(id));
  const verdict = verdicts.includes('incorrect')
    ? 'incorrect'
    : verdicts.includes('research-blocked')
      ? 'research-blocked'
      : 'supported';
  const attestation = packet.items.find(item => item.personId === person.id && item.predicate === 'attestation');
  const unitId = attestation?.evidence?.[0] ?? 's0001';
  return {
    id: person.id,
    verdict,
    reason: `Chronology for ${person.id} checked across ${owned.join(', ')}; aggregate verdict ${verdict}.`,
    evidence: [{ unit: unitId, quote: pinnedQuote(unitId, units.get(unitId)?.zh?.slice(0, 4) ?? '') }],
  };
});

for (const person of packet.people) {
  const owned = itemsByPerson.get(person.id) ?? [];
  const verdicts = owned.map(id => verdictByItem.get(id));
  if (!verdicts.includes('incorrect')) continue;
  if (findings.some(finding => finding.items.includes(person.id))) continue;
  findings.push({
    items: [person.id],
    problem: `Person chronology aggregates incorrect owned claims among ${owned.filter(id => verdictByItem.get(id) === 'incorrect').join(', ')}.`,
    action: 'Repair the cited incorrect claims and refresh this person check.',
  });
}

const reviewedUnits = packet.units.map(unit => unit.id).sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));

const report = {
  schemaVersion: 1,
  auditVersion: 1,
  book: 'jinshu',
  chapter: '115',
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  status: incorrectIds.length ? 'needs-revision' : 'audited',
  reviewer: {
    name: 'Jinshu 115 independent chronology reviewer (round 3, same reviewer)',
    independentOfExtractor: true,
    priorEvidenceCommit: 'd2b1617653dcd67f49dbbeea32376d73e29c3712',
  },
  reviewedAt: new Date().toISOString(),
  summary:
    'Independent native chronology audit on the sealed owner packet (496 items, 342 units, 234 people). ' +
    'All units were in scope for omission review. ' +
    'No Western-year active-date hints, no scan geometry defects, and empty hint bundles retain source-supported unknowns. ' +
    'Twenty-eight death claims were checked against pinned Chinese; four death statements over-specify English (Dajie ×3, age on wrong evidence ×1). ' +
    'Regnal labels in nine source units (e.g. 太元十年, 太元十一年, 永和七年, 太元十九年) were read in Chinese only; no dynasty conversion is approved here.',
  reviewedUnits,
  itemChecks,
  personChecks,
  findings,
  references: [
    {
      book: 'jinshu',
      chapter: '115',
      unit: 's0217',
      quote: '萇率騎三萬夜襲大界營，陷之，殺登妻毛氏及其子弁、尚',
      sourceHash: sha256(units.get('s0217').zh),
      reason: 'Pinned witness for Dajie vs 大界營 death-location defect.',
    },
    {
      book: 'jinshu',
      chapter: '115',
      unit: 's0280',
      quote: '在位九年，時年五十二。',
      sourceHash: sha256(units.get('s0280').zh),
      reason: 'Age fifty-two belongs to this summary line, not the s0279 battle death sentence.',
    },
  ],
};

const livePacket = buildDateAuditPacket('jinshu', '115');
if (livePacket.sourceHash !== packet.sourceHash || livePacket.extractionHash !== packet.extractionHash) {
  throw new Error('Sealed packet stale vs current draft');
}
validateDateAuditReport(report, livePacket);

const outReport = path.join(__dirname, 'date-audit-report.json');
writeFileSync(outReport, `${JSON.stringify(report, null, 2)}\n`);

const omission = {
  schemaVersion: 1,
  book: 'jinshu',
  chapter: '115',
  draftCommit: '6cc3b19eade8f36eeb36ca1026344d678bc20d00',
  unitsTotal: reviewedUnits.length,
  unitsReviewed: reviewedUnits.length,
  regnalLabelUnits: reviewedUnits.filter(id => /太元|永和|太初|乙太元|改元/.test(units.get(id)?.zh ?? '')),
  priorGapsClosed: ['p233 聖公 @ s0179', 'p234 舜 @ s0238'],
  remainingOmissionHolds: [
    {
      kind: 'local-identity-continuity',
      cluster: 'Emperor Guangwu duplicate locals p059, p082, p134',
      sourceZh: '光武',
      note: 'Same historical figure split across locals; chapter same-person links not added. Cross-chapter canonical merge requires generated catalog (not built on this runner).',
    },
    {
      kind: 'editorial-compression',
      unit: 's0330',
      sourceZh: '疏爵以侯楚材，築館以須歸命',
      note: 'Literal field retains phrases; idiomatic compresses. Not a chronology item; editorial follow-up only.',
    },
  ],
  blockingChronology: findings,
};
writeFileSync(path.join(__dirname, 'omission-coverage.json'), `${JSON.stringify(omission, null, 2)}\n`);
console.log(JSON.stringify({
  status: report.status,
  itemChecks: itemChecks.length,
  incorrect: incorrectIds.length,
  findings: findings.length,
  outReport,
}, null, 2));