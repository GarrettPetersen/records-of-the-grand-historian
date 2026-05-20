#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.022, Bright Hall treatise) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/022.json';
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
    literal: 'In the Kaihuang era of Emperor Wen of Sui, Master of Works Yuwen Kai, following the Monthly Ordinances, made a wooden model of the Bright Hall and presented it.',
    idiomatic: 'Under Sui Wendi\'s Kaihuang reign, Master of Works Yuwen Kai built a wooden Bright Hall model per the Monthly Ordinances and presented it.',
  },
  s0002: {
    literal: 'The emperor ordered the relevant offices to mark out a site within Anyeli in the capital; they were about to build on a grand scale, but the Confucians debated without settling it, and in the end the project was abandoned.',
    idiomatic: 'The emperor had offices stake a site in Anyeli; as grand construction neared, Ru scholars deadlocked debate and the work was dropped.',
  },
  s0003: {
    literal: 'In Emperor Yang\'s time, Kai again presented a wooden model of the Bright Hall together with a memorial of proposals; it coincided with moving the capital and labor projects, and again the affair did not succeed.',
    idiomatic: 'Under Yangdi, Kai again offered a model and memorial; capital relocation and public works intervened, and again nothing was built.',
  },
  s0004: {
    literal: 'Through the Sui dynasty, the great autumnal offering was always performed with sacrifice set up at the Rain Altar.',
    idiomatic: 'For all of Sui, the autumn great offering was always held at the Rain Altar.',
  },
  s0005: {
    literal: 'When Gaozu received the abdication, he had no leisure to establish ceremonies.',
    idiomatic: 'Gaozu, taking the mandate, had no time to fix ritual.',
  },
  s0006: {
    literal: 'When Taizong pacified the realm, he ordered Confucian officials to deliberate on its form.',
    idiomatic: 'After Taizong pacified the realm, he ordered Ru officials to debate its design.',
  },
  s0007: {
    literal: 'In the fifth year of Zhenguan, Palace Companion to the Heir Kong Yingda, [holding that] the various Confucians\' proposals violated antiquity, memorialized, saying: \'Your subject humbly searches out the prior edict, following Minister of Rites Lu Kuan, Academician Instructor Liu Bozhuang, and others, who held that one should ascend along the Kunlun Way to the upper level to sacrifice to Heaven.\'',
    idiomatic: 'Zhenguan 5: Palace Companion Kong Yingda, finding Ru proposals unfaithful to antiquity, memorialized that prior edicts, following Lu Kuan and Liu Bozhuang, held sacrifice to Heaven should ascend the Kunlun Way to an upper level.',
  },
  s0008: {
    literal: 'He also searched out a later edict saying: \'Make left and right covered walkways and ascend the tower to set up sacrifice.\'',
    idiomatic: 'A later edict likewise required left and right covered walkways and tower sacrifice.',
  },
  s0009: {
    literal: '\'Your subject has examined the Six Classics, collected books, the hundred schools, and various histories—all name the foundation level hall and the upper level observatory; I have not heard of hall naming above a double-storey structure.\'',
    idiomatic: 'Classics, histories, and masters all call the base level a hall and the upper an observatory—never a hall atop a double storey.',
  },
  s0010: {
    literal: 'The Classic of Filial Piety says: \'Honor and sacrifice to King Wen in the Bright Hall.\'',
    idiomatic: 'The Classic of Filial Piety honors and sacrifices King Wen in the Bright Hall.',
  },
  s0011: {
    literal: 'It does not say Bright Tower or Bright Observatory—the meaning is one.',
    idiomatic: 'It does not say Bright Tower or Bright Observatory—the sense is the same.',
  },
  s0012: {
    literal: 'Moreover, the Bright Hall models Heaven; sage kings display thrift—sometimes cutting artemisia for pillars and thatching straw for a roof.',
    idiomatic: 'The Bright Hall mirrors Heaven; sage kings showed thrift—artemisia pillars, straw roofs.',
  },
  s0013: {
    literal: 'Though ancient and modern forms differ and cannot remain constant, still following the great canon, only simplicity is fit.',
    idiomatic: 'Forms change with age, yet the great canon still demands plainness.',
  },
  s0014: {
    literal: 'Thus mats were only winnowed stalks, vessels valued pottery and gourds, cocoon and chestnut used to value sincerity, great fur robes worn to instruct in thrift—now if flying towers span walkways and brocade pavilions pierce the clouds, when one investigates the ancient texts, this is truly subject to doubt.',
    idiomatic: 'Mats of winnowed stalks, pottery and gourds, cocoon and chestnut for sincerity, great fur for thrift—yet now flying towers, covered walkways, brocade pavilions cloud-high: the ancients would doubt it.',
  },
  s0015: {
    literal: 'According to the Monograph on Suburban Sacrifice: Emperor Wu\'s Bright Hall had four open sides without walls, roofed above with thatch.',
    idiomatic: 'The Suburban Sacrifice monograph: Wu\'s Bright Hall was open on four sides, thatched above, without walls.',
  },
  s0016: {
    literal: 'The Five Emperors were sacrificed at the upper seat; rear Earth was sacrificed at the lower berm.',
    idiomatic: 'The Five Emperors at the upper seat; Earth at the lower berm.',
  },
  s0017: {
    literal: 'Your subject takes the upper seat as properly on the foundation; the lower berm is solely at the foundation\'s foot.',
    idiomatic: 'The upper seat is the base; the lower berm is its foot—nothing above.',
  },
  s0018: {
    literal: 'Since it says no four walls, how does one know that Bo Zhuang sacrifices to spirits on the upper level with five chambers below?',
    idiomatic: 'With no four walls, on what basis does Bo Zhuang place spirit sacrifice above and five chambers below?',
  },
  s0019: {
    literal: 'Moreover, what Wu of Han did followed much of the masters of methods\' teachings, violating the classics and turning from orthodoxy—not to be taken as model.',
    idiomatic: 'Wu\'s work leaned on fangshi lore, against the classics—not a model.',
  },
  s0020: {
    literal: 'Moreover, Lu Kuan and others proposed: the upper level sacrifices to Heaven, the lower hall distributes governance—wishing to separate the positions of men and spirits so matters do not interfere.',
    idiomatic: 'Lu Kuan et al. wanted Heaven above, government below—men and spirits apart.',
  },
  s0021: {
    literal: 'Your subject considers that in antiquity important affairs were treated with gravity similar to receiving spirits, so audience and sacrifice were all in the temple hall—how could one sacrifice to ancestors on the upper story and hold court below?',
    idiomatic: 'Antiquity treated great affairs like spirit reception—audience and sacrifice shared the hall; not sacrifice aloft and court below.',
  },
  s0022: {
    literal: 'Covered walkways ascending the tower—the way is narrow and cramped; riding a palanquin then lacks reverence in receiving spirits; going on foot then wearies the sacred person.',
    idiomatic: 'Covered walkways up a tower are cramped—carriage lacks reverence, walking wearies the Son of Heaven.',
  },
  s0023: {
    literal: 'Guards attend at the side; the hundred offices supply service.',
    idiomatic: 'Guards flank him; the hundred offices attend.',
  },
  s0024: {
    literal: 'Sought in the canons and ordinances—nowhere is this principle.',
    idiomatic: 'Canons and ordinances know nothing of it.',
  },
  s0025: {
    literal: 'Your subject does not presume to cling to a foolish view to seek personal advantage.',
    idiomatic: 'I do not cling to my own view for gain.',
  },
  s0026: {
    literal: 'Humbly—the state\'s great canon cannot but be cautious.',
    idiomatic: 'The state\'s great rites demand caution.',
  },
  s0027: {
    literal: 'I beg that my words be sent down to the ministers for detailed deliberation.',
    idiomatic: 'I beg the court to deliberate my words.',
  },
  s0028: {
    literal: 'The passage concluded." Vice Censor Wei Zheng memorialized, saying: "Investigating ancient instructions and comparing with old diagrams, [the form is] round above and square below, compound temple and double roof—all plans agree, different carriages same destination.',
    idiomatic: 'The quote ended. Vice Censor Wei Zheng argued: round above, square below, layered temple and double roof—one aim, many paths.',
  },
  s0029: {
    literal: 'When the House of Cao received the mandate, there was no leisure for this rite;',
    idiomatic: 'Cao had the mandate but no time for the rite;',
  },
  s0030: {
    literal: 'when the House of Sima arose, nothing was taken as model.',
    idiomatic: 'Jin took no model.',
  },
  s0031: {
    literal: 'Pei Song, because the Confucians held disputations and heterodoxies swarmed like bees, right and wrong crossed and there was nowhere to follow, thereupon discarded men\'s words and stopped at a single hall.',
    idiomatic: 'Pei Song, amid swarming Ru disputes, abandoned debate and built only one hall.',
  },
  s0032: {
    literal: 'Song and Qi continued the old; Liang and Chen followed without change.',
    idiomatic: 'Song and Qi kept the old form; Liang and Chen unchanged.',
  },
  s0033: {
    literal: 'Though solemn matching had its place and sacrifices were not lacking, sought in the canonical pattern, the Way was in truth not enlarged.',
    idiomatic: 'Sacrifice continued, yet the canonical Way was never fully realized.',
  },
  s0034: {
    literal: 'Filial piety arises from the heart; ritual is established from feeling.',
    idiomatic: 'Filial piety springs from the heart; ritual from feeling.',
  },
  s0035: {
    literal: 'The heart cannot be exhausted, so things are prepared to display sincerity;',
    idiomatic: 'Hearts cannot be fully shown—objects display sincerity;',
  },
  s0036: {
    literal: 'feeling cannot be fully expressed, so palaces are adorned to broaden reverence.',
    idiomatic: 'feeling cannot be fully expressed—palaces widen reverence.',
  },
  s0037: {
    literal: 'The Master Kong\'s fine intent lies here!',
    idiomatic: 'Confucius\'s intent is here!',
  },
  s0038: {
    literal: 'We your subjects have personally received the virtuous command to join the great deliberation, thinking to exhaust our dust and dew to add slightly to mountain and sea.',
    idiomatic: 'We received command to join debate, offering dust to swell mountain and sea.',
  },
  s0039: {
    literal: 'Whenever the sage makes something, the meaning weighs with the times; all things witness it—the affair depends on adaptation.',
    idiomatic: 'Sage works shift with the times; all things witness adaptation.',
  },
  s0040: {
    literal: 'If one follows Cai Yong\'s sayings, then utmost principle is lost in textual excess;',
    idiomatic: 'Cai Yong\'s line loses principle in excess text;',
  },
  s0041: {
    literal: 'if one follows what Pei Song did, then again it injures through plainness and brevity.',
    idiomatic: 'Pei Song\'s line injures through bare plainness.',
  },
  s0042: {
    literal: 'Sought in reason and feeling, it does not satisfy the mean.',
    idiomatic: 'Neither satisfies the mean.',
  },
  s0043: {
    literal: 'What is now deliberated is not without use and discard.',
    idiomatic: 'Today\'s debate has real choices.',
  },
  s0044: {
    literal: 'We ask for five chambers in a double roof, round above and square below—both embodying regulated images and grounded in many established facts.',
    idiomatic: 'We propose five chambers, double roof, round above and square below—regulated image and solid precedent.',
  },
  s0045: {
    literal: 'The lower chambers prepare dwellings for distributing governance; the upper hall is the place for sacrificing to Heaven—men and spirits not mixed, and the ritual is fitting.',
    idiomatic: 'Lower chambers for government, upper hall for Heaven—men and spirits apart, ritual fit.',
  },
  s0046: {
    literal: 'As for regulations of height, breadth, and extent, and the measures of benches and mats in feet and yards—all follow legislation for the time and suit the affair.',
    idiomatic: 'Heights, breadths, benches, and mats should follow the times and the task.',
  },
  s0047: {
    literal: 'What we ourselves make—why must we take the ancients as teacher?',
    idiomatic: 'Our own work need not ape antiquity.',
  },
  s0048: {
    literal: 'Dispel a thousand years\' doubtful debate; be the fine pattern for a hundred kings.',
    idiomatic: 'Clear millennial doubt; set a pattern for a hundred kings.',
  },
  s0049: {
    literal: 'Do not let below Mount Tai one hear only the Yellow Emperor\'s law;',
    idiomatic: 'Do not leave Mount Tai hearing only the Yellow Emperor;',
  },
  s0050: {
    literal: 'on the Wen River alone praise Wu of Han\'s plan.',
    idiomatic: 'or the Wen River praising only Han Wu.',
  },
  s0051: {
    literal: 'Then penetrating to spirits and gods, it may nearly be awaited; the people come and ground is broken—completed not in days.',
    idiomatic: 'Then spirits may be reached; the people will come and finish it quickly.',
  },
  s0052: {
    literal: 'The passage concluded." The deliberation was still undecided.',
    idiomatic: 'The quote ended. Debate remained unsettled.',
  },
  s0053: {
    literal: 'In the fifth month of the seventeenth year, Director of the Palace Library Yan Shigu memorialized:',
    idiomatic: 'Seventeenth year, fifth month: Palace Library Director Yan Shigu memorialized:',
  },
  s0054: {
    literal: 'The Bright Hall\'s form, from ancient times—sought in bamboo and silk, the full text is nowhere seen.',
    idiomatic: 'Bright Hall design is ancient, yet full texts are lost on bamboo and silk.',
  },
  s0055: {
    literal: 'From the Yellow Emperor down to Shun of Yu, through Xia and Yin to the Zhou age, each established names and separately created models.',
    idiomatic: 'From the Yellow Emperor through Yu Shun, Xia, Yin, and Zhou—each named and shaped its own form.',
  },
  s0056: {
    literal: 'The many sayings contradict; each clings to his view; great Ru and eminent scholars have none who thoroughly penetrate.',
    idiomatic: 'Sayings clash; great scholars none thorough.',
  },
  s0057: {
    literal: 'Floridly formed into chapters, they do not know how to decide.',
    idiomatic: 'Fine chapters abound—no decision.',
  },
  s0058: {
    literal: 'Investigating the essentials, it is in truth the palace of distributing governance.',
    idiomatic: 'At bottom it is the hall of government.',
  },
  s0059: {
    literal: 'Only because in the Warring States period strategists crossed and classics were abandoned;',
    idiomatic: 'Warring States scheming abandoned the classics;',
  },
  s0060: {
    literal: 'violent Qin was cruel and fierce, and classic ritual perished.',
    idiomatic: 'cruel Qin extinguished canonical ritual.',
  },
  s0061: {
    literal: 'What survives today—miscellaneous sayings in transmitted records—used as standard, are in principle muddled and obscure.',
    idiomatic: 'What survives—miscellaneous records—is a muddy standard.',
  },
  s0062: {
    literal: 'Yet the Zhou Documents\' account of the Bright Hall records its four sides, then there are the responding gate and pheasant gate; based on this single hall, it is solidly the Son of Heaven\'s usual residence.',
    idiomatic: 'Yet Zhou Documents\' Bright Hall lists responding and pheasant gates—one hall, the king\'s usual dwelling.',
  },
  s0063: {
    literal: 'Its Qingyang, Zongzhang, Xuantang, Grand Temple, and left and right annexes, matching the sequence of the four seasons, then the meaning of the road chamber is sufficient as clear proof.',
    idiomatic: 'Qingyang, Zongzhang, Xuantang, Grand Temple, and left and right annexes match the four seasons—the road chamber is proved.',
  },
  s0064: {
    literal: 'Also the chapter King Wen Dwelling in the Bright Hall: girded with bow Shu, he sacrificed at the high Altars of Soil and Grain.',
    idiomatic: 'King Wen Dwelling in the Bright Hall: girded with bow Shu, he sacrificed at the high Altars of Soil and Grain.',
  },
  s0065: {
    literal: 'Below the nine gates he dismembered offerings to ward off pestilence, set beams and cleared roads to benefit farmers, and ordered the state to have wine to unite the three clans.',
    idiomatic: 'At the nine gates he offered dismemberment against plague, cleared roads for farmers, and ordered state wine for the three clans.',
  },
  s0066: {
    literal: 'The passage concluded." All such affairs accord with the Monthly Ordinances text.',
    idiomatic: 'The quote ended. All match the Monthly Ordinances.',
  },
  s0067: {
    literal: 'Observing what was done, all was in the road chamber.',
    idiomatic: 'All these acts belong in the road chamber.',
  },
  s0068: {
    literal: 'The Record of the Elder Dai says: "In former times the Duke of Zhou received the feudal lords at the Bright Hall; the Son of Heaven bore the axe-screen facing south.',
    idiomatic: 'Elder Dai: the Duke of Zhou received lords at the Bright Hall; the Son of Heaven bore the axe-screen facing south.',
  },
  s0069: {
    literal: 'The Bright Hall clarifies the feudal lords\' precedence." The passage concluded."',
    idiomatic: 'The Bright Hall clarifies lords\' rank. The quote ended.',
  },
  s0070: {
    literal: 'The Offices of Zhou also says: "The Zhou people\'s Bright Hall measured the nine-foot bench; east and west nine benches, the hall one bench." The passage concluded."',
    idiomatic: 'Offices of Zhou: Zhou Bright Hall used a nine-foot bench; nine benches east and west, one bench for the hall. The quote ended.',
  },
  s0071: {
    literal: 'According to its regulations, it is the great chamber.',
    idiomatic: 'By its measure it is the great sleeping chamber.',
  },
  s0072: {
    literal: 'The Shizi also says: "The Yellow Emperor called it the Harmonious Palace; Shun of Yu called it Zongzhang; Yin called it the Yang Lodge; Zhou called it the Bright Hall." The passage concluded."',
    idiomatic: 'Shizi: the Yellow Emperor called it Harmonious Palace; Yu Shun Zongzhang; Yin the Yang Lodge; Zhou the Bright Hall. The quote ended.',
  },
  s0073: {
    literal: 'These are all marks of the road chamber—knowing it is no separate place.',
    idiomatic: 'All mark the road chamber—not a separate site.',
  },
  s0074: {
    literal: 'What the Elder Dai said at first had words of proximity to the suburbs, then again called it King Wen\'s temple—advancing and retreating without warrant, contradicting itself.',
    idiomatic: 'Elder Dai first nears the suburbs, then calls it King Wen\'s temple—self-contradicting.',
  },
  s0075: {
    literal: 'Considering that bearing the screen to receive audience and usual coming and going were within the outer treasury—how could one say in suburban wilds?',
    idiomatic: 'Audience at the screen and daily comings and goings were inside the outer treasury—not suburban wilds.',
  },
  s0076: {
    literal: 'The Classic of Filial Piety Commentary says "in the yang of the state," again without li count.',
    idiomatic: 'Filial Piety commentary: "in the state\'s yang"—no distance given.',
  },
  s0077: {
    literal: 'Wu of Han cherished creative intent and inquired of the gentry; talk was abundant yet in the end without fixed warrant, and he established it on the Wen River to honor and sacrifice—showing he was not bound by distance or choosy about direction.',
    idiomatic: 'Han Wu sought to innovate, asked the gentry, got no fixed answer, and built on the Wen River—distance and direction did not bind him.',
  },
  s0078: {
    literal: 'In the age of Emperor Cheng, a memorial proposed the south of the city; though there was text, the achievement was not established.',
    idiomatic: 'Cheng proposed south of the city on paper; nothing was built.',
  },
  s0079: {
    literal: 'In the fourth year of Emperor Ping\'s Yuanshi era, great deliberation planned construction.',
    idiomatic: 'Ping Yuanshi 4: the court planned construction.',
  },
  s0080: {
    literal: 'Kong Lao and others then held that the Bright Hall, Imperial Academy, and Grand Academy were in substance one, yet had three names.',
    idiomatic: 'Kong Lao held Bright Hall, Imperial Academy, and Grand Academy were one thing with three names.',
  },
  s0081: {
    literal: 'Jin Bao and others also said the classics and transmitted texts had no writing and could not distinguish sameness and difference.',
    idiomatic: 'Jin Bao said the classics lacked text to separate them.',
  },
  s0082: {
    literal: 'After the restoration, Cai Yong wrote a treatise, again saying Bright Hall and Grand Temple were one thing, two names.',
    idiomatic: 'After restoration Cai Yong wrote: Bright Hall and Grand Temple—one thing, two names.',
  },
  s0083: {
    literal: 'The passage concluded." Zheng Xuan then said: "In the yang of the state, three li outside." The passage concluded."',
    idiomatic: 'The quote ended. Zheng Xuan: "in the state\'s yang, three li out." The quote ended.',
  },
  s0084: {
    literal: 'The passage concluded." Chunyu Deng also said: "Three li outside, seven li within, in the bing-si direction." The passage concluded."',
    idiomatic: 'The quote ended. Chunyu Deng: "three li out, seven li in, bing-si direction." The quote ended.',
  },
  s0085: {
    literal: 'The passage concluded." Ying Rong\'s Explanatory Examples also said: "Bright Hall and Grand Temple have eight names in all; the substance is one." The passage concluded."',
    idiomatic: 'The quote ended. Ying Rong: "Bright Hall and Grand Temple have eight names; one substance." The quote ended.',
  },
  s0086: {
    literal: 'The passage concluded." If each sets up sameness and difference and competes in clever explanations—all from the breast, never from teachers and models.',
    idiomatic: 'The quote ended. Each clever theory came from the breast, not from masters.',
  },
  s0087: {
    literal: 'Considering that when achievement is complete music is made and when principle is settled ritual is fashioned—draft creation follows convenience, substance and ornament alternate in change.',
    idiomatic: 'Achievement brings music; settled principle brings ritual—drafts follow need, substance and ornament shift.',
  },
  s0088: {
    literal: 'Banners, caps, and crowns differ ancient and modern; measures, standards, and balances differ former and later—the meaning of following the time can be known by breaking.',
    idiomatic: 'Banners and caps, measures and balances all change with time—plain to see.',
  },
  s0089: {
    literal: 'Suppose even the Duke of Zhou\'s old statutes—still one should choose what may and may not;',
    idiomatic: 'Even Zhou Gong\'s statutes need yes-or-no choices;',
  },
  s0090: {
    literal: 'the Master Kong\'s constant pattern—even he sometimes mended its gaps and leaks.',
    idiomatic: 'even Confucius\'s pattern needed patching.',
  },
  s0091: {
    literal: 'How much more Zheng\'s speculative sayings and Chunyu\'s shallow hearing—not different from guarding a stump, what different from gluing the peg?',
    idiomatic: 'Zheng\'s guesses and Chunyu\'s hearsay are stump-guarding and peg-gluing.',
  },
  s0092: {
    literal: 'This foolish one considers: not going beyond the outer wall and pheasant, close to the palace gates—truly fitting the affair, surely without confusion.',
    idiomatic: 'I say: within the pheasant wall, beside the palace—fitting and clear.',
  },
  s0093: {
    literal: 'Only follow Heaven\'s command above, reverently receive the virtuous command, make the Bright Hall of the imperial age, and forever bequeath a model to coming generations.',
    idiomatic: 'Follow Heaven\'s command, build the dynasty\'s Bright Hall, and bequeath a model to posterity.',
  },
  s0094: {
    literal: 'Petty fragmentary debate—all passed over without discussion.',
    idiomatic: 'Petty debate I pass over.',
  },
  s0095: {
    literal: 'He also submitted a memorial, saying: \'As for the Bright Hall\'s form, Your Majesty has already issued the virtuous command and long ordered detailed deliberation.\'',
    idiomatic: 'He also memorialized: Your Majesty has long ordered Bright Hall deliberation.',
  },
  s0096: {
    literal: 'Only because scholars are obstinate, each man has a different saying, increase and decrease differ, and right and wrong are not settled.',
    idiomatic: 'Scholars are obstinate—each voice differs, nothing settles.',
  },
  s0097: {
    literal: 'Your subject\'s foolish view is that after the Five Emperors and before the two Han dynasties, round above and square below were never alike in succession.',
    idiomatic: 'From the Five Emperors through pre-Han times, round-above-square-below never repeated.',
  },
  s0098: {
    literal: 'Only in Your Majesty\'s sage intent to create lies the Great Tang Bright Hall, sufficient to transmit through ten thousand generations—why debate how many doors and windows, or doubt the courtyard\'s breadth and narrowness?',
    idiomatic: 'Only Your Majesty\'s creation need be Tang\'s Bright Hall for ten thousand generations—why count doors or doubt the courtyard?',
  },
  s0099: {
    literal: 'If one lets the Confucians each argue one corner, long without decisive break, one only delays the great rite; formerly when Han Wu wished to draft the fengshan ceremony, the many students of the Broad Vision had different sayings and none knew which was right.',
    idiomatic: 'Let Ru argue forever and the great rite stalls; Han Wu drafting fengshan heard many students, none right.',
  },
  s0100: {
    literal: 'Only Censor-in-Chief Ni Kuan urged the emperor to fix the system himself, and thereupon the ascent-feng rite was completed.',
    idiomatic: 'Only Censor-in-Chief Ni Kuan urged the emperor to fix the rite himself—and fengshan was done.',
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
if (data.metadata.chapter !== '022') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 022; standalone T ready (${Object.keys(T).length} entries).`
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
