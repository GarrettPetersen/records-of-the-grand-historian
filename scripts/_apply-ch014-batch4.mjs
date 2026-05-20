#!/usr/bin/env node
/** Batch 4: s0301–s0400 (Jiutangshu ch.014, Shunzong, Xianzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/014.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 301;
const END = 400;

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
  s0301: {
    literal: "On dingyou Gao Chongwen broke ten thousand bandits at Lutou Pass.",
    idiomatic: "Gao Chongwen routed Liu Pi's army at Lutou Pass on dingyou.",
  },
  s0302: {
    literal: "Liu Ji of Youzhou was made Palace Attendant; Li Shigu of Ziqing was made acting Minister of Education.",
    idiomatic: "Liu Ji and Li Shigu received honorary titles.",
  },
  s0303: {
    literal: "On guimao Gao Chongwen recovered Hanzhou.",
    idiomatic: "Hanzhou fell to Gao Chongwen on guimao.",
  },
  s0304: {
    literal: "Intercalary sixth month, renzi new moon — Li Shigu of Ziqing died.",
    idiomatic: "Li Shigu of Shandong died in the intercalary sixth month.",
  },
  s0305: {
    literal: "On wuchen Director of the Palace Library Dong Shujing was made Metropolitan Governor.",
    idiomatic: "Dong Shujing became capital intendant on wuchen.",
  },
  s0306: {
    literal: "On renwu the Remonstrators lost the Left and Right designations; only four posts were kept.",
    idiomatic: "The remonstrance was reduced to four posts on renwu.",
  },
  s0307: {
    literal: "Former outer bureau director in the Ministry of Personnel Wei Kuang was made Remonstrator.",
    idiomatic: "Wei Kuang became remonstrator.",
  },
  s0308: {
    literal: "On jiashen the Tibetan Lun Bozang came to court with tribute.",
    idiomatic: "A Tibetan envoy presented tribute on jiashen.",
  },
  s0309: {
    literal: "Autumn, seventh month, renchen new moon.",
    idiomatic: "The seventh month opened on renchen.",
  },
  s0310: {
    literal: "On renyin Shunzong was buried at Feng Mausoleum.",
    idiomatic: "Shunzong was buried at Fengling on renyin.",
  },
  s0311: {
    literal: "On jiyou retired Junior Tutor Han Quanyi died.",
    idiomatic: "Han Quanyi died in retirement on jiyou.",
  },
  s0312: {
    literal: "Eighth month, xinyou new moon.",
    idiomatic: "The eighth month opened on xinyou.",
  },
  s0313: {
    literal: "On guihai Left Guard General Li Yuan was made acting Minister of Rites and prefect of Xia, commissioner of Xia, Sui, and Yin.",
    idiomatic: "Li Yuan took the Xia-Sui command on guihai.",
  },
  s0314: {
    literal: "On jiazi the mothers of Princes of Xun, Song, Tan, and Heng — Ladies Wang Zhaoyi, Zhao Zhaoyi, Zhang Zhaoxun, and Yan Zhaoxun — were each made Grand Consort because of their princes.",
    idiomatic: "Four princes' mothers were ennobled as grand consorts on jiazi.",
  },
  s0315: {
    literal: "Lady Xu was made Beauty; Ladies Yin and Duan were made Talents.",
    idiomatic: "Xu, Yin, and Duan received inner-palace ranks.",
  },
  s0316: {
    literal: "Lady Cui Zhaoxun, mother of Princess Xunyang, was made Grand Consort.",
    idiomatic: "Princess Xunyang's mother became grand consort.",
  },
  s0317: {
    literal: "Han Quanyi's son presented eight female musicians; an edict returned them.",
    idiomatic: "Han Quanyi's son offered women; the court refused them.",
  },
  s0318: {
    literal: "On dingmao the princes — Prince of Pingyuan Ning as Prince of Deng, Tong'an Kuan as Prince of Li, Jian'an You as Prince of Sui, Pengcheng Cha as Prince of Shen, Gaomi Huan as Prince of Yang, Wen'an Liao as Prince of Jiang, and the tenth son Shen as Prince of Jian — were enfeoffed.",
    idiomatic: "Seven imperial sons received princely titles on dingmao.",
  },
  s0319: {
    literal: "On jisi Prince of Jian Shen was made Grand Protector of Yan and Pinglu-Ziqing military commissioner;",
    idiomatic: "Young Prince Shen was named nominal Yan commander while",
  },
  s0320: {
    literal: "Vice Commissioner Li Shidao was provisionally made to handle Yan affairs and act as regent.",
    idiomatic: "Li Shidao held real power as regent at Yan.",
  },
  s0321: {
    literal: "On yihai Consort Guo was enfeoffed Honored Consort.",
    idiomatic: "Lady Guo became honored consort on yihai.",
  },
  s0322: {
    literal: "Li Luan of Lingwu memorialized: at a Yellow River bank collapse ancient coins were obtained, 3,300 in number — their form small, square hole, three feet.",
    idiomatic: "Lingwu reported ancient coins found in a Yellow River collapse.",
  },
  s0323: {
    literal: "On renwu the eight demoted officials Wei Zhiyi, Han Tai, Chen Jian, Liu Zongyuan, Liu Yuxi, Han Ye, Ling Zhun, and Cheng Yi — even if they met amnesty edicts — were not within the limit of transferred exile.",
    idiomatic: "On renwu eight Shuwen partisans were barred forever from amnesty relocation.",
  },
  s0324: {
    literal: "On guiwei Metropolitan Governor Dong Shujing died.",
    idiomatic: "On guiwei capital intendant Dong Shujing died.",
  },
  s0325: {
    literal: "On jiashen the Censorate memorialized: regular-attendance officials in the capital who did not attend, and those outside who had not arrived, leave and excuses — for those outside not arrived, beyond water and land journey time, full one hundred days — all were to be suspended and dismissed; it was followed.",
    idiomatic: "Absentee officials were to be dismissed after a hundred days on jiashen.",
  },
  s0326: {
    literal: "On bingxu Right Vice Director Li Yong was made Metropolitan Governor.",
    idiomatic: "Li Yong returned to the capital magistracy on bingxu.",
  },
  s0327: {
    literal: "Ninth month, xinmao new moon.",
    idiomatic: "The ninth month opened on xinmao.",
  },
  s0328: {
    literal: "On guimao an edict: from now on one official of the two departments each court day shall face the throne.",
    idiomatic: "A Secretariat-Chancellery rotation for daily audiences was ordered on guimao.",
  },
  s0329: {
    literal: "On bingwu Junior Mentor to the Heir Zheng Yuqing was made Chancellor of the National University.",
    idiomatic: "Zheng Yuqing became university chancellor on bingwu.",
  },
  s0330: {
    literal: "On xinhai Gao Chongwen memorialized recovery of Chengdu; Liu Pi was captured and presented.",
    idiomatic: "Gao Chongwen took Chengdu and sent Liu Pi captive on xinhai.",
  },
  s0331: {
    literal: "On guichou the mountain man Li Bo was made Left Reminder — summoned, he did not come.",
    idiomatic: "Li Bo was appointed but refused office on guichou.",
  },
  s0332: {
    literal: "On jiazi Yiding Zhang Maozhao came to court.",
    idiomatic: "Zhang Maozhao visited court on jiazi.",
  },
  s0333: {
    literal: "On bingyin Gao Chongwen, eastern Sichuan military commissioner, acting Minister of War, prefect of Zi, enfeoffed Prince of Bohai, was made acting Master of Works, concurrent Governor of Chengdu, Censor-in-Chief, Sichuan vice military commissioner and acting commissioner, revenue and garrison observer, commissioner to manage nearby tribes and the eight western nations' Yunnan pacification, and other duties; he was also changed to Prince of Nanping with a fief of three thousand households.",
    idiomatic: "Gao Chongwen received sweeping western honors on bingyin.",
  },
  s0334: {
    literal: "On wuxu southwestern Shannan military commissioner Yan Li was made prefect of Zi and eastern Sichuan military commissioner;",
    idiomatic: "Yan Li and Liu Zhan exchanged Sichuan posts on wuxu;",
  },
  s0335: {
    literal: "Director of Palace Construction Liu Sheng was made acting Minister of Works and concurrent Governor of Xingyuan, southwestern Shannan military commissioner.",
    idiomatic: "Liu Sheng took Xingyuan and southwestern Shannan.",
  },
  s0336: {
    literal: "On gengchen Yuan Zi, prefect of Ji, was made Censor-in-Chief and Yicheng army military commissioner.",
    idiomatic: "Yuan Zi left exile for the Yicheng command on gengchen.",
  },
  s0337: {
    literal: "On renwu Li Shidao, regent of the Ziqing military commission, was made acting Minister of Works, Grand Protector of Yan prefecture, and vice military commissioner of Pinglu-Ziqing.",
    idiomatic: "Li Shidao received formal Ziqing command on renwu.",
  },
  s0338: {
    literal: "On bingxu King Daesung of Parhae was made acting Grand General.",
    idiomatic: "The Parhae king was honored on bingxu.",
  },
  s0339: {
    literal: "On wuzi Liu Pi and his son Chao Lang and nine others were executed beneath the Lone Willow tree.",
    idiomatic: "Liu Pi and nine kin were executed on wuzi.",
  },
  s0340: {
    literal: "Eleventh month, gengyin new moon.",
    idiomatic: "The eleventh month opened on gengyin.",
  },
  s0341: {
    literal: "On jisi Wang Quan, tutor of the Prince of Jian, was made Governor of Henan.",
    idiomatic: "Wang Quan became Henan governor on jisi.",
  },
  s0342: {
    literal: "On dingwei Li Shanggong, Minister of Imperial Farms, was made Grand Protector of Shaan and Shaan-Guo observer.",
    idiomatic: "Li Shanggong took the Shaan circuit on dingwei.",
  },
  s0343: {
    literal: "On jiashen Zhang Yin, Wuning military commissioner, was made Minister of Works; eastern capital regent Wang Shao was made acting Right Vice Director, concurrent prefect of Xu and Wuning military commissioner and Xu-Si-Hao observer.",
    idiomatic: "Zhang Yin and Wang Shao changed Xu posts on jiashen.",
  },
  s0344: {
    literal: "On gengxu Vice Minister of Personnel Zhao Zongru was made eastern capital regent and eastern Ji-Ru defender; Chancellor of the National University Zheng Yuqing was made Governor of Henan.",
    idiomatic: "Zhao Zongru and Zheng Yuqing took eastern capital posts on gengxu.",
  },
  s0345: {
    literal: "On jiayin Supervisor of Attendants Liu Zongjing was made prefect of Hua, Tongguan defender, and Zhenguo army commissioner.",
    idiomatic: "Liu Zongjing took Hua-Zhenguo on jiayin.",
  },
  s0346: {
    literal: "On bingchen Inner Regular Attendant Tutu Chengcui was made lieutenant protector of the Divine Strategy Army.",
    idiomatic: "The eunuch Tutu Chengcui became Shence commander on bingchen.",
  },
  s0347: {
    literal: "Twelfth month, bingshen new moon — the Court of Imperial Sacrifices memorialized: the hidden heir and Zhang Huai, Yide, Jiemin, Huizhuang, Huiwen, Huixuan, Qinggong, and Zhaojing — the nine princes' mausoleums below — generations are already distant, official quotas empty — now request that outside the mausoleum households all cease.",
    idiomatic: "Nine remote princes' tomb households were abolished on bingshen.",
  },
  s0348: {
    literal: "On yihai Minister of Works Zhang Yin died.",
    idiomatic: "Zhang Yin died on yihai.",
  },
  s0349: {
    literal: "On bingxu Silla, Parhae, Zangke, and Uighur each sent envoys with tribute.",
    idiomatic: "Four frontier states sent tribute on bingxu.",
  },
  s0350: {
    literal: "Spring, first month, jichou new moon — the Emperor personally offered at the Supreme Clear Palace and Imperial Ancestral Temple.",
    idiomatic: "In Yuanhe 2 he personally sacrificed at the ancestral shrines.",
  },
  s0351: {
    literal: "On xinmao he sacrificed to August Heaven at the suburban mound; that day he returned to the palace, took Danfeng Tower, and proclaimed a great amnesty for the empire.",
    idiomatic: "On xinmao he performed the suburban rite and proclaimed amnesty.",
  },
  s0352: {
    literal: "Earlier, as the great rites approached, overcast gloom lasted ten days; the councillors asked to change the day; the Emperor said: \"Suburban and temple affairs are weighty; fasting has its days — they cannot hastily be altered.\"",
    idiomatic: "He refused to postpone the rite despite ten days of rain.",
  },
  s0353: {
    literal: "On the day of offering the scenery cleared — people's hearts were glad.",
    idiomatic: "The sky cleared for the sacrifice, to popular joy.",
  },
  s0354: {
    literal: "On dingyou Minister of Education Du You declined handling administration.",
    idiomatic: "Du You resigned the council on dingyou.",
  },
  s0355: {
    literal: "An edict ordered him three times a month to enter court; he was then to discuss administration at the Secretariat.",
    idiomatic: "He was kept as a thrice-monthly consultant at the Secretariat.",
  },
  s0356: {
    literal: "On gengzi the Uighurs requested to place Manichaean temples in Henan and Taiyuan prefectures — it was permitted.",
    idiomatic: "Uighur Manichaean temples were allowed in Henan and Taiyuan on gengzi.",
  },
  s0357: {
    literal: "On yisi Du Huangchang, Vice Director of the Chancellery, Grand Councillor, and Duke of Nanyang, was made acting Master of Works and Grand Councillor, concurrent Governor of Hezhong and Hezhong-Jin-Jiang military commissioner.",
    idiomatic: "Du Huangchang went west to Hezhong on yisi.",
  },
  s0358: {
    literal: "All mausoleum regents were stopped.",
    idiomatic: "Mausoleum regents were abolished.",
  },
  s0359: {
    literal: "On jimao Wu Yuanheng, Vice Minister of Revenue and bearer of the crimson fish bag, was made Vice Director of the Chancellery, Grand Councillor, and bearer of the purple-gold fish bag; Secretariat Drafter and Hanlin academician Li Jifu was made Vice Director of the Secretariat and Grand Councillor.",
    idiomatic: "Wu Yuanheng and Li Jifu entered the council on jimao.",
  },
  s0360: {
    literal: "On dingsi the Zhonghe and Chongyang festival banquets were stopped;",
    idiomatic: "Mid-autumn and Double Ninth court banquets were cut on dingsi;",
  },
  s0361: {
    literal: "the Upper Si banquet was still bestowed as before.",
    idiomatic: "but the Upper Si feast remained.",
  },
  s0362: {
    literal: "Second month, xinyou — an edict: Buddhist and Daoist monks and nuns were entirely placed under the left and right street merit commissioners; from this the Ministries of Rites and Revenue no longer handled memorials.",
    idiomatic: "Clergy were placed under palace eunuch commissioners in the second month.",
  },
  s0363: {
    literal: "On bingyin the Left and Right Forest Guards' monthly drill cavalry, 5,613 in all, were all stopped.",
    idiomatic: "5,613 ceremonial cavalry were disbanded on bingyin.",
  },
  s0364: {
    literal: "On jisi Diary Attendant Zheng Sui had sequential audience and received orders face to face;",
    idiomatic: "On jisi the emperor ended sequential audience for attendants",
  },
  s0365: {
    literal: "an order proclaimed to both departments' service officials — from now when there is business, immediately submit a memorial; the sequential audience officer should stop.",
    idiomatic: "and required memorials instead of oral queue audiences.",
  },
  s0366: {
    literal: "On gengwu the Directorate of Astronomy completed a new calendar; an edict titled it \"Yuanhe Observing the Phenomena Calendar.\"",
    idiomatic: "The Yuanhe calendar was promulgated on gengwu.",
  },
  s0367: {
    literal: "On renshen night the moon covered the Year Star.",
    idiomatic: "The moon occulted Jupiter on renshen night.",
  },
  s0368: {
    literal: "On dingchou, Cold Food festival, the ministers were feasted at Linde Hall; gifts were graded.",
    idiomatic: "Cold Food brought a graded feast at Linde on dingchou.",
  },
  s0369: {
    literal: "On renwu Di Guozhen was made lieutenant protector of the Right Divine Strategy Army.",
    idiomatic: "Di Guozhen joined the Shence command on renwu.",
  },
  s0370: {
    literal: "Third month, xinmao — the ministers were feasted at Qujiang Pavilion.",
    idiomatic: "The court feasted at Qujiang in the third month.",
  },
  s0371: {
    literal: "On guimao Li Xun, acting revenue commissioner, was made Minister of War while still acting revenue, salt, and transport commissioner.",
    idiomatic: "Li Xun kept fiscal power while gaining the war ministry on guimao.",
  },
  s0372: {
    literal: "Summer, fourth month, jiazi — lead-tin coin was forbidden.",
    idiomatic: "Lead and tin cash were banned in the fourth month.",
  },
  s0373: {
    literal: "Fan Xichao, Grand General of the Right Golden Guard, was made acting Master of Works, Governor of Ling, and Shuofang-Ling-Salt military commissioner.",
    idiomatic: "Fan Xichao went north to Lingzhou.",
  },
  s0374: {
    literal: "On wuyin the recently established Heroic Martial army designation was stopped.",
    idiomatic: "The Yingwu army title was abolished on wuyin.",
  },
  s0375: {
    literal: "On gengchen Lingnan military commissioner Zhao Chang presented a map of sixty-two cave-districts of Qiong, Guan, Dan, Zhen, and Wan'an submitting.",
    idiomatic: "Zhao Chang presented a map of Lingnan tribes submitting on gengchen.",
  },
  s0376: {
    literal: "Sixth month, dingsi new moon — the hundred officials' awaiting-leak court was first established outside Jianfu Gate.",
    idiomatic: "The waiting court outside Jianfu was established in the sixth month.",
  },
  s0377: {
    literal: "By precedent, Jianfu and Wangxian gates closed at dusk and opened at fifth watch, together with ward gates.",
    idiomatic: "Capital gates had once closed at dusk like ward gates.",
  },
  s0378: {
    literal: "In the Zhide era Tibetan prisoners escaped from the Golden Guard; therefore an order delayed opening the gate; councillors awaited the leak at the Imperial Stud chariot yard.",
    idiomatic: "A Tibetan escape had led councillors to wait in a chariot yard after late opening.",
  },
  s0379: {
    literal: "Now the relevant offices were ordered according to rank to establish the court.",
    idiomatic: "Now a proper waiting hall was built by rank.",
  },
  s0380: {
    literal: "On wuwu Fengxiang military commissioner Zhang Jingze died.",
    idiomatic: "Zhang Jingze of Fengxiang died on wuwu.",
  },
  s0381: {
    literal: "On yichou colored-service households of the five wards and tax-paying kitchen households of the two departments and tax-collectors were all returned to prefecture and county corvée service.",
    idiomatic: "Palace craft and kitchen households reverted to local corvée on yichou.",
  },
  s0382: {
    literal: "On jisi the Shu, Lu, Chu, and He four prefectures' regimental commissioner titles were stopped.",
    idiomatic: "Four prefectural regiment titles were abolished on jisi.",
  },
  s0383: {
    literal: "On guiyou eastern capital manor-weaving households were all entrusted to prefecture and county control; on yihai Runzhou Danyang army designation was stopped.",
    idiomatic: "Eastern capital weaving households and the Danyang army title ended.",
  },
  s0384: {
    literal: "On bingzi the Left Divine Strategy Army newly built the flanking wall, establishing the Xuanshe Gate and Chenyao Tower.",
    idiomatic: "The Shence army expanded its walled compound on bingzi.",
  },
  s0385: {
    literal: "On xinsi Li Yong, Metropolitan Governor, was made Governor of Fengxiang and Fengxiang-Longyou military commissioner.",
    idiomatic: "Li Yong left the capital for Fengxiang on xinsi.",
  },
  s0386: {
    literal: "Cai prefecture flooded — eight or seven feet deep on level ground.",
    idiomatic: "Caizhou was inundated to a depth of seven or eight feet.",
  },
  s0387: {
    literal: "Autumn, seventh month, bingxu new moon — an order: Vice Minister of Justice Xu Mengrong and others were to revise and fix the Kaiyuan Code and later edicts.",
    idiomatic: "The seventh month ordered revision of Tang law codes.",
  },
  s0388: {
    literal: "On dinghai an order: outer appointed women attending the empress dowager — many advanced or retreated improperly; hereafter consorts were entrusted to the Imperial Clan Court, officials' mothers and wives to the Censorate — if there were violations, the husband's one-month salary; frequent failure to attend — the relevant office was to memorialize.",
    idiomatic: "Women's audiences at the dowager's court were regulated on dinghai.",
  },
  s0389: {
    literal: "On wuzi descendants of meritorious ministers who shared temple sacrifice were recorded — Su Gui's grandson Ji was used as Metropolitan Records Officer;",
    idiomatic: "Descendants of famous ministers were appointed on wuzi:",
  },
  s0390: {
    literal: "Cui Xuanwei's grandson Yuanfang and Zhang Yue's grandson Pian were all made investigating censors;",
    idiomatic: "Su Gui's and Zhang Yue's descendants among them;",
  },
  s0391: {
    literal: "Di Renjie's descendant Xuanfan was made Right Reminder;",
    idiomatic: "Di Renjie's heir became remonstrator;",
  },
  s0392: {
    literal: "Jing Hui's descendant Yuanliang and Yuan Shuji's descendant Deshi were appointed in succession.",
    idiomatic: "and others of Jing Hui and Yuan Shuji's lines.",
  },
  s0393: {
    literal: "On guisi Palace Studs Assistant Director Linghu Pi presented the lost father's Linghu Huan's compiled Veritable Records of Daizong in forty rolls; an edict posthumously made Huan Minister of Works.",
    idiomatic: "Linghu Huan's Daizong annals were accepted and he was posthumously honored on guisi.",
  },
  s0394: {
    literal: "Eighth month, bingchen new moon.",
    idiomatic: "The eighth month opened on bingchen.",
  },
  s0395: {
    literal: "On xinyou Grand Councillor Wu Yuanheng was additionally made acting revenue commissioner.",
    idiomatic: "Wu Yuanheng took the revenue commission on xinyou.",
  },
  s0396: {
    literal: "On renxu the Ministry of Justice memorialized changing Code scroll 8 from general Brawling Law.",
    idiomatic: "The brawling statute was revised on renxu.",
  },
  s0397: {
    literal: "On jiazi Wang Jie, outer bureau director in the Ministry of Personnel, was made Lingnan selection and supplement commissioner; investigating censor Cui Yuanfang supervised.",
    idiomatic: "Wang Jie was sent to staff Lingnan appointments on jiazi.",
  },
  s0398: {
    literal: "On jiaxu the Secretariat memorialized: \"Formerly stopping all circuits' memorializing auspicious omens.",
    idiomatic: "On jiaxu the council revised omen policy:",
  },
  s0399: {
    literal: "I humbly consider that auspicious omens presented are all because of year-end feasts, temple announcements, and New Year audiences reporting — hereafter great omens follow the memorial and report, middle and lower omens are declared to the relevant offices; the New Year's auspicious memorial — request following the statute form.",
    idiomatic: "great omens would still reach the throne on feast days; lesser ones stayed with local offices.",
  },
  s0400: {
    literal: "\"It was followed.",
    idiomatic: "The throne agreed.",
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
