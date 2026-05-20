#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.027, Rites 3 / mourning) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/027.json';
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
    literal: 'Treatise 7: Rites 7',
    idiomatic: 'Treatise Seven: Rites Seven',
  },
  s0002: {
    literal: ', when Taizong, during an occasion when rites officials were presenting business, spoke of mourning dress, Taizong said: "The passage concluded." Thereupon Palace Attendant Wei Zheng, Vice Minister of Rites Linghu Defen, and others submitted a deliberation, saying:',
    idiomatic: 'While Taizong was hearing the rites officers on routine business, he turned to mourning dress. The emperor spoke; the passage concluded. Then Palace Attendant Wei Zheng, Vice Minister of Rites Linghu Defen, and others submitted a memorial:',
  },
  s0003: {
    literal: 'The ordinance approved it.',
    idiomatic: 'The throne approved.',
  },
  s0004: {
    literal: 'In the ninth month, rites-revising officials Zhangsun Wuji and others again memorialized, saying: "According to ancient mourning dress, a nephew for his mother\'s brother wears three months\' finest hemp; the mother\'s brother\'s return mourning for the nephew follows the same rule.',
    idiomatic: 'Ninth month: Zhangsun Wuji and the rites revision staff wrote that under the old mourning code a nephew wore three months\' finest hemp for his mother\'s brother, and the uncle reciprocated the same.',
  },
  s0005: {
    literal: 'In the Zhenguan era the Eight Seats deliberated and memorialized: \'For the mother\'s brother, mourning is the same as for the mother\'s sister—five months\' lesser accomplishment.',
    idiomatic: 'In Zhenguan the Eight Seats had ruled that mourning for a mother\'s brother matched that for a mother\'s sister: five months\' lesser accomplishment.',
  },
  s0006: {
    literal: '\' Yet in the present Code and Commentaries, the mother\'s brother\'s return mourning toward the nephew is still three months.',
    idiomatic: 'Yet the current Code and Commentaries still fixed the uncle\'s return mourning for a nephew at three months.',
  },
  s0007: {
    literal: 'We respectfully note that for mourning toward collateral elders, ritual never lacks return mourning; though they are not primary elders, one dare not reduce it.',
    idiomatic: 'Collateral elders always received return mourning in ritual; though not primary kin, the grade must not be cut.',
  },
  s0008: {
    literal: 'Thus a nephew for the mother\'s sister wears five months; the mother\'s sister\'s return for the nephew is lesser accomplishment; a nephew for the mother\'s brother wears finest hemp; the mother\'s brother also returns finest hemp for the nephew three months—that is the principle.',
    idiomatic: 'So a nephew wore five months for a mother\'s sister, and she returned lesser accomplishment; for a mother\'s brother he wore finest hemp, and the uncle returned three months\' finest hemp—that was the pattern.',
  },
  s0009: {
    literal: 'Now if a nephew for his mother\'s brother is made the same as mourning for the mother\'s sister, then the mother\'s brother ought to advance his return for the nephew to match the mother\'s sister\'s return.',
    idiomatic: 'If a nephew\'s mourning for his mother\'s brother was raised to match a mother\'s sister, the uncle\'s return mourning for the nephew should rise to match her return as well.',
  },
  s0010: {
    literal: 'Those who revised the Code and Commentaries did not know ritual intent; the mother\'s brother\'s return mourning for the nephew still stopping at finest hemp is inconsistent with precedent and ritual must be corrected.',
    idiomatic: 'The Code revisers had missed the point: leaving the uncle\'s return at finest hemp broke precedent and had to be fixed.',
  },
  s0011: {
    literal: 'We now request revision of the Code and Commentaries so that the mother\'s brother\'s return mourning for the nephew is also lesser accomplishment.',
    idiomatic: 'They asked that the Code be amended so the uncle\'s return mourning for a nephew was also lesser accomplishment.',
  },
  s0012: {
    literal: '" They also said: "In ancient ritual a secondary mother was finest hemp; in the new ritual there is no mourning.',
    idiomatic: 'They added: ancient ritual required finest hemp for a secondary mother; the new code required none.',
  },
  s0013: {
    literal: 'We respectfully note that sons of a secondary mother are one\'s own brothers and sisters; for them one wears staff for one year, yet for the secondary mother oneself wears none.',
    idiomatic: 'Sons of a secondary mother were full siblings: one wore staff for a year for them, yet wore nothing for the secondary mother herself.',
  },
  s0014: {
    literal: 'Within the same breath, fortune and misfortune suddenly differ—sought in ritual feeling, this is deeply not ultimate reason.',
    idiomatic: 'Within one flesh, joy and grief were graded worlds apart—a poor fit to ritual feeling.',
  },
  s0015: {
    literal: 'We request that according to ancient precedent mourning of finest hemp be worn.',
    idiomatic: 'They asked that precedent be restored: finest hemp for a secondary mother.',
  },
  s0016: {
    literal: '" The ordinance again approved.',
    idiomatic: 'The throne approved again.',
  },
  s0017: {
    literal: 'In the eighth month the relevant office memorialized: "Director of Literary Affairs Xiao Siye\'s legitimate stepmother remarried and died; he requests to declare heart mourning.',
    idiomatic: 'Eighth month: the relevant office reported that Xiao Siye, Director of Literary Affairs, sought heart mourning after his legitimate stepmother remarried and died.',
  },
  s0018: {
    literal: 'According to the ordinance, a stepmother\'s remarriage and being the eldest son both do not require leaving office.',
    idiomatic: 'The code said neither a stepmother\'s remarriage nor being eldest son required leaving office.',
  },
  s0019: {
    literal: '" Thereupon an edict: "The passage concluded." Director of Ceremonies and Grand Master of Splendid Happiness Bo Yi, Prince of Longxi Commandery, and others memorialized, stating:',
    idiomatic: 'An edict followed; the passage concluded. Director of Ceremonies Bo Yi, Prince of Longxi, and others wrote:',
  },
  s0020: {
    literal: 'The decree approved.',
    idiomatic: 'The court assented.',
  },
  s0021: {
    literal: ', Empress Wu submitted a memorial, saying: "As for when the father is alive, mourning for the mother stops at one cycle—though heart mourning is three years, the garment is reduced by reverence for the father.',
    idiomatic: 'Empress Wu then memorialized: when the father still lived, mourning for the mother ended after one cycle; though heart mourning ran three years, the garment was cut by reverence for the father.',
  },
  s0022: {
    literal: 'I venture to say that in a child\'s relation to the mother, affection is especially deep—without the mother one is not born, without the mother one is not reared.',
    idiomatic: 'A child owes the mother a singular depth of love: without her there is no birth, without her no rearing.',
  },
  s0023: {
    literal: 'Tending dryness and wetness, swallowing bitterness and spitting sweetness—the toil of bearing and rearing, kindness reaches its utmost!',
    idiomatic: 'She tended his dryness and wetness, swallowed bitterness and gave sweetness—the labor of nurture exhausts what kindness can mean.',
  },
  s0024: {
    literal: 'Therefore even beasts in feeling know their mother; three years in the womb—by principle one ought to honor her in return.',
    idiomatic: 'Even beasts know their dam; three years in the womb demand a commensurate return.',
  },
  s0025: {
    literal: 'If when the father is alive mourning for the mother stops at one cycle, reverence for the father is complete yet requital of the mother\'s kindness is lacking.',
    idiomatic: 'Stopping at one cycle while the father lived honored him fully but left the mother\'s kindness short.',
  },
  s0026: {
    literal: 'Moreover the hemmed-and-cut garment system is sufficient for graduated reduction; to make one cycle suffice where three years should apply would wound the son\'s intent.',
    idiomatic: 'Hemmed sackcloth already graded the mourning; shrinking three years to one cycle would wound a son\'s intent.',
  },
  s0027: {
    literal: 'We now request that when the father is alive mourning for the mother run the full three years.',
    idiomatic: 'She asked that when the father lived, mourning for the mother run the full three years.',
  },
  s0028: {
    literal: '" Gaozong issued a decree and followed the proposal in practice.',
    idiomatic: 'Gaozong decreed and put her proposal into practice.',
  },
  s0029: {
    literal: ', Right Remonstrator Lu Lübing submitted a memorial: "According to ritual, when the father is alive, for the mother one cycle until removal of the spirit tablet, three years\' heart mourning.',
    idiomatic: 'Right Remonstrator Lu Lübing wrote: ritual fixed one cycle until tablet removal and three years\' heart mourning for a mother while the father lived.',
  },
  s0030: {
    literal: 'Empress Wu Zetian requested mourning the same as when the father is dead—three years before removal of the spirit tablet.',
    idiomatic: 'Empress Wu had asked for the same garment as when the father was dead—three years before tablet removal.',
  },
  s0031: {
    literal: 'Though it was provisionally carried out, it disorderly violated the constant canon.',
    idiomatic: 'That expedient had been carried out, but it tangled the standing canon.',
  },
  s0032: {
    literal: 'Now Your Majesty filially governs the realm and moves in accord with ritual classics; we request return to the old articles, that it may accord with the comprehensive canon.',
    idiomatic: 'The emperor now governed by filial piety and ritual; Lübing asked to restore the old rule and align with the comprehensive canon.',
  },
  s0033: {
    literal: '" Thereupon a decree was issued ordering the hundred officials to deliberate in detail;',
    idiomatic: 'A decree ordered the bureaucracy to deliberate.',
  },
  s0034: {
    literal: 'mourning for mother\'s brothers and sisters-in-law and younger uncles not following the old ritual should also be settled by deliberation.',
    idiomatic: 'Mourning for uncles, aunts, sisters-in-law, and younger uncles that no longer matched the old ritual was to be settled in the same review.',
  },
  s0035: {
    literal: 'Penal Bureau Director Tian Zaosi proposed:',
    idiomatic: 'Penal Bureau Director Tian Zaosi offered a proposal.',
  },
  s0036: {
    literal: 'Thereupon debate was unsettled.',
    idiomatic: 'Debate deadlocked.',
  },
  s0037: {
    literal: 'Lübing again submitted a memorial, saying: "The Ritual: when the father is alive, for the mother eleven months then practice; thirteenth month auspicious; fifteenth month end-of-mourning; heart mourning three years.',
    idiomatic: 'Lübing wrote again, citing the Ritual: while the father lived, for the mother eleven months to practice, thirteenth month auspicious rites, fifteenth month end-of-mourning, and three years\' heart mourning.',
  },
  s0038: {
    literal: 'In the Shangyuan era Empress Wu Zetian submitted a memorial requesting mourning the same as when the father is dead, yet it was still not carried out.',
    idiomatic: 'In Shangyuan Wu had asked for mourning equal to a father\'s death, but it had not yet taken effect.',
  },
  s0039: {
    literal: 'By the Chuigong era it was first entered into the administrative code; after the change of dynasty the custom then spread in practice.',
    idiomatic: 'Only in Chuigong was it written into the code; after the dynastic shift the custom spread.',
  },
  s0040: {
    literal: 'Your servant, repeatedly requesting return to the old rule.',
    idiomatic: 'Your servant had repeatedly asked to restore the old rule.',
  },
  s0041: {
    literal: 'The gracious edict also entrusted mourning for sisters-in-law, younger uncles, and mother\'s brothers and sisters to the relevant offices for detailed deliberation.',
    idiomatic: 'The throne also sent mourning for sisters-in-law, younger uncles, and maternal kin to the relevant offices for review.',
  },
  s0042: {
    literal: 'The offices\' deliberations mixed agreement and difference.',
    idiomatic: 'The offices split.',
  },
  s0043: {
    literal: 'The relevant office alone held to the text on hemmed and cut garments, and also said it accorded with canonical ritual.',
    idiomatic: 'One office clung to the hemmed-sackcloth articles and called that canonical.',
  },
  s0044: {
    literal: 'I observe that the newly revised code still follows the Chuigong error, so that when grandparents are alive and a grandson\'s wife dies, in the lower apartments a second full cycle is also observed—most meaningless.',
    idiomatic: 'The new code still followed Chuigong\'s error: with grandparents alive and a grandson\'s wife dead, lower apartments sometimes observed a second full cycle—absurd.',
  },
  s0045: {
    literal: 'According to the Changes, Family hexagram: \'It profits the woman\'s constancy; the woman holds correct position within, the man holds correct position without.',
    idiomatic: 'The Changes, Family hexagram, says: constancy profits the woman; she holds correct position within, the man without.',
  },
  s0046: {
    literal: 'Man and woman correct—this is the great principle of Heaven and Earth.',
    idiomatic: 'Correct man and woman embody Heaven and Earth\'s great principle.',
  },
  s0047: {
    literal: 'The family has a stern lord—this means father and mother.',
    idiomatic: 'A household has a stern lord: father and mother.',
  },
  s0048: {
    literal: 'Father as father, son as son, elder brother as elder brother, younger brother as younger brother, husband as husband, wife as wife—the family way is correct and the realm is correct.',
    idiomatic: 'Father father, son son, elder brother elder brother, younger brother younger brother, husband husband, wife wife—right the family and the realm follows.',
  },
  s0049: {
    literal: '\' The Ritual: \'A woman in the chamber takes the father as Heaven;',
    idiomatic: 'The Ritual says: in the chamber a woman takes her father as Heaven;',
  },
  s0050: {
    literal: 'after marriage, she takes the husband as Heaven.',
    idiomatic: 'after marriage she takes her husband as Heaven.',
  },
  s0051: {
    literal: '\' Again: \'At home she follows the father; after marriage she follows the husband; when the husband dies she follows the son.',
    idiomatic: 'Again: at home she follows the father, in marriage the husband, in widowhood the son.',
  },
  s0052: {
    literal: '\' Fundamentally there is no law of self-willed defiance of elders.',
    idiomatic: 'There is no charter for defying elders on one\'s own.',
  },
  s0053: {
    literal: 'The Mourning Dress Four Principles says: \'Heaven has no two suns, earth no two kings, the state no two lords, the family no two elders—one principle governs.',
    idiomatic: 'The Mourning Dress Four Principles says: Heaven has no two suns, earth no two kings, a state no two lords, a family no two elders—one principle rules all.',
  },
  s0054: {
    literal: 'Therefore when the father is alive mourning for the mother is one cycle—to avoid two elders.',
    idiomatic: 'Hence while the father lives, mourning for the mother is one cycle—to avoid two elders in one house.',
  },
  s0055: {
    literal: '\' I bow and consider that Your Majesty rightly holds family and state and filially governs the realm, yet does not decide in the imperial heart and correct this ritual in detail—do not follow vulgar custom and indulge children\'s feelings.',
    idiomatic: 'Your Majesty rightly orders family and state by filial rule, yet has not settled this rite in the imperial heart—do not follow custom and indulge a child\'s feeling alone.',
  },
  s0056: {
    literal: 'Your servant fears that later ages will again have women who usurp their husbands\' government.',
    idiomatic: 'Your servant fears later ages will again see wives seize their husbands\' authority.',
  },
  s0057: {
    literal: 'The memorial concluded."',
    idiomatic: 'The memorial closed.',
  },
  s0058: {
    literal: 'The memorial was submitted and not answered.',
    idiomatic: 'No answer came.',
  },
  s0059: {
    literal: 'Lübing again submitted a memorial:',
    idiomatic: 'Lübing wrote again.',
  },
  s0060: {
    literal: 'Left Regular Attendant of the Cavalry Yuan Xingchong submitted a deliberation, saying: "Of Heaven and Earth\'s nature, only the human is most spiritual—because wisdom encompasses the ten thousand things, only the perspicacious become sage, discerning noble and base, distinguishing honored and humble, keeping distant what is suspect, dividing feeling and principle.',
    idiomatic: 'Left Cavalry Regular Attendant Yuan Xingchong argued: among Heaven and Earth\'s creatures only humans are most spirit-filled—wisdom spans the ten thousand things, the perspicacious become sages, they sort noble and base, honored and humble, keep distance from suspicion, and divide feeling from principle.',
  },
  s0061: {
    literal: 'Therefore the ancient sages examined nature to know the root, followed feeling to set garments—there is extension and there is reduction.',
    idiomatic: 'Ancient sages read nature for the root and followed feeling to set garments—sometimes extending, sometimes reducing.',
  },
  s0062: {
    literal: 'Heaven as father, Heaven as husband—therefore full sackcloth three years; where feeling and principle are both exhausted, the heart establishes the utmost.',
    idiomatic: 'Heaven is father, Heaven is husband—hence three years\' full sackcloth where feeling and principle are both spent, the heart sets the utmost limit.',
  },
  s0063: {
    literal: 'In life they share one body; in death one grave—matching yin and yang in union, forming transformation with the two principles.',
    idiomatic: 'Alive they share one body; dead one grave—yin and yang paired, the two principles made whole.',
  },
  s0064: {
    literal: 'Yet for a wife\'s mourning, staff for one year—where feeling and ritual are both reduced—is because one keeps distant what is suspect and honors the yang way.',
    idiomatic: 'Yet a wife\'s death brings staff for one year—feeling and ritual both cut—to keep distance from suspicion and honor the yang way.',
  },
  s0065: {
    literal: 'A father for the legitimate son wears three years\' full sackcloth yet does not leave office—because one honors the grandfather and values the legitimate line, exalting ritual and reducing feeling.',
    idiomatic: 'A father wears three years\' full sackcloth for a legitimate son yet does not leave office—honoring the grandfather, weighting the legitimate line, exalting ritual over feeling.',
  },
  s0066: {
    literal: 'Taking service to the father as service to the lord—no filial piety is greater than honoring the father.',
    idiomatic: 'Serving the lord as one serves the father—no filial piety exceeds honoring the father.',
  },
  s0067: {
    literal: 'Therefore when the father is alive, for the mother one leaves office for hemmed sackcloth one cycle and heart mourning three years—called honored reduction: feeling is extended but ritual is reduced.',
    idiomatic: 'So while the father lives, for the mother one leaves office, wears hemmed sackcloth one cycle, and heart-mourns three years—honored reduction: feeling extended, ritual cut.',
  },
  s0068: {
    literal: 'This system can distinguish one from birds and beasts and set one apart from the civilized and the barbarian.',
    idiomatic: 'That system separates humans from beasts and the civilized from the barbarian.',
  },
  s0069: {
    literal: 'Xi, Nong, Yao, and Shun—none altered it;',
    idiomatic: 'Xi, Nong, Yao, and Shun never altered it;',
  },
  s0070: {
    literal: 'Wen, Wu, Zhou, and Confucius honored it alike.',
    idiomatic: 'Wen, Wu, the Zhou, and Confucius honored it alike.',
  },
  s0071: {
    literal: 'If now one abandons the weight of honored reduction, injures the principle of honoring the father, overlooks the suspicion of plain white garments, and invites the blame of being un-sage-like, then affairs do not take the ancients as teachers and name-teaching is wounded.',
    idiomatic: 'To cast off honored reduction, wound reverence for the father, ignore the suspicion plain garments guard against, and invite the charge of defying the sages would abandon the ancients and harm moral teaching.',
  },
  s0072: {
    literal: 'The mother\'s sister shares the name of the mother\'s sister—she is the mother\'s female kindred; increasing mourning for the mother\'s brother has reason in it.',
    idiomatic: 'A mother\'s sister shares the mother\'s sister\'s name—she is the mother\'s female line; raising mourning for a mother\'s brother has its reason.',
  },
  s0073: {
    literal: 'Sister-in-law and younger uncle do not wear mourning—to avoid suspicion.',
    idiomatic: 'Sisters-in-law and younger uncles wore no mourning—to avoid suspicion.',
  },
  s0074: {
    literal: 'If one cites finest hemp for sharing the hearth and forgets the trace of pushing distant, it both departs from former sages and is hard to follow.',
    idiomatic: 'To cite finest hemp for sharing a hearth and forget the rule of pushing kin distant both departs from the sages and is hard to follow.',
  },
  s0075: {
    literal: 'We respectfully examine the doubts in all three cases and together request that following the ancient is correct.',
    idiomatic: 'On all three doubtful points he asked that the ancient rule stand.',
  },
  s0076: {
    literal: '" From this the hundred officials\' deliberations did not decide.',
    idiomatic: 'The bureaucracy still could not settle.',
  },
  s0077: {
    literal: 'By the eighth month of the seventh year a decree: "The passage concluded." From this in the homes of ministers and grandees, mourning for the mother while the father lived differed: some, having completed one cycle and end-of-mourning, wore end-of-mourning garments sixty days then left garments, with heart mourning three years;',
    idiomatic: 'Seventh year, eighth month: a decree; the passage concluded. Thereafter ministerial households diverged: some finished one cycle and end-of-mourning, wore end-of-mourning dress sixty days, then left garments while heart-mourning three years;',
  },
  s0078: {
    literal: 'some, having completed one cycle, wore end-of-mourning garments for the full three years;',
    idiomatic: 'some kept end-of-mourning dress the full three years after one cycle;',
  },
  s0079: {
    literal: 'some followed the Shangyuan system of hemmed sackcloth three years.',
    idiomatic: 'some followed Shangyuan\'s hemmed sackcloth for three years.',
  },
  s0080: {
    literal: 'Debaters of the time right and wrong were clamorous; Yuan Xingchong said to people: "The sage instituted the ritual of honored reduction—how could he not know the depth of a mother\'s kindness? It is because one honors the grandfather and values the temple founder, wishing people to keep far from beasts and near yet distinct from barbarians.',
    idiomatic: 'Opinion swarmed; Yuan Xingchong told colleagues: the sage made honored reduction knowing a mother\'s kindness full well—he honored the grandfather and the temple founder so people would stand far from beasts and near yet apart from barbarians.',
  },
  s0081: {
    literal: 'Human feeling is easy to sway; those of shallow understanding are many.',
    idiomatic: 'Feeling sways easily; shallow views are common.',
  },
  s0082: {
    literal: 'Once the measure is disorderly, how can it be stopped!',
    idiomatic: 'Once the measure tangles, who can stop it?',
  },
  s0083: {
    literal: '" In the twentieth year, Secretariat Director Xiao Song and academicians again revised and fixed the Five Rites, and again deliberated requesting that according to the Shangyuan decree, when the father is alive hemmed sackcloth three years for the mother be made fixed.',
    idiomatic: 'Year twenty: Secretariat Director Xiao Song and the academicians revised the Five Rites and again asked to fix Shangyuan\'s rule—hemmed sackcloth three years for a mother while the father lived.',
  },
  s0084: {
    literal: 'When the rites were promulgated, all followed it in practice.',
    idiomatic: 'When the rites were issued, everyone followed them.',
  },
  s0085: {
    literal: 'In the twenty-third year, after the plowing rite was completed, a formal ordinance said: "The passage concluded." Director of Ceremonies Wei Yun memorialized, saying: "We respectfully note the Ceremonial Ritual Mourning Dress: mother\'s brother, three months\' finest hemp.',
    idiomatic: 'Year twenty-three, after the plowing rite: a formal ordinance; the passage concluded. Director of Ceremonies Wei Yun wrote, citing the Ceremonial Mourning Dress: a mother\'s brother, three months\' finest hemp.',
  },
  s0086: {
    literal: 'Mother\'s sister, five months\' lesser accomplishment.',
    idiomatic: 'A mother\'s sister, five months\' lesser accomplishment.',
  },
  s0087: {
    literal: 'The Commentary says: one may use lesser accomplishment—added by the name.',
    idiomatic: 'The Commentary: lesser accomplishment may apply—the name adds the grade.',
  },
  s0088: {
    literal: 'Hall mother\'s brothers and sisters, mother\'s brothers\' wives—kindness does not reach.',
    idiomatic: 'Hall cousins on the mother\'s side and uncles\' wives—kindness does not reach them.',
  },
  s0089: {
    literal: 'Maternal grandparents.',
    idiomatic: 'Maternal grandparents—',
  },
  s0090: {
    literal: 'five months\' lesser accomplishment.',
    idiomatic: 'five months of lesser accomplishment mourning.',
  },
  s0091: {
    literal: 'The Commentary says: why lesser accomplishment? Added by the honored status.',
    idiomatic: 'The Commentary asks why lesser accomplishment: honor raises the grade.',
  },
  s0092: {
    literal: 'Mother\'s brother, three months\' finest hemp—all are close in feeling yet distant in garment kinship.',
    idiomatic: 'A mother\'s brother, three months\' finest hemp—all close in feeling, distant in kin grade.',
  },
  s0093: {
    literal: 'Maternal grandparents are primary elders, the same as mourning for the mother\'s sister.',
    idiomatic: 'Maternal grandparents are primary elders, the same grade as a mother\'s sister.',
  },
  s0094: {
    literal: 'Mother\'s sister and mother\'s brother are one class, yet garments differ in light and heavy.',
    idiomatic: 'Mother\'s sister and mother\'s brother are one class, yet the garments differ in weight.',
  },
  s0095: {
    literal: 'Hall mother\'s brothers and sisters—the kin is not yet distant, yet kindness is severed and they do not wear mourning for one another.',
    idiomatic: 'Hall cousins are not yet distant kin, yet kindness is cut and they wear no mourning for each other.',
  },
  s0096: {
    literal: 'A mother\'s brother\'s wife who comes to join the outer clan—the ritual of sharing the hearth is not added.',
    idiomatic: 'An uncle\'s wife who joins the outer clan does not receive the shared-hearth rite.',
  },
  s0097: {
    literal: 'I venture that in ancient intent something is still not fully expressed.',
    idiomatic: 'Ancient intent, he ventured, was not yet fully expressed.',
  },
  s0098: {
    literal: 'Moreover for maternal grandparents lesser accomplishment—this is primary elder, feeling very close yet garment kinship distant—we request increase to greater accomplishment nine months.',
    idiomatic: 'Maternal grandparents wore lesser accomplishment though feeling was very close and kin grade distant—he asked to raise them to nine months\' greater accomplishment.',
  },
  s0099: {
    literal: 'Mother\'s sister and mother\'s brother are the same class; the kin is without distinction—the garment ought to be equal; we request for the mother\'s brother increase to five months\' lesser accomplishment.',
    idiomatic: 'Mother\'s sister and mother\'s brother were the same class without kin distinction—the garment should match; he asked five months\' lesser accomplishment for a mother\'s brother.',
  },
  s0100: {
    literal: 'Hall mother\'s brothers and sisters reduced one grade; a mother\'s brother\'s wife following-garment precedent—formerly no garment text existed—we together hope to add to baring shoulder and untying cap-band.',
    idiomatic: 'Hall cousins dropped one grade; an uncle\'s wife had no prior garment rule—he asked baring shoulder and untying the cap-band for them all.',
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
if (data.metadata.chapter !== '027') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 027; standalone T ready (${Object.keys(T).length} entries).`
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
