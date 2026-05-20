#!/usr/bin/env node
/** Batch 3: s0201–s0300 (Jiutangshu ch.031, Rites 7 / mourning) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/031.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 201;
const END = 300;

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
  s0201: {
    literal: 'We ask to raise mourning for loving-kindness to resist the ritual of honored dignity; though the qi and zhan ceremonies are unchanged, the regulations for mats and tables are thereby made the same.',
    idiomatic: 'We ask to elevate affectionate mourning to counter dignified ritual: though qi and zhan forms stay unchanged, the mat-and-table rules would become the same.',
  },
  s0202: {
    literal: 'Within several years it had still not been put into general use.',
    idiomatic: 'For several years it still was not generally adopted.',
  },
  s0203: {
    literal: 'The Heavenly Emperor passed away; Zhongzong suffered dust on the road.',
    idiomatic: 'The emperor died; Zhongzong was driven into exile.',
  },
  s0204: {
    literal: 'At the end of the Chuigong era, the Holy Mother\'s false tally was indeed put into practice;',
    idiomatic: 'At the end of Chuigong, the Empress Dowager\'s false mandate was carried out;',
  },
  s0205: {
    literal: 'In the first year of Zai Chu, the deep breach of changing the dynasty was thereupon opened.',
    idiomatic: 'In the first year of Zai Chu the deep wound of dynastic usurpation was opened.',
  },
  s0206: {
    literal: 'Though Emperor Xiaohe was nominally restored to correctness, the Wei clan again imitated the cock\'s dawn crow.',
    idiomatic: 'Though Xiaohe was nominally restored, the Wei clan again played the cock that crows at dawn.',
  },
  s0207: {
    literal: 'Xiaohe died unexpectedly not by intent; the Wei clan at once assumed regency.',
    idiomatic: 'Xiaohe died suddenly and without design; the Wei clan immediately seized power.',
  },
  s0208: {
    literal: 'Had we not received Your Majesty\'s brilliant calculation, how could the ancestral temple have been recovered?',
    idiomatic: 'Without Your Majesty\'s brilliant resolve, how could the ancestral temple have been restored?',
  },
  s0209: {
    literal: 'The Changes says: "A minister kills his lord, a son kills his father—not the work of a single morning or evening."',
    idiomatic: 'The Changes says: "When a minister kills his lord or a son his father, it is not the work of a single morning or evening."',
  },
  s0210: {
    literal: '" This is what it speaks of.',
    idiomatic: 'That is precisely what it means.',
  },
  s0211: {
    literal: 'Your servant respectfully traces ritual intent: prevention and blocking are truly deep; if we do not early plan to correct the text, how may we hand down a warning to posterity?',
    idiomatic: 'Your servant has traced the ritual logic: the safeguards are profound; unless the text is corrected soon, what warning can posterity receive?',
  },
  s0212: {
    literal: 'Therefore we speak briefly of ritual teaching, ask to follow the old statutes, that the gracious edict be made clear, and be entrusted to the responsible offices for detailed deliberation.',
    idiomatic: 'Hence we speak briefly of ritual teaching and ask to follow the old statutes; may the gracious edict be made clear and the matter sent to the responsible offices for full deliberation.',
  },
  s0213: {
    literal: 'Moreover what your servant presents is fundamentally a request to rectify the bond of husband and wife—how could we forget the way of mother and son?',
    idiomatic: 'What your servant offers chiefly seeks to rectify the bond of husband and wife; we do not forget the way of mother and son.',
  },
  s0214: {
    literal: 'Most deliberators do not examine the root source; what they oppose is, in the main, only the argument of boundless favor;',
    idiomatic: 'Most debaters do not reach the root; their objections chiefly invoke boundless parental favor alone;',
  },
  s0215: {
    literal: '"In mourning, better ke than wei";',
    idiomatic: '"In mourning, better distress than ease";',
  },
  s0216: {
    literal: '"Beasts know the mother and do not know the father";',
    idiomatic: '"Beasts know their mother but not their father";',
  },
  s0217: {
    literal: '"After Qin burned the books the ritual classics were incomplete; later Confucians compiled and gathered them—insufficient to be relied on";',
    idiomatic: '"After Qin burned the books the ritual classics were broken; later Confucians pieced them together and they cannot be fully trusted";',
  },
  s0218: {
    literal: '"How can it be the same as mourning for an uncle\'s wife, how can it equal the regulation for paternal aunts and sisters";',
    idiomatic: '"How can it match an uncle\'s wife\'s mourning, or equal the rule for paternal aunts and sisters";',
  },
  s0219: {
    literal: '"The three kings do not inherit one another\'s ritual; the five emperors do not continue one another\'s music";',
    idiomatic: '"The three kings do not pass down one another\'s ritual; the five emperors do not continue one another\'s music";',
  },
  s0220: {
    literal: '"Qi and zhan suffice for rise and fall—how can the years bear to differ: these are all words heard on the road and passed along, men who have not studied the former kings\' intent—how are they fit to deliberate ritual for ordering the state and governing custom?"',
    idiomatic: '"Qi and zhan are enough for gradation—how can the years be made different? These are roadside rumors from men untrained in the former kings; how can they debate statecraft and custom?"',
  },
  s0221: {
    literal: 'Your servant asks to clarify by the classics\' meaning.',
    idiomatic: 'Your servant will clarify this by the classics.',
  },
  s0222: {
    literal: 'What is called "boundless favor" is spring and autumn sacrifice—thinking of them at the proper seasons.',
    idiomatic: '"Boundless favor" means seasonal sacrifice in spring and autumn—remembering parents at the proper times.',
  },
  s0223: {
    literal: 'The gentleman has lifelong sorrow; feeling at frost and dew—is it only one or two cycles of mourning dress?',
    idiomatic: 'A gentleman mourns for life; frost and dew move him—this is not exhausted in one or two cycles of dress alone.',
  },
  s0224: {
    literal: 'Therefore the sage feared that one might die in the morning and forget by evening, not even equal to birds and beasts, and established a middle regulation so worthy and unworthy alike might together complete pattern and principle.',
    idiomatic: 'The sage feared morning death and evening forgetting—worse than beasts—and set a middle rule so all alike could keep pattern and principle.',
  },
  s0225: {
    literal: 'What is called "in mourning, better ke than wei" is Confucius\' answer to Lin Fang\'s question.',
    idiomatic: '"In mourning, better ke than wei" is Confucius answering Lin Fang.',
  },
  s0226: {
    literal: 'As for too lavish or too frugal, too easy or too ke—none is within ritual\'s mean.',
    idiomatic: 'Too lavish or too frugal, too easy or too ke—none hits ritual\'s mean.',
  },
  s0227: {
    literal: 'If one cannot hit the mean, both are called lost; better too frugal and too ke.',
    idiomatic: 'Missing the mean, both fail; still better too frugal and too ke.',
  },
  s0228: {
    literal: 'Destroying the person and extinguishing nature is still better than dying in the morning and forgetting by evening.',
    idiomatic: 'Ruining oneself in grief is still better than forgetting by evening what died in the morning.',
  },
  s0229: {
    literal: 'This discusses the countenance of mourning grief at the coffin—how can it be compared with mourning dress for kin of the same clan and different surnames?',
    idiomatic: 'That concerns grief at the bier—not mourning grades for agnates and affines.',
  },
  s0230: {
    literal: 'What is called "beasts know the mother and do not know the father": beasts herd together in nests and have no ritual of family and state; young though they know to love the mother, grown they do not understand to honor the father.',
    idiomatic: '"Beasts know mother not father": they nest in herds without family or state ritual; young love the mother, but grown they do not honor the father.',
  },
  s0231: {
    literal: 'To cite this as a parallel—is one then not even the equal of beasts!',
    idiomatic: 'To argue from that is to fall below beasts!',
  },
  s0232: {
    literal: 'What is called "after Qin burned the books the ritual classics were incomplete; later Confucians compiled—insufficient to rely on": among men there may be omissions and losses—did every household reach and burn them? If all were burned and nothing can be trusted, then the Yellow Mound and the schools would all be wrong, the halls of learning would stand in vain—of what would non-sage talk again belong?',
    idiomatic: '"After Qin burned the books the classics were broken and later Confucians pieced them together": some texts were lost, but not every house was burned. If none may be trusted, then the Yellow Mound and the schools are all wrong and non-sage talk has no place left.',
  },
  s0233: {
    literal: 'What is called "the same mourning as for paternal uncles and aunts and sisters": do paternal uncles and aunts and sisters have the mat-and-staff regulation and three years\' heart mourning?',
    idiomatic: '"Same as uncles and aunts and sisters": do they wear mat and staff with three years\' heart mourning?',
  },
  s0234: {
    literal: 'What is called "the five emperors do not continue music, do not inherit ritual"—truly those words!',
    idiomatic: '"The five emperors do not continue music or inherit ritual"—how true!',
  },
  s0235: {
    literal: 'This is the feeling of Zetian harboring private intent and wrapping calamity—how can one again continue music and inherit ritual?',
    idiomatic: 'That was Zetian\'s private scheming—how can music and ritual be continued on that basis?',
  },
  s0236: {
    literal: 'What is called "qi and zhan suffice for rise and fall": mother in qi, father in zhan—unchanging ritual.',
    idiomatic: '"Qi and zhan suffice for gradation": mother in qi, father in zhan—unchanging ritual.',
  },
  s0237: {
    literal: 'According to the Three Years Question: "Is it with the gentleman who cultivates ornament? Three years\' mourning is like a team of horses passing a crack; to follow it is endless."',
    idiomatic: 'The Three Years Question asks: "For the ornamented gentleman, three years\' mourning is like horses through a crack; to follow it endlessly is impossible."',
  },
  s0238: {
    literal: 'Then why fix it at a cycle?',
    idiomatic: 'Why then fix it at one cycle?',
  },
  s0239: {
    literal: 'It says: The closest kin are cut off at a cycle.',
    idiomatic: 'Answer: the closest kin are cut off at one cycle.',
  },
  s0240: {
    literal: 'Why is this?',
    idiomatic: 'Why so?',
  },
  s0241: {
    literal: 'It says: Heaven and earth have already changed; the four seasons have already shifted; what is between Heaven and earth—none does not begin anew; thereby it is imaged.',
    idiomatic: 'Heaven and earth have changed, the four seasons shifted; all between them begin anew—this is the image.',
  },
  s0242: {
    literal: 'Then why three years?',
    idiomatic: 'Why then three years?',
  },
  s0243: {
    literal: 'It says: Only to add weight.',
    idiomatic: 'Answer: only to add weight.',
  },
  s0244: {
    literal: '" Therefore for the father it is increased to two cycles; when the father is alive, for the mother it adds three years\' heart mourning.',
    idiomatic: 'Hence the father reaches two cycles; while the father lives, for the mother three years\' heart mourning are added.',
  },
  s0245: {
    literal: 'Now to return to the same regulation as when the father has died—where is the law of honored reduction applied?',
    idiomatic: 'Now to match the rule when the father is dead—where does honored reduction apply?',
  },
  s0246: {
    literal: 'The Mourning Dress Four Principles also says: "The great body of all ritual embodies Heaven and earth, takes law from the four seasons, patternizes yin and yang, follows human feeling—therefore it is called ritual."',
    idiomatic: 'The Mourning Dress Four Principles: "Ritual\'s great body embodies Heaven and earth, follows the four seasons, patterns yin and yang, and accords with human feeling."',
  },
  s0247: {
    literal: '" Those who criticize it do not know where ritual comes from.',
    idiomatic: 'Critics do not know where ritual comes from.',
  },
  s0248: {
    literal: 'They not only fail to know where ritual is fashioned; they also probably have not grasped the filial son\'s comprehensive meaning.',
    idiomatic: 'They not only miss how ritual is made; they likely miss the filial son\'s full meaning.',
  },
  s0249: {
    literal: 'Your servant respectfully cites the Classic of Filial Piety to show that Your Majesty\'s filial governance accords with utmost virtue and the essential way, and asks to discuss those in the age who wish to criticize ritual.',
    idiomatic: 'Your servant cites the Classic of Filial Piety to show Your Majesty\'s filial rule fits utmost virtue and the essential way, and answers those who would criticize ritual.',
  },
  s0250: {
    literal: 'Utmost virtue is called filial piety and brotherliness; the essential way is called ritual and music.',
    idiomatic: 'Utmost virtue is filial piety and brotherliness; the essential way is ritual and music.',
  },
  s0251: {
    literal: '"To shift custom and change the vulgar, nothing is better than music; to settle those above and govern the people, nothing is better than ritual."',
    idiomatic: '"Nothing shifts custom like music; nothing settles superiors and governs people like ritual."',
  },
  s0252: {
    literal: '" Again the Ritual has "ritual without bodily form, music without sound."',
    idiomatic: 'The Ritual also speaks of "formless ritual" and "soundless music."',
  },
  s0253: {
    literal: '" According to the Filial Piety Apocryphal God\'s Covenant: "The Son of Heaven\'s filial piety is called jiu; jiu means completion."',
    idiomatic: 'The Filial Piety Apocryphal God\'s Covenant: "The Son of Heaven\'s filial piety is called jiu—completion."',
  },
  s0254: {
    literal: 'When the Son of Heaven\'s virtue covers all under Heaven and his grace reaches the ten thousand things, beginning and end are accomplished, then his parents obtain peace—therefore it is called jiu.',
    idiomatic: 'When his virtue covers the realm and grace reaches all things, beginning and end complete, his parents are secure—hence jiu.',
  },
  s0255: {
    literal: 'The feudal lord\'s filial piety is called du; du means law.',
    idiomatic: 'A feudal lord\'s filial piety is called du—law.',
  },
  s0256: {
    literal: 'When the feudal lord dwells in his state and can uphold the Son of Heaven\'s laws and measures, not reaching danger and excess, then his parents obtain peace—therefore du.',
    idiomatic: 'Dwelling in his state, if he upholds the Son of Heaven\'s laws without danger or excess, his parents are secure—hence du.',
  },
  s0257: {
    literal: 'The grandee and great officer\'s filial piety is called yu; yu means name.',
    idiomatic: 'A grandee\'s filial piety is called yu—reputation.',
  },
  s0258: {
    literal: 'When the grandee\'s words and conduct spread everywhere and he can be without evil reputation, fame reaching far and near, then his parents obtain peace—therefore yu.',
    idiomatic: 'If his words and conduct spread without evil fame, near and far, his parents are secure—hence yu.',
  },
  s0259: {
    literal: 'The shi\'s filial piety is called jiu; jiu means clarity and scrutiny in meaning.',
    idiomatic: 'A shi\'s filial piety is called jiu—scrutiny.',
  },
  s0260: {
    literal: 'When the shi first ascends court, leaves parents and enters service, and can scrutinize the ritual of supporting the father and serving the lord, then his parents obtain peace—therefore jiu.',
    idiomatic: 'On first entering court he scrutinizes how to support father and serve lord—then his parents are secure; hence jiu.',
  },
  s0261: {
    literal: 'The commoner\'s filial piety is called xu; xu means containing and storing in meaning.',
    idiomatic: 'A commoner\'s filial piety is called xu—containment.',
  },
  s0262: {
    literal: 'The commoner contains feeling and receives simplicity, personally plows and labors with strength, thereby storing his virtue—then his parents obtain peace—therefore xu.',
    idiomatic: 'He contains feeling, accepts simplicity, plows and labors, stores virtue—then his parents are secure; hence xu.',
  },
  s0263: {
    literal: '" Your Majesty, because the Wei clan plotted rebellion and Zhongzong suffered calamity, the imperial heart was sorrowful and indignant, sagely feeling outstanding and fierce.',
    idiomatic: 'Your Majesty, when the Wei clan rebelled and Zhongzong suffered calamity, bore sorrow and indignation in the imperial breast with outstanding sagely resolve.',
  },
  s0264: {
    literal: 'At first without a single company of men, you thereupon extinguished the demons of the ninefold palace, settled the altars of soil and grain on the brink of peril, and rescued the lineage branches from charcoal.',
    idiomatic: 'With scarcely a company at first, you destroyed the palace demons, steadied the altars in peril, and rescued the lineage from ruin.',
  },
  s0265: {
    literal: 'This is Your Majesty\'s utmost filial piety and brotherliness, penetrating to the spirits, shining over the four seas—nothing is not penetrated.',
    idiomatic: 'This is Your Majesty\'s utmost filial piety and brotherliness, penetrating the spirits and shining over the four seas.',
  },
  s0266: {
    literal: 'You cause feudal lords to keep their laws and measures, grandees to exhaust their words and conduct, shi to support kin in serving the lord, commoners to use Heaven and divide the land.',
    idiomatic: 'You let lords keep their laws, grandees fulfill their conduct, shi support kin in serving the throne, and commoners work Heaven\'s land.',
  },
  s0267: {
    literal: 'This is Your Majesty\'s formless ritual—to settle those above and govern people.',
    idiomatic: 'This is Your Majesty\'s formless ritual—settling superiors and governing the people.',
  },
  s0268: {
    literal: 'From the Shangyuan era onward, government lay with the Wu clan; after Wenming, law lay with vicious men.',
    idiomatic: 'From Shangyuan onward the Wu clan held power; after Wenming, law served vicious men.',
  },
  s0269: {
    literal: 'They harmed and killed the lineage kin, executed and extinguished the good, ranks of merit piled year by year, amnesty feasts came year by year.',
    idiomatic: 'They harmed kin, killed the good, heaped merit ranks yearly, and granted amnesties yearly.',
  },
  s0270: {
    literal: 'If one flattered them, glory; if one was upright, demotion and exile.',
    idiomatic: 'Flatterers flourished; the upright were exiled.',
  },
  s0271: {
    literal: 'At the Shenlong and Jingyun junctures, such matters were especially numerous;',
    idiomatic: 'Under Shenlong and Jingyun such abuses were especially many;',
  },
  s0272: {
    literal: 'between the Xiantian and Kaiyuan periods, these abuses were all reformed.',
    idiomatic: 'from Xiantian through Kaiyuan those abuses were all reformed.',
  },
  s0273: {
    literal: 'This is Your Majesty\'s soundless music—to shift custom and change the vulgar.',
    idiomatic: 'This is Your Majesty\'s soundless music—shifting custom and changing the vulgar.',
  },
  s0274: {
    literal: 'Your servant\'s earlier memorial was brief; deliberators did not recognize your servant\'s earnest sincerity.',
    idiomatic: 'My earlier memorial was brief; debaters did not see my earnest sincerity.',
  },
  s0275: {
    literal: 'Respectfully we present the full memorial again and ask that it be sent to the Secretariat and Chancellery for deliberation and disposition.',
    idiomatic: 'I respectfully submit the full memorial again and ask the Secretariat and Chancellery to deliberate and decide.',
  },
  s0276: {
    literal: 'If your servant\'s words are loyal, I still dare set foot on the palace steps;',
    idiomatic: 'If my words are loyal, I still dare stand on the palace steps;',
  },
  s0277: {
    literal: 'if your servant\'s words are disloyal, I prostrate myself and ask to be banished to the wild border.',
    idiomatic: 'if they are disloyal, I ask to be banished to the frontier.',
  },
  s0278: {
    literal: 'Left Regular Attendant of the Cavalry Yuan Xingchong submitted a deliberation, saying: "Of Heaven and Earth\'s nature, only the human is most spiritual—because wisdom encompasses the ten thousand things, only the perspicacious become sage, discerning noble and base, distinguishing honored and humble, keeping distant what is suspect, dividing feeling and principle."',
    idiomatic: 'Left Cavalry Regular Attendant Yuan Xingchong argued: among Heaven and Earth\'s creatures only humans are most spirit-filled—wisdom spans the ten thousand things, the perspicacious become sages, they sort noble and base, honored and humble, keep distance from suspicion, and divide feeling from principle.',
  },
  s0279: {
    literal: 'Therefore the ancient sages examined nature to know the root, followed feeling to set garments—there is extension and there is reduction.',
    idiomatic: 'Ancient sages read nature for the root and followed feeling to set garments—sometimes extending, sometimes reducing.',
  },
  s0280: {
    literal: 'Heaven as father, Heaven as husband—therefore full sackcloth three years; where feeling and principle are both exhausted, the heart establishes the utmost.',
    idiomatic: 'Heaven is father, Heaven is husband—hence three years\' full sackcloth where feeling and principle are both spent, the heart sets the utmost limit.',
  },
  s0281: {
    literal: 'In life they share one body; in death one grave—matching yin and yang in union, forming transformation with the two principles.',
    idiomatic: 'Alive they share one body; dead one grave—yin and yang paired, the two principles made whole.',
  },
  s0282: {
    literal: 'Yet for a wife\'s mourning, staff for one year—where feeling and ritual are both reduced—is because one keeps distant what is suspect and honors the yang way.',
    idiomatic: 'Yet a wife\'s death brings staff for one year—feeling and ritual both cut—to keep distance from suspicion and honor the yang way.',
  },
  s0283: {
    literal: 'A father for the legitimate son wears three years\' full sackcloth yet does not leave office—because one honors the grandfather and values the legitimate line, exalting ritual and reducing feeling.',
    idiomatic: 'A father for a legitimate son wears three years\' sackcloth yet keeps office—honoring the grandfather and the main line, exalting ritual over feeling.',
  },
  s0284: {
    literal: 'Taking from serving the father to serve the lord—filial piety is not greater than honoring the father.',
    idiomatic: 'Serving the lord by the measure of serving the father—filial piety is greatest in honoring the father.',
  },
  s0285: {
    literal: 'Therefore when the father is alive, for the mother one leaves office for qi for one cycle and heart mourning three years—called honored reduction: then feeling is extended but ritual reduced.',
    idiomatic: 'Hence while the father lives, for the mother one leaves office for one qi cycle with three years\' heart mourning—honored reduction: feeling extended, ritual reduced.',
  },
  s0286: {
    literal: 'This regulation can distinguish from birds and beasts and set apart from Chinese and barbarian.',
    idiomatic: 'This rule separates humans from beasts and Chinese from barbarians.',
  },
  s0287: {
    literal: 'Xi, Nong, Yao, and Shun—none changed it;',
    idiomatic: 'Xi, Nong, Yao, and Shun changed none of it;',
  },
  s0288: {
    literal: 'Wen, Wu, Zhou, and Confucius alike honored it.',
    idiomatic: 'Wen, Wu, the Zhou, and Confucius honored the same thing.',
  },
  s0289: {
    literal: 'Now if we abandon the weight of honored reduction, injure the meaning of honoring the father, slight the suspicion of plain simplicity, and leave a charge of being non-sage—then affairs do not take the ancients as teachers and famous teaching is harmed.',
    idiomatic: 'To abandon honored reduction, injure honoring the father, slight plain simplicity, and invite a charge of opposing the sages is to reject the ancients and harm teaching.',
  },
  s0290: {
    literal: 'Aunt shares the name of mother\'s sister—she is the mother\'s female kin; to add to the uncle\'s mourning has reason in it.',
    idiomatic: 'An aunt shares the mother\'s sister\'s title—mother\'s female kin; increasing the uncle\'s mourning has its reason.',
  },
  s0291: {
    literal: 'Sister-in-law and brother-in-law do not wear mourning—avoiding suspicion.',
    idiomatic: 'Sister-in-law and brother-in-law wear no mourning—to avoid suspicion.',
  },
  s0292: {
    literal: 'If one cites the si hemp of sharing the hearth to forget the trace of pushing distant, it both departs from former sages and is also said hard to follow.',
    idiomatic: 'To cite shared-hearth si hemp and forget the rule of pushing the distant both departs from the sages and is hard to follow.',
  },
  s0293: {
    literal: 'Respectfully examining the three doubts, we together ask to follow antiquity as correct.',
    idiomatic: 'On all three doubts, we ask that antiquity be followed.',
  },
  s0294: {
    literal: '" From this the hundred officials\' deliberations did not decide.',
    idiomatic: 'Thereafter the hundred officials could not settle the debate.',
  },
  s0295: {
    literal: 'In the eighth month of the seventh year, an edict was issued: "Only the Duke of Zhou fashioned ritual—it should endure through generations without revision;',
    idiomatic: 'In the eighth month of year seven an edict said: "Only the Duke of Zhou made ritual, fit to endure through the ages;',
  },
  s0296: {
    literal: 'how much more when Zixia wrote the Commentary—it was what the Confucian gate received."',
    idiomatic: 'how much more Zixia\'s Commentary, received from Confucius\'s school."',
  },
  s0297: {
    literal: 'Within the statute articles is "while the father lives, for the mother qi sackcloth three years"—this was purposeful action, not the meaning of honored reduction.',
    idiomatic: 'The statutes include "while the father lives, qi sackcloth three years for the mother"—a purposeful rule, not honored reduction.',
  },
  s0298: {
    literal: 'Rather than revise, better to take the ancients as teachers—all mourning regulations should uniformly follow the Mourning Dress text.',
    idiomatic: 'Rather than revise, follow the ancients: all mourning grades should follow the Mourning Dress text.',
  },
  s0299: {
    literal: '" From this in the homes of ministers and grandees, mourning while the father lived for the mother differed: some, having completed the cycle, performed the capping rite, released the dress after sixty days of capping dress, with three years\' heart mourning;',
    idiomatic: 'Thereafter in noble households practice diverged: some finished the cycle, capped, released dress after sixty days, yet kept three years\' heart mourning;',
  },
  s0300: {
    literal: 'some had completed the cycle and the capping dress ran the full three years.',
    idiomatic: 'others kept capping dress the full three years.',
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
