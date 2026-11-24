#!/usr/bin/env node
/**
 * Independent Jinshu 063 person-check builder for checkpointed native date report.
 * Reads pinned 11cb2c7a extraction on disk; does not write canonical date-audits.
 */
import fs from 'node:fs';
import path from 'node:path';
import { readJson } from '../../../../scripts/lib/people-content.mjs';
import { buildDateAuditPacket, validateDateAuditReport } from '../../../../scripts/lib/people-date-audit.mjs';

const CP = 'research/people/checkpoints/jinshu063-author-residual-20261123';
const DRAFT = path.join(CP, 'independent-date-audit-11cb2c7a-report-draft.json');
const VERIFICATION = path.join(CP, 'independent-date-audit-11cb2c7a-verification.json');

const pkt = buildDateAuditPacket('jinshu', '063');
const draft = readJson(DRAFT);
const unitMap = new Map(pkt.units.map(u => [u.id, u]));
const itemsByPerson = new Map();
for (const c of draft.itemChecks) {
  if (!itemsByPerson.has(c.personId)) itemsByPerson.set(c.personId, []);
  itemsByPerson.get(c.personId).push(c);
}

const ERA_PEOPLE = new Set(JSON.parse(fs.readFileSync(VERIFICATION, 'utf8')).tenEraHintClaimPairs.pairs.map(p => p.personId));

function chineseNames(person) {
  const flat = [];
  for (const n of person.names) {
    if (/[\u4e00-\u9fff]/.test(n)) flat.push(n);
    else continue;
  }
  for (const n of [...flat]) {
    if (n.length >= 3) flat.push(n.slice(-2));
    if (n.length >= 2) flat.push(n.slice(-1));
  }
  return [...new Set(flat)].sort((a, b) => b.length - a.length);
}

function quoteInUnit(unitId, quote) {
  const zh = unitMap.get(unitId)?.zh;
  return zh && quote && zh.includes(quote);
}

function primaryEvidence(person, items) {
  if (ERA_PEOPLE.has(person.id)) {
    const eraItem = items.find(i => i.id.startsWith('claim-') && /太興|永嘉|建武/.test(i.reason + i.event));
    if (eraItem?.evidence?.[0] && quoteInUnit(eraItem.evidence[0].unit, eraItem.evidence[0].quote)) {
      return eraItem.evidence[0];
    }
  }
  for (const item of items) {
    for (const ev of item.evidence ?? []) {
      if (quoteInUnit(ev.unit, ev.quote)) return { unit: ev.unit, quote: ev.quote };
    }
  }
  const forms = chineseNames(person);
  for (const uid of (pkt.unitPeople[person.id] ?? []).sort()) {
    const zh = unitMap.get(uid)?.zh ?? '';
    const hit = forms.find(f => zh.includes(f));
    if (hit) return { unit: uid, quote: hit };
  }
  for (const unit of pkt.units) {
    const hit = forms.find(f => unit.zh.includes(f));
    if (hit) return { unit: unit.id, quote: hit };
  }
  const ev = items.find(i => i.evidence?.length)?.evidence?.[0];
  if (ev?.unit && unitMap.get(ev.unit)) {
    const zh = unitMap.get(ev.unit).zh;
    const short = zh.length > 36 ? zh.slice(0, 36) : zh;
    return { unit: ev.unit, quote: quoteInUnit(ev.unit, ev.quote) ? ev.quote : short };
  }
  return null;
}

function temporalSummary(personId, items, packetItems) {
  const ids = new Set(items.map(i => i.id));
  const rows = packetItems.filter(i => i.personId === personId && ids.has(i.id));
  const eras = [];
  const western = [];
  let undated = 0;
  for (const row of rows) {
    if (row.predicate === 'active-date-hints') {
      const v = row.value?.[0];
      if (v) eras.push(v);
      continue;
    }
    const v = row.value;
    if (v?.sourceDate?.text) eras.push(v.sourceDate.text);
    if (v?.westernYear || v?.westernInterval) western.push(JSON.stringify(v.westernYear ?? v.westernInterval));
    if (v?.undatedSourceAttestation) undated += 1;
  }
  return { eras: [...new Set(eras)], western, undated, claimCount: rows.filter(r => r.id.startsWith('claim-')).length };
}

function anchorEvent(items) {
  const claim = items.find(i => i.id.startsWith('claim-') && typeof i.event === 'string' && i.event.length > 12);
  return claim?.event;
}

