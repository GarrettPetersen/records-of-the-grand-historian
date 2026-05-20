#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'What is fixed at the two poles of the motion ring is the straight pivot; what is lashed at the center of the straight pivot is the sight-tube.',
    'The straight pivot is fixed at both poles of the motion ring; the sight-tube is lashed to its center.',
  ],
  s0102: [
    'Within the motion ring one must set a straight sight to indicate right ascension and time; to the right of the sight-tube one sets a straight sight to indicate latitude.',
    'A straight sight inside the ring marks right ascension and time; another beside the sight-tube marks latitude.',
  ],
  s0103: [
    'Separately are set a borrowed-arc time-degree indicator, upright sights, parallel upright sights, and parallel borrowed-arc sights, to remedy limits of what can be measured.',
    'Auxiliary borrowed-arc, upright, parallel upright, and parallel borrowed-arc sights cover cases the main setup cannot reach.',
  ],
  s0104: [
    'Also are set a pin right-ascension gauge, a pin time gauge, and a parallel-line right-ascension gauge, so that two measurements may agree.',
    'Pin gauges for right ascension and time plus a parallel-line right-ascension gauge align paired readings.',
  ],
  s0105: [
    'The dimensions: meridian circle outer diameter six feet three inches, inner diameter five feet six inches six fen, ring face width three inches two fen, thickness nine fen, hollow center one inch.',
    'The meridian circle measures 6 ft 3 in outer, 5 ft 6.6 in inner, 3.2 in face width, 0.9 in thick, with a 1 in hollow center.',
  ],
  s0106: [
    'Constant celestial equator outer diameter six feet one inch two fen, inner diameter five feet six inches four fen, ring face width two inches four fen, thickness one inch four fen.',
    'The constant celestial equator ring is 6 ft 1.2 in outer, 5 ft 6.4 in inner, 2.4 in face width, and 1.4 in thick.',
  ],
  s0107: [
    'Celestial-pole meridian circle outer diameter five feet five inches six fen, inner diameter five feet one inch two fen, ring face width two inches eight fen, thickness eight fen, hollow center one inch two fen.',
    'The celestial-pole meridian circle is 5 ft 5.6 in outer, 5 ft 1.2 in inner, 2.8 in face width, 0.8 in thick, with a 1.2 in hollow center.',
  ],
  s0108: [
    'Revolving equator outer diameter five feet five inches six fen, inner diameter five feet one inch two fen, ring face width two inches two fen, thickness one inch two fen.',
    'The revolving equator ring is 5 ft 5.6 in outer, 5 ft 1.2 in inner, 2.2 in face width, and 1.2 in thick.',
  ],
  s0109: [
    'Four-motion ring outer diameter five feet, inner diameter four feet six inches eight fen, ring face width one inch six fen, thickness seven fen, hollow center one inch four fen.',
    'The four-motion ring is 5 ft outer, 4 ft 6.8 in inner, 1.6 in face width, 0.7 in thick, with a 1.4 in hollow center.',
  ],
  s0110: [
    'Straight pivot length equals the circle\'s full diameter, width one inch six fen, thickness seven fen, hollow center one inch four fen.',
    'The straight pivot spans the ring\'s full diameter, 1.6 in wide, 0.7 in thick, with a 1.4 in hollow center.',
  ],
  s0111: [
    'Sight-tube length four feet seven inches two fen, square one inch two fen, hollow center one inch.',
    'The sight-tube is 4 ft 7.2 in long, 1.2 in square, with a 1 in hollow bore.',
  ],
  s0112: [
    'At both upper and lower ends square copper caps are fitted, thickness five fen, inner three fen, square one inch, entering the tube; outer two fen, square one inch two fen, flush with the tube face; a round hole is opened at the center.',
    'Square copper caps cap both ends: 0.5 in thick, 1 in square inside the tube, 1.2 in square flush outside, with a central round hole.',
  ],
  s0113: [
    'Time-degree indicator, overall length seven inches three fen, body length one inch six fen, shaped like a square tube, entering the hollow between the four-motion double rings, width one inch four fen; cross-strap length three inches two fen, width five fen; both ends each hook back two fen and clasp outside the ring face.',
    'The time-degree indicator is 7.3 in overall, 1.6 in body, a square tube in the four-motion ring hollow, 1.4 in wide, with a 3.2 by 0.5 in cross-strap hooked 0.2 in at each end over the ring face.',
  ],
  s0114: [
    'Indicator length five inches two fen, width one inch.',
    'The indicator plate is 5.2 in long and 1 in wide.',
  ],
  s0115: [
    'Its time-degree edge line faces the square tube\'s center; lower end two inches four fen, thickness three fen, tangent to the revolving equator face, to indicate degrees and minutes.',
    'The time-degree edge aligns with the tube center; the lower 2.4 in, 0.3 in thick, lies tangent to the revolving equator to mark degrees.',
  ],
  s0116: [
    'Upper end two inches eight fen, thickness two fen, tangent to the constant celestial equator face, to indicate the hour.',
    'The upper 2.8 in, 0.2 in thick, lies tangent to the constant celestial equator to mark the hour.',
  ],
  s0117: [
    'Latitude indicator, its form doubly curved, mounted on the right face of the sight-tube.',
    'The latitude indicator is doubly curved and mounted on the sight-tube\'s right face.',
  ],
  s0118: [
    'Base length three inches, width nine fen, curve span seven fen, equal to the four-motion ring\'s thickness.',
    'Its base is 3 in long, 0.9 in wide; the curve spans 0.7 in, matching the four-motion ring\'s thickness.',
  ],
  s0119: [
    'Again the curve length one inch seven fen, tangent to the four-motion ring\'s outer face; from the center line half the width is cut away — thus it indicates latitude.',
    'A further 1.7 in curve lies tangent to the ring\'s outer face; half the width is trimmed from the center line to mark latitude.',
  ],
  s0120: [
    'Borrowed-arc time-degree indicator: its square tube and cross-strap length and width are all the same as the foregoing time-degree indicator.',
    'The borrowed-arc time-degree indicator matches the main indicator\'s square tube and cross-strap dimensions.',
  ],
  s0121: [
    'Below the cross-strap, from left to right, an arc back is set upright, length nine inches three fen, width one inch two fen, thickness one fen six li.',
    'Below the cross-strap a curved back is set left to right: 9.3 in long, 1.2 in wide, 0.16 in thick.',
  ],
  s0122: [
    'At the arc back\'s end a level time-degree indicator is set; deducting the arc back\'s thickness, length five inches two fen, width one inch.',
    'At the arc\'s end sits a level time-degree indicator, 5.2 by 1 in apart from the arc\'s thickness.',
  ],
  s0123: [
    'From the indicator\'s square-tube center line to the time-degree indicator\'s inner edge, length six inches seven fen, equivalent to fifteen degrees on the revolving equator and one hour on the constant celestial equator.',
    'From the square-tube center to the indicator\'s inner edge is 6.7 in — fifteen degrees on the revolving equator, one hour on the constant celestial equator.',
  ],
  s0124: [
    'Two upright sights, form straight with flat base; sight height and base length each three inches two fen, width nine fen, thickness one fen.',
    'Two upright sights, straight with flat bases, each 3.2 in high and long, 0.9 in wide, 0.1 in thick.',
  ],
  s0125: [
    'One sight opens upward with a long rectangular aperture one inch long, a straight line left in the middle; again five fen above opens a round hole, diameter four fen, a cross line left in the middle; mounted on the sight-tube\'s upper end.',
    'One sight has a 1 in rectangular slot with a center line, then a 0.4 in round hole 0.5 in above with crosshairs, on the sight-tube\'s upper end.',
  ],
  s0126: [
    'One sight by the foregoing measure opens a straight slit below and a small round hole above, mounted on the sight-tube\'s lower end; each faces the tube face center line, fastened with screws.',
    'The other has a lower slit and upper pinhole on the lower end, each aligned to the tube center line and screwed fast.',
  ],
  s0127: [
    'Two parallel upright sights, form curved with flat base; base plate length four inches, width one inch two fen, thickness one fen, hollow center three inches two fen, width nine fen.',
    'Two parallel upright sights curve from flat bases: base plate 4 by 1.2 in, 0.1 in thick, with a 3.2 by 0.9 in hollow center.',
  ],
  s0128: [
    'The sight curves like a right triangle.',
    'Each sight forms a right triangle.',
  ],
  s0129: [
    'The vertical leg straight like an upright sight, height three inches two fen, width nine fen.',
    'The vertical leg stands like an upright sight, 3.2 in high and 0.9 in wide.',
  ],
  s0130: [
    'The horizontal leg joins the leg\'s end, length five inches, width nine fen, set crosswise at the base plate\'s end.',
    'The horizontal leg joins the foot, 5 by 0.9 in, cross-mounted at the base plate\'s end.',
  ],
  s0131: [
    'The base plate is hollow and sleeves over the upright sight\'s base plate outside, pinching the sight to fix it.',
    'The hollow base plate sleeves over the upright sight\'s base and clamps it fast.',
  ],
  s0132: [
    'Parallel borrowed-arc sight, made like the parallel upright sight, but inverted in orientation.',
    'The parallel borrowed-arc sight matches the parallel upright sight but reversed in orientation.',
  ],
  s0133: [
    'One sight is planted upward on the tube face, height four inches one fen zero eight li; one sight hangs down from the tube face, length six inches two fen zero eight li.',
    'One sight rises 4.108 in from the tube face; the other hangs 6.208 in below it.',
  ],
  s0134: [
    'Six fen below the sight end a round hole is opened; again five fen below opens a long rectangular hole — all like the upright sight\'s make.',
    'Each has a round hole 0.6 in from the end and a rectangular slot 0.5 in lower, as on the upright sights.',
  ],
  s0135: [
    'Pin right-ascension gauge, overall length four inches, width one inch four fen.',
    'The pin right-ascension gauge is 4 in long and 1.4 in wide overall.',
  ],
  s0136: [
    'Its square tube body length one inch six fen, height one inch eight fen, entering between the four-motion double rings, fixed left and right with screws.',
    'Its 1.6 by 1.8 in square tube sits between the four-motion double rings and is screwed fast on both sides.',
  ],
  s0137: [
    'Its end\'s upper and lower two faces clamp the revolving equator; the upper face width seven fen, half the body cut away, aligns straight with the sight-tube center line; the lower face is fixed with a screw.',
    'The end\'s upper and lower jaws clamp the revolving equator; the upper jaw, 0.7 in wide and half the body trimmed, aligns with the sight-tube center line; the lower is screwed fast.',
  ],
  s0138: [
    'Pin time gauge, inner and outer two sections; the inner section\'s upper, lower, and inner three faces are lashed to the revolving equator\'s inner rim.',
    'The pin time gauge has inner and outer sections; the inner section\'s three inner faces lash to the revolving equator\'s inner rim.',
  ],
  s0139: [
    'The upper face\'s end rests under the outer section, two square holes opened to receive the outer section\'s square feet; the lower face is fixed with a screw.',
    'The inner upper end supports the outer section below, with square holes for the outer feet; the lower face is screwed fast.',
  ],
  s0140: [
    'The outer section\'s upper, lower, and outer three faces are lashed to the constant celestial equator\'s outer rim.',
    'The outer section\'s three outer faces lash to the constant celestial equator\'s outer rim.',
  ],
  s0141: [
    'The upper face\'s end covers above the inner section; the lower face is fixed with a screw.',
    'The outer upper end caps the inner section; the lower face is screwed fast.',
  ],
  s0142: [
    'Parallel-line right-ascension gauge: at both ends of the straight pivot\'s south and north poles, copper plates are each set, like the character gong, square two inches eight fen, equal to the straight pivot\'s two faces\' divisions.',
    'On the straight pivot\'s north and south ends sit gong-shaped copper plates, 2.8 in square, matching the pivot\'s face divisions.',
  ],
  s0143: [
    'Both arms each lack one long rectangle, length one inch six fen, width seven fen, clasping the straight pivot\'s hollow center.',
    'Each arm has a 1.6 by 0.7 in rectangular notch clasping the pivot\'s hollow center.',
  ],
  s0144: [
    'At the center a round hole is opened, pierced by the celestial-axis shaft.',
    'A central round hole receives the celestial-axis shaft.',
  ],
  s0145: [
    'At the four corners, one inch nine fen from the center, upright posts are each set; round tops open holes to thread a straight line, parallel to the straight pivot\'s center diameter.',
    'At each corner 1.9 in from center stands a post with a holed round cap for a line parallel to the pivot\'s bore axis.',
  ],
  s0146: [
    'Below a small ring is set, for tying the right-ascension parallel line.',
    'A small ring below serves to tie the right-ascension parallel line.',
  ],
  s0147: [
    'Again by the reference star\'s mansion and degree, on the revolving equator a right-ascension parallel-line gauge is set; its make draws a semicircle above containing a half square; from the diagonal slant line, initial degree to the cross diameter is forty-five degrees; its vertical diameter aligns straight with the degree indicator\'s edge line.',
    'By the reference star\'s mansion and degree a right-ascension parallel-line gauge on the revolving equator bears a semicircle over a half square; from the diagonal, initial degree to cross diameter is forty-five degrees, its vertical diameter aligned with the degree indicator\'s edge.',
  ],
  s0148: [
    'At the semicircle\'s center two traveling indicators are set, each length two inches, one inch nine fen from the center.',
    'Two traveling indicators, each 2 in long, sit 1.9 in from the semicircle\'s center.',
  ],
  s0149: [
    'At the edge a small navel is left; a small round hole is opened in the middle, for threading a line.',
    'Each edge has a small navel with a central hole for a line.',
  ],
  s0150: [
    'The upper end is tied to the two rings at the north-pole copper plate\'s diagonal; the lower end passes through the two rings at the south-pole copper plate\'s diagonal; each is weighted with a plummet.',
    'The upper end ties to the north plate\'s diagonal rings; the lower passes the south plate\'s diagonal rings, each weighted with a plummet.',
  ],
  s0151: [
    'Method of use: to measure the sun\'s hour, push the four-motion ring east and west, raise and lower the sight-tube north and south, until sunlight through the hole is round and true; then view under the four-motion ring the time-degree indicator against the constant celestial equator\'s given hour — that is obtained.',
    'To read solar time, turn the four-motion ring east-west and tilt the sight-tube north-south until sunlight through the aperture is round and true; the time-degree indicator under the ring against the constant celestial equator gives the hour.',
  ],
  s0152: [
    'If the sun\'s shadow is blocked by the equator, then use the upright sight on the sight-tube to measure, making both sights\' holes align true; still read the hour on the time-degree indicator.',
    'If the equator blocks the sun\'s ray, use the sight-tube\'s upper upright sight with both holes aligned and still read the time-degree indicator.',
  ],
  s0153: [
    'Or if blocked by the dragon pillars, then use the parallel upright sight to measure; again read the hour on the time-degree indicator.',
    'If dragon pillars block the view, use the parallel upright sight and read the time-degree indicator.',
  ],
  s0154: [
    'If the time-degree indicator is blocked by the meridian circle, then change to the borrowed-arc time-degree indicator, next the parallel upright sight.',
    'If the meridian circle blocks the time-degree indicator, switch to the borrowed-arc indicator, then the parallel upright sight.',
  ],
  s0155: [
    'Measuring the sun\'s shadow, view the hour the borrowed-arc time-degree indicator indicates and add one hour — that is obtained.',
    'For a shadow reading, take the borrowed-arc indicator\'s hour and add one hour.',
  ],
  s0156: [
    'Measuring right ascension: take a known fixed star before or after noon, use its equatorial right ascension\'s opposition, and with the pin right-ascension gauge lash the four-motion ring to the revolving equator.',
    'To measure right ascension, take a known star near noon, set the pin right-ascension gauge at the opposition of its equatorial right ascension, and lash the four-motion ring to the revolving equator.',
  ],
  s0157: [
    'Again set any chosen hour; with the pin time gauge at that hour\'s opposition, lash the constant celestial equator.',
    'Choose an hour and lash the constant celestial equator with the pin time gauge at its opposition.',
  ],
  s0158: [
    'Then bring the four-motion ring with the revolving equator fixed, use the sight-tube to sight the reference star true, and rotate left with it.',
    'Lock the four-motion ring to the revolving equator, sight the reference star through the sight-tube, and rotate west with it.',
  ],
  s0159: [
    'Wait until the set hour; view the pin time gauge against the revolving equator\'s mansion and degree — that is the day\'s equatorial right ascension.',
    'At the set hour read the pin time gauge against the revolving equator\'s mansion and degree for the sun\'s equatorial right ascension.',
  ],
  s0160: [
    'Or take the present sun\'s equatorial right ascension, lash with the pin time gauge on the revolving equator, and again lash the constant celestial equator at the opposition of the set hour.',
    'Alternatively lash the revolving equator with the sun\'s current equatorial right ascension and the constant celestial equator at the set hour\'s opposition.',
  ],
  s0161: [
    'Wait until the set hour, use the four-motion sight to observe moon or star; then view the time-degree indicator\'s indicated mansion on the revolving equator, add half a circuit — that is the measured moon or star\'s equatorial right ascension.',
    'At the set hour sight moon or star through the four-motion tube; the time-degree indicator\'s mansion on the revolving equator plus half a circuit gives its equatorial right ascension.',
  ],
  s0162: [
    'Measuring the longitudinal separation of two luminaries: set the parallel-line right-ascension gauge on the revolving equator at the first mansion, first degree, and fix it; let one person use this parallel-line gauge, left two lines and right two lines together, to sight and fix the western luminary, rotating left with it;',
    'To measure separation between two bodies, fix the parallel-line right-ascension gauge at the revolving equator\'s first mansion, first degree; one observer sights the western body with left and right line pairs and rotates west with it;',
  ],
  s0163: [
    'one person uses the four-motion sight-tube to measure the eastern luminary; view the time-degree indicator\'s indicated degrees and minutes on the revolving equator — that is the measured two luminaries\' equatorial longitudinal separation.',
    'another sights the eastern body through the four-motion sight-tube; the time-degree indicator\'s degrees on the revolving equator give their equatorial longitudinal separation.',
  ],
  s0164: [
    'Measuring latitude: whenever right ascension is obtained, at once inspect the latitude indicator\'s indicated degrees and minutes on the four-motion ring — that is the measured equatorial latitude.',
    'For latitude, whenever right ascension is found, read the latitude indicator\'s degrees on the four-motion ring for equatorial latitude.',
  ],
  s0165: [
    'Where there is obstruction, all are changed as in the method for measuring the hour.',
    'Any obstruction is handled by the same substitutions used for hour measurement.',
  ],
  s0166: [
    'For stars near the north pole, then use the parallel borrowed-arc sight to measure them.',
    'Stars near the north pole are measured with the parallel borrowed-arc sight.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_027_b02.mjs <translation.json>'
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
