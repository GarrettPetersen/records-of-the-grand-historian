#!/usr/bin/env node
/** Batch 7: s0601–s0700 (Jiutangshu ch.012, Dezong 1 — famine edicts, Li Huai'ang ended, Zhenyuan 1–2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/012.json';
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
    literal: 'On renwu Minister of Works Jia Dan was additionally made Censor-in-Chief, eastern capital protector, and metropolitan prefect of the capital region and Ruzhou defense commissioner; Bianzhou prefect Xue Jue was made Henan prefect.',
    idiomatic: 'On renwu Jia Dan became censor-in-chief and Luoyang protector; Xue Jue became Henan prefect.',
  },
  s0602: {
    literal: 'On xinmao Left Golden Guards grand general Wei Gao was made acting Minister of Revenue, concurrent Chengdu prefect, censor-in-chief, and Jiannan West Circuit military observation commissioner.',
    idiomatic: 'On xinmao Wei Gao was sent to Chengdu as commissioner of Jiannan West with revenue duties.',
  },
  s0603: {
    literal: 'Director of the National University Dong Jin was made grand general of the Left Golden Guards.',
    idiomatic: 'Dong Jin, director of the National University, became a Left Golden Guards grand general.',
  },
  s0604: {
    literal: 'Zhu Tao of Youzhou died; he was posthumously made Grand Master of the Court.',
    idiomatic: 'Zhu Tao of Youzhou died and was posthumously ennobled as grand master of the court.',
  },
  s0605: {
    literal: 'Autumn, seventh month, jiawu new moon: Hedong military commissioner Ma Sui came to court from the Hezhong campaign headquarters.',
    idiomatic: 'On the seventh month\'s new moon Ma Sui left the Hezhong front for audience.',
  },
  s0606: {
    literal: 'On gengzi great wind uprooted trees.',
    idiomatic: 'On gengzi a gale uprooted trees.',
  },
  s0607: {
    literal: 'On xinchou Left Regular Attendant Li Bi was made Shanzhou chief administrator and Shan-Guo metropolitan defense, observation, and land transport commissioner.',
    idiomatic: 'On xinchou Li Bi became Shanzhou commissioner overseeing Shan and Guo transport.',
  },
  s0608: {
    literal: 'On bingwu Zhenhai Army and Zhejiang East and West military commissioner Han Huang was made acting Minister of the Left, Grand Secretariat Associate, and Jiang-Huai transport commissioner; Henan prefect Xue Jue was made Henan water-and-land transport commissioner.',
    idiomatic: 'On bingwu Han Huang entered the chancellery and took Jiang-Huai transport; Xue Jue oversaw Henan shipping.',
  },
  s0609: {
    literal: 'On wushen Ma Sui returned to the campaign headquarters.',
    idiomatic: 'On wushen Ma Sui marched back to the front.',
  },
  s0610: {
    literal: 'On xinhai acting Minister of Works Wang Shizhen was advanced to De-Di regimental training and observation commissioner.',
    idiomatic: 'On xinhai Wang Shizhen became commissioner of De and Di.',
  },
  s0611: {
    literal: 'On renzi former Zhuo prefect and concurrent Vice Censor-in-Chief Liu Zheng was made Youzhou chief administrator, censor-in-chief, Youzhou-Lulong deputy military commissioner, concurrently managing circuit administration, revenue, garrison-farming, observation, commissioner for Xi and Khitan, and Lulong frontier commissioner.',
    idiomatic: 'On renzi Liu Zheng was installed at Youzhou as Lulong deputy with full civil and frontier powers.',
  },
  s0612: {
    literal: 'On dingsi Left Regular Attendant Liu Hun was made Vice Minister of War.',
    idiomatic: 'On dingsi Liu Hun became vice minister of war.',
  },
  s0613: {
    literal: 'On gengshen Remonstrance Bureau Grandee Gao Can was made Secretariat Drafter.',
    idiomatic: 'On gengshen Gao Can became a secretariat drafter.',
  },
  s0614: {
    literal: 'In Guanzhong locusts ate grass and trees to the last; drought was extreme; the Ba River nearly dried; most wells had no water.',
    idiomatic: 'Locusts stripped Guanzhong bare; the Ba River shrank to a trickle and wells ran dry.',
  },
  s0615: {
    literal: 'The relevant offices calculated revenue funds and grain — enough to last only seventy days.',
    idiomatic: 'Treasury clerks reckoned stores would last seventy days.',
  },
  s0616: {
    literal: 'On jiazi an edict stated: "When human affairs fail below, Heaven\'s signs take form above; the arising of omens of blame must have their cause.',
    idiomatic: 'On jiazi an edict declared: "When rule fails below, Heaven warns above.',
  },
  s0617: {
    literal: 'From recent times disasters have repeatedly gathered; rain has not fallen through three seasons; locusts have followed, filling a thousand li.',
    idiomatic: 'Disasters have piled up: three seasons without rain and locusts across a thousand li.',
  },
  s0618: {
    literal: 'Grain and millet soar in price; crops wither; the people cry out in the fields — to speak of this truly cuts to pain.',
    idiomatic: 'Grain prices soared, fields withered, and farmers wept in the furrows.',
  },
  s0619: {
    literal: 'Praying to the hundred spirits everywhere, yet no response was obtained — only then did We realize prayer is not the art of relieving disaster, and words are not the sincerity of apologizing for reproof.',
    idiomatic: 'Prayers to every god went unanswered — I saw that ritual alone would not end the famine.',
  },
  s0620: {
    literal: 'Our heart anxious as if burning, We deeply reproach Ourselves.',
    idiomatic: 'My heart burns with shame.',
  },
  s0621: {
    literal: 'Could it be that punishments are perverse?',
    idiomatic: 'Have punishments been unjust?',
  },
  s0622: {
    literal: 'The loyal and good are stifled; harsh levies are not remitted; weary armies know no rest.',
    idiomatic: 'Have the loyal been blocked, taxes left heavy, and armies kept on campaign without cease?',
  },
  s0623: {
    literal: 'Matters may be without benefit yet repeatedly made vexatious expense;',
    idiomatic: 'Have useless offices drained the treasury?',
  },
  s0624: {
    literal: 'appointments may be unfitting yet they wantonly spread harm like locusts.',
    idiomatic: 'Have unfit men preyed on the people like locusts?',
  },
  s0625: {
    literal: 'If there is one of these, it is enough to wound harmonious qi.',
    idiomatic: 'Any one of these would break Heaven\'s harmony.',
  },
  s0626: {
    literal: 'Tracing its source, the guilt truly lies in Us; what crime have the myriad people, that they again suffer famine and death?',
    idiomatic: 'The fault is mine; the people are innocent yet starve.',
  },
  s0627: {
    literal: 'What is fitting is to leave the palace for humbled meals, economize expenditures and ease punishments, turn the body to increase cultivation, and with care heed Heaven\'s warning.',
    idiomatic: 'I must eat sparingly, spend less, judge more gently, and mend my rule.',
  },
  s0628: {
    literal: 'We from now on hold court but do not use the main hall; the authorities\' provisions for Our meals should all be reduced; unurgent affairs are entirely to be stopped.',
    idiomatic: 'I will hold audience outside the main hall, cut the palace kitchen, and halt all nonessential business.',
  },
  s0629: {
    literal: 'Apart from army soldiers, for all persons receiving grain rations and every category of expense, the heads of the relevant office and commissioner are to consult and reduce or stop them to relieve famine.',
    idiomatic: 'Every office that feeds retainers must slash rations except for troops in the field.',
  },
  s0630: {
    literal: 'When the year is abundantly harvested, then order restoration to the old.',
    idiomatic: 'When harvest returns, old allowances may be restored.',
  },
  s0631: {
    literal: '」 On jiazi Li Huai\'ang\'s great general Wei Gui surrendered Jiaoli Fort.',
    idiomatic: 'Thus ended the edict. On jiazi Wei Gui surrendered Jiaoli Fort to the court.',
  },
  s0632: {
    literal: 'On dingmao Huai\'ang\'s general Xu Tingguang surrendered with six thousand men of Changchun Palace.',
    idiomatic: 'On dingmao Xu Tingguang brought six thousand men out of Changchun Palace.',
  },
  s0633: {
    literal: 'On jiaxu Shuofang great general Niu Mingjun beheaded Li Huai\'ang and sent the head to the palace gate.',
    idiomatic: 'On jiaxu Niu Mingjun killed Li Huai\'ang and sent his head to the capital.',
  },
  s0634: {
    literal: 'Ma Sui recovered Hezhong.',
    idiomatic: 'Ma Sui retook Hezhong.',
  },
  s0635: {
    literal: 'On dingchou rain began at last.',
    idiomatic: 'On dingchou rain finally fell.',
  },
  s0636: {
    literal: 'On jimao an edict stated: "Our sincerity has not been displayed; Our comforting rule has been improper, causing meritorious ministers to fall into execution — to call this conquering the enemy, how could We not feel shame in Our heart!',
    idiomatic: 'On jimao an edict said: "My failures of trust brought loyal men to ruin — how can I claim victory without shame?',
  },
  s0637: {
    literal: 'Yet as to Huai\'ang\'s whole household, in law there is no sparing;',
    idiomatic: 'By law Huai\'ang\'s house deserved extinction;',
  },
  s0638: {
    literal: 'remembering that he once stood among generals and chancellors and was once entrusted with Our inmost heart.',
    idiomatic: 'yet he had once been my chief minister and confidant.',
  },
  s0639: {
    literal: 'Though guilt is entered in the penal code, merit is already stored in the imperial repository.',
    idiomatic: 'His crimes were recorded, but so were his deeds.',
  },
  s0640: {
    literal: 'For traces of violating discipline, it is fitting indeed to extinguish the person;',
    idiomatic: 'Treason warranted death;',
  },
  s0641: {
    literal: 'for merit in rushing to difficulty, there ought to be descendants.',
    idiomatic: 'his service at Fengtian deserved an heir.',
  },
  s0642: {
    literal: 'Let one of Huai\'ang\'s sons be made heir; grant each one estate and mansion.',
    idiomatic: 'One son shall inherit; each shall receive a house and estate.',
  },
  s0643: {
    literal: 'Still return Huai\'ang\'s corpse and let them bury it as they will.',
    idiomatic: 'His body shall be returned for burial.',
  },
  s0644: {
    literal: 'Huai\'ang\'s wife and all sons and daughters are to be sent in turn to Lizhou and entrusted to Li Gao to settle as convenient, that they may survive.',
    idiomatic: 'Wife and children go to Lizhou under Li Gao\'s care so they may live.',
  },
  s0645: {
    literal: 'Married daughters and all relatives are to be released.',
    idiomatic: 'Married daughters and kin are freed.',
  },
  s0646: {
    literal: 'Soldiers who fell into rebel hands are all to be cleared together.',
    idiomatic: 'Every soldier forced into rebellion is pardoned.',
  },
  s0647: {
    literal: 'The people of Hezhong and Jiang are granted tax relief for one year.',
    idiomatic: 'Hezhong and Jiang receive a year\'s tax remission.',
  },
  s0648: {
    literal: 'Prince of Beiping Ma Sui and Prince of Xianning Hun Jian are each granted one son a regular fifth-rank office.',
    idiomatic: 'Ma Sui and Hun Jian each receive a fifth-rank post for a son.',
  },
  s0649: {
    literal: 'Sui may be Palace Attendant; Jian may be acting Minister of Works.',
    idiomatic: 'Sui becomes palace attendant; Jian acting minister of works.',
  },
  s0650: {
    literal: 'Luo Yuanguang, Han Yougui, and Tang Chaochen are each granted two hundred households of substantive fief and one son a regular sixth-rank office.',
    idiomatic: 'Luo Yuanguang, Han Yougui, and Tang Chaochen gain fiefs and sixth-rank posts for their sons.',
  },
  s0651: {
    literal: 'The Hezhong campaign soldiers of yesterday are together granted two hundred thousand bolts of silk for feast rewards and released to their home circuits."',
    idiomatic: 'Yesterday\'s Hezhong army receives two hundred thousand bolts of silk and marches home."',
  },
  s0652: {
    literal: 'The newly appointed Secretariat Vice Director and Grand Secretariat Associate Zhang Yanshang was made Minister of the Left.',
    idiomatic: 'Zhang Yanshang, newly made chancellor, was shifted to minister of the left.',
  },
  s0653: {
    literal: 'At the time Chancellor Liu Congyi was ill; an edict summoned Yanshang.',
    idiomatic: 'Liu Congyi lay ill and Yanshang was recalled to court.',
  },
  s0654: {
    literal: 'Li Sheng had a rift with Yanshang and from Fengxiang submitted a memorial arguing the point.',
    idiomatic: 'Li Sheng, feuding with Yanshang, memorialized from Fengxiang against him.',
  },
  s0655: {
    literal: 'Yanshang left his western Sichuan command and returned; reaching Xingyuan he was reassigned Left Vice Director.',
    idiomatic: 'Yanshang was demoted to left vice director while still en route from Sichuan.',
  },
  s0656: {
    literal: 'On wuzi former Heyang military commissioner, acting Minister of the Left, Prince of Kaiyang Li Qi died.',
    idiomatic: 'On wuzi Li Qi, former Heyang commissioner and Prince of Kaiyang, died.',
  },
  s0657: {
    literal: 'Ninth month, jihai: Youzhou commissioner Liu Zheng fell ill and asked that his son Ji be allowed to act as temporary administrator of the army and prefecture; it was granted.',
    idiomatic: 'In the ninth month Liu Zheng, dying at Youzhou, had his son Ji made acting commander.',
  },
  s0658: {
    literal: 'On guimao Niu Mingjun was made Danzhou prefect.',
    idiomatic: 'On guimao Niu Mingjun became prefect of Danzhou.',
  },
  s0659: {
    literal: 'Censor-in-Chief Cui Zong memorialized: "Per regulation, collate inner and outer officials, consult on consolidation and reduction, and report in detail for imperial hearing."',
    idiomatic: 'Cui Zong reported on the edict to cut redundant offices throughout the bureaucracy.',
  },
  s0660: {
    literal: 'We submit that with arms not yet stilled, advancement in office is quite numerous; those in office should in principle advance in order, and those with merit also receive rewards.',
    idiomatic: 'War still rages and promotions abound; men in post expect advancement and the meritorious expect reward.',
  },
  s0661: {
    literal: 'In recent times at every selection gathering it has been impossible to avoid holding vacancies and retaining men; We have sighed over lost talent yet still provoked resentment.',
    idiomatic: 'Each selection season we hold posts open and still hear complaint.',
  },
  s0662: {
    literal: 'Moreover there is a gracious edict recording merit; circuits report preferment — the numbers are very broad; disposition is needed now and cannot be delayed.',
    idiomatic: 'A new edict honors campaign merit across every circuit — thousands await appointment now.',
  },
  s0663: {
    literal: 'If offices are now stopped and reduced, We truly fear it is not convenient to affairs — not only will those receiving preferment have no office to grant, but also those advancing in order will have no path to fit; what was meant to ease people instead gathers resentment.',
    idiomatic: 'Cutting posts now would leave heroes without seats and anger the army — the cure would breed resentment.',
  },
  s0664: {
    literal: 'Matters should follow the old practice to suit the time; wait until affairs are pacified, then plan regulation.',
    idiomatic: 'Keep the old establishment until peace returns, then reform."',
  },
  s0665: {
    literal: 'The decree followed this.',
    idiomatic: 'The emperor agreed.',
  },
  s0666: {
    literal: 'On yisi the emperor held court in the main hall and examined candidates of the three categories: Worthy and Good in Square Uprightness, and those able to remonstrate with extreme directness.',
    idiomatic: 'On yisi he examined civil-service candidates in three categories of frank counsel in the main hall.',
  },
  s0667: {
    literal: 'On xinhai Chancellor Liu Congyi, citing illness, resigned his post and was given the Ministry of Revenue.',
    idiomatic: 'On xinhai Liu Congyi resigned the chancellery for the revenue ministry.',
  },
  s0668: {
    literal: 'On gengshen Liu Congyi died.',
    idiomatic: 'On gengshen the former chancellor Liu Congyi died.',
  },
  s0669: {
    literal: 'Youzhou military commissioner Liu Zheng died.',
    idiomatic: 'Liu Zheng of Youzhou died.',
  },
  s0670: {
    literal: 'On xinsi Liu Ji, acting administrator of the Youzhou-Lulong military government, was made Youzhou chief administrator, concurrent censor-in-chief, Youzhou-Lulong military observation commissioner, and commissioner for Xi, Khitan, and the two frontier peoples.',
    idiomatic: 'On xinsi Liu Ji succeeded his father as Lulong commissioner with full titles.',
  },
  s0671: {
    literal: 'On bingxu Hun Jian came to court from Hezhong.',
    idiomatic: 'On bingxu Hun Jian arrived from Hezhong for audience.',
  },
  s0672: {
    literal: 'Eleventh month, guisi new moon: Shannan Yan Zhen came to court.',
    idiomatic: 'On the eleventh month\'s new moon Yan Zhen of Shannan came to court.',
  },
  s0673: {
    literal: 'On guimao the emperor personally sacrificed to the Lord on High at the Round Mound.',
    idiomatic: 'On guimao the emperor offered to Heaven at the Round Altar.',
  },
  s0674: {
    literal: 'At the time Hun Jian of Hezhong, Li Baozhen of Zelu, Yan Zhen of Shannan, Luo Yuanguang of Tong-Hua, Han Yougui of Binning, Tang Chaochen of Yan-Fang, and Kang Rizhi of Fengcheng — great generals — attended the sacrifice.',
    idiomatic: 'Hun Jian, Li Baozhen, Yan Zhen, Luo Yuanguang, Han Yougui, Tang Chaochen, and Kang Rizhi stood the southern rite.',
  },
  s0675: {
    literal: 'When the suburban altar was complete, returning to the palace, he ascended Danfeng Tower and proclaimed a great amnesty for all under Heaven.',
    idiomatic: 'After the rites he proclaimed universal amnesty from Danfeng Tower.',
  },
  s0676: {
    literal: 'On dingchou an edict granted civil and military regular-attendance officials seven million strings of cash in all — because the year was famine-stricken, grain dear, and the official class was in want.',
    idiomatic: 'On dingchou regular officials received seven million strings of cash to ease famine prices.',
  },
  s0677: {
    literal: 'Twelfth month, wuchen: on days when he conducted affairs at Yanying, seven regular-attendance officials were ordered to be introduced to state gains and faults in current policy.',
    idiomatic: 'In the twelfth month he ordered seven officials daily at Yanying audiences to speak on policy.',
  },
  s0678: {
    literal: 'From then on officials advanced in turn; when some did not grasp reason, there was much slander and impeachment, not fitting the occasion — the emperor also treated them indulgently and sent them away.',
    idiomatic: 'Officials then crowded in with petty attacks; the emperor listened and let them go.',
  },
  s0679: {
    literal: 'Zhenyuan 2, spring, first month, renchen new moon: because of famine the New Year audience was suspended — ritual propriety.',
    idiomatic: 'Zhenyuan 2 opened without the New Year audience — famine made it improper.',
  },
  s0680: {
    literal: 'On bingchen an edict stated that because the people hungered, imperial meal expenses were halved; palace women\'s monthly grain ration in all was fifteen hundred shi; Flying Dragon horses\' fodder was halved;',
    idiomatic: 'On bingchen the palace halved the imperial table, cut palace women\'s grain to fifteen hundred shi, and halved fodder for the imperial stud;',
  },
  s0681: {
    literal: 'palace gentlemen censors and concurrent officials were sent out as metropolitan county magistrates.',
    idiomatic: 'censors with concurrent posts were sent out as capital county magistrates.',
  },
  s0682: {
    literal: 'On gengzi great snow; more than a foot on level ground.',
    idiomatic: 'On gengzi snow piled more than a foot deep.',
  },
  s0683: {
    literal: 'On renyin Regular Attendant Liu Zi, Supervising Censor Cui Zao, and Secretariat Drafter Qi Ying were all to keep their original offices and serve as Grand Secretariat Associates.',
    idiomatic: 'On renyin Liu Zi, Cui Zao, and Qi Ying entered the chancellery while keeping their posts.',
  },
  s0684: {
    literal: 'Secretariat Vice Director and Grand Secretariat Associate Lu Han was made Grand Mentor to the Heir Apparent.',
    idiomatic: 'Lu Han left the chancellery for the heir\'s grand mentorship.',
  },
  s0685: {
    literal: 'On dingwei Vice Minister of Rites Bao Fang was made Capital Metropolitan Prefect; metropolitan prefect Han Hui was made Vice Minister of Punishments; National University Director Bao Ji was charged with the Rites Ministry examinations.',
    idiomatic: 'On dingwei Bao Fang became metropolitan prefect, Han Hui vice minister of punishments, and Bao Ji examiner for the civil service.',
  },
  s0686: {
    literal: 'Jiangling junior administrator Li Fu was made Rongzhou prefect and commissioner of that circuit\'s frontier command.',
    idiomatic: 'Li Fu was posted to Rongzhou as frontier commissioner.',
  },
  s0687: {
    literal: 'On guichou Censor-in-Chief Cui Zong was made Vice Director of Personnel.',
    idiomatic: 'On guichou Cui Zong became vice director of personnel.',
  },
  s0688: {
    literal: 'Remonstrance Bureau Grandee, drafter of edicts, Hanlin academician Ji Zhongfu was made Vice Minister of Revenue and charged with the two-tax system; Yuan Xiu was charged with salt and iron and wine monopoly on all circuits.',
    idiomatic: 'Ji Zhongfu took the two-tax portfolio; Yuan Xiu took salt, iron, and wine monopolies.',
  },
  s0689: {
    literal: 'An edict assigned Chancellor Qi Ying to judge the War Ministry, Li Mian the Punishments Ministry, Liu Zi the Personnel and Rites ministries, and Cui Zao the Revenue and Works ministries.',
    idiomatic: 'Chancellors were assigned to head ministries: Qi Ying war, Li Mian punishments, Liu Zi personnel and rites, Cui Zao revenue and works.',
  },
  s0690: {
    literal: 'On jiayin an edict stated: two-tax money and goods throughout the empire are entrusted to each circuit\'s observation commissioner and prefect to send persons to deliver to the capital;',
    idiomatic: 'On jiayin the two-tax revenues were ordered delivered by each circuit\'s commissioner and prefect;',
  },
  s0691: {
    literal: 'the previously established circuit water-and-land transport commissioners, revenue inspection offices, and Jiang-Huai transport commissioners were all stopped.',
    idiomatic: 'and the old transport and inspection posts were abolished.',
  },
  s0692: {
    literal: 'At the time Cui Zao monopolized government; he changed money and grain affairs — duties mostly collapsed in failure;',
    idiomatic: 'Cui Zao\'s monopoly on power wrecked fiscal administration;',
  },
  s0693: {
    literal: 'Zao soon returned home with worry and illness.',
    idiomatic: 'and he soon left office, ill with anxiety.',
  },
  s0694: {
    literal: 'Second month, guihai: Shannan Fan Ze memorialized defeating five thousand of Xilie\'s general Du Wenchao\'s forces and capturing Wenchao for presentation.',
    idiomatic: 'In the second month Fan Ze reported capturing Du Wenchao and five thousand men.',
  },
  s0695: {
    literal: 'On yichou a deer entered Hanyuan Hall; guards seized it.',
    idiomatic: 'On yichou a deer wandered into Hanyuan Hall and was caught.',
  },
  s0696: {
    literal: 'On jiaxu Vice Minister of Revenue Yuan Xiu was made Minister of the Left; Capital Metropolitan junior administrator Li Song was made Vice Minister of Revenue and charged with salt, iron, and wine monopoly.',
    idiomatic: 'On jiaxu Yuan Xiu became left minister and Li Song took the salt and wine portfolios.',
  },
  s0697: {
    literal: 'Third month, renyin: Li Cheng of Huazhou memorialized defeating Xilie\'s forces at Zhengzhou.',
    idiomatic: 'In the third month Li Cheng reported a victory over Xilie at Zhengzhou.',
  },
  s0698: {
    literal: 'On yisi Director of Agriculture Li Mo was made Qianzhong observation commissioner.',
    idiomatic: 'On yisi Li Mo became Qianzhong commissioner.',
  },
  s0699: {
    literal: 'Fourth month, bingyin: Huaixi Li Xilie was killed by his牙將 Chen Xianqi, who also executed his wife and children; Xianqi brought Huaixi to submission.',
    idiomatic: 'In the fourth month Li Xilie was slain by his officer Chen Xianqi, who killed the family and surrendered Huaixi.',
  },
  s0700: {
    literal: 'On wuchen former Qianzhong observation commissioner Yuan Quanrou was made Hunan observation commissioner.',
    idiomatic: 'On wuchen Yuan Quanrou was sent to Hunan.',
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
