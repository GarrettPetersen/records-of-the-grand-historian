#!/usr/bin/env node
/** Batch 8: s0701–s0755 (Jiutangshu ch.030, Rites 6) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/030.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 701;
const END = 755;

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
  s0701: {
    literal: 'Wei Wu\'s paper states in agreement: in the he year the Offering Ancestor is seated east-facing; when performing di rites, the Grand Ancestor again takes his mat in the west.',
    idiomatic: 'Wei Wu\'s paper agrees: in the he year the Offering Ancestor sits east-facing; performing di rites, the Grand Ancestor again takes his mat in the west.',
  },
  s0702: {
    literal: 'Respectfully, according to ritual classics and former scholars\' explanations, restoring the Grand Ancestor\'s seat—the seat once corrected, the meaning admits no doubt.',
    idiomatic: 'Respectfully according to ritual classics and former scholars\' explanations, restoring the Grand Ancestor\'s seat—the seat once corrected, the meaning admits no doubt.',
  },
  s0703: {
    literal: 'After the Grand Ancestor\'s seat is corrected, the Majestic and Offering tablets ought to have a destination.',
    idiomatic: 'Once the Grand Ancestor\'s seat is corrected, the Majestic and Offering tablets should have a destination.',
  },
  s0704: {
    literal: 'On examining the fourteen papers in detail, their intent has four points: first, store in side chambers; second, place in separate temples; third, move to the garden mausoleum; fourth, enshrine in Xingsheng.',
    idiomatic: 'Examining the fourteen papers in detail, their intent has four points: first, store in side chambers; second, place in separate temples; third, move to the garden mausoleum; fourth, enshrine in Xingsheng.',
  },
  s0705: {
    literal: 'To store in side chambers signifies there is no occasion for offering sacrifices, differing from Zhou people\'s storing in the two distant temples—rites cannot be enacted.',
    idiomatic: 'Storing in side chambers means no term for offering sacrifices, differing from Zhou people\'s storing in the two distant temples—rites cannot be enacted.',
  },
  s0706: {
    literal: 'To place in separate temples had its start in Emperor Ming of Wei\'s doctrine and is truly not text of the Ritual Classics.',
    idiomatic: 'Placing in separate temples began with Emperor Ming of Wei\'s doctrine and is truly not text of the Ritual Classics.',
  },
  s0707: {
    literal: 'In the ninth year of Yixi of Jin, though this doctrine was established, afterward none thereafter enacted it it.',
    idiomatic: 'In the ninth year of Yixi of Jin, though this meaning was established, afterward none practiced it.',
  },
  s0708: {
    literal: 'To move to the garden mausoleum disorders ancestral-temple ceremony, has nothing to rely on, greatly violates canonical intent, cannot serve as evidence.',
    idiomatic: 'Moving to the garden mausoleum disorders ancestral-temple ceremony, has nothing to rely on, greatly violates canonical intent, insufficient as evidence.',
  },
  s0709: {
    literal: 'Only enshrining in the Xingsheng Temple, with one offering in di and he sacrifices years—perhaps rites lost to ritual, obtaining the correctness of change."',
    idiomatic: 'Only enshrining in the Xingsheng Temple, with one offering in di and he years—perhaps rites lost to ritual, obtaining the correctness of change."',
  },
  s0710: {
    literal: 'In the third month of the nineteenth year, Attendant Chen Jing presented a memorial: "Di is the great union sacrifice of ancestors; the Grand Ancestor\'s seat must be honored to correct zhao and mu.',
    idiomatic: 'In the third month of the nineteenth year, Attendant Chen Jing memorialized: "Di is the great union sacrifice of ancestors; the Grand Ancestor\'s seat must be honored to correct zhao and mu.',
  },
  s0711: {
    literal: 'this year encountering di, we fear it must be fixed to rites deliberated hitherto.',
    idiomatic: 'This year encountering di, we fear it must be fixed to rites deliberated hitherto.',
  },
  s0712: {
    literal: '" An imperial edict: "Di and he rites are the greatest of sacrifices; there was prior multitude of deliberation still not refined—it is fitting to order the hundred officials to convene in deliberation and memorialize."',
    idiomatic: '" An edict: "Di and he rites are the greatest of sacrifices; there was prior multitude of deliberation still not refined—it is fitting to order the hundred officials to convene in deliberation and memorialize."',
  },
  s0713: {
    literal: '" At that time Left Vice Director Yao Nanzhong and others presented fifty-seven deliberation papers; an edict ordered entrusted them to the Directorate General to again gather the hundred officials, deliberate to settlement, and memorialize.',
    idiomatic: '" At that time Left Vice Director Yao Nanzhong and others submitted fifty-seven deliberation papers; an edict entrusted them to the Directorate General to again gather the hundred officials, deliberate to settlement, and memorialize.',
  },
  s0714: {
    literal: 'Minister of Revenue Wang Shao and fifty-five others memorialized: "We respectfully ask to move the Offering and Majestic ancestors\' spirit tablets to enshrine in the Deming and Xingsheng temples, and separately add two chambers to install the spirit tablets.',
    idiomatic: 'Minister of Revenue Wang Shao and fifty-five others memorialized: "We ask to move the Offering and Majestic ancestors\' spirit tablets to enshrine in the Deming and Xingsheng temples, and separately add two chambers to install the spirit tablets.',
  },
  s0715: {
    literal: 'Because di sacrifice falls on the twenty-fourth day and temple repair is not complete, we ask within the walls of the Deming and Xingsheng temples temporarily to set curtain halls as two chambers and temporarily install the spirit tablets.',
    idiomatic: 'Because di sacrifice is on the twenty-fourth day and temple repair is not complete, we ask within the walls of the Deming and Xingsheng temples temporarily to set curtain halls as two chambers and temporarily install the spirit tablets.',
  },
  s0716: {
    literal: 'When the added temple chambers are complete, according to rites move and enshrine the spirit tablets into the new temples.',
    idiomatic: 'When added temple chambers are complete, according to rites move and enshrine the spirit tablets into the new temples.',
  },
  s0717: {
    literal: 'Each di and he sacrifices year, perform feasting rites in their respective chambers.',
    idiomatic: 'Each di and he year, perform feasting rites in their respective chambers.',
  },
  s0718: {
    literal: '" The court approved.',
    idiomatic: '" It was followed.',
  },
  s0719: {
    literal: 'On the fifteenth day of that month, the Offering and Majestic ancestors\' spirit tablets were transferred to temporarily enshrine in the curtain halls of the Deming and Xingsheng temples.',
    idiomatic: 'On the fifteenth day of that month, the Offering and Majestic ancestors\' spirit tablets were moved to temporarily enshrine in the curtain halls of the Deming and Xingsheng temples.',
  },
  s0720: {
    literal: 'On the twenty-fourth day, the Grand Temple received the communal feast.',
    idiomatic: 'On the twenty-fourth day, the Grand Temple was feasted.',
  },
  s0721: {
    literal: 'Thereupon the Jing Emperor began to hold east-facing honor; from the Yuan Emperor downward they followed the left-zhao right-mu array.',
    idiomatic: 'From this the Jing Emperor began to hold east-facing honor; from the Yuan Emperor downward they followed the left-zhao right-mu array.',
  },
  s0722: {
    literal: 'When the two ancestors\' new temples were complete, an edict: "Respectfully move the Offering and Majestic ancestors\' spirit tablets, correct the Jing Emperor Grand Ancestor\'s seat—the reverent announcement rite should be ordered entrusted to weighty ministers.',
    idiomatic: 'When the two ancestors\' new temples were complete, an edict: "Respectfully move the Offering and Majestic ancestors\' spirit tablets, correct the Jing Emperor Grand Ancestor\'s seat—the reverent announcement rite should be entrusted to weighty ministers.',
  },
  s0723: {
    literal: 'It is appropriate to order Acting Commissioner-in-Chief and Associate Commissioner Du You to act as Grand Marshal and announce to the Grand Pure Palace;',
    idiomatic: 'It is fitting to order Acting Commissioner-in-Chief and Associate Commissioner Du You to act as Grand Marshal and announce to the Grand Pure Palace;',
  },
  s0724: {
    literal: 'Vice Director of the Secretariat and Associate Commissioner Cui Sun is to act as Grand Marshal and announce to the Grand Temple."',
    idiomatic: 'Vice Director of the Secretariat and Associate Commissioner Cui Sun to act as Grand Marshal and announce to the Grand Temple."',
  },
  s0725: {
    literal: 'Again, an edict: "The state\'s great affairs rest in bright sacrifice.',
    idiomatic: 'Again an edict: "The state\'s great affairs rest in bright sacrifice.',
  },
  s0726: {
    literal: 'The Son of Heaven\'s filial feasting weighs nothing above di sacrifice, thereby to honor ancestors and correct zhao and mu.',
    idiomatic: 'The Son of Heaven\'s filial feasting weighs nothing above di sacrifice, thereby honoring ancestors and correcting zhao and mu.',
  },
  s0727: {
    literal: 'We receive and inherit the accumulated virtue of successive sages and bear Heaven\'s favoring Mandate, reverently offering victims and silks for twenty-five years.',
    idiomatic: 'We inherit the accumulated virtue of successive sages and bear Heaven\'s favoring Mandate, reverently offering victims and silks for twenty-five years.',
  },
  s0728: {
    literal: 'Constantly reflecting on ancestral temples\' places and the order of di and seasonal offerings, day and night reverent and fearful, not daring to act alone.',
    idiomatic: 'Ever reflecting on ancestral temples\' places and the order of di and seasonal offerings, day and night reverent and fearful, not daring to act alone.',
  },
  s0729: {
    literal: 'Therefore we broadly extended inquiry to dukes and ministers, examined ancient rites, broadly consulted the multitude of deliberations, even to a third time.',
    idiomatic: 'Therefore we extended inquiry to dukes and ministers, examined ancient rites, broadly consulted the multitude of deliberations, even to a third time.',
  },
  s0730: {
    literal: 'On this day we respectfully we move the Offering Ancestor Emperor Xuan\'s spirit tablet and the Majestic Ancestor Emperor Guang\'s spirit tablet to enshrine in the Deming and Xingsheng emperors\' temples.',
    idiomatic: 'Respectfully on this day we move the Offering Ancestor Emperor Xuan\'s spirit tablet and the Majestic Ancestor Emperor Guang\'s spirit tablet to enshrine in the Deming and Xingsheng emperors\' temples.',
  },
  s0731: {
    literal: 'The Grand Ancestor Jing Emperor is placed in the correct east-facing seat.',
    idiomatic: 'The Grand Ancestor Jing Emperor takes the correct east-facing seat.',
  },
  s0732: {
    literal: 'It is appropriate to order the relevant offices to follow rites, striving for utmost refinement, reverently performing the sacrificial canon, bearing deep reverent fear.',
    idiomatic: 'It is fitting to order the relevant offices to follow rites, striving for utmost refinement, reverently performing the sacrificial canon, bearing deep reverent fear.',
  },
  s0733: {
    literal: 'Proclaim to all within and without within and without—let all know Our heart."',
    idiomatic: 'Inform all within and without—let all know Our heart."',
  },
  s0734: {
    literal: 'In the tenth month of the sixth year of Huichang, the Court of Imperial Sacrifices Ritual Institute memorialized: "In di and he sacrifices prayer texts the titles of Emperor Muzong, Empress Dowager Wei of Xuande, Emperor Jingzong, Emperor Wenzong, and Emperor Wuzong—because of prior ordering by kin closeness, the Muzong chamber was called \'elder brother,\' not fitting ritual text.',
    idiomatic: 'In the tenth month of the sixth year of Huichang, the Court of Imperial Sacrifices Ritual Institute memorialized: "In di and he prayer texts the titles of Emperor Muzong, Empress Dowager Wei of Xuande, Emperor Jingzong, Emperor Wenzong, and Emperor Wuzong—because of prior ordering by kin closeness, the Muzong chamber was called \'elder brother,\' not fitting ritual text.',
  },
  s0735: {
    literal: 'The drafting officials Zhu Chou and others stated: \'Rites order honoring the honored, not ordering by kin closeness.',
    idiomatic: 'The drafting officials Zhu Chou and others stated: \'Rites order honoring the honored, not ordering kin closeness.',
  },
  s0736: {
    literal: 'Your Majesty\'s prayer texts for the three chambers of Muzong, Jingzong, and Wuzong—we fear they should only read "the succeeding emperor your subject so-and-so announces to such-and-such ancestor."',
    idiomatic: 'Your Majesty\'s prayer texts for the three chambers of Muzong, Jingzong, and Wuzong—we fear they should only say "the succeeding emperor your subject so-and-so announces to such-and-such ancestor."',
  },
  s0737: {
    literal: '\' Your subjects jointly examined ritual classics—in meaning acceptable."',
    idiomatic: '\' Your subjects together examined ritual classics—in meaning acceptable."',
  },
  s0738: {
    literal: 'The court approved.',
    idiomatic: 'It was followed.',
  },
  s0739: {
    literal: 'In the twelfth year of Zhenyuan of Zhenyuan, he sacrifice at the Grand Temple.',
    idiomatic: 'In the twelfth year of Zhenyuan, he sacrifice at the Grand Temple.',
  },
  s0740: {
    literal: 'Recent precedent: at he sacrifice and the Son of Heaven\'s personal suburban worship, one palace envoy was always ordered to lead the vanquished-state treasure to the altar place, thereby displaying martial achievement.',
    idiomatic: 'Recent precedent: at he sacrifice and the emperor\'s personal suburban worship, one palace envoy was always ordered to lead the vanquished-state treasure to the altar place, thereby displaying martial achievement.',
  },
  s0741: {
    literal: 'On this occasion, because vanquishing the state was a great affair, having a palace envoy lead it was not fitting; therefore one ritual official was ordered to supervise taking it from the inner treasury to the Grand Temple.',
    idiomatic: 'On this occasion, because vanquishing the state was a great affair, having a palace envoy lead it was not fitting; therefore one ritual official was ordered to supervise receipt from the inner treasury to the Grand Temple.',
  },
  s0742: {
    literal: 'The old ceremony: in Gaozu\'s temple, Acting Honorable General of the Palace Gate with Equal Third Rank Prince Huai\'an of the Huai state Wang Tong, Minister of Rites Prince Hejian of the He state Wang Xiaogong, Grand Marshal of the Shandong Circuit with Right Vice Director of the Secretariat Duke of E of E state Yin Kaishan, and Minister of Personnel Duke of Yu of Yu state Liu Zhenghui received associated feasting.',
    idiomatic: 'Old ceremony: in Gaozu\'s temple, Acting Honorable General of the Palace Gate with Equal Third Rank Prince Huai\'an of the Huai state Wang Tong, Minister of Rites Prince Hejian of the He state Wang Xiaogong, Grand Marshal of the Shandong Circuit with Right Vice Director of the Secretariat Duke of E of E state Yin Kaishan, and Minister of Personnel Duke of Yu of Yu state Liu Zhenghui were associated in feasting.',
  },
  s0743: {
    literal: 'In Taizong\'s temple, Commissioner-in-Chief Duke of Liang of Liang state Fang Xuanling, Right Vice Director of the Secretariat Duke of Lai of Lai state Du Ruhui, and Left Vice Director of the Secretariat Duke of Shen of Shen state Gao Shilian received associated feasting.',
    idiomatic: 'In Taizong\'s temple, Commissioner-in-Chief Duke of Liang of Liang state Fang Xuanling, Right Vice Director of the Secretariat Duke of Lai of Lai state Du Ruhui, and Left Vice Director of the Secretariat Duke of Shen of Shen state Gao Shilian were associated in feasting.',
  },
  s0744: {
    literal: 'In Gaozong\'s temple, Commissioner-in-Chief Duke of Ying of Ying state Li Ji, Left Vice Director of the Secretariat Duke of Beiping of Beiping county Zhang Xingcheng, and Director of the Secretariat Duke of Gaotang of Gaotang county Ma Zhou received associated feasting.',
    idiomatic: 'In Gaozong\'s temple, Commissioner-in-Chief Duke of Ying of Ying state Li Ji, Left Vice Director of the Secretariat Duke of Beiping of Beiping county Zhang Xingcheng, and Director of the Secretariat Duke of Gaotang of Gaotang county Ma Zhou were associated in feasting.',
  },
  s0745: {
    literal: 'In Zhongzong\'s temple, Attendant Prince Jinghui of Pingyang commandery, Attendant Prince Fuyang of Fuyang commandery Huan Yanfan, and Director of the Secretariat Prince Nanyang of Nanyang commandery Yuan Shuji received associated feasting.',
    idiomatic: 'In Zhongzong\'s temple, Attendant Prince Jinghui of Pingyang commandery, Attendant Prince Fuyang of Fuyang commandery Huan Yanfan, and Director of the Secretariat Prince Nanyang of Nanyang commandery Yuan Shuji were associated in feasting.',
  },
  s0746: {
    literal: 'In Ruizong\'s temple, Grand Tutor Duke of Xu of Xu state Su Gui and Left Chancellor Duke of Xu of Xu state Liu Youqiu received associated feasting.',
    idiomatic: 'In Ruizong\'s temple, Grand Tutor Duke of Xu of Xu state Su Gui and Left Chancellor Duke of Xu of Xu state Liu Youqiu were associated in feasting.',
  },
  s0747: {
    literal: 'In the first month of the sixth year of Tianbao, an edict: Crown Princes Zhanghuai, Jiemin, Huizhuang, Huiwen, and Huixuan in the capital, together with the Hidden Crown Prince and the Virtuous Consort Crown Prince, are joined as one temple, called the Seven Crown Princes\' Temple, for convenience in sacrifice.',
    idiomatic: 'In the first month of the sixth year of Tianbao, an edict: Crown Princes Zhanghuai, Jiemin, Huizhuang, Huiwen, and Huixuan in the capital, together with the Hidden Crown Prince and the Virtuous Consort Crown Prince, form one temple, called the Seven Crown Princes\' Temple, for convenience in sacrifice.',
  },
  s0748: {
    literal: 'As to meritorious ministers associated in feasting at the Grand Temple: to Gaozu\'s chamber added Pei Ji and Liu Wenjing; to Taizong\'s chamber added Zhangsun Wuji, Li Jing, and Du Ruhui; to Gaozong\'s chamber added Chu Suiliang, Gao Jifu, and Liu Rengui; to Zhongzong\'s chamber added Di Renjie, Wei Yuanzhong, Wang Tongjiao, and eleven others.',
    idiomatic: 'Meritorious ministers associated in feasting at the Grand Temple: to Gaozu\'s chamber added Pei Ji and Liu Wenjing; to Taizong\'s chamber added Zhangsun Wuji, Li Jing, and Du Ruhui; to Gaozong\'s chamber added Chu Suiliang, Gao Jifu, and Liu Rengui; to Zhongzong\'s chamber added Di Renjie, Wei Yuanzhong, Wang Tongjiao, and eleven others.',
  },
  s0749: {
    literal: 'In great sacrifices, red calves were reduced in number.',
    idiomatic: 'At great sacrifices, red calves were reduced in number.',
  },
  s0750: {
    literal: 'In the tenth year, inner-palace officials were established at the Grand Temple.',
    idiomatic: 'In the tenth year, inner-palace officials were installed at the Grand Temple.',
  },
  s0751: {
    literal: 'In the intercalary third month of the eleventh year, a statute: "Henceforth, on each new and full moon day, it is appropriate to order the Imperial Kitchen to prepare food and offer to the Grand Temple, one tooth-tray per chamber, with inner-palace officials presenting the offering.',
    idiomatic: 'In the intercalary third month of the eleventh year, a statute: "From now on, on each new and full moon day, it is fitting to order the Imperial Kitchen to prepare food and offer to the Grand Temple, one tooth-tray per chamber, with inner-palace officials feasting the offering.',
  },
  s0752: {
    literal: 'Still, every five days the chamber doors are to be opened for sprinkling and sweeping."',
    idiomatic: 'Still, every five days open the chamber doors for sprinkling and sweeping."',
  },
  s0753: {
    literal: 'Afterward there there were also temples for Emperor Xuanzong\'s son the Jingde Crown Prince and Emperor Suzong\'s son the Gongyi Crown Prince.',
    idiomatic: 'Afterward there were also temples for Emperor Xuanzong\'s son the Jingde Crown Prince and Emperor Suzong\'s son the Gongyi Crown Prince.',
  },
  s0754: {
    literal: 'The Xiaojing Temple was within the Eastern Capital the Grand Temple compound; the temples of Empress Zhenshun and the Yielding Emperor were in the capital.',
    idiomatic: 'The Xiaojing Temple was within the Eastern Capital Grand Temple compound; the temples of Empress Zhenshun and the Yielding Emperor were in the capital.',
  },
  s0755: {
    literal: 'The remainder all had offerings at the four seasons.',
    idiomatic: 'The rest all received seasonal offerings at the four seasons.',
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
