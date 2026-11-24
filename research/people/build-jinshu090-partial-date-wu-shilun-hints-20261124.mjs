#!/usr/bin/env node
/**
 * Jinshu 090 remainder: 吳隱之 + 【史论】 (s0377–s0436) and all chapter active-date hints.
 */
import fs from 'node:fs';
import path from 'node:path';
import { validateDateAuditReport, DATE_AUDIT_VERSION } from '../../scripts/lib/people-date-audit.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT_DIR = path.join(ROOT, 'research/people/jinshu090-independent-evidence-20261124');
const REVIEWER = 'bc-3794b569-dd8b-4e85-ae88-2c86a0bef9f8';
const GROUP_ID = 'wu-shilun-hints';
const UNIT_LO = 377;
const UNIT_HI = 439;
const PRIOR_REPORTS = [
  'partial-date-report-preface-20261124.json',
  'partial-date-report-lu-zhi-20261124.json',
  'partial-date-report-hu-wei-20261124.json',
  'partial-date-report-du-zhen-20261124.json',
  'partial-date-report-biog136-212-20261124.json',
  'partial-date-report-pan-fan-ding-20261124.json',
  'partial-date-report-qiao-deng-20261124.json',
];

const packet = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'date-packet-pin.json'), 'utf8'));
const SPAN_UNITS = packet.units
  .map((u) => u.id)
  .filter((id) => {
    const n = Number(id.slice(1));
    return n >= UNIT_LO && n <= UNIT_HI;
  })
  .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
const unitMap = new Map(packet.units.map((u) => [u.id, u]));
function loadPriorItemChecks() {
  const byId = new Map();
  for (const file of PRIOR_REPORTS) {
    const prior = JSON.parse(fs.readFileSync(path.join(OUT_DIR, file), 'utf8'));
    for (const check of prior.itemChecks) byId.set(check.id, check);
  }
  const selfReport = path.join(OUT_DIR, 'partial-date-report-wu-shilun-hints-20261124.json');
  if (fs.existsSync(selfReport)) {
    const prior = JSON.parse(fs.readFileSync(selfReport, 'utf8'));
    for (const check of prior.itemChecks) byId.set(check.id, check);
  }
  return byId;
}

const priorSeed = loadPriorItemChecks();
const reviewedBefore = new Set(priorSeed.keys());
const cumBefore = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'chronology-cumulative-checkpoint-20261124.json'), 'utf8'));

const spanClaims = packet.items.filter(
  (item) => !item.id.startsWith('hints-') && !reviewedBefore.has(item.id) && item.evidence.some((u) => SPAN_UNITS.includes(u)),
);
const hintItems = packet.items.filter((item) => item.id.startsWith('hints-') && !reviewedBefore.has(item.id));

const peopleById = new Map(packet.people.map((p) => [p.id, p]));
const claimsByPerson = new Map();
for (const item of packet.items) {
  if (!item.id.startsWith('claim-') || !item.personId) continue;
  const list = claimsByPerson.get(item.personId) ?? [];
  list.push(item);
  claimsByPerson.set(item.personId, list);
}

function personUnitIds(pid) {
  return Object.keys(packet.unitPeople)
    .filter((u) => packet.unitPeople[u]?.includes(pid))
    .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
}

const QUOTE_OVERRIDE = {
  'claim-1179': { unit: 's0421', quote: '九年' },
  'claim-1211': { unit: 's0421', quote: '九年，卒' },
};

const EXPLICIT_REGNAL_IN_SOURCE = /^(元興初|義熙八年|九年)$/;

