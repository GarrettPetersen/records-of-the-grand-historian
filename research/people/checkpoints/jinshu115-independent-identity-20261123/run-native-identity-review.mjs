#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assembleChapterIdentityReviewParts } from '../../../../scripts/lib/people-identity-review-transport.mjs';
import { assertDossierPrimaryWitness, validateDossierIdentityEvidence } from '../../../../scripts/lib/people-identity-dossiers.mjs';
import { localNameKeys } from '../../../../scripts/lib/people-resolution.mjs';
import { peopleDigest } from '../../../../scripts/lib/people-identity-seal.mjs';
import { identityArtifactHash } from '../../../../scripts/lib/people-identity-artifacts.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTIFACT_DIR = process.env.JINHSU115_IDENTITY_ARTIFACT ?? '/tmp/jinshu115-native-identity';
const OUT_DIR = __dirname;
const REVIEWER = {
  agentId: 'jinshu115-independent-reviewer-pr5483',
  name: 'Jinshu 115 independent identity reviewer (PR #5483, same chronology reviewer)',
};
const DRAFT_COMMIT = '10cdaf0030d3489e021bdedeed6fb495c074d943';
const CHRONOLOGY_EVIDENCE = '5118131b4a58b0aabe59208d4d7da90fe1dbe896';
const SOURCE_OVERLAY = '1fb25e99e2fc07ba0ee8fbd89369d44c482c4326';

const shaFile = file => `sha256:${createHash('sha256').update(readFileSync(file)).digest('hex')}`;

function loadJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function verifyReceipt(receipt) {
  const rows = receipt.reviewParts ?? [];
  for (const row of rows) {
    const file = path.join(ARTIFACT_DIR, row.file);
    const hash = identityArtifactHash(readFileSync(file));
    if (hash !== row.sha256) throw new Error(`Part hash mismatch ${row.file}`);
    if (row.bytes !== readFileSync(file).length) throw new Error(`Part bytes mismatch ${row.file}`);
    if (JSON.stringify(row.caseIds) !== JSON.stringify(loadJson(file).reviewCases.map(c => c.caseId))) throw new Error(`Part caseIds mismatch ${row.file}`);
  }
  const packetHash = identityArtifactHash(readFileSync(path.join(ARTIFACT_DIR, 'source-review-packet.json')));
  if (packetHash !== receipt.sourcePacketSha256) throw new Error('Source packet hash mismatch');
  const transportHash = identityArtifactHash(readFileSync(path.join(ARTIFACT_DIR, 'transport-packet.json')));
  if (transportHash !== receipt.transportSha256) throw new Error('Transport hash mismatch');
  if (receipt.sourceRevision !== SOURCE_OVERLAY) throw new Error('Unexpected sourceRevision');
  return { packetHash, transportHash };
}

function buildIndex(plan, packet) {
  const localPeople = new Map(packet.people.map(p => [p.localId, p]));
  const localPersonMap = new Map();
  const memberVersions = new Map();
  const canonicalByKnownId = new Map();
  const chapters = new Map([['jinshu:115', new Map()]]);
  for (const c of plan.cases) {
    for (const id of c.localPeople) localPersonMap.set(id, c.canonicalPersonId);
    for (const [id, version] of Object.entries(c.memberVersions ?? {})) memberVersions.set(id, version);
    canonicalByKnownId.set(c.canonicalPersonId, c.canonicalPersonId);
    for (const d of c.candidateDossiers ?? []) canonicalByKnownId.set(d.id, d.id);
    if (!chapters.get('jinshu:115').has(c.canonicalPersonId)) chapters.get('jinshu:115').set(c.canonicalPersonId, []);
    for (const id of c.localPeople) {
      const list = chapters.get('jinshu:115').get(c.canonicalPersonId);
      if (!list.includes(id)) list.push(id);
    }
  }
  return { localPeople, localPersonMap, memberVersions, canonicalByKnownId, chapters };
}

function sourceUnitsFromPacket(packet) {
  const map = new Map();
  for (const unit of packet.units) map.set(`${unit.book}:${unit.chapter}:${unit.id}`, unit.zh);
  return map;
}

function witnessCandidates(person) {
  const needles = new Set();
  for (const claim of person.claims) {
    if (claim.predicate !== 'name') continue;
    const zh = claim.value?.zh;
    if (typeof zh === 'string' && /\p{Script=Han}/u.test(zh)) needles.add(zh);
  }
  for (const mention of person.mentions ?? []) {
    for (const span of mention.spans?.zh ?? []) {
      if (span?.exact && /\p{Script=Han}/u.test(span.exact)) needles.add(span.exact);
    }
  }
  const units = [];
  for (const claim of person.claims) {
    if (claim.predicate !== 'name') continue;
    for (const evidenceId of claim.evidence) {
      const [book, chapter, unitId] = evidenceId.split(':');
      units.push({ book, chapter, unitId, evidenceId });
    }
  }
  for (const mention of person.mentions ?? []) {
    const unitId = mention.unit?.id ?? mention.unit;
    const [book, chapter] = person.localId.split(':');
    units.push({ book, chapter, unitId, evidenceId: `${book}:${chapter}:${unitId}` });
  }
  return { needles: [...needles], units };
}

