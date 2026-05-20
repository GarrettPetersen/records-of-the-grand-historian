#!/usr/bin/env node
/** Batch 5: s0401–s0500 (Jiutangshu ch.016, Muzong) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/016.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 401;
const END = 500;

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
  s0401: {
    literal: "On yichou, Hedong military commissioner Pei Du was made commissioner to pacify You and Zhen circuits.",
    idiomatic: "On yichou Pei Du was charged with pacifying You and Zhen.",
  },
  s0402: {
    literal: "On gengyin, Jianzhou prefect Li Jingjian was made Remonstrating Doctor.",
    idiomatic: "On gengyin Li Jingjian entered the remonstrance bureau.",
  },
  s0403: {
    literal: "On renchen night, Venus drew near the Western Enclosure of the Supreme Palace.",
    idiomatic: "Venus neared the Supreme Palace's western wall on renchen night.",
  },
  s0404: {
    literal: "On guisi, Zhenzhou troops went out and besieged Shenzhou.",
    idiomatic: "On guisi Zhenzhou forces besieged Shenzhou.",
  },
  s0405: {
    literal: "Ninth month, jiawu new moon.",
    idiomatic: "The ninth month opened on jiawu.",
  },
  s0406: {
    literal: "On dingyou, Mingshui county of Xingzhou was abolished.",
    idiomatic: "On dingyou Mingshui county was abolished.",
  },
  s0407: {
    literal: "On wuxu night, Venus drew near the Right Enforcement star of the Supreme Palace.",
    idiomatic: "On wuxu night Venus neared the Supreme Palace's Right Enforcement star.",
  },
  s0408: {
    literal: "On renyin, great rain with thunder and lightning.",
    idiomatic: "On renyin a thunderstorm struck.",
  },
  s0409: {
    literal: "On yisi, Xiangzhou troops mutinied and killed prefect Xing Chu.",
    idiomatic: "On yisi Xiangzhou mutineers killed their prefect.",
  },
  s0410: {
    literal: "On bingwu, Palace Attendant Duan Wenzheng was ordered to supervise Zheng-Hua, Hedong, and Xu circuit troops to rescue Shenzhou.",
    idiomatic: "On bingwu Duan Wenzheng took command of relief forces for Shenzhou.",
  },
  s0411: {
    literal: "Tibet requested alliance — it was granted.",
    idiomatic: "Tibet's request for alliance was accepted.",
  },
  s0412: {
    literal: "On xinhai night, the moon drew near the Celestial Pass.",
    idiomatic: "On xinhai night the moon neared the Celestial Pass.",
  },
  s0413: {
    literal: "On renzi, Youzhou rebels plundered Lai River, Suicheng, and Mancheng in Yizhou.",
    idiomatic: "On renzi Youzhou raiders struck three Yizhou counties.",
  },
  s0414: {
    literal: "On guichou, former Weibo military commissioner Li Yun was made Junior Tutor of the Crown Prince.",
    idiomatic: "On guichou Li Yun became crown prince tutor.",
  },
  s0415: {
    literal: "On guiyou, Weibo military commissioner Tian Bu memorialized that he had sent five thousand troops to the Beizhou field camp.",
    idiomatic: "On guiyou Tian Bu reported five thousand men sent to Beizhou.",
  },
  s0416: {
    literal: "Winter, tenth month, jiazi new moon.",
    idiomatic: "The tenth month opened on jiazi.",
  },
  s0417: {
    literal: "On bingyin, Grand Master of the Palace, acting Minister of Justice, Cavalry Commandant Wang Bo was made Vice Director of the Chancellery and Grand Councillor, continuing as Salt and Iron Transport Commissioner.",
    idiomatic: "On bingyin Wang Bo joined the council while keeping Salt and Iron.",
  },
  s0418: {
    literal: "Hedong military commissioner Pei Du was made commander-in-chief of the Zhenzhou encirclement campaign.",
    idiomatic: "Pei Du took overall command against Zhenzhou.",
  },
  s0419: {
    literal: "Left Leading Army Guard Grand General Du Shuliang was made military commissioner of the Shen-Ji field command.",
    idiomatic: "Du Shuliang was named to lead the Shen-Ji field army.",
  },
  s0420: {
    literal: "On wuchen, Shen-Ji military commissioner Niu Yuanyi was made Administrator of Zhenzhou metropolitan prefecture, Chengde military commissioner, and military commissioner of Zhen, Ji, Shen, and Zhao.",
    idiomatic: "On wuchen Niu Yuanyi was installed as Chengde military commissioner.",
  },
  s0421: {
    literal: "On xinwei, Secretariat Drafter and examination supervisor Wang Qi was made Minister of Rites; War Bureau Director Yang Sifu was made Treasury Bureau Director and edict drafter.",
    idiomatic: "On xinwei Wang Qi took Rites and Yang Sifu joined the drafting office.",
  },
  s0422: {
    literal: "On renshen, Eastern Capital intendant Zheng Yin was made Minister of Personnel.",
    idiomatic: "On renshen Zheng Yin became Minister of Personnel.",
  },
  s0423: {
    literal: "Minister of Personnel Li Jiang was made acting Right Vice Director, judging Eastern Capital Secretariat affairs, Eastern Capital intendant, and Capital Region defense commissioner.",
    idiomatic: "Li Jiang was posted to the Eastern Capital as acting vice director.",
  },
  s0424: {
    literal: "Works Minister Ding Gongzhu was made acting Left Regular Cavalry Attendant, concurrent Yuezhou prefect and Censor-in-Chief, and Zhedong observation commissioner.",
    idiomatic: "Ding Gongzhu went to Zhedong on concurrent posts.",
  },
  s0425: {
    literal: "On yihai, Yizhou prefect Wang Zhixing was made Wuning army deputy military commissioner.",
    idiomatic: "On yihai Wang Zhixing became Wuning deputy commander.",
  },
  s0426: {
    literal: "On dingchou, Pei Du memorialized that he would personally lead troops by the old Guan road to advance the attack.",
    idiomatic: "On dingchou Pei Du pledged to lead the advance by the Guan road.",
  },
  s0427: {
    literal: "Zhu Kerong's troops raided Weizhou.",
    idiomatic: "Zhu Kerong struck Weizhou.",
  },
  s0428: {
    literal: "On wuyin, Wang Tingcou's troops raided Beizhou.",
    idiomatic: "On wuyin Wang Tingcou attacked Beizhou.",
  },
  s0429: {
    literal: "Yizhou prefect Liu Gongji memorialized that at Baishiling he had broken three thousand Yan troops.",
    idiomatic: "Liu Gongji reported crushing three thousand Yan troops at Baishiling.",
  },
  s0430: {
    literal: "Cangzhou's Wu Chongyin memorialized that at Raoyang he had broken the rebels.",
    idiomatic: "Wu Chongyin reported a victory at Raoyang.",
  },
  s0431: {
    literal: "Works Minister Wei Guanzhi died.",
    idiomatic: "Wei Guanzhi died.",
  },
  s0432: {
    literal: "On renwu, Secretariat Master of Guests Director and edict drafter Bai Juyi was made Secretariat Drafter.",
    idiomatic: "On renwu Bai Juyi was promoted to drafter.",
  },
  s0433: {
    literal: "Hedong military commissioner Pei Du thrice submitted memorials charging Hanlin academician Yuan Zhen and Palace Secretariat eunuch Wei Hongjian with collusion that overturned court governance.",
    idiomatic: "Pei Du thrice accused Yuan Zhen and eunuch Wei Hongjian of corrupting the court.",
  },
  s0434: {
    literal: "Yuan Zhen was made Works Vice Minister and removed from the Hanlin.",
    idiomatic: "Yuan Zhen left the Hanlin for Works.",
  },
  s0435: {
    literal: "Hongjian was made Bow and Arrow Store commissioner.",
    idiomatic: "Wei Hongjian was sent to the bow store.",
  },
  s0436: {
    literal: "On jiashen, Jingzhao intendant and Censor-in-Chief Liu Gongchuo was made Vice Minister of Personnel.",
    idiomatic: "On jiashen Liu Gongchuo became vice personnel minister.",
  },
  s0437: {
    literal: "On bingxu, Shen-Ji field commissioner Du Shuliang was made Cangzhou prefect and Henghai military commissioner, replacing Wu Chongyin;",
    idiomatic: "On bingxu Du Shuliang replaced Wu Chongyin at Cangzhou;",
  },
  s0438: {
    literal: "Chongyin was made acting Minister of Works, Xingyuan intendant, and Shannan West military commissioner.",
    idiomatic: "Wu Chongyin was transferred to Shannan West.",
  },
  s0439: {
    literal: "The Emperor was urgent to destroy the rebels; on the day Du Shuliang set out he faced the throne and memorialized: \"Your servant will break the rebels within days.\"",
    idiomatic: "Du Shuliang promised a swift victory as he departed.",
  },
  s0440: {
    literal: "Chongyin was skilled at command and knew warfare; because rebel strength could not be suddenly pacified, he used troops somewhat slowly — hence this appointment.",
    idiomatic: "Wu Chongyin's deliberate pace had cost him the command.",
  },
  s0441: {
    literal: "On dinghai, former Zhedong observation commissioner Xue Rong died.",
    idiomatic: "On dinghai Xue Rong died.",
  },
  s0442: {
    literal: "On wuzi, Weibo's Tian Bu memorialized that he personally led the full army to advance the attack.",
    idiomatic: "On wuzi Tian Bu led Weibo's full force forward.",
  },
  s0443: {
    literal: "Junior Tutor of the Crown Prince Li Yun died.",
    idiomatic: "Li Yun died.",
  },
  s0444: {
    literal: "On jichou, Vice Minister of Revenue and revenue judge Cui Cong was made Works Minister and revenue judge.",
    idiomatic: "On jichou Cui Cong took Works while keeping revenue.",
  },
  s0445: {
    literal: "Shannan West military commissioner Cui Cong was made Left Vice Director of the Secretariat;",
    idiomatic: "Cui Cong became left vice director;",
  },
  s0446: {
    literal: "Secretariat Supervisor Xu Jitong was made Hua prefect and Tong Pass defense and Zhenguo army commissioner.",
    idiomatic: "Xu Jitong went to Hua and Tong Pass.",
  },
  s0447: {
    literal: "On xinmao, Zhaoyi Liu Wu memorialized that he personally led troops encamped at Lincheng.",
    idiomatic: "On xinmao Liu Wu camped at Lincheng with his army.",
  },
  s0448: {
    literal: "Eleventh month, jiawu new moon — Pei Du memorialized breaking rebels at Huixing post.",
    idiomatic: "The eleventh month opened with Pei Du's victory at Huixing.",
  },
  s0449: {
    literal: "Zhu Kerong's troops greatly raided Dingzhou; military commissioner Chen Chu went out to resist and broke twenty thousand rebels.",
    idiomatic: "Chen Chu repelled a twenty-thousand-man raid on Dingzhou.",
  },
  s0450: {
    literal: "On yisi, Xuzhou's Cui Qun memorialized dispatching deputy commissioner Wang Zhixing with troops to the field camp.",
    idiomatic: "On yisi Cui Qun sent Wang Zhixing to the front.",
  },
  s0451: {
    literal: "On wushen, Minister of Agriculture Pei Wu was made Zhenzhou field army supply commissioner.",
    idiomatic: "On wushen Pei Wu was named supply commissioner.",
  },
  s0452: {
    literal: "On wuwu, the Emperor attended Xuanzheng Hall and tested decree-examination candidates.",
    idiomatic: "On wuwu the emperor held the decree examination.",
  },
  s0453: {
    literal: "On xinyou, Ziqing guard officer Ma Yanling plotted rebellion; military commissioner Xue Ping detected the plot and executed him.",
    idiomatic: "On xinyou Xue Ping executed a mutinous Ziqing officer.",
  },
  s0454: {
    literal: "An edict named Secretariat Drafter Bai Juyi, Protocol Bureau Director Chen Hu, and Merit Bureau Outer Director Jia Su to grade the decree examination.",
    idiomatic: "Bai Juyi, Chen Hu, and Jia Su were named examiners.",
  },
  s0455: {
    literal: "Twelfth month, jiazi new moon.",
    idiomatic: "The twelfth month opened on jiazi.",
  },
  s0456: {
    literal: "On bingyin, former Rongguan pacification acting commissioner Yan Gongsu was made Rongzhou prefect and Rongguan pacification commissioner.",
    idiomatic: "On bingyin Yan Gongsu took Rongguan.",
  },
  s0457: {
    literal: "On dingmao, Remonstrating Doctor Li Jingjian was demoted to Chuzhou prefect.",
    idiomatic: "On dingmao Li Jingjian was exiled to Chuzhou.",
  },
  s0458: {
    literal: "On gengwu, Du Shuliang's army fought rebels at Boye, was defeated by rebels, seven thousand men fell to the rebels, and Shuliang barely escaped.",
    idiomatic: "On gengwu Du Shuliang lost seven thousand men at Boye and barely escaped.",
  },
  s0459: {
    literal: "On yihai, an edict: aside from tribute to the throne, within each circuit's retained funds two hundred cash per string were to be cut to aid military use; after rebels were pacified the old rule would resume.",
    idiomatic: "On yihai circuits were ordered to divert two hundred cash per string to the war effort.",
  },
  s0460: {
    literal: "Dingzhou Chen Chu broke twenty thousand Zhu Kerong rebels at Wangdu.",
    idiomatic: "Chen Chu routed twenty thousand rebels at Wangdu.",
  },
  s0461: {
    literal: "On wuyin, Fengxiang military commissioner Li Guangyan was made Zhongwu military commissioner, replacing Li Xun, and still concurrently Shen-Ji field commissioner.",
    idiomatic: "On wuyin Li Guangyan replaced Li Xun and kept the Shen-Ji command.",
  },
  s0462: {
    literal: "Li Xun was made Fengxiang military commissioner.",
    idiomatic: "Li Xun went to Fengxiang.",
  },
  s0463: {
    literal: "Outer Director Dugu Lang was demoted to Shaozhou prefect, Attendant on the Emperor Wen Zao to Langzhou prefect, Merit Bureau Outer Director Li Zhao to Lizhou prefect, and Punishments Bureau Outer Director Wang Yi to Yingzhou prefect — all for drinking with Li Jingjian in the History Office; Jingjian when drunk had seen the chief ministers and reviled them.",
    idiomatic: "Four officials were demoted for drinking with Li Jingjian when he insulted the chief ministers.",
  },
  s0464: {
    literal: "War Bureau Director and edict drafter Feng Su and Treasury Bureau Director and edict drafter Yang Sifu were each fined one season's salary — also for drinking with Jingjian, but they had left first and were not demoted.",
    idiomatic: "Feng Su and Yang Sifu were fined but not demoted for the same banquet.",
  },
  s0465: {
    literal: "On xinsi, Li Guangyan departed to his post; the hundred officials saw him off at Zhangjing Temple.",
    idiomatic: "On xinsi the court farewelled Li Guangyan at Zhangjing Temple.",
  },
  s0466: {
    literal: "The Emperor went to Tonghua Gate to see him off and bestowed jade belt and famous horses.",
    idiomatic: "The emperor saw him off at Tonghua Gate with belt and horses.",
  },
  s0467: {
    literal: "He also ordered Divine Strategy deputy commissioner Yang Chenghe to serve as overall supervisor of the Shen-Ji field command.",
    idiomatic: "Yang Chenghe was named field supervisor.",
  },
  s0468: {
    literal: "On renwu, fifty thousand strings from the inner treasury were issued to aid the army.",
    idiomatic: "On renwu fifty thousand strings were released for the war.",
  },
  s0469: {
    literal: "On yiyou, Youzhou director of military affairs Zhu Kerong was made acting Left Regular Cavalry Attendant and Youzhou Lulong military commissioner; his crimes of detaining Zhang Hongjing and killing prefectural staff were entirely released.",
    idiomatic: "On yiyou Zhu Kerong was pardoned and confirmed as Lulong commissioner.",
  },
  s0470: {
    literal: "At the time court opinion held that because Kerong had preserved Hongjing while Wang Tingcou had killed Hongzheng, Yan could be pardoned and Zhao punished — hence this edict.",
    idiomatic: "Court opinion favored pardoning Zhu Kerong while punishing Wang Tingcou.",
  },
  s0471: {
    literal: "That year, empire-wide households totaled 2,375,805; persons 15,762,432; non-tributary military prefectures were not included.",
    idiomatic: "The census counted 2.38 million households and 15.76 million persons.",
  },
  s0472: {
    literal: "Changqing 2 — In spring of Changqing 2, first month, guisi new moon; because of military use the New Year audience was cancelled.",
    idiomatic: "Changqing 2 opened with war canceling the New Year audience.",
  },
  s0473: {
    literal: "On yiwei, Kuizhou prefect Wang Chengbian was made Protector General of Annan and pacification and suppression commissioner of his circuit.",
    idiomatic: "On yiwei Wang Chengbian took Annan.",
  },
  s0474: {
    literal: "On dingyou, Zhu Kerong took Gonggao county of Cangzhou; rebels attacked Xiabo and also intercepted six hundred supply carts and departed.",
    idiomatic: "On dingyou Zhu Kerong seized Gonggao and ambushed supply trains.",
  },
  s0475: {
    literal: "On gengzi, Weibo troops mutinied and dispersed at Nangong county.",
    idiomatic: "On gengzi Weibo's army collapsed at Nangong.",
  },
  s0476: {
    literal: "On wushen, Weibo guard officer Shi Xiancheng seized the army; Tian Bu fell on his sword and died.",
    idiomatic: "On wushen Shi Xiancheng mutinied and Tian Bu killed himself.",
  },
  s0477: {
    literal: "On jiyou, Weibo vanguard commander Shi Xiancheng was made acting Works Minister, concurrent Administrator of We prefecture metropolitan government, and Weibo military commissioner.",
    idiomatic: "On jiyou Shi Xiancheng was installed at Weibo.",
  },
  s0478: {
    literal: "That day, great wind and dust haze.",
    idiomatic: "That day a dust storm rose.",
  },
  s0479: {
    literal: "On gengxu, Dezhou prefect Wang Rijian was made Cangzhou prefect, Henghai military commissioner, and Cang-De-Di observation commissioner, replacing Shuliang.",
    idiomatic: "On gengxu Wang Rijian replaced Du Shuliang at Cangzhou.",
  },
  s0480: {
    literal: "On renzi, Shuliang was demoted to Guizhou prefect for offering plans to destroy You-Zhen without success and for defeat and loss of his command banners.",
    idiomatic: "On renzi Du Shuliang was exiled for failure and losing his banners.",
  },
  s0481: {
    literal: "On jiayin, Works Minister and revenue judge Cui Cong was made acting Minister of Rites, concurrent Fengxiang intendant, and Fengxiang-Long military commissioner.",
    idiomatic: "On jiayin Cui Cong went to Fengxiang.",
  },
  s0482: {
    literal: "Grand Herald and concurrent Censor-in-Chief Zhang Pingshu judged revenue.",
    idiomatic: "Zhang Pingshu took charge of revenue.",
  },
  s0483: {
    literal: "Gonggao county was restored as Jingzhou.",
    idiomatic: "Gonggao was re-established as Jingzhou.",
  },
  s0484: {
    literal: "Qingzhou memorialized the sea frozen two hundred li.",
    idiomatic: "Qingzhou reported two hundred li of frozen sea.",
  },
  s0485: {
    literal: "On yimao, former Fengxiang military commissioner Li Xun was made Minister of Punishments.",
    idiomatic: "On yimao Li Xun became punishment minister.",
  },
  s0486: {
    literal: "On jiwei, Minister of Punishments Li Xun died.",
    idiomatic: "On jiwei Li Xun died.",
  },
  s0487: {
    literal: "On gengzi, Yan-Qi-Mi observation commissioner Cao Hua was made military commissioner;",
    idiomatic: "On gengzi Cao Hua received a military commission;",
  },
  s0488: {
    literal: "Tiande defense commissioner Li Jincheng was made concurrent Lingzhou prefect and Shuofang-Ling-Salt-Ding-Yuan city military commissioner;",
    idiomatic: "Li Jincheng took Shuofang;",
  },
  s0489: {
    literal: "Jinzhou prefect Li Gu was made Fengzhou prefect and Tiande-Feng-East-West Surrender City defense commissioner.",
    idiomatic: "Li Gu was posted to Tiande.",
  },
  s0490: {
    literal: "Eighty thousand bolts of silk were issued from the inner palace to aid the army.",
    idiomatic: "The court released eighty thousand bolts of silk for the war.",
  },
  s0491: {
    literal: "Lingnan and Qianzhong selections for this year were suspended.",
    idiomatic: "Civil appointments in Lingnan and Qianzhong were halted.",
  },
  s0492: {
    literal: "Second month, guihai new moon.",
    idiomatic: "The second month opened on guihai.",
  },
  s0493: {
    literal: "On jiazi, an edict absolved Wang Tingcou and still appointed him Administrator of Zhenzhou metropolitan prefecture, Censor-in-Chief, Chengde military commissioner, and military commissioner of Zhen, Ji, Shen, and Zhao.",
    idiomatic: "On jiazi Wang Tingcou was pardoned and confirmed at Chengde.",
  },
  s0494: {
    literal: "The three armies' officers and soldiers were to be treated as before.",
    idiomatic: "His troops were to be treated as before.",
  },
  s0495: {
    literal: "He was still to send Vice Minister of War Han Yu to proclaim comfort there.",
    idiomatic: "Han Yu was sent to announce the amnesty.",
  },
  s0496: {
    literal: "Former Jizhou prefect Zhang Hongjing was made Fuzhou prefect.",
    idiomatic: "Zhang Hongjing was named Fuzhou prefect.",
  },
  s0497: {
    literal: "When Hongjing was first demoted he was still in Youzhou, detained half a year; when Kerong received his commission he was able to return — hence this order.",
    idiomatic: "Hongjing had been held in Youzhou until Zhu Kerong released him.",
  },
  s0498: {
    literal: "On bingyin, former Chengde military commissioner Niu Yuanyi was made acting Works Minister, Xiangzhou prefect, Shannan East observation, Linhan pasture, and other commissioner.",
    idiomatic: "On bingyin Niu Yuanyi left the north for Shannan East.",
  },
  s0499: {
    literal: "On dingmao, Merit Bureau Director and edict drafter Li Deyu was made Secretariat Drafter, continuing as Hanlin academician.",
    idiomatic: "On dingmao Li Deyu was promoted while keeping the Hanlin post.",
  },
  s0500: {
    literal: "On guiyou, Yan-Fang military commissioner Han Chong was made Yicheng military commissioner, replacing Wang Chengyuan.",
    idiomatic: "On guiyou Han Chong replaced Wang Chengyuan at Yicheng.",
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
