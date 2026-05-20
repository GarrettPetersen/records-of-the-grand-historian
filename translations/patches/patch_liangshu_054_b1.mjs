#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: ['States of the Southern Sea', 'States of the Southern Sea'],
  s0002: [
    'The states of the Southern Sea lie generally south of Jiao Province and on the great ocean isles to the southwest; the near ones are three to five thousand li apart, the far ones twenty or thirty thousand li; to the west they connect with the states of the Western Regions.',
    'The Southern Sea states lie south of Jiao Province and on great ocean isles to the southwest—near ones three to five thousand li apart, far ones twenty or thirty thousand li; westward they adjoin the Western Regions.',
  ],
  s0003: [
    'In Han Yuanding, General Fu Bo Lu Boda was sent to open the Hundred Yue and establish Rinan commandery.',
    'In Han Yuanding, General Fu Bo Lu Boda was sent to open the Hundred Yue and establish Rinan commandery.',
  ],
  s0004: [
    'All the states beyond the frontiers, from Emperor Wu onward, came to court with tribute.',
    'All the states beyond the frontiers, from Emperor Wu onward, came to court with tribute.',
  ],
  s0005: [
    'In Later Han during Emperor Huan\'s reign, Da Qin and Tianzhu both sent envoys by this route to offer tribute.',
    'In Later Han during Emperor Huan\'s reign, Da Qin and Tianzhu both sent envoys by this route to offer tribute.',
  ],
  s0006: [
    'When Wu\'s Sun Quan ruled, he sent Director of Civilizing Affairs Zhu Ying and Gentlemen-of-Attendant Kang Tai to reach them.',
    'When Wu\'s Sun Quan ruled, he sent Director of Civilizing Affairs Zhu Ying and Gentlemen-of-Attendant Kang Tai to reach them.',
  ],
  s0007: [
    'The lands they passed through and heard of amounted to over a hundred states, and they therefore compiled a record account.',
    'The lands they passed through and heard of amounted to over a hundred states, and they compiled a record account.',
  ],
  s0008: [
    'In Jin times those reaching China were few, so the official historians did not record them.',
    'In Jin times few reached China, so the official historians did not record them.',
  ],
  s0009: [
    'By Song and Qi, over ten states had arrived, and only then were accounts written for them.',
    'By Song and Qi, over ten states had arrived, and only then were accounts written for them.',
  ],
  s0010: [
    'Since Liang changed the dynastic mandate, those observing the calendar and fulfilling tribute duties, reaching by sea year after year, exceeded the earlier dynasties.',
    'Since Liang changed the dynastic mandate, those observing the calendar and fulfilling tribute duties reached by sea year after year—surpassing earlier dynasties.',
  ],
  s0011: [
    'Now I collect those whose customs are roughly well known and assemble them in "Account of the Southern Sea," thus.',
    'Now I collect those whose customs are roughly well known and assemble them in the Account of the Southern Sea, thus.',
  ],
  s0012: ['Kingdom of Lin Yi', 'Kingdom of Lin Yi'],
  s0013: [
    'The kingdom of Lin Yi was originally Xianglin County in Han\'s Rinan commandery, on the border of ancient Yuechang.',
    'The kingdom of Lin Yi was originally Xianglin County in Han\'s Rinan commandery, on the border of ancient Yuechang.',
  ],
  s0014: [
    'General Fu Bo Ma Yuan opened Han\'s southern frontier and established this county.',
    'General Fu Bo Ma Yuan opened Han\'s southern frontier and established this county.',
  ],
  s0015: [
    'Its territory was about six hundred li north-south and east-west; the capital was a hundred and twenty li from the sea, over four hundred li from the Rinan border, and abutted Jiude commandery to the north.',
    'Its territory ran about six hundred li; the capital stood a hundred and twenty li from the sea, over four hundred li from the Rinan border, and abutted Jiude commandery to the north.',
  ],
  s0016: [
    'At its southern border, by water and land routes it was over two hundred li; there was a Western-state barbarian who also styled himself king—it was where Ma Yuan planted two bronze columns marking Han\'s border.',
    'At its southern border, by water and land routes it was over two hundred li; a Western-state chieftain also styled himself king—where Ma Yuan planted two bronze columns marking Han\'s border.',
  ],
  s0017: [
    'In its land was Golden Mountain; the stones were all red, and gold was produced within them.',
    'In its land was Golden Mountain; the stones were all red, and gold was produced within them.',
  ],
  s0018: [
    'At night the gold flew forth, looking like fireflies.',
    'At night the gold flew forth, looking like fireflies.',
  ],
  s0019: [
    'It also produced tortoiseshell, cowrie shells, kapok cloth, and aloeswood.',
    'It also produced tortoiseshell, cowrie shells, kapok cloth, and aloeswood.',
  ],
  s0020: [
    'Kapok is the name of a tree; when its blossoms mature they are like goose down; its fibers are drawn and spun to make cloth, clean and white no different from ramie cloth—it can also be dyed five colors and woven into patterned cloth.',
    'Kapok is a tree; when its blossoms mature they are like goose down; its fibers are spun into cloth, clean and white like ramie—it can also be dyed five colors and woven into patterned cloth.',
  ],
  s0021: [
    'Aloeswood: the natives cut it down and pile it for years; though rotten the heart alone remains; placed in water it sinks—hence the name sinking incense.',
    'Aloeswood: natives cut it down and pile it for years; though rotten the heart alone remains; placed in water it sinks—hence the name sinking incense.',
  ],
  s0022: [
    'Next, that which neither sinks nor floats is called honey incense.',
    'Next, that which neither sinks nor floats is called honey incense.',
  ],
  s0023: [
    'At the end of Han amid great chaos, Chief Clerk Qu Da killed the magistrate and declared himself king.',
    'At the end of Han amid great chaos, Chief Clerk Qu Da killed the magistrate and declared himself king.',
  ],
  s0024: [
    'Passed through several generations; later the king had no heir and installed his sister\'s son Fan Xiong.',
    'Passed through several generations; later the king had no heir and installed his sister\'s son Fan Xiong.',
  ],
  s0025: [
    'When Xiong died, his son Yi succeeded.',
    'When Xiong died, his son Yi succeeded.',
  ],
  s0026: [
    'In the third year of Xiankang under Jin Emperor Cheng, Yi died and the slave Wen usurped the throne.',
    'In the third year of Xiankang under Jin Emperor Cheng, Yi died and the slave Wen usurped the throne.',
  ],
  s0027: [
    'Wen was originally a slave of the Yi chieftain Fan Zhi of Xijuan County west of Rinan; he often herded cattle in mountain streams, obtained two snakehead fish that transformed into iron, and thus cast a knife.',
    'Wen was originally a slave of the Yi chieftain Fan Zhi of Xijuan County west of Rinan; he often herded cattle in mountain streams, obtained two snakehead fish that transformed into iron, and thus cast a knife.',
  ],
  s0028: [
    'When it was cast, Wen cursed toward a stone, saying: "If in cutting this stone it breaks, Wen shall be king of this state.',
    'When it was cast, Wen cursed toward a stone, saying, "If in cutting this stone it breaks, Wen shall be king of this state.',
  ],
  s0029: [
    '" He then raised the knife and cut the stone—as if cutting dry grass; Wen alone marvelled at this in his heart.',
    '" he then raised the knife and cut the stone—as if cutting dry grass; Wen alone marvelled at this in his heart.',
  ],
  s0030: [
    'Fan Zhi often sent him on trading missions to Lin Yi, and thus taught the Lin Yi king to build palaces and military chariots and weapons—the king favored and trusted him.',
    'Fan Zhi often sent him on trading missions to Lin Yi, and thus taught the Lin Yi king to build palaces and military chariots and weapons—the king favored and trusted him.',
  ],
  s0031: [
    'Later he slandered the king\'s sons, and each fled to other states.',
    'Later he slandered the king\'s sons, and each fled to other states.',
  ],
  s0032: [
    'When the king died without heir, Wen feigned at a neighboring state to welcome the prince, put poison in syrup and killed him, then coerced the people of the state to install himself.',
    'When the king died without heir, Wen feigned at a neighboring state to welcome the prince, put poison in syrup and killed him, then coerced the people of the state to install himself.',
  ],
  s0033: [
    'He raised troops to attack neighboring small states and swallowed them all, having a host of forty to fifty thousand.',
    'He raised troops to attack neighboring small states and swallowed them all, having a host of forty to fifty thousand.',
  ],
  s0034: [
    'At the time Jiao Province Inspector Jiang Zhuang sent his intimates Han Ji and Xie Zhi in succession to supervise Rinan commandery—both greedy and cruel, and the states were vexed by them.',
    'At the time Jiao Province Inspector Jiang Zhuang sent his intimates Han Ji and Xie Zhi in succession to supervise Rinan commandery—both greedy and cruel, and the states were vexed by them.',
  ],
  s0035: [
    'In the third year of Yonghe under Emperor Mu, the court sent Xiahou Lan as administrator—invasive exactions were especially severe.',
    'In the third year of Yonghe under Emperor Mu, the court sent Xiahou Lan as administrator—invasive exactions were especially severe.',
  ],
  s0036: [
    'Lin Yi formerly had no farmland; coveting Rinan\'s fertile soil, it often wished to seize it—at this time, taking advantage of the people\'s resentment, it raised troops to raid Rinan, killed Lan, and sacrificed his corpse to Heaven.',
    'Lin Yi formerly had no farmland; coveting Rinan\'s fertile soil, it often wished to seize it—at this time, taking advantage of the people\'s resentment, it raised troops to raid Rinan, killed Lan, and sacrificed his corpse to Heaven.',
  ],
  s0037: [
    'It remained in Rinan three years, then returned to Lin Yi.',
    'It remained in Rinan three years, then returned to Lin Yi.',
  ],
  s0038: [
    'Later Jiao Province Inspector Zhu Fan sent Supervisor Liu Xiong to garrison Rinan; Wen again slaughtered and destroyed them.',
    'Later Jiao Province Inspector Zhu Fan sent Supervisor Liu Xiong to garrison Rinan; Wen again slaughtered and destroyed them.',
  ],
  s0039: [
    'Advancing to raid Jiude commandery, he ravaged officials and people.',
    'Advancing to raid Jiude commandery, he ravaged officials and people.',
  ],
  s0040: [
    'He sent envoys to inform Fan, wishing to take the Heng Mountains on Rinan\'s northern border as the boundary—Fan would not agree, and again sent Supervisors Tao Huan and Li Qu to attack him.',
    'He sent envoys to inform Fan, wishing to take the Heng Mountains on Rinan\'s northern border as the boundary—Fan would not agree, and again sent Supervisors Tao Huan and Li Qu to attack him.',
  ],
  s0041: [
    'Wen returned to Lin Yi, but soon again encamped in Rinan.',
    'Wen returned to Lin Yi, but soon again encamped in Rinan.',
  ],
  s0042: [
    'In the fifth year Wen died; his son Fo succeeded, still encamped in Rinan.',
    'In the fifth year Wen died; his son Fo succeeded, still encamped in Rinan.',
  ],
  s0043: [
    'General Who Conquers the West Huan Wen sent Supervisors Teng Jun and Jiuzhen Administrator Guan Sui to lead Jiao and Guang Province troops against him; Fo defended the city obstinately.',
    'General Who Conquers the West Huan Wen sent Supervisors Teng Jun and Jiuzhen Administrator Guan Sui to lead Jiao and Guang Province troops against him; Fo defended the city obstinately.',
  ],
  s0044: [
    'Sui ordered Jun to mass troops at the front; Sui himself led seven hundred elite soldiers over the ramparts from behind; Fo\'s host panicked and fled; Sui pursued to Lin Yi and Fo then requested surrender.',
    'Sui ordered Jun to mass troops at the front; Sui himself led seven hundred elite soldiers over the ramparts from behind; Fo\'s host panicked and fled; Sui pursued to Lin Yi and Fo then requested surrender.',
  ],
  s0045: [
    'At the beginning of Shengping under Emperor Ai, he again raided violently; Inspector Wen Fangzhi attacked and broke him.',
    'At the beginning of Shengping under Emperor Ai, he again raided violently; Inspector Wen Fangzhi attacked and broke him.',
  ],
  s0046: [
    'In the third year of Longan under Emperor An, Fo\'s grandson Xu Da again raided Rinan, seized Administrator Jiong Yuan, and further raided Jiude, seizing Administrator Cao Bing.',
    'In the third year of Longan under Emperor An, Fo\'s grandson Xu Da again raided Rinan, seized Administrator Jiong Yuan, and further raided Jiude, seizing Administrator Cao Bing.',
  ],
  s0047: [
    'Jiaozhi Administrator Du Yuan sent Protector Deng Yi and others to attack and break them, and Yuan was then made inspector.',
    'Jiaozhi Administrator Du Yuan sent Protector Deng Yi and others to attack and break them, and Yuan was then made inspector.',
  ],
  s0048: [
    'In the third year of Yixi, Xu Da again raided Rinan and killed the chief clerk; Yuan sent Coastal Protector Ruan Fei to attack and break him, slaying and capturing in great numbers.',
    'In the third year of Yixi, Xu Da again raided Rinan and killed the chief clerk; Yuan sent Coastal Protector Ruan Fei to attack and break him, slaying and capturing in great numbers.',
  ],
  s0049: [
    'In the ninth year Xu Da again raided Jiuzhen; Du Huiqi acting for the commandery fought him, beheading his son Jiaolong Wang Zhenzhi and his general Fan Jian and others, taking alive Xu Da\'s son Cheneng, and capturing over a hundred.',
    'In the ninth year Xu Da again raided Jiuzhen; Du Huiqi acting for the commandery fought him, beheading his son Jiaolong Wang Zhenzhi and his general Fan Jian and others, taking alive Xu Da\'s son Cheneng, and capturing over a hundred.',
  ],
  s0050: [
    'After Yuan died, Lin Yi year after year raided Rinan, Jiude and other commanderies, killing and ravaging greatly, and Jiao Province thus became weak and depleted.',
    'After Yuan died, Lin Yi year after year raided Rinan, Jiude and other commanderies, killing and ravaging greatly, and Jiao Province thus became weak and depleted.',
  ],
  s0051: [
    'When Xu Da died, his son Dizhen succeeded; his younger brother Dikai fled carrying their mother.',
    'When Xu Da died, his son Dizhen succeeded; his younger brother Dikai fled carrying their mother.',
  ],
  s0052: [
    'Dizhen, brooding that he could not tolerate his mother and younger brother, abandoned the state and went to Tianzhu, yielding the throne to his nephew—the chief minister Zang Xiao earnestly remonstrated but was not heeded.',
    'Dizhen, brooding that he could not tolerate his mother and younger brother, abandoned the state and went to Tianzhu, yielding the throne to his nephew—the chief minister Zang Xiao earnestly remonstrated but was not heeded.',
  ],
  s0053: [
    'The nephew once enthroned killed Zang Xiao; Zang Xiao\'s son in turn attacked and killed him, and enthroned Dikai\'s younger half-brother on his mother\'s side named Wen Di.',
    'The nephew once enthroned killed Zang Xiao; Zang Xiao\'s son in turn attacked and killed him, and enthroned Dikai\'s younger half-brother on his mother\'s side named Wen Di.',
  ],
  s0054: [
    'Wen Di was later killed by Funan prince Danggen Chun; the great minister Fan Zhunong quelled the disorder and installed himself as king.',
    'Wen Di was later killed by Funan prince Danggen Chun; the great minister Fan Zhunong quelled the disorder and installed himself as king.',
  ],
  s0055: [
    'When Zhunong died, his son Yang Mai succeeded.',
    'When Zhunong died, his son Yang Mai succeeded.',
  ],
  s0056: [
    'In the second year of Yongchu under Song, envoys were sent with tribute, and Yang Mai was made King of Lin Yi.',
    'In the second year of Yongchu under Song, envoys were sent with tribute, and Yang Mai was made King of Lin Yi.',
  ],
  s0057: [
    'When Yang Mai died, his son Dhuo succeeded; admiring his father, he again took the name Yang Mai.',
    'When Yang Mai died, his son Dhuo succeeded; admiring his father, he again took the name Yang Mai.',
  ],
  s0058: [
    'Its national customs: dwellings are raised pavilions called yulan, with doors and gates all facing north;',
    'Its national customs: dwellings are raised pavilions called yulan, with doors and gates all facing north;',
  ],
  s0059: [
    'they write on tree leaves as paper;',
    'they write on tree leaves as paper;',
  ],
  s0060: [
    'men and women all wrap their lower bodies in horizontal strips of kapok cloth, called ganman, also called duzman;',
    'men and women all wrap their lower bodies in horizontal strips of kapok cloth, called ganman, also called duzman;',
  ],
  s0061: [
    'they pierce ears and thread small rings;',
    'they pierce ears and thread small rings;',
  ],
  s0062: [
    'the noble wear leather sandals; the lowly go barefoot.',
    'the noble wear leather sandals; the lowly go barefoot.',
  ],
  s0063: [
    'From Lin Yi and Funan southward all states are thus.',
    'From Lin Yi and Funan southward all states are thus.',
  ],
  s0064: [
    'Its king wears dharma robes with jewelled chains, like the adornments of a Buddha image.',
    'Its king wears dharma robes with jewelled chains, like the adornments of a Buddha image.',
  ],
  s0065: [
    'Going out he rides an elephant, blows conch and beats drums, covers with a kapok-cloth umbrella, and uses kapok cloth for banners and flags.',
    'Going out he rides an elephant, blows conch and beats drums, covers with a kapok-cloth umbrella, and uses kapok cloth for banners and flags.',
  ],
  s0066: [
    'The state sets no penal code; those guilty are made to be trampled to death by elephants.',
    'The state sets no penal code; those guilty are made to be trampled to death by elephants.',
  ],
  s0067: [
    'Its great clans are called Brahmin.',
    'Its great clans are called Brahmin.',
  ],
  s0068: [
    'Marriage must take place in the eighth month; the woman first seeks the man—a lowly man and a noble woman.',
    'Marriage must take place in the eighth month; the woman first seeks the man—a lowly man and a noble woman.',
  ],
  s0069: [
    'Those of the same surname still marry one another; a Brahmin leads the groom to meet the bride, hands her over with clasped hands, and intones "Auspicious, auspicious"—this constitutes completion of the rite.',
    'Those of the same surname still marry one another; a Brahmin leads the groom to meet the bride, hands her over with clasped hands, and intones "Auspicious, auspicious"—this constitutes completion of the rite.',
  ],
  s0070: [
    'The dead are burned in the open wilds—called cremation.',
    'The dead are burned in the open wilds—called cremation.',
  ],
  s0071: [
    'Its widows live alone, hair loose until old age.',
    'Its widows live alone, hair loose until old age.',
  ],
  s0072: [
    'The king attends the Ni\'gan Way and casts gold and silver human images ten arm-spans around.',
    'The king attends the Ni\'gan Way and casts gold and silver human images ten arm-spans around.',
  ],
  s0073: [
    'At the beginning of Yuanjia Yang Mai raided Rinan and Jiude commanderies; Jiao Province Inspector Du Hongwen set up headquarters intending to attack, but hearing he would be replaced, stopped.',
    'At the beginning of Yuanjia Yang Mai raided Rinan and Jiude commanderies; Jiao Province Inspector Du Hongwen set up headquarters intending to attack, but hearing he would be replaced, stopped.',
  ],
  s0074: [
    'In the eighth year he again raided Jiude commandery, entering Sihui Estuary; Jiao Province Inspector Ruan Mizhi sent Squad Leader Xiang Daosheng to lead troops against him—they attacked Qu Li city but could not take it, then withdrew.',
    'In the eighth year he again raided Jiude commandery, entering Sihui Estuary; Jiao Province Inspector Ruan Mizhi sent Squad Leader Xiang Daosheng to lead troops against him—they attacked Qu Li city but could not take it, then withdrew.',
  ],
  s0075: [
    'Thereafter he sent envoys with tribute year after year, yet raiding and plunder never ceased.',
    'Thereafter he sent envoys with tribute year after year, yet raiding and plunder never ceased.',
  ],
  s0076: [
    'In the twenty-third year he had Jiao Province Inspector Tan Hezhi and General Who Quells Martial Affairs Zong Que attack them.',
    'In the twenty-third year he had Jiao Province Inspector Tan Hezhi and General Who Quells Martial Affairs Zong Que attack them.',
  ],
  s0077: [
    'Hezhi sent Army Adviser Xiao Jingxian as vanguard; Yang Mai hearing this was afraid and wished to deliver ten thousand jin of gold and a hundred thousand jin of silver and return the Rinan households he had seized—his great minister Zeng Sengda remonstrated and stopped him, and he then sent Grand Commander Fan Fulong to garrison Qu Li city on the northern border.',
    'Hezhi sent Army Adviser Xiao Jingxian as vanguard; Yang Mai hearing this was afraid and wished to deliver ten thousand jin of gold and a hundred thousand jin of silver and return the Rinan households he had seized—his great minister Zeng Sengda remonstrated and stopped him, and he then sent Grand Commander Fan Fulong to garrison Qu Li city on the northern border.',
  ],
  s0078: [
    'Jingxian attacked the city and took it, beheading Fulong\'s head; gold, silver, and miscellaneous goods captured were beyond counting.',
    'Jingxian attacked the city and took it, beheading Fulong\'s head; gold, silver, and miscellaneous goods captured were beyond counting.',
  ],
  s0079: [
    'Pressing the victory straight onward, they immediately took Lin Yi.',
    'Pressing the victory straight onward, they immediately took Lin Yi.',
  ],
  s0080: [
    'Yang Mai father and son both fled in person.',
    'Yang Mai father and son both fled in person.',
  ],
  s0081: [
    'The rare and wondrous things captured were all treasures without names.',
    'The rare and wondrous things captured were all treasures without names.',
  ],
  s0082: [
    'They also melted down the gold images and obtained several hundred thousand jin of gold.',
    'They also melted down the gold images and obtained several hundred thousand jin of gold.',
  ],
  s0083: [
    'Hezhi afterward died of illness, seeing a foreign god as the cause of harm.',
    'Hezhi afterward died of illness, seeing a foreign god as the cause of harm.',
  ],
  s0084: ['Kingdom of Funan', 'Kingdom of Funan'],
  s0085: [
    'Funan lay in the great bay west of the Southern Sea of Rinan commandery, about seven thousand li from Rinan, and over three thousand li southwest of Lin Yi.',
    'Funan lay in the great bay west of the Southern Sea of Rinan commandery, about seven thousand li from Rinan, and over three thousand li southwest of Lin Yi.',
  ],
  s0086: [
    'The capital was five hundred li from the sea.',
    'The capital was five hundred li from the sea.',
  ],
  s0087: [
    'There was a great river ten li wide, flowing northwest and entering the sea to the east.',
    'There was a great river ten li wide, flowing northwest and entering the sea to the east.',
  ],
  s0088: [
    'The state measured over three thousand li across; the land was low, wet, and broad and flat; climate and customs largely resembled Lin Yi.',
    'The state measured over three thousand li across; the land was low, wet, and broad and flat; climate and customs largely resembled Lin Yi.',
  ],
  s0089: [
    'It produced gold, silver, copper, tin, aloeswood, ivory, kingfishers, and five-colored parrots.',
    'It produced gold, silver, copper, tin, aloeswood, ivory, kingfishers, and five-colored parrots.',
  ],
  s0090: [
    'Three thousand li or more to its south was the kingdom of Dunsun, on a sea promontory, a thousand li in territory, the capital ten li from the sea.',
    'Three thousand li or more to its south was the kingdom of Dunsun, on a sea promontory, a thousand li in territory, the capital ten li from the sea.',
  ],
  s0091: [
    'There were five kings, all bound in submission to Funan.',
    'There were five kings, all bound in submission to Funan.',
  ],
  s0092: [
    'Dunsun\'s eastern border connected with Jiao Province; its western border adjoined Tianzhu and the states beyond Anxi\'s frontiers, trading back and forth.',
    'Dunsun\'s eastern border connected with Jiao Province; its western border adjoined Tianzhu and the states beyond Anxi\'s frontiers, trading back and forth.',
  ],
  s0093: [
    'The reason was that Dunsun curved inward into the sea over a thousand li—the rising sea had no shore, and ships had never been able to pass straight through.',
    'The reason was that Dunsun curved inward into the sea over a thousand li—the rising sea had no shore, and ships had never been able to pass straight through.',
  ],
  s0094: [
    'At its market east and west met in trade, with over ten thousand people daily.',
    'At its market east and west met in trade, with over ten thousand people daily.',
  ],
  s0095: [
    'Rare goods and precious commodities—there was nothing lacking.',
    'Rare goods and precious commodities—there was nothing lacking.',
  ],
  s0096: [
    'There was also a wine tree, resembling a pomegranate; its flower juice was gathered and left in jars, and in several days it became wine.',
    'There was also a wine tree, resembling a pomegranate; its flower juice was gathered and left in jars, and in several days it became wine.',
  ],
  s0097: [
    'Beyond Dunsun, on a great ocean isle, was also the kingdom of Piqian, eight thousand li from Funan.',
    'Beyond Dunsun, on a great ocean isle, was also the kingdom of Piqian, eight thousand li from Funan.',
  ],
  s0098: [
    'Tradition says its king was ten chi tall, his head three chi long; from antiquity he had not died, and none knew his years.',
    'Tradition says its king was ten chi tall, his head three chi long; from antiquity he had not died, and none knew his years.',
  ],
  s0099: [
    'The king was divine and sage; the good and evil of the people of the state and affairs yet to come—the king knew them all, and therefore none dared deceive.',
    'The king was divine and sage; the good and evil of the people of the state and affairs yet to come—the king knew them all, and therefore none dared deceive.',
  ],
  s0100: [
    'In the south they styled him the Long-Necked King.',
    'In the south they styled him the Long-Necked King.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_054_b1.mjs <translation.json>'
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
