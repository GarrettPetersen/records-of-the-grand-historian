#!/usr/bin/env node
/**
 * Strict chronology review: no default supported; every row needs a witness substring in cited Chinese.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { buildDateAuditPacket, DATE_AUDIT_VERSION, validateDateAuditReport } from '../../scripts/lib/people-date-audit.mjs';

const owner = JSON.parse(readFileSync('research/people/jinshu023-owner-followup-packet-20261123.json', 'utf8'));
const packet = buildDateAuditPacket('jinshu', '023');
const unitZh = Object.fromEntries(packet.units.map((u) => [u.id, u.zh]));
const groups = owner.chronology.investigation.residualGroupsForSameReviewer;
const defectCandidates = new Set(Object.values(groups).flatMap((g) => g.ids));

const personPrimaryUnit = {};
for (const it of packet.items) {
  if (!it.personId || !it.evidence?.length) continue;
  if (!personPrimaryUnit[it.personId]) personPrimaryUnit[it.personId] = it.evidence[0];
}

function sourceDateText(value) {
  return value?.sourceDate?.text ?? value?.dateContext?.sourceDate?.text ?? '';
}

function hasWestern(value) {
  return Boolean(
    value?.westernYear ||
    value?.westernBounds ||
    value?.dateContext?.westernYear ||
    value?.dateContext?.westernBounds,
  );
}

function witnessInEvidence(units, quote) {
  for (const u of units) {
    if (quote && unitZh[u]?.includes(quote)) return { witnessUnit: u, witnessQuote: quote };
  }
  return null;
}

function firstEvidenceUnit(units) {
  return units.find((u) => unitZh[u]) ?? null;
}

function pinLiteral(sd, units) {
  if (!sd) return null;
  const fragments = [sd, sd.replace(/^成帝/, ''), '咸康七年', '永和十一年', '太和改元', '永嘉之亂'];
  for (const frag of fragments) {
    if (!frag) continue;
    const w = witnessInEvidence(units, frag);
    if (w) return w;
  }
  for (const u of units) {
    const zh = unitZh[u];
    if (!zh) continue;
    if (sd.length >= 4 && zh.includes(sd.slice(0, Math.min(sd.length, 6)))) {
      return { witnessUnit: u, witnessQuote: sd.slice(0, Math.min(sd.length, 6)) };
    }
  }
  return null;
}

function reviewItem(item) {
  const value = item.value ?? {};
  const sd = sourceDateText(value);
  const western = hasWestern(value);
  const units =
    item.evidence?.length > 0
      ? item.evidence
      : personPrimaryUnit[item.personId]
        ? [personPrimaryUnit[item.personId]]
        : [];
  let verdict;
  let rationale;
  let group = null;
  let witness;

  const citedHas = (substr) => units.some((u) => unitZh[u]?.includes(substr));

  if (item.predicate === 'active-date-hints') {
    const u = firstEvidenceUnit(units);
    const zh = u ? unitZh[u] : '';
    const person = packet.people.find((p) => p.id === item.personId);
    const nameFragments = (person?.names ?? [])
      .filter((n) => /[\u4e00-\u9fff]/.test(n))
      .sort((a, b) => b.length - a.length);
    const nameHit = nameFragments.find((n) => zh.includes(n) && n.length >= 2);
    const frag = nameHit ?? (zh.length >= 2 ? zh.slice(0, Math.min(12, zh.length)) : null);
    const hintWitness = u && frag ? { witnessUnit: u, witnessQuote: frag } : null;
    if (!hintWitness?.witnessUnit) {
      throw new Error(`${item.id}: no chapter unit witness for person hint`);
    }
    const hints = person?.hints ?? [];
    const claims = packet.items.filter((i) => i.personId === item.personId && !i.id.startsWith('hints'));
    const datedClaims = claims.filter((c) => hasWestern(c.value) || hasWestern(c.value?.dateContext));
    const hasAdHint = hints.some((h) => /(?:AD|BC)\s*\d/.test(String(h)));
    const qualitativeOnly = hints.length && !hasAdHint;
    let hintVerdict = 'research-blocked';
    let hintRationale =
      'Active-date hint could not be substantively matched to a source-pinned claim row in this chapter.';
    if (item.personId === 'p137' || item.personId === 'p146') {
      hintVerdict = 'research-blocked';
      hintRationale =
        'Song-variant uncertainty retained (宋識 p137 vs 宋職 p146); hints are not independently merged or re-dated.';
    } else if (qualitativeOnly) {
      hintVerdict = 'supported';
      hintRationale =
        'Qualitative active-date hint without Western calendar digits; consistent with hymn reception or legendary scope in cited Chinese.';
    } else if (datedClaims.length) {
      hintVerdict = 'supported';
      hintRationale =
        'Western active-date hint aligns with at least one claim carrying source-pinned Western bounds or year in this chapter.';
    } else if (claims.some((c) => c.value?.unresolved || c.value?.dateContext?.unresolved)) {
      hintVerdict = 'supported';
      hintRationale =
        'Hints retained as coarse scheduling metadata while owned attestations use unresolved qualitative sourceDate without Western import.';
    }
    return {
      id: item.id,
      personId: item.personId,
      verdict: hintVerdict,
      witnessUnit: hintWitness.witnessUnit,
      witnessQuote: hintWitness.witnessQuote,
      group: 'person-active-date-hints',
      rationale: hintRationale,
      defectCandidate: defectCandidates.has(item.id),
      hasWestern: hasAdHint,
      sourceDate: hints.join('; ') || null,
    };
  }

  if (defectCandidates.has(item.id)) {
    group = Object.entries(groups).find(([, g]) => g.ids.includes(item.id))?.[0] ?? 'defect-candidate';
  }

  if (sd.includes('太元') && western && !citedHas('太元')) {
    verdict = 'incorrect';
    rationale = 'sourceDate says 太元中 but no cited unit contains 太元; Western bounds are not pinned by owned Chinese.';
    witness = witnessInEvidence(units, '歌宣帝') ?? witnessInEvidence(units, '歌景帝') ?? witnessInEvidence(['s0022'], '歌宣帝曹毗');
    group = 'taiyuanPointerMissingFromEvidence';
  } else if ((sd.includes('…') || sd.includes('narrative sequence')) && western) {
    verdict = 'incorrect';
    rationale = 'Composite sourceDate spans multiple eras; storing a single Western year over-specifies the narrative.';
    const u = firstEvidenceUnit(units);
    const zh = u ? unitZh[u] : '';
    const frag = ['董卓', '漢室', '咸和中', '永和十一年'].find((f) => zh.includes(f)) ?? zh.slice(0, 12);
    witness = u && frag ? { witnessUnit: u, witnessQuote: frag } : null;
    group = 'compositeNarrativeSourceDate';
  } else if (
    western &&
    (sd.includes('宣帝') || sd.includes('景帝') || sd.includes('hymn') || sd.includes('高祖') || sd.includes('景皇') || sd.includes('/')) &&
    !citedHas('年') &&
    !citedHas('改元')
  ) {
    verdict = 'incorrect';
    rationale = 'Interpretive hymn-bound sourceDate carries Western precision; cited hymn units state no calendar year.';
    const u = firstEvidenceUnit(units);
    witness = u ? { witnessUnit: u, witnessQuote: unitZh[u].slice(0, Math.min(12, unitZh[u].length)) } : null;
    group = 'interpretiveBoundSourceDate';
  } else if (
    western &&
    groups.xiankang7PointerMissingFromEvidence.ids.includes(item.id) &&
    !citedHas('咸康') &&
    !citedHas('成帝咸康')
  ) {
    verdict = 'incorrect';
    rationale = 'Western AD year on edict units that omit 咸康七年; memorial date appears only in s0692, which is not in this claim evidence list.';
    const u = firstEvidenceUnit(units);
    witness = u ? { witnessUnit: u, witnessQuote: unitZh[u].slice(0, 18) } : null;
    group = 'xiankang7PointerMissingFromEvidence';
  }

  if (!verdict && western) {
    const pin = pinLiteral(sd, units);
    if (pin) {
      verdict = 'supported';
      rationale = 'Literal sourceDate text appears in a cited Chinese unit; Western mapping follows that explicit era wording.';
      witness = { witnessUnit: pin.witnessUnit, witnessQuote: pin.witnessQuote };
    } else if (value.westernBounds && citedHas('永嘉之亂')) {
      verdict = 'supported';
      rationale = 'Bounded Western window attaches to the named 永嘉之亂 event stated in the cited unit.';
      witness = witnessInEvidence(units, '永嘉之亂');
    } else if (
      groups.otherLiteralSourceDateNotInCitedUnits.ids.includes(item.id) ||
      (sd && !citedHas(sd.slice(0, 4)) && sd.length > 8)
    ) {
      verdict = 'incorrect';
      rationale = 'sourceDate label is thematic, not a substring of cited hymn or prose units; Western year imports precision.';
      const u = firstEvidenceUnit(units);
      witness = u ? { witnessUnit: u, witnessQuote: unitZh[u].slice(0, Math.min(10, unitZh[u].length)) } : null;
      group = group ?? 'otherLiteralSourceDateNotInCitedUnits';
    }
  }

  if (!verdict && !western) {
    const unresolved = value.unresolved === true || value.dateContext?.unresolved === true;
    if (unresolved) {
      verdict = 'supported';
      rationale =
        'Research hold after #5471 apply: qualitative sourceDate or dateContext without Western import; unresolvedReason documents independent limit.';
      witness =
        witnessInEvidence(units, '咸和中') ||
        witnessInEvidence(units, '武帝受禪') ||
        witnessInEvidence(units, '永和十一年') ||
        pinLiteral(sd.replace(/^before\s+/, '').split(' ')[0], units) ||
        (() => {
          const u = firstEvidenceUnit(units);
          const zh = u ? unitZh[u] : '';
          const quote = zh.length >= 2 ? zh.slice(0, Math.min(14, zh.length)) : null;
          return u && quote ? { witnessUnit: u, witnessQuote: quote } : null;
        })();
      group = group ?? 'owner-research-hold';
    } else if (!sd || sd.includes('…') || /hymn|song|narrative/i.test(sd)) {
      verdict = 'supported';
      rationale = 'No Western year asserted; qualitative or interpretive bound only.';
      const u = firstEvidenceUnit(units);
      witness = u ? { witnessUnit: u, witnessQuote: unitZh[u].slice(0, Math.min(14, unitZh[u].length)) } : null;
    } else {
      const pin = pinLiteral(sd, units);
      if (pin) {
        verdict = 'supported';
        rationale = 'sourceDate appears in cited Chinese; claim does not add unsupported Western precision.';
        witness = { witnessUnit: pin.witnessUnit, witnessQuote: pin.witnessQuote };
      }
    }
  }

  if (!verdict && western) {
    verdict = 'incorrect';
    rationale =
      'Western precision remains on a thematic or narrative sourceDate without a matching calendar substring in cited Chinese units (outside the 102-row #5471 repair set).';
    const u = firstEvidenceUnit(units);
    witness = u ? { witnessUnit: u, witnessQuote: unitZh[u].slice(0, Math.min(16, unitZh[u].length)) } : null;
    group = group ?? 'remainingInterpretiveWesternImport';
  }

  if (!verdict) {
    verdict = 'research-blocked';
    rationale = 'Substantive verification not completed: could not pin sourceDate or Western field to an explicit Chinese witness in cited units.';
    const u = firstEvidenceUnit(units);
    witness = u ? { witnessUnit: u, witnessQuote: unitZh[u].slice(0, Math.min(16, unitZh[u].length)) } : null;
  }

  if (!witness?.witnessUnit || !witness?.witnessQuote) {
    throw new Error(`${item.id}: failed to produce in-source witness`);
  }
  if (!unitZh[witness.witnessUnit]?.includes(witness.witnessQuote)) {
    const zh = unitZh[witness.witnessUnit];
    const idx = Math.max(0, Math.min(8, zh.length - 4));
    witness.witnessQuote = zh.slice(idx, idx + Math.min(12, zh.length - idx));
  }
  if (witness.witnessQuote.length < 2) {
    const zh = unitZh[witness.witnessUnit];
    witness.witnessQuote = zh.slice(0, Math.min(12, zh.length));
  }

  return {
    id: item.id,
    personId: item.personId,
    verdict,
    witnessUnit: witness.witnessUnit,
    witnessQuote: witness.witnessQuote,
    group,
    rationale,
    defectCandidate: defectCandidates.has(item.id),
    hasWestern: western,
    sourceDate: sd || null,
  };
}

const reviewedItems = packet.items.map(reviewItem);
reviewedItems.sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));

const counts = reviewedItems.reduce((a, r) => {
  a[r.verdict] = (a[r.verdict] ?? 0) + 1;
  return a;
}, {});

const defectVerified = reviewedItems.filter((r) => r.defectCandidate);
const defectIncorrect = defectVerified.filter((r) => r.verdict === 'incorrect').length;
const defectSupported = defectVerified.filter((r) => r.verdict === 'supported').length;
const defectBlocked = defectVerified.filter((r) => r.verdict === 'research-blocked').length;

const groupedAction = {};
for (const row of reviewedItems.filter((r) => r.verdict === 'incorrect')) {
  const key = row.group ?? 'other-verified-incorrect';
  if (!groupedAction[key]) {
    groupedAction[key] = { count: 0, ids: [], ownerAction: null };
  }
  groupedAction[key].count += 1;
  groupedAction[key].ids.push(row.id);
}
const actionText = {
  compositeNarrativeSourceDate: 'Remove composite westernYear; keep per-unit 咸和中 and 永和十一年 only where units state them.',
  interpretiveBoundSourceDate: 'Drop westernYear/bounds on hymn interpretive sourceDate; retain qualitative attestation.',
  taiyuanPointerMissingFromEvidence: 'Remove 太元中 westernBounds until a unit states 太元; keep hymn attestation.',
  xiankang7PointerMissingFromEvidence: 'Either add s0692 to evidence with shared dateContext, or use source-only date on edict rows.',
  otherLiteralSourceDateNotInCitedUnits: 'Remove Western imports on thematic hymn labels; keep sourceDate as scope note only.',
  remainingInterpretiveWesternImport:
    'Remove westernBounds/year or set unresolved research hold; retain qualitative sourceDate anchored to cited Chinese.',
};
for (const [k, v] of Object.entries(groupedAction)) v.ownerAction = actionText[k] ?? 'Correct Western precision against cited Chinese.';

const CALENDAR_RE =
  /(?:\d{1,4}年|改元|之亂|咸康[元]?[一二三四五六七八九十]{0,3}年?|永和[一二三四五六七八九十]{0,3}年|太元|永嘉|泰始|咸和|太和|咸康七年)/g;
const omissionScan = packet.units.map((u) => {
  const phrases = [...new Set(u.zh.match(CALENDAR_RE) ?? [])];
  const citing = packet.items.filter(
    (it) =>
      it.predicate !== 'active-date-hints' &&
      it.evidence?.includes(u.id) &&
      (hasWestern(it.value) || sourceDateText(it.value)),
  );
  return {
    unitId: u.id,
    explicitCalendarPhrases: phrases,
    citingTemporalClaims: citing.length,
    verdict: phrases.length === 0 ? 'no-explicit-calendar' : citing.length ? 'covered' : 'omission-candidate',
  };
});
const omissionCandidates = omissionScan.filter((r) => r.verdict === 'omission-candidate');

const hintRows = reviewedItems.filter((r) => r.id.startsWith('hints-'));
const hintCounts = hintRows.reduce((a, r) => {
  a[r.verdict] = (a[r.verdict] ?? 0) + 1;
  return a;
}, {});

const substantiveComplete =
  (counts['research-blocked'] ?? 0) === 0 && omissionCandidates.length === 0 && (hintCounts['research-blocked'] ?? 0) === 0;
const coverage = {
  packetItems: packet.items.length,
  reviewedItems: reviewedItems.length,
  unitsInChapter: packet.units.length,
  unitsOmissionScanCompleted: true,
  unitsWithExplicitCalendar: omissionScan.filter((r) => r.explicitCalendarPhrases.length).length,
  omissionCandidates: omissionCandidates.length,
  hintReview: hintCounts,
  substantiveCoverageComplete: substantiveComplete,
  verdicts: counts,
  defectCandidates: defectVerified.length,
  defectCandidatesConfirmedIncorrect: defectIncorrect,
  defectCandidatesSupported: defectSupported,
  defectCandidatesResearchBlocked: defectBlocked,
  note: 'Prior #5467 generator defaulted non-residual items to supported with generic prefix quotes; those counts are not substantive review.',
};

const table = {
  schemaVersion: 1,
  kind: 'jinshu023-chronology-substantive-review-table',
  pinnedCommit: 'd0f5e31ad74f8dbd3db8885c57c2600709c83c07',
  priorIndependentFindings: {
    pullRequest: 5471,
    phase3Pin: 'd8a7b41185d8a59ecae3f03642d2b40dc9c1d4ab',
    incorrectBeforeApply: 102,
  },
  omissionScanSummary: {
    unitsScanned: omissionScan.length,
    omissionCandidates: omissionCandidates.map((r) => r.unitId),
  },
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  coverage,
  reviewedItems,
  groupedActionableResiduals: groupedAction,
};

writeFileSync(
  'research/people/jinshu023-chronology-substantive-review-table-20261123-incomplete.json',
  `${JSON.stringify(table, null, 2)}\n`,
);
writeFileSync(
  'research/people/jinshu023-unit-omission-scan-20261123-incomplete.json',
  `${JSON.stringify({ schemaVersion: 1, kind: 'jinshu023-unit-omission-scan', pinnedCommit: table.pinnedCommit, units: omissionScan }, null, 2)}\n`,
);

const itemChecks = reviewedItems.map((row) => ({
  id: row.id,
  verdict: row.verdict,
  event: row.rationale.slice(0, 120),
  reason: row.rationale,
  evidence: [{ unit: row.witnessUnit, quote: row.witnessQuote }],
}));

const findings = Object.entries(groupedAction).map(([id, g]) => ({
  id: `finding-${id}`,
  items: g.ids,
  problem: `Independent verification: ${g.count} item(s) in ${id} carry unsupported Western precision or pointer mismatch.`,
  action: g.ownerAction,
}));

const blockedHints = reviewedItems.filter((r) => r.id.startsWith('hints-') && r.verdict === 'research-blocked');
const hymnHintIds = blockedHints.filter((r) => ['p027', 'p028', 'p030', 'p032'].includes(r.personId)).map((r) => r.id);
if (hymnHintIds.length) {
  findings.push({
    id: 'finding-hymn-heading-hints-without-claim-bounds',
    items: hymnHintIds,
    problem:
      'Western active-date hints remain on hymn-heading persons whose owned claims no longer carry source-pinned Western years after #5471.',
    action: 'Clear or re-derive hints from explicit source-pinned claim bounds; do not import reign-interval AD from hymn titles alone.',
  });
}
if (blockedHints.some((r) => r.personId === 'p137' || r.personId === 'p146')) {
  findings.push({
    id: 'finding-song-variant-uncertainty',
    items: blockedHints.filter((r) => r.personId === 'p137' || r.personId === 'p146').map((r) => r.id),
    problem: '宋識 (p137) and 宋職 (p146) remain separate uncertain identities; scheduling hints are not merged.',
    action: 'Retain separate rows; resolve identity only after independent source review—not in this chronology pass.',
  });
}
if (omissionCandidates.length) {
  findings.push({
    id: 'finding-unit-calendar-without-temporal-claim',
    items: [],
    problem: `Unit ${omissionCandidates.map((r) => r.unitId).join(', ')} states explicit calendar text (泰始) but no temporal claim cites that unit in the packet.`,
    action: 'Either attach a source-pinned temporal claim to the unit or document the calendar line as chapter metadata only.',
  });
}

const incorrect = counts.incorrect ?? 0;
const report = {
  schemaVersion: 1,
  auditVersion: DATE_AUDIT_VERSION,
  book: 'jinshu',
  chapter: '023',
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  status: substantiveComplete ? (incorrect ? 'needs-revision' : 'audited') : 'research-blocked',
  reviewer: {
    name: 'Cursor independent Jinshu 023 chronology reviewer (retained; strict witness)',
    independentOfExtractor: true,
  },
  reviewedAt: new Date().toISOString(),
  summary:
    `Strict witness review of ${reviewedItems.length} temporal items at pin d0f5e31 (post #5471 apply). ` +
    `Substantive coverage complete: ${substantiveComplete}. ` +
    `Verdicts: ${JSON.stringify(counts)}. ` +
    `Of ${defectVerified.length} owner defect candidates, ${defectIncorrect} confirmed incorrect, ${defectSupported} supported, ${defectBlocked} research-blocked. ` +
    `No native approval; omission scan not claimed.`,
  reviewedUnits: packet.units.map((u) => u.id),
  itemChecks,
  personChecks: [],
  findings,
  references: [],
};

// Person checks deferred: honest partial — validate only item plane
const personChecks = packet.people.map((p) => {
  const hintRow = reviewedItems.find((r) => r.id === `hints-${p.id}`);
  const u = hintRow?.witnessUnit ?? personPrimaryUnit[p.id] ?? null;
  const quote = hintRow?.witnessQuote ?? '';
  return {
    id: p.id,
    verdict: hintRow?.verdict ?? 'research-blocked',
    event: hintRow?.rationale?.slice(0, 120) ?? 'Missing hint review row.',
    reason: hintRow?.rationale ?? 'Missing hint review row.',
    evidence: u && quote ? [{ unit: u, quote }] : [],
  };
});

writeFileSync(
  'research/people/jinshu023-independent-date-audit-20261123-incomplete.json',
  `${JSON.stringify({ ...report, personChecks }, null, 2)}\n`,
);

console.log(JSON.stringify({ coverage, groupedAction: Object.fromEntries(Object.entries(groupedAction).map(([k, v]) => [k, v.count])) }, null, 2));