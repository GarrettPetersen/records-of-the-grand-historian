#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Jiutangshu ch.011, Daizong) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/011.json';
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
    literal:
      'On xinwei Pugu Huai\'en was made Left Vice Director of the Imperial Secretariat, concurrent Grand Secretariat Director, chief administrator of Lingzhou metropolitan prefecture, and Hebei deputy commander-in-chief.',
    idiomatic:
      'On xinwei Pugu Huai\'en became left vice director, chancellor, Lingzhou chief, and Hebei deputy supreme commander.',
  },
  s0102: {
    literal: 'Zhennan army was newly established at Qiongzhou.',
    idiomatic: 'Qiongzhou gained a new Zhennan garrison.',
  },
  s0103: {
    literal: 'That year a great epidemic struck Jiangdong; more than half died.',
    idiomatic: 'Jiangdong suffered plague that year; over half the population perished.',
  },
  s0104: {
    literal: 'Tibetans took our Lin, Tao, Cheng, Wei, and other prefectures.',
    idiomatic: 'Tibetans seized Lin, Tao, Cheng, Wei, and neighboring prefectures.',
  },
  s0105: {
    literal: 'Guangde 1, in the first month of spring, on dinghai new moon.',
    idiomatic: 'First month of spring, Guangde 1, dinghai new moon.',
  },
  s0106: {
    literal:
      'On jiawu Households Minister, concurrent Censor-in-Chief, overall commander of Huainan military and observation and the like, Duke of Yue Li Qian died.',
    idiomatic:
      'On jiawu Li Qian, Duke of Yue and Huainan commander, died.',
  },
  s0107: {
    literal:
      'National University Chancellor, concurrent Censor-in-Chief, Jingzhao prefect Liu Yan was made Minister of Civil Appointments, Grand Secretariat Associate; revenue commissioners unchanged.',
    idiomatic:
      'Liu Yan became Minister of Civil Appointments and chancellor while keeping his revenue posts.',
  },
  s0108: {
    literal:
      'On renyin a decree stripped Acting Three Excellencies, acting Minister of War, Grand Secretariat Associate, Hedong South circuit military and pacification commissioner, Upper Pillar of State, Duke of Ying Lai Tian of all ranks held in person, banished him far to Bozhou, and soon ordered his death on the road.',
    idiomatic:
      'On renyin Lai Tian was stripped of rank, exiled to Bo, and executed en route.',
  },
  s0109: {
    literal:
      'In the intercalary month, on wushen, Shi Chaoyi\'s surrendering general Li Baochen was made acting Minister of Rites, concurrent Censor-in-Chief, Hengzhou prefect, Prince of Qinghe commandery, and Chengdé army military commissioner;',
    idiomatic:
      'Intercalary month, wushen: Li Baochen was made Chengdé commissioner and Prince of Qinghe;',
  },
  s0110: {
    literal:
      'Xue Song was made acting Minister of Punishments, Xiangzhou prefect, and Xiang-Wei circuit military commissioner;',
    idiomatic:
      'Xue Song became Xiang-Wei commissioner;',
  },
  s0111: {
    literal:
      'Li Huaixian acting Minister of War, concurrent Palace Attendant, Prince of Wuwei commandery, and Youzhou military commissioner;',
    idiomatic:
      'Li Huaixian became Youzhou commissioner and Prince of Wuwei;',
  },
  s0112: {
    literal:
      'Tian Chengsi acting Minister of Households, Weizhou prefect, Prince of Yanmen commandery, and Wei-Bo circuit defense commissioner.',
    idiomatic:
      'Tian Chengsi received Wei-Bo and the title Prince of Yanmen.',
  },
  s0113: {
    literal:
      'In the second month, on jiawu, the Uyghur Ton-yabghu Qaghan took leave to return to his realm.',
    idiomatic:
      'Second month, jiawu: the Uyghur qaghan departed for home.',
  },
  s0114: {
    literal:
      'In the third month, on jiachen new moon, Xiangzhou right army commander Liang Chongyi killed great general Li Zhao, held the city in defiance, and was still appointed Xiangzhou prefect and Hedong South military commissioner.',
    idiomatic:
      'Third month: Liang Chongyi murdered Li Zhao, seized Xiangzhou, and was rewarded with the commission.',
  },
  s0115: {
    literal: 'On dingwei Yuan Dai defeated Yuan Chao\'s forces in eastern Zhejiang.',
    idiomatic: 'On dingwei Yuan Dai crushed Yuan Chao in eastern Zhejiang.',
  },
  s0116: {
    literal: 'Xuanzong and Suzong were interred in the mountain tombs.',
    idiomatic: 'Xuanzong and Suzong were buried in the imperial tombs.',
  },
  s0117: {
    literal:
      'From the first day of the third month court was suspended until month\'s end; the hundred officials in plain dress went to Yanying Gate to announce names and pay respects.',
    idiomatic:
      'Court was closed all third month; officials in mourning dress reported at Yanying Gate daily.',
  },
  s0118: {
    literal:
      'In the fourth month, on wuyin new moon, Taizhou was restored as Huazhou and Taiyin county as Huayin county.',
    idiomatic:
      'Fourth month: Taizhou reverted to Huazhou; Taiyin to Huayin.',
  },
  s0119: {
    literal:
      'On gengchen Hebei deputy commander-in-chief Li Guangbi memorialized the capture of Yuan Chao alive; eastern Zhejiang prefectures and counties were all pacified.',
    idiomatic:
      'On gengchen Li Guangbi reported Yuan Chao captured and eastern Zhejiang pacified.',
  },
  s0120: {
    literal: 'Subordinate ministers requested the emperor be given an honorific title.',
    idiomatic: 'Officials petitioned for an honorific reign title.',
  },
  s0121: {
    literal: 'In the fifth month, on guimao new moon.',
    idiomatic: 'Fifth month, guimao new moon.',
  },
  s0122: {
    literal:
      'On bingyin the Ministry of Civil Appointments tested decree-examination candidates; Left and Right Vice Directors and Vice Ministers paired to examine them; food was granted as in old ritual.',
    idiomatic:
      'On bingyin decree examinations were held with vice ministers as examiners and the old feast granted.',
  },
  s0123: {
    literal:
      'Grand Master of Splendid Happiness Du Hongjian memorialized: "Wedding and funeral processions should receive guard of honor — We hope that for those who established great merit for the state and for kin of second rank and above it be granted; the rest are outside the limit of grant.',
    idiomatic:
      'Du Hongjian urged that funeral and wedding escorts be granted only to great merit-holders and kin of second rank or higher.',
  },
  s0124: {
    literal: '」 It was approved.',
    idiomatic: 'Thus ended the memorial; it was approved.',
  },
  s0125: {
    literal: 'In the sixth month, on guiyou new moon.',
    idiomatic: 'Sixth month, guiyou new moon.',
  },
  s0126: {
    literal:
      'On guiwei Chen-Zheng-Ze-Lu military commissioner Li Baoyu was made acting Grand Minister of Works and enfeoffed Prince of Wuwei commandery;',
    idiomatic:
      'On guiwei Li Baoyu became acting grand minister of works and Prince of Wuwei;',
  },
  s0127: {
    literal:
      'Hezhong military commissioner Wang Ang was made acting Minister of Punishments and enfeoffed Duke of Yi commandery;',
    idiomatic:
      'Wang Ang became acting minister of punishments and Duke of Yi;',
  },
  s0128: {
    literal: 'Tong-Hua military commissioner Li Huairang was made acting Minister of Works.',
    idiomatic: 'Li Huairang became acting Minister of Works.',
  },
  s0129: {
    literal: 'The same day they entered the Secretariat; the chancellor presented them.',
    idiomatic: 'All three entered the Secretariat that day at the chancellor\'s presentation.',
  },
  s0130: {
    literal:
      'On jiashen former Huai-Xi military commissioner Wang Zhongsheng was made Right Forest General of the Guard and concurrent Censor-in-Chief.',
    idiomatic:
      'On jiashen Wang Zhongsheng became right guard general and censor-in-chief.',
  },
  s0131: {
    literal: 'Six-army generals concurrently holding the censor title began with Zhongsheng.',
    idiomatic: 'Six-army generals holding the censor post began with Zhongsheng.',
  },
  s0132: {
    literal: 'On jiawu Army Viewing Commissioner Yu Chao\'en entered court from Shazhou.',
    idiomatic: 'On jiawu Yu Chao\'en arrived from Shazhou.',
  },
  s0133: {
    literal:
      'The emperor went to Dali Gate and ordered dukes, ministers, and the hundred officials to view the troops and horses.',
    idiomatic:
      'At Dali Gate he held a grand review for the court.',
  },
  s0134: {
    literal: 'Tong-Hua military commissioner Li Huairang killed himself, framed by Cheng Yuanzhen.',
    idiomatic: 'Li Huairang committed suicide after Cheng Yuanzhen framed him.',
  },
  s0135: {
    literal: 'In the seventh month of autumn, on renyin new moon.',
    idiomatic: 'Seventh month, renyin new moon.',
  },
  s0136: {
    literal:
      'On wushen the ministers presented the honorific Sagacious Martial of Baoying and Primordial Sage; he received the seal at Hanyuan Hall.',
    idiomatic:
      'On wushen he took the title Sagacious Martial of Baoying and Primordial Sage at Hanyuan Hall.',
  },
  s0137: {
    literal:
      'On renzi he went to Xuanzheng Hall to proclaim the decree, changed the era name to Guangde, and proclaimed a great amnesty under Heaven — even those normally excluded by routine amnesties were all pardoned.',
    idiomatic:
      'On renzi he proclaimed Guangde, universal amnesty, and pardoned even crimes usually excluded.',
  },
  s0138: {
    literal:
      'Kin of An Lushan and Shi Siming on all circuits who should have been punished were all pardoned without inquiry.',
    idiomatic:
      'Relatives of An Lushan and Shi Siming were pardoned everywhere without question.',
  },
  s0139: {
    literal:
      'Households with three males were exempted one corvée laborer; land tax remained two sheng per mu as before.',
    idiomatic:
      'Three-son households lost one corvée; the land tax stayed two sheng per mu.',
  },
  s0140: {
    literal: 'Men formed adult households at twenty; at fifty they entered old age.',
    idiomatic: 'Adulthood began at twenty; old age at fifty.',
  },
  s0141: {
    literal:
      'Commander Prince of Yong was also made Director of the Imperial Secretariat; Hebei deputy commander Pugu Huai\'en was advanced to Grand Mentor; the Uyghur qaghan received an honorific epithet.',
    idiomatic:
      'Prince of Yong became director of the secretariat; Huai\'en grand mentor; the Uyghur qaghan a new title.',
  },
  s0142: {
    literal:
      'Merit lords were all granted iron certificates, their names stored in the Imperial Ancestral Temple, their portraits placed in Lingyan Pavilion.',
    idiomatic:
      'Merit lords received iron charters, temple inscription, and portraits in Lingyan Pavilion.',
  },
  s0143: {
    literal:
      'Prefects and county magistrates from now on were transferred on fixed terms — prefects three years, magistrates four; supernumeraries and acting appointees might not administer affairs.',
    idiomatic:
      'Prefects rotated every three years, magistrates every four; acting officials could not govern.',
  },
  s0144: {
    literal:
      'On dingsi Pugu Chang was made concurrent Censor-in-Chief and Shuofang campaign military commissioner.',
    idiomatic:
      'On dingsi Pugu Chang became censor-in-chief and Shuofang commissioner.',
  },
  s0145: {
    literal:
      'That month Tibetans raided greatly on the He and Long circuits, took our Qin, Cheng, and Wei — three prefectures — entered Dazhen Pass, and took Lan, Kuo, He, Shan, Tao, Min, and other prefectures, seizing the land of Longyou.',
    idiomatic:
      'That month Tibet overran Longyou, taking Qin, Cheng, Wei, and a chain of western prefectures through Dazhen Pass.',
  },
  s0146: {
    literal:
      'In the eighth month, Jingnan military commissioner Li Xian was made Director of the Imperial Clan Court.',
    idiomatic:
      'Eighth month: Li Xian became director of the imperial clan court.',
  },
  s0147: {
    literal:
      'In the ninth month, on renxu new moon, Pugu Huai\'en defied orders at Fenzhou; Chancellor Pei Zunqing was sent to comfort him.',
    idiomatic:
      'Ninth month: Huai\'en rebelled at Fen; Pei Zunqing was sent to pacify him.',
  },
  s0148: {
    literal:
      'On jichou Tibetans raided Jingzhou; prefect Gao Hui surrendered the city and became Tibetan guide.',
    idiomatic:
      'On jichou Gao Hui surrendered Jingzhou to the Tibetans and guided them.',
  },
  s0149: {
    literal: 'In the tenth month of winter, on gengwu new moon.',
    idiomatic: 'Tenth month, gengwu new moon.',
  },
  s0150: {
    literal:
      'On xinwei Gao Hui led Tibetans to invade the capital region, raiding Fengtian, Wugong, Zhouzhi, and other counties.',
    idiomatic:
      'On xinwei Gao Hui guided Tibetans against the capital suburbs.',
  },
  s0151: {
    literal: 'Tibetan troops crossed the Wei at Sizhu Garden and followed the southern hills eastward.',
    idiomatic: 'They crossed the Wei at Sizhu and marched east along the southern hills.',
  },
  s0152: {
    literal:
      'On bingzi the carriage went to Shazhou; the emperor went out the garden gate; archer-general Wang Xianzhong led four hundred horsemen in revolt, coercing the Prince of Feng and nine other princes to return to the capital.',
    idiomatic:
      'On bingzi the court fled to Shazhou; Wang Xianzhong mutinied with four hundred horse and forced ten princes back toward Chang\'an.',
  },
  s0153: {
    literal: 'Many in the entourage went by the southern-hill valleys toward the mobile court.',
    idiomatic: 'Much of the entourage escaped through southern valleys to join the emperor.',
  },
  s0154: {
    literal: 'Guo Ziyi gathered scattered soldiers and encamped at Shangzhou.',
    idiomatic: 'Guo Ziyi rallied broken units at Shangzhou.',
  },
  s0155: {
    literal: 'On dingchou the court halted at Huazhou; officials hid away; no stores were prepared.',
    idiomatic: 'At Huazhou officials had fled and supplies were gone.',
  },
  s0156: {
    literal:
      'When Yu Chao\'en led the Divine Strategy Army from Shaan to welcome the carriage, the emperor then lodged with Chao\'en\'s army.',
    idiomatic:
      'Yu Chao\'en\'s Divine Strategy Army met him at Shaan, and the emperor lodged with them.',
  },
  s0157: {
    literal:
      'On wuyin Tibetans entered the capital, set up Prince of Guangwu Li Chenghong as emperor, and compelled former Hanlin academician Yu Kefeng to draft investiture documents.',
    idiomatic:
      'On wuyin Tibetans occupied Chang\'an and enthroned Li Chenghong as puppet emperor.',
  },
  s0158: {
    literal: 'On xinsi the carriage reached Shazhou.',
    idiomatic: 'On xinsi the emperor reached Shazhou.',
  },
  s0159: {
    literal:
      'Ziyi at Shangzhou joined Six-Army commissioner Zhang Zhijie, Wu Chongfu, Zhangsun Quanxu, and others, who led troops in succession — military prestige revived.',
    idiomatic:
      'At Shangzhou Guo Ziyi linked with Zhang Zhijie and others until the army\'s spirit returned.',
  },
  s0160: {
    literal:
      'Former general Wang Fu incited the capital\'s ruffians to strike street drums together on Zhuque Avenue; the Tibetan army was shaken and fled in disorder.',
    idiomatic:
      'Wang Fu rallied street toughs to beat drums on Zhuque Avenue, panicking the Tibetans into flight.',
  },
  s0161: {
    literal: 'On gengyin Ziyi recovered the capital.',
    idiomatic: 'On gengyin Guo Ziyi retook Chang\'an.',
  },
  s0162: {
    literal:
      'On renchen Chancellor Yuan Zai was made acting commander-in-chief\'s campaign chief of staff; Jingzhao prefect and acting Minister of Civil Appointments Yan Wu was made Yellow Gate Vice Director; Langzhou prefect Diwu Qi was made Jingzhao prefect and concurrent Censor-in-Chief.',
    idiomatic:
      'On renchen Yuan Zai ran the supreme headquarters; Yan Wu and Diwu Qi received capital and censor posts.',
  },
  s0163: {
    literal: 'On guisi Guo Ziyi was made capital garrison commander.',
    idiomatic: 'On guisi Guo Ziyi became Chang\'an commandant.',
  },
  s0164: {
    literal:
      'Hearing the Tibetans had collapsed, Gao Hui with three hundred horse fled east to Tong Pass and was killed by pass defender Li Boyue.',
    idiomatic:
      'Gao Hui fled east and was killed at Tong Pass by Li Boyue.',
  },
  s0165: {
    literal:
      'In the eleventh month, on xinchou new moon, Court of Imperial Sacrifices erudite Liu Kang memorialized that because Tibetans had violated the capital the fault lay with Cheng Yuanzhen and begged execution to appease the realm.',
    idiomatic:
      'Eleventh month: Liu Kang blamed Cheng Yuanzhen for the fall of Chang\'an and demanded his head.',
  },
  s0166: {
    literal:
      'The emperor greatly approved and accepted it, but because Yuanzhen had protective merit, ranks held in person were stripped and he was released to his home district.',
    idiomatic:
      'The emperor praised the memorial yet spared Yuanzhen for past service, stripping rank and sending him home.',
  },
  s0167: {
    literal:
      'On jiachen the eunuch maritime-trade commissioner Lü Taiyi expelled Huainan South military commissioner Zhang Xiu and let his subordinates plunder Guangzhou greatly.',
    idiomatic:
      'On jiachen eunuch Lü Taiyi drove out Zhang Xiu and looted Guangzhou.',
  },
  s0168: {
    literal: 'On dinghai the carriage departed Shaan commandery to return to the capital.',
    idiomatic: 'On dinghai the court left Shaan for Chang\'an.',
  },
  s0169: {
    literal:
      'On xinmao a great wind struck Ezhou; fire broke out on the river and burned three thousand boats and two thousand households\' dwellings.',
    idiomatic:
      'At Ezhou wind and river fire destroyed three thousand boats and two thousand homes.',
  },
  s0170: {
    literal: 'On jiawu the emperor returned from Shazhou.',
    idiomatic: 'On jiawu the emperor came back from Shazhou.',
  },
  s0171: {
    literal:
      'On yiwei Palace Attendant Miao Jinqing was made Grand Mentor; Yellow Gate Vice Director and Associate Grand Secretariat Pei Zunqing was made Heir Apparent Junior Tutor — both removed from managing government;',
    idiomatic:
      'On yiwei Miao Jinqing became grand mentor and Pei Zunqing heir-apparent tutor; both left the chancellery;',
  },
  s0172: {
    literal:
      'Director of the Imperial Clan Court, Duke of Liang Li Xian was made Yellow Gate Vice Director and Grand Secretariat Associate.',
    idiomatic:
      'Li Xian entered the chancellery as yellow gate vice director.',
  },
  s0173: {
    literal: 'On bingshen Prince of Guangwu Li Chenghong was released at Huazhou; all was not pursued.',
    idiomatic: 'On bingshen the puppet emperor Li Chenghong was freed at Huazhou without punishment.',
  },
  s0174: {
    literal:
      'On dingyou Shuofang campaign military commissioner Pugu Chang presented the severed heads of men under his command.',
    idiomatic:
      'On dingyou Pugu Chang sent heads of executed subordinates.',
  },
  s0175: {
    literal: 'Hearing Chang was dead, Huai\'en burned camp and fled into Tibet.',
    idiomatic: 'When Chang died, Huai\'en burned his camp and fled to Tibet.',
  },
  s0176: {
    literal:
      'Courtiers offered congratulations; the emperor was displeased and said: "Our cool virtue and trust do not reach others, causing meritorious ministers to be overturned — how this increases shame! Why congratulate?',
    idiomatic:
      'When courtiers congratulated him, he refused: "My poor virtue destroyed loyal servants — what is there to celebrate?',
  },
  s0177: {
    literal:
      '」 Cheng Yuanzhen in women\'s dress entered the capital from Sanyuan county; the Jingzhao office seized him and reported — he was sent to the Censorate for interrogation.',
    idiomatic:
      'Thus ended his rebuke. Yuanzhen sneaked into Chang\'an in disguise and was arrested for trial.',
  },
  s0178: {
    literal: 'Tibetans took Songzhou, Weizhou, Yunshan city, and Long city.',
    idiomatic: 'Tibetans seized Song, Wei, and several border fortresses.',
  },
  s0179: {
    literal: 'Guangde 2, in the first month of spring, on jihai new moon.',
    idiomatic: 'First month of spring, Guangde 2, jihai new moon.',
  },
  s0180: {
    literal: 'On renyin the Censorate reported Cheng Yuanzhen\'s case; he was banished to Qinzhou.',
    idiomatic: 'On renyin Yuanzhen was exiled to Qin.',
  },
  s0181: {
    literal:
      'After he had gone, recalling old merit, he was specially shown mercy in the far region and ordered settled at Jiangling prefecture.',
    idiomatic:
      'Later, remembering his service, the court softened his exile to Jiangling.',
  },
  s0182: {
    literal:
      'On jiachen the capital-region observation commissioner was restored, led by the vice censor-in-chief.',
    idiomatic:
      'On jiachen the capital observer post was revived under the vice censor-in-chief.',
  },
  s0183: {
    literal:
      'On guimao Right Secretariat Vice Director Yan Zhenqing was made Minister of Punishments, concurrent Censor-in-Chief, and Shuofang pacification commissioner.',
    idiomatic:
      'On guimao Yan Zhenqing became minister of punishments and Shuofang pacifier.',
  },
  s0184: {
    literal:
      'On guihai Minister of Civil Appointments, Associate Grand Secretariat, revenue and transport commissioner Liu Yan was made Heir Apparent Guest of the Crown; Yellow Gate Vice Director and Associate Li Xian was made Heir Apparent Household Administrator — both removed from managing government.',
    idiomatic:
      'On guihai Liu Yan and Li Xian left the chancellery for heir-apparent posts.',
  },
  s0185: {
    literal:
      'Former Right Palace Companion Wang Jin was made Yellow Gate Vice Director; Grand Master of Splendid Happiness Du Hongjian was made Vice Minister of War — both Grand Secretariat Associates.',
    idiomatic:
      'Wang Jin and Du Hongjian joined the chancellery.',
  },
  s0186: {
    literal:
      'The revenue commissioner was abolished; Households Vice Minister Diwu Qi alone judged revenue and salt-iron transport and coinage of all circuits.',
    idiomatic:
      'Diwu Qi alone took over revenue, salt, transport, and coinage.',
  },
  s0187: {
    literal:
      'On jiazi the commander, Director of the Secretariat, Prince of Yong thrice memorialized yielding the crown prince.',
    idiomatic:
      'On jiazi Prince of Yong three times refused the heirship.',
  },
  s0188: {
    literal:
      'Diwu Qi memorialized that each circuit should establish Ever-Normal Granary commissioner offices, set capital to buy and harmonize grain — approved.',
    idiomatic:
      'Diwu Qi\'s plan for circuit Ever-Normal granaries was approved.',
  },
  s0189: {
    literal:
      'On dingmao Grand Mentor, concurrent Grand Secretariat Director Guo Ziyi was made Hedong deputy commander-in-chief and observer of Hezhong and elsewhere, concurrent Yunzhou metropolitan chief and Chanyu Defender-General of the North.',
    idiomatic:
      'On dingmao Guo Ziyi took Hedong deputy command and northern frontier titles.',
  },
  s0190: {
    literal:
      'In the second month, on jisi new moon, Commander-in-Chief, Director of the Secretariat, Prince of Yong Li Shi was established as crown prince.',
    idiomatic:
      'Second month: Li Shi was made crown prince.',
  },
  s0191: {
    literal:
      'On guiyou the emperor personally offered sacrifice at the Supreme Ultimate Palace and Imperial Ancestral Temple.',
    idiomatic:
      'On guiyou he sacrificed at the Supreme Ultimate and ancestral temples.',
  },
  s0192: {
    literal:
      'On yihai he sacrificed to the August Heaven at the Round Mound; that day he returned to the palace.',
    idiomatic:
      'On yihai he worshipped Heaven at the Round Mound and returned the same day.',
  },
  s0193: {
    literal:
      'On wuyin Lizhou prefect Pei Mian was made Left Vice Director, concurrent Censor-in-Chief, and commissioner for Eastern Capital, Henan, Jiangnan, and Huainan transport.',
    idiomatic:
      'On wuyin Pei Mian became left vice director and transport chief for the east.',
  },
  s0194: {
    literal: 'On jiwei Diwu Qi opened and cleared the Bian Canal.',
    idiomatic: 'On jiwei Diwu Qi reopened the Bian Canal.',
  },
  s0195: {
    literal: 'In the fifth month, on dingyou new moon.',
    idiomatic: 'Fifth month, dingyou new moon.',
  },
  s0196: {
    literal:
      'On wuwu an order added four Palace Companions without regular assignment to the Secretariat and Chancellery — rank regular third grade.',
    idiomatic:
      'On wuwu four new third-rank palace companions were added to the secretariat.',
  },
  s0197: {
    literal:
      'On shen the regional-recommendation categories Filial Piety, Diligence in Farming, and Youth were abolished.',
    idiomatic:
      'Filial-piety and related examination categories were abolished.',
  },
  s0198: {
    literal:
      'On jiazi inlay of pearls and kingfisher feather was forbidden; the responsible offices were ordered to seize it strictly.',
    idiomatic:
      'On jiazi pearl and kingfisher inlay was banned with strict enforcement.',
  },
  s0199: {
    literal:
      'On guiwei a decree stated: "Grand Mentor, concurrent Grand Secretariat Director, chief of Lingzhou metropolitan prefecture, Chanyu Defender-General deputy, Shuofang military commissioner, Guannei revenue and garrison farms salt ponds controller of all foreign tribes deputy ambassador, knowing military affairs, Six Cities water transport commissioner, Hebei deputy commander-in-chief, Upper Pillar of State, Prince of Daning commandery Pugu Huai\'en — his former posts as chief of Lingzhou, Chanyu deputy, and Shuofang military commissioner should all cease; Grand Mentor, concurrent Director of the Secretariat, Prince of Daning are unchanged.',
    idiomatic:
      'On guiwei Huai\'en was stripped of Lingzhou and Shuofang commands but kept grand mentor and princely rank.',
  },
  s0200: {
    literal:
      'In the seventh month, on jiyou, Hebei deputy commander-in-chief, Grand Preceptor, concurrent Palace Attendant, Prince of Linhuai Li Guangbi died at Xuzhou; court mourning was suspended three days.',
    idiomatic:
      'Seventh month, jiyou: Li Guangbi died at Xuzhou; court mourned three days.',
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
