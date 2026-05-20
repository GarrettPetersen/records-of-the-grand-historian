#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'Khobdo — north polar altitude forty-five degrees;',
    'Khobdo: 45° latitude;',
  ],
  s0202: [
    'the Chui River — north polar altitude forty-four degrees fifty minutes;',
    'the Chui River: 44°50′ latitude;',
  ],
  s0203: [
    'Bortala — north polar altitude forty-four degrees fifty minutes;',
    'Bortala: 44°50′ latitude;',
  ],
  s0204: [
    'Badakh — north polar altitude forty-four degrees forty-three minutes;',
    'Badakh: 44°43′ latitude;',
  ],
  s0205: [
    'Jing River Torghut — north polar altitude forty-four degrees thirty-five minutes;',
    'Jing River Torghut: 44°35′ latitude;',
  ],
  s0206: [
    'Körkö Üüs Torghut — north polar altitude forty-four degrees thirty minutes;',
    'Körkö Üüs Torghut: 44°30′ latitude;',
  ],
  s0207: [
    'Anji Hai — north polar altitude forty-four degrees thirteen minutes;',
    'Anji Hai: 44°13′ latitude;',
  ],
  s0208: [
    'Kash — north polar altitude forty-four degrees eight minutes;',
    'Kash: 44°8′ latitude;',
  ],
  s0209: [
    'Ili — north polar altitude forty-three degrees fifty-six minutes;',
    'Ili: 43°56′ latitude;',
  ],
  s0210: [
    'the Talas River — north polar altitude forty-three degrees fifty minutes;',
    'the Talas River: 43°50′ latitude;',
  ],
  s0211: [
    'Mulei — north polar altitude forty-three degrees forty-five minutes;',
    'Mulei: 43°45′ latitude;',
  ],
  s0212: [
    'Jimsar — north polar altitude forty-three degrees forty minutes;',
    'Jimsar: 43°40′ latitude;',
  ],
  s0213: [
    'Barkol — north polar altitude forty-three degrees thirty-nine minutes;',
    'Barkol: 43°39′ latitude;',
  ],
  s0214: [
    'Konggis — north polar altitude forty-three degrees thirty-three minutes;',
    'Konggis: 43°33′ latitude;',
  ],
  s0215: [
    'Urumqi — north polar altitude forty-three degrees twenty-seven minutes;',
    'Urumqi: 43°27′ latitude;',
  ],
  s0216: [
    'Zhuledusi — north polar altitude forty-three degrees seventeen minutes;',
    'Zhuledusi: 43°17′ latitude;',
  ],
  s0217: [
    'Turfan — north polar altitude forty-three degrees four minutes;',
    'Turfan: 43°4′ latitude;',
  ],
  s0218: [
    'Tashkent — north polar altitude forty-three degrees three minutes;',
    'Tashkent: 43°3′ latitude;',
  ],
  s0219: [
    'Khoshuud — north polar altitude forty-three degrees;',
    'Khoshuud: 43° latitude;',
  ],
  s0220: [
    'Nalin Mountain — north polar altitude forty-three degrees;',
    'Nalin Mountain: 43° latitude;',
  ],
  s0221: [
    'Temurtu Nor — north polar altitude forty-two degrees fifty minutes;',
    'Temurtu Nor: 42°50′ latitude;',
  ],
  s0222: [
    'Lukchin — north polar altitude forty-two degrees forty-eight minutes;',
    'Lukchin: 42°48′ latitude;',
  ],
  s0223: [
    'Ushak-tarla — north polar altitude forty-two degrees sixteen minutes;',
    'Ushak-tarla: 42°16′ latitude;',
  ],
  s0224: [
    'Karashahr — north polar altitude forty-two degrees seven minutes;',
    'Karashahr: 42°7′ latitude;',
  ],
  s0225: [
    'Korla — north polar altitude forty-one degrees forty-six minutes;',
    'Korla: 41°46′ latitude;',
  ],
  s0226: [
    'Burgu — north polar altitude forty-one degrees forty-four minutes;',
    'Burgu: 41°44′ latitude;',
  ],
  s0227: [
    'Sayram — north polar altitude forty-one degrees forty-one minutes;',
    'Sayram: 41°41′ latitude;',
  ],
  s0228: [
    'Namangan — north polar altitude forty-one degrees thirty-eight minutes;',
    'Namangan: 41°38′ latitude;',
  ],
  s0229: [
    'Kucha — north polar altitude forty-one degrees thirty-seven minutes;',
    'Kucha: 41°37′ latitude;',
  ],
  s0230: [
    'Burut — north polar altitude forty-one degrees twenty-eight minutes;',
    'Burut: 41°28′ latitude;',
  ],
  s0231: [
    'Andijan — north polar altitude forty-one degrees twenty-eight minutes;',
    'Andijan: 41°28′ latitude;',
  ],
  s0232: [
    'Kokand — north polar altitude forty-one degrees twenty-three minutes;',
    'Kokand: 41°23′ latitude;',
  ],
  s0233: [
    'Aksu — north polar altitude forty-one degrees nine minutes;',
    'Aksu: 41°9′ latitude;',
  ],
  s0234: [
    'Ush — north polar altitude forty-one degrees six minutes;',
    'Ush: 41°6′ latitude;',
  ],
  s0235: [
    'Osh — north polar altitude forty degrees nineteen minutes;',
    'Osh: 40°19′ latitude;',
  ],
  s0236: [
    'Kashgar — north polar altitude thirty-nine degrees twenty-five minutes;',
    'Kashgar: 39°25′ latitude;',
  ],
  s0237: [
    'Barchuk — north polar altitude thirty-nine degrees fifteen minutes;',
    'Barchuk: 39°15′ latitude;',
  ],
  s0238: [
    'Yengisar — north polar altitude thirty-eight degrees forty-seven minutes;',
    'Yengisar: 38°47′ latitude;',
  ],
  s0239: [
    'Yarkand — north polar altitude thirty-eight degrees nineteen minutes;',
    'Yarkand: 38°19′ latitude;',
  ],
  s0240: [
    'Wakhan — north polar altitude thirty-eight degrees;',
    'Wakhan: 38° latitude;',
  ],
  s0241: [
    'Seriqkul — north polar altitude thirty-seven degrees forty-eight minutes;',
    'Seriqkul: 37°48′ latitude;',
  ],
  s0242: [
    'Qachar — north polar altitude thirty-seven degrees eleven minutes;',
    'Qachar: 37°11′ latitude;',
  ],
  s0243: [
    'Karakash — north polar altitude thirty-seven degrees ten minutes;',
    'Karakash: 37°10′ latitude;',
  ],
  s0244: [
    'Keriya — north polar altitude thirty-seven degrees;',
    'Keriya: 37° latitude;',
  ],
  s0245: [
    'Khotan — north polar altitude thirty-seven degrees;',
    'Khotan: 37° latitude;',
  ],
  s0246: [
    'Iliq — north polar altitude thirty-seven degrees;',
    'Iliq: 37° latitude;',
  ],
  s0247: [
    'Bolor — north polar altitude thirty-seven degrees;',
    'Bolor: 37° latitude;',
  ],
  s0248: [
    'Sanzhu — north polar altitude thirty-six degrees fifty-eight minutes;',
    'Sanzhu: 36°58′ latitude;',
  ],
  s0249: [
    'Yulong Kash — north polar altitude thirty-six degrees fifty-two minutes;',
    'Yulong Kash: 36°52′ latitude;',
  ],
  s0250: [
    'Eloshan — north polar altitude thirty-six degrees forty-nine minutes;',
    'Eloshan: 36°49′ latitude;',
  ],
  s0251: [
    'Shignan — north polar altitude thirty-six degrees forty-seven minutes;',
    'Shignan: 36°47′ latitude;',
  ],
  s0252: [
    'Badakhshan — north polar altitude thirty-six degrees twenty-three minutes;',
    'Badakhshan: 36°23′ latitude;',
  ],
  s0253: [
    'Sanzagu — north polar altitude thirty-two degrees one minute;',
    'Sanzagu: 32°1′ latitude;',
  ],
  s0254: [
    'Dangba — north polar altitude thirty-one degrees fifty-six minutes;',
    'Dangba: 31°56′ latitude;',
  ],
  s0255: [
    'Chosjab — north polar altitude thirty-one degrees fifty-three minutes;',
    'Chosjab: 31°53′ latitude;',
  ],
  s0256: [
    'Jinchuan Lewuwei — north polar altitude thirty-one degrees thirty-four minutes;',
    'Jinchuan Lewuwei: 31°34′ latitude;',
  ],
  s0257: [
    'Jinchuan Galai — north polar altitude thirty-one degrees nineteen minutes;',
    'Jinchuan Galai: 31°19′ latitude;',
  ],
  s0258: [
    'Wasi — north polar altitude thirty-one degrees seventeen minutes;',
    'Wasi: 31°17′ latitude;',
  ],
  s0259: [
    'Gebusizan — north polar altitude thirty-one degrees eight minutes;',
    'Gebusizan: 31°8′ latitude;',
  ],
  s0260: [
    'Bulakdi — north polar altitude thirty-one degrees four minutes;',
    'Bulakdi: 31°4′ latitude;',
  ],
  s0261: [
    'Lesser Jinchuan Meinuo — north polar altitude thirty-one degrees;',
    'Lesser Jinchuan Meinuo: 31° latitude;',
  ],
  s0262: [
    'Bawang — north polar altitude thirty degrees fifty-eight minutes;',
    'Bawang: 30°58′ latitude;',
  ],
  s0263: [
    'Wokesi — north polar altitude thirty degrees fifty-six minutes;',
    'Wokesi: 30°56′ latitude;',
  ],
  s0264: [
    'Mingzheng — north polar altitude thirty degrees twenty-eight minutes;',
    'Mingzheng: 30°28′ latitude;',
  ],
  s0265: [
    'Muping — north polar altitude thirty degrees twenty-five minutes;',
    'Muping: 30°25′ latitude;',
  ],
  s0266: [
    'The above were additions to the Shixian Calendar during the Qianlong reign.',
    'Above: Qianlong-era additions to the Shixian Calendar.',
  ],
  s0267: [
    'East-west deviation degrees: Shengjing — offset to the east seven degrees fifteen minutes;',
    'East-west longitudinal offsets: Shengjing, 7°15′ east of the capital meridian;',
  ],
  s0268: [
    'Zhejiang — offset to the east three degrees forty-one minutes twenty-four seconds;',
    'Zhejiang: 3°41′24″ E of the capital meridian;',
  ],
  s0269: [
    'Fujian — offset to the east two degrees fifty-nine minutes;',
    'Fujian: 2°59′ E of the capital meridian;',
  ],
  s0270: [
    'Jiangnan — offset to the east two degrees eighteen minutes;',
    'Jiangnan: 2°18′ E of the capital meridian;',
  ],
  s0271: [
    'Shandong — offset to the east two degrees fifteen minutes;',
    'Shandong: 2°15′ E of the capital meridian;',
  ],
  s0272: [
    'Jiangxi — offset to the west thirty-seven minutes;',
    'Jiangxi: 37′ W of the capital meridian;',
  ],
  s0273: [
    'Henan — offset to the west one degree fifty-six minutes;',
    'Henan: 1°56′ W of the capital meridian;',
  ],
  s0274: [
    'Huguang — offset to the west two degrees seventeen minutes;',
    'Huguang: 2°17′ W of the capital meridian;',
  ],
  s0275: [
    'Guangdong — offset to the west three degrees thirty-three minutes fifteen seconds;',
    'Guangdong: 3°33′15″ W of the capital meridian;',
  ],
  s0276: [
    'Shanxi — offset to the west three degrees fifty-seven minutes forty-two seconds;',
    'Shanxi: 3°57′42″ W of the capital meridian;',
  ],
  s0277: [
    'Guangxi — offset to the west six degrees fourteen minutes forty seconds;',
    'Guangxi: 6°14′40″ W of the capital meridian;',
  ],
  s0278: [
    'Shaanxi — offset to the west seven degrees thirty-three minutes forty seconds;',
    'Shaanxi: 7°33′40″ W of the capital meridian;',
  ],
  s0279: [
    'Guizhou — offset to the west nine degrees fifty-two minutes forty seconds;',
    'Guizhou: 9°52′40″ W of the capital meridian;',
  ],
  s0280: [
    'Sichuan — offset to the west twelve degrees sixteen minutes;',
    'Sichuan: 12°16′ W of the capital meridian;',
  ],
  s0281: [
    'Yunnan — offset to the west thirteen degrees thirty-seven minutes;',
    'Yunnan: 13°37′ W of the capital meridian;',
  ],
  s0282: [
    'Korea — offset to the east ten degrees thirty minutes;',
    'Korea: 10°30′ E of the capital meridian;',
  ],
  s0283: [
    'Gorlos — offset to the east eight degrees ten minutes;',
    'Gorlos: 8°10′ E of the capital meridian;',
  ],
  s0284: [
    'Jalaid — offset to the east seven degrees forty-five minutes;',
    'Jalaid: 7°45′ E of the capital meridian;',
  ],
  s0285: [
    'Dorbet — offset to the east six degrees ten minutes;',
    'Dorbet: 6°10′ E of the capital meridian;',
  ],
  s0286: [
    'Jalut — offset to the east five degrees;',
    'Jalut: 5° E of the capital meridian;',
  ],
  s0287: [
    'Naiman — offset to the east five degrees;',
    'Naiman: 5° E of the capital meridian;',
  ],
  s0288: [
    'Horqin — offset to the east four degrees thirty minutes;',
    'Horqin: 4°30′ E of the capital meridian;',
  ],
  s0289: [
    'Aohan — offset to the east four degrees;',
    'Aohan: 4° E of the capital meridian;',
  ],
  s0290: [
    'Alu Horqin — offset to the east three degrees fifty minutes;',
    'Alu Horqin: 3°50′ E of the capital meridian;',
  ],
  s0291: [
    'Khalkha River Keleheshao — offset to the east two degrees forty-six minutes;',
    'Khalkha River Keleheshao: 2°46′ E of the capital meridian;',
  ],
  s0292: [
    'Bairin — offset to the east two degrees fourteen minutes;',
    'Bairin: 2°14′ E of the capital meridian;',
  ],
  s0293: [
    'Kharachin — offset to the east two degrees;',
    'Kharachin: 2° E of the capital meridian;',
  ],
  s0294: [
    'Ungniut — offset to the east two degrees;',
    'Ungniut: 2° E of the capital meridian;',
  ],
  s0295: [
    'Ujimqin — offset to the east one degree ten minutes;',
    'Ujimqin: 1°10′ E of the capital meridian;',
  ],
  s0296: [
    'Keshiketeng — offset to the east one degree ten minutes;',
    'Keshiketeng: 1°10′ E of the capital meridian;',
  ],
  s0297: [
    'Haoqit — offset to the east thirty minutes;',
    'Haoqit: 30′ E of the capital meridian;',
  ],
  s0298: [
    'Abag Hanar — offset to the east twenty-eight minutes;',
    'Abag Hanar: 28′ E of the capital meridian;',
  ],
  s0299: [
    'Abagai — offset to the east twenty-eight minutes;',
    'Abagai: 28′ E of the capital meridian;',
  ],
  s0300: [
    'Sunid — offset to the west one degree twenty-eight minutes;',
    'Sunid: 1°28′ W of the capital meridian;',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_026_b03.mjs <translation.json>'
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
