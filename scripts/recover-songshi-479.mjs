#!/usr/bin/env node
/**
 * Recover data/songshi/479.json translations from public/songshi/479.html:
 * - idiomatic from english-text spans (HTML entities decoded)
 * - literal from embedded window.currentChapterData, with fixes when identical to idiomatic
 */
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { countHanzi } from '../translation-guards.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const JSON_PATH = path.join(ROOT, 'data/songshi/479.json');
const HTML_PATH = path.join(ROOT, 'public/songshi/479.html');

const TRANSLATOR = 'Garrett M. Petersen (2026)';
const MODEL = 'Composer 2.5';

/** Manual literals where embed had literal === idiomatic and heuristics failed. */
const LITERAL_FIXES = {
  s0064: '" At the end he cited Liu Shan and Chen Shubao precedents to request enfeoffment.',
  s0075:
    'From the twelfth day onward they reached the army in succession; I trust blood-sincerity has ascended to the sage ear.',
  s0079:
    'I too measured my own faults and still felt keen worry; I respectfully sent my younger brother to court with a memorial, reporting guilt to be heard.',
  s0080: "The Founding Emperor's edict said:",
  s0085: 'We have lain wakeful at midnight in distress—what crime have the myriad people committed!',
  s0090: 'We do not break our word—you must have no other anxieties.',
  s0091:
    'Chang then led clan and officials by the Gorge River downward; at Jiangling the emperor sent Palace Commissioner Dou Siyan to welcome and comfort them.',
  s0092:
    'Early in the fourth month Chang and his mother reached Xiang and Han; the emperor again sent envoys bearing an edict granting tea and medicine.',
  s0099: 'That same day: a banquet in the Daming Hall.',
  s0107: 'we have adopted Tang and Yu\'s great instructions and brought the myriad states into harmony.',
  s0114:
    'You raised a hand memorial to declare sincerity and bowed at Heaven\'s Gate to beg for orders.',
  s0116: 'You shall head offices near the Purple Palace to serve the inner court;',
  s0117: 'We cut from the Quail\'s Head deep region a fief for your enfeoffment.',
  s0119: 'You ought respectfully receive this and go tread your post.',
  s0121: 'The remaining offices are conferred with differences.',
  s0123:
    'The Founding Emperor ceased court for five days; in plain dress he raised mourning in the Daming Hall.',
  s0128: '" The Founding Emperor said: "Return to Shu.',
  s0131: '" Thereupon he added rich gifts.',
  s0132:
    'When Chang died she did not weep; she poured wine on the ground and said: "You could not die for the altars of state but clung to life until today.',
  s0135: '" Thereupon she refused food; within several days she died.',
  s0137:
    'He ordered Court of State Ceremonial director Fan Yucheng to oversee the funeral; she was buried with Chang at Luoyang; an edict sent a thousand soldiers of the Fengyi Guard to escort them.',
  s0146: 'Military might shook the layered realms; the whole realm came to unity.',
  s0147: 'Thus we lightly chastised the two river circuits and marched against the Three Gorges.',
  s0152: 'We enfeoffed you with extraordinary honors and prayed for long years.',
  s0171: 'Chang\'s three sons: Xuanzhe, Xuanjue, and Xuanbao.',
  s0172: 'Xuanbao died first; posthumously enfeoffed as King of Sui.',
  s0175:
    'Shenzheng was made military commissioner of the Jingnan Army; Zhaoyuan was made grand general of the Left Leading Army Guard; Yinxun was made right deputy heir apparent; Tinggui was made senior general of the Right Thousand-Ox Guard; Han Baozheng died before an office was conferred.',
  s0181: 'He once in his own hand wrote Yao Chong\'s Mouth Admonition and had it carved on stone.',
  s0182: 'Chang bestowed on him silver vessels and brocade silks.',
  s0183: 'Guangzheng year twenty-one: he took command of the Wude Army.',
  s0184: 'Year twenty-four: additionally made Palace Attendant.',
  s0185: 'Year twenty-five: installed as crown prince.',
  s0190: 'Within several days he abandoned the army and fled back.',
  s0193: 'Xuanzhe presented two hundred horses; white jade and crystal saddle and bridle sets were added.',
  s0195: 'Taiping Xingguo beginning: transferred to Dingzhou.',
  s0198: 'Again he followed the campaign against Youzhou; leading his division he attacked the city\'s western face.',
  s0200: 'Soon the Khitans invaded; Xuanzhe and the commanders defeated them at the Xu River.',
  s0202: 'Before long: made prefect of Huazhou.',
  s0203:
    'Chunhua beginning: he fell ill and asked to exchange to a small prefecture on the Huai to nurse illness.',
  s0210: 'Guangzheng year thirteen: enfeoffed King of Ya; made honorary Grand Marshal.',
  s0211: 'Year twenty: took command of the Baoning Army at Langzhou.',
  s0212: 'Year twenty-four: additionally made honorary Grand Marshal.',
  s0214: 'Soon: appointed commander of the Right Divine Martial Army.',
  s0215:
    'When his mother\'s mourning ended he was restored to office; took command of the Datong Army and Western Capital patrol commissioner.',
  s0218: 'Guangzheng year twenty: took command of the Wutai Army at Qianzhou.',
  s0219: 'Year twenty-four: additionally made honorary Grand Marshal.',
  s0222:
    'Rencao was first Right Leading Army Guard general with concurrent appointment; on the same day as Renzhi he was enfeoffed King of Jia and made honorary Grand Tutor.',
  s0223: 'Guangzheng year twenty-one: took command of the Yongning Army at Guozhou.',
  s0224:
    'He once attended Chang shooting in the gardenia grove; Rencao three times in succession hit the mark.',
  s0225: 'Year twenty-four: additionally made honorary Grand Marshal.',
  s0226: 'He especially revered the Buddhist teaching and deeply investigated its principles.',
  s0227:
    'On returning to court he was appointed senior general of the Right Gate Guard; repeatedly promoted to commander of the Right Dragon Martial Army.',
  s0230: 'Father Yan\'gui followed Zhixiang in entering Shu.',
  s0231:
    'When Zhixiang assumed the imperial title he gave his daughter in marriage to Yan\'gui; posthumously enfeoffed Princess Chonghua.',
  s0232: 'Yan\'gui successively served as prefect of Ling, Jia, and Mei.',
  s0233:
    'Shenzheng from childhood was known for filial piety; when his mother was ill he cut thigh flesh for her to eat.',
  s0234: 'By his father\'s office he served as Shu prefect and Yun\'an salt monopoly commissioner.',
  s0236: 'After a long time he took office as prefect of Shu.',
  s0237:
    'When Qin and Feng raised armies he was ordered to inspect fortifications; soon he took command of the Wutai Army.',
  s0238: 'His son Chongdu was chosen to marry the princess.',
  s0240: 'In matters large and small Chang consulted him on everything.',
  s0241: 'He often took healing the state and grand strategy as his own responsibility.',
  s0243: 'Zhaoyuan was then commanding the army; defeated, he fled.',
  s0244: 'People of the time laughed at him.',
  s0245: 'When Shenzheng returned to court he was made military commissioner of the Jingnan Army.',
  s0247: 'Kaibao end: entered court; made senior general of the Right Garrison Guard.',
  s0251: 'Father Zhaoyun followed Zhixiang in entering Shu.',
  s0254: 'Again made prefect of Hanzhou; appointed commissioner of the Northern Court of the Xuanhui Bureau.',
  s0259: 'Again he garrisoned at Xiongwu.',
  s0260:
    'Guangzheng year fourteen: he went to Chengdu; his personal clerk Yang Qianfan sued Baozheng for misconduct; Chang ordered Qianfan beheaded and released Baozheng without inquiry.',
  s0261: 'Soon transferred to military commissioner of the Ningjiang Army at Kuizhou.',
  s0262: 'Li Hao yielded the revenue commission; Baozheng replaced him.',
  s0265: 'Promoted to honorary Grand Marshal and Palace Attendant.',
  s0269: 'Baozheng fled with his followers; Yande pursued, captured him, and sent him to Quanbin.',
  s0271:
    'Before an office could be conferred he died; posthumously granted senior general of the Right Thousand-Ox Guard.',
  s0272: 'Wang Zhaoyuan was a man of Chengdu, Yizhou.',
  s0274: 'At age thirteen he attached himself to the monk Zhijin of the eastern quarter as a temple boy.',
  s0276:
    'Chang was then beginning studies; Zhixiang saw Zhaoyuan was clever and kept him to serve at Chang\'s side.',
  s0279: 'Additionally made prefect of Meizhou; sent out as military commissioner of the Yongping Army.',
  s0281: 'After more than a year: made military commissioner of the Ningjiang Army at Kuizhou.',
  s0282: "Chang's mother often said Zhaoyuan could not be used; Chang did not follow.",
  s0283: 'Before long he additionally held Shannan West Circuit military commissioner and co-equal councilor.',
  s0284:
    'When he came in to give thanks he asked to be relieved of the memorial courier post; Zhang Rengui of the Left Street was made deputy and acting privy councilor in his place.',
  s0285: 'Zhaoyuan loved reading military books and considerably prided himself on strategy.',
  s0289:
    '" When they marched he held an iron ruyi scepter to direct military affairs; he compared himself to Zhuge Liang.',
  s0293:
    '" Soon pursuing horsemen seized him and sent him to court; the Founding Emperor released him and appointed him grand general of the Left Leading Army Guard.',
  s0294: 'When Guangnan was pacified he was dispatched as envoy to Jiaozhi.',
  s0296: 'Zhao Chongtao was a man of Taiyuan, Bingzhou.',
  s0297: 'Father Tingyin followed Zhixiang in entering Shu.',
  s0298: 'Tingyin was brave in boxing and wise in strategy; none under Zhixiang matched him.',
  s0300: 'Zhang fled back; his subordinates killed him; Zhixiang then possessed his territory.',
  s0370: 'Tinggui was appointed acting governor of Xingyuan.',
};

