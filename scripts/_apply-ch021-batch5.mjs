#!/usr/bin/env node
/** Batch 5: s0401–s0500 (Jiutangshu ch.021, ritual/music treatise) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/021.json';
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
    literal: 'Jiazi is only the head of the six decad cycles; within one year it is regularly met in alternate months, is not a great assembly, and the gnomon\'s revolution is not complete—only by totaling the days of the six jia does it aid the four seasons to complete the year.',
    idiomatic: 'Jiazi is only the head of the six decad cycles; within a year it appears in alternate months, is no great assembly, and the sundial\'s cycle is incomplete—only by totaling the six jia days does it help the four seasons make a year.',
  },
  s0402: {
    literal: 'Now wishing to avoid the full cycle to take jiazi is turning one\'s back on great auspice to seek small auspice.',
    idiomatic: 'To avoid the full cycle and seize jiazi is to forsake great auspice for a lesser one.',
  },
  s0403: {
    literal: '" The Grand Astrologer Fu Xiaozhong memorialized: "Per the Classic of Clepsydra Graduations, south land and north land on the same day are checked one fen; if one uses the twelfth day, one fen is short.',
    idiomatic: '" Grand Astrologer Fu Xiaozhong memorialized: "Per the Classic of Clepsydra Graduations, south and north lands are checked one fen on the same day; using the twelfth day falls one fen short.',
  },
  s0404: {
    literal: 'If the south pole is not reached, it cannot count as the solstice.',
    idiomatic: 'Without reaching the south pole, it cannot count as the solstice.',
  },
  s0405: {
    literal: '" The emperor said: "As the folk proverb says, \'The winter solstice is longer than the year\'—this too cannot be changed.',
    idiomatic: '" The emperor said: "As the proverb runs, \'The winter solstice is longer than the year\'—that too cannot be changed.',
  },
  s0406: {
    literal: '" In the end they followed Shao\'s proposal and on the thirteenth day, yichou, sacrificed at the round mound.',
    idiomatic: '" They finally followed Shao\'s proposal and sacrificed at the round mound on the thirteenth day, yichou.',
  },
  s0407: {
    literal: 'In the first month of the first year of Taiji under Ruizong, when they were first to perform the southern suburb rites, the responsible offices established the proposal to sacrifice only to August Heaven High God and not set a seat for August Earth Spirit.',
    idiomatic: 'In Ruizong\'s Taiji year 1, first month, as the southern suburb rites were first planned, the offices proposed sacrificing only to August Heaven High God without a seat for August Earth Spirit.',
  },
  s0408: {
    literal: 'Remonstrance Counselor Jia Zeng submitted a memorial, saying:',
    idiomatic: 'Remonstrance Counselor Jia Zeng submitted a memorial:',
  },
  s0409: {
    literal: 'Your humble servant has examined the canonical rites in detail and holds that Heaven and Earth should be sacrificed together.',
    idiomatic: 'Your servant has examined the canonical rites and holds that Heaven and Earth ought to be sacrificed together.',
  },
  s0410: {
    literal: 'Respectfully per the Record of Rites on Sacrifice: "Youyu di at the di to Huangdi and at the jiao to Ku; Xia hou di at the di to Huangdi and at the jiao to Gun."',
    idiomatic: 'Per the Record of Rites on Sacrifice: "Youyu performed di to Huangdi and jiao to Ku; Xia performed di to Huangdi and jiao to Gun."',
  },
  s0411: {
    literal: '" The tradition says: a great sacrifice is called di.',
    idiomatic: '" Tradition says a great sacrifice is called di.',
  },
  s0412: {
    literal: 'Thus both the suburb and the temple have di sacrifices.',
    idiomatic: 'Thus suburb and temple alike have di sacrifices.',
  },
  s0413: {
    literal: 'At di in the temple, the lords of the ancestors are all united in the Grand Ancestor\'s temple;',
    idiomatic: 'Di at the temple unites the ancestral lords in the Grand Ancestor\'s temple;',
  },
  s0414: {
    literal: 'at di at the suburb, Earth Spirits and the host of wang are all united at the round mound, with the founding ancestor as consort.',
    idiomatic: 'di at the suburb unites Earth Spirits and the host of wang at the round mound, with the founding ancestor as consort.',
  },
  s0415: {
    literal: 'all are great sacrifices with special intent, differing from ordinary sacrifices.',
    idiomatic: 'all are solemn great sacrifices, distinct from ordinary rites.',
  },
  s0416: {
    literal: 'The Great Tradition of Rites says: "One who is not king does not perform di."',
    idiomatic: 'The Great Tradition says: "One who is not king does not perform di."',
  },
  s0417: {
    literal: 'Thus one knows that when a king receives the Mandate he must perform the di rite.',
    idiomatic: 'Thus when a king receives the Mandate he must perform di.',
  },
  s0418: {
    literal: 'The Book of Yu says: "On the first day of the first month, Shun arrived at the Literary Ancestor; he then classified sacrifice to High God, presented to the Six Ancestors, wang at mountains and rivers, and pervaded the host of spirits."',
    idiomatic: 'The Book of Yu says: "On the first day of the first month Shun arrived at the Literary Ancestor; he classified sacrifice to High God, presented to the Six Ancestors, wang at mountains and rivers, and reached the host of spirits."',
  },
  s0419: {
    literal: '" This is performing the di rite upon receiving the Mandate.',
    idiomatic: '" This is performing di upon receiving the Mandate.',
  },
  s0420: {
    literal: 'When it says "arrived at the Literary Ancestor," the rest of the temples\' offerings can be known.',
    idiomatic: 'Saying "arrived at the Literary Ancestor" shows what the other temple offerings were.',
  },
  s0421: {
    literal: 'When it says "classified to High God," the union of Earth Spirits can be known.',
    idiomatic: 'Saying "classified to High God" shows Earth Spirits were included.',
  },
  s0422: {
    literal: 'Moreover sacrifices to mountains and rivers all belong to Earth; if the host of wang are still pervaded, how much more Earth Spirits!',
    idiomatic: 'Sacrifices to mountains and rivers belong to Earth; if the host of wang are still fully included, how much more Earth Spirits!',
  },
  s0423: {
    literal: 'The Offices of Zhou: "With the six lü, six lü, five tones, eight sounds, and six dances, greatly harmonize music to reach the spirits, harmonize the states, and harmonize the myriad people."',
    idiomatic: 'The Offices of Zhou: "With six lü, six lü, five tones, eight sounds, and six dances, greatly harmonize music to reach the spirits, harmonize the states, and harmonize the people."',
  },
  s0424: {
    literal: '" Moreover, "Of all six musics, six transformations bring forth images, things, and the Heavenly Spirit"—this is the music of di at the suburb uniting Heavenly Spirit, Earth Spirits, and human ghosts in sacrifice.',
    idiomatic: '" Moreover, "Of the six musics, six transformations bring forth images, things, and the Heavenly Spirit"—the music of di at the suburb, uniting Heaven, Earth, and the human dead in one sacrifice.',
  },
  s0425: {
    literal: 'Han round-mound rites in Old Matters of the Three Metropolises: August Heaven High God\'s seat faced due south; Queen Earth\'s seat-plot also faced south but slightly east.',
    idiomatic: 'Han round-mound rites per Old Matters of the Three Metropolises: August Heaven High God faced south; Queen Earth\'s plot also faced south, slightly east.',
  },
  s0426: {
    literal: 'The Eastern Pavilion Han Record also says: "When Guangwu took the throne he built an altar on the sunny slope at Hao, sacrificing to announce to Heaven and Earth, adopting Yuan Shi precedents."',
    idiomatic: 'The Eastern Pavilion Han Record says: "When Guangwu took the throne he built an altar on Hao\'s sunny slope to announce sacrifice to Heaven and Earth, following Yuan Shi precedent."',
  },
  s0427: {
    literal: 'In the second year, first month, south of Luoyang he modeled Hao as a round altar; Heaven and Earth seats were upon it, all facing south and west above.',
    idiomatic: 'In year 2, first month, south of Luoyang he built a round altar modeled on Hao; Heaven and Earth seats stood upon it, all facing south with west above.',
  },
  s0428: {
    literal: '" Examining the two Han eras, they had their own Queen Earth and northern suburb sacrifices, yet here Earth seats were already set at the round mound—clearly the rite of di sacrifice.',
    idiomatic: '" Though the two Han had separate Queen Earth and northern suburb rites, Earth seats were already at the round mound—clearly a di rite.',
  },
  s0429: {
    literal: 'The Spring and Autumn Explanations also say: "A king in one year has seven sacrifices; Heaven and Earth eat together at the four meng, separate at equinox and solstice."',
    idiomatic: 'The Spring and Autumn Explanations say: "A king has seven sacrifices a year; Heaven and Earth feast together at the four meng, separately at equinox and solstice."',
  },
  s0430: {
    literal: '" This again shows Heaven and Earth themselves often share sacrifice.',
    idiomatic: '" This again shows Heaven and Earth commonly shared sacrifice.',
  },
  s0431: {
    literal: 'Wang Su said: "Confucius said to locate the round mound at the southern suburb—the southern suburb is the round mound, the round mound is the southern suburb."',
    idiomatic: 'Wang Su said: "Confucius said to locate the round mound at the southern suburb—southern suburb is round mound, round mound is southern suburb."',
  },
  s0432: {
    literal: '" He also said: "Sacrifice Heaven and Earth with consorts."',
    idiomatic: '" He also said Heaven and Earth are sacrificed with consorts."',
  },
  s0433: {
    literal: '" This too is clear proof of combined suburb sacrifice.',
    idiomatic: '" This too clearly proves combined suburb sacrifice.',
  },
  s0434: {
    literal: 'Only Zheng Xuan did not discuss di as combined sacrifice but divided August Heaven High God into two spirits, relying solely on weft texts—matters not seen in the classics.',
    idiomatic: 'Only Zheng Xuan denied di as combined sacrifice, split August Heaven High God into two spirits, and relied on weft texts—not on the classics.',
  },
  s0435: {
    literal: 'Moreover his comment on the Great Tradition\'s "not cycling, not di" says: "At the head of the correct year, sacrifice the essence of the Felt Emperor, with one\'s ancestor as consort."',
    idiomatic: 'His gloss on "not cycling, not di" says: "At the correct year\'s head, sacrifice the Felt Emperor\'s essence with one\'s ancestor as consort."',
  },
  s0436: {
    literal: '" Commenting on the Grand Music Master of the Offices of Zhou on the round mound, he cites the Great Tradition\'s di as the winter-solstice sacrifice.',
    idiomatic: 'Commenting on the round mound in the Grand Music Master chapter, he cites the Great Tradition\'s di as the winter-solstice rite.',
  },
  s0437: {
    literal: 'Mutually contradicting in succession, it is not sufficient to rely on.',
    idiomatic: 'These contradict one another and cannot be relied on.',
  },
  s0438: {
    literal: 'Bowing low: Your Majesty has received the tally and dwells in honor, continuing culture upon the calendar; since personally attending the imperial pole you have not yourself performed suburb sacrifice.',
    idiomatic: 'Your Majesty has received the Mandate and sits in honor, continuing culture on the calendar; since taking the throne you have not performed suburb sacrifice in person.',
  },
  s0439: {
    literal: 'Today\'s southern suburb is exactly the di rite; it is right to sacrifice Heaven and Earth together, extend rank to the hundred spirits, answer the tally of receiving the Mandate, and display the way of reverent respect.',
    idiomatic: 'Today\'s southern suburb is properly di; Heaven and Earth should be sacrificed together, the hundred spirits ranked, the Mandate answered, and reverence displayed.',
  },
  s0440: {
    literal: 'How can one not exalt the full rite, treat it like an ordinary suburb, leave Earth Spirits without a seat, and not follow di offering!',
    idiomatic: 'How can the full rite not be exalted, Earth Spirits left without seats, and di offering withheld like an ordinary suburb!',
  },
  s0441: {
    literal: 'Now I request fully setting August Earth Spirit and attendant sacrifice seats—then the rite can examine antiquity and the meaning fits human feeling.',
    idiomatic: 'I request seats for August Earth Spirit and attendants—then the rite matches antiquity and accords with feeling.',
  },
  s0442: {
    literal: 'Yet suburb and mound sacrifice is a great affair of state; if feeling is lost, the refined offering will be wanting.',
    idiomatic: 'Yet suburb and mound sacrifice is a state great affair; if feeling is wrong, the refined offering fails.',
  },
  s0443: {
    literal: 'Your servant\'s art does not penetrate the classics, his learning shames the broadly ancient—only because he once erred in ritual office and now disgraces the remonstrance bureau, whose charge is upright discussion, does he dare state loyal counsel.',
    idiomatic: 'Your servant\'s learning does not penetrate the classics and shames the ancients—having once erred in ritual office and now holding remonstrance, he dares offer loyal counsel.',
  },
  s0444: {
    literal: 'If anything may be adopted, let it be decided by sagely deliberation alone.',
    idiomatic: 'If anything here may be adopted, let sagely deliberation decide.',
  },
  s0445: {
    literal: 'An order directed the chief ministers to summon ritual officers to discuss in detail whether it was feasible.',
    idiomatic: 'An order directed the chief ministers to summon ritual officers to discuss feasibility.',
  },
  s0446: {
    literal: 'Ritual officers—the National University Rector Chu Wuliang, Vice-Rector Guo Shanyun, and others—all requested following Zeng\'s memorial.',
    idiomatic: 'Ritual officers—National University Rector Chu Wuliang, Vice-Rector Guo Shanyun, and others—all asked to follow Zeng\'s memorial.',
  },
  s0447: {
    literal: 'At that time they were again about to perform the northern suburb in person, and in the end Zeng\'s memorial was shelved.',
    idiomatic: 'They were again about to perform the northern suburb in person, and Zeng\'s memorial was shelved.',
  },
  s0448: {
    literal: 'When Xuanzong took the throne, in the eleventh month of Kaiyuan 11 he personally performed the round mound.',
    idiomatic: 'When Xuanzong took the throne, in Kaiyuan 11, eleventh month, he personally performed the round mound.',
  },
  s0449: {
    literal: 'At that time Chief Councilor Zhang Yue was ritual commissioner and Vice Director of the Court of Imperial Sacrifices Wei Tao deputy; Yue proposed using Founding Emperor Shenyao as consort sacrifice and began abolishing the rite of three ancestors as joint consorts.',
    idiomatic: 'Chief Councilor Zhang Yue was ritual commissioner and Court of Imperial Sacrifices Vice Director Wei Tao deputy; Yue proposed Founding Emperor Shenyao as consort and abolished three-ancestor joint consortship.',
  },
  s0450: {
    literal: 'By the twentieth year Xiao Song was chief councilor and revised and compiled new rites.',
    idiomatic: 'By year 20 Xiao Song was chief councilor and compiled new rites.',
  },
  s0451: {
    literal: 'Sacrifices to Heaven in one year were four; sacrifices to Earth, two.',
    idiomatic: 'Heaven was sacrificed four times a year; Earth, twice.',
  },
  s0452: {
    literal: 'At the winter solstice August Heaven High God was sacrificed at the round mound, with Founding Emperor Shenyao as consort; inner officials were increased to 159 seats, outer officials reduced to 104.',
    idiomatic: 'At the winter solstice August Heaven High God was sacrificed at the round mound with Founding Emperor Shenyao as consort; inner officials rose to 159 seats, outer to 104.',
  },
  s0453: {
    literal: 'For August Heaven High God and the two consort seats, each seat used twelve bian and dou, one each of gui, fu, jia, and zuo.',
    idiomatic: 'For High God and the two consort seats, each used twelve bian and dou and one each of gui, fu, jia, and zuo.',
  },
  s0454: {
    literal: 'For High God: great zun, zhuo zun, xi zun, elephant zun, and hu zun two each; mountain lei six.',
    idiomatic: 'For High God: two each of great, zhuo, xi, elephant, and hu zun; six mountain lei.',
  },
  s0455: {
    literal: 'For the consort seat no great zun or hu zun were set; four mountain lei were reduced; the rest matched High God.',
    idiomatic: 'The consort seat omitted great and hu zun, reduced mountain lei by four; the rest matched High God.',
  },
  s0456: {
    literal: 'Five Directional Emperor seats had ten bian and dou each, one each of gui, fu, jia, and zuo, and two great zun.',
    idiomatic: 'Five Directional Emperor seats had ten bian and dou, one each of gui, fu, jia, and zuo, and two great zun.',
  },
  s0457: {
    literal: 'Great Bright and Night Bright had eight bian and dou each; the rest matched the Five Directional Emperors.',
    idiomatic: 'Great Bright and Night Bright used eight bian and dou each; all else matched the Five Directional Emperors.',
  },
  s0458: {
    literal: 'Each inner official seat had two bian and dou, one gui and one zuo.',
    idiomatic: 'Each inner-official seat had two bian and dou, one gui and one zuo.',
  },
  s0459: {
    literal: 'Above inner officials, zun were set between the twelve steps.',
    idiomatic: 'Above inner officials, zun were set among the twelve steps.',
  },
  s0460: {
    literal: 'Between each inner-official aisle two zhuo zun; middle officials two xi zun; outer officials two zhuo zun; host of stars two hu zun.',
    idiomatic: 'Each inner aisle had two zhuo zun; middle officials two xi zun; outer officials two zhuo zun; host of stars two hu zun.',
  },
  s0461: {
    literal: 'On the upper xin day of the first month, prayer for grain: August Heaven High God was sacrificed at the round mound with the Founder as consort; Five Directional Emperors attended.',
    idiomatic: 'On the first month\'s upper xin, for grain prayer High God was sacrificed at the round mound with the Founder as consort; Five Directional Emperors attended.',
  },
  s0462: {
    literal: 'For High God and consort, bian and dou matched the winter-solstice count.',
    idiomatic: 'High God and consort used the same bian and dou as at the winter solstice.',
  },
  s0463: {
    literal: 'Five Directional Emperors: one each of great, zhuo, xi zun and mountain lei; bian, dou, and the rest also matched winter solstice.',
    idiomatic: 'Five Directional Emperors: one each of great, zhuo, xi zun and mountain lei; bian, dou, and the rest matched winter solstice.',
  },
  s0464: {
    literal: 'In the first month of summer, rain prayer to High God Above Heaven at the round mound, with Taizong as consort; Five Directional Emperors and Taihao and the five emperors, Gou Mang and the five officials attended.',
    idiomatic: 'In early summer, rain prayer to High God Above Heaven at the round mound with Taizong as consort; Five Directional Emperors, Taihao and the five emperors, Gou Mang and the five officials attended.',
  },
  s0465: {
    literal: 'For High God, consort, and Five Directional Emperors: eight bian and dou each, one each of gui, fu, jia, and zuo.',
    idiomatic: 'High God, consort, and Five Directional Emperors: eight bian and dou, one each of gui, fu, jia, and zuo.',
  },
  s0466: {
    literal: 'Each of the five officials\' seats had two bian and dou, one gui, one fu, and one zuo.',
    idiomatic: 'Each five-official seat had two bian and dou, one gui, one fu, and one zuo.',
  },
  s0467: {
    literal: 'In late autumn, great offering at the Bright Hall: August Heaven High God was sacrificed with Ruizong as consort; Five Directional Emperors, Five Human Emperors, and five officials attended.',
    idiomatic: 'In late autumn, great offering at the Bright Hall: High God with Ruizong as consort; Five Directional Emperors, Five Human Emperors, and five officials attended.',
  },
  s0468: {
    literal: 'The count of bian and dou matched the rain-sacrifice rite.',
    idiomatic: 'Bian and dou matched the rain-sacrifice rite.',
  },
  s0469: {
    literal: 'At the summer solstice August Earth Spirit was honored at the square mound with the Founder as consort; attendant sacrifice from Spirit State downward numbered 68 seats, as in the Zhenguan rite.',
    idiomatic: 'At the summer solstice Earth Spirit was honored at the square mound with the Founder as consort; 68 attendant seats from Spirit State down, as in Zhenguan.',
  },
  s0470: {
    literal: 'Earth Spirit and consort: bian and dou as at the round mound.',
    idiomatic: 'Earth Spirit and consort used the round-mound bian and dou count.',
  },
  s0471: {
    literal: 'Spirit State: four bian and dou each, one each of gui, fu, jia, and zuo.',
    idiomatic: 'Spirit State: four bian and dou, one each of gui, fu, jia, and zuo.',
  },
  s0472: {
    literal: 'Five Marchmounts, four garrisons, four seas, four streams, five directions, mountains, forests, rivers, and marshes—37 seats—each had two bian and dou, one gui and one fu.',
    idiomatic: 'Five marchmounts, four garrisons, four seas, four streams, five directions, mountains, forests, rivers, and marshes—37 seats—each had two bian and dou, one gui and one fu.',
  },
  s0473: {
    literal: 'Five Directional Emperors, hills, mounds, embankments, plains, and lowlands—30 seats—one each of bian, dou, gui, fu, jia, and zuo.',
    idiomatic: 'Five Directional Emperors, hills, mounds, dykes, plains, and lowlands—30 seats—one each of bian, dou, gui, fu, jia, and zuo.',
  },
  s0474: {
    literal: 'At the start of winter Spirit State was sacrificed at the northern suburb, with Taizong as consort.',
    idiomatic: 'At winter\'s start Spirit State was sacrificed at the northern suburb with Taizong as consort.',
  },
  s0475: {
    literal: 'The two seats had twelve bian and dou each, one each of gui, fu, jia, and zuo.',
    idiomatic: 'The two seats had twelve bian and dou, one each of gui, fu, jia, and zuo.',
  },
  s0476: {
    literal: 'From winter-solstice round mound downward, the rest matched the Zhenguan rite.',
    idiomatic: 'From winter-solstice round mound down, the rest matched Zhenguan.',
  },
  s0477: {
    literal: 'At that time Attendant of the Palace Secretariat Wang Zhongqiu, who also directed compilation, further proposed:',
    idiomatic: 'Attendant Wang Zhongqiu, who directed compilation, further proposed:',
  },
  s0478: {
    literal: 'Per the Zhenguan Rites, on the first month\'s upper xin the Felt Emperor was sacrificed at the southern suburb; per the Xianqing Rites, August Heaven High God was sacrificed at the round mound for grain prayer.',
    idiomatic: 'The Zhenguan Rites sacrifice the Felt Emperor at the southern suburb on the first month\'s upper xin; the Xianqing Rites sacrifice High God at the round mound for grain prayer.',
  },
  s0479: {
    literal: 'The Zuo Tradition says: "Suburb sacrifice, then plowing."',
    idiomatic: 'The Zuo Tradition: suburb sacrifice, then plowing.',
  },
  s0480: {
    literal: 'The Odes say: "Yi Xi—spring and summer grain prayer to High God."',
    idiomatic: 'The Odes: "Yi Xi—spring and summer grain prayer to High God."',
  },
  s0481: {
    literal: 'The Record of Rites also says: "On upper xin, grain prayer to High God."',
    idiomatic: 'The Record of Rites: on upper xin, grain prayer to High God.',
  },
  s0482: {
    literal: 'Thus the text of grain prayer is transmitted through the dynasties, and the title High God properly belongs to August Heaven.',
    idiomatic: 'Grain-prayer texts run through the dynasties, and the title High God properly belongs to August Heaven.',
  },
  s0483: {
    literal: 'Yet Zheng Xuan said: "Heaven\'s Five Emperors in turn receive kingship; when a king rises he must feel one of them; according to which he felt, sacrifice and honor it separately."',
    idiomatic: 'Yet Zheng Xuan said: "Heaven\'s Five Emperors receive kingship in turn; a rising king feels one of them and sacrifices that one separately."',
  },
  s0484: {
    literal: 'Therefore in the first month of summer sacrifice is made to the emperor one was born from at the southern suburb, with one\'s ancestor as consort.',
    idiomatic: 'So in summer\'s first month one sacrifices at the southern suburb to the emperor one was born from, with one\'s ancestor as consort.',
  },
  s0485: {
    literal: 'Thus Zhou sacrificed to Lingwei Yang with Hou Ji as consort, thereby grain prayer.',
    idiomatic: 'Zhou sacrificed to Lingwei Yang with Hou Ji as consort, calling it grain prayer.',
  },
  s0486: {
    literal: '" According to the intent of sacrificing the Felt Emperor he described, it was originally not grain prayer.',
    idiomatic: '" Sacrificing the Felt Emperor as he described was never grain prayer.',
  },
  s0487: {
    literal: 'What former scholars said is probably hard to rely on.',
    idiomatic: 'Former scholars\' views are hard to rely on.',
  },
  s0488: {
    literal: 'Now for the grain-prayer rite, I request following the rites in repair.',
    idiomatic: 'I ask that grain prayer follow the canonical rites.',
  },
  s0489: {
    literal: 'Moreover sacrifice to the Felt Emperor has long been practiced.',
    idiomatic: 'Sacrifice to the Felt Emperor has long been practiced.',
  },
  s0490: {
    literal: 'The Record says: "Where there is an established practice, none may abolish it."',
    idiomatic: 'The Record says: "Where a practice exists, it may not be abolished."',
  },
  s0491: {
    literal: '" I request at the grain-prayer altar to sacrifice pervasively to the Five Directional Emperors.',
    idiomatic: '" I ask that the grain-prayer altar also sacrifice to all Five Directional Emperors.',
  },
  s0492: {
    literal: 'The Five Emperors are the essences of the Five Phases.',
    idiomatic: 'The Five Emperors embody the essences of the Five Phases.',
  },
  s0493: {
    literal: 'The Five Phases are the patron of the nine grains.',
    idiomatic: 'The Five Phases are patron of the nine grains.',
  },
  s0494: {
    literal: 'Now I request both rites practiced together, all six spirits fully sacrificed.',
    idiomatic: 'I ask both rites run together so all six spirits are sacrificed.',
  },
  s0495: {
    literal: 'Moreover per the Zhenguan Rites, in early summer rain sacrifice the Five Directional High Gods, Five Human Emperors, and five officials at the southern suburb; per the Xianqing Rites, rain sacrifice to August Heaven High God at the round mound.',
    idiomatic: 'The Zhenguan Rites rain-sacrifice Five Directional High Gods, Five Human Emperors, and five officials at the southern suburb in early summer; the Xianqing Rites sacrifice High God at the round mound.',
  },
  s0496: {
    literal: 'Moreover rain sacrifice to High God is broadly to pray sweet rain for the hundred grains.',
    idiomatic: 'Rain sacrifice to High God prays sweet rain for the crops.',
  },
  s0497: {
    literal: 'Thus the Monthly Ordinances say: "Order the officers to great rain prayer to the Emperor, using splendid music, to pray for full grain."',
    idiomatic: 'The Monthly Ordinances say: "Order officers to great rain prayer to the Emperor with splendid music, to pray for full grain."',
  },
  s0498: {
    literal: '" Zheng Xuan said: "Rain prayer to High God is Heaven\'s other title, properly August Heaven; sacrifice at the round mound honors Heaven\'s position."',
    idiomatic: '" Zheng Xuan said: "Rain prayer to High God uses Heaven\'s other title—August Heaven; the round mound honors Heaven\'s position."',
  },
  s0499: {
    literal: '" Yet rain sacrifice to the Five Emperors has also been long practiced; I also request both rites together to complete the meaning of great rain prayer to the Emperor.',
    idiomatic: '" Rain sacrifice to the Five Emperors is also ancient; I ask both rites together to complete great rain prayer to the Emperor.',
  },
  s0500: {
    literal: 'Moreover the Zhenguan Rites in late autumn sacrifice the Five Directional Emperors and five officials at the Bright Hall; the Xianqing Rites honor August Heaven High God at the Bright Hall.',
    idiomatic: 'The Zhenguan Rites sacrifice Five Directional Emperors and five officials at the Bright Hall in late autumn; the Xianqing Rites honor High God there.',
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
if (data.metadata.chapter !== '021') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 021; standalone T ready (${Object.keys(T).length} entries).`
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
