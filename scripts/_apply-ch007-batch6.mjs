#!/usr/bin/env node
/** Batch 6: s0501–s0582 (Jiutangshu ch.007, Ruizong — Xiantian, abdication, historian comment, eulogy) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0501: {
    literal: 'The office of Royal Tutor was changed to Grand Tutor.',
    idiomatic: 'The Royal Tutor post was renamed Grand Tutor.',
  },
  s0502: {
    literal: 'In the first year of Xiantian, in spring, the first month, on xinwei the new moon, he personally visited the Grand Temple.',
    idiomatic: 'Early in Xiantian 1, on the xinwei new moon, he worshipped at the Grand Temple.',
  },
  s0503: {
    literal: 'On guiyou, he first laid aside deep mourning garb, attended the main hall, and received court congratulations.',
    idiomatic: 'On guiyou he ended deep mourning, took the main throne, and accepted New Year homage.',
  },
  s0504: {
    literal: 'On jiaxu, Bing, Fen, and Jiang prefectures suffered earthquake; people’s dwellings were destroyed.',
    idiomatic: 'On jiaxu earthquakes wrecked homes in Bing, Fen, and Jiang.',
  },
  s0505: {
    literal: 'On xinsi, the southern suburb rite.',
    idiomatic: 'On xinsi he sacrificed at the southern suburb.',
  },
  s0506: {
    literal: 'On wuzi, he personally plowed the sacred field.',
    idiomatic: 'On wuzi he plowed the sacred field himself.',
  },
  s0507: {
    literal: 'On jichou, a great amnesty was proclaimed for all under Heaven; the era name was changed to Taiji.',
    idiomatic: 'On jichou the realm was amnestied and the reign title became Taiji.',
  },
  s0508: {
    literal: 'Inner and outer officials of fourth rank and below received one rank; third rank and above each received one noble rank.',
    idiomatic: 'Officers to fourth rank rose one step; third rank and up gained a noble grade.',
  },
  s0509: {
    literal: 'For the temple of the Venerable Master Kong, thirty nearby households in that prefecture were taken to sweep and sprinkle.',
    idiomatic: 'Confucius’ temple was given thirty local households for upkeep.',
  },
  s0510: {
    literal: 'The realm enjoyed great feasting for five days; the aged ninety and above were specially granted scarlet robes and ivory court tablets, eighty and above green robes and wooden tablets.',
    idiomatic: 'Five days of feasting were proclaimed; men over ninety got scarlet and ivory tablets, over eighty green and wood.',
  },
  s0511: {
    literal: 'On yiwei, Minister of Revenue Cen Xi and Left Censor-in-Chief Dou Huai’zhen were both made Grand Counselors of the third rank.',
    idiomatic: 'On yiwei Cen Xi and Dou Huai’zhen joined the third-rank council.',
  },
  s0512: {
    literal: 'On dingyou, the Secretariat gained one additional Vice Director; the Directorates of Palace Receptions, Justice, State Guests, the Grand Treasury, Court of the Imperial Clan, and Imperial Sacrifices each gained a Vice Director; the Directorates of the Palace Workshops and Imperial Construction each gained a Vice Director; the Directorate of Education gained a Vice Chancellor; the Left and Right Censorates each gained an Assistant Censor-in-Chief.',
    idiomatic: 'On dingyou a wave of vice posts was added across the secretariat, ministries, censorate, and schools.',
  },
  s0513: {
    literal:
      'The two capitals of Yong and Luo and the four great area commands of Bing, Yi, Jing, and Yang each gained a Chief Administrator, divided into Left and Right Chief Administrators.',
    idiomatic:
      'Yong, Luo, and the four great commands of Bing, Yi, Jing, and Yang each gained left and right chief administrators.',
  },
  s0514: {
    literal: 'On dinghai, the crown prince performed the libation rite at the National University.',
    idiomatic: 'On dinghai the heir offered at the National University.',
  },
  s0515: {
    literal: 'Yan Hui was posthumously enfeoffed Grand Preceptor of the Heir Apparent; Zeng Shen Grand Protector of the Heir Apparent.',
    idiomatic: 'Yan Hui and Zeng Shen were posthumously honored as the heir’s grand tutor and protector.',
  },
  s0516: {
    literal: 'Each spring and autumn libation, the four categories of disciples and Zeng Shen were associated in sacrifice, ranked above the twenty-two worthies.',
    idiomatic: 'At spring and autumn rites Zeng Shen and the four disciple categories stood above the twenty-two sages.',
  },
  s0517: {
    literal: 'On xinyou, the offices of the Right Censorate were abolished.',
    idiomatic: 'On xinyou the Right Censorate was abolished.',
  },
  s0518: {
    literal: 'On jisi, the new statutes and formats were promulgated throughout the realm.',
    idiomatic: 'On jisi new law codes went out to the empire.',
  },
  s0519: {
    literal: 'In summer, the fourth month, on xinchou, an edict said:',
    idiomatic: 'In the fourth month, on xinchou, an edict ran:',
  },
  s0520: {
    literal: 'On wuyin of the fifth month, he personally sacrificed at the northern suburb.',
    idiomatic: 'On wuyin of the fifth month he worshipped at the northern suburb.',
  },
  s0521: {
    literal: 'On xinwei, a great amnesty was proclaimed for all under Heaven; the era name was changed to Yanhe.',
    idiomatic: 'On xinwei the realm was amnestied and the reign title became Yanhe.',
  },
  s0522: {
    literal: 'Huan Yanfan, Jing Hui, Cui Xuanwei, Zhang Jianzhi, Yuan Shuoji, and others specially had their sons and grandsons restored to a substantive fief of two hundred households.',
    idiomatic: 'The sons and grandsons of Huan Yanfan, Jing Hui, Cui Xuanwei, Zhang Jianzhi, Yuan Shuoji, and their fellows regained two-hundred-household fiefs.',
  },
  s0523: {
    literal: 'The realm enjoyed great feasting for five days.',
    idiomatic: 'Five days of public feasting were proclaimed.',
  },
  s0524: {
    literal: 'On guichou of the sixth month, Minister of Revenue Cen Xi was made Attendant-in-Chief.',
    idiomatic: 'On guichou Cen Xi became Attendant-in-Chief.',
  },
  s0525: {
    literal: 'On yimao, the late Empress Zetian was posthumously honored as Empress of the Sage Emperor.',
    idiomatic: 'On yimao Wu Zetian was posthumously styled Empress of the Sage Emperor.',
  },
  s0526: {
    literal: 'On gengshen, Youzhou Area Commander Sun Jian led Left Valiant Cavalry General Li Kailuo, Left Martial Guard General Zhou Yiti, and others with thirty thousand troops to battle the Xi chieftain Li Dafu at Mount Xing; they were defeated by the bandits and Jian died in the array.',
    idiomatic: 'On gengshen Sun Jian of Youzhou fell at Mount Xing fighting Li Dafu of the Xi with thirty thousand men.',
  },
  s0527: {
    literal: 'On renxu, Wei Zhigu was made Minister of Revenue, still Grand Counselor of the third rank as before.',
    idiomatic: 'On renxu Wei Zhigu took Revenue while keeping his council seat.',
  },
  s0528: {
    literal: 'On gengwu of the seventh month, Dou Huai’zhen was made Right Vice Director and “equal” in managing weighty affairs of state.',
    idiomatic: 'In the seventh month Dou Huai’zhen became Right Vice Director with charge of state affairs.',
  },
  s0529: {
    literal: 'On jimao, the emperor watched music at Anfu Gate; candles carried day into night and only ended after a full day.',
    idiomatic: 'On jimao he watched music at Anfu Gate by candlelight from dawn to dusk.',
  },
  s0530: {
    literal: 'On gengzi, the emperor transmitted the throne to the crown prince, styled himself Retired Emperor, and every five days received court once at Taiji Hall; he called himself zhen; appointments and great punishments for third rank and above he decided himself, his orders styled gao and ling.',
    idiomatic: 'On gengzi he abdicated to the heir, took the title Retired Emperor, and every five days held court at Taiji as zhen, reserving third-rank appointments and capital crimes under gao and ling.',
  },
  s0531: {
    literal: 'The emperor daily received court at Wude Hall, styled himself yu; appointments and penal exile for third rank and below he ordered decided, his orders styled zhi and chi.',
    idiomatic: 'The new emperor held daily court at Wude as yu, deciding lower ranks and lesser punishments by zhi and chi.',
  },
  s0532: {
    literal: 'On jiachen, a great amnesty was proclaimed for all under Heaven; the era name was changed to Xiantian.',
    idiomatic: 'On jiachen the realm was amnestied and the reign title became Xiantian.',
  },
  s0533: {
    literal: 'On wushen of the eighth month, the emperor’s son Prince of Xuchang Sizhi was re-enfeoffed Prince of Tan and Prince of Zhending Siqian Prince of Ying.',
    idiomatic: 'On wushen Sizhi became Prince of Tan and Siqian Prince of Ying.',
  },
  s0534: {
    literal: 'On jiyou, Prince of Song Chengqi was made Minister of Works, still holding Yangzhou Grand Commandery from afar as before.',
    idiomatic: 'On jiyou Chengqi became Minister of Works while still titular Yangzhou commander.',
  },
  s0535: {
    literal: 'On gengxu, Dou Huai’zhen was made Left Vice Director and Grand Counselor of the third rank, still also Censor-in-Chief;',
    idiomatic: 'On gengxu Dou Huai’zhen became Left Vice Director and chief censor;',
  },
  s0536: {
    literal: 'Liu Youqiu was made Right Vice Director, still Grand Counselor of the third rank as before;',
    idiomatic: 'Liu Youqiu became Right Vice Director with council rank;',
  },
  s0537: {
    literal: 'Wei Zhigu was made Attendant-in-Chief;',
    idiomatic: 'Wei Zhigu became Attendant-in-Chief;',
  },
  s0538: {
    literal: 'Cui Shi was made Grand Counselor;',
    idiomatic: 'Cui Shi became Grand Counselor;',
  },
  s0539: {
    literal: 'all supervised revision of the national history.',
    idiomatic: 'all four oversaw the national history.',
  },
  s0540: {
    literal: 'On dingsi, the emperor’s consort Lady Wang was installed as empress.',
    idiomatic: 'On dingsi Lady Wang became empress.',
  },
  s0541: {
    literal: 'On guihai, Liu Youqiu was sentenced to penal exile in Fengzhou.',
    idiomatic: 'On guihai Liu Youqiu was exiled to Feng.',
  },
  s0542: {
    literal: 'On dingmao the new moon of the ninth month, the sun was eclipsed.',
    idiomatic: 'The ninth month’s dingmao new moon brought a solar eclipse.',
  },
  s0543: {
    literal: 'On jiashen, the emperor’s son Sisheng was enfeoffed Prince of Shan.',
    idiomatic: 'On jiashen Sisheng became Prince of Shan.',
  },
  s0544: {
    literal: 'On gengzi of the tenth month of winter, the emperor personally visited the Grand Temple; when the rites were complete, he attended from Yanxi Gate and proclaimed a great amnesty for all under Heaven.',
    idiomatic: 'On gengzi he worshipped at the Grand Temple, then from Yanxi Gate amnestied the realm.',
  },
  s0545: {
    literal: 'On renyin, the spirit tablets of Empresses Zhaocheng and Suming were enshrined in Yikun Temple.',
    idiomatic: 'On renyin the tablets of Empresses Zhaocheng and Suming entered Yikun Temple.',
  },
  s0546: {
    literal: 'On guimao, the emperor visited the hot springs at Xinfeng and hunted on the Wei River.',
    idiomatic: 'On guimao he bathed at Xinfeng and hunted the Wei.',
  },
  s0547: {
    literal: 'On dingwei of the twelfth month, a gao forbade people to slaughter dogs and chickens.',
    idiomatic: 'In the twelfth month a gao banned slaughter of dogs and chickens.',
  },
  s0548: {
    literal: 'On wuwu, Ji Prefecture was changed to Yi Prefecture.',
    idiomatic: 'On wuwu Ji became Yi.',
  },
  s0549: {
    literal: 'In the second year of Xiantian, in spring, the first month, an edict ordered the military forces of Hebei circuits to be mustered, all to be led by their prefectural governors.',
    idiomatic: 'Early in Xiantian 2 an edict put Hebei militia under their prefects’ command.',
  },
  s0550: {
    literal: 'On yihai, Minister of Personnel and Right Mentor of the Heir Apparent, Xiao Zhizhong, Duke of Zan, was made Grand Counselor.',
    idiomatic: 'On yihai Xiao Zhizhong, Duke of Zan, became Grand Counselor.',
  },
  s0551: {
    literal: 'On the Lantern Festival night the Retired Emperor attended lamps at Anfu Gate; palace women linked arms in street songs; all officials were allowed to watch; only at night’s end did it stop.',
    idiomatic: 'On Lantern Night the retired emperor watched lamps at Anfu Gate while palace women danced in the streets before the court until dawn.',
  },
  s0552: {
    literal: 'On bingshen of the second month, Longzhou was changed to Langzhou and Shi Prefecture to Jianzhou.',
    idiomatic: 'On bingshen Long became Lang and Shi became Jian.',
  },
  s0553: {
    literal: 'Shen Prefecture was established by dividing Ji Prefecture.',
    idiomatic: 'Ji was split to create Shen.',
  },
  s0554: {
    literal: 'Earlier, a monk Boduo requested that the gates be opened at night with a thousand torches lit for three days and three nights.',
    idiomatic: 'Earlier the monk Boduo had asked for three nights of open gates and a thousand lamps.',
  },
  s0555: {
    literal: 'The emperor attended lamps at Yanxi Gate and indulged in music for three days and three nights.',
    idiomatic: 'The emperor watched lamps at Yanxi Gate and feasted three full nights.',
  },
  s0556: {
    literal: 'Left Reminder Yan Tingzhi submitted a memorial remonstrating; only then did it stop.',
    idiomatic: 'Left Reminder Yan Tingzhi remonstrated and the revels ended.',
  },
  s0557: {
    literal: 'On xinmao of the third month, the empress sacrificed to the Silkworm Ancestor.',
    idiomatic: 'On xinmao the empress offered to the Silkworm Ancestor.',
  },
  s0558: {
    literal: 'On guisi, the number of characters in edicts, tables, memorials, petitions, and notes for year and month was set at ten, thirty, and forty characters.',
    idiomatic: 'On guisi document headings were standardized to ten-, thirty-, and forty-character lines.',
  },
  s0559: {
    literal: 'In summer, the sixth month, on bingchen, Minister of War and Commander-in-Chief of the Shuofang campaign Guo Yuanzhen was given added rank as Grand Counselor of the third rank.',
    idiomatic: 'In the sixth month Guo Yuanzhen of Shuofang gained a third-rank council seat.',
  },
  s0560: {
    literal: 'In the seventh month, on jiazi, Princess Taiping with Vice Director Dou Huai’zhen, Attendant-in-Chief Cen Xi, Grand Counselor Xiao Zhizhong, General of the Left Feathered Forest Chang Yuankai, and others plotted rebellion; the plot was discovered and the emperor led troops to execute them.',
    idiomatic: 'On jiazi Taiping, Dou Huai’zhen, Cen Xi, Xiao Zhizhong, Chang Yuankai, and others plotted treason; the emperor crushed them by force.',
  },
  s0561: {
    literal: 'Investigating their party, Junior Protector of the Heir Apparent Xue Ji, Left Regular Attendant Jia Yingfu, Right Feathered Forest General Li Ci and Li Qin, Palace Draftsman Li You, Grand Counselor Cui Shi, Left Assistant Director Lu Zangyong, Astrological Director Fu Xiaozhong, the monk Huifan, and others were all executed.',
    idiomatic: 'The purge took Xue Ji, Jia Yingfu, the Li brothers, Cui Shi, Lu Zangyong, Fu Xiaozhong, Huifan, and the rest to execution.',
  },
  s0562: {
    literal: 'Minister of War Guo Yuanzhen followed the emperor to Chengtian Gate tower; a great amnesty was proclaimed for all under Heaven; from great sedition downward, none light or heavy was not pardoned.',
    idiomatic: 'Guo Yuanzhen stood with the emperor on Chengtian Gate and amnestied all crimes down from great sedition.',
  },
  s0563: {
    literal: 'The next day the Retired Emperor’s gao said: “I shall dwell aloft in nonaction; from now on for military, penal, and political affairs of any kind and above, all shall follow the emperor’s disposition.',
    idiomatic: 'Next day the retired emperor’s gao read: “I take the high seat of nonaction; henceforth all military and civil matters go to the emperor.',
  },
  s0564: {
    literal: '” — closing quotation of the gao.',
    idiomatic: '[Close of gao.]',
  },
  s0565: {
    literal: 'In the sixth month of summer, jiazi, of the fourth year of Kaiyuan, the Retired Emperor died in Baifu Hall at age fifty-five.',
    idiomatic: 'In Kaiyuan 4, sixth month, the retired emperor died in Baifu Hall at fifty-five.',
  },
  s0566: {
    literal: 'In the seventh month of autumn, on jihai, the posthumous title Great Sage and Chaste Emperor was elevated; his temple name was Ruizong.',
    idiomatic: 'In the seventh month he was posthumously named Great Sage and Chaste Emperor, temple name Ruizong.',
  },
  s0567: {
    literal: 'In the tenth month of winter, on gengwu, he was buried at Qiaoling.',
    idiomatic: 'In the tenth month he was buried at Qiaoling.',
  },
  s0568: {
    literal: 'In the second month of the thirteenth year of Tianbao, the posthumous title was changed to Emperor Xuanzhen the Great Sage, Great Prosperity, and Great Filial Piety.',
    idiomatic: 'In Tianbao 13 his posthumous style was lengthened to Xuanzhen the Great Sage of Great Prosperity and Filial Piety.',
  },
  s0569: {
    literal: '【Historian’s appraisal】 The historian says: When law is not one, fraud and falsehood arise; when government is not one, factions are born; when the ruler opens the springhead, how can those below cease scrambling in competition?',
    idiomatic: '【Historian’s appraisal】 The historian writes: One law or the realm fills with fraud; one government or cliques multiply; when the throne opens the floodgate, who below can stop striving?',
  },
  s0570: {
    literal: 'Consider the time of the Empress: clouds piled at the mansions of the Two Zhangs;',
    idiomatic: 'Under the Empress, favor pooled in the Two Zhangs’ halls;',
  },
  s0571: {
    literal: 'in the age of Xiaohé, waves poured at the gates of the Three Princes.',
    idiomatic: 'under Xiaohé, tide ran to the Three Princes’ doors.',
  },
  s0572: {
    literal: 'Offer marvels and posts filled the court; pay bribes and slant-seal appointments choked the roads—all advancing by the track of promotion, plotting profit as their chart, like fire cast into a spring: how could there be no ruin?',
    idiomatic: 'Wonder-workers packed the hall; bribes bought “slant-seal” posts on every road—everyone raced for gain like fire poured into a spring: could ruin not follow?',
  },
  s0573: {
    literal: 'When Jinglong succeeded, foul custom was swept clear, yet still the mother tested the carriage with a pestle and clapped hands on Taiping’s day.',
    idiomatic: 'Jinglong brought a cleaner court, yet a mother still tested the throne and a sister still ruled the feast.',
  },
  s0574: {
    literal: 'So that letters repeatedly reported omens, the ruler could not rest secure; palace officers proposed charms against evil spirits, the Son of Heaven issued an edict ashamed to tour the borders.',
    idiomatic: 'Omens piled in the mail; the ruler slept uneasy; palace magicians offered anti-demon rites; he shamefacedly ordered border tours.',
  },
  s0575: {
    literal: 'They had already bent the bow to shoot at me; I could only weep as I carried out the execution.',
    idiomatic: 'They drew the bow on me; I wept even as I struck.',
  },
  s0576: {
    literal: 'This was chiefly the fault of the Princess of Zhenguo, yet also a failure at the throne.',
    idiomatic: 'Taiping bore the greater blame, yet the throne too had failed.',
  },
  s0577: {
    literal: 'Now the ruler’s filial love should bestow canonical punishment and draw kin within the measure of ritual, so that none overstep and those below cease coveting—then naturally the Way of rule would be renewed and the steps to chaos unmade.',
    idiomatic: 'A ruler’s love should punish by statute and bind kin to ritual, leaving no overreach and no hungry eyes below—then order would renew itself and chaos never rise.',
  },
  s0578: {
    literal: 'Xiaohé had already failed in this; Xuanzhen likewise did not succeed.',
    idiomatic: 'Xiaohé missed it; Xuanzhen did not do better.',
  },
  s0579: {
    literal: '【Eulogy】 The eulogy says: Xiaohé and Xuanzhen both resembled their forebears.',
    idiomatic: '【Eulogy】 The eulogy says: Xiaohé and Xuanzhen both took after their ancestors.',
  },
  s0580: {
    literal: 'Following feeling and turning their backs on ritual, they took pleasure for themselves.',
    idiomatic: 'They followed appetite, broke ritual, and kept joy for themselves.',
  },
  s0581: {
    literal: 'They would not walk the level road but followed the overturned cart’s track.',
    idiomatic: 'They shunned the level path and rode the rut of the overturned cart.',
  },
  s0582: {
    literal: 'To uphold the sacred heir they relied on worthy ministers.',
    idiomatic: 'Only worthy ministers bore up the sacred heir.',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/007.json';
const TRANS_PATH = 'translations/current_translation_jiutangshu.json';
const START = 501;
const END = 582;

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

const chapterPath = CHAPTER_PATH;
let trans = JSON.parse(readFileSync(TRANS_PATH, 'utf8'));
if (trans.metadata.chapter !== '007') {
  throw new Error(`Expected chapter 007, got ${trans.metadata.chapter}`);
}

const expectedIds = new Set(
  Array.from({ length: END - START + 1 }, (_, i) => `s${String(START + i).padStart(4, '0')}`)
);

for (const id of expectedIds) {
  if (!T[id]) throw new Error(`Missing translation for ${id}`);
}

const byOriginal = new Map(trans.sentences.map((s) => [s.originalId || s.id, s]));

for (const id of expectedIds) {
  if (!byOriginal.has(id)) {
    const extracted = extractRange(chapterPath, START, END).find((s) => s.originalId === id);
    if (!extracted) throw new Error(`Missing ${id} in ${chapterPath}`);
    trans.sentences.push(extracted);
    byOriginal.set(id, extracted);
  }
}

trans.sentences.sort(
  (a, b) =>
    parseInt((a.originalId || a.id).slice(1), 10) -
    parseInt((b.originalId || b.id).slice(1), 10)
);

let applied = 0;
for (const s of trans.sentences) {
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

const missing = [...expectedIds].filter((id) => {
  const row = trans.sentences.find((s) => (s.originalId || s.id) === id);
  return !row || !row.idiomatic;
});
if (missing.length) {
  throw new Error(`Missing translations for: ${missing.join(', ')}`);
}
if (applied !== Object.keys(T).length) {
  throw new Error(`Applied ${applied}, expected ${Object.keys(T).length}`);
}

writeFileSync(TRANS_PATH, JSON.stringify(trans, null, 2) + '\n');
console.log(`Applied ${applied} translations (s0501–s0582)`);
