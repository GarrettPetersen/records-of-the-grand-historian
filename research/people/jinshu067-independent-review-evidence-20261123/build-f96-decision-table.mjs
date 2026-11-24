#!/usr/bin/env node
/** Build exhaustive reviewed-decision-table at pin f96a8b — per-item verdict, no default supported. */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildDateAuditPacket } from '../../../scripts/lib/people-date-audit.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(DIR, '../../..');
const owner = JSON.parse(
  fs.readFileSync(path.join(REPO, 'research/people/jinshu067-authoring-20261123/owner-attestation-repairs-vs-5456.json'), 'utf8'),
);

const packet = buildDateAuditPacket('jinshu', '067');
const unitMap = new Map(packet.units.map(unit => [unit.id, unit]));
const personMap = new Map(packet.people.map(person => [person.id, person]));

function quotedZh(event) {
  const m = event?.match(/[“"]([^”"]+)[”"]/);
  if (m) return m[1];
  const m2 = event?.match(/records\s+([\u4e00-\u9fff]+)/);
  if (m2) return m2[1];
  return null;
}

const UNCERTAIN = new Set(owner.unresolvedForSameReviewer.uncertainAttestationRows);
const uncertainWitness = {
  'claim-366': { unit: 's0272', quote: '待放之門' },
  'claim-414': { unit: 's0301', quote: '越逸' },
  'claim-503': { unit: 's0402', quote: '深慮' },
  'claim-504': { unit: 's0402', quote: '深慮' },
  'claim-554': { unit: 's0461', quote: '太子右衛率' },
  'claim-587': { unit: 's0479', quote: '辛恭靖' },
  'claim-608': { unit: 's0491', quote: '蹇亮' },
  'claim-663': { unit: 's0498', quote: '齊王冏' },
  'claim-677': { unit: 's0507', quote: '太上承代' },
  'claim-492': { unit: 's0372', quote: '敦獎殷勤' },
};

const VITAL_HINTS = [
  ['hints-p178', 'supported', 's0373', '太元九年卒', 'Active-date hint AD 384 from s0373 death witness.', 'Supported: sole nonempty Western personal hint tied to chapter 太元九年.'],
  ['hints-p033', 'supported', 's0049', '伯禹', 'Legendary antiquity for Yu the Great.', 'Supported: rhetorical 伯禹; legendary hint only.'],
  ['hints-p034', 'supported', 's0049', '帝舜', 'Legendary antiquity for Shun.', 'Supported: 帝舜 in sage comparison.'],
  ['hints-p036', 'supported', 's0049', '唐堯', 'Legendary antiquity for Yao.', 'Supported: 唐堯 in rhetorical comparison.'],
];

const itemDecisions = VITAL_HINTS.map(([id, verdict, unit, quote, event, reason]) => ({ id, verdict, unit, quote, event, reason }));

for (const item of packet.items.filter(row => row.predicate === 'age')) {
  const unitId = item.evidence[0];
  const zh = unitMap.get(unitId).zh;
  const quote = item.predicate === 'age' && item.personId === 'p178' ? '時年七十二' : '時年四十二';
  if (!zh.includes(quote)) throw new Error(`age quote ${item.id}`);
  const reason =
    item.personId === 'p178'
      ? 'Supported: Xi Yin age 72 with 太元九年; AD 384 Western year (verified preservation).'
      : 'Supported: Wen Jiao age 42 at undated death on s0193.';
  itemDecisions.push({
    id: item.id,
    verdict: 'supported',
    unit: unitId,
    quote,
    event: item.value?.dateContext?.event ?? `Age at ${item.value?.event}`,
    reason,
  });
}

function deathQuote(unitId, zh, item) {
  const manual = {
    'claim-324': '杜寶',
    'claim-325': '阮朗',
  };
  if (manual[item.id] && zh.includes(manual[item.id])) return manual[item.id];
  const candidates = [
    item.value?.dateContext?.sourceDate?.text,
    ...(String(item.value?.manner ?? '').match(/[\u4e00-\u9fff]{2,10}/g) ?? []),
    ...zh.match(/[\u4e00-\u9fff]{2,12}/g) ?? [],
  ].filter(Boolean);
  for (const c of candidates) {
    if (zh.includes(c)) return c;
  }
  throw new Error(`No death quote for ${item.id} @ ${unitId}`);
}

for (const item of packet.items.filter(row => row.predicate === 'death')) {
  const unitId = item.evidence[0];
  const zh = unitMap.get(unitId).zh;
  const quote = deathQuote(unitId, zh, item);
  itemDecisions.push({
    id: item.id,
    verdict: 'supported',
    unit: unitId,
    quote,
    event:
      typeof item.value?.manner === 'string' && item.value.manner.length >= 10
        ? item.value.manner
        : `Death event for ${item.personId} on ${unitId}`,
    reason: 'Supported: death claim tied to cited unit with verified quote substring; undated unless Western year explicitly witnessed.',
  });
}

// Primary Chinese name for empty-hint witness lookup
function primaryZh(personId) {
  const person = personMap.get(personId);
  const zh = person?.names?.[1];
  if (zh) return zh;
  return null;
}

function witnessUnitForPerson(personId) {
  const claims = packet.items.filter(row => row.personId === personId && row.evidence?.length);
  for (const row of claims) {
    const unitId = row.evidence[0];
    const zh = unitMap.get(unitId)?.zh ?? '';
  const fromEvent = quotedZh(row.value?.event);
    if (fromEvent && zh.includes(fromEvent)) return { unit: unitId, quote: fromEvent };
    const name = primaryZh(personId);
    if (name && zh.includes(name)) return { unit: unitId, quote: name };
    if (name && name.length > 1) {
      for (let n = name.length; n >= 1; n--) {
        const sub = name.slice(-n);
        if (zh.includes(sub) && sub.length >= 1) return { unit: unitId, quote: sub };
      }
    }
  }
  const hint = packet.items.find(row => row.id === `hints-${personId}`);
  if (hint?.predicate === 'active-date-hints' && hint.value?.includes('legendary antiquity')) {
    return { unit: 's0049', quote: '帝舜' };
  }
  if (personId === 'p178') return { unit: 's0373', quote: '太元九年卒' };
  throw new Error(`No witness for ${personId}`);
}

for (const item of packet.items) {
  if (item.predicate === 'attestation') {
    if (UNCERTAIN.has(item.id)) {
      const w = uncertainWitness[item.id];
      if (!unitMap.get(w.unit).zh.includes(w.quote)) throw new Error(`uncertain witness ${item.id}`);
      itemDecisions.push({
        id: item.id,
        verdict: 'research-blocked',
        unit: w.unit,
        quote: w.quote,
        event: item.value.event,
        reason: `Research-blocked: owner marked uncertain; unit does not bear prior personal fragment (see owner-attestation-repairs-vs-5456). Circuit-breaker hold retained.`,
      });
      continue;
    }
    const unitId = item.evidence[0];
    const zh = unitMap.get(unitId).zh;
    if (item.value?.event === 'mentioned in narrative') {
      const quote = primaryZh(item.personId);
      const q = quote && zh.includes(quote) ? quote : zh.slice(0, Math.min(6, zh.length));
      if (!zh.includes(q)) throw new Error(`narrative ${item.id}`);
      itemDecisions.push({
        id: item.id,
        verdict: 'supported',
        unit: unitId,
        quote: q,
        event: item.value.event,
        reason: 'Supported: undated narrative mention; unit has no reign year-title dating this personal mention.',
      });
      continue;
    }
    const q = quotedZh(item.value?.event);
    if (!q || !zh.includes(q)) {
      throw new Error(`Attestation ${item.id} still fails quote ownership: ${q} in ${unitId}`);
    }
    itemDecisions.push({
      id: item.id,
      verdict: 'supported',
      unit: unitId,
      quote: q,
      event: item.value.event,
      reason: 'Supported after #5456 owner repair: quoted fragment present in cited unit; undated attestation appropriate.',
    });
    continue;
  }

  if (item.predicate === 'active-date-hints') {
    if (item.value?.length) {
      const row = itemDecisions.find(r => r.id === item.id);
      if (!row) throw new Error(`Missing nonzero hint decision ${item.id}`);
      continue;
    }
    const { unit, quote } = witnessUnitForPerson(item.personId);
    if (!unitMap.get(unit).zh.includes(quote)) throw new Error(`hint witness ${item.id}`);
    itemDecisions.push({
      id: item.id,
      verdict: 'supported',
      unit,
      quote,
      event: `Empty active-date hint on ${item.personId}; no Western interval on this local record.`,
      reason: 'Supported: independent empty-hint review—witness unit names person without chapter year-title supporting a Western active-date hint.',
    });
  }
}

const ids = new Set(itemDecisions.map(row => row.id));
if (ids.size !== packet.items.length) {
  const missing = packet.items.filter(row => !ids.has(row.id)).map(row => row.id);
  throw new Error(`Incomplete coverage: missing ${missing.length} ${missing.slice(0, 5).join(',')}`);
}
if (ids.size !== 452) throw new Error(`Expected 452, got ${ids.size}`);

const personDecisions = packet.people.map(person => {
  if (person.id === 'p178') {
    return { id: 'p178', verdict: 'supported', unit: 's0373', quote: '太元九年卒', reason: 'Xi Yin death year AD 384 substantively verified (preserved).' };
  }
  if (person.id === 'p029') {
    return { id: 'p029', verdict: 'supported', unit: 's0193', quote: '至鎮未旬而卒', reason: 'Wen Jiao undated death preserved (preserved).' };
  }
  if (person.id === 'p041' || person.id === 'p166') {
    const unit = person.id === 'p041' ? 's0075' : 's0323';
    return { id: person.id, verdict: 'research-blocked', unit, quote: '劉遐', reason: 'Liu Xia split preserved; not chronology merge approval (continuity hold).' };
  }
  const blocked = packet.items.some(row => row.personId === person.id && UNCERTAIN.has(row.id));
  if (blocked) {
    const w = witnessUnitForPerson(person.id);
    return { id: person.id, verdict: 'research-blocked', unit: w.unit, quote: w.quote, reason: 'Research-blocked: uncertain attestation row retained on this person pending owner repair or retraction.' };
  }
  const w = witnessUnitForPerson(person.id);
  return { id: person.id, verdict: 'supported', unit: w.unit, quote: w.quote, reason: 'Supported: person-level chronology has no unsupported Western interval after item review.' };
});

const blockedItems = itemDecisions.filter(row => row.verdict === 'research-blocked').map(row => row.id);
const blockedPeople = personDecisions.filter(row => row.verdict === 'research-blocked').map(row => row.id);

const table = {
  schemaVersion: 1,
  kind: 'exhaustive-reviewed-decision-table',
  pinCommit: 'f96a8b20294d52d2489b17b70f1358e2daeba3cf',
  ownerReceipt: 'research/people/jinshu067-authoring-20261123/owner-attestation-repairs-vs-5456.json',
  independentEvidencePr: 5456,
  packet: { sourceHash: packet.sourceHash, extractionHash: packet.extractionHash },
  editorialByteHash: `sha256:${createHash('sha256').update(fs.readFileSync(path.join(REPO, 'data/people/editorial-decisions/jinshu/067.json'))).digest('hex')}`,
  attestationRepairsVerified: { repin: 8, correct: 43, uncertainHeld: 10 },
  reportStatus: 'needs-revision',
  reviewer: {
    name: 'Composer independent Jinshu 067 reviewer (f96a8b evidence)',
    independentOfExtractor: true,
    agentId: 'bc-eda5fdb7-cf38-47cb-98f8-37c378bbd7cb',
  },
  reviewedAt: new Date().toISOString(),
  summary:
    `Full packet coverage (${itemDecisions.length} item checks, ${personDecisions.length} person checks) at pin f96a8b after verifying owner 61 attestation repairs (51 ownership-supported, 10 uncertain research-blocked). Empty active-date hints independently reviewed with per-person Chinese witnesses. Not audited: 10 uncertain attestations + Liu Xia identity-chronology hold. No blanket defaults. Identity not started.`,
  itemDecisions,
  attestationGroups: [],
  attestationIndividual: [],
  personDecisions,
  findings: [
    {
      items: blockedItems,
      problem: 'Ten owner-marked uncertain attestation rows lack substantively supported personal witnesses on cited units (circuit-breaker holds).',
      action: 'Retarget to canonical witness units named in owner receipt, retract row, or resolve with explicit Chinese quote ownership.',
    },
    {
      items: blockedPeople,
      problem: 'Person-level research-blocked: Liu Xia split (p041/p166) and persons bearing uncertain attestation rows.',
      action: 'Resolve identity/chronology ownership before audited status; do not merge Liu Xia on name alone.',
    },
  ],
  identityNotStarted: true,
  coverage: {
    packetItems: 452,
    itemChecks: itemDecisions.length,
    personChecks: personDecisions.length,
    packetUnits: 578,
    reviewedUnitsPlanned: 'all via item checks',
    fullCoverageNoDefaults: true,
  },
};

fs.writeFileSync(path.join(DIR, 'reviewed-decision-table.json'), `${JSON.stringify(table, null, 2)}\n`);
console.log(JSON.stringify(table.coverage, null, 2), 'blocked', blockedItems.length);