/**
 * Pattern-based translator for qingshigao 038 astronomy annals.
 */
const GZ_PINYIN = {
  甲子: 'jiazi', 乙丑: 'yichou', 丙寅: 'bingyin', 丁卯: 'dingmao', 戊辰: 'wuchen', 己巳: 'jisi',
  庚午: 'gengwu', 辛未: 'xinwei', 壬申: 'renshen', 癸酉: 'guiyou', 甲戌: 'jiaxu', 乙亥: 'yihai',
  丙子: 'bingzi', 丁丑: 'dingchou', 戊寅: 'wuyin', 己卯: 'jimao', 庚辰: 'gengchen', 辛巳: 'xinsi',
  壬午: 'renwu', 癸未: 'guiwei', 甲申: 'jiashen', 乙酉: 'yiyou', 丙戌: 'bingxu', 丁亥: 'dinghai',
  戊子: 'wuzi', 己丑: 'jichou', 庚寅: 'gengyin', 辛卯: 'xinmao', 壬辰: 'renchen', 癸巳: 'guisi',
  甲午: 'jiawu', 乙未: 'yiwei', 丙申: 'bingshen', 丁酉: 'dingyou', 戊戌: 'wuxu', 己亥: 'jihai',
  庚子: 'gengzi', 辛丑: 'xinchou', 壬寅: 'renyin', 癸卯: 'guimao', 甲辰: 'jiachen', 乙巳: 'yisi',
  丙午: 'bingwu', 丁未: 'dingwei', 戊申: 'wushen', 己酉: 'jiyou', 庚戌: 'gengxu', 辛亥: 'xinhai',
  壬子: 'renzi', 癸丑: 'guichou', 甲寅: 'jiayin', 乙卯: 'yimao', 丙辰: 'bingchen', 丁巳: 'dingsi',
  戊午: 'wuwu', 己未: 'jiwei', 庚申: 'gengshen', 辛酉: 'xinyou', 壬戌: 'renxu', 癸亥: 'guihai',
};
const GZ = Object.keys(GZ_PINYIN);

const MONTHS = [
  ['閏九月', 'intercalary ninth month', 'intercalary IX'],
  ['閏七月', 'intercalary seventh month', 'intercalary VII'],
  ['閏六月', 'intercalary sixth month', 'intercalary VI'],
  ['閏五月', 'intercalary fifth month', 'intercalary V'],
  ['閏四月', 'intercalary fourth month', 'intercalary IV'],
  ['閏三月', 'intercalary third month', 'intercalary III'],
  ['閏二月', 'intercalary second month', 'intercalary II'],
  ['閏正月', 'intercalary first month', 'intercalary I'],
  ['十二月', 'twelfth month', 'XII'],
  ['十一月', 'eleventh month', 'XI'],
  ['十月', 'tenth month', 'X'],
  ['九月', 'ninth month', 'IX'],
  ['八月', 'eighth month', 'VIII'],
  ['七月', 'seventh month', 'VII'],
  ['六月', 'sixth month', 'VI'],
  ['五月', 'fifth month', 'V'],
  ['四月', 'fourth month', 'IV'],
  ['三月', 'third month', 'III'],
  ['二月', 'second month', 'II'],
  ['正月', 'first month', 'I'],
];

const REIGNS_ZH = { 乾隆: 'Qianlong', 康熙: 'Kangxi', 順治: 'Shunzhi', 雍正: 'Yongzheng', 天聰: 'Tiancong', 崇德: 'Chongde' };

