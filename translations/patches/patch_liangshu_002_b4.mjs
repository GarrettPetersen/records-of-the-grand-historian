#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'In spring of the seventh year, first month, day yiyou new moon, an edict said: "To establish a state and govern the people, establishing education comes first.',
    'In the seventh year, on the yiyou new moon of the first month, an edict declared: "To found a realm and rule the people, instruction must come first.',
  ],
  s0302: [
    'Without learning one will decline; fine talent has no source.',
    'Without study the state withers, and worthy minds have nowhere to grow.',
  ],
  s0303: [
    'I have received the bright mandate and settled the realm; though I have cultivated elegant pursuits and promoted arts and letters, those fully formed remain few and my fundamental aim is still lacking—not the way to mold the nobility and bring them into proper measure.',
    'Heaven\'s mandate has settled me in this land; I have worked the fields of culture and opened the gates of learning, yet too few are fully shaped and my deepest purpose remains unfinished—not enough to forge the high-born and guide them into order.',
  ],
  s0304: [
    'I wish to honor yielding to elders and govern the state as I would my own household.',
    'I mean to teach reverence for age and to rule the realm as one rules a household.',
  ],
  s0305: [
    'Now voice and instruction have spread everywhere, barbarian and Chinese share the same wind; it is fitting to open schools broadly, extend welcome to noble scions, attend to the ten human relations, expand the three virtues, so that the transforming pot reaches far and subtle teachings are displayed.',
    'Instruction now reaches every quarter, and north and south breathe the same air. Schools should open wide, sons of noble houses should be gathered in, the ten bonds of humanity honored, the three virtues enlarged, until the potter\'s wheel of transformation reaches far and the subtle word is made manifest.',
  ],
  s0306: [
    '" Central Guard General and concurrent Crown Prince Household Steward Wang Mao was promoted to Chariots and Cavalry General.',
    '" Central Guard General Wang Mao, who also served as Crown Prince Household Steward, was promoted to Chariots and Cavalry General.',
  ],
  s0307: [
    'On day wuxu, Divine Dragon and Benevolent Tiger towers were built outside the End Gate and Grand Marshal Gate.',
    'On wuxu day, the Divine Dragon and Benevolent Tiger towers were raised outside the End Gate and the Grand Marshal Gate.',
  ],
  s0308: [
    'On day renzi, Commandant-of-the-Guard General Cao Jingzong was made Central Guard General; Court Commandant Xiao Jing was additionally made Commandant-of-the-Guard General.',
    'On renzi day, Cao Jingzong, Commandant-of-the-Guard, became Central Guard General; Court Commandant Xiao Jing was also made Commandant-of-the-Guard.',
  ],
  s0309: [
    'Second month, day yimao: two bronze bells were found in Zhan county, Lujiang.',
    'In the second month, on yimao day, two bronze bells were discovered in Zhan county, Lujiang.',
  ],
  s0310: [
    'A new state gate was built south of Yue city.',
    'A new state gate was constructed south of Yue city.',
  ],
  s0311: [
    'Day yichou: added posts of Garrison-Guard General and below, each with its rank.',
    'On yichou day, the offices from Garrison-Guard General downward were expanded, each at its proper rank.',
  ],
  s0312: [
    'Day gengwu: an edict established one Provincial Notable, one District Patriarch, and one Village Magnate in each province, commandery, and county, charged exclusively with search and recommendation.',
    'On gengwu day, an edict ordered that each province, commandery, and county appoint one Provincial Notable, one District Patriarch, and one Village Magnate, each charged solely with seeking out and recommending talent.',
  ],
  s0313: [
    'Day yihai: Chariots and Cavalry Grand General, King of Gaoli Gao Yun was made General Who Pacifies the East, with the Grand General\'s Open Office and Third-Rank Ceremonial Parity; General Who Pacifies the North and South Yanzhou Inspector Lu Sengzhen was made Commandant-of-the-Guard General.',
    'On yihai day, Gao Yun, King of Gaoli and Chariots and Cavalry Grand General, was made General Who Pacifies the East with an open office and third-rank ceremonial parity; Lu Sengzhen, General Who Pacifies the North and inspector of South Yanzhou, became Commandant-of-the-Guard.',
  ],
  s0314: [
    'Day bingzi: Central Guard Army Changsha Prince Shen Ye was made South Yanzhou Inspector; concurrent Commandant Xiao Jing was made Yongzhou Inspector; Yongzhou Inspector Liu Qingyuan was made Guard Army General.',
    'On bingzi day, Changsha Prince Shen Ye, Central Guard Army, was made inspector of South Yanzhou; Xiao Jing, who also held the commandant\'s post, became inspector of Yongzhou; and Liu Qingyuan, inspector of Yongzhou, was made Guard Army General.',
  ],
  s0315: [
    'Fourth month of summer, day yimao: the Crown Prince took a consort; pardoned crimes below capital offense; distributed gifts to court ministers and close attendants each according to rank.',
    'In the fourth month of summer, on yimao day, the Crown Prince took a consort; crimes short of capital punishment were pardoned; and court ministers and close attendants received gifts according to rank.',
  ],
  s0316: [
    'Day xinwei: one spirit turtle was found in Moling county.',
    'On xinwei day, a spirit turtle was found in Moling county.',
  ],
  s0317: [
    'Day wuyin: two ancient bronze swords were found in Yuyao county.',
    'On wuyin day, two ancient bronze swords were discovered in Yuyao county.',
  ],
  s0318: [
    'Fifth month, day jihai: an edict restored Director of the Imperial Clan, Grand Master of Stud, Grand Master for Construction, and Grand Master of Ceremonies; also added Grand Storehouse and Grand Master of River Transport—twelve directorates as before.',
    'In the fifth month, on jihai day, an edict restored the Director of the Imperial Clan, Grand Master of Stud, Grand Master for Construction, and Grand Master of Ceremonies, and added the Grand Storehouse and Grand Master of River Transport, returning to the former twelve directorates.',
  ],
  s0319: [
    'Day guimao: General Who Pacifies the South and Jiangzhou Inspector Prince of Ancheng Xiu was made General Who Pacifies the West and Jingzhou Inspector; General Who Pacifies the West and Jingzhou Inspector Prince of Shixing Dan was made Guard Army General; Central Guard General Cao Jingzong was made General Who Pacifies the South and Jiangzhou Inspector.',
    'On guimao day, Prince of Ancheng Xiu, General Who Pacifies the South and inspector of Jiangzhou, became General Who Pacifies the West and inspector of Jingzhou; Prince of Shixing Dan, General Who Pacifies the West and inspector of Jingzhou, was made Guard Army General; and Cao Jingzong, Central Guard General, became General Who Pacifies the South and inspector of Jiangzhou.',
  ],
  s0320: [
    'Sixth month, day xinyou: restored residents within five li around the Jian and Xiu mausoleums; changed tomb supervisors to magistrates.',
    'In the sixth month, on xinyou day, residents within five li of the Jian and Xiu tombs were restored to their lands, and tomb supervisors were renamed magistrates.',
  ],
  s0321: [
    'Seventh month of autumn, day dinghai: the moon crossed the constellation Di.',
    'In the seventh month of autumn, on dinghai day, the moon entered the constellation Di.',
  ],
  s0322: [
    'Eighth month, day guichou: General Who Pacifies the South and Jiangzhou Inspector Cao Jingzong died.',
    'In the eighth month, on guichou day, Cao Jingzong, General Who Pacifies the South and inspector of Jiangzhou, died.',
  ],
  s0323: [
    'Day dingsi: pardoned capital offenses and below for cases not yet concluded.',
    'On dingsi day, capital crimes and lesser offenses in unresolved cases were pardoned.',
  ],
  s0324: [
    'Day jiaxu: General Who Pacifies the West and Jingzhou Inspector Prince of Ancheng Xiu was promoted to General Who Secures the West; Cloud-Banner General and Yingzhou Inspector Prince of Poyang Hui was promoted to General Who Pacifies the West.',
    'On jiaxu day, Prince of Ancheng Xiu, General Who Pacifies the West and inspector of Jingzhou, was promoted to General Who Secures the West; and Prince of Poyang Hui, Cloud-Banner General and inspector of Yingzhou, was promoted to General Who Pacifies the West.',
  ],
  s0325: [
    'The Old Man star appeared.',
    'The Old Man star was seen.',
  ],
  s0326: [
    'Ninth month, day dinghai, an edict said: "Pasturing fodder must go forth—King Wen of Zhou left the rule; pheasant and hare had punishments—Jiang Xuan brought condemnation.',
    'In the ninth month, on dinghai day, an edict said: "Fodder must be gathered from the wild—King Wen of Zhou left us that rule; even pheasant and hare were subject to law—Jiang Xuan was rebuked for forgetting it.',
  ],
  s0327: [
    'Marshes, lakes, mountains, and forests—materials are born there; axe and adze are needed in every household.',
    'From marsh, lake, hill, and forest come the materials every household needs for axe and adze.',
  ],
  s0328: [
    'Yet in recent generations this has been inherited and all has been sealed and barred—is this what is called sharing profit with the people, benefiting the common folk?',
    'Yet in recent times these lands have been sealed and fenced off, generation after generation—is that sharing profit with the people, or showing mercy to the common folk?',
  ],
  s0329: [
    'All government garrisons and posts that have been sealed and burned over—open the usual prohibitions entirely.',
    'Wherever government garrisons and posts have been sealed or cleared by fire, the ordinary prohibitions should now be lifted entirely.',
  ],
  s0330: [
    '" Day renchen: established Gentlemen Attendants of the Boy Cartbearers.',
    '" On renchen day, the office of Gentlemen Attendants of the Boy Cartbearers was established.',
  ],
  s0331: [
    'Day guisi: established the prince Ji as Prince of Nankang commandery.',
    'On guisi day, Prince Ji was enfeoffed as Prince of Nankang commandery.',
  ],
  s0332: [
    'Day jihai: the moon crossed the Eastern Well constellation.',
    'On jihai day, the moon entered the Eastern Well constellation.',
  ],
  s0333: [
    'Tenth month of winter, day bingyin: Wuxing Administrator Zhang Ji was made Left Vice Director of the Masters of Writing.',
    'In the tenth month of winter, on bingyin day, Zhang Ji, administrator of Wuxing, was made Left Vice Director of the Masters of Writing.',
  ],
  s0334: [
    'Day bingzi: Wei Yang Pass commander Xu Jingzhen surrendered the city to us.',
    'On bingzi day, Xu Jingzhen, commander of Wei\'s Yang Pass, surrendered his city to the court.',
  ],
  s0335: [
    'An edict ordered a great northern campaign.',
    'An edict called for a major northern campaign.',
  ],
  s0336: [
    'Guard Army General Prince of Shixing Dan was made General Who Pacifies the North, leading troops into Qing;',
    'Prince of Shixing Dan, Guard Army General, was made General Who Pacifies the North and led an army into Qing;',
  ],
  s0337: [
    'Chariots and Cavalry General Wang Mao led troops toward Suyu.',
    'Wang Mao, Chariots and Cavalry General, led troops toward Suyu.',
  ],
  s0338: [
    'Day dingchou: Wei Xuanhu garrison commander Bai Zaosheng and Yuzhou Inspector Hu Xun surrendered the city.',
    'On dingchou day, Bai Zaosheng, garrison commander at Wei\'s Xuanhu, and Hu Xun, inspector of Yuzhou, surrendered their city.',
  ],
  s0339: [
    'Zaosheng was made General Who Garrisons the North and Sizhou Inspector; Xun was made General Who Pacifies the North and Yuzhou Inspector.',
    'Zaosheng was made General Who Garrisons the North and inspector of Sizhou; Xun was made General Who Pacifies the North and inspector of Yuzhou.',
  ],
  s0340: [
    'Eleventh month, day xinsi: Yin county reported sweet dew fell.',
    'In the eleventh month, on xinsi day, Yin county reported that sweet dew had fallen.',
  ],
  s0341: [
    'Eighth year, spring, first month, day xinsi: the Emperor personally sacrificed at the Southern Altar, amnestied the realm, and granted one year of labor reward to civil and military officials inside and outside the capital.',
    'In the eighth year, on xinsi day of the first month of spring, the Emperor sacrificed at the Southern Altar in person, amnestied the realm, and granted one year\'s labor reward to civil and military officials within and beyond the capital.',
  ],
  s0342: [
    'Day renchen: Wei East Garrison aide Cheng Jingjun beheaded Suyu city commander Yan Zhongbao and surrendered the city.',
    'On renchen day, Cheng Jingjun, aide of Wei\'s East Garrison, beheaded Yan Zhongbao, commander of Suyu, and surrendered the city.',
  ],
  s0343: [
    'Second month, day renxu: the Old Man star appeared.',
    'In the second month, on renxu day, the Old Man star appeared.',
  ],
  s0344: [
    'Fourth month of summer: established South Liangzhou from northern Ba-West Brazil commandery.',
    'In the fourth month of summer, South Liangzhou was established from the northern part of Ba-West Brazil commandery.',
  ],
  s0345: [
    'Day wushen: Guard Army General Prince of Shixing Dan was made Central Guard General; Minister of Education, acting Crown Prince Grand Tutor Prince of Linchuan Hong was made Minister of Works and Yangzhou Inspector; Chariots and Cavalry General and Crown Prince Steward Wang Mao received Open Office at Third-Rank Ceremonial Parity under his original title.',
    'On wushen day, Prince of Shixing Dan, Guard Army General, became Central Guard General; Prince of Linchuan Hong, Minister of Education and acting Crown Prince Grand Tutor, was made Minister of Works and inspector of Yangzhou; and Wang Mao, Chariots and Cavalry General and Crown Prince Steward, received an open office with third-rank ceremonial parity under his existing title.',
  ],
  s0346: [
    'Day dingmao: Wei King of Chu city commander Li Guoxing surrendered the city.',
    'On dingmao day, Li Guoxing, commander of Wei\'s King of Chu city, surrendered.',
  ],
  s0347: [
    'Day bingzi: Central Army General and Danyang Intendant Wang Ying was made Right Grand Master for Splendor.',
    'On bingzi day, Wang Ying, Central Army General and intendant of Danyang, was made Right Grand Master for Splendor.',
  ],
  s0348: [
    'Fifth month, day renwu, an edict said: "Learning for government—earnest sages of old, salary therein—is also a matter of precedent.',
    'In the fifth month, on renwu day, an edict said: "The ancients taught that learning serves government, and that reward belongs to the learned—this too is an old truth.',
  ],
  s0349: [
    'I think to clarify governance, always encouraging Confucian arts, opening halls at carriage doors—in haste with this.',
    'I mean to set the lines of rule in order and honor the Confucian way, opening halls even at the carriage gate and pressing forward without delay.',
  ],
  s0350: [
    'Hence carrying books became custom, top graduates emerged one after another—they should be placed in court ranks, adorned with blue and purple.',
    'Books are carried everywhere now, and top graduates appear in steady succession; they should be placed in court service and adorned with blue and purple.',
  ],
  s0351: [
    'Those who can master one classic, from start to finish without weariness—after written examination confirming merit, selection may add promotions according to measure.',
    'Whoever can master one classic from beginning to end without slackening, once tested and found worthy, may be promoted according to merit.',
  ],
  s0352: [
    'Even ox-keepers and mutton shops, humble origins at the back door—test all according to talent for office; let none be left out."',
    'Even ox-keepers and mutton sellers, men of humble birth from the back door—all should be tried for office according to talent, and none passed over."',
  ],
  s0353: [
    'Seventh month of autumn, day guisi: Prince of Baling Xiao Baoyi died.',
    'In the seventh month of autumn, on guisi day, Prince of Baling Xiao Baoyi died.',
  ],
  s0354: [
    'Eighth month, day wuwu: the Old Man star appeared.',
    'In the eighth month, on wuwu day, the Old Man star appeared.',
  ],
  s0355: [
    'Tenth month of winter, day yisi: Central Army General Prince of Shixing Dan was made General Who Garrisons the North and South Yanzhou Inspector; South Yanzhou Inspector Changsha Prince Shen Ye was made Guard Army General.',
    'In the tenth month of winter, on yisi day, Prince of Shixing Dan, Central Army General, was made General Who Garrisons the North and inspector of South Yanzhou; and Changsha Prince Shen Ye, inspector of South Yanzhou, was made Guard Army General.',
  ],
  s0356: [
    'Ninth year, spring, first month, day yihai: Masters of Writing Director and acting Crown Prince Junior Tutor Shen Yue was made Left Grand Master for Splendor, retaining the acting junior tutorship; Right Grand Master for Splendor Wang Ying was made Masters of Writing Director; acting Central Pacification General Prince of Jian\'an Wei was made concurrent Guard Army General; General Who Garrisons the North and South Yanzhou Inspector Prince of Shixing Dan was made General Who Garrisons the West and Yizhou Inspector; Grand Master of Ceremonies Wang Liang was made Director of the Secretariat.',
    'In the ninth year, on yihai day of the first month of spring, Shen Yue, Masters of Writing Director and acting Crown Prince Junior Tutor, was made Left Grand Master for Splendor while keeping the junior tutorship; Wang Ying, Right Grand Master for Splendor, became Masters of Writing Director; Prince of Jian\'an Wei, acting Central Pacification General, was made concurrent Guard Army General; Prince of Shixing Dan, General Who Garrisons the North and inspector of South Yanzhou, was made General Who Garrisons the West and inspector of Yizhou; and Wang Liang, Grand Master of Ceremonies, was made Director of the Secretariat.',
  ],
  s0357: [
    'Day bingzi: Light Chariots General Prince of Jin\'an Gang was made South Yanzhou Inspector.',
    'On bingzi day, Prince of Jin\'an Gang, Light Chariots General, was made inspector of South Yanzhou.',
  ],
  s0358: [
    'Day gengyin: newly built Huai embankment works, north bank from Stone Fort to East Smeltery, south bank from Rear Islet Hedge Gate to Three Bridges.',
    'On gengyin day, new embankments along the Huai were built, the north bank running from Stone Fort to East Smeltery and the south bank from Rear Islet Hedge Gate to Three Bridges.',
  ],
  s0359: [
    'Third month, day jichou: the Emperor visited the Imperial Academy, personally attended the lecture hall, and granted silk to the Academy Rector and below each according to rank.',
    'In the third month, on jichou day, the Emperor visited the Imperial Academy, attended the lecture hall in person, and granted silk to the Academy Rector and those below him according to rank.',
  ],
  s0360: [
    'Day yiwei, an edict said: "Princes following study is established in the Book of Rites; noble scions all included is truly former instruction; thus to expand righteous conduct and duplicate the teaching way.',
    'On yiwei day, an edict said: "That princes should follow teachers is written in the Book of Rites; that noble youths should all be included is an instruction of old; by this we broaden righteous conduct and carry forward the way of teaching.',
  ],
  s0361: [
    'Now the Academy grandly opens, the crown prince yields by age—from this down, all should pursue study.',
    'Now the Academy opens wide, and the crown prince yields place by age; from this time forward, all should apply themselves to learning.',
  ],
  s0362: [
    'The Crown Prince and sons of princes and marquises, of age to follow teachers, may be ordered to enter school.',
    'The Crown Prince and the sons of princes and marquises who have reached the age for teachers should be sent to enter the schools.',
  ],
  s0363: [
    '" Khotan sent envoys presenting local products.',
    '" Khotan sent envoys bearing tribute.',
  ],
  s0364: [
    'Fourth month of summer, day dingsi: reformed selection of Masters of Writing Five Capital clerks to use humble-stream candidates.',
    'In the fourth month of summer, on dingsi day, selection for the Five Capital clerks of the Masters of Writing was reformed to draw from humble-stream candidates.',
  ],
  s0365: [
    'Linyi sent envoys presenting one white monkey.',
    'Linyi sent envoys bearing one white monkey.',
  ],
  s0366: [
    'Fifth month, day jihai, an edict said: "I listen broadly and think on governance, never forgetting the slanting sun.',
    'In the fifth month, on jihai day, an edict said: "I listen widely and think constantly on rule, never forgetting the sun already past noon.',
  ],
  s0367: [
    'Yet the hundred offices and many affairs—their paths are not one; applied as times suit, each has its fit—unless gathering all opinions, there is no way to prepare this for my personal review.',
    'Yet the hundred offices and their many tasks follow more than one path; each matter has its proper season and use, and unless all voices are gathered together, I cannot review them as I should.',
  ],
  s0368: [
    'From now wherever bureaus of the Secretariat, ministries, provinces, commanderies, and garrison posts have responsible officials—meet regularly to discuss, each state benefits and harms, and fully memorial for report.',
    'Henceforth, at every bureau of the Secretariat, ministry, province, commandery, and garrison post where responsible officials serve, they should meet at intervals to discuss together, each stating gains and losses, and report the whole in memorial.',
  ],
  s0369: [
    '" Director of the Secretariat Wang Liang died.',
    '" Wang Liang, Director of the Secretariat, died.',
  ],
  s0370: [
    'Sixth month, day guichou: bandits killed Xuancheng Administrator Zhu Sengyong.',
    'In the sixth month, on guichou day, bandits killed Zhu Sengyong, administrator of Xuancheng.',
  ],
  s0371: [
    'Day guiyou: Central Pacification General, concurrent Guard Army Prince of Jian\'an Wei was made General Who Garrisons the South and Jiangzhou Inspector.',
    'On guiyou day, Prince of Jian\'an Wei, Central Pacification General and concurrent Guard Army, was made General Who Garrisons the South and inspector of Jiangzhou.',
  ],
  s0372: [
    'Intercalary month, day jichou: Xuancheng bandits turned to raid Wuxing county; Administrator Cai Bun suppressed them.',
    'In the intercalary month, on jichou day, Xuancheng bandits turned to raid Wuxing county; Cai Bun, the administrator, suppressed them.',
  ],
  s0373: [
    'Seventh month of autumn, day jisi: the Old Man star appeared.',
    'In the seventh month of autumn, on jisi day, the Old Man star appeared.',
  ],
  s0374: [
    'Twelfth month of winter, day guiwei: the Emperor visited the Imperial Academy, tested noble scions by examination, and granted rewards to the instructing offices each according to rank.',
    'In the twelfth month of winter, on guiwei day, the Emperor visited the Imperial Academy, tested the noble scions by examination, and granted rewards to the teaching offices according to rank.',
  ],
  s0375: [
    'Tenth year, spring, first month, day xinchou: the Emperor personally sacrificed at the Southern Altar, granted a great amnesty, and those staying at their posts received two years of labor reward.',
    'In the tenth year, on xinchou day of the first month of spring, the Emperor sacrificed at the Southern Altar in person, amnestied the realm, and granted two years\' labor reward to officials remaining at their posts.',
  ],
  s0376: [
    'Day guimao: Left Vice Director of the Masters of Writing Zhang Ji was made General Who Pacifies the North and Inspector of Qing and Ji provinces; Yingzhou Inspector Prince of Poyang Hui was made Guard Army General.',
    'On guimao day, Zhang Ji, Left Vice Director of the Masters of Writing, was made General Who Pacifies the North and inspector of Qing and Ji provinces; and Prince of Poyang Hui, inspector of Yingzhou, was made Guard Army General.',
  ],
  s0377: [
    'Day jiachen: South Xuzhou Inspector Prince of Yuzhang Zong was made Yingzhou Inspector; Light Chariots General Prince of Nankang Ji was made South Xuzhou Inspector.',
    'On jiachen day, Prince of Yuzhang Zong, inspector of South Xuzhou, became inspector of Yingzhou; and Prince of Nankang Ji, Light Chariots General, was made inspector of South Xuzhou.',
  ],
  s0378: [
    'Day wushen: one zouyu appeared in Huarong county, Jingzhou.',
    'On wushen day, a zouyu was seen in Huarong county, Jingzhou.',
  ],
  s0379: [
    'Left People Minister Wang Yan was made Minister of Personnel.',
    'Wang Yan, Left People Minister, was made Minister of Personnel.',
  ],
  s0380: [
    'Day xinyou: the Emperor personally sacrificed at the Bright Hall.',
    'On xinyou day, the Emperor sacrificed at the Bright Hall in person.',
  ],
  s0381: [
    'Third month, day xinchou: bandits killed Dongguan and Langye commanderies\' Administrator Deng Ti; using Qushan they drew in the Wei army, and Quake-Distant General Ma Xiancai was sent to suppress them.',
    'In the third month, on xinchou day, bandits killed Deng Ti, administrator of Dongguan and Langye; they used Qushan to bring in Wei forces, and the court sent Quake-Distant General Ma Xiancai to suppress them.',
  ],
  s0382: [
    'That month: Wei Xuzhou Inspector Lu Chang led troops to Qushan.',
    'That month, Lu Chang, Wei\'s inspector of Xuzhou, led troops to Qushan.',
  ],
  s0383: [
    'Fifth month of summer, day guiyou: Anfeng county found one single-horned black turtle.',
    'In the fifth month of summer, on guiyou day, Anfeng county found a one-horned black turtle.',
  ],
  s0384: [
    'Day dingchou: Commandant Lu Sengzhen died.',
    'On dingchou day, Lu Sengzhen, Commandant-of-the-Guard, died.',
  ],
  s0385: [
    'Day jimao: Academy Rector Zhang Chong was made Left Vice Director of the Masters of Writing; Crown Prince Steward Liu Qingyuan was made Commandant-of-the-Guard General.',
    'On jimao day, Zhang Chong, Academy Rector, was made Left Vice Director of the Masters of Writing; and Liu Qingyuan, Crown Prince Steward, was made Commandant-of-the-Guard.',
  ],
  s0386: [
    'Sixth month, day yiyou: one auspicious lotus stalk with three flowers in Leyou Garden.',
    'In the sixth month, on yiyou day, an auspicious lotus with one stalk and three flowers appeared in Leyou Garden.',
  ],
  s0387: [
    'Seventh month of autumn, day bingchen, an edict said: "Formerly ministers faced the throne and stated—recorded in former histories; prefects and stewards reported at the steps—clear text in successive dynasties—thus to set those many tasks in order and accomplish these group affairs.',
    'In the seventh month of autumn, on bingchen day, an edict said: "In former ages ministers spoke face to face before the throne, as the old histories record; prefects and stewards memorialized from the steps, as dynast after dynast made plain—by this the many tasks were ordered and the work of state completed.',
  ],
  s0388: [
    'The Jin dynasty declined, empty fabrication became the wind—from this inherited, the fault grew ever farther.',
    'When Jin fell into decay, empty pretense became the fashion, and from that inheritance the fault only widened.',
  ],
  s0389: [
    'Thus the martial canopy labored empty—no Ji Gong\'s memorial; the red steps stood vacant—lacking Zheng Sheng\'s footprints.',
    'Thus the martial canopy stood idle with no memorial like Ji Gong\'s; the red steps lay empty with no footfall like Zheng Sheng\'s.',
  ],
  s0390: [
    'Three catalpas, eight seats—officials with duties—all should have something to discuss, may enter and state memorials, hoping through universal care to slightly correct my thinness."',
    'You who hold the three catalpas and eight seats, all officials charged with affairs, should speak when you have something to say; enter and memorial as you will, that through your broad care you may lend a little strength to my own thin worth."',
  ],
  s0391: [
    'Ninth month, day bingshen: the northwest sky rumbled, and red qi descended to earth.',
    'In the ninth month, on bingshen day, the northwest sky thundered, and red vapor descended to the ground.',
  ],
  s0392: [
    'Twelfth month of winter, day guiyou: a mountain cart appeared in Lincheng county.',
    'In the twelfth month of winter, on guiyou day, a mountain cart was seen in Lincheng county.',
  ],
  s0393: [
    'Day gengchen: Ma Xiancai greatly defeated the Wei army, beheaded more than one hundred thousand, and recovered Qushan city.',
    'On gengchen day, Ma Xiancai routed the Wei army, took more than one hundred thousand heads, and recovered Qushan city.',
  ],
  s0394: [
    'That year: first built triple-storied towers on palace city gates and opened two roads.',
    'That year, triple-storied towers were first built on the palace city gates, and two new roads were opened.',
  ],
  s0395: [
    'Dangchang sent envoys presenting local products.',
    'Dangchang sent envoys bearing tribute.',
  ],
  s0396: [
    'Eleventh year, spring, first month, day renchen, an edict said: "Punishment law pities the aged—crime does not implicate offspring—Rites has clear text, histories show former affairs—generally to extend compassion, thus punishment has what does not reach.',
    'In the eleventh year, on renchen day of the first month of spring, an edict said: "The law of punishment shows mercy to the aged, and guilt does not fall on a man\'s household—the Rites state this plainly, and the histories show it in former cases—so that compassion may be extended and punishment may stop where it should.',
  ],
  s0397: [
    'Recent generations inherited this, the net grew stricter—childhood and gray hair shared guilt in offense.',
    'In recent times the net has only tightened, until children and gray-haired alike were punished together for the same crime.',
  ],
  s0398: [
    'Though punishing evil and encouraging good should exhaust the system, yet old and young wandering apart is truly also pitiable.',
    'Though punishing evil and urging good must be carried through, the scattering of old and young is pitiable indeed.',
  ],
  s0399: [
    'From now fugitive-exile households and crimes warranting collateral labor—if there are old and young in the years, sending may be halted.',
    'From this time forward, in cases of fugitive exile or crimes requiring collateral labor, if the household includes the aged or the very young, they need not be sent away.',
  ],
  s0400: [
    '" Shen Yue, Left Grand Master for Splendor and acting Crown Prince Junior Tutor, was given Special Advance; Prince of Jian\'an Wei, General Who Garrisons the South and Jiangzhou Inspector, received Third-Rank Ceremonial Parity; Prince of Linchuan Hong, Minister of Works and Yangzhou Inspector, was advanced to Grand Commander; Wang Mao, Fast Cavalry General, was made Minister of Works; Wang Ying, Masters of Writing Director and Cloud-Banner General, was promoted to Pacification Left General; Zhang Ji, General Who Pacifies the North and Inspector of Qing and Ji provinces, was promoted to General Who Garrisons the North.',
    '" Shen Yue, Left Grand Master for Splendor and acting Crown Prince Junior Tutor, received Special Advance; Prince of Jian\'an Wei, General Who Garrisons the South and inspector of Jiangzhou, was granted third-rank ceremonial parity; Prince of Linchuan Hong, Minister of Works and inspector of Yangzhou, was advanced to Grand Commander; Wang Mao, Fast Cavalry General, became Minister of Works; Wang Ying, Masters of Writing Director and Cloud-Banner General, was promoted to Pacification Left General; and Zhang Ji, General Who Pacifies the North and inspector of Qing and Ji provinces, was promoted to General Who Garrisons the North.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_002_b4.mjs <translation.json>'
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
