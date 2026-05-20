#!/usr/bin/env node
/** Batch 7: s0601–s0700 (Jiutangshu ch.011, Daizong — Dali 7–9 — Uyghur unrest, Guo Ziyi, drought and rain) */

import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/011.json';
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
    literal:
      'The responsible offices were to proclaim and instruct clearly.',
    idiomatic:
      'Officials were ordered to publish the ban and explain it clearly.',
  },
  s0602: {
    literal:
      'Closing mark of the edict.',
    idiomatic:
      'The edict closed."',
  },
  s0603: {
    literal:
      'Fifth month, guimao: Henan metropolitan prefect Zhang Yanshang was made censor-in-chief.',
    idiomatic:
      'On guimao of the fifth month, Zhang Yanshang of Henan became censor-in-chief.',
  },
  s0604: {
    literal:
      'Autumn, seventh month, yisi: the moon occulted the Net.',
    idiomatic:
      'On yisi of the seventh month the moon passed before the Net.',
  },
  s0605: {
    literal:
      'Eighth month, yimao: Huainan military commissioner Wei Yuanfu died.',
    idiomatic:
      'On yimao of the eighth month, Wei Yuanfu of Huainan died.',
  },
  s0606: {
    literal:
      'On bingchen, eastern capital deputy guardian Chang Xiuming was made acting left regular cavalry attendant and Heyang Three Cities commissioner.',
    idiomatic:
      'On bingchen, Chang Xiuming became acting left regular cavalry attendant and commissioner of the Heyang Three Cities.',
  },
  s0607: {
    literal:
      'Summer drought; only on jiwei of this month did rain begin.',
    idiomatic:
      'After a summer drought, rain did not come until jiwei of this month.',
  },
  s0608: {
    literal:
      'On gengwu, censor-in-chief Zhang Yanshang was made chief administrator of Yangzhou grand protectorate and Huainan military commissioner.',
    idiomatic:
      'On gengwu, Zhang Yanshang became Yangzhou chief administrator and Huainan commissioner.',
  },
  s0609: {
    literal:
      'On bingwu, Suzhou prefect and Zhejiang observation commissioner Li Qiyun was made censor-in-chief.',
    idiomatic:
      'On bingwu, Li Qiyun of Suzhou and Zhejiang became censor-in-chief.',
  },
  s0610: {
    literal:
      'On dingchou a white hare was caught in the inner corridor of Taiji Hall.',
    idiomatic:
      'On dingchou a white hare was found in Taiji Hall\'s inner corridor.',
  },
  s0611: {
    literal:
      'Night of gengchen, the moon entered the Purple Forbidden Enclosure.',
    idiomatic:
      'On the night of gengchen the moon entered the Purple Forbidden Enclosure.',
  },
  s0612: {
    literal:
      'Night of renchen of the ninth month, Mars trespassed the Weeping star.',
    idiomatic:
      'On the night of renchen in the ninth month, Mars crossed the Weeping star.',
  },
  s0613: {
    literal:
      'From the eighth month rain continued and harmed the autumn crop.',
    idiomatic:
      'Rain from the eighth month on ruined the autumn harvest.',
  },
  s0614: {
    literal:
      'On wushen, the Jingse army was established at Luntai.',
    idiomatic:
      'On wushen the Jingse army was posted at Luntai.',
  },
  s0615: {
    literal:
      'On xinhai, Mars entered the Ramparts.',
    idiomatic:
      'On xinhai Mars entered the Ramparts.',
  },
  s0616: {
    literal:
      'Winter, tenth month, renwu: the Transverse Sea army was established at Cangzhou.',
    idiomatic:
      'On renwu of the tenth winter month the Transverse Sea army was set at Cangzhou.',
  },
  s0617: {
    literal:
      'Eleventh month, jihai: King Bomi of Wendantu came to court and presented eleven tame elephants.',
    idiomatic:
      'On jihai, King Bomi of Wendantu came to court with eleven tame elephants.',
  },
  s0618: {
    literal:
      'Night of renyin, the moon entered the Supreme Palace Enclosure and also occulted Di.',
    idiomatic:
      'On the night of renyin the moon entered the Supreme Palace and occulted Di.',
  },
  s0619: {
    literal:
      'Twelfth month, jiwei: Jiangxi observation commissioner and acting minister of punishments Wei Shaoyou died.',
    idiomatic:
      'On jiwei, Wei Shaoyou of Jiangxi, acting minister of punishments, died.',
  },
  s0620: {
    literal:
      'On gengwu, by decree King Bomi of Wendantu was made acting master of ceremonies with the same ceremonial rank as a chief minister and trial palace supervisor.',
    idiomatic:
      'On gengwu, King Bomi was made acting master of ceremonies equal to a chief minister and trial palace supervisor.',
  },
  s0621: {
    literal:
      'That year spring drought drove grain to ten thousand cash per hu.',
    idiomatic:
      'Spring drought that year pushed grain to ten thousand cash the hu.',
  },
  s0622: {
    literal:
      'Dali 7, spring, first month, guiwei new moon.',
    idiomatic:
      'Dali 7 opened on the guiwei new moon of the first spring month.',
  },
  s0623: {
    literal:
      'On wuzi, Chao prefecture was established at Dunqiu county in Weizhou.',
    idiomatic:
      'On wuzi, Chao prefecture was created at Dunqiu in Wei.',
  },
  s0624: {
    literal:
      'Guancheng county was set at Guancheng post in Dunqiu; Qingfeng county at Qingfeng post in Zhang; both were cut from Linhuang in Weizhou and placed under Chao.',
    idiomatic:
      'Guancheng and Qingfeng counties were carved from Wei\'s Linhuang and placed under the new Chao prefecture.',
  },
  s0625: {
    literal:
      'Yongji county was established at Zhangqiao post in Linqing of Beizhou.',
    idiomatic:
      'Yongji county was created at Zhangqiao in Beizhou\'s Linqing.',
  },
  s0626: {
    literal:
      'On yimi, the moon trespassed the Chariot.',
    idiomatic:
      'On yimi the moon crossed the Chariot.',
  },
  s0627: {
    literal:
      'On gengzi, acting minister of revenue Lu Sigong was made Hongzhou prefect, concurrent censor-in-chief, and Jiangxi observation commissioner.',
    idiomatic:
      'On gengzi, Lu Sigong became Hongzhou prefect and Jiangxi commissioner with the censorate.',
  },
  s0628: {
    literal:
      'On xinchou, Minister of Ceremonies Yang Wan was also made director of rites.',
    idiomatic:
      'On xinchou, Yang Wan of the ministry of ceremonies also took charge of rites.',
  },
  s0629: {
    literal:
      'On jiachen, Uyghur envoys raided the market outside the Honglu temple; officials could not stop them; three hundred more horsemen violated the Golden Light and Vermilion Bird gates.',
    idiomatic:
      'On jiachen, Uyghur envoys plundered the Honglu market; when officials failed to stop them, three hundred horsemen broke through the Golden Light and Vermilion Bird gates.',
  },
  s0630: {
    literal:
      'That day all gates of the imperial city were closed; only after reassurance did they cease.',
    idiomatic:
      'The imperial city gates were shut that day until the court soothed them and the violence ended.',
  },
  s0631: {
    literal:
      'Second month, jiayin: Vice Minister of War Li Han was made Suzhou prefect, concurrent acting censor-in-chief, and Zhexi observation commissioner.',
    idiomatic:
      'On jiayin, Li Han became Suzhou prefect and Zhexi commissioner with an acting censorate post.',
  },
  s0632: {
    literal:
      'The Chronogram star stood at the Supreme Palace Enclosure.',
    idiomatic:
      'Saturn stood in the Supreme Palace Enclosure.',
  },
  s0633: {
    literal:
      'Night of wuzi, the moon occulted the Celestial Gate.',
    idiomatic:
      'On the night of wuzi the moon occulted the Celestial Gate.',
  },
  s0634: {
    literal:
      'Third month, renchen: remonstrating and advising grand masters were fixed at four posts.',
    idiomatic:
      'On renchen the remonstrating and advising grand masters were fixed at four posts.',
  },
  s0635: {
    literal:
      'Summer, fourth month, jiayin: Uyghur prince Li Bingyi died; he had been granted the name on returning to guard the realm.',
    idiomatic:
      'On jiayin, Uyghur prince Li Bingyi died; he had taken the imperial surname while serving as a hostage guard.',
  },
  s0636: {
    literal:
      'Fifth month, yiyou: hail fell and great wind broke trees.',
    idiomatic:
      'On yiyou hail fell and a gale snapped trees.',
  },
  s0637: {
    literal:
      'Night of bingxu, the moon entered the Supreme Palace Enclosure.',
    idiomatic:
      'On the night of bingxu the moon entered the Supreme Palace Enclosure.',
  },
  s0638: {
    literal:
      'On xinmao, the Seven Sages image of Xinzhou was moved to the Purple Ultimate Palace in Taiyuan prefecture.',
    idiomatic:
      'On xinmao, Xinzhou\'s Seven Sages shrine was moved to Taiyuan\'s Purple Ultimate Palace.',
  },
  s0639: {
    literal:
      'On yimi, edict:',
    idiomatic:
      'On yimi an edict ran:',
  },
  s0640: {
    literal:
      'On guihai, acting minister of rites Jiang Huan was made eastern capital guardian.',
    idiomatic:
      'On guihai, Jiang Huan became eastern capital guardian.',
  },
  s0641: {
    literal:
      'Sixth month, gengxu: the offices reported a solar eclipse, but clouds hid it.',
    idiomatic:
      'On gengxu officials reported an eclipse, but clouds concealed it.',
  },
  s0642: {
    literal:
      'On dingchou, an edict warned against lavish burial—no false flowers, fruit, gold hand-strips, jeweled hairpins, or the like.',
    idiomatic:
      'On dingchou an edict forbade lavish funerals: no false flowers, gold hand-strips, jeweled pins, or similar display.',
  },
  s0643: {
    literal:
      'Autumn, seventh month, guisi: Uyghur and foreign guests seized the horse of Chang\'an magistrate Shao Shuo; clerks and runners could not restrain them.',
    idiomatic:
      'On guisi, Uyghur guests seized Chang\'an magistrate Shao Shuo\'s horse and clerks could not stop them.',
  },
  s0644: {
    literal:
      'Eighth month, gengxu: Northern Court protector Cao Lingzhong was granted the surname Li and the name Yuanzhong.',
    idiomatic:
      'On gengxu, Northern Court protector Cao Lingzhong received the surname Li and the name Yuanzhong.',
  },
  s0645: {
    literal:
      'Ninth month, yimi: Minister of Works Yu Xiulie died.',
    idiomatic:
      'On yimi, Minister of Works Yu Xiulie died.',
  },
  s0646: {
    literal:
      'Winter, tenth month, renzi: the emperor hunted in the park; one arrow pierced two hares; attendants all congratulated.',
    idiomatic:
      'On renzi he hunted in the park and with one arrow struck two hares; the court congratulated him.',
  },
  s0647: {
    literal:
      'On xinwei, acting Youzhou-Lulong commissioner Zhu Ci was made acting left regular cavalry attendant and Youzhou-Lulong military commissioner.',
    idiomatic:
      'On xinwei, Zhu Ci became acting left regular cavalry attendant and Youzhou-Lulong commissioner.',
  },
  s0648: {
    literal:
      'On bingzi, Grand Steward Lü Chongben was made Guangzhou metropolitan protector and Lingnan military commissioner.',
    idiomatic:
      'On bingzi, Lü Chongben became Guangzhou protector and Lingnan commissioner.',
  },
  s0649: {
    literal:
      'Eleventh month, gengchen, edict: "Of late when barbarians raid, Ba south has borne repeated levies.',
    idiomatic:
      'On gengchen of the eleventh month an edict declared: "Barbarian raids have lately piled levies on Ba south.',
  },
  s0650: {
    literal:
      'Ba, Peng, Qu, Ji, Bi, Chong, Tong, and Kai prefectures shall have two years\' tax and corvée remitted."',
    idiomatic:
      'Ba, Peng, Qu, Ji, Bi, Chong, Tong, and Kai shall be exempt from tax and corvée for two years."',
  },
  s0651: {
    literal:
      'On jiashen, Fujian observation commissioner Li Chengzhao was made minister of rites; Huazhou prefect Li Qi was made Fuzhou prefect and Fujian all-circuits training and observation commissioner.',
    idiomatic:
      'On jiashen, Li Chengzhao became minister of rites and Li Qi took Fuzhou and the Fujian command.',
  },
  s0652: {
    literal:
      'On xinmao, Lingnan commissioner Li Mian was made minister of works.',
    idiomatic:
      'On xinmao, Li Mian of Lingnan became minister of works.',
  },
  s0653: {
    literal:
      'Twelfth month, bingyin: soil rained from the sky.',
    idiomatic:
      'On bingyin of the twelfth month, soil fell like rain.',
  },
  s0654: {
    literal:
      'That night a long comet appeared at Shen.',
    idiomatic:
      'That night a long-tailed comet rose at Shen.',
  },
  s0655: {
    literal:
      'On xinwei, the Yongping army was established at Huazhou.',
    idiomatic:
      'On xinwei the Yongping army was posted at Huazhou.',
  },
  s0656: {
    literal:
      'On renzi, casting copper vessels was forbidden.',
    idiomatic:
      'On renzi the court banned private casting of copper ware.',
  },
  s0657: {
    literal:
      'On guiyou, heavy snow.',
    idiomatic:
      'On guiyou heavy snow fell.',
  },
  s0658: {
    literal:
      'That autumn the harvest ripened.',
    idiomatic:
      'That autumn brought a full harvest.',
  },
  s0659: {
    literal:
      'Uyghurs, Tibet, the Abbasids, Bohai, Shiwei, Mohe, Khitan, Xi, Zangke, Kang, and Shishi all sent envoys with tribute.',
    idiomatic:
      'Uyghurs, Tibetans, Abbasids, Bohai, Shiwei, Mohe, Khitan, Xi, Zangke, Kang, and Shishi all presented tribute.',
  },
  s0660: {
    literal:
      'Dali 8, spring, first month, dingchou new moon; on renwu, Zhaoyi military commissioner, acting right vice director, and Xiangzhou prefect Xue Song died.',
    idiomatic:
      'Dali 8 opened on dingchou; on renwu Xue Song of Zhaoyi, acting right vice director, died.',
  },
  s0661: {
    literal:
      'On guimao, an edict fixed the green-sprout field-head money at fifteen cash per mu, thirty in the capital circuits—henceforth fifteen everywhere.',
    idiomatic:
      'On guimao the green-sprout levy was fixed at fifteen cash per mu, ending the capital\'s thirty-cash rate.',
  },
  s0662: {
    literal:
      'Capital officials of third rank and above, bureau directors, and censors each year were to recommend one man fit for prefect or magistrate.',
    idiomatic:
      'Each year capital officials of third rank up, directors, and censors had to nominate one worthy prefect or magistrate.',
  },
  s0663: {
    literal:
      'Second month, jiazi: censor-in-chief Li Qiyun impeached Vice Minister of Personnel Xu Hao.',
    idiomatic:
      'On jiazi, Li Qiyun impeached Xu Hao of the ministry of personnel.',
  },
  s0664: {
    literal:
      'On dingmao, Youzhou commissioner Zhu Ci was made acting minister of revenue and enfeoffed Prince of Huaining commandery.',
    idiomatic:
      'On dingmao, Zhu Ci of Youzhou became acting minister of revenue and Prince of Huaining.',
  },
  s0665: {
    literal:
      'Xu Hao and Xue Yong violated regulations; both were suspended from selection duties.',
    idiomatic:
      'Xu Hao and Xue Yong broke the rules and lost control of appointments.',
  },
  s0666: {
    literal:
      'On renshen, Yongping commissioner, acting right vice director, Huazhou prefect, and Duke of Huo Linghu Zhang died, leaving a memorial recommending Liu Yan and Li Mian to succeed him.',
    idiomatic:
      'On renshen, Linghu Zhang of Yongping died, recommending Liu Yan and Li Mian as his successors.',
  },
  s0667: {
    literal:
      'Third month, bingzi: Minister of Works Li Mian was made concurrent censor-in-chief and Huazhou prefect, Yongping commissioner and Bo-Mei observer.',
    idiomatic:
      'On bingzi, Li Mian became censor-in-chief, Huazhou prefect, and Yongping commissioner.',
  },
  s0668: {
    literal:
      'Summer, fourth month, wushen: at Qianling\'s Shangxian Abbey Heavenly Lord hall two magpies carried purple mud and filled fifteen gaps in the hall.',
    idiomatic:
      'On wushen, at Qianling two magpies patched fifteen gaps in the Heavenly Lord hall with purple mud.',
  },
  s0669: {
    literal:
      'On wuwu, Grand Steward Wu Zhongru was made Ezhou prefect and E-Yue-Mian training and observation commissioner.',
    idiomatic:
      'On wuwu, Wu Zhongru became Ezhou prefect and commissioner over E, Yue, and Mian.',
  },
  s0670: {
    literal:
      'Fifth month, yiyou: Vice Minister of Personnel Xu Hao was demoted to Mingzhou assistant prefect; Xue Yong to Shezhou prefect; capital metropolitan prefect Du Ji to Hangzhou prefect—all for controlling selection.',
    idiomatic:
      'On yiyou, Xu Hao, Xue Yong, and Du Ji were banished from the capital for rigging appointments.',
  },
  s0671: {
    literal:
      'Grand Steward Yu Yi was made metropolitan prefect of the capital.',
    idiomatic:
      'Yu Yi became capital metropolitan prefect.',
  },
  s0672: {
    literal:
      'On xinmao, Prince of Zheng Miao died; posthumously titled Tranquil Zhao crown prince.',
    idiomatic:
      'On xinmao, Prince of Zheng Miao died and was posthumously named Tranquil Zhao crown prince.',
  },
  s0673: {
    literal:
      'On renchen, a partial amnesty freed capital prisoners.',
    idiomatic:
      'On renchen the capital prisoners received a partial amnesty.',
  },
  s0674: {
    literal:
      'On guimao, an edict amnestied prisoners empire-wide: death reduced to exile, exile and below all released.',
    idiomatic:
      'On guimao a general amnesty cut death sentences to exile and freed lesser offenders.',
  },
  s0675: {
    literal:
      'Sixth month: the Yining army was established at Huating in Longzhou.',
    idiomatic:
      'In the sixth month the Yining army was posted at Huating in Long.',
  },
  s0676: {
    literal:
      'On guihai, Vice Minister of Revenue and fiscal commissioner Han Huang reported curdled salt forming in the Anyi salt ponds.',
    idiomatic:
      'On guihai, Han Huang reported curdled salt forming in the Anyi ponds.',
  },
  s0677: {
    literal:
      'That summer walls were built at Fengtian against barbarian raids.',
    idiomatic:
      'That summer Fengtian was walled against barbarian attack.',
  },
  s0678: {
    literal:
      'Autumn, seventh month, jimao: Venus entered the Well.',
    idiomatic:
      'On jimao of the seventh month Venus entered the Well.',
  },
  s0679: {
    literal:
      'On yimi, the moon occulted the Net.',
    idiomatic:
      'On yimi the moon passed before the Net.',
  },
  s0680: {
    literal:
      'Eighth month, jiayin: an edict put Minister of Personnel Liu Yan in charge of all three selection bureaus.',
    idiomatic:
      'On jiayin Liu Yan was given all three appointment bureaus.',
  },
  s0681: {
    literal:
      'On jiwei, Tibet raided Lingwu.',
    idiomatic:
      'On jiwei Tibetans raided Lingwu.',
  },
  s0682: {
    literal:
      'On gengwu, Lingwu reported the barbarian army had withdrawn.',
    idiomatic:
      'On gengwu Lingwu reported the Tibetans had withdrawn.',
  },
  s0683: {
    literal:
      'On xinwei, Youzhou commissioner Zhu Ci\'s younger brother Tao led five thousand cavalry to court, requesting autumn defense on the Hexi frontier.',
    idiomatic:
      'On xinwei, Zhu Tao of Youzhou brought five thousand horsemen to court seeking a Hexi autumn command.',
  },
  s0684: {
    literal:
      'An edict sent a thousand horsemen to meet them at the state gate; they were allowed out Kaiyuan Gate south of the imperial city to the Jingzhou camp.',
    idiomatic:
      'A thousand horsemen met them at the gate; they marched out Kaiyuan Gate to the Jingzhou camp.',
  },
  s0685: {
    literal:
      'Ninth month, guiyou: Princess of Linjin died.',
    idiomatic:
      'On guiyou, the Princess of Linjin died.',
  },
  s0686: {
    literal:
      'On renwu, Lingnan commissioner and Guangzhou prefect Lü Chongben was killed by his officer Geshu Huang.',
    idiomatic:
      'On renwu, Lü Chongben of Lingnan was murdered by his officer Geshu Huang.',
  },
  s0687: {
    literal:
      'On guiwei, Jinzhou commoner Xun Mo, hair braided with hemp, held a bamboo basket and reed mat and wept at the eastern market, offering thirty characters and asking that if they displeased, his corpse be wrapped in the mat and basket.',
    idiomatic:
      'On guiwei, Xun Mo of Jinzhou wove his hair with hemp, wept at the eastern market with a basket and mat, and offered thirty characters—begging to die in the mat if they failed.',
  },
  s0688: {
    literal:
      'The emperor summoned and clothed him and lodged him in the palace.',
    idiomatic:
      'The emperor received him, gave clothes, and housed him in the palace.',
  },
  s0689: {
    literal:
      'Two characters read "supervise regiments," intending to abolish circuit army supervisors and training commissioners.',
    idiomatic:
      'Two characters meant "abolish supervisors and training commissioners" on every circuit.',
  },
  s0690: {
    literal:
      'On dinghai, left patrol commissioner and palace censor Yang Hu was demoted for suppressing Xun Mo and not reporting upward; on wuzi, an edict ordered capital officials of fifth rank and above each to submit sealed memorials on policy gains and losses.',
    idiomatic:
      'On dinghai Yang Hu was punished for silencing Xun Mo; on wuzi every capital official of fifth rank or higher had to submit a sealed critique.',
  },
  s0691: {
    literal:
      'Night of jichou, Venus entered the Supreme Palace Enclosure.',
    idiomatic:
      'On the night of jichou Venus entered the Supreme Palace Enclosure.',
  },
  s0692: {
    literal:
      'On jiawu, eastern capital guardian Jiang Qiong was also put in charge of the eastern capital examination.',
    idiomatic:
      'On jiawu, Jiang Qiong of Luoyang also supervised the eastern capital examinations.',
  },
  s0693: {
    literal:
      'On wuxu, Chen and Jin observation commissioner Li Changqi was made Guilin prefect and Guiguan defense and observation commissioner.',
    idiomatic:
      'On wuxu, Li Changqi became Guilin prefect and Guiguan commissioner.',
  },
  s0694: {
    literal:
      'A great bird appeared at Wugong with fleshy wings and fox head, four feet with claws four chi three cun long, red fur like a bat; flocks of birds followed shrieking.',
    idiomatic:
      'At Wugong a monstrous bird appeared—fox-headed, winged, four clawed feet, bat-red—and lesser birds screamed after it.',
  },
  s0695: {
    literal:
      'Shence general Zhang Rifen shot it dead and presented it.',
    idiomatic:
      'Zhang Rifen of the Shence guard shot it and presented the carcass.',
  },
  s0696: {
    literal:
      'Winter, tenth month, guimao: Weibo\'s Tian Chengsi was made fellow grand councilor.',
    idiomatic:
      'On guimao, Tian Chengsi of Weibo became fellow grand councilor.',
  },
  s0697: {
    literal:
      'Night of dingsi, the moon occulted the Net.',
    idiomatic:
      'On the night of dingsi the moon occulted the Net.',
  },
  s0698: {
    literal:
      'Tibet raided Jing and Bing.',
    idiomatic:
      'Tibetans raided Jing and Bing.',
  },
  s0699: {
    literal:
      'On jiazi, Ziyi\'s vanguard Huai Mei fought Tibet at Yilu; our army was unfavorable.',
    idiomatic:
      'On jiazi, Guo Ziyi\'s vanguard Huai Mei fought Tibet at Yilu and was beaten.',
  },
  s0700: {
    literal:
      'Mei and Jingyuan\'s Ma Lin pursued with all force; the barbarian army broke and fled.',
    idiomatic:
      'Huai Mei and Ma Lin of Jingyuan pursued hard until the Tibetans broke and fled.',
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
