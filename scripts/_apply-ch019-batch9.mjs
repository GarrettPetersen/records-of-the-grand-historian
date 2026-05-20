#!/usr/bin/env node
/** Batch 9: s0801–s0900 (Jiutangshu ch.019, Yizong / Xizong annals) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/019.json';
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
    literal: 'Palace Attendant Supervisor Xue Fan was made Weizhou prefect; Imperial University Vice Director Pei Zhuo was made Yangzhou prefect; Secretariat Drafting Officer Cui Hang was made Vice Minister of Rites; Director of War Pei Qianyu was made Vice Director of the Court of the Imperial Clan.',
    idiomatic: 'Xue Fan, Pei Zhuo, Cui Hang, and Pei Qianyu received new posts.',
  },
  s0802: {
    literal: 'Sixth month: Director of Merit Evaluation Vice Director Xue Mai was made Director of War; Vice Director of Revenue Zheng Jiu was made Merit Evaluation Vice Director; Storehouse Department Vice Director Zheng Zong was made Revenue Vice Director; Guest Reception Vice Director Wang Liao was made Storehouse Vice Director.',
    idiomatic: 'In the sixth month several bureau officers were promoted in rotation.',
  },
  s0803: {
    literal: 'Seventh month: Court of Judicial Review Director Cai Xing was made Fengzhou prefect, Tiande Army metropolitan defense commissioner; Court of Judicial Review Director Zhang Yanyuan was made Court of Judicial Review Director.',
    idiomatic: 'In the seventh month Cai Xing took Tiande; Zhang Yanyuan succeeded at judicial review.',
  },
  s0804: {
    literal: 'Capital Intendant Zhang Ti was made Acting Minister of Revenue, concurrent Yanzhou prefect and censor-in-chief, Tianping Army military commissioner, Yan-Cao-Pu observation commissioner and related posts.',
    idiomatic: 'Zhang Ti left the capital for Tianping at Yanzhou.',
  },
  s0805: {
    literal: 'Left Merit Evaluation Vice Director Du Zhenfu was made Capital Punishments Director; Vice Director of Personnel Niu Xun was made Jinzhou prefect; Director of Seals Vice Director Lu Yinzheng was made Vice Director of Personnel.',
    idiomatic: 'Du Zhenfu, Niu Xun, and Lu Yinzheng received posts.',
  },
  s0806: {
    literal: 'Tenth month: Secretariat Vice Director Li Kuang was made Remonstrance Official.',
    idiomatic: 'In the tenth month Li Kuang became remonstrance official.',
  },
  s0807: {
    literal: 'Former Datong Army and Yun-Shuo metropolitan defense farm and supply commissioner Li Fan was made Acting Left Regular Attendant, Fengzhou prefect, Tiande Army Fengzhou West Middle City metropolitan defense commissioner, commissioner controlling frontier tribes and related posts.',
    idiomatic: 'Li Fan was posted to Tiande defense.',
  },
  s0808: {
    literal: 'Merit Evaluation Vice Director Zhao Yun was made Vice Director of Personnel; Revenue Vice Director Lu Zhuang was made Diarist Vice Director; Rites Vice Director Xiao Yu was made Merit Evaluation Vice Director.',
    idiomatic: 'Zhao Yun, Lu Zhuang, and Xiao Yu exchanged bureau posts.',
  },
  s0809: {
    literal: 'Eleventh month: Diarist Liu Chonggui was made Rites Vice Director; Palace Diarist Kong Lun was made Revenue Vice Director.',
    idiomatic: 'In the eleventh month Liu Chonggui and Kong Lun were promoted.',
  },
  s0810: {
    literal: 'That month: thunder and lightning.',
    idiomatic: 'Thunder and lightning that month.',
  },
  s0811: {
    literal: 'Left Vice Director Wang Duo also held Secretariat Vice Director, Grand Councillor, and again assisted governance.',
    idiomatic: 'Wang Duo returned to assist governance.',
  },
  s0812: {
    literal: 'Qianfu 3, first month, jimao new moon: Acting Minister of Works, Secretariat Vice Director, Grand Councillor Xiao Fang begged leave for illness and was dismissed as Crown Prince Grand Tutor.',
    idiomatic: 'In Qianfu 3\'s first month Xiao Fang retired ill as crown prince grand tutor.',
  },
  s0813: {
    literal: 'Zhexi memorialized executing Wang Ye\'s faction.',
    idiomatic: 'Zhexi reported executing Wang Ye\'s faction.',
  },
  s0814: {
    literal: 'Left Golden Guard General, Right Street Commissioner Qi Kerang was made Acting Minister of War, concurrent Yan-Yan-Qi-Hai and related prefectures military commissioner.',
    idiomatic: 'Qi Kerang took Yan-Yan-Qi-Hai command.',
  },
  s0815: {
    literal: 'Third month: Minister of Personnel Gui Renhui, Vice Minister of Personnel Kong Hui and Cui Rao examined macrocosmic candidates; Merit Evaluation Director Cui Geng and Merit Evaluation Vice Director Zhou Renju were examiners.',
    idiomatic: 'In the third month examiners were named for the macrocosmic test.',
  },
  s0816: {
    literal: 'Acting Director of the Court of the Imperial Clan Li Wei, original office, Grand Councillor.',
    idiomatic: 'Li Wei joined the Grand Council.',
  },
  s0817: {
    literal: 'Fengtian garrison reported a golden dragon seen by day ascending from the river to heaven.',
    idiomatic: 'Fengtian reported a golden dragon ascending by day.',
  },
  s0818: {
    literal: 'Secretariat Vice Director Cui Yanzhao was made Grand Preceptor of the Supreme Ultimate Palace academician; Secretariat Vice Director, Minister of Punishments, Grand Councillor Zheng Tian supervised revision of the national history.',
    idiomatic: 'Cui Yanzhao and Zheng Tian received academician and historiography duties.',
  },
  s0819: {
    literal: 'Right Martial Guard General Mo Chongqian was made Left Golden Guard General; Lizhou prefect Du Gang was made Yazhou prefect.',
    idiomatic: 'Mo Chongqian and Du Gang received guard and prefecture posts.',
  },
  s0820: {
    literal: 'Fifth month: Jiangxi observation commissioner Dugu Yun was made Crown Prince Junior Tutor; Jinzhou prefect Shu Xiangli was made Jiazhou prefect.',
    idiomatic: 'In the fifth month Dugu Yun and Shu Xiangli received posts.',
  },
  s0821: {
    literal: 'Sixth month: an edict to Fujian observation commissioner Li Bo, Jingzhou prefect Yang Quangu, Weizhou prefect Wang Guifan, Bizhou prefect Zhang Zhan, Puzhou prefect Wei Pu, Shizhou prefect Lou Fuhui, Xingzhou prefect Wang Hui, Fuzhou prefect Cui Li, Huangzhou prefect Ji Xinqing and others: "Prefects are kin-nurturing offices; if not versed in detail, how should appointment be granted?',
    idiomatic: 'In the sixth month nine prefects were dismissed for incompetence:',
  },
  s0822: {
    literal: 'Recently to nurture the hundred people for Us is not alone to glorify your single body; each time We think of the weary and weak, truly We sigh in injury.',
    idiomatic: '"We appoint you to nurture the people, not glorify yourselves—',
  },
  s0823: {
    literal: 'When Li Bo and nine received office, public opinion was unacceptable;',
    idiomatic: '"—yet Li Bo and eight others were opposed at appointment;',
  },
  s0824: {
    literal: 'Wang Hui and three others reaching their prefectures had no government, only striving for greed.',
    idiomatic: '"—and Wang Hui and two others governed only by greed.',
  },
  s0825: {
    literal: 'Truly defiling the prefectures—all should cease office.',
    idiomatic: 'All are dismissed.',
  },
  s0826: {
    literal: 'Acting Right Regular Attendant, Court of the Imperial Stud Director Li Duo was made Director of the Imperial Granary; Liang Wang Instructor branch office Pei Siqian was made Court of the Imperial Stud Director; Fuzhou Wang household chief Liu Yunzhang was made Liang Wang Instructor.',
    idiomatic: 'Li Duo, Pei Siqian, and Liu Yunzhang exchanged stud and tutor posts.',
  },
  s0827: {
    literal: 'Guest Reception Director Cui Fu was made Fenzhou prefect; Jingnan defense vice commissioner Wang Gao was made Guest Reception Director.',
    idiomatic: 'Cui Fu and Wang Gao exchanged guest reception and Jingnan posts.',
  },
  s0828: {
    literal: 'Sixth month: Secretariat Vice Director, Minister of Punishments, Grand Councillor, Grand Preceptor of the Supreme Ultimate Palace academician, judging Revenue and Expenditure Cui Yanzhao also held Left Vice Director; Secretariat Vice Director Zheng Tian also held Secretariat Vice Director; Director of the Court of the Imperial Clan, Grand Councillor Li Wei was made Secretariat Vice Director.',
    idiomatic: 'In the sixth month Cui Yanzhao, Zheng Tian, and Li Wei reshuffled grand council posts.',
  },
  s0829: {
    literal: 'Shezhou prefect Xiao Qian was made Right Department Vice Director; Right Department Vice Director Cui Tong was made Shezhou prefect.',
    idiomatic: 'Xiao Qian and Cui Tong exchanged Shezhou and right department posts.',
  },
  s0830: {
    literal: 'Seventh month: grass bandit Wang Xianzhi raided and plundered fifteen Henan prefectures—his crowd tens of thousands.',
    idiomatic: 'In the seventh month Wang Xianzhi ravaged fifteen Henan prefectures with tens of thousands.',
  },
  s0831: {
    literal: 'That month the bandits pressed Ying and Xu, attacked Ruzhou and took it, capturing prefect Wang Liao.',
    idiomatic: 'That month they took Ruzhou and captured Wang Liao.',
  },
  s0832: {
    literal: 'Vice Minister of Punishments Liu Chengyong was in the prefecture and was killed by bandits.',
    idiomatic: 'Liu Chengyong was killed in the prefecture.',
  },
  s0833: {
    literal: 'The bandits then south attacked Tang, Deng, An, Huang and other prefectures.',
    idiomatic: 'They then struck south into Tang, Deng, An, and Huang.',
  },
  s0834: {
    literal: 'At that time eastern circuits\' prefectural troops could not subdue bandits but only guard cities.',
    idiomatic: 'Eastern troops could only guard cities.',
  },
  s0835: {
    literal: 'Director of Revenue Li Jie was made Director of Chariots; Director of Revenue Wang Gao was made Director of Revenue; Guest Reception Director Zheng Yan was made Director of Revenue; Revenue Vice Director Zhang Qiao was made Guest Reception Director; Farm Vice Director Dou Xu was made Revenue Vice Director; Capital Recorder Zhao Ye was made Farm Vice Director.',
    idiomatic: 'A round of revenue and related bureau promotions followed.',
  },
  s0836: {
    literal: 'Vice Minister of Works Cui Lang was made Tongzhou prefect; Left Army Baton Officer, Left Gate Guard General Ximen Sigong was made Right Awe Guard General.',
    idiomatic: 'Cui Lang and Ximen Sigong received posts.',
  },
  s0837: {
    literal: 'Right Remonstrance Official, drafting edicts Wei Shan was made Secretariat Drafting Officer.',
    idiomatic: 'Wei Shan became secretariat drafting officer.',
  },
  s0838: {
    literal: 'Ninth month: Right Assistant Cui Rao was made acting Vice Minister of Personnel; Vice Minister of Rites Cui Hang was made Right Assistant; Secretariat Drafting Officer Gao Xiang was made acting Vice Minister of Rites; Capital Intendant Yang Zhizhi was made Vice Minister of Works.',
    idiomatic: 'In the ninth month Cui Rao, Cui Hang, Gao Xiang, and Yang Zhizhi were promoted.',
  },
  s0839: {
    literal: 'Minister of War, concurrent Director of the Court of the Imperial Clan Li Ke was made Acting Right Vice Director, Court of the Imperial Clan;',
    idiomatic: 'Li Ke became acting right vice director;',
  },
  s0840: {
    literal: 'Court of the Imperial Stud Director Xiao Kuan was made Director of the Court for Diplomatic Reception, acting Imperial Stud commissioner.',
    idiomatic: 'Xiao Kuan took diplomatic reception and stud duties.',
  },
  s0841: {
    literal: 'Grand Councillor Cui Yanzhao\'s son Baojian was made Secretariat proofreader.',
    idiomatic: 'Cui Yanzhao\'s son became a secretariat proofreader.',
  },
  s0842: {
    literal: 'Right Vice Director, Secretariat Vice Director, Grand Councillor Cui Yanzhao was advanced to Special Advancement;',
    idiomatic: 'Cui Yanzhao received special advancement;',
  },
  s0843: {
    literal: 'Secretariat Vice Director, Minister of Rites, Grand Councillor Zheng Tian may be Special Advancement.',
    idiomatic: 'Zheng Tian likewise.',
  },
  s0844: {
    literal: 'Grandee for Attendance at Court, Grand Councillor Lu Zhi may be Silver-Purple Grandee;',
    idiomatic: 'Lu Zhi received silver-purple rank;',
  },
  s0845: {
    literal: 'Silver-Purple Grandee, Grand Councillor Li Wei may be Gold-Purple Grandee.',
    idiomatic: 'Li Wei received gold-purple rank.',
  },
  s0846: {
    literal: 'Acting Director of the Imperial Granary Li Yun was made Acting Minister of Works, Huazhou prefect, censor-in-chief, Yicheng Army military commissioner, Zheng-Hua-Ying observation and disposition commissioner and related posts.',
    idiomatic: 'Li Yun went to Yicheng at Huazhou.',
  },
  s0847: {
    literal: 'Yazhou from the sixth month earthquake until the seventh month did not stop—crushing many people.',
    idiomatic: 'Yazhou earthquakes from the sixth month into the seventh killed many.',
  },
  s0848: {
    literal: 'An edict ordered Henan commissioners to raise troops against bandits.',
    idiomatic: 'Henan commissioners were ordered to raise troops.',
  },
  s0849: {
    literal: 'Director of Punishments Li Qi was made Director of Revenue, Eastern Capital branch office;',
    idiomatic: 'Li Qi and Zheng Yan exchanged revenue and punishments posts;',
  },
  s0850: {
    literal: 'Director of Revenue Zheng Yan was made Director of Punishments.',
    idiomatic: 'Zheng Yan became punishments director.',
  },
  s0851: {
    literal: 'Director of Revenue, drafting edicts, Hanlin Academician Wang Hui was made Secretariat Drafting Officer; Revenue Vice Director, Hanlin Academician Xiao Yu was made Director of Revenue, academician as before.',
    idiomatic: 'Wang Hui and Xiao Yu were promoted while keeping hanlin posts.',
  },
  s0852: {
    literal: 'Remonstrance Official Zhao Meng was made Supervising Secretary; Shangzhou prefect Zhang Tong was made Remonstrance Official.',
    idiomatic: 'Zhao Meng and Zhang Tong were promoted.',
  },
  s0853: {
    literal: 'Eleventh month: Gate Vice Director Zheng Rao was made Chizhou prefect; Water Vice Director Fan Chong was made Works Vice Director; Bian-Song revenue commissioner Du Ruxiu was made Water Vice Director.',
    idiomatic: 'In the eleventh month Zheng Rao, Fan Chong, and Du Ruxiu received posts.',
  },
  s0854: {
    literal: 'Court of the Imperial Clan Vice Director Cui Hun was demoted to Kangzhou prefect; Yangzhou Left Assistant Zheng Xiang was made Lizhou prefect; revenue sub-circuit inspector Li Zhongzhang was made Jianzhou prefect.',
    idiomatic: 'Cui Hun was banished; Zheng Xiang and Li Zhongzhang received prefectures.',
  },
  s0855: {
    literal: 'Twelfth month: Right Golden Guard General Zhang Jianhui was made Left Golden Guard General, Right Street Commissioner;',
    idiomatic: 'In the twelfth month Zhang Jianhui and Li Tao received guard posts;',
  },
  s0856: {
    literal: 'Right Dragon Martial General Li Tao was made Right Golden Guard General.',
    idiomatic: 'Li Tao became right golden guard general.',
  },
  s0857: {
    literal: 'Former Shaanxi-Guo observation commissioner Lu Yong was made Crown Prince Guest.',
    idiomatic: 'Lu Yong became crown prince guest.',
  },
  s0858: {
    literal: 'Qianfu 4, first month, guiyou new moon.',
    idiomatic: 'Qianfu 4 opened on guiyou.',
  },
  s0859: {
    literal: 'On dingchou a descending edict amnestied all prisoners under detention and exiles to return.',
    idiomatic: 'On dingchou a general amnesty freed prisoners and exiles.',
  },
  s0860: {
    literal: 'Remonstrance Official Li Tang was made Supervising Secretary; Director of War Cui Hou was made Remonstrance Official.',
    idiomatic: 'Li Tang and Cui Hou were promoted.',
  },
  s0861: {
    literal: 'Court of Judicial Review Vice Director Wang Chengyan was made Yanzhou prefect; Mingzhou prefect Yin Sengbian was made Court of Judicial Review Director.',
    idiomatic: 'Wang Chengyan and Yin Sengbian exchanged posts.',
  },
  s0862: {
    literal: 'Minister of Personnel Zheng Congdang, Vice Minister of Personnel Kong Hui, Vice Minister of Personnel Cui Rao examined macrocosmic candidates.',
    idiomatic: 'Zheng Congdang, Kong Hui, and Cui Rao examined candidates.',
  },
  s0863: {
    literal: 'Third month: retired Inner Attendant Supervisor Liu Xingshen was made Army Supervisor of the Inner Palace, retired Inner Attendant Supervisor.',
    idiomatic: 'In the third month Liu Xingshen was named army supervisor in retirement.',
  },
  s0864: {
    literal: 'Judging salt and iron cases, Acting Merit Evaluation Director Zheng Yin was made Director of Seals Vice Director, acting transport judge.',
    idiomatic: 'Zheng Yin became seals vice director and transport judge.',
  },
  s0865: {
    literal: 'War Vice Director Pei Wo was made Qizhou prefect; Posts Vice Director Lu Cheng was made War Vice Director.',
    idiomatic: 'Pei Wo and Lu Cheng received posts.',
  },
  s0866: {
    literal: 'An edict: "Disorder of constants and violation of discipline—Heaven and Earth cannot contain them; punishing crime and comforting people—the emperor\'s great canon.',
    idiomatic: 'An edict on grass bandits declared:',
  },
  s0867: {
    literal: 'Reviewing past generations, counting former dynasties—where they relied on crowds and called it arms, trusting ferocity to build villainy, at first they fox-like borrowed the owl\'s fierceness, calling themselves fierce none could match;',
    idiomatic: '"Rebels always boast then burn—',
  },
  s0868: {
    literal: 'soon birds burn and fish rot—all end in defeat and ruin.',
    idiomatic: '"—yet always end in ruin.',
  },
  s0869: {
    literal: 'Because rebellion and obedience hang apart, dark and bright together rage.',
    idiomatic: 'Heaven favors the obedient.',
  },
  s0870: {
    literal: 'Recently Pang Xun resisted orders, Wang Ye spread calamity—gathered very many, arrogant and quite wild; soon bodies greased the wilds and families received execution.',
    idiomatic: 'Pang Xun and Wang Ye were destroyed;',
  },
  s0871: {
    literal: 'Also some from rebellion could wheel and turn fortune and calamity in the palm, changing disaster and blessing in standing talk.',
    idiomatic: 'yet some rebels turned and were rewarded—',
  },
  s0872: {
    literal: 'Thus Zhuge Shuang is now a prefect, Zhu Shi still lives as general, Hong Ba received office in the inner camp, Song Zaixiong enrolled his name at Huaihai—all bodies and names bright, families glorious.',
    idiomatic: '—Zhuge Shuang, Zhu Shi, Hong Ba, and Song Zaixiong all prospered.',
  },
  s0873: {
    literal: 'Recently per circuit memorials grass bandits are somewhat many—Jiangxi, Huainan, Song, Bo, Cao, Ying—some attack prefectures and counties, some plunder villages.',
    idiomatic: 'Grass bandits now ravage Jiangxi, Huainan, and the central plains—',
  },
  s0874: {
    literal: 'Though troops are ordered, also order to summon and soothe.',
    idiomatic: '—yet troops are ordered alongside summons to surrender.',
  },
  s0875: {
    literal: 'We with magnanimity as governance and compassion dwelling in heart—each time We think of the living, all like infants.',
    idiomatic: 'We rule with compassion as for infants—',
  },
  s0876: {
    literal: 'We hate that we cannot equalize their clothes and food and let famine arrive—how can We bear to press with blades and sever their bodies?',
    idiomatic: '—and hate to cut them down with blades.',
  },
  s0877: {
    literal: 'If Wang Xianzhi and all bandit chiefs can wash hearts and repent, disperse troops and cease arms, and wherever prefectures surrender report their names—we shall discuss rewards and promotion.',
    idiomatic: 'Surrender and be rewarded;',
  },
  s0878: {
    literal: 'If bandits are stubborn and not repentant, fierce and self-relying—then let circuit troops coordinate angles to cut down.',
    idiomatic: 'resist and be cut down.',
  },
  s0879: {
    literal: 'If all armies fully capture one band of grass bandits numbering three hundred or more—extraordinary promotion to general, reward one thousand strings cash.',
    idiomatic: 'Capture three hundred rebels and win a general\'s rank and a thousand strings.',
  },
  s0880: {
    literal: 'If village talent has brave strategy and can lead righteous followers to drive off grass bandits—memorialize locally and also give heavy reward.',
    idiomatic: 'Village heroes who drive off bandits will also be richly rewarded.',
  },
  s0881: {
    literal: 'Like Zheng Yi and Tang Qun—already prefects—the court therefore does not break its word.',
    idiomatic: 'As with Zheng Yi and Tang Qun, the court keeps its word.',
  },
  s0882: {
    literal: 'When the edict arrives, let all circuits clearly proclaim and make known our intent.',
    idiomatic: 'Proclaim this in every circuit.',
  },
  s0883: {
    literal: '" Qingzhou military commissioner Song Wei memorialized: "Request five thousand foot and horse, specially as one commissioner, also leading this circuit\'s troops, wherever subduing bandits—surely establish small merit to repay the holy reward.',
    idiomatic: 'Song Wei of Qingzhou begged five thousand troops to hunt bandits.',
  },
  s0884: {
    literal: '" A favorable edict praised this; he was then appointed commissioner for all circuits to recruit and subdue grass bandits, still given three thousand forbidden troops and five hundred horses and armor.',
    idiomatic: 'The court named him all-circuits bandit commissioner with three thousand imperial troops.',
  },
  s0885: {
    literal: 'Also instructed Henan commissioners: "Wang Xianzhi was originally a salt bandit, self-styled grass army, south to Shou and Lu, north through Cao and Song.',
    idiomatic: 'Henan was told: Wang Xianzhi, a salt bandit styling himself the Grass Army, had ravaged fifteen prefectures—',
  },
  s0886: {
    literal: 'Half a year burning and plundering—only fifteen prefectures;',
    idiomatic: '—for half a year across fifteen prefectures—',
  },
  s0887: {
    literal: 'two bands turning to fight—more than seven thousand followers.',
    idiomatic: '—with more than seven thousand followers.',
  },
  s0888: {
    literal: 'Circuits dispatched generals together to subdue; days and months deep, smoke and dust did not cease.',
    idiomatic: 'Circuits sent generals yet the fighting never ceased—',
  },
  s0889: {
    literal: 'Because they mutually watched and waited, vainly expending rations; prefectures and counties exhausted in supply, villages weeping under invasion.',
    idiomatic: '—each watching the other, wasting grain while villages wept.',
  },
  s0890: {
    literal: 'Now Pinglu military commissioner Song Wei deeply hates the reeds and rushes and requests punitive campaign.',
    idiomatic: 'Song Wei of Pinglu now asks to hunt them—',
  },
  s0891: {
    literal: 'We, because Wei earlier in Shu broke Nanzhao\'s whole army; in recent years at Xuzhou crushed Pang Xun\'s great array.',
    idiomatic: '—having broken Nanzhao in Shu and Pang Xun at Xuzhou—',
  },
  s0892: {
    literal: 'Official rank very honored—can unify all circuits\' commanders;',
    idiomatic: '—fit to command all circuits;',
  },
  s0893: {
    literal: 'fierce courage always manifest—enough to break hidden barbarians\' grass bandits.',
    idiomatic: '—and fierce enough to break the grass bandits.',
  },
  s0894: {
    literal: 'In recent years at Xuzhou he crushed Pang Xun\'s great array.',
    idiomatic: '—and at Xuzhou had crushed Pang Xun\'s great array.',
  },
  s0895: {
    literal: 'Official rank very honored—can unify all circuits\' commanders;',
    idiomatic: 'His rank could unify all circuit commanders;',
  },
  s0896: {
    literal: 'fierce courage always manifest—enough to break hidden barbarians\' grass bandits.',
    idiomatic: 'his fierceness enough to break the grass bandits.',
  },
  s0897: {
    literal: 'Now already appointed to command all circuits\' troops to recruit and subdue grass bandits; when Song Wei reaches his circuit, supply rewards and feasts, all drawn from upper tribute funds.',
    idiomatic: 'He was to be supplied from upper tribute funds when he reached his circuit.',
  },
  s0898: {
    literal: 'Also order command heads—whatever attack, pursuit, advance, or retreat, take Song Wei\'s disposition.',
    idiomatic: 'Commanders\' advance and retreat were to follow Song Wei\'s orders.',
  },
  s0899: {
    literal: '" At that time bandit leaders Wang Xianzhi and Shang Junzhang were at Anzhou; Song Wei from Qingzhou with Vice Commissioner Cao Quanzhen advanced to attack and wherever broke the bandits.',
    idiomatic: 'Wang Xianzhi and Shang Junzhang were at Anzhou; Song Wei advanced from Qingzhou and broke them.',
  },
  s0900: {
    literal: 'That month Yuanju bandit Huang Chao gathered ten thousand and attacked Yanzhou, took it, and expelled military commissioner Xue Chong.',
    idiomatic: 'That month Huang Chao took Yanzhou and expelled Xue Chong.',
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
if (data.metadata.chapter !== '019') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 019; standalone T ready (${Object.keys(T).length} entries).`
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