const CN_YEAR = {
  元: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10,
  十一: 11, 十二: 12, 十三: 13, 十四: 14, 十五: 15, 十六: 16, 十七: 17,
  十八: 18, 十九: 19, 二十: 20, 二十一: 21, 二十二: 22, 二十三: 23,
  二十四: 24, 二十五: 25, 二十六: 26, 二十七: 27, 二十八: 28, 二十九: 29,
  三十: 30, 三十一: 31, 三十二: 32, 三十三: 33, 三十四: 34, 三十五: 35,
  三十六: 36, 三十七: 37, 三十八: 38, 三十九: 39, 四十: 40, 四十一: 41,
  四十二: 42, 四十三: 43, 四十四: 44, 四十五: 45, 四十六: 46, 四十七: 47,
  四十八: 48, 四十九: 49, 五十: 50, 五十一: 51, 五十二: 52, 五十三: 53,
  五十四: 54, 五十五: 55, 五十六: 56, 五十七: 57, 五十八: 58, 五十九: 59,
  六十: 60, 六十一: 61,
};

const HEADERS = [
  ['日生重暈者，', 'Solar multiple halos'],
  ['日生交暈者，', 'Solar intersecting halos'],
  ['月生重暈者，', 'Lunar multiple halos'],
  ['日生兩珥者，', 'Solar parhelia'],
  ['日生戴氣者，', 'Solar crowning halos'],
  ['日生冠氣者，', 'Solar cap halos'],
  ['日生抱氣者，', 'Solar enclosing halos'],
  ['日生背氣者，', 'Solar anticoronae'],
  ['日生直氣者，', 'Solar vertical light pillars'],
  ['日生暈者，', 'Solar halos'],
  ['虹暈異色者，', 'Unusual-colored rainbows and halos'],
  ['虹多道者，', 'Multi-arc rainbows'],
];

