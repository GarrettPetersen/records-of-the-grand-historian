#!/usr/bin/env node
/** Batch 7: s0601–s0700 (Jiutangshu ch.030, Rites 6) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/030.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 601;
const END = 700;

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
  s0601: {
    literal: 'Not establishing successive temple removal is not the means to show people that affection diminishes with distance;',
    idiomatic: 'Failing to establish successive temple removal is not the way to show that affection diminishes with distance;',
  },
  s0602: {
    literal: 'violating the five-temple system is not the means to show people that branches differ;',
    idiomatic: 'violating the five-temple system is not the way to show that branches differ;',
  },
  s0603: {
    literal: 'leaving the Grand Ancestor\'s seat empty is not the means to show people where honor belongs.',
    idiomatic: 'leaving the Grand Ancestor\'s seat empty is not the way to show where honor belongs.',
  },
  s0604: {
    literal: 'By this the rite was abandoned.',
    idiomatic: 'This is why the rite fell into disuse.',
  },
  s0605: {
    literal: 'According to the Rites: "When the father was a common officer and the son becomes emperor, sacrifice him with Son-of-Heaven rites but bury him with common-officer rites.',
    idiomatic: 'According to the Rites: "When the father was a common officer and the son becomes emperor, sacrifice him with imperial rites but bury him with common-officer rites.',
  },
  s0606: {
    literal: '" Today the Offering Ancestor is in the distant-temple class, the Majestic Ancestor likewise; before Tang received the Mandate, they were still treated with common-officer rites.',
    idiomatic: '" Today Xianzu is in the distant-temple class, Yizu likewise; before Tang received the Mandate, they were still treated with common-officer rites.',
  },
  s0607: {
    literal: 'Therefore Gaozu and Taizong sacrificed to them with Son-of-Heaven rites and did not dare displace them into the Grand Ancestor\'s seat.',
    idiomatic: 'Hence Gaozu and Taizong sacrificed to them with imperial rites and did not dare displace them into the Grand Ancestor\'s seat.',
  },
  s0608: {
    literal: 'Now to change this—would it not overturn the order established by former kings?',
    idiomatic: 'To change this now—would it not overturn the order established by former kings?',
  },
  s0609: {
    literal: 'In ancient times, when Zhou possessed All under Heaven, it posthumously ennobled Great King and King Ji with Son-of-Heaven rites; when kinship was exhausted in sacrifice, their temples were removed.',
    idiomatic: 'In antiquity, when Zhou possessed the realm, it posthumously ennobled Great King and King Ji with imperial rites; when kinship was exhausted in sacrifice, their temples were removed.',
  },
  s0610: {
    literal: 'When Han possessed All under Heaven, it honored the Supreme Emperor with Son-of-Heaven rites; when kinship was exhausted, his temple was removed.',
    idiomatic: 'When Han possessed the realm, it honored the Supreme Emperor with imperial rites; when kinship was exhausted, his temple was removed.',
  },
  s0611: {
    literal: 'When Tang possessed All under Heaven, it posthumously ennobled the Offering and Majestic ancestors with Son-of-Heaven rites; when kinship was exhausted, their temples were removed.',
    idiomatic: 'When Tang possessed the realm, it posthumously ennobled the Offering and Majestic ancestors with imperial rites; when kinship was exhausted, their temples were removed.',
  },
  s0612: {
    literal: 'It is clear that they cannot take the Grand Ancestor\'s place.',
    idiomatic: 'Clearly they cannot take the Grand Ancestor\'s place.',
  },
  s0613: {
    literal: 'Again, in the Rites of Zhou of Zhou distinguish distant temples for former lords and distant temples for former kings.',
    idiomatic: 'Again, the Rites of Zhou distinguish distant temples for former lords and distant temples for former kings.',
  },
  s0614: {
    literal: 'The migrated tablets of former lords removed from their halls were stored in Hou Ji\'s temple—were these Zhou\'s distant temples before receiving the Mandate?',
    idiomatic: 'Tablets of former lords removed from their halls were stored in Hou Ji\'s temple—were these Zhou\'s distant temples before receiving the Mandate?',
  },
  s0615: {
    literal: 'The migrated tablets of former kings were stored in King Wen\'s temple—were these Zhou\'s distant temples after receiving the Mandate?',
    idiomatic: 'Tablets of former kings were stored in King Wen\'s temple—were these Zhou\'s distant temples after receiving the Mandate?',
  },
  s0616: {
    literal: 'Therefore the two distant temples served to distinguish different temple lines.',
    idiomatic: 'Hence the two distant temples served to distinguish different temple lines.',
  },
  s0617: {
    literal: 'Today the distant temples from the Offering Ancestor downward correspond to the former-lord class;',
    idiomatic: 'Today the distant temples from Xianzu downward correspond to the former-lord class;',
  },
  s0618: {
    literal: 'Those from the Grand Ancestor downward correspond to the former-king class.',
    idiomatic: 'those from the Grand Ancestor downward correspond to the former-king class.',
  },
  s0619: {
    literal: 'Your servant asks that separate temples be built to house the two ancestors, thus practicing Zhou rites and restoring the ancient way.',
    idiomatic: 'I ask that separate temples be built to house the two ancestors, thus practicing Zhou rites and restoring the ancient way.',
  },
  s0620: {
    literal: 'Thus the Han rites were arrayed Zhou;',
    idiomatic: 'Thus Han rites followed Zhou;',
  },
  s0621: {
    literal: 'Wei rites were arrayed Han;',
    idiomatic: 'Wei rites followed Han;',
  },
  s0622: {
    literal: 'Sui rites were arrayed Wei.',
    idiomatic: 'Sui rites followed Wei.',
  },
  s0623: {
    literal: 'Each established three temples, with two distant temples.',
    idiomatic: 'All established three temples with two distant temples.',
  },
  s0624: {
    literal: 'They also set up four private temples at Nanyang, likewise a Later Han institution.',
    idiomatic: 'They also established four private temples at Nanyang, likewise a Later Han institution.',
  },
  s0625: {
    literal: 'The idea is that as a man\'s son, one serves the great lineage and lowers one\'s private kin; hence private temples serve the root lineage.',
    idiomatic: 'The idea is that as a man\'s son, one serves the great lineage and subordinates private kin; hence private temples serve the root lineage.',
  },
  s0626: {
    literal: 'The the Grand Temple honors the orthodox succession.',
    idiomatic: 'The Grand Temple honors the orthodox succession.',
  },
  s0627: {
    literal: 'Though ancient and modern times differ in time and rites differ in refinement, those who uphold ritual feeling and inquire into ritual roots all penetrate its changes and weigh what to enact.',
    idiomatic: 'Though ancient and modern differ in time and rites differ in refinement, those who uphold ritual feeling and inquire into ritual roots all penetrate its changes and weigh what to enact.',
  },
  s0628: {
    literal: 'Thus, in elevating what is honored above, the Grand Ancestor is set in honor above;',
    idiomatic: 'Thus in elevating what is honored above, the Grand Ancestor is set in honor above;',
  },
  s0629: {
    literal: 'In exhausting diminution below, distant-temple tablets are exhausted in kinship below;',
    idiomatic: 'in exhausting diminution below, distant-temple tablets are exhausted in kinship below;',
  },
  s0630: {
    literal: 'And in taking the middle position between them, the Son of Heaven holds the distant temples in the center.',
    idiomatic: 'and in taking the middle position between them, the Son of Heaven holds the distant temples in the center.',
  },
  s0631: {
    literal: 'Supervisor of Works Zhang Jian and others submitted: "Formerly Yin and Zhou took Qi and Xun as the first enfeoffed ancestors who were not removed; tablets of destroyed temples were all descendants of Qi and Xun, so zhao and mu were offered together and honor and baseness did not err.',
    idiomatic: 'Supervisor of Works Zhang Jian and others submitted: "Formerly Yin and Zhou took Qi and Xun as the first enfeoffed ancestors who were not removed; tablets of destroyed temples were all descendants of Qi and Xun, so zhao and mu were offered together and senior and junior lines did not err.',
  },
  s0632: {
    literal: 'As for the Xia took Yu as first enfeoffed, he became the ancestor not removed.',
    idiomatic: 'As the Xia took Yu as first enfeoffed, he became the ancestor not removed.',
  },
  s0633: {
    literal: 'Therefore the Xia\'s five temples were only Yu with two zhao and two mu.',
    idiomatic: 'Hence the Xia\'s five temples were only Yu with two zhao and two mu.',
  },
  s0634: {
    literal: 'Thereupon, Gun\'s kinship was exhausted and his tablet was already removed.',
    idiomatic: 'From this, Gun\'s kinship was exhausted and his tablet was already removed.',
  },
  s0635: {
    literal: 'The Zuo Commentary likewise states "Yu did not precede Gun," enough to show that among removed tablets, those in the middle honored above the first enfeoffed ancestor also held places in the joint offering.',
    idiomatic: 'The Zuo Commentary also says "Yu did not precede Gun," sufficient to show that among removed tablets, those in the middle honored above the first enfeoffed ancestor also held places in the joint offering.',
  },
  s0636: {
    literal: 'Again, Jin, Song, Qi, Liang, Northern Qi, Zhou, and Sui histories show that from the Grand Ancestor downward all shared di and he sacrifices alike, never limiting removed and destroyed tablets.',
    idiomatic: 'Again, Jin, Song, Qi, Liang, Northern Qi, Zhou, and Sui histories show that from the Grand Ancestor downward all shared di and he alike, never limiting removed and destroyed tablets.',
  },
  s0637: {
    literal: 'We respectfully submit that across eight dynasties north and south there were great scholars; on great matters of the ancestral temples deliberation was surely thorough—verified in histories, their rites were unanimous.',
    idiomatic: 'We submit that across eight dynasties north and south there were great scholars; on great matters of the ancestral temples deliberation was surely thorough—verified in histories, their rites were unanimous.',
  },
  s0638: {
    literal: 'Again, examining Wei, Jin, Song, Qi, Liang, Northern Qi, Zhou, and Sui precedents and what the Zhenguan, Xianqing, and Kaiyuan Rites describe, di and he sacrifices alike left the east-facing seat vacant.',
    idiomatic: 'Again, examining Wei, Jin, Song, Qi, Liang, Northern Qi, Zhou, and Sui precedents and what the Zhenguan, Xianqing, and Kaiyuan Rites describe, di and he alike left the east-facing seat vacant.',
  },
  s0639: {
    literal: 'Having long been practiced long, it truly settles popular feeling.',
    idiomatic: 'Having been practiced long, it truly settles popular feeling.',
  },
  s0640: {
    literal: 'Moreover, the Grand Ancestor occupies the first chamber of the clear temple; though his tablet is not removed for a hundred generations and forever receives seasonal offerings, matching Heaven and Earth on high, in suburban and temple rites nothing is not correct.',
    idiomatic: 'Moreover, the Grand Ancestor occupies the first chamber of the clear temple; though his tablet is not removed for a hundred generations and forever receives seasonal offerings, matching Heaven and Earth above, in suburban and temple rites nothing is not correct.',
  },
  s0641: {
    literal: 'If at di and he sacrifices times he temporarily takes a place in the zhao and mu array, lowering himself to extend filial piety and serve ancestors, is this not the way of Yu earnestly revering Gun?',
    idiomatic: 'If at di and he times he temporarily takes a place in the zhao-mu array, lowering himself to extend filial piety and serve ancestors, is this not the way of Yu earnestly revering Gun?',
  },
  s0642: {
    literal: 'This is also the meaning by which Wei, Jin, Zhou, and Sui Grand Ancestors did not dare use the low to disdain the high.',
    idiomatic: 'It is also the meaning by which Wei, Jin, Zhou, and Sui Grand Ancestors did not dare use the low to disdain the high.',
  },
  s0643: {
    literal: 'Some debaters wish to move the two ancestors to the Xingsheng Temple, or request separate chambers built and offered at di and he sacrifices years.',
    idiomatic: 'Some debaters wish to move the two ancestors to the Xingsheng Temple, or request separate chambers built and offered at di and he years.',
  },
  s0644: {
    literal: '"He" means "union."',
    idiomatic: 'He means "union."',
  },
  s0645: {
    literal: 'This would constitute divided offerings, greatly at odds with ritual intent.',
    idiomatic: 'This would be divided offerings, greatly at odds with ritual intent.',
  },
  s0646: {
    literal: 'Others wish to store them in the west side chambers, never attaining sacrifice—no different from Han burial in the garden, especially impossible.',
    idiomatic: 'Others wish to store them in the west side chambers, never reaching sacrifice—no different from Han burial in the garden, especially impossible.',
  },
  s0647: {
    literal: 'We venture to cite the canonical classics, examine old histories, and ask that the Offering and Majestic ancestors join the Grand Ancestor in the zhao and mu places while the east-facing seat remains vacant."',
    idiomatic: 'We venture to cite the canonical classics, examine old histories, and ask that the Offering and Majestic ancestors join the Grand Ancestor in the zhao-mu places while the east-facing seat remains vacant."',
  },
  s0648: {
    literal: 'Director of Merit in the Ministry Pei Shu presented: "Rites must establish a lineage head to gather the clan; the east-facing lord is likewise so.',
    idiomatic: 'Director of Merit Pei Shu submitted: "Rites must establish a lineage head to gather the clan; the east-facing lord is likewise so.',
  },
  s0649: {
    literal: 'If they are enshrined in a distant temple, would there not be a gap in the middle, unequal above and not of one kind?',
    idiomatic: 'If enshrined in a distant temple, would there not be a gap in the middle, unequal above and not of one kind?',
  },
  s0650: {
    literal: 'If the west place is always vacant, the Grand Ancestor is forever displeased in zhao and mu;',
    idiomatic: 'If the west place is always vacant, the Grand Ancestor is forever displeased in zhao-mu;',
  },
  s0651: {
    literal: 'If separate temples have separate offerings, at he feasting what lord unites the joint meal?',
    idiomatic: 'if separate temples have separate offerings, at he feasting what lord unites the joint meal?',
  },
  s0652: {
    literal: 'Forever to close them like Jiang Yuan, then pushing auspicious and dire omens with nothing to do.',
    idiomatic: 'Forever closing them like Jiang Yuan, then pushing auspicious and dire omens with nothing to do.',
  },
  s0653: {
    literal: 'The Rites state: "Cherish kin therefore honor ancestors, honor ancestors therefore respect the lineage head, respect the lineage head therefore gather the clan"—hence ancestral temples are strict and altars of soil and grain are weighty.',
    idiomatic: 'The Rites say: "Cherish kin therefore honor ancestors, honor ancestors therefore respect the lineage head, respect the lineage head therefore gather the clan"—hence ancestral temples are strict and altars of soil and grain are weighty.',
  },
  s0654: {
    literal: '\' Thereupon it follows that above the Grand Ancestor there are again posthumously honored ancestors—would not the meaning of cherishing kin and honoring ancestors be violated?',
    idiomatic: '\' From this it follows that above the Grand Ancestor there are again posthumously honored ancestors—would not the meaning of cherishing kin and honoring ancestors be violated?',
  },
  s0655: {
    literal: 'Outside the Grand Temple, lightly to set separate offering temples—would ancestral temples not be lax and altars of soil and grain not be light?',
    idiomatic: 'Outside the Grand Temple lightly to set separate offering temples—would ancestral temples not be lax and altars of soil and grain not be light?',
  },
  s0656: {
    literal: 'Moreover, the Han chancellor Wei Xuancheng asked to bury in the garden; Jin recluse Yu Xi asked to bury in the space between the temple stairways.',
    idiomatic: 'Moreover, Han Chancellor Wei Xuancheng asked to bury in the garden; Jin recluse Yu Xi asked to bury in the space between the temple stairways.',
  },
  s0657: {
    literal: 'Xi also cited the Zuo Commentary: in antiquity former kings daily sacrificed to ancestors and fathers, monthly to great-great-grandfathers, seasonal offerings including the two distant temples, yearly he including altars and mounds, final di including suburban, ancestral, and stone-chamber spirits.',
    idiomatic: 'Xi also cited the Zuo Commentary: ancient former kings daily sacrificed to ancestors and fathers, monthly to great-great-grandfathers, seasonal offerings including the two distant temples, yearly he including altars and mounds, final di including suburban, ancestral, and stone-chamber spirits.',
  },
  s0658: {
    literal: 'This means that above the suburban ancestral spirit there is again the stone-chamber ancestor—this is nearest in kinship.',
    idiomatic: 'This means above the suburban ancestral spirit there is again the stone-chamber ancestor—this is nearest in kinship.',
  },
  s0659: {
    literal: 'But when they deliberated where the stone chamber should stand, there was no standard.',
    idiomatic: 'But when they debated where the stone chamber should stand, there was no standard.',
  },
  s0660: {
    literal: 'Xi asked to place it in the side chambers; your servant deems the stone chamber can be cited, but the way to situate it is not settled.',
    idiomatic: 'Xi asked to place it in the side chambers; I deem the stone chamber can be cited, but the way to situate it is not settled.',
  },
  s0661: {
    literal: 'For what reason?',
    idiomatic: 'Why?',
  },
  s0662: {
    literal: 'Side chambers signify placing removed tablets below the Grand Ancestor, not installing tablets above the Grand Ancestor in storage.',
    idiomatic: 'Side chambers mean placing removed tablets below the Grand Ancestor, not installing tablets above the Grand Ancestor in storage.',
  },
  s0663: {
    literal: 'Never has the humble occupied the correct position while the honored dwells at the side.',
    idiomatic: 'Never has the low occupied the correct position while the honored dwells at the side.',
  },
  s0664: {
    literal: 'On examining reason and the heart, I fear it is not acceptable.',
    idiomatic: 'Examining reason and the heart, I fear it is not acceptable.',
  },
  s0665: {
    literal: 'Now if a stone chamber is built in the garden mausoleum and spirit tablets moved for eternal peace, adopting Han and Jin old statutes while still having one offering at di and he sacrifices, repairing the broken remnants of ancient rites as a statute of our dynasty—perhaps the correct change of the Spring and Autumn, with movement hitting the center."',
    idiomatic: 'Now if a stone chamber is built in the garden mausoleum and spirit tablets moved for eternal peace, adopting Han and Jin old statutes while still having one offering at di and he, repairing the broken remnants of ancient rites as a statute of our dynasty—perhaps the correct change of the Spring and Autumn, with movement hitting the center."',
  },
  s0666: {
    literal: 'Reviewer of Works in the Ministry Chen Jing presented: "Jing formerly as Erudite of the Court of Imperial Sacrifices on the fourth day of the ninth month of the second year of Jianzhong already presented a memorial on the placement of the Offering and Majestic ancestors at he feasting and asked that the hundred officials broadly gather doubts.',
    idiomatic: 'Reviewer of Works Chen Jing submitted: "Jing formerly as Erudite of the Court of Imperial Sacrifices on the fourth day of the ninth month of the second year of Jianzhong already memorialized on the placement of the Offering and Majestic ancestors at he feasting and asked that the hundred officials broadly gather doubts.',
  },
  s0667: {
    literal: 'At that time Ritual Commissioner Yan Zhenqing therefore presented a memorial differing from Jing\'s; Jing\'s proposal was not enacted.',
    idiomatic: 'At that time Ritual Commissioner Yan Zhenqing therefore submitted a memorial differing from Jing\'s; Jing\'s proposal was not enacted.',
  },
  s0668: {
    literal: 'We observe the edict of the twenty-eighth day of the eleventh month of last year ordering what Director of the Court of Imperial Sacrifices Pei Yu submitted, broadly agreeing with Jing\'s proposal.',
    idiomatic: 'We see the edict of the twenty-eighth day of the eleventh month of last year ordering what Director of the Court of Imperial Sacrifices Pei Yu submitted, broadly agreeing with Jing\'s proposal.',
  },
  s0669: {
    literal: 'We respectfully submit that Emperor Xingsheng was great-great-grandfather to the Offering Ancestor and great-great-great-grandfather to the Majestic Ancestor.',
    idiomatic: 'We submit that Emperor Xingsheng was great-great-grandfather to the Offering Ancestor and great-great-great-grandfather to the Majestic Ancestor.',
  },
  s0670: {
    literal: 'That a great-great-grandson to be enshrined in the temples of great-great and great-great-great grandfathers—is ritual impossible?',
    idiomatic: 'For a great-great-grandson to be enshrined in the temples of great-great and great-great-great grandfathers—is ritual impossible?',
  },
  s0671: {
    literal: 'Truly, it is the great accord of human feeling."',
    idiomatic: 'Truly it is the great accord of human feeling."',
  },
  s0672: {
    literal: 'Assistant to the Metropolitan Governor Wei Wu presented: "Generally he is every three years, di every five years.',
    idiomatic: 'Assistant Metropolitan Governor Wei Wu submitted: "Generally he is every three years, di every five years.',
  },
  s0673: {
    literal: '"He" means all temples gather in great union; di means each orders its distant temples.',
    idiomatic: 'He means all temples gather in great union; di means each orders its distant temples.',
  },
  s0674: {
    literal: 'When tablets move ever farther and distant-temple chambers are complete, in the he year the Offering Ancestor should sit east-facing and the Majestic Ancestor ordered in zhao and mu to exhaust nearest kin.',
    idiomatic: 'When tablets move ever farther and distant-temple chambers are complete, in the he year the Offering Ancestor should sit east-facing and the Majestic Ancestor ordered in zhao-mu to exhaust nearest kin.',
  },
  s0675: {
    literal: 'If when performing di rites, the Grand Ancestor again takes his mat in the west with all lords arrayed left and right.',
    idiomatic: 'If performing di rites, the Grand Ancestor again takes his mat in the west with all lords arrayed left and right.',
  },
  s0676: {
    literal: 'Then, toward the Grand Ancestor there is no lowering; toward the Offering Ancestor there is no disdain of baseness.',
    idiomatic: 'Then toward the Grand Ancestor there is no lowering; toward the Offering Ancestor there is no disdain of baseness.',
  },
  s0677: {
    literal: 'On examining rites and weighing feeling, this should be enacted as superior."',
    idiomatic: 'Examining rites and weighing feeling, this should be enacted as superior."',
  },
  s0678: {
    literal: 'Assistant Magistrate of Tongguan Zhong Ziling submitted: "Now Confucians cite the words \'though the son is equal in sageliness, he does not precede the father in eating,\' wishing to have the already distant Offering Ancestor temporarily sit east-facing, matching Heaven with the Grand Ancestor while the Grand Ancestor humbly takes zhao and mu—this is extremely unprincipled.',
    idiomatic: 'Assistant Magistrate of Tongguan Zhong Ziling submitted: "Now Confucians cite the words \'though the son is equal in sageliness, he does not precede the father in eating,\' wishing to have the already distant Offering Ancestor temporarily sit east-facing, matching Heaven with the Grand Ancestor while the Grand Ancestor humbly takes zhao-mu—this is extremely unprincipled.',
  },
  s0679: {
    literal: 'On the Zuo Commentary\'s words on \'not preceding in eating\'—who knows they were not spoken when the Xia\'s temple count was not yet full, saying Yu did not precede Gun!',
    idiomatic: 'The Zuo Commentary\'s words on \'not preceding in eating\'—who knows they were not spoken when the Xia\'s temple count was not yet full, saying Yu did not precede Gun!',
  },
  s0680: {
    literal: 'Moreover, Han di and he sacrifices cannot fully be cited as evidence.',
    idiomatic: 'Moreover, Han di and he cannot fully be cited as evidence.',
  },
  s0681: {
    literal: 'From Wei and Jin onward onward the Grand Ancestor was always near; above the Grand Ancestor there were always removed tablets.',
    idiomatic: 'From Wei and Jin onward the Grand Ancestor was always near; above the Grand Ancestor there were always removed tablets.',
  },
  s0682: {
    literal: 'Dynasties doubted variously: some cited the Closed Palace ode for forever closing; some were arrayed the meaning of the temporary lord for garden burial; some made distant temples into tiao and built palaces; some said the Grand Ancestor was truly base and the seat vacant.',
    idiomatic: 'Dynasties doubted variously: some cited the Closed Palace ode for forever closing; some followed the meaning of the temporary lord for garden burial; some made distant temples into tiao and built palaces; some said the Grand Ancestor was truly base and the seat vacant.',
  },
  s0683: {
    literal: 'Only Eastern Jin\'s Cai Mo relied on the Zuo Commentary\'s "not preceding in eating" as doctrine, wishing the Western Expedition to face east.',
    idiomatic: 'Only Eastern Jin\'s Cai Mo relied on the Zuo Commentary\'s \'not preceding in eating\' as doctrine, wishing to have the Western Expedition face east.',
  },
  s0684: {
    literal: 'Among such proposals, this is most unsettled.',
    idiomatic: 'Among such numbers, this is most unsettled.',
  },
  s0685: {
    literal: 'Moreover, Cai Mo\'s proposal was not what the Jin court enacted.',
    idiomatic: 'Moreover, Cai Mo\'s proposal was not what Jin enacted.',
  },
  s0686: {
    literal: 'Former officials did not follow Mo\'s words on rebuilding temples but took one sentence of the Western Expedition facing east as law for ten thousand generations—this is especially impossible.',
    idiomatic: 'Former officials did not follow Mo\'s words on rebuilding but took one sentence of the Western Expedition facing east as law for ten thousand generations—this is especially impossible.',
  },
  s0687: {
    literal: 'Your servant further reflects: forever closing or garden burial leaves the hearts of ministers uneasy;',
    idiomatic: 'Your subject further reflects: forever closing or garden burial leaves the hearts of ministers uneasy;',
  },
  s0688: {
    literal: 'To temporarily vacate the correct seat leaves the Grand Ancestor\'s honor without fixed time.',
    idiomatic: 'temporarily vacating the correct seat leaves the Grand Ancestor\'s honor without fixed time.',
  },
  s0689: {
    literal: 'Then, to build a separate chamber is somewhat acceptable in meaning.',
    idiomatic: 'Then building a separate chamber is somewhat acceptable in meaning.',
  },
  s0690: {
    literal: 'Moreover, Xingsheng to the Offering Ancestor is great-great-grandfather; zhao and mu are ordered and offerings are timely.',
    idiomatic: 'Moreover, Xingsheng to the Offering Ancestor is great-great-grandfather; zhao-mu are ordered and offerings are timely.',
  },
  s0691: {
    literal: 'We respectfully ask to move the Offering and Majestic ancestors to the Deming and Xingsheng temples—this is the great accord.',
    idiomatic: 'We ask to move the Offering and Majestic ancestors to the Deming and Xingsheng temples—this is the great accord.',
  },
  s0692: {
    literal: 'Some say that he means union; now the two ancestors have separate temples—is this divided offerings, how is it union?',
    idiomatic: 'Some say he means union; now the two ancestors have separate temples—is this divided offerings, how is it union?',
  },
  s0693: {
    literal: 'Your servant holds that the Deming and Xingsheng temples each di and he sacrifices year also all receive offerings—this too is divided offerings; why doubt the two ancestors?"',
    idiomatic: 'Your subject holds that the Deming and Xingsheng temples each di and he year also all receive offerings—this too is divided offerings; why doubt the two ancestors?"',
  },
  s0694: {
    literal: 'On the twenty-seventh day day of that month, Director of the Ministry of Personnel Liu Mian presented the "Exegesis of Di and He," fourteen sections in all to prepare for consultation, and all were deliberated and presented a memorial.',
    idiomatic: 'On the twenty-seventh day of that month, Director of the Ministry of Personnel Liu Mian submitted the "Exegesis of Di and He," fourteen sections in all to prepare for consultation, and all were deliberated and memorialized.',
  },
  s0695: {
    literal: 'By the twelfth day of the third month the Ministry of Rites presented a memorial Yu and others\' deliberation papers.',
    idiomatic: 'By the twelfth day of the third month the Ministry of Rites memorialized Yu and others\' deliberation papers.',
  },
  s0696: {
    literal: 'On the twelfth day of the seventh month month of the eleventh year, an edict: "In the deliberation papers of Yu and others, what is requested differs each from the other; reason lies in discussion to seek refinement.',
    idiomatic: 'On the twelfth day of the seventh month of the eleventh year, an edict: "In the deliberation papers of Yu and others, what is requested differs each from the other; reason lies in discussion to seek refinement.',
  },
  s0697: {
    literal: 'It is appropriate to order the Ministry of Revenue to convene the hundred officials with Confucian officials of the Directorate of Education, compare old papers, settle yes or no, and still commission the relevant office to memorialize the matter in full."',
    idiomatic: 'It is fitting to order the Ministry of Revenue to convene the hundred officials with Confucian officials of the Directorate of Education, compare old papers, settle yes or no, and still commission the relevant office to memorialize the matter in full."',
  },
  s0698: {
    literal: '" On the twenty-sixth day of that month, Left Bureau Director Lu Chun memorialized: "Your servant sought the hundred officials\' deliberation of the seventh year; though there were sixteen papers in all, their trend has three points only.',
    idiomatic: '" On the twenty-sixth day of that month, Left Bureau Director Lu Chun memorialized: "Your subject sought the hundred officials\' deliberation of the seventh year; though there were sixteen papers in all, their trend has three points only.',
  },
  s0699: {
    literal: 'Fourteen deliberation papers of Yu and others all say to restore the Grand Ancestor\'s seat.',
    idiomatic: 'Fourteen papers of Yu and others all say restore the Grand Ancestor\'s seat.',
  },
  s0700: {
    literal: 'Zhang Jian\'s paper says place them together in zhao and mu while vacating the east-facing offering seat.',
    idiomatic: 'Zhang Jian\'s paper says place them together in zhao-mu while vacating the east-facing offering seat.',
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
if (data.metadata.chapter !== '030') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 030; standalone T ready (${Object.keys(T).length} entries).`
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
