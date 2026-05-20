#!/usr/bin/env node
/** Batch 10: s0901–s1000 (Jiutangshu ch.018, Wenzong 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/018.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 901;
const END = 1000;

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
  s0901: {
    literal: 'Request following the twelfth-month edict — army commissioners may not forcibly enroll commoners into the army."',
    idiomatic: 'Armies were barred from forcibly enrolling civilians.',
  },
  s0902: {
    literal: '" Assented.',
    idiomatic: 'Assented.',
  },
  s0903: {
    literal: 'Eleventh month: Vice Director of the Secretariat, concurrent Minister of Personnel, Grand Councillor Cui Guicong was acting Minister of Works, Bianzhou prefect, and Xuanwu army commissioner.',
    idiomatic: 'Cui Guicong took Bianzhou and Xuanwu.',
  },
  s0904: {
    literal: 'Shazhou established the Return-to-Allegiance Army; Zhang Yichao was commissioner.',
    idiomatic: 'The Return-to-Allegiance Army was founded at Shazhou.',
  },
  s0905: {
    literal: 'Heir-apparent Mentor Yao Kang presented Imperial Governance Compendium in ten scrolls;',
    idiomatic: 'Yao Kang presented ten scrolls of Imperial Governance.',
  },
  s0906: {
    literal: 'also compiled Comprehensive History in three hundred scrolls from opening of the age through Sui — imperial good government, edicts, institutions, bronze, salt, coin, grain gains and losses, military advantage and harm, down to Buddhist and Daoist right and wrong — nothing omitted, arranged by year.',
    idiomatic: 'He also submitted a three-hundred-scroll Comprehensive History.',
  },
  s0907: {
    literal: 'Director of the Directorate of Education Feng Shen memorialized: "The Temple of the Literary King — Taizong first built it, Ruizong wrote the plaque; when Wu Zetian usurped she changed the seal script to the two characters Great Zhou — request they be cut away."',
    idiomatic: 'Feng Shen asked to remove Wu Zetian\'s "Great Zhou" plaque.',
  },
  s0908: {
    literal: '" Assented.',
    idiomatic: 'Assented.',
  },
  s0909: {
    literal: 'Twelfth month: thieves chopped the spirit-gate halberds of Jing Mausoleum — Jingzhao prefect Wei Bo fined two months\' salary; demoted Director of the Imperial Clan Li Wensun to Mizhou prefect; mausoleum magistrate Wu Yue to Yuezhou registrar; Fengxian magistrate Pei Rang to Suizhou registrar.',
    idiomatic: 'Jing Mausoleum halberds were stolen; several officials were punished.',
  },
  s0910: {
    literal: 'That year Hunan suffered great famine.',
    idiomatic: 'Hunan starved that year.',
  },
  s0911: {
    literal: 'Dazhong 6, spring, first month, wuchen: Longzhou defense commissioner Xue Kui was made Qinzhou prefect, Tianxiong army commander, and Qin-Cheng frontier commissioner.',
    idiomatic: 'Xue Kui took Qin and the frontier command.',
  },
  s0912: {
    literal: 'Second month: Right Guard great general Zheng Guang asked tax exemption for granted fields.',
    idiomatic: 'Zheng Guang sought tax exemption on imperial grant land.',
  },
  s0913: {
    literal: 'Grand Councillor Wei Mo memorialized: "Zheng Guang as the emperor\'s maternal uncle may receive fields, but tax exemption cannot encourage the common folk."',
    idiomatic: 'Wei Mo refused tax exemption for the imperial uncle.',
  },
  s0914: {
    literal: '" Edict: "Follow the common household rule for tax supply."',
    idiomatic: 'An edict taxed the grant like ordinary land.',
  },
  s0915: {
    literal: 'The edict closed with the closing bracket.',
    idiomatic: 'Thus ended the edict.',
  },
  s0916: {
    literal: 'Third month: Longzhou prefect Xue Kui memorialized completion of Dingcheng Pass construction.',
    idiomatic: 'Xue Kui finished Dingcheng Pass.',
  },
  s0917: {
    literal: 'Fourth month, dingyou, edict: "Ever-Normal and charity granary grain — inspect yearly; where flood or drought truly strike, the registrar first surveys household numbers and issues to poor households first; rich households are outside issuance."',
    idiomatic: 'Ever-Normal grain was to reach poor households first in disasters.',
  },
  s0918: {
    literal: '" Minister of Rites and salt-and-transport commissioner Pei Xiu was Grand Councillor at his present rank.',
    idiomatic: 'Pei Xiu joined the council.',
  },
  s0919: {
    literal: 'Fifth month, edict: "Where military prefectures have troops, select men skilled in military law and archery as training commissioners; in annual drill seasons keep drilling and then report to the Ministry of War."',
    idiomatic: 'Training commissioners were ordered for all garrisoned prefectures.',
  },
  s0920: {
    literal: 'The edict closed with the closing bracket.',
    idiomatic: 'Thus ended the edict.',
  },
  s0921: {
    literal: '" The Censorate memorialized: "Criminal cases touching court officials — for Ministry of State officials of fourth rank and above and other offices of third rank and above, first memorialize for imperial decision."',
    idiomatic: 'High officials\' cases required prior imperial approval.',
  },
  s0922: {
    literal: 'If taking various office statements, then report to the Secretariat for decision."',
    idiomatic: 'Lower ranks went to the Secretariat.',
  },
  s0923: {
    literal: '" Assented.',
    idiomatic: 'Assented.',
  },
  s0924: {
    literal: 'Autumn, seventh month, bingchen: former Huainan commissioner, Silver-glitter Grand Master, acting Left Vice Director, concurrent Yangzhou metropolitan prefect and Censor-in-Chief, Pillar of State, Duke of Zanhuang with fifteen hundred households Li Jue died — posthumously Minister of Works.',
    idiomatic: 'Li Jue died and was posthumously made Minister of Works.',
  },
  s0925: {
    literal: 'Edict: for graft cases restitution — per law use the first ten-day price estimate of the time.',
    idiomatic: 'Restitution was to use local ten-day price tables.',
  },
  s0926: {
    literal: 'Take the place of the offense, the first ten-day estimate of that month to balance accounts.',
    idiomatic: 'The local month\'s early estimate governed restitution.',
  },
  s0927: {
    literal: 'Thus ended the edict; the throne assented.',
    idiomatic: 'Thus ended the edict.',
  },
  s0928: {
    literal: 'Acting Minister of Works, heir-apparent Junior Preceptor, Pillar of State, Duke of Fanyang with two thousand households Lu Jun was Taiyuan prefect, northern capital regent, and Hedong commissioner.',
    idiomatic: 'Lu Jun took Taiyuan and Hedong.',
  },
  s0929: {
    literal: 'Ninth month: edict — Palace Attendant transfer month limit should be twenty months.',
    idiomatic: 'Palace Attendants now rotated every twenty months.',
  },
  s0930: {
    literal: 'Dazhong 7, spring, first month, renchen: Silver-glitter Grand Master, acting heir-apparent Junior Preceptor at eastern capital, Pillar of State, Duke of Jinling with two thousand households Gui Rong died — posthumously Right Vice Director.',
    idiomatic: 'Gui Rong died and was posthumously Right Vice Director.',
  },
  s0931: {
    literal: 'Director of the Imperial Clan Li Wenhui was demoted to Mizhou prefect.',
    idiomatic: 'Li Wenhui was demoted to Mizhou.',
  },
  s0932: {
    literal: 'Fourth month: Censor-in-Chief Zheng Lang was Vice Director of the Secretariat and Grand Councillor.',
    idiomatic: 'Zheng Lang joined the council.',
  },
  s0933: {
    literal: 'Fifth month: Left Guard rate-house registrar Zhang Guai collected similar articles of statutes, regulations, and formats — one thousand two hundred fifty items in one hundred twenty-one categories, titled Comprehensive Categories of Penal Law, and presented it.',
    idiomatic: 'Zhang Guai submitted another Comprehensive Categories of Penal Law.',
  },
  s0934: {
    literal: 'Seventh month: Regular Grand Master, Left Vice Director with gold fish Cui Can was Vice Minister of Punishments; Silver-glitter Grand Master, acting Vice Minister of War, edict drafter, Hanlin academician Su Mi was Left Vice Director; acting Vice Minister of Revenue Cui Huan was acting Vice Minister of War.',
    idiomatic: 'Cui Can, Su Mi, and Cui Huan exchanged high posts.',
  },
  s0935: {
    literal: 'Tenth month: Left Vice Director, Vice Director of the Secretariat, Grand Councillor, Grand Pure Temple commissioner, Hongwen Hall academician Cui Xuan presented Continued Institutional Compendium forty scrolls — compilers Yang Shaofu, Cui Zuan, Xue Feng, Zheng Yan, and others — gifts graded.',
    idiomatic: 'Cui Xuan presented forty scrolls of the Continued Institutional Compendium.',
  },
  s0936: {
    literal: 'Dazhong 8, spring, first month: the Yellow River cleared at Shan prefecture.',
    idiomatic: 'The Yellow River ran clear at Shanzhou.',
  },
  s0937: {
    literal: 'Second month: southern barbarians presented a rhinoceros — edict returned it.',
    idiomatic: 'A rhinoceros tribute was sent back.',
  },
  s0938: {
    literal: 'Third month: edict drought envoys to review imprisoned persons.',
    idiomatic: 'Drought prompted review of prisoners.',
  },
  s0939: {
    literal: 'Grand Councillor and dynastic historian Wei Mo completed Veritable Record of Wenzong in forty scrolls and presented it — compilers Remonstrance official Lu Dan, Grand Master of Ceremonies Jiang Jie, Bureau of Merit outer-section member Wang Hong, Right Reminder Lu Ji — silver vessels and brocade gifts graded.',
    idiomatic: 'Wei Mo presented forty scrolls of Wenzong\'s Veritable Record.',
  },
  s0940: {
    literal: 'Shannan East commissioner, acting Minister of Revenue, Xiangzhou prefect, Pillar of State, Viscount of Jiuquan with three hundred households Li Jingrang was Minister of Personnel.',
    idiomatic: 'Li Jingrang took Personnel.',
  },
  s0941: {
    literal: 'Fifth month: Secretariat Drafter and Hanlin academician Wei Ao was Jingzhao prefect;',
    idiomatic: 'Wei Ao became Jingzhao prefect;',
  },
  s0942: {
    literal: 'Vice Minister of Revenue, Hanlin academician-director, Pillar of State, Viscount of Wugong with three hundred households Su Mi was acting Minister of War, concurrent Jiangling prefect and Censor-in-Chief, and Jingnan observation commissioner.',
    idiomatic: 'Su Mi took Jiangling and Jingnan.',
  },
  s0943: {
    literal: 'Seventh month: Silver-glitter Grand Master, acting Vice Director of the Secretariat, Grand Councillor Wei Mo was also Minister of Revenue.',
    idiomatic: 'Wei Mo also took Revenue.',
  },
  s0944: {
    literal: 'Eighth month: Minister of Agriculture Zheng Zhu was acting Left Cavalier, concurrent Xiazhou prefect, Censor-in-Chief, Pillar of State, Baron of Xingyang with three hundred households, and Xia-Sui-Yin-You commissioner with frontier pacification duties.',
    idiomatic: 'Zheng Zhu took Xia and the northwest frontier.',
  },
  s0945: {
    literal: 'Dazhong 9, spring, first month, xinsi: Silver-glitter Grand Master, Palace Library Director, Baron of Xuchang Chen Shang died — posthumously Minister of Works.',
    idiomatic: 'Chen Shang died and was posthumously Minister of Works.',
  },
  s0946: {
    literal: 'Second month: Vice Director of the Secretariat, concurrent Minister of Rites, Grand Councillor Pei Xiu was acting Minister of Personnel, concurrent Bianzhou prefect and Censor-in-Chief, and Xuanwu army commissioner.',
    idiomatic: 'Pei Xiu took Bianzhou and Xuanwu.',
  },
  s0947: {
    literal: 'Third month: Expanded-Phrases examination candidates leaked compiled topics — impeached by the Censorate; Vice Minister Pei Shen became director of education; Bureau Director Zhou Jingfu fined two months\' salary; examiner Tang Zhi sent out as Chuzhou prefect; investigating censor Feng Zhuan fined one month\'s salary.',
    idiomatic: 'A leaked examination cost ten degrees and several posts.',
  },
  s0948: {
    literal: 'The ten who passed were all struck from the rolls.',
    idiomatic: 'All ten passers were disqualified.',
  },
  s0949: {
    literal: 'The Ministry of Personnel eastern selection was entrusted to Right Vice Director Lu Yi to judge.',
    idiomatic: 'Lu Yi judged the eastern selection.',
  },
  s0950: {
    literal: 'Vice Minister of Personnel Zheng Ya was acting Minister of Rites, concurrent Dingzhou prefect and Censor-in-Chief, and Yiwu army commissioner.',
    idiomatic: 'Zheng Ya took Yiwu and Dingzhou.',
  },
  s0951: {
    literal: 'The Censorate, per the eighth-day first-month Rites examination yard seizure of Classicist degree candidates Huang Xuzhi, Zhao Hongcheng, Quan Zhi, and three others forging hall seals and hall posts — Huang also falsely wore scarlet robe and brought forged posts into the yard for candidates Yu Zheng, Hu Jian, and Dang Zan to pass, promised one thousand six hundred strings cash.',
    idiomatic: 'The Censorate exposed forged examination credentials sold for sixteen hundred strings.',
  },
  s0952: {
    literal: 'On investigation Huang and others confessed forgery; the promised money never changed hands before exposure.',
    idiomatic: 'The bribe never paid before the plot failed.',
  },
  s0953: {
    literal: 'By edict all were executed per law.',
    idiomatic: 'All forgers were executed.',
  },
  s0954: {
    literal: 'The chief examiners, for catching the villains themselves, were all released.',
    idiomatic: 'Examiners were spared for exposing the fraud.',
  },
  s0955: {
    literal: 'Seventh month: Hedong commissioner, acting Minister of Works, Taiyuan prefect, northern capital regent, Pillar of State, Duke of Fanyang with three thousand households Lu Jun was acting Right Vice Director.',
    idiomatic: 'Lu Jun became acting Right Vice Director.',
  },
  s0956: {
    literal: 'Eighth month: Vice Director of the Secretariat, acting Right Vice Director, dynastic historian, Baron of Boling with one thousand households Cui Xuan was acting Minister of Education, Grand Councillor, concurrent Yangzhou metropolitan prefect, and Huainan vice commissioner knowing military affairs.',
    idiomatic: 'Cui Xuan took Huainan with council rank.',
  },
  s0957: {
    literal: 'Xuanzong feasted and composed verse to bestow on him.',
    idiomatic: 'Xuanzong feasted Cui Xuan and gave him a poem.',
  },
  s0958: {
    literal: 'Ninth month: Zhaoyi commissioner, acting Minister of Rites, concurrent Lu metropolitan prefect, Censor-in-Chief, Pillar of State with purple-gold fish Zheng Juan was acting Vice Minister of Punishments, Taiyuan prefect, northern capital regent, and Hedong commissioner.',
    idiomatic: 'Zheng Juan was made acting Minister of Punishments, Taiyuan intendant, northern capital regent, and Hedong commissioner.',
  },
  s0959: {
    literal: 'Eleventh month: Henan prefect Liu Zuan was acting Minister of Works, Bianzhou prefect, concurrent Censor-in-Chief, and Xuanwu commissioner.',
    idiomatic: 'Liu Zuan took Bianzhou and Xuanwu.',
  },
  s0960: {
    literal: 'Secretariat Drafter Zheng Hao was Vice Minister of Rites.',
    idiomatic: 'Zheng Hao became Vice Minister of Rites.',
  },
  s0961: {
    literal: 'Dazhong 10, spring, first month, yisi: Regular Grand Master, Huazhou prefect, Tong Pass defense commissioner, Zhenguo army commander, Pillar of State, Baron of Longxi with three hundred households and purple-gold fish Li Na was acting Left Cavalier, concurrent Yuezhou prefect and Censor-in-Chief, and Zhejiang East observation commissioner.',
    idiomatic: 'Li Na was made acting Left Cavalier, Yue prefect, censor-in-chief, and Zhejiang East observation commissioner.',
  },
  s0962: {
    literal: 'Third month: Secretariat memorialized: "Per the subjects now in the Rites examination yard — Kaiyuan Rites, Three Rites, Three Classics, Three Histories, Classicist, Daoist degree, Ming arithmetic, and Youth categories — nine subjects; in recent years selections are too loose, no real craft to harvest, only adding entry to office."',
    idiomatic: 'The Secretariat asked to tighten nine examination subjects.',
  },
  s0963: {
    literal: 'Regulations must be discussed so careers are refined.',
    idiomatic: 'Standards needed tightening.',
  },
  s0964: {
    literal: 'Your servants have already argued face-to-face at Yanying and received the sacred order to send writing.',
    idiomatic: 'The matter had been argued at Yanying.',
  },
  s0965: {
    literal: 'For the nine subjects above, your servants discuss: from Dazhong 10 suspend three years; when candidates return, have offices report prior names and Secretariat drafters re-examine.',
    idiomatic: 'Nine subjects were suspended for three years from Dazhong 10.',
  },
  s0966: {
    literal: 'Those with some mastery fit for court consultation — make grades and advance names, await edict.',
    idiomatic: 'Skilled candidates could still be nominated by grade.',
  },
  s0967: {
    literal: 'If careers are barren and unfit to send up, examiners should be rebuked at court.',
    idiomatic: 'Weak nominees would bring examiner punishment.',
  },
  s0968: {
    literal: 'Youth candidates lately sent by circuits are often over age, falsely called youth, and their work is common run.',
    idiomatic: '"Youth" candidates were often overage frauds.',
  },
  s0969: {
    literal: 'From today when circuits send youth they must be truly eleven or twelve, master one classic with full answers, and write themselves.',
    idiomatic: 'True youth candidates had to be eleven or twelve and master one classic.',
  },
  s0970: {
    literal: 'If violating regulations, the circuit chief administrator is also punished."',
    idiomatic: 'Violations would punish circuit chiefs.',
  },
  s0971: {
    literal: '" Assented.',
    idiomatic: 'Assented.',
  },
  s0972: {
    literal: 'Fourth month, guichou: Punishments Bureau Director Lu Bo was Luzhou prefect; Remonstrance official, Duke of Bohai with two thousand households Gao Shaoyi was acting Minister of Rites, Huazhou prefect, Tong Pass defense commissioner, and Zhenguo army commander.',
    idiomatic: 'Lu Bo and Gao Shaoyi took Luzhou and Huazhou.',
  },
  s0973: {
    literal: 'Sixth month: Bureau of War Director Pei Yizhi was Suzhou prefect.',
    idiomatic: 'Pei Yizhi became Suzhou prefect.',
  },
  s0974: {
    literal: 'Sixth month: Bureau of War Director Pei Yizhi was Suzhou prefect.',
    idiomatic: 'Again, Pei Yizhi was made Suzhou prefect.',
  },
  s0975: {
    literal: 'Ninth month: Secretariat Drafter Du Shenquan was acting Rites examination commissioner.',
    idiomatic: 'Du Shenquan oversaw the Rites examinations.',
  },
  s0976: {
    literal: 'Tenth month: Binning-Qing commissioner, acting Minister of Rites, Binzhou prefect, Pillar of State with purple-gold fish Zhen was acting Minister of War, Lu metropolitan prefect, Censor-in-Chief, Zhaoyi vice commissioner, and Lu-Xing-Ming observation commissioner.',
    idiomatic: 'Zhen took Zhaoyi and Lu prefecture.',
  },
  s0977: {
    literal: 'Guangxi observation commissioner Linghu Ding died — posthumously Minister of Rites.',
    idiomatic: 'Linghu Ding died and was posthumously Minister of Rites.',
  },
  s0978: {
    literal: 'Dazhong 11, spring, first month: Silver-glitter Grand Master, acting Minister of Personnel, Pillar of State, Viscount of Jiuquan with three hundred households Li Jingrang was Censor-in-Chief;',
    idiomatic: 'Li Jingrang became censor-in-chief;',
  },
  s0979: {
    literal: 'Regular Grand Master, acting chief investigating censor and concurrent Right Vice Director with purple-gold fish Xiahou Zi was Vice Minister of Revenue and acting revenue head;',
    idiomatic: 'Xiahou Zi took Revenue;',
  },
  s0980: {
    literal: 'Palace Companion, acting Jingzhao prefect, Pillar of State, Baron of Fufeng with three hundred households and purple-gold fish Wei Ao was acting Minister of Works, Mengzhou prefect, Censor-in-Chief, and Heyang Three Cities commissioner.',
    idiomatic: 'Wei Ao took Heyang from the capital prefecture.',
  },
  s0981: {
    literal: 'Earlier the imperial carriage was about to visit Huaqing Palace; officials of both departments submitted memorials; edict: "We take Mount Li near the palace — the true sage\'s likeness — never yet visited; We ourselves feel the lack."',
    idiomatic: 'Xuanzong deferred a Huaqing trip after memorials.',
  },
  s0982: {
    literal: '"Now with yang harmony and clear air, inner and outer affairs simple, in leisure from hearing cases We may discuss one journey."',
    idiomatic: 'He cited seasonal leisure for a possible visit.',
  },
  s0983: {
    literal: '"It raises respectful mind — not taking pleasure travel as the affair."',
    idiomatic: 'The trip would be reverence, not pleasure.',
  },
  s0984: {
    literal: '"Though We issue orders, We also fear troubling people."',
    idiomatic: 'He still feared burdening the people.',
  },
  s0985: {
    literal: '"You hold posts in the forbidden precincts, will loyal to the throne, citing antiquity in memorials — We see your earnest words and deep loyal intent."',
    idiomatic: 'He praised the officials\' earnest memorials.',
  },
  s0986: {
    literal: '"We have granted your request — your memorials are all noted."',
    idiomatic: 'The Huaqing journey was canceled.',
  },
  s0987: {
    literal: '" Sword South West vice commissioner, frontier pacification commissioner, Special Advance, acting Minister of Education, Grand Councillor, concurrent Chengdu prefect, Pillar of State, Duke of Taiyuan with two thousand households Bai Minzhong was at present rank also Jiangling prefect and Jingnan observation commissioner.',
    idiomatic: 'Bai Minzhong added Jingnan to his Chengdu post.',
  },
  s0988: {
    literal: 'Second month: Xia-Sui-Yin-You commissioner, General-of-Policy Grand Master, acting Left Cavalier, Xiazhou prefect, Censor-in-Chief, Pillar of State, Baron of Xingyang with three hundred households and purple-gold fish Zheng Zhu was acting Minister of Works, Binzhou prefect, Binning-Qing commissioner with frontier farms and grain duties;',
    idiomatic: 'Zheng Zhu was made acting Minister of Works, Bin prefect, and Binning-Qing commissioner with frontier farms and grain duties;',
  },
  s0989: {
    literal: 'Right Gold Crow guard general Tian Zaibin was Right Cavalier and Xiazhou prefect, replacing Zheng Zhu as Xia-Sui-Yin-You commissioner.',
    idiomatic: 'Tian Zaibin replaced Zheng Zhu on the northwest frontier.',
  },
  s0990: {
    literal: 'Jingnan commissioner, Silver-glitter Grand Master, acting Minister of War, concurrent Jiangling prefect, Censor-in-Chief, Pillar of State, Viscount of Wugong with three hundred households Su Mi was Grand Master of Ceremonies.',
    idiomatic: 'Su Mi became Grand Master of Ceremonies.',
  },
  s0991: {
    literal: 'Silver-glitter Grand Master, acting Vice Director of the Secretariat, concurrent Minister of Revenue, Grand Councillor, dynastic historian, Pillar of State Wei Mo was acting Minister of Revenue, Grand Councillor, concurrent Chengdu prefect, and Sword South West vice commissioner.',
    idiomatic: 'Wei Mo took Chengdu and Sword South West.',
  },
  s0992: {
    literal: 'Acting Grand Master of the Palace, acting Minister of Works with purple-gold fish Cui Shenyou was Vice Director of the Secretariat and Grand Councillor.',
    idiomatic: 'Cui Shenyou joined the council.',
  },
  s0993: {
    literal: 'Chengd army commissioner, acting Minister of War, Zhenzhou metropolitan prefect Wang Shaoding was Silver-glitter Grand Master, acting Right Vice Director, other posts unchanged.',
    idiomatic: 'Wang Shaoding was promoted to acting Right Vice Director.',
  },
  s0994: {
    literal: 'General-of-Policy Grand Master, acting Vice Director of the Secretariat, concurrent Minister of Rites, Grand Councillor, Hall of Assembled Worthies academician with purple-gold fish Zheng Lang might oversee dynastic history.',
    idiomatic: 'Zheng Lang was named to oversee the Veritable Record.',
  },
  s0995: {
    literal: 'Grand Master of the Palace, acting Minister of Works, Grand Councillor, Pillar of State with purple-gold fish Cui Shenyou might be Hall of Assembled Worthies academician.',
    idiomatic: 'Cui Shenyou also took the Hall of Assembled Worthies.',
  },
  s0996: {
    literal: 'Third month: restored-from-mourning Regular Grand Master, Shenzhou prefect, Censor-in-Chief, and Chengd army judge Wang Shaoyi was acting Left Cavalier, Zhenfu Left Army Major, knowing prefectural affairs, Chengd vice commissioner, and overall army commander.',
    idiomatic: 'Wang Shaoyi became Chengd vice commissioner.',
  },
  s0997: {
    literal: 'Chengd central army commander, Silver-glitter Grand Master, acting heir-apparent Guest of Honor, concurrent investigating censor, Pillar of State Wang Jingyin was at present rank, Shenzhou prefect, and local defense commander.',
    idiomatic: 'Wang Jingyin took Shenzhou.',
  },
  s0998: {
    literal: 'Acting Left Cavalier, Right Divine Strategy great-intersection army commander Wang Shaofu might leave mourning restoration and resume Right Divine Strategy great general.',
    idiomatic: 'Wang Shaofu left mourning and returned to the Right Divine Strategy.',
  },
  s0999: {
    literal: 'Shaoyi and Shaofu were younger brothers of Zhenzhou\'s Wang Shaoding.',
    idiomatic: 'Shaoyi and Shaofu were Wang Shaoding\'s brothers.',
  },
  s1000: {
    literal: 'Jingyin was Shaoding\'s son.',
    idiomatic: 'Jingyin was Wang Shaoding\'s son.',
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
if (data.metadata.chapter !== '018') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 018; standalone T ready (${Object.keys(T).length} entries).`
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
