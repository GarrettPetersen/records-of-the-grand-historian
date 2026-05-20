#!/usr/bin/env node
/** Batch 4: s0301–s0400 (Jiutangshu ch.031, Rites 7 / mourning) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/031.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 301;
const END = 400;

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
  s0301: {
    literal: 'Some followed the Shangyuan regulation of qi sackcloth for three years.',
    idiomatic: 'Some still followed the Shangyuan rule of three years\' qi sackcloth for the mother.',
  },
  s0302: {
    literal: 'At the time deliberators were divided in approval and blame; Yuan Xingchong said to people: "The sage fashioned the ritual of honored reduction—how could he not know the mother\'s favor is deep? It is to honor the grandfather and value the father, wishing men far to separate from beasts and near to differ from barbarians."',
    idiomatic: 'Debate was fierce; Yuan Xingchong said: "The sage made honored-reduction mourning knowing the mother\'s debt is deep—yet he honored grandfather and father so men would stand far from beasts and near from barbarians."',
  },
  s0303: {
    literal: 'Human feeling is easy to shake; shallow understanding is common.',
    idiomatic: 'Feeling shifts easily; shallow views are many.',
  },
  s0304: {
    literal: 'Once one confuses the measure, can it be stopped!',
    idiomatic: 'Once the measure is confused, how can it be stopped!',
  },
  s0305: {
    literal: '" In the twentieth year, Secretariat Director Xiao Song and academicians revised and fixed the Five Rites; they again deliberated and asked to take the Shangyuan edict—while the father lives, qi sackcloth three years for the mother—as fixed.',
    idiomatic: 'In year twenty, Xiao Song and the academicians revised the Five Rites and again asked to fix Shangyuan\'s rule: three years\' qi for the mother while the father lives.',
  },
  s0306: {
    literal: 'When the rites were promulgated, all uniformly followed them.',
    idiomatic: 'When the rites were issued, all followed them uniformly.',
  },
  s0307: {
    literal: 'In the twenty-third year, when the plowing rite was completed, a formal regulation said: "In the canon of mourning dress, some points may not be fully clear; ritual officials and scholars should deliberate in detail and report."',
    idiomatic: 'In year twenty-three, after the plowing rite, a regulation said: "Some mourning rules remain unclear; let ritual officers and scholars debate and report."',
  },
  s0308: {
    literal: '" Director of the Court of Imperial Sacrifices Wei Tao memorialized: "Respectfully according to the Mourning Dress in the Ceremonies: maternal uncle, finest hemp three months."',
    idiomatic: 'Director Wei Tao wrote: "Per the Ceremonial Mourning Dress: a maternal uncle wears finest hemp for three months."',
  },
  s0309: {
    literal: 'Mother\'s sister, lesser merit five months.',
    idiomatic: 'A mother\'s sister: lesser merit five months.',
  },
  s0310: {
    literal: 'The Commentary says: may use lesser merit, by name increased.',
    idiomatic: 'The Commentary: lesser merit is permitted—added by name.',
  },
  s0311: {
    literal: 'Hall aunt and uncle, uncle\'s wife—favor does not reach.',
    idiomatic: 'Hall cousins and an uncle\'s wife lie outside the reach of favor.',
  },
  s0312: {
    literal: 'Maternal grandparents.',
    idiomatic: 'Maternal grandparents:',
  },
  s0313: {
    literal: 'lesser merit five months.',
    idiomatic: 'They wear lesser merit for five months.',
  },
  s0314: {
    literal: 'The Commentary says: why lesser merit? By honored rank increased.',
    idiomatic: 'The Commentary: why lesser merit? Honor adds a grade.',
  },
  s0315: {
    literal: 'Uncle, finest hemp three months—all are close in feeling but distant in kin category.',
    idiomatic: 'Uncle, finest hemp three months—all close in feeling, distant in kinship.',
  },
  s0316: {
    literal: 'Maternal grandfather as true honored rank, same mourning as mother\'s sister.',
    idiomatic: 'A maternal grandfather as true senior matches the mother\'s sister\'s grade.',
  },
  s0317: {
    literal: 'Aunt and uncle are one class; mourning then differs in weight.',
    idiomatic: 'Aunts and uncles are one class, yet grades differ in weight.',
  },
  s0318: {
    literal: 'Hall aunt and uncle: kin is not yet distant, yet favor is cut off and they do not wear mourning for one another.',
    idiomatic: 'Hall aunt and uncle: kin is not distant, yet favor is severed and no mourning is worn.',
  },
  s0319: {
    literal: 'A close uncle\'s wife comes to carry the external lineage; the ritual of sharing the hearth is not added.',
    idiomatic: 'A close uncle\'s wife joins the external line; shared-hearth ritual is not added.',
  },
  s0320: {
    literal: 'We venture that ancient intent still has what is not fully expressed.',
    idiomatic: 'Ancient intent, we think, is not yet fully expressed.',
  },
  s0321: {
    literal: 'Moreover for maternal grandparents in lesser merit—this is true honored rank, very close in feeling yet distant in kin category—we ask to increase to great merit nine months.',
    idiomatic: 'Maternal grandparents at lesser merit are true seniors, close in feeling yet distant in kin—we ask great merit for nine months.',
  },
  s0322: {
    literal: 'Aunt and uncle are peers; kin is already without distinction—mourning should be equal; we ask for the uncle to be increased to lesser merit five months.',
    idiomatic: 'Aunts and uncles are peers without kin distinction—mourning should be equal; we ask five months\' lesser merit for the uncle.',
  },
  s0323: {
    literal: 'Hall aunt and uncle reduced one grade; close uncle\'s wife follows mourning—the precedent had no fixed mourning text; all hope to be increased to tan mian.',
    idiomatic: 'Hall cousins drop one grade; a close uncle\'s wife follows mourning without prior fixed text—we ask tan mian for all.',
  },
  s0324: {
    literal: 'Your servant has heard that ritual adorns feeling and mourning follows righteous regulation; there may be continuations and changes, and what is to be reduced or increased can be made clear.',
    idiomatic: 'I have heard that ritual adorns emotion and mourning dress follows moral rule—where practice has shifted, what to add or trim can be stated plainly.',
  },
  s0325: {
    literal: 'The matter in its substance is already great; reason requires thorough deliberation.',
    idiomatic: 'The matter is weighty and calls for careful deliberation.',
  },
  s0326: {
    literal: 'We hope it may be entrusted to the Department of State Affairs to assemble the multitude of officials for detailed discussion, striving for compromise, and made a perpetual standard."',
    idiomatic: 'Please refer it to the Department of State Affairs for a full council of officials, seek a balanced outcome, and fix it as a lasting rule.',
  },
  s0327: {
    literal: 'Thereupon the Mentor of the Heir Apparent Cui Mian submitted a recommendation, saying: "Your servant has heard that when the Great Way was concealed, all under Heaven became one\'s household.',
    idiomatic: 'Then Mentor of the Heir Apparent Cui Mian memorialized: "I have heard that once the Great Way was hidden, the realm became a single household.',
  },
  s0328: {
    literal: 'The sages followed this and thereafter fashioned rites.',
    idiomatic: 'The sages took that as their basis and then fashioned ritual.',
  },
  s0329: {
    literal: 'The establishment of ritual teaching was fundamentally to rectify the family; when the family way is rectified, all under Heaven is settled.',
    idiomatic: 'Ritual teaching was instituted chiefly to set the household in order; when the household is right, the realm is stable.',
  },
  s0330: {
    literal: 'The way to rectify the family cannot be twofold; to gather and fix one deliberation, reason returns to the root lineage.',
    idiomatic: 'The way to order a household cannot be divided in two: one settled rule, with principle anchored in the main line.',
  },
  s0331: {
    literal: 'The father is honored and elevated; the mother is suppressed and demoted—how could one forget love and respect? One should preserve the order of human relations.',
    idiomatic: 'The father is exalted and the mother reduced in rank—not to forget love and respect, but to keep relational order.',
  },
  s0332: {
    literal: 'Therefore within there is zhan and cui; for external relations all wear si hemp; where honored names are added, it does not exceed one grade—this is the unchanging way of the former kings.',
    idiomatic: 'Hence within the family are the heaviest grades of mourning; for outside kin all wear the lightest hemp; added honor never exceeds one step—this is the former kings\' unchanging rule.',
  },
  s0333: {
    literal: 'What former sages recorded, later worthies transmitted—the coming of it is long.',
    idiomatic: 'Former sages recorded it, later worthies transmitted it—long established.',
  },
  s0334: {
    literal: 'Formerly Xin You, going to Yichuan, saw one with disheveled hair sacrificing in the wild and said: "Within a hundred years, will this not be the Rong?',
    idiomatic: 'Once Xin You, passing Yichuan, saw disheveled hair sacrificing in the wild and said: "Within a hundred years will this not be the Rong?',
  },
  s0335: {
    literal: 'Their ritual is already lost!"',
    idiomatic: 'Their ritual will perish first!"',
  },
  s0336: {
    literal: 'In Zhenguan ritual was revised and the old statutes changed; gradually the favor of the Wei-yang kin was broadened, not following the canon of Zhu and Si.',
    idiomatic: 'Zhenguan ritual revision widened Wei-yang kin favor and abandoned the Zhu-Si canon.',
  },
  s0337: {
    literal: 'After the Hongdao era, in the Tanglong interval, the state mandate twice shifted to external kin.',
    idiomatic: 'After Hongdao, in the Tanglong years, the mandate twice passed to outsiders.',
  },
  s0338: {
    literal: 'The omen of ritual\'s loss—perhaps this is seen; between Heaven and man—can one not be warned!',
    idiomatic: 'The omen of ritual\'s loss may already show; between Heaven and man—can we not be warned!',
  },
  s0339: {
    literal: 'At the beginning of Kaiyuan, Remonstrator Lu Lübing once submitted a memorial discussing the weight of mourning dress; an edict ordered collective deliberation.',
    idiomatic: 'Early Kaiyuan, Remonstrator Lu Lübing memorialized on mourning grades; the throne ordered collective debate.',
  },
  s0340: {
    literal: 'At the time group deliberation was clamorous; each clung to accumulated practice; the Court of Imperial Sacrifices and Ministry of Rites memorialized to follow the old fix.',
    idiomatic: 'Debate was noisy; each clung to habit; the Court of Imperial Sacrifices and Ministry of Rites asked to keep the old rule.',
  },
  s0341: {
    literal: 'Your Majesty exercised thought of examining antiquity and issued the clarity of independent decision; by the eighth year of Kaiyuan a special edict was specially sent down, uniformly following ancient ritual.',
    idiomatic: 'Your Majesty studied antiquity and ruled alone; in Kaiyuan eight a special edict restored ancient ritual throughout.',
  },
  s0342: {
    literal: 'The matter matched old fact; men knew the direction; thereby the lineage bond was secured—the blessing of the altars.',
    idiomatic: 'It matched precedent, men knew the direction, the lineage was secured—the altars\' blessing.',
  },
  s0343: {
    literal: 'To again plot a different deliberation—your servant has not understood.',
    idiomatic: 'To reopen debate—I do not understand why.',
  },
  s0344: {
    literal: 'We wish to keep the clear intent of the eighth year as the perpetual law for ten thousand generations."',
    idiomatic: 'Keep the eighth-year mandate as the law for ten thousand generations."',
  },
  s0345: {
    literal: 'Director in the Bureau of Appointments Wei Shu deliberated:',
    idiomatic: 'Director Wei Shu argued:',
  },
  s0346: {
    literal: 'Heaven gives birth to the ten thousand things; only the human is most spiritual.',
    idiomatic: 'Heaven births the ten thousand things; only humans are most spirit-filled.',
  },
  s0347: {
    literal: 'Therefore to honor the honored and be intimate with the intimate, distinguish birth and classify kin; while alive exhaust love and respect, when dead exhaust grief.',
    idiomatic: 'Hence honor the honored, cherish the intimate, sort kin by birth; alive exhaust love and respect, dead exhaust grief.',
  },
  s0348: {
    literal: 'Following feeling to set garments, examining affairs to establish words—former sages discussed, already diligently.',
    idiomatic: 'Garments follow feeling, words follow facts—former sages labored at this.',
  },
  s0349: {
    literal: 'From High Ancestor down to great-great-grandson, including oneself—this is called the nine kin groups.',
    idiomatic: 'From great-great-grandfather down through oneself—nine kin groups.',
  },
  s0350: {
    literal: 'From near reaching far, naming feeling to establish text, adjusting their weight and light—thereby the five garments.',
    idiomatic: 'From near to far, naming feeling to set text, adjusting weight—there are five garments.',
  },
  s0351: {
    literal: 'Although sometimes by righteousness reduced, sometimes by name increased, teaching has what it follows; principle does not exceed grades.',
    idiomatic: 'Sometimes reduced by righteousness, sometimes raised by name—teaching has its source; principle does not leap grades.',
  },
  s0352: {
    literal: 'The hundred kings do not change it; the three dynasties can be known; sun and moon hang together—all look up to it.',
    idiomatic: 'Hundred kings do not change it; three dynasties prove it; sun and moon alike—all look up.',
  },
  s0353: {
    literal: 'Since subtle words were cut off, the great meaning again diverged; though pattern and substance shifted, one must follow this regulation.',
    idiomatic: 'Since subtle words ceased, great meaning diverged; though form shifted, this regulation must be kept.',
  },
  s0354: {
    literal: 'Respectfully according to the Mourning Dress Commentary in the Ceremonies: "All mourning for external kin is finest hemp."',
    idiomatic: 'Per the Ceremonial Mourning Dress Commentary: "All external kin wear finest hemp."',
  },
  s0355: {
    literal: '" Zheng Xuan says: "External kin—different surnames."',
    idiomatic: 'Zheng Xuan: "External kin are different surnames."',
  },
  s0356: {
    literal: 'Proper mourning does not exceed finest hemp."',
    idiomatic: 'Formal mourning for them never exceeds finest hemp."',
  },
  s0357: {
    literal: '" Maternal grandparents, lesser merit five months, by honored rank increased.',
    idiomatic: 'Maternal grandparents: lesser merit five months, honor adds a grade.',
  },
  s0358: {
    literal: 'Mother\'s sister, lesser merit five months, by name increased.',
    idiomatic: 'Mother\'s sister: lesser merit five months, name adds a grade.',
  },
  s0359: {
    literal: 'Uncle, nephew on mother\'s side, grandson on mother\'s side, kin brothers Chinese and foreign—according to their root garment, finest hemp three months.',
    idiomatic: 'Uncle, sister\'s son, daughter\'s son, mixed kin brothers—root garment finest hemp three months.',
  },
  s0360: {
    literal: 'If matched as peers, the maternal grandfather is grandfather; the uncle is the category of paternal uncles.',
    idiomatic: 'As peers, a maternal grandfather is a grandfather; an uncle matches paternal uncles.',
  },
  s0361: {
    literal: 'Aunt, uncle, and paternal uncles—then the parents\' favor is not different, yet alone reduced for the external lineage—the sage\'s heart truly has its reason.',
    idiomatic: 'Aunts, uncles, and paternal uncles share parental favor, yet external kin alone are reduced—the sage had reason.',
  },
  s0362: {
    literal: 'The Mourning Dress Commentary says: "Beasts know the mother and do not know the father."',
    idiomatic: 'The Mourning Dress Commentary: "Beasts know mother, not father."',
  },
  s0363: {
    literal: '" The wild man says: what calculation for father and mother?',
    idiomatic: 'Wild men ask: what reckoning for father and mother?',
  },
  s0364: {
    literal: 'The man of the capital district then knows to honor the father.',
    idiomatic: 'Townsmen then know to honor the father.',
  },
  s0365: {
    literal: 'The great officer and scholar then know to honor the grandfather.',
    idiomatic: 'Great officers and scholars know to honor the grandfather.',
  },
  s0366: {
    literal: 'The feudal lord and his great ancestor; the Son of Heaven and his founding ancestor.',
    idiomatic: 'Lords honor their great ancestor; the Son of Heaven his founding ancestor.',
  },
  s0367: {
    literal: 'The sage exhausts Heaven\'s way and is thick toward grandfather and father, ties surname clans and is intimate with sons and grandsons; near then distinguishes worthy and unworthy, far then differs from birds and beasts.',
    idiomatic: 'The sage exhausts Heaven\'s way, thickens toward ancestors, ties clans and cherishes descendants; near he sorts worthy and unworthy, far he parts from beasts.',
  },
  s0368: {
    literal: 'From this to speak, the mother\'s kin compared with the root clan cannot be threaded on one string—clear.',
    idiomatic: 'Thus the mother\'s kin cannot be strung with the root clan on one thread—clearly so.',
  },
  s0369: {
    literal: 'Moreover the family has no two elders; mourning has no two zhan—what men serve cannot be twofold.',
    idiomatic: 'A household has no two elders; mourning has no two zhan—what one serves cannot be doubled.',
  },
  s0370: {
    literal: 'Where especially heavy on the great lineage, reduce the lesser lineage;',
    idiomatic: 'Where the great lineage is especially heavy, the lesser is reduced;',
  },
  s0371: {
    literal: 'one who becomes a successor reduces mourning for his parents;',
    idiomatic: 'an heir reduces mourning for parents;',
  },
  s0372: {
    literal: 'a woman marrying out reduces mourning for her root family.',
    idiomatic: 'a woman marrying out reduces mourning for her birth family.',
  },
  s0373: {
    literal: 'Fundamentally what is preserved is distant; what is suppressed is private.',
    idiomatic: 'What is kept is the distant public good; what is cut is private feeling.',
  },
  s0374: {
    literal: 'Now if maternal grandfather and uncle add another grade of mourning, hall uncle and aunt are listed within the mourning canon—then how far apart are Chinese and foreign regulations?',
    idiomatic: 'If maternal grandfather and uncle gain another grade and hall cousins enter the canon, how far apart would agnate and affine rules be?',
  },
  s0375: {
    literal: 'Abandoning ritual and following feeling—what is pursued is the branch.',
    idiomatic: 'To abandon ritual for feeling is to chase the branch.',
  },
  s0376: {
    literal: 'The ancient fashioners knew human feeling is easy to shake, feared ritual\'s gradual loss, separated same and different, weight and light hanging apart, wishing later men never to mix.',
    idiomatic: 'Ancient makers knew feeling shifts easily, feared ritual would slip, separated kin types and grades so later ages would not mix them.',
  },
  s0377: {
    literal: 'The subtle intent lies here—how could it be in vain!',
    idiomatic: 'The subtle intent is here—not in vain!',
  },
  s0378: {
    literal: 'Moreover the five garments have the meaning of upward reduction; one must follow source and root, then reach the branches.',
    idiomatic: 'The five garments also upward-reduce: one must follow the root before the branches.',
  },
  s0379: {
    literal: 'Paternal uncle and aunt in root garment great merit nine months; father\'s brother\'s sons also great merit nine months—all above derive from grandfather; their mourning cannot exceed grandfather.',
    idiomatic: 'Uncles and aunts wear great merit nine months; father\'s brothers\' sons too—both derive from grandfather and cannot exceed him.',
  },
  s0380: {
    literal: 'Second grandfather and grandmother, second grandmother, second grandfather\'s brothers—all lesser merit five months;',
    idiomatic: 'Second grandparents and their brothers: lesser merit five months;',
  },
  s0381: {
    literal: 'because they derive from great-grandfather; mourning cannot exceed great-grandfather.',
    idiomatic: 'derived from great-grandfather—mourning cannot exceed him.',
  },
  s0382: {
    literal: 'Third grandfather and grandmother, third grandmother, third grandfather\'s brothers—all finest hemp three months, because they derive from great-great-grandfather; mourning cannot exceed great-great-grandfather.',
    idiomatic: 'Third grandparents and their brothers: finest hemp three months from great-great-grandfather—mourning cannot exceed him.',
  },
  s0383: {
    literal: 'Hall aunt and uncle already derive from external great-grandfather; if one wears fixed mourning for them, then external great-grandparents and external paternal great-uncles and great-aunts should also wear fixed mourning.',
    idiomatic: 'Hall cousins derive from external great-grandfather; if they wear fixed mourning, so must external great-grandparents and great-uncles.',
  },
  s0384: {
    literal: 'Maternal grandfather increased to great merit nine months—then external great-grandfather should reach lesser merit, external great-great-grandfather finest hemp.',
    idiomatic: 'Raise maternal grandfather to great merit, and external great-grandfather becomes lesser merit, external great-great-grandfather finest hemp.',
  },
  s0385: {
    literal: 'If one cites this and abandons that, the affair is uneven;',
    idiomatic: 'Cite one case and drop another and the matter is uneven;',
  },
  s0386: {
    literal: 'abandon intimate and record distant—the principle is not compliant.',
    idiomatic: 'abandon the intimate for the distant and principle fails.',
  },
  s0387: {
    literal: 'Extend and broaden it—this is no different from the root clan.',
    idiomatic: 'Push it further and it equals the root clan.',
  },
  s0388: {
    literal: 'If all mourning has return, then hall sister\'s son, external great-grandson, and brother\'s daughter\'s son—all must wear fixed mourning.',
    idiomatic: 'If all mourning reciprocates, hall nephews, external great-grandsons, and a niece\'s son must all wear mourning.',
  },
  s0389: {
    literal: 'Would the sage be thin toward his flesh and bone, turn his back on his love and affection?',
    idiomatic: 'Would the sage slight his flesh and turn from love?',
  },
  s0390: {
    literal: 'Where feeling is intimate, mourning is light—fundamentally what roots in the public is thin toward the private; preserve the great and omit the small—righteousness has what it cuts off; one cannot but be so.',
    idiomatic: 'Where feeling is intimate, dress is light—public roots thin the private; keep the large, omit the small—righteousness must cut.',
  },
  s0391: {
    literal: 'If it can be added, it can also be reduced; if former sages can be negated, then the ritual classic can be destroyed.',
    idiomatic: 'What can be added can be reduced; if former sages may be denied, the ritual classic may be ruined.',
  },
  s0392: {
    literal: 'The former king\'s regulation is called constant principle; upholding it in turn, one still fears loss—once one confuses its order, how can it be stopped?',
    idiomatic: 'The former kings\' rule is constant principle; even in upholding it we fear loss—confuse its order and how can it stop?',
  },
  s0393: {
    literal: 'Moreover old statutes have sunk and been lost—the days are already long.',
    idiomatic: 'Old statutes have long been sinking.',
  },
  s0394: {
    literal: 'What remains is not much; to again wish to abandon it—though called not penetrating, I do not know that it is permissible.',
    idiomatic: 'Little remains; to abandon more—though called ignorance, I do not see how it is permissible.',
  },
  s0395: {
    literal: 'We ask to follow the Mourning Dress in the Ceremonies as fixed.',
    idiomatic: 'Follow the Ceremonial Mourning Dress as fixed.',
  },
  s0396: {
    literal: 'Vice Director of the Ministry of Rites Yang Zhongchang deliberated: "Respectfully according to the Ceremonies: \'All external mourning is si.\'"',
    idiomatic: 'Vice Director Yang Zhongchang wrote: "Per the Ceremonies: all external mourning is si hemp."',
  },
  s0397: {
    literal: '" Again it says: "Maternal grandparents by honored rank increased, mother\'s sister by name increased—together lesser merit five months."',
    idiomatic: 'It also says: maternal grandparents raised by honor, mother\'s sister by name—together lesser merit five months.',
  },
  s0398: {
    literal: '" For the uncle finest hemp, Duke of Zheng Wei Zheng already deliberated the same as the mother\'s sister precedent, increased to lesser merit five months—finished."',
    idiomatic: 'For the uncle\'s finest hemp, Duke of Zheng Wei Zheng already matched the mother\'s sister at lesser merit five months.',
  },
  s0399: {
    literal: 'What is now to be added—how does it differ from the former intent?',
    idiomatic: 'What is now proposed—how does it differ from that earlier intent?',
  },
  s0400: {
    literal: 'Though Duke of Literature is worthy, yet Zhou and Confucius are sage—using the worthy to alter the sage, what can later students follow?',
    idiomatic: 'Wei Zheng was worthy, but Zhou and Confucius were sages—if the worthy may change the sage, what can later students follow?',
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
