#!/usr/bin/env node
/**
 * Serializes native date-audit reports ONLY from reviewed-decision-table.json.
 * No default verdicts; throws if a planned row fails quote-in-unit verification.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import {
  buildDateAuditPacket,
  validateDateAuditReport,
} from '../../../scripts/lib/people-date-audit.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const table = JSON.parse(fs.readFileSync(path.join(DIR, 'reviewed-decision-table.json'), 'utf8'));
const packet = buildDateAuditPacket('jinshu', '067');
const unitMap = new Map(packet.units.map(unit => [unit.id, unit]));

function assertQuote(unitId, quote, context) {
  const zh = unitMap.get(unitId)?.zh;
  if (!zh || !zh.includes(quote)) {
    throw new Error(`${context}: quote ${JSON.stringify(quote)} not in ${unitId} (${zh?.slice(0, 40)})`);
  }
}

const itemChecks = [];

for (const row of table.itemDecisions) {
  assertQuote(row.unit, row.quote, row.id);
  itemChecks.push({
    id: row.id,
    verdict: row.verdict,
    event: row.event,
    reason: row.reason,
    evidence: [{ unit: row.unit, quote: row.quote }],
  });
}

for (const group of table.attestationGroups) {
  assertQuote(group.unit, group.quote, group.groupId);
  for (const id of group.itemIds) {
    const item = packet.items.find(row => row.id === id);
    if (!item) throw new Error(`Unknown item ${id} in group ${group.groupId}`);
    itemChecks.push({
      id,
      verdict: group.verdict,
      event: item.value?.event ?? group.reason,
      reason: `${group.reason} [group ${group.groupId}]`,
      evidence: [{ unit: group.unit, quote: group.quote }],
    });
  }
}

for (const row of table.attestationIndividual ?? []) {
  assertQuote(row.unit, row.quote, row.id);
  itemChecks.push({
    id: row.id,
    verdict: row.verdict,
    event: row.event,
    reason: row.reason,
    evidence: [{ unit: row.unit, quote: row.quote }],
  });
}

const personChecks = table.personDecisions.map(row => {
  assertQuote(row.unit, row.quote, `person-${row.id}`);
  return {
    id: row.id,
    verdict: row.verdict,
    reason: row.reason,
    evidence: [{ unit: row.unit, quote: row.quote }],
  };
});

const reviewedUnits = [...new Set(itemChecks.flatMap(check => check.evidence.map(c => c.unit)).concat(personChecks.flatMap(c => c.evidence.map(e => e.unit))))].sort();

const s0373 = unitMap.get('s0373');
const report = {
  schemaVersion: 1,
  auditVersion: 1,
  book: 'jinshu',
  chapter: '067',
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  status: table.reportStatus,
  reviewer: table.reviewer,
  reviewedAt: table.reviewedAt,
  summary: table.summary,
  reviewedUnits,
  itemChecks,
  personChecks,
  findings: table.findings,
  references: table.references ?? [
    {
      book: 'jinshu',
      chapter: '067',
      unit: 's0373',
      quote: '太元九年卒，時年七十二',
      sourceHash: `sha256:${createHash('sha256').update(s0373.zh).digest('hex')}`,
      reason: 'Retained from verified round-2/3 Xi Yin review; substantive quotes only.',
    },
  ],
};

validateDateAuditReport(report, packet);

const coverage = {
  packetItems: packet.items.length,
  itemChecksAuthored: itemChecks.length,
  personChecksAuthored: personChecks.length,
  reviewedUnits: reviewedUnits.length,
  packetUnits: packet.units.length,
  packetPeople: packet.people.length,
  editorialByteHash: table.editorialByteHash,
  pinCommit: table.pinCommit,
  supersededTemplateBranch: '#5454 build-date-audit.mjs all-supported — not accepted evidence.',
};

fs.writeFileSync(path.join(DIR, 'date-audit-report-substantive.json'), `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(path.join(DIR, 'native-validation-receipt.json'), `${JSON.stringify({ validateDateAuditReport: 'pass', coverage }, null, 2)}\n`);
console.log(JSON.stringify(coverage, null, 2));