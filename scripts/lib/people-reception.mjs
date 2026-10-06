const LIFE_PREDICATES = new Set(['attestation', 'birth', 'death', 'age']);
export const APPROVED_RECEPTION_TYPES = Object.freeze(['retrospective']);
const removedKinds = new Set(['posthumous-commemoration', 'posthumous-reference']);

// Classify explicit semantics only, never infer death from a late mention's date.
export function personClaimReception(claim) {
  const value = claim.value ?? {};
  return value.receptionType === 'retrospective' || value.kind === 'retrospective-reference' ||
    value.action === 'retrospective-reference' ? 'retrospective' : null;
}

export function personReceptionErrors(claim) {
  const errors = [];
  const value = claim.value ?? {};
  if (value.receptionType !== undefined && !APPROVED_RECEPTION_TYPES.includes(value.receptionType)) {
    errors.push('receptionType must be retrospective; no separate posthumous reception category exists');
  }
  if (removedKinds.has(value.kind) || removedKinds.has(value.action)) errors.push('Removed posthumous reception kind; reconcile explicitly to retrospective-reference');
  if (personClaimReception(claim) && LIFE_PREDICATES.has(claim.predicate)) {
    errors.push('Later references and commemoration are not life events; record a separate event or honor, not an attestation, birth, death, or age claim');
  }
  return errors;
}
