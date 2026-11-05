import { peopleDigest } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-identity-seal.mjs';

const need = (ok, message) => { if (!ok) throw Error(message); };
const allowed = (value, keys, label) => need(value && Object.keys(value).every(key => keys.includes(key)), 'Unknown ' + label + ' field requires explicit review: ' + (value && Object.keys(value).filter(key => !keys.includes(key)).join(',')));
const sorted = values => values.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b), 'en'));

// Diagnostic proposal only: callers must FIRST run the native extraction validator.
// It proves span geometry/scanner accounting against the current source. This
// function does not grant publication, identity membership or chronology approval.
// Keep multiplicity; never turn claims or mentions into sets.
export function semanticIdentityEvidence(person, packet) {
  allowed(person, ['localId', 'preferredNameSuggestion', 'historicity', 'descriptorSuggestion', 'identityHints', 'mentionException', 'book', 'chapter', 'promptVersion', 'claims', 'mentions'], 'person');
  const { claims, mentions, ...attributes } = person;
  need(Array.isArray(claims) && Array.isArray(mentions), 'Complete normalized claims and mentions required');
  const prefix = person.book + ':' + person.chapter + ':', ids = new Set();
  need(person.localId.startsWith(prefix), 'Person scope mismatch');
  const facts = claims.map(claim => {
    allowed(claim, ['id', 'subject', 'predicate', 'value', 'certainty', 'evidence'], 'claim');
    need(claim.subject === person.localId && Array.isArray(claim.evidence), 'Claim attribution mismatch');
    for (const id of claim.evidence) { need(id.startsWith(prefix), 'Claim evidence outside source chapter'); ids.add(id.slice(prefix.length)); }
    const { id, ...fact } = claim;
    return { ...fact, evidence: [...fact.evidence].sort() };
  });
  const occurrences = mentions.flatMap(mention => {
    allowed(mention, ['id', 'person', 'unit', 'kind', 'spans', 'candidateRefs'], 'mention');
    need(mention.person === person.localId && typeof mention.unit?.id === 'string', 'Mention attribution mismatch');
    allowed(mention.spans, ['zh', 'en'], 'mention language');
    ids.add(mention.unit.id);
    return Object.entries(mention.spans).flatMap(([language, spans]) => spans.map(span => {
      allowed(span, ['exact', 'occurrence', 'startCodePoint', 'endCodePoint', 'unitTextHash'], 'span');
      need(typeof span.exact === 'string' && Number.isInteger(span.occurrence) && span.occurrence >= 0, 'Exact source occurrence required');
      return { person: mention.person, unitId: mention.unit.id, kind: mention.kind, language, exact: span.exact, occurrence: span.occurrence };
    }));
  });
  const units = new Map(packet.units.map(unit => [unit.id, unit.zh]));
  need(units.size === packet.units.length, 'Duplicate source unit');
  const primary = [...ids].sort().map(id => { need(typeof units.get(id) === 'string', 'Missing primary Chinese ' + prefix + id); return [id, units.get(id)]; });
  return { version: 1, attributes, claims: sorted(facts), mentions: sorted(occurrences), primary };
}

export const semanticIdentityFingerprint = (person, packet) => peopleDigest(semanticIdentityEvidence(person, packet));
