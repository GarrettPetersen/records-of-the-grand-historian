#!/usr/bin/env node
/** Batch 6: s0501–s0600 (Jiutangshu ch.016, Muzong) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/016.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 501;
const END = 600;

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
  s0501: {
    literal: "Chengyuan was made Yan-Fang military commissioner.",
    idiomatic: "Wang Chengyuan took Yan-Fang.",
  },
  s0502: {
    literal: "On jiaxu night, Fire and Wood stars drew near each other.",
    idiomatic: "Mars and Jupiter converged on jiaxu night.",
  },
  s0503: {
    literal: "Cangzhou military commissioner Wang Rijian was granted the surname Li and name Quanlue.",
    idiomatic: "Wang Rijian was renamed Li Quanlue.",
  },
  s0504: {
    literal: "On xinsi, Proper Counsel Grand Master, acting Vice Director of the Chancellery, Grand Councillor, Martial Cavalry Commandant, granted gold-purple fish bag Cui Zhi was made Minister of Punishments and ceased governing affairs.",
    idiomatic: "On xinsi Cui Zhi left the council for Punishments.",
  },
  s0505: {
    literal: "Works Vice Minister Yuan Zhen kept his office and became Grand Councillor.",
    idiomatic: "Yuan Zhen entered the council as works vice minister.",
  },
  s0506: {
    literal: "Hanlin academician and Secretariat Drafter Li Deyu was made Censor-in-Chief.",
    idiomatic: "Li Deyu became censor-in-chief.",
  },
  s0507: {
    literal: "Merit Bureau Outer Director and edict drafter Li Shen was made Secretariat Drafter, continuing as Hanlin academician.",
    idiomatic: "Li Shen was promoted to drafter while keeping the Hanlin.",
  },
  s0508: {
    literal: "Right Vice Heir Apparent Wang Zhongzhou was demoted to Taizhou prefect for dilatory mission conduct.",
    idiomatic: "Wang Zhongzhou was exiled to Taizhou for slow dispatch.",
  },
  s0509: {
    literal: "On guiwei, Shen-Ji field armies military commissioner and Zhongwu military commissioner Li Guangyan was made Cangzhou prefect and Henghai military commissioner, still concurrently Zhongwu military commissioner and Shen-Ji field command as before;",
    idiomatic: "On guiwei Li Guangyan took Cangzhou while keeping Zhongwu and the field command;",
  },
  s0510: {
    literal: "Henghai military commissioner Li Quanlue was made Dezhou prefect and De-Di military commissioner.",
    idiomatic: "Li Quanlue went to De-Di.",
  },
  s0511: {
    literal: "On bingxu, War Bureau Director and edict drafter Feng Su was made acting Left Vice Heir Apparent, Shannan circuit deputy military commissioner, and acting manager of Xiangzhou military government — because Niu Yuanyi was in heavy siege at Shenzhou.",
    idiomatic: "On bingxu Feng Su was sent to manage Xiangzhou while Niu Yuanyi was besieged.",
  },
  s0512: {
    literal: "On dinghai, Hedong military commissioner, Minister of Works, concurrent Vice Director of the Chancellery, and Grand Councillor Pei Du kept Minister of Works and Grand Council seat, was made Eastern Capital intendant, judged Eastern Capital Secretariat affairs, Capital Region and Ru defense commissioner, and Taiwei Palace commissioner;",
    idiomatic: "On dinghai Pei Du was posted to the Eastern Capital while keeping council rank;",
  },
  s0513: {
    literal: "former Lingwu military commissioner Li Ting was made Taiyuan intendant, Northern Capital intendant, and Hedong military commissioner.",
    idiomatic: "Li Ting took Hedong.",
  },
  s0514: {
    literal: "Third month, renchen new moon — an edict said: \"Among martial ranks, stagnation has been considerable.",
    idiomatic: "The third month opened with an edict on promoting martial officers:",
  },
  s0515: {
    literal: "Also, recommended field generals sometimes follow military commissioners back to court.",
    idiomatic: "\"Field generals often return with their commissioners.",
  },
  s0516: {
    literal: "From now on, the six Divine Strategy army commissioners and southern palace regular martial officials should each submit their service records to the Secretariat; those who have long established great merit or possess talent and capacity should be promoted as appropriate.",
    idiomatic: "Martial officers should submit records for merit-based promotion.",
  },
  s0517: {
    literal: "Regular officials transfer by monthly limits; military government officials of surveillance rank and above in circuits are to transfer after three annual terms.",
    idiomatic: "Circuit officers of surveillance rank would rotate every three years.",
  },
  s0518: {
    literal: "Soldiers who died for the throne — within three annual terms clothing and grain must not be stopped.",
    idiomatic: "Families of the war dead would keep rations three years.",
  },
  s0519: {
    literal: "Formerly two hundred cash per string were cut from retained funds to aid the army — hereafter no such extraction.\"",
    idiomatic: "The wartime levy on circuit funds was ended.\" Thus ended the edict.",
  },
  s0520: {
    literal: "The Emperor on the way of controlling armies had not grasped the essentials and often said ministers should be indulged.",
    idiomatic: "Muzong never mastered army discipline and indulged his commanders.",
  },
  s0521: {
    literal: "Hence at the beginning of his reign he emptied the treasury in distributions; long-service recipients reached tens of thousands, and untimely gifts were beyond counting.",
    idiomatic: "He emptied the treasury on rewards that made soldiers rich and arrogant.",
  },
  s0522: {
    literal: "Thus the armies grew more arrogant, laws more lax; in battle they could not win, and the dynasty daily grew perilous.",
    idiomatic: "Discipline collapsed, battles were lost, and the throne grew daily weaker.",
  },
  s0523: {
    literal: "When this edict was issued, regional commanders often sold great generals' written warrants to wealthy merchants, who twisted memorials to obtain court rank — they piled up at the Secretariat.",
    idiomatic: "Regional commanders then sold promotions to merchants who flooded the Secretariat.",
  },
  s0524: {
    literal: "Famous ministers wrung their hands without remedy. On guisi, Minister of War Xiao Mian was made Junior Tutor of the Crown Prince; former Shannan East military commissioner Li Fengji was made Minister of War.",
    idiomatic: "Powerful ministers could only watch. On guisi Xiao Mian and Li Fengji were reassigned.",
  },
  s0525: {
    literal: "On renyin, Left Valiant Cavalry General Zhang Fengguo died.",
    idiomatic: "On renyin Zhang Fengguo died.",
  },
  s0526: {
    literal: "Grand Herald and revenue judge Zhang Pingshu was made Vice Minister of Revenue on stipend.",
    idiomatic: "Zhang Pingshu became vice revenue minister.",
  },
  s0527: {
    literal: "Pingshu, currying favor, memorialized asking that the state itself sell salt to enrich the country and strengthen the army, setting forth eighteen points of benefit and harm.",
    idiomatic: "Zhang Pingshu proposed state salt monopoly in eighteen articles.",
  },
  s0528: {
    literal: "The edict forwarded his memorial for public discussion by the chief ministers.",
    idiomatic: "The court ordered debate on his plan.",
  },
  s0529: {
    literal: "Secretariat Drafter Wei Chuhou rebutted item by item and firmly said it could not be done — the matter then ceased.",
    idiomatic: "Wei Chuhou refuted it and the plan died.",
  },
  s0530: {
    literal: "Zhu Kerong and Wang Tingcou combined armies to attack Shenzhou without lifting the siege.",
    idiomatic: "Zhu Kerong and Wang Tingcou kept Shenzhou under siege.",
  },
  s0531: {
    literal: "Pei Du wrote to instruct them; Kerong returned to his post and Tingcou also slowed the siege — both were then made acting Works Ministers.",
    idiomatic: "Pei Du's letters eased the siege and both rebels received acting Works rank.",
  },
  s0532: {
    literal: "On wushen, Pei Du came to court, answered at Linde Hall, prostrated on the dragon steps, and as he narrated Hebei military use wept aloud; the Emperor changed expression and comforted him.",
    idiomatic: "On wushen Pei Du wept at court over Hebei and won the emperor's comfort.",
  },
  s0533: {
    literal: "On renzi, newly appointed Eastern Capital intendant Pei Du was made Administrator of Yangzhou metropolitan prefecture and Huainan military commissioner.",
    idiomatic: "On renzi Pei Du was sent to Huainan.",
  },
  s0534: {
    literal: "On guichou, Xuzhou military commissioner Cui Qun was driven out by his deputy Wang Zhixing, who monopolized military affairs.",
    idiomatic: "On guichou Wang Zhixing ousted Cui Qun at Xuzhou.",
  },
  s0535: {
    literal: "On jiayin, Right Vice Director Han Gao was made Left Vice Director; former Huainan military commissioner Li Yijian was made Right Vice Director.",
    idiomatic: "On jiayin Han Gao and Li Yijian were promoted as vice directors.",
  },
  s0536: {
    literal: "Former Eastern Capital intendant Li Jiang was again appointed to his old office.",
    idiomatic: "Li Jiang returned to the Eastern Capital post.",
  },
  s0537: {
    literal: "On bingchen, Acting Minister of Works Pei Du received investiture at regular audience, visited the Imperial Ancestral Temple, went up at the Secretariat — chief ministers and the hundred officials all escorted him.",
    idiomatic: "On bingchen Pei Du's investiture drew the full court in procession.",
  },
  s0538: {
    literal: "On dingji, Left Vice Director Cui Cong was made acting Minister of Rites, Yan prefect, and Yan-Fang military commissioner, replacing Wang Chengyuan.",
    idiomatic: "On dingji Cui Cong replaced Wang Chengyuan at Yan-Fang.",
  },
  s0539: {
    literal: "Chengyuan was made Fengxiang-Long military commissioner.",
    idiomatic: "Wang Chengyuan went to Fengxiang.",
  },
  s0540: {
    literal: "On wuwu, Minister of Works Pei Du again entered the Secretariat to manage governance.",
    idiomatic: "On wuwu Pei Du rejoined the council.",
  },
  s0541: {
    literal: "Vice Director of the Chancellery and Grand Councillor Wang Bo was made acting Right Vice Director, concurrent Administrator of Yangzhou metropolitan prefecture, Huainan military commissioner, still concurrently Salt and Iron Transport Commissioner.",
    idiomatic: "Wang Bo took Huainan while keeping Salt and Iron.",
  },
  s0542: {
    literal: "Fengxiang military commissioner Cui Cong was made Henan intendant.",
    idiomatic: "Cui Cong became Henan intendant.",
  },
  s0543: {
    literal: "Niu Yuanyi led more than ten horsemen to break siege and come to court from Shenzhou; Shenzhou great general Zang Ping and one hundred eighty men were all killed by Wang Tingcou.",
    idiomatic: "Niu Yuanyi escaped Shenzhou; Wang Tingcou slaughtered Zang Ping and 180 officers left behind.",
  },
  s0544: {
    literal: "On jiwei, Wuning army deputy military commissioner Wang Zhixing was made acting Works Minister, concurrent Xuzhou prefect, and Wuning military commissioner.",
    idiomatic: "On jiwei Wang Zhixing was confirmed at Wuning.",
  },
  s0545: {
    literal: "De-Di military commissioner Li Quanlue was again made Cangzhou military commissioner; Cang, Jing, De, and Di were again united as one command.",
    idiomatic: "Li Quanlue reunited the Cang-De-Di command.",
  },
  s0546: {
    literal: "Li Guangyan returned to his post at Xuzhou.",
    idiomatic: "Li Guangyan returned to Xu.",
  },
  s0547: {
    literal: "Summer, fourth month, xinyou new moon — the sun was eclipsed.",
    idiomatic: "The fourth month opened with a solar eclipse.",
  },
  s0548: {
    literal: "On jiazi, Left Vice Director Han Gao went up at the Secretariat; palace envoys bestowed wine and viands; chief ministers and the hundred officials escorted him — all as recent precedent.",
    idiomatic: "On jiazi Han Gao's installation followed recent ceremonial precedent.",
  },
  s0549: {
    literal: "Yunyang county wrestler Zhang Li owed Palace Guard cavalry officer Kang Xian money.",
    idiomatic: "A Yunyang wrestler owed a guardsman money.",
  },
  s0550: {
    literal: "Xian went to collect it.",
    idiomatic: "Kang Xian came to collect the debt.",
  },
  s0551: {
    literal: "Li, drunk, struck Xian nearly to death; Xian's son Maide, fourteen years old, took a wooden mallet and broke Li's head — he died three days later.",
    idiomatic: "Drunk, Zhang Li beat Xian nearly dead; Xian's fourteen-year-old son Maide killed Li with a mallet.",
  },
  s0552: {
    literal: "The Ministry of Punishments submitted review; an edict said: \"Maide is still in childhood and knows a son's duty.",
    idiomatic: "Punishments reviewed the case; the edict said Maide was a child who knew filial duty:",
  },
  s0553: {
    literal: "Though killing merits death, for his father it is pitiable.",
    idiomatic: "\"killing deserved death, yet his motive for his father was pitiable.",
  },
  s0554: {
    literal: "If the full death penalty is applied, I fear the meaning of leniency according to circumstance will be lost.",
    idiomatic: "Full execution would ignore the circumstances.",
  },
  s0555: {
    literal: "The death sentence may be reduced one degree.\"",
    idiomatic: "Reduce the sentence one degree.\" Thus ended the edict.",
  },
  s0556: {
    literal: "Xinzhou prefect Li Huan held Boye; Wang Tingcou attacked but could not take it.",
    idiomatic: "Li Huan held Boye against Wang Tingcou's assault.",
  },
  s0557: {
    literal: "The troops Li Huan commanded should be detached to the Right Divine Strategy Army; Huan should be made army commissioner, and the Xinzhou army should retain the Xinzhou name.",
    idiomatic: "Li Huan's troops were transferred to the Right Divine Strategy under his command.",
  },
  s0558: {
    literal: "On gengchen, Guiguan observation commissioner Du Shifang died.",
    idiomatic: "On gengchen Du Shifang died.",
  },
  s0559: {
    literal: "On guiwei, Wuning military commissioner Cui Qun was made Secretariat Supervisor, assigned to the Eastern Capital.",
    idiomatic: "On guiwei Cui Qun was sidelined to the Eastern Capital.",
  },
  s0560: {
    literal: "Hanlin Lecturing Academicians Wei Chuhou and Lu Sui presented their compiled Classic Exegesis in twenty scrolls; they were granted two hundred bolts of brocade and two hundred silver vessels; Chuhou was made Secretariat Drafter, Sui Remonstrating Doctor — both granted gold-purple.",
    idiomatic: "Wei Chuhou and Lu Sui presented Classic Exegesis and were richly rewarded.",
  },
  s0561: {
    literal: "On dinghai, Secretariat Supervisor Yan Yu was made Guiguan observation commissioner.",
    idiomatic: "On dinghai Yan Yu took Guiguan.",
  },
  s0562: {
    literal: "That night, in the northeast a meteor, its light illuminating the ground, with deep rumbling sound, struck the Celestial Market Enclosure wall, reaching Lang position and extinguishing.",
    idiomatic: "That night a meteor thundered into the Celestial Market wall.",
  },
  s0563: {
    literal: "Fifth month, xinmao new moon.",
    idiomatic: "The fifth month opened on xinmao.",
  },
  s0564: {
    literal: "Dezhou prefect Li Jingjian was made Remonstrating Doctor.",
    idiomatic: "Li Jingjian was restored to remonstrance.",
  },
  s0565: {
    literal: "On guichou, Junior Tutor of the Crown Prince Yan Shou died.",
    idiomatic: "On guichou Yan Shou died.",
  },
  s0566: {
    literal: "On wuwu, Youzhou Zhu Kerong submitted a memorial presenting ten thousand horses and one hundred thousand sheep, first requesting their price to reward the army.",
    idiomatic: "On wuwu Zhu Kerong offered horses and sheep for cash to pay his troops.",
  },
  s0567: {
    literal: "In Long Mountains there was a strange beast like a monkey, with long waist and tail, blue-red in color and fierce; seeing Tibetans it leaped and ate them, but not Han people.",
    idiomatic: "Long Mountains reported a beast that ate Tibetans but spared Han travelers.",
  },
  s0568: {
    literal: "Sixth month, gengshen new moon.",
    idiomatic: "The sixth month opened on gengshen.",
  },
  s0569: {
    literal: "On jiazi, Minister of Works and Grand Councillor Pei Du kept Right Vice Director; Works Vice Minister and Grand Councillor Yuan Zhen was made Tongzhou prefect.",
    idiomatic: "On jiazi Pei Du kept the vice directorship while Yuan Zhen was sent to Tongzhou.",
  },
  s0570: {
    literal: "On yichou, Proper Counsel Grand Master, acting Minister of War, Light Chariot Commandant Li Fengji was made Vice Director of the Chancellery and Grand Councillor.",
    idiomatic: "On yichou Li Fengji joined the council.",
  },
  s0571: {
    literal: "On yichou, great wind, thunder, and lightning — the owl-tail of the Imperial Ancestral Temple fell, and the Censorate tree was struck by lightning.",
    idiomatic: "On yichou a storm damaged the ancestral temple and the Censorate tree.",
  },
  s0572: {
    literal: "On dingmao, Yizhou prefect Liu Gongji was made Dingzhou prefect and Yiwu military commissioner.",
    idiomatic: "On dingmao Liu Gongji took Yiwu.",
  },
  s0573: {
    literal: "On renshen, remonstrating officials criticized that Pei Du's punishment was too heavy and Yuan Zhen's too light — Yuan Zhen's appointment edict was then pursued, and his Changchun Palace commissioner post was cut.",
    idiomatic: "On renshen remonstrators forced a rollback of Yuan Zhen's promotion.",
  },
  s0574: {
    literal: "On wuyin, former Right Vice Director Li Yijian was made Junior Tutor of the Crown Prince, assigned to the Eastern Capital.",
    idiomatic: "On wuyin Li Yijian was retired to the Eastern Capital.",
  },
  s0575: {
    literal: "On wuzi, Yongguan was restored; Annan deputy commissioner Cui Jie was made Yongguan pacification commissioner.",
    idiomatic: "On wuzi Yongguan was restored under Cui Jie.",
  },
  s0576: {
    literal: "Autumn, seventh month, jichou new moon.",
    idiomatic: "The seventh month opened on jichou.",
  },
  s0577: {
    literal: "On bingshen, Prince of Song Jie died; court audience was suspended.",
    idiomatic: "On bingshen Prince Jie died and mourning closed court.",
  },
  s0578: {
    literal: "On wuxu, Bianzhou troops mutinied, drove out military commissioner Li Yuan, and installed guard officer Li Si as acting commissioner.",
    idiomatic: "On wuxu Bianzhou mutineers installed Li Si.",
  },
  s0579: {
    literal: "In Hao county mountains and waters flooded and drowned three hundred households.",
    idiomatic: "Floods drowned three hundred households in Hao county.",
  },
  s0580: {
    literal: "Chen, Xu, and Cai circuits had flood water.",
    idiomatic: "Chen, Xu, and Cai suffered floods.",
  },
  s0581: {
    literal: "On renyin, Secretariat Drafter Bai Juyi was sent out as Hangzhou prefect.",
    idiomatic: "On renyin Bai Juyi was posted to Hangzhou.",
  },
  s0582: {
    literal: "On yisi, an edict ordered civil officials of fifth rank and above in north and south offices to discuss suppressing Li Si.",
    idiomatic: "On yisi the court ordered officials to plan against Li Si.",
  },
  s0583: {
    literal: "On bingwu, Li Yuan was demoted to Suizhou prefect.",
    idiomatic: "On bingwu Li Yuan was demoted.",
  },
  s0584: {
    literal: "Zheng-Hua military commissioner Han Chong was made Bianzhou prefect, Xuanyi army military commissioner, and Bian-Song-Bo-Ying observation commissioner; Zheng-Hua as before;",
    idiomatic: "On bingwu Han Chong was sent to Bianzhou with Xuanyi command;",
  },
  s0585: {
    literal: "Xuanyi army military commissioner guard officer Li You was made Right Golden Guard General.",
    idiomatic: "Li You was honored at court.",
  },
  s0586: {
    literal: "On dingwei, five hundred thousand bolts of silk were issued from the inner palace to the revenue office for military use.",
    idiomatic: "On dingwei five hundred thousand bolts of silk were released for the war.",
  },
  s0587: {
    literal: "Chen and Xu flood disaster — fifty thousand shi of relief grain.",
    idiomatic: "Fifty thousand shi of grain relieved Chen and Xu.",
  },
  s0588: {
    literal: "On jiyou, palace envoy Yang Ruichang was sent to Zhenzhou.",
    idiomatic: "On jiyou Yang Ruichang was sent to Zhenzhou.",
  },
  s0589: {
    literal: "Wang Tingcou memorialized: \"Obeying the edict to take Niu Yuanyi's family — request to send them out only by late autumn.",
    idiomatic: "Wang Tingcou asked to delay sending Niu Yuanyi's family until autumn.",
  },
  s0590: {
    literal: "As for Tian Hongzheng's remains, search has not found where they are.\"",
    idiomatic: "He claimed Tian Hongzheng's body could not be found.\"",
  },
  s0591: {
    literal: "On xinhai, posthumous Loyal and Martyr Duke Li Yuan's son Yuan was made Remonstrating Doctor and granted crimson fish bag.",
    idiomatic: "On xinhai Li Yuan's son was honored at court.",
  },
  s0592: {
    literal: "On yimao, an edict: \"Outer Directors knowing drafting duties, after two years become Directors; after two more years become senior Directors; after one more year receive regular appointment;",
    idiomatic: "On yimao an edict fixed promotion timelines for drafting officers:",
  },
  s0593: {
    literal: "Remonstrating Doctors follow the same as Directors above;",
    idiomatic: "remonstrators followed the same ladder;",
  },
  s0594: {
    literal: "Attendants on the Emperor and Hanlin academicians with separate edict appointment are not within this limit.\"",
    idiomatic: "Hanlin appointees were excepted.\" Thus ended the edict.",
  },
  s0595: {
    literal: "Former Yiwu military commissioner Chen Chu was made Eastern Capital intendant, judging Secretariat affairs, and Eastern Capital and Ru defense commissioner.",
    idiomatic: "Chen Chu was named Eastern Capital intendant.",
  },
  s0596: {
    literal: "This dynasty's precedent rarely used martial ministers as Eastern Capital intendant; Chu was used now because Li Si disturbed Bian and Song.",
    idiomatic: "A martial intendant was chosen because Bianzhou was in revolt.",
  },
  s0597: {
    literal: "Eighth month, jiwei new moon — Jiangzhou prefect Cui Hongli was made Henan intendant and Eastern Capital defense deputy commissioner.",
    idiomatic: "The eighth month opened with Cui Hongli named Henan intendant.",
  },
  s0598: {
    literal: "Attendant on the Emperor Wei Ying, because Hongli's standing was light, returned the edict sealed; the Emperor sent a palace envoy to instruct him — then it was issued.",
    idiomatic: "Wei Ying blocked the edict until the emperor overruled him.",
  },
  s0599: {
    literal: "An edict ordered Chen-Xu Li Guangyan to lead troops to recover Bianzhou.",
    idiomatic: "Li Guangyan was ordered to retake Bianzhou.",
  },
  s0600: {
    literal: "On wuchen, Left Vice Director Han Gao was made Eastern Capital intendant, judging Secretariat affairs, and Eastern Capital and Ru defense commissioner.",
    idiomatic: "On wuchen Han Gao took the Eastern Capital post.",
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
if (data.metadata.chapter !== '016') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 016; standalone T ready (${Object.keys(T).length} entries).`
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
