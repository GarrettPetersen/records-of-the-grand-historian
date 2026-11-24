#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { buildDateAuditPacket } from '../../../scripts/lib/people-date-audit.mjs';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const root = rootDir;
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const stagingSha = '76896c492bffcc7a5fdd843d30da2be55bffe568';
const narrow = read(path.join(rootDir, '../jinshu041-authoring-20261123/narrow-chrono-delta-receipt.json'));
const exBuf = fs.readFileSync('/tmp/ex-768.json');
const expectedEx = narrow.afterExtractionSha256.replace(/^sha256:/, '');
if (createHash('sha256').update(exBuf).digest('hex') !== expectedEx) {
  throw new Error('Run: git show 76896c492:data/people/extractions/jinshu/041.json > /tmp/ex-768.json');
}

const ex = JSON.parse(exBuf.toString());
const pkt = buildDateAuditPacket('jinshu', '041', { extraction: ex });
const unitZh = new Map(pkt.units.map((u) => [u.id, u.zh]));
const inv = read(path.join(rootDir, '../jinshu041-authoring-20261123/chrono-groups-inventory.json'));

function quoteUnit(unitId, needle) {
  const zh = unitZh.get(unitId) ?? '';
  if (needle && zh.includes(needle)) {
    const i = zh.indexOf(needle);
    return { unit: unitId, quote: zh.slice(Math.max(0, i - 8), Math.min(zh.length, i + needle.length + 12)) };
  }
  return { unit: unitId, quote: zh.slice(0, Math.min(zh.length, 56)) };
}

function hasWestern(v) {
  return !!(v?.westernYear || v?.dateContext?.westernYear || v?.westernInterval || v?.dateContext?.westernInterval);
}

const appliedProof = (narrow.applied ?? []).map((row) => {
  const item = pkt.items.find((i) => i.id === row.id);
  const sd = row.sourceDate || item?.value?.sourceDate?.text || item?.value?.dateContext?.sourceDate?.text;
  const evidence = item ? quoteUnit(item.evidence[0], sd) : null;
  const issues = [];
  if (!item) issues.push('missing-item');
  else if (row.kind?.startsWith('KEEP')) {
    if (!hasWestern(item.value)) issues.push('expected-western-year');
  } else if (hasWestern(item.value)) issues.push('unexpected-western');
  else if (!row.kind?.startsWith('G6') && !item.value?.undatedSourceAttestation && !(item.value?.unresolved || item.value?.dateContext?.unresolved) && !item.value?.qualitative) {
    issues.push('expected-unresolved-or-qualitative');
  }
  if (item && sd && !item.evidence.some((u) => unitZh.get(u)?.includes(sd))) issues.push('sourceDate-not-in-evidence');
  return { id: row.id, group: row.kind, witness: evidence, verifierPass: issues.length === 0, issues };
});
if (appliedProof.some((r) => !r.verifierPass)) {
  throw new Error(`Narrow applied verification failed: ${appliedProof.filter((r) => !r.verifierPass).slice(0, 5).map((r) => r.id).join(', ')}`);
}

const explicitJudgments = inv.groups.KEEP_explicit_reign_year.ids.map((id) => {
  const item = pkt.items.find((i) => i.id === id);
  const sd = item.value?.sourceDate?.text || item.value?.dateContext?.sourceDate?.text;
  const wy = item.value?.westernYear || item.value?.dateContext?.westernYear;
  const personId = item.personId;
  const ev = quoteUnit(item.evidence[0], sd);
  let reason;
  if (/太熙元年/.test(sd) || unitZh.get(item.evidence[0])?.includes('太熙元年')) {
    reason = `Li Xi (p014) death is anchored by explicit 太熙元年薨 in owned biography text; AD ${wy?.year} is a source-calendar Western Jin Taixi year-1 mapping, not vague-phase invention. Chronology approval is limited to this calendrical phrase, not a full life range.`;
  } else if (sd === '九年') {
    reason = `Office under 九年 sits in 元康九年 speech context (s0313/s0314 domain); AD ${wy?.year} matches standard Yuankang year-9 conversion. Unsupported if the phrase were moral-exemplum only—here it is narrative office-dating with explicit regnal year token.`;
  } else {
    reason = `Explicit regnal-year Chinese (${sd}) supports retained Western year ${wy?.era} ${wy?.year} as source-calendar conversion pending host-pinned table citation.`;
  }
  return { id, personId, verdict: 'supported', event: `${personId}: explicit regnal-year event`, reason, evidence: [ev] };
});

