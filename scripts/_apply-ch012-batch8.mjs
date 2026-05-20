#!/usr/bin/env node
/** Batch 8: s0701–s0800 (Jiutangshu ch.012, Dezong 1 — Chen Xianqi, Tubo raids, Zhenyuan 2–3) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/012.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 701;
const END = 800;

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
  s0701: {
    literal: 'On xinsi Shanzhou observation commissioner Li Bi memorialized that Lushi Mountain smeltery produced green jade; he requested prohibition for tribute.',
    idiomatic: 'On xinsi Li Bi reported jade at the Lushi Mountain mines and asked to monopolize it for tribute.',
  },
  s0702: {
    literal: 'The emperor said: "Green jade is not produced in the central land; if there is any, share it with the people — let anyone mine it."',
    idiomatic: '"Jade does not belong to the throne alone," the emperor said. "Let the people dig what they find."',
  },
  s0703: {
    literal: 'On jiashen an edict made Huaixi guard commander Chen Xianqi Caizhou prefect and Huaixi military commissioner; overall commanders Liu Xuanzuo, Li Cheng, Qu Huan, Li Gao, Jia Dan, and Zhang Jianfeng were each granted one son a regular-rank office — rewarding the pacification of Huai and Cai.',
    idiomatic: 'On jiashen Chen Xianqi became Huaixi commissioner; six campaign commanders each received a regular post for a son.',
  },
  s0704: {
    literal: 'On dingwei Jiannan East River military commissioner Li Shuming was made Grand Preceptor to the Heir Apparent; East River military envoy Wang Shuyong was made Zizhou prefect and Jiannan East River military commissioner.',
    idiomatic: 'On dingwei Li Shuming became grand preceptor; Wang Shuyong took East Sichuan command.',
  },
  s0705: {
    literal: 'Fifth month, bingchen: from guisi great rain continued to this day; starving people awaited the summer wheat about to ripen, yet this downpour came — hearts were greatly afraid; rice again reached a thousand cash.',
    idiomatic: 'Rain from guisi through bingchen drowned hopes for the summer wheat; grain again hit a thousand cash the dou.',
  },
  s0706: {
    literal: 'On dingyou Yi-Xi Beiting military acting commissioner Yang Xigu was made chief administrator of Beiting and commissioner of Yi, Xi, Beiting revenue, garrison-farming, and Hanhai.',
    idiomatic: 'On dingyou Yang Xigu was confirmed at Beiting with full northwest powers.',
  },
  s0707: {
    literal: 'On jihai the hundred officials begged the emperor to resume regular meals;',
    idiomatic: 'On jihai officials urged the emperor to restore the normal palace table;',
  },
  s0708: {
    literal: 'at the time the people had long been famine-weary; eating new wheat in excess — the dead were very numerous.',
    idiomatic: 'the hungry ate green wheat too greedily and died in great numbers.',
  },
  s0709: {
    literal: 'Yi-Xi Beiting military commissioner Li Yuanzhong died; he was posthumously made Minister of Works.',
    idiomatic: 'Li Yuanzhong of Beiting died and was posthumously made minister of works.',
  },
  s0710: {
    literal: 'On xinyou great wind and rain; streets and lanes several chi deep in water; some people drowned.',
    idiomatic: 'On xinyou a storm flooded the streets waist-deep and drowned residents.',
  },
  s0711: {
    literal: 'On guawei Transverse Sea Army commissioner and Cangzhou prefect Cheng Rihua died; his son Huaizhi was allowed to act as temporary administrator of the army and prefecture.',
    idiomatic: 'On guawei Cheng Rihua of Cangzhou died; his son Huaizhi succeeded him acting commander.',
  },
  s0712: {
    literal: 'Autumn, seventh month, wuzi: the Qianzhong observation commissioner\'s seat of government was again at Qian Prefecture.',
    idiomatic: 'In the seventh month the Qianzhong commissioner returned his seat to Qianzhou.',
  },
  s0713: {
    literal: 'On xinmao former Kaizhou registrar Bai Zhizhen was made Guozhou prefect.',
    idiomatic: 'On xinmao Bai Zhizhen became Guozhou prefect.',
  },
  s0714: {
    literal: 'On yiwei Fujian observation commissioner Lu Qi died.',
    idiomatic: 'On yiwei Lu Qi, Fujian commissioner, died.',
  },
  s0715: {
    literal: 'On jiyou Prince of Qian Li Liang was made grand commissioner of Shen, Guang, Sui, and Cai; Huaixi military envoy Wu Shaoqing was made Caizhou prefect and acting commissioner; eastern capital protector Jia Dan was advanced as eastern capital Ji-Tang-Yu-Deng metropolitan defense and observation commissioner; Longyou campaign commissioner Qu Huan was made Chen-Xu military commissioner.',
    idiomatic: 'On jiyou Li Liang took the Shen-Guang-Sui-Cai command; Wu Shaoqing held Caizhou; Jia Dan and Qu Huan received enlarged posts.',
  },
  s0716: {
    literal: 'On wuwu Yan-Fang commissioner Tang Chaochen was made chief administrator of the Shanyu Protectorate and Zhenwu-Sui-Yin military commissioner; Right Golden Guards grand general Lun Weiming was made Yan prefect and Yan-Fang metropolitan defense and observation commissioner.',
    idiomatic: 'On wuwu Tang Chaochen went to the northern frontier; Lun Weiming took Yan-Fang.',
  },
  s0717: {
    literal: 'On jisi Golden Guards grand general Dong Jin was made Vice Director of the Right.',
    idiomatic: 'On jisi Dong Jin became right vice director.',
  },
  s0718: {
    literal: 'On gengchen Right Regular Attendant Jiang Mian died.',
    idiomatic: 'On gengchen Jiang Mian died.',
  },
  s0719: {
    literal: 'On bingxu Tibet raided Jing, Long, Bin, and Ning; garrisons closed their walls and held firm; the capital went on alert.',
    idiomatic: 'On bingxu Tibet struck the northwest; garrisons shut their gates and Chang\'an armed.',
  },
  s0720: {
    literal: 'Hezhong military commissioner Luo Yuanguang was sent to garrison Xianyang.',
    idiomatic: 'Luo Yuanguang of Hezhong was posted to Xianyang.',
  },
  s0721: {
    literal: 'Ninth month, an edict stated: "The Left and Right Golden Guards and the Sixteen Guards generals — by precedent all select meritorious ministers, going out to garrison corners, entering to attend the ruler.',
    idiomatic: 'In the ninth month an edict declared: "The Sixteen Guards and Golden Guards should again honor meritorious men who serve in court and in the provinces.',
  },
  s0722: {
    literal: 'Since the Tianbao troubles the guard soldiers have indeed been abolished and neglected, yet generals\' ranks remain especially high.',
    idiomatic: 'Since Tianbao the guards have thinned, yet their generals still rank high.',
  },
  s0723: {
    literal: 'This is truly the place where civil and military meritorious ministers rotate in and out — salaries and ranks should be increased to show exceptional honor.',
    idiomatic: 'These posts are the ladder of civil and military honor and deserve richer pay.',
  },
  s0724: {
    literal: 'All should receive added stipend money and personal grain rations; still follow precedent and establish a martial court attendance; corridor meals should also be increased.',
    idiomatic: 'Raise their stipends, corridor rations, and martial court privileges.',
  },
  s0725: {
    literal: 'Each of the Sixteen Guards is to establish one senior general, rank from second grade;',
    idiomatic: 'Each guard shall have a senior general of second rank;',
  },
  s0726: {
    literal: 'the Left and Right Golden Guards senior generals\' salaries are to be paid after the six supreme army commanders.',
    idiomatic: 'Golden Guard pay shall rank just below the six supreme commanders.',
  },
  s0727: {
    literal: 'To seek good order one must rely on combined talent; civil and military rotation in turn — not wholly limited and separated.',
    idiomatic: 'Good government needs men skilled in both civil and military service.',
  },
  s0728: {
    literal: 'From now on, for inner and outer civil and military vacancies, from civil and military ranks measure talent and reputation and appoint in mutual reference.',
    idiomatic: 'Henceforth fill vacancies from both civil and military rolls by merit.',
  },
  s0729: {
    literal: 'Still follow precedent and in each guard establish guard soldiers in measure.',
    idiomatic: 'Restore guard complements in each command.',
  },
  s0730: {
    literal: 'The relevant offices are to set conditions and report.',
    idiomatic: 'Offices were ordered to draft regulations and report.',
  },
  s0731: {
    literal: '」 On dingyou Fengcheng Army military commissioner, Zheng-Hua observation commissioner, acting Minister of the Left, Huazhou prefect, Prince of Wuwei Li Cheng died.',
    idiomatic: 'Thus ended the edict. On dingyou Li Cheng of Fengcheng and Wuwei died.',
  },
  s0732: {
    literal: 'Eastern capital Ji, Tang, Deng, and Ru defense and observation commissioner Jia Dan was made acting Minister of the Right, concurrent Huazhou prefect, Fengcheng Army military commissioner, and Zheng-Hua and attached prefectures observation commissioner.',
    idiomatic: 'Jia Dan succeeded Li Cheng on the Henan front.',
  },
  s0733: {
    literal: 'On wuxu Vice Director of Personnel Cui Zong was made acting Minister of Rites, eastern capital protector, and eastern capital Ji-Tang-Deng-Ru defense and observation commissioner.',
    idiomatic: 'On wuxu Cui Zong became Luoyang protector and Henan commissioner.',
  },
  s0734: {
    literal: 'On jihai an order stated: Left and Right Guard senior generals and grand generals are all to lodge within the guard.',
    idiomatic: 'On jihai guard generals were ordered to reside in their barracks.',
  },
  s0735: {
    literal: 'On yisi Tibet raided Hao; the capital went on alert.',
    idiomatic: 'On yisi Tibet raided Hao and Chang\'an armed again.',
  },
  s0736: {
    literal: 'Li Sheng\'s subordinate Wang Bi struck Tibet at Qianyang City and defeated their center army.',
    idiomatic: 'Wang Bi, Li Sheng\'s lieutenant, routed the Tibetan center at Qianyang.',
  },
  s0737: {
    literal: 'On xinhai they raided Fengxiang; Li Sheng took the field against them and in one night withdrew them.',
    idiomatic: 'On xinhai Li Sheng drove Tibet from Fengxiang overnight.',
  },
  s0738: {
    literal: 'Winter, tenth month, renwu: it was memorialized that within Guannei, Hezhong, Henan, and other circuits the autumn and summer two-tax and green-sprout monies were all to be commuted to grain and wheat payment, with added valuation for government purchase to benefit the people — granted.',
    idiomatic: 'In the tenth month the court allowed tax cash in several circuits to be paid in grain at favorable rates.',
  },
  s0739: {
    literal: 'That month Li Sheng broke Tibet\'s Cuisha Fort.',
    idiomatic: 'That month Li Sheng took Tibet\'s Cuisha Fort.',
  },
  s0740: {
    literal: 'Eleventh month, jiawu: Consort Shu, Lady Wang, was enfeoffed empress.',
    idiomatic: 'In the eleventh month Lady Wang became empress.',
  },
  s0741: {
    literal: 'On yiwei Zhejiang East and West military commissioner Han Huang came to court.',
    idiomatic: 'On yiwei Han Huang arrived for audience.',
  },
  s0742: {
    literal: 'On dingyou Empress Wang was invested.',
    idiomatic: 'On dingyou the investiture rites were held.',
  },
  s0743: {
    literal: 'That day the empress died; posthumous title Zhaode.',
    idiomatic: 'She died the same day and was posthumously styled Zhaode.',
  },
  s0744: {
    literal: 'On xinchou Tibet took Yan Prefecture.',
    idiomatic: 'On xinchou Tibet seized Yanzhou.',
  },
  s0745: {
    literal: 'On renyin Liu Xuanzuo, Qu Huan, and E-Yue Lu Xuanqing all came to court.',
    idiomatic: 'On renyin Liu Xuanzuo, Qu Huan, and Lu Xuanqing came to audience.',
  },
  s0746: {
    literal: 'Twelfth month, dingsi: Han Huang was additionally made fiscal commissioner and commissioner of salt and iron transport on all circuits.',
    idiomatic: 'In the twelfth month Han Huang took the treasury and salt portfolios.',
  },
  s0747: {
    literal: 'Tibet took Xia Prefecture and also took Yin Prefecture.',
    idiomatic: 'Tibet seized Xia and Yin.',
  },
  s0748: {
    literal: 'On gengshen Supervising Censor and Grand Secretariat Associate Cui Zao was made Right Subordinate Heir Apparent.',
    idiomatic: 'On gengshen Cui Zao left the chancellery for the right subordinate heir\'s post.',
  },
  s0749: {
    literal: 'Acting Vice Director of the Right and fiscal commissioner Yuan Xiu was demoted to registrar of Leizhou — because Han Huang falsely impeached him; people considered it a wrongful crime; remonstrating officials repeatedly argued the point.',
    idiomatic: 'Yuan Xiu was exiled to Leizhou on Han Huang\'s false charge; remonstrators called it injustice.',
  },
  s0750: {
    literal: 'On xinwei Li Sheng of Fengxiang came to court.',
    idiomatic: 'On xinwei Li Sheng came from Fengxiang for audience.',
  },
  s0751: {
    literal: 'On renshen within the capital region wine was monopolized — one hundred fifty cash monopoly per dou; wine-house corvée was remitted — following the fiscal office\'s memorial.',
    idiomatic: 'On renshen the capital levied a hundred fifty cash per dou of wine and freed brewers from corvée.',
  },
  s0752: {
    literal: 'Zhenyuan 3, spring, first month, bingxu new moon.',
    idiomatic: 'Zhenyuan 3 opened on the bingxu new moon.',
  },
  s0753: {
    literal: 'On renyin Minister of the Left Zhang Yanshang was made Grand Secretariat Associate.',
    idiomatic: 'On renyin Zhang Yanshang re-entered the chancellery.',
  },
  s0754: {
    literal: 'On yisi Vice Minister of Rites Xue Bo died.',
    idiomatic: 'On yisi Xue Bo died.',
  },
  s0755: {
    literal: 'On xinhai Vice Minister of Revenue Li Song was made E-Yue observation commissioner.',
    idiomatic: 'On xinhai Li Song was sent to E-Yue.',
  },
  s0756: {
    literal: 'On renzi Vice Minister of War Liu Hun was made Grand Secretariat Associate;',
    idiomatic: 'On renzi Liu Hun entered the chancellery;',
  },
  s0757: {
    literal: 'Liu Zi kept his original office and ceased managing government affairs;',
    idiomatic: 'Liu Zi kept his title but left the council;',
  },
  s0758: {
    literal: 'Secretariat Drafter and Grand Secretariat Associate Qi Ying was demoted to prefect of Kuizhou.',
    idiomatic: 'Qi Ying was exiled to Kuizhou.',
  },
  s0759: {
    literal: 'On wuyin fiscal, salt, and iron transport commissioner, Zhenhai Army military commissioner, Zhejiang East and West observation commissioner, acting Minister of the Left, Grand Secretariat Associate, Duke of Jin Han Huang died; posthumously made Grand Preceptor.',
    idiomatic: 'On wuyin Han Huang, duke of Jin, died and was posthumously made grand preceptor.',
  },
  s0760: {
    literal: 'Guozhou prefect Bai Zhizhen was made Runzhou prefect, concurrent censor-in-chief, and Zhexi observation commissioner; Xuanzhou prefect Huangfu Zheng was made Yuezhou prefect and Zhedong observation commissioner.',
    idiomatic: 'Bai Zhizhen took Zhexi; Huangfu Zheng took Zhedong.',
  },
  s0761: {
    literal: 'Third month, gengyin: an edict stated this year\'s court-gathering envoys should stop.',
    idiomatic: 'In the third month the annual court-gathering missions were canceled.',
  },
  s0762: {
    literal: 'On bingwu Fengxiang-Longyou deputy commander-in-chief Wu Shen was made Fujian observation commissioner; Fengxiang chief commandant Xing Junya was made Fengxiang prefect and regimental training commissioner of the prefecture.',
    idiomatic: 'On bingwu Wu Shen went to Fujian; Xing Junya became Fengxiang prefect.',
  },
  s0763: {
    literal: 'On dingwei an order stated: Fengxiang-Longyou, Jingyuan, Four Garrisons, and Beiting campaign deputy commander-in-chief, Fengxiang-Longyou circuit military commissioner, Fengtian Pacification merit-holder, Grand Master of the Court concurrent Grand Secretariat Director, Fengxiang prefect, Supreme Pillar of State, Prince of Xiping commandery, substantive fief one thousand five hundred households Li Sheng may be Grandee of the Court concurrent Grand Secretariat Director.',
    idiomatic: 'On dingwei Li Sheng was promoted to grandee of the court while keeping the Xiping command.',
  },
  s0764: {
    literal: 'On gengxu Sheng\'s nephew, campaign military envoy Wang Bi, was made senior general of the Right Majestic Guard.',
    idiomatic: 'On gengxu Wang Bi, Sheng\'s nephew, became a Right Majestic Guard senior general.',
  },
  s0765: {
    literal: 'On xinhai Hedong Ma Sui came to court.',
    idiomatic: 'On xinhai Ma Sui arrived from Hedong.',
  },
  s0766: {
    literal: 'At the time the Tibetan chancellor Shang Jiezan sent the great general Lun Chinje with humble words and thick favors to tell Ma Sui, requesting alliance and good relations between the two states; the emperor suspected insincerity and did not grant it — therefore Sui himself led Lun Chinje to court, greatly stating that the Tibetan chancellor begged alliance and trust could be preserved.',
    idiomatic: 'Tibet\'s chancellor sent Lun Chinje to Ma Sui with offers of peace; the emperor doubted them until Sui brought the envoy to court vouching for Tibetan sincerity.',
  },
  s0767: {
    literal: 'The emperor then followed this and permitted alliance at Pingliang.',
    idiomatic: 'The emperor agreed to treaty at Pingliang.',
  },
  s0768: {
    literal: 'Summer, fourth month, gengshen, an edict stated: "Though Tibetan raiders have withdrawn, the frontier still gives concern; policies to settle the border must have sound plans — let regular-attendance officials each state border affairs and submit sealed memorials as they see fit."',
    idiomatic: 'In the fourth month officials were invited to submit sealed plans for the frontier.',
  },
  s0769: {
    literal: 'The envoy to Tibet Cui Han memorialized that in Tibet he questioned conscripted laborers and sought the true numbers of Tibetan men and horses — in all fifty-nine thousand-odd men, eighty-six thousand horses; able to fight barely thirty thousand; the rest all old and young.',
    idiomatic: 'Cui Han reported Tibet could field barely thirty thousand men from a host mostly aged or young.',
  },
  s0770: {
    literal: 'On gengwu he held court at Qinde Hall and tested the "Settling Difficulty" music — presented by Ma Sui.',
    idiomatic: 'On gengwu Ma Sui\'s "Settling Difficulty" suite was performed at Qinde Hall.',
  },
  s0771: {
    literal: 'Fifth month, dinghai: Palace Attendant Hun Jian was made Tibet Qingshui alliance commissioner; Minister of War Cui Hanheng was deputy;',
    idiomatic: 'In the fifth month Hun Jian was named treaty commissioner to Tibet at Qingshui with Cui Hanheng as deputy;',
  },
  s0772: {
    literal: 'Jian with Luo Yuanguang led twenty thousand troops to the alliance site.',
    idiomatic: 'he and Luo Yuanguang marched twenty thousand men to the meeting.',
  },
  s0773: {
    literal: 'On dingyou Left Vice Director Chang Yue was made Hunan observation commissioner.',
    idiomatic: 'On dingyou Chang Yue went to Hunan.',
  },
  s0774: {
    literal: 'On wuxu the Left and Right Divine Strategy and Left and Right Dragon Martial each added one general.',
    idiomatic: 'On wuxu each elite guard received an additional general.',
  },
  s0775: {
    literal: 'On bingwu Lingnan military commissioner Du You was made Vice Director of the Right; Rongguan frontier commissioner Li Fu was made Guangzhou prefect and Lingnan military commissioner.',
    idiomatic: 'On bingwu Du You became right vice director; Li Fu took Lingnan.',
  },
  s0776: {
    literal: 'The Tibetan chancellor Shang Jiezan asked to change the alliance site to Tuli Tree in Yuan Prefecture; Divine Strategy general Ma Youlin memorialized: "Tuli ground has many narrows — fear Tibetan troops in ambush;',
    idiomatic: 'Tibet asked to meet at Tuli Tree; Ma Youlin warned of ambush in the ravines;',
  },
  s0777: {
    literal: 'better Pingliang River — its ground is level and it is near Jing Prefecture."',
    idiomatic: 'and urged the open ground of Pingliang near Jingzhou."',
  },
  s0778: {
    literal: 'The alliance was then changed to Pingliang River.',
    idiomatic: 'The court moved the conference to Pingliang.',
  },
  s0779: {
    literal: 'Tenth month: the eastern capital, Henan, Jiangling, Bianzhou, and Yangzhou suffered great flood; people\'s houses were swept away.',
    idiomatic: 'In the tenth month floods wrecked Luoyang, the Henan towns, Jiangling, Bian, and Yangzhou.',
  },
  s0780: {
    literal: 'Intercalary month, yimao: Director of Studies Pei Zhou was made Tanzhou prefect and Hunan observation commissioner.',
    idiomatic: 'In the intercalary month Pei Zhou became Hunan commissioner.',
  },
  s0781: {
    literal: 'On wuwu Shan-Guo Li Bi presented auspicious wheat — one stalk, five ears.',
    idiomatic: 'On wuwu Li Bi sent up five-eared wheat as an omen.',
  },
  s0782: {
    literal: 'On gengshen an edict reduced prefectural and county staff: upper prefectures were to retain one senior aide, registrar, adjutant, revenue clerk, and clerk each; middle prefectures one senior aide, registrar, adjutant, revenue clerk, and militia clerk each; lower prefectures one senior aide, registrar, and revenue clerk each; the two metropolitan prefectures\' registrars, judges, and four red counties\' assistants, recorders, and magistrates were to retain half in measure; all red metropolitan counties were to retain one magistrate, assistant, and magistrate\'s aide each.',
    idiomatic: 'On gengshen Zhang Yanshang\'s staff cuts trimmed every prefecture and half the capital bureaucracy to fund the Tibetan war.',
  },
  s0783: {
    literal: 'At the time Chancellor Zhang Yanshang requested reducing officials and taking salary to aid the army in attacking Tibet for this reason.',
    idiomatic: 'The reductions were meant to pay for campaigns against Tibet.',
  },
  s0784: {
    literal: 'On renxu the sun had a black halo; from chen to shen it only then dispersed.',
    idiomatic: 'On renxu a solar halo lasted from morning to mid-afternoon.',
  },
  s0785: {
    literal: 'On guihai Jingnan military commissioner, acting Minister of Revenue, Heir Apparent of Cao Wang Gao was made Xiangzhou prefect, Shannan East Circuit military commissioner, and observation commissioner for Xiang, Deng, Ying, An, Sui, and Tang; Shannan East military commissioner Fan Ze was made Jiangling prefect and Jingnan military commissioner.',
    idiomatic: 'On guihai Wang Gao took the Han River command; Fan Ze took Jingnan.',
  },
  s0786: {
    literal: 'On xinwei Palace Attendant Hun Jian allied with Tibetan chancellor Shang Jiezan at Pingliang; he was seized by Tibetan troops — Jian fled in disarray yet escaped; Cui Hanheng and subordinate generals and officials lost below — more than sixty persons.',
    idiomatic: 'On xinwei Tibet ambushed the Pingliang treaty; Jian escaped but sixty officers including Cui Hanheng were taken.',
  },
  s0787: {
    literal: 'On guiyou an envoy was sent bearing a letter to reproach Jiezan; the Tibetan border did not accept it.',
    idiomatic: 'On guiyou a reproach reached Jiezan; Tibet refused the letter.',
  },
  s0788: {
    literal: 'On wuyin the Broom Star fell in Xu and Wei.',
    idiomatic: 'On wuyin a comet fell in the Xu–Wei lodges.',
  },
  s0789: {
    literal: 'On xinsi Junior Chamberlain Lu Yue was made Shan-Guo observation commissioner.',
    idiomatic: 'On xinsi Lu Yue became Shan-Guo commissioner.',
  },
  s0790: {
    literal: 'That month Venus was seen in daylight for more than forty days.',
    idiomatic: 'Venus shone by day for forty days that month.',
  },
  s0791: {
    literal: 'Sixth month, bingxu: acting Grand Master of the Court and Palace Attendant Ma Sui was made Grand Master of the Court concurrent Palace Attendant — because he had praised the Tibetan alliance and lost strategy, military power was removed.',
    idiomatic: 'In the sixth month Ma Sui was promoted in title but stripped of command for misjudging the Tibetan peace.',
  },
  s0792: {
    literal: 'Shan-Guo observation commissioner Li Bi was made Secretariat Vice Director and Grand Secretariat Associate; Left Dragon Martial general Li Ziliang was made acting Minister of Works, Taiyuan prefect, and Hedong military commissioner.',
    idiomatic: 'Li Bi entered the chancellery; Li Ziliang took Hedong.',
  },
  s0793: {
    literal: 'On yisi Zhexi observation commissioner Bai Zhizhen died.',
    idiomatic: 'On yisi Bai Zhizhen of Zhexi died.',
  },
  s0794: {
    literal: 'That month Tibet drove the residents of Yan and Xia prefectures, burned their prefectural cities, and departed.',
    idiomatic: 'That month Tibet depopulated Yan and Xia and burned the towns.',
  },
  s0795: {
    literal: 'Seventh month, jiayin: Hun Jian came from the alliance site, wore plain dress awaiting punishment, and was released.',
    idiomatic: 'In the seventh month Jian returned from Pingliang in mourning dress and was forgiven.',
  },
  s0796: {
    literal: 'On yimao an edict stated: "We lately because of raising armies and preparing the border, funds were insufficient, and therefore provisionally discussed reducing officials to gather affairs together.',
    idiomatic: 'On yimao an edict said: "To pay for defense I cut the bureaucracy.',
  },
  s0797: {
    literal: 'Recently We hear that those granted office have all gone to their posts with documents, supporting the old and leading the young, whole households on the road.',
    idiomatic: 'Men had already taken up posts and moved their families;',
  },
  s0798: {
    literal: 'salaries not yet requested, nowhere to return — the plight of the official class, where are they to lodge?',
    idiomatic: 'salaries unpaid, with nowhere to turn — officials were stranded on the road.',
  },
  s0799: {
    literal: 'The officials reduced in the prior edict are all to be as before."',
    idiomatic: 'All posts cut by the prior edict are restored."',
  },
  s0800: {
    literal: 'At first, when staff was reduced, inner and outer circles complained against Zhang Yanshang.',
    idiomatic: 'The cuts had made Zhang Yanshang hated throughout the court.',
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
if (data.metadata.chapter !== '012') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 012; standalone T ready (${Object.keys(T).length} entries).`
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
