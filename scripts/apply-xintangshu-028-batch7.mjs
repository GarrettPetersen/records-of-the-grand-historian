#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: { literal: 'Fast 1,149', idiomatic: 'Fast accumulation: 1,149' },
  s0602: { literal: 'Day twenty-four', idiomatic: 'Day 24' },
  s0603: { literal: '978', idiomatic: '978' },
  s0604: { literal: 'Retreat 14', idiomatic: 'Tabular retreat: 14' },
  s0605: { literal: '311 degrees 15 parts', idiomatic: '311° 15 parts' },
  s0606: { literal: 'Decrease 157', idiomatic: 'Decrease rate: 157' },
  s0607: { literal: 'Fast 1,033', idiomatic: 'Fast accumulation: 1,033' },
  s0608: { literal: 'Day twenty-five', idiomatic: 'Day 25' },
  s0609: { literal: '964', idiomatic: '964' },
  s0610: { literal: 'Retreat 14', idiomatic: 'Tabular retreat: 14' },
  s0611: { literal: '324 degrees 5 parts', idiomatic: '324° 5 parts' },
  s0612: { literal: 'Decrease 198', idiomatic: 'Decrease rate: 198' },
  s0613: { literal: 'Fast 876', idiomatic: 'Fast accumulation: 876' },
  s0614: { literal: 'Day twenty-six', idiomatic: 'Day 26' },
  s0615: { literal: '950', idiomatic: '950' },
  s0616: { literal: 'Retreat 13', idiomatic: 'Tabular retreat: 13' },
  s0617: { literal: '336 degrees 57 parts', idiomatic: '336° 57 parts' },
  s0618: { literal: 'Decrease 237', idiomatic: 'Decrease rate: 237' },
  s0619: { literal: 'Fast 678', idiomatic: 'Fast accumulation: 678' },
  s0620: { literal: 'Day twenty-seven', idiomatic: 'Day 27' },
  s0621: { literal: '937', idiomatic: '937' },
  s0622: { literal: 'Retreat 13', idiomatic: 'Tabular retreat: 13' },
  s0623: { literal: '349 degrees 19 parts', idiomatic: '349° 19 parts' },
  s0624: { literal: 'Decrease 276', idiomatic: 'Decrease rate: 276' },
  s0625: { literal: 'Fast 441', idiomatic: 'Fast accumulation: 441' },
  s0626: { literal: 'Day twenty-eight', idiomatic: 'Day 28' },
  s0627: { literal: '924', idiomatic: '924' },
  s0628: { literal: 'Retreat 7, advance 6', idiomatic: 'Tabular retreat: 7, advance: 6' },
  s0629: { literal: '361 degrees 44 parts', idiomatic: '361° 44 parts' },
  s0630: { literal: 'Initial decrease 165, terminal increase enters thereafter', idiomatic: 'Initial decrease rate: 165, terminal increase rate enters thereafter' },
  s0631: { literal: 'Fast 165', idiomatic: 'Fast accumulation: 165' },
  s0632: {
    literal:
      'For each, set the increase-decrease rates for the rotation days entered at new, quarter, and full moon; combine the following rate and halve them as the universal rate.',
    idiomatic:
      'For each syzygy, set the increase-decrease rates for the entered rotation days at new, quarter, and full moon; average them with the following rate to obtain the universal rate.',
  },
  s0633: {
    literal: 'Again subtract the two rates; the difference is the rate difference.',
    idiomatic: 'Subtract the two rates; the remainder is the rate difference.',
  },
  s0634: {
    literal:
      'If the prior is greater, subtract the entry remainder from the universal method, multiply the remainder by the rate difference, and when full of the universal method take one; halve together with the rate difference;',
    idiomatic:
      'If the prior rate is larger, subtract the entry remainder from the universal divisor, multiply the remainder by the rate difference, divide by the universal divisor and round up, then halve together with the rate difference;',
  },
  s0635: {
    literal:
      'If the prior is smaller, halve the entry remainder, multiply by the rate difference, and likewise divide by the universal method: this is the hour-added rotation rate.',
    idiomatic:
      'If the prior rate is smaller, halve the entry remainder, multiply by the rate difference, and divide by the universal divisor likewise: this yields the hour-added rotation rate.',
  },
  s0636: {
    literal: 'Then halve it and increase or decrease what is entered at the hour; the remainder is the rotation remainder.',
    idiomatic: 'Halve this and apply increase or decrease to the hour entry; the remainder is the rotation remainder.',
  },
  s0637: {
    literal: 'For the rotation remainder, where increase is due, subtract from the method;',
    idiomatic: 'For the rotation remainder, when increase applies, subtract from the divisor;',
  },
  s0638: {
    literal:
      'where decrease is due, use the remainder as basis: in each case multiply by the rate difference, and when full of the universal method take one and add to the universal rate; multiply by the rotation rate and reduce by the universal method; with fast subtract and slow add to the rotation rate, obtaining the fixed rate.',
    idiomatic:
      'when decrease applies, use the remainder as basis: multiply by the rate difference, divide by the universal divisor and add to the universal rate; multiply by the rotation rate and reduce by the universal divisor; subtract for fast and add for slow to the rotation rate, obtaining the fixed rate.',
  },
  s0639: {
    literal: 'Then with the fixed rate increase or decrease the fast-slow accumulation, obtaining the fixed number.',
    idiomatic: 'Apply the fixed rate to adjust the anomalistic accumulation, yielding the fixed number.',
  },
  s0640: {
    literal: 'Where there is no matching rate thereafter, likewise follow the prior rate.',
    idiomatic: 'When no matching rate follows, proceed from the prior rate in the same way.',
  },
  s0641: {
    literal: 'Where increase is due, take the universal rate as the initial number and subtract half the rate difference;',
    idiomatic: 'When increase applies, take the universal rate as the initial value and subtract half the rate difference;',
  },
  s0642: {
    literal: 'where decrease is due, it is itself the universal rate.',
    idiomatic: 'when decrease applies, the universal rate itself serves.',
  },
  s0643: {
    literal:
      'Where increase-decrease in the entry remainder advances or retreats the day, split the parts across two days and, according to initial or terminal remainder, seek by the method.',
    idiomatic:
      'When adjustment of the entry remainder carries or borrows a day, apportion the parts over two days and compute by initial or terminal remainder as the method requires.',
  },
  s0644: {
    literal: 'What is obtained is together used to increase or decrease the rotation rate.',
    idiomatic: 'Use the result together to adjust the rotation rate.',
  },
  s0645: {
    literal: 'This method originally comes from the Huangji calendar, to exhaust the subtle shifts of computational art.',
    idiomatic: 'This procedure derives from the Huangji calendar, refining the subtle variations of computational astronomy.',
  },
  s0646: {
    literal:
      'If it is not a new or full moon with an eclipse, directly multiply the entry remainder by the increase-decrease rate, as one per universal method, and with that increase or decrease fast-slow, obtaining the fixed number.',
    idiomatic:
      'When new or full moon has no eclipse, multiply the entry remainder directly by the increase-decrease rate, divide by the universal divisor, and adjust fast-slow accordingly to obtain the fixed number.',
  },
  s0647: {
    literal: 'Day seven: initial number 2,701, terminal number 339.',
    idiomatic: 'Day 7: initial value 2,701, terminal value 339.',
  },
  s0648: {
    literal: 'Day fourteen: initial number 2,363, terminal number 677.',
    idiomatic: 'Day 14: initial value 2,363, terminal value 677.',
  },
  s0649: {
    literal: 'Day twenty-one: initial number 2,024, terminal number 1,016.',
    idiomatic: 'Day 21: initial value 2,024, terminal value 1,016.',
  },
  s0650: {
    literal: 'Day twenty-eight: initial number 1,686, terminal number 1,354.',
    idiomatic: 'Day 28: initial value 1,686, terminal value 1,354.',
  },
  s0651: {
    literal: 'Reduce the rotation cycle by the four-image divisor; evenly obtain six days, 2,701 parts.',
    idiomatic: 'Divide the rotation cycle by the four-image divisor; each segment is six days, 2,701 parts.',
  },
  s0652: {
    literal: 'Reduce the full number to approximate eight-ninths of a day.',
    idiomatic: 'Reduce the full count to approximate eight parts in nine of a day.',
  },
  s0653: {
    literal: 'For each, subtract from the method; the remainder is the terminal number.',
    idiomatic: 'For each segment, subtract from the divisor; the remainder is the terminal value.',
  },
  s0654: {
    literal: 'Then add the four-image shifts in sequence, each its corresponding day’s initial and terminal numbers.',
    idiomatic: 'Accumulate the four-image transitions in order, yielding each corresponding day’s initial and terminal values.',
  },
  s0655: {
    literal: 'Inspect the entered rotation remainder: if below the initial number, increase or decrease by the prior rate.',
    idiomatic: 'If the entered rotation remainder falls below the initial value, apply increase or decrease following the prior rate.',
  },
  s0656: {
    literal: 'If above the initial number, reverse the decline and return to the posterior rate.',
    idiomatic: 'If above the initial value, reverse the decline and revert to the posterior rate.',
  },
  s0657: {
    literal:
      'For each, set the major and minor remainders of new, quarter, and full moon; with the fast-slow fixed numbers for entered qi and entered rotation, fast subtract and slow add, obtaining fixed major and minor remainders for new, quarter, and full moon.',
    idiomatic:
      'Set the major and minor remainders for each new, quarter, and full moon; apply the fixed fast-slow numbers for entered qi and rotation—subtract for fast, add for slow—to obtain the fixed syzygy remainders.',
  },
  s0658: {
    literal: 'When the fixed new-moon day name matches the following new moon, the month is long;',
    idiomatic: 'When the fixed new-moon day name matches the next new moon, the month is long;',
  },
  s0659: {
    literal: 'when they differ, it is short;',
    idiomatic: 'when they differ, it is short;',
  },
  s0660: {
    literal: 'when there is no central qi, it is an intercalary month.',
    idiomatic: 'when no central qi falls in the month, it is intercalary.',
  },
  s0661: {
    literal: 'Whenever speaking of midnight, all begin from the middle of early-morning zi before dawn.',
    idiomatic: 'All references to midnight begin from true midnight at the start of zi before dawn.',
  },
  s0662: {
    literal: 'If annotating the calendar, observe the fixed minor remainder at quarter and full moon; if it does not fill the early-morning initial remainder, retreat one day.',
    idiomatic: 'In calendar annotation, if the fixed minor remainder at quarter or full moon does not reach the early-morning initial remainder, set the date back one day.',
  },
  s0663: {
    literal: 'If at full moon there is an eclipse and the onset of waning is already before early morning, likewise.',
    idiomatic: 'The same applies when a full-moon eclipse begins before early morning.',
  },
  s0664: {
    literal: 'Again, the moon’s motion in the nine paths has fast and slow phases, hence there are three long and two short months.',
    idiomatic: 'Because the moon’s nine-path motion varies in speed, months naturally run three long and two short.',
  },
  s0665: {
    literal:
      'Accumulating increase and decrease from the sun’s daily surplus and deficit, one may occasionally get four long and three short; the pattern of numbers allows this.',
    idiomatic:
      'Cumulative adjustment by the sun’s daily equation of time can occasionally yield four long and three short months; the arithmetic permits it.',
  },
  s0666: {
    literal:
      'If one follows the ordinary rule in practice, one should inspect whether the hour-added time is early or late and advance or retreat accordingly, so as not to exceed three long and three short.',
    idiomatic:
      'In practice, inspect whether the hour-added time is early or late and adjust accordingly, keeping within three long and three short months.',
  },
  s0667: {
    literal:
      'If the first-month new moon has an eclipse and the hour-added time is exactly at visibility, shift the long-short determination a month or two before and after, fixing the size so that waning falls on the last or second day.',
    idiomatic:
      'When the first-month new moon has an eclipse at exact visibility, adjust long-short assignment a month or two on either side so that waning falls on the last or second day.',
  },
  s0668: {
    literal: 'For each fixed new, quarter, and full moon at midnight, name the solar degree from the degree and remainder of the day reached.',
    idiomatic: 'For each fixed syzygy at midnight, name the solar longitude from that day’s degree and remainder.',
  },
  s0669: {
    literal: 'Then array the fixed new- and full-moon minor remainders and keep duplicates.',
    idiomatic: 'Array the fixed new- and full-moon minor remainders and keep duplicate tallies.',
  },
  s0670: {
    literal: 'Multiply by that day’s surplus-deficit fraction; as one per universal method; surplus adds and deficit subtracts from the duplicate.',
    idiomatic: 'Multiply by that day’s equation of time, divide by the universal divisor, and add or subtract from the duplicate according to surplus or deficit.',
  },
  s0671: {
    literal: 'Add to the midnight solar degree; each yields the hour-added solar degree.',
    idiomatic: 'Add to the midnight solar longitude to obtain the hour-added solar degree for each.',
  },
  s0672: {
    literal: 'For all syzygies at conjunction, when winter is in yin months and summer in yang months, the moon follows the green path;',
    idiomatic: 'At syzygy, when winter falls in yin months and summer in yang months, the moon follows the green path;',
  },
  s0673: {
    literal:
      'After the Winter and Summer Solstices, the green path’s half-intersection lies in the spring-equinox lodge, east of the Yellow Path.',
    idiomatic:
      'After the Winter and Summer Solstices, the green path’s half-intersection lies at the spring-equinox lodge, east of the ecliptic.',
  },
  s0674: {
    literal:
      'After Start of Winter and Start of Summer, the green path’s half-intersection lies in the Start-of-Spring lodge, southeast of the Yellow Path.',
    idiomatic:
      'After Start of Winter and Start of Summer, the green path’s half-intersection lies at the Start-of-Spring lodge, southeast of the ecliptic.',
  },
  s0675: {
    literal: 'At the lodge of opposition, likewise.',
    idiomatic: 'At the opposing lodge, the same applies.',
  },
  s0676: {
    literal: 'When winter is in yang months and summer in yin months, the moon follows the white path;',
    idiomatic: 'When winter is in yang months and summer in yin months, the moon follows the white path;',
  },
  s0677: {
    literal:
      'After the Winter and Summer Solstices, the white path’s half-intersection lies in the autumn-equinox lodge, west of the Yellow Path.',
    idiomatic:
      'After the Winter and Summer Solstices, the white path’s half-intersection lies at the autumn-equinox lodge, west of the ecliptic.',
  },
  s0678: {
    literal:
      'After Start of Winter and Start of Summer, the white path’s half-intersection lies in the Start-of-Autumn lodge, northwest of the Yellow Path.',
    idiomatic:
      'After Start of Winter and Start of Summer, the white path’s half-intersection lies at the Start-of-Autumn lodge, northwest of the ecliptic.',
  },
  s0679: {
    literal: 'At the lodge of opposition, likewise.',
    idiomatic: 'At the opposing lodge, the same applies.',
  },
  s0680: {
    literal: 'When spring is in yang months and autumn in yin months, the moon follows the vermilion path;',
    idiomatic: 'When spring is in yang months and autumn in yin months, the moon follows the vermilion path;',
  },
  s0681: {
    literal:
      'After the Spring and Autumn Equinoxes, the vermilion path’s half-intersection lies in the summer-solstice lodge, south of the Yellow Path.',
    idiomatic:
      'After the Spring and Autumn Equinoxes, the vermilion path’s half-intersection lies at the summer-solstice lodge, south of the ecliptic.',
  },
  s0682: {
    literal:
      'After Start of Spring and Start of Autumn, the vermilion path’s half-intersection lies in the Start-of-Summer lodge, southwest of the Yellow Path.',
    idiomatic:
      'After Start of Spring and Start of Autumn, the vermilion path’s half-intersection lies at the Start-of-Summer lodge, southwest of the ecliptic.',
  },
  s0683: {
    literal: 'At the lodge of opposition, likewise.',
    idiomatic: 'At the opposing lodge, the same applies.',
  },
  s0684: {
    literal: 'When spring is in yin months and autumn in yang months, the moon follows the black path.',
    idiomatic: 'When spring is in yin months and autumn in yang months, the moon follows the black path.',
  },
  s0685: {
    literal:
      'After the Spring and Autumn Equinoxes, the black path’s half-intersection lies in the winter-solstice lodge, north of the Yellow Path.',
    idiomatic:
      'After the Spring and Autumn Equinoxes, the black path’s half-intersection lies at the winter-solstice lodge, north of the ecliptic.',
  },
  s0686: {
    literal:
      'After Start of Spring and Start of Autumn, the black path’s half-intersection lies in the Start-of-Winter lodge, northeast of the Yellow Path.',
    idiomatic:
      'After Start of Spring and Start of Autumn, the black path’s half-intersection lies at the Start-of-Winter lodge, northeast of the ecliptic.',
  },
  s0687: {
    literal: 'At the lodge of opposition, likewise.',
    idiomatic: 'At the opposing lodge, the same applies.',
  },
  s0688: {
    literal:
      'The four seasons divide into eight nodes; where yin and yang cross, all meet the Yellow Path — hence the moon has nine paths.',
    idiomatic:
      'The four seasons yield eight nodes; at each yin–yang crossing the moon meets the ecliptic — hence nine paths of lunar motion.',
  },
  s0689: {
    literal:
      'For each, observe the Yellow Path solar degree at the initial and middle of the seventy-two hou from the moon’s conjunction entry; every five degrees is one band, again with initial count twelve, each band reduced by one until the count ends at four, then one degree slightly strong, follow the mean.',
    idiomatic:
      'For each conjunction entry, take the ecliptic solar degree at the initial and middle of the seventy-two hou; every five degrees is one band, beginning at twelve and subtracting one per band until four, then one degree slightly strong—use the mean.',
  },
  s0690: {
    literal:
      'Again begin from four; each band adds one until twelve, reaching half-intersection, six degrees from the Yellow Path.',
    idiomatic:
      'Begin again at four; add one per band until twelve at half-intersection, six degrees from the ecliptic.',
  },
  s0691: {
    literal:
      'Again from twelve, each band reduced by one until the count ends at four, also one degree slightly strong, follow the mean.',
    idiomatic:
      'From twelve again, subtract one per band until four, likewise one degree slightly strong—use the mean.',
  },
  s0692: {
    literal: 'Again begin from four; each band adds one until twelve, again meeting the solar track.',
    idiomatic: 'Begin at four again; add one per band until twelve, reuniting with the solar track.',
  },
  s0693: {
    literal: 'In each case accumulate the counts, multiply by the band-number, and as 240 to one obtain degrees.',
    idiomatic: 'Accumulate the counts in order, multiply by the band index, and divide by 240 to obtain degrees.',
  },
  s0694: {
    literal: 'What does not fill, divide by twenty-four for parts; if divided by twenty, the major parts take twelve as denominator.',
    idiomatic: 'The remainder, divided by twenty-four, gives parts; if divided by twenty instead, major parts use twelve as denominator.',
  },
  s0695: {
    literal: 'This is the moon’s motion and Yellow Path difference number.',
    idiomatic: 'This is the lunar ecliptic latitude difference.',
  },
  s0696: {
    literal: 'For nine bands before and after half-intersection, use the difference as decrease;',
    idiomatic: 'Within nine bands on either side of half-intersection, subtract the difference;',
  },
  s0697: {
    literal: 'for nine bands before and after true conjunction, use the difference as increase.',
    idiomatic: 'within nine bands on either side of true conjunction, add the difference.',
  },
  s0698: {
    literal: 'This increase and decrease shifts in and out by six degrees — the number compared solely with the Yellow Path.',
    idiomatic: 'This adjustment shifts latitude by six degrees—the value compared directly with the ecliptic alone.',
  },
  s0699: {
    literal: 'Compared with the equator, it shifts with qi and is not constant.',
    idiomatic: 'Compared with the equator, it varies with the seasons and is not constant.',
  },
  s0700: {
    literal:
      'Count the hou from the Winter or Summer Solstice, multiply the ecliptic difference, and as eighteen to one obtain the moon’s motion and equator difference number.',
    idiomatic:
      'Count hou elapsed since the Winter or Summer Solstice, multiply the ecliptic difference, and divide by eighteen to obtain the lunar equatorial latitude difference.',
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
