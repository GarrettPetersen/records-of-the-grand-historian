#!/usr/bin/env node
/** Batch 3: s0201–s0300 (Jiutangshu ch.019, Yizong / Vol. 18) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/019.json';
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
    literal: 'In the seventh month Shazhou military commissioner Zhang Yichao presented four pairs of blue hawks from Ganjun Mountain, two Yanqing Festival horses, and two Tibetan women.',
    idiomatic: 'In the seventh month Zhang Yichao sent hawks, horses, and Tibetan women from Shazhou.',
  },
  s0202: {
    literal: 'Monk Tan Yan presented the "Mahayana Hundred-Gates Bright Treatise" and related works.',
    idiomatic: 'Monk Tan Yan presented Mahayana treatises.',
  },
  s0203: {
    literal: 'In the eighth month Zhenzhou Wang Jingchong resumed as Zhongwu general, Left Golden Crow guard general titular, Acting Right Regular Attendant, concurrent Zhen grand protector left aide knowing prefecture affairs and Vice Censor-in-Chief, Chengde observation provisional commander.',
    idiomatic: 'Jingchong resumed command of Zhenzhou in the eighth month.',
  },
  s0204: {
    literal: 'Supreme Pillar of State, granted purple robe and golden fish bag, Secretariat Vice Director and Grand Councillor Xu Shang was also made Minister of Works.',
    idiomatic: 'Xu Shang added minister of works.',
  },
  s0205: {
    literal: 'In the tenth month Shazhou Zhang Yichao memorialized: dispatching Uyghur chief Pu-gu Jun to fight Tibetan great general Shang Kong-re, they greatly defeated the Tibetan raiders, beheaded Kong-re, and sent the head to the capital.',
    idiomatic: 'Zhang Yichao reported Pu-gu Jun beheaded Shang Kong-re and sent the head to court.',
  },
  s0206: {
    literal: 'Right Vice Director, Secretariat Vice Director, and Grand Councillor Xiahou Zi was made Acting Grand Preceptor and Grand Councillor, concurrent Chengdu prefect and Jiannan West deputy commissioner knowing military affairs.',
    idiomatic: 'Xiahou Zi took Chengdu and Jiannan West.',
  },
  s0207: {
    literal: 'Annan Gao Pian memorialized that barbarian raiders were all pacified.',
    idiomatic: 'Gao Pian reported Annan pacified.',
  },
  s0208: {
    literal: 'On the tenth day of the eleventh month the Emperor faced Xuanzheng Hall, proclaimed a great amnesty for recovering Annan.',
    idiomatic: 'On the eleventh month\'s tenth he amnestied for Annan\'s recovery at Xuanzheng Hall.',
  },
  s0209: {
    literal: 'Hanlin Expositor-in-Chief and Households Vice Minister Lu Yan was made Vice Minister of War and Grand Councillor.',
    idiomatic: 'Lu Yan joined the council from the Hanlin.',
  },
  s0210: {
    literal: 'Yicheng military commissioner Xiao Fang was advanced to Acting Minister of War for able governance.',
    idiomatic: 'Xiao Fang gained acting war minister for good rule.',
  },
  s0211: {
    literal: 'Rites Bureau Director Li Jingwen and Vice Director of Personnel Gao Xiang examined outstanding candidates.',
    idiomatic: 'Li Jingwen and Gao Xiang examined outstanding candidates.',
  },
  s0212: {
    literal: 'Xian-tong 8, year Xian-tong 8 duplicated in the source—spring, first month, renyin new moon.',
    idiomatic: 'Xian-tong 8 opened on renyin.',
  },
  s0213: {
    literal: 'On dingwei Hezhong, Jin, and Jiang suffered a great earthquake; houses collapsed and people were injured and killed.',
    idiomatic: 'On dingwei a great earthquake wrecked Hezhong, Jin, and Jiang.',
  },
  s0214: {
    literal: 'In the third month Annan Gao Pian memorialized: "South to Yong the water route is treacherous with boulders blocking the way; workers have finished cutting it and transport ships no longer stall."',
    idiomatic: 'Gao Pian reported clearing Yong\'s water route in the third month.',
  },
  s0215: {
    literal: 'An edict praised him.',
    idiomatic: 'The throne praised him.',
  },
  s0216: {
    literal: 'An order made Secretariat Vice Director, concurrent Households Minister, Grand Councillor, Supreme Pillar, Jinyang county marquis with three hundred households, granted purple robe and golden fish bag Yang Shou Acting Minister of War and Zhexi observation commissioner;',
    idiomatic: 'Yang Shou was sent to Zhexi as acting war minister;',
  },
  s0217: {
    literal: 'former Zhexi observation commissioner Du Shenquan kept Acting Minister of the Left;',
    idiomatic: 'Du Shenquan kept acting left minister;',
  },
  s0218: {
    literal: 'Vice Minister of War Yu Lin became Grand Councillor with his former title.',
    idiomatic: 'Yu Lin joined the council.',
  },
  s0219: {
    literal: 'On dingyou of the ninth month Extended Treasury commissioner Cao Que memorialized:',
    idiomatic: 'On dingyou Cao Que memorialized on the Extended Treasury:',
  },
  s0220: {
    literal: '"Households each year should deliver to this office 214,100 bolts and ten thousand strings in the March and September limits; from Dazhong 8 through Xian-tong 4 more than 1.505 million remained owed."',
    idiomatic: '"Households owed over 1.5 million in March and September deliveries since Dazhong 8."',
  },
  s0221: {
    literal: '"Former commissioner Du Cong memorialized that from Xian-tong 5 the fifteen-cash cut from each circuit\'s eighty-cash discount coin should fill arrears."',
    idiomatic: '"Du Cong had sought fifteen cash per discount coin from Xian-tong 5."',
  },
  s0222: {
    literal: '"Households\' document said discount coin came in mixed colors and fragments; beg this year\'s Extended Treasury quota paid in full each year in both limits; the fifteen-cash cut remains with this office."',
    idiomatic: '"Households wanted full yearly payment; the fifteen-cash cut would remain here."',
  },
  s0223: {
    literal: '"Former commissioner Xiahou Zi reported and asked to follow Households\' proposed deadlines."',
    idiomatic: '"Xiahou Zi had asked to follow Households\' schedule."',
  },
  s0224: {
    literal: '"Xian-tong 5 quota was delivered."',
    idiomatic: '"Xian-tong 5 was paid."',
  },
  s0225: {
    literal: '"From years six through eight delivery again lagged, adding 365,507 owed."',
    idiomatic: '"Years six through eight added another 365,507 owed."',
  },
  s0226: {
    literal: '"The Extended Treasury was first named to supply the border; in Dazhong 3 the present name was adopted."',
    idiomatic: '"The Extended Treasury was meant for the border since Dazhong 3."',
  },
  s0227: {
    literal: '"If funds are insufficient the title is empty."',
    idiomatic: '"Empty funds make an empty title."',
  },
  s0228: {
    literal: '"At founding the three ministries yearly sent shares to this office."',
    idiomatic: '"The three ministries once sent yearly shares."',
  },
  s0229: {
    literal: '"The original edict had only cash totals—this ministry cut and sent to the treasury without fixing goods."',
    idiomatic: '"The original edict fixed cash, not goods."',
  },
  s0230: {
    literal: '"Thus year by year the old system decayed and debt grew."',
    idiomatic: '"Year by year debt grew."',
  },
  s0231: {
    literal: '"With no means to collect, they pointed to goods for relief—barely matching the border name and original edict."',
    idiomatic: '"They now taxed discount coin to match the border mandate."',
  },
  s0232: {
    literal: '"Cutting fifteen cash from Households\' eighty and paying yearly must await assent."',
    idiomatic: '"The fifteen-cash cut and yearly payment awaited assent."',
  },
  s0233: {
    literal: '"Debt is now so great we fear missing deadlines."',
    idiomatic: '"Debt now threatens deadlines."',
  },
  s0234: {
    literal: '"I now apportion from each circuit\'s Households deliveries, retain the Extended Treasury share locally, and send separate convoys with Households convoys to the capital direct to the Extended Treasury—Households avoids suspension and years of debt."',
    idiomatic: '"Let each circuit send Extended Treasury shares in separate convoys with Households—avoid years of arrears."',
  },
  s0235: {
    literal: 'It was approved.',
    idiomatic: 'The throne assented.',
  },
  s0236: {
    literal: 'On bingyin of the tenth month Households Vice Minister and revenue commissioner Cui Yanzhao memorialized: this ministry should collect Jiang-Huai circuits\' Xian-tong 8 and prior two-tax, liquor monopoly, rice-price advances, and twenty-cash discount provincial funds per precedent yearly exchanged by merchant petition.',
    idiomatic: 'Cui Yanzhao begged restoration of merchant exchange for provincial funds.',
  },
  s0237: {
    literal: '"Since the southern campaign the army-supply office held funds at yards; merchants with exchange documents were detained by prefectures citing army-supply orders."',
    idiomatic: '"Army-supply offices had blocked merchant exchanges since the southern war."',
  },
  s0238: {
    literal: '"Merchants hesitated and this ministry lacks funds."',
    idiomatic: '"Merchants hesitated and revenue ran short."',
  },
  s0239: {
    literal: '"Beg all circuits deliver on schedule and repay merchants without detention."',
    idiomatic: '"Deliver on time and repay merchants."',
  },
  s0240: {
    literal: 'The edict approved.',
    idiomatic: 'The throne assented.',
  },
  s0241: {
    literal: 'Grand Councillor, Secretariat Vice Director, and Households Minister Cao Que was also made Minister of Personnel; Secretariat Vice Director, Minister of Rites Lu Yan also Households Minister; Secretariat Vice Director, Minister of Works Xu Shang also Minister of Punishments; Vice Minister of War and Grand Councillor Yu Lin became Secretariat Vice Director.',
    idiomatic: 'Cao Que, Lu Yan, Xu Shang, and Yu Lin were shuffled among ministries.',
  },
  s0242: {
    literal: 'Secretariat drafting officer Liu Yunzhang was made acting director of the Rites examination; Vice Minister of Personnel Lu Kuang, Vice Minister Li Wei, Vice Director of War Xue Chong, and Vice Director of Merit Cui Yinemeng examined macro-words candidates.',
    idiomatic: 'Liu Yunzhang examined candidates; Lu Kuang and others judged macro-words.',
  },
  s0243: {
    literal: 'Xian-tong 9, year Xian-tong 9 duplicated in the source—spring, first month, bingchen: Vice Minister of Personnel Li Wei was made Acting Minister of Punishments, Bian prefect, Censor-in-Chief, and Xuanwu military and Bian-Song-Bo observation commissioner.',
    idiomatic: 'Li Wei took Bianzhou and Xuanwu in the first month.',
  },
  s0244: {
    literal: 'Youzhou military commissioner Zhang Yunshen was advanced to Acting Grand Preceptor.',
    idiomatic: 'Zhang Yunshen gained acting grand preceptor.',
  },
  s0245: {
    literal: 'Vice Director of War Jiao Du and Vice Director of Merit Li Yue examined macro-words candidates.',
    idiomatic: 'Jiao Du and Li Yue examined macro-words candidates.',
  },
  s0246: {
    literal: 'On wuxu of the seventh month a white rainbow stretched across the western sky.',
    idiomatic: 'A white rainbow crossed the west in the seventh month.',
  },
  s0247: {
    literal: 'That month five hundred Xuzhou garrison troops for Guilin, guards Xu Ji and Zhao Keli killed their commander Wang Zhongfu and made grain-aide Pang Xun company chief; they plundered Xiangtan and Hengshan with a thousand followers and returned to their command unauthorized.',
    idiomatic: 'Xuzhou garrison troops made Pang Xun chief and plundered home toward Xu.',
  },
  s0248: {
    literal: 'On xinmao of the ninth month the new moon fell.',
    idiomatic: 'The ninth month\'s xinmao was new moon.',
  },
  s0249: {
    literal: 'On jiawu Pang Xun took Suzhou; prefectural aide Jiao Lu fled to Xu.',
    idiomatic: 'On jiawu Pang Xun took Suzhou; Jiao Lu fled to Xu.',
  },
  s0250: {
    literal: 'On yiwei Pang Xun took Xuzhou, killed military commissioner Cui Yanzeng, aides Jiao Lu, Li Shui, Wen Yanhao, Cui Yun, Wei Tingyi—only sparing supervisory commissioner Zhang Daojin.',
    idiomatic: 'On yiwei Pang Xun took Xuzhou and killed Cui Yanzeng\'s staff, sparing Zhang Daojin.',
  },
  s0251: {
    literal: 'They opened Xu and Su treasuries, recruited violent men, and within ten days had fifty thousand.',
    idiomatic: 'Within ten days Pang Xun had fifty thousand from Xu and Su treasuries.',
  },
  s0252: {
    literal: 'Xun memorialized begging pardon while ordering the violent to demand the military commission.',
    idiomatic: 'Xun begged pardon while demanding the commission.',
  },
  s0253: {
    literal: 'The Emperor sent palace envoys to soothe them.',
    idiomatic: 'Palace envoys were sent to soothe the rebels.',
  },
  s0254: {
    literal: 'The bandits made Liang Pi hold Suzhou, Yao Zhou hold Willow Fort, and sent Liu Xingji, Ding Jingzong, and Wu Mei to besiege Sizhou.',
    idiomatic: 'Rebel columns besieged Sizhou and held Suzhou.',
  },
  s0255: {
    literal: 'In the tenth month an edict levied troops from Henan, Hedong, and Shannan.',
    idiomatic: 'Henan, Hedong, and Shannan troops were levied in the tenth month.',
  },
  s0256: {
    literal: 'Zhexi observation commissioner Yang Shou was demoted Duanzhou registrar titular; his younger brother former Zhedong observation commissioner and Yue prefect Yang Yan was made Shaozhou prefect; Acting Minister of Works, Hong prefect, Zhennan military and Jiangxi observation commissioner Yan Zan was long-banished to Lingnan.',
    idiomatic: 'Yang Shou, Yang Yan, and Yan Zan were punished for corruption.',
  },
  s0257: {
    literal: 'The bandits pressed Sizhou; Huainan military commissioner Linghu Tao feared losing the Si mouth and sent great general Li Xiang to relieve; the bandits feigned weakness and begged surrender, then attacked unprepared and destroyed the whole force.',
    idiomatic: 'Li Xiang\'s relief force was destroyed by feigned surrender.',
  },
  s0258: {
    literal: 'Xiang and supervisor Guo Houben were captured and sent to Xuzhou.',
    idiomatic: 'Li Xiang and Guo Houben were captured.',
  },
  s0259: {
    literal: 'On gengyin of the eleventh month the new moon fell.',
    idiomatic: 'The eleventh month\'s gengyin was new moon.',
  },
  s0260: {
    literal: 'At dingyou the first watch an omen star appeared like a bolt of silk across the sky, turned to cloud, and vanished in Chu territory.',
    idiomatic: 'An omen star crossed the sky at dingyou and vanished in Chu.',
  },
  s0261: {
    literal: 'After Wu Mei captured Li Xiang he sent junior officers Zhang Xingjian and Wu Yue to attack Chuzhou.',
    idiomatic: 'Wu Mei sent officers against Chuzhou.',
  },
  s0262: {
    literal: 'The city had no troops; three hundred Huainan patrol soldiers at the border saw the bandits and fled into the prefecture; the bandits took it and seized the prefecture.',
    idiomatic: 'Chuzhou fell to a ruse when patrol troops fled in.',
  },
  s0263: {
    literal: 'Zhang Xingjian seized prefect Gao Xiwang and killed him by hand, slaughtered the city, and left.',
    idiomatic: 'Zhang Xingjian killed Gao Xiwang and slaughtered Chuzhou.',
  },
  s0264: {
    literal: 'Xingjian then attacked Hezhou; prefect Cui Yong stood on the tower and told Wu Mei: "Silks, jade, and women in the city we dare not begrudge—only do not take the Son of Heaven\'s prefectural seat."',
    idiomatic: 'Cui Yong bargained silks and women for Hezhou\'s seat.',
  },
  s0265: {
    literal: 'The bandits agreed, plundered residents, and killed aide Zhang Zhuo because Zhuo had deepened the moat.',
    idiomatic: 'They plundered Hezhou and killed Zhang Zhuo for deepening the moat.',
  },
  s0266: {
    literal: 'Pang Xun also sent Liu Zan to attack Haozhou; when it fell he imprisoned prefect Lu Wanghui at the carriage-turning lodge; Wanghui died of grief and several maidservants were steamed and eaten by the bandits.',
    idiomatic: 'Haozhou fell; Lu Wanghui died in captivity and maidservants were eaten.',
  },
  s0267: {
    literal: 'On gengchen of the twelfth month General Dai Keshi led twenty thousand Shatuo and Tuhun tribes to fight the bandits in Huainan; the bandits were repeatedly defeated and abandoned Huainan garrisons.',
    idiomatic: 'Dai Keshi\'s Shatuo and Tuhun routed the rebels in Huainan.',
  },
  s0268: {
    literal: 'That year Jiang-Huai locusts ate the crops and great drought struck.',
    idiomatic: 'Locusts and drought ravaged Jiang-Huai that year.',
  },
  s0269: {
    literal: 'Pang Xun memorialized: "This circuit first sent three thousand garrison troops to Lingnan with spring and winter clothing; we now wish to send men to deliver them to Yong."',
    idiomatic: 'Pang Xun feigned sending Lingnan clothing.',
  },
  s0270: {
    literal: 'Ezhou observation commissioner Liu Yunzhang memorialized:',
    idiomatic: 'Liu Yunzhang warned:',
  },
  s0271: {
    literal: '"Pang Xun has gathered one hundred thousand men; if envoys reach Lingnan the garrison may join him—the calamity would be grave."',
    idiomatic: '"—one hundred thousand rebels might join Lingnan troops if envoys went south."',
  },
  s0272: {
    literal: 'Soon an edict stopped Pang Xun and ordered Jiang-Huai circuits to capture him.',
    idiomatic: 'The court stopped Pang Xun\'s envoys and ordered his capture.',
  },
  s0273: {
    literal: 'Xian-tong 10, year Xian-tong 10 duplicated in the source—spring, first month, jiwei new moon: because of Xuzhou warfare the New Year audience was canceled.',
    idiomatic: 'Xian-tong 10 canceled New Year for the Xu campaign.',
  },
  s0274: {
    literal: 'On guihai Right Reminder Wei Baohang was made Silver-Gleam Grand Master, Acting Attendant, Commandant of the Imperial Son-in-Law\'s Mansion; he married Princess Tongchang—the wedding day\'s ritual was very grand.',
    idiomatic: 'We Baohang married Princess Tongchang with grand ritual on guihai.',
  },
  s0275: {
    literal: 'Divine Martial great general Wang Yanquan was made Acting Minister of Works, Xuzhou prefect, Censor-in-Chief, Wuning military and Xu-Si-Hao observation commissioner and northern Xu campaign pacifier—Zhi-xing\'s nephew;',
    idiomatic: 'Wang Yanquan, Zhi-xing\'s nephew, took Wuning and the northern Xu campaign;',
  },
  s0276: {
    literal: 'General Zhu Kecheng was northern campaign vice pacifier;',
    idiomatic: 'Zhu Kecheng was vice pacifier;',
  },
  s0277: {
    literal: 'Wang You was northern campaign vanguard.',
    idiomatic: 'Wang You led the vanguard.',
  },
  s0278: {
    literal: 'Hanlin academician and Households Vice Minister Liu Zhan kept his office as Grand Councillor.',
    idiomatic: 'Liu Zhan joined the council from the Hanlin.',
  },
  s0279: {
    literal: 'Secretariat Vice Director, concurrent Households Minister, and Grand Councillor Jiang Shen was made Junior Tutor of the Heir Apparent and left government—illness.',
    idiomatic: 'Jiang Shen retired ill as junior tutor.',
  },
  s0280: {
    literal: 'Secretariat Vice Director, concurrent Minister of Punishments, and Grand Councillor Xu Shang was made Acting Minister of War, Jiangling prefect, and Jingnan military commissioner.',
    idiomatic: 'Xu Shang went to Jingnan.',
  },
  s0281: {
    literal: 'Right Divine Strategy great general, army knowing commissioner, concurrent Censor-in-Chief, Supreme Pillar, Longyang county baron with one thousand households Kang Chengshi was made Gold-Gleam Grand Master, Acting Minister of Punishments, concurrent Right Divine Strategy great general, Censor-in-Chief, Supreme Pillar, Fufeng county duke with fifteen hundred households, Xu-Si campaign chief pacifier;',
    idiomatic: 'Kang Chengshi became chief pacifier of the Xu campaign;',
  },
  s0282: {
    literal: 'General Li Shao was southern Xu campaign vice pacifier;',
    idiomatic: 'Li Shao was southern vice pacifier;',
  },
  s0283: {
    literal: 'General Shi Zhongyong was Yingzhou campaign knowing troops officer;',
    idiomatic: 'Shi Zhongyong knew troops at Yingzhou;',
  },
  s0284: {
    literal: 'General Ma Dan was Xu campaign knowing troops officer;',
    idiomatic: 'Ma Dan knew troops at Xu;',
  },
  s0285: {
    literal: 'General Dong Tao was Luzhou campaign knowing troops officer;',
    idiomatic: 'Dong Tao knew troops at Lu;',
  },
  s0286: {
    literal: 'General Dai Keshi was Caozhou campaign pacifier;',
    idiomatic: 'Dai Keshi pacified Cao;',
  },
  s0287: {
    literal: 'General Zhu Ye Chixin was Taiyuan campaign pacifier and Shatuo three-tribes army commissioner;',
    idiomatic: 'Zhu Ye Chixin led Shatuo at Taiyuan;',
  },
  s0288: {
    literal: 'General Wang Jian was Huai-Si campaign pacifier;',
    idiomatic: 'Wang Jian pacified Huai-Si;',
  },
  s0289: {
    literal: 'General Cao Xiang was Yanhai circuit campaign pacifier;',
    idiomatic: 'Cao Xiang pacified Yanhai;',
  },
  s0290: {
    literal: 'General Ma Ju was Yangzhou grand-protectorate aide, Huainan campaign pacifier;',
    idiomatic: 'Ma Ju pacified Huainan;',
  },
  s0291: {
    literal: 'General Gao Luorui was Chuzhou prefect and local campaign pacifier;',
    idiomatic: 'Gao Luorui pacified Chu;',
  },
  s0292: {
    literal: 'General Qin Kuangmo was Haozhou prefect and local campaign pacifier; Li Bo was Suzhou prefect for the Lu campaign; Li Fan was Suzhou prefect for the Lu campaign pacifier—text duplicates titles in source.',
    idiomatic: 'Qin Kuangmo, Li Bo, and others held local pacifier posts.',
  },
  s0293: {
    literal: 'General Meng Biao was Director of the Imperial Stud and chief grain commissioner.',
    idiomatic: 'Meng Biao supplied grain.',
  },
  s0294: {
    literal: 'Eighteen generals in all commanded seventy-three thousand fifteen men; on the first day of the first month the army advanced to attack Xuzhou.',
    idiomatic: 'Eighteen generals led seventy-three thousand men against Xu on New Year\'s first day.',
  },
  s0295: {
    literal: 'Weibo He Hongjing memorialized that this circuit mustered thirteen thousand troops for the campaign.',
    idiomatic: 'Weibo sent thirteen thousand troops.',
  },
  s0296: {
    literal: 'At the time bandit generals Liu Xingji, Ding Jingzong, and Wu Mei besieged Sizhou; Dai Keshi rescued from victory at Shiliang Post.',
    idiomatic: 'Dai Keshi relieved Sizhou while rebels besieged it.',
  },
  s0297: {
    literal: 'The bandits withdrew; Keshi pursued and captured Liu Xingji alive; the bandits held Duliang city and cut off Xingji\'s fingers, hung them on the wall to show the bandits.',
    idiomatic: 'Keshi captured Liu Xingji; rebels displayed his severed fingers.',
  },
  s0298: {
    literal: 'The bandits on the wall bowed: "We wish to plot return with the company chief."',
    idiomatic: 'Rebels on the wall feigned surrender to Pang Xun.',
  },
  s0299: {
    literal: 'Knowing their distress Keshi withdrew five li.',
    idiomatic: 'Keshi withdrew five li when they feigned distress.',
  },
  s0300: {
    literal: 'West of the city was water; on three sides were great armies; the bandits waded out at midnight.',
    idiomatic: 'The rebels waded out at midnight past the western water.',
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
