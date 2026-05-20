#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.031, Rites 7 / mourning) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/031.json';
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
    literal: 'Treatise Seven: Rites Seven.',
    idiomatic: 'Treatise 7 — Rites 7 (mourning dress).',
  },
  s0002: {
    literal: 'In the fourteenth year of Zhenguan, when Taizong, on an occasion when rites-revising officials were presenting business, spoke of mourning dress, Taizong said: "Those who share a hearth still owe finest-hemp kinship, yet sister-in-law and younger uncle wear none.',
    idiomatic: 'Zhenguan 14: while hearing the ritual officers on routine business, Taizong turned to mourning dress. He said that kin who shared a single hearth still owed three months\' finest hemp — yet a sister-in-law and her husband\'s younger brother wore nothing at all.',
  },
  s0003: {
    literal: 'Again, the mother\'s brother and the mother\'s sister are alike in closeness, yet their mourning grades differ — the principle is not yet right.',
    idiomatic: 'A mother\'s brother and a mother\'s sister were similarly close in feeling, yet the code graded their mourning differently — that could not stand.',
  },
  s0004: {
    literal: 'It is fitting to gather scholars for detailed deliberation.',
    idiomatic: 'He ordered scholars to deliberate the matter in full.',
  },
  s0005: {
    literal: 'I also have cases where kinship is heavy yet mourning is light — these too I append for memorial and report." The passage concluded.',
    idiomatic: 'He added cases where affection was deep but the prescribed mourning was light, and asked that those be reported as well. The passage concluded."',
  },
  s0006: {
    literal: 'Thereupon Palace Attendant Wei Zheng, Vice Minister of Rites Linghu Defen, and others submitted a deliberation, saying:',
    idiomatic: 'Palace Attendant Wei Zheng, Vice Minister of Rites Linghu Defen, and others then submitted a memorial.',
  },
  s0007: {
    literal: 'Your subjects have heard that ritual is what resolves doubt, settles hesitation, separates sameness and difference, and clarifies right and wrong.',
    idiomatic: 'Ritual, they wrote, resolves doubt, settles hesitation, separates like from unlike, and shows right from wrong.',
  },
  s0008: {
    literal: 'It does not descend from Heaven, does not emerge from Earth — it is human feeling, nothing more.',
    idiomatic: 'It does not fall from the sky or rise from the soil; it is nothing but human feeling.',
  },
  s0009: {
    literal: 'Now, kin groups have nine degrees; mourning technique has six grades — following affection for thinness or thickness, fitting feeling to establish pattern.',
    idiomatic: 'Kinship has nine degrees; mourning has six grades — affection sets thickness, feeling sets the written rule.',
  },
  s0010: {
    literal: 'Yet the mother\'s brother and the mother\'s sister, though of the same breath, when feeling is weighed and principle measured, precedence and posteriority truly differ.',
    idiomatic: 'A mother\'s brother and a mother\'s sister shared one breath of kin, yet in feeling and principle their precedence was not the same.',
  },
  s0011: {
    literal: 'How so?',
    idiomatic: 'Why?',
  },
  s0012: {
    literal: 'The mother\'s brother is the mother\'s root clan; the mother\'s sister is external kin, another clan — sought in the mother\'s clan, the sister is not there; examined in the classics, the brother is truly the heavier.',
    idiomatic: 'The mother\'s brother belonged to her native line; the mother\'s sister to outside kin. Search the mother\'s clan and the sister does not appear in it; search the classics and the brother weighs heavier.',
  },
  s0013: {
    literal: 'Thus the Zhou king remembered Qi and often called it the state of maternal uncle and nephew;',
    idiomatic: 'The Zhou king, remembering Qi, called it the land of uncle and nephew;',
  },
  s0014: {
    literal: 'the Qin lord yearned for Jin — it truly answers the "Wei-yang" ode.',
    idiomatic: 'the Qin lord\'s longing for Jin answered the Ode\'s "On the Wei-yang."',
  },
  s0015: {
    literal: 'for the mother\'s brother mourning stops at one cycle, yet for the mother\'s sister one dwells in mourning five months — following the name loses the substance, chasing the branch abandons the root.',
    idiomatic: 'mourning for a mother\'s brother stopped at one year, yet for a mother\'s sister ran five months — the label had swallowed the substance, the branch had been chased and the root left behind.',
  },
  s0016: {
    literal: 'Perhaps the ancients\' feeling in places did not reach clarity — what should be reduced or increased lies here!',
    idiomatic: 'Perhaps ancient feeling had not always been clear — here was where the code should be trimmed or enlarged.',
  },
  s0017: {
    literal: 'The Record says: "A brother\'s son is like a son.',
    idiomatic: 'The Record says: "A brother\'s son is as a son —',
  },
  s0018: {
    literal: 'This is drawing him forward and advancing him;',
    idiomatic: 'that is drawing him near and raising him up;',
  },
  s0019: {
    literal: 'that sister-in-law and younger uncle do not wear mourning is pushing away and keeping distant." The passage concluded.',
    idiomatic: 'that sister-in-law and younger uncle wear none is pushing away and holding at distance." The passage concluded."',
  },
  s0020: {
    literal: 'Ritual: for a stepfather with whom one shared a dwelling, one wears mourning for one year;',
    idiomatic: 'Ritual fixed one year for a stepfather with whom one had shared a dwelling;',
  },
  s0021: {
    literal: 'if one never shared a dwelling, one does not wear mourning.',
    idiomatic: 'if one had never shared a dwelling, no mourning was worn.',
  },
  s0022: {
    literal: 'The mother\'s sister\'s husband and the mother\'s brother\'s wife — the two ladies wear mourning for each other.',
    idiomatic: 'A mother\'s sister\'s husband and a mother\'s brother\'s wife wore mourning for each other.',
  },
  s0023: {
    literal: 'Some say: shared-hearth finest hemp.',
    idiomatic: 'Some texts read: finest hemp, as for shared hearth.',
  },
  s0024: {
    literal: 'Thus stepfathers and the like are all not bone-and-flesh — mourning\'s weight comes from shared hearth, affection\'s lightness from separate dwelling.',
    idiomatic: 'Stepfathers and the like were not bone kin — weight came from one hearth, lightness from living apart.',
  },
  s0025: {
    literal: 'Hence one knows that though mourning garments are tied to names,',
    idiomatic: 'Mourning garments hung on names,',
  },
  s0026: {
    literal: 'they also follow the thickness or thinness of affection.',
    idiomatic: 'yet they also followed how deep affection ran.',
  },
  s0027: {
    literal: 'Sometimes there is a sister-in-law of many years who meets a younger uncle still a child — she toils in rearing, feeling like fresh birth, sharing hunger and cold, bound in hardship to grow old together.',
    idiomatic: 'Sometimes a sister-in-law of long years raises a brother-in-law still a boy — she toils as for a new birth, shares hunger and cold, grows old through hardship beside him.',
  },
  s0028: {
    literal: 'It is like a stepfather of shared dwelling compared with another\'s shared hearth — can the depth of feeling and principle be spoken of on the same day!',
    idiomatic: 'That bond is not the same as sharing a hearth with a stranger — how could its depth be weighed on the same scale!',
  },
  s0029: {
    literal: 'In life one loves him as bone-and-flesh;',
    idiomatic: 'In life they loved him as kin;',
  },
  s0030: {
    literal: 'at death one says push away and keep distant.',
    idiomatic: 'at death the code said: push away, keep distant.',
  },
  s0031: {
    literal: 'Sought to the root origin — deeply not yet understood.',
    idiomatic: 'Sought to its root, the rule made no sense.',
  },
  s0032: {
    literal: 'If pushing away and keeping distant is right, then in life one cannot dwell together;',
    idiomatic: 'If distance were right, they could not have lived together;',
  },
  s0033: {
    literal: 'if dwelling together in life is right, then at death one cannot walk the same road.',
    idiomatic: 'if living together were right, they could not part on the road at death.',
  },
  s0034: {
    literal: 'Heavy in life yet light in death, thick at the beginning yet thin at the end — fitting feeling to establish pattern, where is the principle?',
    idiomatic: 'Heavy for the living, light for the dead — thick at the start, thin at the end: where was the principle in "fitting feeling to pattern"?',
  },
  s0035: {
    literal: 'Moreover service to a sister-in-law is praised — the records are not one.',
    idiomatic: 'Histories praise devotion to a sister-in-law more than once.',
  },
  s0036: {
    literal: 'Zheng Zhongyu\'s ritual affection was very thick; Yan Hongdu\'s sincerity moved others; Ma Yuan put on his cap whenever he saw her; Kong Ji wept at the appointed place.',
    idiomatic: 'Zheng Zhongyu kept ritual affection thick; Yan Hongdu moved others by sincerity; Ma Yuan capped himself whenever he met her; Kong Ji wept in the mourning place.',
  },
  s0037: {
    literal: 'These all personally practiced teaching and righteousness, benevolence deep and filial friendship firm — examining the aim they honored, are they not foreknowers?',
    idiomatic: 'Each embodied teaching and righteousness, deep in benevolence and filial bond — judged by what they honored, were they not men who saw ahead?',
  },
  s0038: {
    literal: 'But in their time there was no sage king above, and ritual was not for inferiors to debate — thus deep feeling was pent for a thousand years, ultimate principle hidden for ten thousand generations; the lapse is old — how is it not lamentable!',
    idiomatic: 'Yet in their day no sage king ruled above, and ritual was not for subjects to debate — deep feeling pent up a thousand years, ultimate principle buried ten thousand generations: a long waste, and a bitter one.',
  },
  s0039: {
    literal: 'Now we belong to an era when reverent clarity is in the ascendant and the sage acts — the five rites are detailed and complete, not one thing left out.',
    idiomatic: 'Now reverent clarity ascends and the sage acts — the five rites are complete, nothing left out.',
  },
  s0040: {
    literal: 'Yet he still forever ponders careful completion and gathers his spirit in far thought.',
    idiomatic: 'Yet he still ponders careful endings and gathers his mind on what lies far off.',
  },
  s0041: {
    literal: 'He holds that the sequence of honored and humble, though brilliant in great completeness,',
    idiomatic: 'The order of high and low is brilliantly complete,',
  },
  s0042: {
    literal: 'the system of mourning regulations — feeling and principle are not yet everywhere round.',
    idiomatic: 'yet mourning regulations still do not everywhere match feeling and principle.',
  },
  s0043: {
    literal: 'Therefore he has charged the Director of Ritual to examine again in detail.',
    idiomatic: 'He has charged the Director of Ritual to examine them again.',
  },
  s0044: {
    literal: 'Your subjects, memorializing in accord with the luminous intent, touching categories and seeking widely, gathering the group of classics, debating the transmissions —',
    idiomatic: 'Following the imperial intent, we searched widely, gathered classics, debated commentaries —',
  },
  s0045: {
    literal: 'sometimes citing both name and substance, ordering ritual without pattern, raising thick kinship feeling entirely, changing shallow custom of the past, handing down solid righteousness to the future — truly what the six classics cannot discuss, what a hundred kings alone attain.',
    idiomatic: 'joining name to substance, ordering what had lacked pattern, raising kinship feeling, changing old shallowness, handing solid righteousness to the future — what the six classics do not say, what only this throne attains alone.',
  },
  s0046: {
    literal: 'What the various Confucians hold differs and agrees — sought carefully for the center, the sage intent is declared.',
    idiomatic: 'Confucians differ; we sought the mean and declare the sage intent.',
  },
  s0047: {
    literal: 'We respectfully note: great-great-grandparents formerly wore trimmed sackcloth three months — we request increase to trimmed sackcloth five months.',
    idiomatic: 'Great-great-grandparents had worn trimmed sackcloth three months; we ask five months.',
  },
  s0048: {
    literal: 'The principal son\'s wife formerly wore greater accomplishment — we request increase to one year.',
    idiomatic: 'A principal son\'s wife had worn greater accomplishment; we ask one year.',
  },
  s0049: {
    literal: 'The various sons\' wives wore lesser accomplishment — we now request the same as brothers\' sons\' wives: greater accomplishment nine months.',
    idiomatic: 'Various sons\' wives had worn lesser accomplishment; we ask the same as a brother\'s son\'s wife: greater accomplishment, nine months.',
  },
  s0050: {
    literal: 'Sister-in-law and younger uncle formerly had no mourning — we now request lesser accomplishment five months in return.',
    idiomatic: 'Sister-in-law and younger uncle had worn none; we ask lesser accomplishment five months, with return mourning.',
  },
  s0051: {
    literal: 'A younger brother\'s wife and an elder brother of the husband — also lesser accomplishment five months.',
    idiomatic: 'A younger brother\'s wife and a husband\'s elder brother — also lesser accomplishment five months.',
  },
  s0052: {
    literal: 'The mother\'s brother wore finest hemp — we request the same as the mother\'s sister: lesser accomplishment.',
    idiomatic: 'A mother\'s brother had worn finest hemp; we ask lesser accomplishment, as for a mother\'s sister.',
  },
  s0053: {
    literal: 'The ordinance approved it.',
    idiomatic: 'The throne approved.',
  },
  s0054: {
    literal: 'In the ninth month of the second year of Xianqing, rites-revising officials Zhangsun Wuji and others again memorialized, saying: "According to ancient mourning dress, a nephew for his mother\'s brother wears finest hemp; the mother\'s brother\'s return mourning for the nephew follows the same rule.',
    idiomatic: 'Xianqing 2, ninth month: Zhangsun Wuji and the ritual revision staff wrote that under the old code a nephew wore finest hemp for his mother\'s brother, and the uncle reciprocated the same.',
  },
  s0055: {
    literal: 'In the Zhenguan era the Eight Seats deliberated and memorialized: \'For the mother\'s brother, mourning is the same as for the mother\'s sister — lesser accomplishment five months.',
    idiomatic: 'In Zhenguan the Eight Seats had ruled that mourning for a mother\'s brother matched a mother\'s sister: lesser accomplishment five months.',
  },
  s0056: {
    literal: '\' Yet in the present Code and Commentaries, the mother\'s brother\'s return mourning toward the nephew is still three months.',
    idiomatic: 'Yet the current Code and Commentaries still fixed the uncle\'s return mourning for a nephew at three months.',
  },
  s0057: {
    literal: 'We respectfully note that for mourning toward collateral elders, ritual never lacks return mourning; though they are not primary elders, one dare not reduce it.',
    idiomatic: 'Collateral elders always received return mourning; though not primary kin, the grade must not be cut.',
  },
  s0058: {
    literal: 'Thus a nephew for the mother\'s sister wears five months; the mother\'s sister\'s return for the nephew is lesser accomplishment; a nephew for the mother\'s brother wears finest hemp; the mother\'s brother also returns finest hemp for the nephew three months — that is the principle.',
    idiomatic: 'So a nephew wore five months for a mother\'s sister, and she returned lesser accomplishment; for a mother\'s brother he wore finest hemp, and the uncle returned three months\' finest hemp — that was the pattern.',
  },
  s0059: {
    literal: 'Now if a nephew for his mother\'s brother is made the same as mourning for the mother\'s sister, then the mother\'s brother ought to advance his return for the nephew to match the mother\'s sister\'s return.',
    idiomatic: 'If a nephew\'s mourning for his mother\'s brother was raised to match a mother\'s sister, the uncle\'s return should rise to match her return as well.',
  },
  s0060: {
    literal: 'Those who revised the Code and Commentaries did not know ritual intent; the mother\'s brother\'s return mourning for the nephew still stopping at finest hemp is inconsistent with precedent and ritual must be corrected.',
    idiomatic: 'The Code revisers had missed the point: leaving the uncle\'s return at finest hemp broke precedent and had to be fixed.',
  },
  s0061: {
    literal: 'We now request revision of the Code and Commentaries so that the mother\'s brother\'s return mourning for the nephew is also lesser accomplishment." The passage concluded.',
    idiomatic: 'They asked that the Code be amended so the uncle\'s return mourning for a nephew was also lesser accomplishment. The passage concluded."',
  },
  s0062: {
    literal: '" They also said: "In ancient ritual a secondary mother was finest hemp; in the new ritual there is no mourning.',
    idiomatic: 'They added: ancient ritual required finest hemp for a secondary mother; the new code required none.',
  },
  s0063: {
    literal: 'We respectfully note that sons of a secondary mother are one\'s own brothers and sisters; for them one wears staff for one year, yet for the secondary mother oneself wears none.',
    idiomatic: 'Sons of a secondary mother were full siblings: one wore staff for a year for them, yet wore nothing for the secondary mother herself.',
  },
  s0064: {
    literal: 'Within the same breath, fortune and misfortune suddenly differ — sought in ritual feeling, this is deeply not ultimate reason.',
    idiomatic: 'Within one flesh, joy and grief were graded worlds apart — a poor fit to ritual feeling.',
  },
  s0065: {
    literal: 'We request that according to ancient precedent mourning of finest hemp be worn." The passage concluded.',
    idiomatic: 'They asked that precedent be restored: finest hemp for a secondary mother. The passage concluded."',
  },
  s0066: {
    literal: '" The ordinance again approved.',
    idiomatic: 'The throne approved again.',
  },
  s0067: {
    literal: 'In the eighth month of the second year of Longshuo, the relevant office memorialized: "Director of Literary Affairs Xiao Siye\'s legitimate stepmother remarried and died; he requests to declare heart mourning.',
    idiomatic: 'Longshuo 2, eighth month: the relevant office reported that Xiao Siye, Director of Literary Affairs, sought heart mourning after his legitimate stepmother remarried and died.',
  },
  s0068: {
    literal: 'According to the ordinance, a stepmother\'s remarriage and being the eldest son both do not require leaving office.',
    idiomatic: 'The code said neither a stepmother\'s remarriage nor being eldest son required leaving office.',
  },
  s0069: {
    literal: '" Thereupon an edict: "Though it is called legitimate mother, in the end it is stepmother — according to ritual, following feeling, there must be a fixed regulation.',
    idiomatic: 'An edict followed: though she was called legitimate mother, she was still a stepmother — ritual following feeling required a fixed rule.',
  },
  s0070: {
    literal: 'Deliver to the relevant office to deliberate, fix, and memorialize." The passage concluded.',
    idiomatic: 'The matter was sent to the relevant offices to deliberate and report. The passage concluded."',
  },
  s0071: {
    literal: 'Director of Ceremonies and Grand Master of Splendid Happiness Bo Yi, Prince of Longxi Commandery, and others memorialized, stating:',
    idiomatic: 'Director of Ceremonies Bo Yi, Prince of Longxi, and others wrote:',
  },
  s0072: {
    literal: 'Tracing the Mourning Dress, the names for mother are thus fixed — legitimate, step, loving, and foster are all within it.',
    idiomatic: 'The Mourning Dress fixed the names of mother — legitimate, step, loving, and foster all fell within it.',
  },
  s0073: {
    literal: 'Only the rule for a mother who has left the household specially speaks of the son of a wife who has left — making clear that if she did not bear one, all wear none.',
    idiomatic: 'Only for a mother who had left the household did the text speak of the son of a departed wife — if she had not borne you, you wore none.',
  },
  s0074: {
    literal: 'Thus the ordinance says when the mother remarries, and again says the son of a wife who has left.',
    idiomatic: 'Hence the code spoke of a mother\'s remarriage and of the son of a departed wife.',
  },
  s0075: {
    literal: 'Speaking of the son marks who bore him; speaking of remarriage names the mother — broadly including foster and legitimate, all should leave office, together with heart mourning.',
    idiomatic: '"Son" marked who bore you; "remarriage" named the mother — foster and legitimate alike should leave office and observe heart mourning.',
  },
  s0076: {
    literal: 'What does not require leaving office is only when the stepmother remarries.',
    idiomatic: 'Only a stepmother\'s remarriage was exempt from leaving office.',
  },
  s0077: {
    literal: 'The name stepmother is properly based on the son of a former wife;',
    idiomatic: 'The name stepmother properly applied to the son of a former wife;',
  },
  s0078: {
    literal: 'among the various sons, legitimate — in ritual there is no text of stepmother.',
    idiomatic: 'among various sons by rank, "legitimate stepmother" had no place in ritual text.',
  },
  s0079: {
    literal: 'The first-grade ordinance is now in force; Siye by principle should declare heart mourning.',
    idiomatic: 'The first-grade ordinance was in force; Siye should by rights declare heart mourning.',
  },
  s0080: {
    literal: 'Yet following the edict to deliberate and fix, to hand down an eternal rule — where the ordinance is unsound, it too must be corrected.',
    idiomatic: 'Yet the edict sought a lasting rule — where the ordinance was unsound, it too must be corrected.',
  },
  s0081: {
    literal: 'We venture that legitimate, step, loving, and foster — none are those who bore one — all alike do not walk the same road.',
    idiomatic: 'Legitimate, step, loving, and foster — none were birth mothers — all alike broke the road of kinship at death.',
  },
  s0082: {
    literal: 'Remarriage, though slightly lighter than leaving the household, toward the father is in the end severance of righteousness.',
    idiomatic: 'Remarriage was slightly lighter than leaving the household, yet toward the father it severed righteousness.',
  },
  s0083: {
    literal: 'When the stepmother remarries, she is already unlike the birth mother — loving and legitimate righteousness severed, how can heart mourning fit?',
    idiomatic: 'A stepmother\'s remarriage was unlike a birth mother\'s; loving and legitimate ties were severed — how could heart mourning fit?',
  },
  s0084: {
    literal: 'We hope to request: for all who did not bear one, when the father dies and she remarries — he who becomes father\'s successor wears none; he who does not bear the weight wears staff for one year — all without heart mourning, the same as stepmother.',
    idiomatic: 'We ask: for any non-birth mother who remarried after the father\'s death — the heir wore none; others wore staff for one year — none with heart mourning, as for a stepmother.',
  },
  s0085: {
    literal: 'It accords with feeling and ritual and does not stain the old chapters.',
    idiomatic: 'That would match feeling and ritual without staining the old chapters.',
  },
  s0086: {
    literal: 'Again, the heart-mourning system applies only when garments are reduced; staff-for-one-year mourning should not require leaving office.',
    idiomatic: 'Heart mourning applied only when garments were reduced; staff-for-one-year mourning should not require leaving office.',
  },
  s0087: {
    literal: 'Yet in the ordinance text three years\' trimmed sackcloth also falls under heart mourning;',
    idiomatic: 'Yet the code counted three years\' trimmed sackcloth as heart mourning;',
  },
  s0088: {
    literal: 'staff-for-one-year leaving office also has the error of wife\'s mourning.',
    idiomatic: 'staff-for-one-year leaving office confused wife\'s mourning as well.',
  },
  s0089: {
    literal: 'Again, according to ritual, a secondary son for his mother wears finest hemp three months.',
    idiomatic: 'Ritual fixed finest hemp three months for a secondary son\'s birth mother.',
  },
  s0090: {
    literal: 'Since it is mourning for the mother who bore one, by precedent one should also leave office.',
    idiomatic: 'As mourning for the mother who bore him, precedent also required leaving office.',
  },
  s0091: {
    literal: 'The ordinance text omits and does not speak — in the matter it must finally be revised and appended.',
    idiomatic: 'The code omitted that case — it must be revised and appended.',
  },
  s0092: {
    literal: 'Since it is in the same ordinance article as legitimate mother\'s remarriage, deliberated together we request change — the principle is acceptable.',
    idiomatic: 'Grouped with legitimate mother\'s remarriage in one article, we ask a joint revision — the principle is sound.',
  },
  s0093: {
    literal: 'According to gathering civil and military officials of the ninth rank and above for deliberation.',
    idiomatic: 'Civil and military officials of the ninth rank and above were gathered to deliberate.',
  },
  s0094: {
    literal: 'From Director of Palace Guards Fang Renyu and seven hundred thirty-six persons — deliberation: request uniform accord with the Director of Ceremonies\' position; Siye does not leave office.',
    idiomatic: 'Fang Renyu, Director of Palace Guards, and 736 others held with the Director of Ceremonies: Siye need not leave office.',
  },
  s0095: {
    literal: 'From Right Golden Crow Guard General Xue Guwu Ren and twenty-six persons — deliberation: request removing Siye from office, not agreeing with the Director of Ceremonies\' position.',
    idiomatic: 'Xue Guwu Ren of the Right Golden Crow Guard and 26 others asked that Siye leave office, dissenting from the Director of Ceremonies.',
  },
  s0096: {
    literal: 'The mother did not bear one; leaving the household severs righteousness — yet still ordering removal from office disorderly follows feeling.',
    idiomatic: 'A non-birth mother\'s departure severed righteousness — yet still ordering him from office tangled feeling, not clarified it.',
  },
  s0097: {
    literal: 'Staff-for-one-year leaving office does not distinguish wife\'s mourning; three years\' trimmed sackcloth is wrongly called heart mourning.',
    idiomatic: 'Staff-for-one-year leaving office failed to distinguish a wife\'s mourning; three years\' trimmed sackcloth was wrongly called heart mourning.',
  },
  s0098: {
    literal: 'A secondary son\'s finest hemp for his mother — the middle regulation is omitted within.',
    idiomatic: 'A secondary son\'s finest hemp for his mother was omitted from the middle grades.',
  },
  s0099: {
    literal: 'These are all sparse errors in the ordinance text — in principle hard to follow by inheritance.',
    idiomatic: 'These were gaps and errors in the code — hard to inherit as they stood.',
  },
  s0100: {
    literal: 'Following Fang Renyu and the others\' deliberation, revise and append in total, to hand down without decay.',
    idiomatic: 'Following Fang Renyu\'s majority, revise and append in full, and hand it down without decay.',
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
if (data.metadata.chapter !== '031') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 031; standalone T ready (${Object.keys(T).length} entries).`
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
