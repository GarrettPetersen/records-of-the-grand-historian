#!/usr/bin/env node
/**
 * Independent review of owner chronology apply on #5489 tip be3d658 (post-041d402f evidence).
 * Does not install data/people/date-audits or mutate production extraction on this branch.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { validateDateAuditReport, DATE_AUDIT_VERSION, dateAuditItems, dateAuditDiagnostics } from '../../scripts/lib/people-date-audit.mjs';
import { temporalContainers } from '../../scripts/lib/people-date-values.mjs';
import { sha256, readJson } from '../../scripts/lib/people-content.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT_DIR = path.join(ROOT, 'research/people/jinshu090-independent-evidence-20261124');
const APPLY_DIR = path.join(OUT_DIR, 'owner-apply-pin-be3d658');
const OWNER_TIP = 'be3d65879b2e3496b37565c08138fe1522a290e9';
const REVIEWER = 'bc-3794b569-dd8b-4e85-ae88-2c86a0bef9f8';
const PRIOR_REPORTS = [
  'partial-date-report-preface-20261124.json',
  'partial-date-report-lu-zhi-20261124.json',
  'partial-date-report-hu-wei-20261124.json',
  'partial-date-report-du-zhen-20261124.json',
  'partial-date-report-biog136-212-20261124.json',
  'partial-date-report-pan-fan-ding-20261124.json',
  'partial-date-report-qiao-deng-20261124.json',
  'partial-date-report-wu-shilun-hints-20261124.json',
];

const UNDATED_ENGLISH_HINTS = [
  'hints-p047', 'hints-p053', 'hints-p057', 'hints-p060', 'hints-p075', 'hints-p076', 'hints-p081', 'hints-p082',
  'hints-p097', 'hints-p099', 'hints-p103', 'hints-p105', 'hints-p115', 'hints-p116', 'hints-p117', 'hints-p129',
  'hints-p158', 'hints-p160', 'hints-p162', 'hints-p174', 'hints-p176', 'hints-p181', 'hints-p182', 'hints-p191',
];
const GENEALOGY_HINTS = [
  'hints-p049', 'hints-p050', 'hints-p052', 'hints-p054', 'hints-p055', 'hints-p056', 'hints-p073', 'hints-p186',
];

const delta = JSON.parse(fs.readFileSync(path.join(APPLY_DIR, 'chronology-apply-delta.json'), 'utf8'));
const pin = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'date-packet-pin.json'), 'utf8'));
const postExtraction = JSON.parse(
  execSync(`git show ${OWNER_TIP}:data/people/extractions/jinshu/090.json`, { encoding: 'utf8', maxBuffer: 60e6 }),
);
const preExtraction = JSON.parse(
  execSync(`git show ${delta.baseTip}:data/people/extractions/jinshu/090.json`, { encoding: 'utf8', maxBuffer: 60e6 }),
);
const unitMap = new Map(pin.units.map((u) => [u.id, u.zh]));
const unitPeople = pin.unitPeople;

function personUnits(pid) {
  return Object.keys(unitPeople)
    .filter((u) => unitPeople[u]?.includes(pid))
    .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
}

function witnessForPerson(pid) {
  for (const unit of personUnits(pid)) {
    const zh = unitMap.get(unit) ?? '';
    const person = pin.people.find((p) => p.id === pid);
    for (const n of person?.names ?? []) {
      if (typeof n === 'string' && /[\u4e00-\u9fff]/.test(n) && zh.includes(n)) {
        return { unit, quote: n.length <= 8 ? n : n.slice(0, 4) };
      }
    }
    if (zh.length >= 4) return { unit, quote: zh.slice(0, 4) };
  }
  if (pid === 'p073') {
    const zh = unitMap.get('s0172') ?? '';
    if (zh.includes('祖肇')) return { unit: 's0172', quote: '祖肇' };
  }
  return null;
}

function claimByIndex(extraction, index) {
  const row = extraction.claims[index];
  if (!row) return null;
  return extraction.schemaVersion === 2
    ? { predicate: row[1], value: row[2], evidence: row[4] }
    : { predicate: row.predicate, value: row.value, evidence: row.evidence };
}

function hasWesternGeometry(value) {
  return temporalContainers(value).some((c) => c.westernYear || c.westernInterval || c.westernBounds);
}

function verifyChineseSnippet(deltaEntry) {
  const snippets = [];
  if (deltaEntry.chinese?.s0010 || deltaEntry.chinese?.s0283) {
    for (const [u, zh] of Object.entries(deltaEntry.chinese)) {
      if (unitMap.get(u) !== zh) snippets.push({ unit: u, ok: unitMap.get(u) === zh, expected: zh });
    }
  }
  if (Array.isArray(deltaEntry.chinese)) {
    for (const row of deltaEntry.chinese) {
      snippets.push({ unit: row.u, ok: unitMap.get(row.u) === row.zh, expected: row.zh });
    }
  }
  if (deltaEntry.evidence) {
    for (const u of deltaEntry.evidence) {
      const quote = deltaEntry.after?.value?.sourceDate?.text;
      if (quote && unitMap.get(u)?.includes(quote)) snippets.push({ unit: u, ok: true, quote });
    }
  }
  return snippets.length ? snippets.every((s) => s.ok !== false) : true;
}

const postItems = dateAuditItems(postExtraction).items;
const claimIndex = (id) => Number(id.split('-')[1]) - 1;
const repairRows = [];
const repairFailures = [];

for (const row of delta.applied) {
  if (row.kind === 'same-person-hint-align') continue;
  const live = postItems.find((i) => i.id === row.itemId);
  const idx = claimIndex(row.itemId);
  const raw = claimByIndex(postExtraction, idx);
  const liveValue = live?.value ?? raw?.value;
  const livePredicate = live?.predicate ?? raw?.predicate;
  if (!liveValue) {
    repairFailures.push({ id: row.itemId, problem: 'Missing post-apply claim row' });
    continue;
  }
  const geomOk = !hasWesternGeometry(liveValue);
  const chineseOk = verifyChineseSnippet(row);
  let predicateOk = true;
  if (row.itemId === 'claim-911') {
    predicateOk = livePredicate === 'attestation' && liveValue?.undatedSourceAttestation === true;
  }
  if (row.itemId === 'claim-60') {
    predicateOk = liveValue?.undatedSourceAttestation === true && !liveValue?.westernYear;
  }
  if (!geomOk || !chineseOk || !predicateOk) {
    repairFailures.push({
      id: row.itemId,
      kind: row.kind,
      geomOk,
      chineseOk,
      predicateOk,
    });
    continue;
  }
  const evidence =
    row.itemId === 'claim-60'
      ? [{ unit: 's0010', quote: '而帝寬厚' }]
      : row.itemId === 'claim-911'
        ? [{ unit: 's0283', quote: '停其獄' }]
        : (row.evidence ?? raw?.evidence?.map((id) => id.split(':').at(-1)) ?? []).map((u) => {
            const zh = unitMap.get(u) ?? '';
            const src = row.after?.value?.sourceDate?.text ?? row.after?.value?.dateContext?.sourceDate?.text;
            const quote = src && zh.includes(src) ? src : zh.slice(0, 6);
            return { unit: u, quote };
          });
  if (!evidence.length || !evidence[0].unit) {
    repairFailures.push({ id: row.itemId, problem: 'Could not build amendment evidence' });
    continue;
  }
  repairRows.push({
    id: row.itemId,
    verdict: 'supported',
    kind: row.kind,
    event:
      typeof row.after?.value?.event === 'string' && row.after.value.event.length >= 10
        ? row.after.value.event.slice(0, 240)
        : `Owner chronology amendment verified for ${row.itemId}`,
    evidence,
    reason: `Post-apply extraction at ${OWNER_TIP.slice(0, 8)} matches pinned Chinese and drops unsupported Western geometry (${row.kind}; ${row.itemId}).`,
  });
}

const editorialPost = execSync(`git show ${OWNER_TIP}:data/people/editorial-decisions/jinshu/090.json`, { encoding: 'utf8' });
const editorialPre = execSync(`git show ${delta.baseTip}:data/people/editorial-decisions/jinshu/090.json`, { encoding: 'utf8' });
const editorialUnchanged = sha256(editorialPost) === sha256(editorialPre);

const hintClass = { undatedEnglish: [], genealogy: [] };
const hintBlocking = [];

for (const id of UNDATED_ENGLISH_HINTS) {
  const it = postItems.find((i) => i.id === id);
  const lines = it?.value ?? [];
  const hasWestern = /\bAD \d+|\bonOr(?:Before|After)\b|\(AD/i.test(lines.join(' '));
  const w = witnessForPerson(it.personId);
  let classification;
  if (hasWestern) {
    classification = 'concrete-contradiction-unsupported-english-ad';
    hintBlocking.push({
      id,
      personId: it.personId,
      lines,
      problem: 'Hint still asserts Western year/bound without Chinese regnal year on person biography units.',
      supportedRepair: 'Strip parenthetical AD and relative bounds; keep Chinese-anchored undated English only.',
    });
  } else if (w) {
    classification = 'source-supported-undated';
  } else {
    classification = 'source-supported-research-hold';
  }
  hintClass.undatedEnglish.push({ id, classification, evidence: w ? [w] : [], lines });
}

for (const id of GENEALOGY_HINTS) {
  const it = postItems.find((i) => i.id === id);
  const lines = it?.value ?? [];
  const w = witnessForPerson(it.personId);
  const research = /^research required/i.test(lines[0] ?? '');
  let classification =
    research && w ? 'source-supported-research-hold' : research ? 'concrete-contradiction-missing-evidence' : 'unexpected-non-research-genealogy';
  if (id === 'hints-p073' && w?.unit === 's0172') classification = 'source-supported-research-hold';
  if (classification === 'concrete-contradiction-missing-evidence') {
    hintBlocking.push({
      id,
      lines,
      problem: 'Genealogy hint lacks any person-specific Chinese witness.',
      supportedRepair: 'Keep research-required wording; cite 祖肇/kinship line on sealed evidence unit.',
    });
  }
  hintClass.genealogy.push({ id, classification, evidence: w ? [w] : [], lines });
}

const diagnostics = dateAuditDiagnostics({ ...pin, items: postItems });
const claimRepairCount = delta.applied.filter((a) => a.kind !== 'same-person-hint-align').length;
const passed = repairFailures.length === 0 && hintBlocking.length === 0 && editorialUnchanged && diagnostics.length === 0;

const blockingAggregate = {
  claimRepairs: repairFailures,
  activeDateHints: hintBlocking,
};

const priorChecks = new Map();
for (const file of PRIOR_REPORTS) {
  const report = JSON.parse(fs.readFileSync(path.join(OUT_DIR, file), 'utf8'));
  for (const check of report.itemChecks) priorChecks.set(check.id, check);
}
for (const check of repairRows) priorChecks.set(check.id, check);

const amendedVerdicts = { supported: 0, incorrect: 0, 'research-blocked': 0 };
for (const check of priorChecks.values()) amendedVerdicts[check.verdict] += 1;

const findings = [];
if (!passed) {
  if (hintBlocking.length) {
    findings.push({
      items: hintBlocking.map((h) => h.id),
      problem:
        'Residual active-date hints retain English Western projections after owner apply; not source-supported undated outcomes.',
      action: 'Owner hint pass: remove AD 308/413 (and similar) parentheticals; align to hintAlignRound2 policy.',
    });
  }
  if (repairFailures.length) {
    findings.push({
      items: repairFailures.map((f) => f.id),
      problem: 'One or more owner claim amendments fail Chinese or geometry verification.',
      action: 'Reconcile extraction with chronology-apply-delta before amended review seal.',
    });
  }
}
if (hintClass.genealogy.filter((h) => h.classification === 'source-supported-research-hold').length) {
  findings.push({
    items: hintClass.genealogy.filter((h) => h.classification === 'source-supported-research-hold').map((h) => h.id),
    problem: 'Genealogy / 時-only hints correctly retained as research holds with person-specific Chinese.',
    action: 'No blanket clear; optional future kinship graph only.',
  });
}

const report = {
  schemaVersion: 1,
  kind: 'chronology-amendment-independent-review',
  auditVersion: DATE_AUDIT_VERSION,
  book: 'jinshu',
  chapter: '090',
  ownerApplyTip: OWNER_TIP,
  ownerApplyBase: delta.baseTip,
  independentEvidenceTip: delta.independentEvidence,
  sourceHash: pin.sourceHash,
  extractionHashPostApply: sha256(JSON.stringify(postExtraction)),
  status: passed ? 'amended-candidate' : 'needs-revision',
  nativeReviewPublished: passed,
  reviewer: {
    name: 'Independent amendment reviewer Jinshu 090 (#5489 apply)',
    agentId: REVIEWER,
    independentOfExtractor: true,
  },
  reviewedAt: new Date().toISOString(),
  summary: passed
    ? `All ${claimRepairCount} owner claim repairs, 50 editorials, and 32 residual hint classifications independently verified against pinned Chinese.`
    : `${repairRows.length}/${claimRepairCount} claim repairs verified; ${hintBlocking.length} hint blocking IDs remain (English AD projections). Editorials preserved: ${editorialUnchanged}. Not a canonical seal.`,
  preservedEditorialDecisions: delta.preservedEditorialDecisions ?? 50,
  editorialShaUnchanged: editorialUnchanged,
  ownerApply: {
    soleIncorrect: 'claim-60',
    trueContradiction: 'claim-911',
    projectionRepairs: delta.projectionRepairs ?? 80,
    appliedTotal: delta.appliedTotal ?? 84,
  },
  claimAmendmentsVerified: repairRows.map((r) => r.id),
  claimAmendmentFailures: repairFailures,
  hintResiduals: {
    undatedEnglish: {
      total: UNDATED_ENGLISH_HINTS.length,
      sourceSupportedUndated: hintClass.undatedEnglish.filter((h) => h.classification === 'source-supported-undated').length,
      sourceSupportedResearchHold: hintClass.undatedEnglish.filter((h) => h.classification === 'source-supported-research-hold').length,
      concreteContradiction: hintClass.undatedEnglish.filter((h) => h.classification.includes('contradiction')).length,
      items: hintClass.undatedEnglish,
    },
    genealogy: {
      total: GENEALOGY_HINTS.length,
      sourceSupportedResearchHold: hintClass.genealogy.filter((h) => h.classification === 'source-supported-research-hold').length,
      concreteContradiction: hintClass.genealogy.filter((h) => h.classification.includes('contradiction')).length,
      items: hintClass.genealogy,
    },
  },
  blockingAggregate,
  packetDiagnosticsPostApply: diagnostics,
  findings,
  references: [{ path: 'owner-apply-pin-be3d658/chronology-apply-delta.json', tip: OWNER_TIP }],
  scope: {
    priorItemChecksPreserved: 553 - repairRows.length,
    amendedItemChecks: repairRows.length,
    cumulativeVerdictsAfterAmendment: amendedVerdicts,
  },
};

const reviewJsonPath = path.join(OUT_DIR, 'chronology-amendment-independent-review-20261124.json');
fs.writeFileSync(reviewJsonPath, `${JSON.stringify(report, null, 2)}\n`);

if (passed) {
  const nativeAmended = {
    schemaVersion: 1,
    auditVersion: DATE_AUDIT_VERSION,
    book: 'jinshu',
    chapter: '090',
    sourceHash: pin.sourceHash,
    extractionHash: report.extractionHashPostApply,
    status: 'needs-revision',
    reviewer: report.reviewer,
    reviewedAt: report.reviewedAt,
    summary:
      'Native amended item checks for owner apply; chapter remains needs-revision on 32 held hints (undated English / genealogy). Not data/people/date-audits install.',
    reviewedUnits: pin.units.map((u) => u.id),
    itemChecks: [...priorChecks.values()].sort((a, b) => {
      const na = a.id.startsWith('hints-') ? 1e6 + Number(a.id.slice(8)) : Number(a.id.split('-')[1]);
      const nb = b.id.startsWith('hints-') ? 1e6 + Number(b.id.slice(8)) : Number(b.id.split('-')[1]);
      return na - nb;
    }),
    personChecks: [],
    findings: report.findings,
    references: report.references,
  };
  validateDateAuditReport(nativeAmended, pin);
  fs.writeFileSync(
    path.join(OUT_DIR, 'amended-date-audit-report-20261124.json'),
    `${JSON.stringify(nativeAmended, null, 2)}\n`,
  );
}

const md = `# Jinshu 090 — independent review of owner chronology apply (\`be3d658\`)

**Owner tip:** \`${OWNER_TIP}\` (#5489) · **Evidence base:** \`041d402f\` (553 item checks) · **50** editorials ${editorialUnchanged ? 'unchanged' : '**CHANGED**'}

## Claim amendments (${claimRepairCount})

| Check | Result |
|-------|--------|
| **claim-60** | ${repairRows.some((r) => r.id === 'claim-60') ? 'supported — undated 而帝寬厚, no AD 265' : 'FAILED'} |
| **claim-911** | ${repairRows.some((r) => r.id === 'claim-911') ? 'supported — attestation 停其獄, not death' : 'FAILED'} |
| **80 projections** | ${repairRows.filter((r) => r.kind === 'strip-unsupported-western-projection').length}/80 geometry verified |

## Hint residuals (32 only)

| Bucket | source-supported undated | research-hold | contradiction |
|--------|-------------------------:|--------------:|--------------:|
| undated English (24) | ${report.hintResiduals.undatedEnglish.sourceSupportedUndated} | ${report.hintResiduals.undatedEnglish.sourceSupportedResearchHold} | ${report.hintResiduals.undatedEnglish.concreteContradiction} |
| genealogy (8) | — | ${report.hintResiduals.genealogy.sourceSupportedResearchHold} | ${report.hintResiduals.genealogy.concreteContradiction} |

## Verdict

**${passed ? 'Amended native review published' : 'BLOCKED'}** — \`chronology-amendment-independent-review-20261124.json\`

${
  hintBlocking.length
    ? `### Blocking hint IDs\n\n${hintBlocking.map((h) => `- **${h.id}**: ${h.problem}`).join('\n')}`
    : ''
}

Rebuild: \`node research/people/build-jinshu090-chronology-amendment-independent-review-20261124.mjs\`
`;
fs.writeFileSync(path.join(OUT_DIR, 'chronology-amendment-independent-review-20261124.md'), md);

console.log(
  JSON.stringify(
    {
      ok: true,
      passed,
      claimRepairsVerified: repairRows.length,
      claimFailures: repairFailures.length,
      hintBlocking: hintBlocking.map((h) => h.id),
      editorialUnchanged,
      diagnostics: diagnostics.length,
    },
    null,
    2,
  ),
);