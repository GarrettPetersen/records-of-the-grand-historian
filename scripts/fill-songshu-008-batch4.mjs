#!/usr/bin/env node
import fs from 'node:fs';

const path = 'translations/current_translation_songshu.json';

const T = {
  s0301: {
    literal: 'On wuzi, General Who Pacifies the North Cui Gonglie was made Inspector of Yan.',
    idiomatic:
      'On wuzi General Who Pacifies the North Cui Gonglie was appointed Inspector of Yan.',
  },
  s0302: {
    literal:
      'On wuxu, newly appointed Bearer of the Gilded Gate Du Youwen was made Inspector of Liang and Southern Qin.',
    idiomatic:
      'On wuxu newly appointed Bearer of the Gilded Gate Du Youwen was made Inspector of Liang and Southern Qin.',
  },
  s0303: {
    literal:
      'In the sixth month, on xinwei, Xuanyao, son of Prince Xiuyou of Jinping, was established as Prince of Nanping.',
    idiomatic:
      'In the sixth month, on xinwei, Xuanyao, son of Prince Xiuyou of Jinping, was enfeoffed as Prince of Nanping.',
  },
  s0304: {
    literal:
      '[27] On renshen, Pacifying West General and Inspector of Ying Cai Xingzong was made General Who Pacifies the East.',
    idiomatic:
      '[27] On renshen Pacifying West General and Inspector of Ying Cai Xingzong was promoted to General Who Pacifies the East.',
  },
  s0305: {
    literal: 'On guiyou, General of the Left Guard Shen Youzhi was made Inspector of Ying.',
    idiomatic: 'On guiyou General of the Left Guard Shen Youzhi was appointed Inspector of Ying.',
  },
  s0306: {
    literal:
      'Since military levies began, all officials\' salaries were cut off, and raw grain was issued instead.',
    idiomatic:
      'Since the war mobilization began, officials\' salaries were suspended and they were issued grain in kind instead.',
  },
  s0307: {
    literal:
      'On dingchou, General of Chariots and Cavalry and Inspector of Southern Yu Prince Yi of Lujiang was stripped of office and rank.',
    idiomatic:
      'On dingchou General of Chariots and Cavalry and Inspector of Southern Yu Prince Yi of Lujiang was deprived of office and noble rank.',
  },
  s0308: {
    literal:
      'On wuyin, Left General and acting Inspector of Xiang Prince Xiuruo of Baling was made General Who Campaigns South and Inspector of Xiang.',
    idiomatic:
      'On wuyin Left General and acting Inspector of Xiang Prince Xiuruo of Baling was appointed General Who Campaigns South and Inspector of Xiang.',
  },
  s0309: {
    literal: 'On renwu, Southern Yu was abolished.',
    idiomatic: 'On renwu Southern Yu was abolished.',
  },
  s0310: {
    literal:
      'On bingxu, newly appointed Bearer of the Gilded Gate Liu Liang was made Inspector of Yi.',
    idiomatic:
      'On bingxu newly appointed Bearer of the Gilded Gate Liu Liang was appointed Inspector of Yi.',
  },
  s0311: {
    literal:
      'In autumn, the seventh month, on jiyou, Assistant State General Wang Liang was made Inspector of Xu; Administrator of Dongguan Chen Bonian was made Inspector of Jiao.',
    idiomatic:
      'In the seventh month of autumn, on jiyou, Assistant State General Wang Liang was made Inspector of Xu and Administrator of Dongguan Chen Bonian Inspector of Jiao.',
  },
  s0312: {
    literal: 'On jiayin, Administrator of Shanyang Li Lingqian was made Inspector of Yan.',
    idiomatic: 'On jiayin Administrator of Shanyang Li Lingqian was appointed Inspector of Yan.',
  },
  s0313: {
    literal: 'On renxu, Assistant State General was renamed Assistant Master General.',
    idiomatic: 'On renxu the title Assistant State General was changed to Assistant Master General.',
  },
  s0314: {
    literal:
      'In the eighth month, on jichou, Right General and acting Inspector of Yu Liu Kan was made General Who Levels the West and Inspector of Yu.',
    idiomatic:
      'In the eighth month, on jichou, Right General and acting Inspector of Yu Liu Kan was appointed General Who Levels the West and Inspector of Yu.',
  },
  s0315: {
    literal: 'On renchen, Administrator of Hailing Liu Chongzhi was made Inspector of Ji.',
    idiomatic: 'On renchen Administrator of Hailing Liu Chongzhi was appointed Inspector of Ji.',
  },
  s0316: {
    literal:
      'In the ninth month, on jiayin, Yanzhi, son of Prince Zuan of Changsha, was established as Prince of Shiping.',
    idiomatic:
      'In the ninth month, on jiayin, Yanzhi, son of Prince Zuan of Changsha, was enfeoffed as Prince of Shiping.',
  },
  s0317: {
    literal: 'On wuwu, Colonel of the Garrison Wang Kun was transferred.',
    idiomatic: 'On wuwu Colonel of the Garrison Wang Kun was reassigned.',
  },
  s0318: {
    literal:
      'On jiwei, an edict said: "The conduct of [Xu You of] Ji and [Xu Chao of] Ying has been prized through the ages, and the style of pure simplicity has been esteemed by sage kings.',
    idiomatic:
      'On jiwei an edict said: "The integrity of the recluses of Ji and Ying has been honored since antiquity, and the spirit of plain simplicity has been prized by wise rulers.',
  },
  s0319: {
    literal:
      'I have met a time of rushing torrents and taken the throne in troubled, dark days, suppressing violence and cutting down disorder, with not a day to spare.',
    idiomatic:
      'I came to the throne amid flood and turmoil, in days of hardship and obscurity, suppressing cruelty and quelling rebellion, with scarcely a moment to rest.',
  },
  s0320: {
    literal:
      'Now though the passes and Long regions are still clouded, districts and counties are clearing; to lay aside arms and cultivate culture is what we aim at now.',
    idiomatic:
      'Now though the frontier passes and Long region remain troubled, the districts are growing calm; the time has come to sheathe arms and foster learning.',
  },
  s0321: {
    literal:
      'Thinking to exalt integrity and shame, and by that to still reckless pursuit, I have long searched in my thoughts and slept and risen in sighing expectation.',
    idiomatic:
      'I mean to exalt integrity and shame and thereby still the rush of shallow ambition; I have long kept such men in mind, waking and sleeping in eager hope.',
  },
  s0322: {
    literal:
      'Those who dwell in steadfast retirement, rest in their homesteads, [28] break their wall and leave glory behind, carry rods and decline office, whose will is tranquil as rivers and seas and whose conduct rises above vulgar dust—such persons are to be carefully sought out and promptly made known by name.',
    idiomatic:
      'Those who live in steadfast seclusion, keep to their lanes and gardens, [28] break their wall and renounce rank, fish by the stream and refuse summons, whose hearts are calm as the rivers and seas and whose conduct towers above the vulgar—such men are to be diligently sought and promptly reported by name.',
  },
  s0323: {
    literal: 'We shall enrich gardens and honor virtue, and abundantly display their rites.',
    idiomatic: 'We shall enrich their estates and honor their virtue, and make their rites resplendent.',
  },
  s0324: {
    literal: 'Each office should recommend those it knows, granting ranks as the seasons require.',
    idiomatic: 'Every office should recommend those it knows, granting noble ranks in due season.',
  },
  s0325: {
    literal:
      '" On yichou, newly appointed General Who Levels the West and Inspector of Yu Liu Kan was made Colonel of the Garrison.',
    idiomatic:
      '" On yichou newly appointed General Who Levels the West and Inspector of Yu Liu Kan was appointed Colonel of the Garrison.',
  },
  s0326: {
    literal:
      'In winter, the tenth month, on dingmao, first day of new moon, there was a solar eclipse.',
    idiomatic:
      'In the tenth month of winter, on dingmao, the first day of the month, there was a solar eclipse.',
  },
  s0327: {
    literal: 'In the eleventh month, on dingwei, the Northern Wei sent envoys presenting local products.',
    idiomatic: 'In the eleventh month, on dingwei, the Northern Wei sent envoys bearing tribute.',
  },
  s0328: {
    literal:
      'In the intercalary month, on wuzi, Grand General of Agile Cavalry and Inspector of Jing Prince Xiuyou of Jinping was made Southern Xu inspector under his former title; General Who Campaigns South and Inspector of Xiang Prince Xiuruo of Baling was made General Who Campaigns West and Inspector of Jing; Assistant Master General Meng Ciyang was made Inspector of Yan; [29] Administrator of Yiyang Lü Anguo was made Inspector of Si.',
    idiomatic:
      'In the intercalary month, on wuzi, Grand General of Agile Cavalry and Inspector of Jing Prince Xiuyou of Jinping was transferred to Southern Xu under his former title; General Who Campaigns South and Inspector of Xiang Prince Xiuruo of Baling was made General Who Campaigns West and Inspector of Jing; Assistant Master General Meng Ciyang was appointed Inspector of Yan; [29] and Administrator of Yiyang Lü Anguo Inspector of Si.',
  },
  s0329: {
    literal:
      'In the twelfth month, on wuxu, Minister of Works Prince Xiuren of Jian\'an relinquished the post of Inspector of Yang.',
    idiomatic:
      'In the twelfth month, on wuxu, Minister of Works Prince Xiuren of Jian\'an resigned as Inspector of Yang.',
  },
  s0330: {
    literal:
      'On jiwei, Grand General Who Campaigns North and Inspector of Southern Xu Prince Xiufan of Guiyang was made Grand Master of the Palace Archives, General of the Central Army, and Inspector of Yang; [30] Administrator of Wuxing Prince Jingsu of Jianping was made Inspector of Xiang; Assistant Master General Heir of Jian\'an Prince Bozhong was made Inspector of Guang.',
    idiomatic:
      'On jiwei Grand General Who Campaigns North and Inspector of Southern Xu Prince Xiufan of Guiyang was appointed Grand Master of the Palace Archives, General of the Central Army, and Inspector of Yang; [30] Administrator of Wuxing Prince Jingsu of Jianping was made Inspector of Xiang; and Assistant Master General Heir of Jian\'an Prince Bozhong Inspector of Guang.',
  },
  s0331: {
    literal: '[31] On gengshen, five commanderies of Jing and Yi were split off to establish the Colonel of the Three Ba.',
    idiomatic:
      '[31] On gengshen five commanderies of Jing and Yi were detached to establish the Colonel of the Three Ba.',
  },
  s0332: {
    literal:
      'In the sixth year, spring, first month, on yihai, it was first decreed that the Southern Altar be sacrificed to every two years in alternation and the Hall of Illumination every year in alternation.',
    idiomatic:
      'In the sixth year, on yihai in the first month of spring, it was first ordained that the Southern Altar be sacrificed to in alternate years and the Hall of Illumination in the years between.',
  },
  s0333: {
    literal:
      'In the second month, on renyin, Minister of Works Prince Xiuren of Jian\'an was made Grand Commandant, retaining the post of Minister of Works.',
    idiomatic:
      'In the second month, on renyin, Minister of Works Prince Xiuren of Jian\'an was appointed Grand Commandant while retaining the Ministry of Works.',
  },
  s0334: {
    literal: 'On guichou, the Heir Apparent took a consort.',
    idiomatic: 'On guichou the Heir Apparent received a consort.',
  },
  s0335: {
    literal: 'On jiayin, a general amnesty was proclaimed throughout the realm.',
    idiomatic: 'On jiayin a general amnesty was proclaimed throughout the realm.',
  },
  s0336: {
    literal: 'Those who forged registers to enter the army were excluded from the amnesty.',
    idiomatic: 'Those who had falsified records to join the army were excluded from the amnesty.',
  },
  s0337: {
    literal: 'Graded gifts were distributed.',
    idiomatic: 'Graded gifts were distributed to all.',
  },
  s0338: {
    literal: 'In the third month, on yihai, Colonel of the Palace Guard Liu Xi died.',
    idiomatic: 'In the third month, on yihai, Colonel of the Palace Guard Liu Xi passed away.',
  },
  s0339: {
    literal:
      'On dingchou, Grand Mentor of the Heir Apparent Zhang Yong was made General Who Protects the Army.',
    idiomatic:
      'On dingchou Grand Mentor of the Heir Apparent Zhang Yong was appointed General Who Protects the Army.',
  },
  s0340: {
    literal: 'In summer, the fourth month, on guihai, the sixth prince, Xie, was established as Prince of Jinxi.',
    idiomatic:
      'In the fourth month of summer, on guihai, the sixth prince Xie was enfeoffed as Prince of Jinxi.',
  },
  s0341: {
    literal:
      'In the fifth month, on dingchou, former Forward General Chen Yinzong was made Inspector of Xu.',
    idiomatic:
      'In the fifth month, on dingchou, former Forward General Chen Yinzong was appointed Inspector of Xu.',
  },
  s0342: {
    literal: 'On dinghai, Champion General Tuyuhun Shiqian was made General Who Levels the West.',
    idiomatic: 'On dinghai Champion General Tuyuhun Shiqian was promoted to General Who Levels the West.',
  },
  s0343: {
    literal: 'On wuzi, Court Gentleman-at-Attendance Kong Yu was made Inspector of Ning.',
    idiomatic: 'On wuzi Court Gentleman-at-Attendance Kong Yu was appointed Inspector of Ning.',
  },
  s0344: {
    literal:
      'In the sixth month, on jihai, the fifth prince Zhijing succeeded Eastern-Pacification Prince Chong of Dongping, Xiuxian.',
    idiomatic:
      'In the sixth month, on jihai, the fifth prince Zhijing succeeded Chong Prince of Eastern Pacification Xiuxian of Dongping.',
  },
  s0345: {
    literal:
      'On gengzi, Palace Attendant Liu Yun was made General Who Comforts the Army and Inspector of Yong; Forward General and Inspector of Ying Shen Youzhi was promoted to General Who Guards the Army; Inspector of Yang Prince Xiufan of Guiyang was made Grand General Who Campaigns South and Inspector of Jiang.',
    idiomatic:
      'On gengzi Palace Attendant Liu Yun was appointed General Who Comforts the Army and Inspector of Yong; Forward General and Inspector of Ying Shen Youzhi was promoted to General Who Guards the Army; and Inspector of Yang Prince Xiufan of Guiyang was made Grand General Who Campaigns South and Inspector of Jiang.',
  },
  s0346: {
    literal:
      'On guimao, General Who Pacifies the South and Inspector of Jiang Wang Jingwen was made Vice Director of the Masters of Writing on the Left and Inspector of Yang; Vice Director of the Masters of Writing Yuan Can was made Vice Director on the Right.',
    idiomatic:
      'On guimao General Who Pacifies the South and Inspector of Jiang Wang Jingwen was appointed Left Vice Director of the Masters of Writing and Inspector of Yang, and Vice Director Yuan Can Right Vice Director.',
  },
  s0347: {
    literal:
      'On jiwei, Linhe commandery was renamed Linqing commandery, and Prince Xiuxian of Dongping was posthumously renamed Chong Prince of Linqing.',
    idiomatic:
      'On jiwei Linhe commandery was renamed Linqing, and Prince Xiuxian of Dongping was posthumously styled Chong Prince of Linqing.',
  },
  s0348: {
    literal: 'In the seventh month, on bingxu, the fifth prince Zhijing died.',
    idiomatic: 'In the seventh month, on bingxu, the fifth prince Zhijing passed away.',
  },
  s0349: {
    literal: 'In the ninth month, on yichou, Colonel of the Garrison Liu Kan was given the additional title General Who Pacifies the North.',
    idiomatic:
      'In the ninth month, on yichou, Colonel of the Garrison Liu Kan was also made General Who Pacifies the North.',
  },
  s0350: {
    literal: 'On wuyin, the Zongming Hall was established; scholars were summoned to fill it.',
    idiomatic: 'On wuyin the Zongming Hall was founded and scholars were summoned to staff it.',
  },
  s0351: {
    literal: 'A Sacrificer of the Eastern Pavilion was appointed.',
    idiomatic: 'A Sacrificer of the Eastern Pavilion was installed.',
  },
  s0352: {
    literal:
      'On guiwei, the eighth prince Zhihuan succeeded Chong Prince of Linqing, Xiuxian.',
    idiomatic:
      'On guiwei the eighth prince Zhihuan succeeded Chong Prince of Linqing Xiuxian.',
  },
  s0353: {
    literal:
      'In winter, the tenth month, on xinmao, the ninth prince, Zan, was established as Prince of Wuling.',
    idiomatic:
      'In the tenth month of winter, on xinmao, the ninth prince Zan was enfeoffed as Prince of Wuling.',
  },
  s0354: {
    literal: 'On yisi, former General of the Right Army Ma Shen was made Inspector of Northern Yong.',
    idiomatic: 'On yisi former General of the Right Army Ma Shen was appointed Inspector of Northern Yong.',
  },
  s0355: {
    literal: 'On jiyou, the imperial carriage visited the Eastern Hall to hear lawsuits.',
    idiomatic: 'On jiyou the Emperor visited the Eastern Hall to hear lawsuits in person.',
  },
  s0356: {
    literal: 'In the eleventh month, on jisi, the state of Koguryŏ sent envoys presenting local products.',
    idiomatic: 'In the eleventh month, on jisi, Koguryŏ sent envoys bearing tribute.',
  },
  s0357: {
    literal:
      'In the twelfth month, on guisi, because border troubles had not ceased, it was decreed that all whose parents were trapped in foreign lands should marry and take office.',
    idiomatic:
      'In the twelfth month, on guisi, because the frontier war had not ended, the court decreed that all whose parents were held in enemy territory must marry and accept office.',
  },
  s0358: {
    literal: 'On wuxu, Shixing commandery was made Song\'an commandery.',
    idiomatic: 'On wuxu Shixing commandery was renamed Song\'an.',
  },
  s0359: {
    literal: 'On bingchen, General Who Protects the Army Zhang Yong was transferred.',
    idiomatic: 'On bingchen General Who Protects the Army Zhang Yong was reassigned.',
  },
  s0360: {
    literal: 'In the third month, on xinyou, the Northern Wei sent envoys presenting local products.',
    idiomatic: 'In the third month, on xinyou, the Northern Wei sent envoys bearing tribute.',
  },
  s0361: {
    literal: 'On renxu, the Rouran state sent envoys bearing tribute.',
    idiomatic: 'On renxu the Rouran sent envoys bearing tribute.',
  },
  s0362: {
    literal:
      'In summer, the fourth month, on xinchou, capital crimes throughout the realm were reduced one degree; all held under imperial order were released.',
    idiomatic:
      'In the fourth month of summer, on xinchou, death sentences throughout the realm were commuted one degree and all prisoners held under imperial writ were released.',
  },
  s0363: {
    literal: 'On jiachen, Xinping commandery was established within Southern Yan.',
    idiomatic: 'On jiachen Xinping commandery was created within Southern Yan.',
  },
  s0364: {
    literal:
      'On guichou, Grand Master of the Golden Gate and the Purple Dawn Zhang Yong concurrently held the post of General Who Protects the Army.',
    idiomatic:
      'On guichou Grand Master of the Golden Gate and the Purple Dawn Zhang Yong was also made General Who Protects the Army.',
  },
  s0365: {
    literal:
      'In the fifth month, on wuwu, Minister of Works Prince Xiuren of Jian\'an was guilty of crime and committed suicide.',
    idiomatic:
      'In the fifth month, on wuwu, Minister of Works Prince Xiuren of Jian\'an was found guilty and took his own life.',
  },
  s0366: {
    literal:
      'On xinyou, Chief Clerk of Pacifying the North Sun Chaozhi was made Inspector of Guang; Vice Director of the Masters of Writing on the Left and Inspector of Yang Wang Jingwen held the post of Inspector while also serving as Grand Master of the Palace Archives.',
    idiomatic:
      'On xinyou Chief Clerk of Pacifying the North Sun Chaozhi was appointed Inspector of Guang; Left Vice Director and Inspector of Yang Wang Jingwen retained the inspectorate while also serving as Grand Master of the Palace Archives.',
  },
  s0367: {
    literal:
      'On gengwu, Vice Director of the Masters of Writing on the Right Yuan Can was made Director; newly appointed Director of the Ministry of Personnel Chu Yuan was made Vice Director on the Right.',
    idiomatic:
      'On gengwu Right Vice Director Yuan Can was appointed Director of the Masters of Writing, and newly appointed Director of the Ministry of Personnel Chu Yuan Right Vice Director.',
  },
  s0368: {
    literal: '[32] On xinwei, Acting Inspector of Wu commandery Wang Sengqian was made acting Inspector of Xiang.',
    idiomatic:
      '[32] On xinwei Acting Inspector of Wu Wang Sengqian was appointed acting Inspector of Xiang.',
  },
  s0369: {
    literal: 'On bingxu, Prince Xiuyou of Jinping was posthumously stripped and reduced to commoner status.',
    idiomatic:
      'On bingxu Prince Xiuyou of Jinping was posthumously disgraced and reduced to commoner status.',
  },
  s0370: {
    literal:
      'In the sixth month, on dingyou, Grand General Who Campaigns South and Inspector of Jiang Prince Xiufan of Guiyang was made Grand General of Agile Cavalry and Inspector of Southern Xu; Grand General Who Campaigns North Prince Xiuruo of Baling was made General of Chariots and Cavalry and Inspector of Jiang.',
    idiomatic:
      'In the sixth month, on dingyou, Grand General Who Campaigns South and Inspector of Jiang Prince Xiufan of Guiyang was appointed Grand General of Agile Cavalry and Inspector of Southern Xu, and Grand General Who Campaigns North Prince Xiuruo of Baling General of Chariots and Cavalry and Inspector of Jiang.',
  },
  s0371: {
    literal: 'On jiachen, the Rouran state sent envoys presenting local products.',
    idiomatic: 'On jiachen the Rouran sent envoys bearing tribute.',
  },
  s0372: {
    literal: 'In autumn, the seventh month, on dingsi, the policy recommenders of the Scattered Cavalry were abolished.',
    idiomatic:
      'In the seventh month of autumn, on dingsi, the Scattered Cavalry recommendation officers were abolished.',
  },
  s0373: {
    literal:
      'On yichou, newly appointed General of Chariots and Cavalry and Inspector of Jiang Prince Xiuruo of Baling died; Prince Xiufan of Guiyang, newly appointed Grand General of Agile Cavalry, returned to Jiang.',
    idiomatic:
      'On yichou newly appointed General of Chariots and Cavalry and Inspector of Jiang Prince Xiuruo of Baling died; Prince Xiufan of Guiyang, newly made Grand General of Agile Cavalry, returned to Jiang.',
  },
  s0374: {
    literal: 'On gengwu, the third prince, Zhun, was made General Who Comforts the Army.',
    idiomatic: 'On gengwu the third prince Zhun was appointed General Who Comforts the Army.',
  },
  s0375: {
    literal: 'On xinwei, Grand Mentor of the Heir Apparent Liu Bing was made Inspector of Southern Xu.',
    idiomatic:
      'On xinwei Grand Mentor of the Heir Apparent Liu Bing was appointed Inspector of Southern Xu.',
  },
  s0376: {
    literal: 'On wuyin, General Who Pacifies the North Shen Huaiming was made Inspector of Southern Yan.',
    idiomatic:
      'On wuyin General Who Pacifies the North Shen Huaiming was appointed Inspector of Southern Yan.',
  },
  s0377: {
    literal: 'On yiyou, Xihai commandery was established within Ji.',
    idiomatic: 'On yiyou Xihai commandery was created within Ji.',
  },
  s0378: {
    literal:
      'In the eighth month, on wuzi, the eighth prince Ji succeeded Literary and Illustrious Prince Yigong of Jiangxia.',
    idiomatic:
      'In the eighth month, on wuzi, the eighth prince Ji was made heir to Literary and Illustrious Prince Yigong of Jiangxia.',
  },
  s0379: {
    literal: 'On gengyin, because the Emperor\'s illness had improved, a general amnesty was proclaimed throughout the realm.',
    idiomatic: 'On gengyin, because the Emperor had recovered, a general amnesty was proclaimed.',
  },
  s0380: {
    literal: 'Inspector of Ji Liu Chongzhi was given the additional post of Inspector of Qing.',
    idiomatic: 'Inspector of Ji Liu Chongzhi was also made Inspector of Qing.',
  },
  s0381: {
    literal: 'On wuxu, the third prince Zhun was established as Prince of Ancheng.',
    idiomatic: 'On wuxu the third prince Zhun was enfeoffed as Prince of Ancheng.',
  },
  s0382: {
    literal: 'In the ninth month, on xinwei, Colonel of the Rapid Cavalry Zhou Ningmin was made Inspector of Xu.',
    idiomatic:
      'In the ninth month, on xinwei, Colonel of the Rapid Cavalry Zhou Ningmin was appointed Inspector of Xu.',
  },
  s0383: {
    literal:
      'In winter, the eleventh month, on wuwu, [33] the state of Paekche sent envoys presenting local products.',
    idiomatic: 'In the eleventh month of winter, on wuwu, [33] Paekche sent envoys bearing tribute.',
  },
  s0384: {
    literal:
      'In the twelfth month, on dingyou, Southern Yu was established by partitioning Yu and Southern Yan; Administrator of Liyang Wang Xuanzai was made Inspector of Southern Yu.',
    idiomatic:
      'In the twelfth month, on dingyou, Southern Yu was carved out of Yu and Southern Yan; Administrator of Liyang Wang Xuanzai was appointed its inspector.',
  },
  s0385: {
    literal:
      'In the first year of Taiyu, spring, first month, on jiayin, first day of new moon, the Emperor was ill and did not hold court.',
    idiomatic:
      'In the first year of Taiyu, on jiayin, the first day of the first month of spring, the Emperor was ill and did not hold court.',
  },
  s0386: {
    literal: 'Because his illness had not yet healed, the reign title was changed.',
    idiomatic: 'Because his illness had not yet healed, the reign era was changed.',
  },
  s0387: {
    literal: 'The orphaned, aged, poor, and sick were granted grain and cloth in graded amounts.',
    idiomatic: 'The orphaned, aged, poor, and sick received grain and cloth in graded gifts.',
  },
  s0388: {
    literal:
      'On wuwu, the Heir Apparent received the tribute of the myriad states in the Eastern Palace and accepted the tribute tallies as well.',
    idiomatic:
      'On wuwu the Heir Apparent received the tribute of the myriad states at the Eastern Palace and took charge of the tribute accounts.',
  },
  s0389: {
    literal: 'In the second month, on xinchou, Bearer of the Gilded Gate Wang Zhan was made Inspector of Si.',
    idiomatic: 'In the second month, on xinchou, Bearer of the Gilded Gate Wang Zhan was appointed Inspector of Si.',
  },
  s0390: {
    literal:
      'In the third month, on guichou, first day of new moon, the state of Linyi sent envoys presenting local products.',
    idiomatic:
      'In the third month, on guichou, the first day of the month, Linyi sent envoys bearing tribute.',
  },
  s0391: {
    literal: 'On jiwei, Grand Master of the Palace Archives and Inspector of Yang Wang Jingwen died.',
    idiomatic: 'On jiwei Grand Master of the Palace Archives and Inspector of Yang Wang Jingwen died.',
  },
  s0392: {
    literal: 'In summer, the fourth month, on xinmao, Army Major of the Comforting Army Cai Na was made Inspector of Yi.',
    idiomatic:
      'In the fourth month of summer, on xinmao, Army Major of the Comforting Army Cai Na was appointed Inspector of Yi.',
  },
  s0393: {
    literal: 'On guisi, General of the Right Guard Zhang Xingshi was made Inspector of Yong.',
    idiomatic: 'On guisi General of the Right Guard Zhang Xingshi was appointed Inspector of Yong.',
  },
  s0394: {
    literal: '[34] On jihai, the Emperor\'s illness grew critical.',
    idiomatic: '[34] On jihai the Emperor\'s illness turned critical.',
  },
  s0395: {
    literal:
      'Grand General of Agile Cavalry and Inspector of Jiang Prince Xiufan of Guiyang was advanced to Minister of Works; Vice Director of the Masters of Writing on the Right Chu Yuan was made General Who Protects the Army; Colonel of the Garrison Liu Kan was given the additional post of Vice Director on the Right; General Who Pacifies the East Cai Xingzong was made General Who Campaigns West, Establishing-Ceremony Equal to the Three Dukes, and Inspector of Jing; General Who Guards the Army and Inspector of Ying Shen Youzhi was promoted to Pacifying West General.',
    idiomatic:
      'Grand General of Agile Cavalry and Inspector of Jiang Prince Xiufan of Guiyang was promoted to Minister of Works; Right Vice Director Chu Yuan was made General Who Protects the Army; Colonel of the Garrison Liu Kan was also made Right Vice Director; General Who Pacifies the East Cai Xingzong was appointed General Who Campaigns West, Establishing-Ceremony Equal to the Three Dukes, and Inspector of Jing; and General Who Guards the Army and Inspector of Ying Shen Youzhi Pacifying West General.',
  },
  s0396: {
    literal:
      'An edict said: "Since I took the throne over the multitude, we have still met with armed enemies; though I have always held to broad transformation, favor has not spread far, the army and state are exhausted, and lawsuits have not ceased.',
    idiomatic:
      'An edict said: "Since I ascended the throne to rule the myriad people, we have still faced armed enemies; though I have always sought broad reform, grace has not reached far, the army and state are exhausted, and lawsuits have not ceased.',
  },
  s0397: {
    literal: 'Now my illness grows grave and dangerous, and I am filled with deep compassionate sighing.',
    idiomatic: 'Now my illness grows grave, and I am filled with deep compassionate sorrow.',
  },
  s0398: {
    literal: 'Let corvée be eased and levies be lightened; cast off complexity and pursue simplicity.',
    idiomatic: 'Ease corvée and lighten levies; cast off complexity and pursue simplicity.',
  },
  s0399: {
    literal: 'According to what reform requires, give detailed and measured selection.',
    idiomatic: 'According to what reform requires, choose measures with careful judgment.',
  },
  s0400: {
    literal: 'Take cherishing the people as the foremost duty, to proclaim my final intent.',
    idiomatic: 'Make cherishing the people the foremost duty, and proclaim my final intent.',
  },
};

if (!fs.existsSync(path)) {
  console.error(
    `Missing ${path}. Extract batch 4 first, e.g. make start-translation BOOK=songshu CHAPTER=008`,
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const ids = Object.keys(T);
const present = new Set(data.sentences.map((s) => s.id));
const missing = ids.filter((id) => !present.has(id));
if (missing.length) {
  console.error(
    `Missing sentence IDs in ${path}: ${missing.join(', ')}. Extract batch 4 before running this script.`,
  );
  process.exit(1);
}

for (const s of data.sentences) {
  const t = T[s.id];
  if (!t) continue;
  s.literal = t.literal;
  s.idiomatic = t.idiomatic;
}

fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Filled', ids.length, 'sentences (s0301–s0400)');
