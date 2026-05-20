#!/usr/bin/env node
/** Batch 6: s0501–s0600 (Jiutangshu ch.018, Wenzong 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/018.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 501;
const END = 600;

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
  s0501: {
    literal: 'If ruined, they should also be destroyed.',
    idiomatic: 'Ruined temples were to be demolished as well.',
  },
  s0502: {
    literal: 'On days for burning incense, officials should use Daoist abbeys.',
    idiomatic: 'Incense rites were moved to Daoist halls.',
  },
  s0503: {
    literal: 'In the upper and lower capitals each street keeps two temples, thirty monks each.',
    idiomatic: 'Each capital street would keep two temples and thirty monks.',
  },
  s0504: {
    literal: 'Upper capital left ward keeps Cien and Jianfu; right ward Ximing and Zhuangyan.',
    idiomatic: 'Chang\'an\'s left ward kept Cien and Jianfu; the right, Ximing and Zhuangyan.',
  },
  s0505: {
    literal: 'The Secretariat again memorialized: "Abolished temples empire-wide — bronze statues and bells and chimes are entrusted to the salt commissioner to cast coin; iron statues to the prefecture to cast farm tools; gold, silver, and brass images melted for Revenue.',
    idiomatic: 'Abolished temples\' metal was ordered cast into coin and farm tools.',
  },
  s0506: {
    literal: 'Gold, silver, copper, and iron images in gentry households — within one month after the edict they must be surrendered; violators handled by the salt commissioner under the copper prohibition law.',
    idiomatic: 'Private metal images had to be surrendered within a month.',
  },
  s0507: {
    literal: 'Clay, wood, and stone images may remain in temples as before."',
    idiomatic: 'Clay, wood, and stone images could remain in temples.',
  },
  s0508: {
    literal: 'Again memorialized: "Monks and nuns should not be under the Ministry of Rites; please place them under the Court of Imperial Entertainments."',
    idiomatic: 'Clerics were transferred from Rites to the Court of Imperial Entertainments.',
  },
  s0509: {
    literal: 'Da Qin, Muhu, and other shrines — since Buddhism is reformed, heterodox cults cannot stand alone.',
    idiomatic: 'Da Qin and Muhu shrines were abolished with Buddhism.',
  },
  s0510: {
    literal: 'Their people are all compelled to return to lay life, sent to native districts as tax households.',
    idiomatic: 'Their adherents were forced to laicize and register as taxpayers.',
  },
  s0511: {
    literal: 'If foreigners, send back to native places for control."',
    idiomatic: 'Foreigners were sent home for local control."',
  },
  s0512: {
    literal: 'End of memorial."',
    idiomatic: 'Thus ended the memorial."',
  },
  s0513: {
    literal: 'Eighth month, edict:',
    idiomatic: 'In the eighth month Wuzong proclaimed:',
  },
  s0514: {
    literal: '"I have heard that before the Three Dynasties Buddha was never spoken of; after Han and Wei the image-teaching gradually rose.',
    idiomatic: '"Before the Three Dynasties no one spoke of Buddha; under Han and Wei the image cult spread,"',
  },
  s0515: {
    literal: 'It came from decadent seasons and spread this alien custom; through cause and condition and habit it grew more and more.',
    idiomatic: '"born of decadent times and grown by habit."',
  },
  s0516: {
    literal: 'Until it harmed national custom and gradually went unnoticed.',
    idiomatic: '"until it ate the state without notice."',
  },
  s0517: {
    literal: 'It seduced human hearts and the masses grew more deluded.',
    idiomatic: '"It deluded hearts and deepened the crowd\'s trance."',
  },
  s0518: {
    literal: 'Down to the nine provinces\' mountains and plains, the two capitals\' gates and wards — monks daily increased, temples daily rose.',
    idiomatic: '"Monks and temples multiplied through plain and capital alike."',
  },
  s0519: {
    literal: 'Laboring men on earth-and-wood works, seizing people\'s profit in gold-and-jewel adornment, abandoning ruler and kin at the teacher\'s moment, violating spouses within precepts.',
    idiomatic: '"They wasted labor on timber and gold, forsook kin for teachers, broke marriage for precepts."',
  },
  s0520: {
    literal: 'Destroying law and harming people — nothing surpasses this path.',
    idiomatic: '"Nothing harmed law and people more."',
  },
  s0521: {
    literal: 'Moreover if one man does not plow, someone suffers hunger;',
    idiomatic: '"One man not plowing means another hungry;"',
  },
  s0522: {
    literal: 'if one woman does not weave, someone suffers cold.',
    idiomatic: '"one woman not weaving means another cold."',
  },
  s0523: {
    literal: 'Today monks and nuns are beyond counting — all wait on farming to eat, on silkworms to clothe.',
    idiomatic: '"Today\'s clerics beyond count all eat the farmer\'s grain and wear the weaver\'s silk."',
  },
  s0524: {
    literal: 'Temples and roadside shrines beyond reckoning — all cloud-built and painted, usurping and imitating palaces.',
    idiomatic: '"Temples beyond reckoning aped the palace in cloud and paint."',
  },
  s0525: {
    literal: 'Jin, Song, Qi, and Liang — material strength withered, customs shallow and deceitful — all from this.',
    idiomatic: '"Jin, Song, Qi, and Liang withered from this very cause."',
  },
  s0526: {
    literal: 'How much more our High Ancestor and Taizong, who with martial arts settled chaos and calamity, with culture adorned Huaxia — holding these two handles suffices to govern the realm; how can a petty western teaching vie with us!',
    idiomatic: '"Gaozu and Taizong ruled by sword and script — why yield to a western cult?"',
  },
  s0527: {
    literal: 'In Zhenguan and Kaiyuan there were also reforms and cuts, yet not fully removed; the stream spread and grew.',
    idiomatic: '"Even Zhenguan and Kaiyuan could not uproot it wholly."',
  },
  s0528: {
    literal: 'I broadly review former words and seek popular debate on all sides — what can be reformed, I cut without doubt.',
    idiomatic: '"What can be cut, I cut without doubt."',
  },
  s0529: {
    literal: 'Inner and outer loyal ministers harmonize with my utmost intent; memorials are thoroughly apt and must be executed.',
    idiomatic: '"Loyal ministers\' plans must be executed."',
  },
  s0530: {
    literal: 'Punishing the thousand-year\'s vermin source, completing the hundred kings\' canonical law, benefiting people and aiding the masses — what would I yield?',
    idiomatic: '"To punish a thousand-year pest and make law for a hundred kings — why should I yield?"',
  },
  s0531: {
    literal: 'Temples demolished empire-wide four thousand six hundred and more, monks and nuns returned to lay life two hundred sixty thousand five hundred, enrolled as two-tax households; roadside shrines and hermitages forty thousand and more demolished, fertile upland fields several tens of millions of mu recovered, bond servants as two-tax households one hundred fifty thousand.',
    idiomatic: '4,600 temples were razed, 260,500 clerics laicized, 40,000 shrines cleared, millions of mu and 150,000 bondsmen restored to tax rolls.',
  },
  s0532: {
    literal: 'Monks and nuns placed under the Host of Guests — making foreign teaching explicit.',
    idiomatic: 'Clerics were placed under the Host of Guests as foreign religion.',
  },
  s0533: {
    literal: 'Compelled Da Qin, Muhu, and Zoroastrian three thousand and more to return to lay life, not mixing with Huaxia custom.',
    idiomatic: 'Three thousand Da Qin, Muhu, and Zoroastrian adherents were laicized.',
  },
  s0534: {
    literal: 'Alas!',
    idiomatic: 'The edict cried Alas!',
  },
  s0535: {
    literal: 'What antiquity had not done seemed to await its time;',
    idiomatic: '"What antiquity had not done seemed to await its hour;"',
  },
  s0536: {
    literal: 'to remove it all today — can one say there is no season?',
    idiomatic: '"to remove it now — can one say the season is wrong?"',
  },
  s0537: {
    literal: 'Driving idle non-workers has already passed one hundred thousand;',
    idiomatic: '"More than a hundred thousand idlers were driven back to work;"',
  },
  s0538: {
    literal: 'abandoning cinnabar-painted useless rooms — how few are not in the billions?',
    idiomatic: '"useless painted halls abandoned by the billion."',
  },
  s0539: {
    literal: 'Henceforth pure instruction trains people, admiring the principle of non-action;',
    idiomatic: '"Henceforth pure teaching and wuwei shall train the people;"',
  },
  s0540: {
    literal: 'simple government aligns policy, completing one custom\'s achievement.',
    idiomatic: '"simple rule shall align the realm."',
  },
  s0541: {
    literal: 'It will make the six realms\' black-haired people together return to imperial transformation.',
    idiomatic: '"All under heaven shall return to imperial transformation."',
  },
  s0542: {
    literal: 'Still, at the start of reform daily use is not yet known; issue edicts in the bright court — you should embody my intent.',
    idiomatic: '"Yet at reform\'s start the court must embody my intent."',
  },
  s0543: {
    literal: 'Closing quote of edict."',
    idiomatic: 'Thus ended the edict."',
  },
  s0544: {
    literal: 'An edict enfeoffed the sixth daughter Princess of Lewen; the seventh as Princess of Changning.',
    idiomatic: 'The sixth and seventh daughters became princesses of Lewen and Changning.',
  },
  s0545: {
    literal: 'The Secretariat memorialized: "We see princesses\' memorials say \'your concubine so-and-so\' — the meaning of subject-concubine takes the humble title;',
    idiomatic: 'The Secretariat asked princesses to drop the term "concubine" in memorials.',
  },
  s0546: {
    literal: 'family ritual should be distinguished.',
    idiomatic: 'Family ritual required distinct forms.',
  },
  s0547: {
    literal: 'We deliberated: princess memorials should follow chief princess precedent, all saying \'such-and-such princess, such number daughter memorializes\' — commandery and county princesses also should follow this form."',
    idiomatic: 'Princesses were to sign as "Princess of X, Nth Daughter" instead.',
  },
  s0548: {
    literal: 'Thus ended the edict; the throne assented.',
    idiomatic: 'Thus ended the edict.',
  },
  s0549: {
    literal: 'Ninth month: Mars transgressed the Upper General.',
    idiomatic: 'In the ninth month Mars crossed the Upper General.',
  },
  s0550: {
    literal: 'Tenth month, yihai: the Secretariat memorialized: "Sishui county\'s Wulao Pass is where Taizong captured Wang Shichong and Dou Jiande; on the pass\'s east peak are statues of the two sages in one hall.',
    idiomatic: 'On yihai the Secretariat proposed a shrine at Wulao Pass.',
  },
  s0551: {
    literal: 'We submit that mountains and rivers are as of old, ramparts remain — awe and spirit flourish at Xuantai, wind and cloud seem to return to Feng and Pei.',
    idiomatic: '"The landscape still holds Taizong\'s victory," they wrote.',
  },
  s0552: {
    literal: 'Truly it should be strictly honored for a hundred generations, beheld by ten thousand states.',
    idiomatic: '"It deserves eternal veneration."',
  },
  s0553: {
    literal: 'Western Han precedent: wherever ancestors once traveled, each state established a temple.',
    idiomatic: 'Han precedent placed temples at imperial visit sites.',
  },
  s0554: {
    literal: 'Now because Dingjue Temple by regulation should be demolished.',
    idiomatic: 'Dingjue Temple there faced demolition.',
  },
  s0555: {
    literal: 'We hope to take the great hall\'s timber on the east peak to build one hall, set palace walls on four sides, and name it Zhaowu Temple to display the holy ancestor\'s martial glory.',
    idiomatic: 'They asked to build Zhaowu Temple from Dingjue\'s timber on the east peak.',
  },
  s0556: {
    literal: 'Entrust the Huai-Meng military commissioner to assign one supervising official.',
    idiomatic: 'Huai-Meng was to supervise construction.',
  },
  s0557: {
    literal: 'Because the sacred images are long aged, we hope Li Shi at the eastern capital will select skilled painters to enhance and adorn them.',
    idiomatic: 'Li Shi was to send painters to restore the statues.',
  },
  s0558: {
    literal: 'On the day work begins, we hope the eastern capital will send a branch-court officer to offer prayer.',
    idiomatic: 'Luoyang was to send an officer to open the rites.',
  },
  s0559: {
    literal: 'Thus ended the edict; the throne assented.',
    idiomatic: 'Thus ended the edict.',
  },
  s0560: {
    literal: 'Eleventh month, jiachen, edict: "Charity wards for the sick — because monks and nuns returned to lay life there is no one to manage them; we fear the disabled will have no support; the two capitals are to grant temple fields for relief.',
    idiomatic: 'A jiachen edict funded charity wards after clerics were laicized.',
  },
  s0561: {
    literal: 'Circuits and prefectures seven to ten qing each — select one elder in the jurisdiction to manage porridge supplies.',
    idiomatic: 'Each prefecture was to allot fields and an elder for soup kitchens.',
  },
  s0562: {
    literal: 'Closing quote of edict."',
    idiomatic: 'Thus ended the edict."',
  },
  s0563: {
    literal: 'Twelfth month: the carriage visited Xianyang.',
    idiomatic: 'In the twelfth month the court visited Xianyang.',
  },
  s0564: {
    literal: 'Supervising Secretary Wei Hongzhi memorialized that the Secretariat\'s power was too heavy and the three offices\' money and grain should not be jointly held by the council chamber.',
    idiomatic: 'Wei Hongzhi argued premiers should not control the treasury.',
  },
  s0565: {
    literal: 'The chief ministers memorialized in reply:',
    idiomatic: 'The premiers rebutted in a memorial:',
  },
  s0566: {
    literal: '"We yesterday faced Yanying and respectfully heard Your Majesty\'s constant wish that the court be honored and ministers solemn — this is Your Majesty\'s deep probe of principle\'s root.',
    idiomatic: '"Your Majesty wishes a honored court and solemn ministers," they began.',
  },
  s0567: {
    literal: 'We cite Guanzi: "Of a state\'s heavy vessels none is heavier than the command.',
    idiomatic: 'They cited Guanzi on the weight of commands.',
  },
  s0568: {
    literal: 'When commands are heavy the lord is honored; when the lord is honored the state is secure.',
    idiomatic: '"Heavy commands make a honored lord and a secure state."',
  },
  s0569: {
    literal: 'Thus state security lies in honoring the lord; honoring the lord lies in executing commands.',
    idiomatic: '"Security lies in honoring the lord through executing commands."',
  },
  s0570: {
    literal: 'The lord\'s principle — nothing is more essential than issuing commands.',
    idiomatic: '"Nothing is more essential than issuing commands."',
  },
  s0571: {
    literal: 'Hence it is said: one who damages commands dies, one who adds to commands dies, one who does not execute commands dies, one who does not follow commands dies."',
    idiomatic: '"Who damages, adds, or ignores commands dies."',
  },
  s0572: {
    literal: 'Also: "When commands issue above and below debate whether they can or cannot, the superior loses awe and the inferior is tied to persons."',
    idiomatic: '"Debate below the throne means the superior loses awe."',
  },
  s0573: {
    literal: 'From Dahe onward this wind has greatly decayed — commands issue above and are faulted below.',
    idiomatic: '"Since Dahe commands have been faulted from below."',
  },
  s0574: {
    literal: 'Unless this decay is removed, there is no way to govern the state.',
    idiomatic: '"This decay must be removed to govern."',
  },
  s0575: {
    literal: 'Yesterday Wei Hongzhi discussed that chief ministers should not jointly hold money and grain.',
    idiomatic: '"Hongzhi said premiers must not hold the treasury," they wrote.',
  },
  s0576: {
    literal: 'We hastened to state the matter\'s substance.',
    idiomatic: 'They laid out the matter\'s substance.',
  },
  s0577: {
    literal: 'In old times Kuang Heng said: "Great ministers are the state\'s thighs and arms, the myriad people\'s gaze, what the bright king carefully chooses."',
    idiomatic: 'They quoted Kuang Heng on great ministers as the state\'s limbs.',
  },
  s0578: {
    literal: 'The Classic of Changes says: "When inferiors slight superiors, base men plot the handle, the state shakes and people are unquiet."',
    idiomatic: 'They quoted the Changes on base men grasping power.',
  },
  s0579: {
    literal: 'Hongzhi received others\' teaching and hastily offered a sealed memorial — this is base men plotting the handle.',
    idiomatic: '"Hongzhi, taught by others, is a base man plotting the handle."',
  },
  s0580: {
    literal: 'Xiao Wangzhi in Han was a famed Confucian of heavy virtue; as Censor-in-Chief he memorialized: "This year at year\'s start sun and moon have little light — the fault lies in your servants" — the Emperor thought Wangzhi\'s meaning slighted the chief minister and sent attendants and censors to interrogate.',
    idiomatic: 'They cited Xiao Wangzhi punished for slighting his chief.',
  },
  s0581: {
    literal: 'In Zhenguan, Supervising Censor Chen Shihe memorialized: "Human thought has limits — one man cannot oversee many offices."',
    idiomatic: 'They cited Chen Shihe\'s limit on one man\'s offices.',
  },
  s0582: {
    literal: 'Taizong said: "This man rashly slanders, wishing to divide my lord and ministers."',
    idiomatic: 'Taizong called it slander meant to divide lord and ministers.',
  },
  s0583: {
    literal: 'Chen Shihe was exiled beyond the ranges.',
    idiomatic: 'Shihe was exiled to Lingnan.',
  },
  s0584: {
    literal: 'Jia Yi said: "The lord is like the hall, ministers like the steps — when steps are high the hall is high."',
    idiomatic: 'They quoted Jia Yi: high steps mean a high hall.',
  },
  s0585: {
    literal: 'Also when generals and ministers are heavy the lord is honored — such is the tendency.',
    idiomatic: '"Heavy ministers make a honored lord."',
  },
  s0586: {
    literal: 'If chief ministers hide treacherous plots, then everyone may debate above.',
    idiomatic: '"Hidden treason can still be exposed from below."',
  },
  s0587: {
    literal: 'As for setting offices and duties, solidly it is the lord\'s handle — not what petty men may debate.',
    idiomatic: '"Office-making is the lord\'s handle, not petty men\'s debate."',
  },
  s0588: {
    literal: 'In antiquity at court each kept his office; thought did not stray from post.',
    idiomatic: '"In antiquity each kept his office."',
  },
  s0589: {
    literal: 'Hongzhi is a base man — how can he with unsuitable words ascend to the bright lord, slighting chief ministers and disturbing current policy — this is slighting the chief minister and shaking policy.',
    idiomatic: '"Hongzhi\'s words slight the council and shake policy."',
  },
  s0590: {
    literal: 'In Eastern Han recluses debated horizontally and the Partisan Proscription arose — this matter deeply needs punishment.',
    idiomatic: 'They warned of Eastern Han-style faction debate.',
  },
  s0591: {
    literal: 'We hope Your Majesty will examine their treachery and remove their cliques — then the court will be quiet and commands solemn.',
    idiomatic: '"Remove their cliques and the court will be quiet."',
  },
  s0592: {
    literal: 'We cannot overcome our indignant feeling to the utmost.',
    idiomatic: '"We are indignant to the utmost."',
  },
  s0593: {
    literal: 'Closing quote of memorial." Hongzhi was punished with demotion.',
    idiomatic: 'Thus ended the memorial. Hongzhi was demoted.',
  },
  s0594: {
    literal: 'Again memorialized: "Before Tianbao, apart from confidential appointments the Secretariat discussed other government with Secretariat drafters.',
    idiomatic: 'They asked to restore pre-Tianbao consultation with drafters.',
  },
  s0595: {
    literal: 'Since hardship, expedients were followed; government largely left the terrace offices; affairs mostly tied to military deadlines; deciding the myriad tasks left no leisure for broad debate.',
    idiomatic: '"Since hardship, broad debate was lost to military haste."',
  },
  s0596: {
    literal: 'We deliberated: hereafter apart from confidential public business, for all awaiting memorials, hundred officials\' reports, money, grain, and criminal matters, we hope the six Secretariat drafters will first deliberate feasibility per precedent; we will discuss and report."',
    idiomatic: 'Six drafters were to pre-review all but confidential business.',
  },
  s0597: {
    literal: 'Thus ended the edict; the throne assented.',
    idiomatic: 'Thus ended the edict.',
  },
  s0598: {
    literal: 'Li Deyu had long been in the council phase; court officials he suppressed all resented him.',
    idiomatic: 'Long in power, Deyu had bred resentment among the suppressed.',
  },
  s0599: {
    literal: 'After Cui Xuan and Du Cong left the council, inner eunuchs spoke before the throne that Deyu was too exclusive; the Emperor\'s mind was displeased; Bai Minzhong\'s faction taught Hongzhi to debate — hence this memorial.',
    idiomatic: 'Eunuchs and Bai Minzhong\'s faction used Hongzhi to attack Deyu\'s monopoly.',
  },
  s0600: {
    literal: 'Yet Deyu\'s deep enmity arose from these words.',
    idiomatic: 'Deyu\'s deepest enemies arose from this episode.',
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
if (data.metadata.chapter !== '018') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 018; standalone T ready (${Object.keys(T).length} entries).`
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
