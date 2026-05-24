/** Jiutangshu ch.033 batch 9: s0801–s0900 (Mars later fast finish, Saturn/Venus/Mercury tables, calendar history) */
import { readFileSync, writeFileSync } from 'fs';

const chapterPath = 'data/jiutangshu/033.json';
const targetPath = 'translations/current_translation_jiutangshu.json';

const translations = {
  s0801: {
    literal: 'From entering Autumn Equinox one day afterward, every one and a half days restore day and degree each by one.',
    idiomatic: 'From one day after the Autumn Equinox onward, every day and a half restore the day count and degree count each by one.',
  },
  s0802: {
    literal: 'Major Snow first day, two hundred fifty days travels one hundred twenty degrees.',
    idiomatic: 'At Major Snow on the first day: 250 days for 120 degrees.',
  },
  s0803: {
    literal: 'From entering Autumn Equinox, every three days increase day and degree each by one.',
    idiomatic: 'From the Autumn Equinox onward, every three days increase the day count and degree count each by one.',
  },
  s0804: {
    literal: 'Winter Solstice first day, again two hundred ten days travels one hundred twenty-seven degrees.',
    idiomatic: 'At the Winter Solstice on the first day, again: 210 days for 127 degrees.',
  },
  s0805: {
    literal: 'Where entering fixed-qi day-degree rates have diminish-increase, compute daily diminish-increase, all same as prior-fast method, to serve as later-fast fixed-degree rate.',
    idiomatic: 'Where the fixed-qi day and degree rates require adjustment, tally the daily diminution and addition by the same method as the prior fast phase, and use the result as the later-fast fixed-degree rate.',
  },
  s0806: {
    literal: 'Procedure for finding transformed day-rate: where prior slow fixed days shortfall sixty, and retreat motion fixed days shortfall sixty-three, all add the shortfall day-count to this fast fixed day-rate; where prior slow fixed days surplus sixty-three, later station fixed days surplus thirteen, all subtract the surplus day-count from this fast fixed day-rate.',
    idiomatic: 'Procedure for finding the transformed day-rate: if the prior slow fixed days fall short by 60, or the retrograde fixed days fall short by 63, add the shortfall in days to this fast fixed day-rate; if the prior slow fixed days exceed by 63, or the later stationary fixed days exceed by 13, subtract the surplus in days from this fast fixed day-rate.',
  },
  s0807: {
    literal: 'Add and subtract done, that is the transformed day-rate.',
    idiomatic: 'Once addition and subtraction are complete, that is the transformed day-rate.',
  },
  s0808: {
    literal: 'Procedure for finding transformed degree-rate: where prior slow fixed degree shortfall twenty-five, retreat motion fixed degree surplus seventeen, later slow entering Autumn Equinox through Winter Solstice diminished degree, all add the surplus-shortfall degree-count to this fast fixed degree-rate.',
    idiomatic: 'Procedure for finding the transformed degree-rate: if the prior slow fixed degrees fall short by 25, the retrograde fixed degrees exceed by 17, or the later slow phase diminishes degrees between the Autumn Equinox and the Winter Solstice, add the surplus or shortfall in degrees to this fast fixed degree-rate.',
  },
  s0809: {
    literal: 'Prior slow fixed degree surplus twenty-five, and retreat motion fixed degree shortfall seventeen, all subtract the surplus-shortfall degree-count from this fast fixed degree-rate.',
    idiomatic: 'If the prior slow fixed degrees exceed by 25, or the retrograde fixed degrees fall short by 17, subtract the surplus or shortfall in degrees from this fast fixed degree-rate.',
  },
  s0810: {
    literal: 'Add and subtract done, that is the transformed degree-rate.',
    idiomatic: 'Once addition and subtraction are complete, that is the transformed degree-rate.',
  },
  s0811: {
    literal: 'Initial motion, entering Spring Equinox, through Grain Rain, differential motion.',
    idiomatic: 'First motion from the Spring Equinox through Grain Rain: differential motion.',
  },
  s0812: {
    literal: 'Slow at first, daily increase fast one part.',
    idiomatic: 'Slow at first, with speed increasing by one part per day.',
  },
  s0813: {
    literal: 'Initial motion, entering Start of Summer, through Summer Solstice, daily travels half a degree.',
    idiomatic: 'First motion from the Start of Summer through the Summer Solstice: half a degree per day.',
  },
  s0814: {
    literal: 'Sixty-six days travels twenty-two degrees.',
    idiomatic: '66 days for 22 degrees.',
  },
  s0815: {
    literal: 'Minor Heat, fifty days travels twenty-five degrees.',
    idiomatic: 'At Minor Heat: 50 days for 25 degrees.',
  },
  s0816: {
    literal: 'Start of Autumn through qi exhausted, twenty days travels ten degrees, diminish rate continue motion, all same as prior fast initial slow method.',
    idiomatic: 'From the Start of Autumn through the end of the qi: 20 days for 10 degrees; diminish the rate and continue motion by the same initial-slow method as the prior fast phase.',
  },
  s0817: {
    literal: 'Diminish-increase follow prior, seek its motion parts.',
    idiomatic: 'Apply diminish-increase as before to obtain the motion parts.',
  },
  s0818: {
    literal: 'Each exhaust degrees then evening invisibility.',
    idiomatic: 'Each leg completes its degrees, then evening invisibility.',
  },
  s0819: {
    literal: 'Saturn: initial direct, differential motion, eighty-three days travels seven degrees two hundred ninety parts.',
    idiomatic: 'Saturn: initial direct motion, differential 83 days, travels 7°290 parts.',
  },
  s0820: {
    literal: 'Fast at first, daily increase slow half part.',
    idiomatic: 'Fast at first, with slowness increasing by half a part per day.',
  },
  s0821: {
    literal: 'Prior station, thirty-seven days.',
    idiomatic: 'Prior station: 37 days.',
  },
  s0822: {
    literal: 'Then retreat, westward motion, differential motion, fifty-one days retreat thirty parts.',
    idiomatic: 'Then retrograde, moving westward: differential 51 days, retreats 30 parts.',
  },
  s0823: {
    literal: 'Slow at first, daily increase fast by small half.',
    idiomatic: 'Slow at first, with speed increasing by a small half part per day.',
  },
  s0824: {
    literal: 'Venus: evening appearance, direct, entering Winter Solstice through Start of Summer, entering Start of Autumn through Major Snow.',
    idiomatic: 'Venus: evening appearance, direct motion from the Winter Solstice through the Start of Summer, and from the Start of Autumn through Major Snow.',
  },
  s0825: {
    literal: 'One hundred seventy-two days travels two hundred six degrees.',
    idiomatic: '172 days for 206 degrees.',
  },
  s0826: {
    literal: 'From entering Minor Fullness afterward, every ten days increase one degree, as fixed fast.',
    idiomatic: 'From entering Minor Fullness onward, add one degree every ten days to obtain the fixed fast rate.',
  },
  s0827: {
    literal: 'First entering White Dew, through Spring Equinox, differential motion.',
    idiomatic: 'First entering White Dew through the Spring Equinox: differential motion.',
  },
  s0828: {
    literal: 'Fast, daily increase slow two parts.',
    idiomatic: 'Fast motion, with slowness increasing by two parts per day.',
  },
  s0829: {
    literal: 'Remainder uniform motion.',
    idiomatic: 'The remainder follows uniform motion.',
  },
  s0830: {
    literal: 'Summer Solstice through Minor Heat, one hundred seventy-two days travels two hundred nine degrees.',
    idiomatic: 'From the Summer Solstice through Minor Heat: 172 days for 209 degrees.',
  },
  s0831: {
    literal: 'From entering Major Heat afterward, every five days diminish one degree, through qi exhausted.',
    idiomatic: 'From entering Major Heat onward, diminish one degree every five days through the end of the qi.',
  },
  s0832: {
    literal: 'Uniform motion: entering Winter Solstice first day and Major Heat, each through qi exhausted.',
    idiomatic: 'Uniform motion: from the Winter Solstice on the first day and from Major Heat, each through the end of the qi.',
  },
  s0833: {
    literal: 'Thirteen days travels thirteen degrees.',
    idiomatic: '13 days for 13 degrees.',
  },
  s0834: {
    literal: 'From entering Winter Solstice afterward, every ten days diminish one, through then Start of Spring, entering Start of Autumn, daily increase one, through Autumn Equinox.',
    idiomatic: 'From entering the Winter Solstice onward, diminish one every ten days through the Start of Spring; from entering the Start of Autumn, add one each day through the Autumn Equinox.',
  },
  s0835: {
    literal: 'Awakening of Insects through Grain in Ear, seven days travels seven degrees.',
    idiomatic: 'From Awakening of Insects through Grain in Ear: 7 days for 7 degrees.',
  },
  s0836: {
    literal: 'From entering Summer Solstice afterward, every five days increase one, through Minor Snow.',
    idiomatic: 'From entering the Summer Solstice onward, add one every five days through Minor Snow.',
  },
  s0837: {
    literal: 'Cold Dew first day, thirty-three days travels twenty-two degrees.',
    idiomatic: 'At Cold Dew on the first day: 33 days for 22 degrees.',
  },
  s0838: {
    literal: 'From then every six days diminish one, through Minor Snow.',
    idiomatic: 'From then on, diminish one every six days through Minor Snow.',
  },
  s0839: {
    literal: 'Direct slow: differential motion, thirty-two days travels thirty degrees.',
    idiomatic: 'Direct slow motion: differential 32 days for 30 degrees.',
  },
  s0840: {
    literal: 'Fast at first, daily increase slow eight parts.',
    idiomatic: 'Fast at first, with slowness increasing by eight parts per day.',
  },
  s0841: {
    literal: 'Prior fast added degree exceeding two hundred six degrees, by the amount diminish this degree.',
    idiomatic: 'If the prior fast phase added degrees beyond 206, subtract that excess from this degree count.',
  },
  s0842: {
    literal: 'Evening station, seven days.',
    idiomatic: 'Evening station: 7 days.',
  },
  s0843: {
    literal: 'Evening retreat, westward motion, ten days retreat five degrees.',
    idiomatic: 'Evening retrograde, moving westward: 10 days retreating 5 degrees.',
  },
  s0844: {
    literal: 'Days exhausted then evening invisibility.',
    idiomatic: 'When the days are exhausted, evening invisibility.',
  },
  s0845: {
    literal: 'Morning initial retreat, westward motion, ten days retreat five degrees.',
    idiomatic: 'Morning initial retrograde, moving westward: 10 days retreating 5 degrees.',
  },
  s0846: {
    literal: 'Daily retreat half a degree.',
    idiomatic: 'Half a degree of retrograde motion per day.',
  },
  s0847: {
    literal: 'Morning station, seven days.',
    idiomatic: 'Morning station: 7 days.',
  },
  s0848: {
    literal: 'Direct slow, differential motion, Winter Solstice through Start of Summer, Major Snow through qi exhausted.',
    idiomatic: 'Direct slow motion, differential from the Winter Solstice through the Start of Summer, and from Major Snow through the end of the qi.',
  },
  s0849: {
    literal: 'Thirty-two days, slow at first, daily increase fast eight parts.',
    idiomatic: '32 days: slow at first, with speed increasing by eight parts per day.',
  },
  s0850: {
    literal: 'From entering Minor Fullness afterward, every ten days diminish one degree, through Grain in Ear.',
    idiomatic: 'From entering Minor Fullness onward, diminish one degree every ten days through Grain in Ear.',
  },
  s0851: {
    literal: 'Uniform motion, Winter Solstice through qi exhausted, Start of Summer through qi exhausted.',
    idiomatic: 'Uniform motion: from the Winter Solstice through the end of the qi, and from the Start of Summer through the end of the qi.',
  },
  s0852: {
    literal: 'Thirteen days travels thirteen degrees.',
    idiomatic: '13 days for 13 degrees.',
  },
  s0853: {
    literal: 'Daily travels one degree.',
    idiomatic: 'One degree per day.',
  },
  s0854: {
    literal: 'From entering Minor Cold afterward, every six days increase day and degree each by one, through Awakening of Insects.',
    idiomatic: 'From entering Minor Cold onward, every six days increase the day count and degree count each by one through Awakening of Insects.',
  },
  s0855: {
    literal: 'Entering Minor Fullness afterward, every seven days diminish day and degree each by one, through Start of Autumn.',
    idiomatic: 'From entering Minor Fullness onward, every seven days diminish the day count and degree count each by one through the Start of Autumn.',
  },
  s0856: {
    literal: 'Rain Water first day, twenty-three days travels twenty-three degrees.',
    idiomatic: 'At Rain Water on the first day: 23 days for 23 degrees.',
  },
  s0857: {
    literal: 'From then every six days diminish day and degree each by one, through Grain Rain.',
    idiomatic: 'From then on, every six days diminish the day count and degree count each by one through Grain Rain.',
  },
  s0858: {
    literal: 'End of Heat through Cold Dew, no such uniform motion.',
    idiomatic: 'From End of Heat through Cold Dew: no such uniform motion.',
  },
  s0859: {
    literal: 'From entering Frost\'s Descent afterward, every five days increase day and degree each by one, through Major Snow.',
    idiomatic: 'From entering Frost\'s Descent onward, every five days increase the day count and degree count each by one through Major Snow.',
  },
  s0860: {
    literal: 'Prior slow motion diminished degree not reaching thirty degrees, this fast according to the amount increase it.',
    idiomatic: 'If the prior slow phase diminished degrees by less than 30, add that amount in this fast phase.',
  },
  s0861: {
    literal: 'Fast motion, one hundred seventy-two days travels two hundred six degrees.',
    idiomatic: 'Fast motion: 172 days for 206 degrees.',
  },
  s0862: {
    literal: 'End of Heat through Cold Dew, differential motion, slow at first, daily increase fast one part.',
    idiomatic: 'From End of Heat through Cold Dew: differential motion, slow at first, with speed increasing by one part per day.',
  },
  s0863: {
    literal: 'Remainder uniform motion, motion days exhausted then morning invisibility.',
    idiomatic: 'The remainder follows uniform motion until the motion days are exhausted, then morning invisibility.',
  },
  s0864: {
    literal: 'Mercury: evening appearance, direct fast, twelve days travels twenty-one degrees six parts.',
    idiomatic: 'Mercury: evening appearance, direct fast motion, 12 days for 21°6 parts.',
  },
  s0865: {
    literal: 'Daily travels one degree five hundred three parts.',
    idiomatic: 'One degree 503 parts per day.',
  },
  s0866: {
    literal: 'Major Heat through End of Heat, twelve days travels seventeen degrees two parts.',
    idiomatic: 'From Major Heat through End of Heat: 12 days for 17°2 parts.',
  },
  s0867: {
    literal: 'Daily travels one degree two hundred eighty parts.',
    idiomatic: 'One degree 280 parts per day.',
  },
  s0868: {
    literal: 'Uniform motion, seven days travels seven degrees.',
    idiomatic: 'Uniform motion: 7 days for 7 degrees.',
  },
  s0869: {
    literal: 'From entering Major Heat afterward, every two days diminish day and degree each by one.',
    idiomatic: 'From entering Major Heat onward, every two days diminish the day count and degree count each by one.',
  },
  s0870: {
    literal: 'Entering Start of Autumn, no such uniform motion.',
    idiomatic: 'From entering the Start of Autumn: no such uniform motion.',
  },
  s0871: {
    literal: 'Direct slow motion, six days travels two degrees four parts.',
    idiomatic: 'Direct slow motion: 6 days for 2°4 parts.',
  },
  s0872: {
    literal: 'Daily travels two hundred twenty-four parts, prior fast motion eleven degrees, no such slow motion.',
    idiomatic: '224 parts per day; if the prior fast phase traveled eleven degrees, there is no such slow motion.',
  },
  s0873: {
    literal: 'Days exhausted then evening invisibility.',
    idiomatic: 'When the days are exhausted, evening invisibility.',
  },
  s0874: {
    literal: 'Evening station, five days.',
    idiomatic: 'Evening station: 5 days.',
  },
  s0875: {
    literal: 'Morning appearance, station five days.',
    idiomatic: 'Morning appearance: stationary for 5 days.',
  },
  s0876: {
    literal: 'Direct slow motion, six days travels two degrees four parts.',
    idiomatic: 'Direct slow motion: 6 days for 2°4 parts.',
  },
  s0877: {
    literal: 'Daily travels two hundred twenty-four parts.',
    idiomatic: '224 parts per day.',
  },
  s0878: {
    literal: 'From entering Major Cold, through Awakening of Insects, no such slow motion.',
    idiomatic: 'From Major Cold through Awakening of Insects: no such slow motion.',
  },
  s0879: {
    literal: 'Uniform motion, seven days travels seven degrees.',
    idiomatic: 'Uniform motion: 7 days for 7 degrees.',
  },
  s0880: {
    literal: 'Daily travels one degree.',
    idiomatic: 'One degree per day.',
  },
  s0881: {
    literal: 'Major Cold afterward, every two days diminish day and degree each by one.',
    idiomatic: 'From Major Cold onward, every two days diminish the day count and degree count each by one.',
  },
  s0882: {
    literal: 'Entering Start of Spring, no such uniform motion.',
    idiomatic: 'From entering the Start of Spring: no such uniform motion.',
  },
  s0883: {
    literal: 'Direct fast motion, twelve days travels twenty-one degrees six parts.',
    idiomatic: 'Direct fast motion: 12 days for 21°6 parts.',
  },
  s0884: {
    literal: 'Daily travels one degree five hundred three parts.',
    idiomatic: 'One degree 503 parts per day.',
  },
  s0885: {
    literal: 'Prior no slow motion, thirteen days travels seventeen degrees ten parts.',
    idiomatic: 'If there was no prior slow phase: 13 days for 17°10 parts.',
  },
  s0886: {
    literal: 'Daily travels one degree two hundred eighty parts.',
    idiomatic: 'One degree 280 parts per day.',
  },
  s0887: {
    literal: 'Each days exhausted then morning invisibility.',
    idiomatic: 'Each leg completes its days, then morning invisibility.',
  },
  s0888: {
    literal: 'Generally the five stars\' terminal day-part odd remainders all at invisibility-parts vanish, therefore at planet-motion no further separate appearance.',
    idiomatic: 'Generally, the five planets\' leftover fractional day-parts are all absorbed into invisibility; they therefore need not appear separately in the planetary tables.',
  },
  s0889: {
    literal: 'Empress Wu held regency, edict said: "Recently the office charged with making the calendar took the twelfth month as intercalary.',
    idiomatic: 'While Empress Wu held regency, an edict said: "Recently the office charged with making the calendar took the twelfth month as intercalary.',
  },
  s0890: {
    literal: 'Examining historical records, then disordered old statutes, causing last year within, last day still moon seen.',
    idiomatic: 'Examination of the historical records showed that this violated longstanding precedent, with the result that within the previous year the moon was still visible on the last day of the month.',
  },
  s0891: {
    literal: 'Again more search, indeed off by one day.',
    idiomatic: 'On further investigation, it was indeed off by one day.',
  },
  s0892: {
    literal: 'Footing the beginning raising the correct, belongs in this.',
    idiomatic: 'Establishing the year\'s beginning and setting the calendar right belong to this matter.',
  },
  s0893: {
    literal: 'Should change calendar in renewal, reform prior fault in past done.',
    idiomatic: 'The calendar should be revised afresh, and past errors corrected.',
  },
  s0894: {
    literal: 'May use this month as intercalary tenth month, next month as first month.',
    idiomatic: 'This month may be taken as intercalary tenth month, and the coming month as first month.',
  },
  s0895: {
    literal: '" That year obtained jiazi conjunction new moon Winter Solstice.',
    idiomatic: '" That year obtained a jiazi-day conjunction at new moon on the Winter Solstice.',
  },
  s0896: {
    literal: 'Thereupon changed era Sacred Calendar, taking zi-established month as correct, chou-established as twelfth month, yin-established as first month.',
    idiomatic: 'Thereupon the era was changed to Sacred Calendar, with the zi-established month as the first month, the chou-established month as the twelfth month, and the yin-established month as the first month of the year.',
  },
  s0897: {
    literal: 'Ordered Grand Astrologer Gautama Siddhartha make new calendar.',
    idiomatic: 'The Grand Astrologer Gautama Siddhartha was ordered to compose a new calendar.',
  },
  s0898: {
    literal: 'To third year, again used Xia season, Guangzhai Calendar also not used.',
    idiomatic: 'By the third year, the Xia seasonal system was restored, and the Guangzhai Calendar was likewise not used.',
  },
  s0899: {
    literal: 'Emperor Zhongzong restored righteousness, Grand Astrologer Vice-director Nangong Shuo memorialized: "Linde Calendar added time gradually loose.',
    idiomatic: 'When Emperor Zhongzong restored the dynasty, Vice Director of the Grand Astrologer\'s Office Nangong Shuo memorialized: "The Linde Calendar\'s added times have grown increasingly loose.',
  },
  s0900: {
    literal: 'Also upper origin jiazi head, five stars had entering qi added time, not jade disk linked pearls correct.',
    idiomatic: 'Moreover, at the head of the upper origin in the jiazi year, when the five stars entered qi and added times, this did not match the correct conjunction of jade disk and linked pearls.',
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
const sentences = extractBatch(chapter, 801, 900);

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
console.log('All 100 sentences (s0801–s0900) filled and verified.');
