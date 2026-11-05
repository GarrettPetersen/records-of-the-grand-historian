#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspectLocalDisk } from './check-local-disk.mjs';
import { REPO_ROOT, PEOPLE_DIR, readJson } from './lib/people-content.mjs';
import { editorialDecisionPath } from './lib/people-editorial-decisions.mjs';
import { dateAuditStatus } from './lib/people-date-audit.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';
import { loadValidatedPeopleChapter } from './lib/people-validated-chapter.mjs';
import { assertChapterGates } from './lib/people-qualified-scope.mjs';
import { localNameKeys } from './lib/people-resolution.mjs';
import { peopleDigest, identityDossierInputs } from './lib/people-identity-seal.mjs';
import { compactChapterIdentityReviewPacket, splitChapterIdentityReviewTransport, MAX_IDENTITY_REVIEW_TRANSPORT_BYTES } from './lib/people-identity-review-transport.mjs';
import { extractionAuthorAgentIds } from './lib/people-extraction-authorship.mjs';
import { identityArtifactHash } from './lib/people-identity-artifacts.mjs';
import { memberContract, planChapterIdentityReview, IDENTITY_REVIEW_LIMITS } from './lib/people-identity-dossiers.mjs';
import { readIdentityDossierStore } from './lib/people-identity-dossier-store.mjs';
import { ChapterIdentityReviewError, chapterIdentityInputs, chapterIdentityReviewPath, validateChapterIdentityBundle } from './lib/people-chapter-identity.mjs';
import { loadCurrentIdentityEvidence } from './lib/people-identity-evidence.mjs';
import { pinnedIdentityChapterContext, provePinnedDossierReuse, assertPinnedIdentityRuntime } from './lib/people-pinned-identity-source.mjs';
const HOST_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const need = (ok, message) => { if (!ok) throw new Error(message); };
const MAX_REVIEW_TRANSPORT_BYTES = MAX_IDENTITY_REVIEW_TRANSPORT_BYTES;
export function collectChapterIdentityPrimaryUnits(own, sources, relevant) {
  const units = new Map(), ownPrefix = `${own.extraction.book}:${own.extraction.chapter}`;
  for (const unit of own.packet.units) units.set(`${ownPrefix}:${unit.id}`, { book: own.extraction.book, chapter: own.extraction.chapter, ...unit });
  for (const person of relevant.values()) {
    const prefix = person.localId.split(':').slice(0, 2).join(':');
    const evidence = new Set([...person.claims.flatMap(c => c.evidence), ...person.mentions.map(m => m.unit.id.includes(':') ? m.unit.id : `${prefix}:${m.unit.id}`)]);
    for (const id of evidence) {
      const [book, chapter, unitId] = id.split(':'), source = sources.get(`${book}:${chapter}`);
      need(source, `Missing primary chapter for ${id}`);
      if (!source.unitMap) source.unitMap = new Map(source.packet.units.map(unit => [unit.id, unit]));
      const unit = source.unitMap.get(unitId); need(unit, `Missing current primary unit ${id}`);
      units.set(id, { book, chapter, ...unit });
    }
  }
  return units;
}

