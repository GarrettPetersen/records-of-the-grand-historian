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
import { compactChapterIdentityReviewPacket } from './lib/people-identity-review-transport.mjs';
import { identityArtifactHash } from './lib/people-identity-artifacts.mjs';
import { memberContract, planChapterIdentityReview, IDENTITY_REVIEW_LIMITS } from './lib/people-identity-dossiers.mjs';
import { readIdentityDossierStore } from './lib/people-identity-dossier-store.mjs';
import { chapterIdentityInputs } from './lib/people-chapter-identity.mjs';
const HOST_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const need = (ok, message) => { if (!ok) throw new Error(message); };
export async function buildChapterIdentityReviewPacket({ book, chapter, registry }) {
  need(!inspectLocalDisk(HOST_ROOT).errors.length, 'Host resource guard rejected dossier preparation');
  const inputs = chapterIdentityInputs(book, chapter), scope = { book, chapter }, matcher = loadProperNounMatcher();
  const own = loadValidatedPeopleChapter(book, chapter, { properNounMatcher: matcher });
  const editorialFile = editorialDecisionPath(book, chapter);
  assertChapterGates(own.extraction, readJson(path.join(PEOPLE_DIR, 'config.json')).promptVersion,
    dateAuditStatus(book, chapter), fs.existsSync(editorialFile) ? readJson(editorialFile) : null);
  const index = await readIdentityDossierStore(registry, new Map());
  try {
    const identityInputs = identityDossierInputs(REPO_ROOT);
    need(index.provenance.identityInputs === identityInputs, 'Registry is not current; build a new immutable generation before preparing fresh work');
    const plan = planChapterIdentityReview(index, scope, inputs, IDENTITY_REVIEW_LIMITS), sources = new Map([[`${book}:${chapter}`, own]]), relevant = new Map();
    for (const item of plan.cases) for (const id of [...item.localPeople, item.canonicalMembership.anchorLocalId]) {
      const [sourceBook, sourceChapter] = id.split(':'), key = `${sourceBook}:${sourceChapter}`;
      if (!sources.has(key)) sources.set(key, loadValidatedPeopleChapter(sourceBook, sourceChapter,
        { properNounMatcher: matcher, strictAliasDispositions: false }));
      const person = sources.get(key).localPeople.get(id);
      need(person && peopleDigest(memberContract(person, localNameKeys(person))) === index.memberVersions.get(id), `Stale dossier member ${id}; update the registry from accepted source deltas`);
      relevant.set(id, person);
    }
    need(peopleDigest(chapterIdentityInputs(book, chapter)) === peopleDigest(inputs) && identityDossierInputs(REPO_ROOT) === identityInputs, 'Source or identity inputs changed while preparing identity review');
    const units = new Map();
    // Complete target chapter, plus actual units supporting the retained anchors.
    for (const unit of own.packet.units) units.set(`${book}:${chapter}:${unit.id}`, { book, chapter, ...unit });
    for (const person of relevant.values()) for (const claim of person.claims) for (const evidenceId of claim.evidence) {
      const [sourceBook, sourceChapter, unitId] = evidenceId.split(':'), source = sources.get(`${sourceBook}:${sourceChapter}`);
      need(source, `Missing primary chapter for ${evidenceId}`);
      if (!source.unitMap) source.unitMap = new Map(source.packet.units.map(unit => [unit.id, unit]));
      const unit = source.unitMap.get(unitId);
      need(unit, `Missing current primary unit ${evidenceId}`); units.set(evidenceId, { book: sourceBook, chapter: sourceChapter, ...unit });
    }
    const candidateIds = [...new Set(plan.cases.flatMap(item => item.candidateDossiers.map(row => row.id)))];
    const packet = { schemaVersion: 1, kind: 'source-chapter-dossier-review-packet', scope, plan,
      authorAgentIds: [own.extraction.run.agentId], registryProvenance: index.provenance,
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
      generatedPairs: 0, independentReviewCompleted: false, dataQualified: false, published: false };
    need(!inspectLocalDisk(HOST_ROOT).errors.length, 'Host guard failed after dossier preparation; preserve artifacts, dispatch no new work');
    const transport = compactChapterIdentityReviewPacket(packet);
    const transportBytes = Buffer.from(JSON.stringify(transport) + '\n');
    need(transportBytes.length <= 768 * 1024, 'Source-complete review transport exceeds the inspected bound; preserve evidence and split the work without truncating it');
    receipt.sourcePacketSha256 = identityArtifactHash(bytes); receipt.transportSha256 = identityArtifactHash(transportBytes); receipt.transportBytes = transportBytes.length;
    return { plan, packet, transport, receipt };
  } finally { index.close(); }
}
export async function prepareChapterIdentityReview({ out, ...options }) {
  const { plan, packet, transport, receipt } = await buildChapterIdentityReviewPacket(options);
  fs.mkdirSync(out, { recursive: false });
  for (const [file, value] of [['plan.json', plan], ['source-review-packet.json', packet], ['transport-packet.json', transport], ['preparation-receipt.json', receipt]]) {
    fs.writeFileSync(path.join(out, file), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
  }
  return receipt;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), options = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].slice(2); need(['book', 'chapter', 'registry', 'out'].includes(key) && args[i].startsWith('--') && args[i+1], 'Usage: --book BOOK --chapter NNN --registry IMMUTABLE_DIRECTORY --out NEW_ARTIFACT_DIRECTORY');
    need(!Object.hasOwn(options, key), `Duplicate option ${key}`); options[key] = args[i+1];
  }
  for (const key of ['registry', 'out']) { need(options[key] && path.isAbsolute(options[key]), `Absolute --${key} required`); }
  console.log(JSON.stringify(await prepareChapterIdentityReview(options), null, 2));
}
