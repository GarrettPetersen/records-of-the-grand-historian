#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.026, Rites 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/026.json';
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
    literal: 'In the third month, the Commissioner of Rites memorialized: "The Eastern Capital Grand Ancestral Temple lacks wooden spirit tablets; we request they be made for enshrinement.',
    idiomatic: 'Third month: the Commissioner of Rites reported that the Eastern Capital Grand Temple had no wooden spirit tablets and asked that they be made and enshrined.',
  },
  s0002: {
    literal: 'The passage concluded." Initially, Empress Wu had established three temples at the Eastern Capital to Gaozu, Taizong, and Gaozong.',
    idiomatic: 'The quote ended. Earlier, Wu Zetian had built three temples at Luoyang—to Gaozu, Taizong, and Gaozong.',
  },
  s0003: {
    literal: 'From Zhongzong onward, the Grand Temples of both capitals received seasonal offerings alike.',
    idiomatic: 'From Zhongzong on, both capitals\' Grand Temples were fed in all four seasons.',
  },
  s0004: {
    literal: 'After the Rebellion of Zhide, many wooden tablets were lost or missing and had not been enshrined.',
    idiomatic: 'After the An Lushan rebellion, many tablets were lost or never re-enshrined.',
  },
  s0005: {
    literal: 'Then the debaters were many, but the main thrusts were three: "The first says that the temples must be preserved, spirit-lord tablets established throughout, and offerings made seasonally.',
    idiomatic: 'Debate swelled, but three positions dominated: keep the temples, set up spirit-lords everywhere, and offer seasonally.',
  },
  s0006: {
    literal: 'The second says to build temples and set up tablets but preserve them without sacrifice; when the imperial carriage tours, offerings are made on the spot.',
    idiomatic: 'Second: build temples and tablets but do not sacrifice to them—when the emperor toured, he would offer on site.',
  },
  s0007: {
    literal: 'The third says to preserve the temples, bury the tablets, and when the carriage tours east, adorn the fasting carriage and convey the spirit tablets of the capital\'s collective temples thither.',
    idiomatic: 'Third: keep the temples, bury the tablets, and on an eastern tour load the capital\'s tablets onto the fasting carriage and carry them east.',
  },
  s0008: {
    literal: 'The passage concluded." The debaters all could not decide and the matter was dropped.',
    idiomatic: 'The quote ended. No faction prevailed, and the question lapsed.',
  },
  s0009: {
    literal: 'In the fourth month, Gui Chongjian, Bureau Director in the Provisioners Bureau, submitted a memorial:',
    idiomatic: 'Fourth month: Gui Chongjian, Director in the Provisioners Bureau, submitted a memorial.',
  },
  s0010: {
    literal: 'In the second month, Li Bo, Vice-Director of the Treasury in the eastern division, memorialized: "The spirit tablets of the Taiwei Palace should be returned for enshrinement in the Grand Temple.',
    idiomatic: 'Second month: Li Bo, eastern-division Vice-Director of the Treasury, had written that the Taiwei Palace tablets should return to the Grand Temple for enshrinement.',
  },
  s0011: {
    literal: 'The passage concluded." The edict was handed to Dongdu Resident Commissioner Zheng Yin to deliberate and report.',
    idiomatic: 'The quote ended. An edict sent the matter to Eastern Capital Resident Commissioner Zheng Yin for deliberation and report.',
  },
  s0012: {
    literal: 'Yin memorialized as follows:',
    idiomatic: 'Yin replied:',
  },
  s0013: {
    literal: 'The edict was handed to the relevant offices.',
    idiomatic: 'The edict went to the relevant offices.',
  },
  s0014: {
    literal: 'Wang Yanwei and other Masters of Rites of the Court of Imperial Sacrifices submitted a deliberation:',
    idiomatic: 'Wang Yanwei and other Court of Sacrifices Masters of Rites submitted a deliberation.',
  },
  s0015: {
    literal: 'Thereupon it was sent down to the Department of State Affairs for collective deliberation, and what the clerks debated largely agreed with Yanwei.',
    idiomatic: 'The Secretariat then convened a joint review; the clerks\' views largely matched Yanwei\'s.',
  },
  s0016: {
    literal: 'The vice-directors and directors each held to their views; some said "the spirit tablets should jointly be stored in the Taiwei Palace";',
    idiomatic: 'Directors and vice-directors split: some said the tablets should stay together in the Taiwei Palace;',
  },
  s0017: {
    literal: 'some said "they should together be buried and interred";',
    idiomatic: 'some that they should all be buried;',
  },
  s0018: {
    literal: 'some said "missing tablets should be made";',
    idiomatic: 'some that missing tablets should be carved anew;',
  },
  s0019: {
    literal: 'some said "when the carriage tours east, carry the capital\'s spirit tablets east with it."',
    idiomatic: 'some that on an eastern tour the capital\'s tablets should ride east with the emperor.',
  },
  s0020: {
    literal: 'All spoke from opinion, not grounded in canonical texts.',
    idiomatic: 'Everyone argued from convenience, not from the classics.',
  },
  s0021: {
    literal: 'In the end, because discussion was unsettled, nothing was carried out.',
    idiomatic: 'Debate deadlocked, and nothing was done.',
  },
  s0022: {
    literal: 'In the eighth month, the Secretariat memorialized: "The Eastern Capital Grand Temple\'s nine chambers have twenty-six spirit tablets in all; since An Lushan\'s rebellion, the Grand Temple was taken as a military camp and the spirit tablets were abandoned in the lanes; the relevant offices secretly gathered them in—they are now within a newly built small house inside the Taiwei Palace.',
    idiomatic: 'Eighth month: the Secretariat reported that the Eastern Capital Grand Temple\'s nine chambers had held twenty-six tablets; after An Lushan\'s revolt the temple became a barracks and tablets were left in the streets until officials quietly collected them—they now sat in a new shed inside the Taiwei Palace.',
  },
  s0023: {
    literal: 'The Grand Temple buildings remain and can be restored.',
    idiomatic: 'The temple buildings still stood and could be restored.',
  },
  s0024: {
    literal: 'In the Dahe era, Masters of Rites deliberated and held that the Eastern Capital should not set up spirit tablets; when the imperial carriage toured east, the tablets were carried along.',
    idiomatic: 'In Dahe, ritual officers had ruled that Luoyang should not keep its own tablets—that on eastern tours the emperor should carry tablets with him.',
  },
  s0025: {
    literal: 'To the present the practice has lingered and the temple has still not been rebuilt.',
    idiomatic: 'That expedient had lingered; the temple was still unrepaired.',
  },
  s0026: {
    literal: 'It is requested that the Department of State Affairs assemble the high ministers and ritual and academic officials for detailed deliberation.',
    idiomatic: 'They asked the Secretariat to gather ministers, ritualists, and scholars for a full review.',
  },
  s0027: {
    literal: 'If they are not to be set up anew, there must be a place to store them.',
    idiomatic: 'If tablets were not to be reinstalled, a proper storehouse was needed.',
  },
  s0028: {
    literal: 'If they are to be set up, it is requested that timber from dismantled great temples be used to rebuild.',
    idiomatic: 'If they were, timber from dismantled monasteries should fund the rebuild.',
  },
  s0029: {
    literal: 'Since a member of the imperial clan holds the post of eastern-resident commissioner, it is requested he be appointed Commissioner for Rebuilding the Eastern Capital Grand Temple to oversee repairs.',
    idiomatic: 'Because a prince held the eastern residency, he should be named commissioner to rebuild the Grand Temple and supervise repairs.',
  },
  s0030: {
    literal: 'The passage concluded." The edict approved and it was to be followed.',
    idiomatic: 'The quote ended. The throne approved.',
  },
  s0031: {
    literal: 'Third month, sixth year: Zheng Lu and other Masters of Rites memorialized: "The Eastern Capital Taiwei Palace has twenty spirit tablets; on the twenty-ninth day of the second month last year the Court of Rites analyzed and reported completion.',
    idiomatic: 'Sixth year, third month: Zheng Lu and other Masters of Rites wrote that twenty tablets remained in the Taiwei Palace and that the Court of Rites had finished its analysis on the twenty-ninth of the second month of the prior year.',
  },
  s0032: {
    literal: 'We respectfully received this month\'s seventh-day edict.',
    idiomatic: 'They had received this month\'s seventh-day edict.',
  },
  s0033: {
    literal: 'Your servants have now deliberated in detail with the academic officials and respectfully submit analysis as follows: the twelve tablets before Xianzu the Sagely Emperor, Empress Xuanzhuang, Yizu the Radiant Emperor, Empress Guangyi, Empress Wende, Emperor Gaozong the Heavenly August, Empress Zetian, Emperor Zhongzong the Great Sage and Great Filial, Empress Hexian, Empress Zhaocheng, Emperor Xiaojing, and Empress Jing\'ai of the Earth—kinship exhausted in rotation—should be transferred to the various Grand Temples and enshrined at the Xingsheng Temple.',
    idiomatic: 'After consulting scholars they proposed: twelve tablets—from Xianzu and Xuanzhuang through Yizu, Wende, Gaozong, Zetian, Zhongzong, Hexian, Zhaocheng, Xiaojing, and Jing\'ai—had passed the limit of mourning and should move to the capital temples and the Xingsheng shrine.',
  },
  s0034: {
    literal: 'In years of di and cha sacrifice, they receive a single offering together.',
    idiomatic: 'In di and cha years they would receive one joint offering.',
  },
  s0035: {
    literal: 'The Eastern Capital has no Xingsheng Temple for enshrinement; we request they be provisionally stored in the side chambers of the Grand Temple.',
    idiomatic: 'Luoyang had no Xingsheng Temple; they asked to lodge the tablets temporarily in the Grand Temple\'s side chambers.',
  },
  s0036: {
    literal: 'Fourteen tablets lack inscriptions; as the aforesaid tablets lack inscribed text, the prayer-and-announcement rite cannot be carried out.',
    idiomatic: 'Fourteen tablets bore no inscription, so the prayer of enshrinement could not be spoken.',
  },
  s0037: {
    literal: 'We have now deliberated with the ritual officers; we request that on the day of announcing removal they simply be interred in vacant ground within the old Taiwei Palace.',
    idiomatic: 'With ritual officers they agreed that on the day of removal those fourteen should be buried in unused ground inside the old Taiwei compound.',
  },
  s0038: {
    literal: 'Respectfully weighing the matter, it should accord with convenience.',
    idiomatic: 'That, they judged, best fit practical need.',
  },
  s0039: {
    literal: 'The passage concluded." Approved.',
    idiomatic: 'The quote ended. Approved.',
  },
  s0040: {
    literal: 'Duan Gui and thirty-nine other Masters of Rites submitted a deliberation:',
    idiomatic: 'Duan Gui and thirty-nine other Masters of Rites submitted a counter-memorial.',
  },
  s0041: {
    literal: 'In the ninth month of that year an edict:',
    idiomatic: 'That ninth month an edict went out—',
  },
  s0042: {
    literal: 'Minister of Works Xue Yuanshang and others deliberated:',
    idiomatic: 'Minister of Works Xue Yuanshang and others replied:',
  },
  s0043: {
    literal: 'Director of the Bureau of Personnel Zheng Ya and five others: "According to the Court of Rites memorial, it holds the Eastern Capital Grand Temple having been abandoned cannot be rebuilt, and the spirit tablets now in Taiwei Palace should be interred where they are housed.',
    idiomatic: 'Zheng Ya of Personnel and five colleagues: the Court of Rites had said the Eastern Capital temple was beyond repair and the Taiwei tablets should be buried where they lay.',
  },
  s0044: {
    literal: 'This deviates from canonical instruction; we dare not concur.',
    idiomatic: 'That strayed from the classics; they would not sign.',
  },
  s0045: {
    literal: 'Your servants therefore submitted a separate deliberation requesting repair and enshrinement of tablets, all according to canonical rites, the same as Commissioner of Rites Yan Zhenqing\'s memorial.',
    idiomatic: 'They filed a separate opinion—to restore the temple, remake and enshrine the tablets per canon, matching Yan Zhenqing\'s memorial.',
  },
  s0046: {
    literal: 'Your servants and the high ministers deliberated again and all held the temples should be rebuilt and tablets cannot be interred— the same as your servants\' separate memorial.',
    idiomatic: 'In renewed debate with the grandees, all agreed: rebuild the temple, do not bury the tablets—their view matched the separate memorial.',
  },
  s0047: {
    literal: 'But collective deliberation still doubted that east and west each setting up tablets might involve the meaning of a temple having two lords; they requested rebuilding the temple with vacant chambers and storing the Taiwei housed tablets in side chambers.',
    idiomatic: 'Yet many still feared two capitals each keeping tablets implied two lords in one temple; they proposed restoring empty chambers and housing the Taiwei tablets in side rooms.',
  },
  s0048: {
    literal: 'Respectfully, among the six spirit-lord positions within are unfilleted ancestors; to use relocation rites now still does not accord with ritual.',
    idiomatic: 'Six of those spirit-lords were unfilleted forebears; applying removal rites to them still seemed uncanonical.',
  },
  s0049: {
    literal: 'Your servants still dare not sign the collective memorial, because doubts remain.',
    idiomatic: 'They still refused to endorse the joint report while doubt remained.',
  },
  s0050: {
    literal: 'The passage concluded."',
    idiomatic: 'The quote ended.',
  },
  s0051: {
    literal: 'Zheng Sui and seven others, Great Learning Masters direct in the Hongwen Pavilion: "In discussing great affairs of state, one must root them in rectitude and the classics, to reach the middle way.',
    idiomatic: 'Zheng Sui of the Grand Academy and six Hongwen colleagues: statecraft must stand on rectitude and the classics and aim at the mean.',
  },
  s0052: {
    literal: 'The sage dynasty takes broad filial piety first and obtaining the rites as precious—and how could ministers not answer with the classics?',
    idiomatic: 'This dynasty prizes filial piety and true ritual—how could ministers answer with anything but the canon?',
  },
  s0053: {
    literal: 'The three arguments and six antecedents have already been detailed in the prior deliberation.',
    idiomatic: 'Three positions and six precedents had already been laid out.',
  },
  s0054: {
    literal: 'Again receiving Heaven\'s query, we set forth the various schools\' theories, seeking in canonical instruction, examining the mean—temples have text requiring repair, tablets have no text permitting establishment.',
    idiomatic: 'Asked again from the throne, they surveyed every school against the classics: temples must be repaired; tablets could not simply be installed.',
  },
  s0055: {
    literal: 'Why is this so?',
    idiomatic: 'For what reason?',
  },
  s0056: {
    literal: 'Orthodox classics and histories—both capitals\' temples can be verified.',
    idiomatic: 'Because orthodox classics and histories attest temples in both capitals.',
  },
  s0057: {
    literal: 'The Rites says "the Son of Heaven does not divine the site of the Grand Temple" and "when one selects a day to divine the site for founding the state, the ancestral temples can be known."',
    idiomatic: 'The Rites says the Son of Heaven does not divine the Grand Temple\'s site, and that when he divines where to found the state, the temples are already implied.',
  },
  s0058: {
    literal: 'Then the theory of abandoning temples is perhaps not what should be abandoned.',
    idiomatic: 'To abandon a temple, then, is what ought not be abandoned.',
  },
  s0059: {
    literal: 'We respectfully note the three classics of Odes, Documents, and Rites and the two histories of Han—both capitals set up temples, and the system of enshrining tablets has long been practiced.',
    idiomatic: 'The Odes, Documents, Rites, and both Han histories show both capitals with temples and long-standing tablet rites.',
  },
  s0060: {
    literal: 'We dare clarify the evidence and set aside literary ornament; relying on canonical text, not altering prior views—the Eastern Capital Grand Temple should be restored, while old tablets should be interred at the place stored in Taiwei Palace.',
    idiomatic: 'They cited text plainly: restore the Eastern Capital Grand Temple; bury the old tablets where the Taiwei Palace had held them.',
  },
  s0061: {
    literal: 'When the emperor has affairs at Luoyang, then with fasting carriage convey the tablets.',
    idiomatic: 'When the emperor went to Luoyang, a fasting carriage would carry the tablets.',
  },
  s0062: {
    literal: 'The passage concluded."',
    idiomatic: 'The quote ended.',
  },
  s0063: {
    literal: 'Gu Dezang, Master of Rites, deliberated:',
    idiomatic: 'Gu Dezang, Master of Rites, also submitted.',
  },
  s0064: {
    literal: 'Dezang also had two memorials for detailed deliberation to the Secretariat and Court of Rites, both recorded below.',
    idiomatic: 'Dezang filed two further opinions to the Secretariat and Court of Rites, copied below.',
  },
  s0065: {
    literal: 'The first states:',
    idiomatic: 'The first read:',
  },
  s0066: {
    literal: 'The second states:',
    idiomatic: 'The second read:',
  },
  s0067: {
    literal: 'The statute said: Sixth year, third month, once the day was fixed and ritual officers had proceeded, soon Wuzong passed away and the matter was dropped.',
    idiomatic: 'An edict had fixed a date in the sixth year\'s third month; ritual officers had begun—then Wuzong died and the work slept.',
  },
  s0068: {
    literal: 'When Xuanzong took the throne, at last the Taiwei Palace spirit tablets were welcomed for enshrinement in the Eastern Capital Grand Temple; di and cha rites—all spirit tablets were jointly offered before the Great Ancestor.',
    idiomatic: 'Xuanzong at last welcomed the Taiwei tablets into the Eastern Capital Grand Temple; at di and cha all tablets were offered together before the Great Ancestor.',
  },
  s0069: {
    literal: 'The Zhenguan Rites: at cha offering, meritorious subjects were paired in offering in the temple courtyard; at di offering they were not paired.',
    idiomatic: 'The Zhenguan Rites paired meritorious subjects in the courtyard at cha, not at di.',
  },
  s0070: {
    literal: 'At that time the ordinance stated on cha and di days meritorious subjects all received paired offering.',
    idiomatic: 'A later ordinance allowed pairing at both cha and di.',
  },
  s0071: {
    literal: 'When a di sacrifice was about to be performed, the relevant offices requested assembling ritual and academic officials for deliberation; Wei Ting, Director of the Court of Imperial Sacrifices, and eighteen others deliberated:',
    idiomatic: 'Before a scheduled di, the offices convened ritualists and scholars; Director Wei Ting and eighteen others argued:',
  },
  s0072: {
    literal: 'Of old kings possessed the four seas yet did not daily present upper meals at the ancestral temple, fearing excess in ritual.',
    idiomatic: 'Ancient kings held the four seas yet did not daily feast the ancestors, lest ritual grow excessive.',
  },
  s0073: {
    literal: 'Thus it is said: "Spring and autumn offerings—at the proper seasons one thinks of them."',
    idiomatic: 'Hence: spring and autumn offerings—memory at the proper season.',
  },
  s0074: {
    literal: 'As for ministers with great merit enjoying emoluments, afterward filial sons observe rite with pure grain and abundant offerings—li, si, zheng, chang—uninterrupted through four seasons; at the state\'s great cha they could also be paired.',
    idiomatic: 'Ministers of great merit, once enfeoffed, received seasonal li, si, zheng, and chang from filial heirs; at the great cha the state might pair them too.',
  },
  s0075: {
    literal: 'Hence at di and seasonal offerings meritorious subjects all should not participate.',
    idiomatic: 'But at di and ordinary seasonal rites they should not appear.',
  },
  s0076: {
    literal: 'Thus Zhou Rites officials of the six achievements are paired only at the great zheng.',
    idiomatic: 'Zhou Rites pairs the six grades of merit only at the great zheng.',
  },
  s0077: {
    literal: 'Former scholars all take great zheng as cha sacrifice.',
    idiomatic: 'Earlier scholars identified great zheng with cha.',
  },
  s0078: {
    literal: 'Gao Tanglong, Yu Weizhi, and many others followed Zheng Xuan\'s learning; none treated it as seasonal offering.',
    idiomatic: 'Gao Tanglong, Yu Weizhi, and others followed Zheng Xuan—none applied it to seasonal feasts.',
  },
  s0079: {
    literal: 'Also Han and Wei cha sacrifices were all in the tenth month; Jin ritual officers wished to use the seventh month\'s yin offering—Left Vice Director Kong Anguo submitted remonstrance; those dismissed were not few.',
    idiomatic: 'Han and Wei held cha in the tenth month; Jin officers wanted the seventh-month yin rite—Kong Anguo remonstrated, and many lost office.',
  },
  s0080: {
    literal: 'At Liang\'s beginning meritorious subjects were mistakenly paired at di; Left Assistant Censor He Tongzhi refuted—Emperor Wu approved and followed.',
    idiomatic: 'Early Liang wrongly paired merit at di; He Tongzhi objected, and Emperor Wu agreed.',
  },
  s0081: {
    literal: 'Down through Zhou and Qi, all followed this rite.',
    idiomatic: 'Northern Zhou and Qi kept the same rule.',
  },
  s0082: {
    literal: 'We hold that the great and small yin offerings twice in five years accord with Heaven\'s way; one great and one small, the general human view—at the small, ministers do not participate; at the great, meritorious subjects are included.',
    idiomatic: 'Twice in five years—great and small yin—matches heaven\'s rhythm: the small excludes ministers; the great includes merit.',
  },
  s0083: {
    literal: 'Now ritual: di without meritorious subjects—we hold ritual cannot be altered.',
    idiomatic: 'To pair merit at di would break ritual—and ritual, they said, must not bend.',
  },
  s0084: {
    literal: 'The passage concluded." Thereupon an edict revised the ordinance to follow ritual.',
    idiomatic: 'The quote ended. An edict brought the ordinance back in line with the classics.',
  },
  s0085: {
    literal: 'In the Kaiyuan era when rites were revised, again di and cha both allowed meritorious subjects paired offering.',
    idiomatic: 'Kaiyuan\'s ritual revision again allowed merit at both di and cha.',
  },
  s0086: {
    literal: 'Tenth month of Gaozong—about to perform cha offering at the Grand Temple.',
    idiomatic: 'Gaozong\'s tenth month: a cha at the Grand Temple was due.',
  },
  s0087: {
    literal: 'Debaters cited the Rites Weft "cha every three years, di every five" and Gongyang "great yin offerings twice in five years"—arguments crossed and none could decide.',
    idiomatic: 'Scholars cited the Rites Weft—cha every three years, di every five—and Gongyang\'s "twice in five years"; no line prevailed.',
  },
  s0088: {
    literal: 'Shi Can and other Great Learning Masters: "According to Rites Records orthodox commentary citing Zheng Xuan\'s "Di and Cha Record": "Springs and Autumns: Duke Xi died in the thirty-third year, twelfth month.',
    idiomatic: 'Shi Can and academy colleagues cited Zheng Xuan\'s Di and Cha Record in the Rites commentary: Duke Xi of Lu died in his thirty-third year, twelfth month.',
  },
  s0089: {
    literal: 'Duke Wen\'s second year, eighth month, day dingmao—great offering at the Grand Temple.',
    idiomatic: 'In Wen\'s second year, eighth month, day dingmao, a great offering at the Grand Temple.',
  },
  s0090: {
    literal: 'Gongyang asks: what is great offering?',
    idiomatic: 'Gongyang asks: what is a great offering?',
  },
  s0091: {
    literal: 'Xia.',
    idiomatic: 'Joint offering.',
  },
  s0092: {
    literal: 'The passage concluded." Thus three years\' mourning concluded; the new lord\'s second year should cha, the next year di at the collective temples.',
    idiomatic: 'The quote ended. Three years\' mourning done, the new ruler cha\'d in year two and di\'d at the group temples in year three.',
  },
  s0093: {
    literal: 'Duke Xi and Duke Xuan\'s eighth year both have di—so later di is five years from former di.',
    idiomatic: 'Xi and Xuan both di\'d in year eight—five years between di rites.',
  },
  s0094: {
    literal: 'By this determination: new lord year two cha, year three di.',
    idiomatic: 'So: year two cha, year three di.',
  },
  s0095: {
    literal: 'From then on, great yin twice in five years—year six cha, year eight di.',
    idiomatic: 'Thereafter, twice in five years: year six cha, year eight di.',
  },
  s0096: {
    literal: 'Also Duke Zhao\'s tenth year—Qi Gui died; year thirteen mourning concludes and should cha, but for the Pingqiu assembly—in winter the duke went to Jin.',
    idiomatic: 'Duke Zhao year ten: Qi Gui died; year thirteen should have seen cha, but the Pingqiu congress sent him to Jin that winter.',
  },
  s0097: {
    literal: 'Year fourteen cha, year fifteen di—the Documents says "affairs at Wugong"—that is it.',
    idiomatic: 'Year fourteen cha, fifteen di—the Annals\' "affairs at Wugong."',
  },
  s0098: {
    literal: 'Year eighteen cha, year twenty di.',
    idiomatic: 'Year eighteen cha, twenty di.',
  },
  s0099: {
    literal: 'Year twenty-three cha, year twenty-five di.',
    idiomatic: 'Year twenty-three cha, twenty-five di.',
  },
  s0100: {
    literal: 'Duke Zhao\'s twenty-fifth year "affairs at Xiang Palace"—that is it.',
    idiomatic: 'Zhao\'s twenty-fifth year—"affairs at Xiang Palace"—marks the same pattern.',
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
