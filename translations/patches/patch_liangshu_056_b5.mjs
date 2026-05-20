#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'Today meeting Lord Xiao makes one quail of oneself—is this not an inviolable heavenly majesty?',
    'Today, meeting Lord Xiao, I felt myself shrink with awe. Is that not majesty Heaven itself makes untouchable?',
  ],
  s0402: [
    'I cannot meet him again.',
    'I cannot face him again.',
  ],
  s0403: [
    '" Gaozu, though outwardly he had submitted, still harbored wrath within; whenever matters were reported he often sent them back with reprimands.',
    '" Gaozu had bowed in appearance, but rage still burned in him. Memorial after memorial came up; he rejected most with sharp rebuke.',
  ],
  s0404: [
    'Jing deeply respected and feared him, and also did not dare press hard.',
    'Jing held him in deep awe and did not dare push further.',
  ],
  s0405: [
    'Jing sent soldiers straight into the Palace Secretariat; Gaozu asked Director of the Bureau of Manufactures Zhou Shizhen: "What sort of people are these?"',
    'Jing posted soldiers inside the Palace Secretariat. Gaozu asked Zhou Shizhen, director of the bureau of manufactures, "What sort of men are these?"',
  ],
  s0406: [
    'He answered: "The Chancellor."',
    'He answered, "The chancellor."',
  ],
  s0407: [
    'Gaozu then pretended confusion: "What sort of chancellor?"',
    'Gaozu feigned ignorance. "What chancellor?"',
  ],
  s0408: [
    'He answered: "It is Chancellor Hou."',
    'He answered, "Chancellor Hou."',
  ],
  s0409: [
    'Gaozu angrily said: "His name is Jing—why call him chancellor!"',
    'Gaozu flared. "His name is Jing. Why call him chancellor!"',
  ],
  s0410: [
    '" After that, every request mostly failed to please; even the imperial meals were cut back, and he finally fell ill from grief and anger and died.',
    '" After that Jing\'s every demand missed the mark. Even the imperial table was pared back. Gaozu sickened from grief and rage, and died.',
  ],
  s0411: [
    'Jing then secretly withheld announcement of death; the coffin was provisionally placed in Zhaoyang Hall, and outside the palace none of civil or military officers knew.',
    'Jing kept the death secret. The coffin lay provisionally in Zhaoyang Hall, and outside the palace no civil or military officer knew.',
  ],
  s0412: [
    'After more than twenty days, the imperial coffin was raised to the front hall of Taiji and the crown prince was welcomed to ascend the throne.',
    'After more than twenty days the imperial coffin was moved to the front hall of Taiji, and the crown prince was brought forward to take the throne.',
  ],
  s0413: [
    'Thereupon a forged edict pardoned northerners held as slave servants, hoping to gather their strength for use.',
    'A forged edict then freed northerners held as slaves and servants, hoping to win their labor and arms.',
  ],
  s0414: [
    'He also sent Yitong Lai Liang to lead troops attacking Xuancheng; Xuancheng Administrator Yang Hua lured Liang and had him beheaded;',
    'He also sent Yitong Lai Liang against Xuancheng. Xuancheng administrator Yang Hua lured Liang in and had him killed.',
  ],
  s0415: [
    'Jing again sent his general Li Xianming to attack Hua; Hua surrendered the commandery.',
    'Jing sent his general Li Xianming against Hua, and Hua surrendered the commandery.',
  ],
  s0416: [
    'Jing sent Yitong Song Zixian and others leading troops east to camp at Qiantang; Xincheng garrison commander Dai Shengyi held the county and resisted.',
    'Jing sent Yitong Song Zixian and others east to Qiantang. Xincheng garrison commander Dai Shengyi held the county and blocked them.',
  ],
  s0417: [
    'That month Jing sent Central Army Hou Zijian into the Wu armies, captured Yu Ziyue and Zhang Dahei, returned to the capital and executed them.',
    'That month Jing sent Central Army Hou Zijian into the Wu forces, seized Yu Ziyue and Zhang Dahei, returned to the capital, and executed them.',
  ],
  s0418: [
    'At the time East Yangzhou Inspector Prince of Lincheng Dalian held the province, Wuxing Administrator Zhang Song held the commandery; from Nanling upstream all held and defended separately.',
    'East Yangzhou inspector Prince of Lincheng Dalian held the province. Wuxing administrator Zhang Song held the commandery. From Nanling upstream each stronghold held its own ground.',
  ],
  s0419: [
    'Jing\'s orders could reach only west of Wu commandery and north of Nanling.',
    'Jing\'s commands ran only west of Wu commandery and north of Nanling.',
  ],
  s0420: [
    'Sixth month: Jing made Yitong Guo Yuanjian Vice Director of the Masters of Writing, Northern Route Mobile Headquarters, overall command of Jiangbei military affairs, garrisoning at Xinqin.',
    'In the sixth month Jing made Yitong Guo Yuanjian vice director of the Masters of Writing, northern route mobile headquarters, and commander of all Jiangbei forces, garrisoning Xinqin.',
  ],
  s0421: [
    'Commandery men Lu Ji, Dai Wenju and others raised troops of over ten thousand, killed Jing\'s administrator Su Chanyu, and pushed former Huainan Administrator Wen-cheng Marquis Ning as leader to resist Jing.',
    'Lu Ji, Dai Wenju, and others in the commandery raised more than ten thousand men, killed Jing\'s administrator Su Chanyu, and set up former Huainan administrator Wen-cheng Marquis Ning to resist Jing.',
  ],
  s0422: [
    'Song Zixian heard and attacked; Ji and the others abandoned the city and fled.',
    'Song Zixian heard and struck. Ji and the rest abandoned the city and fled.',
  ],
  s0423: [
    'Jing then separated Wu commandery\'s Haiyan and Xupu two counties into Wuyuan commandery.',
    'Jing then split Haiyan and Xupu of Wu commandery into Wuyuan commandery.',
  ],
  s0424: [
    'By then Jing killed Xiao Zhengde at Yongfu Office.',
    'By then Jing killed Xiao Zhengde in Yongfu Office.',
  ],
  s0425: [
    'He enfeoffed Yuan Luo as Prince of Western Qin, Yuan Jinglong as Prince of Chenliu; over ten Yuan clan youths were enfeoffed as princes.',
    'He enfeoffed Yuan Luo as Prince of Western Qin and Yuan Jinglong as Prince of Chenliu; more than ten Yuan clansmen received princely titles.',
  ],
  s0426: [
    'He made Liu Jingli Bearer of the Staff and Grand Commander, subordinate to the Grand Chancellor, participating in military affairs.',
    'He made Liu Jingli bearer of the staff and grand commander under the Grand Chancellor, to share in military affairs.',
  ],
  s0427: [
    'Jing sent his Central Army Hou Zijian to supervise Mobile Headquarters Liu Shenmao\'s army on eastern campaign; they broke Wuxing, seized Administrator Zhang Song father and son and sent them to the capital; Jing had them all killed.',
    'Jing sent Central Army Hou Zijian to oversee mobile headquarters Liu Shenmao\'s eastern campaign. They broke Wuxing, seized administrator Zhang Song and his son, sent them to the capital, and Jing had them all killed.',
  ],
  s0428: [
    'Jing made Song Zixian Minister of Works, Ren Yue General of the Garrison Army; Erzhu Jibo, Chiluo Zitong, Peng Jun, Dong Shaoxian, Zhang Huaren, Yu Qing, Lu Bohe, Hexi Jin, Shi Anhe, Shi Linghu, and Liu Guiyi—all made Opened-Office Yitong of the Three Dukes.',
    'Jing made Song Zixian minister of works and Ren Yue general of the garrison army. Erzhu Jibo, Chiluo Zitong, Peng Jun, Dong Shaoxian, Zhang Huaren, Yu Qing, Lu Bohe, Hexi Jin, Shi Anhe, Shi Linghu, and Liu Guiyi were all made opened-office yitong of the three dukes.',
  ],
  s0429: [
    'That month Prince of Poyang successor Fan led troops to Zankou; Jiangzhou Inspector Prince of Xunyang Daxin invited him westward.',
    'That month Prince of Poyang successor Fan led troops to Zankou, and Jiangzhou inspector Prince of Xunyang Daxin asked him to come west.',
  ],
  s0430: [
    'Jing moved out and encamped at Gushu; Fan\'s generals Pei Zhi and Xiahou Weisheng surrendered their forces to Jing.',
    'Jing moved out and encamped at Gushu. Fan\'s generals Pei Zhi and Xiahou Weisheng surrendered with their troops to Jing.',
  ],
  s0431: [
    'Eleventh month: Song Zixian attacked Qiantang; Dai Shengyi surrendered.',
    'In the eleventh month Song Zixian attacked Qiantang, and Dai Shengyi surrendered.',
  ],
  s0432: [
    'Jing made Qiantang Linjiang commandery and Fuyang Fuchun commandery.',
    'Jing made Qiantang into Linjiang commandery and Fuyang into Fuchun commandery.',
  ],
  s0433: [
    'Wang Wei and Yuan Luo were also made Opened-Office Yitong of the Three Dukes.',
    'Wang Wei and Yuan Luo were also made opened-office yitong of the three dukes.',
  ],
  s0434: [
    'Twelfth month: Song Zixian, Zhao Bochao, and Liu Shenmao advanced to attack Kuaiji; East Yangzhou Inspector Prince of Lincheng Dalian abandoned the city and fled; Liu Shenmao was sent to pursue and capture him.',
    'In the twelfth month Song Zixian, Zhao Bochao, and Liu Shenmao attacked Kuaiji. East Yangzhou inspector Prince of Lincheng Dalian abandoned the city and fled; Liu Shenmao was sent in pursuit and captured him.',
  ],
  s0435: [
    'Jing made Pei Zhi Bearer of the Staff, Pacification West General, and Hefei Inspector; Xiahou Weisheng Bearer of the Staff, Pacification North General, and South Yuzhou Inspector.',
    'Jing made Pei Zhi bearer of the staff, Pacification West General, and Hefei inspector, and Xiahou Weisheng bearer of the staff, Pacification North General, and South Yuzhou inspector.',
  ],
  s0436: [
    'That month Baekje envoys arrived; seeing the cities in ruins they wept outside the Main Gate, and passersby all wept.',
    'That month Baekje envoys arrived. Seeing the cities in ruins, they wailed outside the Main Gate, and every passerby wept.',
  ],
  s0437: [
    'Jing heard and was greatly enraged; he sent them to Minor Zhuangyan Temple under house arrest, forbidden to go in or out.',
    'Jing heard and was furious. He sent them to Minor Zhuangyan Temple under confinement, forbidden to enter or leave.',
  ],
  s0438: [
    'First month of first year of Dabao: Jing forged an edict adding forty sword-bearers to his entourage, granting front and rear guard feather-canopies and martial music, and appointing four Left and Right Chief Clerks and Attending Cadres.',
    'In the first month of Dabao year one Jing forged an edict adding forty sword-bearers, granting front and rear guard feather-canopies and martial music, and appointing four left and right chief clerks and attending cadres.',
  ],
  s0439: [
    'Former Jiangdu Magistrate Zu Hao raised troops at Guangling, beheaded Jing\'s inspector Dong Shaoxian, and pushed former Crown Prince House Steward Xiao Min as inspector;',
    'Former Jiangdu magistrate Zu Hao raised troops at Guangling, killed Jing\'s inspector Dong Shaoxian, and set up former crown prince house steward Xiao Min as inspector.',
  ],
  s0440: [
    'He also allied with Wei people as allies, sent proclamations far and near, intending to attack Jing.',
    'He also sought Wei allies, sent proclamations far and wide, and prepared to march against Jing.',
  ],
  s0441: [
    'Jing heard and was greatly afraid; that same day he led Hou Zijian and others out from Jingkou, land and water forces gathering together.',
    'Jing heard and was terrified. That same day he led Hou Zijian and others out from Jingkou, land and river forces massing together.',
  ],
  s0442: [
    'Hao closed the city and resisted; Jing attacked the city and took it.',
    'Hao shut the city and held out. Jing stormed it and took it.',
  ],
  s0443: [
    'Jing had Hao torn apart by chariots as a warning; everyone young and old in the city was beheaded.',
    'Jing had Hao torn apart by chariots as a warning, then beheaded every soul in the city, young and old alike.',
  ],
  s0444: [
    'He made Hou Zijian overseer of South Yanzhou affairs.',
    'He put Hou Zijian in charge of South Yanzhou.',
  ],
  s0445: [
    'That month Jing summoned Song Zixian back to Jingkou.',
    'That month Jing recalled Song Zixian to Jingkou.',
  ],
  s0446: [
    'Fourth month: Jing made Yuan Siqian Eastern Route Mobile Headquarters, garrisoning Qiantang.',
    'In the fourth month Jing made Yuan Siqian eastern route mobile headquarters and garrisoned him at Qiantang.',
  ],
  s0447: [
    'He made Hou Zijian South Yanzhou Inspector.',
    'He made Hou Zijian South Yanzhou inspector.',
  ],
  s0448: [
    'Wen-cheng Marquis Ning raised troops in the western townships of Wu; within ten days forces reached ten thousand, and he led them westward.',
    'Wen-cheng Marquis Ning raised troops in Wu\'s western townships. Within ten days his force reached ten thousand, and he led them west.',
  ],
  s0449: [
    'Jing\'s colonels Meng Zhen and Hou Zirong defeated them, beheaded Ning, and sent his head to Jing.',
    'Jing\'s colonels Meng Zhen and Hou Zirong broke them, beheaded Ning, and sent his head to Jing.',
  ],
  s0450: [
    'Seventh month: Jing made Qin commandery Western Yanzhou, and Yangping commandery Northern Yanzhou.',
    'In the seventh month Jing made Qin commandery into Western Yanzhou and Yangping commandery into Northern Yanzhou.',
  ],
  s0451: [
    'Ren Yue and Lu Huilue attacked Jinxi commandery and killed the Poyang heir prince Si.',
    'Ren Yue and Lu Huilue attacked Jinxi commandery and killed Poyang heir prince Si.',
  ],
  s0452: [
    'Jing made Wang Wei Director of the Secretariat.',
    'Jing made Wang Wei director of the Secretariat.',
  ],
  s0453: [
    'Ren Yue advanced the army in a raid on Jiangzhou; Jiangzhou Inspector Prince of Xunyang Daxin surrendered to him.',
    'Ren Yue marched against Jiangzhou. Jiangzhou inspector Prince of Xunyang Daxin surrendered to him.',
  ],
  s0454: [
    'When Shizu heard Jiangzhou had fallen, he sent Guard General Xu Wensheng leading the massed armies down to Wuchang to resist Yue.',
    'When Shizu heard Jiangzhou had fallen, he sent Guard General Xu Wensheng with the main armies down to Wuchang to block Yue.',
  ],
  s0455: [
    'Jing again forged an edict advancing himself to Chancellor of State, enfeoffing twenty commanderies including Taishan as Prince of Han, exempt from hurrying at court, exempt from having his name spoken at salutation, permitted sword and shoes in the hall—following the precedent of Xiao He.',
    'Jing forged another edict promoting himself to chancellor of state and enfeoffing him as Prince of Han over twenty commanderies including Taishan, with privilege to enter court without haste, to be saluted without naming, and to wear sword and shoes in the hall—after the precedent of Xiao He.',
  ],
  s0456: [
    'Jing made Liu Jingli Protector General; Jiang Xunyi Chancellor of State Left Chief Clerk; Xu Hong Left Marshal; Lu Yue Right Chief Clerk; Shen Zhong Right Marshal.',
    'Jing made Liu Jingli protector general, Jiang Xunyi left chief clerk to the chancellor of state, Xu Hong left marshal, Lu Yue right chief clerk, and Shen Zhong right marshal.',
  ],
  s0457: [
    'That month Jing led his fleet up to Wankou.',
    'That month Jing led his fleet up the river to Wankou.',
  ],
  s0458: [
    'Tenth month: robbers killed Marquis of Wulin Zi at Guangmo Gate.',
    'In the tenth month robbers killed Marquis of Wulin Zi at Guangmo Gate.',
  ],
  s0459: [
    'Zi often went in and out of Taizong\'s bedchamber; Jing\'s faction could not stomach it, and so killed him.',
    'Zi often entered and left Taizong\'s bedchamber. Jing\'s men could not abide it, and so they killed him.',
  ],
  s0460: [
    'Jing again forged an edict: "For the suspended images are in Heaven; the four seasons take their rule from Chen and Dou;',
    'Jing forged another edict: "Heaven hangs its signs on high; the four seasons take their measure from the stars of Chen and Dou.',
  ],
  s0461: [
    'the myriad creatures are born on Earth; all things look to the Bright Illuminator for light.',
    'All living things are born on earth and turn to the great brightness for light.',
  ],
  s0462: [
    'Thus in yielding governance at the throne, the eight pillars gather together;',
    'When the ruler sits in yielding governance, the eight pillars of the realm draw close as one wheel;',
  ],
  s0463: [
    'bearing the chart in correct position, the nine regions return as one.',
    'when he bears the chart in rightful place, the nine provinces return to a single allegiance.',
  ],
  s0464: [
    'Therefore from lords named for clouds and waters, dragon officials and human nobles—all opened their tally at the River and Luo, performed feng and shan at Mount Dai, rushed the four barbarians, and came to court from ten thousand states.',
    'So from lords named for clouds and rivers, from dragon officers and noble heirs of men—none failed to open their tally at the River and Luo, to perform feng and shan on Mount Tai, to drive the four quarters, and to come in homage from ten thousand states.',
  ],
  s0465: [
    'Listening afar to Yu and Xia, their Way grew ever new.',
    'Listening back to Yu and Xia, their Way grew ever fresh.',
  ],
  s0466: [
    'Down to Shang and Zhou, none altered it.',
    'Down through Shang and Zhou, none changed it.',
  ],
  s0467: [
    'Until You and Li lost vigor, war-horses were born in the suburbs;',
    'Then You and Li lost their strength, and war-horses foaled in the capital outskirts;',
  ],
  s0468: [
    'Hui and Huai lost the reins, barbarian dust violated the imperial procession.',
    'Hui and Huai lost the reins, and barbarian dust fouled the imperial road.',
  ],
  s0469: [
    'So wolves and dogs ran rampant, burrowing into Yi and Luo;',
    'Wolves and dogs ran wild, gnawing at the heartlands of Yi and Luo;',
  ],
  s0470: [
    'the Xianyun blazed hot, nesting in Xian and Luo.',
    'the Xianyun burned bright and nested in Xian and Luo.',
  ],
  s0471: [
    'Since the Jin tripod moved east, many years have passed; the Zhou plains never restored—for ages unending.',
    'Since the Jin cauldron moved east, years piled into ages, and the plains of Zhou were never restored.',
  ],
  s0472: [
    'Though Emperor Wu of Song undertook strategy and briefly stilled distant plans, and Qi styled itself harmony in marriage, it toiled in vain with crowns and canopies.',
    'Though Emperor Wu of Song took up strategy and for a time checked distant ambition, and Qi spoke of harmony through marriage, crown and canopy achieved nothing but empty toil.',
  ],
  s0473: [
    'Our Great Liang received the tally and became emperor, emerged from the thunder and ascended the throne.',
    'Our Great Liang received Heaven\'s mandate and took the throne, rising out of thunder to ascend the imperial seat.',
  ],
  s0474: [
    'Within the four seas all returned in benevolence; across the realm all drank transformation.',
    'Within the four seas all returned in benevolence; across the realm all drank in royal transformation.',
  ],
  s0475: [
    'Opening borders and spreading soil, spanning the Han Sea to whip the steeds;',
    'It opened borders and spread its soil, spanning the Han Sea to drive its steeds;',
  ],
  s0476: [
    'coming to court and entering audience, equal to Tushan and matching wheels.',
    'it received envoys at court and in audience, matching the rites of Tushan, wheel following wheel.',
  ],
  s0477: [
    'The black tortoise emerged from the Luo; the white pheasant returned to abundance.',
    'The black tortoise came forth from the Luo; the white pheasant returned to the capital of abundance.',
  ],
  s0478: [
    'Bird passes shared script; northern skies shared track.',
    'Bird barriers shared one script; northern heavens one wheel-track.',
  ],
  s0479: [
    'Who expected Gao Cheng\'s overbearing wildness, slaughtering and ravaging Wei, stirring Huaxia, refusing royal service—then wolf-glanced north to invade, horse-head turned south.',
    'Who thought Gao Cheng would grow so overbearing—slaughtering and ravaging Wei, stirring all Huaxia, refusing the king\'s command—then turning wolf-eyed north to invade and horse-head south?',
  ],
  s0480: [
    'When Heaven grew weary of dark falsehood and ugly minions\' numbers were spent, dragon and leopard answered the season, wind and cloud met the conjunction.',
    'Heaven grew weary of dark falsehood; the ugly faction\'s days ran out. Dragon and leopard answered the season; wind and cloud met at the turning.',
  ],
  s0481: [
    'Chancellor of State Prince of Han, supreme virtue and heroic countenance—surely Heaven\'s gift;',
    'The Chancellor of State, Prince of Han, bears supreme virtue and a heroic mien—surely Heaven\'s gift;',
  ],
  s0482: [
    'bold stratagems and brave designs, born from the heart.',
    'bold stratagems and brave designs born straight from the heart.',
  ],
  s0483: [
    'Pearl-fish marked the omen, Chen and Mao leaves shone;',
    'Pearl-fish marked the omen; Chen and Mao leaves caught the light;',
  ],
  s0484: [
    'he parsed the Six Secret Treatises, weighed the Four Realms to a hair.',
    'he parsed the Six Secret Treatises and weighed the four quarters to a hair.',
  ],
  s0485: [
    'Leaping patterns of the spotted leopard, phoenix gathered and dragonflies soared;',
    'Spotted leopard leapt in new patterns; phoenix gathered and horned dragon soared;',
  ],
  s0486: [
    'spreading wings he came as an omen, bearing the chart he descended.',
    'spreading wings he came as an omen; bearing the chart he descended.',
  ],
  s0487: [
    'At first wielding law, he truly led the van;',
    'At first, wielding law, he truly led the van;',
  ],
  s0488: [
    'holding to the temple\'s calculations, he cut down the savage uglies.',
    'holding to the temple\'s calculations, he cut down the savage foe.',
  ],
  s0489: [
    'Only because at Dinghu the Emperor ascended, the six dragons rested in stillness;',
    'Only because at Dinghu the Emperor ascended and the six dragons rested in stillness;',
  ],
  s0490: [
    'blades briefly halted, the nine punitive expeditions unproclaimed.',
    'blades halted for a time, and the nine punitive expeditions went unproclaimed.',
  ],
  s0491: [
    'Yet evil ripened to fullness, the chief villain perished;',
    'Yet evil ripened to fullness, and the chief villain perished;',
  ],
  s0492: [
    'younger brother Yang continued the rebellion, prolonging chaos step by step.',
    'younger brother Yang carried on the rebellion, prolonging chaos step by step.',
  ],
  s0493: [
    'Unlike that Yang tone, same as this feasting on the people;',
    'Unlike that Yang in name alone, alike in devouring the people;',
  ],
  s0494: [
    'stealing a false title, in heart aspiring to the uplifted axe.',
    'stealing a false title, in heart reaching for the uplifted axe.',
  ],
  s0495: [
    'Feng River\'s lord and ministers, offered the chart begging aid;',
    'The lords and ministers by the Feng offered the chart and begged for aid;',
  ],
  s0496: [
    'Guan and Yellow River\'s common people, wept blood begging troops.',
    'the people of the passes and rivers wept blood and begged for armies.',
  ],
  s0497: [
    'All wished to receive the nation\'s numen, longing to behold royal transformation.',
    'All wished to receive the nation\'s numen and behold royal transformation.',
  ],
  s0498: [
    'I, though dull and obscure, inherited the military mantle of Wu the Martial, hoping to rescue Yao\'s multitudes, hoping to restore Yu\'s traces.',
    'I, though dull and obscure, inherited the martial mantle of King Wu, hoping to rescue Yao\'s people and restore Yu\'s traces.',
  ],
  s0499: [
    'Moreover, carriage and raiment reward merit; name follows achievement.',
    'Moreover, carriage and raiment reward merit, and name follows the deed.',
  ],
  s0500: [
    'When Zhou\'s army conquered Yin, the hawk-flourish began with Lord Shang;',
    'When Zhou\'s army conquered Yin, the hawk-flourish began with Lord Shang;',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_056_b5.mjs <translation.json>'
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
