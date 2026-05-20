#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'Huishen also said: "More than a thousand li east of Fusang is a land of women; their features are proper, their color very pure white, their bodies have hair, and their hair trails to the ground.',
    'Huishen also said that east of Fusang, a thousand li and more away, lay a realm of women—handsome of face, very fair in complexion, hairy of body, with hair that spilled to the ground.',
  ],
  s0602: [
    'When the second and third months come, they rush into the water and become pregnant; in the sixth or seventh month they bear children.',
    'In the second and third months they all plunge into the water and conceive; by the sixth or seventh month they give birth.',
  ],
  s0603: [
    'The women have no breasts on their chests; hair grows behind the nape, white at the root, and the hair contains sap with which they nurse their children—the children can walk at a hundred days, and in three or four years reach adulthood.',
    'Women have no breasts on the chest; behind the neck grows hair, white at the root, and sap within the hair feeds the child. At a hundred days the child can walk; in three or four years it is grown.',
  ],
  s0604: [
    'They startle and flee at the sight of people, and especially fear men.',
    'They startle at the sight of people and flee, and fear men above all.',
  ],
  s0605: [
    'They eat salt-grass like birds and beasts.',
    'They eat salt-grass as birds and beasts do.',
  ],
  s0606: [
    'Salt-grass leaves resemble wormwood, but its fragrance is salty.',
    'Salt-grass leaves resemble wormwood, yet its scent is salty and fragrant.',
  ],
  s0607: [
    '" In Tianjian 6, a man of Jin\'an crossed the sea and was blown by wind to an island; landing ashore, he found people dwelling there.',
    '" In Tianjian 6 a man of Jin\'an crossed the sea, was blown by wind to an island, went ashore, and found people living there.',
  ],
  s0608: [
    'The women were like those of China, but their speech could not be understood;',
    'The women resembled Chinese women, but their speech could not be understood;',
  ],
  s0609: [
    'the men had human bodies and dogs\' heads, their voices like barking.',
    'the men had human bodies and dogs\' heads, and barked when they spoke.',
  ],
  s0610: [
    'Their food included small beans; their clothing was like cloth.',
    'They ate small beans; their clothes were like cloth.',
  ],
  s0611: [
    'They built walls of earth, round in form, with doorways like burrows, it is said.',
    'They built earthen walls, round in shape, with doorways like burrows—or so it is said.',
  ],
  s0612: ['The Northwestern Barbarians', 'The Northwestern Barbarians'],
  s0613: [
    'The northwestern barbarians—in Han times Zhang Qian first opened the trail to the Western Regions, and Gan Ying reached the Western Sea; some sent hostages, some presented tribute; even then, though martial might was pushed to the limit, success came barely, and compared with earlier ages the reach was much greater.',
    'The northwestern barbarians: in Han, Zhang Qian first traced the Western Regions, and Gan Ying reached the Western Sea. Some sent hostages, some brought tribute. Even then, for all the empire\'s martial exertion, victory came only narrowly—and compared with earlier dynasties, the reach was vastly greater.',
  ],
  s0614: [
    'Under Wei the three powers stood like tripod legs, daily at war; after Jin pacified Wu there was little peace—only garrison officers of Wu and Ji were placed, and the states still did not submit.',
    'Under Wei the three realms stood tripod-locked, daily at war. After Jin pacified Wu there was scant peace; garrison officers alone were posted, and the states still did not submit.',
  ],
  s0615: [
    'Then came chaos in the Central Plains, barbarians rising one after another; the Western Regions and Jiangdong were cut off, and no embassies passed through multiple interpreters.',
    'Then the Central Plains fell into chaos and barbarians rose in succession; the Western Regions and Jiangdong were cut off, and no embassies came through layers of translation.',
  ],
  s0616: [
    'When Lü Guang marched on Kucha, it was likewise barbarians fighting barbarians—not China\'s intent.',
    'When Lü Guang marched on Kucha, it was barbarians cutting down barbarians—not China\'s design.',
  ],
  s0617: [
    'From then the states divided and merged; victors and vanquished, strong and weak—hard to record in detail.',
    'From then the states split and merged, strong and weak trading places—too much to record in full.',
  ],
  s0618: [
    'Bright pearls and kingfisher feathers, though piled in the rear palace;',
    'Bright pearls and kingfisher feathers might pile up in the rear palace,',
  ],
  s0619: [
    'fine horses named Pu Shao and Long Wen rarely entered the outer offices.',
    'yet fine horses like Pu Shao and Long Wen seldom reached the outer offices.',
  ],
  s0620: [
    'When Liang received the mandate, those observing the calendar and attending the imperial court were Qiuchi, Dangchang, Gaochang, Dengzhi, Henan, Kucha, Yutian, and Hua states.',
    'When Liang received the mandate, those who kept the calendar and came to court were Qiuchi, Dangchang, Gaochang, Dengzhi, Henan, Kucha, Yutian, and Hua.',
  ],
  s0621: [
    'Now I arrange their customs and present the "Account of the Northwestern Barbarians," thus.',
    'Now I gather their customs into the Account of the Northwestern Barbarians, thus.',
  ],
  s0622: ['Kingdom of Henan', 'Kingdom of Henan'],
  s0623: [
    'The kings of Henan originally came from the Xianbei Murong clan.',
    'The kings of Henan traced their line to the Xianbei Murong clan.',
  ],
  s0624: [
    'At the start, Murong Yiluoqian had two sons—the elder by a concubine was called Tuyuhun, the heir was called Hui.',
    'At first Murong Yiluoqian had two sons: the elder by a concubine was Tuyuhun; the heir was Hui.',
  ],
  s0625: [
    'When Yiluoqian died, Hui succeeded; Tuyuhun fled west to avoid him.',
    'When Yiluoqian died, Hui took the throne and Tuyuhun fled west to avoid him.',
  ],
  s0626: [
    'Hui pursued to keep him back, but cattle and horses all ran west and would not return—so Tuyuhun migrated up to Long, crossed Fuhan, passed southwest of Liangzhou, and settled at Chishui.',
    'Hui pursued to bring him back, but cattle and horses all ran west and would not return. Tuyuhun therefore moved up onto Long, crossed Fuhan, passed southwest of Liangzhou, and settled at Chishui.',
  ],
  s0627: [
    'The land lay south of Zhangye, west of Longxi, and south of the river—hence the name.',
    'The land lay south of Zhangye, west of Longxi, and south of the river—hence the name Henan.',
  ],
  s0628: [
    'Its borders reached Leichuan in the east, adjoined Yutian in the west, connected with Gaochang in the north, and linked to the Qin Mountains in the northeast—over a thousand li square, largely the ancient land of shifting sands.',
    'Its borders ran east to Leichuan, west to Yutian, north to Gaochang, and northeast to the Qin Mountains—over a thousand li on a side, largely the old land of shifting sands.',
  ],
  s0629: [
    'It lacked grass and trees, had little rain and flood; ice and snow persisted through the four seasons—only in the sixth and seventh months hail and rain were abundant;',
    'Grass and trees were scarce, rain and flood rare; ice and snow held through the four seasons—only in the sixth and seventh months did hail and rain fall heavily;',
  ],
  s0630: [
    'when skies cleared, wind blew sand and gravel, often blotting out the light.',
    'when skies cleared, wind whipped sand and gravel and often blotted out the light.',
  ],
  s0631: [
    'The land had wheat but no millet.',
    'The land grew wheat but not millet.',
  ],
  s0632: [
    'There was Qinghai Sea, several hundred li square—mares pastured beside it would bear foals; locals called them dragon stock, so the state had many fine horses.',
    'Qinghai Sea spread several hundred li across; mares pastured beside it would foal, and locals called the offspring dragon stock—hence the realm\'s many fine horses.',
  ],
  s0633: [
    'They had houses, mixed with hundred-son tents—that is, yurt tents.',
    'They had houses mixed with hundred-son tents—that is, felt yurts.',
  ],
  s0634: [
    'They wore small-sleeved robes, narrow trousers, and large-headed long-skirt caps.',
    'They wore small-sleeved robes, narrow trousers, and large-headed caps with long skirts.',
  ],
  s0635: [
    'Women wore their hair loose in braids.',
    'Women wore their hair loose and braided.',
  ],
  s0636: [
    'Later Tuyuhun\'s grandson Yeyan knew books and records well; he said his great-grandfather Yiluoqian was first enfeoffed as Duke of Changli—"I am the duke\'s grandson\'s son."',
    'Later Tuyuhun\'s grandson Yeyan was well versed in writing; he said his great-grandfather Yiluoqian was first enfeoffed Duke of Changli—"I am the duke\'s grandson\'s son."',
  ],
  s0637: [
    'By ritual one takes the paternal grandfather\'s name as the clan name—thus they surnamed Tuyuhun, which also became the state name.',
    'By ritual the paternal grandfather\'s name becomes the clan name; they therefore took Tuyuhun as surname and as the name of the state.',
  ],
  s0638: [
    'Down to his last descendant Achen, they first received Chinese office and rank.',
    'Not until the last descendant Achen did they first receive Chinese offices and ranks.',
  ],
  s0639: [
    'His younger brother\'s son Muyan, at the end of Song Yuanjia, styled himself King of Henan again.',
    'His nephew Muyan, at the end of Song Yuanjia, again styled himself King of Henan.',
  ],
  s0640: [
    'When Muyan died, his cousin Shibin succeeded; then they used written records, raised walls and cities, built palaces—and lesser kings all built residences.',
    'When Muyan died, his cousin Shibin succeeded. Then they used written records, raised walls and cities, built palaces, and lesser kings all built houses of their own.',
  ],
  s0641: [
    'Buddhism existed within the state.',
    'Buddhism was present in the realm.',
  ],
  s0642: [
    'When Shibin died, his son Duyihou succeeded;',
    'When Shibin died, his son Duyihou succeeded;',
  ],
  s0643: [
    'When Duyihou died, his son Xiuliudai succeeded.',
    'When Duyihou died, his son Xiuliudai succeeded.',
  ],
  s0644: [
    'In Qi Yongming, Xiuliudai was made Bearer of the Staff of Authority, Area Commander of West Qin, He, and Sha commanderies, General Who Pacifies the West, Protector of the Qiang, and Inspector of West Qin and He.',
    'In Qi Yongming, Xiuliudai was made bearer of the staff, area commander of West Qin, He, and Sha, General Who Pacifies the West, Protector of the Qiang, and inspector of West Qin and He.',
  ],
  s0645: ['Kingdom of Gaochang', 'Kingdom of Gaochang'],
  s0646: [
    'In Gaochang the Kan clan were lords; later Wuwei, brother of Hexi King Juqu Maoqian, attacked and broke them—their king Kan Shuang fled to Rouran.',
    'In Gaochang the Kan clan held sway; later Wuwei, brother of Hexi King Juqu Maoqian, attacked and overthrew them, and King Kan Shuang fled to Rouran.',
  ],
  s0647: [
    'Wuwei seized it and styled himself king; one generation and it perished.',
    'Wuwei seized the realm and styled himself king; one generation later it was gone.',
  ],
  s0648: [
    'The people again set up the Qu clan as kings—named Jia; Northern Wei granted him General of Chariots and Cavalry, Duke of Works, Area Commander of Qinzhou, Inspector of Qinzhou, and Duke of Jincheng with a state domain.',
    'The people again raised the Qu clan to kingship—Jia by name. Northern Wei made him General of Chariots and Cavalry, Duke of Works, area commander of Qinzhou, inspector of Qinzhou, and Duke of Jincheng with a state domain.',
  ],
  s0649: [
    'He ruled twenty-four years and died; his posthumous title was Bright Martial King.',
    'He ruled twenty-four years and died; his posthumous title was Bright Martial King.',
  ],
  s0650: [
    'His son Zijian—Bearer of the Staff, General of Flying Cavalry, Regular Attendant of the Scattered Cavalry, Area Commander of Guazhou, Inspector of Guazhou, Duke of Hexi with a state domain, Equal in Glory to the Three Dukes, King of Gaochang—succeeded.',
    'His son Zijian—bearer of the staff, General of Flying Cavalry, regular attendant of the Scattered Cavalry, area commander of Guazhou, inspector of Guazhou, Duke of Hexi with a state domain, equal in glory to the Three Dukes, King of Gaochang—succeeded.',
  ],
  s0651: [
    'The state roughly occupies the old land of Cheshi.',
    'The realm roughly occupies the old territory of Cheshi.',
  ],
  s0652: [
    'South it adjoins Henan, east it links to Dunhuang, west it reaches to Kucha, north it neighbors the Tiele.',
    'South it adjoins Henan, east it connects to Dunhuang, west it reaches Kucha, north it borders the Tiele.',
  ],
  s0653: [
    'It set up forty-six garrison towns—Jiaohe, Tiandi, Gaoning, Linchuan, Hengjie, Liupo, Wulin, Xinxing, Youning, Shichang, Dujin, Baili, and others—all garrison names.',
    'It maintained forty-six garrison towns—Jiaohe, Tiandi, Gaoning, Linchuan, Hengjie, Liupo, Wulin, Xinxing, Youning, Shichang, Dujin, Baili, and the rest.',
  ],
  s0654: [
    'Offices included four-garrison generals and miscellaneous-title generals, chief clerks, marshals, gate-section adjutants, central-army adjutants, liaison attendants, liaison clerks, advisers, commandants, and chief recorders.',
    'Offices included four-garrison generals and miscellaneous-title generals, chief clerks, marshals, gate-section adjutants, central-army adjutants, liaison attendants, liaison clerks, advisers, commandants, and chief recorders.',
  ],
  s0655: [
    'The people\'s speech was roughly like China\'s.',
    'The people\'s speech was roughly like that of China.',
  ],
  s0656: [
    'They had the Five Classics, dynastic histories, and collected works of the masters.',
    'They possessed the Five Classics, dynastic histories, and collected works of the masters.',
  ],
  s0657: [
    'Faces resembled Goguryeo\'s; hair was braided and hung down the back; they wore long-bodied small-sleeved robes and patterned trousers.',
    'Their faces resembled Goguryeo\'s; hair was braided and hung down the back; they wore long-bodied small-sleeved robes and patterned trousers.',
  ],
  s0658: [
    'Women braided their hair without letting it hang, and wore brocade patterned head ornaments, chains, rings, and bracelets.',
    'Women braided their hair without letting it hang, and wore brocade head ornaments, chains, rings, and bracelets.',
  ],
  s0659: [
    'Marriage had the six rites.',
    'Marriage followed the six rites.',
  ],
  s0660: [
    'The land was high and dry; they built cities of earth, framed houses of wood, and roofed them with earth.',
    'The land was high and dry; they built earthen cities, framed houses of wood, and roofed them with earth.',
  ],
  s0661: [
    'Cold and heat resembled Yizhou\'s.',
    'Cold and heat were much like Yizhou\'s.',
  ],
  s0662: [
    'They planted all nine grains; people mostly ate griddle-cakes and mutton and beef.',
    'They planted all nine grains; people mostly ate griddle-cakes, mutton, and beef.',
  ],
  s0663: [
    'They produced fine horses, grape wine, and rock salt.',
    'They produced fine horses, grape wine, and rock salt.',
  ],
  s0664: [
    'Grass and trees were abundant; grass seed pods were like cocoons, and the silk inside was like fine floss—called "white pile seed"; people often gathered them to weave cloth.',
    'Grass and trees were abundant; grass seed came in pods like cocoons, with silk inside fine as floss—called white pile seed—and people often gathered it to weave cloth.',
  ],
  s0665: [
    'The cloth was very soft and white, used in trade.',
    'The cloth was very soft and white and served in trade.',
  ],
  s0666: [
    'There were "court-birds"—each dawn they assembled before the royal hall in ranks, unafraid of people, and only dispersed after sunrise.',
    'There were court-birds: each dawn they gathered before the royal hall in ranks, unafraid of people, and only scattered after sunrise.',
  ],
  s0667: [
    'In Datong, Zijian sent envoys presenting singing-salt pillows, grapes, fine horses, carpets, and the like.',
    'In Datong, Zijian sent envoys with singing-salt pillows, grapes, fine horses, carpets, and the like.',
  ],
  s0668: [
    'When Northern Wei dwelt at Sanggan, Hua was still a small state, subject to Rouran.',
    'When Northern Wei dwelt at Sanggan, Hua was still a small state under Rouran.',
  ],
  s0669: [
    'Later it grew somewhat powerful, campaigning against neighboring states—Persia, Panpan, Kasmira, Karasahr, Kucha, Shule, Gumo, Yutian, Gupan, and others—opening territory over a thousand li.',
    'Later it grew stronger and campaigned against neighboring states—Persia, Panpan, Kasmira, Karasahr, Kucha, Shule, Gumo, Yutian, Gupan, and others—opening territory over a thousand li.',
  ],
  s0670: [
    'The land was warm; mountains, rivers, and trees were many; there were the five grains.',
    'The land was warm, with many mountains, rivers, and trees, and the five grains grew there.',
  ],
  s0671: [
    'The people used nets and mutton as food.',
    'The people lived on game taken in nets and on mutton.',
  ],
  s0672: [
    'Their beasts included lions and two-legged camels; wild asses had horns.',
    'Their beasts included lions and two-legged camels; wild asses bore horns.',
  ],
  s0673: [
    'All were skilled archers; they wore small-sleeved long-bodied robes, with belts of gold and jade.',
    'All were skilled archers; they wore small-sleeved long-bodied robes with belts of gold and jade.',
  ],
  s0674: [
    'Women wore furs; on their heads they carved wooden horns six feet long, adorned with gold and silver.',
    'Women wore furs and carved wooden horns six feet long for their heads, adorned with gold and silver.',
  ],
  s0675: [
    'There were few women; brothers shared wives.',
    'Women were scarce; brothers shared a wife.',
  ],
  s0676: [
    'There were no walled cities—they lived in felt tents, doors opening east.',
    'They had no walled cities and lived in felt tents with doors facing east.',
  ],
  s0677: [
    'Their king sat on a golden bed, turning with the Grand Year Star, and received guests seated together with his wife.',
    'Their king sat on a golden bed that turned with the Grand Year Star and received guests seated beside his wife.',
  ],
  s0678: [
    'They had no writing; wood served as tokens.',
    'They had no writing and used wood for tokens.',
  ],
  s0679: [
    'When dealing with neighboring states, they had neighboring barbarians write in barbarian script, sheepskin serving as paper.',
    'When dealing with neighbors, they had neighboring barbarians write in barbarian script on sheepskin for paper.',
  ],
  s0680: [
    'There were no official posts.',
    'They had no official posts.',
  ],
  s0681: [
    'They served Heaven-god and Fire-god; each day they left the door to worship the gods before eating.',
    'They served Heaven-god and Fire-god; each day they went out to worship before eating.',
  ],
  s0682: [
    'Their kneeling bow was one prostration and stop.',
    'Their kneeling bow was a single prostration and no more.',
  ],
  s0683: [
    'Burial used wooden coffins.',
    'Burial was in wooden coffins.',
  ],
  s0684: [
    'When parents died, their sons cut off one ear; mourning ended as soon as burial was done.',
    'When parents died, sons cut off one ear; mourning ended as soon as burial was finished.',
  ],
  s0685: [
    'Their speech required Henan people as interpreters before it could be understood.',
    'Their speech had to be rendered by Henan interpreters before it could be understood.',
  ],
  s0686: ['Kingdom of Zhou Guke', 'Kingdom of Zhou Guke'],
  s0687: [
    'Zhou Guke was a small state beside Hua.',
    'Zhou Guke was a small state beside Hua.',
  ],
  s0688: [
    'In Putong 1, envoys came with Hua to present local products.',
    'In Putong 1 envoys came with Hua to present local products.',
  ],
  s0689: ['Kingdom of He Batan', 'Kingdom of He Batan'],
  s0690: [
    'He Batan was also a small state beside Hua.',
    'He Batan was also a small state beside Hua.',
  ],
  s0691: [
    'All states beside Hua—clothing and faces all matched Hua\'s.',
    'All states beside Hua wore the same clothes and looked the same as Hua.',
  ],
  s0692: [
    'In Putong 1, envoys came with Hua\'s embassy to present local products.',
    'In Putong 1 envoys came with Hua\'s embassy to present local products.',
  ],
  s0693: ['Kingdom of Hu Midan', 'Kingdom of Hu Midan'],
  s0694: [
    'Hu Midan was also a small state beside Hua.',
    'Hu Midan was also a small state beside Hua.',
  ],
  s0695: [
    'In Putong 1, envoys came with Hua\'s embassy to present local products.',
    'In Putong 1 envoys came with Hua\'s embassy to present local products.',
  ],
  s0696: ['Kingdom of Baiti', 'Kingdom of Baiti'],
  s0697: [
    'In Baiti the king\'s surname was Zhi, name Shi Jiyi; his ancestors were probably a separate branch of the Xiongnu barbarians.',
    'In Baiti the king\'s surname was Zhi and his name Shi Jiyi; his ancestors were likely a separate branch of the Xiongnu barbarians.',
  ],
  s0698: [
    'In Han, Guan Ying fought the Xiongnu and cut down one Baiti horseman.',
    'In Han, Guan Ying fought the Xiongnu and cut down one Baiti horseman.',
  ],
  s0699: [
    'Now it lies east of Hua, six days\' travel from Hua; west it reaches to Persia.',
    'Now it lies east of Hua, six days\' travel away; west it reaches as far as Persia.',
  ],
  s0700: [
    'The land produced millet, wheat, melons, and fruits; food was roughly like Hua\'s.',
    'The land produced millet, wheat, melons, and fruits; food was much like Hua\'s.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_054_b7.mjs <translation.json>'
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