export async function buildChapterIdentityReviewPacket({ book, chapter, registry, sourceRevision }) {
  need(!inspectLocalDisk(HOST_ROOT).errors.length, 'Host resource guard rejected dossier preparation');
  const pinned = sourceRevision ? pinnedIdentityChapterContext(REPO_ROOT, sourceRevision) : null;
  const readInputs = pinned ? pinned.inputs : chapterIdentityInputs, loadChapter = pinned ? pinned.load : loadValidatedPeopleChapter;
  const inputs = readInputs(book, chapter), scope = { book, chapter }, matcher = loadProperNounMatcher();
  const own = loadChapter(book, chapter, { properNounMatcher: matcher });
  const editorialFile = editorialDecisionPath(book, chapter);
  assertChapterGates(own.extraction, (pinned ? pinned.config : readJson(path.join(PEOPLE_DIR, 'config.json'))).promptVersion,
    pinned ? pinned.dates(book, chapter) : dateAuditStatus(book, chapter), pinned ? pinned.editorial(book, chapter) : fs.existsSync(editorialFile) ? readJson(editorialFile) : null);
  const index = await readIdentityDossierStore(registry, new Map());
  try {
    const registryReuse = pinned ? provePinnedDossierReuse(index.provenance, pinned.snapshot) : null;
    const identityInputs = pinned ? null : identityDossierInputs(REPO_ROOT);
    if (!pinned) need(index.provenance.identityInputs === identityInputs, 'Registry is not current; build a new immutable generation before preparing fresh work');
    const plan = planChapterIdentityReview(index, scope, inputs, IDENTITY_REVIEW_LIMITS), sources = new Map([[`${book}:${chapter}`, own]]), relevant = new Map();
    for (const item of plan.cases) for (const id of [...item.localPeople, item.canonicalMembership.anchorLocalId]) {
      const [sourceBook, sourceChapter] = id.split(':'), key = `${sourceBook}:${sourceChapter}`;
      if (!sources.has(key)) sources.set(key, loadChapter(sourceBook, sourceChapter,
        { properNounMatcher: matcher, strictAliasDispositions: false }));
      const person = sources.get(key).localPeople.get(id);
      need(person && peopleDigest(memberContract(person, localNameKeys(person))) === index.memberVersions.get(id), `Stale dossier member ${id}; update the registry from accepted source deltas`);
      relevant.set(id, person);
    }
    if (pinned) assertPinnedIdentityRuntime(pinned.snapshot);
    need(peopleDigest(readInputs(book, chapter)) === peopleDigest(inputs) && (pinned || identityDossierInputs(REPO_ROOT) === identityInputs), 'Source or identity inputs changed while preparing identity review');
    const units = collectChapterIdentityPrimaryUnits(own, sources, relevant);
    const candidateIds = [...new Set(plan.cases.flatMap(item => item.candidateDossiers.map(row => row.id)))];
    const packet = { schemaVersion: 1, kind: 'source-chapter-dossier-review-packet', scope, plan,
      authorAgentIds: extractionAuthorAgentIds(own.extraction), registryProvenance: index.provenance,
      ...(registryReuse ? { registryReuse } : {}),
      acceptedMembershipAuthority: 'Existing native validated and source-reviewed canonical membership is the baseline. Review this chapter and current anchor; hold concrete contradictions. This report cannot merge, split or separate records.',
      people: [...relevant.values()], units: [...units.values()],
      candidateDossiers: candidateIds.map(id => { const dossier = index.dossiers.get(id); return { id, version: dossier.version, names: dossier.names, matching: dossier.matching, localPeople: dossier.localPeople }; }),
      requiredReport: { schemaVersion: 1, planFingerprint: plan.fingerprint, reviewer: { agentId: 'ACTUAL_REVIEWER_AGENT_ID', name: 'REVIEWER_NAME' },
        reviews: [{ caseId: 'EXACT_CASE_ID', verdict: 'approve OR hold', canonicalPersonId: 'EXACT_RETAINED_ID', membershipReviewed: true,
          membershipFingerprint: 'EXACT_CASE_MEMBERSHIP_FINGERPRINT', ambiguityReviewed: true, unresolvedIdentity: true,
          reason: 'Specific source-based reason. Hold a concrete wrong actor or false existing merge. Preserve uncertainty about cross-chapter equivalence.',
          sourceWitnesses: [{ localId: 'TARGET_OR_ANCHOR_ID', book: 'BOOK', chapter: 'NNN', unitId: 'UNIT_ID', quote: 'EXACT_CHINESE_NAME_IN_CURRENT_SOURCE' }] }] },
      instructions: 'Review every case and every target local person. Quote the primary Chinese for each target and the retained canonical anchor. Confirm actual individual, supported chapter attribution, and accepted membership; hold contradictions. Keep unresolvedIdentity true when proposed, including small candidate buckets and overflow. Omitted names are unreviewed uncertainty, never separation evidence. No positive merges, no all-pairs comparisons, no recursive external chapter completion. Return the closed required report only. Supply definite English repairs separately with complete exact before/after, source reason, both fields and repetitions; do not silently ignore them.' };
    const bytes = Buffer.from(JSON.stringify(packet, null, 2) + '\n');
    const receipt = { scope, inputs, planFingerprint: plan.fingerprint, packetFingerprint: peopleDigest(packet), packetBytes: bytes.length,
      metrics: plan.metrics, evidenceChapters: sources.size, primaryUnits: units.size, sourcePeople: relevant.size,
      generatedPairs: 0, independentReviewCompleted: false, dataQualified: false, published: false,
      ...(registryReuse ? { sourceRevision, registryReuse } : {}) };
    need(!inspectLocalDisk(HOST_ROOT).errors.length, 'Host guard failed after dossier preparation; preserve artifacts, dispatch no new work');
    const transport = compactChapterIdentityReviewPacket(packet);
    const transportBytes = Buffer.from(JSON.stringify(transport) + '\n');
    const reviewParts = transportBytes.length > MAX_REVIEW_TRANSPORT_BYTES ? splitChapterIdentityReviewTransport(transport, MAX_REVIEW_TRANSPORT_BYTES) : [];
    if (reviewParts.length) receipt.reviewParts = reviewParts.map((part, index) => { const bytes = Buffer.from(JSON.stringify(part) + '\n'); return { file: `transport-part-${String(index + 1).padStart(3, '0')}.json`, bytes: bytes.length, sha256: identityArtifactHash(bytes), caseIds: part.reviewCases.map(c => c.caseId) }; });
    receipt.sourcePacketSha256 = identityArtifactHash(bytes); receipt.transportSha256 = identityArtifactHash(transportBytes); receipt.transportBytes = transportBytes.length;
    return { plan, packet, transport, receipt, reviewParts };
  } finally { index.close(); }
}

