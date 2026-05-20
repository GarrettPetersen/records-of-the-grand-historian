#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.014, Shunzong, Xianzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/014.json';
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
    literal: "Shunzong — Emperor Shunzong, posthumous title To the Utmost Virtue Great Sage Great Peace Filial, taboo name Song, eldest son of Dezong; mother Empress Zhaode, née Wang.",
    idiomatic: "Shunzong, the Filial Emperor Song, was Dezong's eldest son; his mother was Empress Zhaode Wang.",
  },
  s0002: {
    literal: "In the first month of Shangyuan 2 he was born in the Eastern Inner Palace at Chang'an.",
    idiomatic: "He was born in the eastern palace quarter of Chang'an in Shangyuan 2.",
  },
  s0003: {
    literal: "In the sixth month of Dali 14 he was enfeoffed Prince of Xuan.",
    idiomatic: "In Dali 14 he received the title Prince of Xuan.",
  },
  s0004: {
    literal: "In the first month of Jianzhong 1, on dingmao, he was installed as heir apparent.",
    idiomatic: "He became crown prince on dingmao in the first month of Jianzhong 1.",
  },
  s0005: {
    literal: "In the first month of Zhenyuan 21, on guisi, Dezong died; on bingshen he took the throne in the Hall of Supreme Ultimate.",
    idiomatic: "Dezong died on guisi; three days later Shunzong ascended at the Hall of Supreme Ultimate.",
  },
  s0006: {
    literal: "The Emperor from the ninth month of year 20 had wind illness and could not speak; when Dezong fell gravely ill, all princes and kin attended with medicine — only the Emperor lay ill and could not attend.",
    idiomatic: "Since Zhenyuan 20 he had been speechless from a stroke; when Dezong lay dying, he alone could not attend the sickbed.",
  },
  s0007: {
    literal: "As Dezong lingered, he longed to see the heir; he wept and choked for a long time.",
    idiomatic: "On his deathbed Dezong wept to see the crown prince he could not summon.",
  },
  s0008: {
    literal: "When the late Emperor's mourning began, people's hearts were shaken with fear.",
    idiomatic: "The court trembled when the imperial mourning was proclaimed.",
  },
  s0009: {
    literal: "The Emperor, forcing himself despite illness, wore mourning garments and received the hundred officials at the Nine Immortals Gate.",
    idiomatic: "He dragged himself into mourning dress to receive officials at the Nine Immortals Gate.",
  },
  s0010: {
    literal: "Once enthroned, knowing the altars had a bearer, within and without began to be at peace.",
    idiomatic: "His accession assured the realm that the throne was filled, and fear eased.",
  },
  s0011: {
    literal: "On gengzi the host of ministers submitted memorials asking that he hear government.",
    idiomatic: "On gengzi the bureaucracy petitioned him to take up rule.",
  },
  s0012: {
    literal: "Second month, xinchou new moon.",
    idiomatic: "The second month opened on xinchou.",
  },
  s0013: {
    literal: "On jiashen Yuan Shao, staff officer of the Three Cities of Heyang campaign army, was made prefect of Huai and commissioner of Heyang-Huai.",
    idiomatic: "Yuan Shao became Heyang-Huai commissioner on jiashen.",
  },
  s0014: {
    literal: "On bingwu forty-two supernumeraries were dismissed — Hanlin medical artisans, physiognomists, astrologers, diviners by casting, and idle eaters.",
    idiomatic: "Forty-two court fortune-tellers and hangers-on were cut on bingwu.",
  },
  s0015: {
    literal: "On jiyou Zhang Maozhao of Yiding was made concurrent Grand Councillor, favored because he had come to court.",
    idiomatic: "Zhang Maozhao received a concurrent premiership as reward for his visit.",
  },
  s0016: {
    literal: "That night Venus trespassed upon the Pleiades.",
    idiomatic: "Venus crossed the Pleiades that night.",
  },
  s0017: {
    literal: "On xinmao Wei Zhiyi, bureau director in the Ministry of Personnel, was made Left Vice Director of the Department of State Affairs and Grand Councillor.",
    idiomatic: "Wei Zhiyi entered the council on xinmao.",
  },
  s0018: {
    literal: "On xinyou Metropolitan Governor Li Shi was demoted to long-term administrator of Tongzhou; he soon died.",
    idiomatic: "Li Shi, exiled to Tongzhou, died shortly after on xinyou.",
  },
  s0019: {
    literal: "On renzi Li Shigu of Ziqing raided the eastern marches of Hua with troops, having heard of the national mourning.",
    idiomatic: "Li Shigu attacked Hua's border on renzi, exploiting the mourning.",
  },
  s0020: {
    literal: "On jiayin sixteen prisoners of the inner guard — Yan Huaizhi, Lü Wen, and others — were released.",
    idiomatic: "Sixteen men long held in the inner guard were freed on jiayin.",
  },
  s0021: {
    literal: "At the Pingliang pact they had fallen into Tibet.",
    idiomatic: "They had been captured when the Pingliang treaty party was seized by Tibet.",
  },
  s0022: {
    literal: "After long years they returned; because they knew Tibetan affairs, they were not wished outside — hence imprisoned in the inner guard; only now were they released.",
    idiomatic: "Knowing Tibetan secrets, they had been kept in the palace guard until this release.",
  },
  s0023: {
    literal: "The king of Japan and his wife also returned to Tibet; gifts were bestowed and they were sent off.",
    idiomatic: "A Japanese king and queen were likewise sent home to Tibet with gifts.",
  },
  s0024: {
    literal: "On renyin Wang Pi, attendant calligrapher to the heir, and Hanlin awaiting-edict, was made Left Regular Cavalry Attendant and Hanlin academician.",
    idiomatic: "Wang Pi joined the Hanlin on renyin.",
  },
  s0025: {
    literal: "Former staff officer in the Ministry of Justice, Hanlin awaiting-edict Wang Shuwen was made Diary Attendant and Hanlin academician.",
    idiomatic: "Wang Shuwen entered the Hanlin as diary attendant.",
  },
  s0026: {
    literal: "Minister of Diplomatic Reception Wang Quan was made Metropolitan Governor.",
    idiomatic: "Wang Quan became capital intendant.",
  },
  s0027: {
    literal: "On jiazi he took Danfeng Tower and proclaimed a great amnesty for the empire.",
    idiomatic: "A general amnesty was proclaimed from Danfeng Tower on jiazi.",
  },
  s0028: {
    literal: "In all circuits, apart from regular statutory tax rates in imperial orders, every sort of monopoly levy should be forbidden;",
    idiomatic: "The edict banned circuit monopoly taxes beyond the statutory rates;",
  },
  s0029: {
    literal: "apart from tribute to the court, there must be no separate presentations.",
    idiomatic: "and barred extra tribute presentations.",
  },
  s0030: {
    literal: "Commoners ninety and above were granted two piculs of grain and two bolts of silk, given honorary posts as Senior Assistant and District Lady, and their circuit magistrates were ordered to visit them at home;",
    idiomatic: "Nonagenarians received grain, silk, and honorary titles, with local officials sent to inquire after them;",
  },
  s0031: {
    literal: "those one hundred and above were granted five piculs of grain, two bolts of silk, one bundle of cotton, sheep and wine, and honorary posts as Lower Prefect and Commandery Lady.",
    idiomatic: "centenarians received richer gifts and higher honorary ranks.",
  },
  s0032: {
    literal: "On wuchen Kim Chung-hee of Silla, Grand Mentor of the Palace, acting Grand General, military commissioner of Gyerim, and pillar of the state, was also made commissioner of the Ninghai army; his mother Lady He was made Grand Consort, his wife Lady Pak consort.",
    idiomatic: "The Silla king received added titles and his kin were ennobled on wuchen.",
  },
  s0033: {
    literal: "Third month, gengwu — three hundred palace women were sent out to Anguo Temple; six hundred women musicians of the inner palace and teaching workshops were sent out at the Nine Immortals Gate and their kin summoned to take them home.",
    idiomatic: "In the third month hundreds of palace women and musicians were released to their families.",
  },
  s0034: {
    literal: "On wuyin Wei Gao was made acting Grand General; Li Shigu and Liu Ji were made acting Masters of Works.",
    idiomatic: "Wei Gao and two warlords received honorary grand titles on wuyin.",
  },
  s0035: {
    literal: "Zhang Maozhao was made Minister of Education.",
    idiomatic: "Zhang Maozhao became Minister of Education.",
  },
  s0036: {
    literal: "On bingxu Du You, acting Master of Works and Grand Councillor, was made commissioner of revenue, salt, and iron.",
    idiomatic: "Du You took the fiscal commission on bingxu.",
  },
  s0037: {
    literal: "On wuzi the Xuzhou command was given the name Wuning Army.",
    idiomatic: "Xuzhou's army was renamed Wuning on wuzi.",
  },
  s0038: {
    literal: "Wu Shao-cheng of Cai was made concurrent Grand Councillor.",
    idiomatic: "Wu Shao-cheng of Cai received a concurrent premiership.",
  },
  s0039: {
    literal: "Hanlin academician Wang Shuwen was made vice commissioner of revenue, salt, iron, and transport.",
    idiomatic: "Wang Shuwen took the transport vice-commission.",
  },
  s0040: {
    literal: "Although Du You bore the commissioner's title, in fact Shuwen held overall control.",
    idiomatic: "Du You was nominal head; Wang Shuwen ran fiscal policy.",
  },
  s0041: {
    literal: "Grand Councillor Jia Dan was made acting Master of Works; Zheng Yu Minister of Personnel; Gao Ying Minister of Justice; Wei Zhiyi Vice Director of the Secretariat; Wang Shizhen of Zhenji, Wang E of Huainan, and Tian Ji'an of Weibo were all made acting Masters of Works.",
    idiomatic: "A round of ministerial and honorary appointments followed for court and frontier leaders.",
  },
  s0042: {
    literal: "On guisi an edict enfeoffed Prince of Guangling Chun as heir apparent; his name was changed to Chun.",
    idiomatic: "Prince Chun of Guangling became heir apparent as Chun on guisi.",
  },
  s0043: {
    literal: "Summer, fourth month, renyin — an order enfeoffed the tenth younger brother E as Prince of Qin and the eleventh Yan as Prince of Zhen.",
    idiomatic: "Two imperial brothers were enfeoffed in the fourth month.",
  },
  s0044: {
    literal: "The son, Prince of Jiankang Huan, was enfeoffed Prince of Tan; his name was changed to Jing;",
    idiomatic: "Prince Huan of Jiankang became Prince of Tan as Jing;",
  },
  s0045: {
    literal: "Prince of Yangchuan Mian, Prince of Jun; his name was changed to Wei;",
    idiomatic: "Mian of Yangchuan became Prince of Jun as Wei;",
  },
  s0046: {
    literal: "Prince of Linhuai Xun, Prince of Yi; his name was changed to Zong;",
    idiomatic: "Xun of Linhuai became Prince of Yi as Zong;",
  },
  s0047: {
    literal: "Prince of Hongnong Mei, Prince of Ju; his name was changed to Shu;",
    idiomatic: "Mei of Hongnong became Prince of Ju as Shu;",
  },
  s0048: {
    literal: "Prince of Handong Yong, Prince of Mi; his name was changed to Chou;",
    idiomatic: "Yong of Handong became Prince of Mi as Chou;",
  },
  s0049: {
    literal: "Prince of Jinling Di, Prince of Xun; his name was changed to Zong;",
    idiomatic: "Di of Jinling became Prince of Xun as Zong;",
  },
  s0050: {
    literal: "Prince of Gaoping Su, Prince of Shao; his name was changed to Yue;",
    idiomatic: "Su of Gaoping became Prince of Shao as Yue;",
  },
  s0051: {
    literal: "Prince of Yun'an Zi, Prince of Song; his name was changed to Jie;",
    idiomatic: "Zi of Yun'an became Prince of Song as Jie;",
  },
  s0052: {
    literal: "Prince of Xuancheng Huai, Prince of Ji; his name was changed to Xiang;",
    idiomatic: "Huai of Xuancheng became Prince of Ji as Xiang;",
  },
  s0053: {
    literal: "Prince of Deyang Xu, Prince of Ji; his name was changed to Gui;",
    idiomatic: "Xu of Deyang became Prince of Ji as Gui;",
  },
  s0054: {
    literal: "Prince of Hedong Yi, Prince of He; his name was changed to Qi.",
    idiomatic: "Yi of Hedong became Prince of He as Qi.",
  },
  s0055: {
    literal: "The seventeenth son Xuan was enfeoffed Prince of Heng; the nineteenth son Xun Prince of Hui; the twentieth Guan Prince of Fu; the twenty-first Hong Prince of Fu; the twenty-third Lun Prince of Yue; the twenty-fourth Shen Prince of Yuan; the twenty-fifth Lun Prince of Gui; the twenty-seventh Chan Prince of Yi; the heir of Michin, Dao Wul-li, was enfeoffed King of Michin.",
    idiomatic: "A batch of younger princes and a Michin heir received titles.",
  },
  s0056: {
    literal: "The son of Prince of Xiping Sheng, Left General of the Left Forest Guard Yuan, inherited enfeoffment as Duke of Qi with a fief of three thousand households.",
    idiomatic: "Sheng's son Yuan inherited the Qi dukedom with three thousand households.",
  },
  s0057: {
    literal: "On wushen an edict, because the heir's investiture rites were complete, pardoned capital prisoners in the capital — great execution reduced to exile, exile and below reduced one grade.",
    idiomatic: "Capital prisoners were partially pardoned after the heir's enthronement rites on wushen.",
  },
  s0058: {
    literal: "Supervisor of Attendants Lu Zhi and Secretariat Drafter Cui Shu were both made lecturers to the heir.",
    idiomatic: "Lu Zhi and Cui Shu became tutors to the crown prince.",
  },
  s0059: {
    literal: "On gengxu the heir's sons Ning, Kuan, You, Cha, Huan, and Liao were enfeoffed princes of commanderies, each with a fief of three thousand households.",
    idiomatic: "Six of the heir's sons became commandery princes on gengxu.",
  },
  s0060: {
    literal: "On guichou Zhang Jian, late envoy to Tibet, Vice Minister of Works and concurrent Censor-in-Chief, was posthumously made Minister of Rites.",
    idiomatic: "Zhang Jian was posthumously honored on guichou.",
  },
  s0061: {
    literal: "On bingyin the Wan'an supervisory pasture was abolished.",
    idiomatic: "The Wan'an imperial pasture was shut on bingyin.",
  },
  s0062: {
    literal: "On wuchen Han Gao, prefect of Hangzhou, was made Right Vice Director of the Department of State Affairs.",
    idiomatic: "Han Gao entered the central administration on wuchen.",
  },
  s0063: {
    literal: "Fifth month, jisi — Right General of the Right Golden Guard Fan Xichao was made commanding general of the Right Divine Strategy Army and commissioner of the Left and Right Divine Strategy and western capital garrison campaign forces.",
    idiomatic: "Fan Xichao took command of the Shence armies in the fifth month.",
  },
  s0064: {
    literal: "On dingchou Wei Dan, Yong circuit commissioner, was made Vice Governor of Henan; Fang Qi, magistrate of Wannian, was made Rongguan pacification and campaign commissioner.",
    idiomatic: "Wei Dan and Fang Qi received southern posts on dingchou.",
  },
  s0065: {
    literal: "On guiwei Zheng Yuqing, staff officer of Chenzhou, was made Left Vice Director of the Department of State Affairs.",
    idiomatic: "Zheng Yuqing became left vice director on guiwei.",
  },
  s0066: {
    literal: "On jiachen King Daesung of Parhae, acting Master of Works and governor of Hohon, was made acting Minister of Education.",
    idiomatic: "The Parhae king was promoted on jiachen.",
  },
  s0067: {
    literal: "Lady Wang and Lady Zhao of Chenghui could be Brilliant Companion; Ladies Cui and Yang could be Filling Companion; Lady Wang could be Brilliant Beauty; another Lady Wang could be Brilliant Countenance; Lady Niu could be Cultivated Beauty; Lady Zhang could be Beauty.",
    idiomatic: "Several palace ladies received new rank titles.",
  },
  s0068: {
    literal: "Right Vice Director Han Gao was made regimental and observation commissioner of E, Yue, Mian, and Qi.",
    idiomatic: "Han Gao left the capital for the E-Yue command.",
  },
  s0069: {
    literal: "On dinghai Xiangzhou was elevated to a great metropolitan prefecture.",
    idiomatic: "Xiangyang became a great metropolitan prefecture on dinghai.",
  },
  s0070: {
    literal: "Linhan county was again moved to Dengcheng.",
    idiomatic: "Linhan county seat was relocated to Dengcheng.",
  },
  s0071: {
    literal: "On xinmao Wang Shuwen, vice commissioner of salt and iron transport, was made Vice Minister of Revenue.",
    idiomatic: "Wang Shuwen became vice minister of revenue on xinmao.",
  },
  s0072: {
    literal: "Sixth month, bingshen — an edict: all levies, rents, and cash and silk owed by the people before the tenth month of year 21, totaling 526,841 strings, piculs, bolts, and bundles, were all to be remitted.",
    idiomatic: "Over half a million units of back taxes were forgiven on bingshen.",
  },
  s0073: {
    literal: "Seventh month, wuchen new moon — the Tibetan envoy Lun Senor came to court with tribute.",
    idiomatic: "A Tibetan envoy presented tribute at the seventh-month audience.",
  },
  s0074: {
    literal: "On bingzi Li Shigu of Yanzhou was made acting Palace Attendant.",
    idiomatic: "Li Shigu received an honorary palace title on bingzi.",
  },
  s0075: {
    literal: "The late Vice Prefect of Zhongzhou Lu Zhi was posthumously made Vice Minister of War, posthumous name Xuan;",
    idiomatic: "Lu Zhi was posthumously honored as Vice Minister of War with the posthumous name Xuan;",
  },
  s0076: {
    literal: "the late Prefect of Daozhou Yang Cheng was posthumously made Left Regular Cavalry Attendant.",
    idiomatic: "Yang Cheng was posthumously made Left Regular Cavalry Attendant.",
  },
  s0077: {
    literal: "On wuyin Pan Mengyang, Vice Minister of Revenue, was made vice commissioner of revenue, salt, iron, and transport.",
    idiomatic: "Pan Mengyang joined the fiscal commission on wuyin.",
  },
  s0078: {
    literal: "On bingxu locusts in the east ate the fields.",
    idiomatic: "Locusts ravaged eastern crops on bingxu.",
  },
  s0079: {
    literal: "On guisi Cheng Huaixin, military commissioner of the Transocean Army and prefect of Cang, died; his son Vice Commissioner Zhigong was recalled from mourning to succeed as prefect of Cang and military commissioner.",
    idiomatic: "Cheng Huaixin died; his son Zhigong inherited the Transocean command on guisi.",
  },
  s0080: {
    literal: "On jiawu Revenue Commissioner Du You memorialized: \"In the Grand Granary there are presently 800,000 piculs, stored fifteen years; at Dongwei Bridge 450,000 piculs — paying out to the armies, none are pleased.",
    idiomatic: "Du You reported huge old grain stores that troops refused to eat on jiawu.",
  },
  s0081: {
    literal: "This year is abundant; I ask to suspend temporarily north-river transport and purchase in harmony 200,000 piculs in riverine prefectures and circuits, to relieve the harm to agriculture.\"",
    idiomatic: "He proposed halting northern transport and local purchase to ease rural distress.",
  },
  s0082: {
    literal: "The matter was sent down for the hundred officials to debate; debaters differed, and it stopped undecided.",
    idiomatic: "Officials split on the plan and it died in debate.",
  },
  s0083: {
    literal: "On yiwei an edict: \"I inherit the glory of the nine sages and bear the weight of ten thousand states.",
    idiomatic: "An edict on yiwei opened with the emperor's sense of unworthy burden:",
  },
  s0084: {
    literal: "Looking on my slight virtue, my path in the Way is not yet clear; reverent and cautious, I fear I cannot bear it.",
    idiomatic: "he confessed weak virtue and fear of failing the throne.",
  },
  s0085: {
    literal: "I fear above I will drop the ancestors' instruction and below leave worry to the ministers; morning and night reverent diligence, as if facing an abyss or ravine.",
    idiomatic: "He spoke of dreading to disappoint ancestors and ministers alike.",
  },
  s0086: {
    literal: "Yet accumulated illness is not recovered, reaching across seasons; nurturing spirit and preserving harmony is often what I have no leisure for.",
    idiomatic: "Chronic illness, he said, left no strength for rule.",
  },
  s0087: {
    literal: "Ever considering the vastness of the four quarters and the multitude of affairs — if I do not personally attend, I fear there will be neglect.",
    idiomatic: "He feared the realm's business could not wait on his recovery.",
  },
  s0088: {
    literal: "Moreover the mountain tomb has its day; heavy rains exceed ten days — therefore I am warned in heart to answer Heaven's admonition.",
    idiomatic: "Impending burial and floods moved him to heed Heaven's warning.",
  },
  s0089: {
    literal: "Military and civil affairs should be ordered handled by the crown prince.\"",
    idiomatic: "He entrusted all state affairs to the crown prince. Thus ended the edict.",
  },
  s0090: {
    literal: "At the time the Emperor had long been ill and no longer received and admitted councillors to discuss great affairs together.",
    idiomatic: "The sick emperor had ceased to meet his chief ministers.",
  },
  s0091: {
    literal: "Nothing great or small was all decided by Li Zhongyan, Wang Pi, and Wang Shuwen.",
    idiomatic: "Li Zhongyan, Wang Pi, and Wang Shuwen decided everything.",
  },
  s0092: {
    literal: "Public opinion was noisy and confused; it was held impossible.",
    idiomatic: "Court opinion condemned the arrangement as unworkable.",
  },
  s0093: {
    literal: "The frontier commands repeatedly sent memorials to the crown prince, pointing to the three eunuchs' interference in government — hence this edict.",
    idiomatic: "Provincial armies blamed eunuch meddling and forced the transfer edict.",
  },
  s0094: {
    literal: "On yisi, Minister of Rites Du Huangchang was made Vice Director of the Chancellery; Left Golden Guard Grand General Yuan Zi was made Vice Director of the Secretariat; both were Grand Councillors;",
    idiomatic: "Du Huangchang and Yuan Zi entered the council on yisi;",
  },
  s0095: {
    literal: "Zheng Qionyu was made Minister of Personnel, Gao Ying Minister of Justice; both ceased handling administration.",
    idiomatic: "Zheng Qionyu and Gao Ying left the council.",
  },
  s0096: {
    literal: "The crown prince received the hundred officials in the court hall.",
    idiomatic: "The heir held court for the bureaucracy.",
  },
  s0097: {
    literal: "On bingshen the crown prince at the west pavilion of Linde Hall received officials who presented business.",
    idiomatic: "On bingshen he heard petitions at Linde's west pavilion.",
  },
  s0098: {
    literal: "Eighth month, dingyou new moon.",
    idiomatic: "The eighth month opened on dingyou.",
  },
  s0099: {
    literal: "On gengzi an edict: \"Only the August Heaven blesses and orders the glorious ancestor, who received the regions and states; the nine sages stored blessing; ten thousand states all rest.",
    idiomatic: "On gengzi an abdication edict invoked Heaven's mandate on the Tang line:",
  },
  s0100: {
    literal: "I alone have obtained and continued the great enterprise, stern and reverent in keeping the throne, with no leisure to rest.",
    idiomatic: "the emperor confessed illness and inability to sustain rule alone.",
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
if (data.metadata.chapter !== '014') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 014; standalone T ready (${Object.keys(T).length} entries).`
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
