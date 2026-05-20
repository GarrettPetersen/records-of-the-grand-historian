#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0301: {
    literal: 'On gengwu there was a general amnesty throughout the realm.',
    idiomatic: 'On gengwu he proclaimed a general amnesty.',
  },
  s0302: {
    literal:
      'In the fourth month of summer, on jimao, an edict ordered that wherever exposed bones lay, local authorities were to bury them.',
    idiomatic:
      'On jimao in the fourth summer month he decreed that exposed remains everywhere were to be interred.',
  },
  s0303: {
    literal: 'On bingshen the Khitan submitted to inner allegiance.',
    idiomatic: 'On bingshen the Khitan came within the fold.',
  },
  s0304: {
    literal:
      'For the first time an edict ordered charity granaries established in every prefecture and county under heaven.',
    idiomatic:
      'He first commanded charity granaries in every prefecture and county throughout the realm.',
  },
  s0305: {
    literal:
      'Liang Shidu, bandit chief of Xiazhou, was killed by his younger cousin Luoren, who surrendered the city.',
    idiomatic:
      'Liang Shidu, rebel leader at Xiazhou, was slain by his cousin Luoren, who then surrendered the city.',
  },
  s0306: {
    literal: 'In the fifth month there was heavy hail.',
    idiomatic: 'In the fifth month hail fell in abundance.',
  },
  s0307: {
    literal:
      'On the sixth month, gengyin, the prince Zhi was born; officials of the fifth rank and above were feasted, silk was bestowed in graded amounts, and grain was granted to every person born on that day throughout the realm.',
    idiomatic:
      'On gengyin of the sixth month Prince Zhi was born. The emperor entertained officials of the fifth rank and above and distributed graded gifts of silk; every child born in the realm on that day received a grant of grain.',
  },
  s0308: {
    literal:
      'On xinmao the emperor said to his attendant ministers: "Though a lord may fail as lord, a minister may not fail as minister."',
    idiomatic:
      'On xinmao he told his ministers: "A ruler may fail as ruler, but a minister must not fail as minister."',
  },
  s0309: {
    literal:
      'Pei Qiantong had been an intimate attendant of Emperor Yang, yet he himself became the ringleader of the rebellion.',
    idiomatic:
      'Pei Qiantong had been one of Yang\'s closest retainers—yet he led the coup himself.',
  },
  s0310: {
    literal:
      'I am now promoting reverence and righteousness—how can I still let him hold office over the people and instruct custom?',
    idiomatic:
      'I mean to exalt loyalty and duty; how could I still let such a man govern the people and set the moral tone?',
  },
  s0311: {
    literal: '" An edict said:',
    idiomatic: '" He thereupon issued an edict:',
  },
  s0312: {
    literal:
      'In the seventh month of autumn, on wushen, an edict: "Prefect of Laizhou Niu Fangyu, Prefect of Jiangzhou Xue Shiliang, Chief Administrator of the Guangzhou Protectorate Tang Fengyi, and Sui military adjutant of Wuya Gao Yuanli—all had received office under the Sui, yet they entered into compact with Yu Wen Huaji and participated in regicide."',
    idiomatic:
      'On wushen of the seventh autumn month he proclaimed: "Niu Fangyu, prefect of Laizhou; Xue Shiliang, prefect of Jiangzhou; Tang Fengyi, chief administrator of Guangzhou; and Gao Yuanli, a Sui adjutant of Wuya—all had held office under the Sui, yet they conspired with Yu Wen Huaji in the murder of the emperor."',
  },
  s0313: {
    literal:
      'They should follow Pei Qiantong\'s precedent—stripped of names and banished to Lingbiao.',
    idiomatic:
      'Let them be treated like Pei Qiantong: name struck from the rolls and exiled beyond the southern ranges.',
  },
  s0314: {
    literal:
      '" Taizong said to his attendant ministers: "The foolish under heaven love to violate the laws; as for pardons and grace, they should reach only those who have not gone against the norm."',
    idiomatic:
      '" Taizong told his ministers: "The ignorant everywhere delight in breaking the law. An act of grace should extend only to those who have not crossed the line of rebellion."',
  },
  s0315: {
    literal:
      'An ancient saying runs: "The good fortune of petty men is the misfortune of gentlemen."',
    idiomatic:
      'As the ancients said: "When petty men prosper, gentlemen suffer."',
  },
  s0316: {
    literal: '"When amnesties come twice in one year, good people are struck dumb."',
    idiomatic: '"Two amnesties in a single year leave honest men speechless."',
  },
  s0317: {
    literal:
      'To nurture darnel harms the grain; to favor traitors is to rob honest people.',
    idiomatic:
      'Nurturing weeds ruins the crop; coddling criminals harms the upright.',
  },
  s0318: {
    literal:
      'In antiquity King Wen established punishments with the rule that in such cases there was no pardon.',
    idiomatic:
      'Long ago King Wen laid down punishments with the rule that certain crimes admitted no pardon.',
  },
  s0319: {
    literal:
      'Again, the Former Lord of Shu once said to Zhuge Liang: "In my time moving among Chen Yuanfang and Zheng Kangcheng, whenever counsel on ordering or chaos was given it was thorough—but never did they speak of amnesty."',
    idiomatic:
      'The Former Lord of Shu once told Zhuge Liang: "Among Chen Yuanfang and Zheng Kangcheng I heard every argument for order and against chaos—yet never once did they speak of amnesty."',
  },
  s0320: {
    literal:
      'Petty men are the enemies of great men; therefore since I have held the realm I have not widely granted amnesties.',
    idiomatic:
      'Petty men are the enemies of the worthy; that is why, since I took the throne, I have seldom proclaimed amnesty.',
  },
  s0321: {
    literal:
      'Now the four seas are quiet and ritual and righteousness flourish; extraordinary grace cannot be dispensed repeatedly, lest the foolish always hope for luck, seek only to break the law, and fail to reform.',
    idiomatic:
      'Now the realm is at peace and ritual and righteousness prevail. Extraordinary mercy cannot be handed out again and again, or the foolish will count on luck, break the law on purpose, and never mend their ways.',
  },
  s0322: {
    literal:
      '" On the first day of the eighth month, jiaxu, he went to the Court Hall and personally examined cases of wrong and injustice.',
    idiomatic:
      '" On jiaxu, the first day of the eighth month, he went to the main hall and heard grievances in person.',
  },
  s0323: {
    literal:
      'From this time on, with military and state affairs at peace, the emperor daily attended to his father\'s meals at the Western Palace.',
    idiomatic:
      'Thereafter, with war and state business quiet, he went each day to the Western Palace to see that his father was served at table.',
  },
  s0324: {
    literal:
      'On guisi the high ministers memorialized: "According to ritual, in the last month of summer one may dwell in a terrace pavilion."',
    idiomatic:
      'On guisi the chief ministers memorialized: "By ritual, in the last month of summer one may lodge in a raised pavilion."',
  },
  s0325: {
    literal:
      'Now the great heat has not yet subsided and the autumn rains are just beginning; the palace is low and damp—we ask that a pavilion be built for Your Majesty to dwell in."',
    idiomatic:
      '"The great heat has not yet broken, and the autumn rains are only beginning. The palace stands low and damp. We beg that a pavilion be built for Your Majesty\'s residence."',
  },
  s0326: {
    literal:
      'The emperor said: "I suffer from a breathing ailment—how could I abide low dampness?"',
    idiomatic:
      'The emperor replied: "I suffer from a breathing ailment. How could I endure such damp?"',
  },
  s0327: {
    literal:
      'If I yielded to your repeated requests, the waste would be great."',
    idiomatic:
      'If I yielded to your pleas, the cost would be enormous."',
  },
  s0328: {
    literal:
      'In old times Emperor Wen of Han was about to build the Dew Terrace yet spared the livelihood of ten households.',
    idiomatic:
      'Emperor Wen of Han once planned the Dew Terrace but stayed his hand for the sake of ten families\' livelihood.',
  },
  s0329: {
    literal:
      'My virtue does not match that Han emperor\'s, yet I would spend even more—can this be called the way of a parent to the people?"',
    idiomatic:
      'My virtue falls short of that Han emperor\'s, yet I would spend even more. Is that the conduct of a ruler who is parent to his people?"',
  },
  s0330: {
    literal: '" In the end he did not consent.',
    idiomatic: '" In the end he refused.',
  },
  s0331: {
    literal: 'That month there was heavy frost in Henan and Hebei, and the people suffered famine.',
    idiomatic: 'That month severe frost struck Henan and Hebei, and the people went hungry.',
  },
  s0332: {
    literal:
      'On the ninth month, bingwu, an edict said: "Honoring the aged and valuing the old—former kings took this as a model left to posterity;"',
    idiomatic:
      'On bingwu of the ninth month he decreed: "To honor the aged and esteem the old was the example former kings left to later ages;"',
  },
  s0333: {
    literal:
      'returning seals and unbinding the sash, court ministers thereby might see their duties through to the end.',
    idiomatic:
      'to return one\'s seals and lay aside office was how ministers of the court might bring their service to a worthy close.',
  },
  s0334: {
    literal:
      'The rites of offering vegetables and harmonizing music, the institutions of the eastern and western schools—the meaning of nurturing the aged can be seen in surviving texts.',
    idiomatic:
      'The rites of the vegetable offering and communal music, the eastern and western academies—the way of caring for the elderly still shines in the old records.',
  },
  s0335: {
    literal:
      'I respectfully received the great treasure; I take the statutes and former practices as my charter; to seek words and honor affairs of state cuts to the depths of my heart.',
    idiomatic:
      'I have taken the throne in reverence for antiquity, govern by the ordinances of former times, and hold counsel with the elders as the core of my intent.',
  },
  s0336: {
    literal:
      'Yet sentiments linger between past and present; the age treads in the steps of a dissolute season; yet some who register their names and take their places in the ranks depart from the great norm.',
    idiomatic:
      'Yet hearts still waver between past and present, and the age follows a decadent course; some who take office and enter the ranks fall short of the larger principle.',
  },
  s0337: {
    literal:
      'When their sinew and bone are nearly spent and the mulberry and setting sun press near, they exhaust dawn-to-dusk diligence yet do not perceive the fault of walking by night.',
    idiomatic:
      'When strength fails and evening draws on, they wear themselves out with dawn labors yet never grasp that they should have retired at dusk.',
  },
  s0338: {
    literal:
      'Those whose hearts take warning at the stopping-foot, whose conduct can serve to inspire, who resign office at the public gate and gather their bones in their hamlets, who can yield by ritual—these are indeed to be praised.',
    idiomatic:
      'But those who know when to stop, whose conduct may inspire others, who leave office and return home, and who yield their place with proper grace—these deserve praise.',
  },
  s0339: {
    literal:
      'Civil and military officials at court and abroad who retire on account of age, or who submit memorials resigning office—on days they attend court they should rank above those presently holding their former grade."',
    idiomatic:
      'Civil and military officials, at court or in the provinces, who retire on account of age or who submit memorials to resign—on days they attend court they shall take precedence over those currently serving in the rank they once held."',
  },
  s0340: {
    literal:
      '" On dingwei he said to his ministers: "Women shut away in the deep palace—truly this moves pity."',
    idiomatic:
      '" On dingwei he told his ministers: "Women shut away in the inner palace—one cannot but pity them."',
  },
  s0341: {
    literal:
      'In the Sui\'s last years recruitment knew no end; even at detached palaces and lodges where the emperor did not lodge in favor, palace women were gathered in great numbers, draining the people\'s wealth and strength—this I will not do.',
    idiomatic:
      'In the Sui\'s final years the court took women without cease; even at detached palaces the emperor never visited, palace women were hoarded until the people were drained of wealth and strength. I will not follow that path.',
  },
  s0342: {
    literal: 'After sweeping and dusting, what further use have they?',
    idiomatic: 'Once the halls are swept, what further use are they?',
  },
  s0343: {
    literal:
      'Now I will release them and let them seek husbands—not only to spare expense, but so each may fulfill her nature."',
    idiomatic:
      'I mean to release them and let them marry—not only to save expense, but so each may live as nature intended."',
  },
  s0344: {
    literal:
      'Thereupon he sent Left Assistant Director of the Masters of Writing Dai Zhou, Presentation Attendant Du Zhenlun, and others to select them out at the west gate of the Rear Palace.',
    idiomatic:
      'He then sent Dai Zhou, Left Assistant Director of the Masters of Writing, Du Zhenlun, Presentation Attendant, and others to select them out at the west gate of the Rear Palace.',
  },
  s0345: {
    literal:
      'In the tenth month of winter, on gengchen, Censor-in-Chief and Duke of Anji Du Yan died.',
    idiomatic:
      'On gengchen in the tenth winter month Du Yan, Censor-in-Chief and Duke of Anji, died.',
  },
  s0346: {
    literal: 'On wuzi Lu Zushang, Prefect of Yingzhou, was executed.',
    idiomatic: 'On wuzi Lu Zushang, prefect of Yingzhou, was put to death.',
  },
  s0347: {
    literal: 'On xinyou there was a sacrifice at the Circular Mound.',
    idiomatic: 'On xinyou he offered sacrifice at the Circular Mound.',
  },
  s0348: {
    literal:
      'On renwu Huangmen Attendant Wang Gui was made Palace Attendant.',
    idiomatic: 'On renwu Wang Gui, Huangmen Attendant, was appointed Palace Attendant.',
  },
  s0349: {
    literal:
      'In the third year of Zhenguan, in the spring of the first month, on xinhai, a Khitan chieftain came to court.',
    idiomatic:
      'In the third year of Zhenguan, on xinhai of the first spring month, a Khitan chieftain came to court.',
  },
  s0350: {
    literal: 'On wuwu he visited the Imperial Ancestral Temple.',
    idiomatic: 'On wuwu he paid visit to the Imperial Ancestral Temple.',
  },
  s0351: {
    literal: 'On guihai he personally plowed the sacred field.',
    idiomatic: 'On guihai he performed the plowing rite at the sacred field.',
  },
  s0352: {
    literal:
      'On xinwei Minister of Works and Duke of Wei Pei Ji was dismissed for an offense.',
    idiomatic: 'On xinwei Pei Ji, Minister of Works and Duke of Wei, was dismissed for an offense.',
  },
  s0353: {
    literal:
      'On the second month, wuyin, Chief Minister of the Secretariat and Duke of Xing Fang Xuanling was made Left Vice Director of the Masters of Writing; Minister of War and Acting Palace Attendant Du Ruhui, Duke of Cai, was made Right Vice Director; Minister of Punishments and Acting Chief Minister of the Secretariat Li Jing, Duke of Yongkang county, was made Minister of War; Right Assistant Director Wei Zheng was made Acting Director of the Palace Library and took part in government.',
    idiomatic:
      'On wuyin of the second month Fang Xuanling, Chief Minister of the Secretariat and Duke of Xing, became Left Vice Director of the Masters of Writing; Du Ruhui, Minister of War and Acting Palace Attendant, Duke of Cai, became Right Vice Director; Li Jing, Minister of Punishments and Acting Chief Minister of the Secretariat, Duke of Yongkang, became Minister of War; and Wei Zheng, Right Assistant Director, became Acting Director of the Palace Library with a seat in deliberations.',
  },
  s0354: {
    literal:
      'In the fourth month of summer, on xinsi, the Retired Emperor moved to Da\'an Palace.',
    idiomatic: 'On xinsi of the fourth summer month the Retired Emperor moved to Da\'an Palace.',
  },
  s0355: {
    literal: 'On jiazi Taizong began to hear government at Taiji Hall.',
    idiomatic: 'On jiazi Taizong began holding court at Taiji Hall.',
  },
  s0356: {
    literal: 'In the fifth month Prince of Zhou Yuanfang died.',
    idiomatic: 'In the fifth month the Prince of Zhou, Yuanfang, died.',
  },
  s0357: {
    literal:
      'On the sixth month, wuyin, because of drought he personally reviewed prisoners.',
    idiomatic: 'On wuyin of the sixth month, because of drought, he personally reviewed prisoners.',
  },
  s0358: {
    literal:
      'He sent Zhangsun Wuji, Fang Xuanling, and others to pray for rain at famous mountains and rivers; Presentation Draftsman Du Zhenlun and others went to the Guannei circuits to comfort and reassure.',
    idiomatic:
      'He sent Zhangsun Wuji, Fang Xuanling, and others to pray for rain at renowned mountains and rivers; Du Zhenlun, Presentation Draftsman, and others went to the Guannei circuits to comfort the people.',
  },
  s0359: {
    literal:
      'He also ordered civil and military officials each to submit sealed memorials speaking fully of gains and losses.',
    idiomatic:
      'He also ordered civil and military officials to submit sealed memorials setting forth whatever was right or wrong in government.',
  },
  s0360: {
    literal: 'On jimao a great wind broke trees.',
    idiomatic: 'On jimao a violent wind snapped trees.',
  },
  s0361: {
    literal:
      'On the first day of the eighth month, jisi, there was a solar eclipse.',
    idiomatic: 'On jisi, the first day of the eighth month, the sun was eclipsed.',
  },
  s0362: {
    literal: 'The Xueyantuo sent envoys with tribute.',
    idiomatic: 'The Xueyantuo sent a tribute mission.',
  },
  s0363: {
    literal: 'On the ninth month, guichou, medical schools were established in the prefectures.',
    idiomatic: 'On guichou of the ninth month medical schools were established in the prefectures.',
  },
  s0364: {
    literal:
      'In the eleventh month of winter, on bingwu, the Western Turks and Gaochang sent envoys with tribute.',
    idiomatic:
      'On bingwu in the eleventh winter month the Western Turks and Gaochang sent tribute missions.',
  },
  s0365: {
    literal:
      'On gengshen Li Shiji, Area Commander of Bingzhou, was made Overall Commander of the Tonghan Circuit army; Li Jing, Minister of War, was made Overall Commander of the Dingxiang Circuit army—to strike the Turks.',
    idiomatic:
      'On gengshen Li Shiji, commander at Bingzhou, was made overall commander on the Tonghan front and Li Jing, Minister of War, overall commander on the Dingxiang front, to campaign against the Turks.',
  },
  s0366: {
    literal: 'On wuchen Qaghan Tuli came in flight to surrender.',
    idiomatic: 'On wuchen Qaghan Tuli fled to the court and submitted.',
  },
  s0367: {
    literal:
      'On guiwei Du Ruhui resigned office on account of illness; the request was granted.',
    idiomatic: 'On guiwei Du Ruhui asked leave of office because of illness, and the request was granted.',
  },
  s0368: {
    literal: 'On guichou an edict:',
    idiomatic: 'On guichou he issued an edict:',
  },
  s0369: {
    literal:
      'At every place where arms had been joined since the founding struggle, a temple was to be established for each loyal warrior who had given his life on campaign; Yu Shinan, Li Boyao, Chu Liang, Yan Shigu, Cen Wenben, Xu Jingzong, Zhu Zishe, and others were ordered to compose stele inscriptions recording their achievements.',
    idiomatic:
      'For every battlefield since the founding struggle, a temple was to be raised for each loyal man who fell in arms; Yu Shinan, Li Boyao, Chu Liang, Yan Shigu, Cen Wenben, Xu Jingzong, Zhu Zishe, and others were charged to write stele inscriptions commemorating their deeds.',
  },
  s0370: {
    literal:
      'That year the Ministry of Revenue memorialized: Chinese who had returned from beyond the frontier, together with Turks who had successively submitted and the opening of the four barbarian regions as prefectures and counties, numbered more than 1,200,000 persons in all.',
    idiomatic:
      'That year the Ministry of Revenue reported that Chinese returning from beyond the passes, Turks who had submitted in succession, and peoples of the four frontier regions newly organized as prefectures and counties together amounted to more than 1,200,000 souls.',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/002.json';
const TRANS_PATH = 'translations/current_translation_jiutangshu.json';
const START = 301;
const END = 370;

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

  out.sort((a, b) => parseInt(a.originalId.slice(1), 10) - parseInt(b.originalId.slice(1), 10));
  return out;
}

const chapterPath = CHAPTER_PATH;
let trans = JSON.parse(readFileSync(TRANS_PATH, 'utf8'));
if (trans.metadata.chapter !== '002') {
  throw new Error(`Expected chapter 002, got ${trans.metadata.chapter}`);
}

const expectedIds = new Set(
  Array.from({ length: END - START + 1 }, (_, i) => `s${String(START + i).padStart(4, '0')}`)
);

for (const id of expectedIds) {
  if (!T[id]) throw new Error(`Missing translation for ${id}`);
}

const byOriginal = new Map(
  trans.sentences.map((s) => [s.originalId || s.id, s])
);

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
console.log(`Applied ${applied} translations (s0301–s0370)`);
