#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1101: {
    literal: 'what does not exhaust, multiply by the seconds divisor; what fills the conjunction number, remove again;',
    idiomatic: 'take the remainder, multiply by the seconds divisor, divide again by the conjunction number;',
  },
  s1102: { literal: 'the remainder as one per seconds divisor becomes the entry-conjunction parts.', idiomatic: 'divide the remainder by the seconds divisor to obtain entry-conjunction parts.' },
  s1103: {
    literal: 'When full of the universal divisor, it becomes days; assign outside the day count, obtaining the heavenly standard canonical new moon’s added-time entry-conjunction general day and remainder.',
    idiomatic: 'Carry the universal divisor into days; count outward from the day tally to obtain the standard new moon’s added-time general conjunction day and remainder.',
  },
  s1104: { literal: 'Thereby add the new-moon difference to obtain the next new moon.', idiomatic: 'Add the new-moon interval to obtain the next new moon.' },
  s1105: { literal: 'Add the full-moon count to the new moon to obtain the full moon.', idiomatic: 'Add the full-moon count to the new moon to obtain full moon.' },
  s1106: {
    literal: 'If one subtracts the canonical new- and full-moon minor remainders, each obtains midnight entry.',
    idiomatic: 'Subtract the canonical new- and full-moon minor remainders to obtain midnight entry for each.',
  },
  s1107: { literal: 'Accumulate by adding one day to obtain the next day.', idiomatic: 'Add one day cumulatively to obtain the next day.' },
  s1108: { literal: 'When the addition fills the conjunction termination, remove it.', idiomatic: 'When the sum fills the synodic month, discard the cycle.' },
  s1109: {
    literal: 'For each, take that day’s entry qi tiao-tuo fixed count; tiao subtracts and tuo adds to the general conjunction, becoming the entry-conjunction regular day and remainder.',
    idiomatic: 'Apply that day’s qi tiao-tuo correction—tiao subtracts, tuo adds—to the general conjunction for the regular conjunction day and remainder.',
  },
  s1110: {
    literal: 'Again multiply that day’s entry rotation tiao-tuo fixed count by the conjunction rate; as one per conjunction number, tiao subtracts and tuo adds to the regular conjunction, becoming the entry-conjunction fixed day and remainder.',
    idiomatic: 'Multiply the day’s rotation tiao-tuo correction by the conjunction rate, divide by the conjunction number, and apply tiao/tuo to the regular conjunction for the fixed conjunction day and remainder.',
  },
  s1111: { literal: 'Each like median day and below is the moon entering the yang calendar;', idiomatic: 'If not above the half-month interval, the moon is in the yang half of the cycle;' },
  s1112: { literal: 'if above, remove it; the remainder is the moon entering the yin calendar.', idiomatic: 'if above, discard the half-month; the remainder is entry into the yin half.' },
  s1113: { literal: 'Yin-yang calendar', idiomatic: 'Yin-Yang Half-Cycle Table' },
  s1114: { literal: 'Line increment-decrement rates', idiomatic: 'Line increment-decrement rates' },
  s1115: { literal: 'Yin-yang accumulation', idiomatic: 'Yin-yang accumulation' },
  s1116: { literal: 'Moon’s departure from the Yellow Path in degrees', idiomatic: 'Lunar latitude from the ecliptic' },
  s1117: { literal: 'Lesser Yang, Lesser Yin, line 1: add 187', idiomatic: 'Lesser Yang / Lesser Yin, line 1: +187' },
  s1118: { literal: 'Yang-Yin, line 1', idiomatic: 'Yang-Yin, line 1' },
  s1119: { literal: 'Void', idiomatic: '—' },
  s1120: { literal: 'Lesser Yang, Lesser Yin, line 2: add 171', idiomatic: 'Lesser Yang / Lesser Yin, line 2: +171' },
  s1121: { literal: 'Yang-Yin 187', idiomatic: 'Yang-Yin accumulation: 187' },
  s1122: { literal: '1 degree 67 parts', idiomatic: '1° 67 parts' },
  s1123: { literal: 'Lesser Yang, Lesser Yin, line 3: add 147', idiomatic: 'Lesser Yang / Lesser Yin, line 3: +147' },
  s1124: { literal: 'Yang-Yin 358', idiomatic: 'Yang-Yin accumulation: 358' },
  s1125: { literal: '2 degrees 118 parts', idiomatic: '2° 118 parts' },
  s1126: { literal: 'Lesser Yang, Lesser Yin, line 4: add 115', idiomatic: 'Lesser Yang / Lesser Yin, line 4: +115' },
  s1127: { literal: 'Yang-Yin 505', idiomatic: 'Yang-Yin accumulation: 505' },
  s1128: { literal: '4 degrees 25 parts', idiomatic: '4° 25 parts' },
  s1129: { literal: 'Lesser Yang, Lesser Yin, line 5: add 75', idiomatic: 'Lesser Yang / Lesser Yin, line 5: +75' },
  s1130: { literal: 'Yang-Yin 620', idiomatic: 'Yang-Yin accumulation: 620' },
  s1131: { literal: '5 degrees 20 parts', idiomatic: '5° 20 parts' },
  s1132: { literal: 'Lesser Yang, Lesser Yin, top line: add 27', idiomatic: 'Lesser Yang / Lesser Yin, top line: +27' },
  s1133: { literal: 'Yang-Yin 695', idiomatic: 'Yang-Yin accumulation: 695' },
  s1134: { literal: '5 degrees 95 parts', idiomatic: '5° 95 parts' },
  s1135: { literal: 'Greater Yang, Greater Yin, line 1: subtract 27', idiomatic: 'Greater Yang / Greater Yin, line 1: −27' },
  s1136: { literal: 'Yang-Yin 722', idiomatic: 'Yang-Yin accumulation: 722' },
  s1137: { literal: '6 degrees 2 parts', idiomatic: '6° 2 parts' },
  s1138: { literal: 'Greater Yang, Greater Yin, line 2: subtract 75', idiomatic: 'Greater Yang / Greater Yin, line 2: −75' },
  s1139: { literal: 'Yang-Yin 695', idiomatic: 'Yang-Yin accumulation: 695' },
  s1140: { literal: '5 degrees 95 parts', idiomatic: '5° 95 parts' },
  s1141: { literal: 'Greater Yang, Greater Yin, line 3: subtract 115', idiomatic: 'Greater Yang / Greater Yin, line 3: −115' },
  s1142: { literal: 'Yang-Yin 620', idiomatic: 'Yang-Yin accumulation: 620' },
  s1143: { literal: '5 degrees 20 parts', idiomatic: '5° 20 parts' },
  s1144: { literal: 'Greater Yang, Greater Yin, line 4: subtract 147', idiomatic: 'Greater Yang / Greater Yin, line 4: −147' },
  s1145: { literal: 'Yang-Yin 505', idiomatic: 'Yang-Yin accumulation: 505' },
  s1146: { literal: '4 degrees 25 parts', idiomatic: '4° 25 parts' },
  s1147: { literal: 'Greater Yang, Greater Yin, line 5: subtract 171', idiomatic: 'Greater Yang / Greater Yin, line 5: −171' },
  s1148: { literal: 'Yang-Yin 358', idiomatic: 'Yang-Yin accumulation: 358' },
  s1149: { literal: '2 degrees 118 parts', idiomatic: '2° 118 parts' },
  s1150: { literal: 'Greater Yang, Greater Yin, top line: subtract 187', idiomatic: 'Greater Yang / Greater Yin, top line: −187' },
  s1151: { literal: 'Yang-Yin 187', idiomatic: 'Yang-Yin accumulation: 187' },
  s1152: { literal: '1 degree 67 parts', idiomatic: '1° 67 parts' },
  s1153: {
    literal: 'Subtract that line’s increment-decrement rate from the next line’s increment-decrement rate, obtaining the forward difference.',
    idiomatic: 'Subtract this line’s rate from the next line’s rate to obtain the forward difference.',
  },
  s1154: {
    literal: 'Again subtract the next line’s rate from the line after that’s rate, obtaining the rear difference.',
    idiomatic: 'Subtract the next line’s rate from the following line’s rate to obtain the rear difference.',
  },
  s1155: { literal: 'Subtract the two differences to obtain the middle difference.', idiomatic: 'Subtract the two differences to obtain the middle difference.' },
  s1156: {
    literal: 'Set the line’s place together with the next line’s increment-decrement rate; add half the middle difference and halve it; as one per fifteen, obtaining the line’s terminal rate, thereby becoming the next line’s opening rate.',
    idiomatic: 'Take the line and next line’s rates, add half the middle difference and halve, divide by 15 for the line’s terminal rate—which becomes the next line’s opening rate.',
  },
  s1157: { literal: 'Each time subtract this line’s opening and terminal rates to obtain the line difference.', idiomatic: 'Subtract opening from terminal rate each line to obtain the line difference.' },
  s1158: { literal: 'As one per fifteen, obtaining the degree difference.', idiomatic: 'Divide by 15 to obtain the per-degree difference.' },
  s1159: {
    literal: 'Halve it; add or subtract to the opening rate—lesser images subtract it, greater images add it—becoming the fixed opening rate.',
    idiomatic: 'Halve the degree difference; apply to the opening rate—subtract for lesser images, add for greater—to fix the opening rate.',
  },
  s1160: { literal: 'Becomes the fixed opening rate.', idiomatic: 'This is the fixed opening rate.' },
  s1161: {
    literal: 'Each time accumulate add or subtract by the degree difference—lesser images subtract the difference, greater images add it—each obtaining the fixed increment-decrement parts for each degree.',
    idiomatic: 'Step by the degree difference—subtract for lesser images, add for greater—to obtain fixed per-degree increment-decrement parts.',
  },
  s1162: { literal: 'Each obtaining the fixed increment-decrement parts for each degree.', idiomatic: 'Each step yields fixed per-degree parts.' },
  s1163: {
    literal: 'Then circulate and accumulate the parts; when full, 120 become degrees, each becoming the moon’s departure from the Yellow Path in degrees and parts.',
    idiomatic: 'Sum the parts cumulatively; at 120 carry into degrees to obtain lunar latitude in degrees and parts.',
  },
  s1164: {
    literal: 'The four images’ opening lines have no opening rate; the top lines have no terminal rate—each doubles that image’s increment-decrement rate and takes one per fifteen.',
    idiomatic: 'Opening lines of the four images lack an opening rate; top lines lack a terminal rate—double the image’s rate and divide by 15.',
  },
  s1165: {
    literal: 'What is obtained, each subtracts from the opening and terminal rates; each mutually obtains its rate.',
    idiomatic: 'Subtract the result from opening and terminal rates to recover the paired rates.',
  },
  s1166: {
    literal: 'For each, set midnight entry rotation; subtract midnight entry-conjunction fixed day and remainder; if insufficient, add the rotation termination.',
    idiomatic: 'Set midnight rotation entry, subtract fixed conjunction day and remainder, adding the rotation cycle if needed.',
  },
  s1167: { literal: 'The remainder is the fixed conjunction opening midnight entry rotation.', idiomatic: 'The remainder is fixed-conjunction opening midnight rotation entry.' },
  s1168: {
    literal: 'Then take the fixed conjunction opening day and its midnight entry remainder; each multiply by that day’s rotation fixed parts; as one per universal divisor, obtaining parts.',
    idiomatic: 'Multiply the fixed conjunction opening day and midnight remainder each by that day’s rotation fixed parts; divide by the universal divisor for parts.',
  },
  s1169: { literal: 'When full of the rotation divisor, it becomes degrees.', idiomatic: 'Carry the rotation divisor into degrees.' },
  s1170: {
    literal: 'Each add to that day’s rotation accumulated degrees and parts; then subtract, and the remainder is that day and night’s half-month motion’s entry into yin-yang degrees and parts.',
    idiomatic: 'Add to the day’s rotation accumulation, then subtract; the remainder is half-month motion into yin-yang degrees and parts for that day and night.',
  },
  s1171: { literal: 'To seek the next day, add the rotation fixed parts.', idiomatic: 'For the next day, add the rotation fixed parts.' },
  s1172: {
    literal: 'Divide by one image’s 90 degrees; if dividing by a lesser image, then also divide the difference degree 1, degree parts 106, major parts 13, and minor parts 14.',
    idiomatic: 'Divide by 90° per image; for a lesser image, also remove difference 1°, 106 parts, 13 major, 14 minor.',
  },
  s1173: { literal: 'When finished, then divide by the next image in sequence.', idiomatic: 'Then divide by successive images in order.' },
  s1174: {
    literal: 'What is obtained, take Lesser Yang, Greater Yang, Lesser Yin, Greater Yin in sequence, starting from outside the Lesser Yang count, obtaining the entered image’s degrees and parts.',
    idiomatic: 'Take the quotient in Lesser Yang, Greater Yang, Lesser Yin, Greater Yin order, counting from outside Lesser Yang, for image degrees and parts.',
  },
  s1175: { literal: 'First multiply the yin-yang degree parts by 30; as one per nineteen, obtaining degree parts.', idiomatic: 'Multiply yin-yang fractional parts by 30 and divide by 19 for degree parts.' },
  s1176: { literal: 'What does not exhaust, multiply by 15 and divide by 19, obtaining major parts.', idiomatic: 'Multiply the remainder by 15, divide by 19, for major parts.' },
  s1177: { literal: 'What still does not exhaust, again multiply and again divide, obtaining minor parts.', idiomatic: 'Repeat multiply-and-divide for minor parts on the remainder.' },
  s1178: { literal: 'Then divide by the image’s degrees and parts.', idiomatic: 'Then divide by the image degrees and parts.' },
  s1179: { literal: 'Then divide by one line’s 15 degrees to obtain the entered line’s degrees and parts.', idiomatic: 'Divide by 15° per line to obtain line degrees and parts.' },
  s1180: {
    literal: 'When the moon’s motion enters within the opening line of a lesser image or within the top line of a greater image, it touches the Yellow Path.',
    idiomatic: 'When the moon enters inside a lesser image’s opening line or a greater image’s top line, it meets the ecliptic.',
  },
  s1181: { literal: 'At new or full moon, there may be wane and eclipse.', idiomatic: 'At syzygy, eclipse may occur.' },
  s1182: { literal: 'In general, fixed entry like full-moon difference and below, conjunction limit and above, is entry into the eclipse limit.', idiomatic: 'Fixed entry from full-moon difference up to conjunction limit defines the eclipse window.' },
  s1183: { literal: 'Full moon entering the eclipse limit, then lunar eclipse.', idiomatic: 'Full moon within the eclipse limit yields lunar eclipse.' },
  s1184: { literal: 'New moon entering the eclipse limit, with the moon in the yin calendar, then solar eclipse.', idiomatic: 'New moon within the limit while the moon is in the yin half yields solar eclipse.' },
  s1185: { literal: 'Like full-moon difference and below is after conjunction.', idiomatic: 'At or below the full-moon difference is after conjunction.' },
  s1186: { literal: 'Conjunction limit and above—subtract from conjunction median—the remainder is before conjunction.', idiomatic: 'At or above the conjunction limit, subtract from the half-month interval; the remainder is before conjunction.' },
  s1187: {
    literal: 'Set the fixed days and remainders before and after conjunction; reduce them to common parts to obtain the fixed parts before and after conjunction.',
    idiomatic: 'Set before- and after-conjunction fixed days and remainders and reduce to common parts from conjunction.',
  },
  s1188: { literal: 'Multiply by 11; divide by 2,643 to obtain the degrees from conjunction.', idiomatic: 'Multiply by 11, divide by 2,643, for degrees from conjunction.' },
  s1189: { literal: 'What does not exhaust, multiply by the universal divisor and divide again for the remainder.', idiomatic: 'On remainder, multiply by the universal divisor and divide again.' },
  s1190: {
    literal: 'In general, from conjunction 13 degrees and above, though within the eclipse limit, because the crossing number is slight and radiance meets, eclipse may not be seen.',
    idiomatic: 'Generally, beyond 13° from conjunction, even inside the eclipse limit, shallow crossing and grazing light may hide the eclipse.',
  },
  s1191: { literal: 'For departure from conjunction parts 779 and below, all are total.', idiomatic: 'Departure from conjunction of 779 parts or less is always total.' },
  s1192: {
    literal: 'Above that, subtract the fixed conjunction parts from the full-moon difference; the remainder, reduced by 183, assign with 15 as limit, obtaining the lunar eclipse’s major parts.',
    idiomatic: 'Above that, subtract fixed conjunction parts from full-moon difference; divide the remainder by 183 with limit 15 for the lunar eclipse magnitude in major parts.',
  },
  s1193: {
    literal: 'With the moon in the yin calendar, it first rises southeast, culminates due south, then sets southwest.',
    idiomatic: 'Moon in the yin half: first visible southeast, greatest at south, then southwest.',
  },
  s1194: {
    literal: 'With the moon in the yang calendar, it first rises northeast, culminates due north, then sets northwest.',
    idiomatic: 'Moon in the yang half: first visible northeast, greatest at north, then northwest.',
  },
  s1195: {
    literal: 'For eclipses of twelve parts and above, they rise due east and set due west.',
    idiomatic: 'Eclipses of twelve parts or greater rise due east and set due west.',
  },
  s1196: { literal: 'This is discussed according to noon proper.', idiomatic: 'This assumes noon as the reference.' },
  s1197: {
    literal: 'For the rest, each follows its direction’s location; take correctness by this standard.',
    idiomatic: 'Elsewhere adjust for local direction against this standard.',
  },
  s1198: { literal: 'In general, for lunar eclipse major parts five and below, thereby add three.', idiomatic: 'For lunar eclipse magnitude five parts or less, add three.' },
  s1199: { literal: 'Ten and below, thereby add four.', idiomatic: 'Ten or less, add four.' },
  s1200: { literal: 'Above ten, thereby add five.', idiomatic: 'Above ten, add five.' },
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
