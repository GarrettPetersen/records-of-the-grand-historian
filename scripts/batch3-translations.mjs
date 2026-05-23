#!/usr/bin/env node
import fs from 'node:fs';

const file = 'translations/current_translation_songshu.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

/** @type {Record<string, [string, string]>} */
const T = {
  s0201: [
    'Water: at first conjunction with the sun, occultation seventeen days, day remainder 71,210½, motion thirty-four du, degree remainder 71,210½; appearance in the west.',
    'Water: after initial conjunction it is hidden 17 days (day remainder 71,210½), moves 34 du (remainder 71,210½), then appears in the west.',
  ],
  s0202: [
    'Distance from the sun seventeen du.',
    'It stands 17 du from the sun.',
  ],
  s0203: [
    'Direct, fast: daily motion one du and one-third; in eighteen days moves twenty-four du, then becomes slow.',
    'Direct and fast: 1⅓ du per day, 24 du in 18 days, then slowing.',
  ],
  s0204: [
    'Daily motion five parts of seven; in seven days moves five du.',
    'Slow phase: 5/7 du per day, 5 du in 7 days.',
  ],
  s0205: [
    'Stationary—no motion—for four days, then evening hiding in the west.',
    'It stations 4 days, then hides at dusk in the west.',
  ],
  s0206: [
    'Occultation eleven days; retreats six du and conjunction with the sun.',
    'Hidden 11 days, retreating 6 du to rejoin the sun.',
  ],
  s0207: [
    'Again eleven days, retreat six du; morning appearance in the east.',
    'After another 11 days and 6 du of retreat, it appears at dawn in the east.',
  ],
  s0208: ['Stationary four days.', 'It stations another 4 days.'],
  s0209: [
    'Direct, slow: in seven days moves five du.',
    'Direct and slow: 5 du in 7 days.',
  ],
  s0210: [
    'Fast: in eighteen days moves twenty-four du; morning occultation in the east; solar degree remainder as at first; conjunction with the sun.',
    'Fast again: 24 du in 18 days, then dawn occultation and solar re-conjunction with the original remainder.',
  ],
  s0211: [
    'One cycle: one hundred fifteen days, day remainder 66,725; planetary motion likewise.',
    'One synodic cycle: 115 days (remainder 66,725), heliocentric motion matching.',
  ],
  s0212: [
    'One conjunction: fifty-seven days, day remainder 71,210½; planetary motion likewise.',
    'One inferior conjunction: 57 days (remainder 71,210½) with matching arc motion.',
  ],
  s0213: [
    'Surplus add, deficit subtract; divide lunar motion parts by sixteen; divide surplus-deficit parts by the day divisor; subtract from degree parts; surplus add, deficit subtract.',
    'Apply surplus to add and deficit to subtract; scale lunar motion by 16 and surplus-deficit by the day divisor, then adjust the degree fraction accordingly.',
  ],
  s0214: [
    'Method for pushing hexagrams: from Rain Water large and small remainders, add six to the large remainder and 319 to the small remainder; when the small remainder fills 3,648, form one day.',
    'To assign hexagram rulership: take Rain Water\'s sexagenary line and fractional day, add 6 days and 319 parts, and carry at 3,648 parts per day.',
  ],
  s0215: [
    'When days fill twenty-seven, if the remainder is insufficient for addition or subtraction, do not add the circuit void.',
    'At the 27-day limit, if the remainder cannot absorb the adjustment, omit the circuit-void correction.',
  ],
  s0216: [
    'In the twentieth year of Yuanjia, Cheng Tian memorialized to the Secretariat of the Master of Writing: "Now that the Yuanjia Calendar has been adopted, the clepsydra gradations differ from before and ought to be reformed."',
    'In Yuanjia 20, He Chengtian submitted to the Secretariat: "The Yuanjia Calendar is now in force, and its clepsydra periods no longer match the old ones—they should be revised."',
  ],
  s0217: [
    'According to the Jingchu Calendar, the spring-equinox day is long and the autumn-equinox day short; the clepsydra gradations handed down in succession make the daytime clepsydra after the winter solstice on average longer than before the winter solstice.',
    'The Jingchu Calendar holds that spring days are long and autumn days short, yet the inherited clepsydra tables make post-solstice daytime water run longer on average than pre-solstice—',
  ],
  s0218: [
    'Moreover the lengthening and shortening increase and decrease with no gradual transition—not only is the former method imprecise, but each copy also contains transcription errors.',
    'and the shifts come in abrupt jumps rather than smooth steps. The old method was imprecise to begin with, and every hand-copied table added its own mistakes.',
  ],
  s0219: [
    'Now the two solstices and two equinoxes each rest on their proper values.',
    'We have now anchored the two solstices and two equinoxes each to its true position.',
  ],
  s0220: [
    'Then before and after each solstice there is no further discrepancy.',
    'Before and after each solstice, the gradations no longer disagree.',
  ],
  s0221: [
    'Further increase and decrease the old gradations, consult the gnomon shadow, edit and fix them as the standard, and adopt twenty-five arrow-tubes instead.',
    'We adjusted the old marks against sundial shadows, fixed them as the canonical scale, and replaced the tubes with a twenty-five-arrow clepsydra.',
  ],
  s0222: [
    'We request that the Directorate commission the Clepsydra Officer to examine and put it into use.',
    'We ask the Directorate to have the Clepsydra Officer test the new scale and put it into service.',
  ],
  s0223: ['" The request was approved.', 'The memorial was approved.'],
  s0224: [
    'Scholars of former ages, relying on the charts and apocrypha, held that the moon travels nine paths.',
    'Earlier scholars, guided by cosmological charts and apocrypha, taught that the moon follows nine paths.',
  ],
  s0225: [
    'Therefore they drew nine circles intersecting one another; checking the sequence of motion, fast and slow alternated and changed, and the motion could not follow a single regular degree.',
    'They drew nine interlocking circles—but when one traced the moon\'s actual sequence, speed and slowness swapped places and the motion refused to obey a single uniform arc.',
  ],
  s0226: [
    'Liu Xiang\'s discussion of the nine paths states: "The green path emerges twice east of the yellow path; the white path emerges twice west of the yellow path; the black path emerges twice to the north; the red path emerges twice to the south."',
    'Liu Xiang wrote on the nine paths: "Two green paths rise east of the ecliptic, two white paths west, two black paths north, and two red paths south."',
  ],
  s0227: [
    '" He also said: "At Start of Spring and the spring equinox, the moon follows the green path from the east;',
    'He also said: "From Start of Spring through the spring equinox, the moon rides the green path from the east;',
  ],
  s0228: [
    'at Start of Summer and the summer solstice, it follows the red path from the south.',
    'from Start of Summer through the summer solstice, it rides the red path from the south.',
  ],
  s0229: [
    'In autumn it is white; in winter black—each according to its quarter."',
    'in autumn the white path, in winter the black—each in its season."',
  ],
  s0230: [
    '" The sun travels the yellow path, the road of yang; the moon is the essence of yin and does not follow the road of yang. Therefore it sometimes emerges outside or enters inside; its departure from the yellow path may not exceed six du.',
    'The sun keeps to the ecliptic—the highway of yang—while the moon, being yin, does not. It swings outside or dips inside, but never more than six du from the ecliptic.',
  ],
  s0231: [
    'After thirteen days and a fraction it emerges; after emerging, thirteen days and a fraction again to re-enter—in all twenty-seven days for one entry and one exit.',
    'It takes a little over thirteen days to enter, and the same to exit again—twenty-seven days for a full in-and-out cycle.',
  ],
  s0232: [
    'Where it crosses the yellow path and meets the sun, an eclipse occurs.',
    'When it crosses the ecliptic and meets the sun, an eclipse follows.',
  ],
  s0233: [
    'In the Han era Liu Hong examined and checked lunar motion and composed the yin-yang calendar method.',
    'In Han times Liu Hong tested lunar motion and devised the yin-yang calendar method.',
  ],
  s0234: [
    'In the twentieth year of Yuanjia, the Founding Emperor had the Compiler Clerk Wu Gui follow Hong\'s method, establish a new procedure, and order the Grand Astrologer to apply it.',
    'In Yuanjia 20, Emperor Wen ordered Compiler Clerk Wu Gui to adapt Liu Hong\'s method into a new procedure and put it in the hands of the Grand Astrologer.',
  ],
  s0235: [
    'Yuanjia Calendar method for lunar yin-yang motion:',
    'Yuanjia Calendar — lunar latitude (yin-yang) method:',
  ],
  s0236: [
    'Yin-yang calendar surplus-deficit rates and combined numbers.',
    'Table heading: yin-yang calendar surplus-deficit rates and companion numbers.',
  ],
  s0237: [
    'Day one: surplus seventeen, initial.',
    'Day 1: surplus 17 — opening entry.',
  ],
  s0238: [
    'Day two: front limit remainder 665, micro-fraction 1,738, surplus sixteen seventeen.',
    'Day 2: front limit remainder 665, fine fraction 1,738; surplus 16, cumulative 17.',
  ],
  s0239: [
    'Day three: surplus fifteen thirty-three.',
    'Day 3: surplus 15, cumulative 33.',
  ],
  s0240: [
    'Day four: surplus twelve forty-eight.',
    'Day 4: surplus 12, cumulative 48.',
  ],
  s0241: [
    'Day five: surplus eight sixty.',
    'Day 5: surplus 8, cumulative 60.',
  ],
  s0242: [
    'Day six: surplus four sixty-eight.',
    'Day 6: surplus 4, cumulative 68.',
  ],
  s0243: [
    'Day seven: surplus one seventy-two.',
    'Day 7: surplus 1, cumulative 72.',
  ],
  s0244: [
    'Day eight: deficit two seventy-three.',
    'Day 8: deficit 2, balance 73.',
  ],
  s0245: [
    'Day nine: deficit six seventy-one.',
    'Day 9: deficit 6, balance 71.',
  ],
  s0246: [
    'Day ten: deficit sixteen fifteen.',
    'Day 10: deficit 16, total 15.',
  ],
  s0247: [
    'Day eleven: deficit thirteen fifty-five.',
    'Day 11: deficit 13, total 55.',
  ],
  s0248: [
    'Day twelve: deficit fifteen forty-two.',
    'Day 12: deficit 15, total 42.',
  ],
  s0249: [
    'Day thirteen: rear limit remainder 2,019, micro-fraction 1,079, deficit sixteen twenty-seven.',
    'Day 13: rear limit remainder 2,019, fine fraction 1,079; deficit 16, cumulative 27.',
  ],
  s0250: [
    'Split day 2,685½; deficit sixteen; greater value 5,300.',
    'Split-day divisor 2,685½; deficit 16; major constant 5,300.',
  ],
  s0251: [
    'Seventy-one parts: 3,470, remainder twenty-one.',
    'Fraction base 71: quotient 3,470, remainder 21.',
  ],
  s0252: [
    'Calendar circuit: 55,517½.',
    'Anomalistic circumference for this table: 55,517½.',
  ],
  s0253: [
    'Difference rate: 10,190.',
    'Latitude-difference modulus: 10,190.',
  ],
  s0254: [
    'Micro-fraction divisor: 1,878.',
    'Fine-fraction denominator: 1,878.',
  ],
  s0255: [
    'Method for pushing entry into the yin-yang calendar says: remove conjunction months from entry-era accumulated months; multiply the remainder by the conjunction number; add the entry-era conjunction difference; multiply by circuit heaven; what fills the micro-fraction divisor becomes large fraction; what is not exhausted is micro-fraction.',
    'To place the moon in the yin-yang table: reduce epoch months modulo the conjunction period, scale by the conjunction number plus the era\'s conjunction offset, multiply by circuit heaven, and split the product into large and fine fractions at 1,878.',
  ],
  s0256: [
    'When large fraction fills circuit heaven remove it; if the remainder does not fill the calendar circuit, it is entry into the yang calendar.',
    'Reduce modulo circuit heaven; a remainder under the calendar circuit places the moon in the yang (north) column.',
  ],
  s0257: [
    'The remainder all like the lunar circuit obtains one day, outside the count—the first-month conjunction entry into the calendar of the year sought.',
    'Divide the residue by the lunar circuit for whole days beyond the tally—that is the first-month syzygy index in the table.',
  ],
  s0258: [
    'What is not exhausted is the day remainder.',
    'What remains is the fractional day inside the table.',
  ],
  s0259: [
    'To seek the next month, add two days, day remainder 1,331, micro-fraction 1,598; by the method form days; when days fill thirteen remove them; remove the day remainder according to the split day.',
    'For the following month add 2 days, remainder 1,331, and micro-part 1,598, normalize, drop multiples of 13, and reconcile with the split-day rule.',
  ],
  s0260: [
    'When the yin-yang calendar ends and levels into the terminal, if entry into the calendar falls before the front limit remainder or after the rear limit remainder, the moon moves on the middle path.',
    'When the solar-lunar cycle flips, if the index falls before the front limit or after the rear limit, the moon is taken to ride the ecliptic mean.',
  ],
  s0261: [
    'To seek the fixed numbers for new moon, first quarter, full moon, and last quarter: for each, set the slow-fast calendar surplus-deficit fixed accumulated parts; multiply by rule years; divide by the difference divisor; what is obtained filling the communication divisor becomes large fraction.',
    'To correct syzygy instants: take the slow-fast surplus-deficit integral, multiply by rule years (235), divide by the difference divisor, and carry whole parts at the communication divisor.',
  ],
  s0262: [
    'What is not exhausted, multiply by the micro-fraction divisor; by the method obtain micro-fraction.',
    'Scale the remainder by the micro-fraction divisor to recover fine parts.',
  ],
  s0263: [
    'Surplus subtract, deficit add to the yin-yang day remainder; if surplus or deficit is insufficient, advance or retreat the day to fix it; multiply the fixed day remainder by the surplus-deficit combined number for the fixed number at the hour of addition.',
    'Subtract surplus and add deficit to the yin-yang day fraction, rolling the day forward or back if needed; multiply the corrected fraction by the paired adjustment for the true syzygy instant.',
  ],
  s0264: [
    'Method for pushing midnight entry into the calendar: multiply the new-moon small remainder by the difference rate; as the micro-fraction divisor obtains one; subtract from the calendar-entry day remainder; if insufficient, add the lunar circuit and subtract; retreat one day; retreat and obtain the split day and add its fraction; half the micro-fraction becomes small fraction—the new-moon midnight calendar-entry remainder and small fraction.',
    'For midnight on new-moon day: scale the lunation fraction by the difference rate, divide by 1,878, subtract from the table remainder, borrowing the lunar circuit if needed; restore the split-day fraction and halve the fine part for the midnight index.',
  ],
  s0265: [
    'To seek the next day, add one day, day remainder sixteen, small fraction 320; small fraction like the conjunction number follows the remainder; when the remainder fills the lunar circuit remove it and again add one day.',
    'For the next day add 1 day, remainder 16, and small fraction 320 with carries through the conjunction number and lunar circuit.',
  ],
  s0266: [
    'When the calendar ends, if the day remainder fills the split day remove it—this is at the calendar opening.',
    'At cycle bottom, clear split-day overflow to re-enter the table head.',
  ],
  s0267: [
    'If it does not fill the split day, set it straight; add remainder 1,294, small fraction 789½, for entry into the next calendar.',
    'If the split-day slot is short, add 1,294 plus fractional 789½ to step into the next lunation row.',
  ],
  s0268: [
    'To seek the fixed day at midnight: subtract the new-moon small remainder from the slow-fast calendar day remainder at midnight; if less than one day, retreat and obtain the circuit day, add remainder 417—the day and remainder of midnight entry into the calendar.',
    'For the true midnight date: subtract the syzygy fraction from the slow-fast midnight remainder; if under one day, borrow a circuit day and add 417 for the midnight table index.',
  ],
  s0269: [
    'Multiply the day remainder by the surplus-deficit rate and the surplus-deficit accumulated parts for the fixed accumulated parts.',
    'Multiply the day remainder by the rate and the surplus-deficit integral to obtain the corrected integral.',
  ],
  s0270: [
    'What fills the communication divisor becomes large fraction; what is not exhausted, multiply by conjunction months; by the method obtain small fraction; surplus add, deficit subtract from the yin-yang day remainder; if surplus or deficit is insufficient, advance or retreat the day to fix it.',
    'Carry at the communication divisor, scale the tail by conjunction months for small parts, adjust the yin-yang day count, and borrow a lunar-circuit day if needed.',
  ],
  s0271: [
    'Multiply the fixed day remainder by the surplus-deficit rate; as the lunar circuit obtains one; by surplus-deficit combined number—for the fixed number at midnight.',
    'Scale the midnight remainder by the rate, divide by the lunar circuit, and apply the paired number for the true midnight correction.',
  ],
  s0272: [
    'To seek the dusk and dawn numbers: multiply the surplus-deficit rate by the night clepsydra of the nearest solar term; two hundred and one for dawn; subtract from the surplus-deficit rate for dusk; and by surplus-deficit adjust the midnight number for the fixed dusk and dawn numbers.',
    'Multiply the rate by the night run of the neighboring qi and divide by 200 for dawn; subtract from the rate for dusk; combine with the midnight adjustment for definitive twilight values.',
  ],
  s0273: [
    'To seek the moon\'s distance from the yellow path in du: set the fixed number at the hour of addition or at dusk or dawn; divide by twelve for du; the remainder, three and one for shao; what is not exhausted, one for qiang; two shao is weak.',
    'Convert the correction to degrees by dividing by twelve, express thirds as shao and mark strong or weak units.',
  ],
  s0274: [
    'What is obtained is the moon\'s distance from the yellow path in du.',
    'The result is the moon\'s ecliptic latitude.',
  ],
  s0275: [
    'In the sixth year of Daming, Attendant Clerk Zu Chongzhi of Southern Xuzhou submitted a memorial, saying:',
    'In Daming 6, Zu Chongzhi, Attendant Clerk of Southern Xuzhou, submitted this memorial:',
  ],
  s0276: [
    'The ancient calendars are coarse and erroneous, quite lacking in precision; the various schools dispute one another, and none can discern the essentials.',
    'The old calendars are rough and wrong—disputed by every school, yet none can say where the truth lies.',
  ],
  s0277: [
    'What He Chengtian submitted aimed at reform, but the methods he established were oversimplified and are now far off the mark.',
    'He Chengtian meant to reform the system, but his methods were too spare—and time has already proved them inadequate.',
  ],
  s0278: [
    'By my reckoning I have thrice witnessed their errors: the positions of sun and moon differ by fully three du;',
    'I have checked them three times over and found the same failures: sun and moon positions miss by three full du;',
  ],
  s0279: [
    'the gnomon shadows at the two solstices miss by nearly a whole day;',
    'solstice shadows are wrong by nearly a day;',
  ],
  s0280: [
    'the five planets\' appearances and occultations miss by as much as forty days; their stations, retrogradations, advances, and retreats may shift by two lodges.',
    'planetary risings and settings drift by up to forty days, and stations and retrogrades wander two lodges off course.',
  ],
  s0281: [
    'When the quarter days and intercalations are wrong, the nodes and leap months are not correct;',
    'When solstice and equinox dates slip, intercalary months fall in the wrong place;',
  ],
  s0282: [
    'when the lodge degrees depart from Heaven, observation and verification have no standard.',
    'when lodge longitudes drift from the sky, observation loses all anchor.',
  ],
  s0283: [
    'I was born in a sage reign and have reached an age of flourishing fortune; I dare, though blind and foolish, to create a new calendar anew.',
    'I was born under a sage throne, in an age of bright fortune—and though I am no more than a fool, I dare propose a calendar built anew.',
  ],
  s0284: [
    'I respectfully set forth two intentions for change and three points in establishing the method.',
    'My proposal rests on two principles of reform and three foundations for the new method.',
  ],
  s0285: [
    'Of the changes: the first—under the old method one chapter of nineteen years had seven intercalations; the number of intercalations was too great, and after two hundred years the calendar would be off by a day.',
    'First change: the old rule of seven leap months in nineteen years packs in too many intercalations—after two centuries the calendar slips a full day.',
  ],
  s0286: [
    'When nodes and intercalations shift, the method ought to be changed; the repeated migration of calendar eras stems in truth from this clause.',
    'When the leap-month cycle drifts, the method must change—and this, in truth, is why calendar eras keep being replaced.',
  ],
  s0287: [
    'Now I change the intercalation rule: in three hundred ninety-one years there are one hundred forty-four intercalations.',
    'I propose instead 144 leap months in 391 years.',
  ],
  s0288: [
    'Let it then accord with Zhou and Han, and in future it may be used forever without further drift.',
    'This aligns with Zhou and Han practice and should hold without further correction.',
  ],
  s0289: [
    'Second: according to the Canon of Yao: "The days are short and the star is Mao; thereby fix mid-winter."',
    'Second change: the Canon of Yao says, "The days are short and the star Mao culminates—thereby fix mid-winter."',
  ],
  s0290: [
    'Pushing this forward, at the winter solstice of the Tang era the sun stood some fifty du to the left of its present lodge.',
    'By that reckoning, at the Tang-era winter solstice the sun stood some fifty du west of where it stands today.',
  ],
  s0291: [
    'At the beginning of Han they immediately used the Qin calendar; on the winter solstice the sun stood at Ox 6 du.',
    'At the Han founding the Qin calendar was still in use—the winter solstice sun at Ox 6 du.',
  ],
  s0292: [
    'Emperor Wu of Han established the Taichu Calendar; on the winter solstice the sun stood at the head of Ox.',
    'Emperor Wu\'s Taichu Calendar placed the winter solstice at the head of Ox.',
  ],
  s0293: [
    'The Later Han Four Parts Calendar placed it at Dipper 22.',
    'The Later Han Four Parts Calendar placed it at Dipper 22.',
  ],
  s0294: [
    'In Jin, Jiang Ji checked the day by lunar eclipse and knew the winter solstice stood at Dipper 17.',
    'In Jin, Jiang Ji verified by eclipse that the winter solstice stood at Dipper 17.',
  ],
  s0295: [
    'Now, comparing midnight culminating stars and testing by eclipses and full moons, on the winter solstice the sun stands at Dipper 11.',
    'Comparing midnight stars with eclipses and syzygies, I find the winter solstice sun today at Dipper 11.',
  ],
  s0296: [
    'Taken together and calculated, in less than a full century the discrepancy amounts to two du.',
    'Taken together, in less than a century the solstice has drifted two du.',
  ],
  s0297: [
    'The old methods all fixed the winter solstice at a definite position; once the celestial numbers differ, the seven luminaries\' lodge degrees gradually fall out of step with the calendar.',
    'Old methods froze the solstice at a fixed lodge—but as the heavens move, the planets\' positions slowly part company with the calendar.',
  ],
  s0298: [
    'Once the error is plain, the system ought to be changed; methods that barely fit one age cannot reach far; the endless succession of reforms stems again from this clause.',
    'Once the error shows, reform is inevitable; a calendar that barely fits one age cannot serve the long future—and this, too, is why systems are replaced again and again.',
  ],
  s0299: [
    'Now let the winter solstice position differ slightly year by year; checked against Han commentaries, all are exact—and in long use hereafter there will be no need for repeated change.',
    'Let the solstice advance slightly each year instead: checked against Han commentaries, the fit is exact, and the calendar should need no further overhaul.',
  ],
  s0300: [
    'Of the methods established: the first—take zi as the head of the double-hours, its position due north; the line corresponds to the first nine of the hexagrams; the Dipper marks the origin of qi; Emptiness is the center of the northern lodges; at the first origin of primal qi, the era ought to begin here.',
    'First foundation: take zi as the head of the double-hours at due north, matching the first nine of the hexagrams; the Dipper is the origin of celestial qi, Emptiness the hub of the northern lodges—the primal era should begin here.',
  ],
};

let updated = 0;
let missing = [];
for (const s of data.sentences) {
  const pair = T[s.id];
  if (pair) {
    s.literal = pair[0];
    s.idiomatic = pair[1];
    updated++;
  } else {
    missing.push(s.id);
  }
}

fs.writeFileSync(file, JSON.stringify(data, null, 2));

const empty = data.sentences.filter((s) => !s.literal?.trim() || !s.idiomatic?.trim());
console.log(`Updated ${updated} sentences`);
console.log(`Missing map entries: ${missing.length ? missing.join(', ') : 'none'}`);
console.log(`Empty literal/idiomatic remaining: ${empty.length}`);
if (empty.length) {
  console.error(empty.map((s) => s.id).join(', '));
  process.exit(1);
}
