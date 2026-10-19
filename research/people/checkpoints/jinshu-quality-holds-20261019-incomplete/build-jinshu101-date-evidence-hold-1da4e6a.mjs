import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { buildDateAuditPacket, validateDateAuditReport } from '../../../scripts/lib/people-date-audit.mjs';

// This generator creates isolated research evidence only. It neither records
// an audit nor modifies canonical data, queue state, claims or locks.
const revision = '1da4e6a2ca9df03d780ab18762e43e5e50b787a2';
const output = path.resolve('data/people/generated/jinshu101-date-evidence-hold-1da4e6a');
const pins = {
  'data/jinshu/101.json': '221808c006bb5d8250863e40a79c07a056dd4f0137f273fe7e91e1c6f22d51c8',
  'data/people/extractions/jinshu/101.json': '7aae76a6377c5ed33c633a8688fd8db7b0baf9b1e0e1cf984b368d6d53e7ad99',
  'data/people/date-audits/jinshu/101.json': 'd195f9298f6029667b540686f05117869ba6999dd97d9ff0011cbbda4a1d0355',
};
const hash = value => createHash('sha256').update(value).digest('hex');
const inputs = Object.fromEntries(Object.entries(pins).map(([file, expected]) => {
  const bytes = execFileSync('git', ['show', `${revision}:${file}`], { maxBuffer: 30_000_000 });
  if (hash(bytes) !== expected) throw new Error(`Staged input fingerprint mismatch: ${file}`);
  return [file, bytes];
}));
const extraction = JSON.parse(inputs['data/people/extractions/jinshu/101.json']);
const prior = JSON.parse(inputs['data/people/date-audits/jinshu/101.json']);
const reviewerId = '/root/near_complete_jinshu';
const authors = [extraction.run?.agentId, ...(extraction.run?.chunks ?? []).map(chunk => chunk.agentId)].filter(Boolean);
if (authors.includes(reviewerId)) throw new Error('Reviewer is an extraction author');
if (prior.status !== 'audited' || prior.references.length !== 0) throw new Error('Unexpected prior report');
for (const id of ['hints-p008', 'hints-p009', 'hints-p010']) {
  const check = prior.itemChecks.find(item => item.id === id);
  if (check?.verdict !== 'supported' || check.evidence.length !== 1 ||
      check.evidence[0].unit !== 's0001' || check.evidence[0].quote !== '劉元海（子和） 劉宣') {
    throw new Error(`Historical evidence changed for ${id}`);
  }
}
const write = (file, content) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file)) {
    if (!fs.readFileSync(file).equals(Buffer.from(content))) throw new Error(`Refusing to overwrite different artifact: ${file}`);
    return;
  }
  fs.writeFileSync(file, content, { flag: 'wx' });
};
const json = obj => `${JSON.stringify(obj, null, 2)}\n`;
write(path.join(output, 'data/jinshu/101.json'), inputs['data/jinshu/101.json']);
const packet = buildDateAuditPacket('jinshu', '101', { dataDir: path.join(output, 'data'), extraction });
if (packet.sourceHash !== prior.sourceHash || packet.extractionHash !== prior.extractionHash) throw new Error('Prior report does not match staged inputs');
const items = [
  { id: 'hints-p008', unit: 's0014', quote: '孔子', owner: 'Confucius', dates: 'BC 551-479' },
  { id: 'hints-p009', unit: 's0014', quote: '管仲', owner: 'Guan Zhong', dates: 'BC 685-645' },
  { id: 'hints-p010', unit: 's0017', quote: '漢宣帝', owner: 'Emperor Xuan of Han', dates: 'BC 74-48' },
];
for (const x of items) {
  const item = packet.items.find(item => item.id === x.id);
  if (!item || !item.value.includes(x.dates)) throw new Error(`Unexpected hint ${x.id}`);
}
const report = {
  schemaVersion: 1, auditVersion: 1, book: 'jinshu', chapter: '101',
  sourceHash: packet.sourceHash, extractionHash: packet.extractionHash,
  reviewer: { name: 'Independent Jinshu 101 date-evidence reviewer', agentId: reviewerId, independentOfExtractor: true },
  reviewedAt: '2026-10-19T04:30:04Z', status: 'research-blocked',
  summary: 'Focused independent examination of three previously approved active-date hints found that their recorded citations refer to unrelated people and do not document the dates. This is a partial evidence hold, not a full chapter audit or a claim that the historical dates are false.',
  reviewedUnits: ['s0001', 's0014', 's0017'],
  itemChecks: items.map(x => ({
    id: x.id, verdict: 'research-blocked',
    reason: `The prior report cites only s0001 about Liu Yuanhai and Liu Xuan, which does not identify ${x.owner} or establish ${x.dates}. The current chapter passage identifies the person but is not a source for either endpoint; independent dated evidence remains to be assessed.`,
    event: `${x.owner}: proposed active-date hint ${x.dates}; no specific dated activity established by the cited passage.`,
    evidence: [{ unit: x.unit, quote: x.quote }],
  })),
  personChecks: [],
  findings: items.map(x => ({
    items: [x.id],
    problem: `The prior support citation identifies neither ${x.owner} nor the endpoints ${x.dates}; the person's source mention is not evidence for the dates. Their historical correctness has not been assessed.`,
    action: 'Locate and independently verify direct source evidence for each endpoint, or conservatively remove the unsupported hint through the normal reviewed repair workflow; re-audit the complete current chapter.',
  })),
  references: [],
};
validateDateAuditReport(report, packet);
write(path.join(output, 'packet.json'), json(packet));
write(path.join(output, 'report-proposal.json'), json(report));
write(path.join(output, 'receipt.json'), json({ revision, pins, sourceFingerprint: packet.sourceHash, extractionFingerprint: packet.extractionHash, reviewerId, extractorAgentIds: [...new Set(authors)], reportSha256: hash(json(report)), scope: 'Partial research hold only; not recorded, published, or a full date audit.' }));
console.log(JSON.stringify({ output, valid: true, sourceFingerprint: packet.sourceHash, extractionFingerprint: packet.extractionHash, itemChecks: report.itemChecks.length }));
