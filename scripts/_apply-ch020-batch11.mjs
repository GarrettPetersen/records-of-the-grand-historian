#!/usr/bin/env node
/** Batch 11: s1001–s1100 (Jiutangshu ch.020, Zhaozong annals) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/020.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 1001;
const END = 1100;

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
  s1001: {
    literal: 'Taining military governor, acting Minister of Works, Yanzhou prefect, Censor Grand Master Ge Congzhou acting Minister of Works, also Right Golden Guard senior general retired—Congzhou had wind illness and could not attend court.',
    idiomatic: 'Ge Congzhou, governor of Taining at Yanzhou, was promoted then retired as Right Golden Guard senior general—wind sickness kept him from court.',
  },
  s1002: {
    literal: 'Left Golden Guard senior general Lu Yanwei was made Left Weiwu senior general.',
    idiomatic: 'Lu Yanwei moved from Left Golden Guard to Left Weiwu senior general.',
  },
  s1003: {
    literal: 'That month on the communal-offering day, Privy Councilor Jiang Xuanhui feasted the nine princes including Prince of De Wang Yu at Jiuchiqu Pool; when drunk, all were strangled; in the end their burial place was unknown.',
    idiomatic: 'That month on the communal day Jiang Xuanhui feasted nine princes including Prince of De at Jiuchiqu Pool, got them drunk, and strangled them; no one knew where they were buried.',
  },
  s1004: {
    literal: 'On bingchen, Left Vice Director Pei Zan and others deliberated temple move, agreeing to move Shunzong one chamber—approved.',
    idiomatic: 'On bingchen Pei Zan and others agreed to shift Shunzong’s spirit tablet one chamber in the ancestral temple.',
  },
  s1005: {
    literal: 'On jiwei, Emperor Zhaozong’s spirit tablet was enshrined in the Imperial Temple; Rites Commission memorialized Zhaozong temple music as “Dance of Secure Tranquility.”',
    idiomatic: 'On jiwei Zhaozong’s tablet entered the Imperial Temple with the hymn “Dance of Secure Tranquility.”',
  },
  s1006: {
    literal: 'On the first day of the third month, gengshen.',
    idiomatic: 'On gengshen, the first day of the third month.',
  },
  s1007: {
    literal: 'On renxu, edict: former Pinglu military governor, acting Grand Tutor, co–Grand Councillor, also Qingzhou prefect, Pillar, Duke of Langye with 2,500 households Wang Shifan as Mengzhou prefect, Heyang Three Cities Huai-Meng military governor and observer—on Quanzhong’s memorial.',
    idiomatic: 'On renxu Wang Shifan was shifted from Qingzhou to Mengzhou and Heyang command at Quanzhong’s request.',
  },
  s1008: {
    literal: 'On jiazi, edict: Special Advance, Right Vice Director, Vice Director, co–Grand Councillor, Supreme Ultimate Palace Minister, Hongwen Grand Academician, Extended Treasury commissioner, salt-and-iron transport commissioner, budget controller, Pillar, Duke of Hedong with 2,000 households Pei Shu may be acting Left Vice Director.',
    idiomatic: 'On jiazi Pei Shu was made acting Left Vice Director.',
  },
  s1009: {
    literal: 'Guanglu Grand Master, Vice Director, Households Minister, co–Grand Councillor, national history supervisor, Viscount of Henan with 500 households Dugu Sun may be acting Left Vice Director, co–Grand Councillor, also Protector-General of Annan, Jinghai military governor and Annan observer.',
    idiomatic: 'Dugu Sun was sent acting Left Vice Director and military governor of Jinghai and Annan.',
  },
  s1010: {
    literal: 'Guanglu Grand Master, Central Vice Director, co–Grand Councillor, Jixian Grand Academician, Pillar, Duke of Boling with 1,500 households Cui Yuan may be acting Right Vice Director.',
    idiomatic: 'Cui Yuan became acting Right Vice Director.',
  },
  s1011: {
    literal: 'Correct Opinion Grand Master, Central Vice Director, co–Grand Councillor, controller of household affairs, Pillar, Baron of Hedong with 300 households Liu Can as Vice Director, also Households Minister, co–Grand Councillor, Supreme Ultimate Palace Minister, Hongwen Grand Academician, Extended Treasury commissioner, salt-and-iron transport commissioner.',
    idiomatic: 'Liu Can took the full chancellorship bundle: Vice Director, Households Minister, Supreme Ultimate Palace, Hongwen, Extended Treasury, and salt-and-iron.',
  },
  s1012: {
    literal: 'Correct Opinion Grand Master, Personnel Vice Minister, Pillar, bearer of purple-gold fish Zhang Wenwei as Central Vice Director, co–Grand Councillor, national history supervisor, budget controller.',
    idiomatic: 'Zhang Wenwei joined the council as Central Vice Director with historiography and budget.',
  },
  s1013: {
    literal: 'Yinguanglu Grand Master, acting Left Assistant Director, Pillar, Baron of Hongnong with 700 households Yang She as Central Vice Director, co–Grand Councillor, Jixian Grand Academician, controller of household affairs.',
    idiomatic: 'Yang She became Central Vice Director with Jixian and household affairs.',
  },
  s1014: {
    literal: 'On gengwu, edict: “I consider that Grand Councillors and academicians, civil and military hundred officials, are often bound to office bureaus and vainly chase outings.',
    idiomatic: 'On gengwu an edict said ministers and officials were chained to their desks and deserved a spring break.',
  },
  s1015: {
    literal: 'Now moisture is not lacking and a rich year is hoped; at this fine season, favor should be shown.',
    idiomatic: 'Rain had been steady and harvest looked good—time to grant grace.',
  },
  s1016: {
    literal: 'From the twelfth of this month to the sixteenth, each may take leisure and choose scenic places to roam.',
    idiomatic: 'From the twelfth through the sixteenth all might roam as they pleased.',
  },
  s1017: {
    literal: 'Entrust the responsible offices.',
    idiomatic: 'So ordered.',
  },
  s1018: {
    literal: '” On renshen, acting Minister of Works, Prince of He tutor Zhang Tingfan was made Director of Rites.',
    idiomatic: 'On renshen Zhang Tingfan, Quanzhong’s man, was made Director of Rites.',
  },
  s1019: {
    literal: 'On dinghai, edict: “Hanlin academician, Households Vice Minister Yang Zhu is Chancellor Yang She’s younger brother; elder holding the pivot, younger therefore hard to dwell in the secretariat—may keep original office, cease inner duty.',
    idiomatic: 'On dinghai Yang Zhu left the Hanlin because his brother Yang She was chancellor.',
  },
  s1020: {
    literal: 'closing quotation mark',
    idiomatic: '(end of edict)',
  },
  s1021: {
    literal: 'On the first day of the fourth month, jichou.',
    idiomatic: 'On jichou, the first day of the fourth month.',
  },
  s1022: {
    literal: 'On renchen, edict: Henan prefectural Gou county magistrate should also serve as He Mausoleum terrace magistrate and be promoted to red county.',
    idiomatic: 'On renchen Gou county’s magistrate was also named He Mausoleum terrace magistrate and the county promoted to “red” rank.',
  },
  s1023: {
    literal: 'On guisi, edict said: “Civil and military are the two handles, the state’s great cord; eastern and western cohorts, offices share one body.',
    idiomatic: 'On guisi a major edict declared civil and military branches equal pillars of the state.',
  },
  s1024: {
    literal: 'Together they brace the sagely fortune, together array in the bright court; rank and grade face each other in high and low; salary and stipend are equal in thick and thin.',
    idiomatic: 'Both served the throne; ranks might differ but pay should not.',
  },
  s1025: {
    literal: 'Regardless of former ages, only examine this dynasty.',
    idiomatic: 'Forget antiquity—look only at Tang practice.',
  },
  s1026: {
    literal: 'Taizong used civil and military officials together; some from military guard to terrace and province, some from civil robes to hold banners and axes—clearly in martial arrays and civil rows he did not order clear and turbid, superior and inferior.',
    idiomatic: 'Taizong had soldiers sit in civil offices and scholars hold commands without ranking “rough” below “refined.”',
  },
  s1027: {
    literal: 'In recent times frivolity was honored, old statutes despised; falsely resting arms to cultivate letters, competing to abandon the root and chase the branch.',
    idiomatic: 'Lately men prized polish, mocked the old ways, pretended to civilize by disarming, and abandoned root for branch.',
  },
  s1028: {
    literal: 'Though blue robe and fish tally, one meeting permitted ascent to hall;',
    idiomatic: 'A blue-gowned clerk with a fish tally might enter the hall at once;',
  },
  s1029: {
    literal: 'even dragging purple and girding gold, if not their sort, not permitted to share a mat.',
    idiomatic: 'a purple-robed minister of the wrong sort could not share a seat.',
  },
  s1030: {
    literal: 'Thus glory and shame were displayed, heavy and light distinguished; suddenly hearts were lost and court body entirely destroyed.',
    idiomatic: 'So snobbery split the court and ruined its body.',
  },
  s1031: {
    literal: 'Reaching today, truly from this; must discuss reform, gradually expect universal benefit.',
    idiomatic: 'Today’s rot came from that—reform was needed for fairness.',
  },
  s1032: {
    literal: 'Civil and military hundred officials from first rank down, monthly stipend money all must be even; amount more or less, one pattern of disbursement.',
    idiomatic: 'From first rank down, monthly pay must be equal—same amount for all.',
  },
  s1033: {
    literal: 'Also commissioners to circuits follow rotation in turn; once fairness is reached, surely expect opening and peace.',
    idiomatic: 'Circuit commissions would rotate fairly too.',
  },
  s1034: {
    literal: 'All hundred subjects and commoners should embody my feeling.',
    idiomatic: 'Let every subject feel my intent.',
  },
  s1035: {
    literal: 'Prince of He tutor Zhang Tingfan was Quanzhong’s general and clerk; skilled in music law, he sought to be Director of Rites; Quanzhong recommended and used him.',
    idiomatic: 'Zhang Tingfan was Quanzhong’s officer, a music man pushed as Director of Rites.',
  },
  s1036: {
    literal: 'Grand Councillor Pei Shu considered Tingfan not a music director’s talent; Quanzhong was angry and removed Shu from the council.',
    idiomatic: 'Pei Shu said he was no musician; Quanzhong stripped Shu of office.',
  },
  s1037: {
    literal: 'Liu Can curried favor and again lowered this edict to rebuke Shu’s sort; hence the Baima calamity.',
    idiomatic: 'Liu Can flattered Quanzhong with this edict attacking Shu’s faction—foreshadowing the Baima slaughter.',
  },
  s1038: {
    literal: 'On bingwu, former Bian prefectural governor Liu Renyu acting Minister of Works, also Yanzhou prefect, Censor Grand Master, Taining military governor.',
    idiomatic: 'On bingwu Liu Renyu, former Bin governor, became Taining military governor at Yanzhou.',
  },
  s1039: {
    literal: 'On yiwei, edict: Left Vice Director Pei Shu, newly appointed Jinghai military governor Dugu Sun, Henan governor Zhang Quanyi, Minister of Works Wang Pu, retired Minister of Works Pei Zan, Minister of Justice Zhang Yi—all granted one son eighth-rank regular office for mausoleum labor.',
    idiomatic: 'On yiwei tomb laborers Pei Shu, Dugu Sun, Zhang Quanyi, Wang Pu, Pei Zan, and Zhang Yi each won an eighth-rank post for a son.',
  },
  s1040: {
    literal: 'Edict said: “I consider winter wheat not yet risen, yang long drought, fearing lack of sacrificial grain, deeply felt in my night vigil.',
    idiomatic: 'An edict cited drought threatening the harvest and the emperor’s sleepless worry.',
  },
  s1041: {
    literal: 'Fitting to avoid the correct seat in the imperial dwelling, reduce delicacies in regular meals; surely my slight substance deeply fits self-blame.',
    idiomatic: 'He would leave the main hall and cut his meals in penance.',
  },
  s1042: {
    literal: 'From the eighth of this month afterward, not hold court in the main hall, reduce regular meals.',
    idiomatic: 'From the eighth he would not sit the main hall and would eat sparingly.',
  },
  s1043: {
    literal: 'Entrust the responsible offices.',
    idiomatic: 'So ordered.',
  },
  s1044: {
    literal: '” On xinchou, attendant censor Li Guangting and Xi Yinxiang, palace director Zhang Sheng and Cui Zhaoju, attendance recorder Lu Renjiong, Lu Ding, Su Kai, Personnel aide Cui Xie, Left Remonstrator Cui Xianxiu, Right Remonstrator Du Chengzhao and Luo Chong, Right Reminder Wei Yan and Lu Deyan—all should be granted crimson fish bags;',
    idiomatic: 'On xinchou a long list of censors and remonstrators received crimson fish bags for tomb service;',
  },
  s1045: {
    literal: 'War Director Wei Qianmei and Comparison Director Yang Huan, both granted purple-gold fish bags: all for mausoleum labor.',
    idiomatic: 'Wei Qianmei and Yang Huan received purple-gold bags for the same reason.',
  },
  s1046: {
    literal: 'On renyin, edict: “I have received the great design, look up to follow the compassionate instruction, revere the lofty title, already fixed ritual; hope to extend a son’s heart, to display serving-the-parent respect.',
    idiomatic: 'On renyin an edict spoke of honoring the Empress Dowager and the planned investiture.',
  },
  s1047: {
    literal: 'Yesterday the offices fixed the twenty-fifth of this month for Empress Dowager investiture rites.',
    idiomatic: 'Investiture was set for the twenty-fifth.',
  },
  s1048: {
    literal: 'Again following the compassionate order: because palace halls have not stopped work and steam heat does not wish to weary people, auspicious day should be changed—solidly hard to disobey the command.',
    idiomatic: 'The dowager deferred it—palace work unfinished, summer heat—so the date must move.',
  },
  s1049: {
    literal: 'Investiture rites wait until inner palace work is finished; offices report when ready.',
    idiomatic: 'Investiture would follow completion of the inner palace.',
  },
  s1050: {
    literal: '” On guimao, Supreme Ultimate Palace Minister Liu Can memorialized Upper Pure Palace repair finished; request change to Supreme Ultimate Palace—approved.',
    idiomatic: 'On guimao Liu Can reported the Upper Pure Palace repaired and renamed Supreme Ultimate.',
  },
  s1051: {
    literal: 'On jiachen night, comet rose in North River, pierced Wenchang, length three zhang, in the northwest.',
    idiomatic: 'On jiachen night a comet three zhang long rose in the northwest through Wenchang.',
  },
  s1052: {
    literal: 'On dingwei, edict: “Setting offices and dividing duties, each has its keeper; evaluation already rests with the Personnel Bureau—appointment should not trouble Grand Councillors.',
    idiomatic: 'On dingwei an edict stripped the council of routine appointments.',
  },
  s1053: {
    literal: 'But when responsible offices note and propose reaching the center, the Secretariat passes verification and measure; if there is error, hard to fix entirely.',
    idiomatic: 'The Secretariat would only verify Personnel Bureau lists.',
  },
  s1054: {
    literal: 'In recent years appointments were truly numerous, occupying the Selection Department’s vacant posts, choosing public suitability’s advantages—thus when the three selection bureaus note and propose, all neglect duty.',
    idiomatic: 'Lately councilors had hoarded appointments and left the three selection bureaus idle.',
  },
  s1055: {
    literal: 'Moreover the Grand Councillor’s task lifts the hundred offices; only if fair and selfless does it gradually reach the Way.',
    idiomatic: 'Chancellors should govern, not micromanage every post.',
  },
  s1056: {
    literal: 'All under heaven prefectural magistrates and assistants are entrusted to the Personnel Bureau’s three selections to note and propose.',
    idiomatic: 'All county magistrates and aides would be appointed solely by Personnel.',
  },
  s1057: {
    literal: 'From Tianyou year 2 fourth month eleventh day afterward, the Secretariat altogether does not appoint; if memorial recommendations remain by measure, then judge whether to implement.',
    idiomatic: 'From the eleventh of the fourth month, Tianyou 2, the Secretariat ceased appointments except on review.',
  },
  s1058: {
    literal: 'So each office keeps its bureau, avoiding disorder; Grand Councillor holds the cord, forever preserving the body of affairs.',
    idiomatic: 'Each office would keep its lane; chancellors would hold the cord only.',
  },
  s1059: {
    literal: 'Entrust the responsible offices.',
    idiomatic: 'So ordered.',
  },
  s1060: {
    literal: 'On xinhai, because comet and broom star appeared, benevolent edict released capital-region armies, garrisons, and offices’ imprisoned persons; outside those not pardoned by regular amnesty, crimes regardless of light or heavy reduced one grade; within three days memorialize after review.',
    idiomatic: 'On xinhai a comet prompted amnesty in the capital, most crimes reduced one grade.',
  },
  s1061: {
    literal: 'On renzi, edict: “I am young, inheriting the great foundation, diligent and respectful, evening watchful.',
    idiomatic: 'On renzi the boy emperor blamed himself for the comet.',
  },
  s1062: {
    literal: 'Comet and reproach star appeared; guilt lies in my person.',
    idiomatic: 'Heaven’s warning was his fault.',
  },
  s1063: {
    literal: 'Though already lowering amnesty text, specially exercising grace; from the twenty-fourth of this month afterward, avoid the main hall, reduce regular meals, to clarify thinking on faults.',
    idiomatic: 'Despite amnesty he would avoid the main hall and cut meals from the twenty-fourth.',
  },
  s1064: {
    literal: 'Entrust the responsible offices.',
    idiomatic: 'So ordered.',
  },
  s1065: {
    literal: '” On bingchen, edict: “Per former precedent, each string cash besides deductions uses 850 wen as a string; each mo 85 wen.',
    idiomatic: 'On bingchen coinage was fixed at eight hundred fifty wen per string and eighty-five per mo.',
  },
  s1066: {
    literal: 'As heard, in markets many use eighty as mo, with further deductions—suddenly contrary to old rule.',
    idiomatic: 'Markets had slipped to eighty per mo.',
  },
  s1067: {
    literal: 'Entrust Henan prefecture: market trade all use eighty-five wen as mo, may not further change.',
    idiomatic: 'Henan was ordered to enforce eighty-five.',
  },
  s1068: {
    literal: '” On wuwu, edict: “Eastern Ascending Gate, Western Ascending Gate—in normal exit, eastern is first.',
    idiomatic: 'On wuwu gate protocol was corrected.',
  },
  s1069: {
    literal: 'Great taboo presenting names then Western Ascending Gate is convenient.',
    idiomatic: 'Mourning audiences used the western gate.',
  },
  s1070: {
    literal: 'Recently because eunuchs usurped power, they took yin-yang for position, not thinking of facing south but opening the western gate.',
    idiomatic: 'Eunuchs had favored the west for superstition, not south.',
  },
  s1071: {
    literal: 'Lately inherited without discussing change; detailed their titles, seems contrary to old rule.',
    idiomatic: 'The custom had lingered wrongly.',
  },
  s1072: {
    literal: 'From the first day of the fifth month this year afterward, regular court exit takes Eastern Ascending Gate; if meeting condolence, then open Western Ascending Gate—forever as fixed rule.',
    idiomatic: 'From May first regular court would use the east gate; condolence, the west.',
  },
  s1073: {
    literal: 'Entrust the responsible offices.',
    idiomatic: 'So ordered.',
  },
  s1074: {
    literal: '” Also edict: “I because heaven’s reproach appeared, avoid hall and blame self, should not hold first-of-month assembly at the main hall.',
    idiomatic: 'May Day court at the main hall was canceled for the comet.',
  },
  s1075: {
    literal: 'The fifth month first day court assembly should be temporarily stopped.',
    idiomatic: 'The May first levee was suspended.',
  },
  s1076: {
    literal: 'closing quotation mark',
    idiomatic: '(end of edict)',
  },
  s1077: {
    literal: 'On the first day of the fifth month, jiwei; because of star change did not hold court.',
    idiomatic: 'On jiwei, fifth month’s first day, no court for the omen.',
  },
  s1078: {
    literal: 'Edict said: “Astronomical change appeared, fitting matter is prayer; should set Yellow Register ritual ground at Supreme Ultimate Palace, three departments supply vegetarian materials.',
    idiomatic: 'A Yellow Register Daoist rite was ordered at the Supreme Ultimate Palace.',
  },
  s1079: {
    literal: '” On renxu, edict: “When the imperial carriage moved the capital, at Luoyang’s rebuilding beginning, fearing attachment to soil like Xinfeng, temporarily changed names to alter old system.',
    idiomatic: 'On renxu an edict renamed Luoyang gates after omens, citing fear of homesickness like the Han at Xinfeng.',
  },
  s1080: {
    literal: 'The baleful star already came from Yong’s division; high gates hard to imitate Qin’s remainder—old gate names should be changed to strengthen divined years’ endurance.',
    idiomatic: 'A comet in Yong’s quarter prompted auspicious new gate names.',
  },
  s1081: {
    literal: 'Yanxi Gate changed to Xuanren Gate, Chongming to Xingjiao, Changle to Guangzheng, Guangfan to Yingtian, Qianhua to Qianyuan, Xuanzheng to Fuzheng, Xuanzheng Hall to Zhenguan Hall, Rihua to Left Yanfu, Yuehua to Right Yanfu, Wanshou to Wanchun, Jiqing to Xingshan, Hanzhang to Yingfu, Hanqing to Yanyi, Jinluan to Qianqiu, Yanhe to Zhangshan, Baoning Hall to Wensi Hall.',
    idiomatic: 'A long list renamed gates and halls—Yanxi to Xuanren, Changle to Guangzheng, and so on.',
  },
  s1082: {
    literal: 'Existing gate names that share names with western capital gates should all restore old Luoyang gate names.',
    idiomatic: 'Gates that duplicated Chang’an names reverted to old Luoyang labels.',
  },
  s1083: {
    literal: 'Entrust the responsible offices.',
    idiomatic: 'So ordered.',
  },
  s1084: {
    literal: '” On yiyou night, northwest comet length six or seven tens of zhang, from Xuanyuan, Great Horn, and Heavenly Market’s western wall, light fierce and angry, length reaching heaven.',
    idiomatic: 'On yiyou night a comet sixty or seventy zhang long blazed from the northwest across Xuanyuan and the Market wall.',
  },
  s1085: {
    literal: 'On bingyin, responsible offices finished repairing the Empress Dowager’s palace.',
    idiomatic: 'On bingyin the Empress Dowager’s palace was finished.',
  },
  s1086: {
    literal: 'Secretariat memorialized: “The Empress Dowager’s compassion oversees people,lenient benevolence governs affairs; early matched heaven’s leaning omen, fully displayed holy birth’s sign.',
    idiomatic: 'The Secretariat praised her mercy and asked to name her palace Accumulated Goodness.',
  },
  s1087: {
    literal: 'Now the revolving splendor of the new palace, model old canon; Chongxun already proved in faithful history, Accumulated Goodness should shine in flourishing period.',
    idiomatic: 'The new palace followed old canon; Accumulated Goodness fit a flourishing age.',
  },
  s1088: {
    literal: 'The Empress Dowager’s palace requests the name Accumulated Goodness.',
    idiomatic: 'They proposed the name Accumulated Goodness for her palace.',
  },
  s1089: {
    literal: '” Approved.',
    idiomatic: 'Approved.',
  },
  s1090: {
    literal: 'Also because suburban sacrifice will be divined, beforehand tune elegant music; Director of Rites Zhang Tingfan should be music-frame repair commissioner.',
    idiomatic: 'With suburban rites coming, Zhang Tingfan was named to repair the ritual music frames.',
  },
  s1091: {
    literal: 'On dingmao, Jingxiang military governor Zhao Kuangning memorialized to establish a shrine for the late commissioner Cheng Yun—approved.',
    idiomatic: 'On dingmao Zhao Kuangning won approval to build a shrine for Cheng Yun.',
  },
  s1092: {
    literal: 'On jisi, Supreme Ultimate Palace Minister Liu Can memorialized: “Recent edict changed palace and gate names; I consider the Primordial Lord’s temple—in western capital called Supreme Ultimate Palace, eastern capital called Taiwei Palace—the Supreme Ultimate Palace requests restore to Taiwei Palace; your servant then gives entering-office rank.',
    idiomatic: 'On jisi Liu Can asked to rename the Supreme Ultimate Palace Taiwei again and trade rank for it.',
  },
  s1093: {
    literal: '” Approved.',
    idiomatic: 'Approved.',
  },
  s1094: {
    literal: 'On gengwu, edict: “Offices fixed this year tenth month ninth day for suburban mound; ritual garments and sacrificial robes should have Grand Councillor Liu Can judge; sacrificial vessels Zhang Wenwei and Yang She divide; ritual guards and chariots Director of Rites Zhang Tingfan judge.',
    idiomatic: 'On gengwu suburban rites were set for the ninth of the tenth month with Liu Can, Zhang Wenwei, Yang She, and Zhang Tingfan dividing duties.',
  },
  s1095: {
    literal: '” On renshen, edict: newly appointed Jinghai military governor, Yinguanglu Grand Master, acting Left Vice Director, co–Grand Councillor, also Protector-General of Annan, Marquis of Henan with 1,000 households Dugu Sun may be demoted to Court Gentleman for Scattered Honors, Bian prefectural governor, still ordered Censorate dispatch out of capital and memorialize when finished.',
    idiomatic: 'On renshen Dugu Sun, sent to Jinghai, was demoted to Bian prefect and ordered out of the capital.',
  },
  s1096: {
    literal: 'Edict said: “I wrongly place slight substance, presumptuously bear great design, always cherish steering rotten wood, every bend weeping guilt.',
    idiomatic: 'An edict feigned reluctance to punish ministers.',
  },
  s1097: {
    literal: 'Considering demotion and blame, how easy to implement.',
    idiomatic: 'Punishment was never easy, it said.',
  },
  s1098: {
    literal: 'Left Vice Director Pei Shu, Right Vice Director Cui Yuan—though removed from the pivot, still occupy the chief path; already in exalted duty, not yet harming advance-retreat rule.',
    idiomatic: 'Yet Pei Shu and Cui Yuan, though off the pivot, still walked the chief corridor.',
  },
  s1099: {
    literal: 'Unable to hold will and settle home, only indulge spreading slander harming the state; quite arousing public opinion, hard to suppress court statute.',
    idiomatic: 'They would not be silent—they slandered the state and had to go.',
  },
  s1100: {
    literal: 'Must leave the eight seats’ glory, still entrusted with six-tiao government; strive to blame self, do not reach to blame others.',
    idiomatic: 'They must leave the council but would receive prefectures—blame yourselves, not others.”',
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
if (data.metadata.chapter !== '020') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 020; standalone T ready (${Object.keys(T).length} entries).`
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
