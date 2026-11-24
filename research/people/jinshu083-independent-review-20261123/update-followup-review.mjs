#!/usr/bin/env node
/**
 * Independent follow-up on owner draft 1d31857750 (PR #5474) after review fede91fee4 (#5480).
 * Rechecks delta only: c0814/claim-212, Mei/Gui claims, local same-person links.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { readJson, sha256, writeJsonAtomic, PEOPLE_DIR } from '../../../scripts/lib/people-content.mjs';
import { buildDateAuditPacket, recordDateAudit } from '../../../scripts/lib/people-date-audit.mjs';
import { validateCompactPeopleExtraction } from '../../../scripts/validate-people-extraction.mjs';
import { buildPeopleExtractionPacket } from '../../../scripts/build-people-extraction-packet.mjs';
import { validateAppliedEditorialDecisions } from '../../../scripts/lib/people-editorial-decisions.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const BOOK = 'jinshu';
const CHAPTER = '083';
const OWNER_COMMIT = '1d31857750bb6c3f6110885228614fa103793462';
const PRIOR_REVIEW = 'fede91fee456bc69e3bde17211a5f659ba6afa72';

const REVIEWER = {
  kind: 'cursor-agent',
  name: 'Composer 2.5 (Jinshu 083 independent reviewer)',
  model: 'composer-2.5-fast',
  agentId: 'bc-d3bf973d-547f-4079-9663-0ac999f1c2b1',
  runId: null,
  completedAt: new Date().toISOString(),
};

function witness(unit, excerpt) {
  return { source: 'chapter-text', citation: `${BOOK}/${CHAPTER} ${unit}`, excerpt };
}

function buildFollowupDateAudit(packet) {
  const unitMap = new Map(packet.units.map((u) => [u.id, u]));
  const recheckIds = new Set(['claim-212', 'hints-p026', 'claim-169']);
  const itemChecks = packet.items
    .filter((item) => recheckIds.has(item.id))
    .map((item) => {
      const unitId = item.evidence[0] ?? 's0053';
      const unit = unitMap.get(unitId);
      const quote =
        item.value?.sourceDate?.text && unit?.zh.includes(item.value.sourceDate.text)
          ? item.value.sourceDate.text
          : unit.zh.slice(0, 24);
      if (item.id === 'claim-212') {
        return {
          id: item.id,
          verdict: 'supported',
          event:
            'Historical contrast 山賈諸公皆釋服從時 inside Gu He’s memorial; Shan Jia is not given a Western Jin career endpoint.',
          evidence: [{ unit: 's0053', quote: '山賈諸公皆釋服從時' }],
          reason:
            'Native rules allow sourceDate plus unresolved:true without westernBounds when no convertible year is stated. Removing the unsupported onOrBefore AD 300 cap fixes the prior contradiction; this is a grounded undated reference, not a blocking date error.',
        };
      }
      if (item.id === 'hints-p026') {
        return {
          id: item.id,
          verdict: 'research-blocked',
          event:
            'Active-date hint for p026 (Shan Jia) still echoes the retired AD 300 cap language while claim-212 is correctly held.',
          evidence: [{ unit: 's0053', quote: '山賈諸公皆釋服從時' }],
          reason:
            'The hint text “before AD 300” must not remain as living chronology after the claim hold; retain an explicit research flag without reintroducing the falsified endpoint.',
        };
      }
      return {
        id: item.id,
        verdict: 'supported',
        event: 'Retrospective reception of earlier ministers leaving mourning during Gu He’s argument.',
        evidence: [{ unit: 's0053', quote: '昔先朝政道休明' }],
        reason:
          'claim-169 correctly marks retrospective reference separate from Shan Jia’s own life dating; unchanged from prior acceptable extraction geometry.',
      };
    });

  const personChecks = ['p026', 'p036', 'p037', 'p070', 'p168'].map((pid) => {
    const unitId =
      pid === 'p026' ? 's0053' : pid === 'p036' ? 's0076' : pid === 'p037' ? 's0077' : pid === 'p070' ? 's0154' : 's0376';
    const unit = unitMap.get(unitId);
    const quote = unit.zh.slice(0, Math.min(20, unit.zh.length));
    const verdict = pid === 'p026' ? 'research-blocked' : 'supported';
    const reason =
      pid === 'p026'
        ? 'Person-level hints still reference the retired AD 300 cap; claims are held correctly but hints need host cleanup before chronology approval.'
        : pid === 'p036' || pid === 'p037'
          ? '袁瑰 / Yuan Gui heading and body records align; chapter-local same-person link to p037 is source-grounded.'
          : pid === 'p070'
            ? 'Mononym 瑰 in Yuan You section matches Yuan Gui with explicit same-person claims and s0154 少與瑰齊名.'
            : 'Appraisal 山甫 and 袁子 are Yuan Gui’s courtesy and honorific surfaces; same-person claims to p037 are conservative and source-backed, but records remain separate pending lookup.';
    return { id: pid, verdict, reason, evidence: [{ unit: unitId, quote }] };
  });

  const findings = [
    {
      items: ['hints-p026', 'p026'],
      problem:
        'Active hint still embeds “before AD 300” after claim-212 moved to unresolved hold; hints must not revive falsified Western endpoints.',
      action:
        'Rewrite p026 active-date hint to a neutral research hold (no AD 300 endpoint) or clear the hint once independent date audit accepts claim-212 only.',
    },
  ];

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
      'Follow-up on owner 1d31857750: AD 300 cap removed from c0814/claim-212; native unresolved hold is supported (sourceDate + unresolved, no western bounds). Mei→Gui kinship claims verified. One residual hint debt on hints-p026. Editorial v4 r0017–r0037 unchanged. Full chapter approval still blocked on hint cleanup; no new incorrect Western date contradictions.',
    reviewedUnits: ['s0053', 's0076', 's0077', 's0154', 's0376', 's0381'],
    itemChecks,
    personChecks,
    findings,
    references: [
      {
        kind: 'chapter',
        book: BOOK,
        chapter: CHAPTER,
        unit: 's0053',
        quote: '山賈諸公皆釋服從時',
        sourceHash: sha256(unitMap.get('s0053').zh),
        reason:
          'Quoted contrast inside Gu He memorial; independent review confirms no source year for Shan Jia’s own service endpoint.',
      },
    ],
    priorReviewCommit: PRIOR_REVIEW,
    ownerRecheckCommit: OWNER_COMMIT,
  };
}

function buildFollowupIdentity(packet, extraction) {
  const samePerson = extraction.claims.filter((c) => c.predicate === 'same-person');
  const pairs = samePerson.map((c) => ({
    from: c.subject,
    to: c.value.personId,
    evidence: c.evidence,
    note: c.value.note,
  }));

  return {
    schemaVersion: 1,
    kind: 'independent-chapter-identity-review-evidence',
    status: 'chapter-local-links-verified-lookup-still-required',
    scope: { book: BOOK, chapter: CHAPTER },
    inputs: {
      source: packet.sourceHash,
      extraction: packet.extractionHash,
      ownerCommit: OWNER_COMMIT,
      priorReviewCommit: PRIOR_REVIEW,
    },
    reviewer: { ...REVIEWER, independentOfOwner: true },
    reviewedAt: REVIEWER.completedAt,
    localGrouping: {
      verdict: 'conservative-accept',
      pairs: [
        {
          ids: ['p036', 'p037'],
          basis: 's0076 袁瑰 heading vs s0077 biography body',
          samePersonClaims: pairs.filter((p) => ['p036', 'p037'].includes(p.from.split(':').pop())),
        },
        {
          ids: ['p037', 'p070'],
          basis: 's0154 少與瑰齊名 and Yuan You section mononym 瑰',
          samePersonClaims: pairs.filter((p) => p.from.includes('p070') || p.to === 'p070'),
        },
        {
          ids: ['p037', 'p168'],
          basis: 's0077 字山甫; s0376 山甫 appraisal; s0381 袁子 honorific — not separate Yuan Mei person',
          samePersonClaims: pairs.filter((p) => p.from.includes('p168') || p.to === 'p168'),
          caution:
            'Separate p168 record retained with courtesy preferredName; same-person edges are chapter-local only.',
        },
      ],
    },
    kinshipNameRepair: {
      verdict: 'accepted',
      claims: ['c0118', 'c0120', 'c0134', 'c0136', 'c0143', 'c0585'],
      note: 'No remaining Yuan Mei English on p037/p168 name claims after owner follow-up.',
    },
    canonicalIdentity: {
      certified: false,
      dependency:
        'PEOPLE_LOOKUP_TOKEN + pinned registry snapshots/cb756c508e0265caad63cdac5c50b49c06d4ca2d2d19bb6e1ef9bde48db40aac required before canonical membership certification; same-person claims do not substitute.',
    },
    lookup: { attempted: false, reason: 'PEOPLE_LOOKUP_TOKEN missing in Cursor Cloud' },
  };
}

function main() {
  const packet = buildPeopleExtractionPacket(BOOK, CHAPTER);
  const stored = readJson(path.join(PEOPLE_DIR, 'extractions', BOOK, `${CHAPTER}.json`));
  const extraction = validateCompactPeopleExtraction(stored, packet).normalized;
  const editorial = readJson(path.join(PEOPLE_DIR, 'editorial-decisions', BOOK, `${CHAPTER}.json`));
  validateAppliedEditorialDecisions(editorial, extraction);

  const dateReport = buildFollowupDateAudit(buildDateAuditPacket(BOOK, CHAPTER));
  const dateOut = path.join(ROOT, 'independent-date-audit-followup.json');
  writeJsonAtomic(dateOut, dateReport);
  recordDateAudit(dateReport);

  const identity = buildFollowupIdentity(buildDateAuditPacket(BOOK, CHAPTER), extraction);
  writeJsonAtomic(path.join(ROOT, 'independent-identity-review-followup.json'), identity);

  const validateRun = spawnSync('npm', ['run', 'people:validate', '--', '--book', BOOK, '--chapter', CHAPTER], {
    encoding: 'utf8',
  });
  const datesVerify = spawnSync('npm', ['run', 'people:dates:verify', '--', '--book', BOOK, '--chapter', CHAPTER], {
    encoding: 'utf8',
  });

  const consolidated = {
    schemaVersion: 1,
    kind: 'jinshu083-independent-consolidated-review-followup',
    book: BOOK,
    chapter: CHAPTER,
    priorReviewCommit: PRIOR_REVIEW,
    ownerDraftCommit: OWNER_COMMIT,
    reviewer: REVIEWER,
    completedAt: REVIEWER.completedAt,
    editorial: {
      verdict: 'unchanged',
      note: 'v4 review rounds and r0017–r0037 accepts unchanged on merged extraction; validateAppliedEditorialDecisions pass.',
    },
    chronology: {
      nativeResult: 'needs-revision',
      claim212: 'supported (sourceDate + unresolved hold; not undatedSourceAttestation because source bears temporal contrast wording)',
      retiredFinding: 'claim-814 / AD 300 cap removed in owner 1d31857750',
      residual: ['hints-p026'],
      artifacts: [
        'research/people/jinshu083-independent-review-20261123/independent-date-audit-followup.json',
        'data/people/date-audits/jinshu/083.json',
      ],
    },
    identity: {
      localGrouping: 'conservative-accept p036=p037, p037=p070, p037=p168 (same-person claims)',
      canonicalCertification: false,
      lookupDependency:
        'snapshots/cb756c508e0265caad63cdac5c50b49c06d4ca2d2d19bb6e1ef9bde48db40aac + PEOPLE_LOOKUP_TOKEN',
      artifact: 'research/people/jinshu083-independent-review-20261123/independent-identity-review-followup.json',
    },
    validation: {
      peopleValidate: validateRun.status === 0 ? 'pass' : validateRun.stderr,
      datesVerify: datesVerify.stdout,
    },
  };
  writeJsonAtomic(path.join(ROOT, 'consolidated-review-followup.json'), consolidated);

  fs.appendFileSync(
    path.join(ROOT, 'README.md'),
    `\n## Follow-up (${REVIEWER.completedAt})\n\nOwner \`${OWNER_COMMIT}\`. Rechecked claim-212/c0814, Mei/Gui claims, local same-person links.\n\n- Chronology: **needs-revision** (hint cleanup only)\n- Identity: chapter-local links OK; **no canonical certification**\n\nSee \`consolidated-review-followup.json\`.\n`,
  );

  console.log(JSON.stringify({ editorial: 'ok', datesVerify: datesVerify.stdout }, null, 2));
}

main();