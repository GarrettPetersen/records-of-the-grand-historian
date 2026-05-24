#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1301: { literal: 'If entering the or-limit, reduce by 152.', idiomatic: 'Under the alternate limit, divide by 152.' },
  s1302: { literal: 'Half and below is half-weak.', idiomatic: 'Half or below: half-weak.' },
  s1303: { literal: 'Above half is half-strong.', idiomatic: 'Above half: half-strong.' },
  s1304: { literal: 'Subtract from fifteen; the remainder is the solar eclipse’s major parts.', idiomatic: 'Subtract from 15; the remainder is solar eclipse magnitude in major parts.' },
  s1305: {
    literal: 'For those classed like yang-calendar eclipse, if departure from conjunction fixed parts are less than the eclipse fixed difference by 60 and below, all are total eclipse.',
    idiomatic: 'Yang-class eclipses: if parts from conjunction are ≤60 below the fixed difference, always total.',
  },
  s1306: {
    literal: 'Above that, add departure from conjunction parts to the yang-calendar eclipse fixed limit; reduce by 90.',
    idiomatic: 'Above that, add parts from conjunction to the yang fixed limit and divide by 90.',
  },
  s1307: {
    literal: 'For yang-calendar eclipse, set departure from conjunction fixed parts; likewise reduce by 90.',
    idiomatic: 'Yang-half eclipse: set parts from conjunction and likewise divide by 90.',
  },
  s1308: { literal: 'If entering the or-limit, reduce by 143.', idiomatic: 'Under the alternate limit, divide by 143.' },
  s1309: { literal: 'All half and below are half-weak.', idiomatic: 'Half or below: half-weak.' },
  s1310: { literal: 'Above half are half-strong.', idiomatic: 'Above half: half-strong.' },
  s1311: { literal: 'Assign it; with fifteen as limit, obtain the solar eclipse’s major parts.', idiomatic: 'Assign with limit 15 for solar eclipse magnitude in major parts.' },
  s1312: {
    literal: 'With the moon in yin calendar, it first rises northwest, culminates due north, then sets northeast.',
    idiomatic: 'Moon in yin half: first visible northwest, greatest at north, then northeast.',
  },
  s1313: {
    literal: 'With the moon in yang calendar, it first rises southwest, culminates due south, then sets southeast.',
    idiomatic: 'Moon in yang half: first visible southwest, greatest at south, then southeast.',
  },
  s1314: {
    literal: 'For eclipses of twelve parts and above, all rise due west and set due east.',
    idiomatic: 'Eclipses of twelve parts or greater rise due west and set due east.',
  },
  s1315: { literal: 'In general, for solar eclipse major parts, each thereby adds two.', idiomatic: 'For solar eclipse magnitude, add two throughout.' },
  s1316: {
    literal: 'For yin calendar, if departure from conjunction fixed parts exceed the eclipse fixed difference by 70 and below, again add;',
    idiomatic: 'Yin half: if parts from conjunction exceed the fixed difference by ≤70, add again;',
  },
  s1317: { literal: '35 and below, again add half.', idiomatic: '≤35 below the difference, add half again.' },
  s1318: {
    literal: 'For those classed like yang calendar, if departure from conjunction fixed parts are less than the eclipse fixed difference by 20 and below, again add half;',
    idiomatic: 'Yang-class: if parts from conjunction are ≤20 below the fixed difference, add half again;',
  },
  s1319: { literal: '4 and below, again add a little.', idiomatic: '≤4 below, add a small increment again.' },
  s1320: { literal: 'Each becomes the general-use mark rate.', idiomatic: 'Each yields the general eclipse duration rate.' },
  s1321: {
    literal: 'Set departure from conjunction fixed parts; multiply by the conjunction rate; twenty times the conjunction number divides it;',
    idiomatic: 'Set parts from conjunction, multiply by the conjunction rate, and divide by twenty times the conjunction number;',
  },
  s1322: {
    literal: 'if the moon’s path and Yellow Path share the same name, add to the fixed new- or full-moon minor remainder;',
    idiomatic: 'if lunar path and ecliptic share the same direction name, add to the fixed syzygy minor remainder;',
  },
  s1323: {
    literal: 'if different names, subtract from the fixed new- or full-moon minor remainder: becoming the eclipse fixed remainder.',
    idiomatic: 'if opposite names, subtract from the fixed syzygy minor remainder for the eclipse fixed remainder.',
  },
  s1324: {
    literal: 'Like seeking the issuing-and-gathering added-time method, enter it to obtain the eclipse culmination chronogram mark.',
    idiomatic: 'Enter by the issuing-and-gathering added-time method to obtain eclipse culmination chronogram marks.',
  },
  s1325: { literal: 'For each, set the general-use mark rate as auxiliary.', idiomatic: 'Set the general duration rate as auxiliary for each.' },
  s1326: {
    literal: 'Multiply by that day’s entry rotation increase-decrease rate; as one per universal divisor.',
    idiomatic: 'Multiply by that day’s rotation increase-decrease rate and divide by the universal divisor.',
  },
  s1327: { literal: 'What is obtained, if it answers tuo, increase or decrease accordingly;', idiomatic: 'Apply the result: if tuo applies, adjust accordingly;' },
  s1328: {
    literal: 'if it answers tiao, add to decrease and subtract to increase on the auxiliary: becoming the fixed-use mark count.',
    idiomatic: 'if tiao applies, invert the adjustment on the auxiliary for the fixed duration count.',
  },
  s1329: { literal: 'Halve it; subtract from the eclipse culmination chronogram mark, obtaining first contact;', idiomatic: 'Halve it, subtract from eclipse culmination marks for first contact;' },
  s1330: { literal: 'add to the eclipse culmination chronogram mark, obtaining last contact.', idiomatic: 'add to culmination marks for last contact.' },
  s1331: {
    literal: 'For lunar eclipse, set the fixed-use mark count; divide by that day’s per-watch mark difference, obtaining watch count.',
    idiomatic: 'Lunar eclipse: set fixed duration, divide by per-watch mark difference for watch count.',
  },
  s1332: { literal: 'What does not exhaust, divide by per-stave mark difference, obtaining stave count.', idiomatic: 'Remainder: divide by per-stave difference for stave count.' },
  s1333: { literal: 'Combine them as the fixed-use watches and staves.', idiomatic: 'Combine for fixed watches and staves.' },
  s1334: {
    literal: 'Then accumulate from after day entry to eclipse culmination chronogram mark and set it; subtract sunset chronogram mark plus dusk marks;',
    idiomatic: 'Sum from after day entry to eclipse culmination, subtract sunset plus dusk marks;',
  },
  s1335: {
    literal: 'what is obtained, assign outside the first-watch stave count, obtaining the eclipse culmination watch and stave.',
    idiomatic: 'divide the remainder by watch-stave difference and assign from first watch for culmination watch and stave.',
  },
  s1336: { literal: 'Subtract half the fixed-use watches and staves, obtaining first contact;', idiomatic: 'Subtract half the fixed watches and staves for first contact;' },
  s1337: { literal: 'add to obtain last contact.', idiomatic: 'add for last contact.' },
  s1338: {
    literal: 'According to the eclipse-dating method transmitted by Kumāra of India: if the sun lodges in the Yùchē palace, eclipse is certain.',
    idiomatic: 'Per Kumāra of India’s eclipse rule: sun in the Yùchē mansion means certain eclipse.',
  },
  s1339: {
    literal: 'For the rest, according to the palace where the sun stands, if Mars is in the three palaces before and five after, and hidden beneath the sun, then no eclipse.',
    idiomatic: 'Otherwise, if Mars lies three mansions before through five after the sun’s mansion, or is occulted beneath the sun, no eclipse.',
  },
  s1340: {
    literal: 'If all five planets are visible, and Mercury is in yin calendar and three stars or more gather in one lodge, then likewise no eclipse.',
    idiomatic: 'If all five planets are visible, Mercury is in the yin half, and three or more stars share one lodge, likewise no eclipse.',
  },
  s1341: {
    literal: 'In general, if star and sun are in different palaces or different lodges it is easy to judge; if in the same lodge it is difficult.',
    idiomatic: 'Stars in a different mansion or lodge from the sun are easy to judge; same lodge is hard.',
  },
  s1342: { literal: 'The twelve palaces spoken of in India are precisely China’s twelve chronograms.', idiomatic: 'India’s twelve palaces are China’s twelve chronogram stations.' },
  s1343: { literal: 'The Yùchē palace is the chronogram of Jiànglóu.', idiomatic: 'Yùchē mansion is the Jiànglóu station.' },
  s1344: { literal: 'Across the nine domains, eclipse differences differ.', idiomatic: 'Eclipse corrections differ across the nine domains.' },
  s1345: {
    literal: 'First measure that place’s solstitial and fixed spring-autumn equinox mean noon gnomon lengths; compare with Yangcheng’s daily mean noon gnomon constants and take agreement; each thereby takes that day’s eclipse difference as that place’s solstitial and fixed equinox eclipse difference.',
    idiomatic: 'Measure local solstitial and equinox noon shadows, match Yangcheng’s daily table, and adopt that day’s eclipse difference for local solstice and equinox corrections.',
  },
  s1346: {
    literal: 'Subtract spring equinox difference from summer solstice difference; subtract winter solstice from spring equinox difference; each becomes a rate.',
    idiomatic: 'Subtract spring from summer solstice difference and winter from spring difference; each is a rate.',
  },
  s1347: { literal: 'Combine the two rates; halve; as one per six, obtaining the summer rate.', idiomatic: 'Sum the rates, halve, divide by six for the summer rate.' },
  s1348: { literal: 'Subtract the two rates; as one per six, obtaining the total difference.', idiomatic: 'Subtract the rates and divide by six for the total difference.' },
  s1349: { literal: 'Set the total difference; as one per six, obtaining the qi difference.', idiomatic: 'Divide the total difference by six for the per-qi difference.' },
  s1350: { literal: 'Half the qi difference, add to the summer rate; again subtract the total difference, obtaining the winter rate.', idiomatic: 'Add half the qi difference to the summer rate, subtract the total difference for the winter rate.' },
  s1351: { literal: 'The winter rate is the Winter Solstice rate.', idiomatic: 'The winter rate is the Winter Solstice rate.' },
  s1352: { literal: 'Each time add the qi difference, each becoming each qi’s fixed rate.', idiomatic: 'Add the qi difference stepwise for each qi’s fixed rate.' },
  s1353: {
    literal: 'Then circulate and accumulate the rates; subtract from the Winter Solstice eclipse difference, each obtaining each qi’s opening day eclipse difference.',
    idiomatic: 'Sum the rates cumulatively and subtract from the Winter Solstice eclipse difference for each qi’s opening eclipse correction.',
  },
  s1354: { literal: 'To seek each day, seek it like the Yangcheng method.', idiomatic: 'For daily values, follow the Yangcheng procedure.' },
  s1355: {
    literal: 'If south of the sub-solar point, one should reckon the location and use it in reverse.',
    idiomatic: 'South of the sub-solar point, reckon the locality and apply the tables in reverse.',
  },
  s1356: { literal: 'Seven: Method for pacing the five planets', idiomatic: 'VII. Method for Determining the Five Planets' },
  s1357: { literal: 'Jupiter', idiomatic: 'Jupiter' },
  s1358: { literal: 'Termination rate 1,212,579, seconds 6.', idiomatic: 'Cycle constant: 1,212,579, seconds 6.' },
  s1359: { literal: 'Termination day 398, remainder 2,659, seconds 6.', idiomatic: 'Sidereal period: 398 days, remainder 2,659, seconds 6.' },
  s1360: { literal: 'Variation difference 34, seconds 14.', idiomatic: 'Variation difference: 34, seconds 14.' },
  s1361: { literal: 'Image count 91, remainder 238, seconds 57, micro-parts 12.', idiomatic: 'Image count: 91, remainder 238, seconds 57, micro-parts 12.' },
  s1362: { literal: 'Line count 15, remainder 166, seconds 42, micro-parts 82.', idiomatic: 'Line count: 15, remainder 166, seconds 42, micro-parts 82.' },
  s1363: { literal: 'Mars', idiomatic: 'Mars' },
  s1364: { literal: 'Termination rate 2,371,003, seconds 86.', idiomatic: 'Cycle constant: 2,371,003, seconds 86.' },
  s1365: { literal: 'Termination day 779, remainder 2,843, seconds 86.', idiomatic: 'Sidereal period: 779 days, remainder 2,843, seconds 86.' },
  s1366: { literal: 'Variation difference 32, seconds 2.', idiomatic: 'Variation difference: 32, seconds 2.' },
  s1367: { literal: 'Image count 91, remainder 238, seconds 43, micro-parts 84.', idiomatic: 'Image count: 91, remainder 238, seconds 43, micro-parts 84.' },
  s1368: { literal: 'Line count 15, remainder 166, seconds 40, micro-parts 62.', idiomatic: 'Line count: 15, remainder 166, seconds 40, micro-parts 62.' },
  s1369: { literal: 'Saturn', idiomatic: 'Saturn' },
  s1370: { literal: 'Termination rate 1,149,399, seconds 98.', idiomatic: 'Cycle constant: 1,149,399, seconds 98.' },
  s1371: { literal: 'Termination day 378, remainder 279, seconds 98.', idiomatic: 'Sidereal period: 378 days, remainder 279, seconds 98.' },
  s1372: { literal: 'Variation difference 22, seconds 92.', idiomatic: 'Variation difference: 22, seconds 92.' },
  s1373: { literal: 'Image count 91, remainder 237, seconds 87.', idiomatic: 'Image count: 91, remainder 237, seconds 87.' },
  s1374: { literal: 'Line count 15, remainder 166, seconds 31, micro-parts 16.', idiomatic: 'Line count: 15, remainder 166, seconds 31, micro-parts 16.' },
  s1375: { literal: 'Venus', idiomatic: 'Venus' },
  s1376: { literal: 'Termination rate 1,775,030, seconds 12.', idiomatic: 'Cycle constant: 1,775,030, seconds 12.' },
  s1377: { literal: 'Termination day 583, remainder 2,711, seconds 12.', idiomatic: 'Synodic period: 583 days, remainder 2,711, seconds 12.' },
  s1378: { literal: 'Median conjunction day 291, remainder 2,875, seconds 6.', idiomatic: 'Half-cycle conjunction: 291 days, remainder 2,875, seconds 6.' },
  s1379: { literal: 'Variation difference 30, seconds 53.', idiomatic: 'Variation difference: 30, seconds 53.' },
  s1380: { literal: 'Image count 91, remainder 238, seconds 34, micro-parts 54.', idiomatic: 'Image count: 91, remainder 238, seconds 34, micro-parts 54.' },
  s1381: { literal: 'Line count 15, remainder 166, seconds 39, micro-parts 9.', idiomatic: 'Line count: 15, remainder 166, seconds 39, micro-parts 9.' },
  s1382: { literal: 'Mercury', idiomatic: 'Mercury' },
  s1383: { literal: 'Termination rate 352,279, seconds 72.', idiomatic: 'Cycle constant: 352,279, seconds 72.' },
  s1384: { literal: 'Termination day 115, remainder 2,679, seconds 72.', idiomatic: 'Synodic period: 115 days, remainder 2,679, seconds 72.' },
  s1385: { literal: 'Median conjunction day 57, remainder 2,859, seconds 86.', idiomatic: 'Half-cycle conjunction: 57 days, remainder 2,859, seconds 86.' },
  s1386: { literal: 'Variation difference 136, seconds 78.', idiomatic: 'Variation difference: 136, seconds 78.' },
  s1387: { literal: 'Image count 91, remainder 244, seconds 98, micro-parts 60.', idiomatic: 'Image count: 91, remainder 244, seconds 98, micro-parts 60.' },
  s1388: { literal: 'Line count 15, remainder 167, seconds 49, micro-parts 74.', idiomatic: 'Line count: 15, remainder 167, seconds 49, micro-parts 74.' },
  s1389: { literal: 'Chronogram divisor 760.', idiomatic: 'Chronogram divisor: 760.' },
  s1390: { literal: 'Seconds divisor 100.', idiomatic: 'Seconds divisor: 100.' },
  s1391: { literal: 'Micro-parts divisor 96.', idiomatic: 'Micro-parts divisor: 96.' },
  s1392: {
    literal: 'Set the median accumulated parts; subtract the Winter Solstice minor remainder; each remove by that star’s termination rate; what does not exhaust, return and subtract from the termination rate;',
    idiomatic: 'Set median accumulated parts, subtract Winter Solstice minor remainder, divide by each planet’s cycle constant; on remainder, subtract from the cycle constant;',
  },
  s1393: {
    literal: 'remainder full of universal divisor becomes days, obtaining the Winter Solstice midnight-after mean-conjunction day count.',
    idiomatic: 'carry the universal divisor into days for the Winter Solstice midnight-after mean conjunction day count.',
  },
  s1394: {
    literal: 'Each multiply the accumulated count by that star’s variation difference; remove what fills circuit-of-heaven substance;',
    idiomatic: 'Multiply accumulated count by each planet’s variation difference and remove circuit-of-heaven fills;',
  },
  s1395: { literal: 'remainder full of universal divisor becomes days.', idiomatic: 'carry remainder into days.' },
  s1396: {
    literal: 'Subtract from the mean-conjunction day count, obtaining the entry-epicycle count.',
    idiomatic: 'Subtract from mean-conjunction day count for entry-epicycle count.',
  },
  s1397: { literal: 'All quarter the remainder alike to match the chronogram divisor.', idiomatic: 'Quarter all remainders alike to match the chronogram divisor.' },
  s1398: {
    literal: 'Then divide by one image’s count; take Lesser Yang, Greater Yang, Lesser Yin, Greater Yin in sequence, starting from outside the Lesser Yang count.',
    idiomatic: 'Divide by one image’s count; take Lesser Yang, Greater Yang, Lesser Yin, Greater Yin in order from outside Lesser Yang.',
  },
  s1399: { literal: 'Remainder divide by one line’s count;', idiomatic: 'Divide the remainder by one line’s count;' },
  s1400: {
    literal: 'what is obtained, assign starting from that image’s opening line count outward, obtaining the entered line count.',
    idiomatic: 'assign from that image’s opening line outward to obtain the entered line count.',
  },
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
