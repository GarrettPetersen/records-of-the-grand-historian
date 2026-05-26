#!/usr/bin/env node
/**
 * Rule-based translator for weishu 116 s0001–s0300 (Yanzhou, Qingzhou, etc.).
 */
import { pinyin } from 'pinyin-pro';
import { parseChineseNumber } from './weishu116-translate-s1601.mjs';

const PROVINCE_STEM = new Map([
  ['兗', 'Yan'],
  ['青', 'Qing'],
  ['齊', 'Qi'],
  ['徐', 'Xu'],
  ['兗', 'Yan'],
]);

const WORDS = new Map([
  ['後漢', 'Later Han'],
  ['前漢', 'Former Han'],
  ['二漢', 'the two Han dynasties'],
  ['漢高帝', 'Emperor Gaozu of Han'],
  ['漢景帝', 'Emperor Jing of Han'],
  ['漢文帝', 'Emperor Wen of Han'],
  ['漢宣帝', 'Emperor Xuan of Han'],
  ['漢章帝', 'Emperor Zhang of Han'],
  ['晉武帝', 'Emperor Wu of Jin'],
  ['晉', 'Jin'],
  ['魏', 'Wei'],
  ['秦', 'Qin'],
  ['劉義隆', 'Liu Yilong'],
  ['劉駿', 'Liu Jun'],
  ['劉裕', 'Liu Yu'],
  ['司馬德宗', 'Sima Dezong'],
  ['魏因之', 'the Wei state retained it'],
  ['後改', 'later renamed'],
  ['後屬', 'later it was subordinate here'],
  ['後罷', 'later abolished'],
  ['後復', 'later restored'],
  ['後復屬', 'later restored and subordinate here'],
  ['尋罷', 'soon abolished'],
  ['尋陷', 'soon lost'],
  ['中略', 'Text abbreviated'],
  ['皇興', 'Huangxing'],
  ['太和', 'Taihe'],
  ['延興', 'Yanxing'],
  ['建武', 'Jianwu'],
  ['和帝', 'Emperor He'],
  ['武帝', 'Emperor Wu'],
  ['高后', 'Empress Lü'],
  ['高帝', 'Emperor Gaozu'],
]);

