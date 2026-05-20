#!/usr/bin/env node
/** Batch 3: s0201–s0300 (Jiutangshu ch.018, Wenzong 2 / Wuzong) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/018.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 201;
const END = 300;

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
  s0201: {
    literal: 'The Emperor attended Lindde Hall and received fifteen Shive chiefs including Dutirelun.',
    idiomatic: 'At Lindde Hall Wuzong received fifteen Shive chiefs.',
  },
  s0202: {
    literal: 'Taiyuan memorialized the Uighur moved their camp forty li nearer south, demanding the rebel general Wamosi; yesterday at Hengshui they captured and plundered; also the princess memorialized food exhausted, begging cattle and sheep.',
    idiomatic: 'Taiyuan reported Uighur camps nearer, demanding Wamosi and begging food for the princess.',
  },
  s0203: {
    literal: 'An edict to Wujie said:',
    idiomatic: 'The court sent Wujie this edict:',
  },
  s0204: {
    literal: '"I since facing the realm am parent to the people; I only take cherishing life as virtue and do not wish to make indiscriminate war a name.',
    idiomatic: '"As parent of the realm I cherish life, not glory in war."',
  },
  s0205: {
    literal: 'Therefore since your state\'s misfortune of Kirghiz destruction you came to the border—already years in receiving and soothing without limit.',
    idiomatic: '"Since your Kirghiz ruin we have fed and soothed you for years."',
  },
  s0206: {
    literal: 'At first remembering your hunger, grain stores were given;',
    idiomatic: '"We first gave grain for your hunger;"',
  },
  s0207: {
    literal: 'then knowing your wounds, horse prices were fully returned.',
    idiomatic: '"then returned your horse prices when you were broken."',
  },
  s0208: {
    literal: 'Envoys were repeatedly sent to console; roads were crowded.',
    idiomatic: '"Envoys crowded the roads in consolation."',
  },
  s0209: {
    literal: 'Small harassments were all not counted.',
    idiomatic: '"Small raids we overlooked."',
  },
  s0210: {
    literal: 'Now the qaghan still nears the frontier and has not discussed returning to the steppe.',
    idiomatic: '"Yet you linger near the frontier without returning."',
  },
  s0211: {
    literal: 'Court ministers and frontier commissioners all harbor suspicion and anger, all requesting troops; though I urgently practice forbearance, I also am not instructed.',
    idiomatic: '"Ministers demand war though I still forbear."',
  },
  s0212: {
    literal: 'Yesterday several envoys returned.',
    idiomatic: '"Yesterday\'s envoys returned saying"',
  },
  s0213: {
    literal: 'all saying the qaghan only awaited horse price; when ordered paid, again heard his stops repeatedly shifted, sometimes raiding Yun and Shuo, sometimes seizing Qiang and Hun tribes—not knowing this intent, in the end what is intended?',
    idiomatic: '"you awaited horse price yet raided Yun, Shuo, Qiang, and Hun—what do you intend?"',
  },
  s0214: {
    literal: 'If because horse price is not yet paid you must near the wall, in movement you should first tell frontier generals.',
    idiomatic: '"If you need the wall for horse price, tell our generals first."',
  },
  s0215: {
    literal: 'How can you come suddenly and go suddenly, migrating without constancy?',
    idiomatic: '"Do not come and go without notice."',
  },
  s0216: {
    literal: 'Though you say following grass and water, every move nearly presses city ramparts.',
    idiomatic: '"Even following pasture you press our ramparts."',
  },
  s0217: {
    literal: 'From afar weighing deep intent, it seems to rely on marriage kinship;',
    idiomatic: '"You seem to rely on marriage yet"',
  },
  s0218: {
    literal: 'each sight of tracks is truly a plan of sudden raid.',
    idiomatic: '"your tracks show raid plans."',
  },
  s0219: {
    literal: 'Moreover reaching below Hengshui stockade, slaughter was very great.',
    idiomatic: '"You slaughtered greatly at Hengshui."',
  },
  s0220: {
    literal: 'Tribal and Hun cattle and sheep—would you spare driving plunder?',
    idiomatic: '"You plundered tribal herds;"',
  },
  s0221: {
    literal: 'what crime had common people—all were wounded and killed.',
    idiomatic: '"and killed common people without crime."',
  },
  s0222: {
    literal: 'Therefore central ministers all say: "The Uighur near the frontier already violate the covenant;',
    idiomatic: '"Ministers say you violate the covenant"',
  },
  s0223: {
    literal: 'further killing frontier people truly betrays great righteousness.',
    idiomatic: '"and betray righteousness by killing border people."',
  },
  s0224: {
    literal: '" All wish to cut and drive because of this to avenge the wronged dead.',
    idiomatic: '"and wish to destroy you to avenge the dead."',
  },
  s0225: {
    literal: 'Yet my intent rests in gentle cherishing, feeling deep in bending myself—I cannot bear the qaghan\'s ingratitude and finally not indulge in opportunistic disaster.',
    idiomatic: '"Yet I still forbear though you are ungrateful."',
  },
  s0226: {
    literal: 'Shi Jiezhi long in the capital fully knows human hearts are indignant; arising from sincere earnestness he firmly requested to go himself.',
    idiomatic: '"Shi Jiezhi, knowing the court\'s wrath, begged to go."',
  },
  s0227: {
    literal: 'I praise his deep seeing of affairs and could not refuse obstruction.',
    idiomatic: '"I could not refuse him."',
  },
  s0228: {
    literal: 'Qaghan examine yourself and quickly choose a good plan—do not reach incorrigibility and bring later regret."',
    idiomatic: '"Choose wisely before regret comes." Thus ended the edict.',
  },
  s0229: {
    literal: 'The edict closed with the closing bracket.',
    idiomatic: 'Thus ended the edict.',
  },
  s0230: {
    literal: 'An edict ordered Taiyuan to raise Shive, Shatuo three tribes, and Tuhun tribes; Shi Xiong was vanguard.',
    idiomatic: 'Taiyuan raised Shive, Shatuo, and Tuhun with Shi Xiong as vanguard.',
  },
  s0231: {
    literal: 'Yiding thousand men guarded Datong Army; Qibi Tong and He Qingchao led Shatuo and Tuhun six thousand cavalry toward Tiande; Li Sizhong led Uighur and Tangut troops encamped at Baoda stockade.',
    idiomatic: 'Allied columns marched on Tiande and Baoda.',
  },
  s0232: {
    literal: 'Tenth month: Tibetan qaghan died; envoys Lun Pire entered court announcing mourning; Director of Imperial Works Li Jing was ordered into Tibet to mourn.',
    idiomatic: 'The Tibetan qaghan died; Li Jing was sent to mourn.',
  },
  s0233: {
    literal: 'The Emperor visited Jingyang and hunted at White Deer Plain.',
    idiomatic: 'Wuzong hunted at White Deer Plain near Jingyang.',
  },
  s0234: {
    literal: 'Remonstrance officials Gao Shaoyi and Zheng Lang debated within the hall: "Your Majesty hunts too often, leaves the city somewhat far, myriad affairs abandoned, stars out and night return—now using troops, for the time stop."',
    idiomatic: 'Gao Shaoyi and Zheng Lang urged an end to frequent hunts during war.',
  },
  s0235: {
    literal: 'The Emperor graciously comforted them.',
    idiomatic: 'Wuzong graciously heard them.',
  },
  s0236: {
    literal: 'When remonstrance officials left they told the councillors: "Remonstrance officials are very important; I sometimes hear their words and may reduce faults."',
    idiomatic: 'He told councillors remonstrance kept him from error.',
  },
  s0237: {
    literal: 'Huichang 3, spring, first month—year Huichang 3 duplicated—because troops were long in the field, the New Year audience was canceled.',
    idiomatic: 'Huichang 3 canceled the New Year audience for troops in the field.',
  },
  s0238: {
    literal: 'An order: newly appointed Yinzhou prefect, tribal superintendent, Yin River supervisor He Qingchao was made Acting Crown Prince Guest of Honor and Left Dragon Martial great general, ordered to divide command of Shatuo, Tuhun, and Tangut masses to Zhenwu, taking Liu Mian\'s disposition.',
    idiomatic: 'He Qingchao was sent to Zhenwu commanding tribal allies.',
  },
  s0239: {
    literal: 'Second month: the prior edict forbidding officials\' households from private temples in the capital—the six wards south of the imperial city might not have them; secluded wards might keep old ones.',
    idiomatic: 'Private temples were banned in the southern capital wards only.',
  },
  s0240: {
    literal: 'Taiyuan Liu Mian memorialized: "Yesterday leading allied commands to Datong Army, sent Shi Xiong to raid the Uighur royal camp; Xiong greatly defeated the Uighur at Kill-Hu Mountain; Wujie qaghan was wounded and fled.',
    idiomatic: 'Liu Mian reported Shi Xiong\'s victory at Kill-Hu Mountain and Wujie wounded;',
  },
  s0241: {
    literal: 'Princess Taihe has been welcomed to Yunzhou."',
    idiomatic: 'Princess Taihe reached Yunzhou."',
  },
  s0242: {
    literal: 'That day the Emperor attended Xuanzheng Hall; the hundred officials congratulated.',
    idiomatic: 'That day the court congratulated at Xuanzheng Hall.',
  },
  s0243: {
    literal: 'An order said:',
    idiomatic: 'A victory edict proclaimed:',
  },
  s0244: {
    literal: '"What Heaven abandons, hard to apply continuing-the-lineage grace;',
    idiomatic: '"Heaven\'s abandoned may not receive continuing-lineage grace;"',
  },
  s0245: {
    literal: 'what men discard should use the way of insulting the perished."',
    idiomatic: '"what men discard should be destroyed."',
  },
  s0246: {
    literal: 'I each think on former instruction—how can I forget the maxim?',
    idiomatic: '"I remember the maxim of destroying the perished."',
  },
  s0247: {
    literal: 'The Uighur lately relied on military strength, long been fierce and arrogant, oppressing all tribes, knotting hate with near neighbors.',
    idiomatic: '"The Uighur grew arrogant and oppressed neighbors."',
  },
  s0248: {
    literal: 'The Kirghiz sent troops like a comet sweep; the dome dwelling collapsed, clans all oiled the wilds, districts reached brambles.',
    idiomatic: '"Kirghiz swept them; clans perished in the wilds."',
  },
  s0249: {
    literal: 'Now the qaghan fled losing the state, stealing title and standing alone, far crossing desert, trusting life to the frontier.',
    idiomatic: '"Their qaghan fled and clung to our border."',
  },
  s0250: {
    literal: 'I thought on their decline and soon added relief.',
    idiomatic: '"I pitied and fed them."',
  },
  s0251: {
    literal: 'Each memorial often held many false flattery;',
    idiomatic: '"Their memorials flattered;"',
  },
  s0252: {
    literal: 'receiving my envoys as in full flourishing days.',
    idiomatic: '"they treated envoys as if still mighty."',
  },
  s0253: {
    literal: 'No wounded bird\'s mournful cry—there was a cornered beast still fighting mind.',
    idiomatic: '"They fought like cornered beasts."',
  },
  s0254: {
    literal: 'Last year they secretly entered Shuochuan, greatly plundering cattle and horses;',
    idiomatic: '"Last year they raided Shuochuan for herds;"',
  },
  s0255: {
    literal: 'this spring they suddenly struck Zhenwu, nearing the walled city.',
    idiomatic: '"this spring they struck Zhenwu near the walls."',
  },
  s0256: {
    literal: 'The qaghan all personally led troops, first as robber chief, not ashamed of defeat, not caring for marriage kin.',
    idiomatic: '"The qaghan himself led raids without shame or kinship."',
  },
  s0257: {
    literal: 'Hedong commissioner Liu Mian gauged the enemy and plotted victory, seized opportunity for triumph, sent Hu and Mo cavalry as vanguard, plucked the feather-banner flag while they were in the burrow.',
    idiomatic: 'Liu Mian sent Hu and Mo cavalry under Shi Xiong to strike their camp.',
  },
  s0258: {
    literal: 'Short weapons battled below the tent; the chief villain was seized in the trap.',
    idiomatic: 'The enemy chief was seized in the tent battle.',
  },
  s0259: {
    literal: 'Moreover riding not the six flying horses, masses barely one command, stores already exhausted—capture counted by days.',
    idiomatic: 'Their few starving horses could be taken within days.',
  },
  s0260: {
    literal: 'Princess Taihe\'s dwelling differed; affection long severed.',
    idiomatic: 'Princess Taihe had long been estranged.',
  },
  s0261: {
    literal: 'Missing homeland she often heard the yellow crane\'s song;',
    idiomatic: 'She longed for home like the yellow crane song;',
  },
  s0262: {
    literal: 'losing position she grieved—how avoid the Green Clothes\' lament.',
    idiomatic: 'and grieved her lost station like the Green Clothes ode.',
  },
  s0263: {
    literal: 'Thinking on her bonds and hardship often pained my heart.',
    idiomatic: 'Her suffering pained the Emperor.',
  },
  s0264: {
    literal: 'Now freed from wolves and dogs, again seeing palace gates—above to vent the ancestral temple\'s old wrath, next to comfort the grand empress dowager\'s deep kindness; forever speaking return and peace, truly used joy and gratitude.',
    idiomatic: 'Freed, she returned to vent ancestral wrath and comfort the empress dowager.',
  },
  s0265: {
    literal: 'The Uighur already broken and destroyed—righteousness lies in cutting them; all commands\' troops should jointly advance to punish.',
    idiomatic: 'Uighur destruction required joint pursuit.',
  },
  s0266: {
    literal: 'Hedong merit troops and below—richly reward; continued memorials will dispose.',
    idiomatic: 'Hedong victors would be richly rewarded.',
  },
  s0267: {
    literal: 'Those in capital outer residences and eastern capital performing merit Uighur—all forced caps and belts, each assigned to commands for custody.',
    idiomatic: 'Capital Uighur were registered to commands.',
  },
  s0268: {
    literal: 'Uighur and Manichean temple estates, money and goods—all entrusted to the Merit commissioner with Censorate and Jingzhao each sending officers to inspect and seize; no person of any sort might shadow-occupy.',
    idiomatic: 'Uighur and Manichean property was seized by imperial order.',
  },
  s0269: {
    literal: 'Violators all suffer extreme law; money and goods enter the treasury.',
    idiomatic: 'Violators faced death; goods went to the treasury.',
  },
  s0270: {
    literal: 'Manichean monks were entrusted to the Secretariat to memorialize disposal."',
    idiomatic: 'Manichean monks awaited secretariat disposal." Thus ended the edict.',
  },
  s0271: {
    literal: 'The edict closed with the closing bracket.',
    idiomatic: 'Thus ended the edict.',
  },
  s0272: {
    literal: 'Linzhou prefect and Tiande campaign vice commissioner Shi Xiong was made Silver-Gleam Grand Master, Acting Left Cavalier, Fengzhou prefect, Censor-in-Chief, full Fengzhou western inner-city metropolitan defense and tribal superintendent.',
    idiomatic: 'Shi Xiong was richly rewarded for the Uighur victory.',
  },
  s0273: {
    literal: 'Liu Mian was made Acting Left Vice Director; Zhang Zhongwu Acting Right Vice Director—the rest as before.',
    idiomatic: 'Liu Mian and Zhang Zhongwu were promoted.',
  },
  s0274: {
    literal: 'Kirghiz envoy Zhunwu Hesu entered court, presenting two famous horses, saying the qaghan had broken the Uighur and welcomed Princess Taihe home, sending men to escort the princess to court, fearing Uighur remnants would seize her on the road.',
    idiomatic: 'Kirghiz envoys offered horses and asked Tang to escort the princess.',
  },
  s0275: {
    literal: 'The Emperor then sent palace envoys with Zhunwu Hesu to Taiyuan to welcome the princess.',
    idiomatic: 'Envoys went to Taiyuan with the Kirghiz.',
  },
  s0276: {
    literal: 'At the time Wujie qaghan was shot; he fled seeking the Black Cart; an edict ordered Kirghiz troops to attack.',
    idiomatic: 'Wujie, wounded, fled to the Black Cart; Kirghiz were ordered to pursue.',
  },
  s0277: {
    literal: 'Third month: Princess Taihe reached the capital; officials lined at Zhangjing Temple to welcome; still ordered the offices to announce to Xianzong and Muzong\'s shrines.',
    idiomatic: 'In the third month Princess Taihe returned amid state rites.',
  },
  s0278: {
    literal: 'Fourth month: Zhaoyi commissioner Liu Congjian died; the three armies made his nephew Zhen provisional commander and memorialized for credentials.',
    idiomatic: 'Liu Congjian died; his nephew Zhen seized Zhaoyi.',
  },
  s0279: {
    literal: 'Soon envoys were sent with edicts to Luzhou ordering Zhen to escort Congjian\'s bier to Luoyang.',
    idiomatic: 'Edicts ordered Zhen to send the bier to Luoyang.',
  },
  s0280: {
    literal: 'Zhen refused court orders.',
    idiomatic: 'Zhen refused.',
  },
  s0281: {
    literal: 'An edict ordered Secretariat, Chancellery, both departments, Censorate fourth rank and above, martial officials third rank and above, to meet debating whether Liu Zhen might be executed or pardoned and report.',
    idiomatic: 'The court debated executing Liu Zhen.',
  },
  s0282: {
    literal: 'Fifth month: an order for all military commissioners\' personal guards not to exceed sixty, observation commissioners forty, frontier commissioners thirty.',
    idiomatic: 'Personal guards of commissioners were capped.',
  },
  s0283: {
    literal: 'Wangxian Observatory was built in the forbidden inner palace.',
    idiomatic: 'Wangxian Observatory rose in the inner palace.',
  },
  s0284: {
    literal: 'Councillors and hundred officials submitted debate memorials: "Because the western barbarians are not destroyed and the frontier uses troops, the central plain should not raise affairs—the Luzhou request is to have an imperial prince hold title remotely and let Zhen provisionally command troops until frontier war ends."',
    idiomatic: 'Most councillors urged a remote prince and temporary Zhen command until frontier war ended.',
  },
  s0285: {
    literal: 'Only Li Deyu held that Ze-Lu was inner land; when Congjian was permitted succession it was already a lost judgment; afterward overbearing hard to control, scheming to coerce the court.',
    idiomatic: 'Li Deyu alone said Zhen must be destroyed lest Ze-Lu coerce the court again.',
  },
  s0286: {
    literal: 'Because Zhen is a stripling, one cannot repeat the prior cart—strike and he will be extinguished.',
    idiomatic: '"Zhen is young; strike and he falls."',
  },
  s0287: {
    literal: 'Wuzong\'s nature was heroic; he said: "I agree with Deyu—surely no later regret."',
    idiomatic: 'Wuzong sided with Deyu: "No regret."',
  },
  s0288: {
    literal: 'From this remonstrance officials\' memorials saying troops must not be used followed in succession.',
    idiomatic: 'Remonstrators then flooded in against war.',
  },
  s0289: {
    literal: 'Sixth month: the western inner Divine Dragon Temple burned.',
    idiomatic: 'The inner Divine Dragon Temple burned.',
  },
  s0290: {
    literal: 'Left Army Commandant Duke of Chu Qiu Shiliang died.',
    idiomatic: 'Qiu Shiliang died.',
  },
  s0291: {
    literal: 'Autumn, seventh month, wuzi: councillors memorialized: "Autumn color has arrived; we will discuss advancing troops; Youzhou must early pacify the Uighur, Zhen and Wei must quickly execute Liu Zhen—each must send envoys proclaiming intent and spy the three commands\' army mood."',
    idiomatic: 'In the seventh month councillors planned envoys to three commands.',
  },
  s0292: {
    literal: 'Today in Extended Ying we received the sacred face wishing to send Zhang Jia as envoy.',
    idiomatic: 'The Emperor first named Zhang Jia envoy.',
  },
  s0293: {
    literal: 'We continued discussion: Zhang Jia is capable and knows army situation well, but his nature is hard and proud—we fear no peace—better for now order Li Hui.',
    idiomatic: 'Councillors preferred Li Hui over the proud Zhang Jia.',
  },
  s0294: {
    literal: 'If the censorate lacks men, War Vice Minister Zheng Ya long served as frontier commissioner\'s aide, very keen though without eloquence, affairs clear, rank heavy duty light—most fitting."',
    idiomatic: 'They also named Zheng Ya as an alternative.',
  },
  s0295: {
    literal: 'The Emperor said: "Better order Li Hui return."',
    idiomatic: '"Send Li Hui," said the Emperor.',
  },
  s0296: {
    literal: 'Immediately Li Hui was sent as envoy to the three commands.',
    idiomatic: 'Li Hui was dispatched to the three commands.',
  },
  s0297: {
    literal: 'Eighth month, renxu: Mars since the seventh month was pale red, shaking in the well; by this month\'s sixteenth it transgressed Ghost.',
    idiomatic: 'On renxu Mars transgressed Ghost after shaking in the well.',
  },
  s0298: {
    literal: 'Wannian county eastern market burned.',
    idiomatic: 'Wannian\'s east market burned.',
  },
  s0299: {
    literal: 'Kirghiz envoy Didesi Nanzhu entered court.',
    idiomatic: 'Another Kirghiz envoy arrived.',
  },
  s0300: {
    literal: 'Right Vice Director and Grand Councillor Chen Yixing was made Acting Minister of Works, concurrent Hezhong prefect and Censor-in-Chief, full Hezhong military commissioner and Jin- Jiang- Ci- Li observation commissioner.',
    idiomatic: 'Chen Yixing took Hezhong.',
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
if (data.metadata.chapter !== '018') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 018; standalone T ready (${Object.keys(T).length} entries).`
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
