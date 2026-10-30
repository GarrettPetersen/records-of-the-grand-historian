import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { PEOPLE_DIR, DATA_DIR, extractionPath, readJson, contentUnits } from './people-content.mjs';
import { editorialDecisionPath } from './people-editorial-decisions.mjs';
import { peopleDigest } from './people-identity-seal.mjs';
import { localNameKeys } from './people-resolution.mjs';
import { validateDossierIdentityEvidence, memberContract } from './people-identity-dossiers.mjs';

export class ChapterIdentityReviewError extends Error {}
const validatedCertificates = new WeakSet();
export const IDENTITY_UNCERTAINTY_NOTE = 'It is not yet established whether this person is the same as similarly named people in other chapters.';
const need = (condition, message) => { if (!condition) throw new ChapterIdentityReviewError(message); };
const only = (object, keys) => object && Object.keys(object).sort().join('\0') === [...keys].sort().join('\0');
const byteDigest = bytes => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;

export function chapterIdentityReviewPath(book, chapter) {
  need(/^[a-z0-9_-]+$/u.test(book) && /^\d{3}$/u.test(chapter), 'Explicit identity review scope required');
  return path.join(PEOPLE_DIR, 'identity-reviews', book, `${chapter}.json`);
}

// Digest actual bytes. The absence of optional editorial history is explicit;
// required source/extraction files never fall back to empty values. Catalog
// assessment may explicitly record an absent date report; qualification and
// preparation require it, and the independent chronology gate always remains.
export function chapterIdentityInputs(book, chapter, { requireAuditReport = true } = {}) {
  chapterIdentityReviewPath(book, chapter);
  const editorial = editorialDecisionPath(book, chapter);
  const dateFile = path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`);
  need(!requireAuditReport || fs.existsSync(dateFile), `Missing required independent date report: ${book}:${chapter}`);
  return { source: byteDigest(fs.readFileSync(path.join(DATA_DIR, book, `${chapter}.json`))),
    extraction: byteDigest(fs.readFileSync(extractionPath(book, chapter))),
    editorial: byteDigest(fs.existsSync(editorial) ? fs.readFileSync(editorial) : Buffer.from('null')),
    dateAudit: byteDigest(fs.existsSync(dateFile) ? fs.readFileSync(dateFile) : Buffer.from('null')) };
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
  need(only(bundle.receipt, ['actualReviewerAgentId', 'authorAgentIds', 'planFingerprint', 'reportFingerprint', 'sourcePeople', 'chapterChinese']) &&
    bundle.receipt.planFingerprint === bundle.plan.fingerprint && bundle.receipt.reportFingerprint === peopleDigest(bundle.report), 'Identity review transport receipt does not match the preserved report');
  const chapterKey = `${scope.book}:${scope.chapter}`, own = sourceChapters.get(chapterKey);
  need(own && typeof own.extraction.run.agentId === 'string' && own.extraction.run.agentId, 'Current extractor provenance required');
  need(bundle.receipt.authorAgentIds.includes(own.extraction.run.agentId), 'Actual extraction author missing from identity review provenance');
  need(bundle.receipt.chapterChinese === chapterChineseEvidenceFingerprint(own.packet), 'Reviewed chapter Chinese source or unit inventory changed; fresh source coverage is required');
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
  need(Array.isArray(bundle.receipt.sourcePeople) && new Set(bundle.receipt.sourcePeople.map(row => row.localId)).size === bundle.receipt.sourcePeople.length,
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
  const index = { ...view, localPeople, memberVersions, chapters: new Map([[chapterKey, subjects]]) };
  try {
    need(only(inputs, ['source', 'extraction', 'editorial', 'dateAudit']) && Object.values(inputs).every(value => /^sha256:[a-f0-9]{64}$/u.test(value)), 'Current chapter evidence fingerprints required');
    const proof = validateDossierIdentityEvidence(index, bundle.plan, bundle.report, sourceUnits,
      bundle.receipt.actualReviewerAgentId, bundle.receipt.authorAgentIds, localNameKeys);
    // Never rewrite the original plan/report hashes. This is a new aggregate
    // over the unchanged independently reviewed identity and primary contexts.
    // Current editorial/date approval is checked separately by the shared gate.
    const certificate = { ...proof, kind: 'revalidated-chapter-identity-dossiers',
      reviewedInputs: bundle.plan.inputs, currentInputs: inputs,
      sourceDependencies: peopleDigest(bundle.receipt.sourcePeople), originalBundle: peopleDigest(bundle),
      unchangedSourceProofsReused: peopleDigest(inputs) !== peopleDigest(bundle.plan.inputs) };
    validatedCertificates.add(certificate);
    return certificate;
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

export function assertReviewedIdentityCoverage(corpus, view, certificates) {
  const coverage = new Map();
  need(Array.isArray(certificates), 'Current independently validated person certificates required');
  for (const certificate of certificates) {
    need(validatedCertificates.has(certificate), 'Identity coverage requires a current validated report, not a serialized certificate');
    for (const row of certificate.retained) for (const localId of row.localPeople) {
      need(!coverage.has(localId), `Duplicate independent identity coverage ${localId}`);
      need(view.localPersonMap.get(localId) === row.canonicalPersonId, `Changed accepted canonical assignment ${localId}`);
      coverage.set(localId, row);
    }
  }
  for (const localId of corpus.localPeople.keys()) need(coverage.has(localId), `Missing independent person coverage ${localId}`);
  return coverage;
}

export function applyReviewedIdentityUncertainty(projectedCatalog, certificates) {
  const uncertain = new Set(certificates.flatMap(certificate => certificate.retained.filter(row => row.unresolvedIdentity).map(row => row.canonicalPersonId)));
  for (const person of projectedCatalog.people) if (uncertain.has(person.id) && !person.curation.notes.includes(IDENTITY_UNCERTAINTY_NOTE)) {
    person.curation.notes.push(IDENTITY_UNCERTAINTY_NOTE);
  }
}

// Full compilation has already run the native corpus validator. Reuse those
// normalized people and load only the primary units needed by preserved reports.
export function assessCorpusIdentityReviews(corpus, clusters) {
  const catalog = { localPersonMap: {}, people: clusters.map(cluster => ({ id: cluster.canonicalPersonId, retiredIds: cluster.retiredIds })) };
  for (const cluster of clusters) for (const id of cluster.localPeople) catalog.localPersonMap[id] = cluster.canonicalPersonId;
  const view = acceptedCatalogIdentityView(catalog), chapters = new Map(), pendingLocalPeople = new Set(), certificates = [], work = {};
  for (const { extraction } of corpus.chapters) chapters.set(`${extraction.book}:${extraction.chapter}`, { extraction, localPeople: new Map() });
  for (const [id, person] of corpus.localPeople) {
    const chapter = chapters.get(`${person.book}:${person.chapter}`);
    need(chapter, `Missing validated chapter for ${id}`); chapter.localPeople.set(id, person);
  }
  const materialize = (book, chapter) => {
    const key = `${book}:${chapter}`, result = chapters.get(key);
    need(result, `Missing validated identity source chapter ${key}`);
    if (!result.packet) result.packet = { units: contentUnits(readJson(path.join(DATA_DIR, book, `${chapter}.json`))) };
    return result;
  };
  for (const [key, own] of chapters) {
    const { book, chapter } = own.extraction, cases = new Set([...own.localPeople.keys()].map(id => view.localPersonMap.get(id))).size;
    let certificate = null, reason = null;
    if (cases) {
      try {
        const bundle = readChapterIdentityBundle(book, chapter), evidence = new Map();
        for (const scope of chapterIdentityEvidenceScopes(bundle)) evidence.set(`${scope.book}:${scope.chapter}`, materialize(scope.book, scope.chapter));
        certificate = validateChapterIdentityBundle(view, evidence, { book, chapter }, bundle, chapterIdentityInputs(book, chapter, { requireAuditReport: false }));
        assertReviewedIdentityCoverage(own, view, [certificate]); certificates.push(certificate);
      } catch (error) {
        if (!(error instanceof ChapterIdentityReviewError)) throw error;
        reason = error.message;
        for (const id of own.localPeople.keys()) pendingLocalPeople.add(id);
      }
    }
    work[key] = { targetCases: cases, approvedCases: certificate ? certificate.retained.length : 0,
      heldCases: reason ? cases : 0, reviewedAmbiguousCases: certificate ? certificate.ambiguity.length : 0,
      status: reason ? 'review-required' : cases ? 'reviewed' : 'no-people', reason };
  }
  return { work, pendingLocalPeople, certificates,
    pendingChapters: Object.values(work).filter(row => row.status === 'review-required').length,
    reviewedAmbiguousPeople: new Set(certificates.flatMap(certificate => certificate.retained.filter(row => row.unresolvedIdentity).map(row => row.canonicalPersonId))).size };
}

// These are derived from the EXACT original packet the independent reviewer read.
// Later validation checks whole relevant Chinese units as well as claims/hints;
// retaining an old name quote alone cannot hide changed historical context.
export function identitySourceEvidenceFingerprint(person, packet) {
  const prefix = person.localId.split(':').slice(0, 2).join(':'), ids = new Set();
  for (const claim of person.claims) for (const id of claim.evidence) {
    need(id.startsWith(prefix + ':'), 'Identity claim evidence outside its source chapter'); ids.add(id.slice(prefix.length + 1));
  }
  const units = new Map(packet.units.map(unit => [unit.id, unit.zh]));
  const primary = [...ids].sort().map(id => { need(units.has(id), `Missing reviewed identity source unit ${prefix}:${id}`); return [id, units.get(id)]; });
  return peopleDigest({ localId: person.localId, promptVersion: person.promptVersion,
    preferredNameSuggestion: person.preferredNameSuggestion, identityHints: person.identityHints ?? null,
    claims: person.claims, mentions: person.mentions ?? [], primary });
}

// Full target-chapter Chinese is part of the independent coverage proof, including
// previously unmentioned units. A metadata/English edit may reuse unchanged person
// proofs; inserting an unseen actor in an unmentioned Chinese unit may not.
export function chapterChineseEvidenceFingerprint(packet) {
  need(Array.isArray(packet?.units) && packet.units.every(unit => typeof unit.id === 'string' && typeof unit.zh === 'string') &&
    new Set(packet.units.map(unit => unit.id)).size === packet.units.length, 'Complete current Chinese source units required');
  return peopleDigest(packet.units.map(unit => [unit.id, unit.zh]));
}