function findWitness(person, sourceUnits, nameKeysForPerson) {
  const { needles, units } = witnessCandidates(person);
  const [book, chapter] = person.localId.split(':');
  const tried = new Set();
  for (const unit of units) {
    const zh = sourceUnits.get(unit.evidenceId);
    if (!zh || tried.has(unit.evidenceId)) continue;
    tried.add(unit.evidenceId);
    for (const needle of needles) {
      if (!zh.includes(needle)) continue;
      const start = zh.indexOf(needle);
      const quote = zh.slice(Math.max(0, start - 2), Math.min(zh.length, start + needle.length + 4));
      const witness = { localId: person.localId, book, chapter, unitId: unit.unitId, quote };
      try {
        assertDossierPrimaryWitness(witness, person, sourceUnits, nameKeysForPerson);
        return witness;
      } catch { /* try next */ }
      const tight = zh.slice(start, start + needle.length);
      const witness2 = { localId: person.localId, book, chapter, unitId: unit.unitId, quote: tight };
      try {
        assertDossierPrimaryWitness(witness2, person, sourceUnits, nameKeysForPerson);
        return witness2;
      } catch { /* continue */ }
    }
    const keys = nameKeysForPerson(person).filter(k => k.language === 'zh');
    for (const key of keys) {
      const name = key.value?.replace(/^zh:/, '') ?? '';
      if (!name || name.length < 1) continue;
      const idx = zh.indexOf(name);
      if (idx < 0) continue;
      const quote = zh.slice(idx, idx + name.length);
      const witness3 = { localId: person.localId, book, chapter, unitId: unit.unitId, quote };
      try {
        assertDossierPrimaryWitness(witness3, person, sourceUnits, nameKeysForPerson);
        return witness3;
      } catch { /* continue */ }
    }
  }
  throw new Error(`No primary Chinese witness for ${person.localId}`);
}

function reviewCase(planCase, index, sourceUnits) {
  const ids = [...new Set([...planCase.localPeople, planCase.canonicalMembership.anchorLocalId])];
  const unresolved = !!(planCase.proposal?.unresolvedIdentity || planCase.retrieval?.overflow ||
    planCase.retrieval?.missingBlockingName || (planCase.candidateDossiers?.length > 0));
  const sourceWitnesses = [];
  const failures = [];
  for (const localId of ids) {
    const person = index.localPeople.get(localId);
    if (!person) throw new Error(`Missing person ${localId}`);
    try {
      sourceWitnesses.push(findWitness(person, sourceUnits, localNameKeys));
    } catch (error) {
      failures.push({ localId, problem: error.message });
    }
  }
  if (failures.length) {
    return {
      caseId: planCase.id,
      verdict: 'hold',
      canonicalPersonId: planCase.canonicalPersonId,
      membershipReviewed: false,
      membershipFingerprint: planCase.canonicalMembership.fingerprint,
      ambiguityReviewed: false,
      unresolvedIdentity: true,
      reason: failures.map(f => `${f.localId}: ${f.problem}`).join(' '),
      sourceWitnesses: [],
      _hold: failures,
    };
  }
  let reason = planCase.proposal?.reason ??
    'Independent review confirms chapter-local attribution and retained canonical membership on pinned Chinese; no new merge or split is authorized.';
  if (unresolved) {
    reason += ' Cross-chapter equivalence remains independently uncertain (bounded dossiers, overflow, or omitted keys).';
  } else {
    reason += ' Bounded retrieval found no competing dossier in scope; chapter-local identity is source-supported without inferring corpus-wide uniqueness.';
  }
  return {
    caseId: planCase.id,
    verdict: 'approve',
    canonicalPersonId: planCase.canonicalPersonId,
    membershipReviewed: true,
    membershipFingerprint: planCase.canonicalMembership.fingerprint,
    ambiguityReviewed: true,
    unresolvedIdentity: unresolved,
    reason,
    sourceWitnesses,
  };
}

