import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { buildDateAuditPacket, validateDateAuditReport } from '../../../scripts/lib/people-date-audit.mjs';

// Isolated research proposal only: never record an audit or touch shared state.
const revision = '6b3fe7a8c4f5072b9fd44e5e74140d8a1fd88b17';
const output = path.resolve('data/people/generated/jinshu128-date-evidence-hold-6b3fe7a');
const pins = {
  'data/jinshu/128.json': '8b301825b81b5df574732ea81b2ec17ee1fa25a4761e39775df575ea9505f35b',
  'data/people/extractions/jinshu/128.json': 'd4986ae4036b5eb25eecaac66122d9419ac0da5ba17372ad2fda0cc8889eba1c',
  'data/people/date-audits/jinshu/128.json': '29e939e37f98fb6609d991d2db4dd7900a1853343a661e3cd628a39660063acd',
};
const hash = value => createHash('sha256').update(value).digest('hex');
const inputs = Object.fromEntries(Object.entries(pins).map(([file, expected]) => {
  const bytes = execFileSync('git', ['show', `${revision}:${file}`], { maxBuffer: 30_000_000 });
  if (hash(bytes) !== expected) throw new Error(`Staged input fingerprint mismatch: ${file}`);
  return [file, bytes];
}));
const extraction = JSON.parse(inputs['data/people/extractions/jinshu/128.json']);
const prior = JSON.parse(inputs['data/people/date-audits/jinshu/128.json']);
const reviewerId = '/root/near_complete_jinshu';
const authors = [extraction.run?.agentId, ...(extraction.run?.chunks ?? []).map(chunk => chunk.agentId)].filter(Boolean);
if (authors.includes(reviewerId)) throw new Error('Reviewer is an extraction author');
if (prior.status !== 'audited' || prior.references.length !== 0) throw new Error('Unexpected prior report');
for (const id of ['hints-p002', 'hints-p003']) {
  const check = prior.itemChecks.find(item => item.id === id);
  if (check?.verdict !== 'supported' || check.evidence.length !== 1 ||
      check.evidence[0].unit !== 's0002' || check.evidence[0].quote !== '慕容超') {
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
write(path.join(output, 'data/jinshu/128.json'), inputs['data/jinshu/128.json']);
const packet = buildDateAuditPacket('jinshu', '128', { dataDir: path.join(output, 'data'), extraction });
if (packet.sourceHash !== prior.sourceHash || packet.extractionHash !== prior.extractionHash) throw new Error('Prior report does not match staged inputs');
const items = [
  { id: 'hints-p002', unit: 's0003', quote: '德兄北海王納', owner: 'Murong Na', dates: 'AD 370-384' },
  { id: 'hints-p003', unit: 's0278', quote: '慕容德', owner: 'Murong De', dates: 'AD 384-405' },
];
for (const x of items) {
  const item = packet.items.find(item => item.id === x.id);
  if (!item || !item.value.includes(x.dates)) throw new Error(`Unexpected hint ${x.id}`);
}
const report = {
  schemaVersion: 1, auditVersion: 1, book: 'jinshu', chapter: '128',
  sourceHash: packet.sourceHash, extractionHash: packet.extractionHash,
  reviewer: { name: 'Independent Jinshu 128 date-evidence reviewer', agentId: reviewerId, independentOfExtractor: true },
  reviewedAt: '2026-10-19T04:33:37Z', status: 'research-blocked',
  summary: 'Focused independent examination of two previously approved active-date hints found their recorded citations name another person and do not document the dates. This partial evidence hold is not a full chapter audit or a claim that the historical dates are false.',
  reviewedUnits: ['s0002', 's0003', 's0278'],
  itemChecks: items.map(x => ({
    id: x.id, verdict: 'research-blocked',
    reason: `The prior report cites only s0002 naming Murong Chao, which does not identify ${x.owner} or establish ${x.dates}. The current chapter passage identifies the person but is not a source for either endpoint; independent dated evidence remains to be assessed.`,
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
