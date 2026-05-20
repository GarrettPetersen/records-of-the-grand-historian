#!/usr/bin/env node
/** Batch 9: s0801–s0900 (Jiutangshu ch.011, Daizong — Dali 11–12 — Yuan Zai purge, Yang Wan, Yan Zhenqing) */

import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/011.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 801;
const END = 900;

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
  s0801: {
    literal:
      'At Hangzhou a great wind turned the sea; tidal surge drowned five thousand households and a thousand boats.',
    idiomatic:
      'A Hangzhou gale drove the tide inland, drowning five thousand homes and a thousand boats.',
  },
  s0802: {
    literal:
      'Eighth month, dingmao: Tian Chengsi submitted a memorial asking to submit and return to court.',
    idiomatic:
      'On dingmao, Tian Chengsi asked to surrender and return to allegiance.',
  },
  s0803: {
    literal:
      'Night of wuzi, the moon entered the Supreme Palace Enclosure.',
    idiomatic:
      'On the night of wuzi the moon entered the Supreme Palace Enclosure.',
  },
  s0804: {
    literal:
      'On jichou, Tian Chengsi\'s officer Lu Ziqi attacked Cizhou.',
    idiomatic:
      'On jichou, Lu Ziqi of Chengsi\'s army attacked Cizhou.',
  },
  s0805: {
    literal:
      'Ninth month, wuxu: Jingnan military commissioner Wei Boyu came to court.',
    idiomatic:
      'On wuxu, Wei Boyu of Jingnan came to audience.',
  },
  s0806: {
    literal:
      'On renyin, capital prisoners were amnestied.',
    idiomatic:
      'On renyin the capital prisoners were amnestied.',
  },
  s0807: {
    literal:
      'On wushen, Uyghurs killed a man in broad daylight in the market; officers seized him and held him in Wannian jail.',
    idiomatic:
      'On wushen, Uyghurs killed a man in the market by day; officers jailed the killer in Wannian.',
  },
  s0808: {
    literal:
      'Their chief Chixin entered the county with weapons, seized the prisoner, and wounded jail clerks.',
    idiomatic:
      'Chief Chixin armed his men, stormed the jail, freed the killer, and cut down the clerks.',
  },
  s0809: {
    literal:
      'The moon wore a halo; Mars trespassed Mao, the Five Chariots, Shen, and the Well.',
    idiomatic:
      'The moon haloed while Mars crossed Mao, the Five Chariots, Shen, and the Well.',
  },
  s0810: {
    literal:
      'On guichou, Tibet raided Longzhou; Fengxiang\'s Li Baoyu struck them.',
    idiomatic:
      'On guichou Tibet raided Long and Li Baoyu of Fengxiang counterattacked.',
  },
  s0811: {
    literal:
      'On wuwu, Youzhou commissioner Zhu Ci garrisoned Fengtian.',
    idiomatic:
      'On wuwu, Zhu Ci of Youzhou took post at Fengtian.',
  },
  s0812: {
    literal:
      'Winter, tenth month, xinyou day: the sun was eclipsed.',
    idiomatic:
      'On xinyou of the tenth winter month there was a solar eclipse.',
  },
  s0813: {
    literal:
      'On guihai, Shangzhou prefect Ma Sui was made acting left regular cavalry attendant and Heyang Three Cities commissioner.',
    idiomatic:
      'On guihai, Ma Sui became acting left regular cavalry attendant and Heyang Three Cities commissioner.',
  },
  s0814: {
    literal:
      'On jiazi, Zhaoyi commissioner Li Chengzhao fought Lu Ziqi at Qingshui in Cizhou and crushed him, capturing Ziqi alive for presentation.',
    idiomatic:
      'On jiazi, Li Chengzhao routed Lu Ziqi at Qingshui and sent him captive to court.',
  },
  s0815: {
    literal:
      'On bingyin, Noble Consort Dugu died; posthumously titled Empress Zhenyi.',
    idiomatic:
      'On bingyin, Noble Consort Dugu died and was posthumously named Empress Zhenyi.',
  },
  s0816: {
    literal:
      'On jichou, right vice director Pei Zunqing died.',
    idiomatic:
      'On jichou, Pei Zunqing, right vice director, died.',
  },
  s0817: {
    literal:
      'Eleventh month, xinmao: Princess of Xinping died.',
    idiomatic:
      'On xinmao, the Princess of Xinping died.',
  },
  s0818: {
    literal:
      'On dingyou, Wu Xiguang, Chengsi\'s installed Ying prefect, surrendered the city.',
    idiomatic:
      'On dingyou, Ying prefect Wu Xiguang, Chengsi\'s man, surrendered.',
  },
  s0819: {
    literal:
      'On dingwei, Lu Sigong broke Guangzhou, captured Geshu Huang, and presented his head.',
    idiomatic:
      'On dingwei, Lu Sigong took Guangzhou, seized Geshu Huang, and sent his head to court.',
  },
  s0820: {
    literal:
      'Dali 11, spring, first month, gengyin new moon: Tian Chengsi submitted a confession.',
    idiomatic:
      'Dali 11 opened on gengyin; Tian Chengsi submitted a confession of guilt.',
  },
  s0821: {
    literal:
      'On renchen, remonstrating grand master Du Ya was sent to Weizhou to proclaim reassurance and allow his renewal.',
    idiomatic:
      'On renchen, Du Ya was sent to Weizhou to offer Chengsi a chance to repent.',
  },
  s0822: {
    literal:
      'On xinhai.',
    idiomatic:
      'That same day, on xinhai,',
  },
  s0823: {
    literal:
      'Jiannan commissioner Cui Ning memorialized crushing two hundred thousand Tibet, ten thousand heads cut, eleven hundred fifty leaders captured alive and presented at court.',
    idiomatic:
      'Cui Ning of Jiannan reported defeating two hundred thousand Tibetans, taking ten thousand heads and 1,150 leaders alive.',
  },
  s0824: {
    literal:
      'Second month, guihai: Jingnan commissioner Wei Boyu died in the capital.',
    idiomatic:
      'On guihai, Wei Boyu of Jingnan died at court.',
  },
  s0825: {
    literal:
      'On wuzi, the Heyang army mutinied again and plundered for three days; army supervisor Ran Tinglan led troops and beheaded the ringleaders.',
    idiomatic:
      'On wuzi Heyang mutinied and looted three days until Ran Tinglan beheaded the leaders.',
  },
  s0826: {
    literal:
      'Order was restored.',
    idiomatic:
      'Order returned.',
  },
  s0827: {
    literal:
      'On wushen, Princess of Changle died.',
    idiomatic:
      'On wushen, the Princess of Changle died.',
  },
  s0828: {
    literal:
      'On xinhai, censor-in-chief Li Qiyun died.',
    idiomatic:
      'On xinhai, Li Qiyun, censor-in-chief, died.',
  },
  s0829: {
    literal:
      'Summer, fourth month, wuwu new moon.',
    idiomatic:
      'The fourth summer month opened on wuwu.',
  },
  s0830: {
    literal:
      'On bingzi, Zhexi observation commissioner, Suzhou prefect, and censor-in-chief Li Han was put in charge of the censorate and made capital-circuits observation commissioner.',
    idiomatic:
      'On bingzi, Li Han became censor-in-chief and capital-circuits observer.',
  },
  s0831: {
    literal:
      'On jimao, former Huainan commissioner and Yangzhou chief administrator Zhang Yanshang was made Jiangling metropolitan prefect, concurrent censor-in-chief, and Jingnan commissioner.',
    idiomatic:
      'On jimao, Zhang Yanshang became Jiangling prefect and Jingnan commissioner.',
  },
  s0832: {
    literal:
      'Fifth month, guisi: Yongping commissioner Li Mian was made Bian prefect and Bian-Song and seven other circuits\' observation commissioner; at the time Bian officer Li Lingyao had murdered Pu prefect Meng Jian and allied north with Tian Chengsi—hence Mian was also given Bian.',
    idiomatic:
      'On guisi, Li Mian took Bian because Li Lingyao had killed Pu\'s prefect and joined Chengsi.',
  },
  s0833: {
    literal:
      'Lingyao was appointed Pu prefect but refused the edict.',
    idiomatic:
      'Lingyao was named Pu prefect and rejected the order.',
  },
  s0834: {
    literal:
      'Lingyao was made Pu prefect; Lingyao did not accept the edict.',
    idiomatic:
      'Though named Pu prefect, Lingyao would not obey.',
  },
  s0835: {
    literal:
      'Sixth month, wuxu: Li Lingyao was made Bian prefect and acting commissioner.',
    idiomatic:
      'On wuxu, Li Lingyao was made acting Bian commissioner.',
  },
  s0836: {
    literal:
      'Autumn, seventh month, wuzi night: a cloudburst; water on level ground a full foot deep; ditches overflowed and ruined twelve hundred ward households.',
    idiomatic:
      'On the night of wuzi a cloudburst flooded the capital a foot deep and wrecked twelve hundred homes.',
  },
  s0837: {
    literal:
      'On gengyin, Tian Chengsi\'s troops raided Huazhou; Li Mian resisted and was defeated.',
    idiomatic:
      'On gengyin, Chengsi raided Hua and beat Li Mian.',
  },
  s0838: {
    literal:
      'Eighth month, bingyin: Youzhou commissioner Zhu Ci was made fellow grand councilor.',
    idiomatic:
      'On bingyin, Zhu Ci became fellow grand councilor.',
  },
  s0839: {
    literal:
      'Li Lingyao held Bian in rebellion.',
    idiomatic:
      'Li Lingyao rebelled at Bian.',
  },
  s0840: {
    literal:
      'On jiashen, Huai-xi Li Zhongchen, Hua Li Mian, and Heyang Ma Sui were ordered to march against him.',
    idiomatic:
      'On jiashen, Li Zhongchen, Li Mian, and Ma Sui were ordered to crush Lingyao.',
  },
  s0841: {
    literal:
      'Intercalary month, dingyou: Venus crossed the sky.',
    idiomatic:
      'In the intercalary month, on dingyou Venus crossed the heavens.',
  },
  s0842: {
    literal:
      'Ninth month, yichou: Li Zhongchen and others encamped at Zhengzhou; Lingyao\'s masses came to fight closely.',
    idiomatic:
      'On yichou, loyal armies camped at Zhengzhou as Lingyao\'s troops pressed them.',
  },
  s0843: {
    literal:
      'The Huai-xi army mutinied and withdrew to Xingze.',
    idiomatic:
      'Huai-xi troops mutinied and fell back to Xingze.',
  },
  s0844: {
    literal:
      'On wuchen, Ziqing\'s Li Zhengji memorialized taking Yan and Pu prefectures.',
    idiomatic:
      'On wuchen, Li Zhengji claimed Yan and Pu.',
  },
  s0845: {
    literal:
      'Winter, tenth month, yiyou: loyal armies broke the bandits at Zhongmou, advanced, defeated them again outside Bian, and besieged the city.',
    idiomatic:
      'On yiyou, imperial troops routed Lingyao at Zhongmou and again outside Bian, then besieged the city.',
  },
  s0846: {
    literal:
      'On yichou, Chengsi sent his nephew Yue with thirty thousand to aid Lingyao.',
    idiomatic:
      'On yichou, Chengsi sent thirty thousand under his nephew Yue to rescue Lingyao.',
  },
  s0847: {
    literal:
      'On bingwu, Huai-xi and Heyang forces jointly struck Tian Yue\'s camp; his masses were crushed and Yue fled north bare.',
    idiomatic:
      'On bingwu, loyal armies shattered Tian Yue\'s camp and he fled north.',
  },
  s0848: {
    literal:
      'Hearing of Yue\'s defeat, Lingyao abandoned the city and fled.',
    idiomatic:
      'When Lingyao heard Yue had lost, he abandoned Bian and ran.',
  },
  s0849: {
    literal:
      'Bianzhou was pacified.',
    idiomatic:
      'Bian was recovered.',
  },
  s0850: {
    literal:
      'On dingwei, Hua officer Du Rujiang captured Lingyao alive and presented him.',
    idiomatic:
      'On dingwei, Du Rujiang took Lingyao alive and sent him to court.',
  },
  s0851: {
    literal:
      'Twelfth month, dinghai: Pinglu-Ziqing commissioner, acting left vice director, Qing prefect, and Prince of Raoyang Li Zhengji was made acting grand master and fellow grand councilor; Chengde commissioner, grand tutor of the heir, acting left vice director, and Prince of Longxi Li Baochen was made acting grand master and fellow grand councilor.',
    idiomatic:
      'On dinghai, Li Zhengji and Li Baochen were both made acting grand masters and fellow grand councilors.',
  },
  s0852: {
    literal:
      'On gengyin, Jingyuan commissioner, acting left vice director, director of state affairs, and Prince of Fufeng Ma Lin died.',
    idiomatic:
      'On gengyin, Ma Lin of Jingyuan, left vice director, died.',
  },
  s0853: {
    literal:
      'On dingyou, Jingyuan deputy commissioner, trial minister of ceremonies, and Prince of Zhangye Duan Xiushi was made acting Hedong commissioner—northern capital guardian Xue Jianxun had died of illness.',
    idiomatic:
      'On dingyou, Duan Xiushi acted for Hedong after Xue Jianxun\'s death.',
  },
  s0854: {
    literal:
      'Zhaoyi commissioner Li Chengzhao memorialized illness; Ze-Lu marching chief Li Baozhen was made acting Ci-Xing military commissioner.',
    idiomatic:
      'Li Chengzhao claimed illness; Li Baozhen took acting command of Ci and Xing.',
  },
  s0855: {
    literal:
      'On gengxu, Huai-xi commissioner, acting right vice director, An prefect, and Prince of Xiping Li Zhongchen was made acting grand master and fellow grand councilor, still concurrent Bian prefect.',
    idiomatic:
      'On gengxu, Li Zhongchen became grand councilor while keeping Bian.',
  },
  s0856: {
    literal:
      'Dali 12, spring, first month, jiayin new moon.',
    idiomatic:
      'Dali 12 opened on the jiayin new moon of the first spring month.',
  },
  s0857: {
    literal:
      'On xinyou, Four Garrisons-Northern Court-Jingyuan deputy commissioner and acting commissioner, Prince of Zhangye Duan Xiushi was made Jing prefect, concurrent censor-in-chief, and training commissioner of that prefecture.',
    idiomatic:
      'On xinyou, Duan Xiushi became Jing prefect and its training commissioner.',
  },
  s0858: {
    literal:
      'The moon occulted the Chariot.',
    idiomatic:
      'The moon passed before the Chariot.',
  },
  s0859: {
    literal:
      'Bohai envoys presented eleven Japanese dancing girls.',
    idiomatic:
      'Bohai presented eleven Japanese dancers.',
  },
  s0860: {
    literal:
      'Night of guiyou, the moon occulted the great star before the Heart and also entered the southern Dipper leader.',
    idiomatic:
      'On the night of guiyou the moon occulted the Heart and entered the Dipper\'s leader.',
  },
  s0861: {
    literal:
      'The capital was dry; orders went out for prayers in separate quarters.',
    idiomatic:
      'Drought in the capital brought orders for prayers throughout the city.',
  },
  s0862: {
    literal:
      'Second month, wuzi: Ziqing commissioner Li Zhengji\'s son Na was made Qing prefect and acting Ziqing commissioner.',
    idiomatic:
      'On wuzi, Li Zhengji\'s son Na became Qing prefect and acting Ziqing commissioner.',
  },
  s0863: {
    literal:
      'On dingwei, Lang prefect Li Guoqing was made Qian prefect and defense, pacification, recruitment, and observation commissioner.',
    idiomatic:
      'On dingwei, Li Guoqing became Qian prefect and southwestern commissioner.',
  },
  s0864: {
    literal:
      'Third month, yimao: Hexi-Longyou deputy commander, Fengxiang-Huai-Ze-Lu-Qin-Long commissioner, minister of war, fellow grand councilor, Lu chief administrator, acting Fengxiang metropolitan prefect, pillar of state, and Duke of Liang Li Baoyu died.',
    idiomatic:
      'On yimao, Li Baoyu of Fengxiang and many commands died.',
  },
  s0865: {
    literal:
      'On renxu, the moon entered the Supreme Palace Enclosure.',
    idiomatic:
      'On renxu the moon entered the Supreme Palace Enclosure.',
  },
  s0866: {
    literal:
      'On guihai, Taiyuan junior metropolitan prefect, Hedong marching chief, and acting Hedong commissioner Bao Fang was made Taiyuan metropolitan prefect, censor-in-chief, northern capital guardian, and Hedong commissioner.',
    idiomatic:
      'On guihai, Bao Fang became Taiyuan prefect and Hedong commissioner.',
  },
  s0867: {
    literal:
      'Night of wuchen, the moon pressed the star before the Heart.',
    idiomatic:
      'On the night of wuchen the moon neared the Heart.',
  },
  s0868: {
    literal:
      'On gengwu, demoted official Yongzhou prefect Tian Chengsi was restored as Weibo commissioner; other posts as before.',
    idiomatic:
      'On gengwu, Chengsi was restored to Weibo after his demotion to Yongzhou.',
  },
  s0869: {
    literal:
      'Chengsi\'s nephew Yue and sons Guan, Xu, and Lun likewise recovered their old posts.',
    idiomatic:
      'His nephew Yue and sons Guan, Xu, and Lun regained their offices.',
  },
  s0870: {
    literal:
      'On gengchen, chief ministers Yuan Zai and Wang Jin were charged and imprisoned; Minister of Personnel Liu Yan was ordered to investigate.',
    idiomatic:
      'On gengchen, Yuan Zai and Wang Jin were jailed; Liu Yan was told to try them.',
  },
  s0871: {
    literal:
      'On xinsi, decree: drafting vice director and fellow councilor Yuan Zai was granted suicide; Chancellery vice director and fellow councilor Wang Jin was demoted to Kuozhou prefect.',
    idiomatic:
      'On xinsi, Yuan Zai was ordered to kill himself and Wang Jin was sent to Kuozhou.',
  },
  s0872: {
    literal:
      'Summer, fourth month, renwu: court gentleman and acting minister of ceremonies and state-history compiler Yang Wan was made drafting vice director; ministry of rites director and Hanlin academician Chang Gai was made Chancellery vice director—both fellow grand councilors.',
    idiomatic:
      'On renwu, Yang Wan and Chang Gai became the new chief ministers.',
  },
  s0873: {
    literal:
      'On guiwei, right heir-apparent tutor Pan Yan was made vice minister of rites.',
    idiomatic:
      'On guiwei, Pan Yan became vice minister of rites.',
  },
  s0874: {
    literal:
      'Vice Minister of Personnel Yang Yan was demoted to Daozhou aide—Yuan Zai\'s faction.',
    idiomatic:
      'Yang Yan, Zai\'s man, was banished to Daozhou.',
  },
  s0875: {
    literal:
      'Remonstrating grand master and drafting drafter Han Hui, Wang Ding, Bao Ji, Xu Huang, Vice Minister of Revenue Zhao Zong, assistant minister of justice Pei Yi, vice minister of ceremonies Wang He, and recorder Han Hui and more than ten others were all demoted for Yuan Zai.',
    idiomatic:
      'More than ten of Zai\'s allies, including Han Hui and Zhao Zong, were demoted with him.',
  },
  s0876: {
    literal:
      'Drafting drafter Du Ya, on mission to Weizhou, granted Tian Chengsi an iron certificate.',
    idiomatic:
      'Du Ya, en route to Weizhou, gave Chengsi an iron amnesty bond.',
  },
  s0877: {
    literal:
      'On guisi, former secretary supervisor Li Kui was made Muzhou prefect.',
    idiomatic:
      'On guisi, Li Kui was made Muzhou prefect.',
  },
  s0878: {
    literal:
      'Kui had been chief minister; Yuan Zai hated him; for twenty years he wandered begging on rivers and lakes; when Zai was executed he finally received a prefecture.',
    idiomatic:
      'Li Kui, once chancellor, had begged on the waterways twenty years until Zai\'s fall won him a post again.',
  },
  s0879: {
    literal:
      'Yan Zhenqing was also recalled from Huzhou—he too had been driven out by Zai.',
    idiomatic:
      'Yan Zhenqing was recalled from Huzhou, another exile Zai had engineered.',
  },
  s0880: {
    literal:
      'On yimi, the moon occulted the star before the Heart.',
    idiomatic:
      'On yimi the moon occulted the Heart.',
  },
  s0881: {
    literal:
      'On dingyou, western Sichuan defeated Tibet at Wanghan city and presented the captive general Dalon Gar Lunqiran.',
    idiomatic:
      'On dingyou, western Sichuan beat Tibet at Wanghan and sent up the general Lunqiran.',
  },
  s0882: {
    literal:
      'On renyin, former Shang prefect Wu Chongfu was made protector of Annan and commissioner of that garrison.',
    idiomatic:
      'On renyin, Wu Chongfu became protector of Annan.',
  },
  s0883: {
    literal:
      'Bohai, Xi, Khitan, Shiwei, and Mohe all sent envoys with tribute.',
    idiomatic:
      'Bohai, Xi, Khitan, Shiwei, and Mohe presented tribute.',
  },
  s0884: {
    literal:
      'On jiyou, capital officials\' stipends were increased: civil and military bureaus totaled 2,796 posts—1,854 civil, 942 military—adding 156,000 strings yearly, 260,000 with the old pay.',
    idiomatic:
      'On jiyou the court raised stipends for 2,796 posts, adding 156,000 strings a year.',
  },
  s0885: {
    literal:
      'Inner frontier deputy commander and military commissioner Hun Jian was made concurrent Bing prefect.',
    idiomatic:
      'Hun Jian of the inner frontier also became Bing prefect.',
  },
  s0886: {
    literal:
      'Fifth month, xinhai.',
    idiomatic:
      'On xinhai of the fifth month,',
  },
  s0887: {
    literal:
      'The name "training and defense commissioner" was abolished throughout the realm.',
    idiomatic:
      'Circuit training and defense commissioners were abolished empire-wide.',
  },
  s0888: {
    literal:
      'On jiayin, circuit relay offices in the upper capital called "acting commissioner" were renamed presentation courts.',
    idiomatic:
      'On jiayin, capital relay offices of acting commissioners were renamed presentation courts.',
  },
  s0889: {
    literal:
      'Night of bingchen, the moon entered the Supreme Palace Enclosure.',
    idiomatic:
      'On the night of bingchen the moon entered the Supreme Palace Enclosure.',
  },
  s0890: {
    literal:
      'On xinyou, Minister of Punishments Wang Ang was demoted to Lianzhou prefect; Ang died at Wanzhou.',
    idiomatic:
      'On xinyou, Wang Ang was sent to Lianzhou and died at Wan.',
  },
  s0891: {
    literal:
      'On gengwu, an edict destroyed the tombs of Yuan Zai\'s grandfather and father, opened the coffins and cast out the bones, and burned the private temple tablets in Daning ward.',
    idiomatic:
      'On gengwu the court desecrated Zai\'s family tombs and burned his private ancestral tablets.',
  },
  s0892: {
    literal:
      'On jiaxu, former protector of Annan Zhang Boyi was made Guangzhou prefect, concurrent censor-in-chief, and Lingnan military commissioner.',
    idiomatic:
      'On jiaxu, Zhang Boyi became Guangzhou prefect and Lingnan commissioner.',
  },
  s0893: {
    literal:
      'Sixth month, guisi: slight drought; the emperor fasted and prayed; his sacred person was unwell; that day he did not hold court.',
    idiomatic:
      'On guisi a light drought and illness kept the emperor from court while he fasted and prayed.',
  },
  s0894: {
    literal:
      'Autumn, seventh month, wuwu: Runzhou Danyang army and Suzhou Changwu army were abolished.',
    idiomatic:
      'On wuwu, armies at Danyang and Changwu were disbanded.',
  },
  s0895: {
    literal:
      'On jisi, drafting vice director, fellow grand councilor, Hanlin grand academician of the Chongwen Hall, and state-history compiler Yang Wan died.',
    idiomatic:
      'On jisi, chief minister Yang Wan died.',
  },
  s0896: {
    literal:
      'Eighth month, guisi: eastern Sichuan commissioner Xianyu Shuming was granted the surname Li.',
    idiomatic:
      'On guisi, Xianyu Shuming of eastern Sichuan received the surname Li.',
  },
  s0897: {
    literal:
      'On guimao, chief ministers declined gifted meals.',
    idiomatic:
      'On guimao the chief ministers refused imperial meals.',
  },
  s0898: {
    literal:
      'Earlier when Yuan Zai and Wang Jin held power, daily meals were granted and this became precedent.',
    idiomatic:
      'Yuan Zai and Wang Jin had made daily imperial meals a precedent for chancellors.',
  },
  s0899: {
    literal:
      'Now Chang Gai and others memorialized: "Stipends are already ample; to receive imperial fare besides—how could we bear the shame? We beg the gifted meals be stopped.',
    idiomatic:
      'Chang Gai wrote: "Our pay is already lavish; daily palace meals shame us—please stop them.',
  },
  s0900: {
    literal:
      '" Approved.',
    idiomatic:
      'The emperor agreed."',
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
