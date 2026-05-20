#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Astronomical treatises of successive dynasties, after the Records of the Grand Historian\'s Treatise on the Heavenly Offices, only the Jin and Sui treatises fully describe celestial bodies, instruments, and star divination; the Tang and Song added detail, yet none is complete.',
    'Dynastic astronomy monographs after Sima Qian\'s Heavenly Offices are fully descriptive only in the Jin and Sui versions; Tang and Song expanded them, but gaps remain.',
  ],
  s0002: [
    'Under the Yuan, instrumental observation grew more precise and prognostication denser, yet the realm they enclosed and cultural sway they spread were not broad; aligning government with the celestial pivot still left much omitted.',
    'Yuan observers refined instruments and tightened forecasts, but within a limited empire their cosmological governance still fell short.',
  ],
  s0003: [
    'The Qing unified All-under-Heaven, sage succeeding sage.',
    'The Qing unified China, one sage emperor following another.',
  ],
  s0004: [
    'The Sacred Ancestor personally rectified numerology and celestial phenomena, penetrating the utmost subtlety; before and after he devised seven new instruments; in measuring sun, moon, and stars he exhausted fractions of seconds;',
    'The Kangxi emperor personally mastered calendrical astronomy, devised seven new instruments, and measured the sun, moon, and stars to the second.',
  ],
  s0005: [
    'in surveying carriage routes\' longitude and latitude, the vault\'s calendar and the dome\'s chart.',
    'In surveying terrestrial longitude and latitude he mapped the heavens\' span across the sky.',
  ],
  s0006: [
    'The Shizong Emperor again, because long years had accumulated discrepancy, ordered supervising officials to adopt the elliptical method.',
    'Yongzheng, seeing accumulated error over the years, had supervising astronomers adopt elliptical theory.',
  ],
  s0007: [
    'The Gaozong Emperor again, because old star records had occasional gaps, personally made the Armillary Sphere and Chronographic Instrument and took new observations.',
    'Qianlong, finding gaps in older star catalogs, built the Armillary Sphere and Chronographic Instrument and remeasured the sky.',
  ],
  s0008: [
    'When the Muslim borderlands and the Two Jinchuan were pacified, he again ordered remeasurement of li-cha and added the results to the Time Constitution calendar.',
    'After pacifying Xinjiang and the two Jinchuan campaigns, he ordered li-cha remeasured and entered into the Shixian calendar.',
  ],
  s0009: [
    'Principles clear, numbers exact, instruments refined, methods dense—from antiquity there has never been the like.',
    'Clarity of principle, exactitude of number, refinement of instrument, and density of method were unmatched in earlier ages.',
  ],
  s0010: [
    'Now for the Astronomy Treatise we fully record methods of computation and verification; celestial phenomena manifest overhead, as seen in successive dynasties\' Veritable Records and the offices\' records, are also all written.',
    'This Astronomy Treatise records computational methods and every celestial phenomenon noted in dynastic Veritable Records and observatory logs.',
  ],
  s0011: [
    'After Qianlong year 60 the National History has no testimony, and those years are therefore omitted.',
    'After Qianlong 60 the Veritable Records offer no material, so the account stops there.',
  ],
  s0012: [
    'Celestial Phenomena, Earth\'s Form, and Li-Cha',
    'Celestial Phenomena, Earth\'s Form, and Li-Cha',
  ],
  s0013: [
    'Celestial Phenomena and Calendrical Phenomena, Compilation of Heavenly Phenomena says: "The Chu Ci, Heavenly Questions, says: \'Round then ninefold — who planned and measured it?',
    'The Compilation of Heavenly Phenomena quotes the Chu Ci Heavenly Questions: "The heavens are ninefold round — who designed and measured them?',
  ],
  s0014: [
    '" Later calendar specialists said heaven has twelve layers; heaven does not truly have so many layers — it speaks of sun, moon, and stars revolving in heaven, each with its own path — that is what the Chu Ci calls round.',
    'Later astronomers spoke of twelve celestial spheres not as literal shells but as the separate paths of sun, moon, and stars — the "round" of the Chu Ci.',
  ],
  s0015: [
    'To clarify the principles of the spheres one must detail their motions; to examine their motions one must take what is utterly still and unmoving as standard — then one obtains their waxing and waning.',
    'To understand celestial spheres one must study their motion against an absolutely fixed reference; only then can expansion and contraction be calculated.',
  ],
  s0016: [
    'For the Way of Heaven is still and dedicated; heaven\'s motion is active and upright.',
    'Heaven\'s Way is still and single-minded; its motion is active and direct.',
  ],
  s0017: [
    'The utterly still has a heaven of its own, inner and outer garment with earth, hence the many movers operate within it without cease.',
    'An absolutely fixed heaven pairs with earth as inner and outer; all moving bodies wheel within it unceasingly.',
  ],
  s0018: [
    'If there were no utterly still by which to verify the utmost motion, the sage would have no means to accomplish his skill.',
    'Without a fixed frame against which to measure motion, even the sage could not perfect his art.',
  ],
  s0019: [
    'Humans always measure heaven from earth\'s surface, yet the seven luminaries\' motions can all be obtained — precisely because still verifies motion.',
    'Observers stand on earth yet can chart the seven luminaries because motion is measured against what does not move.',
  ],
  s0020: [
    '"The twelve-layer heaven — outermost is utterly still and unmoving;',
    '"Of the twelve spheres, the outermost is absolutely fixed;',
  ],
  s0021: [
    'next is the primum mobile, where north and south poles and the equator are divided;',
    'next the primum mobile, which defines the poles and equator;',
  ],
  s0022: [
    'next is north-south precession;',
    'next north-south precession;',
  ],
  s0023: [
    'next is east-west precession;',
    'next east-west precession;',
  ],
  s0024: [
    'these two heavens move very slightly; calendar specialists provisionally set them aside and do not discuss them.',
    'these two spheres move imperceptibly and astronomers usually ignore them.',
  ],
  s0025: [
    'next are the Three Enclosures and Twenty-eight Mansions, through which the fixed stars pass;',
    'next the Three Enclosures and Twenty-eight Mansions where fixed stars travel;',
  ],
  s0026: [
    'next that where Saturn moves;',
    'next Saturn\'s sphere;',
  ],
  s0027: [
    'next where Jupiter moves;',
    'next Jupiter\'s;',
  ],
  s0028: [
    'next where Mars moves;',
    'next Mars\'s;',
  ],
  s0029: [
    'next where the Sun moves — the ecliptic;',
    'next the sun\'s ecliptic;',
  ],
  s0030: [
    'next where Venus moves;',
    'next Venus\'s;',
  ],
  s0031: [
    'next where Mercury moves;',
    'next Mercury\'s;',
  ],
  s0032: [
    'innermost where the Moon moves — the white path.',
    'innermost the moon\'s white path.',
  ],
  s0033: [
    'Essentials: by distance from earth as inner and outer of the heavens; yet how one knows distance from earth is again from the luminaries\' occultations and eclipses and from degrees\' slowness and speed.',
    'Near and far are ranked by distance from earth, known from mutual occultations, eclipses, and relative speed in degrees.',
  ],
  s0034: [
    'For whatever is occulted or eclipsed must be above; what occults or eclipses must be below.',
    'The body eclipsed lies above; the eclipser below.',
  ],
  s0035: [
    'The moon\'s body can obscure sunlight and the sun is eclipsed — a sign the sun is far and the moon near.',
    'The moon blocks the sun in eclipse, proving the sun farther than the moon.',
  ],
  s0036: [
    'The moon can occult the five stars, and moon and five stars can occult fixed stars — the five stars are higher than the moon yet lower than fixed stars.',
    'The moon occults the five planets; moon and planets occult fixed stars — planets stand above the moon but below the fixed stars.',
  ],
  s0037: [
    'The five stars can also mutually occult one another — each has its own near and far.',
    'The five planets also occult one another, each at a different distance.',
  ],
  s0038: [
    '"Also the primum mobile heaven, with vast qi, carries all heavens in left rotation; its motion is very swift.',
    '"The primum mobile, by vast ethereal force, drags all spheres in daily rotation — very fast.',
  ],
  s0039: [
    'Hence near the primum mobile heaven, left rotation is swift and rightward shift slow.',
    'Near it, daily rotation is fast and apparent retrograde motion slow.',
  ],
  s0040: [
    'Gradually farther from the primum mobile, left rotation is slower and rightward shift faster.',
    'Farther out, daily rotation slows and retrograde motion quickens.',
  ],
  s0041: [
    'Now for rightward shift: only fixed stars are slowest, Saturn and Jupiter next, Mars again next.',
    'Retrograde speed ranks fixed stars slowest, then Saturn and Jupiter, then Mars.',
  ],
  s0042: [
    'Sun, Venus, and Mercury are faster and the moon fastest — again proof by successive nearness.',
    'The sun, Venus, and Mercury move faster; the moon fastest — another proof of nearness.',
  ],
  s0043: [
    '" (closing quotation mark in the source.)',
    '(closing quotation mark in the source.)',
  ],
  s0044: [
    'Post-Compilation Daily Solar Motion Treatise says: "Western method from Ptolemy to Tycho established deferent heights, epicycle, and eccentric theories; recent Kepler, Cassini, and others took the deferent as an ellipse.',
    'The Daily Solar Motion Treatise notes: from Ptolemy through Tycho came deferents, epicycles, and eccentrics; Kepler and Cassini made the deferent elliptical.',
  ],
  s0045: [
    '"Lunar Distance Treatise says: "Since Westerners created the ellipse method, the sun\'s distance from the lunar heaven at apogee has near and far, and the moon\'s deferent center has advance and retreat.',
    'The Lunar Distance Treatise adds: elliptical theory makes the sun\'s distance from the lunar sphere vary and the lunar deferent center oscillate.',
  ],
  s0046: [
    'Earth center and heaven center are apart; the two centers\' difference has magnitude.',
    'Earth center and celestial center diverge by a measurable interval.',
  ],
  s0047: [
    '" Viewing all discussions together, celestial phenomena are complete.',
    'Taken together, these accounts complete the picture of celestial phenomena.',
  ],
  s0048: [
    'The fixed-star heaven has no earth-radius difference or secondary-cycle variation, so the treatise records from Saturn downward the seven heavens\' distances from earth center, detailing survey particulars.',
    'Fixed stars show no parallax or epicycle variation; below Saturn the treatise lists each planet\'s distance from earth\'s center from survey data.',
  ],
  s0049: [
    'Distances of the heavens from earth center:',
    'Distances from earth center:',
  ],
  s0050: [
    'Saturn at highest: eleven and 1,042,626/352,606 solar radii;',
    'Saturn apogee: 11 + 1,042,626/352,606 solar radii;',
  ],
  s0051: [
    'Jupiter at highest: six and 1,929,408/1,305,590 solar radii;',
    'Jupiter apogee: 6 + 1,929,408/1,305,590 solar radii;',
  ],
  s0052: [
    'Mars at highest: two and 6,302,705/5,552,250 solar radii;',
    'Mars apogee: 2 + 6,302,705/5,552,250 solar radii;',
  ],
  s0053: [
    'Sun — mean epicycle method at highest: 1,162 earth radii; ellipse method at highest: 20,975 earth radii;',
    'Sun: mean epicycle 1,162 earth radii; ellipse 20,975 earth radii;',
  ],
  s0054: [
    'Venus at highest above the sun: 7,545,644/10,000,000 of a solar radius; at lowest below the sun by the same amount;',
    'Venus apogee: 7,545,644/10,000,000 solar radius above the sun; perigee equally below;',
  ],
  s0055: [
    'Mercury at highest above the sun: 4,532,155/10,000,000 of a solar radius; at lowest below the sun by the same amount;',
    'Mercury apogee: 4,532,155/10,000,000 solar radius above the sun; perigee equally below;',
  ],
  s0056: [
    'Moon — mean epicycle method at highest at new and full moon: fifty-eight and 16/100 earth radii; ellipse method at highest: sixty-three and 77/100 earth radii.',
    'Moon: mean epicycle 58.16 earth radii at syzygy; ellipse 63.77 earth radii.',
  ],
  s0057: [
    'Earth\'s body — armillary-sphere cosmologists say heaven wraps earth like an egg wrapping the yolk; Inner Classic: "Yellow Emperor said: \'Is earth truly below?\'',
    'On earth\'s form: armillary cosmologists say heaven encloses earth like a shell around a yolk. The Inner Classic records: "The Yellow Emperor asked, \'Is earth truly beneath us?\'',
  ],
  s0058: [
    'Qibo said: \'Earth is below man, within the Great Void.\'',
    'Qibo answered, \'Earth lies below humanity, suspended in the Great Void.\'',
  ],
  s0059: [
    'He said: \'Resting on what?\'',
    'The emperor asked, \'On what does it rest?\'',
  ],
  s0060: [
    'He said: \'The Great Principle lifts it.\'',
    'Qibo said, \'The Great Principle holds it up.\'"',
  ],
  s0061: [
    'Great Dai Rites: "Danju Li asked Zengzi: \'Heaven round and earth square — is it truly so?\'',
    'The Great Dai Rites records Danju Li asking Zengzi, \'Heaven is round and earth square — is that true?\'',
  ],
  s0062: [
    'Zengzi said: \'If heaven were truly round and earth square, the four corners would not meet.\'',
    'Zengzi replied, \'If heaven were round and earth square, the corners would not align.\'',
  ],
  s0063: [
    'I once heard from the Master: "Heaven\'s Way is called round; Earth\'s Way is called square."\'"',
    'I heard the Master say, "Heaven\'s Way is called round; earth\'s Way is called square."\'',
  ],
  s0064: [
    'Song Neo-Confucian Shao Yong said: "On what does heaven rely? On earth;',
    'Shao Yong of the Song asked, "On what does heaven rely? On earth.',
  ],
  s0065: [
    'It relies on earth;',
    'It relies on earth;',
  ],
  s0066: [
    'On what does earth attach?',
    'On what does earth attach?',
  ],
  s0067: [
    'To heaven.',
    'To heaven.',
  ],
  s0068: [
    'On what do heaven and earth mutually attach?',
    'On what do heaven and earth attach to each other?',
  ],
  s0069: [
    'They attach to each other.',
    'They attach to each other.',
  ],
  s0070: [
    'Mutually attaching — heaven by form, earth by qi."',
    'Mutually attaching: heaven by form, earth by qi."',
  ],
  s0071: [
    'Cheng Yi said: "By the sun\'s shadow, thirty thousand li as center — it seems bounded, yet when one side has already reached fifteen thousand li, heaven and earth\'s motion is as at first.',
    'Cheng Yi said, "By gnomon shadow, thirty thousand li marks the center; it seems finite, yet at fifteen thousand li on one side heaven and earth still move as before.',
  ],
  s0072: [
    'Then the center is also a temporal center."',
    'The center is only the center for a given moment."',
  ],
  s0073: [
    'He also said: "What people now fix as the celestial body is only by the eye — where vision ends they take as the limit.',
    'He also said, "People define the heavens only by sight — where the eye stops, they call that the edge.',
  ],
  s0074: [
    'Yet once at sea one saw ten large stars below the south pole; today\'s fixed celestial body is therefore unsettled.',
    'Yet at sea ten bright stars appeared south of the pole, so our celestial map remains uncertain.',
  ],
  s0075: [
    'Sun and moon rise and set only within thirty thousand li at center; yet China reaches only Shanshan and Yarkand — already fifteen thousand li.',
    'The sun and moon move within thirty thousand li of center, while China reaches only Shanshan and Yarkand — half that span.',
  ],
  s0076: [
    'Viewed from there the sun would still lie within thirty thousand li of center.',
    'From there the sun would still appear at the same central distance.',
  ],
  s0077: [
    'Bochun at Zezhou once ate chive shoots three times — first Huai chives, then Ze chives, then Bing chives — and knew that within a few hundred li climate already differed by three months.',
    'At Zezhou, Bochun ate chives three times — from Huai, Ze, and Bing — and found climate three months apart within hundreds of li.',
  ],
  s0078: [
    'If one extrapolated by that difference, it would amount to half a year.',
    'Extrapolated, the difference would reach half a year.',
  ],
  s0079: [
    'Thus there could be winter solstice here and summer solstice there — only the names winter and summer would differ."',
    'One place could have winter solstice while another had summer solstice — merely opposite seasons."',
  ],
  s0080: [
    '" (closing quotation mark in the source.) Zhu Xi\'s commentary on Heavenly Questions says: "Heaven\'s form is round like a pellet; what rotates also has no substance, but is like a fierce wind\'s whirl.',
    '(closing quotation mark in the source.) Zhu Xi\'s Heavenly Questions commentary: heaven is round like a pellet; its rotation has no solid body, only a whirl of fierce wind.',
  ],
  s0081: [
    'Earth is the dregs of qi gathered into form, but because it is bound within the fierce wind\'s rotation it can alone float in the void long without falling."',
    'Earth is condensed qi, held aloft in that whirl so long that it seems to float without falling."',
  ],
  s0082: [
    'Westerners say earth\'s body is perfectly round, with people on all four sides; winter and summer differ and day and night reverse — matching the Inner Classic, the Dai Rites, and Song Confucians as if tallying seal and notch.',
    'Westerners hold the earth a perfect sphere with inhabitants on every side, opposite seasons and reversed day and night — matching the Inner Classic, Dai Rites, and Song masters.',
  ],
  s0083: [
    'Now tested against heaven\'s circumference of three hundred sixty degrees: traveling two hundred li south lowers the north pole one degree;',
    'Measured against the 360-degree celestial circuit: going 200 li south lowers the north pole 1°;',
  ],
  s0084: [
    'traveling two hundred li north raises the north pole one degree.',
    'going 200 li north raises it 1°.',
  ],
  s0085: [
    'East and west along the equator: traveling two hundred li also shifts the observed time of lunar eclipse by one degree.',
    'Along the equator, 200 li east or west shifts lunar eclipse timing by 1°.',
  ],
  s0086: [
    'Traveling along latitude circles north and south of the equator, though the spans differ in width and narrowness, all accord with the armillary sphere.',
    'Movement along parallels north and south of the equator, though distances vary by latitude, matches the armillary model.',
  ],
  s0087: [
    'Then one knows earth\'s great circumference is three hundred sixty degrees, east-west and north-south each seventy-two thousand li; by the ancient eight-cun foot it is ninety thousand li in circumference;',
    'Earth\'s full circumference is 360°, 72,000 li in every direction; by the ancient 8-cun foot that is 90,000 li around;',
  ],
  s0088: [
    'by circumference three and diameter one, diameter thirty thousand li;',
    'with pi as 3, diameter 30,000 li;',
  ],
  s0089: [
    'this also matches the ancient saying of thirty thousand li as center.',
    'matching the old doctrine of 30,000 li to the center.',
  ],
  s0090: [
    'Thus earth\'s body is perfectly round — beyond doubt.',
    'Earth is therefore certainly a sphere.',
  ],
  s0091: [
    'Latitude distance corresponds to great-circle li differently; the essentials are recorded.',
    'East-west distance per degree of latitude varies; the key figures follow.',
  ],
  s0092: [
    'East-west li per degree along latitude circles north and south of the equator: at one degree of latitude, one hundred ninety-nine li three hundred forty paces;',
    'East-west distance per degree of latitude from the equator: at 1° latitude, 199 li 340 paces;',
  ],
  s0093: [
    'at five degrees latitude, one hundred ninety-nine li eighty paces;',
    'at 5°, 199 li 80 paces;',
  ],
  s0094: [
    'at ten degrees latitude, one hundred ninety-six li three hundred forty paces;',
    'at 10°, 196 li 340 paces;',
  ],
  s0095: [
    'at fifteen degrees latitude, one hundred ninety-three li sixty paces;',
    'at 15°, 193 li 60 paces;',
  ],
  s0096: [
    'at twenty degrees latitude, one hundred eighty-seven li three hundred twenty paces;',
    'at 20°, 187 li 320 paces;',
  ],
  s0097: [
    'at twenty-five degrees latitude, one hundred eighty-one li eighty paces;',
    'at 25°, 181 li 80 paces;',
  ],
  s0098: [
    'at thirty degrees latitude, one hundred seventy-three li sixty paces;',
    'at 30°, 173 li 60 paces;',
  ],
  s0099: [
    'at thirty-five degrees latitude, one hundred sixty-three li two hundred eighty paces;',
    'at 35°, 163 li 280 paces;',
  ],
  s0100: [
    'at forty degrees latitude, one hundred fifty-three li eighty paces;',
    'at 40°, 153 li 80 paces;',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_026_b01.mjs <translation.json>'
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;

for (const s of data.sentences) {
  const pair = T[s.id];
  if (!pair) continue;
  s.literal = pair[0];
  s.idiomatic = pair[1];
  patched++;
}

const missing = data.sentences.filter((s) => !s.literal || !s.idiomatic);
if (missing.length) {
  console.error(`Missing: ${missing.map((s) => s.id).join(', ')}`);
  process.exit(1);
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patched ${patched} sentences`);
