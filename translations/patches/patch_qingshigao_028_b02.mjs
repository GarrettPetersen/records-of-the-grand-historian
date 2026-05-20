#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'Great Fire: Gape, 1°.',
    'Great Fire: Gape, 1°.',
  ],
  s0102: [
    'Split Wood: Room, 5° 0′ 3″.',
    'Split Wood: Room, 5° 0′ 3″.',
  ],
  s0103: [
    'Qianlong jiazi year—ecliptic twelve stations, initial-degree lodge values:',
    'Qianlong jiazi year—ecliptic twelve stations, initial-degree lodge values:',
  ],
  s0104: [
    'Star Record: Winnowing Basket, 2° 19′ 13″;',
    'Xingji: Sack, 2° 19′ 13″;',
  ],
  s0105: [
    'Outskirts: Southern Dipper, 23° 24′ 18″;',
    'Yuanshao: Southern Dipper, 23° 24′ 18″;',
  ],
  s0106: [
    'Curtailed Toe: Rooftop at initial degree, 12′ 44″;',
    'Juzi: Rooftop initial degree, 12′ 44″;',
  ],
  s0107: [
    'Lowering Harvest: Encampment, 10° 5′ 47″;',
    'Jianglou: Encampment, 10° 5′ 47″;',
  ],
  s0108: [
    'Great Beam: Legs, 11° 8′ 52″;',
    'Daliang: Legs, 11° 8′ 52″;',
  ],
  s0109: [
    'Real Chamber: Hairy Head, 4° 9′ 39″;',
    'Shishen: Hairy Head, 4° 9′ 39″;',
  ],
  s0110: [
    'Quail Head: Three Stars, 8° 55′ 15″;',
    'Chunshou: Three Stars, 8° 55′ 15″;',
  ],
  s0111: [
    'Quail Fire: Eastern Well, 28° 16′ 50″;',
    'Chunhuo: Eastern Well, 28° 16′ 50″;',
  ],
  s0112: [
    'Quail Tail: Seven Stars, 6° 17′ 1″;',
    'Chunwei: Seven Stars, 6° 17′ 1″;',
  ],
  s0113: [
    'Longevity Star: Wings, 9° 48′ 17″;',
    'Shouxing: Wings, 9° 48′ 17″;',
  ],
  s0114: [
    'Great Fire: Horn, 9° 43′ 39″;',
    'Dahuo: Horn, 9° 43′ 39″;',
  ],
  s0115: [
    'Split Wood: Room at initial degree, 37′ 35″.',
    'Ximu: Room initial degree, 37′ 35″.',
  ],
  s0116: [
    'Qianlong jiazi year—equatorial twelve stations, initial-degree lodge values:',
    'Qianlong jiazi year—equatorial twelve stations, initial-degree lodge values:',
  ],
  s0117: [
    'Star Record: Winnowing Basket, 2° 40′ 14″;',
    'Xingji: Sack, 2° 40′ 14″;',
  ],
  s0118: [
    'Outskirts: Southern Dipper, 22° 35′ 47″;',
    'Yuanshao: Southern Dipper, 22° 35′ 47″;',
  ],
  s0119: [
    'Curtailed Toe: Rooftop, 1° 50′ 27″;',
    'Juzi: Rooftop, 1° 50′ 27″;',
  ],
  s0120: [
    'Lowering Harvest: Encampment, 17° 0′ 38″;',
    'Jianglou: Encampment, 17° 0′ 38″;',
  ],
  s0121: [
    'Great Beam: Harvest, 4° 52′ 33″;',
    'Daliang: Harvest, 4° 52′ 33″;',
  ],
  s0122: [
    'Real Chamber: Hairy Head, 7° 34′ 3″;',
    'Shishen: Hairy Head, 7° 34′ 3″;',
  ],
  s0123: [
    'Quail Head: Three Stars, 8° 1′ 55″;',
    'Chunshou: Three Stars, 8° 1′ 55″;',
  ],
  s0124: [
    'Quail Fire: Well, 28° 8′ 15″;',
    'Chunhuo: Well, 28° 8′ 15″;',
  ],
  s0125: [
    'Quail Tail: Spread, 5° 12′ 1″;',
    'Chunwei: Spread, 5° 12′ 1″;',
  ],
  s0126: [
    'Longevity Star: Wings, 18° 8′ 31″;',
    'Shouxing: Wings, 18° 8′ 31″;',
  ],
  s0127: [
    'Great Fire: Gape at initial degree, 10′ 30″;',
    'Dahuo: Gape initial degree, 10′ 30″;',
  ],
  s0128: [
    'Split Wood: Room, 4° 8′ 17″.',
    'Ximu: Room, 4° 8′ 17″.',
  ],
  s0129: [
    'Dusk-and-dawn meridian stars: the Book of Yu records the four seasons\' dusk-culminating stars, while the Monthly Ordinances list dusk and dawn for every month.',
    'Dusk-and-dawn meridian stars begin in the Book of Yu with the four seasons\' dusk culminations; the Monthly Ordinances give dusk and dawn month by month.',
  ],
  s0130: [
    'Yet the Book of Yu places Hairy Head at mid-winter culmination, while the Monthly Ordinances place Eastern Wall at dusk—some two thousand years apart, with the meridian stars differing by four lodges.',
    'The Book of Yu has Hairy Head at mid-winter culmination; the Monthly Ordinances have Eastern Wall at dusk—two millennia apart, four lodges between them.',
  ],
  s0131: [
    'Though precession accounts for this, the ancient methods are coarse and lack degree-and-minute precision, so one cannot press the argument far.',
    'Precession explains the drift, but old methods lack fine degrees and minutes—there is little ground for a close dispute.',
  ],
  s0132: [
    'Here, from the fixed stars\' longitude and latitude set in the Kangxi renzi year, are derived the dusk-and-dawn meridian stars for each solar term in the Yongzheng inaugural year guimao, recorded in this treatise.',
    'Using Kangxi renzi fixed-star coordinates, we derive Yongzheng guimao dusk-and-dawn meridian stars for each solar term and list them here.',
  ],
  s0133: [
    'To obtain dusk-and-dawn meridian stars for solar terms after Qianlong 9 jiazi, one should compute from the fixed-star coordinates revised in the Qianlong jiazi year.',
    'For solar terms after Qianlong 9 jiazi, use the Qianlong jiazi fixed-star revision as the basis for calculation.',
  ],
  s0134: [
    'Spring Equinox is tied to the solar term\'s opening day; the same rule holds below.',
    'Spring Equinox uses the term\'s first day; later entries follow the same rule.',
  ],
  s0135: [
    'Dusk: North River 2 on the meridian, 4° 34′ west of center.',
    'Dusk: North River 2, 4° 34′ west of the meridian.',
  ],
  s0136: [
    'Dawn: Tail on the meridian, 1° 7′ east of center.',
    'Dawn: Tail, 1° 7′ east of the meridian.',
  ],
  s0137: [
    'When no star stands exactly on the meridian, a nearby culminating star is used and its offset recorded.',
    'With no star exactly on the meridian, a near-culminating star is named and its offset given.',
  ],
  s0138: [
    'Lodges are taken by the first star; when the first star lies too far from center, a later star is used and numbered—as with North River 2, Three Stars 4, and Root 4.',
    'Each lodge uses its first star; if that star sits too far from center, a later star is numbered instead—North River 2, Three Stars 4, Root 4, and the like.',
  ],
  s0139: [
    'Grain Rain—dusk: Yellow Regulator 14 on the meridian, 4° 59′ west of center.',
    'Grain Rain—dusk: Yellow Regulator 14, 4° 59′ west of the meridian.',
  ],
  s0140: [
    'Dawn: Winnowing Basket on the meridian, 4° 13′ east of center.',
    'Dawn: Winnowing Basket, 4° 13′ east of the meridian.',
  ],
  s0141: [
    'Beginning of Summer—dusk: Five Emperors\' Seat on the meridian, 32′ west of center.',
    'Beginning of Summer—dusk: Five Emperors\' Seat, 32′ west of the meridian.',
  ],
  s0142: [
    'Dawn: Winnowing Basket on the meridian, 4° 9′ west of center.',
    'Dawn: Winnowing Basket, 4° 9′ west of the meridian.',
  ],
  s0143: [
    'Lesser Fullness—dusk: Horn on the meridian, 2° 23′ east of center.',
    'Lesser Fullness—dusk: Horn, 2° 23′ east of the meridian.',
  ],
  s0144: [
    'Dawn: Southern Dipper on the meridian, 3° 8′ west of center.',
    'Dawn: Southern Dipper, 3° 8′ west of the meridian.',
  ],
  s0145: [
    'Grain in Ear—dusk: Root on the meridian, 3° 29′ east of center.',
    'Grain in Ear—dusk: Root, 3° 29′ east of the meridian.',
  ],
  s0146: [
    'Dawn: River Drum 2 on the meridian, 2° 21′ east of center.',
    'Dawn: River Drum 2, 2° 21′ east of the meridian.',
  ],
  s0147: [
    'Summer Solstice—dusk: Room on the meridian, 2° 8′ east of center.',
    'Summer Solstice—dusk: Room, 2° 8′ east of the meridian.',
  ],
  s0148: [
    'Dawn: Maid on the meridian, 1° 43′ east of center.',
    'Dawn: Maid, 1° 43′ east of the meridian.',
  ],
  s0149: [
    'Lesser Heat—dusk: Tail on the meridian, 40′ west of center.',
    'Lesser Heat—dusk: Tail, 40′ west of the meridian.',
  ],
  s0150: [
    'Dawn: Tail on the meridian, 3° 25′ east of center.',
    'Dawn: Tail, 3° 25′ east of the meridian.',
  ],
  s0151: [
    'Greater Heat—dusk: Emperor\'s Seat on the meridian, 3° 25′ west of center.',
    'Greater Heat—dusk: Emperor\'s Seat, 3° 25′ west of the meridian.',
  ],
  s0152: [
    'Dawn: Encampment on the meridian, 1° 56′ west of center.',
    'Dawn: Encampment, 1° 56′ west of the meridian.',
  ],
  s0153: [
    'Beginning of Autumn—dusk: Winnowing Basket on the meridian, 2° 37′ west of center.',
    'Beginning of Autumn—dusk: Winnowing Basket, 2° 37′ west of the meridian.',
  ],
  s0154: [
    'Dawn: Earth Manager in the Void on the meridian, 1° 40′ east of center.',
    'Dawn: Earth Manager in the Void, 1° 40′ east of the meridian.',
  ],
  s0155: [
    'End of Heat—dusk: Southern Dipper on the meridian, 26′ west of center.',
    'End of Heat—dusk: Southern Dipper, 26′ west of the meridian.',
  ],
  s0156: [
    'Dawn: Harvest on the meridian, 1° 46′ west of center.',
    'Dawn: Harvest, 1° 46′ west of the meridian.',
  ],
  s0157: [
    'White Dew—dusk: Southern Dipper on the meridian, 8° 32′ west of center.',
    'White Dew—dusk: Southern Dipper, 8° 32′ west of the meridian.',
  ],
  s0158: [
    'Dawn: Celestial Storehouse on the meridian, 4° 41′ west of center.',
    'Dawn: Celestial Storehouse, 4° 41′ west of the meridian.',
  ],
  s0159: [
    'Autumn Equinox—dusk: River Drum 2 on the meridian, 34′ east of center.',
    'Autumn Equinox—dusk: River Drum 2, 34′ east of the meridian.',
  ],
  s0160: [
    'Dawn: Net on the meridian, 3° 7′ west of center',
    'Dawn: Net, 3° 7′ west of the meridian',
  ],
  s0161: [
    'Cold Dew—dusk: Northern Dipper on the meridian, 53′ west of center.',
    'Cold Dew—dusk: Northern Dipper, 53′ west of the meridian.',
  ],
  s0162: [
    'Dawn: Three Stars 4 on the meridian, 13′ west of center.',
    'Dawn: Three Stars 4, 13′ west of the meridian.',
  ],
  s0163: [
    'Frost\'s Descent—dusk: Maid on the meridian, 3° 41′ west of center.',
    'Frost\'s Descent—dusk: Maid, 3° 41′ west of the meridian.',
  ],
  s0164: [
    'Dawn: Celestial Wolf on the meridian, 5° 37′ west of center.',
    'Dawn: Celestial Wolf, 5° 37′ west of the meridian.',
  ],
  s0165: [
    'Beginning of Winter—dusk: Void on the meridian, 3° 20′ west of center.',
    'Beginning of Winter—dusk: Void, 3° 20′ west of the meridian.',
  ],
  s0166: [
    'Dawn: Ghost Carriage on the meridian, 1° 27′ east of center.',
    'Dawn: Ghost Carriage, 1° 27′ east of the meridian.',
  ],
  s0167: [
    'Lesser Snow—dusk: Northern Military Gate on the meridian, 5° 41′ east of center.',
    'Lesser Snow—dusk: Northern Military Gate, 5° 41′ east of the meridian.',
  ],
  s0168: [
    'Dawn: Seven Stars on the meridian, 2° 16′ west of center.',
    'Dawn: Seven Stars, 2° 16′ west of the meridian.',
  ],
  s0169: [
    'Greater Snow—dusk: Encampment on the meridian, 5° 57′ west of center.',
    'Greater Snow—dusk: Encampment, 5° 57′ west of the meridian.',
  ],
  s0170: [
    'Dawn: Wings on the meridian, 2° 55′ east of center.',
    'Dawn: Wings, 2° 55′ east of the meridian.',
  ],
  s0171: [
    'Winter Solstice—dusk: Eastern Wall on the meridian, 4° 26′ west of center.',
    'Winter Solstice—dusk: Eastern Wall, 4° 26′ west of the meridian.',
  ],
  s0172: [
    'Dawn: Five Emperors\' Seat on the meridian, 2° 1′ west of center.',
    'Dawn: Five Emperors\' Seat, 2° 1′ west of the meridian.',
  ],
  s0173: [
    'Lesser Cold—dusk: Harvest on the meridian, 3° 33′ east of center.',
    'Lesser Cold—dusk: Harvest, 3° 33′ east of the meridian.',
  ],
  s0174: [
    'Dawn: Horn on the meridian, 6° 24′ east of center.',
    'Dawn: Horn, 6° 24′ east of the meridian.',
  ],
  s0175: [
    'Greater Cold—dusk: Stomach on the meridian, 2° 20′ west of center.',
    'Greater Cold—dusk: Stomach, 2° 20′ west of the meridian.',
  ],
  s0176: [
    'Dawn: Gape on the meridian, 4° 18′ east of center.',
    'Dawn: Gape, 4° 18′ east of the meridian.',
  ],
  s0177: [
    'Beginning of Spring—dusk: Hairy Head on the meridian, 5° 34′ west of center.',
    'Beginning of Spring—dusk: Hairy Head, 5° 34′ west of the meridian.',
  ],
  s0178: [
    'Dawn: Root on the meridian, 1° 28′ east of center.',
    'Dawn: Root, 1° 28′ east of the meridian.',
  ],
  s0179: [
    'Rain Water—dusk: Three Stars 7 on the meridian, 45′ west of center.',
    'Rain Water—dusk: Three Stars 7, 45′ west of the meridian.',
  ],
  s0180: [
    'Dawn: Root 4 on the meridian, 2° 32′ west of center.',
    'Dawn: Root 4, 2° 32′ west of the meridian.',
  ],
  s0181: [
    'Awakening of Insects—dusk: Eastern Well on the meridian, 3° 6′ west of center.',
    'Awakening of Insects—dusk: Eastern Well, 3° 6′ west of the meridian.',
  ],
  s0182: [
    'Dawn: Room on the meridian, 2° 4′ west of center.',
    'Dawn: Room, 2° 4′ west of the meridian.',
  ],
  s0183: [
    'Clear Bright—dusk: Seven Culminating Stars on the meridian, 5° 14′ east of center.',
    'Clear Bright—dusk: Seven Culminating Stars, 5° 14′ east of the meridian.',
  ],
  s0184: [
    'Dawn: Emperor\'s Seat on the meridian, 1° 59′ east of center.',
    'Dawn: Emperor\'s Seat, 1° 59′ east of the meridian.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_028_b02.mjs <translation.json>'
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
