#!/usr/bin/env node
/** Batch 5: s0401–s0500 (Jiutangshu ch.015, Xianzong 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/015.json';
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
    literal: "On wuzi night, Earth and Fire conjoined at Void and Rooftop mansions.",
    idiomatic: "Earth and Mars met at Xu and Wei on wuzi night.",
  },
  s0402: {
    literal: "Twelfth month, bingwu — Chen Chu of Yi prefecture was made Dingzhou prefect and Yiwu army military commissioner.",
    idiomatic: "Chen Chu took the Yiwu command on bingwu.",
  },
  s0403: {
    literal: "dingwei — Hanlin academician, Works vice minister, and edict drafter Wang Ya was made Vice Director of the Chancellery and Grand Councillor.",
    idiomatic: "Wang Ya entered the council on dingwei.",
  },
  s0404: {
    literal: "jiayin — Li Su, commissioner of imperial stud parks and gardens, was made acting Left Regular Cavalry Attendant, concurrent Dengzhou prefect, and commissioner of Tang, Sui, Deng and other prefectures.",
    idiomatic: "Li Su received the Tang-Sui-Deng commission on jiayin.",
  },
  s0405: {
    literal: "The Ying River transport commissioner was first established.",
    idiomatic: "A Ying River grain transport office was created.",
  },
  s0406: {
    literal: "Yangzi Courtyard grain was shipped upriver from Huaiyin to Shouzhou, forty li into the Ying mouth, then upriver five hundred li to the Shenqiu border of Yingzhou, five hundred li to Xiangcheng, then five hundred li into the Yin River, and three hundred li to Yan City.",
    idiomatic: "Grain ran from Huaiyin up the Huai and Ying to Yan City in staged hauls.",
  },
  s0407: {
    literal: "Fifty thousand shi of grain and fifteen million bundles of fodder were obtained.",
    idiomatic: "The route delivered fifty thousand shi and vast fodder stores.",
  },
  s0408: {
    literal: "Seventy-six thousand strings were saved on Bian transport.",
    idiomatic: "Bian transport costs fell by seventy-six thousand strings.",
  },
  s0409: {
    literal: "jiwei — Yongguan Circuit reported Yellow Cave bandits massacred Yan prefecture.",
    idiomatic: "Yongguan reported a massacre at Yan on jiwei.",
  },
  s0410: {
    literal: "Weiyang Palace and the Feilong hay pasture burned.",
    idiomatic: "Fire destroyed Weiyang Palace and the Feilong pasture.",
  },
  s0411: {
    literal: "Capital-region floods harmed fields; Run, Chang, Hu, Qu, Chen, and Xu suffered great floods.",
    idiomatic: "Floods ravaged the capital region and lower Yangtze circuits.",
  },
  s0412: {
    literal: "That year there was winter thunder; peach and apricot trees blossomed.",
    idiomatic: "Winter thunder and spring blossoms out of season marked the year.",
  },
  s0413: {
    literal: "Uighurs, Xi, Khitan, Zangke, Parhae, and others paid court tribute.",
    idiomatic: "Border peoples sent tribute missions.",
  },
  s0414: {
    literal: "Yuanhe 12 — spring, first month, xinyou new moon: because troops were in the field, the court did not receive New Year congratulations.",
    idiomatic: "Yuanhe 12 opened without New Year audience because of the Huai campaign.",
  },
  s0415: {
    literal: "guiwei — Hun Gao of the Yiwu army was demoted to Xunzhou prefect for failing discipline in attacking rebels.",
    idiomatic: "Hun Gao was demoted for botching the rebel campaign on guiwei.",
  },
  s0416: {
    literal: "jiashen — Yuan Zi of the Tang-Deng commission was demoted to Fuzhou prefect for memorializing to halt the army.",
    idiomatic: "Yuan Zi was exiled for urging an end to the war on jiashen.",
  },
  s0417: {
    literal: "yiyou night — stars appeared while it rained.",
    idiomatic: "Stars shone through rain on yiyou night.",
  },
  s0418: {
    literal: "wuzi night — a comet appeared south of Bi, over a zhang long, pointing southwest; after three days it drew near Can Banner and vanished.",
    idiomatic: "A comet blazed south of Bi for three nights on wuzi.",
  },
  s0419: {
    literal: "Second month, renshen — sixty-nine myriads of sections of inner-treasury silk and five thousand taels of silver were delivered to Revenue to supply the army.",
    idiomatic: "Inner stores funded the campaign on renshen.",
  },
  s0420: {
    literal: "gengzi — an edict ordered capital households to guarantee one another in groups of five to search out traitors.",
    idiomatic: "Beijing residents were grouped for traitor hunts on gengzi.",
  },
  s0421: {
    literal: "At the time Wang Chengzong and Li Shidao wished to obstruct the military effort; they sent men to break mausoleum halberds, burn fodder stacks, and shoot arrows and letters to terrify the capital — hence the search against traitors.",
    idiomatic: "Hebei agents tried to panic Chang'an, prompting household searches.",
  },
  s0422: {
    literal: "When the rebels were pacified, recovered Ziqing registers contained cases rewarding Pu and Tong Pass clerks — thus knowing the gate clerks had harbored traitors; search alone was no defense.",
    idiomatic: "Captured ledgers showed Tong Pass clerks had aided rebels, not street searches.",
  },
  s0423: {
    literal: "gengshen — an edict ordered establishing a field Yan City near the Xu-Ru campaign camp to settle surrendered rebel households.",
    idiomatic: "A camp Yan City was set up for surrenders on gengshen.",
  },
  s0424: {
    literal: "jiayin — Yue-E training commissioner Li Daogu led troops against Shenzhou, took the outer wall, but the rebels fought hard and Daogu's force was routed.",
    idiomatic: "Li Daogu stormed Shenzhou's outer wall and was thrown back on jiayin.",
  },
  s0425: {
    literal: "Third month, renxu — Zhaoyi's Heshimei was defeated at Baixiang; a thousand soldiers died.",
    idiomatic: "Heshimei lost a thousand men at Baixiang on renxu.",
  },
  s0426: {
    literal: "wuchen — Cheng Zhigong of Cangzhou changed his name to Quan.",
    idiomatic: "Cheng Zhigong of Cangzhou was renamed Quan on wuchen.",
  },
  s0427: {
    literal: "The Court of Imperial Sacrifices fixed Li Jifu's posthumous name as \"Respectful and August\"; Revenue bureau director Zhang Zhongfang objected; the Emperor was angry and demoted him to Suizhou adjutant.",
    idiomatic: "Zhang Zhongfang was banished for disputing Li Jifu's posthumous title.",
  },
  s0428: {
    literal: "Jifu was granted the posthumous name Loyal.",
    idiomatic: "Li Jifu's posthumous name was fixed as Loyal.",
  },
  s0429: {
    literal: "dingchou — the moon trespassed the rear Heart star.",
    idiomatic: "The moon crossed the rear Heart star on dingchou.",
  },
  s0430: {
    literal: "guiwei — rebel Wu Xiulin surrendered Wencheng stockade with three thousand troops to Li Su.",
    idiomatic: "Wu Xiulin surrendered Wencheng to Li Su on guiwei.",
  },
  s0431: {
    literal: "Summer, fourth month, xinmao — Li Guangyan broke thirty thousand rebels at Yan City, killing two or three in ten, capturing a thousand horses and thirty thousand suits of armor.",
    idiomatic: "Li Guangyan shattered a rebel host at Yan City on xinmao.",
  },
  s0432: {
    literal: "xinchou — Son-in-law Director Yu Jiyou, while in chief mother's mourning, feasted and drank at night with jinshi Liu Shifu.",
    idiomatic: "Yu Jiyou caroused through mourning with Liu Shifu on xinchou.",
  },
  s0433: {
    literal: "Jiyou was stripped of rank and title, given forty blows, and settled at Zhongzhou;",
    idiomatic: "Jiyou lost his titles, was flogged, and sent to Zhongzhou;",
  },
  s0434: {
    literal: "Shifu was given forty blows and exiled to Lianzhou;",
    idiomatic: "Shifu was flogged and exiled to Lianzhou;",
  },
  s0435: {
    literal: "Yu Di was unable to discipline his son — his rank was reduced.",
    idiomatic: "Yu Di was demoted for failing to control his son.",
  },
  s0436: {
    literal: "jiyou — twenty-five myriad shi from the Great Granary were sold in the western capital to succor the hungry.",
    idiomatic: "Charity grain from the Great Granary was sold in the west on jiyou.",
  },
  s0437: {
    literal: "gengxu — an edict changed Cai prefecture's Wu Fang county to Suiping county and moved it within the new city south of Wencheng stockade.",
    idiomatic: "Wu Fang was renamed Suiping and relocated on gengxu.",
  },
  s0438: {
    literal: "dingmao — rebel Yan City defender Deng Huaijin and Magistrate Dong Chang surrendered Yan City.",
    idiomatic: "Yan City fell to Deng Huaijin and Dong Chang on dingmao.",
  },
  s0439: {
    literal: "jiaxu — Weinan rained hail; some among the people died.",
    idiomatic: "Hail at Weinan killed people on jiaxu.",
  },
  s0440: {
    literal: "bingzi — an edict ordered temporarily halting the Hebei field headquarters and focusing on Huai and Cai alone.",
    idiomatic: "Hebei operations were suspended to finish Huai-Cai on bingzi.",
  },
  s0441: {
    literal: "Fifth month, gengyin new moon.",
    idiomatic: "The fifth month opened on gengyin.",
  },
  s0442: {
    literal: "guisi — Sui-Tang military commissioner Li Su memorialized defeating rebels at Wu Fang and capturing rebel general Li You.",
    idiomatic: "Li Su reported Wu Fang victory and Li You's capture on guisi.",
  },
  s0443: {
    literal: "jihai — Left Vice Director of the Department of State Affairs Xu Mengrong was made Eastern Capital regent and metropolitan defense commissioner.",
    idiomatic: "Xu Mengrong became Luoyang regent on jihai.",
  },
  s0444: {
    literal: "At the time eastern-capital households supplying the army suffered especially; thousands of carts blocked the roads, oxen all fed to the army, and many households plowed with donkeys.",
    idiomatic: "Luoyang supply lines were stripped of oxen; farmers plowed with donkeys.",
  },
  s0445: {
    literal: "jiyou — four hundred bays of corridor were built around the Pool of Immortals.",
    idiomatic: "Four hundred corridor rooms ringed the Pool of Immortals on jiyou.",
  },
  s0446: {
    literal: "Sixth month, jiwei new moon — Weiwei Director Cheng Yi was made salt and iron commissioner, replacing Wang Bo.",
    idiomatic: "Cheng Yi replaced Wang Bo as salt commissioner on jiwei.",
  },
  s0447: {
    literal: "At the time Yi was salt deputy; from Jiangnan he had gathered one million eight hundred fifty thousand in army funds and presented them — hence he replaced Bo.",
    idiomatic: "Cheng Yi bought the post with 1.85 million in recovered army funds.",
  },
  s0448: {
    literal: "renxu — rebel Wu Yuanji submitted a memorial asking to bind himself and return to court.",
    idiomatic: "Wu Yuanji petitioned to surrender on renxu.",
  },
  s0449: {
    literal: "Having lost three stockades in succession, rebel strength was pressed tight; he truly wished to surrender, but was controlled by his close advisers — therefore it did not happen.",
    idiomatic: "Yuanji wanted to yield but his staff held him back.",
  },
  s0450: {
    literal: "yiyou — the capital had great rain; one pillar of Hanyuan Hall tilted; market water three chi deep; two thousand ward households ruined.",
    idiomatic: "A cloudburst flooded markets and shook Hanyuan Hall on yiyou.",
  },
  s0451: {
    literal: "Autumn, seventh month, wuzi new moon.",
    idiomatic: "The seventh month opened on wuzi.",
  },
  s0452: {
    literal: "renchen — an edict: because Dingzhou was famine-struck, recruit men to enter grain for office and selection benefits, and for reduced examinations and early promotion.",
    idiomatic: "Dingzhou famine donors could buy office on renchen.",
  },
  s0453: {
    literal: "Hebei suffered flood disaster; Xing and Ming were worst — in level ground sometimes two zhang deep.",
    idiomatic: "Hebei floods stood two zhang deep in places.",
  },
  s0454: {
    literal: "jiachen — Revenue Minister Yu Di requested retirement; it was not granted.",
    idiomatic: "Yu Di's retirement plea was denied on jiachen.",
  },
  s0455: {
    literal: "Lingnan military commissioner Cui Yong died.",
    idiomatic: "Cui Yong died as Lingnan commissioner.",
  },
  s0456: {
    literal: "yiyou — an edict: \"Hereafter demoted officials and commissioned regular officials should, from assuming post through five completed examinations, be permitted measured transfer;",
    idiomatic: "An edict set five-year terms before demoted officials could transfer;",
  },
  s0457: {
    literal: "if before five examinations an amnesty occurs, follow the amnesty text;",
    idiomatic: "amnesties before five years would follow their own rules;",
  },
  s0458: {
    literal: "if guilty of the ten abominations, great treason, or corruption with implicated kin, submit for imperial decision.\"",
    idiomatic: "capital crimes still required imperial approval.\"",
  },
  s0459: {
    literal: "gengxu — National University Chancellor Kong Zong was made Guangzhou prefect and Lingnan military commissioner.",
    idiomatic: "Kong Zong took Lingnan on gengxu.",
  },
  s0460: {
    literal: "bingchen — by decree, Chancellery Vice Director and Grand Councillor Pei Du was made concurrent Vice Director of the Secretariat, Grand Councillor, holder of the staff for Cai prefecture military affairs, Cai prefect, Zhangyi army military commissioner, Shen-Guang-Cai observation and disposition commissioner, and also Huai-West pacification and disposition commissioner.",
    idiomatic: "Pei Du was sent to command the Zhangyi campaign on bingchen.",
  },
  s0461: {
    literal: "Court Gentleman for Miscellaneous Matters, acting Revenue Minister, Upper Guardian General, granted gold-purple fish bag Cui Qun was made Vice Director of the Chancellery and Grand Councillor.",
    idiomatic: "Cui Qun joined the council the same day.",
  },
  s0462: {
    literal: "Penal Vice Minister Ma Zong was made concurrent Censor-in-Chief and Huai-West field army pacification vice commissioner;",
    idiomatic: "Ma Zong became Pei Du's deputy commissioner;",
  },
  s0463: {
    literal: "Crown Prince Right Vice Guardian Han Yu was made concurrent Vice Censor-in-Chief and Zhangyi army campaign staff officer;",
    idiomatic: "Han Yu joined the Zhangyi staff;",
  },
  s0464: {
    literal: "Merit Bureau Director Li Zhengfeng, Capital Bureau Director Feng Su, and Rites Bureau Director Li Zongmin were all made concurrent Attending Censors as chief secretaries and recorders — accompanying Du on campaign.",
    idiomatic: "Li Zhengfeng, Feng Su, and Li Zongmin went as Du's secretaries.",
  },
  s0465: {
    literal: "An edict made Yan City the provisional seat of Cai prefecture.",
    idiomatic: "Yan City became the field capital of Cai.",
  },
  s0466: {
    literal: "Eighth month, wuwu new moon.",
    idiomatic: "The eighth month opened on wuwu.",
  },
  s0467: {
    literal: "gengshen — Pei Du set out for the field headquarters; three hundred Shence troops were ordered to escort him; the Emperor attended at Tonghua Gate to send him off with labor.",
    idiomatic: "Pei Du left for the front with Shence escort on gengshen.",
  },
  s0468: {
    literal: "Du looked back at the gate and bowed twice, tears in his mouth as he took leave; the Emperor bestowed a rhinoceros belt.",
    idiomatic: "Pei Du wept at the gate and received an imperial rhinoceros belt.",
  },
  s0469: {
    literal: "Henan Intendant Xin Mi was made Lu prefecture senior administrator and Zhaoyi military commissioner, replacing Heshimei.",
    idiomatic: "Xin Mi replaced Heshimei at Zhaoyi.",
  },
  s0470: {
    literal: "Heshimei was made Works Minister; Meng Jian was made Revenue Vice Minister.",
    idiomatic: "Heshimei and Meng Jian were promoted to central posts.",
  },
  s0471: {
    literal: "wuchen — Tongzhou Prefect Zhang Zhengfu was made Henan Intendant.",
    idiomatic: "Zhang Zhengfu became Henan Intendant on wuchen.",
  },
  s0472: {
    literal: "jiashen — Pei Du reached Yan City.",
    idiomatic: "Pei Du arrived at Yan City on jiashen.",
  },
  s0473: {
    literal: "Ninth month, dinghai new moon.",
    idiomatic: "The ninth month opened on dinghai.",
  },
  s0474: {
    literal: "wuzi — inner-store brocade, rhinoceros horn, jade, and gold belts were issued to Revenue for valuation to supply the army.",
    idiomatic: "Imperial luxuries were liquidated for the campaign on wuzi.",
  },
  s0475: {
    literal: "jiawu — the Censorate memorialized:",
    idiomatic: "The Censorate petitioned on jiawu:",
  },
  s0476: {
    literal: "\"For officials appointed by the same edict, formerly the sequence of names high and low fixed precedence.",
    idiomatic: "\"Concurrent appointees had been ranked by name order,",
  },
  s0477: {
    literal: "Sometimes the name came first but the person arrived later — on arrival he still ranked above the older appointee.",
    idiomatic: "so late arrivals could leapfrog seniors.",
  },
  s0478: {
    literal: "Now request using the appointment date for precedence.\"",
    idiomatic: "They asked to rank by appointment date instead.\"",
  },
  s0479: {
    literal: "An edict said: \"If the name is first but the appointment date later, within one month this limit does not apply.",
    idiomatic: "The throne ruled name order held for one month after appointment;",
  },
  s0480: {
    literal: "For standing court order, use the edict's internal sequence as fixed.\"",
    idiomatic: "then edict order would govern seating.\"",
  },
  s0481: {
    literal: "wuxu — Eastern Sichuan military commissioner Lu Tan died.",
    idiomatic: "Lu Tan died in the east on wuxu.",
  },
  s0482: {
    literal: "jihai — Capital Intendant Dou Yizhi was demoted to Jinzhou prefect for judging a case and obtaining a false confession of bribery.",
    idiomatic: "Dou Yizhi was exiled for a coerced confession on jihai.",
  },
  s0483: {
    literal: "xinchou — the Vice Censor-in-Chief was made Capital Intendant.",
    idiomatic: "The vice censor became Capital Intendant on xinchou.",
  },
  s0484: {
    literal: "renyin — Hunan observation commissioner Wei Guanzhi was made Crown Prince Household Administrator in absentia.",
    idiomatic: "Wei Guanzhi was sidelined to the heir's household on renyin.",
  },
  s0485: {
    literal: "yisi — Penal Bureau Director acting miscellaneous matters Cui Yuanlue was made Censor-in-Chief.",
    idiomatic: "Cui Yuanlue became censor-in-chief on yisi.",
  },
  s0486: {
    literal: "dingwei — Court Discussion Doctor, Chancellery Vice Director, Grand Councillor Li Fengji was made acting War Minister, holder of the staff for Zizhou military affairs, Zizhou prefect, and Eastern Sichuan military vice commissioner in charge of the circuit.",
    idiomatic: "Li Fengji was sent to Sichuan on dingwei.",
  },
  s0487: {
    literal: "gengzi — Fuzhou Prefect Yuan Zi was made Hunan observation commissioner.",
    idiomatic: "Yuan Zi returned to Hunan as observer on gengzi.",
  },
  s0488: {
    literal: "Winter, tenth month, renshen — Pei Du went to Mokou to inspect plank construction of the Five Ditches; rebels suddenly arrived, strung crossbows and drew blades almost reaching Du; Li Guangyan and Tian Bu blocked their retreat and routed them.",
    idiomatic: "Pei Du nearly died inspecting ditches when rebels struck on renshen.",
  },
  s0489: {
    literal: "That day Du nearly fell captive.",
    idiomatic: "He barely escaped capture.",
  },
  s0490: {
    literal: "guiyou — from within, the Yuanhe \"Discerning Slander\" in three scrolls was issued to the Historiography Office.",
    idiomatic: "The court sent the Yuanhe slander reader to the historians on guiyou.",
  },
  s0491: {
    literal: "jiashen — Huainan military commissioner, acting Left Vice Director Li Yong was made Vice Director of the Secretariat and Grand Councillor; Left Vice Director Wei Cigong replaced Yong as Huainan commissioner.",
    idiomatic: "Li Yong entered the council; Wei Cigong took Huainan on jiashen.",
  },
  s0492: {
    literal: "jimao — Sui-Tang military commissioner Li Su led troops into Cai prefecture, seized Wu Yuanji and presented him; Huai-West was pacified.",
    idiomatic: "Li Su captured Wu Yuanji in Cai City on jimao; Huai-West fell.",
  },
  s0493: {
    literal: "jiashen edict: \"Huai-West merit officers are coming out; entrust Han Hong and Pei Du to list and memorialize.",
    idiomatic: "An edict on jiashen ordered Han Hong and Pei Du to report Huai merit rolls;",
  },
  s0494: {
    literal: "Huai-West soldiers — none are to be questioned.",
    idiomatic: "no Huai soldier was to be prosecuted;",
  },
  s0495: {
    literal: "Grant tax remission for two years per the original edict.\"",
    idiomatic: "and the region received two years' tax relief.\"",
  },
  s0496: {
    literal: "The edict closed.\"",
    idiomatic: "That closed the Huai-West amnesty edict.",
  },
  s0497: {
    literal: "Eleventh month, bingxu new moon — at Xing'an Gate the Emperor received the Huai-West captives.",
    idiomatic: "Xianzong took the Huai captives at Xing'an Gate on bingxu.",
  },
  s0498: {
    literal: "Wu Yuanji was paraded through both markets and beheaded at the Lone Willow Tree;",
    idiomatic: "Wu Yuanji was executed at Lone Willow after a public parade;",
  },
  s0499: {
    literal: "his wife Lady Shen was confiscated into the inner palace;",
    idiomatic: "Lady Shen went to the palace workshops;",
  },
  s0500: {
    literal: "two younger brothers and three sons were exiled — soon executed;",
    idiomatic: "his kin were exiled and then killed;",
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
if (data.metadata.chapter !== '015') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 015; standalone T ready (${Object.keys(T).length} entries).`
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
