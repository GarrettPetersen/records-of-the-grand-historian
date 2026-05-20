#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.029, Rites 5 / court music) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/029.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 1;
const END = 100;

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
  s0001: {
    literal: 'After Gaozu ascended the throne, banquet entertainments followed Sui custom and used the music of the Nine Departments; later it was divided into standing and seated sections.',
    idiomatic: 'Once Gaozu took the throne, court feasts kept the Sui practice of Nine Departments music, then split into standing and seated troupes.',
  },
  s0002: {
    literal: 'Today the standing-section entertainers have Anle, Taiping Le, Pozhen Le, Qingshan Le, Dading Le, Shangyuan Le, Shengshou Le, and Lesheng Le—eight pieces in all.',
    idiomatic: 'The standing troupe now performs eight pieces: Anle, Taiping Le, Pozhen Le, Qingshan Le, Dading Le, Shangyuan Le, Shengshou Le, and Lesheng Le.',
  },
  s0003: {
    literal: 'Anle was composed when Emperor Wu of Later Zhou pacified Qi.',
    idiomatic: 'Anle dates to Emperor Wu of Later Zhou\'s conquest of Qi.',
  },
  s0004: {
    literal: 'The ranks are square and upright, imitating city walls; the Zhou called it the City Dance.',
    idiomatic: 'Dancers form a square grid like ramparts—the Zhou named it the City Dance.',
  },
  s0005: {
    literal: 'Eighty dancers.',
    idiomatic: 'Eighty dancers perform it.',
  },
  s0006: {
    literal: 'Wooden faces are carved, with dog snouts and beast ears, gilt; hanging threads serve as hair, and ya-pelt caps are painted on.',
    idiomatic: 'They wear carved wooden masks—dog muzzle, beast ears, gilded—with thread hair and painted ya-fur caps.',
  },
  s0007: {
    literal: 'The dance postures still imitate Qiang and Hu forms.',
    idiomatic: 'The choreography still mimics Qiang and Hu styles.',
  },
  s0008: {
    literal: 'Taiping Le is also called the Five-Direction Lion Dance.',
    idiomatic: 'Taiping Le is also known as the Five-Direction Lion Dance.',
  },
  s0009: {
    literal: 'The lion is a fierce beast from the southwestern barbarians\' lands of Tianzhu, Shizi, and the like.',
    idiomatic: 'Lions—fierce beasts—came from southwestern realms such as Tianzhu and Shizi.',
  },
  s0010: {
    literal: 'They are made by stitching fur; a person stands inside and mimics bowing, rising, and tameness.',
    idiomatic: 'Fur is stitched into lion suits; dancers inside mimic crouch, rise, and tame play.',
  },
  s0011: {
    literal: 'Two men hold ropes and wield whisks, acting the trainers.',
    idiomatic: 'Two handlers with rope and whisk play the trainers.',
  },
  s0012: {
    literal: 'Five lions each stand in its directional color.',
    idiomatic: 'Five lions, each in its direction\'s color.',
  },
  s0013: {
    literal: 'One hundred forty persons sing Taiping Le; they dance with the feet; the rope-holders dress as Kunlun figures.',
    idiomatic: 'One hundred forty singers perform Taiping Le, stamping the dance; rope-bearers dress as Kunlun attendants.',
  },
  s0014: {
    literal: 'Pozhen Le was made by Taizong.',
    idiomatic: 'Taizong composed Pozhen Le.',
  },
  s0015: {
    literal: 'When Taizong was Prince of Qin, campaigning on all sides, folk ballads sang the tune of Prince of Qin Breaking the Formation.',
    idiomatic: 'As Prince of Qin he campaigned everywhere; people already sang Prince of Qin Breaking the Formation.',
  },
  s0016: {
    literal: 'When he took the throne, he had Lü Cai harmonize the tones, and Li Baiyao, Yu Shinan, Chu Liang, Wei Zheng, and others compose the lyrics.',
    idiomatic: 'At his accession Lü Cai set the pitch while Li Baiyao, Yu Shinan, Chu Liang, Wei Zheng, and others wrote the words.',
  },
  s0017: {
    literal: 'One hundred twenty men wear armor and hold halberds; the armor is trimmed in silver.',
    idiomatic: 'One hundred twenty armored men bear halberds, armor edged in silver.',
  },
  s0018: {
    literal: 'They thrust and stamp with force; the sound is bold and stirring.',
    idiomatic: 'They stamp and thrust fiercely; the music is bold and stirring.',
  },
  s0019: {
    literal: 'When it is played at banquets, the Son of Heaven leaves his seat and all seated at the feast rise.',
    idiomatic: 'At banquets the emperor steps aside and every guest stands when it plays.',
  },
  s0020: {
    literal: 'Qingshan Le was made by Taizong.',
    idiomatic: 'Taizong also composed Qingshan Le.',
  },
  s0021: {
    literal: 'Taizong was born at Qingshan Palace in Wugong; once exalted, he feasted in the palace, composed a poem, and set it to strings and pipes.',
    idiomatic: 'Born at Qingshan Palace in Wugong, he later feasted there as emperor, wrote a poem, and scored it for orchestra.',
  },
  s0022: {
    literal: 'Sixty-four dancers.',
    idiomatic: 'The troupe numbers sixty-four.',
  },
  s0023: {
    literal: 'They wear purple robes with great sleeves and jacket-skirts, lacquered topknots, and leather shoes.',
    idiomatic: 'Costume: purple great-sleeved jackets, lacquered topknots, leather shoes.',
  },
  s0024: {
    literal: 'The dance is calm and slow, to represent civil virtue spreading and the realm at peace.',
    idiomatic: 'The dance moves slowly, showing civil virtue at peace under heaven.',
  },
  s0025: {
    literal: 'Dading Le derives from Pozhen Le.',
    idiomatic: 'Dading Le grew out of Pozhen Le.',
  },
  s0026: {
    literal: 'One hundred forty dancers.',
    idiomatic: 'One hundred forty perform.',
  },
  s0027: {
    literal: 'They wear five-colored patterned armor and hold spears.',
    idiomatic: 'They wear five-colored patterned armor and carry spears.',
  },
  s0028: {
    literal: 'The chorus runs, "The eight directions share one track in joy," to represent the pacification of Liaodong and great settlement on the borders.',
    idiomatic: 'The refrain—"All within the eight directions rides one track in joy"—marks Liaodong pacified and the frontiers settled.',
  },
  s0029: {
    literal: 'Shangyuan Le was made by Gaozong.',
    idiomatic: 'Gaozong composed Shangyuan Le.',
  },
  s0030: {
    literal: 'One hundred eighty dancers.',
    idiomatic: 'The company fields one hundred eighty.',
  },
  s0031: {
    literal: 'Robes are painted with clouds and all five colors, representing primordial qi; hence the name "Shangyuan."',
    idiomatic: 'Cloud-painted robes in five colors stand for primordial qi—hence Shangyuan, "Upper Prime."',
  },
  s0032: {
    literal: 'Shengshou Le was made by Gaozong and Empress Wu.',
    idiomatic: 'Gaozong and Empress Wu jointly composed Shengshou Le.',
  },
  s0033: {
    literal: 'One hundred forty dancers.',
    idiomatic: 'One hundred forty take the floor.',
  },
  s0034: {
    literal: 'Gilt-bronze crowns and five-colored painted robes.',
    idiomatic: 'They wear gilt-bronze crowns and robes painted in five colors.',
  },
  s0035: {
    literal: 'The dance ranks must form characters; sixteen transformations complete it.',
    idiomatic: 'Formations spell out characters in sixteen changes.',
  },
  s0036: {
    literal: 'The characters read: "Sage beyond a thousand ages, the Way secure for a hundred kings, the emperor ten thousand years, the precious throne ever flourishing."',
    idiomatic: 'They spell: "Sage beyond the ages, Way secure for hundred kings, emperor ten thousand years, throne ever flourishing."',
  },
  s0037: {
    literal: 'Guangsheng Le was made by Xuanzong.',
    idiomatic: 'Xuanzong composed Guangsheng Le.',
  },
  s0038: {
    literal: 'Eighty dancers.',
    idiomatic: 'Eighty dancers perform.',
  },
  s0039: {
    literal: 'Black caps, five-colored painted robes, blending Shangyuan and Shengshou styles, to praise the rise of royal traces.',
    idiomatic: 'Black caps and five-colored robes blend Shangyuan and Shengshou motifs to hymn the dynasty\'s rise.',
  },
  s0040: {
    literal: 'From the Breaking-the-Formation Dance downward, all use thunderous great drums mixed with Kuchean music; the sound carries a hundred li and shakes valleys.',
    idiomatic: 'From Breaking the Formation onward, great drums and Kuchean music shake the hills for a hundred li.',
  },
  s0041: {
    literal: 'Dading Le adds gilt cymbals.',
    idiomatic: 'Only Dading Le adds gilt cymbals to the drum line.',
  },
  s0042: {
    literal: 'Only the Qingshan Dance uses Xiliang music alone; it is the most leisurely and refined.',
    idiomatic: 'Only Qingshan Dance uses pure Xiliang music—the most refined and sedate.',
  },
  s0043: {
    literal: 'The three dances Pozhen, Shangyuan, and Qingshan all change their dress and are joined to bells and chime-stones for suburban and temple rites.',
    idiomatic: 'Pozhen, Shangyuan, and Qingshan swap costumes and join bells and stones for suburban and ancestral rites.',
  },
  s0044: {
    literal: 'Pozhen serves as the military dance, called the Seven Virtues;',
    idiomatic: 'Pozhen became the military dance, titled Seven Virtues;',
  },
  s0045: {
    literal: 'Qingshan as the civil dance, called the Nine Achievements.',
    idiomatic: 'Qingshan the civil dance, titled Nine Achievements.',
  },
  s0046: {
    literal: 'After Empress Wu seized rule and destroyed the Tang ancestral temple, this rite kept its name but lost its substance.',
    idiomatic: 'When Empress Wu took power and wrecked the Tang ancestral temple, the rite survived in name only.',
  },
  s0047: {
    literal: 'The eight dances including Anle are all performed with standing musicians; the Music Office calls them standing-section entertainers.',
    idiomatic: 'Anle and the other seven standing dances use standing musicians—the Music Office\'s standing troupe.',
  },
  s0048: {
    literal: 'All the rest are collectively called seated-section entertainers.',
    idiomatic: 'Everything else falls under the seated troupe.',
  },
  s0049: {
    literal: 'In the eras of Zetian and Zhongzong many new standing and seated dances were added, then soon abandoned.',
    idiomatic: 'Under Zetian and Zhongzong the court added many new standing and seated dances, then let them lapse.',
  },
  s0050: {
    literal: 'The seated-section entertainers have Yan Le, Changshou Le, Tianshou Le, Niaoge Wanshou Le, Longchi Le, and Pozhen Le—six pieces in all.',
    idiomatic: 'The seated troupe has six pieces: Yan Le, Changshou Le, Tianshou Le, Niaoge Wanshou Le, Longchi Le, and Pozhen Le.',
  },
  s0051: {
    literal: 'Yan Le was made by Zhang Wenshou.',
    idiomatic: 'Zhang Wenshou composed Yan Le.',
  },
  s0052: {
    literal: 'The performers wear scarlet damask robes and silk-cloth trousers.',
    idiomatic: 'Musicians wear scarlet damask robes and silk trousers.',
  },
  s0053: {
    literal: 'Twenty dancers divide into four sections: Jingyun Le, eight dancers in flowered brocade robes, five-colored damask trousers, cloud caps and black leather boots;',
    idiomatic: 'Twenty dancers split four ways—Jingyun Le: eight in flowered brocade, five-colored damask trousers, cloud caps, black boots;',
  },
  s0054: {
    literal: 'Qingshan Le, four dancers in purple damask robes, great sleeves, silk-cloth trousers, false topknots.',
    idiomatic: 'Qingshan Le: four in purple damask, great sleeves, silk trousers, false topknots.',
  },
  s0055: {
    literal: 'Pozhen Le, four dancers in scarlet damask robes, brocade collars and borders, scarlet damask trousers.',
    idiomatic: 'Pozhen Le: four in scarlet damask with brocade collars and scarlet trousers.',
  },
  s0056: {
    literal: 'Chengtian Le, four dancers in purple robes, Jinde crowns, all with bronze belts.',
    idiomatic: 'Chengtian Le: four in purple robes, Jinde crowns, bronze belts.',
  },
  s0057: {
    literal: 'The music uses one set of jade chime-stones, one large fangxiang, one plucked zheng, one horizontal konghou, one small konghou, one large pipa, one large five-string pipa, one small five-string pipa, one large bili, one small bili, one large sheng, one small sheng, one large xiao, one small lü pipe, one main bronze cymbal, one answering bronze cymbal, one long flute, one short flute, one frame drum, one linked drum, one taogu drum, one pestle drum, and two singer-laborers.',
    idiomatic: 'Instrumentation: jade chimes, large fangxiang, zheng, horizontal and small konghou, large and small five-string pipas, large and small bili and sheng, large xiao and small pitch pipe, paired bronze cymbals, long and short flutes, frame, linked, taogu, and pestle drums, plus two vocalists.',
  },
  s0058: {
    literal: 'Of this music only the Jingyun Dance survives; the rest are lost.',
    idiomatic: 'Only the Jingyun dance remains; the rest are gone.',
  },
  s0059: {
    literal: 'Changshou Le was made in Empress Wu\'s Changshou reign era.',
    idiomatic: 'Changshou Le dates to Empress Wu\'s Changshou era.',
  },
  s0060: {
    literal: 'Twelve dancers.',
    idiomatic: 'Twelve perform the dance.',
  },
  s0061: {
    literal: 'Painted robes and caps.',
    idiomatic: 'Painted costumes.',
  },
  s0062: {
    literal: 'Tianshou Le was made in Empress Wu\'s Tianshou reign era.',
    idiomatic: 'Tianshou Le dates to the Tianshou era.',
  },
  s0063: {
    literal: 'Four dancers.',
    idiomatic: 'A quartet dances.',
  },
  s0064: {
    literal: 'Five-colored painted robes and phoenix crowns.',
    idiomatic: 'Costume: five-colored painted robes and phoenix crowns.',
  },
  s0065: {
    literal: 'Niaoge Wanshou Le was made by Empress Wu.',
    idiomatic: 'Empress Wu composed Niaoge Wanshou Le.',
  },
  s0066: {
    literal: 'In Empress Wu\'s time the palace kept birds that could speak human words and often cried "Ten thousand years!"; she made this music to represent it.',
    idiomatic: 'Her palace kept talking birds that cried "Long live ten thousand years!"—she set this music to mimic them.',
  },
  s0067: {
    literal: 'Three dancers.',
    idiomatic: 'Three dancers enact the birds.',
  },
  s0068: {
    literal: 'Scarlet great sleeves, all painted with mynahs; crowns shaped like birds.',
    idiomatic: 'Scarlet great sleeves painted with mynahs; bird-shaped crowns.',
  },
  s0069: {
    literal: 'Now it is recorded that in Lingnan there is a bird resembling the mynah but somewhat larger; at first glance they are hard to tell apart.',
    idiomatic: 'Records from Lingnan describe a bird like the mynah but larger—hard to tell apart at a glance.',
  },
  s0070: {
    literal: 'Kept in a cage long enough it can speak without fail; southerners call it Jilie, also said liao.',
    idiomatic: 'Cage it long enough and it speaks flawlessly; southerners call it Jilie, also liao.',
  },
  s0071: {
    literal: 'In early Kaiyuan Guangzhou presented one; its voice was deep and masculine like a man\'s, subtly reading human feeling—far cleverer than a parrot; one suspects it is this bird.',
    idiomatic: 'Early Kaiyuan Guangzhou sent one whose deep, manlike voice read moods better than any parrot—likely this same bird.',
  },
  s0072: {
    literal: 'The Annals of Emperor Wu in the Han History records that Nanyue presented a tame elephant and a talking bird.',
    idiomatic: 'Han History, Annals of Emperor Wu, notes Nanyue\'s tribute of a tame elephant and a talking bird.',
  },
  s0073: {
    literal: 'Commentators on the Han History all say the bird was a parrot.',
    idiomatic: 'Han commentators uniformly identify that bird as a parrot.',
  },
  s0074: {
    literal: 'If it were a parrot, they could not fail to give its name yet call it merely a talking bird.',
    idiomatic: 'Had it been a parrot, writers would have named it—not merely "talking bird."',
  },
  s0075: {
    literal: 'Parrots are especially numerous in Qin and Long; they would hardly be prized.',
    idiomatic: 'Parrots abound in Qin and Long and would hardly count as rare tribute.',
  },
  s0076: {
    literal: 'The so-called talking bird is Jilie.',
    idiomatic: 'The talking bird of the record is Jilie.',
  },
  s0077: {
    literal: 'Northerners often say mynahs can speak only after crossing the ranges; transmitters err.',
    idiomatic: 'Northerners say mynahs speak only south of the ranges—a garbled tradition.',
  },
  s0078: {
    literal: 'Lingnan has many mynahs, but the birds that speak are not mynahs.',
    idiomatic: 'Lingnan teems with mynahs, yet the speaking birds are another species.',
  },
  s0079: {
    literal: 'Longchi Le was made by Xuanzong.',
    idiomatic: 'Xuanzong composed Longchi Le.',
  },
  s0080: {
    literal: 'While Xuanzong still lay low, his house was in Longqing Ward; south of the residence the commoners\' dwellings turned into a pool, and geomancers also marveled.',
    idiomatic: 'Before his rise he lived in Longqing Ward; neighbors\' land south of the house became a pond that geomancers called ominous.',
  },
  s0081: {
    literal: 'Hence in Zhongzong\'s late years he boated on the pool.',
    idiomatic: 'So in Zhongzong\'s last years the court boated there.',
  },
  s0082: {
    literal: 'When Xuanzong took the throne he made the ward a palace; the waters grew until they spread for several li—he made this music to sing the omen.',
    idiomatic: 'On taking the throne he turned the ward into a palace; the pond swelled for miles—music to hymn the omen.',
  },
  s0083: {
    literal: 'Twelve dancers; each crown is adorned with lotus.',
    idiomatic: 'Twelve dancers wear lotus-trimmed crowns.',
  },
  s0084: {
    literal: 'Pozhen Le was made by Xuanzong.',
    idiomatic: 'Xuanzong also made a seated Pozhen Le.',
  },
  s0085: {
    literal: 'It derives from the standing-section Pozhen Le.',
    idiomatic: 'It descends from the standing troupe\'s Pozhen Le.',
  },
  s0086: {
    literal: 'Four dancers in gilt armor.',
    idiomatic: 'Four armored dancers in gilt.',
  },
  s0087: {
    literal: 'From Changshou Le downward all use Kuchean music; dancers all wear boots.',
    idiomatic: 'From Changshou Le down, Kuchean music and boots for every dancer.',
  },
  s0088: {
    literal: 'Only Longchi uses refined court music as well, yet without bells and chime-stones; dancers tread in shoes.',
    idiomatic: 'Only Longchi adds refined court music—no bells or stones—and soft-shoed dancers.',
  },
  s0089: {
    literal: 'Qing Music is music of the old Southern dynasties.',
    idiomatic: 'Qing Music is legacy repertoire of the Southern dynasties.',
  },
  s0090: {
    literal: 'In the Yongjia turmoil the Five Capitals fell; surviving sounds and old forms scattered to the lands east of the Yangtze.',
    idiomatic: 'After Yongjia\'s fall the Five Capitals were lost; old tunes drifted to the lower Yangtze.',
  },
  s0091: {
    literal: 'Between Song and Liang, Southern court culture was called the richest;',
    idiomatic: 'From Song through Liang, southern court culture peaked;',
  },
  s0092: {
    literal: 'folk songs and national custom also each age had new sounds.',
    idiomatic: 'and every generation added fresh popular songs.',
  },
  s0093: {
    literal: 'Later Wei Emperor Xiaowen and Emperor Xuanwu, using armies on the Huai and Han, gathered southern tunes they captured and called them Qing Shang Music.',
    idiomatic: 'Northern Wei Xiaowen and Xuanwu, campaigning on Huai and Han, seized southern airs as Qing Shang Music.',
  },
  s0094: {
    literal: 'When Sui pacified Chen they established the Qing Shang Office; collectively it was called Qing Music.',
    idiomatic: 'Sui\'s conquest of Chen founded the Qing Shang Office—everything grouped as Qing Music.',
  },
  s0095: {
    literal: 'After the chaos of Liang and Chen\'s fall, what survived was scant.',
    idiomatic: 'Liang and Chen\'s collapse left almost nothing.',
  },
  s0096: {
    literal: 'Since the Sui house it has daily dwindled.',
    idiomatic: 'Since Sui the corpus has dwindled year by year.',
  },
  s0097: {
    literal: 'In Empress Wu\'s time there were still sixty-three tunes; of lyrics preserved today only White Snow, Gong Mo Dance, Ba Yu, Mingjun, Feng Jiang Chu, Ming Zhi Jun, Duo Dance, White Dove, White Zhuo, Ziye, Wu Sheng Four Seasons Song, Qianxi, Azi, and Huan Wen, Tuan Shan, Aonao, Chief Clerk, Duhu, Du Qu, Crow Cries at Night, Shicheng, Mochou, Xiangyang, Roosting Crow Flies at Night, Gu Ke, Yang Ban, Ya Ge, Xiaohu, Changlin Huan, Sanzhou, Picking Mulberry, Spring River Flower Moon Night, Jade Tree Courtyard Flower, Tangtang, Floating Dragon Boat, and thirty-two other pieces remain—Ming Zhi Jun and Ya Ge two each, Four Seasons Song four—thirty-seven lyrics in all.',
    idiomatic: 'Under Empress Wu sixty-three tunes still existed; lyrics survive for only thirty-seven titles—including White Snow, Gong Mo, Ba Yu, Mingjun, Feng Jiang Chu, and the rest listed—plus duplicate Ming Zhi Jun and Ya Ge and four Four Seasons songs.',
  },
  s0098: {
    literal: 'Seven further tunes have sound but no lyrics: Shanglin, Feng Chu, Ping Diao, Qing Diao, Se Diao, Ping Zhe, and Ming Xiao—forty-four tunes in all with the foregoing.',
    idiomatic: 'Seven more survive as melody without words—Shanglin, Feng Chu, the three Zhou chamber modes, Ping Zhe, Ming Xiao—forty-four pieces altogether.',
  },
  s0099: {
    literal: 'On White Snow: a Zhou tune.',
    idiomatic: 'White Snow—a Zhou piece.',
  },
  s0100: {
    literal: 'Ping Diao, Qing Diao, and Se Diao are all surviving sounds of Zhou inner-chamber tunes.',
    idiomatic: 'Ping, Qing, and Se modes preserve Zhou inner-chamber melodies.',
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
