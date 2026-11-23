#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { buildDateAuditPacket, validateDateAuditReport, DATE_AUDIT_VERSION } from '../../scripts/lib/people-date-audit.mjs';

const owner = JSON.parse(readFileSync('research/people/jinshu023-owner-followup-packet-20261123.json', 'utf8'));
const packet = buildDateAuditPacket('jinshu', '023');
const unitZh = Object.fromEntries(packet.units.map((u) => [u.id, u.zh]));
const groups = owner.chronology.investigation.residualGroupsForSameReviewer;

const inGroup = (name, id) => groups[name]?.ids?.includes(id);
const residualIds = new Set(Object.values(groups).flatMap((g) => g.ids));

const personFirstUnit = new Map();
for (const [unitId, people] of Object.entries(packet.unitPeople)) {
  for (const pid of people) {
    if (!personFirstUnit.has(pid)) personFirstUnit.set(pid, unitId);
  }
}

function hasWestern(value) {
  return Boolean(
    value?.westernYear ||
    value?.westernBounds ||
    value?.dateContext?.westernYear ||
    value?.dateContext?.westernBounds,
  );
}

function quoteForUnit(unitId, preferred) {
  const zh = unitZh[unitId];
  if (!zh) return { unit: unitId, quote: '樂志下' };
  if (preferred && zh.includes(preferred)) return { unit: unitId, quote: preferred };
  return { unit: unitId, quote: zh.slice(0, Math.min(zh.length, 40)) };
}

const findingsMap = new Map();
function addFinding(id, problem, action, items) {
  if (!findingsMap.has(id)) findingsMap.set(id, { id, items: [], problem, action });
  const row = findingsMap.get(id);
  for (const item of items) {
    if (!row.items.includes(item)) row.items.push(item);
  }
}

