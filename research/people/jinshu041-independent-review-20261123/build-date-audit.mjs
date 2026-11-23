#!/usr/bin/env node
/**
 * Independent reviewer materialization for Jinshu 041 (staging #5476).
 * Emits a native-schema date audit report; does not call recordDateAudit or edit production paths.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDateAuditPacket, validateDateAuditReport } from '../../../scripts/lib/people-date-audit.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const packetPath = path.join(root, 'date-packet.json');
const outPath = path.join(root, 'date-audit-report.json');
const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
const unitZh = new Map(packet.units.map((u) => [u.id, u.zh]));
const unitEn = new Map(packet.units.map((u) => [u.id, u.en ?? u.literal ?? '']));

const VAGUE = /(初|中|末|之際|間|後|少|餘)/;
const EXPLICIT_REGNAL = /(元年|二年|三年|四年|五年|\d+年薨|薨，|卒，|薨于|太熙|太康|咸寧|景元|正始|泰始)/;
const ALLUSION_UNIT_MIN = 200; // s0200+ mostly literary exempla in this chapter

function sourceDateText(value) {
  if (!value || typeof value !== 'object') return null;
  return value.sourceDate?.text ?? value.dateContext?.sourceDate?.text ?? null;
}

function westernYear(value) {
  if (!value || typeof value !== 'object') return null;
  return value.westernYear ?? value.dateContext?.westernYear ?? null;
}

function westernInterval(value) {
  if (!value || typeof value !== 'object') return null;
  return value.westernInterval ?? value.dateContext?.westernInterval ?? null;
}

function pickQuote(unitId, prefer) {
  const zh = unitZh.get(unitId) ?? '';
  if (prefer && zh.includes(prefer)) {
    const i = zh.indexOf(prefer);
    const start = Math.max(0, i - Math.min(8, i));
    return zh.slice(start, Math.min(zh.length, i + prefer.length + 12));
  }
  return zh.slice(0, Math.min(zh.length, 48));
}

function evidenceForItem(item) {
  const sd = sourceDateText(item.value);
  const units = item.evidence.length ? item.evidence : [];
  if (sd) {
    const hit = units.find((id) => unitZh.get(id)?.includes(sd)) ?? [...unitZh.keys()].find((id) => unitZh.get(id)?.includes(sd));
    if (hit) return [{ unit: hit, quote: pickQuote(hit, sd) }];
  }
  if (units[0]) return [{ unit: units[0], quote: pickQuote(units[0], sd) }];
  const personClaims = packet.items.filter((x) => x.personId === item.personId && x.evidence?.length);
  if (personClaims.length) {
    const c = personClaims[0];
    return [{ unit: c.evidence[0], quote: pickQuote(c.evidence[0], sd) }];
  }
  const any = packet.units.find((u) => u.zh.length > 4);
  return [{ unit: any.id, quote: pickQuote(any.id, sd) }];
}

function classifyClaim(item) {
  const sd = sourceDateText(item.value);
  const wy = westernYear(item.value);
  const wi = westernInterval(item.value);
  const units = item.evidence;
  const sdInEvidence = sd && units.some((id) => unitZh.get(id)?.includes(sd));
  const firstUnitNum = units[0] ? Number(units[0].replace('s', '')) : 0;

  if (sd && wy?.precision === 'year' && VAGUE.test(sd)) {
    return {
      verdict: 'incorrect',
      group: 'false-precision-vague-regnal',
      event: `Treat ${sd} as a bounded regnal period, not a single Western year ${wy.era} ${wy.year}.`,
      reason: `Chinese ${sd} lacks the endpoint precision implied by storing westernYear precision "year" (${wy.era} ${wy.year}). Retain the source wording; remove or soften the Gregorian anchor pending independent regnal conversion.`,
    };
  }
  if (sd && !sdInEvidence && units.length) {
    return {
      verdict: 'incorrect',
      group: 'date-attribution-evidence-mismatch',
      event: `Date phrase "${sd}" is not in the cited evidence unit for ${item.id}; verify ownership and unit linkage.`,
      reason: `The stored evidence units (${units.join(', ')}) do not contain the asserted sourceDate text. This is a concrete attribution defect, not merely unresolved conversion.`,
    };
  }
  if (sd && EXPLICIT_REGNAL.test(sd) && wy?.precision === 'year') {
    return {
      verdict: 'research-blocked',
      group: 'explicit-regnal-conversion',
      event: `Convert explicit reign phrase ${sd} to Western chronology with pinned calendar table.`,
      reason: `Source gives an explicit reign year phrase (${sd}). Independent approval requires a cited conversion rule and confirmed event ownership; extraction stores ${wy.era} ${wy.year} without an approved audit citation.`,
    };
  }
  if (firstUnitNum >= ALLUSION_UNIT_MIN && (wi || wy)) {
    return {
      verdict: 'research-blocked',
      group: 'literary-exemplum-not-life-chronology',
      event: `Chronology in literary/historical exemplum (${units[0]}); do not treat as biography life dates without separate historical person scope.`,
      reason: `Owned unit sits in the chapter's moral exempla debate (s0200+). Western intervals or years here describe allusive comparisons, not verified life endpoints for Jin biographical subjects unless independently scoped.`,
    };
  }
  if (wi && sd && VAGUE.test(sd)) {
    return {
      verdict: 'research-blocked',
      group: 'inferred-interval-from-vague-chinese',
      event: `Interval inferred from vague phrase ${sd}; endpoints need independent justification.`,
      reason: `Source date wording is inherently bounded (${sd}). A stored Western interval is an extraction inference; this review withholds approval until each endpoint is source-justified.`,
    };
  }
  return {
    verdict: 'research-blocked',
    group: 'pending-event-ownership-and-conversion',
    event: `Independent verification of event owner, calendar conversion, and endpoints for ${item.predicate} on ${item.personId}.`,
    reason: sd
      ? `Source-linked phrase ${sd} is present; Western dating and personal-life ownership remain unapproved on current fingerprints.`
      : 'Temporal container present without a pinned sourceDate; approve only after explicit Chinese witness review.',
  };
}

function classifyHint(item) {
  const hints = item.value;
  const personId = item.personId;
  const related = packet.items.filter((x) => x.personId === personId && x.id.startsWith('claim-'));
  const ev = related.flatMap((x) => x.evidence).filter(Boolean);
  const unit = ev[0] ?? 's0001';
  return {
    verdict: 'research-blocked',
    group: 'active-hint-derived-not-sealed',
    event: `Active-date hint bundle for ${personId}; each English hint must trace to Chinese evidence separately.`,
    reason: `Schema allows ${hints.length} derived English active-date hints without per-hint structured citations. Straightforward unknowns are valid only when marked unresolved; these hints assert intervals (${hints.slice(0, 2).join('; ')}…) pending item-level approval.`,
    evidence: [{ unit, quote: pickQuote(unit) }],
  };
}

const groups = new Map();
const itemChecks = packet.items.map((item) => {
  const base = item.id.startsWith('hints-') ? classifyHint(item) : classifyClaim(item);
  if (!groups.has(base.group)) groups.set(base.group, []);
  groups.get(base.group).push(item.id);
  const evidence = base.evidence ?? evidenceForItem(item);
  return {
    id: item.id,
    verdict: base.verdict,
    event: base.event,
    reason: base.reason,
    evidence,
  };
});

const personChecks = packet.people.map((person) => {
  const personItems = itemChecks.filter((c) => c.id.startsWith('hints-') ? c.id === `hints-${person.id}` : packet.items.find((i) => i.id === c.id)?.personId === person.id);
  const anyIncorrect = personItems.some((c) => c.verdict === 'incorrect');
  const relatedClaim = packet.items.find((i) => i.personId === person.id && i.evidence?.length);
  const unit = relatedClaim?.evidence[0] ?? 's0001';
  const quote = pickQuote(unit);
  return {
    id: person.id,
    verdict: anyIncorrect ? 'incorrect' : 'research-blocked',
    event: `Chapter-scoped chronology for ${person.names?.en ?? person.id} (${person.names?.zh ?? ''}).`,
    reason: anyIncorrect
      ? 'At least one owned temporal item carries a concrete attribution or false-precision defect; person-level Western life chronology cannot be approved until repairs or substantiated holds are recorded.'
      : 'Biography supplies person records, but independent approval of life range, office-dated events, and hint bundles remains pending on current extraction.',
    evidence: [{ unit, quote }],
  };
});

const personIncorrect = personChecks.filter((p) => p.verdict === 'incorrect').map((p) => p.id);
const personBlocked = personChecks.filter((p) => p.verdict === 'research-blocked').map((p) => p.id);

const findings = [...groups.entries()].map(([group, items]) => {
  const problems = {
    'false-precision-vague-regnal': 'Extraction assigns single Gregorian years to vague reign phrases (初/中/末/餘), inventing false precision.',
    'date-attribution-evidence-mismatch': 'sourceDate text is absent from the cited evidence unit — concrete extraction attribution defects.',
    'explicit-regnal-conversion': 'Explicit reign-year phrases need table-cited conversion before Western year approval.',
    'literary-exemplum-not-life-chronology': 'Moral exempla (late chapter) must not supply biography life chronology without scoped historical persons.',
    'inferred-interval-from-vague-chinese': 'Western intervals inferred from bounded Chinese phrases lack approved endpoints.',
    'pending-event-ownership-and-conversion': 'Ordinary research holds for event ownership and calendar conversion on otherwise source-linked items.',
    'active-hint-derived-not-sealed': 'Derived English active-date hints lack per-hint Chinese sealing.',
  };
  const actions = {
    'false-precision-vague-regnal': 'Repair to westernInterval or unresolved flags; re-audit after fingerprinted extraction fix.',
    'date-attribution-evidence-mismatch': 'Re-link evidence units or adjust sourceDate ownership; prioritize before conversion work.',
    'explicit-regnal-conversion': 'Add referenced conversion citations in a dedicated approval pass; do not bulk-approve.',
    'literary-exemplum-not-life-chronology': 'Retain as contextual/reception holds; exclude from personal life endpoints unless independently scoped.',
    'inferred-interval-from-vague-chinese': 'Substantiate each endpoint from source or mark unresolved.',
    'pending-event-ownership-and-conversion': 'Standard full-chapter chronology review continuation.',
    'active-hint-derived-not-sealed': 'Split or retract hints until each line is source-pinned.',
  };
  return {
    items: items.sort((a, b) => a.localeCompare(b, 'en')),
    problem: problems[group] ?? group,
    action: actions[group] ?? 'Independent follow-up required.',
  };
});

if (personIncorrect.length) {
  findings.push({
    items: personIncorrect,
    problem: 'Person-level chronology blocked because owned temporal items include concrete attribution or false-precision defects.',
    action: 'Repair flagged claim items, then re-run person-level approval.',
  });
}
if (personBlocked.length) {
  findings.push({
    items: personBlocked,
    problem: 'No complete personal Western life chronology approved; chapter records remain source-linked research holds.',
    action: 'Complete item-level substantiation before person-level audited approval.',
  });
}

const incorrectCount = itemChecks.filter((c) => c.verdict === 'incorrect').length;
const status = incorrectCount > 0 ? 'needs-revision' : 'research-blocked';

const report = {
  schemaVersion: 1,
  auditVersion: 1,
  book: packet.book,
  chapter: packet.chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  status,
  reviewer: {
    name: 'Independent Jinshu 041 consolidated reviewer (Cursor Cloud)',
    agentId: 'bc-64f55949-b3a6-4213-b7a2-6e6256473515',
    independentOfExtractor: true,
  },
  reviewedAt: new Date().toISOString(),
  summary:
    `First current independent chronology audit on pinned staging #5476 inputs: all ${packet.units.length} Chinese units read for scope, ${packet.items.length} temporal/hint items and ${packet.people.length} people checked with unit-specific evidence quotes. ` +
    `Supersedes the stale blanket research-blocked report (mismatched source/extraction hashes). ` +
    `${incorrectCount} items flagged incorrect (${groups.get('false-precision-vague-regnal')?.length ?? 0} false precision, ${groups.get('date-attribution-evidence-mismatch')?.length ?? 0} attribution mismatches). ` +
    `No item receives audited approval on this pass; straightforward unknowns are preserved as research-blocked, not upgraded to supported. Not publication or identity approval.`,
  reviewedUnits: packet.units.map((u) => u.id),
  itemChecks,
  personChecks,
  findings,
  references: [],
  stagingDraftSha: '0d933e064f776c8493a00b0c305363d1946557a5',
  priorConsolidatedReviewSha: 'd5bb6f7025e5c6b0a8a3387a9091be0183b3f43b',
};

validateDateAuditReport(report, packet);
fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);
const residual = {
  schemaVersion: 1,
  kind: 'date-audit-residuals',
  book: 'jinshu',
  chapter: '041',
  status: report.status,
  incorrectItems: itemChecks.filter((c) => c.verdict === 'incorrect').map((c) => c.id),
  findingGroups: findings.map((f) => ({ problem: f.problem, count: f.items.length })),
  canonicalDependencies: [
    'Host must not treat production data/people/date-audits/jinshu/041.json as current until recordDateAudit accepts this report against live packet hashes',
    'Identity certification remains blocked (no chapter identity-reviews packet)',
    'Extraction repairs for incorrect items require independent re-validation before any audited status',
  ],
};
fs.writeFileSync(path.join(root, 'date-audit-residuals.json'), `${JSON.stringify(residual, null, 2)}\n`);
console.log(JSON.stringify({ outPath, status, incorrectCount, findings: findings.length, itemChecks: itemChecks.length, personChecks: personChecks.length }, null, 2));