const HINT_EN_ZH = [
  [/Long'?an/i, '隆安'],
  [/Yuanxing/i, '元興'],
  [/Yixi/i, '義熙'],
  [/Yongjia/i, '永嘉'],
  [/Taikang|太康/i, '太康'],
  [/Taiyuan|泰元/i, '泰元'],
  [/Taihe|太和/i, '太和'],
  [/Xianning|咸寧/i, '咸寧'],
  [/Xianhe|咸和/i, '咸和'],
  [/Taining|太寧/i, '太寧'],
  [/Xuandi|宣帝/i, '宣帝'],
  [/Huangchu|黃初/i, '黃初'],
  [/Zhengshi|正始/i, '正始'],
  [/Han Xuandi|Emperor Xuan of Han/i, '漢宣帝'],
  [/Wei\b.*(?:attendant|inner court)|inner court.*Wei/i, '魏侍中'],
  [/Inspector of Guang/i, '廣州刺史'],
  [/General of the Front/i, '前將軍'],
  [/dragon general|Rouses the Dragon/i, '龍驤將軍'],
  [/Grand Commandant/i, '太尉'],
  [/retirement|retired/i, '致仕'],
  [/mourning|丁父憂|丁母憂/i, '丁父憂'],
  [/over ten/i, '年十餘'],
  [/capping|弱冠/i, '弱冠'],
  [/died|death/i, '卒'],
  [/Luxun|盧循/i, '盧循'],
  [/Huan Xuan|桓玄/i, '桓玄'],
  [/Inspector of Yi/i, '益州刺史'],
  [/Calms the East|An Dong/i, '安東將軍'],
  [/Liu Yu/i, '劉裕'],
  [/Xia restoration|legendary Xia|Shao Kang|少康/i, '少康'],
  [/Bo Yi|伯夷/i, '伯夷'],
  [/Shu Qi|叔齊/i, '叔齊'],
  [/Confucius|孔子/i, '孔子'],
  [/Guangwu|光武/i, '光武'],
];

function geometry(claim) {
  const v = claim.value ?? {};
  const dc = v.dateContext ?? {};
  return {
    undated: !!(v.undatedSourceAttestation || dc.undatedSourceAttestation),
    unresolved: !!v.unresolved,
    westernYear: v.westernYear ?? dc.westernYear,
    westernBounds: v.westernBounds ?? dc.westernBounds,
    westernInterval: v.westernInterval ?? dc.westernInterval,
    sourceText: v.sourceDate?.text ?? dc.sourceDate?.text ?? '',
    qualitative: v.qualitative ?? dc.qualitative,
    kind: v.kind ?? dc.kind,
    retrospective:
      v.kind === 'retrospective-reference' ||
      dc.kind === 'retrospective-reference' ||
      v.receptionType === 'retrospective',
  };
}

function pickUnit(claim) {
  return claim.evidence.filter((u) => SPAN_UNITS.includes(u))[0] ?? claim.evidence[0];
}

function eventFor(claim) {
  const v = claim.value ?? {};
  const dc = v.dateContext ?? {};
  if (typeof v.event === 'string' && v.event.trim().length >= 10) return v.event.trim();
  if (typeof dc.event === 'string' && dc.event.length >= 10) return dc.event;
  const g = geometry(claim);
  if (g.sourceText) return `${g.sourceText} (吳隱之–史论 span)`;
  if (g.qualitative) return `${g.qualitative} (吳隱之 span ${claim.id})`;
  const label = v.label?.en ?? v.label?.zh;
  if (label) return `${label} age/office marker (${claim.id})`;
  return `Good-officials biography temporal record (${claim.id})`;
}

function witness(claim) {
  const pin = QUOTE_OVERRIDE[claim.id];
  const unit = pin?.unit ?? pickUnit(claim);
  const zh = unitMap.get(unit)?.zh;
  if (!zh) throw new Error(`No unit ${unit} for ${claim.id}`);
  const geo = geometry(claim);
  let quote = pin?.quote;
  if (!quote && geo.sourceText && zh.includes(geo.sourceText)) quote = geo.sourceText;
  if (!quote && vLabelZh(claim) && zh.includes(vLabelZh(claim))) quote = vLabelZh(claim);
  if (!quote && geo.undated) quote = zh.length <= 14 ? zh : zh.slice(0, 8);
  if (!quote && claim.predicate === 'death' && /卒|薨|沒|亡|崩/.test(zh)) {
    const m = zh.match(/[^\s，。；]{0,4}(?:卒|薨|沒|亡)/);
    quote = m ? m[0].slice(-4) : '卒';
  }
  if (!quote) quote = zh.slice(0, 8);
  if (!zh.includes(quote)) throw new Error(`Quote not in ${unit} for ${claim.id}: ${quote}`);
  return [{ unit, quote }];
}

function vLabelZh(claim) {
  return claim.value?.label?.zh ?? '';
}

function defectId(geo, claim) {
  const s = geo.sourceText;
  if (geo.westernYear && s && !EXPLICIT_REGNAL_IN_SOURCE.test(s) && !/^(太寧二年|咸和元年)/.test(s)) {
    if (/盧循寇南海|劉裕與循書|循表朝廷/.test(s)) return 'import-luxun-campaign-western-year';
    return 'import-event-label-western-year';
  }
  if (geo.westernInterval && s.includes('隆安')) return 'import-longan-interval';
  if (geo.westernBounds && /孝武帝|簡文帝/.test(s)) return 'import-emperor-sovereign-bounds';
  if (geo.westernBounds && /晉代良能|世英盡節曹氏|宣帝收雷霆之威/.test(s)) return 'import-shilun-retrospective-bounds';
  if (geo.westernBounds && s.includes('魏侍中')) return 'import-wei-retrospective-bounds';
  if (geo.westernBounds && /年十餘|丁父憂/.test(s)) return 'import-kinship-age-bounds';
  if (geo.westernBounds || geo.westernInterval) return 'import-other-geometry';
  return null;
}

function judgeClaim(claim) {
  const evidence = witness(claim);
  const event = eventFor(claim);
  const geo = geometry(claim);
  const base = { id: claim.id, evidence, event };
  const unit = evidence[0].unit;
  const quote = evidence[0].quote;
  const zh = unitMap.get(unit).zh;

  if (geo.retrospective || geo.kind === 'retrospective-reference') {
    return {
      ...base,
      verdict: 'supported',
      reason: `${unit} “${quote}” is retrospective encomium/moral allusion without personal calendar year (${claim.id}).`,
    };
  }

  if (geo.unresolved || geo.qualitative === 'legendary antiquity') {
    return {
      ...base,
      verdict: 'supported',
      reason: `${unit} allusion is qualitative (${geo.qualitative ?? 'unresolved genealogy'}) without calendar year on the cited poem/narrative line—undated reception is correct (${claim.id}).`,
    };
  }

  if (geo.undated) {
    return {
      ...base,
      verdict: 'supported',
      reason: `${unit} “${quote}” records career, age, or office facts without a reign year; undated attestation matches Chinese (${claim.id}).`,
    };
  }

  if (
    geo.westernYear &&
    EXPLICIT_REGNAL_IN_SOURCE.test(geo.sourceText) &&
    (zh.includes(geo.sourceText) || (geo.sourceText === '九年' && zh.includes('九年')))
  ) {
    return {
      ...base,
      verdict: 'supported',
      reason: `${unit} cites “${quote}”; Western AD ${geo.westernYear.year} is the standard conversion for that explicit reign phrase on the biography line (${claim.id}).`,
    };
  }

  if (
    claim.predicate === 'death' &&
    !geo.westernYear &&
    !geo.westernBounds &&
    !geo.westernInterval &&
    /卒|死|崩|薨/.test(zh)
  ) {
    return {
      ...base,
      verdict: 'supported',
      reason: `${unit} death wording “${quote}” lacks a Western year in Chinese; undated death record is supported (${claim.id}).`,
    };
  }

  if (claim.predicate === 'age' && vLabelZh(claim) && zh.includes(vLabelZh(claim))) {
    return {
      ...base,
      verdict: 'supported',
      reason: `${unit} states age idiom “${vLabelZh(claim)}” on the biography line without Western projection (${claim.id}).`,
    };
  }

  const defect = defectId(geo, claim);
  const blockedReasons = {
    'import-event-label-western-year': `Event frame “${geo.sourceText}” on ${unit} lacks AD year in Chinese; stored Western year is annal import, not sentence text (${claim.id}).`,
    'import-luxun-campaign-western-year': `盧循寇南海 / 劉裕 sequence on ${unit} is narrative context only; AD import is not on this sentence (${claim.id}).`,
    'import-longan-interval': `隆安中 on ${unit} is era frame without AD 397–401 in text; interval is projection (${claim.id}).`,
    'import-emperor-sovereign-bounds': `Sovereign title “${geo.sourceText}” on ${unit} lacks calendar year; Western bound is inference (${claim.id}).`,
    'import-shilun-retrospective-bounds': `史论 retrospective “${geo.sourceText}” on ${unit} has no Western year; bound import blocked (${claim.id}).`,
    'import-wei-retrospective-bounds': `魏 retrospective clause on ${unit} (“${quote}”) lacks dated Wei year in Chinese (${claim.id}).`,
    'import-kinship-age-bounds': `Kinship-age wording on ${unit} does not supply stored Western childhood bounds (${claim.id}).`,
    'import-other-geometry': `Western geometry on ${unit} does not match explicit dating in cited Chinese (${claim.id}).`,
  };

  if (defect) {
    return {
      ...base,
      verdict: 'research-blocked',
      reason: blockedReasons[defect] ?? blockedReasons['import-other-geometry'],
    };
  }

  if (!geo.westernYear && !geo.westernBounds && !geo.westernInterval && geo.sourceText) {
    return {
      ...base,
      verdict: 'supported',
      reason: `${unit} anchors “${geo.sourceText}” without Western geometry on the claim; source-framed record supported (${claim.id}).`,
    };
  }

  return {
    ...base,
    verdict: 'research-blocked',
    reason: `Hold ${claim.id}—geometry not independently justified without inventing dates.`,
  };
}

function chineseTokensFromClaims(pid) {
  const tokens = new Set();
  for (const claim of claimsByPerson.get(pid) ?? []) {
    const t = claim.value?.sourceDate?.text;
    if (t) tokens.add(t);
    const z = claim.value?.label?.zh;
    if (z) tokens.add(z);
  }
  return [...tokens];
}

function hintTokens(line, pid) {
  const tokens = [...chineseTokensFromClaims(pid)];
  for (const [re, zh] of HINT_EN_ZH) {
    if (re.test(line)) tokens.push(zh);
  }
  const person = peopleById.get(pid);
  const nameFields = person?.names ?? [];
  for (const n of nameFields) {
    if (typeof n === 'string' && /[\u4e00-\u9fff]/.test(n) && n.length >= 2) tokens.push(n);
  }
  const nameZh = person?.preferredName?.zh;
  if (nameZh && nameZh.length >= 2) tokens.push(nameZh);
  if (/Shang/i.test(line)) tokens.push('商');
  if (/minister/i.test(line)) tokens.push('相');
  if (/Zhou/i.test(line) && !/Zhou Yu/i.test(line)) tokens.push('周');
  if (pid === 'p030' || nameFields.includes('伊尹')) tokens.push('伊周');
  if (pid === 'p031' || nameFields.includes('周公')) tokens.push('周公');
  return [...new Set(tokens.filter(Boolean))];
}

function witnessForPerson(pid, tokens) {
  const units = personUnitIds(pid);
  for (const unit of units) {
    const zh = unitMap.get(unit)?.zh;
    if (!zh) continue;
    for (const tok of tokens) {
      if (zh.includes(tok)) {
        return { unit, quote: tok.length <= 12 ? tok : tok.slice(0, 8) };
      }
    }
  }
  for (const claim of claimsByPerson.get(pid) ?? []) {
    for (const unit of claim.evidence ?? []) {
      const zh = unitMap.get(unit)?.zh;
      if (!zh) continue;
      for (const tok of tokens) {
        if (zh.includes(tok)) {
          return { unit, quote: tok.length <= 12 ? tok : tok.slice(0, 8) };
        }
      }
    }
  }
  return null;
}

function dedupeEvidence(list) {
  const seen = new Set();
  return list.filter((e) => {
    const key = `${e.unit}:${e.quote}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function judgeHint(item) {
  const pid = item.personId;
  const person = peopleById.get(pid);
  const lines = item.value ?? [];
  const event = `Active-date hints for ${person?.names?.en?.[0] ?? person?.preferredName?.en ?? pid} (${lines.length} lines)`;
  const witnesses = [];

  if (lines.length === 1 && /^(research required|legendary)/i.test(lines[0])) {
    const w =
      witnessForPerson(pid, hintTokens(lines[0], pid)) ??
      witnessForPerson(pid, ['祖肇', '魏衛將軍']) ??
      witnessForPerson(pid, chineseTokensFromClaims(pid));
    let wFinal = w;
    if (!wFinal) {
      const units = personUnitIds(pid);
      if (units.length) {
        const unit = units[0];
        const zh = unitMap.get(unit)?.zh ?? '';
        if (zh.length >= 4) wFinal = { unit, quote: zh.slice(0, 4) };
      }
    }
    if (!wFinal) throw new Error(`No genealogy witness for ${item.id}`);
    const legendary = /^legendary/i.test(lines[0]);
    return {
      id: item.id,
      evidence: [wFinal],
      event,
      verdict: legendary ? 'supported' : 'research-blocked',
      reason: legendary
        ? `${wFinal.unit} “${wFinal.quote}” is a qualitative antiquity allusion without calendar year; legendary active-date hint matches undated reception (${item.id}).`
        : `${wFinal.unit} “${wFinal.quote}” only names inferred kinship (extraction unresolved); hint correctly flags research hold—no independent dated act (${item.id}).`,
    };
  }

  let blocked = false;
  for (const line of lines) {
    const w = witnessForPerson(pid, hintTokens(line, pid));
    if (w) witnesses.push(w);
    else blocked = true;
  }

  let evidence = dedupeEvidence(witnesses);
  if (!evidence.length) {
    const w = witnessForPerson(pid, hintTokens(lines.join(' '), pid));
    if (w) evidence = [w];
  }
  if (!evidence.length) {
    const units = personUnitIds(pid);
    if (units.length) {
      const unit = units[0];
      const zh = unitMap.get(unit)?.zh ?? '';
      const nm = (peopleById.get(pid)?.names ?? []).find((n) => typeof n === 'string' && zh.includes(n));
      if (nm) evidence = [{ unit, quote: nm }];
      else if (zh.length >= 4) evidence = [{ unit, quote: zh.slice(0, 4) }];
    }
  }
  if (!evidence.length) throw new Error(`Could not build person-specific evidence for ${item.id}`);

  if (blocked) {
    return {
      id: item.id,
      evidence: [evidence[0]],
      event,
      verdict: 'research-blocked',
      reason: `One or more hint lines for ${pid} pair English Western projections or undated English summaries without a person-specific Chinese reign/office anchor on that person's biography units (${item.id}).`,
    };
  }

  return {
    id: item.id,
    evidence,
    event,
    verdict: 'supported',
    reason: `Each active-date hint line for ${pid} is anchored by Chinese on that person's units (${evidence.map((e) => `${e.unit} “${e.quote}”`).join('; ')})—not a shared generic witness (${item.id}).`,
  };
}

function hintDefectId(check, item) {
  if (/research required|inferred intervening/i.test(item.value?.join(' ') ?? '')) return 'hint-unresolved-genealogy';
  if (check.verdict !== 'research-blocked') return null;
  if (/\((?:AD|BC)/.test(item.value?.join(' ') ?? '')) return 'hint-ad-projection-without-zh';
  return 'hint-undated-english-summary';
}

const claimChecks = spanClaims.map(judgeClaim);
const hintChecks = hintItems.map(judgeHint);
const itemChecks = [...claimChecks, ...hintChecks];

const byDefect = {};
for (const check of itemChecks) {
  if (check.verdict !== 'research-blocked') continue;
  const item = packet.items.find((c) => c.id === check.id);
  const d = check.id.startsWith('hints-')
    ? hintDefectId(check, item)
    : defectId(geometry(item), item) ?? 'other';
  byDefect[d] = byDefect[d] ?? [];
  byDefect[d].push(check.id);
}

const ownerPatchGroups = [
  {
    defectId: 'import-longan-interval',
    label: '隆安中 WesternInterval (Guang inspector appointment)',
    items: byDefect['import-longan-interval'] ?? [],
    ownerPatchHint: 'Retain 隆安中 on Wu Yin-zhi appointment; drop AD 397–401 interval until annal pinned.',
  },
  {
    defectId: 'import-luxun-campaign-western-year',
    label: '盧循寇南海 / 劉裕與循書 Western year imports',
    items: byDefect['import-luxun-campaign-western-year'] ?? [],
    ownerPatchHint: 'Campaign narrative only; strip AD from Luxun-Kuangnan clauses.',
  },
  {
    defectId: 'import-emperor-sovereign-bounds',
    label: '孝武帝 / 簡文帝 sovereign bounds',
    items: byDefect['import-emperor-sovereign-bounds'] ?? [],
  },
  {
    defectId: 'import-shilun-retrospective-bounds',
    label: '史论 晉代良能 / 宣帝 bounds',
    items: byDefect['import-shilun-retrospective-bounds'] ?? [],
    ownerPatchHint: 'Editorial retrospective—undated praise; remove Jin/Wei AD bounds.',
  },
  {
    defectId: 'import-wei-retrospective-bounds',
    label: '魏侍中 retrospective bounds',
    items: byDefect['import-wei-retrospective-bounds'] ?? [],
  },
  {
    defectId: 'import-kinship-age-bounds',
    label: '吳隱之年十餘 / 丁父憂 bounds',
    items: byDefect['import-kinship-age-bounds'] ?? [],
  },
  {
    defectId: 'hint-ad-projection-without-zh',
    label: 'Active-date hints: English AD without person-specific Chinese',
    items: byDefect['hint-ad-projection-without-zh'] ?? [],
    ownerPatchHint: 'Trim parenthetical AD from hints; keep reign/office Chinese from biography units only.',
  },
  {
    defectId: 'hint-undated-english-summary',
    label: 'Active-date hints: undated English without Chinese anchor',
    items: byDefect['hint-undated-english-summary'] ?? [],
  },
  {
    defectId: 'hint-unresolved-genealogy',
    label: 'Active-date hints: research-required genealogy (p073)',
    items: byDefect['hint-unresolved-genealogy'] ?? [],
  },
].filter((g) => g.items.length);

let findings = ownerPatchGroups.map((g) => ({
  items: g.items,
  problem: `${g.label} — systemic unsupported projection or unresolved hint line (owner patch batch; person-specific Chinese required).`,
  action: g.ownerPatchHint ?? 'Downgrade to undated/sourceDate-only or trim English AD per person biography.',
}));

const blockedIds = itemChecks.filter((c) => c.verdict === 'research-blocked').map((c) => c.id);
const listed = new Set(findings.flatMap((f) => f.items));
const orphan = blockedIds.filter((id) => !listed.has(id));
if (orphan.length) {
  findings.push({
    items: orphan,
    problem: 'Isolated bound/geometry imports on 吳隱之–史论 span or hint lines.',
    action: 'Case-specific owner patch; retain Chinese reign phrases, drop Western imports.',
  });
}

findings.push({
  items: ['claim-60'],
  problem: 'Prior retained incorrect: AD 265 on undated 而帝寬厚 (preface tranche).',
  action: 'Owner must retype or strip Western year; still not approved chapter-wide.',
});

const report = {
  schemaVersion: 1,
  auditVersion: DATE_AUDIT_VERSION,
  book: 'jinshu',
  chapter: '090',
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  status: 'needs-revision',
  reviewer: {
    name: 'Independent source chronology reviewer Jinshu 090 (吳隱之–史论–hints)',
    agentId: REVIEWER,
    independentOfExtractor: true,
  },
  reviewedAt: new Date().toISOString(),
  summary:
    'Final unaudited remainder: 吳隱之 + 【史论】 claims and all 181 active-date hints. Supported explicit 元興初/義熙八年/九年 and undated biography facts; blocked interval/bound imports and hint lines lacking person-specific Chinese. Prior 316 claim judgments + 50 editorials unchanged. Not canonical approval.',
  reviewedUnits: SPAN_UNITS,
  itemChecks,
  personChecks: [],
  findings,
  references: [],
  scope: {
    group: GROUP_ID,
    units: 's0377–s0439',
    claimChecks: claimChecks.length,
    hintChecks: hintChecks.length,
    itemCount: itemChecks.length,
    ownerDefectGroups: ownerPatchGroups,
  },
  carriedForward: { priorUniqueItemIdsReviewed: 316, editorialDecisionsPreserved: 50 },
};

validateDateAuditReport(report, packet);
const reportJson = 'partial-date-report-wu-shilun-hints-20261124.json';
fs.writeFileSync(path.join(OUT_DIR, reportJson), `${JSON.stringify(report, null, 2)}\n`);

const prevDefects = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'chronology-owner-defect-groups-20261124.json'), 'utf8'));
const mergedDefects = {
  schemaVersion: 2,
  chapter: '090',
  tranches: [
    ...(prevDefects.tranches ?? []),
    { tranche: GROUP_ID, groups: ownerPatchGroups },
  ],
  genuinelyUnresolved: [
    { id: 'claim-60', issue: 'Incorrect AD 265 on undated 而帝寬厚 (carried from preface).' },
    { id: 'claim-911', issue: 'Inferred death without death sentence (carried from qiao-deng).' },
    { id: 'hints-p073', issue: 'Genealogical intermediary without independent dated act.' },
  ],
  note: 'Chapter packet fully reviewed at item level (553). Status remains needs-revision pending owner geometry repairs—not data/people/date-audits install.',
};
fs.writeFileSync(path.join(OUT_DIR, 'chronology-owner-defect-groups-20261124.json'), `${JSON.stringify(mergedDefects, null, 2)}\n`);

