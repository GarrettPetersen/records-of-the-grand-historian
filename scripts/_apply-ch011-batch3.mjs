#!/usr/bin/env node
/** Batch 3: s0201–s0300 (Jiutangshu ch.011, Daizong) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/011.json';
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
    literal: 'Acting revenue commissioner Diwu Qi was also made Jingzhao prefect and Censor-in-Chief.',
    idiomatic: 'Diwu Qi added Jingzhao prefect and censor-in-chief to his revenue duties.',
  },
  s0202: {
    literal:
      'On dingmao Chancellor Wang Jin was made Palace Attendant, holding credentials as overall commander of Henan, Huai-Xi, Huainan, and Hedong South campaign circuits, advanced to Duke of Taiyuan commandery.',
    idiomatic:
      'On dingmao Wang Jin became palace attendant and eastern campaign commander, Duke of Taiyuan.',
  },
  s0203: {
    literal: 'He firmly declined Palace Attendant; it was granted.',
    idiomatic: 'He refused the palace attendant post and was allowed to.',
  },
  s0204: {
    literal: 'Chancellor Du Hongjian judged Chancellery affairs.',
    idiomatic: 'Du Hongjian took over the chancellery portfolio.',
  },
  s0205: {
    literal: 'On guisi Wang Jin also took acting Eastern Capital garrison command.',
    idiomatic: 'On guisi Wang Jin became acting Luoyang commandant as well.',
  },
  s0206: {
    literal: 'In the ninth month, on yiwei new moon.',
    idiomatic: 'Ninth month, yiwei new moon.',
  },
  s0207: {
    literal:
      'On bingshen an edict ordered Hezhong troops to attack Tibet; as they were about to march, that night the army clamored, plundered Military Commissioner Cui Yu\'s household and commoners\' property almost completely, all marching with heavy packs — clerks could not forbid it.',
    idiomatic:
      'On bingshen Hezhong troops mutinied on the eve of marching against Tibet, looting their commander and civilians before bolting.',
  },
  s0208: {
    literal:
      'From the seventh month great rain did not cease; in the capital rice was a thousand cash per dou.',
    idiomatic:
      'Rain since the seventh month drove Chang\'an rice to a thousand cash per dou.',
  },
  s0209: {
    literal: 'Locusts ate the fields.',
    idiomatic: 'Locusts devoured the crops.',
  },
  s0210: {
    literal:
      'On bingwu Hedong military commissioner Xin Yunjing was made acting Right Vice Director of the Imperial Secretariat, Associate Grand Secretariat, Taiyuan prefect, and Northern Capital garrison commander.',
    idiomatic:
      'On bingwu Xin Yunjing became chancellor and Taiyuan commander.',
  },
  s0211: {
    literal: 'On jiyou Jiangnan West circuit observer and Hongzhou prefect Zhang Gao died.',
    idiomatic: 'On jiyou Zhang Gao, observer of Jiangnan West, died.',
  },
  s0212: {
    literal:
      'On xinhai Hedong deputy commander-in-chief, Grand Secretariat Director, Duke of Fenyang commandery Guo Ziyi was advanced to Grand Preceptor and made commissioner to harmonize with Tibet on the northern road, Binxia, Jingyuan, Hexi east of the pass, and Shuofang pacification;',
    idiomatic:
      'On xinhai Guo Ziyi became grand preceptor and frontier commissioner against Tibet;',
  },
  s0213: {
    literal:
      'Chen-Zheng-Ze-Lu military commissioner Li Baoyu advanced to Grand Mentor and commissioner to harmonize with Tibet on the southern road, Fengxiang, Qin-Long, Lintao east of the pass observer.',
    idiomatic:
      'Li Baoyu became grand mentor and southern frontier commissioner.',
  },
  s0214: {
    literal: 'Ziyi thrice memorialized earnestly declining Grand Preceptor; it was granted.',
    idiomatic: 'Guo Ziyi three times refused grand preceptor and was excused.',
  },
  s0215: {
    literal:
      'On jiwei Jiannan military commissioner Yan Wu attacked and took the Tibetan fortress Danggou, breaking more than seventy thousand Tibetan troops.',
    idiomatic:
      'On jiwei Yan Wu took Danggou and shattered seventy thousand Tibetans.',
  },
  s0216: {
    literal:
      'Left Secretariat Vice Director Yang Wan supervised Eastern Capital selection; Vice Minister of Rites Jia Zhi supervised Eastern Capital examinations.',
    idiomatic:
      'Yang Wan ran capital selection; Jia Zhi ran Luoyang examinations.',
  },
  s0217: {
    literal: 'The two capitals divided selection — from this it began.',
    idiomatic: 'Dual-capital civil service exams began here.',
  },
  s0218: {
    literal:
      'On xinyou Heir Apparent Household Administrator Li Xian was made Minister of Civil Appointments, concurrent Censor-in-Chief, supervising Jiangnan east and west and Fujian circuit selection, and farming-pacification commissioner.',
    idiomatic:
      'On xinyou Li Xian took civil appointments and southeastern selection.',
  },
  s0219: {
    literal: 'Hongzhou prefect Li Mian was still ordered to assist in selection affairs.',
    idiomatic: 'Li Mian of Hongzhou was named his deputy in selection.',
  },
  s0220: {
    literal: 'That autumn locusts ate the fields almost completely; the Guan region was worst.',
    idiomatic: 'Autumn locusts nearly stripped the fields; the capital region suffered most.',
  },
  s0221: {
    literal: 'Rice was a thousand cash per dou.',
    idiomatic: 'Grain again reached a thousand cash per dou.',
  },
  s0222: {
    literal:
      'In the tenth month of winter, on bingyin, Pugu Huai\'en led twenty thousand Tibetans to raid Binzhou; military commissioner Bai Xiaode closed the city and refused defense.',
    idiomatic:
      'Tenth month, bingyin: Huai\'en and twenty thousand Tibetans besieged Bin; Bai Xiaode held the walls.',
  },
  s0223: {
    literal: 'On dingmao they raided Fengtian; the capital was put on alert.',
    idiomatic: 'On dingmao they reached Fengtian and Chang\'an went on alert.',
  },
  s0224: {
    literal:
      'Vanguard Guo Xi beheaded enemy camps west of Binzhou; captives and heads numbered in the hundreds.',
    idiomatic:
      'Guo Xi\'s vanguard cut down hundreds west of Binzhou.',
  },
  s0225: {
    literal: 'Ziyi encamped at Jingyang; the Tibetan army challenged battle — Ziyi did not go out.',
    idiomatic: 'Guo Ziyi camped at Jingyang and refused battle when Tibet challenged.',
  },
  s0226: {
    literal: 'On jiashen Henan prefect Su Zhen died.',
    idiomatic: 'On jiashen Su Zhen, Henan prefect, died.',
  },
  s0227: {
    literal: 'Jiannan Yan Wu memorialized recovery of the Tibetan Yanchuan fortress.',
    idiomatic: 'Yan Wu reported retaking Yanchuan from Tibet.',
  },
  s0228: {
    literal:
      'On yimao Huai\'en and the Tibetan army dissolved on their own; the capital alert was lifted.',
    idiomatic:
      'On yimao the invaders collapsed and the capital stood down.',
  },
  s0229: {
    literal:
      'On dingwei Ziyi entered audience from Jingyang; an edict ordered chancellors and the hundred officials to welcome him at Kaiyuan Gate; the emperor waited at Anfu Temple.',
    idiomatic:
      'On dingwei Guo Ziyi was welcomed at Kaiyuan Gate while the emperor waited at Anfu Temple.',
  },
  s0230: {
    literal:
      'On yichou Ziyi was advanced Guannei and Hezhong deputy commander-in-chief and concurrent Director of the Secretariat; Minister of Civil Appointments Vice Director Chang Hui was made Left Palace Companion and Hezhong prefect.',
    idiomatic:
      'On yichou Guo Ziyi gained Guannei and Hezhong commands; Chang Hui became Hezhong prefect.',
  },
  s0231: {
    literal:
      'Ziyi thrice memorialized declining Director of the Secretariat; the wording was earnest — a gracious edict granted it.',
    idiomatic:
      'He three times refused the secretariat directorship and the emperor relented.',
  },
  s0232: {
    literal: 'On dingmao night stars fell like rain.',
    idiomatic: 'On dingmao night a meteor shower lit the sky.',
  },
  s0233: {
    literal:
      'On wuchen Ziyi at the Imperial Secretariat assumed deputy commander affairs; chancellors and the hundred officials escorted him — still ordered five hundred archer-guards in martial dress from Guangfan Gate to the secretariat gate.',
    idiomatic:
      'On wuchen he took up deputy command at the secretariat under ceremonial escort of five hundred guards.',
  },
  s0234: {
    literal: 'Right Vice Director Guo Yingyi welcomed him with music.',
    idiomatic: 'Guo Yingyi received him with music.',
  },
  s0235: {
    literal: 'That day he at once went to Fengtian.',
    idiomatic: 'That same day he marched to Fengtian.',
  },
  s0236: {
    literal:
      'That year the Households Ministry tallied registers: administered households two million nine hundred thirty-three thousand one hundred twenty-five, mouths sixteen million nine hundred twenty thousand three hundred eighty-six.',
    idiomatic:
      'The year\'s census counted 2,933,125 households and 16,920,386 persons.',
  },
  s0237: {
    literal: 'Yongtai 1, on jiasi new moon of the first month, a decree stated:',
    idiomatic: 'First month of Yongtai 1, jiasi new moon, an edict declared:',
  },
  s0238: {
    literal: 'That day snow piled a foot deep.',
    idiomatic: 'Snow that day reached a foot deep.',
  },
  s0239: {
    literal:
      'On wushen Ze-Lu Li Baoyu also took Fengxiang-Longyou military commissioner, and commissioner to harmonize with Tibet on the southern road, Fengxiang, Qin-Long, Lintao east observer and pacification.',
    idiomatic:
      'On wushen Li Baoyu added Fengxiang-Longyou and southern Tibet pacification.',
  },
  s0240: {
    literal:
      'Ma Lin, Four Garrisons campaign military commissioner, was still ordered deputy commissioner to harmonize with Tibet.',
    idiomatic:
      'Ma Lin was named his deputy for Tibet talks.',
  },
  s0241: {
    literal: 'On guimao Qizhou\'s Fengxiang county was abolished and merged into Tianxing county.',
    idiomatic: 'Fengxiang county was merged into Tianxing.',
  },
  s0242: {
    literal: 'On yimao Left Palace Companion Gao Shi died.',
    idiomatic: 'On yimao Gao Shi died.',
  },
  s0243: {
    literal:
      'On wuwu Jiannan military commissioner Yan Wu was advanced acting Minister of Civil Appointments; Shannan military commissioner Zhang Xianchéng was advanced acting Minister of Works.',
    idiomatic:
      'On wuwu Yan Wu and Zhang Xianchéng gained acting ministry ranks.',
  },
  s0244: {
    literal:
      'Former Yuanzhou prefect Li Zun was made Heir Apparent Junior Tutor, permitted court at new and full moon.',
    idiomatic:
      'Li Zun returned as heir-apparent tutor with limited audiences.',
  },
  s0245: {
    literal: 'On jiazi night.',
    idiomatic: 'Night of jiazi.',
  },
  s0246: {
    literal: 'Thunder crashed.',
    idiomatic: 'Thunder rolled across the sky.',
  },
  s0247: {
    literal:
      'On dingchou the inner palace released a thousand palace women; six hundred ranked officials guarded Luoyang Palace.',
    idiomatic:
      'On dingchou a thousand palace women were released and six hundred officials garrisoned Luoyang.',
  },
  s0248: {
    literal: 'On wuyin Tangut Qiang raided Fuping;',
    idiomatic: 'On wuyin Tangut Qiang attacked Fuping;',
  },
  s0249: {
    literal: 'they burned the sleeping hall of Ding Mausoleum.',
    idiomatic: 'and burned the tomb hall at Dingling.',
  },
  s0250: {
    literal: 'Prince of Yi Li Lin died.',
    idiomatic: 'Li Lin, Prince of Yi, died.',
  },
  s0251: {
    literal: 'All mausoleum offices were again subordinate to the Court of Imperial Sacrifices.',
    idiomatic: 'Mausoleum offices returned to the Court of Imperial Sacrifices.',
  },
  s0252: {
    literal:
      'On wuzi twelve Tangut prefectures Yong, Ding, and others submitted and requested establishment of Yi, Fang, and fifteen other prefectures — approved.',
    idiomatic:
      'On wuzi twelve Tangut prefectures submitted and fifteen new prefectures were approved.',
  },
  s0253: {
    literal:
      'In the third month, on renchen new moon, an edict ordered Left Vice Director Pei Mian, Right Vice Director Guo Yingyi, Heir Apparent Junior Tutor Pei Zunqing, Acting Heir Apparent Junior Tutor Bai Zhizhen, Heir Apparent Household Administrator Zang Xirang, Left Palace Companion Chang Hui, Acting Minister of Punishments Wang Ang, Acting Minister of Works Cui Huan, Minister of Civil Appointments Vice Directors Li Jiqing and Wang Yanchang, Vice Minister of Rites Jia Zhi, Prince of Jing tutor Wu Lingyao, and thirteen others altogether to await edicts at the Hall of Assembled Worthies.',
    idiomatic:
      'Third month: thirteen senior ministers were ordered to the Hall of Assembled Worthies to await imperial drafts.',
  },
  s0254: {
    literal:
      'The emperor thought that when separate ministers had ceased holding commissions, the capital had no duties — they should still assemble in the forbidden gate academy; from time to time literary Confucian dukes and ministers were added — this was favor.',
    idiomatic:
      'Retired commissioners were kept at the palace academy as a mark of favor when they lacked active posts.',
  },
  s0255: {
    literal: 'They were specially granted three thousand strings of meal money.',
    idiomatic: 'Each received three thousand strings for meals.',
  },
  s0256: {
    literal: 'On gengzi night frost fell; trees bore ice.',
    idiomatic: 'On gengzi night frost glazed the trees with ice.',
  },
  s0257: {
    literal: 'Famine year — rice a thousand cash per dou; all grains were dear.',
    idiomatic: 'Famine drove grain to a thousand cash per dou and every crop dear.',
  },
  s0258: {
    literal:
      'On bingwu Fengxiang Li Baoyu declined Grand Mentor; it was granted; he was appointed Left Vice Director and Associate Grand Secretariat.',
    idiomatic:
      'On bingwu Li Baoyu gave up grand mentor for left vice director and chancellorship.',
  },
  s0259: {
    literal: 'On gengxu Tibet requested peace.',
    idiomatic: 'On gengxu Tibet sued for peace.',
  },
  s0260: {
    literal:
      'An edict ordered Chancellor Yuan Zai and Du Hongjian to ally with Tibetan envoys at Xingqing Temple.',
    idiomatic:
      'Yuan Zai and Du Hongjian swore peace with Tibet at Xingqing Temple.',
  },
  s0261: {
    literal: 'On xinhai a great wind uprooted trees.',
    idiomatic: 'On xinhai a gale uprooted trees.',
  },
  s0262: {
    literal: 'That spring great drought; capital rice was dear — a hu reached ten thousand cash.',
    idiomatic: 'Spring drought pushed Chang\'an grain to ten thousand cash per hu.',
  },
  s0263: {
    literal: 'In the fourth month of summer, on jisi, rain finally fell.',
    idiomatic: 'Fourth month, jisi: rain ended the drought.',
  },
  s0264: {
    literal: 'On wuzi retired Grand Mentor Miao Jinqing died.',
    idiomatic: 'On wuzi Miao Jinqing died in retirement.',
  },
  s0265: {
    literal:
      'On gengyin Jiannan military commissioner, acting Minister of Civil Appointments Yan Wu died.',
    idiomatic:
      'On gengyin Yan Wu of Jiannan died.',
  },
  s0266: {
    literal:
      'On guichou Right Vice Director of the Imperial Secretariat, Prince of Dingxiang commandery Guo Yingyi was made Chengdu prefect, Censor-in-Chief, and Jiannan military commissioner.',
    idiomatic:
      'On guichou Guo Yingyi was sent to Chengdu as Jiannan commissioner.',
  },
  s0267: {
    literal: 'That month wheat ripened.',
    idiomatic: 'Wheat ripened that month.',
  },
  s0268: {
    literal:
      'Acting revenue commissioner Diwu Qi memorialized requesting tax of one mu in ten, emulating antiquity\'s one-tenth levy — approved.',
    idiomatic:
      'Diwu Qi\'s ten-percent land tax was approved.',
  },
  s0269: {
    literal:
      'On guihai Minister of Civil Appointments Li Xian returned from southern selection; reaching Jiangling he was demoted to Quzhou prefect.',
    idiomatic:
      'On guihai Li Xian was demoted to Quzhou after southern selection.',
  },
  s0270: {
    literal:
      'From spring there had been no thunder; until this month on jiashen, great wind and thunder.',
    idiomatic:
      'Thunder returned on jiashen after a thunderless spring.',
  },
  s0271: {
    literal:
      'Daibei army was established at Daizhou; Liucheng at Pingzhou; from Tongzhou Shigu county Biqu county was split off.',
    idiomatic:
      'Daibei and Liucheng garrisons were founded and Biqu county carved from Tongzhou.',
  },
  s0272: {
    literal:
      'In the seventh month of autumn, on xinmao new moon, Ziqing military commissioner Hou Xiyi was expelled by deputy Li Huaiyu.',
    idiomatic:
      'Seventh month: Hou Xiyi was ousted by Li Huaiyu at Ziqing.',
  },
  s0273: {
    literal:
      'A decree made Prince of Zheng Li Miao grand ambassador of Pinglu and Ziqing military commission; Huaiyu was ordered to act as regent.',
    idiomatic:
      'Li Miao was named grand ambassador; Huaiyu acted regent at Ziqing.',
  },
  s0274: {
    literal:
      'Because of long drought, near ministers were sent to record prisoners in all capital prisons.',
    idiomatic:
      'Imperial confidants reviewed capital prisoners during the drought.',
  },
  s0275: {
    literal:
      'On jiawu Princess Shengping was married to Chief Commandant of the Horse Empress Cadet Guo Ai.',
    idiomatic:
      'On jiawu Princess Shengping wed Guo Ai.',
  },
  s0276: {
    literal: 'On gengzi rain fell.',
    idiomatic: 'On gengzi it rained at last.',
  },
  s0277: {
    literal: 'Long drought — capital rice fourteen hundred per dou; other grains likewise.',
    idiomatic: 'Despite rain, rice still cost fourteen hundred per dou.',
  },
  s0278: {
    literal:
      'On yihai Henan deputy commander-in-chief and Jingyuan military commissioner Ma Lin was enfeoffed Prince of Fufeng commandery.',
    idiomatic:
      'On yihai Ma Lin became Prince of Fufeng.',
  },
  s0279: {
    literal: 'On xinmao the White Planet crossed the sky.',
    idiomatic: 'On xinmao Venus transited the meridian.',
  },
  s0280: {
    literal: 'On dingyou Pugu Huai\'en died at Mingsha county in Lingzhou.',
    idiomatic: 'On dingyou Pugu Huai\'en died at Mingsha in Lingzhou.',
  },
  s0281: {
    literal:
      'At the time Huai\'en had incited several hundred thousand Tibetans to raid Binzhou; guest officers Shangpin Xizanmo and Shang Xidongzan and others raided Fengtian and Liquan; Tangut Qiang, Hun, and Nulaz raided Tongzhou and Fengtian, pressing Fengxiang prefecture and Zhouzhi county — the capital was on alert.',
    idiomatic:
      'He had stirred vast Tibetan raids while Qiang and Hun allies pressed the capital approaches.',
  },
  s0282: {
    literal:
      'Because of the star anomaly and barbarian invasion, the inner palace issued two carriages of the Benevolent King Sutra to Zisheng and Ximing monasteries, setting hundred-foot high seats to lecture it.',
    idiomatic:
      'A celestial omen and invasion brought public lectures on the Benevolent King Sutra at two monasteries.',
  },
  s0283: {
    literal: 'When slave barbarians pressed the capital region, the lectures were only then stopped.',
    idiomatic: 'The sermons stopped only when invaders neared the capital.',
  },
  s0284: {
    literal:
      'On jiyou Guo Ziyi came from Hezhong, advanced and encamped at Jingyang; Li Zhongchen encamped at East Wei Bridge, Li Guangjin at Yunyang, Ma Lin and Hao Yu at Bian Bridge, Luo Fengxian and Li Boyue at Zhouzhi, Li Baoyu at Fengxiang, Zhou Zhiguang at Tongzhou, Du Mian at Fangzhou.',
    idiomatic:
      'On jiyou Guo Ziyi and a ring of generals encircled the capital with their camps.',
  },
  s0285: {
    literal: 'The emperor personally led the Six Armies encamped within the park.',
    idiomatic: 'The emperor camped with the Six Armies inside the palace park.',
  },
  s0286: {
    literal: 'On gengxu an edict ordered the emperor to campaign in person.',
    idiomatic: 'On gengxu he proclaimed a personal campaign.',
  },
  s0287: {
    literal:
      'Eunuch Yu Chao\'en spoke up requesting requisition of private horses; capital men were all clothed in black and mustered; one of the capital\'s two gates was blocked.',
    idiomatic:
      'Yu Chao\'en demanded private horses and black-clad militia; panic filled the city as people fled over walls.',
  },
  s0288: {
    literal:
      'Gentry and commoners were greatly terrified; some climbed walls and bored holes to flee the city — clerks could not forbid it.',
    idiomatic:
      'Officials could not stop the flight of terrified citizens.',
  },
  s0289: {
    literal: 'From bingwu to jiayin great rain fell; water flowed on level ground.',
    idiomatic: 'From bingwu to jiayin floods covered the streets.',
  },
  s0290: {
    literal:
      'On dingsi Tibet greatly plundered tens of thousands of men and women in the capital region, burned dwellings, and departed.',
    idiomatic:
      'On dingsi Tibetans looted the suburbs and withdrew burning towns.',
  },
  s0291: {
    literal:
      'Tong-Hua military commissioner Zhou Zhiguang with troops pursued at Chengcheng and broke more than ten thousand bandits.',
    idiomatic:
      'Zhou Zhiguang pursued and killed ten thousand at Chengcheng.',
  },
  s0292: {
    literal:
      'In the tenth month of winter, on jiwei, the Benevolent King Sutra was lectured again at Zisheng Monastery.',
    idiomatic:
      'Tenth month: the Benevolent King Sutra lectures resumed.',
  },
  s0293: {
    literal: 'Tibetans reached Binzhou, met the Uyghur, and again joined to enter in raid.',
    idiomatic: 'At Binzhou Tibetans allied again with Uyghurs and raided together.',
  },
  s0294: {
    literal: 'On xinyou they pressed Fengtian.',
    idiomatic: 'On xinyou they besieged Fengtian.',
  },
  s0295: {
    literal: 'On guihai Tangut attacked Tongzhou and burned the people\'s dwellings.',
    idiomatic: 'On guihai Tangut burned Tongzhou.',
  },
  s0296: {
    literal: 'On dingchou Guo Ziyi persuaded the Uyghur, making them suspect and divide from Tibet.',
    idiomatic: 'On dingchou Guo Ziyi turned Uyghur against Tibetan allies.',
  },
  s0297: {
    literal:
      'On gengchen Ziyi\'s vanguard Bai Guangye joined Uyghur troops and struck the Tibetan host west of Lingtai county on the western plain — heads numbered fifty thousand; captives and livestock stretched three hundred li without break.',
    idiomatic:
      'On gengchen Bai Guangye and the Uyghurs slaughtered fifty thousand Tibetans west of Lingtai.',
  },
  s0298: {
    literal: 'On xinsi the capital alert was lifted.',
    idiomatic: 'On xinsi the capital stood down.',
  },
  s0299: {
    literal:
      'On renyang Pugu Huai\'en\'s great general Pugu Mingchen came to surrender with a thousand horse.',
    idiomatic:
      'On renyang Mingchen defected with a thousand cavalry.',
  },
  s0300: {
    literal: 'An edict levied cash on the hundred officials;',
    idiomatic: 'Officials were taxed for cash;',
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
if (data.metadata.chapter !== '011') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 011; standalone T ready (${Object.keys(T).length} entries).`
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
