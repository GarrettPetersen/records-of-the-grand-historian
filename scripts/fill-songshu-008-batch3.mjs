#!/usr/bin/env node
import fs from 'node:fs';

const path = 'translations/current_translation_songshu.json';

const T = {
  s0201: {
    literal:
      'Those with civil and military capacity were selected and employed according to their talents.',
    idiomatic:
      'Men of civil or military talent were appointed according to their ability.',
  },
  s0202: {
    literal:
      '" On xinwei, newly appointed Inspector of Guang Liu Qin was made Inspector of Yi; Fei Hun, former Administrator of the two commanderies of Baxi and Zitong, was made Inspector of Guang.',
    idiomatic:
      '" On xinwei newly appointed Inspector of Guang Liu Qin was transferred to Yi, and Fei Hun, former Administrator of Baxi and Zitong, was made Inspector of Guang.',
  },
  s0203: {
    literal: 'Liu Qin captured Shouyang; Yuzhou was pacified.',
    idiomatic: 'Liu Qin took Shouyang and pacified Yuzhou.',
  },
  s0204: {
    literal:
      'On xinsi, Assistant State General Liu Lingyi was made Inspector of the two provinces of Liang and Southern Qin.',
    idiomatic:
      'On xinsi Assistant State General Liu Lingyi was appointed Inspector of Liang and Southern Qin.',
  },
  s0205: {
    literal:
      '[12] Xue Andu was about to summon the Suo barbarians; Zhang Yong and Shen Youzhi suffered great defeat, and thereby the four prefectures north of the Huai and the lands west of the Huai in Yuzhou were lost.',
    idiomatic:
      '[12] Xue Andu was on the point of bringing in the Northern Wei; Zhang Yong and Shen Youzhi were utterly defeated, and the court lost the four Huai-north prefectures and the western Huai region of Yuzhou.',
  },
  s0206: {
    literal:
      'In the third year, spring, first month, on gengzi, because agricultural labor was about to begin, the Imperial Butcher stopped slaughtering cattle.',
    idiomatic:
      'In the third year, on gengzi in the first month of spring, because the farming season was approaching, the Imperial Butcher ceased slaughtering cattle.',
  },
  s0207: {
    literal: 'On guimao, a partial amnesty was granted to the two provinces of Yu and Southern Yu.',
    idiomatic: 'On guimao Yu and Southern Yu received a partial amnesty.',
  },
  s0208: {
    literal:
      'Defender General Prince Xiuruo of Baling was demoted in title to General Who Pacifies the West.',
    idiomatic:
      'Defender General Prince Xiuruo of Baling was reduced in rank to General Who Pacifies the West.',
  },
  s0209: {
    literal:
      'On gengwu in the intercalary month, the capital had great rain and snow; envoys were dispatched to tour and inspect, with relief gifts apportioned by rank.',
    idiomatic:
      'On gengwu in the intercalary month heavy rain and snow struck the capital; the court sent envoys on inspection tours and distributed relief in graded amounts.',
  },
  s0210: {
    literal: 'On wuyin, Mobile Corps General Yuan Hong was made Inspector of Yi.',
    idiomatic: 'On wuyin Mobile Corps General Yuan Hong was appointed Inspector of Yi.',
  },
  s0211: {
    literal:
      '[13] On Mobile Corps General Yuan Hong as Inspector of Yi: in all editions "Yuan Hong" reads "Yuan Lang." Zhang Senkai\'s Collation Notes says: "Yuan Lang had already been killed by Prince Dan of Jingling in the third year of Daming, as seen in the biography of Yuan Huizhi. This should read Yuan Hong." The correction follows Zhang\'s argument.',
    idiomatic:
      '[13] All editions give "Yuan Lang" instead of "Yuan Hong" for Inspector of Yi; Zhang Senkai notes that Yuan Lang was killed in Daming year 3 (see Yuan Huizhi\'s biography), so the name should be Yuan Hong.',
  },
  s0212: {
    literal: 'In the second month, on jiashen, Censor-in-Chief Yang Xi was made Inspector of Guang.',
    idiomatic: 'In the second month, on jiashen, Censor-in-Chief Yang Xi was appointed Inspector of Guang.',
  },
  s0213: {
    literal: '[14] That day, the imperial carriage held mourning for officers and soldiers killed in battle.',
    idiomatic:
      '[14] That same day the Emperor led mourning for officers and soldiers slain in battle.',
  },
  s0214: {
    literal:
      'On jichou, Chief Administrator Liu Liang of the Pacifying West army was made Inspector of Liang and Southern Qin.',
    idiomatic:
      'On jichou Pacifying-West Chief Administrator Liu Liang was made Inspector of Liang and Southern Qin.',
  },
  s0215: {
    literal: 'The Suo barbarians raided Ruyin; Administrator Zhang Jingyuan defeated them.',
    idiomatic: 'The Northern Wei raided Ruyin; Administrator Zhang Jingyuan repelled them.',
  },
  s0216: {
    literal: 'On bingshen, a partial amnesty was granted to Qing and Ji.',
    idiomatic: 'On bingshen Qing and Ji received a partial amnesty.',
  },
  s0217: {
    literal:
      'On bingzi in the third month, Left Vice Director of the Masters of Writing Cai Xingzong was made General Who Pacifies the West and Inspector of Ying.',
    idiomatic:
      'On bingzi in the third month Left Vice Director Cai Xingzong was appointed General Who Pacifies the West and Inspector of Ying.',
  },
  s0218: {
    literal:
      'On wuyin, Champion General Wang Xuandai was made Inspector of Xu; Pacifying North General Cui Ping was made Inspector of Yan.',
    idiomatic:
      'On wuyin Champion General Wang Xuandai was made Inspector of Xu, and Pacifying North General Cui Ping was made Inspector of Yan.',
  },
  s0219: {
    literal:
      'In summer, the fourth month, on guisi, former Inspector of Si Zheng Hei was made Inspector of Si.',
    idiomatic:
      'In the fourth month of summer, on guisi, former Inspector of Si Zheng Hei was reappointed Inspector of Si.',
  },
  s0220: {
    literal:
      'On yiwei, Champion General and Inspector of Northern Qin Yang Sengsi was promoted to General Who Pacifies the West.',
    idiomatic:
      'On yiwei Champion General and Inspector of Northern Qin Yang Sengsi was promoted to General Who Pacifies the West.',
  },
  s0221: {
    literal:
      'On gengzi, Desi, second son of Prince Xiufan of Guiyang, was established as Prince of Luling; Miao, second son of Attendant-in-Ordinary Liu Yun, was established as Prince of Nanfeng.',
    idiomatic:
      'On gengzi Desi, second son of Prince Xiufan of Guiyang, was enfeoffed as Prince of Luling, and Miao, second son of Attendant-in-Ordinary Liu Yun, as Prince of Nanfeng.',
  },
  s0222: {
    literal:
      'On bingwu, General Who Pacifies the West Cai Xingzong was demoted in title to General Who Levels the West.',
    idiomatic:
      'On bingwu General Who Pacifies the West Cai Xingzong was reduced in rank to General Who Levels the West.',
  },
  s0223: {
    literal:
      'On bingchen in the fifth month, for those whose burial mounds within the forbidden precinct of Empress Dowager Chong\'s Chongning Mausoleum had to be moved, funeral expenses were granted and household corvée was remitted.',
    idiomatic:
      'On bingchen in the fifth month, families obliged to relocate tombs within the precinct of Empress Dowager Chong\'s Chongning Mausoleum received funeral subsidies and exemption from corvée.',
  },
  s0224: {
    literal:
      'On wuwu, General of Chariots and Cavalry and Inspector of Southern Yu Wang Xuamo was made Left Honored Grandee with an office equal in ceremonial honor to the Three Dukes.',
    idiomatic:
      'On wuwu General of Chariots and Cavalry and Inspector of Southern Yu Wang Xuamo was appointed Left Honored Grandee with protocol equal to a three-division office.',
  },
  s0225: {
    literal: 'On xinyou, Southern Yuzhou was abolished and merged into Yuzhou.',
    idiomatic: 'On xinyou Southern Yuzhou was abolished and annexed to Yuzhou.',
  },
  s0226: {
    literal: 'On renxu, Grand Mentor of the Heir Apparent Yuan Can was made Vice Director of the Masters of Writing.',
    idiomatic: 'On renxu Heir Apparent Grand Mentor Yuan Can was appointed Vice Director of the Masters of Writing.',
  },
  s0227: {
    literal: 'On yiyou in the sixth month, Attendant-in-Ordinary Liu Yun was made Inspector of Xiang.',
    idiomatic: 'On yiyou in the sixth month Attendant-in-Ordinary Liu Yun was made Inspector of Xiang.',
  },
  s0228: {
    literal:
      'On renzi in autumn, the seventh month, Left Honored Grandee with an office equal to the Three Dukes Wang Xuamo was made Special Grand Master, Left Honored Grandee, and General Who Protects the Army.',
    idiomatic:
      'On renzi in the seventh month of autumn Wang Xuamo, Left Honored Grandee with protocol equal to a three-division office, was made Special Grand Master, Left Honored Grandee, and General Who Protects the Army.',
  },
  s0229: {
    literal:
      'Boling, son of Xue Andu, seized the four commanderies of Yong; Inspector Prince Xiuruo of Baling attacked and beheaded him.',
    idiomatic:
      'Xue Andu\'s son Boling seized four Yong commanderies; Inspector Prince Xiuruo of Baling attacked and executed him.',
  },
  s0230: {
    literal:
      'On dingyou in the eighth month, an edict said: "In antiquity the balance and the basket were set in place, and even ants and larvae were not gathered;',
    idiomatic:
      'On dingyou in the eighth month an edict said: "In antiquity the state set balances and measuring baskets, and even ants and larvae were left ungathered;',
  },
  s0231: {
    literal: 'rivers and marshes produced their bounty, which was brought up for the imperial table.',
    idiomatic: 'rivers and marshes yielded their bounty for the imperial table alone.',
  },
  s0232: {
    literal: 'thereby to enrich the people\'s wealth and nurture the virtue of sustaining life.',
    idiomatic: 'thus enriching the people and nurturing the virtue of sustaining life.',
  },
  s0233: {
    literal:
      'Recently merchants chase the secondary trades, competing to harvest early and vie for novelty, plucking fruit not yet ripe, seizing great families\' profits, caging wings unfit for food, making resources for toy children.',
    idiomatic:
      'Lately merchants chase profit, racing to pick fruit before it ripens, squeezing great houses for gain, trapping birds unfit for the kitchen, and turning them into children\'s playthings.',
  },
  s0234: {
    literal: 'How can this restore custom and honor the root, discard ornament and pursue substance?',
    idiomatic: 'How can that restore plain custom, honor the root, and cast off ornament for substance?',
  },
  s0235: {
    literal: 'It is fitting to cultivate the Way and spread benevolence to reform this corruption.',
    idiomatic: 'The court should cultivate the Way and spread benevolence to uproot this abuse.',
  },
  s0236: {
    literal:
      'From now on, scales, shells, feathers, delicacies, and all such products not harvestable in their proper season and not required for vessels and flavors may all be forbidden without exception, with strict statutes enacted."',
    idiomatic:
      'Henceforth scales, shells, feathers, delicacies, and every product not in season and not required for the imperial table are forbidden outright, under strict statutes."',
  },
  s0237: {
    literal:
      'On renyin, Colonel of the Garrison Shen Youzhi acted as Inspector of Southern Yan and led troops north on campaign.',
    idiomatic:
      'On renyin Colonel of the Garrison Shen Youzhi took up the post of Inspector of Southern Yan and marched north at the head of an army.',
  },
  s0238: {
    literal:
      'On guimao, an edict said: "The use of the legal net is enacted age by age; the path of lenient favor is spread according to the times.',
    idiomatic:
      'On guimao an edict said: "The legal net is tightened or loosened from age to age; lenient favor is dispensed as times require.',
  },
  s0239: {
    literal:
      'Moreover I honor virtue in quelling disorder and guide the people by benevolence; at each turn one should incline toward breadth and simplicity to elevate perfect governance.',
    idiomatic:
      'I seek to quell disorder through virtue and govern the people with benevolence; at every turn policy should lean toward breadth and simplicity to perfect the realm\'s order.',
  },
  s0240: {
    literal:
      'Yet we have repeatedly suffered warfare; corvée and levies have not ceased; soldiers and civilians practice cunning fraud, and improper undertakings are many; those who tread the law and enter the statutes are surely not of one category alone.',
    idiomatic:
      'Yet war has come again and again, corvée and taxes remain unpaid, soldiers and civilians resort to fraud, and improper acts multiply; those who fall under the statutes are far more than one sort of offender.',
  },
  s0241: {
    literal:
      'Some even borrow the name of the army, steal ranks in private houses, use battle dispersal and flight, and plead fear to escape service.',
    idiomatic:
      'Some borrow the army\'s name, steal office in private homes, scatter in defeat, and plead terror to evade service.',
  },
  s0242: {
    literal:
      'Moreover, though those who fled in past invasions have received repeated pardons, the bands still in hiding remain truly numerous.',
    idiomatic:
      'Though repeated amnesties have covered those who fled in past invasions, fugitives still abound.',
  },
  s0243: {
    literal: 'Night thoughts keep me long mindful; I am indeed filled with compassionate remorse.',
    idiomatic: 'Night after night I brood on this, heavy with compassionate remorse.',
  },
  s0244: {
    literal: 'I think how to spread supreme favor again and shower it over the realm.',
    idiomatic: 'I mean to spread supreme favor once more and shower it across the realm.',
  },
  s0245: {
    literal: 'A general amnesty may be proclaimed throughout the realm."',
    idiomatic: 'Let a general amnesty be proclaimed throughout the realm."',
  },
  s0246: {
    literal:
      'Wang Xuamo, newly appointed Left Honored Grandee, was given the additional title General of Chariots and Cavalry.',
    idiomatic:
      'Wang Xuamo, newly appointed Left Honored Grandee, was also made General of Chariots and Cavalry.',
  },
  s0247: {
    literal:
      'On bingwu, Director of the Ministry of Personnel Chu Yuan was sent to comfort and reward the generals along the Huai, with gifts measured to circumstances.',
    idiomatic:
      'On bingwu Director of the Ministry of Personnel Chu Yuan was dispatched to comfort the Huai-front commanders and reward them as circumstances warranted.',
  },
  s0248: {
    literal:
      'On wushen, newly appointed General of the Right Guard Liu Qin was made Inspector of Yu.',
    idiomatic:
      'On wushen newly appointed General of the Right Guard Liu Qin was made Inspector of Yu.',
  },
  s0249: {
    literal:
      'On guichou in the ninth month, Pacifying West General and Inspector of Yong Prince Xiuruo of Baling was promoted to Defender General; Leveling West General and Inspector of Ying Cai Xingzong was promoted to General Who Pacifies the West.',
    idiomatic:
      'On guichou in the ninth month Pacifying West General and Inspector of Yong Prince Xiuruo of Baling was promoted to Defender General, and Leveling West General and Inspector of Ying Cai Xingzong to General Who Pacifies the West.',
  },
  s0250: {
    literal: 'On yimao, Colonel of the Rapid Cavalry Zhou Ningmin was made Inspector of Yan.',
    idiomatic: 'On yimao Colonel of the Rapid Cavalry Zhou Ningmin was appointed Inspector of Yan.',
  },
  s0251: {
    literal:
      'On wuwu, a thousand suits of miscellaneous garments from the empress and the six palaces below her, and a thousand gold hairpins, were distributed to the northern campaign troops.',
    idiomatic:
      'On wuwu the empress and the six palaces below her bestowed a thousand suits of clothing and a thousand gold hairpins upon the northern campaign forces.',
  },
  s0252: {
    literal:
      'On gengshen, Forward General and concurrent Inspector of Ji Cui Daogu was promoted to General Who Pacifies the North.',
    idiomatic:
      'On gengshen Forward General and acting Inspector of Ji Cui Daogu was promoted to General Who Pacifies the North.',
  },
  s0253: {
    literal: 'On jiazi, a partial amnesty was granted to Xu, Yan, Qing, and Ji.',
    idiomatic: 'On jiazi Xu, Yan, Qing, and Ji received a partial amnesty.',
  },
  s0254: {
    literal: 'In winter, the tenth month, on renwu, Prince Yannian of Xin\'an was re-enfeoffed as Prince of Shiping.',
    idiomatic:
      'In the tenth month of winter, on renwu, Prince Yannian of Xin\'an was re-enfeoffed as Prince of Shiping.',
  },
  s0255: {
    literal: 'On wuzi, the Rouran state sent envoys presenting local products.',
    idiomatic: 'On wuzi the Rouran sent envoys bearing tribute.',
  },
  s0256: {
    literal: 'On xinchou, the public fields of commanderies and counties were restored.',
    idiomatic: 'On xinchou the public fields of commanderies and counties were restored.',
  },
  s0257: {
    literal:
      'Pacifying West Grand General and Inspector of Western Qin and He Tuyuhun Shibin was promoted to Grand General Who Pacifies the West.',
    idiomatic:
      'Pacifying West Grand General and Inspector of Western Qin and He Tuyuhun Shibin was promoted to Grand General Who Pacifies the West.',
  },
  s0258: {
    literal:
      'In the eleventh month, Boyou, second son of Prince Xiuren of Jian\'an, was established as Prince of Jiangxia; Prince Chang of Yiyang was re-enfeoffed as Prince of Jinxi.',
    idiomatic:
      'In the eleventh month Boyou, second son of Prince Xiuren of Jian\'an, was enfeoffed as Prince of Jiangxia, and Prince Chang of Yiyang was re-enfeoffed as Prince of Jinxi.',
  },
  s0259: {
    literal:
      'On yimao, Eastern Xuzhou was established by partitioning Xu; Assistant State General Zhang Dan was made its inspector.',
    idiomatic:
      'On yimao Eastern Xuzhou was carved out of Xu; Assistant State General Zhang Dan was appointed its inspector.',
  },
  s0260: {
    literal: 'The states of Koguryŏ and Paekche sent envoys presenting local products.',
    idiomatic: 'Koguryŏ and Paekche sent envoys bearing tribute.',
  },
  s0261: {
    literal: 'On gengchen in the twelfth month, Pacifying North General Liu Xiubin was made Inspector of Yan.',
    idiomatic:
      'On gengchen in the twelfth month Pacifying North General Liu Xiubin was appointed Inspector of Yan.',
  },
  s0262: {
    literal:
      'In the fourth year, spring, first month, on jiwei, the imperial carriage personally sacrificed at the Southern Altar and proclaimed a general amnesty throughout the realm.',
    idiomatic:
      'In the fourth year, on jiwei in the first month of spring, the Emperor sacrificed at the Southern Altar in person and proclaimed a general amnesty.',
  },
  s0263: {
    literal: 'On gengwu, Defender General Prince Xiuruo of Baling was demoted in title to Left General.',
    idiomatic: 'On gengwu Defender General Prince Xiuruo of Baling was reduced to Left General.',
  },
  s0264: {
    literal: 'On yihai, Chief Clerk Sima Shen of Lingling died.',
    idiomatic: 'On yihai Chief Clerk Sima Shen of Lingling died.',
  },
  s0265: {
    literal:
      'On xinchou in the second month, former Dragon-Charger General Chang Zhenqi was made Pacifying North General and Inspector of Si; Zhenqi\'s son Chaoyue was made Inspector of Northern Ji.',
    idiomatic:
      'On xinchou in the second month former Dragon-Charger General Chang Zhenqi was appointed Pacifying North General and Inspector of Si, and his son Chaoyue Inspector of Northern Ji.',
  },
  s0266: {
    literal:
      '[15] On yisi, Right Honored Grandee, General of Chariots and Cavalry, and General Who Protects the Army Wang Xuamo died.',
    idiomatic:
      '[15] On yisi Right Honored Grandee, General of Chariots and Cavalry, and General Who Protects the Army Wang Xuamo died.',
  },
  s0267: {
    literal:
      '[16] On Right Honored Grandee, General of Chariots and Cavalry, and General Who Protects the Army Wang Xuamo\'s death: the Sanzhao, Beijian, Mao, and Dian editions read "Right Honored Grandee"; the Bureau edition and Wang Xuamo\'s biography read "Left Honored Grandee."',
    idiomatic:
      '[16] For Wang Xuamo\'s death the Sanzhao, Beijian, Mao, and Dian editions read Right Honored Grandee; the Bureau edition and his biography read Left Honored Grandee.',
  },
  s0268: {
    literal:
      'On jiwei in the third month, [17] Mobile Corps General Liu Huaizhen was made Inspector of Eastern Xu.',
    idiomatic:
      'On jiwei in the third month, [17] Mobile Corps General Liu Huaizhen was appointed Inspector of Eastern Xu.',
  },
  s0269: {
    literal:
      'On wuchen, Army Chief Administrator Liu Lingyi was made Inspector of Liang and Southern Qin; [18] Administrator of Southern Qiao Sun Fengbo was made Inspector of Jiao; [19] the man of Jiao Li Changren seized the province in rebellion.',
    idiomatic:
      'On wuchen Army Chief Administrator Liu Lingyi was made Inspector of Liang and Southern Qin; [18] Southern Qiao Administrator Sun Fengbo was made Inspector of Jiao; [19] Li Changren of Jiao seized the province in revolt.',
  },
  s0270: {
    literal:
      'Demon rebels attacked Guang, killed Inspector Yang Xi, [20] and Dragon-Charger General Chen Bonian suppressed and pacified them.',
    idiomatic:
      'Rebel bandits attacked Guang, killed Inspector Yang Xi, [20] and Dragon-Charger General Chen Bonian put them down.',
  },
  s0271: {
    literal: 'On jimao in summer, the fourth month, the salary-fields of commanderies and counties were again reduced by half.',
    idiomatic:
      'On jimao in the fourth month of summer the salary-fields of commanderies and counties were again cut by half.',
  },
  s0272: {
    literal:
      '[21] On bingshen, Prince Yi of Donghai was re-enfeoffed as Prince of Lujiang; [22] Prince You of Shanyang was re-enfeoffed as Prince of Jinping; Jin\'an commandery was renamed Jinping commandery.',
    idiomatic:
      '[21] On bingshen Prince Yi of Donghai was re-enfeoffed as Prince of Lujiang; [22] Prince You of Shanyang as Prince of Jinping; and Jin\'an commandery was renamed Jinping.',
  },
  s0273: {
    literal:
      'On xinchou, the Rouran state and the King of Henan both sent envoys presenting local products.',
    idiomatic: 'On xinchou the Rouran and the King of Henan both sent envoys bearing tribute.',
  },
  s0274: {
    literal: 'On jiachen, Administrator of Yuzhang Zhang Bian was made Inspector of Guang.',
    idiomatic: 'On jiachen Administrator of Yuzhang Zhang Bian was appointed Inspector of Guang.',
  },
  s0275: {
    literal: 'On yisi in the fifth month, [23] a partial amnesty was granted to Guang.',
    idiomatic: 'On yisi in the fifth month, [23] Guang received a partial amnesty.',
  },
  s0276: {
    literal:
      'On guihai, Prince Xiuruo of Baling, acting Inspector of Yong, was made acting Inspector of Xiang; Administrator of Kuaiji Zhang Yong was made Inspector of Yong; Inspector of Xiang Liu Yun was made Inspector of Southern Yan.',
    idiomatic:
      'On guihai Prince Xiuruo of Baling, acting Inspector of Yong, was also made acting Inspector of Xiang; Kuaiji Administrator Zhang Yong was made Inspector of Yong; and Inspector of Xiang Liu Yun was transferred to Southern Yan.',
  },
  s0277: {
    literal: 'On wuzi in the eighth month, Chancellor of Nankang Liu Bo was made Inspector of Jiao.',
    idiomatic: 'On wuzi in the eighth month Chancellor of Nankang Liu Bo was appointed Inspector of Jiao.',
  },
  s0278: {
    literal:
      '[24] On xinmao, Eastern Qing was established by partitioning Qing; Assistant State General Shen Wenjing was made Inspector of Eastern Qing.',
    idiomatic:
      '[24] On xinmao Eastern Qing was carved out of Qing; Assistant State General Shen Wenjing was made its inspector.',
  },
  s0279: {
    literal:
      '[25] On dingyou, Pacifying South General and Inspector of Jiang Wang Jingwen was promoted to General Who Pacifies the South.',
    idiomatic:
      '[25] On dingyou Pacifying South General and Inspector of Jiang Wang Jingwen was promoted to General Who Pacifies the South.',
  },
  s0280: {
    literal: 'On bingchen in the ninth month, Chief Clerk of the Grand Marshal Who Pacifies the Cavalry Zhang Yue was made Inspector of Yong.',
    idiomatic:
      'On bingchen in the ninth month Chief Clerk of the Grand Marshal Who Pacifies the Cavalry Zhang Yue was appointed Inspector of Yong.',
  },
  s0281: {
    literal:
      'On wuchen, an edict said: "Faults have large and small degrees; punishments follow leniency or severity; therefore the five punishments differ in use and the three codes differ in application.',
    idiomatic:
      'On wuchen an edict said: "Offenses differ in gravity, and punishments in severity; hence the five punishments are not applied alike and the three codes are not enforced in one fashion.',
  },
  s0282: {
    literal:
      'Yet when lesser penalties are reduced, one arrives at shackling and flogging; seeking the matter in the legal articles, the gradations grow ever farther apart.',
    idiomatic:
      'Yet when lesser penalties are eased, the path still leads to shackles and the rod; measured against the code, the gradations grow remote.',
  },
  s0283: {
    literal: 'I strive to preserve reverent compassion and am always inclined to pardon.',
    idiomatic: 'I strive to govern with reverent compassion and am always ready to pardon.',
  },
  s0284: {
    literal:
      'Examining statutes on robbery, [26] light and heavy alike are classed with great execution; judging the matter by circumstance is not yet a detailed ruling.',
    idiomatic:
      'Under robbery statutes, [26] light and heavy cases alike are treated as capital offenses; judging each case on its merits is not yet a sufficient rule.',
  },
  s0285: {
    literal:
      'From now on, all who steal official weapons, resist patrol officers in battle, or raid posts and temples and harm clerks and people—every such article—shall follow the old statutes.',
    idiomatic:
      'Henceforth all who steal official arms, resist patrol officers, raid stations and temples, or harm officials and commoners shall be punished under the old statutes.',
  },
  s0286: {
    literal:
      'Those who rob one another in bands of five or fewer may specially be granted tattooing and mutilation and sent to the four distant regions; the substitute execution is still used—compared with antiquity this is lenient, sparing life and preserving households, a kindness equal to creation itself.',
    idiomatic:
      'Bands of five or fewer who rob one another may instead receive tattooing and mutilation and exile to the four distant regions; substitute execution still applies—a mercy, by ancient standards, that spares life and preserves households, a kindness like that of Heaven itself.',
  },
  s0287: {
    literal:
      'May the transformation of simplicity and favor reach the masses with sincerity, and the virtue of cherishing life leave no dark corner untouched."',
    idiomatic:
      'May plain mercy reach the people in truth, and the virtue of cherishing life touch even the least among them."',
  },
  s0288: {
    literal: 'On gengwu, a partial amnesty was granted to Yang, Southern Xu, Yan, and Yu.',
    idiomatic: 'On gengwu Yang, Southern Xu, Yan, and Yu received a partial amnesty.',
  },
  s0289: {
    literal: 'In winter, the tenth month, on guiyou, first day of new moon, there was a solar eclipse.',
    idiomatic:
      'In the tenth month of winter, on guiyou, the first day of the month, there was a solar eclipse.',
  },
  s0290: {
    literal: 'Troops from the various provinces were mobilized for the northern campaign.',
    idiomatic: 'Armies from the provinces were mobilized for the northern expedition.',
  },
  s0291: {
    literal:
      'The four commanderies of Nankang, Jian\'an, Ancheng, and Xuancheng had never joined the southern rebellion and were all excluded from the levy.',
    idiomatic:
      'Nankang, Jian\'an, Ancheng, and Xuancheng had never joined the southern rebellion and were exempted from the draft.',
  },
  s0292: {
    literal: 'On jiaxu, Yixing commandery in Yangzhou was detached and placed under Southern Xu.',
    idiomatic: 'On jiaxu Yixing commandery in Yangzhou was transferred to Southern Xu.',
  },
  s0293: {
    literal:
      'In the fifth year, spring, first month, on guihai, the imperial carriage personally plowed the sacred field.',
    idiomatic:
      'In the fifth year, on guihai in the first month of spring, the Emperor plowed the sacred field in person.',
  },
  s0294: {
    literal: 'A general amnesty was proclaimed throughout the realm; those diligent in farming were granted one rank of nobility.',
    idiomatic:
      'A general amnesty was proclaimed, and diligent farmers were granted one noble rank.',
  },
  s0295: {
    literal:
      'On bingshen in the second month, Southern Yuzhou was established by partitioning Yu and Yang; Grand Minister of Works Prince Yi of Lujiang was made General of Chariots and Cavalry with an office equal to the Three Dukes and Inspector of Southern Yu.',
    idiomatic:
      'On bingshen in the second month Southern Yuzhou was carved out of Yu and Yang; Grand Minister of Works Prince Yi of Lujiang was appointed General of Chariots and Cavalry with protocol equal to a three-division office and Inspector of Southern Yu.',
  },
  s0296: {
    literal: 'On yimao in the third month, Southern Yiyang commandery was established within Southern Yu.',
    idiomatic: 'On yimao in the third month Southern Yiyang commandery was created within Southern Yu.',
  },
  s0297: {
    literal: 'On bingyin, the imperial carriage visited the Central Hall to hear lawsuits.',
    idiomatic: 'On bingyin the Emperor visited the Central Hall to hear lawsuits in person.',
  },
  s0298: {
    literal: 'On jisi, the King of Henan sent envoys presenting local products.',
    idiomatic: 'On jisi the King of Henan sent envoys bearing tribute.',
  },
  s0299: {
    literal: 'On xinwei in summer, the fourth month, Suicheng in Yong was detached and placed under Ying.',
    idiomatic: 'On xinwei in the fourth month of summer Suicheng in Yong was transferred to Ying.',
  },
  s0300: {
    literal:
      'On yiyou, Yiyang commandery in Yu was detached and placed under Ying; Xiyang commandery in Ying was placed under Yu.',
    idiomatic:
      'On yiyou Yiyang in Yu was transferred to Ying, and Xiyang in Ying was transferred to Yu.',
  },
};

if (!fs.existsSync(path)) {
  console.error(
    `Missing ${path}. Extract batch 3 first, e.g. make start-translation BOOK=songshu CHAPTER=008`,
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const ids = Object.keys(T);
const present = new Set(data.sentences.map((s) => s.id));
const missing = ids.filter((id) => !present.has(id));
if (missing.length) {
  console.error(
    `Missing sentence IDs in ${path}: ${missing.join(', ')}. Extract batch 3 before running this script.`,
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
console.log('Filled', ids.length, 'sentences (s0201–s0300)');
