// A reviewed name revision may later be superseded only by an ordinary claim
// revision inside a later independent editorial review: tied to that review's
// own accepted English repair, which must be exactly the old-to-new English
// name substitution on the claim's evidence unit. Only the English reading may
// change; the historical revision itself is never rewritten.
import { isDeepStrictEqual as same } from 'node:util';

const HAN = /\p{Script=Han}/u;
const CLAIM_KEYS = ['id', 'subject', 'predicate', 'value', 'certainty', 'evidence'];
const MAX_WITNESS = 32;
const exactKeys = (value, keys) => !!value && typeof value === 'object' && !Array.isArray(value) &&
  same(Object.keys(value).sort(), [...keys].sort());

export function isNameOnlyClaimCorrection(before, after) {
  if (!exactKeys(before, CLAIM_KEYS) || !exactKeys(after, CLAIM_KEYS) || before.predicate !== 'name' ||
      !Array.isArray(before.evidence) || !before.evidence.length) return false;
  for (const key of ['id', 'subject', 'predicate', 'certainty', 'evidence']) if (!same(before[key], after[key])) return false;
  const b = before.value, a = after.value;
  if (!b || !a || typeof b !== 'object' || typeof a !== 'object' || !same(Object.keys(b).sort(), Object.keys(a).sort()) ||
      typeof b.kind !== 'string' || typeof b.zh !== 'string' || !HAN.test(b.zh)) return false;
  for (const key of Object.keys(b)) if (key !== 'en' && !same(b[key], a[key])) return false;
  return typeof b.en === 'string' && typeof a.en === 'string' && a.en !== b.en && a.en.length > 0 &&
    a.en.trim() === a.en && !HAN.test(a.en);
}

// The accepted English repair replaces exactly one whole-word occurrence of the
// old reading with the new reading and changes nothing else.
function exactNameSubstitution(before, after, oldEn, newEn) {
  if (typeof before !== 'string' || typeof after !== 'string') return false;
  const at = before.indexOf(oldEn);
  return at >= 0 && before.indexOf(oldEn, at + 1) < 0 &&
    !/[A-Za-z]/.test(before[at - 1] ?? '') && !/[A-Za-z]/.test(before[at + oldEn.length] ?? '') &&
    after === before.slice(0, at) + newEn + before.slice(at + oldEn.length);
}

export function nameCorrectionLinkErrors(review, revision, { book, chapter }) {
  if (!exactKeys(revision, ['repairId', 'before', 'after', 'reason', 'sourceWitness'])) return ['unexpected claim revision fields'];
  const { before, after } = revision;
  if (!isNameOnlyClaimCorrection(before, after)) return ['may change only the English reading of a name claim'];
  const errors = [];
  if (typeof revision.reason !== 'string' || revision.reason.trim().length < 20) errors.push('requires reviewer reasoning');
  const proposals = (review?.proposals ?? []).filter(p => p.id === revision.repairId);
  const decisions = (review?.decisions ?? []).filter(d => d.repairId === revision.repairId);
  if (proposals.length !== 1 || decisions.length !== 1 || !['accept', 'revise'].includes(decisions[0].decision)) {
    return [...errors, 'must cite one English repair accepted in the same review'];
  }
  const proposal = proposals[0], decision = decisions[0], unit = proposal.unit?.id;
  if (!before.evidence.includes(`${book}:${chapter}:${unit}`)) errors.push('English repair is not on the claim evidence unit');
  if (!exactNameSubstitution(proposal.before, decision.decision === 'revise' ? decision.after : proposal.after, before.value.en, after.value.en)) {
    errors.push('accepted English repair is not exactly this name substitution');
  }
  const witness = revision.sourceWitness;
  if (!exactKeys(witness, ['source', 'citation', 'excerpt']) || witness.source !== 'chapter-text' ||
      ![unit, `${book}/${chapter} ${unit}`].includes(witness.citation) || typeof witness.excerpt !== 'string' ||
      witness.excerpt.length > MAX_WITNESS || !witness.excerpt.includes(before.value.zh)) {
    errors.push('requires a bounded source witness of the unchanged Chinese name');
  }
  return errors;
}

// A missing reviewed replacement fact is accounted for only by exactly one
// later reviewed name correction of it (or a chain of them) ending in a present
// fact, with each superseded fact no longer applied.
export function supersededByLaterNameCorrection(claim, laterReviews, { book, chapter, present, applied }) {
  const links = laterReviews.flatMap(review => (review.claimRevisions ?? []).map(revision => ({ review, revision })));
  const used = new Set();
  for (let current = claim; ;) {
    const next = links.filter(link => same(link.revision?.before, current));
    if (next.length !== 1 || used.has(next[0]) || applied(current) ||
        nameCorrectionLinkErrors(next[0].review, next[0].revision, { book, chapter }).length) return false;
    used.add(next[0]);
    if (present(next[0].revision.after)) return true;
    current = next[0].revision.after;
  }
}

/**
 * Host request template only; it carries no authority. The reviewer that
 * accepted englishRepairId adds this row to that same review, or declines.
 */
export function buildNameCorrectionRevision({ book, chapter, historicalReviews, review, currentClaims, claimId, englishRepairId }) {
  const touching = historicalReviews.flatMap(r => (r.claimRevisions ?? []).filter(x => x.before?.id === claimId || x.after?.id === claimId));
  if (touching.length !== 1) throw new Error('Historical name revision is missing or ambiguous');
  const old = touching[0].after;
  const corrected = currentClaims.filter(claim => isNameOnlyClaimCorrection(old, { ...old, value: claim.value }) &&
    claim.subject === old.subject && claim.predicate === old.predicate && claim.certainty === old.certainty && same(claim.evidence, old.evidence));
  if (corrected.length !== 1 || currentClaims.some(claim => same([claim.subject, claim.predicate, claim.value], [old.subject, old.predicate, old.value]))) {
    throw new Error('Current corrected name claim is missing or ambiguous');
  }
  const decision = (review.decisions ?? []).find(d => d.repairId === englishRepairId);
  const revision = { repairId: englishRepairId, before: structuredClone(old), after: { ...structuredClone(old), value: structuredClone(corrected[0].value) },
    reason: decision?.reason, sourceWitness: structuredClone(touching[0].sourceWitness) };
  const errors = nameCorrectionLinkErrors(review, revision, { book, chapter });
  if (errors.length) throw new Error(`Name correction template invalid: ${errors.join('; ')}`);
  return revision;
}
