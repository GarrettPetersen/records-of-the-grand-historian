#!/usr/bin/env node
/** Batch 14: s1301–s1400 (Jiutangshu ch.020, Zhaozong annals) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/020.json';
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
    literal: 'Henceforth on each Yanying audience day only junior eunuchs shall attend and lead; palace women may not leave the inner gate without authority, so that canonical ritual may be followed and confusion avoided."',
    idiomatic: 'On Yanying days only junior eunuchs might attend; palace women could not leave the inner gate without authority.',
  },
  s1302: {
    literal: 'On renchen, Rongzhao Army reported recovery of Jin Prefecture; after fire of war the towns were ruined and they requested moving the seat of government to Jun Prefecture—approved.',
    idiomatic: 'On renchen Rongzhao Army recovered Jin; the seat was moved to Jun Prefecture after war ruined the towns.',
  },
  s1303: {
    literal: 'It was still renamed Wuding Army.',
    idiomatic: 'The army was renamed Wuding.',
  },
  s1304: {
    literal: 'On yisi, Bian Prefecture Vice Governor Jiang Zhongshen was executed—Xuanhui\'s uncle.',
    idiomatic: 'On yisi Jiang Zhongshen, Xuanhui\'s uncle, was executed at Bian.',
  },
  s1305: {
    literal: 'Another edict: "Jiang Xuanhui held a post close to the secret, wielding power on his own, selling offices and amassing wealth to build mansions, while harboring rebellion and steeped in treachery.',
    idiomatic: 'Another edict condemned Xuanhui for selling offices, hoarding wealth, and treason.',
  },
  s1306: {
    literal: 'Though the market execution was already the extreme penalty, bending the law still falls short of public wrath; the rite of burning and abandoning the corpse should further be shown to punish manifest guilt."',
    idiomatic: 'Though he was executed, the law still seemed too lenient—his corpse should be burned publicly.',
  },
  s1307: {
    literal: 'He should be posthumously demoted to treacherous commoner; Henan Prefecture is charged to expose the corpse outside the capital gate, gather the crowd, and burn it."',
    idiomatic: 'He was demoted posthumously to treacherous commoner; Henan would expose and burn his corpse at the gate.',
  },
  s1308: {
    literal: 'After Xuanhui\'s death Wang Yin, Zhao Yinheng, and others again slandered him to Quanzhong, saying: "Within the palace it is rumored that Xuanhui privately attended Jishan Palace, with Liu Can and Zhang Tingfan as sworn friends, seeking to revive Tang\'s fortune."',
    idiomatic: 'After his death Wang Yin and Zhao Yinheng told Quanzhong Xuanhui had sworn with Liu Can and Zhang Tingfan to restore Tang.',
  },
  s1309: {
    literal: 'On wushen, Quanzhong ordered Acting Commissioner Wang Yin to kill Empress Dowager He at Jishan Palace, and also killed palace women Aqiu and Aqian, saying they had guided Jiang Xuanhui.',
    idiomatic: 'On wushen Wang Yin killed Empress Dowager He at Jishan Palace and two palace women as Xuanhui\'s accomplices.',
  },
  s1310: {
    literal: 'On jiyou, an edict suspended court for three days for the empress dowager\'s mourning.',
    idiomatic: 'On jiyou court was suspended three days for the empress dowager.',
  },
  s1311: {
    literal: 'The hundred officials finished offering condolences.',
    idiomatic: 'Officials finished condolences.',
  },
  s1312: {
    literal: 'Another edict stated: "The empress dowager bore the earth\'s virtue yet lacked proper motherly conduct.',
    idiomatic: 'Another edict said the empress dowager had failed as mother.',
  },
  s1313: {
    literal: 'Recently when villains were executed, the inner palace was implicated in shameful matters; she then collapsed of herself to answer all quarters."',
    idiomatic: 'After villains were killed, palace scandal implicated her; she died to answer the realm.',
  },
  s1314: {
    literal: 'We, young upon taking the realm, though deep in grief cannot indulge private feeling and with difficulty follow Qin and Han rules—demotion must be shown."',
    idiomatic: 'The young emperor could not indulge grief and followed Qin-Han precedent to demote her.',
  },
  s1315: {
    literal: 'Yellow Gate officials are sent to take back the empress dowager\'s submitted seals; she is posthumously deposed to commoner; officers shall announce at the suburban altars."',
    idiomatic: 'Her seals were recalled, she was deposed to commoner, and altars were notified.',
  },
  s1316: {
    literal: '" On gengxu, an edict: "We wrongly bear the great design and by ritual should personally visit the suburban altars; the first xin day of next year was first fixed for the rite."',
    idiomatic: 'On gengxu an edict said the suburban rite set for next year\'s first xin day followed ritual obligation.',
  },
  s1317: {
    literal: 'Now with disorder within the palace spreading in shameful report, it is hard to enter the ancestors\' temple with a face of shame."',
    idiomatic: 'Palace scandal made a shamefaced visit to the ancestors\' temple impossible.',
  },
  s1318: {
    literal: 'The personal suburban visit on next year\'s first xin day should be stopped."',
    idiomatic: 'Next year\'s suburban visit was canceled.',
  },
  s1319: {
    literal: 'On renzi, an edict ordered Anfu Hall of Jishan Palace abolished.',
    idiomatic: 'On renzi Anfu Hall at Jishan Palace was abolished.',
  },
  s1320: {
    literal: 'On guichou, an edict demoted Grand Master of Splendor, Acting Minister of Works, Vice Director Liu Can to Grand Master of Discussion, Acting Governor of Deng Prefecture.',
    idiomatic: 'On guichou Liu Can was demoted from acting Minister of Works to Governor of Deng.',
  },
  s1321: {
    literal: 'Another edict: "Director Zhang Tingfan, Vice Director Pei Jian, Wen Luan, Drafting Officer Zhang Maoshu, and others—while Jiang Xuanhui was at the Bureau of Military Affairs—formed a faction with Liu Can and Zhang Tingfan, meeting daily, using feasts as pretext while storing designs of peril."',
    idiomatic: 'Another edict said Zhang Tingfan, Pei Jian, Wen Luan, and Zhang Maoshu had conspired with Liu Can and Xuanhui under cover of feasts.',
  },
  s1322: {
    literal: 'Clinging to high rank, they cruelly framed court officials; such hidden plotting cannot escape capital punishment."',
    idiomatic: 'They clung to rank and framed ministers—capital punishment was warranted.',
  },
  s1323: {
    literal: 'Liu Can was already handled by separate edict; Tingfan is demoted to Registrar of Laizhou."',
    idiomatic: 'Liu Can was handled separately; Tingfan became registrar of Laizhou.',
  },
  s1324: {
    literal: 'Pei Jian and others often met together and clearly harbored conspiracy—Jian to Assistant Magistrate of Beihai in Qing, Luan of Linzi, Maoshu of Bochang, all supernumerary appointments."',
    idiomatic: 'Pei Jian went to Beihai, Wen Luan to Linzi, Zhang Maoshu to Bochang—all supernumerary posts.',
  },
  s1325: {
    literal: 'On jiayin, an edict: "Demoted Governor of Deng Liu Can, always proud of crafty cunning, ever bent on perversity.',
    idiomatic: 'On jiayin Liu Can was condemned for cunning and perversity.',
  },
  s1326: {
    literal: 'By vulgar talent he suddenly held high rank, never showing clear achievement, betraying bright favor."',
    idiomatic: 'A mediocrity in high office, he had shown no merit and betrayed the throne.',
  },
  s1327: {
    literal: 'Deceitful in many ways, his hiding could not be fathomed, but he joined with the dangerous and alone harmed the worthy."',
    idiomatic: 'His deceit joined the dangerous and harmed the worthy alone.',
  },
  s1328: {
    literal: 'Guilt filled to overflowing; reason demands exile and death."',
    idiomatic: 'Guilt was full; exile and death were required.',
  },
  s1329: {
    literal: 'He may be demoted to Registrar of Mizhou, again demoted to commoner exiled to Yazhou, entrusted to the Censorate for ordered suicide."',
    idiomatic: 'He was demoted to Mizhou registrar, then exiled to Yazhou as commoner and ordered to kill himself by the Censorate.',
  },
  s1330: {
    literal: 'That day he was beheaded outside the Upper East Gate.',
    idiomatic: 'He was beheaded that day outside the Upper East Gate.',
  },
  s1331: {
    literal: 'Another edict: "Zhang Tingfan\'s nature is only vulgar presumption; his intent is perversity; he could not preserve cautious favor yet harbored dangerous treachery."',
    idiomatic: 'Another edict said Zhang Tingfan was vulgar, perverse, and treacherous.',
  },
  s1332: {
    literal: 'Secretly befriending Liu Can, deeply bonding with Xuanhui, plotting by day and acting by night, deceiving Heaven and betraying earth."',
    idiomatic: 'He secretly joined Liu Can and Xuanhui, plotting day and night.',
  },
  s1333: {
    literal: 'Spirits and gods share anger; guilt cannot be pardoned."',
    idiomatic: 'Gods and men alike condemned him—no pardon.',
  },
  s1334: {
    literal: 'His name should be erased; Henan Prefecture shall gather the crowd in the market and split him with five carts."',
    idiomatic: 'His name was erased; Henan would tear him apart with five carts in the market.',
  },
  s1335: {
    literal: 'Wen Luan, Pei Jian, and Zhang Maoshu shall all have names erased and be entrusted to the Censorate wherever located for ordered suicide."',
    idiomatic: 'Wen Luan, Pei Jian, and Zhang Maoshu were erased and ordered to kill themselves wherever found.',
  },
  s1336: {
    literal: 'Liu Can\'s younger brothers Yu and Jian were sent to Henan Prefecture for summary execution."',
    idiomatic: 'Liu Can\'s brothers Yu and Jian were executed at Henan.',
  },
  s1337: {
    literal: 'In spring, first month, yimao, first day of Tianyou year three—Quanzhong with seventy thousand troops of four circuits joined Hebei armies and encamped at Lecheng in Shen Prefecture.',
    idiomatic: 'Spring, yimao, Tianyou 3: Quanzhong camped at Lecheng with seventy thousand men from four circuits and Hebei allies.',
  },
  s1338: {
    literal: 'On wuwu, an edict demoted Right Reminder Liu Yuan to Assistant Magistrate of Jize in Ming Prefecture—a distant kinsman of Can.',
    idiomatic: 'On wuwu Liu Yuan, Liu Can\'s kinsman, was demoted to Jize magistrate.',
  },
  s1339: {
    literal: 'On yichou, Quanzhong went from the Bian River to Wei Prefecture.',
    idiomatic: 'On yichou Quanzhong went from the Bian River to Wei.',
  },
  s1340: {
    literal: 'On bingyin, an order: "Meritorious subject who settled disorder and pacified the state; Commissioner of Zhenhai and Zhendong; Commissioner of Zhejiang East and West; Commissioner for Huainan East Campaign, Agriculture, and Two-Zhe Salt; Acting Three Excellencies; Defender Palace Attendant; concurrent Zhongshu Director; Governors of Hang and Yue; Supreme Pillar; Prince of Wu; fief nine thousand households with five hundred enfeoffments—Qian Liu, overseeing both circuits and controlling the Three Wu.',
    idiomatic: 'On bingyin an order named Qian Liu Prince of Wu, lord of the Two Zhe circuits and the Three Wu.',
  },
  s1341: {
    literal: 'Because roads were difficult the investiture had not been performed; the responsible offices should choose a day and prepare the full rites.',
    idiomatic: 'Dangerous roads delayed the ceremony—the ministries were to set a date for the rites.',
  },
  s1342: {
    literal: '" On the night of jisi, Weibo Commissioner Luo Shaowei killed eight thousand of his inner guard troops.',
    idiomatic: 'That night of jisi Luo Shaowei killed eight thousand inner guards at Weibo.',
  },
  s1343: {
    literal: 'On wuwu, Quanzhong entered Wei Prefecture from Neihuang.',
    idiomatic: 'On wuwu Quanzhong entered Wei from Neihuang.',
  },
  s1344: {
    literal: 'That month fifty thousand Weibo outer troops returned from Liting and seized Bei, Bo, and other prefectures held by Shaowei; Bian troops besieged them.',
    idiomatic: 'That month fifty thousand Weibo troops seized Shaowei\'s prefectures; Bian forces besieged them.',
  },
  s1345: {
    literal: 'On renshen, an edict: "The Chancellor overseeing all affairs, Prince of Wei, recently declined investiture; the responsible office should again perform investiture rites."',
    idiomatic: 'On renshen Wei investiture was ordered again after Quanzhong\'s refusal.',
  },
  s1346: {
    literal: 'On xinsi, the Directorate of Education reported: "According to the edict of the fifth day of the eleventh month last year, the Directorate each year should send two candidates like other circuits; now sixty students including Guo Yingtu have jointly petitioned."',
    idiomatic: 'On xinsi the Directorate reported sixty students petitioned over the annual quota of two candidates.',
  },
  s1347: {
    literal: 'Edict: "The examination for scholars, the Mingjing degree is extremely weighty; annual numbers have fixed rules; last summer\'s provisions guarded against laxity."',
    idiomatic: 'An edict said Mingjing quotas were fixed and last year\'s rules curbed laxity.',
  },
  s1348: {
    literal: 'Now both the Directorate and Henan have memorialized; the Mingjing candidates tested should be sent to the Ministry of Rites by the usual annual quota, the number admitted to be weighed and implemented."',
    idiomatic: 'Mingjing candidates would go to the Ministry of Rites under the usual quota.',
  },
  s1349: {
    literal: 'But favor-seeking and lucky chance must not be indulged."',
    idiomatic: 'Favoritism and luck-seeking were forbidden.',
  },
  s1350: {
    literal: 'Entrusted to the responsible offices."',
    idiomatic: 'The offices were charged.',
  },
  s1351: {
    literal: '"',
    idiomatic: 'The edict closed.',
  },
  s1352: {
    literal: 'On the first day of the second month, jiashen, Weibo Commissioner Luo Shaowei was permitted to establish a private temple for three generations in his circuit.',
    idiomatic: 'On jiashen Luo Shaowei was allowed a three-generation private temple in Weibo.',
  },
  s1353: {
    literal: 'On guimao.',
    idiomatic: 'Guimao day.',
  },
  s1354: {
    literal: 'An edict: this year\'s jinshi admitted by the Ministry of Rites, beyond last year\'s quota, shall admit two more.',
    idiomatic: 'Two more jinshi were admitted beyond last year\'s quota.',
  },
  s1355: {
    literal: 'On the first day of the third month, jiayin.',
    idiomatic: 'First day of the third month, jiayin.',
  },
  s1356: {
    literal: 'On jiaxu, an edict: "Within the jurisdictions of Hezhong and Zhaoyi both have a Ci Prefecture; the territories are not far apart and names are often confused in speech—the Ci Prefecture within Zhaoyi should be renamed Hui Prefecture."',
    idiomatic: 'On jiaxu Zhaoyi\'s Ci Prefecture was renamed Hui to avoid confusion with Hezhong\'s Ci.',
  },
  s1357: {
    literal: 'On renxu, Quanzhong memorialized that Hezhong aide Liu Chong\'s son Kuangtu passed the jinshi this year and was suddenly placed high—fearing public criticism, he requested the Ministry of Rites strike his name.',
    idiomatic: 'On renxu Quanzhong asked the Ministry of Rites to strike Kuangtu, son of Liu Chong, from the jinshi list.',
  },
  s1358: {
    literal: 'On wuyin, an order made Commander-in-Chief Prince of Liang also oversee Salt and Iron Transport for All Circuits, judge Revenue and Household affairs, and serve as Commissioner-in-Chief of the Three Offices.',
    idiomatic: 'On wuyin the Prince of Liang took salt, iron, transport, revenue, and the Three Offices.',
  },
  s1359: {
    literal: 'On xinsi, an edict demoted Western Capital Acting Governor, Left Remonstrator Zheng Yin to Registrar of Yazhou—soon ordered to death.',
    idiomatic: 'On xinsi Zheng Yin was demoted to Yazhou and soon ordered killed.',
  },
  s1360: {
    literal: 'On the first day of the fourth month, jiashen, there was an eclipse in the Stomach lodge, twelve degrees.',
    idiomatic: 'On jiashen, first of the fourth month, an eclipse hit Stomach at twelve degrees.',
  },
  s1361: {
    literal: 'On wushen, Weibo\'s Luo Shaowei memorialized: "Within my jurisdiction the five counties of Liaocheng in Bo, Wushui in Wuyang, and Bo Ping, Gaotang, etc., all lie east of the Yellow River; village people find crossing to pay tax inconvenient; they adjoin Yun\'s Tianping circuit—request they be ceded to Yun."',
    idiomatic: 'On wushen Luo Shaowei asked five Yellow River counties be ceded to Yun\'s Tianping.',
  },
  s1362: {
    literal: '" Approved.',
    idiomatic: 'Approved.',
  },
  s1363: {
    literal: 'On the first day of the fifth month, guiyou, posthumous restoration of rank was granted to the late Jingnan Commissioner Cheng Run and E-Yue Commissioner Du Hong, with temples in their circuits—following Quanzhong\'s memorial.',
    idiomatic: 'On guiyou Cheng Run and Du Hong were posthumously restored and given temples at Quanzhong\'s request.',
  },
  s1364: {
    literal: 'On bingchen, an edict: "On the twentieth day of the ninth month of Tianyou year two, Rongzhao Army was established at Jin Prefecture, cutting Jun and Fang as subordinate prefectures."',
    idiomatic: 'On bingchen an edict recalled creating Rongzhao Army at Jin from Jun and Fang in Tianyou 2.',
  },
  s1365: {
    literal: 'Recently because Feng Xingxi assisted the founding merit and proclaimed great achievement, to reward the army\'s effect the power to cut territory was exercised."',
    idiomatic: 'Feng Xingxi\'s merit had prompted the territorial cut as reward.',
  },
  s1366: {
    literal: 'Now the commandery has a worthy commander and merit has proper rank—the Rongzhao Army designation should be abolished and Jun and Fang returned to Shannan East Circuit."',
    idiomatic: 'Rongzhao Army was abolished and Jun and Fang returned to Shannan East.',
  },
  s1367: {
    literal: '"',
    idiomatic: 'The edict ended.',
  },
  s1368: {
    literal: 'On the first day of the sixth month, guiwei; on jiashen, an edict: "Xiang Prefecture recently, because Zhao Kuangning became commander, requested a separate Zhongyi Army designation—this was not the old system but a temporary measure."',
    idiomatic: 'On jiashen an edict said Zhongyi Army at Xiang, a temporary measure under Zhao Kuangning, should end.',
  },
  s1369: {
    literal: 'The Zhongyi Army designation should be abolished and it should again be Shannan East Circuit Commissioner."',
    idiomatic: 'Zhongyi was abolished; Shannan East was restored.',
  },
  s1370: {
    literal: 'On jihai, Acting Tang Prefecture affairs Wei Shenfu memorialized that the prefectural seat was ruined and not on a key route; the seat should move to Biyang County—approved.',
    idiomatic: 'On jihai Tang\'s seat moved to Biyang after Shenfu reported ruin and poor location.',
  },
  s1371: {
    literal: 'An order made Capital Governor and Youguo Commissioner Han Jian Commissioner of Qing Prefecture, replacing Wang Chongshi;',
    idiomatic: 'Han Jian replaced Wang Chongshi as Qing commissioner;',
  },
  s1372: {
    literal: 'Chongshi replaced Jian as Capital Governor.',
    idiomatic: 'Chongshi became capital governor.',
  },
  s1373: {
    literal: 'On renyin, an edict: "Civil and military officials of the hundred offices shall once a month enter the Hall at Zhenguan Hall."',
    idiomatic: 'On renyin officials were to enter the Hall monthly at Zhenguan.',
  },
  s1374: {
    literal: 'The great Zhenguan Hall is the court\'s main hall; on solstice days it receives officials\' congratulation."',
    idiomatic: 'Zhenguan was the main hall for solstice congratulations.',
  },
  s1375: {
    literal: 'Recently viewing the new moon, ritual was not correct; henceforth entering the Hall shall be at Chongxun Hall."',
    idiomatic: 'New-moon audiences had been irregular; entering the Hall would move to Chongxun.',
  },
  s1376: {
    literal: 'Entrusted to the responsible offices."',
    idiomatic: 'The offices were charged.',
  },
  s1377: {
    literal: 'Left Reminder Pei Yuan, serving as History Office compiler, because his uncle\'s wife had grave illness at Jiyuan and no brother could attend, requested leave to nurse—approved.',
    idiomatic: 'Pei Yuan was granted leave to nurse his uncle\'s wife at Jiyuan.',
  },
  s1378: {
    literal: 'On the first day of the seventh month, renzi.',
    idiomatic: 'First day of the seventh month, renzi.',
  },
  s1379: {
    literal: 'On jiwei, Quanzhong at last returned from Wei Prefecture to Daliang; the six Weibo prefectures were pacified.',
    idiomatic: 'On jiwei Quanzhong returned to Daliang after pacifying six Weibo prefectures.',
  },
  s1380: {
    literal: 'Acting Minister of Works, Acting Director of the Imperial Clan, Heir of Bin Wang Zhen was suspended from current office and stripped of inherited enfeoffment for requesting leave outside the capital.',
    idiomatic: 'Zhen, heir of Bin, lost office and enfeoffment for unauthorized leave.',
  },
  s1381: {
    literal: 'On xinwei, the emperor\'s younger sister Princess Yongming died; court was suspended three days.',
    idiomatic: 'On xinwei Princess Yongming died; court paused three days.',
  },
  s1382: {
    literal: 'On jiachen, Quanzhong again crossed the Yellow River north from Bian Prefecture to attack Cang Prefecture.',
    idiomatic: 'On jiachen Quanzhong crossed north from Bian to attack Cang.',
  },
  s1383: {
    literal: 'On yiyi, Weibo memorialized ceding six counties—Yongji and Guangzong of Bei, Linhe, Neihuang, Huanshui, and Chiqu of Xiang—to Wei Prefecture—approved.',
    idiomatic: 'On yiyi six counties were ceded from Bei and Xiang to Wei.',
  },
  s1384: {
    literal: 'On the first day of the ninth month, xinhai.',
    idiomatic: 'First day of the ninth month, xinhai.',
  },
  s1385: {
    literal: 'On dingmao, Quanzhong in camp reached Cang Prefecture and encamped at Changlu.',
    idiomatic: 'On dingmao Quanzhong reached Cang and camped at Changlu.',
  },
  s1386: {
    literal: 'That month prolonged overcast rain did not stop; officers were sent to sacrifice at the suburban altars and capital gates.',
    idiomatic: 'Endless rain that month prompted sacrifices at altars and gates.',
  },
  s1387: {
    literal: 'On yiyi of the tenth month, Qian Liu of Two Zhe requested a three-generation private temple in his circuit—approved.',
    idiomatic: 'In the tenth month Qian Liu was allowed a three-generation private temple.',
  },
  s1388: {
    literal: 'On the first day of the eleventh month, gengxu.',
    idiomatic: 'First day of the eleventh month, gengxu.',
  },
  s1389: {
    literal: 'On bingzi, the Cattle and Sheep Office was abolished.',
    idiomatic: 'On bingzi the Cattle and Sheep Office was abolished.',
  },
  s1390: {
    literal: 'Imperial kitchen meat was supplied by Henan Prefecture; all cattle and sheep delivered were entrusted to Henan for custody.',
    idiomatic: 'Kitchen livestock went to Henan Prefecture for custody.',
  },
  s1391: {
    literal: 'On the first day of the twelfth month, jimao, the Huainan pretender\'s Acting Xuan-She Commissioner, Acting Minister of Works Wang Maozhang was made Grand Master of the Gold Seal and Purple Robe, Acting Grand Mentor—following Qian Liu\'s memorial.',
    idiomatic: 'On jimao Wang Maozhang of Huainan was promoted at Qian Liu\'s request.',
  },
  s1392: {
    literal: 'Maozhang had turned from Yang Wo and surrendered Xuan Prefecture to Qian Liu.',
    idiomatic: 'Maozhang had left Yang Wo and surrendered Xuan to Qian Liu.',
  },
  s1393: {
    literal: 'On jichou, Quanzhong memorialized that on civil and military audiences on the 1st, 5th, and 9th the commander\'s office should arrange corridor meals.',
    idiomatic: 'On jichou Quanzhong asked corridor meals arranged on audience days.',
  },
  s1394: {
    literal: 'Edict: "When officials enter court, food is bestowed in both corridors; after the move of the capital the supplying offices were short."',
    idiomatic: 'An edict said corridor food at court had lapsed after the capital move.',
  },
  s1395: {
    literal: 'Commander Prince of Liang wishes to restore great order and old practice so that the ranks may know enhanced favor—an edict of reward should be granted."',
    idiomatic: 'The Prince of Liang would restore corridor meals—he was to receive praise.',
  },
  s1396: {
    literal: 'On jiachen, Heyang Deputy Commissioner Sun Cheng was demoted to Registrar of Yazhou—soon ordered to kill himself.',
    idiomatic: 'On jiachen Sun Cheng was demoted to Yazhou and ordered to kill himself.',
  },
  s1397: {
    literal: 'On the first day of the intercalary twelfth month, jiyou, Fujian commoners and monks came to court requesting a monument to Commissioner Wang Shenzhi\'s virtuous government—approved.',
    idiomatic: 'On jiyou Fujian petitioners won a monument to Wang Shenzhi.',
  },
  s1398: {
    literal: 'On yichou, the Zhenguo Army designation and Xingde Prefecture name were all to be abolished, restored to Governor of Hua Prefecture with defense of the prefecture, subordinate to Tong as a branch prefecture; Hua and Shang counties formerly raised to secondary capital and capital-region status were abolished and old names restored.',
    idiomatic: 'On yichou Zhenguo and Xingde were abolished; Hua reverted to a defense prefecture under Tong.',
  },
  s1399: {
    literal: 'Since the Western Capital Youguo Army became a commandery it had no subordinates; Jin and Shang prefectures should be made subordinate.',
    idiomatic: 'Jin and Shang were made subordinate to the western capital commandery.',
  },
  s1400: {
    literal: 'Fengyi\'s Fengxian County originally belonged to Tong; Liyang adjoined Xia—Fengxian should return to Tong and Liyang to Hua Prefecture.',
    idiomatic: 'Fengxian returned to Tong; Liyang went to Hua.',
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
if (data.metadata.chapter !== '020') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 020; standalone T ready (${Object.keys(T).length} entries).`
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