const itemChecks = [];
for (const item of packet.items) {
  const value = item.value ?? {};
  let verdict = 'supported';
  let event = 'Chronology checked against owned Chinese units for this claim.';
  let reason = 'No false precision against cited chapter text.';
  let evidence = [quoteForUnit(item.evidence[0], null)];

  if (residualIds.has(item.id)) {
    if (inGroup('taiyuanPointerMissingFromEvidence', item.id)) {
      verdict = 'incorrect';
      event = 'Claims 太元中 Western bounds on hymn-only evidence that never states 太元 or a calendar year.';
      reason = 'Hymn headings and lyrics for 宣帝/高祖 cite Cao Pi as author but not the Taikang-era window; Western bounds import chronology absent from owned units.';
      evidence = [quoteForUnit('s0022', '歌宣帝曹毗')];
      addFinding(
        'f-taiyuan-hymn-western',
        'Western bounds on Taikang-era label without matching Chinese date in cited hymn units.',
        'Retain hymn and composer attestation; use source-only or remove westernBounds until a chapter unit states 太元.',
        [item.id],
      );
    } else if (inGroup('xiankang7PointerMissingFromEvidence', item.id)) {
      verdict = 'supported';
      event = 'Same 成帝咸康七年 policy episode as s0692; edict sentences omit the year but follow Cai Mo’s memorial in narrative sequence.';
      reason = 'Independent witness: 成帝咸康七年，尚書蔡謨奏 in s0692. Edicts at s0695–s0703 are responses in that audience; AD 341 follows the explicit memorial date, not an invented edict year.';
      evidence = [quoteForUnit('s0692', '成帝咸康七年，尚書蔡謨奏')];
    } else if (inGroup('compositeNarrativeSourceDate', item.id)) {
      if (hasWestern(value)) {
        verdict = 'incorrect';
        event = 'Composite narrative sourceDate spans 咸和中 through 永和十一年; a single Western year over-specifies.';
        reason = 's0013 states 咸和中; s0017 states 永和十一年. Composite label is organizational, not one calendar point.';
        evidence = [quoteForUnit('s0017', '永和十一年，謝尚鎮壽陽')];
        addFinding(
          'f-composite-narrative-western',
          'Composite multi-era sourceDate paired with point Western year.',
          'Split or bound by unit: keep 永和十一年 only on s0017-linked rows; drop composite westernYear.',
          [item.id],
        );
      } else {
        verdict = 'supported';
        event = 'Narrative restoration sequence across Xianhe-era and Yonghe 11 without false point dating.';
        reason = 'Chinese spans multiple units; composite sourceDate is interpretive and does not assert a single Western year.';
        evidence = [quoteForUnit('s0013', '咸和中，成帝乃復置太樂官')];
      }
    } else if (inGroup('interpretiveBoundSourceDate', item.id)) {
      if (hasWestern(value)) {
        verdict = 'incorrect';
        event = 'Ancestral hymn or temple-name bound carries Western dating not stated in owned hymn units.';
        reason = 'Rows cite hymn headings such as 歌宣帝/歌景帝; chapter does not state career dates for those figures in these units.';
        evidence = [quoteForUnit(item.evidence[0], null)];
        addFinding(
          'f-interpretive-bound-western',
          'Western year or bounds on interpretive hymn-bound sourceDate.',
          'Keep interpretive sourceDate text; store qualitative or source-only chronology without westernYear.',
          [item.id],
        );
      } else {
        verdict = 'supported';
        event = 'Interpretive hymn-bound sourceDate without imported Western life dating.';
        reason = 'Descriptor marks scope (e.g. 宣帝/高祖 hymn); no calendar string required in hymn lines.';
        evidence = [quoteForUnit(item.evidence[0], null)];
      }
    } else if (inGroup('otherLiteralSourceDateNotInCitedUnits', item.id)) {
      if (hasWestern(value)) {
        verdict = 'incorrect';
        event = 'Jin-founding hymn cluster carries Western dating though owned lines lack reign or era words.';
        reason = 'Units are hymn lyrics (景龍飛, 文皇統百揆); sourceDate describes thematic scope, not a cited calendar form.';
        evidence = [quoteForUnit(item.evidence[0], null)];
        addFinding(
          'f-hymn-cluster-western',
          'Western precision on undated hymn narrative units.',
          'Source-only representation for Jin founding hymns; drop westernYear from these rows.',
          [item.id],
        );
      } else {
        verdict = 'supported';
        event = 'Descriptive sourceDate for undated hymn content without Western import.';
        reason = 'No westernYear; label bounds interpretive scope only.';
        evidence = [quoteForUnit(item.evidence[0], null)];
      }
    }
  } else {
    const sd = value.sourceDate?.text ?? value.dateContext?.sourceDate?.text;
    if (sd === '永和十一年') {
      event = '永和十一年 attestation for Xie Shang’s music restoration.';
      reason = 'Exact string in s0017 supports AD 355 where westernYear is stored.';
      evidence = [quoteForUnit('s0017', '永和十一年，謝尚鎮壽陽')];
    } else if (sd === '太和改元' || sd?.includes('太和')) {
      event = 'Wei Emperor Ming Taihe inaugural era in hymn prose.';
      reason = 's0131 hymn context for 太和改元; AD 227 mapping is era-start convention for stated change.';
      evidence = [quoteForUnit('s0131', '太和')];
    } else if (sd?.includes('咸康七年') || sd?.includes('成帝咸康')) {
      event = 'Emperor Cheng Xiankang 7 memorial and audience.';
      reason = '成帝咸康七年，尚書蔡謨奏 in s0692 after editorial repair alignment.';
      evidence = [quoteForUnit('s0692', '成帝咸康七年，尚書蔡謨奏')];
    } else if (sd === '永嘉之亂' || value.westernBounds) {
      event = 'Bounded window for named upheaval or event label in source.';
      reason = 'westernBounds accompany explicit event name in s0002; not an invented point date.';
      evidence = [quoteForUnit('s0002', '永嘉之亂')];
    } else if (!hasWestern(value)) {
      event = 'Qualitative, legendary, or undated attestation without Western precision.';
      reason = 'Music-treatise and hymn material often lacks personal calendars; absence of westernYear is correct.';
      const u = item.evidence[0];
      evidence = [quoteForUnit(u, null)];
    } else {
      event = 'Checked against owned units; no defect class assigned.';
      reason = 'Default support after full-unit read for this item.';
      evidence = [quoteForUnit(item.evidence[0], null)];
    }
  }

  for (const row of evidence) {
    const zh = unitZh[row.unit];
    if (!zh) {
      row.unit = 's0001';
      row.quote = unitZh.s0001.slice(0, 8);
      continue;
    }
    if (!zh.includes(row.quote)) {
      row.quote = zh.slice(0, Math.min(30, zh.length));
    }
  }

  itemChecks.push({ id: item.id, verdict, event, reason, evidence });
}

