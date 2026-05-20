#!/usr/bin/env node
/** Batch 7: s0601–s0700 (Jiutangshu ch.019, Yizong / Xizong annals) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/019.json';
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
    literal: 'Twelfth month: Zhenwu military commissioner Li Guochang was made Acting Right Vice Director, Yunzhou prefect, Datong Army defense commissioner and related posts.',
    idiomatic: 'In the twelfth month Li Guochang was posted to Datong at Yunzhou.',
  },
  s0602: {
    literal: 'Guochang relied on merit and was quite overbearing, killing chief officials at will; the court could not pacify him and transferred him to Yunzhong.',
    idiomatic: 'Li Guochang, overbearing and murderous, was transferred to Yunzhong when the court could not control him.',
  },
  s0603: {
    literal: 'Guochang claimed illness and resigned military affairs; thereupon Acting Director of the Imperial Stud Lu Jianfang was made Acting Minister of Punishments, Yunzhou prefect, Datong Army defense commissioner and related posts.',
    idiomatic: 'When Guochang feigned illness, Lu Jianfang replaced him at Datong.',
  },
  s0604: {
    literal: 'The Emperor summoned Jianfang at Sizheng Hall and said to him: "You governed Cangzhou as commissioner and were bent to Datong.',
    idiomatic: 'At Sizheng Hall the Emperor told Lu Jianfang:',
  },
  s0605: {
    literal: 'Yet I, because the Shatuo, Qiang, and Hun disturb the border marches, and because you were once at Yunzhong and showed kindness to the tribes—bear this bending for my sake on this journey, fully convey my intent, and comfort Guochang so he will not harbor suspicion.',
    idiomatic: '"You once soothed the tribes at Yunzhong—go comfort Guochang and leave him no cause for suspicion."',
  },
  s0606: {
    literal: 'That month Li Guochang\'s young son Keyong killed Yunzhong defense commissioner Duan Wenchu, seized Yunzhou, and declared himself acting defense commissioner.',
    idiomatic: 'That month Li Keyong killed Duan Wenchu and seized Yunzhou.',
  },
  s0607: {
    literal: 'An edict posthumously styled Xuanzong as Primordial Sage, Supreme Illumination, Accomplished in Martial Valor, Manifest in Literary Wisdom, Sagely and Perceptive, Benevolent and Spiritual, Admirable in the Way, Great in Filial Piety.',
    idiomatic: 'Xuanzong received a posthumous honorific title.',
  },
  s0608: {
    literal: 'Xiantong 14, first month, bingyin new moon.',
    idiomatic: 'Xiantong 14 opened on bingyin.',
  },
  s0609: {
    literal: 'Censor-in-Chief Wei Chan memorialized: for prefectural governors receiving appointment, after formal court farewell they plead illness and memorialize leave—this is truly lax.',
    idiomatic: 'Wei Chan urged stricter rules on prefects who skip court audiences:',
  },
  s0610: {
    literal: 'Hereafter if there is real cause known to the multitude, beyond three days is not within the memorial limit.',
    idiomatic: '"genuine illness may excuse three days\' delay;"',
  },
  s0611: {
    literal: 'For inner and outer appointees entering the capital, they should promptly attend court thanks; if encountering a holiday, they should stay at Duting Station.',
    idiomatic: '"new appointees must await audience at Duting Station on holidays;"',
  },
  s0612: {
    literal: 'Recently many take leave and return home privately—violating regulations and quite contrary to ritual respect.',
    idiomatic: '"private leave before audience violates ritual;"',
  },
  s0613: {
    literal: 'From now on, per precedent, if they have not attended court thanks they must remain at Duting Station.',
    idiomatic: '"remain at Duting until audience;"',
  },
  s0614: {
    literal: 'If they overstep, the Censorate investigates and memorializes.',
    idiomatic: '"violators face censorate investigation." The throne assented.',
  },
  s0615: {
    literal: 'Thus ended the edict; the throne assented.',
    idiomatic: 'Thus ended the edict.',
  },
  s0616: {
    literal: 'On xinwei an edict to Lu Jianfang said: "Li Guochang long harbored loyal redness and showed brilliant merit; the court also thrice granted territory and twice moved his banner—such favoring has few parallels.',
    idiomatic: 'On xinwei the Emperor wrote Lu Jianfang about Li Guochang:',
  },
  s0617: {
    literal: 'Recently when troops were mobilized, Ke Rang was also ordered to lead—only praising his integrity, together severing suspicion.',
    idiomatic: '"Guochang\'s loyalty and Ke Rang\'s command should end suspicion—"',
  },
  s0618: {
    literal: 'Learning that Datong Army was unsettled and Duan Wenchu was killed, Guochang\'s young son Keyong was pushed to hold military authority.',
    idiomatic: '"—yet Keyong now holds Yunzhou after killing Duan Wenchu.',
  },
  s0619: {
    literal: 'The affair arose in a moment—could the heart forget the long term?',
    idiomatic: 'The affair was sudden—could hearts forget the long term?',
  },
  s0620: {
    literal: 'If Duan Wenchu truly extorted and himself bred resentment, he could have been reported and the court code would have been applied.',
    idiomatic: 'If Wenchu truly extorted, report—not murder—was the path.',
  },
  s0621: {
    literal: 'Suddenly to injure and destroy life, flay skin and flesh—brutal oppression, quite shocking.',
    idiomatic: 'Instead they flayed him—a shocking brutality.',
  },
  s0622: {
    literal: 'Moreover after a loyal martyr, a gate of integrity—to bring such violent death especially startles observers.',
    idiomatic: 'A loyal house had been savaged before the empire\'s eyes.',
  },
  s0623: {
    literal: 'If Keyong for now does not hold military affairs and waits bound for the court to appoint someone, the affair is expedient and not enough for suspicion.',
    idiomatic: 'If Keyong laid down arms pending appointment, the court might forgive.',
  },
  s0624: {
    literal: 'If he at once plots military authority and wishes to swallow Datong whole, the trouble is long-term—thus hard to assent.',
    idiomatic: 'If he seized command permanently, the court could not assent.',
  },
  s0625: {
    literal: 'We judge Guochang will surely have given loyal orders.',
    idiomatic: 'Surely Guochang had already commanded restraint.',
  },
  s0626: {
    literal: 'Knowing you twice governed Yunzhong, favor reaching Guochang father and son—reverent fear and gratitude, not like ordinary men.',
    idiomatic: 'You, who twice governed Yunzhong, must write them with grave urgency—',
  },
  s0627: {
    literal: 'You should write with alarm, deeply state fortune and calamity, earnestly instruct and explain, splitting and pointing to what is fitting.',
    idiomatic: '—state fortune and calamity plainly and keep their great integrity intact.',
  },
  s0628: {
    literal: 'Urge that great integrity not be lost and former merit not be abandoned together.',
    idiomatic: 'Do not let them abandon their former merit.',
  },
  s0629: {
    literal: 'Jianfang followed the edict to instruct them; Guochang did not obey.',
    idiomatic: 'Lu Jianfang obeyed; Guochang did not.',
  },
  s0630: {
    literal: 'Thereupon an edict ordered Taiyuan military commissioner Cui Yanzhao and Youzhou military commissioner Zhang Gongsu to lead armies against them.',
    idiomatic: 'Cui Yanzhao and Zhang Gongsu were ordered to attack.',
  },
  s0631: {
    literal: 'Third month: the newly appointed Datong Army commander Lu Jianfang was made Chanyu Protector-General, Zhenwu military commissioner, Linsheng and related prefectures observation commissioner and related posts.',
    idiomatic: 'In the third month Lu Jianfang was named Zhenwu commander while still bound for Datong.',
  },
  s0632: {
    literal: 'At that time Li Guochang held Zhenwu.',
    idiomatic: 'Li Guochang still held Zhenwu.',
  },
  s0633: {
    literal: 'Jianfang reached Lanzhou and died.',
    idiomatic: 'Lu Jianfang died at Lanzhou.',
  },
  s0634: {
    literal: 'From this the Shatuo raided the northern garrisons of Dai.',
    idiomatic: 'Thereafter Shatuo raids swept northern garrisons.',
  },
  s0635: {
    literal: 'On gengwu an edict ordered monks of both streets to welcome the Buddha\'s relic at Fengxiang Famen Temple; that day heaven rained yellow earth everywhere.',
    idiomatic: 'On gengwu monks were sent to Famen Temple for the Buddha\'s relic; yellow earth rained from the sky.',
  },
  s0636: {
    literal: 'Fourth month eighth day, the relic reached the capital; from Kaiyuan Gate to Anfu Gate, colored pavilions lined the road and the sound of chanting Buddha shook the earth.',
    idiomatic: 'On the eighth of the fourth month the relic entered the capital amid pavilions and thunderous chanting.',
  },
  s0637: {
    literal: 'The Emperor ascended Anfu Gate to welcome it with ritual; it was welcomed into the inner chapel three days, then went out to capital temples.',
    idiomatic: 'The Emperor welcomed it at Anfu Gate, kept it three days in the inner chapel, then sent it to city temples.',
  },
  s0638: {
    literal: 'Men and women gathered like clouds; regalia and adornment—nothing in antiquity compared.',
    idiomatic: 'Crowds and regalia surpassed anything antiquity had seen.',
  },
  s0639: {
    literal: 'An edict: "We with little virtue inherit the great enterprise fourteen years.',
    idiomatic: 'An edict began: "Fourteen years we have borne the throne—',
  },
  s0640: {
    literal: 'Recently bandits rose wild and royal armies have not ceased.',
    idiomatic: '"—while bandits rage and armies never rest.',
  },
  s0641: {
    literal: 'We toil anxiously in office, cherishing and nurturing the living, and thus revere the Buddhist teaching, greatly honor the mysterious gate, welcome the true body to bless the myriad people.',
    idiomatic: 'We welcomed the Buddha\'s relic to bless the people—',
  },
  s0642: {
    literal: 'Now the viewing masses choke the crossroads.',
    idiomatic: '"—yet crowds choke the roads.',
  },
  s0643: {
    literal: 'We think of the prisons and wake at night in worry, sighing that our people fall into penal nets.',
    idiomatic: 'We think of prisoners and cannot sleep—',
  },
  s0644: {
    literal: 'Moreover as oppressive heat approaches, bound in ropes—or long confined in gloom, injuring harmonious qi, or connected pursuit disturbing farm work.',
    idiomatic: '"—men bound in summer heat, farms neglected by pursuit.',
  },
  s0645: {
    literal: 'Prisoners under detention in the capital and all prefectures empire-wide, except the ten abominations, disobedience, deliberate homicide, official corruption, compounding poison, arson with weapons, and opening graves, have remaining crimes reduced one grade by severity.',
    idiomatic: 'Reduce remaining sentences one grade empire-wide, except capital crimes.',
  },
  s0646: {
    literal: 'For capital army garrisons, complete review within two days and memorialize;',
    idiomatic: 'Capital garrisons report within two days;',
  },
  s0647: {
    literal: 'all prefectures, within three days after the edict arrives, review and memorialize.',
    idiomatic: 'prefectures within three days.',
  },
  s0648: {
    literal: 'Vice Minister of Personnel Xiao Fang was made Vice Minister of War, Grand Councillor.',
    idiomatic: 'Xiao Fang joined the Grand Council as vice minister of war.',
  },
  s0649: {
    literal: 'Sixth month: the Emperor was unwell.',
    idiomatic: 'In the sixth month the Emperor fell ill.',
  },
  s0650: {
    literal: 'Seventh month, guihai new moon.',
    idiomatic: 'The seventh month opened on guihai.',
  },
  s0651: {
    literal: 'On wuyin the illness grew critical.',
    idiomatic: 'On wuyin the illness turned critical.',
  },
  s0652: {
    literal: 'On gengwu an edict established Prince of Pu Yan as crown prince with acting charge of military and state affairs.',
    idiomatic: 'On gengwu Prince of Pu Yan was named crown prince regent.',
  },
  s0653: {
    literal: 'On xinsi the testamentary edict said: "We attend the nine temples and rule the four seas, vigilant evening and morning, surely seeking the source of governance and thinking to build the great middle way.',
    idiomatic: 'On xinsi the testament began: "We ruled the four seas seeking the great middle way—',
  },
  s0654: {
    literal: 'As for cherishing distant tribes and laying down weapons—all by virtue\'s soothing, also by taming in time, hoping purity in governance and peace attainable.',
    idiomatic: '"—soothing tribes and laying down arms by virtue alone.',
  },
  s0655: {
    literal: 'Since autumn illness suddenly came; sitting court was lacking more than ten days without recovery.',
    idiomatic: 'Since autumn illness has kept us from court ten days—',
  },
  s0656: {
    literal: 'The six illnesses invade; myriad affairs are much vacant; physicians have no effect until lingering end.',
    idiomatic: '"—physicians fail and the end nears.',
  },
  s0657: {
    literal: 'Alas!',
    idiomatic: 'Alas!—the end drew near.',
  },
  s0658: {
    literal: 'Number has an end—sages must share it; understanding this saying is reaching the ultimate principle.',
    idiomatic: 'Even sages must end—understand this and reach the ultimate.',
  },
  s0659: {
    literal: 'We again declare the testament to accord with canonical plans.',
    idiomatic: 'We declare the testament:',
  },
  s0660: {
    literal: 'Crown Prince acting charge of military and state affairs Yan, nature endowed with mildness and harmony, born knowing loyalty and filial piety, virtue embracing sagely wisdom, sagely bearing uniform excellence—surely able to raise the ancestors\' heavy radiance and bear the state\'s great structure.',
    idiomatic: 'Crown Prince Yan, loyal and wise, shall raise our ancestors\' light—',
  },
  s0661: {
    literal: 'Let the relevant offices perform rites; before the coffin he shall immediately take the imperial throne.',
    idiomatic: '—and take the throne before the coffin.',
  },
  s0662: {
    literal: 'Minister of Works, Secretariat Vice Director, Grand Councillor Wei Baohang shall act as chief mourner.',
    idiomatic: 'Wei Baohang shall be chief mourner.',
  },
  s0663: {
    literal: 'Military and state affairs are pressing—how can they long be vacant? Moreover the one-month change rite has been practiced since antiquity; the Emperor should hear government in three days and release mourning in twenty-seven.',
    idiomatic: 'Hear government in three days; mourning ends in twenty-seven.',
  },
  s0664: {
    literal: 'All circuit military commissioners, observation, metropolitan training, and defense commissioners, and army supervisors and prefectural governors—entrusted very heavily—must not leave posts to mourn.',
    idiomatic: 'Commissioners and governors must not leave posts to mourn.',
  },
  s0665: {
    literal: 'Civil and military regular attendees at morning and evening attendance—fifteen soundings.',
    idiomatic: 'Regular officials observe fifteen soundings.',
  },
  s0666: {
    literal: 'Within the palace those who should attend—without timely occasion may not weep at will.',
    idiomatic: 'Palace mourning only at appointed times.',
  },
  s0667: {
    literal: 'All people, clerks, and commoners after announcing grief may go out to mourn three days, all release mourning; do not forbid meat, wine, marriage, or sacrifice; after releasing mourning nothing is forbidden when due.',
    idiomatic: 'The people mourn three days without forbidding meat, wine, or marriage.',
  },
  s0668: {
    literal: 'Frugal burial rites should follow Han and Wei texts.',
    idiomatic: 'Burial shall follow frugal Han and Wei rites.',
  },
  s0669: {
    literal: 'Mausoleum regulations must be economical; gold, silver, brocade, and embroidered funeral goods are not permitted.',
    idiomatic: 'No gold, silver, or brocade on funeral goods.',
  },
  s0670: {
    literal: 'Five Ward hawks and dogs—except for hunting, the rest are all released.',
    idiomatic: 'Release the Five Ward hawks and dogs except for hunting.',
  },
  s0671: {
    literal: 'Physicians Duan Cong, Zhao, Fu Qianxiu, Ma Ji, and others are all released.',
    idiomatic: 'Release the attending physicians.',
  },
  s0672: {
    literal: 'To you generals, ministers, and civil and military officials—exhaust strength and loyalty, support our chosen heir, send off the dead and serve the living, do not oppose our will.',
    idiomatic: 'Ministers, support the heir and do not oppose our will.',
  },
  s0673: {
    literal: 'That day he died in Xianning Hall; sagely years forty-one.',
    idiomatic: 'That day Yizong died in Xianning Hall at forty-one.',
  },
  s0674: {
    literal: 'The hundred officials gave posthumous name Sage of Sagely Culture, Bright Sagacity, Respectful and Kind, and temple name Yizong.',
    idiomatic: 'He was styled Yizong, temple name Yizong.',
  },
  s0675: {
    literal: 'Fifteenth year second month, buried at Jianling.',
    idiomatic: 'In the fifteenth year\'s second month he was buried at Jianling.',
  },
  s0676: {
    literal: '[Commentary] The historiographer says: I often met Xiantong elders who told stories of Emperor Gonghui.',
    idiomatic: '[Commentary] The historian met Xiantong elders who remembered Yizong:',
  },
  s0677: {
    literal: 'In Dazhong\'s time the four seas were at peace, the hundred offices cultivated and raised, inner and outer without flawed government, treasuries had surplus, harvests repeatedly abundant, borders undisturbed.',
    idiomatic: 'Under Dazhong the realm was at peace, treasuries full, harvests rich.',
  },
  s0678: {
    literal: 'Gonghui at first inherited the great structure and quite exerted refinement, received forthright words, honored aged virtue—in several years, abundant praise.',
    idiomatic: 'Yizong at first refined governance and earned praise.',
  },
  s0679: {
    literal: 'Yet his capacity was middling by nature, flowing to near favorites; those intimate were eunuchs, those doted on were monks.',
    idiomatic: 'Yet he favored eunuchs and monks.',
  },
  s0680: {
    literal: 'With extravagant words of sorcery he disturbed the inch-square of arrogant dissipation—wishing no negligence, how could it be obtained!',
    idiomatic: 'Sorcery and dissipation left no room for diligence.',
  },
  s0681: {
    literal: 'When trouble tied at the southern barbarians, treachery rose among garrison soldiers.',
    idiomatic: 'Then southern rebellions and garrison treachery followed.',
  },
  s0682: {
    literal: 'Sending transport from the Five Ridges, the realm trembled;',
    idiomatic: 'Transport from the Five Ridges shook the realm;',
  },
  s0683: {
    literal: 'campaigning the Two Shus\' defenses, the common people were overturned.',
    idiomatic: 'campaigns in the Two Shus ruined the people.',
  },
  s0684: {
    literal: 'Xuzhou bandits though exterminated, Henan was nearly empty.',
    idiomatic: 'Xuzhou rebels fell, but Henan lay empty.',
  },
  s0685: {
    literal: 'Yet still cutting army taxes to adorn monasteries, trapping people\'s wealth to cultivate pure karma, taking flattery as self-love and calling loyal remonstrance demonic speech.',
    idiomatic: 'Still he cut army pay for temples and called loyal remonstrance demonic.',
  },
  s0686: {
    literal: 'They rushed toward dangerous slopes; few encouraged upright integrity.',
    idiomatic: 'Courtiers rushed toward danger; few stood upright.',
  },
  s0687: {
    literal: 'Seeing a pig bearing mud, a favored youth was promoted out of turn;',
    idiomatic: 'Favored youths rose out of turn;',
  },
  s0688: {
    literal: 'scorched-head, scorched-brow grand councillors were banished without crime.',
    idiomatic: 'innocent ministers were banished.',
  },
  s0689: {
    literal: 'Thus weapons spread over the wilds, locusts and drought for years; the Buddha\'s bone had just entered Ying Gate when the imperial carriage already wept on the blue wilds—retribution not inevitable, is this not the proof!',
    idiomatic: 'Arms and drought spread; the Buddha\'s relic had barely arrived when the Emperor died—was this not proof?',
  },
  s0690: {
    literal: 'Earth\'s virtue declined; calamity\'s ladder began here.',
    idiomatic: 'Earth\'s virtue declined from here.',
  },
  s0691: {
    literal: 'Though there were successors like Wen and Jing in brilliance, it was hard to revive.',
    idiomatic: 'Even Wen and Jing could not have revived the dynasty.',
  },
  s0692: {
    literal: 'From this the sacred jade was not flourishing—fitting indeed.',
    idiomatic: 'The sacred jade would not flourish again—fittingly so.',
  },
  s0693: {
    literal: 'Gray-haired survivors speak with tears streaming.',
    idiomatic: 'Gray-haired survivors weep remembering it.',
  },
  s0694: {
    literal: 'Praise says: The state\'s order and disorder lie in the ruler\'s hearing and deciding.',
    idiomatic: 'Praise: order and disorder lie in the ruler\'s ear.',
  },
  s0695: {
    literal: 'Gonghui was arrogant and extravagant; the worthy were demoted and banished.',
    idiomatic: 'Yizong was arrogant; the worthy were banished.',
  },
  s0696: {
    literal: 'Villains held the state; slanderers filled the court.',
    idiomatic: 'Villains held the state; slanderers filled court.',
  },
  s0697: {
    literal: 'Traitors seized the opportunity; bequeathed plans vanished.',
    idiomatic: 'Traitors seized their chance; good plans vanished.',
  },
  s0698: {
    literal: 'Emperor Xizong, posthumous name Kind Sage Respectful and Settled in Filial Piety, taboo Xuan, was Yizong\'s fifth son; his mother was Empress Hui\'an Wang.',
    idiomatic: 'Xizong—taboo Xuan—was Yizong\'s fifth son, born of Empress Hui\'an Wang.',
  },
  s0699: {
    literal: 'On the eighth day of the fifth month he was born in the Eastern Inner Palace.',
    idiomatic: 'He was born in the Eastern Inner Palace on the eighth of the fifth month.',
  },
  s0700: {
    literal: 'At first enfeoffed Prince of Pu, name Yan.',
    idiomatic: 'He was first Prince of Pu, born Yan.',
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
if (data.metadata.chapter !== '019') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 019; standalone T ready (${Object.keys(T).length} entries).`
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
