/** Jiutangshu ch.033 batch 7: s0601–s0700 (Mercury morning rules, fixed appearance, planet stepping, Jupiter/Mars motion tables) */
import { readFileSync, writeFileSync } from 'fs';

const chapterPath = 'data/jiutangshu/033.json';
const targetPath = 'translations/current_translation_jiutangshu.json';

const translations = {
  s0601: {
    literal: 'Entering Start of Spring through Awakening of Insects, uniformly subtract three days.',
    idiomatic: 'From the Start of Spring through Awakening of Insects, uniformly subtract three days.',
  },
  s0602: {
    literal: 'If within Awakening of Insects qi, distance from sun in degrees as before—in the morning without Wood, Fire, Earth, Metal one star or more, is not seen.',
    idiomatic: 'If within the Awakening of Insects qi, at the same solar distance as before, with no Jupiter, Mars, Saturn, or Venus visible in the morning, it is not seen.',
  },
  s0603: {
    literal: 'Entering Rain Water through Start of Summer, should appear but does not appear.',
    idiomatic: 'From Rain Water through the Start of Summer, it should appear but does not.',
  },
  s0604: {
    literal: 'If within Start of Summer qi, distance from sun in degrees as before—in the morning with Wood, Fire, Earth, Metal one star or more also is seen.',
    idiomatic: 'If within the Start of Summer qi, at the same solar distance as before, with one or more of Jupiter, Mars, Saturn, or Venus visible in the morning, it is seen as well.',
  },
  s0605: {
    literal: 'Entering Minor Fullness through Cold Dew, follow mean.',
    idiomatic: 'From Minor Fullness through Cold Dew, follow the mean rate.',
  },
  s0606: {
    literal: 'Entering White Dew and Frost\'s Descent through Start of Winter, uniformly add one day.',
    idiomatic: 'From White Dew and Frost\'s Descent through the Start of Winter, uniformly add one day.',
  },
  s0607: {
    literal: 'Entering Minor Snow through Major Snow, follow mean.',
    idiomatic: 'From Minor Snow through Major Snow, follow the mean rate.',
  },
  s0608: {
    literal: 'Procedure for finding the five planets\' fixed appearances',
    idiomatic: 'Procedure for Finding the Five Planets\' Fixed Appearances',
  },
  s0609: {
    literal: 'Each set that star\'s regular appearance day\'s correction constant and halve it; at rest diminish-increase the regular appearance day—that is the fixed appearance day and parts.',
    idiomatic: 'For each planet, take half of that star\'s daily correction constant at its regular appearance; apply diminish-increase at rest to the regular appearance day to obtain the fixed appearance day and parts.',
  },
  s0610: {
    literal: 'The five planets\' rest and exaltation brightness differ; joy, anger, flourishing, waning, large and small especially differ.',
    idiomatic: 'The five planets differ in brightness at rest and at exaltation; their phases of joy, anger, flourishing, and waning, and their apparent sizes, differ especially.',
  },
  s0611: {
    literal: 'If it varies from regular appearance in time, earlier or later, now according to solar motion\'s slowness and speed examine its motion, measure its position, using distance from sun as the fixed standard.',
    idiomatic: 'When appearance varies from the regular date, whether early or late, examine its motion according to the sun\'s varying speed, measure its position, and take its distance from the sun as the fixed standard.',
  },
  s0612: {
    literal: 'Procedure for finding the degree where the star appears',
    idiomatic: 'Procedure for Finding the Degree Where the Star Appears',
  },
  s0613: {
    literal: 'Set the star\'s fixed appearance day midnight sun\'s lodge degree count and parts; halve the solar motion difference, multiply the fixed appearance remainder, halve the half-total and one; advance add retreat subtract the fixed appearance remainder, to add to midnight degree parts; then with that star\'s first appearance distance-from-sun degree count—in morning subtract, in evening add—that is the star first appearance chen location.',
    idiomatic: 'Set the lodge-degree count and parts of the sun at midnight on the star\'s fixed appearance day; halve the solar motion difference, multiply by the fixed appearance remainder, and divide by the half-total; add for advance and subtract for retreat to the fixed appearance remainder, and add this to the midnight degree and parts; then apply that star\'s first-appearance solar distance—in the morning subtract and in the evening add—to obtain the lodge where the star first appears.',
  },
  s0614: {
    literal: 'Procedure for lodge degrees and stepping the planets',
    idiomatic: 'Procedure for Lodge Degrees and Stepping the Planets',
  },
  s0615: {
    literal: 'Each set that star\'s first appearance day\'s correction constant, halve it, at rest add diminish-reduce, its star first appearance motion-station day rate.',
    idiomatic: 'For each planet, set its first-appearance day\'s correction constant, halve it, and at rest add or diminish to adjust its first-appearance motion-and-station day rate.',
  },
  s0616: {
    literal: 'For Jupiter and Saturn the two stars need not add-subtract; then follow the base procedure.',
    idiomatic: 'For Jupiter and Saturn, no add-subtract adjustment is needed; follow the base procedure.',
  },
  s0617: {
    literal: 'If add-subtract does not fill a day, combine with appearance.',
    idiomatic: 'If the add-subtract adjustment does not amount to a full day, combine it with the appearance date.',
  },
  s0618: {
    literal: 'If over half, carry one day; without half, do not carry.',
    idiomatic: 'If the remainder exceeds half, carry one day; if it does not reach half, do not carry.',
  },
  s0619: {
    literal: 'Then according to the planet motion day-degree rate, seek the day\'s motion parts.',
    idiomatic: 'Then, according to the planet\'s day-and-degree motion rate, obtain the day\'s motion parts.',
  },
  s0620: {
    literal: 'Procedure for finding where the star stands at midnight after the first appearance day',
    idiomatic: 'Procedure for Finding Where the Star Stands at Midnight After the First Appearance Day',
  },
  s0621: {
    literal: 'Set the star\'s fixed appearance remainder, subtract from half-total, multiply by that star\'s first appearance motion parts, halve total and one, by direct add reverse subtract star first appearance fixed chen location degree parts.',
    idiomatic: 'Set the star\'s fixed appearance remainder, subtract it from the half-total, multiply by that star\'s first-appearance motion parts, and divide by the half-total; add for direct motion and subtract for retrograde to the star\'s first-appearance fixed chen location in degrees and parts.',
  },
  s0622: {
    literal: 'If adding fills the divisor, if subtracting is insufficient, advance or retreat one degree.',
    idiomatic: 'If addition fills the divisor, or subtraction falls short, advance or retreat one degree.',
  },
  s0623: {
    literal: 'According to prior assignation count outside, that is star after appearance midnight lodge degree and parts.',
    idiomatic: 'Count outside the prior assignation to obtain the star\'s lodge degree and parts at midnight after appearance.',
  },
  s0624: {
    literal: 'From here onward, each according to its star compute daily motion degrees; where arrived day degree and increasing speed, all from midnight as start.',
    idiomatic: 'From here onward, for each star compute the daily motion in degrees; the day-degree reached and any increase in speed are all reckoned from midnight.',
  },
  s0625: {
    literal: 'If chen has remainder, follow what is nearest.',
    idiomatic: 'If the chen has a fractional remainder, follow whichever is nearest.',
  },
  s0626: {
    literal: 'Procedure for stepping to where the star reaches at the next day\'s midnight',
    idiomatic: 'Procedure for Stepping to Where the Star Reaches at the Next Day\'s Midnight',
  },
  s0627: {
    literal: 'Each with that star one day motion degree and parts, direct reverse add subtract.',
    idiomatic: 'For each star, add or subtract its one-day motion in degrees and parts according to direct or retrograde motion.',
  },
  s0628: {
    literal: 'If motion has small parts, use day rate as denominator.',
    idiomatic: 'If the motion has fractional small parts, use the day rate as denominator.',
  },
  s0629: {
    literal: 'Small parts fill denominator, remove, carry from motion parts one.',
    idiomatic: 'When the small parts fill the denominator, remove them and carry one into the motion parts.',
  },
  s0630: {
    literal: 'Motion parts fill half-total, remove, carry from degree one.',
    idiomatic: 'When the motion parts fill the half-total, remove them and carry one into the degrees.',
  },
  s0631: {
    literal: 'If motion has increasing speed or increasing slowness, separately set one day motion parts.',
    idiomatic: 'If the motion has increasing speed or increasing slowness, set aside the one-day motion parts separately.',
  },
  s0632: {
    literal: 'Each with its difference slowness diminish speed add; if stationary continue prior, if retrograde then depend on subtract.',
    idiomatic: 'For each, add the slowness-or-speed difference as diminish or increase; if stationary, continue from the prior value; if retrograde, subtract accordingly.',
  },
  s0633: {
    literal: 'Direct motion exiting Dipper remove its parts, retrograde motion entering Dipper first add parts.',
    idiomatic: 'In direct motion exiting the Dipper, remove its parts; in retrograde motion entering the Dipper, first add the parts.',
  },
  s0634: {
    literal: 'When done, all use rule factor to reduce motion parts to degree parts, each obtain daily arrival.',
    idiomatic: 'When this is done, reduce the motion parts to degree parts by the rule factor for each day\'s arrival.',
  },
  s0635: {
    literal: 'The five planets\' later direct, station, retreat terminal day degrees, each according to invisibility degrees, seek their distance from sun near and far, message day degree location, to fix invisibility day location.',
    idiomatic: 'For the five planets\' later direct, stationary, and retrograde terminal day-degrees, use each star\'s invisibility degree to find its solar distance, near or far, and the day-degree reached by diminish-increase, thereby fixing the invisibility day.',
  },
  s0636: {
    literal: 'If annotating calendar, the day degrees and Metal-Water and other stars, all discard their parts.',
    idiomatic: 'When annotating the calendar, discard the fractional parts for day-degrees and for Venus, Mercury, and the other stars.',
  },
  s0637: {
    literal: 'Procedure for finding mean motion degree and parts',
    idiomatic: 'Procedure for Finding Mean Motion Degree and Parts',
  },
  s0638: {
    literal: 'Set fixed degree rate, multiply by half-total, what has parts follows, divide by day rate, what is obtained is one day motion parts.',
    idiomatic: 'Set the fixed degree rate, multiply by the half-total, carry any parts forward, divide by the day rate, and the quotient is the one-day motion parts.',
  },
  s0639: {
    literal: 'Undivided small parts fill its motion parts.',
    idiomatic: 'Any undivided small parts are carried into the motion parts.',
  },
  s0640: {
    literal: 'Fill half-total becomes degree.',
    idiomatic: 'When the parts fill the half-total, convert them to a degree.',
  },
  s0641: {
    literal: 'That is one day motion degree and motion parts, small parts.',
    idiomatic: 'This gives the one-day motion in degrees, motion parts, and small parts.',
  },
  s0642: {
    literal: 'Set fixed day rate, subtract one day, multiply by applied difference parts, divide by two, is difference rate.',
    idiomatic: 'Set the fixed day rate, subtract one day, multiply by the applied difference in parts, and divide by two to obtain the difference rate.',
  },
  s0643: {
    literal: 'Increasing speed use difference rate subtract mean motion parts, increasing slowness use difference rate add mean motion parts, that is first day motion degree and parts.',
    idiomatic: 'For increasing speed, subtract the difference rate from the mean motion parts; for increasing slowness, add it; this yields the first day\'s motion in degrees and parts.',
  },
  s0644: {
    literal: 'Star name, star motion, change day, first motion entering qi calendar, motion day rate, motion degree and degree-parts rate: diminish-increase rate.',
    idiomatic: 'Star name, star motion, change day, first motion entering-qi calendar, motion day rate, motion degree and degree-parts rate: diminish-increase rate.',
  },
  s0645: {
    literal: 'Jupiter: first direct, differential motion one hundred fourteen days, moves eighteen degrees five hundred nine parts slow one part first then fast, daily increase fourteen days.',
    idiomatic: 'Jupiter: first direct motion, differential 114 days, travels 18°509 parts—one part slow at first, then fast—with a daily increase of 14 parts.',
  },
  s0646: {
    literal: 'Prior station, twenty-six days.',
    idiomatic: 'Prior station: 26 days.',
  },
  s0647: {
    literal: 'Revolving retreat westward motion, differential thirty days, retreats six degrees twelve parts.',
    idiomatic: 'Revolving retreat, moving westward: differential 30 days, retreats 6°12 parts.',
  },
  s0648: {
    literal: 'First slow, daily increase speed two parts.',
    idiomatic: 'Slow at first, with speed increasing by 2 parts per day.',
  },
  s0649: {
    literal: 'Again retreat westward motion, differential forty-two days, retreats six degrees twelve parts.',
    idiomatic: 'Again retreats westward: differential 42 days, retreats 6°12 parts.',
  },
  s0650: {
    literal: 'First fast, daily increase slowness two parts.',
    idiomatic: 'Fast at first, with slowness increasing by 2 parts per day.',
  },
  s0651: {
    literal: 'Later station, twenty-five days.',
    idiomatic: 'Later station: 25 days.',
  },
  s0652: {
    literal: 'Later direct, differential motion one hundred fourteen days, moves eighteen degrees five hundred nine parts.',
    idiomatic: 'Later direct motion: differential 114 days, travels 18°509 parts.',
  },
  s0653: {
    literal: 'First advancing slow, daily increase speed parts until days exhausted and evening invisibility fourteen days.',
    idiomatic: 'Slow at first while advancing, with speed increasing daily in parts until the days are exhausted; evening invisibility: 14 days.',
  },
  s0654: {
    literal: 'Mars: first direct, entering Winter Solstice first day, rate two hundred forty-three days moves one hundred sixty-five degrees.',
    idiomatic: 'Mars: first direct motion, from the Winter Solstice on the first day, rate 243 days for 165 degrees.',
  },
  s0655: {
    literal: 'From then every three days diminish day and degree each three.',
    idiomatic: 'From then on, every three days diminish the day count and degree count each by three.',
  },
  s0656: {
    literal: 'Minor Cold first day, two hundred thirty-five days moves one hundred fifty-four degrees.',
    idiomatic: 'At Minor Cold on the first day: 235 days for 154 degrees.',
  },
  s0657: {
    literal: 'From then every two days diminish day and degree each three.',
    idiomatic: 'From then on, every two days diminish the day count and degree count each by three.',
  },
  s0658: {
    literal: 'Grain Rain four days, mean, through Minor Fullness nine days.',
    idiomatic: 'From Grain Rain for four days at the mean rate through Minor Fullness for nine days.',
  },
  s0659: {
    literal: 'One hundred seventy-eight days moves one hundred degrees.',
    idiomatic: '178 days for 100 degrees.',
  },
  s0660: {
    literal: 'From entering Minor Fullness nine days afterward, every two days increase day and degree each one.',
    idiomatic: 'From nine days after entering Minor Fullness, every two days increase the day count and degree count each by one.',
  },
  s0661: {
    literal: 'Summer Solstice first day, mean, through six days.',
    idiomatic: 'From the Summer Solstice on the first day at the mean rate through six days.',
  },
  s0662: {
    literal: 'One hundred seventy-one days moves ninety-three degrees.',
    idiomatic: '171 days for 93 degrees.',
  },
  s0663: {
    literal: 'From entering Summer Solstice six days afterward, every three days increase day and degree each one.',
    idiomatic: 'From six days after entering the Summer Solstice, every three days increase the day count and degree count each by one.',
  },
  s0664: {
    literal: 'Start of Autumn first day, one hundred eighty-four days moves one hundred six degrees.',
    idiomatic: 'At the Start of Autumn on the first day: 184 days for 106 degrees.',
  },
  s0665: {
    literal: 'From then every one day increase day and degree each one.',
    idiomatic: 'From then on, every day increase the day count and degree count each by one.',
  },
  s0666: {
    literal: 'White Dew first day, two hundred fourteen days moves one hundred thirty-six degrees.',
    idiomatic: 'At White Dew on the first day: 214 days for 136 degrees.',
  },
  s0667: {
    literal: 'From then every five days increase day and degree each one.',
    idiomatic: 'From then on, every five days increase the day count and degree count each by one.',
  },
  s0668: {
    literal: 'Autumn Equinox first day, two hundred thirty-two days moves one hundred fifty-four degrees.',
    idiomatic: 'At the Autumn Equinox on the first day: 232 days for 154 degrees.',
  },
  s0669: {
    literal: 'From then every one day increase day and degree each one.',
    idiomatic: 'From then on, every day increase the day count and degree count each by one.',
  },
  s0670: {
    literal: 'Cold Dew first day, two hundred forty-seven days moves one hundred sixty-nine degrees.',
    idiomatic: 'At Cold Dew on the first day: 247 days for 169 degrees.',
  },
  s0671: {
    literal: 'From then every five days increase day and degree each two.',
    idiomatic: 'From then on, every five days increase the day count and degree count each by two.',
  },
  s0672: {
    literal: 'Frost\'s Descent five days, mean, through Start of Winter thirteen days.',
    idiomatic: 'From Frost\'s Descent for five days at the mean rate through the Start of Winter for thirteen days.',
  },
  s0673: {
    literal: 'Two hundred fifty-nine days moves one hundred eighty-one degrees.',
    idiomatic: '259 days for 181 degrees.',
  },
  s0674: {
    literal: 'From entering Start of Winter thirteen days afterward, every two days diminish day and degree each one.',
    idiomatic: 'From thirteen days after entering the Start of Winter, every two days diminish the day count and degree count each by one.',
  },
  s0675: {
    literal: 'Again Winter Solstice first day, two hundred forty-two days moves one hundred sixty-five degrees.',
    idiomatic: 'Again at the Winter Solstice on the first day: 242 days for 165 degrees.',
  },
  s0676: {
    literal: 'Each according to entered mean qi, where mean follow rate, from remainder compute daily diminish-increase, named prior-fast day-degree fixed rate.',
    idiomatic: 'For each mean qi entered, where the rate is mean follow the base rate; from the remainder compute daily diminish-increase—this is called the prior-fast fixed day-and-degree rate.',
  },
  s0677: {
    literal: 'The prior slow and station-retreat entering qi where diminish-increase day-degree, compute daily diminish-increase, all same as this fast method, to serve as slow-station-revolving-retreat fixed day-degree rate.',
    idiomatic: 'For prior slow motion and station-retreat entering qi where day-and-degree diminish-increase applies, compute daily diminish-increase by the same method as for fast motion, to obtain the fixed day-and-degree rates for slow, stationary, and revolving-retreat phases.',
  },
  s0678: {
    literal: 'Procedure for finding change day rate: this fast phase, entering Major Cold six days, diminish day rate one, through Rain Water.',
    idiomatic: 'Procedure for finding the change day rate: in this fast phase, from six days into Major Cold, diminish the day rate by one through Rain Water.',
  },
  s0679: {
    literal: 'Entering Spring Equinox through Start of Summer, reduce day rate ten.',
    idiomatic: 'From the Spring Equinox through the Start of Summer, reduce the day rate by ten.',
  },
  s0680: {
    literal: 'Entering Minor Fullness first, reduce day rate ten.',
    idiomatic: 'At Minor Fullness on the first day, reduce the day rate by ten.',
  },
  s0681: {
    literal: 'Afterward every three days diminish what was reduced by one.',
    idiomatic: 'Afterward, every three days diminish the reduction by one.',
  },
  s0682: {
    literal: 'Through Grain in Ear, follow mean.',
    idiomatic: 'Through Grain in Ear, follow the mean rate.',
  },
  s0683: {
    literal: 'If entering Start of Autumn, every three days increase day rate one, through End of Heat.',
    idiomatic: 'From the Start of Autumn, increase the day rate by one every three days through End of Heat.',
  },
  s0684: {
    literal: 'Entering White Dew through Autumn Equinox, uniformly add rate ten.',
    idiomatic: 'From White Dew through the Autumn Equinox, uniformly add ten to the rate.',
  },
  s0685: {
    literal: 'Entering Cold Dew first, add rate ten.',
    idiomatic: 'At Cold Dew on the first day, add ten to the rate.',
  },
  s0686: {
    literal: 'Afterward every one and a half days diminish what was added by one.',
    idiomatic: 'Afterward, every day and a half diminish the addition by one.',
  },
  s0687: {
    literal: 'Through qi exhausted, follow mean.',
    idiomatic: 'Once the qi period is exhausted, follow the mean rate.',
  },
  s0688: {
    literal: 'Procedure for finding change degree rate: this fast phase, if entering Major Cold through Awakening of Insects, Summer Solstice through Major Heat qi exhausted, Frost\'s Descent through Minor Snow, all add degree rate four.',
    idiomatic: 'Procedure for finding the change degree rate: in this fast phase, from Major Cold through Awakening of Insects, from the Summer Solstice through Major Heat until the qi is exhausted, and from Frost\'s Descent through Minor Snow, add four to the degree rate in each case.',
  },
  s0689: {
    literal: 'Clear Brightness through Grain Rain, add rate degree twelve.',
    idiomatic: 'From Clear Brightness through Grain Rain, add twelve to the rate in degrees.',
  },
  s0690: {
    literal: 'First motion entering End of Heat, reduce day rate sixty, degree rate thirty.',
    idiomatic: 'At first motion entering End of Heat, reduce the day rate by sixty and the degree rate by thirty.',
  },
  s0691: {
    literal: 'Separately make prior-slow half-degree motion, motion exhaust this day-degree, and the remainder day-degree rate of what was reduced continues as fast.',
    idiomatic: 'Set apart a prior-slow half-degree motion; when this day-degree is exhausted, the remaining day-and-degree rate from the reduction continues as fast motion.',
  },
  s0692: {
    literal: 'Entering White Dew through Autumn Equinox, forty-four days moves twenty-two degrees.',
    idiomatic: 'From White Dew through the Autumn Equinox: 44 days for 22 degrees.',
  },
  s0693: {
    literal: 'All are prior-slow half-degree rate.',
    idiomatic: 'All of these use the prior-slow half-degree rate.',
  },
  s0694: {
    literal: 'First motion entering Major Cold through Major Heat, differential motion, first fast, daily increase slowness one part.',
    idiomatic: 'First motion from Major Cold through Major Heat: differential motion, fast at first, with slowness increasing by one part per day.',
  },
  s0695: {
    literal: 'Each as above method, seek its motion parts.',
    idiomatic: 'For each, obtain the motion parts by the method above.',
  },
  s0696: {
    literal: 'The prior slow latter day rate, since there is increase-diminish, and increasing slowness increasing speed like parts, all inspect prior fast last day motion parts, as prior slow first day motion parts.',
    idiomatic: 'When the prior slow phase\'s latter day rate has been increased or diminished, and increasing slowness or increasing speed applies to the parts, take the prior fast phase\'s last-day motion parts as the prior slow phase\'s first-day motion parts.',
  },
  s0697: {
    literal: 'Use prior slow mean motion parts subtract it, remainder is prior slow total difference.',
    idiomatic: 'Subtract this from the prior slow mean motion parts; the remainder is the prior slow total difference.',
  },
  s0698: {
    literal: 'Latter fast day parts, as latter slow last day motion parts.',
    idiomatic: 'The latter fast phase\'s day parts serve as the latter slow phase\'s last-day motion parts.',
  },
  s0699: {
    literal: 'Use latter slow day motion parts subtract it, remainder is latter total difference.',
    idiomatic: 'Subtract this from the latter slow phase\'s daily motion parts; the remainder is the latter total difference.',
  },
  s0700: {
    literal: 'The subtraction gives latter separate day difference parts.',
    idiomatic: 'The result of the subtraction is the latter separate day-difference parts.',
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
const sentences = extractBatch(chapter, 601, 700);

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
console.log('All 100 sentences (s0601–s0700) filled and verified.');