function pyName(han) {
  if (!han || !/[\u4e00-\u9fff]/.test(han)) return han;
  const s = pinyin(han, { toneType: 'none', type: 'array' }).join('');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const NAME_OVERRIDES = new Map([
  ['伍子胥', 'Wu Zixu'],
  ['孔子', 'Confucius'],
  ['伏羲', 'Fu Xi'],
  ['女媧', 'Nüwa'],
  ['范巨卿', 'Fan Juching'],
  ['叔梁紇', 'Shuliang He'],
  ['伯禽', 'Bo Qin'],
  ['魯文公', 'Duke Wen of Lu'],
  ['魯恭王', 'King Gong of Lu'],
  ['宰我', 'Zai Wo'],
  ['兒寬', 'Er Kuan'],
  ['季武子', 'Ji Wuzi'],
  ['魯昭公', 'Duke Zhao of Lu'],
  ['顏母', 'Yan Mu'],
  ['羊續', 'Yang Xu'],
  ['淳于髠', 'Chunyu Kun'],
]);

function stripTail(s) {
  return s.replace(/[。．]〉?$/g, '').replace(/〉$/g, '').trim();
}

function romanizeCompound(t) {
  if (t.endsWith('陵') && t.length <= 3) return pyName(t);
  const sufMap = [
    ['廟', (b) => `the ${b} Temple`],
    ['墓', (b) => `the tomb of ${b}`],
    ['冢', (b) => `the tomb of ${b}`],
    ['碑', (b) => `the ${b} stele`],
    ['祠', (b) => `the ${b} Shrine`],
    ['臺', (b) => `the ${b} terrace`],
    ['陵', (b) => `the ${b} mausoleum`],
    ['城', (b) => `${b} City`],
  ];
  for (const [suf, fmt] of sufMap) {
    if (t.endsWith(suf) && t.length > suf.length) {
      const stem = t.slice(0, -suf.length);
      const base = NAME_OVERRIDES.get(stem) || pyName(stem);
      return fmt(base);
    }
  }
  return null;
}

function romanizeToken(han) {
  const t = stripTail(han.trim());
  if (!t) return t;
  if (NAME_OVERRIDES.has(t)) return NAME_OVERRIDES.get(t);
  const compound = romanizeCompound(t);
  if (compound) return compound;
  if (WORDS.has(t)) return WORDS.get(t);
  if (t === '屬') return 'subordinate';
  if (t.endsWith('州') && t.length > 1) {
    const stem = t.slice(0, -1);
    const name = PROVINCE_STEM.get(stem) || pyName(stem);
    return `${name} Province`;
  }
  if (t.endsWith('郡') && t.length > 1) return `${pyName(t.slice(0, -1))} Commandery`;
  if (t.endsWith('國') && t.length > 1) return `the State of ${pyName(t.slice(0, -1))}`;
  if (t.endsWith('城')) return `${pyName(t.slice(0, -1))} City`;
  if (t.endsWith('縣')) return `${pyName(t.slice(0, -1))} County`;
  if (t.endsWith('山') && t.length > 1) {
    const stem = t.slice(0, -1);
    return stem.length <= 2 ? `Mount ${pyName(stem)}` : `${pyName(stem)} Mountain`;
  }
  if (t.endsWith('岳') && t.length > 1) return `${pyName(t.slice(0, -1))} Peak`;
  if (t.endsWith('祠')) return `the ${pyName(t.slice(0, -1))} Shrine`;
  if (t.endsWith('廟')) return `the ${pyName(t.slice(0, -1))} Temple`;
  if (t.endsWith('冢')) return `the tomb of ${pyName(t.slice(0, -1))}`;
  if (t.endsWith('碑')) return `the ${pyName(t.slice(0, -1))} stele`;
  if (t.endsWith('臺')) return `the ${pyName(t.slice(0, -1))} terrace`;
  if (t.endsWith('澤')) return `${pyName(t.slice(0, -1))} Marsh`;
  if (t.endsWith('水')) return `${pyName(t.slice(0, -1))} River`;
  if (t.endsWith('溝')) return `${pyName(t.slice(0, -1))} Canal`;
  if (t.endsWith('亭')) return `${pyName(t.slice(0, -1))} Pavilion`;
  if (t.endsWith('基')) return `the ruins of ${pyName(t.slice(0, -1))}`;
  if (t.endsWith('室')) return `the ${pyName(t.slice(0, -1))} chamber`;
  if (t.endsWith('澤')) return `${pyName(t.slice(0, -1))} Marsh`;
  if (/^[\u4e00-\u9fff]+$/.test(t)) return pyName(t);
  return t;
}

function romanizeList(inner) {
  return inner
    .split(/[、,，]/)
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => {
      const fm = x.match(/^\[(\d+)\]\s*(.+)$/);
      if (fm) return `[${fm[1]}] ${romanizeToken(fm[2])}`;
      return romanizeToken(x.replace(/[。．]$/, ''));
    });
}

function unwrap(zh) {
  let inner = zh;
  const open = inner.startsWith('〈');
  const close = inner.endsWith('〉');
  if (open) inner = inner.slice(1);
  if (close) inner = inner.slice(0, -1);
  return { inner, open, close };
}

function wrapLiteral(text, open, close) {
  let lit = text;
  if (open && !lit.startsWith('(')) lit = `(${lit}`;
  if (close && !lit.endsWith(')')) lit += ')';
  return lit;
}

function translateHouseholds(zh) {
  const m = zh.match(/^戶(.+?)\s*口(.+)$/);
  if (!m) return null;
  const h = parseChineseNumber(m[1]);
  const p = parseChineseNumber(m[2]);
  if (h == null || p == null) return null;
  return [
    `Households: ${h.toLocaleString('en-US')}; population: ${p.toLocaleString('en-US')}.`,
    `It had ${h.toLocaleString('en-US')} households and a population of ${p.toLocaleString('en-US')}.`,
  ];
}

