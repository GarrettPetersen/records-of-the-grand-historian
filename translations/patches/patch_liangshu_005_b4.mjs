#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'War boats moved at night like a sea in full flood.',
    'At night the war boats stirred like the ocean rushing in flood.',
  ],
  s0302: [
    'Count their fellow villains—they do not fill one brigade.',
    'Counting their accomplices, they scarcely make a single brigade.',
  ],
  s0303: [
    'The gentleman stands apart in the wilds; petty men huddle in factions.',
    'The gentleman is in the wilds; petty men band together.',
  ],
  s0304: [
    'His fetters will be struck away—not a matter of one morning or one evening.',
    'The shackles will come off his ears—not a question of tomorrow or the day after.',
  ],
  s0305: [
    'We shall pound the throat of the Long Di and bind the neck of Zhizhi.',
    'We will crush the Long Di\'s throat and tie the neck of Zhizhi.',
  ],
  s0306: [
    'Now the Minister of Crime clarifies punishment; the execution block awaits—only Hou Jing need be put to death.',
    'Now the minister of crime has made the penalty clear; the block awaits—only Hou Jing is to be executed.',
  ],
  s0307: [
    'What crime have the common people? None shall be questioned.',
    'What guilt have the black-headed people? None will be questioned.',
  ],
  s0308: [
    'You gentlemen may for generations have planted loyalty, borne favor and rank on your shoulders, stood as feathered ornaments of great clans, and had your deeds written in the royal house—yet bowing to that knave you could not serve; can you not feel shame before the yellow springs below and before Heaven above!',
    'Some of you have borne loyalty for generations, carried favor and rank, stood among the great clans, and had your deeds recorded in the royal house—yet you bowed to that knave and could not serve. Are you not ashamed before the dead below and Heaven above!',
  ],
  s0309: [
    'Without loyalty and righteousness one cannot stand alone.',
    'Lose loyalty and righteousness and you cannot stand on your own.',
  ],
  s0310: [
    'Trust in the southern wind, turn your gaze westward, turn change into merit and disaster into fortune.',
    'Trust the southern wind, look west again, turn change into merit and misfortune into blessing.',
  ],
  s0311: [
    'Whoever binds Hou Jing and sends his head shall be enfeoffed as Duke with a fief of ten thousand households and receive fifty thousand bolts of silk and cloth.',
    'Whoever captures Hou Jing and delivers his head shall receive a fief of ten thousand households as founding duke and fifty thousand bolts of silk and cloth.',
  ],
  s0312: [
    'Whoever can rouse righteous hosts to answer the imperial armies, hold cities and not serve the rebels—the highest reward is that of a regional lord, the lowest a split tally; all may receive fiefs and the blue-and-purple sash.',
    'Whoever can rally righteous forces to join the imperial armies, hold cities and refuse the rebels—the highest reward is that of a regional lord, the lowest a split tally; all may receive fiefs and the purple sash.',
  ],
  s0313: [
    'In old times You Yu entered Qin and was treated like a chief minister;',
    'Long ago You Yu entered Qin and was honored like a chief minister;',
  ],
  s0314: [
    'Rizhu submitted to Han and still wore the golden sable.',
    'Jin Midi surrendered to Han and still wore the golden sable.',
  ],
  s0315: [
    'If a man has talent, why worry that he lacks a post?',
    'If there is talent, why fear there is no office?',
  ],
  s0316: [
    'If you cling to delusion and will not turn back, resisting the royal armies—when the great host arrives, punishment will know no pardon.',
    'If you persist in delusion and resist the royal armies, when the great host arrives punishment will know no pardon.',
  ],
  s0317: [
    'When Mengzhu burned, mugwort and artemisia perished together;',
    'When Mengzhu burned, mugwort and artemisia were consumed together;',
  ],
  s0318: [
    'when the Xuanfang River burst, jade and common stone sank as one.',
    'when the Xuanfang River broke, jade and stone sank together.',
  ],
  s0319: [
    'The statute of faithful reward is bright as the noon sun;',
    'The statute of faithful reward is bright as the noonday sun;',
  ],
  s0320: [
    'the rule of demotion and promotion is equal to the clarity of Baishui.',
    'the rule of demotion and promotion matches the clarity of Baishui.',
  ],
  s0321: [
    'Let this proclamation be sent far and near so that all may know.',
    'Let this proclamation go far and near so all may know.',
  ],
  s0322: [
    'In the third month Wang Sengbian and others pacified Hou Jing and sent his head to Jiangling.',
    'In the third month Wang Sengbian and others destroyed Hou Jing and forwarded his head to Jiangling.',
  ],
  s0323: [
    'On wuzi the victory over the rebels was reported to the Bright Hall and the Grand Soil altar.',
    'On wuzi day the victory over the rebels was reported to the Bright Hall and the Grand Soil altar.',
  ],
  s0324: [
    'On jichou Wang Sengbian and others again submitted a memorial, saying:',
    'On jichou Wang Sengbian and others again submitted a memorial, saying,',
  ],
  s0325: [
    'The armies on this day, wuzi, assembled at Jiankang.',
    'The armies assembled at Jiankang on this day, wuzi.',
  ],
  s0326: [
    'The rebel Jing, like a bird in a hole or a beast at bay, was struck again and again; his treachery and deceit were exhausted, and he dug deep trenches to hold fast.',
    'The rebel Jing, bird crouched and beast cornered, was struck again and again; treachery and deceit exhausted, he dug deep trenches to hold out.',
  ],
  s0327: [
    'Your servants divided and led the martial hosts; a hundred roads converged at once; swift cavalry and short blades, rhinoceros-hide shields and iron pavises, ranks in thousands, spears in millions—we halted the tyrant within seven paces and ringed Xiang in three folds; with a thunderous collapse the mass of villains was extinguished.',
    'We divided the martial hosts; a hundred roads converged; swift horse and short blade, rhinoceros shield and iron pavis, ranks in thousands, spears in millions—we held the tyrant within seven paces and ringed Xiang in three folds; with a thunderous rout the villains were destroyed.',
  ],
  s0328: [
    'Young and old in the capital all cried ten thousand years.',
    'Young and old in the capital all shouted ten thousand years.',
  ],
  s0329: [
    'Food and drink in Chang\'an—here the price runs high.',
    'Chang\'an\'s food and drink—here the price is high.',
  ],
  s0330: [
    'The nine districts opened like clouds; the six realms grew clear and bright—how much more the black-headed people; who would not leap for joy!',
    'The nine districts opened like clouds; the six realms grew clear—how much more the common people; who would not leap for joy!',
  ],
  s0331: [
    'We humbly consider that Your Majesty chews grief and swallows sorrow, bears infant rage and endures cruelty.',
    'We consider that Your Majesty chews grief and swallows sorrow, bears rage and endures cruelty.',
  ],
  s0332: [
    'Since dust rose at the crimson court and purple gates, since ramparts and Haozhi were trampled and Ji horses clouded the land, you have wept blood while arming the hosts and tasted gall while swearing the masses.',
    'Since dust rose at the crimson court and purple gates, since ramparts and Haozhi were overrun and Ji horses clouded the land, you have wept blood while arming troops and tasted gall while swearing the masses.',
  ],
  s0333: [
    'Wu and Chu were one house, yet rose with the seven states;',
    'Wu and Chu were one house, yet they rose with the seven states;',
  ],
  s0334: [
    'Guan and Cai spread slander, yet the three overseers also rebelled.',
    'Guan and Cai spread slander, and the three overseers rebelled as well.',
  ],
  s0335: [
    'Righteous hosts of Western Liang were blocked by strong Qin and could not pass;',
    'The righteous hosts of Western Liang were blocked by strong Qin and could not pass;',
  ],
  s0336: [
    'survivors of Bing province crossed Flying Fox and were lost to sight.',
    'the survivors of Bing province crossed Flying Fox and vanished.',
  ],
  s0337: [
    'Wolves and jackals held the road—not one man alone;',
    'Wolves and jackals blocked the road—and not by one man alone;',
  ],
  s0338: [
    'the whale and leviathan were not beheaded, and suddenly five years had passed.',
    'the whale and leviathan were not beheaded, and in a flash five years had passed.',
  ],
  s0339: [
    'Heroic martial power has quelled the realm; grievance and shame are both washed white—yet to follow the frost and dew, how can words suffice!',
    'Heroic power has stirred; grievance and shame are both snowed under—yet to follow frost and dew, what words can tell it!',
  ],
  s0340: [
    'Your servants have therefore followed the old precedent, reverently repaired the altars of soil and grain, and sent envoys with credentials to announce at each tomb and mound.',
    'We have therefore followed the old precedent, reverently repaired the altars of soil and grain, and sent envoys with credentials to announce at each tomb and mound.',
  ],
  s0341: [
    'The late empress has ascended; the dragon carriage is not yet interred; the Eastern Palace light is veiled; the cedar palace cannot be found—all are being prepared as the route allows, the rites complete even in bitter famine.',
    'The late empress has ascended; the dragon carriage is not yet buried; the Eastern Palace light is hidden; the cedar palace cannot be found—all are being prepared along the route, the rites complete even in bitter famine.',
  ],
  s0342: [
    'The four seas mourn together; the six armies bare their shoulders and weep—Your Majesty\'s filial feeling and brotherly love should rightly stir deep grief.',
    'All within the seas mourn together; the six armies bare their shoulders and weep—Your Majesty\'s filial heart and brotherly love should rightly move you to anguish.',
  ],
  s0343: [
    'Recently the hundred offices and mountain governors have looked up, praying for Your Majesty\'s clear regard.',
    'Of late the hundred offices and mountain governors have looked up, praying for Your Majesty\'s clear gaze.',
  ],
  s0344: [
    'The merit of granting the jade tally has already returned to the one who holds the Way; the rite of receiving the royal tablet belongs rightly to the sage and bright—',
    'The merit of granting the jade tally has already returned to the holder of the Way; the rite of receiving the royal tablet rightly belongs to the sage and bright—',
  ],
  s0345: [
    'yet Your gracious edict is humble and restrained, remote and still.',
    'yet Your gracious edict remains humble and restrained, remote and still.',
  ],
  s0346: [
    'The flying dragon may ascend, yet the Qian hexagram still stands in the fourth place;',
    'The flying dragon may ascend, yet the Qian line still stands in the fourth place;',
  ],
  s0347: [
    'the Gate of Heaven cries out, yet the great portal is not yet opened.',
    'the Gate of Heaven clamors, yet the great portal has not opened.',
  ],
  s0348: [
    'Ballads race forth again—therefore we crane our necks.',
    'Ballads race forth again—therefore we stretch our necks in hope.',
  ],
  s0349: [
    'Thus the men of Yue held fast, smoking the cinnabar cave to seek their lord;',
    'Thus the men of Yue held fast, smoking the cinnabar cave to seek a lord;',
  ],
  s0350: [
    'the people of Zhou rejoiced in pushing him forward, explaining at Mount Qi that they would serve him as lord.',
    'the people of Zhou rejoiced in urging him on, explaining at Mount Qi that they would serve him as lord.',
  ],
  s0351: [
    'If the King of Han did not take the throne, he could not honor his meritorious ministers;',
    'If the King of Han did not take the throne, he could not exalt his meritorious ministers;',
  ],
  s0352: [
    'if Guangwu had halted the Prince of Xiao, how could he have continued the ancestral temple?',
    'if Guangwu had halted the Prince of Xiao, how could the ancestral temple have endured?',
  ],
  s0353: [
    'The Yellow Emperor wandered at Xiangcheng yet still sought how to govern the people;',
    'The Yellow Emperor wandered at Xiangcheng yet still sought the way to govern the people;',
  ],
  s0354: [
    'Emperor Yao entered Guye yet still kept feast and sacrifice in their place.',
    'Emperor Yao entered Guye yet still kept feast and sacrifice in their proper place.',
  ],
  s0355: [
    'Such chance arrival—surely not what the sage desired; what emperor and king should do, they do only when they cannot refuse.',
    'Such chance arrival—surely not what the sage desired; what emperors and kings must do, they do only when they cannot refuse.',
  ],
  s0356: [
    'We have read the imperial letter and traced the decree\'s intent—you still dwell beyond affairs and have not yet offered your compassionate heart.',
    'We have read the imperial letter and traced the decree\'s intent—you still dwell beyond affairs and have not yet turned your compassionate heart to us.',
  ],
  s0357: [
    'Your Majesty\'s sun-horn and dragon-brow were shown on the day you went forth in equal measure; the omen of crimson cloud and plain vapor was rooted from the first response to things.',
    'Your Majesty\'s sun-horn and dragon-brow appeared on the day you went forth in equal measure; the omen of crimson cloud and plain vapor took root from your first response to things.',
  ],
  s0358: [
    'In broad reading there is nothing with which to name your greatness; in deep speech your brilliance shines like the manifest hall.',
    'Read broadly and your greatness has no name; speak deeply and your brilliance shines like the manifest hall.',
  ],
  s0359: [
    'Loyalty is the foremost virtue; filial piety truly moves Heaven.',
    'Loyalty is the foremost virtue; filial piety truly stirs Heaven.',
  ],
  s0360: [
    'Add heroic might and abundant strategy, bold design and martial calculation—at a gesture Dan Ford needs no battle; at a glance Banquan stirs of itself.',
    'Add heroic might and abundant strategy, bold design and martial calculation—at a gesture Dan Ford needs no battle; at a glance Banquan moves of itself.',
  ],
  s0361: [
    'The earth\'s cord broke and was tied again; the heaven\'s pillar tilted and was set upright anew.',
    'The earth\'s cord snapped and was knotted again; the heaven\'s pillar leaned and was planted upright once more.',
  ],
  s0362: [
    'The river ford at Meng Gate was cut open and the hundred streams flowed again;',
    'The river ford at Meng Gate was opened and the hundred streams ran again;',
  ],
  s0363: [
    'the dome of heaven was patched with five stones and the myriad things lived again.',
    'the dome of heaven was mended with five stones and the myriad things were born again.',
  ],
  s0364: [
    'Even if Your Majesty brushed the plain robe and wandered at Guangcheng, climbed Mount Yan and went east—how could your ministers raise complaint, where would the masses turn for benevolence?',
    'Even if Your Majesty brushed the plain robe and wandered at Guangcheng, climbed Mount Yan and went east—how could your ministers plead, where would the masses turn for grace?',
  ],
  s0365: [
    'Moreover, suburban sacrifice paired with Heaven, the ritual vessels of the altar stand empty; the pure palace and clear temple lack pipe and bamboo—gazing up for the imperial carriage, not one morning or one evening; looking for the law chariot, parched and hungry together.',
    'Moreover, suburban sacrifice paired with Heaven, the altar vessels stand empty; the pure palace and clear temple lack pipe and bamboo—gazing up for the imperial carriage, not one morning or one evening; looking for the law chariot, thirsty and hungry together.',
  ],
  s0366: [
    'How can you long delay the multitude\'s counsel and leave the constant statutes vacant!',
    'How can you long delay the multitude\'s counsel and leave the constant statutes empty!',
  ],
  s0367: [
    'The old suburban rites are restored; Hangu and Luoyang are already pacified.',
    'The old suburban rites have returned; Hangu and Luoyang are already pacified.',
  ],
  s0368: [
    'Gaonu and Liyang—the palaces and lodges though ruined;',
    'Gaonu and Liyang—palaces and lodges though ruined;',
  ],
  s0369: [
    'the muddy Yellow River and clear Wei still hold their auspicious breath.',
    'the muddy Yellow River and clear Wei still breathe their auspicious air.',
  ],
  s0370: [
    'The outer gate stands tall; sweet springs open on four sides; the earth rod measures the shadow; the immortal receives dew.',
    'The outer gate stands high; sweet springs open on four sides; the earth rod measures the shadow; the immortal receives dew.',
  ],
  s0371: [
    'This is the red county of the nine provinces, the pivot of the six realms.',
    'This is the red county of the nine provinces, the hinge of the six realms.',
  ],
  s0372: [
    'Erudites carry the books and charts back little by little; the Grand Master of Ceremonies has already set the rites in order.',
    'Erudites bear the books and charts back by degrees; the Grand Master of Ceremonies has already set the rites in order.',
  ],
  s0373: [
    'How can you fail to raise the clear carriage and go to the famed capital, fit out the jade chariot and enter the proper palace!',
    'How can you fail to raise the clear carriage and go to the famed capital, fit the jade chariot and enter the proper palace!',
  ],
  s0374: [
    'In old times when the Eastern Zhou moved east, Haojing was never recovered;',
    'In old times when the Eastern Zhou moved east, Haojing was never regained;',
  ],
  s0375: [
    'after one turmoil at Chang\'an, Xie and Luo were forever taken as the seat.',
    'after one turmoil at Chang\'an, Xie and Luo were forever made the seat.',
  ],
  s0376: [
    'The Xia sovereign received the ten thousand states when the feudal lords came to court; King Wen with six provinces set the realm right.',
    'The Xia sovereign received the ten thousand states when the feudal lords came to court; King Wen with six provinces set the realm aright.',
  ],
  s0377: [
    'His trace was rooted in a hundred li; his sword staff was three feet.',
    'His trace was rooted in a hundred li; his sword staff measured three feet.',
  ],
  s0378: [
    'With the remnant land of Chu he resisted the nine barbarians;',
    'With the remnant lands of Chu he resisted the nine barbarians;',
  ],
  s0379: [
    'with one brigade he cut down three rebellions.',
    'with a single brigade he cut down three rebellions.',
  ],
  s0380: [
    'The realm was broadly settled; the imperial carriage turned east.',
    'The realm was broadly settled; the imperial carriage returned east.',
  ],
  s0381: [
    'He unyoked five oxen at Jizhou and fed six horses at Qiao commandery.',
    'He unyoked five oxen at Jizhou and fed six horses at Qiao commandery.',
  ],
  s0382: [
    'Looking far back through antiquity—can such a thing be found?',
    'Search far back through antiquity—can such a thing be found?',
  ],
  s0383: [
    'To answer and spread Heaven\'s mandate—what virtue is there to yield!',
    'To answer and spread Heaven\'s mandate—what virtue remains to yield!',
  ],
  s0384: [
    'Reason stands here; we venture to press our memorial again.',
    'Reason stands here; we dare press our memorial again.',
  ],
  s0385: [
    'The Chancellor replied: "I have reviewed your memorial and set out the points again.',
    'The Chancellor replied, "I have reviewed your memorial and set out the points again.',
  ],
  s0386: [
    'The lords and ministers, the hundred million common people—all hold that Heaven favors the mandate and the turn of fortune belongs here, gathering the precious throne upon this one man alone.',
    'Lords and ministers, the hundred million common people—all hold that Heaven favors the mandate and fortune\'s turn belongs here, gathering the precious throne upon this one man alone.',
  ],
  s0387: [
    'Wen Shu\'s office as golden guard matched the old wish;',
    'Wen Shu\'s post as golden guard matched the old wish;',
  ],
  s0388: [
    'Mengde\'s post as western campaigner likewise fits the earlier word.',
    'Mengde\'s western campaign post likewise fits the earlier word.',
  ],
  s0389: [
    'Now the long whale of Huai and sea has indeed surrendered his head;',
    'Now the long whale of Huai and sea has indeed lost his head;',
  ],
  s0390: [
    'the short fox of Xiangyang has not yet fully changed his face.',
    'the short fox of Xiangyang has not yet fully turned his face.',
  ],
  s0391: [
    'The jade candle of great peace—only then may it be discussed."',
    'The jade candle of great peace—only then may we speak of it."',
  ],
  s0392: [
    'On xinmao, Fierce Campaign General Zhu Maichen secretly killed Heir Prince Dong of Yuzhang and his two younger brothers Qiao and Jiao—per Shizu\'s intent.',
    'On xinmao, Fierce Campaign General Zhu Maichen secretly killed Heir Prince Dong of Yuzhang and his younger brothers Qiao and Jiao—by Shizu\'s design.',
  ],
  s0393: [
    'On gengwu in the fifth month, Minister of Works Prince Ke of Nanping, the imperial clan princes, and Grand Commander Wang Sengbian again presented a memorial offering the exalted title; Shizu still firmly declined.',
    'On gengwu in the fifth month, Minister of Works Prince Ke of Nanping, the imperial clan princes, and Grand Commander Wang Sengbian again offered the exalted title; Shizu still firmly refused.',
  ],
  s0394: [
    'On gengchen, Heir Prince Ke of Nanping, Bearer of the Staff for Pacifying the South, Xiangzhou Inspector, and Minister of Works, was made General Who Pacifies the East and Yangzhou Inspector; the rest unchanged.',
    'On gengchen, Heir Prince Ke of Nanping, Bearer of the Staff for Pacifying the South, Xiangzhou inspector, and Minister of Works, was made General Who Pacifies the East and Yangzhou inspector; the rest unchanged.',
  ],
  s0395: [
    'On jiashen, Director of the Masters of Writing, General Who Conquers the East, Bearer with honors equal to the Three Excellencies, and Jiangzhou Inspector Wang Sengbian was made Minister Over the Masses and General Who Guards the Realm.',
    'On jiashen, Director of the Masters of Writing, General Who Conquers the East, Bearer with honors equal to the Three Excellencies, and Jiangzhou inspector Wang Sengbian was made Minister Over the Masses and General Who Guards the Realm.',
  ],
  s0396: [
    'On yiyou, the rebel Left Vice Director Wang Wei, Master of Writing Lü Jilue, Junior Minister Zhou Shizhen, and Attendant Yan Dan were beheaded in the Jiangling market.',
    'On yiyou, the rebel Left Vice Director Wang Wei, Master of Writing Lü Jilue, Junior Minister Zhou Shizhen, and Attendant Yan Dan were executed in the Jiangling market.',
  ],
  s0397: [
    'That day Shizu issued an order: "The gentleman pardons offenses—this is set forth in the Zhou canon;',
    'That day Shizu issued an order, "The gentleman pardons offenses—this is set forth in the Zhou canon;',
  ],
  s0398: [
    'the sage loosens the net—this is heard in Tang\'s charge.',
    'the sage loosens the net—we hear it in Tang\'s charge.',
  ],
  s0399: [
    'Since the Xianyun burned fiercely and the long serpent fed and fed, the red land tottered on the brink and the black-headed people were smeared with charcoal—I could not sleep all night, my will set on washing away disgrace.',
    'Since the Xianyun burned fiercely and the long serpent fed and fed, the red land tottered and the black-headed people were smeared with charcoal—I could not sleep all night, my will fixed on washing away disgrace.',
  ],
  s0400: [
    'The chief villain who delayed punishment was none other than Hou Jing;',
    'The chief villain long overdue for punishment was Hou Jing alone;',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_005_b4.mjs <translation.json>'
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
