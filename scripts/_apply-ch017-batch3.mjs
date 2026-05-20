#!/usr/bin/env node
/** Batch 3: s0201–s0300 (Jiutangshu ch.017, Jingzong, Wenzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/017.json';
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
    literal: 'On dingmao the Hunan observation commissioner Shen Chuanshi memorialized: "This circuit\'s seventeen persons formerly assigned to Tibet including Luomo, under the amnesty to be sent home, now each petition that they do not wish to return."',
    idiomatic: 'On dingmao Shen Chuanshi reported seventeen Tibet captives who refused repatriation.',
  },
  s0202: {
    literal: 'Thus ended the edict; the throne assented.',
    idiomatic: 'Thus ended the edict.',
  },
  s0203: {
    literal: 'On gengwu Right Gold Crow general Li Wenyu was made Fengzhou prefect and Tiande defense commissioner.',
    idiomatic: 'On gengwu Li Wenyu took Tiande.',
  },
  s0204: {
    literal: 'Annan Li Yuanxi memorialized moving the protectorate to the north bank of the river.',
    idiomatic: 'Li Yuanxi asked to move the Annan protectorate north of the river.',
  },
  s0205: {
    literal: 'Sixth month, renshen new moon.',
    idiomatic: 'The sixth month opened on renshen.',
  },
  s0206: {
    literal: 'On yiyou an edict: princesses and commandery princesses must not present female attendants.',
    idiomatic: 'On yiyou princesses were forbidden to present female servants.',
  },
  s0207: {
    literal: 'On bingxu Director of Palace Construction Zhang Wujun was sent out as Yang prefect — he had committed embezzlement.',
    idiomatic: 'On bingxu Zhang Wujun was exiled for embezzlement.',
  },
  s0208: {
    literal: 'Three hundred nine white-body clerks of various offices including Feng Zhimou were all granted salaries.',
    idiomatic: 'Three hundred nine clerks without rank received salaries.',
  },
  s0209: {
    literal: 'On dinghai palace officer Tian Wufeng was ordered to lead twelve imperial carriages of gifts to the Uighur khan and Princess Taihe.',
    idiomatic: 'On dinghai Tian Wufeng bore gifts to the Uighur khan and Princess Taihe.',
  },
  s0210: {
    literal: 'On jichou the Hezhong military commissioner, acting Minister of Works Li Yuan died.',
    idiomatic: 'On jichou Li Yuan died at Hezhong.',
  },
  s0211: {
    literal: 'On yiwei acting Left Vice Premier and concurrent Minister of Revenue Xue Ping was made acting Minister of Works, Hezhong prefect, and Hezhong military commissioner.',
    idiomatic: 'On yiwei Xue Ping took Hezhong.',
  },
  s0212: {
    literal: 'Autumn, seventh month, guimao new moon: the Zhongwu military commissioner, acting Minister of Education Li Guangyan was made Taiyuan prefect, northern capital regent, and Hedong military commissioner; the Yan-Hai military commissioner Wang Pei was made Xu prefect and Zhongwu military commissioner.',
    idiomatic: 'On guimao Li Guangyan went to Hedong and Wang Pei to Zhongwu.',
  },
  s0213: {
    literal: 'The Sparkling One transgressed the Right Enforcer.',
    idiomatic: 'Mars crossed the Right Enforcer.',
  },
  s0214: {
    literal: 'On jiachen the salt commissioner Wang Bo presented surplus revenue; public opinion wanted to beat drums and attack him.',
    idiomatic: 'On jiachen Wang Bo\'s surplus tribute stirred calls for public punishment.',
  },
  s0215: {
    literal: 'On yiyou Bian-Fang floods destroyed houses.',
    idiomatic: 'On yiyou Bian-Fang floods wrecked homes.',
  },
  s0216: {
    literal: 'On guichou Right Gold Crow great general Zhang Maozong was made Yan-Hai-Yi-Mi military commissioner.',
    idiomatic: 'On guichou Zhang Maozong took Yan-Hai.',
  },
  s0217: {
    literal: 'On jiayin at regular court envoys installed Minister of Education Li Guangyan.',
    idiomatic: 'On jiayin Li Guangyan was formally installed.',
  },
  s0218: {
    literal: 'On yimao the Prince of Zi\'s tutor, eastern-capital assignee Yuan Xi died.',
    idiomatic: 'On yimao Yuan Xi died.',
  },
  s0219: {
    literal: 'On wuwu an edict ordered Wang Bo to build twenty racing boats for presentation, using timber from within the capital.',
    idiomatic: 'On wuwu Wang Bo was told to build twenty tribute boats in the capital.',
  },
  s0220: {
    literal: 'At the time the labor was reckoned equal to half a year\'s transport costs.',
    idiomatic: 'The project would cost half a year of transport funds.',
  },
  s0221: {
    literal: 'Remonstrance official Zhang Zhongfang remonstrated sharply; the presentation was reduced to ten boats.',
    idiomatic: 'Zhang Zhongfang cut the order to ten boats.',
  },
  s0222: {
    literal: 'On xinyou Wannian county clerk Jia Zhen falsely accused the late commander Wang Dian\'s son Zhengmo and six others of plotting rebellion; an edict ordered them beaten to death.',
    idiomatic: 'On xinyou a false plot charge ended in seven beatings to death.',
  },
  s0223: {
    literal: 'On jiazi night the moon transgressed the Net.',
    idiomatic: 'On jiazi night the moon crossed the Net.',
  },
  s0224: {
    literal: 'On yichou lecture academicians Cui Yan and Gao Chong presented ten juan of "Essentials Compiled"; two hundred bolts of brocade were granted.',
    idiomatic: 'On yichou Cui Yan and Gao Chong presented a ten-juan digest and received brocade.',
  },
  s0225: {
    literal: 'On dingmao Vice Minister of Revenue Wei Hao was made Vice Minister of Personnel; Jingzhao prefect Cui Yuanlue was made Vice Minister of Revenue.',
    idiomatic: 'On dingmao Wei Hao took Personnel and Cui Yuanlue Revenue.',
  },
  s0226: {
    literal: 'Fengtian county floods destroyed houses.',
    idiomatic: 'Fengtian floods destroyed homes.',
  },
  s0227: {
    literal: 'On xinwei Left Regular Cavalry Attendant Hu Zheng was made Minister of Revenue and revenue commissioner.',
    idiomatic: 'On xinwei Hu Zheng took Revenue and the accounts.',
  },
  s0228: {
    literal: 'Heir-apparent Guest of Honor, eastern-capital assignee Lu Shimei died.',
    idiomatic: 'Lu Shimei died at Luoyang.',
  },
  s0229: {
    literal: 'Intercalary seventh month, renwu new moon: acting Vice Minister of Works Zheng Tan was made Jingzhao prefect.',
    idiomatic: 'On renwu Zheng Tan took the capital prefecture.',
  },
  s0230: {
    literal: 'On jiashen Reminders Li Han, Shu Yuangao, and Xue Tinglao argued in the side hall: "We see that recent appointments often do not come through the Secretariat but are announced from within; we fear discipline will erode and villains run free — we beg thorough review."',
    idiomatic: 'On jiashen three remonstrators warned against inner-palace appointments bypassing the Secretariat.',
  },
  s0231: {
    literal: 'The Emperor agreed.',
    idiomatic: 'Jingzong accepted the warning.',
  },
  s0232: {
    literal: 'An edict ordered Revenue to supply three thousand jin of copper and one hundred thousand sheets of gold leaf to repair Clear Thought Hall\'s new hall and Ascending Yang Hall murals.',
    idiomatic: 'Revenue was tapped for copper and gold leaf to gild new halls.',
  },
  s0233: {
    literal: 'On bingxu the retired Minister of Revenue Pei Kan died.',
    idiomatic: 'On bingxu Pei Kan died.',
  },
  s0234: {
    literal: 'On wuzi Reminder Lu Yuanfu was made Vice Minister of Works.',
    idiomatic: 'On wuzi Lu Yuanfu took Works.',
  },
  s0235: {
    literal: 'On renchen the former Hedong military commissioner Li Ting was made Yicheng military commissioner.',
    idiomatic: 'On renchen Li Ting took Yicheng.',
  },
  s0236: {
    literal: 'On wuxu Minister of Punishments Duan Wenchang was made Minister of War, still acting as Left Vice Director.',
    idiomatic: 'On wuxu Duan Wenchang took War while keeping the left vice post.',
  },
  s0237: {
    literal: 'Eighth month, xinchou new moon.',
    idiomatic: 'The eighth month opened on xinchou.',
  },
  s0238: {
    literal: 'On wushen the Duke of Zeng Yang Zao\'s son Yuancou inherited the dukedom with three thousand households.',
    idiomatic: 'On wushen Yuancou inherited the Zeng dukedom.',
  },
  s0239: {
    literal: 'Both capitals and Hexi had great harvests; Revenue was ordered to harmonize and discount purchase of two million shi of grain.',
    idiomatic: 'A bumper harvest prompted purchase of two million shi of grain.',
  },
  s0240: {
    literal: 'On yimao night Venus neared the Room.',
    idiomatic: 'On yimao night Venus approached the Room.',
  },
  s0241: {
    literal: 'On wuwu palace envoys were sent to Hunan, Jiangnan, and other circuits and Mount Tiantai to gather drugs.',
    idiomatic: 'On wuwu envoys scoured south China and Tiantai for elixir ingredients.',
  },
  s0242: {
    literal: 'At the time the Daoist Liu Congzheng spoke of long life and lasting vision, asking to search the realm for extraordinary men in hope of spirit drugs.',
    idiomatic: 'Daoist Liu Congzheng promised immortality and launched a nationwide drug hunt.',
  },
  s0243: {
    literal: 'Liu Congzheng was also made Vice Director of the Court of Imperial Entertainments with the style Ascendant Mystery Lord.',
    idiomatic: 'Liu Congzheng became Vice Director of Entertainments as Lord Ascendant Mystery.',
  },
  s0244: {
    literal: 'Autumn, ninth month, xinwei new moon.',
    idiomatic: 'The ninth month opened on xinwei.',
  },
  s0245: {
    literal: 'On dingchou Court of Imperial Sacrifices director Liu Zungu had laborer An Zairong accuse the former Yuan princely mansion chief clerk Wu Zhao of plotting to kill Chief Minister Li Fengji; the three offices were ordered to investigate.',
    idiomatic: 'On dingchou a laborer\'s charge of murder plot against Li Fengji was sent to the three offices.',
  },
  s0246: {
    literal: 'On renwu the Zhaoyi military commissioner Liu Wu died.',
    idiomatic: 'On renwu Liu Wu died.',
  },
  s0247: {
    literal: 'On guiwei night Venus transgressed the Southern Dipper.',
    idiomatic: 'On guiwei night Venus crossed the Southern Dipper.',
  },
  s0248: {
    literal: 'On bingxu night the moon transgressed the Right Enforcer.',
    idiomatic: 'On bingxu night the moon crossed the Right Enforcer.',
  },
  s0249: {
    literal: 'On dingyou Huazhou sudden floods damaged crops.',
    idiomatic: 'On dingyou Huazhou flash floods hurt crops.',
  },
  s0250: {
    literal: 'Xuzhou Wang Zhixing memorialized that great generals Wu Hua and four hundred men plotted rebellion; all were executed.',
    idiomatic: 'Wang Zhixing executed four hundred alleged mutineers at Xuzhou.',
  },
  s0251: {
    literal: 'Tenth month, gengzi new moon: Henan prefect Wang Qi memorialized that those who melted cash to cast Buddha images should be prosecuted as counterfeiters.',
    idiomatic: 'On gengzi Wang Qi equated coin-melting for Buddhas with counterfeiting.',
  },
  s0252: {
    literal: 'On dingsi the Zhenwu military commissioner Zhang Weiqing, because the eastern surrender city stood on the river and its walls had long decayed, moved it south of Suiyuan beacon; now the work was finished.',
    idiomatic: 'On dingsi Zhang Weiqing completed relocating the eastern surrender city.',
  },
  s0253: {
    literal: 'On jiwei the Ya prefect detainee, heir to Prince of Ying Zuo, was made chief of the Prince of Ying\'s mansion, assigned to the eastern capital, and granted gold-purple.',
    idiomatic: 'On jiwei Prince Ying\'s heir Zuo received a Luoyang posting and gold-purple.',
  },
  s0254: {
    literal: 'On renxu night Venus neared the Lament Star.',
    idiomatic: 'On renxu night Venus approached the Lament Star.',
  },
  s0255: {
    literal: 'On jiazi the three offices found the Wu Zhao case true; Wu Zhao and his brother Hui, laborer Zhang Shaoteng, were to be executed by Jingzhao; Heyang military commission secretary Li Zhongyan was exiled to Xiangzhou, Hui to Yazhou, Imperial College master Li She to Kangzhou — all for the Wu Zhao affair.',
    idiomatic: 'On jiazi the plot was judged real; Wu Zhao died and accomplices were exiled.',
  },
  s0256: {
    literal: 'Eleventh month, gengwu new moon.',
    idiomatic: 'The eleventh month opened on gengwu.',
  },
  s0257: {
    literal: 'On xinwei Vice Censor-in-Chief Wang Fan was made Vice Minister of Works; Remonstrance official Dugu Lang was made Vice Censor-in-Chief.',
    idiomatic: 'On xinwei Wang Fan took Works and Dugu Lang the censorate.',
  },
  s0258: {
    literal: 'On guiyou the Earth Star neared the Well.',
    idiomatic: 'On guiyou Saturn approached the Well.',
  },
  s0259: {
    literal: 'On guiwei Palace Attendant Yan Gongsu was made Rongguan frontier commissioner.',
    idiomatic: 'On guiwei Yan Gongsu took Rongguan.',
  },
  s0260: {
    literal: 'That night the moon transgressed the Well.',
    idiomatic: 'The moon crossed the Well that night.',
  },
  s0261: {
    literal: 'On gengyin the carriage visited the hot springs and returned the same day.',
    idiomatic: 'On gengyin a same-day hot-spring excursion.',
  },
  s0262: {
    literal: 'On renchen Vice Minister of Punishments Liu Qichu was made Jingzhao prefect.',
    idiomatic: 'On renchen Liu Qichu took the capital prefecture.',
  },
  s0263: {
    literal: 'On bingshen an edict enfeoffed the prince Pu as Prince of Jin.',
    idiomatic: 'On bingshen Prince Pu became Prince of Jin.',
  },
  s0264: {
    literal: 'On dingyou Vice Minister of Personnel Wei Hao died.',
    idiomatic: 'On dingyou Wei Hao died.',
  },
  s0265: {
    literal: 'Twelfth month, jihai new moon.',
    idiomatic: 'The twelfth month opened on jihai.',
  },
  s0266: {
    literal: 'On xinchou Prince of Jin Pu was made Zhaoyi military vice commissioner;',
    idiomatic: 'On xinchou Prince Pu was named Zhaoyi vice commissioner;',
  },
  s0267: {
    literal: 'Liu Wu\'s son, Director of Palace Construction registrar Congjian was recalled to service as Cloud-Banner general, Gold Crow great general titular, acting Left Regular Cavalry Attendant, concurrent Censor-in-Chief, and Zhaoyi military regent.',
    idiomatic: 'Liu Congjian succeeded his father as Zhaoyi regent.',
  },
  s0268: {
    literal: 'On wushen night the moon transgressed the Net.',
    idiomatic: 'On wushen night the moon crossed the Net.',
  },
  s0269: {
    literal: 'That night fog rose in the north; in a moment it filled the sky; above the fog was red vapor, long before it dispersed.',
    idiomatic: 'That night red-tinged fog blanketed the northern sky.',
  },
  s0270: {
    literal: 'On jiazi Left Vice Premier Li Jiang was made heir-apparent Junior Preceptor, assigned to the eastern capital.',
    idiomatic: 'On jiazi Li Jiang was sent to Luoyang as junior preceptor.',
  },
  s0271: {
    literal: 'On wuchen an edict: "Farming depends above all on oxen; the weary people lack them — grants must be considered.',
    idiomatic: 'On wuchen an edict ordered oxen for the poor:',
  },
  s0272: {
    literal: 'Revenue is charged to buy ten thousand plow oxen in Hedong, Zhenwu, Ling, and Xia and distribute them to needy households in the capital region."',
    idiomatic: '"Revenue will buy ten thousand oxen on the frontier for capital-area farmers." Thus ended the edict.',
  },
  s0273: {
    literal: 'That year Huainan, Zhexi, Xuan, Xiang, E, Tan, Hunan, and other circuits suffered drought damage to crops.',
    idiomatic: 'Drought hurt crops across the middle and lower Yangzi.',
  },
  s0274: {
    literal: 'Baoli 2 — Baoli 2, spring, first month, jisi new moon. (The year is duplicated in the source.)',
    idiomatic: 'Baoli 2 opened on jisi.',
  },
  s0275: {
    literal: 'On gengwu Palace Censor Wang Yuanzhi was demoted to Sima of Zhao.',
    idiomatic: 'On gengwu Wang Yuanzhi was banished to Zhao.',
  },
  s0276: {
    literal: 'At the time Yuanzhi was on the street when Music Office performers insulted him; his escorts shouted back and a brawl ensued.',
    idiomatic: 'Musicians had insulted him on the street and a brawl followed.',
  },
  s0277: {
    literal: 'Jingzhao prefect Liu Qichu punished the performers; Vice Censor-in-Chief Dugu Lang argued too sharply; the Emperor in anger demoted Yuanzhi.',
    idiomatic: 'Liu Qichu punished the musicians; Dugu Lang\'s sharp protest backfired on Yuanzhi.',
  },
  s0278: {
    literal: 'On xinwei the Hunan observation commissioner Shen Chuanshi memorialized: by edict the documents of Ye Jingneng and Luo Guangyuan were sought; none were found.',
    idiomatic: 'On xinwei Shen Chuanshi could not find requested sorcerers\' files.',
  },
  s0279: {
    literal: 'On guiyou Right Companion Li Guangxian quarreled with palace officer Li Chongshi and struck Chongshi with his tablet until he bled.',
    idiomatic: 'On guiyou Li Guangxian bloodied a palace officer with his court tablet.',
  },
  s0280: {
    literal: 'Because he was imperial kin, two months\' salary was fined.',
    idiomatic: 'As imperial kin he lost two months\' pay.',
  },
  s0281: {
    literal: 'On jiaxu twenty thousand army laborers were brought within the palace to dig pools and repair halls.',
    idiomatic: 'On jiaxu twenty thousand soldiers dug palace pools.',
  },
  s0282: {
    literal: 'On xinsi the Xingyuan military commissioner Pei Du memorialized that the Zegu road and post stations were all finished.',
    idiomatic: 'On xinsi Pei Du finished the Zegu highway.',
  },
  s0283: {
    literal: 'On renchen Pei Du came to court.',
    idiomatic: 'On renchen Pei Du arrived at court.',
  },
  s0284: {
    literal: 'On jiawu Court of Imperial Sacrifices director Liu Zungu was made Hunan observation commissioner; Imperial College chancellor Wei Zhongxing was made Fujian observation commissioner.',
    idiomatic: 'On jiawu Liu Zungu took Hunan and Wei Zhongxing Fujian.',
  },
  s0285: {
    literal: 'On bingshen the salt commissioner Wang Bo memorialized: "Within Yangzhou city the old canal water was shallow and boats delayed; delivery missed deadlines.',
    idiomatic: 'On bingshen Wang Bo proposed dredging Yangzhou\'s canal:',
  },
  s0286: {
    literal: 'Now from outside Chang Gate the ancient Seven-Li Harbor is to be opened eastward in curves to Zen Wisdom Temple bridge and east to the old official canal — total length nineteen li.',
    idiomatic: '"A nineteen-li cut from Seven-Li Harbor to the old canal would ease shipping."',
  },
  s0287: {
    literal: 'Labor costs are to be paid from local funds."',
    idiomatic: '"Local funds would pay the work." Thus ended the memorial.',
  },
  s0288: {
    literal: 'The cost of the labor for the works should be paid and dispatched by each circuit.',
    idiomatic: 'Each circuit was to bear and pay for its share of the labor.',
  },
  s0289: {
    literal: 'Thus ended the memorial; the throne assented.',
    idiomatic: 'Thus ended the edict.',
  },
  s0290: {
    literal: 'Second month, jihai new moon.',
    idiomatic: 'The second month opened on jihai.',
  },
  s0291: {
    literal:
      'On xinchou the Rongguan frontier commissioner Yan Gongsu memorialized: "Seven counties including Puning in this prefecture ask to choose officials by northern examination like Guang, Zhao, Gui, and He."',
    idiomatic:
      'On xinchou Yan Gongsu sought northern-style examinations for seven Rongguan counties.',
  },
  s0292: {
    literal: 'Thus ended the memorial; the throne assented.',
    idiomatic: 'The emperor approved.',
  },
  s0293: {
    literal: 'On bingwu night the moon transgressed the Net.',
    idiomatic: 'On bingwu night the moon crossed the Net.',
  },
  s0294: {
    literal:
      'On dingwei the Shannan West military observation and disposition commissioner, Grand Master for Splendid Happiness, acting Minister of Works, Grand Councillor, Xingyuan prefect, Upper Pillar, Duke of Jin Pei Du kept acting Minister of Works and Grand Councillor and returned to govern affairs.',
    idiomatic: 'On dingwei Pei Du rejoined the council.',
  },
  s0295: {
    literal: 'On dingsi at the Cold Food Festival the three halls feasted the ministers from wuwu through gengshen before ending.',
    idiomatic: 'Cold Food brought a three-day feast in the three halls.',
  },
  s0296: {
    literal: 'On bingyin the acting Minister of Works Pei Du was formally installed.',
    idiomatic: 'On bingyin Pei Du was formally installed.',
  },
  s0297: {
    literal: 'On dingmao Minister of Rites Wang Ya was made acting Left Vice Premier and Shannan West military commissioner.',
    idiomatic: 'On dingmao Wang Ya took Shannan West.',
  },
  s0298: {
    literal: 'Third month, wuchen new moon: the Xingtang Abbey Daoist Sun Zhun was placed in the Hanlin as awaiting edicts.',
    idiomatic: 'On wuchen Daoist Sun Zhun entered the Hanlin.',
  },
  s0299: {
    literal: 'On xinwei the Jiangxi observation commissioner Yin You asked to set a Buddhist ordination platform at Hongzhou Baoli Temple; an edict fined Yin You one season\'s salary for defying regulations and setting a platform on his own authority.',
    idiomatic: 'On xinwei Yin You was fined for an illegal ordination platform.',
  },
  s0300: {
    literal: 'On jiaxu the chief ministers and hundred officials were granted an upper-rite feast at Qujiang Pavilion.',
    idiomatic: 'On jiaxu the court feasted at Qujiang.',
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
