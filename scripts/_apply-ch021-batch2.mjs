#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Jiutangshu ch.021, ritual/music treatise) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/021.json';
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
    literal: 'On full-fast days only matters of sacrifice may proceed; all else is cut off.',
    idiomatic: 'Full fast: only cult business; everything else stops.',
  },
  s0102: {
    literal: 'For great sacrifice, on dispersal-fast days all fast officers assemble at the Department of State Affairs to receive the oath; the Grand Mentor reads the oath text.',
    idiomatic: 'Great sacrifice: fast officers gather at the Secretariat on dispersal day for the oath, read by the Grand Mentor.',
  },
  s0103: {
    literal: 'On full-fast days the Three Excellencies are lodged at the Department of State Affairs;',
    idiomatic: 'Full fast: Three Excellencies stay at the Secretariat;',
  },
  s0104: {
    literal: 'other officers each at his own office; if there is no office within the Imperial City, at the Director of Ritual\'s suburban-altar or ancestral-temple sections.',
    idiomatic: 'others at their bureaus, or at Ritual\'s suburban or temple offices inside the city.',
  },
  s0105: {
    literal: 'All arrive at the fast lodge before the sun has risen.',
    idiomatic: 'All reach the fast lodge before dawn.',
  },
  s0106: {
    literal: 'On the day before sacrifice each leaves the fast lodge at the fifth mark after the day clepsydra has been set and proceeds toward the shrine.',
    idiomatic: 'Eve of sacrifice: leave fast lodge at day clepsydra mark five and go to the shrine.',
  },
  s0107: {
    literal: 'Officers receiving the spirit all bathe and are given bright garments.',
    idiomatic: 'Spirit-receiving officers bathe and receive bright robes.',
  },
  s0108: {
    literal: 'If the Son of Heaven personally sacrifices, he performs the full-fast rite in the main hall.',
    idiomatic: 'If the emperor sacrifices in person, full fast is in the main hall.',
  },
  s0109: {
    literal: 'Civil and military officers wear trousers and jackets and attend in the court yard.',
    idiomatic: 'Civil and military officers wear military dress in the courtyard.',
  },
  s0110: {
    literal: 'Where the imperial carriage and fast officers travel to the sacrifice, along prefectures and counties and where the Golden Crow clears the road, one must not see anything inauspicious or mourners in hemp; if sounds of weeping reach the sacrifice place they are provisionally stopped, and after the affair ends things return as before.',
    idiomatic: 'Processional routes were cleared of mourning and pollution; weeping near the shrine was silenced until rites ended.',
  },
  s0111: {
    literal: 'When fast officers reach the shrine, the Imperial Kitchen sets out food only.',
    idiomatic: 'At the shrine the Imperial Kitchen served food only.',
  },
  s0112: {
    literal: 'After sacrifice, according to rank order they partake of the offering; when finished, the sacrificial flesh is equally divided—the noble are not given double, the lowly are not left empty.',
    idiomatic: 'After rites, ranked feasting; sacrificial meat shared—nobles not doubled, commoners not cheated.',
  },
  s0113: {
    literal: 'Middle sacrifice and below only do not receive the oath; otherwise all is the same as great sacrifice.',
    idiomatic: 'Below middle sacrifice: no oath; otherwise as great sacrifice.',
  },
  s0114: {
    literal: 'At the beginning of Wude, the statute was fixed:',
    idiomatic: 'Wude era statute:',
  },
  s0115: {
    literal: 'Each year at the winter solstice sacrifice to August Lord at the Round Mound, with Emperor Jing as associate.',
    idiomatic: 'Winter solstice: August Lord at Round Mound, Jing as associate.',
  },
  s0116: {
    literal: 'The altar is two li east of the road outside Bright Virtue Gate in the capital.',
    idiomatic: 'Altar two li east of Bright Virtue Gate road.',
  },
  s0117: {
    literal: 'The altar has four tiers, each eight chi one cun high; the lowest tier twenty zhang wide, the second fifteen, the third ten, the fourth five.',
    idiomatic: 'Four tiers eight chi one cun each: bottom twenty zhang, then fifteen, ten, five.',
  },
  s0118: {
    literal: 'At each sacrifice August Lord and the associate are set on the level terrace; straw mats are used, vessels pottery.',
    idiomatic: 'Each rite: Lord and associate on level terrace, straw mats, pottery vessels.',
  },
  s0119: {
    literal: 'Five Directional Emperors, sun and moon, inner officials, central officials, outer officials, and all stars are jointly sacrificed.',
    idiomatic: 'Five Emperors, sun, moon, inner, central, outer officials, and stars all joined.',
  },
  s0120: {
    literal: 'The Five Directional Emperors and the seven of sun and moon are on the altar\'s second tier;',
    idiomatic: 'Five Emperors and seven sun-moon seats on tier two;',
  },
  s0121: {
    literal: 'the fifty-five seats of inner five stars and below on the third tier;',
    idiomatic: 'fifty-five inner star seats on tier three;',
  },
  s0122: {
    literal: 'the one hundred thirty-five seats of twenty-eight lodges and below central officials on the fourth tier;',
    idiomatic: 'one hundred thirty-five central seats on tier four;',
  },
  s0123: {
    literal: 'one hundred twelve outer-official seats inside the outer enclosure below the altar;',
    idiomatic: 'one hundred twelve outer seats inside the outer mound;',
  },
  s0124: {
    literal: 'three hundred sixty seats of all stars outside the outer enclosure.',
    idiomatic: 'three hundred sixty common stars outside the mound.',
  },
  s0125: {
    literal: 'Victims: for the Lord and associate two dark bullocks; for Five Emperors and sun and moon one bullock each in the direction\'s color; for inner officials and below add nine sheep and nine pigs each.',
    idiomatic: 'Victims: Lord and associate two dark bulls; Five Emperors and sun-moon one colored bull each; inner and below plus nine sheep and nine pigs.',
  },
  s0126: {
    literal: 'At the summer solstice sacrifice to Imperial Earth Spirit at the Square Mound, also with Emperor Jing as associate.',
    idiomatic: 'Summer solstice: Earth Spirit at Square Mound, Jing associate.',
  },
  s0127: {
    literal: 'The altar is fourteen li north of the palace city.',
    idiomatic: 'Altar fourteen li north of the palace.',
  },
  s0128: {
    literal: 'The altar has two tiers; the lower square ten zhang, the upper five.',
    idiomatic: 'Two tiers: lower ten zhang square, upper five.',
  },
  s0129: {
    literal: 'At each sacrifice Earth Spirit and associate on the altar; Spirit Land, Five Peaks, Four Guardians, Four Streams, Four Seas, Five Directions, mountains forests rivers marshes, hills mounds plains and lowlands—all jointly sacrificed.',
    idiomatic: 'Earth and associate on mound; Spirit Land, peaks, guardians, streams, seas, directions, landforms—all joined.',
  },
  s0130: {
    literal: 'Spirit Land is on the altar\'s second tier.',
    idiomatic: 'Spirit Land on tier two.',
  },
  s0131: {
    literal: 'Thirty-seven seats from Five Peaks and below inside the outer enclosure.',
    idiomatic: 'Thirty-seven peak-and-below seats inside outer mound.',
  },
  s0132: {
    literal: 'Thirty seats of hills and mounds and the like outside the enclosure.',
    idiomatic: 'Thirty landform seats outside the mound.',
  },
  s0133: {
    literal: 'Victims: Earth Spirit and associate two bullocks; Spirit Land one dark bull; peaks and below add five sheep and five pigs each.',
    idiomatic: 'Victims: Earth and associate two bulls; Spirit Land one dark bull; peaks and below five sheep and five pigs.',
  },
  s0134: {
    literal: 'First month xin day: pray for grain, sacrifice to the Impulse Emperor at the southern suburb, Emperor Yuan as associate, victims two dark bullocks.',
    idiomatic: 'First month xin: grain prayer at southern suburb to Impulse Emperor, Yuan associate, two dark bulls.',
  },
  s0135: {
    literal: 'Fourth month: rain sacrifice to August Lord at Round Mound, Jing associate, victims two dark bullocks.',
    idiomatic: 'Fourth month: rain rite at Round Mound, Jing associate, two dark bulls.',
  },
  s0136: {
    literal: 'Five Directional Emperors, Five Human Emperors, and Five Officials all jointly sacrificed; ten bullocks in direction colors.',
    idiomatic: 'Five Emperors, Five Humans, Five Officials joined; ten colored bulls.',
  },
  s0137: {
    literal: 'Last month of autumn: sacrifice to Five Directional Emperors at Bright Hall, Yuan associate, victims two dark bullocks.',
    idiomatic: 'Late autumn: Five Emperors at Bright Hall, Yuan associate, two dark bulls.',
  },
  s0138: {
    literal: 'Five Human Emperors and Five Officials jointly sacrificed; ten bullocks in direction colors.',
    idiomatic: 'Five Humans and Five Officials joined; ten colored bulls.',
  },
  s0139: {
    literal: 'First month of winter: sacrifice to Spirit Land at northern suburb, Jing associate, victims two dark bullocks.',
    idiomatic: 'Early winter: Spirit Land at northern suburb, Jing associate, two dark bulls.',
  },
  s0140: {
    literal: 'Early Zhenguan, an edict made Gaozu associate at Round Mound and Bright Hall northern suburb; Emperor Yuan alone associated at Impulse Emperor; the rest all followed Wude.',
    idiomatic: 'Early Zhenguan: Gaozu paired at Round Mound and Bright Hall north suburb; Yuan alone at Impulse Emperor; rest per Wude.',
  },
  s0141: {
    literal: 'Second year of Yonghui, again Taizong was made associate at Bright Hall sacrifice; the office then made Gaozu associate with the Five Heavenly Emperors and Taizong with the Five Human Emperors.',
    idiomatic: 'Yonghui 2: Taizong paired at Bright Hall; office made Gaozu pair Five Heavens and Taizong Five Humans.',
  },
  s0142: {
    literal: 'First year of Xianqing, Grand Mentor Zhangsun Wuji and ritual officers memorialized:',
    idiomatic: 'Xianqing 1: Wuji and ritual officers memorialized:',
  },
  s0143: {
    literal: 'We have carefully traced the registers and examined former regulations: ancestral sacrifice at Bright Hall must pair the Heavenly Emperor; Fuxi and the five generations originally paired at the five suburbs and entered the hall only as joint sacrifice.',
    idiomatic: 'Registers show Bright Hall must pair the Heavenly Emperor; Fuxi\'s five generations paired at five suburbs and entered the hall only as attendants.',
  },
  s0144: {
    literal: 'Now to make Taizong the associate has reason in showing repose.',
    idiomatic: 'Making Taizong the associate shows proper repose.',
  },
  s0145: {
    literal: 'We observe that in the seventh month of Yonghui 2 an edict built Bright Hall; Your Majesty\'s sage virtue pursues Taizong and already follows strict pairing.',
    idiomatic: 'Yonghui 2.7 built Bright Hall; Your Majesty already honors strict pairing for Taizong.',
  },
  s0146: {
    literal: 'At the time Gaozu was already in Bright Hall; the ritual office was confused and never moved the sacrifice, following inclination to fix the ceremony and then putting it in statute.',
    idiomatic: 'Gaozu was already in Bright Hall; ritual officers never moved him, improvised, and codified it.',
  },
  s0147: {
    literal: 'Thus Taizong was demoted to pair with the Five Human Emperors; though also in Bright Hall he could not face the Heavenly Emperor—deeply contrary to the edict\'s intent and also unlike former canon.',
    idiomatic: 'Taizong was demoted to Five Humans—still in Bright Hall but not facing Heaven, against edict and canon.',
  },
  s0148: {
    literal: 'We examine the Classic of Filial Piety: "Of filial piety none is greater than honoring the father; of honoring the father none is greater than pairing with Heaven.',
    idiomatic: 'The Classic of Filial Piety says: "No filial piety exceeds honoring the father; no honoring the father exceeds pairing with Heaven.',
  },
  s0149: {
    literal: 'In antiquity the Duke of Zhou ancestrally sacrificed to King Wen at Bright Hall to pair with the Lord on High.',
    idiomatic: 'Antiquity: the Duke of Zhou sacrificed to Wen at Bright Hall to pair with the Lord on High.',
  },
  s0150: {
    literal: 'We observe the edict\'s meaning lies in this.',
    idiomatic: 'The edict\'s meaning lies here.',
  },
  s0151: {
    literal: 'What the office now implements in statute is greatly contrary to the intent.',
    idiomatic: 'Current statute greatly misses the intent.',
  },
  s0152: {
    literal: 'Again tracing Han, Wei, Jin, and Song ritual through the ages, none has father and son jointly paired at Bright Hall.',
    idiomatic: 'Han through Song show no father-son joint pairing at Bright Hall.',
  },
  s0153: {
    literal: 'Only the Canon of Sacrifices says: "The Zhou people di to Ku and jiao to Ji, zu to Wen and zong to Wu."',
    idiomatic: 'Only the Canon of Sacrifices says: "Zhou di to Ku, jiao to Ji, zu to Wen, zong to Wu."',
  },
  s0154: {
    literal: '" Zheng Xuan\'s commentary says: "Di, jiao, zu, and zong mean sacrifice with paired offerings."',
    idiomatic: 'Zheng Xuan comments: "Di, jiao, zu, and zong mean sacrifice with paired food."',
  },
  s0155: {
    literal: 'Di means sacrificing to August Lord at the Round Mound; jiao means sacrificing to the Lord at the southern suburb; zu and zong mean sacrificing to the Five Emperors and Five Spirits at Bright Hall."',
    idiomatic: 'Di is August Lord at Round Mound; jiao is the Lord at southern suburb; zu and zong are Five Emperors and Five Spirits at Bright Hall."',
  },
  s0156: {
    literal: '" Pursuing this commentary of Zheng, he takes zu and zong as one sacrifice and also Wen and Wu together at Bright Hall, joining mats in paired sacrifice—a clear error.',
    idiomatic: 'Pursuing Zheng\'s note, he merges zu and zong and pairs Wen and Wu at Bright Hall on shared mats—a clear error.',
  },
  s0157: {
    literal: 'Thus Wang Su rebutted: "In antiquity zu honored merit and zong honored virtue—zu and zong are names that are not destroyed, not meaning paired food at Bright Hall."',
    idiomatic: 'Wang Su rebutted: "Antiquity\'s zu and zong were undying honorific titles, not Bright Hall paired food."',
  },
  s0158: {
    literal: 'If Zheng\'s meaning holds, the Classic of Filial Piety should say zu sacrifice to Wen at Bright Hall and could not say zong sacrifice.',
    idiomatic: 'If Zheng were right, Filial Piety would say zu at Bright Hall, not zong.',
  },
  s0159: {
    literal: 'As for zong, it means honor.',
    idiomatic: 'Zong means honor.',
  },
  s0160: {
    literal: 'The Zhou already zu their temple and again honored their sacrifice—who says zu at Bright Hall?',
    idiomatic: 'Zhou already had temple zu and honored sacrifice—who says Bright Hall zu?',
  },
  s0161: {
    literal: '" Zheng cited the Classic of Filial Piety to explain the Canon of Sacrifices but did not understand the Duke of Zhou\'s original intent—utterly not Confucius\'s meaning.',
    idiomatic: 'Zheng used Filial Piety to explain the Canon but missed the Duke of Zhou—far from Confucius.',
  },
  s0162: {
    literal: 'Again explaining "zong Wu" he said: "Pairing with Gou Mang and the like—called the Five Spirits, rank below the hall."',
    idiomatic: 'On "zong Wu" he said pairing Gou Mang and the like—Five Spirits below the hall.',
  },
  s0163: {
    literal: '" Wu demoted in rank violates lord-order.',
    idiomatic: 'Demoting Wu breaks lord-order.',
  },
  s0164: {
    literal: 'Again the Six Secret Teachings says: "When Wu Wang attacked Zhou, snow was more than a zhang deep; five chariots and two horses left no tracks as he went to camp to seek audience."',
    idiomatic: 'The Six Secret Teachings says: "Wu Wang attacked Zhou; snow a zhang deep; five chariots and two horses left no tracks seeking audience at camp."',
  },
  s0165: {
    literal: 'Wu Wang marveled and asked; Grand Duke Taigong replied: "These must be the spirits of the five directions come to receive orders."',
    idiomatic: 'Wu Wang asked; Taigong said: "These are five-direction spirits come to receive orders."',
  },
  s0166: {
    literal: '" He summoned them by name; each was charged with his office.',
    idiomatic: 'He summoned each by name and charged each with office.',
  },
  s0167: {
    literal: 'Afterward he conquered Yin and wind and rain were harmonious."',
    idiomatic: 'Then he conquered Yin and weather obeyed."',
  },
  s0168: {
    literal: '" How could spirits who received office in life after death be paired together—demoting the honored and equaling the base is not reasonable.',
    idiomatic: 'Spirits who served in life cannot be paired in death—honor cannot equal the low.',
  },
  s0169: {
    literal: 'Thus the Outer Tradition of the Spring and Autumn says: "Di, jiao, zu, zong, and bao—the five are the state\'s canonical sacrifices."',
    idiomatic: 'The Spring and Autumn Outer Tradition says: "Di, jiao, zu, zong, and bao—five canonical state sacrifices."',
  },
  s0170: {
    literal: '" The Tradition speaks of five; thus one knows each is a separate affair, not that zu and zong are jointly sacrificed at Bright Hall.',
    idiomatic: 'Five means five separate rites—not joint zu-zong at Bright Hall.',
  },
  s0171: {
    literal: 'We respectfully examine upward through Yin and Zhou and down to Zhenguan; none has two emperors of one generation jointly paired at Bright Hall.',
    idiomatic: 'From Yin and Zhou through Zhenguan, no one generation paired two emperors at Bright Hall.',
  },
  s0172: {
    literal: 'Southern Qi\'s Xiao clan paired Wu and Ming as brothers at Bright Hall—unorthodox and not to be cited.',
    idiomatic: 'Southern Qi paired Wu and Ming as brothers at Bright Hall—too irregular to cite.',
  },
  s0173: {
    literal: 'Again checking Wude statute, Emperor Yuan was paired at Bright Hall and also paired at Impulse Emperor.',
    idiomatic: 'Wude paired Yuan at Bright Hall and Impulse Emperor.',
  },
  s0174: {
    literal: 'Early Zhenguan, following feeling and reforming ritual, sacrificed to Gaozu at Bright Hall and moved Shizu to pair only at Impulse Emperor.',
    idiomatic: 'Early Zhenguan paired Gaozu at Bright Hall and moved Shizu to Impulse Emperor alone.',
  },
  s0175: {
    literal: 'This is already the holy dynasty\'s precedent with succession in the canon, taking the ancestral temple as model—ancient regulation.',
    idiomatic: 'That is already Tang precedent modeled on the temple—ancient rule.',
  },
  s0176: {
    literal: 'We observe that Grand Ancestor Emperor Jing founded the house in Zhou and built an unprecedented great enterprise;',
    idiomatic: 'Grand Ancestor Jing founded the house in Zhou with unmatched achievement;',
  },
  s0177: {
    literal: 'he opened the mandate at Fen and Jin and founded the sage dynasty\'s vast foundation.',
    idiomatic: 'he opened the mandate at Fen and Jin and laid the sage foundation.',
  },
  s0178: {
    literal: 'Virtue surpassed birth; the Way matched establishing the pole.',
    idiomatic: 'Virtue surpassed generation; the Way matched the cosmic pole.',
  },
  s0179: {
    literal: 'Again Shizu Emperor Yuan concealed his scales and hoarded blessing, bent the Way to serve Zhou, guided the spirit source of dredging and issuing, and began the flowing blessing of glorious dwelling.',
    idiomatic: 'Shizu Yuan concealed blessing, served Zhou, and opened the house\'s flowing fortune.',
  },
  s0180: {
    literal: 'Called zu in the clear temple, ten thousand generations unmoved.',
    idiomatic: 'As zu in the clear temple, unmoved for ten thousand generations.',
  },
  s0181: {
    literal: 'We ask to stop paired sacrifice to accord with ancient meaning.',
    idiomatic: 'Stop paired sacrifice to match antiquity.',
  },
  s0182: {
    literal: 'We observe that Grand Ancestor Taizu received Heaven\'s mandate, embraced the Spirit Land, created institutions and changed things, embodied the origin and dwelt in correctness, was the state\'s founding ancestor, and indeed has old statute.',
    idiomatic: 'Taizu received mandate, held the realm, founded institutions—founding ancestor with old statute.',
  },
  s0183: {
    literal: 'Formerly Han Gaodi and Wei\'s founding ancestor, all upon receiving the mandate by precedent paired with Heaven.',
    idiomatic: 'Han Gaodi and Wei\'s founder, on receiving mandate, paired with Heaven by precedent.',
  },
  s0184: {
    literal: 'We ask to follow the old fact and sacrifice to Gaozu at the Round Mound to pair with August Lord.',
    idiomatic: 'Follow precedent: sacrifice to Gaozu at Round Mound pairing August Lord.',
  },
  s0185: {
    literal: 'We observe Taizong Wen\'s Way reached the upper origin and merit cleared the lower streams, rescued the land\'s charcoal, and harmonized the great creation for the living; we ask to follow the edict and ancestrally sacrifice at Bright Hall to pair with the Lord on High.',
    idiomatic: 'Taizong\'s Way reached heaven and merit cleared earth; rescue the realm—ancestral sacrifice at Bright Hall pairing the Lord on High per edict.',
  },
  s0186: {
    literal: 'Again we ask to follow Wude precedent and also pair at Impulse Emperor as chief.',
    idiomatic: 'Also follow Wude: pair at Impulse Emperor as chief.',
  },
  s0187: {
    literal: 'Thus the two founders\' virtue is lofty, never moved from temple;',
    idiomatic: 'Two founders\' virtue is lofty, never moved from temple;',
  },
  s0188: {
    literal: 'the two sages\' merit is great, each pairing with Heaven.',
    idiomatic: 'two sages\' merit is great, each pairing with Heaven.',
  },
  s0189: {
    literal: 'Far it agrees with the Classic of Filial Piety; near it declares the edict\'s intent.',
    idiomatic: 'It agrees with Filial Piety and declares the edict.',
  },
  s0190: {
    literal: 'Seventh month, second year, Minister of Rites Xu Jingzong and ritual officers again memorialized:',
    idiomatic: 'Year 2, month 7: Xu Jingzong and ritual officers memorialized again:',
  },
  s0191: {
    literal: 'According to the sacrifice statute and new ritual, all use Zheng Xuan\'s six-Heavens theory: Round Mound sacrifices August Lord; southern suburb sacrifices Supreme Palace Impulse Emperor; Bright Hall sacrifices Supreme Palace Five Emperors.',
    idiomatic: 'Statute and new ritual follow Zheng Xuan\'s six Heavens: Round Mound August Lord; southern suburb Supreme Palace Impulse Emperor; Bright Hall Supreme Palace Five Emperors.',
  },
  s0192: {
    literal: 'We examine Zheng Xuan\'s meaning: it relies only on weft books; the six Heavens spoken of are all star images, while August Lord does not belong to the azure sky.',
    idiomatic: 'Zheng relies on weft books; his six Heavens are stars—August Lord is not the sky.',
  },
  s0193: {
    literal: 'Thus in commentary on the Monthly Ordinances and Offices of Zhou he all says the Lord on High sacrificed at Round Mound is North Star Brilliant Essence.',
    idiomatic: 'He says Round Mound\'s Lord on High is North Star Brilliant Essence.',
  },
  s0194: {
    literal: 'Again explaining the Classic of Filial Piety "jiao sacrifice to Hou Ji to pair with Heaven" and Bright Hall honoring the father to pair with Heaven, all as Supreme Palace Five Emperors.',
    idiomatic: 'He makes Filial Piety\'s Hou Ji pairing Heaven and Bright Hall father pairing Heaven mean Supreme Palace Five Emperors.',
  },
  s0195: {
    literal: 'Examining what he says, the error is especially deep.',
    idiomatic: 'His doctrine is deeply wrong.',
  },
  s0196: {
    literal: 'The Book of Changes says: "Sun and moon are attached to Heaven; the hundred grains and grasses are attached to Earth."',
    idiomatic: 'The Changes says: "Sun and moon cling to Heaven; grain and grass cling to Earth."',
  },
  s0197: {
    literal: '" Again it says: "In Heaven forms are completed; on Earth forms take shape."',
    idiomatic: 'Again: "In Heaven forms complete; on Earth forms take shape."',
  },
  s0198: {
    literal: '" This suffices to show that star images are not Heaven and grasses are not Earth.',
    idiomatic: 'That shows stars are not Heaven and plants are not Earth.',
  },
  s0199: {
    literal: 'The Mao Odes Commentary says: "Primordial qi is vast and great—then it is called August Heaven.',
    idiomatic: 'The Mao Commentary says: "Primordial qi vast and great is called August Heaven.',
  },
  s0200: {
    literal: 'Gazing far one sees the blue—then it is called Azure Heaven."',
    idiomatic: 'Gazing far at blue is called Azure Heaven."',
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
