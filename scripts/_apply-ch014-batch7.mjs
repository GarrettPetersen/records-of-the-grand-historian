#!/usr/bin/env node
/** Batch 7: s0601–s0700 (Jiutangshu ch.014, Shunzong, Xianzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/014.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 601;
const END = 700;

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
  s0601: {
    literal: "At the time the campaign commander was not the right man; the armies dissolved, while neighboring commands watched and nurtured the bandit, empty delay exhausting state revenue.",
    idiomatic: "The wrong commander had dissolved the armies while neighbors watched and tax revenue bled away.",
  },
  s0602: {
    literal: "Li Shidao and Liu Ji urgently requested clearing Chengzong's name — hence blame fell on Lu Congshi while Chengzong was pardoned.",
    idiomatic: "Li Shidao and Liu Ji pressed for Chengzong's pardon — Congshi was blamed instead.",
  },
  s0603: {
    literal: "It was done because there was no other way.",
    idiomatic: "The court acted because it had no choice.",
  },
  s0604: {
    literal: "Youzhou's Liu Ji was advanced to Secretariat Director; Weibo's Tian Ji'an advanced to Grand Mentor; Zi-Qing's Li Shidao advanced to Vice Director — all rewards for ceasing troops.",
    idiomatic: "Liu Ji, Tian Ji'an, and Li Shidao were promoted as rewards for standing down.",
  },
  s0605: {
    literal: "On yimao Youzhou commissioner Liu Ji was poisoned to death by his son Zong.",
    idiomatic: "On yimao Liu Ji was poisoned by his son Zong.",
  },
  s0606: {
    literal: "On gengshen Qian prefect Ma Zong was made Annan protector and overall pacification commissioner.",
    idiomatic: "On gengshen Ma Zong took Annan.",
  },
  s0607: {
    literal: "Eighth month, yisi new moon.",
    idiomatic: "The eighth month opened on yisi.",
  },
  s0608: {
    literal: "On yihai the Emperor looked at the chancellors and said: \"Are immortal matters believable?\"",
    idiomatic: "On yihai he asked his chancellors whether immortals were real.",
  },
  s0609: {
    literal: "Li Fan answered: \"The immortal theory comes from Daoism;",
    idiomatic: "Li Fan answered that immortality came from Daoism;",
  },
  s0610: {
    literal: "what it reveres is Laozi's five thousand words as foundation.",
    idiomatic: "grounded in Laozi's five thousand words.",
  },
  s0611: {
    literal: "Laozi's purport differs in nothing from the classics.",
    idiomatic: "Laozi's teaching, he said, matched the classics.",
  },
  s0612: {
    literal: "Later generations' lovers of the strange falsely borrowed Laozi's immortal talk.",
    idiomatic: "Later wonder-seekers had twisted it into immortality cults.",
  },
  s0613: {
    literal: "Thus Qin Shihuang sent alchemical masters with men and women in boats to seek immortals at sea; Han Wudi married a daughter to an alchemical master seeking the undying drug — both rulers were deluded and in the end gained nothing.",
    idiomatic: "Qin and Han emperors had chased immortals by sea and marriage and gained nothing.",
  },
  s0614: {
    literal: "Emperor Wen took a Hu monk's longevity drug and thereby suffered sudden illness beyond saving.",
    idiomatic: "Even Taizong died from a foreign longevity elixir.",
  },
  s0615: {
    literal: "An old poem says: 'Seeking immortals by taking drugs — many are ruined by the drugs.'",
    idiomatic: "An old poem warned that drug-seekers are ruined by drugs.",
  },
  s0616: {
    literal: "Truly those words!",
    idiomatic: "Truly so, he said.",
  },
  s0617: {
    literal: "A ruler need only seek good governance; when all under Heaven gladly pushes him forward and the altars endure long, naturally he will have long years.",
    idiomatic: "A ruler's longevity lay in good rule, not elixirs.",
  },
  s0618: {
    literal: "The Emperor deeply agreed.",
    idiomatic: "Xianzong was deeply persuaded.",
  },
  s0619: {
    literal: "Zhedong observer Xue Pin was made Run prefect and Zhexi observer; Changzhou prefect Li Xun was made Yue prefect and Zhedong observer.",
    idiomatic: "Xue Pin and Li Xun swapped Zhejiang posts.",
  },
  s0620: {
    literal: "Capital Punishments bureau director Wei Guanzhi was made Secretariat Drafting Editor; Diary Editor Pei Du was made Court of the Imperial Clan outer-office gentleman and edict drafter.",
    idiomatic: "Wei Guanzhi and Pei Du entered drafting posts.",
  },
  s0621: {
    literal: "On guisi Deng prefect Cui Yong was made Yong prefect and overall pacification commissioner.",
    idiomatic: "On guisi Cui Yong took Yong and pacification command.",
  },
  s0622: {
    literal: "Ninth month, wuxu new moon.",
    idiomatic: "The ninth month opened on wuxu.",
  },
  s0623: {
    literal: "On xinhai Tutu Chengcui was again made Left Army Commandant.",
    idiomatic: "On xinhai Chengcui returned as Left Army Commandant.",
  },
  s0624: {
    literal: "Remonstrating officials, because Chengcui had planned the campaign without achievement, requested court law be applied.",
    idiomatic: "Remonstrators demanded punishment for Chengcui's failed campaign.",
  },
  s0625: {
    literal: "The Emperor pardoned him and demoted Chengcui to Armory Commissioner.",
    idiomatic: "The Emperor pardoned him but demoted him to Armory Commissioner.",
  },
  s0626: {
    literal: "Then inner attendant Cheng Wengan was made Left Army Commandant.",
    idiomatic: "Cheng Wengan replaced him as Left Army Commandant.",
  },
  s0627: {
    literal: "On renxu Ying prefect Liu Zong, recalled to mourning, received Youzhou senior administrator and Youzhou Lulong commissioner.",
    idiomatic: "On renxu Liu Zong took Youzhou in mourning recall.",
  },
  s0628: {
    literal: "On guihai War Minister Gao Ying was made Right Vice Director and retired.",
    idiomatic: "On guihai Gao Ying retired as Right Vice Director.",
  },
  s0629: {
    literal: "On bingyin an edict made Right Remonstrating Doctor, acting Court of Imperial Sacrifices Director, Pillar of State, Marquis of Xiangwu County, granted gold-purple fish bag Quan Deyu acting Rites Minister and Grand Councilor.",
    idiomatic: "On bingyin Quan Deyu entered the council as acting Rites Minister.",
  },
  s0630: {
    literal: "On dingmao Hanlin academician Du Gu remained in office as Diary Editor — his wife's father Quan Deyu was in the Secretariat, avoiding suspicion.",
    idiomatic: "On dingmao Du Gu stayed Hanlin but left drafting while his father-in-law served.",
  },
  s0631: {
    literal: "Winter, tenth month, wuchen new moon: Capital Intendant Xu Mengong was made War Vice Minister; Vice Censor Wang Bo replaced Mengong, and Lü Yuanying replaced Bo.",
    idiomatic: "Tenth month: Xu Mengong, Wang Bo, and Lü Yuanying rotated capital and censor posts.",
  },
  s0632: {
    literal: "Princess Shengping the Great Long died.",
    idiomatic: "Princess Shengping died.",
  },
  s0633: {
    literal: "On gengchen Chancellor Pei Ji presented the \"Veritable Records of Emperor Dezong\" in fifty scrolls; Ji was granted three hundred bolts of brocade and silver vessels; historians Jiang Wu, Wei Chuhou, and others received differentiated gifts.",
    idiomatic: "On gengchen Pei Ji presented fifty scrolls of Dezong's Veritable Records and was richly rewarded.",
  },
  s0634: {
    literal: "On xinsi Dingzhou general Yang Boyu incited the three armies to mutiny and detained acting army commander Ren Dijian.",
    idiomatic: "On xinsi Yang Boyu mutinied at Dingzhou and seized Ren Dijian.",
  },
  s0635: {
    literal: "Another general Zhang Zuoyuan killed Boyu; Dijian plotted to submit to court and the three armies feared it — then they killed Zuoyuan.",
    idiomatic: "Zhang Zuoyuan killed Boyu; the troops then killed Zuoyuan when Dijian sought surrender.",
  },
  s0636: {
    literal: "On renchen an edict made Dijian acting Works Minister, Dingzhou senior administrator, and Yiwu commissioner and observer and Beiping army commander.",
    idiomatic: "On renchen Ren Dijian was made Yiwu commissioner.",
  },
  s0637: {
    literal: "On jiawu former Yiwu commissioner, acting Grand Preceptor, concurrent Heir Apparent Grand Tutor, Grand Councilor Zhang Maozhao was made acting Grand Preceptor, concurrent Secretariat Director, Hedong Intendant, and Hedong Jin- Jiang- Ci- Long commissioner.",
    idiomatic: "On jiawu Zhang Maozhao went to Hedong as director and councilor.",
  },
  s0638: {
    literal: "Eleventh month, wuxu new moon: Zhexi memorialized that the circuit formerly had Danyang army — now requested merger into Zhenhai army — approved.",
    idiomatic: "Eleventh month: Danyang army merged into Zhenhai.",
  },
  s0639: {
    literal: "On gengzi Right Golden Guards great general Yi Shen was demoted to Right Guard general — for bribing Commandant Diwu Congzhi with three hundred thousand for the Hedong commission.",
    idiomatic: "On gengzi Yi Shen fell for bribing Diwu Congzhi for Hedong.",
  },
  s0640: {
    literal: "On jiachen Prince of Hui Chong died.",
    idiomatic: "On jiachen Prince Hui Chong died.",
  },
  s0641: {
    literal: "On gengxu former Hedong commissioner Wang E was made acting Minister of Works, concurrent Heir Apparent Grand Tutor, Taiyuan Intendant, Northern Capital regent, and Hedong commissioner.",
    idiomatic: "On gengxu Wang E returned to Hedong in high rank.",
  },
  s0642: {
    literal: "Dai prefecture A-die Guangjin was made Shanyu Protector-General, Zhenwu Lin-Sheng commissioner, revenue-farming-pacification commissioner, and controller of barbarian tribes.",
    idiomatic: "A-die Guangjin took the northern frontier command.",
  },
  s0643: {
    literal: "On gengshen Vice Director and Grand Councilor Pei Ji was made War Minister.",
    idiomatic: "On gengshen Pei Ji became War Minister.",
  },
  s0644: {
    literal: "Former Baoxin commissioner and Dezhou prefect Xue Changchao was made Right Martial Guard general.",
    idiomatic: "Xue Changchao became Right Martial Guard general.",
  },
  s0645: {
    literal: "Earlier Chengzong had seized him and imprisoned him at Zhen prefecture — now he returned to court for that reason.",
    idiomatic: "He had been Chengzong's prisoner until now.",
  },
  s0646: {
    literal: "On bingyin Personnel Department bureau director Liu Gongchuo presented \"The Grand Physician's Admonition\"; the Emperor deeply delighted and accepted it, sending an inner attendant to console him.",
    idiomatic: "On bingyin Liu Gongchuo's medical admonition pleased the throne.",
  },
  s0647: {
    literal: "Twelfth month, dingmao new moon.",
    idiomatic: "The twelfth month opened on dingmao.",
  },
  s0648: {
    literal: "On guiyou overall salt-iron transport commissioner and Penal Minister Li Yong was made acting Personnel Minister, concurrent Yangzhou senior administrator, and Huainan commissioner.",
    idiomatic: "On guiyou Li Yong took Huainan.",
  },
  s0649: {
    literal: "Henan Intendant Fang Shi was made Xuan prefect, Xuan-She-Chi observer, and Caishi army commander.",
    idiomatic: "Fang Shi took Xuan-She.",
  },
  s0650: {
    literal: "Former Xuan-She observer Lu Tan was made Penal Vice Minister and overall salt-iron transport commissioner.",
    idiomatic: "Lu Tan took salt-iron transport.",
  },
  s0651: {
    literal: "On renwu Personnel bureau director Liu Gongchuo was made Vice Censor-in-Chief.",
    idiomatic: "On renwu Liu Gongchuo became Vice Censor-in-Chief.",
  },
  s0652: {
    literal: "Former Vice Censor-in-Chief Lü Yuanying was made E prefect and E-Huang-Yue-Mian-Qi-An-Huang observer.",
    idiomatic: "Lü Yuanying took the middle Yangzi command.",
  },
  s0653: {
    literal: "E-Yue observer Xi Shimei was made Henan Intendant.",
    idiomatic: "Xi Shimei became Henan Intendant.",
  },
  s0654: {
    literal: "Newly appointed Remonstrating Doctor Jiang Wu requested renaming himself Yi.",
    idiomatic: "Jiang Wu took the name Yi.",
  },
  s0655: {
    literal: "Personnel Vice Minister Cui Bin was made Court of Imperial Sacrifices Director.",
    idiomatic: "Cui Bin became Court of Sacrifices director.",
  },
  s0656: {
    literal: "Sixth year, spring, first month, bingyin new moon.",
    idiomatic: "Year 6, spring, first month, bingyin new moon.",
  },
  s0657: {
    literal: "On bingshen Zhangyi acting commissioner Wu Shaoyang was made acting Works Minister and Zhangyi commissioner and Shen-Guang-Cai observer.",
    idiomatic: "On bingshen Wu Shaoyang was confirmed over Zhangyi.",
  },
  s0658: {
    literal: "An edict ordered Remonstrating Doctor Meng Jian, Drafting Editor Liu Bozhu, Works Vice Minister Gui Deng, Right Remonstrance Aide Xiao Fu, and others to translate the \"Mahayana Root Mind-Ground Kuan-yin Sutra\" at Fengquan Temple.",
    idiomatic: "Meng Jian and others were ordered to translate a Buddhist sutra at Fengquan Temple.",
  },
  s0659: {
    literal: "On gengshen Huainan commissioner, Vice Director, Grand Councilor, Duke of Zhao Li Jifu again handled administration, Jixian Hall Grand Academician, and supervised national history.",
    idiomatic: "On gengshen Li Jifu returned to the council from Huainan.",
  },
  s0660: {
    literal: "Second month, bingyin new moon.",
    idiomatic: "The second month opened on bingyin.",
  },
  s0661: {
    literal: "On renshen Vice Director and Grand Councilor Li Fan was made Crown Prince Household Head.",
    idiomatic: "On renshen Li Fan left the council for the heir's household.",
  },
  s0662: {
    literal: "Fan and Jifu were not in harmony; Jifu once in power, hence Fan's chancellorship was ended.",
    idiomatic: "Jifu had ousted his rival Fan from the council.",
  },
  s0663: {
    literal: "On bingzi Hedong commissioner, acting Grand Preceptor, Secretariat Director Zhang Maozhao died.",
    idiomatic: "On bingzi Zhang Maozhao died at Hedong.",
  },
  s0664: {
    literal: "Acting Court of the Imperial Treasury Director Pei Ciyuan was made Fujian observer.",
    idiomatic: "Pei Ciyuan took Fujian.",
  },
  s0665: {
    literal: "On jichou Prince of Su Zao died.",
    idiomatic: "On jichou Prince Su Zao died.",
  },
  s0666: {
    literal: "On guisi Shaan-Guo observer Zhang Hongjing was made acting Rites Minister, Hedong Intendant, and Jin- Jiang- Ci commissioner;",
    idiomatic: "On guisi Zhang Hongjing went to Hedong;",
  },
  s0667: {
    literal: "Right Vice Director Wei Cigong was made Shaanfu senior administrator and Shaan-Guo observer.",
    idiomatic: "Wei Cigong took Shaan-Guo;",
  },
  s0668: {
    literal: "Secretariat Drafting Editor and Hanlin academician Li Jiang was made Revenue Vice Minister.",
    idiomatic: "Li Jiang became Revenue Vice Minister.",
  },
  s0669: {
    literal: "Because the capital region's people were poor, Ever-Normal Granary charity grain of two hundred forty thousand shi was lent; all circuits' prefectures were to relieve and lend by this model.",
    idiomatic: "Two hundred forty thousand shi of charity grain were lent around the capital and ordered copied empire-wide.",
  },
  s0670: {
    literal: "Third month, yiwei new moon: Henan Intendant Xi Shimei was made acting Works Minister, concurrent Lu senior administrator and Zhaoyi commissioner.",
    idiomatic: "Third month: Xi Shimei took Zhaoyi.",
  },
  s0671: {
    literal: "On dingwei acting Right Vice Director Yan Shou was made Jiangling Intendant and Jingnan commissioner.",
    idiomatic: "On dingwei Yan Shou took Jingnan.",
  },
  s0672: {
    literal: "Hedong formerly used tin cash — the people suffered greatly; it was fitting to set five furnaces at Wei prefecture to cast coin.",
    idiomatic: "Hedong's tin money was to be replaced by five mint furnaces at Weizhou.",
  },
  s0673: {
    literal: "On yimao within the metropolitan region army garrisons pastured livestock — imperial sons-in-law and nobles roughly hunted — all may not carry arms, fearing mixed bandits.",
    idiomatic: "On yimao garrison pasturage and noble hunts in the capital were barred from carrying weapons.",
  },
  s0674: {
    literal: "Summer, fourth month, yichou new moon.",
    idiomatic: "In summer the fourth month opened on yichou.",
  },
  s0675: {
    literal: "On wuchen War Minister Pei Ji was made Crown Prince Guest; Remonstrating Doctor Pei Kan was made Tongzhou defense staff commissioner.",
    idiomatic: "On wuchen Pei Ji left war for the heir's court; Pei Kan went to Tongzhou.",
  },
  s0676: {
    literal: "On gengwu Revenue Vice Minister and acting revenue commissioner Li Yijian was made acting Rites Minister, Xiangzhou metropolitan senior administrator, and Shannan East commissioner;",
    idiomatic: "On gengwu Li Yijian took Shannan East;",
  },
  s0677: {
    literal: "Penal Vice Minister and salt-iron transport commissioner Lu Tan was made Revenue Vice Minister and acting revenue commissioner;",
    idiomatic: "Lu Tan took revenue;",
  },
  s0678: {
    literal: "Capital Intendant Wang Bo was made Penal Vice Minister and overall salt-iron transport commissioner;",
    idiomatic: "Wang Bo took salt-iron transport;",
  },
  s0679: {
    literal: "Fujian observer Yuan Yifang was made Capital Intendant.",
    idiomatic: "Yuan Yifang became Capital Intendant.",
  },
  s0680: {
    literal: "On guiyou Zhang Maozhao's household singing girls, forty-seven persons, were returned to Dingzhou.",
    idiomatic: "On guiyou forty-seven of Zhang Maozhao's entertainers were sent back to Dingzhou.",
  },
  s0681: {
    literal: "On jimao the moon approached Fang.",
    idiomatic: "On jimao the moon neared Fang mansion.",
  },
  s0682: {
    literal: "Former Jingnan commissioner Zhao Zongru was made Penal Minister.",
    idiomatic: "Zhao Zongru became Penal Minister.",
  },
  s0683: {
    literal: "Eastern Capital regent Zheng Yuqing was made War Minister, continuing as regent.",
    idiomatic: "Zheng Yuqing became War Minister while staying Luoyang regent.",
  },
  s0684: {
    literal: "Wang Bo memorialized: Jiang-Huai, rivers, passes, and ranges southward and Yan-Yun and other salt offices — Yuanhe 5's total salt-sale receipts were six million nine hundred eighty-five thousand five hundred strings.",
    idiomatic: "Wang Bo reported Yuanhe 5 salt receipts at nearly seven million strings.",
  },
  s0685: {
    literal: "Compared with before the law was changed, fourfold inflated estimate — empty money seventeen million four hundred sixty-three thousand seven hundred strings.",
    idiomatic: "Fourfold inflation since the old law had added over seventeen million in paper valuation.",
  },
  s0686: {
    literal: "Apart from salt principal, deliver to revenue for custody.",
    idiomatic: "Beyond salt cost, surplus went to revenue.",
  },
  s0687: {
    literal: "Approved.",
    idiomatic: "The memorial was approved.",
  },
  s0688: {
    literal: "On xinmao Revenue memorialized establishing patrol officers.",
    idiomatic: "On xinmao Revenue established patrol officers.",
  },
  s0689: {
    literal: "Fifth month, jiawu new moon: Wang Bogong, an official who had taken Wang Chengzong's money, was beaten to death.",
    idiomatic: "Fifth month: Wang Bogong was executed for taking Chengzong's bribes.",
  },
  s0690: {
    literal: "On gengzi Left Golden Guards general Li Weijian was made acting Revenue Minister, Fengxiang Intendant, and Longyou commissioner.",
    idiomatic: "On gengzi Li Weijian took Fengxiang and Longyou.",
  },
  s0691: {
    literal: "On bingwu former Shannan East commissioner, acting Left Vice Director, Grand Councilor Pei Jun died.",
    idiomatic: "On bingwu Pei Jun died.",
  },
  s0692: {
    literal: "On renzi because Zhenwu commissioner A-die Guangjin long showed loyal integrity and long-standing flourishing merit, the surname Li should be granted.",
    idiomatic: "On renzi A-die Guangjin was granted the surname Li for merit.",
  },
  s0693: {
    literal: "Younger brother Ming prefect Li Guangyan had already been handled by a separate edict.",
    idiomatic: "His brother Guangyan had already been honored separately.",
  },
  s0694: {
    literal: "Sixth month, jiazi new moon: reduce Teaching Bureau musicians' clothing and grain rations.",
    idiomatic: "Sixth month: Teaching Bureau rations were cut.",
  },
  s0695: {
    literal: "On dingmao Secretariat and Chancellery memorialized:",
    idiomatic: "On dingmao the Secretariat and Chancellery memorialized:",
  },
  s0696: {
    literal: "\"When offices are few, affairs are few; when affairs are few, men are pure;",
    idiomatic: "\"Fewer offices mean purer government;",
  },
  s0697: {
    literal: "when offices are numerous, affairs are numerous; when affairs are numerous, men are turbid.",
    idiomatic: "too many offices mean corrupt government.",
  },
  s0698: {
    literal: "The cause of purity and turbidity lies in the numerousness or fewness of offices.",
    idiomatic: "Purity depends on trimming the bureaucracy.",
  },
  s0699: {
    literal: "The state since Tianbao has garrisoned the central plain — present soldiers fit for use number more than eight hundred thousand.",
    idiomatic: "Since Tianbao eight hundred thousand soldiers have been kept on the books;",
  },
  s0700: {
    literal: "The rest float as merchants and peddlers, become monks and Daoists, mix into colored corvée, not returning to farming and mulberry — again one or two in ten or five or six.",
    idiomatic: "another fifth or sixth of the realm neither farms nor serves.",
  },
};const source = loadSentencesFromData();
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
if (data.metadata.chapter !== '014') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 014; standalone T ready (${Object.keys(T).length} entries).`
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
