#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'National custom: they have houses and clothing and eat polished rice.',
    'By custom they live in houses, wear clothes, and eat polished rice.',
  ],
  s0102: [
    'Their speech differs slightly from Funan\'s.',
    'Their language differs a little from Funan.',
  ],
  s0103: [
    'There is a mountain that yields gold; gold appears exposed on the rock with no limit.',
    'A mountain there yields gold that forms bare on the stone without end.',
  ],
  s0104: [
    'By national law criminals are executed and all eat their flesh before the king.',
    'National law executes criminals, and all eat their flesh in the king\'s presence.',
  ],
  s0105: [
    'The realm accepts no merchants; any who come are also killed and eaten—hence traders dare not arrive.',
    'Merchants are not admitted; any who arrive are killed and eaten, so traders dare not come.',
  ],
  s0106: [
    'The king always dwells in a tower, takes no blood food, and serves no ghosts or spirits.',
    'The king lives in a tower, eats no blood offerings, and worships neither ghosts nor spirits.',
  ],
  s0107: [
    'His descendants live and die like ordinary men; only the king does not die.',
    'His line lives and dies as other men do; only the king is immortal.',
  ],
  s0108: [
    'The king of Funan often sent envoys exchanging letters; he regularly gifted the Funan king fifty sets of pure-gold vessels—some round like plates, some like earthen jars called "duo luo" holding five sheng, some like bowls holding one sheng.',
    'The Funan king often exchanged letters by envoy and regularly sent fifty sets of pure-gold tableware—round platters, earthen jars called duo luo of five sheng, and bowls of one sheng.',
  ],
  s0109: [
    'The king could also write in Indic script—about three thousand characters—explaining the causes of his past lives, resembling Buddhist sutras and discoursing on good deeds.',
    'He could also compose some three thousand characters in Indic script on the causes of his former lives—much like a sutra, praising good conduct.',
  ],
  s0110: [
    'It is also said that east of Funan\'s border lies the Great Rising Sea; in the sea is a great isle, on the isle are various Bo states, and east of those states are the Five Horse Continents.',
    'Tradition also places the Great Rising Sea east of Funan, with a great isle bearing many Bo kingdoms and, farther east, the Five Horse Continents.',
  ],
  s0111: [
    'Sailing east another thousand-odd li across the rising sea brings one to the Natural Great Isle.',
    'Another thousand-odd li east across the rising sea reaches the Natural Great Isle.',
  ],
  s0112: [
    'There grow trees that burn within fire; people nearby on the isle strip the bark, spin and weave it into cloth—several feet at most for hand towels—no different from ramie but slightly blue-black in color;',
    'Trees there burn from within; islanders strip the bark, spin and weave it into cloth a few feet long for towels—like ramie, but tinged blue-black;',
  ],
  s0113: [
    'if slightly soiled, cast it in fire and it becomes clean again.',
    'slight stains vanish when the cloth is thrown into fire.',
  ],
  s0114: [
    'Some make it into lamp wicks—it burns without seeming to end.',
    'As lamp wicks it burns as though it would never be spent.',
  ],
  s0115: [
    'Funan by custom originally went naked, tattooed the body and wore loose hair, making no garments.',
    'Funan once went naked by custom, tattooed and with loose hair, wearing no clothes.',
  ],
  s0116: [
    'A woman served as king, styled Willow Leaf.',
    'A woman ruled as king under the name Willow Leaf.',
  ],
  s0117: [
    'Young, strong and vigorous, she resembled a man.',
    'She was young, strong, and almost manlike in bearing.',
  ],
  s0118: [
    'South of them was the border state; a man who served ghosts and spirits named Hun Tian dreamed the god granted him a bow, and he boarded a merchant ship to sea.',
    'To the south lay a frontier state; Hun Tian, who served spirits, dreamed a god gave him a bow and boarded a merchant vessel for the sea.',
  ],
  s0119: [
    'Hun Tian at dawn went straight to the shrine, found the bow beneath the sacred tree, then as the dream directed sailed the sea and entered a Funan outlying settlement.',
    'At dawn Hun Tian went to the shrine, found the bow under the sacred tree, sailed as the dream bade, and entered a Funan outpost.',
  ],
  s0120: [
    'Willow Leaf\'s people saw the ship arrive and meant to seize it; Hun Tian drew the bow and shot through the vessel from side to side—the arrow reaching attendants—and Willow Leaf in great fear led all her people to surrender to Hun Tian.',
    'Willow Leaf\'s people tried to take the ship; Hun Tian shot clear through it, the arrow striking attendants, and in terror she led her people to submit.',
  ],
  s0121: [
    'Hun Tian then taught Willow Leaf to wear neck-cut cloth so the body was no longer exposed; he governed the realm, took Willow Leaf as wife, and his sons were apportioned to rule seven settlements.',
    'He taught Willow Leaf neck-cut cloth to cover her body, ruled the land, married her, and divided seven settlements among his sons.',
  ],
  s0122: [
    'Later King Hun Pan Kuang by deceit and force set the settlements against one another till they mistrusted and blocked each other; he then raised arms to attack and merge them, sent descendants to divide rule over the settlements in the middle, styled Lesser Kings.',
    'Later King Hun Pan Kuang sowed distrust among the settlements by fraud and force, conquered and merged them, and set descendants to rule as Lesser Kings.',
  ],
  s0123: [
    'Pan Kuang died past ninety; the middle son Pan Pan was enthroned, and state affairs were entrusted to his grand general Fan Man.',
    'Pan Kuang died in his nineties; his middle son Pan Pan succeeded, entrusting affairs to Grand General Fan Man.',
  ],
  s0124: [
    'Pan Pan reigned three years and died; the people together raised Man as king.',
    'Pan Pan ruled three years and died; the people jointly enthroned Man.',
  ],
  s0125: [
    'Man was brave, strong and resourceful; again by military might he attacked neighboring states—all submitted and were annexed—and he styled himself Great King of Funan.',
    'Man was bold, able, and cunning; by arms he subjugated neighboring states and styled himself Great King of Funan.',
  ],
  s0126: [
    'He built great ships, explored the rising sea, attacked more than ten states including Qudu Kun, Jiuzhi, and Diansun, opening territory five or six thousand li.',
    'He built great ships, crossed the rising sea, conquered more than ten states such as Qudu Kun, Jiuzhi, and Diansun, and opened five or six thousand li of land.',
  ],
  s0127: [
    'Next, when about to attack the state of Jinlin, Man fell ill and sent Crown Prince Jin Sheng in his stead.',
    'When he was about to attack Jinlin, Man fell ill and sent Crown Prince Jin Sheng in his place.',
  ],
  s0128: [
    'Man\'s sister\'s son Zhan, then a commander of two thousand, usurped Man and proclaimed himself king, sent men pretending friendship to trick Jin Sheng and kill him.',
    'Man\'s sister\'s son Zhan, a commander of two thousand, seized the throne, sent men to deceive Jin Sheng, and killed him.',
  ],
  s0129: [
    'When Man died there was a nursing infant named Chang among the people; at twenty he gathered bold men of the realm to attack and kill Zhan—Zhan\'s grand general Fan Xun then killed Chang and made himself king.',
    'At Man\'s death an infant named Chang was still at the breast among the people; at twenty he rallied warriors, killed Zhan, and was in turn killed by Zhan\'s grand general Fan Xun, who took the throne.',
  ],
  s0130: [
    'He restored and governed the interior, raised pavilions for pleasure, and received guests three or four times from morning through midday to evening.',
    'He rebuilt the realm, raised pleasure towers, and received guests three or four times from dawn through noon to dusk.',
  ],
  s0131: [
    'The people take sugarcane, turtles, and birds as gifts.',
    'The people offered sugarcane, turtles, and birds as tribute.',
  ],
  s0132: [
    'National law has no prisons.',
    'The realm kept no prisons.',
  ],
  s0133: [
    'The guilty first fast three days; then an axe is heated white-hot and litigants are made to carry it seven paces.',
    'Accused persons fasted three days; then a white-hot axe was carried seven paces by the litigants.',
  ],
  s0134: [
    'Gold rings and chicken eggs are also cast into boiling water for them to retrieve; if unjust, the hand chars at once; if justified, not so.',
    'Gold rings and eggs were also thrown into boiling water to be retrieved; the guilty hand charred instantly, the innocent did not.',
  ],
  s0135: [
    'Crocodiles are kept in the moat, fierce beasts penned outside the gate; the guilty are fed to beasts and crocodiles—if fish and beasts will not eat, there is no guilt, and after three days they are released.',
    'Crocodiles filled the moat and fierce beasts the outer pen; the accused were thrown to them—if the animals refused the flesh, innocence was declared and release came after three days.',
  ],
  s0136: [
    'Large crocodiles exceed two zhang; shaped like alligators, four-footed, snouts six or seven chi, teeth along both sides sharp as swords—they usually eat fish but also deer and people when encountered; south of Cangwu and in foreign lands they all have them.',
    'Great crocodiles reach more than two zhang, alligator-like on four feet, with six- or seven-chi snouts and sword-sharp teeth; they feed on fish but also take deer and men. They are found south of Cangwu and in foreign lands alike.',
  ],
  s0137: [
    'In Wu times envoys Palace Gentleman Kang Tai and Staff Officer for Local Reform Zhu Ying were sent to Xun\'s state; the people still went naked—only women wore neck-cut cloth.',
    'Under Wu, Kang Tai and Zhu Ying were sent to Fan Xun\'s state; the people still went naked, save that women wore neck-cut cloth.',
  ],
  s0138: [
    'Tai and Ying said: "The land is truly fine, only the people\'s indecent exposure is strange.',
    'Tai and Ying said, "The country is excellent, but this nakedness is strange indeed.',
  ],
  s0139: [
    '" Xun then ordered men within the realm to wear hip cloths.',
    '" Xun then ordered the men to wear hip cloths.',
  ],
  s0140: [
    'Hip cloth is today\'s ganman.',
    'Hip cloth is what is now called ganman.',
  ],
  s0141: [
    'Great households cut brocade for it; the poor used plain cloth.',
    'Wealthy families cut brocade for it; the poor used plain cloth.',
  ],
  s0142: [
    'In Tianjian year 2, Bamo again sent envoys bearing a coral Buddha image and presenting local goods.',
    'In the second year of Tianjian, Bamo again sent envoys with a coral Buddha image and local tribute.',
  ],
  s0143: [
    'Edict: "King of Funan, Kao Chenru Jieye Bamo, set apart beyond the sea, inheriting the southern domain through generations—his sincerity renowned afar, tribute brought through double translation.',
    'An edict ran: "Kao Chenru Jieye Bamo, King of Funan, stands apart beyond the sea, inheriting the southern realm through generations; his loyalty reaches from afar and his tribute comes through double translation.',
  ],
  s0144: [
    'He should receive reward and return gifts, and be granted an honored title.',
    'He should be rewarded and honored with a noble title.',
  ],
  s0145: [
    'Let him be General Who Pacifies the South and King of Funan."',
    'Let him be made General Who Pacifies the South and King of Funan."',
  ],
  s0146: [
    'Now its people are all ugly and black, with curly hair.',
    'Its people today are dark and plain-featured, with curled hair.',
  ],
  s0147: [
    'Where they dwell they dig no wells; several tens of households share one pool for drawing water.',
    'They sink no wells at home; dozens of households draw from a common pool.',
  ],
  s0148: [
    'They worship the Celestial God; images are cast in bronze—two-faced ones have four hands, four-faced ones eight hands, each holding something: sometimes a child, sometimes birds and beasts, sometimes sun and moon.',
    'They worship the Celestial God in bronze images: two-faced gods have four hands, four-faced gods eight, bearing children, birds and beasts, or sun and moon.',
  ],
  s0149: [
    'The king going out or in rides an elephant; concubines and attendants do likewise.',
    'The king rides an elephant when he goes abroad, and so do his consorts and attendants.',
  ],
  s0150: [
    'When the king sits he perches sideways with one knee raised, the left knee hanging to the ground; white cotton is spread before him and a gold basin and incense burner set upon it.',
    'Seated, the king perches sideways with one knee raised and the left knee to the ground; white cotton lies before him with a gold basin and censer upon it.',
  ],
  s0151: [
    'National custom: in mourning they shave beard and hair.',
    'In mourning they shave beard and hair by custom.',
  ],
  s0152: [
    'The dead have four burials: water burial casts into rivers; fire burial burns to ash; earth burial inters; bird burial abandons in open wilds.',
    'The dead receive one of four rites: cast into rivers, burned to ash, buried in earth, or abandoned to the wild for birds.',
  ],
  s0153: [
    'Human nature is greedy and stingy, without ritual propriety—men and women indulge their wanton couplings.',
    'The people are grasping and without propriety; men and women follow their desires freely.',
  ],
  s0154: [
    'Earlier, in the eighth month of year 3, Gaozu rebuilt the Ashoka Temple pagoda, removing from beneath the old pagoda relics and the Buddha\'s nail and hair.',
    'Earlier, in the eighth month of the third year, Gaozu rebuilt the Ashoka Temple pagoda and took from beneath the old tower relics and the Buddha\'s nail and hair.',
  ],
  s0155: [
    'The hair was blue-black; when monks stretched it by hand it lengthened or shortened at will; released, it coiled spirally like a shell pattern.',
    'The hair was blue-black; monks could stretch it to any length at a touch, and when released it curled into a spiral shell pattern.',
  ],
  s0156: [
    'The Sangha Sutra says: "The Buddha\'s hair was blue and fine, like lotus-stem filament.',
    'The Sangha Sutra says, "The Buddha\'s hair was blue and fine as lotus-stem thread.',
  ],
  s0157: [
    '" The Buddha Samadhi Sutra says: "When I bathed my head in the palace I measured the hair with a ruler—one zhang two chi long; released, it spiraled rightward into a shell pattern.',
    '" The Buddha Samadhi Sutra says, "When I bathed my head in the palace I measured my hair at one zhang two chi; released, it spiraled rightward into a shell pattern.',
  ],
  s0158: [
    '" This matched what Gaozu obtained.',
    '" This matched what Gaozu had found.',
  ],
  s0159: [
    'Ashoka was the Iron-Wheel King who ruled Jambudvipa and unified the realm; within a day and night after the Buddha\'s nirvana he employed ghosts and spirits to make eighty-four thousand pagodas—this was one of them.',
    'Ashoka was the Iron-Wheel King who ruled Jambudvipa and unified the world; within a day and night after the Buddha\'s nirvana he set ghosts and spirits to build eighty-four thousand pagodas—this was one.',
  ],
  s0160: [
    'In Wu times a nun dwelled there in a small hermitage; Sun Chen soon destroyed it and the pagoda vanished likewise.',
    'In Wu a nun lived there in a small hermitage; Sun Chen destroyed it, and the pagoda perished with it.',
  ],
  s0161: [
    'After Wu was pacified, various monks rebuilt on the old site.',
    'After Wu fell, monks rebuilt on the old ground.',
  ],
  s0162: [
    'When Jin Emperor Zhongzong first crossed the Yangzi, it was again repaired and adorned.',
    'When Jin Zhongzong first crossed the Yangzi, the site was repaired again.',
  ],
  s0163: [
    'By Emperor Jianwen\'s Xian\'an era a monk Fa An was sent to build a small pagoda; before it was finished he died, and disciple Seng Xian continued construction.',
    'By Jianwen\'s Xian\'an reign Fa An was sent to build a small pagoda; he died before it was finished, and his disciple Seng Xian completed it.',
  ],
  s0164: [
    'By Emperor Xiaowu\'s ninth year of Taiyuan, a gold dharmachakra finial and dew-collector were placed atop.',
    'By Xiaowu\'s ninth Taiyuan year a gold wheel finial and dew basin were set on top.',
  ],
  s0165: [
    'Later Liu Sahe, a barbarian of Lishi County in Xihe, suddenly died of illness yet his chest remained warm; the family dared not bury him, and after ten days he revived.',
    'Later Liu Sahe, a foreigner of Lishi in Xihe, died suddenly of illness, yet his chest stayed warm; the family delayed burial ten days until he revived.',
  ],
  s0166: [
    'He said: "Two clerks seized my record and led me northwest—I knew not the distance—to eighteen hells, where according to the weight of retribution I suffered every torment.',
    'He said, "Two clerks took my register and led me northwest to eighteen hells, where I suffered torments according to my deeds.',
  ],
  s0167: [
    'I saw Guanyin who said: \'Your karmic ties are not exhausted; if you live, become a monk.',
    'Guanyin appeared and said, \'Your fate is not yet spent; if you live, become a monk.',
  ],
  s0168: [
    'Luoyang, Qicheng, Danyang, and Kuaiji all have Ashoka pagodas—you may go and worship.',
    'Luoyang, Qicheng, Danyang, and Kuaiji all have Ashoka pagodas; go and worship there.',
  ],
  s0169: [
    'When your life ends, you will not fall into hell.\'',
    'When your life ends, you will not fall into hell.\'',
  ],
  s0170: [
    'When the words ended, it was like falling from a high cliff—I woke suddenly."',
    'When the speech ended I seemed to fall from a cliff and woke at once."',
  ],
  s0171: [
    '" For this he left the household and took the name Huida.',
    '" Thereupon he left the household and was called Huida.',
  ],
  s0172: [
    'He traveled worshipping pagodas; next reaching Danyang, not knowing the pagoda\'s site, he climbed Yue city walls and looked four ways—saw over Changli li an unusual aura, went to worship, and it was indeed the Ashoka pagoda site, repeatedly emitting light.',
    'He traveled worshipping pagodas; reaching Danyang and not knowing where the pagoda stood, he climbed Yue city\'s walls and saw over Changli li a strange radiance; worshipping there, he found the Ashoka pagoda site, which often shone with light.',
  ],
  s0173: [
    'Hence he knew there must be relics; gathering a crowd he dug—one zhang deep—finding three stone tablets each six chi long.',
    'Sure then that relics lay below, he gathered men and dug one zhang down, finding three stone tablets each six chi long.',
  ],
  s0174: [
    'In one tablet was an iron casket, inside a silver casket, inside again a gold casket holding three relics and one nail and hair each—the hair several feet long.',
    'One tablet held an iron casket, within it silver, within that gold, containing three relics and one nail and one hair apiece; the hair was several feet long.',
  ],
  s0175: [
    'The relics were moved northward; west of the pagoda Jianwen built, a one-story pagoda was erected.',
    'The relics were moved north and a one-story pagoda built west of the tower Jianwen had raised.',
  ],
  s0176: [
    'In year 16 a monk Seng Shangjia was sent to make three stories—the one Gaozu opened.',
    'In the sixteenth year the monk Seng Shangjia was ordered to build three stories—the tower Gaozu had opened.',
  ],
  s0177: [
    'At first digging four chi of earth revealed a dragon grotto and various treasures earlier donors had placed—gold and silver rings, bracelets, hairpins, tweezers, and the like.',
    'Digging four chi down first revealed a dragon grotto and gifts of gold and silver rings, bracelets, hairpins, tweezers, and other treasures left by earlier donors.',
  ],
  s0178: [
    'About nine chi deep one reached the stone foundation; beneath was a stone casket, inside an iron jar holding a silver tripod, inside a gold filigree jar holding three relics the size of millet grains—round, upright, lustrous.',
    'Some nine chi down they reached the stone base; beneath it lay a stone casket with an iron jar, a silver tripod within, and a gold filigree jar holding three round, bright relics the size of millet grains.',
  ],
  s0179: [
    'Inside the casket was also a glass bowl containing four relics and hair and nails—four nails, all the color of agarwood.',
    'The casket also held a glass bowl with four relics, hair, and four nails, all the color of agarwood.',
  ],
  s0180: [
    'On the twenty-seventh of that month Gaozu again came to the temple to worship, holding an unrestricted assembly and granting a great amnesty to the realm.',
    'On the twenty-seventh of that month Gaozu returned to worship at the temple, held an unrestricted assembly, and proclaimed a great amnesty.',
  ],
  s0181: [
    'That day, relics were floated in water in a gold bowl; the smallest hid in the bowl and would not emerge—Gaozu bowed dozens of times until the relic glowed within the bowl, revolving long before settling in the bowl\'s center.',
    'That day relics were set afloat in a gold bowl of water; the smallest would not rise until Gaozu bowed many times, whereupon it glowed within the bowl, wheeling long before coming to rest.',
  ],
  s0182: [
    'Gaozu asked the Chief Sangha Master Huinian: "Today did you see something inconceivable?"',
    'Gaozu asked Chief Sangha Master Huinian, "Did you see anything inconceivable today?"',
  ],
  s0183: [
    'Huinian answered: "The Dharma-body eternally abides, serene and unmoving."',
    'Huinian answered, "The Dharma-body eternally abides, serene and unmoving."',
  ],
  s0184: [
    'Gaozu said: "Your disciple wishes to request one relic to return to the capital for veneration."',
    'Gaozu said, "Your disciple would ask for one relic to take back to the capital for veneration."',
  ],
  s0185: [
    'On the fifth day of the ninth month another unrestricted assembly was held at the temple; the crown prince, princes, nobles, and court grandees were sent to welcome the relic.',
    'On the fifth day of the ninth month another unrestricted assembly was held at the temple, and the crown prince, princes, nobles, and court grandees were sent to welcome the relic.',
  ],
  s0186: [
    'That day the weather was bright and mild; the capital turned out en masse—over a million onlookers.',
    'That day the sky was clear and mild, and more than a million people in the capital came to look on.',
  ],
  s0187: [
    'Gold and silver offerings and the like were all left at the temple for veneration, and ten million coins granted as the temple\'s endowment.',
    'The gold and silver offerings were left at the temple for worship, and ten million coins were granted as its endowment.',
  ],
  s0188: [
    'By the fifteenth of the ninth month, year 4, Gaozu again held an unrestricted assembly at the temple, erecting two pagodas, each with gold jars, then jade jars, again holding relics and nail and hair within seven-jewel pagodas.',
    'On the fifteenth of the ninth month in the fourth year Gaozu again held an unrestricted assembly, raised two pagodas, and placed relics and nail and hair in gold and jade jars within seven-jewel towers.',
  ],
  s0189: [
    'Stone caskets holding jewel pagodas were placed beneath the two pagodas; gold, silver, rings, bracelets, and other treasures donated by princes, consorts, nobles, commoners, and wealthy households piled in abundance.',
    'Stone caskets with jewel pagodas went beneath the two towers, and gold, silver, rings, bracelets, and other treasures offered by princes, consorts, nobles, commoners, and the wealthy piled high.',
  ],
  s0190: [
    'On the second of the eleventh month, year 11, temple monks invited Gaozu to expound the Prajna Sutra at the temple; that evening both pagodas together emitted light; the emperor ordered Eastern Pacification General Prince of Shaoling Lun to compose the temple\'s Great Merit Stele text.',
    'On the second day of the eleventh month in the eleventh year the monks invited Gaozu to open the Prajna Sutra at the temple; that night both pagodas shone, and the emperor ordered Eastern Pacification General Prince of Shaoling Lun to compose the Great Merit Stele.',
  ],
  s0191: [
    'Earlier, in year 2, the pagoda at Yin County in Kuaiji was rebuilt; opening the old pagoda yielded relics—four monks including Jingtuo of Guangzai Temple and Palace Attendant Sun Zhao were sent to escort them temporarily to the capital; after Gaozu worshipped they were sent back to the county and placed beneath the new pagoda—this county pagoda too was what Liu Sahe discovered.',
    'Earlier, in the second year, the Yin County pagoda in Kuaiji was rebuilt; opening the old tower yielded relics, and four monks including Jingtuo of Guangzai Temple and Palace Attendant Sun Zhao escorted them briefly to the capital; after Gaozu worshipped, they were returned to the county and placed under the new pagoda—the same pagoda Liu Sahe had found.',
  ],
  s0192: [
    'At first, after Gao Ti obtained the image, five Western Region monk-barbarians came to Ti saying: "Long ago in India we obtained an Ashoka image; coming to Ye, we met barbarian turmoil and buried the image by the river—now we seek it and have lost the place.',
    'At first, after Gao Ti obtained the image, five Western monks came to him saying, "Long ago in India we acquired an Ashoka image; reaching Ye in barbarian turmoil, we buried it by the river, and now we cannot find the spot.',
  ],
  s0193: [
    '" All five one night dreamed the image said: "It has already gone east of the Yangzi and is in Gao Ti\'s possession.',
    '" All five dreamed in one night that the image said, "It has already gone east of the Yangzi and is held by Gao Ti.',
  ],
  s0194: [
    '" Ti then sent these five monks to the temple; seeing the image they sobbed and wept—the image at once emitted light illuminating the hall.',
    '" Ti sent the five monks to the temple; seeing the image they wept, and it at once shone with light throughout the hall.',
  ],
  s0195: [
    'Also at Waguan Temple Hui Sui wished to copy the image\'s form; the abbot Seng Shang feared damaging the gold and said to Sui: "If you can make the image emit light and turn westward, then I may permit it.',
    'At Waguan Temple Hui Sui wished to copy the image; Abbot Seng Shang, fearing harm to the gilding, said, "If you can make the image shine and turn westward, then I will allow it.',
  ],
  s0196: [
    '" Hui Sui earnestly bowed and prayed; that night the image turned in its seat, emitted light, and faced west; at dawn permission was given to copy it.',
    '" Hui Sui prayed earnestly; that night the image turned in its seat, shone, and faced west, and at dawn copying was permitted.',
  ],
  s0197: [
    'On the image\'s pedestal were foreign characters none could read; later the Tripitaka master Qiubamo read them—saying Ashoka had made it for his fourth daughter.',
    'Foreign script on the pedestal none could read until Tripitaka master Qiubamo deciphered it: Ashoka had made the image for his fourth daughter.',
  ],
  s0198: [
    'By the Datong era, relics were taken from the old pagoda; an edict purchased several hundred households\' dwelling lands beside the temple to expand the precinct, building halls and surrounding galleries with auspicious images—ornament beyond compare.',
    'In the Datong era relics were taken from the old pagoda; the throne bought several hundred neighboring houses to enlarge the temple, building halls, galleries, and auspicious images in unmatched splendor.',
  ],
  s0199: [
    'Murals of sutra transformations were all the work of Wu artist Zhang You.',
    'Murals of sutra scenes were all painted by the Wu master Zhang You.',
  ],
  s0200: [
    'You\'s brushwork—none could match him in his time.',
    'In his day none surpassed Zhang You in the art of painting.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_054_b2.mjs <translation.json>'
  );
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
