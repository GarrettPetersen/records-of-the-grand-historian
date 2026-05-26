#!/usr/bin/env node
/**
 * Rule-based translator for weishu 116 s1601–s2587 (terrain treatise + collation notes).
 * Used to build weishu116-batch17-26-data.mjs.
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SOURCE = path.join(ROOT, 'data/weishu/116.json');

const CN_DIGIT = {
  零: 0, 〇: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9,
};
const CN_UNIT = { 十: 10, 百: 100, 千: 1000, 萬: 10000 };

/** Parse Chinese numerals (e.g. 三千三百三十三 → 3333). */
export function parseChineseNumber(text) {
  const s = String(text).replace(/\s/g, '');
  if (!s) return null;
  if (/^\d+$/.test(s)) return Number(s);

  let total = 0;
  let section = 0;
  let num = 0;

  for (const ch of s) {
    if (ch in CN_DIGIT) {
      num = CN_DIGIT[ch];
    } else if (ch in CN_UNIT) {
      const u = CN_UNIT[ch];
      if (u === 10000) {
        section = (section + num) * u;
        num = 0;
      } else if (u === 1000) {
        section += (num || 1) * u;
        num = 0;
      } else if (u === 100) {
        section += (num || 1) * u;
        num = 0;
      } else if (u === 10) {
        section += (num || 1) * u;
        num = 0;
      }
    } else {
      return null;
    }
  }
  total = section + num;
  return total;
}

const EXACT = new Map([
  ['領縣一', ['It governed one county.', 'It governed one county.']],
  ['領縣二', ['It governed two counties.', 'It governed two counties.']],
  ['領縣三', ['It governed three counties.', 'It governed three counties.']],
  ['領縣四', ['It governed four counties.', 'It governed four counties.']],
  ['領縣五', ['It governed five counties.', 'It governed five counties.']],
  ['領縣六', ['It governed six counties.', 'It governed six counties.']],
  ['領縣七', ['It governed seven counties.', 'It governed seven counties.']],
  ['領縣八', ['It governed eight counties.', 'It governed eight counties.']],
  ['〈蕭衍置，魏因之。〉', ['(Xiao Yan established it; Wei followed this.)', 'Xiao Yan established it; the Wei state retained it.']],
  ['〈蕭衍置，魏因之。', ['(Xiao Yan established it; Wei followed this.', 'Xiao Yan established it; the Wei state retained it.']],
  ['〈郡治。〉', ['(It was the commandery seat.)', 'It was the commandery seat.']],
  ['〈郡治。', ['(It was the commandery seat.', 'It was the commandery seat.']],
  ['〈州治。〉', ['(It was the provincial seat.)', 'It was the provincial seat.']],
  ['〈州、郡治。〉', ['(It was both the provincial and commandery seat.)', 'It was both the provincial and commandery seat.']],
  ['〈武定六年置。〉', ['(Established in the sixth year of Wuding.)', 'Established in the sixth year of Wuding.']],
  ['〈武定六年置。', ['(Established in the sixth year of Wuding.', 'Established in the sixth year of Wuding.']],
  ['〈武定二年置。〉', ['(Established in the second year of Wuding.)', 'Established in the second year of Wuding.']],
  ['〈武定二年置。', ['(Established in the second year of Wuding.', 'Established in the second year of Wuding.']],
  ['〈武定八年置。', ['(Established in the eighth year of Wuding.', 'Established in the eighth year of Wuding.']],
  ['〈天平初置，尋陷，武定初復。〉', ['(Established at the beginning of Tianping; soon lost; restored at the beginning of Wuding.)', 'Established at the beginning of Tianping; soon lost; restored at the beginning of Wuding.']],
  ['〈天平初置。〉', ['(Established at the beginning of Tianping.)', 'Established at the beginning of Tianping.']],
  ['〈孝昌三年置。〉', ['(Established in the third year of Xiaochang.)', 'Established in the third year of Xiaochang.']],
  ['〈孝昌三年置。', ['(Established in the third year of Xiaochang.', 'Established in the third year of Xiaochang.']],
  ['〈孝昌初置，屬□州，[51]天平初屬。〉', ['(Established at the beginning of Xiaochang; belonged to □ Province; [51] at the beginning of Tianping it was subordinate here.)', 'Established at the beginning of Xiaochang; belonged to a province now lost in the text; from the beginning of Tianping it was subordinate here. See editorial note [51].']],
  ['〈二漢、晉屬河南。〉', ['(Under the two Han dynasties and Jin it belonged to Henan.)', 'Under the two Han dynasties and Jin it belonged to Henan.']],
  ['〈中略〉', ['(Text abbreviated.)', 'Text abbreviated.']],
  ['===校勘記===', ['===Collation Notes===', '=== Collation Notes ===']],
  ['今據補。', ['The text is now supplemented on this basis.', 'The text is now supplemented on this basis.']],
  ['今從之。', ['The text now follows this reading.', 'The text now follows this reading.']],
  ['今改正。', ['The text is now corrected.', 'The text is now corrected.']],
  ['今從百衲本。', ['The text now follows the Bai纳 edition.', 'The text now follows the Bai纳 edition.']],
  ['溫說是。', ['Wen\'s view is accepted.', 'Wen\'s view is accepted.']],
  [
    '楊疏，熊會貞云：「按初學記',
    [
      'Yang\'s commentary; Xiong Huizhen said: "According to the Essentials of Learning',
      'Yang\'s commentary; Xiong Huizhen said: "According to the Essentials of Learning',
    ],
  ],
  ['宋志', ['Song Annals', 'the Song Annals']],
  ['隋志', ['Sui Annals', 'the Sui Annals']],
  ['通典', ['Tongdian', 'the Tongdian']],
  ['元和志', ['Yuanhe Gazetteer', 'the Yuanhe Gazetteer']],
  ['寰宇記', ['Gazetteer of the Realm', 'the Gazetteer of the Realm']],
  ['通鑑', ['Comprehensive Mirror', 'the Comprehensive Mirror']],
]);

