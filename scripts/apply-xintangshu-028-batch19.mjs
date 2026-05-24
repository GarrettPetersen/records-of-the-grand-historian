#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1801: { literal: 'Ephemeris, 11°', idiomatic: 'Ephemeris interval: 11°' },
  s1802: { literal: 'Multiplier 500, divisor 198', idiomatic: 'Multiplier: 500, divisor: 198' },
  s1803: { literal: 'Morning station: 三 days', idiomatic: 'Morning station: 3 days' },
  s1804: { literal: 'Ephemeris, 3°', idiomatic: 'Ephemeris interval: 3°' },
  s1805: { literal: 'Multiplier 498, divisor 198', idiomatic: 'Multiplier: 498, divisor: 198' },
  s1806: { literal: 'Morning slow motion: 6 days, motion 4°', idiomatic: 'Morning slow motion: 6 days, traveling 4°' },
  s1807: { literal: 'Initially slow; daily increase in swiftness 七十六分。 parts', idiomatic: 'Initially slow; daily increase in swiftness of 76 parts' },
  s1808: { literal: 'Ephemeris, 6°', idiomatic: 'Ephemeris interval: 6°' },
  s1809: { literal: 'Multiplier 497, divisor 196', idiomatic: 'Multiplier: 497, divisor: 196' },
  s1810: { literal: 'Morning uniform motion: 9 days, motion 9°', idiomatic: 'Morning uniform motion: 9 days, traveling 9°' },
  s1811: { literal: 'Ephemeris, 9°', idiomatic: 'Ephemeris interval: 9°' },
  s1812: { literal: 'Multiplier 496, divisor 195', idiomatic: 'Multiplier: 496, divisor: 195' },
  s1813: { literal: 'Morning swift motion: 12 days, motion 17°', idiomatic: 'Morning swift motion: 12 days, traveling 17°' },
  s1814: { literal: 'Initially slow; daily increase in swiftness 五十分。 parts', idiomatic: 'Initially slow; daily increase in swiftness of 50 parts' },
  s1815: { literal: 'Ephemeris, 12°', idiomatic: 'Ephemeris interval: 12°' },
  s1816: { literal: 'Multiplier 493, divisor 194', idiomatic: 'Multiplier: 493, divisor: 194' },
  s1817: { literal: 'Morning pre-conjunction hiding: 16 days 715 parts, motion 33° 715 parts', idiomatic: 'Morning pre-conjunction hiding: 16 days 715 parts, traveling 33° 715 parts' },
  s1818: { literal: 'Initially swift; daily increase in slowness 二十二分。 parts', idiomatic: 'Initially swift; daily increase in slowness of 22 parts' },
  s1819: { literal: 'Ephemeris, 16° 715 parts', idiomatic: 'Ephemeris interval: 16° 715 parts' },
  s1820: { literal: 'Multiplier 286, divisor 287', idiomatic: 'Multiplier: 286, divisor: 287' },
  s1821: { literal: 'For each set its native advance-retreat phase rate and the following phase rate.', idiomatic: 'For each, set the native advance-retreat phase rate and the following phase’s rate.' },
  s1822: { literal: 'Where same name, cancel to obtain the difference.', idiomatic: 'Where the names match, cancel to obtain the difference.' },
  s1823: { literal: 'If less before advance, more before retreat, in each case add the difference;', idiomatic: 'If less before advance or more before retreat, add the difference in each case;' },
  s1824: { literal: 'If more before advance, less before retreat, in each case subtract the difference.', idiomatic: 'If more before advance or less before retreat, subtract the difference in each case.' },
  s1825: { literal: 'Where different name, combine as aggregate.', idiomatic: 'Where the names differ, combine as an aggregate.' },
  s1826: { literal: 'Prior retreat and posterior advance: in each case add the aggregate;', idiomatic: 'Prior retreat and posterior advance: add the aggregate in each case;' },
  s1827: { literal: 'Prior advance and posterior retreat: in each case subtract the aggregate.', idiomatic: 'Prior advance and posterior retreat: subtract the aggregate in each case.' },
  s1828: { literal: 'For retrograde degree rates, reverse this.', idiomatic: 'For retrograde degree rates, reverse these rules.' },
  s1829: {
    literal: 'With difference and aggregate alike, add or subtract the daily and degree mean rates; each becomes the daily-degree phase rate.',
    idiomatic: 'Apply the difference and aggregate to adjust the daily and degree mean rates, yielding each daily-degree phase rate.',
  },
  s1830: {
    literal: 'For Mercury’s swift motion, directly add or subtract the degree mean rate with difference and aggregate as the phase rate.',
    idiomatic: 'For Mercury’s swift motion, add or subtract the degree mean rate directly by the difference and aggregate to obtain the phase rate.',
  },
  s1831: { literal: 'For its days, directly take the mean rate as the phase rate; do not add or subtract.', idiomatic: 'For its days, use the mean rate directly as the phase rate without further adjustment.' },
  s1832: {
    literal: 'With the fixed conjunction day and the days from prior-swift initial to posterior-swift initial and from posterior-swift initial to pre-hiding initial, for each cancel same names to difference and combine different names to aggregate.',
    idiomatic: 'Using the fixed-conjunction day and the intervals from prior-swift initial through posterior-swift initial to pre-hiding initial, cancel same-named terms to differences and combine opposite-named terms to aggregates.',
  },
  s1833: { literal: 'In each case quarter.', idiomatic: 'Quarter each result.' },
  s1834: { literal: 'What is obtained, when full of the chronogram method, is the daily degree for each.', idiomatic: 'When the quotient fills the chronogram divisor, it becomes the daily degree for each.' },
  s1835: {
    literal: 'Then with the prior daily degree, expansion adds and contraction subtracts from the post-conjunction hiding degree phase rate and pre-hiding and prior-swift daily phase rates; with the posterior daily degree, expansion subtracts and contraction adds from the posterior-swift daily phase rate and pre-hiding and prior-swift degree phase rates.',
    idiomatic: 'With the prior daily degree, add expansion and subtract contraction from the post-conjunction hiding and pre-hiding prior-swift daily phase rates; with the posterior daily degree, subtract expansion and add contraction from the posterior-swift and pre-hiding prior-swift degree phase rates.',
  },
  s1836: { literal: 'For Venus and Mercury at evening conjunction, reverse the add-subtract.', idiomatic: 'For Venus and Mercury at evening conjunction, reverse the additions and subtractions.' },
  s1837: { literal: 'Station and retreat are likewise.', idiomatic: 'Station and retreat follow the same rule.' },
  s1838: {
    literal: 'If the two station-day phase rates differ from the mean rate, take the excess number as degrees and add or subtract from the native slow-degree phase rate.',
    idiomatic: 'If the two station-day phase rates differ from the mean rate, take the excess as degrees and adjust the native slow-degree phase rate accordingly.',
  },
  s1839: { literal: 'That is: add what exceeds the mean rate, subtract what falls short.', idiomatic: 'Add the amount above the mean rate and subtract the amount below it.' },
  s1840: { literal: 'Below, add-subtract follows this standard.', idiomatic: 'All further adjustments follow this rule.' },
  s1841: {
    literal: 'If the retrograde-degree phase rate differs from the mean rate, double the difference and add or subtract from the native swift-degree phase rate.',
    idiomatic: 'If the retrograde-degree phase rate differs from the mean rate, double the difference and adjust the native swift-degree phase rate.',
  },
  s1842: {
    literal: 'For Wood and Earth, which have no slow or swift phases, add or subtract the prior and posterior prograde degree phase rates.',
    idiomatic: 'For Jupiter and Saturn, which lack slow and swift phases, adjust the prior and posterior prograde degree phase rates instead.',
  },
  s1843: {
    literal: 'If Mercury’s swift-motion degree phase rate differs from the mean rate, take the difference as days and add or subtract the station-day phase rate.',
    idiomatic: 'If Mercury’s swift-motion degree phase rate differs from the mean rate, take the difference in days and adjust the station-day phase rate.',
  },
  s1844: {
    literal: 'If the station-day phase rate is too small to subtract, encroach by diminishing the slow-day phase rate.',
    idiomatic: 'If the station-day phase rate is insufficient to subtract, reduce the slow-day phase rate instead.',
  },
  s1845: {
    literal: 'If greater than the mean rate, likewise take the excess as days and add to the station-day phase rate.',
    idiomatic: 'If it exceeds the mean rate, take the excess in days and add it to the station-day phase rate.',
  },
  s1846: { literal: 'When all phase-rate adjustments are complete, each becomes a fixed daily-degree rate.', idiomatic: 'When all phase-rate adjustments are finished, each becomes a fixed daily-degree rate.' },
  s1847: { literal: 'If the daily fixed rate has fractional parts, pair them front and back.', idiomatic: 'If a daily fixed rate has fractional parts, balance them between adjacent segments.' },
  s1848: { literal: 'Pair means match.', idiomatic: '“Pair” means to match fractions.' },
  s1849: { literal: 'Allocate the smaller fraction to the larger; when full, it becomes a whole day.', idiomatic: 'Transfer the smaller fraction to the larger until a full day is formed.' },
  s1850: { literal: 'Any remainder is reassigned among the other phase rates.', idiomatic: 'Any remainder is redistributed among the other phase rates.' },
  s1851: { literal: 'Where no adjustment applies, rely on the phase rate as the fixed rate.', idiomatic: 'Where no adjustment is needed, use the phase rate directly as the fixed rate.' },
  s1852: { literal: 'Set the star’s fixed-conjunction remainder and subtract from the chronogram method;', idiomatic: 'Set the star’s fixed-conjunction remainder and subtract it from the chronogram divisor;' },
  s1853: {
    literal: 'Multiply the remainder by the star’s initial daily motion parts; as one per chronogram method; add to the fixed-conjunction hour-added degree, obtaining the star degree and remainder at midnight after fixed conjunction.',
    idiomatic: 'Multiply the remainder by the star’s initial daily motion parts, divide by the chronogram divisor, and add to the fixed-conjunction hour-added longitude to obtain the star’s midnight longitude and remainder after conjunction.',
  },
  s1854: { literal: 'From this point each star counts daily motion; all positions start from midnight.', idiomatic: 'Thereafter each star’s daily motion is reckoned from midnight as the starting point.' },
  s1855: { literal: 'For each day add prograde degree-parts and subtract retrograde ones.', idiomatic: 'Each day add prograde degree-parts and subtract retrograde ones.' },
  s1856: { literal: 'Where motion has minor parts, when full of the method carry into the motion parts.', idiomatic: 'When minor parts fill their divisor, carry them into the motion parts.' },
  s1857: { literal: 'Hiding records no degree; station continues the prior; retrograde subtracts accordingly.', idiomatic: 'During hiding no degree is recorded; at station continue the prior value; retrograde subtracts accordingly.' },
  s1858: { literal: 'Prograde leaving the void: remove the six-void difference.', idiomatic: 'On prograde departure from the void, subtract the six-void correction.' },
  s1859: { literal: 'Retrograde entering the void: first add this difference.', idiomatic: 'On retrograde entry into the void, add this correction first.' },
  s1860: { literal: 'The six-void difference is also quartered before use in add-subtract.', idiomatic: 'Quarter the six-void correction before applying it.' },
  s1861: {
    literal: 'When done, reduce motion parts by the conversion method to degrees and parts, obtaining the daily position.',
    idiomatic: 'Finally reduce motion parts by the conversion divisor to degrees and parts for the daily position.',
  },
  s1862: {
    literal: 'Daily-degree fixed rates may add or subtract, making motion swifter or slower day by day; the daily difference cannot be preset.',
    idiomatic: 'Fixed daily-degree rates may increase or decrease, so motion grows swifter or slower daily; the day-by-day difference cannot be preset.',
  },
  s1863: { literal: 'For now we briefly set values from the daily-degree mean rates by estimation.', idiomatic: 'For now we provisionally set values estimated from the daily-degree mean rates.' },
  s1864: {
    literal: 'Since fixed rates already have expansion and contraction, difference numbers should increase or decrease accordingly; first compare each phase’s fixed rate with the mean rate and apply the nearest difference to determine initial and final daily motion parts.',
    idiomatic: 'Because fixed rates already include expansion and contraction, difference numbers should adjust accordingly: first compare each phase’s fixed rate with the mean rate and use the nearest difference to fix initial and final daily motion parts.',
  },
  s1865: {
    literal: 'For the remaining phases, adjust the difference by message accordingly and seek initial and final motion parts for each.',
    idiomatic: 'For the remaining phases, adjust the difference proportionally and determine initial and final motion parts for each.',
  },
  s1866: { literal: 'Compare cyclically so conjunctions align and waxing and waning follow in sequence.', idiomatic: 'Compare cyclically so conjunctions align and accelerations and decelerations follow in turn.' },
  s1867: {
    literal: 'For Metal and Water, take uniform motion as primary; seek prior and posterior phases by this standard.',
    idiomatic: 'For Venus and Mercury, take uniform motion as the baseline and derive other phases accordingly.',
  },
  s1868: {
    literal: 'For pre-conjunction hiding, though a daily-degree fixed rate exists, if addition to conjunction does not agree with the posterior count, take the posterior count as fixed.',
    idiomatic: 'For pre-conjunction hiding, even when a daily-degree fixed rate exists, if the sum at conjunction disagrees with the posterior tally, adopt the posterior tally as fixed.',
  },
  s1869: {
    literal: 'For initial appearance and hiding degrees, solar distance differs; compare daily degrees with the star for each.',
    idiomatic: 'Initial appearance and hiding depend on unequal solar distance; compare the daily degree with the star in each case.',
  },
  s1870: { literal: 'Wood 14° from the sun, Metal 11°, Fire, Earth, and Water 17° each—all appear.', idiomatic: 'Jupiter at 14° from the sun, Venus at 11°, Mars, Saturn, and Mercury at 17°—all become visible.' },
  s1871: { literal: 'Subtract one degree each; all hide.', idiomatic: 'Subtract one degree in each case; all disappear.' },
  s1872: {
    literal: 'For Wood, Fire, and Earth, at the start of prior prograde and end of posterior prograde, and for Metal and Water at swift motion, station, and retrograde initial and final—all are initial days of appearance and hiding; fix by ephemeris message.',
    idiomatic: 'For Jupiter, Mars, and Saturn, the starts of prior prograde and ends of posterior prograde; for Venus and Mercury, swift motion, station, and retrograde initial and final days—all mark appearance and hiding; fix them by ephemeris message.',
  },
  s1873: { literal: 'For Metal, Water, and sun and moon degrees, fractional parts are not recorded.', idiomatic: 'For Venus, Mercury, and solar and lunar degrees, fractional parts are not recorded.' },
  s1874: {
    literal: 'Set the daily fixed rate minus one; multiply by the difference parts; this is the dividend.',
    idiomatic: 'Set the daily fixed rate minus one and multiply by the difference parts for the dividend.',
  },
  s1875: { literal: 'Multiply the difference days by the fixed daily rate; this is the divisor.', idiomatic: 'Multiply the difference days by the fixed daily rate for the divisor.' },
  s1876: { literal: 'Dividend per divisor is one; this is motion parts—the daily difference.', idiomatic: 'Divide the dividend by the divisor to obtain motion parts—the daily difference.' },
  s1877: {
    literal: 'Express the degree fixed rate through the chronogram method with its parts; as one per daily fixed rate; this is uniform-motion degree parts.',
    idiomatic: 'Express the degree fixed rate through the chronogram divisor with its parts; divide by the daily fixed rate to obtain uniform-motion degree parts.',
  },
  s1878: {
    literal: 'Subtract one from the daily fixed rate; multiply by the difference parts; halve; this is the difference rate.',
    idiomatic: 'Subtract one from the daily fixed rate, multiply by the difference parts, and halve to obtain the difference rate.',
  },
  s1879: {
    literal: 'Add or subtract to uniform parts: where swiftness increases, subtract the difference rate from uniform for the initial day and add for the final;',
    idiomatic: 'Adjust uniform parts: when swiftness increases, subtract the difference rate from uniform motion for the first day and add for the last;',
  },
  s1880: {
    literal: 'where slowness increases, add the difference rate to uniform for the initial day and subtract from uniform for the final.',
    idiomatic: 'when slowness increases, add the difference rate to uniform motion for the first day and subtract for the last.',
  },
  s1881: { literal: 'Obtain the degrees and parts traveled on initial and final days.', idiomatic: 'This yields the degrees and parts traveled on the first and last days.' },
  s1882: {
    literal: 'If the difference is incomplete yet matches the days, first set the daily fixed rate minus one and multiply by the difference parts as dividend.',
    idiomatic: 'If the difference does not divide evenly but matches the day-count, set the daily fixed rate minus one, multiply by the difference parts for the dividend.',
  },
  s1883: { literal: 'Double the difference days; this is the divisor.', idiomatic: 'Double the difference days for the divisor.' },
  s1884: { literal: 'Dividend per divisor is one; this is motion parts.', idiomatic: 'Divide to obtain motion parts.' },
  s1885: { literal: 'What does not exhaust becomes minor parts.', idiomatic: 'The remainder becomes minor parts.' },
  s1886: { literal: 'Then this becomes the difference rate.', idiomatic: 'This yields the difference rate.' },
  s1887: {
    literal: 'Set the initial day’s motion parts; where slowness increases, cumulatively subtract the daily difference;',
    idiomatic: 'Set the first day’s motion parts; when slowness increases, cumulatively subtract the daily difference;',
  },
  s1888: {
    literal: 'where swiftness increases, cumulatively add the daily difference: obtain the next day’s degree parts.',
    idiomatic: 'when swiftness increases, cumulatively add the daily difference to obtain the next day’s degree parts.',
  },
  s1889: { literal: 'The daily difference and initial-day motion both have minor parts.', idiomatic: 'Both the daily difference and the first day’s motion have minor parts.' },
  s1890: { literal: 'When denominators differ, make them common before add-subtract.', idiomatic: 'When denominators differ, reduce them to a common denominator before adjusting.' },
  s1891: {
    literal: 'If days are fixed first and degrees sought, subtract one from the sought day, multiply by the daily difference, and halve.',
    idiomatic: 'If the day-count is fixed first and degrees are sought, subtract one from the sought day, multiply by the daily difference, and halve.',
  },
  s1892: {
    literal: 'What is obtained is added or subtracted from the initial day’s motion parts—subtract for increasing slowness, add for increasing swiftness.',
    idiomatic: 'Add or subtract the result from the first day’s motion parts—subtract when slowness increases, add when swiftness increases.',
  },
  s1893: { literal: 'Multiply by the sought days; as one per chronogram method; this is degrees.', idiomatic: 'Multiply by the sought days and divide by the chronogram divisor for degrees.' },
  s1894: {
    literal: 'What does not exhaust is motion parts; obtain accumulated degrees and parts from the initial day to the sought day.',
    idiomatic: 'The remainder is motion parts; sum degrees and parts from the first day to the sought day.',
  },
  s1895: {
    literal: 'If degrees are fixed first and days are sought in return, multiply the sought motion degrees by the chronogram method.',
    idiomatic: 'If degrees are fixed first and days are sought, multiply the sought motion by the chronogram divisor.',
  },
  s1896: { literal: 'If there are parts, carry them.', idiomatic: 'Include fractional parts in the product.' },
  s1897: { literal: 'Multiply by eight; as one per daily difference; this is the accumulation.', idiomatic: 'Multiply by eight and divide by the daily difference to obtain the accumulation.' },
  s1898: {
    literal: 'Double the initial day’s motion parts; add or subtract the daily difference—add for increasing slowness, subtract for increasing swiftness.',
    idiomatic: 'Double the first day’s motion parts and add or subtract the daily difference—add when slowness increases, subtract when swiftness increases.',
  },
  s1899: { literal: 'As one per daily difference; this is the rate.', idiomatic: 'Divide by the daily difference to obtain the rate.' },
  s1900: { literal: 'Square the rate itself; add or subtract the accumulation.', idiomatic: 'Square the rate and add or subtract the accumulation.' },
};

const path = 'translations/current_translation_xintangshu.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
for (const s of data.sentences) {
  const t = T[s.id];
  if (!t) throw new Error(`Missing ${s.id}`);
  s.literal = t.literal;
  s.idiomatic = t.idiomatic;
}
fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', Object.keys(T).length);
