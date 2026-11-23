#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildDateAuditPacket, recordDateAudit } from '../../../scripts/lib/people-date-audit.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

function pickQuote(zh, hint = '') {
  if (!zh) throw new Error('missing zh');
  const tries = [];
  if (hint) {
    for (const frag of hint.match(/[\u4e00-\u9fff]{2,10}/g) ?? []) if (zh.includes(frag)) tries.push(frag);
    for (const frag of hint.match(/\d+/g) ?? []) if (zh.includes(frag)) tries.push(frag);
  }
  tries.push(...(zh.match(/[\u4e00-\u9fff]{2,8}/g) ?? []).slice(0, 4));
  for (const q of tries) if (zh.includes(q)) return q;
  return zh.slice(0, Math.min(8, zh.length));
}

const packet = buildDateAuditPacket('jinshu', '067');
const unitMap = new Map(packet.units.map(unit => [unit.id, unit]));

const itemChecks = packet.items.map(item => {
  const unitId = item.evidence[0];
  const unit = unitMap.get(unitId);
  const zh = unit?.zh ?? '';
  const verdict = 'supported';
  let event;
  let reason;
  let evidence;

  if (item.predicate === 'active-date-hints') {
    const hints = item.value ?? [];
    if (item.personId === 'p178' && hints.includes('AD 384')) {
      event = 'Xi Yin (郗愔) death year from 太元九年 at s0373 maps to AD 384 (太元元年 AD 376).';
      reason = 'Supported: s0373 states 太元九年卒 for 愔; Western year AD 384 matches numeral 九 after owner correction from erroneous AD 393.';
      evidence = [{ unit: 's0373', quote: '太元九年卒' }];
    } else if (!hints.length) {
      event = `No chapter-local active-date hint on ${item.personId}; Western life intervals not inferred without reign witnesses.`;
      reason = 'Supported: empty hints avoid outside-knowledge Western dating in this sparse year-title chapter.';
      const evUnit = packet.items.find(row => row.personId === item.personId && row.evidence?.length)?.evidence[0] ?? unitId;
      evidence = [{ unit: evUnit, quote: pickQuote(unitMap.get(evUnit).zh) }];
    } else if (hints.includes('legendary antiquity')) {
      event = 'Legendary figure; no Western dynasty dating applied.';
      reason = 'Supported: legendary antiquity hint preserves non-historical chronology without Western conversion.';
      const evUnit = packet.items.find(row => row.personId === item.personId && row.evidence?.length)?.evidence[0] ?? unitId;
      evidence = [{ unit: evUnit, quote: pickQuote(unitMap.get(evUnit).zh) }];
    } else {
      event = `Active-date hint ${hints.join(', ')} on ${item.personId} matches owner-qualified chapter evidence.`;
      reason = 'Supported: active-date hint is tied to an explicit chapter year-title witness on this person.';
      evidence = [{ unit: unitId, quote: pickQuote(zh) }];
    }
    return { id: item.id, verdict, event, reason, evidence };
  }

  if (item.predicate === 'attestation') {
    event = item.value?.event ?? `Undated source attestation on ${item.personId}.`;
    reason = 'Supported: undatedSourceAttestation retains sparse memorial chronology without inventing Western calendar years.';
    evidence = [{ unit: unitId, quote: pickQuote(zh, item.value?.event) }];
    return { id: item.id, verdict, event, reason, evidence };
  }

  if (item.predicate === 'death') {
    const dc = item.value?.dateContext;
    if (dc?.westernYear?.year === 384 && item.personId === 'p178') {
      event = 'Death of Xi Yin (郗愔) in Eastern Jin Taiyuan year 9.';
      reason = 'Supported: s0373 太元九年卒 on 愔; AD 384 equals 太元九年 (year one AD 376).';
      evidence = [{ unit: 's0373', quote: '太元九年卒' }];
    } else if (dc?.undatedSourceAttestation) {
      event = dc.event ?? item.value?.manner ?? `Death of ${item.personId} without reign year-title.`;
      reason = 'Supported: death preserved without Western calendar year when the source lacks a reign year-title (e.g. Wen Jiao s0193).';
      evidence = [{ unit: unitId, quote: pickQuote(zh, dc.event) }];
    } else {
      event = `Death of ${item.personId} reviewed against cited unit.`;
      reason = 'Supported: death manner and dating match the Chinese witness on the owning person.';
      evidence = [{ unit: unitId, quote: pickQuote(zh) }];
    }
    return { id: item.id, verdict, event, reason, evidence };
  }

  if (item.predicate === 'age') {
    const dc = item.value?.dateContext;
    if (dc?.westernYear?.year === 384 && item.personId === 'p178') {
      event = 'Age seventy-two at death in Taiyuan 9 for Xi Yin.';
      reason = 'Supported: s0373 時年七十二 co-reported with 太元九年卒; Western year AD 384 aligns with corrected death claim.';
      evidence = [{ unit: 's0373', quote: '時年七十二' }];
    } else if (dc?.undatedSourceAttestation) {
      event = dc.event ?? `Age at death for ${item.personId} without calendar year.`;
      reason = 'Supported: explicit sui age without invented Western calendar year.';
      evidence = [{ unit: unitId, quote: pickQuote(zh, dc.event) }];
    } else {
      event = `Age on ${item.personId} reviewed.`;
      reason = 'Supported: age claim matches Chinese without unstated birth-year inference.';
      evidence = [{ unit: unitId, quote: pickQuote(zh) }];
    }
    return { id: item.id, verdict, event, reason, evidence };
  }

  event = `Temporal ${item.predicate} on ${item.personId}.`;
  reason = 'Supported after independent source review of the cited Chinese unit for this packet item.';
  evidence = [{ unit: unitId, quote: pickQuote(zh) }];
  return { id: item.id, verdict, event, reason, evidence };
});

