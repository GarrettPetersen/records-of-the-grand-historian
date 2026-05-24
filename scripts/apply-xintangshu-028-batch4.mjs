#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: { literal: 'Contraction 1,845', idiomatic: 'Contraction: 1,845' },
  s0302: { literal: 'Prior 4,198', idiomatic: 'Lead count: 4,198' },
  s0303: { literal: 'Decrease 138', idiomatic: 'Decrease rate: 138' },
  s0304: { literal: 'Waning 314', idiomatic: 'Waning accumulation: 314' },
  s0305: { literal: 'Grain in Ear', idiomatic: 'Grain in Ear' },
  s0306: { literal: 'Contraction 2,353', idiomatic: 'Contraction: 2,353' },
  s0307: { literal: 'Prior 2,353', idiomatic: 'Lead count: 2,353' },
  s0308: { literal: 'Decrease 176', idiomatic: 'Decrease rate: 176' },
  s0309: { literal: 'Waning 176', idiomatic: 'Waning accumulation: 176' },
  s0310: { literal: 'Summer Solstice', idiomatic: 'Summer Solstice' },
  s0311: { literal: 'Contraction 2,353', idiomatic: 'Contraction: 2,353' },
  s0312: { literal: 'Trailing edge', idiomatic: 'Trailing edge' },
  s0313: { literal: 'Increase 176', idiomatic: 'Increase rate: 176' },
  s0314: { literal: 'Waxing, initial', idiomatic: 'Waxing phase, initial' },
  s0315: { literal: 'Lesser Heat', idiomatic: 'Lesser Heat' },
  s0316: { literal: 'Contraction 1,845', idiomatic: 'Contraction: 1,845' },
  s0317: { literal: 'Posterior 2,353', idiomatic: 'Lag count: 2,353' },
  s0318: { literal: 'Increase 138', idiomatic: 'Increase rate: 138' },
  s0319: { literal: 'Waxing 176', idiomatic: 'Waxing accumulation: 176' },
  s0320: { literal: 'Greater Heat', idiomatic: 'Greater Heat' },
  s0321: { literal: 'Contraction 1,390', idiomatic: 'Contraction: 1,390' },
  s0322: { literal: 'Posterior 4,198', idiomatic: 'Lag count: 4,198' },
  s0323: { literal: 'Increase 104', idiomatic: 'Increase rate: 104' },
  s0324: { literal: 'Waxing 314', idiomatic: 'Waxing accumulation: 314' },
  s0325: { literal: 'Start of Autumn', idiomatic: 'Start of Autumn' },
  s0326: { literal: 'Contraction 976', idiomatic: 'Contraction: 976' },
  s0327: { literal: 'Posterior 5,588', idiomatic: 'Lag count: 5,588' },
  s0328: { literal: 'Increase 73', idiomatic: 'Increase rate: 73' },
  s0329: { literal: 'Waxing 418', idiomatic: 'Waxing accumulation: 418' },
  s0330: { literal: 'End of Heat', idiomatic: 'End of Heat' },
  s0331: { literal: 'Contraction 588', idiomatic: 'Contraction: 588' },
  s0332: { literal: 'Posterior 6,564', idiomatic: 'Lag count: 6,564' },
  s0333: { literal: 'Increase 44', idiomatic: 'Increase rate: 44' },
  s0334: { literal: 'Waxing 491', idiomatic: 'Waxing accumulation: 491' },
  s0335: { literal: 'White Dew', idiomatic: 'White Dew' },
  s0336: { literal: 'Contraction 214', idiomatic: 'Contraction: 214' },
  s0337: { literal: 'Posterior 7,152', idiomatic: 'Lag count: 7,152' },
  s0338: { literal: 'Increase 16', idiomatic: 'Increase rate: 16' },
  s0339: { literal: 'Waxing 535', idiomatic: 'Waxing accumulation: 535' },
  s0340: { literal: 'Autumn Equinox', idiomatic: 'Autumn Equinox' },
  s0341: { literal: 'Expansion 214', idiomatic: 'Expansion: 214' },
  s0342: { literal: 'Posterior 7,366', idiomatic: 'Lag count: 7,366' },
  s0343: { literal: 'Decrease 16', idiomatic: 'Decrease rate: 16' },
  s0344: { literal: 'Waxing 551', idiomatic: 'Waxing accumulation: 551' },
  s0345: { literal: 'Cold Dew', idiomatic: 'Cold Dew' },
  s0346: { literal: 'Expansion 588', idiomatic: 'Expansion: 588' },
  s0347: { literal: 'Posterior 7,152', idiomatic: 'Lag count: 7,152' },
  s0348: { literal: 'Decrease 44', idiomatic: 'Decrease rate: 44' },
  s0349: { literal: 'Waxing 535', idiomatic: 'Waxing accumulation: 535' },
  s0350: { literal: 'Frost Descent', idiomatic: 'Frost Descent' },
  s0351: { literal: 'Expansion 976', idiomatic: 'Expansion: 976' },
  s0352: { literal: 'Posterior 6,564', idiomatic: 'Lag count: 6,564' },
  s0353: { literal: 'Decrease 73', idiomatic: 'Decrease rate: 73' },
  s0354: { literal: 'Waxing 491', idiomatic: 'Waxing accumulation: 491' },
  s0355: { literal: 'Start of Winter', idiomatic: 'Start of Winter' },
  s0356: { literal: 'Expansion 1,390', idiomatic: 'Expansion: 1,390' },
  s0357: { literal: 'Posterior 5,588', idiomatic: 'Lag count: 5,588' },
  s0358: { literal: 'Decrease 104', idiomatic: 'Decrease rate: 104' },
  s0359: { literal: 'Waxing 418', idiomatic: 'Waxing accumulation: 418' },
  s0360: { literal: 'Lesser Snow', idiomatic: 'Lesser Snow' },
  s0361: { literal: 'Expansion 1,845', idiomatic: 'Expansion: 1,845' },
  s0362: { literal: 'Posterior 4,198', idiomatic: 'Lag count: 4,198' },
  s0363: { literal: 'Decrease 138', idiomatic: 'Decrease rate: 138' },
  s0364: { literal: 'Waxing 314', idiomatic: 'Waxing accumulation: 314' },
  s0365: { literal: 'Greater Snow', idiomatic: 'Greater Snow' },
  s0366: { literal: 'Expansion 2,353', idiomatic: 'Expansion: 2,353' },
  s0367: { literal: 'Posterior 2,353', idiomatic: 'Lag count: 2,353' },
  s0368: { literal: 'Decrease 176', idiomatic: 'Decrease rate: 176' },
  s0369: { literal: 'Waxing 176', idiomatic: 'Waxing accumulation: 176' },
  s0370: {
    literal:
      'With expansion–contraction fractions, where expansion subtract and contraction add to the three-origin tally, obtain the days and remainder belonging to fixed qi.',
    idiomatic:
      'Apply the expansion–contraction fractions: subtract where expansion and add where contraction from the three-origin tally, yielding the days and remainder for fixed qi.',
  },
  s0371: {
    literal:
      'Then multiply the days by twelve, triple the minor remainder, reduce by one per chronogram divisor and add, obtaining the fixed-qi chronogram count.',
    idiomatic:
      'Multiply the days by twelve, triple the minor remainder, divide by the chronogram divisor and add the quotient, to obtain the fixed-qi chronogram count.',
  },
  s0372: {
    literal: 'What does not exhaust, multiply by ten and reduce again to obtain parts.',
    idiomatic: 'The remainder, multiplied by ten and reduced again, gives fractional parts.',
  },
  s0373: {
    literal:
      'Take the expansion–contraction fractions of the entered qi together with the following qi, double and multiply by six lines, divide by the combined chronogram counts of both qi, obtaining the terminal rate.',
    idiomatic:
      'Combine the expansion–contraction fractions of the current and next qi, double and multiply by six lines, divide by the sum of their chronogram counts, and obtain the terminal rate.',
  },
  s0374: {
    literal:
      'Again set out the expansion–contraction fractions of both qi; each is doubled and multiplied by six lines, and one per chronogram count is taken.',
    idiomatic:
      'Set out both qi’s expansion–contraction fractions, each doubled and multiplied by six lines, and divide each by its chronogram count.',
  },
  s0375: {
    literal: 'Subtract the smaller from the larger; the remainder is the qi difference.',
    idiomatic: 'Subtract the smaller from the larger; the remainder is the qi difference.',
  },
  s0376: {
    literal: 'After the solstice add the difference to the terminal rate; after the equinox subtract the difference from the terminal rate, obtaining the initial rate.',
    idiomatic: 'After a solstice, add the difference to the terminal rate; after an equinox, subtract it—this yields the initial rate.',
  },
  s0377: {
    literal:
      'Double the qi difference, likewise double and multiply by six lines, again divide by the combined chronogram counts of both qi, obtaining the day difference.',
    idiomatic:
      'Double the qi difference, double and multiply by six lines, divide again by the combined chronogram counts of both qi, and obtain the day difference.',
  },
  s0378: {
    literal: 'Halve it and add or subtract from initial and terminal rates; each becomes a fixed rate.',
    idiomatic: 'Halve the day difference and add or subtract from the initial and terminal rates to obtain the fixed rates.',
  },
  s0379: {
    literal:
      'With the day difference, after the solstice subtract from and after the equinox add to the initial fixed rate of the qi, obtaining the daily expansion–contraction fraction.',
    idiomatic:
      'Using the day difference, subtract from the initial fixed rate after a solstice and add after an equinox, yielding the daily expansion–contraction fraction.',
  },
  s0380: {
    literal:
      'Then accumulate evenly; day by day within the entered qi add or subtract the lead and lag numbers below the qi, each day’s fixed tally.',
    idiomatic:
      'Accumulate stepwise: for each day within the entered qi, add or subtract the lead and lag counts listed under that qi to obtain each day’s fixed tally.',
  },
  s0381: {
    literal: 'To seek waxing and waning accumulations, follow this same method.',
    idiomatic: 'To determine waxing and waning accumulations, follow the same procedure.',
  },
  s0382: {
    literal: 'After the Winter Solstice is yang recovery: where expansion, add; where contraction, subtract.',
    idiomatic: 'After the Winter Solstice is yang recovery: add in expansion and subtract in contraction.',
  },
  s0383: {
    literal: 'After the Summer Solstice is yin recovery: where contraction, add; where expansion, subtract.',
    idiomatic: 'After the Summer Solstice is yin recovery: add in contraction and subtract in expansion.',
  },
  s0384: {
    literal:
      'One qi before each of the four cardinal points, at the turn of yin and yang, cannot be combined; therefore take the prior terminal as the initial rate.',
    idiomatic:
      'For the qi immediately before each cardinal solstice or equinox, at the yin–yang transition the rates cannot be merged; use the prior qi’s terminal rate as the initial rate.',
  },
  s0385: {
    literal: 'Before the solstice add the difference; before the equinox subtract the difference, obtaining the terminal rate.',
    idiomatic: 'Before a solstice add the difference to obtain the terminal rate; before an equinox subtract it.',
  },
  s0386: {
    literal: 'For the remainder, follow the prior method; each sought value is thereby obtained.',
    idiomatic: 'For the rest, follow the method above; each quantity sought is thereby obtained.',
  },
  s0387: {
    literal:
      'When the parts do not fill the whole number and the denominators differ for each qi, the divisor must be reduced accordingly.',
    idiomatic:
      'When fractional parts do not make a full unit and each qi has a different denominator, reduce by retreating the divisor.',
  },
  s0388: {
    literal: 'Take one hundred as the denominator; at half or above, collect into one.',
    idiomatic: 'Use one hundred as the denominator; at one-half or above, round up to one.',
  },
  s0389: {
    literal: 'Winter and Summer Solstices alike attain the heaven–earth mean; there is no expansion or contraction.',
    idiomatic: 'At the Winter and Summer Solstices alike the sun reaches the cosmological mean; there is neither expansion nor contraction.',
  },
  s0390: {
    literal:
      'For the rest, with the lead and lag numbers below each qi first subtract and then add to the minor remainder of regular qi; when full or insufficient, advance or retreat the day, obtaining fixed major and minor remainders.',
    idiomatic:
      'For the remaining qi, first subtract then add the lead and lag counts under each qi to the regular qi’s minor remainder; carry or borrow days as needed to obtain fixed major and minor remainders.',
  },
  s0391: {
    literal: 'For all computations of solar and lunar degrees, orbital motion and clepsydra, and eclipses, rely on fixed qi.',
    idiomatic: 'All calculations of solar and lunar longitude, orbital motion, clepsydra marks, and eclipses use fixed qi.',
  },
  s0392: {
    literal: 'For calendar entries, rely on regular qi.',
    idiomatic: 'Published calendars follow regular qi.',
  },
  s0393: {
    literal: 'Subtract to obtain canonical new moon, quarter, and full moon, each its entered day count.',
    idiomatic: 'Reduce the canonical new, quarter, and full moons by each entered day count.',
  },
  s0394: {
    literal: 'If the major remainder is insufficient to subtract, add the line count, then subtract.',
    idiomatic: 'If the major remainder is too small to subtract, add sixty lines, then subtract.',
  },
  s0395: {
    literal: 'Subtract one from the entered fixed-qi day count; multiply each by the day difference and halve.',
    idiomatic: 'Subtract one from the entered fixed-qi day count, multiply by the day difference, and halve.',
  },
  s0396: {
    literal:
      'If the prior is less, add; if the prior is more, subtract from the initial fixed rate of the qi; multiply by the entered fixed-qi day count, remainder, and seconds.',
    idiomatic:
      'If the prior fraction is smaller, add; if larger, subtract from the qi’s initial fixed rate; then multiply by the entered fixed-qi day count, remainder, and seconds.',
  },
  s0397: {
    literal: 'For all divisions, first convert wholes through the denominator and include the numerator, then multiply.',
    idiomatic: 'In every division, first unify whole units through the denominator, include the numerator, then multiply.',
  },
  s0398: {
    literal: 'Denominators multiply and divide.',
    idiomatic: 'Multiply and divide by the denominators.',
  },
  s0399: {
    literal:
      'What is obtained is used to increase or decrease the waxing–waning accumulation, each its entered waxing–waning fixed tally.',
    idiomatic:
      'Use the result to adjust the waxing–waning accumulation, obtaining each entered waxing–waning fixed tally.',
  },
  s0400: {
    literal: 'If it is not a syzygy with an eclipse at new or full moon, multiply the entered day count by twelve.',
    idiomatic: 'When new or full moon is not an eclipse syzygy, multiply the entered day count by twelve.',
  },
};

const path = 'translations/current_translation_xintangshu.json';
if (!fs.existsSync(path)) {
  console.log('Skip: no translation file');
  process.exit(0);
}
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const ids = new Set(data.sentences.map((s) => s.id));
const need = Object.keys(T);
if (!need.every((id) => ids.has(id))) {
  console.log('Skip: translation file missing', need.filter((id) => !ids.has(id)).join(', '));
  process.exit(0);
}
for (const s of data.sentences) {
  const t = T[s.id];
  if (!t) continue;
  s.literal = t.literal;
  s.idiomatic = t.idiomatic;
}
fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', need.length);
