#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Jiutangshu ch.030, Rites 6) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/030.json';
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
    literal: 'Respectfully weighing the matter, it should accord with convenience.',
    idiomatic: 'That, they judged, best fit practical need.',
  },
  s0102: {
    literal: 'Approved. The passage concluded.',
    idiomatic: 'Approved. The passage concluded."',
  },
  s0103: {
    literal: 'Thirty-nine ritual directors including Duan Gui submitted a deliberation, saying:',
    idiomatic: 'Thirty-nine ritual directors including Duan Gui submitted a deliberation:',
  },
  s0104: {
    literal: 'What ritual establishes rests on sincerity and reverence;',
    idiomatic: 'What ritual establishes rests on sincerity and reverence',
  },
  s0105: {
    literal: 'what shrines establish is truly dignity.',
    idiomatic: 'what shrines establish is truly dignity',
  },
  s0106: {
    literal: 'Since it is offering sincerity, unity is fitting.',
    idiomatic: 'Since sacrifice is sincerity offered, unity is fitting.',
  },
  s0107: {
    literal: 'When Zhou had eastern and western shrines, one can trace why.',
    idiomatic: 'When Zhou had eastern and western shrines, one can trace why',
  },
  s0108: {
    literal: 'Only at the first divination for Luo building was needed, and removal of seat unsettled, hence deliberation to keep both.',
    idiomatic: 'Only at the first divination for Luo, building was needed and the seat unsettled—hence deliberation to keep both.',
  },
  s0109: {
    literal: 'Weighing circumstances, not aiming at breadth—the Sacrificial Canon is clear.',
    idiomatic: 'Weighing circumstances, not aiming at breadth—the Sacrificial Canon is clear',
  },
  s0110: {
    literal: 'The eastern Grand Temple has long lain abandoned—if we debate restoration, it slightly strays from prior teaching.',
    idiomatic: 'The eastern Grand Temple has long lain abandoned—debating restoration slightly strays from prior teaching.',
  },
  s0111: {
    literal: 'Why?',
    idiomatic: 'Why (idiomatic).',
  },
  s0112: {
    literal: 'The eastern shrine was first made in Empress Wu and Zhongzong\'s reign—a moment\'s affair, not Zhenguan or Kaiyuan law; what lingered unrepealed merely followed Haojing\'s text.',
    idiomatic: 'The eastern shrine was first made under Empress Wu and Zhongzong—a moment\'s affair, not Zhenguan or Kaiyuan law; what lingered unrepealed merely followed Haojing\'s precedent.',
  },
  s0113: {
    literal: 'The Record says: "Sacrifice should not be frequent—frequency breeds weariness."',
    idiomatic: 'The Record says: sacrifice should not be frequent—frequency breeds weariness.',
  },
  s0114: {
    literal: 'In Tianbao both capitals fell to rebels; the western capital\'s shrine façades remained, the eastern thus scattered. The passage concluded.',
    idiomatic: 'In Tianbao both capitals fell to rebels; the western shrine façades remained, the eastern scattered. The passage concluded."',
  },
  s0115: {
    literal: 'Thus the nine shrines\' spirits did not wish to inhale wearisome sacrifice.',
    idiomatic: 'Thus the nine shrines\' spirits did not wish to inhale wearisome sacrifice',
  },
  s0116: {
    literal: 'From Jianzhong\'s refusal to repair, years have piled.',
    idiomatic: 'From Jianzhong\'s refusal to repair, years have piled',
  },
  s0117: {
    literal: 'If shrine façades are renewed today, each chamber must have its tablet.',
    idiomatic: 'If shrine façades are renewed today, each chamber must have its tablet',
  },
  s0118: {
    literal: 'Old tablets remain but most should merge in diao—yet they must be kept on spirit benches—what should diao not diao.',
    idiomatic: 'Old tablets remain but most should merge in diao—yet kept on spirit benches—what should diao not diao.',
  },
  s0119: {
    literal: 'Confucius said, "When there are seven or five shrines, no empty tablet"—meaning shrines cannot lack tablets.',
    idiomatic: 'Confucius said, when there are seven or five shrines, no empty tablet—meaning shrines cannot lack tablets.',
  },
  s0120: {
    literal: 'If old tablets remain or depart, the new shrine must add new ones.',
    idiomatic: 'If old tablets remain or depart, the new shrine must add new ones',
  },
  s0121: {
    literal: 'The Zuo Commentary says: "Affix at lian, make tablet."',
    idiomatic: 'The Zuo Commentary says: affix at lian, make tablet.',
  },
  s0122: {
    literal: 'Dai Sheng says: "At yu, set the spirit bench."',
    idiomatic: 'Dai Sheng says: at yu, set the spirit bench.',
  },
  s0123: {
    literal: 'If made out of season, that is using the inauspicious to intrude on the auspicious.',
    idiomatic: 'If made out of season, that is using the inauspicious to intrude on the auspicious',
  },
  s0124: {
    literal: 'Adding anew is uncanonical; empty shrine is unritual.',
    idiomatic: 'Adding anew is uncanonical.',
  },
  s0125: {
    literal: 'Examining ritual texts, advance and retreat have no footing.',
    idiomatic: 'Examining ritual texts, advance and retreat have no footing',
  },
  s0126: {
    literal: 'Some say: "Han placed lineage shrines in commanderies and kingdoms, over a hundred—now only east and west shrines, what unease?" The passage concluded.',
    idiomatic: 'Some say: Han placed lineage shrines in commanderies and kingdoms, over a hundred—now only east and west shrines, what unease? The passage concluded."',
  },
  s0127: {
    literal: 'When Han inherited Qin\'s burnings, it knew no canonical precedents—for shrine system, it acted by whim.',
    idiomatic: 'Han inherited Qin\'s burnings and knew no canonical precedents—for shrine system, it acted by whim.',
  },
  s0128: {
    literal: 'By Yuandi and Chengdi\'s reign Gong Yu, Wei Xuancheng and others appeared in succession with sound argument—finally shrines were destroyed.',
    idiomatic: 'By Yuandi and Chengdi, Gong Yu, Wei Xuancheng, and others argued soundly—finally shrines were destroyed.',
  },
  s0129: {
    literal: 'Enough to know early Han did not root in ritual classics—how take it as measure?',
    idiomatic: 'Enough to know early Han did not root in ritual classics—how take it as measure (idiomatic).',
  },
  s0130: {
    literal: 'Some say: "Spirit benches cannot be reset—why not repair shrine chambers? When the carriage tours, use the tablets carried." The passage concluded.',
    idiomatic: 'Some say: spirit benches cannot be reset—why not repair shrine chambers? When the carriage tours, use the tablets carried. The passage concluded."',
  },
  s0131: {
    literal: 'Pursue beginning and end—again one may argue.',
    idiomatic: 'Pursue beginning and end—again one may argue',
  },
  s0132: {
    literal: 'Yesterday\'s edict for deliberation aimed to gather old tablets—if tablets are not installed, how apply the shrine?',
    idiomatic: 'Yesterday\'s edict aimed to gather old tablets—if tablets are not installed, how apply the shrine?',
  },
  s0133: {
    literal: 'Suppose the throne tours the nine provinces—',
    idiomatic: 'Suppose throne tours nine provinces—',
  },
  s0134: {
    literal: 'must one raise a shrine in each? This servant holds: shrine cannot be repaired; tablets should be stored and buried—either in the pit chamber or between the two stair flights—the immutable way of a hundred generations. The passage concluded.',
    idiomatic: 'must one raise a shrine in each? This servant holds: the shrine cannot be repaired; tablets should be stored and buried—in the pit chamber or between the two stair flights—the immutable way of a hundred generations. The passage concluded."',
  },
  s0135: {
    literal: 'That year, ninth month edict: "Duan Gui and others\' deliberation—eastern capital cannot raise shrine."',
    idiomatic: 'That year, ninth month edict: Duan Gui and others\' deliberation—the eastern capital cannot raise a shrine.',
  },
  s0136: {
    literal: 'Li Fu and others\' separate memorial also differs.',
    idiomatic: 'Li Fu and others\' separate memorial also differs',
  },
  s0137: {
    literal: 'State institutions must match canonical rites—evidence not unified, then hard to establish.',
    idiomatic: 'State institutions must match canonical rites—evidence not unified, then hard to establish',
  },
  s0138: {
    literal: 'All should come to the Secretariat for face debate until the fitting conclusion. The passage concluded.',
    idiomatic: 'All should come to the Secretariat for face debate until the fitting conclusion. The passage concluded."',
  },
  s0139: {
    literal: 'Minister of Works Xue Yuanshang and others deliberated:',
    idiomatic: 'Minister of Works Xue Yuanshang and others replied:',
  },
  s0140: {
    literal: 'At Jianzhong, dukes and ministers petitioned to restore the eastern celebratory shrine—then debate had three heads: first, keep the shrine, fully install tablets, on feast days have another officer perform by proxy.',
    idiomatic: 'At Jianzhong, dukes petitioned to restore the eastern celebratory shrine—debate then had three heads: first, keep the shrine, fully install tablets, on feast days have another officer perform by proxy.',
  },
  s0141: {
    literal: 'Second, build shrine and tablets, keep without sacrifice—when the imperial carriage tours, feast there.',
    idiomatic: 'Second, build shrine and tablets, keep without sacrifice—when the imperial carriage tours, feast there',
  },
  s0142: {
    literal: 'Third, keep the shrine, bury the tablets.',
    idiomatic: 'Third, keep shrine, bury tablets.',
  },
  s0143: {
    literal: 'We set forth the three deliberations, weighing the ritual canon—reason requires keeping the shrine, not installing tablets.',
    idiomatic: 'They set forth the three deliberations, weighing the ritual canon—reason requires keeping the shrine, not installing tablets.',
  },
  s0144: {
    literal: 'The Meaning of Sacrifice says: "In founding a state, spirit seats—sacred soil right, ancestral shrine left."',
    idiomatic: 'The Meaning of Sacrifice says: in founding a state, spirit seats—sacred soil right, ancestral shrine left.',
  },
  s0145: {
    literal: 'The Book of Rites: "When the noble will build chambers, ancestral shrine comes first."',
    idiomatic: 'The Book of Rites: when the noble will build chambers, ancestral shrine comes first.',
  },
  s0146: {
    literal: 'Thus the king founding realm and seat must first ancestral shrine and sacred soil.',
    idiomatic: 'Thus the king founding realm and seat must first raise ancestral shrine and sacred soil.',
  },
  s0147: {
    literal: 'Zhou Wu received the mandate, first seat at Feng; Cheng Wang chose dwelling, divined again at Luo—sacrificed the year\'s harvest in the new settlement, enfeoffed Duke Zhou in the Grand Chamber.',
    idiomatic: 'Zhou Wu received the mandate, first seat at Feng; Cheng Wang chose dwelling, divined at Luo—sacrificed the year\'s harvest in the new settlement, enfeoffed Duke Zhou in the Grand Chamber.',
  },
  s0148: {
    literal: 'Thus the Documents: "On wuchen, the king in the new settlement sacrificed the year\'s harvest."',
    idiomatic: 'The Documents: on wuchen, the king in the new settlement sacrificed the year\'s harvest.',
  },
  s0149: {
    literal: 'The king entered the Grand Chamber for libation.',
    idiomatic: 'king entered Grand Chamber for libation.',
  },
  s0150: {
    literal: 'Cheng Wang afterward established again at Feng—though Luo was built, he did not long dwell there. The passage concluded.',
    idiomatic: 'Cheng Wang afterward established again at Feng—though Luo was built, he did not long dwell there. The passage concluded."',
  },
  s0151: {
    literal: 'Reaching King Ping, eastern removal was fixed.',
    idiomatic: 'Reaching King Ping, eastern removal was fixed',
  },
  s0152: {
    literal: 'Then Zhou\'s Feng and Hao both had ancestral shrines—clear.',
    idiomatic: 'Then Zhou\'s Feng and Hao both had ancestral shrines—clear',
  },
  s0153: {
    literal: 'Also: Zengzi asked about "two tablet sets in the shrine"; the Master answered "Heaven no two suns, earth no two kings—in seasonal, great, suburban, soil rites, honor no second apex—unknown if that is ritual."',
    idiomatic: 'Also: Zengzi asked about two tablet sets in the shrine; the Master answered heaven no two suns, earth no two kings—in seasonal, great, suburban, soil rites, honor no second apex—unknown if that is ritual.',
  },
  s0154: {
    literal: 'Once Duke Huan of Qi made two tablet sets; the Master mocked them as false tablets.',
    idiomatic: 'Duke Huan of Qi once made two tablet sets; the Master mocked them as false tablets.',
  },
  s0155: {
    literal: 'Thus two tablet sets cannot be installed together—also clear.',
    idiomatic: 'Thus two tablet sets cannot be installed together—also clear',
  },
  s0156: {
    literal: 'The sage king builds sacred soil to thicken root, shrine to honor ancestors—thus the capital must have shrine and soil.',
    idiomatic: 'The sage king builds sacred soil to thicken root, shrine to honor ancestors—thus the capital must have shrine and soil',
  },
  s0157: {
    literal: 'Now the state fixes Zhou and Qin\'s two lands as eastern and western seats, opens nine avenues and raises palaces, sets hundred offices with strict guard—taking pattern from dark heavens, called the capital.',
    idiomatic: 'The state fixes Zhou and Qin\'s two lands as eastern and western seats, opens nine avenues and raises palaces, sets hundred offices with strict guard—patterned on dark heavens, called the capital.',
  },
  s0158: {
    literal: 'With imperial dwelling established, spirit seats cannot stand empty—without ancestral shrine, what is called imperial capital?',
    idiomatic: 'With imperial dwelling established, spirit seats cannot stand empty—without ancestral shrine, what is imperial capital?',
  },
  s0159: {
    literal: 'Yet spirits rely on people; sacrifice dwells in sincerity—sincerity not from outside but from within—fitting close reverence to join the divine.',
    idiomatic: 'Yet spirits rely on people; sacrifice dwells in sincerity—sincerity rises from within, not without—fitting close reverence to join the divine.',
  },
  s0160: {
    literal: 'Seats should remain in both capitals; shrines may be built together;',
    idiomatic: 'Seats should remain in both capitals.',
  },
  s0161: {
    literal: 'sincerity cannot focus on two feast lines; tablets are not installed in parallel.',
    idiomatic: 'sincerity cannot focus on two feast lines.',
  },
  s0162: {
    literal: 'Some cite the Rites: "seven or five shrines, no empty tablet"—meaning cannot lack tablets.',
    idiomatic: 'Some cite the Rites: seven or five shrines, no empty tablet—meaning cannot lack tablets.',
  },
  s0163: {
    literal: 'Hence the Son of Heaven on tour also has what he honors—still adorns the fasting carriage, carries displacement tablets traveling.',
    idiomatic: 'Hence the Son of Heaven on tour also has what he honors—still adorns the fasting carriage, carries displacement tablets traveling',
  },
  s0164: {
    literal: 'Now if we repair shrine and bury tablets, like the eastern Grand Temple all nine chambers empty—already against the canon, must seek explanation.',
    idiomatic: 'Now if we repair shrine and bury tablets, like the eastern Grand Temple all nine chambers empty—already against the canon, explanation is required.',
  },
  s0165: {
    literal: 'Your servant again probes ritual meaning and may discuss fully.',
    idiomatic: 'Your servant again probes ritual meaning and may discuss fully',
  },
  s0166: {
    literal: 'What is said—"no empty tablet"—means the shrine where sacrifice is seen cannot be empty.',
    idiomatic: 'What is said—no empty tablet—means the shrine where sacrifice is seen cannot be empty.',
  },
  s0167: {
    literal: 'Today\'s two capitals, though each has shrine—di, xia, feast, presentation—all are personally offered at the Upper Capital; tablet benches cannot stand empty in the eastern shrine.',
    idiomatic: 'Today\'s two capitals, though each has a shrine—di, xia, feast, presentation—all are personally offered at the Upper Capital; tablet benches cannot stand empty in the eastern shrine.',
  },
  s0168: {
    literal: 'Moreover the Rites: "Only the sage can feast the Di; only the filial son can feast kin."',
    idiomatic: 'Moreover the Rites: only the sage can feast the Di; only the filial son can feast kin.',
  },
  s0169: {
    literal: 'Formerly Han\'s Wei Xuancheng urged abolishing commandery and kingdom sacrifice, also saying: "Raise shrine at the capital, personally undertake the service—within the four seas each by office comes to sacrifice."',
    idiomatic: 'Formerly Han\'s Wei Xuancheng urged abolishing commandery and kingdom sacrifice, also saying: raise shrine at the capital, personally undertake the service—within the four seas each by office comes to sacrifice.',
  },
  s0170: {
    literal: 'Human feeling and ritual sense are thus comparably clear. The passage concluded.',
    idiomatic: 'Human feeling and ritual sense are thus comparably clear. The passage concluded."',
  },
  s0171: {
    literal: 'Two chambers do not dwell together—how can two shrines affix together?',
    idiomatic: 'Two chambers do not dwell together—how can two shrines affix together (idiomatic).',
  },
  s0172: {
    literal: 'Yet in the seated realm, the shrine where sacrifice is seen—already no empty chamber—those who abandon universal canon wish to install tablets without sacrifice, awaiting tour.',
    idiomatic: 'Yet in the seated realm, the shrine where sacrifice is seen has no empty chamber—those who abandon universal canon wish to install tablets without sacrifice, awaiting tour.',
  },
  s0173: {
    literal: 'Once Lu made Duke Xi\'s tablet not at yu or lian—the Spring and Autumn records and mocks.',
    idiomatic: 'Lu once made Duke Xi\'s tablet not at yu or lian—the Spring and Autumn records and mocks.',
  },
  s0174: {
    literal: 'Tablets for joint enshrinement, made untimely, were still mocked.',
    idiomatic: 'Tablets for joint enshrinement, made untimely, were still mocked',
  },
  s0175: {
    literal: 'Now to install tablets unfit for joint enshrinement, not made in season—defying canon, exceeding ritual—nothing worse.',
    idiomatic: 'Now to install tablets unfit for joint enshrinement, not made in season—defying canon, exceeding ritual—nothing worse',
  },
  s0176: {
    literal: 'How can there be tablets for nine chambers of joint feasting, yet text of installation without feasting?',
    idiomatic: 'How can there be tablets for nine chambers of joint feasting.',
  },
  s0177: {
    literal: 'Two shrines first created by Duke Zhou; two tablet sets mocked by the Master.',
    idiomatic: 'Two shrines first created by Duke Zhou.',
  },
  s0178: {
    literal: 'From antiquity creation has modeled Zhou and Confucius—old canon still remains, enough for clear proof.',
    idiomatic: 'From antiquity creation has modeled Zhou and Confucius—old canon still remains, enough for clear proof',
  },
  s0179: {
    literal: 'Your servant therefore says eastern shrine should be kept; tablets should not be installed.',
    idiomatic: 'Your servant therefore says eastern shrine should be kept.',
  },
  s0180: {
    literal: 'Now about to repair shrine buildings—truly no diminishment of canonical rite.',
    idiomatic: 'Now about to repair shrine buildings—truly no diminishment of canonical rite',
  },
  s0181: {
    literal: 'The six tablets now in Taiwei—we ask after eastern Grand Temple repair is complete, with full rite escort them to the western side chamber, sealed without sacrifice, displaying Your Majesty\'s strict sacrificial reverence and clarifying the holy court\'s honor of ancestors.',
    idiomatic: 'The six tablets now in Taiwei—they ask after eastern Grand Temple repair is complete, with full rite escort them to the western side chamber, sealed without sacrifice, displaying Your Majesty\'s strict sacrificial reverence and clarifying the holy court\'s honor of ancestors.',
  },
  s0182: {
    literal: 'Ministry Vice Director Zheng Ya and five others: "Per the Ritual Office memorial, the eastern Grand Temple abandoned cannot be restored; tablets in Taiwei should be buried where they lodge."',
    idiomatic: 'Ministry vice director Zheng Ya and five others: per the Ritual Office, the eastern Grand Temple abandoned cannot be restored; Taiwei tablets should be buried where they lodge.',
  },
  s0183: {
    literal: 'That strays from canonical teaching—we dare not echo it.',
    idiomatic: 'That strays from canonical teaching—they dare not echo it.',
  },
  s0184: {
    literal: 'Your servant therefore filed a separate deliberation, asking repair and enshrinement of tablets, all per canonical rite—also the same as Rites Commissioner Yan Zhenqing\'s Jianzhong 1 memorial.',
    idiomatic: 'They filed a separate deliberation, asking repair and enshrinement of tablets, all per canonical rite—also the same as Rites Commissioner Yan Zhenqing\'s Jianzhong 1 memorial.',
  },
  s0185: {
    literal: 'Deliberating again with dukes and ministers, all held shrine surely should be repaired, tablets cannot be buried—same as our separate memorial.',
    idiomatic: 'Deliberating again with dukes and ministers, all held the shrine surely should be repaired, tablets cannot be buried—same as their separate memorial.',
  },
  s0186: {
    literal: 'Yet collective debate still feared east and west shrines each setting tablets might touch "two tablet sets in one shrine"—request repair with empty chambers, store Taiwei tablets in side chambers.',
    idiomatic: 'Yet collective debate still feared east and west shrines each setting tablets might touch two tablet sets in one shrine—request repair with empty chambers, store Taiwei tablets in side chambers.',
  },
  s0187: {
    literal: 'Respectfully, among the six spirit-lord positions within are unfilleted ancestors; to use relocation rites now still does not accord with ritual.',
    idiomatic: 'Six of those spirit-lords were unfilleted forebears; applying removal rites to them still seemed uncanonical.',
  },
  s0188: {
    literal: 'We still dare not sign the collective memorial—for lingering doubt. The passage concluded.',
    idiomatic: 'They still dare not sign the collective memorial—for lingering doubt. The passage concluded."',
  },
  s0189: {
    literal: 'Imperial University director and Hongwen Guan attache Zheng Sui and seven others: "In discussing the state\'s great affairs, one must root in rectitude and anchor in classics, to reach the middle way."',
    idiomatic: 'Imperial University director and Hongwen Guan attache Zheng Sui and seven others: in discussing the state\'s great affairs, one must root in rectitude and anchor in classics, to reach the middle way.',
  },
  s0190: {
    literal: 'The sage dynasty takes broad filial piety first and obtaining the rites as precious—and how could ministers not answer with the classics?',
    idiomatic: 'This dynasty prizes filial piety and true ritual—how could ministers answer with anything but the canon?',
  },
  s0191: {
    literal: 'The three arguments and six antecedents have already been detailed in the prior deliberation.',
    idiomatic: 'Three positions and six precedents had already been laid out.',
  },
  s0192: {
    literal: 'Again receiving heaven\'s inquiry, we set forth schools\' views, seek in canonical instruction, examine the great mean—shrine has text requiring repair; tablet has no logic for installation.',
    idiomatic: 'Again receiving heaven\'s inquiry, they set forth schools\' views, sought canonical instruction, examined the great mean—shrine has text requiring repair; tablet has no logic for installation.',
  },
  s0193: {
    literal: 'Why is this so?',
    idiomatic: 'For what reason?',
  },
  s0194: {
    literal: 'Orthodox classics and histories prove two-capital shrines.',
    idiomatic: 'Orthodox classics and histories prove two-capital shrines',
  },
  s0195: {
    literal: 'The Rites say "the Son of Heaven does not divine the Grand Temple\'s site"; "choose a day, divine the founding land—then ancestral shrine is known."',
    idiomatic: 'The Rites say the Son of Heaven does not divine the Grand Temple\'s site; choose a day, divine the founding land—then ancestral shrine is known.',
  },
  s0196: {
    literal: 'Then the theory of abandoning temples is perhaps not what should be abandoned.',
    idiomatic: 'To abandon a temple, then, is what ought not be abandoned.',
  },
  s0197: {
    literal: 'We examine Poetry, Documents, Rites—the three classics and Han\'s two histories—both capitals set shrines; the institution of carrying tablets has long been practiced.',
    idiomatic: 'Poetry, Documents, Rites—the three classics—and Han\'s two histories show both capitals set shrines; carrying tablets has long been practiced.',
  },
  s0198: {
    literal: 'How dare we leave clear proof for ornament? Citing classics, not changing prior views—the eastern Grand Temple should be repaired and honored; old tablets should be buried, we ask, where Taiwei stores them.',
    idiomatic: 'How dare they leave clear proof for ornament? Citing classics, not changing prior views—the eastern Grand Temple should be repaired and honored; old tablets should be buried where Taiwei stores them.',
  },
  s0199: {
    literal: 'When the emperor has business at Luo, then offer the fasting carriage and carry tablets traveling. The passage concluded.',
    idiomatic: 'When the emperor has business at Luo, offer the fasting carriage and carry tablets traveling. The passage concluded."',
  },
  s0200: {
    literal: 'Ritual director Gu Dezang deliberated, saying:',
    idiomatic: 'Ritual director Gu Dezang deliberated:',
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
