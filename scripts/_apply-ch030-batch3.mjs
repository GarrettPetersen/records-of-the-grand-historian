#!/usr/bin/env node
/** Batch 3: s0201–s0300 (Jiutangshu ch.030, Rites 6) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/030.json';
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
    literal: 'Although ritual arises from feeling, its aim is to clarify essentials; the true point is moderation—going beyond ritual in search of excess in fact diminishes sincerity and reverence.',
    idiomatic: 'Ritual follows feeling but aims at essentials; moderation is the point—excess ritual undermines sincerity.',
  },
  s0202: {
    literal: 'I note that at the Shenlong era Heaven\'s mandate had returned; the Wu clan temples were moved to Chang\'an and that site was made the Grand Temple—until the early Tianbao restoration it was not treated as establishing a capital.',
    idiomatic: 'At Shenlong Heaven\'s mandate returned: Wu temples moved to Chang\'an, the site became the Grand Temple; until early Tianbao it was not a capital foundation.',
  },
  s0203: {
    literal: 'Yet the proposal states: "Zhongzong established a temple at the Eastern Capital without violating old precedent."',
    idiomatic: 'Yet proponents say: "Zhongzong\'s Eastern Capital temple did not violate precedent."',
  },
  s0204: {
    literal: '" Examining its intent—is it not absurd?',
    idiomatic: 'Read in context—is that not absurd?',
  },
  s0205: {
    literal: 'It also says, "The Eastern Capital Grand Temple, down through Ruizong and Xuanzong, was still maintained and not changed."',
    idiomatic: 'They also say the Eastern Capital Grand Temple was maintained through Ruizong and Xuanzong unchanged.',
  },
  s0206: {
    literal: 'That was because they had once been reverently maintained and dared not rashly abolish them.',
    idiomatic: 'That was because it had once been reverently kept and they dared not abolish it rashly.',
  },
  s0207: {
    literal: 'Now they have been abandoned for a long time, yet one still follows the canon of what must not be raised.',
    idiomatic: 'It has long been abandoned, yet they still invoke the canon of what must not be raised.',
  },
  s0208: {
    literal: 'It also says, "Although at the beginning of Zhenguan, amid founding, there was no leisure—how can one say this was not Kaiyuan law?"',
    idiomatic: 'They also say: "Though Zhenguan\'s founding left no leisure, how can this not be Kaiyuan law?"',
  },
  s0209: {
    literal: 'I respectfully cite the edict fixing the Kaiyuan Six Institutions: "In leisure from hearing government, collating ancient and modern, taking the Zhou Offices as model, making the Tang Code."',
    idiomatic: 'I cite the edict fixing the Kaiyuan Six Institutions: "In leisure from government, collating past and present, modeling the Zhou Offices, making the Tang Code."',
  },
  s0210: {
    literal: 'Surveying its beginning and end—a thousand years in one morning.',
    idiomatic: 'Surveying beginning and end—a thousand years in one morning.',
  },
  s0211: {
    literal: 'The Spring and Autumn calls this the method of examining antiquity.',
    idiomatic: 'Spring and Autumn calls this the method of examining antiquity.',
  },
  s0212: {
    literal: 'That it may be practiced for long—is this not so?"',
    idiomatic: 'That it may endure long—is this not so?"',
  },
  s0213: {
    literal: '" At that time the Eastern Capital Grand Temple still existed; the Six Institutions describes the palaces of both capitals—the Western Capital fully lists the Grand Temple\'s place, the Eastern Capital is noted but not discussed—clearly a matter of one moment; how can one call it "Kaiyuan law"?',
    idiomatic: 'Then the Eastern Capital Grand Temple still stood; the Six Institutions lists both capitals\' palaces—the west fully records the Grand Temple, the east is noted but passed over—clearly a one-time measure; how is it "Kaiyuan law"?',
  },
  s0214: {
    literal: 'Again, of the Three Dynasties\' ritual and music, none flourished like Zhou.',
    idiomatic: 'Of Three Dynasties ritual and music, none matched Zhou.',
  },
  s0215: {
    literal: 'In yesterday\'s deliberation, convenience large and small took Zhou as model—temples were established on removal.',
    idiomatic: 'Yesterday\'s debate took Zhou as model in large and small matters—temples on removal.',
  },
  s0216: {
    literal: 'Now to establish a temple without removal—what is admirable in Zhou that cannot be followed?',
    idiomatic: 'To build a temple without removal—what in Zhou is admirable yet cannot be followed?',
  },
  s0217: {
    literal: 'It also says, "Establishing the state\'s spirit-altars: to the right the altars of soil and grain, to the left the ancestral temple; when the gentleman is about to build palaces, the temple comes first."',
    idiomatic: 'They also cite: "State spirit-altars: soil and grain to the right, temple to the left; when building palaces, the temple comes first."',
  },
  s0218: {
    literal: 'I respectfully cite the Six Institutions: in the Yongchang era Empress Wu made the Eastern Capital the Divine Capital.',
    idiomatic: 'The Six Institutions: in Yongchang Wu made the Eastern Capital the Divine Capital.',
  },
  s0219: {
    literal: 'Afterward construction was gradually added; chambers and the hundred offices were thereby complete.',
    idiomatic: 'Construction was gradually added; chambers and the hundred offices were completed.',
  },
  s0220: {
    literal: 'Today\'s palaces and hundred offices were prepared when the Wu clan changed the mandate.',
    idiomatic: 'Today\'s palaces and offices were prepared under the Wu clan\'s change of mandate.',
  },
  s0221: {
    literal: 'The superior capital already established the state and ancestral temple—this citation is not fitting.',
    idiomatic: 'The superior capital already had state and ancestral temple—this quote does not apply.',
  },
  s0222: {
    literal: 'It also says: "At Luoyang in the Eastern Capital they sacrifice to the five emperors including Xiaoxuan; at Chang\'an they sacrifice to the three emperors including Xiaocheng."',
    idiomatic: 'They also say: "Luoyang sacrifices to five emperors including Xiaoxuan; Chang\'an to three including Xiaocheng."',
  },
  s0223: {
    literal: 'To take this as a precedent for establishing a temple is greatly wrong.',
    idiomatic: 'As a precedent for establishing a temple, that is gravely wrong.',
  },
  s0224: {
    literal: 'In Han, when both places had temples, the emperors sacrificed to were each different.',
    idiomatic: 'In Han both places had temples but sacrificed to different emperors.',
  },
  s0225: {
    literal: 'Now to build a temple and make tablets in the Eastern Capital identical in every respect to the superior capital—speaking broadly, the error is extreme.',
    idiomatic: 'To build an Eastern Capital temple with tablets identical to the superior capital is, broadly, a grave error.',
  },
  s0226: {
    literal: 'It also says, "If the Eastern Luo restores the Grand Temple and the offices sacrifice on the same day, taking this as precedent—truly incomprehensible."',
    idiomatic: 'They also object that if Luoyang restores the Grand Temple and offices sacrifice the same day, the arithmetic is incomprehensible.',
  },
  s0227: {
    literal: 'I respectfully cite the Tianbao third-year edict: "Recently at the four seasons there were affairs at the Grand Temple in both capitals on the same day.',
    idiomatic: 'I cite Tianbao 3: "Recently both capitals sacrificed at the Grand Temple on the same day.',
  },
  s0228: {
    literal: 'From now on, each capital should separately choose its day."',
    idiomatic: 'Henceforth each capital shall choose its own day."',
  },
  s0229: {
    literal: '" Recorded in the sacrificial canon—it can be examined in detail.',
    idiomatic: 'Recorded in the sacrificial canon—clear on inspection.',
  },
  s0230: {
    literal: 'Moreover, establishing temples and making tablets is to sacrifice to the spirits—yet to say "maintain but do not sacrifice"—from what classic does this come?',
    idiomatic: 'Temples and tablets exist to sacrifice—"maintain but do not sacrifice" appears in no classic.',
  },
  s0231: {
    literal: '"When the seven temples or five temples have no empty tablet"—yet wishing to establish empty temples—on what canon is this based?',
    idiomatic: '"Seven or five temples with no empty tablet"—yet they want empty temples—what canon allows this?',
  },
  s0232: {
    literal: 'The earlier statement that the temple appearance was as of old refers to the Jianzhong period, speaking of what existed then as the state\'s priority.',
    idiomatic: 'The claim that temple buildings remain as of old refers to Jianzhong, when they still stood as the state\'s priority.',
  },
  s0233: {
    literal: 'The earlier statement on not making tablets out of season means that where spirit tablets exist, one may not make them out of season.',
    idiomatic: 'The claim against out-of-season tablet-making means existing tablets may not be remade out of season.',
  },
  s0234: {
    literal: 'If in the Jiangzuo period at the Zhide era tablets were all scattered and lost, one cannot be bound by that example.',
    idiomatic: 'When tablets were all lost in the Jiangzuo Zhide era, that example cannot bind us.',
  },
  s0235: {
    literal: 'Some say, "For burying abolished tablets, request the Taiwei Palace."',
    idiomatic: 'Some propose burying abolished tablets in the Taiwei Palace.',
  },
  s0236: {
    literal: 'I respectfully cite the Tianbao second-year edict: "Ancient ritual-making used plain dawn for sacrifice, meaning both drawing on what is remote and because feeling truly follows upon death.',
    idiomatic: 'I cite Tianbao 2: ancient rites used plain dawn, drawing on remoteness because feeling follows death.',
  },
  s0237: {
    literal: 'Our sage ancestor calmly remains present; in the law of the Way, since there is no period of ending, it is fitting to extend the rites of honoring the living.',
    idiomatic: 'Our sage ancestor remains present; in the Way there is no "ended" period—rites of honoring the living should extend.',
  },
  s0238: {
    literal: 'From now on, whenever there is announcement at the sage ancestor\'s palace, the mao hour should be used instead."',
    idiomatic: 'Henceforth announcements at the sage ancestor\'s palace should use the mao hour instead."',
  },
  s0239: {
    literal: 'Now to wish to bury tablets at the palace site is wholly at odds with this edict.',
    idiomatic: 'Burying tablets at the palace site contradicts this edict entirely.',
  },
  s0240: {
    literal: 'Others say: tablets should not be buried—request storing them in side chambers."',
    idiomatic: 'Others say tablets should not be buried but stored in side chambers.',
  },
  s0241: {
    literal: 'I respectfully note that storing tablets in former ages had much variation.',
    idiomatic: 'Former ages varied in storing tablets.',
  },
  s0242: {
    literal: 'As for side chambers, they are properly used to order zhao and mu.',
    idiomatic: 'Side chambers properly order zhao and mu.',
  },
  s0243: {
    literal: 'Now the temple tablets are all not in accord with ritual—then there is no text for di and xia.',
    idiomatic: 'Present tablets are all ritually improper—there is no di/xia text.',
  },
  s0244: {
    literal: 'It also says that when the gentleman is about to build palaces, the ancestral temple comes first—then in founding a state and building palaces the temple must be set up.',
    idiomatic: 'When building palaces the temple comes first—founding a state requires a temple.',
  },
  s0245: {
    literal: 'The Eastern Capital already has palaces—how can the Grand Temple not be built?',
    idiomatic: 'The Eastern Capital has palaces—the Grand Temple must not be left unbuilt.',
  },
  s0246: {
    literal: 'Judging all arguments, this side prevails in principle.',
    idiomatic: 'On the whole, this argument prevails.',
  },
  s0247: {
    literal: 'Yet Western Zhou and Eastern Han are both called two-capital states; that each had its own ancestral temple is clear in classics and histories—one may fully weigh the pros and cons.',
    idiomatic: 'Western Zhou and Eastern Han were both two-capital states; separate ancestral temples are plain in classics and histories—one may weigh the debate fully.',
  },
  s0248: {
    literal: 'The Odes says: "Its cord is straight; shrink the boards to load them—building the temple, majestic."',
    idiomatic: 'The Odes: "Its cord is straight; shrink the boards—building the temple, majestic."',
  },
  s0249: {
    literal: '" The Great Odes\' "Melon Vine" speaks of building the Feng temple.',
    idiomatic: 'The "Melon Vine" ode in the Great Odes describes building the Feng temple.',
  },
  s0250: {
    literal: 'It also says: "Solemn is the clear temple; dignified and manifest the assistants."',
    idiomatic: 'Also: "Solemn is the clear temple; dignified, manifest assistants."',
  },
  s0251: {
    literal: '" When Luoyang was complete, he led the sacrifices to King Wen.',
    idiomatic: 'When Luoyang was complete, he led sacrifices to King Wen.',
  },
  s0252: {
    literal: 'This Ode speaks of Luoyang\'s temple.',
    idiomatic: 'That ode is Luoyang\'s temple.',
  },
  s0253: {
    literal: 'The Documents says: "When King Cheng reached Luo, he performed the year\'s zheng sacrifice—a red bull for King Wen."',
    idiomatic: 'The Documents: "King Cheng reached Luo, performed the year\'s zheng sacrifice—a red bull for King Wen."',
  },
  s0254: {
    literal: '" It also says "libation in the Grand Chamber"; King Kang again dwelt at Feng—"he ordered Duke Bi to protect and govern the eastern suburb."',
    idiomatic: 'Also "libation in the Grand Chamber"; Kang dwelt at Feng—"ordered Duke Bi to protect the eastern suburb."',
  },
  s0255: {
    literal: '" How could there be zheng sacrifice without a temple, or setting protectorship without being the capital?',
    idiomatic: 'How sacrifice without a temple, or a protectorship without a capital?',
  },
  s0256: {
    literal: 'Thus the Documents shows temples east and west.',
    idiomatic: 'Thus the Documents shows east-west temples.',
  },
  s0257: {
    literal: 'Down to Later Han\'s divination for Luo, the Western Capital\'s temples also remained.',
    idiomatic: 'Later Han divined for Luo; Western Capital temples remained.',
  },
  s0258: {
    literal: 'In Jianwu year 2 a temple was built at Luoyang, while Cheng, Ai, and Ping were sacrificed to in the Western Capital.',
    idiomatic: 'Jianwu 2 built a Luoyang temple; Cheng, Ai, and Ping were sacrificed to in the west.',
  },
  s0259: {
    literal: 'In year 18 the emperor personally visited Chang\'an and performed the di rite; at the time five chambers stood in Luoyang, three emperors remained in the capital temple—when the imperial visit coincided with the joint feast, without bringing the fasting carriage, how could this rite be completed?',
    idiomatic: 'Year 18 the emperor visited Chang\'an for di; five chambers stood in Luoyang, three emperors in the capital temple—without the fasting carriage on a joint-feast year, how complete the rite?',
  },
  s0260: {
    literal: 'Thus one knows two temples were Zhou\'s established law; carrying tablets on tour was Han\'s regular practice.',
    idiomatic: 'Two temples were Zhou\'s law; carrying tablets on tour was Han\'s custom.',
  },
  s0261: {
    literal: 'Some take making one capital\'s temple empty as impossible and cite "seven temples must have no empty tablet."',
    idiomatic: 'Some cite "no empty tablet" against emptying one capital\'s temple.',
  },
  s0262: {
    literal: 'The Ritual speaks of one capital\'s temples—chambers must not lack tablets—not that two capitals each with temples cannot be empty.',
    idiomatic: 'The Ritual means one capital\'s chambers must not lack tablets—not that two capitals cannot each have temples.',
  },
  s0263: {
    literal: 'Having linked the language of the campaign, it further clarifies the intent of carrying tablets; speaking according to the matter, principle and fact unite—not as with poets, from whom one may cut a chapter to take meaning.',
    idiomatic: 'The campaign text links to carrying tablets; principle and fact align—not poetry, from which one may not cut a line at will.',
  },
  s0264: {
    literal: 'The ancients sought the spirits in more than one place; the intent of honoring the spirits was one—hence the mulberry tablet was abandoned and the chestnut tablet remade; by reasoning the matter, this clarifies the one principle.',
    idiomatic: 'The ancients sought spirits in more than one place with one intent—hence mulberry tablets were abandoned for chestnut remakes.',
  },
  s0265: {
    literal: 'Some again cite the Zuo Commentary\'s general rule on building Fu, that "where there are ancestral tablets of the former lord it is called du," and set up the argument for establishing tablets.',
    idiomatic: 'Some cite Zuo\'s Fu-building rule: "with former lords\' tablets = du" to argue for new tablets.',
  },
  s0266: {
    literal: 'According to Lu, Duke Zhuang year 28 winter, building Fu—the Zuo Commentary made a general rule for building; Guliang criticized profiting from marsh and lake; Gongyang spoke of avoiding the suspicion of building a town in a famine year.',
    idiomatic: 'Lu, Zhuang 28 winter: Zuo generalizes on building; Guliang criticized marsh profit; Gongyang cited famine-year suspicion.',
  },
  s0267: {
    literal: 'The three commentaries differ; the Zuo is inferior.',
    idiomatic: 'The three commentaries differ; Zuo is weakest.',
  },
  s0268: {
    literal: 'How so?',
    idiomatic: 'Why is that?',
  },
  s0269: {
    literal: 'In the two hundred years of Spring and Autumn, Lu walled twenty-four settlements in all; only Fu was called "built"—did the other twenty-three all have ancestral tablets of former lords?',
    idiomatic: 'In 240 years Lu walled twenty-four places; only Fu is "built"—did the other twenty-three all have ancestral tablets?',
  },
  s0270: {
    literal: 'To take this as the opening for establishing tablets is again not sound general doctrine.',
    idiomatic: 'That cannot ground a general doctrine of establishing tablets.',
  },
  s0271: {
    literal: 'Some also say: "Why bury abolished tablets in the Taiwei Palace storage place;',
    idiomatic: 'Some ask why bury abolished tablets in Taiwei storage;',
  },
  s0272: {
    literal: 'one should abandon the old and follow the new—as already listed above."',
    idiomatic: 'abandon old for new—as already argued."',
  },
  s0273: {
    literal: '" According to the places for burying tablets there are three: under the north window, or between the western steps—matters of the temple.',
    idiomatic: 'Burying places: under the north window or between western steps—temple matters.',
  },
  s0274: {
    literal: 'Tablets that ought not to be established are buried only according to how they are to be buried.',
    idiomatic: 'Improper tablets are buried as appropriate.',
  },
  s0275: {
    literal: 'To bury tablets in a temple that should be established—this is not so.',
    idiomatic: 'Burying in a temple that should stand is wrong.',
  },
  s0276: {
    literal: 'Speaking of the place, the Taiwei Palace storage is no different from Han\'s park-tombs.',
    idiomatic: 'Taiwei storage equals Han park-tombs.',
  },
  s0277: {
    literal: 'From successive ages downward, those who built one capital are many; two capitals are few.',
    idiomatic: 'Most dynasties had one capital; two were rare.',
  },
  s0278: {
    literal: 'Now the state honors both eastern and western residences to the utmost in solemn maintenance—yet doubts each temple; one should use the stories of capital-establishment to verify—Zhou and Han are the cases.',
    idiomatic: 'The state honors both residences with full ritual—yet doubts each temple; Zhou and Han capital stories verify the case.',
  },
  s0279: {
    literal: 'Examining what the present deliberation cites, tracing their dates, they are almost all from times of one capital—how can they be applied to debate? Who would dare toast back and forth among them?',
    idiomatic: 'Present citations are almost all one-capital eras—unfit for this debate; who would toast to them?',
  },
  s0280: {
    literal: 'Examining the classics\' intent in detail: the ancients in planning the sleeping palace always reached to the temple—never was there setting a palace without establishing a temple.',
    idiomatic: 'Classics show: planning a palace always included the temple—never a palace without a temple.',
  },
  s0281: {
    literal: 'The state inherited Sui\'s ruin; amid founding there was no leisure; though later built in the Chuigong era, the matter had its fitness.',
    idiomatic: 'The state inherited Sui\'s ruin; founding left no leisure; Chuigong building fit the moment.',
  },
  s0282: {
    literal: 'Afterward, in the year when weapons were stilled and culture was fully equipped, through eleven sage rulers it was not debated for abolition.',
    idiomatic: 'Later, when arms rested and culture flourished, eleven sage reigns did not debate abolition.',
  },
  s0283: {
    literal: 'Was it not because though the matter arose in one moment, the temple had reason to be established and could not be abolished one by one?',
    idiomatic: 'Though the matter was timely, the temple had reason to stand and could not be abolished piecemeal.',
  },
  s0284: {
    literal: 'Now Luoyang\'s institutions—from palaces and towers down to the hundred offices—differ in nothing from the Western Capital.',
    idiomatic: 'Luoyang\'s institutions—from palaces down to the hundred offices—match the Western Capital.',
  },
  s0285: {
    literal: 'When the imperial carriage arrives, even the lowliest servants must return to their posts of duty.',
    idiomatic: 'When the emperor arrives, even servants return to their posts.',
  },
  s0286: {
    literal: 'How can the former emperors\' tablets alone have no place of rest?',
    idiomatic: 'Can former emperors\' tablets alone lack a resting place?',
  },
  s0287: {
    literal: 'As to timing: the yu tablet is still buried; abolished tablets should be likewise.',
    idiomatic: 'Timing: yu tablets are buried; abolished tablets should be too.',
  },
  s0288: {
    literal: 'Some cite Ma Rong and Li Zhou saying "the sleeping palace is not harmed by joint establishment; the temple is not hindered by temporary emptiness"—then Ma Rong and Li Zhou could be taken as models of Confucius.',
    idiomatic: 'Some cite Ma Rong and Li Zhou: joint palace-building does no harm; temporary temple emptiness is allowed—making them Confucius\'s equals.',
  },
  s0289: {
    literal: 'To use this in deliberation—the deviation is deep.',
    idiomatic: 'Applied to this debate, the error is deep.',
  },
  s0290: {
    literal: 'Some cite "Where a settlement has ancestral tablets of the former lord it is called du; without them it is called yi; yi is built, du is walled."',
    idiomatic: 'Some cite: "With former lords\' tablets = du; without = yi; yi is built, du is walled."',
  },
  s0291: {
    literal: 'I respectfully note that in the 240 years of Spring and Autumn only Fu was called "built."',
    idiomatic: 'In 240 years of Spring and Autumn only Fu is "built."',
  },
  s0292: {
    literal: 'Cases like walling Lang and Fei each had their reasons—defense elsewhere or self-fortification—to say all had ancestral temples is utterly unreasonable.',
    idiomatic: 'Lang, Fei, and similar cases had other reasons—defense or fortification—not universal ancestral temples.',
  },
  s0293: {
    literal: 'Some cite "The sage ruler has the merit of restoring antiquity; the documents have the beauty of textual verification—five emperors had different music, three kings different ritual; encountering the times one makes law, according to affairs one sets measures."',
    idiomatic: 'Some cite sage rulers restoring antiquity and documents verifying texts—five emperors, different music; three kings, different ritual; law for the times.',
  },
  s0294: {
    literal: 'This is work that must be undertaken—it is not the business of the responsible offices.',
    idiomatic: 'That is positive statecraft—not routine office business.',
  },
  s0295: {
    literal: 'If it is the duty of the offices, they should only unite in following the classics one by one;',
    idiomatic: 'Offices should unite on the classics alone;',
  },
  s0296: {
    literal: 'to change ritual according to the times requires awaiting a clear edict.',
    idiomatic: 'changing ritual for the times awaits an explicit edict.',
  },
  s0297: {
    literal: 'The proofs against repair number seven in brief: temples established on removal—first;',
    idiomatic: 'Seven proofs against repair: temples on removal—first;',
  },
  s0298: {
    literal: 'what has been abolished must not be raised—second;',
    idiomatic: 'abolished rites must not be revived—second;',
  },
  s0299: {
    literal: 'temples cannot be empty—third;',
    idiomatic: 'empty temples forbidden—third;',
  },
  s0300: {
    literal: 'tablets are not made out of season—fourth;',
    idiomatic: 'no out-of-season tablet-making—fourth;',
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
