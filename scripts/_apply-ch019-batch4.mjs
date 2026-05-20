#!/usr/bin/env node
/** Batch 4: s0301–s0400 (Jiutangshu ch.019, Yizong / Vol. 18) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/019.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 301;
const END = 400;

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
  s0301: {
    literal: 'At dawn they opened the gate—only a few sick old women remained.',
    idiomatic: 'At dawn only sick old women remained in the city.',
  },
  s0302: {
    literal: 'The imperial army entered the camp not yet formed; next dawn thick fog; the bandit army came in force; Keshi was very drunk, fled alone on one horse, and was killed by Hong county man Guo Zhen—the whole army perished; only Zhongwu, Taiyuan, and Shatuo cavalry escaped.',
    idiomatic: 'Dai Keshi was killed drunk in fog; only cavalry escaped.',
  },
  s0303: {
    literal: 'Vice general Wang Jian was captured by bandits; Liu Xingji fell again to bandit general Wu Mei; Wu Mei advanced and again besieged Sizhou.',
    idiomatic: 'Wang Jian was captured; Sizhou was besieged again.',
  },
  s0304: {
    literal: 'Thereafter scaling ladders and rams piled like clouds; inside and outside could not communicate.',
    idiomatic: 'Sizhou was cut off by siege engines.',
  },
  s0305: {
    literal: 'Pang Xun relied on sudden victory; his memorial language was disrespectful and his letter to Kang Chengshi denounced court policy.',
    idiomatic: 'Pang Xun insulted the court in memorials and letters.',
  },
  s0306: {
    literal: 'Wang Yanquan was Zhi-xing\'s younger brother\'s son; he was given Wuning command to win surrender.',
    idiomatic: 'Wang Yanquan was sent to win Xu by kinship with Zhi-xing.',
  },
  s0307: {
    literal: 'Xu people resented Wang Shi\'s slaughter and stirred rebellion; months of inducement with profit failed—the people and soldiers would not turn.',
    idiomatic: 'Months of blandishment could not turn Xu after Wang Shi\'s slaughter.',
  },
  s0308: {
    literal: 'Kang Chengshi\'s great army attacked Suzhou; bandit general Liang Pi fought repeatedly and lost; Chengshi was made Acting Right Vice Director, Linghua prefect, and Yicheng military commissioner.',
    idiomatic: 'Chengshi beat Liang Pi and gained Yicheng command.',
  },
  s0309: {
    literal: 'Demoted Duanzhou registrar Yang Shou was long-banished to Huanzhou and executed on the road with Yan Zan;',
    idiomatic: 'Yang Shou and Yan Zan were executed in exile;',
  },
  s0310: {
    literal: 'their faction Yang Gongqing, Yan Jishi, Yang Quanyi, Shi Ming, Lian Sui, He Shixuan, Li Mengxun, Ma Quanyou, Li Yu, Wang Yanfu, and others were long-banished to Dan, Ya, and Bo;',
    idiomatic: 'their faction was banished to Dan, Ya, and Bo;',
  },
  s0311: {
    literal: 'aides Zhu Kai, Chang Fen, and Yan Jun were assigned to Lingnan.',
    idiomatic: 'Aides were sent to Lingnan.',
  },
  s0312: {
    literal: 'Hezhong military commissioner, Pillar of State, Acting Grand Tutor, Grand Councillor, Supreme Pillar, Qiao county duke with two thousand households Xiahou Zi was made Junior Tutor and eastern-capital commissioner—for losing Shu when southern barbarians raided western Sichuan.',
    idiomatic: 'Xiahou Zi was punished for losing Shu.',
  },
  s0313: {
    literal: 'At the time southern barbarians raided western Sichuan; Zi was blamed for misrule in Shu.',
    idiomatic: 'Southern raids blamed his Shu misrule.',
  },
  s0314: {
    literal: 'On jichou of the second month Pang Xun pressed Sizhou; he sent officer Li Yuan into the city to tell prefect Du Tao: "The regent knows the commissioner\'s noble house and dares not let soldiers be rude—only open the gate so commoners live and do not doubt."',
    idiomatic: 'Li Yuan begged Du Tao to open Sizhou\'s gate.',
  },
  s0315: {
    literal: 'Tao seized and killed him.',
    idiomatic: 'Du Tao killed Li Yuan.',
  },
  s0316: {
    literal: 'An edict sent Minister of Agriculture Xue Qiong to Huainan Lu, Shou, Chu, and other prefectures to muster militia for self-defense.',
    idiomatic: 'Xue Qiong mustered Huainan militia.',
  },
  s0317: {
    literal: 'In the fourth month Kang Chengshi memorialized great defeat of Willow Fort bandits; an edict ordered supervisory commissioner Yang Xuanzhi and Chengshi to divert Bian River water to flood Suzhou.',
    idiomatic: 'Chengshi won at Willow Fort; Bian water was to flood Suzhou.',
  },
  s0318: {
    literal: 'On dinghai of the sixth month the new moon fell.',
    idiomatic: 'The sixth month\'s dinghai was new moon.',
  },
  s0319: {
    literal: 'On wuxu an order:',
    idiomatic: 'On wuxu a drought edict opened:',
  },
  s0320: {
    literal: '"What moves heaven and earth is nothing like sincerity; what brings peace is nothing like good government."',
    idiomatic: '"Sincerity moves heaven; good government brings peace."',
  },
  s0321: {
    literal: '"We in our feebleness rest on the kings above; eleven years have passed."',
    idiomatic: '"Eleven years on the throne we have revered heaven—',
  },
  s0322: {
    literal: '"Bearing the great structure, in awe and care, we emulate Yao\'s reverence for Heaven and Zhou\'s service to the Lord on High."',
    idiomatic: '"—emulating Yao and Zhou in reverence—',
  },
  s0323: {
    literal: '"Day and night without slackening in devotion, sharing the worry of a crumbling boat, thinking of the anguish of the moat."',
    idiomatic: '"—yet drought, locusts, barbarians, and Xu rebels torment the realm—',
  },
  s0324: {
    literal: '"Within we forbid luxury; without we cease hunts—not expecting perfect peace, only a quiet realm and good harvests."',
    idiomatic: '"—we ceased hunts and luxury yet peace eludes us—',
  },
  s0325: {
    literal: '"Yet governance is unclear and the Way shallow; qi is blocked and sincerity does not penetrate."',
    idiomatic: '"—qi is blocked and sincerity fails—',
  },
  s0326: {
    literal: '"Drought alarms us; locusts harm; barbarians are not yet subdued abroad; bandits plague the central plains."',
    idiomatic: '"—drought, locusts, barbarians, and bandits together—',
  },
  s0327: {
    literal: '"Still we drive war chariots and increase army grain, doubling the people\'s hardship and forgetting sleep at dawn and dusk."',
    idiomatic: '"—war and grain levies redouble hardship—',
  },
  s0328: {
    literal: '"Now midsummer sun blazes and long rains fail; caring for the people we are anxious morning and night."',
    idiomatic: '"—midsummer drought pains us—',
  },
  s0329: {
    literal: '"Within we cultivate incense in prayer; without we exhaust sacrificial jade in earnest supplication."',
    idiomatic: '"—we pray with incense and jade—',
  },
  s0330: {
    literal: '"We await heaven\'s gift and surely sweet rain will come."',
    idiomatic: '"—awaiting sweet rain—',
  },
  s0331: {
    literal: '"Yet oil clouds do not rise and autumn crops lack hope; from this fault our sincere heart is pained."',
    idiomatic: '"—yet clouds do not rise and autumn fails—',
  },
  s0332: {
    literal: '"Moreover harsh government and cruel punishments, oppressive officials who plunder and ruin the lone and weak create wronged persons and baleful qi."',
    idiomatic: '"—harsh officials create wronged souls and baleful qi—',
  },
  s0333: {
    literal: '"Chief prefects and magistrates must not forget public duty."',
    idiomatic: '"—magistrates must serve the public—',
  },
  s0334: {
    literal: '"Suppressing rebellion and raising arms is not willingly done; punishing traitors must hit the guilty—if innocents are harmed, wind and rain will err."',
    idiomatic: '"—punish only the guilty lest weather turn—',
  },
  s0335: {
    literal: '"All campaign generals must show compassion and heed diligent care."',
    idiomatic: '"—generals must show compassion—',
  },
  s0336: {
    literal: '"All prisoners in the capital and circuits except ten abominations, treason, official corruption, deliberate murder, poison-making, arson with weapons, tomb robbery, and Xu rebels and associates should be judged by weight and quickly disposed—not long detained."',
    idiomatic: '"—release prisoners except grave crimes and Xu rebels—',
  },
  s0337: {
    literal: '"Rain differs; fields wither—show mercy to living things."',
    idiomatic: '"—show mercy while fields wither—',
  },
  s0338: {
    literal: '"In the capital before rain, markets may temporarily halt slaughter."',
    idiomatic: '"—halt slaughter in the capital until rain—',
  },
  s0339: {
    literal: '"Yesterday envoys returned from Shan-Guo reporting locust and drought damage; circuit chancellors should share concern and seek relief."',
    idiomatic: '"—circuit chancellors must relieve locust damage—',
  },
  s0340: {
    literal: '"Where famine strikes, comfort urgently—do not let the people lack food."',
    idiomatic: '"—comfort the starving—',
  },
  s0341: {
    literal: '"Xu rebels are not yet destroyed and armies march; in punishment distinguish good from wicked—do not let the coerced die while ringleaders escape."',
    idiomatic: '"—distinguish Xu ringleaders from the coerced—',
  },
  s0342: {
    literal: '"Proclaim the text of punitive expedition so all know loyalty and treason."',
    idiomatic: '"—proclaim punitive expedition texts."',
  },
  s0343: {
    literal: '"Alas!"',
    idiomatic: 'The edict closed with lament.',
  },
  s0344: {
    literal: '"Whenever we think of Yu and Tang blaming themselves, we nearly achieve Cheng and Kang\'s sparing punishments."',
    idiomatic: '"—we blame ourselves as Yu and Tang did—',
  },
  s0345: {
    literal: '"Who says virtue and faith are not yet sincere and teaching still blocked?"',
    idiomatic: '"—yet virtue seems not to reach the people—',
  },
  s0346: {
    literal: '"You many officers help me alone; having confessed fault in person, we approach good order."',
    idiomatic: '"—help us restore order after our confession."',
  },
  s0347: {
    literal: 'Proclaim within and without according to our intent.',
    idiomatic: '"—proclaim this within and without."',
  },
  s0348: {
    literal: '" Bandit general Zheng Yi pressed Shouzhou; an edict sent southern pacifier Ma Ju to relieve; the bandits lifted the siege and left.',
    idiomatic: 'Thus ended the drought edict; Zheng Yi besieged Shouzhou until Ma Ju relieved it.',
  },
  s0349: {
    literal: 'Kang Chengshi used all troops against the small Sui fort and retreated defeated.',
    idiomatic: 'Chengshi failed at the small Sui fort.',
  },
  s0350: {
    literal: 'In the seventh month Chengshi attacked Willow Fort, nearly took it, but bandit general Wang Hongli arrived; the imperial army was greatly defeated and Chengshi retreated to Songzhou.',
    idiomatic: 'Wang Hongli routed Chengshi at Willow Fort in the seventh month.',
  },
  s0351: {
    literal: 'Pang Xun in victory personally led Xu elite troops to attack Sizhou, leaving chief Xu Ji to hold Xuzhou.',
    idiomatic: 'Pang Xun left Xu Ji and stormed Sizhou.',
  },
  s0352: {
    literal: 'An edict made southern pacifier Ma Ju chief campaign pacifier replacing Chengshi to relieve Sizhou.',
    idiomatic: 'Ma Ju replaced Chengshi to save Sizhou.',
  },
  s0353: {
    literal: 'In the eighth month one hundred thirty Hezhou defense clerks led by Shi Mou memorialized against prefect Cui Yong:',
    idiomatic: 'Hezhou clerks accused Cui Yong in the eighth month:',
  },
  s0354: {
    literal: '"When bandits first raided Wuhe county Yong sent two scouts; Yong still disbelieved and both were shackled."',
    idiomatic: '"—he shackled scouts who reported bandits—',
  },
  s0355: {
    literal: '"He later sent men and saw bandits ten li from the city."',
    idiomatic: '"—he only believed at ten li—',
  },
  s0356: {
    literal: '"Bandits soon pressed the city; Cui Yong drank with bandit chief Wu Yue on the drum tower and promised the city."',
    idiomatic: '"—he drank with Wu Yue and promised the city—',
  },
  s0357: {
    literal: '"He called military aide Li Qiao his brother and drove officer Zhang Li as son, begging only those two and himself while the rest of officers could be disposed."',
    idiomatic: '"—he begged his own life while officers were killed—',
  },
  s0358: {
    literal: '"He made Li Ci and others strip armor; over eight hundred defense soldiers were bound and beheaded."',
    idiomatic: '"—eight hundred soldiers were beheaded—',
  },
  s0359: {
    literal: '"Clerk Shi Qiong stripped slowly and Yong had the bandits execute him."',
    idiomatic: '"—Shi Qiong was executed for slow disarming—',
  },
  s0360: {
    literal: '"Cui Yong\'s funds and household were escorted toward Caishi and are now in Runzhou."',
    idiomatic: '"—his wealth reached Runzhou—',
  },
  s0361: {
    literal: '"Can one ransom oneself with a thousand soldiers\' lives? He has failed the spirits and wronged the sage ruler."',
    idiomatic: '"—he ransomed himself with a thousand lives—',
  },
  s0362: {
    literal: '"He also taxed officers to repair walls falsely claiming repair funds."',
    idiomatic: '"—he falsely taxed for walls." Thus ended the memorial.',
  },
  s0363: {
    literal: 'Edict: "Minister\'s integrity is nothing like full loyalty; scholar\'s wind should shun shame."',
    idiomatic: 'An edict opened against Cui Yong:',
  },
  s0364: {
    literal: '"Cui Yong as prefect when bandits came did not speak of defense; at ease he drank with them."',
    idiomatic: '"—he drank with bandits instead of defending—',
  },
  s0365: {
    literal: '"Shi Qiong wished to fight but Yong sent him to the bandits."',
    idiomatic: '"—he sent Shi Qiong to the bandits—',
  },
  s0366: {
    literal: '"His deep intent harmonized with bandits; ministerial integrity was wholly lost—the facts are clear; we wish to apply court law and must investigate further."',
    idiomatic: '"—investigate further before court law."',
  },
  s0367: {
    literal: '"Cui Yong\'s household is in Xuanzhou; order Xuan-She observation commissioner to seize Yong, detain, and quickly investigate and report."',
    idiomatic: '"—seize Yong in Xuanzhou and report."',
  },
  s0368: {
    literal: '"That month Ma Ju broke the Sizhou siege and bandits fled."',
    idiomatic: 'Ma Ju broke the Sizhou siege that month.',
  },
  s0369: {
    literal: 'Edict: "When Cui Yong held the prefecture Pang Xun first rebelled."',
    idiomatic: 'A second edict condemned Yong:',
  },
  s0370: {
    literal: '"When violent bandits rushed he welcomed them with wine and opened the gate to admit villains."',
    idiomatic: '"—he opened the gate and drank with rebels—',
  },
  s0371: {
    literal: '"He forbade weapons in the city and made all disarm; the three armies and people watched blood flow and were beheaded in rows."',
    idiomatic: '"—disarming the city brought mass slaughter—',
  },
  s0372: {
    literal: '"At first hearing the memorial we were deeply shocked."',
    idiomatic: '"—the memorial shocked the court—',
  },
  s0373: {
    literal: '"Gao Xiwang died defending the city and was already honored;"',
    idiomatic: '"—Gao Xiwang was honored for dying at his post—',
  },
  s0374: {
    literal: '"Du Tao alone held the fort and was specially rewarded."',
    idiomatic: '"—Du Tao was rewarded for holding out—',
  },
  s0375: {
    literal: '"Having praised loyalty we cannot spare the criminal; jade and stone are divided; punishment and encouragement stand."',
    idiomatic: '"—loyalty is rewarded; guilt cannot be spared—',
  },
  s0376: {
    literal: '"To warn the four seas we cannot spare one man."',
    idiomatic: '"—the realm must be warned—',
  },
  s0377: {
    literal: '"Cui Yong shall have inner custodian Meng Gongdu go to Xuanzhou and grant self-death."',
    idiomatic: '"—order Yong to take his own life."',
  },
  s0378: {
    literal: '"Gongdu arrived; Yong died at Lingyang Lodge; his son Dang\'er and monk Guisi were assigned to Kangzhou in perpetual escort."',
    idiomatic: 'Yong died at Lingyang; kin were banished.',
  },
  s0379: {
    literal: 'Director of Merit Cui Yuan was demoted Liuzhou registrar; Vice Director of Review Cui Fu Shaozhou registrar; Chang\'an magistrate Cui Lang Lizhou registrar; Left Reminder Cui Geng Lianzhou registrar; Jingnan observation aide Cui Xu Hengzhou registrar—all Yong\'s kin.',
    idiomatic: 'Yong\'s kin were demoted across the south.',
  },
  s0380: {
    literal: 'In the ninth month Suzhou defender Zhang Xuanzheng surrendered the city with ten thousand men; Ma Ju led troops to him.',
    idiomatic: 'Zhang Xuanzheng surrendered Suzhou in the ninth month.',
  },
  s0381: {
    literal: 'Hearing this Pang Xun led his host to attack Xuanzheng.',
    idiomatic: 'Pang Xun marched on Xuanzheng.',
  },
  s0382: {
    literal: 'Xuanzheng was the bandits\' fierce general; he joined Ju and urgently besieged Xuzhou.',
    idiomatic: 'Xuanzheng joined Ma Ju to besiege Xu.',
  },
  s0383: {
    literal: 'Xu Ji held the wall three days then fled defeated.',
    idiomatic: 'Xu Ji fled after three days.',
  },
  s0384: {
    literal: 'Xuanzheng recovered Xuzhou; Pang Xun came to aid, heard the city was taken, wished to flee south to Haozhou; Ma Ju caught him at the Huan River, defeated him, and Xun drowned.',
    idiomatic: 'Xuanzheng took Xu; Pang Xun drowned fleeing south.',
  },
  s0385: {
    literal: 'The Xia county chief beheaded Xu Ji and surrendered; Xu bandits were all pacified.',
    idiomatic: 'Xu Ji was beheaded; the rebellion ended.',
  },
  s0386: {
    literal: 'Earlier when Pang Xun held Xu the storehouses were empty; he sent violent men to plunder cattle and grain in Yang, Chu, Lu, Shou, Chu, He, Yan, Hai, Yi, Mi, Cao, and Pu day and night.',
    idiomatic: 'Pang Xun had emptied treasuries and plundered ten circuits for grain.',
  },
  s0387: {
    literal: 'He gathered fugitives to two hundred thousand; all fifteen and above bore arms—they sharpened hoes into weapons called "Huo awls."',
    idiomatic: 'Two hundred thousand bore hoe-blades called "Huo awls."',
  },
  s0388: {
    literal: 'For a full year more than ten prefectures suffered their cruelty—now all was pacified.',
    idiomatic: 'A year of cruelty across ten prefectures ended.',
  },
  s0389: {
    literal: 'Edict to Xuanzheng: "Last year disaster rose in Xu\'s quarter; this petty fellow raised arms in rebellion; persuasion did not return him; he led three prefectures astray and poisoned the myriad people."',
    idiomatic: 'An edict praised Xuanzheng:',
  },
  s0390: {
    literal: '"The principle of loyalty and treason, wicked and upright, was clear; loyal ministers destroyed the rebels and twice cleared the prefectures without much battle."',
    idiomatic: '"—loyal ministers destroyed rebels and cleared prefectures—',
  },
  s0391: {
    literal: '"This was all the people\'s united heart and the prefecture\'s blessing."',
    idiomatic: '"—the people united in blessing—',
  },
  s0392: {
    literal: '"Yet a full year under fierce control unsettled villages and ruined farming—we are doubly grieved."',
    idiomatic: '"—a year of ruin grieves us—',
  },
  s0393: {
    literal: '"Orders already command: now grant Xuanzheng Silver-Gleam Grand Master, Acting Right Regular Attendant, concurrent Right Brave Guard great general, Censor-in-Chief, five thousand bolts of silk, one gold cup, one covered bowl, one gold belt."',
    idiomatic: '"—reward Xuanzheng with rank, silk, and gold."',
  },
  s0394: {
    literal: '"Twenty officers below Zhang Gao receive graded gifts."',
    idiomatic: '"—twenty officers receive graded gifts—',
  },
  s0395: {
    literal: '"Now send high officer Li Zhicheng to deliver the grace."',
    idiomatic: '"—Li Zhicheng will deliver the grace."',
  },
  s0396: {
    literal: 'An order:',
    idiomatic: 'A victory edict opened:',
  },
  s0397: {
    literal: '"We in our minute person received the great enterprise; reverent and cautious eleven years."',
    idiomatic: '"Eleven years reverent on the throne—',
  },
  s0398: {
    literal: '"We bear seventeen sages\' vast fortune and three hundred years\' blessing; seeking governance\'s root we dare not forget dawn robes."',
    idiomatic: '"—bearing three hundred years\' fortune we labor at dawn—',
  },
  s0399: {
    literal: '"Though faith is not yet sincere we do not slacken in awe; having ceased park pleasures we have no heart for hunts—diligent day by day."',
    idiomatic: '"—we shun hunts yet blessings lag—',
  },
  s0400: {
    literal: '"Good omens do not answer; baleful qi grows secretly; southern war nearly ends while Xu rebels suddenly lack kindness."',
    idiomatic: '"—southern war wanes as Xu rebels betray kindness—',
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
if (data.metadata.chapter !== '019') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 019; standalone T ready (${Object.keys(T).length} entries).`
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
