#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'Entrust to the realm\'s governance and buttress our court\'s plans.',
    'Entrust him with rule across the realm and strengthen our court\'s design.',
  ],
  s0202: [
    'Promote him to Grand Commandant and General of Chariots and Cavalry; all else as before."',
    'Promote him to Grand Commandant and General of Chariots and Cavalry; all else unchanged."',
  ],
  s0203: [
    'Shortly thereafter he entered mourning for his mother, the Lady Grand Mistress; Emperor Yuan sent a palace attendant and imperial messenger to oversee the funeral rites and issued a posthumous title: the Upright and Reverent Grand Lady.',
    'Soon after he mourned his mother, Lady Grand Mistress; Yuan sent an attendant and imperial messenger to supervise the funeral and posthumously titled her Upright and Reverent Grand Lady.',
  ],
  s0204: [
    'The lady\'s surname was Wei.',
    'Her surname was Wei.',
  ],
  s0205: [
    'When Shennian in the early Heavenly Surveillance era led his followers to hold the eastern pass and then withdrew to guard west of Chaohu at Hefei, he took her in marriage; she bore Sengbian.',
    'When Shennian early in Heavenly Surveillance held the eastern pass and withdrew to Hefei west of Chaohu, he married her and she bore Sengbian.',
  ],
  s0206: [
    'By nature she was very gentle and skilled at winning people over; within and without the household none did not cherish her.',
    'She was gentle by nature and won people over; everyone in the household cherished her.',
  ],
  s0207: [
    'Earlier, when Sengbian was imprisoned, the lady went on foot in tears to enter the palace and beg forgiveness; Emperor Yuan would not receive her.',
    'When Sengbian was imprisoned, she walked to court in tears to beg pardon; Yuan would not see her.',
  ],
  s0208: [
    'At the time the Heir of Zhenhui was favored by Emperor Yuan, and most state and military affairs passed through his hands.',
    'The Heir of Zhenhui was then in favor with Yuan, and most state and military affairs ran through him.',
  ],
  s0209: [
    'The lady went to the gate lodge, declaring herself without proper teaching; weeping and sobbing, all pitied her.',
    'She came to the gate lodge, blamed herself for poor upbringing, and wept until all pitied her.',
  ],
  s0210: [
    'When Sengbian was released, the lady sternly reproved and exhorted him, her words and countenance both severe, saying: "In serving one\'s lord one must be loyal and fierce—not only to protect the age but also to extend blessing to one\'s descendants.',
    'When Sengbian was freed, she rebuked him sternly: "Serving a lord demands loyalty and fierceness—not only to shield the age but to bless your descendants.',
  ],
  s0211: [
    '" When Sengbian recovered the old capital his merit covered the realm; the lady always restrained herself and did not flaunt wealth and rank before others.',
    '" After he recovered the old capital his merit covered the realm; she always held herself back and never flaunted rank.',
  ],
  s0212: [
    'Court and countryside alike praised her, calling her a wise and discerning woman.',
    'Court and countryside praised her as a wise woman.',
  ],
  s0213: [
    'When she had died, she was deeply mourned.',
    'At her death she was deeply mourned.',
  ],
  s0214: [
    'Because Sengbian\'s achievements were weighty, the funeral rites were augmented.',
    'Because Sengbian\'s service was great, her funeral rites were augmented.',
  ],
  s0215: [
    'As the coffin was to return to Jiankang, the emperor again sent an imperial messenger to the river landing to offer libation.',
    'As the coffin was to return to Jiankang, he again sent a messenger to libate at the river landing.',
  ],
  s0216: [
    'He ordered the Minister of the Left, Wang Pou, to compose her text, which read: "Alas for you, foundation of the age, scion of martial lineage, clan glorious in Yangyuan, gold and jade reflecting one another, jade virtue matching warmth.',
    'He ordered Minister of the Left Wang Pou to compose her text: "Alas for you, foundation of the age, scion of martial lineage, clan glorious in Yangyuan, gold and jade reflecting one another, jade virtue matching warmth.',
  ],
  s0217: [
    'You were famed as a woman of rule and also followed the wife\'s way.',
    'You were famed as a woman of rule and followed the wife\'s way.',
  ],
  s0218: [
    'You mirrored yourself in books and pictures and joined in literary discussion.',
    'You read books and pictures and joined literary discussion.',
  ],
  s0219: [
    'Your teaching reached the sacrificial vessels and your instruction extended to the plain.',
    'Your teaching reached the sacrificial vessels and your instruction extended to the plain.',
  ],
  s0220: [
    'Chu sent forth troops; Mencius completed virtue.',
    'Chu sent forth troops; Mencius completed virtue.',
  ],
  s0221: [
    'Utter loyalty and reverent support—from family to state.',
    'Utter loyalty and reverent support—from family to state.',
  ],
  s0222: [
    'Your bearing was manifest and true; you were the people\'s model.',
    'Your bearing was manifest and true; you were the people\'s model.',
  ],
  s0223: [
    'You turned back the army\'s command and already repaired our arms;',
    'You turned back the army\'s command and already repaired our arms;',
  ],
  s0224: [
    'You filled this ministerial post and possessed Gui and Meng.',
    'You filled this ministerial post and possessed Gui and Meng.',
  ],
  s0225: [
    'The mother honored through the son—thus was your eminence raised;',
    'The mother honored through the son—thus was your eminence raised;',
  ],
  s0226: [
    'Gracious mandates gathered; favoring edicts descended upon you.',
    'Gracious mandates gathered; favoring edicts descended upon you.',
  ],
  s0227: [
    'Though high, you could humble yourself; though honored, you thought of restraint;',
    'Though high, you could humble yourself; though honored, you thought of restraint;',
  ],
  s0228: [
    'Blessing began in goodness; glory joined a fine end.',
    'Blessing began in goodness; glory joined a fine end.',
  ],
  s0229: [
    'The western slope of sunset; reeds already in early autumn;',
    'The western slope of sunset; reeds already in early autumn;',
  ],
  s0230: [
    'Galloping steeds are hard to turn back; rushing billows—how can they stay?',
    'Galloping steeds are hard to turn back; rushing billows—how can they stay?',
  ],
  s0231: [
    'Turning from Dragon Gate to look west, passing Summer Head to float east;',
    'Turning from Dragon Gate to look west, passing Summer Head to float east;',
  ],
  s0232: [
    'Crossing the distant peaks of the three palaces, threading the branching currents of the three rivers.',
    'Crossing the distant peaks of the three palaces, threading the branching currents of the three rivers.',
  ],
  s0233: [
    'Layered ridges rise darkly; floating clouds hide and obscure;',
    'Layered ridges rise darkly; floating clouds hide and obscure;',
  ],
  s0234: [
    'The Yangtze and Han roll on; the departed are as this.',
    'The Yangtze and Han roll on; the departed are as this.',
  ],
  s0235: [
    'Banners of mourning, old funerary flags; halls ruined, the stele left behind.',
    'Banners of mourning, old funerary flags; halls ruined, the stele left behind.',
  ],
  s0236: [
    'At once set out offerings on the empty boat, thinking the departing soul still knows.',
    'At once set out offerings on the empty boat, thinking the departing soul still knows.',
  ],
  s0237: [
    'Alas, grief!"',
    'Alas, grief!"',
  ],
  s0238: [
    'In the tenth month of that year, Western Wei chancellor Yuwen Heitai sent troops together with the Prince of Yueyang—fifty thousand in all—to strike Jiangling.',
    'In the tenth month of that year, Western Wei chancellor Yuwen Heitai and the Prince of Yueyang sent fifty thousand men to strike Jiangling.',
  ],
  s0239: [
    'Emperor Yuan sent chief clerk Li Ying to summon Sengbian at Jianye as grand commander and inspector of Jing province.',
    'Yuan sent chief clerk Li Ying to summon Sengbian at Jianye as grand commander and inspector of Jing.',
  ],
  s0240: [
    'A separate edict to Sengbian said: "Heitai has broken the alliance and suddenly raised the axe.',
    'A separate edict said, "Heitai has broken the alliance and suddenly raised the axe.',
  ],
  s0241: [
    'The state\'s fierce generals mostly lie downriver;',
    'The state\'s fierce generals mostly lie downriver;',
  ],
  s0242: [
    'the hosts of Jing and Shaan are none of them stalwart warriors.',
    'the hosts of Jing and Shaan are none of them stalwart warriors.',
  ],
  s0243: [
    'You should lead our tiger guards, set out at once, travel with redoubled speed, and go to relieve the peril hanging by a thread."',
    'You should lead our tiger guards, set out at once, travel with redoubled speed, and relieve the peril hanging by a thread."',
  ],
  s0244: [
    'Sengbian thereupon appointed Inspector of Yu Zhou Hou Tian and others as vanguard and Inspector of Yan Zhou Du Sengming and others as rearguard.',
    'Sengbian appointed Hou Tian of Yu as vanguard and Du Sengming of Yan as rearguard.',
  ],
  s0245: [
    'When the dispositions were complete he told Li Ying: "Tai\'s troops are fierce and hard to meet head-on; once the armies assemble I shall strike straight for the Han River and cut their rear.',
    'When dispositions were complete he told Li Ying, "Tai\'s troops are fierce; once the armies assemble I shall strike for the Han and cut their rear.',
  ],
  s0246: [
    'For every thousand li of grain conveyed there are men with hunger in their faces—how much more when bandits cross several thousand li?"',
    'A thousand li of grain still leaves hunger—how much more when bandits cross several thousand li?"',
  ],
  s0247: [
    'This is the time when Sun Bin overcame Pang Juan."',
    'This is Sun Bin\'s moment against Pang Juan."',
  ],
  s0248: [
    'Soon the capital fell and the imperial carriage halted forever.',
    'Soon the capital fell and the imperial carriage halted forever.',
  ],
  s0249: [
    'When Emperor Jing first took the Liang throne, Sengbian had a share in establishing him; by imperial order he was promoted to General of Flying Cavalry, Director of the Secretariat, commander of all military affairs at home and abroad, and Recorder of the Master of Writing, and with Chen Baxian he jointly planned punitive campaigns.',
    'When Emperor Jing first took the throne, Sengbian had helped establish him; by order he was made General of Flying Cavalry, Director of the Secretariat, commander of all military affairs, and Recorder of the Master of Writing, and with Chen Baxian he planned campaigns.',
  ],
  s0250: [
    'At the time the Qi ruler Gao Yang also wished to install the Marquis of Zhenyang, Xiao Yuanming, as successor to Liang, and wrote to Sengbian: "Liang has met ill fortune and calamity has followed calamity: Hou Jing overturned Jiankang and the Prince of Wuling bent his bow in Ba and Han.',
    'Qi ruler Gao Yang also wished to install Marquis of Zhenyang Xiao Yuanming as Liang heir and wrote to Sengbian: "Liang has met ill fortune: Hou Jing overturned Jiankang and the Prince of Wuling bent his bow in Ba and Han.',
  ],
  s0251: [
    'Your will matches the dark heavens and your spirit pierces the white sun; with united strength and one heart you cut down the rebellious villain.',
    'Your will matches heaven and your spirit pierces the sun; with one heart you cut down the rebel.',
  ],
  s0252: [
    'All who have feeling cannot but sigh in admiration;',
    'All who have feeling cannot but admire you;',
  ],
  s0253: [
    'how much more we neighboring states, bound in affairs of old.',
    'how much more we neighbors, bound in affairs of old.',
  ],
  s0254: [
    'Yet the western bandits seized the interval and again made a surprise attack.',
    'Yet western bandits seized the moment and struck again.',
  ],
  s0255: [
    'The Liang ruler could not hold Jiangling firm and perished with the imperial temple.',
    'The Liang ruler could not hold Jiangling and perished with the imperial temple.',
  ],
  s0256: [
    'Our royal army had not yet arrived when he had already surrendered in defeat;',
    'Our royal army had not arrived when he had already surrendered;',
  ],
  s0257: [
    'officers and people, great and small, all became captives of the invader.',
    'officers and people, great and small, all became captives.',
  ],
  s0258: [
    'Turning my gaze south, indignant sighs fill my breast.',
    'Turning south, indignant sighs fill my breast.',
  ],
  s0259: [
    'In the heart of a minister and son, the thought must be to burst with grief.',
    'A minister and son\'s heart must burst with grief.',
  ],
  s0260: [
    'I hear a collateral scion has been set up in power at Jiangyin, barely past ten and extremely young and slight;',
    'I hear a collateral scion rules at Jiangyin, barely past ten and extremely young;',
  ],
  s0261: [
    'Liang\'s trouble is not yet ended—the burden is hard to bear.',
    'Liang\'s trouble is not ended—the burden is hard to bear.',
  ],
  s0262: [
    'Sacrifices would be for the ruler of Wei while government rests with the Ning clan;',
    'Sacrifices would be for Wei\'s ruler while government rests with the Nings;',
  ],
  s0263: [
    'a weak trunk and strong branches—through the ages this has been dreaded.',
    'a weak trunk and strong branches—through the ages this has been dreaded.',
  ],
  s0264: [
    'I take all under Heaven as my house and the Great Way as what aids all things.',
    'I take all under Heaven as my house and the Great Way as what aids all things.',
  ],
  s0265: [
    'Because Liang has been submerged in ruin, I cherish the old friendship; to rescue the perishing and lift the fallen is duty in this hour—supporting a tottering succession is not prolonging another\'s virtue.',
    'Because Liang lies in ruin, I cherish old friendship; to rescue the perishing is duty now—supporting a tottering line is not prolonging another\'s virtue.',
  ],
  s0266: [
    'That Marquis of Zhenyang is a foster son of Emperor Wu of Liang and heir of Changsha; by years and by standing he can guard Jinling—therefore I have set him up as Liang ruler and installed him in that state.',
    'Marquis of Zhenyang is Liang Wu\'s foster son and Changsha\'s heir; by years and standing he can guard Jinling—so I set him up as Liang ruler in that state.',
  ],
  s0267: [
    'I have ordered the Prince of Shangdang, Huan, to command all generals and escort him down the river with thunder and wind to help sweep away the wronged and rebellious.',
    'I ordered Prince of Shangdang Huan to command the generals and escort him downriver like thunder to sweep away rebels.',
  ],
  s0268: [
    'The Prince of Qinghe, Yue, earlier rescued Jing city; his army crossed Anlu but could not join in time—deep was his vexation.',
    'Prince of Qinghe Yue earlier rescued Jing; his army crossed Anlu but could not join—his vexation was deep.',
  ],
  s0269: [
    'I fear the western bandits will ride the current and again tread the left of the Yangtze.',
    'I fear western bandits will ride the current and again tread the Yangtze left bank.',
  ],
  s0270: [
    'Now he is moving to Hankou to meet Master Lu.',
    'Now he is moving to Hankou to meet Master Lu.',
  ],
  s0271: [
    'You should cooperate with my good plan, urge those commanders, divide the fleet, welcome the new king, gather fierce courage, and unite hearts in one effort.',
    'You should cooperate with my plan, urge the commanders, divide the fleet, welcome the new king, gather fierce courage, and unite in one effort.',
  ],
  s0272: [
    'The western Qiang are a mob in union and are no strong foe—they are simply the Eastern Xiang\'s timidity, which brought this ruin.',
    'Western Qiang are a mob and no strong foe—simply Eastern Xiang timidity brought this ruin.',
  ],
  s0273: [
    'Today\'s army—where would it not conquer? Form a good plan and fulfill what I hope."',
    'Today\'s army—where would it not conquer? Form a good plan and fulfill my hope."',
  ],
  s0274: [
    'Zhenyang, escorted by Qi, was about to reach Shouyang.',
    'Zhenyang, escorted by Qi, was about to reach Shouyang.',
  ],
  s0275: [
    'Zhenyang repeatedly wrote to Sengbian on returning to the state and succeeding to the line; Sengbian would not accept.',
    'Zhenyang repeatedly wrote on restoring the line; Sengbian refused.',
  ],
  s0276: [
    'When Zhenyang and Gao Huan reached the eastern pass, Regular Palace Attendant Pei Zhiheng led troops to resist and was defeated; Sengbian thereupon planned to accept Zhenyang and fix the rites between ruler and minister.',
    'When Zhenyang and Gao Huan reached the eastern pass, Pei Zhiheng resisted and was defeated; Sengbian then planned to accept Zhenyang and fix ruler-minister rites.',
  ],
  s0277: [
    'He memorialized: "From the time Qin troops harried Shaan I prepared to go to the rescue; I had just boarded ship when Jing city fell; I at once sent Liu Zhou into the realm with a memorial of full loyalty—at first the meritorious on left and right were all of one pact.',
    'He memorialized, "From the time Qin troops harried Shaan I prepared to rescue; I had just boarded when Jing fell; I sent Liu Zhou with a memorial of loyalty—the meritorious at first were all of one pact.',
  ],
  s0278: [
    'Zhou was long in not returning and men\'s hearts were suspicious;',
    'Zhou was long in not returning and hearts grew suspicious;',
  ],
  s0279: [
    'then edicts of investiture came from the central envoys and inquiries were again sent everywhere; public opinion was divided and no firm decision was made.',
    'then investiture edicts came from central envoys and inquiries went everywhere; opinion was divided and nothing was decided.',
  ],
  s0280: [
    'Only then did I receive Hou Tian\'s letter showing Western Bandit Quan Jingxuan\'s document, ordering the true text presented above.',
    'Only then I received Hou Tian\'s letter with Western Bandit Quan Jingxuan\'s document, ordering the true text shown above.',
  ],
  s0281: [
    'Looking on the commanders, they are bent on the same submission to Qi—if in one morning we turn against the great state, I do not shrink from being ground to dust, but I grieve that Liang\'s fortune is forever cut off from revival.',
    'Seeing the commanders, they are bent on the same submission to Qi—if we turn against the great state, I do not shrink from dust, but Liang\'s fortune is cut off from revival.',
  ],
  s0282: [
    'I humbly wish Your Majesty to cross the river at once, relying on Great Qi\'s might and Your Majesty\'s sacred strategy—establish a ruler of mature years and vengeance may be hoped for; the altars may shine again; death would not be regretted.',
    'I wish Your Majesty to cross the river at once, relying on Great Qi\'s might and your sacred strategy—establish a mature ruler and vengeance may come; the altars may shine again; death would not be regretted.',
  ],
  s0283: [
    'I beg to detain the separate envoy Cao Chong to rush a memorial to the Qi capital; further memorials will follow—bowing and awaiting, urgent.',
    'I beg to detain envoy Cao Chong to rush a memorial to Qi; further memorials will follow—bowing and awaiting, urgent.',
  ],
  s0284: [
    '" Zhenyang replied: "Jiang Gao has arrived and wrongly shows your full loyal heart.',
    '" Zhenyang replied, "Jiang Gao has arrived and shows your loyal heart.',
  ],
  s0285: [
    'Home and state have been in chaos for years now.',
    'Home and state have been in chaos for years.',
  ],
  s0286: [
    'The three empresses suffered dust; the four seas seethed.',
    'The three empresses suffered dust; the four seas seethed.',
  ],
  s0287: [
    'Heaven\'s mandate rests on the chief minister to rescue and restore our court.',
    'Heaven\'s mandate rests on the chief minister to rescue our court.',
  ],
  s0288: [
    'To grandly cross hardship and raise the martial temple.',
    'To grandly cross hardship and raise the martial temple.',
  ],
  s0289: [
    'Even men of the hills building walls still thought of the coming model;',
    'Even men of the hills building walls still thought of the coming model;',
  ],
  s0290: [
    'how much less the imperial clan branch of the ducal house—would it be an empty delay?',
    'how much less the imperial clan branch—would it be an empty delay?',
  ],
  s0291: [
    'Hearing of my return to the state, reason meets your lofty heart; but recently envoys were sent again and perhaps did not report fully.',
    'Hearing of my return, reason meets your heart; but recent envoys perhaps did not report fully.',
  ],
  s0292: [
    'You have consulted ministers and reached the feudal lords; going and coming on the river has taken full months—the envoys\' arrival truly matches what was expected.',
    'You consulted ministers and reached the feudal lords; river traffic took full months—the envoys\' arrival matches expectation.',
  ],
  s0293: [
    'Thus the Xiao house is set up again and the Liang state revived.',
    'Thus the Xiao house is set up again and Liang revived.',
  ],
  s0294: [
    'Hundreds of millions of the people all receive this grace;',
    'Hundreds of millions all receive this grace;',
  ],
  s0295: [
    'the altars and imperial temple are not unworthy of it.',
    'the altars and imperial temple are not unworthy.',
  ],
  s0296: [
    'Recently the army halted at the eastern pass and repeatedly sent word through Pei Zhiheng to show whether it was acceptable.',
    'Recently the army halted at the eastern pass and repeatedly sent word through Pei Zhiheng on whether it was acceptable.',
  ],
  s0297: [
    'The answers were arrogant and fierce—utterly shocking to hear.',
    'The answers were arrogant and fierce—utterly shocking.',
  ],
  s0298: [
    'The Prince of Shangdang arrayed troops as escort wishing to discuss safety and danger; men without understanding suddenly turned to battle.',
    'Prince of Shangdang arrayed troops as escort to discuss safety; the witless suddenly fought.',
  ],
  s0299: [
    'Before the vanguard had moved they broke out on their own—shock and grief only deepened the wound.',
    'Before the vanguard moved they broke out on their own—shock and grief deepened the wound.',
  ],
  s0300: [
    'The Prince of Shangdang deeply regretted it himself and did not transmit the head; he again granted a sealed tumulus, adorned the coffin, and buried him richly, doing all with generous rites.',
    'Prince of Shangdang deeply regretted it and did not transmit the head; he granted a sealed tumulus, adorned the coffin, and buried him richly with generous rites.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_045_b3.mjs <translation.json>'
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
