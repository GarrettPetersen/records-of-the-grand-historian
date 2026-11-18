// A source-audited paternal kinship graph can individuate an unnamed father.
// This is witness binding, not content approval or a new direct name mention.
export function inferredPaternalWitness(person, sourceId, quote, text, sourcePeople, nameOccurs) {
  const names = person.claims.filter(c => c.predicate === 'name');
  if (!(sourcePeople instanceof Map) || typeof nameOccurs !== 'function' ||
      typeof text !== 'string' || typeof quote !== 'string' || !/\p{Script=Han}/u.test(quote) || !text.includes(quote) ||
      typeof person.mentionException !== 'string' || !person.mentionException.trim() ||
      (person.mentions ?? []).length || !names.length ||
      !names.every(c => c.certainty === 'strongly-inferred' && c.value.kind === 'descriptive-kinship') ||
      !person.claims.some(c => c.predicate === 'attestation' && c.certainty === 'strongly-inferred' && c.evidence.includes(sourceId))) return false;
  const prefix = person.localId.split(':').slice(0, 2).join(':') + ':';
  const people = [...sourcePeople.values()].filter(p => p.localId.startsWith(prefix));
  const edges = p => p.claims.filter(c => c.subject === p.localId && c.predicate === 'family-relationship' && c.evidence.includes(sourceId));
  const fatherOf = (father, child) => edges(father).some(c => c.certainty === 'strongly-inferred' &&
    c.value.relation === 'parent-of' && c.value.personId === child.localId && c.value.line === 'paternal' &&
    c.value.subjectRole === 'father' && c.value.objectRole === 'son' && c.value.kinshipTerm?.zh === '父') ||
    edges(child).some(c => c.certainty === 'strongly-inferred' && c.value.relation === 'child-of' &&
      c.value.personId === father.localId && c.value.line === 'paternal' && c.value.subjectRole === 'son' &&
      c.value.objectRole === 'father' && c.value.kinshipTerm?.zh === '父');
  const brothers = (a, b, uncleTerm = null) => [[a, b], [b, a]].some(([subject, object]) =>
    edges(subject).some(c => c.certainty === 'strongly-inferred' && c.value.relation === 'sibling-of' &&
      c.value.personId === object.localId && c.value.line === 'paternal' &&
      // 伯父/叔父 also constrain the father's age relative to his brother.
      (!uncleTerm || !c.value.subjectRelativeAge || c.value.subjectRelativeAge ===
        ((subject.localId === person.localId) === (uncleTerm === '伯父') ? 'younger' : 'elder'))));
  // A named 伯父/叔父 and the explicitly recorded nephew individuate the father.
  // The narrative subject can be elided; the named uncle must occur IN the quote.
  for (const relative of people) for (const edge of edges(relative)) {
    const v = edge.value;
    if (edge.certainty !== 'explicit' || v.relation !== 'kin-of' || v.line !== 'paternal' ||
        !['伯父', '叔父'].includes(v.kinshipTerm?.zh) || !quote.includes(v.kinshipTerm.zh) ||
        !Array.isArray(v.intermediaryPersonIds) || v.intermediaryPersonIds.length !== 1 ||
        v.intermediaryPersonIds[0] !== person.localId) continue;
    const other = sourcePeople.get(v.personId);
    if (!other || other.localId !== v.personId || !other.localId.startsWith(prefix)) continue;
    for (const [child, uncle] of [[relative, other], [other, relative]]) {
      if (new Set([child.localId, uncle.localId, person.localId]).size !== 3 ||
          !fatherOf(person, child) || !brothers(person, uncle, v.kinshipTerm.zh)) continue;
      if (nameOccurs(uncle, quote)) return true;
    }
  }
  // 從弟 X ... Y 子: X is a paternal cousin and Y his explicit father.
  // Together with the two fathers' sibling edge this individuates the other
  // father, without guessing a personal name or requiring an invented mention.
  if (!quote.includes('從弟') || !quote.includes('子')) return false;
  for (const child of people) {
    if (child.localId === person.localId || !fatherOf(person, child)) continue;
    for (const cousinEdge of edges(child)) {
      const v = cousinEdge.value;
      if (cousinEdge.certainty !== 'explicit' || v.relation !== 'kin-of' || v.line !== 'paternal' || v.kinshipTerm?.zh !== '從弟') continue;
      const cousin = sourcePeople.get(v.personId);
      if (!cousin || cousin.localId !== v.personId || !cousin.localId.startsWith(prefix) || !nameOccurs(cousin, quote)) continue;
      for (const uncle of people) {
        if (new Set([person.localId, child.localId, cousin.localId, uncle.localId]).size !== 4 || !brothers(person, uncle)) continue;
        if (edges(uncle).some(c => c.certainty === 'explicit' && c.value.relation === 'parent-of' &&
            c.value.personId === cousin.localId && c.value.line === 'paternal' &&
            c.value.kinshipTerm?.zh === '子' && c.value.subjectRole === 'father' && c.value.objectRole === 'son') &&
            nameOccurs(uncle, quote)) return true;
      }
    }
  }
  return false;
}
