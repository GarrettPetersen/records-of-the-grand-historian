#!/usr/bin/env node
import fs from 'node:fs';

const path = 'translations/current_translation_songshu.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const T = {
  s0201: {
    literal: 'Those skilled in civil and military matters shall be appointed according to their talents.',
    idiomatic: 'Those skilled in civil and military affairs shall be appointed according to their talents.',
  },
  s0202: {
    literal: '" On xinwei day newly appointed Inspector of Guang Liu Yao was made Inspector of Yi; former Administrator of Baxi and Zitong Fei Hun was made Inspector of Guang.',
    idiomatic: '" On the xinwei day Liu Yao, newly appointed Inspector of Guang, was reassigned as Inspector of Yi; former Administrator of Baxi and Zitong Fei Hun was appointed Inspector of Guang.',
  },
  s0203: {
    literal: 'Liu Yao captured Shouyang; Yu province was pacified.',
    idiomatic: 'Liu Yao captured Shouyang and Yu province was pacified.',
  },
  s0204: {
    literal: 'On xinsi day General Who Assists the State Liu Lingyi was made Inspector of Liang and Southern Qin.',
    idiomatic: 'On the xinsi day General Who Assists the State Liu Lingyi was appointed Inspector of Liang and Southern Qin.',
  },
  s0205: {
    literal: '[12] Xue Andu intended to summon the Northern barbarians; Zhang Yong and Shen Youzhi suffered great defeat, and thus the four provinces north of the Huai and the lands west of the Huai in Yu province were lost.',
    idiomatic: '[12] Xue Andu sought to bring in the Northern barbarians; Zhang Yong and Shen Youzhi suffered crushing defeat, and the dynasty lost the four provinces north of the Huai and the Huai-western territories of Yu province.',
  },
  s0206: {
    literal: 'Third year, spring, first month, gengzi day—because agricultural labor was about to begin, the Chief Steward ceased slaughtering cattle.',
    idiomatic: 'In the third year, on the gengzi day of the first month of spring, because agricultural labor was about to begin, the Chief Steward ceased slaughtering cattle.',
  },
  s0207: {
    literal: 'On guimao day partial amnesty was granted to Yu and Southern Yu.',
    idiomatic: 'On the guimao day a partial amnesty was proclaimed for Yu and Southern Yu.',
  },
  s0208: {
    literal: 'General of the Guard Prince Baling Wang Xiuruo was demoted in rank to General Who Pacifies the West.',
    idiomatic: 'General of the Guard Prince Baling Wang Xiuruo was demoted to General Who Pacifies the West.',
  },
  s0209: {
    literal: 'Intercalary month, gengwu day—heavy rain and snow fell in the capital; envoys were dispatched on inspection tours, and relief grants varied in measure.',
    idiomatic: 'On the gengwu day of the intercalary month heavy rain and snow fell in the capital; envoys were sent on inspection tours and relief was distributed according to need.',
  },
  s0210: {
    literal: 'On wuyin day General Who Attacks in Mobile Warfare Yuan Hong was made Inspector of Yi.',
    idiomatic: 'On the wuyin day General Who Attacks in Mobile Warfare Yuan Hong was appointed Inspector of Yi.',
  },
  s0211: {
    literal: '[13] General Who Attacks in Mobile Warfare Yuan Hong was made Inspector of Yi: in all editions "Yuan Hong" reads "Yuan Lang." Zhang Senkai\'s collation notes say: "Yuan Lang was already killed by Prince Jingling Wang Dan in the third year of Daming, as recorded in the biography of Yuan Huzhi. This should be Yuan Hong." Following Zhang\'s view, the text is now corrected.',
    idiomatic: '[13] General Who Attacks in Mobile Warfare Yuan Hong was made Inspector of Yi: all editions read "Yuan Lang" for "Yuan Hong." Zhang Senkai notes that Yuan Lang was killed by Prince Jingling Wang Dan in the third year of Daming (see the biography of Yuan Huzhi); this should read Yuan Hong. The text is corrected accordingly.',
  },
  s0212: {
    literal: 'Second month, jiashen day—Director of the Censorate Yang Xi was made Inspector of Guang.',
    idiomatic: 'On the jiashen day of the second month Director of the Censorate Yang Xi was appointed Inspector of Guang.',
  },
  s0213: {
    literal: '[14] That same day the imperial carriage held mourning for officers and soldiers who died in battle.',
    idiomatic: '[14] That same day the Emperor held mourning rites for officers and soldiers who died in battle.',
  },
  s0214: {
    literal: 'On jichou day Chief Clerk of the Pacifying West Army Liu Liang was made Inspector of Liang and Southern Qin.',
    idiomatic: 'On the jichou day Chief Clerk of the Pacifying West Army Liu Liang was appointed Inspector of Liang and Southern Qin.',
  },
  s0215: {
    literal: 'The Northern barbarians raided Ruyin; Administrator Zhang Jingyuan defeated them.',
    idiomatic: 'The Northern barbarians raided Ruyin; Administrator Zhang Jingyuan routed them.',
  },
  s0216: {
    literal: 'On bingshen day partial amnesty was granted to Qing and Ji.',
    idiomatic: 'On the bingshen day a partial amnesty was proclaimed for Qing and Ji.',
  },
  s0217: {
    literal: 'Third month, bingzi day—Left Vice Director of the Masters of Writing Cai Xingzong was made General Who Pacifies the West and Inspector of Ying.',
    idiomatic: 'On the bingzi day of the third month Left Vice Director of the Masters of Writing Cai Xingzong was appointed General Who Pacifies the West and Inspector of Ying.',
  },
  s0218: {
    literal: 'On wuyin day General Who Conquers the Enemy Wang Xuanzai was made Inspector of Xu; General Who Calms the North Cui Ping was made Inspector of Yan.',
    idiomatic: 'On the wuyin day General Who Conquers the Enemy Wang Xuanzai was appointed Inspector of Xu, and General Who Calms the North Cui Ping was made Inspector of Yan.',
  },
  s0219: {
    literal: 'Summer, fourth month, guisi day—former Inspector of Si Zheng Hei was made Inspector of Si.',
    idiomatic: 'On the guisi day of the fourth month of summer former Inspector of Si Zheng Hei was reappointed Inspector of Si.',
  },
  s0220: {
    literal: 'On yiwei day General Who Conquers the Enemy and Inspector of Northern Qin Yang Sengsi was promoted to General Who Conquers the West.',
    idiomatic: 'On the yiwei day General Who Conquers the Enemy and Inspector of Northern Qin Yang Sengsi was promoted to General Who Conquers the West.',
  },
  s0221: {
    literal: 'On gengzi day Desi, second son of Prince Guiyang Wang Xiufan, was established as Prince of Luling; Yao, second son of Attendant-in-Ordinary Liu Yun, was established as Prince of Nanfeng.',
    idiomatic: 'On the gengzi day Desi, second son of Prince Guiyang Wang Xiufan, was enfeoffed as Prince of Luling; Yao, second son of Attendant-in-Ordinary Liu Yun, was enfeoffed as Prince of Nanfeng.',
  },
  s0222: {
    literal: 'On bingwu day General Who Pacifies the West Cai Xingzong was demoted in rank to General Who Levels the West.',
    idiomatic: 'On the bingwu day General Who Pacifies the West Cai Xingzong was demoted to General Who Levels the West.',
  },
  s0223: {
    literal: 'Fifth month, bingchen day—within the forbidden precinct of Empress Dowager Xuan\'s Chongning Mausoleum, those who had buried or moved grave dwellings were granted burial expenses, and household corvée was remitted.',
    idiomatic: 'On the bingchen day of the fifth month, within the forbidden precinct of Empress Dowager Xuan\'s Chongning Mausoleum, those who had buried or moved grave dwellings were granted burial expenses and their households exempted from corvée.',
  },
  s0224: {
    literal: 'On wuwu day General of Chariots and Cavalry and Inspector of Southern Yu Wang Xuanmo was made Left Grand Master of the Palace with Staff equal to Three Divisions.',
    idiomatic: 'On the wuwu day General of Chariots and Cavalry and Inspector of Southern Yu Wang Xuanmo was appointed Left Grand Master of the Palace with protocol equal to a three-division office.',
  },
  s0225: {
    literal: 'On xinyou day Southern Yu province was abolished and merged into Yu province.',
    idiomatic: 'On the xinyou day Southern Yu province was abolished and merged into Yu province.',
  },
  s0226: {
    literal: 'On renxu day Grand Tutor of the Heir Apparent Yuan Can was made Vice Director of the Masters of Writing.',
    idiomatic: 'On the renxu day Grand Tutor of the Heir Apparent Yuan Can was appointed Vice Director of the Masters of Writing.',
  },
  s0227: {
    literal: 'Sixth month, yiyou day—Attendant-in-Ordinary Liu Yun was made Inspector of Xiang.',
    idiomatic: 'On the yiyou day of the sixth month Attendant-in-Ordinary Liu Yun was appointed Inspector of Xiang.',
  },
  s0228: {
    literal: 'Autumn, seventh month, renzi day—Left Grand Master of the Palace with Staff equal to Three Divisions Wang Xuanmo was made Special Grand Master, Left Grand Master of the Palace, and General Who Protects the Army.',
    idiomatic: 'On the renzi day of the seventh month of autumn Wang Xuanmo, Left Grand Master of the Palace with protocol equal to a three-division office, was promoted to Special Grand Master and Left Grand Master of the Palace and appointed General Who Protects the Army.',
  },
  s0229: {
    literal: 'Xue Andu\'s son Boling briefly held four commanderies of Yong; Inspector Prince Baling Wang Xiuruo suppressed and beheaded him.',
    idiomatic: 'Xue Andu\'s son Boling briefly seized four commanderies of Yong; Inspector Prince Baling Wang Xiuruo suppressed the revolt and beheaded him.',
  },
  s0230: {
    literal: 'Eighth month, dingyou day—an edict said: "In antiquity the forest and lake officers established regulations: even tiny creatures were not gathered;',
    idiomatic: 'Eighth month, dingyou day—an edict said: "In antiquity the forest and lake officers established regulations: even the smallest creatures were not gathered;',
  },
  s0231: {
    literal: 'what rivers and marshes produced was brought forth and presented at court.',
    idiomatic: 'what rivers and marshes produced was brought forth and presented at court.',
  },
  s0232: {
    literal: 'Thus the people\'s wealth was heaped up and the virtue of nurturing life was fulfilled.',
    idiomatic: 'Thus the people\'s wealth was heaped up and the virtue of nurturing life was fulfilled.',
  },
  s0233: {
    literal: 'Recently merchants pursued the secondary and competed to harvest early and rush the new, plucking unripe fruit, seizing great families\' profits, caging birds unfit for the table, and making them resources for child entertainers.',
    idiomatic: 'Recently merchants pursued profit over substance and competed to harvest early and rush the new—plucking unripe fruit, seizing great families\' profits, caging birds unfit for the table, and turning them into toys for child entertainers.',
  },
  s0234: {
    literal: 'How can this restore the wind and honor the root, abandon ornament and pursue substance?',
    idiomatic: 'How can this restore proper values and honor the essential, abandoning ornament for substance?',
  },
  s0235: {
    literal: 'It is fitting to cultivate the Way and spread benevolence to reform this corruption.',
    idiomatic: 'It is fitting to cultivate the Way and spread benevolence to reform this corruption.',
  },
  s0236: {
    literal: 'From now on fish, shellfish, feathers, furs, meats, fruits, and all varieties—not what the seasons permit, not what vessels and flavors require—shall one and all be forbidden and cut off, with strict statutes established.',
    idiomatic: 'From now on fish, shellfish, feathers, furs, meats, fruits, and all varieties—not what the seasons permit, not what table and palate require—shall one and all be forbidden, with strict statutes established.',
  },
  s0237: {
    literal: '" On renyin day General of the Palace Guard Shen Youzhi acted as Inspector of Southern Yan and led the armies north in punitive campaign.',
    idiomatic: '" On the renyin day General of the Palace Guard Shen Youzhi acted as Inspector of Southern Yan and led the armies north on punitive campaign.',
  },
  s0238: {
    literal: 'On guimao day an edict said: "The use of the legal net is timed to the age; the path of leniency and grace is spread according to the times.',
    idiomatic: 'On the guimao day an edict said: "The use of the legal net is timed to the age; the path of leniency and grace is spread according to the times.',
  },
  s0239: {
    literal: 'Moreover I honor virtue and quell disorder, governing the people by benevolence—it is fitting always to seek breadth and simplicity to elevate the highest governance.',
    idiomatic: 'Moreover I honor virtue and quell disorder, governing the people by benevolence—it is fitting always to seek breadth and simplicity to achieve the highest governance.',
  },
  s0240: {
    literal: 'Yet repeatedly we have suffered warfare; corvée and levies have not ceased; soldiers and people practice cunning and falsehood, and affairs arising are very many; those who tread punishment and enter the statutes are surely not of one category alone.',
    idiomatic: 'Yet repeatedly we have suffered warfare; corvée and levies have not ceased; soldiers and people practice cunning and falsehood, and new abuses multiply; those who fall under punishment and enter the statutes are surely not of one category alone.',
  },
  s0241: {
    literal: 'Some even borrow names in the army ranks, steal titles in private halls, use the scattering of battle to flee, and plead fear to evade service.',
    idiomatic: 'Some even borrow names in the army rolls, steal titles in private halls, exploit the chaos of battle to flee, and plead fear to evade service.',
  },
  s0242: {
    literal: 'Moreover those who were overrun and compelled in the past, though repeatedly pardoned, the party of fugitives is still truly numerous.',
    idiomatic: 'Moreover those who were overrun and compelled in the past, though repeatedly pardoned, the ranks of fugitives remain truly numerous.',
  },
  s0243: {
    literal: 'Night words and long brooding bring me deep compassion and guilt together.',
    idiomatic: 'Night after night I brood upon this with deep compassion and guilt.',
  },
  s0244: {
    literal: 'I think therefore to spread grace anew and extend it through the realm.',
    idiomatic: 'I think therefore to spread grace anew and extend it throughout the realm.',
  },
  s0245: {
    literal: 'A general amnesty may be proclaimed throughout the empire.',
    idiomatic: 'Let a general amnesty be proclaimed throughout the empire.',
  },
  s0246: {
    literal: '" Newly appointed Left Grand Master of the Palace Wang Xuanmo was given the additional title General of Chariots and Cavalry.',
    idiomatic: '" Wang Xuanmo, newly appointed Left Grand Master of the Palace, was further promoted to General of Chariots and Cavalry.',
  },
  s0247: {
    literal: 'On bingwu day Director of the Office of Personnel Chu Yuan was dispatched to comfort and reward the commanders along the Huai, granting rewards as circumstances required.',
    idiomatic: 'On the bingwu day Director of the Office of Personnel Chu Yuan was dispatched to comfort and reward the commanders along the Huai, with grants measured to circumstances.',
  },
  s0248: {
    literal: 'On wushen day newly appointed General of the Right Guard Liu Yao was made Inspector of Yu.',
    idiomatic: 'On the wushen day Liu Yao, newly appointed General of the Right Guard, was made Inspector of Yu.',
  },
  s0249: {
    literal: 'Ninth month, guichou day—General Who Pacifies the West and Inspector of Yong Prince Baling Wang Xiuruo was promoted to General of the Guard; General Who Levels the West and Inspector of Ying Cai Xingzong was promoted to General Who Pacifies the West.',
    idiomatic: 'On the guichou day of the ninth month General Who Pacifies the West and Inspector of Yong Prince Baling Wang Xiuruo was promoted to General of the Guard, and General Who Levels the West and Inspector of Ying Cai Xingzong was promoted to General Who Pacifies the West.',
  },
  s0250: {
    literal: 'On yimao day Colonel of the Rapid Cavalry Zhou Ningmin was made Inspector of Yan.',
    idiomatic: 'On the yimao day Colonel of the Rapid Cavalry Zhou Ningmin was appointed Inspector of Yan.',
  },
  s0251: {
    literal: 'On wuwu day one thousand sets of miscellaneous garments from the empress and the six palaces downward and one thousand gold hairpins were distributed in grant to the northern expedition officers and soldiers.',
    idiomatic: 'On the wuwu day one thousand sets of miscellaneous garments from the empress and the six palaces downward and one thousand gold hairpins were distributed to the officers and soldiers of the northern expedition.',
  },
  s0252: {
    literal: 'On gengshen day former General of the Van and concurrent Inspector of Ji Cui Daogu was promoted to General Who Levels the North.',
    idiomatic: 'On the gengshen day former General of the Van and concurrent Inspector of Ji Cui Daogu was promoted to General Who Levels the North.',
  },
  s0253: {
    literal: 'On jiazi day partial amnesty was granted to Xu, Yan, Qing, and Ji.',
    idiomatic: 'On the jiazi day a partial amnesty was proclaimed for Xu, Yan, Qing, and Ji.',
  },
  s0254: {
    literal: 'Winter, tenth month, renwu day—Prince Yanian of Xin\'an was re-enfeoffed as Prince of Shiping.',
    idiomatic: 'On the renwu day of the tenth month of winter Prince Yanian of Xin\'an was re-enfeoffed as Prince of Shiping.',
  },
  s0255: {
    literal: 'On wuzi day the Rouran state sent envoys presenting local products.',
    idiomatic: 'On the wuzi day the Rouran state sent envoys presenting tribute goods.',
  },
  s0256: {
    literal: 'On xinchou day the public fields of commanderies and counties were restored.',
    idiomatic: 'On the xinchou day the public fields of commanderies and counties were restored.',
  },
  s0257: {
    literal: 'General Who Pacifies the West and Inspector of Western Qin and He Tuyuhun Shibin was promoted to General Who Conquers the West.',
    idiomatic: 'General Who Pacifies the West and Inspector of Western Qin and He Tuyuhun Shibin was promoted to General Who Conquers the West.',
  },
  s0258: {
    literal: 'Eleventh month—Boyou, second son of Prince Jian\'an Wang Xiuren, was established as Prince of Jiangxia; Prince Chang of Yiyang was re-enfeoffed as Prince of Jinxi.',
    idiomatic: 'In the eleventh month Boyou, second son of Prince Jian\'an Wang Xiuren, was enfeoffed as Prince of Jiangxia, and Prince Chang of Yiyang was re-enfeoffed as Prince of Jinxi.',
  },
  s0259: {
    literal: 'On yimao day Eastern Xu province was established from Xu province; General Who Assists the State Zhang Tan was made inspector.',
    idiomatic: 'On the yimao day Eastern Xu province was carved out of Xu province; General Who Assists the State Zhang Tan was appointed its inspector.',
  },
  s0260: {
    literal: 'The states of Goguryeo and Baekje sent envoys presenting local products.',
    idiomatic: 'The states of Goguryeo and Baekje sent envoys presenting tribute goods.',
  },
  s0261: {
    literal: 'Twelfth month, gengchen day—General Who Calms the North Liu Xiubin was made Inspector of Yan.',
    idiomatic: 'On the gengchen day of the twelfth month General Who Calms the North Liu Xiubin was appointed Inspector of Yan.',
  },
  s0262: {
    literal: 'Fourth year, spring, first month, jiwei day—the imperial carriage personally sacrificed at the Southern Suburban Altar; a general amnesty was proclaimed throughout the empire.',
    idiomatic: 'In the fourth year, on the jiwei day of the first month of spring, the Emperor personally sacrificed at the Southern Suburban Altar and proclaimed a general amnesty throughout the empire.',
  },
  s0263: {
    literal: 'On gengwu day General of the Guard Prince Baling Wang Xiuruo was demoted in rank to General of the Left.',
    idiomatic: 'On the gengwu day General of the Guard Prince Baling Wang Xiuruo was demoted to General of the Left.',
  },
  s0264: {
    literal: 'On yihai day Chief Clerk of Lingling Wang Sima Xu died.',
    idiomatic: 'On the yihai day Chief Clerk of Lingling Wang Sima Xu died.',
  },
  s0265: {
    literal: 'Second month, xinchou day—former General of Flying Cavalry Chang Zhenqi was made General Who Levels the North and Inspector of Si; Zhenqi\'s son Chaoyue was made Inspector of Northern Ji.',
    idiomatic: 'On the xinchou day of the second month former General of Flying Cavalry Chang Zhenqi was appointed General Who Levels the North and Inspector of Si; Zhenqi\'s son Chaoyue was made Inspector of Northern Ji.',
  },
  s0266: {
    literal: '[15] On yisi day Right Grand Master of the Palace, General of Chariots and Cavalry, and General Who Protects the Army Wang Xuanmo died.',
    idiomatic: '[15] On the yisi day Right Grand Master of the Palace, General of Chariots and Cavalry, and General Who Protects the Army Wang Xuanmo died.',
  },
  s0267: {
    literal: '[16] Right Grand Master of the Palace, General of Chariots and Cavalry, and General Who Protects the Army Wang Xuanmo died: the Three Dynasties edition, Northern Directorate edition, Mao edition, and Hall edition read "Right Grand Master of the Palace"; the Bureau edition and Wang Xuanmo\'s biography read "Left Grand Master of the Palace."',
    idiomatic: '[16] Right Grand Master of the Palace, General of Chariots and Cavalry, and General Who Protects the Army Wang Xuanmo died: the Three Dynasties, Northern Directorate, Mao, and Hall editions read "Right Grand Master of the Palace"; the Bureau edition and Wang Xuanmo\'s biography read "Left Grand Master of the Palace."',
  },
  s0268: {
    literal: 'Third month, jiwei day, [17] General Who Attacks in Mobile Warfare Liu Huaizhen was made Inspector of Eastern Xu.',
    idiomatic: 'On the jiwei day of the third month, [17] General Who Attacks in Mobile Warfare Liu Huaizhen was appointed Inspector of Eastern Xu.',
  },
  s0269: {
    literal: 'On wuchen day Army Chief Clerk Liu Lingyi was made Inspector of Liang and Southern Qin, [18] Administrator of Southern Qiao Sun Fengbo was made Inspector of Jiao, [19] and Li Changren of Jiao province seized the province in rebellion.',
    idiomatic: 'On the wuchen day Army Chief Clerk Liu Lingyi was appointed Inspector of Liang and Southern Qin; [18] Administrator of Southern Qiao Sun Fengbo was made Inspector of Jiao; [19] and Li Changren of Jiao province seized the province in rebellion.',
  },
  s0270: {
    literal: 'Demon rebels attacked Guang province and killed Inspector Yang Xi; [20] General of Flying Cavalry Chen Bozhao suppressed and pacified them.',
    idiomatic: 'Demon rebels attacked Guang province and killed Inspector Yang Xi; [20] General of Flying Cavalry Chen Bozhao put down the revolt.',
  },
  s0271: {
    literal: 'Summer, fourth month, jimao day—the field salaries of commanderies and counties were again reduced by half.',
    idiomatic: 'On the jimao day of the fourth month of summer the field salaries of commanderies and counties were again reduced by half.',
  },
  s0272: {
    literal: '[21] On bingshen day Prince Hui of Donghai was re-enfeoffed as Prince of Lujiang, [22] Prince Shanyang Wang Xiuyou was re-enfeoffed as Prince of Jinping, and Jin\'an commandery was renamed Jinping commandery.',
    idiomatic: '[21] On the bingshen day Prince Hui of Donghai was re-enfeoffed as Prince of Lujiang; [22] Prince Shanyang Wang Xiuyou was re-enfeoffed as Prince of Jinping; and Jin\'an commandery was renamed Jinping commandery.',
  },
  s0273: {
    literal: 'On xinchou day the Rouran state and the King of Henan both sent envoys presenting local products.',
    idiomatic: 'On the xinchou day the Rouran state and the King of Henan both sent envoys presenting tribute goods.',
  },
  s0274: {
    literal: 'On jiachen day Administrator of Yuzhang Zhang Bian was made Inspector of Guang.',
    idiomatic: 'On the jiachen day Administrator of Yuzhang Zhang Bian was appointed Inspector of Guang.',
  },
  s0275: {
    literal: 'Fifth month, yisi day, [23] partial amnesty was granted to Guang province.',
    idiomatic: 'On the yisi day of the fifth month, [23] a partial amnesty was proclaimed for Guang province.',
  },
  s0276: {
    literal: 'On guihai day Acting Inspector of Yong Prince Baling Wang Xiuruo acted as Inspector of Xiang; Administrator of Kuaiji Zhang Yong was made Inspector of Yong; Inspector of Xiang Liu Yun was made Inspector of Southern Yan.',
    idiomatic: 'On the guihai day Acting Inspector of Yong Prince Baling Wang Xiuruo acted as Inspector of Xiang; Administrator of Kuaiji Zhang Yong was appointed Inspector of Yong; and Inspector of Xiang Liu Yun was made Inspector of Southern Yan.',
  },
  s0277: {
    literal: 'Eighth month, wuzi day—Chancellor of Nankang Liu Bo was made Inspector of Jiao.',
    idiomatic: 'On the wuzi day of the eighth month Chancellor of Nankang Liu Bo was appointed Inspector of Jiao.',
  },
  s0278: {
    literal: '[24] On xinmao day Eastern Qing province was established from Qing province; General Who Assists the State Shen Wenjing was made Inspector of Eastern Qing.',
    idiomatic: '[24] On the xinmao day Eastern Qing province was carved out of Qing province; General Who Assists the State Shen Wenjing was appointed Inspector of Eastern Qing.',
  },
  s0279: {
    literal: '[25] On dingyou day General Who Pacifies the South and Inspector of Jiang Wang Jingwen was promoted to General Who Stabilizes the South.',
    idiomatic: '[25] On the dingyou day General Who Pacifies the South and Inspector of Jiang Wang Jingwen was promoted to General Who Stabilizes the South.',
  },
  s0280: {
    literal: 'Ninth month, bingchen day—Chief Clerk of the General-in-Chief Who Runs Fast Zhang Yue was made Inspector of Yong.',
    idiomatic: 'On the bingchen day of the ninth month Chief Clerk of the General-in-Chief Who Runs Fast Zhang Yue was appointed Inspector of Yong.',
  },
  s0281: {
    literal: 'On wuchen day an edict said: "Offenses have small and great; punishment follows leniency or severity—thus the five punishments differ in use and the three canons differ in application.',
    idiomatic: 'On the wuchen day an edict said: "Offenses have small and great; punishment follows leniency or severity—thus the five punishments differ in use and the three canons differ in application.',
  },
  s0282: {
    literal: 'Yet when reduced penalties fall under the secondary net, one arrives at shackles and flogging; seeking the legal categories, the gradations grow ever more distant.',
    idiomatic: 'Yet when reduced penalties fall under the secondary net, one arrives at shackles and flogging; measured against the legal code, the gradations grow ever more distant.',
  },
  s0283: {
    literal: 'I strive to preserve reverent compassion and always grant clemency.',
    idiomatic: 'I strive to preserve reverent compassion and always grant clemency.',
  },
  s0284: {
    literal: 'Examining the statutes on robbery, [26] light and heavy alike are treated as capital offense—weighing the matter against the facts, this is not a detailed and balanced approach.',
    idiomatic: 'Examining the statutes on robbery, [26] light and heavy alike are treated as capital offenses—weighing the matter against the facts, this is not a balanced approach.',
  },
  s0285: {
    literal: 'From now on all who steal official weapons, resist battle and patrol officers, or raid posts and temples and harm officials and people—all such articles shall follow the old statutes.',
    idiomatic: 'From now on all who steal official weapons, resist patrol officers in battle, or raid posts and temples and harm officials and people—all such offenses shall follow the old statutes.',
  },
  s0286: {
    literal: 'Those who among five men or fewer forcibly seize from one another may specially be granted tattooing and mutilation, cast out to the four distant regions, and still used in place of execution—compared with antiquity this is lenient, preserving life and lengthening households, a grace equal to creation itself.',
    idiomatic: 'Those who among groups of five or fewer forcibly seize from one another may be granted tattooing and mutilation instead of death, cast out to the four distant regions—a leniency compared with antiquity that preserves life and lengthens households, a grace equal to creation itself.',
  },
  s0287: {
    literal: 'Thus may the transformation of simplicity and grace win the trust of the multitude; the virtue of cherishing life may leave no dark rank untouched.',
    idiomatic: 'Thus may the transformation of simplicity and grace win the trust of the multitude; the virtue of cherishing life may leave no soul untouched.',
  },
  s0288: {
    literal: '" On gengwu day partial amnesty was granted to Yang, Southern Xu, Yan, and Yu.',
    idiomatic: '" On the gengwu day a partial amnesty was proclaimed for Yang, Southern Xu, Yan, and Yu.',
  },
  s0289: {
    literal: 'Winter, tenth month, on the first day guiyou—there was a solar eclipse.',
    idiomatic: 'On the guiyou day, the first of the tenth month of winter, there was a solar eclipse.',
  },
  s0290: {
    literal: 'Troops from the various provinces were mobilized for the northern punitive campaign.',
    idiomatic: 'Troops from the various provinces were mobilized for the northern punitive campaign.',
  },
  s0291: {
    literal: 'The four commanderies of Nankang, Jian\'an, Ancheng, and Xuancheng had never joined the southern rebellion and were not included in the levy.',
    idiomatic: 'The four commanderies of Nankang, Jian\'an, Ancheng, and Xuancheng had never joined the southern rebellion and were exempt from the levy.',
  },
  s0292: {
    literal: 'On jiaxu day Yixing commandery in Yang province was detached and placed under Southern Xu province.',
    idiomatic: 'On the jiaxu day Yixing commandery in Yang province was detached and placed under Southern Xu province.',
  },
  s0293: {
    literal: 'Fifth year, spring, first month, guihai day—the imperial carriage personally plowed the sacred field.',
    idiomatic: 'In the fifth year, on the guihai day of the first month of spring, the Emperor personally plowed the sacred field.',
  },
  s0294: {
    literal: 'A general amnesty was proclaimed throughout the empire; those who worked the fields diligently were granted one step in noble rank.',
    idiomatic: 'A general amnesty was proclaimed throughout the empire, and diligent farmers were granted one step in noble rank.',
  },
  s0295: {
    literal: 'Second month, bingshen day—Southern Yu province was established from Yu and Yang provinces; Grand Minister of Works Prince Hui of Lujiang was made General of Chariots and Cavalry with Staff equal to Three Divisions and Inspector of Southern Yu.',
    idiomatic: 'On the bingshen day of the second month Southern Yu province was carved out of Yu and Yang provinces; Grand Minister of Works Prince Hui of Lujiang was appointed General of Chariots and Cavalry with protocol equal to a three-division office and Inspector of Southern Yu.',
  },
  s0296: {
    literal: 'Third month, yimao day—Southern Yiyang commandery was established within Southern Yu province.',
    idiomatic: 'On the yimao day of the third month Southern Yiyang commandery was established within Southern Yu province.',
  },
  s0297: {
    literal: 'On bingyin day the imperial carriage visited the Central Hall to hear lawsuits.',
    idiomatic: 'On the bingyin day the Emperor visited the Central Hall to hear lawsuits.',
  },
  s0298: {
    literal: 'On jisi day the King of Henan sent envoys presenting local products.',
    idiomatic: 'On the jisi day the King of Henan sent envoys presenting tribute goods.',
  },
  s0299: {
    literal: 'Summer, fourth month, xinwei day—Suicheng in Yong province was detached and placed under Ying province.',
    idiomatic: 'On the xinwei day of the fourth month of summer Suicheng in Yong province was detached and placed under Ying province.',
  },
  s0300: {
    literal: 'On yiyou day Yiyang commandery in Yu province was detached and placed under Ying province; Xiyang commandery in Ying province was placed under Yu province.',
    idiomatic: 'On the yiyou day Yiyang commandery in Yu province was detached and placed under Ying province, and Xiyang commandery in Ying province was placed under Yu province.',
  },
};

for (const s of data.sentences) {
  const t = T[s.id];
  if (!t) throw new Error(`Missing translation for ${s.id}`);
  s.literal = t.literal;
  s.idiomatic = t.idiomatic;
}

fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Filled', Object.keys(T).length, 'sentences');
