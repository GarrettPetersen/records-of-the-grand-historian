#!/usr/bin/env node
import fs from 'node:fs';

const path = 'translations/current_translation_songshu.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const T = {
  s0101: {
    literal: 'On guisi day General of the Left Guard Prince Baling Wang Xiuruo was made General Who Pacifies the East; newly appointed General Who Pacifies the East Prince Zifang of Xunyang was made General Who Stabilizes the Army; Left Chief Clerk of the Minister Yuan Minsun was made General of the Palace Guard.',
    idiomatic: 'On the guisi day General of the Left Guard Prince Baling Wang Xiuruo was appointed General Who Pacifies the East; the newly appointed General Who Pacifies the East Prince Zifang of Xunyang was made General Who Stabilizes the Army; and Left Chief Clerk of the Minister Yuan Minsun was appointed General of the Palace Guard.',
  },
  s0102: {
    literal: 'On jiawu day martial alert was proclaimed within and without.',
    idiomatic: 'On the jiawu day martial alert was proclaimed throughout the capital and the provinces.',
  },
  s0103: {
    literal: 'Minister Prince Jian\'an Wang Xiuren was made Commander-in-Chief of punitive expeditionary forces and led all armies south in punitive campaign.',
    idiomatic: 'Minister Prince Jian\'an Wang Xiuren was appointed Commander-in-Chief of the punitive expedition and led the combined armies south.',
  },
  s0104: {
    literal: 'Inspector of Qing Liu Zhi was made Inspector of Southern Yanzhou.',
    idiomatic: 'Inspector of Qing Liu Zhi was appointed Inspector of Southern Yanzhou.',
  },
  s0105: {
    literal: 'On bingshen day Chief Clerk of the General Who Conquers the Barbarians Shen Lingsun was made Inspector of Xu, and Interior Administrator of Yiyang Pang Mengjiao was made Inspector of Si.',
    idiomatic: 'On the bingshen day Chief Clerk of the General Who Conquers the Barbarians Shen Lingsun was appointed Inspector of Xu, and Interior Administrator of Yiyang Pang Mengjiao was made Inspector of Si.',
  },
  s0106: {
    literal: 'Lingsun, Mengjiao, and Inspector of Yu Yin Yan, Inspector of Qing Shen Wenxiu, Inspector of Ji Cui Daogu, Acting Inspector of Xiang He Huiwen, Inspector of Guang Yuan Tanyuan, Inspector of Yi Xiao Huikai, and Inspector of Liang Liu Yuanhu all rebelled together.',
    idiomatic: 'Lingsun, Mengjiao, and Inspector of Yu Yin Yan, Inspector of Qing Shen Wenxiu, Inspector of Ji Cui Daogu, Acting Inspector of Xiang He Huiwen, Inspector of Guang Yuan Tanyuan, Inspector of Yi Xiao Huikai, and Inspector of Liang Liu Yuanhu all rose in joint rebellion.',
  },
  s0107: {
    literal: 'Inspector of Yan Yin Xiaozu entered the capital to guard the imperial city, and Xiaozu was still dispatched as vanguard in the southern campaign.',
    idiomatic: 'Inspector of Yan Yin Xiaozu came to the capital to defend the imperial city, and was then sent south as vanguard of the punitive force.',
  },
  s0108: {
    literal: 'On jiachen day Xiaozu was given the additional title General Who Stabilizes the Army.',
    idiomatic: 'On the jiachen day Yin Xiaozu was further promoted to General Who Stabilizes the Army.',
  },
  s0109: {
    literal: 'On bingwu day the imperial carriage personally commanded the Six Armies and went out to encamp at Zhongxing Hall.',
    idiomatic: 'On the bingwu day the Emperor personally took command of the Six Armies and encamped at Zhongxing Hall.',
  },
  s0110: {
    literal: 'On xinhai day General-in-Chief Who Runs Fast and Inspector of Southern Yu Prince Shanyang Wang Xiuyou was changed to Inspector of Yu and commanded all armies in the western punitive campaign.',
    idiomatic: 'On the xinhai day General-in-Chief Who Runs Fast and Inspector of Southern Yu Prince Shanyang Wang Xiuyou was reassigned as Inspector of Yu and placed in command of the western punitive armies.',
  },
  s0111: {
    literal: 'Administrator of Wu Gu Chen, Administrator of Wuxing Wang Tansheng, Administrator of Yixing Liu Yanxi, Administrator of Jinling Yuan Biao, and Administrator of Shanyang Cheng Tianzuo all raised troops in rebellion.',
    idiomatic: 'Administrator of Wu Gu Chen, Administrator of Wuxing Wang Tansheng, Administrator of Yixing Liu Yanxi, Administrator of Jinling Yuan Biao, and Administrator of Shanyang Cheng Tianzuo all took up arms in rebellion.',
  },
  s0112: {
    literal: 'General Who Pacifies the East Prince Baling Wang Xiuruo commanded all armies in the eastern punitive campaign.',
    idiomatic: 'General Who Pacifies the East Prince Baling Wang Xiuruo led the combined armies east in punitive campaign.',
  },
  s0113: {
    literal: 'On renzi day Grand Empress Dowager Chongxian died.',
    idiomatic: 'On the renzi day Grand Empress Dowager Chongxian died.',
  },
  s0114: {
    literal: 'That same day army commanders Ren Nongfu and Liu Huaizhen pacified Yixing.',
    idiomatic: 'That same day army commanders Ren Nongfu and Liu Huaizhen pacified Yixing.',
  },
  s0115: {
    literal: 'Shi Yizong, a commoner of Yongshi county, seized the county in rebellion; Palace General Lu Youzhi suppressed and pacified him.',
    idiomatic: 'Shi Yizong, a commoner of Yongshi county, seized the county in rebellion; Palace General Lu Youzhi put down the revolt.',
  },
  s0116: {
    literal: 'On bingchen day newly appointed Left Grand Master of the Palace with Staff equal to Three Divisions Wang Senglang was made Special Grand Master, Left Grand Master of the Palace remaining unchanged.',
    idiomatic: 'On the bingchen day Wang Senglang, newly appointed Left Grand Master of the Palace with protocol equal to a three-division office, was promoted to Special Grand Master while retaining his post as Left Grand Master of the Palace.',
  },
  s0117: {
    literal: 'Second month, yichou day—Senglang died.',
    idiomatic: 'On the yichou day of the second month Wang Senglang died.',
  },
  s0118: {
    literal: 'Vice Director of the Masters of Writing Wang Jingwen left office on account of his father\'s death.',
    idiomatic: 'Vice Director of the Masters of Writing Wang Jingwen left office to observe mourning for his father.',
  },
  s0119: {
    literal: 'Partial amnesty was granted to the four commanderies of Wu, Wuxing, Yixing, and Jinling.',
    idiomatic: 'A partial amnesty was proclaimed for the four commanderies of Wu, Wuxing, Yixing, and Jinling.',
  },
  s0120: {
    literal: 'Director of the Office of Personnel Cai Xingzong was made Left Vice Director of the Masters of Writing; Administrator of Wuxing Zhang Yong and General of the Right Prince of Qi marched east in punitive campaign and pacified Jinling.',
    idiomatic: 'Director of the Office of Personnel Cai Xingzong was appointed Left Vice Director of the Masters of Writing; Administrator of Wuxing Zhang Yong and General of the Right the Prince of Qi marched east and pacified Jinling.',
  },
  s0121: {
    literal: 'On guiwei day partial amnesty was granted to the five commanderies east of the Zhe River.',
    idiomatic: 'On the guiwei day a partial amnesty was proclaimed for the five commanderies east of the Zhe River.',
  },
  s0122: {
    literal: 'On dinghai day General Who Pacifies the East Prince Baling Wang Xiuruo was promoted to General of the Guard.',
    idiomatic: 'On the dinghai day General Who Pacifies the East Prince Baling Wang Xiuruo was promoted to General of the Guard.',
  },
  s0123: {
    literal: 'General Who Establishes Martial Power Wu Xigong led the armies and defeated the rebels in Wu, Wuxing, and Kuaiji, pacifying the three commanderies; all fellow rebels were executed.',
    idiomatic: 'General Who Establishes Martial Power Wu Xigong led the armies to victory over the rebels in Wu, Wuxing, and Kuaiji, pacifying all three commanderies; every co-conspirator was put to death.',
  },
  s0124: {
    literal: 'General Who Assists the State the Prince of Qi marched north as vanguard in punitive campaign; General Who Assists the State Liu Yao marched west as vanguard in punitive campaign.',
    idiomatic: 'General Who Assists the State the Prince of Qi marched north as vanguard of the punitive force; General Who Assists the State Liu Yao marched west as vanguard.',
  },
  s0125: {
    literal: '[4] The rebel Liu Hu commanded forty thousand men and held Zheqi.',
    idiomatic: '[4] The rebel Liu Hu led a force of forty thousand and occupied Zheqi.',
  },
  s0126: {
    literal: 'Third month, gengyin day—General Who Stabilizes the Army Yin Xiaozu attacked Zheqi and died in battle.',
    idiomatic: 'On the gengyin day of the third month General Who Stabilizes the Army Yin Xiaozu attacked Zheqi and was killed in battle.',
  },
  s0127: {
    literal: 'General Who Assists the State Shen Youzhi was made vanguard of the southern punitive campaign in his stead.',
    idiomatic: 'General Who Assists the State Shen Youzhi was appointed southern vanguard in his place.',
  },
  s0128: {
    literal: '[5] The rebel forces grew stronger by the day; Yuan Yan encamped at Quewei, his linked camps stretching all the way to Nonghu, with more than one hundred thousand men.',
    idiomatic: '[5] The rebel armies swelled daily; Yuan Yan held Quewei, and his linked encampments stretched from there to Nonghu, numbering more than one hundred thousand men.',
  },
  s0129: {
    literal: 'On renchen day newly appointed Grand Tutor of the Heir Apparent Zhang Yong was made Inspector of Qing and Ji.',
    idiomatic: 'On the renchen day Zhang Yong, newly appointed Grand Tutor of the Heir Apparent, was made Inspector of Qing and Ji.',
  },
  s0130: {
    literal: 'On bingshen day General Who Pacifies the North and Inspector of Southern Xu Prince Guiyang Wang Xiufan was made overall commander of the northern punitive campaign.',
    idiomatic: 'On the bingshen day General Who Pacifies the North and Inspector of Southern Xu Prince Guiyang Wang Xiufan was placed in overall command of the northern punitive armies.',
  },
  s0131: {
    literal: 'On dingyou day Director of the Masters of Writing Liu Sikao was made Inspector of Xu.',
    idiomatic: 'On the dingyou day Director of the Masters of Writing Liu Sikao was appointed Inspector of Xu.',
  },
  s0132: {
    literal: 'On wuxu day Prince Zifang of Xunyang was demoted in rank to Marquis of Songzi county.',
    idiomatic: 'On the wuxu day Prince Zifang of Xunyang was stripped of his princely title and demoted to Marquis of Songzi county.',
  },
  s0133: {
    literal: 'On yisi day Bearer of Court Audience Zheng Hei was made Inspector of Si.',
    idiomatic: 'On the yisi day Bearer of Court Audience Zheng Hei was appointed Inspector of Si.',
  },
  s0134: {
    literal: 'On xinhai day General Who Pacifies the North and Inspector of Southern Xu Prince Guiyang Wang Xiufan was also made Inspector of Southern Yan.',
    idiomatic: 'On the xinhai day General Who Pacifies the North and Inspector of Southern Xu Prince Guiyang Wang Xiufan was also given the post of Inspector of Southern Yan.',
  },
  s0135: {
    literal: 'On renzi day new coinage was abolished; only old coin was to be used.',
    idiomatic: 'On the renzi day new coinage was abolished and only old coin permitted.',
  },
  s0136: {
    literal: 'On guichou day prisoners in Yang and Southern Xu were pardoned; all fugitives were exempt from inquiry.',
    idiomatic: 'On the guichou day prisoners in Yang and Southern Xu were pardoned, and all fugitives were granted immunity from prosecution.',
  },
  s0137: {
    literal: 'Summer, fourth month, renwu day—Attendant Cadet at the Palace Library Ming Senghao was made Inspector of Qing.',
    idiomatic: 'On the renwu day of the fourth month of summer Attendant Cadet at the Palace Library Ming Senghao was appointed Inspector of Qing.',
  },
  s0138: {
    literal: 'Fifth month, renchen day—General Who Assists the State Shen Youzhi was made Inspector of Yong.',
    idiomatic: 'On the renchen day of the fifth month General Who Assists the State Shen Youzhi was appointed Inspector of Yong.',
  },
  s0139: {
    literal: 'On dingyou day partial amnesty was granted to Yu province.',
    idiomatic: 'On the dingyou day a partial amnesty was proclaimed for Yu province.',
  },
  s0140: {
    literal: 'On dingwei day newly appointed Vice Director of the Masters of Writing Wang Jingwen was made General of the Center Army; Inspector of Qing and Ji Zhang Yong was made General Who Stabilizes the Army.',
    idiomatic: 'On the dingwei day Wang Jingwen, newly appointed Vice Director of the Masters of Writing, was made General of the Center Army, and Inspector of Qing and Ji Zhang Yong was promoted to General Who Stabilizes the Army.',
  },
  s0141: {
    literal: 'On gengxu day General Who Calms the North Liu Chenmin was made Inspector of Ji.',
    idiomatic: 'On the gengxu day General Who Calms the North Liu Chenmin was appointed Inspector of Ji.',
  },
  s0142: {
    literal: 'On jiayin day Grand Empress Dowager Chongxian was buried at Xiuning Mausoleum.',
    idiomatic: 'On the jiayin day Grand Empress Dowager Chongxian was interred at Xiuning Mausoleum.',
  },
  s0143: {
    literal: '[6] General Who Conquers the Enemy and Inspector of Yi Xiao Huikai was promoted to General Who Pacifies the West.',
    idiomatic: '[6] General Who Conquers the Enemy and Inspector of Yi Xiao Huikai was promoted to General Who Pacifies the West.',
  },
  s0144: {
    literal: 'Sixth month, xinyou day—General Who Stabilizes the Army Zhang Yong was also made Inspector of Xu.',
    idiomatic: 'On the xinyou day of the sixth month General Who Stabilizes the Army Zhang Yong was also appointed Inspector of Xu.',
  },
  s0145: {
    literal: 'Rain flooded the capital; on dingmao day palace generals were dispatched on inspection tours to grant relief.',
    idiomatic: 'Floods inundated the capital; on the dingmao day palace generals were sent out on inspection tours to distribute relief.',
  },
  s0146: {
    literal: 'General of the Left Army Yuan Gongzu was made Inspector of Liang and Southern Qin.',
    idiomatic: 'General of the Left Army Yuan Gongzu was appointed Inspector of Liang and Southern Qin.',
  },
  s0147: {
    literal: 'Autumn, seventh month, jichou day—General Who Pacifies the North and Inspector of Southern Xu and Yan Prince Guiyang Wang Xiufan was promoted to General Who Conquers the North.',
    idiomatic: 'On the jichou day of the seventh month of autumn General Who Pacifies the North and Inspector of Southern Xu and Yan Prince Guiyang Wang Xiufan was promoted to General Who Conquers the North.',
  },
  s0148: {
    literal: 'On xinmao day General Who Stabilizes the Army and Inspector of Xu Zhang Yong was changed to Inspector of Southern Yan.',
    idiomatic: 'On the xinmao day General Who Stabilizes the Army and Inspector of Xu Zhang Yong was reassigned as Inspector of Southern Yan.',
  },
  s0149: {
    literal: 'On dingyou day Administrator of Qiuchi Yang Sengsi was made Inspector of Northern Qin and Prince of Wudu.',
    idiomatic: 'On the dingyou day Administrator of Qiuchi Yang Sengsi was appointed Inspector of Northern Qin and enfeoffed as Prince of Wudu.',
  },
  s0150: {
    literal: 'On renyin day the commoner Shi Langzhi was made Inspector of Northern Yu.',
    idiomatic: 'On the renyin day the commoner Shi Langzhi was appointed Inspector of Northern Yu.',
  },
  s0151: {
    literal: 'On yisi day General of Flying Cavalry Liu Daofu pacified Shanyang.',
    idiomatic: 'On the yisi day General of Flying Cavalry Liu Daofu pacified Shanyang.',
  },
  s0152: {
    literal: 'On xinhai day Volunteer Army Commander Zheng Shuju was again made Inspector of Northern Yu; General Who Stabilizes the Army and Inspector of Southern Yan Zhang Yong again held the post of Inspector of Xu.',
    idiomatic: 'On the xinhai day Volunteer Army Commander Zheng Shuju was again appointed Inspector of Northern Yu; General Who Stabilizes the Army and Inspector of Southern Yan Zhang Yong resumed the post of Inspector of Xu.',
  },
  s0153: {
    literal: 'On jiayin day Inspector of Ji Cui Daogu was again made Inspector of Xu.',
    idiomatic: 'On the jiayin day Inspector of Ji Cui Daogu was again appointed Inspector of Xu.',
  },
  s0154: {
    literal: 'Eighth month, jimao day—Minister Prince Jian\'an Wang Xiuren led the armies to a great victory over the rebels, beheaded the false Vice Director of the Masters of Writing Yuan Yan, and advanced to punish Jiang, Ying, Jing, Yong, and Xiang—pacifying all five provinces.',
    idiomatic: 'On the jimao day of the eighth month Minister Prince Jian\'an Wang Xiuren led the armies to a crushing victory over the rebels, beheaded the rebel Vice Director of the Masters of Writing Yuan Yan, and advanced to subdue Jiang, Ying, Jing, Yong, and Xiang, pacifying all five provinces.',
  },
  s0155: {
    literal: 'Prince Zixun of Jin\'an, Prince Zisui of Anlu, Prince Zixu of Linhai, and Prince Ziyuan of Shaoling were all granted death; all fellow conspirators were executed.',
    idiomatic: 'Prince Zixun of Jin\'an, Prince Zisui of Anlu, Prince Zixu of Linhai, and Prince Ziyuan of Shaoling were all ordered to take their own lives; every co-conspirator was put to death.',
  },
  s0156: {
    literal: 'Generals and commanders received enfeoffments and rewards in varying measure.',
    idiomatic: 'The generals and commanders received enfeoffments and rewards according to their merit.',
  },
  s0157: {
    literal: 'On jiashen day General Who Protects the Army Prince Ziren of Yongjia was made General Who Pacifies the South and Inspector of Xiang.',
    idiomatic: 'On the jiashen day General Who Protects the Army Prince Ziren of Yongjia was appointed General Who Pacifies the South and Inspector of Xiang.',
  },
  s0158: {
    literal: 'Ninth month, yiyou day—partial amnesty was granted to Jiang, Ying, Jing, Yong, and Xiang provinces;',
    idiomatic: 'On the yiyou day of the ninth month a partial amnesty was proclaimed for Jiang, Ying, Jing, Yong, and Xiang provinces;',
  },
  s0159: {
    literal: 'local administrators were not permitted to leave their posts.',
    idiomatic: 'local administrators were forbidden to leave their posts.',
  },
  s0160: {
    literal: 'On renchen day General-in-Chief Who Runs Fast and Inspector of Yu Prince Shanyang Wang Xiuyou was changed to Inspector of Jing.',
    idiomatic: 'On the renchen day General-in-Chief Who Runs Fast and Inspector of Yu Prince Shanyang Wang Xiuyou was reassigned as Inspector of Jing.',
  },
  s0161: {
    literal: 'From Yu province Southern Yu province was established.',
    idiomatic: 'Southern Yu province was carved out of Yu province.',
  },
  s0162: {
    literal: 'On guisi day the Six Armies stood down from martial alert.',
    idiomatic: 'On the guisi day the Six Armies were released from martial alert.',
  },
  s0163: {
    literal: 'A general amnesty was proclaimed throughout the empire; the people were granted one step in noble rank.',
    idiomatic: 'A general amnesty was proclaimed throughout the empire, and the common people were granted one step in noble rank.',
  },
  s0164: {
    literal: 'On jiawu day General of the Center Army Wang Jingwen was made General Who Pacifies the South and Inspector of Jiang.',
    idiomatic: 'On the jiawu day General of the Center Army Wang Jingwen was appointed General Who Pacifies the South and Inspector of Jiang.',
  },
  s0165: {
    literal: 'On wuxu day General of Chariots and Cavalry and Inspector of Jiang Wang Xuanmo was made Left Grand Master of the Palace with Staff equal to Three Divisions and General Who Protects the Army.',
    idiomatic: 'On the wuxu day General of Chariots and Cavalry and Inspector of Jiang Wang Xuanmo was appointed Left Grand Master of the Palace with protocol equal to a three-division office and General Who Protects the Army.',
  },
  s0166: {
    literal: 'On gengzi day Heir Apparent of Prince Jian\'an Wang Xiuren, Boyong, was made Inspector of Yu.',
    idiomatic: 'On the gengzi day Boyong, heir of Prince Jian\'an Wang Xiuren, was appointed Inspector of Yu.',
  },
  s0167: {
    literal: '[7] On xinchou day General of the Guard Prince Baling Wang Xiuruo took his existing title and became Inspector of Yong.',
    idiomatic: '[7] On the xinchou day General of the Guard Prince Baling Wang Xiuruo retained his existing rank and was appointed Inspector of Yong.',
  },
  s0168: {
    literal: 'Inspector of Yong Shen Youzhi was made Inspector of Ying.',
    idiomatic: 'Inspector of Yong Shen Youzhi was reassigned as Inspector of Ying.',
  },
  s0169: {
    literal: 'On gengxu day Leader of the Left Guard of the Heir Apparent Prince Jianping Wang Jingsu was made Inspector of Southern Yan.',
    idiomatic: 'On the gengxu day Leader of the Left Guard of the Heir Apparent Prince Jianping Wang Jingsu was appointed Inspector of Southern Yan.',
  },
  s0170: {
    literal: 'Tenth month, yimao day—Prince Ziren of Yongjia, Prince Zizhen of Shi\'an, Prince Zimeng of Huainan, Prince Zichan of Nanping, Prince Ziyu of Luling, and Marquis Zifang of Songzi were all granted death.',
    idiomatic: 'On the yimao day of the tenth month Prince Ziren of Yongjia, Prince Zizhen of Shi\'an, Prince Zimeng of Huainan, Prince Zichan of Nanping, Prince Ziyu of Luling, and Marquis Zifang of Songzi were all ordered to take their own lives.',
  },
  s0171: {
    literal: 'On dingmao day Inspector of Ying Shen Youzhi was made General of the Palace Guard and marched north in punitive campaign together with Zhang Yong.',
    idiomatic: 'On the dingmao day Inspector of Ying Shen Youzhi was appointed General of the Palace Guard and marched north with Zhang Yong on punitive campaign.',
  },
  s0172: {
    literal: 'On gengwu day Administrator of Wu Gu Qinzhi was made Inspector of Xiang.',
    idiomatic: 'On the gengwu day Administrator of Wu Gu Qinzhi was appointed Inspector of Xiang.',
  },
  s0173: {
    literal: '[8] On wuyin day the Prince Yu was established as Crown Prince.',
    idiomatic: '[8] On the wuyin day Prince Yu was installed as Crown Prince.',
  },
  s0174: {
    literal: 'Partial amnesty was granted to Yang and Southern Xu.',
    idiomatic: 'A partial amnesty was proclaimed for Yang and Southern Xu.',
  },
  s0175: {
    literal: '[9] General Who Assists the State Liu Yao was made Inspector of Guang; General of the Left Army Zhang Shi was made Inspector of Yu.',
    idiomatic: '[9] General Who Assists the State Liu Yao was appointed Inspector of Guang, and General of the Left Army Zhang Shi was made Inspector of Yu.',
  },
  s0176: {
    literal: 'Eleventh month, jiashen day—Administrator of Ancheng Liu Xi was made Inspector of Ying.',
    idiomatic: 'On the jiashen day of the eleventh month Administrator of Ancheng Liu Xi was appointed Inspector of Ying.',
  },
  s0177: {
    literal: 'On renchen day an edict said: "Governance should honor simplicity and ease; transformation should hasten away from elaborate excess—this bears on rise and fall across the ages, and the traces are clear.',
    idiomatic: 'On the renchen day an edict said: "Good government honors simplicity and ease; true transformation must drive out elaborate excess—the rise and fall of dynasties turns on this, and the lesson is plain.',
  },
  s0178: {
    literal: 'I have rescued this fallen fortune and inherited this hour of utmost peril; upon exhaustion and depletion have been piled the burdens of campaigning, yet my understanding falls short of the former kings and my tasks outmatch those of earlier ages.',
    idiomatic: 'I have inherited a realm in collapse and an hour of utmost peril; upon exhaustion and depletion have been piled the burdens of war, yet my understanding falls short of the former kings and my tasks outmatch those of earlier ages.',
  },
  s0179: {
    literal: 'Thus old levies have grown ever more numerous and expenditures ever broader; reviewing the myriad affairs day and night, I constantly think of broad reform.',
    idiomatic: 'Old levies have grown ever heavier and expenditures ever broader; reviewing the myriad affairs of state, I constantly seek broad reform.',
  },
  s0180: {
    literal: 'I intend to ease corvée and lighten assessments, putting love of the people first; the responsible offices should examine matters in detail and add leniency and grace, establishing new categories and grades.',
    idiomatic: 'I intend to ease corvée labor and lighten tax assessments, putting the welfare of the people first; let the responsible offices examine every measure in detail, grant leniency and grace, and establish new categories of obligation.',
  },
  s0181: {
    literal: 'Local products and official tribute should each follow local suitability; what is offered and what is submitted as tribute [10] should respectfully follow the seasons.',
    idiomatic: 'Local products and official tribute should each suit local conditions; all offerings and tribute submissions [10] must respectfully follow the seasons.',
  },
  s0182: {
    literal: 'All harmful customs that obstruct the people, pursuits of the secondary that betray the root, carved ornament and wasteful splendor, strange vessels and exotic skills—all shall be strictly curtailed, striving to return to what is essential and real.',
    idiomatic: 'Every harmful custom that obstructs the people, every pursuit of profit that abandons the essential, every carved ornament and wasteful splendor, every strange vessel and exotic skill—all shall be strictly curtailed, until affairs return to what is essential and real.',
  },
  s0183: {
    literal: 'The various offices of the Left and Right Imperial Workshops and Palace Storehouse, in supplying and manufacturing for the court, should all preserve thrift.',
    idiomatic: 'The Left and Right Imperial Workshops, the Palace Storehouse, and all supplying offices shall preserve thrift in everything manufactured for the court.',
  },
  s0184: {
    literal: 'Thus may the pure wind of highest teaching faintly follow the remotest antiquity; wealth may be heaped up and yielding encouraged, and the vulgar ways of the age somewhat restrained.',
    idiomatic: 'Thus may the pure wind of highest teaching faintly echo remotest antiquity; wealth may be gathered and mutual yielding encouraged, and the vulgar ways of the age somewhat restrained.',
  },
  s0185: {
    literal: '" Another edict said: "To grasp the moment and inquire into governance [11] is the root of establishing teaching;',
    idiomatic: '" Another edict said: "To grasp the moment and inquire into governance [11] is the root of establishing teaching;',
  },
  s0186: {
    literal: 'to raise the worthy and invite the reclusive is the foundation of broadening transformation.',
    idiomatic: 'to raise the worthy and invite the reclusive is the foundation of spreading transformation.',
  },
  s0187: {
    literal: 'Thus when one shouldered the cauldron and offered counsel, the Yin dynasty found peace;',
    idiomatic: 'When Yi Yin shouldered the cauldron and offered counsel, the Yin dynasty found peace;',
  },
  s0188: {
    literal: 'when one cast aside the fishing line and became minister, the Zhou fortune was set right.',
    idiomatic: 'when Jiang Ziya cast aside his fishing line and became minister, the Zhou fortune was set right.',
  },
  s0189: {
    literal: 'I have just inherited the great enterprise; instruction and the Way are not yet spread abroad. Though I sit sideways awaiting loyal counsel and stand in dream awaiting men from the cliffs, yet no fine plan is offered and no extraordinary man is heard of—I forever take antiquity as mirror and never forget my sleepless nights.',
    idiomatic: 'I have just inherited the great enterprise, and instruction has not yet spread throughout the realm. Though I sit sideways awaiting loyal counsel and stand in dream awaiting sages from the cliffs, no fine plan is offered and no extraordinary man comes forward—I take antiquity as my mirror and never forget my sleepless nights.',
  },
  s0190: {
    literal: 'Now the frontier regions are pacified and the spreading of transformation is just beginning; repeatedly I harbor thoughts of good governance and truly look to be admonished where I fall short.',
    idiomatic: 'Now the frontier regions are pacified and the work of transformation is just beginning; I constantly seek good governance and truly welcome admonition wherever I fall short.',
  },
  s0191: {
    literal: 'Princes, dukes, ministers, and chief officials, and all ranks of officials—whoever has excellent counsel offered directly, who can reform customs and aid the age, let all submit memorials on concrete matters without concealment.',
    idiomatic: 'Princes, dukes, ministers, and officials of every rank—whoever has excellent counsel to offer, whoever can reform customs and aid the age, let all submit concrete memorials without concealment.',
  },
  s0192: {
    literal: 'As for those who dwell in chaste seclusion in forest and marsh, who maintain pure integrity in garden and field, who are broadly versed in antiquity and the present and earnestly honor filial piety and yielding—wherever they hold office in the four directions, let written orders clearly seek and raise them, report each case at once, and confer reward and rank as appropriate.',
    idiomatic: 'As for those who dwell in chaste seclusion in forest and marsh, who maintain pure integrity in garden and field, who are broadly versed in antiquity and the present and earnestly honor filial piety and yielding—wherever they hold office in the four directions, let written orders seek them out and raise them up, report each case at once, and confer reward and rank as appropriate.',
  },
  s0193: {
    literal: '" Prince Jianping Wang Jingsu\'s son Yanian was made Prince of Xin\'an.',
    idiomatic: '" Yanian, son of Prince Jianping Wang Jingsu, was enfeoffed as Prince of Xin\'an.',
  },
  s0194: {
    literal: 'Newly appointed Left Grand Master of the Palace with Staff equal to Three Divisions Wang Xuanmo was made General of Chariots and Cavalry and Inspector of Southern Yu.',
    idiomatic: 'Wang Xuanmo, newly appointed Left Grand Master of the Palace with protocol equal to a three-division office, was made General of Chariots and Cavalry and Inspector of Southern Yu.',
  },
  s0195: {
    literal: 'On bingshen day an order was issued that those who had been scattered by famine in the eastern regions should each return to their native places, and the general levy was remitted for two years.',
    idiomatic: 'On the bingshen day an order was issued that those scattered by famine in the eastern regions should each return home, and the general levy was remitted for two years.',
  },
  s0196: {
    literal: 'Twelfth month, jiwei day—Director of the Gold Bureau Liu Shanming was made Inspector of Ji.',
    idiomatic: 'On the jiwei day of the twelfth month Director of the Gold Bureau Liu Shanming was appointed Inspector of Ji.',
  },
  s0197: {
    literal: 'On yichou day an edict said: "Recently many princely domains rose in rebellion and many were stained by charges of treason.',
    idiomatic: 'On the yichou day an edict said: "Recently many princely domains rose in rebellion, and many were stained by charges of treason.',
  },
  s0198: {
    literal: 'Some were truly loyal to the dynasty but acted under compulsion; to treat them all alike in proof and imprisonment is truly a cause for regret.',
    idiomatic: 'Some were truly loyal to the dynasty but acted under compulsion; to treat them all alike in proof and imprisonment is truly cause for regret.',
  },
  s0199: {
    literal: 'Heaven\'s Way honors benevolence; virtue and punishment are employed together—when thunderclap comes in season, rain must follow and release.',
    idiomatic: 'Heaven\'s Way honors benevolence; virtue and punishment are employed together—when the thunderclap comes in season, the rain must follow and release.',
  },
  s0200: {
    literal: 'Reflecting in quiet, I think to spread wind and grace; all who should suffer prohibition and reduction shall receive pardon and absolution.',
    idiomatic: 'Reflecting in quiet, I seek to spread grace throughout the realm; all who should suffer prohibition and reduction shall receive pardon and absolution.',
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
