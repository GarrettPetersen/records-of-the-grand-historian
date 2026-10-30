// Authored offline fixtures only. These helpers exercise the actual proof
// validator; they confer no authority on historical production data.
import fs from 'node:fs';
import { buildIdentityDossierIndex, planChapterIdentityReview, IDENTITY_REVIEW_LIMITS, assertDossierPrimaryWitness } from './people-identity-dossiers.mjs';
import { localNameKeys, resolveAcceptedPeopleClusters } from './people-resolution.mjs';
import { peopleDigest } from './people-identity-seal.mjs';
import { chapterIdentityInputs, chapterIdentityReviewPath, acceptedCatalogIdentityView,
  validateChapterIdentityBundle, identitySourceEvidenceFingerprint, chapterChineseEvidenceFingerprint } from './people-chapter-identity.mjs';
import { loadValidatedPeopleCorpus, loadValidatedResolutionDocuments } from './people-corpus.mjs';
import { loadValidatedPeopleChapter } from './people-validated-chapter.mjs';
import { writeJsonAtomic } from './people-content.mjs';

export function fixtureIdentityBundle(index, view, sources, scope, inputs) {
  const plan = planChapterIdentityReview(index, scope, inputs, IDENTITY_REVIEW_LIMITS);
  const primary = new Map();
  for (const [key, source] of sources) for (const unit of source.packet.units) primary.set(`${key}:${unit.id}`, unit.zh);
  const required = new Set();
  const reviews = plan.cases.map(item => {
    const ids = [...new Set([...item.localPeople, item.canonicalMembership.anchorLocalId])];
    const sourceWitnesses = ids.map(localId => {
      required.add(localId);
      const person = index.localPeople.get(localId), [book, chapter] = localId.split(':');
      const evidence = new Set(person.claims.filter(claim => claim.predicate === 'name').flatMap(claim => claim.evidence));
      for (const id of evidence) {
        const unitId = id.split(':')[2], quote = primary.get(id);
        if (!quote) continue;
        const witness = { localId, book, chapter, unitId, quote };
        try { assertDossierPrimaryWitness(witness, person, primary, localNameKeys); return witness; }
        catch (error) { if (!error.message.startsWith('Witness does not support')) throw error; }
      }
      throw new Error(`Authored fixture lacks primary name evidence for ${localId}`);
    });
    return { caseId: item.id, verdict: 'approve', canonicalPersonId: item.canonicalPersonId,
      membershipReviewed: true, membershipFingerprint: item.canonicalMembership.fingerprint,
      ambiguityReviewed: true, unresolvedIdentity: true,
      reason: 'Authored synthetic fixture independently retains this source actor and accepted anchor; cross-chapter equivalence remains uncertain.', sourceWitnesses };
  });
  const report = { schemaVersion: 1, planFingerprint: plan.fingerprint,
    reviewer: { agentId: 'offline-independent-person-reviewer', name: 'Independent authored-fixture reviewer' }, reviews };
  const own = sources.get(`${scope.book}:${scope.chapter}`);
  const bundle = { schemaVersion: 1, kind: 'chapter-identity-review', scope, plan, report,
    receipt: { actualReviewerAgentId: report.reviewer.agentId, authorAgentIds: [own.extraction.run.agentId, 'offline-fixture-author'],
      planFingerprint: plan.fingerprint, reportFingerprint: peopleDigest(report), chapterChinese: chapterChineseEvidenceFingerprint(own.packet),
      sourcePeople: [...required].map(localId => {
        const source = sources.get(localId.split(':').slice(0, 2).join(':'));
        return { localId, fingerprint: identitySourceEvidenceFingerprint(index.localPeople.get(localId), source.packet) };
      }) } };
  const certificate = validateChapterIdentityBundle(view, sources, scope, bundle, inputs);
  return { bundle, certificate };
}

export function writeFixtureIdentityReviews(scopes) {
  if (!process.env.PEOPLE_REPO_ROOT) throw new Error('Explicit isolated authored-fixture root required');
  const corpus = loadValidatedPeopleCorpus(), documents = loadValidatedResolutionDocuments(corpus.localPeople);
  const { clusters } = resolveAcceptedPeopleClusters(corpus.localPeople, documents);
  const index = buildIdentityDossierIndex(corpus.localPeople, clusters, localNameKeys);
  const catalog = { localPersonMap: Object.fromEntries(index.localPersonMap),
    people: clusters.map(cluster => ({ id: cluster.canonicalPersonId, localPeople: cluster.localPeople, retiredIds: cluster.retiredIds })) };
  const view = acceptedCatalogIdentityView(catalog), sources = new Map();
  for (const scope of scopes) {
    const key = `${scope.book}:${scope.chapter}`;
    if (!sources.has(key)) sources.set(key, loadValidatedPeopleChapter(scope.book, scope.chapter));
    const subjects = index.chapters.get(key);
    for (const id of subjects.keys()) {
      const dossier = index.dossiers.get(id);
      const anchor = dossier.anchorCandidates.find(localId => !localId.startsWith(key + ':')) ?? dossier.anchorCandidates[0];
      const [book, chapter] = anchor.split(':');
      if (!sources.has(`${book}:${chapter}`)) sources.set(`${book}:${chapter}`, loadValidatedPeopleChapter(book, chapter));
    }
    const { bundle } = fixtureIdentityBundle(index, view, sources, scope, chapterIdentityInputs(scope.book, scope.chapter));
    writeJsonAtomic(chapterIdentityReviewPath(scope.book, scope.chapter), bundle);
  }
}

// In-memory authored sources for the existing pure projection/ebook fixtures.
// Full production extraction/gate coverage is exercised by the isolated CLI tests.
export function fixtureIdentityCoverage(corpus, catalog, allPeople = corpus.localPeople) {
  const clusters = catalog.people.map(person => ({ canonicalPersonId: person.id, localPeople: person.localPeople, retiredIds: person.retiredIds }));
  const index = buildIdentityDossierIndex(allPeople, clusters, localNameKeys), view = acceptedCatalogIdentityView(catalog), sources = new Map();
  for (const person of allPeople.values()) {
    const key = `${person.book}:${person.chapter}`;
    if (!sources.has(key)) sources.set(key, { extraction: { book: person.book, chapter: person.chapter, run: { agentId: 'offline-fixture-extractor' } }, localPeople: new Map(), packet: { units: [] } });
    sources.get(key).localPeople.set(person.localId, person);
  }
  for (const [key, source] of sources) {
    const units = new Map();
    for (const person of source.localPeople.values()) for (const claim of person.claims) if (claim.predicate === 'name' && claim.value.zh) for (const evidence of claim.evidence) {
      if (!evidence.startsWith(key + ':')) throw new Error('Authored fixture name evidence crosses source scope');
      const id = evidence.slice(key.length + 1); units.set(id, (units.get(id) ?? '') + claim.value.zh + '至。');
    }
    source.packet.units = [...units].map(([id, zh]) => ({ id, zh }));
  }
  const inputs = Object.fromEntries(['source', 'extraction', 'editorial', 'dateAudit'].map((key, index) => [key, `sha256:${String(index + 1).repeat(64)}`]));
  const certificates = [];
  for (const { extraction } of corpus.chapters) {
    const scope = { book: extraction.book, chapter: extraction.chapter };
    certificates.push(fixtureIdentityBundle(index, view, sources, scope, inputs).certificate);
  }
  return { view, certificates };
}
