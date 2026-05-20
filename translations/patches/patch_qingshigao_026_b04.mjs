#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'Kerulen River Baras City — offset to the west two degrees fifty-two minutes;',
    'Kerulen River Baras City: 2°52′ W of the capital meridian;',
  ],
  s0302: [
    'Four Banners — offset to the west four degrees twenty-two minutes;',
    'Four Banners: 4°22′ W of the capital meridian;',
  ],
  s0303: [
    'Guihua City — offset to the west four degrees forty-eight minutes;',
    'Guihua City: 4°48′ W of the capital meridian;',
  ],
  s0304: [
    'Tumed — offset to the west four degrees forty-eight minutes;',
    'Tumed: 4°48′ W of the capital meridian;',
  ],
  s0305: [
    'Khalkha — offset to the west five degrees fifty-five minutes;',
    'Khalkha: 5°55′ W of the capital meridian;',
  ],
  s0306: [
    'Maominggan — offset to the west six degrees nine minutes;',
    'Maominggan: 6°9′ W of the capital meridian;',
  ],
  s0307: [
    'Urad — offset to the west six degrees thirty minutes;',
    'Urad: 6°30′ W of the capital meridian;',
  ],
  s0308: [
    'Kentai Mountain — offset to the west seven degrees three minutes;',
    'Kentai Mountain: 7°3′ W of the capital meridian;',
  ],
  s0309: [
    'Ordos — offset to the west eight degrees;',
    'Ordos: 8° W of the capital meridian;',
  ],
  s0310: [
    'Tula River Hanshan — offset to the west nine degrees twelve minutes;',
    'Tula River Hanshan: 9°12′ W of the capital meridian;',
  ],
  s0311: [
    'Wengji River — offset to the west eleven degrees;',
    'Wengji River: 11° W of the capital meridian;',
  ],
  s0312: [
    'Gurban Saikhan — offset to the west eleven degrees;',
    'Gurban Saikhan: 11° W of the capital meridian;',
  ],
  s0313: [
    'Burung Burga Sutai — offset to the west eleven degrees twenty-two minutes;',
    'Burung Burga Sutai: 11°22′ W of the capital meridian;',
  ],
  s0314: [
    'Alashan Mountain — offset to the west twelve degrees;',
    'Alashan Mountain: 12° W of the capital meridian;',
  ],
  s0315: [
    'Egeselingge — offset to the west twelve degrees twenty-five minutes;',
    'Egeselingge: 12°25′ W of the capital meridian;',
  ],
  s0316: [
    'Orkhon River Erdene Zhao — offset to the west thirteen degrees five minutes;',
    'Orkhon River Erdene Zhao: 13°5′ W of the capital meridian;',
  ],
  s0317: [
    'the Tui River — offset to the west fifteen degrees fifteen minutes;',
    'the Tui River: 15°15′ W of the capital meridian;',
  ],
  s0318: [
    'Sangjin Dalai Lake — offset to the west sixteen degrees twenty minutes;',
    'Sangjin Dalai Lake: 16°20′ W of the capital meridian;',
  ],
  s0319: [
    'Saksatu Gurik — offset to the west nineteen degrees thirty minutes;',
    'Saksatu Gurik: 19°30′ W of the capital meridian;',
  ],
  s0320: [
    'Kongge Yizhabu Han River — offset to the west twenty degrees twelve minutes;',
    'Kongge Yizhabu Han River: 20°12′ W of the capital meridian;',
  ],
  s0321: [
    'Hami City — offset to the west twenty-two degrees thirty-two minutes.',
    'Hami City: 22°32′ W of the capital meridian.',
  ],
  s0322: [
    'The above were from actual surveys in the Kangxi reign.',
    'Above: Kangxi-era measured values.',
  ],
  s0323: [
    'Sanxing — offset to the east thirteen degrees twenty minutes;',
    'Sanxing: 13°20′ E of the capital meridian;',
  ],
  s0324: [
    'the Amur — offset to the east ten degrees fifty-eight minutes; Jilin — offset to the east ten degrees twenty-seven minutes;',
    'Amur: 10°58′ E; Jilin: 10°27′ E of the capital meridian;',
  ],
  s0325: [
    'Boduna — offset to the east eight degrees thirty-seven minutes;',
    'Boduna: 8°37′ E of the capital meridian;',
  ],
  s0326: [
    'Anhui — offset to the east thirty-four minutes;',
    'Anhui: 34′ E of the capital meridian;',
  ],
  s0327: [
    'Albazin — offset to the west seventeen minutes;',
    'Albazin: 17′ W of the capital meridian;',
  ],
  s0328: [
    'Hunan — offset to the west three degrees forty-two minutes;',
    'Hunan: 3°42′ W of the capital meridian;',
  ],
  s0329: [
    'Annam — offset to the west ten degrees;',
    'Annam: 10° W of the capital meridian;',
  ],
  s0330: [
    'Gansu — offset to the west twelve degrees thirty-six minutes;',
    'Gansu: 12°36′ W of the capital meridian;',
  ],
  s0331: [
    'Uliastai City — offset to the west twenty-two degrees forty minutes;',
    'Uliastai City: 22°40′ W of the capital meridian;',
  ],
  s0332: [
    'Barkol — offset to the west twenty-three degrees;',
    'Barkol: 23° W of the capital meridian;',
  ],
  s0333: [
    'Zhahacin — offset to the west twenty-three degrees ten minutes;',
    'Zhahacin: 23°10′ W of the capital meridian;',
  ],
  s0334: [
    'Tannu Uriankhai — offset to the west twenty-four degrees twenty minutes;',
    'Tannu Uriankhai: 24°20′ W of the capital meridian;',
  ],
  s0335: [
    'Khobdo — offset to the west twenty-four degrees twenty-six minutes;',
    'Khobdo: 24°26′ W of the capital meridian;',
  ],
  s0336: [
    'Badakh — offset to the west twenty-five degrees;',
    'Badakh: 25° W of the capital meridian;',
  ],
  s0337: [
    'Mulei — offset to the west twenty-five degrees thirty-six minutes;',
    'Mulei: 25°36′ W of the capital meridian;',
  ],
  s0338: [
    'Ulan Gom Dorbet — offset to the west twenty-five degrees forty minutes;',
    'Ulan Gom Dorbet: 25°40′ W of the capital meridian;',
  ],
  s0339: [
    'Lukchin — offset to the west twenty-six degrees eleven minutes;',
    'Lukchin: 26°11′ W of the capital meridian;',
  ],
  s0340: [
    'Turfan — offset to the west twenty-six degrees forty-five minutes;',
    'Turfan: 26°45′ W of the capital meridian;',
  ],
  s0341: [
    'Jimsar — offset to the west twenty-six degrees fifty-two minutes;',
    'Jimsar: 26°52′ W of the capital meridian;',
  ],
  s0342: [
    'Kobdo City — offset to the west twenty-seven degrees twenty minutes;',
    'Kobdo City: 27°20′ W of the capital meridian;',
  ],
  s0343: [
    'Urumqi — offset to the west twenty-seven degrees fifty-six minutes;',
    'Urumqi: 27°56′ W of the capital meridian;',
  ],
  s0344: [
    'Bulegan River Torghut — offset to the west twenty-eight degrees ten minutes;',
    'Bulegan River Torghut: 28°10′ W of the capital meridian;',
  ],
  s0345: [
    'Ushak-tarla — offset to the west twenty-eight degrees twenty-six minutes;',
    'Ushak-tarla: 28°26′ W of the capital meridian;',
  ],
  s0346: [
    'Altai Uriankhai — offset to the west twenty-eight degrees thirty-five minutes;',
    'Altai Uriankhai: 28°35′ W of the capital meridian;',
  ],
  s0347: [
    'Altan Nor Uriankhai — offset to the west twenty-eight degrees forty minutes;',
    'Altan Nor Uriankhai: 28°40′ W of the capital meridian;',
  ],
  s0348: [
    'Hanshan Hatun River — offset to the west twenty-nine degrees;',
    'Hanshan Hatun River: 29° W of the capital meridian;',
  ],
  s0349: [
    'the Ulungu River — offset to the west twenty-nine degrees fifteen minutes;',
    'the Ulungu River: 29°15′ W of the capital meridian;',
  ],
  s0350: [
    'Hesele Bas Nor — offset to the west twenty-nine degrees fifteen minutes;',
    'Hesele Bas Nor: 29°15′ W of the capital meridian;',
  ],
  s0351: [
    'Karashahr — offset to the west twenty degrees seventeen minutes;',
    'Karashahr: 20°17′ W of the capital meridian;',
  ],
  s0352: [
    'Korla — offset to the west twenty-nine degrees fifty-six minutes;',
    'Korla: 29°56′ W of the capital meridian;',
  ],
  s0353: [
    'Tarbagatai — offset to the west thirty degrees;',
    'Tarbagatai: 30° W of the capital meridian;',
  ],
  s0354: [
    'Zhuledusi — offset to the west thirty degrees fifty minutes;',
    'Zhuledusi: 30°50′ W of the capital meridian;',
  ],
  s0355: [
    'Anji Hai — offset to the west thirty degrees fifty-four minutes;',
    'Anji Hai: 30°54′ W of the capital meridian;',
  ],
  s0356: [
    'Khoshuud — offset to the west thirty-one degrees;',
    'Khoshuud: 31° W of the capital meridian;',
  ],
  s0357: [
    'Hoboksar Torghut — offset to the west thirty-one degrees fifteen minutes;',
    'Hoboksar Torghut: 31°15′ W of the capital meridian;',
  ],
  s0358: [
    'Körkö Üüs Torghut — offset to the west thirty-one degrees fifty-six minutes;',
    'Körkö Üüs Torghut: 31°56′ W of the capital meridian;',
  ],
  s0359: [
    'Konggis — offset to the west thirty-two degrees;',
    'Konggis: 32° W of the capital meridian;',
  ],
  s0360: [
    'Burgu — offset to the west thirty-two degrees seven minutes;',
    'Burgu: 32°7′ W of the capital meridian;',
  ],
  s0361: [
    'the Irtysh River — offset to the west thirty-two degrees twenty-five minutes;',
    'the Irtysh River: 32°25′ W of the capital meridian;',
  ],
  s0362: [
    'Zaisan Nor — offset to the west thirty-two degrees twenty-five minutes;',
    'Zaisan Nor: 32°25′ W of the capital meridian;',
  ],
  s0363: [
    'Kash — offset to the west thirty-three degrees;',
    'Kash: 33° W of the capital meridian;',
  ],
  s0364: [
    'Zhail Torghut — offset to the west thirty-three degrees;',
    'Zhail Torghut: 33° W of the capital meridian;',
  ],
  s0365: [
    'Bortala — offset to the west thirty-three degrees thirty minutes;',
    'Bortala: 33°30′ W of the capital meridian;',
  ],
  s0366: [
    'Jing River Torghut — offset to the west thirty-three degrees thirty minutes;',
    'Jing River Torghut: 33°30′ W of the capital meridian;',
  ],
  s0367: [
    'Kucha — offset to the west thirty-three degrees thirty-two minutes;',
    'Kucha: 33°32′ W of the capital meridian;',
  ],
  s0368: [
    'Keriya — offset to the west thirty-three degrees thirty-three minutes;',
    'Keriya: 33°33′ W of the capital meridian;',
  ],
  s0369: [
    'Ili — offset to the west thirty-four degrees twenty minutes;',
    'Ili: 34°20′ W of the capital meridian;',
  ],
  s0370: [
    'Sayram — offset to the west thirty-four degrees forty minutes;',
    'Sayram: 34°40′ W of the capital meridian;',
  ],
  s0371: [
    'the Kazakhs — offset to the west thirty-four degrees fifty minutes;',
    'the Kazakhs: 34°50′ W of the capital meridian;',
  ],
  s0372: [
    'Yulong Kash — offset to the west thirty-five degrees thirty-seven minutes;',
    'Yulong Kash: 35°37′ W of the capital meridian;',
  ],
  s0373: [
    'Khotan — offset to the west thirty-five degrees fifty-two minutes;',
    'Khotan: 35°52′ W of the capital meridian;',
  ],
  s0374: [
    'Iliq — offset to the west thirty-five degrees fifty-two minutes;',
    'Iliq: 35°52′ W of the capital meridian;',
  ],
  s0375: [
    'Karakash — offset to the west thirty-six degrees fourteen minutes;',
    'Karakash: 36°14′ W of the capital meridian;',
  ],
  s0376: [
    'Alehui Mountain — offset to the west thirty-six degrees fifty minutes;',
    'Alehui Mountain: 36°50′ W of the capital meridian;',
  ],
  s0377: [
    'Aksu — offset to the west thirty-seven degrees fifteen minutes;',
    'Aksu: 37°15′ W of the capital meridian;',
  ],
  s0378: [
    'Sanzhu — offset to the west thirty-seven degrees forty-seven minutes;',
    'Sanzhu: 37°47′ W of the capital meridian;',
  ],
  s0379: [
    'Balkhash Nor — offset to the west thirty-eight degrees ten minutes;',
    'Balkhash Nor: 38°10′ W of the capital meridian;',
  ],
  s0380: [
    'Ush — offset to the west thirty-eight degrees twenty-seven minutes;',
    'Ush: 38°27′ W of the capital meridian;',
  ],
  s0381: [
    'Temurtu Nor — offset to the west thirty-nine degrees twenty minutes;',
    'Temurtu Nor: 39°20′ W of the capital meridian;',
  ],
  s0382: [
    'Barchuk — offset to the west thirty-nine degrees thirty-five minutes;',
    'Barchuk: 39°35′ W of the capital meridian;',
  ],
  s0383: [
    'Yarkand — offset to the west forty degrees ten minutes;',
    'Yarkand: 40°10′ W of the capital meridian;',
  ],
  s0384: [
    'Yengisar — offset to the west forty-one degrees fifty minutes;',
    'Yengisar: 41°50′ W of the capital meridian;',
  ],
  s0385: [
    'the Chui River — offset to the west forty-two degrees;',
    'the Chui River: 42° W of the capital meridian;',
  ],
  s0386: [
    'Kashgar — offset to the west forty-two degrees twenty-five minutes;',
    'Kashgar: 42°25′ W of the capital meridian;',
  ],
  s0387: [
    'Seriqkul — offset to the west forty-two degrees twenty-four minutes;',
    'Seriqkul: 42°24′ W of the capital meridian;',
  ],
  s0388: [
    'Qachar — offset to the west forty-two degrees thirty-two minutes;',
    'Qachar: 42°32′ W of the capital meridian;',
  ],
  s0389: [
    'Osh — offset to the west forty-two degrees fifty minutes;',
    'Osh: 42°50′ W of the capital meridian;',
  ],
  s0390: [
    'Bolor — offset to the west forty-three degrees thirty-eight minutes;',
    'Bolor: 43°38′ W of the capital meridian;',
  ],
  s0391: [
    'Badakhshan — offset to the west forty-three degrees fifty minutes;',
    'Badakhshan: 43°50′ W of the capital meridian;',
  ],
  s0392: [
    'the Talas River — offset to the west forty-four degrees;',
    'the Talas River: 44° W of the capital meridian;',
  ],
  s0393: [
    'Burut — offset to the west forty-four degrees thirty-five minutes;',
    'Burut: 44°35′ W of the capital meridian;',
  ],
  s0394: [
    'Andijan — offset to the west forty-four degrees thirty-five minutes;',
    'Andijan: 44°35′ W of the capital meridian;',
  ],
  s0395: [
    'Shignan — offset to the west forty-four degrees forty-six minutes;',
    'Shignan: 44°46′ W of the capital meridian;',
  ],
  s0396: [
    'Nalin Mountain — offset to the west forty-five degrees;',
    'Nalin Mountain: 45° W of the capital meridian;',
  ],
  s0397: [
    'Wakhan — offset to the west forty-five degrees nine minutes;',
    'Wakhan: 45°9′ W of the capital meridian;',
  ],
  s0398: [
    'Eloshan — offset to the west forty-five degrees twenty-six minutes;',
    'Eloshan: 45°26′ W of the capital meridian;',
  ],
  s0399: [
    'Namangan — offset to the west forty-five degrees forty minutes;',
    'Namangan: 45°40′ W of the capital meridian;',
  ],
  s0400: [
    'Kokand — offset to the west forty-five degrees fifty-six minutes;',
    'Kokand: 45°56′ W of the capital meridian;',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_026_b04.mjs <translation.json>'
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
