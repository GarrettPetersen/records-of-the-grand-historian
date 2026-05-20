#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'His collected works were ten scrolls.',
    'He left collected works in ten scrolls.',
  ],
  s0102: [
    'Younger brother Jianwu.',
    'His younger brother Jianwu.',
  ],
  s0103: [
    'Jianwu, courtesy name Zishen.',
    'Jianwu, styled Zishen.',
  ],
  s0104: [
    'At eight he could compose poetry and was especially loved by his elder brother Yuling.',
    'At eight he wrote verse and was Yuling\'s favorite brother.',
  ],
  s0105: [
    'He first served as Regular Attendant of the Jin\'an princedom, then was promoted to Army Aide of the Prince\'s Xuanhui office.',
    'He began as Jin\'an regular attendant, then prince Xuanhui army aide.',
  ],
  s0106: [
    'From then on whenever the prince moved his fief Jianwu followed the headquarters.',
    'Whenever the prince moved fief Jianwu followed.',
  ],
  s0107: [
    'He served as princely middle attendant, Cloud Banner army aide, and chief secretary throughout.',
    'He was princely middle attendant, cloud-banner aide, and chief secretary.',
  ],
  s0108: [
    'In the third year of Zhongdatong the prince became crown prince; Jianwu was Eastern Palace courier while also Jin\'an-Xiangdong recorder, and soon headed Jingzhou as chief.',
    'Zhongdatong year three the prince became heir; Jianwu was Eastern Palace courier and Xiangdong recorder, soon Jingzhou chief.',
  ],
  s0109: [
    'He was repeatedly promoted to consulting colonel of the central records, Crown Prince Commissioner for Increasing the Seasons, and Household Vice-Supervisor.',
    'He rose to central records consulting colonel, crown prince commissioner of seasons, and household vice-supervisor.',
  ],
  s0110: [
    'When Taizong was still in the fief he loved men of letters; then Jianwu with Xu Chi of Donghai, Lu Guo of Wu, Liu Zun and Liu Xiaoyi of Pengcheng, and Xiaoyi\'s brother Xiaowei were all favored.',
    'In the fief Taizong loved writers; Jianwu, Xu Chi, Lu Guo, Liu Zun, Xiaoyi, and Xiaowei were favored.',
  ],
  s0111: [
    'When he dwelt in the Eastern Palace he again opened the Wende office and placed scholars; Jianwu\'s son Xin, Chi\'s son Ling, Zhang Changgong of Wu, Fu Hong of Beidi, and Bao Zhi of Donghai were chosen.',
    'As crown prince he reopened Wende scholars—Jianwu\'s Xin, Chi\'s Ling, Zhang Changgong, Fu Hong, and Bao Zhi among them.',
  ],
  s0112: [
    'In Qi Yongming, Wang Rong, Xie Tiao, and Shen Yue first used the four tones in writing as a new change; by now sound and rhyme grew stricter and ornate beauty exceeded the past.',
    'Qi Yongming brought four-tone verse; now rhyme grew tighter and ornament surpassed the past.',
  ],
  s0113: [
    'Then the crown prince wrote to the Prince of Xiangdong discussing it, saying:',
    'The crown prince then wrote Prince Xiangdong, saying:',
  ],
  s0114: [
    'We too have no diversions but to spread our scrolls; our nature loves writing and we sometimes compose short pieces.',
    'We have no pastime but reading; nature loves letters and we sometimes write short pieces.',
  ],
  s0115: [
    'Though it is mediocre sound, we cannot lay down the brush; ashamed of the itch for skill, we relapse into the old habit.',
    'Mediocre as they are, we cannot stop writing—ashamed of the itch, we fall back into old ways.',
  ],
  s0116: [
    'Lately the capital style is unusually dull and blunt; all rush to learn the floating and shallow, hastening to be lax and slow.',
    'Lately capital style is dull; all chase the shallow and slack.',
  ],
  s0117: [
    'On long winter nights the mind finds nothing—utterly unlike the bixing, directly betraying the Winds and Sao.',
    'Winter nights yield nothing—unlike bixing, betraying the Winds and Sao.',
  ],
  s0118: [
    'As for the six canons and three rites, where they apply there is a place;',
    'The six canons and three rites apply only where they belong;',
  ],
  s0119: [
    'for auspicious and inauspicious, guest and host, use has its occasion.',
    'luck, rites, guest and host each have their occasion.',
  ],
  s0120: [
    'Never have I heard of chanting feeling and nature while imitating the "Neize" chapter;',
    'Never heard feeling sung while imitating Neize;',
  ],
  s0121: [
    'wielding the brush to write intent while copying the "Wine Admonition";',
    'intent written while copying the Wine Admonition;',
  ],
  s0122: [
    'lingering spring days while learning the Guicang;',
    'spring days spent imitating Guicang;',
  ],
  s0123: [
    'deep deep river waters, then matching the Great Commentary.',
    'deep waters matched to the Great Commentary.',
  ],
  s0124: [
    'I am clumsy at writing and dare not lightly pick faults.',
    'I am a poor writer and dare not pick faults lightly.',
  ],
  s0125: [
    'But taking the works of this age and comparing their wording and intent with ancient talents far back to Yang, Sima, Cao, and Wang, or near to Pan, Lu, Yan, and Xie—they are utterly unlike.',
    'Yet comparing today\'s wording and intent with Yang, Sima, Cao, Wang, Pan, Lu, Yan, and Xie—they do not resemble at all.',
  ],
  s0126: [
    'If present writing is right, then ancient writing is wrong;',
    'If today is right, antiquity is wrong;',
  ],
  s0127: [
    'if past worthies may be praised, then present style should be cast aside.',
    'if the ancients deserve praise, present style should be abandoned.',
  ],
  s0128: [
    'Both sides say "each has his own"—I do not dare agree.',
    'Each side says "to each his own"—I cannot agree.',
  ],
  s0129: [
    'Moreover there are those who imitate the writing of Xie Lingyun or Vice Minister Pei—with some delusion.',
    'Some imitate Xie Lingyun or Vice Minister Pei—with delusion.',
  ],
  s0130: [
    'How so?',
    'Why?',
  ],
  s0131: [
    'Master Xie\'s words tower heavenward, springing from nature; occasional lapses are the dregs;',
    'Xie\'s words soar naturally; lapses are dregs;',
  ],
  s0132: [
    'Pei was talent for a fine historian, utterly without beauty in lyric pieces.',
    'Pei was a historian\'s mind, not a poet\'s gift.',
  ],
  s0133: [
    'Thus to study Xie is not to reach his essence but only to get the long-winded;',
    'Study Xie and you miss essence, keep length;',
  ],
  s0134: [
    'to take Pei as teacher is to scorn his strengths and keep only his shortcomings.',
    'Take Pei and you scorn strengths, keep flaws.',
  ],
  s0135: [
    'Therefore Xie\'s craft cannot be climbed, and Pei\'s plainness is not to be admired.',
    'Xie\'s craft cannot be climbed; Pei\'s plainness is not to be copied.',
  ],
  s0136: [
    'So companions who gallop the breast and break the diaphragm, lovers of name who forget reality, split flesh on a benevolent beast and display Xi Ke at Handan, enter the brine and forget the stink, imitate the ugly and invite disaster.',
    'Name-chasers split flesh on a benevolent beast, play Xi Ke at Handan, enter brine and forget stink, imitate ugliness and invite harm.',
  ],
  s0137: [
    'To break feathers before Master Xie—can three thousand be reached?',
    'Break feathers before Xie—can three thousand match?',
  ],
  s0138: [
    'To bow before Pei—fearing the two Tang histories will not be transmitted.',
    'Bow to Pei—fearing the two Tang histories will not pass down.',
  ],
  s0139: [
    'Thus jade markings and golden flutes are mocked by clumsy eyes;',
    'Jade pipes are laughed at by dull eyes;',
  ],
  s0140: [
    '"Ba people, lower village" better suit the ear of Ying.',
    'Ba songs and lower village better please Ying\'s ear.',
  ],
  s0141: [
    '"Yangchun" is high and unharmonized; subtle sound ends and is not sought.',
    'Yangchun is too high to harmonize; fine sound dies unheeded.',
  ],
  s0142: [
    'They do not finely weigh ounce and scruple or measure text and substance; unlike the "Clever Heart," they end ashamed before the skilled hand.',
    'They never weigh ounce or scruple or text and substance; unlike the Clever Heart, they shame the skilled hand.',
  ],
  s0143: [
    'Thus men holding jade and cherishing gems see Zheng\'s state and know to withdraw;',
    'Men with jade see Zheng and withdraw;',
  ],
  s0144: [
    'men in cap and green shoes look toward Min lands and sigh.',
    'Men in caps look to Min and sigh.',
  ],
  s0145: [
    'If poetry is so, the brush is likewise.',
    'Poetry being so, prose is the same.',
  ],
  s0146: [
    'Only because ink does not speak is it driven and dyed;',
    'Ink does not speak yet drives them;',
  ],
  s0147: [
    'paper and bamboo slips have no feeling yet are shaken and folded.',
    'Paper has no feeling yet is folded at will.',
  ],
  s0148: [
    'Alas! the flood of letters has come to this!',
    'Alas! letters have flooded to this!',
  ],
  s0149: [
    'As for recent Xie Tiao and Shen Yue in poetry, Ren Fang and Lu Chun in the brush—they are truly the cap and belt of letters, models of composition.',
    'Recent Xie Tiao and Shen Yue in poetry, Ren Fang and Lu Chun in prose—are the cap and belt of letters.',
  ],
  s0150: [
    'Zhang Shijian\'s fu and Zhou Shengyi\'s disputation are also fine hands hard to meet again.',
    'Zhang Shijian\'s fu and Zhou Shengyi\'s debate are fine hands rarely seen again.',
  ],
  s0151: [
    'Letters have not yet fallen—there must be outstanding ones;',
    'Letters have not fallen—outstanding ones must exist;',
  ],
  s0152: [
    'to lead them—who if not you, younger brother?',
    'to lead—who but you, brother?',
  ],
  s0153: [
    'Each time I wish to discuss it there is no one to speak with; I think of Zijian to deliberate together.',
    'I want to discuss but have no partner; I think of you, Zijian, to judge together.',
  ],
  s0154: [
    'Discriminate clear and muddy as Jing and Wei;',
    'Sort clear from muddy like Jing and Wei;',
  ],
  s0155: [
    'discuss as on the first of the month, like Ru\'nan.',
    'judge like Ru\'nan on the first of the month.',
  ],
  s0156: [
    'Once cinnabar is fixed and orpiment distinguished, let the rat in the bosom know shame and the false player on the yu feel disgrace.',
    'Once red and yellow are fixed, let frauds in the bosom feel shame.',
  ],
  s0157: [
    'Like Yuan Shao fearing to see Zi\'ang;',
    'Like Yuan Shao fearing Zi\'ang;',
  ],
  s0158: [
    'like the cattle thief ashamed before Wang Lie from afar.',
    'like the cattle thief ashamed before Wang Lie.',
  ],
  s0159: [
    '"Longing and not seeing—how I toil!"',
    '"Longing, yet not seeing—how I toil!"',
  ],
  s0160: [
    'In the Taiping era Hou Jing raided and took the capital;',
    'In Taiping Hou Jing took the capital;',
  ],
  s0161: [
    'when Taizong took the throne he made Jianwu Minister of Revenue.',
    'When Taizong reigned he made Jianwu Minister of Revenue.',
  ],
  s0162: [
    'At that time the upper streams and various princes all held provinces resisting Jing; Jing forged an edict sending Jianwu to Jiangzhou to persuade Duke Daxin of Dangyang, who soon surrendered the province to the bandit.',
    'Princes on the upper Yangtze resisted Jing; Jing forged an edict sending Jianwu to persuade Daxin, who surrendered Jiangzhou.',
  ],
  s0163: [
    'Jianwu fled into Jianchang territory; after long time he reached Jiangling and soon died.',
    'Jianwu fled into Jianchang, later reached Jiangling, and soon died.',
  ],
  s0164: [
    'His collected works circulated in the world.',
    'His works circulated.',
  ],
  s0165: [
    'Liu Zhao, courtesy name Xuanqing, was from Gaotang in Pingyuan, ninth-generation descendant of Jin Grand Marshal Shi.',
    'Liu Zhao, styled Xuanqing, of Pingyuan Gaotang, ninth generation from Jin\'s Liu Shi.',
  ],
  s0166: [
    'His grandfather Bolong was famed for filial piety in mourning for his father; Song Wudi ordered the crown prince and princes to condole and he reached Vice Director of the Palace Bureau.',
    'Grandfather Bolong was famed for mourning filial piety; Wudi sent princes to condole; he reached vice director of the palace bureau.',
  ],
  s0167: [
    'His father Biao was staff chief secretary to the Qi expeditionary Prince Jin\'an.',
    'His father Biao was Qi Jin\'an prince chief secretary.',
  ],
  s0168: [
    'Zhao in youth was clear and alert; at seven he mastered the meanings of the Laozi and Zhuangzi.',
    'Young Zhao was alert; at seven he mastered Laozi and Zhuangzi.',
  ],
  s0169: [
    'When grown he studied diligently and wrote well; his maternal uncle Jiang Yan early praised him.',
    'Grown he studied and wrote; uncle Jiang Yan praised him early.',
  ],
  s0170: [
    'At the start of Tianjian he first became Court Gentleman for attendance, rose to northern expedition army aide and treasury gentleman, and was made Magistrate of Wuxi.',
    'Early Tianjian he was court gentleman, northern expedition aide, treasury gentleman, then Wuxi magistrate.',
  ],
  s0171: [
    'He served as chief secretary to Princes Xuanhui of Yuzhang and Linchuan of the Center Army.',
    'He was chief secretary to Yuzhang Xuanhui and Linchuan center army princes.',
  ],
  s0172: [
    'Earlier Zhao\'s uncle Yin had gathered many families\' Jin History with Gan Bao\'s Jin Annals into forty scrolls; Zhao again gathered Later Han variants to annotate Fan Ye\'s book—the age called him broadly versed.',
    'Uncle Yin had compiled Jin history; Zhao annotated Fan Ye\'s Later Han with variants—the age called him thorough.',
  ],
  s0173: [
    'He was promoted to Palace Attendant, went out as Magistrate of Shan, and died in office.',
    'He became palace attendant, governed Shan, and died in office.',
  ],
  s0174: [
    'Collected Annotated Later Han in one hundred eighty scrolls, Biographies of Young Children in ten scrolls, collected works in ten scrolls.',
    'He left Annotated Later Han in 180 scrolls, Young Children in 10, and collected works in 10.',
  ],
  s0175: [
    'His son Chao, courtesy name Yanming.',
    'His son Chao, styled Yanming.',
  ],
  s0176: [
    'He too loved learning and mastered the three rites.',
    'Chao loved learning and mastered the three rites.',
  ],
  s0177: [
    'In the Datong era he was Gentleman of the Ministry of Rites, soon left office and never served again.',
    'Datong era he was rites gentleman, then left and never served again.',
  ],
  s0178: [
    'Chao\'s younger brother Huan, courtesy name Handu, was known in youth.',
    'Younger brother Huan, styled Handu, was known young.',
  ],
  s0179: [
    'In office he was chief secretary to Prince Xiangdong of the Pacifying West; the western headquarters then gathered letters and Huan led them.',
    'He was Xiangdong chief secretary when the western staff brimmed with letters and he led them.',
  ],
  s0180: [
    'He was made Palace Attendant, soon promoted to central records of the Pacifying South Xiangdong prince, followed the headquarters to Jiangzhou, and died.',
    'Made palace attendant, then Xiangdong central records, followed Jiangzhou, and died.',
  ],
  s0181: [
    'He Xun, courtesy name Zhongyan, was a man of Tan in Donghai.',
    'He Xun, styled Zhongyan, was from Tan in Donghai.',
  ],
  s0182: [
    'His great-grandfather Chengtian was Song Censor-in-Chief.',
    'Great-grandfather Chengtian was Song censor-in-chief.',
  ],
  s0183: [
    'His grandfather Yi was Supernumerary Gentleman.',
    'Grandfather Yi was supernumerary gentleman.',
  ],
  s0184: [
    'His father Xun was Qi staff officer in the Grand Marshal\'s center army.',
    'Father Xun was Qi grand marshal center army staff officer.',
  ],
  s0185: [
    'At eight Xun could compose poetry; at weak adulthood the province nominated him Outstanding Talent.',
    'At eight he wrote poetry; at weak adulthood the province nominated him outstanding talent.',
  ],
  s0186: [
    'Fan Yun of Nanxiang saw his examination answers and greatly praised him, and they formed a friendship ignoring age.',
    'Fan Yun saw his examination answers, praised him, and they became friends ignoring age.',
  ],
  s0187: [
    'From then on whenever one wrote a piece or a poem Yun would sigh in admiration and said to intimates: "Lately I have observed men of letters—plainness overshoots the Ru, ornament wounds the vulgar;',
    'Thereafter Yun praised every piece and told intimates: "Writers lately are too plain for Ru or too ornate for the vulgar;',
  ],
  s0188: [
    'those who can hold clarity and turbidity together and hit the mean of past and present—seeing this, what is He Sheng!"',
    'those who hold clear and muddy and balance past and present—seeing this, what is He Sheng!"',
  ],
  s0189: [
    '"; Shen Yue also loved his writing and once told Xun: "Whenever I read your poems I go over them three times a day and still cannot stop.',
    '"; Shen Yue loved him too and said: "I read your poems thrice daily and cannot stop.',
  ],
  s0190: [
    '"; such was the praise of the famous.',
    '"; such was fame\'s praise.',
  ],
  s0191: [
    'In the Tianjian era he first became Court Gentleman for attendance, was promoted to water bureau army aide of Prince Jian\'an of the Guard, and also chief secretary.',
    'Tianjian era he was court gentleman, then Jian\'an guard water bureau aide and chief secretary.',
  ],
  s0192: [
    'The prince loved literary men and daily feasted with them; when he moved to Jiangzhou Xun still kept records.',
    'The prince loved writers and feasted daily; moving to Jiangzhou Xun still kept records.',
  ],
  s0193: [
    'On return he was staff officer to Prince Cheng of Anxi and also Gentleman of the Ministry of Works water bureau, and left on his mother\'s death.',
    'Returning he was Cheng of Anxi staff officer and works water gentleman, then mourned his mother.',
  ],
  s0194: [
    'When mourning ended he was chief secretary to Prince Luling of Renwei, again followed the headquarters to Jiangzhou, and soon died.',
    'After mourning he was Luling chief secretary, followed Jiangzhou, and soon died.',
  ],
  s0195: [
    'Wang Sengru of Donghai collected his writing in eight scrolls.',
    'Wang Sengru collected his work in eight scrolls.',
  ],
  s0196: [
    'Earlier Xun\'s writing and Liu Xiaochuo\'s were both weighty in the world; people called them "He–Liu."',
    'Xun and Liu Xiaochuo were both famed as "He–Liu."',
  ],
  s0197: [
    'Shizu wrote a treatise saying: "Many poems but able—Shen Yue; few but able—Xie Tiao, He Xun."',
    'Shizu wrote: "Many poems, able—Shen Yue; few, able—Xie Tiao and He Xun."',
  ],
  s0198: [
    'At the time Yu Xie of Kuaiji was skilled in pentasyllabic poetry, his name matching Xun\'s, and he reached Princedom Vice Director.',
    'Kuaiji\'s Yu Xie wrote pentasyllabic verse rivaling Xun and reached princedom vice director.',
  ],
  s0199: [
    'Later there were also Kong Wengui of Kuaiji and Jiang Bi of Jiyang, both chief secretaries to the Grand Marshal of Prince Nanping.',
    'Later Kuaiji\'s Kong Wengui and Jiyang\'s Jiang Bi were Nanping grand marshal chief secretaries.',
  ],
  s0200: [
    'Wengui also wrote poetry skillfully; Bi was broadly learned with subtle reasoning and further annotated the Analects and Classic of Filial Piety.',
    'Wengui wrote verse well; Bi was learned and reannotated the Analects and Filial Classic.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_049_b2.mjs <translation.json>'
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
