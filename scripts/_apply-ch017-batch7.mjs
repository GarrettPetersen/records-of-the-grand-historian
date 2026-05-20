#!/usr/bin/env node
/** Batch 7: s0601–s0700 (Jiutangshu ch.017, Jingzong, Wenzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/017.json';
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
    literal: 'Jingyuan military commissioner Li Gai was made Qi-De military commissioner; his name was changed to Youyu.',
    idiomatic: 'Li Gai became Youyu, commissioner of Qi-De.',
  },
  s0602: {
    literal: 'On dingyou former Yiwu military commissioner Fu Yi was made Cang prefect and Henghai military commissioner.',
    idiomatic: 'On dingyou Fu Yi took Henghai.',
  },
  s0603: {
    literal: 'On xinchou Right Gold Crow great general Zhang Weiqing was made acting Minister of Works and Jingyuan military commissioner;',
    idiomatic: 'On xinchou Zhang Weiqing took Jingyuan;',
  },
  s0604: {
    literal: 'Left Gold Crow great general Liu Zungu was made Binning military commissioner.',
    idiomatic: 'Liu Zungu took Binning.',
  },
  s0605: {
    literal: 'Sixth month, jiyou new moon.',
    idiomatic: 'The sixth month opened on jiyou.',
  },
  s0606: {
    literal: 'On xinhai Weibo military commissioner Shi Xianchéng was made acting Minister of Education, Palace Companion, Hezhong prefect, and Hezhong-Jin-Jiang military commissioner;',
    idiomatic: 'On xinhai Shi Xianchéng took Hezhong;',
  },
  s0607: {
    literal: 'Yicheng military commissioner Li Ting was also made Weibo military commissioner;',
    idiomatic: 'Li Ting also took Weibo;',
  },
  s0608: {
    literal: 'Weibo deputy commissioner and acting Minister of Works Shi Xiaozhang was made Xiang-Wei military commissioner.',
    idiomatic: 'Shi Xiaozhang took Xiang-Wei.',
  },
  s0609: {
    literal: 'On renshen an edict: "The Yuanhe 4 edict forbidding lead-tin coin and requiring surrender with informer rewards of a hundred cash per cash was excessive.',
    idiomatic: 'On renshen Wenzong revised lead-tin coin penalties:',
  },
  s0610: {
    literal: 'Henceforth lead-tin traders under one string — the prefecture applies the regular twenty-stroke back beating;',
    idiomatic: '"Under one string: twenty strokes;"',
  },
  s0611: {
    literal: 'under ten strings, sixty strokes and three years\' penal servitude;',
    idiomatic: '"under ten strings: sixty strokes and three years\' servitude;"',
  },
  s0612: {
    literal: 'over ten strings, assemble the crowd and execute.',
    idiomatic: '"over ten strings: public execution."',
  },
  s0613: {
    literal: 'Informers receive fifty cash per string."',
    idiomatic: '"Informers receive fifty cash per string."',
  },
  s0614: {
    literal: 'The edict closed with the closing bracket.',
    idiomatic: 'Thus closed the edict on lead-tin coin.',
  },
  s0615: {
    literal: 'Autumn, seventh month, jimao new moon.',
    idiomatic: 'The seventh month opened on jimao.',
  },
  s0616: {
    literal: 'On guiwei palace envoy Liu Hongyi returned Shi Xianchéng\'s commission from Weizhou, reporting that on the twenty-sixth night of the sixth month Weibo troops mutinied, killed Shi Xianchéng, and set great general He Jintao as acting commander; the new commissioner Li Ting could not enter the city.',
    idiomatic: 'On guiwei Liu Hongyi reported Weibo had killed Shi Xianchéng and made He Jintao regent.',
  },
  s0617: {
    literal: 'On yichou Hezhong military commissioner Xue Ping remained as before.',
    idiomatic: 'On yichou Xue Ping kept Hezhong.',
  },
  s0618: {
    literal: 'On yiwei Lingnan military commissioner Li Xian died.',
    idiomatic: 'On yiwei Li Xian died.',
  },
  s0619: {
    literal: 'Vice Minister of War Lu Yuanfu died.',
    idiomatic: 'Lu Yuanfu died.',
  },
  s0620: {
    literal: 'On dingyou Jingzhao prefect Cui Hu was made Censor-in-Chief and Lingnan military commissioner.',
    idiomatic: 'On dingyou Cui Hu took Lingnan.',
  },
  s0621: {
    literal: 'On wuxu Court of Judicial Review director Li Liang was made Jingzhao prefect.',
    idiomatic: 'On wuxu Li Liang took Jingzhao.',
  },
  s0622: {
    literal: 'On yisi Minister of Rites and Hanlin lecture academician Ding Gongzhu was made acting Minister of Revenue and Run prefect, Zhexi observation commissioner;',
    idiomatic: 'On yisi Ding Gongzhu took Zhexi;',
  },
  s0623: {
    literal: 'former Zhexi observation commissioner and acting Minister of Rites Li Deyu was made Vice Minister of War.',
    idiomatic: 'Li Deyu became vice minister of war.',
  },
  s0624: {
    literal: 'On xinhai Weibo\'s He Jintao memorialized: by edict Xiang and Wei three prefectures were cut off; the three armies refused.',
    idiomatic: 'On xinhai He Jintao refused the Xiang-Wei partition.',
  },
  s0625: {
    literal: 'On renzi an edict made Weibo inner gate commander He Jintao acting Left Palace Companion and Weibo military commissioner.',
    idiomatic: 'On renzi He Jintao was confirmed at Weibo.',
  },
  s0626: {
    literal: 'On guichou Court of Imperial Sacrifices director Yin You was made acting Minister of Works and Qi-De-Cang military commissioner.',
    idiomatic: 'On guichou Yin You took Qi-De-Cang.',
  },
  s0627: {
    literal: 'On xinyou nine capital-area counties including Fengyi suffered drought and damaged fields.',
    idiomatic: 'On xinyou drought ruined nine capital counties\' fields.',
  },
  s0628: {
    literal: 'Exile Wei Zhongxing died at Bozhou; Song and Bo floods harmed crops.',
    idiomatic: 'Wei Zhongxing died; Song and Bo crops flooded.',
  },
  s0629: {
    literal: 'On renshen an edict rehabilitated Wang Tingcou and restored his offices and ranks.',
    idiomatic: 'On renshen Wang Tingcou was rehabilitated.',
  },
  s0630: {
    literal: 'On jiaxu Vice Minister of Personnel Li Zongmin became Grand Councillor.',
    idiomatic: 'On jiaxu Li Zongmin joined the Grand Council.',
  },
  s0631: {
    literal: 'Ninth month, wuyin new moon.',
    idiomatic: 'The ninth month opened on wuyin.',
  },
  s0632: {
    literal: 'On xinsi an edict: the two armies, all offices, and inner eunuchs may not wear gauze, damask, silk, or brocade garments.',
    idiomatic: 'On xinsi silk finery was banned in the armies and inner service.',
  },
  s0633: {
    literal: 'The Emperor was by nature plain and disliked splendor.',
    idiomatic: 'Wenzong despised display.',
  },
  s0634: {
    literal: 'The consort\'s kin Wei Churen wore a layered gauze turban; the Emperor told him: "I chose you for marriage because your house was clear and plain.',
    idiomatic: 'Wenzong rebuked consort kin Wei Churen for gauze finery:',
  },
  s0635: {
    literal: 'Such headgear and dress — let other affines wear them.',
    idiomatic: '"Let your kinsmen dress so —',
  },
  s0636: {
    literal: 'You alone are not fit for it."',
    idiomatic: 'not you."',
  },
  s0637: {
    literal: 'On renchen Vice Minister of War Li Deyu was made acting Minister of Works, Hua prefect, and Yicheng military commissioner.',
    idiomatic: 'On renchen Li Deyu took Yicheng.',
  },
  s0638: {
    literal: 'On wuxu former Mu prefect Lu Gen was made Yue prefect and Zhedong observation commissioner, replacing Yuan Zhen;',
    idiomatic: 'On wuxu Lu Gen replaced Yuan Zhen at Zhedong;',
  },
  s0639: {
    literal: 'Zhen was made Left Vice Director, replacing Wei Hongjing;',
    idiomatic: 'Yuan Zhen became left vice director;',
  },
  s0640: {
    literal: 'Hongjing was made Minister of Rites.',
    idiomatic: 'Wei Hongjing took Rites.',
  },
  s0641: {
    literal: 'Winter, tenth month, wushen new moon.',
    idiomatic: 'The tenth month opened on wushen.',
  },
  s0642: {
    literal: 'On jiyou Jiangxi\'s Shen Chuanshi memorialized: on the Emperor\'s birthday, please raise a complete-precepts ordination platform for monks and nuns.',
    idiomatic: 'On jiyou Shen Chuanshi asked to ordain monks on the Emperor\'s birthday.',
  },
  s0643: {
    literal: 'An edict said: "Ordaining monks and nuns without limit — repeated edicts forbid it.',
    idiomatic: 'The throne replied: repeated edicts forbid mass ordination;',
  },
  s0644: {
    literal: 'Chuanshi disgraces his post as frontier governor, should obey the statutes, yet leads the foolish — this is not the Way; deduct one month\'s salary."',
    idiomatic: 'Shen Chuanshi lost one month\'s pay for tempting the foolish.',
  },
  s0645: {
    literal: 'On bingchen former Yicheng military commissioner Li Ting was made heir-apparent Junior Mentor.',
    idiomatic: 'On bingchen Li Ting became junior mentor.',
  },
  s0646: {
    literal: 'On guihai Vice Minister of Revenue Cui Yuanlue was made Minister of Revenue and revenue commissioner.',
    idiomatic: 'On guihai Cui Yuanlue took Revenue.',
  },
  s0647: {
    literal: 'Palace Secretariat drafter Wei Ci was made Hunan observation commissioner.',
    idiomatic: 'Wei Ci took Hunan.',
  },
  s0648: {
    literal: 'Eleventh month, dingchou new moon.',
    idiomatic: 'The eleventh month opened on dingchou.',
  },
  s0649: {
    literal: 'On gengchen heir-apparent Grand Mentor Zheng Yin died.',
    idiomatic: 'On gengchen Zheng Yin died.',
  },
  s0650: {
    literal: 'On bingxu an edict ordered former Bo prefect Li Fan executed at Jingzhao.',
    idiomatic: 'On bingxu Li Fan was executed.',
  },
  s0651: {
    literal: 'On jiashen the Emperor personally sacrificed to the Lord on High at the southern suburb; when rites ended he mounted Danfeng Gate and proclaimed a great amnesty.',
    idiomatic: 'On jiashen southern-suburb rites ended with a great amnesty.',
  },
  s0652: {
    literal: 'The amnesty text forbade exotic tribute: "The four directions may not present newly patterned extraordinary fabrics as tribute — machine-woven fine silks, floral silks, gauze, and brocade are all forbidden.',
    idiomatic: 'The amnesty banned exotic silks and brocade tribute:',
  },
  s0653: {
    literal: 'One month after the edict arrives, all looms\' products are to be burned."',
    idiomatic: '"Within a month all such looms\' goods must burn."',
  },
  s0654: {
    literal: 'Prefects bearing regional care may memorialize directly.',
    idiomatic: 'Prefects might memorialize directly on local matters.',
  },
  s0655: {
    literal: 'When affairs violate law, the observation commissioner reports only afterward.',
    idiomatic: 'Observation commissioners reported violations after the fact.',
  },
  s0656: {
    literal: 'On bingshen Xichuan memorialized that Nanzhao barbarians invaded.',
    idiomatic: 'On bingshen Xichuan reported Nanzhao invasion.',
  },
  s0657: {
    literal: 'On jiachen Wang Zhixing came to court.',
    idiomatic: 'On jiachen Wang Zhixing attended court.',
  },
  s0658: {
    literal: 'On yisi Zhixing was made acting Grand Mentor, former Grand Councillor and Wuning military commissioner, advanced to Baron of Yanmen.',
    idiomatic: 'On yisi Wang Zhixing became Baron of Yanmen and kept Wuning.',
  },
  s0659: {
    literal: 'Twelfth month, dingwei new moon: southern barbarians pressed Rong prefecture; envoys were sent to raise troops from Jingnan, E-Yue, Xiang-Deng, and Chen-Xu circuits to aid Shu.',
    idiomatic: 'On dingwei southern tribes pressed Rong; troops were levied for Shu.',
  },
  s0660: {
    literal: 'Eastern Sichuan military commissioner Guo Zhao was made western Sichuan military commissioner and also acted for eastern Sichuan.',
    idiomatic: 'Guo Zhao took western Sichuan and acted for the east.',
  },
  s0661: {
    literal: 'On renzi former western Sichuan military commissioner Du Yuanying was demoted to Shao prefect.',
    idiomatic: 'On renzi Du Yuanying was demoted to Shao.',
  },
  s0662: {
    literal: 'Palace envoy Yang Wenduan was sent with an edict to bestow on Nanzhao king Meng Fengyou.',
    idiomatic: 'Yang Wenduan carried an edict to Meng Fengyou.',
  },
  s0663: {
    literal: 'Barbarian troops took Qiong, Ya, and other prefectures.',
    idiomatic: 'Nanzhao took Qiong and Ya.',
  },
  s0664: {
    literal: 'On wuwu Right Army Guard great general Dong Chongzhi was made western Sichuan field army commander.',
    idiomatic: 'On wuwu Dong Chongzhi commanded the Shu relief army.',
  },
  s0665: {
    literal: 'Western Sichuan memorialized that barbarian troops had taken Chengdu prefectural city.',
    idiomatic: 'Chengdu fell to Nanzhao.',
  },
  s0666: {
    literal: 'Eastern Sichuan memorialized that barbarian troops entered Zi prefecture\'s west gate and encamped below the wall.',
    idiomatic: 'Nanzhao camped below Zi\'s west gate.',
  },
  s0667: {
    literal: 'Again an edict urged the circuits\' relief troops toward western Sichuan.',
    idiomatic: 'Relief troops were again urged toward Shu.',
  },
  s0668: {
    literal: 'On jichou eastern-capital regent Linghu Chu was made acting Right Vice Director and Tianping military commissioner, replacing Cui Hongli as Luoyang regent.',
    idiomatic: 'On jichou Linghu Chu took Tianping and Luoyang.',
  },
  s0669: {
    literal: 'On dingmao Du Yuanying was demoted to Xunzhou registrar.',
    idiomatic: 'On dingmao Du Yuanying was sent to Xun.',
  },
  s0670: {
    literal: 'On yisi Guo Zhao memorialized that barbarian troops had withdrawn; an envoy was sent with credentials to barbarian commander Meng Dian.',
    idiomatic: 'On yisi Guo Zhao reported Nanzhao\'s withdrawal.',
  },
  s0671: {
    literal: 'On xinwei heir-apparent Junior Mentor Li Ting was made Binning military commissioner.',
    idiomatic: 'On xinwei Li Ting took Binning.',
  },
  s0672: {
    literal: 'On guiyou Censor-in-Chief Wen Zao was made Right Vice Director; Personnel Bureau director Yuwen Ding was made Censor-in-Chief.',
    idiomatic: 'On guiyou Wen Zao and Yuwen Ding exchanged censor posts.',
  },
  s0673: {
    literal: 'Dade 4, spring, first month, bingzi new moon.',
    idiomatic: 'Dade 4 opened on bingzi.',
  },
  s0674: {
    literal: 'On xinmao Wuchang military commissioner Niu Sengru came to court.',
    idiomatic: 'On xinmao Niu Sengru came to court.',
  },
  s0675: {
    literal: 'On bingxu Left Divine Strategy great general Qiu Zhifang was made Yan-Fang military commissioner.',
    idiomatic: 'On bingxu Qiu Zhifang took Yan-Fang.',
  },
  s0676: {
    literal: 'On wuzi an edict enfeoffed the eldest son Yong as Prince of Lu.',
    idiomatic: 'On wuzi Prince Yong became Prince of Lu.',
  },
  s0677: {
    literal: 'On xinmao Wuchang military commissioner, E-Yue pacification commissioner, and Grand Councillor Niu Sengru was made Minister of War and Grand Councillor.',
    idiomatic: 'On xinmao Niu Sengru joined the council as war minister.',
  },
  s0678: {
    literal: 'On renchen Vice Minister of War Cui Yan was made Shan-Guo observation commissioner.',
    idiomatic: 'On renchen Cui Yan took Shan-Guo.',
  },
  s0679: {
    literal: 'The Prince of Lu\'s mother Lady Wang was made Precious Consort.',
    idiomatic: 'Lady Wang became Precious Consort.',
  },
  s0680: {
    literal: 'On guisi former Binning military commissioner Liu Zungu was made eastern Sichuan military commissioner.',
    idiomatic: 'On guisi Liu Zungu took eastern Sichuan.',
  },
  s0681: {
    literal: 'On jiawu acting Left Vice Director and salt commissioner Wang Bo died.',
    idiomatic: 'On jiawu Wang Bo died.',
  },
  s0682: {
    literal: 'On bingshen Grand Master of Sacrifices Wang Ya was made Minister of Personnel and salt commissioner.',
    idiomatic: 'On bingshen Wang Ya took Personnel and the salt monopoly.',
  },
  s0683: {
    literal: 'On xinchou Left Vice Director Yuan Zhen was made acting Minister of Revenue and Wuchang military commissioner.',
    idiomatic: 'On xinchou Yuan Zhen took Wuchang.',
  },
  s0684: {
    literal: 'On guimao former Shan-Guo observation commissioner Wang Qi was made Left Vice Director.',
    idiomatic: 'On guimao Wang Qi became left vice director.',
  },
  s0685: {
    literal: 'Second month, bingwu new moon.',
    idiomatic: 'The second month opened on bingwu.',
  },
  s0686: {
    literal: 'On wuwu Xingyuan army mutinied; military commissioner Li Jiang and his whole household were killed; aides Xue Qi and Zhao Cunyue died with him.',
    idiomatic: 'On wuwu Xingyuan mutineers slaughtered Li Jiang\'s household.',
  },
  s0687: {
    literal: 'On gengshen Left Vice Director Wen Zao was made Xingyuan military commissioner.',
    idiomatic: 'On gengshen Wen Zao took Xingyuan.',
  },
  s0688: {
    literal: 'On xinwei Xia military commissioner Li Huan died.',
    idiomatic: 'On xinwei Li Huan died.',
  },
  s0689: {
    literal: 'On renshen Divine Strategy field commissioner Dong Chongzhi was made Xia-Sui-Yin-You military commissioner.',
    idiomatic: 'On renshen Dong Chongzhi took Xia.',
  },
  s0690: {
    literal: 'Third month, yihai: Hedong military commissioner Li Cheng was made acting Left Vice Director, Grand Councillor, Hezhong prefect, and Jin-Jiang-Ci-Li military commissioner; Minister of Punishments Liu Gongchuo was made acting Left Vice Director, Taiyuan prefect, northern-capital regent, and Hedong military commissioner.',
    idiomatic: 'On yihai Li Cheng and Liu Gongchuo took Hezhong and Hedong.',
  },
  s0691: {
    literal: 'On dingchou former Hezhong military commissioner Xue Ping was made heir-apparent Grand Mentor.',
    idiomatic: 'On dingchou Xue Ping became grand mentor.',
  },
  s0692: {
    literal: 'On dinghai Court of Imperial Sacrifices director Gui Zhongwu was made Fujian observation commissioner.',
    idiomatic: 'On dinghai Gui Zhongwu took Fujian.',
  },
  s0693: {
    literal: 'Xingyuan\'s Wen Zao memorialized: "The ringleaders Qiu Yin and Qiu Zhu and a thousand soldiers were all executed.',
    idiomatic: 'Wen Zao reported executing a thousand Xingyuan mutineers:',
  },
  s0694: {
    literal: 'Those who personally struck Jiang were cut in a hundred pieces; the signal caller in three; the rest beheaded.',
    idiomatic: '"Jiang\'s killers were quartered; the rest beheaded."',
  },
  s0695: {
    literal: 'One hundred heads sacrificed to Li Jiang, thirty to officials who died in service; the rest were cast into the Han River."',
    idiomatic: '"Heads were sacrificed to Jiang and the dead; corpses filled the Han."',
  },
  s0696: {
    literal: 'On jichou an edict ordered Xingyuan army supervisor Yang Shuyuan exiled to Kang prefecture commoner status, shackled and escorted to his place.',
    idiomatic: 'On jichou Yang Shuyuan was shackled to Kang.',
  },
  s0697: {
    literal: 'On dingyou historiography commissioner, Secretariat Vice Director, and Grand Councillor Lu Sui presented the forty fascicles of Veritable Records of Xianzong he had compiled; a gracious edict answered and rewarded five historians with graded brocade and silver.',
    idiomatic: 'On dingyou Lu Sui presented Xianzong\'s Veritable Records.',
  },
  s0698: {
    literal: 'On guimao Huainan military commissioner Duan Wenchang was made acting Left Vice Director, Grand Councillor, Jiangling prefect, and Jingnan military commissioner;',
    idiomatic: 'On guimao Duan Wenchang took Jingnan;',
  },
  s0699: {
    literal: 'former heir-apparent Guest of Honor Cui Cong was made acting Right Vice Director, Yangzhou metropolitan prefect, and Huainan military commissioner.',
    idiomatic: 'Cui Cong took Huainan.',
  },
  s0700: {
    literal: 'On jiachen former Jingnan military commissioner Cui Qun was made acting Right Vice Director and concurrent Director of Sacrifices.',
    idiomatic: 'On jiachen Cui Qun took Sacrifices.',
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
