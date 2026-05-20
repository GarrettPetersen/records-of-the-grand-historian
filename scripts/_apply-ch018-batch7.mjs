#!/usr/bin/env node
/** Batch 7: s0601–s0700 (Jiutangshu ch.018, Wenzong 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/018.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 601;
const END = 700;

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
  s0601: {
    literal: 'Huichang 6, first month, guimao new moon.',
    idiomatic: 'Huichang 6 opened on guimao.',
  },
  s0602: {
    literal: 'On dingsi Left Regular Attendant retired Feng Ding died; posthumously Minister of Works.',
    idiomatic: 'On dingsi retired Feng Ding died and was posthumously minister of works.',
  },
  s0603: {
    literal: 'On jiwei Nanzhao, Khitan, Shiwei, Bohai, Zangke, Kunming, and other states sent envoys to court, received at Qilin Hall.',
    idiomatic: 'On jiwei frontier embassies were received at Qilin Hall.',
  },
  s0604: {
    literal: 'Vice Minister of War, acting Revenue overseer Lu Shang memorialized: "Armies campaigning against the Tangut — now send one Revenue bureau official to circuits with grain, to calculate and issue supplies in advance."',
    idiomatic: 'Lu Shang ordered advance grain calculations for the Tangut campaign.',
  },
  s0605: {
    literal: 'Thus ended the edict; the throne assented.',
    idiomatic: 'Thus ended the edict.',
  },
  s0606: {
    literal: 'On jichou the Bohai prince Da Zhie entered court.',
    idiomatic: 'On jichou a Bohai prince presented tribute.',
  },
  s0607: {
    literal: 'The eastern capital Taiwei Palace completed images of the Primordial Lord, Xuanzong, and Suzong; Right Regular Attendant Pei Zhang was sent to Luoyang to offer sacrifice.',
    idiomatic: 'Pei Zhang was sent to dedicate Luoyang\'s new sage images.',
  },
  s0608: {
    literal: 'Supervising Censor Yuan Shou memorialized that former Pengzhou prefect Li Fu bought a Longxing Temple slave as wet-nurse — illegal — demoted to Suizhou prefect.',
    idiomatic: 'Yuan Shou banished Li Fu for buying a temple slave as wet-nurse.',
  },
  s0609: {
    literal: 'Second month, renshen new moon.',
    idiomatic: 'The second month opened on renshen.',
  },
  s0610: {
    literal: 'On guiyou, because seasonal rain was untimely, edict: "Capital and empire prisoners — except official corruption, armed robbery and murder, and the ten great rebellions — other crimes reduced one grade; light crimes all released.',
    idiomatic: 'Untimely rains brought a graded prisoner amnesty.',
  },
  s0611: {
    literal: 'Campaigning Tangut soldiers must not wantonly kill and wound."',
    idiomatic: 'Tangut troops were forbidden wanton killing."',
  },
  s0612: {
    literal: 'On dingchou Left Reminder Wang Gui begged leave to nurse his father, former Xingyuan military commissioner Qi, advanced in years — assented.',
    idiomatic: 'Wang Gui left office to nurse his aged father Wang Qi.',
  },
  s0613: {
    literal: 'That night the moon transgressed the great star of the Net, three cun apart.',
    idiomatic: 'That night the moon neared the Net\'s great star.',
  },
  s0614: {
    literal: 'On gengchen Xia military commissioner Mi Ji was made northeast campaign commissioner against the Tangut.',
    idiomatic: 'On gengchen Mi Ji took the northeast Tangut command.',
  },
  s0615: {
    literal: 'On renwu Right Heir-apparent Son Lü Rang memorialized: "My late elder brother Wen\'s daughter in Dahe 7 married Left Guard army-cao Xiao Min and bore two sons.',
    idiomatic: 'Lü Rang asked to reunite his niece with her divorced husband.',
  },
  s0616: {
    literal: 'In Kaicheng 3 Min\'s heart illness caused estrangement and they divorced.',
    idiomatic: 'They had divorced in Kaicheng 3 when Min fell ill.',
  },
  s0617: {
    literal: 'Now Min improves daily and again begs to marry my brother\'s niece."',
    idiomatic: 'Min had recovered and sought remarriage."',
  },
  s0618: {
    literal: 'Thus ended the edict; the throne assented.',
    idiomatic: 'Thus ended the edict.',
  },
  s0619: {
    literal: 'Former Heir-apparent Junior Protector Liu Mian was made Heir-apparent Grand Protector retired.',
    idiomatic: 'Liu Mian retired as grand protector of the heir.',
  },
  s0620: {
    literal: 'Former Shou prefect Wang Zhen was demoted to Lu prefect.',
    idiomatic: 'Wang Zhen was banished to Lu prefecture.',
  },
  s0621: {
    literal: 'On dinghai night the moon\'s color was slightly dim; at the first watch it transgressed Mars, four cun apart.',
    idiomatic: 'On dinghai night the moon dimmed and neared Mars.',
  },
  s0622: {
    literal: 'After long while its light lit the ground at seven degrees of the Chariot.',
    idiomatic: 'Its light later lit the ground in the Chariot.',
  },
  s0623: {
    literal: 'On renchen Hanlin academician, Diarist Sun Gu was made Vice Minister of War on duty.',
    idiomatic: 'On renchen Sun Gu took war duties at the Hanlin.',
  },
  s0624: {
    literal: 'Because of drought, the third-day Qujiang banquet grant was stopped.',
    idiomatic: 'Drought canceled the Shangsi Qujiang feast.',
  },
  s0625: {
    literal: 'Edict: "Recently because money was heavy and coin light, the living grew poorer; now newly added casting must circulate — to transform and save the season nothing is more urgent.',
    idiomatic: 'An edict ordered new coin to circulate and old coin phased out.',
  },
  s0626: {
    literal: 'The prior jia order should be proclaimed to warn hoarders."',
    idiomatic: 'Hoarders were warned under prior orders."',
  },
  s0627: {
    literal: 'Capital and circuits from first month next year, public and private use should all take new coin; old coin is provisionally stopped three years.',
    idiomatic: 'New coin was mandatory from next year\'s first month.',
  },
  s0628: {
    literal: 'If there is violation, handle like the lead-tin coin precedent.',
    idiomatic: 'Violators faced the lead-tin coin penalties.',
  },
  s0629: {
    literal: 'Old coin is all confiscated.',
    idiomatic: 'Old coin was to be confiscated.',
  },
  s0630: {
    literal: 'Closing quote." Again edict: "Circuit coin casting already has sequence; old coin must circulate so silk prices rise slightly.',
    idiomatic: 'A second edict required old coin circulation to raise silk prices.',
  },
  s0631: {
    literal: 'Civil and military hundred officials\' salaries from third month first day — half paid in cash on hand.',
    idiomatic: 'From the third month half of salaries would be paid in cash.',
  },
  s0632: {
    literal: 'First given bolts, valued at current price — all given cash on hand.',
    idiomatic: 'Cloth portions were converted to cash at market price.',
  },
  s0633: {
    literal: 'First given bolts, valued at current price — all given cash on hand.',
    idiomatic: 'Cloth portions were converted to cash at market price.',
  },
  s0634: {
    literal: 'Closing quote." Su Mian, Shuzhou prefect, was demoted to Lianzhou prefect.',
    idiomatic: 'Thus ended the edict. Su Mian was banished from Shuzhou to Lianzhou.',
  },
  s0635: {
    literal: 'Mian was a Li Zongmin partisan; formerly from supervising secretary he was expelled by Deyu; for years a prefect — now Li Shen said he governed without ability.',
    idiomatic: 'Su Mian, a Li Zongmin man Deyu had exiled, fell when Li Shen cited misrule.',
  },
  s0636: {
    literal: 'Bing-Ning military commissioner Gao Chenggong was made southwest campaign commissioner against the Tangut.',
    idiomatic: 'Gao Chenggong took the southwest Tangut command.',
  },
  s0637: {
    literal: 'On bingchen night the moon covered the south star of the Ox; it also transgressed Jupiter.',
    idiomatic: 'On bingchen the moon veiled the Ox and Jupiter.',
  },
  s0638: {
    literal: 'On dingyou the Silla envoy Jin Guolian entered court.',
    idiomatic: 'On dingyou a Silla envoy presented tribute.',
  },
  s0639: {
    literal: 'On xinchou night a northeast meteor like a peach, red in color, its light lit the ground, tail trace entering the Great Horn, streaming west through the Purple Forbidden enclosure.',
    idiomatic: 'On xinchou a red meteor blazed west through the Purple Forbidden enclosure.',
  },
  s0640: {
    literal: 'Third month, renyin: the Emperor was ill; an edict changed the imperial name to Yan.',
    idiomatic: 'In the third month Wuzong fell ill and took the name Yan.',
  },
  s0641: {
    literal: 'The Emperor valued wonder-workers, often took elixirs and cultivation, personally received registers and talismans.',
    idiomatic: 'He had dabbled in alchemy and Daoist registers.',
  },
  s0642: {
    literal: 'By now elixir frenzy — joy and anger abnormal — when illness was deep, ten days he could not speak.',
    idiomatic: 'Elixir fever left him mute in his final ten days.',
  },
  s0643: {
    literal: 'Chief ministers Li Deyu and others asked audience — not permitted.',
    idiomatic: 'Deyu and the premiers were refused audience.',
  },
  s0644: {
    literal: 'Inside and outside did not know whether he was safe; popular feeling was fearful.',
    idiomatic: 'The court did not know whether he lived; fear spread.',
  },
  s0645: {
    literal: 'On the twenty-third day of that month the testamentary edict was proclaimed: the imperial grand-uncle Prince of Guang ascended before the bier.',
    idiomatic: 'On the twenty-third Prince Guang ascended before the bier by testament.',
  },
  s0646: {
    literal: 'That day he died, age thirty-three.',
    idiomatic: 'Wuzong died that day at thirty-three.',
  },
  s0647: {
    literal: 'Posthumous title Zhaosu Xiaohuangdi, temple name Wuzong; eighth month that year buried at Duanling; Virtuous Consort Wang was attached in spirit.',
    idiomatic: 'He was buried at Duanling as Wuzong; Consort Wang joined him in the tomb.',
  },
  s0648: {
    literal: '[Commentary] The historiographer says: In Kaicheng the royal house daily sank; government lay with gate eunuchs.',
    idiomatic: '[Commentary] In Kaicheng the throne waned and eunuchs ruled.',
  },
  s0649: {
    literal: 'When the heir\'s robe was about to change, the heir\'s seat shifted in haste.',
    idiomatic: 'When succession loomed, the heir was swapped overnight.',
  },
  s0650: {
    literal: 'Zhaosu, solitary, buttressed the wall, fitted to receive the jade disk.',
    idiomatic: 'Wuzong, though isolated, was fitted to receive the mandate.',
  },
  s0651: {
    literal: 'Yet he could with fierce plan and brave cut restore departed authority;',
    idiomatic: 'He restored imperial authority by fierce resolve.',
  },
  s0652: {
    literal: 'deploy policy and rouse essence, pull up extraordinary heroes.',
    idiomatic: 'He promoted extraordinary men to office.',
  },
  s0653: {
    literal: 'When Heaven\'s pride lost its state and Lu\'s villain blocked armies, he was not deluded by full-court words but alone took great ministers\' plans.',
    idiomatic: 'He ignored court chatter and trusted his great ministers against Lu.',
  },
  s0654: {
    literal: 'Once war chariots were yoked, rebellion\'s outline was pacified, discipline was raised again, fame resounded anew — enough to tread Zhangwu\'s campaign traces and continue Yuanhe\'s quelling of chaos.',
    idiomatic: 'His campaigns pacified Lu and revived Yuanhe-era discipline.',
  },
  s0655: {
    literal: 'Then he turned to visit the Way\'s carriage and built halls for ritual spirits, lodged heart in the dark female, sought recluses in the hidden — wishing to bring custom to the Great Court, hoping to trace Gugu in footsteps.',
    idiomatic: 'Then he turned to Daoist rites and immortals, chasing the age of Gugu.',
  },
  s0656: {
    literal: 'Thus he cut the floating-graph law and punished idle roaming people, will wishing to straighten steps on the cinnabar ladder, seek pearls at Chishui.',
    idiomatic: 'He suppressed Buddhism and idlers, seeking immortality\'s ladder.',
  },
  s0657: {
    literal: 'He only saw Xiao Yan and Yao Xing\'s mistaken learning, did not realize First Emperor of Qin and Han Wudi\'s wrong seeking — deluded by left-path words, biased against alien teachings.',
    idiomatic: 'He imitated Qin and Han folly and spurned all foreign teaching.',
  },
  s0658: {
    literal: 'Moreover the teaching from Gandhara in the west had wished a thousand sacrifices; the simple people, habit become custom, feared its teaching more than state law, delighted in its followers no less than ascending immortals.',
    idiomatic: 'Buddhism had rooted deeper than law for common folk.',
  },
  s0659: {
    literal: 'Like lands of tattooed bodies and tonsured hair — long practiced and unaware of ugliness;',
    idiomatic: 'Like tattooed lands, habit hid its harm;',
  },
  s0660: {
    literal: 'seeing fire-breathing and knife-swallowing plays, at first glance they took them for spirits.',
    idiomatic: 'fire-swallowing shows passed for miracles.',
  },
  s0661: {
    literal: 'How could one correct them with Xian and Shao, regulate them with cap and gown?',
    idiomatic: 'Confucian ritual could not regulate what habit sanctified.',
  },
  s0662: {
    literal: 'Moreover flatterers like Qirong and He Chong — every age has them; without sages like Xunzi and Mencius, who would raise upright debate?',
    idiomatic: 'Flatterers abounded; only sages could have argued back.',
  },
  s0663: {
    literal: 'In one morning he smashed golden Buddhas and burned barbarian books, knotting hatred in prostration\'s stream, provoking wrath in vulgar mouths.',
    idiomatic: 'His smash of temples won hatred from monks and commoners alike.',
  },
  s0664: {
    literal: 'A wise king\'s act should not startle popular feeling; former ages kept it and did not discuss — truly the middle way.',
    idiomatic: 'A wise king would not have shocked the people so.',
  },
  s0665: {
    literal: 'Wishing to reform this decay, one must await the river clearing — Zhaosu bright in illumination, heard this decay.',
    idiomatic: 'Reform of such decay awaited a clearer age; Wuzong heard too late.',
  },
  s0666: {
    literal: 'Emperor Xuanzong, Sagely Martial and Literary Filial, taboo Chen, was Xianzong\'s thirteenth son; his mother was Empress Xiaoming Zheng.',
    idiomatic: 'Xuanzong—taboo Chen—was Xianzong\'s thirteenth son, born of Empress Zheng.',
  },
  s0667: {
    literal: 'On the twenty-second day of the sixth month he was born in Daming Palace.',
    idiomatic: 'He was born in Daming Palace on the twenty-second of the sixth month.',
  },
  s0668: {
    literal: 'Third month: enfeoffed Prince of Guang, name Yi.',
    idiomatic: 'In the third month he became Prince of Guang Yi.',
  },
  s0669: {
    literal: 'Third month first day: Wuzong\'s illness was grave; testamentary edict installed him as imperial grand-uncle, acting military and civil affairs.',
    idiomatic: 'On the first of the third month Wuzong named him regent grand-uncle.',
  },
  s0670: {
    literal: 'Next day he took the throne before the bier, changed to the present name, age thirty-seven.',
    idiomatic: 'The next day he ascended as Xuanzong at thirty-seven.',
  },
  s0671: {
    literal: 'Outwardly dull yet inwardly bright, solemn and sparing of words, his gaze was especially strange.',
    idiomatic: 'He seemed dull but was inwardly keen, grave and watchful.',
  },
  s0672: {
    literal: 'In childhood the palace thought him ungifted.',
    idiomatic: 'The palace once thought him simple.',
  },
  s0673: {
    literal: 'Past ten sui, meeting grave illness prostrate, suddenly radiance lit his body; he started up, straightened body and bowed as to ministers.',
    idiomatic: 'After a grave illness in youth he rose glowing and bowed like an emperor.',
  },
  s0674: {
    literal: 'The wet-nurse thought it heart illness.',
    idiomatic: 'His nurse called it madness.',
  },
  s0675: {
    literal: 'Muzong looked at him, steadied his back: "This is our house\'s heroic thing — not heart weariness."',
    idiomatic: 'Muzong said, "This is no madness but our house\'s hero."',
  },
  s0676: {
    literal: 'Granted jade ruyi, imperial horse, gold belt.',
    idiomatic: 'He received jade ruyi, an imperial horse, and a gold belt.',
  },
  s0677: {
    literal: 'He often dreamed of riding a dragon to heaven; telling Empress Zheng, she said: "This is not fit for others to know — pray do not speak again."',
    idiomatic: 'He dreamed of ascending on a dragon; Empress Zheng bade him silence it.',
  },
  s0678: {
    literal: 'Through Taihe and Huichang reigns he grew more hidden; in groups at play he never spoke.',
    idiomatic: 'Through Taihe and Huichang he kept his wit hidden.',
  },
  s0679: {
    literal: 'Wenzong and Wuzong, visiting the sixteen mansions for feasts, forced him to speak for sport, calling him "Uncle Guang."',
    idiomatic: 'Wenzong and Wuzong mocked him as "Uncle Guang" at princely feasts.',
  },
  s0680: {
    literal: 'Wuzong was bold in spirit and especially discourteous.',
    idiomatic: 'Wuzong especially scorned him.',
  },
  s0681: {
    literal: 'When he oversaw the state, grief filled his face; receiving the hundred officials he decided common affairs — men then saw his hidden virtue.',
    idiomatic: 'As regent he mourned openly and ruled decisively; his virtue showed.',
  },
  s0682: {
    literal: 'Fourth month, xinwei: mourning released; mother Zheng was honored as empress dowager.',
    idiomatic: 'In the fourth month mourning ended and Zheng became empress dowager.',
  },
  s0683: {
    literal: 'Vice Minister of War, Hanlin academician-in-chief Bai Minzhong kept his posts and became Grand Councillor;',
    idiomatic: 'Bai Minzhong joined the council from the Hanlin.',
  },
  s0684: {
    literal: 'Special Advance, Grand Preceptor, Secretariat Vice Director, Grand Councillor, Pillar of State, Duke of Weiguo with two thousand households Li Deyu was made acting Grand Preceptor, Grand Councillor, Jiangling metropolitan governor, Jingnan military commissioner;',
    idiomatic: 'Li Deyu was sent to Jingnan and stripped of the capital.',
  },
  s0685: {
    literal: 'Palace Cadet, Minister of Punishments Ma Zhi was made Gold-Purple Grandee, Vice Minister of Punishments, and circuit salt-and-iron commissioner.',
    idiomatic: 'Ma Zhi took punishments and the salt monopoly.',
  },
  s0686: {
    literal: 'Chengde military commissioner Wang Yuankui was made acting Grand Protector; Shannan West military commissioner Wang Qi acting Minister of Works; Weibo military commissioner He Hongjing and Huainan military commissioner Li Shen both acting Minister of Works; Jiannan West military commissioner Cui Xun acting Right Vice Director — all as before.',
    idiomatic: 'Military commissioners received honorary promotions unchanged in post.',
  },
  s0687: {
    literal: 'Eastern capital regent Li Shi memorialized that repair of the Imperial Ancestral Temple was complete; the responsible office welcomed Taiwei Palace spirit tablets to attach in the temple — finished.',
    idiomatic: 'Li Shi reported Luoyang\'s ancestral temple restored and tablets installed.',
  },
  s0688: {
    literal: 'The eastern capital temple was originally Empress Wu\'s family temple; in Shenlong Zhongzong restored the throne, abolished Wu\'s tablets, established High Ancestor-down tablets and entrusted them there.',
    idiomatic: 'Luoyang\'s temple had been Wu Zetian\'s, then held Tang ancestors after Shenlong.',
  },
  s0689: {
    literal: 'When An Lushan took Luoyang he used the temple as stables, abandoned the tablets; Harmony Master Yan Ying recovered and hid them.',
    idiomatic: 'An Lushan stabled horses there; Yan Ying rescued the tablets.',
  },
  s0690: {
    literal: 'Shi Siming again took Luoyang and they scattered again.',
    idiomatic: 'Shi Siming\'s sack scattered them again.',
  },
  s0691: {
    literal: 'After rebels were pacified, eastern capital regent Lu Zhengji again collected them.',
    idiomatic: 'Lu Zhengji recovered them after the rebellion.',
  },
  s0692: {
    literal: 'The temple was burned; they lodged tablets at Taiwei Palace.',
    idiomatic: 'With the temple burned, tablets lodged at Taiwei Palace.',
  },
  s0693: {
    literal: ', Regent Lu Sisi memorialized rebuilding the temple to welcome the tablets.',
    idiomatic: 'Lu Sisi later sought to rebuild the temple.',
  },
  s0694: {
    literal: 'Edict for hundred officials to debate — unsettled; Rituals Commissioner Yan Zhenqing firmly asked return to attachment — not followed.',
    idiomatic: 'Debate failed; Yan Zhenqing\'s plea to reunite tablets was ignored.',
  },
  s0695: {
    literal: ', Regent Li Shi because Taiwei\'s main hall collapsed used abolished Hongjing Temple as the temple and welcomed tablets.',
    idiomatic: 'Li Shi housed tablets in a converted Hongjing Temple when Taiwei collapsed.',
  },
  s0696: {
    literal: 'Again sent down to hundred officials — all said follow precedent, no ritual for both capitals; only Vice Minister of Rites Chen Shang said: "Zhou\'s Wen and Wu had Feng and Luo two temples — today two-capital separate temples is possible.',
    idiomatic: 'Only Chen Shang argued for two-capital temples like Zhou.',
  },
  s0697: {
    literal: 'Yet tablets should not be placed in the temple; tablets should follow ritual buried north of the temple wall."',
    idiomatic: 'He said tablets should be buried north of the temple, not enthroned."',
  },
  s0698: {
    literal: 'The matter had not proceeded when Wuzong died.',
    idiomatic: 'The matter lapsed when Wuzong died.',
  },
  s0699: {
    literal: 'Xuanzong on assuming the throne ordered officials to welcome Taiwei\'s lodged tablets to attach in the abolished temple\'s new temple — ritualists disapproved.',
    idiomatic: 'Xuanzong installed the tablets anyway, to ritualists\' dismay.',
  },
  s0700: {
    literal: 'Edict: "Eldest son Wen may be enfeoffed Prince of Yan; second son Jing Prince of Ya; third son Zi Prince of Qi; fourth son Yi Prince of Qing."',
    idiomatic: 'Four sons were enfeoffed princes of Yan, Ya, Qi, and Qing.',
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