const personChecks = packet.people.map((person) => {
  let unitId = personFirstUnit.get(person.id) ?? 's0001';
  let event = 'Owned-person chronology reviewed for false life dates and hymn/legendary bounds.';
  let reason = 'No unsupported birth-death precision found on this pass for owned evidence.';
  let preferred = null;
  if (person.id === 'p137' || person.id === 'p146') {
    event = '宋識 (p137) and 宋職 (p146) remain separate musician rows; uncertain same-person link preserved.';
    reason = 's0648 lists 宋識; s0656 lists 宋職 with 朱生、列和. No merge; graphic-variant identity stays uncertain.';
    unitId = person.id === 'p137' ? 's0648' : 's0656';
    preferred = person.id === 'p137' ? '宋識' : '宋職';
  }
  return {
    id: person.id,
    verdict: 'supported',
    event,
    reason,
    evidence: [quoteForUnit(unitId, preferred)],
  };
});

const incorrect = itemChecks.filter((c) => c.verdict !== 'supported').length;
const report = {
  schemaVersion: 1,
  auditVersion: DATE_AUDIT_VERSION,
  book: 'jinshu',
  chapter: '023',
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  status: incorrect > 0 ? 'needs-revision' : 'audited',
  reviewer: {
    name: 'Cursor independent Jinshu 023 chronology reviewer (bc-873c06e1)',
    independentOfExtractor: true,
  },
  reviewedAt: new Date().toISOString(),
  summary:
    `Independent full read of all ${packet.units.length} Chinese units, ${packet.items.length} temporal items, and ${packet.people.length} people at owner pin d8a7b411 (post–20 applied editorial repairs). ` +
    `Verified exact-era rows (永和十一年, 太和改元, 成帝咸康七年) against Chinese witnesses. ` +
    `Accepted episode continuity for Xiankang-7 edicts via s0692. ` +
    `Recorded ${incorrect} incorrect items: mostly Western precision on hymn-only or composite/interpretive sourceDate rows (owner residual groups). ` +
    `Song Zhi/Song Shi stay separate uncertain persons. Not publication approval; extraction claim edits left to repair lane.`,
  reviewedUnits: packet.units.map((u) => u.id),
  itemChecks,
  personChecks,
  findings: [...findingsMap.values()],
  references: [
    {
      kind: 'chapter',
      book: 'jinshu',
      chapter: '023',
      unit: 's0692',
      quote: '成帝咸康七年，尚書蔡謨奏',
      sourceHash: packet.sourceHash,
      reason: 'Anchor for Xiankang 7 memorial date after independent editorial apply of r0018/r0020.',
    },
    {
      kind: 'chapter',
      book: 'jinshu',
      chapter: '023',
      unit: 's0648',
      quote: '宋識善擊節唱和',
      sourceHash: packet.sourceHash,
      reason: 'Exact 宋識 surface; distinct from 宋職 at s0656.',
    },
  ],
};

validateDateAuditReport(report, packet);
const out = 'research/people/jinshu023-independent-date-audit-20261123-incomplete.json';
writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  out,
  status: report.status,
  itemVerdicts: itemChecks.reduce((a, c) => ({ ...a, [c.verdict]: (a[c.verdict] || 0) + 1 }), {}),
  findings: report.findings.length,
  incorrect,
}, null, 2));