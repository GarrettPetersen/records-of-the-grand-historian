#!/usr/bin/env node
/** Batch 13: s1201–s1300 (Jiutangshu ch.020, Zhaozong annals) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/020.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 1201;
const END = 1300;

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
  s1201: {
    literal: 'Edict: "The Prince of Liang personally led troops at Pi Wu, recovered Jing and Xiang, took Xian shou as if turning a pellet, pacified Jing Gate as if melting snow, seized two circuits in succession, and together drove off two villains.',
    idiomatic: 'The Prince of Liang led troops at Pi Wu, recovered Jing and Xiang, took Xian shou swiftly, pacified Jing Gate easily, seized two circuits, and drove off two enemies.',
  },
  s1202: {
    literal: 'Thereupon he was mindful of meritorious service and received deep commendation; an edict of reward and decoration should be granted.',
    idiomatic: 'His merit drew deep praise; he was to receive an edict of reward.',
  },
  s1203: {
    literal: '" An edict issued from within stated: "Wet-nurse Yang may be granted the title Zhaoyi; wet-nurse Wang may be enfeoffed as Lady of a Commandery; the second wet-nurse Wang, whom the late emperor had already enfeoffed as Lady of a Commandery, should be re-enfeoffed following Yang\'s precedent.',
    idiomatic: 'An inner edict said wet-nurse Yang would receive the title Zhaoyi, wet-nurse Wang would become a commandery lady, and the second wet-nurse Wang—already enfeoffed by the late emperor—would be re-enfeoffed like Yang.',
  },
  s1204: {
    literal: '" The Secretariat memorialized: "For wet-nurses antiquity had no precedent of enfeoffing ladies or granting inner-court offices; recent ages have followed custom, which greatly departs from canonical models.',
    idiomatic: 'The Secretariat argued that enfeoffing wet-nurses and granting inner offices had no ancient precedent and violated proper ritual.',
  },
  s1205: {
    literal: 'Formerly Emperor Shun of Han made wet-nurse Song Lady of Shanyang; Emperor An\'s wet-nurse Wang was styled Lady of Yewang—court opinion at the time condemned this.',
    idiomatic: 'Han Shundi made his wet-nurse Lady of Shanyang and Andi\'s wet-nurse Lady of Yewang—both were condemned at court.',
  },
  s1206: {
    literal: 'Now the dynastic fortune is reviving; ritual should seek the old models.',
    idiomatic: 'With the dynasty reviving, ritual should return to older models.',
  },
  s1207: {
    literal: 'Your subjects have deliberated: Yang should be granted the title Lady Ansheng; Wang should be styled Lady Fusheng; the second Wang should be styled Lady Kangsheng.',
    idiomatic: 'The ministers proposed Lady Ansheng for Yang, Lady Fusheng for Wang, and Lady Kangsheng for the second Wang.',
  },
  s1208: {
    literal: '" The proposal was approved.',
    idiomatic: 'Approved.',
  },
  s1209: {
    literal: 'On jisi, an edict ordered the temple of King Wucheng changed to King Wuming.',
    idiomatic: 'On jisi the temple of King Wucheng was renamed King Wuming.',
  },
  s1210: {
    literal: 'On yiyou, an edict stated that the southern suburban rite first set for the ninth day of the tenth month, while preparing the ritual objects, had items still incomplete; it should be changed to the nineteenth day of the eleventh month.',
    idiomatic: 'On yiyou the southern suburban rite set for the tenth month\'s ninth day was postponed to the eleventh month\'s nineteenth because preparations were incomplete.',
  },
  s1211: {
    literal: 'On the first day of the tenth month, bingxu, an order made Liang Wang Quanzhong Commander-in-Chief of All Circuits\' Armies and Horses, with a separate commissionerate and staff, and added fief households to a total of fifteen thousand with fifteen hundred actual enfeoffments.',
    idiomatic: 'On bingxu, first of the tenth month, Zhu Quanzhong was made commander-in-chief of all circuits\' armies with a separate staff and fifteen thousand fief households, fifteen hundred enfeoffed.',
  },
  s1212: {
    literal: 'Feng Xingxi of Jin Prefecture memorialized that one character in the local Zhaoxin Army designation matched Commander Quanzhong\'s taboo; the army was therefore renamed Rongzhao.',
    idiomatic: 'Feng Xingxi reported a taboo clash in the army name and it was renamed Rongzhao Army.',
  },
  s1213: {
    literal: 'An order stripped Acting Governor of Jingnan Zhao Kuangning of office and rank.',
    idiomatic: 'Zhao Kuangning of Jingnan was stripped of rank.',
  },
  s1214: {
    literal: 'On dinghai, an edict stated: "Within the wards and lanes of Luoyang city there were formerly mansions of court officials and government offices; after the disorders they lay waste in brambles.',
    idiomatic: 'On dinghai an edict said old official and government mansions in Luoyang\'s wards had been ruined in the disorders.',
  },
  s1215: {
    literal: 'Since Zhang Quanyi\'s restoration, all have been plowed and opened; they already supply military levies and are public fields.',
    idiomatic: 'Since Zhang Quanyi restored them, the land had been plowed for military levies as public fields.',
  },
  s1216: {
    literal: 'Lest there be repeated petitions claiming them as hereditary property, requiring verification and opening the gate to favoritism,',
    idiomatic: 'To stop repeated claims of hereditary ownership and favor-seeking petitions,',
  },
  s1217: {
    literal: 'within the capital wards and planted fields in the capital region, persons of every status may not petition to claim them.',
    idiomatic: 'no one might claim planted fields in the capital wards or nearby region.',
  },
  s1218: {
    literal: 'If one needs farmland, one may buy it outright.',
    idiomatic: 'Those needing land could buy it.',
  },
  s1219: {
    literal: 'All who petition to claim are outside the limit of restoration.',
    idiomatic: 'Claims were not eligible for return.',
  },
  s1220: {
    literal: 'If the original owner had long sent agents to manage the land, that is outside this restriction.',
    idiomatic: 'Land long managed by the original owner\'s agents was exempt.',
  },
  s1221: {
    literal: 'If wasteland has no owner, claiming is permitted.',
    idiomatic: 'Ownerless wasteland could be claimed.',
  },
  s1222: {
    literal: 'Entrusted to Henan Prefecture.',
    idiomatic: 'Henan Prefecture was charged with enforcement.',
  },
  s1223: {
    literal: '" On jiawu, Attendant Su Kai rebutted Emperor Zhaozong\'s posthumous title, saying: "When emperors rule the realm, rise and fall are judged by order and disorder;',
    idiomatic: 'On jiawu Attendant Su Kai challenged Zhaozong\'s posthumous title: emperors\' reputations depend on order versus chaos;',
  },
  s1224: {
    literal: 'ancestral sacrifice matching Heaven relies on posthumous titles to fix elevation and descent.',
    idiomatic: 'posthumous names fix how they are honored in sacrifice.',
  },
  s1225: {
    literal: 'Therefore neither subjects nor rulers may treat this as private.',
    idiomatic: 'Neither ruler nor subject may treat this privately.',
  },
  s1226: {
    literal: 'We submit that Your Majesty follows antiquity and makes utmost fairness manifest; now in an age without taboo, how can the path of remonstrance be blocked?',
    idiomatic: 'Your Majesty follows antiquity and fairness; in an age without taboo, remonstrance must be heard.',
  },
  s1227: {
    literal: 'We submit that Emperor Zhaozong, wise and sagely in dignity, respectful and frugal in transforming the realm, in goodness and beauty who would dare conceal or diminish?',
    idiomatic: 'Zhaozong was wise, respectful, and frugal—who could deny his virtues?',
  },
  s1228: {
    literal: 'Yet adverse fortune did not rise; supreme principle remained depressed, so the four quarters had many affairs and the Son of Heaven moved his seat repeatedly.',
    idiomatic: 'Yet fortune failed, principle was blocked, the realm was troubled, and the throne moved often.',
  },
  s1229: {
    literal: 'At first eunuchs led madness and he suffered seclusion and insult in the Eastern Inner Palace;',
    idiomatic: 'First eunuchs drove him into insult and confinement in the Eastern Palace;',
  },
  s1230: {
    literal: 'at last palace women rebelled and he met untimely obstruction in the inner quarters.',
    idiomatic: 'then palace women rebelled and he died in the inner quarters.',
  },
  s1231: {
    literal: 'As to changing his name, his conduct should be examined.',
    idiomatic: 'His posthumous name should reflect his conduct.',
  },
  s1232: {
    literal: 'The responsible offices first fixed the honored posthumous title Sage, Solemn, Illustrious, Cultured, Filial Emperor, temple name Zhaozong—daring to speak of overflowing praise seems unlike straightforward recording.',
    idiomatic: 'Offices had set Sage, Solemn, Illustrious, Cultured, Filial Emperor with temple name Zhaozong—overpraise unlike honest history.',
  },
  s1233: {
    literal: 'According to Later Han, Emperors He, An, and Shun, because merit was lacking, changed their temple designations to satisfy subjects\' requests.',
    idiomatic: 'Later Han emperors He, An, and Shun changed temple names when merit was lacking, as subjects asked.',
  },
  s1234: {
    literal: 'Now the suburban sacrifice has a set day and the collective ancestral rite is timely.',
    idiomatic: 'With suburban rites and ancestral worship near,',
  },
  s1235: {
    literal: 'We will expect to satisfy the hearts of the former sages and send down further deliberation on the new temple designation.',
    idiomatic: 'the court should satisfy the former emperors and deliberate anew on the temple name.',
  },
  s1236: {
    literal: 'So that the former dynasty\'s virtue of blaming oneself may be joined and the sage ruler\'s fairness without partiality may be displayed.',
    idiomatic: 'This would honor the late dynasty\'s self-blame and show the present ruler\'s impartiality.',
  },
  s1237: {
    literal: '" Kai was son of Minister of Rites Su Xun, vulgar and without talent.',
    idiomatic: 'Kai was son of Su Xun, Minister of Rites—a mediocrity.',
  },
  s1238: {
    literal: 'After passing the jinshi examination in the second year of Qianning, public opinion held it improper; Zhaozong ordered Hanlin Academician Lu Yi and Director of the Secretariat Feng Wo to re-examine and fail him, never permitting entry to the examination grounds again—Kai bore shame and harbored resentment.',
    idiomatic: 'He passed jinshi in Qianning 2 but was failed on re-exam and banned forever—he nursed resentment.',
  },
  s1239: {
    literal: 'At this time Quanzhong had murdered his sovereign; Liu Can framed court officials—he then joined Attendant Luo Gun and Attendant-in-Waiting Lu Ding in a linked memorial of rebuttal.',
    idiomatic: 'Now, with Quanzhong regicide and Liu Can framing ministers, he joined Luo Gun and Lu Ding in a joint rebuttal.',
  },
  s1240: {
    literal: 'Kai could barely see writing and could only hold a brush; the text was written by Luo Gun.',
    idiomatic: 'Kai could barely read; Luo Gun wrote the memorial.',
  },
  s1241: {
    literal: 'Government came from treacherous ministers; Emperor Ai could not control it.',
    idiomatic: 'Power lay with traitors; Emperor Ai was helpless.',
  },
  s1242: {
    literal: 'Director of Imperial Sacrifices Zhang Tingfan changed the posthumous title to Respectful, Numinous, Solemn, Mild, Filial Emperor and the temple name to Xiangzong.',
    idiomatic: 'Zhang Tingfan changed the title to Respectful, Numinous, Solemn, Mild, Filial Emperor and temple name Xiangzong.',
  },
  s1243: {
    literal: 'Quanzhong was fierce, suspicious, and keen in judging things; after Kai\'s rebuttal of the posthumous title he deeply despised him—after the succession, father and son Xun and Kai were both expelled and not permitted at court.',
    idiomatic: 'Quanzhong despised Kai after the rebuttal; once power passed, both Xun and Kai were banished from court.',
  },
  s1244: {
    literal: 'On dingwei, the responsible office retitled Zhaozong\'s spirit tablet; court was suspended one day. On guichou, an edict ordered Chengde Army renamed Wushun; within its jurisdiction Gaocheng County became Gaoping, Xindu became Yaodu, Luancheng became Luanshi, Fucheng became Hanfu, Lincheng became Fangzi—to avoid the names of Quanzhong\'s grandfather and father.',
    idiomatic: 'On dingwei Zhaozong\'s tablet was retitled and court paused a day. On guichou Chengde became Wushun and several counties were renamed for Quanzhong\'s ancestors\' taboos.',
  },
  s1245: {
    literal: 'On the first day of the eleventh month, yimao, an edict ordered Luzhou\'s Lucheng County changed to Luzhi and Licheng to Liting.',
    idiomatic: 'On yimao, first of the eleventh month, Lucheng became Luzhi and Licheng Liting.',
  },
  s1246: {
    literal: 'After Quanzhong pacified Jing and Xiang he led troops to attack Huainan.',
    idiomatic: 'After pacifying Jing and Xiang, Quanzhong marched on Huainan.',
  },
  s1247: {
    literal: 'Stopping at Zaoyang he was blocked by rain; by the time he reached Guang Prefecture the road was perilous and mired, men and horses hungry and exhausted.',
    idiomatic: 'Delayed by rain at Zaoyang, he reached Guang Prefecture with troops exhausted on bad roads.',
  },
  s1248: {
    literal: 'He halted more than ten days, then pressed toward Gushi.',
    idiomatic: 'After ten days\' rest he advanced on Gushi.',
  },
  s1249: {
    literal: 'Advancing to within thirty li of Shou Prefecture, the people of Shou shut their walls and would not come out; those beside him said the army was weary and unusable.',
    idiomatic: 'Thirty li from Shou, the city stayed closed; aides said the army was too worn for battle.',
  },
  s1250: {
    literal: 'On bingchen of that month Quanzhong crossed the Huai north from Zhengyang and reached Ruyin.',
    idiomatic: 'On bingchen he crossed the Huai north from Zhengyang to Ruyin.',
  },
  s1251: {
    literal: 'Quanzhong deeply regretted that this campaign had been useless.',
    idiomatic: 'Quanzhong deeply regretted the useless campaign.',
  },
  s1252: {
    literal: 'On dingmao he reached Daliang.',
    idiomatic: 'He arrived at Daliang on dingmao.',
  },
  s1253: {
    literal: 'At that time Emperor Ai was to perform the suburban rite at the Round Mound on the nineteenth of this month; ritual objects of the central and outer offices were ready.',
    idiomatic: 'Emperor Ai was to sacrifice at the Round Mound on the nineteenth; all ritual gear was ready.',
  },
  s1254: {
    literal: 'On wuchen, chancellors and below rehearsed at the southern suburban altar, while Pei Di returned from Daliang reporting that Quanzhong was enraged at Jiang Xuanhui, Zhang Tingfan, Liu Can, and others for plotting to extend Tang\'s fate and for wishing to sacrifice to Heaven and change the reign era.',
    idiomatic: 'On wuchen ministers rehearsed at the southern altar while Pei Di returned from Daliang saying Quanzhong raged at Jiang Xuanhui, Zhang Tingfan, and Liu Can for prolonging Tang and changing the era at the suburban rite.',
  },
  s1255: {
    literal: 'Xuanhui and Liu Can were greatly afraid.',
    idiomatic: 'Xuanhui and Liu Can were terrified.',
  },
  s1256: {
    literal: 'On gengwu, an edict stated: "The southern suburban rite first fixed for the nineteenth of this month—though the auspicious day was set, changing the divination also has precedent.',
    idiomatic: 'On gengwu an edict said the southern rite fixed for the nineteenth could be rescheduled by precedent.',
  },
  s1257: {
    literal: 'It should be changed to the first xin day of the first month of next year.',
    idiomatic: 'It was moved to the first xin day of next year\'s first month.',
  },
  s1258: {
    literal: 'Entrusted to the responsible offices.',
    idiomatic: 'The offices were charged.',
  },
  s1259: {
    literal: '" On xinsi, an order: "Meritorious subject who turned back Heaven and remade the realm, exhausting loyalty and upholding rectitude; Commander-in-Chief of All Circuits\' Armies and Horses; Commissioner of Xuanwu, Xuanyi, Tianping, Huguo, and other armies; Commissioner for Palace Repair; Commissioner for Revenue and Salt Ponds; Commissioner of Taqing Palace in Bozhou; Acting Three Excellencies; Defender Grand Mentor; Grand Preceptor; Zhongshu Director; Governor of Hezhong; Governors of Bian, Hua, Yun, and other prefectures; Supreme Pillar of State; Prince of Liang; fief of fifteen thousand households with fifteen hundred enfeoffments—Zhu Quanzhong may be appointed Chancellor of State, overseeing all affairs. The twenty-one circuits of Xuanwu, Xuanyi, Tianping, Huguo, Tianxiong, Wushun, Zhongwu, Youguo, Heyang, Yiwu, Zhaoyi, Baoyi, Rongzhao, Wuding, Taining, Pinglu, Kuangguo, Zhenguo, Wuning, Zhongyi, and Jingnan shall form the State of Wei; he is further advanced to Prince of Wei, continuing as before as commander-in-chief, Grand Preceptor, Zhongshu Director, and commissioner of the armies; fief increased by five thousand households with eight thousand five hundred enfeoffments; need not hasten on entering court; may wear sword and shoes in audience; need not be named in congratulation; also granted the Nine Bestowments; a day shall be chosen for full investiture rites."',
    idiomatic: 'On xinsi Zhu Quanzhong was made chancellor of state and Prince of Wei over twenty-one circuits, with the Nine Bestowments, sword and shoes at court, and increased fiefs—full rites to follow.',
  },
  s1260: {
    literal: 'Another order made Yang Shihou acting military commissioner of Xiangzhou and Left Dragon Martial Commander Zhang Shensi acting commissioner of Wuning.',
    idiomatic: 'Yang Shihou was made acting commissioner of Xiangzhou and Zhang Shensi of Wuning.',
  },
  s1261: {
    literal: 'On renwu, the Secretariat memorialized: "The Chancellor of State, Prince of Wei, overseeing all affairs—all offices should submit their office seals.',
    idiomatic: 'On renwu the Secretariat said all offices should surrender seals to the Prince of Wei as chancellor.',
  },
  s1262: {
    literal: 'As to the Secretariat seal, Hall Attendant Wang Rengui shall submit it; Secretariat business shall temporarily use the Secretariat of State seal for dispatch.',
    idiomatic: 'The Secretariat seal would be submitted by Wang Rengui; business would run on the Secretariat of State seal.',
  },
  s1263: {
    literal: '" Approved.',
    idiomatic: 'Approved.',
  },
  s1264: {
    literal: 'On jiashen, an edict ordered Henan\'s Gaocheng County changed to Yangyi; Cai Prefecture\'s Xiangcheng to Baofu; Tong Prefecture\'s Hancheng to Hanyuan; Jiang Prefecture\'s Yicheng to Huichuan; Yun Prefecture\'s Yuncheng to Wan\'an; Ci Prefecture\'s Wencheng to Quyi; Ze Prefecture\'s Jincheng to Gaodu; Yangcheng to Huoze; An Prefecture\'s Yingcheng to Yingyang; Hong Prefecture\'s Fengcheng to Wugao.',
    idiomatic: 'On jiashen many counties were renamed across several prefectures.',
  },
  s1265: {
    literal: 'Quanzhong ordered his aide Sima Ye to decline the appointment as chancellor overseeing all affairs.',
    idiomatic: 'Quanzhong had Sima Ye decline the chancellorship.',
  },
  s1266: {
    literal: 'On the first day of the twelfth month, yiyou.',
    idiomatic: 'First day of the twelfth month, yiyou.',
  },
  s1267: {
    literal: 'On wuzi, an edict ordered Jiang Xuanhui to carry the emperor\'s handwritten edict to the State of Wei, not permitting him to decline the investiture.',
    idiomatic: 'On wuzi Jiang Xuanhui was sent to Wei with the investiture edict and forbidden to decline.',
  },
  s1268: {
    literal: 'On xinmao, an order: Grand Master of Discussion Liu Can, Vice Director of the Secretariat, concurrent Minister of Revenue, Associate Director of the Secretariat, Commissioner of Taiwei Palace, Grand Academician of the Hongwen Institute, Commissioner of the Extended Treasury, Commissioner of Salt and Iron Transport for All Circuits, Supreme Pillar of State, Baron of Hedong with three hundred fief households—may become Grand Master of Splendor, Acting Minister of Works, continuing Vice Director, Associate Director, and all commissions; advanced to Earl of Hedong with seven hundred fief households in all; made Commissioner for Wei Investiture Rites.',
    idiomatic: 'On xinmao Liu Can was promoted to acting Minister of Works, made Earl of Hedong, and named commissioner for Wei investiture.',
  },
  s1269: {
    literal: 'Order: "The Chancellor of State, Prince of Wei\'s great-grandfather, posthumously Grand Tutor Maolin, is posthumously enfeoffed Prince of Wei with posthumous title Xuanxian;',
    idiomatic: 'Quanzhong\'s great-grandfather Maolin was posthumously made Prince of Wei as Xuanxian;',
  },
  s1270: {
    literal: 'grandfather, posthumously Grand Preceptor Xin, posthumously Prince of Wei with posthumous title Wuyuan;',
    idiomatic: 'grandfather Xin was posthumously Prince of Wei as Wuyuan;',
  },
  s1271: {
    literal: 'father, posthumously Director of the Secretariat Cheng, posthumously Prince of Wei with posthumous title Wenming."',
    idiomatic: 'father Cheng was posthumously Prince of Wei as Wenming.',
  },
  s1272: {
    literal: 'Edict: Right Regular Attendant Wang Ju, Director Zhang Tingfan, Attendant-in-Waiting Cui Yi, Minister of Works Li Kezhu, Secretariat Drafting Officer Zhang Maoshu, Drafting Attendant Du Xiao, Ministry Director Li Guangsi, Board Director Zhao Guangyin, Ministry Director Cui Xie, Board Director Yang Huan, Left Regular Attendant Kong Zheng, Right Remonstrator Xiao Yi, Left Reminder Pei Yuan, Right Reminder Gao Ji, Board Director Niu Xiyi, Board Director Xiao Su, and others shall accompany Investiture Commissioner Liu Can in Wei state business.',
    idiomatic: 'Wang Ju, Zhang Tingfan, Cui Yi, and many other officials were ordered to accompany Liu Can for the Wei investiture.',
  },
  s1273: {
    literal: 'Earlier, Northern Commissionery Commissioner Wang Yin went to the Shou Prefecture camp and framed Jiang Xuanhui to Quanzhong; Quanzhong was enraged and hurried back to Daliang.',
    idiomatic: 'Earlier Wang Yin of the Northern Commissionery framed Jiang Xuanhui at Shou; Quanzhong rushed back to Daliang in rage.',
  },
  s1274: {
    literal: 'The emperor sent Minister of Justice Pei Di with an edict to console Quanzhong; Quanzhong was resentful and his words extremely insubordinate—therefore the chancellor appointment was issued to please him.',
    idiomatic: 'Pei Di was sent to console him; Quanzhong answered insubordinately, so the chancellorship was offered to appease him.',
  },
  s1275: {
    literal: 'From the time Jiang Xuanhui reached Daliang to plead his case, Quanzhong\'s anger was still not resolved.',
    idiomatic: 'Jiang Xuanhui\'s pleas at Daliang did not calm Quanzhong\'s anger.',
  },
  s1276: {
    literal: 'The emperor was troubled.',
    idiomatic: 'The emperor was deeply troubled.',
  },
  s1277: {
    literal: 'On jiawu the emperor summoned the three chancellors to discuss the matter; Liu Can said: "Popular expectation returns to the commander-in-chief; Your Majesty yielding and laying down the burden—now is the time."',
    idiomatic: 'On jiawu the three chancellors met; Liu Can said the people wanted the commander-in-chief and the emperor should yield now.',
  },
  s1278: {
    literal: '" The emperor said: "Fortune departed from Tang long ago; fortunately the commander-in-chief has prolonged us.',
    idiomatic: 'The emperor said Tang\'s fortune was long gone and only the commander-in-chief had sustained them.',
  },
  s1279: {
    literal: 'Today\'s realm is not my realm; the sacred vessel and great treasure belong to the virtuous—what doubt is there?"',
    idiomatic: 'The realm and throne belonged to the virtuous—there was no doubt.',
  },
  s1280: {
    literal: 'Others cannot convey my intent fully—you yourself go to Daliang and explain this mind in full."',
    idiomatic: 'Others could not convey his mind—Liu Can must go to Daliang himself.',
  },
  s1281: {
    literal: 'He then bestowed tea and medicine on Can and ordered him to depart at once.',
    idiomatic: 'He gave Can tea and medicine and sent him off immediately.',
  },
  s1282: {
    literal: 'On yiwei, an edict: Commissioner of the Bureau of Military Affairs Jiang Xuanhui should be stripped of all active ranks and sent to Henan Prefecture for execution.',
    idiomatic: 'On yiwei Jiang Xuanhui was stripped of rank and sent to Henan for execution.',
  },
  s1283: {
    literal: 'Fengde Storehouse Commissioner Ying Yi and Food Commissioner Zhu Jianwu were sent to Henan Prefecture for summary execution.',
    idiomatic: 'Ying Yi and Zhu Jianwu were sent to Henan for execution.',
  },
  s1284: {
    literal: 'On gengzi, an edict: the Bureau of Military Affairs and the Southern and Northern Commissioneries of the Palace Secretariat were all abolished.',
    idiomatic: 'On gengzi the Bureau of Military Affairs and both Palace Secretariat commissioneries were abolished.',
  },
  s1285: {
    literal: 'Its military affairs were placed under Wang Yin as acting commissioner.',
    idiomatic: 'Wang Yin was made acting commissioner of military affairs.',
  },
  s1286: {
    literal: 'Personnel of both commissioneries were all compelled to return to the Secretariat.',
    idiomatic: 'Both commissioneries\' staff were sent back to the Secretariat.',
  },
  s1287: {
    literal: 'Personnel of every office and every Taoist may not enter the Commissionery courtyard.',
    idiomatic: 'No office staff or Taoists could enter the commissionery.',
  },
  s1288: {
    literal: 'All public business shall be petitioned at the Secretariat.',
    idiomatic: 'All business went through the Secretariat.',
  },
  s1289: {
    literal: 'At the Yanyi and Qianqiu gates only three junior eunuchs were assigned; guards were compelled back to their original armies.',
    idiomatic: 'Only three junior eunuchs remained at two gates; guards returned to their armies.',
  },
  s1290: {
    literal: 'Edict: "The Prince of Wei firmly declines the favor of appointment, overly displaying cumulative humility."',
    idiomatic: 'The Prince of Wei declined the appointment with excessive humility.',
  },
  s1291: {
    literal: 'We note that in the national histories the commander-in-chief\'s charge is always named for all under Heaven; only in recent years was it changed to "all circuits"—this is not the old system and the correct name must be restored.',
    idiomatic: 'Histories named the post for all under Heaven; the recent "all circuits" title must be corrected.',
  },
  s1292: {
    literal: 'The prior order should be changed to Commander-in-Chief of Armies and Horses of All under Heaven; the rest follows the edict.',
    idiomatic: 'It was changed to commander-in-chief of armies and horses of all under Heaven.',
  },
  s1293: {
    literal: '" On xinchou, an edict: "When Emperor Xuan of Han revived the dynasty, he held court every five days—a rule transmitted through the ages, forever the constant pattern."',
    idiomatic: 'On xinchou an edict cited Han Xuandi holding court every five days as the eternal pattern.',
  },
  s1294: {
    literal: 'Recent ages have not followed the old ritual but have destroyed the system, letting treachery succeed and making imperial audiences abnormal—the old rules must be kept to follow the fixed pattern.',
    idiomatic: 'Recent neglect of the rule let traitors win and audiences go wrong—the old rule must be restored.',
  },
  s1295: {
    literal: 'Each month only the first, fifth, and ninth days should open Yanying Hall—nine sessions in all.',
    idiomatic: 'Yanying was to open only on the 1st, 5th, and 9th of each month—nine times total.',
  },
  s1296: {
    literal: 'On days of entering the Hall, one session of command shall still be held on a Yanying day;',
    idiomatic: 'Entering-the-Hall days would still hold one Yanying session;',
  },
  s1297: {
    literal: 'if there is major public business, the Secretariat shall memorialize with a placard requesting Yanying opened, without counting days.',
    idiomatic: 'major business could open Yanying by Secretariat memorial regardless of date.',
  },
  s1298: {
    literal: 'Entrusted to the responsible offices.',
    idiomatic: 'The offices were charged.',
  },
  s1299: {
    literal: '" Another edict: "Palace women\'s offices were originally for inner service; in recent years ritual has gradually been lost."',
    idiomatic: 'Another edict said palace women\'s offices had drifted from proper ritual.',
  },
  s1300: {
    literal: 'Palace women issuing edicts from within and maids attending morning audience violate old rules and must be permanently forbidden.',
    idiomatic: 'Palace women issuing inner edicts and attending court violated old rules and was permanently forbidden.',
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
