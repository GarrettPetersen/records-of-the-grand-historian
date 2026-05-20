#!/usr/bin/env node
/** Batch 3: s0201–s0300 (Jiutangshu ch.015, Xianzong 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/015.json';
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
    literal: "On yichou Prince Gui of Gui died.",
    idiomatic: "On yichou Prince Gui of Gui, son of the emperor, died.",
  },
  s0202: {
    literal: "Because of drought, 130,000 shi of summer tax in the capital region and 50,000 strings of green-seed money were remitted.",
    idiomatic: "Drought brought remission of capital summer tax and seed loans.",
  },
  s0203: {
    literal: "Sixth month, bingzi new moon.",
    idiomatic: "The sixth month opened on bingzi.",
  },
  s0204: {
    literal: "On wuyin Tiantede pacification commissioner Zhou Huaiyi died; court was suspended one day.",
    idiomatic: "On wuyin Zhou Huaiyi died and court mourned one day.",
  },
  s0205: {
    literal: "Suspending court for a pacification commissioner began with Huaiyi.",
    idiomatic: "Court mourning for a frontier commissioner began with Huaiyi.",
  },
  s0206: {
    literal: "On gengchen Hun Gao, Yiwu vice military commissioner, was made acting Minister of Works, concurrent Administrator of Ding prefecture, Yiwu military commissioner, Yi-Ding observation commissioner, and Beiping army commissioner.",
    idiomatic: "On gengchen Hun Gao took Yiwu and Ding.",
  },
  s0207: {
    literal: "On bingxu Yan Chonggan, Left Dragon Martial general, was made Feng prefect, Tiantede Fengzhou Western Middle City metropolitan defense commissioner overseeing fan tribes.",
    idiomatic: "On bingxu Yan Chonggan took Feng and Tiantede defense.",
  },
  s0208: {
    literal: "On bingyin the Ritual Guests Hostel was established north of Changxing Ward.",
    idiomatic: "On bingyin a hostel for tributary guests opened north of Changxing.",
  },
  s0209: {
    literal: "On renyin Left Assistant Kong Zhe was made Hua prefect, Tong Pass defense commissioner, and Zhenguo army commissioner.",
    idiomatic: "On renyin Kong Zhe took Hua and Tong Pass.",
  },
  s0210: {
    literal: "On renyin a decree made Zhang Hongjing, Hedong Jin- Jiang- Ci- Long military commissioner, continue as Minister of Justice and concurrent Grand Councillor.",
    idiomatic: "On renyin Zhang Hongjing joined the Grand Council while keeping Justice.",
  },
  s0211: {
    literal: "Autumn, seventh month, bingwu new moon.",
    idiomatic: "The seventh month opened on bingwu.",
  },
  s0212: {
    literal: "On yiwei Censor-in-Chief Zhao Zongru was made acting Right Vice Premier, concurrent Hedong intendant and Hedong Jin-Jiang military commissioner.",
    idiomatic: "On yiwei Zhao Zongru took Hedong with vice premier rank.",
  },
  s0213: {
    literal: "On wuchen Du Bian, Crown Prince remonstrance officer, was made Grand Master of Splendid Happiness, Palace Vice Director, Commandant of Escorts, and married Princess Qiyang.",
    idiomatic: "On wuchen Du Bian married Princess Qiyang with high court rank.",
  },
  s0214: {
    literal: "Intercalary eighth month, yisi new moon.",
    idiomatic: "The intercalary eighth month opened on yisi.",
  },
  s0215: {
    literal: "On xinyou Wu Chongyin, Heyang military commissioner, was also made Ru prefect.",
    idiomatic: "On xinyou Wu Chongyin added Ru prefect.",
  },
  s0216: {
    literal: "On renxu Secretariat drafting commissioner Wang Ya and Bureau of Revenue director Wei Shou were made readers for the crown prince and princes.",
    idiomatic: "On renxu Wang Ya and Wei Shou tutored the heir and princes.",
  },
  s0217: {
    literal: "On jihai Tian Hongzheng was promoted acting Right Vice Premier and granted the three armies 200,000 strings.",
    idiomatic: "On jihai Tian Hongzheng was promoted and his armies rewarded.",
  },
  s0218: {
    literal: "Ninth month, jiaxu new moon — Li Guangyan, Luo prefect, was made Chen prefect and Zhongwu army director of military affairs.",
    idiomatic: "In the ninth month Li Guangyan took Chen and Zhongwu command.",
  },
  s0219: {
    literal: "On bingxu Yuan Zi, Shannan East military commissioner, was made acting Minister of War, concurrent Jiangling intendant and Jingnan military commissioner.",
    idiomatic: "On bingxu Yuan Zi took Jingnan.",
  },
  s0220: {
    literal: "Yan Shou, Jingnan military commissioner, was made acting Minister of Works, Xiang prefect, and Shannan East military commissioner.",
    idiomatic: "Yan Shou took Shannan East.",
  },
  s0221: {
    literal: "On jichou the moon occulted the Chariot.",
    idiomatic: "On jichou the moon eclipsed the Chariot.",
  },
  s0222: {
    literal: "Huaixi military commissioner Wu Shaoyang died; his son Yuanji concealed the mourning, seized military power, then burned and plundered Wuyang and three other counties.",
    idiomatic: "Wu Shaoyang died; his son Yuanji hid the death, took the army, and raided four counties.",
  },
  s0223: {
    literal: "The court sent envoys to mourn; they were refused.",
    idiomatic: "Imperial mourners were turned away.",
  },
  s0224: {
    literal: "On renchen Zhenla sent tribute.",
    idiomatic: "On renchen Zhenla presented tribute.",
  },
  s0225: {
    literal: "On wuxu Hedong military commissioner Wang E was promoted acting Minister of Works and concurrent Grand Councillor; supervising secretary Meng Jian was made Yue prefect and Zhedong observation commissioner.",
    idiomatic: "On wuxu Wang E joined the council; Meng Jian took Zhedong.",
  },
  s0226: {
    literal: "Posthumous rank of Minister of Works Right Vice Premier was granted to Wu Shaoyang.",
    idiomatic: "Wu Shaoyang was posthumously honored as vice premier.",
  },
  s0227: {
    literal: "Winter, tenth month, jiachen new moon.",
    idiomatic: "The tenth month opened on jiachen.",
  },
  s0228: {
    literal: "On bingwu Li Jifu, Grand Master of Splendid Happiness, Vice Director of the Secretariat, Grand Councillor, Academician of the Hall of Assembled Worthies, Director of National History, Pillar of State, Duke of Zhao, died.",
    idiomatic: "On bingwu Li Jifu died.",
  },
  s0229: {
    literal: "On jiayin Vice Minister of Justice Linghu Chu was made Bureau of Appointments Vice Director and edict drafter.",
    idiomatic: "On jiayin Linghu Chu entered drafting.",
  },
  s0230: {
    literal: "On renxu Han Gao, Zhongwu military commissioner, was made Minister of Personnel; Zhongwu vice commissioner and concurrent Chen prefect Li Guangyan was made Xu prefect and Zhongwu military commissioner.",
    idiomatic: "On renxu Han Gao took Personnel; Li Guangyan took Zhongwu.",
  },
  s0231: {
    literal: "On jiazi a decree: \"I have inherited the precious throne these ten years.\"",
    idiomatic: "An edict on the Huai campaign opened:",
  },
  s0232: {
    literal: "Each day I push utmost sincerity to govern the realm, hoping benevolent transformation may reach great harmony — I rise at dawn and dine at dusk with my heart set on this.",
    idiomatic: "\"Ten years on the throne I have ruled from dawn to dusk for harmony.\"",
  },
  s0233: {
    literal: "Now the Huaixi circuit has not attained the court's standard.",
    idiomatic: "\"Huaixi has defied the court.\"",
  },
  s0234: {
    literal: "It has seized succession on its own and wantonly raids and plunders.",
    idiomatic: "\"Its heir seized power and raids the borders.\"",
  },
  s0235: {
    literal: "Officers and soldiers are forced under control — it is not their true heart.",
    idiomatic: "\"Soldiers serve under compulsion, not loyalty.\"",
  },
  s0236: {
    literal: "I think to remove the net on three sides and hope to follow the meaning of the two stairways.\"",
    idiomatic: "\"I would lift the net on three sides and offer the two-stairway peace.\"",
  },
  s0237: {
    literal: "Yan Shou, Shannan East military commissioner, is fittingly also made pacification commissioner of Shen-Guang-Cai and other prefectures.\"",
    idiomatic: "Yan Shou was named pacification commissioner for Shen-Guang-Cai.",
  },
  s0238: {
    literal: "Palace Inner Regular Attendant Cui Tanjun was also made army supervisor.",
    idiomatic: "Cui Tanjun was named campaign supervisor.",
  },
  s0239: {
    literal: "On wuchen Lü Yuanying, Left Assistant Minister of State, was made acting Minister of Works and Eastern Capital guardian.",
    idiomatic: "On wuchen Lü Yuanying became Luoyang guardian.",
  },
  s0240: {
    literal: "Former precedent: appointing a guardian granted banners and armor as with a regional commissioner; when Yuanying received appointment, none were granted.",
    idiomatic: "Luoyang guardians once received banners like commissioners; Yuanying received none.",
  },
  s0241: {
    literal: "Remonstrance officials cited Hua, Ru, and Shou as precedents for grants; the weight of holding the capital should not alone be denied. The Emperor said: \"Those three places should also cease receiving grants.\"",
    idiomatic: "Censors protested; the emperor ended grants for Hua, Ru, and Shou as well.",
  },
  s0242: {
    literal: "\"",
    idiomatic: "Thus ended the edict.",
  },
  s0243: {
    literal: "Eleventh month, jiaxu new moon.",
    idiomatic: "The eleventh month opened on jiaxu.",
  },
  s0244: {
    literal: "On jiashen Han Gao, Minister of Personnel, was made Crown Prince Guest.",
    idiomatic: "On jiashen Han Gao became crown prince guest.",
  },
  s0245: {
    literal: "On jiawu Vice Censor-in-Chief Hu Zheng was made Shanyu Grand Protector and Zhenwu Lin-Sheng military commissioner.",
    idiomatic: "On jiawu Hu Zheng took Zhenwu.",
  },
  s0246: {
    literal: "On dingyou Crown Prince Grand Tutor Fan Xichao died.",
    idiomatic: "On dingyou Fan Xichao died.",
  },
  s0247: {
    literal: "On wuxu Secretariat drafting commissioner Pei Du was made Vice Censor-in-Chief;",
    idiomatic: "On wuxu Pei Du became vice censor-in-chief;",
  },
  s0248: {
    literal: "Left Golden Guard Grand General Guo Zhao was made acting Minister of Works, Bin prefect, and Binning military commissioner;",
    idiomatic: "Guo Zhao took Binning;",
  },
  s0249: {
    literal: "Bureau of Appointments Vice Director and edict drafter Linghu Chu was made Hanlin academician.",
    idiomatic: "Linghu Chu entered the Hanlin.",
  },
  s0250: {
    literal: "Twelfth month, jiachen new moon.",
    idiomatic: "The twelfth month opened on jiachen.",
  },
  s0251: {
    literal: "On dingwei Zhenwu military commissioner Zhang Xu died.",
    idiomatic: "On dingwei Zhang Xu died.",
  },
  s0252: {
    literal: "On xinhai Binning military commissioner, acting Right Vice Premier Yan Juyuan died.",
    idiomatic: "On xinhai Yan Juyuan died.",
  },
  s0253: {
    literal: "On guichou Minister of War Wang Shao died.",
    idiomatic: "On guichou Wang Shao died.",
  },
  s0254: {
    literal: "On jiwei Right Forest commander Meng Yuanyang died.",
    idiomatic: "On jiwei Meng Yuanyang died.",
  },
  s0255: {
    literal: "On bingyin Crown Prince Junior Guardian Zhao Chang died.",
    idiomatic: "On bingyin Zhao Chang died.",
  },
  s0256: {
    literal: "On wuchen a decree made Wei Guanzhi, Palace Attendant Grand Master, acting Right Assistant Minister of State, Upper Cavalry Commandant, bearer of the gold-purple fish tally, continue in office as concurrent Grand Councillor.",
    idiomatic: "On wuchen Wei Guanzhi joined the Grand Council.",
  },
  s0257: {
    literal: "Yuanhe 10 — In spring of Yuanhe 10, first month, guiyou new moon.",
    idiomatic: "Yuanhe 10 opened on guiyou.",
  },
  s0258: {
    literal: "On yiyou Xuanwu military commissioner Han Hong continued as Grand Tutor; Grand Councillor posts remained as before.",
    idiomatic: "On yiyou Han Hong was confirmed Grand Tutor while keeping the council.",
  },
  s0259: {
    literal: "On bingchen Yan Shou's army halted at the Cai prefecture border.",
    idiomatic: "On bingchen Yan Shou camped at the Cai border.",
  },
  s0260: {
    literal: "On jihai a decree stripped Wu Yuanji of all offices held in life.",
    idiomatic: "On jihai Wu Yuanji was posthumously stripped of rank.",
  },
  s0261: {
    literal: "On gengzi Gui observation memorialized moving Fu prefecture's seat to the old city.",
    idiomatic: "On gengzi Gui moved Fu prefecture back to its old seat.",
  },
  s0262: {
    literal: "Second month, guimao new moon.",
    idiomatic: "The second month opened on guimao.",
  },
  s0263: {
    literal: "On jiachen Yan Shou's army was ambushed by bandits and defeated at Ciqu; it withdrew to guard Tang prefecture.",
    idiomatic: "On jiachen Yan Shou was routed at Ciqu and fell back to Tang.",
  },
  s0264: {
    literal: "Tian Hongzheng's son Bu and Han Hong's son Gongwu each led troops under Li Guangyan to attack the rebels.",
    idiomatic: "Sons of Tian Hongzheng and Han Hong joined Li Guangyan against Huaixi.",
  },
  s0265: {
    literal: "On xinhai Li Jiang, Minister of Rites, was made Hua prefect, Tong Pass defense commissioner, and Zhenguo army commissioner.",
    idiomatic: "On xinhai Li Jiang took Hua.",
  },
  s0266: {
    literal: "On renxu Hedong autumn-defense officer Liu Fu killed Feng prefect Yan Chonggan.",
    idiomatic: "On renxu Liu Fu murdered Yan Chonggan at Feng.",
  },
  s0267: {
    literal: "On jisi Forest general Li Hui was made Jingyuan military commissioner.",
    idiomatic: "On jisi Li Hui took Jingyuan.",
  },
  s0268: {
    literal: "Third month, renshen new moon — Right Golden Guard general Li Fengxian was made Feng prefect and Tiantede Western Middle City metropolitan defense commissioner.",
    idiomatic: "In the third month Li Fengxian took Feng.",
  },
  s0269: {
    literal: "On jimao Li Cheng, Xichuan campaign staff officer, was made Bureau of War director and edict drafter.",
    idiomatic: "On jimao Li Cheng entered drafting.",
  },
  s0270: {
    literal: "On yiyou Qianzhou Registrar Han Tai was made Zhang prefect; Yongzhou Registrar Liu Zongyuan was made Liu prefect; Raozhou Registrar Han Ye was made Ting prefect; Langzhou Registrar Liu Yuxi was made Bo prefect; Taizhou Registrar Chen Jian was made Feng prefect.",
    idiomatic: "On yiyou five exiled scholars were appointed distant prefects.",
  },
  s0271: {
    literal: "Vice Censor-in-Chief Pei Du, because Liu Yuxi's mother was old, requested a nearer post; he was then reassigned Lian prefect.",
    idiomatic: "Pei Du moved Liu Yuxi nearer for his aged mother.",
  },
  s0272: {
    literal: "Former Grand Director of the Imperial Clan Cui Bin was posthumously made Minister of Rites.",
    idiomatic: "Cui Bin was posthumously honored as Minister of Rites.",
  },
  s0273: {
    literal: "Li Guangyan defeated the rebels at Nandun.",
    idiomatic: "Li Guangyan won at Nandun.",
  },
  s0274: {
    literal: "On xinhai bandits burned the Heyin transport compound — twenty thousand strings and bolts of cash and silk, 24,800 shi of rice, and fifty-five storehouses were burned.",
    idiomatic: "On xinhai rebels burned the Heyin depot and millions in stores.",
  },
  s0275: {
    literal: "Five hundred garrison troops camped south of the county; when the fire broke out they did not rescue; Lü Yuanying summoned their commander and executed him.",
    idiomatic: "Lü Yuanying executed garrison officers who failed to fight the Heyin fire.",
  },
  s0276: {
    literal: "From the Heyin fire onward, popular feeling was shaken with alarm.",
    idiomatic: "The capital panicked after the Heyin arson.",
  },
  s0277: {
    literal: "On renxu Chang'an county magistrate Xu Jun was made Yong-Guan pacification commissioner.",
    idiomatic: "On renxu Xu Jun took Yong-Guan.",
  },
  s0278: {
    literal: "Fifth month, xinwei new moon.",
    idiomatic: "The fifth month opened on xinwei.",
  },
  s0279: {
    literal: "On xinsi Vice Censor-in-Chief Pei Du was also made Vice Minister of Justice.",
    idiomatic: "On xinsi Pei Du also took Justice.",
  },
  s0280: {
    literal: "At the time Du had returned from comforting the Huaixi camp; what he said of military affairs largely matched the Emperor's intent, so he was favored with the concurrent post.",
    idiomatic: "Pei Du's Huaixi counsel earned him the concurrent Justice post.",
  },
  s0281: {
    literal: "On bingchen Li Guangyan inflicted a great defeat on the rebel band at Huiqu.",
    idiomatic: "On bingchen Li Guangyan crushed the rebels at Huiqu.",
  },
  s0282: {
    literal: "Since troops were raised to attack the rebels, more than ten circuits' armies ringed Shen and Cai yet had not achieved battle merit.",
    idiomatic: "A dozen circuits had besieged Shen and Cai without victory.",
  },
  s0283: {
    literal: "When Pei Du returned from his mission he memorialized: \"Among the generals I observe, only Guangyan sees righteousness and can be brave — he will certainly achieve merit.\"",
    idiomatic: "Pei Du had predicted only Li Guangyan would win.",
  },
  s0284: {
    literal: "When victory was announced, the capital congratulated one another; the Emperor especially prized Du's knowledge of men.",
    idiomatic: "Victory at Huiqu vindicated Pei Du before the court.",
  },
  s0285: {
    literal: "Sixth month, xinchou new moon.",
    idiomatic: "The sixth month opened on xinchou.",
  },
  s0286: {
    literal: "On guimao Wang Chengzong, Zhen military commissioner, sent assassins by night to lurk in Jing'an Ward and stab Grand Councillor Wu Yuanheng to death;",
    idiomatic: "On guimao Wang Chengzong's men murdered Wu Yuanheng in Jing'an Ward;",
  },
  s0287: {
    literal: "he also sent assassins in Tonghua Ward to stab Vice Censor-in-Chief Pei Du — Du was wounded in the head but escaped.",
    idiomatic: "the same night Pei Du was wounded in Tonghua but survived.",
  },
  s0288: {
    literal: "That day the capital was greatly alarmed; from the capital to every gate guards were increased;",
    idiomatic: "Chang'an locked down with guards at every gate;",
  },
  s0289: {
    literal: "chief ministers' escorts added Golden Guard horsemen; going out or in they strung bows and bared blades; passing each ward gate the shouting and searching was very clamorous;",
    idiomatic: "ministers rode under armed escort with searches at every ward;",
  },
  s0290: {
    literal: "high officials holding power all followed with household slaves and weapons.",
    idiomatic: "powerful officials armed their household retinues.",
  },
  s0291: {
    literal: "Several days after Wu Yuanheng's death the assassins were still not captured.",
    idiomatic: "Days passed without arresting the killers.",
  },
  s0292: {
    literal: "Vice Minister of War Xu Mengrong requested audience and memorialized: \"How can a state minister lie slaughtered at a roadside and the assassins not be seized!\"",
    idiomatic: "Xu Mengrong wept before the throne that the killers still roamed free.",
  },
  s0293: {
    literal: "He wept and spoke to the limit; the Emperor sighed in anger for him.",
    idiomatic: "The emperor raged at his tears.",
  },
  s0294: {
    literal: "Then an edict: throughout the capital circuits, whoever could capture the assassins would receive ten thousand strings and a fifth-rank office; whoever dared conceal them — whole household executed.",
    idiomatic: "A ten-thousand-string bounty and fifth rank were offered; concealment meant family execution.",
  },
  s0295: {
    literal: "Then 20,000 strings were piled at the eastern and western markets.",
    idiomatic: "Twenty thousand strings were displayed in the markets.",
  },
  s0296: {
    literal: "A great search swept the capital; even grandees and military commissioners who walled and layered their carriages were searched.",
    idiomatic: "Even walled mansions of generals were searched.",
  },
  s0297: {
    literal: "On gengxu Divine Strategy officers Wang Shize and Wang Shiping reported the assassins by name and said Wang Chengzong had sent them; Zhang Yan and eight others were then seized and executed.",
    idiomatic: "On gengxu Wang Shize named Zhang Yan's gang as Chengzong's agents; eight were executed.",
  },
  s0298: {
    literal: "On yichou a decree made Pei Du, Court Counsel Grand Master, acting Vice Censor-in-Chief, concurrent Vice Minister of Justice, Flying Cavalry Commandant, bearer of the gold-purple fish tally, Court Cadet Grand Master, acting Vice Minister of Justice, and concurrent Grand Councillor.",
    idiomatic: "On yichou wounded Pei Du was elevated to the Grand Council.",
  },
  s0299: {
    literal: "Autumn, seventh month, gengwu new moon — Lingwu military commissioner Li Guangjin died.",
    idiomatic: "The seventh month opened with Li Guangjin's death.",
  },
  s0300: {
    literal: "On xinwei Du Shuliang, Changwu town commissioner of the Divine Strategy, was made Shuofang Ling-Salt Dingyuan military observation commissioner.",
    idiomatic: "On xinwei Du Shuliang took Lingwu.",
  }
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
if (data.metadata.chapter !== '015') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 015; standalone T ready (${Object.keys(T).length} entries).`
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
