#!/usr/bin/env node
/** Batch 13: s1201–s1300 (Jiutangshu ch.019, Yizong–Xizong) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/019.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 1201;
const END = 1300;

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
  s1201: {
    literal: 'Wang Duo was removed as campaign overall commander, kept Acting Grand Preceptor and Secretariat Director, advanced to Duke of Jin with two thousand added households, observation commissioner as before.',
    idiomatic: 'Wang Duo was made Duke of Jin but lost overall command.',
  },
  s1202: {
    literal: 'Eunuch Tian Lingzi held power, credited himself with strategy; because Duo had no military success while Yang Fuguang\'s plan to summon Shatuo broke the rebels, he wished power for the northern offices, demoted Wang and favored Fuguang.',
    idiomatic: 'Tian Lingzi favored Fuguang and demoted Wang Duo.',
  },
  s1203: {
    literal: 'Overall campaign army supervisor Yang Fuguang was advanced Palladium Grand Preceptor, Duke of Hongnong with three thousand households, made Tong-Hua and related circuits disposition commissioner, and granted the title "Merit-Faith, Glorious Arms, Nation-Righting, Rebellion-Pacifying Merit Lord."',
    idiomatic: 'Yang Fuguang received grand honors and a merit title.',
  },
  s1204: {
    literal: '" Sixth month, yiwei new moon.',
    idiomatic: 'The sixth month opened on yiwei.',
  },
  s1205: {
    literal: 'On jiazi Yang Fuguang died at Hezhong; his Loyalty-and-Faith eight-command heads Lu Yanhong, Jin Hui, Wang Jian, Han Jian, and others each dispersed their followers.',
    idiomatic: 'Yang Fuguang died; his generals dispersed.',
  },
  s1206: {
    literal: 'His brother Fugong held inner palace secrets; Tian Lingzi feared and hated Fuguang for breaking the rebels, so rewards after peace were thin.',
    idiomatic: 'Tian Lingzi kept rebel rewards thin.',
  },
  s1207: {
    literal: 'Hearing Fuguang dead he was greatly pleased, again drove Fugong out, and removed him from secrets to Flying Dragon commissioner.',
    idiomatic: 'Lingzi demoted Yang Fugong to Flying Dragon commissioner.',
  },
  s1208: {
    literal: 'That month Huang Chao besieged Chenzhou and camped five li north of the prefecture.',
    idiomatic: 'Huang Chao besieged Chenzhou.',
  },
  s1209: {
    literal: 'Earlier, leaving Lantian Pass, forward Meng Kai attacked Cai; prefect Qin Zongquan met him in battle, was beaten, was cornered, and made peace with the rebels.',
    idiomatic: 'Qin Zongquan made peace after defeat at Cai.',
  },
  s1210: {
    literal: 'Meng Kai moved to Chenzhou; prefect Zhao Chou showed weakness, ambushed, and beheaded Kai in battle.',
    idiomatic: 'Zhao Chou ambushed and killed Meng Kai.',
  },
  s1211: {
    literal: 'Kai was the rebels\' beloved general; they deeply mourned him.',
    idiomatic: 'The rebels mourned their favorite Meng Kai.',
  },
  s1212: {
    literal: 'Huang Chao in anger massed all forces against Chenzhou.',
    idiomatic: 'Huang Chao besieged Chenzhou in force.',
  },
  s1213: {
    literal: 'Huang Chao allied with Zongquan and let troops plunder on four sides; near and far all suffered their cruelty.',
    idiomatic: 'The Chen alliance ravaged the countryside.',
  },
  s1214: {
    literal: 'Famine ran years; people had no stores; rebels took people as food; their roasting camps were called "Pounding-Mill Stockades"; white bones piled—no chaos worse.',
    idiomatic: 'Rebels cannibalized captives in "Pounding-Mill Stockades."',
  },
  s1215: {
    literal: 'The siege pressed hard; Xuzhou commissioner Shi Bo, Xu commissioner Zhou Ji, and Bian commissioner Zhu Quanzhong all marched to relieve Chen.',
    idiomatic: 'Shi Bo, Zhou Ji, and Zhu Quanzhong relieved Chen.',
  },
  s1216: {
    literal: 'Seventh month: Xichuan commissioner, Palladium Grand Preceptor, Defender Grand Preceptor, Grand Councillor, Chengdu mayor, Pillar of State, Prince of Yingchuan with three thousand households and four hundred actual fief Chen Jingxuan was granted an iron certificate.',
    idiomatic: 'Chen Jingxuan received an iron certificate.',
  },
  s1217: {
    literal: 'An edict ordered Zheng Congdang to the imperial train.',
    idiomatic: 'Zheng Congdang was summoned to court.',
  },
  s1218: {
    literal: 'Eighth month: Li Keyong went to his post at Taiyuan.',
    idiomatic: 'Li Keyong returned to Taiyuan.',
  },
  s1219: {
    literal: 'Former Zhenwu commissioner, Acting Minister of Works, concurrent Chanyu Protector, Censor-in-Chief Li Guochang was made Acting Minister of Education, Dai prefect, northern campaign commissioner, and Yun-Shuo observation commissioner.',
    idiomatic: 'Li Guochang was restored to the border command.',
  },
  s1220: {
    literal: 'Tenth month: Li Guochang died.',
    idiomatic: 'Li Guochang died.',
  },
  s1221: {
    literal: 'Eleventh month: Cai rebel Qin Zongquan besieged Xuzhou.',
    idiomatic: 'Qin Zongquan besieged Xu.',
  },
  s1222: {
    literal: 'Twelfth month: an edict ordered Hedong Li Keyong to aid Chen and Xu.',
    idiomatic: 'Li Keyong was ordered to aid Chen and Xu.',
  },
  s1223: {
    literal: 'Loyalty-and-Faith great general Lu Yanhong took Xingyuan, expelled commissioner Niu Xu, and styled himself acting commander.',
    idiomatic: 'Lu Yanhong seized Xingyuan.',
  },
  s1224: {
    literal: 'Zhonghe 4, spring, first month, guihai new moon: the train was at Chengdu.',
    idiomatic: 'Zhonghe 4 opened at Chengdu.',
  },
  s1225: {
    literal: 'Second month: Hedong commissioner Li Keyong was about to march to aid Chen and Xu; Heyang commissioner Zhuge Shuang camped at Zezhou to block him.',
    idiomatic: 'Zhuge Shuang blocked Keyong at Zezhou.',
  },
  s1226: {
    literal: 'Third month, renxu new moon.',
    idiomatic: 'The third month opened on renxu.',
  },
  s1227: {
    literal: 'On jiaxu Keyong moved his army south across the Yellow River from Hezhong and east to Luoyang.',
    idiomatic: 'Keyong crossed the river and marched on Luoyang.',
  },
  s1228: {
    literal: 'Fourth month, xinmao new moon.',
    idiomatic: 'The fourth month opened on xinmao.',
  },
  s1229: {
    literal: 'On jiayin Shatuo halted at Xuzhou; commissioner Zhou Ji and overseer Tian Congyi joined battle.',
    idiomatic: 'Shatuo fought at Xuzhou with Zhou Ji.',
  },
  s1230: {
    literal: 'Rebel Shang Rang camped at Taikang; Huang Ye at Xihua with some fodder.',
    idiomatic: 'Shang Rang and Huang Ye held fodder at Taikang and Xihua.',
  },
  s1231: {
    literal: 'On jiwei Shatuo divided forces to attack Taikang and Xihua rebel forts.',
    idiomatic: 'Shatuo stormed Taikang and Xihua.',
  },
  s1232: {
    literal: 'On gengshen Shang Rang and Huang Ye fled; the government army took their fodder and Huang Chao retreated to guard Yancheng.',
    idiomatic: 'Rebels fled; Huang Chao held Yancheng.',
  },
  s1233: {
    literal: 'Vice Minister of War, revenue commissioner Zheng Changtu was made Grand Councillor at his present rank.',
    idiomatic: 'Zheng Changtu joined the council.',
  },
  s1234: {
    literal: 'Fifth month, xinyou new moon.',
    idiomatic: 'The fifth month opened on xinyou.',
  },
  s1235: {
    literal: 'On guihai Shatuo pursued Huang Chao north.',
    idiomatic: 'Shatuo pursued Huang Chao north.',
  },
  s1236: {
    literal: 'On dingmao they halted at Weishi.',
    idiomatic: 'Shatuo camped at Weishi.',
  },
  s1237: {
    literal: 'On wuchen great rain flooded the ground three feet deep and ditches and rivers overflowed.',
    idiomatic: 'Floods three feet deep stalled the pursuit.',
  },
  s1238: {
    literal: 'Rebels reached Zhongmou, wished to cross the Bian River; Shatuo arrived suddenly; rebels were terrified, split and fled, and half were killed or drowned.',
    idiomatic: 'At Zhongmou half the rebels were killed or drowned.',
  },
  s1239: {
    literal: 'Shang Rang\'s army surrendered to Shi Bo; officers Yang Neng, Li Rang, Huo Cun, Ge Congzhou, Zhang Guiba, and others surrendered to Zhu Quanzhong; Li Zhou and Yang Jingbiao fled to Fengqiu with remnants.',
    idiomatic: 'Rebel bands surrendered to Shi Bo and Zhu Quanzhong.',
  },
  s1240: {
    literal: 'On jisi Shatuo crossed the Bian River toward Fengqiu; Huang Chao and his brothers fought with all strength; Li Keyong defeated them.',
    idiomatic: 'Keyong defeated Huang Chao at Fengqiu.',
  },
  s1241: {
    literal: 'They captured fifty thousand men and women, more than ten thousand cattle and horses, and thirty thousand items of false imperial carriages, regalia, seals, treasures, and weapons.',
    idiomatic: 'Keyong seized regalia and fifty thousand captives.',
  },
  s1242: {
    literal: 'They took Chao\'s young son, age six.',
    idiomatic: 'Chao\'s six-year-old son was captured.',
  },
  s1243: {
    literal: 'Huang Chao defeated, led remnants east.',
    idiomatic: 'Huang Chao fled east with remnants.',
  },
  s1244: {
    literal: 'On gengwu Li Keyong hotly pursued Huang Chao two hundred li in one day and night; half the horses died of exhaustion.',
    idiomatic: 'Keyong pursued two hundred li until horses dropped dead.',
  },
  s1245: {
    literal: 'Camping at Yuanqu, grain could not keep up and cavalry were few; he withdrew with Loyalty-and-Faith overseer Tian Congyi.',
    idiomatic: 'Keyong withdrew for lack of grain and horses.',
  },
  s1246: {
    literal: 'On jiaxu he reached Bianzhou; commissioner Zhu Quanzhong lodged Keyong at Shangyuan Post.',
    idiomatic: 'Quanzhong hosted Keyong at Shangyuan Post.',
  },
  s1247: {
    literal: 'Quanzhong, seeing Keyong\'s force weak and the main army far, plotted against him.',
    idiomatic: 'Quanzhong plotted against the weakened Keyong.',
  },
  s1248: {
    literal: 'That night he set wine at the post station; when Keyong was drunk Quanzhong surrounded the post with troops and set fire.',
    idiomatic: 'Quanzhong ambushed and burned the post.',
  },
  s1249: {
    literal: 'Sudden thunderstorm flooded the ground a foot deep; Keyong climbed the wall and barely escaped.',
    idiomatic: 'Rain saved Keyong as he scaled the wall.',
  },
  s1250: {
    literal: 'More than three hundred of his followers and overseer Shi Jingsi and secretary Ren Gui were killed.',
    idiomatic: 'Three hundred followers and Shi Jingsi were killed.',
  },
  s1251: {
    literal: 'On bingzi Keyong reached Xuzhou and led his army back to Taiyuan.',
    idiomatic: 'Keyong returned to Taiyuan via Xu.',
  },
  s1252: {
    literal: 'On gengchen Xuzhou officers Li Shiyue and Chen Jingsi led ten thousand to pursue Huang Chao at Yanzhou.',
    idiomatic: 'Li Shiyue pursued Chao toward Yanzhou.',
  },
  s1253: {
    literal: 'Sixth month: Yanzhou commissioner Zhu Xuan reported great victory over rebels at Hexiang.',
    idiomatic: 'Zhu Xuan reported victory at Hexiang.',
  },
  s1254: {
    literal: 'Autumn, seventh month, jiwei new moon.',
    idiomatic: 'The seventh month opened on jiwei.',
  },
  s1255: {
    literal: 'On guiyou rebel officer Lin Yan beheaded Huang Chao, Huang Kui, and Huang Bing and surrendered heads to Shi Bo.',
    idiomatic: 'Lin Yan beheaded Huang Chao and surrendered to Shi Bo.',
  },
  s1256: {
    literal: 'Earlier Xu general Li Shiyue fought rebels at Xiaqiu; rebels fought to the death and their host was nearly gone.',
    idiomatic: 'Li Shiyue had nearly destroyed the rebels at Xiaqiu.',
  },
  s1257: {
    literal: 'Lin Yan and Chao fled to Xiangwang Village in Taishan\'s Wolf-Tiger Valley; fearing pursuit and shared death, Yan beheaded the rebels and surrendered to Shiyue.',
    idiomatic: 'Lin Yan killed Chao at Wolf-Tiger Valley and surrendered.',
  },
  s1258: {
    literal: 'On renwu the victory report reached the court and attendants congratulated.',
    idiomatic: 'Victory over Huang Chao was celebrated at court.',
  },
  s1259: {
    literal: 'Hedong commissioner Li Keyong repeatedly memorialized his wrongs and asked to attack Bianzhou.',
    idiomatic: 'Li Keyong demanded war on Bianzhou.',
  },
  s1260: {
    literal: 'The Son of Heaven with gracious edicts reconciled them and advanced Keyong to special eminence and enfeoffed him Duke of Longxi to appease him.',
    idiomatic: 'The throne appeased Keyong with Longxi dukedom.',
  },
  s1261: {
    literal: 'From this Quanzhong and Keyong bore a feud of drawn spears.',
    idiomatic: 'Quanzhong and Keyong became bitter enemies.',
  },
  s1262: {
    literal: 'September: Shannan West commissioner Lu Yanhong was attacked by imperial guards, abandoned his city, led followers east through Xiang and Deng, and plundered Xu greatly.',
    idiomatic: 'Lu Yanhong plundered Xu fleeing east.',
  },
  s1263: {
    literal: 'Yanhong\'s generals Wang Jian, Han Jian, Zhang Zao, Jin Hui, and Li Shitai each led their armies to court; Tian Lingzi, as they were Fuguang\'s old officers, slighted them—all made guard generals, only Wang Jian made Bibi prefect.',
    idiomatic: 'Fuguang\'s old generals received slight guard posts.',
  },
  s1264: {
    literal: 'Tenth month: eastern circuits memorialized asking the train to return to the capital.',
    idiomatic: 'Eastern circuits asked the emperor home.',
  },
  s1265: {
    literal: 'Eleventh month: Lu Yanhong took Xu, killed Zhou Ji, styled himself acting commander, and was soon attacked by Qin Zongquan.',
    idiomatic: 'Lu Yanhong seized Xu and was attacked by Qin Zongquan.',
  },
  s1266: {
    literal: 'An order made Yicheng commissioner, Acting Grand Preceptor, Secretariat Director, Pillar of State, Duke of Jin Wang Duo Cangzhou prefect, Yichang army commander, and Cang-De observation commissioner.',
    idiomatic: 'Wang Duo was sent to Cang-De command.',
  },
  s1267: {
    literal: 'Twelfth month, dinghai new moon: Daming Palace protector, acting Jingzhao mayor, Censor-in-Chief, capital-region disposition commissioner Wang Hui with the capital\'s hundred officials memorialized asking the train to return to the palace.',
    idiomatic: 'Wang Hui asked the emperor to return to Chang\'an.',
  },
  s1268: {
    literal: 'An edict set the first month of the coming year for return to the capital.',
    idiomatic: 'Return to Chang\'an was set for the new year.',
  },
  s1269: {
    literal: 'The newly appointed Cang-De commissioner Wang Duo was killed by Weibo commissioner Yue Yanzhen at Gaoji Po in Zhangnan county; more than three hundred followers were killed.',
    idiomatic: 'Wang Duo was murdered at Gaoji Po.',
  },
  s1270: {
    literal: 'Guangqi 1, spring, first month, dingsi new moon: the train was at Chengdu.',
    idiomatic: 'Guangqi 1 opened at Chengdu.',
  },
  s1271: {
    literal: 'On jimao Emperor Xizong returned from Shu to the capital.',
    idiomatic: 'On jimao Xizong left Shu for the capital.',
  },
  s1272: {
    literal: 'Second month, dinghai new moon.',
    idiomatic: 'The second month opened on dinghai.',
  },
  s1273: {
    literal: 'On bingshen the train halted at Fengxiang.',
    idiomatic: 'On bingshen the court halted at Fengxiang.',
  },
  s1274: {
    literal: 'Third month, bingchen new moon.',
    idiomatic: 'The third month opened on bingchen.',
  },
  s1275: {
    literal: 'On dingmao the train reached the capital.',
    idiomatic: 'On dingmao the court reached Chang\'an.',
  },
  s1276: {
    literal: 'On jisi he held court at Xuanzheng Hall, great amnesty, and changed the era to Guangqi.',
    idiomatic: 'On jisi Guangqi was proclaimed with amnesty.',
  },
  s1277: {
    literal: 'Li Changfu held Fengxiang, Wang Chongrong held Pu and Shan, Zhuge Shuang held Heyang and Luoyang, Meng Fangli held Xing and Ming, Li Keyong held Taiyuan and Shangdang, Zhu Quanzhong held Bian and Hua, Qin Zongquan held Xu and Cai, Shi Bo held Xu and Si, Zhu Xuan held Yan, Qi, Cao, and Pu, Wang Jingwu held Zi and Qing, Gao Pian held eight Huainan prefectures, Qin Yan held Xuan and She, Liu Hanhong held eastern Zhe—all seized troops and taxes, devoured one another, and the court could not control them.',
    idiomatic: 'Warlords seized provinces and the court lost control.',
  },
  s1278: {
    literal: 'Huai transport routes were cut; Liang-Huai taxes did not reach the center—only seasonal tribute remained.',
    idiomatic: 'Tax routes collapsed; only tribute reached court.',
  },
  s1279: {
    literal: 'What the mandate could still command was several dozen prefectures in Hexi, Shannan, Jiannan, and Lingnan.',
    idiomatic: 'Only four remote circuits obeyed the throne.',
  },
  s1280: {
    literal: 'Broadly prefects acted on their own, regular taxes nearly ceased, frontier lords were installed without the court—the royal enterprise was thus undone.',
    idiomatic: 'Royal authority collapsed as prefects ruled themselves.',
  },
  s1281: {
    literal: 'Cai rebel Qin Zongquan raided neighboring circuits; an order made Xuzhou commissioner Shi Bo Prince of Julu and overall commander of armies around Cai.',
    idiomatic: 'Shi Bo was made prince and commander against Cai.',
  },
  s1282: {
    literal: 'Zongquan\'s general Qin Xian attacked Bian and Zheng without cease; Bian prefect Zhu Quanzhong was made Prince of Pei and northwestern campaign overall commander against Cai.',
    idiomatic: 'Zhu Quanzhong was made prince to fight Cai.',
  },
  s1283: {
    literal: 'Hangzhou prefect Dong Chang routed Liu Hanhong\'s host and advanced on Yue, Wu, Tai, and Ming, taking them.',
    idiomatic: 'Dong Chang conquered eastern Zhe prefectures.',
  },
  s1284: {
    literal: 'Chang was made Yue prefect, Zhendong commander, and Zhejiang East observation commissioner; Hangzhou great general Qian Liu was made Hangzhou prefect.',
    idiomatic: 'Dong Chang and Qian Liu received Zhe commands.',
  },
  s1285: {
    literal: 'Intercalary third month: Zhen-Ji commissioner Wang Yin presented one thousand plow oxen, nine thousand farm tools, and one hundred thousand weapons.',
    idiomatic: 'Wang Yin presented oxen, tools, and arms.',
  },
  s1286: {
    literal: 'Fourth month, yimao new moon: Palladium Grand Preceptor, Right Golden Guard senior general, Left Street merit commissioner, Duke of Qi Tian Lingzi was made overseer of the Left and Right Divine Strategy Ten Armies.',
    idiomatic: 'Tian Lingzi took the Ten Armies.',
  },
  s1287: {
    literal: 'Since escorting the court from Shu, Lingzi recruited fifty-four new commands of one thousand each—twenty-seven each for Left and Right Divine Strategy, divided into five armies—and Lingzi held overall authority.',
    idiomatic: 'Lingzi built fifty-four thousand-man guard commands.',
  },
  s1288: {
    literal: 'Armies were now numerous; southern and northern offices had more than ten thousand officials; the three bureaus had nowhere to allocate transport; revenue relied only on Guanji taxes—payments failed and rewards were late; army mood grumbled.',
    idiomatic: 'Revenue failed to pay the swollen armies and offices.',
  },
  s1289: {
    literal: 'Formerly Anyi and Jie county salt monopoly taxes had special salt officers under the salt commissioner.',
    idiomatic: 'Salt pools at Anyi and Jie had special officers.',
  },
  s1290: {
    literal: 'Since Huang Chao\'s turmoil Hezhong commissioner Wang Chongrong had also held the monopoly and yearly sent three thousand cartloads of salt tribute to court.',
    idiomatic: 'Chongrong sent three thousand salt carts yearly to court.',
  },
  s1291: {
    literal: 'Now Lingzi lacked supplies for his personal army, could find no funds, revived a Guangming precedent, and asked the two pools\' monopoly return to the salt commissioner to fund the guards.',
    idiomatic: 'Lingzi sought to reclaim salt pools for the guards.',
  },
  s1292: {
    literal: 'The edict descended; Chongrong memorialized in protest that Hezhong\'s land was cramped and all salt revenue supplied the army.',
    idiomatic: 'Chongrong protested that Hezhong needed salt revenue.',
  },
  s1293: {
    literal: 'Fifth month: Hezhong commissioner, Acting Minister of Education, Grand Councillor, Hezhong mayor, Pillar of State, Prince of Langye Wang Chongrong was made Acting Grand Tutor, Grand Councillor, concurrent Yan prefect, Yan-Yi-Hai observation commissioner, replacing Qi Kerang.',
    idiomatic: 'Chongrong was moved to Yan command.',
  },
  s1294: {
    literal: 'Qi Kerang was made Acting Minister of Education, concurrent Ding prefect, Censor-in-Chief, Yiwu observation commissioner and Beiping army commander, replacing Wang Chucun.',
    idiomatic: 'Qi Kerang replaced Wang Chucun at Yiwu.',
  },
  s1295: {
    literal: 'Wang Chucun kept Acting Grand Tutor, Grand Councillor, Hezhong mayor, and Hezhong-Jin-Ci-Wei observation commissioner.',
    idiomatic: 'Wang Chucun took Hezhong command.',
  },
  s1296: {
    literal: 'That month Chancellor Xiao Zhan led civil and military officials to offer the honorific Ultimate Virtue, Glorious Power, Filial Emperor; he received the seal at Xuanzheng Hall and a great amnesty was proclaimed.',
    idiomatic: 'Xizong received the honorific Ultimate Virtue, Glorious Power, Filial Emperor.',
  },
  s1297: {
    literal: 'Sixth month, jiayin new moon.',
    idiomatic: 'The sixth month opened on jiayin.',
  },
  s1298: {
    literal: 'On bingchen Dingzhou Wang Chucun reported: "Youzhou commissioner Li Keju and Zhenzhou commissioner Wang Yin each sent great generals leading troops to invade my circuit; I have beaten them all back."',
    idiomatic: 'Wang Chucun repelled invasions from You and Zhen.',
  },
  s1299: {
    literal: '" At the time Li Keju, exploiting the Son of Heaven\'s wanderings and central chaos, held that the three Hebei circuits shared weal and woe and only Yi and Ding remained to the court; they agreed to attack Chucun and divide his land.',
    idiomatic: 'Keju and Yin plotted to seize Yi and Ding.',
  },
  s1300: {
    literal: 'Yan general Li Quanzhong wished to seize command and the army was mutually suspicious.',
    idiomatic: 'Li Quanzhong plotted to seize Yanzhou command.',
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
