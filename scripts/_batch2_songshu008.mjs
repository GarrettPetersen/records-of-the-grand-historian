#!/usr/bin/env node
import fs from 'node:fs';

const file = 'translations/current_translation_songshu.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const T = {
  s0101: {
    literal: "On guisi, General of the Left Guard Prince Xiuofan of Baling was made General Who Guards the East; newly appointed General Who Pacifies the East Prince Zifang of Xunyang was made General Who Comforts the Army; the Chancellor's Left Chief Clerk Yuan Minsun was made General of the Garrison.",
    idiomatic: "On the guisi day General of the Left Guard Prince Xiuofan of Baling was appointed General Who Guards the East; newly appointed General Who Pacifies the East Prince Zifang of Xunyang was made General Who Comforts the Army; and the Chancellor's Left Chief Clerk Yuan Minsun was appointed General of the Garrison.",
  },
  s0102: {
    literal: "On jiawu, armament was proclaimed throughout the court and the realm.",
    idiomatic: "On the jiawu day martial law was proclaimed inside and outside the capital.",
  },
  s0103: {
    literal: "Prince Xiuren of Jian'an as Chancellor was made Commander-in-Chief of Pacification and Punitive Forces, leading all armies south to attack.",
    idiomatic: "Prince Xiuren of Jian'an, serving as Chancellor, was appointed Commander-in-Chief of Pacification and Punitive Forces and led all armies south to attack.",
  },
  s0104: {
    literal: "Inspector of Qing Liu Zhi was made Inspector of Southern Yanzhou.",
    idiomatic: "Inspector of Qing Liu Zhi was appointed Inspector of Southern Yanzhou.",
  },
  s0105: {
    literal: "On bingshen, Chief Clerk of the General Who Conquers the Barbarians Shen Lingsun was made Inspector of Xu; Interior Administrator of Yiyang Pang Mengjiao was made Inspector of Si.",
    idiomatic: "On the bingshen day Chief Clerk of the General Who Conquers the Barbarians Shen Lingsun was appointed Inspector of Xu, and Interior Administrator of Yiyang Pang Mengjiao was appointed Inspector of Si.",
  },
  s0106: {
    literal: "Lingsun, Mengjiao, and Inspector of Yu Yin Yan, Inspector of Qing Shen Wenxiu, Inspector of Ji Cui Daogu, Acting Inspector of Xiang He Huiwen, Inspector of Guang Yuan Tanyuan, Inspector of Yi Xiao Huikai, and Inspector of Liang Liu Yuanhu all likewise rebelled.",
    idiomatic: "Lingsun, Mengjiao, and Inspectors Yin Yan of Yu, Shen Wenxiu of Qing, Cui Daogu of Ji, Acting Inspector He Huiwen of Xiang, Yuan Tanyuan of Guang, Xiao Huikai of Yi, and Liu Yuanhu of Liang all joined the rebellion.",
  },
  s0107: {
    literal: "Inspector of Yan Yin Xiaozu entered to guard the capital; he was then sent as vanguard south to attack.",
    idiomatic: "Inspector of Yan Yin Xiaozu entered the capital to defend it and was then dispatched as vanguard on the southern campaign.",
  },
  s0108: {
    literal: "On jiachen, Xiaozu was given the additional rank General Who Comforts the Army.",
    idiomatic: "On the jiachen day Xiaozu was also made General Who Comforts the Army.",
  },
  s0109: {
    literal: "On bingwu, the imperial carriage in person commanded the Six Armies and went out to halt at the Hall of Central Revival.",
    idiomatic: "On the bingwu day the Emperor personally took command of the Six Armies and advanced to encamp at the Hall of Central Revival.",
  },
  s0110: {
    literal: "On xinhai, General of Chariots and Cavalry and Inspector of Southern Yuzhou Prince Xiuyou of Shanyang was changed to Inspector of Yu, commanding all armies west to attack.",
    idiomatic: "On the xinhai day General of Chariots and Cavalry and Inspector of Southern Yuzhou Prince Xiuyou of Shanyang was reassigned as Inspector of Yu and placed in command of all armies on the western campaign.",
  },
  s0111: {
    literal: "Administrator of Wu Gu Chen, Administrator of Wuxing Wang Tansheng, Administrator of Yixing Liu Yanxi, Administrator of Jinling Yuan Biao, and Administrator of Shanyang Cheng Tianzuo all raised troops in rebellion.",
    idiomatic: "Administrator of Wu Gu Chen, Administrator of Wuxing Wang Tansheng, Administrator of Yixing Liu Yanxi, Administrator of Jinling Yuan Biao, and Administrator of Shanyang Cheng Tianzuo all rose in rebellion.",
  },
  s0112: {
    literal: "General Who Guards the East Prince Xiuofan of Baling commanded all armies east to attack.",
    idiomatic: "General Who Guards the East Prince Xiuofan of Baling took command of all armies on the eastern campaign.",
  },
  s0113: {
    literal: "On renzi, Grand Empress Dowager Chongxian died.",
    idiomatic: "On the renzi day Grand Empress Dowager Chongxian died.",
  },
  s0114: {
    literal: "That same day army commanders Ren Nongfu and Liu Huaizhen pacified Yixing.",
    idiomatic: "That same day the army commanders Ren Nongfu and Liu Huaizhen brought Yixing back under control.",
  },
  s0115: {
    literal: "The commoner Shi Yizong of Yongshi county seized the county in rebellion; Palace General Lu Youzhi attacked and pacified him.",
    idiomatic: "A commoner of Yongshi county named Shi Yizong seized the county in rebellion; Palace General Lu Youzhi attacked and put down the rising.",
  },
  s0116: {
    literal: "On bingchen, newly appointed Left Grand Master of the Palace with Staff equal to Three Divisions Wang Senglang was made Special Grand Master; Left Grand Master of the Palace remained unchanged.",
    idiomatic: "On the bingchen day newly appointed Left Grand Master of the Palace with protocol equal to a three-division office Wang Senglang was made Special Grand Master while retaining his post as Left Grand Master of the Palace.",
  },
  s0117: {
    literal: "Second month, yichou day, Senglang died.",
    idiomatic: "In the second month, on the yichou day, Senglang died.",
  },
  s0118: {
    literal: "Vice Director of the Masters of Writing Wang Jingwen left office on his father's mourning.",
    idiomatic: "Vice Director of the Masters of Writing Wang Jingwen left office to observe mourning for his father.",
  },
  s0119: {
    literal: "A partial amnesty was granted to the four commanderies Wu, Wuxing, Yixing, and Jinling.",
    idiomatic: "A partial amnesty was granted to the four commanderies of Wu, Wuxing, Yixing, and Jinling.",
  },
  s0120: {
    literal: "Minister of Personnel Cai Xingzong was made Left Vice Director of the Masters of Writing; Administrator of Wuxing Zhang Yong and General of the Right Guard Prince of Qi marched east to attack and pacified Jinling.",
    idiomatic: "Minister of Personnel Cai Xingzong was appointed Left Vice Director of the Masters of Writing; Administrator of Wuxing Zhang Yong and General of the Right Guard Prince of Qi marched east to attack and pacified Jinling.",
  },
  s0121: {
    literal: "On guiwei, a partial amnesty was granted to the five commanderies east of the Zhe River.",
    idiomatic: "On the guiwei day a partial amnesty was granted to the five commanderies east of the Zhe River.",
  },
  s0122: {
    literal: "On dinghai, General Who Guards the East Prince Xiuofan of Baling was advanced in rank to General of the Guard.",
    idiomatic: "On the dinghai day General Who Guards the East Prince Xiuofan of Baling was promoted to General of the Guard.",
  },
  s0123: {
    literal: "General Who Establishes Might Wu Xi at the head of the armies broke the rebels in Wu, Wuxing, and Kuaiji, pacified the three commanderies, and all fellow rebels were executed.",
    idiomatic: "General Who Establishes Might Wu Xi led the armies to defeat the rebels in Wu, Wuxing, and Kuaiji, pacified the three commanderies, and all who had joined the rebellion were put to death.",
  },
  s0124: {
    literal: "General Who Assists the State Prince of Qi as vanguard marched north to attack; General Who Assists the State Liu Yan as vanguard marched west to attack.",
    idiomatic: "General Who Assists the State Prince of Qi advanced as vanguard on the northern campaign; General Who Assists the State Liu Yan advanced as vanguard on the western campaign.",
  },
  s0125: {
    literal: "[4] The rebel Liu Hu led a host of forty thousand and held Zheqi.",
    idiomatic: "[4] The rebel Liu Hu led forty thousand men and occupied Zheqi.",
  },
  s0126: {
    literal: "Third month, gengyin day, General Who Comforts the Army Yin Xiaozu attacked Zheqi and died in battle.",
    idiomatic: "In the third month, on the gengyin day, General Who Comforts the Army Yin Xiaozu attacked Zheqi and was killed in battle.",
  },
  s0127: {
    literal: "General Who Assists the State Shen Youzhi was made vanguard of the southern campaign in his place.",
    idiomatic: "General Who Assists the State Shen Youzhi was appointed vanguard of the southern campaign in his place.",
  },
  s0128: {
    literal: "[5] The rebel host gradually grew stronger; Yuan Yan encamped at Quewei, and linked camps stretched all the way to Nonghu—more than a hundred thousand men.",
    idiomatic: "[5] The rebel forces steadily grew stronger; Yuan Yan encamped at Quewei, and his linked camps stretched from there to Nonghu, numbering more than a hundred thousand men.",
  },
  s0129: {
    literal: "On renchen, newly appointed Grand Mentor of the Heir Apparent Zhang Yong was made Inspector of Qing and Ji.",
    idiomatic: "On the renchen day newly appointed Grand Mentor of the Heir Apparent Zhang Yong was appointed Inspector of Qing and Ji.",
  },
  s0130: {
    literal: "On bingshen, General Who Pacifies the North and Inspector of Southern Xuzhou Prince Xiufan of Guiyang was made overall commander of the northern punitive forces.",
    idiomatic: "On the bingshen day General Who Pacifies the North and Inspector of Southern Xuzhou Prince Xiufan of Guiyang was appointed overall commander of the northern punitive campaign.",
  },
  s0131: {
    literal: "On dingyou, Director of the Masters of Writing Liu Sikao was made Inspector of Xu.",
    idiomatic: "On the dingyou day Director of the Masters of Writing Liu Sikao was appointed Inspector of Xu.",
  },
  s0132: {
    literal: "On wuxu, the enfeoffment of Prince Zifang of Xunyang was degraded to Marquis of Songzi county.",
    idiomatic: "On the wuxu day Prince Zifang of Xunyang was degraded in rank to Marquis of Songzi county.",
  },
  s0133: {
    literal: "On yisi, Court Gentleman-for-the-Duration Zheng Hei was made Inspector of Si.",
    idiomatic: "On the yisi day Court Gentleman-for-the-Duration Zheng Hei was appointed Inspector of Si.",
  },
  s0134: {
    literal: "On xinhai, General Who Pacifies the North and Inspector of Southern Xuzhou Prince Xiufan of Guiyang also held Inspector of Southern Yanzhou.",
    idiomatic: "On the xinhai day General Who Pacifies the North and Inspector of Southern Xuzhou Prince Xiufan of Guiyang was also made Inspector of Southern Yanzhou.",
  },
  s0135: {
    literal: "On renzi, new coin was abolished; only old coin was to be used.",
    idiomatic: "On the renzi day new coin was abolished and only old coin was permitted in circulation.",
  },
  s0136: {
    literal: "On guichou, prisoners in Yang and Southern Xu were pardoned; all who had fled were questioned about nothing.",
    idiomatic: "On the guichou day prisoners in Yang and Southern Xu were pardoned, and all fugitives were granted full amnesty without inquiry.",
  },
  s0137: {
    literal: "Summer, fourth month, renwu day, Gentleman Cadet of Scattered Cavalry Ming Senghao was made Inspector of Qing.",
    idiomatic: "In summer, the fourth month, on the renwu day Gentleman Cadet of Scattered Cavalry Ming Senghao was appointed Inspector of Qing.",
  },
  s0138: {
    literal: "Fifth month, renchen day, General Who Assists the State Shen Youzhi was made Inspector of Yong.",
    idiomatic: "In the fifth month, on the renchen day General Who Assists the State Shen Youzhi was appointed Inspector of Yong.",
  },
  s0139: {
    literal: "On dingyou, a partial amnesty was granted to Yu.",
    idiomatic: "On the dingyou day a partial amnesty was granted to Yu province.",
  },
  s0140: {
    literal: "On dingwei, newly appointed Vice Director of the Masters of Writing Wang Jingwen was made General of the Center Army; Inspector of Qing and Ji Zhang Yong was made General Who Guards the Army.",
    idiomatic: "On the dingwei day newly appointed Vice Director of the Masters of Writing Wang Jingwen was made General of the Center Army, and Inspector of Qing and Ji Zhang Yong was appointed General Who Guards the Army.",
  },
  s0141: {
    literal: "On gengxu, General Who Pacifies the North Liu Chengmin was made Inspector of Ji.",
    idiomatic: "On the gengxu day General Who Pacifies the North Liu Chengmin was appointed Inspector of Ji.",
  },
  s0142: {
    literal: "On jiayin, Grand Empress Dowager Chongxian was buried at Xiuning Mausoleum.",
    idiomatic: "On the jiayin day Grand Empress Dowager Chongxian was buried at Xiuning Mausoleum.",
  },
  s0143: {
    literal: "[6] General Who Conquers the Champions and Inspector of Yi Xiao Huikai was advanced in rank to General Who Pacifies the West.",
    idiomatic: "[6] General Who Conquers the Champions and Inspector of Yi Xiao Huikai was promoted to General Who Pacifies the West.",
  },
  s0144: {
    literal: "Sixth month, xinyou day, General Who Guards the Army Zhang Yong also held Inspector of Xu.",
    idiomatic: "In the sixth month, on the xinyou day General Who Guards the Army Zhang Yong was also made Inspector of Xu.",
  },
  s0145: {
    literal: "Rain fell in the capital; on dingmao Palace Generals were dispatched to inspect and grant relief.",
    idiomatic: "Rain fell heavily in the capital; on the dingmao day palace generals were sent out to inspect the damage and grant relief.",
  },
  s0146: {
    literal: "General of the Left Army Yuan Gongzu was made Inspector of Liang and Southern Qin.",
    idiomatic: "General of the Left Army Yuan Gongzu was appointed Inspector of Liang and Southern Qin.",
  },
  s0147: {
    literal: "Seventh month, jichou day, General Who Pacifies the North and Inspector of Southern Xu and Yan Prince Xiufan of Guiyang was advanced in rank to General Who Campaigns North.",
    idiomatic: "In the seventh month, on the jichou day General Who Pacifies the North and Inspector of Southern Xu and Yan Prince Xiufan of Guiyang was promoted to General Who Campaigns North.",
  },
  s0148: {
    literal: "On xinmao, General Who Guards the Army and Inspector of Xu Zhang Yong was changed to Inspector of Southern Yanzhou.",
    idiomatic: "On the xinmao day General Who Guards the Army and Inspector of Xu Zhang Yong was reassigned as Inspector of Southern Yanzhou.",
  },
  s0149: {
    literal: "On dingyou, Defender of Chouchi Yang Sengsi was made Inspector of Northern Qin and Prince of Wudu.",
    idiomatic: "On the dingyou day Defender of Chouchi Yang Sengsi was appointed Inspector of Northern Qin and enfeoffed as Prince of Wudu.",
  },
  s0150: {
    literal: "On renyin, the commoner Shi Langzhi was made Inspector of Northern Yu.",
    idiomatic: "On the renyin day the commoner Shi Langzhi was appointed Inspector of Northern Yu.",
  },
  s0151: {
    literal: "On yisi, General of the Flying Dragons Liu Daofu pacified Shanyang.",
    idiomatic: "On the yisi day General of the Flying Dragons Liu Daofu pacified Shanyang.",
  },
  s0152: {
    literal: "On xinhai, Volunteer Army Commander Zheng Shuju was again made Inspector of Northern Yu; General Who Guards the Army and Inspector of Southern Yanzhou Zhang Yong again held Inspector of Xu.",
    idiomatic: "On the xinhai day Volunteer Army Commander Zheng Shuju was again appointed Inspector of Northern Yu, and General Who Guards the Army and Inspector of Southern Yanzhou Zhang Yong was again made Inspector of Xu.",
  },
  s0153: {
    literal: "On jiayin, Inspector of Ji Cui Daogu was again made Inspector of Xu.",
    idiomatic: "On the jiayin day Inspector of Ji Cui Daogu was again appointed Inspector of Xu.",
  },
  s0154: {
    literal: "Eighth month, jimao day, Chancellor Prince Xiuren of Jian'an led the armies to a great defeat of the rebels, beheaded the false Vice Director of the Masters of Writing Yuan Yan, and advanced to attack the five provinces Jiang, Ying, Jing, Yong, and Xiang, pacifying them.",
    idiomatic: "In the eighth month, on the jimao day Chancellor Prince Xiuren of Jian'an led the armies to a crushing defeat of the rebels, beheaded the rebel Vice Director of the Masters of Writing Yuan Yan, and advanced against the five provinces of Jiang, Ying, Jing, Yong, and Xiang, bringing them all to submission.",
  },
  s0155: {
    literal: "Prince Zixun of Jin'an, Prince Zisui of Anlu, Prince Zixu of Linhai, and Prince Ziyuan of Shaoling were all granted death; all fellow partisans were executed.",
    idiomatic: "Prince Zixun of Jin'an, Prince Zisui of Anlu, Prince Zixu of Linhai, and Prince Ziyuan of Shaoling were all ordered to take their own lives, and all their partisans were put to death.",
  },
  s0156: {
    literal: "The various generals and commanders received enfeoffments and rewards each according to merit.",
    idiomatic: "The various generals and commanders received enfeoffments and rewards in proportion to their merit.",
  },
  s0157: {
    literal: "On jiashen, General Who Protects the Army and Prince Ziren of Yongjia was made General Who Pacifies the South and Inspector of Xiang.",
    idiomatic: "On the jiashen day General Who Protects the Army Prince Ziren of Yongjia was appointed General Who Pacifies the South and Inspector of Xiang.",
  },
  s0158: {
    literal: "Ninth month, yiyou day, a partial amnesty was granted to the five provinces Jiang, Ying, Jing, Yong, and Xiang;",
    idiomatic: "In the ninth month, on the yiyou day a partial amnesty was granted to the five provinces of Jiang, Ying, Jing, Yong, and Xiang;",
  },
  s0159: {
    literal: "governors and magistrates might not leave their posts.",
    idiomatic: "and local governors and magistrates were forbidden to leave their posts.",
  },
  s0160: {
    literal: "On renchen, General of Chariots and Cavalry and Inspector of Yu Prince Xiuyou of Shanyang was changed to Inspector of Jing.",
    idiomatic: "On the renchen day General of Chariots and Cavalry and Inspector of Yu Prince Xiuyou of Shanyang was reassigned as Inspector of Jing.",
  },
  s0161: {
    literal: "From Yu province Southern Yu was established.",
    idiomatic: "Southern Yu province was carved out from Yu.",
  },
  s0162: {
    literal: "On guisi, the Six Armies stood down from martial law.",
    idiomatic: "On the guisi day the Six Armies stood down from martial law.",
  },
  s0163: {
    literal: "A general amnesty was proclaimed throughout the realm; the people were granted one rank of nobility.",
    idiomatic: "A general amnesty was proclaimed throughout the realm, and the common people were granted one rank of nobility.",
  },
  s0164: {
    literal: "On jiawu, General of the Center Army Wang Jingwen was made General Who Pacifies the South and Inspector of Jiang.",
    idiomatic: "On the jiawu day General of the Center Army Wang Jingwen was appointed General Who Pacifies the South and Inspector of Jiang.",
  },
  s0165: {
    literal: "On wuxu, General of Chariots and Cavalry and Inspector of Jiang Wang Xuanmo was made Left Grand Master of the Palace with Staff equal to Three Divisions and General Who Protects the Army.",
    idiomatic: "On the wuxu day General of Chariots and Cavalry and Inspector of Jiang Wang Xuanmo was appointed Left Grand Master of the Palace with protocol equal to a three-division office and General Who Protects the Army.",
  },
  s0166: {
    literal: "On gengzi, the heir of Prince Xiuren of Jian'an, Borong, was made Inspector of Yu.",
    idiomatic: "On the gengzi day Borong, heir of Prince Xiuren of Jian'an, was appointed Inspector of Yu.",
  },
  s0167: {
    literal: "[7] On xinchou, General of the Guard Prince Xiuofan of Baling, retaining his original rank, was made Inspector of Yong.",
    idiomatic: "[7] On the xinchou day General of the Guard Prince Xiuofan of Baling, while retaining his original rank, was appointed Inspector of Yong.",
  },
  s0168: {
    literal: "Inspector of Yong Shen Youzhi was made Inspector of Ying.",
    idiomatic: "Inspector of Yong Shen Youzhi was appointed Inspector of Ying.",
  },
  s0169: {
    literal: "On gengxu, Leader of the Left Guard of the Heir Apparent Prince Jingsu of Jianping was made Inspector of Southern Yanzhou.",
    idiomatic: "On the gengxu day Leader of the Left Guard of the Heir Apparent Prince Jingsu of Jianping was appointed Inspector of Southern Yanzhou.",
  },
  s0170: {
    literal: "Tenth month, yimao day, Prince Ziren of Yongjia, Prince Zizhen of Shian, Prince Zimeng of Huainan, Prince Zichan of Nanping, Prince Ziyu of Luling, and Marquis Zifang of Songzi were all granted death.",
    idiomatic: "In the tenth month, on the yimao day Prince Ziren of Yongjia, Prince Zizhen of Shian, Prince Zimeng of Huainan, Prince Zichan of Nanping, Prince Ziyu of Luling, and Marquis Zifang of Songzi were all ordered to take their own lives.",
  },
  s0171: {
    literal: "On dingmao, Inspector of Ying Shen Youzhi was made General of the Garrison and marched north to attack together with Zhang Yong.",
    idiomatic: "On the dingmao day Inspector of Ying Shen Youzhi was made General of the Garrison and marched north to campaign together with Zhang Yong.",
  },
  s0172: {
    literal: "On gengwu, Administrator of Wu Gu Jizhi was made Inspector of Xiang.",
    idiomatic: "On the gengwu day Administrator of Wu Gu Jizhi was appointed Inspector of Xiang.",
  },
  s0173: {
    literal: "[8] On wuyin, the imperial son Yu was established as Crown Prince.",
    idiomatic: "[8] On the wuyin day the imperial son Yu was established as Crown Prince.",
  },
  s0174: {
    literal: "A partial amnesty was granted to Yang and Southern Xu.",
    idiomatic: "A partial amnesty was extended to Yang and Southern Xu provinces.",
  },
  s0175: {
    literal: "[9] General Who Assists the State Liu Yan was made Inspector of Guang; General of the Left Army Zhang Shi was made Inspector of Yu.",
    idiomatic: "[9] General Who Assists the State Liu Yan was appointed Inspector of Guang, and General of the Left Army Zhang Shi was appointed Inspector of Yu.",
  },
  s0176: {
    literal: "Eleventh month, jiashen day, Administrator of Ancheng Liu Xi was made Inspector of Ying.",
    idiomatic: "In the eleventh month, on the jiashen day Administrator of Ancheng Liu Xi was appointed Inspector of Ying.",
  },
  s0177: {
    literal: "An edict said: \"In governing, esteem what is simple and easy; in transforming the people, hasten to cut off what is elaborate and extravagant—far and near, rise and fall, this is clearly shown in the tracks left behind.",
    idiomatic: "An edict said: \"Good government rests on simplicity; reform of the people requires cutting off extravagance—through rise and fall, near and far, the lesson is written plain in history.",
  },
  s0178: {
    literal: "I have rescued this fallen fortune and inherited this extremity of hardship; upon it came further depletion, and upon that came armies on campaign—yet my understanding is dim before the former kings, and my tasks are hard compared with past ages.",
    idiomatic: "I have rescued a dynasty in collapse and inherited an age of extremity; upon that came further ruin, and upon that came endless campaigning—yet my understanding falls short of the former kings, and my burdens exceed those of past ages.",
  },
  s0179: {
    literal: "Thus the old levies were already heavy, and expense grew ever broader; reflecting on the myriad affairs whether waking or sleeping, I constantly think of broad reform.",
    idiomatic: "The old levies were already crushing, and expense grew ever greater; waking or sleeping, I reflect on the myriad affairs of state and constantly seek broad reform.",
  },
  s0180: {
    literal: "I now intend to ease corvée and lighten assessments, putting love of the people first; let the offices examine and add lenience in detail, and establish new categories of levy.",
    idiomatic: "I now intend to ease corvée labor and lighten tax assessments, putting the welfare of the people first; let the offices review the levies in detail, grant further lenience, and establish new categories of assessment.",
  },
  s0181: {
    literal: "As for local products and official tribute, each should follow the soil's suitability; what is presented and what is delivered in tribute, [10] respectfully follow the seasons.",
    idiomatic: "Local products and official tribute should each suit the land that produces them; what is presented and what is delivered as tribute [10] must respectfully follow the seasons.",
  },
  s0182: {
    literal: "Whatever corrupt customs harm the people, pursuits of the branch that violate the root, carved ornament and extravagant beauty, strange vessels and exotic skills—all are to be strictly cut off, striving to return to what is essential and real.",
    idiomatic: "Whatever corrupt customs harm the people, whatever pursuits of luxury betray the fundamentals, whatever carved ornament, extravagant display, strange vessels, or exotic skills—all must be strictly forbidden, so that affairs may return to what is essential and real.",
  },
  s0183: {
    literal: "The various offices of the Left and Right Imperial Workshop and the Palace Storehouse, in supplying and manufacturing for the court—all are to preserve thrift.",
    idiomatic: "The various offices of the Left and Right Imperial Workshop and the Palace Storehouse, in supplying and manufacturing for the court, must all preserve thrift.",
  },
  s0184: {
    literal: "May the pure wind of highest teaching slightly follow the Grand Antiquity; may wealth abound and yielding flourish, and the customs of our age be somewhat more restrained.",
    idiomatic: "May the pure wind of highest teaching draw somewhat nearer to Grand Antiquity; may wealth abound through yielding, and the customs of our age grow somewhat more restrained.",
  },
  s0185: {
    literal: "\" Again an edict said: \"To hold the pivot and inquire into government, [11] this is the root of establishing teaching;",
    idiomatic: "\" A second edict said: \"To hold the pivot of power and inquire into government [11] is the root of establishing teaching;",
  },
  s0186: {
    literal: "to raise the worthy and invite the reclusive is the foundation of spreading transformation.",
    idiomatic: "to raise the worthy and invite the reclusive is the foundation of spreading civilizing influence.",
  },
  s0187: {
    literal: "Therefore, bearing the cauldron and advancing counsel, the Yin age was thereby made secure;",
    idiomatic: "When men bore the cauldron and advanced counsel, the Yin dynasty was thereby made secure;",
  },
  s0188: {
    literal: "casting off the hook and becoming assistant, the Zhou fortune was thereby set right.",
    idiomatic: "when Jiang Ziya cast off his fishing hook and became chief minister, the fortune of Zhou was set right.",
  },
  s0189: {
    literal: "I have just inherited the great enterprise; instruction and the Way are not yet spread abroad—though I sit sideways awaiting loyal counsel and stand in dream at Yanfu and Fuqiu, yet no excellent plan is presented, no extraordinary man is heard of; eternally taking antiquity as mirror, I do not forget vigilance through the night.",
    idiomatic: "I have only just inherited the great enterprise; instruction and the Way are not yet spread abroad—though I sit sideways awaiting loyal counsel and stand in dream beside Yanfu and Fuqiu, yet no excellent plan is presented and no extraordinary man comes to my ear; taking antiquity as my mirror, I do not forget vigilance through the night.",
  },
  s0190: {
    literal: "Now the frontier regions are at peace and spreading transformation is only beginning; repeatedly I cherish thoughts of good order and truly look to admonition for what is lacking.",
    idiomatic: "Now the frontier regions are at peace and the work of spreading transformation is only beginning; again and again I cherish the hope of good order and truly look to my ministers for admonition on what is lacking.",
  },
  s0191: {
    literal: "Princes, dukes, directors, ministers, and the multitude of officials—whoever has excellent counsel frankly presented, correcting customs and aiding the age, let all urgently set forth the matter in memorial, without concealment or evasion.",
    idiomatic: "Princes, dukes, directors, ministers, and the multitude of officials—whoever has excellent counsel to offer, correcting customs and aiding the age, let all set forth the matter urgently in memorial, without concealment or evasion.",
  },
  s0192: {
    literal: "As for those of chaste dwelling in forests and marshes, of upright purity in hill gardens, broadly versed in past and present, earnestly honoring filial yielding—those in office in the four directions may clearly memorialize to search and raise them, fully report at once, and enfeoff and establish them according to merit.",
    idiomatic: "As for those of chaste dwelling in forests and marshes, of upright purity in hill and garden retirement, broadly versed in past and present, earnestly honoring filial piety and yielding—officials in office throughout the realm may memorialize clearly to search them out and raise them up, report them fully at once, and enfeoff and establish them according to merit.",
  },
  s0193: {
    literal: "Yannian, son of Prince Jingsu of Jianping, was made Prince of Xin'an.",
    idiomatic: "Yannian, son of Prince Jingsu of Jianping, was enfeoffed as Prince of Xin'an.",
  },
  s0194: {
    literal: "Newly appointed Left Grand Master of the Palace with Staff equal to Three Divisions Wang Xuanmo was made General of Chariots and Cavalry and Inspector of Southern Yu.",
    idiomatic: "Newly appointed Left Grand Master of the Palace with protocol equal to a three-division office Wang Xuanmo was appointed General of Chariots and Cavalry and Inspector of Southern Yu.",
  },
  s0195: {
    literal: "On bingshen, an order was issued that those who had wandered and scattered through famine in the eastern lands should each return to their native places, and the people's levies were remitted for two years.",
    idiomatic: "On the bingshen day an order was issued that those who had wandered and scattered through famine in the eastern lands should each return to their native places, and the people's levies were remitted for two years.",
  },
  s0196: {
    literal: "Twelfth month, jiwei day, Director of the Gold Section Liu Shanming was made Inspector of Ji.",
    idiomatic: "In the twelfth month, on the jiwei day Director of the Gold Section Liu Shanming was appointed Inspector of Ji.",
  },
  s0197: {
    literal: "An edict said: \"Recently the many princes declared disorder, and many were stained by criminal guilt.",
    idiomatic: "An edict said: \"Recently many princes rose in disorder, and many were stained by criminal guilt.",
  },
  s0198: {
    literal: "Some were truly bound to the dynasty, yet the affair arose from compulsion; lumped together in proof and imprisonment, I am deeply grieved thereby.",
    idiomatic: "Some were truly loyal to the dynasty, yet were driven by compulsion; lumped together in chains and imprisonment, I am deeply grieved.",
  },
  s0199: {
    literal: "The Way of Heaven esteems benevolence; virtue and punishment are employed together—when thunder arrives in season, rain clouds must surely break.",
    idiomatic: "The Way of Heaven esteems benevolence; virtue and punishment are employed together—when thunder arrives in season, the rain clouds must surely break.",
  },
  s0200: {
    literal: "I cherish words in silent reflection, thinking to spread wind and grace; all who should be forbidden and stripped are pardoned and cleared.",
    idiomatic: "I cherish words in silent reflection, seeking to spread grace across the realm; all who should have been forbidden or stripped of rank are pardoned and cleared.",
  },
};

for (const s of data.sentences) {
  const t = T[s.id];
  if (!t) throw new Error(`Missing translation for ${s.id}`);
  s.literal = t.literal;
  s.idiomatic = t.idiomatic;
}

fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', Object.keys(T).length, 'sentences');