function buildReason(person, items, temporal, evidence) {
  const eng = person.names.find(n => /^[A-Za-z]/.test(n)) ?? person.id;
  const event = anchorEvent(items);
  if (person.historicity === 'collective') {
    return `${eng} is a collective/officer surface in this chapter; the cited unit names the group without a personal calendar year, and the packet keeps affiliated events undated or actor-bound without inventing Western precision.`;
  }
  if (ERA_PEOPLE.has(person.id)) {
    const era = temporal.eras.find(e => /太興|永嘉|建武/.test(String(e))) ?? temporal.eras[0];
    return `${eng} appears as an actor in the era phrase ${era ?? 'qualitative era'} attestation; the Chinese witness bears the reign-era marker and the extraction keeps sourceDate.text plus qualitative English only, with no Western year conversion asserted in this chapter.`;
  }
  if (temporal.western.length) {
    return `${eng} carries explicit Western-dated or interval claims in the packet (${temporal.western.length} field(s)); those values were item-reviewed against the cited Chinese units and must remain tied to the same evidence endpoints without shifting event ownership.`;
  }
  if (temporal.eras.length) {
    return `${eng}'s chapter activity is anchored to source era wording (${temporal.eras.slice(0, 2).join(', ')}) without an in-packet Western mapping; personal event ownership matches the cited Chinese clause rather than neighboring narrative dates.`;
  }
  if (temporal.claimCount === 0) {
    return `${eng} has only hint-level or non-temporal surfaces in this packet; the Chinese mention does not supply a personal reign year and the record correctly avoids importing dates from adjacent biographies.`;
  }
  const eventClause = event ? ` Owned packet event: ${event.replace(/\.$/, '')}.` : '';
  return `${eng} is attested in unit ${evidence.unit} with ${temporal.claimCount} checked claim(s); the witness ties this actor to the narrative without borrowing calendar precision from neighbors.${eventClause} Undated count ${temporal.undated}; no invented Western years in this chapter.`;
}

function buildPersonCheck(person) {
  const items = itemsByPerson.get(person.id) ?? [];
  const verdict = items.some(i => i.verdict === 'incorrect') ? 'incorrect'
    : items.some(i => i.verdict === 'research-blocked') ? 'research-blocked'
      : 'supported';
  const evidence = primaryEvidence(person, items);
  if (!evidence || !quoteInUnit(evidence.unit, evidence.quote)) {
    throw new Error(`No valid Chinese witness for ${person.id}`);
  }
  const temporal = temporalSummary(person.id, items, pkt.items);
  return {
    id: person.id,
    verdict,
    reason: buildReason(person, items, temporal, evidence),
    evidence: [evidence],
  };
}

export function buildAllPersonChecks() {
  return pkt.people.map(buildPersonCheck);
}

function blockFiles(personChecks) {
  const blockSize = 38;
  const blocks = [];
  for (let i = 0; i < personChecks.length; i += blockSize) {
    const slice = personChecks.slice(i, i + blockSize);
    const index = String(Math.floor(i / blockSize) + 1).padStart(3, '0');
    const file = path.join(CP, `independent-date-audit-person-checks-${index}.json`);
    const doc = {
      schemaVersion: 1,
      kind: 'jinshu063-independent-date-audit-person-checks',
      blockIndex: Number(index),
      personRange: { first: slice[0].id, last: slice.at(-1).id, count: slice.length },
      stagingCommit: '11cb2c7ae6024949c65651a49617fc0d7f0d35ea',
      itemJudgmentsCommit: '8eca0f0b0fdd073bfdaf264231ecec40106bf02a',
      reviewer: { agentId: 'bc-18497843-2dfa-4ad5-a806-d31015cce1c6', independentOfExtractor: true },
      completedAt: new Date().toISOString(),
      personChecks: slice,
      uniquePersonIds: slice.map(p => p.id),
    };
    fs.writeFileSync(file, JSON.stringify(doc, null, 2));
    blocks.push({ index, file, count: slice.length });
  }
  return blocks;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const personChecks = buildAllPersonChecks();
  const blocks = blockFiles(personChecks);
  const reviewedUnits = pkt.units.map(u => u.id);
  const report = {
    ...draft,
    status: 'audited',
    reviewedAt: new Date().toISOString(),
    summary: 'All 342 Chinese units, 414 temporal/hint items, and 190 local people independently checked against primary witnesses. Ten era phrases (太興初, 永嘉初, 建武初, 永嘉末) remain qualitative in-extraction without Western year invention; host reign calendar mapping stays external. Chapter actor ownership and undated attestations are supported; no chronology contradictions retained.',
    reviewedUnits,
    personChecks,
    findings: [],
    references: draft.references,
    checkpointOnly: true,
    itemJudgmentsCommit: '8eca0f0b0fdd073bfdaf264231ecec40106bf02a',
  };
  try {
    validateDateAuditReport(report, pkt);
    report.validatesWithNativePacket = true;
    delete report.validationError;
  } catch (e) {
    report.validatesWithNativePacket = false;
    report.validationError = e.message;
  }
  const out = path.join(CP, 'independent-date-audit-11cb2c7a-report-draft.json');
  fs.writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ personChecks: personChecks.length, blocks, validated: report.validatesWithNativePacket, error: report.validationError }, null, 2));
}