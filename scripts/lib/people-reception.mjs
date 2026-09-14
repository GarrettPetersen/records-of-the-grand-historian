const RECEPTION_KINDS = new Map([
  ['posthumous-commemoration', 'posthumous'],
  ['posthumous-reference', 'posthumous'],
  ['retrospective-reference', 'retrospective'],
]);
const LIFE_PREDICATES = new Set(['attestation', 'birth', 'death', 'age']);

// Classify explicit semantics only, never infer death from a late mention's date.
export function personClaimReception(claim) {
  const value = claim.value ?? {};
  return value.receptionType ?? RECEPTION_KINDS.get(value.kind) ??
    RECEPTION_KINDS.get(value.action) ?? null;
}

export function personReceptionErrors(claim) {
  const errors = [];
  const value = claim.value ?? {};
  if (value.receptionType !== undefined && !['posthumous', 'retrospective'].includes(value.receptionType)) {
    errors.push('receptionType must be posthumous or retrospective');
  }
  const kinds = [value.receptionType, RECEPTION_KINDS.get(value.kind), RECEPTION_KINDS.get(value.action)].filter(Boolean);
  if (new Set(kinds).size > 1) errors.push('Conflicting later-reception classifications');
  if (personClaimReception(claim) && LIFE_PREDICATES.has(claim.predicate)) {
    errors.push('Later references and commemoration are not life events; record a separate event or honor, not an attestation, birth, death, or age claim');
  }
  return errors;
}
