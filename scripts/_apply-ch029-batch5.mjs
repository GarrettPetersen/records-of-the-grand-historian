#!/usr/bin/env node
/** Batch 5: s0401–s0500 (Jiutangshu ch.029, Rites 5 / court music) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/029.json';
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
    literal: 'The categories of the Eight Sounds accord with the eight seasonal nodes.',
    idiomatic: 'The Eight Sound categories match the eight seasonal nodes.',
  },
  s0402: {
    literal: 'Gourd (pao): it is the bottle-gourd; Nüwa fashioned it.',
    idiomatic: 'Gourd-class instruments use the bottle-gourd; Nüwa is said to have made them.',
  },
  s0403: {
    literal: 'Pipes are set atop the gourd, reeds placed within; the Erya calls it chao (nest).',
    idiomatic: 'Pipes are arrayed on the gourd with reeds inside; the Erya calls this instrument chao.',
  },
  s0404: {
    literal: 'The large is called yu; the small he.',
    idiomatic: 'The large mouth-organ is yu; the smaller is he.',
  },
  s0405: {
    literal: 'Yu: xu (warmth); the sound of Establishing Spring—warmth begets the myriad things.',
    idiomatic: 'Yu means warmth—the tone of Establishing Spring, when warmth quickens all things.',
  },
  s0406: {
    literal: 'The yu has thirty-six pipes; the palace-tone pipe is on the left.',
    idiomatic: 'The yu has thirty-six pipes, with the gong pipe on the left.',
  },
  s0407: {
    literal: 'The he has thirteen pipes; the palace-tone pipe is in the center.',
    idiomatic: 'The he has thirteen pipes, with the gong pipe in the center.',
  },
  s0408: {
    literal: 'Today\'s yu and sheng both use wood in place of gourd and lacquer it—there is no longer the original tone.',
    idiomatic: 'Present-day yu and sheng substitute lacquered wood for gourd and no longer retain the old sound.',
  },
  s0409: {
    literal: 'South of Jing and Liang, the old form is still preserved, it is said.',
    idiomatic: 'South of Jing and Liang the ancient form is said to survive.',
  },
  s0410: {
    literal: 'A pipe with three holes is called yue; the sound of Spring Equinox—the myriad things quiver and leap into motion.',
    idiomatic: 'A three-holed pipe is yue—the Spring Equinox tone, when all things stir and spring into motion.',
  },
  s0411: {
    literal: 'The xiao: Shun fashioned it.',
    idiomatic: 'The xiao was made by Shun.',
  },
  s0412: {
    literal: 'The Erya calls it jiao.',
    idiomatic: 'In the Erya it is named jiao.',
  },
  s0413: {
    literal: 'When crossed pipes are large it is called yin, twenty-three pipes, one foot four inches long.',
    idiomatic: 'Large crossed pipes are called yin—twenty-three pipes, one foot four inches long.',
  },
  s0414: {
    literal: 'The di: fashioned by the artisan Qiu Zhong in Emperor Wu of Han\'s time.',
    idiomatic: 'The di was made by the craftsman Qiu Zhong under Emperor Wu of Han.',
  },
  s0415: {
    literal: 'Its origin came from among the Qiang.',
    idiomatic: 'It originated among the Qiang.',
  },
  s0416: {
    literal: 'Short di: a little over one foot long.',
    idiomatic: 'The short di is just over a foot long.',
  },
  s0417: {
    literal: 'Between the long di and short di is what is called the middle pipe.',
    idiomatic: 'Between long and short di lies the so-called middle pipe.',
  },
  s0418: {
    literal: 'Chi: the blow-hole has a beak like a jujube.',
    idiomatic: 'The chi has a blow-hole with a beak shaped like a sour jujube.',
  },
  s0419: {
    literal: 'Transverse di: a small chi.',
    idiomatic: 'The transverse di is a small chi.',
  },
  s0420: {
    literal: 'Emperor Ling of Han loved the Hu di.',
    idiomatic: 'Emperor Ling of Han doted on the Hu flute.',
  },
  s0421: {
    literal: 'When the Five Hu ravaged China, Shi Zun played it without cease.',
    idiomatic: 'During the Five Hu upheaval Shi Zun kept it sounding without pause.',
  },
  s0422: {
    literal: 'The Song History says: there was a Hu chi that came from Hu piping—this is meant.',
    idiomatic: 'The Song History notes a Hu chi arising from Hu piping—this is the one.',
  },
  s0423: {
    literal: 'A Liang Hu-piping song runs: "Swift horses need no whip; turn the willow branch backward.',
    idiomatic: 'A Liang Hu-piping song says, "Swift horses need no whip—just tuck the willow branch backward.',
  },
  s0424: {
    literal: 'Dismount and blow the transverse di—grief enough to kill passersby."',
    idiomatic: 'Dismount and blow the transverse di—enough to break a bystander\'s heart."',
  },
  s0425: {
    literal: 'The lyrics of this song originally came from the northern lands.',
    idiomatic: 'These lyrics originally came from the northern states.',
  },
  s0426: {
    literal: 'Today\'s transverse flutes all omit the mouthpiece; those with a mouthpiece added are called "righteous-mouthpiece flutes."',
    idiomatic: 'Present transverse flutes drop the mouthpiece; those that keep it are called "righteous-mouthpiece flutes."',
  },
  s0427: {
    literal: 'Bili: original name "sorrow bili," came from among the Hu; its sound is mournful.',
    idiomatic: 'Bili was originally "sorrow bili," from the Hu frontier; its tone is plaintive.',
  },
  s0428: {
    literal: 'It is also said: the Hu blew it to startle Chinese horses.',
    idiomatic: 'Some say the Hu blew it to panic Chinese horses.',
  },
  s0429: {
    literal: 'Zhu: zhong (multitude).',
    idiomatic: 'Zhu means multitude.',
  },
  s0430: {
    literal: 'The sound of Beginning Summer—all things in multitude have come to completion.',
    idiomatic: 'The Beginning Summer tone, when the myriad things in multitude are fully formed.',
  },
  s0431: {
    literal: 'Each face is a little over two feet square, with round holes at the side; the hand is placed within and struck to raise the music.',
    idiomatic: 'Each side is over two feet, with round holes at the edge; the hand strikes inside to lift the ensemble.',
  },
  s0432: {
    literal: 'Yu: like a crouching tiger, the back bearing twenty-seven ridges; splintered bamboo strikes the head and is scraped back against the grain to stop the music.',
    idiomatic: 'Yu resembles a crouching tiger with twenty-seven ridges on its back; split bamboo strikes the head and is scraped backward to cut off the music.',
  },
  s0433: {
    literal: 'Pounding board (chong du): hollow like a tub, without a bottom; raised and thumped to the ground like a pestle—also called dun xiang.',
    idiomatic: 'The pounding board is hollow like a barrel, open at the bottom, and thumped on the ground like a pestle—also called dun xiang.',
  },
  s0434: {
    literal: 'Xiang: assist; it marks the beat of the music.',
    idiomatic: 'Xiang means aid—it keeps time for the music.',
  },
  s0435: {
    literal: 'Some say when Prince Xiao of Liang built Suiyang city, drumming set the rhythm for lowering the pestle.',
    idiomatic: 'Some trace it to Prince Xiao of Liang building Suiyang, when drumbeats timed the pestle strokes.',
  },
  s0436: {
    literal: 'The "Suiyang Melody" used the pounding board; later ages followed suit.',
    idiomatic: 'The Suiyang air used the pounding board, and later generations kept the practice.',
  },
  s0437: {
    literal: 'Clappers: long and broad like the hand, over an inch thick, linked with leather—struck in place of the castanets.',
    idiomatic: 'Clappers are hand-sized slabs over an inch thick, laced with hide and struck instead of castanets.',
  },
  s0438: {
    literal: 'The qin: Fuxi fashioned it.',
    idiomatic: 'The qin was made by Fuxi.',
  },
  s0439: {
    literal: 'Qin: jin (restraint); the sound of Summer Solstice—yin qi first stirs, restraining things\' licentious hearts.',
    idiomatic: 'Qin means restraint—the Summer Solstice tone, when yin first moves and curbs wanton impulse.',
  },
  s0440: {
    literal: 'Five strings to complete the five tones; King Wu added two to make seven strings.',
    idiomatic: 'Five strings matched the five tones; King Wu added two more for seven.',
  },
  s0441: {
    literal: 'The qin has twelve bridges, like the pipa.',
    idiomatic: 'The qin has twelve bridges, as on the pipa.',
  },
  s0442: {
    literal: 'Struck qin: made by Liu Yun.',
    idiomatic: 'The struck qin was invented by Liu Yun.',
  },
  s0443: {
    literal: 'Yun once composed a literary piece; as his thought fixed on a theme, his brush swayed and accidentally struck a qin string—thereupon he made this music.',
    idiomatic: 'Yun was drafting verse when a wandering brush hit a qin string; he turned the accident into this instrument.',
  },
  s0444: {
    literal: 'A tube carries the strings, and a sliver of bamboo binds and tightens them so the strings are taut and the sound bright; lifting the bamboo to strike sets the rhythm of the piece.',
    idiomatic: 'Tubes bear the strings, bound tight with bamboo slips for a bright tone; tapping the bamboo sets the beat.',
  },
  s0445: {
    literal: 'The se: of old the Supreme Emperor had the Plain Girl play a fifty-string se; grief beyond restraint—he broke it into twenty-five strings.',
    idiomatic: 'The se: the Supreme Emperor once had the Plain Girl play fifty strings until grief overwhelmed her; he split the instrument into twenty-five.',
  },
  s0446: {
    literal: 'Supreme Emperor: Taihao.',
    idiomatic: 'The Supreme Emperor is Taihao.',
  },
  s0447: {
    literal: 'Zheng: originally a Qin sound.',
    idiomatic: 'The zheng was originally a Qin instrument.',
  },
  s0448: {
    literal: 'Tradition says Meng Tian made it—not so.',
    idiomatic: 'Legend credits Meng Tian—it is not true.',
  },
  s0449: {
    literal: 'Its form matches the se but with fewer strings.',
    idiomatic: 'It is built like the se but with fewer strings.',
  },
  s0450: {
    literal: 'Examining Jing Fang\'s five-tone pitch-pipe, like a se with thirteen strings—this is the zheng.',
    idiomatic: 'Jing Fang\'s five-tone standard resembled a thirteen-string se—that is the zheng.',
  },
  s0451: {
    literal: 'Miscellaneous music zheng all have twelve strings; other music all has thirteen.',
    idiomatic: 'Folk zheng have twelve strings; court ensembles use thirteen.',
  },
  s0452: {
    literal: 'Rolled zheng: the end of a bamboo slip is moistened and rolled against the string.',
    idiomatic: 'On the rolled zheng a moistened bamboo slip is rolled along the string.',
  },
  s0453: {
    literal: 'Zhu: like the zheng, slender neck, struck with bamboo like the struck qin.',
    idiomatic: 'The zhu resembles the zheng with a narrow neck and is beaten with bamboo like the struck qin.',
  },
  s0454: {
    literal: 'Qing Music zheng use bone plectra over an inch long in place of fingers.',
    idiomatic: 'Qing Music zheng pluck with inch-long bone nails instead of fingertips.',
  },
  s0455: {
    literal: 'Pipa: four strings; Han music.',
    idiomatic: 'The pipa has four strings and belongs to Han music.',
  },
  s0456: {
    literal: 'At first, during the Qin Great Wall labor, there were stringed drums beaten.',
    idiomatic: 'It began when Qin corvée workers beat stringed frame-drums on the Great Wall.',
  },
  s0457: {
    literal: 'When Emperor Wu of Han married a imperial daughter to the Wusun, he trimmed zheng and zhu into horse-back music to soothe homesickness for their native land.',
    idiomatic: 'When Emperor Wu sent a princess to the Wusun, zheng and zhu were cut down into saddle music to ease longing for home.',
  },
  s0458: {
    literal: 'Pushing outward and far is called pi; drawing inward and near is pa—speaking of its convenience in use.',
    idiomatic: 'Drawing outward is pi, drawing inward pa—names for how the hands work the strings.',
  },
  s0459: {
    literal: 'Today Qing Music pipa, commonly called "Qin-Han lad," is round-bodied with a long narrow neck and small—probably a survival of the stringed drum form.',
    idiomatic: 'Qing Music\'s "Qin-Han lad" pipa is round with a slim neck—likely the stringed drum\'s descendant.',
  },
  s0460: {
    literal: 'Others are full above and sharp below, with curved necks and somewhat larger—probably the Han form.',
    idiomatic: 'Other pipa swell above, taper below, with curved necks and larger bodies—likely Han style.',
  },
  s0461: {
    literal: 'Those combining both forms are called "Qin-Han," meaning they follow both Qin and Han methods.',
    idiomatic: 'Hybrids of both are called "Qin-Han," using Qin and Han techniques together.',
  },
  s0462: {
    literal: 'The Liang History says when Hou Jing was about to harm Emperor Jianwen, he had the Director of Music Peng Juan bring a curved-neck pipa to the emperor\'s drinking—so the Southern Court seems not to have had them.',
    idiomatic: 'The Liang History records Hou Jing sending Music Director Peng Juan with a curved-neck pipa when Jianwen was to be killed—suggesting the southern court lacked them earlier.',
  },
  s0463: {
    literal: 'Curved-neck types also originally came from the Hu.',
    idiomatic: 'Curved-neck pipa likewise came from the Hu.',
  },
  s0464: {
    literal: 'Five-string pipa, somewhat smaller, probably from the northern states.',
    idiomatic: 'The five-string pipa, slightly smaller, likely came from the north.',
  },
  s0465: {
    literal: 'Customs and Mores says: strumming with the hand gave the name.',
    idiomatic: 'The Customs and Mores says hand-strumming named the instrument.',
  },
  s0466: {
    literal: 'Examining old pipa, all were plucked with wooden plectra; in the Zhenguan era of Taizong the hand-plucking method first appeared—today\'s "strummed pipa" is this.',
    idiomatic: 'Older pipa were all plectrum-plucked; Taizong\'s Zhenguan reign first saw finger playing—the modern strummed pipa.',
  },
  s0467: {
    literal: 'What Customs and Mores calls "hand pipa."',
    idiomatic: 'This is the "hand pipa" of Customs and Mores.',
  },
  s0468: {
    literal: 'Is not the meaning of using a plectrum—did earlier ages already have hand-strummers?',
    idiomatic: 'That is not plectrum playing—did antiquity already know finger strumming?',
  },
  s0469: {
    literal: 'Ruan Xian: also a Qin pipa, but the neck longer than present models, with thirteen bridges.',
    idiomatic: 'Ruan Xian pipa are Qin-style too, with longer necks than today and thirteen bridges.',
  },
  s0470: {
    literal: 'In Empress Wu\'s time the Shu man Kuai Lang obtained one from an ancient tomb.',
    idiomatic: 'Under Empress Wu, Kuai Lang of Shu recovered one from a tomb.',
  },
  s0471: {
    literal: 'The Jin "Seven Sages of the Bamboo Grove" picture of Ruan Xian\'s playing matches this type—hence the name Ruan Xian.',
    idiomatic: 'Ruan Xian in the Jin Bamboo Grove portrait plays the same form—hence the name.',
  },
  s0472: {
    literal: 'Xian in the Jin age was truly famed for skill at pipa and knowing pitch.',
    idiomatic: 'Ruan Xian in Jin times was renowned for pipa and pitch.',
  },
  s0473: {
    literal: 'Konghou: Emperor Wu of Han had the musician Hou Diao make it to sacrifice to the Grand Unity.',
    idiomatic: 'Konghou: Emperor Wu ordered musician Hou Diao to build it for Grand Unity sacrifice.',
  },
  s0474: {
    literal: 'Some say Hou Hui made it; its sound kan kan answered the beat, called kan hou—corrupted in speech to konghou.',
    idiomatic: 'Others credit Hou Hui; its kan-kan tone matched the beat, called kan hou—later slurred to konghou.',
  },
  s0475: {
    literal: 'Some say it was Master Yan\'s decadent music—not so.',
    idiomatic: 'Some call it Master Yan\'s decadent tune—incorrect.',
  },
  s0476: {
    literal: 'Older accounts also follow qin construction.',
    idiomatic: 'Older sources modeled it on the qin.',
  },
  s0477: {
    literal: 'Now examining its form, like a se but smaller, seven strings, plucked with a plectrum like pipa.',
    idiomatic: 'Its body resembles a small se with seven plucked strings, played like pipa.',
  },
  s0478: {
    literal: 'Vertical konghou: Hu music; Emperor Ling of Han loved it.',
    idiomatic: 'Vertical konghou is Hu music; Emperor Ling favored it.',
  },
  s0479: {
    literal: 'The body curved and long, twenty-two strings, held upright in the bosom, both hands playing together—commonly called "splitting konghou."',
    idiomatic: 'Curved and long, twenty-two strings, cradled upright and played with both hands—popularly "splitting konghou."',
  },
  s0480: {
    literal: 'Phoenix-head konghou has a neck like tuning pegs.',
    idiomatic: 'Phoenix-head konghou bears a pegged neck.',
  },
  s0481: {
    literal: 'Seven strings; made by Zheng Shanzi, presented in the Kaiyuan era.',
    idiomatic: 'Seven-string version by Zheng Shanzi, submitted in Kaiyuan.',
  },
  s0482: {
    literal: 'Shaped like Ruan Xian, the lower part shortened while the body is large, with small gaps at the sides for ease of holding.',
    idiomatic: 'Like Ruan Xian but with a shortened base, broad body, and side notches for grip.',
  },
  s0483: {
    literal: 'Thirteen string divisions, one solitary bridge: open tones seven, stopped tones ninety-one, bridge tone one—in all ninety-nine sounds, shifting with mode to match pitch.',
    idiomatic: 'Thirteen divisions and one bridge yield seven open tones, ninety-one stopped, one bridge tone—ninety-nine pitches in all, tuned to the mode.',
  },
  s0484: {
    literal: 'Taiyi: presented by Sima Xuan in the Kaiyuan era.',
    idiomatic: 'The Taiyi instrument was presented by Sima Xuan in Kaiyuan.',
  },
  s0485: {
    literal: 'Twelve strings, six divisions: open tones twelve, stopped seventy-two.',
    idiomatic: 'Twelve strings, six stops—twelve open tones and seventy-two stopped.',
  },
  s0486: {
    literal: 'Open string tones match the pitch pipes; stopped tones cycle as palace modes—in all eighty-four modes.',
    idiomatic: 'Open tones match the lü; stopped tones rotate through palace modes for eighty-four keys.',
  },
  s0487: {
    literal: 'Now compiled into use within the elegant music palace set.',
    idiomatic: 'It is now entered in the court elegant-music hanging ensemble.',
  },
  s0488: {
    literal: 'Six strings: made by Shi Sheng, presented in the Tianbao era, shaped like pipa but longer.',
    idiomatic: 'Six-string instrument by Shi Sheng, Tianbao submission, pipa-shaped but longer.',
  },
  s0489: {
    literal: 'Six strings, four divisions, one solitary bridge: open six, stopped twenty-four, bridge one—in all thirty-one sounds, each division answering pitch.',
    idiomatic: 'Six strings, four stops, one bridge—six open, twenty-four stopped, one bridge tone; thirty-one pitches matching the mode.',
  },
  s0490: {
    literal: 'Tianbao Music: made by Ren Yan, presented in the Tianbao era.',
    idiomatic: 'Tianbao Music by Ren Yan, submitted in Tianbao.',
  },
  s0491: {
    literal: 'Like a stone pillar, fourteen strings, six bridges.',
    idiomatic: 'Stone-pillar shape, fourteen strings, six bridges.',
  },
  s0492: {
    literal: 'One Huangzhong series fully doubles seven tones; shifting bridges sets the mode to pitch.',
    idiomatic: 'One Huangzhong scale doubles seven tones; moving bridges tunes each mode.',
  },
  s0493: {
    literal: 'Xun: xun (dusk); the sound of Beginning Autumn—the myriad things will turn dusk-yellow.',
    idiomatic: 'Xun means dusk—the Beginning Autumn tone when all things yellow toward evening.',
  },
  s0494: {
    literal: 'Pounded earth makes it, like a goose egg, six holes in all, sharp above and full below.',
    idiomatic: 'It is molded clay, goose-egg sized, six holes, tapered top and rounded base.',
  },
  s0495: {
    literal: 'The large one the Erya calls hu (jar).',
    idiomatic: 'The large type the Erya names hu.',
  },
  s0496: {
    literal: 'Fou: like a foot-basin; ancient music of the western Rong; Qin custom adopted and used it.',
    idiomatic: 'Fou resembles a foot-basin—old western Rong music that Qin custom took up.',
  },
  s0497: {
    literal: 'Its form resembles an inverted basin; struck with four rods.',
    idiomatic: 'Shaped like an upside-down pot, beaten with four sticks.',
  },
  s0498: {
    literal: 'When Qin and Zhao met at Mianchi, the King of Qin struck the fou and sang.',
    idiomatic: 'At the Mianchi meeting the King of Qin beat the fou and sang.',
  },
  s0499: {
    literal: 'Eight fou: in the first year of Yongtai of Tang, Sima Can presented "Guangping Music"—probably eight fou completing one Huangzhong series.',
    idiomatic: 'Eight fou: in Tang Yongtai 1 Sima Can offered Guangping Music—eight fou spanning one Huangzhong scale.',
  },
  s0500: {
    literal: 'Bell: fashioned by Chui, artisan of the Yellow Emperor.',
    idiomatic: 'Bells were made by Chui, craftsman of the Yellow Emperor.',
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
