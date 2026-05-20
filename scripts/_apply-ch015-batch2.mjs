#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Jiutangshu ch.015, Xianzong 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/015.json';
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
    literal: "On yiyou Fang Qi, Yong-Guan pacification commissioner, was made Gui observation commissioner; Dou Qun, Kai prefect, was made Yong-Guan pacification commissioner.",
    idiomatic: "On yiyou Fang Qi took Gui and Dou Qun took Yong-Guan.",
  },
  s0102: {
    literal: "On bingxu, because money was heavy and goods light, 500,000 strings were taken from the treasury and the two Ever-Normal granaries were ordered to buy cloth and silk; each bolt was marked up one-tenth above the old valuation.",
    idiomatic: "On bingxu the court spent 500,000 strings to buy cloth and stabilize prices.",
  },
  s0103: {
    literal: "Yan-Fang observation commissioner Yuan Yifang died; on xinmao Xue Bei was made Yan-Fang observation commissioner.",
    idiomatic: "Yuan Yifang died; Xue Bei succeeded him in Yan-Fang.",
  },
  s0104: {
    literal: "On yiwei a pig in Chang'an's western market bore three ears, eight legs, and two tails.",
    idiomatic: "On yiwei a monstrous pig was reported in the western market.",
  },
  s0105: {
    literal: "Monk Jianxu took a bribe of forty-five thousand strings from Gao Chongwen for Grand Councillor Du Huangchang, jointly introducing the man Wu Ping of Yongle county; payment was given to Huangchang's son Zai.",
    idiomatic: "Monk Jianxu bribed Du Huangchang through Gao Chongwen's forty-five thousand strings.",
  },
  s0106: {
    literal: "An edict exiled Wu Ping to Zhaozhou; Huangchang and Chongwen were already dead, so the money used was not to be investigated, and Du Zai was released.",
    idiomatic: "Wu Ping was exiled; the dead men's bribes went uninvestigated and Du Zai was freed.",
  },
  s0107: {
    literal: "On xinhai Weibo's Tian Hongzheng was granted 200,000 strings to buy army grain.",
    idiomatic: "On xinhai Tian Hongzheng received 200,000 strings for grain.",
  },
  s0108: {
    literal: "On gengshen Hedong intendant Zhang Hongjing memorialized repair of the ancient Shun city.",
    idiomatic: "On gengshen Zhang Hongjing proposed restoring ancient Shun city.",
  },
  s0109: {
    literal: "Sixth month, xinsi new moon.",
    idiomatic: "The sixth month opened on xinsi.",
  },
  s0110: {
    literal: "Rain had accumulated; Yanying Hall did not open for fifteen days.",
    idiomatic: "Heavy rains kept the emperor from Yanying audiences for fifteen days.",
  },
  s0111: {
    literal: "That day the Emperor said to the chief ministers: \"Hereafter, every three days, come for audience even if it rains.\"",
    idiomatic: "That day he ordered ministers to attend every three days regardless of rain.",
  },
  s0112: {
    literal: "On yiyou retired Minister of Works Pei Ji died.",
    idiomatic: "On yiyou Pei Ji died in retirement.",
  },
  s0113: {
    literal: "On bingxu Han Gao, Eastern Capital guardian, was made acting Minister of Personnel, concurrent Xu prefect, and Zhongwu army military commissioner.",
    idiomatic: "On bingxu Han Gao took Zhongwu with acting personnel rank.",
  },
  s0114: {
    literal: "On gengyin the capital suffered great wind and rain; houses were destroyed and tiles blown away; many people were crushed to death.",
    idiomatic: "On gengyin a capital storm killed many under collapsed roofs.",
  },
  s0115: {
    literal: "Everywhere rivers and streams swelled violently; travelers could not pass.",
    idiomatic: "Flooded roads halted travel across the region.",
  },
  s0116: {
    literal: "On xinchou two hundred cartloads of palace women were released to go where they wished, because of the flood disaster.",
    idiomatic: "On xinchou two hundred cartloads of palace women were freed after the floods.",
  },
  s0117: {
    literal: "On renyin chief ministers Wu Yuanheng, Li Jifu, and Li Jiang, and former ministers Zheng Yuqing and Quan Deyu each received an edict to present old poems.",
    idiomatic: "On renyin the emperor ordered several ministers to submit old poems.",
  },
  s0118: {
    literal: "Autumn, seventh month, xinhai new moon.",
    idiomatic: "The seventh month opened on xinhai.",
  },
  s0119: {
    literal: "On guichou Quan Deyu was made acting Minister of Personnel and Eastern Capital guardian.",
    idiomatic: "On guichou Quan Deyu became Luoyang guardian with personnel rank.",
  },
  s0120: {
    literal: "On dingmao Li Guangjin, Zhenwu military commissioner, was made Administrator of Ling prefecture and Lingwu military commissioner.",
    idiomatic: "On dingmao Li Guangjin took Lingwu.",
  },
  s0121: {
    literal: "On guiyou the Emperor ordered Palace Commander Peng Zhongxian to repair Xingtang Abbey; its layout was grand; north it faced the forbidden city; a restored passage was opened for imperial processions.",
    idiomatic: "On guiyou Peng Zhongxian rebuilt Xingtang Abbey with a passage to the palace.",
  },
  s0122: {
    literal: "That night the moon drew near the Five Feudatories.",
    idiomatic: "That night the moon neared the Five Feudatories.",
  },
  s0123: {
    literal: "On dingchou newly appointed Gui observation commissioner Fang Qi was demoted to Vice Director of the Imperial Stud.",
    idiomatic: "On dingchou Fang Qi was demoted from Gui.",
  },
  s0124: {
    literal: "When Qi first received Gui, Qi's clerk bribed the Ministry clerk in charge and privately obtained the commission document to give Qi.",
    idiomatic: "Fang Qi's clerk had bribed the Ministry for an early commission.",
  },
  s0125: {
    literal: "Soon an edict ordered a palace envoy to deliver the patent to Qi, saying: \"You have held it five days already.\"",
    idiomatic: "The throne then sent the real patent: Qi had held a forged one for five days.",
  },
  s0126: {
    literal: "The Emperor was angry, caned the Ministry clerks, fined the bureau directors, and Qi was immediately demoted.",
    idiomatic: "The emperor punished the Ministry and demoted Qi.",
  },
  s0127: {
    literal: "Ma Zong, Protector-General of Annan, was made Gui observation commissioner; Zhang Kan, Jiang prefect, was made Protector-General of Annan and pacification commissioner of the circuit.",
    idiomatic: "Ma Zong took Gui; Zhang Kan took Annan.",
  },
  s0128: {
    literal: "Yan-Fang observation commissioner Xue Bei died.",
    idiomatic: "Xue Bei died in Yan-Fang.",
  },
  s0129: {
    literal: "Eighth month, xinsi new moon.",
    idiomatic: "The eighth month opened on xinsi.",
  },
  s0130: {
    literal: "On guiwei Pei Xingli, Qi prefect, was made Protector-General of Annan and pacification commissioner of the circuit, because Zhang Kan was aged.",
    idiomatic: "On guiwei Pei Xingli replaced the aged Zhang Kan in Annan.",
  },
  s0131: {
    literal: "On dinghai Pei Wu, Minister of Agriculture, was made Yan-Fang observation commissioner.",
    idiomatic: "On dinghai Pei Wu took Yan-Fang.",
  },
  s0132: {
    literal: "On jiawu an edict: the descendants of the ten families who destroyed their households to serve the state, such as former Xuzhou prefect Li Wei, were all to be selected and rewarded.",
    idiomatic: "On jiawu descendants of loyal martyrs were ordered rewarded.",
  },
  s0133: {
    literal: "On jiawu Venus drew near the Chariot.",
    idiomatic: "On jiawu Venus neared the Chariot constellation.",
  },
  s0134: {
    literal: "On xinchou Pan Mengyang, Dongchuan military commissioner, was made Vice Minister of Revenue overseeing fiscal affairs; Lu Tan was made Zi prefect and Dongchuan military commissioner.",
    idiomatic: "On xinchou Pan Mengyang entered revenue; Lu Tan took Dongchuan.",
  },
  s0135: {
    literal: "On yisi the Heavenly Martial Army was abolished and merged into the Divine Strategy Army.",
    idiomatic: "On yisi the Heavenly Martial Army was absorbed into the Divine Strategy.",
  },
  s0136: {
    literal: "Ninth month, gengxu new moon.",
    idiomatic: "The ninth month opened on gengxu.",
  },
  s0137: {
    literal: "On bingchen Li Shidao of Ziqing presented twelve hawks; an order returned them.",
    idiomatic: "On bingchen Li Shidao's hawks were sent back.",
  },
  s0138: {
    literal: "On wuwu the court granted the ministers a banquet at Qujiang.",
    idiomatic: "On wuwu the court feasted ministers at Qujiang.",
  },
  s0139: {
    literal: "On yichou an edict: \"We have heard that the five Guangnan circuits and Fujian, Qianzhong, and similar routes often feed people from the south as gifts and trade them everywhere, tearing families apart and blurring free and bond.\"",
    idiomatic: "An edict condemned selling southern people as gifts across Lingnan and Fujian.",
  },
  s0140: {
    literal: "Hereafter this is strictly forbidden; violators' chief officials will certainly be punished.\"",
    idiomatic: "Violators' superiors would be punished. Thus ended the edict.",
  },
  s0141: {
    literal: "Huaixi's Wu Shaoyang presented three hundred horses.",
    idiomatic: "Wu Shaoyang of Huaixi sent three hundred horses.",
  },
  s0142: {
    literal: "On bingyin an edict: \"Commuting death to frontier service was a fine policy of former ages; measuring distance, there are also conveniences.\"",
    idiomatic: "On bingyin an edict praised commuting death to frontier service.",
  },
  s0143: {
    literal: "Hereafter in the two capitals, Guannei, Henan, Hedong, Hebei, Huainan, and Shannan East and West circuits, except for great felonies, light offenders may not be exiled to the Tiantede Five Cities.\"",
    idiomatic: "Light crimes in the heartland could no longer be exiled to the far northwest garrisons.",
  },
  s0144: {
    literal:
      'Thus ended the edict. On wuchen Remonstrance-and-Admonition Gentleman Dou Yizhi was made Shan-Guo defense commissioner and granted gold and purple.',
    idiomatic:
      'Thus ended the edict; on wuchen Dou Yizhi took Shan-Guo with gold-purple rank.',
  },
  s0145: {
    literal: "On wuchen Dou Yizhi, supervising secretary, was made Shan-Guo defense commissioner and was also granted gold and purple.",
    idiomatic: "On wuchen Dou Yizhi took Shan-Guo with gold-purple rank.",
  },
  s0146: {
    literal: "On renshen Yu Di, tutor of the Prince of En, was made Crown Prince Guest.",
    idiomatic: "On renshen Yu Di became crown prince guest.",
  },
  s0147: {
    literal: "Former Shuofang Ling-Salt military commissioner Wang Bi was made Right Guard general.",
    idiomatic: "Wang Bi became Right Guard general.",
  },
  s0148: {
    literal: "When ministers and generals entered or left office, the Hanlin drafted the commission — called white hemp.",
    idiomatic: "Hanlin white-hemp drafts had marked ministerial commissions.",
  },
  s0149: {
    literal: "When it reached Wang Bi, he memorialized to end Secretariat drafting, and it became precedent.",
    idiomatic: "Wang Bi ended Secretariat drafting of such commissions, establishing precedent.",
  },
  s0150: {
    literal: "The Imperial Ancestral Temple resumed use of the great drum in practice music.",
    idiomatic: "Court music again used the great drum.",
  },
  s0151: {
    literal: "Winter, tenth month, gengchen new moon.",
    idiomatic: "The tenth month opened on gengchen.",
  },
  s0152: {
    literal: "On jichou Mars drew near the southern head star of the Supreme Palace's western rampart.",
    idiomatic: "On jichou Mars neared the Supreme Palace rampart.",
  },
  s0153: {
    literal: "On gengyin Liu Gongchuo, Hunan observation commissioner, was made Yue-E-Min-Qi-An-Huang observation commissioner.",
    idiomatic: "On gengyin Liu Gongchuo took the middle Yangzi circuits.",
  },
  s0154: {
    literal: "On xinmao Zhu Zhongliang, Jingyuan military commissioner, died.",
    idiomatic: "On xinmao Zhu Zhongliang died.",
  },
  s0155: {
    literal: "On renchen Han Hong of Bianzhou presented his compiled Sacred Dynasty Ten-Thousand Years Music Score, three hundred pieces in all.",
    idiomatic: "On renchen Han Hong presented three hundred court music pieces.",
  },
  s0156: {
    literal: "On jisi Vice Director of the Imperial Clan Li Daogu was made Qianzhong observation commissioner; Zhang Zhengfu, Suzhou prefect, was made Hunan observation commissioner.",
    idiomatic: "On jisi Li Daogu took Qianzhong and Zhang Zhengfu took Hunan.",
  },
  s0157: {
    literal: "On bingxu heavy snow cancelled court; some people froze and fell; sparrows and mice died in great numbers.",
    idiomatic: "On bingxu snow closed court and killed birds and people.",
  },
  s0158: {
    literal: "On wuxu Su Guangrong, Pujun town commissioner of the Divine Strategy, was made Jing prefect and Four Garrisons Northern March Jingyuan military commissioner.",
    idiomatic: "On wuxu Su Guangrong took Jingyuan.",
  },
  s0159: {
    literal: "Hanlin academician and Bureau of Appointments Vice Director Wei Hongjing kept his original office — for drafting Su Guangrong's commission and omitting narration of merit.",
    idiomatic: "Wei Hongjing kept his post despite omitting Su Guangrong's merits in the draft.",
  },
  s0160: {
    literal: "On renchen Zhenwu reported a thousand Uyghur horsemen reached Pelican Spring.",
    idiomatic: "On renchen Zhenwu reported a thousand Uyghur riders at Pelican Spring.",
  },
  s0161: {
    literal: "Eleventh month, gengxu new moon.",
    idiomatic: "The eleventh month opened on gengxu.",
  },
  s0162: {
    literal: "On bingchen Pei Ciyuan, Fujian observation commissioner, was made Henan intendant.",
    idiomatic: "On bingchen Pei Ciyuan became Henan intendant.",
  },
  s0163: {
    literal: "On bingyin Yanzhou was placed under Xiazhou.",
    idiomatic: "On bingyin Yanzhou was subordinated to Xia.",
  },
  s0164: {
    literal: "From Xiazhou to Fengzhou, eight post stations were first established.",
    idiomatic: "Eight relay stations were opened from Xia to Feng.",
  },
  s0165: {
    literal: "On dingmao Xue Qian, Si prefect, was made Fujian observation commissioner.",
    idiomatic: "On dingmao Xue Qian took Fujian.",
  },
  s0166: {
    literal: "Right Dragon Martial commander-in-chief Liu Changyi died.",
    idiomatic: "Liu Changyi died.",
  },
  s0167: {
    literal: "On guiyou Zhaoyi's Xi Shimei memorialized that all armies drew rations at Linming.",
    idiomatic: "On guiyou Xi Shimei reported armies feeding at Linming.",
  },
  s0168: {
    literal: "In the capital region water, drought, and frost damaged 38,000 qing of fields.",
    idiomatic: "The capital region lost 38,000 qing to flood, drought, and frost.",
  },
  s0169: {
    literal: "Twelfth month, gengchen new moon — Li Qian, Jingzhao intendant, was made Yan-Fang observation commissioner; Pei Wu entered as Jingzhao intendant in his stead.",
    idiomatic: "Li Qian went to Yan-Fang; Pei Wu became Jingzhao intendant.",
  },
  s0170: {
    literal: "On xinsi an edict: \"Estates, mills, shops, carriage yards, and gardens granted to princes, princesses, and officials may be pawned or sold; their tax levies shall then be collected by prefecture and county.\"",
    idiomatic: "On xinsi granted estates and shops could be sold and taxes routed to local government.",
  },
  s0171: {
    literal: "An edict: \"Zhang Maozhao of Hebei stood loyal, brought his clan to court, and his righteous valor is recorded in history.\"",
    idiomatic: "An edict praised Zhang Maozhao's Hebei loyalty.",
  },
  s0172: {
    literal: "We hear that after his death his household had no surplus wealth; recalling his old merit, a special exception is made — yearly grant of two thousand bolts of silk, paid spring and autumn.\"",
    idiomatic: "His heirs were granted two thousand bolts of silk yearly in spring and autumn.",
  },
  s0173: {
    literal: "The ministers submitted a memorial requesting that Virtuous Consort Guo be established as empress.",
    idiomatic: "Ministers petitioned to make Virtuous Consort Guo empress.",
  },
  s0174: {
    literal: "On bingxu Ma Zong, Gui observation commissioner, was made Guang prefect and Lingnan military commissioner; Yong-Guan pacification commissioner Cui Yong was made Gui observation commissioner.",
    idiomatic: "On bingxu Ma Zong took Lingnan and Cui Yong took Gui.",
  },
  s0175: {
    literal: "On gengyin Ma Pingyang, Qi prefect, was made Yong-Guan pacification commissioner.",
    idiomatic: "On gengyin Ma Pingyang took Yong-Guan.",
  },
  s0176: {
    literal: "Zhenwu army mutinied, drove out its commander Li Jinxian, and slaughtered his household.",
    idiomatic: "Zhenwu mutinied, expelling Li Jinxian and killing his family.",
  },
  s0177: {
    literal: "Then Xia military commissioner Zhang Xu replaced Jinxian, leading two thousand troops to the post, with authority to strike and execute as expedient.",
    idiomatic: "Zhang Xu was sent with two thousand men and discretionary power to punish.",
  },
  s0178: {
    literal: "On bingwu Tian Jin, Golden Guard general, was made Xia prefect and Xia-Sui-Yin military commissioner.",
    idiomatic: "On bingwu Tian Jin took Xia-Sui-Yin.",
  },
  s0179: {
    literal: "Because the Yellow River overflowed and flooded half of Hua prefecture's Sheep-Horse City, Xue Ping of Hua and Tian Hongzheng of Weibo conscripted ten thousand laborers at the Liyang border to open the ancient Yellow River channel — fourteen li north-south, sixty paces east-west wide, one zhang seven chi deep — diverting the old current; the people of Hua were thereafter without flood harm.",
    idiomatic: "Floods at Hua were eased when Ping and Hongzheng reopened an ancient Yellow River channel.",
  },
  s0180: {
    literal: "Yuanhe 9 — In spring of Yuanhe 9, first month, jiyou new moon.",
    idiomatic: "Yuanhe 9 opened on jiyou.",
  },
  s0181: {
    literal: "On yimao great fog and snow.",
    idiomatic: "On yimao fog and snow blanketed the capital.",
  },
  s0182: {
    literal: "Li Jifu repeatedly memorialized to resign the chief ministership; it was not permitted.",
    idiomatic: "Li Jifu's resignations were refused.",
  },
  s0183: {
    literal: "On yihai Zhang Xu entered the Shanyu Protectorate headquarters and executed the mutineer Su Guozhen and 252 others.",
    idiomatic: "On yihai Zhang Xu executed 252 Zhenwu mutineers.",
  },
  s0184: {
    literal: "Second month, jimao new moon — Vice Minister of Revenue Pan Mengyang overseeing fiscal affairs was also made commissioner of the five northern capital garrison farms.",
    idiomatic: "Pan Mengyang also took northern garrison farms.",
  },
  s0185: {
    literal: "On dingchou former Zhenwu military commissioner Gu Jinxian was demoted to Tong prefect; supervising commissioner Lu Chaojian was assigned labor at Dingling.",
    idiomatic: "On dingchou Gu Jinxian was demoted and Lu Chaojian punished.",
  },
  s0186: {
    literal: "On dingwei an edict: because of yearly famine, arrears of rent and grain in Guannei before Yuanhe 8 were remitted, and 300,000 shi from Ever-Normal and Charity granaries were distributed.",
    idiomatic: "On dingwei famine amnesty and 300,000 shi of relief were ordered.",
  },
  s0187: {
    literal: "On bingshen Zhenwu was granted twenty thousand bolts of silk.",
    idiomatic: "On bingshen Zhenwu received twenty thousand bolts of silk.",
  },
  s0188: {
    literal: "On dingyou the moon drew near Antares.",
    idiomatic: "On dingyou the moon neared Antares.",
  },
  s0189: {
    literal: "On guimao a decree made Li Jiang, Court Counsel Grand Master, acting Vice Director of the Secretariat, concurrent Grand Councillor, Pillar of State, Baron of Gaoyi, continue as Minister of Rites — because he had repeatedly memorialized to resign the chief ministership.",
    idiomatic: "On guimao Li Jiang left the council but kept Rites after repeated resignations.",
  },
  s0190: {
    literal: "Third month, jiyou new moon.",
    idiomatic: "The third month opened on jiyou.",
  },
  s0191: {
    literal: "On bingchen Xi prefecture earthquake — eighty shocks day and night; more than a hundred were crushed to death.",
    idiomatic: "On bingchen a Xi earthquake killed over a hundred.",
  },
  s0192: {
    literal: "On gengshen the sorcerer Liang Shugao came from Guangzhou and gave a book to Vice Minister of Personnel Yang Yuling, asking to be made his aide.",
    idiomatic: "On gengshen a Guangzhou sorcerer tried to enlist Yang Yuling.",
  },
  s0193: {
    literal: "Yuling seized him and reported; he was killed.",
    idiomatic: "Yang Yuling arrested and executed him.",
  },
  s0194: {
    literal: "On xinyou Crown Prince Junior Tutor Zheng Yuqing was made acting Right Vice Premier, Xingyuan intendant, and Shannan West military commissioner, replacing Zhao Zongru as Censor-in-Chief.",
    idiomatic: "On xinyou Zheng Yuqing took Shannan West and the censorate.",
  },
  s0195: {
    literal: "On dingmao frost killed mulberry trees.",
    idiomatic: "On dingmao late frost destroyed mulberries.",
  },
  s0196: {
    literal: "Summoned to audience before Linde Hall Pei Tangdi's son Sun and former Zhaoying Director Du Shifang's son Bian; each was granted scarlet robes and permitted to marry princesses.",
    idiomatic: "Two sons of high officials were summoned and permitted imperial marriages.",
  },
  s0197: {
    literal: "Summer, fourth month, wuyin new moon.",
    idiomatic: "The fourth month opened on wuyin.",
  },
  s0198: {
    literal: "On gengyin an edict: posthumous Grand Preceptor Prince Xianning Hun Zhen was to be enshrined in Dezong's temple.",
    idiomatic: "On gengyin Hun Zhen was ordered enshrined with Dezong.",
  },
  s0199: {
    literal: "Fifth month, dingwei new moon — Zheng Yin, Lingnan military commissioner, was made Minister of Works.",
    idiomatic: "In the fifth month Zheng Yin became Minister of Works.",
  },
  s0200: {
    literal: "On gengshen Youzhou was moved to the pacification army; below the fort Yan'en county was established, subordinate to the Xia observation commissioner. That month drought made grain dear; 700,000 shi from the Great Granary were opened at six sale sites to succor the hungry.",
    idiomatic: "Youzhou was moved; drought grain sales from the Great Granary fed the hungry.",
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
