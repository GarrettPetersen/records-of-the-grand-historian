#!/usr/bin/env node
/**
 * Build weishu116-s1601-2587-pairs.mjs matching batch 12–16 translation style.
 */
import fs from 'fs';
import path from 'path';
import { pinyin } from 'pinyin-pro';
import { PAIRS as P1100 } from './weishu116-s1101-1600-pairs.mjs';
import { translatePair as baseTranslate } from './weishu116-translate-s1601.mjs';
import { MANUAL } from './weishu116-manual-overrides.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const SOURCE = path.join(ROOT, 'data/weishu/116.json');

const data = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
const byId = new Map();
const zhToEn = new Map();
data.content.forEach((block) => {
  for (const s of block.sentences || []) {
    byId.set(s.id, s.zh);
    const t = s.translations?.[0];
    if (t?.idiomatic?.trim()) zhToEn.set(s.zh, { lit: t.literal || t.idiomatic, idm: t.idiomatic });
  }
});
for (const [id, pair] of Object.entries(P1100)) {
  const zh = byId.get(id);
  if (zh) zhToEn.set(zh, { lit: pair[0], idm: pair[1] });
}

function cap(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function romanizeWord(han) {
  if (!han || !/[\u4e00-\u9fff]/.test(han)) return han;
  if (zhToEn.has(han)) return zhToEn.get(han).idm;
  const py = pinyin(han, { toneType: 'none', type: 'array' }).join('');
  return cap(py);
}

const SUFFIX = [
  [/郡$/, (n) => `${romanizeWord(n)} Commandery`],
  [/州$/, (n) => `${romanizeWord(n)} Province`],
  [/山$/, (n) => (n.length === 1 ? `Mount ${romanizeWord(n)}` : `${romanizeWord(n)} Mountain`)],
  [/水$/, (n) => `${romanizeWord(n)} River`],
  [/澤$/, (n) => `${romanizeWord(n)} Marsh`],
  [/祠$/, (n) => `the ${romanizeWord(n)} Shrine`],
  [/戍$/, (n) => `${romanizeWord(n)} Garrison`],
  [/城$/, (n) => `${romanizeWord(n)} City`],
  [/關$/, (n) => `${romanizeWord(n)} Pass`],
  [/塢$/, (n) => `${romanizeWord(n)}wu`],
];

function romanizePhrase(han) {
  if (!han) return han;
  if (zhToEn.has(han)) return zhToEn.get(han).idm;
  for (const [re, fn] of SUFFIX) {
    const m = han.match(re);
    if (m) {
      const stem = han.replace(re, '');
      if (stem) return fn(stem);
    }
  }
  if (/^[\u4e00-\u9fff]+$/.test(han)) return romanizeWord(han);
  return han;
}

function splitList(inner) {
  return inner.split(/[、,，]/).map((x) => x.trim()).filter(Boolean);
}

function translateHasList(inner, close) {
  const items = splitList(inner.replace(/^有/, ''));
  const en = items.map((it) => romanizePhrase(it.replace(/[。．]$/, '')));
  const lit = `It had ${en.join(', ')}${close ? ')' : ''}`;
  const idm =
    en.length === 1
      ? `Within its bounds was ${en[0]}.`
      : `Within its bounds were ${en.join(', ')}.`;
  return [lit, idm];
}

function translateAnnotation(zh) {
  const raw = zh.trim();
  if (MANUAL[byIdRev?.get?.(raw)]) return null;
  if (zhToEn.has(raw)) {
    const { lit, idm } = zhToEn.get(raw);
    return [lit, idm];
  }

  const foot = raw.match(/^\[(\d+)\]$/);
  if (foot) return [`Editorial note [${foot[1]}].`, `See editorial note [${foot[1]}].`];

  const auto = baseTranslate(raw);
  if (auto && !/[\u4e00-\u9fff]/.test(auto[0])) return auto;

  const open = raw.startsWith('〈');
  const close = raw.endsWith('〉');
  let inner = raw;
  if (open) inner = inner.slice(1);
  if (close) inner = inner.slice(0, -1);

  if (inner === '中略') return ['(Text abbreviated.)', 'Text abbreviated.'];

  if (inner.startsWith('有') || inner.match(/^有/)) {
    return translateHasList(inner, close);
  }

  if (inner.match(/^卷/)) {
    const lit = `(${inner})`;
    const idm = inner.replace(/^卷/, 'vol. ');
    return [lit, idm];
  }

  if (inner.match(/^治/) && !inner.includes('，')) {
    const place = inner.replace(/^治/, '').replace(/[。．]$/, '');
    const en = romanizePhrase(place);
    const lit = open ? `(Its seat was at ${en}.)` : `Its seat was at ${en}.`;
    const idm = `Its seat was at ${en}.`;
    return [lit, idm];
  }

  if (inner.includes('蕭衍置，魏因之')) {
    const lit = open ? '(Xiao Yan established it; the Wei state retained it.)' : 'Xiao Yan established it; the Wei state retained it.';
    const idm = 'Xiao Yan established it; the Wei state retained it.';
    return [lit, idm];
  }

  if (inner.match(/武定六年置/)) {
    const lit = open ? '(Established in the sixth year of Wuding (548).)' : 'Established in the sixth year of Wuding (548).';
    return [lit, 'Established in the sixth year of Wuding (548).'];
  }
  if (inner.match(/武定二年置/)) {
    const lit = open ? '(Established in the second year of Wuding (544).)' : 'Established in the second year of Wuding (544).';
    return [lit, 'Established in the second year of Wuding (544).'];
  }
  if (inner.match(/武定五年陷/)) {
    return [
      open ? '(Lost in the fifth year of Wuding (547).)' : 'Lost in the fifth year of Wuding (547).',
      'Lost in the fifth year of Wuding (547).',
    ];
  }

  if (inner.match(/二漢、晉屬/)) {
    const rest = inner.replace(/二漢、晉屬/, '').replace(/[。．]$/, '');
    const en = romanizePhrase(rest);
    const lit = open
      ? `(Under the two Han dynasties and Jin it belonged to ${en}.)`
      : `Under the two Han dynasties and Jin it belonged to ${en}.`;
    return [lit, `Under the two Han dynasties and Jin it belonged to ${en}.`];
  }

  if (inner === '郡治' || inner === '州治' || inner === '州、郡治') {
    const lit = open ? `(${inner === '郡治' ? 'Commandery seat' : inner === '州治' ? 'Provincial seat' : 'Provincial and commandery seat'}.)` : inner;
    const idm =
      inner === '郡治'
        ? 'Commandery seat.'
        : inner === '州治'
          ? 'Provincial seat.'
          : 'Provincial and commandery seat.';
    return [lit, idm];
  }

  // Long annotation: romanize clause by clause
  let lit = inner;
  let idm = inner;
  const reps = [
    [/蕭衍/g, 'Xiao Yan'],
    [/劉義隆/g, 'Liu Yilong'],
    [/劉駿/g, 'Liu Jun'],
    [/劉彧/g, 'Liu Yu'],
    [/劉裕/g, 'Liu Yu'],
    [/蕭道成/g, 'Xiao Daocheng'],
    [/武定六年/g, 'the sixth year of Wuding (548)'],
    [/武定七年/g, 'the seventh year of Wuding (549)'],
    [/武定五年/g, 'the fifth year of Wuding (547)'],
    [/武定元年/g, 'the first year of Wuding (543)'],
    [/武定二年/g, 'the second year of Wuding (544)'],
    [/天平二年/g, 'the second year of Tianping (531)'],
    [/天平初/g, 'the beginning of Tianping'],
    [/天平中/g, 'the Tianping era'],
    [/孝昌三年/g, 'the third year of Xiaochang'],
    [/孝昌中/g, 'the Xiaochang era'],
    [/孝昌初/g, 'the beginning of Xiaochang'],
    [/太和/g, 'Taihe'],
    [/世宗/g, 'Emperor Shizong'],
    [/高祖/g, 'Emperor Gaozu'],
    [/後陷/g, 'Later lost'],
    [/尋陷/g, 'soon lost'],
    [/改置/g, 'renamed and established'],
    [/，/g, ', '],
    [/。/g, '. '],
  ];
  for (const [re, r] of reps) {
    lit = lit.replace(re, r);
    idm = idm.replace(re, r);
  }
  // Romanize remaining han segments
  const romanizeAll = (s) =>
    s.replace(/[\u4e00-\u9fff]+/g, (m) => {
      const r = romanizePhrase(m);
      return r === m ? pinyin(m, { toneType: 'none' }).replace(/\s+/g, '') : r;
    });
  lit = romanizeAll(lit);
  idm = romanizeAll(idm);
  lit = lit.replace(/\s+/g, ' ').trim();
  idm = idm.replace(/\s+/g, ' ').trim();
  if (open) lit = `(${lit}`;
  if (close) lit += ')';
  if (!/[.!?]"?'?\)?$/.test(lit)) lit += '.';
  if (!/[.!?]"?'?$/.test(idm)) idm += '.';
  return [lit, idm];
}

function translatePlain(zh) {
  const id = [...byId.entries()].find(([, z]) => z === zh)?.[0];
  if (id && MANUAL[id]) return MANUAL[id];

  const foot = zh.match(/^\[(\d+)\]$/);
  if (foot) return [`Editorial note [${foot[1]}].`, `See editorial note [${foot[1]}].`];

  if (zh === '===校勘記===') return ['===Collation Notes===', '=== Collation Notes ==='];

  if (zh.match(/^治.+[。．]$/)) {
    const place = zh.replace(/^治/, '').replace(/[。．]$/, '');
    const en = romanizePhrase(place);
    return [`Its seat was at ${en}.`, `Its seat was at ${en}.`];
  }

  if (zh.match(/^移治/)) {
    const place = zh.replace(/^移治/, '').replace(/[。．]$/, '');
    const en = romanizePhrase(place);
    return [`The seat was moved to ${en}.`, `The seat was moved to ${en}.`];
  }

  if (zh.match(/天平二年罷，武定元年復/)) {
    return [
      'Abolished in the second year of Tianping (531); restored in the first year of Wuding (543).',
      'Abolished in the second year of Tianping (531); restored in the first year of Wuding (543).',
    ];
  }

  if (zh.match(/後陷，/) || zh.match(/後陷/)) {
    return translateAnnotation(zh.startsWith('〈') ? zh : `〈${zh}〉`);
  }

  if (zh.match(/郡\[(\d+)\]$/)) {
    const m = zh.match(/^(.+郡)\[(\d+)\]$/);
    const en = romanizePhrase(m[1]);
    return [`${en}[${m[2]}]`, `${en}[${m[2]}]`];
  }

  const hh = zh.match(/^戶(.+?)\s*口(.+)$/);
  if (hh) {
    const parse = (s) => {
      const t = s.trim();
      const py = pinyin(t, { toneType: 'none', type: 'array' });
      if (py.length === 0) return null;
      let n = 0;
      let cur = 0;
      for (const seg of py) {
        const v = parseInt(seg, 10);
        if (String(v) === seg) {
          if (cur === 0) cur = v;
          else cur = cur * 10 + v;
        }
      }
      if (cur) return cur;
      return null;
    };
    const h = parseChineseNum(hh[1]);
    const p = parseChineseNum(hh[2]);
    if (h != null && p != null) {
      return [
        `Households: ${h.toLocaleString('en-US')}; population: ${p.toLocaleString('en-US')}.`,
        `It had ${h.toLocaleString('en-US')} households and a population of ${p.toLocaleString('en-US')}.`,
      ];
    }
  }

  const gov = zh.match(/^領郡([一二三四五六七八九十百千萬〇零兩]+)\s*縣([一二三四五六七八九十百千萬〇零兩]+)$/);
  if (gov) {
    const c = parseChineseNum(gov[1]);
    const x = parseChineseNum(gov[2]);
    if (c != null && x != null) {
      return [
        `It governed ${c} commanderies and ${x} counties.`,
        `It governed ${c} commanderies and ${x} counties.`,
      ];
    }
  }
  const gov2 = zh.match(/^領縣([一二三四五六七八九十百千萬〇零兩]+)$/);
  if (gov2) {
    const x = parseChineseNum(gov2[1]);
    const words = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
    if (x != null && x <= 10) {
      return [`It governed ${words[x]} counties.`, `It governed ${words[x]} counties.`];
    }
  }

  if (zh.includes(' ') && !/[，。〈〉]/.test(zh)) {
    const parts = zh.split(/\s+/).map((p) => {
      const fm = p.match(/^(.+)\[(\d+)\]$/);
      if (fm) return `${romanizePhrase(fm[1])}[${fm[2]}]`;
      return romanizePhrase(p);
    });
    const en = parts.join(', ');
    return [en, en];
  }

  if (zh.startsWith('〈') || zh.endsWith('〉') || zh.includes('置') || zh.includes('屬') || zh.includes('陷')) {
    const ann = translateAnnotation(zh);
    if (ann && !/[\u4e00-\u9fff]/.test(ann[0])) return ann;
  }

  if (zh.endsWith('郡') || (zh.endsWith('州') && zh.length <= 8)) {
    const en = romanizePhrase(zh.replace(/\[\d+\]$/, ''));
    const fm = zh.match(/\[(\d+)\]$/);
    const suf = fm ? `[${fm[1]}]` : '';
    return [`${en}${suf}`, `${en}${suf}`];
  }

  // Collation / narrative (no angle brackets)
  if (zh.length > 8 || zh.includes('校') || zh.includes('楊') || zh.includes('溫') || zh.includes('按')) {
    const ann = translateAnnotation(zh);
    if (ann && !/[\u4e00-\u9fff]/.test(ann[0])) return ann;
  }

  const en = romanizePhrase(zh);
  if (en && en !== zh && !/[\u4e00-\u9fff]/.test(en)) return [en, en];

  return null;
}

const CN = { 零: 0, 〇: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10, 百: 100, 千: 1000, 萬: 10000 };
function parseChineseNum(s) {
  const t = s.trim();
  if (!t) return null;
  let total = 0;
  let section = 0;
  let num = 0;
  for (const ch of t) {
    if (ch in CN && CN[ch] < 10) num = CN[ch];
    else if (ch === '十') {
      section += (num || 1) * 10;
      num = 0;
    } else if (ch === '百') {
      section += (num || 1) * 100;
      num = 0;
    } else if (ch === '千') {
      section += (num || 1) * 1000;
      num = 0;
    } else if (ch === '萬') {
      section = (section + num) * 10000;
      num = 0;
    } else return null;
  }
  return section + num;
}

const PAIRS = {};
const errors = [];
const byIdRev = new Map([...byId.entries()].map(([k, v]) => [v, k]));

for (let n = 1601; n <= 2587; n++) {
  const id = `s${String(n).padStart(4, '0')}`;
  const zh = byId.get(id);
  let pair = MANUAL[id] || translatePlain(zh);
  if (!pair) {
    errors.push({ id, zh });
    continue;
  }
  const stripQuoted = (s) => s.replace(/"[^"]*"/g, '').replace(/'[^']*'/g, '');
  if (/[\u4e00-\u9fff]/.test(stripQuoted(pair[0])) || /[\u4e00-\u9fff]/.test(stripQuoted(pair[1]))) {
    errors.push({ id, zh, note: 'cjk remain', pair });
    continue;
  }
  PAIRS[id] = pair;
}

if (errors.length) {
  fs.writeFileSync('/tmp/weishu-pair-errors.json', JSON.stringify(errors, null, 2));
  console.error(`Errors: ${errors.length} (see /tmp/weishu-pair-errors.json)`);
  console.error(errors.slice(0, 10));
  process.exit(1);
}

const out = `/** Translation pairs for weishu 116 s1601–s2587. [literal, idiomatic] */\nexport const PAIRS = ${JSON.stringify(PAIRS, null, 2).replace(/"([^"]+)":/g, '  $1:').replace(/"/g, "'")};\n`;
// Fix: use proper export format like other files
const lines = ['/** Translation pairs for weishu 116 s1601–s2587. [literal, idiomatic] */', 'export const PAIRS = {'];
for (const [id, [lit, idm]] of Object.entries(PAIRS)) {
  const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  lines.push(`  ${id}: ['${esc(lit)}', '${esc(idm)}'],`);
}
lines.push('};', '');
fs.writeFileSync(path.join(ROOT, 'scripts/weishu116-s1601-2587-pairs.mjs'), lines.join('\n'));
console.log(`Wrote ${Object.keys(PAIRS).length} pairs`);
