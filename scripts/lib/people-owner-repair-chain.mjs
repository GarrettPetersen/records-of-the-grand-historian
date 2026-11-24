// Owner repair-row assembly. The owner's valid chain of rows is retained row for
// row, so every repair ID keeps its position; only source-journal changes not
// yet recorded are appended (as one row per field, as before). Independently
// accepted incoming rows must survive exactly. Nothing here grants approval.
import { isDeepStrictEqual as same } from 'node:util';

const CONFIDENCE = ['high', 'medium', 'low'];
const need = (ok, message) => { if (!ok) throw new Error(message); };
const key = (unitId, field) => `${unitId}/${field}`;

// Per unit/field, the exact text states the source journal passes through.
export function journalStates(journal) {
  need(Array.isArray(journal), 'Owner coherence: source repair journal is missing');
  const states = new Map();
  for (const [index, r] of journal.entries()) {
    need(r && ['unitId', 'field', 'before', 'after'].every(k => typeof r[k] === 'string'), `Owner coherence: source journal record ${index} is malformed`);
    const k = key(r.unitId, r.field);
    if (!states.has(k)) states.set(k, { unitId: r.unitId, field: r.field, values: [r.before], steps: [] });
    const s = states.get(k);
    need(s.values.at(-1) === r.before, `Owner coherence: source journal record ${index} does not start from the current ${k} text`);
    s.values.push(r.after);
    s.steps.push({ ...r, index });
  }
  return states;
}

// Accept/revise decisions proven by an actual, structurally valid review by a
// non-author: the proposal contract, not the reviewer ID alone, is the proof.
export function acceptedRepairContracts(reviews, { book, chapter, authors, validateReview }) {
  const pattern = new RegExp(`^${`${book}:${chapter}`.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:r(\\d{4,})$`);
  const contracts = [];
  for (const review of reviews) {
    const agentId = review?.reviewer?.agentId;
    if (typeof agentId !== 'string' || !agentId.trim() || authors.includes(agentId)) continue;
    const approvals = (review.decisions ?? []).filter(d => ['accept', 'revise'].includes(d.decision));
    if (!approvals.length) continue;
    validateReview(review);
    for (const decision of approvals) {
      const proposal = (review.proposals ?? []).find(p => p.id === decision.repairId), ordinal = pattern.exec(decision.repairId ?? '');
      need(proposal && ordinal, `Owner coherence: accepted repair ${decision.repairId} has no matching reviewed proposal`);
      contracts.push({ id: decision.repairId, index: Number(ordinal[1]) - 1, unitId: proposal.unit?.id, field: proposal.field, before: proposal.before,
        after: decision.decision === 'revise' ? decision.after : proposal.after, reasons: [proposal.reason, decision.reason] });
    }
  }
  return contracts;
}

const contractTuple = c => [c.unitId, c.field, c.before, c.after];

export function assembleOwnerRepairChain({ journal, manualRows, repairConfidence = {}, contracts = [] }) {
  const states = journalStates(journal), position = new Map();
  need(Array.isArray(manualRows), 'Owner coherence: candidate repair rows are missing');
  for (const [i, row] of manualRows.entries()) {
    const label = `Owner coherence: repair row ${i} after the canonical prefix`;
    need(Array.isArray(row) && row.length === 7 && row.slice(0, 5).every(v => typeof v === 'string') && row[6] === 'applied', `${label} is malformed`);
    const [unitId, field, before, after, reason, confidence] = row, k = key(unitId, field), s = states.get(k);
    need(s, `${label} has no source journal record for ${k}`);
    const p = position.get(k) ?? 0;
    need(before === s.values[p], `${label} does not start from the current ${k} text (source-before mismatch)`);
    const q = s.values.findIndex((value, j) => j > p && value === after);
    need(before !== after && q > p, `${label} is not a recorded source journal change`);
    const reviewed = contracts.filter(c => same(contractTuple(c), row.slice(0, 4))).flatMap(c => c.reasons);
    need(reason.trim() && (s.steps.slice(p, q).some(step => step.reason === reason) || reviewed.includes(reason)),
      `${label} reason is bound to neither its source journal records nor an actual review`);
    need(CONFIDENCE.includes(confidence), `${label} has missing or invalid confidence`);
    position.set(k, q);
  }
  const appended = [], missing = [];
  for (const [k, s] of states) {
    const p = position.get(k) ?? 0, last = s.values.length - 1;
    if (s.values[p] === s.values[last]) continue;
    const step = s.steps.at(-1), confidence = step.confidence ?? repairConfidence[String(step.index)];
    if (!CONFIDENCE.includes(confidence)) missing.push(step.index);
    appended.push([s.unitId, s.field, s.values[p], s.values[last], step.reason, confidence, 'applied']);
  }
  return { rows: [...manualRows.map(row => [...row]), ...appended], appended, missing };
}

export function assertAcceptedRepairsPreserved(rows, contracts) {
  const byIndex = new Map();
  for (const c of contracts) {
    const prior = byIndex.get(c.index);
    need(!prior || same(contractTuple(prior), contractTuple(c)), `Owner coherence: contradictory accepted approvals for ${c.id}`);
    byIndex.set(c.index, prior ? { ...prior, reasons: [...prior.reasons, ...c.reasons] } : c);
  }
  for (const c of byIndex.values()) {
    const row = rows[c.index];
    need(Array.isArray(row) && same(row.slice(0, 4), contractTuple(c)) && c.reasons.includes(row[4]) && row[6] === 'applied',
      `Owner coherence: independently accepted repair ${c.id} was changed or dropped; restore it exactly and record later changes as new rows`);
  }
  return byIndex.size;
}