function translateGoverns(zh) {
  const m = zh.match(/^領郡([一二三四五六七八九十百千萬〇零兩]+)\s*縣([一二三四五六七八九十百千萬〇零兩]+)$/);
  if (m) {
    const c = parseChineseNumber(m[1]);
    const x = parseChineseNumber(m[2]);
    if (c != null && x != null) {
      return [`It governed ${c} commanderies and ${x} counties.`, `It governed ${c} commanderies and ${x} counties.`];
    }
  }
  const m2 = zh.match(/^領郡([一二三四五六七八九十百千萬〇零兩]+)$/);
  if (m2) {
    const c = parseChineseNumber(m2[1]);
    if (c != null) return [`It governed ${c} commanderies.`, `It governed ${c} commanderies.`];
  }
  const m3 = zh.match(/^領縣([一二三四五六七八九十百千萬〇零兩]+)(\[(\d+)\])?$/);
  if (m3) {
    const x = parseChineseNumber(m3[1]);
    const note = m3[3] ? `[${m3[3]}]` : '';
    if (x != null) {
      const en = `It governed ${x} counties${note}.`;
      return [en, en];
    }
  }
  return null;
}

function translateHas(inner, close) {
  const body = stripTail(inner.replace(/^有/, ''));
  const items = [];
  for (const seg of body.split(/，/).map((s) => s.trim()).filter(Boolean)) {
    if (seg.includes('、')) items.push(...romanizeList(seg));
    else if (/在北$|出焉$/.test(seg)) items.push(translateClause(seg));
    else items.push(romanizeToken(seg));
  }
  const lit = `It had ${items.join(', ')}${close ? ')' : ''}`;
  const idm =
    items.length === 1
      ? `Within its bounds was ${items[0]}.`
      : `Within its bounds were ${items.join(', ')}.`;
  return [lit, idm];
}

