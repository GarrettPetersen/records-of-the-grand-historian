#!/usr/bin/env node
/**
 * Generate liaoshi ch.032 translation patch batches (s0001–s0159).
 * Run: node translations/patches/_gen-liaoshi-032.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const part1 = [
  ['s0001', 'Management of Guards, Part 2 ○ Mobile Camps', 'Management of Guards, Part 2 ○ Mobile Camps'],
  ['s0002', 'Zhou Offices earth-gnomon method: sun east, evening shadows much wind;', '《Zhou Offices》 on the earth-gnomon method: when the sun is east, evening shadows bring much wind;'],
  ['s0003', 'sun north, shadows long much cold.', 'When the sun is north, long shadows bring much cold.'],
  ['s0004', 'Between heaven and earth, wind and climate differ in what suits; people living among them each suit their convenience.', 'Between heaven and earth, wind and climate differ in what suits each region; people living among them each adapt to what is convenient.'],
  ['s0005', 'The king accordingly regulates them through the three powers.', 'The king accordingly regulates them through the three powers.'],
  ['s0006', 'South of the Great Wall, much rain and much heat; its people eat by plowing and sowing, dress in mulberry and hemp, dwell in palaces and houses, govern by walls and moats.', 'South of the Great Wall there is much rain and much heat; its people eat by plowing and sowing, dress in mulberry and hemp, dwell in palaces and houses, and govern by walls and moats.'],
  ['s0007', 'Between the great desert, much cold and much wind; they eat by pasturing livestock and hunting-fishing, dress in fur and hide, move with the seasons, wagon and horse as home.', 'In the great desert there is much cold and much wind; people eat by pasturing livestock and by hunting and fishing, dress in fur and hide, move with the seasons, and make wagon and horse their home.'],
  ['s0008', 'This is how heaven\'s seasons and earth\'s advantages divide north and south.', 'This is how heaven\'s seasons and earth\'s advantages divide north and south.'],
  ['s0009', 'The Liao state wholly possessed the great desert, gradually enclosing Great Wall territory, governing according to what suited.', 'The Liao state wholly possessed the great desert and gradually enclosed territory within the Great Wall, governing according to what suited each region.'],
  ['s0010', 'Autumn and winter avoiding cold, spring and summer avoiding heat, following water and grass to hunt-fish—yearly as the norm.', 'In autumn and winter they avoided the cold; in spring and summer they avoided the heat; they followed water and grass to hunt and fish—this was the yearly norm.'],
  ['s0011', 'Each of the four seasons had its traveling residence, called "napo" (seasonal imperial encampment).', 'Each of the four seasons had its traveling residence, called napo (seasonal imperial encampment).'],
  ['s0012', 'Spring napo: called Yazi River Marsh.', 'The spring napo was called Yazi River Marsh.'],
  ['s0013', 'The emperor in the first ten days of the first month raised the tented camp; about sixty days before arriving.', 'In the first ten days of the first month the emperor raised the tented camp and needed about sixty days to arrive.'],
  ['s0014', 'Before swans arrived, pitched tents on the ice, broke ice to take fish; when ice melted, then released hawk and falcon to catch geese and wild geese.', 'Before swans arrived they pitched tents on the ice and broke the ice to take fish; when the ice melted they released hawks and falcons to catch geese and wild geese.'],
  ['s0015', 'Out at dawn, back at dusk, engaged in archery hunting.', 'They went out at dawn and returned at dusk, engaged in bow hunting.'],
  ['s0016', 'Yazi River Marsh twenty li east-west, thirty li north-south, thirty-five li northeast of Changchun prefecture; on all sides sand dunes, many elm, willow, and apricot groves.', 'Yazi River Marsh was twenty li east to west and thirty li north to south, thirty-five li northeast of Changchun prefecture; on all four sides were sand dunes, with many elm, willow, and apricot groves.'],
  ['s0017', 'When the emperor arrived each time, attendants all wore ink-green clothing, each prepared one linked hammer, one vessel of hawk food, one goose-stabbing awl; around the marsh they stood in ranks spaced five to seven paces apart.', 'Whenever the emperor arrived, all attendants wore ink-green clothing and each carried one linked hammer, one vessel of hawk food, and one goose-stabbing awl; they stood in ranks around the marsh, five to seven paces apart.'],
  ['s0018', 'The emperor wore cap and kerchief, seasonal dress, jade belt tied, and watched from upwind.', 'The emperor wore cap and kerchief, seasonal dress, and a jade belt, and watched from upwind.'],
  ['s0019', 'Where there were geese a flag was raised; scout riders galloped to report; distant camps beat drums.', 'Where geese appeared a flag was raised; scout riders galloped to report; distant camps beat drums.'],
  ['s0020', 'Geese startled and rose; left and right surrounding riders all raised banners to herd them.', 'When geese were startled into flight, the surrounding riders on left and right all raised banners to herd them.'],
  ['s0021', 'The Five Workshops presented the eastern-sea green falcon; bowing they handed it to the emperor to release.', 'The Five Workshops presented the eastern-sea green falcon; bowing, they handed it to the emperor to release.'],
  ['s0022', 'The falcon seized a goose and it fell; when force was insufficient, those standing nearest raised the awl to stab the goose and took the brain to feed the falcon.', 'When the falcon seized a goose and it fell but its strength was insufficient, those standing nearest raised their awls to stab the goose and took the brain to feed the falcon.'],
  ['s0023', 'Those who rescued the falcon were rewarded by rule with silver and silk.', 'Those who rescued the falcon were rewarded by rule with silver and silk.'],
  ['s0024', 'The emperor receiving the lead goose offered it at the temple; all ministers presented wine and fruit, music was raised.', 'When the emperor received the lead goose he offered it at the temple; all ministers presented wine and fruit, and music was performed.'],
  ['s0025', 'They toasted each other in turn, spoke congratulatory words; all stuck goose feathers in the head for merriment.', 'They toasted one another in turn and spoke words of congratulation; all stuck goose feathers in their hair for merriment.'],
  ['s0026', 'Wine was bestowed on followers; the feathers were scattered broadly.', 'Wine was bestowed on followers, and the feathers were scattered broadly.'],
  ['s0027', 'Archery hunting, netting, and angling—when spring ended they returned.', 'They hunted with bow, net, and line; when spring ended they returned.'],
  ['s0028', 'Summer napo: no fixed place, mostly at Tuer Mountain.', 'The summer napo had no fixed place and was mostly at Tuer Mountain.'],
  ['s0029', 'Daozong each year first visited Black Mountain, paid respects at Emperors Shengzong and Xingzong\'s tombs, and rewarded golden lotus.', 'Each year Daozong first visited Black Mountain, paid respects at the tombs of Emperors Shengzong and Xingzong, and rewarded golden lotus.'],
  ['s0030', 'Then visited Zi River to escape summer heat.', 'Then he visited Zi River to escape the summer heat.'],
  ['s0031', 'Tuer Mountain is three hundred li northeast of Black Mountain, near Mantou Mountain.', 'Tuer Mountain lies three hundred li northeast of Black Mountain, near Mantou Mountain.'],
  ['s0032', 'Black Mountain is thirteen li north of Qing prefecture; above it is a pool, and in the pool are golden lotus.', 'Black Mountain is thirteen li north of Qing prefecture; on its summit is a pool, and in the pool are golden lotus.'],
  ['s0033', 'Zi River is three hundred li northeast of Tuer Mountain.', 'Zi River is three hundred li northeast of Tuer Mountain.'],
  ['s0034', 'West Mountain of Huai prefecture has a Cool Breeze Hall, also a traveling residence for escaping summer heat.', 'West Mountain of Huai prefecture has a Cool Breeze Hall, also used as a traveling residence to escape summer heat.'],
  ['s0035', 'In the middle ten days of the fourth month the tented camp was raised; an auspicious site chosen as the cool retreat; arrived in the last ten days of the fifth month and the first ten days of the sixth month.', 'In the middle ten days of the fourth month the tented camp was raised and an auspicious site chosen as the cool retreat; they arrived in the last ten days of the fifth month or the first ten days of the sixth month.'],
  ['s0036', 'Dwelling fifty days.', 'They dwelt there fifty days.'],
  ['s0037', 'With northern and southern officials they deliberated state affairs; on leisure days they hunted.', 'With northern and southern officials they deliberated state affairs; on leisure days they hunted.'],
  ['s0038', 'In the middle ten days of the seventh month they departed.', 'In the middle ten days of the seventh month they departed.'],
  ['s0039', 'Autumn napo: called Crouching Tiger Forest.', 'The autumn napo was called Crouching Tiger Forest.'],
  ['s0040', 'In the middle ten days of the seventh month, from the cool retreat the tented camp was raised; entering the mountains to shoot deer and tiger.', 'In the middle ten days of the seventh month they raised the tented camp from the cool retreat and entered the mountains to shoot deer and tigers.'],
  ['s0041', 'The forest is fifty li northwest of Yong prefecture.', 'The forest is fifty li northwest of Yong prefecture.'],
  ['s0042', 'Once a tiger occupied the forest and harmed residents\' livestock.', 'Once a tiger occupied the forest and harmed the livestock of local residents.'],
  ['s0043', 'Emperor Jingzong led several riders to hunt there; the tiger crouched in the grass, trembling and not daring to look up; the emperor spared it, and so it was named Crouching Tiger Forest.', 'Emperor Jingzong led several riders to hunt there; the tiger crouched in the grass, trembling and not daring to look up; the emperor spared it, and so it was named Crouching Tiger Forest.'],
  ['s0044', 'Each year the imperial carriage arrived.', 'Each year the imperial carriage arrived.'],
  ['s0045', 'From the imperial clan downward they were distributed along the marsh water; toward midnight when deer drank salt water, hunters blew horns imitating deer calls; when gathered they shot them.', 'From the imperial clan downward they were posted along the marsh water; toward midnight, when deer came to drink salt water, hunters blew horns imitating deer calls; when the deer gathered they shot them.'],
  ['s0046', 'This was called "licking-salt deer" and also called "calling deer."', 'This was called "licking-salt deer" and also called "calling deer."'],
  ['s0047', 'Winter napo: called Guangping Marsh.', 'The winter napo was called Guangping Marsh.'],
  ['s0048', 'Thirty li southeast of Yong prefecture, originally named White Horse Marsh.', 'It lay thirty li southeast of Yong prefecture and was originally named White Horse Marsh.'],
  ['s0049', 'More than twenty li east-west, more than ten li north-south.', 'It was more than twenty li east to west and more than ten li north to south.'],
  ['s0050', 'The ground very level and open; on all four sides sand and gravel; many elm and willow trees.', 'The ground was very level and open; on all four sides were sand and gravel; there were many elm and willow trees.'],
  ['s0051', 'Its land was rich in sand; in winter months somewhat warm; the tented camp mostly wintered here, meeting northern and southern great ministers to deliberate state affairs, sometimes going out to hunt and drill troops, also receiving tribute gifts from the Southern Song and various states.', 'Its land was rich in sand and in the winter months somewhat warm; the tented camp mostly wintered here, meeting northern and southern great ministers to deliberate state affairs, sometimes going out to hunt and drill troops, and also receiving tribute gifts from the Southern Song and various states.'],
  ['s0052', 'The emperor\'s tented camp used spears as a hard palisade, linked with rope of wool.', 'The emperor\'s tented camp used spears as a hard palisade, linked with wool rope.'],
  ['s0053', 'Beneath each spear one black felt umbrella, to shelter guards from wind and snow.', 'Beneath each spear stood one black felt umbrella to shelter guards from wind and snow.'],
  ['s0054', 'Outside the spears one layer of small felt tents; each tent five men, each holding weapons as the forbidden perimeter.', 'Outside the spears was one layer of small felt tents; each tent held five men, each holding weapons as the forbidden perimeter.'],
  ['s0055', 'To the south was the Audience Hall; about two li north of the hall was the Longevity and Tranquility Hall—both wooden pillars and bamboo rafters, felt as covering, painted wrapped pillars, brocade as wall hangings, with crimson embroidery on the lintel.', 'To the south was the Audience Hall; about two li north of the hall was the Longevity and Tranquility Hall—both had wooden pillars and bamboo rafters, felt coverings, painted wrapped pillars, brocade wall hangings, and crimson embroidery on the lintel.'],
  ['s0056', 'Also yellow cloth embroidered with dragons as ground screens; windows and lattice all of felt, coated with yellow oiled silk.', 'Yellow cloth embroidered with dragons served as ground screens; windows and lattice were all of felt, coated with yellow oiled silk.'],
  ['s0057', 'The base more than a foot high; the side corridors also covered in felt, without doors or gates.', 'The base stood more than a foot high; the side corridors were also covered in felt and had no doors or gates.'],
  ['s0058', 'North of the Audience Hall was a deerskin tent; north of the tent ranks was the Eight Directions Public Hall.', 'North of the Audience Hall was a deerskin tent; north of the tent ranks was the Eight Directions Public Hall.'],
  ['s0059', 'North of the Longevity and Tranquility Hall was the Everlasting Spring Tent, guarded by the hard palisade.', 'North of the Longevity and Tranquility Hall was the Everlasting Spring Tent, guarded by the hard palisade.'],
  ['s0060', 'The palace used four thousand Khitan soldiers; each day a rotating thousand stood duty.', 'The palace used four thousand Khitan soldiers; each day a rotating thousand stood on duty.'],
  ['s0061', 'Outside the forbidden perimeter spears were pitched as a camp; at night spears were pulled and the camp shifted to shield the sleeping tent.', 'Outside the forbidden perimeter spears were pitched as a camp; at night the spears were pulled and the camp shifted to shield the sleeping tent.'],
  ['s0062', 'Caltrops surrounded the perimeter; outside were outposts, relay bells for night guard.', 'Caltrops surrounded the perimeter; outside were outposts with relay bells for night guard.'],
  ['s0063', 'Each year the four seasons cycled and began again.', 'Each year the four seasons cycled and began again.'],
  ['s0064', 'When the emperor toured the four seasons, Khitan great and small inner and outer officials and all those on corvée rotation, and the hundred offices under the Han Chinese Xuanhui Court, all followed.', 'When the emperor toured the four seasons, Khitan officials great and small, inner and outer, and all those on corvée rotation, and the hundred offices under the Han Chinese Xuanhui Court, all followed.'],
  ['s0065', 'The Han Chinese Bureau of Military Affairs and Secretariat only detached one chancellor, two chief and vice chief clerks of the Bureau of Military Affairs, ten clerks, one Secretariat clerk, and one person selected from the Censorate and Court of Judicial Review to escort.', 'The Han Chinese Bureau of Military Affairs and Secretariat only detached one chancellor, two chief and vice chief clerks of the Bureau of Military Affairs, ten clerks, one Secretariat clerk, and one person selected from the Censorate and Court of Judicial Review to escort.'],
  ['s0066', 'Each year in the first ten days of the first month the imperial carriage set out.', 'Each year in the first ten days of the first month the imperial carriage set out.'],
  ['s0067', 'From the chancellor downward they returned to Central Capital to remain on guard, conducting all Han Chinese public affairs.', 'From the chancellor downward they returned to Central Capital to remain on guard and conduct all Han Chinese public affairs.'],
  ['s0068', 'Appointing and promoting officials only issued provisional appointment slips by authority; they waited to meet at the traveling council at the napo, receive instructions, and issue formal patents and edicts.', 'Appointing and promoting officials only issued provisional appointment slips by authority; they waited to meet at the traveling council at the napo, receive instructions, and issue formal patents and edicts.'],
  ['s0069', 'Civil officials of county magistrate, registrar, and below were no longer reported to the throne; the Secretariat made selections; military officials had to be reported.', 'Civil officials of county magistrate, registrar, and below were no longer reported to the throne—the Secretariat made selections; military officials had to be reported.'],
  ['s0070', 'In the fifth month, at the cool-retreat traveling residence, southern and northern officials met in council.', 'In the fifth month, at the cool-retreat traveling residence, southern and northern officials met in council.'],
  ['s0071', 'In the tenth month, at the winter traveling residence, it was likewise.', 'In the tenth month, at the winter traveling residence, it was likewise.'],
  ['s0072', 'Tribal Divisions, Part 1', 'Tribal Divisions, Part 1'],
  ['s0073', 'A tribal group was called a bu; a clan lineage was called a zu.', 'A tribal group was called a bu; a clan lineage was called a zu.'],
  ['s0074', 'Khitan ancient custom: divided land to dwell, united clans to reside.', 'By ancient Khitan custom they divided land to dwell and united clans to reside.'],
  ['s0075', 'Some had a clan but were a bu—such were the Five Courts and Six Courts;', 'Some had a clan but were organized as a bu—such were the Five Courts and Six Courts;'],
  ['s0076', 'some had a bu but were a zu—such were the Xi King and Shimo;', 'some had a bu but were organized as a zu—such were the Xi King and Shimo;'],
  ['s0077', 'some had a bu but not a zu—such were Telite Mian, Shaowa, and Heshu;', 'some had a bu but not a zu—such were Telite Mian, Shaowa, and Heshu;'],
  ['s0078', 'some had a zu but not a bu—such were the Yaolian Nine Accounts and the Imperial Clan Three Father Houses.', 'some had a zu but not a bu—such were the Yaolian Nine Accounts and the Imperial Clan Three Father Houses.'],
  ['s0079', 'Qishou\'s eight bu were invaded by Goryeo and Rouran; only about ten thousand mouths attached to Northern Wei.', 'Qishou\'s eight bu were invaded by Goryeo and Rouran; only about ten thousand mouths attached to Northern Wei.'],
  ['s0080', 'Barely had they multiplied when Northern Qi invaded and carried off men and women numbering more than one hundred thousand mouths.', 'Barely had they multiplied when Northern Qi invaded and carried off men and women numbering more than one hundred thousand mouths.'],
  ['s0081', 'Then they were pressed by the Turks.', 'Then they were pressed by the Turks.'],
  ['s0082', 'Dwelling with Goryeo, not reaching ten thousand households.', 'Dwelling with Goryeo, they did not reach ten thousand households.'],
  ['s0083', 'The bu were scattered and dispersed, no longer the ancient eight bu.', 'The bu were scattered and dispersed, no longer the ancient eight bu.'],
  ['s0084', 'Another bu had subjects attaching to the Turks; those attaching inward to Sui dwelt along the Heichen River.', 'Another bu had subjects attaching to the Turks; those attaching inward to Sui dwelt along the Heichen River.'],
  ['s0085', 'The bu gradually grew numerous, divided into ten bu, with territory more than five hundred li in eastern Liaoxi.', 'The bu gradually grew numerous, divided into ten bu, with territory more than five hundred li in eastern Liaoxi.'],
  ['s0086', 'In Tang times the Dahe clan still had eight bu, while Songmo and Xuan prefectures were separately established—also ten bu.', 'In Tang times the Dahe clan still had eight bu, while Songmo and Xuan prefectures were separately established—also ten bu.'],
  ['s0087', 'The Yaolian clan inherited the scattered remnants after Wanrong and Ketuyu\'s defeat and again made eight bu, yet Yaolian and Yilie separately emerged—again ten bu.', 'The Yaolian clan inherited the scattered remnants after Wanrong and Ketuyu\'s defeat and again made eight bu, yet Yaolian and Yilie separately emerged—again ten bu.'],
  ['s0088', 'Khan Zuwu divided them into twenty bu, and the Khitan first grew great.', 'Khan Zuwu divided them into twenty bu, and the Khitan first grew great.'],
  ['s0089', 'At Liao Taizu, the nine accounts and three-father-house clans were further divided into twenty bu.', 'At Liao Taizu the nine accounts and three-father-house clans were further divided into twenty bu.'],
  ['s0090', 'In Emperor Shengzong\'s time sixteen were newly placed, eighteen more added, together with the old totaling fifty-four bu;', 'In Emperor Shengzong\'s time sixteen were newly placed and eighteen more added, together with the old totaling fifty-four bu;'],
  ['s0091', 'within were the Balin and Yishi national-uncle clans, outside were ten dependent bu—how flourishing!', 'within were the Balin and Yishi national-uncle clans; outside were ten dependent bu—how flourishing!'],
  ['s0092', 'Those whose clan lineages can be known are briefly set out in the "Imperial Clan" and "Consort Kin" tables.', 'Those whose clan lineages can be known are briefly set out in the "Imperial Clan" and "Consort Kin" tables.'],
  ['s0093', 'The remaining Five Courts, Six Courts, and Yishi bu only show Yigu, Saliben, and Niela; the Wugu bu only shows Salibu and Niele; the Tulubu and Tuju bu only show Taguli and Hangwo—all brothers.', 'The remaining Five Courts, Six Courts, and Yishi bu only show Yigu, Saliben, and Niela; the Wugu bu only shows Salibu and Niele; the Tulubu and Tuju bu only show Taguli and Hangwo—all brothers.'],
  ['s0094', 'The Xi King\'s bu Shise and Zheli were subject-lords.', 'The Xi King\'s bu Shise and Zheli were subject-lords.'],
  ['s0095', 'The Pin bu had Nana; the Chute bu had Wa.', 'The Pin bu had Nana; the Chute bu had Wa.'],
  ['s0096', 'The rest of the genealogies and names are all broadly without what can be examined.', 'The rest of the genealogies and names are all broadly without what can be examined.'],
  ['s0097', 'The old "Treatise" says: "At the beginning of the Khitan, they dwelt in grass and lived in the wild, without fixed place.', 'The old "Treatise" says: "At the beginning of the Khitan they dwelt in grass and lived in the wild, without fixed place.'],
  ['s0098', 'From when Nieli first established the bu system, each had allotted land.', 'From when Nieli first established the bu system, each had allotted land.'],
  ['s0099', 'At Taizu\'s rise, because the Yilie bu was strong and flourishing, it was divided into Five Courts and Six Courts.', 'At Taizu\'s rise, because the Yilie bu was strong and flourishing, it was divided into Five Courts and Six Courts.'],
  ['s0100', 'Below the Xi Six bu, most were established from captured and surrendered peoples.', 'Below the Xi Six bu, most were established from captured and surrendered peoples.'],
];

const part2 = [
  ['s0101', 'Those bearing armor as victorious troops were entered in military registers, assigned to the various routes\' xiangwen, commanders-in-chief, and pacification commissioners.', 'Those bearing armor as victorious troops were entered in military registers and assigned to the various routes\' xiangwen, commanders-in-chief, and pacification commissioners.'],
  ['s0102', 'Those dwelling within the interior seasonally plowed and pastured on the level plains.', 'Those dwelling within the interior seasonally plowed and pastured on the level plains.'],
  ['s0103', 'Border defense levy households: their livelihood depended on pasturing livestock, combing wool and drinking fermented milk for clothing and food.', 'Border defense levy households: their livelihood depended on pasturing livestock, combing wool and drinking fermented milk for clothing and food.'],
  ['s0104', 'Each kept the old ways, accustomed to labor, not seeing exotic splendors and shifting.', 'Each kept the old ways, accustomed to labor, not seeing exotic splendors and shifting.'],
  ['s0105', 'Thus families were provided for and people sufficient, military readiness complete.', 'Thus families were provided for and people sufficient, and military readiness was complete.'],
  ['s0106', 'In the end they glared like tigers on all four sides, strong states weak and attached; east beyond Panmu, west beyond the drifting sands—all did not fail to submit.', 'In the end they glared like tigers on all four sides, strong states weak and attached; east beyond Panmu, west beyond the drifting sands—all did not fail to submit.'],
  ['s0107', 'The bu were truly its claws and teeth.', 'The bu were truly its claws and teeth."'],
  ['s0108', 'Ancient eight bu: Ximowanbu.', 'Ancient eight bu: Ximowanbu.'],
  ['s0109', 'Hedahubu.', 'Hedahubu.'],
  ['s0110', 'Fufuyubu.', 'Fufuyubu.'],
  ['s0111', 'Yulingbu.', 'Yulingbu.'],
  ['s0112', 'Rilianbu.', 'Rilianbu.'],
  ['s0113', 'Pijiebu.', 'Pijiebu.'],
  ['s0114', 'Libu.', 'Libu.'],
  ['s0115', 'Tuliuyubu.', 'Tuliuyubu.'],
  ['s0116', 'The Khitan forebears: Khan Qishou, who bore eight sons.', 'The Khitan forebears: Khan Qishou, who bore eight sons.'],
  ['s0117', 'Afterward the clan kindred gradually flourished, divided into eight bu, dwelling between the Songmo.', 'Afterward the clan kindred gradually flourished and divided into eight bu, dwelling in the Songmo region.'],
  ['s0118', 'Today on Muye Mountain in Yong prefecture is the Khitan ancestral temple; images of Khan Qishou, the khatun, and the eight sons are there.', 'Today on Muye Mountain in Yong prefecture is the Khitan ancestral temple; images of Khan Qishou, the khatun, and the eight sons are there.'],
  ['s0119', 'West of the Huang River, north of the Tu River—that was Khan Qishou\'s old territory.', 'West of the Huang River and north of the Tu River—that was Khan Qishou\'s old territory.'],
  ['s0120', 'Sui Khitan ten bu: at the end of Northern Wei, Mohefuheyu feared invasion by Goryeo and Rouran, led three thousand chariots and ten thousand mouths inward to attach, then left Khan Qishou\'s old territory and dwelt east of the Bailang River.', 'Sui Khitan ten bu: at the end of Northern Wei, Mohefuheyu feared invasion by Goryeo and Rouran, led three thousand chariots and ten thousand mouths inward to attach, then left Khan Qishou\'s old territory and dwelt east of the Bailang River.'],
  ['s0121', 'Northern Qi Emperor Wenxuan came to invade from three routes out of Ping prefecture, capturing men and women more than one hundred thousand mouths, distributing them among the various prefectures.', 'Northern Qi Emperor Wenxuan came to invade from three routes out of Ping prefecture, capturing men and women more than one hundred thousand mouths and distributing them among the various prefectures.'],
  ['s0122', 'Again pressed by the Turks, ten thousand households dwelt as guests in Goryeo territory.', 'Again pressed by the Turks, ten thousand households dwelt as guests in Goryeo territory.'],
  ['s0123', 'In Sui Kaihuang year 4, all the Mohefuhe submitted at the border in full force and were permitted to dwell in the Bailang old territory.', 'In Sui Kaihuang year 4, all the Mohefuhe submitted at the border in full force and were permitted to dwell in the Bailang old territory.'],
  ['s0124', 'Another bu dwelling as guests in Goryeo, such as Chufu and others, led the multitude inward to attach; an edict placed them north of the Duxina commandery.', 'Another bu dwelling as guests in Goryeo, such as Chufu and others, led the multitude inward to attach; an edict placed them north of the Duxina commandery.'],
  ['s0125', 'Another bu with subjects attaching to the Turks, more than four thousand households coming to surrender—an edict gave grain and sent them back; they firmly refused to leave; the bu gradually grew numerous, moved following water and grass, dwelt along the Heichen River.', 'Another bu with subjects attaching to the Turks, more than four thousand households coming to surrender—an edict gave grain and sent them back; they firmly refused to leave; the bu gradually grew numerous, moved following water and grass, and dwelt along the Heichen River.'],
  ['s0126', 'Two hundred li due north of eastern Liaoxi; its territory east-west more than five hundred li, north-south three hundred li.', 'Two hundred li due north of eastern Liaoxi; its territory was more than five hundred li east to west and three hundred li north to south.'],
  ['s0127', 'Divided into ten bu; their names are lost.', 'They were divided into ten bu; their names are lost.'],
  ['s0128', 'Tang Dahe clan eight bu: Daji bu, Qiaoluo prefecture.', 'Tang Dahe clan eight bu: Daji bu, Qiaoluo prefecture.'],
  ['s0129', 'Hebian bu, Danhan prefecture.', 'Hebian bu, Danhan prefecture.'],
  ['s0130', 'Duhuo bu, Wufeng prefecture.', 'Duhuo bu, Wufeng prefecture.'],
  ['s0131', 'Fenjian bu, Yuling prefecture.', 'Fenjian bu, Yuling prefecture.'],
  ['s0132', 'Tubian bu, Rilian prefecture.', 'Tubian bu, Rilian prefecture.'],
  ['s0133', 'Ruixi bu, Tuhe prefecture.', 'Ruixi bu, Tuhe prefecture.'],
  ['s0134', 'Zhuijin bu, Wandan prefecture.', 'Zhuijin bu, Wandan prefecture.'],
  ['s0135', 'Fu bu, two prefectures: Pili and Chishan.', 'Fu bu, two prefectures: Pili and Chishan.'],
  ['s0136', 'Tang Emperor Taizong established Xuan prefecture, making the Khitan great chief Juqu prefect.', 'Tang Emperor Taizong established Xuan prefecture, making the Khitan great chief Juqu prefect.'],
  ['s0137', 'Also established Songmo grand protectorate, making Kuge grand protector, dividing the eight bu and together with Xuan prefecture as ten prefectures.', 'Also established Songmo grand protectorate, making Kuge grand protector, dividing the eight bu and together with Xuan prefecture as ten prefectures.'],
  ['s0138', 'Then the ten bu were within them.', 'Then the ten bu were within them.'],
  ['s0139', 'Yaolian clan eight bu: Danlijiebu.', 'Yaolian clan eight bu: Danlijiebu.'],
  ['s0140', 'Yishihuobu.', 'Yishihuobu.'],
  ['s0141', 'Shihuobu.', 'Shihuobu.'],
  ['s0142', 'Naweibu.', 'Naweibu.'],
  ['s0143', 'Pinmeibu.', 'Pinmeibu.'],
  ['s0144', 'Nahuijibu.', 'Nahuijibu.'],
  ['s0145', 'Jijiebu.', 'Jijiebu.'],
  ['s0146', 'Xiwubu.', 'Xiwubu.'],
  ['s0147', 'When Tang Kaiyuan and Tianbao, the Dahe clan had already declined, Liao founding ancestor Nieli installed Dichianzu Li as Khan Zuwu.', 'When Tang was in the Kaiyuan and Tianbao era, the Dahe clan had already declined; Liao founding ancestor Nieli installed Dichianzu Li as Khan Zuwu.'],
  ['s0148', 'At that time because of Wanrong\'s defeat the bu were scattered and dispersed; the existing clan multitude was again divided into eight bu.', 'At that time, because of Wanrong\'s defeat the bu were scattered and dispersed; the existing clan multitude was again divided into eight bu.'],
  ['s0149', 'The Yilie bu that Nieli ruled was itself a separate bu and not listed among them.', 'The Yilie bu that Nieli ruled was itself a separate bu and not listed among them.'],
  ['s0150', 'Together Yaolian and Yilie were also ten bu.', 'Together Yaolian and Yilie were also ten bu.'],
  ['s0151', 'Yaolian Khan Zuwu twenty bu: seven Yelü bu.', 'Yaolian Khan Zuwu twenty bu: seven Yelü bu.'],
  ['s0152', 'Five Shenmi bu.', 'Five Shenmi bu.'],
  ['s0153', 'Eight bu.', 'Eight bu.'],
  ['s0154', 'Nieli assisted Khan Zuwu, divided three Yelü into seven, two Shenmi into five, and together with the former eight bu made twenty bu.', 'Nieli assisted Khan Zuwu, divided three Yelü into seven and two Shenmi into five, and together with the former eight bu made twenty bu.'],
  ['s0155', 'Three Yelü: first Dahe, second Yaolian, third Shili—that is the imperial clan.', 'Three Yelü: first Dahe, second Yaolian, third Shili—that is the imperial clan.'],
  ['s0156', 'Two Shenmi: first Yishi, second Balin—that is the national uncles.', 'Two Shenmi: first Yishi, second Balin—that is the national uncles.'],
  ['s0157', 'Their subdivisions are all not detailed; what can be known: Yilie, Yishi, Pin, Chute, Wugui, Tulubu, Niela, Tuju, also Right Great bu and Left Great bu—ten in all, two lost.', 'Their subdivisions are all not detailed; what can be known includes Yilie, Yishi, Pin, Chute, Wugui, Tulubu, Niela, Tuju, also Right Great bu and Left Great bu—ten in all, two lost.'],
  ['s0158', 'Dahe and Yaolian were divided into six, while Shili combined into one;', 'Dahe and Yaolian were divided into six, while Shili combined into one;'],
  ['s0159', 'this is why the Yilie bu through the end of the Yaolian age was strong and could not be controlled.', 'this is why the Yilie bu through the end of the Yaolian age was strong and could not be controlled.'],
];

const dir = path.dirname(fileURLToPath(import.meta.url));
const chapterPath = path.resolve(dir, '../../data/liaoshi/032.json');

function rowsToJson(rows) {
  return rows.map(([id, literal, idiomatic]) => ({ id, literal, idiomatic }));
}

function writeBatch(name, rows, startId, endId) {
  const out = rowsToJson(rows);
  const outPath = path.join(dir, `liaoshi-032-${name}.json`);
  fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
  console.log(`${name}: ${out.length} entries (${startId}–${endId}) → ${outPath}`);
  return out;
}

writeBatch('batch1', part1, 's0001', 's0100');
writeBatch('batch2', part2, 's0101', 's0159');

const all = [...part1, ...part2];
if (all.length !== 159) {
  throw new Error(`Expected 159 entries, got ${all.length}`);
}

const ids = new Set(all.map((r) => r[0]));
if (ids.size !== 159) {
  throw new Error('Duplicate sentence ids in patch data');
}

for (let i = 1; i <= 159; i++) {
  const want = `s${String(i).padStart(4, '0')}`;
  if (!ids.has(want)) throw new Error(`Missing ${want}`);
}

const zhLines = execSync(
  `jq -r '.content[] | .sentences[]? | "\\(.id)\\t\\(.zh)"' "${chapterPath}"`,
  { encoding: 'utf8' },
)
  .trim()
  .split('\n')
  .filter(Boolean);

if (zhLines.length !== 159) {
  throw new Error(`Source chapter has ${zhLines.length} sentences, expected 159`);
}

const zhById = Object.fromEntries(
  zhLines.map((line) => {
    const tab = line.indexOf('\t');
    return [line.slice(0, tab), line.slice(tab + 1)];
  }),
);

for (const [id, literal, idiomatic] of all) {
  if (!literal?.trim() || !idiomatic?.trim()) {
    throw new Error(`${id}: empty literal or idiomatic`);
  }
  if (/\u3008(?![^]*\u3009)/.test(literal) || /\u3008(?![^]*\u3009)/.test(idiomatic)) {
    throw new Error(`${id}: lone 〈 placeholder`);
  }
  if (!zhById[id]) throw new Error(`${id}: not in source chapter`);
}

console.log('Validated 159 entries against data/liaoshi/032.json');
console.log('Total: 159 sentences s0001–s0159');
