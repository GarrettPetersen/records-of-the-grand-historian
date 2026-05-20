#!/usr/bin/env node
/** Batch 7: s0601–s0700 (Jiutangshu ch.015, Xianzong 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/015.json';
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
    literal: "Third month, jimao new moon.",
    idiomatic: "The third month opened on jimao.",
  },
  s0602: {
    literal: "dingyou — because Qi and Lu were newly pacified, the Emperor feasted the hundred officials at Linde Hall; gifts were graded.",
    idiomatic: "A Linde feast marked the Shandong victory on dingyou.",
  },
  s0603: {
    literal: "wuzi — Hua Prefect Ma Zong was made observer over Yan, Pu, and Cao;",
    idiomatic: "Ma Zong took the Yan-Pu-Cao command;",
  },
  s0604: {
    literal: "jichou — Yicheng military commissioner Xue Ping was made Qing prefect and Pinglu military commissioner with observation over Zi, Qing, Qi, Deng, Lai;",
    idiomatic: "Xue Ping received Pinglu on jichou;",
  },
  s0605: {
    literal: "Ziqing four-side field army supply commissioner Wang Sui was made Yi prefect and observer over Yi, Hai, Yan, and Mi — dividing the twelve prefectures Li Shidao had held into three commands.",
    idiomatic: "Wang Sui took Yi while Shidao's twelve prefectures were split three ways.",
  },
  s0606: {
    literal: "gengyin — Western Zhe observation commissioner Li Xiao died.",
    idiomatic: "Li Xiao died in Zhexi on gengyin.",
  },
  s0607: {
    literal: "xinmao — Li Shidao's wife Lady Wei and sons were confiscated into the inner palace; cousins Shixian and Shizhi and nephew Hongyi were exiled.",
    idiomatic: "Shidao's family was punished on xinmao.",
  },
  s0608: {
    literal: "yiwei — Secretariat Drafter Wei Zhongxing was made Hua Prefect, Tong Pass defense, and Zhenguo army commander.",
    idiomatic: "Wei Zhongxing took Hua and Tong Pass on yiwei.",
  },
  s0609: {
    literal: "xinchou — the Emperor looked at the councillors and said: \"Between listening and accepting, it is greatly difficult.",
    idiomatic: "Xianzong told his ministers that hearing truth was hard.",
  },
  s0610: {
    literal: "Choosing men in good faith and entrusting them — that is called commission — they must give their whole hearts;",
    idiomatic: "Appointment required wholehearted service,",
  },
  s0611: {
    literal: "yet when it comes to action, in affairs there is never lack of partiality.",
    idiomatic: "yet officials still played favorites in office.",
  },
  s0612: {
    literal: "Since I began ruling, years have grown long; though not bright or keen, I gradually see human feelings, and in conduct I strive for careful scrutiny.",
    idiomatic: "He claimed growing insight despite modest self-appraisal.",
  },
  s0613: {
    literal: "Recently I ordered academicians to gather past dynasties' obscure-government cases into the \"Discerning Slander,\" which I wish to read often as a mirror and warning.\"",
    idiomatic: "He cited the Yuanhe slander reader as his moral guidebook.",
  },
  s0614: {
    literal: "Cui Qun replied: \"Without feeling, straight and crooked are easiest to distinguish;",
    idiomatic: "Cui Qun said open cases are easy,",
  },
  s0615: {
    literal: "with a little deceit in the heart, scrutiny is truly hard.",
    idiomatic: "but fraud makes judgment hard.",
  },
  s0616: {
    literal: "Hence Confucius had the theory of many likes and many dislikes, and of slander that soaks the skin — because ambiguity is hard to judge.",
    idiomatic: "He quoted Confucius on mob opinion and whispered slander.",
  },
  s0617: {
    literal: "If the worthy are chosen and entrusted, treated with sincerity, and corrected by law, men will return to the public good — who would dare act falsely?",
    idiomatic: "Honest appointment and law, he said, would end deceit.",
  },
  s0618: {
    literal: "Your Majesty's close reading of the records to broaden intelligence is the empire's great fortune.\"",
    idiomatic: "He praised the emperor's historical reading.\"",
  },
  s0619: {
    literal: "Fuzhou adjutant Linghu Tong was made Right Guard General.",
    idiomatic: "Linghu Tong was made Right Guard general.",
  },
  s0620: {
    literal: "Drafting Attendant Cui Zhi returned the edict, saying Tong had formerly been Shou prefect and lost discipline in using troops — not fit for reward.",
    idiomatic: "Cui Zhi blocked Tong's promotion for a military failure.",
  },
  s0621: {
    literal: "The Emperor ordered councillors to explain to Zhi that Tong's father Zhang had merit — unwilling to abandon the son outright — the edict proceeded.",
    idiomatic: "The throne overruled Cui Zhi for the father's service.",
  },
  s0622: {
    literal: "Summer, fourth month, wushen new moon.",
    idiomatic: "The fourth month opened on wushen.",
  },
  s0623: {
    literal: "yimao — Venus moved direct and drew near the Eastern Well.",
    idiomatic: "Venus marched toward the Eastern Well on yimao.",
  },
  s0624: {
    literal: "wuwu — Penal Minister Li Yuan was made Fengxiang Intendant and Fengxiang-Longyou military commissioner.",
    idiomatic: "Li Yuan took Fengxiang on wuwu.",
  },
  s0625: {
    literal: "bingyin — an edict: \"For all circuit military commissioners, regimental training, defense, and disposition commissioners — subordinate prefectures apart from the home army prefecture, wherever separate suppression, garrison, or horse commands are set up, all shall belong to the prefect.",
    idiomatic: "An edict centralized sub-prefecture troops under civil prefects;",
  },
  s0626: {
    literal: "If the prefect also bears regimental training, defense, or suppression titles for the home prefecture, the horse quota follows that commissioner.",
    idiomatic: "prefects with military titles kept their own quotas;",
  },
  s0627: {
    literal: "If there is no separate commissioner, they belong to the military adjutant.",
    idiomatic: "otherwise troops fell to the circuit adjutant.",
  },
  s0628: {
    literal: "Where on the frontier brooks and caves connect to southern barbarians special walled towns are built unrelated to prefectures, they are outside this limit.\"",
    idiomatic: "Frontier forts on tribal borders were exempt.\"",
  },
  s0629: {
    literal: "xinwei — Works Vice Minister, Grand Councillor, and salt-iron transport commissioner Cheng Yi died.",
    idiomatic: "Cheng Yi died on xinwei.",
  },
  s0630: {
    literal: "bingzi — by decree, Gold-purple Grand Mentor, Chancellery Vice Director, Grand Councillor, concurrent Hongwen University Chancellor, Upper Pillar, Duke of Jin with three thousand households Pei Du was made acting Left Vice Director, concurrent Chancellery Vice Director, Grand Councillor, Taiyuan Intendant, Northern Capital regent, and Hedong military observation and disposition commissioner.",
    idiomatic: "Pei Du was sent to Hedong on bingzi.",
  },
  s0631: {
    literal: "Fifth month, wuyin new moon — Penal Vice Minister Liu Gongchuo was made salt-iron transport commissioner.",
    idiomatic: "Liu Gongchuo took salt transport on wuyin.",
  },
  s0632: {
    literal: "gengchen — Chuzhou Prefect Li Ting was made Xia prefect and Xia-Sui-Yin-You military commissioner.",
    idiomatic: "Li Ting took the northwest on gengchen.",
  },
  s0633: {
    literal: "bingxu — Hedong military commissioner, acting Personnel Minister, Grand Councillor Zhang Hongjing was made Personnel Minister;",
    idiomatic: "Zhang Hongjing entered central Personnel on bingxu;",
  },
  s0634: {
    literal: "Zhongwu military commissioner Li Guangyan was made Bin-Ning-Qing military commissioner, still taking six thousand Zhongwu troops to the post.",
    idiomatic: "Li Guangyan marched six thousand men to the northwest.",
  },
  s0635: {
    literal: "gengyin — Works Minister Heshimei was made acting Penal Minister, Xu prefect, and Zhongwu military commissioner.",
    idiomatic: "Heshimei took Zhongwu on gengyin.",
  },
  s0636: {
    literal: "That night the moon drew near the great Heart star.",
    idiomatic: "The moon neared Antares that night.",
  },
  s0637: {
    literal: "jihai — Linhai pasture supervision was established; the Huainan military commissioner was ordered to hold it concurrently.",
    idiomatic: "A Linhai stud farm was placed under Huainan on jihai.",
  },
  s0638: {
    literal: "An edict settled Li Shigu's wife Lady Pei and daughter Lady Yiniang at Dengzhou; Li Zongshi's wife Lady Wei was released from the inner palace: because Li Shidao's clan had been confiscated, the Emperor pitied them and pardoned with light punishment.",
    idiomatic: "Shidao's female kin were spared harsh confiscation.",
  },
  s0639: {
    literal: "Xuan-She observation commissioner Dou Yizhi was made Run prefect; Western Zhe observation commissioner Han Hong presented two hundred thousand bolts of silk to aid pacifying Ziqing and ten female musicians.",
    idiomatic: "Dou Yizhi went to Run; Han Hong sent silk and entertainers for Ziqing.",
  },
  s0640: {
    literal: "The female musicians were returned.",
    idiomatic: "The court sent the musicians back.",
  },
  s0641: {
    literal: "Sixth month, dingwei new moon.",
    idiomatic: "The sixth month opened on dingwei.",
  },
  s0642: {
    literal: "guichou — Fujian observation commissioner Yuan Xi was made Xuan prefect and Xuan-She-Pool observer.",
    idiomatic: "Yuan Xi took Xuan-She on guichou.",
  },
  s0643: {
    literal: "gengshen — Revenue Vice Minister Gui Deng was made Works Minister.",
    idiomatic: "Gui Deng became works minister on gengshen.",
  },
  s0644: {
    literal: "Zheng Prefect Pei Yi was made Fuzhou prefect and Fujian observation commissioner.",
    idiomatic: "Pei Yi took Fujian.",
  },
  s0645: {
    literal: "xinyou — an edict: Dingzhou metropolitan prefecture again became a superior prefecture.",
    idiomatic: "Dingzhou was restored to upper-prefecture rank on xinyou.",
  },
  s0646: {
    literal: "jiazi — former War Minister Li Jiang was made acting Personnel Minister, Hezhong Intendant, and Hezhong-Jin-Zhang-Ci-Sui observer.",
    idiomatic: "Li Jiang took Hezhong on jiazi.",
  },
  s0647: {
    literal: "guiyou — an edict: Left Golden Guard Grand General Hu Zheng shall be capital northwest frontier inspection commissioner; at each garrison and post, with defending generals weigh benefit and harm, set out facts, and memorialize.",
    idiomatic: "Hu Zheng was sent to inspect northwest defenses on guiyou.",
  },
  s0648: {
    literal: "Autumn, seventh month, dingchou.",
    idiomatic: "The seventh month reached dingchou.",
  },
  s0649: {
    literal: "wuyin — Bianzhou's Han Hong came to court.",
    idiomatic: "Han Hong presented himself at court on wuyin.",
  },
  s0650: {
    literal: "jimao — Left Regular Cavalry Attendant in retirement Xue Pin died.",
    idiomatic: "Xue Pin died on jimao.",
  },
  s0651: {
    literal: "yiyou night — the moon covered the great Heart star.",
    idiomatic: "The moon occulted Antares on yiyou night.",
  },
  s0652: {
    literal: "xinsi — the hundred officials offered the honorific title \"Sacred, Cultured, Divine, Martial, Law-Aligning, Heaven-Responding Emperor.\"",
    idiomatic: "Officials proposed a grand honorific on xinsi.",
  },
  s0653: {
    literal: "That day — at Xuanzheng Hall he received the investiture; when rites ended, he ascended Danfeng Tower and proclaimed a great amnesty for the empire.",
    idiomatic: "He took the title and amnestied the empire the same day.",
  },
  s0654: {
    literal: "This year's capital-region autumn tax, green-sprout, and monopoly wine cash — for each string four hundred cash were remitted;",
    idiomatic: "Capital taxes were cut four hundred cash per string;",
  },
  s0655: {
    literal: "arrears in rent and tax before Yuanhe 5 were all remitted.",
    idiomatic: "and pre-Yuanhe 5 arrears were forgiven.",
  },
  s0656: {
    literal: "jiawu — Han Hong presented two hundred eighty thousand bolts of silk and two hundred seventy silver vessels.",
    idiomatic: "Han Hong gave lavish gifts on jiawu.",
  },
  s0657: {
    literal: "dingyou — Heyang Three Cities Huai military commissioner, Court Discussion Doctor, holder of the staff for Huai military affairs, Huai prefect, concurrent Censor-in-Chief, granted gold-purple fish bag Linghu Chu was made Court Discussion Doctor, concurrent Chancellery Vice Director and Grand Councillor.",
    idiomatic: "Linghu Chu entered the council on dingyou.",
  },
  s0658: {
    literal: "renyin — Yong prefect Wei Zhengwu was made Yongguan disposition commissioner.",
    idiomatic: "Wei Zhengwu took Yongguan on renyin.",
  },
  s0659: {
    literal: "guimao — former Qianzhong observation commissioner Wei Yitong was made Huai prefect and Heyang Three Cities Huai-Meng military commissioner.",
    idiomatic: "Wei Yitong took Heyang on guimao.",
  },
  s0660: {
    literal: "Yi prefecture army mutinied and killed military commissioner Wang Sui.",
    idiomatic: "Wang Sui was killed in the Yi mutiny.",
  },
  s0661: {
    literal: "jiachen — Di Prefect Cao Hua was made Yi prefect and observer over Yi, Hai, Yan, and Mi.",
    idiomatic: "Cao Hua was sent to crush Yi on jiachen.",
  },
  s0662: {
    literal: "yisi — Jinzhou defense commissioner was abolished.",
    idiomatic: "Jinzhou defense was abolished on yisi.",
  },
  s0663: {
    literal: "Eighth month, dingwei new moon.",
    idiomatic: "The eighth month opened on dingwei.",
  },
  s0664: {
    literal: "yiyou — by decree, Xuanwu military vice commissioner in charge, observer over Bian, Song, Bo, Ying, and disposition, Palace Equal in Honor with the Three Excellencies, acting Master of Works, concurrent Palace Attendant, Bian prefect, Upper Pillar, Duke of Xu with three thousand households Han Hong could keep acting Master of Works, concurrent Secretariat Director, and Xuanwu military commissioner.",
    idiomatic: "Han Hong was made Secretariat director on yiyou.",
  },
  s0665: {
    literal: "jiayin — at Xiangzhou Gucheng county Linhan Pasturage was established to raise horses; the Shannan East military commissioner was ordered to hold it concurrently.",
    idiomatic: "A Linhan stud was set under Shannan East on jiayin.",
  },
  s0666: {
    literal: "wuwu — Wang Chengzong was promoted to acting Left Vice Director.",
    idiomatic: "Wang Chengzong received an honorary vice-directorship on wuwu.",
  },
  s0667: {
    literal: "jiwei — Tian Hongzheng came to court.",
    idiomatic: "Tian Hongzheng arrived at court on jiwei.",
  },
  s0668: {
    literal: "The Emperor told the councillors: \"Empire affairs are weighty — one day cannot be neglected.",
    idiomatic: "Xianzong said state business could not wait even on holidays.",
  },
  s0669: {
    literal: "If consecutive holidays come and we do not sit, when there is business go to Yanying to present it.\"",
    idiomatic: "He ordered ministers to seek audience at Yanying whenever needed.\"",
  },
  s0670: {
    literal: "Cui Qun, because brutal heat was extreme, looked as if his colleagues would withdraw.",
    idiomatic: "Cui Qun tried to leave in the heat.",
  },
  s0671: {
    literal: "The Emperor stopped them: \"Several days pass before I see you — though it is hot, I am not troubled.\"",
    idiomatic: "Xianzong kept the council despite summer heat.",
  },
  s0672: {
    literal: "Only after long time were they dismissed.",
    idiomatic: "The audience ran long.",
  },
  s0673: {
    literal: "dinghai — Tian Hongzheng and two hundred generals and staff were feasted at Linde Hall; gifts were graded.",
    idiomatic: "Tian Hongzheng's officers were feasted on dinghai.",
  },
  s0674: {
    literal: "wuchen — Chen-Xu military commissioner, acting Penal Minister Heshimei died.",
    idiomatic: "Heshimei died on wuchen.",
  },
  s0675: {
    literal: "Ninth month, bingzi new moon.",
    idiomatic: "The ninth month opened on bingzi.",
  },
  s0676: {
    literal: "wuyin — Merit Examination Bureau Director Xiao You presented twenty scrolls of ancient paintings and books.",
    idiomatic: "Xiao You offered antiquities on wuyin.",
  },
  s0677: {
    literal: "The Yi mutiny ringleader Wang Bian was beheaded at the eastern market.",
    idiomatic: "Wang Bian was executed for the Yi revolt.",
  },
  s0678: {
    literal: "guiwei — National University Chancellor Li Xun was made acting Rites Minister, Xu prefect, Zhongwu military commissioner, and Chen-Xu-Yin-Cai observer.",
    idiomatic: "Li Xun took Zhongwu on guiwei.",
  },
  s0679: {
    literal: "gengyin — Right Guard Grand General Tian Ji was demoted to Prince of Heng staff officer.",
    idiomatic: "Tian Ji was demoted on gengyin.",
  },
  s0680: {
    literal: "Ji had formerly commanded Xiazhou, privately used forty thousand shi of army grain, forcibly took Dangxiang sheep and horses, causing Dangxiang to bring Tibet to raid — hence demotion.",
    idiomatic: "He had provoked Tibet by plundering Dangxiang.",
  },
  s0681: {
    literal: "jiawu — Crown Prince Junior Tutor Zheng Yuqing was made concurrent National University Chancellor.",
    idiomatic: "Zheng Yuqing took the university on jiawu.",
  },
  s0682: {
    literal: "xinchou — Tian Hongzheng's elder brother Xiang Prefect Tian Rong was made acting Penal Minister, concurrent Crown Prince Guest, and eastern-capital absentee.",
    idiomatic: "Tian Rong was honored in Luoyang on xinchou.",
  },
  s0683: {
    literal: "jiachen — Weibo military commissioner, Grand Mentor of the Palace, acting Master of Works, Grand Councillor, concurrent Wei metropolitan senior administrator, Upper Pillar, Duke of Yi with three thousand households Tian Hongzheng kept acting Master of Works and concurrent Palace Attendant, granted three hundred households of real fief.",
    idiomatic: "Tian Hongzheng received a real fief on jiachen.",
  },
  s0684: {
    literal: "At the time Hongzheng thrice memorialized begging to remain at court — not granted.",
    idiomatic: "He had asked to stay in Chang'an three times in vain.",
  },
  s0685: {
    literal: "yisi — the Emperor looked at the councillors and said: \"I read the Veritable Record of Emperor Xuanzong and saw that in the early Kaiyuan he was keen to seek good government, but from the sixteenth year afterward he seemed somewhat slack and weary; by late Kaiyuan he did not equal the middle years — why?\"",
    idiomatic: "Xianzong asked why Xuanzong's reign faded after Kaiyuan 16.",
  },
  s0686: {
    literal: "Cui Qun replied: \"Xuanzong in youth passed among the people and personally met hardship — hence when he first ascended he knew the people's suffering and personally labored at the myriad administrations.",
    idiomatic: "Cui Qun said early Xuanzong knew common hardship,",
  },
  s0687: {
    literal: "Moreover Yao Chong, Song Jing, Su Ting, and Lu Huaiqian and other upright assistants diligently offered counsel — hence order and peace.",
    idiomatic: "and great ministers kept him honest until order returned.",
  },
  s0688: {
    literal: "Later, long peace made him secure in pleasure and ease; he gradually kept distant from upright scholars and drew near petty men.",
    idiomatic: "Comfort then drew him to flatterers,",
  },
  s0689: {
    literal: "Yuwen Rong pleased his heart by revenue extraction; Li Linfu confused his will with treachery; Guo Zhongyu was added — hence disorder.",
    idiomatic: "until Rong, Linfu, and Guozhong brought ruin.",
  },
  s0690: {
    literal: "May Your Majesty take early Kaiyuan as law and late Tianbao as warning — then the altars' blessing will be without limit.\"",
    idiomatic: "He urged Xianzong to imitate early Kaiyuan, not late Tianbao.\"",
  },
  s0691: {
    literal: "At the time Huangfu Bo with fawning harshness deceived in the council — hence Qun's memorial used this to admonish indirectly.",
    idiomatic: "The speech targeted Huangfu Bo on the council.",
  },
  s0692: {
    literal: "Winter, tenth month, bingwu new moon.",
    idiomatic: "The tenth month opened on bingwu.",
  },
  s0693: {
    literal: "renxu — Annan army mutinied, killed Protector-General Li Xianggu and his household; over a thousand subordinates were all harmed.",
    idiomatic: "Annan troops massacred Li Xianggu's house on renxu.",
  },
  s0694: {
    literal: "bingyin — Tang Prefect Gui Zhongwu was made Annan Protector-General; Chaozhou Prefect Han Yu was made Yuan prefect.",
    idiomatic: "Gui Zhongwu took Annan; Han Yu was moved nearer court.",
  },
  s0695: {
    literal: "That month Tibet raided Yan prefecture.",
    idiomatic: "Tibet raided Yan that month.",
  },
  s0696: {
    literal: "Eleventh month, yihai new moon — Revenue Minister Li Yong was made Crown Prince Guest and Eastern Capital regent.",
    idiomatic: "Li Yong became Luoyang regent on yihai.",
  },
  s0697: {
    literal: "xinmao — Lingwu Grand General Shi Jingfeng broke Tibet below Yan prefecture's wall; Jingfeng was granted fifty households of real fief as reward.",
    idiomatic: "Shi Jingfeng beat Tibet at Yan and was rewarded on xinmao.",
  },
  s0698: {
    literal: "dingyou — Prince of Yuan staff officer Zheng Quan was made Right Golden Guard Grand General and right-street commissioner.",
    idiomatic: "Zheng Quan took the right capital street on dingyou.",
  },
  s0699: {
    literal: "The Emperor took the alchemist Liu Bi's gold elixir medicine; Daily Recorder Pei Pei memorialized strongly remonstrating that \"metal and stone contain fierce nature; with smelting, fire poison is hard to control.",
    idiomatic: "Pei Pei warned against Liu Bi's elixir,",
  },
  s0700: {
    literal: "If the gold elixir is already complete, first order the alchemist to take it himself for one year and observe the effect — then present it to the throne.\"",
    idiomatic: "and asked the alchemist to test it for a year first.\"",
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