// Write the exact byte encodings sealed by preparation. The source packet is
// readable JSON; the model transport is compact JSON and its bound/hash apply to
// that actual file, not to an encoding that was never written.
export function writePreparedIdentityReviewArtifacts(out, { plan, packet, transport, receipt, reviewParts = [] }) {
  const sourceBytes = Buffer.from(JSON.stringify(packet, null, 2) + '\n');
  const transportBytes = Buffer.from(JSON.stringify(transport) + '\n');
  need(sourceBytes.length === receipt.packetBytes && identityArtifactHash(sourceBytes) === receipt.sourcePacketSha256,
    'Sealed source packet bytes do not match preparation receipt');
  need(transportBytes.length === receipt.transportBytes && identityArtifactHash(transportBytes) === receipt.transportSha256,
    'Sealed transport bytes do not match preparation receipt');
  need(transportBytes.length <= MAX_REVIEW_TRANSPORT_BYTES || reviewParts.length > 0, 'Source-complete review transport exceeds the inspected bound');
  if (reviewParts.length) {
    const expected = splitChapterIdentityReviewTransport(transport, MAX_REVIEW_TRANSPORT_BYTES);
    need(peopleDigest(expected) === peopleDigest(reviewParts) && receipt.reviewParts?.length === reviewParts.length, 'Review partition evidence differs from the sealed source transport');
    for (const [i, part] of reviewParts.entries()) { const bytes = Buffer.from(JSON.stringify(part) + '\n'), sealed = receipt.reviewParts[i]; need(sealed.file === `transport-part-${String(i + 1).padStart(3, '0')}.json` && sealed.bytes === bytes.length && sealed.sha256 === identityArtifactHash(bytes) && peopleDigest(sealed.caseIds) === peopleDigest(part.reviewCases.map(c => c.caseId)), 'Review part bytes differ from preparation receipt'); }
  }
  fs.mkdirSync(out, { recursive: false });
  for (const [file, bytes] of [
    ['plan.json', Buffer.from(JSON.stringify(plan, null, 2) + '\n')],
    ['source-review-packet.json', sourceBytes], ['transport-packet.json', transportBytes],
    ['preparation-receipt.json', Buffer.from(JSON.stringify(receipt, null, 2) + '\n')],
  ]) fs.writeFileSync(path.join(out, file), bytes, { flag: 'wx' });
  for (const [i, part] of reviewParts.entries()) fs.writeFileSync(path.join(out, receipt.reviewParts[i].file), JSON.stringify(part) + '\n', { flag: 'wx' });
}

