const REMOVED_EVENT_KINDS = new Set(['posthumous-commemoration', 'posthumous-reference']);
const LIFE_PREDICATES = new Set(['attestation', 'birth', 'death', 'age']);

// Recognize invalid legacy labels conservatively during recovery: they must not
// turn a later reference into living activity before validation rejects them.
// Recognition does not make an obsolete category valid.
export function personClaimReception(claim) {
  const value = claim.value ?? {};
  return ['retrospective', 'posthumous'].includes(value.receptionType) ||
    value.kind === 'retrospective-reference' || REMOVED_EVENT_KINDS.has(value.kind) ||
    value.action === 'retrospective-reference' || REMOVED_EVENT_KINDS.has(value.action) ? 'retrospective' : null;
}

export function personReceptionErrors(claim) {
  const errors = [];
  const value = claim.value ?? {};
  if (value.receptionType !== undefined && value.receptionType !== 'retrospective') {
    errors.push('receptionType must be retrospective');
  }
  if (REMOVED_EVENT_KINDS.has(value.kind)) {
    errors.push('Removed posthumous reception kind; reconcile it explicitly to retrospective-reference');
  }
  if (personClaimReception(claim) && LIFE_PREDICATES.has(claim.predicate)) {
    errors.push('Later references and commemoration are not life events; record a separate event or honor, not an attestation, birth, death, or age claim');
  }
  return errors;
}
