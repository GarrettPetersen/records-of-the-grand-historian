// Bind an unnamed spouse's individuality, never their inferred English identity.
// The explicit relationship must quote the named endpoint followed by 作儷.
export function inferredSpouseWitness(person, sourceId, quote, text, sourcePeople, sourceNames, normalize) {
  if (!(sourcePeople instanceof Map) || !person || typeof person.mentionException !== 'string' ||
      !person.mentionException.trim() || typeof sourceId !== 'string' || typeof quote !== 'string' ||
      typeof text !== 'string' || !text.includes(quote)) return false;
  const names = person.claims.filter(claim => claim.predicate === 'name');
  if (!names.length || !names.every(claim => claim.subject === person.localId &&
      claim.certainty === 'strongly-inferred' && !claim.value.zh &&
      ['personal', 'personal-name', 'descriptive-kinship'].includes(claim.value.kind)) ||
      person.mentions.some(mention => (mention.spans?.zh ?? []).length)) return false;
  const prefix = sourceId.slice(0, sourceId.lastIndexOf(':') + 1);
  if (!person.localId.startsWith(prefix)) return false;
  const matches = [];
  for (const relative of sourcePeople.values()) {
    if (relative.localId === person.localId || !relative.localId.startsWith(prefix)) continue;
    for (const claim of relative.claims) {
      const value = claim.value;
      if (claim.subject !== relative.localId || claim.predicate !== 'family-relationship' ||
          claim.certainty !== 'explicit' || !claim.evidence.includes(sourceId) ||
          value.relation !== 'spouse-of' || value.personId !== person.localId ||
          value.kinshipTerm?.zh !== '作儷' || value.unionCategory !== 'marriage' ||
          ![['wife', 'husband'], ['husband', 'wife']].some(roles =>
            roles[0] === value.subjectRole && roles[1] === value.objectRole)) continue;
      const bound = [...sourceNames(relative)].some(name => typeof name === 'string' && name &&
        /\p{Script=Han}/u.test(name) && normalize(quote).includes(normalize(name + '作儷')));
      if (bound) matches.push(claim);
    }
  }
  return matches.length === 1;
}
