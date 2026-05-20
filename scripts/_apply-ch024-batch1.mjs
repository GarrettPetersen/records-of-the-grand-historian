#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.024, suburban sacrifice treatise) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/024.json';
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
    literal: 'Under the Wude and Zhenguan regulations, apart from the great offerings to the spirits, on the day of Establishment of Spring each year the Green Emperor was sacrificed at the eastern suburb, with Emperor Fu Xi as associate, and Gou Mang, the Year Star, the Three Chronograms, and the Seven Lodgings attended the sacrifice.',
    idiomatic: 'Under Wude and Zhenguan rites, beyond great spirit offerings, each Establishment of Spring the Green Emperor was sacrificed at the eastern suburb with Fu Xi as associate and Gou Mang, the Year Star, the Three Chronograms, and Seven Lodgings in attendance.',
  },
  s0002: {
    literal: 'At Establishment of Summer, the Red Emperor was sacrificed at the southern suburb, with Emperor Shen Nong as associate, and Zhu Rong, Sparkling Deluder, the Three Chronograms, and the Seven Lodgings attended.',
    idiomatic: 'At Establishment of Summer: Red Emperor at the southern suburb, Shen Nong as associate, Zhu Rong, Sparkling Deluder, Three Chronograms, and Seven Lodgings attending.',
  },
  s0003: {
    literal: 'On the earth-sovereign day of late summer, the Yellow Emperor was sacrificed at the southern suburb, with Emperor Xuan Yuan as associate, and Hou Tu and the Queller Star attended.',
    idiomatic: 'Late-summer earth-sovereign day: Yellow Emperor at the southern suburb, Xuan Yuan as associate, Hou Tu and the Queller Star attending.',
  },
  s0004: {
    literal: 'At Establishment of Autumn, the White Emperor was sacrificed at the western suburb, with Emperor Shao Hao as associate, and Ru Shou, Great White, the Three Chronograms, and the Seven Lodgings attended.',
    idiomatic: 'At Establishment of Autumn: White Emperor at the western suburb, Shao Hao as associate, Ru Shou, Great White, Three Chronograms, and Seven Lodgings attending.',
  },
  s0005: {
    literal: 'At Establishment of Winter, the Black Emperor was sacrificed at the northern suburb, with Emperor Zhuan Xu as associate, and Xuan Ming, Chronogram Star, the Three Chronograms, and the Seven Lodgings attended.',
    idiomatic: 'At Establishment of Winter: Black Emperor at the northern suburb, Zhuan Xu as associate, Xuan Ming, Chronogram Star, Three Chronograms, and Seven Lodgings attending.',
  },
  s0006: {
    literal: 'At each suburban sacrifice the emperor of the direction and the associate seat each used one calf of the direction\'s color, four platters and four beans, two grain tureens and two grain vessels, and one soup vessel and one cutting board.',
    idiomatic: 'Each suburban rite: one direction-colored calf per direction-god and associate; four platters and beans, two tureens and vessels, one soup vessel and cutting board each.',
  },
  s0007: {
    literal: 'From Gou Mang down through the five stars and the Three Chronograms and Seven Lodgings, each lodging used a young bullock; each seat had one platter, bean, grain tureen, grain vessel, soup vessel, and cutting board.',
    idiomatic: 'From Gou Mang through the five stars, Three Chronograms, and Seven Lodgings: young bullock per lodging; one full set of vessels per seat.',
  },
  s0008: {
    literal: 'In the first month of summer, when the Dragon Star appeared, rain prayer was made to the Five Directional High Gods at the rain altar; the Five Emperors were paired above and the Five Officials attended below.',
    idiomatic: 'First summer month, Dragon Star visible: rain prayer to Five Directional High Gods at the rain altar; Five Emperors paired above, Five Officials below.',
  },
  s0009: {
    literal: 'Victims were ten direction-colored calves; platters, beans, and below followed the suburban sacrifice counts.',
    idiomatic: 'Ten direction-colored calves; platters, beans, and the rest as at suburban rites.',
  },
  s0010: {
    literal: 'Emperor Ku was sacrificed at Dunqiu.',
    idiomatic: 'Ku was sacrificed at Dunqiu.',
  },
  s0011: {
    literal: 'Tang Yao, with Qi as associate, was sacrificed at Pingyang.',
    idiomatic: 'Yao, Qi paired, at Pingyang.',
  },
  s0012: {
    literal: 'Yu Shun, with Gao Yao as associate, was sacrificed at Hedong.',
    idiomatic: 'Shun, Gao Yao paired, at Hedong.',
  },
  s0013: {
    literal: 'Yu of Xia, with Bo Yi as associate, was sacrificed at Anyi.',
    idiomatic: 'Yu of Xia, Bo Yi paired, at Anyi.',
  },
  s0014: {
    literal: 'Tang of Yin, with Yi Yin as associate, was sacrificed at Yanshi.',
    idiomatic: 'Tang of Yin, Yi Yin paired, at Yanshi.',
  },
  s0015: {
    literal: 'King Wen of Zhou, with Grand Duke as associate, was sacrificed at Bang.',
    idiomatic: 'King Wen, Grand Duke paired, at Bang.',
  },
  s0016: {
    literal: 'King Wu of Zhou, with Duke of Zhou and Duke of Shao as associates, was sacrificed at Hao.',
    idiomatic: 'King Wu, Duke of Zhou and Duke of Shao paired, at Hao.',
  },
  s0017: {
    literal: 'Han Gaozu, with Xiao He as associate, was sacrificed at Changling.',
    idiomatic: 'Gaozu, Xiao He paired, at Changling.',
  },
  s0018: {
    literal: 'Sacrifice once every three years, in the mid-spring month.',
    idiomatic: 'Every three years, mid-spring.',
  },
  s0019: {
    literal: 'All victims used the great offering.',
    idiomatic: 'All victims: great offering.',
  },
  s0020: {
    literal: 'Sacrificing officers were the prefectural chief of the relevant circuit; if prevented, a senior aide was sent to perform the rite.',
    idiomatic: 'The circuit prefect sacrificed; if absent, a senior aide performed.',
  },
  s0021: {
    literal: 'The Five Marchmounts, Four Garrisons, Four Seas, and Four Watercourses each had one sacrifice per year, each on the day of receiving qi at the five suburban altars.',
    idiomatic: 'Five Marchmounts, Four Garrisons, Four Seas, and Four Watercourses: annual sacrifice on each direction\'s suburban qi-receiving day.',
  },
  s0022: {
    literal: 'Eastern Marchmount Mount Dai was sacrificed at Qizhou;',
    idiomatic: 'Eastern Marchmount Dai at Qizhou;',
  },
  s0023: {
    literal: 'Eastern Garrison Mount Yi at Yizhou;',
    idiomatic: 'Eastern Garrison Yi at Yizhou;',
  },
  s0024: {
    literal: 'Eastern Sea at Laizhou;',
    idiomatic: 'Eastern Sea: Laizhou;',
  },
  s0025: {
    literal: 'Eastern Watercourse the Great Huai at Tangzhou.',
    idiomatic: 'Eastern Watercourse Great Huai at Tangzhou.',
  },
  s0026: {
    literal: 'Southern Marchmount Mount Heng at Hengzhou;',
    idiomatic: 'Southern Marchmount Heng at Hengzhou;',
  },
  s0027: {
    literal: 'Southern Garrison Kuaiji at Yuezhou;',
    idiomatic: 'Southern Garrison: Kuaiji at Yuezhou;',
  },
  s0028: {
    literal: 'Southern Sea at Guangzhou;',
    idiomatic: 'Southern Sea: Guangzhou;',
  },
  s0029: {
    literal: 'Southern Watercourse the Great Jiang at Yizhou.',
    idiomatic: 'Southern Watercourse Great Jiang at Yizhou.',
  },
  s0030: {
    literal: 'Central Marchmount Mount Song at Luozhou.',
    idiomatic: 'Central Marchmount Song at Luozhou.',
  },
  s0031: {
    literal: 'Western Marchmount Mount Hua at Huazhou;',
    idiomatic: 'Western Marchmount Hua at Huazhou;',
  },
  s0032: {
    literal: 'Western Garrison Mount Wu at Longzhou;',
    idiomatic: 'Western Garrison Wu at Longzhou;',
  },
  s0033: {
    literal: 'Western Sea and Western Watercourse the Great He at Tongzhou.',
    idiomatic: 'Western Sea and Western Watercourse Great He at Tongzhou.',
  },
  s0034: {
    literal: 'Northern Marchmount Mount Heng at Dingzhou;',
    idiomatic: 'Northern Marchmount Heng at Dingzhou;',
  },
  s0035: {
    literal: 'Northern Garrison Mount Yiwulü at Yingzhou;',
    idiomatic: 'Northern Garrison Yiwulü at Yingzhou;',
  },
  s0036: {
    literal: 'Northern Sea and Northern Watercourse the Great Ji at Luozhou.',
    idiomatic: 'Northern Sea and Northern Watercourse Great Ji at Luozhou.',
  },
  s0037: {
    literal: 'All victims used the great offering; four platters and four beans each.',
    idiomatic: 'Victims: great offering; four platters and four beans each.',
  },
  s0038: {
    literal: 'Sacrificing officers were filled by the area\'s military commissioner and prefect.',
    idiomatic: 'Area military commissioner and prefect sacrificed.',
  },
  s0039: {
    literal: 'On the wu days of mid-spring and mid-autumn, Great Soil Mound and Great Grain Mound were sacrificed; Soil Mound had Gou Long as associate, Grain Mound Hou Ji as associate.',
    idiomatic: 'Mid-spring and mid-autumn wu days: Great Soil and Great Grain; Gou Long paired with Soil, Hou Ji with Grain.',
  },
  s0040: {
    literal: 'Soil Mound and Grain Mound each used one great offering; victims were all black; two platters, beans, grain tureens, and vessels each; three soup vessels and cutting boards each.',
    idiomatic: 'Each mound: one great offering, black victims, two platters, beans, tureens, vessels, three soup vessels and cutting boards.',
  },
  s0041: {
    literal: 'At the spring equinox, the sun was greeted at the east of the capital;',
    idiomatic: 'Spring equinox: greet the sun east of the capital;',
  },
  s0042: {
    literal: 'at the autumn equinox, the moon was seen off at the west of the capital.',
    idiomatic: 'autumn equinox: see off the moon west of the capital.',
  },
  s0043: {
    literal: 'Each used one calf of the direction\'s color, four platters and four beans, and one grain tureen, grain vessel, soup vessel, and cutting board.',
    idiomatic: 'Each: one direction-colored calf, four platters and beans, one each of tureen, vessel, soup vessel, and cutting board.',
  },
  s0044: {
    literal: 'On an auspicious hai day in early spring, the emperor\'s soil mound was sacrificed at the sacred field and the Son of Heaven plowed in person;',
    idiomatic: 'Early-spring auspicious hai: emperor\'s soil mound at the sacred field; the Son of Heaven plowed.',
  },
  s0045: {
    literal: 'on an auspicious si day in late spring, the First Silkworm was sacrificed at the public mulberry grove and the empress reeled silk in person.',
    idiomatic: 'Late-spring auspicious si: First Silkworm at the public mulberry; the empress reeled silk.',
  },
  s0046: {
    literal: 'Both used the great offering; nine platters and nine beans each.',
    idiomatic: 'Both: great offering; nine platters and nine beans.',
  },
  s0047: {
    literal: 'On the day before silkworm rites, the Palace Domestic Service pre-delivered orders to the relevant offices.',
    idiomatic: 'Eve of silkworm rites: Palace Domestic Service notified the relevant offices.',
  },
  s0048: {
    literal: 'For all sacrifices the day was divined, always first in the first ten-day period;',
    idiomatic: 'Sacrifice days: divined, upper ten-day period first;',
  },
  s0049: {
    literal: 'if inauspicious, then the middle and lower periods.',
    idiomatic: 'if inauspicious, then middle and lower periods.',
  },
  s0050: {
    literal: 'Day by stalk-casting followed the same rule.',
    idiomatic: 'Stalk-casting for days followed the same rule.',
  },
  s0051: {
    literal: 'For the First Silkworm sacrifice alone, if the solar term came late, the day was taken after the term.',
    idiomatic: 'First Silkworm alone: if the term ran late, the day followed the term.',
  },
  s0052: {
    literal: 'After Establishment of Spring on a chou day, the Wind Master was sacrificed northeast of the capital;',
    idiomatic: 'After Establishment of Spring, chou day: Wind Master northeast of the capital;',
  },
  s0053: {
    literal: 'after Establishment of Summer on a shen day, the Rain Master southwest of the capital;',
    idiomatic: 'after Establishment of Summer, shen day: Rain Master southwest;',
  },
  s0054: {
    literal: 'after Establishment of Autumn on a chen day, the Spirit Star southeast of the capital;',
    idiomatic: 'after Establishment of Autumn, chen day: Spirit Star southeast;',
  },
  s0055: {
    literal: 'after Establishment of Winter on a hai day, Director of the Center, Director of Fate, Director of the People, and Director of Emolument northwest of the capital.',
    idiomatic: 'after Establishment of Winter, hai day: Director of Center, Fate, People, and Emolument northwest.',
  },
  s0056: {
    literal: 'Each used one sheep, two platters and two beans, and one grain tureen and grain vessel.',
    idiomatic: 'Each: one sheep, two platters and beans, one tureen and vessel.',
  },
  s0057: {
    literal: 'On the last day of late winter, hall presentation and exorcism; victims were dismembered at the palace gate and the four city gates, each place one cock.',
    idiomatic: 'Late-winter last day: hall presentation and exorcism; victims dismembered at palace gate and four city gates, one cock each.',
  },
  s0058: {
    literal: 'In mid-spring, the Horse Ancestor was sacrificed;',
    idiomatic: 'Mid-spring: Horse Ancestor;',
  },
  s0059: {
    literal: 'in mid-summer, the First Herdsman;',
    idiomatic: 'mid-summer: First Herdsman;',
  },
  s0060: {
    literal: 'in mid-autumn, the Horse Soil Mound;',
    idiomatic: 'mid-autumn: Horse Soil Mound;',
  },
  s0061: {
    literal: 'in mid-winter, the Horse Pace.',
    idiomatic: 'mid-winter: Horse Pace.',
  },
  s0062: {
    literal: 'All were at the Great Marsh on a yang day.',
    idiomatic: 'All at the Great Marsh on a yang day.',
  },
  s0063: {
    literal: 'Each victim was one sheep; two platters and two beans, one grain tureen and grain vessel.',
    idiomatic: 'Each: one sheep, two platters and beans, one tureen and vessel.',
  },
  s0064: {
    literal: 'Late winter stored ice; mid-spring opened ice; both used black bull and glutinous millet; the Cold Chamber spirit was sacrificed at the ice house—two platters and two beans, one grain tureen, grain vessel, and cutting board.',
    idiomatic: 'Late winter ice stored, mid-spring opened: black bull and glutinous millet; Cold Chamber spirit at the ice house; two platters and beans, one tureen, vessel, and cutting board.',
  },
  s0065: {
    literal: 'When opening ice, peach bow and thorn arrows were added and set at the spirit seat.',
    idiomatic: 'Ice opening added peach bow and thorn arrows at the spirit seat.',
  },
  s0066: {
    literal: 'On a yin day in late winter, wax sacrifice to the hundred spirits at the southern suburb.',
    idiomatic: 'Late-winter yin day: wax sacrifice to hundred spirits at southern suburb.',
  },
  s0067: {
    literal: 'Great Brightness and Night Brightness each used two calves, four platters and four beans, and one grain tureen, grain vessel, soup vessel, and cutting board.',
    idiomatic: 'Great Brightness and Night Brightness: two calves each, four platters and beans, one full vessel set each.',
  },
  s0068: {
    literal: 'Shen Nong and Yi Qi each used one young bullock, four platters and four beans, and one grain tureen, grain vessel, soup vessel, and cutting board.',
    idiomatic: 'Shen Nong and Yi Qi: young bullock each, four platters and beans, one full vessel set each.',
  },
  s0069: {
    literal: 'Hou Ji and the Five Directions, twelve chronograms, five officials, five directional field masters, Five Marchmounts, Four Garrisons, Four Seas, Four Watercourses and below—each direction one young bullock; where the direction\'s harvest failed, that rite was omitted.',
    idiomatic: 'Hou Ji, Five Directions, twelve chronograms, five officials, field masters, marchmounts, garrisons, seas, watercourses and below: one young bullock per direction; failed harvest omitted that rite.',
  },
  s0070: {
    literal: 'That day wells and springs were sacrificed below streams and marshes, using one sheep.',
    idiomatic: 'Same day: wells and springs below streams and marshes, one sheep.',
  },
  s0071: {
    literal: 'On mao day soil and grain mounds were sacrificed at the mound shrine; on chen day la offering at the Grand Temple; victims all followed seasonal sacrifice standards.',
    idiomatic: 'Mao day: soil and grain at mound shrine; chen day: la at Grand Temple; victims per seasonal standard.',
  },
  s0072: {
    literal: 'Wells and springs used two sheep.',
    idiomatic: 'Wells and springs: two sheep.',
  },
  s0073: {
    literal: 'The twenty-eight lodgings, five directional mountains and forests and streams and marshes, five directional hills and mounds and banks and plains, five directional scale, feather, naked, fur, and shell creatures, five directional water walls, dykes, beacon mounds, and boundary markers, five directional cats, wutu, dragon, qilin, vermilion bird, white tiger, and dark warrior—each direction one young bullock; each seat one platter, bean, grain tureen, grain vessel, and cutting board.',
    idiomatic: 'Twenty-eight lodgings, directional mountains, waters, hills, creatures, walls, cats, wutu, dragon, qilin, vermilion bird, white tiger, dark warrior: young bullock and one vessel set per direction per seat.',
  },
  s0074: {
    literal: 'Wax sacrifice in all comprised one hundred eighty-seven seats.',
    idiomatic: 'Wax sacrifice: one hundred eighty-seven seats in all.',
  },
  s0075: {
    literal: 'If the year\'s grain in a direction did not mature, that direction\'s rite was omitted.',
    idiomatic: 'Failed harvest in a direction: omit that rite.',
  },
  s0076: {
    literal: 'On wax day the five directional wells and springs were sacrificed below mountains and marshes, one sheep, two platters and two beans, one grain tureen, grain vessel, and cutting board.',
    idiomatic: 'Wax day: five directional wells and springs below mountains and marshes; one sheep, two platters and beans, one tureen, vessel, and cutting board.',
  },
  s0077: {
    literal: 'The day after wax, soil and grain mounds were again sacrificed at the mound shrine, as in the mid-spring and mid-autumn rites.',
    idiomatic: 'Day after wax: soil and grain at mound shrine, as in mid-spring and mid-autumn.',
  },
  s0078: {
    literal: 'In the Xianqing era the counts of platters and beans were revised and first unified.',
    idiomatic: 'Xianqing: platter and bean counts revised and unified.',
  },
  s0079: {
    literal: 'Great sacrifice: twelve platters and twelve beans; middle sacrifice ten each; small sacrifice eight each.',
    idiomatic: 'Great: twelve platters and beans; middle: ten; small: eight.',
  },
  s0080: {
    literal: 'After mid-summer in the capital, if drought came, rain was prayed for, wrongful cases reviewed, the destitute relieved, and exposed bones buried.',
    idiomatic: 'Capital after mid-summer drought: pray rain, review cases, relieve the poor, bury exposed dead.',
  },
  s0081: {
    literal: 'First prayer was to marchmounts, garrisons, seas, watercourses, and mountains and rivers that could send rain clouds—all greeted and announced at the northern suburb.',
    idiomatic: 'First: marchmounts, garrisons, seas, watercourses, and rain-bearing rivers, greeted and announced at northern suburb.',
  },
  s0082: {
    literal: 'Then soil and grain mounds, then the ancestral temple—each every seven days.',
    idiomatic: 'Then soil and grain, then ancestral temple—each every seven days.',
  },
  s0083: {
    literal: 'If no rain, return to marchmounts and watercourses.',
    idiomatic: 'No rain: return to marchmounts and watercourses.',
  },
  s0084: {
    literal: 'If drought was extreme, great rain prayer; no great prayer after autumn equinox.',
    idiomatic: 'Extreme drought: great rain prayer; none after autumn equinox.',
  },
  s0085: {
    literal: 'After the first prayer, if ten days passed without rain, the market was moved, slaughter forbidden, umbrellas and fans barred, and an earthen dragon made.',
    idiomatic: 'Ten days after first prayer without rain: move the market, ban slaughter, umbrellas, and fans; make an earthen dragon.',
  },
  s0086: {
    literal: 'When rain sufficed, thanksgiving sacrifice was offered.',
    idiomatic: 'Rain enough: thanksgiving sacrifice.',
  },
  s0087: {
    literal: 'Prayer used wine and dried meat; thanksgiving followed regular sacrifice; all performed by the relevant offices.',
    idiomatic: 'Prayer: wine and dried meat; thanksgiving: regular standard; relevant offices performed.',
  },
  s0088: {
    literal: 'If rain came after fasting but before prayer, or at any place already prayed, thanksgiving was still offered.',
    idiomatic: 'Rain after fasting before prayer, or at any prayed site: still offer thanksgiving.',
  },
  s0089: {
    literal: 'If heavy rain did not cease, supplication was made at the capital gates, three days per gate, one supplication daily.',
    idiomatic: 'Unending heavy rain: supplication at capital gates, three days per gate, once daily.',
  },
  s0090: {
    literal: 'If it did not stop, mountains, rivers, marchmounts, garrisons, seas, and watercourses were prayed;',
    idiomatic: 'If unceasing: pray mountains, rivers, marchmounts, garrisons, seas, watercourses;',
  },
  s0091: {
    literal: 'after three days without stopping, soil and grain mounds and the ancestral temple.',
    idiomatic: 'three days more without stopping: soil and grain and ancestral temple.',
  },
  s0092: {
    literal: 'In prefectures and counties, city gates were supplicated;',
    idiomatic: 'Prefectures and counties: supplicate city gates;',
  },
  s0093: {
    literal: 'if unceasing, mountains and rivers within the circuit and soil and grain mounds.',
    idiomatic: 'if unceasing: circuit mountains and rivers and soil and grain.',
  },
  s0094: {
    literal: 'Three supplications and one prayer all followed the capital pattern, all using wine, dried flesh, and dried meat.',
    idiomatic: 'Three supplications and one prayer: capital pattern; wine, dried flesh, and dried meat.',
  },
  s0095: {
    literal: 'Capital gates used young bullock for thanksgiving; prefectural and county gates one special victim.',
    idiomatic: 'Capital gate thanksgiving: young bullock; prefectural and county gates: one special victim.',
  },
  s0096: {
    literal: 'In the first month of Zhenguan 3, Taizong personally sacrificed to the First Farmer, took the plow in hand, and plowed the thousand-mu field.',
    idiomatic: 'Zhenguan 3, first month: Taizong sacrificed to First Farmer, took the plow, plowed the thousand-mu field.',
  },
  s0097: {
    literal: 'Earlier, when Jin moved south and Northern Wei came from Yun and Shuo, the central plains were divided and mixed with dog-and-deer Rong; through Zhou and Sui dynasties this rite had long been abandoned, and now it was performed for the first time—onlookers were all astonished and exultant.',
    idiomatic: 'After Jin\'s southward move and Wei from Yun and Shuo, the plains split and mixed with Rong; through Zhou and Sui the rite had lapsed—now revived, onlookers marveled.',
  },
  s0098: {
    literal: 'Thereupon Secretariat Gentleman Cen Wende presented the "Sacred Field Eulogy" to praise it.',
    idiomatic: 'Secretariat Gentleman Cen Wende then offered the "Sacred Field Eulogy" in praise.',
  },
  s0099: {
    literal: 'Earlier, when debating where the sacred-field plowing should face, Remonstrator Kong Yingda said: "The Rites state that the Son of Heaven plows the sacred field at the southern suburb and feudal lords at the eastern suburb.',
    idiomatic: 'When debating sacred-field orientation, Remonstrator Kong Yingda said: "Rites place the Son of Heaven\'s sacred field at the southern suburb and lords\' at the eastern suburb.',
  },
  s0100: {
    literal: 'Emperor Wu of Jin still used the southeast.',
    idiomatic: 'Jin Wudi still plowed toward the southeast.',
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