function translateClause(clause) {
  let c = clause.trim();
  if (!c) return '';
  c = c.replace(/[。．]$/, '');

  const foot = c.match(/^\[(\d+)\]\s*(.*)$/);
  if (foot && !foot[2]) return `[${foot[1]}]`;

  if (c === '魏因之') return 'the Wei state retained it';
  if (c === '後改') return 'later renamed';
  if (c === '後屬') return 'later it was subordinate here';
  if (c === '晉屬') return 'under Jin it was subordinate';
  if (c === '晉罷') return 'under Jin it was abolished';
  if (c === '晉改') return 'under Jin it was changed';
  if (c === '後復') return 'later restored';
  if (c === '後復屬') return 'later restored and subordinate here';
  if (c === '皇興中改') return 'changed in the Huangxing era';

  let m;
  if ((m = c.match(/^後漢治(.+)$/))) return `under Later Han the seat was at ${romanizeToken(m[1])}`;
  if ((m = c.match(/^前漢治(.+)$/))) return `under Former Han the seat was at ${romanizeToken(m[1])}`;
  if ((m = c.match(/^魏、晉治(.+)$/))) return `under Wei and Jin at ${romanizeToken(m[1])}`;
  if ((m = c.match(/^治(.+)$/))) return `its seat was at ${romanizeToken(m[1])}`;
  if ((m = c.match(/^([前後]漢)治(.+)$/))) {
    const era = m[1] === '前漢' ? 'Former Han' : 'Later Han';
    return `under ${era} the seat was at ${romanizeToken(m[2])}`;
  }
  if ((m = c.match(/^([前後]漢)屬(.+)$/))) {
    const era = m[1] === '前漢' ? 'Former Han' : 'Later Han';
    return `under ${era} it belonged to ${romanizeToken(m[2])}`;
  }
  if ((m = c.match(/^二漢、晉屬[,，]?(.*)$/))) {
    const rest = m[1];
    if (!rest) return 'under the two Han dynasties and Jin it was subordinate';
    if ((m = rest.match(/^治(.+)$/))) return `under the two Han dynasties and Jin it was subordinate, with its seat at ${romanizeToken(m[1])}`;
    if ((m = rest.match(/^曰(.+)，後改$/))) return `under the two Han dynasties and Jin it was subordinate; it was called ${romanizeToken(m[1])}, later renamed`;
    return `under the two Han dynasties and Jin it was subordinate, ${translateClause(rest)}`;
  }
  if ((m = c.match(/^二漢、晉屬$/))) return 'under the two Han dynasties and Jin it was subordinate';
  if ((m = c.match(/^二漢、晉曰(.+)[,，]後改$/))) return `under the two Han dynasties and Jin it was called ${romanizeToken(m[1])}, later renamed`;
  if ((m = c.match(/^二漢屬(.+)[,，]晉屬$/))) return `under the two Han dynasties it belonged to ${romanizeToken(m[1])}; under Jin it was subordinate`;
  if ((m = c.match(/^二漢屬(.+)$/))) return `under the two Han dynasties it belonged to ${romanizeToken(m[1])}`;
  if ((m = c.match(/^漢、晉屬$/))) return 'under Han and Jin it was subordinate';
  if ((m = c.match(/^([前後]漢)、晉屬$/))) {
    const era = m[1] === '前漢' ? 'Former Han' : 'Later Han';
    return `under ${era} and Jin it was subordinate`;
  }
  if ((m = c.match(/^([前後]漢)、晉屬[,，]治(.+)$/))) {
    const era = m[1] === '前漢' ? 'Former Han' : 'Later Han';
    return `under ${era} and Jin it was subordinate, with its seat at ${romanizeToken(m[2])}`;
  }
  if ((m = c.match(/^([前後]漢)、晉屬[,，]曰(.+)[,，]後改$/))) {
    const era = m[1] === '前漢' ? 'Former Han' : 'Later Han';
    return `under ${era} and Jin it was subordinate; it was called ${romanizeToken(m[2])}, later renamed`;
  }
  if ((m = c.match(/^([前後]漢)、晉屬[,，]曰(.+)$/))) {
    const era = m[1] === '前漢' ? 'Former Han' : 'Later Han';
    return `under ${era} and Jin it was subordinate; it was called ${romanizeToken(m[2])}`;
  }
  if ((m = c.match(/^([前後]漢)、晉曰(.+)[,，]後改$/))) {
    const era = m[1] === '前漢' ? 'Former Han' : 'Later Han';
    return `under ${era} and Jin it was called ${romanizeToken(m[2])}, later renamed`;
  }
  if ((m = c.match(/^晉屬(.+)[,，]後屬$/))) return `under Jin it belonged to ${romanizeToken(m[1])}; later it was subordinate here`;
  if ((m = c.match(/^晉屬(.+)$/))) return `under Jin it belonged to ${romanizeToken(m[1])}`;
  if ((m = c.match(/^晉罷[,，]後復屬$/))) return 'under Jin it was abolished; later restored and subordinate here';
  if ((m = c.match(/^晉罷[,，]後復$/))) return 'under Jin it was abolished; later restored';
  if ((m = c.match(/^後漢屬(.+)[,，]晉屬$/))) return `under Later Han it belonged to ${romanizeToken(m[1])}; under Jin it was subordinate`;
  if ((m = c.match(/^後漢屬(.+)$/))) return `under Later Han it belonged to ${romanizeToken(m[1])}`;
  if ((m = c.match(/^前漢屬(.+)[,，]後罷$/))) return `under Former Han it belonged to ${romanizeToken(m[1])}; later abolished`;
  if ((m = c.match(/^前漢屬(.+)$/))) return `under Former Han it belonged to ${romanizeToken(m[1])}`;
  if ((m = c.match(/^前漢曰(.+)[,，]後漢章帝更名$/))) return `under Former Han it was called ${romanizeToken(m[1])}; under Later Han Emperor Zhang renamed it`;
  if ((m = c.match(/^前漢(.+)也[,，]後漢章帝更名$/))) return `under Former Han it was ${romanizeToken(m[1])}; under Later Han Emperor Zhang renamed it`;
  if ((m = c.match(/^漢屬(.+)[,，]晉屬$/))) return `under Han it belonged to ${romanizeToken(m[1])}; under Jin it was subordinate`;
  if ((m = c.match(/^漢屬(.+)$/))) return `under Han it belonged to ${romanizeToken(m[1])}`;
  if ((m = c.match(/^漢高帝置$/))) return 'established by Emperor Gaozu of Han';
  if ((m = c.match(/^漢景帝置[,，]治(.+)$/))) return `established by Emperor Jing of Han, with its seat at ${romanizeToken(m[1])}`;
  if ((m = c.match(/^漢景帝分為(.+)[,，]武帝改為郡$/))) return `Emperor Jing divided it into ${romanizeToken(m[1])}; Emperor Wu changed it to a commandery`;
  if ((m = c.match(/^漢文帝為(.+)[,，]景帝為郡$/))) return `Emperor Wen made it ${romanizeToken(m[1])}; Emperor Jing made it a commandery`;
  if ((m = c.match(/^漢高帝為(.+)[,，]後漢和帝更名(.+)[,，]晉改$/))) return `Emperor Gaozu of Han made it ${romanizeToken(m[1])}; under Later Han Emperor He renamed it ${romanizeToken(m[2])}; Jin changed it again`;
  if ((m = c.match(/^秦置$/))) return 'established under Qin';
  if ((m = c.match(/^秦置[,，]為(.+)[,，]高后改為(.+)$/))) return `established under Qin as ${romanizeToken(m[1])}; Empress Lü changed it to ${romanizeToken(m[2])}`;
  if ((m = c.match(/^魏置$/))) return 'established under Wei';
  if ((m = c.match(/^劉義隆置$/))) return 'Liu Yilong established it';
  if ((m = c.match(/^劉駿置$/))) return 'Liu Jun established it';
  if ((m = c.match(/^劉裕置$/))) return 'Liu Yu established it';
  if ((m = c.match(/^劉駿復$/))) return 'Liu Jun restored it';
  if ((m = c.match(/^劉駿復[,，]魏因之[。．]?$/))) return 'Liu Jun restored it; the Wei state retained it';
  if ((m = c.match(/^劉駿置[,，]魏因之[。．]?$/))) return 'Liu Jun established it; the Wei state retained it';
  if ((m = c.match(/^劉義隆置[,，]魏因之[。．]?$/))) return 'Liu Yilong established it; the Wei state retained it';
  if ((m = c.match(/^劉裕置[,，]魏因之[。．]?$/))) return 'Liu Yu established it; the Wei state retained it';
  if ((m = c.match(/^二漢、晉曰(.+)[,，]屬[,，]後改[。．]?$/))) return `under the two Han dynasties and Jin it was called ${romanizeToken(m[1])}; it was subordinate; later renamed`;
  if ((m = c.match(/^二漢、晉曰(.+)[。．]?$/))) return `under the two Han dynasties and Jin it was called ${romanizeToken(m[1])}`;
  if ((m = c.match(/^後漢屬$/))) return 'under Later Han it was subordinate';
  if ((m = c.match(/^二漢屬$/))) return 'under the two Han dynasties it was subordinate';
  if ((m = c.match(/^前漢屬$/))) return 'under Former Han it was subordinate';
  if ((m = c.match(/^二漢屬[,，]晉罷[,，]後復[。．]?$/))) return 'under the two Han dynasties it was subordinate; under Jin it was abolished; later restored';
  if ((m = c.match(/^後漢屬[,，]晉屬(.+)[,，]後屬[。．]?$/))) return `under Later Han it was subordinate; under Jin it belonged to ${romanizeToken(m[1])}; later it was subordinate here`;
  if ((m = c.match(/^二漢屬[,，]晉屬(.+)[,，]後屬[。．]?$/))) return `under the two Han dynasties it was subordinate; under Jin it belonged to ${romanizeToken(m[1])}; later it was subordinate here`;
  if ((m = c.match(/^劉駿置[,，]魏因之$/))) return 'Liu Jun established it; the Wei state retained it';
  if ((m = c.match(/^劉義隆置[,，]魏因之$/))) return 'Liu Yilong established it; the Wei state retained it';
  if ((m = c.match(/^劉裕置[,，]魏因之$/))) return 'Liu Yu established it; the Wei state retained it';
  if ((m = c.match(/^劉駿復[,，]魏因之$/))) return 'Liu Jun restored it; the Wei state retained it';
  if ((m = c.match(/^故(.+)[,，]劉義隆置[,，]\[(\d+)\]魏因之$/))) return `formerly ${romanizeToken(m[1])}; Liu Yilong established it; see editorial note [${m[2]}]; the Wei state retained it`;
  if ((m = c.match(/^故(.+)[,，]劉義隆置[,，]魏因之$/))) return `formerly ${romanizeToken(m[1])}; Liu Yilong established it; the Wei state retained it`;
  if ((m = c.match(/^故(.+)[,，]劉駿置[,，]魏因之$/))) return `formerly ${romanizeToken(m[1])}; Liu Jun established it; the Wei state retained it`;
  if ((m = c.match(/^故(.+)[,，]漢景帝分為(.+)[,，]武帝改為郡[,，]晉武帝更名$/))) {
    return `formerly ${romanizeToken(m[1])}; Emperor Jing of Han divided it into ${romanizeToken(m[2])}; Emperor Wu made it a commandery; Emperor Wu of Jin renamed it`;
  }
  if ((m = c.match(/^故(.+)[,，]漢景帝分為(.+)[,，]武帝改為(.+)[,，]宣帝為(.+)[,，]後漢、晉仍為國[,，]後改$/))) {
    return `formerly ${romanizeToken(m[1])}; Emperor Jing divided it into ${romanizeToken(m[2])}; Emperor Wu changed it to ${romanizeToken(m[3])}; Emperor Xuan made it ${romanizeToken(m[4])}; under Later Han and Jin it remained a kingdom; later renamed`;
  }
  if ((m = c.match(/^故東平地[,，]劉義隆置[,，]尋罷$/))) return 'formerly Dongping territory; Liu Yilong established it; soon abolished';
  if ((m = c.match(/^後漢治(.+)[,，]司馬德宗治(.+)[,，]魏因之$/))) {
    return `under Later Han the seat was at ${romanizeToken(m[1])}; Sima Dezong administered from ${romanizeToken(m[2])}; the Wei state retained it`;
  }
  if ((m = c.match(/^後漢治山陽昌邑[,，]魏、晉治廩丘[,，]\[(\d+)\]劉義隆治瑕丘[,，]魏因之$/))) {
    return `under Later Han the seat was at Shanyang Changyi; under Wei and Jin at Linqiu; [${m[1]}] Liu Yilong at Xiaqiu; the Wei state retained it`;
  }
  if ((m = c.match(/^舊屬青州[,，]太和十八年分屬$/))) return 'formerly subordinate to Qing Province; in the eighteenth year of Taihe (494) it was split off here';
  if ((m = c.match(/^延興三年屬$/))) return 'in the third year of Yanxing (471) it was subordinate here';
  if ((m = c.match(/^([^，]+)置冀州[,，]皇興三年更名$/))) return `administered from ${romanizeToken(m[1])}; Liu Yilong established Jizhou; in the third year of Huangxing (469) it was renamed`;
  if ((m = c.match(/^治(.+)[,，]後徙(.+)$/))) return `its seat was at ${romanizeToken(m[1])}; later moved to ${romanizeToken(m[2])}`;
  if ((m = c.match(/^([^，]+)出鐵$/))) return `${romanizeToken(m[1])} produced iron`;
  if ((m = c.match(/^(.+)出焉$/))) return `the ${romanizeToken(m[1])} issued forth here`;
  if ((m = c.match(/^前漢(.+)也[,，]後漢章帝更名$/))) return `under Former Han it was ${romanizeToken(m[1])}; under Later Han Emperor Zhang renamed it`;
  if ((m = c.match(/^(.+)在北$/))) return `${romanizeToken(m[1])} was to the north`;
  if (c.startsWith('有')) return translateHas(c, false)[0].replace(/^It had /, 'it had ');

  // Fallback: romanize remaining han segments
  let out = c;
  for (const [han, en] of WORDS) out = out.split(han).join(en);
  out = out.replace(/[\u4e00-\u9fff]+/g, (seg) => romanizeToken(seg));
  out = out.replace(/、/g, ', ').replace(/，/g, ', ');
  return out.replace(/\s+/g, ' ').trim();
}

