#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.015, Xianzong 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/015.json';
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
    literal: "Yuanhe 7 — In spring of Yuanhe 7, first month, xinyou new moon; on jisi Zhao Zongru, Minister of Justice, was made acting Minister of Personnel, Xingyuan intendant, and Shannan West circuit military commissioner.",
    idiomatic: "In Yuanhe 7's first month, on jisi the court made Zhao Zongru acting personnel minister and Shannan West military commissioner.",
  },
  s0002: {
    literal: "On gengwu Wang Shao, Minister of War, was assigned to oversee Ministry of Revenue affairs.",
    idiomatic: "On gengwu Wang Shao took charge of revenue.",
  },
  s0003: {
    literal: "On xinwei Yuan Yifang, Jingzhao intendant, was made Yan prefect and Yan-Fang-Dan-Yan observation commissioner; Li Qian, Minister of Agriculture, was made Jingzhao intendant.",
    idiomatic: "On xinwei Yuan Yifang went to Yan-Fang-Dan-Yan and Li Qian became Jingzhao intendant.",
  },
  s0004: {
    literal: "That night the moon occulted Mars.",
    idiomatic: "That night Mars was eclipsed by the moon.",
  },
  s0005: {
    literal: "On renshen Yongfeng county of Xinzhou, Shanyin county of Yuezhou, and Yingchuan county of Quzhou were abolished.",
    idiomatic: "On renshen three counties were abolished.",
  },
  s0006: {
    literal: "On guiyou the Zhenwu River overflowed and destroyed the Eastern Surrender Fort.",
    idiomatic: "On guiyou a flood wrecked the Eastern Surrender Fort.",
  },
  s0007: {
    literal: "Second month, gengyin new moon.",
    idiomatic: "The second month opened on gengyin.",
  },
  s0008: {
    literal: "On renchen an edict: because of last autumn's drought and poor harvest, 300,000 shi of grain were to relieve the capital region;",
    idiomatic: "On renchen an edict ordered 300,000 shi of relief grain for the drought-stricken capital.",
  },
  s0009: {
    literal: "the 240,000 shi lent to commoners in spring of Yuanhe 6 were also to be remitted.",
    idiomatic: "Spring loans from Yuanhe 6 were forgiven as well.",
  },
  s0010: {
    literal: "On xinchou the Ministry of State Affairs redetermined the ceremony for vice premiers receiving business.",
    idiomatic: "On xinchou rites for vice premiers entering office were revised.",
  },
  s0011: {
    literal: "On renyin Xu Mengrong, Vice Minister of War, was made Henan intendant.",
    idiomatic: "On renyin Xu Mengrong became Henan intendant.",
  },
  s0012: {
    literal: "On xinhai Pei Bing, military commissioner of Shannan West, died.",
    idiomatic: "On xinhai Pei Bing died in Shannan West.",
  },
  s0013: {
    literal: "On guichou envoys entering Tibet were forbidden to exchange private gifts with regular officials; separate allotments were to supply private gifts.",
    idiomatic: "On guichou Tibet envoys could no longer buy favors from regular officials.",
  },
  s0014: {
    literal: "Formerly envoys to distant regions were allowed to sell more than ten regular official posts to fund private gifts — though it favored distant envoys, it was quite contrary to statute, so it was reformed.",
    idiomatic: "The old practice of selling posts to fund envoys' gifts was abolished as improper.",
  },
  s0015: {
    literal: "An edict: \"Money is heavy and goods light — the harm is considerable; seek suitable changes to convenience the people.",
    idiomatic: "An edict on currency reform began:",
  },
  s0016: {
    literal: "What is prized is that currency circulate and villages be eased.\"",
    idiomatic: "\"Let cash circulate and ease the countryside.\"",
  },
  s0017: {
    literal: "Let all officials submit memorials on benefits and harms as each sees them.",
    idiomatic: "Officials were to report remedies.",
  },
  s0018: {
    literal: "\"",
    idiomatic: "Thus ended the edict.",
  },
  s0019: {
    literal: "Third month, jiwei.",
    idiomatic: "The third month reached jiwei.",
  },
  s0020: {
    literal: "On xinyou, because of Crown Prince Huizhao's funeral, the Qujiang shangsi banquet was cancelled.",
    idiomatic: "On xinyou the Qujiang spring banquet was cancelled for the crown prince's funeral.",
  },
  s0021: {
    literal: "On gengwu, because of drought, an edict ordered all offices to review and release prisoners.",
    idiomatic: "On gengwu drought amnesty reviews were ordered.",
  },
  s0022: {
    literal: "Summer, fourth month, wuzi new moon.",
    idiomatic: "The fourth month opened on wuzi.",
  },
  s0023: {
    literal: "On guisi an edict ordered every prefecture household to plant two mulberry trees per mu of field; chief officials were to inspect yearly and report.",
    idiomatic: "On guisi the court mandated mulberry planting and annual inspection.",
  },
  s0024: {
    literal: "On xinhai Salt and Iron Commissioner Wang Bo reported Yuanhe 6 salt and iron sales, except gorge well salt, totaled 6,859,200 strings.",
    idiomatic: "On xinhai Wang Bo reported 6.86 million strings in salt and iron revenue.",
  },
  s0025: {
    literal: "Fifth month, wuwu new moon.",
    idiomatic: "The fifth month opened on wuwu.",
  },
  s0026: {
    literal: "On gengshen the Emperor said to the chief ministers: \"You have repeatedly said Wu-Yue suffered flood and drought last year; yesterday a censor returned from Jiang-Huai and said the disaster was not so severe and the people were not very distressed.\"",
    idiomatic: "On gengshen the emperor challenged reports that Wu-Yue had suffered severe flood and drought.",
  },
  s0027: {
    literal: "Li Jiang replied: \"I have received reports from the two Zhe and Huainan circuits stating successive drought and poor harvest.\"",
    idiomatic: "Li Jiang countered that Zhe and Huainan reports still showed drought.",
  },
  s0028: {
    literal: "Regional appointees are all ministers the court trusts heavily.",
    idiomatic: "Those regional commanders are men the throne trusts.",
  },
  s0029: {
    literal: "If the censor is not good, he may flatter — this is precisely the treacherous sort of minister.",
    idiomatic: "A bad censor flatters; that is the face of treachery.",
  },
  s0030: {
    literal: "Moreover, sincerity in delegating authority is the ruler's foundation; entrust great ministers with affairs — small men's words must not come between.",
    idiomatic: "Delegation to great ministers must not be undermined by petty informers.",
  },
  s0031: {
    literal: "I beg you clearly name the censor and punish him by statute.",
    idiomatic: "Name the censor and punish him under law.",
  },
  s0032: {
    literal: "The Emperor said: \"Your words are correct.\"",
    idiomatic: "The emperor agreed.",
  },
  s0033: {
    literal: "\"The court's great principle is caring for the people; if one region fails to harvest, relief must be given for hunger and cold — how could it be doubted!",
    idiomatic: "\"The throne exists to succor the people; one failed harvest demands relief — never doubt it!",
  },
  s0034: {
    literal: "Formerly I did not think and made this inquiry — my words went too far.\"",
    idiomatic: "I spoke rashly in questioning it.\"",
  },
  s0035: {
    literal: "Jiang and the others bowed in congratulation.",
    idiomatic: "Li Jiang and the others bowed in thanks.",
  },
  s0036: {
    literal: "On guihai Mars drew near the Right Enforcement star of the Supreme Palace.",
    idiomatic: "On guihai Mars neared the Supreme Palace's Right Enforcement star.",
  },
  s0037: {
    literal: "Sixth month, dinghai new moon — within Meitian Pool at Tongcheng, Shuzhou, yellow and white dragons rose from the pool on wind and thunder, two hundred chi high, traveled six li, and entered Futang Pool.",
    idiomatic: "In the sixth month dragons were reported rising from a Shuzhou pool and crossing six li.",
  },
  s0038: {
    literal: "On guisi Du You, Grand Master of Splendid Happiness, acting Grand Tutor, concurrent Grand Councillor, Chongwen Hall academician, Taqing Palace commissioner, Pillar of State, Duke of Qi, was made Grand Master of Glory and acting Senior Tutor with retirement, to attend court on the first and fifteenth — because You had repeatedly petitioned earnestly.",
    idiomatic: "On guisi Du You was finally allowed to retire as Senior Tutor with twice-monthly audience.",
  },
  s0039: {
    literal: "On jihai the moon drew near the fourth star of the Southern Dipper handle.",
    idiomatic: "On jihai the moon neared the Southern Dipper.",
  },
  s0040: {
    literal: "Thirteen rooms of the Zhenzhou armory burned; all weapons were lost.",
    idiomatic: "Zhenzhou's armory burned and its stores were destroyed.",
  },
  s0041: {
    literal: "Wang Chengzong often harbored rebellion; now he began to fear heaven's punishment, his fierce spirit was somewhat subdued, yet he still killed more than a hundred chief storehouse clerks.",
    idiomatic: "Wang Chengzong, long rebellious, feared divine punishment and massacred his armory clerks.",
  },
  s0042: {
    literal: "On yichou Wang Ya, Vice Minister of War, was made edict drafter.",
    idiomatic: "On yichou Wang Ya joined the drafting office.",
  },
  s0043: {
    literal: "On yihai a decree installed Prince Sui You as crown prince and renamed him Heng.",
    idiomatic: "On yihai Prince You became crown prince Heng.",
  },
  s0044: {
    literal: "On jimao Silla's grand chancellor Kim Eom-seung was made Acting Grand Master of the Palace, acting Grand Preceptor, commissioner with credentials, Grand Protector General of Gyerim prefecture and its armies, Gyerim prefect, concurrent Ninghai army commissioner, Pillar of State, and enfeoffed King of Silla;",
    idiomatic: "On jimao Kim Eom-seung was enfeoffed King of Silla with full ceremonial rank.",
  },
  s0045: {
    literal: "his wife Lady Jeong was also enfeoffed as royal consort.",
    idiomatic: "Lady Jeong was named his royal consort.",
  },
  s0046: {
    literal: "Eighth month, dinghai new moon — the three newly appointed Silla grand chancellors including Jin Chong-bin were to be granted halberds per their state's precedent.",
    idiomatic: "In the eighth month three new Silla envoys received halberds by precedent.",
  },
  s0047: {
    literal: "On wuxu Tian Ji'an, military commissioner of Weibo, died.",
    idiomatic: "On wuxu Tian Ji'an of Weibo died.",
  },
  s0048: {
    literal: "On xinchou Dangqu county of Pengzhou was abolished.",
    idiomatic: "On xinchou Dangqu county was abolished.",
  },
  s0049: {
    literal: "On jiachen Fang Shi, Xuanshe observation commissioner, died.",
    idiomatic: "On jiachen Fang Shi died.",
  },
  s0050: {
    literal: "On bingwu Fan Chuanzheng, Suzhou prefect, was made Xuanshe observation commissioner.",
    idiomatic: "On bingwu Fan Chuanzheng took Xuanshe.",
  },
  s0051: {
    literal: "On wushen a decree: \"After officials of fifth rank and above leave office in prefectures, the circuit chief shall weigh talent, service record, and seniority and once each winter submit recommendations.",
    idiomatic: "A decree required annual winter recommendations for outgoing prefectural officials of fifth rank and above.",
  },
  s0052: {
    literal: "Dismissed capital commissioners and censors — court officials may each winter recommend under this rule; staff of commissioner offices and acting officials count from the original appointment month; if fifth rank and above or capital office, after thirty months they may be transferred;",
    idiomatic: "Capital commissioners and censorial staff were included; fifth-rank and capital posts could transfer after thirty months;",
  },
  s0053: {
    literal: "other offices memorialize for transfer after thirty-six months.",
    idiomatic: "other offices after thirty-six.",
  },
  s0054: {
    literal: "If before examination there is an incident or removal, ten months beyond the base limit are added, then memorialization is permitted.\"",
    idiomatic: "Incidents before review added ten months to the term. Thus ended the edict.",
  },
  s0055: {
    literal: "On xinhai Xue Ping, Left Dragon Martial Grand General, was made Hua prefect and Yicheng army military commissioner.",
    idiomatic: "On xinhai Xue Ping became Yicheng military commissioner.",
  },
  s0056: {
    literal: "Winter, tenth month, yimou — the three armies of Weibo elevated their guard officer Tian Xing to manage the circuit.",
    idiomatic: "In the tenth month Weibo's troops installed Tian Xing.",
  },
  s0057: {
    literal: "When Tian Ji'an died, his son Huaijian was eleven, serving as vice ambassador managing the military government; all policy rested with the household steward Jiang Shize, who repeatedly replaced major generals, and army morale was unsettled.",
    idiomatic: "After Tian Ji'an's death his eleven-year-old son ruled in name while Jiang Shize manipulated the army.",
  },
  s0058: {
    literal: "When Tian Xing entered the yamen, soldiers surrounded him and compelled him; Xing fell prostrate to the ground, yet the crowd would not disperse.",
    idiomatic: "Troops surrounded Tian Xing and forced him prostrate before they would listen.",
  },
  s0059: {
    literal: "Xing said: \"If you wish to heed my command, do not harm the vice ambassador.\"",
    idiomatic: "Tian Xing said they must spare the boy vice ambassador.",
  },
  s0060: {
    literal: "The crowd said: \"Agreed.\"",
    idiomatic: "The soldiers assented.",
  },
  s0061: {
    literal: "They only killed Jiang Shize and about ten others, then stopped.",
    idiomatic: "They killed Jiang Shize and a dozen confederates.",
  },
  s0062: {
    literal: "That day Huaijian was moved outside and ordered to proceed to the capital.",
    idiomatic: "Huaijian was sent to Chang'an the same day.",
  },
  s0063: {
    literal: "On jiachen Tian Xing, Weibo director of military affairs, concurrent Vice Censor-in-Chief, Duke of Yi, was made Grand Master of Splendid Happiness, acting Minister of Works, concurrent Administrator of Wei prefecture, and Weibo military commissioner.",
    idiomatic: "On jiachen Tian Xing was formally made Weibo military commissioner.",
  },
  s0064: {
    literal: "On gengxu Prince Li of Li was renamed Yun; Prince Shen of Shen was renamed Bian; Prince Yang of Yang was renamed Xin; Prince Jiang of Jiang was renamed Wu; Prince Jian of Jian was renamed Ke.",
    idiomatic: "On gengxu five princes received new taboo names.",
  },
  s0065: {
    literal: "Yuan Zi, Zheng-Hua military commissioner, was made Minister of Revenue.",
    idiomatic: "Yuan Zi became Minister of Revenue.",
  },
  s0066: {
    literal: "Eleventh month, bingchen new moon.",
    idiomatic: "The eleventh month opened on bingchen.",
  },
  s0067: {
    literal: "On yichou an edict: \"Tian Xing has requested imperial command for Weibo — Fengfenglang drafting commissioner Pei Du shall go there to proclaim comfort and grant the three armies a reward of 1,500,000 strings, supplied from He-yin compound tributes of all circuits to the inner treasury.\"",
    idiomatic: "On yichou Pei Du was sent to Weibo with 1.5 million strings to reward the armies.",
  },
  s0068: {
    literal: "The six prefectures and counties were to proclaim the court's decree.",
    idiomatic: "Six prefectures were to broadcast the decree.",
  },
  s0069: {
    literal: "On xinwei retired Senior Tutor Du You died.",
    idiomatic: "On xinwei Du You died in retirement.",
  },
  s0070: {
    literal: "Dongchuan observation commissioner Pan Mengyang memorialized that at Wuan, Longzhou, auspicious grain grew and a qilin ate it.",
    idiomatic: "Pan Mengyang reported a qilin eating auspicious grain in Longzhou.",
  },
  s0071: {
    literal: "When the qilin came, deer surrounded it; its radiance could not be looked at directly.",
    idiomatic: "Deer ringed the beast in blinding light.",
  },
  s0072: {
    literal: "He sent a painter to depict it and present the picture.",
    idiomatic: "A painting was sent to court.",
  },
  s0073: {
    literal: "On yihai Li Fengji, supervising secretary, and Li Ju, Bureau of Merit vice director, were both made readers for the crown prince and princes.",
    idiomatic: "On yihai Li Fengji and Li Ju became tutors to the heir and princes.",
  },
  s0074: {
    literal: "On wuyin Minister of Personnel Zheng Yuqing requested restoration of three Ministry examiners; Bureau of Personnel director Yang Yuling memorialized that it was inconvenient.",
    idiomatic: "On wuyin Zheng Yuqing sought three examiners; Yang Yuling objected.",
  },
  s0075: {
    literal: "Then an edict: examiners Wei Yi and two others were only to examine passed candidates; the rest the Vice Minister of Personnel would decide. On jimao Jiangxi observation commissioner Cui Pang died.",
    idiomatic: "Examiners were limited to passers; on jimao Cui Pang died.",
  },
  s0076: {
    literal: "On xinsi former Weibo vice commissioner Tian Huaijian was made Right Supervisor of the Gate Guard, granted one residence and fodder.",
    idiomatic: "On xinsi Tian Huaijian was honored at court with a house and grain.",
  },
  s0077: {
    literal: "On jiashen Pei Kan, Tong prefect, was made Jiangxi observation commissioner.",
    idiomatic: "On jiashen Pei Kan took Jiangxi.",
  },
  s0078: {
    literal: "Twelfth month, bingxu new moon — Zheng Yuqing, Minister of Personnel, was made Crown Prince Junior Tutor.",
    idiomatic: "The twelfth month opened with Zheng Yuqing made crown prince tutor.",
  },
  s0079: {
    literal: "On bingchen Left Reminder Yang Guihou, for borrowing the ceremonial compound for his own wedding, submitted a request and was demoted to National University registrar in residence.",
    idiomatic: "On bingchen Yang Guihou was demoted for hijacking the ritual hall for his wedding.",
  },
  s0080: {
    literal: "On wuxu Pei Xiang, Jingzhao intendant, was made Tongzhou defense commissioner.",
    idiomatic: "On wuxu Pei Xiang went to Tongzhou.",
  },
  s0081: {
    literal: "On jihai Weibo memorialized 253 officials in the circuit and requested Ministry assignment.",
    idiomatic: "On jihai Weibo asked the Ministry to fill 253 posts.",
  },
  s0082: {
    literal: "Yuanhe 8 — In spring of Yuanhe 8, first month, yimao new moon.",
    idiomatic: "Yuanhe 8 opened on yimao.",
  },
  s0083: {
    literal: "On gengwu Dayan Yi was enfeoffed King of Bo Hai and appointed Secretariat supervisor and Hehanzhou governor.",
    idiomatic: "On gengwu Dayan Yi became King of Bo Hai.",
  },
  s0084: {
    literal: "On xinwei a decree made Quan Deyu, Proper Counsel Grand Master, acting Minister of Rites, concurrent Grand Councillor, Pillar of State, Duke of Fufeng, continue as Minister of Rites and cease concurrent governance.",
    idiomatic: "On xinwei Quan Deyu left the Secretariat but kept Rites.",
  },
  s0085: {
    literal: "On guiwei Li Yijian, Shannan East military commissioner, was made acting Minister of Revenue, Chengdu intendant, and Xichuan military commissioner.",
    idiomatic: "On guiwei Li Yijian went to Xichuan.",
  },
  s0086: {
    literal: "Yuan Zi, Minister of Revenue, was made acting Minister of War, Xiang prefect, and Shannan East military commissioner.",
    idiomatic: "Yuan Zi took Shannan East.",
  },
  s0087: {
    literal: "Second month, yiyou new moon.",
    idiomatic: "The second month opened on yiyou.",
  },
  s0088: {
    literal: "On xinmao Tian Xing was renamed Hongzheng.",
    idiomatic: "On xinmao Tian Xing received the name Hongzheng.",
  },
  s0089: {
    literal: "Chief minister Li Jifu presented his compiled Yuanhe Commanderies Atlas in thirty scrolls, also presented Six Dynasties Summary in thirty scrolls, and also made Ten Circuits Prefecture Atlas in fifty-four scrolls.",
    idiomatic: "Li Jifu presented three geographical works to the throne.",
  },
  s0090: {
    literal: "Chief minister Yu Di's son Sensitive, Grand Director of the Imperial Clan, killed Liang Zhengyan's slave and threw the body in the privy.",
    idiomatic: "Yu Di's son Yu Min murdered a slave and hid the corpse.",
  },
  s0091: {
    literal: "When the affair broke out, Yu Di and his son Jiyou wore plain clothes and awaited punishment.",
    idiomatic: "Yu Di and Jiyou waited in mourning dress for judgment.",
  },
  s0092: {
    literal: "Yu Di was demoted to tutor of the Prince of En.",
    idiomatic: "Yu Di was demoted to Prince En's tutor.",
  },
  s0093: {
    literal: "Yu Min was exiled far to Leizhou, body in fetters, and dispatched.",
    idiomatic: "Yu Min was exiled to Leizhou in chains.",
  },
  s0094: {
    literal: "Palace Vice Director and Commandant of Escorts Yu Jiyou deceived the princess, concealed palace women, transferred them to a violent elder brother, and stored them in an outer lodge — no greater breach of ritual; all his offices were to be stripped and he was to remain home in reflection.",
    idiomatic: "Yu Jiyou was stripped of office for hiding palace women and abetting his brother.",
  },
  s0095: {
    literal: "Companions Yu Zheng and Secretariat Director Yu Fang were both suspended from current posts — all were Yu Di's sons on stipend.",
    idiomatic: "Two more sons on Yu Di's stipend were suspended.",
  },
  s0096: {
    literal: "Liang Zhengyan, who had taken Yu Di's bribes to secure a posting out, and the monk Jianxu, who colluded with powerholders, were both handed to the Jingzhao office and beaten to death.",
    idiomatic: "Briber Liang Zhengyan and monk Jianxu were beaten to death.",
  },
  s0097: {
    literal: "On jiazi Wu Yuanheng, Xichuan military commissioner, Grand Master of Splendid Happiness, acting Minister of Personnel, concurrent Vice Director of the Secretariat, Grand Councillor, Pillar of State, Duke of Huaihai with a fief of two thousand households, re-entered the Secretariat to manage governance, and was also Chongxuan Hall academician and Taqing Palace commissioner.",
    idiomatic: "On jiazi Wu Yuanheng returned to the Grand Council.",
  },
  s0098: {
    literal: "On xinwei, because of long drought, the Emperor personally sought rain within the forbidden quarters; that night timely rain soaked enough.",
    idiomatic: "On xinwei the emperor prayed in the palace and rain followed.",
  },
  s0099: {
    literal: "On bingzi a great wind broke the owl-tail of Chongling's mausoleum hall and broke six gate halberds.",
    idiomatic: "On bingzi a storm damaged Chongling and broke six gate halberds.",
  },
  s0100: {
    literal: "Summer, fourth month, guiwei new moon.",
    idiomatic: "The fourth month opened on guiwei.",
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