export async function prepareChapterIdentityReview({ out, ...options }) {
  const { book, chapter, registry } = options, savedPath = chapterIdentityReviewPath(book, chapter);
  if (options.sourceRevision) {
    const source = pinnedIdentityChapterContext(REPO_ROOT, options.sourceRevision);
    need(!source.snapshot.files.has(`data/people/identity-reviews/${book}/${chapter}.json`) && !fs.existsSync(savedPath), 'Retained identity proof exists; reconcile it before preparing new pinned work');
  }
  if (fs.existsSync(savedPath)) {
    need(!inspectLocalDisk(HOST_ROOT).errors.length, 'Host resource guard rejected proof revalidation');
    const savedBytes = fs.readFileSync(savedPath), saved = JSON.parse(savedBytes), inputs = chapterIdentityInputs(book, chapter);
    const matcher = loadProperNounMatcher(), own = loadValidatedPeopleChapter(book, chapter, { properNounMatcher: matcher });
    const editorial = editorialDecisionPath(book, chapter);
    assertChapterGates(own.extraction, readJson(path.join(PEOPLE_DIR, 'config.json')).promptVersion,
      dateAuditStatus(book, chapter), fs.existsSync(editorial) ? readJson(editorial) : null);
    const index = await readIdentityDossierStore(registry, new Map());
    try {
      const identityInputs = identityDossierInputs(REPO_ROOT);
      need(index.provenance.identityInputs === identityInputs, 'Registry is not current; update it before revalidating a saved proof');
      const sources = loadCurrentIdentityEvidence(saved, own, matcher);
      let certificate;
      try {
        certificate = validateChapterIdentityBundle({ localPersonMap: index.localPersonMap, canonicalByKnownId: index.canonicalByKnownId }, sources, { book, chapter }, saved, inputs);
      } catch (error) {
        // A failed saved proof is a visible hold. Never silently commission a
        // replacement conversation or repeat an unchanged historical hold.
        if (!(error instanceof ChapterIdentityReviewError)) throw error;
        throw new Error(`Saved identity proof requires reconciliation: ${error.message}`, { cause: error });
      }
      need(identityDossierInputs(REPO_ROOT) === identityInputs && peopleDigest(chapterIdentityInputs(book, chapter)) === peopleDigest(inputs) &&
        identityArtifactHash(fs.readFileSync(savedPath)) === identityArtifactHash(savedBytes), 'Saved proof or current source changed during revalidation');
      const receipt = { status: 'identity-review-current', scope: { book, chapter }, inputs,
        savedProof: savedPath, savedProofSha256: identityArtifactHash(savedBytes), newReviewCases: 0,
        reviewedCases: certificate.retained.length, reviewedAmbiguousCases: certificate.ambiguity.length,
        generatedPairs: 0, independentReviewCompleted: true, dataQualified: false, published: false };
      fs.mkdirSync(out, { recursive: false });
      fs.writeFileSync(path.join(out, 'preparation-receipt.json'), JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
      need(!inspectLocalDisk(HOST_ROOT).errors.length, 'Host guard failed after proof reuse; dispatch no new work');
      return receipt;
    } finally { index.close(); }
  }
  const prepared = await buildChapterIdentityReviewPacket(options);
  const { receipt } = prepared;
  writePreparedIdentityReviewArtifacts(out, prepared);
  return receipt;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), options = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].slice(2); need(['book', 'chapter', 'registry', 'out', 'source-revision'].includes(key) && args[i].startsWith('--') && args[i+1], 'Usage: --book BOOK --chapter NNN --registry IMMUTABLE_DIRECTORY --out NEW_ARTIFACT_DIRECTORY [--source-revision FULL_GIT_SHA]');
    const option = key === 'source-revision' ? 'sourceRevision' : key;
    need(!Object.hasOwn(options, option), `Duplicate option ${key}`); options[option] = args[i+1];
  }
  for (const key of ['registry', 'out']) { need(options[key] && path.isAbsolute(options[key]), `Absolute --${key} required`); }
  console.log(JSON.stringify(await prepareChapterIdentityReview(options), null, 2));
}