function translateAnnotation(zh) {
  const { inner, open, close } = unwrap(zh);
  if (inner === '中略') return ['(Text abbreviated.)', 'Text abbreviated.'];

  if (inner.startsWith('有') || inner.match(/^有/)) {
    const [lit, idm] = translateHas(inner, close);
    return [wrapLiteral(lit, open, close), idm];
  }

  const clauses = inner.split(/[，,]/).map((c) => c.trim()).filter(Boolean);
  const parts = clauses.map((c) => translateClause(c));
  let idm = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('; ');
  if (!/[.!?]$/.test(idm)) idm += '.';
  const lit = wrapLiteral(idm.replace(/;\s*([a-z])/g, '; $1'), open, close);
  return [lit, idm];
}

function translateCountyList(zh) {
  if (!zh.includes(' ') || /[，。〈〉]/.test(zh)) return null;
  const parts = zh.trim().split(/\s+/).map((p) => {
    const fm = p.match(/^\[(\d+)\]$/);
    if (fm) return `[${fm[1]}]`;
    const fn = p.match(/^\[(\d+)\]\s*(.+)$/);
    if (fn) return `[${fn[1]}] ${romanizeToken(fn[2])}`;
    return romanizeToken(p);
  });
  const en = parts.join(', ');
  return [en, en];
}

