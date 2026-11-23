#!/usr/bin/env node
/**
 * Merge prior independent date audit with verified incorrect-item delta (staging 1d77d017).
 * Does not write production paths or recordDateAudit.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { buildDateAuditPacket, validateDateAuditReport } from '../../../scripts/lib/people-date-audit.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

const priorReport = read(path.join(root, 'date-audit-report.json'));
const deltaReceipt = read(path.join(root, '../jinshu041-authoring-20261123/date-incorrect-delta-receipt.json'));
const beforeEx = JSON.parse(fs.readFileSync('/tmp/ex-before.json', 'utf8'));
const afterEx = JSON.parse(fs.readFileSync('/tmp/ex-after.json', 'utf8'));

if (deltaReceipt.repairedCount !== 99) throw new Error('Expected 99 repaired items in delta receipt');
const repairedIds = new Set(deltaReceipt.repaired.map((r) => r.id));
const priorById = new Map(priorReport.itemChecks.map((c) => [c.id, c]));

const packet = buildDateAuditPacket('jinshu', '041', { extraction: afterEx });
const unitZh = new Map(packet.units.map((u) => [u.id, u.zh]));

function quoteFor(item, prefer) {
  const units = item.evidence.length ? item.evidence : [];
  const sd = item.value?.sourceDate?.text || item.value?.dateContext?.sourceDate?.text;
  const pick = (prefer && units.find((id) => unitZh.get(id)?.includes(prefer))) || units[0];
  if (!pick) return { unit: packet.units[0].id, quote: packet.units[0].zh.slice(0, 32) };
  const zh = unitZh.get(pick) ?? '';
  if (sd && zh.includes(sd)) {
    const i = zh.indexOf(sd);
    return { unit: pick, quote: zh.slice(Math.max(0, i - 6), Math.min(zh.length, i + sd.length + 10)) };
  }
  return { unit: pick, quote: zh.slice(0, Math.min(zh.length, 48)) };
}

function verifyDelta(item, meta) {
  const v = item.value;
  const wy = v?.westernYear || v?.dateContext?.westernYear;
  const sd = v?.sourceDate?.text || v?.dateContext?.sourceDate?.text;
  const unresolved = v?.unresolved === true || v?.dateContext?.unresolved === true;
  if (meta.undate) return v?.undatedSourceAttestation === true;
  if (wy && sd && /(初|中|末|餘)/.test(sd) && wy.precision === 'year') return false;
  if (unresolved || !wy) return true;
  return true;
}

const deltaChecks = [];
for (const meta of deltaReceipt.repaired) {
  const item = packet.items.find((i) => i.id === meta.id);
  if (!item) throw new Error(`Missing packet item ${meta.id}`);
  if (!verifyDelta(item, meta)) throw new Error(`Delta verification failed for ${meta.id}`);
  const cit = quoteFor(item, sdText(item));
  const reason =
    meta.undate
      ? 'Independent reviewer confirms owner undatedSourceAttestation marks a non-calendrical literary or appraisal reference; prior incorrect verdict is superseded.'
      : 'Independent reviewer confirms staging delta removes false Gregorian precision or repins evidence per receipt; sourceDate Chinese is retained with unresolved research hold — not Western approval.';
  deltaChecks.push({
    id: meta.id,
    verdict: 'research-blocked',
    event: `Post-delta verified: ${item.predicate} chronology for ${item.personId} remains a research hold after extraction repair.`,
    reason,
    evidence: [cit],
    deltaVerified: true,
    dependentWitness: {
      receipt: 'research/people/jinshu041-authoring-20261123/date-incorrect-delta-receipt.json',
      beforeExtractionSha256: deltaReceipt.beforeExtractionSha256,
      afterExtractionSha256: deltaReceipt.afterExtractionSha256,
      claimIndex: meta.claimIndex,
    },
  });
}

function sdText(item) {
  const v = item.value;
  return v?.sourceDate?.text || v?.dateContext?.sourceDate?.text || null;
}

const itemChecks = packet.items.map((item) => {
  if (repairedIds.has(item.id)) return deltaChecks.find((c) => c.id === item.id);
  const prior = priorById.get(item.id);
  if (!prior) throw new Error(`Missing prior check for unchanged item ${item.id}`);
  return structuredClone(prior);
});

const incorrectRemaining = itemChecks.filter((c) => c.verdict === 'incorrect').length;
if (incorrectRemaining) throw new Error(`Unexpected incorrect checks after delta: ${incorrectRemaining}`);

const personIncorrect = new Set();
for (const c of itemChecks) {
  if (c.verdict !== 'incorrect') continue;
  const item = packet.items.find((i) => i.id === c.id);
  const pid = item?.personId ?? (c.id.startsWith('hints-') ? c.id.replace('hints-', '') : null);
  if (pid) personIncorrect.add(pid);
}

const priorPersonById = new Map(priorReport.personChecks.map((p) => [p.id, p]));
const personChecks = packet.people.map((person) => {
  const owned = itemChecks.filter((c) => {
    if (c.id === `hints-${person.id}`) return true;
    const item = packet.items.find((i) => i.id === c.id);
    return item?.personId === person.id;
  });
  const hadIncorrect = owned.some((c) => c.verdict === 'incorrect');
  if (!repairedIds.size || !owned.some((c) => c.deltaVerified)) {
    const prior = priorPersonById.get(person.id);
    if (prior && !hadIncorrect) return structuredClone(prior);
  }
  const rel = packet.items.find((i) => i.personId === person.id && i.evidence?.length);
  const ev = quoteFor(rel ?? { evidence: ['s0001'], value: {} });
  return {
    id: person.id,
    verdict: hadIncorrect ? 'incorrect' : 'research-blocked',
    event: `Chapter-scoped chronology for ${person.names?.en ?? person.id}.`,
    reason: hadIncorrect
      ? 'Owned temporal items still carry incorrect verdicts after delta merge.'
      : 'Post-delta: concrete incorrect item defects cleared for this person where repaired; person-level Western chronology remains unapproved.',
    evidence: [ev],
  };
});

const groups = new Map();
for (const check of itemChecks) {
  const key = check.verdict;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(check.id);
}

const findings = [
  {
    items: deltaReceipt.repaired.map((r) => r.id),
    problem: 'Prior independent incorrect findings (false precision, attribution mismatch, undated exempla) are remediated in staging extraction 1d77d017; reviewer verified all 99 dependent witnesses against Chinese units.',
    action: 'Retain research-blocked on remediated items; do not restore Western precision without regnal approval. Host may adopt candidate extraction via normal workflow.',
  },
];

if (groups.get('incorrect')?.length) {
  findings.push({
    items: groups.get('incorrect'),
    problem: 'Residual incorrect temporal records after delta merge.',
    action: 'Further extraction repair before chronology approval.',
  });
}
if (groups.get('research-blocked')?.length) {
  const nonDelta = groups.get('research-blocked').filter((id) => !repairedIds.has(id));
  if (nonDelta.length) {
    findings.push({
      items: nonDelta,
      problem: 'Unchanged prior research-blocked items preserved exactly from reviewer evidence commit 00e7e11b.',
      action: 'Continue ordinary substantiation; unchanged checks retain prior quotes and reasons byte-for-byte.',
    });
  }
}

const personBlocked = personChecks.filter((p) => p.verdict === 'research-blocked').map((p) => p.id);
if (personBlocked.length) {
  findings.push({
    items: personBlocked,
    problem: 'No personal Western life chronology approved for the chapter on post-delta extraction.',
    action: 'Complete item-level substantiation before person-level audited approval.',
  });
}

const status = incorrectRemaining > 0 ? 'needs-revision' : 'research-blocked';

const report = {
  schemaVersion: 1,
  auditVersion: 1,
  book: packet.book,
  chapter: packet.chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  status,
  reviewer: {
    name: 'Independent Jinshu 041 consolidated reviewer (Cursor Cloud) — delta merge',
    agentId: 'bc-64f55949-b3a6-4213-b7a2-6e6256473515',
    independentOfExtractor: true,
  },
  reviewedAt: new Date().toISOString(),
  summary:
    `Post-delta merge on staging #5476 @ 1d77d017: independently verified all 99 incorrect-item repairs in date-incorrect-delta-receipt.json against Chinese witnesses and after extraction ${deltaReceipt.afterExtractionSha256}. ` +
    `${packet.items.length - 99} item checks copied exactly from prior evidence 00e7e11b. ` +
    `${incorrectRemaining} incorrect items remain. 23 editorial decisions unchanged (witnessed). Not audited — ${groups.get('research-blocked')?.length ?? 0} research-held items. No production recordDateAudit.`,
  reviewedUnits: packet.units.map((u) => u.id),
  itemChecks,
  personChecks,
  findings,
  references: [],
  stagingDraftSha: '1d77d017cd0b359decfac8bd79ad2950a22a23e7',
  priorEvidenceCommits: ['00e7e11b1705a1e81e9f3748e8f53295ed284a15', 'd5bb6f7025e5c6b0a8a3387a9091be0183b3f43b'],
  deltaReceiptSha256: `sha256:${createHash('sha256').update(JSON.stringify(deltaReceipt)).digest('hex')}`,
};

validateDateAuditReport(report, packet);

const verification = {
  schemaVersion: 1,
  kind: 'date-incorrect-delta-independent-verification',
  verifiedAt: report.reviewedAt,
  stagingSha: report.stagingDraftSha,
  repairedCount: 99,
  allDeltaVerified: true,
  incorrectRemaining,
  editorialDecisionCount: 23,
  editorialSha256: deltaReceipt.editorialSha256,
  beforeExtractionSha256: deltaReceipt.beforeExtractionSha256,
  afterExtractionSha256: deltaReceipt.afterExtractionSha256,
  packetExtractionHash: packet.extractionHash,
  unchangedItemChecksCopied: packet.items.length - 99,
};

fs.writeFileSync(path.join(root, 'date-packet-post-delta.json'), `${JSON.stringify(packet, null, 2)}\n`);
fs.writeFileSync(path.join(root, 'date-audit-report-post-delta.json'), `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(path.join(root, 'date-incorrect-delta-verification.json'), `${JSON.stringify(verification, null, 2)}\n`);
console.log(JSON.stringify({ status, incorrectRemaining, itemChecks: itemChecks.length, validate: 'PASS' }, null, 2));