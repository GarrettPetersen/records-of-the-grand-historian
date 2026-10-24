import { readFileSync, writeFileSync } from 'node:fs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from '../../../../../../scripts/lib/people-date-audit.mjs';
import { applyDateRepairProposal } from '../../../../../../scripts/lib/people-date-workflow.mjs';
import { buildPeopleExtractionPacket } from '../../../../../../scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '../../../../../../scripts/validate-people-extraction.mjs';
import { sha256 } from '../../../../../../scripts/lib/people-content.mjs';

const base = 'data/people/generated/date-workflow/jinshu/022/';
const read = name => JSON.parse(readFileSync(`${base}${name}`, 'utf8'));
const candidate = read('candidate-4.json');
const review = read('review-4.json');
const packet = buildDateAuditPacket('jinshu', '022', { extraction: candidate });
if (packet.sourceHash !== review.sourceHash || packet.extractionHash !== review.extractionHash) throw new Error('Retained candidate or source differs from review-4');
const before = candidate.claims[73];
if (before[0] !== 'p012' || before[1] !== 'event-participation' || before[2]?.dateContext?.sourceDate?.text !== '魏文侯聆古樂而恐臥') throw new Error('Claim 74 no longer matches expected input');
const after = structuredClone(before);
delete after[2].dateContext;
const proposal = {
  schemaVersion: 1, kind: 'date-repair-proposal', book: 'jinshu', chapter: '022',
  sourceHash: packet.sourceHash, extractionHash: packet.extractionHash,
  author: { name: 'Codex research triage', agentId: 'jinshu022-undated-marquis-triage-20261020' },
  changes: [{ kind: 'replace', id: 'claim-74', before, after,
    reason: 'The cited phrase describes listening to music but includes no temporal expression. Preserve the undated event and existing undated attestation without constructing a sourceDate from the event text; independent review must decide whether this contradicts the retained research hold.' }]
};
const result = applyDateRepairProposal(candidate, proposal, packet);
let validation;
try {
  const valid = validateCompactPeopleExtraction(result, buildPeopleExtractionPacket('jinshu', '022'));
  validation = { status: 'passed', stats: valid.stats };
} catch (error) {
  if (!Array.isArray(error.errors)) throw error;
  validation = { status: 'failed', errors: error.errors };
}
const geometry = dateAuditDiagnostics(dateAuditItems(result));
const resultPacket = buildDateAuditPacket('jinshu', '022', { extraction: result });
const payload = { kind: 'incomplete-triage-not-an-approval', sourceHash: packet.sourceHash, extractionHash: packet.extractionHash,
  candidateHash: sha256(JSON.stringify(result)), candidatePacket: { sourceHash: resultPacket.sourceHash, extractionHash: resultPacket.extractionHash, units: resultPacket.units.length, items: resultPacket.items.length },
  scopedValidation: validation, dateDiagnostics: { status: geometry.length ? 'failed' : 'passed', errors: geometry }, proposal };
const output = `${base}triage-undated-marquis-proposal-incomplete.json`;
writeFileSync(output, `${JSON.stringify(payload, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify(payload, null, 2));
if (validation.status !== 'passed' || geometry.length) process.exitCode = 1;