function ord(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function replaceGanzhi(s) {
  let out = s;
  // Day stem-branch followed by two hour-branches: 丁卯卯、申二時
  const br = { 子: 'zi', 丑: 'chou', 寅: 'yin', 卯: 'mao', 辰: 'chen', 巳: 'si', 午: 'wu', 未: 'wei', 申: 'shen', 酉: 'you', 戌: 'xu', 亥: 'hai' };
  out = out.replace(
    /([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])([子丑寅卯辰巳午未申酉戌亥])時/g,
    (_, day, h) => `${GZ_PINYIN[day] ?? day} at the ${br[h]} hour`
  );
  out = out.replace(
    /([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])([子丑寅卯辰巳午未申酉戌亥])、([子丑寅卯辰巳午未申酉戌亥])二時/g,
    (_, day, h1, h2) => {
      const d = GZ_PINYIN[day] ?? day;
      const b = { 子: 'zi', 丑: 'chou', 寅: 'yin', 卯: 'mao', 辰: 'chen', 巳: 'si', 午: 'wu', 未: 'wei', 申: 'shen', 酉: 'you', 戌: 'xu', 亥: 'hai' };
      return `${d} at the ${b[h1]} and ${b[h2]} hours`;
    }
  );
  for (const g of GZ.sort((a, b) => b.length - a.length)) {
    out = out.replaceAll(g, GZ_PINYIN[g]);
  }
  return out;
}

function normalizePhen(s) {
  const rules = [
    [/兼兩珥、抱氣、背氣/g, ' with two parhelia, an enclosing halo, and anticorona'],
    [/兼兩珥、背氣、抱氣/g, ' with two parhelia, anticorona, and an enclosing halo'],
    [/兼兩珥、抱氣/g, ' with two parhelia and an enclosing halo'],
    [/兼兩珥、背氣/g, ' with two parhelia and anticorona'],
    [/兼兩珥、直氣/g, ' with two parhelia and vertical light pillars'],
    [/兼抱氣、背氣、戟氣/g, ' with an enclosing halo, anticorona, and halberd halo'],
    [/兼抱氣、背氣、左右直氣/g, ' with an enclosing halo, anticorona, and left and right vertical light pillars'],
    [/兼抱氣及背氣二道/g, ' with an enclosing halo and anticorona in two bands'],
    [/兼背氣、抱氣、左右戟氣/g, ' with anticorona, an enclosing halo, and left and right halberd halos'],
    [/兼背氣、兩珥、背氣二道及抱氣/g, ' with two parhelia, anticorona in two bands, and an enclosing halo'],
    [/兼兩珥、背氣二道及抱氣/g, ' with two parhelia, anticorona in two bands, and an enclosing halo'],
    [/兼背氣、抱氣/g, ' with anticorona and an enclosing halo'],
    [/兼抱氣、背氣/g, ' with an enclosing halo and anticorona'],
    [/兼兩珥背氣/g, ' with two parhelia and anticorona'],
    [/兼兩珥氾背氣/g, ' with two parhelia and spreading anticorona'],
    [/兼背氣、兩珥/g, ' with anticorona and two parhelia'],
    [/，背、抱、戟、紐四氣/g, ', and anticorona, enclosing halo, halberd halo, and knot halo'],
    [/^背、抱、戟、紐四氣/g, 'anticorona, enclosing halo, halberd halo, and knot halo'],
    [/背氣二道/g, ' anticorona in two bands'],
    [/兼背氣二道/g, ' with anticorona in two bands'],
    [/上下二道/g, ' upper and lower bands'],
    [/左右直氣/g, ' left and right vertical light pillars'],
    [/左右戟氣/g, ' left and right halberd halos'],
    [/三重兼兩珥、背氣、抱氣/g, ' a triple halo with two parhelia, anticorona, and an enclosing halo'],
    [/皆兼兩珥/g, ' all with two parhelia'],
    [/兼兩珥/g, ' with two parhelia'],
    [/兼背氣/g, ' with anticorona'],
    [/兼抱氣/g, ' with an enclosing halo'],
    [/兼直氣/g, ' with vertical light pillars'],
    [/兼戴氣/g, ' with a crowning halo'],
    [/兼戟氣/g, ' with halberd halo'],
    [/三重/g, ' triple'],
  ];
  let t = s;
  for (const [re, rep] of rules) t = t.replace(re, rep);
  return t;
}

function normalizeTime(s) {
  let t = s;
  t = t.replace(/如之/g, ', the same');
  t = t.replace(/皆如之/g, ', all likewise');
  t = t.replace(/朔/g, ' (new moon)');
  const branches = '子丑寅卯辰巳午未申酉戌亥';
  t = t.replace(/([子丑寅卯辰巳午未申酉戌亥])、([子丑寅卯辰巳午未申酉戌亥])、([子丑寅卯辰巳午未申酉戌亥])、([子丑寅卯辰巳午未申酉戌亥])四時/g,
    ' at the $1, $2, $3, and $4 hours');
  t = t.replace(/([子丑寅卯辰巳午未申酉戌亥])、([子丑寅卯辰巳午未申酉戌亥])、([子丑寅卯辰巳午未申酉戌亥])三時/g,
    ' at the $1, $2, and $3 hours');
  t = t.replace(/([子丑寅卯辰巳午未申酉戌亥])、([子丑寅卯辰巳午未申酉戌亥])二時/g,
    ' at the $1 and $2 hours');
  t = t.replace(/([子丑寅卯辰巳午未申酉戌亥])時至([子丑寅卯辰巳午未申酉戌亥])時/g,
    ' from the $1 hour to the $2 hour');
  t = t.replace(/([子丑寅卯辰巳午未申酉戌亥])時/g, ' at the $1 hour');
  t = t.replace(/([子丑寅卯辰巳午未申酉戌亥])([子丑寅卯辰巳午未申酉戌亥])二時/g,
    ' at the $1 and $2 hours');
  t = t.replace(/至/g, ' through ');
  t = t.replace(/；/g, ';');
  return t;
}

function parseReignYear(zh) {
  for (const [cn, en] of Object.entries(REIGNS_ZH)) {
    let m = zh.match(new RegExp(`^${cn}(\\d+)年`));
    if (m) return { reign: en, year: +m[1], rest: zh.slice(m[0].length) };
    m = zh.match(new RegExp(`^${cn}元年`));
    if (m) return { reign: en, year: 1, rest: zh.slice(m[0].length) };
  }
  const ym = zh.match(/^([一二三四五六七八九十]+(?:十[一二三四五六七八九]?)?|\d+)年/);
  if (ym) {
    const y = CN_YEAR[ym[1]] ?? +ym[1];
    return { reign: null, year: y, rest: zh.slice(ym[0].length) };
  }
  return { reign: null, year: null, rest: zh };
}

function formatDayClause(raw, mode) {
  let s = normalizeTime(normalizePhen(replaceGanzhi(raw)));
  s = s.replace(/\(new moon\)/g, mode === 'idiomatic' ? '(new moon)' : 'on the first day of the month');
  if (/^[a-z]{2,}( |$|,)/.test(s) || /^[a-z]{2,}/.test(s.trim())) {
    if (!s.startsWith('on ') && !s.startsWith('from ') && !s.startsWith('all ') && !s.startsWith('at ')) {
      s = 'on ' + s.trim();
    }
  }
  return s.replace(/\s+/g, ' ').trim();
}

function translateBody(zh, reign, year) {
  const segs = zh.split(/[，,]/).filter((x) => x.trim());
  const lit = [];
  const id = [];
  let yLit = year ? `In the ${ord(year)} year, ` : '';
  let yId = year ? `${reign} ${year}, ` : '';

  segs.forEach((seg, i) => {
    let s = seg.trim();
    let monthLit = '';
    let monthId = '';
    for (const [m, ml, mi] of MONTHS) {
      if (s.startsWith(m)) {
        monthLit = ml;
        monthId = mi;
        s = s.slice(m.length);
        break;
      }
    }
    const day = formatDayClause(s, 'literal');
    const dayId = formatDayClause(s, 'idiomatic');
    if (monthLit) {
      lit.push(i === 0 && year ? `${yLit}${monthLit}, ${day}` : `${monthLit}, ${day}`);
      id.push(i === 0 && year ? `${yId}${monthId}/${dayId.replace(/^on /, '')}` : `${monthId}/${dayId.replace(/^on /, '')}`);
    } else {
      lit.push(i === 0 && year ? `${yLit}${day}` : day);
      id.push(i === 0 && year ? `${yId}${dayId.replace(/^on /, '')}` : dayId.replace(/^on /, ''));
    }
  });

  const fixEnd = (s) => s.replace(/[;,.]+\s*$/, '').trim() + '.';
  return {
    literal: fixEnd(lit.join('; ').replace(/; on /g, '; on ')),
    idiomatic: fixEnd(id.join('; ')),
  };
}

export function reignForId(id) {
  const n = +id.slice(1);
  if (n >= 601 && n <= 626) return 'Kangxi';
  if (n >= 627 && n <= 633) return 'Yongzheng';
  if (n >= 1106) return 'Qianlong'; // mixed sections - explicit in text often
  if (n >= 634) return 'Qianlong';
  if (n >= 562 && n <= 600) return 'Shunzhi';
  if (n >= 559 && n <= 561) return 'Kangxi';
  return 'Qianlong';
}

export function translateSentence(zh, defaultReign = 'Qianlong') {
  zh = zh.replace(/。$/, '').trim();
  for (const [h, label] of HEADERS) {
    if (zh.startsWith(h)) {
      const body = zh.slice(h.length);
      const py = parseReignYear(body);
      const reign = py.reign ?? defaultReign;
      const inner = translateBody(py.rest, reign, py.year);
      return {
        literal: `${label}: ${inner.literal.charAt(0).toLowerCase()}${inner.literal.slice(1)}`,
        idiomatic: `${label}: ${inner.idiomatic.charAt(0).toLowerCase()}${inner.idiomatic.slice(1)}`,
      };
    }
  }
  const py = parseReignYear(zh);
  let reign = py.reign ?? defaultReign;
  const year = py.year;
  return translateBody(py.rest, reign, year);
}
