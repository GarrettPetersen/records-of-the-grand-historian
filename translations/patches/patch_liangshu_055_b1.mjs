#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 55, Biography 49',
    'Book of Liang, Volume 55, Biography 49',
  ],
  s0002: [
    'Prince Xiao Zong of Yuzhang; Prince Xiao Ji of Wuling; Prince Zhengde of Linhe; Prince Yu of Hedong',
    'Prince Xiao Zong of Yuzhang; Prince Xiao Ji of Wuling; Prince Zhengde of Linhe; Prince Yu of Hedong',
  ],
  s0003: [
    'Prince Xiao Zong of Yuzhang, styled Shiqian, was Gaozu\'s second son.',
    'Prince Xiao Zong of Yuzhang, styled Shiqian, was Gaozu\'s second son.',
  ],
  s0004: [
    'In the third year of Tianjian he was enfeoffed as Prince of Yuzhang commandery, fief of two thousand households.',
    'In the third year of Tianjian he was enfeoffed as Prince of Yuzhang commandery, fief of two thousand households.',
  ],
  s0005: [
    'In the fifth year he went out as Bearer of the Staff with discretionary powers, Commander of all military affairs of South Xuzhou, General of Benevolent Might, and Inspector of South Xuzhou; soon he was advanced to North Central General.',
    'In the fifth year he went out as bearer of the staff, commander of South Xuzhou military affairs, General of Benevolent Might, and inspector of South Xuzhou; soon he was advanced to North Central General.',
  ],
  s0006: [
    'In the tenth year he was transferred to Commander of military affairs of E, Si, and Huo provinces, Cloud Command General, and Inspector of E.',
    'In the tenth year he was transferred to commander of E, Si, and Huo military affairs, Cloud Command General, and inspector of E.',
  ],
  s0007: [
    'In the thirteenth year he was transferred to Secure Right General, overseeing Stone Fort garrison affairs.',
    'In the thirteenth year he was transferred to Secure Right General, overseeing Stone Fort garrison affairs.',
  ],
  s0008: [
    'In the fifteenth year he was transferred to Western Central General, concurrently Protector General, then to Secure Front General and Governor of Danyang.',
    'In the fifteenth year he was transferred to Western Central General, concurrently Protector General, then to Secure Front General and governor of Danyang.',
  ],
  s0009: [
    'In the sixteenth year he again became North Central General and Inspector of South Xuzhou.',
    'In the sixteenth year he again became North Central General and inspector of South Xuzhou.',
  ],
  s0010: [
    'In the second year of Putong he entered court as Attendant-in-Ordinary and Secure Right General, with staff officers appointed.',
    'In the second year of Putong he entered court as Attendant-in-Ordinary and Secure Right General, with staff officers appointed.',
  ],
  s0011: [
    'At first his mother Lady Wu Shuyuan, favored by Gaozu after leaving the palace of Qi Emperor Dong Hun, gave birth to Zong in the seventh month; many in the palace doubted him.',
    'At first his mother Lady Wu Shuyuan, favored by Gaozu after leaving the palace of Qi Emperor Dong Hun, gave birth to Zong in the seventh month; many in the palace doubted him.',
  ],
  s0012: [
    'When Shuyuan\'s favor waned and she nursed resentment, she put forward the suspicion—and so Zong harbored it.',
    'When Shuyuan\'s favor waned and she nursed resentment, she put forward the suspicion—and so Zong harbored it.',
  ],
  s0013: [
    'When grown he had talent in learning and skill in literary composition.',
    'When grown he had talent in learning and skill in literary composition.',
  ],
  s0014: [
    'Gaozu governed his sons by ritual propriety and summoned them to court infrequently; Zong constantly resented that he was not recognized.',
    'Gaozu governed his sons by ritual propriety and summoned them to court infrequently; Zong constantly resented that he was not recognized.',
  ],
  s0015: [
    'Whenever he went out to a fief, Shuyuan always accompanied him to his post.',
    'Whenever he went out to a fief, Shuyuan always accompanied him to his post.',
  ],
  s0016: [
    'By fifteen or sixteen he still played naked before her, day and night undistinguished—inside and outside there was filthy talk.',
    'By fifteen or sixteen he still played naked before her, day and night undistinguished—inside and outside there was filthy talk.',
  ],
  s0017: [
    'When Zong was in Xuzhou, his government and punishments were cruel and violent.',
    'When Zong was in Xuzhou, his government and punishments were cruel and violent.',
  ],
  s0018: [
    'He also had courage and strength, and could by hand subdue a galloping horse.',
    'He also had courage and strength, and could by hand subdue a galloping horse.',
  ],
  s0019: [
    'He often went out in disguise at night, without any fixed schedule.',
    'He often went out in disguise at night, without any fixed schedule.',
  ],
  s0020: [
    'Whenever Gaozu\'s edicts or letters arrived, rage showed on his face; no minister dared speak.',
    'Whenever Gaozu\'s edicts or letters arrived, rage showed on his face; no minister dared speak.',
  ],
  s0021: [
    'He constantly worshipped the Qi line\'s seven ancestral temples in a separate chamber, and in plain dress went to Qu\'e to pay respects at Emperor Ming of Qi\'s tomb.',
    'He constantly worshipped the Qi line\'s seven ancestral temples in a separate chamber, and in plain dress went to Qu\'e to pay respects at Emperor Ming of Qi\'s tomb.',
  ],
  s0022: [
    'Yet he still could not trust himself; he heard a folk saying that if living blood dripped on a dead man\'s bone and seeped in, they were father and son.',
    'Yet he still could not trust himself; he heard a folk saying that if living blood dripped on a dead man\'s bone and seeped in, they were father and son.',
  ],
  s0023: [
    'Zong then privately opened the tomb of Dong Hun of Qi, took out the bone, and dripped blood from his arm to test it.',
    'Zong then privately opened the tomb of Dong Hun of Qi, took out the bone, and dripped blood from his arm to test it.',
  ],
  s0024: [
    'He also killed a boy and tested with his bone—the results all matched; from then he constantly harbored disloyal intent.',
    'He also killed a boy and tested with his bone—the results all matched; from then he constantly harbored disloyal intent.',
  ],
  s0025: [
    'In the fourth year he went out as Bearer of the Staff, Commander of military affairs of South Yan, Yan, Xu, Qing, and Ji provinces, Pacification North General, and Inspector of South Yan, granted one suite of martial music.',
    'In the fourth year he went out as bearer of the staff, commander of South Yan, Yan, Xu, Qing, and Ji military affairs, Pacification North General, and inspector of South Yan, granted one suite of martial music.',
  ],
  s0026: [
    'Hearing that Xiao Baoyin, Prince of Jian\'an of Qi, was in Wei, he sent men north to establish contact, called him uncle, and promised to raise his post in surrender to him.',
    'Hearing that Xiao Baoyin, Prince of Jian\'an of Qi, was in Wei, he sent men north to establish contact, called him uncle, and promised to raise his post in surrender to him.',
  ],
  s0027: [
    'It happened that a great northern campaign was mounted.',
    'It happened that a great northern campaign was mounted.',
  ],
  s0028: [
    'In the sixth year, Wei general Yuan Faseng surrendered Pengcheng; Gaozu then had Zong command the armies, garrison at Pengcheng, and stand off against Wei general Prince Yuan Yanming of Anfeng.',
    'In the sixth year, Wei general Yuan Faseng surrendered Pengcheng; Gaozu then had Zong command the armies, garrison at Pengcheng, and stand off against Wei general Prince Yuan Yanming of Anfeng.',
  ],
  s0029: [
    'Gaozu, because the campaign had dragged on, feared trouble would arise and ordered Zong to withdraw the army.',
    'Gaozu, because the campaign had dragged on, feared trouble would arise and ordered Zong to withdraw the army.',
  ],
  s0030: [
    'Zong feared that returning south would leave him no chance to see Baoyin again; with several horsemen he fled by night to Yanming. Wei made him Attendant-in-Ordinary, Grand Commandant, Duke of Gaoping, Prince of Danyang, fief of seven thousand households, three million cash, three thousand bolts of cloth and silk, one thousand bolts of mixed brocade, fifty horses, five hundred sheep, and a hundred male and female servants.',
    'Zong feared that returning south would leave him no chance to see Baoyin again; with several horsemen he fled by night to Yanming. Wei made him Attendant-in-Ordinary, Grand Commandant, Duke of Gaoping, Prince of Danyang, fief of seven thousand households, three million cash, three thousand bolts of cloth and silk, one thousand bolts of mixed brocade, fifty horses, five hundred sheep, and a hundred male and female servants.',
  ],
  s0031: [
    'Zong then changed his name to Zuan, styled Dewen, and went into the one-year mourning hemp for Dong Hun of Qi.',
    'Zong then changed his name to Zuan, styled Dewen, and went into the one-year mourning hemp for Dong Hun of Qi.',
  ],
  s0032: [
    'Thereupon the relevant offices memorialized to strip his rank and fief, cut him from the genealogical register, and change his surname to the Bo clan.',
    'Thereupon the relevant offices memorialized to strip his rank and fief, cut him from the genealogical register, and change his surname to the Bo clan.',
  ],
  s0033: [
    'Soon an edict restored him; his son Zhi was enfeoffed as Marquis of Yongxin, fief of a thousand households.',
    'Soon an edict restored him; his son Zhi was enfeoffed as Marquis of Yongxin, fief of a thousand households.',
  ],
  s0034: [
    'In the second year of Datong, Xiao Baoyin held Chang\'an in rebellion within Wei; Zuan fled north from Luoyang intending to join him, was seized by the ferry clerk, and the Wei people killed him—aged forty-nine.',
    'In the second year of Datong, Xiao Baoyin held Chang\'an in rebellion within Wei; Zuan fled north from Luoyang intending to join him, was seized by the ferry clerk, and the Wei people killed him—aged forty-nine.',
  ],
  s0035: [
    'Earlier, when Zong had not realized his ambitions, he composed the lyrics "Listening to the Bell" and "Grieving Fallen Leaves" to express his intent.',
    'Earlier, when Zong had not realized his ambitions, he composed the lyrics "Listening to the Bell" and "Grieving Fallen Leaves" to express his intent.',
  ],
  s0036: [
    'The gist runs:',
    'The gist runs:',
  ],
  s0037: [
    'Listening to the bell toll—you know you are in the imperial city.',
    'Listening to the bell toll—you know you are in the imperial city.',
  ],
  s0038: [
    'The uneven strikes are hard to count; layer upon layer, a hundred sorrows rise.',
    'The uneven strikes are hard to count; layer upon layer, a hundred sorrows rise.',
  ],
  s0039: [
    'The departing note hangs delicate and far; the returning sound hurries and wavers.',
    'The departing note hangs delicate and far; the returning sound hurries and wavers.',
  ],
  s0040: [
    'Who pities the night-watch drummer, toiling at Jianzhang Terrace?',
    'Who pities the night-watch drummer, toiling at Jianzhang Terrace?',
  ],
  s0041: [
    'Listening to the bell—listening everywhere, never in one place alone.',
    'Listening to the bell—listening everywhere, never in one place alone.',
  ],
  s0042: [
    'Jade held in the bosom, gems in the hand—cast aside to nothing; who will grant you pine-climbing and cassia-gathering?',
    'Jade held in the bosom, gems in the hand—cast aside to nothing; who will grant you pine-climbing and cassia-gathering?',
  ],
  s0043: [
    'Old friends and loves scattered east and west, like fallen leaves that never align again.',
    'Old friends and loves scattered east and west, like fallen leaves that never align again.',
  ],
  s0044: [
    'Where shall the drifting lone goose find rest? The parting crane calls plaintively at midnight.',
    'Where shall the drifting lone goose find rest? The parting crane calls plaintively at midnight.',
  ],
  s0045: [
    'Listening to the bell—when will this listening end?',
    'Listening to the bell—when will this listening end?',
  ],
  s0046: [
    'Twenty-some years detained in the capital realm.',
    'Twenty-some years detained in the capital realm.',
  ],
  s0047: [
    'Peering into the bright mirror, abandoning one\'s looks—cloud-sorrow and sea-longing can only be buried and suppressed.',
    'Peering into the bright mirror, abandoning one\'s looks—cloud-sorrow and sea-longing can only be buried and suppressed.',
  ],
  s0048: [
    'His "Grieving Fallen Leaves" reads:',
    'His "Grieving Fallen Leaves" reads:',
  ],
  s0049: [
    'Grieving fallen leaves—fluttering down in layered drifts.',
    'Grieving fallen leaves—fluttering down in layered drifts.',
  ],
  s0050: [
    'Falling yet flying, scattered every way, never returning.',
    'Falling yet flying, scattered every way, never returning.',
  ],
  s0051: [
    'Grieving fallen leaves—fallen leaves grieve.',
    'Grieving fallen leaves—fallen leaves grieve.',
  ],
  s0052: [
    'Human life is like this—scattered, nothing to hold.',
    'Human life is like this—scattered, nothing to hold.',
  ],
  s0053: [
    'Grieving fallen leaves—when will the leaves return?',
    'Grieving fallen leaves—when will the leaves return?',
  ],
  s0054: [
    'Once sharing the same root—no longer linked at all.',
    'Once sharing the same root—no longer linked at all.',
  ],
  s0055: [
    'Those who saw them at the time all grieved.',
    'Those who saw them at the time all grieved.',
  ],
  s0056: [
    'Prince Xiao Ji of Wuling, styled Shixun, was Gaozu\'s eighth son.',
    'Prince Xiao Ji of Wuling, styled Shixun, was Gaozu\'s eighth son.',
  ],
  s0057: [
    'In youth he studied diligently; he had literary talent, disliked frivolous ornament in composition, and possessed considerable backbone.',
    'In youth he studied diligently; he had literary talent, disliked frivolous ornament in composition, and possessed considerable backbone.',
  ],
  s0058: [
    'In the thirteenth year of Tianjian he was enfeoffed as Prince of Wuling commandery, fief of two thousand households.',
    'In the thirteenth year of Tianjian he was enfeoffed as Prince of Wuling commandery, fief of two thousand households.',
  ],
  s0059: [
    'He held in succession General Who Calms the Distance, Administrator of the two commanderies Langye and Pengcheng, Light Chariot General, and Governor of Danyang.',
    'He held in succession General Who Calms the Distance, administrator of the two commanderies Langye and Pengcheng, Light Chariot General, and governor of Danyang.',
  ],
  s0060: [
    'He went out as Administrator of Kuaiji; soon that commandery became East Yangzhou, and he remained as Inspector, additionally Bearer of the Staff and East Central General.',
    'He went out as administrator of Kuaiji; soon that commandery became East Yangzhou, and he remained as inspector, additionally bearer of the staff and East Central General.',
  ],
  s0061: [
    'He was summoned as Attendant-in-Ordinary, overseeing Stone Fort garrison affairs.',
    'He was summoned as Attendant-in-Ordinary, overseeing Stone Fort garrison affairs.',
  ],
  s0062: [
    'He went out as Propagation and Grace General and Inspector of Jiangzhou.',
    'He went out as Propagation and Grace General and inspector of Jiangzhou.',
  ],
  s0063: [
    'He was summoned as Bearer of the Staff, Propagation and Grace General, Commander of military affairs of Yang and South Xu provinces, and Inspector of Yangzhou.',
    'He was summoned as bearer of the staff, Propagation and Grace General, commander of Yang and South Xu military affairs, and inspector of Yangzhou.',
  ],
  s0064: [
    'Soon he was reassigned Bearer of the Staff, Commander of military affairs of Yi, Liang, and eleven other provinces, Pacification West General, and Inspector of Yizhou, granted one suite of martial music.',
    'Soon he was reassigned bearer of the staff, commander of Yi, Liang, and eleven other provinces, Pacification West General, and inspector of Yizhou, granted one suite of martial music.',
  ],
  s0065: [
    'In the eleventh year of Datong he was granted Attendant-in-Ordinary of the Scattered Cavalry, Great General Who Conquers the West, and Grand Mausoleum with Protocol Equal to the Three Dukes.',
    'In the eleventh year of Datong he was granted Attendant-in-Ordinary of the Scattered Cavalry, Great General Who Conquers the West, and Grand Mausoleum with Protocol Equal to the Three Dukes.',
  ],
  s0066: [
    'At first, in the Tianjian era, the Sun Gate was struck by earthquake; a sign read "The Liang throne belongs only to the Prince of Wu"—interpreters held that the Prince of Wu meant Prince Ji of Wuling, and court and commoners looked to him.',
    'At first, in the Tianjian era, the Sun Gate was struck by earthquake; a sign read "The Liang throne belongs only to the Prince of Wu"—interpreters held that the Prince of Wu meant Prince Ji of Wuling, and court and commoners looked to him.',
  ],
  s0067: [
    'During the Taiping era, when Hou Jing rebelled, Ji did not come to the rescue.',
    'During the Taiping era, when Hou Jing rebelled, Ji did not come to the rescue.',
  ],
  s0068: [
    'After Gaozu died, Ji seized imperial title in Shu, changing the era name to Tianzheng.',
    'After Gaozu died, Ji seized imperial title in Shu, changing the era name to Tianzheng.',
  ],
  s0069: [
    'He made his son Yuanzhao crown prince, Yuanzheng Prince of Xiyang, Yuanman Prince of Jingling, Yuanpu Prince of Nanqiao, and Yuansu Prince of Yidu.',
    'He made his son Yuanzhao crown prince, Yuanzheng Prince of Xiyang, Yuanman Prince of Jingling, Yuanpu Prince of Nanqiao, and Yuansu Prince of Yidu.',
  ],
  s0070: [
    'Marquis Huo of Yongfeng, Administrator of Baxi and Zitong, was appointed Great General Who Conquers the West and Inspector of Yizhou, enfeoffed as Prince of Qin commandery.',
    'Marquis Huo of Yongfeng, administrator of Baxi and Zitong, was appointed Great General Who Conquers the West and inspector of Yizhou, enfeoffed as Prince of Qin commandery.',
  ],
  s0071: [
    'Master of Affairs Wang Senglue and Direct Service Army Officer Xu Ping both remonstrated firmly; Ji took this as disloyalty and had both killed.',
    'Master of Affairs Wang Senglue and Direct Service Army Officer Xu Ping both remonstrated firmly; Ji took this as disloyalty and had both killed.',
  ],
  s0072: [
    'Marquis Huo of Yongfeng sighed: "The prince is doomed!',
    'Marquis Huo of Yongfeng sighed, "The prince is doomed!',
  ],
  s0073: [
    '" Good men are the foundation of a state; now he kills them—how can it not perish!',
    '" good men are the foundation of a state; now he kills them—how can it not perish!',
  ],
  s0074: [
    '" He also told his intimates: "In the past Huan Xuan took the era name Daheng; interpreters called it \'the second month is done,\' and his defeat indeed came in the second month.',
    '" he also told his intimates, "In the past Huan Xuan took the era name Daheng; interpreters called it \'the second month is done,\' and his defeat indeed came in the second month.',
  ],
  s0075: [
    '" This year is called Tianzheng—in writing it is \'one stop\'—how long can it last?"',
    '" this year is called Tianzheng—in writing it is \'one stop\'—how long can it last?"',
  ],
  s0076: [
    'In the fourth month of summer in the fifth year of Taiping, Ji led his army east to Ba commandery, claiming to attack Hou Jing but intending to seize Jing and Shan.',
    'In the fourth month of summer in the fifth year of Taiping, Ji led his army east to Ba commandery, claiming to attack Hou Jing but intending to seize Jing and Shan.',
  ],
  s0077: [
    'Hearing Western Wei invade Shu, he sent his general Qiao Yan, Inspector of Southern Liangzhou, to turn the army back for relief.',
    'Hearing Western Wei invade Shu, he sent his general Qiao Yan, inspector of Southern Liangzhou, to turn the army back for relief.',
  ],
  s0078: [
    'On the fifth month day, Western Wei general Yuchi Tong led troops to press the Fu River; Tongzhou Inspector Yang Qianyun surrendered the city, and Tong divided his forces to hold it and rushed straight for Chengdu.',
    'On the fifth month day, Western Wei general Yuchi Tong led troops to press the Fu River; Tongzhou inspector Yang Qianyun surrendered the city, and Tong divided his forces to hold it and rushed straight for Chengdu.',
  ],
  s0079: [
    'On day dingchou, Ji halted at Xiling; warships crowded the river, banners and armor dazzled the sun—the army\'s appearance was very grand.',
    'On day dingchou, Ji halted at Xiling; warships crowded the river, banners and armor dazzled the sun—the army\'s appearance was very grand.',
  ],
  s0080: [
    'Shizu ordered Protector General Lu Fahe to build two ramparts on both banks at the Gorge Mouth to hold the river and block him.',
    'Shizu ordered Protector General Lu Fahe to build two ramparts on both banks at the Gorge Mouth to hold the river and block him.',
  ],
  s0081: [
    'At the time Lu Na was not yet pacified and the Shu army pressed again; public sentiment was alarmed and Shizu worried.',
    'At the time Lu Na was not yet pacified and the Shu army pressed again; public sentiment was alarmed and Shizu worried.',
  ],
  s0082: [
    'Lu Fahe\'s urgent reports came one after another for ten days.',
    'Lu Fahe\'s urgent reports came one after another for ten days.',
  ],
  s0083: [
    'Shizu then pulled Ren Yue from prison and made him Master of Affairs to Prince Jin\'an, assigning palace guard troops to him;',
    'Shizu then pulled Ren Yue from prison and made him Master of Affairs to Prince Jin\'an, assigning palace guard troops to him;',
  ],
  s0084: [
    'and also sent Fierce Attack General Liu Fen to go west with Yue.',
    'and also sent Fierce Attack General Liu Fen to go west with Yue.',
  ],
  s0085: [
    'In the sixth month, Ji built linked ramparts and attacked, severing the iron chains.',
    'In the sixth month, Ji built linked ramparts and attacked, severing the iron chains.',
  ],
  s0086: [
    'Shizu again pulled Xie Daren from prison and made him Colonel of Footsoldiers, assigning him a brigade to go up and relieve Lu Fahe.',
    'Shizu again pulled Xie Daren from prison and made him Colonel of Footsoldiers, assigning him a brigade to go up and relieve Lu Fahe.',
  ],
  s0087: [
    'Shizu wrote Ji a letter: "The Emperor respectfully inquires of the Acting Holder of the Yellow Battle-Axe, Grand Commandant, Prince of Wuling: Since the Nine Li raided our borders and the Three Miao harassed us, Heaven long abandoned order, barbarians pressed against the capital, devoutly laid waste to the realm, and the royal house knew the sorrows of millet and thorn—',
    'Shizu wrote Ji a letter: "The Emperor respectfully inquires of the Acting Holder of the Yellow Battle-Axe, Grand Commandant, Prince of Wuling: Since the Nine Li raided our borders and the Three Miao harassed us, Heaven long abandoned order, barbarians pressed against the capital, devoutly laid waste to the realm, and the royal house knew the sorrows of millet and thorn—',
  ],
  s0088: [
    '" I sleep with my spear at my pillow looking east, weeping blood as I float west; I lost my beloved sons in two directions, without the eight hundred feudal lords; I wore armor myself and pierced flowing arrows with my hand.',
    '" I sleep with my spear at my pillow looking east, weeping blood as I float west; I lost my beloved sons in two directions, without the eight hundred feudal lords; I wore armor myself and pierced flowing arrows with my hand.',
  ],
  s0089: [
    '" Suddenly the cruelty of wind and tree came—ten thousand hates first entwined; frost and dew griefs piled on by the hundred; I beat my heart and swallowed gall, my will no longer to preserve myself whole.',
    '" suddenly the cruelty of wind and tree came—ten thousand hates first entwined; frost and dew griefs piled on by the hundred; I beat my heart and swallowed gall, my will no longer to preserve myself whole.',
  ],
  s0090: [
    '" Only because the altar and temple hang by a thread, the whale and crocodile are not yet cut down, I tasted gall awaiting dawn, marched Heaven\'s punishment, alone wielded the four keen ears, sat and commanded the eight handles.',
    '" only because the altar and temple hang by a thread, the whale and crocodile are not yet cut down, I tasted gall awaiting dawn, marched Heaven\'s punishment, alone wielded the four keen ears, sat and commanded the eight handles.',
  ],
  s0091: [
    '" Though again I raised an altar awaiting generals, lifted the curtain to welcome scholars, and repelled the Red Cliffs army—without Lu Su\'s counsel;',
    '" though again I raised an altar awaiting generals, lifted the curtain to welcome scholars, and repelled the Red Cliffs army—without Lu Su\'s counsel;',
  ],
  s0092: [
    '" burned the grain at Wuchao—without consulting Xun You;',
    '" burned the grain at Wuchao—without consulting Xun You;',
  ],
  s0093: [
    '" talent and wisdom nearly spent, gold and shell nearly exhausted, not a fingerbreadth of aid beside me, dangers and hardships all tasted.',
    '" talent and wisdom nearly spent, gold and shell nearly exhausted, not a fingerbreadth of aid beside me, dangers and hardships all tasted.',
  ],
  s0094: [
    '" Yet I was able to behead the long Di at Jumen and humble Chiyou at Maplewood.',
    '" yet I was able to behead the long Di at Jumen and humble Chiyou at Maplewood.',
  ],
  s0095: [
    '" Shame and grievance now washed, the realm without dust; I manage the four directions, relying on one strength alone; I shall with the peaks and pastors share this clarity and quiet.',
    '" shame and grievance now washed, the realm without dust; I manage the four directions, relying on one strength alone; I shall with the peaks and pastors share this clarity and quiet.',
  ],
  s0096: [
    '" In this fierce summer heat, how fares my younger brother?',
    '" in this fierce summer heat, how fares my younger brother?',
  ],
  s0097: [
    '" Civil and military officials must be worn and weary.',
    '" civil and military officials must be worn and weary.',
  ],
  s0098: [
    '" Now I send Attendant-in-Ordinary of the Scattered Cavalry and Inspector of Guangzhou Zheng Anzhong to declare this and carry my embrace.',
    '" now I send Attendant-in-Ordinary of the Scattered Cavalry and inspector of Guangzhou Zheng Anzhong to declare this and carry my embrace.',
  ],
  s0099: [
    '" He still had him convey his intent to Ji, promising his return to Shu and sole rule over Minfang.',
    '" he still had him convey his intent to Ji, promising his return to Shu and sole rule over Minfang.',
  ],
  s0100: [
    'Ji would not obey and replied in the manner of family correspondence.',
    'Ji refused and replied as between kin.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_055_b1.mjs <translation.json>'
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