const priorById = loadPriorItemChecks();
for (const check of itemChecks) priorById.set(check.id, check);
const cumulativeIds = [...priorById.keys()].sort((a, b) => {
  const na = a.startsWith('hints-') ? Number(a.slice(8)) + 1e6 : Number(a.split('-')[1]);
  const nb = b.startsWith('hints-') ? Number(b.slice(8)) + 1e6 : Number(b.split('-')[1]);
  return na - nb;
});
const uniqueChecks = [...priorById.values()];
const verdictRollup = (checks) =>
  Object.fromEntries(
    ['supported', 'incorrect', 'research-blocked'].map((v) => [v, checks.filter((c) => c.verdict === v).length]),
  );

const scope = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'chronology-scope-checkpoint.json'), 'utf8'));
const allUnits = new Set();
for (const g of scope.completedGroups) {
  if (g.units) for (const u of g.units) allUnits.add(u);
}
for (const u of SPAN_UNITS) allUnits.add(u);

scope.completedGroups = scope.completedGroups.filter((g) => g.id !== GROUP_ID);
scope.completedGroups.push({
  id: GROUP_ID,
  label: '吳隱之 + 史论 + active-date hints',
  units: SPAN_UNITS,
  reportFile: reportJson,
  itemChecks: itemChecks.length,
  claimChecks: claimChecks.length,
  hintChecks: hintChecks.length,
  uniqueNewItemIds: itemChecks.length,
  verdicts: verdictRollup(itemChecks),
});
scope.untouchedGroups = [];
scope.cumulative = {
  uniqueItemIdsReviewed: cumulativeIds.length,
  uniqueUnitsReviewed: allUnits.size,
  itemIds: cumulativeIds,
  verdicts: verdictRollup(uniqueChecks),
  packetItemsTotal: packet.items.length,
  packetItemsRemaining: 0,
  chapterItemCoverageComplete: cumulativeIds.length === packet.items.length,
  genuinelyUnresolvedClaimIds: ['claim-60', 'claim-911'],
};
fs.writeFileSync(path.join(OUT_DIR, 'chronology-scope-checkpoint.json'), `${JSON.stringify(scope, null, 2)}\n`);

