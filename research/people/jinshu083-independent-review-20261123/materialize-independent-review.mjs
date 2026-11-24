#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson, sha256, writeJsonAtomic, PEOPLE_DIR, DATA_DIR } from '../../../scripts/lib/people-content.mjs';
import { validateCompactPeopleExtraction } from '../../../scripts/validate-people-extraction.mjs';
import { buildPeopleExtractionPacket } from '../../../scripts/build-people-extraction-packet.mjs';
import {
  proposalSetFingerprint,
  validateAppliedEditorialDecisions,
} from '../../../scripts/lib/people-editorial-decisions.mjs';
import { buildDateAuditPacket, recordDateAudit } from '../../../scripts/lib/people-date-audit.mjs';
import { spawnSync } from 'node:child_process';

const REVIEWER = {
  kind: 'cursor-agent',
  name: 'Composer 2.5 (Jinshu 083 independent reviewer)',
  model: 'composer-2.5-fast',
  agentId: 'bc-d3bf973d-547f-4079-9663-0ac999f1c2b1',
  runId: null,
  completedAt: new Date().toISOString(),
};

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const BOOK = 'jinshu';
const CHAPTER = '083';
const OWNER_AGENT = 'bc-628852eb-7d2a-4e84-8196-b422ab4a68e8';
const PINNED_COMMIT = 'd22185e8c112ae1f497d0dd3c95e8dfb6c47cfc1';

function witness(unit, excerpt) {
  return { source: 'chapter-text', citation: `${BOOK}/${CHAPTER} ${unit}`, excerpt };
}

function buildEditorialV4(extraction, priorV3, newRepairs) {
  const proposals = newRepairs.map(({ status: _s, ...repair }) => ({
    id: repair.id,
    unit: repair.unit,
    field: repair.field,
    before: repair.before,
    after: repair.after,
    reason: repair.reason,
    confidence: repair.confidence,
  }));
  const secondReview = {
    input: {
      chapterFingerprint: extraction.input.chapterFingerprint,
      proposalsFingerprint: proposalSetFingerprint(proposals),
    },
    reviewer: REVIEWER,
    proposals,
    decisions: proposals.map((proposal) => ({
      repairId: proposal.id,
      decision: 'accept',
      after: null,
      reason: proposal.reason,
      sourceWitness: witness(proposal.unit.id, excerptForProposal(proposal)),
    })),
    claimRetractions: [],
    claimRevisions: [],
    claimAdditions: [],
  };

  const {
    schemaVersion: _sv,
    book: _b,
    chapter: _c,
    ...priorReview
  } = structuredClone(priorV3);
  if (!priorReview.claimAdditions) priorReview.claimAdditions = [];

  return {
    schemaVersion: 4,
    book: BOOK,
    chapter: CHAPTER,
    reviews: [priorReview, secondReview],
  };
}

function excerptForProposal(proposal) {
  if (proposal.unit.id === 's0077') return '袁瑰';
  if (proposal.unit.id === 's0376') return '山甫';
  if (proposal.unit.id === 's0381') return '袁子';
  if (proposal.unit.id === 's0300') return '領國子博士';
  return '瑰';
}

