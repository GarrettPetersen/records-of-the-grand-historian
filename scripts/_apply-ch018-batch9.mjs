#!/usr/bin/env node
/** Batch 9: s0801–s0900 (Jiutangshu ch.018, Wenzong 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/018.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 801;
const END = 900;

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
  s0801: {
    literal: 'Seventh month, wuwu: former Shannan West military commissioner Gao Yuanyu was made Minister of Personnel.',
    idiomatic: 'On wuwu Gao Yuanyu took Personnel.',
  },
  s0802: {
    literal: 'Eighth month, wuzi: Palace Companion, Secretariat Drafter, Hanlin academician, Pillar of State, Baron of Pingyin with three hundred household fief and purple-gold fish Bi Kan was made Vice Minister of Punishments.',
    idiomatic: 'On wuzi Bi Kan became Vice Minister of Punishments.',
  },
  s0803: {
    literal: 'Ninth month, an edict: "Of late wicked men have cast anonymous documents in the markets, or on arrows or banners spread slander to disturb state law.',
    idiomatic: 'An edict banned anonymous slander in markets, on arrows, and on banners.',
  },
  s0804: {
    literal: 'Henceforth authorities must seize such cases strictly; when obtained, burn and bury them at once — do not report upward."',
    idiomatic: 'Seized materials were to be burned without report to the throne.',
  },
  s0805: {
    literal: 'The edict closed with the closing bracket.',
    idiomatic: 'Thus ended the edict.',
  },
  s0806: {
    literal: 'Eleventh month: Vice Minister of War and acting revenue commissioner Wei Fu memorialized: "Money, grain, and registers of all prefectures should be entrusted to the registrar for sole judgment, still jointly checked with the chief administrator; at handover list numbers and memorialize."',
    idiomatic: 'Wei Fu ordered prefectural registers to be kept by registrars with joint review at handover.',
  },
  s0807: {
    literal: 'If no outstanding shortage, reduce selection points proportionally."',
    idiomatic: 'Clean accounts could earn reduced rotation points.',
  },
  s0808: {
    literal: '" An edict: "The old text of the Veritable Record of Xianzong edited by Lu Sui and others — restore and implement.',
    idiomatic: 'An edict restored Lu Sui\'s Xianzong Veritable Record and recalled Huichang revisions.',
  },
  s0809: {
    literal: 'The Huichang newly revised version — all are to be submitted.',
    idiomatic: 'Huichang revisions had to be surrendered.',
  },
  s0810: {
    literal: 'If copies are found, on receipt of the edict submit them to the History Office; none may be kept — commission prefectures to search strictly."',
    idiomatic: 'Copy-holders had to surrender texts to the History Office under search.',
  },
  s0811: {
    literal: '" Vice Minister of Revenue and acting finance commissioner Cui Guicong was Grand Councillor at his present rank.',
    idiomatic: 'Cui Guicong joined the Grand Council.',
  },
  s0812: {
    literal: 'Silver-glitter Grand Master of Splendid Happiness, Vice Director of the Secretariat, concurrent Minister of Rites, Grand Councillor Wei Cong was made Heir-apparent Mentor and assigned to the eastern capital.',
    idiomatic: 'Wei Cong went to Luoyang as heir-apparent mentor.',
  },
  s0813: {
    literal: 'Dazhong 3, spring, first month, bingyin: Jingyuan military commissioner Kang Jirong memorialized that the Tibetan minister Lun Kongre brought the troops and people of Qin, Yuan, Anle, and the seven passes including Shimen to submit to the state.',
    idiomatic: 'In Dazhong 3\'s first month Kang Jirong reported Tibetans returning Qin, Yuan, and seven passes.',
  },
  s0814: {
    literal: 'An edict ordered Grand Master of the Stud Lu Dan to convey the imperial will; still order Lingwu commissioner Zhu Shuming and Binning commissioner Zhang Junxu each to dispatch troops of their circuits to receive them.',
    idiomatic: 'Lu Dan was sent to welcome the returnees while Zhu Shuming and Zhang Junxu provided escort troops.',
  },
  s0815: {
    literal: 'Acting Grand Master of Ceremonies Feng Ao was made acting Minister of War, Xingyuan prefect, and Shannan West military commissioner.',
    idiomatic: 'Feng Ao took Xingyuan and Shannan West.',
  },
  s0816: {
    literal: 'Third month, yimao: edict — awaiting-audience officials should take turns remonstrating after penal-law officials and remonstrance officials.',
    idiomatic: 'On yimao awaiting-audience officials were ordered into the remonstrance rotation.',
  },
  s0817: {
    literal: 'Silver-glitter Grand Master, Vice Director of the Secretariat, Grand Councillor, dynastic historian, Pillar of State, Viscount of Runan with five hundred households Zhou Chi was made acting Vice Minister of Punishments, Zizhou prefect, and Sword South East Chuan military commissioner.',
    idiomatic: 'Zhou Chi was sent to Sword South East Chuan.',
  },
  s0818: {
    literal: 'Fourth month: Regular Grand Master, acting Vice Director of the Secretariat, Grand Councillor, Hall of Assembled Worthies academician with purple-gold fish Ma Zhi was made heir-apparent Guest of Honor at the eastern capital;',
    idiomatic: 'Ma Zhi became heir-apparent guest at Luoyang;',
  },
  s0819: {
    literal: 'Regular Grand Master, acting Censor-in-Chief, Pillar of State, Viscount of Boling with five hundred households and purple-gold fish Cui Xuan was made Vice Director of the Secretariat and Grand Councillor;',
    idiomatic: 'Cui Xuan joined the council;',
  },
  s0820: {
    literal: 'Regular Grand Master, acting Vice Minister of War and revenue commissioner, Pillar of State, Baron of Julu with five hundred households and purple-gold fish Wei Fu was Grand Councillor at his present rank.',
    idiomatic: 'Wei Fu also joined the Grand Council.',
  },
  s0821: {
    literal: 'Fifth month: Youzhou military commissioner, acting Minister of Works, Grand Councillor Zhang Zhongwu died; the three armies made his son Zhifang know regent affairs.',
    idiomatic: 'Zhang Zhongwu died; his son Zhifang became Youzhou regent.',
  },
  s0822: {
    literal: 'Sixth month, guiwei: five-colored clouds appeared in the capital.',
    idiomatic: 'Five-colored clouds appeared over the capital on guiwei.',
  },
  s0823: {
    literal: 'Edict: those previously exiled who died in exile — if the case was not wicked rebellion, they may petition the Ministry of Punishments and be permitted burial; in very distant places still grant coffins according to circumstances.',
    idiomatic: 'Exiles not guilty of treason might be repatriated for burial.',
  },
  s0824: {
    literal: 'Kang Jirong memorialized recovery of Yuan prefecture and the six passes Shimen, Yizang, Muxia, Zhisheng, Liupan, and Shixia completed.',
    idiomatic: 'Kang Jirong reported six frontier passes recovered.',
  },
  s0825: {
    literal: 'Binning\'s Zhang Junxu memorialized that on the thirteenth of this month Xia Pass was recovered.',
    idiomatic: 'Zhang Junxu reported Xia Pass recovered.',
  },
  s0826: {
    literal: 'The Censorate memorialized: Yicheng military commissioner Wei Rang built nine houses encroaching on the street at Huaizhen Ward — already ordered demolished.',
    idiomatic: 'Wei Rang\'s illegal houses at Huaizhen were torn down.',
  },
  s0827: {
    literal: 'Edict: establish Wu prefecture at Xia Pass; change Changle to Wei prefecture.',
    idiomatic: 'Wu prefecture was founded at Xia Pass; Changle became Wei.',
  },
  s0828: {
    literal: 'Seventh month: troops and people of the three prefectures and seven passes — all remnant folk of He and Long — several thousand appeared below the palace.',
    idiomatic: 'Thousands of Hexi refugees presented themselves at court.',
  },
  s0829: {
    literal: 'The Emperor went to Yanxi Gate to comfort them, ordered them to undo their braids, granted caps and belts, and altogether gave one hundred fifty thousand bolts of silk.',
    idiomatic: 'Xuanzong welcomed them at Yanxi Gate, gave Chinese dress, and granted one hundred fifty thousand bolts of silk.',
  },
  s0830: {
    literal: 'Eighth month: Fengxiang military commissioner Li Pin memorialized recovery of Qin prefecture; rescript:',
    idiomatic: 'Li Pin reported Qin recovered; a rescript followed.',
  },
  s0831: {
    literal: 'Ninth month, xinhai: West Chuan military commissioner Du Xian memorialized recovery of Wei prefecture.',
    idiomatic: 'On xinhai Du Xian reported Wei prefecture recovered.',
  },
  s0832: {
    literal: 'Rescript:',
    idiomatic: 'A rescript followed.',
  },
  s0833: {
    literal: 'Palace Attendant Yu Daowei and Rites Bureau outer-section member Li Wenru were both made Hanlin academicians.',
    idiomatic: 'Yu Daowei and Li Wenru entered the Hanlin.',
  },
  s0834: {
    literal: 'Tenth month, xinsi: the capital earthquake — Hexi, Tiande, and Ling-Xia especially severe; garrison soldiers crushed to death numbered several thousand.',
    idiomatic: 'A capital earthquake killed thousands in northwest garrisons.',
  },
  s0835: {
    literal: 'Eleventh month: East Chuan commissioner Zheng Ya and Fengxiang commissioner Li Pin memorialized repair of the Wenchuan Valley road — eleven post stations from Lingquan to Baiyun — an edict praised them.',
    idiomatic: 'Zheng Ya and Li Pin won praise for eleven new post stations on the Wenchuan road.',
  },
  s0836: {
    literal: 'After a year rain destroyed it; Feng Ao was again ordered to repair the old Xiegu road.',
    idiomatic: 'Rain wrecked the new road; Feng Ao rebuilt Xiegu.',
  },
  s0837: {
    literal: 'Vice Minister of Punishments Wei Youyi was made Censor-in-Chief; Bureau of Appointments outer-section member Zheng Chuhui was concurrent chief investigating censor.',
    idiomatic: 'Wei Youyi became censor-in-chief; Zheng Chuhui took investigating duties.',
  },
  s0838: {
    literal: 'Youzhou army mutinied, expelled regent Zhang Zhifang; soldiers made yamen officer Zhou Lin regent.',
    idiomatic: 'Youzhou mutinied and made Zhou Lin regent over Zhang Zhifang.',
  },
  s0839: {
    literal: 'Twelfth month: posthumous titles — Shunzong as Great Sage of Perfect Virtue, Great Peace, and Filial Piety; Xianzong as Luminous Literary, Martial, Great Sage, and Filial Piety.',
    idiomatic: 'Shunzong and Xianzong received enlarged posthumous titles.',
  },
  s0840: {
    literal: 'Earlier, because He and Huang were recovered, the hundred offices asked to add honorific titles; the Emperor said: "He and Huang recovered continue the former plan — We wish to exalt ancestors to display merit."',
    idiomatic: 'When Hexi returned the court sought a reign title; Xuanzong preferred honoring ancestors.',
  },
  s0841: {
    literal: '" Bai Minzhong and others replied: "This is beyond your servant\'s dull wit."',
    idiomatic: 'Bai Minzhong demurred.',
  },
  s0842: {
    literal: 'At this time the Emperor performed the rites at Xuanzheng Hall; when the document came out he leaned from the tower watching it depart, weeping and sobbing.',
    idiomatic: 'At the enshrinement rite Xuanzong wept from Xuanzheng Tower.',
  },
  s0843: {
    literal: 'Yazhou registrar Li Deyu died in exile.',
    idiomatic: 'Li Deyu died in exile at Yazhou.',
  },
  s0844: {
    literal: 'Dazhong 4, spring, first month: because of exalting the two sages, the Emperor held court in the main hall and proclaimed a great amnesty: "Exiles comparable to Tiande — ten years as the limit; now meeting great grace, reduce three years in general.',
    idiomatic: 'Dazhong 4 opened with a great amnesty cutting Tiande exiles\' terms.',
  },
  s0845: {
    literal: 'Only rotate replacements so the border lacks no men; release in sequence without popular bitterness.',
    idiomatic: 'Border rotations were to spare manpower and bitterness.',
  },
  s0846: {
    literal: 'For Qin, Yuan, Wei, Wu prefectures and passes — prior standard exiles — also set limits up to seven years; if they wish to remain, permit it.',
    idiomatic: 'Hexi exiles could serve seven-year terms or stay.',
  },
  s0847: {
    literal: 'When prefectural officials request craft leave under one month, temporarily assign various bureau acting judges;',
    idiomatic: 'Short craft leave could be covered by acting judges;',
  },
  s0848: {
    literal: 'over one month follow the usual acting rule; deduct two hundred cash per string of salary for allowance and add to the acting case officer.',
    idiomatic: 'Longer leave deducted salary strings for acting officers.',
  },
  s0849: {
    literal: 'Intentional homicide — though wounded not dead, or dead then revived, intent to injure yet chance escape — all treated under the completed homicide article.',
    idiomatic: 'Attempted murder with lethal intent was punished as completed homicide.',
  },
  s0850: {
    literal: 'The edict closed with the closing bracket.',
    idiomatic: 'Thus ended the amnesty.',
  },
  s0851: {
    literal: 'Second month: Princess Wanshou married Right Reminder Zheng Hao; Hao was made Silver-glitter Grand Master, acting Palace Attendant, and Commandant-consort.',
    idiomatic: 'Princess Wanshou married Zheng Hao, now commandant-consort.',
  },
  s0852: {
    literal: 'Third month, jimao: Punishments memorialized: "Supervisors who privately lend state goods or borrow in others\' names, or substitute private goods for state intake — specialist clerks and foremen guilty of graft are the same as embezzlement, outside general amnesty."',
    idiomatic: 'On jimao lending state goods for profit was excluded from amnesty.',
  },
  s0853: {
    literal: '" Assented.',
    idiomatic: 'Assented.',
  },
  s0854: {
    literal: 'Youzhou vice commissioner and acting Minister of Works Zhang Zhifang was made Left Gold Crow guard general.',
    idiomatic: 'Zhang Zhifang was recalled to the Left Gold Crow guard.',
  },
  s0855: {
    literal: 'Fourth month, edict: "When law offices apply punishment, some hold crafty fraud, split statutes at two ends, and thus complete guilt.',
    idiomatic: 'An edict forbade legal pettifoggery.',
  },
  s0856: {
    literal: 'Once wicked clerks gain their scheme, how can the common folk be secure?',
    idiomatic: 'The edict warned that trickery harmed the people.',
  },
  s0857: {
    literal: 'Henceforth when writing guilt and fixing punishment, point straight at the matter — no florid citations or false references."',
    idiomatic: 'Judgments had to name the concrete offense.',
  },
  s0858: {
    literal: '" Punishments again memorialized: "Per this year\'s first-month edict section and the twenty-sixth-day third-month edict — theft reaching one string cash is death — commission offices to review articles and memorialize."',
    idiomatic: 'Punishments asked to revisit the one-string theft rule.',
  },
  s0859: {
    literal: 'Your servants checked and request following the twenty-fourth-day third-month edict: theft of three bolts or more — execution; if value insufficient, apply proportional release."',
    idiomatic: 'They proposed death only for theft of three bolts or more.',
  },
  s0860: {
    literal: '" Assented.',
    idiomatic: 'Assented.',
  },
  s0861: {
    literal: 'Seventh month, bingzi: Court of Judicial Review director Liu Meng memorialized: "Antiquity hung the law to show people, wishing them follow goodness and shun crime until none offend and punishments rest unused."',
    idiomatic: 'Liu Meng urged engraved law codes for clerks.',
  },
  s0862: {
    literal: '"Per Vice Minister of Punishments Gao Xi\'s twenty-sixth-day tenth-month articles — eleven verified items — sent to prefectures to paint on registrar mess halls; each memorialized offender must follow those items."',
    idiomatic: 'Gao Xi\'s eleven articles were to be posted in mess halls.',
  },
  s0863: {
    literal: 'Years lengthen, writing sinks away; prefectures in trials often miss items.',
    idiomatic: 'Posted laws had faded from use.',
  },
  s0864: {
    literal: 'Hereafter send to all circuits orders to carve stone at assembly places so officials rising and sitting may view and remember — hoping dossiers will be thorough."',
    idiomatic: 'Liu Meng ordered the articles carved on stone at assembly halls.',
  },
  s0865: {
    literal: '" Assented.',
    idiomatic: 'Assented.',
  },
  s0866: {
    literal: 'Eighth month: Vice Minister of Punishments and Censor-in-Chief Wei Zhan memorialized: "When commoners of circuits sue at the tower, censors are often sent to investigate — your servant fears troubling prefectures; first request finance, revenue, and salt commissioners bearing censor titles investigate."',
    idiomatic: 'Wei Zhan wanted finance and salt commissioners to hear common suits.',
  },
  s0867: {
    literal: 'Each Three-Office commissioner stated office staff are few, usually devoted to office business — performance duties unmet.',
    idiomatic: 'Commissioners said their staffs were already overloaded.',
  },
  s0868: {
    literal: 'Now observation commissioners\' staffs have no fewer than five or six judges — request those bearing censor titles be entrusted to investigate.',
    idiomatic: 'He proposed using observation judges with censor titles instead.',
  },
  s0869: {
    literal: 'If through repeated investigation they clear wrongs, when the Censorate lacks officers memorialize them for appointment."',
    idiomatic: 'Successful investigators could be promoted into the Censorate.',
  },
  s0870: {
    literal: '" Assented.',
    idiomatic: 'Assented.',
  },
  s0871: {
    literal: 'Ninth month: Regular Grand Master, acting Minister of Rites, Mengzhou prefect, Heyang Three Cities military commissioner Li Shi was made Taiyuan prefect, northern capital regent, and Hedong military commissioner.',
    idiomatic: 'Li Shi took Taiyuan and Hedong.',
  },
  s0872: {
    literal: 'Youzhou commissioner Zhou Lin died; soldiers made yamen officer Zhang Yunshen regent.',
    idiomatic: 'Zhou Lin died; Zhang Yunshen became Youzhou regent.',
  },
  s0873: {
    literal: 'Tenth month: Vice Director of the Secretariat and Grand Councillor Wei Fu ceased knowing administrative affairs.',
    idiomatic: 'Wei Fu left the council.',
  },
  s0874: {
    literal: 'Eleventh month, jihai, edict: "Recovery of Cheng, Wei, and Fu prefectures — establishment fixed, regulations and arrangements all uniform."',
    idiomatic: 'An edict unified rules for recovered Cheng, Wei, and Fu.',
  },
  s0875: {
    literal: 'Exiles already assigned there should follow Qin, Yuan, Wei, and Wu exile precedent — release after seven years."',
    idiomatic: 'Exiles in the new prefectures could return after seven years.',
  },
  s0876: {
    literal: '" Vice Minister of Revenue and acting head of the ministry Linghu Tao was made Vice Minister of War and Grand Councillor.',
    idiomatic: 'Linghu Tao joined the council.',
  },
  s0877: {
    literal: 'Twelfth month: Huazhou prefect Zhou Jingfu was made Grand Master for Splendid Happiness, acting Left Cavalier Attendant-in-Ordinary, concurrent Hongzhou prefect and Jiangxi West circuit training-and-observation commissioner, granted gold-purple.',
    idiomatic: 'Zhou Jingfu took Jiangxi West with gold-purple.',
  },
  s0878: {
    literal: 'Dazhong 5, spring, first month, jiaxu: invested the seventh son Zhi as Prince of Huai, eighth son Rui as Prince of Zhao, ninth son Wen as Prince of Kang.',
    idiomatic: 'Three princes were enfeoffed on jiaxu.',
  },
  s0879: {
    literal: 'Edict both capitals and all prefectures: from Dazhong 5 first month for three years cattle may not be slaughtered.',
    idiomatic: 'A three-year cattle-slaughter ban began in Dazhong 5.',
  },
  s0880: {
    literal: 'Where suburban and temple sacrifice requires it, substitute other livestock.',
    idiomatic: 'Sacrifices were to use other animals.',
  },
  s0881: {
    literal: 'Second month: Vice Minister of Revenue Pei Xiu was made salt and transport commissioner for all circuits.',
    idiomatic: 'Pei Xiu took the salt monopoly.',
  },
  s0882: {
    literal: 'Fourth month, guimao: Vice Minister of Punishments Liu Zuan memorialized: before this year\'s fourth-month thirteenth, two hundred twenty-four years, miscellaneous edicts six hundred forty-six categories, two thousand one hundred sixty-five articles — weighing severity, titled Comprehensive Categories of Dazhong Penal Law — desired to implement.',
    idiomatic: 'Liu Zuan submitted the Comprehensive Categories of Dazhong Penal Law.',
  },
  s0883: {
    literal: 'Fifth month: Taiyuan prefect and Hedong commissioner Li Shi was made Fengxiang commissioner;',
    idiomatic: 'Li Shi went to Fengxiang;',
  },
  s0884: {
    literal: 'Li Ye was acting Minister of Revenue, Taiyuan prefect, northern capital regent, and Hedong commissioner;',
    idiomatic: 'Li Ye took Hedong;',
  },
  s0885: {
    literal: 'acting Minister of Works, Vice Director, Baron of Taiyuan with one thousand households Bai Minzhong was acting Minister of Education, Grand Councillor, Binzhou prefect, Binning observation commissioner, and eastern Tangut campaign commissioner;',
    idiomatic: 'Bai Minzhong took Binning and the Tangut front;',
  },
  s0886: {
    literal: 'Vice Minister of Revenue and acting revenue head Wei Mo was Grand Councillor at his present rank.',
    idiomatic: 'Wei Mo joined the council.',
  },
  s0887: {
    literal: 'Seventh month: Grand Councillor and dynastic historian Cui Guicong continued Liu Fang\'s Tang Calendar in twenty-two scrolls and presented it.',
    idiomatic: 'Cui Guicong presented twenty-two scrolls continuing the Tang Calendar.',
  },
  s0888: {
    literal: 'Eighth month, edict: "Princess estate offices issuing documents on their own — fear much sheltering, violating regulations."',
    idiomatic: 'Princess estates were forbidden to issue documents to prefectures.',
  },
  s0889: {
    literal: 'Hereafter except for enfeoffment rites princesses may not have estate offices send documents to prefectures; for public affairs have the estate office report to the Court of the Imperial Clan and act after weighing the matter."',
    idiomatic: 'Estate business had to route through the Imperial Clan court.',
  },
  s0890: {
    literal: '" Shazhou prefect Zhang Yichao sent elder brother Yize to present household registers of eleven prefectures including Guazhou, Shazhou, Yizhou, and Suzhou — since He-Long fell to Tibet a hundred-plus years, now all Longyou old territory was restored.',
    idiomatic: 'Zhang Yichao presented eleven Hexi prefectures back under Tang rule.',
  },
  s0891: {
    literal: 'Yichao was made commissioner of Guasha and allied prefectures.',
    idiomatic: 'Zhang Yichao became Hexi commissioner.',
  },
  s0892: {
    literal: 'Ninth month, edict: "Spell out prefect handover — each public matter must be delivered to the knowing prefect official before leaving office."',
    idiomatic: 'Prefects had to hand over every file before departure.',
  },
  s0893: {
    literal: '"Per Huichang 1 edict, prefects only forbid extorting clerks and pressing households; as for using prefectural offices and miscellaneous profits, all circuits have rules and dare not exceed.',
    idiomatic: 'Huichang rules already barred extortion of clerks and households.',
  },
  s0894: {
    literal: 'Because there was no clear edict, many wicked clerks intimidated or brought lawsuits.',
    idiomatic: 'Without a clear edict clerks had bullied outgoing prefects.',
  },
  s0895: {
    literal: 'From now on when prefects carry goods or after replacement send money — so long as they do not extort clerks or apportion to commoners — let each circuit keep old categories of payment.',
    idiomatic: 'Outgoing gifts were allowed if the people were not squeezed.',
  },
  s0896: {
    literal: 'If there is no public office, it is outside the send-off limit.',
    idiomatic: 'Poor prefectures need not send parting gifts.',
  },
  s0897: {
    literal: 'If there is arbitrary apportionment, treat as embezzlement."',
    idiomatic: 'Forced levies counted as graft.',
  },
  s0898: {
    literal: '" Regular Grand Master, Vice Minister of War, salt-and-transport commissioner, Pillar of State, Viscount of Hedong Pei Xiu was acting Minister of Rites, advanced to gold-purple;',
    idiomatic: 'Pei Xiu took Rites with gold-purple;',
  },
  s0899: {
    literal: 'former Xuan-She observation commissioner, Grand Master of the Palace, acting Left Cavalier Pei Shen was acting Vice Minister of War.',
    idiomatic: 'Pei Shen acted as Vice Minister of War.',
  },
  s0900: {
    literal: 'Tenth month, jihai: Jingzhao prefect Wei Bo memorialized: "Capital-region rich households are shadow-enrolled by armies to evade prefectural corvée; when sued, military offices clamor."',
    idiomatic: 'Wei Bo protested army shadow-enrollment of rich households.',
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
if (data.metadata.chapter !== '018') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 018; standalone T ready (${Object.keys(T).length} entries).`
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
