#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Jiutangshu ch.017, Jingzong, Wenzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/017.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 101;
const END = 200;

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
  s0101: {
    literal: 'This circuit has only fifty thousand strings of retained commissioner funds; though every matter is spent frugally, it still lacks one hundred thirty thousand strings.',
    idiomatic: '"My circuit retains only fifty thousand strings and still lacks one hundred thirty thousand."',
  },
  s0102: {
    literal: 'If I follow precedent without memorializing, I fail Your Majesty\'s charge;',
    idiomatic: '"Silence would betray your trust;"',
  },
  s0103: {
    literal: 'if I levy beyond measure, I burden Your Majesty\'s merciful frugality.',
    idiomatic: '"extortion would betray your frugality."',
  },
  s0104: {
    literal: 'I beg that the chief ministers be ordered to discuss how to let your servant meet the imperial demand above without shorting army needs below, without exhausting the people, and without gathering popular resentment."',
    idiomatic: '"Let the premiers find a way to meet the order without starving the army or the people." Thus ended the memorial.',
  },
  s0105: {
    literal: 'Because an edict had just stopped extra presentations, Li Deyu made this memorial.',
    idiomatic: 'A recent ban on extra tribute prompted Li Deyu\'s protest.',
  },
  s0106: {
    literal: 'Eighth month, dingyou new moon.',
    idiomatic: 'The eighth month opened on dingyou.',
  },
  s0107: {
    literal: 'That night fire transgressed Saturn.',
    idiomatic: 'Fire crossed Saturn that night.',
  },
  s0108: {
    literal: 'The sorcerer Ma Wenzhong and palace officers Ji Wend and others, fourteen hundred in all, plotting sedition, were all beaten one hundred strokes and executed.',
    idiomatic: 'Fourteen hundred plotters including Ma Wenzhong were beaten and executed.',
  },
  s0109: {
    literal: 'On guiwei fire transgressed the Well.',
    idiomatic: 'On guiwei fire crossed the Well.',
  },
  s0110: {
    literal: 'On jiayin an edict ordered discounted and harmonized purchase of one million five hundred thousand shi of grain within Guannei and Guandong.',
    idiomatic: 'On jiayin the court bought 1.5 million shi of grain for the north.',
  },
  s0111: {
    literal: 'Chen, Xu, Cai, Yan, Cao, and Pu suffered flood damage to the crops.',
    idiomatic: 'Floods ruined crops across the central plain.',
  },
  s0112: {
    literal: 'On dinghai fire entered the Well.',
    idiomatic: 'On dinghai the fire star entered the Well mansion.',
  },
  s0113: {
    literal: 'On jichou Li Chong\'s grandson Hong was made Henan military registrar; Jiang Qing\'s grandson Yuban was made Yiyang magistrate — recording loyal ministers\' descendants.',
    idiomatic: 'On jichou descendants of Li Chong and Jiang Qing received offices.',
  },
  s0114: {
    literal: 'That night metal transgressed the right horn of the Chariot.',
    idiomatic: 'Metal crossed the Chariot\'s right horn that night.',
  },
  s0115: {
    literal: 'On renchen the Jiang princely mansion chief clerk Duan Zhao memorialized that as former Longzhou prefect he knew Oxheart Mountain near the city, on which stood the shrine of the immortal Li Longqian, quite efficacious; when Xuanzong went to Shu a separate temple was erected.',
    idiomatic: 'On renchen Duan Zhao urged restoring Li Longqian\'s shrine on Oxheart Mountain near Longzhou.',
  },
  s0116: {
    literal: 'The Emperor sent senior officer Zhang Shiqian to Longzhou to inspect; on return he reported Oxheart Mountain had an excavated break.',
    idiomatic: 'Zhang Shiqian found the mountain shrine site damaged.',
  },
  s0117: {
    literal: 'The ministers said repair should be undertaken.',
    idiomatic: 'The court favored repair.',
  },
  s0118: {
    literal: 'It was deep winter; tens of thousands of laborers were counted; eastern Sichuan military commissioner Li Jiang memorialized in protest.',
    idiomatic: 'Li Jiang protested the winter levy of tens of thousands of laborers.',
  },
  s0119: {
    literal: 'On jiazi Senior Minister of Rites Zhao Zongru was made heir-apparent Junior Preceptor.',
    idiomatic: 'On jiazi Zhao Zongru became junior preceptor.',
  },
  s0120: {
    literal: 'On yisi the Xuancheng military commissioner Han Chong died.',
    idiomatic: 'On yisi Han Chong died.',
  },
  s0121: {
    literal: 'Ninth month, bingwu new moon.',
    idiomatic: 'The ninth month opened on bingwu.',
  },
  s0122: {
    literal: 'On dingwei the great Persian merchant Li Susa presented agarwood pavilion timber; Reminder Li Han remonstrated: "Agarwood for a pavilion differs from the Jade Terrace and Jasper Hall."',
    idiomatic: 'On dingwei Li Han mocked a Persian merchant\'s agarwood "pavilion" as unseemly luxury.',
  },
  s0123: {
    literal: 'The Emperor was angry but treated him leniently.',
    idiomatic: 'Jingzong was angry yet spared Li Han.',
  },
  s0124: {
    literal: 'On gengxu Henan prefect Linghu Chu was made acting Minister of Rites, Bian prefect, Xuancheng military commissioner, and Song-Bian-Bo observation commissioner.',
    idiomatic: 'On gengxu Linghu Chu took Xuancheng and Bian.',
  },
  s0125: {
    literal: 'On yimao the Petition Box commissioner was abolished.',
    idiomatic: 'On yimao the Petition Box office was abolished.',
  },
  s0126: {
    literal: 'Remonstrance official Li Bo was put in charge of the box; he had asked for clerks and extra stipends.',
    idiomatic: 'Li Bo took the box after demanding staff and pay.',
  },
  s0127: {
    literal: 'On wuwu Zhu Rong was advanced to acting Minister of Works.',
    idiomatic: 'On wuwu Zhu Rong was promoted to acting Minister of Works.',
  },
  s0128: {
    literal: 'An edict ordered Zhexi to weave one thousand bolts of patterned trim and coiled brocade.',
    idiomatic: 'Zhexi was ordered to weave a thousand bolts of patterned silk.',
  },
  s0129: {
    literal: 'Observation commissioner Li Deyu memorialized in remonstrance and did not obey; the order was then stopped.',
    idiomatic: 'Li Deyu\'s remonstrance canceled the weave order.',
  },
  s0130: {
    literal: 'On jisi Vice Minister of War Wang Qi was made Henan prefect.',
    idiomatic: 'On jisi Wang Qi became Henan prefect.',
  },
  s0131: {
    literal: 'On jiazi Tibet sent envoys requesting the Wutai Mountain map.',
    idiomatic: 'On jiazi Tibet asked for a map of Wutai Mountain.',
  },
  s0132: {
    literal: 'On jisi Zhexi and Huainan each presented three silver dressing cases demanded by the palace.',
    idiomatic: 'On jisi two circuits sent three silver toilet cases each.',
  },
  s0133: {
    literal: 'Winter, tenth month, bingzi new moon: the Court of the Imperial Clan selected twenty-five sons-in-law including He Yuanliang of Shangxian; each was granted three hundred thousand cash for wedding expenses.',
    idiomatic: 'On bingzi twenty-five imperial sons-in-law received three hundred thousand cash each.',
  },
  s0134: {
    literal: 'On xinsi Vice Minister of Personnel Cui Cong was made Minister of Rites.',
    idiomatic: 'On xinsi Cui Cong took Rites.',
  },
  s0135: {
    literal: 'On gengzi the Lingnan military commissioner Zheng Quan died.',
    idiomatic: 'On gengzi Zheng Quan died.',
  },
  s0136: {
    literal: 'On xinchou Tibet presented a rhinoceros; silver rhinoceros, sheep, and deer were cast, one each.',
    idiomatic: 'On xinchou Tibet sent a rhinoceros and silver models of beasts.',
  },
  s0137: {
    literal: 'On renyin the E-Yue observation commissioner, acting Minister of War Cui Zhi was made acting Minister of Personnel, concurrent Guangzhou prefect and Censor-in-Chief, and Lingnan military observation commissioner.',
    idiomatic: 'On renyin Cui Zhi took Lingnan.',
  },
  s0138: {
    literal: 'Vice Minister of Revenue Wei Hao was made Vice Censor-in-Chief, still Vice Minister of Revenue;',
    idiomatic: 'Wei Hao became vice censor-in-chief while keeping Revenue;',
  },
  s0139: {
    literal: 'acting Vice Censor-in-Chief Zheng Tan was made acting Vice Minister of Works;',
    idiomatic: 'Zheng Tan took acting Works;',
  },
  s0140: {
    literal: 'Vice Minister of Punishments Wei Hongjing was made Vice Minister of Personnel;',
    idiomatic: 'Wei Hongjing took Personnel;',
  },
  s0141: {
    literal: 'acting acting Rituals Bureau master Li Zongmin was made acting acting Vice Minister of War;',
    idiomatic: 'Li Zongmin took acting War;',
  },
  s0142: {
    literal: 'Vice Minister of Works Yu Ao was made Vice Minister of Punishments.',
    idiomatic: 'Yu Ao took Punishments.',
  },
  s0143: {
    literal: 'Eleventh month, bingwu new moon.',
    idiomatic: 'The eleventh month opened on bingwu.',
  },
  s0144: {
    literal: 'On wushen the Annan Protector Li Yuanxi memorialized: Huang bandits with the Ring kingdom jointly took Luzhou and killed prefect Ge Wei.',
    idiomatic: 'On wushen Huang rebels and Ring kingdom allies killed Luzhou\'s prefect.',
  },
  s0145: {
    literal: 'Seven prefectures including Su, Chang, Hu, Yue, Ji, Tan, and Chen suffered flood damage to crops.',
    idiomatic: 'Floods hurt crops in seven lower-Yangzi prefectures.',
  },
  s0146: {
    literal: 'On gengshen Muzong was buried at Guang Mausoleum.',
    idiomatic: 'On gengshen Muzong was interred at Guang Mausoleum.',
  },
  s0147: {
    literal: 'Twelfth month, yihai new moon.',
    idiomatic: 'The twelfth month opened on yihai.',
  },
  s0148: {
    literal: 'On guiwei Uighur, Tibet, Xi, and Khitan sent envoys with tribute.',
    idiomatic: 'On guiwei frontier peoples sent tribute missions.',
  },
  s0149: {
    literal: 'Xiangzhou\'s Liu Gongchuo, Cangzhou\'s Li Quanlue, Jinzhou\'s Li Huan, and Huazhou\'s Gao Chengjian were all advanced from Minister to acting Right Vice Premier.',
    idiomatic: 'Four frontier commissioners were promoted to acting right vice premier.',
  },
  s0150: {
    literal: 'Former Attendant of the Heir Liu Qichu was made Remonstrance official.',
    idiomatic: 'Liu Qichu became remonstrance official.',
  },
  s0151: {
    literal: 'Huainan military commissioner Wang Bo bribed powerful men to seek the salt monopoly; Remonstrance official Dugu Lang, Zhang Zhongfang, Attendants of the Heir Kong Minxing, Liu Gongquan, Song Shensi, Supplements Wei Renshi and Liu Dunru, Reminders Li Jingzhu and Xue Tinglao, and others knelt at Yanying with joint memorials opposing it.',
    idiomatic: 'Wang Bo\'s bid for the salt office drew a joint Yanying protest from nine remonstrators.',
  },
  s0152: {
    literal: 'On wuzi night the moon eclipsed the Well.',
    idiomatic: 'On wuzi night the moon covered the Well.',
  },
  s0153: {
    literal: 'On gengyin the Tianping military commissioner Wu Zhongyin was added Grand Councillor.',
    idiomatic: 'On gengyin Wu Zhongyin joined the Grand Council.',
  },
  s0154: {
    literal: 'On yiwei Xu-Si Wang Zhixing requested a Buddhist ordination platform; Zhexi observation commissioner Li Deyu memorialized against the favoritism.',
    idiomatic: 'On yiwei Li Deyu blocked Wang Zhixing\'s illegal ordination platform.',
  },
  s0155: {
    literal: 'Since Xianzong\'s reign an edict had forbidden private ordination platforms; Zhixing defied the ban in his request — because none had been set up for long, monks throughout the realm rushed as if late.',
    idiomatic: 'A long ban on private platforms had made monks swarm when Zhixing reopened the door.',
  },
  s0156: {
    literal: 'Zhixing sought the heavy profit and grew rich thereby; opinion reviled him.',
    idiomatic: 'Zhixing profited from fees and was widely despised.',
  },
  s0157: {
    literal: 'On dingyou Chief Minister Niu Sengru was advanced to Duke of Qizhang, Li Cheng Duke of Pengyuan, Dou Yizhi Duke of Jinyang, each with three thousand households.',
    idiomatic: 'On dingyou three premiers were enfeoffed with three thousand households each.',
  },
  s0158: {
    literal: 'Vice Minister of Personnel Han Yu died.',
    idiomatic: 'Han Yu died.',
  },
  s0159: {
    literal: 'Baoli 1 — Baoli 1, spring, first month, yisi new moon. (The reign year is duplicated in the source.)',
    idiomatic: 'Baoli 1 opened on yisi.',
  },
  s0160: {
    literal: 'On xinhai he observed sacrifice to the Supreme Lord at the southern suburb.',
    idiomatic: 'On xinhai Jingzong sacrificed at the southern suburb.',
  },
  s0161: {
    literal: 'When the rites ended he ascended Danfeng Tower, proclaimed a great amnesty, and changed the era to Baoli 1.',
    idiomatic: 'The suburb rites ended with amnesty and the era name Baoli.',
  },
  s0162: {
    literal: 'Earlier, Yuxian magistrate Cui Fa was imprisoned for mistakenly insulting a palace eunuch; that day he waited with other prisoners beneath the Golden Rooster pole for release.',
    idiomatic: 'Magistrate Cui Fa, jailed for insulting a eunuch, waited for amnesty at the Golden Rooster pole.',
  },
  s0163: {
    literal: 'Suddenly more than fifty inner eunuchs surrounded Fa and beat him; his face was broken and teeth knocked out; clerks shielded him with a mat before he escaped.',
    idiomatic: 'Eunuchs beat Cui Fa bloody until clerks shielded him with a mat.',
  },
  s0164: {
    literal: 'An edict returned him to prison; the chief ministers rescued him and he was released.',
    idiomatic: 'Premiers secured his release after a re-arrest.',
  },
  s0165: {
    literal: 'Chief Minister Niu Sengru repeatedly memorialized asking to leave office; the Emperor agreed after the suburban rites.',
    idiomatic: 'Niu Sengru begged to resign; Jingzong promised release after the sacrifice.',
  },
  s0166: {
    literal: 'On yimao Sengru was made acting Minister of Rites, Grand Councillor, E prefect, Wuchang military commissioner, and E-Yue observation commissioner.',
    idiomatic: 'On yimao Niu Sengru went to Wuchang with council rank.',
  },
  s0167: {
    literal: 'Huainan military commissioner Wang Bo also took the salt and transport commission for all circuits.',
    idiomatic: 'Wang Bo seized the salt monopoly.',
  },
  s0168: {
    literal: 'At Ezhou a separate Wuchang army designation was created to honor Sengru.',
    idiomatic: 'A Wuchang army tab was created at Ezhou to honor Niu Sengru.',
  },
  s0169: {
    literal: 'On renshen Reminder Li Bo was made Guizhou prefect, concurrent Vice Censor-in-Chief, and Gui circuit defense commissioner.',
    idiomatic: 'On renshen Li Bo was sent to Guizhou.',
  },
  s0170: {
    literal: 'Li Deyu presented six "Pillars of the Throne" admonitions; the Emperor deeply praised them and ordered academician Wei Chuhou to compose a generous reply.',
    idiomatic: 'Li Deyu\'s six admonitions won praise and a warm imperial reply.',
  },
  s0171: {
    literal: 'On xinmao the former Rituals Bureau master Li Ao was made Luzhou prefect — he had sought edict-drafting posts and openly counted Chief Minister Li Fengji\'s faults.',
    idiomatic: 'On xinmao Li Ao was banished to Luzhou for attacking Li Fengji.',
  },
  s0172: {
    literal: 'On xinchou the Jiangxi observation commissioner Xue Fang died.',
    idiomatic: 'On xinchou Xue Fang died.',
  },
  s0173: {
    literal: 'On guimao Bureau of Appointments master, edict drafter Wang Fan was made Vice Censor-in-Chief.',
    idiomatic: 'On guimao Wang Fan became vice censor-in-chief.',
  },
  s0174: {
    literal: 'Third month, yisi new moon: Minister of War Guo Zhao was made Zizhou prefect and eastern Sichuan military commissioner.',
    idiomatic: 'On yisi Guo Zhao took eastern Sichuan.',
  },
  s0175: {
    literal: 'On renzi the Emperor feasted the ministers in the three halls.',
    idiomatic: 'On renzi the court feasted in the three halls.',
  },
  s0176: {
    literal: 'On wuchen night a meteor three zhang long issued from Purple Forbidden, entered the Muddy, and vanished.',
    idiomatic: 'On wuchen night a long meteor fell from Purple Forbidden.',
  },
  s0177: {
    literal: 'On xinwei the former Gui observation commissioner Yin You was made Jiangxi observation commissioner.',
    idiomatic: 'On xinwei Yin You took Jiangxi.',
  },
  s0178: {
    literal: 'The Emperor tested two hundred ninety-one examination candidates at Xuanzheng Hall; Secretariat drafter Zheng Han, Personnel Bureau master Cui Guan, and War Bureau master Li Yuzhong were made examination officers for the policy questions.',
    idiomatic: 'Jingzong tested 291 candidates at Xuanzheng with three examiners.',
  },
  s0179: {
    literal: 'Summer, fourth month, jiaxu new moon: Chief Minister Duke of Liang Li Fengji was advanced to Duke of Zheng.',
    idiomatic: 'On jiaxu Li Fengji became Duke of Zheng.',
  },
  s0180: {
    literal: 'Right Divine Strategy great general Kang Zhimu was made acting Minister of Works, concurrent Qing prefect, and Pinglu military commissioner.',
    idiomatic: 'Kang Zhimu took Pinglu.',
  },
  s0181: {
    literal: 'From the Secretariat: Remonstrance official Liu Qichu was made Vice Minister of Punishments.',
    idiomatic: 'Liu Qichu was announced Vice Minister of Punishments from the Secretariat.',
  },
  s0182: {
    literal: 'Direct Secretariat announcement of director and vice posts began with Qichu.',
    idiomatic: 'Direct Secretariat promotions began with Liu Qichu.',
  },
  s0183: {
    literal: 'Zheng Han and others examined the policy candidates.',
    idiomatic: 'Zheng Han\'s board graded the policy examination.',
  },
  s0184: {
    literal: 'Several days after the edict the Emperor told the chief ministers: "Wei Duanfu and Yang Lushi both draw public criticism; give them outer posts."',
    idiomatic: 'Days later Jingzong exiled two passed candidates for scandal.',
  },
  s0185: {
    literal: 'Duanfu was made Baishui sheriff; Lushi Chenggu sheriff.',
    idiomatic: 'Wei Duanfu went to Baishui; Yang Lushi to Chenggu.',
  },
  s0186: {
    literal: 'The chief ministers asked their crimes; no answer.',
    idiomatic: 'Premiers asked the charges and received silence.',
  },
  s0187: {
    literal: 'On guisi the ministers presented the honorific Civil and Martial Great Sage Broad Filial Emperor; he received the register at Xuanzheng Hall.',
    idiomatic: 'On guisi the court invested the Civil and Martial honorific.',
  },
  s0188: {
    literal: 'When the rites ended he ascended Danfeng Tower and proclaimed a great amnesty; capital crimes and below, regardless of severity, were all pardoned.',
    idiomatic: 'Danfeng amnesty followed, pardoning even capital crimes.',
  },
  s0189: {
    literal: 'At that time Li Shen was in demoted office.',
    idiomatic: 'Li Shen remained in exile.',
  },
  s0190: {
    literal: 'Li Fengji hated Shen and did not want him moved nearer; within the amnesty text he only said demoted officials already moved should be moved nearer — not that those not yet moved should be.',
    idiomatic: 'Li Fengji rigged the amnesty text to block Li Shen\'s recall.',
  },
  s0191: {
    literal: 'Hanlin academician Wei Chuhou submitted a memorial arguing: "You must not, for hatred between Li Shen and Fengji alone, leave recent exiles unmoved — that violates the principle of magnanimity."',
    idiomatic: 'Wei Chuhou protested that personal spite must not void amnesty for all exiles.',
  },
  s0192: {
    literal: 'The Emperor hastily ordered the amnesty text recalled and amended.',
    idiomatic: 'Jingzong ordered the amnesty text rewritten.',
  },
  s0193: {
    literal: 'On yihai the eastern Sichuan military commissioner, acting Minister of Works Li Jiang was made Left Vice Premier.',
    idiomatic: 'On yihai Li Jiang became left vice premier.',
  },
  s0194: {
    literal: 'Censor Xiao Che impeached Jingzhao prefect and concurrent Censor-in-Chief Cui Yuanlue for collecting seventeen thousand strings of capital-area remitted funds against the edict; the three offices investigated and found it true.',
    idiomatic: 'Xiao Che proved Cui Yuanlue illegally recollected remitted capital taxes.',
  },
  s0195: {
    literal: 'On xinchou an edict stripped Yuanlue of the concurrent Censor-in-Chief post.',
    idiomatic: 'On xinchou Cui Yuanlue lost the censorate.',
  },
  s0196: {
    literal: 'Fifth month, jiachen new moon: the former Pinglu military commissioner Xue Ping was made acting Left Vice Premier and concurrent Minister of Revenue.',
    idiomatic: 'On jiachen Xue Ping returned as left vice premier.',
  },
  s0197: {
    literal: 'Zhenwu army was granted one hundred forty thousand strings of cash to repair the eastern surrender city.',
    idiomatic: 'Zhenwu received 140,000 strings to rebuild the eastern surrender city.',
  },
  s0198: {
    literal: 'On gengxu he visited Fish-Abundance Palace to watch the dragon-boat races.',
    idiomatic: 'On gengxu Jingzong watched boat races at Fish-Abundance Palace.',
  },
  s0199: {
    literal: 'On gengshen at regular court envoys installed the Nine-Surname Uighur Dengliluomomisipijializhaoli Kehan.',
    idiomatic: 'On gengshen the Uighur khan was invested at court.',
  },
  s0200: {
    literal: 'On bingyin the retired heir-apparent Junior Preceptor Yan Jimei died.',
    idiomatic: 'On bingyin Yan Jimei died.',
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
