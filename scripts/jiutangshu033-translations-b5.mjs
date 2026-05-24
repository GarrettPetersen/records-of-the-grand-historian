/** Jiutangshu ch.033 batch 5: s0401–s0500 (eclipse procedures, Linde calendar) */
import { readFileSync, writeFileSync } from 'fs';

const translations = {
  s0401: {
    literal: 'Like the procedure for finding pitch-pipe qi response added double-hour procedure, then the double-hour where solar eclipse lies and minor and major [degree].',
    idiomatic: 'As in the procedure for finding the pitch-pipe qi response added double-hour, obtain the double-hour where the solar eclipse lies and its minor and major degree.',
  },
  s0402: {
    literal: 'For finding entry double-hour marks: multiply new moon by half double-hour marks; divide by double-hour rate; obtain marks and fractions.',
    idiomatic: 'To find the entry double-hour marks: multiply the new moon by half the double-hour marks, divide by the double-hour rate, and obtain marks and fractions.',
  },
  s0403: {
    literal: 'If eclipse is near morning or evening, use new moon entering qi sunrise and sunset marks to verify eclipse position, knowing eclipse visibility or non-visibility amount; double-hour where it lies is true visibility for total solar or lunar eclipse; at emergence and restoration initial and final, it may also vary from norm and retreat twelve and a half marks before or after visibility to await it.',
    idiomatic: 'If the eclipse falls near dawn or dusk, use the new moon\'s entering qi sunrise and sunset marks to verify the eclipse position and determine how visible it will be; the double-hour where it lies is true visibility for a total solar or lunar eclipse; at emergence and restoration, initial and final moments may also deviate from the norm—retreat twelve and a half marks before or after visibility to await it.',
  },
  s0404: {
    literal: 'Procedure for finding lunar emergence and restoration according to eclipse fraction, following [earlier procedure]',
    idiomatic: 'Procedure for finding lunar emergence and restoration according to eclipse fraction, following the procedure above',
  },
  s0405: {
    literal: 'Procedure for criterion when new moon with Moon on sun-path outer side should not eclipse.',
    idiomatic: 'Procedure for the criterion when a new moon with the Moon on the outer side of the sun\'s path should not eclipse',
  },
  s0406: {
    literal: 'When new moon is on summer solstice first day, criterion: distance from crossing before or after two hundred forty-eight fractions is initial criterion;',
    idiomatic: 'When the new moon falls on the first day of summer solstice, the criterion is: a distance from the crossing before or after of 248 fractions is the initial criterion;',
  },
  s0407: {
    literal: 'Below that, if added double-hour is within seven marks before or after noon culmination—eclipse.',
    idiomatic: 'below that, if the added double-hour falls within seven marks before or after noon culmination, there is an eclipse.',
  },
  s0408: {
    literal: 'New moon distance from summer solstice before or after: each day reduce initial criterion two fractions; completed at ninety-four days before or after; each becomes daily variable criterion.',
    idiomatic: 'For the new moon\'s distance from summer solstice before or after, each day reduce the initial criterion by two fractions; this completes at ninety-four days before or after, each becoming a daily variable criterion.',
  },
  s0409: {
    literal: 'When new moon distance from crossing is at variable criterion or below, added double-hour as above—eclipse.',
    idiomatic: 'When the new moon\'s distance from the crossing is at the variable criterion or below, and the added double-hour is as above, there is an eclipse.',
  },
  s0410: {
    literal: 'Also subtract initial and variable criterion by final criterion sixty; reduce remainder by eighteen—that is mark criterion.',
    idiomatic: 'Also subtract the initial and variable criterion by the final criterion of 60; divide the remainder by 18—that is the mark criterion.',
  },
  s0411: {
    literal: 'Take combined seven marks before or after noon culmination count as time criterion.',
    idiomatic: 'Take the combined count of seven marks before or after noon culmination as the time criterion.',
  },
  s0412: {
    literal: 'Distance-from-crossing fraction within added double-hour criterion: at final criterion or below—both eclipse.',
    idiomatic: 'When the distance-from-crossing fraction is within the added double-hour criterion and at the final criterion or below, both conditions indicate eclipse.',
  },
  s0413: {
    literal: 'Also set final criterion: each mark adds eighteen—that is difference criterion.',
    idiomatic: 'Also set the final criterion: each mark adds 18—that is the difference criterion.',
  },
  s0414: {
    literal: 'Each added double-hour mark: distance from noon before or after at difference-criterion marks or below; distance-from-crossing fraction at difference or below—both eclipse.',
    idiomatic: 'For each added double-hour mark: if the distance from noon before or after is at the difference-criterion marks or below, and the distance-from-crossing fraction is at the difference or below, both indicate eclipse.',
  },
  s0415: {
    literal: 'From autumn equinox to spring equinox: distance from crossing at final criterion or below; added double-hour in three southern double-hours—also eclipse.',
    idiomatic: 'From autumn equinox to spring equinox: if the distance from the crossing is at the final criterion or below and the added double-hour falls in the three southern double-hours, there is also an eclipse.',
  },
  s0416: {
    literal: 'Whenever fixed crossing fraction is outside half a double-hour before or after the double-hour, even if entering eclipse criterion before—that is eclipse.',
    idiomatic: 'Whenever the fixed crossing fraction lies outside half a double-hour before or after the double-hour, even if it enters the eclipse criterion beforehand, that counts as eclipse.',
  },
  s0417: {
    literal: 'Procedure for criterion when new moon with Moon on sun-path inner side should eclipse but does not.',
    idiomatic: 'Procedure for the criterion when a new moon with the Moon on the inner side of the sun\'s path should eclipse but does not',
  },
  s0418: {
    literal: 'New moon on summer solstice day: distance from crossing one thousand three hundred seventy-three—that is initial criterion;',
    idiomatic: 'On summer solstice day at new moon: a distance from the crossing of 1,373 is the initial criterion;',
  },
  s0419: {
    literal: 'Above that, added double-hour within eighteen marks before or after noon culmination—may not eclipse.',
    idiomatic: 'above that, if the added double-hour falls within eighteen marks before or after noon culmination, there may be no eclipse.',
  },
  s0420: {
    literal: 'New moon distance from summer solstice before or after: each day increase initial criterion one and a half fractions; completed at ninety-four days before or after; each becomes daily variable criterion.',
    idiomatic: 'For the new moon\'s distance from summer solstice before or after, each day increase the initial criterion by one and a half fractions; this completes at ninety-four days before or after, each becoming a daily variable criterion.',
  },
  s0421: {
    literal: 'Subtract variable from initial; remainder divide by ten—that is mark criterion.',
    idiomatic: 'Subtract the variable from the initial; divide the remainder by ten—that is the mark criterion.',
  },
  s0422: {
    literal: 'Subtract marks from eighteen marks before or after noon culmination; remainder divide by ten—that is time criterion.',
    idiomatic: 'Subtract the marks from eighteen marks before or after noon culmination; divide the remainder by ten—that is the time criterion.',
  },
  s0423: {
    literal: 'Distance from crossing above variable criterion; added double-hour within criterion—may not eclipse.',
    idiomatic: 'When the distance from the crossing is above the variable criterion and the added double-hour falls within the criterion, there may be no eclipse.',
  },
  s0424: {
    literal: 'Procedure for finding lunar eclipse fraction',
    idiomatic: 'Procedure for finding lunar eclipse fraction',
  },
  s0425: {
    literal: 'Set fixed distance-from-crossing before or after fraction; winter crossing before or after—each subtract two hundred twenty-four.',
    idiomatic: 'Set the fixed distance-from-crossing before or after fraction; for winter crossing before or after, each subtract 224.',
  },
  s0426: {
    literal: 'Spring: after crossing subtract one hundred; before crossing subtract two hundred.',
    idiomatic: 'In spring: after the crossing subtract 100; before the crossing subtract 200.',
  },
  s0427: {
    literal: 'Summer regardless of before or after: subtract fifty.',
    idiomatic: 'In summer, regardless of before or after: subtract 50.',
  },
  s0428: {
    literal: 'Autumn: after crossing subtract two hundred; before crossing subtract one hundred.',
    idiomatic: 'In autumn: after the crossing subtract 200; before the crossing subtract 100.',
  },
  s0429: {
    literal: 'When insufficient to subtract—total eclipse.',
    idiomatic: 'When insufficient to subtract, it is a total eclipse.',
  },
  s0430: {
    literal: 'When there is remainder, subtract from rear criterion; divide by one hundred four.',
    idiomatic: 'When there is a remainder, subtract from the rear criterion and divide by 104.',
  },
  s0431: {
    literal: 'Remainder half divisor or below—half-weak;',
    idiomatic: 'If the remainder is half the divisor or below, it is half-weak;',
  },
  s0432: {
    literal: 'Half divisor or above—half-strong.',
    idiomatic: 'if half the divisor or above, it is half-strong.',
  },
  s0433: {
    literal: 'Assign with fifteen as limit—obtain major lunar eclipse fraction.',
    idiomatic: 'Assign with fifteen as the limit to obtain the major lunar eclipse fraction.',
  },
  s0434: {
    literal: 'Procedure for finding where lunar eclipse begins',
    idiomatic: 'Procedure for finding where lunar eclipse begins',
  },
  s0435: {
    literal: 'Moon on inner path: eclipse in eastern three double-hours, waning begins from below moon slanting south upward; moon from west gradually north, from east gradually south.',
    idiomatic: 'When the Moon is on the inner path: in an eclipse of the eastern three double-hours, obscuration begins from below the moon slanting southward and upward; the moon moves from west gradually northward, from east gradually southward.',
  },
  s0436: {
    literal: 'Eclipse in southern three double-hours, waning begins lower left, greatest at due south, again at lower right.',
    idiomatic: 'In an eclipse of the southern three double-hours, obscuration begins at the lower left, reaches greatest at due south, and again at the lower right.',
  },
  s0437: {
    literal: 'Eclipse in western three double-hours.',
    idiomatic: 'In an eclipse of the western three double-hours:',
  },
  s0438: {
    literal: 'Waning from south gradually east; moon from north gradually west; begins above moon, slanting south downward.',
    idiomatic: 'obscuration proceeds from south gradually eastward; the moon from north gradually westward; it begins above the moon, slanting southward and downward.',
  },
  s0439: {
    literal: 'Moon on outer path: eclipse in eastern three double-hours, waning begins from below moon slanting north upward; waning begins east gradually north, moon from west gradually south.',
    idiomatic: 'When the Moon is on the outer path: in an eclipse of the eastern three double-hours, obscuration begins from below the moon slanting northward and upward; obscuration begins east gradually northward, the moon from west gradually southward.',
  },
  s0440: {
    literal: 'Eclipse in southern three double-hours, waning begins upper left, greatest at due north, again at upper right.',
    idiomatic: 'In an eclipse of the southern three double-hours, obscuration begins at the upper left, reaches greatest at due north, and again at the upper right.',
  },
  s0441: {
    literal: 'Eclipse in western three double-hours.',
    idiomatic: 'In an eclipse of the western three double-hours:',
  },
  s0442: {
    literal: 'Waning from north gradually east; moon from south gradually west; begins above moon, slanting north upward.',
    idiomatic: 'obscuration proceeds from north gradually eastward; the moon from south gradually westward; it begins above the moon, slanting northward and upward.',
  },
  s0443: {
    literal: 'Whenever eclipse is twelve parts or above, all follow ecliptic position for emergence and restoration; at due flank reverse and direct, above and below each passing its fraction.',
    idiomatic: 'Whenever the eclipse is twelve parts or above, emergence and restoration all follow the ecliptic position; at due flank, reverse and direct, above and below—each passing its fraction.',
  },
  s0444: {
    literal: 'Also the path has ascent and descent; each differs; each follows the time to take due position.',
    idiomatic: 'The path also has ascent and descent, each differing; each follows the time to take the due position.',
  },
  s0445: {
    literal: 'Procedure for finding solar eclipse fraction',
    idiomatic: 'Procedure for finding solar eclipse fraction',
  },
  s0446: {
    literal: 'When Moon is on inner path: new moon entering winter solstice through waning Rain Water, and waxing autumn equinox through Great Snow—all use five hundred fifty-eight as eclipse difference.',
    idiomatic: 'When the Moon is on the inner path: from new moon entering winter solstice through waning Rain Water, and from waxing autumn equinox through Great Snow—all use 558 as the eclipse difference.',
  },
  s0447: {
    literal: 'From entering waning spring equinox afterward, each day reduce six fractions; completed at White Dew.',
    idiomatic: 'From entering waning spring equinox onward, each day reduce six fractions until completed at White Dew.',
  },
  s0448: {
    literal: 'Set eclipse distance-from-crossing before or after fixed fraction; all subtract by eclipse difference.',
    idiomatic: 'Set the eclipse distance-from-crossing before or after fixed fraction; subtract the eclipse difference from all.',
  },
  s0449: {
    literal: 'But when distance-from-crossing fraction is insufficient to subtract, all inversely subtract eclipse difference as non-eclipse remainder.',
    idiomatic: 'But when the distance-from-crossing fraction is insufficient to subtract, inversely subtract the eclipse difference as the non-eclipse remainder.',
  },
  s0450: {
    literal: 'From entering waning Minor Fullness through waxing Minor Heat, added double-hour outside seven marks before or after noon culmination—all subtract one time from non-eclipse remainder;',
    idiomatic: 'From entering waning Minor Fullness through waxing Minor Heat, if the added double-hour falls outside seven marks before or after noon culmination, subtract one time from the non-eclipse remainder;',
  },
  s0451: {
    literal: 'Within three marks, add one time to non-eclipse remainder.',
    idiomatic: 'within three marks, add one time to the non-eclipse remainder.',
  },
  s0452: {
    literal: 'Waning Great Cold through waning Start of Spring, five times before crossing outside; Great Heat through waxing Start of Winter, five times after crossing outside—all subtract one time from non-eclipse remainder; within five times add one time.',
    idiomatic: 'From waning Great Cold through waning Start of Spring, outside five times before the crossing; from Great Heat through waxing Start of Winter, outside five times after the crossing—all subtract one time from the non-eclipse remainder; within five times add one time.',
  },
  s0453: {
    literal: 'For all added double-hour eclipse differences that should be subtracted: after crossing subtract; before crossing add.',
    idiomatic: 'For all added double-hour eclipse differences that should be subtracted: after the crossing subtract; before the crossing add.',
  },
  s0454: {
    literal: 'Those that should be added: after crossing add; before crossing subtract.',
    idiomatic: 'Those that should be added: after the crossing add; before the crossing subtract.',
  },
  s0455: {
    literal: 'But when insufficient to subtract—total eclipse.',
    idiomatic: 'But when insufficient to subtract, it is a total eclipse.',
  },
  s0456: {
    literal: 'When addition and subtraction enter non-eclipse limit—may not eclipse.',
    idiomatic: 'When addition and subtraction enter the non-eclipse limit, there may be no eclipse.',
  },
  s0457: {
    literal: 'When Moon is on outer path: winter solstice first day has no eclipse difference.',
    idiomatic: 'When the Moon is on the outer path: the winter solstice first day has no eclipse difference.',
  },
  s0458: {
    literal: 'From afterward each day increase six fractions; accumulate as eclipse difference; completed at waning Rain Water.',
    idiomatic: 'From then on each day increase six fractions, accumulating as the eclipse difference until completed at waning Rain Water.',
  },
  s0459: {
    literal: 'From entering waning spring equinox through waxing White Dew—all use five hundred twenty-two as eclipse difference.',
    idiomatic: 'From entering waning spring equinox through waxing White Dew—all use 522 as the eclipse difference.',
  },
  s0460: {
    literal: 'From entering waxing autumn equinox afterward, each day reduce six fractions; completed at Great Snow.',
    idiomatic: 'From entering waxing autumn equinox onward, each day reduce six fractions until completed at Great Snow.',
  },
  s0461: {
    literal: 'Remainder after reduction—that is eclipse difference.',
    idiomatic: 'The remainder after reduction is the eclipse difference.',
  },
  s0462: {
    literal: 'Add eclipse difference to distance-from-crossing fixed fraction—that is eclipse fraction.',
    idiomatic: 'Add the eclipse difference to the distance-from-crossing fixed fraction—that is the eclipse fraction.',
  },
  s0463: {
    literal: 'Subtract from rear criterion; remainder is non-eclipse fraction.',
    idiomatic: 'Subtract from the rear criterion; the remainder is the non-eclipse fraction.',
  },
  s0464: {
    literal: 'Each set its new-moon eclipse difference; reduce by fifteen; subtract from one hundred four; remainder is fixed divisor.',
    idiomatic: 'Set each new-moon eclipse difference; divide by fifteen; subtract from 104; the remainder is the fixed divisor.',
  },
  s0465: {
    literal: 'Non-eclipse fraction remainder: each as fixed divisor obtains one part.',
    idiomatic: 'For the non-eclipse fraction remainder: each division by the fixed divisor obtains one part.',
  },
  s0466: {
    literal: 'Remainder half divisor or above—half-strong;',
    idiomatic: 'If the remainder is half the divisor or above, it is half-strong;',
  },
  s0467: {
    literal: 'Below—half-weak.',
    idiomatic: 'below, it is half-weak.',
  },
  s0468: {
    literal: 'Subtract fifteen; remainder is major eclipse fraction.',
    idiomatic: 'Subtract fifteen; the remainder is the major eclipse fraction.',
  },
  s0469: {
    literal: 'Procedure for finding where solar eclipse begins',
    idiomatic: 'Procedure for finding where solar eclipse begins',
  },
  s0470: {
    literal: 'Sun on inner path: solar eclipse in eastern three double-hours, waning from above sun near north slanting down; moon gradually northwest, sun gradually southeast.',
    idiomatic: 'When the Sun is on the inner path: in a solar eclipse of the eastern three double-hours, obscuration begins from above the sun near north slanting downward; the moon moves gradually northwest, the sun gradually southeast.',
  },
  s0471: {
    literal: 'Solar eclipse in southern three double-hours, waning begins lower right, greatest at due north, again lower left.',
    idiomatic: 'In a solar eclipse of the southern three double-hours, obscuration begins at the lower right, reaches greatest at due north, and again at the lower left.',
  },
  s0472: {
    literal: 'Moon in south gradually east; sun in north gradually west.',
    idiomatic: 'The moon is in the south gradually eastward; the sun in the north gradually westward.',
  },
  s0473: {
    literal: 'Solar eclipse in western three double-hours.',
    idiomatic: 'In a solar eclipse of the western three double-hours:',
  },
  s0474: {
    literal: 'Moon gradually northeast, sun gradually southwest, waning from below sun near west slanting up.',
    idiomatic: 'the moon moves gradually northeast, the sun gradually southwest; obscuration begins from below the sun near west slanting upward.',
  },
  s0475: {
    literal: 'Sun on outer path: solar eclipse in eastern three double-hours, waning from above sun near south slanting down; moon gradually southeast, sun gradually northwest.',
    idiomatic: 'When the Sun is on the outer path: in a solar eclipse of the eastern three double-hours, obscuration begins from above the sun near south slanting downward; the moon moves gradually southeast, the sun gradually northwest.',
  },
  s0476: {
    literal: 'Solar eclipse in southern three double-hours, waning begins lower right, greatest at due north, again lower left.',
    idiomatic: 'In a solar eclipse of the southern three double-hours, obscuration begins at the lower right, reaches greatest at due north, and again at the lower left.',
  },
  s0477: {
    literal: 'Moon in south gradually east; sun in north gradually west.',
    idiomatic: 'The moon is in the south gradually eastward; the sun in the north gradually westward.',
  },
  s0478: {
    literal: 'Solar eclipse in western three double-hours.',
    idiomatic: 'In a solar eclipse of the western three double-hours:',
  },
  s0479: {
    literal: 'Moon gradually southwest, sun gradually northeast, waning from below sun near south slanting up.',
    idiomatic: 'the moon moves gradually southwest, the sun gradually northeast; obscuration begins from below the sun near south slanting upward.',
  },
  s0480: {
    literal: 'Whenever eclipse is twelve parts or above, begins at due flank.',
    idiomatic: 'Whenever the eclipse is twelve parts or above, it begins at the due flank.',
  },
  s0481: {
    literal: 'Each according to ecliptic ascent and descent to gauge its body.',
    idiomatic: 'Each follows the ecliptic\'s ascent and descent to gauge its disk.',
  },
  s0482: {
    literal: 'Following where it lies, each differs.',
    idiomatic: 'Following where each lies, all differ.',
  },
  s0483: {
    literal: 'Eclipse has initial and final; movement touches its time; as convenient increase and decrease, to fix waning and restoration direction.',
    idiomatic: 'Eclipses have initial and final moments; their movement spans its time; increase and decrease as needed to fix the direction of obscuration and restoration.',
  },
  s0484: {
    literal: 'Procedure for finding solar and lunar eclipse waning initial and restoration final moments',
    idiomatic: 'Procedure for finding the moments of eclipse waning initial and restoration final',
  },
  s0485: {
    literal: 'Set new and full moon eclipse major fraction count as rate.',
    idiomatic: 'Set the new and full moon eclipse major fraction count as the rate.',
  },
  s0486: {
    literal: 'Four parts or above, accordingly increase two.',
    idiomatic: 'Four parts or above: accordingly increase by two.',
  },
  s0487: {
    literal: 'Five parts or above, accordingly increase three.',
    idiomatic: 'Five parts or above: accordingly increase by three.',
  },
  s0488: {
    literal: 'Nine parts or above, accordingly increase four.',
    idiomatic: 'Nine parts or above: accordingly increase by four.',
  },
  s0489: {
    literal: 'Thirteen parts or above, accordingly increase five.',
    idiomatic: 'Thirteen parts or above: accordingly increase by five.',
  },
  s0490: {
    literal: 'Each becomes general-use mark rate; set aside.',
    idiomatic: 'Each becomes a general-use mark rate; set it aside.',
  },
  s0491: {
    literal: 'Multiply by entered rate; set aside.',
    idiomatic: 'Multiply by the entered rate; set aside.',
  },
  s0492: {
    literal: 'Multiply by entered change increase-decrease rate; divide by common divisor; when fast increase-decrease, subtract-add; when slow follow its increase-decrease aside; when done, that is fixed eclipse-use mark count.',
    idiomatic: 'Multiply by the entered change increase-decrease rate; divide by the common divisor; when fast, increase or decrease and subtract or add; when slow, follow its increase-decrease to the aside; when done, that is the fixed eclipse-use mark count.',
  },
  s0493: {
    literal: 'Then multiply by four; divide by ten; subtract from maximum eclipse double-hour marks—that is waning initial.',
    idiomatic: 'Then multiply by four and divide by ten; subtract from the maximum eclipse double-hour marks—that is waning initial.',
  },
  s0494: {
    literal: 'Also multiply by six; divide by ten; add to maximum eclipse double-hour marks—that is restoration final.',
    idiomatic: 'Also multiply by six and divide by ten; add to the maximum eclipse double-hour marks—that is restoration final.',
  },
  s0495: {
    literal: 'According to its fixed added double-hour where it lies in double-hour marks, add and subtract to assign; each its double-hour; lunar eclipse maximum initial and final night-watch tallies.',
    idiomatic: 'According to its fixed added double-hour position in double-hour marks, add and subtract to assign; each to its double-hour; the lunar eclipse maximum initial and final night-watch tallies.',
  },
  s0496: {
    literal: 'Following its sun and moon entered double-hour marks and fractions, according to prior fixed qi encountered night-mark night-watch tally procedure, find its initial and final and maximum night-watch tallies.',
    idiomatic: 'Following the sun and moon\'s entered double-hour marks and fractions, according to the prior fixed qi night-mark night-watch tally procedure, find the initial, final, and maximum night-watch tallies.',
  },
  s0497: {
    literal: 'Kāśyapa Xiaowei and others\' Indian method: first according to sun and moon slow-fast degrees, to derive crossing-entry distance from sun and moon eclipse fraction added double-hour; solar and lunar eclipses also use fifteen parts.',
    idiomatic: 'The Indian method of Kāśyapa Xiaowei and others: first according to the sun and moon\'s slow and fast degrees, derive the crossing-entry distance, eclipse fraction, and added double-hour; solar and lunar eclipses also use fifteen parts.',
  },
  s0498: {
    literal: 'Distance from crossing fifteen, fourteen, thirteen degrees—shadow waning without eclipse method; from here below, then rely on verified eclipse.',
    idiomatic: 'At distances from the crossing of fifteen, fourteen, and thirteen degrees—the shadow-waning non-eclipse method applies; from here below, one then relies on verified eclipse.',
  },
  s0499: {
    literal: 'Twelve degrees fifteen parts—eclipse two parts minor-strong; gradually decreasing by difference; from five and a half degrees above—total eclipse, fourteen parts strong.',
    idiomatic: 'At twelve degrees fifteen parts—an eclipse of two parts minor-strong, gradually decreasing by difference; from five and a half degrees above—a total eclipse of fourteen parts strong.',
  },
  s0500: {
    literal: 'If five degrees with no remainder below—all eclipsed entirely.',
    idiomatic: 'If five degrees with no remainder below, all is entirely eclipsed.',
  },
};

const targetPath = 'translations/current_translation_jiutangshu.json';
const data = JSON.parse(readFileSync(targetPath, 'utf8'));

let applied = 0;
for (const s of data.sentences) {
  const t = translations[s.id];
  if (!t) continue;
  s.literal = t.literal;
  s.idiomatic = t.idiomatic;
  applied++;
}

const missing = data.sentences.filter((s) => !s.literal?.trim() || !s.idiomatic?.trim());
if (missing.length) {
  console.error(`Missing translations: ${missing.map((s) => s.id).join(', ')}`);
  process.exit(1);
}

if (applied !== 100) {
  console.error(`Expected 100 translations, applied ${applied}`);
  process.exit(1);
}

writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Applied ${applied} translations to ${targetPath}`);
console.log('All 100 sentences (s0401–s0500) filled and verified.');
