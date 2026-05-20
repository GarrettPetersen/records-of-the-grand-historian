#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Kangxi renzi year—fixed-star ecliptic longitude and latitude table, scroll one. Gauging the sun is how one corrects time; observing stars is how one records days.',
    'Fixed-star ecliptic coordinates, Kangxi renzi (1672), table 1: the sun sets the clock; the stars mark the calendar.',
  ],
  s0002: [
    'The sun travels the ecliptic, so in computing fixed stars one must obtain ecliptic longitude and latitude in degrees and minutes.',
    'Because the sun moves along the ecliptic, fixed-star work requires ecliptic longitude and latitude to the minute.',
  ],
  s0003: [
    'Moreover fixed stars drift east along the ecliptic; comparing upward or seeking downward, each year one need only add or subtract fifty-one seconds of longitude.',
    'Stars also creep eastward on the ecliptic; for any epoch, adjust longitude by only fifty-one seconds per year.',
  ],
  s0004: [
    'Now according to the Kangxi renzi former survey of fixed stars\' ecliptic longitude and latitude in degrees and minutes, and their north-south bearing and magnitude rank, are made two scrolls.',
    'This edition follows the Kangxi renzi star survey—longitude, latitude, hemisphere, and magnitude—in two scrolls.',
  ],
  s0005: [
    'First are listed from Lowering Harvest Xu palace to Quail Tail Si palace, all named stars within one hundred eighty degrees and nearby stars, as at left:',
    'Scroll one lists every named star—and neighbors—across one hundred eighty degrees from Lowering Harvest (Xu) to Quail Tail (Si), as follows.',
  ],
  s0006: ['Ecliptic', 'Ecliptic'],
  s0007: ['Longitude', 'Longitude'],
  s0008: ['Latitude', 'Latitude'],
  s0009: ['Ecliptic', 'Ecliptic'],
  s0010: ['Longitude', 'Longitude'],
  s0011: ['Latitude', 'Latitude'],
  s0012: ['Star Name', 'Star Name'],
  s0013: ['Palace', 'Palace'],
  s0014: ['Degrees', 'Degrees'],
  s0015: ['Minutes', 'Minutes'],
  s0016: ['Direction', 'Direction'],
  s0017: ['Degrees', 'Degrees'],
  s0018: ['Minutes', 'Minutes'],
  s0019: ['Magnitude', 'Magnitude'],
  s0020: ['Star Name', 'Star Name'],
  s0021: ['Palace', 'Palace'],
  s0022: ['Degrees', 'Degrees'],
  s0023: ['Minutes', 'Minutes'],
  s0024: ['Direction', 'Direction'],
  s0025: ['Degrees', 'Degrees'],
  s0026: ['Minutes', 'Minutes'],
  s0027: ['Magnitude', 'Magnitude'],
  s0028: ['Celestial Hook 2', 'Celestial Hook 2'],
  s0029: ['Xu', 'Xu (11th branch)'],
  s0030: ['0 degrees, 0 minutes', '0°0′'],
  s0031: ['0 degrees, 21 minutes', '0°21′'],
  s0032: ['North', 'North'],
  s0033: ['71 degrees', '71°'],
  s0034: ['49 minutes', '49′'],
  s0035: ['4', 'Magnitude 4'],
  s0036: ['Celestial Hook 1', 'Celestial Hook 1'],
  s0037: ['Xu', 'Xu (11th branch)'],
  s0038: ['0 degrees, 0 minutes', '0°0′'],
  s0039: ['0 degrees, 54 minutes', '0°54′'],
  s0040: ['North', 'North'],
  s0041: ['74 degrees', '74°'],
  s0042: ['0 minutes', '0′'],
  s0043: ['4', 'Magnitude 4'],
  s0044: ['Celestial Privy 4', 'Celestial Privy 4'],
  s0045: ['Xu', 'Xu (11th branch)'],
  s0046: ['0 degrees, 0 minutes', '0°0′'],
  s0047: ['0 degrees, 57 minutes', '0°57′'],
  s0048: ['South', 'South'],
  s0049: ['14 degrees', '14°'],
  s0050: ['0 minutes', '0′'],
  s0051: ['5', 'Magnitude 5'],
  s0060: ['Celestial Park 4', 'Celestial Park 4'],
  s0061: ['Xu', 'Xu (11th branch)'],
  s0062: ['0 degrees, 2 minutes', '0°2′'],
  s0063: ['0 minutes', '0′'],
  s0064: ['South', 'South'],
  s0065: ['57 degrees', '57°'],
  s0066: ['50 minutes', '50′'],
  s0067: ['3', 'Magnitude 3'],
  s0076: ['Celestial Privy 2', 'Celestial Privy 2'],
  s0077: ['Xu', 'Xu (11th branch)'],
  s0078: ['0 degrees, 2 minutes', '0°2′'],
  s0079: ['3 degrees, 7 minutes', '3°7′'],
  s0080: ['South', 'South'],
  s0081: ['13 degrees', '13°'],
  s0082: ['40 minutes', '40′'],
  s0083: ['5', 'Magnitude 5'],
  s0092: [
    'Source reference: Draft History of Qing, Treatise 4 (Astronomy), ctext.org library page.',
    'Source: Draft History of Qing, Treatise 4 (Astronomy), ctext.org.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_029_b01.mjs <translation.json>'
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
