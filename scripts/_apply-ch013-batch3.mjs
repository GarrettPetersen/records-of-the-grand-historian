#!/usr/bin/env node
/** Batch 3: s0201–s0300 (Jiutangshu ch.013, Dezong 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/013.json';
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
    literal: "On bingchen Court of the Imperial Clan Director Li Han was demoted to Tutor of the Prince of Ya;",
    idiomatic: "On bingchen Li Han was demoted to tutor of Prince of Ya;",
  },
  s0202: {
    literal: "Hanlin Academician Lu Zhi was made War Vice Minister.",
    idiomatic: "Lu Zhi left Hanlin for War.",
  },
  s0203: {
    literal: "Hanlin was abolished.",
    idiomatic: "The Hanlin academy was suspended.",
  },
  s0204: {
    literal: "On gengxu Xia prefecture memorialized opening the Yanhua canal, drawing Wushui into Kudize marsh, irrigating two hundred qing.",
    idiomatic: "On gengxu Xia opened a canal irrigating two hundred qing.",
  },
  s0205: {
    literal: "Ninth month, gengshen: retired War Minister Ma Xuan died.",
    idiomatic: "Ninth month: Ma Xuan died.",
  },
  s0206: {
    literal: "Tenth month, winter, guichou: whenever at Yanying the heads of all offices were ordered to report two each on their office's affairs.",
    idiomatic: "Tenth month: Yanying audiences required two briefers per office.",
  },
  s0207: {
    literal: "Soon another edict: each regular attendee two per day to be led in audience, questioned on administration — called \"circuit audience.\"",
    idiomatic: "Daily \"circuit audiences\" followed for regular officials.",
  },
  s0208: {
    literal: "Eleventh month, yichou: regular attendees entering court for audience must not run.",
    idiomatic: "Eleventh month: running in court was forbidden.",
  },
  s0209: {
    literal: "For mourning within five degrees of kin, somber dress was forbidden; at assemblies they must wear their proper colored silk robes with gold-jade belts.",
    idiomatic: "Mourners had to wear court dress, not sackcloth, at assemblies.",
  },
  s0210: {
    literal: "On dingyou former Fujian observer Wu Cou was made Shaan senior administrator and Shaan-Guo observer.",
    idiomatic: "On dingyou Wu Cou took Shaan-Guo.",
  },
  s0211: {
    literal: "That winter there was no snow.",
    idiomatic: "No snow fell that winter.",
  },
  s0212: {
    literal: "Eighth year, first month, bingchen new moon.",
    idiomatic: "Year 8, first month, bingchen new moon.",
  },
  s0213: {
    literal: "On guiyou the Guilin pacification-and-suppression commissioner was abolished.",
    idiomatic: "On guiyou Guilin's pacification post was cut.",
  },
  s0214: {
    literal: "Second month, dinghai: Xu man Li Gou'er with staff entered Hanyuan Hall, struck the balustrades, and also fought captors.",
    idiomatic: "Second month: Li Gou'er attacked Hanyuan Hall.",
  },
  s0215: {
    literal: "He was executed.",
    idiomatic: "He was put to death.",
  },
  s0216: {
    literal: "On gengzi dust rained on the capital.",
    idiomatic: "On gengzi dust fell like rain on Chang'an.",
  },
  s0217: {
    literal: "On jiyou Personnel Minister Li Shu died.",
    idiomatic: "On jiyou Li Shu died.",
  },
  s0218: {
    literal: "On yichou Shannan East commissioner, acting Revenue Minister, Heir of Prince of Cao Gao died.",
    idiomatic: "On yichou Gao of Cao died in Shannan East.",
  },
  s0219: {
    literal: "On gengwu Xuanwu commissioner, Grand Mentor, Associate Director Liu Xuanzuo died.",
    idiomatic: "On gengwu Liu Xuanzuo died.",
  },
  s0220: {
    literal: "On guiyou Sword-South West commissioner Wei Gao memorialized requesting increased salary for idle circuit officials — approved.",
    idiomatic: "On guiyou Wei Gao won higher pay for idle western staff.",
  },
  s0221: {
    literal: "On jihai Hunan observer Li Heng was made Hong prefect and Jiangxi observer.",
    idiomatic: "On jihai Li Heng took Jiangxi.",
  },
  s0222: {
    literal: "Xiangzhou troops mutinied, plundering government stores and people's wealth nearly clean; chief commander Xu Cheng beheaded ringleader Yang Qingtan before it stopped.",
    idiomatic: "Xiangzhou mutiny was ended when Xu Cheng killed Yang Qingtan.",
  },
  s0223: {
    literal: "On bingzi Jingnan commissioner Fan Ze was made Xiang prefect and Shannan East commissioner; Jiangxi observer Pei Zhou was made Jiangling Intendant and Jingnan commissioner.",
    idiomatic: "On bingzi Fan Ze and Pei Zhou swapped Jingnan and Jiangxi.",
  },
  s0224: {
    literal: "Revenue Minister Ban Hong was made judge of revenue; Revenue Vice Minister Zhang Pang was made salt-iron transport commissioner of all circuits.",
    idiomatic: "Ban Hong judged revenue; Zhang Pang took salt-iron transport.",
  },
  s0225: {
    literal: "On jimao Shaan-Guo observer Wu Zhen was made Bian prefect, Xuanwu commissioner, and Bian-Song observer.",
    idiomatic: "On jimao Wu Zhen took Xuanwu at Bian.",
  },
  s0226: {
    literal: "On xinsi Tong prefect Yao Nanzhong was made Shaan-Guo observer.",
    idiomatic: "On xinsi Yao Nanzhong took Shaan-Guo.",
  },
  s0227: {
    literal: "On renwu Left Senior Mentor Li Chong was made Capital Intendant; Suzhou prefect Qi Kang was made Tan prefect and Hunan observer.",
    idiomatic: "On renwu Li Chong and Qi Kang took capital and Hunan.",
  },
  s0228: {
    literal: "Fourth month, summer, dingchou: Left Golden Guards Grand General Heir of Prince of Guo Zezhi was demoted to Zhaozhou staff officer; Left Remonstrating Censor, Drafting Controller Wu Tongxuan was demoted to Quanzhou staff officer; Drafting Attendant Dou Shen to Daozhou staff officer.",
    idiomatic: "Fourth month: Zezhi, Wu Tongxuan, and Dou Shen were exiled in the Dou Can purge.",
  },
  s0229: {
    literal: "On wuzi Tutor of Prince of Ya Li Han was made Golden Guards Grand General.",
    idiomatic: "On wuzi Li Han was recalled as Golden Guards general.",
  },
  s0230: {
    literal: "Han had earlier been demoted by Dou Can's hatred; now Can fell and the Emperor suddenly summoned Han, orally appointing general, ordering Golden Guards attendance at once — the commission document came only the next day.",
    idiomatic: "Li Han was restored overnight when Dou Can fell.",
  },
  s0231: {
    literal: "On gengyin Bian senior administrator Liu Shining was made Bian prefect and Xuanwu commissioner.",
    idiomatic: "On gengyin Liu Shining seized Xuanwu at Bian.",
  },
  s0232: {
    literal: "At that time Wu Zhen's march had reached Sishui; hearing of the change he returned.",
    idiomatic: "Wu Zhen turned back at Sishui when he heard.",
  },
  s0233: {
    literal: "On yiwei Secretariat Vice Director, Associate Director Dou Can was demoted to Chenzhou registrar; Dou Shen to Jingzhou clerk.",
    idiomatic: "On yiwei Dou Can and Dou Shen were exiled.",
  },
  s0234: {
    literal: "Soon Shen was beaten to death.",
    idiomatic: "Dou Shen was flogged to death soon after.",
  },
  s0235: {
    literal: "All the Dou clan were demoted.",
    idiomatic: "The whole Dou clan was banished.",
  },
  s0236: {
    literal: "Left Vice Minister Zhao Jing and War Vice Minister Lu Zhi were made Secretariat Vice Directors and Associate Grand Secretariat Directors.",
    idiomatic: "Zhao Jing and Lu Zhi replaced the Dous as chancellors.",
  },
  s0237: {
    literal: "On dingyou Wei Gao requested twelve parts in ten as tax to pay officials — approved.",
    idiomatic: "On dingyou Wei Gao's twelve-tenths tax for officials was allowed.",
  },
  s0238: {
    literal: "On bingwu the two-tax goods of the eastern capital, Henan, Huainan, Jiangnan, and Lingnan, and Shannan East were placed under Revenue Vice Minister Zhang Pang;",
    idiomatic: "Zhang Pang took eastern two-tax revenues;",
  },
  s0239: {
    literal: "the wealth of the interior, Hedong, Sword-South, and Shannan West under Revenue Minister and revenue judge Ban Hong.",
    idiomatic: "Ban Hong held the western two-tax, as in the Dali Liu Yan–Han Huang division.",
  },
  s0240: {
    literal: "Altogether following the great Dali precedent, as when Liu Yan and Han Huang divided charge.",
    idiomatic: "The split revived Liu Yan and Han Huang's old division.",
  },
  s0241: {
    literal: "Drafting Attendant Wei Xiaqing was transferred left to Changzhou prefect for associating with the Dou clan.",
    idiomatic: "Wei Xiaqing was exiled for Dou ties.",
  },
  s0242: {
    literal: "That month Tibet raided Ling prefecture.",
    idiomatic: "That month Tibet raided Lingzhou.",
  },
  s0243: {
    literal: "Fifth month, yimao new moon: the Emperor received audience at Xuanzheng.",
    idiomatic: "Fifth month: Xuanzheng audience.",
  },
  s0244: {
    literal: "On bingchen the green-crop tax on the capital region was first increased three cash per mu to supply palace stud and falconry.",
    idiomatic: "On bingchen the capital green-crop tax rose three cash per mu for palace studs.",
  },
  s0245: {
    literal: "On wuwu Court of the Imperial Regalia Junior Director Cui Mu was made Qian observer.",
    idiomatic: "On wuwu Cui Mu took Qian.",
  },
  s0246: {
    literal: "On jiwei great wind blew down dwellings and gate towers.",
    idiomatic: "On jiwei a gale wrecked houses and gates.",
  },
  s0247: {
    literal: "On bingyin Grand Court Judge Wang Hong was made Fujian observer.",
    idiomatic: "On bingyin Wang Hong took Fujian.",
  },
  s0248: {
    literal: "On wuchen it was first ordered that those receiving Censorate and Secretariat posts must each name a recommender on the appointment edict.",
    idiomatic: "On wuchen palace appointees had to name their sponsors on the edict.",
  },
  s0249: {
    literal: "Previously when bureau director posts were vacant the Vice Directors recommended; when censor posts were vacant the Censor-in-Chief and Vice Censor recommended — the edict did not list who recommended.",
    idiomatic: "Earlier sponsors were unnamed on appointment edicts.",
  },
  s0250: {
    literal: "When Zhao Jing and Lu Zhi became chancellors they proposed that bureau directors should not be monopolized by the Vice Directors — Ministers, Vice Ministers, and bureau directors should each recommend the able; the edict should list the recommender's name, and censors likewise; later performance review would grade the recommender's ability.",
    idiomatic: "Zhao and Lu required named sponsors accountable at review time.",
  },
  s0251: {
    literal: "Approved.",
    idiomatic: "The reform was approved.",
  },
  s0252: {
    literal: "On guiyou Pinglu-Zi-Qing commissioner, acting Grand Mentor, Associate Director Li Na died.",
    idiomatic: "On guiyou Li Na died.",
  },
  s0253: {
    literal: "On guimao former Court of the Imperial Stud Junior Director Liu Shigan, guilty, was granted death — Li Xuanzuo's adopted son.",
    idiomatic: "On guimao Liu Shigan, Xuanzuo's adopted son, was executed.",
  },
  s0254: {
    literal: "Sixth month: Tibet raided Jing prefecture.",
    idiomatic: "Sixth month: Tibet raided Jingzhou.",
  },
  s0255: {
    literal: "Seventh month, jiayin new moon: Revenue Minister and revenue judge Duke of Xiao Ban Hong died.",
    idiomatic: "Seventh month: Ban Hong died.",
  },
  s0256: {
    literal: "Guilin observer Qi Ying was made Hong prefect and Jiangxi observer;",
    idiomatic: "Qi Ying went to Jiangxi;",
  },
  s0257: {
    literal: "Hanlin Academician Gui Chongjing was made War Minister, retired.",
    idiomatic: "Gui Chongjing retired as War minister.",
  },
  s0258: {
    literal: "On xinsi great rain.",
    idiomatic: "On xinsi torrential rain.",
  },
  s0259: {
    literal: "Eighth month, yichou: because of empire-wide flood, court ministers were dispatched to proclaim relief and loans.",
    idiomatic: "Eighth month: flood envoys were sent to forty-odd circuits.",
  },
  s0260: {
    literal: "Henan, Hebei, Shannan, and Jiang-Huai — more than forty prefectures great flood; drowned dead more than twenty thousand.",
    idiomatic: "Floods drowned over twenty thousand across the east.",
  },
  s0261: {
    literal: "On xinmao Qing prefect Li Shigu was made Yan metropolitan senior administrator, Pinglu-Zi-Qing commissioner, sea and land transport, and commissioner over Silla, Bohai, and the two barbarian realms.",
    idiomatic: "On xinmao Li Shigu inherited Li Na's Yan and Pinglu command.",
  },
  s0262: {
    literal: "On dingwei an edict because of famine year canceled the Double Ninth banquet gift.",
    idiomatic: "On dingwei famine canceled the Double Ninth feast grants.",
  },
  s0263: {
    literal: "Ninth month, dingsi: Wei Gao attacked Tibet's Wei prefecture and presented captive general Lun Mangre.",
    idiomatic: "Ninth month: Wei Gao took Lun Mangre at Wei prefecture.",
  },
  s0264: {
    literal: "Crown Prince Guest Yu Shao was demoted to Jiangzhou registrar; soon he died.",
    idiomatic: "Yu Shao was exiled to Jiangzhou and soon died.",
  },
  s0265: {
    literal: "On yihai Crown Prince Guest Xue Jue was made Lingnan commissioner.",
    idiomatic: "On yihai Xue Jue took Lingnan.",
  },
  s0266: {
    literal: "Tenth month, winter, jihai: posthumously enfeoffed the late imperial younger brother Xia as Prince of Jun.",
    idiomatic: "Tenth month: Prince Xia was posthumously enfeoffed Prince of Jun.",
  },
  s0267: {
    literal: "On gengxu Golden Guards gate registers were restored.",
    idiomatic: "On gengxu Golden Guards gate books returned.",
  },
  s0268: {
    literal: "Eleventh month, renzi new moon: there was an eclipse of the sun.",
    idiomatic: "Eleventh month: solar eclipse.",
  },
  s0269: {
    literal: "On jisi Left Senior Mentor Jiang Gongfu was demoted to Quanzhou registrar.",
    idiomatic: "On jisi Jiang Gongfu was exiled.",
  },
  s0270: {
    literal: "Yan Zhen memorialized defeating Tibet at Fang prefecture.",
    idiomatic: "Yan Zhen reported victory over Tibet at Fang.",
  },
  s0271: {
    literal: "On renshen an edict: henceforth do not first execute capital punishment by beating.",
    idiomatic: "On renshen beating before execution of capital convicts was banned.",
  },
  s0272: {
    literal: "Twelfth month, gengyin, edict: bestow thirty thousand shi of grain to flood-stricken counties with exhausted households.",
    idiomatic: "Twelfth month: thirty thousand shi of relief grain for flood counties.",
  },
  s0273: {
    literal: "On dingwei Drafting Attendant Li Xun was made Tan prefect and Hunan observer.",
    idiomatic: "On dingwei Li Xun took Hunan.",
  },
  s0274: {
    literal: "Intercalary month, guiyou: the Chancellery memorialized: \"Relay regulations should supply paper vouchers.",
    idiomatic: "Intercalary month: the Chancellery regulated relay vouchers.",
  },
  s0275: {
    literal: "Except the Chancellery, all envoys and prefectures must not issue round-trip vouchers; at the destination prefecture they are surrendered and separate vouchers given for return to court.",
    idiomatic: "Only the Chancellery might issue return vouchers.",
  },
  s0276: {
    literal: "Regular attendees appointed outside or on leave traveling back and forth — all receive vouchers.\"",
    idiomatic: "Regular officials on assignment also received vouchers.",
  },
  s0277: {
    literal: "Approved.",
    idiomatic: "Thus ended the memorial.",
  },
  s0278: {
    literal: "On jiaxu Zangke, Shiwei, and Mohe all sent envoys with tribute.",
    idiomatic: "On jiaxu several frontier peoples presented tribute.",
  },
  s0279: {
    literal: "Ninth year, first month, gengchen new moon: after congratulatory audience the Emperor composed \"Poem on Returning from Court to View the Guard Camps.\"",
    idiomatic: "Year 9, first month: after audience he composed a guard-camp poem.",
  },
  s0280: {
    literal: "On yiyou Sword-South East commissioner Wang Shuyong came to court.",
    idiomatic: "On yiyou Wang Shuyong came from Sword-South East.",
  },
  s0281: {
    literal: "On guimao the tea tax was first imposed — four hundred thousand strings yearly — as salt-iron commissioner Zhang Pang memorialized.",
    idiomatic: "On guimao Zhang Pang inaugurated the tea tax at four hundred thousand strings.",
  },
  s0282: {
    literal: "Tax on tea began from this.",
    idiomatic: "State tea taxation began here.",
  },
  s0283: {
    literal: "On jiachen selling swords and copper vessels was forbidden.",
    idiomatic: "On jiachen private sale of swords and copperware was banned.",
  },
  s0284: {
    literal: "Where the empire had copper mountains, people might mine; the copper the government bought — except mirrors, no casting.",
    idiomatic: "Private mining was allowed but minting was state-controlled except mirrors.",
  },
  s0285: {
    literal: "Second month, gengxu new moon.",
    idiomatic: "Second month began on gengxu.",
  },
  s0286: {
    literal: "Previously chancellors on the three festivals received banquets while prefectures and counties had provisioning abuses; they requested dividing the banquet money for each office to choose scenic feasts — approved.",
    idiomatic: "Festival banquet cash replaced costly local provisioning.",
  },
  s0287: {
    literal: "That day on Mid-Harmony chancellors banqueted at Qujiang; each office as convenient — from this separate banquets.",
    idiomatic: "Mid-Harmony became separate office feasts at Qujiang.",
  },
  s0288: {
    literal: "Yiding acting commissioner Zhang Shengyun became Yiding commissioner.",
    idiomatic: "Zhang Shengyun became full Yiding commissioner.",
  },
  s0289: {
    literal: "On xinyou an edict restored building Yan prefecture's walls.",
    idiomatic: "On xinyou Yan prefecture's walls were ordered rebuilt.",
  },
  s0290: {
    literal: "Zhenyuan 3 the city was destroyed by Tibet; from then the outer frontier had no forts; the dog barbarians raided — after the city, border trouble ceased.",
    idiomatic: "Yan's rebuild ended raids after years without frontier forts.",
  },
  s0291: {
    literal: "Third month, jihai: Chariotry Bureau director, Drafting Controller Zhang Shi was made Guo prefect.",
    idiomatic: "Third month: Zhang Shi became Guo prefect.",
  },
  s0292: {
    literal: "Fourth month, summer, xinyou: earthquake with sound like thunder; Hezhong and the capital region worst — city walls and dwellings ruined, ground split and water gushed.",
    idiomatic: "Fourth month: a thunderous earthquake wrecked Hezhong and the capital.",
  },
  s0293: {
    literal: "Fifth month, gengshen: saber-bearers of all prefectures and prefectures were abolished.",
    idiomatic: "Fifth month: prefectural saber-bearers were cut.",
  },
  s0294: {
    literal: "On jiachen Yicheng commissioner, acting Right Vice Director Jia Dan was made Left Vice Director and Associate Director; Personnel Left Vice Minister Lu Mai became Associate Director at his substantive rank.",
    idiomatic: "On jiachen Jia Dan and Lu Mai entered the chancellery.",
  },
  s0295: {
    literal: "Zheng prefect Li Rong was made Hua prefect and Yicheng commissioner.",
    idiomatic: "Li Rong took Yicheng at Hua.",
  },
  s0296: {
    literal: "On yisi Wei Gao memorialized dispatching troops west of the mountains, breaking Tibet's Ehe city, Dinglian city, and Tonghe army — in all more than fifty forts pacified.",
    idiomatic: "On yisi Wei Gao reported fifty western forts taken from Tibet.",
  },
  s0297: {
    literal: "That day Tibetan captives and weapons were presented.",
    idiomatic: "Captives and arms were presented that day.",
  },
  s0298: {
    literal: "On bingxu Chancellery Vice Director, Associate Director Dong Jin was made Minister of Rites and left government.",
    idiomatic: "On bingxu Dong Jin left the chancellery for Rites.",
  },
  s0299: {
    literal: "On jiayin Wei Gao was made acting Right Vice Director; Court of the Imperial Granaries Junior Director Pei Yanling was made Revenue Vice Minister and revenue judge.",
    idiomatic: "On jiayin Wei Gao gained a vice title; Pei Yanling took revenue.",
  },
  s0300: {
    literal: "On gengshen Drafting Attendant Li Heng was made Revenue Vice Minister and salt-iron transport commissioner.",
    idiomatic: "On gengshen Li Heng took transport.",
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
if (data.metadata.chapter !== '013') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 013; standalone T ready (${Object.keys(T).length} entries).`
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
