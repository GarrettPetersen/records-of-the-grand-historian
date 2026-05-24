#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1001: { literal: 'Next limit: daily increase 2.', idiomatic: 'Second band: increase 2 per day.' },
  s1002: { literal: 'Next limit: daily increase 3.', idiomatic: 'Third band: increase 3 per day.' },
  s1003: { literal: 'Next limit: daily increase 8.', idiomatic: 'Fourth band: increase 8 per day.' },
  s1004: { literal: 'Final limit: daily increase 12.', idiomatic: 'Final band: increase 12 per day.' },
  s1005: {
    literal: 'For each, set the first day’s ascension-descent rate; according to the limit bands, increase or decrease in sequence to obtain the daily rate.',
    idiomatic: 'Set each first-day ascension-descent rate; step through the limit bands by increase or decrease to obtain the daily rate.',
  },
  s1006: {
    literal: 'Then in succession subtract ascension and add descent to the qi’s initial message wane, each obtaining the daily fixed wane.',
    idiomatic: 'Then successively subtract ascension and add descent from the qi’s opening message wane to obtain the daily fixed wane.',
  },
  s1007: { literal: 'Beneath the sub-solar point in the south, at true center there is no gnomon shadow.', idiomatic: 'Directly beneath the sub-solar point in the south, at true noon there is no shadow.' },
  s1008: { literal: 'One degree north of the sub-solar point, the initial count is 1,379.', idiomatic: 'One degree north of the sub-solar point, the initial count is 1,379.' },
  s1009: {
    literal: 'From this the difference begins; for each degree add 1, ending at 25 degrees, totaling an increase of 26 parts.',
    idiomatic: 'From here the increment begins: add 1 per degree up to 25°, for a total increase of 26 parts.',
  },
  s1010: { literal: 'Again for each degree add 2, ending at 40 degrees.', idiomatic: 'Then add 2 per degree up to 40°.' },
  s1011: { literal: 'Again for each degree add 6, ending at 44 degrees, increase 68.', idiomatic: 'Then add 6 per degree up to 44°, increase 68.' },
  s1012: { literal: 'Again for each degree add 2, ending at 50 degrees.', idiomatic: 'Then add 2 per degree up to 50°.' },
  s1013: { literal: 'Again for each degree add 7, ending at 55 degrees.', idiomatic: 'Then add 7 per degree up to 55°.' },
  s1014: { literal: 'Again for each degree add 19, ending at 60 degrees, increase 160.', idiomatic: 'Then add 19 per degree up to 60°, increase 160.' },
  s1015: { literal: 'Again for each degree add 33, ending at 65 degrees.', idiomatic: 'Then add 33 per degree up to 65°.' },
  s1016: { literal: 'Again for each degree add 36, ending at 70 degrees.', idiomatic: 'Then add 36 per degree up to 70°.' },
  s1017: { literal: 'Again for each degree add 39, ending at 72 degrees, increase 260.', idiomatic: 'Then add 39 per degree up to 72°, increase 260.' },
  s1018: { literal: 'Again per degree add 440.', idiomatic: 'Then add 440 per degree.' },
  s1019: { literal: 'Again per degree add 1,060.', idiomatic: 'Then add 1,060 per degree.' },
  s1020: { literal: 'Again per degree add 1,860.', idiomatic: 'Then add 1,860 per degree.' },
  s1021: { literal: 'Again per degree add 2,840.', idiomatic: 'Then add 2,840 per degree.' },
  s1022: { literal: 'Again per degree add 4,000.', idiomatic: 'Then add 4,000 per degree.' },
  s1023: { literal: 'Again per degree add 5,340.', idiomatic: 'Then add 5,340 per degree.' },
  s1024: { literal: 'Each becomes the per-degree difference.', idiomatic: 'Each value is the per-degree difference.' },
  s1025: {
    literal: 'Accumulate the differences in succession, adding in turn to the initial count; when full, 100 become parts, and 10 parts become cun—each is the per-degree gnomon difference.',
    idiomatic: 'Sum the differences cumulatively onto the initial count; carry hundreds into parts and tens of parts into cun to obtain the per-degree gnomon difference.',
  },
  s1026: { literal: 'Again accumulate the gnomon differences to obtain the gnomon count for each degree north of the sub-solar point.', idiomatic: 'Sum those differences again to obtain the gnomon reading for each degree north of the sub-solar point.' },
  s1027: {
    literal: 'For each, set its qi’s departure from the pole; subtract the pole’s distance from the sub-solar point, 56 degrees and 82½ parts, to obtain the degrees north of the sub-solar point.',
    idiomatic: 'Set the qi’s polar distance and subtract 56° 82½ parts (the pole’s offset from the sub-solar point) to obtain degrees north of the sub-solar point.',
  },
  s1028: {
    literal: 'For each, take the gnomon difference for the degree at which the fixed message wane falls; when full, 100 become parts, and 10 parts become cun, obtaining the daily gnomon difference.',
    idiomatic: 'Take the per-degree gnomon difference at the degree of the fixed message wane; carry hundreds into parts and tens into cun for the daily gnomon difference.',
  },
  s1029: {
    literal: 'Then in succession subtract on waning breath and add on growing breath to the qi’s initial gnomon count, obtaining the daily mean noon gnomon constant.',
    idiomatic: 'Then successively subtract on waning breath and add on growing breath from the qi’s opening gnomon count to obtain the daily mean noon gnomon constant.',
  },
  s1030: {
    literal: 'Take that day’s fixed minor remainder within its qi; subtract the line divisor; the remainder is the after-noon fraction.',
    idiomatic: 'Take the day’s fixed minor remainder within its qi, subtract the line divisor, and the remainder is the after-noon fraction.',
  },
  s1031: { literal: 'If insufficient to subtract, reverse and subtract to obtain the before-noon fraction.', idiomatic: 'If it will not subtract, reverse the subtraction to obtain the before-noon fraction.' },
  s1032: { literal: 'Multiply by its gnomon difference; as one per universal divisor, obtaining the variation difference.', idiomatic: 'Multiply by the gnomon difference, divide by the universal divisor, and obtain the variation difference.' },
  s1033: {
    literal: 'Add or subtract to the mean noon gnomon constant: after Winter Solstice, before noon subtract the difference, after noon add it.',
    idiomatic: 'Apply it to the mean noon gnomon constant: after Winter Solstice, subtract before noon and add after noon.',
  },
  s1034: {
    literal: 'After Summer Solstice, before noon add the difference, after noon subtract it.',
    idiomatic: 'After Summer Solstice, add before noon and subtract after noon.',
  },
  s1035: { literal: 'On Winter Solstice day, there is decrease but no increase.', idiomatic: 'On Winter Solstice day, only decrease applies—no increase.' },
  s1036: { literal: 'On Summer Solstice day, there is increase but no decrease.', idiomatic: 'On Summer Solstice day, only increase applies—no decrease.' },
  s1037: { literal: 'Obtain the daily fixed noon gnomon count.', idiomatic: 'This yields the daily fixed noon gnomon count.' },
  s1038: { literal: 'Again set the fixed message wane; when full of image accumulation, it becomes clepsydra marks; what does not fill becomes parts.', idiomatic: 'Set the fixed message wane again; carry image accumulation into clepsydra marks, leaving the remainder as parts.' },
  s1039: {
    literal: 'For each in succession subtract on waning breath and add on growing breath to the qi’s initial midnight clepsydra leak, obtaining the daily fixed midnight leak count.',
    idiomatic: 'Successively subtract on waning breath and add on growing breath from the qi’s opening midnight leak to obtain the daily fixed midnight leak.',
  },
  s1040: {
    literal: 'For the whole marks, multiply by 9,120; let 19 times the mark parts follow; as one per 300, obtaining the dawn-opening remainder count.',
    idiomatic: 'For whole marks, multiply by 9,120, add 19 times the fractional marks, divide by 300, and obtain the dawn-opening remainder.',
  },
  s1041: { literal: 'For each, double the midnight leak to obtain night marks.', idiomatic: 'Double the midnight leak to obtain night clepsydra marks.' },
  s1042: { literal: 'Subtract from 100 marks; the remainder is day marks.', idiomatic: 'Subtract from 100 marks; the remainder is day marks.' },
  s1043: {
    literal: 'Subtract five day marks and add to night, then day becomes appearance marks and night becomes disappearance marks.',
    idiomatic: 'Move five marks from day to night: day marks become appearance marks, night marks disappearance marks.',
  },
  s1044: {
    literal: 'Add half the disappearance marks to half a chronogram; starting from outside the zi-opening count, obtain the sunrise chronogram mark.',
    idiomatic: 'Add half disappearance marks to half a chronogram; count outward from the zi-opening tally to obtain sunrise chronogram marks.',
  },
  s1045: { literal: 'Add appearance marks and assign it, obtaining sunset.', idiomatic: 'Add appearance marks and assign the count to obtain sunset.' },
  s1046: { literal: 'Set night marks; divide by five to obtain the per-watch difference in marks.', idiomatic: 'Set night marks, divide by five, and obtain the per-watch mark difference.' },
  s1047: { literal: 'Again divide by five to obtain the per-stave difference in marks.', idiomatic: 'Divide by five again for the per-stave mark difference.' },
  s1048: { literal: 'Add dusk marks to the sunset chronogram mark, obtaining the first watch of night A.', idiomatic: 'Add dusk marks to the sunset chronogram mark to obtain the first watch of night A.' },
  s1049: { literal: 'Again add the watch-stave difference to obtain the chronogram for each watch and stave of the five night watches.', idiomatic: 'Add the watch-stave difference repeatedly to obtain the chronogram for each watch and stave of the five night watches.' },
  s1050: { literal: 'The fixed midnight leak is also called dawn-opening night marks.', idiomatic: 'The fixed midnight leak is also called dawn-opening night marks.' },
  s1051: { literal: 'Again set the fixed message wane; when full, 100 become degrees; what does not fill becomes parts.', idiomatic: 'Set the fixed message wane again; carry hundreds into degrees, leaving the remainder as parts.' },
  s1052: {
    literal: 'For each in succession subtract on waning breath and add on growing breath to the qi’s initial departure from the pole, each obtaining the daily fixed departure from the pole.',
    idiomatic: 'Successively subtract on waning breath and add on growing breath from the qi’s opening polar distance to obtain the daily fixed polar distance.',
  },
  s1053: {
    literal: 'Again set the fixed message wane; multiply by 12,386; as one per 16,277, obtaining the degree difference.',
    idiomatic: 'Set the fixed message wane, multiply by 12,386, divide by 16,277, and obtain the degree difference.',
  },
  s1054: { literal: 'When the difference fills 100, it becomes degrees.', idiomatic: 'When the difference fills 100, carry into degrees.' },
  s1055: {
    literal: 'For each in succession add on waning breath and subtract on growing breath from the qi’s initial distance to culminating, obtaining the daily fixed distance to culminating.',
    idiomatic: 'Successively add on waning breath and subtract on growing breath from the qi’s opening distance to culmination to obtain the daily fixed culminating distance.',
  },
  s1056: { literal: 'Double it; subtract from the circuit of heaven to obtain the distance from zi.', idiomatic: 'Double it, subtract from the circuit of heaven, and obtain the distance from zi.' },
  s1057: { literal: 'Set that day’s equatorial solar degree; add the distance to culmination to obtain the dusk culminating star.', idiomatic: 'Take the day’s equatorial solar longitude, add culminating distance, and obtain the dusk culminating star.' },
  s1058: { literal: 'Double the distance from zi; add to the dusk culminating star to obtain the dawn culminating star.', idiomatic: 'Double the distance from zi, add to the dusk star, and obtain the dawn culminating star.' },
  s1059: {
    literal: 'Assign the dusk culminating star as the night-A culminating star; add the per-watch degree difference to obtain the culminating stars for the five night watches.',
    idiomatic: 'Take the dusk culminating star as night A’s culminating star; add the per-watch degree difference for each of the five night watches.',
  },
  s1060: {
    literal: 'In general, wherever the nine domains lie, the mean noon gnomon constants at each qi’s opening are not uniform.',
    idiomatic: 'Across the nine domains, the mean noon gnomon constants at each qi’s opening are not uniform.',
  },
  s1061: {
    literal: 'Have each qi’s departure-from-pole numbers subtract from one another; each difference is that qi’s fixed message count.',
    idiomatic: 'Subtract each qi’s polar distances pairwise; each difference is that qi’s fixed message count.',
  },
  s1062: {
    literal: 'Then measure that place’s solstitial gnomon; measuring one solstice suffices—there is no need to require both winter and summer.',
    idiomatic: 'Measure the locality’s solstitial gnomon; one solstice suffices—both winter and summer need not be taken.',
  },
  s1063: {
    literal: 'Among the per-degree gnomon counts north of the sub-solar point, compare and take those of equal length and shortness as that place’s degrees and parts north of the sub-solar point.',
    idiomatic: 'Among per-degree gnomon counts north of the sub-solar point, match equal shadow lengths to fix that place’s degrees and parts north of the sub-solar point.',
  },
  s1064: { literal: 'For each qi, add or subtract by its fixed message count; for those after Winter Solstice, each qi subtracts.', idiomatic: 'For each qi, apply its fixed message count; after Winter Solstice, subtract for each qi.' },
  s1065: { literal: 'For those after Summer Solstice, each qi adds.', idiomatic: 'After Summer Solstice, add for each qi.' },
  s1066: { literal: 'Obtain each qi’s degrees north of the sub-solar point.', idiomatic: 'This yields each qi’s degrees north of the sub-solar point.' },
  s1067: {
    literal: 'For each, take the gnomon count for its degree and parts as that place’s fixed mean noon gnomon constant at each qi’s opening.',
    idiomatic: 'Take the gnomon count at each degree and part as that locality’s fixed mean noon gnomon constant at each qi’s opening.',
  },
  s1068: {
    literal: 'If the measured gnomon falls south of the table, likewise according to whether its gnomon’s size, length, and shortness match the per-degree counts north of the sub-solar point, thereby take the degree it corresponds to and subtract from the degrees north of the sub-solar point.',
    idiomatic: 'If the measured shadow falls south of the table, match its length to the north-of-sub-solar per-degree table, take the corresponding degree, and subtract from degrees north of the sub-solar point.',
  },
  s1069: { literal: 'Reverse it to obtain degrees south of the sub-solar point.', idiomatic: 'Reverse the sign to obtain degrees south of the sub-solar point.' },
  s1070: { literal: 'Then add or subtract by the fixed message count.', idiomatic: 'Then apply the fixed message count by addition or subtraction.' },
  s1071: {
    literal: 'At each solstice, fix the day-and-night clepsydra marks for that place’s water clock to determine the local day and night mark count.',
    idiomatic: 'At each solstice, calibrate the local water clock to fix the day-and-night clepsydra marks for that place.',
  },
  s1072: { literal: 'Then subtract to obtain the solstitial difference in marks.', idiomatic: 'Subtract the two to obtain the solstitial mark difference.' },
  s1073: {
    literal: 'Halve it; add or subtract to the solstitial day-and-night mark counts to obtain the fixed spring and autumn equinox opening day-and-night mark counts.',
    idiomatic: 'Halve the difference and apply it to the solstitial day-night marks to fix the spring and autumn equinox opening day-night marks.',
  },
  s1074: { literal: 'Then set each qi’s fixed message count.', idiomatic: 'Then set each qi’s fixed message count.' },
  s1075: {
    literal: 'Multiply by the local mark difference; as one per the solstitial departure-from-pole difference of 47 parts 80, obtaining according to parts before and after to add or subtract the opening day-and-night leak marks, each obtaining the remaining fixed qi’s opening day-and-night leak marks.',
    idiomatic: 'Multiply by the local mark difference, divide by the solstitial polar-distance span (47 parts 80), and add or subtract the opening day-night leak marks by fractional rank to obtain each remaining fixed qi’s opening day-night leaks.',
  },
  s1076: {
    literal: 'Set the daily fixed message wane; likewise multiply by the mark difference; as one per degree difference, obtaining to subtract on waning breath and add on growing breath to the qi’s opening leak marks, obtaining the next day.',
    idiomatic: 'Take the daily fixed message wane, multiply by the mark difference, divide by the degree difference, and step the qi’s opening leaks by waning breath and growing breath to obtain the next day.',
  },
  s1077: {
    literal: 'In seeking the distance to culmination and the dusk, dawn, and culminating stars and the sun’s entry and exit, all follow the Yangcheng method.',
    idiomatic: 'Distance to culmination, dusk and dawn culminating stars, and sunrise and sunset are all found by the Yangcheng method.',
  },
  s1078: { literal: 'Still multiply by the mark difference; as one per degree difference, this is the present-part count.', idiomatic: 'Multiply by the mark difference and divide by the degree difference for the present-part correction.' },
  s1079: {
    literal: 'If one sets that place’s fixed spring and autumn equinox mean noon gnomon constant against Yangcheng’s daily gnomon counts and compares for agreement, then according to its day the midnight leak also becomes that place’s fixed spring and autumn equinox opening midnight leak.',
    idiomatic: 'Match the locality’s fixed equinox mean noon gnomon to Yangcheng’s daily table; on the matching day, its midnight leak becomes the locality’s fixed equinox opening midnight leak.',
  },
  s1080: {
    literal: 'To seek the remaining fixed qi’s opening day, likewise use the fixed message count to add or subtract marks and parts before and after the fractional rank; after the spring equinox subtract, after the autumn equinox add.',
    idiomatic: 'For each remaining fixed qi’s opening day, apply the fixed message count to marks and parts by fractional rank—subtract after spring equinox, add after autumn equinox.',
  },
  s1081: { literal: 'When full of image accumulation, it becomes marks.', idiomatic: 'Carry image accumulation into clepsydra marks.' },
  s1082: { literal: 'To seek the next day, likewise use the fixed message wane and follow the Yangcheng procedure.', idiomatic: 'For the next day, step the fixed message wane by the Yangcheng procedure.' },
  s1083: { literal: 'This method exhausts the principle and in the main accords with thoroughness.', idiomatic: 'This method plumbs the principle and is broadly sound.' },
  s1084: { literal: 'Yet on high mountains and level plains, viewing the sun is not equal.', idiomatic: 'Yet mountain heights and level plains do not present the sun equally.' },
  s1085: { literal: 'Compare their day gnomons; only then are length and shortness the same.', idiomatic: 'Only when their noon shadows are compared do lengths agree.' },
  s1086: { literal: 'Examine their water leaks; many and few differ markedly.', idiomatic: 'Water-clock flows differ greatly in rate.' },
  s1087: { literal: 'By this cross-check, the prior method is the sounder.', idiomatic: 'On this comparison, the earlier method is the more reliable.' },
  s1088: { literal: 'Collation note 0.85em|columns=2', idiomatic: '[Collation note]' },
  s1089: { literal: 'Six: Method for pacing conjunctions', idiomatic: 'VI. Method for Determining Conjunctions' },
  s1090: { literal: 'Termination count 827,251,322.', idiomatic: 'Conjunction cycle constant: 827,251,322.' },
  s1091: { literal: 'Conjunction termination day 27, remainder 645, seconds 1,322.', idiomatic: 'Synodic month: 27 days, remainder 645, seconds 1,322.' },
  s1092: { literal: 'Median day 13, remainder 1,842, seconds 5,661.', idiomatic: 'Half-month interval: 13 days, remainder 1,842, seconds 5,661.' },
  s1093: { literal: 'New-moon difference day 2, remainder 967, seconds 8,678.', idiomatic: 'New-moon interval: 2 days, remainder 967, seconds 8,678.' },
  s1094: { literal: 'Full-moon difference day 1, remainder 483, seconds 9,339.', idiomatic: 'Full-moon interval: 1 day, remainder 483, seconds 9,339.' },
  s1095: { literal: 'Full-moon count day 14, remainder 2,326, seconds 5,000.', idiomatic: 'Full-moon count: 14 days, remainder 2,326, seconds 5,000.' },
  s1096: { literal: 'Conjunction limit day 12, remainder 1,358, seconds 6,322.', idiomatic: 'Conjunction limit: 12 days, remainder 1,358, seconds 6,322.' },
  s1097: { literal: 'Conjunction rate 343.', idiomatic: 'Conjunction rate: 343.' },
  s1098: { literal: 'Conjunction number 4,369.', idiomatic: 'Conjunction number: 4,369.' },
  s1099: { literal: 'Conjunction seconds divisor 10,000.', idiomatic: 'Conjunction seconds divisor: 10,000.' },
  s1100: { literal: 'Remove the conjunction number from the new-moon accumulated parts;', idiomatic: 'Divide the new-moon accumulated parts by the conjunction number;' },
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
