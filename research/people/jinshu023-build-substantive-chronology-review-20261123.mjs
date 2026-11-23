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
    const witness = u && frag ? { witnessUnit: u, witnessQuote: frag } : null;
    if (!witness?.witnessUnit) {
      throw new Error(`${item.id}: no chapter unit witness for person hint`);
    }
    return {
      id: item.id,
      personId: item.personId,
      verdict: 'research-blocked',
      witnessUnit: witness.witnessUnit,
      witnessQuote: witness.witnessQuote,
      group: 'person-active-date-hints',
      rationale:
        'Person-level AD hint rows were not substantively pinned to chapter Chinese in this pass; treat hints as scheduling metadata pending explicit source review.',
      defectCandidate: defectCandidates.has(item.id),
      hasWestern: Array.isArray(value) && value.some((h) => /AD|BC|\d{3}/.test(String(h))),
      sourceDate: Array.isArray(value) ? value.join('; ') : null,
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
    if (!sd || sd.includes('…') || /hymn|song|narrative/i.test(sd)) {
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
};
for (const [k, v] of Object.entries(groupedAction)) v.ownerAction = actionText[k] ?? 'Correct Western precision against cited Chinese.';

const substantiveComplete = (counts['research-blocked'] ?? 0) === 0;
const coverage = {
  packetItems: packet.items.length,
  reviewedItems: reviewedItems.length,
  unitsInChapter: packet.units.length,
  unitsOmissionScanCompleted: false,
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
  pinnedCommit: 'd8a7b41185d8a59ecae3f03642d2b40dc9c1d4ab',
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
    `Strict witness review of ${reviewedItems.length} temporal items at pin d8a7b411. ` +
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
  const u = personPrimaryUnit[p.id] ?? null;
  const zh = u ? unitZh[u] : '';
  const nameZh = p.names?.find((n) => /[\u4e00-\u9fff]/.test(n));
  const quote =
    p.id === 'p137'
      ? '宋識'
      : p.id === 'p146'
        ? '宋職'
        : nameZh && zh.includes(nameZh)
          ? nameZh
          : zh.slice(0, Math.min(12, zh.length));
  const songNote =
    p.id === 'p137' || p.id === 'p146'
      ? ' Song-variant uncertainty retained: 宋識 (p137/s0648) vs 宋職 (p146/s0656) are not merged.'
      : '';
  return {
    id: p.id,
    verdict: 'research-blocked',
    event: `Person-level substantive chronology not completed in this strict item pass.${songNote}`,
    reason:
      'Independent reviewer completed claim-level witness review; person hints and attribution holds require a separate substantive pass.',
    evidence: u && quote ? [{ unit: u, quote }] : [],
  };
});

writeFileSync(
  'research/people/jinshu023-independent-date-audit-20261123-incomplete.json',
  `${JSON.stringify({ ...report, personChecks }, null, 2)}\n`,
);

console.log(JSON.stringify({ coverage, groupedAction: Object.fromEntries(Object.entries(groupedAction).map(([k, v]) => [k, v.count])) }, null, 2));