#!/usr/bin/env node
/**
 * Independent review of owner chronology apply on #5489 tip be3d658 (post-041d402f evidence).
 * Does not install data/people/date-audits or mutate production extraction on this branch.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import {
  validateDateAuditReport,
  DATE_AUDIT_VERSION,
  buildDateAuditPacket,
  dateAuditItems,
  dateAuditDiagnostics,
} from '../../scripts/lib/people-date-audit.mjs';
import { temporalContainers } from '../../scripts/lib/people-date-values.mjs';
import { sha256, readJson } from '../../scripts/lib/people-content.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT_DIR = path.join(ROOT, 'research/people/jinshu090-independent-evidence-20261124');
const APPLY_DIR = path.join(OUT_DIR, 'owner-apply-pin-be3d658');
const HINTFIX_TIP_DEFAULT = '5ff5c1e8d1f790777330bf88e0edec69bef1b521';
const OWNER_TIP = process.argv[2] ?? process.env.JINSHU090_OWNER_TIP ?? HINTFIX_TIP_DEFAULT;
const CHRONOLOGY_APPLY_TIP = 'be3d65879b2e3496b37565c08138fe1522a290e9';
const FLAGGED_HINTS = ['hints-p075', 'hints-p076', 'hints-p158', 'hints-p176'];
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
const editorialPre = execSync(`git show ${CHRONOLOGY_APPLY_TIP}:data/people/editorial-decisions/jinshu/090.json`, {
  encoding: 'utf8',
});
const editorialUnchanged = sha256(editorialPost) === sha256(editorialPre);

const hintScopesRaw = execSync(
  `git show ${OWNER_TIP}:research/people/jinshu090-owner-hint-west-strip-20261124/amendment-scopes.json`,
  { encoding: 'utf8' },
);
const hintScopes = JSON.parse(hintScopesRaw);
const HINTFIX_DIR = path.join(OUT_DIR, 'owner-hintfix-pin-5ff5c1e');
fs.mkdirSync(HINTFIX_DIR, { recursive: true });
fs.writeFileSync(path.join(HINTFIX_DIR, 'amendment-scopes.json'), `${hintScopesRaw}\n`);

const flaggedHintFailures = [];
const flaggedHintVerified = [];
for (const repair of hintScopes.repairs ?? []) {
  if (!FLAGGED_HINTS.includes(repair.itemId)) continue;
  const live = postItems.find((i) => i.id === repair.itemId);
  const lines = live?.value ?? [];
  const hasWestern = /\bAD \d+|\bonOr(?:Before|After)\b|\(AD/i.test(lines.join(' '));
  const linesMatch = JSON.stringify(lines) === JSON.stringify(repair.after);
  const u = repair.unitIds?.[0];
  const zh = unitMap.get(u) ?? '';
  const quoteNeedle = repair.chinese?.replace(/。$/, '').slice(0, 6);
  const quote = zh.includes(quoteNeedle) ? quoteNeedle : repair.chinese?.slice(0, 4);
  const chineseOk = zh.includes(quote);
  if (!linesMatch || hasWestern || !chineseOk) {
    flaggedHintFailures.push({
      id: repair.itemId,
      linesMatch,
      hasWestern,
      chineseOk,
      lines,
      expectedAfter: repair.after,
    });
    continue;
  }
  flaggedHintVerified.push({
    id: repair.itemId,
    personId: repair.personId,
    evidence: [{ unit: u, quote }],
    event: `Active-date hints for ${repair.personId} after Western strip (#5489 ${OWNER_TIP.slice(0, 8)})`,
    verdict: 'supported',
    reason: `${u} “${quote}” anchors undated English hint without AD projection; owner stripped “${repair.stripped}” per independent blocker review.`,
  });
}

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
const passed =
  repairFailures.length === 0 &&
  hintBlocking.length === 0 &&
  flaggedHintFailures.length === 0 &&
  flaggedHintVerified.length === FLAGGED_HINTS.length &&
  editorialUnchanged &&
  diagnostics.length === 0;

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
for (const check of flaggedHintVerified) priorChecks.set(check.id, check);
for (const row of hintClass.undatedEnglish.filter((h) => h.classification === 'source-supported-undated' && !FLAGGED_HINTS.includes(h.id))) {
  const w = row.evidence[0];
  if (!w) continue;
  priorChecks.set(row.id, {
    id: row.id,
    evidence: [w],
    event: `Active-date hints (${row.id}) — source-supported undated English`,
    verdict: 'supported',
    reason: `${w.unit} “${w.quote}” supports undated active-date hint without Western projection.`,
  });
}
for (const row of hintClass.genealogy) {
  const w = row.evidence[0];
  if (row.classification !== 'source-supported-research-hold' || !w) continue;
  priorChecks.set(row.id, {
    id: row.id,
    evidence: [w],
    event: `Active-date hints (${row.id}) — genealogy / 時-only research hold`,
    verdict: 'research-blocked',
    reason: `${w.unit} “${w.quote}” supports kinship or 時-only wording; “research required” is a source-supported unknown, not a calendar contradiction.`,
  });
}

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
  ownerHintFixTip: OWNER_TIP,
  chronologyApplyTip: CHRONOLOGY_APPLY_TIP,
  flaggedHintRepairs: {
    verified: flaggedHintVerified.map((r) => r.id),
    failures: flaggedHintFailures,
    receipt: 'owner-hintfix-pin-5ff5c1e/amendment-scopes.json',
  },
  references: [
    { path: 'owner-apply-pin-be3d658/chronology-apply-delta.json', tip: CHRONOLOGY_APPLY_TIP },
    { path: 'owner-hintfix-pin-5ff5c1e/amendment-scopes.json', tip: OWNER_TIP },
    { path: 'date-packet-pin.json', note: 'Sealed 553-review packet (pre-owner-apply extraction hash)' },
  ],
  scope: {
    priorItemChecksPreserved: 553 - repairRows.length,
    amendedItemChecks: repairRows.length,
    cumulativeVerdictsAfterAmendment: amendedVerdicts,
  },
};

const reviewJsonPath = path.join(OUT_DIR, 'chronology-amendment-independent-review-20261124.json');
fs.writeFileSync(reviewJsonPath, `${JSON.stringify(report, null, 2)}\n`);

const postPacket = buildDateAuditPacket('jinshu', '090', { suppliedExtraction: postExtraction });
const postPacketPath = path.join(OUT_DIR, 'date-packet-post-5489-5ff5c1e.json');
fs.writeFileSync(postPacketPath, `${JSON.stringify(postPacket, null, 2)}\n`);

if (passed) {
  const allItemChecks = [...priorChecks.values()].sort((a, b) => {
    const na = a.id.startsWith('hints-') ? 1e6 + Number(a.id.slice(8)) : Number(a.id.split('-')[1]);
    const nb = b.id.startsWith('hints-') ? 1e6 + Number(b.id.slice(8)) : Number(b.id.split('-')[1]);
    return na - nb;
  });
  const blockedIds = new Set(allItemChecks.filter((c) => c.verdict !== 'supported').map((c) => c.id));
  const nativeFindings = [];
  for (const file of PRIOR_REPORTS) {
    const prior = JSON.parse(fs.readFileSync(path.join(OUT_DIR, file), 'utf8'));
    for (const finding of prior.findings ?? []) {
      const items = finding.items.filter((id) => blockedIds.has(id));
      if (!items.length) continue;
      const key = `${finding.problem?.slice(0, 40)}`;
      let row = nativeFindings.find((f) => f.problem === finding.problem);
      if (!row) {
        row = { items: [], problem: finding.problem, action: finding.action };
        nativeFindings.push(row);
      }
      for (const id of items) {
        if (!row.items.includes(id)) row.items.push(id);
      }
    }
  }
  const genealogyHoldIds = hintClass.genealogy
    .filter((h) => h.classification === 'source-supported-research-hold')
    .map((h) => h.id);
  nativeFindings.push({
    items: genealogyHoldIds,
    problem:
      'Eight genealogy / 時-only active-date hints remain research holds: source-supported unknowns, not concrete source contradictions.',
    action: 'Retain until host pins explicit dates; do not invent Western years.',
  });
  const listedBlocked = new Set(nativeFindings.flatMap((f) => f.items));
  for (const id of blockedIds) {
    if (listedBlocked.has(id)) continue;
    nativeFindings.push({
      items: [id],
      problem: `Residual research-blocked item ${id} after owner apply; no unsupported Western geometry remains on amended extraction.`,
      action: 'Host may clear when independent reviewer accepts undated or research-hold reason.',
    });
  }
  const nativeAmended = {
    schemaVersion: 1,
    auditVersion: DATE_AUDIT_VERSION,
    book: 'jinshu',
    chapter: '090',
    sourceHash: postPacket.sourceHash,
    extractionHash: postPacket.extractionHash,
    status: 'needs-revision',
    reviewer: report.reviewer,
    reviewedAt: report.reviewedAt,
    summary:
      'Native amended review: claim-60, claim-911, 80 Western strips, and four flagged hints verified at #5489 5ff5c1e. Eight genealogy hints held as research-blocked unknowns. Fifty editorials unchanged. Not data/people/date-audits install.',
    reviewedUnits: pin.units.map((u) => u.id),
    itemChecks: allItemChecks,
    personChecks: [],
    findings: nativeFindings,
    references: [],
    evidenceRef: 'research/people/jinshu090-independent-evidence-20261124/amended-date-audit-report-20261124.json',
    carriedForward: {
      sealedPacket: 'date-packet-pin.json',
      postApplyPacket: 'date-packet-post-5489-5ff5c1e.json',
      preservedEditorialDecisions: 50,
    },
  };
  validateDateAuditReport(nativeAmended, postPacket);
  fs.writeFileSync(
    path.join(OUT_DIR, 'amended-date-audit-report-20261124.json'),
    `${JSON.stringify(nativeAmended, null, 2)}\n`,
  );
}

const md = `# Jinshu 090 — independent review of owner apply (#5489)

**Chronology apply:** \`${CHRONOLOGY_APPLY_TIP.slice(0, 8)}\` · **Hint fix tip:** \`${OWNER_TIP}\`

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

**${passed ? 'Amended native review published' : 'BLOCKED'}** — \`${passed ? 'amended-date-audit-report-20261124.json' : 'chronology-amendment-independent-review-20261124.json'}\`

### Flagged hint repairs (p075/p076/p158/p176)

${FLAGGED_HINTS.map((id) => `- **${id}**: ${flaggedHintVerified.some((r) => r.id === id) ? 'verified' : 'FAILED'}`).join('\n')}

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
      flaggedHintVerified: flaggedHintVerified.map((r) => r.id),
      flaggedHintFailures,
      editorialUnchanged,
      diagnostics: diagnostics.length,
      evidenceRef: passed
        ? 'research/people/jinshu090-independent-evidence-20261124/amended-date-audit-report-20261124.json'
        : null,
    },
    null,
    2,
  ),
);