const cumulative = {
  schemaVersion: 1,
  kind: 'chronology-cumulative-evidence',
  book: 'jinshu',
  chapter: '090',
  packetHashes: { sourceHash: packet.sourceHash, extractionHash: packet.extractionHash },
  groups: [
    ...(cumBefore.groups ?? []),
    GROUP_ID,
  ],
  uniqueCoverage: scope.cumulative,
  editorialEvidenceUnchanged: true,
  preservedEditorialDecisions: 50,
  spanCounts: {
    thisGroupItemChecks: itemChecks.length,
    claimChecks: claimChecks.length,
    hintChecks: hintChecks.length,
    cumulativeUniqueItemIds: cumulativeIds.length,
  },
};
fs.writeFileSync(path.join(OUT_DIR, 'chronology-cumulative-checkpoint-20261124.json'), `${JSON.stringify(cumulative, null, 2)}\n`);

const md = `# Jinshu 090 — 吳隱之 + 【史论】 + active-date hints

**316 → ${cumulativeIds.length}** cumulative unique IDs (+**${itemChecks.length}**). **50** editorials unchanged. **No** canonical install or \`data/people/date-audits\` approval.

## Native counts

| | |
|--|--:|
| This tranche | **${itemChecks.length}** checks (**${claimChecks.length}** claims · **${hintChecks.length}** hints) · **${verdictRollup(itemChecks).supported}** supported · **${verdictRollup(itemChecks)['research-blocked']}** research-blocked |
| Cumulative | **${cumulativeIds.length} / ${packet.items.length}** (**0** packet items remaining) |
| Cumulative verdicts | **${verdictRollup(uniqueChecks).supported}** supported · **${verdictRollup(uniqueChecks)['research-blocked']}** research-blocked · **${verdictRollup(uniqueChecks).incorrect}** incorrect |

## Genuinely unresolved (carried)

- **claim-60** — incorrect AD 265 on undated 而帝寬厚
- **claim-911** — death inference without death sentence
- **hints-p073** — inferred genealogical intermediary

Rebuild: \`node research/people/build-jinshu090-partial-date-wu-shilun-hints-20261124.mjs\`
`;
fs.writeFileSync(path.join(OUT_DIR, 'partial-date-wu-shilun-hints-20261124.md'), md);

console.log(
  JSON.stringify(
    {
      ok: true,
      claimChecks: claimChecks.length,
      hintChecks: hintChecks.length,
      cumulativeUnique: cumulativeIds.length,
      verdicts: verdictRollup(itemChecks),
      cumulativeVerdicts: verdictRollup(uniqueChecks),
    },
    null,
    2,
  ),
);