const PHRASES = [
  [/蕭衍置，魏因之/g, 'Xiao Yan established it; the Wei state retained it'],
  [/劉義隆置/g, 'Liu Yilong established it'],
  [/劉駿置/g, 'Liu Jun established it'],
  [/劉彧置/g, 'Liu Yu established it'],
  [/魏因之/g, 'the Wei state retained it'],
  [/武定六年/g, 'the sixth year of Wuding'],
  [/武定七年/g, 'the seventh year of Wuding'],
  [/武定五年/g, 'the fifth year of Wuding'],
  [/武定元年/g, 'the first year of Wuding'],
  [/武定二年/g, 'the second year of Wuding'],
  [/武定八年/g, 'the eighth year of Wuding'],
  [/武定初/g, 'the beginning of Wuding'],
  [/天平二年/g, 'the second year of Tianping'],
  [/天平初/g, 'the beginning of Tianping'],
  [/天平中/g, 'the Tianping era'],
  [/孝昌三年/g, 'the third year of Xiaochang'],
  [/孝昌中/g, 'the Xiaochang era'],
  [/孝昌初/g, 'the beginning of Xiaochang'],
  [/太和二十二年/g, 'the twenty-second year of Taihe'],
  [/太和十九年/g, 'the nineteenth year of Taihe'],
  [/正始元年/g, 'the first year of Zhengshi'],
  [/二漢/g, 'the two Han dynasties'],
  [/前漢/g, 'Former Han'],
  [/後漢/g, 'Later Han'],
  [/魏、晉/g, 'Wei and Jin'],
  [/魏收/g, 'Wei Shou'],
  [/蕭衍/g, 'Xiao Yan'],
  [/楊校/g, 'Yang\'s collation'],
  [/溫校/g, 'Wen\'s collation'],
  [/殿本考證/g, 'Palace Edition textual verification'],
  [/錢氏考異/g, 'Qian\'s Notes on Variants'],
  [/百衲本/g, 'Bainà edition'],
  [/南本/g, 'Southern edition'],
  [/北本/g, 'Northern edition'],
  [/殿本/g, 'Palace edition'],
  [/局本/g, 'Bureau edition'],
  [/汲本/g, 'Ji edition'],
  [/諸本/g, 'all editions'],
];

function unwrapAngles(zh) {
  let inner = zh;
  const open = inner.startsWith('〈');
  const close = inner.endsWith('〉');
  if (open) inner = inner.slice(1);
  if (close) inner = inner.slice(0, -1);
  return { inner, open, close };
}

function translateHouseholds(zh) {
  const m = zh.match(/^戶(.+?)\s*口(.+)$/);
  if (!m) return null;
  const h = parseChineseNumber(m[1]);
  const p = parseChineseNumber(m[2]);
  if (h == null || p == null) return null;
  const lit = `Households: ${h.toLocaleString('en-US')}; registered persons: ${p.toLocaleString('en-US')}.`;
  const idm = `It had ${h.toLocaleString('en-US')} households and a population of ${p.toLocaleString('en-US')}.`;
  return [lit, idm];
}