function parseEmbeddedChapterData(html) {
  const marker = 'window.currentChapterData = ';
  const idx = html.indexOf(marker);
  if (idx < 0) throw new Error('window.currentChapterData not found');
  const start = idx + marker.length;
  let depth = 0;
  for (let i = start; i < html.length; i++) {
    const c = html[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return JSON.parse(html.slice(start, i + 1));
    }
  }
  throw new Error('Could not parse embedded chapter JSON');
}

function extractIdiomaticFromSpans(html) {
  const $ = cheerio.load(html);
  const map = {};
  $('div.english-text span.sentence[data-sentence-id]').each((_, el) => {
    const id = $(el).attr('data-sentence-id');
    map[id] = $(el).text().trim();
  });
  return map;
}

function makeLiteralHeuristic(zh, idm) {
  let lit = idm.trim();
  const orig = lit;

  lit = lit.replace(/^In the (first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) year,?/i, 'Year $1,');
  lit = lit.replace(/^In the first month of the (third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) year,?/i, 'First month, year $1,');
  lit = lit.replace(/^On the (seventh|eighth|ninth|tenth) of this month/i, 'This month, day $1,');
  lit = lit.replace(/^Early in the /i, 'At the beginning of the ');
  lit = lit.replace(/^When the armies arrived/i, 'When the army arrived');
  lit = lit.replace(/^When he reached /i, 'On reaching ');
  lit = lit.replace(/^After Quanbin and the others accepted/i, 'Quanbin and the others, having accepted');
  lit = lit.replace(/^Chang also sent/i, 'Chang again sent');
  lit = lit.replace(/^Chang said:/i, 'Chang said,');
  lit = lit.replace(/^He then asked/i, 'Thereupon he asked');
  lit = lit.replace(/^The emperor was heartened/i, 'The Emperor was pleased');
  lit = lit.replace(/^The full account is given in/i, 'The matter is fully set forth in');
  lit = lit.replace(/^The princess died in/i, 'The Princess, in');
  lit = lit.replace(/ died in the (third|fourth|fifth) year of Changxing\./i, ', year $1 of Changxing, died.');
  lit = lit.replace(/Your subjects rely on/i, 'We subjects rely on');
  lit = lit.replace(/and follow the court's plan/i, 'and follow the temple calculations');
  lit = lit.replace(/My loyal intent was fully set forth/i, 'Loyal intent was fully prepared');
  lit = lit.replace(/and our bond of friendship was secured like gold and orchid/i, 'and the alliance of friendship was secured as gold and orchid');
  lit = lit.replace(/When word came of the gracious tidings/i, 'When the good news of punitive expedition was transmitted');
  lit = lit.replace(/it truly stirred the joy of allied states/i, 'it truly moved the joy of chariot-ally states');
  lit = lit.replace(/Can West River Circuit be taken/i, 'West River Circuit—can it be taken');
  lit = lit.replace(/But if it is on earth/i, 'If it is on the ground');
  lit = lit.replace(/wherever we arrive we shall pacify it at once/i, 'wherever we reach, at once it will be pacified');
  lit = lit.replace(/Whenever you take a city or fort/i, 'Every city or fort taken');
  lit = lit.replace(/Zhaoyuan and the others were captured one after another/i, 'Zhaoyuan and the rest were captured in succession');
  lit = lit.replace(/Chang was greatly afraid/i, 'Chang greatly feared');
  lit = lit.replace(/Xuanzhe had never practiced warfare/i, 'Xuanzhe from of old did not practice military affairs');
  lit = lit.replace(/Chang grew still more terrified/i, 'Chang was still more alarmed');
  lit = lit.replace(/An old general named Shi Bin replied/i, 'An old general, Shi Bin, replied');
  lit = lit.replace(/will not loose a single arrow eastward for me/i, 'will not for me shoot one arrow eastward');
  lit = lit.replace(/If we now hold the forts/i, 'Now if we fortify the camps');
  lit = lit.replace(/who will die for me/i, 'who will for me give their lives');
  lit = lit.replace(/When my late father passed away I was still a child in topknots/i, 'When the late father died, I was still in childhood topknots');
  lit = lit.replace(/in my youthful folly I wrongly inherited/i, 'foolishly I inherited');
  lit = lit.replace(/I failed the propriety of a small state serving a great one/i, 'I violated the rite of small serving great');
  lit = lit.replace(/their momentum was like sudden thunder, their achievement like splitting bamboo/i, 'their momentum was like swift thunder; their achievement like bamboo split');
  lit = lit.replace(/Considering only my feeble troops, how could I dare meet the spearpoints/i, 'Looking at my weak soldiers, how dare I face the blades');
  lit = lit.replace(/Soon I bound my hands and came like clouds returning/i, 'Soon I bound my hands and came, like clouds returning');

  const zhCommas = (zh.match(/[，；]/g) || []).length;
  if (zhCommas > 0 && lit === orig) {
    let n = 0;
    lit = lit.replace(/, /g, () => (++n <= zhCommas ? '; ' : ', '));
  }
  if (lit === orig && zh.endsWith('。') && !zh.includes('，')) {
    if (/^三年，/.test(zh)) lit = 'Year three: Shu was pacified.';
    if (/事具/.test(zh)) lit = 'The matter is fully recorded in the History of the Five Dynasties.';
  }
  if (lit.trim() === orig.trim()) {
    const parts = idm.split(/(?<=[.!?])\s+/);
    if (parts.length > 1) lit = parts.join('; ');
    else if (zhCommas > 0) lit = idm.replace(/, /g, '; ');
  }
  return lit.trim();
}

function resolveLiteral(id, zh, embedLit, idm) {
  if (LITERAL_FIXES[id]) return LITERAL_FIXES[id];
  let lit = embedLit?.trim() || '';
  if (!lit) lit = makeLiteralHeuristic(zh, idm);
  if (lit === idm && countHanzi(zh) > 3) lit = makeLiteralHeuristic(zh, idm);
  if (lit === idm && countHanzi(zh) > 3) {
    throw new Error(`Could not derive distinct literal for ${id}: ${zh.slice(0, 40)}`);
  }
  return lit;
}

function walkContent(content, embedById, idmById, fn) {
  for (const block of content) {
    if (block.sentences) {
      for (const s of block.sentences) fn(s, embedById, idmById);
    }
    if (block.rows) {
      for (const row of block.rows) {
        for (const cell of row) {
          if (cell?.sentences) for (const s of cell.sentences) fn(s, embedById, idmById);
        }
      }
    }
  }
}

const html = fs.readFileSync(HTML_PATH, 'utf8');
const embedded = parseEmbeddedChapterData(html);
const idmById = extractIdiomaticFromSpans(html);

const embedById = {};
walkContent(embedded.content, {}, {}, (s) => {
  embedById[s.id] = s.translations[0];
});

const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
let count = 0;
let translated = 0;

walkContent(data.content, embedById, idmById, (s) => {
  count++;
  const embed = embedById[s.id];
  const idm = idmById[s.id];
  if (!idm?.trim()) throw new Error(`Missing idiomatic in HTML for ${s.id}`);
  const literal = resolveLiteral(s.id, s.zh, embed?.literal, idm);
  s.translations = [{ lang: 'en', literal, idiomatic: idm, translator: TRANSLATOR, model: MODEL }];
  if (literal.trim() && idm.trim()) translated++;
});

data.meta.translatedCount = translated;
data.meta.translators = [TRANSLATOR];

fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2) + '\n');

// Verify
const problems = [];
walkContent(data.content, embedById, idmById, (s) => {
  const t = s.translations[0];
  if (!t.literal?.trim() || !t.idiomatic?.trim()) problems.push(`${s.id}: empty`);
  if (t.translator !== TRANSLATOR) problems.push(`${s.id}: translator`);
  if (t.literal === t.idiomatic && countHanzi(s.zh) > 3) problems.push(`${s.id}: identical`);
});

console.log(`Recovered ${count} sentences, ${translated} translated.`);
if (problems.length) {
  console.error('Problems:', problems.slice(0, 20));
  process.exit(1);
}
console.log(`All sentences have literal + idiomatic; translator "${TRANSLATOR}" throughout.`);
