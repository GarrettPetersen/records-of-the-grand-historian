#!/usr/bin/env node
/** Batch 5: s0401–s0475 (Jiutangshu ch.003, Taizong 2 — Zhenguan 22–23, death, burial, historian comment, eulogy) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0401: {
    literal:
      'Moreover, from north of the Turks to the Huihe tribes, sixty-six relay stations were established to open communication with the northern wastes.',
    idiomatic:
      'He also set up sixty-six relay posts from the Turk lands northward to the Huihe tribes, opening the road into the northern wilds.',
  },
  s0402: {
    literal:
      'In the twenty-second year of Zhenguan, in the twenty-second year, spring, first month, on gengyin, Chief Councillor Ma Zhou died.',
    idiomatic:
      'In the twenty-second year of Zhenguan, on gengyin of the first spring month, Chief Councillor Ma Zhou died.',
  },
  s0403: {
    literal:
      'Minister of Education, Duke of Zhao Wuji was made concurrent Inspector-General of the Secretariat and managed the affairs of the Secretariat and Chancellery.',
    idiomatic:
      'Zhangsun Wuji, Minister of Education and Duke of Zhao, was also named Inspector-General of the Secretariat and took charge of Secretariat and Chancellery business.',
  },
  s0404: {
    literal:
      'On jihai, Vice Minister of Justice Cui Renshi was made Vice Director of the Secretariat and participated in deliberations on state affairs.',
    idiomatic:
      'On jihai, Cui Renshi, Vice Minister of Justice, became Vice Director of the Secretariat with a seat in confidential counsel.',
  },
  s0405: {
    literal: 'On wuxu he visited the hot springs.',
    idiomatic: 'On wuxu he went to the hot springs.',
  },
  s0406: {
    literal: 'On wushen he returned to the palace.',
    idiomatic: 'On wushen he came back to the capital.',
  },
  s0407: {
    literal:
      'In the second month, former Household Associate Attendant Chu Suiliang was recalled from mourning to his former post as Household Associate Attendant.',
    idiomatic:
      'In the second month Chu Suiliang, former Household Associate Attendant, left mourning and resumed that office.',
  },
  s0408: {
    literal:
      'Secretariat Vice Director Cui Renshi was struck from the rolls and banished to Lianzhou.',
    idiomatic:
      'Cui Renshi, Vice Director of the Secretariat, was expelled from office and exiled to Lianzhou.',
  },
  s0409: {
    literal:
      'On guichou the Western Turks\' Shaboluo Yehu led his people to submit; his yabghu Qu Baifu was made General of Loyal Valor and concurrently Great Yabghu.',
    idiomatic:
      'On guichou Shaboluo Yehu of the Western Turks brought his people in; his yabghu Qu Baifu was made General of Loyal Valor and Great Yabghu as well.',
  },
  s0410: {
    literal: 'On wuwu the Jiegu tribe was organized as the Jiankun Protectorate.',
    idiomatic: 'On wuwu the Jiegu people were made the Jiankun Protectorate.',
  },
  s0411: {
    literal:
      'On yihai he visited Jade Splendor Palace; on yimao he bestowed graded grain and silk on the aged and the gravely ill along the route.',
    idiomatic:
      'On yihai he went to Jade Splendor Palace; on yimao he gave graded gifts of grain and silk to the old and the seriously ill he passed along the way.',
  },
  s0412: {
    literal: 'On jimao he conducted a hunt at Huayuan.',
    idiomatic: 'On jimao he hunted at Huayuan.',
  },
  s0413: {
    literal:
      'On jiayin of the fourth month, tribes beyond the desert disputed grazing and drove their horses across the border; the emperor went in person to judge the case, and only then did all submit.',
    idiomatic:
      'On jiayin in the fourth month, frontier tribes beyond the sands quarreled over pasture and drove their herds across the line; the emperor judged the dispute himself, and all parties yielded.',
  },
  s0414: {
    literal:
      'On dingsi General Liang Jianfang of the Right Martial Guards attacked the Songwai barbarians and reduced seventy-two tribes.',
    idiomatic:
      'On dingsi Liang Jianfang, general of the Right Martial Guards, struck the Songwai tribes and brought seventy-two of them to heel.',
  },
  s0415: {
    literal:
      'On gengzi of the fifth month, Chief Clerk Wang Xuance of the Right Guard attacked the kingdom of Diennafudi, routed it, and captured its king Arunasena together with the queen and princes; he brought twelve thousand men and women and more than twenty thousand cattle and horses to court.',
    idiomatic:
      'On gengzi in the fifth month Wang Xuance, chief clerk of the Right Guard, crushed the kingdom of Diennafudi, seized King Arunasena with his queen and sons, and presented at court twelve thousand captives and more than twenty thousand head of cattle and horses.',
  },
  s0416: {
    literal:
      'He sent the alchemist Naluo\'ersapo to compound an elixir of longevity at the Golden Gale Gate.',
    idiomatic:
      'He sent the alchemist Naluo\'ersapo to brew an elixir of long life at the Golden Gale Gate.',
  },
  s0417: {
    literal:
      'The Tibetan tsenpo broke central India and sent envoys bearing news of victory.',
    idiomatic:
      'The Tibetan tsenpo overran central India and sent envoys with word of triumph.',
  },
  s0418: {
    literal:
      'On guiyou of the sixth month, Senior Grand Master, Duke of Song Xiao Yu died.',
    idiomatic: 'On guiyou of the sixth month Xiao Yu, Senior Grand Master and Duke of Song, died.',
  },
  s0419: {
    literal:
      'In the seventh month of autumn, on guimao, Minister of Works, Duke of Liang Fang Xuanling died.',
    idiomatic:
      'On guimao in the seventh autumn month Fang Xuanling, Minister of Works and Duke of Liang, died.',
  },
  s0420: {
    literal: 'On the first day of the eighth month, jiyou, there was a solar eclipse.',
    idiomatic: 'On jiyou, the first day of the eighth month, the sun was eclipsed.',
  },
  s0421: {
    literal:
      'On jihai of the ninth month, Household Associate Attendant Chu Suiliang was made Secretariat Director.',
    idiomatic:
      'On jihai of the ninth month Chu Suiliang, Household Associate Attendant, became Secretariat Director.',
  },
  s0422: {
    literal: 'On guihai of the tenth month he returned from Jade Splendor Palace.',
    idiomatic: 'On guihai of the tenth month he came back from Jade Splendor Palace.',
  },
  s0423: {
    literal:
      'On wuxu of the eleventh month the Liao of Mei, Qiong, and Ya prefectures rebelled; General Liang Jianfang of the Right Guard suppressed them.',
    idiomatic:
      'On wuxu in the eleventh month the Liao of Mei, Qiong, and Ya rose; Liang Jianfang, general of the Right Guard, put them down.',
  },
  s0424: {
    literal:
      'On gengzi the Khitan chief Kuge and the Xi chief Keduzhe each led their tribes to submit within the borders.',
    idiomatic:
      'On gengzi the Khitan leader Kuge and the Xi leader Keduzhe each brought his people inside the frontier.',
  },
  s0425: {
    literal:
      'The Khitan were made the Songmo Protectorate; the Xi were organized as the Raole Protectorate.',
    idiomatic:
      'The Khitan became the Songmo Protectorate; the Xi were set up as the Raole Protectorate.',
  },
  s0426: {
    literal:
      'On yimao of the twelfth month two additional Palace Attendant Censors and two Investigation Censors were appointed, and ten reviewers were established at the Court of Review.',
    idiomatic:
      'On yimao in the twelfth month the court added two Palace Attendant censors and two investigation censors, and placed ten reviewers in the Court of Review.',
  },
  s0427: {
    literal:
      'On the first day of the intercalary month, dingchou, Area Commander Ashina She\'er of the Kunshan Circuit reduced Chumi and Chuyue, broke fifty Kucha cities including Dabo, captured tens of thousands, seized Kucha King Helibushibi and returned; Kucha was pacified and the Western Regions were shaken.',
    idiomatic:
      'On dingchou, the first day of the intercalary month, Ashina She\'er, commander of the Kunshan Circuit, subdued Chumi and Chuyue, stormed fifty Kucha strongholds including Dabo, took tens of thousands captive, and brought back King Helibushibi of Kucha; with Kucha pacified, the west trembled.',
  },
  s0428: {
    literal:
      'Vice-commander Xue Wanche compelled the king of Khotan, Fuxinxin, to come to court.',
    idiomatic:
      'His deputy Xue Wanche forced Fuxinxin, king of Khotan, to present himself at court.',
  },
  s0429: {
    literal:
      'On guiwei the king of Silla sent his minister Ichan Geum Chunchu and his son Prince Munwang to court.',
    idiomatic:
      'On guiwei Silla\'s king sent his minister Ichan Geum Chunchu and his son Prince Munwang to pay court.',
  },
  s0430: {
    literal:
      'That year Queen Jinseondeok of Silla died; an envoy was sent to install her sister Jindeok as king of Silla.',
    idiomatic:
      'That year Queen Jinseondeok of Silla died; the court sent envoys to enthrone her sister Jindeok as ruler of Silla.',
  },
  s0431: {
    literal:
      'In the twenty-third year of Zhenguan, in the twenty-third year, spring, first month, on xinhai, the captive Kucha king Helibushibi and his minister Nali and others were presented at the state temple.',
    idiomatic:
      'In the twenty-third year of Zhenguan, on xinhai of the first spring month, King Helibushibi of Kucha and his minister Nali, already prisoners, were offered at the state temple.',
  },
  s0432: {
    literal:
      'On bingxu of the second month the Yaozhou Protectorate was established, subordinate to the Anxi Protectorate.',
    idiomatic:
      'On bingxu in the second month the Yaozhou Protectorate was created under Anxi.',
  },
  s0433: {
    literal:
      'On dinghai the Western Turk khan Siyehu sent envoys to court.',
    idiomatic:
      'On dinghai Khan Siyehu of the Western Turks sent envoys to court.',
  },
  s0434: {
    literal: 'On bingchen of the third month the Fengzhou Protectorate was established.',
    idiomatic: 'On bingchen in the third month the Fengzhou Protectorate was established.',
  },
  s0435: {
    literal:
      'From the previous winter there had been no rain; only on jiwei of this month did rain fall.',
    idiomatic:
      'Rain had failed since the previous winter; not until jiwei of this month did the sky break.',
  },
  s0436: {
    literal: 'On xinyou there was a general amnesty.',
    idiomatic: 'On xinyou he proclaimed a general amnesty.',
  },
  s0437: {
    literal:
      'On dingmao the crown prince was ordered to hear government at the Golden Liquid Gate.',
    idiomatic:
      'On dingmao he commanded the crown prince to conduct affairs at the Golden Liquid Gate.',
  },
  s0438: {
    literal: 'That month the sun was dull and without radiance.',
    idiomatic: 'That month the sun burned red but cast no light.',
  },
  s0439: {
    literal: 'On jihai of the fourth month he visited Cuiwei Palace.',
    idiomatic: 'On jihai in the fourth month he went to Cuiwei Palace.',
  },
  s0440: {
    literal:
      'On wuwu of the fifth month, Crown Prince Tutor, Duke of England Li Ji was made Governor of Diezhou.',
    idiomatic:
      'On wuwu in the fifth month Li Ji, crown prince tutor and Duke of England, was made governor of Diezhou.',
  },
  s0441: {
    literal:
      'On xinyou Senior Grand Master, Duke of Wei Li Jing died.',
    idiomatic: 'On xinyou Li Jing, Senior Grand Master and Duke of Wei, died.',
  },
  s0442: {
    literal:
      'On jisi the emperor died in Hanfeng Hall at the age of fifty-two.',
    idiomatic:
      'On jisi the emperor died in Hanfeng Hall. He was fifty-two.',
  },
  s0443: {
    literal:
      'His testament ordered the crown prince to succeed before the bier; mourning rites were to follow Han custom.',
    idiomatic:
      'His dying edict named the crown prince to take the throne before the coffin and directed that mourning follow Han usage.',
  },
  s0444: {
    literal: 'The death was kept secret and no mourning was announced.',
    idiomatic: 'The court concealed his death.',
  },
  s0445: {
    literal:
      'On gengwu he sent veteran generals at the head of Flying Cavalry and picked troops to escort the crown prince back to the capital first; four thousand armored men of the six metropolitan offices were mobilized and posted along the road and at Anhua Gate, and only then did he enter under their wing;',
    idiomatic:
      'On gengwu he sent old commanders with Flying Cavalry and crack troops to bring the crown prince back to the capital ahead of the procession; four thousand armored men from the six metropolitan offices lined the road and Anhua Gate, and only under their escort did the heir enter;',
  },
  s0446: {
    literal:
      'the late emperor\'s carriage and outriders went as on ordinary days, and attendants served as usual.',
    idiomatic:
      'the imperial carriage and its escort moved as on any other day, and the household staff kept their usual round.',
  },
  s0447: {
    literal: 'On renshen mourning was announced.',
    idiomatic: 'On renshen the death was made public.',
  },
  s0448: {
    literal:
      'On the first day of the sixth month, jiaxu, the coffin lay in state in Taiji Hall.',
    idiomatic:
      'On jiaxu, the first day of the sixth month, the coffin was set out in Taiji Hall.',
  },
  s0449: {
    literal:
      'On bingzi of the eighth month the officials proposed the posthumous title Emperor Wen; his temple name was Taizong.',
    idiomatic:
      'On bingzi in the eighth month the ministers offered the posthumous title Emperor Wen and the temple name Taizong.',
  },
  s0450: {
    literal: 'On gengyin he was buried at Zhaoling.',
    idiomatic: 'On gengyin he was interred at Zhaoling.',
  },
  s0451: {
    literal:
      'In the eighth month of the first year of Shangyuan his elevated honorific was changed to Martial-Sage Emperor.',
    idiomatic:
      'In the eighth month of Shangyuan 1 his elevated title became Martial-Sage Emperor.',
  },
  s0452: {
    literal:
      'In the second month of the thirteenth year of Tianbao his elevated honorific was changed to Martial Great Sage, Greatly Broad and Filial Emperor.',
    idiomatic:
      'In the second month of Tianbao 13 his honorific was raised to Martial Great Sage, Greatly Broad and Filial Emperor.',
  },
  s0453: {
    literal:
      '[Historian\'s appraisal] The historian says: I observe that in his rise Emperor Wen showed many strange turns of fortune and was brilliantly wise and divinely martial.',
    idiomatic:
      '[Historian\'s appraisal] The historian writes: In his rise Emperor Wen met fortune at every odd turn; his mind was bright and his war-craft godlike.',
  },
  s0454: {
    literal:
      'In raising men he did not favor his faction; in burdening them with tasks he used all their talent to the full.',
    idiomatic:
      'He chose men without party favor and set each to the work that fit his gift.',
  },
  s0455: {
    literal:
      'Hence Qu Tu and Yuchi, though once enemies, came to offer him their hearts and sinews;',
    idiomatic:
      'So Qu Tu and Yuchi, once his foes, gave him heart and arm;',
  },
  s0456: {
    literal:
      'Ma Zhou and Liu Ji, though at first remote from him, in the end were entrusted with the scales of power.',
    idiomatic:
      'Ma Zhou and Liu Ji, strangers at first, ended holding the balances of state.',
  },
  s0457: {
    literal: 'In the end he settled the heavenly stairs—surely by this path.',
    idiomatic: 'At last the realm stood level under heaven, and by this road alone.',
  },
  s0458: {
    literal:
      'I once tried to reason about it: when the foundation is damp the clouds rise; when insects stir the locusts leap.',
    idiomatic:
      'Consider this: damp the footings and clouds gather; stir the soil and the locusts leap.',
  },
  s0459: {
    literal:
      'Though Yao and Shun were sages, they could not govern in peace while employing Taowu and Qiongqi;',
    idiomatic:
      'Yao and Shun were sages, yet they could not rule in peace with Taowu and Qiongqi at court;',
  },
  s0460: {
    literal:
      'though Yi Yin and Lü Shang were worthies, they could not make Xia Jie and Yin Xin flourish.',
    idiomatic:
      'Yi Yin and Lü Wang were worthies, yet they could not save Jie of Xia or Xin of Yin.',
  },
  s0461: {
    literal:
      'Between lord and minister, to meet such difficulty is hard; it can go as far as gouging out eyes and cutting out hearts, worms crawling through sinews pulled taut—truly because the times they meet differ.',
    idiomatic:
      'Between ruler and minister the meeting is perilous, even to eyes torn out and hearts laid open, sinews drawn till worms crawl the wound—such is the difference of the hour.',
  },
  s0462: {
    literal:
      'Fang and Wei in wisdom did not surpass Confucius and Mencius, yet they could honor their lord and shelter the people—because the time served them.',
    idiomatic:
      'Fang and Wei were no wiser than Confucius or Mencius, yet they upheld their sovereign and shielded the people—because the age asked it of them.',
  },
  s0463: {
    literal:
      'Someone asked: If Taizong was so worthy, why did he lose the love of his brothers and fail in teaching his sons?',
    idiomatic:
      'Some ask: Taizong was so able—why did he lose his brothers\' love and fail with his sons?',
  },
  s0464: {
    literal:
      'He said: So it is. Shun could not make the Four Criminals humane; Yao could not instruct Danzhu—so the old records run.',
    idiomatic:
      'The answer is: So it is. Shun could not humanize the Four Criminals; Yao could not school Danzhu—the ancients said as much.',
  },
  s0465: {
    literal:
      'In the years when Shenyao trusted slander and Jiancheng envied merit, if one merely removed what he feared, who would spare a thought for the realm splitting apart? When disaster rose there was no room between heartbeats; he first dreaded the calamity of "destroying the nest," how could he yet worry the tale of "a foot of cloth"?',
    idiomatic:
      'When Gaozu heeded slander and Jiancheng grudged his merit, to cut off fear was all; who had leisure for the realm\'s cracking apart? Crisis allowed no breath between beats—he feared first the nest torn down, not yet the ballad of brothers measuring cloth.',
  },
  s0466: {
    literal:
      'Chengqian\'s folly—even a sage father could not move it.',
    idiomatic:
      'Chengqian\'s dullness not even a sage father could shift.',
  },
  s0467: {
    literal:
      'Had Emperor Wen himself fixed the succession on a wise heir and not let his will run to Goguryeo;',
    idiomatic:
      'Had Taizong named a wise heir early and not poured his will into Goguryeo;',
  },
  s0468: {
    literal:
      'had he employed men as in the opening of Zhenguan and taken remonstrance as in the days of Wei Zheng—',
    idiomatic:
      'had he used men as at Zhenguan\'s dawn and heard remonstrance as in Wei Zheng\'s day—',
  },
  s0469: {
    literal:
      'to say nothing of the hereditary reigns of King Fa and King Cheng of Zhou, in which we still left something to be desired;',
    idiomatic:
      'and even beside the hereditary peace of Fa and Cheng of Zhou, we would still have had faults to mend;',
  },
  s0470: {
    literal:
      'compared with the breadth of Han Wendi and Han Wudi, they would more often have had cause for shame.',
    idiomatic:
      'set against the scope of Han Wen and Han Wu, they would more often blush for their deeds.',
  },
  s0471: {
    literal:
      'Trace his judgments, never confused; his yielding to good counsel, swift as a stream—worthy of praise for a thousand years, a man alone!',
    idiomatic:
      'Yet trace how clear he was in judgment, how swift to follow what was right—a name for a thousand years, one man alone!',
  },
  s0472: {
    literal: '[Eulogy] The eulogy says: Chang and Fa opened the state; one house, three sages.',
    idiomatic: '[Eulogy] The eulogy says: Chang and Fa founded the line; one clan, three holy kings.',
  },
  s0473: {
    literal:
      'Wen fixed the high seat; brotherly love was not well kept.',
    idiomatic:
      'Wen secured the throne; brotherhood was not kept whole.',
  },
  s0474: {
    literal:
      'Once Guan and Cai were put to death, Cheng and Kang walked the straight Way.',
    idiomatic:
      'Guan and Cai fell; then Cheng and Kang held the true path.',
  },
  s0475: {
    literal: 'The wind of Zhenguan—still sung to this day.',
    idiomatic: 'The Zhenguan wind—men still sing it now.',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/003.json';
const TRANS_PATH = 'translations/current_translation_jiutangshu.json';
const START = 401;
const END = 475;

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
if (trans.metadata.chapter !== '003') {
  throw new Error(`Expected chapter 003, got ${trans.metadata.chapter}`);
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
console.log(`Applied ${applied} translations (s0401–s0475)`);
