import { loadCurrentIdentityEvidence } from './people-identity-evidence.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { identityArtifactHash } from './people-identity-artifacts.mjs';
export { identityArtifactHash } from './people-identity-artifacts.mjs';
import { REPO_ROOT, PEOPLE_DIR, readJson, writeJsonAtomic } from './people-content.mjs';
import { identityDossierInputs, peopleDigest } from './people-identity-seal.mjs';
import { readIdentityDossierRegistry as readIdentityDossierStore } from './people-identity-dossier-delta.mjs';
import { chapterIdentityInputs, chapterIdentityReviewPath, chapterIdentityEvidenceScopes,
  validateChapterIdentityBundle, identitySourceEvidenceFingerprint, chapterChineseEvidenceFingerprint } from './people-chapter-identity.mjs';
import { loadValidatedPeopleChapter } from './people-validated-chapter.mjs';
import { loadProperNounMatcher } from './people-candidates.mjs';
import { dateAuditStatus } from './people-date-audit.mjs';
import { editorialDecisionPath } from './people-editorial-decisions.mjs';
import { assertChapterGates } from './people-qualified-scope.mjs';
import { acquireProcessRunLock } from './process-run-lock.mjs';
import { pinnedIdentityChapterContext, provePinnedDossierReuse, assertPinnedIdentityRuntime, pinnedIdentityHostGeneratedDirectory } from './people-pinned-identity-source.mjs';
import { compactChapterIdentityReviewPacket, splitChapterIdentityReviewTransport, assembleChapterIdentityReviewParts, identityReviewTransportMaxBytes } from './people-identity-review-transport.mjs';
const need = (condition, message) => { if (!condition) throw new Error(message); };

