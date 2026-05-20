#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Jiutangshu ch.029, Rites 5 / court music) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/029.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 101;
const END = 200;

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
  s0101: {
    literal: 'The Han called them the Three Modes.',
    idiomatic: 'Han writers named them the Three Modes.',
  },
  s0102: {
    literal: 'On the Gong Mo Dance: Jin and Song called it the Kerchief Dance.',
    idiomatic: 'Gong Mo Dance—Jin and Song knew it as the Kerchief Dance.',
  },
  s0103: {
    literal: 'The account says: "When Han Gaozu met Xiang Yu at Hong Gate, Xiang Zhuang danced with the sword intending to kill Gaozu.',
    idiomatic: 'Tradition holds: "At Hong Gate, when Gaozu met Xiang Yu, Xiang Zhuang\'s sword dance aimed to kill the emperor.',
  },
  s0104: {
    literal: 'Xiang Bo also danced, using his sleeve to interpose, and said, \'Lord, do not harm the Duke of Pei.\'',
    idiomatic: 'Xiang Bo danced too, shielding with his sleeve and crying, \'My lord, do not harm the Duke of Pei!\'',
  },
  s0105: {
    literal: 'The Han honored this; hence the dance uses kerchiefs, imitating the remnant form of Xiang Bo\'s sleeve."',
    idiomatic: 'Later Han honored the act; dancers wave kerchiefs in memory of Xiang Bo\'s sleeve. The passage concluded."',
  },
  s0106: {
    literal: 'On Ba Yu: made by Han Gaodi.',
    idiomatic: 'Ba Yu—attributed to Han Gaodi.',
  },
  s0107: {
    literal: 'The Emperor himself, campaigning from Shu-Han against Chu, took the shield-bearing braves of Ba as vanguard; they were fierce and skilled in battle and loved song and dance. Gaodi watched and said: "King Wu\'s conquest of Zhou sang thus.',
    idiomatic: 'Marching from Shu-Han against Chu he put Ba\'s shield braves in the van—fierce fighters who loved to sing and dance. The emperor remarked, "King Wu\'s campaign against Zhou had its hymn.',
  },
  s0108: {
    literal: '" He had artisans learn it and titled it Ba Yu.',
    idiomatic: 'The passage concluded." He ordered musicians to learn it and named the piece Ba Yu.',
  },
  s0109: {
    literal: 'Yu means "beautiful."',
    idiomatic: 'Yu here means "fine" or "beautiful."',
  },
  s0110: {
    literal: 'It is also said that because Ba has the Yu River, it was named thus.',
    idiomatic: 'Others say the Yu River in Ba gave the name.',
  },
  s0111: {
    literal: 'Wei and Jin changed the name; Liang restored the title Ba Yu; Wen of Sui abolished it.',
    idiomatic: 'Wei and Jin retitled it; Liang revived Ba Yu; Sui Wendi suppressed it.',
  },
  s0112: {
    literal: 'On Mingjun: in Emperor Yuan\'s time the Xiongnu chanyu came to court and Wang Qiang was decreed to him as consort—that is Zhaojun.',
    idiomatic: 'Mingjun—under Yuan of Han the Xiongnu chanyu visited court and Wang Qiang, Zhaojun, was sent as bride.',
  },
  s0113: {
    literal: 'When she was about to leave she came to take leave.',
    idiomatic: 'At her farewell audience',
  },
  s0114: {
    literal: 'Her radiance struck all present; the Son of Heaven regretted it.',
    idiomatic: 'her beauty stunned the hall; the emperor repented too late.',
  },
  s0115: {
    literal: 'The Han, pitying her distant marriage, made this song.',
    idiomatic: 'Han subjects mourned her exile in this song.',
  },
  s0116: {
    literal: 'In Jin, Shi Chong\'s courtesan Lüzhu excelled at the dance; she taught it with this tune and herself composed a new song: "I was jade of the Han house, soon to reach the chanyu\'s court; once jade in the casket, now dust on the dung-heap."',
    idiomatic: 'Jin\'s Shi Chong had Lüzhu, a dancer who taught the tune and added new words: "I was Han-house jade, bound for the chanyu\'s hall—casket gem turned dung-heap dust." The passage concluded."',
  },
  s0117: {
    literal: 'Jin Emperor Wen\'s taboo name was Zhao; hence Jin people called it Mingjun.',
    idiomatic: 'Jin avoided the taboo Zhao, so the tune was called Mingjun.',
  },
  s0118: {
    literal: 'This is an old central-dynasty tune; today it is Wu sound—likely because Wu transmitters corrupted it.',
    idiomatic: 'Originally a central piece, it now survives as Wu music—probably mangled in southern transmission.',
  },
  s0119: {
    literal: 'On Feng Jiang Chu: an old Han song.',
    idiomatic: 'Feng Jiang Chu—an old Han lyric.',
  },
  s0120: {
    literal: 'On Ming Zhi Jun: originally the Han Bian Dance tune.',
    idiomatic: 'Ming Zhi Jun began as the Han Bian Dance.',
  },
  s0121: {
    literal: 'Under Liang Wudi its words were changed to praise the ruler\'s virtue.',
    idiomatic: 'Liang Wudi rewrote the text to hymn imperial virtue.',
  },
  s0122: {
    literal: 'On the Duo Dance: a Han tune.',
    idiomatic: 'Duo Dance—Han repertoire.',
  },
  s0123: {
    literal: 'On the White Dove: a Wu dynasty Whisk Dance.',
    idiomatic: 'White Dove—a Wu Whisk Dance.',
  },
  s0124: {
    literal: 'Yang Hong\'s Preface to the Whisk Dance says: "Since coming to Jiangnan I have seen the White Fu Dance, also called White Mandarin Dove, said to have come thus for several decades.',
    idiomatic: 'Yang Hong\'s Whisk Dance preface notes: "In Jiangnan I saw the White Fu Dance, alias White Mandarin Dove, perhaps decades old.',
  },
  s0125: {
    literal: 'Examining its intent, it is Wu people lamenting Sun Hao\'s cruel government and longing to submit to Jin."',
    idiomatic: 'Its words show Wu subjects weary of Sun Hao and yearning for Jin rule. The passage concluded."',
  },
  s0126: {
    literal: 'Sui\'s Niu Hong asked to present the bian, duo, kerchief, whisk, and other dances in the palace hall.',
    idiomatic: 'Sui minister Niu Hong petitioned to stage bian, duo, kerchief, and whisk dances at court.',
  },
  s0127: {
    literal: 'The Emperor assented but removed the kerchiefs and whisks they carried.',
    idiomatic: 'The emperor agreed but stripped away their kerchiefs and whisks.',
  },
  s0128: {
    literal: 'On White Zhuo: Shen Yue says it originated in Wu lands and is suspected to be a Wu dance.',
    idiomatic: 'White Zhuo—Shen Yue traces it to Wu, likely a Wu dance.',
  },
  s0129: {
    literal: 'Emperor Wu of Liang again had Yue revise its lyrics.',
    idiomatic: 'Liang Wudi had Shen Yue rewrite the words.',
  },
  s0130: {
    literal: 'The Four Seasons White Zhuo songs collected in Yue\'s works are those.',
    idiomatic: 'Yue\'s collected Four Seasons White Zhuo lyrics are those versions.',
  },
  s0131: {
    literal: 'Today in the central plains there is a White Zhuo tune whose wording differs entirely from this.',
    idiomatic: 'A central-plains White Zhuo now circulates with wholly different words.',
  },
  s0132: {
    literal: 'On Ziye: a Jin tune.',
    idiomatic: 'Ziye—a Jin piece.',
  },
  s0133: {
    literal: 'A Jin woman composed this sound by night; the tone was excessively mournful; in Jin it was often sung by ghosts.',
    idiomatic: 'A Jin woman composed it at night—so mournful that Jin folk said ghosts sang it.',
  },
  s0134: {
    literal: 'On Qianxi: made by Jin General of Chariots and Cavalry Shen Chong.',
    idiomatic: 'Qianxi—by Jin General of Chariots and Cavalry Shen Chong.',
  },
  s0135: {
    literal: 'On Azi and Huan Wen: early in Jin Emperor Muzong\'s Shengping reign.',
    idiomatic: 'Azi and Huan Wen—early Shengping under Muzong of Jin.',
  },
  s0136: {
    literal: 'When the song ended they would call, "Azi, did you hear?" Later men developed the sound into this tune.',
    idiomatic: 'After songs performers called, "Child, did you hear?"—later set as this melody.',
  },
  s0137: {
    literal: 'On Tuan Shan: Jin Secretariat Director Wang Min had affection for his sister-in-law\'s maid; the love was very deep.',
    idiomatic: 'Tuan Shan—Jin Secretariat Director Wang Min loved his sister-in-law\'s maid deeply.',
  },
  s0138: {
    literal: 'The sister-in-law beat the maid too harshly; the maid was skilled at song, and Min loved to clutch a white round fan, so she sang: "Round fan, again round fan, held thus to hide my face.',
    idiomatic: 'The sister-in-law beat the maid cruelly; the maid sang well, and Min favored white round fans, so she sang: "Round fan, round fan, held up to hide my face.',
  },
  s0139: {
    literal: 'Haggard beyond all tending, ashamed to meet my lord\'s gaze."',
    idiomatic: 'Worn past repair, too ashamed to meet you."',
  },
  s0140: {
    literal: '"',
    idiomatic: 'The passage concluded."',
  },
  s0141: {
    literal: 'On Aonao: a tune from corrupted folk ballads in early Long\'an of Jin.',
    idiomatic: 'Aonao—born from garbled Long\'an street songs in Jin.',
  },
  s0142: {
    literal: 'The song runs: "Spring grass can be gathered in handfuls; a girl can be gathered in embrace."',
    idiomatic: 'Its refrain: "Spring grass gathers in the hand; a girl gathers in the arms." The passage concluded."',
  },
  s0143: {
    literal: 'Qi Emperor Gao often called it the Central Dynasty Song.',
    idiomatic: 'Qi Emperor Gao often titled it Central Dynasty Song.',
  },
  s0144: {
    literal: 'On Chief Clerk\'s Transformation: made by Jin Secretariat Left Chief Clerk Wang Dan when facing defeat.',
    idiomatic: 'Chief Clerk\'s Transformation—composed by Jin left chief clerk Wang Dan before his fall.',
  },
  s0145: {
    literal: 'On Duhu: a Jin and Song tune.',
    idiomatic: 'Duhu—a Jin and Song piece.',
  },
  s0146: {
    literal: 'Pengcheng Interior Minister Xu Dazhi was killed by Lu Gui.',
    idiomatic: 'Pengcheng interior minister Xu Dazhi died at Lu Gui\'s hands.',
  },
  s0147: {
    literal: 'Xu was the senior son-in-law of Song\'s Founder.',
    idiomatic: 'Xu was senior son-in-law to Song\'s founder.',
  },
  s0148: {
    literal: 'The prefecture\'s direct Duhu Ding Wu arranged the funeral.',
    idiomatic: 'Prefectural Duhu Ding Wu oversaw the burial.',
  },
  s0149: {
    literal: 'His wife summoned Wu below the tower and herself asked about burying Da; each question ended with a sigh: "Duhu Ding!"',
    idiomatic: 'The widow called Wu downstairs, questioning each step of the rites, sighing each time, "Duhu Ding!"',
  },
  s0150: {
    literal: 'The tone was bitterly mournful; later men broadened the tune from that cry.',
    idiomatic: 'Her wail was raw grief; later composers stretched the melody from it.',
  },
  s0151: {
    literal: 'Today\'s song was made by Song Emperor Xiaowu, saying: "Duhu marches to the campaign; I too hate to hear it.',
    idiomatic: 'The version now sung is Xiaowu\'s: "Duhu rides to war; I dread even hearing it.',
  },
  s0152: {
    literal: 'Would I were the Shiyou wind, cutting travelers off on every side."',
    idiomatic: 'Would I were the Shiyou gale, blocking every road at once."',
  },
  s0153: {
    literal: '"',
    idiomatic: 'The passage concluded."',
  },
  s0154: {
    literal: 'On Du Qu: Song men made it for Prince of Pengcheng Yikang; it contains words of capital crime.',
    idiomatic: 'Du Qu—Song courtiers wrote it for Prince Yikang of Pengcheng, with words of death-sentence guilt.',
  },
  s0155: {
    literal: 'On Crow Cries at Night: made by Song Prince of Linchuan Yiqing.',
    idiomatic: 'Crow Cries at Night—by Song\'s Prince Yiqing of Linchuan.',
  },
  s0156: {
    literal: ', Prince of Pengcheng Yikang was relocated to Yuzhang.',
    idiomatic: ', Prince Yikang of Pengcheng was banished to Yuzhang.',
  },
  s0157: {
    literal: 'Yiqing was then in Jiangzhou; reaching his post he met and wept; the Emperor took it ill and summoned him back to his residence in great fear.',
    idiomatic: 'Yiqing governed Jiangzhou; at their meeting both wept—the emperor took offense, recalled him, and he lived in dread.',
  },
  s0158: {
    literal: 'A concubine heard crows at night and knocked on the study saying: "Tomorrow there should be an amnesty."',
    idiomatic: 'A concubine heard crows at night, knocked at his study, and said, "An amnesty should come tomorrow."',
  },
  s0159: {
    literal: 'That year he was again made Governor of Southern Yanzhou and composed this song.',
    idiomatic: 'Amnesty followed; he became governor of Southern Yanzhou and wrote this song.',
  },
  s0160: {
    literal: 'Hence the refrain runs: "Caged window, window unopened—crow cries at night, night by night waiting for my lord to come."',
    idiomatic: 'Its refrain: "Shut cage-window, window still shut—crow cries at night, night after night waiting for you."',
  },
  s0161: {
    literal: 'The transmitted song today seems not to match Yiqing\'s original intent.',
    idiomatic: 'Today\'s lyric hardly matches Yiqing\'s original mood.',
  },
  s0162: {
    literal: 'The words say: "Song-and-dance youths, all grace without trace.',
    idiomatic: 'Instead the text runs: "Youths of song and dance, lovely without a footprint.',
  },
  s0163: {
    literal: 'Sweet-flag flower is pitiable—known by name, strangers still."',
    idiomatic: 'Sweet-flag blooms pitifully—famous by name, never truly known."',
  },
  s0164: {
    literal: '"',
    idiomatic: 'The passage concluded."',
  },
  s0165: {
    literal: 'On Shicheng: made by Song\'s Zang Zhi.',
    idiomatic: 'Shicheng—Song general Zang Zhi.',
  },
  s0166: {
    literal: 'Shicheng lies in Jingling.',
    idiomatic: 'Shicheng stands in Jingling.',
  },
  s0167: {
    literal: 'Zhi once governed Jingling Commandery; gazing from the wall he saw youths singing fluently and therefore made this tune.',
    idiomatic: 'As Jingling governor he watched youths sing from the ramparts and fashioned this tune.',
  },
  s0168: {
    literal: 'The song says: "Born and raised below Shicheng, opening the gate facing the tower.',
    idiomatic: 'It opens: "Raised below Shicheng, our gate faces the tower.',
  },
  s0169: {
    literal: 'Fine youths of the city, going out and in they lean on one another."',
    idiomatic: 'Handsome lads of the town, coming and going arm in arm."',
  },
  s0170: {
    literal: '"',
    idiomatic: 'The passage concluded."',
  },
  s0171: {
    literal: 'On Mochou Music: it comes from Shicheng Music.',
    idiomatic: 'Mochou Music—spun off from Shicheng Music.',
  },
  s0172: {
    literal: 'In Shicheng there was a woman named Mochou skilled in ballads.',
    idiomatic: 'A Shicheng woman named Mochou sang beautifully.',
  },
  s0173: {
    literal: 'Shicheng Music\'s refrain again has the sound "Mochou"; hence the song says: "Where is Mochou?',
    idiomatic: 'Shicheng Music\'s chorus repeats "Mochou," so the lyric asks: "Where is Mochou?',
  },
  s0174: {
    literal: 'Mochou is west of Shicheng.',
    idiomatic: 'Mochou—west of Shicheng.',
  },
  s0175: {
    literal: 'The skiff strikes two oars, urging Mochou to come."',
    idiomatic: 'Two oars strike the water, hurrying Mochou along."',
  },
  s0176: {
    literal: '"',
    idiomatic: 'The passage concluded."',
  },
  s0177: {
    literal: 'On Xiangyang Music: made by Song\'s Prince of Suixing Dan.',
    idiomatic: 'Xiangyang Music—by Song\'s Prince Dan of Suixing.',
  },
  s0178: {
    literal: 'Dan first governed Xiangyang Commandery, then was again made Governor of Yongzhou; at night he heard women singing ballads and therefore composed it.',
    idiomatic: 'Dan first ruled Xiangyang, later Yongzhou; hearing women sing at night he wrote this piece.',
  },
  s0179: {
    literal: 'Hence the refrain says "Xiangyang comes—night music."',
    idiomatic: 'Its refrain: "From Xiangyang comes the night\'s music." The passage concluded."',
  },
  s0180: {
    literal: '" The song says: "Setting out from Xiangyang at dawn, by dusk lodging at the Great Embankment.',
    idiomatic: '" The lyric runs: "Leave Xiangyang at dawn, reach the Great Embankment by dusk.',
  },
  s0181: {
    literal: 'Daughters of the Great Embankment, flowers so bright they startle a young man\'s eyes."',
    idiomatic: 'Girls of the Great Embankment—blossoms bright enough to stun a lover\'s eyes." The passage concluded."',
  },
  s0182: {
    literal: 'Pei Ziye\'s Song Summary says: "Prince of Jin\'an Liu Daoyan was Governor of Yongzhou and had benevolent transformation; the people sang it and called it Xiangyang Music."',
    idiomatic: 'Pei Ziye\'s Song Summary claims Jin\'an prince Liu Daoyan\'s Yongzhou rule inspired Xiangyang Music. The passage concluded." That attribution is wrong.',
  },
  s0183: {
    literal: 'Its wording is not correct.',
    idiomatic: 'That attribution does not fit.',
  },
  s0184: {
    literal: 'On Roosting Crow Flies at Night: made by Shen Youzhi.',
    idiomatic: 'Roosting Crow Flies at Night—Shen Youzhi\'s work.',
  },
  s0185: {
    literal: 'Before Youzhi\'s defeat he longed to return to the capital; hence the refrain: "The sun sets on western hills—come back!"',
    idiomatic: 'Before his fall he yearned for the capital; the refrain: "Sun sets on western hills—return!"',
  },
  s0186: {
    literal: '"',
    idiomatic: 'The passage concluded."',
  },
  s0187: {
    literal: 'On Gu Ke Music: made by Qi Emperor Wu.',
    idiomatic: 'Gu Ke Music—Qi Emperor Wu.',
  },
  s0188: {
    literal: 'In commoner days he often traveled Fan and Deng and, recalling past matters, composed it.',
    idiomatic: 'As a commoner he had roamed Fan and Deng and wrote this remembering old days.',
  },
  s0189: {
    literal: 'The song says: "Once on the Fan-Deng road, held up by tide at Meigen Ford.',
    idiomatic: 'It begins: "On the Fan-Deng road, tide trapped us at Meigen Ford.',
  },
  s0190: {
    literal: 'Moved by memory of things past, feeling full though words cannot tell."',
    idiomatic: 'Memory floods back—heart full, words fail." The passage concluded."',
  },
  s0191: {
    literal: '" He had Grand Music Director Liu Yao teach it; a hundred days brought no success.',
    idiomatic: '" He set Grand Music Director Liu Yao to teach it; after a hundred days the orchestra still failed.',
  },
  s0192: {
    literal: 'Someone reported that the monk Baoyue excelled at pitch laws; the Emperor had Baoyue perform it and it was done at once.',
    idiomatic: 'A memorial praised monk Baoyue\'s pitch sense; the emperor had him play—and the piece clicked immediately.',
  },
  s0193: {
    literal: 'He ordered singers always to stress the tone of moved remembrance.',
    idiomatic: 'He commanded vocalists always to weight the note of longing memory.',
  },
  s0194: {
    literal: 'Liang changed its name to Merchant Travel.',
    idiomatic: 'Liang retitled it Merchant Travel.',
  },
  s0195: {
    literal: 'On Yang Ban: originally a children\'s ballad.',
    idiomatic: 'Yang Ban—originally a children\'s rhyme.',
  },
  s0196: {
    literal: 'In Qi Longchang era the witch\'s son was named Yang Min; Min followed his mother into the palace and, grown, was favored by the empress.',
    idiomatic: 'Under Qi Longchang a witch\'s son, Yang Min, entered the palace with his mother and, grown, won the empress\'s favor.',
  },
  s0197: {
    literal: 'The children\'s rhyme said: "Old Mother Yang, come play together."',
    idiomatic: 'Children sang: "Old Mother Yang, come out to play." The passage concluded."',
  },
  s0198: {
    literal: 'The song words were corrupted and became Yang Ban\'er.',
    idiomatic: 'Slurred speech turned the rhyme into Yang Ban\'er.',
  },
  s0199: {
    literal: 'The song says: "Stepping out before White Gate, willows hide the crows.',
    idiomatic: 'Its lines: "Just outside White Gate, willows hide the crows.',
  },
  s0200: {
    literal: 'You make sunken-water incense; I shall be the Boshan censer."',
    idiomatic: 'You are sunken-water incense; I am the Boshan burner."',
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
if (data.metadata.chapter !== '029') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 029; standalone T ready (${Object.keys(T).length} entries).`
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
