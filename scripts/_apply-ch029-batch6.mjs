#!/usr/bin/env node
/** Batch 6: s0501–s0600 (Jiutangshu ch.029, Rites 5 / court music) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/029.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 501;
const END = 600;

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
  s0501: {
    literal: 'Bell: zhong (seed); the sound of Beginning Autumn—the myriad things\' seeding is complete.',
    idiomatic: 'Bell means seed—the Beginning Autumn tone when harvest is set.',
  },
  s0502: {
    literal: 'Large ones are bo; bo is also a great bell.',
    idiomatic: 'Large bells are bo; bo itself is a great bell.',
  },
  s0503: {
    literal: 'The Erya calls it yong.',
    idiomatic: 'The Erya names the great bell yong.',
  },
  s0504: {
    literal: 'Small ones strung in sets are called bianzhong; medium are piao, small zhan.',
    idiomatic: 'Smaller sets are bianzhong; middle size piao, smallest zhan.',
  },
  s0505: {
    literal: 'Chunyu: round like a pestle-head, large above and small below, suspended on a cage-frame; mangmei leads it to harmonize with drums.',
    idiomatic: 'Chunyu is pestle-shaped, wide top and narrow bottom, hung on a frame; mangmei beats it with the drums.',
  },
  s0506: {
    literal: 'Shen Yue\'s Song History says, "the common world still has them at times"—so in Song days they were not used in temple courts.',
    idiomatic: 'Shen Yue\'s Song History says commoners still keep them—so Song temples did not use them.',
  },
  s0507: {
    literal: 'Later Zhou, having pacified Shu, obtained one; Husi Zheng observed and said: "A chunyu."',
    idiomatic: 'Later Zhou captured one in Shu; Husi Zheng identified it as chunyu.',
  },
  s0508: {
    literal: 'Testing by Gan Bao\'s Zhou Rites commentary, it was as he said.',
    idiomatic: 'Trial against Gan Bao\'s Zhou Rites note proved him right.',
  },
  s0509: {
    literal: 'Nao: wooden tongue, shaken to harmonize with drums.',
    idiomatic: 'Nao has a wooden clapper shaken with the drums.',
  },
  s0510: {
    literal: 'Liang had bronze qing—probably today\'s fangxiang type.',
    idiomatic: 'Liang used bronze qing—likely the modern fangxiang.',
  },
  s0511: {
    literal: 'Fangxiang: made of iron, eight inches long, two inches wide, round above and square below.',
    idiomatic: 'Fangxiang is iron, eight by two inches, round on top and square below.',
  },
  s0512: {
    literal: 'The frame like qing but without yew stands; leaned on the frame to replace bells and qing.',
    idiomatic: 'Frames resemble qing stands without yew; plates lean on the frame instead of bells and stones.',
  },
  s0513: {
    literal: 'Those used among the people are only three or four inches.',
    idiomatic: 'Folk versions are only three or four inches.',
  },
  s0514: {
    literal: 'Bronze ba, also called bronze pan, comes from the western Rong and southern Man.',
    idiomatic: 'Bronze ba or bronze pan comes from western Rong and southern Man.',
  },
  s0515: {
    literal: 'Several inches round, bosses rising like floating bubbles, threaded on hide—struck together for harmony.',
    idiomatic: 'A few inches across with bubble-like bosses on leather thongs—clashed for rhythm.',
  },
  s0516: {
    literal: 'In southern Man states the large may be several feet round.',
    idiomatic: 'Southern Man types reach several feet across.',
  },
  s0517: {
    literal: 'Some say Southern Qi\'s Mu Shisu made them—not so.',
    idiomatic: 'Some credit Mu Shisu of Southern Qi—incorrect.',
  },
  s0518: {
    literal: 'Zheng: like a great bronze platter, suspended and struck to mark the drum.',
    idiomatic: 'Zheng resembles a large bronze dish, hung and struck to time the drums.',
  },
  s0519: {
    literal: 'Bronze drum: cast bronze, one face hollowed, inverted and struck on top.',
    idiomatic: 'Bronze drums are cast hollow on one side and beaten from above.',
  },
  s0520: {
    literal: 'Southern Yi of Funan and Tianzhu types are all like this.',
    idiomatic: 'Funan, Tianzhu, and similar southern peoples use the same form.',
  },
  s0521: {
    literal: 'Great houses in Lingnan have them; the large may span more than ten feet.',
    idiomatic: 'Lingnan magnates keep them; the largest exceed ten feet wide.',
  },
  s0522: {
    literal: 'Qing (stone chime): Shu fashioned it.',
    idiomatic: 'Stone qing were made by Shu.',
  },
  s0523: {
    literal: 'Qing: jing (firm); the sound of Beginning Winter—all things are firm and strong.',
    idiomatic: 'Qing means firm—the Beginning Winter tone when everything hardens.',
  },
  s0524: {
    literal: 'The Documents say, "floating qing from the Si bank"—meaning Si-bank stone can serve as qing.',
    idiomatic: 'The Documents\' "qing floated from the Si shore" means Si stone suffices for qing.',
  },
  s0525: {
    literal: 'Today qing stone all comes from Huayuan, not the Si bank.',
    idiomatic: 'Present qing stone comes from Huayuan, not Si.',
  },
  s0526: {
    literal: 'Ascent hymn qing are made of jade; the Erya calls them peng.',
    idiomatic: 'Ascent-hymn qing are jade; the Erya calls them peng.',
  },
  s0527: {
    literal: 'Drum: dong (movement); the sound of Winter Solstice—all things hold yang qi and move.',
    idiomatic: 'Drum means movement—the Winter Solstice tone when yang stirs within all things.',
  },
  s0528: {
    literal: 'Thunder drum eight faces to sacrifice to Heaven; spirit drum six faces for Earth; road drum four faces for ghosts and spirits.',
    idiomatic: 'Thunder drums have eight faces for Heaven, spirit drums six for Earth, road drums four for spirits.',
  },
  s0529: {
    literal: 'The Xia added feet below, called foot-drum.',
    idiomatic: 'Xia added feet underneath—the foot-drum.',
  },
  s0530: {
    literal: 'Yin people ran a post through, called pillar-drum.',
    idiomatic: 'Shang ran a pillar through it—the pillar-drum.',
  },
  s0531: {
    literal: 'Zhou people suspended it, called suspended drum.',
    idiomatic: 'Zhou suspended it—the suspended drum.',
  },
  s0532: {
    literal: 'Later ages followed Yin construction and set it up, called set-up drum.',
    idiomatic: 'Later generations followed Shang and erected it—the set-up drum.',
  },
  s0533: {
    literal: 'Jin drums are six feet six inches; when metal music plays, they are struck.',
    idiomatic: 'Jin drums measure six feet six; they sound when bronze music plays.',
  },
  s0534: {
    literal: 'Beside it a drum called answering drum, to harmonize with the great drum.',
    idiomatic: 'A companion answering drum harmonizes with the great drum.',
  },
  s0535: {
    literal: 'Small drums with handles are called bi; shaken to harmonize with drums.',
    idiomatic: 'Handled small drums are bi, shaken with the ensemble.',
  },
  s0536: {
    literal: 'Large ones are tao.',
    idiomatic: 'The large type is tao.',
  },
  s0537: {
    literal: 'Waist drum: large ones pottery, small ones wood, all broad at the head and slender at the belly—originally Hu drums.',
    idiomatic: 'Waist drums are wide-headed and narrow-waisted—large pottery, small wood—originally Hu.',
  },
  s0538: {
    literal: 'Shi Zun loved them and never left the transverse di\'s side.',
    idiomatic: 'Shi Zun kept them beside his transverse flute day and night.',
  },
  s0539: {
    literal: 'Qi drum: like a lacquered tub, one end larger, with a qi boss on the face like a musk navel—hence qi drum.',
    idiomatic: 'Qi drum is a lacquer bucket, one end wider, with a musk-navel boss on the head.',
  },
  s0540: {
    literal: 'Eaves drum: like a small jar, first covered with hide then lacquered.',
    idiomatic: 'Eaves drum is jar-sized, hide-skinned and lacquered.',
  },
  s0541: {
    literal: 'Jie drum: just like a lacquer bucket, struck with both hands; because it came from the Jie it is called jie drum, also "two-stick drum."',
    idiomatic: 'Jie drum is a lacquer barrel beaten with both hands—from the Jie people, also called two-stick drum.',
  },
  s0542: {
    literal: 'Dudan drum: like a waist drum but smaller, struck with mallets.',
    idiomatic: 'Dudan drum resembles a small waist drum beaten with sticks.',
  },
  s0543: {
    literal: 'Maoyuan drum: like the dudan but slightly larger.',
    idiomatic: 'Maoyuan drum is a bit larger than dudan.',
  },
  s0544: {
    literal: 'Dala drum: broader than jie but shorter, rubbed with the finger—very resonant; commonly called rubbing drum.',
    idiomatic: 'Dala is wider and shorter than jie, finger-rubbed and thunderous—folk call it the rubbing drum.',
  },
  s0545: {
    literal: 'Jilou drum: perfectly round; the hand-striking surface is flat for several inches.',
    idiomatic: 'Jilou drum is circular with a flat striking surface several inches wide.',
  },
  s0546: {
    literal: 'Zheng drum and he drum: one marks the beat, one harmonizes—both waist drums.',
    idiomatic: 'Zheng and he drums—lead and answer—are both waist drums.',
  },
  s0547: {
    literal: 'Beat drum: shaped like a game board, a round hole in the center fitting the drum—struck to mark the music.',
    idiomatic: 'Beat drum is board-shaped with a central hole for the drumhead—it keeps time.',
  },
  s0548: {
    literal: 'Caressing clapper: made of hide, stuffed with chaff—caressed to mark the music.',
    idiomatic: 'Caressing clappers are hide pouches filled with chaff and brushed for tempo.',
  },
  s0549: {
    literal: 'Metal, stone, silk, bamboo, gourd, clay, leather, and wood are called the Eight Sounds.',
    idiomatic: 'Metal, stone, silk, bamboo, gourd, clay, leather, and wood make the Eight Sounds.',
  },
  s0550: {
    literal: 'Metal and wood sounds are struck to become music.',
    idiomatic: 'Metal and wood become music by striking.',
  },
  s0551: {
    literal: 'Today eastern Yi have wooden pipes—the peach-bark type.',
    idiomatic: 'Eastern Yi still use wooden pipes—peach bark among them.',
  },
  s0552: {
    literal: 'Western Rong have metal blown—the bronze horn.',
    idiomatic: 'Western Rong blow metal—the bronze horn.',
  },
  s0553: {
    literal: 'Two feet long, shaped like an ox horn.',
    idiomatic: 'Two feet long and horn-shaped.',
  },
  s0554: {
    literal: 'Shell (bei): li (gourd); holds several sheng, all blown to mark music—also from southern Man.',
    idiomatic: 'Shells are gourd cups holding several pints, blown for rhythm—another southern Man instrument.',
  },
  s0555: {
    literal: 'Peach bark is rolled to make bili.',
    idiomatic: 'Peach bark is rolled into bili pipes.',
  },
  s0556: {
    literal: 'Whistling leaf: holding a leaf in the mouth and whistling—the sound clear and piercing; tangerine and pomelo are especially good.',
    idiomatic: 'Leaf whistles—leaf between the lips—ring bright; citrus leaves work best.',
  },
  s0557: {
    literal: 'The quantities of silk and bamboo among the four Yi differ by state and cannot be fully detailed.',
    idiomatic: 'Four-Yi silk-and-bamboo ensembles vary by realm beyond full listing.',
  },
  s0558: {
    literal: 'Erya: qin with twenty strings is called li; se with twenty-seven is called sa.',
    idiomatic: 'The Erya says twenty-string qin is li, twenty-seven-string se is sa.',
  },
  s0559: {
    literal: 'Han times had cave xiao, and also guan pipes a foot long and an inch around, lacquered together.',
    idiomatic: 'Han had cave xiao and bundled guan pipes a foot long, lacquered as one.',
  },
  s0560: {
    literal: 'Song times had raoliang, resembling horizontal konghou.',
    idiomatic: 'Song had raoliang, like horizontal konghou.',
  },
  s0561: {
    literal: 'Now all are lost.',
    idiomatic: 'All are extinct today.',
  },
  s0562: {
    literal: 'Today there is again chi over a full fathom long, called Seven Stars; like zheng but smaller, called Yunhe—the Music Office does not use them.',
    idiomatic: 'A modern chi spans a fathom ("Seven Stars"); a zheng-like Yunhe survives unused by the Music Office.',
  },
  s0563: {
    literal: 'The Zhou Son of Heaven had palace sets; feudal lords had hall sets, grand masters curved sets, knights single sets.',
    idiomatic: 'Zhou ritual graded hanging music: Son of Heaven palace set, lords hall set, grand masters curved, knights single.',
  },
  s0564: {
    literal: 'Hence in Confucius\' hall one heard metal and stone;',
    idiomatic: 'Confucius\' hall therefore rang with bells and stones;',
  },
  s0565: {
    literal: 'In Wei Jiang\'s house were the sounds of bells and qing.',
    idiomatic: 'Wei Jiang\'s household kept bells and chimes.',
  },
  s0566: {
    literal: 'Between Qin and Han this rite was unheard of.',
    idiomatic: 'From Qin through Han the practice faded from record.',
  },
  s0567: {
    literal: 'Han Chancellor Tian Fen arrayed bells and qing in his forecourt and set curved banners.',
    idiomatic: 'Chancellor Tian Fen lined his front court with bells, qing, and curved banners.',
  },
  s0568: {
    literal: 'Emperor Guangwu also granted the Prince of Donghai bell-stands and music.',
    idiomatic: 'Emperor Guangwu gave the Prince of Donghai bell frames and full sets.',
  },
  s0569: {
    literal: 'Thus even Han subjects still possessed metal and stone.',
    idiomatic: 'Even Han-era subjects could still keep metal and stone ensembles.',
  },
  s0570: {
    literal: 'A Han music song says, "High-hung four sets, spirits come to feast"—meaning the palace set.',
    idiomatic: 'Han lyrics run, "Four sets raised high, spirits feast"—the palace hanging.',
  },
  s0571: {
    literal: 'Master Zhi in the Grand Music Office could record the clang of gongs and the beat of drums.',
    idiomatic: 'Master Zhi of the Grand Music Office memorized gong-clang and drum patterns.',
  },
  s0572: {
    literal: 'The Prince of Hejian wrote the Music Record; the eight-row dance differed little from Master Zhi—again explicit text on the eight-row dance.',
    idiomatic: 'Prince of Hejian\'s Music Record and Master Zhi\'s eight-row dance nearly match—clear evidence of eight rows.',
  },
  s0573: {
    literal: 'Han Institutions says the High Temple strikes ten thousand-bushel bells, ten pieces—that in "Shanglin Fu" "striking thousand-bushel bells, setting up ten-thousand-bushel ingots."',
    idiomatic: 'Han Institutions: the High Temple strikes ten bells of thousand-bushel weight—the Shanglin Fu passage.',
  },
  s0574: {
    literal: 'Bells should be twelve, yet here ten—its meaning is unknown.',
    idiomatic: 'Twelve bells were standard; why ten here is unclear.',
  },
  s0575: {
    literal: 'Deliberators all say the Han age did not know how to use the palace set.',
    idiomatic: 'Scholars claim Han did not understand palace sets.',
  },
  s0576: {
    literal: 'Now examining Han Zhang and He reigns they used rotating modes; Han scholars fully explained the theory—the standard for Niu Hong and Zu Xiaosun.',
    idiomatic: 'Yet Han Zhang and He used rotating modes; Han ru detailed the theory that Niu Hong and Zu Xiaosun followed.',
  },
  s0577: {
    literal: 'Moreover the Prince of Hejian gathered classics and differed little from Master Zhi—know that Han music was most complete.',
    idiomatic: 'Prince of Hejian\'s anthologies align with Master Zhi—Han music was the fullest.',
  },
  s0578: {
    literal: 'From Wei and Jin onward they only speak of metal and stone in four wings, not the rite—sometimes eight frames, ten, or sixteen.',
    idiomatic: 'Wei-Jin sources mention four-wing metal and stone without ritual detail—eight, ten, or sixteen frames.',
  },
  s0579: {
    literal: 'Emperor Wu of Liang first used twenty-six frames.',
    idiomatic: 'Liang Wudi introduced twenty-six frames.',
  },
  s0580: {
    literal: 'At the beginning of Zhenguan thirty-six frames were added, plus twelve wind-and-percussion bear-pan frames at the four corners.',
    idiomatic: 'Early Zhenguan raised thirty-six frames and twelve corner wind-percussion bear stands.',
  },
  s0581: {
    literal: 'Later Wei, Zhou, and Qi all used twenty-six frames.',
    idiomatic: 'Northern Wei, Zhou, and Qi kept twenty-six frames.',
  },
  s0582: {
    literal: 'In the Jiande era Liang\'s thirty-six frames were restored.',
    idiomatic: 'Jiande restored Liang\'s thirty-six-frame layout.',
  },
  s0583: {
    literal: 'Wendi of Sui reduced them.',
    idiomatic: 'Sui Wendi cut the frames back.',
  },
  s0584: {
    literal: 'Emperor Yang restored them.',
    idiomatic: 'Yangdi restored the full array.',
  },
  s0585: {
    literal: 'Music stands: horizontal is suan, vertical is ju.',
    idiomatic: 'Hanging music: horizontal beams are suan, upright posts ju.',
  },
  s0586: {
    literal: 'Decorate suan with flying dragons, bases with Flying Serpent, bell ju with zhi beasts, qing ju with zhi birds, tree feathers above, tassels at the side—Zhou regulation.',
    idiomatic: 'Zhou style: dragon suan, Flying Serpent bases, beast bell-frames, bird qing-frames, feather plumes and tassels.',
  },
  s0587: {
    literal: 'Suspended with lofty teeth—Yin regulation.',
    idiomatic: 'Yin hung them with lofty teeth.',
  },
  s0588: {
    literal: 'Decorated with Bo Mountain—added by later ages.',
    idiomatic: 'Later ages added Bo Mountain ornament.',
  },
  s0589: {
    literal: 'Palace sets five golden Bo Mountains per frame; hall sets three.',
    idiomatic: 'Palace frames carry five gilt Bo Mountains each; hall frames three.',
  },
  s0590: {
    literal: 'Drums rest on floral bases, covered with flowered canopies, with soaring egrets gathered above.',
    idiomatic: 'Drums stand on floral pedestals under flowered canopies topped with egrets.',
  },
  s0591: {
    literal: 'Sui\'s twenty frames first placed set-up drums at the four corners, three bo bells on each cardinal face by their chen positions, with four frames each of bianzhong and qing interspersed.',
    idiomatic: 'Sui\'s twenty frames put set-up drums at the corners, three bo bells per cardinal direction, and four bianzhong and qing frames between.',
  },
  s0592: {
    literal: 'Twenty-six frames meant twelve bianzhong frames, qing likewise.',
    idiomatic: 'Twenty-six frames used twelve bianzhong frames and twelve qing.',
  },
  s0593: {
    literal: 'Hall sets nine frames: three bo frames at chen, chou, and shen; bianzhong and qing three frames each.',
    idiomatic: 'Hall sets: nine frames—three bo at chen, chou, shen; three bianzhong and three qing.',
  },
  s0594: {
    literal: 'Two road drums set inside the stand at xu and si to the north.',
    idiomatic: 'Two road drums north inside the stand at xu and si.',
  },
  s0595: {
    literal: 'Zhu and yu set at the four corners; dancers stand within.',
    idiomatic: 'Zhu and yu at the corners with dancers inside.',
  },
  s0596: {
    literal: 'Chunyu, nao, duo, caressing clapper, and pounding board arrayed among the dancers.',
    idiomatic: 'Chunyu, nao, duo, caressing clappers, and pounding boards line the dancers.',
  },
  s0597: {
    literal: 'Tang ritual: the Son of Heaven uses thirty-six frames for court and temple.',
    idiomatic: 'Tang rites give the emperor thirty-six frames for court and temple.',
  },
  s0598: {
    literal: 'When Gaozong completed Penglai Palace, seventy-two frames filled the courtyard.',
    idiomatic: 'Gaozong\'s Penglai Palace briefly held seventy-two frames in the courtyard.',
  },
  s0599: {
    literal: 'When Empress Wu moved the capital, they were reduced.',
    idiomatic: 'Empress Wu\'s capital move cut them back.',
  },
  s0600: {
    literal: 'The empress\'s temple and suburban sacrifices alike use twenty frames, with the same eight-row dance.',
    idiomatic: 'Empress temples and suburban rites use twenty frames and the eight-row dance.',
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