// The job journal is host-owned captured transport metadata. A remote worker
// writes its assigned report only; it cannot choose the actual reviewer identity.
export function createIdentityReviewBundle(packetBytes, reportBytes, job, supplementBytes = null, partArtifacts = []) {
  const packet = JSON.parse(packetBytes), original = JSON.parse(reportBytes);
  need(packet.schemaVersion === 1 && packet.kind === 'source-chapter-dossier-review-packet', 'Wrong source review packet');
  need(job.schemaVersion === 1 && ['captured-independent-identity-review','captured-independent-identity-review-parts'].includes(job.kind) && job.phase === 'report-recorded' &&
    peopleDigest(job.scope) === peopleDigest(packet.scope) && typeof job.agentId === 'string' && job.agentId && typeof job.runId === 'string' && job.runId,
    'Actual captured source-review job provenance required');
  need(job.sourcePacketSha256 === identityArtifactHash(packetBytes) && job.reportSha256 === identityArtifactHash(reportBytes), 'Captured packet/report byte hashes do not match');
  need(original.reviewer?.agentId === job.agentId && original.planFingerprint === packet.plan.fingerprint, 'Report is not from the actual assigned independent reviewer');
  let partReceipts = null;
  if (job.kind === 'captured-independent-identity-review-parts') {
    const expected = splitChapterIdentityReviewTransport(compactChapterIdentityReviewPacket(packet), identityReviewTransportMaxBytes(job.transportPolicy));
    need(Array.isArray(job.parts) && job.parts.length === expected.length && partArtifacts.length === expected.length, 'All captured independent review parts are required');
    const transports = [], reports = [];
    for (const [i, capture] of job.parts.entries()) {
      const artifact = partArtifacts[i], transport = JSON.parse(artifact.transportBytes), report = JSON.parse(artifact.reportBytes);
      need(capture.schemaVersion === 1 && capture.kind === 'captured-independent-identity-review-part' && capture.phase === 'report-recorded' &&
        typeof capture.agentId === 'string' && capture.agentId && report.reviewer?.agentId === capture.agentId && typeof capture.runId === 'string' && capture.runId && capture.sourcePacketSha256 === job.sourcePacketSha256 &&
        capture.transportSha256 === identityArtifactHash(artifact.transportBytes) && capture.reportSha256 === identityArtifactHash(artifact.reportBytes) &&
        identityArtifactHash(artifact.transportBytes) === identityArtifactHash(Buffer.from(JSON.stringify(expected[i]) + '\n')),
        'Actual captured identity part bytes/provenance do not match');
      transports.push(transport); reports.push(report);
    }
    need(job.parts.some(part => part.agentId === job.agentId && part.runId === job.runId), 'Aggregate identity journal must retain an actual contributor and their matching run');
    const assembled = assembleChapterIdentityReviewParts(packet.plan, transports, reports, job.parts.map(p => p.agentId), packet.authorAgentIds);
    need(peopleDigest(assembled) === peopleDigest(original), 'Recorded aggregate report differs from actual independent part reports');
    partReceipts = job.parts.map((p, i) => ({ agentId: p.agentId, runId: p.runId, packetSha256: p.sourcePacketSha256, transportSha256: p.transportSha256,
      reportSha256: p.reportSha256, caseIds: transports[i].reviewCases.map(c => c.caseId) }));
  } else need(!job.parts && !partArtifacts.length, 'Unexpected identity part capture metadata');
  const report = structuredClone(original);
  if (supplementBytes) {
    const supplement = JSON.parse(supplementBytes), capture = job.citationSupplement;
    need(capture && capture.agentId === job.agentId && capture.runId && capture.sha256 === identityArtifactHash(supplementBytes) &&
      capture.packetSha256 === supplement.packetSha256 && supplement.reviewerAgentId === job.agentId && supplement.schemaVersion === 1,
      'Citation supplement lacks same-reviewer captured provenance');
    const row = report.reviews.find(item => item.caseId === supplement.caseId);
    need(row && ['approve','hold'].includes(supplement.verdict), 'Unknown or invalid supplemented source case');
    if (supplement.verdict === 'hold') { row.verdict = 'hold'; row.reason = supplement.reason; }
    else {
      const matches = row.sourceWitnesses.map((witness,index) => witness.localId === supplement.sourceWitness?.localId ? index : -1).filter(index => index >= 0);
      need(matches.length === 1, 'Citation supplement must replace one existing witness only');
      row.sourceWitnesses[matches[0]] = supplement.sourceWitness;
    }
  } else need(!job.citationSupplement, 'Captured citation supplement must be supplied');
  if (partReceipts) { const rows = new Map(report.reviews.map(row => [row.caseId, row])); for (const part of partReceipts) part.reviewsFingerprint = peopleDigest(part.caseIds.map(id => rows.get(id))); }
  const byScope = new Map();
  for (const unit of packet.units) {
    const key = `${unit.book}:${unit.chapter}`;
    if (!byScope.has(key)) byScope.set(key, []);
    byScope.get(key).push(unit);
  }
  const ownUnits = byScope.get(`${packet.scope.book}:${packet.scope.chapter}`);
  need(ownUnits, 'Complete reviewed target chapter is missing');
  return { schemaVersion: 1, kind: 'chapter-identity-review', scope: packet.scope, plan: packet.plan, report,
    receipt: { actualReviewerAgentId: job.agentId,
      authorAgentIds: [...new Set([...packet.authorAgentIds, ...(job.authorAgentIds ?? [])])],
      ...(partReceipts ? { reviewParts: partReceipts } : {}),
      planFingerprint: packet.plan.fingerprint, reportFingerprint: peopleDigest(report),
      chapterChinese: chapterChineseEvidenceFingerprint({ units: ownUnits }),
      sourcePeople: packet.people.map(person => {
        const units = byScope.get(`${person.book}:${person.chapter}`);
        need(units, `Missing reviewed source context ${person.localId}`);
        return { localId: person.localId, fingerprint: identitySourceEvidenceFingerprint(person, { units }) };
      }) } };
}

