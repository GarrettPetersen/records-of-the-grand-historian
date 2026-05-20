#!/usr/bin/env node
/** Batch 11: s1001–s1100 (Jiutangshu ch.018, Wenzong 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/018.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 1001;
const END = 1100;

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
  s1001: {
    literal: 'Regular Grand Master, acting Vice Minister of Punishments, Huazhou prefect, Pillar of State, Baron of Zan with three hundred households and purple-gold fish Xiao Shu was heir-apparent Guest of Honor at the eastern capital.',
    idiomatic: 'Xiao Shu became heir-apparent guest at Luoyang.',
  },
  s1002: {
    literal: 'Fourth month: Bureau of Appointments Director with edict drafting Pei Tan was Secretariat Drafter.',
    idiomatic: 'Pei Tan became Secretariat drafter.',
  },
  s1003: {
    literal: 'Court Gentleman for Discussion, acting Jingzhao prefect Cui Ying was Prince of Pu mentor at the eastern capital — for executing a prefectural clerk;',
    idiomatic: 'Cui Ying was banished to Luoyang for killing a clerk;',
  },
  s1004: {
    literal: 'Jiangxi observation commissioner, Hongzhou prefect, chief investigating censor with purple-gold fish Zhang Yifu was Jingzhao prefect.',
    idiomatic: 'Zhang Yifu replaced him as Jingzhao prefect.',
  },
  s1005: {
    literal: 'Fengxiang commissioner, Regular Grand Master, acting Minister of Revenue, concurrent Fengxiang prefect, Pillar of State, Duke of Jin with three thousand households and one hundred fifty fief households Pei Shi was Xuzhou prefect and Zhongwu army commissioner;',
    idiomatic: 'Pei Shi took Xuzhou and Zhongwu;',
  },
  s1006: {
    literal: 'Vice Minister of Personnel Lu Yi was acting Minister of Works, concurrent Fengxiang prefect, Censor-in-Chief, and Fengxiang-Longyou commissioner;',
    idiomatic: 'Lu Yi took Fengxiang;',
  },
  s1007: {
    literal: 'Secretariat Drafter Zheng Xian was Hongzhou prefect, chief investigating censor, and Jiangxi West observation commissioner, still granted purple-gold fish.',
    idiomatic: 'Zheng Xian took Jiangxi West.',
  },
  s1008: {
    literal: 'Annan consolation commissioner, Right Thousand Bull guard great general Song Ya was Annan Protector, chief investigating censor, and frontier pacification commissioner.',
    idiomatic: 'Song Ya became Annan Protector.',
  },
  s1009: {
    literal: 'Youzhou commissioner Zhang Yunshen\'s younger brothers Yunzhong was Jingzhou prefect, Yunqian Tanzhou, Yunxin Ansa army commander, Yunju Surrender army commander — all concurrent investigating censors.',
    idiomatic: 'Zhang Yunshen\'s brothers received frontier and circuit posts.',
  },
  s1010: {
    literal: 'Former Binning commissioner, Court Gentleman for Discussion, acting Minister of Works, Binzhou prefect, Pillar of State with purple-gold fish Liu Xi was acting Minister of Rites and Henan prefect.',
    idiomatic: 'Liu Xi took Henan.',
  },
  s1011: {
    literal: 'Fifth month: Bureau of Appointments Director Li Xuan was Shouzhou prefect.',
    idiomatic: 'Li Xuan became Shouzhou prefect.',
  },
  s1012: {
    literal: 'Sixth month: Shuofang-Lingwu-Dingyuan commissioner, Palace Companion, acting Left Cavalier, Lingzhou metropolitan prefect with purple-gold fish Liu Tong was Zhengzhou prefect — rushed post because border grain was not timely.',
    idiomatic: 'Liu Tong was rushed to Zhengzhou over late border grain.',
  },
  s1013: {
    literal: 'Annan Protector Song Ya was Rongzhou prefect and Rongguan pacification commissioner.',
    idiomatic: 'Song Ya moved to Rongguan.',
  },
  s1014: {
    literal: 'Invested the third son Guan as Prince of Wei, eleventh son Huang as Prince of Guang.',
    idiomatic: 'Princes Wei and Guang were enfeoffed.',
  },
  s1015: {
    literal: 'Palace Companion, acting Vice Minister of War and finance commissioner, Pillar of State, Baron of Pengcheng with three hundred households and purple-gold fish Xiao Ye was Grand Councillor at his present rank and still finance commissioner.',
    idiomatic: 'Xiao Ye joined the council while keeping finance.',
  },
  s1016: {
    literal: 'Right Palace Gate guard general knowing inner-palace affairs, Duke of Qinghe Cui Juzong was Huainan army supervisor.',
    idiomatic: 'Cui Juzong supervised Huainan troops.',
  },
  s1017: {
    literal: 'Special Advance, acting Minister of Education, heir-apparent Grand Tutor at eastern capital, Pillar of State, Duke of Fufeng with two thousand households Du Xian was at present rank acting eastern-capital Ministry of State director, concurrent Censor-in-Chief, eastern capital regent, and eastern capital defense commissioner.',
    idiomatic: 'Du Xian oversaw Luoyang.',
  },
  s1018: {
    literal: 'Seventh month: Flying Dragon commissioner and inner-palace bureau director Wang Guichang was acting inner Palace Service director knowing affairs and inner Pivot commissioner.',
    idiomatic: 'Wang Guichang became inner Pivot commissioner.',
  },
  s1019: {
    literal: 'Demoted Binzhou supernumerary registrar Zhang Zhifang was Right Brave Guard great general.',
    idiomatic: 'Zhang Zhifang was restored as Right Brave Guard general.',
  },
  s1020: {
    literal: 'Eighth month: Chengd commissioner, acting Right Vice Director Wang Shaoding died — posthumously Minister of Works, condolence silk three hundred bolts.',
    idiomatic: 'Wang Shaoding died and was posthumously Minister of Works.',
  },
  s1021: {
    literal: 'Prince of Zhao Rui was Palace Companion, acting Zhenzhou metropolitan prefect, Chengd commissioner, and Zhen-Ji-Shen-Zhao observation ambassador;',
    idiomatic: 'Prince Rui was named Chengd commissioner;',
  },
  s1022: {
    literal: 'Chengd vice commissioner, overall army commander, Left Army Major knowing affairs, investigating censor Wang Shaoyi was Chengd vice regent.',
    idiomatic: 'Wang Shaoyi became Chengd vice regent.',
  },
  s1023: {
    literal: 'Yiwu commissioner, acting Minister of Rites, Dingzhou prefect, Pillar of State, Baron of Xingyang with three hundred households Zheng Ya was acting Minister of Revenue, Bianzhou prefect, Pillar of State, Xuanwu vice commissioner, and Song-Bo observation commissioner;',
    idiomatic: 'Zheng Ya took Bianzhou and Xuanwu;',
  },
  s1024: {
    literal: 'Four Garrisons-Northern Court, Jingyuan-Longyou commissioner, Silver-glitter Grand Master, acting Right Cavalier, Jingzhou prefect, Censor-in-Chief, Pillar of State, Baron of Fanyang with three hundred households Lu Jianqiu was acting Minister of Works, Dingzhou prefect, Yiwu commissioner, and Yi-Ding observation commissioner;',
    idiomatic: 'Lu Jianqiu was made acting Minister of Works, Ding prefect, Yiwu commissioner, and Yi-Ding observation commissioner;',
  },
  s1025: {
    literal: 'Yanzhou defense commissioner, tribal frontier autumn commander, Wuchi pool tax commissioner, acting Right Cavalier, Yanzhou prefect with purple-gold fish Lu Dan replaced Jianqiu as Jingyuan commissioner.',
    idiomatic: 'Lu Dan replaced Lu Jianqiu at Jingyuan.',
  },
  s1026: {
    literal: 'Hanlin academician, Palace Companion, Secretariat Drafter with purple-gold fish Cao Que was acting Henan prefect.',
    idiomatic: 'Cao Que acted as Henan prefect.',
  },
  s1027: {
    literal: 'Ruzhou defense commissioner Linghu Xu had good government; the prefecture people went to court requesting a merit stele.',
    idiomatic: 'Ruzhou sought a stele for Linghu Xu\'s good rule.',
  },
  s1028: {
    literal: 'Xu, because his brother Tao was in the Secretariat, submitted a memorial begging cancellation — assented.',
    idiomatic: 'Linghu Xu declined the stele while his brother served in council.',
  },
  s1029: {
    literal: 'Acting Grand Master of Ceremonies Su Mi was Minister of War and acting Personnel selection head; Silver-glitter Grand Master, acting Cavalier, Pillar of State, Duke of Bohai with seven hundred households Feng Ao was Grand Master of Ceremonies.',
    idiomatic: 'Su Mi and Feng Ao exchanged Ceremonies and War.',
  },
  s1030: {
    literal: 'That month Mars transgressed the eastern Well.',
    idiomatic: 'Mars crossed the eastern Well that month.',
  },
  s1031: {
    literal: 'Ninth month: Qinzhou prefect Li Chengxun was Palace Companion, acting Minister of Works, Jingzhou prefect, and Four Garrisons-Northern Court Jingyuan-Longyou commissioner;',
    idiomatic: 'Li Chengxun took Jingyuan;',
  },
  s1032: {
    literal: 'Rites Bureau Director Yang Zhiwen was Hanlin academician;',
    idiomatic: 'Yang Zhiwen entered the Hanlin;',
  },
  s1033: {
    literal: 'General-in-Attendance, Vice Minister of Rites with purple-gold fish Du Shenquan was Shan metropolitan prefect, concurrent Censor-in-Chief, and Shan-Guo observation commissioner;',
    idiomatic: 'Du Shenquan took Shan-Guo;',
  },
  s1034: {
    literal: 'Silver-glitter Grand Master, acting Minister of Education, heir-apparent Grand Tutor, Pillar of State, Duke of Fanyang with two thousand households Lu Jun was acting Minister of Education, Grand Councillor, Xingyuan prefect, and Shannan West commissioner.',
    idiomatic: 'Lu Jun took Xingyuan and the council.',
  },
  s1035: {
    literal: 'Right Reminder Chen Gu, Left Reminder Wang Pu, Right Reminder Xue Jie memorialized against sending palace envoys to Luofu Mountain to welcome Master Xuanyuan.',
    idiomatic: 'Three remonstrators opposed fetching Xuanyuan Ji from Luofu.',
  },
  s1036: {
    literal: 'Edict: "We with myriad affairs in profusion personally handle common business; hearing of Luofu recluse Xuanyuan Ji, skilled at nurturing life, age also long — We sent to welcome him, perhaps for slight benefit in ordering."',
    idiomatic: 'Xuanzong said he sought Xuanyuan Ji only for health counsel.',
  },
  s1037: {
    literal: '"We each read former histories and see Qin Shi Huang and Han Wudi deluded by masters of the Way — We take that as warning."',
    idiomatic: 'He cited Qin and Han emperors deluded by immortals.',
  },
  s1038: {
    literal: '"You hold remonstrance posts, received your memorials, deeply accept sincere intent."',
    idiomatic: 'He praised the remonstrators\' sincerity.',
  },
  s1039: {
    literal: '" Still tell Cui Shenyou: speak to the remonstrance officials — though Shao Weng and Luan Da were reborn they could not delude Us."',
    idiomatic: 'He told Cui Shenyou the immortals could not fool him.',
  },
  s1040: {
    literal: '"If We hear the high recluse Xuanyuan lives, We wish one word with him — that is all."',
    idiomatic: 'He only wanted conversation with the recluse.',
  },
  s1041: {
    literal: 'The edict closed with the closing bracket.',
    idiomatic: 'Thus ended the edict.',
  },
  s1042: {
    literal: 'Grand Councillor Zheng Lang for months requested leave; three memorials begged dismissal.',
    idiomatic: 'Zheng Lang thrice begged leave from office.',
  },
  s1043: {
    literal: 'That month on yiwei a comet appeared at the beginning of Fang, three feet long.',
    idiomatic: 'A three-foot comet appeared in Fang.',
  },
  s1044: {
    literal: 'Tenth month: General-of-Policy Grand Master, acting Vice Director of the Secretariat, Minister of Rites, Grand Councillor, dynastic historian with purple-gold fish Zheng Lang was acting Right Vice Director and heir-apparent Junior Preceptor; Shannan West commissioner, General-in-Attendance, acting Minister of Rites, Xingyuan prefect with purple-gold fish Jiang Xi was acting Vice Minister of Punishments; Grand Councillor Cui Shenyou also oversaw dynastic history; Xiao Ye also Hall of Assembled Worthies academician.',
    idiomatic: 'Zheng Lang retired to Junior Preceptor; posts were reshuffled.',
  },
  s1045: {
    literal: 'Huazhou prefect Gao Shaoyi was Left Cavalier; Suzhou prefect Pei Yizhi was Huazhou prefect and Tong Pass defense commander; acting Grand Master of Ceremonies Junior Master Cui Jun was Suzhou prefect.',
    idiomatic: 'Gao Shaoyi, Pei Yizhi, and Cui Jun exchanged Huazhou and Suzhou.',
  },
  s1046: {
    literal: 'Uighur investiture envoy, Court of the Imperial Stud Junior Director Wang Duanzhang was demoted to Hezhou registrar; vice envoy Court of the Heir-apparent Rites Doctor Li Xun to Chenzhou registrar; judge Henan prefecture staff officer Li Ji to Yongzhou registrar.',
    idiomatic: 'Luofu envoys were demoted when the road was blocked.',
  },
  s1047: {
    literal: 'Duanzhang and others left the frontier — Black Cart tribes blocked the road and they returned.',
    idiomatic: 'Black Cart tribes blocked the Uighur mission.',
  },
  s1048: {
    literal: 'Chengd observation regent, investigating censor with purple-gold fish Wang Shaoyi was acting Minister of Works, concurrent Zhenzhou metropolitan prefect and Censor-in-Chief, and Chengd commissioner.',
    idiomatic: 'Wang Shaoyi became full Chengd commissioner.',
  },
  s1049: {
    literal: 'Secretariat Drafter Li Fan was acting Rites examination commissioner.',
    idiomatic: 'Li Fan oversaw the examinations.',
  },
  s1050: {
    literal: 'Eleventh month: heir-apparent Junior Preceptor Zheng Lang died — posthumously Minister of Works.',
    idiomatic: 'Zheng Lang died and was posthumously Minister of Works.',
  },
  s1051: {
    literal: 'Silver-glitter Grand Master, acting Left Vice Director, concurrent heir-apparent Grand Protector, Right Feathered Forest commander, Censor-in-Chief, Pillar of State, Baron of Xingyang with three hundred households Zheng Guang died — court mourning halted three days, posthumously Minister of Education, still ordering the hundred offices to offer condolence.',
    idiomatic: 'Zheng Guang died; the court mourned three days.',
  },
  s1052: {
    literal: 'He was the emperor\'s elder maternal uncle.',
    idiomatic: 'He was Xuanzong\'s maternal uncle.',
  },
  s1053: {
    literal: 'Grand Councillor Cui Shenyou was Vice Director concurrent Minister of Rites; Minister Xiao Ye also Minister of Works — other posts unchanged.',
    idiomatic: 'Cui Shenyou and Xiao Ye picked up extra ministries.',
  },
  s1054: {
    literal: 'Twelfth month: Zhaoyi commissioner, Court Gentleman for Discussion, acting Minister of Works, Pillar of State, Baron of Pingyin with three hundred households Bi Kan was Taiyuan prefect, northern capital regent, and Hedong commissioner;',
    idiomatic: 'Bi Kan took Hedong;',
  },
  s1055: {
    literal: 'Court Gentleman for Discussion, acting Minister of Rites, concurrent Taiyuan prefect and northern capital regent with purple-gold fish Liu Zuan was Vice Minister of Revenue and finance commissioner.',
    idiomatic: 'Liu Zuan took finance in the capital.',
  },
  s1056: {
    literal: 'Hanlin academician-director, General-of-Policy Grand Master, acting Vice Minister of Revenue with edict drafting and purple-gold fish Jiang Shen was Vice Minister of War, fulfilling duty.',
    idiomatic: 'Jiang Shen became Vice Minister of War.',
  },
  s1057: {
    literal: 'Silver-glitter Grand Master, acting heir-apparent Grand Protector at eastern capital, Pillar of State, Viscount of Hedong with five hundred households Pei Xiu was acting Minister of Revenue, concurrent Lu metropolitan prefect, Zhaoyi vice commissioner, and Lu-Ci-Xing observation commissioner.',
    idiomatic: 'Pei Xiu took Zhaoyi from Luoyang.',
  },
  s1058: {
    literal: 'Regular Grand Master, acting Vice Minister of War, Pillar of State, Viscount of Hedong with three hundred households and purple-gold fish Liu Zhongye was at present rank also Censor-in-Chief and salt-and-transport commissioner.',
    idiomatic: 'Liu Zhongye took the salt monopoly.',
  },
  s1059: {
    literal: 'Regular Grand Master, acting Minister of Revenue, concurrent heir-apparent Guest of Honor with purple-gold fish Kong Wenye was at present rank assigned eastern capital — for illness requesting leave.',
    idiomatic: 'Kong Wenye went to Luoyang on sick leave.',
  },
  s1060: {
    literal: 'Rites Bureau Director Yang Youwen was at present rank edict drafter and Hanlin academician.',
    idiomatic: 'Yang Youwen entered the Hanlin.',
  },
  s1061: {
    literal: 'Youzhou central army commander, acting Director of Education, Youzhou Left Army Major knowing affairs, investigating censor Zhang Jianzhen was acting Right Cavalier — son of Yunshen.',
    idiomatic: 'Zhang Jianzhen, Yunshen\'s son, rose in Youzhou.',
  },
  s1062: {
    literal: 'General-in-Attendance, acting Vice Minister of Punishments with purple-gold fish Jiang Xi was acting Minister of Revenue, Fengxiang prefect, Censor-in-Chief, and Fengxiang-Longyou observation commissioner.',
    idiomatic: 'Jiang Xi took Fengxiang.',
  },
  s1063: {
    literal: 'That year at Wutang weir in Shuzhou many birds nested together, seven feet wide, seven zhang high — water birds, mountain birds, hawks, swallows — all tame.',
    idiomatic: 'A vast mixed bird nest appeared at Shuzhou\'s Wutang weir.',
  },
  s1064: {
    literal: 'Also a bird with human face and green fur, claws and beak all indigo, its cry "sweet" — people called it "sweet insect."',
    idiomatic: 'A human-faced "sweet insect" bird appeared.',
  },
  s1065: {
    literal: 'Dazhong 12, spring, first month: Jinyang magistrate Zheng Ye was Tongzhou prefect.',
    idiomatic: 'Zheng Ye became Tongzhou prefect.',
  },
  s1066: {
    literal: 'Luofu Mountain man Xuanyuan Ji reached the capital; the Emperor summoned him to the inner palace and said: "Master, remote age and long life — can longevity be attained?"',
    idiomatic: 'Xuanzong asked Xuanyuan Ji whether immortality was possible.',
  },
  s1067: {
    literal: '"He said: "Banish sound and color, remove flavors, make joy and sorrow one, virtue extending thoroughly — naturally join Heaven and Earth in virtue, sun and moon in brightness; why seek longevity separately?"',
    idiomatic: 'Ji said virtue, not tricks, aligned one with heaven.',
  },
  s1068: {
    literal: '" Detained over a month, he firmly begged to return to the mountains.',
    idiomatic: 'Ji stayed a month then insisted on leaving.',
  },
  s1069: {
    literal: 'Former provincial degree graduate Yu Cong was Secretariat proofreader; soon married Princess Guangde — changed to Silver-glitter Grand Master, acting Right Reminder, Commandant-consort.',
    idiomatic: 'Yu Cong married Princess Guangde and became commandant-consort.',
  },
  s1070: {
    literal: 'Annan frontier pacification commissioner, Palace Companion, acting Left Cavalier, Annan Protector, Censor-in-Chief with purple-gold fish Li Hongfu was Director of the Imperial Clan.',
    idiomatic: 'Li Hongfu became Director of the Imperial Clan.',
  },
  s1071: {
    literal: 'Grand Master of the Palace, acting Jingzhao prefect with purple-gold fish Zhang Yifu was Ezhou prefect, Censor-in-Chief, and E-Yue-Qi-Huang-Shen observation commissioner.',
    idiomatic: 'Zhang Yifu took Ezhou.',
  },
  s1072: {
    literal: 'Acting Grand Master of the Palace, Fuzhou prefect, Censor-in-Chief with purple-gold fish Yang Fa was acting Right Cavalier, Guangzhou prefect, Censor-in-Chief, and Lingnan East observation commissioner.',
    idiomatic: 'Yang Fa took Lingnan East.',
  },
  s1073: {
    literal: 'Palace Companion, acting Prince of Kang mentor at eastern capital, Pillar of State, Duke of Wei with two thousand households and purple-gold fish Wang Shi was Annan Protector, concurrent Censor-in-Chief, and Annan frontier commissioner.',
    idiomatic: 'Wang Shi took Annan.',
  },
  s1074: {
    literal: 'Regular Grand Master, former acting heir-apparent Guest of Honor at eastern capital, Pillar of State, Baron of Zan with three hundred households and purple-gold fish Xiao Shu was acting heir-apparent Grand Protector at eastern capital.',
    idiomatic: 'Xiao Shu became Luoyang grand protector.',
  },
  s1075: {
    literal: 'Regular Grand Master, acting Left Cavalier, Right Gold Crow general, Right Street commissioner, Pillar of State, Duke of Taiyuan with two thousand households Wang Zhen was acting Left Cavalier, holding staff as Fuzhou military commissioner, Fuzhou prefect, Censor-in-Chief, and Fujian observation commissioner.',
    idiomatic: 'Wang Zhen was made acting Left Cavalier, Fuzhou military commissioner, Fuzhou prefect, censor-in-chief, and Fujian observation commissioner.',
  },
  s1076: {
    literal: 'Hanlin academician, Court Gentleman for Discussion, acting Bureau of Merit Director with edict drafting and scarlet fish Kong Wenyu was Secretariat Drafter, fulfilling duty.',
    idiomatic: 'Kong Wenyu became Secretariat drafter.',
  },
  s1077: {
    literal: 'Right Brave Guard senior general Li Zhengyuan was inner Bright City regent.',
    idiomatic: 'Li Zhengyuan guarded the inner city.',
  },
  s1078: {
    literal: 'Court Gentleman for Discussion, acting Vice Minister of Revenue and finance commissioner with purple-gold fish Liu Zuan was Grand Councillor at his present rank, still finance commissioner.',
    idiomatic: 'Liu Zuan joined the council while keeping finance.',
  },
  s1079: {
    literal: 'Acting Grand Master of the Palace, acting Vice Director of the Secretariat, concurrent Minister of Rites, Grand Councillor, dynastic historian with purple-gold fish Cui Shenyou was acting Minister of Rites, Zizhou prefect, Censor-in-Chief, Sword South East Chuan vice commissioner, replacing Wei Youyi;',
    idiomatic: 'Cui Shenyou went to East Chuan;',
  },
  s1080: {
    literal: 'Youyi was Vice Minister of Personnel.',
    idiomatic: 'Wei Youyi took Personnel.',
  },
  s1081: {
    literal: 'Second month: former Yongguan pacification commissioner, Court Gentleman for Discussion, Yongzhou prefect, Censor-in-Chief with purple-gold fish Duan Wenchu was Zhaowu Commandant and Right Gold Crow guard general;',
    idiomatic: 'Duan Wenchu entered the guard;',
  },
  s1082: {
    literal: 'Court Gentleman for Discussion, acting Secretariat Drafter, acting Rites examination commissioner with scarlet fish Li Fan was Vice Minister of Revenue.',
    idiomatic: 'Li Fan took Revenue.',
  },
  s1083: {
    literal: 'Palace Companion, acting Minister of Works, Grand Councillor, Hall of Assembled Worthies academician with purple-gold fish Xiao Ye was dynastic historian.',
    idiomatic: 'Xiao Ye oversaw the Veritable Record.',
  },
  s1084: {
    literal: 'Court Gentleman for Discussion, acting Vice Minister of Revenue, Grand Councillor, finance commissioner, Pillar of State with purple-gold fish Liu Zuan might be Hall of Assembled Worthies academician.',
    idiomatic: 'Liu Zuan also joined the Hall of Assembled Worthies.',
  },
  s1085: {
    literal: 'Balhae king\'s younger brother acting state affairs Da Qianhuang was Silver-glitter Grand Master, acting Palace Library Director, Hohan prefectural governor, and invested king of Balhae.',
    idiomatic: 'Balhae invested Da Qianhuang as king.',
  },
  s1086: {
    literal: 'Vice Minister of War Liu Zhongye was Vice Minister of Punishments.',
    idiomatic: 'Liu Zhongye took Punishments.',
  },
  s1087: {
    literal: 'Court Gentleman for Discussion, acting Vice Minister of Revenue and revenue head with purple-gold fish Xiahou Zi was Vice Minister of War and salt-and-transport commissioner;',
    idiomatic: 'Xiahou Zi took the salt monopoly;',
  },
  s1088: {
    literal: 'Regular Grand Master, acting Vice Minister of Punishments with purple-gold fish Du Sheng was Vice Minister of Revenue and revenue head.',
    idiomatic: 'Du Sheng took Revenue.',
  },
  s1089: {
    literal: 'Grand Master for Splendid Happiness, acting Left Leading Guard great general at eastern capital, Pillar of State, Duke of Kuaiji with fifteen hundred households Kang Jirong was acting Right Vice Director and Right Guard senior general at eastern capital.',
    idiomatic: 'Kang Jirong was honored at Luoyang.',
  },
  s1090: {
    literal: 'Demoted former Lizhou prefect Du Cang to Hezhou registrar; Caizhou prefect Li Cong to Shaozhou registrar.',
    idiomatic: 'Du Cang and Li Cong were demoted.',
  },
  s1091: {
    literal: 'Bureau of Works Director with edict drafting Yu Desun and Bureau of Stores Director with edict drafting Miao Ke were both Secretariat drafters, still Hanlin academicians.',
    idiomatic: 'Yu Desun and Miao Ke became drafters.',
  },
  s1092: {
    literal: 'Former Right Gold Crow guard general Zheng Hanzhang and former Court of the Imperial Stud Junior Director Zheng Hanqing were both restored to former posts — sons of the late maternal uncle Guang.',
    idiomatic: 'Zheng Hanzhang and Hanqing, sons of Zheng Guang, were restored.',
  },
  s1093: {
    literal: 'Silver-glitter Grand Master, acting Remonstrance official, Commandant-consort Wei Zhu was Vice Minister of Works; former Prince of Pu mentor at eastern capital Huangfu Quan was Prince of Kang mentor at eastern capital.',
    idiomatic: 'Wei Zhu and Huangfu Quan exchanged mentor posts.',
  },
  s1094: {
    literal: 'Stores Bureau outer-section member and History Office compiler Li Huan was Chang\'an magistrate.',
    idiomatic: 'Li Huan became Chang\'an magistrate.',
  },
  s1095: {
    literal: 'Intercalary second month: Minister of Agriculture Junior Director Lu Ji was Daizhou prefect; former Jiangling Junior Vice Prefect Du Yin was Minister of Agriculture Junior Director.',
    idiomatic: 'Lu Ji and Du Yin exchanged agriculture posts.',
  },
  s1096: {
    literal: 'Hedong horse-and-foot chief inspector Duan Wei was Shuofang prefect, Tianning army commander, and commander of the three Shatuo tribes of Xingtang with frontier defense duties.',
    idiomatic: 'Duan Wei took Shuofang and Shatuo defense.',
  },
  s1097: {
    literal: 'Fifth month: Vice Minister of War and salt commissioner Xiahou Zi was Grand Councillor at his present rank.',
    idiomatic: 'Xiahou Zi joined the council.',
  },
  s1098: {
    literal: 'Sixth month: southern barbarians attacked Annan prefecture.',
    idiomatic: 'Southern tribes attacked Annan.',
  },
  s1099: {
    literal: 'Eighth month: Hongzhou bandit Mao He and Xuanzhou bandit Kang Quanda raided prefectures and counties — edict ordered Liang-Zhe troops to suppress and pacify.',
    idiomatic: 'Mao He and Kang Quanda were suppressed by Zhe troops.',
  },
  s1100: {
    literal: 'Twelfth month: heir-apparent Grand Protector Wei Zhan died — posthumously Minister of Education.',
    idiomatic: 'Wei Zhan died and was posthumously Minister of Education.',
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
if (data.metadata.chapter !== '018') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 018; standalone T ready (${Object.keys(T).length} entries).`
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
