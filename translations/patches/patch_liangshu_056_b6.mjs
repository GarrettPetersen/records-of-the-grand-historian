#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'When Han campaigned against the Rong and Di, Ming You was the first to cross the Liao.',
    'When Han fought the northern tribes, Ming You was first to cross the Liao.',
  ],
  s0502: [
    'Moreover his divine strategy and keen calculations are beyond measure; his great deeds and splendid achievements exceed words and images—how could one hold to ordinary titles and keep to this narrow rank?',
    'His divine strategy and keen wit are beyond gauging; merit so great it outruns language—how could ordinary titles suffice for such a man?',
  ],
  s0503: [
    'The Chancellor may be advanced to Grand General of the Universe and Director-in-Chief of all armies under Heaven; all else shall remain as before.',
    'The Chancellor shall be made Grand General of the Universe and supreme commander of all armies under Heaven; all else stays as before.',
  ],
  s0504: [
    '" The edict text was presented to Taizong; Taizong said in shock, "The General truly bears the title of Universe!"',
    '" The edict was shown to Taizong, who cried in alarm, "The General has taken the title Universe!"',
  ],
  s0505: [
    'Qi sent its general Xin Shu to besiege Yangping; Jing\'s Mobile Headquarters Guo Yuanjian led troops to the relief, and Shu withdrew.',
    'Qi sent general Xin Shu to besiege Yangping; Jing\'s mobile headquarters Guo Yuanjian marched to relieve it, and Shu withdrew.',
  ],
  s0506: [
    'Xu Wensheng entered Ziji; Ren Yue led the river fleet to meet him in battle. Wensheng inflicted a great defeat and pressed on to Dajukou.',
    'Xu Wensheng took Ziji; Ren Yue led the river fleet against him. Wensheng routed him and advanced to Dajukou.',
  ],
  s0507: [
    'At the time Jing was encamped at Wankou and the capital was weak; Prince Kuili of Nankang and North Yanzhou aide Cheng Qin and others were about to strike him.',
    'Jing was encamped at Wankou while the capital lay weakened; Prince Kuili of Nankang and North Yanzhou aide Cheng Qin plotted to strike him.',
  ],
  s0508: [
    'Marquis Ben of Jian\'an learned of the plot and told Jing. Jing sent men to seize Kuili, his brother Marquis Tongli of Qiyang, Liu Jingli, Cheng Qin, and others—and killed them all.',
    'Marquis Ben of Jian\'an discovered the plot and warned Jing. Jing had Kuili, his brother Marquis Tongli of Qiyang, Liu Jingli, and Cheng Qin seized and killed.',
  ],
  s0509: [
    'In the twelfth month Jing forged an edict enfeoffing Ben as Prince of Jingling commandery, rewarding him for exposing the Nankang plot.',
    'In the twelfth month Jing forged an edict making Ben Prince of Jingling, a reward for revealing the Nankang conspiracy.',
  ],
  s0510: [
    'That month Zhang Biao raised a righteous army in Kuaiji and stormed Shangyu; Jing\'s administrator Cai Taile tried to suppress him and could not.',
    'That month Zhang Biao rebelled in Kuaiji and took Shangyu; Jing\'s administrator Cai Taile could not stop him.',
  ],
  s0511: [
    'By then Biao had also taken Zhuji, Yongxing, and other counties. Jing sent Yitong Tian Qian, Zhao Bochao, Xie Daren, and others east against Biao.',
    'Biao had also overrun Zhuji, Yongxing, and other counties. Jing sent Yitong Tian Qian, Zhao Bochao, Xie Daren, and others east to crush him.',
  ],
  s0512: [
    'In the first month of the second year Biao sent a detached general to raid Qiantang and Fuchun; Tian Qian advanced and routed him in battle.',
    'In the first month of year two Biao sent a detachment against Qiantang and Fuchun; Tian Qian advanced and broke them.',
  ],
  s0513: [
    'Jing made Wang Ke Grand Preceptor, Song Zixian Grand Guardian, Yuan Luo Grand Tutor, Guo Yuanjian Grand Commandant, Zhang Huaren Minister of Education, Ren Yue Minister of Works, Yu Qing Grand Preceptor to the Crown Prince, Shi Linghu Grand Guardian to the Crown Prince, Hexi Jin Grand Tutor to the Crown Prince, Wang Wei Left Vice Director of the Masters of Writing, and Suo Chaoshi Right Vice Director of the Masters of Writing.',
    'Jing made Wang Ke Grand Preceptor, Song Zixian Grand Guardian, Yuan Luo Grand Tutor, Guo Yuanjian Grand Commandant, Zhang Huaren Minister of Education, Ren Yue Minister of Works, Yu Qing Grand Preceptor to the Crown Prince, Shi Linghu Grand Guardian to the Crown Prince, Hexi Jin Grand Tutor to the Crown Prince, Wang Wei Left Vice Director of the Masters of Writing, and Suo Chaoshi Right Vice Director of the Masters of Writing.',
  ],
  s0514: [
    'Inspector of North Yanzhou Xiao Yong plotted surrender to Wei; the plot leaked and Jing executed him.',
    'North Yanzhou inspector Xiao Yong plotted to surrender to Wei; when the plot leaked, Jing had him killed.',
  ],
  s0515: [
    'That month Shizu sent Wang Xun of Bazhou and others with troops down to Wuchang to aid Xu Wensheng.',
    'That month Shizu sent Bazhou\'s Wang Xun and others with troops to Wuchang to aid Xu Wensheng.',
  ],
  s0516: [
    'Ren Yue urgently asked Jing for reinforcements from the Western Headquarters.',
    'Ren Yue sent urgent word to Jing asking the Western Headquarters for more troops.',
  ],
  s0517: [
    'In the third month Jing personally led twenty thousand men west to relieve Yue.',
    'In the third month Jing led twenty thousand men west himself to rescue Yue.',
  ],
  s0518: [
    'In the fourth month Jing halted at Xiyang; Xu Wensheng led the river fleet to intercept him and inflicted a great defeat.',
    'In the fourth month Jing camped at Xiyang; Xu Wensheng intercepted him on the water and routed his fleet.',
  ],
  s0519: [
    'Learning that Ying province was undefended and lightly garrisoned, Jing sent Song Zixian with three hundred light cavalry to raid and take it, seizing Inspector Fang Zhu and acting administrator Bao Quan and capturing the families of the entire Wuchang army.',
    'Jing learned Yingzhou was undefended and sent Song Zixian with three hundred light horse to take it by surprise, seizing inspector Fang Zhu and acting administrator Bao Quan and all the families of the Wuchang army.',
  ],
  s0520: [
    'When Xu Wensheng and the others heard of it they broke in rout and fled to Jiangling; Jing pressed west on the victory.',
    'Xu Wensheng\'s troops heard and broke in panic, fleeing to Jiangling; Jing pressed west on momentum.',
  ],
  s0521: [
    'Earlier Shizu had sent Army Commander Wang Sengbian east with troops to replace Xu Wensheng. The army halted at Baling; when Jing arrived, Sengbian fortified the walls and held him off.',
    'Shizu had already sent army commander Wang Sengbian east to replace Xu Wensheng. Sengbian halted at Baling; when Jing arrived he fortified and refused battle.',
  ],
  s0522: [
    'Jing set a long siege, built earthen mounds, and attacked day and night without success.',
    'Jing laid a long siege, piled earthworks, and assaulted day and night without breaching the walls.',
  ],
  s0523: [
    'Plague broke out in the army; more than half died or were wounded.',
    'Plague swept the army; more than half were dead or wounded.',
  ],
  s0524: [
    'Shizu sent Pacification North General Hu Sengyou with two thousand troops to relieve Baling. When Jing heard, he sent Ren Yue with several thousand elite troops to intercept Sengyou. Sengyou and the layman Lu Fahe withdrew to Chiting to await him; when Yue arrived and gave battle, they inflicted a great defeat and took Yue alive.',
    'Shizu sent Pacification North General Hu Sengyou with two thousand men to relieve Baling. Jing sent Ren Yue with thousands of elite troops to cut him off. Sengyou and the layman Lu Fahe fell back to Chiting to wait; when Yue arrived they routed him and captured him alive.',
  ],
  s0525: [
    'When Jing heard of it he fled by night.',
    'Jing heard and fled overnight.',
  ],
  s0526: [
    'He made Ding He Inspector of Ying province, left Song Zixian, Shi Linghu, and others to aid He in the defense, put Zhang Huaren and Yan Hongqing in charge of Lushan city, and Jing returned to the capital.',
    'He appointed Ding He inspector of Yingzhou, left Song Zixian and Shi Linghu to help him hold the city, garrisoned Zhang Huaren and Yan Hongqing at Lushan, and returned to the capital.',
  ],
  s0527: [
    'Wang Sengbian then led troops east, halted at Hankou, and attacked Lushan and Ying city—both fell.',
    'Wang Sengbian marched east to Hankou and took Lushan and Ying city.',
  ],
  s0528: [
    'From then on the armies met victory wherever they went.',
    'After that the loyal armies won wherever they marched.',
  ],
  s0529: [
    'Jing then deposed Taizong and imprisoned him in Yongfu Province.',
    'Jing deposed Taizong and confined him in Yongfu Province.',
  ],
  s0530: [
    'The draft edict was prepared and Taizong was forced to copy it; when he came to "The late emperor thought on the weight of the imperial regalia and the firmness of the altars of state," he sobbed and wept and could not stop.',
    'The abdication edict was drafted and Taizong was forced to write it out; at "The late emperor pondered the weight of the throne and the realm\'s security" he wept until he could not continue.',
  ],
  s0531: [
    'That day Jing brought Prince Dong of Yuzhang to the throne, ascended the Hall before Taiji, declared a general amnesty, and changed the era name to Tianzheng, year one.',
    'That day Jing set Prince Dong of Yuzhang on the throne, ascended the Hall before Taiji, declared amnesty, and renamed the era Tianzheng.',
  ],
  s0532: [
    'A whirlwind blew from Yongfu Province and knocked down the ritual vessels; all who saw it were struck with terror.',
    'A gust from Yongfu Province blew over the ritual vessels; every witness was horrified.',
  ],
  s0533: [
    'At first, once Jing had pacified the capital, he already harbored intent to usurp; because the four directions had yet to be settled, he had not yet set himself up.',
    'From the moment Jing took the capital he meant to seize the throne—but the realm was still unsettled, so he held back.',
  ],
  s0534: [
    'Once Baling was lost, Jiang and Ying lost their armies, fierce generals were destroyed without, and his bold heart was discouraged within—then he wished to usurp the great title and satisfy his treacherous heart.',
    'After Baling fell, Jiang and Ying lost their armies, his best generals were gone, and his ambition turned inward—he meant to take the throne himself and satisfy his treachery.',
  ],
  s0535: [
    'His counsellor Wang Wei said, "Since ancient times to shift the tripod one must depose and install"; so Jing followed him.',
    'His adviser Wang Wei said, "Since antiquity, whoever moved the sacred vessel had first to depose one ruler and install another"—and Jing did as he said.',
  ],
  s0536: [
    'His Grand Commandant Guo Yuanjian heard of it and galloped back from Qin commandery, remonstrating with Jing: "The reason armies from the four directions have not come is precisely because both palaces remain unharmed;',
    'Grand Commandant Guo Yuanjian heard and rode back from Qin in haste, pleading with Jing: "The armies of the realm hold back only because both palaces still stand;',
  ],
  s0537: [
    'if you now commit regicide and raise hatred throughout the realm, once the chance is gone regret will come too late.',
    'if you murder the emperor and turn the whole realm against you, the moment will pass—and no repentance will save you.',
  ],
  s0538: [
    '" Wang Wei stubbornly would not accept this.',
    '" Wang Wei refused to listen.',
  ],
  s0539: [
    'Jing then forged an edict in Dong\'s name, posthumously honoring Crown Prince Zhaoming as Emperor Zhaoming, Prince An of Yuzhang as Emperor An, Consort Jing of Jinhua as Empress Jing, the Grand Consort of Yuzhang state Lady Wang as Empress Dowager, and Consort Zhang as Empress;',
    'Jing forged an edict in Dong\'s name posthumously elevating Crown Prince Zhaoming to Emperor Zhaoming, Prince An of Yuzhang to Emperor An, Consort Jing of Jinhua to Empress Jing, Yuzhang Grand Consort Lady Wang to Empress Dowager, and Consort Zhang to Empress;',
  ],
  s0540: [
    'and made Liu Shenmao Minister of Works, Xu Hong Pacification South General, Qin Huangzhi, Wang Ye, Li Xianming, Xu Yong, Xu Zhenguo, Song Changbao, and Yin Sihe Yitong commissioners with equal prestige to the Three Dukes.',
    'he made Liu Shenmao Minister of Works, Xu Hong Pacification South General, and Qin Huangzhi, Wang Ye, Li Xianming, Xu Yong, Xu Zhenguo, Song Changbao, and Yin Sihe all commissioners equal in prestige to the Three Dukes.',
  ],
  s0541: [
    'Jing gave the late crown prince\'s consort to Guo Yuanjian; Yuanjian said, "How can a crown prince\'s consort be reduced to another man\'s concubine?"',
    'Jing gave the late crown prince\'s wife to Guo Yuanjian; Yuanjian said, "What crown prince\'s wife becomes another man\'s concubine?"',
  ],
  s0542: [
    'He ultimately refused even to see her.',
    'He would not even meet her.',
  ],
  s0543: [
    'On the night of renyin in the tenth month, Jing sent his Commandant of the Guard Peng Jun and Wang Xiuzuan to bring wine to Taizong, saying, "The Chancellor, seeing Your Majesty long in distress, has sent us to offer this cup."',
    'On the night of renyin in the tenth month Jing sent Guard Commandant Peng Jun and Wang Xiuzuan with wine for Taizong, saying, "The Chancellor sees you have suffered long and bids us offer this cup."',
  ],
  s0544: [
    '" Taizong knew they meant to kill him, drank heavily until drunk, and returned to sleep; Xiuzuan piled earth in a cloth on his belly, and so he died.',
    '" Taizong knew murder was coming, drank himself senseless, and went to bed; Xiuzuan smothered him with a cloth sack of earth.',
  ],
  s0545: [
    'He was buried in court robes in a thin coffin, secretly interred at the wine storehouse north of the city.',
    'They clad him in court dress, placed him in a thin coffin, and secretly buried him at the northern wine storehouse.',
  ],
  s0546: [
    'At first Taizong had long been confined; court officials could not visit him, and fearing disaster drew ever closer he was constantly uneasy;',
    'Taizong had been confined so long that no courtier could see him; dreading what was coming, he lived in constant fear;',
  ],
  s0547: [
    'only Attendant Yin Buhai was later allowed entry. Taizong pointed at the hall where he dwelt and said to him, "It is here beneath this hall that Pang Juan ought to die."',
    'only attendant Yin Buhai was later admitted. Taizong pointed at his hall and said, "It is here that Pang Juan should die."',
  ],
  s0548: [
    'He also said, "Last night I dreamed I swallowed earth—try to interpret it."',
    'He also said, "I dreamed I ate earth last night—what do you make of it?"',
  ],
  s0549: [
    'Buhai said, "In the past Chong\'er was given a clod of earth and in the end returned to rule Jin."',
    'Buhai said, "When Chong\'er was given a clod of earth he returned to rule Jin."',
  ],
  s0550: [
    'Your Majesty\'s dream—will it match that?"',
    'Could your dream mean the same?"',
  ],
  s0551: [
    'Taizong said, "If the underworld gives a sign, I hope these words are not vain."',
    'Taizong said, "If the dead send a sign, I hope this is true."',
  ],
  s0552: [
    'When he was murdered at last, it was indeed with earth.',
    'When he was killed, earth was indeed the means.',
  ],
  s0553: [
    'That month Jing\'s Minister of Works and Eastern Route Mobile Headquarters Liu Shenmao, Yitong Yin Sihe, Liu Guiyi, Wang Ye, Cloud Banner General Prince Yun of Sanggan, and others held Dongyang and surrendered; they still sent Yun and detached generals Li Zhan and Zhao Huilang south to hold Jiande River mouth.',
    'That month Liu Shenmao of Jing\'s eastern mobile headquarters, Yin Sihe, Liu Guiyi, Wang Ye, and Cloud Banner General Prince Yun of Sanggan held Dongyang and defected; Yun and detachments under Li Zhan and Zhao Huilang seized Jiande River mouth.',
  ],
  s0554: [
    'Yin Sihe seized Jing\'s Administrator of Xin\'an Yuan Yi and stripped him of his troops.',
    'Yin Sihe seized Jing\'s Xin\'an administrator Yuan Yi and took his army.',
  ],
  s0555: [
    'Zhang Biao attacked Yongjia; Administrator Qin Yuan surrendered to Biao.',
    'Zhang Biao attacked Yongjia; administrator Qin Yuan surrendered.',
  ],
  s0556: [
    'In the eleventh month Jing made Zhao Bochao Eastern Route Mobile Headquarters, garrisoning Qiantang, and sent Yitong Tian Qian, Xie Daren, and others east with troops against Shenmao.',
    'In the eleventh month Jing put Zhao Bochao in charge of the eastern mobile headquarters at Qiantang and sent Tian Qian, Xie Daren, and others east against Shenmao.',
  ],
  s0557: [
    'Jing forged an edict in Xiao Dong\'s name, granting himself the Nine Bestowments and appointing all offices from Chancellor downward.',
    'Jing forged an edict in Xiao Dong\'s name, giving himself the Nine Bestowments and filling every office down to Chancellor.',
  ],
  s0558: [
    'The ritual objects were arrayed in the courtyard when suddenly a wild bird flew above Jing—red-footed, red-beaked, shaped like a mountain magpie—and the rebels were all terrified; they shot at it but could not hit it.',
    'As the ritual gear was set in the courtyard a wild bird flew over Jing—red feet, red beak, like a mountain magpie—and the rebels panicked, shooting wildly without a hit.',
  ],
  s0559: [
    'Jing made Liu Quan, Qi Ba, and Zhu Anwang Yitong commissioners with equal prestige to the Three Dukes, and Suo Jiusheng Protector General.',
    'Jing made Liu Quan, Qi Ba, and Zhu Anwang commissioners equal to the Three Dukes, and Suo Jiusheng Protector General.',
  ],
  s0560: [
    'Inspector of South Yanzhou Hou Zijian presented a white roe deer; a white rat was caught in Jiankang and presented—the items were returned to Jing through Xiao Dong.',
    'South Yanzhou inspector Hou Zijian offered a white roe deer; Jiankang caught a white rat as tribute—Xiao Dong passed both to Jing.',
  ],
  s0561: [
    'Jing made Guo Yuanjian Inspector of South Yanzhou, keeping his posts as Grand Commandant and Northern Route Mobile Headquarters.',
    'Jing made Guo Yuanjian inspector of South Yanzhou while keeping him Grand Commandant and northern mobile headquarters.',
  ],
  s0562: [
    'Jing again forged an edict in Xiao Dong\'s name, posthumously honoring his grandfather as Grand General and his father as Chancellor.',
    'Jing forged another edict in Dong\'s name, posthumously making his grandfather Grand General and his father Chancellor.',
  ],
  s0563: [
    'He added an imperial crown with twelve tassels, raised the imperial banners, went out and in with imperial escort, rode the golden-root chariot drawn by six horses with seasonal outriders, set yak-tail banners and the cloud canopy, arranged eight rows of dancers, and had the bell and stone palace music—all as in the old rites.',
    'He took a twelve-tassel crown, imperial banners, royal escort, the golden chariot with six horses and seasonal outriders, yak-tail standards and cloud canopy, eight rows of dancers, and full court music—everything by the old imperial rite.',
  ],
  s0564: [
    'Jing again forged an edict in Xiao Dong\'s name, abdicating the throne to him.',
    'Jing forged yet another edict in Dong\'s name, handing him the throne.',
  ],
  s0565: [
    'Thereupon at the Southern Suburban Altar he burned offerings to Heaven, ascended the altar, and received the abdication regalia—all by the old rites.',
    'At the southern altar he burned offerings to Heaven, mounted the ritual platform, and took the regalia of abdication by the old forms.',
  ],
  s0566: [
    'Drums and pipes rode on wagon beds; camels bore the sacrificial victims; the imperial carriage held footstools and dangling-leg seats.',
    'Wagon beds carried drums and pipes; camels bore the sacrifice; the carriage held foot-rests and dangling-leg seats.',
  ],
  s0567: [
    'The crystal finial on the sword Jing wore fell off for no reason; he picked it up himself.',
    'The crystal pommel on Jing\'s sword fell off without cause; he bent and picked it up himself.',
  ],
  s0568: [
    'Just before mounting the altar a rabbit ran out in front and vanished;',
    'As he was about to mount the altar a rabbit darted before him and vanished;',
  ],
  s0569: [
    'a white rainbow also pierced the sun.',
    'a white rainbow cut across the sun.',
  ],
  s0570: [
    'Jing then ascended the Hall before Taiji, declared a general amnesty, and changed the era name to Taishi, year one.',
    'Jing mounted the Hall before Taiji, declared amnesty, and renamed the era Taishi.',
  ],
  s0571: [
    'He enfeoffed Xiao Dong as Prince of Huaiyin and confined him in the prison province.',
    'He made Xiao Dong Prince of Huaiyin and locked him in the oversight compound.',
  ],
  s0572: [
    'The false authorities memorialized changing "imperial escort" to "eternal escort," avoiding Jing\'s name.',
    'The puppet court asked to rename the imperial escort "eternal escort" to avoid Jing\'s name.',
  ],
  s0573: [
    'The Liang code was changed to the Han code; Left Director of the People was changed to Director of the Palace; Director of Five Arms was changed to Director of Seven Arms; Chief of Direct Palace Service was changed to Chief of Direct Quarters.',
    'Liang law became Han law; Left Director of the People became Director of the Palace; Five Arms became Seven Arms; Direct Palace chiefs became Direct Quarters chiefs.',
  ],
  s0574: [
    'Jing appointed ten or more men to each of the Three Excellencies; Yitong posts were especially numerous—some rode a lone horse and held their own reins.',
    'Jing stuffed each of the Three Excellencies with a dozen appointees; Yitong posts proliferated—some men rode alone, reins in hand.',
  ],
  s0575: [
    'His Left Vice Director Wang Wei asked to establish seven ancestral temples. Jing said, "What do you mean by seven temples?"',
    'Left Vice Director Wang Wei asked to build seven ancestral temples. Jing said, "What are seven temples?"',
  ],
  s0576: [
    'Wei said, "A Son of Heaven sacrifices to seven generations of ancestors and forebears—that is why seven temples are set up."',
    'Wei said, "A Son of Heaven sacrifices to seven generations—that is why one builds seven temples."',
  ],
  s0577: [
    'He also asked for the taboo names of seven generations and ordered the Director of Ceremonials to prepare the sacrificial rites.',
    'He also requested seven generations of taboo names and ordered the Director of Ceremonials to prepare the sacrifices.',
  ],
  s0578: [
    'Jing said, "Earlier generations I no longer remember—only Grandfather\'s name was Biao."',
    'Jing said, "I remember no earlier generations—only that Grandpa was called Biao."',
  ],
  s0579: [
    'All who heard this laughed in secret.',
    'Everyone who heard laughed behind their hands.',
  ],
  s0580: [
    'Among Jing\'s faction only one man knew that Jing\'s grandfather was named Zhou; all the rest were names and ranks Wang Wei invented, making Han Minister of Education Hou Ba the founding ancestor and Jin Recluse Hou Jin the seventh-generation forebear.',
    'Only one man in Jing\'s camp knew his grandfather was Zhou; every other name and title was Wang Wei\'s invention—Han Minister Hou Ba as founding ancestor, Jin recluse Hou Jin as seventh-generation forebear.',
  ],
  s0581: [
    'Thereupon he posthumously honored his grandfather Zhou as Grand Chancellor and his father Biao as Founding Emperor.',
    'So he posthumously made Zhou Grand Chancellor and Biao Founding Emperor.',
  ],
  s0582: [
    'In the twelfth month Xie Daren and Li Qing reached Jiande and attacked the palisades of Yun and Li Zhan, inflicting a great defeat; they seized Yun and Zhan and sent them to Jing.',
    'In the twelfth month Xie Daren and Li Qing reached Jiande, stormed the palisades of Yun and Li Zhan, captured them, and sent them to Jing.',
  ],
  s0583: [
    'Jing cut off their hands and feet and displayed them as a warning; after a full day they died.',
    'Jing cut off their limbs and displayed them as a warning; they died after a day.',
  ],
  s0584: [
    'On New Year\'s Day in the second year of Jing\'s reign he held court at the imperial facade.',
    'On New Year\'s Day of Jing\'s second year he held imperial audience.',
  ],
  s0585: [
    'Since his defeat at Baling his army was nearly gone; fearing Qi would seize the chance and join the western armies in a pincer, he sent Guo Yuanjian with foot soldiers toward Xiaoxian and Hou Zijian with the river fleet toward Ruru, displaying troops at the Fei River to show martial might.',
    'Broken at Baling, his army nearly spent, he feared Qi would exploit the moment and link arms with the western host—so he sent Guo Yuanjian\'s infantry toward Xiaoxian and Hou Zijian\'s fleet toward Ruru, parading troops on the Fei to show strength.',
  ],
  s0586: [
    'Zijian reached Hefei and stormed the outer wall; he took it.',
    'Zijian reached Hefei, stormed the outer wall, and took it.',
  ],
  s0587: [
    'Guo Yuanjian and Hou Zijian soon heard the royal armies were near; they burned the homes of the people of Hefei, withdrew their troops, Zijian holding Gudu, Yuanjian returning to Guangling.',
    'Guo Yuanjian and Hou Zijian soon heard the loyal armies were closing in; they burned Hefei\'s settlements and retreated—Zijian to Gudu, Yuanjian to Guangling.',
  ],
  s0588: [
    'At the time Xie Daren was attacking Liu Shenmao; Shenmao\'s detached generals Wang Hua and Li Tong both held outer camps and surrendered to Daren.',
    'Xie Daren was pressing Liu Shenmao; Shenmao\'s generals Wang Hua and Li Tong held the outer camps and surrendered.',
  ],
  s0589: [
    'Liu Guiyi, Yin Sihe, and the others grew afraid and each abandoned his city and fled.',
    'Liu Guiyi, Yin Sihe, and the rest fled their posts in fear.',
  ],
  s0590: [
    'Shenmao, isolated and endangered, surrendered to Daren again.',
    'Shenmao, isolated and desperate, surrendered to Daren.',
  ],
  s0591: [
    'Wang Sengbian\'s army reached Wuhu; the Wuhu garrison commander fled by night.',
    'Wang Sengbian reached Wuhu; its commander fled overnight.',
  ],
  s0592: [
    'Jing sent Shi Anhe and Song Changgui with two thousand troops to help Zijian hold Gudu, and recalled Tian Qian and the others to the capital.',
    'Jing sent Shi Anhe and Song Changgui with two thousand men to help Zijian hold Gudu and recalled Tian Qian and others to the capital.',
  ],
  s0593: [
    'That month one of Jing\'s followers, Guo Chang, presented a colt born with horns.',
    'That month Jing\'s man Guo Chang offered a foal born with horns.',
  ],
  s0594: [
    'In the third month Jing went to Gudu to inspect the palisades and again admonished Zijian: "Westerners excel at river fighting—do not meet them on the water. Ren Yue\'s defeat in years past was precisely because of this.',
    'In the third month Jing went to Gudu, inspected the defenses, and warned Zijian: "Westerners fight best on water—never meet them there. Ren Yue lost for exactly that reason.',
  ],
  s0595: [
    'If you can clash once on horse and foot you are sure to break them—only hold the walls and watch for their lapse."',
    'One clash on land and you will break them—just hold your walls and wait."',
  ],
  s0596: [
    '" Zijian then abandoned his boats, came ashore, and closed camp without emerging.',
    '" Zijian left his boats, went ashore, shut camp, and would not come out.',
  ],
  s0597: [
    'Sengbian and the others thereupon halted their army for more than ten days; the rebel faction rejoiced greatly and told Jing, "The western armies fear our strength—they mean to flee; if we do not strike we shall lose them."',
    'Sengbian halted for ten-odd days; the rebels rejoiced and told Jing, "The western host fears us and means to run—strike now or they escape."',
  ],
  s0598: [
    'Jing again ordered Zijian to prepare for river battle.',
    'Jing ordered Zijian to ready the fleet again.',
  ],
  s0599: [
    'Zijian then led more than ten thousand horse and foot across the sandbar and advanced with the river fleet together; Sengbian met him in counterattack and inflicted a great defeat—Zijian barely escaped with his life.',
    'Zijian led ten thousand horse and foot across the ford, fleet and army together; Sengbian counterattacked and shattered him—Zijian escaped by a hair.',
  ],
  s0600: [
    'When Jing heard that Zijian was defeated he was greatly afraid and wept; he covered his face, pulled up the bedding, and lay down. After a long while he rose and sighed, "I have killed my old man!"',
    'When Jing heard Zijian was broken he wept in terror, hid his face under the covers, and lay a long while before rising with a sigh: "I killed my father-in-law!"',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_056_b6.mjs <translation.json>'
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
