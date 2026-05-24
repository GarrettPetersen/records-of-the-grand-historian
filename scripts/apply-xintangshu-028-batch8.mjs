#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0701: {
    literal: 'For the sun, inside the equator is yin and outside is yang;',
    idiomatic: 'For the sun, inside the equator is yin and outside is yang;',
  },
  s0702: {
    literal: 'for the moon, inside the Yellow Path is yin and outside is yang.',
    idiomatic: 'for the moon, inside the ecliptic is yin and outside is yang.',
  },
  s0703: {
    literal:
      'Hence for the moon’s lodge motion, after entering the spring-equinox intersection it follows yin months and after the autumn-equinox intersection yang months — both are same name.',
    idiomatic:
      'Hence after the spring-equinox crossing the moon follows yin months, and after the autumn-equinox crossing yang months — both are same-named.',
  },
  s0704: {
    literal:
      'If after the spring-equinox intersection it follows yang months, or after the autumn-equinox intersection yin months, both are different name.',
    idiomatic:
      'If after the spring-equinox crossing it follows yang months, or after the autumn-equinox crossing yin months, both are differently named.',
  },
  s0705: {
    literal: 'Where same name, where the difference is increase, add it;',
    idiomatic: 'Under same name, where the difference is for increase, add it;',
  },
  s0706: {
    literal: 'where decrease, subtract it.',
    idiomatic: 'where for decrease, subtract it.',
  },
  s0707: {
    literal: 'Where different name, where the difference is increase, subtract it;',
    idiomatic: 'Under different name, where the difference is for increase, subtract it;',
  },
  s0708: {
    literal: 'where decrease, add it.',
    idiomatic: 'where for decrease, add it.',
  },
  s0709: {
    literal: 'In each case use this to increase or decrease the Yellow Path degree, obtaining the nine-path fixed degree.',
    idiomatic: 'Apply these rules to adjust ecliptic longitude and obtain the fixed nine-path degree.',
  },
  s0710: {
    literal:
      'For each, with central qi subtract the count of days from mean new moon, add its entered conjunction general, then subtract from conjunction cycle to obtain the mean conjunction’s day-count within central qi.',
    idiomatic:
      'For each central qi, subtract days from mean new moon, add the entered conjunction general term, and subtract from the conjunction cycle to obtain the mean conjunction’s day-count within that qi.',
  },
  s0711: {
    literal: 'When full of the three-origin interval, remove it; the remainder is the day-count entering the following node.',
    idiomatic: 'Cast out full three-origin intervals; the remainder is the day-count entering the next node.',
  },
  s0712: {
    literal:
      'To seek the next conjunction, add the conjunction cycle; when full of the three-origin interval, remove it, obtaining the posterior mean conjunction’s day-count within qi.',
    idiomatic:
      'To find the next conjunction, add the conjunction cycle and cast out full three-origin intervals, yielding the next mean conjunction’s day-count within qi.',
  },
  s0713: {
    literal:
      'For each, with the qi’s initial prior-posterior numbers first add then subtract, obtaining the mean conjunction’s day-count within fixed qi.',
    idiomatic:
      'For each qi, apply the initial prior-posterior numbers by addition then subtraction to obtain the mean conjunction’s day-count within fixed qi.',
  },
  s0714: {
    literal: 'Double and multiply by six lines; triple the minor remainder and follow with chronogram division;',
    idiomatic: 'Double and multiply by six lines; triple the minor remainder and divide by the chronogram divisor;',
  },
  s0715: {
    literal: 'multiply by its qi’s increase-decrease rate; as one per fixed-qi chronogram count;',
    idiomatic: 'multiply by that qi’s increase-decrease rate and divide by the fixed-qi chronogram count;',
  },
  s0716: {
    literal: 'what is obtained is used to increase or decrease its qi fast-slow accumulation, as the fixed number.',
    idiomatic: 'use the result to adjust that qi’s anomalistic accumulation as the fixed number.',
  },
  s0717: {
    literal:
      'Again set the mean conjunction’s remainder within fixed qi; add its day-and-night midnight entered-rotation remainder; multiply by that day’s increase-decrease rate; when full of the universal method take one and increase or decrease that day’s fast-slow accumulation; multiply by the conjunction rate and as one per conjunction number, as the fixed number.',
    idiomatic:
      'Set the mean conjunction’s remainder within fixed qi; add the day’s midnight rotation entry remainder; multiply by that day’s increase-decrease rate, divide by the universal divisor, and adjust that day’s anomalistic accumulation; multiply by the conjunction rate and divide by the conjunction number for the fixed value.',
  },
  s0718: {
    literal:
      'Then with the entered-qi and entered-rotation fast-slow fixed numbers, fast subtract and slow add to the mean conjunction’s remainder within qi; when full or insufficient, advance or retreat the day-count, as the true conjunction’s day-count within fixed qi.',
    idiomatic:
      'Apply the fixed fast-slow numbers for entered qi and rotation—subtract for fast, add for slow—to the mean conjunction’s qi remainder; carry or borrow days to obtain the true conjunction’s day-count within fixed qi.',
  },
  s0719: {
    literal:
      'For the remainder within fixed qi, keep a duplicate; multiply by that day’s surplus-deficit fraction; when full of the universal method take one; surplus adds and deficit subtracts from the duplicate; add to that day-and-night midnight solar degree, obtaining the true-conjunction hour-added Yellow Path solar degree.',
    idiomatic:
      'Keep a duplicate of the remainder within fixed qi; multiply by that day’s equation of time, divide by the universal divisor, and add or subtract from the duplicate; add to that night’s midnight solar longitude to obtain the true-conjunction hour-added ecliptic degree.',
  },
  s0720: {
    literal:
      'Subtract the true-conjunction hour-added degree remainder from the universal method; multiply the remainder by the limit-number of the distance-degree entry at the true-conjunction lodge, as the pre-distance fraction.',
    idiomatic:
      'Subtract the true-conjunction hour-added degree remainder from the universal divisor; multiply the remainder by the band index for the true-conjunction lodge’s distance entry to obtain the pre-distance fraction.',
  },
  s0721: {
    literal:
      'Set the moon-path and Yellow Path difference below the distance degree; multiply by the universal method and subtract the pre-distance fraction; when the remainder fills 240, divide for the fixed difference.',
    idiomatic:
      'Take the lunar ecliptic latitude difference for the distance band, multiply by the universal divisor, subtract the pre-distance fraction, and when the remainder fills 240 divide to obtain the fixed difference.',
  },
  s0722: {
    literal: 'What does not fill, one retreat makes seconds.',
    idiomatic: 'If it does not fill, retreat one place for seconds.',
  },
  s0723: {
    literal:
      'With the fixed difference and seconds add to the Yellow Path degree and remainder; still count the hou from the Winter or Summer Solstice and multiply the fixed difference, as eighteen to one;',
    idiomatic:
      'Add the fixed difference and seconds to the ecliptic degree and remainder; still count hou from the Winter or Summer Solstice, multiply the fixed difference, and divide by eighteen;',
  },
  s0724: {
    literal:
      'what is obtained, according to same or different name, is added or subtracted; when full or insufficient, advance or retreat the degree, obtaining the true-conjunction hour-added moon’s departure in the nine-path lodges.',
    idiomatic:
      'apply the result according to same or different name; carry or borrow degrees to obtain the true-conjunction hour-added lunar nine-path lodge longitude.',
  },
  s0725: {
    literal: 'For each, set the hour-added solar degree at fixed new, quarter, and full moon; add in sequence along the nine paths.',
    idiomatic: 'Set the hour-added solar degree for each fixed syzygy and accumulate along the nine paths in sequence.',
  },
  s0726: {
    literal: 'At syzygy hour-added time, the moon moves hidden beneath the sun at the same degree — this is called the departure image.',
    idiomatic: 'At conjunction hour-addition the moon lies hidden beneath the sun at the same longitude—the departure image.',
  },
  s0727: {
    literal:
      'First set the Yellow Path solar degree at the hour-added new, quarter, and full moon; subtract the Yellow Path lodge degree where the true conjunction hour-added time falls;',
    idiomatic:
      'Set the ecliptic solar degree at hour-added new, quarter, or full moon; subtract the ecliptic lodge degree at true-conjunction hour-addition;',
  },
  s0728: {
    literal:
      'add the remainder to the nine-path lodge degree at true conjunction; count outward from the true-conjunction lodge degree — that is the nine-path lodge degree at the hour-added new, quarter, and full moon.',
    idiomatic:
      'add the remainder to the nine-path lodge at true conjunction; count outward from that lodge to obtain the nine-path longitude at hour-added syzygy.',
  },
  s0729: {
    literal:
      'At conjunction hour-added time, if it is not true conjunction, the sun is on the Yellow Path and the moon on the nine paths; although their entered lodge degrees differ in magnitude, examining their distance from the pole, they answer to the plumb line.',
    idiomatic:
      'At conjunction hour-addition, if not true conjunction, the sun remains on the ecliptic and the moon on the nine paths; though lodge longitudes differ, their polar distances align to the plumb line.',
  },
  s0730: {
    literal: 'Hence it is said: the moon moves hidden beneath the sun at the same degree.',
    idiomatic: 'Hence: the moon moves hidden beneath the sun at the same longitude.',
  },
  s0731: {
    literal: 'One image’s degrees: 91, remainder 954, seconds 22½ — upper quarter, Duì image.',
    idiomatic: 'One image interval: 91°, remainder 954, 22½ seconds—first quarter, Duì ☱.',
  },
  s0732: {
    literal: 'Double it and oppose the sun, obtaining full moon, Kǎn image.',
    idiomatic: 'Double it and oppose the sun to obtain full moon, Kǎn ☵.',
  },
  s0733: {
    literal: 'Triple it, obtaining last quarter, Zhèn image.',
    idiomatic: 'Triple it to obtain last quarter, Zhèn ☳.',
  },
  s0734: {
    literal:
      'For each, add to the corresponding nine-path lodge degree; when seconds fill the image cycle follow the remainder, and when the remainder fills the universal method follow the degree, obtaining that day’s hour-added lunar degree.',
    idiomatic:
      'Add each to the corresponding nine-path lodge; carry seconds into the image cycle and remainder into degrees via the universal divisor to obtain that day’s hour-added lunar longitude.',
  },
  s0735: {
    literal: 'The five positions together make the number forty; reduce the degree remainder thereby for parts.',
    idiomatic: 'The five positions sum to forty; reduce the degree remainder thereby for parts.',
  },
  s0736: {
    literal: 'What does not exhaust becomes minor parts.',
    idiomatic: 'The remainder becomes minor parts.',
  },
  s0737: {
    literal:
      'Inspect midnight entered rotation at mean new moon; if the fixed new-moon major remainder has advance or retreat, likewise add or subtract the rotation day.',
    idiomatic:
      'Inspect midnight rotation entry at mean new moon; if the fixed new-moon major remainder advances or retreats, adjust the rotation day likewise.',
  },
  s0738: {
    literal: 'Otherwise follow mean new moon as fixed.',
    idiomatic: 'Otherwise take mean new moon as the fixed value.',
  },
  s0739: {
    literal: 'Accumulate by adding one day to obtain the next day.',
    idiomatic: 'Add one day at each step to obtain the next day.',
  },
  s0740: {
    literal: 'For each, multiply midnight entered-rotation remainder by the column decline; as one per universal method;',
    idiomatic: 'Multiply each midnight rotation entry remainder by the column decline and divide by the universal divisor;',
  },
  s0741: {
    literal: 'what is obtained is used to advance-add or retreat-subtract that day’s rotation parts, as the moon’s rotation fixed parts.',
    idiomatic: 'use the result to advance or retreat that day’s rotation parts, yielding the lunar rotation fixed parts.',
  },
  s0742: {
    literal: 'When full of the rotation method, that makes degrees.',
    idiomatic: 'When the parts fill the rotation divisor, they become degrees.',
  },
  s0743: {
    literal: 'Inspect midnight entered rotation at fixed new, quarter, and full moon; for each halve the column decline to subtract from rotation parts.',
    idiomatic: 'At fixed syzygy midnight rotation entry, halve the column decline and subtract from rotation parts.',
  },
  s0744: {
    literal: 'If retreating, multiply the fixed remainder by the decline, divide by the universal method, and halve together with the decline;',
    idiomatic: 'If retreating, multiply the fixed remainder by the decline, divide by the universal divisor, and halve together with the decline;',
  },
  s0745: {
    literal: 'if advancing, halve the remainder, multiply by the decline, likewise divide by the universal method: in each case add to what was subtracted.',
    idiomatic: 'if advancing, halve the remainder, multiply by the decline, divide by the universal divisor likewise, and add to the amount subtracted.',
  },
  s0746: {
    literal: 'Then multiply by the fixed remainder; when full of the universal method take one and subtract from the hour-added lunar degree, as the midnight lunar degree.',
    idiomatic: 'Multiply by the fixed remainder; divide by the universal divisor and subtract from the hour-added lunar degree to obtain midnight lunar longitude.',
  },
  s0747: {
    literal: 'Accumulate by adding the daily rotation fixed parts each day to obtain the next day.',
    idiomatic: 'Add the daily rotation fixed parts at each step to obtain the next day.',
  },
  s0748: {
    literal: 'If with entered rotation fixed parts one multiplies the day-and-night clepsydra, doubling the hundred marks for division, that makes dawn parts.',
    idiomatic: 'Multiply the entered rotation fixed parts by the day-night clepsydra and divide by double the hundred marks for dawn parts.',
  },
  s0749: {
    literal: 'Subtract from rotation fixed parts; the remainder is dusk parts.',
    idiomatic: 'Subtract from the rotation fixed parts; the remainder is dusk parts.',
  },
  s0750: {
    literal: 'Before full moon add dusk, after full moon add dawn to the midnight degree; each yields dawn and dusk moon.',
    idiomatic: 'Before full moon add dusk parts, after full moon add dawn parts to midnight longitude to obtain dawn and dusk lunar positions.',
  },
  s0751: { literal: 'Intersection day', idiomatic: 'Intersection day' },
  s0752: { literal: 'Bend-stretch rates', idiomatic: 'Latitude bend-stretch rates' },
  s0753: { literal: 'Bend-stretch accumulation', idiomatic: 'Latitude bend-stretch accumulation' },
  s0754: { literal: 'Day one', idiomatic: 'Day 1' },
  s0755: { literal: 'Bend 27', idiomatic: 'Bend rate: 27' },
  s0756: { literal: 'Accumulation, initial', idiomatic: 'Accumulation, initial' },
  s0757: { literal: 'Day two', idiomatic: 'Day 2' },
  s0758: { literal: 'Bend 19', idiomatic: 'Bend rate: 19' },
  s0759: { literal: 'Accumulation 27', idiomatic: 'Accumulation: 27' },
  s0760: { literal: 'Day three', idiomatic: 'Day 3' },
  s0761: { literal: 'Bend 13', idiomatic: 'Bend rate: 13' },
  s0762: { literal: 'Accumulation 46', idiomatic: 'Accumulation: 46' },
  s0763: { literal: 'Day four', idiomatic: 'Day 4' },
  s0764: { literal: 'Bend 8', idiomatic: 'Bend rate: 8' },
  s0765: { literal: 'Accumulation 59', idiomatic: 'Accumulation: 59' },
  s0766: { literal: 'Day five', idiomatic: 'Day 5' },
  s0767: { literal: 'Bend 13', idiomatic: 'Bend rate: 13' },
  s0768: { literal: 'Accumulation 67', idiomatic: 'Accumulation: 67' },
  s0769: { literal: 'Day six', idiomatic: 'Day 6' },
  s0770: { literal: 'Bend 19', idiomatic: 'Bend rate: 19' },
  s0771: { literal: 'Accumulation 1 degree 4', idiomatic: 'Accumulation: 1° 4' },
  s0772: { literal: 'Day seven', idiomatic: 'Day 7' },
  s0773: { literal: 'Initial bend 20, terminal stretch 7', idiomatic: 'Initial bend rate: 20, terminal stretch rate: 7' },
  s0774: { literal: 'Accumulation 1 degree 23', idiomatic: 'Accumulation: 1° 23' },
  s0775: { literal: 'Day eight', idiomatic: 'Day 8' },
  s0776: { literal: 'Stretch 19', idiomatic: 'Stretch rate: 19' },
  s0777: { literal: 'Accumulation 1 degree 36', idiomatic: 'Accumulation: 1° 36' },
  s0778: { literal: 'Day nine', idiomatic: 'Day 9' },
  s0779: { literal: 'Stretch 13', idiomatic: 'Stretch rate: 13' },
  s0780: { literal: 'Accumulation 1 degree 17', idiomatic: 'Accumulation: 1° 17' },
  s0781: { literal: 'Day ten', idiomatic: 'Day 10' },
  s0782: { literal: 'Stretch 8', idiomatic: 'Stretch rate: 8' },
  s0783: { literal: 'Accumulation 1 degree 4', idiomatic: 'Accumulation: 1° 4' },
  s0784: { literal: 'Day eleven', idiomatic: 'Day 11' },
  s0785: { literal: 'Stretch 13', idiomatic: 'Stretch rate: 13' },
  s0786: { literal: 'Accumulation 72', idiomatic: 'Accumulation: 72' },
  s0787: { literal: 'Day twelve', idiomatic: 'Day 12' },
  s0788: { literal: 'Stretch 19', idiomatic: 'Stretch rate: 19' },
  s0789: { literal: 'Accumulation 59', idiomatic: 'Accumulation: 59' },
  s0790: { literal: 'Day thirteen', idiomatic: 'Day 13' },
  s0791: { literal: 'Stretch 27', idiomatic: 'Stretch rate: 27' },
  s0792: { literal: 'Accumulation 40', idiomatic: 'Accumulation: 40' },
  s0793: { literal: 'Day fourteen', idiomatic: 'Day 14' },
  s0794: { literal: 'Initial stretch 13, terminal bend enters thereafter', idiomatic: 'Initial stretch rate: 13, terminal bend rate enters thereafter' },
  s0795: { literal: 'Accumulation 13', idiomatic: 'Accumulation: 13' },
  s0796: {
    literal:
      'For each, observe the yin-yang month intersection-day number at daily midnight; with the bend-stretch accumulation below it, where the moon-path and Yellow Path are same name, add it;',
    idiomatic:
      'For each day, take the yin-yang month intersection-day count at midnight; where the moon-path and ecliptic are same-named, add the bend-stretch accumulation below;',
  },
  s0797: {
    literal: 'where different name, subtract it.',
    idiomatic: 'where differently named, subtract it.',
  },
  s0798: {
    literal: 'In each case add or subtract to the daily dawn and dusk Yellow Path lunar degree, as the entered-lodge fixed degree and parts.',
    idiomatic: 'Apply these adjustments to each day’s dawn and dusk ecliptic lunar longitudes to obtain fixed lodge degrees and parts.',
  },
  s0799: {
    literal: 'Section Five: Method for pacing orbital clepsydra',
    idiomatic: 'V. Method for Determining Orbital Clepsydra',
  },
  s0800: { literal: 'Line cycle 1,520', idiomatic: 'Line cycle: 1,520' },
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