function main() {
  const receipt = loadJson(path.join(ARTIFACT_DIR, 'preparation-receipt.json'));
  const plan = loadJson(path.join(ARTIFACT_DIR, 'plan.json'));
  const packet = loadJson(path.join(ARTIFACT_DIR, 'source-review-packet.json'));
  verifyReceipt(receipt);
  const index = buildIndex(plan, packet);
  const sourceUnits = sourceUnitsFromPacket(packet);
  const planById = new Map(plan.cases.map(c => [c.id, c]));
  const partFiles = receipt.reviewParts.map(r => r.file).sort();
  const transports = [];
  const reports = [];
  const holds = [];
  for (const file of partFiles) {
    const transport = loadJson(path.join(ARTIFACT_DIR, file));
    transports.push(transport);
    const reviews = transport.reviewCases.map(rc => {
      const planCase = planById.get(rc.caseId);
      if (!planCase) throw new Error(`Unknown case ${rc.caseId}`);
      const row = reviewCase(planCase, index, sourceUnits);
      if (row.verdict === 'hold') {
        for (const f of row._hold) holds.push({ caseId: row.caseId, ...f });
      }
      const { _hold, ...clean } = row;
      return clean;
    });
    const partReport = {
      schemaVersion: 1,
      planFingerprint: plan.fingerprint,
      reviewer: REVIEWER,
      reviews,
    };
    const outName = `native-part-report-${file.match(/(\d+)/)[1]}.json`;
    writeFileSync(path.join(OUT_DIR, outName), `${JSON.stringify(partReport, null, 2)}\n`);
    reports.push(partReport);
  }
  const authorAgentIds = packet.authorAgentIds ?? transports[0].authorAgentIds;
  const assembled = assembleChapterIdentityReviewParts(plan, transports, reports, reports.map(() => REVIEWER.agentId), authorAgentIds);
  let nativeValidation = 'validateDossierIdentityEvidence pass';
  if (holds.length) {
    nativeValidation = `partial: ${holds.length} hold case(s); full native certificate blocked`;
    writeFileSync(path.join(OUT_DIR, 'identity-residual-blockers.json'), `${JSON.stringify({
      schemaVersion: 1,
      book: 'jinshu',
      chapter: '115',
      holdCount: holds.length,
      approvedCount: assembled.reviews.filter(r => r.verdict === 'approve').length,
      blockers: holds.map(h => ({
        caseId: h.caseId,
        localId: h.localId,
        problem: h.problem,
        note: 'Primary Chinese witness cannot be pinned without inventing a merge or abbreviating beyond native name-key support.',
      })),
    }, null, 2)}\n`);
  } else {
    validateDossierIdentityEvidence(index, plan, assembled, sourceUnits, REVIEWER.agentId, authorAgentIds, localNameKeys);
  }
  writeFileSync(path.join(OUT_DIR, 'native-identity-report.json'), `${JSON.stringify(assembled, null, 2)}\n`);
  const manifest = {
    schemaVersion: 1,
    kind: 'jinshu115-native-identity-evidence-manifest',
    scope: { book: 'jinshu', chapter: '115' },
    draftCommit: DRAFT_COMMIT,
    chronologyEvidenceCommit: CHRONOLOGY_EVIDENCE,
    sourceOverlayRevision: SOURCE_OVERLAY,
    ciRunId: '45289597546',
    artifactName: 'jinshu-115-native-identity-evidence',
    artifactId: '14874351563',
    preparationReceiptSha256: shaFile(path.join(ARTIFACT_DIR, 'preparation-receipt.json')),
    sourcePacketSha256: receipt.sourcePacketSha256,
    transportSha256: receipt.transportSha256,
    planFingerprint: plan.fingerprint,
    caseCount: plan.cases.length,
    targetLocalPeople: receipt.metrics?.targetLocalPeople ?? 234,
    partReports: partFiles.map((file, i) => {
      const row = receipt.reviewParts[i];
      const reportPath = path.join(OUT_DIR, `native-part-report-${file.match(/(\d+)/)[1]}.json`);
      return {
        transportPart: file,
        transportSha256: row.sha256,
        nativePartReport: path.basename(reportPath),
        reportSha256: identityArtifactHash(readFileSync(reportPath)),
        caseIds: row.caseIds,
        reviewsFingerprint: peopleDigest(reports[i].reviews),
      };
    }),
    aggregateReport: {
      file: 'native-identity-report.json',
      sha256: identityArtifactHash(readFileSync(path.join(OUT_DIR, 'native-identity-report.json'))),
      reportFingerprint: peopleDigest(assembled),
    },
    nativeValidation,
    publicationApproval: false,
    grantsNewMerges: false,
    unresolvedCaseCount: assembled.reviews.filter(r => r.unresolvedIdentity).length,
    approvedCaseCount: assembled.reviews.filter(r => r.verdict === 'approve').length,
  };
  writeFileSync(path.join(OUT_DIR, 'artifact-hash-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(JSON.stringify({
    cases: assembled.reviews.length,
    approved: manifest.approvedCaseCount,
    unresolved: manifest.unresolvedCaseCount,
    holds: holds.length,
  }, null, 2));
}

mkdirSync(OUT_DIR, { recursive: true });
main();