#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Jiutangshu ch.026, Rites 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/026.json';
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
    literal: 'As stated above, then after di three years until xia, thereafter two years until di.',
    idiomatic: 'As stated above, after a di sacrifice three years pass until xia, then two years until the next di.',
  },
  s0102: {
    literal: 'This accords with the ritual classics and does not violate the Commentaries\' meaning.',
    idiomatic: 'This fits the ritual classics and does not violate the Commentaries.',
  },
  s0103: {
    literal: '" From this point the proposal of Can and others was fixed as the rule.',
    idiomatic: '" From then on Can\'s proposal was adopted as the rule.',
  },
  s0104: {
    literal: 'In autumn, when Ruizong\'s mourning was completed, xia offering at the Grand Temple.',
    idiomatic: 'That autumn, when Ruizong\'s mourning ended, a xia offering was held at the Grand Temple.',
  },
  s0105: {
    literal: 'Thereafter again the practice continued: xia every three years, di every five years, each counting years separately without coordinating the cycles.',
    idiomatic: 'Thereafter the practice again was xia every three years and di every five years, each cycle counted on its own without aligning the numbers.',
  },
  s0106: {
    literal: 'By the twenty-seventh year, there had been five di and seven xia in all.',
    idiomatic: 'By the twenty-seventh year there had been five di and seven xia in all.',
  },
  s0107: {
    literal: 'That year after the summer di was finished, winter again called for xia.',
    idiomatic: 'That year, after the summer di was completed, winter again required xia.',
  },
  s0108: {
    literal: 'The Court of Imperial Sacrifices proposed:',
    idiomatic: 'The Court of Imperial Sacrifices memorialized:',
  },
  s0109: {
    literal: 'Vice Director of Rites Cui Zongzhi rejected and sent it down to the Court of Imperial Sacrifices, ordering further detailed discussion; ordered Hanlin academician Lu Shanqing and others to examine further; Shanqing also approved their proposal.',
    idiomatic: 'Vice Director of Rites Cui Zongzhi rejected the proposal and returned it to the Court of Imperial Sacrifices for further review; Lu Shanqing and other Hanlin academicians were ordered to examine it again, and Shanqing also approved their view.',
  },
  s0110: {
    literal: 'Thereupon Director of the Court of Imperial Sacrifices Wei Can memorialized, saying: "In ritual there are di and xia, both called substantive sacrifices; the two methods alternate in use, succeeding like fish scales.',
    idiomatic: 'Director Wei Can then memorialized: "Ritual provides di and xia, both called substantive sacrifices; the two rites alternate in succession like scales on a fish.',
  },
  s0111: {
    literal: 'Some say at five years two substantive sacrifices—one di and one xia.',
    idiomatic: 'Some say that in five years there are two substantive sacrifices—one di and one xia.',
  },
  s0112: {
    literal: 'Some say xia every three years, di every five years.',
    idiomatic: 'Others say xia every three years and di every five.',
  },
  s0113: {
    literal: 'Following heaven\'s pattern and the intercalary, the great import is the same.',
    idiomatic: 'Both follow heaven\'s pattern and the intercalary month; the underlying principle is the same.',
  },
  s0114: {
    literal: 'All take the Grand Temple di and xia, with years counted differently; examining the classics and commentaries, there is slight divergence.',
    idiomatic: 'All concern di and xia at the Grand Temple, but the year-count differs; compared with the classics and commentaries, there is a slight discrepancy.',
  },
  s0115: {
    literal: 'Recently in the fourth month di offering was already performed; now pointing to mid-winter, xia rites are again reported—joint offerings too frequent, fearing violation of former canons.',
    idiomatic: 'Di was just performed in the fourth month; now, with mid-winter approaching, xia rites are proposed again—joint offerings would come too often and may violate ancient precedent.',
  },
  s0116: {
    literal: 'We submit that Your Majesty, able affairs completed, old things all restored, when the ancestral tablets are reverently tended, when classic teachings are clarified—',
    idiomatic: 'We submit that Your Majesty has completed the mourning observances, restored what was lost, and now, when the ancestral tablets are tended and the classics clarified—',
  },
  s0117: {
    literal: 'We humbly hold ritual office, charged with discussion, and presume to fix their order according to old texts.',
    idiomatic: 'we who hold ritual office are charged with deliberation and presume to set the order according to old texts.',
  },
  s0118: {
    literal: 'Please take this year\'s summer di as the source of substantive sacrifices; from then on di and xia alternate, two substantive sacrifices in five years, cycling and beginning again.',
    idiomatic: 'Let this year\'s summer di be the starting point for substantive sacrifices; thereafter di and xia should alternate, two substantive sacrifices every five years, and the cycle begin anew.',
  },
  s0119: {
    literal: 'This year\'s winter xia per ritual should be suspended; we hope the responsible offices will only perform seasonal offerings—that is strict sacrifice without profanation, roughly matching old observances.',
    idiomatic: 'This year\'s winter xia should be omitted per ritual; we ask that the offices perform only the seasonal offerings—strict sacrifice without excess—and thus match former practice.',
  },
  s0120: {
    literal: '" The decree followed it.',
    idiomatic: '" The emperor approved.',
  },
  s0121: {
    literal: 'Former observance, intercalary sixth month sixth day edict text: ""',
    idiomatic: 'Former observance: sixth day of the intercalary sixth month, edict text: ""',
  },
  s0122: {
    literal: 'Fourth day of the ninth month, Court of Imperial Sacrifices Doctor Chen Jing submitted a memorial saying:',
    idiomatic: 'On the fourth day of the ninth month, Court of Imperial Sacrifices Doctor Chen Jing submitted a memorial:',
  },
  s0123: {
    literal: 'An edict was sent down to the Ministry of State for all officials to assemble and discuss.',
    idiomatic: 'An edict ordered the Ministry of State to assemble all officials for deliberation.',
  },
  s0124: {
    literal: 'Rites Commissioner, Junior Tutor of the Heir Apparent Yan Zhenqing proposed: "Some discussants say Xianzu and Yizu, kin distant and temples migrated, should not receive xia offering and should be permanently closed in the west side chambers.',
    idiomatic: 'Rites Commissioner and Junior Tutor Yan Zhenqing proposed: "Some say that Xianzu and Yizu, being distant in kin and having had their temples moved, should not receive xia offerings and should be permanently shut in the west side chambers.',
  },
  s0125: {
    literal: 'Others say the two ancestors should share xia offering with the Grand Ancestor in zhao-mu order, leaving the Grand Ancestor\'s east-facing position empty.',
    idiomatic: 'Others say the two ancestors should share xia with the Grand Ancestor in zhao-mu order, leaving the Grand Ancestor\'s east-facing seat vacant.',
  },
  s0126: {
    literal: 'Others say if the two ancestors share xia offering, the Grand Ancestor\'s position could never be corrected; they should enshrine the two ancestors\' spirit tablets in the temple of the Virtuous and Illustrious Emperor.',
    idiomatic: 'Others say that if the two ancestors share xia, the Grand Ancestor\'s seat could never be corrected; the two ancestors\' tablets should be moved to the temple of the Virtuous and Illustrious Emperor.',
  },
  s0127: {
    literal: 'I submit all three proposals are not acceptable.',
    idiomatic: 'I submit that all three proposals are unacceptable.',
  },
  s0128: {
    literal: 'The ritual classics are damaged and lack clear warrant; scholars who can compare categories and weigh among them may then act—this broadly accords with what is correct.',
    idiomatic: 'The ritual classics are damaged and lack clear authority; scholars who can compare categories and weigh the matter may act—this broadly accords with what is correct.',
  },
  s0129: {
    literal: 'The Grand Ancestor, the Illustrious Emperor, for merit in first enfeoffment at receiving the mandate, occupies the temple never moved for a hundred generations, paired with Heaven in lofty offering—this is utmost honor.',
    idiomatic: 'The Grand Ancestor, Emperor Jing, for merit at first enfeoffment when the mandate was received, occupies the temple that is never moved for a hundred generations and is paired with Heaven in lofty sacrifice—this is the highest honor.',
  },
  s0130: {
    literal: 'When great di and xia arrive, he temporarily occupies zhao-mu position, humbling himself to extend filial piety, respectfully serving ancestors and forbears—by kinship order\'s rite, broadening honor of forebears; this truly is the Grand Ancestor\'s bright spirit\'s earnest intent, also thereby transforming the realm, leading all in filial piety.',
    idiomatic: 'At great di and xia he temporarily takes a zhao-mu place, humbling himself to extend filial piety and serve the ancestors—by the rite of kin order, broadening honor to forebears. This is truly the Grand Ancestor\'s intent, and thereby transforms the realm and leads all in filial piety.',
  },
  s0131: {
    literal: 'Please follow Jin Cai Mo\'s proposal: on the tenth month\'s xia offering day present Xianzu\'s spirit tablet in the east-facing position; from Yizu, Grand Ancestor, down through all ancestors follow left-zhao right-mu array.',
    idiomatic: 'Please follow Jin Cai Mo\'s proposal: on the day of the tenth month\'s xia offering, place Xianzu\'s tablet in the east-facing position; from Yizu and the Grand Ancestor down through all ancestors, follow the left-zhao right-mu array.',
  },
  s0132: {
    literal: 'This has the clear meaning of the state weighting the root and honoring obedience—sufficient as an unchanging statute for ten thousand generations.',
    idiomatic: 'This clearly expresses the state\'s weight on the root and honoring of obedience—sufficient as an unchanging statute for ten thousand generations.',
  },
  s0133: {
    literal: 'Others propose installing the two ancestors\' spirit tablets in the Virtuous and Illustrious Emperor\'s temple to perform xia rites.',
    idiomatic: 'Others propose placing the two ancestors\' tablets in the Virtuous and Illustrious Emperor\'s temple to perform xia.',
  },
  s0134: {
    literal: 'Xia means union.',
    idiomatic: 'Xia denotes union.',
  },
  s0135: {
    literal: 'Thus the Gongyang Commentary says: "What is a great affair?',
    idiomatic: 'The Gongyang Commentary says: "What is a great affair?',
  },
  s0136: {
    literal: 'Xia."',
    idiomatic: 'It is xia."',
  },
  s0137: {
    literal: 'If xia sacrifice is not set out in the Grand Temple but offered in the Virtuous and Illustrious temple, this is divided offering—how can it be called joint offering?',
    idiomatic: 'If xia is not performed in the Grand Temple but in the Virtuous and Illustrious temple, that is divided offering—how can it be called joint offering?',
  },
  s0138: {
    literal: 'Name and substance contradict each other, deeply losing ritual intent—certainly not executable.',
    idiomatic: 'Name and substance contradict each other and deeply violate ritual intent—it certainly cannot be done.',
  },
  s0139: {
    literal: 'The passage concluded."',
    idiomatic: 'The memorial ended.',
  },
  s0140: {
    literal: 'Twenty-eighth day of the eleventh month, Director Pei Yu memorialized, saying: "The rites of di and xia—in Yin and Zhou, because moved temples all came after the Grand Ancestor, joint offering could be ordered and honor and subordination did not err.',
    idiomatic: 'On the twenty-eighth of the eleventh month, Director Pei Yu memorialized: "Di and xia—in Yin and Zhou, because moved temples all came after the Grand Ancestor, joint offerings could be ordered without confusion of rank.',
  },
  s0141: {
    literal: 'When Han Gaozu received the mandate, there was no founding enfeoffment ancestor; the High Emperor was taken as Grand Ancestor.',
    idiomatic: 'When Han Gaozu received the mandate there was no founding enfeoffment ancestor; the High Emperor was made Grand Ancestor.',
  },
  s0142: {
    literal: 'The Supreme Emperor, the High Emperor\'s father, had a temple established for offering—he was not in the zhao-mu joint-offering array, because he was honored above the Grand Ancestor.',
    idiomatic: 'The Supreme Emperor, Gaozu\'s father, had a temple for sacrifice but was not in the zhao-mu joint-offering order, being honored above the Grand Ancestor.',
  },
  s0143: {
    literal: 'Wei Wu founded the enterprise; Emperor Wen received the mandate and likewise took Emperor Wu as Grand Ancestor.',
    idiomatic: 'Cao Cao founded the enterprise; Emperor Wen received the mandate and likewise took Emperor Wu as Grand Ancestor.',
  },
  s0144: {
    literal: 'The High Emperor, Supreme Emperor, Recluse Lord, and others were all subordinate in honor and not in the zhao-mu joint-offering array.',
    idiomatic: 'The High Emperor, Supreme Emperor, Recluse Lord, and others were all subordinate in honor and outside the zhao-mu joint-offering order.',
  },
  s0145: {
    literal: 'Jin Xuan founded the enterprise; Emperor Wu received the mandate and likewise took Emperor Xuan as Grand Ancestor.',
    idiomatic: 'Sima Yi founded the enterprise; Emperor Wu received the mandate and likewise took Emperor Xuan as Grand Ancestor.',
  },
  s0146: {
    literal: 'The Western Campaign, Yingchuan, and other four mansion lords were also subordinate in honor and not in the zhao-mu joint-offering array.',
    idiomatic: 'The Western Campaign, Yingchuan, and other four mansion lords were likewise subordinate in honor and outside the zhao-mu joint-offering order.',
  },
  s0147: {
    literal: 'Our state received the Mandate of Heaven; successive sages doubled its glory.',
    idiomatic: 'Our state received the Mandate of Heaven; successive sage rulers doubled its glory.',
  },
  s0148: {
    literal: 'Emperor Jing first received enfeoffment as Duke of Tang and truly was Grand Ancestor.',
    idiomatic: 'Emperor Jing was first enfeoffed as Duke of Tang and was truly the Grand Ancestor.',
  },
  s0149: {
    literal: 'The generations in between were near; within the three zhao and three mu, the royal Grand Temple therefore had only six chambers.',
    idiomatic: 'The intervening generations were few; within the three zhao and three mu, the imperial Grand Temple therefore had only six chambers.',
  },
  s0150: {
    literal: 'The Lord of Hongnong Mansion, the two ancestors Xuan and Guang, honored above the Grand Ancestor—when kin was exhausted they moved temples and were not counted in zhao-mu.',
    idiomatic: 'The Lord of Hongnong Mansion and the two ancestors Xuan and Guang, honored above the Grand Ancestor—when kin was exhausted their temples were moved and they were not counted in zhao-mu.',
  },
  s0151: {
    literal: 'Recorded in the ritual annals; it may be enacted.',
    idiomatic: 'This is recorded in the ritual annals and may be followed.',
  },
  s0152: {
    literal: 'In the Kaiyuan era nine temple chambers were added; the two ancestors of Offerings and Eminence were both in zhao-mu, so the Grand Ancestor Emperor Jing could not occupy the east-facing honor.',
    idiomatic: 'In Kaiyuan nine chambers were added; Offerings and Eminence were both in zhao-mu, so Grand Ancestor Emperor Jing could not take the east-facing honor.',
  },
  s0153: {
    literal: 'Now the two ancestors have been moved out; with nine chambers in order only, how can the Grand Ancestor\'s position again not be corrected?',
    idiomatic: 'Now the two ancestors have been moved out and the nine chambers are in order—how can the Grand Ancestor\'s seat again fail to be corrected?',
  },
  s0154: {
    literal: 'We submit that the Grand Ancestor, paired above with Heaven and Earth, never moved for a hundred generations, yet occupies zhao-mu, while the two ancestors of Offerings and Eminence, kin exhausted and temples moved, occupy the east-facing—examining former facts, this is truly not fitting.',
    idiomatic: 'We submit that the Grand Ancestor, paired with Heaven and Earth and never moved for a hundred generations, yet occupies zhao-mu, while Offerings and Eminence, kin exhausted and temples moved, occupy the east-facing—examining precedent, this is truly improper.',
  },
  s0155: {
    literal: 'We ask that all officials be ordered to deliberate jointly.',
    idiomatic: 'We ask that all officials deliberate jointly.',
  },
  s0156: {
    literal: '" The edict followed it.',
    idiomatic: '" The emperor approved.',
  },
  s0157: {
    literal: 'Twenty-third day of the first month of the eighth year, Left Associate of the Heir Apparent Li Rong and seven others proposed:',
    idiomatic: 'On the twenty-third of the first month of the eighth year, Left Associate of the Heir Apparent Li Rong and seven others proposed:',
  },
  s0158: {
    literal: 'Director of the Ministry of Personnel Liu Mian and twelve others proposed:',
    idiomatic: 'Liu Mian of Personnel and eleven others proposed:',
  },
  s0159: {
    literal: 'Director of the Ministry of Works Zhang Jian and others proposed:',
    idiomatic: 'Zhang Jian of Works and others proposed:',
  },
  s0160: {
    literal: 'Vice Director of the Bureau of Merits Pei Shu proposed:',
    idiomatic: 'Pei Shu of the Bureau of Merits proposed:',
  },
  s0161: {
    literal: 'Vice Director of the Bureau of Evaluation Chen Jing proposed:',
    idiomatic: 'Chen Jing of the Bureau of Evaluation proposed:',
  },
  s0162: {
    literal: 'Junior Metropolitan Prefect of Jingzhao Wei Wu proposed:',
    idiomatic: 'Wei Wu, junior metropolitan prefect of Jingzhao, proposed:',
  },
  s0163: {
    literal: 'Magistrate of Tongguan County Zhong Ziling proposed:',
    idiomatic: 'Zhong Ziling, magistrate of Tongguan, proposed:',
  },
  s0164: {
    literal: 'On the twenty-seventh of that month, Director of the Ministry of Personnel Liu Mian submitted "Evidence on Di and Xia," fourteen items in all, for consultation, and all were deliberated and reported.',
    idiomatic: 'On the twenty-seventh of that month, Liu Mian submitted "Evidence on Di and Xia," fourteen items in all, for consultation; all were deliberated and reported.',
  },
  s0165: {
    literal: 'By the twelfth day of the third month, the Bureau of Sacrifices reported Yu and others\' deliberation.',
    idiomatic: 'By the twelfth of the third month, the Bureau of Sacrifices reported Yu and others\' deliberation.',
  },
  s0166: {
    literal: 'By the twelfth day of the seventh month of the eleventh year, an edict: "" That month on the twenty-sixth, Left Bureau Director Lu Chun memorialized, saying: "Your subject traced the seventh-year deliberation of all officials—though there were sixteen memorials in all, their trend has three points only.',
    idiomatic: 'By the twelfth of the seventh month of the eleventh year, an edict: "" That month on the twenty-sixth, Left Bureau Director Lu Chun memorialized: "Your subject reviewed the seventh-year deliberation of all officials—though there were sixteen memorials, their trend has three points only.',
  },
  s0167: {
    literal: 'Yu Hao and others\' fourteen memorials all said to restore the Grand Ancestor\'s position.',
    idiomatic: 'Yu Hao and others\' fourteen memorials all said to restore the Grand Ancestor\'s seat.',
  },
  s0168: {
    literal: 'Zhang Jian\'s memorial said to array both in zhao-mu and leave the east-facing seat empty.',
    idiomatic: 'Zhang Jian argued for zhao-mu placement with an empty east-facing seat.',
  },
  s0169: {
    literal: 'Wei Wu\'s memorial likewise said that in the year of xia, Xianzu should occupy the east-facing and perform di rites; the Grand Ancestor should again take his place in the west.',
    idiomatic: 'Wei Wu\'s memorial likewise said that in a xia year Xianzu should face east and perform di, while the Grand Ancestor should again take the western seat.',
  },
  s0170: {
    literal: 'Respectfully according to the ritual classics and former scholars\' explanations, to restore the Grand Ancestor\'s position—the position once corrected, the meaning admits no doubt.',
    idiomatic: 'According to the ritual classics and former scholars, restoring the Grand Ancestor\'s seat—once the seat is corrected, the meaning admits no doubt.',
  },
  s0171: {
    literal: 'Once the Grand Ancestor\'s position is corrected, the two lords of Eminence and Offerings must have a place to go.',
    idiomatic: 'Once the Grand Ancestor\'s seat is corrected, the tablets of Eminence and Offerings must have somewhere to go.',
  },
  s0172: {
    literal: 'Examining the fourteen memorials in detail, their intent has four points: first, store in the side chambers; second, place in a separate temple; third, move to the park tomb; fourth, enshrine in Xingsheng.',
    idiomatic: 'Examining the fourteen memorials, their intent has four points: store in side chambers; place in a separate temple; move to the park tomb; or enshrine in Xingsheng.',
  },
  s0173: {
    literal: 'Storing in side chambers means no term for offering and presentation—unlike the Zhou practice of storing in the two remote temples; ritual cannot be executed.',
    idiomatic: 'Storing in side chambers means no scheduled offerings—unlike the Zhou practice of the two remote temples; ritual cannot be done.',
  },
  s0174: {
    literal: 'Placing in a separate temple began with Wei Ming\'s proposal; it is truly not text of the Ritual Classics.',
    idiomatic: 'A separate temple began with Wei Ming\'s proposal; it is not in the Ritual Classics.',
  },
  s0175: {
    literal: 'Jin, though it established this meaning, thereafter also had no practitioners.',
    idiomatic: 'Jin established this idea, but thereafter no one practiced it.',
  },
  s0176: {
    literal: 'Moving to the park tomb disarranges ancestral-temple observance; having nothing to rely on, it greatly departs from classic intent and is insufficient as evidence.',
    idiomatic: 'Moving to the park tomb disrupts ancestral-temple observance, has no authority, and greatly departs from the classics—it cannot be cited.',
  },
  s0177: {
    literal: 'Only enshrining in the temple of Xingsheng, offering once in the years of di and xia—roughly the ritual of what was lost in ritual, obtaining the correction of change.',
    idiomatic: 'Only enshrining in the Xingsheng temple and offering once in di and xia years—roughly the rite for what ritual has lost, obtaining the proper change.',
  },
  s0178: {
    literal: 'The passage concluded."',
    idiomatic: 'The memorial ended.',
  },
  s0179: {
    literal: 'Third month of the nineteenth year, Supervising Secretary Chen Jing memorialized: "Di is the great joint sacrifice to ancestors and forbears; the Grand Ancestor\'s position must be honored to correct zhao-mu.',
    idiomatic: 'In the third month of the nineteenth year, Supervising Secretary Chen Jing memorialized: "Di is the great joint sacrifice to ancestors; the Grand Ancestor\'s seat must be honored to correct zhao-mu.',
  },
  s0180: {
    literal: 'This year encountering di, we fear it will be necessary to fix direction according to the deliberation hitherto.',
    idiomatic: 'This year a di is due; we fear the rites must follow the deliberation to date.',
  },
  s0181: {
    literal: '" An edict said: "" At that time Left Vice Director Yao Nanzong and others submitted fifty-seven memorials; an edict ordered the Chief Secretariat again to assemble all officials, fix by deliberation, and report.',
    idiomatic: '" An edict said: "" At that time Left Vice Director Yao Nanzong and others submitted fifty-seven memorials; an edict ordered the Chief Secretariat again to assemble all officials, decide by deliberation, and report.',
  },
  s0182: {
    literal: 'Minister of Revenue Wang Shao and fifty-five others memorialized in deliberation: "We ask to move and enshrine the spirit tablets of Xianzu and Yizu in the temples of Deming and Xingsheng, and separately add two chambers to install the spirit tablets.',
    idiomatic: 'Minister of Revenue Wang Shao and fifty-five others memorialized: "We ask to move the tablets of Xianzu and Yizu to the Deming and Xingsheng temples and separately add two chambers for the tablets.',
  },
  s0183: {
    literal: 'Because on the twenty-fourth the di sacrifice is held and temple repair is not finished, we ask within the walls of the Deming and Xingsheng temples temporarily to set up curtain-houses as two chambers and temporarily install the spirit tablets.',
    idiomatic: 'Because di falls on the twenty-fourth and temple repair is unfinished, we ask to set up temporary curtain-houses as two chambers within the Deming and Xingsheng temple compounds and temporarily install the tablets.',
  },
  s0184: {
    literal: 'When the added and repaired temple chambers are finished, per ritual move and enshrine the spirit tablets into the new temples.',
    idiomatic: 'When the new chambers are finished, move the tablets into them per ritual.',
  },
  s0185: {
    literal: 'Each year of di and xia, perform offering rites in their respective chambers.',
    idiomatic: 'In each di and xia year, perform offerings in their respective chambers.',
  },
  s0186: {
    literal: '" It was followed.',
    idiomatic: '" The emperor approved.',
  },
  s0187: {
    literal: 'Fifteenth day of that month, the spirit tablets of Xianzu and Yizu were moved and temporarily enshrined in the curtain-halls of the Deming and Xingsheng temples.',
    idiomatic: 'On the fifteenth of that month, the tablets of Xianzu and Yizu were moved and temporarily enshrined in the curtain-halls of the Deming and Xingsheng temples.',
  },
  s0188: {
    literal: 'Twenty-fourth day, offering at the Grand Temple.',
    idiomatic: 'On the twenty-fourth, offerings were made at the Grand Temple.',
  },
  s0189: {
    literal: 'From this point Emperor Jing began to occupy the east-facing honor; from Emperor Yuan downward they followed the left-zhao right-mu array.',
    idiomatic: 'From this point Emperor Jing took the east-facing honor; from Emperor Yuan downward they followed left-zhao right-mu.',
  },
  s0190: {
    literal: 'When the two ancestors\' new temples were completed, an edict said: "" Also an imperial pronouncement said: ""',
    idiomatic: 'When the two ancestors\' new temples were finished, an edict was issued; an imperial pronouncement followed.',
  },
  s0191: {
    literal: 'Tenth month, the Court of Imperial Sacrifices Ritual Office memorialized: "In di and xia prayer texts, the titles Emperor Muzong, Empress Xuande of the Wei clan, Emperor Jingzong, Emperor Wenzong, and Emperor Wuzong—because of former ordering by near kin, Muzong\'s chamber was called \'elder brother emperor,\' which does not match ritual text.',
    idiomatic: 'In the tenth month the Ritual Office memorialized: "In di and xia prayer texts, Emperor Muzong, Empress Xuande Wei, Emperor Jingzong, Emperor Wenzong, and Emperor Wuzong—because of former ordering by near kin, Muzong\'s chamber was called \'elder brother emperor,\' which does not match ritual text.',
  },
  s0192: {
    literal: 'The memorial of Compiler Zhu Chou and others stated: "\'Ritual orders honor to honor, not kin to kin.',
    idiomatic: 'Compiler Zhu Chou and others reported: "\'Ritual orders honor to honor, not kin to kin.',
  },
  s0193: {
    literal: 'For Your Majesty\'s prayer texts to the three chambers of Muzong, Jingzong, and Wuzong, we fear it is necessary only to say "the succeeding emperor, your subject so-and-so, announces to such-and-such an ancestor."',
    idiomatic: 'For Your Majesty\'s prayer texts to the three chambers of Muzong, Jingzong, and Wuzong, we fear they should say only "the succeeding emperor, your subject so-and-so, announces to such-and-such an ancestor."',
  },
  s0194: {
    literal: '\' We and others together examined the ritual classics; in meaning it is acceptable.',
    idiomatic: '\' We together examined the ritual classics; in meaning this is acceptable.',
  },
  s0195: {
    literal: '" It was followed.',
    idiomatic: '" The emperor approved.',
  },
  s0196: {
    literal: '—the xia sacrifice was offered at the Grand Temple.',
    idiomatic: '—and xia was offered at the Grand Temple.',
  },
  s0197: {
    literal: 'Recent precedent: at xia sacrifice and when the ruler personally worships at the suburban altar, one palace envoy was always ordered to lead the captured-state treasure to the altar place, thereby to display martial achievement.',
    idiomatic: 'Recent precedent: at xia sacrifice and when the ruler personally worshipped at the suburban altar, one palace envoy was ordered to lead the captured-state treasure to the altar to display martial achievement.',
  },
  s0198: {
    literal: 'On this occasion, because subjugating the state was a great affair, for a palace envoy to lead it was not fitting; therefore one ritual officer was ordered to take charge at the inner storehouse and escort it to the Grand Temple.',
    idiomatic: 'On this occasion, because subjugating a state was a great affair, a palace envoy leading it was improper; one ritual officer was ordered to take charge at the inner storehouse and escort it to the Grand Temple.',
  },
  s0199: {
    literal: 'Former observance: at Gaozu\'s temple, Prince of Huai\'an Wang Tong, Minister of Rites Prince of Hejian Wang Xiaogong, Right Vice Director of the Grand Secretariat in Shandong Circuit Duke of E Yin Kaishan, and Minister of Personnel Duke of Yu Liu Zhenghui received complementary sacrifice.',
    idiomatic: 'Former observance: at Gaozu\'s temple, Prince of Huai\'an Wang Tong, Minister of Rites Prince of Hejian Wang Xiaogong, Right Vice Director of the Shandong Grand Secretariat Duke of E Yin Kaishan, and Minister of Personnel Duke of Yu Liu Zhenghui received complementary sacrifice.',
  },
  s0200: {
    literal: 'At Taizong\'s temple, Minister of Works Duke of Liang Fang Xuanling, Right Vice Director Duke of Lai Du Ruhui, and Left Vice Director Duke of Shen Gao Shilian received complementary sacrifice.',
    idiomatic: 'At Taizong\'s temple, Fang Xuanling, Du Ruhui, and Gao Shilian received complementary sacrifice.',
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
if (data.metadata.chapter !== '026') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 026; standalone T ready (${Object.keys(T).length} entries).`
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
