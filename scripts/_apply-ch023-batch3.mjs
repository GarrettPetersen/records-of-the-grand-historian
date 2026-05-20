#!/usr/bin/env node
/** Batch 3: s0201–s0300 (Jiutangshu ch.023, Zhaozong annals) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/023.json';
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
    literal: 'In this campaign the court relied on Zhu Quanzhong and the troops of the three circuits.',
    idiomatic: 'The court had relied on Quanzhong and the three circuits.',
  },
  s0202: {
    literal: 'Quanzhong was then continuously campaigning in Xu and Yun and sought troops and grain from Zhen and Wei; Quanzhong in the end never reached the encampment.',
    idiomatic: 'Quanzhong fought in Xu-Yun and demanded supplies from Zhen and Wei but never reached camp.',
  },
  s0203: {
    literal: 'Zhen and Wei relied on Taiyuan as a shield; if Taiyuan prefecture were broken, Zhen and Wei would be endangered—Wang Rong and Luo Hongxin also did not send troops.',
    idiomatic: 'Zhen and Wei hid behind Taiyuan; Rong and Hongxin would not march.',
  },
  s0204: {
    literal: 'Only the mixed hosts of Bin, Qi, Hua, Bin, and Xia assembled at Jin Prefecture.',
    idiomatic: 'Only Bin, Qi, Hua, Bin, and Xia hosts met at Jinzhou.',
  },
  s0205: {
    literal: 'Before battle Sun Kui was captured and the Yan troops defeated; therefore the western and Qi troops scattered at the wind, and Jun and Jian reached defeat.',
    idiomatic: 'Sun Kui was taken before battle; western and Qi troops fled; Jun and Jian were ruined.',
  },
  s0206: {
    literal: 'Quanzhong, because Zhen and Wei would not aid with troops and grain and stood watching, sent Pang Shigu to campaign against Wei and took ten counties; Luo Hongxin begged alliance and he withdrew.',
    idiomatic: 'Quanzhong sent Pang Shigu against Wei for ten counties until Hongxin sued for peace.',
  },
  s0207: {
    literal: 'Di Prefecture governor Zhang Chan was defeated by Qing commander Wang Shifan.',
    idiomatic: 'Zhang Chan of Di was beaten by Wang Shifan of Qing.',
  },
  s0208: {
    literal: 'The newly appointed Pinglu military commissioner Cui Anqian returned to court from Di Prefecture and was again appointed Junior Tutor to the Heir Apparent.',
    idiomatic: 'New Pinglu commissioner Cui Anqian returned from Di and became Junior Tutor again.',
  },
  s0209: {
    literal: 'On the first day of the third month, xinhai, Wang Shifan, acting Qing military commissioner, was made acting Minister of War, concurrent Qing prefect and Censor-in-Chief, and commissioner of the Pinglu Army.',
    idiomatic: 'Third month xinhai new moon: Wang Shifan was made acting War Minister and Pinglu commissioner.',
  },
  s0210: {
    literal: 'On the first day of the third month, xinhai, military commissioner and observer of Pinglu, commissioner over the two foreign states Silla and Parhae.',
    idiomatic: 'He was also made observer of Pinglu with charge over Silla and Parhae.',
  },
  s0211: {
    literal: 'Huainan military commissioner Sun Ru was killed by Xuan observer Yang Xingmi.',
    idiomatic: 'Sun Ru of Huainan was killed by Yang Xingmi of Xuan.',
  },
  s0212: {
    literal: 'Earlier Xingmi lost Yangzhou and held Xuan Prefecture; Sun Ru besieged him with troops for three years.',
    idiomatic: 'Xingmi had lost Yangzhou and held Xuanzhou under Sun Ru\'s three-year siege.',
  },
  s0213: {
    literal: 'That spring Huainan suffered great famine; in the army thirteen or fourteen in ten died of pestilence.',
    idiomatic: 'That spring famine and plague killed thirteen in ten of Sun Ru\'s army.',
  },
  s0214: {
    literal: 'That month Sun Ru also fell ill, was seized by his tent guards, and surrendered to Xingmi.',
    idiomatic: 'That month guards seized the sick Sun Ru and surrendered him to Xingmi.',
  },
  s0215: {
    literal: 'Xingmi thereupon merged Sun Ru\'s host and again held Guangling.',
    idiomatic: 'Xingmi took Sun Ru\'s troops and again held Guangling.',
  },
  s0216: {
    literal: 'In the sixth month Wang Rong sent troops to aid Li Cunxiao; Keyong raised a great campaign against Zhen Prefecture.',
    idiomatic: 'Sixth month: Rong aided Cunxiao; Keyong marched on Zhenzhou.',
  },
  s0217: {
    literal: 'In the seventh month the Taiyuan army came out through Jingxing Pass and encamped at Changshan town, plundering greatly in Zhen, Zhao, and Shen commanderies.',
    idiomatic: 'Seventh month: Taiyuan came through Jingxing and ravaged Zhen, Zhao, and Shen.',
  },
  s0218: {
    literal: 'You military commissioner Li Kuangwei personally led thirty thousand foot and horse to aid Wang Rong.',
    idiomatic: 'Li Kuangwei of You led thirty thousand to aid Rong.',
  },
  s0219: {
    literal: 'In the eighth month Keyong withdrew his army.',
    idiomatic: 'Eighth month: Keyong withdrew.',
  },
  s0220: {
    literal: 'On the first day of the ninth month, dingwei, the new moon.',
    idiomatic: 'Ninth month opened on dingwei.',
  },
  s0221: {
    literal: 'On yimao the Son of Heaven bestowed on Left Army Commander Yang Fugong a staff and armrest, with retirement as Grand General.',
    idiomatic: 'On yimao the emperor gave Yang Fugong staff and armrest and retired him as Grand General.',
  },
  s0222: {
    literal: 'Fugong was enraged, claimed illness, and would not accept the edict.',
    idiomatic: 'Fugong raged, feigned illness, and refused the edict.',
  },
  s0223: {
    literal: 'On the first day of the tenth month, dingchou, the new moon.',
    idiomatic: 'Tenth month opened on dingchou.',
  },
  s0224: {
    literal: 'On jiashen Tianwei Army commander Li Shunjie led guard troops to attack Yang Fugong; Fugong\'s adopted son Yushan Army commander Yang Shouxin resisted with troops and drew up formation in Changhua Ward.',
    idiomatic: 'On jiashen Li Shunjie attacked Yang Fugong; adopted son Yang Shouxin blocked him at Changhua Ward.',
  },
  s0225: {
    literal: 'Zhaozong ascended Yanxi Tower, arrayed troops to guard himself, and waited for the turn of events.',
    idiomatic: 'Zhaozong mounted Yanxi Tower with guards and waited.',
  },
  s0226: {
    literal: 'They faced each other until evening without battle and withdrew.',
    idiomatic: 'They faced off until evening and withdrew without fighting.',
  },
  s0227: {
    literal: 'That night Shouxin then escorted Fugong\'s host out of the capital, fighting as they went, out through Tonghua Gate, by the Seven Turns road to Shang Prefecture, and ordered his sworn son Zhang Wan as rearguard.',
    idiomatic: 'That night Shouxin fought out through Tonghua Gate toward Shangzhou with Zhang Wan as rearguard.',
  },
  s0228: {
    literal: 'Yong\'an company head An Quan overtook Wan, seized him, and returned.',
    idiomatic: 'An Quan of Yong\'an overtook Wan and captured him.',
  },
  s0229: {
    literal: 'In the eleventh month Zhu Quanzhong submitted a memorial asking to transfer Shi Pu\'s commission.',
    idiomatic: 'Eleventh month: Quanzhong asked to move Shi Pu\'s commission.',
  },
  s0230: {
    literal: 'That month Bian troops took Suzhou; Pu was then appointed Junior Tutor to the Heir Apparent.',
    idiomatic: 'That month Bian took Suzhou; Pu was made Junior Tutor.',
  },
  s0231: {
    literal: 'Pu\'s commander Liu Zhijun surrendered to Bian troops.',
    idiomatic: 'Liu Zhijun of Pu\'s army surrendered to Bian.',
  },
  s0232: {
    literal: 'Zhen commander Wang Rong and You commander Li Kuangwei again plotted to attack Ding Prefecture to divide its territory; Wang Chuncun sought aid from Taiyuan.',
    idiomatic: 'Rong and Kuangwei plotted against Dingzhou; Chuncun called Taiyuan.',
  },
  s0233: {
    literal: 'On the first day of the twelfth month, bingzi, Liu Chongwang was made acting Minister of Works and Associate Grand Councillor, concurrent Xu prefect, and military commissioner of Wuning with Xu-Su observation and disposition.',
    idiomatic: 'Twelfth month bingzi new moon: Liu Chongwang was made Works minister and Wuning commissioner at Xuzhou.',
  },
  s0234: {
    literal: 'At the time Li Shunjie relied on favor and acted lawlessly, going out and in with armed followers; the two army commandants Liu Jingxuan and Ximen Junsui feared he coveted unrightful ambition.',
    idiomatic: 'Li Shunjie swaggered with armed guards; Liu Jingxuan and Ximen Junsui feared his ambition.',
  },
  s0235: {
    literal: 'On dinghai the two commandants transmitted an edict summoning Shunjie; Shunjie came with three hundred armored soldiers to Yintai Gate; the gate office transmitted the edict stopping attendants.',
    idiomatic: 'On dinghai both commandants summoned Shunjie; he came with three hundred guards to Yintai Gate.',
  },
  s0236: {
    literal: 'The two commandants waited for Shunjie in the guards\' lodge, and when he sat down ordered their officer Si Guangshan to cut him down—his head fell with the sword.',
    idiomatic: 'In the guards\' lodge Si Guangshan beheaded Shunjie at the commandants\' order.',
  },
  s0237: {
    literal: 'His subordinates, learning Shunjie was dead, clamored greatly and rushed out through Yanxi Gate.',
    idiomatic: 'His men learned he was dead and rioted out Yanxi Gate.',
  },
  s0238: {
    literal: 'That day Tianwei, Puri, and Dengfeng three companies mutinied and plundered Yongning Ward; only by evening was it settled.',
    idiomatic: 'That day three guard companies plundered Yongning until evening.',
  },
  s0239: {
    literal: 'Minister of Revenue Zheng Yanchang was made Vice Director of the Chancellery, Grand Councillor, and judged Revenue.',
    idiomatic: 'Zheng Yanchang of Revenue became Vice Director and Grand Councillor with Revenue.',
  },
  s0240: {
    literal: 'In the third month Keyong and Chuncun gathered troops and withdrew.',
    idiomatic: 'Third month: Keyong and Chuncun withdrew.',
  },
  s0241: {
    literal: 'On the day yihai Left Army Commander Ximen Junsui killed Tianwei Army commander Jia Desheng; at the time Desheng and Li Shunjie together controlled the Tianwei Army—when Shunjie died the commandants hated Desheng and memorialized falsely to kill him.',
    idiomatic: 'On yihai Ximen Junsui killed Jia Desheng, co-commander of Tianwei after Shunjie\'s death.',
  },
  s0242: {
    literal: 'That day more than a thousand of Desheng\'s cavalry fled out to Fengxiang; from then on Qi troops grew stronger.',
    idiomatic: 'That day a thousand of Desheng\'s horse fled to Fengxiang and Qi grew stronger.',
  },
  s0243: {
    literal: 'On the day jiachen an edict made Henan Intendant Zhang Quanyi acting Minister of Works and Associate Grand Councillor, concurrent Meng prefect, and military commissioner of Heyang Three Cities with Meng-Huai-Ze observation.',
    idiomatic: 'On jiachen Zhang Quanyi was made Works minister and Heyang commissioner.',
  },
  s0244: {
    literal: 'In the seventh month Yan and Zhao troops combined to aid Xing Prefecture; Taiyuan great general Li Cunxin led troops to resist at Yaoshan; Wang Rong was greatly defeated and returned.',
    idiomatic: 'Seventh month: Yan-Zhao aided Xingzhou; Cunxin routed Rong at Yaoshan.',
  },
  s0245: {
    literal: 'On the day xinchou Fengxiang and Binning hosts attacked Xingyuan prefecture and took it.',
    idiomatic: 'On xinchou Fengxiang and Binning took Xingyuan.',
  },
  s0246: {
    literal: 'Jiannan West military commissioner Yang Shouliang together with former Left Army Commander Yang Fugong and aide Li Juchuan broke the encirclement and fled, intending to flee to Taiyuan.',
    idiomatic: 'Shouliang, Fugong, and Li Juchuan broke out toward Taiyuan.',
  },
  s0247: {
    literal: 'Li Maozhen memorialized that his son Jimi should act as temporary Xingyuan prefect.',
    idiomatic: 'Maozhen made his son Jimi acting Xingyuan governor.',
  },
  s0248: {
    literal: 'On the first day of the twelfth month, xinwei, Hua military commissioner Han Jian memorialized that at Qianyuan County he encountered scattered troops from defeated Xingyuan and defeated them.',
    idiomatic: 'Twelfth month xinwei new moon: Han Jian reported defeating Xingyuan fugitives at Qianyuan.',
  },
  s0249: {
    literal: 'Yang Shouliang and Yang Fugong had both already been executed; their heads were all sent to the capital.',
    idiomatic: 'Shouliang and Fugong were executed; their heads reached the capital.',
  },
  s0250: {
    literal: 'In the second year, spring, first month, on the day xinchou the new moon, an edict made Gu Yanhui, acting Dongchuan military commissioner, acting Right Vice Director of the Secretariat, concurrent Zi prefect and Censor-in-Chief, and military commissioner and observer of Jiannan East Circuit.',
    idiomatic: 'Year 2, spring, xinchou new moon: Gu Yanhui was made Dongchuan commissioner.',
  },
  s0251: {
    literal: 'At the time Wang Jian had attacked Yanhui for years; Li Maozhen wished to contend with Jian for East Sichuan and therefore memorialized asking that Yanhui receive the full commission as a sign of reconciliation.',
    idiomatic: 'Wang Jian had besieged Yanhui; Maozhen sought to block him by regularizing Yanhui\'s commission.',
  },
  s0252: {
    literal: 'On the first day of the second month, gengwu, Taiyuan Li Keyong attacked Zhen Prefecture with troops; the army came out through Jingxing; Wang Rong was afraid and again begged rescue from Youzhou.',
    idiomatic: 'Second month gengwu new moon: Keyong attacked Zhenzhou through Jingxing; Rong again called You.',
  },
  s0253: {
    literal: 'On jiashen Li Kuangwei again came to the rescue; the Taiyuan army returned to Xing Prefecture.',
    idiomatic: 'On jiashen Kuangwei came again; Taiyuan returned to Xingzhou.',
  },
  s0254: {
    literal: 'On the day gengzi an edict made Puri company head Chen Pei Guangzhou prefect and Lingnan East military commissioner, imperial escort company head Cao Cheng Qian prefect and Qianzhong military commissioner, Yaode company head Li Gang Run prefect and Zhenhai military commissioner, Xuanwei company head Sun Weisheng Jiangling governor and Jingnan military commissioner—all were also made Special Advancement and Associate Grand Councillor.',
    idiomatic: 'On gengzi five guard captains were made commissioners and associate councillors—Chen Pei, Cao Cheng, Li Gang, Sun Weisheng—and stripped of army command.',
  },
  s0255: {
    literal: 'Each was ordered to proceed to his post and was removed from military authority.',
    idiomatic: 'Each was sent to his post and stripped of troops.',
  },
  s0256: {
    literal: 'At the time court opinion held that Maozhen insulted imperial orders and military men were hard to control; they wished to use Du Rangneng and imperial princes to command the guard armies, and therefore removed the five commanders\' authority, also making them associate councillors to please their hearts.',
    idiomatic: 'Court sought to curb Maozhen by giving princes the guards and appeasing the five with councillor titles.',
  },
  s0257: {
    literal: 'Grand Commandant Du Rangneng received investiture; his fief was increased to six thousand households.',
    idiomatic: 'Du Rangneng was invested; fief rose to six thousand households.',
  },
  s0258: {
    literal: 'That month You military commissioner Li Kuangwei\'s younger brother Kuangchou seized Youzhou and styled himself acting commissioner, using talismans to recall encampment troops; the troops all returned to Youzhou.',
    idiomatic: 'That month Kuangchou seized Youzhou as acting commissioner and recalled the army.',
  },
  s0259: {
    literal: 'Kuangwei, having no road of return, sent aide Li Zhenbao to enter court with a memorial asking to attend audience.',
    idiomatic: 'Kuangwei, stranded, sent Li Zhenbao to request audience.',
  },
  s0260: {
    literal: 'Wang Rong, moved by Kuangwei\'s grace in aiding him, then built a mansion at Heng Prefecture and welcomed Kuangwei to dwell there.',
    idiomatic: 'Rong built a mansion at Hengzhou for the grateful Kuangwei.',
  },
  s0261: {
    literal: 'On the day jisi Bian commanders Wang Zhongshi and Niu Cunjie took Xuzhou; military commissioner Shi Pu\'s whole family burned themselves to death.',
    idiomatic: 'On jisi Zhongshi and Cunjie took Xuzhou; Pu\'s family immolated themselves.',
  },
  s0262: {
    literal: 'Zhu Quanzhong sent commander Pang Shigu to hold Xuzhou.',
    idiomatic: 'Quanzhong left Pang Shigu at Xuzhou.',
  },
  s0263: {
    literal: 'On the first day of the sixth month, dingyou, the new moon.',
    idiomatic: 'Sixth month opened on dingyou.',
  },
  s0264: {
    literal: 'On yimao You military commissioner Li Kuangwei plotted to harm Wang Rong and seize his command; Heng Prefecture\'s three armies attacked Kuangwei and killed him.',
    idiomatic: 'On yimao Kuangwei plotted against Rong; Hengzhou troops killed him.',
  },
  s0265: {
    literal: 'On wuwu an edict made Grand Commandant, Vice Director of the Chancellery, Grand Councillor, Duke of Jin Du Rangneng\'s fief increase to nine thousand households.',
    idiomatic: 'On wuwu Du Rangneng\'s fief rose to nine thousand households.',
  },
  s0266: {
    literal: 'Vice Director of the Chancellery, Minister of Personnel, and Associate Grand Councillor Cui Zhaowei was advanced to Grand Master of Splendid Happiness; Vice Director of the Chancellery and Grand Councillor Zheng Yanchang was made concurrent Minister of Justice—all received added fiefs of one thousand households.',
    idiomatic: 'Cui Zhaowei advanced to Grand Master of Splendid Happiness; Zheng Yanchang took Justice; each gained a thousand households.',
  },
  s0267: {
    literal: 'Director of Rites Cui Yi was made Drafting Academician of the Secretariat, still continuing as Hanlin Academician.',
    idiomatic: 'Cui Yi of Rites became drafting academician and kept Hanlin post.',
  },
  s0268: {
    literal: 'You military commissioner Li Kuangchou sent envoys with a proclamation to Wang Rong, demanding account for killing Kuangwei.',
    idiomatic: 'Kuangchou of You demanded Rong answer for Kuangwei\'s death.',
  },
  s0269: {
    literal: 'The two circuits nursed grievance; Zhu Quanzhong sent aide Wei Zhen as envoy to Youzhou to reconcile them.',
    idiomatic: 'The two feuded; Quanzhong sent Wei Zhen to reconcile them.',
  },
  s0270: {
    literal: 'In the seventh month Li Keyong raised troops to attack Zhen Prefecture and defeated Wang Rong\'s army at Pingshan.',
    idiomatic: 'Seventh month: Keyong beat Rong at Pingshan.',
  },
  s0271: {
    literal: 'Rong was afraid, begged alliance, and asked to use troops and grain to assist the attack on Xing Prefecture; this was granted, and Keyong thereupon wheeled his army to Xiang Prefecture.',
    idiomatic: 'Rong sued for peace and offered grain against Xingzhou; Keyong turned to Xiangguo.',
  },
  s0272: {
    literal: 'On the day guimao an edict made Fengxiang-Long military commissioner, acting Grand Commandant, Director of the Secretariat, Fengxiang governor, Supreme Pillar of State, Prince of Qi with a fief of four thousand five hundred households Li Maozhen Xingyuan governor and Jiannan West military commissioner.',
    idiomatic: 'On guimao Maozhen was made Xingyuan governor and Jiannan West commissioner.',
  },
  s0273: {
    literal: 'Vice Director of the Chancellery and Associate Grand Councillor Xu Yanruo was made acting Left Vice Director of the Secretariat and Associate Grand Councillor, concurrent Fengxiang governor, and Fengxiang-Long military commissioner.',
    idiomatic: 'Xu Yanruo was sent to replace Maozhen as Fengxiang commissioner.',
  },
  s0274: {
    literal: 'At the time Maozhen relied on troops to seek concurrent command of the southern mountains circuit; Zhaozong long withheld it; Maozhen\'s memorials were insubordinate and deeply reviled current policy; the emperor could not bear it and was about to question him with troops, and therefore Yanruo replaced him.',
    idiomatic: 'Maozhen had demanded the south; Zhaozong refused; insolent memorials led to Xu Yanruo\'s replacement mission.',
  },
  s0275: {
    literal: 'On the first day of the eighth month, bingshen, the Heir Apparent Prince of Qin was made western suppression commissioner, with Shence great general Li Sui as deputy.',
    idiomatic: 'Eighth month bingshen new moon: Prince of Qin led western suppression; Li Sui was deputy.',
  },
  s0276: {
    literal: 'On the first day of the ninth month, bingyin, Wusheng defense commissioner Qian Liu was made Zhenhai military commissioner and Zhexi West observer with disposition, and the Zhenhai army designation was still moved to Hangzhou.',
    idiomatic: 'Ninth month bingyin new moon: Qian Liu was made Zhenhai commissioner at Hangzhou.',
  },
  s0277: {
    literal: 'On yihai the Prince of Qin led fifty-four imperial escort armies to attack Qiyang, encamping at Xingping.',
    idiomatic: 'On yihai the Prince of Qin attacked Qiyang from Xingping with fifty-four escort armies.',
  },
  s0278: {
    literal: 'Li Maozhen met the attack with troops, encamping at Zhiyu.',
    idiomatic: 'Maozhen met him and camped at Zhiyu.',
  },
  s0279: {
    literal: 'On renwu Qi troops advanced pressing Xingping and the imperial army scattered of itself.',
    idiomatic: 'On renwu Qi troops pressed Xingping and the imperial army collapsed.',
  },
  s0280: {
    literal: 'Maozhen pressed his victory toward the capital, advancing to encamp at Sanqiao.',
    idiomatic: 'Maozhen pursued to Sanqiao outside the capital.',
  },
  s0281: {
    literal: 'On jiashen Zhaozong attended Anfu Gate, beheaded Army Commissioner Ximen Junsui and Palace Secretary Li Zhoutong, sent palace envoys with an edict to Maozhen ordering him to gather troops and return to his commission.',
    idiomatic: 'On jiashen Zhaozong beheaded Ximen Junsui and Li Zhoutong and ordered Maozhen to withdraw.',
  },
  s0282: {
    literal: 'Maozhen arrayed troops at Lingao Post, repeatedly listing chief minister Du Rangneng\'s crimes and asking that he be executed.',
    idiomatic: 'Maozhen camped at Lingao Post and demanded Du Rangneng\'s death.',
  },
  s0283: {
    literal: 'An edict demoted Grand Commandant, Grand Councillor, Duke of Jin Du Rangneng to Lei Prefecture census officer.',
    idiomatic: 'Du Rangneng was demoted to Lei census officer.',
  },
  s0284: {
    literal: 'On the day yiwei Du Rangneng was ordered to take his own life; his younger brother Vice Minister of Revenue Honghui was condemned with Rangneng and granted death.',
    idiomatic: 'On yiwei Rangneng was ordered to die; brother Honghui died with him.',
  },
  s0285: {
    literal: 'In the eleventh month an edict made Fengxiang military commissioner Li Maozhen acting Director of the Secretariat, advanced to Prince of Qin, and concurrent Xingyuan governor and Jiannan West military commissioner.',
    idiomatic: 'Eleventh month: Maozhen was made Secretariat director and Prince of Qin with Xingyuan.',
  },
  s0286: {
    literal: 'Bin military commissioner Wang Xingyu was granted the title "Sage Father" and bestowed an iron certificate.',
    idiomatic: 'Wang Xingyu of Bin was titled Sage Father and given an iron certificate.',
  },
  s0287: {
    literal: 'Vice Director of the Chancellery, Minister of Personnel, Associate Grand Councillor, and supervisor of the national history Cui Zhaowei was made concurrent Left Vice Director of the Secretariat and commissioner of salt and iron transport for all circuits;',
    idiomatic: 'Cui Zhaowei took Left Vice Director and salt transport;',
  },
  s0288: {
    literal: 'Special Advancement and acting Right Vice Director Wei Zhaodu was made Minister of Works, Vice Director of the Chancellery, Associate Grand Councillor, University Fellow of the Hongwen Institute, Commissioner of the Grand Pure Palace, and Commissioner of the Extended Resources Store.',
    idiomatic: 'Wei Zhaodu returned as Works minister and associate councillor;',
  },
  s0289: {
    literal: 'Vice Director of the Chancellery, Minister of Justice, Grand Councillor, and judge of Revenue Zheng Yanchang ceased knowing government affairs and remained Left Vice Director of the Secretariat, because he asked to leave on grounds of illness.',
    idiomatic: 'Zheng Yanchang left council over illness but kept Left Vice Director;',
  },
  s0290: {
    literal: 'The newly appointed Fengxiang military commissioner Xu Yanruo again knew government affairs.',
    idiomatic: 'Xu Yanruo of Fengxiang returned to council.',
  },
  s0291: {
    literal: 'Vice Minister of Revenue and judge of Revenue affairs Wang Bo was confirmed in office as Associate Grand Councillor.',
    idiomatic: 'Wang Bo of Revenue became Associate Grand Councillor.',
  },
  s0292: {
    literal: 'In the second month Bian troops greatly defeated Yan and Yun armies at Dong\'e; Xuan and Jin were cornered and sought aid from Taiyuan; Li Keyong marched out to rescue them.',
    idiomatic: 'Second month: Bian crushed Yan-Yun at Dong\'e; Xuan and Jin called Keyong.',
  },
  s0293: {
    literal: 'On the first day of the third month, jiazi, Taiyuan troops attacked Xing Prefecture, took it, seized the rebel commander Li Cunxiao, sent him in a cage to Taiyuan, and dismembered him.',
    idiomatic: 'Third month jiazi new moon: Taiyuan took Xingzhou, caged Cunxiao, and executed him.',
  },
  s0294: {
    literal: 'Keyong made his great general Ma Shisu acting Xing-Min training commissioner.',
    idiomatic: 'Keyong made Ma Shisu acting Xing-Min commander.',
  },
  s0295: {
    literal: 'In the fifth month Cai rebel Sun Ru\'s officer Liu Jianfeng attacked and took Tan Prefecture and styled himself Hunan military commissioner.',
    idiomatic: 'Fifth month: Liu Jianfeng of Sun Ru\'s army took Tanzhou and claimed Hunan.',
  },
  s0296: {
    literal: 'Hanlin Academician and Drafting Academician of the Secretariat Cui Yi was made Vice Minister of Revenue and drafter of edicts, fulfilling duty.',
    idiomatic: 'Cui Yi was made Revenue vice minister and kept drafting duty.',
  },
  s0297: {
    literal: 'On the day renchen Li Keyong attacked and took Yun Prefecture, seized Datong defense commissioner Helian Duo, and made his guard officer Xue Zhiqin hold Yunzhong.',
    idiomatic: 'On renchen Keyong took Yunzhou, seized Helian Duo, and left Xue Zhiqin at Yunzhong.',
  },
  s0298: {
    literal: 'On the day gengyin Vice Director of the Chancellery and Grand Councillor Wang Bo was made Hunan military commissioner.',
    idiomatic: 'On gengyin Wang Bo was sent as Hunan commissioner.',
  },
  s0299: {
    literal: 'Hanlin Academician-in-Chief, Minister of Rites, and drafter of edicts Li Di was made Vice Minister of Revenue and Associate Grand Councillor.',
    idiomatic: 'Li Di was made Revenue vice minister and associate councillor.',
  },
  s0300: {
    literal: 'On the day the edict was proclaimed, Director of the Water Office and drafter of edicts Liu Chonglu came out of rank weeping, saying Di was treacherous and wicked, clique-attached to inner officials, and could not occupy the place of chief assistant—therefore the edict order did not proceed.',
    idiomatic: 'When Li Di\'s appointment was read, Liu Chonglu wept in open court that Di was wicked and eunuch-backed; the order failed.',
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