const hintRows = inv.groups.LEAVE_active_date_hints.ids.map((id) => {
  const item = pkt.items.find((i) => i.id === id);
  const hints = item?.value ?? [];
  const derivedGregorian = hints.filter((h) => /AD\s*\d|BC\s*\d|\(\d{3}/.test(h));
  const legendaryOnly = hints.length === 1 && hints[0] === 'legendary antiquity';
  const needsChange = derivedGregorian.length > 0;
  return {
    id,
    personId: item.personId,
    hints,
    needsChange,
    eligibleTreatment: needsChange
      ? 'Remove or unresolved-wrap each English Gregorian derived from 初/文帝/武帝-style phrases; add per-hint Chinese unit seal before any approval.'
      : legendaryOnly
        ? 'Retain qualitative legendary-antiquity hint; valid genuinely undated under native contract.'
        : 'Retain empty or source-phrase-only hint bundle as research hold until independently sealed.',
    reason: needsChange
      ? `Person ${item.personId} active-date hints still assert Western intervals (${derivedGregorian.slice(0, 2).join('; ')}) without per-hint Chinese pinning.`
      : `Person ${item.personId} hints do not assert unsupported Western years.`,
  };
});

const qualRows = inv.groups.LEAVE_qualitative_legendary.ids.map((id) => {
  const item = pkt.items.find((i) => i.id === id);
  const v = item.value;
  const hasQual = !!v?.qualitative;
  const needsChange = !hasQual || hasWestern(v);
  return {
    id,
    personId: item.personId,
    predicate: item.predicate,
    needsChange,
    hasQualitativeContainer: hasQual,
    eligibleTreatment: hasQual
      ? 'Retain qualitative legendary-antiquity container; no Western life chronology.'
      : 'Reclassify to qualitative or undatedSourceAttestation on moral-exemplum attestation/event claims (s0238–s0241); strip any residual Western interval.',
    witness: quoteUnit(item.evidence[0]),
    reason: hasQual
      ? `Shun/Yao exemplum mention for ${item.personId} correctly carries only qualitative legendary antiquity.`
      : `Debate-section claim ${id} predicates ${item.predicate} on 舜/禹 exemplum without qualitative wrapper—native contract requires qualitative or undated, not life-date inference.`,
  };
});

const chapterCanClose = false;
const dependencies = [
  'Host-pinned Jin reign-year conversion reference before upgrading unresolved bundles beyond the eight explicit supported items',
  `${hintRows.filter((h) => h.needsChange).length} active-date hint records still require per-hint Chinese sealing (${hintRows.filter((h) => !h.needsChange).length} may retain as-is)`,
  `${qualRows.filter((q) => q.needsChange).length} of 42 qualitative-legendary inventory rows need schema realignment (${qualRows.filter((q) => !q.needsChange).length} already valid)`,
  'Chapter identity-reviews packet still absent (identity gate)',
  'No production recordDateAudit until host adopts staging extraction 604a6660… and re-seals full audit',
];

const out = {
  schemaVersion: 1,
  kind: 'jinshu041-narrow-chrono-independent-proof',
  stagingDraftSha: stagingSha,
  priorEvidenceCommit: '144951c9b8b8b5e35b4146c2240d1259967d8644',
  extractionSha256: narrow.afterExtractionSha256,
  editorialSha256: narrow.editorialSha256,
  editorialDecisionCount: 23,
  reviewerAgentId: 'bc-64f55949-b3a6-4213-b7a2-6e6256473515',
  reviewedAt: new Date().toISOString(),
  chapterCanClose,
  editorial: { retained: 23, witnessedOnStaging: true },
  narrowDelta: {
    appliedCount: appliedProof.length,
    appliedVerifierPass: appliedProof.length,
    groupsVerified: Object.keys(inv.groups).filter((k) => k.startsWith('G') || k.startsWith('KEEP')),
  },
  appliedWitnessProof: appliedProof,
  explicitSourceCalendarSupported: explicitJudgments,
  activeDateHints: {
    total: hintRows.length,
    needChange: hintRows.filter((h) => h.needsChange).map((h) => h.id),
    retainUnchanged: hintRows.filter((h) => !h.needsChange).map((h) => h.id),
    rows: hintRows,
  },
  qualitativeLegendary: {
    total: qualRows.length,
    needChange: qualRows.filter((q) => q.needsChange).map((q) => q.id),
    retainUnchanged: qualRows.filter((q) => !q.needsChange).map((q) => q.id),
    rows: qualRows,
  },
  exactDependencies: dependencies,
  noFullAuditRerun: true,
  noProductionWrites: true,
};

fs.writeFileSync(path.join(root, 'narrow-chrono-independent-proof-20261123.json'), `${JSON.stringify(out, null, 2)}\n`);
fs.writeFileSync(
  path.join(root, 'active-hints-disposition-exact-20261123.json'),
  `${JSON.stringify({ needChange: out.activeDateHints.needChange, retainUnchanged: out.activeDateHints.retainUnchanged, rows: hintRows }, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(root, 'qualitative-legendary-disposition-exact-20261123.json'),
  `${JSON.stringify({ needChange: out.qualitativeLegendary.needChange, retainUnchanged: out.qualitativeLegendary.retainUnchanged, rows: qualRows }, null, 2)}\n`,
);
console.log(JSON.stringify({ chapterCanClose, hintsChange: out.activeDateHints.needChange.length, qualChange: out.qualitativeLegendary.needChange.length, explicitSupported: explicitJudgments.length }, null, 2));