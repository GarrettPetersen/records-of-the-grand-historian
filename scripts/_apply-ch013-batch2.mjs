#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Jiutangshu ch.013, Dezong 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/013.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 101;
const END = 200;

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
  s0101: {
    literal: "The Drafting Attendant Du Huangshang was made Henan Intendant.",
    idiomatic: "Du Huangshang became Henan Intendant.",
  },
  s0102: {
    literal: "On wuchen an edict made Li Huai'guang's grandson Yan Baba Left Guard Rate-Fu Aide, bestowed the surname and name Li Chengxu, and gave one thousand strings to establish a household.",
    idiomatic: "On wuchen Huai'guang's grandson was ennobled Li Chengxu with cash to settle.",
  },
  s0103: {
    literal: "Fourth month, summer, yiwei: Crown Prince Junior Tutor Xiao Xin was made Minister of Works, retired, with half salary and ration permanently as precedent.",
    idiomatic: "Fourth month: Xiao Xin retired as Works minister with half pay.",
  },
  s0104: {
    literal: "At first retired officials received only half salary, no ration; the Emperor added ration to honor old ministers — half ration began with Xin.",
    idiomatic: "Retirees had lacked ration until Xin's pension added half ration.",
  },
  s0105: {
    literal: "Fifth month, wuchen: at Song prefecture wheat with one stalk and nine tassels — more than a hundred plants.",
    idiomatic: "Fifth month: Songzhou reported wheat with nine ears on one stalk.",
  },
  s0106: {
    literal: "Sixth month, yiwei: Court of the Imperial Regalia Director Pei Tian was made Guilin observer.",
    idiomatic: "Sixth month: Pei Tian took Guilin.",
  },
  s0107: {
    literal: "Seventh month: Heir of Prince of Teng Zhanran was made Crown Prince Guest and envoy to the Uighurs.",
    idiomatic: "Seventh month: Zhanran of Teng became crown prince guest and Uighur envoy.",
  },
  s0108: {
    literal: "Eighth month, xinwei: Tong prefect Dou Xian was made Vice Minister of Revenue.",
    idiomatic: "Eighth month, xinwei: Dou Xian entered Revenue.",
  },
  s0109: {
    literal: "Ninth month, renxu, edict: from Chu Suiliang down to Li Sheng, twenty-seven — portraits at Lingyan Pavilion to follow the founding ministers' images.",
    idiomatic: "Ninth month: twenty-seven later ministers joined Lingyan portraits.",
  },
  s0110: {
    literal: "Tenth month, winter, bingwu: West River Wei Gao memorialized a great defeat of Tibet at old Xi prefecture with Eastern Man — captive general Zang Zhezhe.",
    idiomatic: "Tenth month: Wei Gao smashed Tibet at Xi and took Zang Zhezhe.",
  },
  s0111: {
    literal: "From this Tibet's edge was blunted; they eventually recovered Xi prefecture.",
    idiomatic: "Tibetan power waned, though Xi was later lost again.",
  },
  s0112: {
    literal: "On gengwu the hundred officials requested restoration of honorific titles — not permitted.",
    idiomatic: "On gengwu the court's plea for honorifics was refused.",
  },
  s0113: {
    literal: "On jichou Yiding commissioner, acting Minister of Works, Associate Director Zhang Xiaozhong, for unauthorized troop dispatch to assault Wei prefecture, was demoted from acting Works to Left Vice Director.",
    idiomatic: "On jichou Zhang Xiaozhong lost his Works title for raiding Wei.",
  },
  s0114: {
    literal: "Guilin observer, Vice Censor-in-Chief Sun Sheng died.",
    idiomatic: "Sun Sheng died in Guilin.",
  },
  s0115: {
    literal: "On guisi Vice Minister of Revenue Dou Xian was made Yangzhou senior administrator, concurrent Censor-in-Chief, and Huainan commissioner.",
    idiomatic: "On guisi Dou Xian took Huainan at Yangzhou.",
  },
  s0116: {
    literal: "Twelfth month, gengwu: Uighur Moyanchuo Heavenly Kin Qaghan died.",
    idiomatic: "Twelfth month: the Uighur qaghan died.",
  },
  s0117: {
    literal: "On xinwei Huainan commissioner Du Ya was made Eastern Capital regent and Ji-Ru overall defense commissioner; War Vice Minister Pei Zhu was made Henan Intendant; Court of the Imperial Granaries Director Li Yi was made Shaan-Guo defense observer.",
    idiomatic: "On xinwei Du Ya, Pei Zhu, and Li Yi reshuffled eastern and Shaan posts.",
  },
  s0118: {
    literal: "On renshen Shaan-Guo observer Du You was made acting Minister of Rites, concurrent Yangzhou senior administrator and Huainan commissioner.",
    idiomatic: "On renshen Du You returned to Huainan with a Rites title.",
  },
  s0119: {
    literal: "Sixth year, first month, wuchen new moon.",
    idiomatic: "Year 6, first month, wuchen new moon.",
  },
  s0120: {
    literal: "On wushen great snow fell.",
    idiomatic: "On wushen heavy snow.",
  },
  s0121: {
    literal: "Second month, wuchen new moon: the hundred officials banqueted at Qujiang; the Emperor composed seven rhymes on \"Mid-Harmony Festival Court Banquet.\"",
    idiomatic: "Second month: Qujiang banquet with an imperial Mid-Harmony poem.",
  },
  s0122: {
    literal: "That day the hundred officials presented three rolls of \"Myriad Peoples' Basic Livelihood\"; the Court of the Imperial Granaries offered one peck each of millet and grain.",
    idiomatic: "Officials presented farm manuals; the granary offered millet samples.",
  },
  s0123: {
    literal: "At Worry-Free King Temple in Qi prefecture was a Buddha finger bone over an inch; it had been taken to the palace for worship — on yihai an edict returned it to the original temple.",
    idiomatic: "A Buddha finger relic was sent back to Qi prefecture's temple.",
  },
  s0124: {
    literal: "On renxu Secretariat Drafter Lu Zhi was made acting War Vice Minister.",
    idiomatic: "On renxu Lu Zhi became acting War vice minister.",
  },
  s0125: {
    literal: "On jiawu Personnel Vice Minister Liu Zi was made Personnel Minister.",
    idiomatic: "On jiawu Liu Zi became Personnel minister.",
  },
  s0126: {
    literal: "On dingyou Wang Wu Jun's Su prefecture general Zhao Hao returned the commandery to Li Na; Wu Jun was enraged and attacked with troops.",
    idiomatic: "On dingyou Zhao Hao's defection to Li Na drew Wang Wu Jun's attack.",
  },
  s0127: {
    literal: "Third month, gengzi: the hundred officials banqueted at Qujiang; the Emperor composed one \"Upper Si Poem\" and bestowed it.",
    idiomatic: "Third month: Qujiang upper-si banquet with imperial verse.",
  },
  s0128: {
    literal: "On renyin Hun Zhen came to court from Hezhong.",
    idiomatic: "On renyin Hun Zhen arrived from Hezhong.",
  },
  s0129: {
    literal: "On wuwu the Zangke barbarians came to court.",
    idiomatic: "On wuwu Zangke tribes presented tribute.",
  },
  s0130: {
    literal: "On jiazi because of drought the sun's color was like blood, without light.",
    idiomatic: "On jiazi drought turned the sun blood-red and dim.",
  },
  s0131: {
    literal: "Fourth month, summer, jiachen: great wind and thunder.",
    idiomatic: "Fourth month: wind and thunderstorm.",
  },
  s0132: {
    literal: "Intercalary month, gengshen: Venus and Mercury gathered in the Eastern Well.",
    idiomatic: "Intercalary month: Venus and Mercury met in the Eastern Well.",
  },
  s0133: {
    literal: "On wuwu rain finally began.",
    idiomatic: "On wuwu the long drought broke.",
  },
  s0134: {
    literal: "Fifth month, bingyin new moon: the Emperor received audience at Zichen.",
    idiomatic: "Fifth month, bingyin: audience at Zichen Hall.",
  },
  s0135: {
    literal: "Because that month was the first growth of yin, the minister's way lengthened, father and son must face each other on that new moon — therefore he took the new-moon day for audience.",
    idiomatic: "He held new-moon audiences to mark growing yin and filial order.",
  },
  s0136: {
    literal: "On renwu Ning prefect Fan Xichao was made Shanyu Grand Protector and Lin-Sheng commissioner.",
    idiomatic: "On renwu Fan Xichao took Shanyu and Lin-Sheng.",
  },
  s0137: {
    literal: "That summer Huainan, Zhe's east and west, and Fujian circuits droughted; many wells dried; people thirsted; plague deaths were many.",
    idiomatic: "Huainan and the southeast suffered drought, thirst, and plague.",
  },
  s0138: {
    literal: "Seventh month, bingyin: Huainan commissioner Dou Xian died.",
    idiomatic: "Seventh month: Dou Xian died at Huainan.",
  },
  s0139: {
    literal: "On guiyou consorts' mothers were again called Grand Consort; princesses' mothers were called Grand Mistress.",
    idiomatic: "On guiyou titles for imperial mothers were restored.",
  },
  s0140: {
    literal: "Eighth month, dingwei: retired Works Minister Bao Fang died.",
    idiomatic: "Eighth month: Bao Fang died.",
  },
  s0141: {
    literal: "Ninth month, yichou: seals of memorial-route relay offices were collected and all destroyed.",
    idiomatic: "Ninth month: circuit memorial-route seals were abolished.",
  },
  s0142: {
    literal: "On jimao an edict: \"On the eighth day of the eleventh month there will be rites at the Southern Suburb and Imperial Ancestral Temple; all accompanying officials, soldiers, and the like shall supply their own food.",
    idiomatic: "On jimao an edict ordered self-supplied food for the southern suburb rites.",
  },
  s0143: {
    literal: "Offices that previously lacked public kitchens shall use this office's vacant-post goods.",
    idiomatic: "Offices without kitchens were to use vacant-post goods.",
  },
  s0144: {
    literal: "Princely establishment officials — Revenue shall measure and grant grain rations.",
    idiomatic: "Princely staffs received measured grain from Revenue.",
  },
  s0145: {
    literal: "Regalia and ritual gifts — all rely on the censorate to restrain and dispose.\"",
    idiomatic: "Censors were to curb ritual expenses.",
  },
  s0146: {
    literal: "Tenth month, winter, jihai: civil and military officials, capital clergy and laity, submitted joint memorials requesting honorific titles; the Emperor said: \"I in spring and summer suffered great drought; grain and wheat did not ripen; I prayed sincerely and sweet rain descended; abundance was achieved — I give thanks at suburb and temple.",
    idiomatic: "Tenth month: the court begged honorifics; the Emperor refused, citing drought ended by prayer.",
  },
  s0147: {
    literal: "If I now received honorifics because of ritual sacrifice, that would be doing for effect.",
    idiomatic: "He would not take a title merely from ritual.",
  },
  s0148: {
    literal: "Do not trouble me with repeated requests.\"",
    idiomatic: "Thus ended the edict.",
  },
  s0149: {
    literal: "On xinhai the Uighur mourning envoy, Court Director Guo Feng, returned; Uighurs sent Tabolei Meilu general to announce the death of the Nine Surnames' Qaghan Dengli Luomei Mishi Julu Zhongzhen Kunjia.",
    idiomatic: "On xinhai Uighur envoys announced their qaghan's death.",
  },
  s0150: {
    literal: "Eleventh month, gengwu: winter solstice; the Emperor personally sacrificed to August Heaven at the suburban mound.",
    idiomatic: "Eleventh month: the Emperor performed solstice sacrifice at the mound.",
  },
  s0151: {
    literal: "When the rites ended he returned to the palace, ascended Danfeng Tower, proclaimed amnesty, saw imprisoned convicts and reduced crimes one degree, and bestowed on standing guards and all army soldiers one hundred thousand bolts of silk.",
    idiomatic: "He returned, amnestied prisoners, and gifted silk to the guards.",
  },
  s0152: {
    literal: "Henceforth prefects and magistrates were limited to four performance reviews.",
    idiomatic: "Magistrates' terms were capped at four reviews.",
  },
  s0153: {
    literal: "Qing prefecture's Li Na returned Di prefecture to Wang Wu Jun with three thousand troops.",
    idiomatic: "Li Na returned Di to Wang Wu Jun with three thousand men.",
  },
  s0154: {
    literal: "That year Tibet took the Northern Court Protectorate; commissioner Yang Xigu fled to Xi prefecture.",
    idiomatic: "Tibet seized the Northern Court; Yang Xigu fled to Xi.",
  },
  s0155: {
    literal: "Uighur chief minister Yigan Gesi deceived Xigu, requesting joint armies to recover the Northern Court, then killed Xigu; Anxi was thereby cut off — only Xi still held fast.",
    idiomatic: "Uighurs betrayed Yang Xigu and severed Anxi, leaving Xi alone.",
  },
  s0156: {
    literal: "The Uighurs were also pressed by Tibet, took Fotu River, and moved tribes and herds south of the royal camp to avoid them.",
    idiomatic: "Uighurs too fled Tibet, shifting herds south of the royal camp.",
  },
  s0157: {
    literal: "Seventh year, first month, renxu new moon.",
    idiomatic: "Year 7, first month, renxu new moon.",
  },
  s0158: {
    literal: "On jisi Prince of Xiang Zan died.",
    idiomatic: "On jisi Prince Zan of Xiang died.",
  },
  s0159: {
    literal: "On gengchen Hunan observer Pei Zhou was made Hong prefect and Jiangxi observer; Changzhou prefect Li Heng was made Vice Censor-in-Chief.",
    idiomatic: "On gengchen Pei Zhou and Li Heng changed Hunan-Jiangxi posts.",
  },
  s0160: {
    literal: "Second month, jisi: Jingyuan commander Liu Chang rebuilt Pingliang city.",
    idiomatic: "Second month: Liu Chang rebuilt Pingliang.",
  },
  s0161: {
    literal: "The city was one hundred fifty li from old Yuan prefecture; originally a subordinate county of Yuan, the ground lay on the vital pass against barbarians.",
    idiomatic: "New Pingliang sat on the frontier corridor, far from old Yuanzhou.",
  },
  s0162: {
    literal: "Chang finished the work in a double fortnight, divided troops to garrison it, and border trouble was slightly eased.",
    idiomatic: "He built it in two weeks and eased the border.",
  },
  s0163: {
    literal: "On gengzi Palace Attendant Hun Zhen came to court from Hezhong.",
    idiomatic: "On gengzi Hun Zhen came from Hezhong.",
  },
  s0164: {
    literal: "Third month, xinyou: Chen-Xu commissioner Qu Huan memorialized requesting temporary suspension of redundant posts in the circuit, to restore after one or two years when the people's strength was somewhat supplied.",
    idiomatic: "Third month: Qu Huan asked to suspend redundant Chen-Xu posts briefly.",
  },
  s0165: {
    literal: "On renxu Left Dragon Martial commander-in-chief Dai Xiuyan died.",
    idiomatic: "On renxu Dai Xiuyan died.",
  },
  s0166: {
    literal: "On jiazi Jingyuan commissioner Liu Chang built Hugu Fort, renamed Zhangyi Fort.",
    idiomatic: "On jiazi Liu Chang built Hugu, renamed Zhangyi.",
  },
  s0167: {
    literal: "The fort was thirty-five li west of Pingliang — again a key against barbarians.",
    idiomatic: "Zhangyi stood thirty-five li west of Pingliang on the frontier line.",
  },
  s0168: {
    literal: "On renshen an edict: \"Recently bestowed robes' patterns were irregular — not regulation.",
    idiomatic: "An edict standardized patterns on bestowed robes.",
  },
  s0169: {
    literal: "I now consider it: there should be fixed design — commissioners should use geese holding ribbons; observers should use wild geese holding weiyi.\"",
    idiomatic: "Commissioners wore geese-with-ribbon; observers, geese-with-auspicious-grass.",
  },
  s0170: {
    literal: "Weiyi — an auspicious plant.",
    idiomatic: "Weiyi was an auspicious plant.",
  },
  s0171: {
    literal: "In the capital region cattle plague killed them — six or seven in ten died.",
    idiomatic: "A cattle plague killed most stock around the capital.",
  },
  s0172: {
    literal: "The Emperor sent palace envoys to sell cattle with the two-tax money of the circuits and distribute to capital-region people without cattle.",
    idiomatic: "Palace agents bought cattle with two-tax funds for farmers lacking draft animals.",
  },
  s0173: {
    literal: "On xinsi an edict: Divine Awe and Divine Strategy six armies' soldiers suing one another — the army office investigates;",
    idiomatic: "An edict split jurisdiction: army suits to the army office,",
  },
  s0174: {
    literal: "suits with commoners — entrusted to prefectures and counties;",
    idiomatic: "civilian suits to local courts;",
  },
  s0175: {
    literal: "small matters by memorandum, great matters memorialized for disposition — army offices and prefectures and counties must not encroach on one another.",
    idiomatic: "major cases went to the throne; neither side could seize the other's cases.",
  },
  s0176: {
    literal: "On guimao Yiding commissioner, acting Minister of Works, Associate Director Zhang Xiaozhong died.",
    idiomatic: "On guimao Zhang Xiaozhong died.",
  },
  s0177: {
    literal: "Fourth month, summer, gengzi: retired Crown Prince Junior Tutor Xiao Xin died.",
    idiomatic: "Fourth month: Xiao Xin died.",
  },
  s0178: {
    literal: "Bian prefecture presented a white crow.",
    idiomatic: "Bianzhou sent a white crow.",
  },
  s0179: {
    literal: "On wuwu an edict: \"In midsummer the myriad things flourish; yang virtue is at its height and yin affairs begin to receive.",
    idiomatic: "On wuwu an edict proclaimed midsummer audiences of father and son, ruler and minister.",
  },
  s0180: {
    literal: "Formerly observing the emblems, following Heaven-and-earth's meeting sequence, they made the rite of father and son meeting — the custom flowed, ancient and modern unchanged.",
    idiomatic: "The rite followed cosmic yin-yang exchange, an immemorial custom.",
  },
  s0181: {
    literal: "The king regulates affairs, moved by feeling and using the people; weighing sentiment and employing the mean, following custom as ritual.",
    idiomatic: "Kings shaped ritual from human feeling and custom.",
  },
  s0182: {
    literal: "The meaning of universal sight already operated between father and son;",
    idiomatic: "Filial meeting belonged to the family;",
  },
  s0183: {
    literal: "the feeling of supporting affairs — how could it be separated between ruler and minister?",
    idiomatic: "yet ministerial service belonged equally to the court.",
  },
  s0184: {
    literal: "Extending grace to the ministers began with me.",
    idiomatic: "He would begin monthly court meetings with his ministers.",
  },
  s0185: {
    literal: "Starting this year on the fifth month's new moon, at the main hall he summoned civil and military officials; outer officials attending memorial audience might all take their places.",
    idiomatic: "From the fifth month's new moon he held open audiences at Xuanzheng.",
  },
  s0186: {
    literal: "Still compile ritual forms as permanent statute.",
    idiomatic: "The form was codified as precedent.",
  },
  s0187: {
    literal: "On jiwei Annan chieftain Du Yinghan rebelled, attacked the protectorate; Protector Gao Zhengping died of grief.",
    idiomatic: "On jiwei Annan rebelled; Protector Gao Zhengping died.",
  },
  s0188: {
    literal: "Fifth month, gengshen new moon: the Emperor received audience at Xuanzheng Hall and saw the hundred officials — following the new regulation.",
    idiomatic: "Fifth month: first Xuanzheng audience under the new rule.",
  },
  s0189: {
    literal: "On xinwei Rouyuan army was established at the Annan Protectorate.",
    idiomatic: "On xinwei Rouyuan army was posted to Annan.",
  },
  s0190: {
    literal: "On jiashen Prince of Duan Yu died.",
    idiomatic: "On jiashen Prince of Duan died.",
  },
  s0191: {
    literal: "Xu prefecture presented a white crow.",
    idiomatic: "Xuzhou sent a white crow.",
  },
  s0192: {
    literal: "On wuzi Hengzhou prefect Qi Ying was made Guilin observer.",
    idiomatic: "On wuzi Qi Ying took Guilin.",
  },
  s0193: {
    literal: "Sixth month, gengzi new moon.",
    idiomatic: "Sixth month opened on gengzi.",
  },
  s0194: {
    literal: "On yisi Court of Imperial Sacrifices Director Cui Zong died.",
    idiomatic: "On yisi Cui Zong died.",
  },
  s0195: {
    literal: "Seventh month, gengwu: Xin prefect Zheng Shuzhe was made Fujian observer.",
    idiomatic: "Seventh month: Zheng Shuzhe went to Fujian.",
  },
  s0196: {
    literal: "On guiyou the Emperor visited Zhangjing Temple, composed nine rhymes; the Crown Prince and ministers all matched and inscribed them on the temple wall.",
    idiomatic: "On guiyou he visited Zhangjing Temple and left matching poems on the wall.",
  },
  s0197: {
    literal: "On wuyin Prince of Yong Zhen was made Yiding commissioner and Yiding observer and related grand commissioner; Ding prefect Zhang Shengyun was made acting commissioner.",
    idiomatic: "On wuyin Prince Zhen took Yiding; Zhang Shengyun stayed as acting chief.",
  },
  s0198: {
    literal: "On gengchen Qian prefect Zhao Chang was made Protector-General of Annan and pacification commissioner.",
    idiomatic: "On gengchen Zhao Chang took Annan.",
  },
  s0199: {
    literal: "Eighth month, jichou: Hanlin Academician Gui Congjing was made Minister of Works.",
    idiomatic: "Eighth month: Gui Congjing became Works minister.",
  },
  s0200: {
    literal: "On jiawu Drafting Attendant Zheng Yu was made Secretariat Drafter.",
    idiomatic: "On jiawu Zheng Yu became a drafter.",
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
