/** Jiutangshu ch.033 batch 8: s0701–s0800 (Mars prior slow/station/retrograde/later station/slow/fast motion tables) */
import { readFileSync, writeFileSync } from 'fs';

const chapterPath = 'data/jiutangshu/033.json';
const targetPath = 'translations/current_translation_jiutangshu.json';

const translations = {
  s0701: {
    literal: 'What does not reach full, all adjust to minor parts.',
    idiomatic: 'Any remainder that does not amount to a full unit is adjusted into minor parts.',
  },
  s0702: {
    literal: 'At junctures of slow and fast, motion-part decay and diminish are not considered.',
    idiomatic: 'At transitions between slow and fast motion, decay and diminish of motion parts are not counted.',
  },
  s0703: {
    literal: 'Where the difference is large, calculate by this method.',
    idiomatic: 'Where the discrepancy is large, compute by this procedure.',
  },
  s0704: {
    literal: 'If the difference is not large, each follows the original method.',
    idiomatic: 'If the discrepancy is slight, each case follows the base method.',
  },
  s0705: {
    literal: 'Prior slow: direct, differential motion, entering Winter Solstice, sixty days travels twenty-five degrees.',
    idiomatic: 'Prior slow motion: direct differential motion from the Winter Solstice—60 days for 25 degrees.',
  },
  s0706: {
    literal: 'Fast at first, daily increase.',
    idiomatic: 'Fast at first, with speed increasing daily.',
  },
  s0707: {
    literal: 'From entering Minor Cold afterward, every two slow two parts, daily diminish day and degree each by one.',
    idiomatic: 'From entering Minor Cold onward, every two days slow by two parts; diminish the day count and degree count each by one per day.',
  },
  s0708: {
    literal: 'Major Cold first day, fifty-five days travels twenty degrees.',
    idiomatic: 'At Major Cold on the first day: 55 days for 20 degrees.',
  },
  s0709: {
    literal: 'From then every three days increase day and degree each by one.',
    idiomatic: 'From then on, every three days increase the day count and degree count each by one.',
  },
  s0710: {
    literal: 'Start of Spring first day, mean.',
    idiomatic: 'At the Start of Spring on the first day, follow the mean rate.',
  },
  s0711: {
    literal: 'Through Clear Brightness, sixty days travels twenty-five degrees.',
    idiomatic: 'Through Clear Brightness: 60 days for 25 degrees.',
  },
  s0712: {
    literal: 'From Grain Rain qi, separately diminish one qi.',
    idiomatic: 'From the Grain Rain qi onward, subtract one degree per solar term.',
  },
  s0713: {
    literal: 'Start of Summer first day, mean.',
    idiomatic: 'At the Start of Summer on the first day, follow the mean rate.',
  },
  s0714: {
    literal: 'Through Minor Fullness, sixty days travels twenty-two degrees.',
    idiomatic: 'Through Minor Fullness: 60 days for 22 degrees.',
  },
  s0715: {
    literal: 'From entering Grain in Ear, separately increase one degree.',
    idiomatic: 'From entering Grain in Ear, add one degree per solar term.',
  },
  s0716: {
    literal: 'Summer Solstice first day, mean.',
    idiomatic: 'At the Summer Solstice on the first day, follow the mean rate.',
  },
  s0717: {
    literal: 'Through End of Heat, sixty days travels twenty-five degrees.',
    idiomatic: 'Through End of Heat: 60 days for 25 degrees.',
  },
  s0718: {
    literal: 'From entering White Dew afterward, every three days diminish one degree.',
    idiomatic: 'From entering White Dew onward, diminish one degree every three days.',
  },
  s0719: {
    literal: 'Autumn Equinox first day, sixty days travels twenty-five degrees.',
    idiomatic: 'At the Autumn Equinox on the first day: 60 days for 25 degrees.',
  },
  s0720: {
    literal: 'From then every one day increase one, every one and a half days increase one degree.',
    idiomatic: 'From then on, add one to the day count each day and one to the degree count every day and a half.',
  },
  s0721: {
    literal: 'Cold Dew first day, sixty days travels twenty-five degrees.',
    idiomatic: 'At Cold Dew on the first day: 60 days for 25 degrees.',
  },
  s0722: {
    literal: 'From then every two days diminish one degree.',
    idiomatic: 'From then on, diminish one degree every two days.',
  },
  s0723: {
    literal: 'Start of Winter one day, mean.',
    idiomatic: 'One day into the Start of Winter, follow the mean rate.',
  },
  s0724: {
    literal: 'Through qi, sixty days travels seventeen degrees.',
    idiomatic: 'Through the end of the qi period: 60 days for 17 degrees.',
  },
  s0725: {
    literal: 'From Major Snow afterward, every five days increase one degree.',
    idiomatic: 'From Major Snow onward, add one degree every five days.',
  },
  s0726: {
    literal: 'Major Snow first day, sixty days travels twenty degrees.',
    idiomatic: 'At Major Snow on the first day: 60 days for 20 degrees.',
  },
  s0727: {
    literal: 'From then every three days increase one degree.',
    idiomatic: 'From then on, add one degree every three days.',
  },
  s0728: {
    literal: 'Prior station: thirteen days.',
    idiomatic: 'Prior station: 13 days.',
  },
  s0729: {
    literal: 'If prior fast diminished day-rate by one degree, use that number of parts to increase this station and later slow day-rate.',
    idiomatic: 'If the prior fast phase diminished the day-rate by one, distribute that amount in parts to increase this station and the later slow day-rate.',
  },
  s0730: {
    literal: 'If prior fast added to day-rate, use that number of parts to diminish slow day-rate.',
    idiomatic: 'If the prior fast phase added to the day-rate, distribute that amount in parts to diminish the slow day-rate.',
  },
  s0731: {
    literal: 'Then revolving retreat, westward motion.',
    idiomatic: 'Then revolving retreat, moving westward.',
  },
  s0732: {
    literal: 'Entering Winter Solstice first day, sixty-three days retreats twenty-one degrees.',
    idiomatic: 'On the first day of the Winter Solstice: 63 days retreating 21 degrees.',
  },
  s0733: {
    literal: 'From then every four days increase one degree.',
    idiomatic: 'From then on, add one degree every four days.',
  },
  s0734: {
    literal: 'Minor Cold one day, sixty-three days retreats twenty-six degrees.',
    idiomatic: 'One day into Minor Cold: 63 days retreating 26 degrees.',
  },
  s0735: {
    literal: 'From entering Minor Cold afterward, every three and a half days diminish one degree.',
    idiomatic: 'From entering Minor Cold onward, diminish one degree every three and a half days.',
  },
  s0736: {
    literal: 'Start of Spring three days, mean.',
    idiomatic: 'Three days into the Start of Spring, follow the mean rate.',
  },
  s0737: {
    literal: 'Through Awakening of Insects, sixty-two days retreats seventeen degrees.',
    idiomatic: 'Through Awakening of Insects: 62 days retreating 17 degrees.',
  },
  s0738: {
    literal: 'From entering Rain Water afterward, every two days increase day and degree each by one.',
    idiomatic: 'From entering Rain Water onward, every two days increase the day count and degree count each by one.',
  },
  s0739: {
    literal: 'Rain Water eight days, mean.',
    idiomatic: 'Eight days into Rain Water, follow the mean rate.',
  },
  s0740: {
    literal: 'Through qi exhausted, sixty-seven days retreats twenty-one degrees.',
    idiomatic: 'Through the end of the qi period: 67 days retreating 21 degrees.',
  },
  s0741: {
    literal: 'From entering Spring Equinox afterward, every one day diminish day and degree each by one.',
    idiomatic: 'From entering the Spring Equinox onward, every day diminish the day count and degree count each by one.',
  },
  s0742: {
    literal: 'Spring Equinox four days, mean.',
    idiomatic: 'Four days into the Spring Equinox, follow the mean rate.',
  },
  s0743: {
    literal: 'Through Grain in Ear, sixty-three days retreats seventy degrees.',
    idiomatic: 'Through Grain in Ear: 63 days retreating 70 degrees.',
  },
  s0744: {
    literal: 'From entering Summer Solstice afterward, every six days diminish day and degree each by one.',
    idiomatic: 'From entering the Summer Solstice onward, every six days diminish the day count and degree count each by one.',
  },
  s0745: {
    literal: 'Major Heat first day, mean.',
    idiomatic: 'At Major Heat on the first day, follow the mean rate.',
  },
  s0746: {
    literal: 'Through qi exhausted, fifty-eight days retreats twelve degrees.',
    idiomatic: 'Through the end of the qi period: 58 days retreating 12 degrees.',
  },
  s0747: {
    literal: 'Start of Autumn first day, mean.',
    idiomatic: 'At the Start of Autumn on the first day, follow the mean rate.',
  },
  s0748: {
    literal: 'Through qi exhausted, fifty-seven days retreats eleven degrees.',
    idiomatic: 'Through the end of the qi period: 57 days retreating 11 degrees.',
  },
  s0749: {
    literal: 'From entering White Dew afterward, every two days increase day and degree each by one.',
    idiomatic: 'From entering White Dew onward, every two days increase the day count and degree count each by one.',
  },
  s0750: {
    literal: 'White Dew twelve days, mean.',
    idiomatic: 'Twelve days into White Dew, follow the mean rate.',
  },
  s0751: {
    literal: 'Through Autumn Equinox, sixty-three days retreats seventy degrees.',
    idiomatic: 'Through the Autumn Equinox: 63 days retreating 70 degrees.',
  },
  s0752: {
    literal: 'From entering Cold Dew afterward, every three days increase day and degree each by one.',
    idiomatic: 'From entering Cold Dew onward, every three days increase the day count and degree count each by one.',
  },
  s0753: {
    literal: 'Cold Dew nine days, mean.',
    idiomatic: 'Nine days into Cold Dew, follow the mean rate.',
  },
  s0754: {
    literal: 'Through qi exhausted, sixty-six days retreats twenty degrees.',
    idiomatic: 'Through the end of the qi period: 66 days retreating 20 degrees.',
  },
  s0755: {
    literal: 'From entering Frost\'s Descent afterward, every three days diminish day and degree each by one.',
    idiomatic: 'From entering Frost\'s Descent onward, every three days diminish the day count and degree count each by one.',
  },
  s0756: {
    literal: 'Frost\'s Descent six days, mean.',
    idiomatic: 'Six days into Frost\'s Descent, follow the mean rate.',
  },
  s0757: {
    literal: 'Through qi exhausted, sixty-three days retreats seventeen degrees.',
    idiomatic: 'Through the end of the qi period: 63 days retreating 17 degrees.',
  },
  s0758: {
    literal: 'From Start of Winter afterward, every three days increase day and degree each by one.',
    idiomatic: 'From the Start of Winter onward, every three days increase the day count and degree count each by one.',
  },
  s0759: {
    literal: 'Start of Winter eleven days, mean.',
    idiomatic: 'Eleven days into the Start of Winter, follow the mean rate.',
  },
  s0760: {
    literal: 'Through qi exhausted, sixty-seven days retreats twenty-one degrees.',
    idiomatic: 'Through the end of the qi period: 67 days retreating 21 degrees.',
  },
  s0761: {
    literal: 'From entering Minor Snow afterward, every two days diminish day and degree each by one.',
    idiomatic: 'From entering Minor Snow onward, every two days diminish the day count and degree count each by one.',
  },
  s0762: {
    literal: 'Minor Snow eight days, mean.',
    idiomatic: 'Eight days into Minor Snow, follow the mean rate.',
  },
  s0763: {
    literal: 'Through qi exhausted, sixty-three days retreats seventeen degrees.',
    idiomatic: 'Through the end of the qi period: 63 days retreating 17 degrees.',
  },
  s0764: {
    literal: 'From entering Major Snow afterward, every three days increase one degree.',
    idiomatic: 'From entering Major Snow onward, add one degree every three days.',
  },
  s0765: {
    literal: 'Later station: Winter Solstice station thirteen days.',
    idiomatic: 'Later station: stationary for 13 days at the Winter Solstice.',
  },
  s0766: {
    literal: 'From then every two and a half days increase one day.',
    idiomatic: 'From then on, add one day every two and a half days.',
  },
  s0767: {
    literal: 'Major Cold first, mean, through qi exhausted, station twenty-five days.',
    idiomatic: 'From Major Cold on the first day at the mean rate through the end of the qi, stationary for 25 days.',
  },
  s0768: {
    literal: 'From entering Start of Spring afterward, every two and a half days diminish one.',
    idiomatic: 'From entering the Start of Spring onward, diminish one day every two and a half days.',
  },
  s0769: {
    literal: 'Rain Water first, station thirteen days.',
    idiomatic: 'At Rain Water on the first day, stationary for 13 days.',
  },
  s0770: {
    literal: 'From then every three days increase one day.',
    idiomatic: 'From then on, add one day every three days.',
  },
  s0771: {
    literal: 'Clear Brightness first, station twenty-three days.',
    idiomatic: 'At Clear Brightness on the first day, stationary for 23 days.',
  },
  s0772: {
    literal: 'From then every one day diminish one day.',
    idiomatic: 'From then on, diminish one day each day.',
  },
  s0773: {
    literal: 'Clear Brightness ten days, mean, through qi exhausted, station fifteen days.',
    idiomatic: 'Ten days into Clear Brightness at the mean rate through the end of the qi, stationary for 15 days.',
  },
  s0774: {
    literal: 'From entering White Dew afterward, every two days diminish one day and increase one day.',
    idiomatic: 'From entering White Dew onward, every two days diminish one day and increase one day.',
  },
  s0775: {
    literal: 'Autumn Equinox eleven days, no station.',
    idiomatic: 'Eleven days into the Autumn Equinox: no stationary period.',
  },
  s0776: {
    literal: 'From entering Autumn Equinox eleven days afterward, every one day increase one day.',
    idiomatic: 'From eleven days after the Autumn Equinox onward, add one day each day.',
  },
  s0777: {
    literal: 'Frost\'s Descent first day, station nineteen days.',
    idiomatic: 'At Frost\'s Descent on the first day, stationary for 19 days.',
  },
  s0778: {
    literal: 'From then every three days diminish one day.',
    idiomatic: 'From then on, diminish one day every three days.',
  },
  s0779: {
    literal: 'Start of Winter three days, mean, through Major Snow, station thirteen days.',
    idiomatic: 'Three days into the Start of Winter at the mean rate through Major Snow, stationary for 13 days.',
  },
  s0780: {
    literal: 'Later slow: direct, differential motion sixty days travels twenty-five degrees.',
    idiomatic: 'Later slow motion: direct differential motion—60 days for 25 degrees.',
  },
  s0781: {
    literal: 'Fast at first, daily increase speed two parts.',
    idiomatic: 'Fast at first, with speed increasing by two parts per day.',
  },
  s0782: {
    literal: 'If prior or later fast added degrees, this slow according to the number diminish them as fixed degrees;',
    idiomatic: 'If the prior or later fast phase added degrees, subtract that amount in this slow phase to obtain the fixed degrees;',
  },
  s0783: {
    literal: 'If prior fast added no degrees, this slow entering Autumn Equinox through Start of Winter diminishes three degrees, entering Winter Solstice diminishes five degrees; if later station fixed days shortfall thirteen days, use the shortfall day-count to add to this slow day-rate.',
    idiomatic: 'If the prior fast phase added no degrees, subtract 3 degrees from this slow phase between the Autumn Equinox and the Start of Winter, and 5 degrees entering the Winter Solstice; if the later stationary fixed days fall short by 13, add the shortfall in days to this slow day-rate.',
  },
  s0784: {
    literal: 'Later fast: Winter Solstice first day, rate two hundred eleven days travels one hundred thirty-one degrees.',
    idiomatic: 'Later fast motion: at the Winter Solstice on the first day, rate 211 days for 131 degrees.',
  },
  s0785: {
    literal: 'From then every one day diminish day and degree each by one.',
    idiomatic: 'From then on, every day diminish the day count and degree count each by one.',
  },
  s0786: {
    literal: 'Major Cold eight days, one hundred seventy-two days travels ninety-four degrees.',
    idiomatic: 'Eight days into Major Cold: 172 days for 94 degrees.',
  },
  s0787: {
    literal: 'From entering Major Cold eight days afterward, every one day diminish day and degree each by one.',
    idiomatic: 'From eight days after entering Major Cold onward, every day diminish the day count and degree count each by one.',
  },
  s0788: {
    literal: 'Awakening of Insects, mean.',
    idiomatic: 'At Awakening of Insects, follow the mean rate.',
  },
  s0789: {
    literal: 'Through qi exhausted, one hundred sixty-one days travels eighty-three degrees.',
    idiomatic: 'Through the end of the qi period: 161 days for 83 degrees.',
  },
  s0790: {
    literal: 'From entering Rain Water afterward, every three days increase day and degree each by one.',
    idiomatic: 'From entering Rain Water onward, every three days increase the day count and degree count each by one.',
  },
  s0791: {
    literal: 'Grain Rain three days, one hundred seventy-seven days travels ninety-nine degrees.',
    idiomatic: 'Three days into Grain Rain: 177 days for 99 degrees.',
  },
  s0792: {
    literal: 'From entering Grain Rain afterward, every three days increase day and degree each by one.',
    idiomatic: 'From entering Grain Rain onward, every three days increase the day count and degree count each by one.',
  },
  s0793: {
    literal: 'Grain in Ear fourteen days, mean.',
    idiomatic: 'Fourteen days into Grain in Ear, follow the mean rate.',
  },
  s0794: {
    literal: 'Through Summer Solstice, two hundred thirty-three days travels one hundred fifty degrees.',
    idiomatic: 'Through the Summer Solstice: 233 days for 150 degrees.',
  },
  s0795: {
    literal: 'From entering Summer Solstice afterward, every ten days increase day and degree each by one.',
    idiomatic: 'From entering the Summer Solstice onward, every ten days increase the day count and degree count each by one.',
  },
  s0796: {
    literal: 'Minor Heat five days, two hundred fifty-three days travels one hundred seventy-five degrees.',
    idiomatic: 'Five days into Minor Heat: 253 days for 175 degrees.',
  },
  s0797: {
    literal: 'From entering Minor Heat afterward, every five days increase day and degree each by one.',
    idiomatic: 'From entering Minor Heat onward, every five days increase the day count and degree count each by one.',
  },
  s0798: {
    literal: 'Major Heat first day, mean, through End of Heat, two hundred sixty-three days travels one hundred eighty-five degrees.',
    idiomatic: 'From Major Heat on the first day at the mean rate through End of Heat: 263 days for 185 degrees.',
  },
  s0799: {
    literal: 'From entering White Dew afterward, every two days diminish day and degree each by one.',
    idiomatic: 'From entering White Dew onward, every two days diminish the day count and degree count each by one.',
  },
  s0800: {
    literal: 'Autumn Equinox one day, two hundred fifty-five days travels one hundred seventy-seven degrees.',
    idiomatic: 'One day into the Autumn Equinox: 255 days for 177 degrees.',
  },
};

