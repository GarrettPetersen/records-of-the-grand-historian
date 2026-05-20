#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'As for modeling the Purple Palace to stand at the center, taking the Bright Hall as a pattern for dispensing government, assigning states according to territorial divisions, and taking the multitude of stars as the model for offices—acting always in accord with the seasons and teaching without violating the nature of things—thus one can accomplish the Way of transformation and harmonize with the subtlety of yin and yang.',
    'Heaven\'s order mirrors earthly rule: the Purple Palace stands at the center as the emperor\'s seat, the Bright Hall models the distribution of government, territorial divisions assign each state its place, and the stars map the hierarchy of offices. When action follows the seasons and instruction respects the nature of things, the Way of transformation is fulfilled and yin and yang work in harmony.',
  ],
  s0002: [
    'Already in the time of Fuxi, looking up and looking down, it was said that the seven luminaries of Heaven and the twenty-eight asterisms circle the degrees of the vaulted dome to adorn the twelve positions.',
    'As early as Fuxi, through observation above and inquiry below, it was held that Heaven\'s seven luminaries and twenty-eight asterisms traverse the arc of the celestial vault to mark the twelve terrestrial positions.',
  ],
  s0003: [
    'In Heaven forms take shape, revealing fortune and misfortune.',
    'Heaven forms images that portend good and ill.',
  ],
  s0004: [
    'When the five planets entered the Chamber, they opened the first traces of the Zhou kings; when a long comet bristled at the Dipper, it mirrored the Song people\'s first rebellion—Heaven\'s intent and human affairs respond like shadow to form.',
    'The five planets entering the Chamber heralded the Zhou dynasty\'s rise; a long-tailed comet at the Dipper foreshadowed the Song\'s first revolt. Heaven\'s will and human affairs mirror each other as closely as shadow and substance.',
  ],
  s0005: [
    'From King Yi descending the hall to receive the feudal lords, to King Nan ascending the tower to evade blame, the Record says: "The Son of Heaven grows weak, the feudal lords grow arrogant.',
    'From King Yi of Zhou descending the hall to meet the feudal lords, to King Nan mounting the tower to shirk responsibility, the Record says: "The Son of Heaven wanes and the feudal lords usurp their prerogatives.',
  ],
  s0006: [
    '" Then armies swallowed one another and corpses littered the wilds.',
    'Armies then devoured one another, and the dead lay strewn across the fields.',
  ],
  s0007: [
    'The House of Qin, relying on the residue of the Warring States, trusted in this brutal violence; lesser stars crossed in battle, and a long comet stretched across the sky.',
    'The Qin, inheritors of the Warring States\' violence, leaned on brutal force; lesser stars clashed in the heavens and a long comet swept the sky.',
  ],
  s0008: [
    'Emperor Gaozu of Han drove forth heroes and cleared away calamity; the five bright planets followed Jupiter, a sevenfold halo ringed the Net, the Pivot held fast at the center—Heaven\'s Way does not move in vain.',
    'Han Gaozu rallied heroes and swept away disaster; the five planets marched with Jupiter, a sevenfold halo encircled the Net, and the celestial Pivot held its place—the Way of Heaven does not act without purpose.',
  ],
  s0009: [
    'From the founding of the Western Capital, many years passed.',
    'Since the Western Capital was established, many years elapsed.',
  ],
  s0010: [
    'When the Founding Emperor restored the dynasty, he took the reins at the right moment; the Metal phase and Water virtue received the numinous mandate—dark omens shone clear, and Heaven and man were not far apart.',
    'When Emperor Guangwu restored the Han, he seized the moment to rule; Metal and Water received the sacred mandate, dark portents appeared plainly, and Heaven and humanity stood in close accord.',
  ],
  s0011: [
    'Formerly at the Glory of the River a chart was presented, at the Warmth of the Luo a diagram appeared, the six lines unfolded their pattern, and the three luminaries were fully arrayed—then the book of star officials began with the Yellow Emperor.',
    'When the chart was offered at the Glory of the River and the diagram at the Warmth of the Luo, the six lines revealed their pattern and sun, moon, and stars stood complete—the annals of star officials thus begin with the Yellow Emperor.',
  ],
  s0012: [
    'Gaoyang Shi made the Southern Regulator Chong oversee Heaven and the Northern Regulator Li oversee Earth; Emperor Yao then commanded Xi and He to reverently conform to the vast Heaven.',
    'Emperor Zhuanxu appointed the Southern Regulator Chong to govern Heaven and the Northern Regulator Li to govern Earth; Emperor Yao then charged Xi and He to reverently align themselves with the great Heaven.',
  ],
  s0013: [
    'Xia had Kunwu, Yin had Wu Xian, Zhou had the historiographer Yi, Song had Zi Wei, Lu had Zi Shen, Zheng had Pi Zao, Wei had the Shi clan, and Qi had Duke Gan—all were able to speak of astronomy and discern subtle changes.',
    'The Xia had Kunwu, the Yin had Wu Xian, the Zhou historiographer Yi, Song\'s Zi Wei, Lu\'s Zi Shen, Zheng\'s Pi Zao, Wei\'s Shi clan, and Qi\'s Duke Gan—all masters of astronomy who could read subtle celestial changes.',
  ],
  s0014: [
    'Those who transmitted Heaven\'s numbers in Han included Tang Du, Li Xun, and their kind.',
    'Among Han transmitters of celestial reckoning were Tang Du, Li Xun, and others of their company.',
  ],
  s0015: [
    'In the time of Emperor Guangwu there were Su Bo Kuang and Lang Ya Guang, both able to compare and coordinate astronomical matters, expound the good Way, benefit their age, and set a standard for later generations.',
    'Under Guangwu, Su Bo Kuang and Lang Ya Guang could cross-check astronomical data, advance the proper doctrine, serve their own age, and leave a model for posterity.',
  ],
  s0016: [
    'Yet though the charts and weft-texts of the River and Luo had the names of star diviners and star officials, they could not list them all completely.',
    'Even the River and Luo charts and apocryphal texts named star diviners and star officials, yet could not enumerate them fully.',
  ],
  s0017: [
    'Later, in the Eastern Han, Zhang Heng served as Grand Astrologer, cast the armillary sphere, and arranged the fixed stars in order, calling it the Ling Xian.',
    'In the Later Han, Zhang Heng as Grand Astrologer cast an armillary sphere, catalogued the fixed stars, and titled the work Ling Xian.',
  ],
  s0018: [
    'Its general outline says: "Stars—their bodies arise from Earth, their essence issues in Heaven.',
    'Its summary runs: "Stars have bodies born from Earth and essence radiating in Heaven.',
  ],
  s0019: [
    'The Purple Palace is the dwelling of the emperor, the Supreme Palace the seat of the Five Emperors; in the wilds they image things, at court they image offices.',
    'The Purple Palace is the emperor\'s residence, the Supreme Palace the seat of the Five Emperors; beyond the court they mirror things, within the court they mirror offices.',
  ],
  s0020: [
    'Occupying the center among them is what is called the Northern Dipper; its movements are tied to divination and it truly governs the royal mandate.',
    'At their center stands the Northern Dipper; its motion governs divination and truly holds the royal mandate in charge.',
  ],
  s0021: [
    'Spread in four directions are the twenty-eight asterisms; sun and moon travel their courses and mark out blessing and calamity.',
    'The twenty-eight asterisms spread across the four quarters; as sun and moon run their paths they reveal fortune and disaster.',
  ],
  s0022: [
    'The five planets pass in sequence, making misfortune and blessing manifest—then the heart of High Heaven is seen.',
    'The five planets move in their ordained sequence, displaying calamity and blessing—and thus the mind of Heaven is revealed.',
  ],
  s0023: [
    'Of the inner and outer officials, those constantly bright number one hundred and twenty; those that can be named, three hundred and twenty; as stars, two thousand five hundred;',
    'Among the inner and outer star-offices, one hundred and twenty shine constantly, three hundred and twenty bear names, and as individual stars they number two thousand five hundred;',
  ],
  s0024: [
    'faint stars number slightly more than eleven thousand five hundred and twenty—all moving creatures receive their allotted fates thereby.',
    'faint stars slightly exceed eleven thousand five hundred and twenty—in this way every living thing has its fate bound.',
  ],
  s0025: [
    '" But the chart Heng cast was lost in the turmoil, and the names and numbers of the star officials are not preserved today.',
    'Yet the chart Heng cast was buried in the chaos of war, and the names and counts of the star officials no longer survive.',
  ],
  s0026: [
    'In the Three Kingdoms period, Chen Zhuo, Grand Astrologer of Wu, first arranged the star officials of the Gan, Shi, and Wu Xian traditions and recorded them in charts and registers.',
    'During the Three Kingdoms, Wu\'s Grand Astrologer Chen Zhuo first compiled the star officials of the Gan, Shi, and Wu Xian schools into charts and catalogues.',
  ],
  s0027: [
    'He also appended divinatory commentary, totaling two hundred fifty-four offices, one thousand two hundred eighty-three stars, together with the twenty-eight lodges and attendant offices with one hundred eighty-two seated stars—in all two hundred eighty-three offices and one thousand five hundred sixty-five stars.',
    'Adding divinatory notes, he recorded two hundred fifty-four offices and one thousand two hundred eighty-three stars, plus the twenty-eight lodges and their attendant seats with one hundred eighty-two stars—two hundred eighty-three offices and one thousand five hundred sixty-five stars in all.',
  ],
  s0028: [
    'In the Yuanjia era of Liu Song, Grand Astrologer Qian Lezhi cast a bronze armillary sphere, using cinnabar, black, and white to distinguish the three schools while matching Chen Zhuo\'s totals.',
    'Under Liu Song\'s Yuanjia reign, Grand Astrologer Qian Lezhi cast a bronze armillary sphere, marking the three schools in red, black, and white while conforming to Chen Zhuo\'s counts.',
  ],
  s0029: [
    'When Emperor Gaozu pacified Chen, he obtained the skilled celestial officer Zhou Fen, and also acquired the armillary instruments of the Song house.',
    'When Gaozu conquered Chen, he gained the adept celestial officer Zhou Fen and recovered the Song dynasty\'s armillary instruments.',
  ],
  s0030: [
    'He then ordered Yu Ji Cai and others to collate the official and private old charts of Zhou, Qi, Liang, Chen, Zu Geng, and Sun Seng Hua, adjust their large and small scales, correct their sparse and dense placements, and take the star positions of the three schools as the standard for a canopy chart.',
    'He ordered Yu Ji Cai and others to collate old charts from Zhou, Qi, Liang, Chen, Zu Geng, and Sun Seng Hua—public and private—adjusting scale, correcting density, and using the three schools\' star positions as the basis for a canopy chart.',
  ],
  s0031: [
    'Along the sides the initial divisions were set out, tables marked the regular degrees, and both the red and yellow paths and the inner and outer circles were fully provided.',
    'Initial divisions were laid out at the margins, standard degrees tabulated, and both the red and yellow paths with inner and outer circles were included.',
  ],
  s0032: [
    'The suspended images shone clear, the entwined separations took their order, stars\' hiding and appearing and the Milky Way\'s winding return—all like the vaulted azure, to serve as the correct model.',
    'Suspended stars stood plain, lodge boundaries fell in order, stars waxed and waned, and the Milky Way wound back like the vault of sky itself—a standard for correct reckoning.',
  ],
  s0033: [
    'Fen was appointed Grand Astrologer.',
    'Zhou Fen was made Grand Astrologer.',
  ],
  s0034: [
    'Fen broadly examined the classics and diligently instructed; from this the students of the Astrological Bureau began to recognize the celestial offices.',
    'Fen studied the classics exhaustively and taught with diligence; from then on the Astrological Bureau\'s trainees could identify the celestial offices.',
  ],
  s0035: [
    'Emperor Yang also sent forty palace women to the Astrological Bureau and separately commanded Yuan Chong to teach them star qi; those who completed the training entered the inner palace to assist in divination and verification.',
    'Emperor Yang dispatched forty palace women to the Astrological Bureau and separately ordered Yuan Chong to instruct them in star qi; graduates entered the inner palace to aid in divination.',
  ],
  s0036: [
    'The historiographer, visiting the observatory platform to inspect the armillary sphere, saw the one cast by Chao Chong, Grand Astrologer of Northern Wei, made of iron with six circles.',
    'The historiographer, examining the armillary sphere at the observatory, found the instrument cast by Northern Wei Grand Astrologer Chao Chong—iron, with six rings.',
  ],
  s0037: [
    'Of the outer four circles, four were fixed—one imaging the terrain, one the equator, and the rest the two poles.',
    'Four of the outer six rings were fixed: one representing terrain, one the equator, and the remainder the two celestial poles.',
  ],
  s0038: [
    'The inner two circles could rotate, used together with an eight-foot tube to sight star degrees.',
    'The inner two rings rotated, paired with an eight-foot sighting tube to measure stellar degrees.',
  ],
  s0039: [
    'It was obtained when Emperor Wu of Northern Zhou conquered Qi.',
    'Northern Zhou\'s Emperor Wu acquired it when he conquered Qi.',
  ],
  s0040: [
    'In the third year of Sui Kaihuang, when the new capital was first completed, it was placed atop the observatory platform.',
    'In Sui Kaihuang year 3, when the new capital was finished, the instrument was installed on the observatory platform.',
  ],
  s0041: [
    'The Great Tang continued to use it.',
    'The Tang dynasty continued to employ it.',
  ],
  s0042: [
    'Ma Qian\'s Treatise on the Celestial Offices and Ban\'s record preserve the broad outline of strange stars, halos and spurs, cloud vapors, rainbows, and secondary rainbows, but cannot list them all.',
    'Sima Qian\'s Treatise on the Celestial Offices and Ban Gu\'s account give the broad categories of prodigious stars, halos, spurs, cloud vapors, and rainbows, but do not enumerate every form.',
  ],
  s0043: [
    'Afterward the historiographers made no further records.',
    'Later historiographers kept no further records.',
  ],
  s0044: [
    'The Zuo Commentary on the Spring and Autumn Annals says: "After the duke had performed the new-moon sacrifice, he then ascended the observatory platform—for every solstice, equinox, and seasonal gate, cloud phenomena were always recorded.',
    'The Zuo Commentary says: "After performing the new-moon sacrifice, the duke ascended the observatory—for each solstice, equinox, and seasonal commencement, cloud signs were duly written down.',
  ],
  s0045: [
    '" The numinous Way has its keeper—how could it be falsely reported!',
    'The numinous Way has its officers—how could such things be fabricated!',
  ],
  s0046: [
    'Now I briefly set forth their forms, names, and divinatory verification, placing them after the fixed stars.',
    'Here I briefly list their forms, names, and divinatory tests, appending them after the section on fixed stars.',
  ],
  s0047: [
    'The Body of Heaven',
    'The Celestial Body',
  ],
  s0048: [
    'Those who spoke of Heaven in antiquity had three schools: first, Canopy Heaven; second, Overnight Heaven; third, Spherical Heaven.',
    'Ancient cosmologists recognized three schools: Canopy Heaven, Overnight Heaven, and Spherical Heaven.',
  ],
  s0049: [
    'The theory of Canopy Heaven is that of the Zhou Bi.',
    'Canopy Heaven theory is set forth in the Zhou Bi.',
  ],
  s0050: [
    'Its origin lies in Fuxi\'s establishment of the degrees of the circuit of Heaven; what was transmitted passed from the Shang to the Duke of Zhou, and the Zhou people recorded it—hence it is called the Zhou Bi.',
    'Fuxi first established the degrees of Heaven\'s circuit; the tradition passed from Shang to the Duke of Zhou, and the Zhou recorded it—hence Zhou Bi, "Zhou Gnomon."',
  ],
  s0051: [
    'Bi means thigh;',
    'Bi means thigh—',
  ],
  s0052: [
    'the thigh is the gnomon.',
    'the thigh serves as the measuring post.',
  ],
  s0053: [
    'It says Heaven is like an inverted bowl and Earth like an overturned dish—Heaven and Earth each high in the center and low at the edges.',
    'Heaven resembles an inverted bowl, Earth an upturned dish—each highest at the center and sloping downward at the rim.',
  ],
  s0054: [
    'Below the North Pole is the center of Heaven and Earth; that land is highest, and waters pour out in four directions; the three luminaries hide and shine, making day and night.',
    'Beneath the North Pole lies the center of Heaven and Earth, where the land stands highest; waters spill outward on all sides, and the three luminaries alternately hide and shine to create day and night.',
  ],
  s0055: [
    'Heaven at the center is sixty thousand li higher than the outer circle at the winter solstice sun\'s position; the North Pole\'s land is sixty thousand li higher than the land beneath the outer circle, and the outer circle is twenty thousand li higher than the land beneath the North Pole.',
    'At the center Heaven rises sixty thousand li above the outer ring where the winter solstice sun stands; land under the North Pole stands sixty thousand li above land under the outer ring, while the outer ring itself stands twenty thousand li above the land beneath the North Pole.',
  ],
  s0056: [
    'Heaven and Earth rise high in parallel, and the sun is constantly eighty thousand li from Earth.',
    'Heaven and Earth rise together in parallel, and the sun always stands eighty thousand li from Earth.',
  ],
  s0057: [
    'The sun clings to Heaven and turns level; between winter and summer the path the sun travels forms seven circles and six intervals.',
    'The sun rides Heaven and revolves evenly; between winter and summer its path forms seven rings and six intervals.',
  ],
  s0058: [
    'The circuit diameter of each ring follows arithmetic reckoning; using right triangles and double differences, one infers gnomon shadows and polar motion to determine distances—all obtained from the gnomon post—hence Zhou Bi.',
    'Each ring\'s circumference and diameter follow arithmetical calculation; by gnomon shadows and double-difference triangulation one derives distances of extreme motion—all from the measuring post—hence the name Zhou Bi.',
  ],
  s0059: [
    'The Zhou Bi school also says: "Heaven is round like an spread canopy, Earth square like a chessboard.',
    'The Zhou Bi school also holds: "Heaven is round like an opened canopy; Earth is square like a chessboard.',
  ],
  s0060: [
    'Heaven turns at the side like a millstone grinding to the left; sun and moon move to the right—Heaven turns left, so though sun and moon truly move eastward, Heaven drags them to set in the west.',
    'Heaven rotates sideways like a millstone turning left; sun and moon move rightward. Heaven turns left, so though sun and moon truly travel east, Heaven pulls them westward to set.',
  ],
  s0061: [
    'It is like an ant crawling on a millstone— the stone turns left while the ant goes right; the stone is fast and the ant slow, so the ant cannot but wheel left with the stone.',
    'Like an ant on a turning millstone: the stone spins left while the ant crawls right; the stone outpaces the ant, so the ant is carried leftward with it.',
  ],
  s0062: [
    'Heaven\'s form is high in the south and low in the north; the sun rises from the high and so is seen, and sets in the low and so is not seen.',
    'Heaven slopes high in the south and low in the north; the sun rises from the heights and becomes visible, and sets in the depths and disappears.',
  ],
  s0063: [
    'Heaven\'s position is like a leaning canopy, so the pole is north of man—this is the proof.',
    'Heaven rests like a tilted canopy, placing the pole north of the observer—this is the evidence.',
  ],
  s0064: [
    'The pole is at Heaven\'s center, yet now it is north of man—by this one knows Heaven\'s form is like a leaning canopy.',
    'The pole stands at Heaven\'s center, yet appears north of us—whence we know Heaven\'s shape resembles a tilted canopy.',
  ],
  s0065: [
    'The sun emerges from yin at dawn and enters yin at dusk; yin qi is dark and obscure, so from setting it is not seen.',
    'At dawn the sun rises from yin; at dusk it enters yin again. Yin qi is dark, so once it sets the sun vanishes from sight.',
  ],
  s0066: [
    'In summer yang qi is abundant and yin qi scarce; yang qi is bright and shares radiance with the sun, so at rising it is seen with nothing to hide it—thus summer days are long.',
    'In summer yang prevails and yin is sparse; yang shines bright and shares the sun\'s light, so at sunrise nothing obscures it—hence long summer days.',
  ],
  s0067: [
    'In winter yin qi is abundant and yang qi scarce; yin qi is dark and obscure and masks the sun\'s light—even when risen it remains hidden—thus winter days are short.',
    'In winter yin prevails and yang is sparse; dark yin shrouds the sun\'s light, so even after rising it stays concealed—hence short winter days.',
  ],
  s0068: [
    '"',
    '"',
  ],
  s0069: [
    'At the end of Han, Yang Xiong raised eight objections to Canopy Heaven to reconcile it with Spherical Heaven.',
    'Late in the Han, Yang Xiong posed eight objections to Canopy Heaven theory in favor of Spherical Heaven.',
  ],
  s0070: [
    'The first says: "The sun travels east along the Yellow Path.',
    'The first objection: "The sun moves east along the Yellow Path.',
  ],
  s0071: [
    'At midday it fits the compass; Oxherd is one hundred ten degrees south of the North Pole, Well one hundred ten degrees south of the North Pole—together one hundred eighty degrees.',
    'At noon it bisects the horizon; Oxherd lies one hundred ten degrees south of the North Pole, Well seventy degrees south—one hundred eighty degrees together.',
  ],
  s0072: [
    'Circumference three, diameter one—the twenty-eight lodges should circuit five hundred forty degrees, yet now it is three hundred sixty degrees—why?',
    'With circumference thrice the diameter, the twenty-eight lodges should span five hundred forty degrees, yet they span only three hundred sixty—why?',
  ],
  s0073: [
    '" The second says: "On the days of the spring and autumn equinoxes the sun rises due east at mao and sets due west at you, and the daylight clepsydra reads fifty marks.',
    'The second: "At the equinoxes the sun rises at mao due east and sets at you due west, with fifty marks of daylight.',
  ],
  s0074: [
    'If the canopy of Heaven turns, night should be twice day.',
    'If Heaven\'s canopy rotates, night should be twice as long as day.',
  ],
  s0075: [
    'Yet tonight is also fifty marks—why?',
    'Yet tonight too runs fifty marks—why?',
  ],
  s0076: [
    '" The third says: "When the sun sets stars appear; when the sun rises they are not seen—thus below the Dipper the sun is seen six months and not seen six months.',
    'The third: "Stars appear at sunset and vanish at sunrise—below the Dipper the sun is visible six months and hidden six months.',
  ],
  s0077: [
    'The Northern Dipper too should be seen six months and not seen six months.',
    'The Northern Dipper should likewise be visible six months and hidden six months.',
  ],
  s0078: [
    'Yet tonight it is always seen—why?',
    'Yet it is always visible at night—why?',
  ],
  s0079: [
    '" The fourth says: "Viewing the Milky Way on the canopy chart, it rises from the Dipper and enters eastward between Wolf and Arc—curved like a wheel.',
    'The fourth: "On the canopy chart the Milky Way rises from the Dipper and runs east between Wolf and Arc, curved like a wheel.',
  ],
  s0080: [
    'Yet now viewing the Milky Way it is straight as a cord—why?',
    'Yet viewed directly it runs straight as a cord—why?',
  ],
  s0081: [
    '" The fifth says: "The twenty-eight lodges circuit Heaven—on the canopy chart, stars seen should be fewer and stars unseen should be more.',
    'The fifth: "The twenty-eight lodges circle Heaven—on the canopy chart, visible stars should be fewer and invisible stars more numerous.',
  ],
  s0082: [
    'Yet now seen and unseen are equal—why, with no winter or summer in rising and setting, are two lodges\' fourteen stars always visible, not varying in number because days are long or short—why?',
    'Yet seen and unseen are equal—why, with no seasonal change in rising and setting, are fourteen stars of two lodges always visible, unaffected by day length—why?',
  ],
  s0083: [
    '" The sixth says: "Heaven is highest and Earth is lowest.',
    'The sixth: "Heaven is supremely high and Earth supremely low.',
  ],
  s0084: [
    'The sun rests on Heaven and revolves—this may be called supremely high.',
    'The sun rides Heaven and revolves—surely this is the highest reach.',
  ],
  s0085: [
    'Though the human eye may be deceived, water and shadow cannot be deceived.',
    'The eye may err, but water and shadow cannot.',
  ],
  s0086: [
    'Yet now from atop a high mountain, viewing the sun in water, when the sun rises it is below the water and the shadow rises above—why?',
    'Yet from a high mountain, sighting the sun in water, at sunrise the sun appears below the water while the shadow rises above—why?',
  ],
  s0087: [
    '" The seventh says: "View objects near and they appear large; far and they appear small.',
    'The seventh: "Near objects look large; distant ones look small.',
  ],
  s0088: [
    'Yet now the sun and the Northern Dipper—near us they are small, far from us they are large—why?',
    'Yet the sun and Northern Dipper look small when near and large when far—why?',
  ],
  s0089: [
    '" The eighth says: "Viewing the canopy rafters and the spaces between chariot spokes, near the axle hub they are dense and farther away increasingly sparse.',
    'The eighth: "Between canopy ribs and chariot spokes, spacing is tight near the hub and grows wider with distance.',
  ],
  s0090: [
    'Now the North Pole is Heaven\'s axle hub and the twenty-eight lodges are Heaven\'s rafters and spokes.',
    'The North Pole is Heaven\'s hub; the twenty-eight lodges are its rafters and spokes.',
  ],
  s0091: [
    'Measuring Heaven by star degrees, the intervals between stars in the south next to Earth should be several times greater.',
    'By stellar degrees, star intervals in the south near Earth should be several times wider.',
  ],
  s0092: [
    'Yet now they cross densely—why?',
    'Yet they crowd together—why?',
  ],
  s0093: [
    '" Afterward Huan Tan, Zheng Xuan, Cai Yong, and Lu Ji each set forth the Zhou Bi and tested the state of Heaven, finding much that did not accord.',
    'Later Huan Tan, Zheng Xuan, Cai Yong, and Lu Ji each examined the Zhou Bi against Heaven\'s actual state and found much amiss.',
  ],
  s0094: [
    'When Emperor Wu of Liang lectured in the Everlasting Spring Hall, he proposed another model of the celestial body identical to the Zhou Bi text—essentially advancing a new idea merely to refute Spherical Heaven theory.',
    'When Liang Wudi lectured in the Everlasting Spring Hall, he proposed a celestial model identical to the Zhou Bi—chiefly a new formulation meant to overturn Spherical Heaven.',
  ],
  s0095: [
    'Books of the Overnight school have absolutely no transmitted teaching lineage.',
    'No master lineage survives for Overnight Heaven texts.',
  ],
  s0096: [
    'Only Xi Meng, Secretary of the Han Secretariat, recorded what earlier masters transmitted, saying: "Heaven has no solid substance; looking up at it, it is boundlessly high and far, the eyes dazzled and the spirit exhausted, hence the blue expanse.',
    'Only Han Secretariat officer Xi Meng recorded the oral tradition: "Heaven has no solid body; gazing upward it extends without limit, the eyes dazzled and spirit spent—hence the blue expanse.',
  ],
  s0097: [
    'It is like looking sideways at distant Yellow Mountains and seeing all blue, or peering down a thousand-ren chasm and finding deep black—blue is not a true color, and black is not a solid body.',
    'Like seeing distant Yellow Mountains all blue from the side, or a thousand-ren gorge black from above—blue is not true color, black is not solid form.',
  ],
  s0098: [
    'Sun, moon, and the multitude of stars naturally float in empty space; their going and stopping all depend on qi.',
    'Sun, moon, and stars naturally float in the void; their motion and rest depend entirely on qi.',
  ],
  s0099: [
    'Thus the seven luminaries sometimes speed and sometimes halt, sometimes advance directly and sometimes retreat; their hiding and appearing are not fixed, their advance and retreat not the same—because they have nothing to which they are tethered, each differs.',
    'Hence the seven luminaries now hurry, now pause, now advance, now retreat; their visibility shifts without rule because nothing anchors them—each moves on its own.',
  ],
  s0100: [
    'Therefore the pole star constantly keeps its place, and the Northern Dipper does not set westward with the other stars.',
    'Thus the pole star holds its station, and the Northern Dipper does not sink westward with the other stars.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error('Usage: node translations/patches/suishu-019-batch1.mjs <translation.json>');
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
