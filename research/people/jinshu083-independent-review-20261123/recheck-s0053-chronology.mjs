#!/usr/bin/env node
/**
 * Independent recheck: owner 2ccc2b14 hints-p026 + claim-212 (s0053).
 * Records native chronology verdict; refreshes chapter date audit when extraction pins match.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { sha256, writeJsonAtomic, PEOPLE_DIR } from '../../../scripts/lib/people-content.mjs';
import { buildDateAuditPacket, recordDateAudit } from '../../../scripts/lib/people-date-audit.mjs';
import { validateAppliedEditorialDecisions } from '../../../scripts/lib/people-editorial-decisions.mjs';
import { validateCompactPeopleExtraction } from '../../../scripts/validate-people-extraction.mjs';
import { buildPeopleExtractionPacket } from '../../../scripts/build-people-extraction-packet.mjs';
import { readJson } from '../../../scripts/lib/people-content.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const BOOK = 'jinshu';
const CHAPTER = '083';
const OWNER_DRAFT = '2ccc2b14cfd8ca498bc3a8b8a1f38d5b05c8db21';
const PRIOR_REVIEW = 'b5a53f9ba956bc69e3bde17211a5f659ba6afa72';

const REVIEWER = {
  kind: 'cursor-agent',
  name: 'Composer 2.5 (Jinshu 083 independent reviewer)',
  model: 'composer-2.5-fast',
  agentId: 'bc-d3bf973d-547f-4079-9663-0ac999f1c2b1',
  runId: null,
  completedAt: new Date().toISOString(),
};

function buildChapterDateAudit(packet) {
  const unitMap = new Map(packet.units.map((u) => [u.id, u]));
  const s0053 = unitMap.get('s0053');
  const recheckIds = new Set(['claim-212', 'hints-p026', 'claim-808']);
  const itemChecks = packet.items.filter((item) => recheckIds.has(item.id)).map((item) => {
    const unitId = item.evidence[0] ?? packet.units[0]?.id;
    const unit = unitMap.get(unitId);
    const quote =
      item.value?.sourceDate?.text && unit?.zh.includes(item.value.sourceDate.text)
        ? item.value.sourceDate.text
        : unit.zh.slice(0, 24);
    const event =
      typeof item.value?.event === 'string' && item.value.event.length >= 10
        ? item.value.event
        : `Chapter attestation or hint for ${item.personId} tied to ${item.value?.sourceDate?.text ?? 'context'}`;
    let reason =
      'Independent review accepts bounded years, qualitative chronology, or source-only contrast when they match owned Chinese; no geometry or reception errors on this pass.';
    if (item.id === 'claim-212') {
      reason =
        's0053 山賈諸公皆釋服從時 is a former-reign contrast inside Gu He’s memorial, not Shan Jia’s convertible career year. Native rules permit sourceDate plus qualitative (>=20 chars) without westernYear/Bounds; unresolved hold was correctly removed. Qualitative wording is supported.';
    }
    if (item.id === 'hints-p026') {
      reason =
        'Hint no longer asserts before AD 300; it documents source-only research context for s0053 with no falsified Western endpoint.';
    }
    if (item.id === 'claim-808') {
      return {
        id: item.id,
        verdict: 'research-blocked',
        event: 'Inferred intervening generation between Wu-era Che Jun and Che Yu without source year.',
        evidence: [{ unit: item.evidence[0], quote: unitMap.get(item.evidence[0]).zh.slice(0, 20) }],
        reason:
          'Pre-existing explicit unresolved hold on an inferred generation; not reopened in this s0053 recheck but blocks chapter-wide audited status until independently resolved.',
      };
    }
    return {
      id: item.id,
      verdict: 'supported',
      event,
      evidence: [{ unit: unitId, quote }],
      reason,
    };
  });

  const firstUnitByPerson = new Map();
  for (const item of packet.items) {
    if (!firstUnitByPerson.has(item.personId)) firstUnitByPerson.set(item.personId, item.evidence[0]);
  }
  const personChecks = packet.people.filter((p) => p.id === 'p026').map((person) => {
    const unitId = firstUnitByPerson.get(person.id) ?? 's0001';
    const unit = unitMap.get(unitId);
    const quote = unit.zh.slice(0, Math.min(16, unit.zh.length));
    let reason =
      'Person-level review found no invented dynasty-wide activity windows on this pass.';
    if (person.id === 'p026') {
      reason =
        'Shan Jia (p026) chronology for s0053 is qualitative source contrast only; active hint matches claim-212 without AD 300 invention.';
    }
    return {
      id: person.id,
      verdict: 'supported',
      reason,
      evidence: [{ unit: unitId, quote }],
    };
  });

  return {
    schemaVersion: 1,
    auditVersion: 1,
    book: BOOK,
    chapter: CHAPTER,
    sourceHash: packet.sourceHash,
    extractionHash: packet.extractionHash,
    status: 'needs-revision',
    reviewer: { name: REVIEWER.name, independentOfExtractor: true, agentId: REVIEWER.agentId },
    reviewedAt: REVIEWER.completedAt,
    summary:
      'Independent s0053 recheck after owner 2ccc2b14: claim-212/c0814 supported (sourceDate + qualitative contrast at s0053); hints-p026 supported without AD 300 echo. Chapter-wide audited status remains blocked by pre-existing claim-808 unresolved hold (not part of this delta). Editorial r0001–r0037 and local identity evidence preserved.',
    reviewedUnits: ['s0053'],
    itemChecks,
    personChecks,
    findings: [
      {
        items: ['claim-808'],
        problem:
          'Che lineage claim retains explicit unresolved:true on an inferred generation without a convertible source year.',
        action:
          'Independent date review must resolve or reclassify claim-808; this does not affect the supported s0053 Shan Jia contrast.',
      },
    ],
    references: [
      {
        kind: 'chapter',
        book: BOOK,
        chapter: CHAPTER,
        unit: 's0053',
        quote: '山賈諸公皆釋服從時',
        sourceHash: sha256(s0053.zh),
        reason:
          'Owned Chinese for claim-212/hints-p026 recheck; contrast phrase only, no personal regnal year for Shan Jia.',
      },
    ],
    scopeNotes: {
      ownerDraftCommit: OWNER_DRAFT,
      priorReviewCommit: PRIOR_REVIEW,
      deltaRechecked: ['claim-212', 'hints-p026', 'jinshu:083:c0814', 's0053'],
    },
  };
}

function chronologyRecheckReport(packet) {
  const unit = packet.units.find((u) => u.id === 's0053');
  return {
    schemaVersion: 1,
    kind: 'independent-s0053-chronology-recheck',
    book: BOOK,
    chapter: CHAPTER,
    ownerDraftCommit: OWNER_DRAFT,
    reviewer: REVIEWER,
    reviewedAt: REVIEWER.completedAt,
    sourceUnit: {
      id: 's0053',
      quote: '山賈諸公皆釋服從時',
      zh: unit.zh,
      sourceHash: sha256(unit.zh),
    },
    claim212: {
      packetItemId: 'claim-212',
      claimId: 'jinshu:083:c0814',
      nativeRules: [
        'Attestation may use sourceDate.text with qualitative chronology when no westernYear/Interval/Bounds (validate-people-extraction.mjs).',
        'undatedSourceAttestation is disallowed here because source bears temporal contrast wording.',
        'qualitative string must be substantive (>=20 characters).',
      ],
      verdict: 'supported',
      qualitativeAccepted:
        'Former-reign Western Jin ministers leaving mourning, cited as historical contrast inside Gu He’s memorial (昔先朝…山賈諸公皆釋服從時); no convertible personal career year for Shan Jia is stated.',
    },
    hintsP026: {
      verdict: 'supported',
      after:
        'research required: Shan Jia cited only as 山賈諸公皆釋服從時 historical contrast in Gu He memorial (s0053); no convertible personal career year in owned units',
    },
    nativeChronologyResult: {
      s0053Claim212: 'supported',
      hintsP026: 'supported',
      chapterDateAudit: 'needs-revision',
      chapterBlocker: 'claim-808 unresolved hold (pre-existing)',
    },
    canonicalIdentityDependency: {
      certified: false,
      requires: [
        'PEOPLE_LOOKUP_TOKEN',
        'pinned registry snapshots/cb756c508e0265caad63cdac5c50b49c06d4ca2d2d19bb6e1ef9bde48db40aac',
      ],
      note: 'Chronology audit does not certify Yuan Gui same-person cluster or chapter-wide canonical memberships.',
    },
    preserved: {
      editorial: 'data/people/editorial-decisions/jinshu/083.json schema v4 r0001–r0037',
      localIdentity: 'same-person p036/p037/p070/p168 unchanged',
    },
  };
}

function main() {
  const packet = buildPeopleExtractionPacket(BOOK, CHAPTER);
  const stored = readJson(path.join(PEOPLE_DIR, 'extractions', BOOK, `${CHAPTER}.json`));
  const extraction = validateCompactPeopleExtraction(stored, packet).normalized;
  const editorial = readJson(path.join(PEOPLE_DIR, 'editorial-decisions', BOOK, `${CHAPTER}.json`));
  validateAppliedEditorialDecisions(editorial, extraction);

  const auditPacket = buildDateAuditPacket(BOOK, CHAPTER);
  const dateReport = buildChapterDateAudit(auditPacket);
  recordDateAudit(dateReport);

  const recheck = chronologyRecheckReport(auditPacket);
  writeJsonAtomic(path.join(ROOT, 'independent-chronology-s0053-recheck.json'), recheck);

  const consolidated = {
    schemaVersion: 1,
    kind: 'jinshu083-independent-s0053-hint-recheck',
    ownerDraftCommit: OWNER_DRAFT,
    reviewer: REVIEWER,
    completedAt: REVIEWER.completedAt,
    chronology: {
      s0053: { claim212: 'supported', hintsP026: 'supported' },
      chapterNativeResult: 'needs-revision',
      chapterBlocker: 'claim-808',
    },
    canonicalIdentityDependency: recheck.canonicalIdentityDependency,
    artifacts: [
      'research/people/jinshu083-independent-review-20261123/independent-chronology-s0053-recheck.json',
      'data/people/date-audits/jinshu/083.json',
    ],
  };
  writeJsonAtomic(path.join(ROOT, 'consolidated-review-s0053-recheck.json'), consolidated);

  const extractionVal = spawnSync(
    'node',
    ['scripts/validate-people-extraction.mjs', 'data/people/extractions/jinshu/083.json'],
    { encoding: 'utf8' },
  );
  const peopleVal = spawnSync('npm', ['run', 'people:validate', '--', '--book', BOOK, '--chapter', CHAPTER], {
    encoding: 'utf8',
  });
  const datesVerify = spawnSync('npm', ['run', 'people:dates:verify', '--', '--book', BOOK, '--chapter', CHAPTER], {
    encoding: 'utf8',
  });

  fs.writeFileSync(
    path.join(ROOT, 'native-proof-s0053-recheck.txt'),
    [extractionVal.stdout, peopleVal.stdout, datesVerify.stdout].join('\n'),
  );

  console.log(
    JSON.stringify(
      {
        datesVerify: datesVerify.stdout,
        claim212: 'supported',
        hintsP026: 'supported',
        chapterStatus: 'needs-revision',
      },
      null,
      2,
    ),
  );
}

main();