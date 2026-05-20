#!/usr/bin/env node
/** Batch 5: s0401–s0500 (Jiutangshu ch.030, Rites 6) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/030.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 401;
const END = 500;

function loadSentencesFromData() {
  const book = JSON.parse(readFileSync(dataPath, 'utf8'));
  const out = new Map();
  let blockIndex = 0;
  for (const block of book.content) {
    for (const s of block.sentences || []) {
      out.set(s.id, { chinese: s.zh, blockIndex });
    }
    blockIndex++;
  }
  return out;
}

function extractRange(chapterPath, startN, endN) {
  const data = JSON.parse(readFileSync(chapterPath, 'utf8'));
  const out = [];
  const seenIds = new Set();

  for (let blockIndex = 0; blockIndex < data.content.length; blockIndex++) {
    const block = data.content[blockIndex];
    let blockSentences = [];

    if (block.type === 'paragraph') {
      blockSentences = block.sentences;
    } else if (block.type === 'table_row') {
      blockSentences = block.cells.filter((cell) => cell.content && cell.content.trim());
    } else if (block.type === 'table_header') {
      blockSentences = block.sentences.filter((s) => s.zh && s.zh.trim());
    }

    for (const sentence of blockSentences) {
      const sentenceId = sentence.id;
      const n = parseInt(sentenceId.slice(1), 10);
      if (n < startN || n > endN) continue;

      let chineseText = '';
      if (block.type === 'paragraph' || block.type === 'table_header') {
        chineseText = sentence.zh;
      } else if (block.type === 'table_row') {
        chineseText = sentence.content;
      }

      let displayId = sentenceId;
      if (seenIds.has(displayId)) {
        displayId = `${sentenceId}@${blockIndex}`;
      }
      seenIds.add(displayId);

      out.push({
        id: displayId,
        originalId: sentenceId,
        blockIndex,
        chinese: chineseText,
        literal: '',
        idiomatic: '',
      });
    }
  }

  out.sort(
    (a, b) => parseInt(a.originalId.slice(1), 10) - parseInt(b.originalId.slice(1), 10)
  );
  return out;
}


const T = {
  s0401: {
    literal: 'Again, Han and Wei xia sacrifices were all held in the tenth month. Jin ritual officers wished to use the mid-autumn yin sacrifice; Left Vice Director Kong Anguo memorialized impeachment, and more than one was dismissed from office.',
    idiomatic: 'Han and Wei xia rites fell in the tenth month. Jin ritualists proposed a mid-autumn yin sacrifice; Left Vice Director Kong Anguo impeached them, and several lost their posts.',
  },
  s0402: {
    literal: 'Early in Liang, meritorious ministers were mistakenly included in the di sacrifice; Left Assistant Minister He Tongzhi submitted a rebutting deliberation, and Emperor Wu approved and followed it.',
    idiomatic: 'Early Liang wrongly ranked meritorious ministers in the di sacrifice; Left Assistant Minister He Tongzhi objected, and Emperor Wu approved his view.',
  },
  s0403: {
    literal: 'Down through Zhou and Qi, all followed this rite.',
    idiomatic: 'From Zhou and Qi onward all followed this practice.',
  },
  s0404: {
    literal: 'Your subject holds that two yin sacrifices in five years accord with Heaven\'s Way—a great and a small; refined scholars agree that in the small, ministers do not participate, while in the great, meritorious ministers are also included.',
    idiomatic: 'Two yin sacrifices in five years match Heaven\'s pattern—one great, one small. Learned opinion holds that the lesser excludes ministers, the greater includes meritorious ministers.',
  },
  s0405: {
    literal: 'Now the rite has di without meritorious ministers; your subject truly holds the rite cannot be altered.',
    idiomatic: 'The present rite omits meritorious ministers from di; the rite should not be changed.',
  },
  s0406: {
    literal: '" An edict then ordered the regulations changed to follow the rite.',
    idiomatic: '" An edict ordered the rules brought into line with ritual.',
  },
  s0407: {
    literal: 'In the Kaiyuan era, when the rites were revised, di and xia were again both made to include meritorious ministers in accompanying offerings.',
    idiomatic: 'When Kaiyuan revised the rites, di and xia again both assigned meritorious ministers accompanying offerings.',
  },
  s0408: {
    literal: 'In the tenth month of the third year of Shangyuan under Emperor Gaozong, a xia offering was to be performed at the Grand Temple.',
    idiomatic: 'Gaozong, Shangyuan 3, tenth month: a Grand Temple xia was planned.',
  },
  s0409: {
    literal: 'Deliberators cited the Rites Apocrypha, "xia once in three years, di once in five years," and the Gongyang Commentary, "two yin sacrifices in five years"; the arguments crossed and none could decide.',
    idiomatic: 'Debates cited the Rites Apocrypha ("xia every three years, di every five") and Gongyang ("two yin sacrifices in five years") and could not be resolved.',
  },
  s0410: {
    literal: 'Erudite of the Imperial Academy Shi Can and others deliberated: "According to the Correct Meaning of the Book of Rites citing Zheng Xuan\'s Record of Di and Xia: \'The Spring and Autumn Annals: Duke Xi died in the twelfth month of his thirty-third year.',
    idiomatic: 'Academician Shi Can et al. argued: per the Book of Rites citing Zheng Xuan\'s Di-Xia Record, Spring and Autumn records Duke Xi\'s death in month 12, year 33.',
  },
  s0411: {
    literal: 'In the second year of Duke Wen, eighth month, dingmao, a great offering was made at the Grand Temple.',
    idiomatic: 'Duke Wen year 2, month 8, dingmao: a great offering at the Grand Temple.',
  },
  s0412: {
    literal: 'The Gongyang Commentary says: What is a great offering?',
    idiomatic: 'Gongyang asks: what is a great offering?',
  },
  s0413: {
    literal: 'It is xia.',
    idiomatic: 'Xia.',
  },
  s0414: {
    literal: '\' When the three-year mourning was complete, in the new ruler\'s second year there should be xia; the next year di at the group temples.',
    idiomatic: 'After three-year mourning, year 2 is xia; year 3 is di at the group temples.',
  },
  s0415: {
    literal: 'Dukes Xi and Xuan both had di in their eighth years; thus the later di was five years from the earlier di.',
    idiomatic: 'Xi and Xuan each held di in year 8—five years between successive di.',
  },
  s0416: {
    literal: 'By this determination, a new ruler has xia in year 2 and di in year 3.',
    idiomatic: 'Thus a new ruler: xia year 2, di year 3.',
  },
  s0417: {
    literal: 'Thereafter, with two yin sacrifices in five years, year 6 should be xia and year 8 di.',
    idiomatic: 'Thereafter, two yin sacrifices in five years means xia in year 6 and di in year 8.',
  },
  s0418: {
    literal: 'Again, in Duke Zhao\'s tenth year Qi Gui died; by the thirteenth year mourning was complete and xia was due, but because of the Pingqiu conference, in winter the duke went to Jin.',
    idiomatic: 'Duke Zhao year 10: Qi Gui died; mourning ended year 13 when xia was due, but the Pingqiu meeting sent the duke to Jin that winter.',
  },
  s0419: {
    literal: 'Xia came in year 14 and di in year 15—the Commentary\'s "there were affairs at the Martial Shrine" refers to this.',
    idiomatic: 'Xia in year 14, di in year 15—the "affairs at the Martial Shrine" passage applies.',
  },
  s0420: {
    literal: 'Xia in year 18, di in year 20.',
    idiomatic: 'Xia year 18, di year 20.',
  },
  s0421: {
    literal: 'Xia in year 23, di in year 25.',
    idiomatic: 'Xia year 23, di year 25.',
  },
  s0422: {
    literal: 'Duke Zhao year 25, "there were affairs at the Xiang Shrine," refers to this.',
    idiomatic: 'Zhao year 25, "affairs at the Xiang Shrine," is the same pattern.',
  },
  s0423: {
    literal: 'As stated above, after di, xia follows three years later; after xia, di follows two years later.',
    idiomatic: 'After di, xia is three years later; after xia, di is two years later.',
  },
  s0424: {
    literal: 'This accords with the ritual classics and does not violate the Commentary\'s meaning.',
    idiomatic: 'This fits the classics and Gongyang\'s sense.',
  },
  s0425: {
    literal: '" From this, Can and others\' deliberation was adopted as fixed.',
    idiomatic: '" Can\'s view became the fixed rule.',
  },
  s0426: {
    literal: 'In autumn of the sixth Kaiyuan year, when Emperor Ruizong\'s mourning was complete, xia was performed at the Grand Temple.',
    idiomatic: 'Kaiyuan 6 autumn: after Ruizong\'s mourning, Grand Temple xia was held.',
  },
  s0427: {
    literal: 'Thereafter it was again handed down as xia once in three years and di once in five years, each counted separately, not reckoned together.',
    idiomatic: 'Later practice counted xia every three years and di every five, separately—not jointly.',
  },
  s0428: {
    literal: 'By year 27, there had been five di and seven xia in all.',
    idiomatic: 'By year 27 there had been five di and seven xia.',
  },
  s0429: {
    literal: 'That year, after summer di was complete, winter again called for xia.',
    idiomatic: 'That year summer di had just ended when winter again required xia.',
  },
  s0430: {
    literal: 'The Court of Imperial Sacrifices deliberated:',
    idiomatic: 'The Court of Imperial Sacrifices reported:',
  },
  s0431: {
    literal: 'The two rites di and xia are both yin sacrifices: xia is combined feasting at the ancestral temple; di means ordering ranks of honor.',
    idiomatic: 'Di and xia are both yin sacrifices: xia combines ancestors at the Grand Temple; di orders seniority.',
  },
  s0432: {
    literal: 'They extend the former ruler\'s kindness reaching down and gather the filial piety of descendants in serving kin—unlike regular offerings, they are performed at set times.',
    idiomatic: 'They extend a late ruler\'s care and gather heirs\' filial service—unlike seasonal rites, performed only at appointed times.',
  },
  s0433: {
    literal: 'Yet offerings should not be frequent; frequency breeds irreverence;',
    idiomatic: 'Sacrifice should not be too frequent, lest it become irreverent;',
  },
  s0434: {
    literal: 'nor should they be too sparse, lest neglect arise.',
    idiomatic: 'nor too sparse, lest it breed neglect.',
  },
  s0435: {
    literal: 'Therefore the king models Heaven\'s Way and fixes the sacrificial canon.',
    idiomatic: 'Kings therefore model Heaven and fix the sacrificial canon.',
  },
  s0436: {
    literal: 'Zheng and chang mirror the seasons; di and xia are like intercalary months.',
    idiomatic: 'Zheng and chang follow the seasons; di and xia follow the intercalary pattern.',
  },
  s0437: {
    literal: 'Two intercalations in five years complete Heaven\'s great pattern; the ancestral temple follows this with two yin sacrifices.',
    idiomatic: 'Two intercalations in five years complete Heaven\'s cycle; the temple mirrors this with two yin sacrifices.',
  },
  s0438: {
    literal: 'Respectfully according to the "Royal Regulations" in the Book of Rites, the Director of Ritual in the Offices of Zhou, Zheng Xuan\'s commentary, and Gaotang\'s deliberation—all say: "When a state lord succeeds, after three-year mourning is complete, xia at the Grand Ancestor.',
    idiomatic: 'Per Book of Rites "Royal Regulations," Zhou Offices Director of Ritual, Zheng Xuan, and Gaotang: after succession and three-year mourning, xia at the Grand Ancestor.',
  },
  s0439: {
    literal: 'The next year di at the group temples.',
    idiomatic: 'The next year, di at the group temples.',
  },
  s0440: {
    literal: 'Thereafter, two yin sacrifices in five years—one xia and one di."',
    idiomatic: 'Thereafter two yin sacrifices in five years—one xia, one di."',
  },
  s0441: {
    literal: 'Han and Wei precedents and the Veritable Records of Zhenguan all used this rite.',
    idiomatic: 'Han, Wei, and Zhenguan records all followed this schedule.',
  },
  s0442: {
    literal: 'Again according to the Rites Apocrypha and the Lu Rites Commentary on Di and Xia: xia once in three years, di once in five years—what is called two yin sacrifices in five years.',
    idiomatic: 'The Rites Apocrypha and Lu commentary likewise say xia every three years and di every five—the "two yin sacrifices in five years."',
  },
  s0443: {
    literal: 'Again according to the Baihu Treatise, Comprehensive Meaning of the Five Classics, Xu Shen\'s Dissenting Views, He Xiu\'s Spring and Autumn, and He Xun\'s Sacrificial Deliberation—all say di once in three years.',
    idiomatic: 'Baihu, Five Classics Meaning, Xu Shen, He Xiu, and He Xun\'s Sacrificial Deliberation all say di every three years.',
  },
  s0444: {
    literal: 'Why?',
    idiomatic: 'Why (idiomatic).',
  },
  s0445: {
    literal: 'They hold that one intercalation in three years means Heaven\'s small completion; two intercalations in five years means Heaven\'s great completion.',
    idiomatic: 'One intercalation in three years is Heaven\'s lesser cycle; two in five is the greater—hence the count.',
  },
  s0446: {
    literal: 'Thus two yin sacrifices in five years, reckoned through the whole number, one xia and one di alternate in succession.',
    idiomatic: 'Two yin sacrifices in five years mean one xia and one di alternating through the whole period.',
  },
  s0447: {
    literal: 'Now Grand Temple di and xia each count their own years; two branches are issued, not reckoned together.',
    idiomatic: 'Today di and xia are counted separately—two schedules, not one integrated cycle.',
  },
  s0448: {
    literal: 'Sometimes offerings cluster in successive years, or twice in one year; sometimes after one di there are two xia, or within five years suddenly three yin sacrifices.',
    idiomatic: 'Offerings sometimes pile up year after year or twice in one year; one di may be followed by two xia, or three yin sacrifices within five years.',
  },
  s0449: {
    literal: 'The period modeled on Heaven\'s intercalary pattern is already violated;',
    idiomatic: 'The intercalary pattern is already broken;',
  },
  s0450: {
    literal: 'the rule of two yin sacrifices in five years also differs in number.',
    idiomatic: 'and the "two yin sacrifices in five years" count no longer holds.',
  },
  s0451: {
    literal: 'Sought in ritual texts, it is quite at odds.',
    idiomatic: 'Measured against ritual text, the practice is seriously awry.',
  },
  s0452: {
    literal: 'Some explainers say: "The two rites di and xia differ in greatness; the sacrifice names differ and the year-counts cross.',
    idiomatic: 'Some argue di and xia differ in rank and name, so their year-counts cannot be unified.',
  },
  s0453: {
    literal: 'Xia uses three cycles, reaching the small and combining;',
    idiomatic: 'Xia uses three cycles to reach the lesser union;',
  },
  s0454: {
    literal: 'di uses five divisions, reaching ten to complete the cycle.',
    idiomatic: 'di uses five divisions to complete a ten-year cycle.',
  },
  s0455: {
    literal: 'With such discrepancy, it is hard to reckon together."',
    idiomatic: 'Such discrepancy, they say, forbids a single reckoning."',
  },
  s0456: {
    literal: 'Your subject holds that the theory of three xia and five di comes from the Rites Apocrypha; the count of two yin sacrifices in five years is in the same chapter—harmonizing the two texts, they do not contradict.',
    idiomatic: 'The "three xia, five di" theory and "two yin sacrifices in five years" both come from the Rites Apocrypha and can be harmonized.',
  },
  s0457: {
    literal: 'It is that after di, xia is placed two and a half cycles later; taking the full number, it is called three years—like one intercalation in three years using only thirty-six months.',
    idiomatic: 'After di, xia follows two and a half cycles; rounded to a full number that is "three years," as one intercalation uses thirty-six months.',
  },
  s0458: {
    literal: 'Di and xia have different names, each following the four seasons: autumn-winter for xia, spring-summer for di.',
    idiomatic: 'Di and xia take different names by season—xia in autumn-winter, di in spring-summer.',
  },
  s0459: {
    literal: 'Though the sacrifice names differ, as yin sacrifices they are the same—like yue, ci, zheng, and chang, their substance is one.',
    idiomatic: 'Names differ, but as yin sacrifices they are one—like yue, ci, zheng, and chang.',
  },
  s0460: {
    literal: 'Zheng Xuan holds xia is great and di small; some commentaries hold xia small and di great—in the array of offerings there may be increase or decrease, but in reckoning together there is fundamentally no difference.',
    idiomatic: 'Zheng Xuan says xia is greater, some texts say di is greater; offerings may vary, but the combined reckoning is the same.',
  },
  s0461: {
    literal: 'The method modeled on intercalation has been transmitted long.',
    idiomatic: 'The intercalary model is ancient.',
  },
  s0462: {
    literal: 'Only Jin-era Chen Shu had a deliberation of one yin sacrifice in three years—from five, eight, eleven, and fourteen; tracing his deliberation\'s citations, he too spoke of modeling intercalation.',
    idiomatic: 'Only Jin\'s Chen Shu argued one yin sacrifice every three years (years 5, 8, 11, 14), still citing the intercalary model.',
  },
  s0463: {
    literal: 'Yet two yin sacrifices in six years—how can it be called modeling intercalation?',
    idiomatic: 'Two yin sacrifices in six years is not "modeling intercalation."',
  },
  s0464: {
    literal: 'And di once in five years—where is it applied?',
    idiomatic: 'Nor does "di every five years" fit.',
  },
  s0465: {
    literal: 'Contradictory theories are indeed hard to rely on.',
    idiomatic: 'Contradictory theories cannot be relied on.',
  },
  s0466: {
    literal: 'Since the measure that models Heaven already has its direction, and investigating antiquity the principle is so clear.',
    idiomatic: 'Heaven\'s measure has a clear direction; antiquity confirms it.',
  },
  s0467: {
    literal: 'Reckoning di and xia together is plain.',
    idiomatic: 'Joint reckoning of di and xia is plain.',
  },
  s0468: {
    literal: 'We now ask to take Kaiyuan 27, year jimao, fourth month for di; to year xinsi tenth month for xia; to year jiashen fourth month again di; to year bingxu tenth month again xia; to year jichou fourth month again di; to year xinmao tenth month again xia.',
    idiomatic: 'Proposed schedule from Kaiyuan 27 jimao month 4 di, through xinsi month 10 xia, jiashen month 4 di, bingxu month 10 xia, jichou month 4 di, xinmao month 10 xia.',
  },
  s0469: {
    literal: 'From this, two yin sacrifices in five years, cycling and beginning again.',
    idiomatic: 'Thereafter two yin sacrifices in five years, cycling indefinitely.',
  },
  s0470: {
    literal: 'Again, theories of di and xia are not from one school alone; texts on two yin sacrifices in five years already follow one another, and the principle of modeling Heaven\'s intercalation is broadly the same.',
    idiomatic: 'Di-xia theory has many schools, but "two yin sacrifices in five years" and the intercalary model largely agree.',
  },
  s0471: {
    literal: 'Yet placing xia after di may be near or far; in the measure of expansion and contraction there are two methods: Zheng Xuan and Gaotang place three first then two;',
    idiomatic: 'After di, xia may be nearer or farther. Zheng Xuan and Gaotang put "three" before "two";',
  },
  s0472: {
    literal: 'Xu Miao\'s deliberation puts two first then three.',
    idiomatic: 'Xu Miao puts "two" before "three."',
  },
  s0473: {
    literal: 'Respectfully according to Zheng\'s commentary, the method of three first approximates the text of three xia and five di, preserving the positions of three years and five years.',
    idiomatic: 'Zheng\'s "three first" method fits the three-xia five-di texts and preserves the three-year and five-year slots.',
  },
  s0474: {
    literal: 'It holds that if in year jia there is di, in year ding there should be xia, in year ji again di, in year ren again xia, in year jia again di, in year ding again xia—cycling and beginning again, handed down thus.',
    idiomatic: 'On Zheng\'s scheme: jia year di, ding xia, ji di, ren xia, and repeat—jia di, ding xia, and so on.',
  },
  s0475: {
    literal: 'From xia to di is eighteen months—near; from di to xia thirty-six months—far; the analysis is uneven and crude in calculation.',
    idiomatic: 'Xia to di is 18 months (too near); di to xia is 36 (too far)—uneven spacing.',
  },
  s0476: {
    literal: 'Suppose one pursues heterodox views and places xia in autumn: then thirty-nine months before and twenty-one after—though slightly better, the interval is still skewed.',
    idiomatic: 'Placing xia in autumn yields 39 months before and 21 after—slightly better but still skewed.',
  },
  s0477: {
    literal: 'Your subject relies on the original texts, which all say "model intercalation"; two intercalations apart are then evenly divided.',
    idiomatic: 'The texts all say "model intercalation"; two intercalations apart divide evenly.',
  },
  s0478: {
    literal: 'Why should the order of the two yin sacrifices be unequal?',
    idiomatic: 'Why should the two yin sacrifices be unequal?',
  },
  s0479: {
    literal: 'Moreover, "three years" originally states the full number; two and a half cycles truly equals three years—placing xia here does not violate the text; why must one rigidly insist on skipping three first months?',
    idiomatic: '"Three years" is a round number for two and a half cycles; placing xia here does not violate the text—why insist on three whole years?',
  },
  s0480: {
    literal: 'It is the one flaw in a thousand deliberations—the blind spot of accomplished scholars.',
    idiomatic: 'Even great scholars err once in a thousand deliberations.',
  },
  s0481: {
    literal: 'Xu\'s deliberation differs from this; examined thoroughly, it is most reliable.',
    idiomatic: 'Xu Miao\'s view differs and, on close review, is most reliable.',
  },
  s0482: {
    literal: 'It holds that two di are sixty months apart; halve to thirty and place one xia.',
    idiomatic: 'Two di are 60 months apart; halve to 30 and insert one xia.',
  },
  s0483: {
    literal: 'If in year jia summer di, in year bing winter xia, the intercalary model is followed without the slightest deviation.',
    idiomatic: 'Jia summer di, bing winter xia—exact intercalary spacing.',
  },
  s0484: {
    literal: 'The text "xia once in three years" is not violated;',
    idiomatic: 'This satisfies "xia every three years";',
  },
  s0485: {
    literal: 'the rule of two yin sacrifices in five years has even spacing in its count.',
    idiomatic: 'and keeps "two yin sacrifices in five years" evenly spaced.',
  },
  s0486: {
    literal: 'Compared with the various Ru, the meaning is truly enduring.',
    idiomatic: 'Among Ru traditions it is the soundest long-term reading.',
  },
  s0487: {
    literal: 'We now ask to fix the two yin sacrifices on this basis, projecting sacrifice months in advance, cycling and beginning again.',
    idiomatic: 'We ask to fix the two yin sacrifices on this basis, project the months, and cycle indefinitely.',
  },
  s0488: {
    literal: 'Supernumerary Secretary in the Ministry of Rites Cui Zongzhi rebutted and sent the matter down to the Court of Imperial Sacrifices for further deliberation; Academician of the Hall of Assembled Worthies Lu Shanqing and others were ordered to examine further, and Shanqing also approved this deliberation.',
    idiomatic: 'Cui Zongzhi of the Ministry of Rites objected and sent the case back to the Court of Imperial Sacrifices; Lu Shanqing and other academicians reviewed it and approved.',
  },
  s0489: {
    literal: 'Thereupon Director Wei Zong memorialized: "The rites provide di and xia, both called yin sacrifices; the two methods alternate in scale-like succession.',
    idiomatic: 'Director Wei Zong reported: di and xia are both yin sacrifices, alternating in regular succession.',
  },
  s0490: {
    literal: 'Some say two yin sacrifices in five years—one di and one xia.',
    idiomatic: 'Some say two yin sacrifices in five years—one di, one xia.',
  },
  s0491: {
    literal: 'Some say xia once in three years, di once in five years.',
    idiomatic: 'Others say xia every three years and di every five.',
  },
  s0492: {
    literal: 'Modeling Heaven\'s intercalation—the main tendency is the same.',
    idiomatic: 'All model Heaven\'s intercalation in broad outline.',
  },
  s0493: {
    literal: 'All because Grand Temple di and xia count years differently; examined against classics and commentaries, there is slight deviation.',
    idiomatic: 'But because the Grand Temple counts di and xia separately, the practice slightly departs from the classics.',
  },
  s0494: {
    literal: 'Recently in the fourth month, di was already performed; now pointing to mid-winter, xia rites are again proposed—combined feasting too frequent, fearing violation of former canons.',
    idiomatic: 'Di was just performed in the fourth month; mid-winter xia is now proposed—combined feasting too often, against ancient precedent.',
  },
  s0495: {
    literal: 'Your subject notes that Your Majesty\'s accomplishments are complete and old things all restored—at a time when the ancestral temple is reverently cautious and canonical teaching is clarified.',
    idiomatic: 'Your Majesty has restored the rites; this is the moment to clarify ancestral practice.',
  },
  s0496: {
    literal: 'We who disgracefully hold ritual office are charged with deliberation and venture according to old texts to fix the sequence.',
    idiomatic: 'We in ritual office venture to fix the sequence from old texts.',
  },
  s0497: {
    literal: 'We ask that this year\'s summer di serve as the source of yin sacrifices; from this onward di and xia alternate, two yin sacrifices in five years, cycling and beginning again.',
    idiomatic: 'Let this summer\'s di begin the cycle; thereafter di and xia alternate every five years.',
  },
  s0498: {
    literal: 'This year\'s winter xia should by the rite be stopped; we hope the responsible offices will perform only the seasonal offering, so solemn sacrifice is not irreverent and the old rite is approximated.',
    idiomatic: 'This winter\'s xia should be omitted; only seasonal offerings should be held, avoiding irreverent frequency.',
  },
  s0499: {
    literal: '" The edict followed this.',
    idiomatic: '" Approved.',
  },
  s0500: {
    literal: 'Former practice: edict of Tianbao 8, intercalary sixth month, sixth day: "The rites of di and xia preserve ordered rank; changes in substance and ornament take their cue from the times.',
    idiomatic: 'Former practice—Tianbao 8, intercalary month 6, day 6 edict: "Di and xia preserve rank; ornament may change with the times.',
  },
};
const source = loadSentencesFromData();
for (let n = START; n <= END; n++) {
  const id = `s${String(n).padStart(4, '0')}`;
  if (!source.has(id)) throw new Error(`Missing ${id} in ${dataPath}`);
  if (!T[id]) throw new Error(`Missing translation for ${id}`);
}

const expectedIds = new Set(
  Array.from({ length: END - START + 1 }, (_, i) => `s${String(START + i).padStart(4, '0')}`)
);

for (const id of expectedIds) {
  const pair = T[id];
  if (pair.literal === pair.idiomatic) {
    throw new Error(`${id}: literal and idiomatic must differ`);
  }
}

if (!existsSync(transPath)) {
  console.log(
    `No ${transPath}; standalone T ready (${Object.keys(T).length} entries, s${String(START).padStart(4, '0')}–s${String(END).padStart(4, '0')}).`
  );
  process.exit(0);
}

const data = JSON.parse(readFileSync(transPath, 'utf8'));
if (data.metadata.chapter !== '030') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 030; standalone T ready (${Object.keys(T).length} entries).`
  );
  process.exit(0);
}

const sessionIds = new Set(data.sentences.map((s) => s.originalId || s.id));
const hasRange = [...expectedIds].every((id) => sessionIds.has(id));

if (!hasRange) {
  const extracted = extractRange(dataPath, START, END);
  for (const row of extracted) {
    const key = row.originalId;
    if (!sessionIds.has(key)) {
      data.sentences.push(row);
      sessionIds.add(key);
    }
  }
  const stillMissing = [...expectedIds].filter((id) => !sessionIds.has(id));
  if (stillMissing.length) {
    console.log(
      `Session lacks ${stillMissing.join(', ')}; standalone T ready (${Object.keys(T).length} entries). Re-run after the next start-translation batch.`
    );
    process.exit(0);
  }
}

const byId = new Map(data.sentences.map((s) => [s.originalId || s.id, s]));
for (const id of expectedIds) {
  const src = source.get(id);
  const row = byId.get(id);
  if (!row) throw new Error(`Session missing ${id}`);
  if (src.chinese && row.chinese !== src.chinese) {
    row.chinese = src.chinese;
  } else if (!row.chinese) {
    row.chinese = src.chinese;
  }
}

let applied = 0;
for (const s of data.sentences) {
  const key = s.originalId || s.id;
  const pair = T[key];
  if (!pair) continue;
  if (pair.literal === pair.idiomatic) {
    throw new Error(`${key}: literal and idiomatic must differ`);
  }
  s.literal = pair.literal;
  s.idiomatic = pair.idiomatic;
  applied++;
}

const missing = [...expectedIds].filter(
  (id) => !data.sentences.some((s) => (s.originalId || s.id) === id && s.idiomatic)
);
if (missing.length) {
  throw new Error(`Missing applied translations for: ${missing.join(', ')}`);
}
if (applied !== Object.keys(T).length) {
  throw new Error(`Applied ${applied}, expected ${Object.keys(T).length}`);
}

writeFileSync(transPath, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', applied, 'translations (s' + String(START).padStart(4, '0') + '–s' + String(END).padStart(4, '0') + ') to', transPath);
