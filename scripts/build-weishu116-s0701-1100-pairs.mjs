#!/usr/bin/env node
/**
 * Build weishu116-s0701-1100-pairs.mjs — Ken Liu geography style matching batch4–7.
 */
import fs from 'fs';
import path from 'path';
import { pinyin } from 'pinyin-pro';
import { PAIRS as P47 } from './weishu116-batch4-7-data.mjs';
import { PAIRS as P1100 } from './weishu116-s1101-1600-pairs.mjs';
import { translatePair as baseTranslate } from './weishu116-translate-s1601.mjs';
import { MANUAL_701 } from './weishu116-s0701-1100-manual.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const SOURCE = path.join(ROOT, 'data/weishu/116.json');
const START = 701;
const END = 1100;

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
for (const src of [P47, P1100]) {
  for (const [id, pair] of Object.entries(src)) {
    const zh = byId.get(id);
    if (zh) zhToEn.set(zh, { lit: pair[0], idm: pair[1] });
  }
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
  [/國$/, (n) => `the State of ${romanizeWord(n)}`],
  [/山$/, (n) => (n.length === 1 ? `Mount ${romanizeWord(n)}` : `${romanizeWord(n)} Mountain`)],
  [/水$/, (n) => `${romanizeWord(n)} River`],
  [/澤$/, (n) => `${romanizeWord(n)} Marsh`],
  [/陂$/, (n) => `${romanizeWord(n)} Embankment`],
  [/祠$/, (n) => `the ${romanizeWord(n)} Shrine`],
  [/廟$/, (n) => `the ${romanizeWord(n)} Temple`],
  [/冢$/, (n) => `the tomb of ${romanizeWord(n)}`],
  [/墓$/, (n) => `the tomb of ${romanizeWord(n)}`],
  [/戍$/, (n) => `${romanizeWord(n)} Garrison`],
  [/城$/, (n) => `${romanizeWord(n)} City`],
  [/關$/, (n) => `${romanizeWord(n)} Pass`],
  [/亭$/, (n) => `${romanizeWord(n)} Pavilion`],
  [/台$/, (n) => `${romanizeWord(n)} Terrace`],
  [/碑$/, (n) => `the stele of ${romanizeWord(n)}`],
];

function romanizePhrase(han) {
  if (!han) return han;
  if (PHRASE_GLOSS.has(han)) return PHRASE_GLOSS.get(han);
  if (zhToEn.has(han)) return zhToEn.get(han).idm;
  const fm = han.match(/^(.+)\[(\d+)\]$/);
  if (fm) return `${romanizePhrase(fm[1])}[${fm[2]}]`;
  if (han.includes('□')) return han.replace(/□/g, '□');
  for (const [re, fn] of SUFFIX) {
    const m = han.match(re);
    if (m) {
      const stem = han.replace(re, '');
      if (stem) return fn(stem);
    }
  }
  if (/^[\u4e00-\u9fff□]+$/.test(han)) return romanizeWord(han);
  return han;
}

function splitList(inner) {
  return inner
    .split(/[、,，]/)
    .map((x) => x.trim().replace(/[。．〉]+$/g, ''))
    .filter(Boolean);
}

const PHRASE_GLOSS = new Map([
  ['漢高祖廟', 'the temple of Emperor Gaozu of Han'],
  ['漢高祖祠', 'the shrine of Emperor Gaozu of Han'],
  ['漢高祖舊宅', 'the old residence of Emperor Gaozu of Han'],
  ['廟碑', 'temple stele'],
  ['黃山祠', 'the Huangshan Shrine'],
  ['呂母冢', 'the tomb of Lü Mu'],
  ['微子冢', 'the tomb of Weizi'],
  ['張良冢', 'the tomb of Zhang Liang'],
  ['荀卿冢', 'the tomb of Xun Qing'],
  ['戚夫人廟', 'the temple of Lady Qi'],
  ['單襄公祠', 'the shrine of Duke Xiang of Shan'],
  ['宓子賤祠', 'the shrine of Mizijian'],
  ['楚王墓', 'the tomb of the King of Chu'],
  ['三孤山', 'San\'gu Mountain'],
  ['荊山', 'Jing Mountain'],
  ['華山', 'Hua Mountain'],
  ['羅山', 'Luo Mountain'],
  ['孤山', 'Gu Mountain'],
  ['坊山', 'Fang Mountain'],
  ['挑山', 'Tiao Mountain'],
  ['抱犢山', 'Baodu Mountain'],
  ['蘭陵山', 'Lanling Mountain'],
  ['石孤山', 'Shigu Mountain'],
  ['五弩山', 'Wunu Mountain'],
  ['紀丘山', 'Jiqiu Mountain'],
  ['琅邪臺', 'Langye Terrace'],
  ['秦始皇碑', 'the stele of the First Emperor of Qin'],
  ['龍漢赤唐陂', 'Longhan Chitang Embankment'],
]);

