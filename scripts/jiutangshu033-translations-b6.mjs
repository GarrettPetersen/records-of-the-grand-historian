/** Jiutangshu ch.033 batch 6: s0501–s0600 (eclipse carryover, Indian omens, five-planet mean appearance, Linde calendar) */
import { readFileSync, writeFileSync } from 'fs';

const translations = {
  s0501: {
    literal: 'Also use how much the prior eclipse was, to fix the later eclipse fraction remainder.',
    idiomatic: 'Also use the magnitude of the prior eclipse to fix the fraction remainder of the next.',
  },
  s0502: {
    literal: 'If total, its later eclipse degree and parts—then add seven degrees as the eclipse degree.',
    idiomatic: 'If the eclipse was total, add seven degrees to its later eclipse degree and parts to obtain the eclipse degree.',
  },
  s0503: {
    literal: 'If full-moon eclipse is total, next month new-moon day although entering [criterion] is not registered for eclipse.',
    idiomatic: 'If a full-moon eclipse is total, the next month\'s new moon may enter the criterion yet is not registered as an eclipse.',
  },
  s0504: {
    literal: 'If eclipse is half or below, from five parts take one part;',
    idiomatic: 'If the eclipse is half or less, take one part in five;',
  },
  s0505: {
    literal: 'If half or above, from three parts take one part, to add to next month new-moon eclipse degree and parts.',
    idiomatic: 'if half or more, take one part in three and add it to the next month\'s new-moon eclipse degree and parts.',
  },
  s0506: {
    literal: 'If the current year\'s solar remainder degree and parts, then one may verify how much the eclipse degree fraction is.',
    idiomatic: 'Once the current year\'s solar remainder in degrees and parts is set, one may then verify the eclipse degree and fraction.',
  },
  s0507: {
    literal: 'It also says: every six months according to the node, one eclipse.',
    idiomatic: 'It also states that, by the nodes, there is one eclipse every six months.',
  },
  s0508: {
    literal: 'That month\'s fifteenth day is the full-moon eclipse node; the dark moon entirely is the full-moon eclipse node—also by auspicious and inauspicious signs warning the king to follow the correct law; when the people are greatly blessed, although an eclipse is due in season, because of blessing it retreats.',
    idiomatic: 'The fifteenth of that month is the full-moon eclipse node; the dark of the moon is wholly the full-moon eclipse node. These omens of fortune and misfortune warn the king to uphold the righteous law: when the people are deeply blessed, though an eclipse is seasonally due, it retreats for that very blessing.',
  },
  s0509: {
    literal: 'After another six months pass, before an eclipse is due, there are always foretokens.',
    idiomatic: 'Six months later, before an eclipse is due, there are always foretokens.',
  },
  s0510: {
    literal: 'When the moon is about to eclipse, first the moon\'s form trembles and shakes, appearing as if alarmed; the moon rabbit and the moon\'s side turn yellow as if in grief.',
    idiomatic: 'When the moon is about to be eclipsed, its disk first trembles and shakes as if in alarm; the hare in the moon and the moon\'s limb turn yellow, as though stricken with grief.',
  },
  s0511: {
    literal: 'From the usual halo, at the month\'s first waxing, light does not appear bright, or is extremely faint.',
    idiomatic: 'Apart from its usual halo, at first waxing the light does not blaze forth, or is exceedingly faint.',
  },
  s0512: {
    literal: 'When the sun is about to eclipse, first the sun\'s form trembles and shakes, extremely as if alarmed.',
    idiomatic: 'When the sun is about to be eclipsed, its disk first trembles and shakes, as if in extreme alarm.',
  },
  s0513: {
    literal: 'Or light and color are faint and dim, not blazing bright, or dusky and grim.',
    idiomatic: 'Its light and color may grow faint and dim, no longer blazing bright, or turn dusky and grim.',
  },
  s0514: {
    literal: 'Solar and lunar eclipses share foretokens alike: light falls and drops; or at dawn and dusk margins red color rises like fire burning; gold, silver, pearls, jade, and all treasures lose their luster.',
    idiomatic: 'Solar and lunar eclipses share the same foretokens: light falls away; at dawn or dusk a red glow rises as if afire; gold, silver, pearls, jade, and every treasure lose their luster.',
  },
  s0515: {
    literal: 'Or there are gaps consumed as if clouds enter the sun, or blackness consumed enters the moon; bird cries thin and hidden, crows not bright; clouds cross in turmoil, light and aspect all confused; suddenly to the extreme making all nursing milk exhausted; moon damp as sweat; sun\'s form split in segments without light; dogs howl, cats cry; rainbow appears with sound; three luminaries lose parts; moon at times has gaps; water red-colored with greasy film.',
    idiomatic: 'Gaps may be eaten away as though clouds swallowed the sun, or blackness swallowed the moon; birds cry thinly and hidden, crows lose their brightness; clouds tangle in turmoil and light grows wholly confused; suddenly, to the extreme, the milk of all nursing creatures fails; the moon grows damp as with sweat; the sun\'s disk splits segment by segment and goes dark; dogs howl and cats wail; a rainbow appears with sound; the three luminaries lose their wholeness; the moon at times shows gaps; water turns red and greasy.',
  },
  s0516: {
    literal: 'On the fourteenth and fifteenth days, warbler birds gathering in circles—this too is a foretoken of eclipse.',
    idiomatic: 'On the fourteenth and fifteenth days, warblers gathering in circles are also a foretoken of eclipse.',
  },
  s0517: {
    literal: 'These and China\'s numerical methods differ slightly; in outline they are broadly similar.',
    idiomatic: 'These differ slightly from China\'s numerical methods, yet in broad outline they are much the same.',
  },
  s0518: {
    literal: 'Procedure for stepping the five planets',
    idiomatic: 'Procedure for the Five Planets',
  },
  s0519: {
    literal: 'Appearance-invisibility fifty-two days; morning appearance-invisibility sixty-three days; remainder and odd same as terminal fraction odd.',
    idiomatic: 'Appearance-invisibility: 52 days; morning appearance-invisibility: 63 days; remainder and odd parts match the terminal fraction odd.',
  },
  s0520: {
    literal: 'Procedure for finding the five planets\' mean appearances',
    idiomatic: 'Procedure for Finding the Five Planets\' Mean Appearances',
  },
  s0521: {
    literal: 'Each use invisibility fraction to subtract from total remainder; with the remainder remove by that star\'s total rate.',
    idiomatic: 'For each planet, subtract the invisibility fraction from the accumulated remainder and divide the remainder by that star\'s total cycle rate.',
  },
  s0522: {
    literal: 'If insufficient to remove, inversely subtract the remainder from total rate.',
    idiomatic: 'If the division cannot be completed, subtract the remainder inversely from the total rate.',
  },
  s0523: {
    literal: 'Reduce remainder by total factor to get days; undivided is remainder odd—that is the sought year\'s celestial first month mean new moon midnight after star morning/evening mean appearance day count and remainder odd.',
    idiomatic: 'Reduce the remainder by the total factor to obtain days; what remains undivided is the remainder odd—that gives the morning or evening mean appearance day count and remainder odd after midnight of the celestial first month\'s mean new moon for the year sought.',
  },
  s0524: {
    literal: 'When celestial first month fixed new moon advances or retreats a day, advance subtract retreat add one day for fixed new moon midnight after star mean appearance day and remainder odd.',
    idiomatic: 'When the celestial first month\'s fixed new moon advances or retreats a day, subtract a day for advance and add a day for retreat to obtain the mean appearance day and remainder odd after midnight of the fixed new moon.',
  },
  s0525: {
    literal: 'For Metal and Water two stars, first obtain evening mean appearance; remove what fills appearance-invisibility days and remainder; remainder is morning mean appearance day and remainder odd.',
    idiomatic: 'For Venus and Mercury, first obtain the evening mean appearance; cast out the full appearance-invisibility days and remainder; the remainder is the morning mean appearance day and remainder odd.',
  },
  s0526: {
    literal: 'Assign from appearance day the celestial first month calendar month lengths, remove in sequence; what does not fill a month is entering that month; count outside day reckoning—that is morning/evening mean appearance\'s month, day, and remainder odd.',
    idiomatic: 'From the appearance day, cast out full months according to the celestial first month calendar\'s long and short months; what does not fill a month is the month entered; count the day outside the reckoning—that gives the month, day, and remainder odd of the morning or evening mean appearance.',
  },
  s0527: {
    literal: 'Procedure for finding later mean appearance month and day',
    idiomatic: 'Procedure for Finding Later Mean Appearance Month and Day',
  },
  s0528: {
    literal: 'Each use that star\'s terminal day count and remainder odd, as prior mean appearance\'s month day count and remainder odd.',
    idiomatic: 'For each planet, add that star\'s terminal day count and remainder odd to the prior mean appearance\'s month, day count, and remainder odd.',
  },
  s0529: {
    literal: 'When odd fills odd rate, carry from remainder.',
    idiomatic: 'When the odd parts fill the odd rate, carry into the remainder.',
  },
  s0530: {
    literal: 'When remainder fills total factor, becomes days.',
    idiomatic: 'When the remainder fills the total factor, convert it to days.',
  },
  s0531: {
    literal: 'Remove and assign as before—that is later mean appearance\'s month, day, and remainder odd; for Metal and Water two stars, add evening obtains morning, add morning obtains evening.',
    idiomatic: 'Cast out and assign as before to obtain the later mean appearance\'s month, day, and remainder odd; for Venus and Mercury, adding the evening date yields the morning, and adding the morning yields the evening.',
  },
  s0532: {
    literal: 'Each halve appearance remainder to match half-total.',
    idiomatic: 'Halve each planet\'s appearance remainder to match the half-total.',
  },
  s0533: {
    literal: 'Procedure for finding the five planets\' regular appearances',
    idiomatic: 'Procedure for Finding the Five Planets\' Regular Appearances',
  },
  s0534: {
    literal: 'Each according to its star\'s mean appearance entered mean qi, calculate daily diminish-increase.',
    idiomatic: 'For each planet, according to the mean qi entered at its mean appearance, calculate the daily diminish-increase.',
  },
  s0535: {
    literal: 'When parts fill half-total becomes days; when not full is parts; use diminish-increase to add-subtract.',
    idiomatic: 'When the parts fill the half-total, convert them to days; what does not fill remains as parts; apply the diminish-increase to add or subtract.',
  },
  s0536: {
    literal: 'When done, remainder used to add-subtract to completed mean appearance day and parts—that is its regular appearance day and parts.',
    idiomatic: 'When this is done, apply the remainder to add or subtract from the completed mean appearance day and parts—that yields the regular appearance day and parts.',
  },
  s0537: {
    literal: 'Star day first appearance distance-from-sun degree; mean appearance entering qi calendar.',
    idiomatic: 'At first appearance, distance from the sun in degrees; mean appearance entering-qi calendar.',
  },
  s0538: {
    literal: 'Add-subtract days.',
    idiomatic: 'Add-subtract days.',
  },
  s0539: {
    literal: 'Diminish-increase rates.',
    idiomatic: 'Diminish-increase rates.',
  },
  s0540: {
    literal: 'Jupiter at first appearance, fourteen degrees from the sun.',
    idiomatic: 'Jupiter: at first appearance it stands fourteen degrees from the sun.',
  },
  s0541: {
    literal: 'At appearance entering Winter Solstice through Minor Cold, uniformly subtract six days.',
    idiomatic: 'At mean appearance entering the Winter Solstice through Minor Cold, uniformly subtract six days.',
  },
  s0542: {
    literal: 'From entering Major Cold afterward, daily subtract sixty-seven parts.',
    idiomatic: 'From Major Cold onward, subtract 67 parts per day.',
  },
  s0543: {
    literal: 'At appearance entering Spring Equinox first day, follow mean.',
    idiomatic: 'At mean appearance entering the Spring Equinox on the first day, follow the mean rate.',
  },
  s0544: {
    literal: 'From then on, daily add eighty-nine parts.',
    idiomatic: 'From then on, add 89 parts per day.',
  },
  s0545: {
    literal: 'Entering Start of Summer through Minor Fullness, uniformly add six days.',
    idiomatic: 'From the Start of Summer through Minor Fullness, uniformly add six days.',
  },
  s0546: {
    literal: 'From entering Grain in Ear afterward, daily subtract eighty-nine parts.',
    idiomatic: 'From Grain in Ear onward, subtract 89 parts per day.',
  },
  s0547: {
    literal: 'Entering Summer Solstice through Start of Autumn, uniformly add four days.',
    idiomatic: 'From the Summer Solstice through the Start of Autumn, uniformly add four days.',
  },
  s0548: {
    literal: 'From entering End of Heat afterward, daily subtract one hundred seventy-eight parts.',
    idiomatic: 'From End of Heat onward, subtract 178 parts per day.',
  },
  s0549: {
    literal: 'Entering White Dew, first day follow mean; from then daily subtract fifty-two parts.',
    idiomatic: 'At White Dew, follow the mean rate on the first day; from then on, subtract 52 parts per day.',
  },
  s0550: {
    literal: 'Entering Minor Snow through Major Snow, uniformly subtract six days.',
    idiomatic: 'From Minor Snow through Major Snow, uniformly subtract six days.',
  },
  s0551: {
    literal: 'Mars at first appearance, seventeen degrees from the sun.',
    idiomatic: 'Mars: at first appearance it stands seventeen degrees from the sun.',
  },
  s0552: {
    literal: 'At appearance entering Winter Solstice, first day subtract twenty-seven days.',
    idiomatic: 'At mean appearance entering the Winter Solstice, subtract 27 days on the first day.',
  },
  s0553: {
    literal: 'From then on, daily subtract six hundred three parts.',
    idiomatic: 'From then on, subtract 603 parts per day.',
  },
  s0554: {
    literal: 'Entering Major Cold, first day follow mean.',
    idiomatic: 'At Major Cold, follow the mean rate on the first day.',
  },
  s0555: {
    literal: 'From then on, daily add four hundred two parts.',
    idiomatic: 'From then on, add 402 parts per day.',
  },
  s0556: {
    literal: 'Entering Rain Water through Grain Rain, uniformly add twenty-seven days.',
    idiomatic: 'From Rain Water through Grain Rain, uniformly add 27 days.',
  },
  s0557: {
    literal: 'From entering Start of Summer afterward, daily subtract one hundred ninety-eight parts.',
    idiomatic: 'From the Start of Summer onward, subtract 198 parts per day.',
  },
  s0558: {
    literal: 'Entering Start of Autumn, follow mean.',
    idiomatic: 'At the Start of Autumn, follow the mean rate.',
  },
  s0559: {
    literal: 'From entering End of Heat afterward, daily subtract one hundred ninety parts.',
    idiomatic: 'From End of Heat onward, subtract 190 parts per day.',
  },
  s0560: {
    literal: 'Entering Minor Snow through Major Cold, uniformly subtract twenty-seven days.',
    idiomatic: 'From Minor Snow through Major Cold, uniformly subtract 27 days.',
  },
  s0561: {
    literal: 'Saturn at first appearance, seventeen degrees from the sun.',
    idiomatic: 'Saturn: at first appearance it stands seventeen degrees from the sun.',
  },
  s0562: {
    literal: 'At appearance entering Winter Solstice, first day subtract four days.',
    idiomatic: 'At mean appearance entering the Winter Solstice, subtract four days on the first day.',
  },
  s0563: {
    literal: 'From then on, daily add eighty-nine parts.',
    idiomatic: 'From then on, add 89 parts per day.',
  },
  s0564: {
    literal: 'Entering Major Cold through Spring Equinox, uniformly subtract eight days.',
    idiomatic: 'From Major Cold through the Spring Equinox, uniformly subtract eight days.',
  },
  s0565: {
    literal: 'From entering Clear Brightness afterward, daily subtract fifty-nine parts.',
    idiomatic: 'From Clear Brightness onward, subtract 59 parts per day.',
  },
  s0566: {
    literal: 'Entering Minor Heat, first day follow mean.',
    idiomatic: 'At Minor Heat, follow the mean rate on the first day.',
  },
  s0567: {
    literal: 'From then on, daily add eighty-nine parts.',
    idiomatic: 'From then on, add 89 parts per day.',
  },
  s0568: {
    literal: 'Entering White Dew, first day add eight days.',
    idiomatic: 'At White Dew, add eight days on the first day.',
  },
  s0569: {
    literal: 'From then on, daily subtract one hundred seventy-eight parts.',
    idiomatic: 'From then on, subtract 178 parts per day.',
  },
  s0570: {
    literal: 'Entering Autumn Equinox, uniformly add four days.',
    idiomatic: 'At the Autumn Equinox, uniformly add four days.',
  },
  s0571: {
    literal: 'From entering Cold Dew afterward, daily subtract fifty-nine parts.',
    idiomatic: 'From Cold Dew onward, subtract 59 parts per day.',
  },
  s0572: {
    literal: 'Entering Minor Snow, first day follow mean.',
    idiomatic: 'At Minor Snow, follow the mean rate on the first day.',
  },
  s0573: {
    literal: 'From after mean, daily subtract eighty-nine parts.',
    idiomatic: 'From the mean rate onward, subtract 89 parts per day.',
  },
  s0574: {
    literal: 'Venus at first appearance, eleven degrees from the sun.',
    idiomatic: 'Venus: at first appearance it stands eleven degrees from the sun.',
  },
  s0575: {
    literal: 'Evening appearance: entering Winter Solstice, first day follow mean.',
    idiomatic: 'Evening appearance: from the Winter Solstice, follow the mean rate on the first day.',
  },
  s0576: {
    literal: 'From then on, daily subtract one hundred parts.',
    idiomatic: 'From then on, subtract 100 parts per day.',
  },
  s0577: {
    literal: 'Entering Awakening of Insects through Spring Equinox, uniformly subtract nine days.',
    idiomatic: 'From Awakening of Insects through the Spring Equinox, uniformly subtract nine days.',
  },
  s0578: {
    literal: 'From entering Clear Brightness afterward, daily subtract one hundred parts.',
    idiomatic: 'From Clear Brightness onward, subtract 100 parts per day.',
  },
  s0579: {
    literal: 'Entering Grain in Ear, follow mean.',
    idiomatic: 'At Grain in Ear, follow the mean rate.',
  },
  s0580: {
    literal: 'From entering Summer Solstice afterward, daily add one hundred parts.',
    idiomatic: 'From the Summer Solstice onward, add 100 parts per day.',
  },
  s0581: {
    literal: 'Entering End of Heat through Autumn Equinox, uniformly add nine days.',
    idiomatic: 'From End of Heat through the Autumn Equinox, uniformly add nine days.',
  },
  s0582: {
    literal: 'From entering Cold Dew afterward, daily subtract one hundred parts.',
    idiomatic: 'From Cold Dew onward, subtract 100 parts per day.',
  },
  s0583: {
    literal: 'Entering Major Snow, follow mean.',
    idiomatic: 'At Major Snow, follow the mean rate.',
  },
  s0584: {
    literal: 'Morning appearance: entering Winter Solstice, follow mean.',
    idiomatic: 'Morning appearance: from the Winter Solstice, follow the mean rate.',
  },
  s0585: {
    literal: 'From entering Minor Cold afterward, daily add sixty-seven parts.',
    idiomatic: 'From Minor Cold onward, add 67 parts per day.',
  },
  s0586: {
    literal: 'Entering Start of Spring through Start of Summer, uniformly add three days.',
    idiomatic: 'From the Start of Spring through the Start of Summer, uniformly add three days.',
  },
  s0587: {
    literal: 'From entering Minor Fullness afterward, daily subtract sixty-seven parts.',
    idiomatic: 'From Minor Fullness onward, subtract 67 parts per day.',
  },
  s0588: {
    literal: 'Entering Summer Solstice, follow mean.',
    idiomatic: 'At the Summer Solstice, follow the mean rate.',
  },
  s0589: {
    literal: 'From entering Minor Heat afterward, daily subtract sixty-seven parts.',
    idiomatic: 'From Minor Heat onward, subtract 67 parts per day.',
  },
  s0590: {
    literal: 'Entering Start of Autumn through Start of Winter, uniformly subtract three days.',
    idiomatic: 'From the Start of Autumn through the Start of Winter, uniformly subtract three days.',
  },
  s0591: {
    literal: 'From entering Minor Snow afterward, daily subtract sixty-seven parts.',
    idiomatic: 'From Minor Snow onward, subtract 67 parts per day.',
  },
  s0592: {
    literal: 'Mercury at first appearance, seventeen degrees from the sun.',
    idiomatic: 'Mercury: at first appearance it stands seventeen degrees from the sun.',
  },
  s0593: {
    literal: 'Evening appearance: entering Winter Solstice through Clear Brightness, follow mean.',
    idiomatic: 'Evening appearance: from the Winter Solstice through Clear Brightness, follow the mean rate.',
  },
  s0594: {
    literal: 'Entering Grain Rain through Grain in Ear, uniformly subtract two days.',
    idiomatic: 'From Grain Rain through Grain in Ear, uniformly subtract two days.',
  },
  s0595: {
    literal: 'Entering Summer Solstice through Major Heat, follow mean.',
    idiomatic: 'From the Summer Solstice through Major Heat, follow the mean rate.',
  },
  s0596: {
    literal: 'Entering Start of Autumn through Frost\'s Descent, should appear but does not appear.',
    idiomatic: 'From the Start of Autumn through Frost\'s Descent, it should appear but does not.',
  },
  s0597: {
    literal: 'If within Start of Autumn and Frost\'s Descent two qi, evening distance from sun beyond eighteen degrees and within thirty-six degrees, if Wood, Fire, Earth, Metal one star or more also visible.',
    idiomatic: 'If within the two qi of Start of Autumn and Frost\'s Descent, in the evening it stands more than eighteen degrees but less than thirty-six degrees from the sun, and Jupiter, Mars, Saturn, or Venus is also visible, it is seen as well.',
  },
  s0598: {
    literal: 'Entering Start of Winter through Major Snow, follow mean.',
    idiomatic: 'From the Start of Winter through Major Snow, follow the mean rate.',
  },
  s0599: {
    literal: 'Morning appearance: entering Winter Solstice, uniformly subtract four days.',
    idiomatic: 'Morning appearance: from the Winter Solstice, uniformly subtract four days.',
  },
  s0600: {
    literal: 'Entering Minor Cold through Major Cold, follow mean.',
    idiomatic: 'From Minor Cold through Major Cold, follow the mean rate.',
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
console.log('All 100 sentences (s0501–s0600) filled and verified.');
