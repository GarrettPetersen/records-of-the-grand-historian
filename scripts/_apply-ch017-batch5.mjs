#!/usr/bin/env node
/** Batch 5: s0401–s0500 (Jiutangshu ch.017, Jingzong, Wenzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/017.json';
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
    literal: 'The Daoists Ji Chuxuan and Yang Chongxu, and wonder-workers Li Yuanji and Wang Xin, were all exiled to Lingnan.',
    idiomatic: 'Ji Chuxuan, Yang Chongxu, Li Yuanji, Wang Xin, and other wonder-workers were exiled to Lingnan.',
  },
  s0402: {
    literal: 'On wushen the sacred mother was honored as empress dowager.',
    idiomatic: 'On wushen his mother became empress dowager.',
  },
  s0403: {
    literal: 'On jiyou an edict: the twenty-four female musicians advanced by Fengxiang and Huainan were all released to their home circuits.',
    idiomatic: 'On jiyou forty-eight palace musicians were sent home.',
  },
  s0404: {
    literal: 'On gengxu Senior Remonstrance official, Vice Minister of War, edict drafter, Hanlin academician, Pillar of State, granted purple-gold fish Wei Chuhou was made Vice Secretariat Director and Grand Councillor.',
    idiomatic: 'On gengxu Wei Chuhou joined the Grand Council.',
  },
  s0405: {
    literal: 'Hanlin academician Lu Sui was made drafting academician; lecture academician Song Shenxi was made edict academician.',
    idiomatic: 'Lu Sui and Song Shenxi took Hanlin posts.',
  },
  s0406: {
    literal: 'On bingchen the Shannan military commissioner Liu Gongchuo was made Vice Minister of Punishments.',
    idiomatic: 'On bingchen Liu Gongchuo took Punishments.',
  },
  s0407: {
    literal: 'On dingsi mourning was held for the Prince of Jiang; court was suspended three days.',
    idiomatic: 'On dingsi the court mourned the Prince of Jiang for three days.',
  },
  s0408: {
    literal: 'On gengshen an edict:',
    idiomatic: 'On gengshen Wenzong proclaimed:',
  },
  s0409: {
    literal: '"He who rules All-under-Heaven should above all esteem plainness and spare the distressed, take the Way as root, and reach the people with sincerity.',
    idiomatic: '"A ruler must cherish simplicity and pity the poor, root government in the Way, and reach the people in sincerity.',
  },
  s0410: {
    literal: 'Therefore the sage ancestor\'s admonition takes mercy and frugality as treasure;',
    idiomatic: 'Our sage ancestor made mercy and thrift his treasure;',
  },
  s0411: {
    literal: 'the great Change\'s clear instruction leaves the text of simplicity.',
    idiomatic: 'the Changes teaches simplicity in rule.',
  },
  s0412: {
    literal: 'Never has restraint above failed to bring abundance below, or desire for little failed to meet many needs.',
    idiomatic: 'Restraint above has always enriched those below.',
  },
  s0413: {
    literal: 'We, slight and thin, have met inner calamity, wiped the shame of our sovereign\'s murder, and vented the grief and wrong of the hundred millions.',
    idiomatic: 'I am slight in virtue yet have avenged my brother and the realm\'s grief.',
  },
  s0414: {
    literal: 'Yet the pillar ministers, the host of officials, upheld righteousness and resisted our plea, again and again.',
    idiomatic: 'Yet my ministers pressed me, again and again, for the throne.',
  },
  s0415: {
    literal: 'For the altars\' peace, for the answer to China and the barbarians\' hope, we bowed to the multitude\'s wish, trembling day and night.',
    idiomatic: 'For altar and empire I bowed to their wish, trembling day and night.',
  },
  s0416: {
    literal: 'We think how to restrain the self and restore ritual, repair government and settle the people, rising before sleep uneasy, eating after noon in labor.',
    idiomatic: 'I rise uneasy and eat after noon, seeking to restore ritual and settle the people.',
  },
  s0417: {
    literal: 'When frugality goes too far, measure it with ritual; when ornament prevails, correct it with substance.',
    idiomatic: 'Where frugality overshoots, ritual corrects it; where ornament prevails, substance corrects it.',
  },
  s0418: {
    literal: 'We hope custom may approach high antiquity, the Way may harmonize the living, and family and state may be model to transform All-under-Heaven.',
    idiomatic: 'May custom approach antiquity and transform the realm.',
  },
  s0419: {
    literal: 'Inner-palace women without regular duties — release three thousand, let them go as they will.',
    idiomatic: 'Three thousand idle palace women are freed.',
  },
  s0420: {
    literal: 'Changchun Palace grain and goods remain under Revenue as before.',
    idiomatic: 'Changchun Palace stores stay with Revenue.',
  },
  s0421: {
    literal: 'E-county Meibo, Fengxiang Luogu valley lands, and related holdings return to prefectures and counties.',
    idiomatic: 'Meibo, Luogu, and related lands return to local government.',
  },
  s0422: {
    literal: 'Music Office performers, Hanlin awaiting-edict scholars, wonder-work officers, and all redundant inner posts in the general directorate — twelve hundred seventy in all — are to be abolished.',
    idiomatic: 'Twelve hundred seventy Music Office, Hanlin, and wonder-work posts are abolished.',
  },
  s0423: {
    literal: 'Of the directorate, one hundred twenty-four formerly belonging to various armies return to their original bureaus.',
    idiomatic: 'One hundred twenty-four army-detailed posts return to their commands.',
  },
  s0424: {
    literal: 'The remaining seven hundred three surrender their credentials and return to their home offices.',
    idiomatic: 'Seven hundred three redundant clerks surrender credentials and go home.',
  },
  s0425: {
    literal: 'The hundred shares of grain and cloth formerly supplied the Music Office, ward households, and three thousand new shares for various offices — all stop.',
    idiomatic: 'Music Office and ward stipends, including three thousand new shares, cease.',
  },
  s0426: {
    literal: 'The five-direction hawks and falcons are all released.',
    idiomatic: 'Imperial hawks and falcons are released.',
  },
  s0427: {
    literal: 'This year\'s newly ordered palace child food allowances of one hundred from Revenue — stop.',
    idiomatic: 'One hundred palace child food allowances from Revenue cease.',
  },
  s0428: {
    literal: 'Separate edict demands for carved inlay beyond regular tribute — stop.',
    idiomatic: 'Extra carved-tribute orders beyond regular tribute cease.',
  },
  s0429: {
    literal: 'Revenue, salt, Personnel, and prefectural offices\' annual palace supplies, item by item, take the Yuanhe 1 quota as fixed.',
    idiomatic: 'Palace supplies revert to the Yuanhe 1 quota.',
  },
  s0430: {
    literal: 'Beds and couches for the palace with gold settings, kingfisher, and jeweled inlay — all stop manufacture.',
    idiomatic: 'Jeweled palace furniture is forbidden.',
  },
  s0431: {
    literal: 'The eastern Longwu horse park and ball ground return to Longwu Army.',
    idiomatic: 'The eastern horse park and ball ground return to Longwu Army.',
  },
  s0432: {
    literal: 'Their halls and pavilions are to be demolished; remaining buildings are granted to that army.',
    idiomatic: 'Jingzong\'s halls are torn down; scraps go to Longwu.',
  },
  s0433: {
    literal: 'Wherever the procession is arrayed, flower-wax and brocade ornament may not be used.',
    idiomatic: 'Processional flower-wax and brocade ornaments are banned.',
  },
  s0434: {
    literal: 'Female musicians presented this year from various circuits — grant cloth and send back.',
    idiomatic: 'This year\'s circuit musicians receive cloth and return home.',
  },
  s0435: {
    literal: 'Suburban tombs previously opened for excursions — inform the people they may repair and block them again.',
    idiomatic: 'Tombs opened for excursions may be repaired by locals.',
  },
  s0436: {
    literal: 'The chief rebels Su Zuoming and twenty-eight others have been executed; clans registered and confiscated.',
    idiomatic: 'Twenty-eight chief rebels including Su Zuoming were executed and their clans confiscated.',
  },
  s0437: {
    literal: 'Sorcerer-monks Weizhen, Daoist Zhao Guizhen, and others who feigned divination or medicine to delude the crowd — already exiled.',
    idiomatic: 'Sorcerers already exiled had deluded the crowd with divination and medicine.',
  },
  s0438: {
    literal: 'Those whose hearts were not wicked but whose acts touched error — all are not questioned.',
    idiomatic: 'Minor accomplices are unpunished.',
  },
  s0439: {
    literal: 'With villains destroyed, the realm awaits peace; good statutes are now raised to enlarge the people\'s achievement.',
    idiomatic: 'With villains dead, the realm awaits good government and new statutes.',
  },
  s0440: {
    literal: 'Proclaim within and without — know Our intent.',
    idiomatic: 'Let all within and without know Our intent.',
  },
  s0441: {
    literal: 'The closing mark of the edict.',
    idiomatic: 'Thus ended the edict.',
  },
  s0442: {
    literal: 'While in the princely mansion the Emperor knew the accumulated abuses of two reigns; these reforms now all came from his own breast; scholars and people rejoiced that the Way of rule was reviving.',
    idiomatic: 'Having seen two reigns\' abuses as a prince, he reformed from his own breast; the realm rejoiced.',
  },
  s0443: {
    literal: 'On renxu the former Jiangxi observation commissioner Yin You was made Court of Judicature Review director.',
    idiomatic: 'On renxu Yin You took the Court of Judicature Review.',
  },
  s0444: {
    literal: 'Taihe 1 — Taihe 1, spring, first month, guihai new moon.',
    idiomatic: 'Taihe 1 opened on guihai.',
  },
  s0445: {
    literal: 'On gengwu Vice Censor-in-Chief Dugu Lang was made Vice Minister of Revenue; Minister of War, acting Left Vice Director Duan Wenchang was made Censor-in-Chief.',
    idiomatic: 'On gengwu Dugu Lang took Revenue and Duan Wenchang the censorate.',
  },
  s0446: {
    literal: 'That night the moon eclipsed the Net\'s great star.',
    idiomatic: 'That night the moon covered the Net\'s great star.',
  },
  s0447: {
    literal: 'On wuyin Left Regular Cavalry Attendant Li Yi was made Minister of Rites, retired; Jingzhao prefect Liu Qichu was made Gui observation commissioner.',
    idiomatic: 'On wuyin Li Yi retired from Rites; Liu Qichu took Gui circuit.',
  },
  s0448: {
    literal: 'The former Vice Minister of Revenue Yu Ao was made Xuan-She observation commissioner, replacing Cui Qun;',
    idiomatic: 'Yu Ao replaced Cui Qun at Xuan-She;',
  },
  s0449: {
    literal: 'Qun was made Minister of War.',
    idiomatic: 'Cui Qun took War.',
  },
  s0450: {
    literal: 'Qun was made Minister of War.',
    idiomatic: 'Cui Qun took War.',
  },
  s0451: {
    literal: 'On guiwei Vice Minister of Personnel Yu Chengxuan was made Jingzhao prefect and concurrent Censor-in-Chief.',
    idiomatic: 'On guiwei Yu Chengxuan took the capital prefecture.',
  },
  s0452: {
    literal: 'On bingshen the thirty-four assistant prefect posts of the two capitals, six heroes, ten prospects, and ten tight circuits were restored.',
    idiomatic: 'On bingshen thirty-four prized assistant prefect posts were restored.',
  },
  s0453: {
    literal: 'Miscellaneous capital posts and inner and outer army commissioner posts are outside the name-holding limit.',
    idiomatic: 'Army and capital posts were exempted from the name limit.',
  },
  s0454: {
    literal: 'On jihai Right Regular Cavalry Attendant, Academician of the Hall of Assembled Worthies, acting director Zhang Zhengfu was made Minister of Works.',
    idiomatic: 'On jihai Zhang Zhengfu took Works.',
  },
  s0455: {
    literal: 'On xinchou the former Guangzhou military commissioner Cui Zhi was made Minister of Revenue; the heir-apparent Junior Preceptor, eastern-capital assignee Li Jiang was made acting Minister of Works, concurrent Minister of Rites.',
    idiomatic: 'On xinchou Cui Zhi took Revenue and Li Jiang Rites with acting Works.',
  },
  s0456: {
    literal: 'On yisi he ascended Danfeng Tower, proclaimed a great amnesty, and changed the era to Taihe.',
    idiomatic: 'On yisi Wenzong proclaimed amnesty and the era Taihe.',
  },
  s0457: {
    literal: 'On jiayin an edict: military observation commissioners leaving office should file handover documents; within one month after the new commissioner arrives analysis is to be memorialized for merit review. (The source reads 0殿最; taken as merit review.)',
    idiomatic: 'On jiayin frontier commissioners were ordered to file handover reports within a month for merit review.',
  },
  s0458: {
    literal: 'On bingchen Huazhou prefect Qian Hui was made Right Vice Director; the former Heyang military commissioner Cui Hongli was made Huazhou Zhenguo army commissioner.',
    idiomatic: 'On bingchen Qian Hui took the right vice post and Cui Hongli Huazhou.',
  },
  s0459: {
    literal: 'On jiwei the retired heir-apparent Junior Preceptor Xiao Fu was made acting Right Vice Premier and concurrent Minister of Rites.',
    idiomatic: 'On jiwei Xiao Fu returned as acting right vice premier.',
  },
  s0460: {
    literal: 'Qianzhou prefect Han Yue was made Annan Protector.',
    idiomatic: 'Han Yue became Annan Protector.',
  },
  s0461: {
    literal: 'Third month, gengxu new moon: Right Army Defender Commissioner Liang Shouqian requested retirement; Pivot Commissioner Wang Shoucheng replaced him.',
    idiomatic: 'On gengxu Wang Shoucheng replaced the retiring Liang Shouqian.',
  },
  s0462: {
    literal: 'On wuyin the former Suzhou prefect Bai Juyi was made Secretariat Monitor, still granted gold-purple.',
    idiomatic: 'On wuyin Bai Juyi became Secretariat Monitor with gold-purple.',
  },
  s0463: {
    literal: 'On renwu Youzhou Li Zaiyi memorialized that Zhang Hongjing\'s former staff households, one hundred ninety in all, were sent to court.',
    idiomatic: 'On renwu Li Zaiyi sent Zhang Hongjing\'s 190 hostage households to court.',
  },
  s0464: {
    literal: 'Fourth month, renchen new moon.',
    idiomatic: 'The fourth month opened on renchen.',
  },
  s0465: {
    literal: 'On guisi the retired heir-apparent Junior Preceptor Yang Yuling kept Right Vice Premier, retired, with full salary.',
    idiomatic: 'On guisi Yang Yuling retired as right vice premier with full pay.',
  },
  s0466: {
    literal: 'On jiawu Fengxiang built Linqian city eighty li northwest of Qianyang county.',
    idiomatic: 'On jiawu Fengxiang built Linqian city.',
  },
  s0467: {
    literal: 'On renyin Ascending Yang Hall\'s eastern duck pavilion was destroyed;',
    idiomatic: 'On renyin Jingzong\'s duck pavilion at Ascending Yang was torn down;',
  },
  s0468: {
    literal: 'On wushen ten viewing towers beside Wangxian Gate were destroyed — all Jingzong\'s constructions.',
    idiomatic: 'and ten Wangxian Gate towers — all Jingzong\'s follies.',
  },
  s0469: {
    literal: 'The former Bozhou prefect Zhang Zun was made Yongguan frontier commissioner.',
    idiomatic: 'Zhang Zun took Yongguan.',
  },
  s0470: {
    literal: 'On yimao Minister of Rites Xiao Fu was made heir-apparent Junior Preceptor, assigned to the eastern capital.',
    idiomatic: 'On yimao Xiao Fu went to Luoyang.',
  },
  s0471: {
    literal: 'On jiwei the Zhongwu military commissioner Wang Pei died.',
    idiomatic: 'On jiwei Wang Pei died.',
  },
  s0472: {
    literal: 'On gengshen Senior Director of the Court of the Imperial Stud Gao Yu was made acting Left Regular Cavalry Attendant and Zhongwu military commissioner.',
    idiomatic: 'On gengshen Gao Yu took Zhongwu.',
  },
  s0473: {
    literal: 'On jisi the Shannan East military vice commissioner Li Xu was demoted to prefect of Fu; the Shannan East field secretary Zhang Youxin to Tingzhou — Li Fengji\'s faction.',
    idiomatic: 'On jisi two Li Fengji allies were banished to the south.',
  },
  s0474: {
    literal: 'Fifth month, renxu new moon.',
    idiomatic: 'The fifth month opened on renxu.',
  },
  s0475: {
    literal: 'On wuchen an edict: "The sovereign and his pillars are monarch and minister in one body; trust should be open and shared.',
    idiomatic: 'On wuchen Wenzong proclaimed:',
  },
  s0476: {
    literal: 'To employ is not to doubt; to doubt is not to employ.',
    idiomatic: '"To employ is not to doubt; to doubt is not to employ.',
  },
  s0477: {
    literal: 'Yet since Wei and Jin, hegemonic practices have been mixed in; empty talk of searches still lingers in habit.',
    idiomatic: 'Since Wei and Jin, searches and suspicion have poisoned rule.',
  },
  s0478: {
    literal: 'We now advance great trust and place hearts in open hands, hoping frontier lords may be steeped in transforming government and barbarians and beasts swim in ordered achievement.',
    idiomatic: 'I now place my heart in open hands and ask frontier lords to govern in trust.',
  },
  s0479: {
    literal: 'How much more Our councilors — what barrier between Us?',
    idiomatic: 'How much more my councilors — what barrier between us?',
  },
  s0480: {
    literal: 'Henceforth at Zichen audiences, after the host of officials withdraw, the chief ministers again enter to memorialize; the attendance search is to stop." On bingzi the Tianping military commissioner, acting Minister of Education, Grand Councillor Wu Zhongyin was made Henghai military commissioner;',
    idiomatic: 'Henceforth the body-search of premiers at Zichen ends." On bingzi Wu Zhongyin took Henghai;',
  },
  s0481: {
    literal: 'the former acting Henghai vice commissioner, acting Chancellor of the Imperial College, Attendant Censor Li Tongjie was made acting Left Regular Cavalry Attendant, concurrent Yan prefect, and Yan-Hai-Yi-Mi military commissioner.',
    idiomatic: 'Li Tongjie took Yan-Hai.',
  },
  s0482: {
    literal: 'At his post Weibo\'s Shi Xiancheng was added Grand Councillor.',
    idiomatic: 'Shi Xiancheng at Weibo joined the council.',
  },
  s0483: {
    literal: 'On jiashen the Huainan military commissioner and salt and transport commissioner Wang Bo came to court.',
    idiomatic: 'On jiashen Wang Bo arrived at court.',
  },
  s0484: {
    literal: 'On bingxu night the Sparkling One transgressed the Right Enforcer.',
    idiomatic: 'On bingxu night Mars crossed the Right Enforcer.',
  },
  s0485: {
    literal: 'Sixth month, xinmao new moon: an edict — when civil and military regular attendees missed court, according to the stipend deduction per string, twenty-five cash per string was fined.',
    idiomatic: 'On xinmao absent officials were fined twenty-five cash per withheld string.',
  },
  s0486: {
    literal: 'On guisi the Huainan military vice commissioner, acting military commissioner, coastal garrison, observation, disposition, and pasture commissioner, Silver-Green Grand Master for Splendid Happiness, acting Minister of Works, Grand Councillor, Yangzhou metropolitan prefect, Upper Pillar, Baron of Taiyuan with seven hundred households Wang Bo was made Left Vice Premier and Grand Councillor, still salt and transport commissioner for all circuits.',
    idiomatic: 'On guisi Wang Bo became left vice premier while keeping the salt monopoly.',
  },
  s0487: {
    literal: 'Censor-in-Chief Duan Wenchang replaced Bo as Huainan military commissioner.',
    idiomatic: 'Duan Wenchang replaced Wang Bo at Huainan.',
  },
  s0488: {
    literal: 'On bingshen Left Bureau master, concurrent Attendant Censor, acting miscellaneous cases Wen Zao was acting Vice Censor-in-Chief.',
    idiomatic: 'On bingshen Wen Zao acted as vice censor-in-chief.',
  },
  s0489: {
    literal: 'On guimao an edict: "In Yuanhe and Changqing, because of military use, expedient measures were taken; edicts issued were hard to enforce.',
    idiomatic: 'On guimao Wenzong ordered:',
  },
  s0490: {
    literal: 'Let the Ministry of State compile Yuanhe-era edicts, compare and delete them, then send to the Secretariat and council for deliberation and memorial."',
    idiomatic: '"Compile and prune Yuanhe-era edicts for council review." Thus ended the edict.',
  },
  s0491: {
    literal: 'On jiayin because of drought prisoners were released.',
    idiomatic: 'On jiayin drought prompted a prisoner release.',
  },
  s0492: {
    literal: 'Seventh month, xinyou new moon.',
    idiomatic: 'The seventh month opened on xinyou.',
  },
  s0493: {
    literal: 'On guihai Minister of Rites Li Jiang was advanced to Duke of Wei.',
    idiomatic: 'On guihai Li Jiang became Duke of Wei.',
  },
  s0494: {
    literal: 'When Li Tongjie received Yan and Hai he did not accept the edict and joined You and Ping in plotting rebellion.',
    idiomatic: 'Li Tongjie refused Yan-Hai and plotted rebellion with the north.',
  },
  s0495: {
    literal: 'On guiyou Jingzong was buried at Zhuang Mausoleum.',
    idiomatic: 'On guiyou Jingzong was interred at Zhuang Mausoleum.',
  },
  s0496: {
    literal: 'On xinsi an edict ordered examinations provisionally held at the eastern capital this year.',
    idiomatic: 'On xinsi examinations were moved to Luoyang for the year.',
  },
  s0497: {
    literal: 'On xinsi an edict ordered examinations provisionally held at the eastern capital this year.',
    idiomatic: 'On xinsi examinations were moved to Luoyang for the year.',
  },
  s0498: {
    literal: 'Xuzhou Wang Zhixing asked to lead the whole army against Li Tongjie.',
    idiomatic: 'Wang Zhixing offered his full army against Li Tongjie.',
  },
  s0499: {
    literal: 'Eighth month, gengyin new moon: Vice Minister of Works Dugu Lang was made Fujian observation commissioner; Senior Director of the Imperial Treasury Pei Hongtai was made Qianzhong frontier and observation commissioner.',
    idiomatic: 'On gengyin Dugu Lang took Fujian and Pei Hongtai Qianzhong.',
  },
  s0500: {
    literal: 'The retired Left Vice Premier Yang Yuling declined full salary; assented.',
    idiomatic: 'Yang Yuling\'s refusal of full retirement pay was granted.',
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
if (data.metadata.chapter !== '017') {
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
