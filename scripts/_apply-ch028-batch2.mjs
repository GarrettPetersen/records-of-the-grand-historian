#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Jiutangshu ch.028, Rites 4 / music) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/028.json';
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
    literal: 'With Huangzhong and Ruibin as palace-tonic, its music has nine changes;',
    idiomatic: 'With Huangzhong and Ruibin as the palace-tonic, the music has nine variations;',
  },
  s0102: {
    literal: 'With Dalü and Linzhong as palace-tonic, its music has eight changes.',
    idiomatic: 'With Dalü and Linzhong as the palace-tonic, the music has eight variations.',
  },
  s0103: {
    literal: 'With Taizu and Yize as palace-tonic, its music has seven changes.',
    idiomatic: 'With Taizu and Yize as the palace-tonic, the music has seven variations.',
  },
  s0104: {
    literal: 'With Jiazhong and Nanlü as palace-tonic, its music has six changes.',
    idiomatic: 'With Jiazhong and Nanlü as the palace-tonic, the music has six variations.',
  },
  s0105: {
    literal: 'With Guqian and Wushe as palace-tonic, its music has five changes.',
    idiomatic: 'With Guqian and Wushe as the palace-tonic, the music has five variations.',
  },
  s0106: {
    literal: 'With Zhonglü and Yingzhong as palace-tonic, its music has four changes.',
    idiomatic: 'With Zhonglü and Yingzhong as the palace-tonic, the music has four variations.',
  },
  s0107: {
    literal: 'The Son of Heaven had twelve bells; upper dukes nine, marquises and earls seven, viscounts and barons five, ministers six, grand masters four, knights three.',
    idiomatic: 'The Son of Heaven had twelve bells; upper dukes nine, marquises and earls seven, viscounts and barons five, ministers six, grand masters four, and knights three.',
  },
  s0108: {
    literal: 'When it was completed, it was performed.',
    idiomatic: 'When the work was finished, it was performed.',
  },
  s0109: {
    literal: 'The Founding Ancestor praised it; thereupon ranks were raised and gifts distributed, each according to difference.',
    idiomatic: 'The Founding Ancestor praised it; ranks were then raised and gifts distributed according to merit.',
  },
  s0110: {
    literal: 'In the fourteenth year, an edict said: "Yin offered to ancestors and fathers to exalt merit and virtue; though we have lately added sincerity and purity, the temple music is still unfitting.',
    idiomatic: 'In the fourteenth year an edict said: "Yin offered to ancestors and fathers to exalt merit and virtue; though we have lately added sincerity and purity, the temple music is still unfitting.',
  },
  s0111: {
    literal: 'Let the responsible offices examine the former precedents in detail, fix regulations, and memorialize for approval."',
    idiomatic: 'Let the responsible offices examine former precedents in detail, fix regulations, and submit a memorial for approval."',
  },
  s0112: {
    literal: 'The Eight Seats deliberated, saying: "The seven temples display virtue; their meaning crowns ancestral sacrifice;',
    idiomatic: 'The Eight Seats deliberated: "The seven temples display virtue; their meaning crowns ancestral sacrifice;',
  },
  s0113: {
    literal: 'the three ancestors in Heaven manifest it in solemn pairing.',
    idiomatic: 'the three ancestors in Heaven display it in solemn pairing.',
  },
  s0114: {
    literal: 'The sentiment of reverence is fully harmonized; the way of great filial piety should be proclaimed.',
    idiomatic: 'Reverence is fully harmonized; the way of great filial piety should be proclaimed.',
  },
  s0115: {
    literal: 'Therefore the eight rows are fully arrayed, and the solemn rites take form in the dance positions;',
    idiomatic: 'Therefore the eight rows are fully arrayed, and solemn rites take form in the dance positions;',
  },
  s0116: {
    literal: 'the four suspensions are fully deployed, spreading the great emblem in elegant tones.',
    idiomatic: 'the four suspensions are fully deployed, spreading the great emblem through elegant tones.',
  },
  s0117: {
    literal: 'Examining the bright meaning of making music and selecting the august kings\' proper canons—what former sages practiced, nothing is greater than this.',
    idiomatic: 'To examine the bright meaning of making music and select the august kings\' proper canons—among what former sages practiced, nothing is greater.',
  },
  s0118: {
    literal: 'We bow before Your Majesty the Emperor, Heaven-endowed with sympathetic penetration, following the dark ultimate.',
    idiomatic: 'We bow before Your Majesty, Heaven-endowed with sympathetic penetration, following the dark ultimate.',
  },
  s0119: {
    literal: 'Filial governance is manifest and brilliant, shining over the eight directions;',
    idiomatic: 'Filial governance is manifest and brilliant, shining across the realm;',
  },
  s0120: {
    literal: 'love and reverence pure and deep, pursuing honor through a hundred generations.',
    idiomatic: 'love and reverence pure and deep, pursuing honor for a hundred generations.',
  },
  s0121: {
    literal: 'Everlasting words bestow blessing; thereby the eulogistic voice is magnified.',
    idiomatic: 'Everlasting words bestow blessing; thereby praise is magnified.',
  },
  s0122: {
    literal: 'Bell-tones change their notes, spreading clangor in offerings;',
    idiomatic: 'Bell-tones change their notes, spreading clangor at offerings;',
  },
  s0123: {
    literal: 'feather-flutes form their ranks, displaying vigorous tread in seasonal and ancestral sacrifices.',
    idiomatic: 'feather-flutes form their ranks, displaying vigorous tread at seasonal and ancestral sacrifices.',
  },
  s0124: {
    literal: 'Thereupon edicts went to the canonical offices, and elevated titles were added; following the sound and verifying the substance, we respectfully clarify honored names.',
    idiomatic: 'Edicts then went to the canonical offices and elevated titles were added; following the sound and verifying the substance, we respectfully clarify honored names.',
  },
  s0125: {
    literal: 'We venture that the imperial numen increases blessing; the deep source long pours forth, surpassing Yan\'s swallowing of Shang and exceeding the dragon-disturbing founding of Han, storing brilliance in the nine-twos and gradually issuing forth at the three divisions.',
    idiomatic: 'We venture that the imperial numen increases blessing; the deep source long pours forth, surpassing Yan\'s swallowing of Shang and exceeding the dragon-disturbing founding of Han, storing brilliance in concealment and gradually issuing forth at the three divisions.',
  },
  s0126: {
    literal: 'The High Ancestor drew in earth and patched heaven, again spreading the realm\'s bounds, returning souls to flesh and bones, again creating living beings.',
    idiomatic: 'The High Ancestor drew in earth and patched heaven, again spreading the realm\'s bounds, returning souls to flesh and bone, again creating the living.',
  },
  s0127: {
    literal: 'Vast is the imperial design, joining with the two regulators in greatness;',
    idiomatic: 'Vast is the imperial design, joining heaven and earth in greatness;',
  },
  s0128: {
    literal: 'splendid is the imperial way, together with the seven luminaries in brightness.',
    idiomatic: 'splendid is the imperial way, matching the seven luminaries in brightness.',
  },
  s0129: {
    literal: 'Though sage traces and divine achievements cannot be fathomed by scrutiny;',
    idiomatic: 'Though sage traces and divine achievements cannot be fathomed;',
  },
  s0130: {
    literal: 'the warp of culture and woof of arms—we dare lodge them in famous words.',
    idiomatic: 'the warp of culture and woof of arms—we dare set them down in famous words.',
  },
  s0131: {
    literal: 'Respectfully preparing music sections to display the constant pattern.',
    idiomatic: 'We respectfully prepare music sections to display the constant pattern.',
  },
  s0132: {
    literal: 'For the temples of Imperial Grandfather Hongnong, Xuanjian Duke, and Illustrious King, the music should jointly perform the dance "Changfa."',
    idiomatic: 'For the temples of Imperial Grandfather Hongnong, Duke Xuanjian, and Illustrious King, the music should jointly perform the dance Changfa.',
  },
  s0133: {
    literal: 'For the Founding Ancestor Emperor Jing\'s temple music, please perform the dance "Daji."',
    idiomatic: 'For the Founding Ancestor Emperor Jing\'s temple music, please perform the dance Daji.',
  },
  s0134: {
    literal: 'For the World Ancestor Emperor Yuan\'s temple music, please perform the dance "Dacheng."',
    idiomatic: 'For the World Ancestor Emperor Yuan\'s temple music, please perform the dance Dacheng.',
  },
  s0135: {
    literal: 'For the High Ancestor Great Martial Emperor\'s temple music, please perform the dance "Daming."',
    idiomatic: 'For the High Ancestor Great Martial Emperor\'s temple music, please perform the dance Daming.',
  },
  s0136: {
    literal: 'For the Cultured Virtue Empress\'s temple music, please perform the dance "Guangda."',
    idiomatic: 'For the Cultured Virtue Empress\'s temple music, please perform the dance Guangda.',
  },
  s0137: {
    literal: 'For the seven temples\' ascent hymns, please perform separately in each chamber."',
    idiomatic: 'For the seven temples\' ascent hymns, please perform a separate piece in each chamber."',
  },
  s0138: {
    literal: 'The ordinance approved it.',
    idiomatic: 'The throne approved.',
  },
  s0139: {
    literal: 'In the twenty-third year, Grand Mentor Zhangsun Wuji and Palace Attendant Yu Zhining deliberated on the Founding Ancestor\'s temple music, saying: "The Changes says: \'Former kings made music to exalt virtue, Yin offered to the Supreme Lord, to pair with ancestors and fathers.\'',
    idiomatic: 'In the twenty-third year Grand Mentor Zhangsun Wuji and Palace Attendant Yu Zhining deliberated on the Founding Ancestor\'s temple music: "The Changes says, \'Former kings made music to exalt virtue; Yin offered to the Supreme Lord to pair with ancestors and fathers.\'',
  },
  s0140: {
    literal: 'We request the music be named the dance "Chongde."',
    idiomatic: 'We request the music be named the dance Chongde.',
  },
  s0141: {
    literal: 'The ordinance approved it.',
    idiomatic: 'The throne approved.',
  },
  s0142: {
    literal: 'Later, at the Cultured Virtue Empress\'s temple, the offices according to ritual stopped the dance "Guangda" and advanced only the dance "Chongde."',
    idiomatic: 'Later, at the Cultured Virtue Empress\'s temple, the offices by ritual stopped the dance Guangda and advanced only the dance Chongde.',
  },
  s0143: {
    literal: 'In the ninth month, the High Ancestor\'s temple music took "Juntian" as its name.',
    idiomatic: 'In the ninth month the High Ancestor\'s temple music took Juntian as its name.',
  },
  s0144: {
    literal: 'The Middle Ancestor\'s temple music performed the dance "Taihe."',
    idiomatic: 'The Middle Ancestor\'s temple music performed the dance Taihe.',
  },
  s0145: {
    literal: 'In the tenth month an edict: at the Sagacious Ancestor\'s temple perform the dance "Jingyun."',
    idiomatic: 'A tenth-month edict ordered the Sagacious Ancestor\'s temple to perform the dance Jingyun.',
  },
  s0146: {
    literal: 'In the sixth month of the twenty-ninth year, the Court of Imperial Sacrifices memorialized: "According to the elegant music fixed on the day of the eastern feng at Mount Tai in the twelfth year, the music "Yuanhe" has six changes to bring down the Heavenly Spirit.',
    idiomatic: 'In the sixth month of the twenty-ninth year the Court of Imperial Sacrifices memorialized: "According to the elegant music fixed on the day of the eastern feng at Mount Tai in the twelfth year, Yuanhe has six changes to bring down the Heavenly Spirit.',
  },
  s0147: {
    literal: '"Shunhe" has eight changes to bring down the Earth Spirits.',
    idiomatic: 'Shunhe has eight changes to bring down the Earth Spirits.',
  },
  s0148: {
    literal: 'When the emperor processed, use the music "Taihe."',
    idiomatic: 'When the emperor processed, use Taihe.',
  },
  s0149: {
    literal: 'At the feng of Mount Tai, for ascent hymn and offering of jade disks, use the music "Suhe";',
    idiomatic: 'At the feng of Mount Tai, for the ascent hymn and offering of jade disks, use Suhe;',
  },
  s0150: {
    literal: 'to welcome the offering stands, use the music "Yonghe";',
    idiomatic: 'to welcome the offering stands, use Yonghe;',
  },
  s0151: {
    literal: 'for libation offering and drinking the blessing, use the music "Shouhe";',
    idiomatic: 'for libation offering and drinking the blessing, use Shouhe;',
  },
  s0152: {
    literal: 'to send off the civil and welcome the martial, use the music "Shuhe";',
    idiomatic: 'to send off the civil and welcome the martial, use Shuhe;',
  },
  s0153: {
    literal: 'for the second and final libations, use the music "Kai\'an";',
    idiomatic: 'for the second and final libations, use Kai\'an;',
  },
  s0154: {
    literal: 'to send off the spirits, use Jiazhong-palace "Yuanhe."',
    idiomatic: 'to send off the spirits, use Jiazhong-palace Yuanhe.',
  },
  s0155: {
    literal: 'The spirit shrine is foremost; to send off the spirits use Linzhong-palace "Shunhe."',
    idiomatic: 'The spirit shrine is foremost; to send off the spirits use Linzhong-palace Shunhe.',
  },
  s0156: {
    literal: 'At offerings in the Grand Temple, to welcome the spirits use the music "Yonghe";',
    idiomatic: 'At offerings in the Grand Temple, to welcome the spirits use Yonghe;',
  },
  s0157: {
    literal: 'for libation to Offering Ancestor Emperor Xuan perform the dance "Guangda," to Illustrious Ancestor Emperor Guang perform "Changfa," to Founding Ancestor Emperor Jing perform "Dazheng," to World Ancestor Emperor Yuan perform "Dacheng," to High Ancestor Emperor Shenyao perform "Daming," to Founding Ancestor Emperor Wen perform "Chongde," to High Ancestor Emperor Tianhuang perform "Juntian," to Middle Ancestor Emperor Xiaohe perform "Taihe," to Sagacious Ancestor Emperor Dasheng Zhen perform "Jingyun";',
    idiomatic: 'for libation to Offering Ancestor Emperor Xuan perform Guangda, to Illustrious Ancestor Emperor Guang perform Changfa, to Founding Ancestor Emperor Jing perform Dazheng, to World Ancestor Emperor Yuan perform Dacheng, to High Ancestor Emperor Shenyao perform Daming, to Founding Ancestor Emperor Wen perform Chongde, to High Ancestor Emperor Tianhuang perform Juntian, to Middle Ancestor Emperor Xiaohe perform Taihe, to Sagacious Ancestor Emperor Dasheng Zhen perform Jingyun;',
  },
  s0158: {
    literal: 'to remove the beans, perform the dance "Yonghe";',
    idiomatic: 'to remove the beans, perform Yonghe;',
  },
  s0159: {
    literal: 'to send off the spirits, use Huangzhong-palace "Yonghe."',
    idiomatic: 'to send off the spirits, use Huangzhong-palace Yonghe.',
  },
  s0160: {
    literal: 'Your servant considers that the music sections are incomplete and have lacked repair for years.',
    idiomatic: 'We consider that the music sections are incomplete and have lacked repair for years.',
  },
  s0161: {
    literal: 'Since the eastern tour and personal audience at the nine temples, the sage sentiment was careful in ritual and refined prayer sensed communion—all several days before sacrifice examining and fixing pitch and tones; we request they be compiled into the historical records for ten thousand generations\' practice."',
    idiomatic: 'Since the eastern tour and personal audience at the nine temples, the emperor was careful in ritual and refined prayer sensed communion—several days before each sacrifice examining and fixing pitch and tones; we request they be compiled into the historical records for practice in ten thousand generations."',
  },
  s0162: {
    literal: 'The issued ordinance said: "Princes, dukes, ministers, and scholars, reaching to the responsible offices, have repeatedly come to the gate and memorialized, requesting that \'Tang music\' be the name—this is a matter of utmost impartiality; how could We decline?',
    idiomatic: 'The issued ordinance said: "Princes, dukes, ministers, and scholars, down to the responsible offices, have repeatedly come to the gate and memorialized, requesting that \'Tang music\' be the name—this is a matter of utmost impartiality; how could We decline?',
  },
  s0163: {
    literal: 'Yet "Daxian," "Dashao," "Dahu," and "Daxia" all used the character da to mark their music sections; what is now fixed should be called "Great Tang Music."',
    idiomatic: 'Yet Daxian, Dashao, Dahu, and Daxia all used the character da to mark their music sections; what is now fixed should be called Great Tang Music."',
  },
  s0164: {
    literal: 'From Imperial Grandfather Hongnong through the High Ancestor Great Martial Emperor\'s six temples—in the Zhenguan era an edict had already ordered Yan Shigu and others to fix music sections and dance names.',
    idiomatic: 'From Imperial Grandfather Hongnong through the High Ancestor Great Martial Emperor\'s six temples—in Zhenguan an edict had already ordered Yan Shigu and others to fix music sections and dance names.',
  },
  s0165: {
    literal: 'By now the Court of Imperial Sacrifices again memorialized the offices\' fixing of libation dances from Offering Ancestor Emperor Xuan through the Sagacious Ancestor Emperor Zhen\'s nine temples.',
    idiomatic: 'By now the Court of Imperial Sacrifices again reported the offices\' fixing of libation dances from Offering Ancestor Emperor Xuan through the Sagacious Ancestor Emperor Zhen\'s nine temples.',
  },
  s0166: {
    literal: 'In the fourth month, the offices were ordered to fix the music performed at report-offerings in the temple of the Primordial Origin Emperor; to bring down the spirit use the music "Huncheng," to send off the spirit use the music "Taiyi."',
    idiomatic: 'In the fourth month the offices were ordered to fix the music at report-offerings in the temple of the Primordial Origin Emperor; to bring down the spirit use Huncheng, to send off the spirit use Taiyi.',
  },
  s0167: {
    literal: 'In the sixth month the offices memorialized: "For the Mystical Ancestor\'s temple music please perform the dance "Guangyun"; for the Solemn Ancestor\'s temple music please perform the dance "Weixin."',
    idiomatic: 'In the sixth month the offices memorialized: "For the Mystical Ancestor\'s temple music please perform Guangyun; for the Solemn Ancestor\'s temple music please perform Weixin."',
  },
  s0168: {
    literal: 'For the Generation Ancestor\'s temple music please perform the dance "Baoda."',
    idiomatic: 'For the Generation Ancestor\'s temple music please perform Baoda.',
  },
  s0169: {
    literal: 'In the tenth month, the Virtuous Ancestor\'s temple music—please perform the dance "Wenming."',
    idiomatic: 'In the tenth month, for the Virtuous Ancestor\'s temple music please perform Wenming.',
  },
  s0170: {
    literal: 'For the Compliance Ancestor\'s temple music please perform the dance "Dashun."',
    idiomatic: 'For the Compliance Ancestor\'s temple music please perform Dashun.',
  },
  s0171: {
    literal: 'For the Accomplished Ancestor\'s temple music please perform the dance "Xiangde."',
    idiomatic: 'For the Accomplished Ancestor\'s temple music please perform Xiangde.',
  },
  s0172: {
    literal: 'For Emperor Muzong\'s temple music please perform the dance "Hening."',
    idiomatic: 'For Emperor Muzong\'s temple music please perform Hening.',
  },
  s0173: {
    literal: 'For the Respectful Ancestor\'s temple music please perform the dance "Dajun."',
    idiomatic: 'For the Respectful Ancestor\'s temple music please perform Dajun.',
  },
  s0174: {
    literal: 'For the Cultured Ancestor\'s temple music please perform the dance "Wencheng."',
    idiomatic: 'For the Cultured Ancestor\'s temple music please perform Wencheng.',
  },
  s0175: {
    literal: 'For the Martial Ancestor\'s temple music please perform the dance "Dading."',
    idiomatic: 'For the Martial Ancestor\'s temple music please perform Dading.',
  },
  s0176: {
    literal: 'At a banquet for the assembled ministers, they first performed the tune "Prince of Qin Breaking the Battle Array."',
    idiomatic: 'At a banquet for the assembled ministers they first performed the tune Prince of Qin Breaking the Battle Array.',
  },
  s0177: {
    literal: 'Taizong told the attending ministers: "In former days when I was in the fief I repeatedly had campaigns; the world thereby got this music—who would have thought today it would ascend to elegant music!',
    idiomatic: 'Taizong told the attending ministers: "When I was in the fief I repeatedly campaigned; the world thereby got this music—who would have thought it would today ascend to elegant music!',
  },
  s0178: {
    literal: 'Yet its display of vigor and tread, though differing from cultured bearing, the achievement came by it to reach today; therefore it is clothed in music sections—to show not forgetting the root."',
    idiomatic: 'Yet its display of vigor and tread, though unlike cultured bearing, achievement came by it to reach today; therefore it is clothed in music sections—to show we do not forget our root."',
  },
  s0179: {
    literal: 'Right Vice Director of the Department of State Affairs Feng Deyi advanced, saying: "Your Majesty with sage martial quelled difficulty, established the pole and settled the people; achievement complete and transformation fixed, displaying music to image virtue—truly a magnificent achievement of succoring the age, a grand sight for generations to come.',
    idiomatic: 'Right Vice Director Feng Deyi advanced: "Your Majesty with sage martial quelled difficulty, established the pole and settled the people; achievement complete and transformation fixed, displaying music to image virtue—truly a magnificent achievement of succoring the age, a grand sight for generations to come.',
  },
  s0180: {
    literal: 'Cultured bearing and practiced ritual—how could they compare!',
    idiomatic: 'Cultured bearing and practiced ritual—how could they be compared!',
  },
  s0181: {
    literal: 'Taizong said: "Though I settled all under Heaven by martial achievement, in the end I shall soothe the seas within by cultured virtue.',
    idiomatic: 'Taizong said: "Though I settled the realm by martial achievement, in the end I shall soothe the seas within by cultured virtue.',
  },
  s0182: {
    literal: 'The ways of wen and wu each follow their time; you say cultured bearing is not equal to vigorous tread—that is excessive."',
    idiomatic: 'The ways of civil and martial each follow their time; you say cultured bearing is not equal to vigorous tread—that goes too far."',
  },
  s0183: {
    literal: 'Deyi bowed his head, saying: "Your servant is not acute and is insufficient to know this."',
    idiomatic: 'Deyi bowed his head: "Your servant is not acute and is insufficient to know this."',
  },
  s0184: {
    literal: 'Thereafter he ordered Wei Zheng, Yu Shinan, Chu Liang, and Li Baiyao to revise the song texts, renaming it the dance "Qide," increasing dancers to one hundred twenty, donning armor and grasping halberds to image battle-array methods.',
    idiomatic: 'Thereafter he ordered Wei Zheng, Yu Shinan, Chu Liang, and Li Baiyao to revise the song texts, renaming it the dance Qide, increasing dancers to one hundred twenty, donning armor and grasping halberds to image battle-array methods.',
  },
  s0185: {
    literal: 'In the sixth year Taizong traveled in person to Qingshan Palace and banqueted his following ministers on the Wei River\'s bank, composing a poem in ten rhymes.',
    idiomatic: 'In the sixth year Taizong went in person to Qingshan Palace and banqueted his ministers on the Wei River\'s bank, composing a poem in ten rhymes.',
  },
  s0186: {
    literal: 'That palace was where Taizong was born.',
    idiomatic: 'That palace was Taizong\'s birthplace.',
  },
  s0187: {
    literal: 'Whenever the imperial carriage visited in person he was especially moved with celebration, bestowing gifts on the hamlet—like Han\'s Wan and Pei.',
    idiomatic: 'Whenever the imperial carriage visited he was especially moved with celebration, bestowing gifts on the hamlet—like Han\'s Wan and Pei.',
  },
  s0188: {
    literal: 'Thereupon Attendant for Drafting Lü Cai set the imperial poems to the Music Bureau, clothed them in strings and pipes, naming the tune "Achievement Complete, Qingshan Celebration," ordering eight rows of children all wearing jinde caps and purple trousers and jackets, performing the dance "Jiugong."',
    idiomatic: 'Thereupon Attendant for Drafting Lü Cai set the imperial poems to the Music Bureau, clothed them in strings and pipes, naming the tune Achievement Complete, Qingshan Celebration, ordering eight rows of children all wearing jinde caps and purple trousers and jackets, performing the dance Jiugong.',
  },
  s0189: {
    literal: 'At the winter solstice feast and when the state had great celebration, together with the dance "Qide" they were all performed in the court.',
    idiomatic: 'At the winter solstice feast and when the state had great celebration, together with the dance Qide they were all performed in the court.',
  },
  s0190: {
    literal: 'In the seventh year Taizong devised the "Battle-Array Dance Diagram": left round, right square, first echelon then five-deep, fish-scale and goose-file, winnow-spread and wing-unfold, interlaced bending and stretching, head and tail turning back upon each other—to image the battle array\'s form.',
    idiomatic: 'In the seventh year Taizong devised the Battle-Array Dance Diagram: left round, right square, first echelon then five-deep, fish-scale and goose-file, winnow-spread and wing-unfold, interlaced bending and stretching, head and tail turning back upon each other—to image the battle array\'s form.',
  },
  s0191: {
    literal: 'He ordered Lü Cai according to the diagram to teach one hundred twenty music workers, donning armor and grasping halberds to practice it.',
    idiomatic: 'He ordered Lü Cai to teach one hundred twenty music workers from the diagram, donning armor and grasping halberds to practice it.',
  },
  s0192: {
    literal: 'In all there were three changes; each change was four arrays, with coming and going, fast and slow, striking and thrusting images to match the song\'s beats—in several days it was done, and the name was changed to the dance "Qide."',
    idiomatic: 'In all there were three changes; each change was four arrays, with coming and going, fast and slow, striking and thrusting images to match the song\'s beats—in several days it was done, and the name was changed to the dance Qide.',
  },
  s0193: {
    literal: 'On day guisi they performed the dances "Qide" and "Jiugong"; viewers seeing their restraint and vigorous tread all clutched their wrists and leapt, awestruck and trembling.',
    idiomatic: 'On day guisi they performed the dances Qide and Jiugong; viewers seeing their restraint and vigorous tread all clutched their wrists and leapt, awestruck and trembling.',
  },
  s0194: {
    literal: 'Martial ministers and arrayed generals all raised cups for longevity, saying: "This dance is entirely Your Majesty\'s image of a hundred battles, a hundred victories."',
    idiomatic: 'Martial ministers and arrayed generals all raised cups for longevity, saying: "This dance is entirely Your Majesty\'s likeness in a hundred battles and a hundred victories."',
  },
  s0195: {
    literal: 'The assembled ministers all called "Ten thousand years!"',
    idiomatic: 'The assembled ministers all shouted "Long live the emperor!"',
  },
  s0196: {
    literal: 'More than ten kinds of southern barbarians themselves requested to lead the dance; an edict permitted it, and only after a long while did it cease.',
    idiomatic: 'More than ten southern peoples themselves requested to lead the dance; an edict permitted it, and only after a long while did it stop.',
  },
  s0197: {
    literal: 'In the fourteenth year there appeared an auspicious cloud and the Yellow River cleared.',
    idiomatic: 'In the fourteenth year an auspicious cloud appeared and the Yellow River cleared.',
  },
  s0198: {
    literal: 'Zhang Wenshou gathered the ancient meaning of "Vermilion Goose" and "Heavenly Horse," composing the "Jingyun River Clear Song," naming it banquet music; performed on strings and pipes, it was first among all music—the first performed at the great assembly was this.',
    idiomatic: 'Zhang Wenshou gathered the ancient meaning of Vermilion Goose and Heavenly Horse, composing the Jingyun River Clear Song, naming it banquet music; performed on strings and pipes, it was first among all music—the first performed at the great assembly was this.',
  },
  s0199: {
    literal: 'In the eleventh month the High Ancestor personally sacrificed at the southern suburb; Yellow Gate Vice Director Yu Wenjie memorialized, saying: "According to the ritual, tomorrow at audience with the assembled ministers, removing the music suspension, please perform the "Nine Department Music."',
    idiomatic: 'In the eleventh month the High Ancestor personally sacrificed at the southern suburb; Yellow Gate Vice Director Yu Wenjie memorialized: "According to the ritual, tomorrow at audience with the assembled ministers, removing the music suspension, please perform the Nine Department Music."',
  },
  s0200: {
    literal: 'The emperor thereupon said: "As for the \'Breaking the Array\' dance—emotionally I cannot bear to watch it; the offices should furthermore not set it up."',
    idiomatic: 'The emperor thereupon said: "As for the Breaking the Array dance—emotionally I cannot bear to watch it; the offices should furthermore not set it up."',
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
if (data.metadata.chapter !== '028') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 028; standalone T ready (${Object.keys(T).length} entries).`
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