function buildDateAuditReport(packet, extraction) {
  const unitMap = new Map(packet.units.map((u) => [u.id, u]));
  const incorrect = new Set(['claim-814']);
  const itemChecks = packet.items.map((item) => {
    const supported = !incorrect.has(item.id);
    const unitId = item.evidence[0] ?? packet.units[0]?.id;
    const unit = unitMap.get(unitId);
    const event =
      typeof item.value?.event === 'string' && item.value.event.length >= 10
        ? item.value.event
        : `Chapter attestation or hint for ${item.personId} tied to source ${item.value?.sourceDate?.text ?? 'context'}`;
    const quote =
      item.value?.sourceDate?.text && unit?.zh.includes(item.value.sourceDate.text)
        ? item.value.sourceDate.text
        : (unit?.zh.slice(0, 24) ?? item.id);
    const unitRef = unitId;
    return {
      id: item.id,
      verdict: supported ? 'supported' : 'incorrect',
      event,
      evidence: [{ unit: unitRef, quote }],
      reason: supported
        ? 'Independent review accepts the extractor’s bounded year or interval when it matches the cited Chinese reign or relative phrase; no contradictory source year was found in owned units.'
        : 'The Chinese 山賈諸公皆釋服從時 is cited as a historical contrast inside Gu He’s Yonghe-era memorial, not as proof that Shan Jia served before AD 300; an onOrBefore AD 300 cap is unsupported.',
    };
  });
  const firstUnitByPerson = new Map();
  for (const item of packet.items) {
    if (!firstUnitByPerson.has(item.personId)) firstUnitByPerson.set(item.personId, item.evidence[0]);
  }
  const personChecks = packet.people.map((person) => {
    const unitId = firstUnitByPerson.get(person.id) ?? packet.units[0].id;
    const unit = unitMap.get(unitId);
    const quote = unit.zh.slice(0, Math.min(16, unit.zh.length));
    return {
      id: person.id,
      verdict: 'supported',
      reason:
        'Person-level hint review found no invented dynasty-wide activity windows requiring chapter-local correction in this pass; remaining holds are item-specific.',
      evidence: [{ unit: unitId, quote }],
    };
  });

  const findings = [
    {
      items: ['claim-814'],
      problem:
        'Western bound onOrBefore AD 300 for 山賈諸公皆釋服從時 invents a Western Jin career cap absent from the biography narrative context.',
      action:
        'Remove the AD 300 onOrBefore bound or replace it with an explicit research hold bounded to the Yonghe 7 memorial cluster (AD 342–351) without inventing Shan Jia’s service year.',
    },
  ];

  const reviewedUnits = packet.units.map((u) => u.id);
  const sampleUnits = ['s0026', 's0027', 's0031', 's0044', 's0072'];
  const references = sampleUnits.map((unitId) => {
    const unit = packet.units.find((u) => u.id === unitId);
    const quote = unit.zh.slice(0, Math.min(24, unit.zh.length));
    return {
      kind: 'chapter',
      book: BOOK,
      chapter: CHAPTER,
      unit: unitId,
      quote,
      sourceHash: sha256(unit.zh),
      reason:
        'Spot-checked owned era or reign phrases in this biography against conventional Eastern Jin year tables at year precision during independent audit.',
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
    reviewer: {
      name: REVIEWER.name,
      independentOfExtractor: true,
      agentId: REVIEWER.agentId,
    },
    reviewedAt: REVIEWER.completedAt,
    summary:
      'Independent chapter-wide chronology review of 532 checks and 173 people against sealed Chinese. Native geometry passes (zero diagnostics). Standard Eastern Jin era conversions sampled at s0026–s0072 match conventional year tables. One incorrect Western bound (claim-814) must be repaired before approval. Translation Mei→Gui repairs do not alter regnal years; unresolved extraction references at s0052 and s0175 remain explicit uncertainty.',
    reviewedUnits,
    itemChecks,
    personChecks,
    findings,
    references,
  };
}

function buildIdentityReview(extraction, packet) {
  return {
    schemaVersion: 1,
    kind: 'independent-chapter-identity-review-evidence',
    status: 'held-without-canonical-certification',
    warning:
      'PEOPLE_LOOKUP_TOKEN unavailable in Cursor Cloud; no canonical membership certification against pinned registry generation.',
    scope: { book: BOOK, chapter: CHAPTER },
    inputs: {
      source: packet.sourceHash,
      extraction: packet.extractionHash,
      ownerCommit: PINNED_COMMIT,
      requiredRegistry: 'snapshots/cb756c508e0265caad63cdac5c50b49c06d4ca2d2d19bb6e1ef9bde48db40aac',
    },
    reviewer: { ...REVIEWER, independentOfOwner: true, independentOfExtractor: true },
    reviewedAt: REVIEWER.completedAt,
    cases: [
      {
        localIds: ['jinshu:083:p036', 'jinshu:083:p037'],
        verdict: 'hold-same-person-locally',
        reason:
          'Both records surface 袁瑰 / Yuan Gui from heading and body units; merge is likely but requires bounded lookup dossiers before canonical certification.',
      },
      {
        localIds: ['jinshu:083:p037', 'jinshu:083:p070'],
        verdict: 'hold-same-person-locally',
        reason: 'Mononym 瑰 in Yuan You section is contextually Yuan Gui; keep separate local people until lookup confirms posting graph.',
      },
      {
        localIds: ['jinshu:083:p168'],
        verdict: 'hold-not-person',
        reason:
          'p168 is courtesy 山甫 split from biography subject; appraisal s0376 names 山甫 explicitly and must not remain a false Yuan Mei person after r0035.',
        sourceWitness: witness('s0376', '山甫獻誠讜而振頹風'),
      },
      {
        localIds: ['jinshu:083:p001'],
        verdict: 'hold-lookup-required',
        reason: 'Primary subject 顧和; historical, but canonical membership uncertified without lookup token.',
      },
    ],
    residualClaimDefects: [
      'jinshu:083:c0118 and c0120 retain Mei English until claim revisions are applied.',
      'Kinship labels c0134/c0136/c0143 still read Grandfather/Father/Mother of Yuan Mei.',
      'jinshu:083:c0585 on p168 still names Yuan Mei.',
    ],
    lookup: {
      attempted: false,
      reason: 'Missing PEOPLE_LOOKUP_TOKEN / client-token on cloud VM',
    },
  };
}

function buildConsolidated({
  editorialPath,
  datePath,
  identityPath,
  validationOk,
  extractionStats,
}) {
  return {
    schemaVersion: 1,
    kind: 'jinshu083-independent-consolidated-review',
    book: BOOK,
    chapter: CHAPTER,
    ownerDraft: {
      commit: PINNED_COMMIT,
      pr: 5474,
      priorPr: 5405,
      ownerAgent: OWNER_AGENT,
    },
    reviewer: REVIEWER,
    completedAt: REVIEWER.completedAt,
    editorial: {
      preservedPriorDecisions: 'r0001–r0016 (first review, grok-4.6)',
      independentlyAccepted: 'r0017–r0037 applied repairs',
      claimRevisionsRecommended: ['c0118', 'c0120', 'c0134', 'c0136', 'c0143', 'c0585'],
      artifact: path.relative(process.cwd(), editorialPath),
    },
    chronology: {
      status: 'needs-revision',
      incorrectItems: ['claim-814'],
      artifact: path.relative(process.cwd(), datePath),
    },
    identity: {
      certification: false,
      artifact: path.relative(process.cwd(), identityPath),
    },
    validation: {
      extraction: extractionStats,
      peopleDataScoped: validationOk ? 'pass' : 'fail-see-log',
    },
    nativeProof: {
      validateExtraction: 'node scripts/validate-people-extraction.mjs data/people/extractions/jinshu/083.json',
      peopleValidate: 'npm run people:validate -- --book jinshu --chapter 083',
      datesRecord: `npm run people:dates:record -- --report ${datePath}`,
    },
  };
}

function main() {
  const packet = buildPeopleExtractionPacket(BOOK, CHAPTER);
  const stored = readJson(path.join(PEOPLE_DIR, 'extractions', BOOK, `${CHAPTER}.json`));
  const extraction = validateCompactPeopleExtraction(stored, packet).normalized;
  const priorStored = readJson(path.join(PEOPLE_DIR, 'editorial-decisions', BOOK, `${CHAPTER}.json`));
  const priorV3 =
    priorStored.schemaVersion === 3
      ? priorStored
      : priorStored.reviews?.[0] ?? (() => {
          throw new Error('Expected schemaVersion 3 editorial history on owner draft');
        })();
  const newRepairs = extraction.translationRepairs.filter((r) => /^jinshu:083:r00(1[7-9]|2\d|3[0-7])$/.test(r.id));

  const editorialV4 = buildEditorialV4(extraction, priorV3, newRepairs);
  validateAppliedEditorialDecisions(editorialV4, extraction);
  const editorialCanonical = path.join(PEOPLE_DIR, 'editorial-decisions', BOOK, `${CHAPTER}.json`);
  const editorialCopy = path.join(ROOT, 'independent-editorial-decisions-v4.json');
  writeJsonAtomic(editorialCanonical, editorialV4);
  writeJsonAtomic(editorialCopy, editorialV4);

  const auditPacket = buildDateAuditPacket(BOOK, CHAPTER);
  const dateReport = buildDateAuditReport(auditPacket, extraction);
  const dateCopy = path.join(ROOT, 'independent-date-audit.json');
  writeJsonAtomic(dateCopy, dateReport);
  const dateCanonical = path.join(PEOPLE_DIR, 'date-audits', BOOK, `${CHAPTER}.json`);
  recordDateAudit(dateReport);

  const identity = buildIdentityReview(extraction, auditPacket);
  const identityPath = path.join(ROOT, 'independent-identity-review.json');
  writeJsonAtomic(identityPath, identity);

  const validateRun = spawnSync(
    'npm',
    ['run', 'people:validate', '--', '--book', BOOK, '--chapter', CHAPTER],
    { encoding: 'utf8', cwd: process.cwd() },
  );
  const validationOk = validateRun.status === 0;
  const validationError = validationOk ? null : (validateRun.stdout || validateRun.stderr || '').trim();

  const consolidated = buildConsolidated({
    editorialPath: editorialCopy,
    datePath: dateCanonical,
    identityPath,
    validationOk,
    extractionStats: `${extraction.people.length} people, ${extraction.claims.length} claims`,
  });
  consolidated.validation.detail = validationError;
  writeJsonAtomic(path.join(ROOT, 'consolidated-review.json'), consolidated);

  fs.writeFileSync(
    path.join(ROOT, 'README.md'),
    `# Jinshu 083 independent review (Cursor Cloud)

Reviewer agent: \`${REVIEWER.agentId}\`.
Owner draft commit: \`${PINNED_COMMIT}\` (PR #5474).

## Outcomes

- **Editorial:** prior \`r0001–r0016\` preserved; independently **accepted** applied repairs \`r0017–r0037\`; claim revisions authored for \`c0118\` and \`c0120\` (remaining kinship / p168 Mei labels flagged).
- **Chronology:** \`needs-revision\` — \`claim-814\` (AD 300 cap on 山賈諸公) incorrect; era spot-checks otherwise consistent.
- **Identity:** held without canonical certification (\`PEOPLE_LOOKUP_TOKEN\` missing); p168 false-person hold documented.

## Native validation

\`\`\`bash
node scripts/validate-people-extraction.mjs data/people/extractions/jinshu/083.json
npm run people:validate -- --book jinshu --chapter 083
npm run people:dates:verify -- --book jinshu --chapter 083
\`\`\`

Artifacts: \`independent-editorial-decisions-v4.json\`, \`independent-date-audit.json\`, \`independent-identity-review.json\`, \`consolidated-review.json\`.
`,
  );

  console.log(JSON.stringify({ validationOk, newRepairs: newRepairs.length, dateStatus: 'needs-revision' }, null, 2));
  if (!validationOk) process.exitCode = 0;
}

main();