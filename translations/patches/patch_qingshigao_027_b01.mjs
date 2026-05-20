#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'The Han created the armillary sphere, calling it the surviving form of the Armillary and Chronographic device; Tang and Song all copied it.',
    'Under the Han the armillary sphere was built, held to be the heir of the ancient armillary chronograph; Tang and Song followed the same design.',
  ],
  s0002: [
    'Only under the Yuan did instruments such as the simplification armillary, the altitude instrument, the sighting tablet, and the shadow marker appear, more detailed than antiquity.',
    'The Yuan added the simplified armillary, altitude instrument, sighting tablet, and shadow marker—finer in make than older models.',
  ],
  s0003: [
    'The Ming, within Beijing\'s Qihua Gate, built the Observatory Terrace against the city wall, copying Yuan models to make the armillary sphere, simplification armillary, and celestial globe, and set them on the terrace.',
    'In Ming Beijing, beside Qihua Gate, they raised the Observatory Terrace against the wall and placed Yuan-style armillary, simplified armillary, and celestial globe instruments upon it.',
  ],
  s0004: [
    'Below the terrace were the Gnomon Hall, gnomon and table, and clepsydra; the early Qing kept them as they were.',
    'Beneath the terrace stood the Gnomon Hall, a gnomon and table, and clepsydras, retained unchanged at the dynasty\'s founding.',
  ],
  s0005: [
    'In the eighth year of Kangxi, the Sacred Ancestor, following supervising official Ferdinand Verbiest\'s counsel, remade six instruments: the ecliptic theodolite, equatorial theodolite, horizontal azimuth instrument, horizontal altitude quadrant, limit-measuring quadrant, and celestial globe.',
    'In Kangxi 8 the Kangxi emperor, on Verbiest\'s advice, commissioned six new instruments: ecliptic theodolite, equatorial theodolite, azimuth theodolite, altitude quadrant, astronomical quadrant, and celestial globe.',
  ],
  s0006: [
    'In the fifty-second year, the horizontal azimuth and altitude instruments were again combined into one instrument.',
    'In Kangxi 52 the azimuth and altitude instruments were merged into a single combined instrument.',
  ],
  s0007: [
    'In the ninth year of Qianlong, the High Ancestor personally made the Armillary Sphere and Chronographic Instrument and also installed it on the terrace.',
    'In Qianlong 9 the Qianlong emperor built the Armillary Sphere and Chronographic Instrument and set it on the Observatory Terrace.',
  ],
  s0008: [
    'Now each instrument\'s form and use are fully set down in this chapter.',
    'What follows records the design and operation of every instrument in full.',
  ],
  s0009: [
    'The ecliptic theodolite has four rings, each divided into four quadrants, each quadrant ninety degrees.',
    'The ecliptic theodolite comprises four rings, each quartered into ninety-degree quadrants.',
  ],
  s0010: [
    'The outer great ring, fixed and immovable, is called the primary meridian ring; outer diameter six chi, ring face one cun three fen thick, side two cun five fen wide; the ring\'s lower half is clasped into the cloud pedestal.',
    'Outermost is the fixed primary meridian ring, six chi across, one cun three fen thick on the face and two cun five fen on the edge; its lower half seats in the cloud pedestal.',
  ],
  s0011: [
    'The half ring borne above, front and rear running true north-south, rises straight to the celestial pole and cuts the horizon at center.',
    'The upper semicircle aligns with the meridian, reaches the zenith, and meets the horizon at midpoint.',
  ],
  s0012: [
    'From above and below the horizon, according to the capital\'s north and south polar entrance and exit in degrees and minutes, the equatorial poles are fixed.',
    'From the horizon upward and downward, using Beijing\'s polar altitude and depression, the equatorial poles are set.',
  ],
  s0013: [
    'Next inward is the polar-transit circle; at each point where the circumference is equally divided, steel pivots pass through the equatorial poles.',
    'Inside that lies the polar-transit circle, pierced at equal intervals by steel pivots through the equatorial poles.',
  ],
  s0014: [
    'Again, by the great distance between ecliptic and equator, the ecliptic\'s north and south poles are fixed on the polar-transit circle.',
    'The ecliptic poles are then marked on that circle according to the obliquity of the ecliptic.',
  ],
  s0015: [
    'Ninety degrees from the ecliptic pole the ecliptic ring is set; it crosses the polar-transit circle at right angles, each notched so they interlock, making the two rings one body that rotate together.',
    'The ecliptic ring, ninety degrees from the ecliptic pole, intersects the polar-transit circle at right angles in interlocking mortises so both rings move as one.',
  ],
  s0016: [
    'On the two sides of the ecliptic ring, one bears the twelve mansions, the other the twenty-four solar terms.',
    'One face of the ecliptic ring carries the twelve zodiac mansions; the other carries the twenty-four solar terms.',
  ],
  s0017: [
    'Its two intersections—one at winter solstice, one at summer solstice.',
    'The ring\'s two nodes mark winter solstice and summer solstice.',
  ],
  s0018: [
    'Next inward is the ecliptic meridian circle, which a steel pivot passes through at the ecliptic pole.',
    'Within sits the ecliptic meridian circle, pivoted on steel at the ecliptic pole.',
  ],
  s0019: [
    'The circle\'s diameter forms a round axle, circumference three cun.',
    'Its diameter is a cylindrical axle three cun around.',
  ],
  s0020: [
    'At the axle\'s center stands a round column as the latitude index, at right angles to the meridian circle\'s side; on the ecliptic ring and meridian circle each a sliding sight is set, and atop the instrument a copper wire serves as plumb line.',
    'A latitude pillar rises from the axle center perpendicular to the meridian ring; sliding sights mount on ecliptic and meridian rings, with a copper plumb line at the summit.',
  ],
  s0021: [
    'The whole instrument is borne by twin dragons; a crossed beam again stands the dragons\' feet.',
    'Twin dragons support the whole; a cross-beam bears their feet.',
  ],
  s0022: [
    'At the beam\'s four ends lions bear it up, and screw pillars are still set to level it.',
    'Lions support each end of the beam, with leveling screws beneath.',
  ],
  s0023: [
    'If the plumb line leans aside, turn the screw pillars; when the plumb line is true, the instrument is true.',
    'Any tilt of the plumb line is corrected by the screws until the line hangs true and the instrument is aligned.',
  ],
  s0024: [
    'In use, to seek a star\'s ecliptic longitude and latitude, one person on the ecliptic ring looks up a star\'s previously obtained longitude and latitude in degrees and minutes, sets a sliding sight thereon, and through the north-south axle\'s central pillar aligns sight to star to fix the instrument;',
    'To measure a star\'s ecliptic coordinates, one operator sets a sight on the ecliptic ring to the star\'s catalogued longitude and latitude, sights through the central pillar along the polar axis, and fixes the instrument on the star;',
  ],
  s0025: [
    'another person uses a sliding sight on the meridian circle over the pillar, sighting the star under measurement, sliding and setting it in place; then the sliding sight\'s indicator line on the meridian circle fixes the star\'s latitude.',
    'a second slides a sight along the meridian ring over the pillar until it lines on the target; the meridian sight then reads the star\'s latitude.',
  ],
  s0026: [
    'With the instrument fixed, read on the ecliptic ring the degrees and minutes between the two sights—that is the star\'s longitude difference.',
    'Once fixed, the arc between the two ecliptic sights gives the star\'s longitudinal separation.',
  ],
  s0027: [
    'Or when measuring sun or moon, using a reference star for comparison, it is likewise.',
    'Sun and moon may be measured the same way against a reference star.',
  ],
  s0028: [
    'The equatorial theodolite has three rings; the outer great ring is the primary meridian ring.',
    'The equatorial theodolite has three rings; the outermost is again the primary meridian ring.',
  ],
  s0029: [
    'A single dragon facing south bears it.',
    'One dragon, facing south, supports it.',
  ],
  s0030: [
    'The ring\'s graduations and pole settings are all the same as on the ecliptic instrument.',
    'Its graduations and polar settings match the ecliptic theodolite.',
  ],
  s0031: [
    'Ninety degrees from the pole the equatorial ring is set; it crosses the meridian ring at right angles and remains fixed.',
    'The equatorial ring, ninety degrees from the pole, crosses the meridian ring at right angles and does not move.',
  ],
  s0032: [
    'On the inner ring face and upper side face are engraved the twenty-four hours, each hour in four quarters.',
    'The inner face and upper edge bear twenty-four hours, each divided into four quarters.',
  ],
  s0033: [
    'The outer ring face is divided into three hundred sixty degrees; within, the equatorial meridian circle is set.',
    'The outer face carries three hundred sixty degrees; inside sits the equatorial meridian circle.',
  ],
  s0034: [
    'With north and south poles as pivots it can rotate east and west, tangent to the equatorial ring\'s inner face.',
    'Pivoted at the poles, it swings east and west against the equatorial ring\'s inner surface.',
  ],
  s0035: [
    'The meridian circle\'s diameter is a round axle; a round column stands at the axle center, and sliding sights, plumb line, crossed beam, screw pillars, and the rest follow the ecliptic instrument\'s method.',
    'Its meridian ring forms a cylindrical axle with a central pillar; sliding sights, plumb line, cross-beam, and leveling screws follow the ecliptic instrument.',
  ],
  s0036: [
    'In use, to measure the sun\'s hour, use the hour sliding sight on the equatorial ring—that is the light aperture—opposite the north-south axle sight; what the inner sliding sight on the equatorial ring points to is the hour, minute, and second.',
    'To tell time by the sun, align the hour sight—a light aperture—on the equatorial ring with the polar sight; the inner sight\'s reading gives hour, minute, and second.',
  ],
  s0037: [
    'For the longitude of the luminaries, use two light apertures—that is, two diameter sights—on the equatorial ring, one fixed and one movable.',
    'For planetary or stellar longitude, two light apertures (diameter sights) are used on the equatorial ring, one fixed and one sliding.',
  ],
  s0038: [
    'One person peers through the fixed aperture at the north-south axle sight and cross-measures against a star already obtained;',
    'One observer sights through the fixed aperture along the polar axis against a reference star;',
  ],
  s0039: [
    'another slides the movable aperture into alignment, peering at this axle sight and the object measured in one line; the degrees and minutes on the equatorial ring between the two apertures are the difference of the two longitudes.',
    'the other shifts the sliding aperture until polar sight and target align; the equatorial arc between the two apertures is the longitudinal difference.',
  ],
  s0040: [
    'Latitude likewise is obtained by shifting the light aperture on the meridian circle into place.',
    'Latitude is read by sliding the light aperture along the meridian ring into alignment.',
  ],
  s0041: [
    'One must make eye, sight, and object measured lie in one line; the degrees and minutes on the meridian circle beneath this aperture, south or north of the equator, are the degrees and minutes of distance north or south of the equator for what is measured.',
    'Eye, sight, and body observed must share one line; the meridian reading below the aperture, north or south of the equator, gives the object\'s declination.',
  ],
  s0042: [
    'The horizontal azimuth instrument has only one horizon ring, full diameter six chi; its plane two cun five fen wide, one cun two fen thick.',
    'The azimuth theodolite consists of a single horizon ring six chi in diameter, two cun five fen wide and one cun two fen thick.',
  ],
  s0043: [
    'It is divided into four quadrants, each ninety degrees.',
    'The ring is quartered, ninety degrees per quadrant.',
  ],
  s0044: [
    'Four dragons stand on the crossed beam to bear it.',
    'Four dragons on a cross-beam support it.',
  ],
  s0045: [
    'At the beam\'s four ends leveling screw pillars are applied.',
    'Leveling screws sit at each end of the beam.',
  ],
  s0046: [
    'At the beam\'s crossing a pillar is set, as high as the horizon ring, exactly at the horizon ring\'s center.',
    'Where the beams cross, a pillar rises to the ring\'s height at its center.',
  ],
  s0047: [
    'Again on the horizon ring east and west a pillar is set on each side, about four chi high; each pillar has a dragon coiling upward; from each pillar top a claw extends, together holding a round pearl.',
    'East and west on the ring stand pillars about four chi tall, each with a coiling dragon whose claws meet to clasp a pearl.',
  ],
  s0048: [
    'Below is a standing axle, flat and square in form, hollow within like window lattices, to hold a straight line.',
    'A vertical axle, square and hollow like a window frame, holds the sighting wire.',
  ],
  s0049: [
    'The axle\'s upper end enters the pearl, the lower enters the pillar\'s center, so it can rotate.',
    'Its top fits the pearl, its foot the pillar center, allowing rotation.',
  ],
  s0050: [
    'The line within the axle is always the plumb line to the celestial pole.',
    'The wire within remains the zenith plumb line.',
  ],
  s0051: [
    'Again a long rectangular cross-arm is made, as long as the horizon ring\'s full diameter, one cun thick, one cun five fen wide; at center a square hole sleeves the standing axle\'s lower end so it rotates with the standing axle.',
    'A rectangular cross-arm as long as the ring\'s diameter, one cun thick and one cun five fen wide, sleeves the pillar axle at center and turns with it.',
  ],
  s0052: [
    'Its two ends are sharpened to point to the horizon ring\'s degrees and minutes.',
    'Both ends are tapered to indicate degrees on the horizon ring.',
  ],
  s0053: [
    'From each end again a line runs up to meet the top of the straight line in the standing axle, forming two triangles.',
    'Lines from each end meet the summit of the central wire, forming two triangles.',
  ],
  s0054: [
    'For whatever is measured, rotate the sliding sight so the three lines and the object measured lie in mutual alignment; then what the arm\'s end points to is the object\'s horizontal azimuth.',
    'For any observation the sliding sight is turned until three lines align on the target; the cross-arm\'s reading is the azimuth.',
  ],
  s0055: [
    'The horizontal altitude instrument is the quadrant instrument—it takes one quarter of the full circle to measure height.',
    'The altitude quadrant is literally a quarter-circle used to measure elevation.',
  ],
  s0056: [
    'Its arc is ninety degrees; its two sides are each a semicircle radius, six chi long.',
    'The arc spans ninety degrees; each radial side is six chi, half the full radius.',
  ],
  s0057: [
    'Where the two radii meet is the instrument\'s center.',
    'Their intersection is the instrument center.',
  ],
  s0058: [
    'The instrument frame has east and west pillars; each is arched by two dragons.',
    'East and west pillars frame it, each pair of dragons forming an arch.',
  ],
  s0059: [
    'Above, a crossbeam; again a central pillar is tubed on the crossbeam so the instrument center can turn—the center pointing to the instrument\'s two sides, one parallel to the central pillar, one parallel to the crossbeam.',
    'A crossbeam above carries a central pillar socketed so the center pivots, one radius parallel to the pillar, one to the beam.',
  ],
  s0060: [
    'Again at the instrument center a short round column serves as index; a sighting arm is added, as long as the radius; its upper end is set at the instrument center, its lower end sharpened to point to degrees on the arc face, and a sight ear is further set.',
    'At the center a short pillar forms the index; a sighting arm equal to the radius pivots there, its tip reading the arc, with a sighting slit.',
  ],
  s0061: [
    'For whatever is measured, slide the sighting arm up and down, peering through the sight ear\'s slit at the round column, making it align with what is measured.',
    'To observe, the arm is slid until the slit sights the pillar in line with the object.',
  ],
  s0062: [
    'The degrees and minutes the arm\'s end points to are the object\'s horizontal latitude.',
    'The arc at the arm\'s tip gives the altitude.',
  ],
  s0063: [
    'The limit-measuring quadrant: the arc face is one sixth of the full circle, divided into sixty degrees.',
    'The astronomical quadrant\'s arc is one sixth of a circle, graduated to sixty degrees.',
  ],
  s0064: [
    'One arc, one radius; the radius six chi long—that is the full circle\'s radius.',
    'One arc and one radius—the radius six chi, the full circle\'s radius.',
  ],
  s0065: [
    'The arc is two cun five fen wide; left and right of the radius fine cloud patterns twine and link to secure it.',
    'The arc is two cun five fen wide; cloud-scroll filigree flanks the radius to stiffen the frame.',
  ],
  s0066: [
    'At the radius\'s upper end is a small cross-arm, at right angles to the radius.',
    'A short transom crosses the radius at its head.',
  ],
  s0067: [
    'At the instrument center and both ends of the cross-arm round columns serve as indices; a sliding sight is set on the arc face.',
    'Round index pillars stand at center and transom ends; a sliding sight rides the arc.',
  ],
  s0068: [
    'The platform bearing the instrument is about four chi high; a pillar is planted at center to tie the instrument\'s center of gravity, so it can rotate left and right, high or low, slanting or sidelong—nothing is impossible—hence it is also called the Hundred-Motion Instrument.',
    'A stand about four chi tall centers a pillar at the instrument\'s balance point so it may swing in every attitude—hence its alias, the Hundred-Motion Instrument.',
  ],
  s0069: [
    'In use, measuring two luminaries, regardless of ecliptic or equatorial longitude and latitude, to seek the degrees of great-circle separation, one person peers from the cross-arm end\'s ear index at the center pillar index, fixing this luminary;',
    'To measure angular distance between two bodies regardless of coordinate system, one sights from the transom slit through the center index onto the first body;',
  ],
  s0070: [
    'another peers from the sliding ear index toward the center pillar index at that luminary in mutual alignment; the degrees and minutes from the cross-arm end to beneath the sliding ear index are the two luminaries\' separating degrees and minutes.',
    'the second sights from the sliding slit through the center index onto the second; the arc from transom to sliding sight is their separation.',
  ],
  s0071: [
    'The celestial globe: the instrument is a round sphere, diameter six chi, vividly a vaulted image—hence the name celestial body.',
    'The celestial globe is a sphere six chi across, shaped like the dome of heaven.',
  ],
  s0072: [
    'A steel axle passes through its center, both ends exposed, attached to the meridian ring\'s north and south poles, so it can be turned.',
    'A steel polar axis pierces it and joins the meridian ring\'s poles so the sphere may revolve.',
  ],
  s0073: [
    'The pedestal is four chi seven cun high.',
    'The stand rises four chi seven cun.',
  ],
  s0074: [
    'Above the pedestal is a horizon ring, eight cun wide.',
    'On the stand sits a horizon ring eight cun wide.',
  ],
  s0075: [
    'At the meridian positions on each side are gaps for the meridian ring to enter.',
    'Notches at north and south admit the meridian ring.',
  ],
  s0076: [
    'The gap\'s measure equals the meridian ring\'s width and thickness; then the two rings cross at right angles, the inner ring face exactly level, and left, right, above, and below embrace the instrument.',
    'The notches match the meridian ring\'s section so the rings cross squarely, the inner face flush, cradling the globe on all sides.',
  ],
  s0077: [
    'All around is left a clearance of five fen so the high-arc sliding sight can advance and retreat.',
    'A five-fen gap all around lets the altitude sight travel freely.',
  ],
  s0078: [
    'Again a hour dial is set outside the meridian ring, diameter two chi, divided into twenty-four hours.',
    'Outside the meridian ring a two-chi hour dial shows twenty-four hours.',
  ],
  s0079: [
    'With the north pole as center, the hand indicating the hour is also fixed at the north pole, able to shift with the celestial globe and also rotate on its own.',
    'An hour pointer pivoted at the north pole moves with the globe and may also spin independently.',
  ],
  s0080: [
    'Below the pedestal gearing is again set to turn the meridian ring, making the north pole rise and set with each region\'s emergence from earth; the limits of each region\'s celestial phenomena hidden and visible can all be studied.',
    'Gears beneath drive the meridian ring so the pole lifts and sinks for any latitude, revealing what stars each region may see.',
  ],
  s0081: [
    'The combined horizontal azimuth-altitude instrument: at the azimuth instrument\'s center pillar the altitude instrument is set.',
    'The combined instrument mounts the altitude quadrant on the azimuth instrument\'s central pillar.',
  ],
  s0082: [
    'In use, rotate the altitude instrument, align the sliding sight on what is measured, and obtain latitude on the altitude instrument;',
    'In use one swings the altitude quadrant, sights the target, and reads latitude from it;',
  ],
  s0083: [
    'view where the altitude instrument\'s edge cuts the azimuth instrument—that gives longitude: one measurement yields both.',
    'where its edge meets the azimuth ring gives longitude—both coordinates in one observation.',
  ],
  s0084: [
    'The Armillary Sphere and Chronographic Instrument: the instrument has three tiers; the outermost is the ancient six-combination armillary, but without the horizon ring; upright twin rings form the meridian circle.',
    'The Armillary Sphere and Chronographic Instrument has three nested frames; the outer recreates the ancient six-ring armillary without a horizon ring, its upright double ring serving as meridian.',
  ],
  s0085: [
    'Both faces are engraved with the circuit of heaven\'s three hundred sixty degrees; from north and south poles, first degree to midpoint ninety degrees—that is celestial longitude.',
    'Both faces bear three hundred sixty degrees of celestial longitude, ninety degrees from each pole to the equator crossing.',
  ],
  s0086: [
    'A single ring leans obliquely as the fixed ecliptic equator circle; both faces are engraved with the circuit of the sun\'s twelve hours; zi and wu noon rightly occupy the meridian double ring\'s hollow half, knotting at its midpoint—that is celestial latitude.',
    'An oblique single ring is the fixed equator, engraved with twelve double-hours; noon and midnight sit in the meridian gap at its center—that is celestial latitude.',
  ],
  s0087: [
    'At both north and south poles round axles are set; the axle roots are solid within the meridian double ring\'s hollow, while inward the axle pierces the inner two tiers\' rings.',
    'Polar axles seat in the meridian ring and turn inward to carry the inner rings.',
  ],
  s0088: [
    'Below it is borne on a cloud pedestal; the upturned face\'s center has twin grooves to receive the double ring; the east face\'s center has a cloud recess to receive the plumb line.',
    'A cloud pedestal supports it with twin slots for the meridian ring and an eastern cloud niche for the plumb line.',
  ],
  s0089: [
    'Below, a cross of four legs is set, with screws to level.',
    'A four-footed cross below carries leveling screws.',
  ],
  s0090: [
    'At the frame\'s east and west ends dragon pillars are planted; dragon mouths hold pearls, holes opened to bear the fixed equator\'s mao-you east-west axles; according to the Observatory Terrace\'s fixed north-south true line the frame is secured—then the plane\'s four directions are true.',
    'Dragon pillars east and west grip pearls pierced to hold the equator\'s east-west axis; aligned to the terrace\'s meridian, the base squares to the four directions.',
  ],
  s0091: [
    'Again according to the capital\'s north polar altitude in degrees and minutes, count upward to complete one quadrant—that is the celestial pole.',
    'Counting up from Beijing\'s polar altitude through one quadrant marks the zenith.',
  ],
  s0092: [
    'According to the south pole\'s depression in degrees and minutes, count downward to complete one quadrant—that is the earth\'s center.',
    'Counting down from the south polar depression through one quadrant marks the nadir.',
  ],
  s0093: [
    'At the celestial pole set a small nail to suspend the plumb line; the plumb rightly reaches the earth\'s center and also rightly cuts the double ring\'s face.',
    'A nail at the zenith suspends the plumb line to the nadir, grazing the meridian ring\'s plane.',
  ],
  s0094: [
    'At the line\'s end hangs a ball, again rightly fitting the cloud recess, neither touching nor leaving—then above and below are true, the plane\'s four directions also true, and the horizon is already within it.',
    'A sphere at the line\'s foot nests in the cloud niche without binding; then vertical, horizontal, and horizon are all true.',
  ],
  s0095: [
    'Next within is the ancient three-luminaries armillary, but without the ecliptic ring.',
    'Inside that lies the ancient three-luminaries armillary, omitting the ecliptic ring.',
  ],
  s0096: [
    'The double ring piercing the two poles is the equatorial-pole meridian circle.',
    'The polar double ring is the equatorial meridian circle.',
  ],
  s0097: [
    'At both poles axle holes are set to receive the celestial-longitude axle; both faces are engraved with the circuit of heaven\'s three hundred sixty degrees.',
    'Polar sockets take the longitude axle; both faces repeat the three hundred sixty-degree circuit.',
  ],
  s0098: [
    'Knotting at the equatorial-pole circle\'s midpoint, parallel with the fixed equator and moving with it, is the revolving equator circle; both faces are engraved with the circuit of heaven\'s three hundred sixty degrees, turning in accord with the primum mobile\'s equator.',
    'At its center a revolving equator, parallel to the fixed ring and engraved with three hundred sixty degrees, tracks the primum mobile\'s equator.',
  ],
  s0099: [
    'From the meridian circle\'s south pole, two quadrant arcs are made to bear it so it does not tilt or list.',
    'Quadrant arcs from the southern meridian support it against tilt.',
  ],
  s0100: [
    'Next innermost is the ancient four-motion armillary; the double ring piercing the two poles is the four-motion circle, both faces engraved with three hundred sixty degrees.',
    'Innermost is the four-motion armillary: a polar double ring, the four-motion circle, engraved with three hundred sixty degrees on both faces.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_027_b01.mjs <translation.json>'
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
