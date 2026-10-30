from pathlib import Path
J=Path(__file__).resolve().parent
D=J/'candidate/scripts/lib'
p=D/'people-identity-dossiers.mjs'
s=p.read_text().replace('function memberContract(person, keys) {','export function memberContract(person, keys) {')
p.write_text(s)
(D/'people-chapter-identity.mjs').write_text(r'''import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { PEOPLE_DIR, DATA_DIR, extractionPath, readJson } from './people-content.mjs';
import { editorialDecisionPath } from './people-editorial-decisions.mjs';
import { peopleDigest } from './people-identity-seal.mjs';
import { localNameKeys } from './people-resolution.mjs';
import { validateRetainedDossierReview, memberContract } from './people-identity-dossiers.mjs';

export class ChapterIdentityReviewError extends Error {}
const need = (condition, message) => { if (!condition) throw new ChapterIdentityReviewError(message); };
const only = (object, keys) => object && Object.keys(object).sort().join('\0') === [...keys].sort().join('\0');
const byteDigest = bytes => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;

export function chapterIdentityReviewPath(book, chapter) {
  need(/^[a-z0-9_-]+$/u.test(book) && /^\d{3}$/u.test(chapter), 'Explicit identity review scope required');
  return path.join(PEOPLE_DIR, 'identity-reviews', book, `${chapter}.json`);
}

// Digest actual bytes. The absence of optional editorial history is explicit;
// required source/extraction/date files never fall back to empty values.
export function chapterIdentityInputs(book, chapter) {
  chapterIdentityReviewPath(book, chapter);
  const editorial = editorialDecisionPath(book, chapter);
  return { source: byteDigest(fs.readFileSync(path.join(DATA_DIR, book, `${chapter}.json`))),
    extraction: byteDigest(fs.readFileSync(extractionPath(book, chapter))),
    editorial: byteDigest(fs.existsSync(editorial) ? fs.readFileSync(editorial) : Buffer.from('null')),
    dateAudit: byteDigest(fs.readFileSync(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`))) };
}

// One view per sealed accepted catalog, reused across chapter qualification.
// No name scan, candidate graph, or pair expansion is needed to check a proof.
export function acceptedCatalogIdentityView(catalog) {
  const localPersonMap = new Map(Object.entries(catalog.localPersonMap)), canonicalByKnownId = new Map();
  for (const person of catalog.people) for (const known of [person.id, ...person.retiredIds]) {
    need(!canonicalByKnownId.has(known), `Conflicting accepted identity lineage ${known}`);
    canonicalByKnownId.set(known, person.id);
  }
  return { localPersonMap, canonicalByKnownId };
}

// sourceChapters contains ONLY current native-validated chapter/anchor material.
// External chapters supply identity evidence; this grants none of their facts.
export function validateChapterIdentityBundle(view, sourceChapters, scope, bundle, inputs) {
  need(only(bundle, ['schemaVersion', 'kind', 'scope', 'plan', 'report', 'receipt']) &&
    bundle.schemaVersion === 1 && bundle.kind === 'chapter-identity-review' &&
    peopleDigest(bundle.scope) === peopleDigest(scope) && peopleDigest(bundle.plan.scope) === peopleDigest(scope), 'Malformed or wrong-scope chapter identity proof');
  need(only(bundle.receipt, ['actualReviewerAgentId', 'authorAgentIds', 'planFingerprint', 'reportFingerprint']) &&
    bundle.receipt.planFingerprint === bundle.plan.fingerprint && bundle.receipt.reportFingerprint === peopleDigest(bundle.report), 'Identity review transport receipt does not match the preserved report');
  const chapterKey = `${scope.book}:${scope.chapter}`, own = sourceChapters.get(chapterKey);
  need(own && typeof own.extraction.run.agentId === 'string' && own.extraction.run.agentId, 'Current extractor provenance required');
  need(bundle.receipt.authorAgentIds.includes(own.extraction.run.agentId), 'Actual extraction author missing from identity review provenance');
  const localPeople = new Map(), memberVersions = new Map(), sourceUnits = new Map(), subjects = new Map();
  for (const [key, source] of sourceChapters) {
    need(key === `${source.extraction.book}:${source.extraction.chapter}`, 'Current source chapter scope mismatch');
    for (const person of source.localPeople.values()) {
      need(!localPeople.has(person.localId), `Duplicate current identity source ${person.localId}`);
      localPeople.set(person.localId, person);
      memberVersions.set(person.localId, peopleDigest(memberContract(person, localNameKeys(person))));
      if (key === chapterKey) {
        const id = view.localPersonMap.get(person.localId);
        need(id, `Missing accepted canonical identity for ${person.localId}`);
        if (!subjects.has(id)) subjects.set(id, []);
        subjects.get(id).push(person.localId);
      }
    }
    for (const unit of source.packet.units) {
      const id = `${key}:${unit.id}`;
      need(!sourceUnits.has(id), `Duplicate primary identity unit ${id}`); sourceUnits.set(id, unit.zh);
    }
  }
  const index = { ...view, localPeople, memberVersions, chapters: new Map([[chapterKey, subjects]]) };
  try {
    return validateRetainedDossierReview(index, bundle.plan, bundle.report, sourceUnits,
      bundle.receipt.actualReviewerAgentId, bundle.receipt.authorAgentIds, inputs, localNameKeys);
  } catch (error) { throw new ChapterIdentityReviewError(error.message, { cause: error }); }
}

export function readChapterIdentityBundle(book, chapter) {
  const file = chapterIdentityReviewPath(book, chapter);
  need(fs.existsSync(file), `Missing independent person-dossier review: ${book}:${chapter}`);
  return readJson(file);
}

export function chapterIdentityEvidenceScopes(bundle) {
  const scopes = new Map();
  for (const item of bundle.plan.cases) for (const id of [...item.localPeople, item.canonicalMembership.anchorLocalId]) {
    const [book, chapter] = id.split(':'); chapterIdentityReviewPath(book, chapter);
    scopes.set(`${book}:${chapter}`, { book, chapter });
  }
  // Witnesses to optional retrieved candidates must also be verified against
  // actual source, rather than trusting the model's quoted attachment.
  for (const row of bundle.report.reviews) for (const witness of row.sourceWitnesses) {
    chapterIdentityReviewPath(witness.book, witness.chapter);
    scopes.set(`${witness.book}:${witness.chapter}`, { book: witness.book, chapter: witness.chapter });
  }
  return [...scopes.values()];
}
''')
(D/'people-validated-chapter.mjs').write_text(r'''import { buildPeopleExtractionPacket } from '../build-people-extraction-packet.mjs';
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
''')
