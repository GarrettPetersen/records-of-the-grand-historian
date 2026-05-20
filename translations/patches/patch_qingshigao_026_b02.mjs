#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'at forty-five degrees latitude, one hundred forty-one li one hundred twenty paces;',
    'at 45° latitude, 141 li 120 paces;',
  ],
  s0102: [
    'at fifty degrees latitude, one hundred twenty-eight li two hundred paces;',
    'at 50°, 128 li 200 paces;',
  ],
  s0103: [
    'at fifty-five degrees latitude, one hundred fourteen li two hundred forty paces;',
    'at 55°, 114 li 240 paces;',
  ],
  s0104: [
    'at sixty degrees latitude, ninety-nine li three hundred forty paces;',
    'at 60°, 99 li 340 paces;',
  ],
  s0105: [
    'at sixty-five degrees latitude, eighty-four li two hundred paces;',
    'at 65°, 84 li 200 paces;',
  ],
  s0106: [
    'at seventy degrees latitude, sixty-eight li one hundred forty paces;',
    'at 70°, 68 li 140 paces;',
  ],
  s0107: [
    'at seventy-five degrees latitude, fifty-one li two hundred forty paces;',
    'at 75°, 51 li 240 paces;',
  ],
  s0108: [
    'at eighty degrees latitude, thirty-four li one hundred sixty paces;',
    'at 80°, 34 li 160 paces;',
  ],
  s0109: [
    'at eighty-five degrees latitude, seventeen li eighty paces;',
    'at 85°, 17 li 80 paces;',
  ],
  s0110: [
    'at eighty-nine degrees latitude, three li one hundred sixty paces.',
    'at 89°, 3 li 160 paces.',
  ],
  s0111: [
    'Li-cha arises because where people dwell differs in north, south, east, and west — the zenith and horizon also differ — and can be fixed by computing li; hence the name li-cha; its bearing on observations overhead is very great.',
    'Li-cha ("li difference") names the shift in zenith and horizon when observers stand at different longitudes and latitudes; it matters greatly for what one sees overhead.',
  ],
  s0112: [
    'For fixed stars\' hiding and appearing, day and night\'s length, the seven luminaries\' rising and setting, solar terms\' earliness and lateness, and eclipses\' depth and sequence — all differ thereby.',
    'Star visibility, day length, planetary risings, seasonal timing, and eclipse depth and order all vary with place.',
  ],
  s0113: [
    'Only by obtaining the difference\'s number can the reasons for each difference be foreknown, so one does not marvel at seeming irregular motion and invent specious explanations.',
    'Once the correction is known, local variation is predictable and need not be mistaken for errant heavens.',
  ],
  s0114: [
    'The New Methods Calculation Book\'s recorded north polar altitudes and east-west offsets for each province were largely fixed from map routes and li — many are inexact.',
    'Earlier manuals listed provincial polar heights and longitudinal offsets from map distances — often inaccurate.',
  ],
  s0115: [
    'Now from Kangxi-era actual surveys of each province and Mongol banners, plus provinces added in the Qianlong Time Constitution, together with Muslim borderland tribes and the two Jinchuan chieftaincies — day and night length, solar-term timing — heights and offsets are derived and fully listed.',
    'Here Kangxi surveys, Qianlong additions, Xinjiang, and Jinchuan observations yield revised polar altitudes and longitudinal offsets.',
  ],
  s0116: [
    'North polar altitude: the capital at thirty-nine degrees fifty-five minutes;',
    'North polar altitude: Beijing 39°55\';',
  ],
  s0117: [
    'Shengjing at forty-one degrees fifty-one minutes;',
    'Mukden 41°51\';',
  ],
  s0118: [
    'Shanxi at thirty-seven degrees fifty-three minutes thirty seconds;',
    'Shanxi 37°53\'30";',
  ],
  s0119: [
    'Korea at thirty-seven degrees thirty-nine minutes fifteen seconds;',
    'Korea 37°39\'15";',
  ],
  s0120: [
    'Shandong at thirty-six degrees forty-five minutes twenty-four seconds;',
    'Shandong 36°45\'24";',
  ],
  s0121: [
    'Henan at thirty-four degrees fifty-two minutes twenty-six seconds;',
    'Henan 34°52\'26";',
  ],
  s0122: [
    'Shaanxi at thirty-four degrees sixteen minutes;',
    'Shaanxi 34°16\';',
  ],
  s0123: [
    'Jiangnan at thirty-two degrees four minutes;',
    'Jiangnan 32°04\';',
  ],
  s0124: [
    'Sichuan at thirty degrees forty-one minutes;',
    'Sichuan 30°41\';',
  ],
  s0125: [
    'Huguang at thirty degrees thirty-four minutes forty-eight seconds;',
    'Huguang 30°34\'48";',
  ],
  s0126: [
    'Zhejiang at thirty degrees eighteen minutes twenty seconds;',
    'Zhejiang 30°18\'20";',
  ],
  s0127: [
    'Jiangxi at twenty-eight degrees thirty-seven minutes twelve seconds;',
    'Jiangxi 28°37\'12";',
  ],
  s0128: [
    'Guizhou at twenty-six degrees thirty minutes twenty seconds;',
    'Guizhou 26°30\'20";',
  ],
  s0129: [
    'Fujian at twenty-six degrees two minutes twenty-four seconds;',
    'Fujian 26°02\'24";',
  ],
  s0130: [
    'Guangxi at twenty-five degrees thirteen minutes seven seconds;',
    'Guangxi 25°13\'07";',
  ],
  s0131: [
    'Yunnan at twenty-five degrees six minutes;',
    'Yunnan 25°06\';',
  ],
  s0132: [
    'Guangdong at twenty-three degrees ten minutes;',
    'Guangdong 23°10\';',
  ],
  s0133: [
    'Bulung Ke\'er\'gasutai at forty-nine degrees twenty-eight minutes;',
    'Bulung Ke\'ergasutai 49°28\';',
  ],
  s0134: [
    'Ege Selengge at forty-nine degrees twenty-seven minutes;',
    'Ege Selengge 49°27\';',
  ],
  s0135: [
    'Sangjin Dalai Lake at forty-nine degrees twelve minutes;',
    'Sangjin Dalai Lake 49°12\';',
  ],
  s0136: [
    'Kent Mountain at forty-eight degrees thirty-three minutes;',
    'Kent Mountain 48°33\';',
  ],
  s0137: [
    'Kerulen River Balcheng at forty-eight degrees five minutes thirty seconds;',
    'Kerulen River Balcheng 48°05\'30";',
  ],
  s0138: [
    'Tula River Khan Mountain at forty-seven degrees fifty-seven minutes ten seconds;',
    'Tula River Khan Mountain 47°57\'10";',
  ],
  s0139: [
    'Khalkha River Keleheshuo at forty-seven degrees thirty-four minutes thirty seconds;',
    'Khalkha River Keleheshuo 47°34\'30";',
  ],
  s0140: [
    'Dorbet at forty-seven degrees fifteen minutes;',
    'Dorbet 47°15\';',
  ],
  s0141: [
    'Orkhon River Erdeni Zhao at forty-six degrees fifty-eight minutes fifteen seconds;',
    'Orkhon River Erdeni Zhao 46°58\'15";',
  ],
  s0142: [
    'Kongge Zhabu Hankhan River at forty-six degrees forty-two minutes;',
    'Kongge Zhabu Hankhan River 46°42\';',
  ],
  s0143: [
    'Jasak at forty-six degrees thirty minutes;',
    'Jasak 46°30\';',
  ],
  s0144: [
    'Tui River at forty-six degrees twenty-nine minutes twenty seconds;',
    'Tui River 46°29\'20";',
  ],
  s0145: [
    'Horqin at forty-six degrees seventeen minutes;',
    'Horqin 46°17\';',
  ],
  s0146: [
    'Gorlos at forty-five degrees thirty minutes;',
    'Gorlos 45°30\';',
  ],
  s0147: [
    'Aru Horqin at forty-five degrees thirty minutes;',
    'Aru Horqin 45°30\';',
  ],
  s0148: [
    'Wengji River at forty-five degrees thirty minutes;',
    'Wengji River 45°30\';',
  ],
  s0149: [
    'Saksak Tugurik at forty-five degrees twenty-three minutes forty-five seconds;',
    'Saksak Tugurik 45°23\'45";',
  ],
  s0150: [
    'Ujumchin at forty-four degrees forty-five minutes;',
    'Ujumchin 44°45\';',
  ],
  s0151: [
    'Haoqit at forty-four degrees six minutes;',
    'Haoqit 44°06\';',
  ],
  s0152: [
    'Gurban Saikhan at forty-three degrees forty-eight minutes;',
    'Gurban Saikhan 43°48\';',
  ],
  s0153: [
    'Bairin at forty-three degrees thirty-six minutes;',
    'Bairin 43°36\';',
  ],
  s0154: [
    'Jalut at forty-three degrees thirty minutes;',
    'Jalut 43°30\';',
  ],
  s0155: [
    'Abahanaer at forty-three degrees twenty-three minutes;',
    'Abahanaer 43°23\';',
  ],
  s0156: [
    'Abaga at forty-three degrees twenty-three minutes;',
    'Abaga 43°23\';',
  ],
  s0157: [
    'Naiman at forty-three degrees fifteen minutes;',
    'Naiman 43°15\';',
  ],
  s0158: [
    'Keshiketeng at forty-three degrees;',
    'Keshiketeng 43°00\';',
  ],
  s0159: [
    'Sunid at forty-three degrees;',
    'Sunid 43°00\';',
  ],
  s0160: [
    'Hami at forty-two degrees fifty-three minutes;',
    'Hami 42°53\';',
  ],
  s0161: [
    'Wengniut at forty-two degrees thirty minutes;',
    'Wengniut 42°30\';',
  ],
  s0162: [
    'Aohan at forty-two degrees fifteen minutes;',
    'Aohan 42°15\';',
  ],
  s0163: [
    'Khalkha at forty-one degrees forty-four minutes;',
    'Khalkha 41°44\';',
  ],
  s0164: [
    'Four-Banner Tribe at forty-one degrees forty-one minutes;',
    'Four-Banner Tribe 41°41\';',
  ],
  s0165: [
    'Kharchin at forty-one degrees thirty minutes;',
    'Kharchin 41°30\';',
  ],
  s0166: [
    'Maominggan at forty-one degrees fifteen minutes;',
    'Maominggan 41°15\';',
  ],
  s0167: [
    'Urad at forty degrees fifty-two minutes;',
    'Urad 40°52\';',
  ],
  s0168: [
    'Guihuacheng at forty degrees forty-nine minutes;',
    'Guihuacheng 40°49\';',
  ],
  s0169: [
    'Tumed at forty degrees forty-nine minutes;',
    'Tumed 40°49\';',
  ],
  s0170: [
    'Ordos at thirty-nine degrees thirty minutes;',
    'Ordos 39°30\';',
  ],
  s0171: [
    'Alashan Mountain at thirty-eight degrees thirty minutes.',
    'Alashan Mountain 38°30\'.',
  ],
  s0172: [
    'Above: Kangxi-era actual surveys.',
    'Above: Kangxi-era surveys.',
  ],
  s0173: [
    'Yaksa city at fifty-one degrees forty-eight minutes;',
    'Yaksa 51°48\';',
  ],
  s0174: [
    'Heilongjiang at fifty degrees one minute;',
    'Heilongjiang 50°01\';',
  ],
  s0175: [
    'Sanxing at forty-seven degrees twenty minutes;',
    'Sanxing 47°20\';',
  ],
  s0176: [
    'Bodune at forty-five degrees fifteen minutes;',
    'Bodune 45°15\';',
  ],
  s0177: [
    'Jilin at forty-three degrees forty-seven minutes;',
    'Jilin 43°47\';',
  ],
  s0178: [
    'Gansu at thirty-six degrees eight minutes;',
    'Gansu 36°08\';',
  ],
  s0179: [
    'Anhui at thirty degrees thirty-seven minutes;',
    'Anhui 30°37\';',
  ],
  s0180: [
    'Hunan at twenty-eight degrees thirteen minutes;',
    'Hunan 28°13\';',
  ],
  s0181: [
    'Annam at twenty-two degrees sixteen minutes;',
    'Annam 22°16\';',
  ],
  s0182: [
    'Altan Nur Uryankhai at fifty-three degrees thirty minutes;',
    'Altan Nur Uryankhai 53°30\';',
  ],
  s0183: [
    'Khan Mountain Hatun River at fifty-one degrees ten minutes;',
    'Khan Mountain Hatun River 51°10\';',
  ],
  s0184: [
    'Tangnu Mountain Uryankhai at fifty degrees forty minutes;',
    'Tangnu Mountain Uryankhai 50°40\';',
  ],
  s0185: [
    'Ulan Gom Dorbet at forty-nine degrees twenty minutes;',
    'Ulan Gom Dorbet 49°20\';',
  ],
  s0186: [
    'Irtysh River at forty-eight degrees thirty-five minutes;',
    'Irtysh River 48°35\';',
  ],
  s0187: [
    'Zaisan Nur at forty-eight degrees thirty-five minutes;',
    'Zaisan Nur 48°35\';',
  ],
  s0188: [
    'Altai Mountain Uryankhai at forty-eight degrees thirty minutes;',
    'Altai Mountain Uryankhai 48°30\';',
  ],
  s0189: [
    'Alehui Mountain at forty-eight degrees twenty minutes;',
    'Alehui Mountain 48°20\';',
  ],
  s0190: [
    'Kobdo city at forty-eight degrees two minutes;',
    'Kobdo 48°02\';',
  ],
  s0191: [
    'Uliastai city at forty-seven degrees forty-eight minutes;',
    'Uliastai 47°48\';',
  ],
  s0192: [
    'Kazakh at forty-seven degrees thirty minutes;',
    'Kazakh 47°30\';',
  ],
  s0193: [
    'Tarbagatai at forty-seven degrees;',
    'Tarbagatai 47°00\';',
  ],
  s0194: [
    'Bulegan River Torghut at forty-seven degrees;',
    'Bulegan River Torghut 47°00\';',
  ],
  s0195: [
    'Balkhash Nur at forty-seven degrees;',
    'Balkhash Nur 47°00\';',
  ],
  s0196: [
    'Ulungu River at forty-six degrees forty minutes;',
    'Ulungu River 46°40\';',
  ],
  s0197: [
    'Hesele Bas Nur at forty-six degrees forty minutes;',
    'Hesele Bas Nur 46°40\';',
  ],
  s0198: [
    'Khoboksar Torghut at forty-six degrees forty minutes;',
    'Khoboksar Torghut 46°40\';',
  ],
  s0199: [
    'Zakhchin at forty-six degrees thirty minutes;',
    'Zakhchin 46°30\';',
  ],
  s0200: [
    'Jair Torghut at forty-six degrees ten minutes;',
    'Jair Torghut 46°10\';',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_026_b02.mjs <translation.json>'
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
