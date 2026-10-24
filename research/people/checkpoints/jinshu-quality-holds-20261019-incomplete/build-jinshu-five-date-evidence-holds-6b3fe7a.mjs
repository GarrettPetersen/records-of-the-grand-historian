import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { buildDateAuditPacket, validateDateAuditReport } from '../../../scripts/lib/people-date-audit.mjs';

// Isolated, partial research proposals; no audit recording or shared state.
const revision = '6b3fe7a8c4f5072b9fd44e5e74140d8a1fd88b17';
const reviewerId = '/root/near_complete_jinshu';
const specs = [
  { chapter: '093', id: 'hints-p001', owner: 'Fan Miqing', dates: ['AD 25-51'], unit: 's0011', quote: '樊靡卿', oldUnit: 's0001', oldQuote: '詳觀往誥，逖聽前聞，階緣外戚以致顯榮者，其所由來尚矣。', pins: ['8625c06da214d53adfc71c4969a6e5a2766db30b29b73dc0e2ee23ff8a77626c','4c235fe03b5db2c79c7e881fc28b0333f2315bf02a39496f50b87f6abf8968d8','c269aad0cf926284689249fe390fc48c94879b3636a95634d2c8b2ed64999c30'] },
  { chapter: '109', id: 'hints-p002', owner: 'Murong Hui', dates: ['AD 317','AD 333'], unit: 's0003', quote: '廆第三子也', oldUnit: 's0002', oldQuote: '慕容皝', pins: ['aa15f4935b0154841972a9b61f6ecfbaee031bf3db500c5cf6888bc47a71f888','e42c9e04d3b850076f96dc1c94721f2ad71cc819bc27cdb21187f55e84135c97','0fb2dcc5bf9462a5e9c3fb2864c29905051a1ffc2769274883e5ad5ef7c04808'] },
  { chapter: '117', id: 'hints-p002', owner: 'Yao Chang', dates: ['AD 384-393'], unit: 's0003', quote: '萇之長子也', oldUnit: 's0001', oldQuote: '姚興', pins: ['2552c5a88825731c15e29c75f59307498da03fe3be47474ef701bc9c0134319b','379798b9b414bee941eb268aee4cbff5f3697b515cc4b00bb0d00df7c6bf3189','e6f01637565b4b12e1e296349bac1269689d85fae6bfc82efc448d07c2040036'] },
  { chapter: '119', id: 'hints-p002', owner: 'Yao Xing', dates: ['AD 394-416'], unit: 's0003', quote: '興之長子也', oldUnit: 's0002', oldQuote: '姚泓', pins: ['6dfc672b2d80926464480722baa3a9f1ab09b2ac611551238aba3066e6c5423c','4a1114d93e54faa26103ba6b5ec6b76010cc9681e237a515a499b6c0c7e270d3','454f44ea3c8985a394e5af8d0b52686d21e167bb1aa473bfed6c4cb0e5887aef'] },
  { chapter: '130', id: 'hints-p002', owner: 'Qubei', dates: ['AD 216'], unit: 's0002', quote: '匈奴右賢王去卑之後', oldUnit: 's0001', oldQuote: '赫連勃勃', pins: ['39f412a07af0f35e380043253c4368b73f7ef35ae6ac1550da6527c0cb9cdd92','1f80ff81d513e3592888f3e0fc0487324d4d9920de98538d045bdf073c00eb7f','d4bb1343159d60a34788d1a090afcd057bf1a5791f4acc1dfa8ce3d518bd6509'] },
];
const hash = value => createHash('sha256').update(value).digest('hex');
const json = obj => `${JSON.stringify(obj, null, 2)}\n`;
const write = (file, content) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file)) {
    if (!fs.readFileSync(file).equals(Buffer.from(content))) throw new Error(`Refusing to overwrite different artifact: ${file}`);
    return;
  }
  fs.writeFileSync(file, content, { flag: 'wx' });
};
for (const s of specs) {
  const paths = [`data/jinshu/${s.chapter}.json`, `data/people/extractions/jinshu/${s.chapter}.json`, `data/people/date-audits/jinshu/${s.chapter}.json`];
  const inputs = paths.map((file, i) => {
    const bytes = execFileSync('git', ['show', `${revision}:${file}`], { maxBuffer: 30_000_000 });
    if (hash(bytes) !== s.pins[i]) throw new Error(`Staged input fingerprint mismatch: ${file}`);
    return bytes;
  });
  const extraction = JSON.parse(inputs[1]), prior = JSON.parse(inputs[2]);
  const authors = [extraction.run?.agentId, ...(extraction.run?.chunks ?? []).map(chunk => chunk.agentId)].filter(Boolean);
  if (authors.includes(reviewerId)) throw new Error(`Reviewer is an extraction author: ${s.chapter}`);
  if (prior.status !== 'audited' || prior.references.length !== 0) throw new Error(`Unexpected prior report: ${s.chapter}`);
  const check = prior.itemChecks.find(item => item.id === s.id);
  if (check?.verdict !== 'supported' || check.evidence.length !== 1 || check.evidence[0].unit !== s.oldUnit || check.evidence[0].quote !== s.oldQuote) throw new Error(`Historical evidence changed: ${s.chapter}`);
  const output = path.resolve(`data/people/generated/jinshu${s.chapter}-date-evidence-hold-6b3fe7a`);
  write(path.join(output, `data/jinshu/${s.chapter}.json`), inputs[0]);
  const packet = buildDateAuditPacket('jinshu', s.chapter, { dataDir: path.join(output, 'data'), extraction });
  if (packet.sourceHash !== prior.sourceHash || packet.extractionHash !== prior.extractionHash) throw new Error(`Prior report does not match staged inputs: ${s.chapter}`);
  const item = packet.items.find(x => x.id === s.id);
  if (!item || !s.dates.every(date => item.value.includes(date))) throw new Error(`Unexpected hint: ${s.chapter}`);
  const dates = s.dates.join(' and ');
  const report = {
    schemaVersion: 1, auditVersion: 1, book: 'jinshu', chapter: s.chapter,
    sourceHash: packet.sourceHash, extractionHash: packet.extractionHash,
    reviewer: { name: `Independent Jinshu ${s.chapter} date-evidence reviewer`, agentId: reviewerId, independentOfExtractor: true },
    reviewedAt: '2026-10-19T04:39:01Z', status: 'research-blocked',
    summary: 'Focused independent examination of one previously approved active-date hint found its recorded citation does not establish the date. This partial evidence hold is not a full chapter audit or a claim that the historical date is false.',
    reviewedUnits: [s.oldUnit, s.unit],
    itemChecks: [{ id: s.id, verdict: 'research-blocked',
      reason: `The prior report cites only ${s.oldUnit}, which does not identify ${s.owner} or establish ${dates}. The current chapter excerpt refers to the person but is not a source for the hint dates; independent dated evidence remains to be assessed.`,
      event: `${s.owner}: proposed active-date hint ${dates}; no specific dated activity established by the cited passage.`,
      evidence: [{ unit: s.unit, quote: s.quote }] }],
    personChecks: [],
    findings: [{ items: [s.id], problem: `The prior support citation identifies neither ${s.owner} nor the proposed dates ${dates}; the person's source mention is not evidence for those dates. Their historical correctness has not been assessed.`,
      action: 'Locate and independently verify direct source evidence for the proposed dates, or conservatively remove the unsupported hint through the normal reviewed repair workflow; re-audit the complete current chapter.' }],
    references: [],
  };
  validateDateAuditReport(report, packet);
  write(path.join(output, 'packet.json'), json(packet));
  write(path.join(output, 'report-proposal.json'), json(report));
  write(path.join(output, 'receipt.json'), json({ revision, pins: Object.fromEntries(paths.map((p, i) => [p, s.pins[i]])), sourceFingerprint: packet.sourceHash, extractionFingerprint: packet.extractionHash, reviewerId, extractorAgentIds: [...new Set(authors)], reportSha256: hash(json(report)), scope: 'Partial research hold only; not recorded, published, or a full date audit.' }));
  console.log(JSON.stringify({ chapter: s.chapter, output, valid: true, sourceFingerprint: packet.sourceHash, extractionFingerprint: packet.extractionHash }));
}
