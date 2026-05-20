#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.020, Zhaozong annals) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/020.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 1;
const END = 100;

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
  s0001: {
    literal: 'Emperor Zhaozong, posthumous title Shengmu Jingwen Xiaoxiao, taboo name Ye, was Yizong\'s seventh son; his mother was Empress Hui\'an, née Wang.',
    idiomatic: 'Zhaozong—taboo Ye—was Yizong\'s seventh son, born of Empress Hui\'an Wang.',
  },
  s0002: {
    literal: 'On the twenty-second day of the second month of Xiantong 8 he was born in the Eastern Inner Palace.',
    idiomatic: 'He was born in the Eastern Palace on Xiantong 8\'s second-month twenty-second.',
  },
  s0003: {
    literal: 'In the fourth month of the thirteenth year he was enfeoffed as Prince of Shou; his name was Jie.',
    idiomatic: 'In the fourth month of year thirteen he became Prince of Shou, born Jie.',
  },
  s0004: {
    literal: 'In the fourth year of Qianfu he was appointed Grand Preceptor of the Palace with the ceremonial of the Three Excellencies, Grand Governor of Youzhou, military commissioner of Youzhou and Lulong and other circuits, commissioner over the Xi and Khitan, and commissioner for observation and disposition within the circuit.',
    idiomatic: 'In Qianfu 4 he received Grand Preceptor of the Palace with Three Excellencies honors, Youzhou grand governor, and the Lulong military commission with Xi–Khitan and circuit oversight.',
  },
  s0005: {
    literal: 'To Emperor Xizong he was a younger brother by the same mother, and they were especially close.',
    idiomatic: 'He and Xizong shared a mother and were especially close.',
  },
  s0006: {
    literal: 'From the time hardship drove the court into exile he had often attended at the emperor\'s side; those who held the keys of military power all regarded him as extraordinary and cherished him.',
    idiomatic: 'Through the exile years he stayed at Xizong\'s side; commanders of the armies all prized him.',
  },
  s0007: {
    literal: 'In the first year of Wende, in the second month of the first year of Wende, Xizong was suddenly taken ill.',
    idiomatic: 'In Wende 1, second month, Xizong fell suddenly ill.',
  },
  s0008: {
    literal: 'The palace had only just been restored and all hearts were turned toward it; word of sudden illness spread at once, and soldiers and civilians were struck with alarm.',
    idiomatic: 'The palace had barely been restored when sudden illness spread alarm through army and city.',
  },
  s0009: {
    literal: 'On the night he grew critically ill, it was still unknown who would be enthroned.',
    idiomatic: 'On the night of his crisis, the succession was still unsettled.',
  },
  s0010: {
    literal: 'The ministers held that Prince Ji was the most worthy and ranked above Prince Shou; they were about to install him, but only Army Commander Yang Fugong asked that Prince Shou supervise the state as regent.',
    idiomatic: 'Ministers favored the worthy Prince Ji, who outranked Prince Shou, but Army Commander Yang Fugong insisted Prince Shou act as regent.',
  },
  s0011: {
    literal: 'On the sixth day of the third month the testamentary edict proclaimed him Imperial Younger Brother and heir.',
    idiomatic: 'On the third month\'s sixth the testament named him heir as Imperial Younger Brother.',
  },
  s0012: {
    literal: 'On the eighth day he took the throne before the coffin; he was twenty-two.',
    idiomatic: 'He acceded before the bier on the eighth; he was twenty-two.',
  },
  s0013: {
    literal: 'The Minister of Works Wei Zhaodu served as acting Grand Minister.',
    idiomatic: 'Wei Zhaodu of the Works Ministry acted as Grand Minister.',
  },
  s0014: {
    literal: 'On the day jichou he received the ministers; he began to hear government.',
    idiomatic: 'On jichou he met the court and began to rule.',
  },
  s0015: {
    literal: 'The emperor was skilled at writing and loved literature, especially valued Confucian learning, bore a heroic and handsome air, and retained something of the Huichang legacy.',
    idiomatic: 'He wrote well, loved letters, honored Confucian learning, and carried Huichang\'s martial bearing.',
  },
  s0016: {
    literal: 'Because the previous reign\'s martial prestige had waned and the dynastic mandate had grown faint, he honored great ministers and widely sought men of the Way, intending to restore the old enterprise and command the realm.',
    idiomatic: 'Seeing Tang\'s might fade, he honored ministers and sought scholars, aiming to revive the dynasty and command the realm.',
  },
  s0017: {
    literal: 'At the beginning of his accession court and countryside alike praised him.',
    idiomatic: 'At his accession court and country praised him.',
  },
  s0018: {
    literal: 'On the first day of the fourth month, wuchen, the new moon.',
    idiomatic: 'Fourth month, wuchen new moon.',
  },
  s0019: {
    literal: 'On gengwu the sacred mother Empress Hui\'an was posthumously titled Gongxian.',
    idiomatic: 'On gengwu Empress Hui\'an was posthumously titled Gongxian.',
  },
  s0020: {
    literal: 'On yihai Zhang Quanyi, Intendant of Henan, attacked Li Hanzhi at Heyang with troops; Hanzhi fled and held Ze Prefecture.',
    idiomatic: 'On yihai Henan Intendant Zhang Quanyi attacked Li Hanzhi at Heyang; Hanzhi withdrew to Zezhou.',
  },
  s0021: {
    literal: 'The Weibo headquarters guard killed their commander Yue Zhen at Longxing Temple and also struck Yue Congxun, defeating him.',
    idiomatic: 'Weibo guards killed commander Yue Zhen at Longxing Temple and routed Yue Congxun.',
  },
  s0022: {
    literal: 'Congxun held Huan River with his shattered troops; Luo Zongbian seized the city and killed him.',
    idiomatic: 'Congxun held Huan River with remnants until Luo Zongbian took the city and killed him.',
  },
  s0023: {
    literal: 'On renwu the Cai rebel Sun Ru took Yangzhou; Yang Xingmi broke the encirclement and withdrew to hold Xuan Prefecture.',
    idiomatic: 'On renwu Cai rebel Sun Ru took Yangzhou; Yang Xingmi broke out and held Xuanzhou.',
  },
  s0024: {
    literal: 'Sun Ru styled himself Huainan military commissioner and still led his host to attack Xuan Prefecture.',
    idiomatic: 'Sun Ru claimed Huainan and marched on Xuanzhou.',
  },
  s0025: {
    literal: 'On the first day of the fifth month, dingyou, an edict appointed Xuanwu military commissioner, acting Palace Attendant, Prince of Pei Zhu Quanzhong as overall commander of the encircling armies against Cai Prefecture.',
    idiomatic: 'Fifth month dingyou new moon: Zhu Quanzhong of Xuanwu was made overall commander against Cai.',
  },
  s0026: {
    literal: 'After Qin Xian and Shi Fan were defeated the Cai rebels grew weaker; Shi Pu was then under attack from Quanzhong, so Pu\'s overall command was transferred to Quanzhong.',
    idiomatic: 'With Cai weakening after Qin Xian and Shi Fan\'s defeat, Pu\'s command passed to Quanzhong while Pu was under attack.',
  },
  s0027: {
    literal: 'On renyin the Cai rebel general who had falsely been made Jingxiang military commissioner Zhao Dexun sent envoys to submit to the court, offering to attack the rebels to prove loyalty; Dexun was therefore made deputy overall commander of the Cai encirclement, and he placed his Jingxiang troops under Quanzhong.',
    idiomatic: 'On renyin Zhao Dexun, Cai general turned Jingxiang commissioner, submitted and offered service; made deputy commander, he placed Jingxiang troops under Quanzhong.',
  },
  s0028: {
    literal: 'On the first day of the sixth month, dingmao, because the Sichuan rebel Wang Jian had thrown the region into chaos and Chen Jingxuan of Jiannan reported distress, an edict appointed Grand Preceptor of the Palace with the ceremonial of the Three Excellencies, acting Minister of Works, Vice Director of the Chancellery, Associate Grand Councillor, Commissioner of the Grand Pure Palace, University Fellow of the Hongwen Institute, Commissioner of the Extended Resources Store, Supreme Pillar of State, Duke of Fuyang with a fief of two thousand households Wei Zhaodu as acting Minister of Works, Vice Director of the Chancellery, Grand Councillor, concurrent Governor of Chengdu, deputy military commissioner of Jiannan West Circuit knowing circuit affairs, and commissioner for pacification and disposition of the two circuits and other duties.',
    idiomatic: 'Sixth month dingmao new moon: with Wang Jian ravaging Sichuan, Wei Zhaodu was sent west as Grand Councillor and Chengdu governor to pacify Jiannan.',
  },
  s0029: {
    literal: 'The Cai encampment reported a great defeat of the rebels at Longpo and an advance to press the rebel city.',
    idiomatic: 'The Cai front reported crushing the rebels at Longpo and closing on the city.',
  },
  s0030: {
    literal: 'On the first day of the seventh month, bingshen, Ze Prefecture governor Li Hanzhi led Taiyuan troops to attack Heyang, was defeated by Bian commander Ding Hui, and retreated to Gaoping.',
    idiomatic: 'Seventh month bingshen new moon: Li Hanzhi of Zezhou attacked Heyang with Taiyuan troops, was beaten by Ding Hui, and fled to Gaoping.',
  },
  s0031: {
    literal: 'On the fifteenth day of the ninth month, yiwei, Bian commander Zhu Zhen defeated Shi Pu\'s army at Yongqiao, then took Suzhou; from then on Pu held his walls and dared not come out again.',
    idiomatic: 'Ninth month yiwei: Zhu Zhen routed Shi Pu at Yongqiao and took Suzhou; Pu then held his walls.',
  },
  s0032: {
    literal: 'Bian commander Hu Yuancong pressed the attack on Cai Prefecture.',
    idiomatic: 'Hu Yuancong of Bian pressed Cai Prefecture hard.',
  },
  s0033: {
    literal: 'On the first day of the twelfth month, jiazi, Cai Prefecture guard officer Shen Cong seized Qin Zongquan, broke his legs, and begged to surrender.',
    idiomatic: 'Twelfth month jiazi new moon: Cai officer Shen Cong seized Qin Zongquan, broke his legs, and offered surrender.',
  },
  s0034: {
    literal: 'An edict sent a palace envoy to proclaim the order; Cong was at once given acting authority as military commissioner.',
    idiomatic: 'An envoy announced the edict and made Cong acting commissioner.',
  },
  s0035: {
    literal: 'Before the envoy arrived, another officer Guo Fan killed Shen Cong, usurped Zongquan, bound him, and sent him to Bian Prefecture.',
    idiomatic: 'Before the envoy arrived Guo Fan killed Cong, seized Zongquan, and sent him to Bianzhou.',
  },
  s0036: {
    literal: 'Cai, Shen, and Guang prefectures were pacified.',
    idiomatic: 'Cai, Shen, and Guang were pacified.',
  },
  s0037: {
    literal: 'An edict granted the Cai encampment soldiers two hundred fifty thousand strings of cash, ordering the Revenue Bureau to disburse it in the nearest installments.',
    idiomatic: 'The court granted the Cai armies 250,000 strings, to be paid from the nearest treasury.',
  },
  s0038: {
    literal: 'That month Xizong was buried at Jing Mausoleum.',
    idiomatic: 'That month Xizong was buried at Jingling.',
  },
  s0039: {
    literal: 'In the first year of Longji, in the first year of Longji, spring, first month, on the day guisi the new moon, the emperor attended court at Wude Hall to receive congratulations, proclaimed an amnesty edict, and changed the reign era.',
    idiomatic: 'Longji 1, spring, first month guisi new moon: court at Wude Hall, great amnesty, new era.',
  },
  s0040: {
    literal: 'Civil and military officials at court and in the provinces were promoted and enfeoffed in varying degrees.',
    idiomatic: 'Officials at court and in the provinces received graded promotions and fiefs.',
  },
  s0041: {
    literal: 'Jiannan West military commissioner and commissioner for pacification of the two circuits Wei Zhaodu was made acting Minister of Works and Eastern Capital regent;',
    idiomatic: 'Wei Zhaodu of Jiannan West was made acting Minister of Works and Luoyang regent;',
  },
  s0042: {
    literal: 'Hanlin Academician-in-Chief, Vice Minister of War, and drafter of edicts Liu Chongwang was confirmed in office as Associate Grand Councillor;',
    idiomatic: 'Liu Chongwang, Hanlin chief and War vice minister, became Associate Grand Councillor;',
  },
  s0043: {
    literal: 'Vice Minister of Justice Sun Kui was made Intendant of Jingzhao.',
    idiomatic: 'Sun Kui of Justice became Jingzhao Intendant.',
  },
  s0044: {
    literal: 'Second month, guihai new moon.',
    idiomatic: 'Second month opened on guihai.',
  },
  s0045: {
    literal: 'On jichou Bian Prefecture marching chief Li Fan supervised the delivery of the rebel Qin Zongquan and his wife Lady Zhao as captives; the emperor received the prisoners at Yanxi Gate, the hundred officials offered congratulations, they were paraded through the market, reported to the ancestral temple and altars, and beheaded at Duli.',
    idiomatic: 'On jichou Li Fan of Bian delivered Qin Zongquan and Lady Zhao; the emperor took them at Yanxi Gate, paraded and executed them at Duli after rites at temple and altars.',
  },
  s0046: {
    literal: 'Lady Zhao was beaten to death.',
    idiomatic: 'Lady Zhao was flogged to death.',
  },
  s0047: {
    literal: 'Earlier, after the feudal lords recovered Chang\'an, Huang Chao went east out of the pass and joined with Zongquan.',
    idiomatic: 'After the lords recovered Chang\'an, Huang Chao fled east and joined Zongquan.',
  },
  s0048: {
    literal: 'Though the Chao bandits were pacified, Zongquan\'s vicious followers gathered in great numbers, reaching west to Jin, Shang, Shan, and Guo, south to Jing and Xiang, east across the Huai region, and north into Xu, Yan, Bian, and Zheng—several dozen prefectures in extent.',
    idiomatic: 'Though Chao fell, Zongquan\'s bands spread across dozens of prefectures from the west through the Huai to Xu and Yan.',
  },
  s0049: {
    literal: 'For five or six years the people did not plow or weave; in settlements of a thousand households not one or two remained; the year was famine on famine, and all ate human flesh—the cruelty of the devastation was unheard of before.',
    idiomatic: 'Five or six years without farming left thousand-household towns empty; famine drove men to cannibalism on a scale never heard.',
  },
  s0050: {
    literal: 'Once Zongquan was pacified, Zhu Quanzhong maintained a hundred thousand men in continuous warfare, swallowing Henan; between Yan, Yun, Qing, and Xu the bloodshed did not cease—and the Tang mandate was thereby brought to ruin.',
    idiomatic: 'After Zongquan fell, Quanzhong\'s hundred thousand men devoured Henan and bled Yan and Xu until Tang\'s mandate collapsed.',
  },
  s0051: {
    literal: 'The Secretariat memorialized asking that the twenty-second day of the second month be made the Festival of Joyous Assembly; the request was assented to.',
    idiomatic: 'The Secretariat asked to make the second month\'s twenty-second the Festival of Joyous Assembly; the edict was assented to.',
  },
  s0052: {
    literal: 'On the first day of the third month, renchen, Right Vice Director of the Chancellery and Associate Grand Councillor Kong Wei was made acting Minister of Works, Commissioner of the Grand Pure Palace, University Fellow of the Hongwen Institute, Commissioner of the Extended Resources Store, and commissioner of salt and iron transport for all circuits; Right Vice Director Du Rangneng was made Left Vice Director, supervised the national history, and judged Revenue; Vice Director of the Chancellery, Minister of Revenue, and Associate Grand Councillor Zhang Jun was made University Fellow of the Jixian Hall and judged Revenue affairs.',
    idiomatic: 'Third month renchen new moon: Kong Wei took Works and salt transport; Du Rangneng became Left Vice Director with history and Revenue; Zhang Jun took Jixian and Revenue.',
  },
  s0053: {
    literal: 'On the first day of the fourth month, renxu, Zhu Quanzhong, deputy military commissioner of Xuanwu and Huainan and other circuits knowing circuit affairs, commissioner for camp and field observation and disposition within the circuit, Grand Preceptor of the Palace with the ceremonial of the Three Excellencies, acting Grand Tutor, concurrent Palace Attendant, Grand Governor of Yangzhou, prefect of Bian, overall commander of the encircling armies against Cai, Supreme Pillar of State, Prince of Pei with a fief of four thousand households, was made acting Grand Commandant, Director of the Secretariat, advanced to Prince of Dongping, and still granted a reward of one hundred thousand strings for his army.',
    idiomatic: 'Fourth month renxu new moon: Zhu Quanzhong was made Grand Commandant and Director of the Secretariat, advanced to Prince of Dongping, with 100,000 strings for his army.',
  },
  s0054: {
    literal: 'On the first day of the fifth month, renchen, Han Prefecture governor Wang Jian took Chengdu, moved Chen Jingxuan to Ya Prefecture, and styled himself acting military commissioner of Xichuan.',
    idiomatic: 'Fifth month renchen new moon: Wang Jian took Chengdu, exiled Chen Jingxuan to Ya, and claimed Xichuan.',
  },
  s0055: {
    literal: 'Tian Lingzi was again employed as army supervisor.',
    idiomatic: 'Tian Lingzi was restored as army supervisor.',
  },
  s0056: {
    literal: 'On the first day of the sixth month, xinyou, Xing-Min military commissioner Meng Fangli died; the three armies pushed his brother Qian, prefect of Min, as acting commissioner; Taiyuan\'s Li Keyong sent troops to attack.',
    idiomatic: 'Sixth month xinyou new moon: Meng Fangli of Xing-Min died; the army made his brother Qian acting commissioner; Li Keyong attacked.',
  },
  s0057: {
    literal: 'Hang Prefecture prefect Qian Liu attacked Xuan Prefecture, took it, captured Liu Hao, and cut out his heart to sacrifice to Zhou Bao.',
    idiomatic: 'Qian Liu of Hangzhou took Xuanzhou, captured Liu Hao, and sacrificed his heart to Zhou Bao.',
  },
  s0058: {
    literal: 'In the seventh month an edict established the Wusheng Army at Hangzhou and made Liu commissioner for defense and observation of that army.',
    idiomatic: 'Seventh month: Wusheng Army was set up at Hangzhou and Liu made its commissioner.',
  },
  s0059: {
    literal: 'On the first day of the tenth month, jiwei, Qing military commissioner Wang Jingwu died.',
    idiomatic: 'Tenth month jiwei new moon: Wang Jingwu of Qingzhou died.',
  },
  s0060: {
    literal: 'An edict appointed Special Advancement, Junior Tutor to the Heir Apparent, Marquis of Boling with a fief of one thousand households Cui Anqian as acting Grand Tutor, concurrent Palace Attendant, prefect of Qing, military commissioner and observer of Pinglu, and commissioner over the two foreign states Silla and Parhae.',
    idiomatic: 'Cui Anqian was made acting Grand Tutor, Qing prefect, and Pinglu commissioner with charge over Silla and Parhae.',
  },
  s0061: {
    literal: 'Qingzhou\'s three armies had Jingwu\'s son Shifan act as temporary commander of military affairs.',
    idiomatic: 'Qingzhou troops had Shifan act as temporary commander.',
  },
  s0062: {
    literal: 'On the first day of the eleventh month, jichou, rites were to be performed at the Round Mound.',
    idiomatic: 'Eleventh month jichou new moon: rites at the Round Mound were planned.',
  },
  s0063: {
    literal: 'The emperor\'s personal name was changed to Ye.',
    idiomatic: 'His taboo personal name was fixed as Ye.',
  },
  s0064: {
    literal: 'On xinhai the emperor kept vigil at Wude Hall; the chief ministers and hundred officials wore court dress at their posts.',
    idiomatic: 'On xinhai the emperor fasted at Wude Hall; ministers wore court dress.',
  },
  s0065: {
    literal: 'At the time the two army commandants Yang Fugong and the two Palace Secretaries all attended in court dress to serve the emperor; the Erudites of the Court of Rites Qian Hui and Li Chuo and others memorialized, saying: "When the emperor goes to the fasting palace, inner attendants all wear court dress.',
    idiomatic: 'Both army commandants Yang Fugong and both Palace Secretaries attended in court dress; Ritual Erudites Qian Hui and Li Chuo objected: "When the emperor enters the fasting palace, eunuchs wear court dress.',
  },
  s0066: {
    literal: 'Your subjects have examined the dynastic precedents and recent ritual regulations and find no text allowing inner officials court dress to assist at sacrifice."',
    idiomatic: 'We find no precedent or recent statute allowing eunuchs court dress at sacrifice."',
  },
  s0067: {
    literal: '"We humbly consider that Your Majesty, bearing Heaven\'s mandate, with the sacred reign reviving, reverently approaches the ancestral temple and can perform the great rites.',
    idiomatic: '"Your Majesty revives the sacred reign and approaches the ancestral temple in the great rites.',
  },
  s0068: {
    literal: 'All follow the completed institutions of Gaozu and Taizong; you must tread the old canons of Yu, Xia, Shang, and Zhou, setting regalia and robes to follow the constant law."',
    idiomatic: 'This follows Gaozu and Taizong and the ancient canons—regalia must follow the law."',
  },
  s0069: {
    literal: '"The Ritual Office had earlier approved the Grand Ritual Commissioner\'s memorandum stating that the Inner Service had sent a note asking the rank of inner officials\' court dress; the Ritual Office had already replied according to ritual regulations."',
    idiomatic: '"The Ritual Office had answered the Inner Service on eunuchs\' court dress per statute."',
  },
  s0070: {
    literal: '"Now examining recent precedents, if inner officials and guards generals must wear regulated caps and robes, each follows his concurrent regular office and wears that office\'s dress according to rank and formula."',
    idiomatic: '"Recent practice has eunuchs and guard generals wear the dress of their concurrent civil rank."',
  },
  s0071: {
    literal: '"The matter rests on hearsay and may be indulged for the moment, yet it is not clearly set down in ritual regulations."',
    idiomatic: '"That is hearsay indulgence, not clear law."',
  },
  s0072: {
    literal: '"We beg Your Sage Mercy to grant our memorial."',
    idiomatic: '"We beg Your Majesty to grant our memorial."',
  },
  s0073: {
    literal: '"The memorial entered; by evening there was no reply.',
    idiomatic: 'The memorial was filed; by evening no reply came.',
  },
  s0074: {
    literal: 'Qian Hui submitted another memorial, saying: "Your subject today at the si hour submitted a memorial discussing inner officials\' caps and robes; no imperial order has yet been received.',
    idiomatic: 'Qian Hui submitted again: "Today at si hour I discussed eunuchs\' dress; no order has come.',
  },
  s0075: {
    literal: 'We consider that Your Majesty devoutly performs the suburban sacrifice and follows the constant model; every matter of canonical rite must keep to the statutes."',
    idiomatic: 'Your Majesty performs the suburban rites and must keep every canonical matter to statute."',
  },
  s0076: {
    literal: '"Now Your Majesty performs the great rites of the former kings, yet inner attendants then wear the former kings\' regulated robes."',
    idiomatic: '"You perform the former kings\' great rites while eunuchs wear the former kings\' robes."',
  },
  s0077: {
    literal: '"Tomorrow at the presentation to the Great Sage Ancestor your subject will guide the emperor in the rites; if attendants\' dress violates the regulations, that is unritual and profanes the ancestors—your subject expects not to accept the order.',
    idiomatic: '"Tomorrow I guide the presentation; if attendants\' dress breaks rule, I will not accept the order—it profanes the ancestors.',
  },
  s0078: {
    literal: 'Your subject is unworthily placed in this sage age, holding a ritual office; to correct court ceremony, death would not be forgotten; grease and mud are gladly given."',
    idiomatic: 'I hold a ritual office in a sage age; to correct court ceremony I would gladly die."',
  },
  s0079: {
    literal: 'The memorial entered; an edict in vermilion imperial script was issued, saying: "What you have argued is entirely correct; the matter may follow expedient authority.',
    idiomatic: 'The memorial entered; vermilion script replied: "Your argument is correct; expedient authority may apply.',
  },
  s0080: {
    literal: 'Do not let a small flaw obstruct the great rite."',
    idiomatic: 'Do not let a small flaw block the great rite."',
  },
  s0081: {
    literal: 'Thereupon the four inner ministers wore regulated dress to assist at the sacrifice.',
    idiomatic: 'The four inner ministers then wore regulated dress at the rite.',
  },
  s0082: {
    literal: 'On jiayin the Round Mound rites were completed; the emperor took the Gate of Accepting Heaven and proclaimed a great amnesty.',
    idiomatic: 'On jiayin the Round Mound rites ended; at Chengtian Gate he proclaimed great amnesty.',
  },
  s0083: {
    literal: 'On the day wuwu Grand Councillor Du Rangneng was made concurrent Minister of Works.',
    idiomatic: 'On wuwu Du Rangneng was also made Minister of Works.',
  },
  s0084: {
    literal: 'In the first year of Dashun, in the first year of Dashun, spring, first month, on the day wuzi the new moon, the emperor attended court at Wude Hall to receive congratulations.',
    idiomatic: 'Dashun 1, spring, first month wuzi new moon: court at Wude Hall.',
  },
  s0085: {
    literal: 'The chief ministers and hundred officials offered a honorific title: Sage, Cultured, Sagacious, Virtuous, Martial, and Filial Emperor; when the rites were complete a great amnesty was proclaimed and the era was changed to Dashun.',
    idiomatic: 'Ministers offered the honorific Sage, Cultured, Sagacious, Virtuous, Martial, Filial Emperor; rites done, great amnesty, era Dashun.',
  },
  s0086: {
    literal: 'On the day dingsi Grand Councillor and Chancellor of the National University Kong Wei, because Confucius\'s temple had suffered in the military fires and the officials had nowhere to perform the seasonal offering, asked that civil officials from observation commissioners and commissioners down to magistrates and aides contribute ten cash per string from their official salary to repair the National University; the request was assented to.',
    idiomatic: 'On dingsi Kong Wei asked officials from commissioners down to magistrates to tithe ten cash per salary string to rebuild the National University after war burned Confucius\'s temple; the edict was assented to.',
  },
  s0087: {
    literal: 'Xuanwu military commissioner Zhu Quanzhong was advanced to acting Director of the Secretariat with an added fief of one thousand households; the rest unchanged.',
    idiomatic: 'Zhu Quanzhong of Xuanwu was advanced to acting Secretariat Director with 1,000 added households.',
  },
  s0088: {
    literal: 'Taiyuan commander An Jinjun had besieged Xing Prefecture for years; when food in the city was exhausted, Xing-Min observer Meng Qian surrendered the city, and Qian\'s clan was sent to Taiyuan.',
    idiomatic: 'An Jinjun of Taiyuan besieged Xingzhou until Meng Qian surrendered and his clan was sent to Taiyuan.',
  },
  s0089: {
    literal: 'Keyong made his great general An Jian acting Xing-Min commissioner.',
    idiomatic: 'Keyong made An Jian acting Xing-Min commissioner.',
  },
  s0090: {
    literal: 'On the first day of the third month, dinghai, Zhu Quanzhong submitted a memorial: "Among the eastern circuits\' feudal lords, please appoint men of the court\'s renowned virtue as military commissioners and observers.',
    idiomatic: 'Third month dinghai new moon: Zhu Quanzhong memorialized: "Appoint court men of renown as eastern commissioners.',
  },
  s0091: {
    literal: 'If a feudal minister clings to his post and will not yield to replacement, your subject asks to punish him with troops."',
    idiomatic: 'If any refuse replacement, I will punish them by force."',
  },
  s0092: {
    literal: 'Men such as Wang Hui, Pei Zan, Kong Hui, and Cui Anqian are all eminent clans of the gentry, long high in office, and should be used as military commissioners of Xu, Yun, Qing, Yan, and other circuits."',
    idiomatic: 'Wang Hui, Pei Zan, Kong Hui, and Cui Anqian are fit for Xu, Yun, Qing, and Yan."',
  },
  s0093: {
    literal: 'The edict was assented to.',
    idiomatic: 'Assent was given.',
  },
  s0094: {
    literal: 'Zhaoyi military commissioner Li Kexiu died; he was the younger brother of Taiyuan commander Li Keyong; the three armies pushed Kexiu\'s younger brother Ke Gong to know acting commissioner affairs.',
    idiomatic: 'Li Kexiu of Zhaoyi died—Keyong\'s brother; the army made Ke Gong acting commissioner.',
  },
  s0095: {
    literal: 'On the first day of the fourth month, bingchen, Li Keyong sent the great general An Jinjun to lead troops and attack Yun Prefecture.',
    idiomatic: 'Fourth month bingchen new moon: Keyong sent An Jinjun against Yunzhou.',
  },
  s0096: {
    literal: 'Helian Duo sought aid from Youzhou; Li Kuangwei sent troops to rescue him; they fought at Yu Prefecture; the Taiyuan army was greatly defeated and the Yan army seized An Jinjun and presented him to the court.',
    idiomatic: 'Helian Duo called Youzhou; Kuangwei fought at Yuzhou; Taiyuan was crushed and Jinjun was sent to court as captive.',
  },
  s0097: {
    literal: 'Li Kuangwei, Helian Duo, Zhu Quanzhong, and others submitted memorials: "Now that the Shatuo are defeated and ruined, your subject together with the three Hebei circuits and the troops of the circuits your subject commands—Bian, Hua, Heyang—wish to pacify Taiyuan; we ask that the court appoint one high minister to overall command the military affair."',
    idiomatic: 'Kuangwei, Duo, and Quanzhong asked to crush Taiyuan now that Shatuo was broken and begged one chief minister to command.',
  },
  s0098: {
    literal: 'Zhaozong, because Taiyuan at the time of hardship had rendered great merit in restoring the dynasty, was suspicious in his heart and sent the matter for deliberation to officials of the fourth rank and above in the Two Departments, the Censorate, and the Six Ministries.',
    idiomatic: 'Zhaozong, remembering Taiyuan\'s restoration merit, doubted the plan and referred it to fourth-rank officials and above.',
  },
  s0099: {
    literal: 'Only those in Quanzhong\'s faction said he could be attacked; seven tenths opposed; chief ministers Du Rangneng and Liu Chongwang deeply held it impossible.',
    idiomatic: 'Only Quanzhong\'s party favored attack; seven in ten opposed; Du Rangneng and Liu Chongwang strongly dissented.',
  },
  s0100: {
    literal: 'Only Zhang Jun argued, saying: "In the previous reign, when the court twice reached Xingyuan, it was in truth the Shatuo\'s crime."',
    idiomatic: 'Only Zhang Jun argued: "The court\'s double exile to Xingyuan was the Shatuo\'s doing."',
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
