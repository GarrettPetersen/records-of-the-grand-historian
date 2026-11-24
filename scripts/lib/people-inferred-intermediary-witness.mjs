// Binds a native Chinese witness to an unnamed person recorded as the
// intermediary of an explicit kinship edge (X之曾孫, X外孫, 舅Y). The person is
// individuated only by a verified graph path between source-bound endpoints.
// This is witness binding: it supplies no literal name or mention and does
// not review any asserted identity, name, date or content.

// Descent terms: ancestor → intermediaries (in listed order) → descendant.
const DESCENT = new Map([
  ['曾孫', { generation: 3, line: 'paternal' }],
  ['外孫', { generation: 2, line: 'maternal' }],
]);
// 舅: nephew/niece ← mother (the intermediary) — sibling — maternal uncle.
const UNCLE = '舅';
const PARENT_TERM = new Map([['父', ['parent', 'male']], ['母', ['parent', 'female']], ['女', ['child', 'female']], ['男', ['child', 'male']]]);

const roleSex = role => typeof role !== 'string' ? null :
  /mother|daughter|sister|wife|niece|aunt/i.test(role) ? 'female' :
  /father|son|brother|husband|nephew|uncle/i.test(role) ? 'male' : null;

function sexLedger() {
  const sexes = new Map();
  const add = (p, sex) => {
    if (sex !== 'male' && sex !== 'female') return;
    if (!sexes.has(p.localId)) sexes.set(p.localId, new Set());
    sexes.get(p.localId).add(sex);
  };
  return {
    add,
    claims: p => { for (const c of p.claims ?? []) if (c.predicate === 'sex') add(p, c.value?.sex ?? c.value?.value); },
    of: p => { const s = sexes.get(p.localId); return !s ? null : s.size === 1 ? [...s][0] : 'conflict'; },
  };
}

/**
 * @param unitNames (relative) => normalized Chinese names evidenced for that
 *   relative in THIS source unit (current native name evidence).
 * @param normalize (zhText) => the same normalization applied to those names.
 */
