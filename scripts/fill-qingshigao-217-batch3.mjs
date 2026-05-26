#!/usr/bin/env node
/** Fill qingshigao ch.217 batch 3 (s0201–s0300) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0201: {
    literal: 'In the fourteenth year he was advanced to prince.',
    idiomatic: 'In Kangxi 14 he was advanced to prince.',
  },
  s0202: {
    literal: 'In the thirteenth year of Kangxi, Wu Sangui and Geng Jingzhong both rebelled and invaded Jiangxi.',
    idiomatic: 'In Kangxi 13, Wu Sangui and Geng Jingzhong both rebelled and invaded Jiangxi.',
  },
  s0203: {
    literal: 'He was appointed Pacification Commissioner General for the Distant Pacification of Bandits, led an army to attack them, planned from Jiangxi toward Guangdong, halted at Nanchang, and sent troops to recover Anfu and Duchang.',
    idiomatic: 'He was appointed Pacification Commissioner General for the Distant Pacification of Bandits, led an army against them, aimed from Jiangxi at Guangdong, halted at Nanchang, and sent troops to recover Anfu and Duchang.',
  },
  s0204: {
    literal: 'In the fourteenth year he recovered Shanggao and Xinchang.',
    idiomatic: 'In Kangxi 14 he recovered Shanggao and Xinchang.',
  },
  s0205: {
    literal: 'He fought at Tangbu, Qiligang, Wuguizhai, and Xucha in Fuzhou, repeatedly defeated the enemy, and recovered Yugan and Dongxiang.',
    idiomatic: 'He fought at Tangbu, Qiligang, Wuguizhai, and Xucha in Fuzhou, repeatedly defeated the enemy, and recovered Yugan and Dongxiang.',
  },
  s0206: {
    literal: 'An edict ordered the army shifted to Hunan; he memorialized: "Jiangxi is the throat of Guangdong and sits at the crossroads of Jiangnan and Huguang; now more than thirty cities have all fallen to the rebels.',
    idiomatic: 'An edict ordered the army shifted to Hunan; he memorialized: "Jiangxi is the throat of Guangdong and sits at the crossroads of Jiangnan and Huguang; now more than thirty cities have fallen to the rebels.',
  },
  s0207: {
    literal: 'Sangui at Liling built wooden fortifications, added more than ten false grand generals, had seventy thousand troops and three thousand Luo-Luo, and held fast the passes of Pingxiang and elsewhere.',
    idiomatic: 'Sangui at Liling built wooden fortifications, appointed more than ten false grand generals, mustered seventy thousand troops and three thousand Luo-Luo, and held fast the passes around Pingxiang.',
  },
  s0208: {
    literal: 'If the garrison troops on the Fuzhou, Raozhou, and Duchang routes are all withdrawn to Hunan, then those routes will again be held by the rebels.',
    idiomatic: 'If the garrison troops on the Fuzhou, Raozhou, and Duchang routes are all withdrawn to Hunan, those routes will fall to the rebels again.',
  },
  s0209: {
    literal: 'Otherwise the army will be too weak to drive far.',
    idiomatic: 'Otherwise the army will be too weak to advance far.',
  },
  s0210: {
    literal: 'The routes into Guangdong will also, I fear, meet many obstacles.',
    idiomatic: 'I fear the routes into Guangdong will also meet many obstacles.',
  },
  s0211: {
    literal: 'Your servant wishes first to pacify Jiangxi without rear anxieties and then shift the army.',
    idiomatic: 'Your servant wishes first to pacify Jiangxi without rear anxieties and then shift the army.',
  },
  s0212: {
    literal: '" When the memorial was received, the emperor ordered Jiangxi quickly settled.',
    idiomatic: '" When the memorial was received, the emperor ordered Jiangxi quickly pacified.',
  },
  s0213: {
    literal: 'Yuele supervised troops in attacking Jianchang; Jingzhong\'s general Shao Liandeng led tens of thousands to meet battle at Changxing township; they were driven off; Jianchang was taken, and Wannian and Anren also fell.',
    idiomatic: 'Yuele supervised the attack on Jianchang; Jingzhong\'s general Shao Liandeng led tens of thousands to meet battle at Changxing township and was driven off; Jianchang was taken, and Wannian and Anren also fell.',
  },
  s0214: {
    literal: 'The army advanced and took Guangxin, advanced again and took Raozhou, defeated the enemy at Jingdezhen, and again took Fuliang and Leping.',
    idiomatic: 'The army advanced and took Guangxin, advanced again and took Raozhou, defeated the enemy at Jingdezhen, and recovered Fuliang and Leping.',
  },
  s0215: {
    literal: 'Dividing forces he subdued Yihuang, Chongren, and Le\'an—all fell.',
    idiomatic: 'Dividing his forces he subdued Yihuang, Chongren, and Le\'an—all fell.',
  },
  s0216: {
    literal: 'He also ordered the surrender of Taihe, Longquan, Yongxin, Luling, Yongning, and the Huguang counties of Chaling and elsewhere.',
    idiomatic: 'He also secured the surrender of Taihe, Longquan, Yongxin, Luling, Yongning, and the Huguang counties of Chaling and elsewhere.',
  },
  s0217: {
    literal: 'The army advanced again and took Jing\'an and Guixi.',
    idiomatic: 'The army advanced again and took Jing\'an and Guixi.',
  },
  s0218: {
    literal: 'He memorialized: "When Sangui hears that your servant is advancing, he is sure to hold fast the strategic points; without Green Banner troops there is no way to search the difficult terrain, and without red-coated cannon there is no way to storm strongholds.',
    idiomatic: 'He memorialized: "When Sangui hears that your servant is advancing, he is sure to hold the strategic points; without Green Banner troops there is no way to search the difficult terrain, and without red-coated cannon there is no way to storm strongholds.',
  },
  s0219: {
    literal: 'I beg that the provincial military commander Zhao Guozuo and others be ordered to lead their detachments to follow your servant in the advance, and that twenty newly made Western cannon be issued by edict.',
    idiomatic: 'I beg that Provincial Military Commander Zhao Guozuo and others be ordered to lead their detachments to follow your servant in the advance, and that twenty newly made Western cannon be issued by edict.',
  },
  s0220: {
    literal: '" He also memorialized: "Jingzhong\'s general Zhang Cun sent word that he had eight thousand troops stationed at Shunchang, waiting for the great army to enter Fujian in support.',
    idiomatic: '" He also memorialized: "Jingzhong\'s general Zhang Cun sent word that he had eight thousand troops stationed at Shunchang, waiting to support the great army when it entered Fujian.',
  },
  s0221: {
    literal: '" An edict put Prince Jian Labu in sole charge of Fujian military affairs and urged Yuele on to Changsha.',
    idiomatic: '" An edict put Prince Jian Labu in sole charge of Fujian military affairs and urged Yuele on to Changsha.',
  },
  s0222: {
    literal: 'In the fifteenth year Yuele\'s army took Pingxiang and then pressed close to Changsha.',
    idiomatic: 'In Kangxi 15 Yuele\'s army took Pingxiang and then pressed close to Changsha.',
  },
  s0223: {
    literal: 'He memorialized: "The enemy\'s boats are gathered below Changsha city; our army has no boats and finds it hard to meet the enemy.',
    idiomatic: 'He memorialized: "The enemy\'s boats are gathered below Changsha city; our army has no boats and finds it hard to meet the enemy.',
  },
  s0224: {
    literal: 'Timber is quite abundant near Changsha; I beg that seventy warships be first allocated, and that the governor-general and governors still commission men to fell timber and build ships.',
    idiomatic: 'Timber is quite abundant near Changsha; I beg that seventy warships be allocated first, and that the governor-general and governors commission men to fell timber and build more ships.',
  },
  s0225: {
    literal: '" As requested.',
    idiomatic: 'His request was granted.',
  },
  s0226: {
    literal: 'In the eighth month an edict said: "We have heard that the Prince recovered Pingxiang and pressed straight to Changsha, and are greatly pleased.',
    idiomatic: 'In the eighth month an edict said: "We have heard that the Prince recovered Pingxiang and pressed straight to Changsha, and are greatly pleased.',
  },
  s0227: {
    literal: 'Let the Prince well comfort the people so that their distress may be relieved;',
    idiomatic: 'Let the Prince well comfort the people so that their distress may be relieved;',
  },
  s0228: {
    literal: 'even those who followed under coercion are Our children and should be recruited with special care.',
    idiomatic: 'even those who followed under coercion are Our children and should be recruited with special care.',
  },
  s0229: {
    literal: '" In the sixteenth year he sent troops and defeated the enemy at Liuyang, beheaded more than a thousand, and took Pingjiang.',
    idiomatic: '" In Kangxi 16 he sent troops, defeated the enemy at Liuyang, beheaded more than a thousand, and took Pingjiang.',
  },
  s0230: {
    literal: 'In the seventeenth year he defeated the enemy at Qijia Cave.',
    idiomatic: 'In Kangxi 17 he defeated the enemy at Qijia Cave.',
  },
  s0231: {
    literal: 'Sangui\'s generals Lin Xingzhu and others came over from Xiangtan.',
    idiomatic: 'Sangui\'s generals Lin Xingzhu and others surrendered from Xiangtan.',
  },
  s0232: {
    literal: 'In the ninth month, after Sangui had died, an edict urged Yuele to advance the army.',
    idiomatic: 'In the ninth month, after Sangui had died, an edict urged Yuele to advance the army.',
  },
  s0233: {
    literal: 'Yuele asked to go to Yuezhou to coordinate the various armies.',
    idiomatic: 'Yuele asked to go to Yuezhou to coordinate the various armies.',
  },
  s0234: {
    literal: 'The emperor ordered the grand general Cha Ni to plan the taking of Yuezhou, while Yuele was still to attack Changsha.',
    idiomatic: 'The emperor ordered Grand General Cha Ni to plan the taking of Yuezhou, while Yuele was still to attack Changsha.',
  },
  s0235: {
    literal: 'In the first month of the eighteenth year Yuezhou surrendered.',
    idiomatic: 'In the first month of Kangxi 18 Yuezhou surrendered.',
  },
  s0236: {
    literal: 'The rebels at Changsha also abandoned the city and fled; he then entered Changsha and sent troops to recover Xiangtan.',
    idiomatic: 'The rebels at Changsha also abandoned the city and fled; he then entered Changsha and sent troops to recover Xiangtan.',
  },
  s0237: {
    literal: 'Soon he joined Labu\'s army in taking Hengzhou and Baoding and left troops to garrison them.',
    idiomatic: 'Soon he joined Labu\'s army in taking Hengzhou and Baoding and left troops to garrison them.',
  },
  s0238: {
    literal: 'Again he united with Labu\'s army to attack Wugang, defeated the enemy at Yanxi in Baoding, beheaded several hundred, and captured forty boats.',
    idiomatic: 'Again he united with Labu\'s army to attack Wugang, defeated the enemy at Yanxi in Baoding, beheaded several hundred, and captured forty boats.',
  },
  s0239: {
    literal: 'The army halted at Ziyang River; the enemy camped on the opposite bank; the army crossed directly, divided troops to strike from behind the enemy in a pincer, and the enemy broke and fled.',
    idiomatic: 'The army halted at Ziyang River; the enemy camped on the opposite bank; the army crossed directly, divided troops to strike from behind in a pincer, and the enemy broke and fled.',
  },
  s0240: {
    literal: 'Sangui\'s generals Wu Guogui and Hu Guozhu with twenty thousand men held the pass; cannon fire killed Guogui and the pass was taken.',
    idiomatic: 'Sangui\'s generals Wu Guogui and Hu Guozhu with twenty thousand men held the pass; cannon fire killed Guogui and the pass was taken.',
  },
  s0241: {
    literal: 'Beizi Zhangtai pursued the enemy to Mugua Bridge and then took Wugang and Fengmuling.',
    idiomatic: 'Beizi Zhangtai pursued the enemy to Mugua Bridge and then took Wugang and Fengmuling.',
  },
  s0242: {
    literal: 'An edict recalled Yuele to the capital and handed the imperial commission and seal to Zhangtai.',
    idiomatic: 'An edict recalled Yuele to the capital and handed the imperial commission and seal to Zhangtai.',
  },
  s0243: {
    literal: 'In the first month of the nineteenth year an edict praised Yuele\'s merit.',
    idiomatic: 'In the first month of Kangxi 19 an edict praised Yuele\'s merit.',
  },
  s0244: {
    literal: 'When Yuele reached the capital, the emperor performed the suburban reward ceremony twenty li south of the Lugou Bridge.',
    idiomatic: 'When Yuele reached the capital, the emperor performed the suburban reward ceremony twenty li south of the Lugou Bridge.',
  },
  s0245: {
    literal: 'Early in Shunzhi, in the household of the former Ming imperial affinal kin Zhou Kui there was one who called himself the Ming crown prince; former palace women and Eastern Palace officials were sent to examine him and found he was not.',
    idiomatic: 'Early in Shunzhi, in the household of the former Ming imperial affinal kin Zhou Kui there was one who called himself the Ming crown prince; former palace women and Eastern Palace officials were sent to examine him and found he was not genuine.',
  },
  s0246: {
    literal: 'When Sangui rebelled, in the capital there was also Zhu Cihuan, who called himself the third prince, privately changed the era name to Guangde, gathered a faction, and raised fire in revolt; the affair failed and Cihuan escaped.',
    idiomatic: 'When Sangui rebelled, in the capital there was also Zhu Cihuan, who called himself the third prince, privately changed the era name to Guangde, gathered a faction, and raised fire in revolt; the affair failed and Cihuan escaped.',
  },
  s0247: {
    literal: 'When his faction was examined, it was said his true name was Yang Qilong.',
    idiomatic: 'When his faction was examined, it was said his true name was Yang Qilong.',
  },
  s0248: {
    literal: 'When Yuele was stationed at Fengmuling, at a monastery in Xinhua they obtained Zhu Cican, who declared himself the Chongzhen Emperor\'s eldest son; at the turmoil of the bandit uprising he fled to Nanjing; the Prince of Fu put him in prison, then released him as a commoner; he followed the monk Xiumu and wandered between Yongzhou and Baoding.',
    idiomatic: 'When Yuele was stationed at Fengmuling, at a monastery in Xinhua they obtained Zhu Cican, who declared himself the Chongzhen Emperor\'s eldest son; at the turmoil of the bandit uprising he fled to Nanjing; the Prince of Fu put him in prison, then released him as a commoner; he followed the monk Xiumu and wandered between Yongzhou and Baoding.',
  },
  s0249: {
    literal: 'Because Sangui was perfidious and turned back and forth, he was about to raise troops to denounce him in a proclamation; when Sangui died he stopped.',
    idiomatic: 'Because Sangui was perfidious and turned back and forth, he was about to raise troops to denounce him in a proclamation; when Sangui died he stopped.',
  },
  s0250: {
    literal: 'At this time Yuele brought Cican to the capital; an edict ordered him shown to Cihuan\'s faction; they again did not recognize one another; he was then beheaded.',
    idiomatic: 'At this time Yuele brought Cican to the capital; an edict ordered him shown to Cihuan\'s faction; they again did not recognize one another; he was then beheaded.',
  },
  s0251: {
    literal: 'In the twentieth year he again managed the affairs of the Imperial Clan Court.',
    idiomatic: 'In Kangxi 20 he again managed the affairs of the Imperial Clan Court.',
  },
  s0252: {
    literal: 'In the twenty-seventh year he went with Prince Jian Yabu to the Sunite to guard against Galdan.',
    idiomatic: 'In Kangxi 27 he went with Prince Jian Yabu to the Sunite to guard against Galdan.',
  },
  s0253: {
    literal: 'In the second month of the twenty-eighth year he died; a posthumous title was granted.',
    idiomatic: 'In the second month of Kangxi 28 he died; a posthumous title was granted.',
  },
  s0254: {
    literal: 'In the twenty-ninth year beile Niohni accused Yuele of managing the Imperial Clan Court, listening to slander, and wrongly convicting Niohni of the crime of unfilial conduct; Yuele was posthumously reduced to prince of the second degree and his posthumous title was stripped.',
    idiomatic: 'In Kangxi 29 beile Niohni accused Yuele of managing the Imperial Clan Court, listening to slander, and wrongly convicting Niohni of unfilial conduct; Yuele was posthumously reduced to prince of the second degree and his posthumous title was stripped.',
  },
  s0255: {
    literal: 'Yuele had twenty sons; three held rank: Yunduan, Maerhun, and Jingxi.',
    idiomatic: 'Yuele had twenty sons; three held rank: Yunduan, Maerhun, and Jingxi.',
  },
  s0256: {
    literal: 'Yunduan was enfeoffed as Prince Qin of the second degree and, on conviction of an offense, was reduced to beizi;',
    idiomatic: 'Yunduan was enfeoffed as Prince Qin of the second degree and, on conviction of an offense, was reduced to beizi;',
  },
  s0257: {
    literal: 'again on conviction of an offense his title was stripped.',
    idiomatic: 'again on conviction of an offense his title was stripped.',
  },
  s0258: {
    literal: 'Jingxi was enfeoffed as Prince Xi of the second degree.',
    idiomatic: 'Jingxi was enfeoffed as Prince Xi of the second degree.',
  },
  s0259: {
    literal: 'When Yuele fell into disgrace, Jingxi was reduced to Duke Zhenguo; he died and inheritance ceased.',
    idiomatic: 'When Yuele fell into disgrace, Jingxi was reduced to Duke Zhenguo; he died and inheritance ceased.',
  },
  s0260: {
    literal: 'Maerhun inherited the title.',
    idiomatic: 'Maerhun inherited the title.',
  },
  s0261: {
    literal: 'Maerhun loved learning and could write essays; Yunduan was also skilled in poetry.',
    idiomatic: 'Maerhun loved learning and could write essays; Yunduan was also skilled in poetry.',
  },
  s0262: {
    literal: 'Maerhun also compiled the poetry of imperial-clan princes and dukes into the Chen\'e Collection; many celebrated scholars of the time associated with him.',
    idiomatic: 'Maerhun also compiled the poetry of imperial-clan princes and dukes into the Chen\'e Collection; many celebrated scholars of the time associated with him.',
  },
  s0263: {
    literal: 'In the forty-eighth year he died; his posthumous title was Yi.',
    idiomatic: 'In Kangxi 48 he died; his posthumous title was Yi.',
  },
  s0264: {
    literal: 'His son Hua Qi inherited.',
    idiomatic: 'His son Hua Qi inherited.',
  },
  s0265: {
    literal: 'In the fifty-eighth year he died; his posthumous title was Jie.',
    idiomatic: 'In Kangxi 58 he died; his posthumous title was Jie.',
  },
  s0266: {
    literal: 'In the twelfth month of the first year of Yongzheng an edict said: "Formerly Prince An Yuele fawned on the regent ministers and repeatedly offended Our late father; by grace he was spared to the end, yet his sons altogether failed to feel gratitude, schemed against one another in rivalry, and vainly hoped for enfeoffment.',
    idiomatic: 'In the twelfth month of Yongzheng 1 an edict said: "Formerly Prince An Yuele fawned on the regent ministers and repeatedly offended Our late father; by grace he was spared to the end, yet his sons altogether failed to feel gratitude, schemed against one another in rivalry, and vainly hoped for enfeoffment.',
  },
  s0267: {
    literal: 'Maerhun and Hua Qi died young in succession, and the title long hung vacant.',
    idiomatic: 'Maerhun and Hua Qi died young in succession, and the title long hung vacant.',
  },
  s0268: {
    literal: 'Yuele\'s sons Wu\'erzhan and grandsons Sehengtu and others showed resentment in word and countenance.',
    idiomatic: 'Yuele\'s sons Wu\'erzhan and grandsons Sehengtu and others showed resentment in word and countenance.',
  },
  s0269: {
    literal: 'Prince Lian Yunsi again indulged his sowing of discord and recklessly spoke slander.',
    idiomatic: 'Prince Lian Yunsi again indulged his sowing of discord and recklessly spoke slander.',
  },
  s0270: {
    literal: 'The title of Prince An may not be inherited.',
    idiomatic: 'The title of Prince An may not be inherited.',
  },
  s0271: {
    literal: '" In the forty-third year of Qianlong the Gaozong Emperor, because Abatai and Yuele had repeatedly achieved merit, enfeoffed Hua Qi\'s grandson Qikun as Duke Fuguo, inheritable in perpetuity.',
    idiomatic: '" In Qianlong 43 the Gaozong Emperor, because Abatai and Yuele had repeatedly achieved merit, enfeoffed Hua Qi\'s grandson Qikun as Duke Fuguo, inheritable in perpetuity.',
  },
  s0272: {
    literal: 'Beizi Wenliang Bohetuo was Abatai\'s second son.',
    idiomatic: 'Bohetuo, posthumously beizi Wenliang, was Abatai\'s second son.',
  },
  s0273: {
    literal: 'He was first enfeoffed as Duke Fuguo.',
    idiomatic: 'He was first enfeoffed as Duke Fuguo.',
  },
  s0274: {
    literal: 'In the first year of Chongde he followed the campaign against Korea, besieged Namhansanseong, and together with Ni Kan drove off the relief army and killed and destroyed very many.',
    idiomatic: 'In Chongde 1 he followed the campaign against Korea, besieged Namhansanseong, and together with Ni Kan drove off the relief army and killed and destroyed very many.',
  },
  s0275: {
    literal: 'In the third year he followed in attacking the Ming, from Dongjiakou raided the six prefectures southwest of the Ming capital, and entered Shanxi.',
    idiomatic: 'In Chongde 3 he followed in attacking the Ming, from Dongjiakou raided the six prefectures southwest of the Ming capital, and entered Shanxi.',
  },
  s0276: {
    literal: 'Shifting the army he took Jinan.',
    idiomatic: 'Shifting the army he took Jinan.',
  },
  s0277: {
    literal: 'When the army returned, two thousand taels of silver were bestowed.',
    idiomatic: 'When the army returned, two thousand taels of silver were bestowed.',
  },
  s0278: {
    literal: 'In the seventh year he followed Abatai in campaigning against the Ming and entered through Huangyakou.',
    idiomatic: 'In Chongde 7 he followed Abatai in campaigning against the Ming and entered through Huangyakou.',
  },
  s0279: {
    literal: 'On his return three thousand taels of silver were bestowed.',
    idiomatic: 'On his return three thousand taels of silver were bestowed.',
  },
  s0280: {
    literal: 'In the first year of Shunzhi he followed in entering the Pass, defeated Li Zicheng, and was advanced to beizi.',
    idiomatic: 'In Shunzhi 1 he followed in entering the Pass, defeated Li Zicheng, and was advanced to beizi.',
  },
  s0281: {
    literal: 'In the third year he followed Dodo in attacking the Khalkha Sunite chieftains Tengjisi, Tengjite, and others.',
    idiomatic: 'In Shunzhi 3 he followed Dodo in attacking the Khalkha Sunite chieftains Tengjisi, Tengjite, and others.',
  },
  s0282: {
    literal: 'In the ninth month of the fifth year he died; a posthumous title was granted.',
    idiomatic: 'In the ninth month of Shunzhi 5 he died; a posthumous title was granted.',
  },
  s0283: {
    literal: 'He had six sons; Zhangtai inherited the beizi title.',
    idiomatic: 'He had six sons; Zhangtai inherited the beizi title.',
  },
  s0284: {
    literal: 'Zhangtai inherited the title and was advanced in rank.',
    idiomatic: 'Zhangtai inherited the title and was advanced in rank.',
  },
  s0285: {
    literal: 'In the spring of the thirteenth year of Kangxi, Wu Sangui seized Hunan; the emperor appointed beile Shangshan grand general, led an army down to Yuezhou, and made Zhangtai deputy in military affairs.',
    idiomatic: 'In the spring of Kangxi 13, Wu Sangui seized Hunan; the emperor appointed beile Shangshan grand general, led an army down to Yuezhou, and made Zhangtai deputy in military affairs.',
  },
  s0286: {
    literal: 'In the fifteenth year an edict rebuked the delay in marching.',
    idiomatic: 'In Kangxi 15 an edict rebuked the delay in marching.',
  },
  s0287: {
    literal: 'Zhangtai and Shangshan planned a joint advance by land and water, sent Esitai and others to defeat the enemy on Dongting Lake, and captured more than fifty boats.',
    idiomatic: 'Zhangtai and Shangshan planned a joint advance by land and water, sent Esitai and others to defeat the enemy on Dongting Lake, and captured more than fifty boats.',
  },
  s0288: {
    literal: 'The enemy erected stakes at the lake gorge mouth of Taohu to block our army.',
    idiomatic: 'The enemy erected stakes at the Taohu lake gorge mouth to block our army.',
  },
  s0289: {
    literal: 'In the seventeenth year he supervised troops in attacking the stakes, rowed light boats to defeat the enemy at Liulinzui, and fired cannon to destroy their ships.',
    idiomatic: 'In Kangxi 17 he supervised troops in attacking the stakes, rowed light boats to defeat the enemy at Liulinzui, and fired cannon to destroy their ships.',
  },
  s0290: {
    literal: 'In the eighth month Shangshan died in the army; beile Cha Ni replaced him as grand general and Zhangtai was appointed Pacification General for the Distant Regions.',
    idiomatic: 'In the eighth month Shangshan died in the army; beile Cha Ni replaced him as grand general and Zhangtai was appointed Pacification General for the Distant Regions.',
  },
  s0291: {
    literal: 'In the ninth month he supervised troops out of Nanjingang.',
    idiomatic: 'In the ninth month he supervised troops out of Nanjingang.',
  },
  s0292: {
    literal: 'In the tenth month he defeated the enemy at Lushikou, encamped at Baimitan, and cut Sangui\'s army supply route.',
    idiomatic: 'In the tenth month he defeated the enemy at Lushikou, encamped at Baimitan, and cut Sangui\'s army supply route.',
  },
  s0293: {
    literal: 'In the eighteenth year Sangui\'s generals Chen Bo and others, short of food, came over; Wu Yingqi fled to Hengzhou.',
    idiomatic: 'In Kangxi 18 Sangui\'s generals Chen Bo and others, short of food, surrendered; Wu Yingqi fled to Hengzhou.',
  },
  s0294: {
    literal: 'Commander-in-chief Zhuman and others took Xiangyin; Zhangtai took Huarong and Shishou.',
    idiomatic: 'Commander-in-chief Zhuman and others took Xiangyin; Zhangtai took Huarong and Shishou.',
  },
  s0295: {
    literal: 'When Prince An Yuele recovered Changsha and Prince Jian Labu recovered Hengzhou, an edict ordered Zhangtai to join forces.',
    idiomatic: 'When Prince An Yuele recovered Changsha and Prince Jian Labu recovered Hengzhou, an edict ordered Zhangtai to join forces.',
  },
  s0296: {
    literal: 'From Hengzhou he advanced to attack Wugang and defeated Sangui\'s generals Wu Guogui and others.',
    idiomatic: 'From Hengzhou he advanced to attack Wugang and defeated Sangui\'s generals Wu Guogui and others.',
  },
  s0297: {
    literal: 'In the eleventh month Yuele was recalled to the capital and Zhangtai was ordered to replace him as Pacification Commissioner General for the Distant Pacification of Bandits.',
    idiomatic: 'In the eleventh month Yuele was recalled to the capital and Zhangtai was ordered to replace him as Pacification Commissioner General for the Distant Pacification of Bandits.',
  },
  s0298: {
    literal: 'In the nineteenth year he recovered Yuanzhou and Jingzhou; the generals, officials, and nearby tribal chiefs that Sangui had installed in Suining and elsewhere all surrendered.',
    idiomatic: 'In Kangxi 19 he recovered Yuanzhou and Jingzhou; the generals, officials, and nearby tribal chiefs that Sangui had installed in Suining and elsewhere all surrendered.',
  },
  s0299: {
    literal: 'He memorialized: "General Cai Yurong is deploying Han troops; he is now advancing on Guizhou; if we are not kept informed, I fear the timing of operations will be hindered.',
    idiomatic: 'He memorialized: "General Cai Yurong is deploying Han troops and is now advancing on Guizhou; if we are not kept informed, I fear operations will be hindered.',
  },
  s0300: {
    literal: '" An edict ordered that Yurong\'s military affairs be reported to the grand general.',
    idiomatic: '" An edict ordered that Yurong\'s military affairs be reported to the grand general.',
  },
};

const chapterPath = 'data/qingshigao/217.json';
const chapter = JSON.parse(readFileSync(chapterPath, 'utf8'));
const START = 201;
const END = 300;

const sentences = [];
for (let blockIndex = 0; blockIndex < chapter.content.length; blockIndex++) {
  const block = chapter.content[blockIndex];
  if (block.type !== 'paragraph' && block.type !== 'table_header') continue;
  for (const sentence of block.sentences || []) {
    const n = Number.parseInt(sentence.id?.replace(/^s/, ''), 10);
    if (!Number.isFinite(n) || n < START || n > END) continue;
    const p = T[sentence.id];
    if (!p) {
      console.error(`No translation for ${sentence.id}`);
      process.exit(1);
    }
    sentences.push({
      id: sentence.id,
      originalId: sentence.id,
      blockIndex,
      chinese: sentence.zh,
      literal: p.literal,
      idiomatic: p.idiomatic,
    });
  }
}

sentences.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

if (sentences.length !== 100) {
  console.error(`Expected 100 sentences, got ${sentences.length}`);
  process.exit(1);
}

const placeholders = sentences.filter(
  (s) =>
    /\[TODO\]|placeholder|TBD|FIXME/i.test(s.literal) ||
    /\[TODO\]|placeholder|TBD|FIXME/i.test(s.idiomatic),
);
if (placeholders.length) {
  console.error('Placeholders found');
  process.exit(1);
}

const payload = {
  metadata: { book: 'qingshigao', chapter: '217', file: chapterPath },
  sentences,
};

const submitPath = 'translations/qingshigao-217-batch3-submit.json';
writeFileSync(submitPath, JSON.stringify(payload, null, 2) + '\n');
console.log(`Wrote ${sentences.length} sentences to ${submitPath}`);