function translateHasList(inner, close, open) {
  const items = splitList(inner.replace(/^有/, ''));
  const en = items.map((it) => romanizePhrase(it.replace(/[。．]$/, '')));
  const join = en.join(', ');
  const litVerb = open ? 'It has' : 'It has';
  const lit = `${litVerb} ${join}${close ? '.)' : '.'}`;
  const idm = `It had ${join}.`;
  return [lit, idm];
}

function litWrap(body, open, close) {
  const text = body.endsWith('.') ? body : `${body}.`;
  if (open && close) return `(${text})`;
  if (open && !close) return `(${text.replace(/\.$/, '')}`;
  return text;
}

function translateAnnotation(zh) {
  const raw = zh.trim();
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

  if (inner.startsWith('有')) return translateHasList(inner, close, open);

  if (inner.match(/^卷/)) {
    const lit = `(${inner})`;
    const idm = inner.replace(/^卷/, 'vol. ');
    return [lit, idm];
  }

  if (inner.match(/^治/) && !inner.includes('，')) {
    const place = inner.replace(/^治/, '').replace(/[。．]$/, '');
    const en = romanizePhrase(place);
    const lit = open ? `(Its seat was at ${en}.)` : `Its seat was at ${en}.`;
    return [lit, `Its seat was at ${en}.`];
  }

  if (inner === '郡治' || inner === '州治' || inner === '州、郡治') {
    const lit = open
      ? `(${inner === '郡治' ? 'It was the commandery seat.' : inner === '州治' ? 'It was the provincial seat.' : 'It was both the provincial and commandery seat.'})`
      : inner === '郡治'
        ? 'It was the commandery seat.'
        : inner === '州治'
          ? 'It was the provincial seat.'
          : 'It was both the provincial and commandery seat.';
    const idm =
      inner === '郡治'
        ? 'It was the commandery seat.'
        : inner === '州治'
          ? 'It was the provincial seat.'
          : 'It was both the provincial and commandery seat.';
    return [lit, idm];
  }

  if (inner.includes('蕭衍置，魏因之')) {
    const lit = open
      ? '(Xiao Yan established it; Wei followed this.)'
      : 'Xiao Yan established it; the Wei state retained it.';
    const idm = 'Xiao Yan established it; the Wei state retained it.';
    return [lit, idm];
  }

  if (inner.includes('劉裕置，魏因之')) {
    const lit = open ? '(Liu Yu established it; Wei followed this.)' : 'Liu Yu established it; the Wei state retained it.';
    return [lit, 'Liu Yu established it; the Wei state retained it.'];
  }

  if (inner.includes('劉駿置，魏因之')) {
    const lit = open ? '(Liu Jun established it; Wei followed this.)' : 'Liu Jun established it; the Wei state retained it.';
    return [lit, 'Liu Jun established it; the Wei state retained it.'];
  }

  if (inner.includes('司馬德宗置，魏因之')) {
    const lit = open
      ? '(Sima Dezong established it; Wei followed this.)'
      : 'Sima Dezong established it; the Wei state retained it.';
    return [lit, 'Sima Dezong established it; the Wei state retained it.'];
  }

  if (inner.match(/武定六年置/)) {
    const lit = open ? '(Established in the sixth year of Wuding.)' : 'Established in the sixth year of Wuding.';
    return [lit, 'Established in the sixth year of Wuding.'];
  }
  if (inner.match(/武定七年罷/)) {
    const lit = open ? '(Abolished in the seventh year of Wuding.)' : 'Abolished in the seventh year of Wuding.';
    return [lit, 'Abolished in the seventh year of Wuding.'];
  }
  if (inner.match(/武定五年屬/)) {
    const lit = open ? '(Subordinate in the fifth year of Wuding.)' : 'Subordinate in the fifth year of Wuding.';
    return [lit, 'Subordinate in the fifth year of Wuding.'];
  }

  if (inner.match(/二漢、晉屬/)) {
    const tail = inner.replace(/^二漢、晉屬/, '').replace(/[。．]$/, '');
    const place = tail.replace(/，後屬$/, '').replace(/，後復屬$/, '');
    const en = romanizePhrase(place);
    let lit = `Under the two Han dynasties and Jin it belonged to ${en}`;
    let idm = lit;
    if (tail.includes('後屬')) {
      lit += '; later subordinate here';
      idm += '; later subordinate here';
    }
    if (tail.includes('後復屬')) {
      lit += '; later restored and subordinate here';
      idm += '; later restored and subordinate here';
    }
    lit += close ? '.)' : '.';
    idm += '.';
    if (open) lit = `(${lit.replace(/\.\)$/, '.)')}`;
    return [lit, idm];
  }

  if (inner.match(/前漢屬[^，]+，後漢、晉屬/)) {
    const m = inner.match(/^前漢屬([^，]+)，後漢、晉屬([^。．]+)/);
    if (m) {
      const a = romanizePhrase(m[1]);
      const b = romanizePhrase(m[2]);
      const lit = open
        ? `(Under Former Han it belonged to ${a}; under Later Han and Jin to ${b}.)`
        : `Under Former Han it belonged to ${a}; under Later Han and Jin to ${b}.`;
      return [lit, `Under Former Han it belonged to ${a}; under Later Han and Jin to ${b}.`];
    }
  }

  if (inner.match(/前漢屬[^，]+，後漢、晉屬[^，]+，後屬/)) {
    const m = inner.match(/^前漢屬([^，]+)，後漢、晉屬([^，]+)，後屬/);
    if (m) {
      const lit = open
        ? `(Under Former Han it belonged to ${romanizePhrase(m[1])}; under Later Han and Jin to ${romanizePhrase(m[2])}; later subordinate here.)`
        : `Under Former Han it belonged to ${romanizePhrase(m[1])}; under Later Han and Jin to ${romanizePhrase(m[2])}; later subordinate here.`;
      return [lit, `Under Former Han it belonged to ${romanizePhrase(m[1])}; under Later Han and Jin to ${romanizePhrase(m[2])}; later subordinate here.`];
    }
  }

  if (inner.match(/前漢屬琅邪，後漢屬東萊，晉屬城陽，後屬/)) {
    const lit = open
      ? '(Under Former Han it belonged to Langye; under Later Han to Donglai; under Jin to Chengyang; later subordinate here.)'
      : 'Under Former Han it belonged to Langye; under Later Han to Donglai; under Jin to Chengyang; later subordinate here.';
    return [lit, 'Under Former Han it belonged to Langye; under Later Han to Donglai; under Jin to Chengyang; later subordinate here.'];
  }

  if (inner.match(/前漢屬高密，後漢屬北海，晉屬城陽，後屬/)) {
    const lit = open
      ? '(Under Former Han it belonged to Gaomi; under Later Han to Beihai; under Jin to Chengyang; later subordinate here.)'
      : 'Under Former Han it belonged to Gaomi; under Later Han to Beihai; under Jin to Chengyang; later subordinate here.';
    return [lit, 'Under Former Han it belonged to Gaomi; under Later Han to Beihai; under Jin to Chengyang; later subordinate here.'];
  }

  if (inner.match(/前漢屬，後漢屬北海，晉屬城陽，後屬/)) {
    const lit = open
      ? '(Under Former Han it was subordinate; under Later Han to Beihai; under Jin to Chengyang; later subordinate here.)'
      : 'Under Former Han it was subordinate; under Later Han to Beihai; under Jin to Chengyang; later subordinate here.';
    return [lit, 'Under Former Han it was subordinate; under Later Han to Beihai; under Jin to Chengyang; later subordinate here.'];
  }

  if (inner.match(/前漢屬琅邪，後漢屬北海，晉屬城陽/)) {
    const tail = inner.includes('後屬') ? '; later subordinate here' : '';
    const lit = open
      ? `(Under Former Han it belonged to Langye; under Later Han to Beihai; under Jin to Chengyang${tail}.)`
      : `Under Former Han it belonged to Langye; under Later Han to Beihai; under Jin to Chengyang${tail}.`;
    return [lit, `Under Former Han it belonged to Langye; under Later Han to Beihai; under Jin to Chengyang${tail}.`];
  }

  if (inner.match(/前漢屬琅邪，後漢屬北海，晉屬琅邪，後屬/)) {
    const lit = open
      ? '(Under Former Han it belonged to Langye; under Later Han to Beihai; under Jin to Langye; later subordinate here.)'
      : 'Under Former Han it belonged to Langye; under Later Han to Beihai; under Jin to Langye; later subordinate here.';
    return [lit, 'Under Former Han it belonged to Langye; under Later Han to Beihai; under Jin to Langye; later subordinate here.'];
  }

  if (inner.match(/二漢屬北海，晉屬城陽，後屬/)) {
    const lit = open
      ? '(Under the two Han dynasties to Beihai; under Jin to Chengyang; later subordinate here.)'
      : 'Under the two Han dynasties to Beihai; under Jin to Chengyang; later subordinate here.';
    return [lit, 'Under the two Han dynasties to Beihai; under Jin to Chengyang; later subordinate here.'];
  }

  if (inner.match(/二漢屬北海，晉屬琅邪，後屬/)) {
    const lit = open
      ? '(Under the two Han dynasties to Beihai; under Jin to Langye; later subordinate here.)'
      : 'Under the two Han dynasties to Beihai; under Jin to Langye; later subordinate here.';
    return [lit, 'Under the two Han dynasties to Beihai; under Jin to Langye; later subordinate here.'];
  }

  if (inner.match(/二漢屬琅邪，晉屬城陽，後屬/)) {
    const lit = open
      ? '(Under the two Han dynasties to Langye; under Jin to Chengyang; later subordinate here.)'
      : 'Under the two Han dynasties to Langye; under Jin to Chengyang; later subordinate here.';
    return [lit, 'Under the two Han dynasties to Langye; under Jin to Chengyang; later subordinate here.'];
  }

  if (inner.match(/二漢屬琅邪，晉罷，後復屬/)) {
    const lit = open
      ? '(Under the two Han dynasties to Langye; abolished under Jin; later restored and subordinate here.)'
      : 'Under the two Han dynasties to Langye; abolished under Jin; later restored and subordinate here.';
    return [lit, 'Under the two Han dynasties to Langye; abolished under Jin; later restored and subordinate here.'];
  }

  if (inner.match(/二漢屬潁川，晉屬/)) {
    const lit = open
      ? '(Under the two Han dynasties to Yingchuan; under Jin subordinate here.)'
      : 'Under the two Han dynasties to Yingchuan; under Jin subordinate here.';
    return [lit, 'Under the two Han dynasties to Yingchuan; under Jin subordinate here.'];
  }

  if (inner.match(/二漢屬潁川，晉屬河南，後罷/)) {
    const lit = open
      ? '(Under the two Han dynasties to Yingchuan; under Jin to Henan; later abolished.)'
      : 'Under the two Han dynasties to Yingchuan; under Jin to Henan; later abolished.';
    return [lit, 'Under the two Han dynasties to Yingchuan; under Jin to Henan; later abolished.'];
  }

  if (inner.match(/二漢屬潁川，後屬/)) {
    const lit = open ? '(Under the two Han dynasties to Yingchuan; later subordinate here.)' : 'Under the two Han dynasties to Yingchuan; later subordinate here.';
    return [lit, 'Under the two Han dynasties to Yingchuan; later subordinate here.'];
  }

  if (inner.match(/二漢屬梁國，晉罷，後復屬/)) {
    const lit = open
      ? '(Under the two Han dynasties to the Liang kingdom; abolished under Jin; later restored and subordinate here.)'
      : 'Under the two Han dynasties to the Liang kingdom; abolished under Jin; later restored and subordinate here.';
    return [lit, 'Under the two Han dynasties to the Liang kingdom; abolished under Jin; later restored and subordinate here.'];
  }

  if (inner.match(/二漢屬沛，晉屬譙國，後罷/)) {
    const lit = open
      ? '(Under the two Han dynasties to Pei; under Jin to the Qiao kingdom; later abolished.)'
      : 'Under the two Han dynasties to Pei; under Jin to the Qiao kingdom; later abolished.';
    return [lit, 'Under the two Han dynasties to Pei; under Jin to the Qiao kingdom; later abolished.'];
  }

  if (inner.match(/二漢屬琅邪，晉屬城陽，後罷/)) {
    const lit = open
      ? '(Under the two Han dynasties to Langye; under Jin to Chengyang; later abolished.)'
      : 'Under the two Han dynasties to Langye; under Jin to Chengyang; later abolished.';
    return [lit, 'Under the two Han dynasties to Langye; under Jin to Chengyang; later abolished.'];
  }

  if (inner.match(/前漢屬沛，後屬/)) {
    const lit = open ? '(Under Former Han to Pei; later subordinate here.)' : 'Under Former Han to Pei; later subordinate here.';
    return [lit, 'Under Former Han to Pei; later subordinate here.'];
  }

  if (inner.match(/前漢屬東郡，後漢、晉屬/)) {
    const lit = open
      ? '(Under Former Han to Dong Commandery; under Later Han and Jin subordinate here.)'
      : 'Under Former Han to Dong Commandery; under Later Han and Jin subordinate here.';
    return [lit, 'Under Former Han to Dong Commandery; under Later Han and Jin subordinate here.'];
  }

  if (inner.match(/前漢屬陳留，後漢、晉屬梁國，後屬/)) {
    const lit = open
      ? '(Under Former Han to Chenliu; under Later Han and Jin to the Liang kingdom; later subordinate here.)'
      : 'Under Former Han to Chenliu; under Later Han and Jin to the Liang kingdom; later subordinate here.';
    return [lit, 'Under Former Han to Chenliu; under Later Han and Jin to the Liang kingdom; later subordinate here.'];
  }

  if (inner.match(/二漢、晉屬陳留，後屬/)) {
    const lit = open
      ? '(Under the two Han dynasties and Jin to Chenliu; later subordinate here.)'
      : 'Under the two Han dynasties and Jin to Chenliu; later subordinate here.';
    return [lit, 'Under the two Han dynasties and Jin to Chenliu; later subordinate here.'];
  }

  if (inner.match(/二漢、晉屬梁國，後屬/)) {
    const lit = open
      ? '(Under the two Han dynasties and Jin to the Liang kingdom; later subordinate here.)'
      : 'Under the two Han dynasties and Jin to the Liang kingdom; later subordinate here.';
    return [lit, 'Under the two Han dynasties and Jin to the Liang kingdom; later subordinate here.'];
  }

  if (inner.match(/二漢屬沛，晉屬/)) {
    const lit = open ? '(Under the two Han dynasties to Pei; under Jin subordinate here.)' : 'Under the two Han dynasties to Pei; under Jin subordinate here.';
    return [lit, 'Under the two Han dynasties to Pei; under Jin subordinate here.'];
  }

  if (inner.match(/二漢屬北海，晉屬琅邪/)) {
    const lit = open ? '(Under the two Han dynasties to Beihai; under Jin to Langye.)' : 'Under the two Han dynasties to Beihai; under Jin to Langye.';
    return [lit, 'Under the two Han dynasties to Beihai; under Jin to Langye.'];
  }

  if (inner.match(/二漢屬恒農，晉屬河南/)) {
    const lit = open ? '(Under the two Han dynasties to Hengnong; under Jin to Henan.)' : 'Under the two Han dynasties to Hengnong; under Jin to Henan.';
    return [lit, 'Under the two Han dynasties to Hengnong; under Jin to Henan.'];
  }

  if (inner.match(/前漢屬/)) {
    const rest = inner.replace(/前漢屬/, '').replace(/[。．]$/, '');
    const en = romanizePhrase(rest);
    const lit = open
      ? `(Under Former Han it belonged to ${en}.)`
      : `Under Former Han it belonged to ${en}.`;
    return [lit, `Under Former Han it belonged to ${en}.`];
  }

  if (inner.match(/二漢屬/)) {
    const rest = inner.replace(/二漢屬/, '').replace(/[。．]$/, '');
    const en = romanizePhrase(rest);
    const body = `Under the two Han dynasties it belonged to ${en}.`;
    const lit = open && !close ? `(${body.replace(/\.$/, '')}` : open ? `(${body})` : body;
    return [lit, body];
  }

  // Avoid garbled pinyin concatenation for common administrative formulas
  const formula = [
    [/孝昌三年置，元象二年併彭城，武定五年復/g, 'established in the third year of Xiaochang; in the second year of Yuanxiang merged with Pengcheng; restored in the fifth year of Wuding'],
    [/孝昌三年置，治定陶城，後徙左城/g, 'established in the third year of Xiaochang; seat at Dingtao City; later moved to Zuocheng'],
    [/孝昌二年置，治下邑城/g, 'established in the second year of Xiaochang; seat at Xiayi City'],
    [/孝昌二年置，治麻城/g, 'established in the second year of Xiaochang; seat at Macheng'],
    [/孝昌中陷，興和中復/g, 'lost in the Xiaochang era; restored in the Xinghe era'],
    [/太和十九年置，孝昌中陷，興和中復/g, 'established in the nineteenth year of Taihe; lost in the Xiaochang era; restored in the Xinghe era'],
    [/武定五年復，治承城/g, 'restored in the fifth year of Wuding; seat at Chengcheng'],
    [/興和二年置，治孝昌城/g, 'established in the second year of Xinghe; seat at Xiaochang City'],
    [/晉亂，屬濟陰/g, 'Jin was in turmoil; it belonged to Jiyin'],
    [/治沛南界，後寄治彭城/g, 'seat on the southern border of Pei; later administered from Pengcheng'],
    [/故秦泗水郡，漢高帝更名，後漢為國，後改/g, 'formerly Qin\'s Sishui Commandery; Emperor Gaozu of Han renamed it; under Later Han it became a kingdom; later changed again'],
    [/皇興初置，屬建昌郡，太和十五年罷郡，屬彭城，武定五年屬/g, 'established at the beginning of Huangxing; belonged to Jianchang Commandery; in the fifteenth year of Taihe the commandery was abolished and it belonged to Pengcheng; subordinate in the fifth year of Wuding'],
    [/皇興初置，屬建昌郡，太和十九年罷郡，屬彭城，武定五年屬/g, 'established at the beginning of Huangxing; belonged to Jianchang Commandery; in the nineteenth year of Taihe the commandery was abolished and it belonged to Pengcheng; subordinate in the fifth year of Wuding'],
    [/太宗置，太和十七年改為司州，天平初復/g, 'Emperor Taizong established it; in the seventeenth year of Taihe changed to Si Province; restored at the beginning of Tianping'],
    [/晉置，太宗併洛陽，正始二年復屬河南/g, 'established under Jin; Emperor Taizong merged it into Luoyang; in the second year of Zhengshi restored and subordinate to Henan'],
    [/太和十七年併洛陽，天平初復屬/g, 'merged into Luoyang in the seventeenth year of Taihe; restored and subordinate at the beginning of Tianping'],
    [/天平初置/g, 'established at the beginning of Tianping'],
    [/正光中陷，天平中復/g, 'lost in the Zhengguang era; restored in the Tianping era'],
    [/孝昌中置，郡治/g, 'established in the Xiaochang era; commandery seat'],
    [/太和中置縣，後改/g, 'counties established in the Taihe era; later changed'],
    [/太和十七年置/g, 'established in the seventeenth year of Taihe'],
    [/太和十一年置鎮，十八年改為荊州，二十二年罷，置/g, 'a garrison was established in the eleventh year of Taihe; in the eighteenth year changed to Jing Province; abolished in the twenty-second year and established again'],
    [/太和十一年置/g, 'established in the eleventh year of Taihe'],
    [/太和二十一年置/g, 'established in the twenty-first year of Taihe'],
    [/太和十八年置/g, 'established in the eighteenth year of Taihe'],
    [/太和中置/g, 'established in the Taihe era'],
    [/天安元年置，正光中陷，興和二年復/g, 'established in the first year of Tian\'an; lost in the Zhengguang era; restored in the second year of Xinghe'],
    [/永安三年復屬，孝昌中陷，興和中復/g, 'restored and subordinate in the third year of Yong\'an; lost in the Xiaochang era; restored in the Xinghe era'],
    [/漢文帝為膠西國，宣帝更為高密國，後漢併北海，晉惠帝復，劉駿併北海/g, 'Emperor Wen of Han made it the Jiaoxi kingdom; Emperor Xuan changed it to the Gaomi kingdom; Later Han merged it into Beihai; Emperor Hui of Jin restored it; Liu Jun merged Beihai into it'],
    [/太和十二年改為郡，十九年復，後屬/g, 'changed to a commandery in the twelfth year of Taihe; restored in the nineteenth year; later subordinate here'],
  ];
  for (const [re, r] of formula) {
    if (re.test(inner)) {
      const lit = litWrap(r, open, close);
      return [lit, `${r}.`];
    }
  }

  let lit = inner;
  let idm = inner;
  const reps = [
    [/蕭衍/g, 'Xiao Yan'],
    [/司馬德宗/g, 'Sima Dezong'],
    [/劉義隆/g, 'Liu Yilong'],
    [/劉駿/g, 'Liu Jun'],
    [/劉裕/g, 'Liu Yu'],
    [/魏因之/g, 'the Wei state retained it'],
    [/武定六年/g, 'the sixth year of Wuding'],
    [/武定七年/g, 'the seventh year of Wuding'],
    [/武定五年/g, 'the fifth year of Wuding'],
    [/武定元年/g, 'the first year of Wuding'],
    [/武定二年/g, 'the second year of Wuding'],
    [/武定中/g, 'the Wuding era'],
    [/武定初/g, 'the beginning of Wuding'],
    [/天平二年/g, 'the second year of Tianping'],
    [/天平初/g, 'the beginning of Tianping'],
    [/天平中/g, 'the Tianping era'],
    [/孝昌三年/g, 'the third year of Xiaochang'],
    [/孝昌二年/g, 'the second year of Xiaochang'],
    [/孝昌中/g, 'the Xiaochang era'],
    [/孝昌初/g, 'the beginning of Xiaochang'],
    [/興和中/g, 'the Xinghe era'],
    [/興和二年/g, 'the second year of Xinghe'],
    [/興和中年/g, 'the Xinghe era'],
    [/永安三年/g, 'the third year of Yong\'an'],
    [/永安二年/g, 'the second year of Yong\'an'],
    [/永安中/g, 'the Yong\'an era'],
    [/太和/g, 'Taihe'],
    [/世宗/g, 'Emperor Shizong'],
    [/高祖/g, 'Emperor Gaozu'],
    [/太宗/g, 'Emperor Taizong'],
    [/顯祖/g, 'Emperor Xianzu'],
    [/後陷/g, 'Later lost'],
    [/尋陷/g, 'soon lost'],
    [/後復/g, 'later restored'],
    [/後屬/g, 'later subordinate here'],
    [/後罷/g, 'later abolished'],
    [/後復屬/g, 'later restored and subordinate here'],
    [/，/g, ', '],
    [/。/g, '. '],
  ];
  for (const [re, r] of reps) {
    lit = lit.replace(re, r);
    idm = idm.replace(re, r);
  }
  const romanizeAll = (s) =>
    s.replace(/[\u4e00-\u9fff□]+/g, (m) => {
      const r = romanizePhrase(m);
      return r === m && !m.includes('□') ? cap(pinyin(m, { toneType: 'none' }).replace(/\s+/g, '')) : r;
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

const CN = { 零: 0, 〇: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10, 百: 100, 千: 1000, 萬: 10000 };

function parseChineseNum(s) {
  const t = s.replace(/\[(\d+)\]/g, '').trim();
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

function translatePlain(zh, id) {
  if (MANUAL_701[id]) return MANUAL_701[id];

  const foot = zh.match(/^\[(\d+)\]$/);
  if (foot) return [`Editorial note [${foot[1]}].`, `See editorial note [${foot[1]}].`];

  if (zh.match(/^治/)) {
    const place = zh.replace(/^治/, '').replace(/[。．〉]+$/g, '');
    const en = romanizePhrase(place);
    const lit = zh.endsWith('〉') ? `Its seat was at ${en}.)` : `Its seat was at ${en}.`;
    return [lit, `Its seat was at ${en}.`];
  }

  if (zh.match(/^有/)) {
    const inner = `有${zh.replace(/^有/, '').replace(/[。．〉]+$/g, '')}`;
    return translateHasList(inner, zh.endsWith('〉'), false);
  }

  if (!zh.startsWith('〈') && !zh.endsWith('〉') && zh.includes('、') && zh.length < 40) {
    const items = splitList(zh.replace(/[。．]$/, ''));
    const en = items.map((it) => romanizePhrase(it));
    const lit = en.join(', ') + '.';
    const idm = en.length === 1 ? `It had ${en[0]}.` : `It had ${en.join(', ')}.`;
    return [lit, idm];
  }

  if (!zh.startsWith('〈') && zh.match(/出焉/)) {
    const t = zh.replace(/出焉[。．]?$/, '');
    const en = romanizePhrase(t);
    return [`${en}; the Jiao River issues from it.`, `It had ${en}; the Jiao River issues from it.`];
  }

  if (zh.match(/^移治/)) {
    const place = zh.replace(/^移治/, '').replace(/[。．]$/, '');
    const en = romanizePhrase(place);
    return [`The seat was moved to ${en}.`, `The seat was moved to ${en}.`];
  }

  const hh = zh.match(/^戶(.+?)\s*口(.+)$/);
  if (hh) {
    const h = parseChineseNum(hh[1]);
    const p = parseChineseNum(hh[2]);
    if (h != null && p != null) {
      return [
        `Households: ${h.toLocaleString('en-US')}; registered persons: ${p.toLocaleString('en-US')}.`,
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
    const parts = zh.split(/\s+/).map((p) => romanizePhrase(p));
    const en = parts.join(', ');
    return [en, en];
  }

  if (zh.match(/後漢、晉為尹/)) {
    return [
      'Under Later Han and Jin it was an Intendant\'s commandery; later abolished.',
      'Under Later Han and Jin it was an Intendant\'s commandery; later abolished.',
    ];
  }

  if (zh.startsWith('〈') || zh.endsWith('〉') || zh.includes('置') || zh.includes('屬') || zh.includes('陷')) {
    const ann = translateAnnotation(zh);
    if (ann && !/[\u4e00-\u9fff]/.test(ann[0].replace(/□/g, ''))) return ann;
  }

  if ((zh.endsWith('郡') || zh.endsWith('州')) && zh.length <= 12) {
    const en = romanizePhrase(zh);
    return [en, en];
  }

  const en = romanizePhrase(zh);
  if (en && en !== zh && !/[\u4e00-\u9fff]/.test(en.replace(/□/g, ''))) return [en, en];

  return null;
}

const PAIRS = {};
const errors = [];

for (let n = START; n <= END; n++) {
  const id = `s${String(n).padStart(4, '0')}`;
  const zh = byId.get(id);
  let pair = translatePlain(zh, id);
  if (!pair) {
    errors.push({ id, zh });
    continue;
  }
  const stripQuoted = (s) => s.replace(/"[^"]*"/g, '').replace(/'[^']*'/g, '');
  if (/[\u4e00-\u9fff]/.test(stripQuoted(pair[0]).replace(/□/g, '')) || /[\u4e00-\u9fff]/.test(stripQuoted(pair[1]).replace(/□/g, ''))) {
    errors.push({ id, zh, note: 'cjk remain', pair });
    continue;
  }
  PAIRS[id] = pair;
}

if (errors.length) {
  fs.writeFileSync('/tmp/weishu701-pair-errors.json', JSON.stringify(errors, null, 2));
  console.error(`Errors: ${errors.length} (see /tmp/weishu701-pair-errors.json)`);
  console.error(errors.slice(0, 15));
  process.exit(1);
}

const lines = [
  '/** Translation pairs for weishu 116 s0701–s1100. [literal, idiomatic] */',
  'export const PAIRS = {',
];
for (const [id, [lit, idm]] of Object.entries(PAIRS)) {
  const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  lines.push(`  ${id}: ['${esc(lit)}', '${esc(idm)}'],`);
}
lines.push('};', '');
fs.writeFileSync(path.join(ROOT, 'scripts/weishu116-s0701-1100-pairs.mjs'), lines.join('\n'));
console.log(`Wrote ${Object.keys(PAIRS).length} pairs to weishu116-s0701-1100-pairs.mjs`);
