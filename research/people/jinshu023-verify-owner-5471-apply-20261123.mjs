#!/usr/bin/env node
/**
 * Verify owner #5471 grouped apply (102 rows) against independent phase-3 findings at d8a7b411.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { buildDateAuditPacket } from '../../scripts/lib/people-date-audit.mjs';

const PIN = 'd0f5e31ad74f8dbd3db8885c57c2600709c83c07';
const PHASE3_TABLE = 'research/people/jinshu023-chronology-substantive-review-table-20261123-phase3-d8a7b411-incomplete.json';

const receipt = JSON.parse(readFileSync('research/people/jinshu023-owner-grouped-chronology-receipt-20261123.json', 'utf8'));
const phase3 = JSON.parse(readFileSync(PHASE3_TABLE, 'utf8'));
const packet = buildDateAuditPacket('jinshu', '023');

const priorIncorrect = new Set(
  phase3.reviewedItems.filter((r) => r.verdict === 'incorrect' && r.id.startsWith('claim-')).map((r) => r.id),
);
const opIds = new Set(receipt.operations.map((o) => o.id));

const errors = [];
if (receipt.operations.length !== 102) errors.push(`expected 102 operations, got ${receipt.operations.length}`);
if (priorIncorrect.size !== 102) errors.push(`phase3 incorrect count ${priorIncorrect.size}, not 102`);
for (const id of priorIncorrect) if (!opIds.has(id)) errors.push(`phase3 incorrect ${id} missing from owner receipt`);
for (const id of opIds) if (!priorIncorrect.has(id)) errors.push(`owner op ${id} was not incorrect in phase3`);

function hasWestern(value) {
  return Boolean(
    value?.westernYear ||
    value?.westernBounds ||
    value?.dateContext?.westernYear ||
    value?.dateContext?.westernBounds,
  );
}

const rowResults = [];
for (const op of receipt.operations) {
  const item = packet.items.find((i) => i.id === op.id);
  if (!item) {
    errors.push(`${op.id}: missing in packet`);
    continue;
  }
  const w = hasWestern(item.value);
  if (op.westernRetained && !w) errors.push(`${op.id}: westernRetained true but no western in claim`);
  if (!op.westernRetained && w) errors.push(`${op.id}: western should be removed`);
  if (JSON.stringify(item.evidence) !== JSON.stringify(op.afterEvidence)) {
    errors.push(`${op.id}: evidence mismatch`);
  }
  if (op.researchHold && !(item.value?.unresolved || item.value?.dateContext?.unresolved)) {
    errors.push(`${op.id}: researchHold without unresolved flag`);
  }
  rowResults.push({
    id: op.id,
    group: op.group,
    evidenceExpanded: op.evidenceExpanded,
    researchHold: op.researchHold,
    westernRetained: op.westernRetained,
    postApplyHasWestern: w,
    verified: true,
  });
}

const out = {
  schemaVersion: 1,
  kind: 'jinshu023-owner-5471-apply-verification',
  pinnedCommit: PIN,
  independentFindingsCommit: receipt.independentFindingsCommit,
  operationsExpected: 102,
  operationsVerified: rowResults.length,
  phase3IncorrectIds: priorIncorrect.size,
  allPhase3IncorrectAddressed: [...priorIncorrect].every((id) => opIds.has(id)),
  errors,
  ok: errors.length === 0,
  groupsApplied: receipt.groupsApplied,
  rows: rowResults,
};

writeFileSync('research/people/jinshu023-verify-owner-5471-apply-20261123-incomplete.json', `${JSON.stringify(out, null, 2)}\n`);
if (errors.length) {
  console.error('VERIFY 5471 APPLY FAILED', errors.slice(0, 20));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, operations: rowResults.length, groups: receipt.groupsApplied }, null, 2));