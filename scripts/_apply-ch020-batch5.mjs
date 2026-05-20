#!/usr/bin/env node
/** Batch 5: s0401–s0500 (Jiutangshu ch.020, Zhaozong annals) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/020.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 401;
const END = 500;

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
  s0401: {
    literal: 'On dinghai, an edict pardoned prisoners in bonds; the text read: "Those who held lofty rank as pillar and stone, whose posts weighed as Grand Councilor, or were entrusted with military authority, or took part in secret councils.',
    idiomatic: 'On dinghai an amnesty edict freed bound prisoners; it read: "Those who stood as pillars of state, weighed as Grand Councilors, held military power, or sat in secret councils—',
  },
  s0402: {
    literal: 'Yet through successive slander they came at last to a name of disaster; thwarting my love of life—alas, forced to die.',
    idiomatic: 'yet through successive slander they met disaster; thwarting my love of life—alas, they were forced to die.',
  },
  s0403: {
    literal: 'From Dashun onward, all who suffered disgrace and divestiture for no crime shall have office and salary restored.',
    idiomatic: 'From Dashun on, all stripped of rank without crime shall have office and salary restored.',
  },
  s0404: {
    literal: 'Du Rangneng, Ximen Junsui, Li Zhoutong, and those below—all shall be cleared, with rank and titles returned.',
    idiomatic: 'Du Rangneng, Ximen Junsui, Li Zhoutong, and those below are cleared and their ranks restored.',
  },
  s0405: {
    literal: 'Wei Zhaodu once held the Secretariat and repeatedly advanced the chancellor\'s work; when Wang Xingyu sought the office of Director of the Department of State Affairs, he alone could suppress it—leading to his deep wrong; surely it was for this.',
    idiomatic: 'Wei Zhaodu once headed the Secretariat and repeatedly advanced policy; he alone blocked Wang Xingyu\'s bid for Director of the Department of State Affairs—and was ruined for it.',
  },
  s0406: {
    literal: 'Li Mo\'s writings were grand and ample, far above his peers; yet amid factional strife he was squeezed to death—in all who had understanding, who did not sigh?',
    idiomatic: 'Li Mo wrote with grand eloquence, far above his peers; yet faction drove him to his death, and all who knew it sighed.',
  },
  s0407: {
    literal: 'They should all be cleared and washed, with office and titles restored.',
    idiomatic: 'They are all to be cleared and their offices and titles restored.',
  },
  s0408: {
    literal: '" Another edict: Crown Prince Mentor Cui Zhaowei was demoted to Taizhou Registrar; Waterways Bureau Director and Drafting Officer Liu Chonglu was banished to Yazhou Registrar.',
    idiomatic: '" Another edict demoted Crown Prince Mentor Cui Zhaowei to Taizhou registrar and banished drafting officer Liu Chonglu to Yazhou registrar.',
  },
  s0409: {
    literal: 'Another edict to the Binzhou campaign commander-in-chief: "When Vice Commissioner Cui Yin of Binzhou breaks the rebels, let none escape the net."',
    idiomatic: 'Another edict to the Binzhou campaign commander: "When Vice Commissioner Cui Yin breaks the rebels, let none escape."',
  },
  s0410: {
    literal: 'Yin and Zhaowei were faction allies last year, joined with Xingyu, and wove the womb of disaster—the root lies in this villain.',
    idiomatic: 'Yin and Zhaowei were allies last year, joined Xingyu, and wove this disaster—the root is this villain.',
  },
  s0411: {
    literal: 'He was entrusted to the four-sided campaign staffs for their disposition.',
    idiomatic: 'He was entrusted to the four-sided campaign staffs.',
  },
  s0412: {
    literal: '" That month the four-sided campaign armies massed at Binzhou.',
    idiomatic: 'That month all four campaign armies massed at Binzhou.',
  },
  s0413: {
    literal: 'In the eleventh month, on guimao, the first day of the month.',
    idiomatic: 'Eleventh month, guimao—the new moon.',
  },
  s0414: {
    literal: 'On renyin, Wang Xingyu with his wife, children, and retainers—more than five hundred—broke the encirclement and fled; reaching Qingzhou, Xingyu was killed by his subordinates, and his household of two hundred with them came to the campaign camp to surrender; Li Keyong sent his牙 officer Yan E to present them at the capital.',
    idiomatic: 'On renyin Wang Xingyu fled the siege with wife, children, and five hundred retainers; at Qingzhou his men killed him; two hundred of his household surrendered; Li Keyong sent Yan E to present them at court.',
  },
  s0415: {
    literal: 'In the twelfth month, on jiashen, the first day, Zhaozong received captives and heads at the Yanxi Gate; the hundred officials hailed victory before the tower.',
    idiomatic: 'Twelfth month, jiashen new moon: Zhaozong received captives at Yanxi Gate; officials hailed victory below the tower.',
  },
  s0416: {
    literal: 'An edict made Li Keyong Guardian Grand Preceptor and Director of the Secretariat, advanced to Prince of Jin, fief of nine thousand households, and granted the title "Loyal and True Pacifier of Disturbances."',
    idiomatic: 'An edict made Li Keyong Grand Preceptor and Director of the Secretariat, Prince of Jin with nine thousand households, titled Loyal and True Pacifier of Disturbances.',
  },
  s0417: {
    literal: '" That month Keyong led his army back to Taiyuan.',
    idiomatic: 'That month Keyong withdrew to Taiyuan.',
  },
  s0418: {
    literal: 'Edict: the third imperial son Qi was enfeoffed Prince of Di, the fifth son Xi Prince of Qian, the sixth Yin Prince of Yi, the seventh Yi Prince of Sui.',
    idiomatic: 'Edict: the third son Qi became Prince of Di; the fifth Xi, Prince of Qian; the sixth Yin, Prince of Yi; the seventh Yi, Prince of Sui.',
  },
  s0419: {
    literal: 'In spring, the first month, on guichou, the first day of the third year of Qianning, an edict made Special Advancement Holder, Minister of Revenue, concurrent Jingzhao Magistrate, and Heir of the Prince of Xue Zhirou Acting Minister of Works, concurrent Guangzhou Prefect and Censor-in-Chief, and Military Commissioner of Qinghai and Commissioner of Lingnan East Circuit.',
    idiomatic: 'Qianning 3, spring, guichou new moon: Zhirou, Heir of Xue, Minister of Revenue and Jingzhao Magistrate, was made Acting Minister of Works, Guangzhou prefect, and Qinghai–Lingnan East commissioner.',
  },
  s0420: {
    literal: 'Right Assistant Censor Cui Ze was made Prefect of Fengzhou.',
    idiomatic: 'Right Assistant Censor Cui Ze became prefect of Fengzhou.',
  },
  s0421: {
    literal: 'Luo Hongxin of Weibo defeated the Taiyuan army at Shen County.',
    idiomatic: 'Weibo\'s Luo Hongxin defeated the Taiyuan army at Shen County.',
  },
  s0422: {
    literal: 'At first Yan and Yun had shown support for Taiyuan; Keyong sent his tribal generals Shi Wanfu and He Huaibao with a thousand horsemen to aid them.',
    idiomatic: 'Yan and Yun had sought Taiyuan\'s aid; Keyong sent tribal generals Shi Wanfu and He Huaibao with a thousand horsemen.',
  },
  s0423: {
    literal: 'Now he again ordered Grand General Li Cunxin to camp at Shen County; the Wei people often lent passage, but Cunxin disciplined his troops poorly and sometimes harassed Wei civilians.',
    idiomatic: 'He now sent Li Cunxin to camp at Shen; the Wei often lent passage, but Cunxin disciplined poorly and harassed Wei civilians.',
  },
  s0424: {
    literal: 'Hongxin was enraged and ambushed them; the army fled in rout that night.',
    idiomatic: 'Hongxin ambushed them; the army routed that night.',
  },
  s0425: {
    literal: 'From then on Hongxin allied south with Liang and broke with Taiyuan; Yan and Yun had by then both fallen.',
    idiomatic: 'Hongxin then allied with Liang and broke with Taiyuan; Yan and Yun had both fallen.',
  },
  s0426: {
    literal: 'In the second month, on renzi, the first day, an edict made Prince of Tong Zi Grand Master of Honor with Golden Seal and Acting Commander of the Palace Guards for All Circuits.',
    idiomatic: 'Second month, renzi new moon: Prince of Tong Zi was made Grand Master of Honor and acting commander of palace guards for all circuits.',
  },
  s0427: {
    literal: 'Silver-Gleam Grandee Lu Yi, Minister of Revenue, Baron of Jiaxing with five hundred households, was made Minister of War.',
    idiomatic: 'Lu Yi, Silver-Gleam Grandee and Minister of Revenue, Baron of Jiaxing, became Minister of War.',
  },
  s0428: {
    literal: 'In the third month, on renzi, the first day, Examination Bureau Outer Director and Hall Scholar Du Dexiang was made Director of the Works Bureau and Drafting Officer.',
    idiomatic: 'Third month, renzi new moon: Du Dexiang, examination outer director and hall scholar, became Works Bureau director and drafting officer.',
  },
  s0429: {
    literal: 'In the fourth month, on renwu, the first day, Hunan troops mutinied, killed their commander Liu Jianfeng, and the three armies installed his subordinate, acting Shaozhou prefect Ma Yin, as military commissioner.',
    idiomatic: 'Fourth month, renwu new moon: Hunan troops killed Liu Jianfeng; the armies made his subordinate Ma Yin, acting Shaozhou prefect, military commissioner.',
  },
  s0430: {
    literal: 'Qian Liu, military commissioner of Zhenhai, attacked Yuezhou, took it, beheaded Dong Chang, and pacified eastern Zhe.',
    idiomatic: 'Zhenhai commissioner Qian Liu took Yuezhou, beheaded Dong Chang, and pacified eastern Zhe.',
  },
  s0431: {
    literal: 'An edict advanced Qian Liu to Acting Grand Guardian and Director of the Secretariat.',
    idiomatic: 'Qian Liu was advanced to acting grand guardian and director of the secretariat.',
  },
  s0432: {
    literal: 'On xinsi, demoted Taizhou Registrar Cui Zhaowei was ordered to take his own life.',
    idiomatic: 'On xinsi demoted registrar Cui Zhaowei was ordered to kill himself.',
  },
  s0433: {
    literal: 'An edict made Golden-Gleam Grandee Wang Tuan, Minister of Revenue, Vice Director of the Secretariat, Grand Councilor, Commissioner for Editing the National History, Supreme Pillar of State, Duke of Taiyuan, Acting Left Vice Director of the Department of State Affairs and Grand Councilor, concurrent Yuezhou Prefect, and Military Commissioner of Zhendong and Commissioner of Zhe East Circuit.',
    idiomatic: 'Wang Tuan, golden-gleam grandee and grand councilor, was made acting left vice director, Yuezhou prefect, and Zhendong–Zhe East commissioner.',
  },
  s0434: {
    literal: 'On gengxu, Li Keyong led fifty thousand Shatuo and Bing-Fen troops to attack Weizhou and its outer wall, plundering greatly through six prefectures, taking more than ten districts including Cheng\'an, Huanshui, and Linzhang—avenging Shen.',
    idiomatic: 'On gengxu Keyong led fifty thousand Shatuo and Bing-Fen troops against Weizhou, ravaging six prefectures and more than ten districts—a reprisal for Shen.',
  },
  s0435: {
    literal: 'Li Maozhen of Fengxiang resented the court\'s campaign against Zhu Mei, broke off tribute, and plotted to strike the capital; the Son of Heaven ordered Prince of Tan to ready troops against change.',
    idiomatic: 'Maozhen of Fengxiang, resenting the Zhu Mei campaign, stopped tribute and plotted against the capital; the emperor ordered Prince of Tan to ready troops.',
  },
  s0436: {
    literal: 'That month Maozhen submitted a memorial asking to bring troops to audience.',
    idiomatic: 'That month Maozhen asked leave to bring troops to audience.',
  },
  s0437: {
    literal: 'The emperor ordered Princes of Tong, Tan, and Yan each to command the Ansheng, Pongchen, Baoning, and Xuanhua armies to guard the near capital.',
    idiomatic: 'The emperor ordered Princes of Tong, Tan, and Yan to command Ansheng, Pongchen, Baoning, and Xuanhua armies for the capital approaches.',
  },
  s0438: {
    literal: 'On bingyin, Fengxiang troops struck the capital region; Prince of Tan met them at Lou Lodge and fought to disadvantage.',
    idiomatic: 'On bingyin Fengxiang troops struck the capital approaches; Prince of Tan met them at Lou Lodge and lost.',
  },
  s0439: {
    literal: 'In the seventh month, on gengchen, the first day of autumn.',
    idiomatic: 'Seventh month, gengchen—autumn\'s new moon.',
  },
  s0440: {
    literal: 'On renchen, Qi troops pressed the capital; the princes led palace troops to escort the imperial carriage toward Taiyuan.',
    idiomatic: 'On renchen Qi troops pressed the capital; princes led palace troops to escort the emperor toward Taiyuan.',
  },
  s0441: {
    literal: 'On guisi the court halted north of the Wei; Han Jian of Huazhou sent his son Chong with a memorial of greeting, asking the emperor to halt at Huazhou; Jian was then made Capital Region Commander, Pacification Commissioner, and Commissioner to Urge Tribute Transport from All Circuits.',
    idiomatic: 'On guisi the court halted north of the Wei; Han Jian of Huazhou begged a halt at Huazhou and was made capital-region commander and tribute-transport commissioner.',
  },
  s0442: {
    literal: 'An edict told Jian: "The journey already begun lies in Hedong; for now we shall visit Zhiyu."',
    idiomatic: 'The edict told Jian: "The journey to Hedong is begun; for now we visit Zhiyu."',
  },
  s0443: {
    literal: '" On jiawu the court reached Fuping.',
    idiomatic: 'On jiawu the court reached Fuping.',
  },
  s0444: {
    literal: 'Han Jian came to audience, weeping as he memorialized: "The feudatories are stubborn—not Maozhen alone.',
    idiomatic: 'Han Jian came to audience weeping: "The feudatories are stubborn—not Maozhen alone.',
  },
  s0445: {
    literal: 'Though Taiyuan aids the throne, the imperial progress should not visit there.',
    idiomatic: 'Though Taiyuan aids the throne, the emperor should not go there.',
  },
  s0446: {
    literal: 'My commandery guards the passes; though my forces are slight, they suffice to hold firm.',
    idiomatic: 'My commandery guards the passes; though slight, my forces can hold.',
  },
  s0447: {
    literal: 'If Your Majesty lightly leaves the near capital for the far frontier, leaving ancestral tombs and temples—will you not grieve? To lose the Wei capital\'s golden ramparts is no good plan.',
    idiomatic: 'To leave the near capital for the far frontier, abandoning tombs and the golden ramparts of Wei—what grief, and what folly.',
  },
  s0448: {
    literal: 'If the carriage crosses the river, return will be hard; if the plan fails, regret will come too late.',
    idiomatic: 'Cross the river and return will be hard; a bad plan brings regret too late.',
  },
  s0449: {
    literal: 'I beg Your Majesty to halt at Sanfeng for now and plan recovery.',
    idiomatic: 'Beg Your Majesty halt at Sanfeng and plan recovery.',
  },
  s0450: {
    literal: '" The emperor too wept and said: "I cannot bear Maozhen\'s pressure and in anger did not think of hardship.',
    idiomatic: 'The emperor wept: "I cannot bear Maozhen\'s pressure and in anger forgot hardship.',
  },
  s0451: {
    literal: 'Your words are right."',
    idiomatic: 'You speak rightly."',
  },
  s0452: {
    literal: '" On yiwei the court reached Xiaji; on bingchen it halted at Huazhou, taking the yamen city as the traveling palace.',
    idiomatic: 'On yiwei the court reached Xiaji; on bingchen it halted at Huazhou, the yamen city as traveling palace.',
  },
  s0453: {
    literal: 'At that time Qi troops had struck the capital; palaces and lanes were reduced to ash—all the rebuilding since Zhonghe was swept away.',
    idiomatic: 'Qi troops had struck the capital; palaces and lanes were ash—all rebuilding since Zhonghe was gone.',
  },
  s0454: {
    literal: 'On yisi, an edict made Golden-Gleam Grandee Cui Yin, Vice Director of the Secretariat, concurrent Minister of Rites and Grand Councilor, Grand Scholar of the Hall of Assembled Worthies, Controller of Revenue, Supreme Pillar, Baron of Boling, Acting Left Vice Director of the Department of State Affairs, concurrent Guangzhou Prefect and Censor-in-Chief, and Military Commissioner of Qinghai and Commissioner of Lingnan East Circuit.',
    idiomatic: 'On yisi Cui Yin, golden-gleam grandee and grand councilor, was made acting left vice director, Guangzhou prefect, and Qinghai–Lingnan East commissioner.',
  },
  s0455: {
    literal: 'On bingwu, an edict made Hanlin Academician-in-Chief Lu Yi, Left Assistant Censor, Drafting Officer, Baron of Jiaxing with five hundred households, Vice Minister of Revenue and Grand Councilor.',
    idiomatic: 'On bingwu Lu Yi, hanlin chief and drafting officer, became vice minister of revenue and grand councilor.',
  },
  s0456: {
    literal: 'In the eighth month, on jiyou, the first day.',
    idiomatic: 'Eighth month, jiyou new moon.',
  },
  s0457: {
    literal: 'On jiayin, the newly appointed Zhendong commissioner Qian Liu was authorized to lead Zhe East military and prefectural affairs.',
    idiomatic: 'On jiayin newly appointed Zhendong commissioner Qian Liu was authorized to lead Zhe East affairs.',
  },
  s0458: {
    literal: 'On wuwu, an edict made Grand Councilor Lu Yi, Vice Minister of Revenue, Vice Director of the Secretariat, and Controller of Revenue.',
    idiomatic: 'On wuwu Lu Yi became vice director of the secretariat and controller of revenue.',
  },
  s0459: {
    literal: 'In the ninth month, on jimao, the first day, Zhu Quanzhong of Bianzhou, Zhang Quanyi, Henan Magistrate, and the eastern feudatories all memorialized that Qin had disaster and begged the imperial carriage move the capital to Luoyang.',
    idiomatic: 'Ninth month, jimao new moon: Quanzhong, Quanyi, and eastern lords said Qin had disaster and begged removal to Luoyang.',
  },
  s0460: {
    literal: 'Quanzhong and Quanyi said they had already led the feudatories in repairing Luoyang\'s palaces.',
    idiomatic: 'Quanzhong and Quanyi said they had led feudatories in repairing Luoyang\'s palaces.',
  },
  s0461: {
    literal: 'A gracious edict answered them.',
    idiomatic: 'The throne answered graciously.',
  },
  s0462: {
    literal: 'On yiwei, an edict restored the newly appointed Qinghai commissioner Cui Yin to government affairs.',
    idiomatic: 'On yiwei newly appointed Qinghai commissioner Cui Yin was restored to government.',
  },
  s0463: {
    literal: 'When Yin left for his command, Zhu Quanzhong twice memorialized that Yin should not leave the chancellorship; hence this order.',
    idiomatic: 'When Yin went out, Quanzhong twice begged he keep the chancellorship—hence the order.',
  },
  s0464: {
    literal: 'On dingyou, an edict demoted Vice Director of the Secretariat Lu Yi to Prefect of Xiazhou—Yin hated Yi for replacing him and slandered him as Maozhen\'s partisan.',
    idiomatic: 'On dingyou Lu Yi was demoted to Xiazhou—Yin hated him for replacing him and slandered him as Maozhen\'s partisan.',
  },
  s0465: {
    literal: 'On bingwu, an edict made Zhenguo commissioner Han Jian Acting Grand Guardian, concurrent Director of the Secretariat, Commissioner to Restore the Palaces, Capital Region Commissioner, and Commissioner to Urge Tribute Transport.',
    idiomatic: 'On bingwu Han Jian was made acting grand guardian, director of the secretariat, and palace-restoration commissioner.',
  },
  s0466: {
    literal: 'Jingzhao Magistrate Sun Wo was made Vice Minister of War and Grand Councilor.',
    idiomatic: 'Jingzhao Magistrate Sun Wo became vice minister of war and grand councilor.',
  },
  s0467: {
    literal: 'In the tenth month, on wushen, the first day, Secretariat Draftsman Xue Zhaowei, acting Director of the Ministry of Rites for the examinations, was made Vice Minister of Rites.',
    idiomatic: 'Tenth month, wushen new moon: Xue Zhaowei became vice minister of rites.',
  },
  s0468: {
    literal: 'On renzi, an edict made Grand Councilor Sun Wo, Vice Minister of War, Vice Director of the Secretariat, and Pacification Commissioner for the Fengxiang campaign.',
    idiomatic: 'On renzi Sun Wo became vice director of the secretariat and Fengxiang pacification commissioner.',
  },
  s0469: {
    literal: 'On jiayin, Wo met the generals at the relay station to discuss advancing.',
    idiomatic: 'On jiayin Wo met generals at the relay station to discuss advancing.',
  },
  s0470: {
    literal: 'On wuwu, Li Maozhen submitted a memorial begging pardon, vowing to reform his service to the ruler and resume tribute, and presented one hundred fifty thousand cash to aid palace repair.',
    idiomatic: 'On wuwu Maozhen begged pardon, vowed renewed service and tribute, and gave one hundred fifty thousand cash for palace repair.',
  },
  s0471: {
    literal: 'Han Jian swayed the emperor; the army was not sent.',
    idiomatic: 'Han Jian swayed him; no army marched.',
  },
  s0472: {
    literal: 'In the eleventh month, on dingchou, the first day, Han Jian was also made concurrent Jingzhao Magistrate and Capital Gate Controller.',
    idiomatic: 'Eleventh month, dingchou new moon: Han Jian also became Jingzhao magistrate and capital gate controller.',
  },
  s0473: {
    literal: 'On dingwei, Li Keyong\'s troops captured and plundered Weibo\'s districts and towns.',
    idiomatic: 'On dingwei Keyong\'s troops captured and plundered Weibo districts.',
  },
  s0474: {
    literal: 'Former Hanlin Academician-in-Chief Zhao Guangyuan, Left Assistant Censor and Drafting Officer, was made Vice Censor-in-Chief.',
    idiomatic: 'Former hanlin chief Zhao Guangyuan became vice censor-in-chief.',
  },
  s0475: {
    literal: 'The Court of Imperial Sacrifices memorialized establishing a traveling temple for offerings; the edict was assented to.',
    idiomatic: 'The Court of Imperial Sacrifices asked to establish a traveling temple for offerings; the edict was assented to.',
  },
  s0476: {
    literal: 'In spring, the first month, on dingchou, the first day of the fourth year of Qianning, the imperial carriage was at the Huazhou traveling palace and received the hundred officials in audience.',
    idiomatic: 'Qianning 4, spring, dingchou new moon: the emperor at Huazhou traveling palace received officials in audience.',
  },
  s0477: {
    literal: 'On guimao, Bian general Pang Shigu took Yanzhou; Commissioner Zhu Xuan broke the siege with his wife Lady Rong; Xuan reached Zhongdu and was killed by villagers; Lady Rong was captured by Bian troops.',
    idiomatic: 'On guimao Pang Shigu took Yanzhou; Zhu Xuan fled with Lady Rong, was killed at Zhongdu; she was captured.',
  },
  s0478: {
    literal: 'Zhu Quanzhong appointed Pang Shigu acting Yanzhou military commissioner.',
    idiomatic: 'Quanzhong appointed Pang Shigu acting Yanzhou commissioner.',
  },
  s0479: {
    literal: 'Grand Councilor Sun Wo left government affairs and kept the post of Minister of War.',
    idiomatic: 'Grand Councilor Sun Wo left government and kept the ministry of war.',
  },
  s0480: {
    literal: 'In the second month, on bingwu, the first day.',
    idiomatic: 'Second month, bingwu new moon.',
  },
  s0481: {
    literal: 'On wushen, Bian general Ge Congzhou attacked Yanzhou, took it; Commissioner Zhu Jin fled to Yang Xingmi; his general Kang Huai Zhen surrendered to Congzhou; Quanzhong appointed Congzhou acting Yanzhou commissioner.',
    idiomatic: 'On wushen Ge Congzhou took Yanzhou; Zhu Jin fled to Yang Xingmi; Kang Huai Zhen surrendered; Quanzhong made Congzhou acting commissioner.',
  },
  s0482: {
    literal: 'From then Yan, Qi, Cao, Di, Yan, Yi, Mi, Xu, Su, Chen, Xu, Zheng, Hua, and Pu all fell to Quanzhong; only Wang Shifan held Qingzhou and also submitted to Bian.',
    idiomatic: 'Thereafter Yan, Qi, Cao, Di, Yan, Yi, Mi, Xu, Su, Chen, Xu, Zheng, Hua, and Pu fell to Quanzhong; only Shifan held Qingzhou and also submitted.',
  },
  s0483: {
    literal: 'An edict made Court Gentleman for Consultation Zheng Qi, Right Regular Attendant, Supreme Pillar, Baron of Xingyang, Vice Minister of Rites and Grand Councilor.',
    idiomatic: 'An edict made Zheng Qi vice minister of rites and grand councilor.',
  },
  s0484: {
    literal: 'On guichou, demoted Xiazhou Prefect Lu Yi was made Minister of Works.',
    idiomatic: 'On guichou demoted Lu Yi was made minister of works.',
  },
  s0485: {
    literal: 'On jiayin, Huazhou defense officer Hua Chongwu reported that Princes of Mu and seven others plotted to kill Han Jian and move the carriage to Hezhong.',
    idiomatic: 'On jiayin Hua Chongwu reported eight princes plotted to kill Han Jian and move the court to Hezhong.',
  },
  s0486: {
    literal: 'The emperor was alarmed and summoned Jian to instruct him; Jian pleaded illness and dared not come.',
    idiomatic: 'The emperor was alarmed and summoned Jian; Jian pleaded illness and dared not come.',
  },
  s0487: {
    literal: 'The emperor at once ordered Princes of Tong and below to Jian\'s office to explain themselves.',
    idiomatic: 'The emperor ordered Princes of Tong and below to Jian\'s office to explain.',
  },
  s0488: {
    literal: 'Jian memorialized: "Today at the wei hour Princes of Mu, Ji, Shao, Tong, Peng, Han, Yi, and Chen—eight in all—came to my office for reasons I could not fathom.',
    idiomatic: 'Jian memorialized: "At wei hour today eight princes came to my office for reasons I could not fathom.',
  },
  s0489: {
    literal: 'I weighed the matter and should not meet the princes; I also feared long stay at my office would be unfitting.',
    idiomatic: 'I judged I should not meet them and feared their long stay was unfitting.',
  },
  s0490: {
    literal: 'Moreover the princes and I differ in inner and outer affairs, in honor and rank; as to power, we did not encroach—yet they suddenly came to my door, their intent beyond measure."',
    idiomatic: 'We differ in inner and outer affairs and rank; we did not encroach—yet they came unbidden, intent beyond measure."',
  },
  s0491: {
    literal: '" He also cited the Jin-era Eight Princes\' turmoil: "I beg the old rule—that princes dwell in the Sixteen Mansions and not command troops."',
    idiomatic: 'He cited the Jin Eight Princes: "Restore the old rule—princes in the Sixteen Mansions, not commanding troops."',
  },
  s0492: {
    literal: 'The rear-guard, Sun-support, and escort armies were all marketplace ruffians unfit for guard duty; I beg they be disbanded to calm hearts."',
    idiomatic: 'Rear-guard and escort troops were marketplace ruffians unfit for guard; he begged disbandment to calm hearts."',
  },
  s0493: {
    literal: 'Zhaozong had no choice and assented to all.',
    idiomatic: 'Zhaozong had no choice and assented.',
  },
  s0494: {
    literal: 'That day the eight princes were imprisoned in a separate residence; more than twenty thousand rear-guard and escort troops were disbanded; Sun-support commander Li Yun was killed beneath Dayun Bridge—from then the emperor\'s guards were gone.',
    idiomatic: 'That day eight princes were imprisoned; twenty thousand guards were disbanded; Li Yun was killed at Dayun Bridge—the emperor\'s guards were gone.',
  },
  s0495: {
    literal: 'On bingchen, Han Jian memorialized asking to invest the crown prince and princes as bulwark of the realm.',
    idiomatic: 'On bingchen Han Jian asked to invest crown prince and princes as realm bulwark.',
  },
  s0496: {
    literal: 'On jiwei, an edict: Prince of De Yu should be invested crown prince.',
    idiomatic: 'On jiwei Prince of De Yu was ordered invested crown prince.',
  },
  s0497: {
    literal: 'On xinyou, an edict: the eighth son Mi could be enfeoffed Prince of Jing, the ninth Zuo Prince of Hui, the tenth Qi Prince of Qi, the eleventh Zhen Prince of Ya, the twelfth Xiang Prince of Qiong.',
    idiomatic: 'On xinyou the eighth Mi became Prince of Jing, ninth Zuo Prince of Hui, tenth Qi Prince of Qi, eleventh Zhen Prince of Ya, twelfth Xiang Prince of Qiong.',
  },
  s0498: {
    literal: 'In the third month, on bingzi, the first day.',
    idiomatic: 'Third month, bingzi new moon.',
  },
  s0499: {
    literal: 'On wuyin, an edict advanced Han Jian to Prince of Changli and granted the title "Supporting Loyalty and Pacifying the State."',
    idiomatic: 'On wuyin Han Jian was advanced to Prince of Changli, titled Supporting Loyalty and Pacifying the State.',
  },
  s0500: {
    literal: 'Grandee Zhang Jun, Minister of War, Supreme Pillar, Marquis of Hejian with two thousand households, was made Left Vice Director of the Department of State Affairs, continuing as Commissioner of Tribute and Corvée.',
    idiomatic: 'Zhang Jun, grandee and minister of war, Marquis of Hejian, became left vice director, continuing as tribute commissioner.',
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
