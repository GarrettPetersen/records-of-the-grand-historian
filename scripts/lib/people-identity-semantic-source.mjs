import { peopleDigest } from './people-identity-seal.mjs';
const need = (ok, message) => { if (!ok) throw new Error(message); };
const sorted = values => values.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b), 'en'));

export function identityChapterChineseFingerprint(packet) {
  need(Array.isArray(packet?.units) && packet.units.every(u => typeof u.id === 'string' && typeof u.zh === 'string') &&
    new Set(packet.units.map(u => u.id)).size === packet.units.length, 'Complete current Chinese source units required');
  return peopleDigest(packet.units.map(u => [u.id, u.zh]));
}

// Both sides must be materialized through native extraction validation. That
// validator checks span geometry, hashes and scanner dispositions. Here compare
// actual identities, evidence and occurrences, without incidental generated IDs.
// Multiplicity is preserved; claims/mentions are never deduplicated into sets.
export function semanticIdentitySourceFingerprint(person, packet) {
  const { claims, mentions, ...attributes } = person;
  need(Array.isArray(claims) && Array.isArray(mentions), 'Complete normalized person claims and mentions required');
  const prefix = person.book + ':' + person.chapter + ':', ids = new Set();
  need(person.localId?.startsWith(prefix), 'Semantic source person scope mismatch');
  const facts = claims.map(claim => {
    need(claim.subject === person.localId && Array.isArray(claim.evidence), 'Semantic claim attribution mismatch');
    for (const id of claim.evidence) { need(id.startsWith(prefix), 'Claim evidence outside source chapter'); ids.add(id.slice(prefix.length)); }
    const { id, ...fact } = claim; return { ...fact, evidence: [...fact.evidence].sort() };
  });
  const occurrences = mentions.flatMap(mention => {
    need(mention.person === person.localId && typeof mention.unit?.id === 'string' && mention.spans &&
      Object.keys(mention).every(k => ['id','person','unit','kind','spans','candidateRefs','notes'].includes(k)) &&
      Object.keys(mention.spans).every(k => ['zh','en'].includes(k)), 'Unknown or misattributed semantic mention');
    ids.add(mention.unit.id);
    return Object.entries(mention.spans).flatMap(([language, spans]) => spans.map(span => {
      need(typeof span.exact === 'string' && Number.isInteger(span.occurrence) && span.occurrence >= 0 &&
        Object.keys(span).every(k => ['exact','occurrence','startCodePoint','endCodePoint','unitTextHash'].includes(k)), 'Exact native-validated occurrence required');
      return { person: mention.person, unitId: mention.unit.id, kind: mention.kind, language, exact: span.exact,
        occurrence: span.occurrence, notes: mention.notes ?? null };
    }));
  });
  const units = new Map(packet.units.map(u => [u.id, u])); need(units.size === packet.units.length, 'Duplicate semantic primary unit');
  const primary = [...ids].sort().map(id => {
    const unit = units.get(id); need(typeof unit?.zh === 'string', 'Missing semantic primary Chinese ' + prefix + id);
    return [id, unit.zh, unit.kind ?? null, unit.blockIndex ?? null, unit.collection ?? null, unit.itemIndex ?? null];
  });
  return peopleDigest({ version: 1, attributes, claims: sorted(facts), mentions: sorted(occurrences), primary });
}
