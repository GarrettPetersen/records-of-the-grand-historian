#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Jiutangshu ch.024, suburban sacrifice treatise) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/024.json';
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
    literal: 'Now an altar is set east of the city, which does not accord with ancient rites.',
    idiomatic: 'An altar east of the city does not match ancient rites.',
  },
  s0102: {
    literal: 'The passage concluded." Taizong said: "Rites follow human feeling—what is ever constant?',
    idiomatic: 'The quote ended. Taizong said: "Rites follow feeling—what is ever constant?',
  },
  s0103: {
    literal: 'Moreover the Documents of Yu says "order the work of the east"—thus Yao and Shun in granting the seasons were already in the east.',
    idiomatic: 'The Documents of Yu says "order the work of the east"—Yao and Shun granting seasons were already in the east.',
  },
  s0104: {
    literal: 'Again, riding the green carriage and pushing the dark plow is to accord with spring qi; thus one knows it should be in the east.',
    idiomatic: 'Green carriage and dark plow accord with spring qi—so it belongs in the east.',
  },
  s0105: {
    literal: 'Moreover I now dwell in the place of Lesser Yang; to plow at the eastern suburb is surely fitting. The passage concluded." Thereupon it was fixed.',
    idiomatic: 'I dwell in Lesser Yang; eastern-suburb plowing is fitting. The quote ended. It was fixed.',
  },
  s0106: {
    literal: 'Afterward each year the relevant offices were routinely ordered to perform the rite.',
    idiomatic: 'Thereafter the relevant offices performed it yearly.',
  },
  s0107: {
    literal: 'In the Wu Zetian era the sacred-field altar was changed to First Farmer.',
    idiomatic: 'Wu Zetian era: sacred-field altar renamed First Farmer.',
  },
  s0108: {
    literal: 'In the first year of Shenlong, Minister of Rites Zhu Qinming and ritual officers memorialized: "We have examined the classics and find no text on First Farmer.',
    idiomatic: 'Shenlong 1: Minister of Rites Zhu Qinming and ritual officers memorialized: "Classics contain no First Farmer text.',
  },
  s0109: {
    literal: 'The "Regulations of Sacrifice" in the Book of Rites says: \'When the king establishes a mound for himself, it is called the king\'s mound.\'',
    idiomatic: 'Book of Rites "Regulations of Sacrifice": when the king establishes a mound for himself, it is the king\'s mound.',
  },
  s0110: {
    literal: 'Former scholars held that the mound was at the sacred field; the preface to the Odes\' "Zai Yan" says "spring sacred-field plowing and prayer to soil and grain mounds"—that is the meaning.',
    idiomatic: 'Former scholars placed the mound at the sacred field; the "Zai Yan" preface says "spring sacred-field plowing and prayer to soil and grain"—that meaning.',
  },
  s0111: {
    literal: 'In the Yonghui era it was still called sacred-field plowing; after Chuigong it was revised and changed to First Farmer.',
    idiomatic: 'Yonghui: still sacred-field plowing; after Chuigong revised to First Farmer.',
  },
  s0112: {
    literal: 'First Farmer and the mound were originally one spirit; frequent changes confused listeners.',
    idiomatic: 'First Farmer and the mound were one spirit; repeated changes confused people.',
  },
  s0113: {
    literal: 'The First Farmer altar should be changed to the Emperor\'s Soil Mound altar to answer the canonical meaning of the king\'s mound.',
    idiomatic: 'Change the First Farmer altar to Emperor\'s Soil Mound altar per the king\'s mound in canon.',
  },
  s0114: {
    literal: 'Since First Farmer sacrifice is changed to Emperor\'s Soil Mound altar, still follow the statute using an auspicious hai day in early spring to sacrifice to Hou Tu, with Gou Long as associate.',
    idiomatic: 'With First Farmer changed to Emperor\'s Soil Mound altar, still sacrifice Hou Tu on early-spring auspicious hai with Gou Long paired.',
  },
  s0115: {
    literal: 'The passage concluded." The edict approved.',
    idiomatic: 'The quote ended. Approved.',
  },
  s0116: {
    literal: 'Thereupon First Farmer was changed to Emperor\'s Soil Mound altar; west of the altar Emperor\'s Grain Mound altar was set up—rites like Great Soil and Great Grain; the altar lacked directional colors to distinguish it from Great Soil.',
    idiomatic: 'First Farmer became Emperor\'s Soil Mound altar; Emperor\'s Grain Mound west of it—rites like Great Soil and Grain, without directional colors unlike Great Soil.',
  },
  s0117: {
    literal: 'In the first year of Supreme Ultimate, Ruizong personally sacrificed to First Farmer and plowed the emperor\'s sacred field.',
    idiomatic: 'Supreme Ultimate 1: Ruizong sacrificed to First Farmer and plowed the emperor\'s field.',
  },
  s0118: {
    literal: 'When rites ended, a great amnesty and era change.',
    idiomatic: 'Rites ended: great amnesty and era change.',
  },
  s0119: {
    literal: 'In winter of Kaiyuan 22, Ritual Department Vice Director Wang Zhongqiu again memorialized to perform sacred-field rites.',
    idiomatic: 'Kaiyuan 22 winter: Ritual Vice Director Wang Zhongqiu again asked for sacred-field rites.',
  },
  s0120: {
    literal: 'In the first month of the twenty-third year, Shen Nong was personally sacrificed at the eastern suburb with Gou Mang as associate.',
    idiomatic: 'Year 23, first month: Shen Nong at eastern suburb, Gou Mang paired.',
  },
  s0121: {
    literal: 'When rites ended, he took the plow in hand at the thousand-mu field.',
    idiomatic: 'Rites ended: he took the plow at the thousand-mu field.',
  },
  s0122: {
    literal: 'At the time the relevant offices presented ritual notes: "The Son of Heaven three pushes, nobles and ministers nine pushes, commoners finish the mu.',
    idiomatic: 'Relevant offices presented notes: Son of Heaven three pushes, nobles nine, commoners finish the mu.',
  },
  s0123: {
    literal: 'The passage concluded." Xuanzong wished to stress plowing encouragement and advanced fifty-odd steps in plowing, stopping only at the end of the ridge.',
    idiomatic: 'The quote ended. Xuanzong stressed plowing encouragement, advanced fifty-odd steps, and stopped at the ridge end.',
  },
  s0124: {
    literal: 'When rites ended, the carriage returned to the fast palace and a great amnesty was proclaimed.',
    idiomatic: 'Rites ended: return to fast palace, great amnesty.',
  },
  s0125: {
    literal: 'Officials who attended plowing and held the ox were all rewarded with silk by rank.',
    idiomatic: 'Plowing attendants and ox handlers received silk by rank.',
  },
  s0126: {
    literal: 'In Kaiyuan 26 Xuanzong again personally went to the eastern suburb to receive qi and sacrificed to the Green Emperor with Gou Mang as associate; the Year Star and Three Chronograms and Seven Lodgings attended.',
    idiomatic: 'Kaiyuan 26: Xuanzong received qi at eastern suburb, sacrificed to Green Emperor with Gou Mang, Year Star, Three Chronograms, and Seven Lodgings attending.',
  },
  s0127: {
    literal: 'The altar had originally been outside Spring Bright Gate; Xuanzong found the sacrifice site cramped and first moved it east of the Chan River, facing Wangchun Palace.',
    idiomatic: 'The altar had been outside Spring Bright Gate; Xuanzong moved it east of the Chan facing Wangchun Palace as cramped.',
  },
  s0128: {
    literal: 'The altar had one tier; the altar top and four sides were all green.',
    idiomatic: 'One-tier altar; top and four sides green.',
  },
  s0129: {
    literal: 'Gou Mang\'s altar was southeast.',
    idiomatic: 'Gou Mang\'s altar: southeast.',
  },
  s0130: {
    literal: 'From the Year Star down each had a small altar north of the green altar.',
    idiomatic: 'Year Star and below: small altars north of the green altar.',
  },
  s0131: {
    literal: 'At personal sacrifice auspicious snow fell; attendants below the altar and the hundred officials bowed in congratulation.',
    idiomatic: 'Personal sacrifice: auspicious snow; attendants and officials below bowed in congratulation.',
  },
  s0132: {
    literal: 'In the first month of Qianyuan 2, on dingchou, rites were to be held for the Nine Palaces spirits and sacred-field rites were also performed.',
    idiomatic: 'Qianyuan 2, first month dingchou: Nine Palaces spirits and sacred-field rites together.',
  },
  s0133: {
    literal: 'Exiting Bright Phoenix Gate to Tonghua Gate, the shaft-horse rite was released and entry made to the altar; lodging fast was kept in the palace.',
    idiomatic: 'Out Bright Phoenix Gate to Tonghua Gate, shaft-horse rite, into altar, fast in palace.',
  },
  s0134: {
    literal: 'On wuyin rites ended; about to plow the sacred field, he first went to the First Farmer altar.',
    idiomatic: 'Wuyin: rites ended; before sacred-field plowing, first to First Farmer altar.',
  },
  s0135: {
    literal: 'Inspecting the plow, he found carved ornament and said to attendants: "Field tools are held by farmers and should be plain—how ornament?',
    idiomatic: 'Inspecting the plow he found carving and asked attendants why farm tools should bear ornament.',
  },
  s0136: {
    literal: 'The passage concluded." He ordered them removed.',
    idiomatic: 'The quote ended. He ordered them removed.',
  },
  s0137: {
    literal: 'An edict stated: "Ancient emperors overseeing the realm all stressed agriculture and honored the root, keeping frugality first—thereby personally urging those below.',
    idiomatic: 'Edict: "Ancient emperors all stressed agriculture, honored the root, and kept frugality—personally urging those below.',
  },
  s0138: {
    literal: 'Now as eastern plowing opens the season, sacred-field affairs begin, wishing to encourage the common people—thus holding this plow.',
    idiomatic: 'Eastern plowing opens the season; sacred-field work begins to encourage the people—thus this plow.',
  },
  s0139: {
    literal: 'We hear the relevant offices\' farm tools were recklessly carved and ornamented, greatly violating statutes.',
    idiomatic: 'Relevant offices\' farm tools were recklessly carved—greatly violating statutes.',
  },
  s0140: {
    literal: 'Moreover dark shafts and light axles—former kings had fixed rules; exalting luxury violates governance.',
    idiomatic: 'Dark shafts and light axles had fixed rules; exalting luxury flaws governance.',
  },
  s0141: {
    literal: 'Reflecting on this, we sigh deeply—how is this my intent to emulate Yao and Shun and value thatched roofs!',
    idiomatic: 'Reflecting, we sigh—how is this emulating Yao and Shun and valuing thatched roofs!',
  },
  s0142: {
    literal: 'Carved and ornamented ones should cease.',
    idiomatic: 'Carved ornamentation should cease.',
  },
  s0143: {
    literal: 'Still order the relevant offices to follow ordinary farm patterns and remake them separately, so the myriad people may know our intent.',
    idiomatic: 'Order relevant offices to follow ordinary farm patterns and remake them so the people know our intent.',
  },
  s0144: {
    literal: 'The passage concluded." Next day jimao: sacrifice to Shen Nong with Hou Ji as joint offering.',
    idiomatic: 'The quote ended. Next day jimao: Shen Nong with Hou Ji joint offering.',
  },
  s0145: {
    literal: 'Suzong wore cap and vermilion knee-guards, personally held the plow and performed nine pushes.',
    idiomatic: 'Suzong capped and vermilion knee-guards, held the plow, nine pushes.',
  },
  s0146: {
    literal: 'Ritual officers memorialized that Your Majesty should perform three pushes; now it exceeds rite.',
    idiomatic: 'Ritual officers: Your Majesty should three-push; now exceeds rite.',
  },
  s0147: {
    literal: 'Suzong said: "I personally lead those below and should exceed it—I regret not finishing the thousand mu.',
    idiomatic: 'Suzong said he leads from the front and should exceed it—he regrets not finishing the thousand mu.',
  },
  s0148: {
    literal: 'The passage concluded." He then stood long, watching nobles, feudal lords, and imperial princes and below finish plowing.',
    idiomatic: 'The quote ended. He stood long watching nobles, lords, and princes finish plowing.',
  },
  s0149: {
    literal: 'In the first month of Zhenguan 14, on gengzi, the relevant offices were ordered to read the spring ordinance; an edict had the heads of the hundred offices ascend the Supreme Ultimate Hall and sit in rows facing inward to listen.',
    idiomatic: 'Zhenguan 14, first month gengzi: read spring ordinance; hundred-office heads sat at Supreme Ultimate Hall to listen.',
  },
  s0150: {
    literal: 'In Kaiyuan 26 Xuanzong ordered Director of Ritual Wei Tiao each month to present one section of the Monthly Ordinances.',
    idiomatic: 'Kaiyuan 26: Director of Ritual Wei Tiao monthly presented one Monthly Ordinances section.',
  },
  s0151: {
    literal: 'Thereafter on each early-month audience day Xuanzong attended Xuanzheng Hall; a couch was set to the side, a desk to the east, and Wei Tiao was ordered to sit and read.',
    idiomatic: 'Each early-month audience: Xuanzong at Xuanzheng Hall, side couch, east desk, Wei Tiao seated reading.',
  },
  s0152: {
    literal: 'Heads of the various offices also ascended the hall and sat in rows to listen.',
    idiomatic: 'Office heads also ascended and listened in rows.',
  },
  s0153: {
    literal: 'After more than a year it was discontinued.',
    idiomatic: 'After a year plus it ceased.',
  },
  s0154: {
    literal: 'On the first day of the twelfth month of Qianyuan 1, bingyin, Establishment of Spring; Suzong attended Xuanzheng Hall and ordered Director of Ritual Yu Xiulie to read the spring ordinance.',
    idiomatic: 'Qianyuan 1, twelfth month bingyin new moon, Establishment of Spring: Suzong at Xuanzheng Hall, Yu Xiulie read spring ordinance.',
  },
  s0155: {
    literal: 'Regular-attendance officials of fifth rank and above in substantive posts all ascended the hall and sat beforehand to listen.',
    idiomatic: 'Regular fifth-rank and above substantive officials ascended and listened.',
  },
  s0156: {
    literal: 'Former practice: for marchmounts and watercourses and below, after the prayer board was imperially signed, one bowed facing north twice.',
    idiomatic: 'Formerly: marchmounts and watercourses below—after imperial signature on prayer board, bow north twice.',
  },
  s0157: {
    literal: 'In the first year of Zhengsheng, the relevant offices memorialized: "We consider that the Son of Heaven takes Heaven as father and Earth as mother, the sun as elder brother and moon as elder sister—in rite they merit respect, hence the double-bow ceremony.',
    idiomatic: 'Zhengsheng 1: relevant offices said: "The Son of Heaven fathers Heaven and mothers Earth, brothers the sun and sisters the moon—hence double bow.',
  },
  s0158: {
    literal: 'We examine that the Five Marchmounts are treated like the Three Excellencies and the Four Watercourses like feudal lords; the Son of Heaven has no rite of bowing to dukes and marquises—we hold this reverses the order of honor and lowliness.',
    idiomatic: 'Five Marchmounts equal Three Excellencies, Four Watercourses equal lords; the Son of Heaven does not bow to dukes—this reverses honor and lowliness.',
  },
  s0159: {
    literal: 'The sun, moon, and below should follow former practice.',
    idiomatic: 'Sun, moon, and below: former practice.',
  },
  s0160: {
    literal: 'For the Five Marchmounts and below, sign but do not bow.',
    idiomatic: 'Five Marchmounts and below: sign, no bow.',
  },
  s0161: {
    literal: 'The passage concluded." The edict approved and it was followed.',
    idiomatic: 'The quote ended. Approved and followed.',
  },
  s0162: {
    literal: 'Zhenguan rites had no text on sacrificing to former dynasties\' emperors.',
    idiomatic: 'Zhenguan rites lacked sacrifice to former emperors.',
  },
  s0163: {
    literal: 'In the sixth month of Xianqing 2, Minister of Rites Xu Jingzong and others memorialized: "We have examined the Book of Rites \'Regulations of Sacrifice,\' which says: \'When the sage king fixed sacrifice, those whose law extended to the people were sacrificed; those who died in diligent service; those who labored to settle the state; those who could ward off great calamity; those who could repel great peril.\'',
    idiomatic: 'Xianqing 2, sixth month: Xu Jingzong memorialized: "Book of Rites \'Regulations of Sacrifice\' says: \'Sage kings sacrificed those whose law reached the people; who died in service; who labored to settle the state; who warded great calamity; who repelled great peril.\'',
  },
  s0164: {
    literal: 'The passage concluded." Furthermore: \'Yao, Shun, Yu, Tang, Wen, and Wu had merit and glory among the people, as did sun, moon, and stars that people behold;',
    idiomatic: 'The quote ended. Furthermore: \'Yao, Shun, Yu, Tang, Wen, and Wu had merit among the people, as sun, moon, and stars people behold;',
  },
  s0165: {
    literal: 'those not of this kind are not in the canon of sacrifice.\'',
    idiomatic: 'those not of this kind are outside the sacrifice canon.\'',
  },
  s0166: {
    literal: 'According to this, emperors should share the sun and moon\'s precedent and receive regular sacrifice—the meaning is repaying merit.',
    idiomatic: 'By this, emperors share the sun and moon\'s precedent with regular sacrifice—repaying merit.',
  },
  s0167: {
    literal: 'Down to the Sui, all followed this canon.',
    idiomatic: 'Through Sui all followed this canon.',
  },
  s0168: {
    literal: 'Han Gaozu\'s sacrifice regulations had no text, but from former ages to the present Qin and Han precedents were often followed.',
    idiomatic: 'Gaozu\'s regulations lacked text, but Qin and Han precedents were often followed.',
  },
  s0169: {
    literal: 'First Emperor was without the Way and therefore abandoned.',
    idiomatic: 'First Emperor was without the Way and abandoned.',
  },
  s0170: {
    literal: 'Han Founder\'s statutes and models were law handed down to later ages.',
    idiomatic: 'Han Founder\'s models became law for later ages.',
  },
  s0171: {
    literal: 'From Sui down they were also in the sacrifice precedents.',
    idiomatic: 'From Sui down they were also in sacrifice precedents.',
  },
  s0172: {
    literal: 'We consider that Great Tang examines antiquity and hands down transformation, gathering former canons—only this one rite has not been fully ordered.',
    idiomatic: 'Great Tang examines antiquity and gathers canons—only this rite lacks full order.',
  },
  s0173: {
    literal: 'Now we ask to follow precedent: sacrifice once every three years.',
    idiomatic: 'We ask to follow precedent: sacrifice every three years.',
  },
  s0174: {
    literal: 'In the mid-spring month sacrifice Tang Yao at Pingyang with Qi as associate;',
    idiomatic: 'Mid-spring: Yao at Pingyang, Qi paired;',
  },
  s0175: {
    literal: 'sacrifice Yu Shun at Hedong with Gao Yao as associate;',
    idiomatic: 'Shun at Hedong, Gao Yao paired;',
  },
  s0176: {
    literal: 'sacrifice Yu of Xia at Anyi with Bo Yi as associate;',
    idiomatic: 'Yu at Anyi, Bo Yi paired;',
  },
  s0177: {
    literal: 'sacrifice Tang of Yin at Yanshi with Yi Yin as associate;',
    idiomatic: 'Tang at Yanshi, Yi Yin paired;',
  },
  s0178: {
    literal: 'sacrifice King Wen of Zhou at Bang with Grand Duke as associate;',
    idiomatic: 'King Wen at Bang, Grand Duke paired;',
  },
  s0179: {
    literal: 'sacrifice King Wu at Hao with Duke of Zhou and Duke of Shao as associates;',
    idiomatic: 'King Wu at Hao, Duke of Zhou and Shao paired;',
  },
  s0180: {
    literal: 'sacrifice Han Gaozu at Changling with Xiao He as associate.',
    idiomatic: 'Gaozu at Changling, Xiao He paired.',
  },
  s0181: {
    literal: 'In the first month of Kaiyuan 22, an edict stated: "Ancient sage emperors and illustrious kings, marchmounts, watercourses, seas, and garrisons use victims of the great offering; the rest use wine and dried flesh for offerings.',
    idiomatic: 'Kaiyuan 22, first month: sage emperors, marchmounts, watercourses, seas, and garrisons take great-offering victims; the rest wine and dried flesh.',
  },
  s0182: {
    literal: 'The passage concluded." In the first month of the twenty-third year, an edict: "From now on, bright garments of silk and cloth shall be issued five days before sacrifice."',
    idiomatic: 'The quote ended. Year 23, first month: "From now bright garments issued five days before sacrifice."',
  },
  s0183: {
    literal: 'The passage concluded." On dingyou, an edict: "From now on, for great sacrifices, chancellor, special advancement, opening the government, junior guardian, junior mentor, minister, and censor-in-chief should be dispatched to perform the rite."',
    idiomatic: 'The quote ended. Dingyou: "Great sacrifices: chancellor, special advancement, opening government, junior guardian, junior mentor, minister, and censor-in-chief perform by proxy."',
  },
  s0184: {
    literal: 'The passage concluded." In the first month of Tianbao 6, an edict: "Three Sovereigns and Five Emperors shall have magistrates and assistants set up in the capital."',
    idiomatic: 'The quote ended. Tianbao 6, first month: "Three Sovereigns and Five Emperors: capital magistrates and assistants."',
  },
  s0185: {
    literal: 'The passage concluded." In the fifth month of the seventh year, an edict: "Emperors before the Three Sovereigns should jointly have temple officers set up in the capital.',
    idiomatic: 'The quote ended. Year 7, fifth month: "Pre-Three Sovereigns emperors: joint capital temple officers.',
  },
  s0186: {
    literal: 'Wherever former emperors first rose or merit was commendable, loyal ministers, righteous gentlemen, filial wives and steadfast women—each place should also set up one shrine.',
    idiomatic: 'Where emperors first rose or merit shone, loyal ministers, righteous men, filial wives and steadfast women: one shrine each.',
  },
  s0187: {
    literal: 'Jinyang Perfected Ones and the like were posthumously enfeoffed; where they attained the Way and ascended as immortals, Daoist priests were ordained to tend incense forever.',
    idiomatic: 'Jinyang Perfected Ones and the like were posthumously enfeoffed; immortal ascension sites received ordained priests for perpetual incense.',
  },
  s0188: {
    literal: 'The passage concluded." In the ninth month of the ninth year, Recluse Cui Chang presented the "Great Tang Five-Phase Responsive Calendar," holding that fifty generations of kings make one thousand years, and asked the state to succeed Zhou and Han with Zhou and Sui as intercalary.',
    idiomatic: 'The quote ended. Ninth year, ninth month: Recluse Cui Chang presented the "Great Tang Five-Phase Responsive Calendar," fifty generations per millennium, asking succession to Zhou and Han with Zhou and Sui intercalary.',
  },
  s0189: {
    literal: 'In the eleventh month, an edict: "Tang succeeds after Han; King Wu of Zhou and Han Gaozu shall share one temple and officers.',
    idiomatic: 'Eleventh month: Tang succeeds Han; King Wu of Zhou and Han Gaozu share one temple and officers.',
  },
  s0190: {
    literal: 'The passage concluded." In the ninth month of the twelfth year, Wei, Zhou, and Sui remained the three former kings; Han Duke, Jie, and Xi Duke and the like were enfeoffed, still with five temples.',
    idiomatic: 'The quote ended. Twelfth year, ninth month: Wei, Zhou, and Sui as three former kings; Han, Jie, and Xi dukes enfeoffed, five temples unchanged.',
  },
  s0191: {
    literal: 'In the first month of Tianbao 6, an edict: great sacrifices use reddish calves and quantities are reduced.',
    idiomatic: 'Tianbao 6, first month: great sacrifices use reddish calves; quantities reduced.',
  },
  s0192: {
    literal: 'In the intercalary fourth month of Shangyuan 1, the era was changed; an edict because the year was lean stopped middle and small sacrifice offerings.',
    idiomatic: 'Shangyuan 1 intercalary fourth month: era changed; lean year stopped middle and small sacrifices.',
  },
  s0193: {
    literal: 'In mid-autumn of that year, sacrifice to Literary Sage at the Imperial Academy was restored.',
    idiomatic: 'That year mid-autumn: Literary Sage at Imperial Academy restored.',
  },
  s0194: {
    literal: 'In Yongtai 2, drought lasted many months through spring and summer; an edict had ministers Pei Mian and more than ten others sacrifice separately at rivers and watercourses to pray for rain.',
    idiomatic: 'Yongtai 2: months of spring-summer drought; Pei Mian and ten-plus ministers sacrificed at rivers and watercourses for rain.',
  },
  s0195: {
    literal: 'Ritual Commissioner Right Regular Attendant Yu Xiulie asked to restore former sacrifice to Wind Lord and Rain Master at the old capital-gate altars as middle sacrifice; approved.',
    idiomatic: 'Ritual Commissioner Yu Xiulie asked Wind Lord and Rain Master restored at old gate altars as middle sacrifice; approved.',
  },
  s0196: {
    literal: 'In Wude 2 of Gaozu, the National University established shrines to Duke of Zhou and Confucius.',
    idiomatic: 'Gaozu Wude 2: National University established Duke of Zhou and Confucius shrines.',
  },
  s0197: {
    literal: 'On the twenty-seventh day of the second month of the seventh year, an edict: "In prefectures where those who have mastered one classic or more have not been promoted, the local authority shall present them by name; the relevant offices test by policy questions and all receive appointment.',
    idiomatic: 'Year 7, second month twenty-seventh: prefectures with classicists not yet promoted present by name; offices test by policy and appoint.',
  },
  s0198: {
    literal: 'Officials\' and commoners\' sons who are keen and aspire to learning should also be reported by name; ranks are assigned by measure and all are assigned to study.',
    idiomatic: 'Keen officials\' and commoners\' sons: report by name, rank by measure, assign to study.',
  },
  s0199: {
    literal: 'Prefectures, counties, and townships should all establish schools.',
    idiomatic: 'Prefectures, counties, and townships: establish schools.',
  },
  s0200: {
    literal: 'The passage concluded." On dingyou, he visited the National University and personally performed the libation rite.',
    idiomatic: 'The quote ended. Dingyou: visited National University and performed libation in person.',
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
if (data.metadata.chapter !== '024') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 024; standalone T ready (${Object.keys(T).length} entries).`
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
