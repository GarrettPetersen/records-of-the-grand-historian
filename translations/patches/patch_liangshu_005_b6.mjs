#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'On dingchou, General Who Pacifies the North, Opening Office Equal in Three Departments Xiao Xun was made Grand General of Fast Cavalry and Xiangzhou Inspector, his other offices unchanged.',
    'On dingchou, General Who Pacifies the North Xiao Xun, Opening Office Equal in Three Departments, was made Grand General of Fast Cavalry and Xiangzhou inspector, retaining his other posts.',
  ],
  s0502: [
    'On jimao, Crown Prince Fang Ju was established as crown prince and renamed Yuanliang.',
    'On jimao, Crown Prince Fang Ju was installed as crown prince and took the name Yuanliang.',
  ],
  s0503: [
    'Imperial sons Fang Zhi and Fang Lue were established as Princes of Jin\'an and Shian commanderies.',
    'The princes Fang Zhi and Fang Lue were made Prince of Jin\'an and Prince of Shian commanderies.',
  ],
  s0504: [
    'His birth mother, Honored Consort Ruan, was posthumously honored as Empress Wenxuan.',
    'His birth mother Honored Consort Ruan was posthumously titled Empress Wenxuan.',
  ],
  s0505: [
    'That month, Lu Na sent generals Pan Wulei and others to defeat Hengzhou Inspector Ding Daogui at Lukou; Daogui fled to Lingling.',
    'That month Lu Na sent Pan Wulei and other generals to break Hengzhou inspector Ding Daogui at Lukou; Daogui fled to Lingling.',
  ],
  s0506: [
    'In the twelfth month, on renzi, Lu Na detached troops to raid Baling; Xiangzhou Inspector Xiao Xun defeated them.',
    'On renzi in the twelfth month Lu Na detached troops against Baling; Xiangzhou inspector Xiao Xun routed them.',
  ],
  s0507: [
    'That month, Yingzhou Inspector Li Hongya led his host from Lingling out through Kongling Ford, intending to descend and attack Na; Na sent General Wu Zang and others to raid and defeat Hongya, who retreated to hold Kongling city.',
    'That month Yingzhou inspector Li Hongya marched from Lingling through Kongling Ford to attack Na from below; Na sent Wu Zang and others to strike him down, and Hongya fell back on Kongling.',
  ],
  s0508: [
    'In spring, the first month, on yichou, year 2, an edict ordered Wang Sengbian to lead the hosts against Lu Na.',
    'On yichou in the first month of spring, year 2, an edict ordered Wang Sengbian to take the armies against Lu Na.',
  ],
  s0509: [
    'On wuyin, Minister of Civil Appointments Wang Bao was made Right Vice Director of the Masters of Writing; Liu Yan was made Minister of Civil Appointments.',
    'On wuyin, Minister of Civil Appointments Wang Bao became Right Vice Director of the Masters of Writing, and Liu Yan became Minister of Civil Appointments.',
  ],
  s0510: [
    'Western Wei sent Grand General Yuchi Jiong to raid Yi Province.',
    'Western Wei sent Grand General Yuchi Jiong against Yi Province.',
  ],
  s0511: [
    'In the third month, on gengwu, an edict said: "Food is the people\'s heaven and agriculture the root of governance; handed down for a thousand years and bequeathed to the hundred kings, none failed to respectfully grant the seasons to the people and personally plow the imperial fields.',
    'On gengwu in the third month an edict said, "Food is the people\'s heaven and farming the root of rule; for a thousand years the hundred kings have handed this down—none failed to grant the seasons and plow the imperial fields themselves.',
  ],
  s0512: [
    'Therefore grain was held as treasure, and the Zhou Odes praise its hymns;',
    'Grain was treasure, and the Zhou Odes sing its hymns;',
  ],
  s0513: [
    'when grain and wheat did not ripen, the Lu Annals recorded it in their registers.',
    'when grain and wheat failed, the Lu chronicle entered it in the registers.',
  ],
  s0514: [
    'Qin had statutes for agricultural strength; Han opened the benefit of garrison farming.',
    'Qin graded men by farming strength; Han opened the profit of frontier colonies.',
  ],
  s0515: [
    'In recent years obstruction piled upon obstruction, many calamities came in succession, arms never stilled—and I had no leisure.',
    'In recent years the times turned hard, calamities followed one another, and war never ceased—I had no leisure for this.',
  ],
  s0516: [
    'Edicts for broadening the fields were unheard in commanderies and kingdoms;',
    'Orders to open more land were not heard in the commanderies;',
  ],
  s0517: [
    'the office of the Agricultural Master was neglected in the bureaucracy.',
    'the Agricultural Master\'s office had grown shabby in the official ranks.',
  ],
  s0518: [
    'Now the chief villain is exterminated and the realm is becoming one; there should be great shelter for the black-headed people, that the drifting masses may be rescued.',
    'Now the great evil is destroyed and the realm is one; let the common people be sheltered broadly and the adrift multitude saved.',
  ],
  s0519: [
    'One hamlet\'s work left idle grieves the heart day by day;',
    'One hamlet idle grieves the heart from dawn to dusk;',
  ],
  s0520: [
    'one man\'s occupation abandoned—and the salt flats know no surplus.',
    'one man\'s trade abandoned—and even the salt marshes have nothing left.',
  ],
  s0521: [
    'The state rich, punishments clear; households supplied, the people sufficient.',
    'Let the state be rich and punishments clear, households full and the people at ease.',
  ],
  s0522: [
    'Those who exert themselves in the fields shall be exempted wherever they are.',
    'All who labor in the fields shall be exempted in their districts.',
  ],
  s0523: [
    'Proclaim this abroad at once, in keeping with my intent.',
    'Proclaim this abroad at once, as my will.',
  ],
  s0524: [
    'On xinwei, Li Hongya surrendered Kongling city to the rebels; the rebels seized him and took him away.',
    'On xinwei Li Hongya surrendered Kongling to the rebels; they seized him and carried him off.',
  ],
  s0525: [
    'Earlier, when Ding Daogui fled to Lingling he threw himself on Hongya, and Hongya had him gather the remaining troops.',
    'Earlier Ding Daogui had fled to Lingling and sought Hongya, who ordered the remnant troops collected.',
  ],
  s0526: [
    'They surrendered together.',
    'The two surrendered together.',
  ],
  s0527: [
    'After Hongya had surrendered to the rebels, the rebels then killed Daogui.',
    'Once Hongya had surrendered, the rebels killed Daogui.',
  ],
  s0528: [
    'On bingzi, the rebel generals Wu Zang and others led troops to seize Chelun.',
    'On bingzi rebel generals Wu Zang and others took Chelun with their troops.',
  ],
  s0529: [
    'On gengyin, two dragons were seen on the western river of Xiang Province.',
    'On gengyin two dragons appeared on Xiang Province\'s western river.',
  ],
  s0530: [
    'In summer, the fourth month, on bingshen, Sengbian\'s army halted at Chelun.',
    'On bingshen in the fourth month of summer Sengbian\'s army camped at Chelun.',
  ],
  s0531: [
    'In the fifth month, on jiazi, the hosts attacked the rebels and routed them utterly.',
    'On jiazi in the fifth month the armies attacked the rebels and broke them completely.',
  ],
  s0532: [
    'On yichou, Sengbian\'s army reached Changsha.',
    'On yichou Sengbian\'s army arrived at Changsha.',
  ],
  s0533: [
    'On jiaxu, Yuchi Jiong pressed close to Baxi; Tong Province Inspector Yang Qianyun surrendered the city and received Jiong.',
    'On jiaxu Yuchi Jiong advanced on Baxi; Tongzhou inspector Yang Qianyun surrendered the city to him.',
  ],
  s0534: [
    'On jichou, Xiao Ji\'s army reached Xiling.',
    'On jichou Xiao Ji\'s army came to Xiling.',
  ],
  s0535: [
    'In the sixth month, on yimao, Xiang Province was pacified.',
    'On yimao in the sixth month Xiang Province was pacified.',
  ],
  s0536: [
    'That month, Yuchi Jiong besieged Yi Province.',
    'That month Yuchi Jiong besieged Yi Province.',
  ],
  s0537: [
    'In autumn, the seventh month, on xinwei, the Ba men Fu Sheng and Xu Zichu beheaded the rebel city chief Gongsun Chao and surrendered the city.',
    'On xinwei in the seventh month of autumn the Ba men Fu Sheng and Xu Zichu slew the rebel commandant Gongsun Chao and offered up the city.',
  ],
  s0538: [
    'Ji\'s host collapsed in great rout; those who met troops died.',
    'Ji\'s forces collapsed; whoever met the army died.',
  ],
  s0539: [
    'On yiwei, Wang Sengbian withdrew his army to Jiangling; an edict ordered the hosts each to return to their garrisons.',
    'On yiwei Wang Sengbian led the army back to Jiangling, and an edict sent the hosts to their posts.',
  ],
  s0540: [
    'In the eighth month, on wuxu, Yuchi Jiong took Yi Province.',
    'On wuxu in the eighth month Yuchi Jiong captured Yi Province.',
  ],
  s0541: [
    'On gengzi, an edict said: "From the first dwelling at Bo one did not abandon the capital of the former kings;',
    'On gengzi an edict said, "From the first settlement at Bo the former kings\' capital was not cast aside;',
  ],
  s0542: [
    'receiving the mandate from Zhou, one did not alter the old realm\'s praise.',
    'receiving Zhou\'s mandate, the old realm\'s praise was not changed.',
  ],
  s0543: [
    'Recently the war banners have rested and the frontier watch-towers are quiet.',
    'Lately the war banners have ceased and the frontier passes are unalarmed.',
  ],
  s0544: [
    'To leave Lu and sigh, moved even at midnight; to pass Pei and shed tears, truly laboring through the night\'s sleep.',
    'Leaving Lu one sighs, stirred even at midnight; passing Pei one weeps, kept awake through the night.',
  ],
  s0545: [
    'Yet Xiao and Xiang still rebelled, Yong and Shu still barred arms—generals were appointed and statutes given, with a set day for pacification.',
    'Yet the Xiao and Xiang still rose, Yong and Shu still bore arms; commanders were named, laws issued, and a day fixed for victory.',
  ],
  s0546: [
    'Now the eight regions are ordered and the four suburbs know no rampart; it is fitting to follow the canon of the green canopy and speak of returning to the homeland of white water.',
    'Now the eight directions are at peace and the four suburbs have no walls; we should follow the rite of the green canopy and speak of returning to the white-water homeland.',
  ],
  s0547: [
    'Jiang and Xiang will send tribute, square-keeled ships chained bow to stern; Ba Gorge war craft and a million elite armors will first reach Jianye to manifest the capital, then the six armies will march swiftly, the nine banners raise their staffs, to bow at the imperial tombs and restore the ancestral altars.',
    'Jiang and Xiang will send grain by linked convoys; Ba Gorge fleets and a million armored men will first reach Jianye to show the capital, then the six armies will march, nine banners rise, to bow at the tombs and restore the altars.',
  ],
  s0548: [
    'The responsible offices should follow the old statutes in detail and proclaim this in season."',
    'Let the responsible offices follow the old statutes in detail and proclaim this in season."',
  ],
  s0549: [
    'In the ninth month, on gengwu, Minister Over the Masses Wang Sengbian returned to his command.',
    'On gengwu in the ninth month Minister Over the Masses Wang Sengbian returned to his post.',
  ],
  s0550: [
    'On bingzi, Protector-General Lu Fahe was made Yingzhou Inspector.',
    'On bingzi Protector-General Lu Fahe was made Yingzhou inspector.',
  ],
  s0551: [
    'On yiyou, Prince of Jin\'an Fang Zhi was made Jiangzhou Inspector.',
    'On yiyou Prince Fang Zhi of Jin\'an was made Jiangzhou inspector.',
  ],
  s0552: [
    'That month, Wei sent Guo Yuanjian to manage a fleet at Hefei, and also sent Grand Generals Xing Guoyuan, Buluohan Sa, and Dongfang Lao with hosts to join him.',
    'That month Wei sent Guo Yuanjian to ready ships at Hefei, and Grand Generals Xing Guoyuan, Buluohan Sa, and Dongfang Lao with armies to join him.',
  ],
  s0553: [
    'In winter, the eleventh month, on xinyou, Sengbian halted at Gushu and at once remained to garrison there.',
    'On xinyou in the eleventh month of winter Sengbian camped at Gushu and stayed to garrison it.',
  ],
  s0554: [
    'He sent South Yu Inspector Hou Tian to hold the Dongguan rampart and summoned Wu Commandery Administrator Pei Zhiheng to lead a host in support.',
    'He sent South Yu inspector Hou Tian to hold the Dongguan fort and called Wuxing administrator Pei Zhiheng with troops to follow.',
  ],
  s0555: [
    'On wuxu, Right Vice Director of the Masters of Writing Wang Bao was made Left Vice Director; Xiangdong Administrator Zhang Gun was made Right Vice Director.',
    'On wuxu Right Vice Director Wang Bao became Left Vice Director, and Xiangdong administrator Zhang Gun became Right Vice Director.',
  ],
  s0556: [
    'In the twelfth month, the native elders of Suyu, Dongfang Guang, held the city and submitted; Wei\'s Jiangxi commanderies all rose in answer.',
    'In the twelfth month Dongfang Guang of Suyu, a local leader, held the city and came over; Wei\'s Jiangxi districts all rose in response.',
  ],
  s0557: [
    'In spring, the first month, on jiawu, year 3, South Yu Inspector Hou Tian was advanced to General Who Pacifies the North, Opening Office Equal in Three Departments.',
    'On jiawu in the first month of spring, year 3, South Yu inspector Hou Tian was promoted to General Who Pacifies the North and Opening Office Equal in Three Departments.',
  ],
  s0558: [
    'Chen Baxian led his host to attack Guangling city.',
    'Chen Baxian led his army against Guangling.',
  ],
  s0559: [
    'Qin Province Inspector Yan Chaoda from Qin commandery besieged Jing Province; Hou Tian and Zhang Biao went out by Shiliang as a supporting force.',
    'Qinzhou inspector Yan Chaoda besieged Jingzhou from Qin commandery; Hou Tian and Zhang Biao marched out through Shiliang in support.',
  ],
  s0560: [
    'On xinchou, Chen Baxian sent Jinling Administrator Du Sengming to lead a host to aid Dongfang Guang.',
    'On xinchou Chen Baxian sent Jinling administrator Du Sengming with troops to aid Dongfang Guang.',
  ],
  s0561: [
    'In the third month, on jiachen, Minister Over the Masses Wang Sengbian was made Grand Marshal and General of Chariots and Cavalry.',
    'On jiachen in the third month Minister Over the Masses Wang Sengbian was made Grand Marshal and General of Chariots and Cavalry.',
  ],
  s0562: [
    'On dingwei, Wei sent General Wang Qiu with seven hundred men to attack Suyu; Du Sengming met them in counterattack and routed them utterly.',
    'On dingwei Wei sent General Wang Qiu with seven hundred men against Suyu; Du Sengming met them and broke them completely.',
  ],
  s0563: [
    'On wushen, Protector-General and Yingzhou Inspector Lu Fahe was made Minister Over the Masses.',
    'On wushen Protector-General and Yingzhou inspector Lu Fahe was made Minister Over the Masses.',
  ],
  s0564: [
    'In summer, the fourth month, on guiyou, General Who Pacifies the North, Opening Office Equal in Three Departments Chen Baxian was made Minister of Works.',
    'On guiyou in the fourth month of summer General Who Pacifies the North Chen Baxian, Opening Office Equal in Three Departments, was made Minister of Works.',
  ],
  s0565: [
    'In the sixth month, on renwu, Wei again sent General Buluohan Sa with a host to relieve Jing Province.',
    'On renwu in the sixth month Wei again sent General Buluohan Sa with an army to relieve Jingzhou.',
  ],
  s0566: [
    'On guiwei, black vapor like a dragon was seen within the palace hall.',
    'On guiwei black qi like a dragon appeared inside the palace hall.',
  ],
  s0567: [
    'In autumn, the seventh month, on jiachen, Director of the Ministry of Justice Zong Lin was made Minister of Civil Appointments.',
    'On jiachen in the seventh month of autumn Director of the Ministry of Justice Zong Lin was made Minister of Civil Appointments.',
  ],
  s0568: [
    'In the ninth month, on xinmao, Shizu expounded the meaning of the Laozi at the Dragon Light Hall; Left Vice Director of the Masters of Writing Wang Bao held the classics.',
    'On xinmao in the ninth month Shizu lectured on the Laozi at Dragon Light Hall; Left Vice Director Wang Bao held the text.',
  ],
  s0569: [
    'On yisi, Wei sent its Pillar of State Wan Niuyu Jin with a great host to invade.',
    'On yisi Wei sent Pillar of State Wan Niuyu Jin with a great army against us.',
  ],
  s0570: [
    'In winter, the tenth month, on bingyin, the Wei army reached Xiangyang; Xiao Cha led a host to join it.',
    'On bingyin in the tenth month of winter the Wei army reached Xiangyang; Xiao Cha joined it with his forces.',
  ],
  s0571: [
    'On dingmao, lectures ceased; within and without the palace were placed on alert, and the imperial carriage went out to the capital palisade.',
    'On dingmao teaching stopped; court and camp were armed, and the emperor went out to the capital stockade.',
  ],
  s0572: [
    'That day a great wind uprooted trees; on bingzi, Wang Sengbian\'s army and others were summoned.',
    'That day a great wind tore up trees; on bingzi Wang Sengbian and other armies were summoned.',
  ],
  s0573: [
    'In the twelfth month, on bingchen, Xu Shipu and Ren Yue withdrew their garrisons from Baling.',
    'On bingchen in the twelfth month Xu Shipu and Ren Yue pulled back from Baling.',
  ],
  s0574: [
    'On xinwei, Western Wei killed Shizu, and he thereupon died, aged forty-seven.',
    'On xinwei Western Wei killed Shizu, and he died at forty-seven.',
  ],
  s0575: [
    'Crown Prince Yuanliang and Prince of Shian Fang Lue were both killed.',
    'Crown Prince Yuanliang and Prince Fang Lue of Shian were both slain.',
  ],
  s0576: [
    'Then tens of thousands of common men and women were chosen, divided into slaves and maidservants, and driven into Chang\'an;',
    'Then tens of thousands of men and women of the people were taken, divided into slaves and maidservants, and driven to Chang\'an;',
  ],
  s0577: [
    'the small and weak were all killed.',
    'the small and weak were all put to death.',
  ],
  s0578: [
    'In the fourth month of the following year he was posthumously honored as Emperor Xiaoyuan, with temple name Shizu.',
    'In the fourth month of the next year he was posthumously titled Emperor Xiaoyuan, temple name Shizu.',
  ],
  s0579: [
    'Shizu was perceptive, quick, and handsome, with heaven-given brilliance bursting forth.',
    'Shizu was clever, handsome, and quick, with a heaven-sent brilliance.',
  ],
  s0580: [
    'At age five, the Gaozu asked, "What book do you read?"',
    'At five the Gaozu asked, "What book are you reading?"',
  ],
  s0581: [
    'He answered, "I can recite the Record of Rites."',
    'He answered, "I can recite the Record of Rites."',
  ],
  s0582: [
    'The Gaozu said, "Try reciting it for me."',
    'The Gaozu said, "Recite some for me."',
  ],
  s0583: [
    'He at once recited the first section, and none left or right failed to marvel.',
    'He recited the first section at once, and all around were astonished.',
  ],
  s0584: [
    'At birth he had suffered from the eyes; the Gaozu himself attended to curing them, yet one eye was blinded—and all the more was he cherished in pitying love.',
    'Born with an eye ailment, the Gaozu treated it himself, yet one eye was left blind—and his affection only deepened.',
  ],
  s0585: [
    'When grown he loved learning, mastered many books, wrote essays at a stroke and spoke in structured argument; his talent, eloquence, and speed were unmatched in his age.',
    'Grown, he loved study, mastered many books, wrote at a stroke and spoke in reasoned discourse—none in his time matched his quick wit.',
  ],
  s0586: [
    'The Gaozu once asked, "Sun Ce in his day on the Jiangdong—how old was he then?"',
    'The Gaozu once asked, "Sun Ce on the Jiangdong—how old was he?"',
  ],
  s0587: [
    'He answered, "Seventeen."',
    'He answered, "Seventeen."',
  ],
  s0588: [
    'The Gaozu said, "That is exactly your age."',
    'The Gaozu said, "That is just your age."',
  ],
  s0589: [
    'He Ge served as staff adviser; an order was given for He Ge to lecture on the Three Rites.',
    'He Ge was staff adviser; the emperor ordered He Ge to lecture on the Three Rites.',
  ],
  s0590: [
    'Shizu by nature did not care for music and the women\'s quarters; he bore a high reputation, and with Pei Ziye, Liu Xian, Xiao Ziyun, Zhang Zuan, and the talented men of the time he kept the friendship of plain cloth; his writings and compositions circulated widely in the world.',
    'Shizu cared little for music and women; he had a high name, and with Pei Ziye, Liu Xian, Xiao Ziyun, Zhang Zuan, and the day\'s finest men he kept friendships in plain dress; his writings circulated widely.',
  ],
  s0591: [
    'At Xunyang he dreamed a man said, "The realm will fall into disorder—you, King, must hold it together."',
    'At Xunyang he dreamed a man said, "The realm will fall into chaos—you, King, must steady it."',
  ],
  s0592: [
    'A black mole also grew on his back; a shaman woman seeing it said, "This is a sign of the greatest nobility—it cannot be spoken."',
    'A black mole grew on his back; a shaman woman said, "This is a mark of supreme nobility—it must not be told."',
  ],
  s0593: [
    'Earlier, when He Ge went west he was deeply displeased; passing by he took leave of Censor-in-Chief Jiang Ge and told him his feelings.',
    'Earlier He Ge went west in deep displeasure; stopping to bid farewell to Censor-in-Chief Jiang Ge, he confided his mind.',
  ],
  s0594: [
    'Jiang Ge said, "I once dreamed the sovereign looked on all his sons; when he came to the Prince of Xiangdong he pulled off his cap and handed it to him.',
    'Jiang Ge said, "I once dreamed the emperor saw all his sons; at the Prince of Xiangdong he removed his cap and gave it to him.',
  ],
  s0595: [
    'This man will surely receive the jade disk afterward—you should go!"',
    'This man will surely take the throne—you should go!"',
  ],
  s0596: [
    'He Ge followed his counsel.',
    'He Ge took his advice.',
  ],
  s0597: [
    'When the calamity of Taiqing came, he alone could recover the realm—therefore far and near gladly pushed him forward, and he received the precious mandate.',
    'When the Taiqing disaster struck, he alone could restore the land—so near and far acclaimed him, and he received the throne.',
  ],
  s0598: [
    'His works included Records of Filial Virtue in thirty scrolls, Records of Loyal Ministers in thirty scrolls, and Records of the Danyang Intendant in ten scrolls.',
    'He wrote Records of Filial Virtue in thirty juan, Records of Loyal Ministers in thirty juan, and Records of the Danyang Intendant in ten juan.',
  ],
  s0599: [
    'Commentary on the Han History in one hundred fifteen scrolls, Exegesis of the Changes in ten scrolls, Essentials of the Inner Canon in one hundred scrolls, Linked Mountains in thirty scrolls, Cavern Forest in three scrolls, Jade Sheath in ten scrolls, Supplement to the Missing Master in ten scrolls, Exegesis of the Laozi in four scrolls, Records of Complete Virtue, Records of Old Friends, Records of Jingnan, Records of Jiang Province, Tribute Duties Illustrated, Register of Identical Names Ancient and Modern in one scroll, Classic of Divination in twelve scrolls, Praise of Forms in three scrolls, and collected writings in fifty scrolls.',
    'He also wrote Commentary on the Han History in 115 juan, Exegesis of the Changes in 10 juan, Essentials of the Inner Canon in 100 juan, Linked Mountains in 30 juan, Cavern Forest in 3 juan, Jade Sheath in 10 juan, Supplement to the Missing Master in 10 juan, Exegesis of the Laozi in 4 juan, Records of Complete Virtue, Records of Old Friends, Records of Jingnan, Records of Jiang Province, Tribute Duties Illustrated, Register of Identical Names Ancient and Modern in 1 juan, Classic of Divination in 12 juan, Praise of Forms in 3 juan, and collected works in 50 juan.',
  ],
  s0600: [
    'The historiographer says: In the calamity of the Liang age, a great bandit leaned on his rampart; in his time Shizu held the long post of regional commander and possessed the full resources of Chu—he ought to have led the lords in person, pillowing his spear and taking the vanguard.',
    'The historiographer says: In the disaster of the Liang season a great robber held his fortress; Shizu then stood as chief regional commander with the whole strength of Chu—he should have led the feudal lords himself, spear at bedside, on the foremost road.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_005_b6.mjs <translation.json>'
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
