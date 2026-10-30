from pathlib import Path
j=Path(__file__).resolve().parent;p=j/'candidate/scripts/lib/people-chapter-identity.mjs';s=p.read_text()
s=s.replace("['actualReviewerAgentId', 'authorAgentIds', 'planFingerprint', 'reportFingerprint']", "['actualReviewerAgentId', 'authorAgentIds', 'planFingerprint', 'reportFingerprint', 'sourcePeople']")
needle="  const index = { ...view, localPeople, memberVersions, chapters: new Map([[chapterKey, subjects]]) };"
addition=r'''  need(Array.isArray(bundle.receipt.sourcePeople) && new Set(bundle.receipt.sourcePeople.map(row => row.localId)).size === bundle.receipt.sourcePeople.length,
    'Complete original reviewer source dependencies required');
  const dependencies = new Map();
  for (const row of bundle.receipt.sourcePeople) {
    need(only(row, ['localId', 'fingerprint']), 'Unexpected reviewer source dependency fields');
    const person = localPeople.get(row.localId), source = person && sourceChapters.get(`${person.book}:${person.chapter}`);
    need(source && identitySourceEvidenceFingerprint(person, source.packet) === row.fingerprint,
      `Reviewed primary context or person evidence changed: ${row.localId}`);
    dependencies.set(row.localId, row.fingerprint);
  }
  const required = new Set(bundle.plan.cases.flatMap(item => [...item.localPeople, item.canonicalMembership.anchorLocalId]));
  for (const review of bundle.report.reviews) for (const witness of review.sourceWitnesses) required.add(witness.localId);
  need(required.size === dependencies.size && [...required].every(id => dependencies.has(id)), 'Missing or extraneous original source-person review dependencies');
'''
s=s.replace(needle,addition+needle)
s+=r'''
// These are derived from the EXACT original packet the independent reviewer read.
// Later validation checks whole relevant Chinese units as well as claims/hints;
// retaining an old name quote alone cannot hide changed historical context.
export function identitySourceEvidenceFingerprint(person, packet) {
  const prefix = person.localId.split(':').slice(0, 2).join(':'), ids = new Set();
  for (const claim of person.claims) for (const id of claim.evidence) {
    need(id.startsWith(prefix + ':'), 'Identity claim evidence outside its source chapter'); ids.add(id.slice(prefix.length + 1));
  }
  for (const mention of person.mentions ?? []) ids.add(mention.unit.id);
  const units = new Map(packet.units.map(unit => [unit.id, unit.zh]));
  const primary = [...ids].sort().map(id => { need(units.has(id), `Missing reviewed identity source unit ${prefix}:${id}`); return [id, units.get(id)]; });
  return peopleDigest({ localId: person.localId, promptVersion: person.promptVersion,
    preferredNameSuggestion: person.preferredNameSuggestion, identityHints: person.identityHints ?? null,
    claims: person.claims, mentions: person.mentions ?? [], primary });
}
'''
p.write_text(s)
p=j/'candidate/scripts/test-people-chapter-identity.mjs';s=p.read_text().replace('applyReviewedIdentityUncertainty, IDENTITY_UNCERTAINTY_NOTE','applyReviewedIdentityUncertainty, IDENTITY_UNCERTAINTY_NOTE, identitySourceEvidenceFingerprint')
s=s.replace("const bundle={schemaVersion:","const bundle={schemaVersion:")
s=s.replace("  const catalog={localPersonMap:", "  bundle.receipt.sourcePeople=[own,anchor].map(person=>({localId:person.localId,fingerprint:identitySourceEvidenceFingerprint(person,sources.get('fixture:'+person.chapter).packet)}));\n  const catalog={localPersonMap:")
s=s.replace('/anchor evidence/','/context or person evidence/')
s+="\ntest('a surviving name quote cannot hide changed primary narrative context',()=>{\n const f=fixture();f.sources.get('fixture:002').packet.units[0].zh='非王偉至。';assert.throws(()=>validate(f),/primary context or person evidence changed/);\n});\n"
p.write_text(s)
