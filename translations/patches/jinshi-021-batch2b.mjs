/** Jinshi ch.021 batch 2b: s0151–s0200 (Calendar — daily ecliptic solar degrees for twenty-four qi; noon ecliptic and equatorial degrees; solar twelve lodges entering palace; gnomon and clepsydra constants) */
export default {
  s0151: {
    literal: 'To find the ecliptic solar degree before dawn and at midnight for each day of the twenty-four qi.',
    idiomatic:
      'To find the daily ecliptic solar degree before dawn and at midnight for each of the twenty-four qi.',
  },
  s0152: {
    literal:
      'Set aside its qi minor remainder; multiply by that qi\'s first-day decrease-increase rate; apply excess-and-deficit to the decrease and increase.',
    idiomatic:
      'Set aside the qi\'s minor remainder, multiply by that qi\'s first-day decrease-increase rate, and apply excess-and-deficit to the decrease and increase.',
  },
  s0153: {
    literal:
      'Reduce by ten thousand to make fen; where increase applies, excess-add and deficit-subtract; where decrease applies, excess-subtract and deficit-add the subsidiary; divide by the day factor for degrees; what does not fill, step back and divide for fen and miao; subtract from that qi\'s added-hour ecliptic solar degree — thus obtain each qi\'s first-day ecliptic solar degree before dawn and at midnight.',
    idiomatic:
      'Reduce by ten thousand to obtain fen; for increase, excess-add and deficit-subtract; for decrease, excess-subtract and deficit-add the subsidiary; divide by the day factor for degrees, and any remainder steps back into fen and miao; subtract from that qi\'s added-hour ecliptic solar degree to obtain each qi\'s first-day ecliptic solar degree before dawn and at midnight.',
  },
  s0154: {
    literal:
      'Each day add one degree; reduce the daily decrease-increase rate by one hundred; apply excess-and-deficit to the decrease and increase.',
    idiomatic:
      'Add one degree each day, reduce the daily decrease-increase rate by one hundred, and apply excess-and-deficit to the decrease and increase.',
  },
  s0155: {
    literal:
      'Where increase applies, excess-add and deficit-subtract; where decrease applies, excess-subtract and deficit-add — these are the daily ecliptic solar degrees before dawn and at midnight with fen and miao.',
    idiomatic:
      'For increase, excess-add and deficit-subtract; for decrease, excess-subtract and deficit-add — yielding the daily ecliptic solar degree before dawn and at midnight with fen and miao.',
  },
  s0156: {
    literal: 'To find the daily noon ecliptic solar degree.',
    idiomatic: 'To find the daily noon ecliptic solar degree.',
  },
  s0157: {
    literal:
      'Set ten thousand fen; take the entered qi\'s daily excess-deficit decrease-increase rate; where increase applies, excess-add and deficit-subtract; where decrease applies, excess-subtract and deficit-add; all add and subtract the decrease-increase rate; halve the remainder; what fills one hundred becomes fen, what does not fill becomes miao; add to that day\'s early-morning before-dawn ecliptic solar degree — that is the day\'s noon solar progression ecliptic lodge degree with fen and miao.',
    idiomatic:
      'Set ten thousand fen, take the entered qi\'s daily excess-deficit decrease-increase rate, and for increase excess-add and deficit-subtract, for decrease excess-subtract and deficit-add; add and subtract the decrease-increase rate throughout, halve the remainder, convert hundreds to fen and the remainder to miao, and add to that day\'s early-morning before-dawn ecliptic solar degree to obtain the noon solar progression ecliptic lodge degree with fen and miao.',
  },
  s0158: {
    literal: 'To find the daily noon accumulated ecliptic degree.',
    idiomatic: 'To find the daily noon accumulated ecliptic degree.',
  },
  s0159: {
    literal:
      'Take the solstice added-hour ecliptic solar degree; the distance from the solstice to the sought day\'s noon ecliptic solar degree is the accumulated ecliptic degree after entering the solstice, with fen and miao.',
    idiomatic:
      'From the solstice added-hour ecliptic solar degree, measure to the sought day\'s noon ecliptic solar degree to obtain the accumulated ecliptic degree after the solstice, with fen and miao.',
  },
  s0160: {
    literal: 'Daily noon ecliptic entry into initial and final limits.',
    idiomatic: 'Daily noon ecliptic entry into initial and final limits.',
  },
  s0161: {
    literal:
      'Observe the accumulated ecliptic degree after the solstice: at forty-three degrees twelve fen eighty-seven miao or below it is the initial limit; above that, subtract the quadrant limit; the remainder is entry into the final limit.',
    idiomatic:
      'For accumulated ecliptic degree after a solstice: at 43°12′87″ or below, it is the initial limit; above that, subtract the quadrant limit and the remainder is entry into the final limit.',
  },
  s0162: {
    literal:
      'When the accumulated degree fills the quadrant limit, remove it — that is the accumulated ecliptic degree after the equinox; at forty-eight degrees eighteen fen twenty-two miao or below it is the initial limit; above that, subtract the quadrant limit; the remainder is entry into the final limit.',
    idiomatic:
      'When the accumulated degree fills the quadrant limit, remove it to obtain the post-equinox accumulated ecliptic degree; at 48°18′22″ or below it is the initial limit; above that, subtract the quadrant limit and the remainder is entry into the final limit.',
  },
  s0163: {
    literal: 'To find the daily noon equatorial solar degree.',
    idiomatic: 'To find the daily noon equatorial solar degree.',
  },
  s0164: {
    literal:
      'Take the sought day\'s noon accumulated ecliptic degree, entering after the solstice the initial limit and after the equinox the final limit, with degrees fen and miao; advance three places, add 202,050 and a fraction less, extract the square root and divide by it; subtract 449.5 from the result; if in the initial limit, directly add the two-solstice equatorial solar degree and assign the mansions.',
    idiomatic:
      'Take the sought day\'s noon accumulated ecliptic degree — after a solstice in the initial limit, after an equinox in the final limit — with degrees, fen, and miao; advance three places, add 202,050 and a fraction less, take the square root and divide; subtract 449.5; if in the initial limit, add the two-solstice equatorial solar degree directly and assign the mansions.',
  },
  s0165: {
    literal:
      'If in the final limit, subtract the quadrant limit; with the remainder add the two-equinox equatorial solar degree and assign the mansions.',
    idiomatic:
      'If in the final limit, subtract the quadrant limit, add the two-equinox equatorial solar degree to the remainder, and assign the mansions.',
  },
  s0166: {
    literal: 'That is the daily noon equatorial solar degree.',
    idiomatic: 'That yields the daily noon equatorial solar degree.',
  },
  s0167: {
    literal:
      'Take the sought day\'s noon accumulated ecliptic degree, entering after the solstice the final limit and after the equinox the initial limit, with degrees fen and miao; advance three places, subtract 303,050 and a fraction less, extract the square root and divide by it; subtract 550.5 from the result; if in the initial limit, add the two-equinox equatorial solar degree directly to the remainder and assign the mansions.',
    idiomatic:
      'Take the sought day\'s noon accumulated ecliptic degree — after a solstice in the final limit, after an equinox in the initial limit — with degrees, fen, and miao; advance three places, subtract 303,050 and a fraction less, take the square root and divide; subtract 550.5; if in the initial limit, add the two-equinox equatorial solar degree to the remainder and assign the mansions.',
  },
  s0168: {
    literal:
      'If in the final limit, subtract the quadrant limit; with the remainder add the two-solstice equatorial solar degree and assign the mansions.',
    idiomatic:
      'If in the final limit, subtract the quadrant limit, add the two-solstice equatorial solar degree to the remainder, and assign the mansions.',
  },
  s0169: {
    literal: 'That is the daily noon equatorial solar degree.',
    idiomatic: 'That yields the daily noon equatorial solar degree.',
  },
  s0170: {
    literal:
      'Solar ecliptic twelve lodges entering palace degrees: Rain Water — beyond Wei 13 degrees 39 fen 50 miao, enters the Wei allotment, Zouzi station, celestial sign at hai.',
    idiomatic:
      'Solar ecliptic twelve-lodge palace-entry degrees: Rain Water — beyond 13°39′50″ of Wei, enters the Wei allotment, Zouzi station, sign at hai.',
  },
  s0171: {
    literal:
      'Spring Equinox — beyond Kui 2 degrees 35 fen 85 miao, enters the Lu allotment, Jianglou station, celestial sign at xu.',
    idiomatic:
      'Spring Equinox — beyond 2°35′85″ of Kui, enters the Lu allotment, Jianglou station, sign at xu.',
  },
  s0172: {
    literal:
      'Grain Rain — beyond Stomach 4 degrees 24 fen 33 miao, enters the Zhao allotment, Daliang station, celestial sign at you.',
    idiomatic:
      'Grain Rain — beyond 4°24′33″ of Stomach, enters the Zhao allotment, Daliang station, sign at you.',
  },
  s0173: {
    literal:
      'Lesser Fullness — beyond Net 7 degrees 96 fen 6 miao, enters the Jin allotment, Shishen station, celestial sign at shen.',
    idiomatic:
      'Lesser Fullness — beyond 7°96′6″ of Net, enters the Jin allotment, Shishen station, sign at shen.',
  },
  s0174: {
    literal:
      'Summer Solstice — beyond Well 9 degrees 47 fen 10 miao, enters the Qin allotment, Chunshou station, celestial sign at wei.',
    idiomatic:
      'Summer Solstice — beyond 9°47′10″ of Well, enters the Qin allotment, Chunshou station, sign at wei.',
  },
  s0175: {
    literal:
      'Greater Heat — beyond Willow 4 degrees 95 fen 16 miao, enters the Zhou allotment, Chunhuo station, celestial sign at wu.',
    idiomatic:
      'Greater Heat — beyond 4°95′16″ of Willow, enters the Zhou allotment, Chunhuo station, sign at wu.',
  },
  s0176: {
    literal:
      'End of Heat — beyond Extended Net 15 degrees 56 fen 35 miao, enters the Chu allotment, Chunwei station, celestial sign at si.',
    idiomatic:
      'End of Heat — beyond 15°56′35″ of Extended Net, enters the Chu allotment, Chunwei station, sign at si.',
  },
  s0177: {
    literal:
      'Autumn Equinox — beyond Chariot 10 degrees 44 fen 5 miao, enters the Zheng allotment, Shouxing station, celestial sign at chen.',
    idiomatic:
      'Autumn Equinox — beyond 10°44′5″ of Chariot, enters the Zheng allotment, Shouxing station, sign at chen.',
  },
  s0178: {
    literal:
      'Frost Descent — beyond Root 1 degree 77 fen 77 miao, enters the Song allotment, Dahu station, celestial sign at mao.',
    idiomatic:
      'Frost Descent — beyond 1°77′77″ of Root, enters the Song allotment, Dahu station, sign at mao.',
  },
  s0179: {
    literal:
      'Lesser Snow — beyond Tail 3 degrees 97 fen 92 miao, enters the Yan allotment, Ximu station, celestial sign at yin.',
    idiomatic:
      'Lesser Snow — beyond 3°97′92″ of Tail, enters the Yan allotment, Ximu station, sign at yin.',
  },
  s0180: {
    literal:
      'Winter Solstice — beyond Dipper 4 degrees 36 fen 66 miao, enters the Wu-Yue allotment, Xingji station, celestial sign at chou.',
    idiomatic:
      'Winter Solstice — beyond 4°36′66″ of Dipper, enters the Wu-Yue allotment, Xingji station, sign at chou.',
  },
  s0181: {
    literal:
      'Greater Cold — beyond Woman 2 degrees 91 fen 91 miao, enters the Qi allotment, Xuanxiao station, celestial sign at zi.',
    idiomatic:
      'Greater Cold — beyond 2°91′91″ of Woman, enters the Qi allotment, Xuanxiao station, sign at zi.',
  },
  s0182: {
    literal: 'To find the time of entering the palace.',
    idiomatic: 'To find the time of entering the palace.',
  },
  s0183: {
    literal:
      'For each, set the palace-entry lodge degree with fen and miao; subtract from that day\'s before-dawn solar degree; seek where the remainder lies within one degree.',
    idiomatic:
      'Set each palace-entry lodge degree with fen and miao, subtract that day\'s before-dawn solar degree, and find where the remainder falls within one degree.',
  },
  s0184: {
    literal:
      'With the remainder multiply its fen by the day factor; the miao follow below and are likewise multiplied through — this is the dividend;',
    idiomatic:
      'Multiply the remainder\'s fen by the day factor, carry the miao below and multiply through likewise to form the dividend;',
  },
  s0185: {
    literal:
      'take that day\'s solar motion fen as the divisor; divide the dividend by the divisor; obtain the result; seek by emission and absorption of time — thus obtain that day\'s solar time of entering the palace with fen and miao.',
    idiomatic:
      'use that day\'s solar motion fen as divisor; divide; then seek by emission-and-absorption timing to obtain that day\'s solar palace-entry time with fen and miao.',
  },
  s0186: {
    literal: '○ Procedure for Gnomon and Clepsydra, Fourth.',
    idiomatic: '○ Procedure for Gnomon and Clepsydra, Fourth.',
  },
  s0187: {
    literal: 'Central limit: 182 days, 62 fen, 18 miao.',
    idiomatic: 'Central limit: 182 days, 62 fen, 18 miao.',
  },
  s0188: {
    literal: 'Winter-solstice initial limit, summer-solstice final limit: 62 days, 20 fen.',
    idiomatic: 'Winter-solstice initial limit, summer-solstice final limit: 62 days, 20 fen.',
  },
  s0189: {
    literal: 'Summer-solstice initial limit, winter-solstice final limit: 120 days, 42 fen.',
    idiomatic: 'Summer-solstice initial limit, winter-solstice final limit: 120 days, 42 fen.',
  },
  s0190: {
    literal: 'Winter-solstice geocentric gnomon-shadow constant: 1 zhang 2 chi 8 cun 3 fen.',
    idiomatic: 'Winter-solstice geocentric gnomon-shadow constant: 1 zhang 2 chi 8 cun 3 fen.',
  },
  s0191: {
    literal: 'Summer-solstice geocentric gnomon-shadow constant: 1 chi 5 cun 6 fen.',
    idiomatic: 'Summer-solstice geocentric gnomon-shadow constant: 1 chi 5 cun 6 fen.',
  },
  s0192: {
    literal: 'Circumference factor: 1,428.',
    idiomatic: 'Circumference factor: 1,428.',
  },
  s0193: {
    literal: 'Inner-outer factor: 10,896.',
    idiomatic: 'Inner-outer factor: 10,896.',
  },
  s0194: {
    literal: 'Half factor: 2,615.',
    idiomatic: 'Half factor: 2,615.',
  },
  s0195: {
    literal: 'Day factor, three-fourths: 3,922.5.',
    idiomatic: 'Day factor, three-fourths: 3,922.5.',
  },
  s0196: {
    literal: 'Day factor, one-fourth: 1,307.5.',
    idiomatic: 'Day factor, one-fourth: 1,307.5.',
  },
  s0197: {
    literal: 'Dusk-and-dawn fen: 130 fen, 75 miao.',
    idiomatic: 'Dusk-and-dawn fen: 130 fen, 75 miao.',
  },
  s0198: {
    literal: 'Dusk-and-dawn ke: 2 ke, 156 fen, 90 miao.',
    idiomatic: 'Dusk-and-dawn ke: 2 ke, 156 fen, 90 miao.',
  },
  s0199: {
    literal: 'Ke factor: 313 fen, 80 miao.',
    idiomatic: 'Ke factor: 313 fen, 80 miao.',
  },
  s0200: {
    literal: 'Miao mother: 100.',
    idiomatic: 'Miao mother: 100.',
  },
};
