#!/usr/bin/env node
/** Batch 4: s0301–s0400 (Jiutangshu ch.024, suburban sacrifice treatise) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/024.json';
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
    literal: 'Min Ziqian may be enfeoffed as Marquis of Fei; Ran Boniu as Marquis of Yun; Ran Zhonggong as Marquis of Xue; Ran You as Marquis of Xu; Zhong Zilu as Marquis of Wei; Zai Wo as Marquis of Qi; Duanmu Zigong as Marquis of Li; Yan Ziyou as Marquis of Wu; Bu Zixia as Marquis of Wei.',
    idiomatic: 'Nine disciples received marquisates: Min, the three Rans, Zilu, Zai Wo, Zigong, Ziyou, and Zixia.',
  },
  s0302: {
    literal: 'Moreover in the Master\'s succinct words Shen was called Lu; though he ranks among the seventy, he is not listed in the four categories.',
    idiomatic: 'Confucius had called Zeng Shen "Lu"; he was among the seventy but not in the four categories.',
  },
  s0303: {
    literal: 'Recently though differing from the Ten Wise, in the end perhaps differing from peers, we truly trace the former purport and cause him to follow the old position.',
    idiomatic: 'Though not among the Ten Wise, Zeng Shen kept his former place by ancient precedent.',
  },
  s0304: {
    literal: 'Perhaps then ritual obtains its order, people have a model to gaze on, honoring the great glory of Zhu and Si and again weighting the elegant model of the school.',
    idiomatic: 'Rite and example would honor Zhu-Si and the academy\'s tradition.',
  },
  s0305: {
    literal: 'Also Zeng Shen, Zhuansun Shi, and sixty-seven others were all enfeoffed as earls.',
    idiomatic: 'Sixty-seven more disciples, including Zeng Shen and Zhuansun Shi, became earls.',
  },
  s0306: {
    literal: 'Thereupon they rectified the Venerable Father to sit facing south; from within came the king\'s robe and cap to clothe him.',
    idiomatic: 'Confucius was seated facing south and clothed in royal robes.',
  },
  s0307: {
    literal: 'They dispatched Left Chancellor of the Secretariat Pei Yaojing to the Directorate temple to confer patent enfeoffing King Wén Xuān.',
    idiomatic: 'Pei Yaojing conducted the enfeoffment at the Directorate temple.',
  },
  s0308: {
    literal: 'When the patent was concluded the relevant office set forth libation sacrifice, also like the libation ceremony; excellencies and below participated in observing the rites.',
    idiomatic: 'After the patent, libation followed; officials down to the ranks watched.',
  },
  s0309: {
    literal: 'They also dispatched Junior Protector to the Heir Apparent Cui Lin to the eastern-capital temple to perform the patent ceremony; from this they first used suspended palace music.',
    idiomatic: 'Cui Lin performed the eastern-capital patent rite; palace music was introduced.',
  },
  s0310: {
    literal: 'At the upper ding days of the two mid-season months in spring and autumn, they ordered the Three Excellencies to act by commission.',
    idiomatic: 'Spring and autumn upper ding days: the Three Excellencies officiated by commission.',
  },
  s0311: {
    literal: 'In Tianbao 1, mingjing and jinshi studied the Erya.',
    idiomatic: 'Tianbao 1: mingjing and jinshi studied the Erya.',
  },
  s0312: {
    literal: 'In the seventh month of the ninth year the Directorate established the Broad Culture Hall to oversee jinshi studies, one Erudite and one assistant instructor each, rank equal to the Grand Academy Erudite.',
    idiomatic: 'Year 9: the Broad Culture Hall was added for jinshi with faculty equal to the Grand Academy.',
  },
  s0313: {
    literal: 'In the seventh month of the twelfth year an edict said candidates under Heaven may not fill local tribute quotas but all are to be supplemented as students.',
    idiomatic: 'Year 12: examination candidates had to enroll as Directorate students, not as local tribute.',
  },
  s0314: {
    literal: 'Four-gate distinguished scholars were stopped.',
    idiomatic: 'Four-gate distinguished scholars were abolished.',
  },
  s0315: {
    literal: 'In the sixth month of Baoying 2 an edict ordered prefectures and counties each year to examine xiucai and xiaolian, taking those of the village and district with conduct of filial piety, fraternal duty, integrity, and shame to recommend.',
    idiomatic: 'Baoying 2: localities yearly recommended virtuous xiucai and xiaolian.',
  },
  s0316: {
    literal: 'Entrust the relevant offices to treat them by ritual, examine the learning they have mastered; within the Five Classics, mastering one classic and also being able to answer policy, reaching the substance of principle—all are to be appointed office according to measured conduct.',
    idiomatic: 'Offices tested one classic and policy; the qualified received offices by merit.',
  },
  s0317: {
    literal: 'Mingjing and jinshi were both stopped.',
    idiomatic: 'The mingjing and jinshi examinations were suspended.',
  },
  s0318: {
    literal: 'Directorate Daoist selection also should follow this.',
    idiomatic: 'Directorate moral selection followed the same rule.',
  },
  s0319: {
    literal: 'It was because of Yang Guan\'s request.',
    idiomatic: 'This followed Yang Guan\'s memorial.',
  },
  s0320: {
    literal: 'An edict was sent down for court ministers to assemble in discussion; Secretariat Drafter Jia Zhi deliberated and requested following Guan\'s memorial.',
    idiomatic: 'Jia Zhi urged adopting Yang Guan\'s plan.',
  },
  s0321: {
    literal: 'The relevant office memorialized: "We venture that this year\'s candidates and others, some having already completed old studies, in principle are hard to change quickly, or distant prefectures having sent them—their persons are already on the road; the affair must be accepted and rewarded."',
    idiomatic: 'The ministry noted many candidates were already en route under the old rules.',
  },
  s0322: {
    literal: 'Among this autumn\'s candidates those who wish the old course and examination are also permitted from next year onward to follow the new edict entirely."',
    idiomatic: 'This year\'s candidates could finish under the old rules; later years would follow the new edict.',
  },
  s0323: {
    literal: '" Later Guan\'s deliberation in the end was not implemented.',
    idiomatic: 'Yang Guan\'s reform was never enacted.',
  },
  s0324: {
    literal: 'From after Zhide, warfare not ceasing, Directorate students could not receive granary provisions, students and disciples all scattered, halls and walls collapsed in ruin, and they constantly borrowed military guards for lodging.',
    idiomatic: 'After Zhide, war left the academy empty, ruined, and quartering soldiers.',
  },
  s0325: {
    literal: 'By the first month of Yongtai 2, Directorate Libation-offering Director Xiao Xin submitted: "Honoring Ru and valuing learning to correct wind and teaching is the root of royal transformation."',
    idiomatic: 'Yongtai 2: Director Xiao Xin urged reviving Confucian education as the basis of rule.',
  },
  s0326: {
    literal: '" On the twenty-ninth day of that month an edict said:',
    idiomatic: 'On the twenty-ninth the emperor responded:',
  },
  s0327: {
    literal: 'Principle and the Way return together; the teacher corps is supreme; transforming people and completing custom must be zealous in learning.',
    idiomatic: 'Teachers stood supreme; transforming custom required learning.',
  },
  s0328: {
    literal: 'Outstanding candidates all follow this path; the state\'s noble sojourners none fail to receive instruction.',
    idiomatic: 'Talented candidates and noble youths were to study.',
  },
  s0329: {
    literal: 'Cultivate the teaching of culture, conduct, loyalty, and trustworthiness; honor respectful service and filial-fraternal virtue; exhaust the teacher\'s Way—only then is one called adult.',
    idiomatic: 'Classical virtue and the teacher\'s Way made the finished student.',
  },
  s0330: {
    literal: 'Moreover display at the royal court, examine by government affairs, summon by ritual, appoint by office.',
    idiomatic: 'Graduates were to serve at court and enter office by merit.',
  },
  s0331: {
    literal: 'Placed in the Zhou ranks, none are not state elites; delighting in obtaining the worthy—it is here!',
    idiomatic: 'The state would again delight in worthy men.',
  },
  s0332: {
    literal: 'Our will seeks the substance of principle and especially weighs Ru learning; the former kings\' great teaching—we dare not fail to carry it out.',
    idiomatic: 'The emperor prized learning and vowed to restore the sages\' teaching.',
  },
  s0333: {
    literal: 'Recently because the Rong and Di had many difficulties and we were urgent in strategy, the Grand Academy was set up empty and the various students were mostly few.',
    idiomatic: 'War had emptied the Grand Academy.',
  },
  s0334: {
    literal: 'The place of string and recitation was desolate without sound; between the one-zhang teaching mat and the pupils it nearly would not be swept.',
    idiomatic: 'Classrooms stood silent and untended.',
  },
  s0335: {
    literal: 'The upper academy reaching this—we deeply use pity.',
    idiomatic: 'The emperor lamented the academy\'s decay.',
  },
  s0336: {
    literal: 'Now the realm is at peace, civil and military both provided; we are just casting aside weapons to discuss arts, causing vegetable libation to proceed with ritual.',
    idiomatic: 'Peace returned; the court would lay aside arms for study and school rites.',
  },
  s0337: {
    literal: 'The four categories all advance, the six arts revive, spirits and men harmonize, and wind and transformation gradually beautify.',
    idiomatic: 'The four disciplines and six arts would flourish again.',
  },
  s0338: {
    literal: 'Daily using this Way, there will be no gap.',
    idiomatic: 'This Way would be practiced without interruption.',
  },
  s0339: {
    literal: 'The various circuit military commissioners, observers, and grand defense commissioners are our bosom kin, long garrisoning the regions.',
    idiomatic: 'Regional commanders were the emperor\'s trusted kin.',
  },
  s0340: {
    literal: 'Cherishing their sons and younger brothers, each upholds moral direction; cultivating virtue and establishing the person—the affair relies on training feathers.',
    idiomatic: 'Their sons needed moral training and education.',
  },
  s0341: {
    literal: 'We fear that after spears and halberds schools are still slight, dwelling far in distant regions with nowhere to consult and receive instruction.',
    idiomatic: 'Remote regions still lacked schools after the wars.',
  },
  s0342: {
    literal: 'East of the mountains learning is scarce; to resolve doubts one must go to Ma Rong;',
    idiomatic: 'Shandong had few scholars; doubts once sent men to Ma Rong.',
  },
  s0343: {
    literal: 'west of the pass has a famous reputation; honoring Ru is what Yang Zhen was called for.',
    idiomatic: 'Guandong honored Ru as Yang Zhen had.',
  },
  s0344: {
    literal: 'Bearing classics to come study—they should assemble at the capital.',
    idiomatic: 'Students bearing classics should gather in the capital.',
  },
  s0345: {
    literal: 'Together with chancellors, court officers, and sons and younger brothers of the six Shence Army generals who wish to pursue studies—from now onward all are ordered to be supplemented as Directorate students.',
    idiomatic: 'Ministers\' and Shence generals\' sons were ordered into the Directorate.',
  },
  s0346: {
    literal: 'We wish their learning to weigh the casket\'s gold, their vessels to be completed like carved jade, daily renewing their virtue, generation after generation not lacking the worthy.',
    idiomatic: 'They should refine talent like gold in a casket and jade on the wheel.',
  },
  s0347: {
    literal: 'Among them those who though holding office wish to attach to study and read books are also permitted.',
    idiomatic: 'Officials might also enroll to read books.',
  },
  s0348: {
    literal: 'The academy officers—entrust the Secretariat and Chancellery immediately to select those whose conduct can serve as teacher models to fill the posts.',
    idiomatic: 'The Secretariat was to appoint worthy teachers.',
  },
  s0349: {
    literal: 'Student quota numbers, classics studied, examination grades, provisions supplied, and damaged school buildings needing repair according to circumstances—all entrust each origin office to draft regulations and report.',
    idiomatic: 'Each bureau was to report quotas, curricula, exams, rations, and repairs.',
  },
  s0350: {
    literal: 'The affair must be detailed and complete, matching our intent."',
    idiomatic: 'Reports were to be thorough.',
  },
  s0351: {
    literal: 'At the first day of the second month, upper ding libation, Xiao Xin again memorialized: the various chancellors Yuan Zai, Du Hongjian, and Li Baoyu and regular-attendance officers and six-army generals came to the Directorate of Studies to hear lectures and discussion; five hundred strings of cash were bestowed.',
    idiomatic: 'Second-month libation: chancellors and officers heard lectures at the Directorate; five hundred strings were granted.',
  },
  s0352: {
    literal: 'They ordered the Governor of Jingzhao Li Gan to prepare food.',
    idiomatic: 'Jingzhao Governor Li Gan provided the feast.',
  },
  s0353: {
    literal: 'They assembled the various Ru, Dao, and Buddhist masters and questioned meanings the whole day.',
    idiomatic: 'Ru, Daoist, and Buddhist masters debated all day.',
  },
  s0354: {
    literal: 'This rite had long been abandoned; in one morning it could be raised.',
    idiomatic: 'A long-abandoned rite was revived in a day.',
  },
  s0355: {
    literal: 'In the eighth month the Directorate of Studies completed the ancestral hall, lecture hall, six institutes, and the office chambers where officials dwelt, using forty thousand strings of cash; they dismantled the Qujiang Pavilion\'s tiles and timber to assist.',
    idiomatic: 'Eighth month: the academy rebuilt its halls for forty thousand strings, using timber from the Qujiang Pavilion.',
  },
  s0356: {
    literal: 'On the fourth day, libation; chancellors, regular-attendance officers, and generals all met in the lecture hall; Jingzhao prefecture set out food and lectured.',
    idiomatic: 'Fourth day libation: officials feasted and debated in the lecture hall.',
  },
  s0357: {
    literal: 'Army Commissioner Yu Chaoen lectured on the Changes, and also in the lecture hall painted the "Mirror Diagram of the Zhou Changes."',
    idiomatic: 'Yu Chaoen lectured on the Changes and painted its Mirror Diagram.',
  },
  s0358: {
    literal: 'From Zhide 2 when the two capitals were recovered, only at New Year\'s the Hall of Enlightened Governance received court congratulation and set palace suspended music; even suburban and temple great sacrifices had only ascending hymn music, and also lacked civil and martial two dances.',
    idiomatic: 'Since recovering the capitals in 757, full court music was rare even at great sacrifices.',
  },
  s0359: {
    literal: 'At that time Army Commissioner Yu Chaoen knew supervision affairs; the temple courtyard then had complete palace suspended music before the lecture hall, and also the Music Bureau of the Instructional Workshop mixed performances, ending at sunset.',
    idiomatic: 'Yu Chaoen staged full palace music and entertainments at the academy all day.',
  },
  s0360: {
    literal: 'On the twenty-fifth day an edict said: "In antiquity establishing offices and dividing lands was to honor virtue and repay merit."',
    idiomatic: 'Day 25: an edict praised merit and office.',
  },
  s0361: {
    literal: 'Presiding over the inner precinct\'s main cords, affairs are secret within the pure forbidden precinct;',
    idiomatic: 'He governed the inner palace with secret care;',
  },
  s0362: {
    literal: 'expanding the upper academy\'s teaching, virtue moistens the great enterprise.',
    idiomatic: 'and expanded the academy, enriching the dynasty.',
  },
  s0363: {
    literal: 'Fief opening a thousand chariots, ritual ordering the nine guests.',
    idiomatic: 'His fief was vast; ritual ranked him among nine guests.',
  },
  s0364: {
    literal: 'One must rely on ability that assists both sides, using it to harmonize the selection of utmost fairness.',
    idiomatic: 'Such breadth required a man of balanced talent.',
  },
  s0365: {
    literal: 'Kaifu Yitong Sansi, concurrent Right Supervisor of the Gate Guards Grand General, still knowing Army Commissioner for Observation, Pacification, and Disposition, knowing Inner Palace Service Director, Inner Flying Dragon Stud Director, Inner Bow and Arrow Store Director, knowing Shence Army Horse Commissioner, Supreme Pillar of State, Duke of Fenyang in Fengyi commandery Yu Chaoen—gentle, good, respectful, and frugal, broad, soft, simple, and incorrupt, long in talent and broad in reach, keen in knowledge and lofty in subtlety.',
    idiomatic: 'The edict extolled Yu Chaoen\'s titles, virtues, and talents at length.',
  },
  s0366: {
    literal: 'Learning exhausted the secrets of Ru and dark studies; stratagems exhausted the essence of escape armor.',
    idiomatic: 'He was learned in Confucian and esoteric texts and military divination.',
  },
  s0367: {
    literal: 'A hundred conduct lines supported his person; one mind served above.',
    idiomatic: 'His conduct supported the throne.',
  },
  s0368: {
    literal: 'From when the royal house had many troubles and cloud-thunder began the enterprise, north of Wuyuan he was first to open the march;',
    idiomatic: 'Since the rebellion he had marched first from Wuyuan;',
  },
  s0369: {
    literal: 'south of the three rivers he thereupon arrayed his brigades.',
    idiomatic: 'and organized armies south of the Yellow River.',
  },
  s0370: {
    literal: 'Completing the army must win—each time matching the military canon;',
    idiomatic: 'His armies won by classic strategy;',
  },
  s0371: {
    literal: 'calculating the enemy without omission—can be verified in yarrow and tortoise.',
    idiomatic: 'his foresight matched divination.',
  },
  s0372: {
    literal: 'When Guan and Luo were settled and You and Yan again opened, overseas there was cutting off—his merit alone was luxuriant.',
    idiomatic: 'He had helped pacify the heartland and frontiers.',
  },
  s0373: {
    literal: 'Serving three sagely rulers, from beginning to end exerting strength.',
    idiomatic: 'He had served three emperors faithfully.',
  },
  s0374: {
    literal: 'Recently escorting the eastern capital, releasing position to assist the king—when the time was like a fallen pearl and the season saw brambles parted, descending the river to aid us, armor orders written first—the guard of the altars of soil and grain, the state and family rely on this.',
    idiomatic: 'He had escorted the court east and aided the throne in crisis.',
  },
  s0375: {
    literal: 'When the frontier ceased alarm and military affairs relaxed vigilance, we then were rewarding him in the Images of the Changes."',
    idiomatic: 'With peace returning, the court now rewarded his study of the Changes.',
  },
  s0376: {
    literal: 'Talent joining civil and martial—what is called meritorious worthy; also already appointing by ability—here then is the mandate of reward; he should receive court canon and match public deliberation."',
    idiomatic: 'His civil and military merit deserved high office by public acclaim.',
  },
  s0377: {
    literal: 'He may act as Inner Service Director, acting Directorate of Studies affairs, filling Honglu ritual-guest and related commissioner posts, enfeoffed as Duke of Zheng with a fief of three thousand households."',
    idiomatic: 'He was made Inner Service Director, acting Directorate head, Duke of Zheng, fief 3000.',
  },
  s0378: {
    literal: '" On the twenty-fourth day, at the Directorate of Studies.',
    idiomatic: 'The patent was issued at the Directorate on the twenty-fourth.',
  },
  s0379: {
    literal: 'An edict ordered chancellors and Secretariat-Chancellery officers, various departments\' regular-attendance officers, and six-army generals to escort him up.',
    idiomatic: 'Officials escorted him to the ceremony.',
  },
  s0380: {
    literal: 'Jingzhao prefecture prepared food; inner Instructional Workshop music, pole puppets, and swerving puppets were arrayed before the lecture hall.',
    idiomatic: 'A feast and palace entertainments filled the lecture hall.',
  },
  s0381: {
    literal: 'Chaoen declined on the ground that inner attendants should not know southern-yamen administrative affairs; chancellors, vice premiers, and grandees all urged him, but Chaoen firmly declined and then memorialized.',
    idiomatic: 'Yu Chaoen declined civil office; ministers urged him in vain.',
  },
  s0382: {
    literal: 'The chancellor led him to the food.',
    idiomatic: 'The chancellor led him to the feast.',
  },
  s0383: {
    literal: 'Music was played; inner envoys sent wine and tea and fruit, bestowed to supply banquet music, ending at sunset.',
    idiomatic: 'Music, imperial wine, and fruit lasted until sunset.',
  },
  s0384: {
    literal: 'Yuan Zai memorialized a report.',
    idiomatic: 'Yuan Zai submitted a memorial.',
  },
  s0385: {
    literal: 'They also had an inner envoy proclaim an edict: "Since Chaoen having declined does not stop, let him only be charged with knowing students\' grain provisions."',
    idiomatic: 'An envoy limited his charge to student provisions.',
  },
  s0386: {
    literal: '" That day, more than three hundred sons and younger brothers of chancellors and generals and below all wore purple robes, filling student quarters; food was set in the corridors.',
    idiomatic: 'Three hundred officials\' sons in purple filled the student quarters.',
  },
  s0387: {
    literal: 'A loan of ten thousand strings of cash, collecting five percent interest, to supply Directorate officers and students\' expenses.',
    idiomatic: 'Ten thousand strings were lent at five percent for academy expenses.',
  },
  s0388: {
    literal: 'Soon he also requested taking a hundred cash per green-sprout land head as assessment to supply expenses likewise.',
    idiomatic: 'He soon added a levy on green-sprout land.',
  },
  s0389: {
    literal: 'By old precedent the two-capital Directorate had more than two thousand students; Hongwen, Chongwen, and Chongxuan institute students were all granary-fed.',
    idiomatic: 'Formerly over two thousand capital students received state rations.',
  },
  s0390: {
    literal: 'In the fifteenth year the upper capital was lost and this affair was abolished.',
    idiomatic: 'The An Lushan rebellion ended the provision.',
  },
  s0391: {
    literal: 'In Qianyuan 1, because warfare had not ceased, another edict stopped prefectural and county students, to await a plentiful year.',
    idiomatic: 'Qianyuan 1: local schools were closed until peace.',
  },
  s0392: {
    literal: 'In the fourth month of Empress Zetian\'s Chui Gong 4, Yong Prefecture\'s Yong\'an man Tang Tongtai forged an auspicious stone in the Luo River and presented it.',
    idiomatic: 'Chui Gong 4: Tang Tongtai forged a "auspicious stone" in the Luo.',
  },
  s0393: {
    literal: 'Its text said: "The Holy Mother oversees men; eternal flourishing of the imperial enterprise."',
    idiomatic: 'It read: "The Holy Mother rules mankind; the dynasty flourishes forever."',
  },
  s0394: {
    literal: 'Thereupon they styled the stone "Treasure Chart," bestowed banquet music on the hundred officials, and bestowed goods in differing grades.',
    idiomatic: 'The stone was named Treasure Chart; officials were feasted and rewarded.',
  },
  s0395: {
    literal: 'Tongtai was appointed General of Guerrilla Warfare.',
    idiomatic: 'Tongtai became a guerrilla general.',
  },
  s0396: {
    literal: 'In the fifth month of that year an edict was issued wishing personally to bow at the Luo and receive the "Treasure Chart."',
    idiomatic: 'That fifth month she planned to worship at the Luo and receive the chart.',
  },
  s0397: {
    literal: '" First perform the affair at the southern suburb and announce thanks to August Lord on High."',
    idiomatic: 'She would first sacrifice at the southern suburb to Heaven.',
  },
  s0398: {
    literal: 'Order all circuit governors, prefects, and various kin all to assemble at the divine capital ten days before bowing at the Luo.',
    idiomatic: 'Governors, prefects, and kin were summoned to Luoyang beforehand.',
  },
  s0399: {
    literal: 'Thereupon Zetian added the honorific title Holy Mother Divine Emperor.',
    idiomatic: 'Zetian took the title Holy Mother Divine Emperor.',
  },
  s0400: {
    literal: 'A great amnesty was proclaimed for all under Heaven.',
    idiomatic: 'She proclaimed a great amnesty.',
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
if (data.metadata.chapter !== '024') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 024; standalone T ready (${Object.keys(T).length} entries).`
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
