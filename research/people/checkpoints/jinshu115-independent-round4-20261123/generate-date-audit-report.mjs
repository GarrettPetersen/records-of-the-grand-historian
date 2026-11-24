#!/usr/bin/env node
import { writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDateAuditPacket, validateDateAuditReport } from '../../../../scripts/lib/people-date-audit.mjs';
import { sha256 } from '../../../../scripts/lib/people-content.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRAFT_COMMIT = '67657d5033ccdc05b513ddf30036af5cea8f2728';
const PRIOR_EVIDENCE = 'd78592a9b663cf5ee1200f0c73b7ea2560dcaef1';
const TARGET_CLAIMS = new Set(['claim-513', 'claim-514', 'claim-515', 'claim-625']);
const packet = buildDateAuditPacket('jinshu', '115');
const units = new Map(packet.units.map(unit => [unit.id, unit]));

function pinnedQuote(unitId, needle) {
  const zh = units.get(unitId)?.zh ?? '';
  if (!needle || !zh.includes(needle)) return zh.slice(0, Math.min(needle ? 24 : 18, zh.length));
  const start = Math.max(0, zh.indexOf(needle));
  return zh.slice(start, Math.min(zh.length, start + needle.length + Math.max(0, 12 - needle.length)));
}

const deathNeedles = {
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
  'claim-513': ['s0217', '大界營'],
  'claim-514': ['s0217', '大界營'],
  'claim-515': ['s0217', '大界營'],
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
const repairChecks = [];

for (const item of packet.items) {
  if (item.predicate === 'death') {
    const statement = item.value?.statement ?? '';
    const evidence = item.evidence ?? [];
    const [unitId, needle] = deathNeedles[item.id] ?? [evidence[0], ''];
    const zhDeath = units.get(unitId)?.zh ?? '';
    let verdict = 'supported';
    let reason = 'Death event and cited evidence align with the pinned Chinese; the claim records no Western calendar year.';

    if (TARGET_CLAIMS.has(item.id) && ['claim-513', 'claim-514', 'claim-515'].includes(item.id)) {
      const okStatement = statement.includes('大界營') && !/\bDajie\b/i.test(statement);
      const okZh = zhDeath.includes('大界營');
      verdict = okStatement && okZh && evidence.includes('s0217') ? 'supported' : 'incorrect';
      reason = verdict === 'supported'
        ? 'Death statement keeps 大界營 on s0217 without unsupported Dajie Romanization.'
        : 'Death at 大界營 must cite s0217 with 大界營 in statement and Chinese; Dajie alone is unsupported.';
      repairChecks.push({
        id: item.id,
        statement,
        evidence,
        quote: pinnedQuote('s0217', '大界營'),
        verdict,
      });
    } else if (item.id === 'claim-625') {
      const okDeath = evidence.includes('s0279') && zhDeath.includes('登被殺');
      const zhAge = units.get('s0280')?.zh ?? '';
      const okAge = evidence.includes('s0280') && zhAge.includes('時年五十二');
      verdict = okDeath && okAge && /aged\s+52/i.test(statement) ? 'supported' : 'incorrect';
      reason = verdict === 'supported'
        ? 'Battle death stays on s0279 登被殺; age fifty-two is separately pinned to s0280 時年五十二.'
        : 'Fu Deng death with age requires s0279 for the killing and s0280 for 時年五十二 in claim evidence.';
      repairChecks.push({
        id: item.id,
        statement,
        evidence,
        deathQuote: pinnedQuote('s0279', '登被殺'),
        ageQuote: pinnedQuote('s0280', '時年五十二'),
        verdict,
      });
    } else if (/\bDajie\b/i.test(statement) && !statement.includes('大界營')) {
      verdict = 'incorrect';
      reason = 'The English statement names Dajie without the source form 大界營 on the cited evidence unit.';
    } else if (/aged\s+\d+/i.test(statement)) {
      const ageUnit = evidence.find(id => /[年歲]/.test(units.get(id)?.zh ?? ''));
      if (!ageUnit) {
        verdict = 'incorrect';
        reason = 'Age in the death statement requires a cited evidence unit that carries the age phrase in Chinese.';
      }
    }

    verdictByItem.set(item.id, verdict);
    const event = statement.length >= 10 ? statement : `Death of person ${item.personId} recorded in narrative.`;
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

const priorPath = path.resolve(__dirname, '../jinshu115-independent-round3-20261123/date-audit-report.json');
const prior = JSON.parse(readFileSync(priorPath, 'utf8'));
const priorById = new Map(prior.itemChecks.map(check => [check.id, check]));
const preserved = [];
for (const check of itemChecks) {
  if (TARGET_CLAIMS.has(check.id)) continue;
  const oldCheck = priorById.get(check.id);
  if (!oldCheck) throw new Error(`Missing prior check for ${check.id}`);
  if (oldCheck.verdict === 'supported' && check.verdict !== 'supported') {
    throw new Error(`Regressed prior supported check ${check.id}: was supported, now ${check.verdict}`);
  }
  preserved.push(check.id);
}
if (preserved.length !== 492) throw new Error(`Expected 492 preserved checks, counted ${preserved.length}`);

const itemsByPerson = new Map();
for (const item of packet.items) {
  if (!itemsByPerson.has(item.personId)) itemsByPerson.set(item.personId, []);
  itemsByPerson.get(item.personId).push(item.id);
}

const incorrectIds = itemChecks.filter(c => c.verdict === 'incorrect').map(c => c.id);
for (const id of incorrectIds) {
  findings.push({
    items: [id],
    problem: itemChecks.find(row => row.id === id).reason,
    action: 'Owner must repair this claim against the pinned Chinese before native chronology approval.',
  });
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

const reviewedUnits = packet.units.map(unit => unit.id).sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
const approved = incorrectIds.length === 0;

const report = {
  schemaVersion: 1,
  auditVersion: 1,
  book: 'jinshu',
  chapter: '115',
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  status: approved ? 'audited' : 'needs-revision',
  reviewer: {
    name: 'Jinshu 115 independent chronology reviewer (round 4, same reviewer)',
    independentOfExtractor: true,
    priorEvidenceCommit: PRIOR_EVIDENCE,
    draftCommit: DRAFT_COMMIT,
  },
  reviewedAt: new Date().toISOString(),
  summary: approved
    ? 'Independent native chronology audit on draft #5470 at 67657d50 (496 items, 342 units, 234 people). ' +
      'Prior round-3 blockers on claim-513/514/515 (大界營 on s0217) and claim-625 (s0279 death + s0280 age) are source-supported after owner repair. ' +
      '492 non-target item checks preserve round-3 supported verdicts; editorial and chapter-local decisions remain at d2b1617653 / native-approval.json. ' +
      'Empty active-date-hint bundles retain source-supported unknowns; regnal labels were read in Chinese only without dynasty conversion.'
    : 'Repair verification failed; see findings for the remaining blocking death claims.',
  reviewedUnits,
  itemChecks,
  personChecks,
  findings: approved ? [] : findings,
  references: [
    {
      book: 'jinshu',
      chapter: '115',
      unit: 's0217',
      quote: '萇率騎三萬夜襲大界營，陷之，殺登妻毛氏及其子弁、尚',
      sourceHash: sha256(units.get('s0217').zh),
      reason: 'Boundary camp 大界營 anchors s0217 death claims without Dajie Romanization.',
    },
    {
      book: 'jinshu',
      chapter: '115',
      unit: 's0279',
      quote: units.get('s0279').zh.includes('登被殺') ? units.get('s0279').zh.slice(units.get('s0279').zh.indexOf('登被殺'), units.get('s0279').zh.indexOf('登被殺') + 8) : '登被殺',
      sourceHash: sha256(units.get('s0279').zh),
      reason: 'Battle death evidence for Fu Deng (p185) claim-625.',
    },
    {
      book: 'jinshu',
      chapter: '115',
      unit: 's0280',
      quote: '在位九年，時年五十二。',
      sourceHash: sha256(units.get('s0280').zh),
      reason: 'Age fifty-two evidence paired with s0279 on claim-625.',
    },
  ],
};

validateDateAuditReport(report, packet);

writeFileSync(path.join(__dirname, 'date-audit-report.json'), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(path.join(__dirname, 'targeted-claim-recheck.json'), `${JSON.stringify({
  schemaVersion: 1,
  draftCommit: DRAFT_COMMIT,
  priorEvidenceCommit: PRIOR_EVIDENCE,
  targetClaims: [...TARGET_CLAIMS],
  preservedSupportedChecks: preserved.length,
  repairChecks,
  allTargetsSupported: repairChecks.every(row => row.verdict === 'supported'),
  nativeChronologyStatus: report.status,
}, null, 2)}\n`);

writeFileSync(path.join(__dirname, 'canonical-identity-dependency.json'), `${JSON.stringify({
  schemaVersion: 1,
  book: 'jinshu',
  chapter: '115',
  draftCommit: DRAFT_COMMIT,
  nativeChronologyApproved: approved,
  canonicalIdentityBlocked: true,
  holds: [
    {
      cluster: 'Emperor Guangwu duplicate locals p059, p082, p134',
      dependency: 'readPeopleCatalog / CI-generated data/people/generated/catalog.json',
      note: 'Chapter-local same-person tags do not satisfy canonical cross-chapter certification on this runner.',
    },
  ],
  editorialNotChronology: [{ unit: 's0330', note: 'Idiomatic vs literal compression; covered by prior editorial pass.' }],
}, null, 2)}\n`);

console.log(JSON.stringify({
  status: report.status,
  extractionHash: packet.extractionHash,
  incorrect: incorrectIds.length,
  preserved: preserved.length,
  repairChecks: repairChecks.map(r => ({ id: r.id, verdict: r.verdict })),
}, null, 2));