function translateGoverns(zh) {
  const m = zh.match(/^領郡([一二三四五六七八九十百千萬〇零兩\d]+)\s*縣([一二三四五六七八九十百千萬〇零兩\d]+)$/);
  if (m) {
    const c = parseChineseNumber(m[1]);
    const x = parseChineseNumber(m[2]);
    if (c != null && x != null) {
      return [
        `It had jurisdiction over ${c} commanderies and ${x} counties.`,
        `It governed ${c} commanderies and ${x} counties.`,
      ];
    }
  }
  const m2 = zh.match(/^領郡([一二三四五六七八九十百千萬〇零兩\d]+)$/);
  if (m2) {
    const c = parseChineseNumber(m2[1]);
    if (c != null) {
      return [`It had jurisdiction over ${c} commanderies.`, `It governed ${c} commanderies.`];
    }
  }
  return null;
}

function applyPhrases(text) {
  let t = text;
  for (const [re, rep] of PHRASES) t = t.replace(re, rep);
  return t;
}

function translateFootnoteOnly(zh) {
  const m = zh.match(/^\[(\d+)\]$/);
  if (m) {
    return [`Editorial note [${m[1]}].`, `See editorial note [${m[1]}].`];
  }
  return null;
}

function translateCommandery(zh) {
  if (zh.endsWith('郡') && zh.length > 1 && !/[，。；：「」〈〉]/.test(zh)) {
    const name = zh.slice(0, -1);
    const en = `${name} Commandery`;
    return [en, en];
  }
  if (zh.endsWith('州') && zh.length > 1 && !/[，。；：「」〈〉]/.test(zh)) {
    const name = zh.slice(0, -1);
    const en = `${name} Province`;
    return [en, en];
  }
  return null;
}

function translateParenContent(inner, open, close) {
  let t = applyPhrases(inner);
  if (/^有/.test(t)) {
    t = t.replace(/^有/, 'It had ');
    t = t.replace(/。$/, '.');
  } else if (/^治/.test(t)) {
    t = `Its seat was at ${t.slice(1).replace(/。$/, '')}.`;
  } else if (/^後陷/.test(t)) {
    t = t.replace(/^後陷/, 'Later lost; ').replace(/，/g, ', ').replace(/。$/, '.');
  } else if (/^移治/.test(t)) {
    t = `The seat was moved to ${t.slice(2).replace(/。$/, '')}.`;
  } else if (!/[.!?]$/.test(t) && /[。．]$/.test(inner)) {
    t = t.replace(/。$/, '.');
  }
  const lit = open ? `(${t}${close ? ')' : ''}` : t;
  let idm = t.replace(/^\(/, '').replace(/\)$/, '');
  if (idm.startsWith('It had ')) {
    /* ok */
  } else if (idm.match(/^Established/)) {
    /* ok */
  }
  return [lit, idm];
}

/** @returns {[string, string] | null} */
export function translatePair(zh) {
  const raw = zh.trim();
  if (!raw) return null;

  if (EXACT.has(raw)) return EXACT.get(raw);

  const fn = translateFootnoteOnly(raw);
  if (fn) return fn;

  const hh = translateHouseholds(raw);
  if (hh) return hh;

  const gv = translateGoverns(raw);
  if (gv) return gv;

  const cmd = translateCommandery(raw);
  if (cmd) return cmd;

  if (raw.startsWith('〈') || raw.endsWith('〉')) {
    const { inner, open, close } = unwrapAngles(raw);
    if (inner.match(/^卷/)) {
      const lit = `(${inner})`;
      const idm = inner.replace(/^卷/, 'vol. ');
      return [lit, idm];
    }
    return translateParenContent(inner, open, close);
  }

  if (raw.includes('領縣') && !EXACT.has(raw)) {
    const gv2 = translateGoverns(raw.replace('領', '領郡0縣').replace('領郡0縣', '領縣'));
  }

  return null;
}

function loadSentences(start, end) {
  const data = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
  const byId = new Map();
  data.content.forEach((block, blockIndex) => {
    for (const s of block.sentences || []) byId.set(s.id, { zh: s.zh, blockIndex });
  });
  const rows = [];
  for (let n = start; n <= end; n++) {
    const id = `s${String(n).padStart(4, '0')}`;
    const row = byId.get(id);
    if (!row) throw new Error(`Missing ${id}`);
    rows.push({ id, ...row });
  }
  return rows;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const start = Number(process.argv[2] || 1601);
  const end = Number(process.argv[3] || 2587);
  const rows = loadSentences(start, end);
  const missing = [];
  for (const { id, zh } of rows) {
    if (!translatePair(zh)) missing.push({ id, zh });
  }
  console.log(`Translated ${rows.length - missing.length}/${rows.length}; missing ${missing.length}`);
  if (missing.length) {
    fs.writeFileSync('/tmp/weishu116-missing.json', JSON.stringify(missing, null, 2));
    console.log('Wrote /tmp/weishu116-missing.json');
  }
}
