import { buildPeopleExtractionPacket } from '../build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction, validatePeopleExtraction } from '../validate-people-extraction.mjs';
import { isCompactPeopleExtraction } from './people-compact.mjs';
import { extractionPath, readJson } from './people-content.mjs';

export function peopleForExtraction(extraction) {
  const claims = new Map(), mentions = new Map();
  for (const claim of extraction.claims) { if (!claims.has(claim.subject)) claims.set(claim.subject, []); claims.get(claim.subject).push(claim); }
  for (const mention of extraction.mentions) { if (!mentions.has(mention.person)) mentions.set(mention.person, []); mentions.get(mention.person).push(mention); }
  const people = new Map();
  for (const person of extraction.people) {
    if (people.has(person.localId)) throw new Error(`Duplicate source person ${person.localId}`);
    people.set(person.localId, { ...person, book: extraction.book, chapter: extraction.chapter,
      promptVersion: extraction.run.promptVersion, claims: claims.get(person.localId) ?? [], mentions: mentions.get(person.localId) ?? [] });
  }
  return people;
}

export function loadValidatedPeopleChapter(book, chapter, { properNounMatcher, strictAliasDispositions = true } = {}) {
  const raw = readJson(extractionPath(book, chapter));
  if (raw.book !== book || raw.chapter !== chapter) throw new Error(`Extraction scope mismatch: ${book}:${chapter}`);
  const packet = buildPeopleExtractionPacket(book, chapter, { properNounMatcher });
  const options = { strictAliasDispositions };
  const { normalized: extraction } = isCompactPeopleExtraction(raw)
    ? validateCompactPeopleExtraction(raw, packet, options) : validatePeopleExtraction(raw, packet, options);
  return { raw, packet, extraction, localPeople: peopleForExtraction(extraction) };
}
