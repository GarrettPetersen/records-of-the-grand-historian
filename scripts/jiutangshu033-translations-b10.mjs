/** Jiutangshu ch.033 batch 10: s0901–s1000 (calendar history tail, Linde Calendar constants) */
import { readFileSync, writeFileSync } from 'fs';

const chapterPath = 'data/jiutangshu/033.json';
const targetPath = 'translations/current_translation_jiutangshu.json';

const translations = {
  s0901: {
    literal: '" Thereupon edict ordered Shuo with Calendar Officer Xu Baoyi and Nangong Jiyou, further revise Yisi Origin Calendar.',
    idiomatic: '" Thereupon an edict ordered Shuo, together with Calendar Commissioner Xu Baoyi and Nangong Jiyou, to further revise the Yisi Origin Calendar.',
  },
  s0902: {
    literal: 'To Jinglong within, calendar completed, edict ordered adopt use.',
    idiomatic: 'By the Jinglong era the calendar was completed, and an edict ordered its adoption.',
  },
  s0903: {
    literal: 'Soon Ruizong ascended throne, Jinglong Calendar set aside abandoned not used.',
    idiomatic: 'Soon afterward Emperor Ruizong acceded to the throne, and the Jinglong Calendar was set aside and not used.',
  },
  s0904: {
    literal: 'Linde Calendar Canon, now briefly record its method great outline.',
    idiomatic: 'The Linde Calendar Canon is here briefly recorded in the main outlines of its method.',
  },
  s0905: {
    literal: 'Mother divisor one hundred.',
    idiomatic: 'Mother divisor: 100.',
  },
  s0906: {
    literal: 'Two Dayan numbers serve as mother divisor.',
    idiomatic: 'Twice the Dayan number serves as the mother divisor.',
  },
  s0907: {
    literal: 'Ten-day cycle sixty.',
    idiomatic: 'Ten-day cycle: 60.',
  },
  s0908: {
    literal: 'Six jia terminal number serves as ten-day cycle.',
    idiomatic: 'The terminal number of the six jia cycles serves as the ten-day cycle.',
  },
  s0909: {
    literal: 'Chronogram divisor eight double-hours;',
    idiomatic: 'Chronogram divisor: 8 double-hours;',
  },
  s0910: {
    literal: 'parts, thirty-three a little less than half.',
    idiomatic: 'parts, 33 and a little less than half.',
  },
  s0911: {
    literal: 'Using twelve chronogram count divide one hundred marks, obtain chronogram divisor.',
    idiomatic: 'Divide 100 marks by the twelve chronogram count to obtain the chronogram divisor.',
  },
  s0912: {
    literal: 'Period cycle three hundred sixty-five days;',
    idiomatic: 'Period cycle: 365 days;',
  },
  s0913: {
    literal: 'remainder, twenty-four;',
    idiomatic: 'remainder, 24;',
  },
  s0914: {
    literal: 'odd, forty-eight.',
    idiomatic: 'odd, 48.',
  },
  s0915: {
    literal: 'One period total days and remainder-odd numbers serve as period cycle.',
    idiomatic: 'The total days and remainder-and-odd numbers of one period serve as the period cycle.',
  },
  s0916: {
    literal: 'Qi divisor fifteen days;',
    idiomatic: 'Qi divisor: 15 days;',
  },
  s0917: {
    literal: 'remainder, twenty-one;',
    idiomatic: 'remainder, 21;',
  },
  s0918: {
    literal: 'odd, eighty-five a little less than half.',
    idiomatic: 'odd, 85 and a little less than half.',
  },
  s0919: {
    literal: 'Using twenty-four qi divide period cycle, obtain qi divisor.',
    idiomatic: 'Divide the period cycle by the twenty-four qi to obtain the qi divisor.',
  },
  s0920: {
    literal: 'Pentad divisor five days;',
    idiomatic: 'Pentad divisor: 5 days;',
  },
  s0921: {
    literal: 'remainder, seven;',
    idiomatic: 'remainder, 7;',
  },
  s0922: {
    literal: 'odd, twenty-eight;',
    idiomatic: 'odd, 28;',
  },
  s0923: {
    literal: 'minor parts, four.',
    idiomatic: 'minor parts, 4.',
  },
  s0924: {
    literal: 'Using seventy-two pentads divide period cycle, obtain pentad divisor.',
    idiomatic: 'Divide the period cycle by the seventy-two pentads to obtain the pentad divisor.',
  },
  s0925: {
    literal: 'Month divisor twenty-nine days;',
    idiomatic: 'Month divisor: 29 days;',
  },
  s0926: {
    literal: 'remainder, thirteen;',
    idiomatic: 'remainder, 13;',
  },
  s0927: {
    literal: 'Odd.',
    idiomatic: 'Odd parts.',
  },
  s0928: {
    literal: 'Serves as month divisor.',
    idiomatic: 'This serves as the month divisor.',
  },
  s0929: {
    literal: 'Day divisor: sun extends, moon extends distance; thus extend one conjunction-new-moon reach and remainder-odd serve as day divisor.',
    idiomatic: 'The day divisor is the interval to one new-moon conjunction and its remainder and odd parts, obtained from the sun\'s elongation and the moon\'s recession.',
  },
  s0930: {
    literal: 'Full-moon divisor fourteen days;',
    idiomatic: 'Full-moon divisor: 14 days;',
  },
  s0931: {
    literal: 'remainder, seventy-six;',
    idiomatic: 'remainder, 76;',
  },
  s0932: {
    literal: 'odd, fifty-three.',
    idiomatic: 'odd, 53.',
  },
  s0933: {
    literal: 'Thus serves as yin posterior limit.',
    idiomatic: 'This also serves as the yin posterior limit.',
  },
  s0934: {
    literal: 'Halve month divisor obtain full-moon divisor.',
    idiomatic: 'Halve the month divisor to obtain the full-moon divisor.',
  },
  s0935: {
    literal: 'Also is moon travels yin calendar, rear with new-full moon meets crossing limit.',
    idiomatic: 'It is also the limit after the moon, traveling the yin calendar, meets new and full moon crossings.',
  },
  s0936: {
    literal: 'Quarter-moon divisor seven days;',
    idiomatic: 'Quarter-moon divisor: 7 days;',
  },
  s0937: {
    literal: 'remainder, thirty-eight;',
    idiomatic: 'remainder, 38;',
  },
  s0938: {
    literal: 'odd, twenty-six half.',
    idiomatic: 'odd, 26 and a half.',
  },
  s0939: {
    literal: 'Quarter month divisor, obtain quarter-moon divisor.',
    idiomatic: 'Take one quarter of the month divisor to obtain the quarter-moon divisor.',
  },
  s0940: {
    literal: 'Intercalation difference ten days;',
    idiomatic: 'Intercalation difference: 10 days;',
  },
  s0941: {
    literal: 'remainder, eighty-seven;',
    idiomatic: 'remainder, 87;',
  },
  s0942: {
    literal: 'odd, seventy-six.',
    idiomatic: 'odd, 76.',
  },
  s0943: {
    literal: 'Month divisor remove period cycle, remainder obtain intercalation difference.',
    idiomatic: 'Cast month divisors out of the period cycle; the remainder is the intercalation difference.',
  },
  s0944: {
    literal: 'Submergence number ninety-one;',
    idiomatic: 'Submergence number: 91;',
  },
  s0945: {
    literal: 'remainder, thirty-one;',
    idiomatic: 'remainder, 31;',
  },
  s0946: {
    literal: 'odd, twelve.',
    idiomatic: 'odd, 12.',
  },
  s0947: {
    literal: 'Quarter divide period cycle, remainder quartered obtain submergence number.',
    idiomatic: 'Quarter the period cycle; the quartered remainder gives the submergence number.',
  },
  s0948: {
    literal: 'Submergence method one;',
    idiomatic: 'Submergence method: 1;',
  },
  s0949: {
    literal: 'remainder, thirty-one;',
    idiomatic: 'remainder, 31;',
  },
  s0950: {
    literal: 'odd, twelve.',
    idiomatic: 'odd, 12.',
  },
  s0951: {
    literal: 'Using ten-day cycle remove period cycle, remainder quartered, obtain submergence method.',
    idiomatic: 'Subtract the ten-day cycle from the period cycle and quarter the remainder to obtain the submergence method.',
  },
  s0952: {
    literal: 'Lunar circuit method twenty-seven days;',
    idiomatic: 'Lunar circuit method: 27 days;',
  },
  s0953: {
    literal: 'remainder, fifty-five;',
    idiomatic: 'remainder, 55;',
  },
  s0954: {
    literal: 'odd, forty-five;',
    idiomatic: 'odd, 45;',
  },
  s0955: {
    literal: 'minor parts, fifty-nine.',
    idiomatic: 'minor parts, 59.',
  },
  s0956: {
    literal: 'Moon travels fast-slow one circuit count, serves as lunar circuit method.',
    idiomatic: 'The count for the moon\'s fast-and-slow circuit of one cycle serves as the lunar circuit method.',
  },
  s0957: {
    literal: 'Lunar difference method one day;',
    idiomatic: 'Lunar difference method: 1 day;',
  },
  s0958: {
    literal: 'remainder, ninety-seven;',
    idiomatic: 'remainder, 97;',
  },
  s0959: {
    literal: 'odd, sixty;',
    idiomatic: 'odd, 60;',
  },
  s0960: {
    literal: 'minor parts, forty-one.',
    idiomatic: 'minor parts, 41.',
  },
  s0961: {
    literal: 'Using lunar circuit subtract month divisor, remainder obtain lunar difference.',
    idiomatic: 'Subtract the lunar circuit method from the month divisor; the remainder is the lunar difference.',
  },
  s0962: {
    literal: 'Circuit-of-heaven method three hundred sixty-five degrees;',
    idiomatic: 'Circuit-of-heaven method: 365 degrees;',
  },
  s0963: {
    literal: 'remainder, twenty-five;',
    idiomatic: 'remainder, 25;',
  },
  s0964: {
    literal: 'odd, seventy-one;',
    idiomatic: 'odd, 71;',
  },
  s0965: {
    literal: 'minor parts, thirteen.',
    idiomatic: 'minor parts, 13.',
  },
  s0966: {
    literal: 'Twenty-eight lodges total degree count, interstitial total count and remainder-odd, serve as circuit-of-heaven method.',
    idiomatic: 'The total degrees of the twenty-eight lodges, their total interstitial distances, and the remainder and odd parts serve as the circuit-of-heaven method.',
  },
  s0967: {
    literal: 'Nodal-cycle method twenty-seven days;',
    idiomatic: 'Nodal-cycle method: 27 days;',
  },
  s0968: {
    literal: 'remainder, twenty-one;',
    idiomatic: 'remainder, 21;',
  },
  s0969: {
    literal: 'odd, twenty-two;',
    idiomatic: 'odd, 22;',
  },
  s0970: {
    literal: 'minor parts, sixteen seven-parts.',
    idiomatic: 'minor parts, 16 and 7 parts.',
  },
  s0971: {
    literal: 'Sun travels yin-yang one circuit crossing at this day count, serves as nodal-cycle method.',
    idiomatic: 'The day count for the sun\'s circuit through yin and yang to one nodal crossing serves as the nodal-cycle method.',
  },
  s0972: {
    literal: 'Crossing-difference method two days;',
    idiomatic: 'Crossing-difference method: 2 days;',
  },
  s0973: {
    literal: 'remainder, thirty-one;',
    idiomatic: 'remainder, 31;',
  },
  s0974: {
    literal: 'odd, eighty-three;',
    idiomatic: 'odd, 83;',
  },
  s0975: {
    literal: 'minor parts, eighty-three parts.',
    idiomatic: 'minor parts, 83 parts.',
  },
  s0976: {
    literal: 'Using nodal-cycle method subtract month divisor, obtain crossing-difference method.',
    idiomatic: 'Subtract the nodal-cycle method from the month divisor to obtain the crossing-difference method.',
  },
  s0977: {
    literal: 'Mid-crossing method thirteen days;',
    idiomatic: 'Mid-crossing method: 13 days;',
  },
  s0978: {
    literal: 'remainder, sixty;',
    idiomatic: 'remainder, 60;',
  },
  s0979: {
    literal: 'odd, sixty-one;',
    idiomatic: 'odd, 61;',
  },
  s0980: {
    literal: 'minor parts, three half.',
    idiomatic: 'minor parts, 3 and a half.',
  },
  s0981: {
    literal: 'Halve nodal cycle, obtain mid-crossing method.',
    idiomatic: 'Halve the nodal cycle to obtain the mid-crossing method.',
  },
  s0982: {
    literal: 'Yang anterior limit twelve days;',
    idiomatic: 'Yang anterior limit: 12 days;',
  },
  s0983: {
    literal: 'remainder, forty-four;',
    idiomatic: 'remainder, 44;',
  },
  s0984: {
    literal: 'odd, sixty-nine;',
    idiomatic: 'odd, 69;',
  },
  s0985: {
    literal: 'minor parts, sixteen seven-parts.',
    idiomatic: 'minor parts, 16 and 7 parts.',
  },
  s0986: {
    literal: 'Moon travels yang calendar, with new-full moon meets limit.',
    idiomatic: 'The limit within which the moon, traveling the yang calendar, meets new and full moons.',
  },
  s0987: {
    literal: 'Yang posterior limit one day;',
    idiomatic: 'Yang posterior limit: 1 day;',
  },
  s0988: {
    literal: 'remainder, fifteen;',
    idiomatic: 'remainder, 15;',
  },
  s0989: {
    literal: 'odd, ninety-one;',
    idiomatic: 'odd, 91;',
  },
  s0990: {
    literal: 'minor parts, ninety-one six-parts half.',
    idiomatic: 'minor parts, 91, 6 parts, and a half.',
  },
  s0991: {
    literal: 'Moon travels yang calendar, rear with new-full moon meets limit.',
    idiomatic: 'The limit after the moon, traveling the yang calendar, meets new and full moons.',
  },
  s0992: {
    literal: 'Yin anterior limit twenty-six days;',
    idiomatic: 'Yin anterior limit: 26 days;',
  },
  s0993: {
    literal: 'remainder, five;',
    idiomatic: 'remainder, 5;',
  },
  s0994: {
    literal: 'odd, thirty;',
    idiomatic: 'odd, 30;',
  },
  s0995: {
    literal: 'minor parts, twenty-five half-parts.',
    idiomatic: 'minor parts, 25 and a half part.',
  },
  s0996: {
    literal: 'Moon travels yin calendar, before with new-full moon meets limit.',
    idiomatic: 'The limit before the moon, traveling the yin calendar, meets new and full moons.',
  },
  s0997: {
    literal: 'Wood Year Star accord method three hundred ninety-eight days;',
    idiomatic: 'Jupiter accord method: 398 days;',
  },
  s0998: {
    literal: 'remainder, eighty-six;',
    idiomatic: 'remainder, 86;',
  },
  s0999: {
    literal: 'odd, seventy-nine;',
    idiomatic: 'odd, 79;',
  },
  s1000: {
    literal: 'minor parts, eighty.',
    idiomatic: 'minor parts, 80.',
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
const sentences = extractBatch(chapter, 901, 1000);

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
console.log('All 100 sentences (s0901–s1000) filled and verified.');