/** @returns {[string, string] | null} */
export function translatePair(zh) {
  const raw = zh.trim();
  let m;
  if (!raw) return null;
  if (raw === '。') return ['.', '.'];

  const fn = raw.match(/^\[(\d+)\]$/);
  if (fn) return [`Editorial note [${fn[1]}].`, `See editorial note [${fn[1]}].`];

  const hh = translateHouseholds(raw);
  if (hh) return hh;

  const gv = translateGoverns(raw);
  if (gv) return gv;

  if (raw.endsWith('州') && raw.length <= 4) {
    const en = romanizeToken(raw);
    return [en, en];
  }
  if (raw.endsWith('郡') && !/[，。〈〉]/.test(raw)) {
    const en = romanizeToken(raw);
    return [en, en];
  }

  const countyFoot = raw.match(/^\[(\d+)\]\s+(.+)$/);
  if (countyFoot && !countyFoot[2].includes(' ')) {
    const en = `[${countyFoot[1]}] ${romanizeToken(countyFoot[2])}`;
    return [en, en];
  }

  const list = translateCountyList(raw);
  if (list) return list;

  if (raw.startsWith('有')) {
    const [lit, idm] = translateHas(stripTail(raw), false);
    return [lit.endsWith('.') ? lit : `${lit}.`, idm];
  }

  if ((m = raw.match(/^治(.+)[。．]?$/))) {
    const en = `Its seat was at ${romanizeToken(m[1])}.`;
    return [en, en];
  }

  if (raw.includes('，') && !raw.startsWith('〈') && /[\u4e00-\u9fff]/.test(raw)) {
    return translateAnnotation(`〈${raw.replace(/[。．]$/, '')}。〉`);
  }

  if (raw.match(/^劉駿復[,，]魏因之[。．]?$/)) {
    return ['Liu Jun restored it; the Wei state retained it.', 'Liu Jun restored it; the Wei state retained it.'];
  }

  if (raw.startsWith('〈') || raw.endsWith('〉') || raw.includes('屬') || raw.includes('置')) {
    return translateAnnotation(raw);
  }

  if (/^[\u4e00-\u9fff□]+$/.test(raw) && raw.length <= 6) {
    const en = romanizeToken(raw);
    return [en, en];
  }

  return null;
}
