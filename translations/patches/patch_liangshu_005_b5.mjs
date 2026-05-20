#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'Wang Wei was his heart and backbone; Zhou Shizhen betrayed the grace shown him—now all are boiled in the great cauldron and displayed in the market square.',
    'Wang Wei was his right hand; Zhou Shizhen betrayed received grace—now all are boiled in the cauldron and displayed at the market.',
  ],
  s0402: [
    'Yet compared with the recent years of bandit turmoil, time has already piled up; old nobles of cap and gown were pressed to steal life, bold warriors and meritorious lords blended their light and slipped by; all wicked companions surely are not of one clan.',
    'Yet turmoil from recent raids has gone on for years; old nobles were driven to survive in hiding, bold men and meritorious heroes dimmed their light to escape; evil companions surely are not all of one kind.',
  ],
  s0403: [
    'Now I specially open the royal favor and pare back the penal code—from before dawn on the twentieth day of the fifth month of Taiqing year 6, all may be made new.',
    'Now I open royal grace and cut back the penal statutes—from before dawn on the twentieth day of the fifth month of Taiqing 6, all are made new.',
  ],
  s0404: [
    '" That month, Wei sent Grand Mentor Pan Le, Xin Shu, and others to raid Qin commandery; Wang Sengbian sent Du Kan to lead the host against them.',
    '" That month Wei sent Grand Mentor Pan Le, Xin Shu, and others against Qin commandery; Wang Sengbian sent Du Kan with troops to resist.',
  ],
  s0405: [
    'Chen Baxian was made Grand General Who Conquers the North, Bearer with honors equal to the Three Excellencies, and South Xuzhou Inspector.',
    'Chen Baxian was made Grand General Who Conquers the North, Bearer with honors equal to the Three Excellencies, and South Xuzhou inspector.',
  ],
  s0406: [
    'That month Wei sent envoys to congratulate the pacification of Hou Jing.',
    'That month Wei sent envoys to congratulate the defeat of Hou Jing.',
  ],
  s0407: [
    'In the eighth month Xiao Ji led the great host of Ba and Shu with ships chained in succession eastward; he sent Protector-General Lu Fahe to garrison Ba Gorge to resist him.',
    'In the eighth month Xiao Ji led Ba and Shu forces chained in ships eastward; Protector-General Lu Fahe was sent to garrison Ba Gorge to resist.',
  ],
  s0408: [
    'Acting Direct Regular Cavalry Attendant and envoy to Wei Xu Ling, at Ye, submitted a memorial that said:',
    'Acting Direct and Regular Palace Cavalry Attendant and envoy to Wei Xu Ling submitted at Ye a memorial that said,',
  ],
  s0409: [
    'Your subject has heard that when Tang of the fief had a sage, he still inherited the house of Emperor Ku;',
    'I have heard that when Tang of the fief had a sage, he still inherited Emperor Ku\'s house;',
  ],
  s0410: [
    'when one dwelling in Dai alone was worthy, he at last succeeded to the fortune of the Exalted Emperor.',
    'when one dwelling in Dai alone was worthy, he at last succeeded to the Exalted Emperor\'s throne.',
  ],
  s0411: [
    'Non-action was praised in changing the sandals; utmost governance showed in letting the robes hang—yet to quell disorder and restore the right was not heard in ages before.',
    'Non-action was praised in changing the sandals; utmost governance showed in letting the robes hang—yet to quell disorder and restore the right was unheard in antiquity.',
  ],
  s0412: [
    'Take for example the Metal line renewed, its source flowing from Dongguan;',
    'Consider the Metal line renewed, its source in Dongguan;',
  ],
  s0413: [
    'the Blaze fortune still flourishing, its branch divided at Nandun.',
    'the Blaze fortune still flourishing, its branch at Nandun.',
  ],
  s0414: [
    'How could one conceal a glorious surname at the time of Yellow Emperor, or say he was no man of talent at Zhuanxu?',
    'How could one conceal a glorious surname at Yellow Emperor\'s time, or say he was no man of talent at Zhuanxu?',
  ],
  s0415: [
    'All alike took their time from many hardships and together succeeded the Divine Ancestor.',
    'All alike rose through many hardships and together succeeded the Divine Ancestor.',
  ],
  s0416: [
    'I humbly consider that Your Majesty emerged from Thunder equal to Yu and Hua, your bright yielding the same as Duke of Zhou and Duke of Shao.',
    'I humbly consider that Your Majesty emerged from Thunder equal to Yu and Hua, your bright yielding the same as the Duke of Zhou and Duke of Shao.',
  ],
  s0417: [
    'You hold the chart and grasp the battle-axe—you are about to mount Heaven; jade clasps and pearl measures already show the chief consort beforehand.',
    'You hold the chart and battle-axe—you are about to mount Heaven; jade clasps and pearl measures already proclaim the chief consort.',
  ],
  s0418: [
    'The spirits ordained this—not only the auspice of the Grand Chamber;',
    'The spirits ordained this—not only the Grand Chamber\'s auspice;',
  ],
  s0419: [
    'the charts and portraits point here—how could it be only the marvel at Yao\'s gate?',
    'the charts and portraits point here—more than the marvel at Yao\'s gate alone.',
  ],
  s0420: [
    'As for the heart of the great filial sage and the virtue of the balanced gentleman—they are indeed made to instruct the living people and bequeath their wind to the many scholars.',
    'The great filial sage\'s heart and the balanced gentleman\'s virtue instruct the living and bequeath their wind to scholars.',
  ],
  s0421: [
    'Day one, day two, you study the myriad affairs;',
    'Day after day you study the myriad affairs of state;',
  ],
  s0422: [
    'truly cultured, truly martial, embracing all the arts.',
    'cultured and martial alike, embracing every art.',
  ],
  s0423: [
    'You match the Three Great Ones and honor the Four Gates, tested through every hardship, all achievements bright—words cannot fully praise it.',
    'You match the Three Great Ones and honor the Four Gates, tested through every hardship, every achievement bright—beyond full praise.',
  ],
  s0424: [
    'Since Without Illusion rose in violence, the imperial fortune daily waned; the fief boar and winding serpent brought calamity through the central land. Where the numinous heart dwelt, the Martial Below arose; gazing at the purple pole he long lamented, looking toward the cinnabar mound he died in grief.',
    'Since Without Illusion rose in violence, the imperial fortune waned daily; the fief boar and winding serpent brought calamity through the central land. Where the numinous heart dwelt, the Martial Below arose; gazing at the purple pole he long lamented, looking toward the cinnabar mound he died in grief.',
  ],
  s0425: [
    'House wrong was soon to be answered; Heaven bestowed the yellow-bird banner;',
    'House wrong was soon answered; Heaven bestowed the yellow-bird banner;',
  ],
  s0426: [
    'national harm must be punished; the spirits gave the dark-fox tally.',
    'national harm had to be punished; the spirits gave the dark-fox tally.',
  ],
  s0427: [
    'Duke of Teng embraced the tree—his heroic breath grew stern;',
    'Duke of Teng embraced the tree—his heroic spirit grew stern;',
  ],
  s0428: [
    'Zhang Xiu met arms in battle—his wind-spirit grew bolder still.',
    'Zhang Xiu met arms in battle—his fighting spirit grew bolder still.',
  ],
  s0429: [
    'Loyalty and faith crowned sun and moon; filial duty and righteousness moved even frost and ice.',
    'Loyalty outshone sun and moon; filial duty and righteousness moved frost and ice.',
  ],
  s0430: [
    'Like thunder, like lightning, like bear and tiger—the vanguard gave their lives and the chief villain was destroyed.',
    'Like thunder and lightning, like bear and tiger—the vanguard gave their lives and the chief villain fell.',
  ],
  s0431: [
    'His guts were already hung in the western prefecture; at the eastern market his navel was set aflame.',
    'His guts already hung in the western prefecture; at the eastern market his navel burned.',
  ],
  s0432: [
    'Three mounds for Chiyou—could one call that a harsh punishment?',
    'Three mounds for Chiyou—was that harsh punishment?',
  ],
  s0433: [
    'A thousand cuts for Wang Mang—not what one calls a clear penalty?',
    'A thousand cuts for Wang Mang—was that clear penalty?',
  ],
  s0434: [
    'Green Qiang and red Di were alike cast to wolves; barbarian dress and alien speech all became capital mounds.',
    'Green Qiang and red Di alike were cast to wolves; barbarian dress and alien speech all became execution mounds.',
  ],
  s0435: [
    'The royal domain flows thick again—peaceful harvest returns;',
    'The royal domain teems again—peaceful harvest returns;',
  ],
  s0436: [
    'the ancestral temples murmur deep, about to receive abundant blessing.',
    'the ancestral temples murmur deep, ready to receive abundant blessing.',
  ],
  s0437: [
    'From the misty chaos age, the lords of Lilian and Lulu; the hexagrams rose from the dragon chart, writing followed the bird tracks.',
    'From misty chaos, the lords of Lilian and Lulu; hexagrams rose from the dragon chart, writing from bird tracks.',
  ],
  s0438: [
    'Cloud Master and Fire Emperor were not without the wind of battle arrays; Yao\'s oath and Tang\'s campaign both used the way of arms.',
    'Cloud Master and Fire Emperor knew the wind of battle; Yao\'s oath and Tang\'s campaign both took up arms.',
  ],
  s0439: [
    'The star lodged in the Eastern Well—then Xiao and Tong were broken;',
    'When the star lodged in the Eastern Well, Xiao and Tong were broken;',
  ],
  s0440: [
    'thunder shook Nanyang—the first pacification of Xun and Yi.',
    'when thunder shook Nanyang, Xun and Yi were first pacified.',
  ],
  s0441: [
    'Never was there one who shored up the three spirits when they had fallen, rescued the flocking flight of the four seas, majestic and bright, inheriting Heaven\'s punishment—such as the splendor of today.',
    'Never was there one who shored up fallen spirits, rescued the four seas in flight, majestic and bright, inheriting Heaven\'s punishment—such splendor as today.',
  ],
  s0442: [
    'Then auspicious clouds like canopies at dawn lit Yaocun;',
    'Then auspicious clouds like canopies at dawn lit Yao\'s village;',
  ],
  s0443: [
    'sweet dew like pearls at morning graced the scenic palace.',
    'sweet dew like pearls at morning graced the scenic hall.',
  ],
  s0444: [
    'Spirit fungus chambers sensed virtue and all emerged from the bronze pool;',
    'Spirit fungus sensed virtue and all emerged from the bronze pool;',
  ],
  s0445: [
    'the caltrop-leaf plant watched the hours—no need for silver clepsydra rods.',
    'the caltrop-leaf plant marked the hours—no need for silver clepsydra rods.',
  ],
  s0446: [
    'Add that east to Xuantu, west beyond White Wolf, where high willows bring wind and Fusang holds the full sun—none failed to register names among tributary states, send pledges to the Grand Herald Office; distant realms came as guests, near and far alike in blessing.',
    'East to Xuantu, west beyond White Wolf, where high willows bring wind and Fusang holds the full sun—all registered as tributaries, sent pledges to the Grand Herald Office; distant realms came as guests, near and far in one blessing.',
  ],
  s0447: [
    'His civil splendor and martial reverence, root and calyx like that;',
    'His civil splendor and martial reverence, root and calyx entwined;',
  ],
  s0448: [
    'Heaven level, earth complete—his achievement likewise.',
    'Heaven level, earth complete—his achievement the same.',
  ],
  s0449: [
    'Long ago he should have sought historians at the side, consulted the celestial officers, weighed Fanchang, and laid out Gaoyi.',
    'Long ago historians should have been sought at his side, celestial officers consulted, Fanchang weighed, Gaoyi laid out.',
  ],
  s0450: [
    'An imperial prince opens hegemony—no need for the marquis of Yangwu;',
    'An imperial prince opens hegemony—no need for Yangwu\'s marquis;',
  ],
  s0451: [
    'the cleared road needs no worry—why trouble the lodge at Chang\'an?',
    'the cleared road needs no worry—why trouble the lodge at Chang\'an?',
  ],
  s0452: [
    'He should raise the imperial entourage banner to feast the Emperor, look up to the phoenix screen to receive Heaven—the succession is on his person; who could share in yielding!',
    'He should raise the imperial entourage banner to feast the Emperor, look up to the phoenix screen to receive Heaven—the succession is on his person; who could share in yielding!',
  ],
  s0453: [
    'On the twentieth of last month the Acting Regular Cavalry Attendant Liu Hui and others reached Ye; I humbly received the sacred will of modest restraint, governing yet not ruling—or it was said Jingyang was not yet recovered, Tong Pass had no mud, and you would soon turn your carriage to Jinling and then receive Heaven\'s favor.',
    'On the twentieth of last month Acting Regular Cavalry Attendant Liu Hui and others reached Ye; I humbly received the sacred will of modest restraint, governing yet not ruling—or it was said Jingyang was not yet recovered, Tong Pass had no mud, and you would soon turn your carriage to Jinling and receive Heaven\'s favor.',
  ],
  s0454: [
    'I foolishly consider that the Grand Hall and Shaohao had no fixed dwelling;',
    'I foolishly think the Grand Hall and Shaohao had no fixed dwelling;',
  ],
  s0455: [
    'the Han Ancestor and Yin Founder likewise had no permanent house.',
    'the Han Ancestor and Yin Founder likewise had no permanent seat.',
  ],
  s0456: [
    'Mounting Feng on Mount Tai, they still set up the Bright Hall;',
    'Even mounting Feng on Mount Tai, they still set up the Bright Hall;',
  ],
  s0457: [
    'touring Zhangling, they at times exercised the Metropolitan Intendant office.',
    'even touring Zhangling, they at times exercised the Metropolitan Intendant office.',
  ],
  s0458: [
    'Why must one look west to the tiger\'s hold before building the royal palace;',
    'Why look west to the tiger\'s hold before building the royal palace;',
  ],
  s0459: [
    'or south to Ox Head before calling it the celestial gate?',
    'or south to Ox Head before naming the celestial gate?',
  ],
  s0460: [
    'Moreover I have heard: when the black gui was already granted, blue jade was not laid out—this was a missed season for oaken faggots, not failure to offer the bundled thatch.',
    'Moreover I have heard: once the black gui was granted, blue jade went unlaid—this was a missed season for oaken faggots, not failure to offer bundled thatch.',
  ],
  s0461: [
    'The Yunhe zither long lay idle at Sweet Springs;',
    'The Yunhe zither long lay idle at Sweet Springs;',
  ],
  s0462: [
    'the Guzhu pipes had no sound at the square marsh altar.',
    'the Guzhu pipes had not sounded at the square marsh altar.',
  ],
  s0463: [
    'Is one not afraid!',
    'Should one not fear!',
  ],
  s0464: [
    'I humbly pray Your Majesty will follow the hearts of the hundred surnames and rescue the mandate of ten thousand states.',
    'I humbly pray Your Majesty will follow the people\'s hearts and rescue the mandate of ten thousand states.',
  ],
  s0465: [
    'How can you linger in obstinate yielding and go seek the farmer of Stone Door;',
    'How can you linger in obstinate yielding and seek the farmer of Stone Door;',
  ],
  s0466: [
    'loftily decline to rule and merely draw the guest of Mount Ji!',
    'loftily decline to rule and only summon the guest of Mount Ji!',
  ],
  s0467: [
    'One will not know that supreme virtue is without virtue—one will only see that the sage is without humaneness.',
    'One will not know supreme virtue is without virtue—one will only see the sage is without humaneness.',
  ],
  s0468: [
    'All the land cranes upward—what hope have the black-headed people!',
    'All the land cranes upward—what hope remains for the black-headed people!',
  ],
  s0469: [
    'Of old Su Qin and Zhang Yi defied their native towns and bore down on custom, yet still rallied three regions to serve Zhao and asked six states to honor Qin.',
    'Of old Su Qin and Zhang Yi defied hometown and custom, yet still rallied three regions for Zhao and asked six states to honor Qin.',
  ],
  s0470: [
    'How much more we, plainly bearing the imperial radiance, personally receiving the court\'s command—jade tablet and scepter expressly sent, ties opened at Heyang; sable cap and ear-insignia in dignity, alliances traced at Zhang River—we were doubled in our lodgings or lowered with the times, yet gazing toward home, our joy and grief were truly one.',
    'How much more we, plainly bearing the imperial radiance, personally receiving the court\'s command—jade tablet and scepter expressly sent, ties opened at Heyang; sable cap and ear-insignia in dignity, alliances traced at Zhang River—we were doubled in our lodgings or lowered with the times, yet gazing toward home, our joy and grief were truly one.',
  ],
  s0471: [
    'Yet my slight life was ill-fated; my destiny crossed the times.',
    'Yet my slight life was ill-fated; fate crossed the times.',
  ],
  s0472: [
    'I disgracefully rank as a single courier, banished far as the Three Perils.',
    'I disgracefully rank as a lone courier, banished as far as the Three Perils.',
  ],
  s0473: [
    'Granted leisure in the inner hall, I lacked even Geng Yan\'s favor;',
    'Granted leisure in the inner hall, I lacked even Geng Yan\'s grace;',
  ],
  s0474: [
    'sealed memorials at the border fortress, I privately matched Liu Kun\'s weeping.',
    'sealed memorials at the border fortress, I privately echoed Liu Kun\'s weeping.',
  ],
  s0475: [
    'Unable to bear this trifling utmost, I respectfully bow this memorial to inform you.',
    'Unable to bear this trifling utmost, I respectfully submit this memorial.',
  ],
  s0476: [
    'On jiaxu in the ninth month, Minister Over the Masses, General Who Conquers the East, and Yangzhou Inspector Prince Ke of Nanping died.',
    'On jiaxu in the ninth month, Minister Over the Masses, General Who Conquers the East, and Yangzhou inspector Prince Ke of Nanping died.',
  ],
  s0477: [
    'In winter, the tenth month, on yiwei, former Liangzhou Inspector Xiao Xun came from Wei to Jiangling; Xun was made General Who Pacifies the North and Bearer with honors equal to the Three Excellencies.',
    'In winter, the tenth month, on yiwei, former Liangzhou inspector Xiao Xun came from Wei to Jiangling; Xun was made General Who Pacifies the North and Bearer with honors equal to the Three Excellencies.',
  ],
  s0478: [
    'On wushen, Xiangzhou Inspector Wang Lin was seized in the palace; Lin\'s deputy Yin Yan was cast into prison and died.',
    'On wushen, Xiangzhou inspector Wang Lin was seized in the palace; Lin\'s deputy Yin Yan was cast into prison and died.',
  ],
  s0479: [
    'On xinyou, Fanglue was made Xiangzhou Inspector.',
    'On xinyou, Fanglue was made Xiangzhou inspector.',
  ],
  s0480: [
    'On gengxu, Lin\'s Chief Clerk Lu Na and his generals Pan Wulei and others rose in arms, raided and seized Xiangzhou.',
    'On gengxu, Lin\'s chief clerk Lu Na and his generals Pan Wulei and others rose in arms, raided and seized Xiangzhou.',
  ],
  s0481: [
    'That month the regional commanders, princes, and officials of court and field again urged Shizu to take the imperial title; he still modestly yielded and did not consent.',
    'That month commanders, princes, and officials again urged Shizu to take the imperial throne; he still modestly refused.',
  ],
  s0482: [
    'When the memorials came three times, he at last assented.',
    'After three submissions he at last assented.',
  ],
  s0483: [
    'On bingzi in the eleventh month of winter, Chengsheng year 1, Shizu took the imperial throne at Jiangling.',
    'On bingzi in the eleventh month of winter, Chengsheng 1, Shizu took the throne at Jiangling.',
  ],
  s0484: [
    'An edict said: "To plant a ruler over the people is to shepherd the black-headed masses.',
    'An edict said, "To set up a ruler is to shepherd the people.',
  ],
  s0485: [
    'Emperor Yao\'s heart—how could he have prized the yellow canopy? He truly could not refuse, and so came to rule over them.',
    'Emperor Yao\'s heart did not prize the yellow canopy; he truly could not refuse, and so came to rule.',
  ],
  s0486: [
    'Our imperial grandfather the Literary Emperor accumulated virtue in Qi and Liang; his transforming influence ran through the rivers Han; his Way shone in the fields, and all looked up to him.',
    'Our imperial grandfather the Literary Emperor accumulated virtue in Qi and Liang; his transforming influence ran through the Jiang and Han; his Way shone in the fields and all looked to him.',
  ],
  s0487: [
    'Our imperial father Gaozu the Martial Emperor made his brightness equal sun and moon, his merit reach the realms; he followed Heaven and the people; only the sagely could act.',
    'Our imperial father Gaozu the Martial Emperor matched sun and moon, his merit reaching the realms; he followed Heaven and the people with sagely judgment.',
  ],
  s0488: [
    'Taizong Jianwen the Emperor matched Qi and Song, was patterned on Wen and Jing.',
    'Taizong Jianwen matched Qi and Song, was patterned on Wen and Jing.',
  ],
  s0489: [
    'The Jie bandit leaned on force; the time\'s hardship was extreme.',
    'The Jie invader leaned on arms; the age\'s hardship was extreme.',
  ],
  s0490: [
    'We greatly rescued the drifting current and recovered the ancestral altars.',
    'We greatly rescued the drifting flood and recovered the ancestral altars.',
  ],
  s0491: [
    'All the dukes and officials, the hundred offices and the multitude, alike hold that the imperial spirit favors the mandate and the fortune has arrived—the Heavenly mandate cannot long be delayed, the imperial pole cannot long stand vacant.',
    'All dukes, officials, and the hundred bureaus hold that the imperial spirit favors the mandate and fortune has arrived—Heaven\'s mandate cannot long be delayed, the throne cannot long stand empty.',
  ],
  s0492: [
    'Looking to the former records and the statutes and models, in awe of Heaven\'s might we count the lofty calendar and with it gather the sacred vessel on this lone person.',
    'Looking to former records and statute models, in awe of Heaven\'s might we count the lofty calendar and gather the sacred vessel on this lone person.',
  ],
  s0493: [
    'Of old Yu, Xia, Shang, and Zhou had no fine era names; Han, Wei, Jin, and Song followed along for long.',
    'Of old Yu, Xia, Shang, and Zhou had no fine era names; Han, Wei, Jin, and Song followed along a long while.',
  ],
  s0494: [
    'Although we speak of quelling disorder, it is not founding anew; we think to link above to the ancestral shrine and below to bless the hundred millions.',
    'Though we speak of quelling disorder, it is not founding anew; we seek to link above to the ancestral shrine and below to bless the hundred millions.',
  ],
  s0495: [
    'Taiqing year 6 may be changed to Chengsheng year 1.',
    'Taiqing 6 may be changed to Chengsheng 1.',
  ],
  s0496: [
    'Arrears of rent and old debts may all be broadened in remission;',
    'Arrears of rent and old debts may all be remitted broadly;',
  ],
  s0497: [
    'filial sons and righteous grandsons may all be granted noble rank;',
    'filial sons and righteous grandsons may all receive noble rank;',
  ],
  s0498: [
    'long-term convicts in chains may specially receive pardon;',
    'long-term convicts in chains may specially be pardoned;',
  ],
  s0499: [
    'forbidden-service penalties and labor seizure may all be wholly cleared.',
    'forbidden-service penalties and seized labor may all be wholly cleared.',
  ],
  s0500: [
    '" That day Shizu did not ascend the main hall—only the dukes and officials stood in attendance.',
    '" That day Shizu did not ascend the main hall; only the dukes and officials stood in attendance.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_005_b5.mjs <translation.json>'
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