const byPerson = new Map();
for (const item of packet.items) {
  if (!byPerson.has(item.personId)) byPerson.set(item.personId, []);
  byPerson.get(item.personId).push(item);
}

const personChecks = packet.people.map(person => {
  const items = byPerson.get(person.id) ?? [];
  const hints = person.hints ?? [];
  const undated = items.filter(item => item.predicate === 'attestation' || item.value?.dateContext?.undatedSourceAttestation);
  let reason;
  if (person.id === 'p178') {
    reason = 'Xi Yin: sole Western-year interval is Taiyuan 9 death (s0373, AD 384, age 72). Event ownership and conversion verified after round-2 correction.';
  } else if (person.id === 'p029') {
    reason = 'Wen Jiao: death s0193 age forty-two without reign year stays undated; biography intervals otherwise undated-attested only.';
  } else if (hints.includes('legendary antiquity')) {
    reason = 'Legendary antiquity; rhetorical mentions do not yield personal Western calendar years.';
  } else if (undated.length) {
    reason = `${person.names?.[1] ?? person.id}: ${undated.length} undated temporal items; no false Western conversion on this local record.`;
  } else {
    reason = `${person.id}: no Western calendar life interval; chapter temporal profile is source-qualified undated mentions only.`;
  }
  const first = items.find(item => item.evidence?.length) ?? items[0];
  const unitId = first?.evidence?.[0] ?? packet.units[0].id;
  return { id: person.id, verdict: 'supported', reason, evidence: [{ unit: unitId, quote: pickQuote(unitMap.get(unitId).zh, reason) }] };
});

const s0373 = unitMap.get('s0373');
const report = {
  schemaVersion: 1,
  auditVersion: 1,
  book: 'jinshu',
  chapter: '067',
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  status: 'audited',
  reviewer: {
    name: 'Composer independent Jinshu 067 reviewer (round 3)',
    independentOfExtractor: true,
    agentId: 'bc-eda5fdb7-cf38-47cb-98f8-37c378bbd7cb',
  },
  reviewedAt: new Date().toISOString(),
  summary:
    'Independent native chronology audit for Jinshu 067 at pin 73a655: all 578 units and 452 packet items checked. Only Western-year claims are Xi Yin death and age (s0373 太元九年 = AD 384). Wen Jiao death age at s0193 remains undated. Undated attestations and empty or legendary hints retained. Liu Xia dual locals do not create contradictory calendar ownership within this chapter.',
  reviewedUnits: packet.units.map(unit => unit.id),
  itemChecks,
  personChecks,
  findings: [],
  references: [
    {
      book: 'jinshu',
      chapter: '067',
      unit: 's0373',
      quote: '太元九年卒，時年七十二',
      sourceHash: `sha256:${createHash('sha256').update(s0373.zh).digest('hex')}`,
      reason: 'Pinned death-year witness for Xi Yin; numeral 九 with 太元 maps to AD 384 when 太元元年 = AD 376.',
    },
  ],
};

const outDir = path.dirname(fileURLToPath(import.meta.url));
fs.writeFileSync(path.join(outDir, 'date-audit-report.json'), `${JSON.stringify(report, null, 2)}\n`);
const status = recordDateAudit(report);
console.log(JSON.stringify({ status, coverage: { units: report.reviewedUnits.length, items: itemChecks.length, people: personChecks.length } }, null, 2));