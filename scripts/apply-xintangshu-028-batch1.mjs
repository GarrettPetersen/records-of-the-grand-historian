#!/usr/bin/env node
/** Apply batch 1 translations for xintangshu ch.028 s0001–s0100 */
import fs from 'node:fs';

const T = {
  s0001: {
    literal:
      'The Kaiyuan Dayan calendar evolving-era computation: the high origin in the year Yān-féng Kùn-dūn; counting back from Kaiyuan 12, year jiazi, the accumulated count is 96,961,740.',
    idiomatic:
      'In computing the evolving era of the Kaiyuan Dayan calendar, the high origin falls in the year Yān-féng Kùn-dūn; reckoned back from Kaiyuan 12 (jiazi), the accumulated count is 96,961,740.',
  },
  s0002: {
    literal: 'Section One: Method for pacing central qi and new moons',
    idiomatic: 'I. Method for Determining Central Qi and New Moons',
  },
  s0003: { literal: 'Universal method: 3,040.', idiomatic: 'Universal divisor: 3,040.' },
  s0004: { literal: 'Stalk substance: 1,110,343.', idiomatic: 'Year-fraction constant: 1,110,343.' },
  s0005: { literal: 'Sorting method: 89,773.', idiomatic: 'New-moon constant: 89,773.' },
  s0006: { literal: 'Reduction method: 91,200.', idiomatic: 'Reduction constant: 91,200.' },
  s0007: { literal: 'Stalk remainder: 15,943.', idiomatic: 'Stalk remainder: 15,943.' },
  s0008: { literal: 'Applied difference: 17,124.', idiomatic: 'Applied difference: 17,124.' },
  s0009: { literal: 'Pendulum limit: 87,018.', idiomatic: 'Intercalation threshold: 87,018.' },
  s0010: {
    literal: 'Three-origin stalks: 15, remainder 664, 7 parts.',
    idiomatic: 'Three-origin interval: 15 stalks, remainder 664, 7 parts.',
  },
  s0011: {
    literal: 'Four-image stalks: 29, remainder 1,613.',
    idiomatic: 'Four-image interval: 29 stalks, remainder 1,613.',
  },
  s0012: {
    literal: 'Central surplus fraction: 1,328, 14 parts.',
    idiomatic: 'Central-qi surplus fraction: 1,328, 14 parts.',
  },
  s0013: { literal: 'New-moon void fraction: 1,427.', idiomatic: 'New-moon void fraction: 1,427.' },
  s0014: { literal: 'Line number: 60.', idiomatic: 'Hexagram line count: 60.' },
  s0015: { literal: 'Image cycle: 24.', idiomatic: 'Image cycle: 24.' },
  s0016: {
    literal: 'Multiply accumulated counts by stalk substance; call it central accumulated parts.',
    idiomatic: 'Multiply the era count by the year-fraction constant to obtain the central accumulated parts.',
  },
  s0017: {
    literal: 'Divide by universal method to obtain one; this is accumulated days.',
    idiomatic: 'Divide by the universal divisor; the quotient is accumulated days.',
  },
  s0018: {
    literal: 'Remove by line number; from the remainder count outward from jiazi, obtain the heavenly central qi.',
    idiomatic: 'Remove full cycles of sixty lines; from the remainder, counting outward from jiazi, obtain the celestial central qi.',
  },
  s0019: {
    literal: 'The parts become minor remainder; the days become major remainder.',
    idiomatic: 'The fractional parts become the minor remainder; the days become the major remainder.',
  },
  s0020: {
    literal: 'Add three-origin stalks to obtain the next qi.',
    idiomatic: 'Add the three-origin interval to obtain the next qi.',
  },
  s0021: {
    literal: 'Whenever rates are linked by addition, if below there are remainder parts, all follow their kind together.',
    idiomatic: 'Whenever linked rates are added and fractional remainders remain below, combine them by kind.',
  },
  s0022: {
    literal: 'When full, advance stepwise through the method, adding to the upper position.',
    idiomatic: 'When a divisor is filled, carry upward step by step and add to the higher place.',
  },
  s0023: { literal: 'Remove by line number when days overflow.', idiomatic: 'Cast out full cycles of sixty when days overflow.' },
  s0024: {
    literal: 'Remove central accumulated parts by sorting method; what does not exhaust is called the pendulum of returned remainder.',
    idiomatic: 'Divide the central accumulated parts by the new-moon constant; the remainder is the intercalation pendulum.',
  },
  s0025: {
    literal: 'Subtract from central accumulated parts to obtain new-moon accumulated parts.',
    idiomatic: 'Subtract that amount from the central accumulated parts to obtain the new-moon accumulated parts.',
  },
  s0026: {
    literal: 'Take as days per universal method; remove the era as before to obtain the canonical new moon of the heavenly standard.',
    idiomatic: 'Convert by the universal divisor into days; fix the era as before to obtain the canonical winter new moon.',
  },
  s0027: {
    literal: 'Add one image’s days, seven, remainder 1,163 and less, to obtain first quarter.',
    idiomatic: 'Add one four-image interval—seven days, remainder 1,163 lesser—to obtain the first quarter.',
  },
  s0028: { literal: 'Double it to obtain full moon.', idiomatic: 'Double it to obtain full moon.' },
  s0029: { literal: 'Triple it to obtain last quarter.', idiomatic: 'Triple it to obtain last quarter.' },
  s0030: {
    literal: 'Quadruple it; this is called one sorting, obtaining the next month’s new moon.',
    idiomatic: 'Quadruple it—one full sorting—to obtain the next month’s new moon.',
  },
  s0031: {
    literal: 'Of every four parts, one is “less,” three are “greater.”',
    idiomatic: 'In quartering remainders, one part is “lesser,” three are “greater.”',
  },
  s0032: {
    literal: 'Combine central surplus and new-moon void fractions, cumulatively increasing the returned-remainder pendulum; each month the intercalation wanes.',
    idiomatic: 'Combine the central surplus and new-moon void fractions, steadily increasing the intercalation pendulum; each month the intercalation fraction diminishes.',
  },
  s0033: {
    literal: 'Whenever the returned-remainder pendulum is 56,760 or above, that year has an intercalary month.',
    idiomatic: 'Whenever the intercalation pendulum reaches 56,760 or more, the year receives an intercalary month.',
  },
  s0034: {
    literal: 'Examining its intercalation wane, when full above the pendulum limit, that month should receive intercalation.',
    idiomatic: 'Track the intercalation wane; when it exceeds the intercalation threshold, assign an intercalary month.',
  },
  s0035: {
    literal: 'Whether advancing or retreating, all are trimmed by the fixed new moon without central qi.',
    idiomatic: 'Whether advancing or retreating, the rule is the fixed new moon in a month without central qi.',
  },
  s0036: {
    literal:
      'Whenever for a regular qi the minor remainder does not fill the universal method and is half the central surplus fraction or below, multiply by the image cycle, include parts and seconds, combine and quintuple, and subtract from stalk substance;',
    idiomatic:
      'Whenever a regular qi’s minor remainder is less than the universal divisor and no more than half the central surplus fraction, multiply by the image cycle, include seconds, combine and quintuple, and subtract from the stalk substance;',
  },
  s0037: {
    literal: 'What does not exhaust, take as days per stalk remainder.',
    idiomatic: 'The remainder, divided by the stalk remainder, gives the days.',
  },
  s0038: {
    literal: 'Fix the count outward from the first day of regular qi; obtain the culmination day.',
    idiomatic: 'Count outward from the first day of the regular qi; the result is the solar culmination day.',
  },
  s0039: {
    literal:
      'Whenever for a canonical new moon the minor remainder does not fill the new-moon void fraction, subtract the minor remainder from the universal method; multiply the remainder by double quintuple;',
    idiomatic:
      'Whenever a canonical new moon’s minor remainder is less than the new-moon void fraction, subtract the minor remainder from the universal divisor; double and quintuple the remainder;',
  },
  s0040: {
    literal: 'What does not exhaust, take as days per new-moon void fraction.',
    idiomatic: 'The remainder, divided by the new-moon void fraction, gives the days.',
  },
  s0041: {
    literal: 'Fix the count outward from the first day of canonical new moon; obtain the extinguishing day.',
    idiomatic: 'Count outward from the first day of the canonical new moon; the result is the lunar extinguishing day.',
  },
  s0042: {
    literal: 'Section Two: Method for issuing and gathering in',
    idiomatic: 'II. Method for Issuing and Gathering In',
  },
  s0043: {
    literal: 'Heaven-central stalks: five, remainder 221, 31 parts;',
    idiomatic: 'Heaven-central interval: five stalks, remainder 221, 31 parts;',
  },
  s0044: { literal: 'Parts method: 72.', idiomatic: 'Second divisor: 72.' },
  s0045: {
    literal: 'Earth-central stalks: six, remainder 265, 86 parts;',
    idiomatic: 'Earth-central interval: six stalks, remainder 265, 86 parts;',
  },
  s0046: { literal: 'Parts method: 120.', idiomatic: 'Second divisor: 120.' },
  s0047: {
    literal: 'Zhen-hui stalks: three, remainder 132, 103 parts.',
    idiomatic: 'Zhen-hui interval: three stalks, remainder 132, 103 parts.',
  },
  s0048: { literal: 'Chronogram method: 760.', idiomatic: 'Chronogram divisor: 760.' },
  s0049: { literal: 'Clepsydra method: 304.', idiomatic: 'Clepsydra divisor: 304.' },
  s0050: {
    literal: 'For each, fix by the mid-node of the central qi; obtain the first hou.',
    idiomatic: 'For each, start from the mid-node of the central qi; obtain the first phenological hou.',
  },
  s0051: {
    literal: 'Add heaven-central stalks to obtain the next hou.',
    idiomatic: 'Add the heaven-central interval to obtain the next hou.',
  },
  s0052: { literal: 'Add again to obtain the last hou.', idiomatic: 'Add again to obtain the last hou.' },
  s0053: {
    literal: 'Fix by central qi; obtain the duke hexagram’s governing period.',
    idiomatic: 'Fix from the central qi; obtain when the duke hexagram governs.',
  },
  s0054: {
    literal:
      'Cumulatively add earth-central stalks to obtain the next hexagram; or add zhen-hui stalks to the marquis hexagram to obtain when the outer hexagram of the twelve nodes governs.',
    idiomatic:
      'Keep adding the earth-central interval for successive hexagrams; or add the zhen-hui interval to the marquis hexagram to obtain when the outer hexagram of the twelve nodes governs.',
  },
  s0055: {
    literal: 'Fix by the four establishments; obtain when spring wood, summer fire, autumn metal, and winter water govern.',
    idiomatic: 'Fix from the four establishment days; obtain when spring Wood, summer Fire, autumn Metal, and winter Water govern.',
  },
  s0056: {
    literal: 'Subtract zhen-hui stalks from the central qi of the last month of the season; obtain when Earth the King governs.',
    idiomatic: 'Subtract the zhen-hui interval from the last seasonal month’s central qi; obtain when Earth the King governs.',
  },
  s0057: {
    literal:
      'Whenever adding or subtracting and the second denominators are not equal, let the denominators cross-multiply the numerators, then add or subtract;',
    idiomatic:
      'Whenever addition or subtraction leaves unequal fractional denominators, cross-multiply numerators by the opposite denominators, then add or subtract;',
  },
  s0058: { literal: 'Denominators multiplied together form the divisor.', idiomatic: 'The product of denominators is the common divisor.' },
  s0059: {
    literal: 'Regular qi, month, mid-node, four cardinal hexagrams',
    idiomatic: 'Regular qi · Month · Mid-node · Four cardinal hexagrams',
  },
  s0060: { literal: 'First hou', idiomatic: 'First hou' },
  s0061: { literal: 'Second hou', idiomatic: 'Second hou' },
  s0062: { literal: 'Last hou', idiomatic: 'Last hou' },
  s0063: { literal: 'Opening hexagram', idiomatic: 'Opening hexagram' },
  s0064: { literal: 'Middle hexagram', idiomatic: 'Middle hexagram' },
  s0065: { literal: 'Closing hexagram', idiomatic: 'Closing hexagram' },
  s0066: {
    literal: 'Winter Solstice · eleventh month, mid-month · Kan, initial six',
    idiomatic: 'Winter Solstice · eleventh month, mid-month · Kan ☵, first line',
  },
  s0067: { literal: 'Earthworms coil', idiomatic: 'Earthworms coil up' },
  s0068: { literal: 'Elk shed their antlers', idiomatic: 'Elk shed their antlers' },
  s0069: { literal: 'Springs stir', idiomatic: 'Springs begin to stir' },
  s0070: { literal: 'Duke · Zhōng Fú', idiomatic: 'Duke · Zhōng Fú' },
  s0071: { literal: 'Sovereign · Fù', idiomatic: 'Sovereign · Fù' },
  s0072: { literal: 'Marquis · Zhūn (inner)', idiomatic: 'Marquis · Zhūn (inner)' },
  s0073: {
    literal: 'Lesser Cold · twelfth month, node · Kan, second nine',
    idiomatic: 'Lesser Cold · twelfth month, node · Kan ☵, second line',
  },
  s0074: { literal: 'Wild geese return north', idiomatic: 'Wild geese fly north' },
  s0075: { literal: 'Magpies begin nesting', idiomatic: 'Magpies begin to nest' },
  s0076: { literal: 'Pheasants first crow', idiomatic: 'Pheasants begin to call' },
  s0077: { literal: 'Marquis · Zhūn (outer)', idiomatic: 'Marquis · Zhūn (outer)' },
  s0078: { literal: 'Great officer · Qiān', idiomatic: 'Great officer · Qiān' },
  s0079: { literal: 'Minister · Kuí', idiomatic: 'Minister · Kuí' },
  s0080: {
    literal: 'Greater Cold · twelfth month, mid-month · Kan, top six',
    idiomatic: 'Greater Cold · twelfth month, mid-month · Kan ☵, third line',
  },
  s0081: { literal: 'Hens begin brooding', idiomatic: 'Hens begin to brood' },
  s0082: { literal: 'Birds of prey grow fierce', idiomatic: 'Birds of prey grow fierce' },
  s0083: { literal: 'Ice thickens at the water’s belly', idiomatic: 'Ice hardens at the depths of the waters' },
  s0084: { literal: 'Duke · Shēng', idiomatic: 'Duke · Shēng' },
  s0085: { literal: 'Sovereign · Lín', idiomatic: 'Sovereign · Lín' },
  s0086: { literal: 'Marquis · Xiǎo Guò (inner)', idiomatic: 'Marquis · Xiǎo Guò (inner)' },
  s0087: {
    literal: 'Start of Spring · first month, node · Kan, fourth six',
    idiomatic: 'Start of Spring · first month, node · Kan ☵, fourth line',
  },
  s0088: { literal: 'East wind melts ice', idiomatic: 'The east wind melts the ice' },
  s0089: { literal: 'Hibernating insects stir', idiomatic: 'Creatures in hibernation begin to stir' },
  s0090: { literal: 'Fish rise to the ice', idiomatic: 'Fish appear beneath the ice' },
  s0091: { literal: 'Marquis · Xiǎo Guò (outer)', idiomatic: 'Marquis · Xiǎo Guò (outer)' },
  s0092: { literal: 'Great officer · Méng', idiomatic: 'Great officer · Méng' },
  s0093: { literal: 'Minister · Yì', idiomatic: 'Minister · Yì' },
  s0094: {
    literal: 'Rain Water · first month, mid-month · Kan, fifth nine',
    idiomatic: 'Rain Water · first month, mid-month · Kan ☵, fifth line',
  },
  s0095: { literal: 'Otters offer fish', idiomatic: 'Otters present fish' },
  s0096: { literal: 'Wild geese arrive', idiomatic: 'Wild geese return' },
  s0097: { literal: 'Plants bud', idiomatic: 'Plants put forth buds' },
  s0098: { literal: 'Duke · Jiàn', idiomatic: 'Duke · Jiàn' },
  s0099: { literal: 'Sovereign · Tài', idiomatic: 'Sovereign · Tài' },
  s0100: { literal: 'Marquis · Xū (inner)', idiomatic: 'Marquis · Xū (inner)' },
};

const path = 'translations/current_translation_xintangshu.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
for (const s of data.sentences) {
  const t = T[s.id];
  if (!t) throw new Error(`Missing translation for ${s.id}`);
  s.literal = t.literal;
  s.idiomatic = t.idiomatic;
}
fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', Object.keys(T).length, 'translations');
