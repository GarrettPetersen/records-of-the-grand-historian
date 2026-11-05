import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { observeProvider } from '../../093/bounded-independent-parts-eb9a-20261105/provider-observation.mjs';
const dir = new URL('.', import.meta.url).pathname, read = file => JSON.parse(fs.readFileSync(dir + file));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const need = (ok, message) => { if (!ok) throw Error(message); };
const state = read('review-state.json'), packetBytes = fs.readFileSync(dir + 'focused-english-review-packet.json');
const packet = JSON.parse(packetBytes), raw = fs.readFileSync(dir + 'focused-english-review.raw.json'), review = JSON.parse(raw);
const amendmentBytes = fs.readFileSync(dir + 'focused-return-clause-amendment.raw.json'), amendment = JSON.parse(amendmentBytes);
const amendmentInput = fs.readFileSync(dir + 'return-clause-amendment-packet.json'), proposal = JSON.parse(amendmentInput);
const agentId = state.repairReview.agentId;
need(review.schemaVersion === 1 && review.packetSha256 === hash(packetBytes) && review.reviewer.agentId === agentId && review.verdict === 'approve', 'Independent review changed');
const units = new Map(packet.units.map(u => [u.book + ':' + u.chapter + ':' + u.id, u]));
const proposals = new Map(packet.proposals.map(p => [p.proposalId, p]));
need(review.repairs.length === proposals.size && new Set(review.repairs.map(r => r.proposalId)).size === proposals.size, 'Incomplete review');
function validate(row) {
  const unit = units.get(row.book + ':' + row.chapter + ':' + row.unitId);
  need(unit && ['literal', 'idiomatic'].includes(row.field), 'Unknown repair scope');
  need(row.before === (row.field === 'literal' ? unit.literal : unit.en) && row.pairedFieldChecked === (row.field === 'literal' ? unit.en : unit.literal), 'Exact current paired fields changed');
  need(typeof row.after === 'string' && row.after.trim() && typeof row.reason === 'string' && row.reason.trim() &&
    typeof row.sourceQuote === 'string' && unit.zh.includes(row.sourceQuote) && Array.isArray(row.repeatedUsesChecked), 'Incomplete source-backed replacement');
}
const repairs = [];
for (const row of review.repairs) {
  const original = proposals.get(row.proposalId);
  need(original && ['approve', 'amend', 'reject'].includes(row.verdict) && ['book', 'chapter', 'unitId', 'field', 'before'].every(k => row[k] === original[k]), 'Proposal attribution changed');
  validate(row);
  if (row.verdict !== 'reject') repairs.push({ ...row, originalProposalReason: original.sourceBasedReason, sourceApproval: { reportSha256: hash(raw), reviewerAgentId: agentId, originalProviderMessageId: null } });
}
for (const row of review.additionalRepairs) { validate(row); repairs.push({ ...row, sourceApproval: { reportSha256: hash(raw), reviewerAgentId: agentId, originalProviderMessageId: null } }); }
need(amendment.schemaVersion === 1 && amendment.decision === 'approve' && amendment.reviewerAgentId === agentId &&
  amendment.parentReviewSha256 === hash(raw) && amendment.packetSha256 === hash(amendmentInput) &&
  amendment.before === proposal.before && amendment.after === proposal.proposedAfter && amendment.book === 'jinshu' &&
  amendment.chapter === '109' && amendment.unitId === 's0096' && amendment.field === 'idiomatic', 'Return amendment approval changed');
const target = repairs.find(r => r.proposalId === proposal.proposalId);
need(target && units.get('jinshu:109:s0096').zh.includes(amendment.sourceQuote), 'Return source changed');
target.after = amendment.after; target.reason += ' ' + amendment.reason;
target.sourceApproval.amendmentReportSha256 = hash(amendmentBytes);
need(review.nameCorrectionDecisions.length === 4 && new Set(review.nameCorrectionDecisions.map(r => r.localId)).size === 4, 'All four name records required');
for (const row of review.nameCorrectionDecisions) {
  const old = packet.nameCorrectionEvidence.find(p => p.localId === row.localId);
  need(row.verdict === 'approve' && old && row.before === old.preferredNameSuggestion.en && row.after === row.before.replaceAll('Zhen', 'Zhao'), 'Name correction changed beyond approved spelling');
  for (const [id, en] of Object.entries(row.nameClaimCorrections)) { const claim = old.nameClaims.find(c => c.id === id); need(claim && en === claim.value.en.replaceAll('Zhen', 'Zhao'), 'Unsupported name claim'); }
}
const provider = observeProvider(p => p.id === agentId);
need(provider.lastMessageId === provider.newestEntryId && !['tbs0', 't2s0'].includes(provider.lastMessageId), 'Completed amendment provider not observed');
const accepted = { schemaVersion: 1, kind: 'independently-reviewed-complete-english-amendments', at: new Date().toISOString(),
  sourceApproved: true, agentId, providerObservation: provider, finalAmendmentRunId: provider.lastMessageId,
  originalParentMessageId: null, originalParentMessageIdKnown: false,
  originalParentProvenance: 'Exact raw file downloaded from the same observed native reviewer before the amendment. Prior message ID was not captured before the next turn; do not invent it.',
  packetSha256: hash(packetBytes), reportSha256: hash(raw), amendmentSha256: hash(amendmentBytes), sourceRevision: packet.sourceRevision,
  repairs, nameCorrections: review.nameCorrectionDecisions, canonicalWrites: 0, sourceApplied: false, dateApproval: false, chapterApproval: false };
fs.writeFileSync(dir + 'focused-english-accepted-review.json', JSON.stringify(accepted, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ sourceApproved: true, repairs: repairs.length, nameCorrections: accepted.nameCorrections.length,
  actualAmendmentRun: provider.lastMessageId, parentMessageIdKnown: false, canonicalWrites: 0 }));
