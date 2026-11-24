#!/usr/bin/env node
/**
 * Refuses chronology review rows with missing units, quotes not in source, or empty decisions.
 */
import { readFileSync } from 'node:fs';
import { buildDateAuditPacket } from '../../scripts/lib/people-date-audit.mjs';

const tablePath = process.argv[2];
if (!tablePath) {
  console.error('Usage: node jinshu023-verify-chronology-witness.mjs <review-table.json>');
  process.exit(1);
}

const table = JSON.parse(readFileSync(tablePath, 'utf8'));
const packet = buildDateAuditPacket('jinshu', '023');
const unitZh = Object.fromEntries(packet.units.map((u) => [u.id, u.zh]));
const knownItems = new Set(packet.items.map((i) => i.id));

const errors = [];
for (const row of table.reviewedItems ?? []) {
  if (!knownItems.has(row.id)) errors.push(`${row.id}: unknown item id`);
  if (!row.verdict) errors.push(`${row.id}: missing verdict`);
  if (!['supported', 'incorrect', 'research-blocked'].includes(row.verdict)) {
    errors.push(`${row.id}: invalid verdict ${row.verdict}`);
  }
  if (!row.witnessUnit || !unitZh[row.witnessUnit]) {
    errors.push(`${row.id}: missing or unknown witnessUnit ${row.witnessUnit}`);
  }
  if (typeof row.witnessQuote !== 'string' || row.witnessQuote.length < 2) {
    errors.push(`${row.id}: missing witnessQuote`);
  } else if (!unitZh[row.witnessUnit].includes(row.witnessQuote)) {
    errors.push(`${row.id}: witnessQuote not contained in ${row.witnessUnit} Chinese`);
  }
  if (typeof row.rationale !== 'string' || row.rationale.trim().length < 20) {
    errors.push(`${row.id}: rationale too short`);
  }
}

const ids = new Set((table.reviewedItems ?? []).map((r) => r.id));
if (ids.size !== (table.reviewedItems ?? []).length) errors.push('duplicate item ids in table');
if (ids.size !== packet.items.length) {
  errors.push(`coverage gap: ${ids.size} rows for ${packet.items.length} packet items`);
}

if (table.coverage?.substantiveCoverageComplete && ids.size !== packet.items.length) {
  errors.push('substantiveCoverageComplete true but table incomplete');
}

if (errors.length) {
  console.error('VERIFY FAILED');
  for (const e of errors) errors.length <= 30 ? console.error(`- ${e}`) : null;
  console.error(errors.slice(0, 50).map((e) => `- ${e}`).join('\n'));
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  items: ids.size,
  substantiveCoverageComplete: Boolean(table.coverage?.substantiveCoverageComplete),
}, null, 2));