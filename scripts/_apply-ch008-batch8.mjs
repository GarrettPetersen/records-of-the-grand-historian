#!/usr/bin/env node
/** Batch 8: s0701–s0747 (Jiutangshu ch.008, Xuanzong — transport, Zhang Shougui, council shuffle) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0701: {
    literal: 'On jiashen he sent Chancellor Zhang Jiuling as Henan Commissioner for Opening Paddy Fields.',
    idiomatic: 'On jiashen Zhang Jiuling became Henan paddy commissioner.',
  },
  s0702: {
    literal: 'In the eighth month, earlier when the imperial carriage had reached the Eastern Capital, Attendant-in-Chief Pei Yaoqing had been made commissioner for Jiang-Huai and Henan transport, with a transshipment depot at the river mouth.',
    idiomatic: 'In the eighth month: when the court had moved east, Pei Yaoqing became Jiang-Huai and Henan transport commissioner and built a depot at the river mouth.',
  },
  s0703: {
    literal: 'On renyin Heyin County was established east of the transshipment depot.',
    idiomatic: 'On renyin Heyin county was founded east of the depot.',
  },
  s0704: {
    literal: 'Zhang Jiuling was also sent to establish water colonies in Xu, Yu, Chen, Bo, and other prefectures.',
    idiomatic: 'Zhang Jiuling also opened water farms in Xu, Yu, Chen, Bo, and the like.',
  },
  s0705: {
    literal: 'In the ninth month on renshen Raole Protectorate was renamed Fengcheng Protectorate.',
    idiomatic: 'On renshen Raole became Fengcheng Protectorate.',
  },
  s0706: {
    literal: 'On xinsi the Pinghai Army of Dengzhou was moved to a post at the seaport.',
    idiomatic: 'On xinsi Dengzhou’s Pinghai Army shifted to the harbor mouth.',
  },
  s0707: {
    literal: 'In the tenth month of winter on jiachen Acting Minister of Agriculture Chen Siwen was exiled to Rang for graft.',
    idiomatic: 'On jiachen Chen Siwen, acting agriculture minister, was exiled for corruption.',
  },
  s0708: {
    literal: 'On the wuzi new moon of the twelfth month there was an eclipse of the sun.',
    idiomatic: 'The twelfth-month wuzi new moon brought a solar eclipse.',
  },
  s0709: {
    literal: 'On yisi Youzhou chief administrator Zhang Shougui led troops against the Khitan, beheading their king Qulie and the minister Ketugan in battle; heads were sent to the Eastern Capital; the rebel Xi scattered into the hills.',
    idiomatic: 'On yisi Zhang Shougui slew Khitan king Qulie and Ketugan in battle and sent their heads east; rebel Xi fled the valleys.',
  },
  s0710: {
    literal: 'Their chieftain Li Guozhe was installed as king of the Khitan.',
    idiomatic: 'Li Guozhe was made Khitan king.',
  },
  s0711: {
    literal: 'That year the Türk qaghan Bilge died.',
    idiomatic: 'That year Türk qaghan Bilge died.',
  },
  s0712: {
    literal: 'Begging in the capital was forbidden.',
    idiomatic: 'Capital begging was banned.',
  },
  s0713: {
    literal: 'In the first year of Kaiyuan 23, in spring, on the jihai day, he personally plowed the sacred field; the emperor added up to nine furrows and stopped; ministers and below finished the acre.',
    idiomatic: 'Kaiyuan 23’s spring plowing saw the emperor push nine furrows, then ministers finish the field.',
  },
  s0714: {
    literal: 'A great amnesty for all under Heaven.',
    idiomatic: 'The realm was amnestied.',
  },
  s0715: {
    literal: 'Capital civil and military officers and investigation commissioners of third rank and below each gained one noble rank; fourth rank and below gained one office rank; outer officials one merit turn.',
    idiomatic: 'Capital officers to third rank rose a noble grade; to fourth rank an office step; outer officers a merit turn.',
  },
  s0716: {
    literal: 'Those with hegemonic strategy, learning that plumbs heaven and man, or talent for command and magistracy were to be nominated one each by fifth-rank pure officials and prefects.',
    idiomatic: 'Men of grand strategy, cosmic learning, or command were to be nominated by fifth-rank officers and prefects.',
  },
  s0717: {
    literal: 'Retired officers were given posts as suited, as in former retirements.',
    idiomatic: 'Retirees were reappointed where fitting, as before.',
  },
  s0718: {
    literal: 'Feasting was granted for three days.',
    idiomatic: 'Three days of feasting were proclaimed.',
  },
  s0719: {
    literal: 'In the third month on dingmao Palace Attending Censor Yang Wanqing was killed by a personal enemy.',
    idiomatic: 'On dingmao Palace Censor Yang Wanqing was murdered by a foe.',
  },
  s0720: {
    literal: 'In summer, the fifth month, on wuyin, imperial clansmen asked to pool monthly stipends to build the Dragon Pool at Xingqing Palace and presented a “Ode to Sagely Virtue.”',
    idiomatic: 'On wuyin of the fifth month clansmen pooled stipends for Xingqing’s Dragon Pool and offered an ode to sagely virtue.',
  },
  s0721: {
    literal: 'In the seventh month on bingzi the crown prince Hong was renamed Ying; fourteen princes from Prince Qing Zhi downward were also renamed.',
    idiomatic: 'On bingzi the heir Hong became Ying and fourteen younger princes took new names.',
  },
  s0722: {
    literal: 'Princes were further enfeoffed: Min as Prince of Yi, Gui as Prince of Chen, Gong as Prince of Feng, Qi as Prince of Heng, Xuan as Prince of Liang, Jin as Prince of Bian.',
    idiomatic: 'Six more princes were enfeoffed—Yi, Chen, Feng, Heng, Liang, and Bian among them.',
  },
  s0723: {
    literal: 'Princes from Rong Wang Wan downward each opened a mansion with staff and received two thousand households in substantive fief.',
    idiomatic: 'From Prince Rong Wan down, each opened a household staff and drew a two-thousand-household fief.',
  },
  s0724: {
    literal: 'In the eighth month on wuzi an edict: widowers, widows, orphans, and the childless were exempted from half this year’s land tax; south of the Yangtze where flood had struck, circuit commissioners were to relieve.',
    idiomatic: 'On wuzi the lonely and childless paid half the land tax; flooded south-Yangtze circuits were told to relieve.',
  },
  s0725: {
    literal: 'In the ninth month on wushen Sizhou was moved to seat at Linhuai County.',
    idiomatic: 'On wushen Sizhou’s seat shifted to Linhuai.',
  },
  s0726: {
    literal: 'In the tenth month of winter on xinhai Yixi and Beiting protectors were placed under the Four Garrisons command.',
    idiomatic: 'On xinhai Yixi and Beiting passed to the Four Garrisons command.',
  },
  s0727: {
    literal: 'Turgesh raided Beiting and the Anxi protectorate’s Boluo city.',
    idiomatic: 'Turgesh struck Beiting and Anxi’s Boluo.',
  },
  s0728: {
    literal: 'On the renshen new moon of the eleventh month there was an eclipse of the sun.',
    idiomatic: 'The eleventh-month renshen new moon brought a solar eclipse.',
  },
  s0729: {
    literal: 'In the twelfth month Silla sent envoys with tribute.',
    idiomatic: 'In the twelfth month Silla presented tribute.',
  },
  s0730: {
    literal: 'In the first year of Kaiyuan 24, in spring, the first month, Tibet sent envoys with tribute.',
    idiomatic: 'Kaiyuan 24 opened with Tibetan tribute.',
  },
  s0731: {
    literal: 'Protector-General of Beiting Gai Jiayun led troops against Turgesh and defeated them.',
    idiomatic: 'Gai Jiayun of Beiting broke Turgesh.',
  },
  s0732: {
    literal: 'In the third month on yiwei examination graduates were first transferred from the Directorate of Personnel Evaluation to the Vice Minister of Rites.',
    idiomatic: 'On yiwei civil graduates passed from Personnel Evaluation to the Vice Minister of Rites.',
  },
  s0733: {
    literal: 'In summer, the sixth month, on bingwu, sorcerer Liu Zhicheng of Liquan in Jingzhao led a mob in revolt and marched on the capital; Xianyang officials burned Bian Bridge to cut them off; soon they scattered; the metropolitan prefecture captured and beheaded them all.',
    idiomatic: 'On bingwu Liu Zhicheng of Liquan rose toward the capital; Xianyang burned Bian Bridge; the rebels scattered and Jingzhao executed them all.',
  },
  s0734: {
    literal: 'That summer was fiercely hot; on the roads men died of heatstroke.',
    idiomatic: 'The summer scorched; travelers dropped dead of heat.',
  },
  s0735: {
    literal: 'In the seventh month on gengzi Grand Protector of the Heir Lu Xiangxian died.',
    idiomatic: 'On gengzi the heir’s protector Lu Xiangxian died.',
  },
  s0736: {
    literal: 'On xinchou Li Linfu became Minister of War and still managed state affairs.',
    idiomatic: 'On xinchou Li Linfu took War and kept the council.',
  },
  s0737: {
    literal: 'On jisi the Longevity Star Altar was first established, sacrificing to the Old Man Star and the seven lodges Jiao, Kang, and others.',
    idiomatic: 'On jisi the Longevity Star altar was founded for the Old Man and seven lodges including Jiao and Kang.',
  },
  s0738: {
    literal: 'On the wushen new moon of the eighth month mourning for a mother’s brother was raised to xiaogong, for a mother’s brother’s wife to zimam, and for a father’s younger brother’s son to tanmian.',
    idiomatic: 'The eighth-month wushen new moon deepened mourning for uncles by blood and marriage.',
  },
  s0739: {
    literal: 'On jihai Prince Shen of the Deep, Tao, died; in the ninth month on renwu the Directorate of Titles was renamed Directorate of Enfeoffments.',
    idiomatic: 'On jihai Prince Shen Tao died; in the ninth month the Titles office became Enfeoffments.',
  },
  s0740: {
    literal: 'In the tenth month of winter on wushen the imperial carriage left the Eastern Capital and returned to the Western Capital.',
    idiomatic: 'On wushen the court quit the Eastern Capital for the west.',
  },
  s0741: {
    literal: 'On jiazi he reached Huazhou and granted a partial amnesty to prisoners at the traveling palace.',
    idiomatic: 'At Huazhou on jiazi he amnestied prisoners on tour.',
  },
  s0742: {
    literal: 'On dingchou he returned from the Eastern Capital.',
    idiomatic: 'On dingchou he came back from the east.',
  },
  s0743: {
    literal: 'In the eleventh month on renyin Attendant-in-Chief Pei Yaoqing became Left Chancellor; Chancellor Zhang Jiuling became Right Chancellor; both left the council.',
    idiomatic: 'On renyin Pei Yaoqing became Left Chancellor and Zhang Jiuling Right; both left the council.',
  },
  s0744: {
    literal: 'War Minister Li Linfu also became Chancellor of the Secretariat; Palace Director Niu Xianke became War Minister and third-rank council equal.',
    idiomatic: 'Li Linfu doubled as chancellor; Niu Xianke joined the council as War Minister.',
  },
  s0745: {
    literal: 'Right Chancellor Xiao Song became Grand Tutor of the Heir; Works Minister Han Xiu became Junior Tutor of the Heir.',
    idiomatic: 'Xiao Song tutored the heir; Han Xiu became junior tutor.',
  },
  s0746: {
    literal: 'In the twelfth month on wushen Grand Tutor of the Heir, Prince Qing Zong, became Grand Mentor.',
    idiomatic: 'On wushen Prince Qing Zong became Grand Mentor.',
  },
  s0747: {
    literal: 'On bingyin Niu Xianke managed Chancellery affairs.',
    idiomatic: 'On bingyin Niu Xianke took charge of the Chancellery.',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/008.json';
const TRANS_PATH = 'translations/current_translation_jiutangshu.json';
const START = 701;
const END = 747;

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

const chapterPath = CHAPTER_PATH;
let trans = JSON.parse(readFileSync(TRANS_PATH, 'utf8'));
if (trans.metadata.chapter !== '008') {
  throw new Error(`Expected chapter 008, got ${trans.metadata.chapter}`);
}

const expectedIds = new Set(
  Array.from({ length: END - START + 1 }, (_, i) => `s${String(START + i).padStart(4, '0')}`)
);

for (const id of expectedIds) {
  if (!T[id]) throw new Error(`Missing translation for ${id}`);
}

const byOriginal = new Map(trans.sentences.map((s) => [s.originalId || s.id, s]));

for (const id of expectedIds) {
  if (!byOriginal.has(id)) {
    const extracted = extractRange(chapterPath, START, END).find((s) => s.originalId === id);
    if (!extracted) throw new Error(`Missing ${id} in ${chapterPath}`);
    trans.sentences.push(extracted);
    byOriginal.set(id, extracted);
  }
}

trans.sentences.sort(
  (a, b) =>
    parseInt((a.originalId || a.id).slice(1), 10) -
    parseInt((b.originalId || b.id).slice(1), 10)
);

let applied = 0;
for (const s of trans.sentences) {
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

const missing = [...expectedIds].filter((id) => {
  const row = trans.sentences.find((s) => (s.originalId || s.id) === id);
  return !row || !row.idiomatic;
});
if (missing.length) {
  throw new Error(`Missing translations for: ${missing.join(', ')}`);
}
if (applied !== Object.keys(T).length) {
  throw new Error(`Applied ${applied}, expected ${Object.keys(T).length}`);
}

writeFileSync(TRANS_PATH, JSON.stringify(trans, null, 2) + '\n');
console.log(`Applied ${applied} translations (s${String(START).padStart(4, '0')}–s${String(END).padStart(4, '0')})`);

