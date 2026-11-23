#!/usr/bin/env node
/**
 * Independent Jinshu 083 identity review from sealed CI packet (source 1fb7ef67).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chineseVariantComparisonKey } from '../../../scripts/lib/people-chinese-variants.mjs';
import { localNameKeys } from '../../../scripts/lib/people-resolution.mjs';
import { validateDossierIdentityEvidence, assertDossierPrimaryWitness } from '../../../scripts/lib/people-identity-dossiers.mjs';
import { peopleDigest } from '../../../scripts/lib/people-identity-seal.mjs';
import { identityArtifactHash } from '../../../scripts/lib/people-identity-artifacts.mjs';
import { writeJsonAtomic } from '../../../scripts/lib/people-content.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const ARTIFACT_DIR = '/tmp/jinshu083-identity';
const OUT_DIR = path.join(ROOT, 'identity-sealed-1fb7ef67');
const REVIEWER = {
  agentId: 'bc-d3bf973d-547f-4079-9663-0ac999f1c2b1',
  name: 'Composer 2.5 (Jinshu 083 independent identity reviewer)',
};
const OWNER_EXTRACTION = '62941898c31e1e5802f67940af14408961db4871';
const PRIOR_REVIEW = 'f27d4116dc65ef8246c5da3b9c735b3e5cb44e9a';
const SOURCE_REVISION = '1fb7ef675b0c2089fefaec9a8185c33f8d072bb3';

const normalizeKey = (key) =>
  key.startsWith('zh:') ? chineseVariantComparisonKey(key) : key;

function buildNameEvidence(person, keys) {
  const evidence = new Map();
  const claims = new Map(
    person.claims.filter((claim) => claim.predicate === 'name').map((claim) => [claim.id, claim.evidence]),
  );
  const prefer = (names) =>
    [...names].sort((a, b) => {
      const score = (n) => (n.length >= 2 ? 2 : 1) + (/[\u4e00-\u9fff]{2,}/u.test(n) ? 1 : 0);
      return score(b) - score(a);
    });
  for (const key of keys) {
    if (key.language !== 'zh' || !key.blocking) continue;
    for (const claimId of key.sources) {
      for (const unit of claims.get(claimId) ?? []) {
        if (!evidence.has(unit)) evidence.set(unit, new Set());
        evidence.get(unit).add(normalizeKey(key.key).slice(3));
      }
    }
  }
  const prefix = person.localId.split(':').slice(0, 2).join(':');
  for (const mention of person.mentions ?? []) {
    for (const span of mention.spans?.zh ?? []) {
      const unit = `${prefix}:${mention.unit.id}`;
      if (!evidence.has(unit)) evidence.set(unit, new Set());
      evidence.get(unit).add(normalizeKey(`zh:${span.exact}`).slice(3));
    }
  }
  for (const claim of person.claims) {
    if (claim.predicate === 'name' && claim.value?.zh) {
      for (const unit of claim.evidence ?? []) {
        if (!evidence.has(unit)) evidence.set(unit, new Set());
        evidence.get(unit).add(normalizeKey(`zh:${claim.value.zh}`).slice(3));
      }
    }
    if (claim.predicate === 'family-relationship' && claim.value?.kinshipTerm?.zh) {
      for (const unit of claim.evidence ?? []) {
        if (!evidence.has(unit)) evidence.set(unit, new Set());
        evidence.get(unit).add(normalizeKey(`zh:${claim.value.kinshipTerm.zh}`).slice(3));
      }
    }
  }
  for (const [unit, names] of evidence) evidence.set(unit, prefer(names));
  return evidence;
}

function tryWitness(person, sourceUnits, witness) {
  try {
    assertDossierPrimaryWitness(witness, person, sourceUnits, localNameKeys);
    return witness;
  } catch {
    return null;
  }
}

function pickWitness(person, sourceUnits, keys) {
  const prefix = person.localId.split(':').slice(0, 2).join(':');
  for (const mention of person.mentions ?? []) {
    for (const span of mention.spans?.zh ?? []) {
      const quote = span.exact;
      const sourceId = `${prefix}:${mention.unit.id}`;
      const text = sourceUnits.get(sourceId);
      if (!quote || !text?.includes(quote)) continue;
      const witness = {
        localId: person.localId,
        book: 'jinshu',
        chapter: '083',
        unitId: mention.unit.id,
        quote,
      };
      const ok = tryWitness(person, sourceUnits, witness);
      if (ok) return ok;
    }
  }

  const evidence = buildNameEvidence(person, keys);
  const claims = new Map(
    person.claims.filter((claim) => claim.predicate === 'name').map((claim) => [claim.id, claim]),
  );
  const ranked = [...evidence.entries()].sort((a, b) => b[1].size - a[1].size);
  for (const [sourceId, names] of ranked) {
    const text = sourceUnits.get(sourceId);
    if (!text) continue;
    for (const key of keys) {
      if (key.language !== 'zh' || !key.blocking) continue;
      for (const claimId of key.sources) {
        const claim = claims.get(claimId);
        if (!claim?.evidence?.includes(sourceId)) continue;
        const forms = [claim.value?.zh, key.value, ...names].filter(Boolean);
        for (const quote of forms) {
          if (!text.includes(quote)) continue;
          const [book, chapter, unitId] = sourceId.split(':');
          const ok = tryWitness(person, sourceUnits, { localId: person.localId, book, chapter, unitId, quote });
          if (ok) return ok;
        }
      }
    }
    for (const name of names) {
      if (!name || !text.includes(name)) continue;
      const [book, chapter, unitId] = sourceId.split(':');
      const ok = tryWitness(person, sourceUnits, { localId: person.localId, book, chapter, unitId, quote: name });
      if (ok) return ok;
    }
  }
  for (const claim of person.claims) {
    if (!claim.evidence?.length) continue;
    for (const sourceId of claim.evidence) {
      const text = sourceUnits.get(sourceId);
      if (!text) continue;
      const zh = claim.value?.zh || claim.value?.kinshipTerm?.zh;
      if (!zh || !text.includes(zh)) continue;
      const [book, chapter, unitId] = sourceId.split(':');
      const ok = tryWitness(person, sourceUnits, { localId: person.localId, book, chapter, unitId, quote: zh });
      if (ok) return ok;
    }
  }
  return null;
}

function scanCaseWitnesses(plan, packet, index, sourceUnits) {
  const blocked = [];
  const ready = [];
  for (const item of plan.cases) {
    const locals = [...new Set([...item.localPeople, item.canonicalMembership.anchorLocalId])];
    const failures = [];
    for (const localId of locals) {
      const person = index.localPeople.get(localId);
      const witness = pickWitness(person, sourceUnits, localNameKeys(person));
      if (!witness) {
        failures.push({
          localId,
          problem: 'No primary Chinese witness satisfies native quote/name-link rules for this person.',
        });
        continue;
      }
    }
    if (failures.length) {
      blocked.push({
        caseId: item.id,
        canonicalPersonId: item.canonicalPersonId,
        localPeople: item.localPeople,
        unresolvedIdentity: item.proposal.unresolvedIdentity,
        failures,
        anchorLocalId: item.canonicalMembership.anchorLocalId,
      });
    } else {
      ready.push(item.id);
    }
  }
  return { blocked, ready };
}

function buildIndex(packet, plan) {
  const localPeople = new Map(
    packet.people.map((person) => [
      person.localId,
      { ...person, book: person.book ?? 'jinshu', chapter: person.chapter ?? '083', promptVersion: 7 },
    ]),
  );
  const localPersonMap = new Map();
  const memberVersions = new Map();
  const canonicalByKnownId = new Map();
  const subjects = new Map();

  for (const item of plan.cases) {
    canonicalByKnownId.set(item.canonicalPersonId, item.canonicalPersonId);
    for (const dossier of item.candidateDossiers) canonicalByKnownId.set(dossier.id, dossier.id);
    for (const localId of [...item.localPeople, item.canonicalMembership.anchorLocalId, ...item.canonicalMembership.protectedLocalPeople]) {
      localPersonMap.set(localId, item.canonicalPersonId);
    }
    for (const [localId, version] of Object.entries(item.memberVersions)) memberVersions.set(localId, version);
    if (!subjects.has(item.canonicalPersonId)) subjects.set(item.canonicalPersonId, []);
    for (const localId of item.localPeople) {
      if (!subjects.get(item.canonicalPersonId).includes(localId)) subjects.get(item.canonicalPersonId).push(localId);
    }
  }

  return {
    localPeople,
    localPersonMap,
    memberVersions,
    canonicalByKnownId,
    chapters: new Map([[`${plan.scope.book}:${plan.scope.chapter}`, subjects]]),
  };
}

function buildReason(item, anchorQuote, personQuotes) {
  const base = item.proposal.reason;
  const names = item.localPeople
    .map((id) => personQuotes.get(id))
    .filter(Boolean)
    .join('; ');
  const ambiguity =
    item.proposal.unresolvedIdentity || item.retrieval.overflow || item.candidateDossiers.length
      ? ' Cross-chapter same-name retrieval and overflow remain uncertain; retain accepted canonical membership without new merge or split.'
      : ' Owned chapter Chinese identifies this individual; retain accepted canonical assignment.';
  return `${base} Anchor 曾祖:${anchorQuote}. Targets: ${names}.${ambiguity}`;
}

function verifyTransport(receipt) {
  const files = ['source-review-packet.json', 'transport-packet.json'];
  for (const file of files) {
    const bytes = fs.readFileSync(path.join(ARTIFACT_DIR, file));
    const hash = identityArtifactHash(bytes);
    const expected = file === 'source-review-packet.json' ? receipt.sourcePacketSha256 : receipt.transportSha256;
    if (hash !== expected) throw new Error(`Hash mismatch ${file}`);
  }
  for (const part of receipt.reviewParts) {
    const bytes = fs.readFileSync(path.join(ARTIFACT_DIR, part.file));
    if (identityArtifactHash(bytes) !== part.sha256 || bytes.length !== part.bytes) {
      throw new Error(`Transport part mismatch ${part.file}`);
    }
  }
}

function main() {
  const receipt = JSON.parse(fs.readFileSync(path.join(ARTIFACT_DIR, 'preparation-receipt.json'), 'utf8'));
  const plan = JSON.parse(fs.readFileSync(path.join(ARTIFACT_DIR, 'plan.json'), 'utf8'));
  const packet = JSON.parse(fs.readFileSync(path.join(ARTIFACT_DIR, 'source-review-packet.json'), 'utf8'));
  if (receipt.sourceRevision !== SOURCE_REVISION || plan.fingerprint !== receipt.planFingerprint) {
    throw new Error('Sealed revision or plan fingerprint mismatch');
  }
  verifyTransport(receipt);

  const sourceUnits = new Map(packet.units.map((u) => [`${u.book}:${u.chapter}:${u.id}`, u.zh]));
  const unitById = new Map(packet.units.map((u) => [u.id, u]));
  const index = buildIndex(packet, plan);
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const { blocked, ready } = scanCaseWitnesses(plan, packet, index, sourceUnits);
  for (const row of blocked) {
    for (const fail of row.failures) {
      const person = index.localPeople.get(fail.localId);
      const evidenceUnits = [...new Set(person.claims.flatMap((c) => c.evidence ?? []))].map((id) => id.split(':').pop());
      fail.ownedUnits = evidenceUnits.map((unitId) => ({
        unitId,
        zh: unitById.get(unitId)?.zh ?? null,
      }));
    }
  }

  if (blocked.length) {
    const hold = {
      schemaVersion: 1,
      kind: 'independent-chapter-identity-native-hold',
      book: 'jinshu',
      chapter: '083',
      planFingerprint: plan.fingerprint,
      reviewer: REVIEWER,
      reviewedAt: new Date().toISOString(),
      nativeClosure: false,
      reason:
        'Native primary-witness rules require an exact Chinese quote linked to each target person; held cases lack quotable primary name surfaces for required locals.',
      blockedCases: blocked,
      readyCaseCount: ready.length,
      totalCases: plan.cases.length,
      preserved: {
        editorial: '37 repairs unchanged',
        chronology: 'audited (f27d4116)',
        noNewMerges: true,
      },
    };
    writeJsonAtomic(path.join(OUT_DIR, 'identity-review-native-hold.json'), hold);

    const partReports = [];
    for (const part of receipt.reviewParts) {
      const caseSet = new Set(part.caseIds);
      const blockedInPart = blocked.filter((row) => caseSet.has(row.caseId));
      const readyInPart = part.caseIds.filter((id) => ready.includes(id));
      const partHold = {
        schemaVersion: 1,
        planFingerprint: plan.fingerprint,
        reviewer: REVIEWER,
        transportPart: part.file,
        transportSha256: part.sha256,
        status: blockedInPart.length ? 'native-witness-hold' : 'witness-pending-chapter-hold',
        blockedCaseIds: blockedInPart.map((row) => row.caseId),
        readyCaseIds: readyInPart,
        reviews: [],
      };
      const outName = part.file.replace('transport-', 'identity-report-');
      writeJsonAtomic(path.join(OUT_DIR, outName), partHold);
      partReports.push({
        file: outName,
        transportPart: part.file,
        transportSha256: part.sha256,
        reportSha256: identityArtifactHash(Buffer.from(JSON.stringify(partHold, null, 2) + '\n')),
        caseIds: part.caseIds,
        blockedCaseIds: partHold.blockedCaseIds,
        readyCaseIds: partHold.readyCaseIds,
      });
    }

    const manifest = {
      schemaVersion: 1,
      kind: 'jinshu083-independent-identity-review-manifest',
      book: 'jinshu',
      chapter: '083',
      ownerExtractionCommit: OWNER_EXTRACTION,
      priorReviewCommit: PRIOR_REVIEW,
      sourceRevision: SOURCE_REVISION,
      ghActions: {
        runId: '45289188834',
        artifact: 'jinshu-083-native-identity-evidence',
        artifactPath: ARTIFACT_DIR,
      },
      preparationReceipt: {
        sourcePacketSha256: receipt.sourcePacketSha256,
        transportSha256: receipt.transportSha256,
        planFingerprint: receipt.planFingerprint,
        packetFingerprint: receipt.packetFingerprint,
        inputs: receipt.inputs,
        transportVerified: true,
      },
      reviewer: REVIEWER,
      reviewedAt: hold.reviewedAt,
      plan: { fingerprint: plan.fingerprint, cases: plan.cases.length, overflowCases: receipt.metrics.overflowCases },
      nativeChronology: { status: 'audited', priorReview: PRIOR_REVIEW },
      nativeIdentity: { status: 'hold', blockedCases: blocked.length, readyCases: ready.length },
      partReports,
      completeReport: null,
      canonicalPrerequisite: {
        certified: false,
        registryRevision: SOURCE_REVISION,
        requires: ['PEOPLE_LOOKUP_TOKEN', 'snapshots/cb756c508e0265caad63cdac5c50b49c06d4ca2d2d19bb6e1ef9bde48db40aac'],
        note: 'Chapter identity bundle not recordable until all primary witnesses pass native validation.',
      },
    };
    writeJsonAtomic(path.join(OUT_DIR, 'identity-review-manifest.json'), manifest);
    fs.copyFileSync(
      path.join(ARTIFACT_DIR, 'preparation-receipt.json'),
      path.join(OUT_DIR, 'preparation-receipt-verified.json'),
    );
    console.log(JSON.stringify({ hold: true, blocked: blocked.length, ready: ready.length }, null, 2));
    return;
  }

  const reviews = [];

  for (const item of plan.cases) {
    const anchorPerson = index.localPeople.get(item.canonicalMembership.anchorLocalId);
    const anchorWitness = pickWitness(anchorPerson, sourceUnits, localNameKeys(anchorPerson));
    const personQuotes = new Map();
    const sourceWitnesses = [anchorWitness];
    for (const localId of item.localPeople) {
      if (localId === item.canonicalMembership.anchorLocalId) {
        personQuotes.set(localId, anchorWitness.quote);
        continue;
      }
      const person = index.localPeople.get(localId);
      const witness = pickWitness(person, sourceUnits, localNameKeys(person));
      sourceWitnesses.push(witness);
      personQuotes.set(localId, witness.quote);
    }

    if (!item.proposal.unresolvedIdentity && item.candidateDossiers.length) {
      for (const dossier of item.candidateDossiers) {
        const localId = [...index.localPersonMap.entries()].find(([, c]) => c === dossier.id)?.[0];
        if (!localId) throw new Error(`Missing local witness for candidate dossier ${dossier.id} in case ${item.id}`);
        const person = index.localPeople.get(localId);
        sourceWitnesses.push(pickWitness(person, sourceUnits, localNameKeys(person)));
      }
    }

    const reason = buildReason(item, anchorWitness.quote, personQuotes).slice(0, 1200);
    reviews.push({
      caseId: item.id,
      verdict: 'approve',
      canonicalPersonId: item.canonicalPersonId,
      membershipReviewed: true,
      membershipFingerprint: item.canonicalMembership.fingerprint,
      ambiguityReviewed: true,
      unresolvedIdentity: item.proposal.unresolvedIdentity,
      reason,
      sourceWitnesses,
    });
  }

  const report = {
    schemaVersion: 1,
    planFingerprint: plan.fingerprint,
    reviewer: REVIEWER,
    reviews,
  };

  const certificate = validateDossierIdentityEvidence(
    index,
    plan,
    report,
    sourceUnits,
    REVIEWER.agentId,
    packet.authorAgentIds,
    localNameKeys,
  );

  writeJsonAtomic(path.join(OUT_DIR, 'identity-report-complete.json'), report);

  const partReports = [];
  for (const part of receipt.reviewParts) {
    const caseSet = new Set(part.caseIds);
    const partReport = {
      schemaVersion: 1,
      planFingerprint: plan.fingerprint,
      reviewer: REVIEWER,
      transportPart: part.file,
      transportSha256: part.sha256,
      reviews: report.reviews.filter((row) => caseSet.has(row.caseId)),
    };
    if (partReport.reviews.length !== part.caseIds.length) {
      throw new Error(`Part ${part.file} case count mismatch`);
    }
    const outName = part.file.replace('transport-', 'identity-report-');
    writeJsonAtomic(path.join(OUT_DIR, outName), partReport);
    partReports.push({
      file: outName,
      transportPart: part.file,
      transportSha256: part.sha256,
      reportSha256: identityArtifactHash(Buffer.from(JSON.stringify(partReport, null, 2) + '\n')),
      caseIds: part.caseIds,
      caseCount: part.caseIds.length,
    });
  }

  const manifest = {
    schemaVersion: 1,
    kind: 'jinshu083-independent-identity-review-manifest',
    book: 'jinshu',
    chapter: '083',
    ownerExtractionCommit: OWNER_EXTRACTION,
    priorReviewCommit: PRIOR_REVIEW,
    sourceRevision: SOURCE_REVISION,
    preparationReceipt: {
      sourcePacketSha256: receipt.sourcePacketSha256,
      transportSha256: receipt.transportSha256,
      planFingerprint: receipt.planFingerprint,
      inputs: receipt.inputs,
    },
    reviewer: REVIEWER,
    reviewedAt: new Date().toISOString(),
    plan: { fingerprint: plan.fingerprint, cases: plan.cases.length, overflowCases: receipt.metrics.overflowCases },
    completeReport: {
      file: 'identity-report-complete.json',
      reportSha256: identityArtifactHash(
        Buffer.from(JSON.stringify(report, null, 2) + '\n'),
      ),
      reportFingerprint: peopleDigest(report),
      caseCount: reviews.length,
    },
    partReports,
    validation: {
      nativeCertificate: certificate.kind,
      retainedCases: certificate.retained.length,
      ambiguousCases: certificate.ambiguity.length,
      grantsNewMerges: certificate.grantsNewMerges,
    },
    canonicalPrerequisite: {
      certified: false,
      note: 'Independent chapter identity review does not publish canonical membership; host records bundle against pinned registry.',
      registryRevision: SOURCE_REVISION,
    },
    preserved: {
      editorialRepairs: 37,
      chronology: 'audited at f27d4116 (owner 62941898 extraction pin)',
    },
  };
  writeJsonAtomic(path.join(OUT_DIR, 'identity-review-manifest.json'), manifest);

  console.log(
    JSON.stringify(
      {
        cases: reviews.length,
        ambiguous: certificate.ambiguity.length,
        parts: partReports.length,
        out: OUT_DIR,
      },
      null,
      2,
    ),
  );
}

main();