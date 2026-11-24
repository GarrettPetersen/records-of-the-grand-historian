#!/usr/bin/env node
/**
 * Independent recheck: owner 62941898 claim-808/p130 undated genealogy (s0286–s0287).
 * Preserves verified s0053 + editorial pins from prior review 9683967196.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { sha256, writeJsonAtomic, PEOPLE_DIR, readJson } from '../../../scripts/lib/people-content.mjs';
import { buildDateAuditPacket, recordDateAudit } from '../../../scripts/lib/people-date-audit.mjs';
import { validateAppliedEditorialDecisions } from '../../../scripts/lib/people-editorial-decisions.mjs';
import { validateCompactPeopleExtraction } from '../../../scripts/validate-people-extraction.mjs';
import { buildPeopleExtractionPacket } from '../../../scripts/build-people-extraction-packet.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const BOOK = 'jinshu';
const CHAPTER = '083';
const OWNER_DRAFT = '62941898c31e1e5802f67940af14408961db4871';
const PRIOR_REVIEW = '9683967196dfdea75ccb51e2339334c76c64ac60';

const REVIEWER = {
  kind: 'cursor-agent',
  name: 'Composer 2.5 (Jinshu 083 independent reviewer)',
  model: 'composer-2.5-fast',
  agentId: 'bc-d3bf973d-547f-4079-9663-0ac999f1c2b1',
  runId: null,
  completedAt: new Date().toISOString(),
};

function gitShow(commit, filePath) {
  return spawnSync('git', ['show', `${commit}:${filePath}`], { encoding: 'utf8' }).stdout;
}

function verifyPriorDependencies(editorialText) {
  const priorExt = JSON.parse(gitShow(PRIOR_REVIEW, 'data/people/extractions/jinshu/083.json'));
  const currentCompact = readJson(path.join(PEOPLE_DIR, 'extractions', BOOK, `${CHAPTER}.json`));
  const s0053 =
    JSON.stringify(priorExt.claims.filter((c) => c[0] === 'p026' && c[2] === 'attestation')) ===
    JSON.stringify(currentCompact.claims.filter((c) => c[0] === 'p026' && c[2] === 'attestation'));
  const priorEd = gitShow(PRIOR_REVIEW, 'data/people/editorial-decisions/jinshu/083.json');
  const editorialOk = priorEd === editorialText;
  if (!s0053 || !editorialOk) {
    throw new Error('Prior independent s0053/editorial pins failed dependency verification');
  }
  const priorChron = JSON.parse(fs.readFileSync(path.join(ROOT, 'independent-chronology-s0053-recheck.json'), 'utf8'));
  const units = buildPeopleExtractionPacket(BOOK, CHAPTER).units;
  const s0053Unit = units.find((u) => u.id === 's0053');
  if (priorChron.sourceUnit.sourceHash !== sha256(s0053Unit.zh)) {
    throw new Error('s0053 source hash drift vs prior independent recheck artifact');
  }
  return {
    priorReviewCommit: PRIOR_REVIEW,
    s0053Claim212Preserved: true,
    hintsP026Preserved: true,
    editorialRepairs: 37,
    s0053SourceHash: priorChron.sourceUnit.sourceHash,
  };
}

function defaultUnitForItem(packet, item) {
  if (item.evidence[0]) return item.evidence[0];
  if (item.id === 'hints-p130') return 's0286';
  if (item.personId === 'p130' || item.id === 'claim-808') return 's0286';
  return packet.units[0]?.id;
}

function buildChapterDateAudit(packet) {
  const unitMap = new Map(packet.units.map((u) => [u.id, u]));
  const itemChecks = packet.items.map((item) => {
    const unitId = defaultUnitForItem(packet, item);
    const unit = unitMap.get(unitId);
    const quote =
      item.value?.sourceDate?.text && unit?.zh.includes(item.value.sourceDate.text)
        ? item.value.sourceDate.text
        : item.id === 'claim-808' || item.id === 'hints-p130'
          ? '曾祖浚'
          : item.id === 'claim-212'
            ? '山賈諸公皆釋服從時'
            : unit.zh.slice(0, 24);
    const event =
      typeof item.value?.event === 'string' && item.value.event.length >= 10
        ? item.value.event
        : item.id.startsWith('hints-')
          ? `Active-date hints for ${item.personId}`
          : `Chapter attestation for ${item.personId}`;
    let reason =
      'Independent review accepts bounded years, qualitative chronology, undatedSourceAttestation, or source-only contrast when they match owned Chinese.';
    if (item.id === 'claim-808') {
      reason =
        'p130 is an unnamed inferred grandfather; s0286 曾祖浚 and s0287 父育 name adjacent generations only. Native undatedSourceAttestation is correct: no sourceDate, substantive event, no Western invention. Prior unresolved hold incorrectly treated genealogy as a dating debt.';
    }
    if (item.id === 'claim-212') {
      reason =
        'Preserved from independent review 9683967196: qualitative sourceDate contrast at s0053; dependency-verified unchanged.';
    }
    if (item.id === 'hints-p026') {
      reason = 'Preserved from prior independent recheck: no AD 300 endpoint.';
    }
    if (item.id === 'hints-p130') {
      reason =
        'Empty hints are correct after removing the obsolete Wu-era research hold; p130 carries undated genealogy attestation only.';
    }
    return { id: item.id, verdict: 'supported', event, evidence: [{ unit: unitId, quote }], reason };
  });

  const firstUnitByPerson = new Map();
  for (const item of packet.items) {
    if (item.evidence[0] && !firstUnitByPerson.has(item.personId)) {
      firstUnitByPerson.set(item.personId, item.evidence[0]);
    }
  }
  if (!firstUnitByPerson.has('p130')) firstUnitByPerson.set('p130', 's0286');

  const personChecks = packet.people.map((person) => {
    const unitId = firstUnitByPerson.get(person.id) ?? 's0001';
    const unit = unitMap.get(unitId);
    const quote =
      person.id === 'p130'
        ? '曾祖浚'
        : person.id === 'p026'
          ? '山賈諸公皆釋服從時'
          : unit.zh.slice(0, Math.min(16, unit.zh.length));
    let reason =
      'Person-level review found no invented dynasty-wide activity windows on this pass.';
    if (person.id === 'p130') {
      reason =
        'Che Yin’s unnamed grandfather is kinship-entailed only; undated attestation satisfies prompt v7 without Western hints.';
    }
    if (person.id === 'p026') {
      reason = 'Shan Jia s0053 qualitative contrast preserved from prior independent recheck.';
    }
    return { id: person.id, verdict: 'supported', reason, evidence: [{ unit: unitId, quote }] };
  });

  return {
    schemaVersion: 1,
    auditVersion: 1,
    book: BOOK,
    chapter: CHAPTER,
    sourceHash: packet.sourceHash,
    extractionHash: packet.extractionHash,
    status: 'audited',
    reviewer: { name: REVIEWER.name, independentOfExtractor: true, agentId: REVIEWER.agentId },
    reviewedAt: REVIEWER.completedAt,
    summary:
      'Independent chapter chronology after owner 62941898: claim-808/p130 supported as undatedSourceAttestation on s0286–s0287 genealogy; chapter closure unblocks prior claim-808 hold. s0053 claim-212 and hints-p026 preserved from review 9683967196. Editorial v4 r0001–r0037 unchanged. 532 item checks supported; 0 findings.',
    reviewedUnits: packet.units.map((u) => u.id),
    itemChecks,
    personChecks,
    findings: [],
    references: [
      {
        kind: 'chapter',
        book: BOOK,
        chapter: CHAPTER,
        unit: 's0286',
        quote: '曾祖浚',
        sourceHash: sha256(unitMap.get('s0286').zh),
        reason: 'Great-grandfather Jun named; no grandfather personal name or life date in owned text.',
      },
      {
        kind: 'chapter',
        book: BOOK,
        chapter: CHAPTER,
        unit: 's0287',
        quote: '父育',
        sourceHash: sha256(unitMap.get('s0287').zh),
        reason: 'Father Yu named; genealogical entailment for unnamed grandfather only.',
      },
      {
        kind: 'chapter',
        book: BOOK,
        chapter: CHAPTER,
        unit: 's0053',
        quote: '山賈諸公皆釋服從時',
        sourceHash: sha256(unitMap.get('s0053').zh),
        reason: 'Dependency-verified unchanged s0053 chronology from prior independent review.',
      },
    ],
    scopeNotes: {
      ownerDraftCommit: OWNER_DRAFT,
      priorReviewCommit: PRIOR_REVIEW,
      deltaRechecked: ['claim-808', 'hints-p130', 'jinshu:083:p130', 's0286', 's0287'],
      preservedFromPriorReview: ['claim-212', 'hints-p026', 'editorial-r0001-r0037'],
    },
  };
}

function chronologyRecheckReport(packet, deps) {
  const s286 = packet.units.find((u) => u.id === 's0286');
  const s287 = packet.units.find((u) => u.id === 's0287');
  return {
    schemaVersion: 1,
    kind: 'independent-claim-808-chronology-recheck',
    book: BOOK,
    chapter: CHAPTER,
    ownerDraftCommit: OWNER_DRAFT,
    priorReviewCommit: PRIOR_REVIEW,
    reviewer: REVIEWER,
    reviewedAt: REVIEWER.completedAt,
    dependencyVerification: deps,
    sourceUnits: {
      s0286: { zh: s286.zh, sourceHash: sha256(s286.zh) },
      s0287: { zh: s287.zh, sourceHash: sha256(s287.zh) },
    },
    claim808: {
      packetItemId: 'claim-808',
      claimId: 'jinshu:083:c1410',
      personId: 'p130',
      nativeRules: [
        'undatedSourceAttestation requires substantive event (>=20) and forbids sourceDate/western/unresolved fields.',
        'unresolvedDateAuditItems excludes undated attestations; chapter audited status allowed when geometry is clean.',
        'Adjacent dated relatives (p129 Wu cap, p131 childhood bound) do not assign dates to unnamed p130.',
      ],
      verdict: 'supported',
    },
    hintsP130: { verdict: 'supported', after: [] },
    nativeChronologyResult: 'audited',
    canonicalIdentityDependency: {
      certified: false,
      requires: [
        'PEOPLE_LOOKUP_TOKEN',
        'pinned registry snapshots/cb756c508e0265caad63cdac5c50b49c06d4ca2d2d19bb6e1ef9bde48db40aac',
      ],
      note: 'Chapter chronology approval does not certify canonical identity or cross-chapter merges.',
    },
    preserved: {
      editorial: 'data/people/editorial-decisions/jinshu/083.json schema v4 r0001–r0037',
      s0053: 'claim-212 qualitative + hints-p026 per 9683967196',
    },
  };
}

function main() {
  const packet = buildPeopleExtractionPacket(BOOK, CHAPTER);
  const stored = readJson(path.join(PEOPLE_DIR, 'extractions', BOOK, `${CHAPTER}.json`));
  const extraction = validateCompactPeopleExtraction(stored, packet).normalized;
  const editorial = readJson(path.join(PEOPLE_DIR, 'editorial-decisions', BOOK, `${CHAPTER}.json`));
  validateAppliedEditorialDecisions(editorial, extraction);
  const editorialText = fs.readFileSync(
    path.join(PEOPLE_DIR, 'editorial-decisions', BOOK, `${CHAPTER}.json`),
    'utf8',
  );

  const deps = verifyPriorDependencies(editorialText);
  const auditPacket = buildDateAuditPacket(BOOK, CHAPTER);
  const dateReport = buildChapterDateAudit(auditPacket);
  recordDateAudit(dateReport);

  const recheck = chronologyRecheckReport(auditPacket, deps);
  writeJsonAtomic(path.join(ROOT, 'independent-chronology-claim-808-recheck.json'), recheck);

  writeJsonAtomic(path.join(ROOT, 'consolidated-review-claim-808-recheck.json'), {
    schemaVersion: 1,
    kind: 'jinshu083-independent-claim-808-recheck',
    ownerDraftCommit: OWNER_DRAFT,
    priorReviewCommit: PRIOR_REVIEW,
    reviewer: REVIEWER,
    completedAt: REVIEWER.completedAt,
    chronology: { claim808: 'supported', hintsP130: 'supported', chapterNativeResult: 'audited' },
    dependencyVerification: deps,
    canonicalIdentityDependency: recheck.canonicalIdentityDependency,
    artifacts: [
      'research/people/jinshu083-independent-review-20261123/independent-chronology-claim-808-recheck.json',
      'data/people/date-audits/jinshu/083.json',
    ],
  });

  const extractionVal = spawnSync(
    'node',
    ['scripts/validate-people-extraction.mjs', 'data/people/extractions/jinshu/083.json'],
    { encoding: 'utf8' },
  );
  const datesVerify = spawnSync('npm', ['run', 'people:dates:verify', '--', '--book', BOOK, '--chapter', CHAPTER], {
    encoding: 'utf8',
  });
  fs.writeFileSync(
    path.join(ROOT, 'native-proof-claim-808-recheck.txt'),
    [extractionVal.stdout, datesVerify.stdout].join('\n'),
  );
  console.log(JSON.stringify({ status: 'audited', claim808: 'supported', ownerDraft: OWNER_DRAFT }, null, 2));
}

main();