function extractBatch(chapter, startNum, endNum) {
  const ids = new Set();
  for (let i = startNum; i <= endNum; i++) {
    ids.add(`s${String(i).padStart(4, '0')}`);
  }
  const sentences = [];
  for (let blockIndex = 0; blockIndex < chapter.content.length; blockIndex++) {
    const block = chapter.content[blockIndex];
    if (block.type !== 'paragraph') continue;
    for (const s of block.sentences || []) {
      if (!ids.has(s.id)) continue;
      sentences.push({
        id: s.id,
        originalId: s.id,
        blockIndex,
        chinese: s.zh,
        literal: '',
        idiomatic: '',
      });
    }
  }
  sentences.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  return sentences;
}

const chapter = JSON.parse(readFileSync(chapterPath, 'utf8'));
const sentences = extractBatch(chapter, 701, 800);

if (sentences.length !== 100) {
  console.error(`Expected 100 extracted sentences, got ${sentences.length}`);
  process.exit(1);
}

let applied = 0;
for (const s of sentences) {
  const t = translations[s.id];
  if (!t) {
    console.error(`Missing translation entry for ${s.id}`);
    process.exit(1);
  }
  s.literal = t.literal;
  s.idiomatic = t.idiomatic;
  applied++;
}

const missing = sentences.filter((s) => !s.literal?.trim() || !s.idiomatic?.trim());
if (missing.length) {
  console.error(`Missing translations: ${missing.map((s) => s.id).join(', ')}`);
  process.exit(1);
}

if (applied !== 100) {
  console.error(`Expected 100 translations, applied ${applied}`);
  process.exit(1);
}

const data = {
  metadata: {
    book: chapter.meta.book,
    chapter: chapter.meta.chapter,
    file: chapterPath,
  },
  sentences,
};

writeFileSync(targetPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Applied ${applied} translations to ${targetPath}`);
console.log('All 100 sentences (s0701–s0800) filled and verified.');
