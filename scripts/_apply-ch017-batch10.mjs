#!/usr/bin/env node
/** Batch 10: s0901–s1000 (Jiutangshu ch.017, Jingzong, Wenzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/017.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 901;
const END = 1000;

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
  s0901: {
    literal: 'Bowing the body in evening vigil, We are deeply grieved."',
    idiomatic: '"I grieve in evening vigil."',
  },
  s0902: {
    literal: 'The ministers submitted memorials requesting honorific titles.',
    idiomatic: 'Ministers requested honorific titles.',
  },
  s0903: {
    literal: 'On jiayin retired Grand Mentor Xue Ping died.',
    idiomatic: 'On jiayin Xue Ping died.',
  },
  s0904: {
    literal: 'Second month, jiazi new moon: former Yichang military commissioner Yin You was made acting Minister of Personnel and Tianping military commissioner, replacing Linghu Chu;',
    idiomatic: 'On jiazi Yin You replaced Linghu Chu at Tianping;',
  },
  s0905: {
    literal: 'Chu was made acting Right Vice Director, Taiyuan prefect, northern-capital regent, and Hedong military commissioner.',
    idiomatic: 'Linghu Chu took Hedong.',
  },
  s0906: {
    literal: 'On wuyin Su and Hu two prefectures flooded; two hundred twenty thousand shi of grain relief-granted.',
    idiomatic: 'On wuyin Su and Hu received two hundred twenty thousand shi of relief.',
  },
  s0907: {
    literal: 'Given from each prefecture\'s Ever-Normal and charity granary dou.',
    idiomatic: 'Relief came from local Ever-Normal stores.',
  },
  s0908: {
    literal: 'On gengchen Minister of Revenue and revenue commissioner Wang Qi requested establishing garrison-farm offices at Binning and Lingwu; assented.',
    idiomatic: 'On gengchen Wang Qi won garrison farms at Binning and Lingwu.',
  },
  s0909: {
    literal: 'On jichou Cold Food festival the Emperor feasted ministers at Linde Hall.',
    idiomatic: 'On jichou Wenzong feasted ministers at Linde on Cold Food.',
  },
  s0910: {
    literal: 'That day variety players performed Confucius; the Emperor said: "Confucius is teacher of antiquity and today — how may he be insulted."',
    idiomatic: 'Wenzong expelled players who mocked Confucius.',
  },
  s0911: {
    literal: 'Immediately ordered them driven out.',
    idiomatic: 'The players were driven out at once.',
  },
  s0912: {
    literal: 'Third month, jiawu new moon.',
    idiomatic: 'The third month opened on jiawu.',
  },
  s0913: {
    literal: 'On xinchou Wuning military commissioner, acting Grand Mentor, Grand Councillor Wang Zhixing was also Palace Companion and Zhongwu military commissioner and Chen-Xu-Cai observer.',
    idiomatic: 'On xinchou Wang Zhixing took Zhongwu from Wuning.',
  },
  s0914: {
    literal: 'Binning military commissioner Li Ting was made Wuning military commissioner and Xu-Si-Hao observer;',
    idiomatic: 'Li Ting took Wuning;',
  },
  s0915: {
    literal: 'Gold Crow guard great general Meng Youliang was made Binning military commissioner.',
    idiomatic: 'Meng Youliang took Binning.',
  },
  s0916: {
    literal: 'Former Hedong military commissioner Liu Gongchuo was made Minister of War.',
    idiomatic: 'Liu Gongchuo took War.',
  },
  s0917: {
    literal: 'On xinyou former Zhongwu military commissioner Gao Yu was made acting Right Vice Director and Wuning military commissioner.',
    idiomatic: 'On xinyou Gao Yu took Wuning.',
  },
  s0918: {
    literal: 'Summer, fourth month, guihai new moon.',
    idiomatic: 'The fourth month opened on guihai.',
  },
  s0919: {
    literal: 'On yichou Minister of War Liu Gongchuo died.',
    idiomatic: 'On yichou Liu Gongchuo died.',
  },
  s0920: {
    literal: 'On wuyin the newly appointed Wuning military commissioner Li Ting was made heir-apparent Grand Mentor.',
    idiomatic: 'On wuyin Li Ting became grand mentor.',
  },
  s0921: {
    literal: 'Fifth month, guisi new moon.',
    idiomatic: 'The fifth month opened on guisi.',
  },
  s0922: {
    literal: 'On jiachen western Sichuan repaired Qionglai Pass city and also moved Juan prefecture to Taideng city.',
    idiomatic: 'On jiachen Shu repaired Qionglai and moved Juan.',
  },
  s0923: {
    literal: 'On renzi Zhexi\'s Ding Gongzhu memorialized plague in eight Hangzhou counties; seventy thousand shi of grain relief-granted.',
    idiomatic: 'On renzi Hangzhou plague brought seventy thousand shi of relief.',
  },
  s0924: {
    literal: 'On dingsi Salt prefect Wang Yanping was made acting Left Palace Companion, Censor-in-Chief, and Ling-Yan military commissioner.',
    idiomatic: 'On dingsi Wang Yanping took Ling-Yan.',
  },
  s0925: {
    literal: 'On jiwei Xingping commoner Shangguan Xing, drunk, killed a man and fled; officials imprisoned his father; Xing returned to await punishment.',
    idiomatic: 'Shangguan Xing surrendered after his father was jailed.',
  },
  s0926: {
    literal: 'Jingzhao prefect Du Ti and Censor-in-Chief Yuwen Ding held that Xing\'s surrender spared his father\'s imprisonment and his filial piety could be rewarded — requesting exemption from death.',
    idiomatic: 'Du Ti and Yuwen Ding pleaded filial piety for Shangguan Xing.',
  },
  s0927: {
    literal: 'An edict ordered both offices to debate; all said killers die — ancient and modern alike — Xing cannot be spared.',
    idiomatic: 'Both offices said murder still demands death.',
  },
  s0928: {
    literal: 'The Emperor finally followed Du Ti and others and spared death, sentenced eighty strokes, and exiled to Ling prefecture.',
    idiomatic: 'Wenzong spared Xing\'s life but exiled him after eighty strokes.',
  },
  s0929: {
    literal: 'On gengshen an edict: "We hear that in the circuits flood and drought harm people and plague follows — from night to night We blame Ourselves and rise from sleep with anxious heart.',
    idiomatic: 'On gengshen Wenzong proclaimed a plague edict:',
  },
  s0930: {
    literal: 'Now chief officials memorialize and the wounds are still severe.',
    idiomatic: '"Wounds remain severe across the realm."',
  },
  s0931: {
    literal: 'Surely teaching has not moved the masses and sincerity has not reached heaven and earth, or laws miss and officials do wrong.',
    idiomatic: '"Teaching and sincerity have failed; officials err."',
  },
  s0932: {
    literal: 'Having one of these harms harmony.',
    idiomatic: '"Each fault harms harmony."',
  },
  s0933: {
    literal: 'Charge inner and outer officials each to memorialize what they have seen and heard; We shall personally review and do not fear blunt speech.',
    idiomatic: '"Memorialize bluntly — I shall read all."',
  },
  s0934: {
    literal: 'Households where plague wiped out the whole family — the state supplies funeral goods.',
    idiomatic: '"Whole families lost to plague receive funeral goods."',
  },
  s0935: {
    literal: 'The rest receive tax-money reduction according to how many in the household suffered plague.',
    idiomatic: '"Others receive tax relief by household toll."',
  },
  s0936: {
    literal: 'Where plague is not yet settled, the state supplies medicine.',
    idiomatic: '"Unsettled plague districts receive medicine."',
  },
  s0937: {
    literal: 'The circuits already have relief grants yet state expense may not suffice — palace supplies and public uses should be reduced as appropriate to save famine.',
    idiomatic: '"Cut palace and public expense to fund relief."',
  },
  s0938: {
    literal: 'Sixth month, renxu new moon.',
    idiomatic: 'The sixth month opened on renxu.',
  },
  s0939: {
    literal: 'On bingyin Jingzhao prefect Du Ti was also Censor-in-Chief.',
    idiomatic: 'On bingyin Du Ti gained the censorate.',
  },
  s0940: {
    literal: 'On wuyin Right Vice Director Wang Ya received an edict to follow statute articles regulating commoners\' dress, carriages, and mansions.',
    idiomatic: 'On wuyin Wang Ya issued sumptuary rules.',
  },
  s0941: {
    literal: 'After the edict descended.',
    idiomatic: 'After the edict issued,',
  },
  s0942: {
    literal: 'public talk boiled.',
    idiomatic: 'Public outrage spread through the capital.',
  },
  s0943: {
    literal: 'Du Ti within the edict\'s articles widened limits on what was easy to enforce; in the end it was not carried out — public opinion regretted it.',
    idiomatic: 'Du Ti softened the rules until they failed — to public regret.',
  },
  s0944: {
    literal: 'Autumn, seventh month, xinmao new moon.',
    idiomatic: 'The seventh month opened on xinmao.',
  },
  s0945: {
    literal: 'On jiawu Remonstrance official Wang Yanwei, Personnel Bureau director Yang Hangong, Sacrifices Bureau outer-section director Su Di, and Right Supplementation Remonstrator Pei Xiu were all made Historiography Office compilers.',
    idiomatic: 'On jiawu four historians were appointed — an unusual number.',
  },
  s0946: {
    literal: 'By precedent historians did not exceed three, sometimes only two; now four were appointed together — critics objected.',
    idiomatic: 'Four historians at once drew criticism.',
  },
  s0947: {
    literal: 'On wushen Prince of Yuan Wang Kui died.',
    idiomatic: 'On wushen Prince Kui died.',
  },
  s0948: {
    literal: 'On guichou former Lingwu military commissioner Li Wenyue was made Yan-Hai-Yi-Mi military commissioner.',
    idiomatic: 'On guichou Li Wenyue took Yan-Hai-Yi-Mi.',
  },
  s0949: {
    literal: 'On jiwei Hezhong military commissioner Li Cheng was made Left Vice Director;',
    idiomatic: 'On jiwei Li Cheng became left vice director;',
  },
  s0950: {
    literal: 'Minister of Revenue and revenue commissioner Wang Qi was made acting Minister of Personnel and Hezhong-Jin-Ci military commissioner;',
    idiomatic: 'Wang Qi took Hezhong;',
  },
  s0951: {
    literal: 'Censor-in-Chief and concurrent Vice Punishments director Yuwen Ding was made Vice Minister of Revenue and revenue commissioner.',
    idiomatic: 'Yuwen Ding took Revenue.',
  },
  s0952: {
    literal: 'Eighth month, xinyou new moon: Minister of Personnel Cui Qun died.',
    idiomatic: 'The eighth month opened as Cui Qun died.',
  },
  s0953: {
    literal: 'Director of Carriages and edict drafter Li Han was made Censor-in-Chief.',
    idiomatic: 'Li Han became censor-in-chief.',
  },
  s0954: {
    literal: 'On yichou Right Vice Director and acting Sacrifices director Wang Fan was made acting Minister of Rites, Run prefect, and Zhexi observation commissioner.',
    idiomatic: 'On yichou Wang Fan took Zhexi.',
  },
  s0955: {
    literal: 'On gengwu Shannan East military commissioner Pei Du came to court.',
    idiomatic: 'On gengwu Pei Du came to court.',
  },
  s0956: {
    literal: 'On renshen former Zhexi observation commissioner Ding Gongzhu was made Director of Sacrifices.',
    idiomatic: 'On renshen Ding Gongzhu took Sacrifices.',
  },
  s0957: {
    literal: 'On jiaxu Censor-in-Chief Li Han memorialized on vice director audience ritual — improper to receive bows from officials fourth rank and below.',
    idiomatic: 'On jiaxu Li Han protested Li Cheng receiving lower officials\' bows.',
  },
  s0958: {
    literal: 'At the time Left Vice Director Li Cheng was about to attend the ministry.',
    idiomatic: 'Li Cheng was entering the ministry that day.',
  },
  s0959: {
    literal: 'An edict said: "Vice director audience ritual recently fixed follows statute text already in force and should not be changed — follow the Dade 4 eleventh-month sixteenth-day edict."',
    idiomatic: 'An edict upheld the Dade 4 bowing rule.',
  },
  s0960: {
    literal: 'The edict closed with the closing bracket.',
    idiomatic: 'Thus closed the bowing-rule debate.',
  },
  s0961: {
    literal: 'Ninth month, gengyin new moon: Zi-Qing first fixed two-tax quotas — five prefectures, one hundred ninety-three thousand nine hundred eighty-nine strings — from then Zi-Qing had court tribute.',
    idiomatic: 'On gengyin Zi-Qing gained its first regular tax tribute.',
  },
  s0962: {
    literal: 'On gengzi Acting Grand Mentor Zhao Zongru remained acting Minister of Works and retired.',
    idiomatic: 'On gengzi Zhao Zongru retired.',
  },
  s0963: {
    literal: 'On xinchou Zhuo prefecture established Xincheng county — ancient Jugang land.',
    idiomatic: 'On xinchou Xincheng county was founded at Zhuo.',
  },
  s0964: {
    literal: 'On dingwei Director of Sacrifices Ding Gongzhu died.',
    idiomatic: 'On dingwei Ding Gongzhu died.',
  },
  s0965: {
    literal: 'On gengxu retired Minister of Works Zhao Zongru died.',
    idiomatic: 'On gengxu Zhao Zongru died.',
  },
  s0966: {
    literal: 'On renzi Right Gold Crow guard general Shi Xiaozhang was made Yan-Fang-Dan-Yan military commissioner.',
    idiomatic: 'On renzi Shi Xiaozhang took Yan-Fang.',
  },
  s0967: {
    literal: 'Winter, tenth month, gengzi new moon.',
    idiomatic: 'The tenth month opened on gengzi.',
  },
  s0968: {
    literal: 'On jiazi an edict: the Prince of Lu Yong should be enfeoffed crown prince.',
    idiomatic: 'On jiazi Prince Yong became crown prince.',
  },
  s0969: {
    literal: 'On renwu Left Gold Crow guard general Li Changyan was made acting Left Palace Companion and Xia-Sui-Yin-You military commissioner.',
    idiomatic: 'On renwu Li Changyan took Xia.',
  },
  s0970: {
    literal: 'On jiashen Remonstrance official Wang Yanwei was made Hezhong vice prefect for arguing the Shangguan Xing case too captiously.',
    idiomatic: 'On jiashen Wang Yanwei was punished for the Xing case.',
  },
  s0971: {
    literal: 'Eleventh month, jichou new moon.',
    idiomatic: 'The eleventh month opened on jichou.',
  },
  s0972: {
    literal: 'On dingwei Huainan military commissioner and acting Right Vice Director Cui Cong died.',
    idiomatic: 'On dingwei Cui Cong died.',
  },
  s0973: {
    literal: 'On yimao Jingnan military commissioner Duan Wenchang was made western Sichuan military commissioner.',
    idiomatic: 'On yimao Duan Wenchang took western Sichuan.',
  },
  s0974: {
    literal: 'Still acting Left Vice Director and Grand Councillor.',
    idiomatic: 'He kept council rank.',
  },
  s0975: {
    literal: 'Twelfth month, jiwei new moon.',
    idiomatic: 'The twelfth month opened on jiwei.',
  },
  s0976: {
    literal: 'On yichou Secretariat Vice Director and Grand Councillor Niu Sengru was made acting Right Vice Director, Grand Councillor, Yangzhou metropolitan prefect, and Huainan military commissioner.',
    idiomatic: 'On yichou Niu Sengru took Huainan.',
  },
  s0977: {
    literal: 'On wuchen inner trainer Wang Zongyu returned from a Bohai mission, reporting Bohai established left and right Divine Strategy military affairs and left and right three armies totaling one hundred twenty offices, presenting diagrams.',
    idiomatic: 'On wuchen a Bohai envoy reported their army organization.',
  },
  s0978: {
    literal: 'Right Vice Director Cui Guan was made Jiangling prefect and Jingnan regent-observer.',
    idiomatic: 'Cui Guan took Jingnan.',
  },
  s0979: {
    literal: 'Prince of Zhen Wang Shen died.',
    idiomatic: 'Prince Shen died.',
  },
  s0980: {
    literal: 'On yihai Zhaoyi military commissioner Liu Congjian came to court.',
    idiomatic: 'On yihai Liu Congjian came to court.',
  },
  s0981: {
    literal: 'On dingwei former western Sichuan military commissioner Li Deyu was made Minister of War.',
    idiomatic: 'On dingwei Li Deyu took War.',
  },
  s0982: {
    literal: 'Demoted Xun registrar Du Yuanying died; posthumously made Hu prefect.',
    idiomatic: 'Du Yuanying died in exile and was posthumously honored.',
  },
  s0983: {
    literal: 'Dade 7, spring, first month, yichou new moon: held audience at Hanyuan Hall receiving congratulations.',
    idiomatic: 'Dade 7 restored New Year audience at Hanyuan.',
  },
  s0984: {
    literal: 'In recent years because of arms and rain-snow the New Year audience ritual was not performed.',
    idiomatic: 'Years of war and snow had canceled New Year rites.',
  },
  s0985: {
    literal: 'By precedent Wu and Shu presented new tea, all made in mid-winter by method; the Emperor pursued respectful thrift and did not wish to go against the thing\'s nature — an edict ordered new tea presented after Beginning of Spring.',
    idiomatic: 'New tea tribute was ordered after Beginning of Spring.',
  },
  s0986: {
    literal: 'On jiawu Liu Congjian was advanced to Grand Councillor.',
    idiomatic: 'On jiawu Liu Congjian joined the council.',
  },
  s0987: {
    literal: 'Xiang prefecture\'s Pei Du memorialized requesting abolition of Linhan stud farm; assented.',
    idiomatic: 'Pei Du abolished Linhan stud farm.',
  },
  s0988: {
    literal: 'This stud was established in Yuanhe 14 with three thousand two hundred horses, occupying more than four hundred qing of commoners\' fields — abolition was convenient.',
    idiomatic: 'Linhan had seized four hundred qing from farmers since Yuanhe 14.',
  },
  s0989: {
    literal: 'On yihai Acting Court of Imperial Treasury director Cui Gong was made Guang prefect and Lingnan military commissioner.',
    idiomatic: 'On yihai Cui Gong took Lingnan.',
  },
  s0990: {
    literal: 'On renzi an edict: "We receive heaven\'s favor and bear the former sages\' great design; from night to night We labor and dare not rest, thinking to bring peace — eight years now.',
    idiomatic: 'On renzi Wenzong proclaimed an eight-year famine edict:',
  },
  s0991: {
    literal: 'Yet flood and drought run, plague and bale arise, the masses lack food, wounds continue.',
    idiomatic: '"Floods, drought, and plague still wound the people."',
  },
  s0992: {
    literal: 'Surely virtue has not moved heaven and sincerity has not touched things — one kind losing its place, the fault lies in Us.',
    idiomatic: '"The fault is mine alone."',
  },
  s0993: {
    literal: 'We carry a heart of blaming Ourselves and deeply sigh at the drowning moat.',
    idiomatic: '"I blame myself and sigh for the people."',
  },
  s0994: {
    literal: 'We hear that Guanji and Hedong last year suffered great drought and autumn crops did not ripen; now at spring plowing farm work is urgent — if not relief-granted, We fear exile.',
    idiomatic: '"Guanji and Hedong need grain or face exile."',
  },
  s0995: {
    literal: 'Jingzhao one hundred thousand shi, Henan, Hezhong, and Jiang each seventy thousand shi, Tong, Hua, Shan, Guo, Jin each one hundred thousand shi — all from Ever-Normal and charity granary goods.',
    idiomatic: 'Massive Ever-Normal grain grants were ordered across the north.',
  },
  s0996: {
    literal: 'The newly appointed Lingnan military commissioner Cui Gong was made acting Minister of Works and Wuning military commissioner;',
    idiomatic: 'Cui Gong was shifted to Wuning;',
  },
  s0997: {
    literal: 'Right Gold Crow guard general Wang Maoyuan was made Lingnan military commissioner.',
    idiomatic: 'Wang Maoyuan took Lingnan.',
  },
  s0998: {
    literal: 'Former Wuning military commissioner Gao Yu was made Minister of Punishments.',
    idiomatic: 'Gao Yu took Punishments.',
  },
  s0999: {
    literal: 'Lingnan five commissions and Qianzhong selection-supplement envoys should temporarily cease one or two years.',
    idiomatic: 'Lingnan appointment tours were suspended one or two years.',
  },
  s1000: {
    literal: 'Second month, jiwei new moon.',
    idiomatic: 'The second month opened on jiwei.',
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
if (data.metadata.chapter !== '017') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 016; standalone T ready (${Object.keys(T).length} entries).`
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
