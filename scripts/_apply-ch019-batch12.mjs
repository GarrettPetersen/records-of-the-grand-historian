#!/usr/bin/env node
/** Batch 12: s1101–s1200 (Jiutangshu ch.019, Yizong–Xizong) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/019.json';
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
    literal: 'Heir-apparent Grand Protector Cui Anqian was made deputy.',
    idiomatic: 'Cui Anqian became deputy commander.',
  },
  s1102: {
    literal: 'Army-watching commissioner Ximen Sigong was made overall campaign army overseer;',
    idiomatic: 'Ximen Sigong oversaw campaign armies.',
  },
  s1103: {
    literal: 'Secretariat Vice Director, Grand Councillor, salt transport commissioner Wei Zhaodu was made supply commissioner.',
    idiomatic: 'Wei Zhaodu supplied the armies.',
  },
  s1104: {
    literal: 'Huainan commissioner Gao Pian had been overall commander; since the imperial flight envoys repeatedly urged Pian to march; Pian pleaded Zhou Bao and Liu Hanhong were hostile, delayed half a year, never marched, and Duo replaced him.',
    idiomatic: 'Gao Pian delayed half a year; Wang Duo replaced him.',
  },
  s1105: {
    literal: 'Hezhong commissioner Wang Chongrong was made northern capital overall commander; Yiwu commissioner Wang Chucun eastern; Yan-Yan commissioner Li Xiaochang western; Shuofang commissioner Tuoba Sigong southern.',
    idiomatic: 'Four commissioners ringed the capital region.',
  },
  s1106: {
    literal: 'Loyalty-and-Faith overseer Yang Fuguang was made overall campaign army supervisor, replacing Ximen Sigong.',
    idiomatic: 'Yang Fuguang replaced Ximen Sigong as army supervisor.',
  },
  s1107: {
    literal: 'Wang Duo was permitted to act at discretion.',
    idiomatic: 'Wang Duo could act at discretion.',
  },
  s1108: {
    literal: 'Court gentlemen and censors were sent through the realm to levy troops for Guanzhong.',
    idiomatic: 'Envoys levied troops for Guanzhong.',
  },
  s1109: {
    literal: 'Eighth month: northern campaign officers Zhuge Shuang, Zhu Mei, and Tuoba Sigong camped at Wei Bridge.',
    idiomatic: 'In the eighth month allied armies camped at Wei Bridge.',
  },
  s1110: {
    literal: 'Zhu Mei camped at Xingping, was struck by rebel Wang Fan, and retreated to defend Fengtian.',
    idiomatic: 'Zhu Mei was beaten back to Fengtian.',
  },
  s1111: {
    literal: 'Zhuge Shuang surrendered to the rebels, who falsely made him Heyang military commissioner.',
    idiomatic: 'Zhuge Shuang surrendered and took a false Heyang post.',
  },
  s1112: {
    literal: 'Xu garrison officer Qin Zongquan reported victory at Ruzhou and was made Chai prefect defense commissioner.',
    idiomatic: 'Qin Zongquan was made Chai defense commissioner.',
  },
  s1113: {
    literal: 'Zhaoyi commissioner Gao Xun fought rebel Li Xiang at Shiqiao, was defeated, and retreated to Hezhong.',
    idiomatic: 'Gao Xun lost to Li Xiang and fell back to Hezhong.',
  },
  s1114: {
    literal: 'The rebels in victory took Tongzhou.',
    idiomatic: 'Rebels took Tongzhou.',
  },
  s1115: {
    literal: 'Ninth month: Zelu officer Liu Guang mutinied and seized Lu prefecture.',
    idiomatic: 'Liu Guang seized Lu prefecture.',
  },
  s1116: {
    literal: 'That month Jingxing Pass garrison officer Meng Fangli led troops against Liu Guang and killed him.',
    idiomatic: 'Meng Fangli killed Liu Guang.',
  },
  s1117: {
    literal: 'Fangli styled himself acting commander and moved his army to Xingzhou.',
    idiomatic: 'Meng Fangli became acting commander at Xing.',
  },
  s1118: {
    literal: 'An order made capital four-side urging commissioner, Acting Minister of War Wang Hui Acting Left Vice Premier, concurrent Lu grand protector, Zhaoyi commander, and Lu-Xing-Ming-Ci observation commissioner.',
    idiomatic: 'Wang Hui took Zhaoyi command.',
  },
  s1119: {
    literal: 'Gao Xun was demoted to Duanzhou vice prefect.',
    idiomatic: 'Gao Xun was banished to Duanzhou.',
  },
  s1120: {
    literal: 'Yang Fuguang and Wang Chongrong camped at Wugong with Hexi, Zhaoyi, Loyalty-and-Faith, and Yicheng troops.',
    idiomatic: 'Allied armies camped at Wugong.',
  },
  s1121: {
    literal: 'Fengxiang commissioner Zheng Tian was recalled ill; Fengxiang great general Li Changyan replaced Tian as commissioner and western capital campaign overall commander.',
    idiomatic: 'Li Changyan replaced the ill Zheng Tian at Fengxiang.',
  },
  s1122: {
    literal: 'Tenth month: Qingzhou troops mutinied, expelled commissioner An Shiru, and made camp officer Wang Jingwu acting commander.',
    idiomatic: 'Qingzhou troops made Wang Jingwu acting commander.',
  },
  s1123: {
    literal: 'Twelfth month: campaign overall commander Wang Duo led thirty thousand imperial and Shannan East troops to the capital region and camped at Zhaoge.',
    idiomatic: 'Wang Duo camped thirty thousand at Zhaoge.',
  },
  s1124: {
    literal: 'Zhonghe 2, spring, first month, jiachen new moon: armies aiding the throne gathered thick at the capital; the capital ran out of food.',
    idiomatic: 'Zhonghe 2 opened with the capital starving amid converging allies.',
  },
  s1125: {
    literal: 'Rebels ate tree bark and used gold and jade to buy people from campaign armies; men gained millions.',
    idiomatic: 'Rebels bought people from allied camps with gold.',
  },
  s1126: {
    literal: 'Refugees in hills and valleys were often seized and sold by the various armies.',
    idiomatic: 'Armies sold refugees they captured.',
  },
  s1127: {
    literal: 'Second month: Jingyuan great general Tang Hongfu routed rebel Lin Yan at Xingping with tens of thousands captured or killed.',
    idiomatic: 'Tang Hongfu routed Lin Yan at Xingping.',
  },
  s1128: {
    literal: 'Wang Chucun led twenty thousand straight into the capital; rebels feigned withdrawal.',
    idiomatic: 'Wang Chucun entered Chang\'an as rebels feigned flight.',
  },
  s1129: {
    literal: 'Capital commoners welcomed Chucun with shouts and clamor.',
    idiomatic: 'Citizens cheered Wang Chucun\'s entry.',
  },
  s1130: {
    literal: 'That day troops had no order, seized mansions, and carried off courtesans.',
    idiomatic: 'Allied troops looted mansions and seized women.',
  },
  s1131: {
    literal: 'Rebels re-entered through Ba Gate; Chucun\'s host fled in panic and was defeated.',
    idiomatic: 'Rebels re-entered and routed Chucun.',
  },
  s1132: {
    literal: 'Huang Chao, angered that people welcomed Chucun, killed every able-bodied man and wards ran with blood.',
    idiomatic: 'Huang Chao massacred men after the welcome for Chucun.',
  },
  s1133: {
    literal: 'Thereafter armies withdrew and rebel fury grew hotter.',
    idiomatic: 'Allies withdrew and rebel power surged.',
  },
  s1134: {
    literal: 'Third month: former Yun prefect Su You was beaten by Shatuo, abandoned his post for Zhenzhou, reached Lingshou, was robbed by locals, and killed by Wang Jingchong.',
    idiomatic: 'Su You was killed fleeing Shatuo.',
  },
  s1135: {
    literal: 'Seventh month, xinchou new moon.',
    idiomatic: 'The seventh month opened on xinchou.',
  },
  s1136: {
    literal: 'On bingwu night crimson vapor in the northwest stretched like a scarlet rainbow across heaven.',
    idiomatic: 'On bingwu night a crimson arc filled the sky.',
  },
  s1137: {
    literal: 'Rebel Shang Rang attacked Yijun fort; snow a foot deep and bitter cold froze twelve or thirteen in ten of the rebels.',
    idiomatic: 'Snow and cold decimated Shang Rang\'s force at Yijun.',
  },
  s1138: {
    literal: 'On gengzi rebel Tongzhou defense commissioner Zhu Wen killed overseer Yan Shi and with Hu Zhen, Xie Tong, and others surrendered; Wang Duo by order made him Hua prefect, Tong Pass defense commissioner, and Zhenguo army commander.',
    idiomatic: 'Zhu Wen killed his overseer and surrendered to Wang Duo.',
  },
  s1139: {
    literal: 'Weibo commissioner Han Jian personally led thirty thousand against Heyang; false commissioner Zhuge Shuang abandoned the city; Jian left a great general to hold Heyang Bridge and returned.',
    idiomatic: 'Han Jian drove Zhuge Shuang from Heyang.',
  },
  s1140: {
    literal: 'Ninth month: rebels made Huang Ye Hua prefect.',
    idiomatic: 'Rebels installed Huang Ye at Hua.',
  },
  s1141: {
    literal: 'Earlier rebels had Li Xiang hold Hua; Xiang was friendly with Zhu Wen; when Wen returned to Hezhong Huang Chao sent eunuch Hou Rong with a thousand merit horses to Hua to kill Xiang and replace him with Ye.',
    idiomatic: 'Huang Chao killed Li Xiang and replaced him with Huang Ye.',
  },
  s1142: {
    literal: 'Peach and apricot trees in Taiyuan mountains bore flowers and fruit.',
    idiomatic: 'Taiyuan peaches and apricots flowered out of season.',
  },
  s1143: {
    literal: 'Tenth month: cloudless thunder in the northwest was called "Heaven Dog Falling."',
    idiomatic: 'Cloudless thunder in the northwest was called Heaven Dog Falling.',
  },
  s1144: {
    literal: 'Lan prefect Tang Qun was made Huai prefect; Qun relied on Shatuo support and the court suspected and removed him.',
    idiomatic: 'Tang Qun was moved from Lan amid Shatuo ties.',
  },
  s1145: {
    literal: 'Zheng Congdang sent men to deliver the commission; Qun in anger killed the envoy, held the city, and admitted Shatuo.',
    idiomatic: 'Tang Qun killed the envoy and admitted Shatuo.',
  },
  s1146: {
    literal: 'Weibo commissioner Han Jian attacked Yanzhou; commissioner Cao Quanchao resisted, was defeated, seized, and killed.',
    idiomatic: 'Han Jian killed Cao Quanchao at Yanzhou.',
  },
  s1147: {
    literal: 'Cao\'s great general Zhu Xuan held Yan with the remnant, sued for peace with Jian, and Jian left him.',
    idiomatic: 'Zhu Xuan held Yan and made peace with Han Jian.',
  },
  s1148: {
    literal: 'Eleventh month: Shatuo Li Keyong\'s overseer Chen Jingsi led seventeen thousand tribal horsemen from the Lan-Shi route to Hezhong.',
    idiomatic: 'Chen Jingsi brought seventeen thousand Shatuo cavalry to Hezhong.',
  },
  s1149: {
    literal: 'Under Li Xiang a garrison band killed Hua defender Gui Ming; Wang Duo used his officer Wang Yu as Hua prefect.',
    idiomatic: 'Wang Yu replaced the slain Gui Ming at Hua.',
  },
  s1150: {
    literal: 'Twelfth month, jihai new moon.',
    idiomatic: 'The twelfth month opened on jihai.',
  },
  s1151: {
    literal: 'On gengxu Chengde commissioner, Zhen-Ji-Shen-Zhao observation commissioner, Palladium Grand Preceptor, Acting Grand Preceptor, Secretariat Director, Pillar of State, Prince of Changshan with six thousand households Wang Jingchong died; posthumously Grand Tutor, posthumous title Loyal and Solemn.',
    idiomatic: 'Wang Jingchong died and was posthumously Loyal and Solemn.',
  },
  s1152: {
    literal: 'His final memorial asked his son Yin to succeed in command; Yin was made army acting commander.',
    idiomatic: 'Wang Yin succeeded his father as acting commander.',
  },
  s1153: {
    literal: 'Zhonghe 3, spring, first month, wuchen new moon: the train was at Chengdu.',
    idiomatic: 'Zhonghe 3 opened at Chengdu.',
  },
  s1154: {
    literal: 'Yanmen commissioner, Acting Minister of Works Li Keyong led troops to Hezhong.',
    idiomatic: 'Li Keyong reached Hezhong.',
  },
  s1155: {
    literal: 'On jisi Shatuo advanced to camp at Qian Pit in Sha Yuan.',
    idiomatic: 'Shatuo camped at Qian Pit in Sha Yuan.',
  },
  s1156: {
    literal: 'Second month: Shatuo attacked Hua; prefect Huang Ye fled to Shidi Valley and was captured in pursuit.',
    idiomatic: 'Huang Ye was captured fleeing Hua.',
  },
  s1157: {
    literal: 'Weibo commissioner Han Jian again raised troops against Heyang; Zhuge Shuang sent Li Hanzhi to meet him at Wuzhi, counterattacked, and Weibo was routed.',
    idiomatic: 'Li Hanzhi routed Han Jian at Wuzhi.',
  },
  s1158: {
    literal: 'Great general Yue Yanzhen first held Weizhou; Han Jian was killed by his men and Yan Zhen was pushed as acting commander.',
    idiomatic: 'Yue Yanzhen replaced the slain Han Jian at Weibo.',
  },
  s1159: {
    literal: 'Li Keyong was advanced Acting Left Vice Premier and Yan-Dai-Yun-Wei observation commissioner.',
    idiomatic: 'Keyong was advanced to left vice premier.',
  },
  s1160: {
    literal: 'Third month, dingmao new moon.',
    idiomatic: 'The third month opened on dingmao.',
  },
  s1161: {
    literal: 'On renshen Shatuo fought rebel Zhao Zhang and Shang Rang at Chengdian; rebels were routed; pursuit reached Liangtian Slope with corpses thirty li;',
    idiomatic: 'Shatuo routed rebels at Chengdian for thirty li of dead.',
  },
  s1162: {
    literal: 'Wang Chongrong heaped corpses into a victory mound.',
    idiomatic: 'Wang Chongrong built a corpse mound.',
  },
  s1163: {
    literal: 'Fourth month, dingyou new moon.',
    idiomatic: 'The fourth month opened on dingyou.',
  },
  s1164: {
    literal: 'On gengzi Shatuo, Loyalty-and-Faith, Yicheng, and Yiwu armies pressed Chang\'an; rebels massed at Wei Bridge, were routed, and fled;',
    idiomatic: 'Allied armies routed rebels at Wei Bridge.',
  },
  s1165: {
    literal: 'Li Keyong pursued in victory.',
    idiomatic: 'Li Keyong pursued.',
  },
  s1166: {
    literal: 'On jimao Huang Chao gathered remnants and fled through Lantian Pass.',
    idiomatic: 'On jimao Huang Chao fled through Lantian.',
  },
  s1167: {
    literal: 'On gengchen the capital was recovered.',
    idiomatic: 'On gengchen Chang\'an was recovered.',
  },
  s1168: {
    literal: 'Overall campaign army supervisor Yang Fuguang memorialized victory to the court, saying: "Lately demons rose in mist markets and gathered in shrines, while governors and frontier lords were lax against bandits.',
    idiomatic: 'Yang Fuguang reported victory, blaming lax frontier defense.',
  },
  s1169: {
    literal: 'They thought the Great Unity\'s fortune could always harbor treachery;',
    idiomatic: 'They thought the dynasty could always harbor traitors;',
  },
  s1170: {
    literal: 'they thought in untroubled seasons to let wickedness grow long."',
    idiomatic: 'they let wickedness grow in peacetime."',
  },
  s1171: {
    literal: 'Rebel chief Huang Chao thus filled dens and spread through marshes, driving our people to his fierce revolt.',
    idiomatic: 'Huang Chao spread revolt and drove the people.',
  },
  s1172: {
    literal: 'He sharpened hoes and cranes into blades, slaughtered plow oxen for siege engines; demons walked by day and serpents devoured by night.',
    idiomatic: 'Rebels forged weapons and terrorized day and night.',
  },
  s1173: {
    literal: 'Since the south sea fell and Hunan armies were lost, nurturing tigers deepened disaster and taming owls magnified treason.',
    idiomatic: 'Southern losses fed the rebels\' strength.',
  },
  s1174: {
    literal: 'Nothing was spared harm, no evil uncommitted; wolves and jackals troubled the markets and sores reached the heart.',
    idiomatic: 'Rebel cruelty reached the empire\'s heart.',
  },
  s1175: {
    literal: 'Poison flowed to the myriad people, bandits defiled the two capitals; gentry bore charcoal grief and prefectures rose in ruin.',
    idiomatic: 'The capitals and countryside were ruined.',
  },
  s1176: {
    literal: 'All regions raged together, ten circuits attacked together, relying on the nine temples\' numinous power to destroy years of fierce villains.',
    idiomatic: 'Ten circuits destroyed the rebels by the ancestral temples\' power.',
  },
  s1177: {
    literal: 'Hezhong commissioner Wang Chongrong was divinely bold, Heaven-gifted in stratagem, sworn to merit and devoted to the state.',
    idiomatic: 'Wang Chongrong was bold and loyal.',
  },
  s1178: {
    literal: 'In garrison farming and awaiting the enemy he led troops in the van, sheltered more than one hundred thousand civilians, and reduced rebel bands by more than thirty thousand.',
    idiomatic: 'Chongrong sheltered civilians and reduced rebel bands.',
  },
  s1179: {
    literal: 'Lawful and weighty, his merit came late; long he delayed field punishment and had not yet loosed thunder wrath.',
    idiomatic: 'Chongrong\'s victory came after long restraint.',
  },
  s1180: {
    literal: 'Since recovering Tong and Hua he pressed the capital; evening beacons blazed at the national gate and raiders often reached Ba shore.',
    idiomatic: 'Chongrong\'s beacons blazed at the capital gates.',
  },
  s1181: {
    literal: 'Knowing the four corners cut off, they tried every escape like birds striking a cage or moths rushing flame.',
    idiomatic: 'Trapped rebels rushed every escape.',
  },
  s1182: {
    literal: 'Yanmen commissioner Li Keyong inherited generalship, Heaven-bestowed loyalty; stratagem and martial skill excelled and ministerial duty matched his heart.',
    idiomatic: 'Li Keyong was loyal, skilled, and fierce.',
  },
  s1183: {
    literal: 'Killing rebels he always struck with his own hand; entering battle he led in person—truly heroic, worthy the name Flying General.',
    idiomatic: 'Keyong killed rebels with his own hand and led every charge.',
  },
  s1184: {
    literal: 'Leading his army south he advanced with me in one heart; even asleep he did not forget the bandits.',
    idiomatic: 'Keyong marched south and never forgot the enemy.',
  },
  s1185: {
    literal: 'This month on the eighth day he sent forward Yang Shouzong, Hezhong cavalry officer Bai Zhiyi, Hengye commander Man Cun, Tread-Cloud commander Ding Xingcun, Chaoyi garrison officer Kang Shizhen, Loyalty-and-Faith Yellow-Head commander Pang Cong, and thirty-two commands with Keyong through Guangtai Gate first into the capital to crush the wicked.',
    idiomatic: 'On the eighth Keyong\'s thirty-two commands entered through Guangtai Gate.',
  },
  s1186: {
    literal: 'He also sent Hezhong\'s Liu Rang, Wang Gui, Ji Junwu, Sun Qi, Loyalty-and-Faith\'s Qiao Congyu, Zheng-Hua\'s Han Congwei, Jingnan\'s Shentu Xin, Cangzhou\'s Jia Tao, Yiding\'s Zhang Zhongqing, Shouzhou\'s Zhang Xingfang, Tiande\'s Gu Yanlang, Left Divine Strategy crossbowmen Zhen Jun Chu and Gongsun Zuo, Hengchong commander Yang Shouliang, Tread-Cloud commander Gao Zhouyi, Zhongshun commander Hu Zhen, Jiangzhou overseers Mao Xuanbo and Nie Hongyu, and seventy commands following.',
    idiomatic: 'Seventy more commands followed into the capital.',
  },
  s1187: {
    literal: 'Rebels still held a firm line to resist the government army.',
    idiomatic: 'Rebels still held firm lines.',
  },
  s1188: {
    literal: 'Li Keyong urged the brave, arrayed arms and armor; shouts shook tiles and war cries seemed to swallow sand.',
    idiomatic: 'Keyong\'s shouts shook the battlefield.',
  },
  s1189: {
    literal: 'He spread spears and halberds and ordered a pincer attack from mao to shen; the wicked were routed.',
    idiomatic: 'From mao to shen Keyong crushed the rebels.',
  },
  s1190: {
    literal: 'From Wangchun Palace they were driven to kill; at Shengyang Hall they were encircled; weapons were not swung wildly, arrows did not fly in vain.',
    idiomatic: 'The encirclement from Wangchun to Shengyang spared no blow.',
  },
  s1191: {
    literal: 'The rebels at once fled, scattered into Shangshan, merely prolonging a blade\'s edge, awaiting heads for the wine cup.',
    idiomatic: 'Rebels fled into Shangshan awaiting decapitation.',
  },
  s1192: {
    literal: 'Since recovering the capital all three sides won great merit; in breaking enemies and crushing spearpoints Yanmen truly ranks first.',
    idiomatic: 'Yanmen ranked first in recovering the capital.',
  },
  s1193: {
    literal: 'Other officers likewise drove hard; with my own more than twenty thousand, years in wind and rain—now that calm is achieved, all are recorded and reported."',
    idiomatic: 'Fuguang listed all allies and his own twenty thousand."',
  },
  s1194: {
    literal: '" When the report arrived attendants congratulated.',
    idiomatic: 'The victory report brought court congratulations.',
  },
  s1195: {
    literal: 'Fifth month: Hezhong commissioner, Acting Right Vice Premier Wang Chongrong was made Acting Minister of Works and Grand Councillor, the rest unchanged.',
    idiomatic: 'Wang Chongrong became councillor and Minister of Works.',
  },
  s1196: {
    literal: 'Northern campaign commissioner, Yan-Dai-Yun-Wei observation commissioner, Acting Left Vice Premier, Dai prefect, Pillar of State with seven hundred households Li Keyong was made Acting Minister of Works and Grand Councillor, concurrent Taiyuan mayor, northern capital protector, and Hedong observation commissioner.',
    idiomatic: 'Li Keyong took Hedong and joined the council.',
  },
  s1197: {
    literal: 'Yiwu commissioner, Acting Minister of Works Wang Chucun was made Acting Minister of Education and Grand Councillor, the rest unchanged.',
    idiomatic: 'Wang Chucun was advanced to education minister and councillor.',
  },
  s1198: {
    literal: 'Acting Right Vice Premier, Hua prefect, Tong Pass defense commissioner Zhu Wen was made Acting Minister of Works, concurrent Bian prefect, Censor-in-Chief, Xuanwu observation commissioner, and granted the name Quanzhong.',
    idiomatic: 'Zhu Wen became Xuanwu commander and received the name Quanzhong.',
  },
  s1199: {
    literal: 'Northwestern capital campaign overall commander, Grand Master of Splendid Happiness, Acting Minister of Works, Binning commissioner Zhu Mei was advanced Grand Councillor, enfeoffed Marquis of Wuxing with one thousand households.',
    idiomatic: 'Zhu Mei became councillor and Marquis of Wuxing.',
  },
  s1200: {
    literal: 'Yan-Fang commissioner, Grand Master of Splendid Happiness, Acting Right Vice Premier Dongfang Kui was advanced Grand Councillor.',
    idiomatic: 'Dongfang Kui joined the council.',
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
