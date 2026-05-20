#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0101: {
    literal:
      'On wuchen, the Sui emperor advanced Gaozu to Chancellor, charged him with all government affairs, and equipped him with the rites of the Nine Bestowals.',
    idiomatic:
      'On wuchen the Sui emperor promoted Gaozu to Chancellor, put all state affairs in his hands, and granted him the full rites of the Nine Bestowals.',
  },
  s0102: {
    literal:
      'The Tang state established offices from Chancellor downward, and set up four ancestral temples from Imperial Grandfather downward at the Tongyi Lane residence in Chang\'an.',
    idiomatic:
      'The Tang regime created offices from chancellor down and established four ancestral temples—from Imperial Grandfather on—at the family estate in Tongyi Lane, Chang\'an.',
  },
  s0103: {
    literal:
      'In the fourth month, on xinmao, bamboo envoy tallies were discontinued and silver rabbit tallies were issued to the commanderies.',
    idiomatic:
      'In the fourth month, on xinmao, bamboo envoy tallies were abolished and silver rabbit tallies distributed to the commanderies.',
  },
  s0104: {
    literal:
      'On wuxu, Heir Jiancheng and Taizong returned victorious from the eastern capital.',
    idiomatic:
      'On wuxu the heir Jiancheng and Taizong led their armies back in triumph from the eastern capital.',
  },
  s0105: {
    literal:
      'On yisi of the fifth month, the Son of Heaven decreed that Gaozu wear a twelve-tassel crown, raise the imperial banner, and have the route cleared on going out and coming in.',
    idiomatic:
      'On yisi in the fifth month the Son of Heaven decreed that Gaozu might wear a twelve-tassel crown, raise the imperial standard, and travel with full imperial escort.',
  },
  s0106: {
    literal:
      'The titles for queen and princesses all followed the old statutes.',
    idiomatic:
      'Titles for the queen and imperial daughters followed the former regulations.',
  },
  s0107: {
    literal: 'On wuwu, the Sui emperor issued an edict stating:',
    idiomatic: 'On wuwu the Sui emperor promulgated an edict:',
  },
  s0108: {
    literal:
      'He sent Commissioner Xiao Zao—concurrent Grand Tutor, Minister of Punishments, and Duke of Liang—and Commissioner Pei Zhiyin, Vice Director of the Court of the Imperial Granaries, to present the imperial seal and cord to Gaozu.',
    idiomatic:
      'He dispatched envoys holding the staff of authority: Xiao Zao, concurrent Grand Tutor and Minister of Punishments, Duke of Liang, and Pei Zhiyin of the Court of the Imperial Granaries, to deliver the imperial seal and cord to Gaozu.',
  },
  s0109: {
    literal:
      'Gaozu declined; the hundred officials submitted memorials urging him to accept, again and again; only on the third round did he consent.',
    idiomatic:
      'Gaozu refused. The officials memorialized again and again urging him to take the throne; only after repeated pleas did he yield.',
  },
  s0110: {
    literal: 'The Sui emperor retired to the old residence.',
    idiomatic: 'The Sui emperor withdrew to his former palace.',
  },
  s0111: {
    literal: 'Daxing Hall was renamed Taiji Hall.',
    idiomatic: 'Daxing Hall was renamed the Hall of Supreme Pole.',
  },
  s0112: {
    literal:
      'On jiazi, Gaozu took the imperial throne in Taiji Hall, ordered Minister of Punishments Xiao Zao, concurrent Grand Commandant, to announce at the southern suburbs, proclaimed a general amnesty, and changed Sui Yining year 2 to Tang Wude year 1.',
    idiomatic:
      'On jiazi Gaozu ascended the throne in Taiji Hall, had Xiao Zao announce the mandate at the southern altar, proclaimed a general amnesty, and changed the era from Sui Yining 2 to Tang Wude 1.',
  },
  s0113: {
    literal: 'Officials and commoners were each granted one rank of nobility.',
    idiomatic: 'Every official and commoner was granted one step in noble rank.',
  },
  s0114: {
    literal: 'Where the righteous army had passed, remission was granted for three years.',
    idiomatic: 'Every district the righteous army had traversed received three years of tax relief.',
  },
  s0115: {
    literal: 'Commanderies were abolished and prefectures established; grand administrators were renamed prefects.',
    idiomatic: 'Commanderies were abolished in favor of prefectures, and grand administrators became prefects.',
  },
  s0116: {
    literal:
      'On dingmao he feasted the hundred officials in Taiji Hall and bestowed silk in graded amounts.',
    idiomatic:
      'On dingmao he held a feast for the court in Taiji Hall and distributed silk according to rank.',
  },
  s0117: {
    literal:
      'The officials left to guard the eastern capital jointly installed Sui Prince Yue Tong as emperor.',
    idiomatic:
      'The officials holding the eastern capital together enthroned the Sui Prince of Yue, Yang Tong.',
  },
  s0118: {
    literal:
      'On renshen he ordered Grand Chancellor Chief Clerk Pei Ji and others to revise statutes and ordinances.',
    idiomatic:
      'On renshen he charged Pei Ji, chief clerk of the grand chancellery, and others with revising the law code.',
  },
  s0119: {
    literal:
      'On jiaxu of the sixth month, Taizong became Director of the Department of State Affairs; Grand Chancellor Chief Clerk Pei Ji became Right Vice Director; Grand Chancellor Marshal Liu Wenjing became Censor-in-Chief; Sui Minister of Revenue Xiao Yu and Grand Chancellor Registrar Dou Wei both became Directors of the Palace Secretariat.',
    idiomatic:
      'On jiaxu in the sixth month Taizong was made Director of the Department of State Affairs; Pei Ji became Right Vice Director; Liu Wenjing, Censor-in-Chief; and Xiao Yu and Dou Wei both Directors of the Palace Secretariat.',
  },
  s0120: {
    literal: 'The Sui Daye statutes and ordinances were abolished and new administrative rules promulgated.',
    idiomatic: 'The Sui Daye legal code was repealed and a new set of regulations issued.',
  },
  s0121: {
    literal:
      'On jimao, with full imperial equipage they welcomed the spirit tablets of Imperial Grandfather Xuanjian and below to be enshrined in the imperial temple.',
    idiomatic:
      'On jimao, with full imperial ceremony, they brought the spirit tablets of Imperial Grandfather Xuanjian and his successors to the imperial ancestral temple.',
  },
  s0122: {
    literal:
      'Consort Dou was posthumously honored as Grand Empress Zhaomu; her tomb was called Shou\'an.',
    idiomatic:
      'Consort Dou was posthumously titled Grand Empress Zhaomu and buried at Shou\'an.',
  },
  s0123: {
    literal: 'On gengchen the heir Jiancheng was established as crown prince.',
    idiomatic: 'On gengchen Jiancheng was installed as crown prince.',
  },
  s0124: {
    literal:
      'Taizong was enfeoffed as Prince of Qin; Prince of Qi Yuanji as Prince of Qi.',
    idiomatic:
      'Taizong was created Prince of Qin and Yuanji Prince of Qi.',
  },
  s0125: {
    literal:
      'Among the imperial clan, Duke of Shu Xiaoji was made Prince of Yong\'an; Pillar Duke Daoxuan Prince of Huaiyang; Duke of Changping Shuliang Prince of Changping; Duke of Zheng Shitong Prince of Yongkang; Duke of Anji Shenfu Prince of Xiangyi; Pillar Duke Deliang Prince of Changle; Upper Opener Daosu Prince of Jingling; Upper Pillar Duke Boyi Prince of Longxi; Fengci Prince of Bohai.',
    idiomatic:
      'The clan was enfeoffed: Xiaoji as Prince of Yong\'an, Daoxuan as Prince of Huaiyang, Shuliang as Prince of Changping, Shitong as Prince of Yongkang, Shenfu as Prince of Xiangyi, Deliang as Prince of Changle, Daosu as Prince of Jingling, Boyi as Prince of Longxi, and Fengci as Prince of Bohai.',
  },
  s0126: {
    literal: 'Military commissioners of the commanderies were given the additional title commissioner holding the staff.',
    idiomatic: 'Prefectural military commissioners were granted the added title of commissioner holding the staff of authority.',
  },
  s0127: {
    literal: 'On guimao the Sui emperor was enfeoffed as Duke of Xi.',
    idiomatic: 'On guimao the former Sui emperor was created Duke of Xi.',
  },
  s0128: {
    literal:
      'Xue Ju raided Jingzhou; the Prince of Qin was ordered supreme commander of the western campaign to attack him.',
    idiomatic:
      'Xue Ju raided Jing Prefecture; the Prince of Qin was appointed supreme commander of the western expedition against him.',
  },
  s0129: {
    literal: 'Prince of Yongkang Shitong was changed to Prince of Huai\'an.',
    idiomatic: 'Prince of Yongkang Shitong was retitled Prince of Huai\'an.',
  },
  s0130: {
    literal:
      'On renchen the Prince of Qin was additionally made Governor of Yongzhou; his other posts were unchanged.',
    idiomatic:
      'On renchen the Prince of Qin was also appointed Governor of Yongzhou, retaining his other offices.',
  },
  s0131: {
    literal: 'On xinchou Inner Affairs Director Dou Wei died.',
    idiomatic: 'On xinchou Dou Wei, Director of the Palace Secretariat, died.',
  },
  s0132: {
    literal:
      'In the seventh month of autumn, on bingwu, Minister of Punishments Xiao Zao became Grand Tutor of the Crown Prince.',
    idiomatic:
      'In the seventh month of autumn, on bingwu, Xiao Zao was appointed Grand Tutor to the crown prince.',
  },
  s0133: {
    literal: 'Prince Xuanba was posthumously enfeoffed as Prince of Wei.',
    idiomatic: 'The deceased Prince Xuanba was posthumously created Prince of Wei.',
  },
  s0134: {
    literal: 'The Western Göktürks sent envoys to submit.',
    idiomatic: 'The Western Turks sent envoys to swear allegiance.',
  },
  s0135: {
    literal:
      'The Prince of Qin fought a great battle with Xue Ju at Jingzhou; our army suffered defeat.',
    idiomatic:
      'The Prince of Qin met Xue Ju in a great battle at Jingzhou and was defeated.',
  },
  s0136: {
    literal:
      'On renwu in the eighth month, Xue Ju died; his son Ren Gao again presumptuously declared himself emperor; the Prince of Qin was appointed supreme commander to attack him.',
    idiomatic:
      'On renwu in the eighth month Xue Ju died. His son Ren Gao again proclaimed himself emperor, and the Prince of Qin was named supreme commander to crush him.',
  },
  s0137: {
    literal:
      'On dinghai an edict stated: "Sui Grand Master of Splendid Happiness Gao Jiong and Upper Pillar Duke He Ruobi both held to their integrity and would not bow; they straightened what was crooked and would not be bent."',
    idiomatic:
      'On dinghai an edict read: "Gao Jiong, Grand Master of Splendid Happiness under the Sui, and He Ruobi, Upper Pillar Duke, were men of unbending integrity who refused to yield and would not be turned aside."',
  },
  s0138: {
    literal:
      'Supervisor of the Capital Xue Daoheng, Minister of Punishments Yuwen Bi, and Left Yiji Guard General Dong Chun all cherished loyalty and embraced righteousness, yet suffered the extreme penalty: they should receive posthumous honors to comfort them in the grave.',
    idiomatic:
      '"Xue Daoheng, Supervisor of the Capital, Yuwen Bi, Minister of Punishments, and Dong Chun, general of the Left Yiji Guard, were loyal men who died unjustly—the court should honor them and ease their spirits below."',
  },
  s0139: {
    literal:
      'Jiong was posthumously granted Upper Pillar Duke and Duke of Tan; Bi was posthumously granted Upper Pillar Duke and Duke of Qi; each was to receive a posthumous title from the relevant office.',
    idiomatic:
      'Jiong was posthumously made Upper Pillar Duke and Duke of Tan; Bi Upper Pillar Duke and Duke of Qi; the proper offices were to assign their posthumous names.',
  },
  s0140: {
    literal:
      'Daoheng was granted Upper Opener and Duke of Linhe; Bi was granted Upper Opener and Duke of Pingchang; Chun was granted Pillar Duke and Duke of Didao."',
    idiomatic:
      'Daoheng was raised to Upper Opener and Duke of Linhe; Bi to Upper Opener and Duke of Pingchang; and Chun to Pillar Duke and Duke of Didao."',
  },
  s0141: {
    literal:
      '" Another edict stated: "Sui Right Valiant Cavalry Grand General Li Jincai and Left Grand Master of Splendid Happiness Li Min were both of eminent houses and hereditary merit, yet were slaughtered without cause; court and countryside alike called it injustice.',
    idiomatic:
      'Another edict declared: "Li Jincai, Sui Right Valiant Cavalry Grand General, and Li Min, Left Grand Master of Splendid Happiness, came from great clans and long service, yet were put to death—everyone knew the charge was false."',
  },
  s0142: {
    literal:
      'Yet the Li house was destined to rise; Heaven\'s favor had its response; a deep hidden pact was wantonly answered with massacre.',
    idiomatic:
      '"The Li were fated to rule; Heaven had already chosen them, yet obscure prophecies were used as pretext for a wholesale slaughter."',
  },
  s0143: {
    literal:
      'I have received the mandate and rule the realm; my will is set on sweeping away wrongs, declaring grievances and displaying goodness, and I do not forget this even in sleep.',
    idiomatic:
      '"Now that I hold the mandate, I mean to clear away these wrongs, vindicate the innocent, and reward the loyal—I have not ceased to think of it night or day."',
  },
  s0144: {
    literal:
      'Jincai was posthumously granted Upper Pillar Duke and Duke of Shen; Min was posthumously granted Pillar Duke and Duke of Guan.',
    idiomatic:
      'Jincai was posthumously made Upper Pillar Duke and Duke of Shen; Min Pillar Duke and Duke of Guan.',
  },
  s0145: {
    literal:
      '" Moreover, descendants banished in former generations for excessive punishments were all released to return to their home districts.',
    idiomatic:
      '"Descendants exiled under earlier reigns for harsh sentences were also pardoned and sent home."',
  },
  s0146: {
    literal:
      'Li Gui, bandit chief of Liangzhou, submitted his territory in surrender; he was appointed Military Commissioner of Liangzhou and enfeoffed Prince of Liang.',
    idiomatic:
      'Li Gui, rebel leader in Liangzhou, surrendered his domain and was appointed military commissioner of Liangzhou with the title Prince of Liang.',
  },
  s0147: {
    literal:
      'On yisi of the ninth month he personally reviewed prisoners; silver rabbit tallies were changed to bronze fish tallies.',
    idiomatic:
      'On yisi in the ninth month he reviewed prisoners in person and replaced silver rabbit tallies with bronze fish tallies.',
  },
  s0148: {
    literal: 'On xinwei the Sui Retired Emperor was posthumously titled Emperor Yang.',
    idiomatic: 'On xinwei the retired Sui sovereign was given the posthumous name Emperor Yang.',
  },
  s0149: {
    literal:
      'Yuwen Huaji reached Weizhou, poisoned Prince Hao of Qin, presumptuously declared himself emperor, and styled his state Xu.',
    idiomatic:
      'At Weizhou Yuwen Huaji poisoned Prince Hao of Qin, seized the title of emperor, and proclaimed the state of Xu.',
  },
  s0150: {
    literal: 'On the first day renshi of the tenth month of winter, there was a solar eclipse.',
    idiomatic: 'On the new moon of the tenth winter month there was an eclipse of the sun.',
  },
  s0151: {
    literal: 'Li Mi led his forces to surrender.',
    idiomatic: 'Li Mi came over with his army.',
  },
  s0152: {
    literal:
      'Imperial cousin Duke of Xiangwu Chen was made Prince of Xiangwu; Duke of Huangtai Yuan was made Prince of Lujiang.',
    idiomatic:
      'The Emperor\'s cousin Chen was created Prince of Xiangwu and Yuan Prince of Lujiang.',
  },
  s0153: {
    literal:
      'On guisi an edict ordered the adoption of the Wuyin Calendar compiled by Fu Renjun.',
    idiomatic:
      'On guisi the court decreed use of Fu Renjun\'s Wuyin Calendar.',
  },
  s0154: {
    literal:
      'On jiyou, because grain in the capital was dear, those entering the passes from all four sides were given tax-grain for their horses, oxen, and donkeys to feed themselves.',
    idiomatic:
      'On jiyou, with grain scarce in the capital, travelers entering the passes from every direction received rations of tax grain for their draft animals.',
  },
  s0155: {
    literal:
      'The Prince of Qin won a great victory over Xue Ren Gao at Qianshui Plain, accepted his surrender, and the Longyou region was pacified.',
    idiomatic:
      'The Prince of Qin shattered Xue Ren Gao at Qianshui Plain, took his surrender, and pacified the west.',
  },
  s0156: {
    literal:
      'On yisi Prince of Liang Li Gui presumptuously declared himself emperor at Liangzhou.',
    idiomatic:
      'On yisi Li Gui, Prince of Liang, declared himself emperor at Liangzhou.',
  },
  s0157: {
    literal:
      'An edict promulgated fifty-three articles of administrative rules to simplify the law and ease punishments.',
    idiomatic:
      'The court issued fifty-three articles of administrative law to narrow the code and lighten penalties.',
  },
  s0158: {
    literal:
      'On renshen in the twelfth month the Prince of Qin was additionally made Grand Commandant and chief of the Shandong Grand Office.',
    idiomatic:
      'On renshen in the twelfth month the Prince of Qin was also made Grand Commandant and head of the Shandong circuit office.',
  },
  s0159: {
    literal: 'On dingchou Upper Pillar Duke Li Xiaochang was enfeoffed as Prince of Yi\'an.',
    idiomatic: 'On dingchou Li Xiaochang was created Prince of Yi\'an.',
  },
  s0160: {
    literal:
      'On gengzi Li Mi rebelled at Taolin; Campaign General Sheng Yanshi pursued, attacked, and beheaded him.',
    idiomatic:
      'On gengzi Li Mi rebelled at Taolin; Sheng Yanshi, campaign general, hunted him down and executed him.',
  },
  s0161: {
    literal:
      'In the second year of Wude, in the spring of the first month, on yimao, for the first time civil officials mourning parents were permitted to leave office.',
    idiomatic:
      'In the second year of Wude, on yimao of the first spring month, civil officials were for the first time allowed to resign and observe mourning for their parents.',
  },
  s0162: {
    literal: 'Yellow Gate Vice Director Chen Shuda was made concurrent Censor-in-Chief.',
    idiomatic: 'Chen Shuda, Vice Director of the Yellow Gate, was also appointed Censor-in-Chief.',
  },
  s0163: {
    literal:
      'On bingxu an edict stated that clansmen throughout the realm without office were exempt from corvée labor, and each prefecture was to appoint one clan director to oversee them.',
    idiomatic:
      'On bingxu an edict freed unemployed clansmen empire-wide from corvée and ordered each prefecture to name a clan director to supervise them.',
  },
  s0164: {
    literal:
      'On dingyou Dou Jiande attacked Yuwen Huaji at Liaocheng, beheaded him, and sent his head to the Turks.',
    idiomatic:
      'On dingyou Dou Jiande besieged Yuwen Huaji at Liaocheng, killed him, and forwarded his head to the Turks.',
  },
  s0165: {
    literal: 'In the intercalary month, on xinchou, Liu Wuzhou invaded our Bingzhou.',
    idiomatic: 'In the intercalary month, on xinchou, Liu Wuzhou raided Bingzhou.',
  },
  s0166: {
    literal:
      'On jiyou Xu Shiji, former general of Li Mi, surrendered with the forces of Liyang and ten commanderies of Henan; he was appointed Military Commissioner of Li Prefecture, enfeoffed Duke of Cao, and granted the surname Li.',
    idiomatic:
      'On jiyou Xu Shiji, once Li Mi\'s lieutenant, surrendered with the army at Liyang and ten Henan commanderies; he was made military commissioner of Li, created Duke of Cao, and given the imperial surname Li.',
  },
  s0167: {
    literal:
      'On gengxu the sovereign made a private tour of the capital to observe the people\'s customs, and that same day returned to the palace.',
    idiomatic:
      'On gengxu the Emperor went about the capital incognito to see how the people lived, then returned to the palace the same day.',
  },
  s0168: {
    literal:
      'On jiayin the bandit chief Zhu Can killed our envoy Regular Attendant Duan Que and fled to Luoyang.',
    idiomatic:
      'On jiayin the rebel Zhu Can murdered the envoy Duan Que and fled to Luoyang.',
  },
  s0169: {
    literal:
      'On yisi of the fourth month, Wang Shichong usurped Prince Yue Tong\'s throne, presumptuously declared himself emperor, and styled his state Zheng.',
    idiomatic:
      'On yisi in the fourth month Wang Shichong deposed Yang Tong and declared himself emperor of Zheng.',
  },
  s0170: {
    literal:
      'On xinhai Li Gui was seized and surrendered by his false Minister of State An Xinggui; the region west of the Yellow River was pacified.',
    idiomatic:
      'On xinhai Li Gui was betrayed and captured by his minister An Xinggui; the northwest submitted.',
  },
  s0171: {
    literal: 'The Göktürk Qaghan Shibi died.',
    idiomatic: 'Shibi Qaghan of the Turks died.',
  },
  s0172: {
    literal:
      'On jimao the Duke of Xi died; he was posthumously honored as Sui emperor with the posthumous name Gong.',
    idiomatic:
      'On jimao the Duke of Xi died and was posthumously honored as Emperor Gong of Sui.',
  },
  s0173: {
    literal:
      'On wuxu an edict ordered the Directorate of Education to establish temples to the Duke of Zhou and Confucius, with seasonal sacrifices, and broadly to seek their descendants.',
    idiomatic:
      'On wuxu the court ordered the imperial academy to build temples to the Duke of Zhou and Confucius with seasonal rites, and to search out their descendants.',
  },
  s0174: {
    literal:
      'On guihai Right Vice Director Pei Ji became campaign commander of the Jinzhou circuit to attack Liu Wuzhou.',
    idiomatic:
      'On guihai Pei Ji was appointed commander of the Jinzhou expedition against Liu Wuzhou.',
  },
  s0175: {
    literal:
      'In the seventh month of autumn, on renshen, twelve armies were established, and the prefectures within the passes were assigned to them.',
    idiomatic:
      'In the seventh month of autumn, on renshen, twelve armies were formed and the Guanzhong prefectures were divided among them.',
  },
  s0176: {
    literal:
      'Wang Shichong sent his general Luo Shixin to raid our Gu Prefecture; Shixin led his troops to surrender.',
    idiomatic:
      'Wang Shichong sent Luo Shixin against Gu Prefecture, but Shixin defected with his men.',
  },
  s0177: {
    literal:
      'The Western Turk Qaghan Yabghu and Gaochang both sent envoys with tribute.',
    idiomatic:
      'The Western Turk qaghan and the king of Gaochang both sent tribute missions.',
  },
  s0178: {
    literal:
      'On xinwei the bandit chief Li Zitong held Jiangdu, presumptuously declared himself emperor, and styled his state Wu.',
    idiomatic:
      'On xinwei Li Zitong seized Jiangdu, proclaimed himself emperor, and named his state Wu.',
  },
  s0179: {
    literal:
      'Shen Faxing held Piling and presumptuously styled himself Prince of Liang.',
    idiomatic:
      'Shen Faxing occupied Piling and declared himself Prince of Liang.',
  },
  s0180: {
    literal:
      'On dingchou Du Fuwei, bandit chief of He Province, sent envoys to surrender; he was appointed Military Commissioner of He, Chief of the Southeast Circuit Office, and enfeoffed Prince of Chu.',
    idiomatic:
      'On dingchou Du Fuwei of Hezhou submitted; he was made military commissioner of He, head of the southeast circuit, and Prince of Chu.',
  },
  s0181: {
    literal:
      'Pei Ji fought Liu Wuzhou\'s general Song Jingang at Jie Prefecture; our army suffered defeat, and Right Martial Guard Grand General Jiang Baoyi died.',
    idiomatic:
      'Pei Ji met Song Jingang, Liu Wuzhou\'s general, at Jiezhou and was beaten; Jiang Baoyi, grand general of the Right Martial Guard, was killed.',
  },
  s0182: {
    literal:
      'Bingzhou Military Commissioner, Prince of Qi Yuanji, fearing Liu Wuzhou\'s pressure, fled to the capital; Bingzhou fell.',
    idiomatic:
      'Prince of Qi Yuanji, military commissioner of Bingzhou, fled to Chang\'an before Liu Wuzhou\'s advance, and Bingzhou was lost.',
  },
  s0183: {
    literal: 'On yiwei the capital region was shaken by an earthquake.',
    idiomatic: 'On yiwei an earthquake struck the capital.',
  },
  s0184: {
    literal: 'Winter, tenth month, jihai.',
    idiomatic: 'Tenth month of winter, day jihai.',
  },
  s0185: {
    literal:
      'Military Commissioner of Youzhou Luo Yi was enfeoffed Prince of Yan Commandery and granted the surname Li.',
    idiomatic:
      'Luo Yi, military commissioner of Youzhou, was created Prince of Yan and given the surname Li.',
  },
  s0186: {
    literal: 'Yellow Gate Vice Director Yang Gongren was made Censor-in-Chief.',
    idiomatic: 'Yang Gongren, Vice Director of the Yellow Gate, was appointed Censor-in-Chief.',
  },
  s0187: {
    literal: 'Minister of Revenue, Duke of Lu Liu Wenjing was executed.',
    idiomatic: 'Liu Wenjing, Minister of Revenue and Duke of Lu, was put to death.',
  },
  s0188: {
    literal:
      'On yimao, to attack Liu Wuzhou, the army encamped at Puzhou as rear support for the other forces.',
    idiomatic:
      'On yimao the Emperor marched against Liu Wuzhou and encamped at Puzhou to support the front-line armies.',
  },
  s0189: {
    literal: 'On renzi Liu Wuzhou advanced and besieged Jin Prefecture.',
    idiomatic: 'On renzi Liu Wuzhou pressed the siege of Jinzhou.',
  },
  s0190: {
    literal: 'On jiazi the sovereign personally sacrificed to Mount Hua.',
    idiomatic: 'On jiazi the Emperor worshipped at Mount Hua in person.',
  },
  s0191: {
    literal:
      'On bingzi Dou Jiande took Liyang and held all the lands east of the mountains.',
    idiomatic:
      'On bingzi Dou Jiande captured Liyang and seized the entire Shandong region.',
  },
  s0192: {
    literal:
      'Prince of Huai\'an Shitong and Left Martial Guard Grand General Li Shiji were both captured by the rebels.',
    idiomatic:
      'Prince of Huai\'an Shitong and Li Shiji, grand general of the Left Martial Guard, both fell into rebel hands.',
  },
  s0193: {
    literal:
      'On bingshen Prince of Yong\'an Xiaoji, Minister of Works Dugu Huai\'en, and Supervisor Yu Yun were ambushed by Liu Wuzhou\'s general Song Jingang and all were lost.',
    idiomatic:
      'On bingshen Xiaoji, Prince of Yong\'an, Works Minister Dugu Huai\'en, and Supervisor Yu Yun were ambushed by Song Jingang and captured or killed.',
  },
  s0194: {
    literal: 'On jiachen he hunted on Mount Hua.',
    idiomatic: 'On jiachen he held a hunt on Mount Hua.',
  },
  s0195: {
    literal: 'On renzi a great wind uprooted trees.',
    idiomatic: 'On renzi a violent gale uprooted trees.',
  },
  s0196: {
    literal:
      'In the third year of Wude, in the spring of the first month, on xinsi, he visited Puzhou and ordered sacrifice at the temple of Shun.',
    idiomatic:
      'In the third year of Wude, on xinsi of the first spring month, he went to Puzhou and commanded offerings at the temple of Emperor Shun.',
  },
  s0197: {
    literal: 'On guisi he returned from Puzhou.',
    idiomatic: 'On guisi he came back from Puzhou.',
  },
  s0198: {
    literal:
      'On jiawu Li Shiji freed himself from Dou Jiande\'s custody and returned to the realm.',
    idiomatic:
      'On jiawu Li Shiji escaped from Dou Jiande and made his way back to Tang territory.',
  },
  s0199: {
    literal: 'Jiande presumptuously styled himself Prince of Xia.',
    idiomatic: 'Dou Jiande proclaimed himself Prince of Xia.',
  },
  s0200: {
    literal:
      'On dingyou in the second month, southwest of the capital the ground sounded like a mountain collapsing.',
    idiomatic:
      'On dingyou in the second month a rumble like a landslide was heard southwest of the capital.',
  },
};

const path = 'translations/current_translation_jiutangshu.json';
const data = JSON.parse(readFileSync(path, 'utf8'));
if (data.metadata.chapter !== '001') {
  throw new Error(`Expected chapter 001, got ${data.metadata.chapter}`);
}
let applied = 0;
for (const s of data.sentences) {
  const pair = T[s.id];
  if (!pair) continue;
  if (pair.literal === pair.idiomatic) {
    throw new Error(`${s.id}: literal and idiomatic must differ`);
  }
  s.literal = pair.literal;
  s.idiomatic = pair.idiomatic;
  applied++;
}
writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', applied, 'translations (expected', Object.keys(T).length, ')');
