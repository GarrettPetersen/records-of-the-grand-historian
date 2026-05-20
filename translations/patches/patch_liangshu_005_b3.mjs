#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'Before Sheti and Heluo, beyond Lulu and Lilian, written records were not handed down and none can be named.',
    'Before Sheti and Heluo, beyond Lulu and Lilian, no written records survive and none can be named.',
  ],
  s0202: [
    'From Banspring, where martial merit was shown, to Danling, where civil virtue was displayed, there have been peoples and altars—some to whom songs and hymns returned, some whom Heaven alone assisted.',
    'From Banspring\'s martial fame to Danling\'s civil grace there have been people and altars—some claimed by song, some chosen by Heaven alone.',
  ],
  s0203: [
    'I have met many family calamities; great shame is unavenged—the national foe Chiyou is not cut down, clan kin like Youhu will not submit; lying down I ponder it, sitting I await dawn—how could I answer the precious succession, how inherit the dragon chart?',
    'I have suffered many family troubles; great shame is unavenged—national foes remain uncut, clan kin still refuse allegiance; I lie awake and sit for dawn—how could I answer the sacred calendar, how inherit the dragon chart?',
  ],
  s0204: [
    'Perhaps when one campaign is settled and the guilty are taken, when Xia is honored and Heaven matched, the coming deliberation may then be raised.',
    'Only when war is ended, the guilty seized, and rites to Xia match Heaven may the coming deliberation be raised.',
  ],
  s0205: [
    '" At that time great bandits still survived; he did not wish to take the throne immediately, but memorials urging succession arrived from all quarters in succession; he then issued an order saying: "Dazhuang rides Qian, Mingyi hangs its wings—the stellar degree shifts repeatedly, the jade pitch-pipes move again and again; the Four Peaks frequently sent urging memorials, and the nine ministers in turn presented their tables.',
    '" At that time great rebels still lived; he did not wish to ascend yet, but urging memorials came from every quarter; he then ordered, "Dazhuang rides Qian, Mingyi folds its wings—the heavens turn again and again, the jade pitch-pipes shift repeatedly; the Four Peaks repeatedly urged succession, and the nine ministers in succession presented their tables.',
  ],
  s0206: [
    'Qiao and Pei are not recovered, the tombs lie far away—in dwelling and resting, waking and sleeping, guilt weighs on me; what heart, what face could I bring to embrace this returning fortune?',
    'Qiao and Pei are not recovered, the imperial tombs lie far away—in waking and sleeping guilt weighs on me; what heart, what face could embrace this returning fortune?',
  ],
  s0207: [
    'From now memorials and submissions shall all be cut off; if anyone presents a petition, this order may be copied and enforced.',
    'From now all memorials and submissions are cut off; if anyone presents a petition, copy this order and enforce it.',
  ],
  s0208: [
    '" That day the rebel Minister of Works, Grand Commissioner of the Southeast Circuit Liu Shenmao, leading Yitong Liu Guiyi and Liu Yiyou who came over in righteousness, submitted a memorial requesting surrender.',
    '" That day rebel Minister of Works and Grand Commissioner of the Southeast Circuit Liu Shenmao, with Yitong Liu Guiyi and Liu Yiyou who came over in loyalty, submitted a memorial requesting surrender.',
  ],
  s0209: [
    'In Dabao year 3 the Shizu still used the year count of Ta Qing year 6.',
    'In Dabao 3 the Shizu still reckoned by Ta Qing 6.',
  ],
  s0210: [
    'First month, day jiaxu—the Shizu issued an order: "The army and state face many troubles; war banners are not yet still; though rebellion burns, the black-headed people should be at peace.',
    'On jiaxu in the first month the Shizu ordered, "Army and state face many troubles and war banners are not yet still; though turmoil burns, the common people should be at peace.',
  ],
  s0211: [
    'Now is the Star-Bird season, showing the year\'s auspice in the eastern order;',
    'Now is the Star-Bird season, showing the year\'s auspice in the eastern order;',
  ],
  s0212: [
    'spring marks the Azure Dragon constellation, and the harvest song is taken from the southern fields;',
    'spring marks the Azure Dragon, and the harvest song is taken from the southern fields;',
  ],
  s0213: [
    'all the more when the three classes of farming are at work and young peaches still spread over the water;',
    'all the more when the three classes of farming are at work and young peaches still spread over the water;',
  ],
  s0214: [
    'the four classes have their ordinances, and fallen apricot blossoms still fly.',
    'the four classes have their ordinances, and fallen apricot blossoms still fly.',
  ],
  s0215: [
    'Transforming custom and shifting the wind—these are ever urgent;',
    'Transforming custom and shifting the wind—these are ever urgent;',
  ],
  s0216: [
    'urging farming yet also fighting—this must be assured all the more.',
    'urging farming yet also fighting—this must be assured all the more.',
  ],
  s0217: [
    'How could one merely let the swallow hang in a cold valley and warm oneself on piled millet—how could one let this dark seedling fall, sit eating red grain, plant no dragon-throat crop, and wait empty for the cicada\'s song?',
    'How could one merely hang like a swallow in a cold valley and warm oneself on piled grain—how could one let seedlings fall, sit eating stored grain, plant no summer crop, and wait empty for the cicada\'s song?',
  ],
  s0218: [
    'All should deeply plow and sow fine seed, settle in peace and resume their trades, waste no people\'s strength, and share the land\'s benefits.',
    'All should deeply plow and sow fine seed, settle in peace and resume their trades, waste no labor, and share the land\'s benefits.',
  ],
  s0219: [
    'Let this be proclaimed to the provinces and commanderies, and all obey it.',
    'Let this be proclaimed to the provinces and commanderies, and all obey it.',
  ],
  s0220: [
    '" Zhiwu General and Interior Administrator of Nanping Wang Bao was made Minister of the Masters of Writing for Personnel.',
    '" Zhiwu General and Nanping interior administrator Wang Bao was made Minister of the Masters of Writing for Personnel.',
  ],
  s0221: [
    'Second month—Wang Senbian\'s armies set out from Xunyang.',
    'In the second month Wang Senbian\'s armies set out from Xunyang.',
  ],
  s0222: [
    'The Shizu sent a rapid proclamation to the four quarters, saying:',
    'The Shizu sent a rapid proclamation to the four quarters, saying:',
  ],
  s0223: [
    'When stripping reaches its limit calamity is born, and dragon-battle follows; an army firm at last is auspicious, and then the boar is mastered.',
    'When stripping reaches its limit calamity is born and dragon-battle follows; an army firm at last is auspicious, and then the boar is mastered.',
  ],
  s0224: [
    'Is it not that when yang is invaded and the balance shaken, the source of disorder arises?',
    'Is it not that when yang is invaded and the balance shaken, the source of disorder arises?',
  ],
  s0225: [
    'And that settling the niche of hardship is accomplished by loyalty and righteousness?',
    'And that settling the niche of hardship is accomplished by loyalty and righteousness?',
  ],
  s0226: [
    'Thus Yi and Jiao were destroyed in earlier ages, Wang Mang and Dong Zhuo executed in later times.',
    'Thus Yi and Jiao were destroyed in earlier ages, Wang Mang and Dong Zhuo executed in later times.',
  ],
  s0227: [
    'Hence the achievements of Duke Huan and Duke Wen revived in the Zhou age;',
    'Hence the achievements of Duke Huan and Duke Wen revived in the Zhou age;',
  ],
  s0228: [
    'and the merit of Wen and Tao flourished all the more in the Jin line.',
    'and the merit of Wen and Tao flourished all the more in the Jin line.',
  ],
  s0229: [
    'Mark how for fifty years and more since Liang arose it has unified the realm, virtue and grace long extended, nourishing the living with benevolence and punishing the unsubmissive with righteousness.',
    'Mark how for fifty years and more since Liang arose it unified the realm, virtue and grace long extended, nourishing the living with benevolence and punishing the unsubmissive with righteousness.',
  ],
  s0230: [
    'From the Yi on the left to the Chan on the right, all looked up to its transforming power;',
    'From the Yi on the left to the Chan on the right, all looked up to its transforming power;',
  ],
  s0231: [
    'muddy Jing and clear Wei—none failed to turn toward its wind.',
    'muddy Jing and clear Wei—none failed to turn toward its wind.',
  ],
  s0232: [
    'Raise the kingfisher banner, and six dragons toss their heads;',
    'Raise the kingfisher banner, and six dragons toss their heads;',
  ],
  s0233: [
    'strike the spirit drums, and a hundred spirits stand alert.',
    'strike the spirit drums, and a hundred spirits stand alert.',
  ],
  s0234: [
    'Worthies like Feng and Mu, Fang and Shao; generals like Wei and Huo, Xin and Zhao; guards in feather cloaks and yellow caps, tiger garrison and brocade-courier men—at a shout wind and cloud rose; at a drumbeat Song and Hua were uprooted.',
    'Worthies like Feng and Mu, Fang and Shao; generals like Wei and Huo, Xin and Zhao; guards in feather cloaks and yellow caps, tiger garrison and brocade-courier men—at a shout wind and cloud rose; at a drumbeat Song and Hua were uprooted.',
  ],
  s0235: [
    'From Tongbai north to Gushu south, before Jieshi and beyond the shifting sands, necks stretched and heels lifted, arms crossed and knees bent.',
    'From Tongbai north to Gushu south, before Jieshi and beyond the shifting sands, necks stretched and heels lifted, arms crossed and knees bent.',
  ],
  s0236: [
    'The Hu did not dare pasture horses; Qin men did not dare bend bows.',
    'The Hu did not dare pasture horses; Qin men did not dare bend bows.',
  ],
  s0237: [
    'Harmony reached ten thousand states; the hundred clans were ordered—ten Yao and nine Shun, how could words suffice?',
    'Harmony reached ten thousand states; the hundred clans were ordered—ten Yao and nine Shun, how could words suffice?',
  ],
  s0238: [
    'The rebel minister Hou Jing, a turncoat Xiongnu, the last snarl of a whistling arrow.',
    'The rebel minister Hou Jing, a turncoat Xiongnu, the last snarl of a whistling arrow.',
  ],
  s0239: [
    'Xuanguo was an empty city, never a national treasure; Shouchun a capital district—its reward did not last a month.',
    'Xuanguo was an empty city, never a national treasure; Shouchun a capital district—its reward did not last a month.',
  ],
  s0240: [
    'He opened Hailing\'s granaries, dispensed Changping rice, drew on the nine treasuries\' funds, bestowed the three offices\' coin—greedy for bribes beyond all reckoning.',
    'He opened Hailing\'s granaries, dispensed Changping rice, drew on the nine treasuries\' funds, bestowed the three offices\' coin—greedy for bribes beyond all reckoning.',
  ],
  s0241: [
    'He dared to raise rebellion and block our royal domain.',
    'He dared to raise rebellion and block our royal domain.',
  ],
  s0242: [
    'The rebel minister Zhengde nourished troops and bore cruelty with ease.',
    'The rebel minister Zhengde nourished troops and bore cruelty with ease.',
  ],
  s0243: [
    'Lately he nursed grievance in the Yangtze marshes and fled far to the Xiongnu chieftain.',
    'Lately he nursed grievance in the Yangtze marshes and fled far to the Xiongnu chieftain.',
  ],
  s0244: [
    'His written pleas piled up, yet Peng Sheng\'s ghost was not stilled;',
    'His written pleas piled up, yet Peng Sheng\'s ghost was not stilled;',
  ],
  s0245: [
    'his exactions knew no limit, and Jing Qing\'s reproach had already arrived.',
    'his exactions knew no limit, and Jing Qing\'s reproach had already arrived.',
  ],
  s0246: [
    'Giving a tiger wings, he summoned them from afar.',
    'Giving a tiger wings, he summoned them from afar.',
  ],
  s0247: [
    'He slaughtered our living people and scattered our kin.',
    'He slaughtered our living people and scattered our kin.',
  ],
  s0248: [
    'Therefore I led the strike-force, buckled on armor myself; when frost-bright spears lit the sun, the morning light lost its gleam; when dragon cavalry blanketed the plain, the fields lost their color—my faith flowed with the river, my wrath rode with the cold wind.',
    'Therefore I led the strike-force and buckled on armor myself; when frost-bright spears lit the sun, morning light lost its gleam; when dragon cavalry blanketed the plain, the fields lost their color—my faith flowed with the river, my wrath rode with the cold wind.',
  ],
  s0249: [
    'The foul enemy feared force and surrendered to low officials, begging life between Huai and Fei, clinging to existence in Xu and Yan.',
    'The foul enemy feared force and surrendered to low officials, begging life between Huai and Fei, clinging to existence in Xu and Yan.',
  ],
  s0250: [
    'The imperial grace was announced, the silken edicts spread abroad.',
    'The imperial grace was announced, the silken edicts spread abroad.',
  ],
  s0251: [
    'Therefore I withdrew the army in victory and let oxen and horses rest.',
    'Therefore I withdrew the army in victory and let oxen and horses rest.',
  ],
  s0252: [
    'The bandit still did not repent.',
    'The bandit still did not repent.',
  ],
  s0253: [
    'Again arrows flew at the Royal House; troops pressed the Elephant Gate.',
    'Again arrows flew at the Royal House; troops pressed the Elephant Gate.',
  ],
  s0254: [
    'The Zongzhang observatory was no longer the hall for hearing suits;',
    'The Zongzhang observatory was no longer the hall for hearing suits;',
  ],
  s0255: [
    'the Ganquan palace forever lost its place of summer refuge.',
    'the Ganquan palace forever lost its place of summer refuge.',
  ],
  s0256: [
    'Sitting he summoned the judiciary; lying down he directed the chief ministers—counterfeiting Heaven\'s mandate, forging talisman writings.',
    'Sitting he summoned the judiciary; lying down he directed the chief ministers—counterfeiting Heaven\'s mandate, forging talisman writings.',
  ],
  s0257: [
    'He doubled levies and stripped at will; the living fled, the dead lay exposed in the roads; men dared only look with their eyes, officials kept their mouths shut.',
    'He doubled levies and stripped at will; the living fled, the dead lay exposed in the roads; men dared only look with their eyes, officials kept their mouths shut.',
  ],
  s0258: [
    'Punishment lost its measure; ranks and rewards followed his whim; old and weak were swept like waves, gentlemen and women charred like coals.',
    'Punishment lost its measure; ranks and rewards followed his whim; old and weak were swept like waves, gentlemen and women charred like coals.',
  ],
  s0259: [
    'Menials won rewards reaching five generations;',
    'Menials won rewards reaching five generations;',
  ],
  s0260: [
    'gentry were punished to the third degree.',
    'gentry were punished to the third degree.',
  ],
  s0261: [
    'Grain soared in price; people devoured one another.',
    'Grain soared in price; people devoured one another.',
  ],
  s0262: [
    'The trembling black-headed people—wept on the roads as if led to the gallows;',
    'The trembling black-headed people—wept on the roads as if led to the gallows;',
  ],
  s0263: [
    'the numbed common folk—each household mourned like at Mount Huan.',
    'the numbed common folk—each household mourned like at Mount Huan.',
  ],
  s0264: [
    'Looking south from Yanshi, no more Palace Storehouse or Cold Dew; gazing north from Heyang, perhaps only felt tents of the steppe.',
    'Looking south from Yanshi, no more Palace Storehouse or Cold Dew; gazing north from Heyang, perhaps only felt tents of the steppe.',
  ],
  s0265: [
    'Bamboo of the southern mountains cannot suffice to record his crimes;',
    'Bamboo of the southern mountains cannot suffice to record his crimes;',
  ],
  s0266: [
    'rabbits of the western hills cannot supply ink enough for his guilt.',
    'rabbits of the western hills cannot supply ink enough for his guilt.',
  ],
  s0267: [
    'When Outer Supervisor Chen Ying arrived, I learned with bowed head that the late emperor had ascended afar and the palace carriage had halted at dusk.',
    'When Outer Supervisor Chen Ying arrived, I learned with bowed head that the late emperor had ascended afar and the palace carriage had halted at dusk.',
  ],
  s0268: [
    'Receiving the tabooed tidings I cried out in shock; my five viscera tore apart—grief rooted in the provinces, poison in the bone—nowhere to set my body.',
    'Receiving the tabooed tidings I cried out in shock; my five viscera tore apart—grief rooted in the provinces, poison in the bone—nowhere to set my body.',
  ],
  s0269: [
    'Jing\'s blockade and famine were extreme; the people looked back like wolves; he then overran our Poyang, towered over our Ying capital, seized our Jiangxia to the limit, and stormed our Baqiu.',
    'Jing\'s blockade and famine were extreme; the people looked back like wolves; he then overran our Poyang, towered over our Ying capital, seized our Jiangxia to the limit, and stormed our Baqiu.',
  ],
  s0270: [
    'Therefore the righteous vied to lead and the loyal gave all their strength.',
    'Therefore the righteous vied to lead and the loyal gave all their strength.',
  ],
  s0271: [
    'The slain chieftains cannot be counted; sand like the Red Bank, water like the Crimson River.',
    'The slain chieftains cannot be counted; sand like the Red Bank, water like the Crimson River.',
  ],
  s0272: [
    'Ren Yue bowed with muddy head at Annan; Hua Ren came bound at Hankou; Zi Xian begged life at Yan and Ying; Xi Rong was routed at Chaisang.',
    'Ren Yue bowed with muddy head at Annan; Hua Ren came bound at Hankou; Zi Xian begged life at Yan and Ying; Xi Rong was routed at Chaisang.',
  ],
  s0273: [
    'Hou Jing fled in panic—ten rats fighting for one hole; Guo Mo was pacified, Jinxi came over in righteousness; when plots were spent and strength broken, he turned and killed the late sovereign.',
    'Hou Jing fled in panic—ten rats fighting for one hole; Guo Mo was pacified, Jinxi came over in righteousness; when plots were spent and strength broken, he turned and killed the late sovereign.',
  ],
  s0274: [
    'Bi, Yuan, Yu, and Xun—all suffered calamity; Fan, Jiang, Xing, and Mao—all bowed to the axe.',
    'Bi, Yuan, Yu, and Xun—all suffered calamity; Fan, Jiang, Xing, and Mao—all bowed to the axe.',
  ],
  s0275: [
    'If this can be borne, what cannot be endured!',
    'If this can be borne, what cannot be endured!',
  ],
  s0276: [
    'The headquarters holds the upper stream, truly the covenant of Fen and Shan—sleeves thrown back, halberds shouldered, resolve set on giving the last breath.',
    'The headquarters holds the upper stream, truly the covenant of Fen and Shan—sleeves thrown back, halberds shouldered, resolve set on giving the last breath.',
  ],
  s0277: [
    'Long ago Zhou relied on Jin and Zheng; Han had Xu and Mou.',
    'Long ago Zhou relied on Jin and Zheng; Han had Xu and Mou.',
  ],
  s0278: [
    'They were but distant branches, yet could do as much;',
    'They were but distant branches, yet could do as much;',
  ],
  s0279: [
    'how much more we who share the glory of sun and moon—no one in the realm is base—both minister and son, with state and clan together!',
    'how much more we who share the glory of sun and moon—no one in the realm is base—both minister and son, with state and clan together!',
  ],
  s0280: [
    'All agree that since the banner of righteousness is raised, unity is needed; we jointly uphold the headquarters as true arbiter.',
    'All agree that since the banner of righteousness is raised, unity is needed; we jointly uphold the headquarters as true arbiter.',
  ],
  s0281: [
    'I, unworthy, am wrongly set as commander-in-chief; viewing the state\'s hardship from afar, I have no leisure to rest.',
    'I, unworthy, am wrongly set as commander-in-chief; viewing the state\'s hardship from afar, I have no leisure to rest.',
  ],
  s0282: [
    'The center holds authority, the rear supplies strength; we march with Heaven\'s punishment, lift spears through peril, and risk our lives in the doing.',
    'The center holds authority, the rear supplies strength; we march with Heaven\'s punishment, lift spears through peril, and risk our lives in the doing.',
  ],
  s0283: [
    'A thousand heavenly horses, a million long halberds—we drive warriors like Ben and Huo, draw on wisdom and courage; great Chu crosses Mount Jing, shallow plains ford Poyang; war-boats spread over the waters to pin the south, supply carts pour in to strike the north.',
    'A thousand heavenly horses, a million long halberds—we drive warriors like Ben and Huo, draw on wisdom and courage; great Chu crosses Mount Jing, shallow plains ford Poyang; war-boats spread over the waters to pin the south, supply carts pour in to strike the north.',
  ],
  s0284: [
    'Hua and Yi, the hundred Pu—carry grain and follow like shadows.',
    'Hua and Yi, the hundred Pu—carry grain and follow like shadows.',
  ],
  s0285: [
    'Thunder shakes and wind storms; we aim straight for Jianye.',
    'Thunder shakes and wind storms; we aim straight for Jianye.',
  ],
  s0286: [
    'Draw the sword and shout—the river rolls backward;',
    'Draw the sword and shout—the river rolls backward;',
  ],
  s0287: [
    'fling out the spear—the bright sun steps aside.',
    'fling out the spear—the bright sun steps aside.',
  ],
  s0288: [
    'We race chariots in long advance; a hundred roads enter together; mountains are leveled, valleys filled—the plain is covered.',
    'We race chariots in long advance; a hundred roads enter together; mountains are leveled, valleys filled—the plain is covered.',
  ],
  s0289: [
    'Men who yoke chariots and drag oxen, men who leap and shatter stone—on horseback they chase sun and wind; with bows they drop crying apes and falling geese.',
    'Men who yoke chariots and drag oxen, men who leap and shatter stone—on horseback they chase sun and wind; with bows they drop crying apes and falling geese.',
  ],
  s0290: [
    'They could hold Kunlun and crush an egg, tip Bohai and flood a lamp.',
    'They could hold Kunlun and crush an egg, tip Bohai and flood a lamp.',
  ],
  s0291: [
    'Like four horses bearing a swan\'s down, like a running ox brushing Lu silk.',
    'Like four horses bearing a swan\'s down, like a running ox brushing Lu silk.',
  ],
  s0292: [
    'With such a host to fight—who could withstand it!',
    'With such a host to fight—who could withstand it!',
  ],
  s0293: [
    'Even if bees and scorpions still had venom, beasts cornered would still fight—',
    'Even if bees and scorpions still had venom, beasts cornered would still fight—',
  ],
  s0294: [
    'say the mountain is high, and ramparts ring the four suburbs;',
    'say the mountain is high, and ramparts ring the four suburbs;',
  ],
  s0295: [
    'say the earth is vast, and none of three thousand leagues would stay away.',
    'say the earth is vast, and none of three thousand leagues would stay away.',
  ],
  s0296: [
    'Like that angry frog, like that harvest mouse—what need of ten thousand jun, what labor of a hundred yin?',
    'Like that angry frog, like that harvest mouse—what need of ten thousand jun, what labor of a hundred yin?',
  ],
  s0297: [
    'Add that the sun stands on the Yellow Way, troops rise in the Scarlet Palace; the three gates are open, five generals all deploy; we raise the banners of order and sweep the vapors of ill omen—thus we move in close concert at the moment of battle, beyond what rebels understand; punish in righteousness—what guilt would not submit?',
    'Add that the sun stands on the Yellow Way, troops rise in the Scarlet Palace; the three gates are open, five generals all deploy; we raise the banners of order and sweep the vapors of ill omen—thus we move in close concert at the moment of battle, beyond what rebels understand; punish in righteousness—what guilt would not submit?',
  ],
  s0298: [
    'Now I send the Bearer of Credentials, Grand Commander, General Who Conquers the East, Commissioner with rites equal to the Three Excellencies, Jiangzhou Inspector, Director of the Masters of Writing, Marquis of Changning Wang Senbian leading a host of one hundred thousand to sweep Jinling directly.',
    'Now I send Bearer of Credentials, Grand Commander, General Who Conquers the East, Commissioner with rites equal to the Three Excellencies, Jiangzhou inspector, Director of the Masters of Writing, Marquis of Changning Wang Senbian leading one hundred thousand men to sweep Jinling directly.',
  ],
  s0299: [
    'Drums deafen heaven; gongs shake the earth.',
    'Drums deafen heaven; gongs shake the earth.',
  ],
  s0300: [
    'Crimson banners rise at dusk like dawn-clouds over Redwall;',
    'Crimson banners rise at dusk like dawn-clouds over Redwall;',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_005_b3.mjs <translation.json>'
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
