#!/usr/bin/env node
/** Batch 12: s1101–s1200 (Jiutangshu ch.020, Zhaozong annals) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/020.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 1101;
const END = 1200;

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
  s1101: {
    literal: 'Shu may be demoted to Court Gentleman for Scattered Honors, Dengzhou prefect; Yuan may be demoted to Court Gentleman for Scattered Honors, Laizhou prefect; immediately dispatch out of capital.',
    idiomatic: 'Shu was demoted to prefect of Deng, Yuan to Laizhou, and both were ordered out of the capital immediately.',
  },
  s1102: {
    literal: '” War Director Wei Qianmei demoted to Yizhou registrar.',
    idiomatic: 'War Director Wei Qianmei was demoted to registrar of Yi.',
  },
  s1103: {
    literal: 'On jiaxu, edict Secretariat drafter Feng Wei demoted to Qizhou registrar; Right Remonstrator Zheng Nian Mizhou Juxian county aide; War aide Lu Xie Qizhou registrar—all supernumerary posts.',
    idiomatic: 'On jiaxu Feng Wei, Zheng Nian, and Lu Xie were demoted to distant posts on supernumerary rolls.',
  },
  s1104: {
    literal: 'On yihai, edict Minister of Personnel Lu Yi demoted to Puzhou registrar; Minister of Works Wang Pu Zizhou registrar.',
    idiomatic: 'On yihai Lu Yi and Wang Pu were demoted to registrars of Pu and Zi.',
  },
  s1105: {
    literal: 'Astronomical Commission memorialized: “Before the ten-day period, star texts changed and appeared; looking up at the suspended signs, specially bent the sagely compassion.',
    idiomatic: 'The Astronomical Commission reported omens had alarmed the throne.',
  },
  s1106: {
    literal: 'From the eighth night of this month afterward, continuously met yin rain; observation could not be obtained.',
    idiomatic: 'Since the eighth, rain had blocked observation.',
  },
  s1107: {
    literal: 'To the thirteenth night first watch third point, sky color briefly clear, scenery and constellations distinct—the baleful star not seen in azure void, calamity air secretly dissolved in heavenly river.',
    idiomatic: 'On the thirteenth at the first watch the sky cleared—the comet was gone and the omen seemed spent.',
  },
  s1108: {
    literal: '” Edict said: “Heaven’s reproach appeared, below earth shocked; causing night-vigil deep worry, fearing the hundred people’s many hardships.',
    idiomatic: 'An edict thanked heaven: the comet had terrified the realm and the emperor had fasted in fear.',
  },
  s1109: {
    literal: 'Not occupying the main hall, entirely stopping regular delicacies, increasing ritual purity, to extend prayer.',
    idiomatic: 'He had left the main hall, cut meals, and prayed in earnest.',
  },
  s1110: {
    literal: 'Indeed reached dark heaven’s covering blessing, broom comet eliminated—how guilt-on-self’s resonance, avoiding leaving the people calamity air.',
    idiomatic: 'Heaven answered; the comet vanished—was it penance that spared the people?”',
  },
  s1111: {
    literal: 'Observing the submitted memorial, deeply comforted sincere feeling.',
    idiomatic: 'The memorial comforted him deeply.',
  },
  s1112: {
    literal: '” On bingzi, edict Households Director Li Renjian demoted to Prince of He staff counselor; attendance recorder Lu Renjiong Anzhou registrar; Shou’an county aide, direct Hongwen Guan Yan Cangzhou Dongguang aide.',
    idiomatic: 'On bingzi more officials were demoted, including Li Renjian and Lu Renjiong.',
  },
  s1113: {
    literal: 'On dingchou, Chenxu military governor Zhang Quanyi memorialized: “Received Xuzhou acting military governor’s report: since many troubles, Xuzhou was temporarily a common prefecture; now specially created drum-and-horn tower finished—request restore military designation.',
    idiomatic: 'On dingchou Zhang Quanyi asked to restore Xuzhou’s military banner now its drum tower was rebuilt.',
  },
  s1114: {
    literal: '” Edict: as before set Zhongwu Army plaque and designation.',
    idiomatic: 'Zhongwu Army’s name and plaque were restored.',
  },
  s1115: {
    literal: 'On wuyin, banquet for hundred ministers in Chongxun Hall—Quanzhong with Wang Rong and Luo Shaowei set the feast.',
    idiomatic: 'On wuyin Quanzhong, Wang Rong, and Luo Shaowei feasted the court at Chongxun.',
  },
  s1116: {
    literal: 'On gengchen, edict Special Advance, acting Minister of Works, acting Grand Guardian retired Zhao Chong may be Caozhou registrar; Yinguanglu Grand Master, Vice Minister of War Wang Zan may be Puzhou registrar.',
    idiomatic: 'On gengchen Zhao Chong and Wang Zan were demoted to distant registrars.',
  },
  s1117: {
    literal: 'On xinsi, edict demoted Dengzhou prefect Pei Shu may be Longzhou registrar; demoted Bian prefect Dugu Sun may be Qiongzhou registrar; demoted Laizhou prefect Cui Yuan may be Baizhou registrar.',
    idiomatic: 'On xinsi Shu, Sun, and Yuan were pushed farther—Long, Qiong, and Bai.',
  },
  s1118: {
    literal: 'On renwu, edict Merit aide Wei Zhen demoted to Prince of He companion; Luoyang magistrate Li Guangxu demoted to Left Spring Palace provisioner.',
    idiomatic: 'On renwu Wei Zhen and Li Guangxu were demoted within the capital ranks.',
  },
  s1119: {
    literal: 'On jiashen, Secretariat Director Cui Renlu may be Mizhou registrar; National University Chancellor Cui Cheng Chenzhou registrar; Grand Treasury Vice Director Pei Zhen Xuzhou registrar; Court of Imperial Guards Vice Director Pei Shu Caozhou Nanhua aide; Left Remonstrator Cui Xianxiu Ningling aide; Seals aide Xue Hao Hui prefectural registrar; former salt-and-iron clerk Dugu Xian Linyi aide; Secretariat Vice Director Pei Yue Yanzhou registrar; Chang’an aide, direct Historiography Pei Ge Feiqi aide; War Director Li Xiang Zhengzhou registrar; Justice aide Lu Jian Fan county aide.',
    idiomatic: 'On jiashen a sweep demoted a dozen more officials connected to the fallen council.',
  },
  s1120: {
    literal: 'On bingxu, Yingzhou Ruoyin county man Peng Wen’s wife bore three sons.',
    idiomatic: 'On bingxu a woman in Ruoyin bore triplets.',
  },
  s1121: {
    literal: 'On dinghai, edict Hanlin academician, Director of Palace Armories Zhang Ce also Historiography compiler, revise national history.',
    idiomatic: 'On dinghai Zhang Ce was ordered to compile the national history.',
  },
  s1122: {
    literal: 'On the first day of the sixth month, wuzi; edict: “Demoted Longzhou registrar Pei Shu, Qiongzhou registrar Dugu Sun, Baizhou registrar Cui Yuan, Puzhou registrar Lu Yi, Zizhou registrar Wang Pu, Caozhou registrar Zhao Chong, Puzhou registrar Wang Zan and others—all received state grace, all should have heavy responsibility.',
    idiomatic: 'On wuzi an edict said the exiled ministers had betrayed grace despite high office.',
  },
  s1123: {
    literal: 'Not thinking to exhaust loyalty, only storing treachery and evil; though already demoted to distant regions, still hard to widen in state canon.',
    idiomatic: 'They had stored treachery; exile was not enough.',
  },
  s1124: {
    literal: 'Entrust Censorate to send men in each prefecture and county where they are to grant self-destruction.',
    idiomatic: 'The Censorate was to order them to kill themselves wherever they were found.',
  },
  s1125: {
    literal: '” At that time Shu and seven others had already reached Hua Prefecture; all were killed together at Baima Post; Quanzhong ordered bodies thrown in the river.',
    idiomatic: 'Seven of them reached Hua Prefecture and were murdered together at Baima Post; Quanzhong had the bodies thrown into the river.',
  },
  s1126: {
    literal: 'On jichou, edict: “Between lord and minister, advance and retreat by ritual; especially in seeking the old, wishing to preserve the beginning and end—if oneself plucks regret, still must execute demotion and blame.',
    idiomatic: 'On jichou an edict preached ritual advance and retreat, then punished another elder.',
  },
  s1127: {
    literal: 'Special Advance, acting Minister of Works retired, Pillar, Duke of Hedong with 2,000 households Pei Zan early by public repute often tread the terrace departments; not heard to exhaust strength to correct the time, every matter nurturing quiet to avoid affairs.',
    idiomatic: 'Pei Zan, retired grandee, had never strained to steady the throne and had hid in quiet.',
  },
  s1128: {
    literal: 'When following request for old age, not said without grace; together careful of the pivot, moves should follow rules.',
    idiomatic: 'His retirement had been gracious; he should have kept silent.',
  },
  s1129: {
    literal: 'Though cloud brave retreat, then had later words; self was chief of registry followers, quite lost minister’s ritual.',
    idiomatic: 'He boasted of retiring bravely yet gossiped on—unworthy of a minister.',
  },
  s1130: {
    literal: 'Demoted to occupy prefectural aide, to correct court cord; may be demoted to Qingzhou registrar.',
    idiomatic: 'He was demoted to registrar of Qing.',
  },
  s1131: {
    literal: 'Justice Director Li Xu may be Laizhou registrar.',
    idiomatic: 'Li Xu was sent to Laizhou as registrar.',
  },
  s1132: {
    literal: '” On xinmao, Taiwei Palace Minister Liu Can memorialized: “When former commissioner Pei Shu served as palace commissioner, he provisionally memorialized requesting Xuan Yuan Abbey as Supreme Ultimate Palace, and separately memorialized Hongdao Abbey in the capital as Supreme Ultimate Palace—until now no fixed disposition.',
    idiomatic: 'On xinmao Liu Can complained Pei Shu had left two competing Supreme Ultimate sites.',
  },
  s1133: {
    literal: 'Considering this year tenth month ninth day Your Majesty personally performs southern suburban sacrifice, first visiting the sage-ancestor temple; Hongdao Abbey is not yet repaired, Xuan Yuan Abbey is also on North Mountain—if the imperial carriage exits the city, ritual is not convenient and stable.',
    idiomatic: 'For the southern suburban rite on the ninth of the tenth month neither Hongdao nor North Mountain Xuan Yuan suited the imperial procession.',
  },
  s1134: {
    literal: 'Now wish only to retain one Lord Lao temple on North Mang mountain; Xuan Yuan Abbey requests dismantle into the capital, build Taiwei Palace in Qinghua ward, to prepare imperial carriage affairs.',
    idiomatic: 'He proposed one temple on North Mang and moving Xuan Yuan into the city as Taiwei Palace in Qinghua ward.',
  },
  s1135: {
    literal: '” Approved.',
    idiomatic: 'Approved.',
  },
  s1136: {
    literal: 'On renchen, edict: “Circuit military governors, observers, defenders, prefects, and others—within their departments newly appointed court officials and former-candidate court officials, within three days after edict arrival dispatch to court, still send men to escort.',
    idiomatic: 'On renchen edicts ordered all new court appointees in the provinces to reach the capital within three days under escort.',
  },
  s1137: {
    literal: 'Where they are, prefectures and counties may not detain; if there is delay, demotion will be discussed.',
    idiomatic: 'Local officials could not hold them; delay meant demotion.',
  },
  s1138: {
    literal: 'Entrust the responsible offices.',
    idiomatic: 'So ordered.',
  },
  s1139: {
    literal: '” On guisi, edict: “Court of Imperial Guards Vice Director Jing Zhao is Pei Zan’s nephew.',
    idiomatic: 'On guisi Jing Zhao, nephew of Pei Zan, was targeted.',
  },
  s1140: {
    literal: 'Often tied to the uncle, or by classics degree obstructed the literary handle, or by private affairs stole transforming power.',
    idiomatic: 'He had traded on his uncle’s name to meddle in appointments.',
  },
  s1141: {
    literal: 'Zan already demoted left—why do you still pursue!',
    idiomatic: 'Zan was gone—why follow him still?”',
  },
  s1142: {
    literal: 'May be demoted to Xuzhou Xiao county aide.',
    idiomatic: 'He was demoted to aide of Xiao in Xuzhou.',
  },
  s1143: {
    literal: '” On bingshen, edict: “Fujian each year presents olive fruit; recently because eunuchs came from Min, dragged into fondness between tastes, thus became tribute canon.',
    idiomatic: 'On bingshen Fujian’s olive tribute was canceled—eunuchs from Min had made it a whim.',
  },
  s1144: {
    literal: 'Though praising loyal candor, I fear troubling labor.',
    idiomatic: 'Tribute flattered loyalty but burdened the people.',
  },
  s1145: {
    literal: 'Hereafter only supply wax-noodle tea; presenting olive fruit should stop.',
    idiomatic: 'Only wax-noodle tea would be sent thereafter.',
  },
  s1146: {
    literal: '” On wuxu, edict: “Mizhou magistrate Pei Lian demoted to Dengzhou Mouping aide; Changshui magistrate Cui Renlue Zizhou Gaoyuan aide; Fuchang chief clerk Lu Xun Yizhou Xintai aide; Nishui magistrate Dugu Tao Fan county aide—all supernumerary posts; all Pei Shu, Cui Yuan, Lu Yi clansmen.',
    idiomatic: 'On wuxu more clan members of the murdered ministers were exiled to petty posts.',
  },
  s1147: {
    literal: 'On renyin, Hunan Ma Yin memorialized: beside Yue Prefecture’s Dongting and Qingcao, four ancient shrines, formerly ruined—I restored the temples finished, begging grant name plaques.',
    idiomatic: 'On renyin Ma Yin of Hunan asked titles for four shrines he had rebuilt beside Dongting Lake.',
  },
  s1148: {
    literal: 'Edict: Yellow Mound Two Consorts shrine called Yijie; Dongting Lord shrine called Lisherhou; Qingcao shrine called Anliu Marquis;',
    idiomatic: 'They were named Yijie for the Two Consorts, Lisherhou for Dongting’s lord, Anliu Marquis for Qingcao;',
  },
  s1149: {
    literal: 'Three Gorges Great Officer shrine—formerly Li Lang observation commissioner Lei Man memorialized, already enfeoffed Bright Spirit Marquis—should follow Tianyou year 1 ninth month twenty-ninth day edict disposition.',
    idiomatic: 'the Three Gorges officer kept his prior Bright Spirit Marquis title from Lei Man’s memorial.',
  },
  s1150: {
    literal: 'On bingwu, Quanzhong memorialized: “Received Grand Councillor Liu Can’s record: wishes to dismantle North Mang foot Xuan Yuan Abbey and move into the capital, at Qinghua ward take old Zhaoming Temple base, build Taiwei Palace, prepare tenth month ninth day southern suburban affairs.',
    idiomatic: 'On bingwu Quanzhong reported Liu Can’s plan to move Xuan Yuan Abbey into Qinghua ward for the suburban rite.',
  },
  s1151: {
    literal: 'Because Extended Treasury salt-and-iron altogether have no material power, ordered your servant to discuss.',
    idiomatic: 'The treasury had no funds—Quanzhong was asked to pay.',
  },
  s1152: {
    literal: 'Your servant already dispatched controller of Six Armies Zhang Quanyi to direct work finished.',
    idiomatic: 'He had Zhang Quanyi finish the work.',
  },
  s1153: {
    literal: '” Favorable edict praised it.',
    idiomatic: 'The emperor praised him.',
  },
  s1154: {
    literal: 'On dingwei, edict: “Crown Prince Mentor Liu Xun once was Zhang Jun’s rent-and-tax clerk; also when Wang Pu supervised revision memorialized him as clerk, appointed Minister of Works; also with Zhao Chong, Pei Zan sworn-neck friendship.',
    idiomatic: 'On dingwei Liu Xun, ally of the fallen, was forced to retire.',
  },
  s1155: {
    literal: 'Yesterday when Pei Shu and others met guilt, should have been implicated together; still pitying evening years, temporarily permitting suspended carriage—may keep original office and retire.',
    idiomatic: 'He should have shared their guilt; only age spared him retirement.',
  },
  s1156: {
    literal: '” On wushen, edict former Merit aide, bearer of crimson fish Li Yangu demoted to Court of Imperial Guards chief clerk.',
    idiomatic: 'On wushen Li Yangu was demoted to a minor guards post.',
  },
  s1157: {
    literal: 'On the first day of the seventh month, wuwu.',
    idiomatic: 'On wuwu, the first day of the seventh month.',
  },
  s1158: {
    literal: 'On xinyou, granted Quanzhong “Record of Welcoming the Imperial Carriage and Recording Merit” stele text, erected within the capital.',
    idiomatic: 'On xinyou Quanzhong received a merit stele erected in the capital.',
  },
  s1159: {
    literal: 'Quanzhong presented aid for suburban ritual money thirty thousand strings.',
    idiomatic: 'He gave thirty thousand strings cash for the suburban rite.',
  },
  s1160: {
    literal: 'On guihai, again demoted Liu Xun to Caozhou aide.',
    idiomatic: 'On guihai Liu Xun was demoted again to Caozhou aide.',
  },
  s1161: {
    literal: 'On xinsi, edict Quanzhong requested cast Hezhong, Jin, Jiang prefectural seals; county names with “city” character all drop down, like Mi, Zheng, Jiang, Pu precedent—single name as text.',
    idiomatic: 'On xinsi Quanzhong was allowed new county seals dropping the character “city.”',
  },
  s1162: {
    literal: 'On renwu, Grand Councillor Liu Can, Minister of Rites Su Xun filled Empress Dowager investiture ritual commissioners.',
    idiomatic: 'On renwu Liu Can and Su Xun led the Empress Dowager’s investiture.',
  },
  s1163: {
    literal: 'That day, at Accumulated Goodness Palace rites finished, emperor rode palanquin to Empress Dowager’s palace to offer congratulations.',
    idiomatic: 'That day, at Accumulated Goodness Palace, the boy emperor went to congratulate her.',
  },
  s1164: {
    literal: 'On bingxu, Director of Rites memorialized: “Each month new and full moon, emperor goes to Accumulated Goodness Palace for routine audience; civil and military hundred officials at palace gate present names for routine audience.',
    idiomatic: 'On bingxu monthly visits to the dowager at Accumulated Goodness Palace were fixed.',
  },
  s1165: {
    literal: '” Approved.',
    idiomatic: 'Approved.',
  },
  s1166: {
    literal: 'On the first day of the eighth month, dinghai.',
    idiomatic: 'On dinghai, the first day of the eighth month.',
  },
  s1167: {
    literal: 'On wuzi, edict Secretariat drafter Yao Ji may be Households Vice Minister, fill marshal’s headquarters judge—on Quanzhong’s memorial.',
    idiomatic: 'On wuzi Yao Ji became Households Vice Minister and judge at Quanzhong’s headquarters.',
  },
  s1168: {
    literal: 'Luoyuan commissioner memorialized Gushui estate land within had auspicious grain double ears.',
    idiomatic: 'The Luoyuan commissioner reported double-eared grain at Gushui estate.',
  },
  s1169: {
    literal: 'On yiwei, edict: “False claiming office rank, Quanzhou Jinjiang county presented scholar for classics degree Chen Wenju confessed crimes; entrust Henan prefecture to decide and execute.',
    idiomatic: 'On yiwei a fake degree-holder in Jinjiang was sent to Henan for execution.',
  },
  s1170: {
    literal: 'On gengzi, edict: “Han dynasty founding ministers, Deng Yu topped the feudal lords;',
    idiomatic: 'On gengzi an edict ranked Quanzhong beside Han and Jin paragons.',
  },
  s1171: {
    literal: 'Jin dynasty heavy position, Wang Dao stood before the hundred ministers.',
    idiomatic: 'Like Deng Yu and Wang Dao, merit earned singular honor.',
  },
  s1172: {
    literal: 'All the Way displayed in aiding support, achievement proclaimed to the realm; in exalted favor, quite different in rank.',
    idiomatic: 'Their service had steadied realms; reward should be unmatched.',
  },
  s1173: {
    literal: 'I obtained with slight body to again raise great fortune; all concerning institutions must follow old statutes; truly rely on meritorious worthies to forever settle the altars.',
    idiomatic: 'The boy throne rose by merit; institutions would follow old forms.',
  },
  s1174: {
    literal: 'Deputy Marshal Prince of Liang correctly holds Grand Preceptor, Central Director; Zhongwu military governor, Henan governor Zhang Quanyi also correctly holds Central Director—both deeply relied upon, all upright as scale beam.',
    idiomatic: 'The Prince of Liang held Grand Preceptor and Director; Zhang Quanyi held Director—both pillars.',
  },
  s1175: {
    literal: 'Court investiture rites, announcing sacrifice to heaven, earth, and ancestral temple—the Minister of Works then sends an official to act; Grand Preceptor, Palace Attendant, Central Director then Grand Councillors act.',
    idiomatic: 'At state rites the Minister of Works or chancellors would stand in by rank.',
  },
  s1176: {
    literal: 'Now Grand Preceptor Deputy Marshal’s task crowns the frontier; each time rites are performed, sometimes not in the capital—then affairs require a stand-in as Grand Preceptor to perform.',
    idiomatic: 'When the Prince of Liang was away, another must act as Grand Preceptor.',
  },
  s1177: {
    literal: 'Quanyi now dwells at the gate, task in the center pivot—may not further appoint another to act Central Director affairs.',
    idiomatic: 'Zhang Quanyi was in the capital and would act Director himself.',
  },
  s1178: {
    literal: 'The Grand Preceptor office—if the Prince of Liang attends court in the capital, then entrust performance; if again goes to garrison, then per before act.',
    idiomatic: 'If the Prince of Liang was present he would perform; if in his province, a stand-in would.',
  },
  s1179: {
    literal: 'What should stand in as Central Director, then entrust Quanyi with original office to perform rites.',
    idiomatic: 'Quanyi would perform Director rites in his own person.',
  },
  s1180: {
    literal: 'Palace Attendant, Minister of Works, Minister of Education then temporarily assign officials.',
    idiomatic: 'Palace Attendant and the Works and Education ministers would be named ad hoc.',
  },
  s1181: {
    literal: 'Entrust the responsible offices.',
    idiomatic: 'So ordered.',
  },
  s1182: {
    literal: '” On renyin, edict: “Former Grand Master, War Vice Minister, bearer of purple-gold fish Sikong Tu handsome talent passed degree, vermilion and purple rose in registry; already nurturing height to disdain the age, like moving a mountain to fish for name.',
    idiomatic: 'On renyin Sikong Tu, lofty scholar who scorned office, was sent home.',
  },
  s1183: {
    literal: 'Will delighted in rinsing streams, heart light on eating salary.',
    idiomatic: 'He loved streams more than salary.',
  },
  s1184: {
    literal: 'Neither Yi nor Hui—hard to dwell in the impartial court;',
    idiomatic: 'Neither helpful nor gracious—he could not serve an impartial court;',
  },
  s1185: {
    literal: 'repeatedly reflecting, repeatedly thinking—should follow secluded dwelling’s will.',
    idiomatic: 'reflection counseled retreat.',
  },
  s1186: {
    literal: 'Should release to return to Zhongtiao Mountain.',
    idiomatic: 'He was released to Zhongtiao Mountain.',
  },
  s1187: {
    literal: '” On guimao, edict Director of Rites Zhang Tingfan should be southern suburban ritual commissioner.',
    idiomatic: 'On guimao Zhang Tingfan led the southern suburban rites.',
  },
  s1188: {
    literal: 'On dingwei, edict stripped Jingxiang military governor Zhao Kuangning of all offices and ranks held in life.',
    idiomatic: 'On dingwei Zhao Kuangning was stripped of every rank.',
  },
  s1189: {
    literal: 'That month on yiwei, Quanzhong sent great general Yang Shihou to campaign against Kuangning, taking Tang, Deng, Fu, Ying, Sui and other prefectures; Quanzhong himself led personal army to go.',
    idiomatic: 'That yiwei Quanzhong sent Yang Shihou against Kuangning and marched himself after taking several prefectures.',
  },
  s1190: {
    literal: 'Jingxiang’s army arrayed on the Han River’s north bank.',
    idiomatic: 'The Jingxiang army lined the north bank of the Han.',
  },
  s1191: {
    literal: 'On the first day of the ninth month, dingsi.',
    idiomatic: 'On dingsi, the first day of the ninth month.',
  },
  s1192: {
    literal: 'On xinyou, Yang Shihou at sixty li west of Xiang Prefecture at Yingu River mouth felled bamboo and wood for a pontoon bridge.',
    idiomatic: 'On xinyou Yang Shihou built a pontoon bridge sixty li west of Xiangzhou at Yingu River.',
  },
  s1193: {
    literal: 'On guihai, bridge completed, led army across the river.',
    idiomatic: 'On guihai the bridge was done and the army crossed.',
  },
  s1194: {
    literal: 'On jiazi, Zhao Kuangning led crack troops twenty thousand, arrayed at the river’s shore.',
    idiomatic: 'On jiazi Zhao Kuangning drew up twenty thousand elite troops on the shore.',
  },
  s1195: {
    literal: 'Shihou one battle defeated him, then taking victory pursued, arrayed below the city.',
    idiomatic: 'Shihou routed him in one fight and pressed to the walls.',
  },
  s1196: {
    literal: 'That night, Kuangning took wife and children, broke encirclement and fled.',
    idiomatic: 'That night Kuangning fled with his family through the broken siege.',
  },
  s1197: {
    literal: 'On yichou, Shihou entered Xiangyang.',
    idiomatic: 'On yichou Shihou entered Xiangyang.',
  },
  s1198: {
    literal: 'On bingyin, Quanzhong followed and arrived.',
    idiomatic: 'On bingyin Quanzhong arrived in pursuit.',
  },
  s1199: {
    literal: 'On renshen, Kuangning’s staff officer Wang Jianwu sent escort officer Chang Zhi with Jingnan surrender.',
    idiomatic: 'On renshen Wang Jianwu sent Chang Zhi to surrender Jingnan.',
  },
  s1200: {
    literal: 'Saying acting Jingnan military government Zhao Kuangming on the eleventh of this month abandoned the city, went up the gorges, fled to Shu.',
    idiomatic: 'He said Zhao Kuangming had abandoned the city on the eleventh and fled upriver into Shu.',
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