export function inferredIntermediaryWitness(person, sourceId, quote, text, sourcePeople, unitNames, normalize) {
  const names = (person?.claims ?? []).filter(c => c.predicate === 'name');
  if (!(sourcePeople instanceof Map) || typeof unitNames !== 'function' || typeof normalize !== 'function' ||
      typeof person?.localId !== 'string' || typeof sourceId !== 'string' ||
      typeof text !== 'string' || typeof quote !== 'string' || !/\p{Script=Han}/u.test(quote) || !text.includes(quote) ||
      typeof person.mentionException !== 'string' || !person.mentionException.trim() || (person.mentions ?? []).length ||
      !names.length || !names.every(c => c.certainty === 'strongly-inferred' && c.value?.kind === 'descriptive-kinship') ||
      !names.some(c => Array.isArray(c.evidence) && c.evidence.includes(sourceId))) return false;
  const prefix = person.localId.split(':').slice(0, 2).join(':') + ':';
  if (!sourceId.startsWith(prefix)) return false;
  const get = id => {
    if (id === person.localId) return person;
    const p = typeof id === 'string' && id.startsWith(prefix) ? sourcePeople.get(id) : null;
    return p?.localId === id ? p : null;
  };
  const edges = p => (p.claims ?? []).filter(c => c.subject === p.localId && c.predicate === 'family-relationship' && c.value &&
    ['explicit', 'strongly-inferred'].includes(c.certainty) && Array.isArray(c.evidence) && c.evidence.length &&
    c.evidence.every(u => typeof u === 'string' && u.startsWith(prefix)));
  const nq = normalize(quote), nt = normalize(text);
  const named = p => [...(unitNames(p) ?? [])].filter(n => typeof n === 'string' && n);
  // The non-anchored endpoint is named in this unit, or is the elided
  // narrative subject: the subject of the explicit edge, with an explicit
  // Chinese name elsewhere in the chapter.
  const bound = (endpoint, subject) => named(endpoint).some(n => nt.includes(n)) ||
    (endpoint.localId === subject.localId && (endpoint.claims ?? []).some(c => c.predicate === 'name' &&
      c.certainty === 'explicit' && typeof c.value?.zh === 'string' && /\p{Script=Han}/u.test(c.value.zh)));

  // Every parent/child edge between the pair must be biological with parental
  // roles; edges touching the target must cite this unit.
  const parentLink = (parent, child, incident, sex) => {
    const found = [
      ...edges(parent).filter(c => c.value.relation === 'parent-of' && c.value.personId === child.localId)
        .map(c => [c, c.value.subjectRole, c.value.objectRole]),
      ...edges(child).filter(c => c.value.relation === 'child-of' && c.value.personId === parent.localId)
        .map(c => [c, c.value.objectRole, c.value.subjectRole])];
    for (const [c, parentRole, childRole] of found) {
      if ((c.value.parentage ?? 'biological') !== 'biological' ||
          (parentRole !== undefined && !['parent', 'father', 'mother'].includes(parentRole)) ||
          (childRole !== undefined && !['child', 'son', 'daughter'].includes(childRole))) return false;
      sex.add(parent, roleSex(parentRole)); sex.add(child, roleSex(childRole));
      const term = PARENT_TERM.get(c.value.kinshipTerm?.zh);
      if (term) sex.add(term[0] === 'parent' ? parent : child, term[1]);
    }
    return found.some(([c]) => !incident || c.evidence.includes(sourceId)) ? found.map(([c]) => c) : false;
  };
  const siblingLink = (a, b, sex) => {
    const found = [
      ...edges(a).filter(c => c.value.relation === 'sibling-of' && c.value.personId === b.localId).map(c => [c, a, b]),
      ...edges(b).filter(c => c.value.relation === 'sibling-of' && c.value.personId === a.localId).map(c => [c, b, a])];
    for (const [c, s, o] of found) {
      if ((c.value.line ?? 'maternal') !== 'maternal' ||
          [c.value.subjectRole, c.value.objectRole].some(r => r !== undefined && !/brother|sister|sibling/.test(r))) return false;
      sex.add(s, roleSex(c.value.subjectRole)); sex.add(o, roleSex(c.value.objectRole));
    }
    return found.some(([c]) => c.evidence.includes(sourceId));
  };
  // A recorded line on a parent link must match the parent's resolved sex.
  const linesAgree = (links, sex) => links.every(([parent, found]) => found.every(c => c.value.line === undefined ||
    (['male', 'female'].includes(sex.of(parent)) && c.value.line === (sex.of(parent) === 'female' ? 'maternal' : 'paternal'))));

  const descent = (subject, e, contract, term) => {
    const v = e.value, other = get(v.personId);
    if (v.line !== contract.line || v.generationDistance !== contract.generation ||
        v.intermediaryPersonIds.length !== contract.generation - 1 || !other) return false;
    const [anc, desc, ancRole, descRole] = v.relation === 'ancestor-of' ? [subject, other, v.subjectRole, v.objectRole] :
      v.relation === 'descendant-of' ? [other, subject, v.objectRole, v.subjectRole] : [];
    if (!anc || (ancRole !== undefined && !/grand(father|mother|parent)/.test(ancRole)) ||
        (descRole !== undefined && !/grand(son|daughter|child)/.test(descRole))) return false;
    const path = [anc, ...v.intermediaryPersonIds.map(get), desc];
    if (path.some(p => !p) || new Set(path.map(p => p.localId)).size !== path.length) return false;
    const sex = sexLedger(), links = [];
    sex.add(anc, roleSex(ancRole)); sex.add(desc, roleSex(descRole));
    for (let i = 0; i + 1 < path.length; i++) {
      const found = parentLink(path[i], path[i + 1], path[i] === person || path[i + 1] === person, sex);
      if (!found) return false;
      links.push([path[i], found]);
    }
    path.forEach(sex.claims);
    const middle = path.slice(1, -1);
    if (path.some(p => sex.of(p) === 'conflict') || !linesAgree(links, sex) ||
        (contract.line === 'paternal' ? middle.some(p => sex.of(p) === 'female') : !middle.every(p => sex.of(p) === 'female'))) return false;
    return named(anc).some(n => nq.includes(n + term) || nq.includes(n + normalize('之') + term)) && bound(desc, subject);
  };

  const maternalUncle = (subject, e, term) => {
    const v = e.value, other = get(v.personId);
    if (v.relation !== 'kin-of' || v.line !== 'maternal' || v.intermediaryPersonIds.length !== 1 || !other) return false;
    for (const [nephew, uncle, nephewRole, uncleRole] of [[subject, other, v.subjectRole, v.objectRole], [other, subject, v.objectRole, v.subjectRole]]) {
      if (new Set([nephew.localId, uncle.localId, person.localId]).size !== 3 ||
          (nephewRole !== undefined && !/nephew|niece/.test(nephewRole)) || (uncleRole !== undefined && !/uncle/.test(uncleRole))) continue;
      const sex = sexLedger();
      sex.add(nephew, roleSex(nephewRole)); sex.add(uncle, roleSex(uncleRole));
      const link = parentLink(person, nephew, true, sex);
      if (!link || !siblingLink(person, uncle, sex)) continue;
      [nephew, uncle, person].forEach(sex.claims);
      if ([nephew, uncle, person].some(p => sex.of(p) === 'conflict') || sex.of(person) !== 'female' ||
          sex.of(uncle) !== 'male' || !linesAgree([[person, link]], sex)) continue;
      // The named uncle must follow 舅 in the quote (or his evidenced name is 舅…).
      if (named(uncle).some(n => nq.includes(term + n) || (n.length > term.length && n.startsWith(term) && nq.includes(n))) &&
          bound(nephew, subject)) return true;
    }
    return false;
  };

  const people = new Map([[person.localId, person]]);
  for (const p of sourcePeople.values()) if (p?.localId !== person.localId && get(p?.localId) === p) people.set(p.localId, p);
  for (const subject of people.values()) for (const e of edges(subject)) {
    const v = e.value, zh = v.kinshipTerm?.zh;
    if (e.certainty !== 'explicit' || !e.evidence.includes(sourceId) || typeof zh !== 'string' || !quote.includes(zh) ||
        !Array.isArray(v.intermediaryPersonIds) || !v.intermediaryPersonIds.includes(person.localId) ||
        new Set(v.intermediaryPersonIds).size !== v.intermediaryPersonIds.length) continue;
    if (DESCENT.has(zh) ? descent(subject, e, DESCENT.get(zh), normalize(zh)) :
      zh === UNCLE && maternalUncle(subject, e, normalize(zh))) return true;
  }
  return false;
}
