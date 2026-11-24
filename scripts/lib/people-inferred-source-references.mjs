import {assertDossierPrimaryWitness} from './people-identity-dossiers.mjs';
import {localNameKeys} from './people-resolution.mjs';

// Called only after the product's independent identity/source/date/editorial
// gates. These citations never create textual mentions or change membership.
export function reviewedInferredSourceReferences(members, corpus, canonicalId, certificates) {
  const references = new Map();
  for (const person of members) {
    const names = person.claims.filter(claim => claim.predicate === 'name');
    if (person.mentions.length || !person.mentionException?.trim() || !names.length) continue;
    const inferredKinship = names.every(claim => claim.certainty === 'strongly-inferred' && claim.value.kind === 'descriptive-kinship');
    const certificate = certificates.find(item => item.scope.book === person.book && item.scope.chapter === person.chapter);
    if (!certificate) continue;
    const proof = certificate.retained.find(item => item.canonicalPersonId === canonicalId && item.localPeople.includes(person.localId));
    if (!proof) continue;
    const chapter = corpus.chapters.find(item => item.extraction.book === person.book && item.extraction.chapter === person.chapter);
    if (!chapter?.packet?.units) throw new Error(`Missing current inferred-reference source packet: ${person.localId}`);
    const prefix = `${person.book}:${person.chapter}:`;
    const units = new Map(chapter.packet.units.map(unit => [prefix + unit.id, unit]));
    const sourceText = new Map([...units].map(([id, unit]) => [id, unit.zh]));
    const witnesses = proof.sourceWitnesses.filter(witness => witness.localId === person.localId &&
      witness.book === person.book && witness.chapter === person.chapter);
    for (const witness of witnesses) {
      const sourceId = prefix + witness.unitId;
      // Collective aliases (二袁) and explicit kinship labels (兄) may identify
      // an independently reviewed person without an individual inline mention.
      // Require that exact explicit Chinese label in this very witness/unit;
      // a personal-name claim or an arbitrary exception grants no citation.
      const citedNames = names.filter(claim => claim.certainty === 'explicit' &&
        ['alternate', 'descriptive-kinship'].includes(claim.value.kind) &&
        claim.value.zh?.trim() && witness.quote.includes(claim.value.zh) && claim.evidence.includes(sourceId));
      if (!inferredKinship && !citedNames.length) continue;
      // Reuse the same narrow source-bound kinship graph checks as canonical
      // certification. Arbitrary claimed evidence or mentionException is insufficient.
      assertDossierPrimaryWitness(witness, person, sourceText, localNameKeys, new Map(), corpus.localPeople);
      const unit = units.get(sourceId);
      const claimRefs = person.claims.filter(claim => ['name', 'family-relationship'].includes(claim.predicate) &&
        claim.evidence.includes(sourceId)).map(claim => claim.id).sort();
      const key = sourceId;
      if (references.has(key)) {
        const previous = references.get(key);
        previous.claimRefs = [...new Set([...previous.claimRefs, ...claimRefs])].sort();
        continue;
      }
      references.set(key, {book:person.book,chapter:person.chapter,unitId:unit.id,
        blockIndex:unit.blockIndex,collection:unit.collection,itemIndex:unit.itemIndex,unitKind:unit.kind,
        kinds:[inferredKinship || citedNames.every(claim => claim.value.kind === 'descriptive-kinship') ? 'inferred-kinship' : 'reviewed-allusion'],languages:['zh','en'].filter(language => unit[language]?.trim()),
        mentionRefs:[],claimRefs,sourceQuote:witness.quote,reviewedCaseId:proof.caseId,
        inference:inferredKinship ? 'This unnamed relative is inferred from the kinship described in this passage.' :
          'This person is identified through an independently reviewed collective or kinship reference in this passage.'});
    }
  }
  return [...references.values()].sort((a,b) => a.book.localeCompare(b.book) ||
    a.chapter.localeCompare(b.chapter) || a.blockIndex-b.blockIndex || a.unitId.localeCompare(b.unitId));
}
