#!/usr/bin/env node
/** Batch 5: s0401–s0500 (Jiutangshu ch.019, Yizong / Vol. 18) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/019.json';
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
    literal: '"Persuasion did not reach them; cruelty deepened; they toyed with weapons and seized prefectures at will."',
    idiomatic: '"—they seized prefectures and spurned persuasion—',
  },
  s0402: {
    literal: '"They sought the seal and slaughtered at will, not fearing spirits, bringing ruin on themselves."',
    idiomatic: '"—seeking seals they brought ruin—',
  },
  s0403: {
    literal: '"Arm and thigh ministers could not forgive such crime;"',
    idiomatic: '"—ministers could not forgive them—',
  },
  s0404: {
    literal: '"Heart-and-belly officials said treason must be punished."',
    idiomatic: '"—the inner court demanded punishment—',
  },
  s0405: {
    literal: '"We raised armor to save the charcoal; great generals exerted force; inner officials united hearts."',
    idiomatic: '"—we raised armies to save the people—',
  },
  s0406: {
    literal: '"Selection found able men; pacification took less than a year; we punished rebels and traitors."',
    idiomatic: '"—able generals pacified them within a year—',
  },
  s0407: {
    literal: '"Now weapons are laid down and the people restored."',
    idiomatic: '"—weapons are laid down—',
  },
  s0408: {
    literal: '"Merit records must be without private favor;"',
    idiomatic: '"—merit must be impartial—',
  },
  s0409: {
    literal: '"Reward time values every fiber."',
    idiomatic: '"—reward every fiber of merit—',
  },
  s0410: {
    literal: '"Four-sided campaign commissioners who achieved merit should be rewarded by separate edict."',
    idiomatic: '"—reward campaign commissioners by separate edict—',
  },
  s0411: {
    literal: '"All circuit campaign generals below should report merit for continued disposition."',
    idiomatic: '"—report all generals\' merit—',
  },
  s0412: {
    literal: '"Those who bore armor through cold and heat may lay down bow and return home with silk gifts and corvée exemption."',
    idiomatic: '"—soldiers return home with silk and exemption—',
  },
  s0413: {
    literal: '"Four-sided campaign soldiers now pacified should return circuit by circuit."',
    idiomatic: '"—return campaign troops circuit by circuit—',
  },
  s0414: {
    literal: '"Reward bolts are by separate edict; on arrival each commissioner shall feast and release them to rest without new assignments."',
    idiomatic: '"—feast troops on return and let them rest—',
  },
  s0415: {
    literal: '"Campaign men are exempt from corvée;"',
    idiomatic: '"—exempt campaign men from corvée—',
  },
  s0416: {
    literal: '"where local posts lack officers, fill from campaign veterans by merit."',
    idiomatic: '"—fill local posts from veterans—',
  },
  s0417: {
    literal: '"Those who died in battle—comfort their wounded souls and honor loyalty."',
    idiomatic: '"—honor the battle-dead—',
  },
  s0418: {
    literal: '"Advance them in office and still employ them."',
    idiomatic: '"—advance the wounded in office—',
  },
  s0419: {
    literal: '"If no kin, comfort wives and daughters."',
    idiomatic: '"—comfort wives and daughters of the dead—',
  },
  s0420: {
    literal: '"Company chiefs to chief adjutants who died in battle receive posthumous office."',
    idiomatic: '"—posthumous office for fallen officers—',
  },
  s0421: {
    literal: '"Where soldiers had kin wishing to enter the army, let the circuit fill the post."',
    idiomatic: '"—kin may fill army posts—',
  },
  s0422: {
    literal: '"Without kin, grant clothing and grain three years."',
    idiomatic: '"—three years\' grain without kin—',
  },
  s0423: {
    literal: '"Those maimed in battle receive support for life."',
    idiomatic: '"—support the maimed for life—',
  },
  s0424: {
    literal: '"Where soldiers were killed by bandits, prefectures shall relieve and rebury—do not expose corpses—and set libations."',
    idiomatic: '"—rebury soldiers killed by bandits—',
  },
  s0425: {
    literal: '"The king takes benevolence as root; the wicked are punished, the coerced pardoned."',
    idiomatic: '"—pardon the coerced—',
  },
  s0426: {
    literal: '"Except Pang Xun\'s kin, Guilin turncoat rebels, those coerced who fought the army and fled in fear—all released without question."',
    idiomatic: '"—release all except ringleaders and hardened fighters."',
  },
  s0427: {
    literal: '"Old officers and clerks returning are first exempt from levies."',
    idiomatic: '"—exempt returning officers from levies—',
  },
  s0428: {
    literal: '"Xu, Su, Hao, and Si two-tax and corvée for autumn and summer are remitted ten years, then three years, then reconsider."',
    idiomatic: '"—remit Xu-Su-Hao-Si taxes ten years, then three—',
  },
  s0429: {
    literal: '"Fields lost people and mulberry turned to grass; where campaign zones\' fields were burned, owners may claim return—no encroachment."',
    idiomatic: '"—restore burned fields to owners—',
  },
  s0430: {
    literal: '"Nine plains may be worked; do not harm tombs."',
    idiomatic: '"—do not harm tombs—',
  },
  s0431: {
    literal: '"Known sage tombs and steles destroyed by bandits shall be buried and mourned."',
    idiomatic: '"—restore destroyed sage tombs—',
  },
  s0432: {
    literal: '"Since war began prefectures were raided—we send comfort."',
    idiomatic: '"—prefectures need comfort—',
  },
  s0433: {
    literal: '"Now send Right Regular Attendant Liu Yi and War Bureau Director Xue Chong to comfort them."',
    idiomatic: '"—Liu Yi and Xue Chong will comfort them."',
  },
  s0434: {
    literal: '"Alas!"',
    idiomatic: 'The edict closed with lament.',
  },
  s0435: {
    literal: '"We take the four seas as home and the myriad as children."',
    idiomatic: '"—the realm is our home—',
  },
  s0436: {
    literal: '"One thing lost pains our moat anguish;"',
    idiomatic: '"—one loss pains us—',
  },
  s0437: {
    literal: '"One quarter unsettled brings peril at the brink."',
    idiomatic: '"—unsettled quarters bring peril—',
  },
  s0438: {
    literal: '"Now the chief villain is slain and rebels purged; weapons are stored and baleful qi extinguished—may auspicious signs align."',
    idiomatic: '"—may peace follow the rebels\' fall."',
  },
  s0439: {
    literal: 'Near and far officers should embody our intent.',
    idiomatic: '"—officers near and far should heed this."',
  },
  s0440: {
    literal: 'The edict closed with the closing bracket.',
    idiomatic: 'Thus ended the Xu victory edict.',
  },
  s0441: {
    literal: 'An order made southern Xu campaign pacifier, Acting Left Vice Director, Right Divine Martial great general, provisional Huainan military commissioner, Fufeng county baron with one thousand households Ma Ju Acting Grand Preceptor, concurrent Yangzhou grand protector and Huainan deputy commissioner knowing military affairs;',
    idiomatic: 'Ma Ju became Huainan commissioner after the Xu victory;',
  },
  s0442: {
    literal: 'Right Martial Guard great general and southeastern Xu campaign pacifier Cao Xiang Acting Minister of War, concurrent Xuzhou prefect, Censor-in-Chief, and Xu-Si-Hao regimental defense commissioner;',
    idiomatic: 'Cao Xiang took Xuzhou and Xu-Si-Hao;',
  },
  s0443: {
    literal: 'former Huainan military commissioner, Acting Grand Preceptor, Grand Councillor, Supreme Pillar, Liangguo duke with three thousand households Linghu Tao was made Junior Tutor and eastern-capital commissioner.',
    idiomatic: 'Linghu Tao retired to the eastern capital.',
  },
  s0444: {
    literal: 'Weibo military commissioner, Acting Grand Preceptor, Grand Councillor He Hongjing died; the three armies made his son Quanhao provisional commander.',
    idiomatic: 'He Hongjing died; Quanhao succeeded at Weibo.',
  },
  s0445: {
    literal: 'In the eleventh month Nanzhao barbarian chieftain Tan Chuo led twenty thousand to raid Yun prefecture.',
    idiomatic: 'Nanzhao raided Yun with twenty thousand in the eleventh month.',
  },
  s0446: {
    literal: 'Dingbian army company chief An Zairong held Qingxi Pass; attacked by bandits he retreated to the Great River, two hundred li north of Qingxi, firing across the water nine days and eight nights.',
    idiomatic: 'An Zairong held the Great River line nine days against Nanzhao.',
  },
  s0447: {
    literal: 'Dingbian military commissioner Dou Pang led troops to resist.',
    idiomatic: 'Dou Pang resisted at Dingbian.',
  },
  s0448: {
    literal: 'In the twelfth month the chieftain sent more than ten Qingping officers feigning peace; while speaking with Pang, barbarian rafts crossed; Zhongwu and Wuning soldiers formed ranks; battle from noon to shen and barbarians slowly withdrew.',
    idiomatic: 'Nanzhao feigned peace then crossed the river in the twelfth month.',
  },
  s0449: {
    literal: 'Dou Pang hanged himself in his tent; Xu general Miao Quanxu cut him down and said: "Commander, why so? Rest—Quanxu with Zairong and Hongjie will fight to victory."',
    idiomatic: 'Dou Pang tried suicide; Miao Quanxu rallied the army.',
  },
  s0450: {
    literal: 'Quanxu and the three led troops out; Pang fled alone by night.',
    idiomatic: 'Pang fled by night while the three fought.',
  },
  s0451: {
    literal: 'That night barbarians camped below the mountain.',
    idiomatic: 'Nanzhao camped below the mountain that night.',
  },
  s0452: {
    literal: 'Quanxu and others plotted: "They are many, we few; if we fight tomorrow we lose."',
    idiomatic: 'The Tang officers plotted a night attack:',
  },
  s0453: {
    literal: '"Strike tonight and disorder their army—they will withdraw of themselves."',
    idiomatic: '"—strike tonight or we lose tomorrow—',
  },
  s0454: {
    literal: 'Zhongwu and Wuning troops entered the barbarian camp at night; crossbows flew; barbarians were terrified; the three generals preserved their army and left.',
    idiomatic: 'A night raid routed the Nanzhao camp.',
  },
  s0455: {
    literal: 'Barbarians pressed victory toward western Sichuan plain; the court made Yan Qingfu Great River commissioner and Jiannan relief envoy, Song Wei campaign knowing troops officer, with tens of thousands joining Zhongwu and Wuning; they fought at Pix bridge in Han prefecture, great victory, lifting the western Sichuan siege.',
    idiomatic: 'Yan Qingfu and Song Wei broke Nanzhao at Pix bridge.',
  },
  s0456: {
    literal: 'Next day barbarians fled; western Sichuan was pacified.',
    idiomatic: 'Western Sichuan was pacified the next day.',
  },
  s0457: {
    literal: 'Prince of Shu Wang Ji was made Pillar of State, Chengdu prefect, Jiannan West deputy commissioner knowing military affairs without leaving the palace;',
    idiomatic: 'Prince Ji held Chengdu titularly;',
  },
  s0458: {
    literal: 'Lu Dan knew military affairs.',
    idiomatic: 'Lu Dan commanded in practice.',
  },
  s0459: {
    literal: 'An edict summoned Hedong military commissioner Zheng Cong to court.',
    idiomatic: 'Zheng Cong was summoned to court.',
  },
  s0460: {
    literal: 'Yicheng military commissioner, Grand Preceptor of the Imperial Household, Acting Left Vice Director, Grand Councillor, Hua prefect, Supreme Pillar, Kuaiji county baron with two thousand households Kang Chengshi kept his office as concurrent Taiyuan prefect, northern capital defender, and Hedong military commissioner.',
    idiomatic: 'Kang Chengshi took Hedong after the Xu war.',
  },
  s0461: {
    literal: 'Vice Minister of Personnel Yang Zhiwen, Vice Minister Yu Desun, and Li Xuan examined candidates;',
    idiomatic: 'Yang Zhiwen, Yu Desun, and Li Xuan examined candidates;',
  },
  s0462: {
    literal: 'Vice Director of Seals Lu Rao and Vice Minister of Punishments Yang Dai examined macro-words candidates;',
    idiomatic: 'Lu Rao and Yang Dai examined macro-words;',
  },
  s0463: {
    literal: 'Bureau of Works Director Song Zhen and former Zhaoying chief recorder Hu Derong examined subject candidates.',
    idiomatic: 'Song Zhen and Hu Derong examined subject candidates.',
  },
  s0464: {
    literal: 'An edict: because weapons had just ceased, seek comfort and tranquility; the Rites examination shall stop one year by Secretariat edict without memorial from the two departments.',
    idiomatic: 'The civil examination was suspended one year for recovery.',
  },
  s0465: {
    literal: 'Edict to Jingnan military commissioner Du Cong: "The Astronomical Bureau reports a small comet crossing allotted fields—fear of foreign invasion and flood on the frontier."',
    idiomatic: 'Du Cong was warned of comet omens on the frontier:',
  },
  s0466: {
    literal: '"Frontier commands must drill troops and heighten walls."',
    idiomatic: '"—drill troops and heighten walls—',
  },
  s0467: {
    literal: '"Report all border arrangements."',
    idiomatic: '"—report border arrangements."',
  },
  s0468: {
    literal: 'An order made Weibo military commissioner He Quanhao resumed Acting Grand Preceptor and Grand Councillor.',
    idiomatic: 'He Quanhao resumed council rank at Weibo.',
  },
  s0469: {
    literal: 'Xian-tong 11, year Xian-tong 11 duplicated in the source—spring, first month, jiayin new moon: an order made Right Vice Director Du Shenquan Acting Grand Tutor, Hezhong prefect, and Jiang-Ci-Li commissioner.',
    idiomatic: 'Xian-tong 11 sent Du Shenquan to Hezhong.',
  },
  s0470: {
    literal: 'On bingwu an order: Grand Councillor, Secretariat Vice Director, Minister of Personnel Cao Que also Left Vice Director; Secretariat Vice Director, Households Minister Lu Yan also Right Vice Director; Secretariat Vice Director Yu Lin also Households Minister; Grand Councillor Liu Zhan became Secretariat Vice Director in government.',
    idiomatic: 'On bingwu Cao Que, Lu Yan, Yu Lin, and Liu Zhan were shuffled.',
  },
  s0471: {
    literal: 'The rest unchanged.',
    idiomatic: 'Other posts were unchanged.',
  },
  s0472: {
    literal: 'On jiyou an order: "Hedong military commissioner Kang Chengshi, petty quality of a general\'s house, slight talent from the camp, did not know warfare yet wrongly bore heavy salary."',
    idiomatic: 'On jiyou Kang Chengshi was condemned:',
  },
  s0473: {
    literal: '"Worrying about strategy yet harboring wickedness to serve the ruler; nearly given axe in the frontier camp, once holding gold to beg the Way—we thought him loyal and entrusted sole command."',
    idiomatic: '"—entrusted with sole command though unskilled—',
  },
  s0474: {
    literal: '"When Xu was troubled he dared breach discipline; made to protect the generals he overturned the perilous nest."',
    idiomatic: '"—he failed at Xu despite vast expense—',
  },
  s0475: {
    literal: '"Emptying the treasury to aid the army and enfeoffing lords to reward soldiers—yet he played with bandits and would not fight, held armor and did not advance; he never learned Rang Ju\'s law or Sunzi\'s orders."',
    idiomatic: '"—he played with bandits and would not fight—',
  },
  s0476: {
    literal: '"Moreover ranks would not fight; pressing brought no plan; numbers were many yet army prestige did not rise."',
    idiomatic: '"—his hosts would not fight—',
  },
  s0477: {
    literal: '"Farmers laid down plows and weaving women left looms; we first hoped for heaven\'s punishment yet some wished the bandits would come."',
    idiomatic: '"—the people wished for heaven\'s punishment while he dallied—',
  },
  s0478: {
    literal: '"When the chief villain collapsed and Xuanzheng showed loyalty, Peng Gate opened—what merit was his?"',
    idiomatic: '"—Peng Gate opened without his merit—',
  },
  s0479: {
    literal: '"Yet ingratitude was extreme and bribes sought; glory was lucky for a moment but harm exceeded years."',
    idiomatic: '"—ingratitude and bribes exceeded any merit—',
  },
  s0480: {
    literal: '"We apply the national law and send him to the frontier camp as Prince of Shu\'s tutor, eastern-capital commissioner."',
    idiomatic: '"—make him Prince of Shu\'s tutor in the eastern capital."',
  },
  s0481: {
    literal: 'Again demoted Enzhou registrar titular and sent by urgent relay.',
    idiomatic: 'He was again demoted to Enzhou and sent in haste.',
  },
  s0482: {
    literal: 'Acting Left Regular Attendant, Sizhou prefect Du Tao was made Acting Minister of Works, Hua prefect, and Yicheng military and Zheng-Hua observation commissioner.',
    idiomatic: 'Du Tao was rewarded with Hua and Yicheng.',
  },
  s0483: {
    literal: 'Hedong campaign Shatuo three tribes and Qiang-Hun pacifier, Acting Junior Tutor, surveillance censor Zhu Ye Chixin was made Acting Minister of Works, Chanyu grand protector, Censor-in-Chief, Zhenwu military and Lin-Sheng observation commissioner, and granted the surname Li Guochang.',
    idiomatic: 'Zhu Ye Chixin became Li Guochang of Zhenwu.',
  },
  s0484: {
    literal: 'Minister of Personnel Xiao Ye, Vice Minister Yu Desun, and Vice Minister Yang Zhiwen examined candidates;',
    idiomatic: 'Xiao Ye, Yu Desun, and Yang Zhiwen examined candidates;',
  },
  s0485: {
    literal: 'Vice Director of Merit Li Yao and Vice Director of Rites Cui Dan examined macro-words candidates.',
    idiomatic: 'Li Yao and Cui Dan examined macro-words.',
  },
  s0486: {
    literal: 'Heyang three-cities military commissioner, Central Regular Grand Master, Acting Minister of Rites, Meng prefect, Censor-in-Chief Cui Yanzhao was made Gold-Gleam Grand Master, Acting Minister of Punishments, Taiyuan prefect, northern capital defender, and Hedong observation commissioner.',
    idiomatic: 'Cui Yanzhao took Hedong.',
  },
  s0487: {
    literal: 'Vice Minister of War, Hanlin expositor-in-chief, Fufeng county viscount with five hundred households, Commandant of the Imperial Son-in-Law\'s Mansion Wei Baohang became Grand Councillor with his former title.',
    idiomatic: 'Wei Baohang joined the council.',
  },
  s0488: {
    literal: 'Vice Minister of War Liu Ye was made revenue commissioner.',
    idiomatic: 'Liu Ye took revenue.',
  },
  s0489: {
    literal: 'Left Vice Director, Secretariat Vice Director, and Grand Councillor Cao Que begged leave for illness; he was made Acting Grand Preceptor, Grand Councillor, and Runzhou prefect, Zhexi observation commissioner.',
    idiomatic: 'Ill Cao Que went to Runzhou and Zhexi.',
  },
  s0490: {
    literal: 'Weibo military commissioner He Quanhao\'s harsh government was killed by yamen soldiers; they pushed his great general Han Junxiong as provisional commander.',
    idiomatic: 'Weibo soldiers killed Quanhao and made Han Junxiong commander.',
  },
  s0491: {
    literal: 'On guimao of the fourth month the new moon fell.',
    idiomatic: 'The fourth month\'s guimao was new moon.',
  },
  s0492: {
    literal: 'On wuzi an edict: "Last year because of military use the examination was stopped one year; now weapons are laid down and the old should return."',
    idiomatic: 'On wuzi the examination was restored:',
  },
  s0493: {
    literal: 'Next year allow thirty graduates: ten advanced scholars, twenty classics—do not cite this as precedent.',
    idiomatic: '"—thirty graduates next year only, without precedent."',
  },
  s0494: {
    literal: 'The edict closed with the closing bracket.',
    idiomatic: 'Thus ended the examination edict.',
  },
  s0495: {
    literal: 'On xinsi of the eighth month the new moon fell.',
    idiomatic: 'The eighth month\'s xinsi was new moon.',
  },
  s0496: {
    literal: 'On jiyou Princess Tongchang died; posthumously enfeoffed Princess of Wei with posthumous title Wenyi.',
    idiomatic: 'Princess Tongchang died as Wenyi of Wei on jiyou.',
  },
  s0497: {
    literal: 'The princess was born of Consort Guo Shufei on the third day of the seventh month of Dazhong 3; on the second day of the second month of Xian-tong 9 she married down.',
    idiomatic: 'Tongchang, Guo Shufei\'s daughter, had married in Xian-tong 9.',
  },
  s0498: {
    literal: 'The Emperor especially doted on her; grief was extraordinary.',
    idiomatic: 'The Emperor grieved extraordinarily.',
  },
  s0499: {
    literal: 'Because awaiting-edict Han Zongshao and others\' medicine failed, he killed them and arrested more than three hundred kin in the capital prefecture.',
    idiomatic: 'Failed physicians and three hundred kin were arrested.',
  },
  s0500: {
    literal: 'Grand Councillor Liu Zhan and capital prefect Wen Zhang memorialized that execution was excessive; the Emperor in anger drove them out.',
    idiomatic: 'Liu Zhan and Wen Zhang were driven out for protesting excessive punishment.',
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
