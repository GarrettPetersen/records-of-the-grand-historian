#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.013, Dezong 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/013.json';
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
    literal: "Dezong 2 — On the first day of the first month of Zhenyuan 4, gengxu new moon, the Emperor ascended Danfeng Tower and decreed: \"I am of slight virtue, enthroned above kings and dukes, reverently inheriting Heaven-and-earth's order and devoutly observing the ancestors' teachings, pondering remote supreme principle, thinking to attain great harmony.\"",
    idiomatic: "Dezong 2 — First month, Zhenyuan 4, gengxu new moon: the Emperor took Danfeng Tower and issued an edict lamenting his thin merit yet heavy throne, his wish for universal harmony.",
  },
  s0002: {
    literal: "Yet sincerity had not moved things; transformation had not softened the distant; civilizing instruction still stifled; levies remained heavy.",
    idiomatic: "His sincerity had not touched the realm; taxes and distant peoples alike still suffered.",
  },
  s0003: {
    literal: "Recently, striving to settle the people, he had not feared humbling himself, concluding friendship with the Western Tibetans and pledging alliance.",
    idiomatic: "He had lately humbled himself to make peace with Tibet.",
  },
  s0004: {
    literal: "Yet the barbarians' hearts were insatiable; they betrayed faith and injured trust, seized officials and commoners, and repeatedly violated the borders — what guilt had the masses? All was the Emperor's fault.",
    idiomatic: "Tibet broke faith, raided the frontier, and seized subjects — blame he laid on himself alone.",
  },
  s0005: {
    literal: "Then beneath the imperial carriage violent men had plotted; Heaven's grace had aided, and all were executed of themselves; punishment to stop killing — surely not undertaken willingly.",
    idiomatic: "Recent sedition at the capital had been crushed; executions, he said, were a grim necessity.",
  },
  s0006: {
    literal: "Now the three yangs spread harmony and the myriad things begin — he wished with dukes and ministers and the myriad people to renew governance; it was fitting to spread pardoning grace and extend the merit of releasing bonds.",
    idiomatic: "With spring's return he sought a new start and a broad amnesty.",
  },
  s0007: {
    literal: "A great amnesty of the empire was permitted; crimes down to great execution were all pardoned and removed.",
    idiomatic: "He ordered a general amnesty through capital crimes.",
  },
  s0008: {
    literal: "That day at dawn the balustrades of the steps before Hanyuan Hall were damaged in more than thirty bays; more than ten guards were crushed to death.",
    idiomatic: "At dawn the Hanyuan steps collapsed, killing a dozen guards.",
  },
  s0009: {
    literal: "The capital quaked; on xinhai it quaked again; on renzi again.",
    idiomatic: "Chang'an shook; quakes followed on xinhai and renzi.",
  },
  s0010: {
    literal: "On renxu Left Dragon Martial Grand General Wang Qiyao was made Lin prefect, Bin prefect, and commissioner of Bin, Fang, Dan, and Yan.",
    idiomatic: "On renxu Wang Qiyao became commissioner of Bin-Fang-Dan-Yan.",
  },
  s0011: {
    literal: "On dingmao the capital quaked; on wuchen again; on gengwu again.",
    idiomatic: "Earthquakes struck the capital on dingmao, wuchen, and gengwu.",
  },
  s0012: {
    literal: "Xuanwu circuit field commissioner Liu Chang was made Jing prefect and commissioner of the Four Garrisons, Northern Court field army, Jingyuan, and related prefectures.",
    idiomatic: "Liu Chang left Xuanwu for Jingyuan command.",
  },
  s0013: {
    literal: "On guiyou the capital quaked.",
    idiomatic: "On guiyou another capital quake.",
  },
  s0014: {
    literal: "On jiaxu Hua prefecture Tong Pass commissioner Li Yuanliang was made concurrent Longyou commissioner and Lintao army commander.",
    idiomatic: "On jiaxu Li Yuanliang added Longyou and Lintao.",
  },
  s0015: {
    literal: "On yihai there was an earthquake; Jin and Fang were worst; rivers overflowed and mountains split; many dwellings were ruined; people camped in the open.",
    idiomatic: "On yihai a severe quake wrecked houses from Jin to Fang; refugees slept outdoors.",
  },
  s0016: {
    literal: "At Chenliu wood rained like a large finger, more than an inch long, with holes through the center, falling and planting in the ground — in all about ten li.",
    idiomatic: "Chenliu saw stick-like rain-wood pierce the ground for ten li.",
  },
  s0017: {
    literal: "On xinsi Li Mi, finding capital officials' salaries thin, requested taking the chumo money from internal and external disbursements, one-tenth of vacant-office salary, quota inner-office salary, and prefectural saber-bearers' and staff salaries, stored in a separate Treasury vault for capital monthly pay, with Vice Censor-in-Chief Dou Can in charge.",
    idiomatic: "On xinsi Li Mi funded capital salaries from miscellaneous fees, with Dou Can as custodian.",
  },
  s0018: {
    literal: "The year yielded three million strings, called the Treasury Separate Reserve; court salaries did not exceed five hundred thousand, and more than two million regularly supplied state use.",
    idiomatic: "The fund brought three million strings yearly; two million surplus remained for the state.",
  },
  s0019: {
    literal: "On renwu there was an earthquake; on jiashen again; on yiyou again; on bingchen again.",
    idiomatic: "Quakes recurred on renwu, jiashen, yiyou, and bingchen.",
  },
  s0020: {
    literal: "On jiachen the suburban ox of the Grand Stud bore a six-footed calf; a pig also bore two heads and four feet.",
    idiomatic: "On jiachen a six-legged calf and a two-headed pig were born.",
  },
  s0021: {
    literal: "The elevated passage north of Yanxi Gate was built to reach Yongchun Gate.",
    idiomatic: "A covered walk linked Yanxi and Yongchun gates.",
  },
  s0022: {
    literal: "Jingyuan's Liu Chang rebuilt Lianyun Fort.",
    idiomatic: "Liu Chang restored Lianyun Fort on the Jing frontier.",
  },
  s0023: {
    literal: "On wuchen a deer entered a capital market gate.",
    idiomatic: "On wuchen a deer wandered into the city markets.",
  },
  s0024: {
    literal: "On jiayin there was an earthquake.",
    idiomatic: "On jiayin the earth shook again.",
  },
  s0025: {
    literal: "He feasted the ministers at Linde Hall, set the Nine Sections music, and palace dancing horses were brought out; the Emperor composed one stanza and the ministers matched it.",
    idiomatic: "At Linde he banqueted the court with Nine Sections music and dancing horses, trading poems with his ministers.",
  },
  s0026: {
    literal: "On jiwei there was an earthquake.",
    idiomatic: "On jiwei another quake.",
  },
  s0027: {
    literal: "The relevant office memorialized reducing offices; for Left and Right Regular Attendants and Crown Prince Guests they asked to restore the former four posts each — approved.",
    idiomatic: "Regular Attendants and Crown Prince Guests were restored to four posts each.",
  },
  s0028: {
    literal: "On gengwu there was an earthquake.",
    idiomatic: "On gengwu the capital shook again.",
  },
  s0029: {
    literal: "An edict: Jingyuan's Liu Chang should bury at Qianshui Plain the bones of officers and soldiers killed at the Pingliang parley site in two mounds, erect stone markers, and inscribe them \"Mounds of Cherished Loyalty.\"",
    idiomatic: "Liu Chang was ordered to bury Pingliang's dead at Qianshui in the \"Mounds of Cherished Loyalty.\"",
  },
  s0030: {
    literal: "On xinwei there was an earthquake.",
    idiomatic: "On xinwei another earthquake.",
  },
  s0031: {
    literal: "At the Secretariat a parasol tree had magpies building a nest with mud.",
    idiomatic: "Magpies nested in mud on a parasol tree at the Secretariat.",
  },
  s0032: {
    literal: "On guisi Crown Prince Left Senior Mentor Chang Yue was made Guilin circuit observer.",
    idiomatic: "On guisi Chang Yue became Guilin observer.",
  },
  s0033: {
    literal: "Left and Right Archer-Guards were renamed Left and Right Divine Awe Armies.",
    idiomatic: "The Archer-Guards were retitled the Divine Awe Armies.",
  },
  s0034: {
    literal: "Fujian troops mutinied and expelled observer Wu Shen.",
    idiomatic: "Fujian soldiers drove out observer Wu Shen.",
  },
  s0035: {
    literal: "On dingwei Longyou's Li Yuanliang built Liangyuan city.",
    idiomatic: "On dingwei Li Yuanliang built Liangyuan.",
  },
  s0036: {
    literal: "On dingsi Right Dragon Martial commander-in-chief Zhang Boyi died.",
    idiomatic: "On dingsi Zhang Boyi died.",
  },
  s0037: {
    literal: "On xinyou Ji prefect Zhang Ting was made Protector-General of Annan and circuit commissioner.",
    idiomatic: "On xinyou Zhang Ting took Annan.",
  },
  s0038: {
    literal: "Yan prefecture was promoted to a great metropolitan prefecture.",
    idiomatic: "Yanzhou became a metropolitan prefecture.",
  },
  s0039: {
    literal: "On renxu eight Remonstrating Censors were added — four of the Secretariat as Right, four of the Chancellery as Left.",
    idiomatic: "On renxu eight censor posts were added, split between Secretariat and Chancellery.",
  },
  s0040: {
    literal: "Acting Left Senior Mentor Xiao Fu died at Raozhou.",
    idiomatic: "Xiao Fu died in exile at Raozhou.",
  },
  s0041: {
    literal: "On bingyin there was an earthquake; on dingmao again.",
    idiomatic: "Earthquakes on bingyin and dingmao.",
  },
  s0042: {
    literal: "The moon infringed Jupiter.",
    idiomatic: "The moon crossed Jupiter.",
  },
  s0043: {
    literal: "On xinwei Crown Prince Guest Wu Cou was made Fujian observer.",
    idiomatic: "On xinwei Wu Cou became Fujian observer.",
  },
  s0044: {
    literal: "On yihai Mars, Jupiter, and Saturn gathered in Yingshi — in all twenty days.",
    idiomatic: "For twenty days Mars, Jupiter, and Saturn stood in Yingshi.",
  },
  s0045: {
    literal: "That month Tibet raided Jing, Bin, Ning, Qing, and Bin prefectures, burned Pengyuan county, and frontier generals shut their cities to hold fast.",
    idiomatic: "Tibet raided the northwest, burning Pengyuan while garrisons closed their walls.",
  },
  s0046: {
    literal: "The bandits drove off more than thirty thousand head of men and beasts; after about twenty days they withdrew.",
    idiomatic: "They carried off thirty thousand people and animals, then withdrew after twenty days.",
  },
  s0047: {
    literal: "Tibetan raids usually came in autumn and winter; now they came in great heat — Chinese who had fallen to Tibet guided them.",
    idiomatic: "A midsummer raid showed defectors were guiding Tibet.",
  },
  s0048: {
    literal: "Sixth month, dingchou: E-Yue observer Li Song died.",
    idiomatic: "In the sixth month Li Song of E-Yue died.",
  },
  s0049: {
    literal: "On yiyou Left Vice Minister of the Secretariat Du You was made Shaan prefect and Shaan-Guo observer.",
    idiomatic: "On yiyou Du You became Shaan-Guo commissioner.",
  },
  s0050: {
    literal: "The recluse of Xia county, first appointed Drafting Editor Yang Cheng, was summoned as Remonstrating Censor.",
    idiomatic: "Yang Cheng, a Xia recluse lately made editor, was called to the censorate.",
  },
  s0051: {
    literal: "Cheng came to the palace in brown clothes; the Emperor bestowed court robes and then summoned him.",
    idiomatic: "He arrived in homespun; the throne gave him robes before audience.",
  },
  s0052: {
    literal: "On yichou Guilin defense-and-observation commissioner Chang Yue died.",
    idiomatic: "On yichou Chang Yue died in Guilin.",
  },
  s0053: {
    literal: "On yiwei Remonstrating Censor He Shigan was made united training-and-observation commissioner of E, Yue, Mian, Qi, and Huang.",
    idiomatic: "On yiwei He Shigan took E-Yue and neighboring circuits.",
  },
  s0054: {
    literal: "On yihai imperial sons and younger imperial brothers — seven including Prince of Yong, Zhen — were enfeoffed princes, with concurrent minister, supervisor, and libationer posts.",
    idiomatic: "On yihai seven princes and imperial brothers received titles and concurrent court posts.",
  },
  s0055: {
    literal: "On guimao Mars moved retrograde into the Feathered Forest.",
    idiomatic: "On guimao Mars retrograded into the Feathered Forest.",
  },
  s0056: {
    literal: "Seventh month, gengxu: Left Golden Guards general Zhang Xianfu was made Binning commissioner;",
    idiomatic: "Seventh month, gengxu: Zhang Xianfu took Binning;",
  },
  s0057: {
    literal: "Chen-Xu defense army commander Han Quanyi was made acting Minister of Works and commissioner of the Changwu city and related field armies.",
    idiomatic: "Han Quanyi became acting Works minister and Changwu commissioner.",
  },
  s0058: {
    literal: "On guichou the Binning army, because Han Yougui was replaced, feared Zhang Xianfu's severity; while leaderless they plundered greatly and coerced Army Supervisor Yang Mingyi to memorialize for Fan Xichao as commander.",
    idiomatic: "Binning troops rioted when Yougui left, demanding Fan Xichao over the stern Xianfu.",
  },
  s0059: {
    literal: "Chief commandant Yang Chaocheng beheaded more than two hundred ringleaders before order was restored.",
    idiomatic: "Yang Chaocheng killed two hundred mutineers to restore order.",
  },
  s0060: {
    literal: "The court still ordered Xichao as Xianfu's deputy.",
    idiomatic: "The court made Xichao Xianfu's deputy.",
  },
  s0061: {
    literal: "On jiwei the Xi and Shiwei raided Zhenwu army.",
    idiomatic: "On jiwei Xi and Shiwei hit Zhenwu.",
  },
  s0062: {
    literal: "On renxu an edict: Grand Preceptor, Secretariat Director, Prince of Xiping Li Sheng's eldest son Yuan was made Silver-Green Glory Grandee, Crown Prince Guest, with superior merit pillar of state, and halberds at Sheng's gate like the imperial clan.",
    idiomatic: "On renxu Li Sheng's son Yuan received high rank and gate halberds.",
  },
  s0063: {
    literal: "On yichou former Fu prefect Dai Shulun was made Rong prefect, concurrent Vice Censor-in-Chief, and circuit commissioner.",
    idiomatic: "On yichou Dai Shulun took Rong with a censor's seal.",
  },
  s0064: {
    literal: "On dingchou Minister of War Cui Hanheng was made Jin prefect and Jin-Ci-Long observer.",
    idiomatic: "On dingchou Cui Hanheng became Jin-Ci-Long commissioner.",
  },
  s0065: {
    literal: "On renshen an edict: \"At court assemblies, enfeoffed kings and commandery princes shall rank above their substantive offices.",
    idiomatic: "An edict raised enfeoffed princes above their substantive ranks at court.",
  },
  s0066: {
    literal: "Left and Right Senior Mentors by statute should stand below Left and Right Vice Directors and Vice Ministers and above all fourth-rank offices; now they are below Junior Ministers — this is wrong and should be changed.\"",
    idiomatic: "Thus ended the edict; Senior Mentors were restored above fourth rank and below vice ministers.",
  },
  s0067: {
    literal: "On yihai Suzhou prefect Sun Sheng was made Guilin prefect and Guilin observer.",
    idiomatic: "On yihai Sun Sheng took Guilin.",
  },
  s0068: {
    literal: "From Shaan to Heyin the Jing and Yellow rivers' water was like ink; it entered the Bian mouth; at Bian prefecture it returned normal after one night.",
    idiomatic: "The Jing-Huang reach ran black as ink to Bianzhou, then cleared overnight.",
  },
  s0069: {
    literal: "Again within Bian and Zheng circuits crows all entered Tian Xu and Li Na's territory, carrying brushwood as walls about ten li square and two or three chi high; Xu and Na hated it and drove them off, yet after one or two nights it was as before — the crows' mouths all bled.",
    idiomatic: "Crows in Bian-Zheng built brush ramparts in Tian Xu and Li Na's lands until driven off, bleeding from their beaks.",
  },
  s0070: {
    literal: "Eighth month: acting Judge of the Secretariat Ji Zhongfu was made Secretariat Drafter.",
    idiomatic: "In the eighth month Ji Zhongfu became a drafter.",
  },
  s0071: {
    literal: "On yiyou Acting Grand Mentor, concurrent Grand Preceptor of the Heir Apparent, Prince of Qian, Li Mian died.",
    idiomatic: "On yiyou Li Mian died.",
  },
  s0072: {
    literal: "On jiawu the capital quaked; the sound was like thunder.",
    idiomatic: "On jiawu a thunderous earthquake struck the capital.",
  },
  s0073: {
    literal: "Ninth month, bingwu, edict: \"Recently ministers inside and outside have attended my person, morning and evening at the public gates, laboring at the myriad affairs.",
    idiomatic: "Ninth month, bingwu: an edict praised ministers' daily labor at court.",
  },
  s0074: {
    literal: "Now the regions are without incident and the masses somewhat at ease; on the three festivals — last day of the first month, third day of the third month, and ninth day of the ninth month — civil and military officials may choose scenic places for pleasure.",
    idiomatic: "With peace returning, the three spring-and-autumn festivals were made holidays for scenic outings.",
  },
  s0075: {
    literal: "Each festival the chancellors and regular attendees together received five hundred strings; Hanlin academicians one hundred strings; each file of Left and Right Divine Awe and Divine Strategy armies five hundred strings; Golden Guards, Heroic Martial, and Prestigious Far guards' generals two hundred strings; the Guest Bureau for memorials one hundred strings — Revenue to pay five days before each festival, permanently as precedent.",
    idiomatic: "Festival cash gifts to chancellors, Hanlin, guards, and the Guest Bureau were fixed by Revenue.",
  },
  s0076: {
    literal: "On wushen Jin-Ci-Long observer Cui Hanheng added the title of overall defense commissioner.",
    idiomatic: "On wushen Cui Hanheng gained an overall defense title.",
  },
  s0077: {
    literal: "On guichou the hundred officials were feasted at Qujiang Pavilion; the Emperor also composed a six-rhyme \"Chongyang Banquet Poem\" and bestowed it.",
    idiomatic: "On guichou the court banqueted at Qujiang and received an imperial Chongyang poem.",
  },
  s0078: {
    literal: "The ministers all matched it; the best were ranked — Liu Taizhen and Li Shu as top, Bao Fang and Yu Shao next, Zhang Meng, Yin Liang, and twenty others after.",
    idiomatic: "Poem matches were graded; Liu Taizhen and Li Shu led, Bao Fang and Yu Shao next.",
  },
  s0079: {
    literal: "Only the three chancellors Li Sheng, Ma Sui, and Li Mi had no ranking of superiority or inferiority.",
    idiomatic: "Li Sheng, Ma Sui, and Li Mi were exempted from ranking.",
  },
  s0080: {
    literal: "On gengshen Tibet raided Bin, Ning, and Fang.",
    idiomatic: "On gengshen Tibetan forces struck Bin, Ning, and Fang circuits.",
  },
  s0081: {
    literal: "Tenth month, winter: an edict ordered the Secretariat and Chancellery to select regular attendees who had been prefects and magistrates with good governance and report their names.",
    idiomatic: "The Secretariat was told to name former magistrates of proven merit.",
  },
  s0082: {
    literal: "The chancellors memorialized twelve including Yu Qi and Dong Jin whose prior posts had traces of good rule; an edict ordered Yu and the rest, with Left and Right Vice Directors listening, each to state policy essentials; the Vice Directors memorialized in items; the Emperor then personally tested their words at Xuanzheng Hall before employing them.",
    idiomatic: "Twelve proven administrators were examined at Xuanzheng before appointment.",
  },
  s0083: {
    literal: "On bingxu Right Divine Strategy general Li Changrong was made Heyang Three Cities Huai prefect training commissioner, and his name Yuan was bestowed.",
    idiomatic: "On bingxu Li Changrong took Heyang and was renamed Yuan.",
  },
  s0084: {
    literal: "On wuzi the Uighur princess was to bring more than sixty concubines and maids and two thousand horses to welcome Princess Xian'an; Minister of Justice Guan Bo was ordered to escort the princess to the barbarians.",
    idiomatic: "On wuzi Guan Bo escorted Princess Xian'an to Uighur betrothal with a vast train.",
  },
  s0085: {
    literal: "Twelfth month, xinsi: Court of the Imperial Regalia Director Li Guan died.",
    idiomatic: "Twelfth month, xinsi: Li Guan died.",
  },
  s0086: {
    literal: "Fifth year, first month, renchen new moon.",
    idiomatic: "Year 5, first month, renchen new moon.",
  },
  s0087: {
    literal: "On yimao an edict: \"The four seasons' fine days — each age has added them; Han honored the upper si day, Jin marked Double Ninth — some spoke of averting ill, though following old custom, sharing joy with the masses suits the time.",
    idiomatic: "On yimao an edict reviewed festival lore from Han and Jin.",
  },
  s0088: {
    literal: "I take the spring season of generation, when the second month arrives, all buds fully reach, Heaven and Earth in harmony — to aid renewal it is fitting to help luxuriant growth.",
    idiomatic: "Spring's second month, he said, should aid growth and renewal.",
  },
  s0089: {
    literal: "Henceforth the second month's first day shall be the Mid-Harmony Festival, replacing the first month's last day, completing the three statutory festivals; inner and outer offices rest one day.\"",
    idiomatic: "The second month's first day became the Mid-Harmony Festival with a day off for all offices.",
  },
  s0090: {
    literal: "Chancellor Li Mi requested that on Mid-Harmony officials present agricultural books, the Court of the Imperial Granaries offer seed grain, kings and consort kin present spring garments, commoners exchange measuring rods as gifts, villages brew Mid-Harmony wine, and sacrifice to Gou Mang for the year's grain — approved.",
    idiomatic: "Li Mi's Mid-Harmony rites — farm books, seed, spring dress, wine, and Gou Mang sacrifice — were adopted.",
  },
  s0091: {
    literal: "On dingmao Right Regular Attendant, Viscount of Yicheng, Liu Hun died.",
    idiomatic: "On dingmao Liu Hun died.",
  },
  s0092: {
    literal: "Second month, jichou: Capital Intendant Zheng Shuzhe was demoted to Yongzhou senior administrator.",
    idiomatic: "Second month, jichou: Zheng Shuzhe lost the capital and went to Yongzhou.",
  },
  s0093: {
    literal: "On wuxu Cang-Jing acting commissioner Cheng Huaizhi was made Cang-Jing observer.",
    idiomatic: "On wuxu Cheng Huaizhi became full Cang-Jing observer.",
  },
  s0094: {
    literal: "On gengzi Grand Court Judge Dong Jin was made Chancellery Vice Director and Associate Grand Secretariat Director;",
    idiomatic: "On gengzi Dong Jin entered the chancellery;",
  },
  s0095: {
    literal: "Vice Censor-in-Chief Dou Can was made Secretariat Vice Director, Associate Director, and concurrent transport commissioner;",
    idiomatic: "Dou Can became vice director and transport commissioner;",
  },
  s0096: {
    literal: "Ban Hong was made Minister of Revenue, continuing as before as revenue and transport vice commissioner.",
    idiomatic: "Ban Hong kept Revenue and his revenue-transport vice commission.",
  },
  s0097: {
    literal: "Third month, jiachen: Secretariat Vice Director, Associate Director Li Mi died.",
    idiomatic: "Third month, jiachen: Li Mi died.",
  },
  s0098: {
    literal: "On yimao War Department bureau director Yao Nanzhong was made Censor-in-Chief; Court of the Imperial Granaries Director Xue Jue was made Capital Intendant; Grand Court Judge Li Su was made Qian prefect and Qian observer.",
    idiomatic: "On yimao Yao Nanzhong, Xue Jue, and Li Su took censorate, capital, and Qian posts.",
  },
  s0099: {
    literal: "On guihai Zi prefect Pang Fu was made Protector-General of Annan and circuit commissioner.",
    idiomatic: "On guihai Pang Fu took Annan.",
  },
  s0100: {
    literal: "On bingyin Minister of Rites Vice Director Liu Taizhen was demoted to Xin prefect.",
    idiomatic: "On bingyin Liu Taizhen was demoted to Xinzhou.",
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
if (data.metadata.chapter !== '013') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 013; standalone T ready (${Object.keys(T).length} entries).`
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
