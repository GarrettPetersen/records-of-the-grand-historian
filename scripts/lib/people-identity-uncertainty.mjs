import { peopleDigest } from './people-identity-seal.mjs';
import { identityArtifactHash } from './people-identity-artifacts.mjs';

const need = (ok, message) => { if (!ok) throw new Error(message); };
const key = item => peopleDigest([item.canonicalPersonId, [...item.localPeople].sort()]);

// Read the actual selected reviewer rows, never the retrieval proposal or an
// unselected historical component. This preflight grants no native approval.
export function selectedIdentityUncertainty(bundle) {
  const cases = new Map(bundle.plan.cases.map(item => [item.id, item]));
  const result = new Map();
  const add = row => {
    const item = cases.get(row.caseId);
    need(item && item.canonicalPersonId === row.canonicalPersonId && row.verdict === 'approve' &&
      typeof row.unresolvedIdentity === 'boolean', 'Invalid selected identity uncertainty row');
    const id = key(item);
    need(!result.has(id), 'Duplicate selected identity uncertainty assignment');
    result.set(id, { caseId: item.id, canonicalPersonId: item.canonicalPersonId,
      localPeople: [...item.localPeople], unresolvedIdentity: row.unresolvedIdentity });
  };
  if (bundle.kind === 'chapter-identity-review') {
    need(bundle.receipt.reportFingerprint === peopleDigest(bundle.report), 'Changed original uncertainty report');
    for (const row of bundle.report.reviews) add(row);
  } else {
    need(bundle.kind === 'chapter-identity-review-composition', 'Native identity proof required for uncertainty preflight');
    const components = new Map(bundle.components.map(component => [component.id, component]));
    for (const selection of bundle.selections) {
      const component = components.get(selection.componentId);
      need(component, 'Missing selected uncertainty component');
      const { id, ...body } = component;
      need(id === peopleDigest(body) && identityArtifactHash(Buffer.from(component.reportText)) === component.receipt.reportSha256,
        'Changed selected uncertainty component');
      const rows = JSON.parse(component.reportText).reviews;
      for (const caseId of selection.caseIds) {
        const matches = rows.filter(row => row.caseId === caseId);
        need(matches.length === 1, 'Missing or duplicate selected uncertainty case');
        add(matches[0]);
      }
    }
  }
  return result;
}

// Preserve accepted uncertainty in the next review instructions, even when a
// bounded index now returns no candidates. This changes no captured report.
export function acceptedIdentityUncertaintyInstruction(plan, previous) {
  const accepted = selectedIdentityUncertainty(previous);
  const ids = plan.cases.filter(item => accepted.get(key(item))?.unresolvedIdentity).map(item => item.id);
  return ' Previously accepted unresolved identity must remain true for these unchanged assignments, regardless of the generated proposal or missing bounded candidates: ' +
    JSON.stringify(ids) + '. Any genuine certainty change requires explicit positive source-backed reconciliation and normal native validation; this ordinary replacement path cannot approve it.';
}

// Run after native validation and before replacing a canonical proof. No host
// override or reason-text heuristic can turn an accepted unknown into certainty.
// A genuine certainty change needs a separately reviewed positive source-backed
// reconciliation mechanism; the ordinary replacement path fails closed here.
export function assertIdentityUncertaintyPreserved(previous, next) {
  need(peopleDigest(previous.scope) === peopleDigest(next.scope), 'Identity uncertainty scope changed');
  const before = selectedIdentityUncertainty(previous), after = selectedIdentityUncertainty(next);
  const compared = [];
  for (const [id, row] of before) {
    const current = after.get(id);
    if (!current) continue; // Changed membership remains subject to native gates.
    need(!row.unresolvedIdentity || current.unresolvedIdentity,
      `Accepted unresolved identity became certain for ${row.canonicalPersonId}: explicit positive source-backed reconciliation required; bounded no-candidates is insufficient`);
    compared.push({ ...current, previousUnresolvedIdentity: row.unresolvedIdentity });
  }
  return compared;
}
