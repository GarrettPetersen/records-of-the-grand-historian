#!/usr/bin/env node
/** Batch 6: s0501–s0600 (Jiutangshu ch.023, Zhaozong annals) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/023.json';
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
    literal: 'The emperor said: "How could it come to that!"',
    idiomatic: 'The emperor said: "Surely not!"',
  },
  s0502: {
    literal: '" After several days without response from above, he and Commissioner of Military Affairs Liu Jishu forged an edict to raise troops and besiege the Sixteen Mansions.',
    idiomatic: 'After days without response he and Liu Jishu forged an edict, raised troops, and besieged the Sixteen Mansions.',
  },
  s0503: {
    literal: 'The princes were afraid, let down their hair, climbed the wall crying: "Imperial Father, save your sons\' lives!"',
    idiomatic: 'Princes let down their hair and cried along the wall: "Imperial Father, save us!"',
  },
  s0504: {
    literal: 'Some climbed roofs and trees.',
    idiomatic: 'Some fled onto roofs and trees.',
  },
  s0505: {
    literal: 'That day Princes of Tong, Tan, and eleven below with their attendants were seized by Jian\'s troops, taken to Shidi Valley, and all killed regardless of age; Jian reported it as treason.',
    idiomatic: 'That day eleven princes and attendants were seized, taken to Shidi Valley, and all killed; Jian called it treason.',
  },
  s0506: {
    literal: 'Soon Crown Prince Steward Ma Daoyin and Director of Palace Construction Xu Yanshi were killed; Grand Councilor Zhu Pu was demoted—all favorites of the emperor.',
    idiomatic: 'Soon Ma Daoyin and Xu Yanshi were killed; Zhu Pu was demoted—all imperial favorites.',
  },
  s0507: {
    literal: 'In the ninth month, on guiyou, the first day, Vice Censor-in-Chief Di Guichang was made Right Assistant Director of the Department of State Affairs.',
    idiomatic: 'Ninth month, guiyou new moon: Di Guichang became right assistant director.',
  },
  s0508: {
    literal: 'Vice Minister of Justice Yang She was made Vice Minister of Personnel.',
    idiomatic: 'Yang She became vice minister of personnel.',
  },
  s0509: {
    literal: 'An edict made Zhenhai Military Commissioner Qian Liu commissioner of Zhenhai, Commissioner of Zhe East and West Circuits, Prefect of Hangzhou and Yuezhou, Supreme Pillar, and King of Wu.',
    idiomatic: 'An edict made Qian Liu King of Wu, Zhenhai commissioner, and Zhe East-West commissioner.',
  },
  s0510: {
    literal: 'In the tenth month of winter, on guimao, the first day, Huazhou Commissioner Han Jian was also made Prefect of Tongzhou and Commissioner of Kuangguo Army.',
    idiomatic: 'Winter, tenth month, guimao new moon: Han Jian also became Tongzhou prefect and Kuangguo commissioner.',
  },
  s0511: {
    literal: 'Zhu Quanzhong sent his generals acting Xuzhou Commissioner Pang Shigu and Yanzhou Commissioner Ge Congzhou with seventy thousand troops from Yan, Yun, Cao, Pu, Xu, Su, and Hua to cross the Huai and attack Yang Xingmi.',
    idiomatic: 'Quanzhong sent Pang Shigu and Ge Congzhou with seventy thousand troops across the Huai against Yang Xingmi.',
  },
  s0512: {
    literal: 'An edict made Grand Master of Honor Pei Zan, former Vice Censor-in-Chief, Minister of Rites and Director of the Examinations.',
    idiomatic: 'An edict made Pei Zan minister of rites and director of examinations.',
  },
  s0513: {
    literal: 'Youzhou Commissioner Liu Rengong greatly defeated the Shatuo at Anse; Li Keyong escaped on a single horse.',
    idiomatic: 'Liu Rengong of Youzhou crushed the Shatuo at Anse; Keyong escaped alone.',
  },
  s0514: {
    literal: 'In the eleventh month, on renshen, the first day.',
    idiomatic: 'Eleventh month, renshen new moon.',
  },
  s0515: {
    literal: 'On guiyou, Huainan Grand General Zhu Jin secretly sent a fleet to strike Bian troops at Qingkou; Pang Shigu\'s whole army was lost and Shigu captured.',
    idiomatic: 'On guiyou Zhu Jin struck Bian troops at Qingkou; Pang Shigu\'s army was lost and he was captured.',
  },
  s0516: {
    literal: 'Advancing, Ge Congzhou crossed the Huai from Huoqiu to Haozhou; hearing of Shigu\'s defeat he withdrew; after one night he reached the Pi River and was mid-crossing when Zhu Jin arrived.',
    idiomatic: 'Ge Congzhou crossed from Huoqiu; hearing Shigu\'s defeat he withdrew; at the Pi River mid-crossing Zhu Jin arrived.',
  },
  s0517: {
    literal: 'That day killed, wounded, and drowned were nearly all; returners numbered fewer than a thousand—only Niu Cunjie\'s corps had crossed first and escaped.',
    idiomatic: 'That day nearly all were killed or drowned; fewer than a thousand returned—only Niu Cunjie\'s corps escaped.',
  },
  s0518: {
    literal: 'By Yingzhou, heavy snow and bitter cold killed five or six in ten.',
    idiomatic: 'By Yingzhou snow and cold killed five or six in ten.',
  },
  s0519: {
    literal: 'Since antiquity no defeat of an army had been like this.',
    idiomatic: 'Since antiquity no army had been so ruined.',
  },
  s0520: {
    literal: 'Thereby Xingmi held the lands between the Yangtze and Huai.',
    idiomatic: 'Thereby Xingmi held the Yangtze–Huai region.',
  },
  s0521: {
    literal: 'Acting Minister of Works Ge Congzhou, acting Yanzhou military affairs, was made Prefect of Yanzhou and Commissioner of Taining Army;',
    idiomatic: 'Ge Congzhou was made Yanzhou prefect and Taining commissioner;',
  },
  s0522: {
    literal: 'Yingzhou Prefect Wang Jingrao was made Acting Left Vice Director and concurrent Xuzhou Prefect, Commissioner of Wuning Army—following Quanzhong\'s memorial.',
    idiomatic: 'Wang Jingrao became acting left vice director and Wuning commissioner—per Quanzhong\'s memorial.',
  },
  s0523: {
    literal: 'In the first year of Guanghua, spring, the first month, on xinwei, the first day, the imperial carriage was at Huazhou.',
    idiomatic: 'Guanghua 1, spring, xinwei new moon: the carriage was at Huazhou.',
  },
  s0524: {
    literal: 'Vice Minister of War Cui Yuan was made Vice Minister of Revenue and Grand Councilor.',
    idiomatic: 'Cui Yuan became vice minister of revenue and grand councilor.',
  },
  s0525: {
    literal: 'All circuits sent funds to repair the palaces; Jingzhao Magistrate Han Jian was ordered into the capital to survey.',
    idiomatic: 'Circuits sent palace-repair funds; Han Jian was ordered into the capital to survey.',
  },
  s0526: {
    literal: 'Zhu Quanzhong sent his judge Wei Zhen to memorialize, asking also to hold Yanzhou.',
    idiomatic: 'Quanzhong sent judge Wei Zhen to ask also to hold Yanzhou.',
  },
  s0527: {
    literal: 'At that time after Quanzhong\'s defeat he wished to magnify his power to check neighboring feudatories.',
    idiomatic: 'After his defeat Quanzhong wished to magnify power to check neighbors.',
  },
  s0528: {
    literal: 'Youzhou Commissioner Liu Rengong, relying on the Anse victory, wished to swallow Hebei; that month he sent his son Shouwen with troops to raid Cangzhou; Commissioner Lu Yanwei abandoned the city and fled; Shouwen held it and styled himself acting commissioner.',
    idiomatic: 'Rengong, bold after Anse, sent Shouwen to raid Cangzhou; Yanwei fled; Shouwen held it as acting commissioner.',
  },
  s0529: {
    literal: 'On the fourth month, gengzi, an edict: Shufei He should be invested empress.',
    idiomatic: 'Fourth month, gengzi: Shufei He was ordered invested empress.',
  },
  s0530: {
    literal: 'The emperor visited Shiji Temple and feasted his followers at the imperial estate Han Jian presented.',
    idiomatic: 'The emperor visited Shiji Temple and feasted at Han Jian\'s presented estate.',
  },
  s0531: {
    literal: 'In the fifth month, on jisi, the first day, a great amnesty was proclaimed for the empress\'s investiture.',
    idiomatic: 'Fifth month, jisi new moon: great amnesty for the empress.',
  },
  s0532: {
    literal: 'Bian general Ge Congzhou led troops against Li Keyong\'s Xing, Ming, and Ci and took them.',
    idiomatic: 'Ge Congzhou took Keyong\'s Xing, Ming, and Ci.',
  },
  s0533: {
    literal: 'Quanzhong appointed Congzhou acting commissioner of the three prefectures\' military affairs.',
    idiomatic: 'Quanzhong made Congzhou acting commissioner of the three prefectures.',
  },
  s0534: {
    literal: 'On jihai, the emperor visited West Creek to watch the dragon-boat races.',
    idiomatic: 'On jihai the emperor watched dragon-boat races at West Creek.',
  },
  s0535: {
    literal: 'Feudatories and civil and military officials throughout the realm memorialized begging the imperial carriage return to the capital.',
    idiomatic: 'All circuits memorialized begging return to the capital.',
  },
  s0536: {
    literal: 'In the seventh month, Bian general Shi Shuzong took Zhao Kuangning\'s Sui, Tang, and Deng.',
    idiomatic: 'Seventh month: Shi Shuzong took Kuangning\'s Sui, Tang, and Deng.',
  },
  s0537: {
    literal: 'An edict raised Huazhou to Xingde Prefecture—the prefect became magistrate, left and right aides became vice magistrates, Zheng County became secondary red, and official standing matched the five prefectures.',
    idiomatic: 'Huazhou was raised to Xingde Prefecture with capital-grade officials.',
  },
  s0538: {
    literal: 'Mount Hua\'s temple was enfeoffed as Marquis Youshun.',
    idiomatic: 'Mount Hua\'s temple was enfeoffed Marquis Youshun.',
  },
  s0539: {
    literal: 'In the eighth month, on wuxu, the first day.',
    idiomatic: 'Eighth month, wuxu new moon.',
  },
  s0540: {
    literal: 'On jiwei, the imperial carriage returned from Hua to the capital.',
    idiomatic: 'On jiwei the carriage returned from Hua to the capital.',
  },
  s0541: {
    literal: 'On jiazi, the emperor faced the Duan Gate, proclaimed a great amnesty, and changed the era name to Guanghua.',
    idiomatic: 'On jiazi he faced the Duan Gate, amnestied, and changed the era to Guanghua.',
  },
  s0542: {
    literal: 'In the ninth month, on wuchen, the first day, Vice Censor-in-Chief Di Guichang was made Left Assistant Director.',
    idiomatic: 'Ninth month, wuchen new moon: Di Guichang became left assistant director.',
  },
  s0543: {
    literal: 'An edict made Zhenguo and Kuangguo Commissioner Han Jian Guardian Grand Tutor, Director of the Secretariat, Xingde Magistrate, Prince of Yingchuan, granted an iron certificate, and the emperor\'s own hand wrote "Loyal and True" as gift.',
    idiomatic: 'Han Jian was made grand tutor, director of the secretariat, Xingde magistrate, Prince of Yingchuan, with iron certificate and the emperor\'s "Loyal and True."',
  },
  s0544: {
    literal: 'Jian repeatedly memorialized declining the princedom and was changed to Duke of Xu.',
    idiomatic: 'Jian repeatedly declined the princedom and was made Duke of Xu.',
  },
  s0545: {
    literal: 'Weibo Commissioner Luo Hongxin was advanced to Prince of Linqing.',
    idiomatic: 'Weibo\'s Luo Hongxin was advanced to Prince of Linqing.',
  },
  s0546: {
    literal: 'That month Hongxin died, posthumously made Grand Preceptor, posthumous title Zhuangsu.',
    idiomatic: 'That month Hongxin died, posthumously grand preceptor Zhuangsu.',
  },
  s0547: {
    literal: 'The guard army installed his son Vice Commissioner Shaowei to know military affairs; soon he was granted the commander\'s seal.',
    idiomatic: 'The guard army made Shaowei acting commander; soon he received the seal.',
  },
  s0548: {
    literal: 'In the tenth month, on dingyou, the first day, Henan Magistrate Zhang Quanyi was further appointed Palace Attendant.',
    idiomatic: 'Tenth month, dingyou new moon: Zhang Quanyi was further made palace attendant.',
  },
  s0549: {
    literal: 'Bian general Zhu Yougong returned from the Jiangxi campaign, passed Anzhou, killed Prefect Wu Yu, and left a subordinate to hold it.',
    idiomatic: 'Zhu Yougong returned from Jiangxi, killed Anzhou prefect Wu Yu, and garrisoned it.',
  },
  s0550: {
    literal: 'Bian general Zhang Cunjing raided Caizhou; Prefect Cui Hong submitted, asking to send his brother Xian as hostage to Bian; this was granted.',
    idiomatic: 'Zhang Cunjing raided Caizhou; Cui Hong submitted and sent brother Xian as hostage; granted.',
  },
  s0551: {
    literal: 'On bingyin, Li Keyong\'s general Luzhou Commissioner Xue Zhiqin died; Zezhou Prefect Li Hanzhi, seizing the lack of a commander, raided Luzhou and took it, sent his son Hao to beg surrender to Bian; Quanzhong memorialized Hanzhi as commissioner.',
    idiomatic: 'On bingyin Xue Zhiqin died; Li Hanzhi seized Luzhou and sent son Hao to surrender to Bian; Quanzhong made him commissioner.',
  },
  s0552: {
    literal: 'In the second year of Guanghua, spring, the first month, on yiwei, the first day.',
    idiomatic: 'Guanghua 2, spring, yiwei new moon.',
  },
  s0553: {
    literal: 'On dingwei, Minister of War Lu Yi was made Vice Minister of War and Grand Councilor.',
    idiomatic: 'On dingwei Lu Yi became vice minister of war and grand councilor.',
  },
  s0554: {
    literal: 'In the second month, Caizhou Prefect Cui Hong was forced by guard troops and fled with them to Huainan.',
    idiomatic: 'Second month: Cui Hong was forced by guards and fled to Huainan.',
  },
  s0555: {
    literal: 'At that time Hong had sent his brother Xian as hostage to Bian; Bian sent Xian back to Cai and drafted three thousand troops for campaign.',
    idiomatic: 'Hong had sent Xian as hostage; Bian returned Xian and drafted three thousand troops.',
  },
  s0556: {
    literal: 'Cai troops mutinied, killed Xian, and escorted Hong across the Huai.',
    idiomatic: 'Cai mutinied, killed Xian, and carried Hong south.',
  },
  s0557: {
    literal: 'Zhu Quanzhong ordered his son Youyu to hold Caizhou.',
    idiomatic: 'Quanzhong ordered son Youyu to hold Caizhou.',
  },
  s0558: {
    literal: 'Youzhou Commissioner Liu Rengong drove a hundred thousand Yan troops intending to take Zhao and Wei together.',
    idiomatic: 'Liu Rengong drove a hundred thousand Yan troops to take Zhao and Wei.',
  },
  s0559: {
    literal: 'That month he took Beizhou; none young or old were spared; corpses were cast into Clear Water until it would not flow.',
    idiomatic: 'That month he took Beizhou and slaughtered all; corpses choked Clear Water.',
  },
  s0560: {
    literal: 'He then advanced on Weizhou.',
    idiomatic: 'He then marched on Weizhou.',
  },
  s0561: {
    literal: 'Luo Shaowei begged aid from Bian.',
    idiomatic: 'Shaowei begged Bian for aid.',
  },
  s0562: {
    literal: 'In the third month, Zhu Quanzhong sent Grand General Zhang Cunjing with an army to aid him, encamped at Neihuang.',
    idiomatic: 'Third month: Quanzhong sent Zhang Cunjing to aid him at Neihuang.',
  },
  s0563: {
    literal: 'Ge Congzhou from Xing and Ming led eight hundred crack horsemen into Weizhou.',
    idiomatic: 'Ge Congzhou led eight hundred crack horsemen from Xing and Ming into Weizhou.',
  },
  s0564: {
    literal: 'Yan generals Liu Shouwen and Shan Keji, hearing Bian troops were at Neihuang, led armies to strike them.',
    idiomatic: 'Liu Shouwen and Shan Keji led armies to strike Bian troops at Neihuang.',
  },
  s0565: {
    literal: 'Cunjing set an ambush east of Neihuang and greatly defeated the Yan army, capturing and beheading thirty thousand and taking Shan Keji alive.',
    idiomatic: 'Cunjing ambushed east of Neihuang, defeated Yan, beheaded thirty thousand, and captured Shan Keji.',
  },
  s0566: {
    literal: 'Liu Shouwen with the remainder returned to Weizhou; Cunjing and Congzhou pressed them; the Yan army was again defeated; Rengong and his sons barely escaped.',
    idiomatic: 'Shouwen returned; Cunjing and Congzhou pressed; Yan was again defeated; Rengong and sons barely escaped.',
  },
  s0567: {
    literal: 'Bian and Wei combined to pursue; Zhao men again intercepted on the eastern border—from Wei to Cang five hundred li, corpses lay pillow to pillow.',
    idiomatic: 'Bian and Wei pursued; Zhao intercepted—from Wei to Cang corpses lay pillow to pillow.',
  },
  s0568: {
    literal: 'That spring a white vapor stretched across heaven like silk from southwest through northeast—and soon came the Yan army\'s defeat.',
    idiomatic: 'That spring white vapor stretched heaven like silk—and soon the Yan army fell.',
  },
  s0569: {
    literal: 'In the fourth month, Bian general Shi Shuzong advanced from Shangdang against Taiyuan, exited Shihui, and the Shatuo captured his vanguard general Chen Zhang; Shuzong then withdrew.',
    idiomatic: 'Fourth month: Shi Shuzong advanced on Taiyuan; Shatuo captured Chen Zhang; he withdrew.',
  },
  s0570: {
    literal: 'In the sixth month, an edict made Zhaoyi Commissioner Li Hanzhi, Acting Grand Guardian, concurrent Grand Preceptor, Palace Attendant, Luzhou Chief Administrator, Duke of Longxi with three thousand households, Prefect of Mengzhou, and Commissioner of Heyang Three Cities and Meng-Huai;',
    idiomatic: 'Sixth month: Li Hanzhi was made Mengzhou prefect and Heyang commissioner;',
  },
  s0571: {
    literal: 'Acting Minister of Works Ding Hui, Mengzhou Prefect and Heyang Commissioner, was made Commissioner of Ze and Lu—following Quanzhong\'s memorial.',
    idiomatic: 'Ding Hui was made Ze-Lu commissioner—per Quanzhong\'s memorial.',
  },
  s0572: {
    literal: 'On dingchou, Li Hanzhi reached Huaizhou and died at the relay station.',
    idiomatic: 'On dingchou Li Hanzhi reached Huaizhou and died at the relay station.',
  },
  s0573: {
    literal: 'Shanzhou troops mutinied, killed their commander Wang Gong, and installed Commandery General Li Fan as acting commissioner.',
    idiomatic: 'Shanzhou mutinied, killed Wang Gong, and made Li Fan acting commissioner.',
  },
  s0574: {
    literal: 'On dinghai, an edict made former Director of the Court of Imperial Sacrifices Liu Chongwang Minister of Personnel, Vice Minister of War Pei Shu Vice Minister of Personnel, and Vice Minister of Revenue Xue Zhaowei Vice Minister of War.',
    idiomatic: 'On dinghai Liu Chongwang became minister of personnel; Pei Shu and Xue Zhaowei were shifted.',
  },
  s0575: {
    literal: 'In the seventh month, Qingzhou\'s Haizhou defender Niu Congyi led the prefecture to Huainan; Xingmi then held Haizhou.',
    idiomatic: 'Seventh month: Niu Congyi led Haizhou to Huainan; Xingmi held it.',
  },
  s0576: {
    literal: 'In the eleventh month, Shanzhou guard Zhu Jian killed Li Fan, styled himself acting commissioner, submitted to Bian; Quanzhong memorialized Jian as commander.',
    idiomatic: 'Eleventh month: Zhu Jian killed Li Fan, submitted to Bian; Quanzhong made him commander.',
  },
  s0577: {
    literal: 'In the third year of Guanghua, spring, the first month, on gengzi, the first day, Minister of Rites Pei Zan was made Minister of Justice.',
    idiomatic: 'Guanghua 3, spring, gengzi new moon: Pei Zan became minister of justice.',
  },
  s0578: {
    literal: 'On guimao, Zhu Quanzhong memorialized: "My native place is Dangshan County, Songzhou; by grace it was raised to Huizhou; the land is low and wet, hard to build dwellings—I beg move Huizhou\'s seat to Shanfu County."',
    idiomatic: 'On guimao Quanzhong begged move Huizhou\'s seat from damp Dangshan to Shanfu.',
  },
  s0579: {
    literal: '" The edict was assented to, and the command was still granted the name Chongde Army.',
    idiomatic: 'The edict was assented to and the command was named Chongde Army.',
  },
  s0580: {
    literal: 'On the fourth month, wuwu, Bian and Wei combined to attack Cangzhou to avenge entering the outer wall; Ge Congzhou took Cangde districts in succession; Wang Rong sent envoys to Quanzhong for peace, ordering Liu Rengong reconcile; Bian and Wei withdrew.',
    idiomatic: 'Fourth month, wuwu: Bian and Wei attacked Cangzhou; Congzhou took districts; Wang Rong sued for peace; armies withdrew.',
  },
  s0581: {
    literal: 'On xinwei, the empress and crown prince visited the Nine Temples.',
    idiomatic: 'On xinwei empress and crown prince visited the Nine Temples.',
  },
  s0582: {
    literal: 'On the sixth month, dingsi, Zhu Quanzhong memorialized that Shanzhou acting commissioner Zhu Jian was clan from his home district, renamed Youqian, and begged true investiture with the commander\'s seal.',
    idiomatic: 'Sixth month, dingsi: Quanzhong said Zhu Jian was clan, renamed Youqian, and begged the seal.',
  },
  s0583: {
    literal: 'The edict was assented to.',
    idiomatic: 'The throne assented.',
  },
  s0584: {
    literal: 'On wuchen, Special Advancement Holder Wang Tuan, Minister of Works, Vice Director of the Secretariat, Grand Councilor, Commissioner for Editing the National History, was banished to Yazhou Registrar; soon ordered to die at Lantian Post; Commissioners of Military Affairs Song Daobi and Jing Wuxiu also died.',
    idiomatic: 'On wuchen Wang Tuan was banished then ordered to die at Lantian Post; Song Daobi and Jing Wuxiu also died.',
  },
  s0585: {
    literal: 'Cui Yin had slandered them, saying the three joined inner and outer court.',
    idiomatic: 'Cui Yin slandered them as joining inner and outer court.',
  },
  s0586: {
    literal: 'In the seventh month, on dinghai, the first day, Minister of War Liu Chongwang died, posthumously made Minister of Works.',
    idiomatic: 'Seventh month, dinghai new moon: Liu Chongwang died, posthumously minister of works.',
  },
  s0587: {
    literal: 'On jiawu, War Bureau Director Xue Zhengbiao was made Right Remonstrance Official.',
    idiomatic: 'On jiawu Xue Zhengbiao became right remonstrance official.',
  },
  s0588: {
    literal: 'Xuzhou Prefect Zhu Yougong was made Acting Minister of Works and Prefect of Yingzhou;',
    idiomatic: 'Zhu Yougong became acting minister of works and Yingzhou prefect;',
  },
  s0589: {
    literal: 'Left Martial Guard General Zhao Lin was made Acting Left Vice Director and Prefect of Xu;',
    idiomatic: 'Zhao Lin became acting left vice director and Xu prefect;',
  },
  s0590: {
    literal: 'Xuanwu Escort Officer Liu Zhijun was made Acting Right Vice Director and Prefect of Zheng—following Quanzhong\'s memorial.',
    idiomatic: 'Liu Zhijun became acting right vice director and Zheng prefect—per Quanzhong\'s memorial.',
  },
  s0591: {
    literal: 'On wushen, an edict made Wuzhen Commissioner Lei Man, Acting Grand Guardian, Prince of Fengyi, the rest unchanged.',
    idiomatic: 'On wushen Lei Man was made acting grand guardian and Prince of Fengyi.',
  },
  s0592: {
    literal: 'Wutai Commissioner Zhao Chong was enfeoffed Baron of Tianshui with five hundred households.',
    idiomatic: 'Wutai Commissioner Zhao Chong was enfeoffed Baron of Tianshui.',
  },
  s0593: {
    literal: 'On gengxu, an edict made Zhaoyi Acting Commissioner Meng Qian Acting Minister of Works, concurrent Luzhou Chief Administrator, Zhaoyi Vice Commissioner knowing military affairs, Commissioner of Luzhou, Ming, Xing, and Mo, Baron of Pingchang with three hundred households—following Li Keyong\'s memorial.',
    idiomatic: 'On gengxu Meng Qian was made acting minister of works and Zhaoyi vice commissioner—per Keyong\'s memorial.',
  },
  s0594: {
    literal: 'Golden-Gleam Grandee Sun Chu, Minister of War, Duke of Le\'an, was ordered to keep the ministry and also serve as Jingzhao Magistrate.',
    idiomatic: 'Sun Chu kept the ministry of war and also became Jingzhao magistrate.',
  },
  s0595: {
    literal: 'On yimao, an edict: Loyal Martyr Guard-Sage Zhenguo Merit Holder Wang Jian, Sichuan West Vice Commissioner, could also command Sichuan East and Wuxin circuits, with fief increased one thousand households, the rest unchanged.',
    idiomatic: 'On yimao Wang Jian was given Sichuan East and Wuxin—he had taken Zizhou from Gu Yanhui.',
  },
  s0596: {
    literal: 'At that time Jian had taken Zizhou from Gu Yanhui and also held Sichuan East\'s Yang, Guo, and Lang.',
    idiomatic: 'He had taken Zizhou and held Yang, Guo, and Lang.',
  },
  s0597: {
    literal: 'Loyalty Army Commissioner Zhao Kuangning was made Acting Grand Preceptor, concurrent Director of the Secretariat, with substantive fief increased one hundred households.',
    idiomatic: 'Zhao Kuangning was made acting grand preceptor and director of the secretariat.',
  },
  s0598: {
    literal: 'In the eighth month, on bingchen, the first day, Zhu Quanzhong memorialized: "Ru Prefecture was first cut to Xu—I beg return it to the eastern capital.',
    idiomatic: 'Eighth month, bingchen new moon: Quanzhong begged return Ru Prefecture to the eastern capital.',
  },
  s0599: {
    literal: 'Heyang once governed Ze; now because border tribes hold it, gain and loss are uncertain—I beg temporarily cut Wangwu, Qinghe, and Gong of Henan to Heyang."',
    idiomatic: 'He begged cut Wangwu, Qinghe, and Gong to uncertain Heyang."',
  },
  s0600: {
    literal: 'The edict was assented to.',
    idiomatic: 'The throne assented.',
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
if (data.metadata.chapter !== '023') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 023; standalone T ready (${Object.keys(T).length} entries).`
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
