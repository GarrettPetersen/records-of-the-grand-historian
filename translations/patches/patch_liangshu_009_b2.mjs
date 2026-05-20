#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'When Gaozu entered and encamped at Xincheng, he strictly enforced orders, and only then did things gradually quiet.',
    'When Gaozu entered and encamped at Xincheng, he enforced orders strictly, and only then did the turmoil subside.',
  ],
  s0102: [
    'He again joined the massed armies in a long siege of the Six Gates.',
    'He again joined the armies in a long siege of the Six Gates.',
  ],
  s0103: [
    'When the city fell, Jingzong was appointed Regular Attendant, Right Guard General, and enfeoffed as Marquis of Xiangxi with a fief of one thousand six hundred households.',
    'When the city fell, he was made Regular Attendant and Right Guard General, enfeoffed as Marquis of Xiangxi with a fief of sixteen hundred households.',
  ],
  s0104: [
    'He was then transferred to Bearer of the Staff, Commander-in-Chief of the military affairs of Ying and Si provinces, Left General, and Inspector of Yingzhou.',
    'He was then made Bearer of the Staff, commander-in-chief of Ying and Si provinces, Left General, and inspector of Yingzhou.',
  ],
  s0105: [
    'In the first year of Tianjian he was advanced to General Who Pacifies the West and his enfeoffment was changed to Marquis of Jingling.',
    'In Tianjian year 1 he was promoted to General Who Pacifies the West and re-enfeoffed as Marquis of Jingling.',
  ],
  s0106: [
    'While Jingzong held the province, he trafficked in goods and amassed wealth.',
    'While holding the province, Jingzong trafficked in goods and amassed wealth.',
  ],
  s0107: [
    'South of the city he built a mansion; east of the Long Embankment and north of Xiakou he opened streets and set gates for several li east and west, while his retainers were brutal and overbearing—the people greatly resented it.',
    'South of the city he built a mansion; east of the Long Embankment and north of Xiakou he laid out streets and gates for miles east and west, while his retainers ran wild—the people deeply resented it.',
  ],
  s0108: [
    'In the tenth month of the second year, Wei raided Si province and besieged Inspector Cai Daogong.',
    'In the tenth month of year 2, Wei raided Si province and besieged the inspector Cai Daogong.',
  ],
  s0109: [
    'As Wei\'s assault grew daily harsher, the cityfolk carried boards on their backs to draw water; Jingzong watched from the gate and would not go out, but only displayed his troops in hunts.',
    'As the Wei assault grew harsher by the day, people in the city drew water under shield; Jingzong watched from the gate and would not emerge, parading his troops in hunts alone.',
  ],
  s0110: [
    'When Si province\'s city fell, he was impeached by Censor-in-Chief Ren Fang.',
    'When Si province fell, Censor-in-Chief Ren Fang impeached him.',
  ],
  s0111: [
    'Gaozu, because he was a meritorious minister who had grown lax and gone unpunished, summoned him to be Protector of the Army.',
    'Gaozu, treating him as a meritorious minister grown lax and left unpunished, summoned him to be Protector of the Army.',
  ],
  s0112: [
    'Once he arrived, he was again appointed Regular Attendant and Right Guard General.',
    'On arrival he was again made Regular Attendant and Right Guard General.',
  ],
  s0113: [
    'In the fifth year, Tuoba Ying of Wei raided Zhongli and besieged Xuzhou Inspector Chang Yizhi.',
    'In year 5, Tuoba Ying of Wei raided Zhongli and besieged Xuzhou inspector Chang Yizhi.',
  ],
  s0114: [
    'Gaozu ordered Jingzong to command the massed armies to relieve Yizhi; Yuzhou Inspector Wei Rui also took part, but was placed under Jingzong\'s command.',
    'Gaozu ordered Jingzong to command the armies to relieve Yizhi; Yuzhou inspector Wei Rui joined as well, under Jingzong\'s command.',
  ],
  s0115: [
    'He ordered Jingzong to encamp at Daoren Isle and wait until all the armies had gathered to advance together.',
    'He ordered Jingzong to encamp at Daoren Isle and wait for the armies to gather before advancing together.',
  ],
  s0116: [
    'Jingzong repeatedly memorialized, asking to seize the tail of Shaoyang Isle first; Gaozu would not listen.',
    'Jingzong repeatedly petitioned to seize the end of Shaoyang Isle first; Gaozu refused.',
  ],
  s0117: [
    'Jingzong wished to monopolize the merit, so he disobeyed the edict and advanced; a sudden storm arose and many were drowned, and he returned to hold his former camp.',
    'Wishing to keep the glory for himself, Jingzong disobeyed the edict and advanced; a sudden storm drowned many, and he fell back to his former camp.',
  ],
  s0118: [
    'When Gaozu heard of it, he said: "This is how the enemy will be broken.',
    'When Gaozu heard, he said, "This is how we break the enemy.',
  ],
  s0119: [
    'If Jingzong does not advance, is it not Heaven\'s will!',
    'Jingzong holding back—surely that is Heaven\'s will!',
  ],
  s0120: [
    'If a lone army went alone, the ramparts would not be raised in time and one would surely be reduced to disarray.',
    'Had he marched alone, the fort would not have risen in time and the army would have come to grief.',
  ],
  s0121: [
    'Now that all the armies may advance together, there will truly be a great victory.',
    'Now we can wait for every army to advance together, and the great victory will come.',
  ],
  s0122: [
    '" When Wei Rui arrived, he and Jingzong advanced and encamped at Shaoyang Isle, building ramparts within a hundred-odd paces of the Wei city.',
    'When Wei Rui arrived, he and Jingzong advanced to Shaoyang Isle and built ramparts a little over a hundred paces from the Wei city.',
  ],
  s0123: [
    'Wei fought repeatedly but could not drive them off; those killed and wounded were two or three in ten, and from then on the Wei army did not dare press close.',
    'Wei attacked again and again but could not drive them back; casualties ran to two or three in ten, and thereafter the Wei army did not dare close in.',
  ],
  s0124: [
    'Jingzong and the others had armor and weapons fresh and fine, and their military array was very grand; the Wei men gazed upon them and lost heart.',
    'Jingzong and the rest had bright new arms and armor and a splendid array; the Wei troops looked on and lost heart.',
  ],
  s0125: [
    'Wei\'s great general Yang Dayan built a city on the north bank opposite the bridge to keep grain transport open; whenever herders crossed the bank to cut fodder, Dayan seized them all.',
    'Wei\'s great general Yang Dayan built a city on the north bank opposite the bridge to keep supplies moving; whenever herders crossed to cut fodder, Dayan seized them.',
  ],
  s0126: [
    'Jingzong then recruited more than a thousand brave men, crossed straight over several li south of Dayan\'s city, and built a rampart, raising the earthworks himself.',
    'Jingzong then recruited more than a thousand brave men, crossed several li south of Dayan\'s city, and built a rampart, piling earth with his own hands.',
  ],
  s0127: [
    'Dayan led his host to attack; Jingzong fought and defeated him, and so the rampart was completed.',
    'Dayan led his troops to attack; Jingzong fought and broke him, and the rampart was finished.',
  ],
  s0128: [
    'He sent the separate commander Zhao Cao to hold it, and therefore called it Fort Zhao Cao; thereafter they grazed fodder at will.',
    'He left the separate commander Zhao Cao to hold it, and the place was called Fort Zhao Cao; thereafter they grazed fodder freely.',
  ],
  s0129: [
    'Whenever Dayan sent parties to raid, they were in turn captured by Zhao Cao.',
    'Whenever Dayan sent raiders, Zhao Cao captured them instead.',
  ],
  s0130: [
    'Earlier, Gaozu had ordered Jingzong and the others to fit out tall warships in advance, to match the Wei bridges in height, for a fire-attack plan.',
    'Earlier Gaozu had ordered Jingzong and the others to fit out tall warships in advance, level with the Wei bridges, for a fire attack.',
  ],
  s0131: [
    'He ordered Jingzong and Rui each to attack one bridge—Rui the south, Jingzong the north.',
    'He ordered Jingzong and Rui each to take one bridge—Rui the south, Jingzong the north.',
  ],
  s0132: [
    'In the third month of the sixth year the spring waters rose and the Huai surged six or seven feet.',
    'In the third month of year 6 the spring flood came and the Huai rose six or seven feet overnight.',
  ],
  s0133: [
    'Rui sent the generals under his command—Feng Daogen, Li Wenzhao, Pei Sui, Wei Ji, and others—to board the warships, land, and annihilate the Wei troops on the isle.',
    'Rui sent Feng Daogen, Li Wenzhao, Pei Sui, Wei Ji, and other generals under his command to land from the ships and slaughter the Wei troops on the isle.',
  ],
  s0134: [
    'Jingzong then had all the armies drum and shout and scramble up the walls in disorder; the clamor shook heaven and earth; Dayan burned his camp on the west bank, and Ying abandoned his city and fled from the east bank.',
    'Jingzong then had every army drum and shout and swarm the walls; the roar shook heaven and earth; Dayan burned his camp on the west bank, and Ying abandoned his city and fled from the east.',
  ],
  s0135: [
    'Rampart after rampart collapsed like earthworks; all cast away arms and armor and strove to throw themselves into the water and die—the Huai was choked so that it would not flow.',
    'Rampart after rampart crumbled; all cast off arms and armor and threw themselves into the water to die—the Huai was so choked it would not flow.',
  ],
  s0136: [
    'Jingzong ordered the army commander Ma Guang to pursue Dayan to the Huishui River for more than forty li; corpses lay pillow to pillow.',
    'Jingzong ordered the army commander Ma Guang to pursue Dayan to the Huishui for more than forty li; the dead lay heaped along the way.',
  ],
  s0137: [
    'Yizhi went out in pursuit of Ying to Luokou; Ying entered Liang city on a single horse.',
    'Yizhi pursued Ying to Luokou; Ying entered Liang city on a single horse.',
  ],
  s0138: [
    'For more than a hundred li along the Huai, corpses lay pillow to pillow; more than fifty thousand were taken alive; grain, weapons, and equipment were gathered in heaps like mountains; oxen, horses, donkeys, and mules were beyond counting.',
    'For more than a hundred li along the Huai the dead lay piled; more than fifty thousand were captured alive; grain and arms heaped like mountains; cattle, horses, donkeys, and mules beyond count.',
  ],
  s0139: [
    'Jingzong then searched out more than ten thousand captives and a thousand horses from what the army had taken, sent them to report victory, and Gaozu ordered him back to his original command; Jingzong led his troops home in triumph, his fief was increased by four hundred households to two thousand in all, and he was advanced to duke.',
    'Jingzong gathered more than ten thousand captives and a thousand horses from the army\'s takings and sent word of victory; Gaozu ordered him back to his command; Jingzong marched home in triumph, his fief was increased by four hundred households to two thousand in all, and he was advanced to duke.',
  ],
  s0140: [
    'By edict he was appointed Palace Attendant and Commander of the Army, with one set of martial pipes and drums.',
    'By edict he was made Palace Attendant and Commander of the Army, with one set of martial pipes and drums.',
  ],
  s0141: [
    'Jingzong was by nature self-reliant and fond of outdoing others; whenever he wrote letters, if he did not understand a character he would not ask anyone, but invent it as he pleased.',
    'Jingzong was proud and always had to win; when he wrote, any character he did not know he would not ask about but invent as he saw fit.',
  ],
  s0142: [
    'Though among dukes and ministers he showed no deference;',
    'He showed no deference even to dukes and ministers;',
  ],
  s0143: [
    'only Wei Rui was older and a leading figure of their native district, and he specially respected him; at banquets on the imperial mat he too bowed with humble courtesy—Gaozu praised him for this.',
    'only Wei Rui, who was older and a leading man of their district, he specially honored; at imperial banquets he bowed with humble courtesy as well—Gaozu praised him for it.',
  ],
  s0144: [
    'Jingzong was fond of women; his singing girls and concubines numbered in the hundreds, and he exhausted brocades and embroideries.',
    'Jingzong loved women; his concubines and singing girls numbered in the hundreds, and he exhausted every brocade and embroidery.',
  ],
  s0145: [
    'By nature restless, he could not keep silent; when he went out he always wanted to lift the carriage curtains, and those at his side would remonstrate that his rank and standing were weighty and that all eyes were upon him—he ought not do so.',
    'Restless by nature, he could not keep still; on the road he always wanted to throw back the carriage curtains, and his attendants would warn him that with his rank and dignity all eyes were on him—he should not.',
  ],
  s0146: [
    'Jingzong said to those close to him: "In the old days at home I rode a swift horse like a dragon, with several dozen young fellows, drawing the bowstring till it cracked like thunder, arrows shrieking like hungry kites.',
    'Jingzong told his intimates: "Back home I rode a swift horse like a dragon, with several dozen young men at my side, drawing the bowstring till it thundered, arrows screaming like hungry kites.',
  ],
  s0147: [
    'In the open marsh we chased deer; I shot them through the ribs several times, drank their blood when thirsty and ate their flesh when hungry—sweet as sweet dew.',
    'On the open marsh we chased deer; I shot them through the ribs again and again, drank their blood when thirsty, ate their flesh when hungry—sweet as nectar.',
  ],
  s0148: [
    'I felt wind rise behind my ears and fire burst from my nostrils—such joy makes one forget death and not know that old age is coming.',
    'Wind rose behind my ears, fire seemed to burst from my nostrils—joy like that makes you forget death and never feel old age draw near.',
  ],
  s0149: [
    'Now I have come to Yangzhou to be a great man and cannot stir; on the road I open the carriage curtains and petty men say I must not.',
    'Now I have come to Yangzhou to play the great man and cannot move; on the road I lift the carriage curtain and little men say I must not.',
  ],
  s0150: [
    'Shut up in the carriage like a bride of three days.',
    'Shut in the carriage like a bride on her third day.',
  ],
  s0151: [
    'To suffer such vexation takes the breath from a man.',
    'This suffocation steals a man\'s breath.',
  ],
  s0152: [
    '" He was by nature addicted to wine and fond of music; in the twelfth month at his mansion he had a wilderness howl performed for the year-end expulsion, going from house to house begging wine and food.',
    'He loved wine and music; in the twelfth month at his mansion he staged the wilderness howl for the year-end expulsion, going door to door begging wine and food.',
  ],
  s0153: [
    'He had meant it as sport, but many of his subordinates were violent and light-minded, and so molested other men\'s wives and seized people\'s goods.',
    'It was meant as sport, but many of his men were violent and took liberties with women and seized property.',
  ],
  s0154: [
    'Gaozu came to know of it fairly well, and Jingzong then stopped.',
    'Gaozu learned of it, and Jingzong then stopped.',
  ],
  s0155: [
    'Gaozu often feasted the meritorious ministers and talked over old times together; after wine Jingzong would forget himself in error and sometimes wrongly call himself "your servant"; Gaozu deliberately indulged him and took it as laughter.',
    'Gaozu often feasted his merit-holders and talked of old times; drunk, Jingzong would forget himself and sometimes call himself "your servant"; Gaozu indulged it and laughed.',
  ],
  s0156: [
    'In the seventh year he was transferred to Palace Attendant, Central Guard General, and Inspector of Jiangzhou.',
    'In year 7 he was transferred to Palace Attendant, Central Guard General, and inspector of Jiangzhou.',
  ],
  s0157: [
    'On the way to his post he died on the road, aged fifty-two.',
    'He died on the road while going to his post, aged fifty-two.',
  ],
  s0158: [
    'By edict he was granted two hundred thousand in cash and three hundred bolts of cloth; posthumously he was made General Who Campaigns North, Inspector of Yongzhou, and Opener of the Mansion Equal to the Three Dukes.',
    'By edict he was granted two hundred thousand cash and three hundred bolts of cloth; posthumously he was made General Who Campaigns North, inspector of Yongzhou, and Opener of the Mansion Equal to the Three Dukes.',
  ],
  s0159: [
    'Posthumous name Zhuang.',
    'His posthumous name was Zhuang, "Strong."',
  ],
  s0160: [
    'His son Jiao succeeded.',
    'His son Jiao succeeded.',
  ],
  s0161: [
    'Liu Qingyuan, styled Wenhe, was a man of Jie in Hedong.',
    'Liu Qingyuan, styled Wenhe, came from Jie in Hedong.',
  ],
  s0162: [
    'His father\'s elder brother Yuanjing was Song Grand Marshal.',
    'His father\'s elder brother Yuanjing had been Song Grand Marshal.',
  ],
  s0163: [
    'Qingyuan began his career as Registrar of Yingzhou; at the start of Qi he was Director of the Ministry of Justice in the Masters of Writing, Central Army Aide of the Grand Marshal, General Who Establishes Martial Prowess, and Administrator of Weixing.',
    'Qingyuan began as registrar of Yingzhou; at the start of Qi he was Director in the Ministry of Justice, central army aide to the Grand Marshal, General Who Establishes Martial Prowess, and administrator of Weixing.',
  ],
  s0164: [
    'The commandery suffered a sudden flood that swept away the people; the clerks asked to move the people to sacrifice at the city wall.',
    'The commandery was struck by sudden floodwaters that swept away the people; the clerks asked to move them to sacrifice at the city wall.',
  ],
  s0165: [
    'Qingyuan said: "Heaven sends down rain—how would the city know?',
    'Qingyuan said, "Heaven sends rain—how would the city know?',
  ],
  s0166: [
    'I have heard that rivers and streams do not rise for more than three days—what is there to worry about?',
    'I have heard rivers do not rise more than three days—what is there to fear?',
  ],
  s0167: [
    '" He ordered only earthworks built.',
    '" He ordered only earth ramparts built.',
  ],
  s0168: [
    'Before long the waters passed, and the people submitted to his judgment.',
    'Soon the waters receded, and the people admired his judgment.',
  ],
  s0169: [
    'He entered the capital as Colonel of the Long River Guard and went out as Recorder of the Pacify North Staff and Magistrate of Xiangyang.',
    'He entered the capital as Colonel of the Long River Guard and went out as recorder on the Pacify North staff and magistrate of Xiangyang.',
  ],
  s0170: [
    'When Gaozu came to Yongzhou, he asked the man of Jingzhao, Du Yun, for the province\'s leading men; Yun recommended Qingyuan.',
    'When Gaozu took Yongzhou, he asked Du Yun of Jingzhao for the province\'s leading men; Yun recommended Qingyuan.',
  ],
  s0171: [
    'Gaozu said: "I already know Wenhe; what I asked about was what I did not yet know.',
    'Gaozu said, "I already know Wenhe; I was asking about what I did not yet know.',
  ],
  s0172: [
    '" Thereupon he summoned him as Aide-de-Camp Attendant.',
    '" Thereupon he summoned him as aide-de-camp attendant.',
  ],
  s0173: [
    'Qi was then beset by many troubles; Qingyuan said to those close to him: "The realm under heaven will soon fall into disorder; heroes are sure to rise—he who shelters the people and settles hegemony, is he not our lord?',
    'Qi was then in turmoil; Qingyuan told his intimates, "The realm will soon fall into disorder; heroes are sure to rise—he who shelters the people and settles hegemony, is he not our lord?',
  ],
  s0174: [
    '" Thereupon he devoted himself fully in loyal support.',
    '" Thereupon he gave himself wholly to loyal support.',
  ],
  s0175: [
    'When the righteous army rose, Qingyuan constantly remained within the command tent as chief strategist.',
    'When the righteous army rose, Qingyuan constantly stayed in the command tent as chief strategist.',
  ],
  s0176: [
    'When the Pacification Office was established, he was made Aide of the Grand Marshal.',
    'When the Pacification Office was established, he was made aide of the Grand Marshal.',
  ],
  s0177: [
    'When Gaozu received the abdication, Qingyuan was transferred to Regular Attendant and Right Guard General, with the additional title General Who Subdues Captives, and enfeoffed as Marquis of Chong\'an with a fief of one thousand households.',
    'When Gaozu took the throne, Qingyuan was made Regular Attendant and Right Guard General, additionally General Who Subdues Captives, and enfeoffed as Marquis of Chong\'an with a fief of one thousand households.',
  ],
  s0178: [
    'He left office on his mother\'s mourning, was recalled to his former post, and firmly declined and would not accept.',
    'He left office for his mother\'s mourning, was recalled to his former post, and firmly declined.',
  ],
  s0179: [
    'In the second year of Tianjian he was transferred to Commander of the Army and his enfeoffment was changed to Marquis of Yundu.',
    'In Tianjian year 2 he was made Commander of the Army and re-enfeoffed as Marquis of Yundu.',
  ],
  s0180: [
    'In the fourth year he went out as Bearer of the Staff, Commander-in-Chief of the military affairs of Yong, Liang, and the northern and southern Qin provinces, General Who Subdues Captives, Pacify Barbarians Commandant, and Inspector of Yongzhou.',
    'In year 4 he went out as Bearer of the Staff, commander-in-chief of Yong, Liang, and northern and southern Qin, General Who Subdues Captives, Pacify Barbarians Commandant, and inspector of Yongzhou.',
  ],
  s0181: [
    'Gaozu saw him off at Xinting and said: "You return home in brocade; I have no more worry for the west."',
    'Gaozu saw him off at Xinting and said, "You return home in brocade; I need no longer look west with worry."',
  ],
  s0182: [
    'In the seventh year he was summoned to be Protector of the Army and Concurrent Steward of the Crown Prince.',
    'In year 7 he was summoned to be Protector of the Army and concurrent steward of the crown prince.',
  ],
  s0183: [
    'Before he took up the post he was transferred to Unhampered Regular Attendant, Right Guard General, and Concurrent General of the Right Valiant Cavalry.',
    'Before taking up the post he was transferred to Unhampered Regular Attendant, Right Guard General, and concurrent General of the Right Valiant Cavalry.',
  ],
  s0184: [
    'When he reached the capital, it happened that Wei\'s Suyu city asked to surrender; he received orders to go to its relief, and was given the staff pro tem to hold Huaiyin.',
    'On reaching the capital, Wei\'s Suyu city asked to surrender; ordered to relieve it, he was given the staff pro tem to hold Huaiyin.',
  ],
  s0185: [
    'The Wei army withdrew.',
    'The Wei army withdrew.',
  ],
  s0186: [
    'In the eighth year he returned to the capital and was transferred to Regular Attendant, Steward of the Crown Prince, and Chief Rectifier of Yongzhou.',
    'In year 8 he returned to the capital and was made Regular Attendant, steward of the crown prince, and chief rectifier of Yongzhou.',
  ],
  s0187: [
    'In the tenth year he was transferred to Palace Attendant and Commander of the Army, with a cane and one set of martial pipes and drums.',
    'In year 10 he was made Palace Attendant and Commander of the Army, with a cane and one set of martial pipes and drums.',
  ],
  s0188: [
    'In the twelfth year he was transferred to General Who Pacifies the North, Pacify Barbarians Commandant, and Inspector of Yongzhou.',
    'In year 12 he was made General Who Pacifies the North, Pacify Barbarians Commandant, and inspector of Yongzhou.',
  ],
  s0189: [
    'Qingyuan again held his native province and was quite strict in integrity; scholars and commoners cherished him.',
    'Qingyuan again held his home province and was strict in integrity; officials and commoners cherished him.',
  ],
  s0190: [
    'The next spring he died, aged fifty-seven.',
    'The next spring he died, aged fifty-seven.',
  ],
  s0191: [
    'Edict: "To recall the past and show depth at life\'s end is the former kings\' settled norm;',
    'An edict said, "To honor the past and cherish the dead is the ancient kings\' enduring rule;',
  ],
  s0192: [
    'to heighten favor and ranks is the constant practice of successive ages.',
    'to heighten favor and rank is the constant practice of every age.',
  ],
  s0193: [
    'Bearer of the Staff, Commander-in-Chief of the military affairs of Yong, Liang, northern and southern Qin, Jingling in Yingzhou, and Suixiang in Sizhou, General Who Pacifies the North, Pacify Barbarians Commandant, Inspector of Yongzhou, and Marquis Who Founded the State of Yundu, Liu Qingyuan—his capacity and insight are broad and far-reaching, his thought humane and refined.',
    'Bearer of the Staff, commander-in-chief of Yong, Liang, northern and southern Qin, Jingling in Yingzhou, and Suixiang in Sizhou, General Who Pacifies the North, Pacify Barbarians Commandant, inspector of Yongzhou, and founding marquis of Yundu, Liu Qingyuan—his talent and insight are broad, his mind humane and refined.',
  ],
  s0194: [
    'From the first in the founding struggle he shared in planning the enterprise;',
    'From the first days of the founding struggle he shared in planning the enterprise;',
  ],
  s0195: [
    'from distant days in the age of peace he was bound to service in the palace guard.',
    'from long service in peaceful times he was bound to the palace guard.',
  ],
  s0196: [
    'Again he governed the western marches and was about to spread good rule, when suddenly death came—grief wounds my breast.',
    'Again he governed the western marches and was about to spread good rule, when death came suddenly—grief wounds my breast.',
  ],
  s0197: [
    'He should receive posthumous honors to display his abundant merit.',
    'Let posthumous honors be granted to display his abundant merit.',
  ],
  s0198: [
    'He may be posthumously made Palace Attendant, Central Army General, and Opener of the Mansion Equal to the Three Dukes; martial pipes and drums and his marquisate are to remain as before.',
    'Let him be posthumously made Palace Attendant, Central Army General, and Opener of the Mansion Equal to the Three Dukes; martial pipes and drums and his marquisate remain as before.',
  ],
  s0199: [
    'Posthumous name Zhonghui.',
    'Posthumous name Zhonghui, "Loyal and Kind."',
  ],
  s0200: [
    'Funerary gift: two hundred thousand in cash and two hundred bolts of cloth.',
    'Funerary gift: two hundred thousand cash and two hundred bolts of cloth.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_009_b2.mjs <translation.json>'
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
