#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: ['"', '"'],
  s0102: [
    'In the Xian Kang era of Emperor Cheng of Jin, Yu Xi of Kuaiji, following the Overnight theory, composed the An Tian Lun, holding that "Heaven\'s height extends to the boundless and Earth\'s depth measures the immeasurable.',
    'During Jin Chengdi\'s Xian Kang reign, Yu Xi of Kuaiji, drawing on Overnight Heaven theory, wrote the An Tian Lun, arguing that Heaven stretches endlessly upward and Earth measures immeasurably downward.',
  ],
  s0103: [
    'Heaven firmly stands above with a form of constant rest; Earth\'s soul rests below with a body of settled dwelling—they should cover and enclose each other, square together if square, round together if round, with no meaning of square and round being different.',
    'Heaven stands firmly above in fixed form; Earth\'s essence rests below in settled body—they mutually cover and enclose, alike in shape whether square or round, with no asymmetry between them.',
  ],
  s0104: [
    'Their radiance is spread in array and each runs its own course, like the tides of rivers and seas and the going and hiding of the myriad things.',
    'Their lights are arrayed and each runs its own path, like ocean tides and the appearing and hiding of all creatures.',
  ],
  s0105: [
    '" Ge Hong, hearing this, mocked it, saying: "If the lodges do not cling to Heaven, Heaven is useless and one might as well say it does not exist.',
    'Ge Hong scoffed: "If the lodges do not attach to Heaven, Heaven is useless—one might as well deny it exists.',
  ],
  s0106: [
    'Why must one again say it exists yet does not move?"',
    'Why insist it exists yet never moves?"',
  ],
  s0107: [
    'From this discussion, Ge Hong may be called a master of discerning speech.',
    'On this point Ge Hong showed himself a master of critical judgment.',
  ],
  s0108: [
    'Xi\'s clansman, the Chancellor of Hejian, Song, also established the Qiong Tian Lun, saying: "Heaven\'s form is vaulted like a hen\'s-egg canopy; its edge circles and joins the outer rim of the four seas, floating upon primordial qi.',
    'Yu Xi\'s kinsman Song, Chancellor of Hejian, proposed the Qiong Tian Lun: "Heaven arches like an egg-shell canopy, its rim joining the outer edge of the four seas, floating on primordial qi.',
  ],
  s0109: [
    'It is like covering a casket to press down on water without submerging it—qi fills the interior, hence this.',
    'Like a lid pressed on water that does not sink—because qi fills the space within.',
  ],
  s0110: [
    'The sun circles the pole star, sets in the west and returns east, and does not pass in and out beneath Earth.',
    'The sun orbits the pole, sets west and returns east, never passing beneath Earth.',
  ],
  s0111: [
    'Heaven having a pole is like a canopy having a pivot.',
    'Heaven\'s pole is like the hub of a canopy.',
  ],
  s0112: [
    'Heaven slopes northward below Earth by thirty degrees; the pole\'s tilt north of Earth at mao and you is also thirty degrees.',
    'Heaven dips thirty degrees below Earth to the north; the pole tilts thirty degrees north of the mao-you line.',
  ],
  s0113: [
    'Man stands more than one hundred thousand li south of mao and you, so below the Dipper\'s pole is not Earth\'s center but faces the mao-you position between Heaven and Earth.',
    'Humanity stands over one hundred thousand li south of mao-you, so beneath the Dipper\'s pole is not Earth\'s center but the mao-you axis between Heaven and Earth.',
  ],
  s0114: [
    'The sun travels the Yellow Path circling the pole.',
    'The sun follows the Yellow Path around the pole.',
  ],
  s0115: [
    'The pole is one hundred fifteen degrees north of the Yellow Path and sixty-seven degrees south of it; the solstices mark where it lodges, determining long and short days.',
    'The pole stands one hundred fifteen degrees north of the Yellow Path and sixty-seven south; the solstices mark its lodging and fix day length.',
  ],
  s0116: [
    '" Wu Grand Steward Yao Xin composed the Xin Tian Lun, saying: "Man is the numinous creature whose form most resembles Heaven.',
    'Wu Grand Steward Yao Xin wrote the Xin Tian Lun: "Humanity is the numinous creature whose form most resembles Heaven.',
  ],
  s0117: [
    'Now man\'s chin projects forward over the chest, yet the nape cannot cover the back.',
    'The human chin juts forward over the chest, yet the neck cannot cover the back.',
  ],
  s0118: [
    'Taking what is near from the body, one thus knows Heaven\'s body slopes low entering Earth in the south and is relatively high in the north.',
    'From our own bodies we infer Heaven\'s form: low where it enters Earth in the south, higher in the north.',
  ],
  s0119: [
    'Also at the winter solstice the pole is lowest and Heaven\'s motion nears the south, so the sun is far from man and the Dipper near—northern Heaven\'s qi arrives, hence cold water.',
    'At the winter solstice the pole stands lowest and Heaven\'s motion nears the south; the sun recedes and the Dipper draws near—northern qi arrives and water turns cold.',
  ],
  s0120: [
    'At the summer solstice the pole rises highest and Heaven\'s motion nears the north; the Dipper recedes and the sun draws near—southern Heaven\'s qi arrives, hence steaming heat.',
    'At the summer solstice the pole rises and Heaven nears the north; the Dipper recedes and the sun draws near—southern qi arrives and heat steams upward.',
  ],
  s0121: [
    'When the pole is high, the sun travels shallowly through Earth\'s center, hence short nights;',
    'When the pole stands high, the sun\'s path through Earth\'s center is shallow, so nights are short;',
  ],
  s0122: [
    'Heaven is far from Earth, hence long days.',
    'Heaven stands far above Earth, so days are long.',
  ],
  s0123: [
    'When the pole is low, the sun travels deeply through Earth\'s center, hence long nights;',
    'When the pole is low, the sun\'s path through Earth\'s center runs deep, so nights are long;',
  ],
  s0124: [
    'Heaven is near below Earth, hence short days.',
    'Heaven sits lower above Earth, so days are short.',
  ],
  s0125: [
    '" From Yu Xi, Yu Song, and Yao Xin onward—all curious, eccentric theories, not the ultimate reckoning for discussing Heaven.',
    'Yu Xi, Yu Song, and Yao Xin all offered curious, eccentric theories—not the definitive reckoning of Heaven.',
  ],
  s0126: [
    'The old doctrine of earlier scholars holds that the bodies of Heaven and Earth are shaped like a bird\'s egg—Heaven wraps outside Earth as a shell enfolds the yolk, turning without end, its form perfectly round—hence Spherical Heaven.',
    'Earlier scholars taught that Heaven and Earth resemble a bird\'s egg—Heaven wraps Earth as a shell enfolds the yolk, revolving endlessly in perfect roundness—hence Spherical Heaven.',
  ],
  s0127: [
    'It also says: "Inside and outside Heaven is water; the two principles turn and move, each riding qi to float, bearing water as they go.',
    'It also holds: "Water lies inside and outside Heaven; the two principles rotate, each borne on qi, carrying water as they move.',
  ],
  s0128: [
    '" Wang Chong of Han, relying on Canopy Heaven theory to refute the armillary sphere, said: "The old doctrine says Heaven turns passing beneath Earth.',
    'Han\'s Wang Chong, using Canopy Heaven to refute the armillary sphere, argued: "Old doctrine says Heaven rotates beneath Earth.',
  ],
  s0129: [
    'Now dig one zhang and there is always water—how can Heaven pass through water?',
    'Dig one zhang down and water appears—how can Heaven travel through water?',
  ],
  s0130: [
    'This is quite wrong.',
    'This cannot be right.',
  ],
  s0131: [
    'The sun follows Heaven in turning—it does not enter Earth.',
    'The sun turns with Heaven—it does not plunge into Earth.',
  ],
  s0132: [
    'What the human eye sees extends no more than ten li—then Heaven and Earth meet.',
    'Human sight reaches only ten li—then Heaven and Earth seem to meet.',
  ],
  s0133: [
    'In fact they do not meet—distance makes it seem so.',
    'They do not truly meet; distance creates the illusion.',
  ],
  s0134: [
    'Now when we see the sun set, it does not enter—it is also distance.',
    'When we see the sun set, it does not enter Earth—it merely recedes.',
  ],
  s0135: [
    'When the sun enters the west, people below also take that for the center.',
    'When the sun sets in the west, observers there likewise call it the center.',
  ],
  s0136: [
    'People in the four directions each take what is near as rising and what is far as setting.',
    'Each quarter of the world takes the near as sunrise and the far as sunset.',
  ],
  s0137: [
    'How is this made clear?',
    'How may this be demonstrated?',
  ],
  s0138: [
    'Now suppose one person carries a great torch and walks at night on level ground—ten li from others, the firelight vanishes.',
    'Suppose a man carries a great torch across level ground at night—ten li away, its light disappears.',
  ],
  s0139: [
    'The fire is not extinguished—distance makes it seem so.',
    'The fire is not out; distance only makes it seem so.',
  ],
  s0140: [
    'Now when the sun turns west and is seen no more, it is of the same kind as fire going out.',
    'When the sun wheels west and vanishes, the principle is the same.',
  ],
  s0141: [
    'Sun and moon are not round—what makes them appear round in distant viewing is their distance from man.',
    'Sun and moon are not inherently round; distance makes them appear so.',
  ],
  s0142: [
    'The sun is the essence of fire;',
    'The sun is fire\'s essence;',
  ],
  s0143: [
    'the moon is the essence of water.',
    'the moon is water\'s essence.',
  ],
  s0144: [
    'Fire and water on Earth are not round—why should they be round in Heaven?',
    'Fire and water on Earth are not round—why round in Heaven?',
  ],
  s0145: [
    '" Ge Hong of Danyang explained:',
    'Ge Hong of Danyang replied:',
  ],
  s0146: [
    'The Commentary on the Armillary Sphere says: "Heaven is like a hen\'s egg, Earth like the yolk within, solitary inside Heaven—Heaven large and Earth small.',
    'The Armillary Sphere Commentary says: "Heaven is like an egg, Earth like the yolk within, alone inside Heaven—Heaven vast, Earth small.',
  ],
  s0147: [
    'Inside and outside Heaven is water; Heaven and Earth each stand on qi, bearing water as they move.',
    'Water surrounds Heaven within and without; Heaven and Earth ride qi, carrying water as they turn.',
  ],
  s0148: [
    'The circuit of Heaven is three hundred sixty-five and one-quarter degrees; halve this and half covers above Earth, half circles beneath—hence half the twenty-eight lodges are seen and half hidden.',
    'Heaven\'s circuit is three hundred sixty-five and a quarter degrees; halved, half covers Earth above and half runs beneath—so half the twenty-eight lodges appear and half hide.',
  ],
  s0149: [
    'Heaven turns like the motion of a chariot hub."',
    'Heaven rotates like a chariot hub."',
  ],
  s0150: [
    'Though many have theorized about Heaven, few are skilled in yin and yang.',
    'Many have theorized about Heaven, yet few master yin and yang.',
  ],
  s0151: [
    'Zhang Pingzi, Lu Gongji, and their kind all held that tracing the paths of the seven luminaries, using degrees to verify the calendar\'s signs of dusk and dawn, comparing with the four-eight qi, examining clepsydra divisions, reading the shadow\'s comings and goings, and seeking shape-verification in affairs—nothing is more precise than the spherical model.',
    'Zhang Heng, Lu Tongji, and others held that tracking the seven luminaries, calibrating dusk and dawn by degrees, comparing the four-eight qi, testing clepsydra marks, reading shadow motion, and verifying by observation—nothing matches the spherical model.',
  ],
  s0152: [
    'After Zhang Pingzi made the bronze armillary sphere in a sealed chamber, turned by flowing water, it accorded with Heaven like a tally.',
    'Zhang Heng\'s bronze armillary sphere, water-driven in a sealed chamber, matched Heaven like a tally.',
  ],
  s0153: [
    'Cui Ziyu composed its stele inscription: "Calculation exhausts Heaven and Earth, craftsmanship rivals creation.',
    'Cui Ziyu wrote its inscription: "Calculation exhausts Heaven and Earth; craftsmanship rivals creation itself.',
  ],
  s0154: [
    'Lofty talent and great art unite with the numinous in accord."',
    'Supreme talent and art accord with the divine."',
  ],
  s0155: [
    'This was because Pingzi\'s armillary sphere and seismoscope had verification.',
    'This praise rested on the verified performance of Heng\'s armillary sphere and seismoscope.',
  ],
  s0156: [
    'If Heaven is truly as the sphere holds, then Heaven\'s passing in and out, traveling in water, is necessarily so.',
    'If Heaven is truly spherical, its passage through water is necessarily so.',
  ],
  s0157: [
    'Thus the Yellow Emperor\'s Book says: "Heaven is outside Earth, water is outside Heaven.',
    'The Yellow Emperor\'s Book says: "Heaven lies outside Earth; water lies outside Heaven.',
  ],
  s0158: [
    'Water floats Heaven and bears Earth."',
    'Water floats Heaven and carries Earth."',
  ],
  s0159: [
    'The Changes also says: "Timely riding the six dragons."',
    'The Book of Changes says: "Timely riding the six dragons."',
  ],
  s0160: [
    'Yang lines are called dragons—dragons are creatures dwelling in water, used to image Heaven.',
    'Yang lines are called dragons; dragons dwell in water, imaging Heaven.',
  ],
  s0161: [
    'Heaven is a yang thing, and since it also passes in and out of water like a dragon, it is thus compared to a dragon.',
    'Heaven is yang, and passing through water like a dragon, it is likened to one.',
  ],
  s0162: [
    'The sage looked up and looked down and examined that it is so.',
    'The sage observed above and below and confirmed this.',
  ],
  s0163: [
    'Thus the Jin hexagram has Kun below and Li above, to verify the sun rising from Earth.',
    'The Jin hexagram—Kun below, Li above—shows the sun rising from Earth.',
  ],
  s0164: [
    'The Ming Yi hexagram has Li below and Kun above, to verify the sun entering Earth.',
    'The Ming Yi hexagram—Li below, Kun above—shows the sun entering Earth.',
  ],
  s0165: [
    'The Xu hexagram has Qian below and Kan above—this too is the image of Heaven entering water.',
    'The Xu hexagram—Qian below, Kan above—likewise images Heaven entering water.',
  ],
  s0166: [
    'Heaven is metal; metal and water are mutually generating things.',
    'Heaven is metal; metal and water mutually generate.',
  ],
  s0167: [
    'Heaven passing in and out of water—what harm should there be, that one calls it impossible?',
    'What harm if Heaven passes through water—why call it impossible?',
  ],
  s0168: [
    'Then Heaven\'s passing in and out of water need no longer be doubted.',
    'Heaven\'s passage through water need no longer be doubted.',
  ],
  s0169: [
    'Also, now when we watch stars rising in the east, at first they are only a little above Earth.',
    'Watch stars rise in the east: at first they stand barely above Earth.',
  ],
  s0170: [
    'Gradually they move west, first passing overhead, then turning down to set in the west—they do not wheel sideways.',
    'They drift west, pass overhead, then wheel down to set—never circling sideways.',
  ],
  s0171: [
    'Stars first in the west also sink slightly in setting—none turn northward.',
    'Stars in the west likewise sink gradually at setting—none wheel northward.',
  ],
  s0172: [
    'The sun\'s rising and setting is the same.',
    'The sun rises and sets the same way.',
  ],
  s0173: [
    'If one says Heaven turns like a millstone, the multitude of stars, sun, and moon should wheel with Heaven—first in the east, then passing south, then reaching west, then touching north, and returning east—they should not cross horizontally.',
    'If Heaven turned like a millstone, sun, moon, and stars would wheel with it—east, south, west, north, and back—not cut horizontally across the sky.',
  ],
  s0174: [
    'Now the sun rises in the east, gradually mounting; when it enters the west it also gradually sinks lower—it does not wheel northward along the edge at all.',
    'The sun rises east and mounts gradually; setting west it sinks gradually—never circling north along the rim.',
  ],
  s0175: [
    'So plainly is this—Master Wang must stubbornly say it is not so; he is far off the mark.',
    'The evidence is plain—Wang Chong\'s stubborn denial misses the mark.',
  ],
  s0176: [
    'Now the sun\'s diameter is a thousand li—within it there could fit dozens of lesser stars.',
    'The sun\'s diameter spans a thousand li—room enough for dozens of lesser stars.',
  ],
  s0177: [
    'If because the sun turns far its light alone cannot shine back on man, one should still see its body—it should not wholly vanish from its place.',
    'If distance alone hid the sun, its body should still be visible—it should not vanish entirely.',
  ],
  s0178: [
    'Sunlight is bright and its body larger than stars.',
    'Sunlight is brilliant and the sun larger than any star.',
  ],
  s0179: [
    'Now we see stars at the far north yet do not see the sun in the north—clearly it does not travel north.',
    'We see polar stars yet never the sun in the north—proof it does not travel north.',
  ],
  s0180: [
    'If because the sun turns far it can no longer be seen, between its comparison and setting it should appear slightly smaller.',
    'If distance hid the sun, it should shrink slightly between transit and setting.',
  ],
  s0181: [
    'Yet when the sun is just setting it instead grows larger—this is not a sign of turning far.',
    'Yet at setting the sun grows larger—not a sign of receding distance.',
  ],
  s0182: [
    'Master Wang uses the torch to image the sun—I too will borrow your spear to pierce your shield.',
    'Wang Chong\'s torch analogy invites the retort: your spear against your own shield.',
  ],
  s0183: [
    'The torch-bearer, the farther from man, the fainter the light—yet sun and moon from rising to setting do not gradually shrink.',
    'A torch-bearer\'s light fades with distance—yet sun and moon do not shrink from rise to set.',
  ],
  s0184: [
    'Master Wang\'s fire analogy is wrong.',
    'Wang Chong\'s fire analogy fails.',
  ],
  s0185: [
    'Also when the sun enters the west, viewed it gradually recedes; at first half remains like a mirror broken horizontally, and in a moment it is swallowed.',
    'At western setting the sun recedes gradually; half remains like a horizontally split mirror, then sinks in an instant.',
  ],
  s0186: [
    'If as Master Wang says the sun turns northward, at the moment of northern setting it should first appear like a vertically split mirror—not horizontally broken.',
    'If the sun wheeled north as Wang Chong claims, it would vanish like a vertically split mirror—not a horizontal one.',
  ],
  s0187: [
    'Spoken thus, the sun entering the north is also solitary and bereft.',
    'Thus the sun setting northward stands alone and implausible.',
  ],
  s0188: [
    'Also the moon\'s light is faint and far inferior to the sun.',
    'Moonlight is faint, far dimmer than sunlight.',
  ],
  s0189: [
    'When the moon is full, though heavy clouds cover it and the moon\'s body is not seen, the evening is still bright—moonlight still shines outward through the clouds.',
    'At full moon, heavy clouds may hide the disk yet evening stays bright—moonlight penetrates the clouds.',
  ],
  s0190: [
    'If the sun wheeled west and north, its light should be like the moon in clouds—it should not suddenly turn very dark at night.',
    'If the sun circled west and north, its light would diffuse like moonlight in clouds—not plunge the night into darkness.',
  ],
  s0191: [
    'Also when the sun sets, stars and moon come out.',
    'When the sun sets, stars and moon appear.',
  ],
  s0192: [
    'Clearly Heaven uses sun and moon to divide and govern day and night, alternating in illumination.',
    'Clearly Heaven assigns sun and moon to alternate in governing day and night.',
  ],
  s0193: [
    'If the sun constantly rose, it should not also set while stars and moon come out.',
    'If the sun always rose, it would not set while stars and moon emerge.',
  ],
  s0194: [
    'Also examining the texts of the River and Luo, all say fire and water are the surplus qi of yin and yang.',
    'River and Luo texts call fire and water surplus qi of yin and yang.',
  ],
  s0195: [
    'Speaking of surplus qi, they clearly cannot generate sun and moon—one should rather say the sun\'s essence generates fire.',
    'As surplus qi they cannot generate sun and moon—rather the sun\'s essence generates fire.',
  ],
  s0196: [
    'If fire and water were generated by sun and moon, how could they all be round like sun and moon?',
    'If sun and moon generated fire and water, why would both be round like sun and moon?',
  ],
  s0197: [
    'Now fire comes from the yang mirror—the yang mirror is round yet fire is not round.',
    'Fire from the yang mirror: the mirror is round, the flame is not.',
  ],
  s0198: [
    'Water comes from the square vessel—the square vessel is square yet water is not square.',
    'Water from the square vessel: the vessel is square, the water is not.',
  ],
  s0199: [
    'Also the yang mirror can take fire from the sun, yet there is no principle of taking the sun from fire—this makes clear the sun\'s essence generates fire.',
    'The yang mirror draws fire from the sun, not the sun from fire—proof the sun\'s essence begets fire.',
  ],
  s0200: [
    'The square vessel can take water from the moon—there is no way of taking the moon from water—this settles that the moon\'s essence generates water.',
    'The square vessel draws water from the moon, not the moon from water—proof the moon\'s essence begets water.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error('Usage: node translations/patches/suishu-019-batch2.mjs <translation.json>');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;

for (const s of data.sentences) {
  const pair = T[s.id];
  if (pair) {
    s.literal = pair[0];
    s.idiomatic = pair[1];
    patched++;
  }
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patch count: ${patched}`);

if (patched !== Object.keys(T).length) {
  process.exitCode = 1;
}
