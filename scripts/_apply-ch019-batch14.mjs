#!/usr/bin/env node
/** Batch 14: s1301–s1400 (Jiutangshu ch.019, Yizong–Xizong) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/019.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 1301;
const END = 1400;

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
  s1301: {
    literal: 'Quanzhong was besieging Yizhou; Chucun sent surprise cavalry and the Yan army was routed.',
    idiomatic: 'Chucun\'s surprise cavalry routed the Yan besiegers.',
  },
  s1302: {
    literal: 'That month Quanzhong gathered remnants and attacked Youzhou; Li Keju and his household ascended a tower and burned themselves; Quanzhong styled himself acting commander.',
    idiomatic: 'Li Keju burned himself; Li Quanzhong seized Youzhou.',
  },
  s1303: {
    literal: 'Cangzhou troops mutinied, expelled commander Yang Quanmei, and made yamen officer Lu Yanwei acting commander.',
    idiomatic: 'Cangzhou made Lu Yanwei acting commander.',
  },
  s1304: {
    literal: 'An order made Imperial Guard general, Acting Minister of Education, concurrent Qian prefect, Qianzhong observation commissioner Cao Cheng Acting Grand Guardian, concurrent Cang prefect, Yichang army commander, and Cang-De observation commissioner.',
    idiomatic: 'Cao Cheng took Cang-De command.',
  },
  s1305: {
    literal: 'Hezhong\'s Wang Chongrong repeatedly memorialized that Lingzi sowed discord among circuits; Lingzi sent Binning commissioner Zhu Mei to unite Yan, Yan, Ling, and Xia armies against Hezhong.',
    idiomatic: 'Lingzi sent Zhu Mei against Hezhong.',
  },
  s1306: {
    literal: 'September: Zhu Mei camped at Sha Yuan.',
    idiomatic: 'Zhu Mei camped at Sha Yuan.',
  },
  s1307: {
    literal: 'Wang Chongrong sought aid from Taiyuan.',
    idiomatic: 'Chongrong sought Taiyuan\'s aid.',
  },
  s1308: {
    literal: 'October: Li Keyong led Taiyuan troops south through Yindi Pass.',
    idiomatic: 'Li Keyong marched south through Yindi.',
  },
  s1309: {
    literal: 'November: Hezhong and Taiyuan armies faced imperial guards at Sha Yuan.',
    idiomatic: 'Hezhong and Taiyuan faced the guards at Sha Yuan.',
  },
  s1310: {
    literal: 'Twelfth month, xinhai new moon.',
    idiomatic: 'The twelfth month opened on xinhai.',
  },
  s1311: {
    literal: 'On guiyou the government armies fought together and were beaten by Shatuo; Zhu Mei fled back to Bin.',
    idiomatic: 'Shatuo routed the government army; Zhu Mei fled.',
  },
  s1312: {
    literal: 'Divine Strategy troops scattered and entered the capital to plunder.',
    idiomatic: 'Imperial guards plundered Chang\'an.',
  },
  s1313: {
    literal: 'On yihai Shatuo pressed the capital; Tian Lingzi escorted Xizong to Fengxiang.',
    idiomatic: 'Shatuo pressed Chang\'an; Xizong fled to Fengxiang.',
  },
  s1314: {
    literal: 'When Huang Chao held the capital the nine avenues and three inner precincts still looked intact.',
    idiomatic: 'Chang\'an still looked intact under Huang Chao.',
  },
  s1315: {
    literal: 'When circuit armies broke the rebels they fought for loot and set fires; palaces, wards, and lanes were seven or eight in ten burned.',
    idiomatic: 'Allied looting burned seven or eight parts in ten of the city.',
  },
  s1316: {
    literal: 'After peace Jingzhao mayor Wang Hui repaired for years and barely restored calm.',
    idiomatic: 'Wang Hui had barely restored order.',
  },
  s1317: {
    literal: 'Now mutinous troops burned again; palaces were desolate and turned to wild grass.',
    idiomatic: 'Mutineers burned the barely rebuilt capital to weeds.',
  },
  s1318: {
    literal: 'Guangqi 2, spring, first month, xinsi new moon: the train was at Fengxiang.',
    idiomatic: 'Guangqi 2 opened at Fengxiang.',
  },
  s1319: {
    literal: 'Li Keyong returned to Hezhong; with Zhu Mei and Wang Chongrong he jointly memorialized asking the train to halt at Fengxiang and repeatedly counted Tian Lingzi\'s crimes.',
    idiomatic: 'Keyong, Zhu Mei, and Chongrong denounced Tian Lingzi at Fengxiang.',
  },
  s1320: {
    literal: 'Flying Dragon commissioner Yang Fugong was restored to inner palace secrets.',
    idiomatic: 'Yang Fugong returned to palace secrets.',
  },
  s1321: {
    literal: 'On wuzi Tian Lingzi forced the imperial carriage to seek refuge at Xingyuan.',
    idiomatic: 'Lingzi drove the court toward Xingyuan.',
  },
  s1322: {
    literal: 'On gengyin the train halted at Baoji.',
    idiomatic: 'On gengyin the court halted at Baoji.',
  },
  s1323: {
    literal: 'Minister of Punishments Kong Wei was also made Censor-in-Chief and ordered to lead followers to the train.',
    idiomatic: 'Kong Wei was sent to gather lagging officials.',
  },
  s1324: {
    literal: 'The train had departed by night; chancellors Xiao Zhan, Pei Che, Zheng Changtu, and the hundred officials did not know and could not follow; hence Kong Wei was sent to urge them.',
    idiomatic: 'A night flight left most officials behind; Kong Wei was sent to fetch them.',
  },
  s1325: {
    literal: 'Xiao Zhan hated Lingzi\'s power plays and second ruin of the capital; through Bin\'s memorial-reporting aide Li Songnian at Fengxiang he urgently summoned Zhu Mei to welcome the throne.',
    idiomatic: 'Xiao Zhan summoned Zhu Mei against Lingzi.',
  },
  s1326: {
    literal: 'On guisi Zhu Mei led five thousand foot and horse to Fengxiang.',
    idiomatic: 'Zhu Mei reached Fengxiang with five thousand.',
  },
  s1327: {
    literal: 'Lingzi heard Bin troops had come, escorted the emperor into San Pass, and ordered guards to hold Lingbi.',
    idiomatic: 'Lingzi fled into San Pass before Zhu Mei.',
  },
  s1328: {
    literal: 'When Mei arrived guards scattered; he chased the train hotly to Zuntu Post.',
    idiomatic: 'Zhu Mei chased the imperial train to Zuntu.',
  },
  s1329: {
    literal: 'Heir-presumptive Prince of Xiang Li Yun fell ill and was seized by Mei.',
    idiomatic: 'The ill Prince of Xiang was seized by Zhu Mei.',
  },
  s1330: {
    literal: 'Xingyuan commissioner Shi Jun she, hearing the train had entered the pass, destroyed plank roads and barricaded defiles; the train barely reached by another route while Bin troops followed, perilously close four times.',
    idiomatic: 'Shi Junshe blocked roads; the flight barely escaped Bin pursuers.',
  },
  s1331: {
    literal: 'Second month, xinhai new moon: Ten Armies overseer, Palladium Grand Preceptor Tian Lingzi was made Xichuan army supervision commissioner; inner-secrets Yang Fugong was made Left Divine Strategy commandant.',
    idiomatic: 'Lingzi was sent to supervise Xichuan; Fugong took Left Divine Strategy.',
  },
  s1332: {
    literal: 'Third month, gengchen new moon.',
    idiomatic: 'The third month opened on gengchen.',
  },
  s1333: {
    literal: 'On renwu Xingyuan commissioner Shi Jun she abandoned the city and entered Zhu Mei\'s army.',
    idiomatic: 'Shi Jun she joined Zhu Mei.',
  },
  s1334: {
    literal: 'On bingshen the train reached Xingyuan.',
    idiomatic: 'On bingshen the court reached Xingyuan.',
  },
  s1335: {
    literal: 'On wuchen Hanlin expository academician, Minister of War, edict drafter Du Rangneng was made Vice Minister of War;',
    idiomatic: 'Du Rangneng was made Vice Minister of War;',
  },
  s1336: {
    literal: 'Minister of Punishments, Imperial Censor Kong Wei was made Vice Minister of War and salt-and-iron transport commissioner: both Grand Councillors at present rank.',
    idiomatic: 'Kong Wei joined the council with salt transport.',
  },
  s1337: {
    literal: 'Imperial Guard generals Li Qian, Yang Shouliang, and Yang Shouzong defeated Bin troops at Fengzhou.',
    idiomatic: 'Guard generals beat Bin troops at Fengzhou.',
  },
  s1338: {
    literal: 'Fourth month, gengxu new moon: that night Mars trespassed the moon\'s horn.',
    idiomatic: 'On gengxu night Mars trespassed the moon\'s horn.',
  },
  s1339: {
    literal: 'On renzi Zhu Mei and Li Changfu forced chancellors Xiao Zhan and others at Fengxiang post to ask Heir-presumptive Prince of Xiang Li Yun to oversee state affairs.',
    idiomatic: 'Zhu Mei forced the Prince of Xiang to oversee state affairs.',
  },
  s1340: {
    literal: 'Mei made himself great chancellor and also overseer of the Left and Right Divine Strategy Ten Armies.',
    idiomatic: 'Zhu Mei made himself great chancellor and army overseer.',
  },
  s1341: {
    literal: 'He then drove civil and military officials to escort the Prince of Xiang back to the capital.',
    idiomatic: 'Zhu Mei escorted the false emperor to Chang\'an.',
  },
  s1342: {
    literal: 'Fifth month, jimao new moon.',
    idiomatic: 'The fifth month opened on jimao.',
  },
  s1343: {
    literal: 'On gengchen the Prince of Xiang usurped the throne and proclaimed the era Jianzhen.',
    idiomatic: 'On gengchen the Prince of Xiang declared era Jianzhen.',
  },
  s1344: {
    literal: 'Because Xiao Zhan had first opposed the Prince\'s overseership, he was removed from government and made heir-apparent tutor.',
    idiomatic: 'Xiao Zhan was demoted for opposing the usurpation.',
  },
  s1345: {
    literal: 'Zhu Mei was made Attendant-in-ordinary and salt-and-iron transport commissioner.',
    idiomatic: 'Zhu Mei took transport and the attendancy.',
  },
  s1346: {
    literal: 'Pei Che was made Gate Director, Right Vice Premier, Grand Councillor, and revenue commissioner.',
    idiomatic: 'Pei Che became right vice premier and revenue chief.',
  },
  s1347: {
    literal: 'Secretariat Vice Director, Minister of Punishments, Grand Councillor Zheng Changtu was assigned Households.',
    idiomatic: 'Zheng Changtu took Households.',
  },
  s1348: {
    literal: 'Xiao Zhan, claiming illness, returned to Yongle in Hezhong.',
    idiomatic: 'Xiao Zhan retired to Yongle.',
  },
  s1349: {
    literal: 'False orders advanced frontier lords\' ranks.',
    idiomatic: 'The usurper enfeoffed warlords.',
  },
  s1350: {
    literal: 'Huainan commissioner, Acting Grand Preceptor, concurrent Attendant-in-ordinary Gao Pian was made Grand Preceptor, Secretariat Director, Huai salt transport commissioner, and overall campaign commander.',
    idiomatic: 'Gao Pian received vast false honors.',
  },
  s1351: {
    literal: 'Also Huainan right chief escort officer, He prefect Lü Yongzhi was made Acting Minister of War, concurrent Guang prefect, and Lingnan East military commissioner.',
    idiomatic: 'Lü Yongzhi received a false Lingnan command.',
  },
  s1352: {
    literal: 'Households Vice Minister Liu She was sent to Huai-Yang to proclaim; Households Vice Minister Xiahou Tan to Hebei; many frontier lords received false commissions—only Ding, Taiyuan, Xuanwu, and Hezhong refused.',
    idiomatic: 'False envoys toured the realm; four commands refused.',
  },
  s1353: {
    literal: 'That month a comet blazed at Winnow Basket and Tail, crossing Northern Dipper and Bootes.',
    idiomatic: 'A comet crossed Winnow Basket through Bootes.',
  },
  s1354: {
    literal: 'Jingnan and Xiangyang suffered locusts and drought years; rice was thirty thousand cash per dou and many ate one another.',
    idiomatic: 'Famine in Jingnan and Xiangyang drove cannibalism.',
  },
  s1355: {
    literal: 'Yang Fugong\'s brothers had old ties with Hezhong and Taiyuan from breaking rebels together; he memorialized sending Remonstrance Officer Liu Chongwang with edicts to proclaim Fugong\'s intent.',
    idiomatic: 'Liu Chongwang carried Fugong\'s peace edicts.',
  },
  s1356: {
    literal: 'Wang Chongrong and Li Keyong gladly obeyed, soon sent tribute, presented one hundred thousand bolts of silk, and wished to kill Zhu Mei to redeem guilt.',
    idiomatic: 'Chongrong and Keyong offered silk and vowed to kill Zhu Mei.',
  },
  s1357: {
    literal: 'When Chongwang returned, ruler and ministers congratulated one another.',
    idiomatic: 'Court and allies celebrated the reconciliation.',
  },
  s1358: {
    literal: 'Sixth month, jiyou new moon: escort general Yang Shouliang was made Jin prefect, Jin-Shang military commissioner, and capital-region disposition commissioner.',
    idiomatic: 'Yang Shouliang took Jin-Shang command.',
  },
  s1359: {
    literal: 'Shouliang led twenty thousand toward Jinzhou in concert with Wang Chongrong and Li Keyong.',
    idiomatic: 'Shouliang marched twenty thousand in concert with allies.',
  },
  s1360: {
    literal: 'Zhu Mei sent Wang Xingyu with fifty thousand Bin, Ning, Hexi troops at Fengzhou; guard generals Li Qian, Li Maozhen, and Chen Pei resisted at Datang Peak.',
    idiomatic: 'Wang Xingyu camped fifty thousand at Fengzhou.',
  },
  s1361: {
    literal: 'Seventh month, wuyin new moon: Cai rebel Qin Zongquan took Xu and killed Lu Yanhong.',
    idiomatic: 'Qin Zongquan killed Lu Yanhong at Xu.',
  },
  s1362: {
    literal: 'Jin-Shang commissioner Yang Shouliang was made Acting Minister of Education, concurrent Xingyuan mayor, and Shannan West military commissioner.',
    idiomatic: 'Shouliang took Shannan West command.',
  },
  s1363: {
    literal: 'Wang Xingyu pressed Xingzhou hard; Shouliang marched out and defeated him.',
    idiomatic: 'Shouliang defeated Wang Xingyu at Xing.',
  },
  s1364: {
    literal: 'Eighth month: Youzhou commissioner Li Quanzhong died; the three armies made his son Kuangwei acting commander.',
    idiomatic: 'Kuangwei succeeded Li Quanzhong at Youzhou.',
  },
  s1365: {
    literal: 'September: Yang Shouliang again defeated Bin troops at Fengzhou; overseer Yang Fugong secretly persuaded Wang Xingyu to plot return to the dynasty.',
    idiomatic: 'Fugong secretly turned Wang Xingyu loyal.',
  },
  s1366: {
    literal: 'Tenth month, renzi new moon: Hua troops mutinied, expelled commander An Shiru, and pushed yamen officer Zhang Xiao to manage acting command.',
    idiomatic: 'Hua troops expelled An Shiru.',
  },
  s1367: {
    literal: 'Shiru fled to Bianzhou; Zhu Quanzhong killed him, attacked Hua, beheaded Zhang Xiao to report to court, and the court let Bian commander Quanzhong also hold Yicheng command.',
    idiomatic: 'Quanzhong killed An Shiru and took Yicheng.',
  },
  s1368: {
    literal: 'On renchen night a white rainbow appeared in the west.',
    idiomatic: 'On renchen night a white rainbow shone west.',
  },
  s1369: {
    literal: 'Eleventh month: Cai rebel Sun Ru took Zhengzhou; prefect Li Fan escaped.',
    idiomatic: 'Sun Ru took Zhengzhou.',
  },
  s1370: {
    literal: 'Ru led troops to attack Heyang.',
    idiomatic: 'Sun Ru attacked Heyang.',
  },
  s1371: {
    literal: 'Twelfth month, yisi new moon.',
    idiomatic: 'The twelfth month opened on yisi.',
  },
  s1372: {
    literal: 'That month Zhu Mei\'s beloved officer Wang Xingyu, receiving a secret edict, led troops from Fengzhou back to Chang\'an.',
    idiomatic: 'Wang Xingyu returned to Chang\'an on a secret edict.',
  },
  s1373: {
    literal: 'On xinyou Xingyu beheaded Zhu Mei and several hundred partisans and let troops plunder widely.',
    idiomatic: 'Wang Xingyu beheaded Zhu Mei and plundered Chang\'an.',
  },
  s1374: {
    literal: 'That winter was bitterly cold; snow piled in the avenues; on the night troops entered the cold was fiercer; after officials and people were stripped many froze to death covering the ground.',
    idiomatic: 'Bitter cold after plunder left corpses frozen in the streets.',
  },
  s1375: {
    literal: 'Pei Che, Zheng Changtu, and the hundred officials escorted the Prince of Xiang to Hezhong; Wang Chongrong falsely welcomed them, seized Li Yun and beheaded him, chained Pei Che and Zheng Changtu in prison, and nearly half the civil and military officials were killed.',
    idiomatic: 'Chongrong executed the false emperor and half his court.',
  },
  s1376: {
    literal: 'Chongrong sent the Prince of Xiang\'s head in a box to the train.',
    idiomatic: 'Chongrong sent the usurper\'s head to Xingyuan.',
  },
  s1377: {
    literal: 'The Ministry of Punishments asked to hold captives-display at Xingyuan\'s south gate, review heads and captives, and receive congratulations; the Rites Bureau was ordered to set ritual.',
    idiomatic: 'The court planned a victory ritual at Xingyuan.',
  },
  s1378: {
    literal: 'Erudite Yin Yingsun memorialized, saying:',
    idiomatic: 'Erudite Yin Yingsun objected to the victory rite:',
  },
  s1379: {
    literal: 'The congratulatory rite was therefore stopped.',
    idiomatic: 'The victory ceremony was canceled.',
  },
  s1380: {
    literal: 'When Zhu Mei\'s head arrived, they then held the tower rite to receive captives and heads.',
    idiomatic: 'When Zhu Mei\'s head arrived the tower rite was held.',
  },
  s1381: {
    literal: 'That month Cai rebel Sun Ru took Heyang; Zhuge Zhongfang fled to Bianzhou; officer Li Hanzhi held Zezhou and Zhang Quanyi held Huaizhou.',
    idiomatic: 'Sun Ru took Heyang; Li Hanzhi and Zhang Quanyi held Ze and Huai.',
  },
  s1382: {
    literal: 'Guangqi 3, spring, first month, yihai new moon: the train was at Xingyuan.',
    idiomatic: 'Guangqi 3 opened at Xingyuan.',
  },
  s1383: {
    literal: 'An order made Bin general Wang Xingyu Acting Minister of Punishments, concurrent Bin prefect, and Bin-Ning-Qing military commissioner.',
    idiomatic: 'Wang Xingyu received Binning command.',
  },
  s1384: {
    literal: 'Imperial Guard general Li Qian was made Acting Minister of Works, Qian prefect, and Qianzhong observation commissioner;',
    idiomatic: 'Li Qian took Qianzhong;',
  },
  s1385: {
    literal: 'escort commander Li Maozhen was made Acting Left Vice Premier, Yang prefect, and Wuding army commander;',
    idiomatic: 'Li Maozhen took Wuding command;',
  },
  s1386: {
    literal: 'escort commander Yang Shouzong was made Jin prefect and Jin-Shang military commissioner;',
    idiomatic: 'Yang Shouzong took Jin-Shang;',
  },
  s1387: {
    literal: 'Imperial Guard general Chen Pei was made Acting Right Vice Premier, Xuan prefect, and Xuan-She observation commissioner.',
    idiomatic: 'Chen Pei took Xuan-She.',
  },
  s1388: {
    literal: 'Vice Minister of War, transport and corvée commissioner Zhang Jun was made Grand Councillor at his present rank.',
    idiomatic: 'Zhang Jun joined the council.',
  },
  s1389: {
    literal: 'Second month, yisi new moon: Runzhou garrison officer Liu Hao and revenue commissioner Xue Lang conspired to expel commander Zhou Bao; Liu Hao styled himself acting commander.',
    idiomatic: 'Liu Hao expelled Zhou Bao at Runzhou.',
  },
  s1390: {
    literal: 'Third month, yihai new moon.',
    idiomatic: 'The third month opened on yihai.',
  },
  s1391: {
    literal: 'On jiashen the train returned toward the capital and halted at Fengxiang.',
    idiomatic: 'On jiashen the court halted at Fengxiang returning home.',
  },
  s1392: {
    literal: 'Because palaces were unfinished, commissioner Li Changfu asked the train to halt until work was done.',
    idiomatic: 'Li Changfu asked the court to wait for palace repairs.',
  },
  s1393: {
    literal: 'Hezhong sent the false chancellors Pei Che and Zheng Changtu in fetters and ordered them beheaded at Qishan county.',
    idiomatic: 'Pei Che and Zheng Changtu were beheaded at Qishan.',
  },
  s1394: {
    literal: 'Retired heir tutor Xiao Zhan was granted death at Yongle county.',
    idiomatic: 'Xiao Zhan was ordered to die at Yongle.',
  },
  s1395: {
    literal: 'Special Emeritus, historiography supervisor, Gate Director, Minister of Personnel, Grand Councillor Kong Wei was placed over salt-and-iron transport.',
    idiomatic: 'Kong Wei took salt transport.',
  },
  s1396: {
    literal: 'Academician Director, Secretariat Vice Director, Minister of War, Grand Councillor Du Rangneng was advanced Duke of Xiangyang with three thousand added households.',
    idiomatic: 'Du Rangneng became Duke of Xiangyang.',
  },
  s1397: {
    literal: 'Fourth month, jiachen new moon: Yangzhou garrison officer Bi Shiduo from Gaoyou led garrison troops to attack Yangzhou, took it, imprisoned Gao Pian in a side room, and himself directed military affairs.',
    idiomatic: 'Bi Shiduo seized Yangzhou and imprisoned Gao Pian.',
  },
  s1398: {
    literal: 'Cai rebel Qin Xian attacked Bianzhou and ringed thirty-six forts.',
    idiomatic: 'Qin Xian besieged Bian with thirty-six camps.',
  },
  s1399: {
    literal: 'Zhu Quanzhong begged troops from Yan and Yun; Zhu Jin came and camped at Fengchan Temple; Zhu Xuan at Jingrong Fort.',
    idiomatic: 'Zhu Jin and Zhu Xuan reinforced Bian.',
  },
  s1400: {
    literal: 'Fifth month, jiaxu new moon.',
    idiomatic: 'The fifth month opened on jiaxu.',
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
