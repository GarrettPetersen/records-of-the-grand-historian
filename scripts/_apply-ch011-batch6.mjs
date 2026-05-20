#!/usr/bin/env node
/** Batch 6: s0501–s0600 (Jiutangshu ch.011, Daizong — Dali 4–6 — grain tax, Yu Chaoen, silk edict, famine) */

import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/011.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 501;
const END = 600;

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
  s0501: {
    literal:
      'Winter, tenth month, jiazi: Shuofang acting commissioner and Lingwu grand protectorate chief administrator Chang Lianguang was made acting minister of works.',
    idiomatic:
      'On jiazi of the tenth winter month, acting Shuofang commissioner Chang Lianguang of Lingwu was made acting minister of works.',
  },
  s0502: {
    literal:
      'On yimi, Capital Metropolitan Prefect Li Mian was made Guangzhou prefect and Lingnan military commissioner.',
    idiomatic:
      'On yimi, Li Mian left the capital for Guangzhou as prefect and Lingnan commissioner.',
  },
  s0503: {
    literal:
      'On dingmao, Ziyi came to court from Fengtian.',
    idiomatic:
      'On dingmao, Guo Ziyi arrived from Fengtian for audience.',
  },
  s0504: {
    literal:
      'Eleventh month, dinghai: Youzhou acting commissioner Zhu Xicai became Youzhou chief administrator and Youzhou-Lulong military commissioner; guisi: corridor officials\' kitchen allowances were increased by one-fifth over the old rate.',
    idiomatic:
      'In the eleventh month, on dinghai Zhu Xicai became Youzhou administrator and Lulong commissioner; on guisi officials\' mess stipends rose one-fifth.',
  },
  s0505: {
    literal:
      'Twelfth month, renyin: Daozhou prefect Cui Huan died.',
    idiomatic:
      'On renyin of the twelfth month, Daozhou prefect Cui Huan died.',
  },
  s0506: {
    literal:
      'On jiyou, Binning military commissioner Ma Lin was made Jingyuan commissioner, headquarters moved to Jingzhou; Binning was detached to the Shuofang army.',
    idiomatic:
      'On jiyou, Ma Lin became Jingyuan commissioner and moved to Jingzhou, while Binning passed to Shuofang command.',
  },
  s0507: {
    literal:
      'Bing prefectural officers and clerks rioted over burning the horse yards; military commissioner Duan Xiushi beheaded eight ringleaders before order returned.',
    idiomatic:
      'At Bing, officers rioted when the horse yards burned; Duan Xiushi executed eight leaders and restored order.',
  },
  s0508: {
    literal:
      'Dali 4, spring, first month, gengwu new moon.',
    idiomatic:
      'Dali 4 opened on the gengwu new moon of the first spring month.',
  },
  s0509: {
    literal:
      'On jiaxu, great wind.',
    idiomatic:
      'On jiaxu a violent wind blew.',
  },
  s0510: {
    literal:
      'On yihai, heavy snow; a full foot on level ground.',
    idiomatic:
      'On yihai snow piled a foot deep across the plain.',
  },
  s0511: {
    literal:
      'On jiashen, the sun was eclipsed.',
    idiomatic:
      'On jiashen there was a solar eclipse.',
  },
  s0512: {
    literal:
      'Ziyi returned to Hezhong.',
    idiomatic:
      'Guo Ziyi went back to Hezhong.',
  },
  s0513: {
    literal:
      'On wuzi, an edict ordered officials to fix per-household tax money for nobles, gentry, and commoners in upper, middle, and lower grades.',
    idiomatic:
      'On wuzi the court fixed household taxes in three grades for nobles, gentry, and commoners.',
  },
  s0514: {
    literal:
      'Imperial clansman Yingzhou prefect Li Qi wantonly killed; the law office, citing kinship, recommended he be granted suicide.',
    idiomatic:
      'Li Qi of Ying prefecture, a royal cousin, murdered wantonly; the law office, citing kinship, urged he be allowed to take his own life.',
  },
  s0515: {
    literal:
      'On yimi, Fujian observation commissioner Li Chengzhao asked to move Ting prefecture to Baishi village in Changting county; approved.',
    idiomatic:
      'On yimi, Li Chengzhao won approval to relocate Ting prefecture to Baishi in Changting.',
  },
  s0516: {
    literal:
      'An envoy of the Black-Robed Abbasid state came to court with tribute.',
    idiomatic:
      'Envoys from the Black-Robed Abbasid realm presented tribute.',
  },
  s0517: {
    literal:
      'Second month, yisi: Luzhou prefect Yang Zilin was made Shaan prefect.',
    idiomatic:
      'On yisi of the second month, Yang Zilin of Luzhou became Shaan prefect.',
  },
  s0518: {
    literal:
      'On yimao, chief minister Du Hongjian resigned as Shannan-Xichuan deputy commander; approved.',
    idiomatic:
      'On yimao, Du Hongjian resigned the Shannan-Xichuan deputy command; the emperor assented.',
  },
  s0519: {
    literal:
      'Night of bingchen, earthquake; three thunderous sounds.',
    idiomatic:
      'On the night of bingchen the earth shook with three peals like thunder.',
  },
  s0520: {
    literal:
      'On xinyou, Hunan all-circuits training and observation commissioner and Hengzhou prefect Wei Zhijin was made Tanzhou prefect.',
    idiomatic:
      'On xinyou, Wei Zhijin of Hunan and Hengzhou was appointed Tanzhou prefect.',
  },
  s0521: {
    literal:
      'Thereupon the Hunan army was moved to Tanzhou.',
    idiomatic:
      'The Hunan garrison was then shifted to Tanzhou.',
  },
  s0522: {
    literal:
      'Jiangxi training commissioner Wei Shaoyou came to court.',
    idiomatic:
      'Wei Shaoyou of Jiangxi came to audience.',
  },
  s0523: {
    literal:
      'Third month, renshen, edict:',
    idiomatic:
      'On renshen of the third month an edict ran:',
  },
  s0524: {
    literal:
      'Minister of Personnel Pei Zunqing was made right vice director; Liu Yan became minister of personnel.',
    idiomatic:
      'Pei Zunqing became right vice director; Liu Yan took the ministry of personnel.',
  },
  s0525: {
    literal:
      'On gengyin, Jiangxi training commissioner Wei Shaoyou was enfeoffed Duke of Zhao.',
    idiomatic:
      'On gengyin, Wei Shaoyou was made Duke of Zhao.',
  },
  s0526: {
    literal:
      'On bingshen, Xian prefecture was restored.',
    idiomatic:
      'On bingshen Xianzhou was re-established.',
  },
  s0527: {
    literal:
      'Summer, fourth month, renyin: Shaan Yuyi county reverted to Anyi county; Guo Tianping county reverted to Hucheng county.',
    idiomatic:
      'On renyin of the fourth month, Yuyi became Anyi again and Tianping became Hucheng.',
  },
  s0528: {
    literal:
      'Fifth month, bingxu, the capital shook in an earthquake.',
    idiomatic:
      'On bingxu of the fifth month the capital was shaken by earthquake.',
  },
  s0529: {
    literal:
      'On xinmao, Pugu Huai\'en\'s daughter was made Princess Chonghui and married the Uyghur qaghan; Vice Minister of War Li Han was sent to invest her.',
    idiomatic:
      'On xinmao, Huai\'en\'s daughter became Princess Chonghui and wed the Uyghur qaghan, with Li Han bearing the patent of investiture.',
  },
  s0530: {
    literal:
      'Sixth month, dingyou: crown prince tutor Zang Xirang was made acting minister of works and Weibei commissioner;',
    idiomatic:
      'On dingyou, crown prince tutor Zang Xirang became acting minister of works and Weibei commissioner;',
  },
  s0531: {
    literal:
      'Weibei commissioner Li Guangjin was made grand guardian of the heir.',
    idiomatic:
      'Li Guangjin of Weibei was made grand guardian of the heir.',
  },
  s0532: {
    literal:
      'On xinhai, Chenzhou was raised to a grand protectorate; Chen, Wu, Xi, Jin, Ye, and other prefectures were split off for a training and observation commissioner.',
    idiomatic:
      'On xinhai, Chenzhou became a protectorate and a training commissioner was set over Chen, Wu, Xi, Jin, Ye, and neighboring prefectures.',
  },
  s0533: {
    literal:
      'Autumn, seventh month, jisi: Feng prefect Cui Guan was made Tanzhou prefect and Hunan all-circuits training and observation commissioner.',
    idiomatic:
      'On jisi of the seventh month, Cui Guan of Feng became Tanzhou prefect and Hunan commissioner.',
  },
  s0534: {
    literal:
      'On guiwei, because penal officials abused punishment throughout the realm, an edict:',
    idiomatic:
      'On guiwei, citing abusive punishments empire-wide, the emperor issued an edict:',
  },
  s0535: {
    literal:
      'Earlier, the emperor\'s maternal cousin Xue Hua, in wine and lust, had slain three with his own hand and cast the bodies in a well; when the affair broke he was imprisoned and granted suicide—hence this edict.',
    idiomatic:
      'Earlier the emperor\'s cousin Xue Hua, drunk and lustful, had killed three men and hidden them in a well; tried and allowed suicide, which prompted this edict.',
  },
  s0536: {
    literal:
      'Eighth month, bingshen new moon.',
    idiomatic:
      'The eighth month opened on bingshen.',
  },
  s0537: {
    literal:
      'From the fourth month of summer rain continued to this month; capital grain reached eight hundred cash per dou.',
    idiomatic:
      'Rain since the fourth month drove capital grain to eight hundred cash a dou.',
  },
  s0538: {
    literal:
      'The government released twenty thousand shi of grain, sold at reduced price to aid the poor.',
    idiomatic:
      'The court sold twenty thousand shi of grain at reduced price to relieve the poor.',
  },
  s0539: {
    literal:
      'On jimao, a tiger entered Yuan Zai\'s ancestral temple in Changshou ward; hunting officer Zhou Hao shot it dead with a crossbow.',
    idiomatic:
      'On jimao a tiger entered Yuan Zai\'s family shrine in Changshou; Zhou Hao of the hunt shot it dead.',
  },
  s0540: {
    literal:
      'Winter, tenth month, yimao: Ruzhou prefect Meng Hao was made metropolitan prefect of the capital.',
    idiomatic:
      'On yimao of the tenth winter month, Meng Hao of Ruzhou became capital metropolitan prefect.',
  },
  s0541: {
    literal:
      'Eleventh month, xinwei: hunting within the capital precincts was forbidden.',
    idiomatic:
      'On xinwei of the eleventh month, hunting inside the capital bounds was banned.',
  },
  s0542: {
    literal:
      'On yihai, vice director of the Chancellery, fellow grand councilor, and Duke of Wei Du Hongjian died.',
    idiomatic:
      'On yihai, grand councilor and Duke of Wei Du Hongjian died.',
  },
  s0543: {
    literal:
      'On bingzi, left vice director and Duke of Ji Pei Mian became fellow grand councilor, eastern capital guardian, and deputy commander of Henan, Huainan, Huai-xi, and Shannan-east circuits.',
    idiomatic:
      'On bingzi, Pei Mian became grand councilor, Luoyang guardian, and deputy commander over Henan and allied circuits.',
  },
  s0544: {
    literal:
      'Twelfth month, yimi: an edict set left and right remonstrating and advising officials and inner attendants at two posts each on either side; the rest were abolished.',
    idiomatic:
      'On yimi of the twelfth month, remonstrators and advisers were fixed at two posts per side; surplus posts were cut.',
  },
  s0545: {
    literal:
      'On wuxu, Pei Mian died.',
    idiomatic:
      'On wuxu Pei Mian died.',
  },
  s0546: {
    literal:
      'On xinyou, an edict divided the capital prefecture\'s land tax into two grades: upper fields one dou per mu, lower six sheng; reclaimed wasteland paid two sheng.',
    idiomatic:
      'On xinyou the capital\'s land tax was split: top grade one dou per mu, lower six sheng, wasteland reclaimed at two sheng.',
  },
  s0547: {
    literal:
      'Dali 5, spring, first month, yichou new moon.',
    idiomatic:
      'Dali 5 began on the yichou new moon of the first spring month.',
  },
  s0548: {
    literal:
      'On xinmao, Shaan military commissioner Huangfu Wen was made acting Fengxiang metropolitan prefect and Fengxiang-Longyou commissioner;',
    idiomatic:
      'On xinmao, Huangfu Wen of Shaan became acting Fengxiang prefect and Fengxiang-Longyou commissioner;',
  },
  s0549: {
    literal:
      'Fengxiang commissioner Li Baoyu was made acting Liangzhou administrator and Shannan-west commissioner.',
    idiomatic:
      'Li Baoyu of Fengxiang took Liangzhou and the Shannan-west command.',
  },
  s0550: {
    literal:
      'On renshen, Henan metropolitan prefect Zhang Yanshang was made censor-in-chief and eastern capital guardian.',
    idiomatic:
      'On renshen, Zhang Yanshang of Henan became censor-in-chief and Luoyang guardian.',
  },
  s0551: {
    literal:
      'The deputy commands of Henan, Huai-xi, and Shannan-east were abolished; their armies passed to the eastern capital guardian.',
    idiomatic:
      'Deputy commands over Henan, Huai-xi, and Shannan-east were ended and their troops placed under Luoyang.',
  },
  s0552: {
    literal:
      'Second month, wuxu: Li Baoyu moved headquarters to Zhouzhi; Fengxiang troops, enraged, plundered for days before stopping.',
    idiomatic:
      'On wuxu, Baoyu moved to Zhouzhi; Fengxiang soldiers rioted and looted for days.',
  },
  s0553: {
    literal:
      'On jihai.',
    idiomatic:
      'The same day, on jihai,',
  },
  s0554: {
    literal:
      'Xianchuan was abolished; Xiangcheng and Yexian were attached to Ruzhou.',
    idiomatic:
      'Xianchuan was abolished and Xiangcheng and Ye attached to Ruzhou.',
  },
  s0555: {
    literal:
      'An edict abolished Yu Chao\'en\'s post as commissioner overseeing the army.',
    idiomatic:
      'An edict stripped Yu Chao\'en of his army-overseer commission.',
  },
  s0556: {
    literal:
      'On jisi, Chao\'en hanged himself.',
    idiomatic:
      'On jisi, Yu Chao\'en took his own life by hanging.',
  },
  s0557: {
    literal:
      'On wuyin, an edict fixed the capital prefecture\'s household tax.',
    idiomatic:
      'On wuyin an edict fixed household taxes for the capital district.',
  },
  s0558: {
    literal:
      'Summer tax: upper fields six sheng per mu, lower four.',
    idiomatic:
      'Summer levy: six sheng per mu on top fields, four on lower.',
  },
  s0559: {
    literal:
      'Autumn tax: upper fields five sheng per mu, lower three.',
    idiomatic:
      'Autumn levy: five sheng on top fields, three on lower.',
  },
  s0560: {
    literal:
      'Reclaimed wasteland paid two sheng.',
    idiomatic:
      'Newly opened wasteland paid two sheng.',
  },
  s0561: {
    literal:
      'On jichou, edict:',
    idiomatic:
      'On jichou an edict declared:',
  },
  s0562: {
    literal:
      'Thereupon all fiscal affairs of the revenue bureau were entrusted to the chief ministers.',
    idiomatic:
      'Henceforth all revenue matters went to the chief ministers.',
  },
  s0563: {
    literal:
      'On xinmao, Vice Minister of War Jia Zhi was made metropolitan prefect of the capital.',
    idiomatic:
      'On xinmao, Jia Zhi became capital metropolitan prefect.',
  },
  s0564: {
    literal:
      'Capital west military commissioner Li Zhongchen was made Fengxiang metropolitan prefect, replacing Huangfu Wen.',
    idiomatic:
      'Li Zhongchen of the capital west army replaced Huangfu Wen as Fengxiang metropolitan prefect.',
  },
  s0565: {
    literal:
      'Wen moved headquarters to Shaan.',
    idiomatic:
      'Huangfu Wen transferred to Shaan.',
  },
  s0566: {
    literal:
      'Summer, fourth month, gengzi: Hunan training commissioner Cui Gan was killed by his military commissioner Zang Jie; Jie seized Tanzhou in revolt; Feng prefect Yang Zilin, Daozhou prefect Pei Qiu, and Hengzhou prefect Yang Zhang led troops against Jie.',
    idiomatic:
      'On gengzi, Cui Gan of Hunan was murdered by Zang Jie, who seized Tanzhou; Yang Zilin, Pei Qiu, and Yang Zhang marched against him.',
  },
  s0567: {
    literal:
      'Night of yisi, the Year Star entered the Chariot.',
    idiomatic:
      'On the night of yisi Jupiter entered the Chariot constellation.',
  },
  s0568: {
    literal:
      'On bingwu, the Former Farmer and Horse Ancestor altars were restored and sacrifices offered.',
    idiomatic:
      'On bingwu the Former Farmer and Horse Ancestor altars were restored to worship.',
  },
  s0569: {
    literal:
      'On dingwei, Youzhou commissioner Zhu Xicai was enfeoffed Prince of Gaomi commandery.',
    idiomatic:
      'On dingwei, Zhu Xicai of Youzhou was made Prince of Gaomi.',
  },
  s0570: {
    literal:
      'Night of jiwei, a comet rose at the Five Chariots, three zhang long.',
    idiomatic:
      'On the night of jiwei a three-zhang comet appeared at the Five Chariots.',
  },
  s0571: {
    literal:
      'On gengshen, chief minister and Taiyuan metropolitan prefect Wang Jin entered court.',
    idiomatic:
      'On gengshen, Wang Jin of Taiyuan came to audience as chief minister.',
  },
  s0572: {
    literal:
      'Fifth month, xinwei: Vice Minister of Punishments Li Gan was made Guilin prefect and Guiguan defense, pacification, recruitment, and observation commissioner.',
    idiomatic:
      'On xinwei, Li Gan became Guilin prefect and commissioner over Guiguan.',
  },
  s0573: {
    literal:
      'Night of jimao, a comet rose in the north, white in color.',
    idiomatic:
      'On the night of jimao a white comet rose in the north.',
  },
  s0574: {
    literal:
      'On gengchen, Director of Rites and Minister of Rites Pei Shiyao was demoted to Qianzhou prefect; Vice Minister of Revenue and fiscal commissioner Diwu Qi was demoted to Raozhou prefect.',
    idiomatic:
      'On gengchen, Pei Shiyao was sent to Qianzhou and Diwu Qi to Raozhou.',
  },
  s0575: {
    literal:
      'Both were Yu Chao\'en\'s faction.',
    idiomatic:
      'Both had been partisans of Yu Chao\'en.',
  },
  s0576: {
    literal:
      'Yuan Zai, having executed Chao\'en, issued an edict abolishing the commission and dismissing them.',
    idiomatic:
      'After killing Chao\'en, Yuan Zai abolished the post by edict and cashiered his allies.',
  },
  s0577: {
    literal:
      'On guiwei, Imperial Guard general Xin Jinggao was made Tanzhou prefect and Hunan observation commissioner.',
    idiomatic:
      'On guiwei, Xin Jinggao of the guard became Tanzhou prefect and Hunan commissioner.',
  },
  s0578: {
    literal:
      'On jiashen, white vapor in the northwest filled the sky.',
    idiomatic:
      'On jiashen white mist in the northwest stretched across heaven.',
  },
  s0579: {
    literal:
      'Dang, Xi, Zhe, Jing, and Gong prefectures were moved to mountain strongholds to guard against Tibet.',
    idiomatic:
      'Dang, Xi, Zhe, Jing, and Gong were relocated to mountain passes against Tibetan raids.',
  },
  s0580: {
    literal:
      'Sixth month, jiwei: the comet finally faded; an amnesty freed all prisoners in custody.',
    idiomatic:
      'On jiwei the comet vanished and the throne amnestied prisoners empire-wide.',
  },
  s0581: {
    literal:
      'Autumn, seventh month, dingmao: Zhedong observation commissioner, Yuezhou prefect, and censor-in-chief Xue Jianxun was made acting minister of works, Taiyuan metropolitan prefect, northern capital guardian, and Hedong military commissioner.',
    idiomatic:
      'On dingmao, Xue Jianxun of Zhedong became acting minister of works, Taiyuan prefect, and Hedong commissioner.',
  },
  s0582: {
    literal:
      'That month capital grain reached one thousand cash per dou.',
    idiomatic:
      'That month grain in the capital cost a thousand cash the dou.',
  },
  s0583: {
    literal:
      'Eighth month, xinmao: chief minister Yuan Zai memorialized to establish a central capital at Hezhong, traveling there in late autumn and returning in mid-spring to escape Tibetan raids.',
    idiomatic:
      'On xinmao, Yuan Zai asked to make Hezhong a secondary capital, wintering there and returning in spring to escape Tibetans.',
  },
  s0584: {
    literal:
      'The memorial entered and received no reply.',
    idiomatic:
      'The memorial went unanswered.',
  },
  s0585: {
    literal:
      'The gist of Zai\'s memorial was that household taxes of ten circuits including Guanfu and Hedong should enter the capital, and fifty thousand elite troops be raised to awe the four quarters.',
    idiomatic:
      'Zai argued that taxes from Guanfu, Hedong, and eight other regions should feed the capital and fifty thousand crack troops awe the realm.',
  },
  s0586: {
    literal:
      'The words were full of maneuver; he wished power to return to himself.',
    idiomatic:
      'The rhetoric was cunning; he meant to concentrate power in his own hands.',
  },
  s0587: {
    literal:
      'Ninth month, dingchou: Xu, She, Chi, and other circuits\' all-training observation commissioner, Xu prefect, and acting censor-in-chief Chen Shaoyou was made Zhejiang-east training and observation commissioner.',
    idiomatic:
      'On dingchou, Chen Shaoyou became Zhejiang-east training and observation commissioner.',
  },
  s0588: {
    literal:
      'Tibet raided Yongshou.',
    idiomatic:
      'Tibetans raided Yongshou.',
  },
  s0589: {
    literal:
      'Bianzhou\'s Tian Shenggong came to court.',
    idiomatic:
      'Tian Shenggong of Bianzhou came to audience.',
  },
  s0590: {
    literal:
      'Twelfth month, yimi: Wu prefecture was renamed Xi; Ye prefecture was renamed Jiang.',
    idiomatic:
      'On yimi of the twelfth month, Wu became Xi prefecture and Ye became Jiang.',
  },
  s0591: {
    literal:
      'Dali 6, spring, first month, jiwei new moon.',
    idiomatic:
      'Dali 6 opened on the jiwei new moon of the first spring month.',
  },
  s0592: {
    literal:
      'On wuyin, the Suwu army was established at Yancheng in Yan prefecture.',
    idiomatic:
      'On wuyin the Suwu army was posted at Yancheng in Yanzhou.',
  },
  s0593: {
    literal:
      'Second month, yiyou: censor-in-chief Jing Kuo died.',
    idiomatic:
      'On yiyou of the second month, censor-in-chief Jing Kuo died.',
  },
  s0594: {
    literal:
      'Summer, fourth month, dingsi: the emperor held the palace examination for decree graduates at Xuanzheng Hall; by evening those whose answers were unfinished were given candles from the imperial kitchen to finish their talent.',
    idiomatic:
      'On dingsi the emperor examined decree graduates at Xuanzheng Hall and, when answers ran past nightfall, sent palace candles so they could finish.',
  },
  s0595: {
    literal:
      'On jiwei, Feng prefect Yang Zilin came to court and was granted the name You.',
    idiomatic:
      'On jiwei, Yang Zilin of Feng came to court and received the name You.',
  },
  s0596: {
    literal:
      'On dingchou, Guo prefecture was renamed Chong.',
    idiomatic:
      'On dingchou, Guo prefecture became Chongzhou.',
  },
  s0597: {
    literal:
      'On wuyin, edict: "Ornate weaving and embroidery harm women\'s proper work.',
    idiomatic:
      'On wuyin an edict declared: "Fine brocades and embroidery waste women\'s labor.',
  },
  s0598: {
    literal:
      'Now armies have not ceased and the people are emptied—how can we let wanton craft injure constant regulation?',
    idiomatic:
      'Armies still march and the people are drained—we cannot let luxury crafts break the law.',
  },
  s0599: {
    literal:
      'All brocades with dragon, paired phoenix, qilin, lion, heavenly horse, demon-queller, crane, sacred fungus, ten-thousand-character, double-victory, open-back patterns, and great floss silks, openwork, and six-break weaves and above are altogether forbidden.',
    idiomatic:
      'Brocades bearing dragons, phoenix pairs, qilin, lions, heavenly horses, demon-quellers, cranes, sacred fungus, wan characters, double victories, open backs, heavy floss, openwork, and six-break weaves or finer are banned outright.',
  },
  s0600: {
    literal:
      'Long-run Goryeo white brocades and large and small flowered silks may be woven as before.',
    idiomatic:
      'Long-run Goryeo white brocades and large and small patterned silks may still be woven under the old rules.',
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
