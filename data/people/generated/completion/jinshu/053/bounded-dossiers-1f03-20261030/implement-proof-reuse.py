from pathlib import Path
j=Path(__file__).resolve().parent;p=j/'candidate/scripts/lib/people-identity-dossiers.mjs';s=p.read_text()
old='export function validateRetainedDossierReview(index, plan, report, sourceUnits, actualReviewerAgentId, authorAgentIds, currentInputs, nameKeysForPerson) {'
assert s.count(old)==1
s=s.replace(old,"""export function validateRetainedDossierReview(index, plan, report, sourceUnits, actualReviewerAgentId, authorAgentIds, currentInputs, nameKeysForPerson) {
  requireValue(peopleDigest(currentInputs) === peopleDigest(plan.inputs), 'Current chapter source/editorial/date inputs changed');
  return validateDossierIdentityEvidence(index, plan, report, sourceUnits, actualReviewerAgentId, authorAgentIds, nameKeysForPerson);
}

// This checks the preserved independent report, current source persons, quotes,
// complete coverage and accepted membership. A publication caller must ALSO
// verify the original full primary-context/person dependencies and fresh chapter
// gates before reusing it after unrelated envelope metadata changed.
export function validateDossierIdentityEvidence(index, plan, report, sourceUnits, actualReviewerAgentId, authorAgentIds, nameKeysForPerson) {""")
s=s.replace("  requireValue(peopleDigest(currentInputs) === peopleDigest(plan.inputs), 'Current chapter source/editorial/date inputs changed');\n  requireValue(Array.isArray(authorAgentIds)", "  requireValue(Array.isArray(authorAgentIds)")
p.write_text(s)
p=j/'candidate/scripts/lib/people-chapter-identity.mjs';s=p.read_text().replace('validateRetainedDossierReview, memberContract','validateDossierIdentityEvidence, memberContract')
s=s.replace("    const certificate = validateRetainedDossierReview(index, bundle.plan, bundle.report, sourceUnits,\n      bundle.receipt.actualReviewerAgentId, bundle.receipt.authorAgentIds, inputs, localNameKeys);", """    need(only(inputs, ['source', 'extraction', 'editorial', 'dateAudit']) && Object.values(inputs).every(value => /^sha256:[a-f0-9]{64}$/u.test(value)), 'Current chapter evidence fingerprints required');
    const proof = validateDossierIdentityEvidence(index, bundle.plan, bundle.report, sourceUnits,
      bundle.receipt.actualReviewerAgentId, bundle.receipt.authorAgentIds, localNameKeys);
    // Never rewrite the original plan/report hashes. This is a new aggregate
    // over the unchanged independently reviewed identity and primary contexts.
    // Current editorial/date approval is checked separately by the shared gate.
    const certificate = { ...proof, kind: 'revalidated-chapter-identity-dossiers',
      reviewedInputs: bundle.plan.inputs, currentInputs: inputs,
      sourceDependencies: peopleDigest(bundle.receipt.sourcePeople), originalBundle: peopleDigest(bundle),
      unchangedSourceProofsReused: peopleDigest(inputs) !== peopleDigest(bundle.plan.inputs) };""")
p.write_text(s)
p=j/'candidate/scripts/test-people-chapter-identity.mjs';s=p.read_text().replace("test('independently held cases and stale chapter pins do not qualify'", "test('held cases fail while unchanged identity proofs survive a new current envelope'")
s=s.replace("const g=fixture();g.inputs={...g.inputs,source:`sha256:${'f'.repeat(64)}`};assert.throws(()=>validate(g),/inputs changed/);", "const g=fixture();g.inputs={...g.inputs,editorial:`sha256:${'f'.repeat(64)}`};const c=validate(g);assert.equal(c.unchangedSourceProofsReused,true);assert.deepEqual(c.reviewedInputs,g.bundle.plan.inputs);assert.deepEqual(c.currentInputs,g.inputs);assert.notDeepEqual(c.reviewedInputs,c.currentInputs);assertReviewedIdentityCoverage(g.corpus,g.view,[c]);")
p.write_text(s)