export async function recordChapterIdentityReview({ packet, report, job, registry, supplement = null, out = null, previousSha256 = null }) {
  const packetBytes = fs.readFileSync(packet), reportBytes = fs.readFileSync(report), captured = readJson(job);
  const partArtifacts = captured.kind === 'captured-independent-identity-review-parts' ? (captured.parts ?? []).map(p => ({ transportBytes: fs.readFileSync(p.transportFile), reportBytes: fs.readFileSync(p.reportFile) })) : [];
  const bundle = createIdentityReviewBundle(packetBytes, reportBytes, captured, supplement ? fs.readFileSync(supplement) : null, partArtifacts);
  const packetData = JSON.parse(packetBytes), pinned = packetData.registryReuse ? pinnedIdentityChapterContext(REPO_ROOT, packetData.registryReuse.sourceRevision) : null;
  const { book, chapter } = bundle.scope, canonical = chapterIdentityReviewPath(book, chapter);
  const target = out ? path.resolve(out) : canonical, generated = path.join(PEOPLE_DIR, 'generated') + path.sep;
  const hostGenerated = pinned ? pinnedIdentityHostGeneratedDirectory() : null;
  need(target === canonical || target.startsWith(generated) || (hostGenerated && target.startsWith(hostGenerated + path.sep)), 'Identity record output must be the exact canonical review or an assigned generated artifact');
  const existing = fs.existsSync(target) ? fs.readFileSync(target) : null;
  if (existing && peopleDigest(JSON.parse(existing)) !== peopleDigest(bundle)) need(previousSha256 && identityArtifactHash(existing) === previousSha256, 'Existing identity proof differs; exact --previous-sha256 is required');
  const release = acquireProcessRunLock(path.join(hostGenerated ?? path.join(PEOPLE_DIR, 'generated'), 'resolution-run.lock'), { label: `Record independent identity ${book}:${chapter}`, failIfExists: true });
  let index;
  try {
    const identityInputs = pinned ? null : identityDossierInputs(REPO_ROOT);
    index = await readIdentityDossierStore(registry, new Map());
    if (pinned) need(peopleDigest(provePinnedDossierReuse(index.provenance, pinned.snapshot)) === peopleDigest(packetData.registryReuse), 'Pinned registry reuse proof changed before recording');
    else need(index.provenance.identityInputs === identityInputs, 'Registry is not current; rebuild its immutable generation before recording new work');
    const matcher = loadProperNounMatcher();
    const own = pinned ? pinned.load(book, chapter, { properNounMatcher: matcher }) : loadValidatedPeopleChapter(book, chapter, { properNounMatcher: matcher });
    const sources = loadCurrentIdentityEvidence(bundle, own, matcher, new Map(), pinned ? pinned.load : loadValidatedPeopleChapter);
    const editorialFile = editorialDecisionPath(book, chapter);
    assertChapterGates(own.extraction, (pinned ? pinned.config : readJson(path.join(PEOPLE_DIR, 'config.json'))).promptVersion,
      pinned ? pinned.dates(book, chapter) : dateAuditStatus(book, chapter), pinned ? pinned.editorial(book, chapter) : fs.existsSync(editorialFile) ? readJson(editorialFile) : null);
    const inputs = pinned ? pinned.inputs(book, chapter) : chapterIdentityInputs(book, chapter);
    const certificate = validateChapterIdentityBundle({ localPersonMap: index.localPersonMap, canonicalByKnownId: index.canonicalByKnownId }, sources, bundle.scope, bundle, inputs);
    if (pinned) assertPinnedIdentityRuntime(pinned.snapshot);
    need((pinned || identityDossierInputs(REPO_ROOT) === identityInputs) && peopleDigest(pinned ? pinned.inputs(book, chapter) : chapterIdentityInputs(book, chapter)) === peopleDigest(inputs), 'Source/identity inputs changed during record validation');
    const now = fs.existsSync(target) ? fs.readFileSync(target) : null;
    need((existing === null && now === null) || (existing !== null && now !== null && identityArtifactHash(now) === identityArtifactHash(existing)), 'Identity output changed during validation');
    const unchanged = existing !== null && peopleDigest(JSON.parse(existing)) === peopleDigest(bundle);
    if (!unchanged) writeJsonAtomic(target, bundle);
    return { scope: bundle.scope, out: target, unchanged, reviewerAgentId: captured.agentId, reviewerRunId: captured.runId,
      inputs, ...(pinned ? { sourceRevision: pinned.snapshot.revision, registryReuseProved: true } : {}), ...(captured.parts ? { reviewerRunIds: captured.parts.map(p => p.runId) } : {}), reviewedCases: certificate.retained.length, chapterLocalPeople: certificate.retained.reduce((sum,row) => sum + row.localPeople.length,0),
      reviewedAmbiguousCases: certificate.ambiguity.length, nativeIdentityProofAccepted: true,
      dataQualified: false, published: false };
  } finally { index?.close(); release(); }
}
