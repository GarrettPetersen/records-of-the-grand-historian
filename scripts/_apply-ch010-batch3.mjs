#!/usr/bin/env node
/** Batch 3: s0201–s0300 (Jiutangshu ch.010, Suzong — Two Capitals restored, Xuanzong's return, amnesties, Qianyuan reforms) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0201: {
    literal: 'Moreover, the people will again have a lord; one must reverently accord with the mind of Heaven and Earth;',
    idiomatic: 'The people will again have their rightful ruler; I must honor the will of Heaven and Earth.',
  },
  s0202: {
    literal: 'Can renewal rest on me alone? It truly depends on the altars of soil and grain.',
    idiomatic: 'This restoration is not mine to claim—it rests on the blessing of the altars.',
  },
  s0203: {
    literal: 'Now the Two Capitals are secure and the Three Powers rejoice together; we may proclaim the rites and extend grace—when the Retired Emperor arrives, decisions shall be taken then.',
    idiomatic: 'The Two Capitals are safe, the Three Powers united in celebration; the time has come to proclaim the rites and grant amnesty—but final disposition awaits the Retired Emperor\'s return.',
  },
  s0204: {
    literal: '」At that time the commanderies and counties of Henan and Hedong were all pacified.',
    idiomatic: '[Close of edict.] By then every commandery and county in Henan and Hedong had been pacified.',
  },
  s0205: {
    literal: 'Palace and ministry gates bearing the character an were renamed.',
    idiomatic: 'Every palace and ministry gate whose name contained the character an was changed.',
  },
  s0206: {
    literal: 'The rebel grand censor Yan Zhuang came over in surrender.',
    idiomatic: 'Yan Zhuang, the rebels\' grand censor, surrendered.',
  },
  s0207: {
    literal: 'The new Nine Ancestral Temple spirit tablets were completed, and the emperor personally performed the announcement rites.',
    idiomatic: 'With the new Nine Ancestral Temple spirit tablets ready, the emperor offered the announcement sacrifice in person.',
  },
  s0208: {
    literal: 'On bingwu of the twelfth month the Retired Emperor arrived from Shu; the emperor went to Wangxian Palace to welcome him.',
    idiomatic: 'On bingwu of the twelfth month the Retired Emperor returned from Shu; the emperor rode to Wangxian Palace to receive him.',
  },
  s0209: {
    literal: 'The Retired Emperor took the south tower of the palace; the emperor looked up at the tower, dismounted, and hurried to the foot of the tower, bowing twice, treading the dance of joy, and voicing congratulations.',
    idiomatic: 'The Retired Emperor stood on the palace\'s south tower; the emperor gazed up, dismounted, ran to the tower\'s base, bowed twice, danced the congratulatory tread, and cried his felicitations.',
  },
  s0210: {
    literal: 'The Retired Emperor came down from the tower; the emperor crawled forward, held the Retired Emperor\'s feet in both hands, and wept aloud, unable to master himself.',
    idiomatic: 'When the Retired Emperor descended, the emperor prostrated himself, clasped his feet, and sobbed until he could no longer speak.',
  },
  s0211: {
    literal: 'He then supported the Retired Emperor into the hall and personally served his meal;',
    idiomatic: 'He helped the Retired Emperor to the throne hall and served the meal himself;',
  },
  s0212: {
    literal: 'he led his own horse forward; when the Retired Emperor mounted, he again took the reins in hand and walked beside the horse, only withdrawing after being stopped.',
    idiomatic: 'then brought his own horse forward; when the Retired Emperor mounted, he walked the horse by the reins and would not step back until repeatedly urged.',
  },
  s0213: {
    literal: 'The Retired Emperor said: "I have long enjoyed the realm; I did not know what honor was—now that I see my son emperor, I know honor."',
    idiomatic: 'The Retired Emperor said, "I held the realm so long I never knew what glory meant—only now, seeing my son on the throne, do I understand it."',
  },
  s0214: {
    literal: '」The emperor rode ahead as guide; from Kaiyuan Gate to Danfeng Gate, banners filled the sky and painted canopies lined the road.',
    idiomatic: '[Close of speech.] The emperor rode in the lead from Kaiyuan Gate to Danfeng Gate, banners blotting out the sky and colored awnings lining the way.',
  },
  s0215: {
    literal: 'Commoners danced in delight beside the road, all saying: "We never dreamed we would again see the Two Sages!"',
    idiomatic: 'People danced along the roadside, crying, "We never thought to live to see both emperors again!"',
  },
  s0216: {
    literal: '」The host of officials formed ranks in the courtyard of Hanyuan Hall; the Retired Emperor took the hall, and left minister Miao Jinqing led the hundred officials in congratulation—every man wept.',
    idiomatic: '[Close of exclamation.] Officials lined the Hanyuan Hall courtyard; the Retired Emperor took the throne, and Miao Jinqing led the hundred officials in felicitation until none could hold back tears.',
  },
  s0217: {
    literal: 'When the rites were finished, the Retired Emperor went to Changle Hall to visit the Nine Ancestral Temple spirit tablets, and that same day visited Xingqing Palace.',
    idiomatic: 'After the ceremony the Retired Emperor visited the Nine Ancestral Temple tablets at Changle Hall and went that day to Xingqing Palace.',
  },
  s0218: {
    literal: 'The emperor asked to return to the Eastern Palace; the Retired Emperor sent Gao Lishi again and again to comfort and dissuade him.',
    idiomatic: 'The emperor asked to withdraw to the Eastern Palace; the Retired Emperor sent Gao Lishi repeatedly to soothe and stay him.',
  },
  s0219: {
    literal: 'More than two hundred who had accepted rebel appointments—including left minister Chen Xilie and Daxi Xun—were confined in Yang Guozhong\'s house for interrogation.',
    idiomatic: 'Over two hundred men who had served under the rebels—including Chen Xilie, Daxi Xun, and others—were held at Yang Guozhong\'s residence for questioning.',
  },
  s0220: {
    literal: 'On jiayin, left minister Miao Jinqing was made vice director of the Secretariat and associate director of the Chancellery.',
    idiomatic: 'On jiayin Miao Jinqing, left minister, was appointed vice director of the Secretariat and associate director of the Chancellery.',
  },
  s0221: {
    literal: 'On the wuwu new moon of the twelfth month the emperor took Danfeng Gate and issued a great amnesty edict.',
    idiomatic: 'On the wuwu new moon of the twelfth month the emperor appeared at Danfeng Gate and proclaimed a great amnesty.',
  },
  s0222: {
    literal: 'Meritorious followers from Shu and Lingwu—Grand Preceptor of the Heir Apparent and Duke of Bin Wei Jiansu, chief eunuch and Duke of Qi Gao Lishi, and Right Dragon Martial Grand General Chen Xuanli—each received three hundred households added to their substantive fiefs.',
    idiomatic: 'Wei Jiansu, grand preceptor of the heir apparent and Duke of Bin; Gao Lishi, chief eunuch and Duke of Qi; and Chen Xuanli, right dragon martial grand general—all early followers from Shu and Lingwu—each gained three hundred households on their fiefs.',
  },
  s0223: {
    literal: 'Tian Changwen, Zhang Chongjun, and Du Xiuxiang each received two hundred households added.',
    idiomatic: 'Tian Changwen, Zhang Chongjun, and Du Xiuxiang each received two hundred additional fief households.',
  },
  s0224: {
    literal: 'Right vice director Pei Mian was made Duke of Ji; palace director Li Fuguo Duke of Cheng; director of the imperial clan Li Zun Duke of Zheng—each also received enlarged fiefs.',
    idiomatic: 'Pei Mian, right vice director, became Duke of Ji; Li Fuguo, palace director, Duke of Cheng; Li Zun, director of the imperial clan, Duke of Zheng—all with enlarged fiefs.',
  },
  s0225: {
    literal: 'Prince of Guangping Li Chu was created Prince of Chu, with two thousand households added to his substantive fief.',
    idiomatic: 'Li Chu, Prince of Guangping, was created Prince of Chu and granted two thousand additional fief households.',
  },
  s0226: {
    literal: 'Left vice director and Shuofang military commissioner Guo Ziyi was promoted to grand steward and created Duke of Dai, with a substantive fief of one thousand households.',
    idiomatic: 'Guo Ziyi, left vice director and Shuofang commissioner, was made grand steward and Duke of Dai with a thousand-household fief.',
  },
  s0227: {
    literal: 'Army commissioner Pugu Huai\'en was created Duke of Feng; Right Golden Guard General Li Siye Duke of Guo; Grand Steward and concurrent Taiyuan intendant Li Guangbi Duke of Ji; Guannei commissioner Wang Sili Duke of Huo; Huainan commissioner Lai Tian Duke of Ying; Nanyang grand protector Lu Qiong Duke of Qi—all also received added substantive fiefs.',
    idiomatic: 'Pugu Huai\'en became Duke of Feng; Li Siye, right golden guard general, Duke of Guo; Li Guangbi, grand steward and Taiyuan intendant, Duke of Ji; Wang Sili, Guannei commissioner, Duke of Huo; Lai Tian, Huainan commissioner, Duke of Ying; Lu Qiong, Nanyang grand protector, Duke of Qi—all with enlarged fiefs.',
  },
  s0228: {
    literal: 'Capital intendant Cui Guangyuan Duke of Ye; Kai fu Li Guangjin Marquis of Fanyang; left minister Miao Jinqing made chief minister and Duke of Han; Minister of Justice and associate director Li Lin Duke of Bao; vice director of the Secretariat Cui Yuan made director of the Secretariat and Duke of Zhao; vice director Zhang Hao Marquis of Nanyang.',
    idiomatic: 'Cui Guangyuan, capital intendant, became Duke of Ye; Li Guangjin, kai fu, Marquis of Fanyang; Miao Jinqing, left minister, chief minister and Duke of Han; Li Lin, minister of justice and associate director, Duke of Bao; Cui Yuan, vice director, director of the Secretariat and Duke of Zhao; Zhang Hao, Marquis of Nanyang.',
  },
  s0229: {
    literal: 'Recent changes to the titles of the hundred offices and to commandery and official names were all restored to the old forms.',
    idiomatic: 'Every recent change to office titles, commandery names, and official designations was reversed to the former usage.',
  },
  s0230: {
    literal: 'Shu commandery was renamed Southern Capital; Fengxiang Prefecture Western Capital; the Western Capital became Middle Capital; Shu commandery became Chengdu Prefecture.',
    idiomatic: 'Shu commandery became the Southern Capital; Fengxiang Prefecture the Western Capital; the old Western Capital the Middle Capital; and Shu commandery Chengdu Prefecture.',
  },
  s0231: {
    literal: 'Fengxiang officials were given titles matching those of the Three Capitals.',
    idiomatic: 'Officials at Fengxiang received ranks parallel to those of the Three Capitals.',
  },
  s0232: {
    literal: 'Li Cheng, Lu Yi, Yan Gaoqing, Yuan Lüqian, Xu Yuan, Zhang Xun, Zhang Jieran, Jiang Qing, Pang Jian, and the like were posthumously ennobled at once; their descendants were sought out and given generous ranks.',
    idiomatic: 'Li Cheng, Lu Yi, Yan Gaoqing, Yuan Lüqian, Xu Yuan, Zhang Xun, Zhang Jieran, Jiang Qing, Pang Jian, and others were posthumously honored; their descendants were found and richly rewarded with office.',
  },
  s0233: {
    literal: 'Civil and military officials of third rank and above were granted one noble rank; those of fourth rank and below received one step of promotion.',
    idiomatic: 'Officials of third rank and above gained one noble rank; those of fourth rank and below, one promotion.',
  },
  s0234: {
    literal: 'Five days of public feasting were granted.',
    idiomatic: 'The court granted five days of public revelry.',
  },
  s0235: {
    literal: 'Prince of Nanyang Li Xi was advanced to Prince of Zhao; Prince of Xincheng Li Jin to Prince of Peng; Prince of Yingchuan Li Tan to Prince of Yan.',
    idiomatic: 'Li Xi, Prince of Nanyang, became Prince of Zhao; Li Jin, Prince of Xincheng, Prince of Peng; Li Tan, Prince of Yingchuan, Prince of Yan.',
  },
  s0236: {
    literal: 'The seventh son Ting was made Prince of Jing; the ninth son Huang Prince of Xiang; the tenth son Zhao Prince of Xing; the eleventh son Chui Prince of Qi; the twelfth son Tong Prince of Ding.',
    idiomatic: 'The seventh son, Ting, was made Prince of Jing; the ninth, Huang, Prince of Xiang; the tenth, Zhao, Prince of Xing; the eleventh, Chui, Prince of Qi; the twelfth, Tong, Prince of Ding.',
  },
  s0237: {
    literal: 'On jiazi the Retired Emperor took Xuanzheng Hall and handed the emperor the seal of transmission; the emperor received it below the hall steps, weeping.',
    idiomatic: 'On jiazi the Retired Emperor sat in Xuanzheng Hall and passed down the imperial seal; the emperor accepted it at the foot of the steps in tears.',
  },
  s0238: {
    literal: 'On jichou the rebel general and false Fanyang military commissioner Shi Siming, with registers of his eighty thousand troops, and the false Hedong commissioner Gao Xiuyan jointly submitted memorials of surrender.',
    idiomatic: 'On jichou Shi Siming, the rebels\' Fanyang commissioner, submitted rolls listing eighty thousand men, and Gao Xiuyan, false Hedong commissioner, joined him in surrender.',
  },
  s0239: {
    literal: 'On gengwu an edict said: "The minister\'s integrity admits only death, never two masters;',
    idiomatic: 'On gengwu an edict declared: "A loyal minister serves one master unto death;',
  },
  s0240: {
    literal: 'the body politic treats rebellion as warrant for execution.',
    idiomatic: 'the state knows no mercy for traitors.',
  },
  s0241: {
    literal: 'How much more those who pledged themselves to the rebel court, rested at ease in treason, lingered in office enjoying favor year after year, heedless of righteousness, and lent their strength to the enemy—if such men may be spared, what use is the law?',
    idiomatic: 'How much worse those who bowed to the rebel court, fattened on treason\'s favor, and year after year served the enemy—if they may live, what force has law?',
  },
  s0242: {
    literal: 'Daxi Xun and others had held posts at the highest councils, standing at the summit of subjecthood;',
    idiomatic: 'Daxi Xun and his like sat in the highest councils, at the very peak of office;',
  },
  s0243: {
    literal: 'some had known favor through generations, linked by marriage to the imperial kin;',
    idiomatic: 'some were heirs to generations of grace, bound to the throne by marriage;',
  },
  s0244: {
    literal: 'some had risen through the secretariat, or held posts reaching inside and outside the court.',
    idiomatic: 'some had climbed the secretariat ladder or held posts that bridged palace and realm.',
  },
  s0245: {
    literal: 'Even dogs and horses, the meanest of beasts, know devotion to their master;',
    idiomatic: 'Even dogs and horses, meanest of creatures, know their master;',
  },
  s0246: {
    literal: 'turtles and serpents, creatures of dull motion, can repay a kindness.',
    idiomatic: 'turtles and serpents, low and crawling, can repay a debt.',
  },
  s0247: {
    literal: 'Can it be said of human ministers that none felt gratitude?',
    idiomatic: 'Are human ministers alone devoid of gratitude?',
  },
  s0248: {
    literal: 'Since the rebel barbarian raised chaos and overturned the realm, every commoner has nursed wrath; those who gave their lives for the state are beyond counting.',
    idiomatic: 'Since the rebel scourge overturned the realm, every subject has burned with outrage; the dead who gave their lives for the state cannot be numbered.',
  },
  s0249: {
    literal: 'Even such common folk did not betray the state\'s grace.',
    idiomatic: 'Even the humblest folk did not turn against the throne.',
  },
  s0250: {
    literal: 'Yet these took office among owls and jackals, plotted with wolves and vipers—speaking plainly of such hearts, how can pardon be granted?',
    idiomatic: 'Yet these took counsel among owls and jackals, plotted with wolves and vipers—how can such hearts be spared?',
  },
  s0251: {
    literal: 'The eighteen including Daxi Xun should all be executed;',
    idiomatic: 'Daxi Xun and seventeen others shall be executed;',
  },
  s0252: {
    literal: 'the seven including Chen Xilie should all be granted self-destruction;',
    idiomatic: 'Chen Xilie and six others shall be permitted to take their own lives;',
  },
  s0253: {
    literal: 'former grand judge of the Court of Judicial Review Zhang Jun is specially to be spared death and exiled to Hepu commandery.',
    idiomatic: 'Zhang Jun, former grand judge of the Court of Judicial Review, alone shall be spared and exiled to Hepu commandery.',
  },
  s0254: {
    literal: '」That day Daxi Xun and the others were beheaded at the Lone Willow south of the inner city\'s southwest corner, and the hundred officials were assembled to witness it.',
    idiomatic: '[Close of edict.] That day Daxi Xun and the rest were beheaded at the Lone Willow Tree southwest of the inner city, with the hundred officials summoned to watch.',
  },
  s0255: {
    literal: 'On the jiaxu new moon, first month of the third year of Qianyuan.',
    idiomatic: 'On the jiaxu new moon of the first month of Qianyuan 1.',
  },
  s0256: {
    literal: 'On wuyin the Retired Emperor took Xuanzheng Hall and invested the emperor with the honorific title Luminous Heaven, Cultured in War, Great Sage, Filially Attentive Emperor.',
    idiomatic: 'On wuyin the Retired Emperor sat in Xuanzheng Hall and bestowed the honorific Luminous Heaven, Cultured in War, Great Sage, Filially Attentive Emperor.',
  },
  s0257: {
    literal: 'Because the honorific contained the two characters "Great Sage," the emperor memorialized firmly declining; permission was not granted.',
    idiomatic: 'The emperor petitioned to decline the words Great Sage in the title; the court would not allow it.',
  },
  s0258: {
    literal: 'On yiyou an edict said: "Treasury goods lost in the chaos were first sent out for search and recovery; it is heard that subordinate officials use the occasion to harass the people—the search commissioners are all halted at once; let calm and order be the aim."',
    idiomatic: 'On yiyou an edict read: "Goods lost in the rebellion were to be recovered by search commissioners—but subordinates use the task to prey on the people. All such commissioners are halted; let order be restored."',
  },
  s0259: {
    literal: 'Three thousand palace women were released from within.',
    idiomatic: 'Three thousand palace women were released from the inner quarters.',
  },
  s0260: {
    literal: 'On gengyin a great review of the armies was held in the courtyard of Hanyuan Hall; the emperor watched from Qiluan Pavilion.',
    idiomatic: 'On gengyin the armies were mustered in review at Hanyuan Hall; the emperor watched from Qiluan Pavilion.',
  },
  s0261: {
    literal: 'On gengzi Lady Zhang, worthy consort, was invested as imperial consort.',
    idiomatic: 'On gengzi Lady Zhang, worthy consort, was elevated to imperial consort.',
  },
  s0262: {
    literal: 'On the guimao new moon of the second month the rebel general and false Ziqing commissioner Neng Yuanhao offered his territory in surrender; he was made Hebei pacification commissioner, and his son Yu was also granted rank and title.',
    idiomatic: 'On the guimao new moon Neng Yuanhao, the rebels\' Ziqing commissioner, surrendered his territory; he was made Hebei pacification commissioner and his son Yu received rank as well.',
  },
  s0263: {
    literal: 'On yisi the emperor visited Xingqing Palace and presented the Retired Emperor with the honorific Supreme Sovereign of the Utmost Way and Sacred Emperor.',
    idiomatic: 'On yisi at Xingqing Palace the emperor invested the Retired Emperor as Supreme Sovereign of the Utmost Way and Sacred Emperor.',
  },
  s0264: {
    literal: 'On dingwei he took Mingfeng Gate, granted a great amnesty to the realm, and changed the third year of Zhide to the first year of Qianyuan.',
    idiomatic: 'On dingwei he appeared at Mingfeng Gate, proclaimed a great amnesty, and renamed Zhide 3 to Qianyuan 1.',
  },
  s0265: {
    literal: 'Meritorious followers from Chengdu and Lingwu of third rank and above received office for one son; of fifth rank and below, entry qualification for one son; of sixth rank and below, promotion as appropriate.',
    idiomatic: 'Followers from Chengdu and Lingwu of third rank and above gained office for a son; fifth rank and below, examination entry for a son; sixth rank and below, promotion where merited.',
  },
  s0266: {
    literal: 'Those who died in the king\'s service, or who died in rebel-held territory refusing false appointment, were all posthumously ennobled.',
    idiomatic: 'Men who died in the state\'s service, or who perished in rebel lands refusing false office, were posthumously honored.',
  },
  s0267: {
    literal: 'Among officials who had served the rebels, those already interrogated had their crimes reduced one degree by precedent.',
    idiomatic: 'Collaborators already under investigation had their sentences reduced one grade.',
  },
  s0268: {
    literal: 'Henceforth those entering office through medicine or divination were to be treated by the same rules as those in the legal examinations.',
    idiomatic: 'Henceforth medical and divination candidates entered office under the same rules as legal specialists.',
  },
  s0269: {
    literal: 'Third month, guiyou new moon.',
    idiomatic: 'On the guiyou new moon of the third month.',
  },
  s0270: {
    literal: 'On jiaxu the commander-in-chief Prince of Chu Li Chu was renamed Prince of Cheng.',
    idiomatic: 'On jiaxu Li Chu, Prince of Chu and commander-in-chief, became Prince of Cheng.',
  },
  s0271: {
    literal: 'On yihai military commissioners were established in Shannan East Circuit, Henan, Huainan, and Jiangnan.',
    idiomatic: 'On yihai military commissioners were placed over Shannan East, Henan, Huainan, and Jiangnan.',
  },
  s0272: {
    literal: 'On xinmao, because of famine, the sale of wine was forbidden until after the wheat harvest, when the usual rules might apply.',
    idiomatic: 'On xinmao famine led to a ban on wine sales until the wheat harvest, when normal rules resumed.',
  },
  s0273: {
    literal: 'The Directorate of Astronomy became the Bureau of Celestial Offices, housed in Zhang Shougui\'s former residence in Chengnning Ward, with sixty posts filled.',
    idiomatic: 'The Directorate of Astronomy became the Bureau of Celestial Offices, installed in Zhang Shougui\'s Chengnning Ward mansion, with sixty new posts.',
  },
  s0274: {
    literal: 'On the guimao day of the fourth summer month, junior preceptor of the heir apparent and heir to Prince of Guo Li Ju was made Eastern Capital regent, Henan intendant, and commissioner for capital-region procurement and disposition.',
    idiomatic: 'On guimao of the fourth summer month Li Ju, junior preceptor of the heir apparent and heir to Prince of Guo, became Eastern Capital regent, Henan intendant, and commissioner for the capital region.',
  },
  s0275: {
    literal: 'On jiyou Imperial Consort Zhang was invested as empress.',
    idiomatic: 'On jiyou Imperial Consort Zhang was crowned empress.',
  },
  s0276: {
    literal: 'On xinhai the Nine Ancestral Temple was completed; the spirit tablets were escorted by full imperial equipage from Chang\'an Hall into the new temple.',
    idiomatic: 'On xinhai, with the Nine Ancestral Temple finished, spirit tablets were borne in full procession from Chang\'an Hall to the new shrine.',
  },
  s0277: {
    literal: 'On jiayin the emperor personally sacrificed at the Nine Ancestral Temple, then performed the suburban rites at the Round Altar, returning to the palace that day.',
    idiomatic: 'On jiayin the emperor sacrificed at the Nine Ancestral Temple, then at the Round Altar, and returned to the palace the same day.',
  },
  s0278: {
    literal: 'The next day he took Mingfeng Gate and granted a great amnesty to the realm.',
    idiomatic: 'The next day he appeared at Mingfeng Gate and proclaimed a great amnesty.',
  },
  s0279: {
    literal: 'On wuchen the emperor presented a refined-quartz gold furnace to Xingqing Palace.',
    idiomatic: 'On wuchen the emperor sent a gold furnace of refined quartz to Xingqing Palace.',
  },
  s0280: {
    literal: 'On the renshen new moon of the fifth month the Uyghurs and the Black-robed Arabs each sent envoys with tribute; at the Gate of Barbarian Submission they quarreled over precedence, and an edict ordered each embassy to enter by the left or right gate.',
    idiomatic: 'On the renshen new moon Uyghur and Black-robed Arab envoys arrived with tribute and quarreled over precedence at the Gate of Barbarian Submission; each embassy was told to enter by a separate gate.',
  },
  s0281: {
    literal: 'On renwu an edict said: "Recently, because the mad rebels disturbed order, military commissioners were placed in every circuit to oversee internal levies and the traffic of documents; with the addition of procurement commissioners, burdens only grew.',
    idiomatic: 'On renwu an edict read: "Since the rebels shattered order, every circuit gained a military commissioner to command levies and paperwork—and with procurement commissioners added, the burden only worsened.',
  },
  s0282: {
    literal: 'The procurement and promotion-and-demotion commissioners previously set in each circuit should be abolished."',
    idiomatic: 'The procurement and promotion commissioners in every circuit are abolished."',
  },
  s0283: {
    literal: 'On the night of guiwei the moon occulted the star before the Heart.',
    idiomatic: 'On the night of guiwei the moon passed before the star preceding the Heart constellation.',
  },
  s0284: {
    literal: 'On wuzi Henan military commissioner and vice director of the Secretariat Zhang Hao was made grand protector of Jingzhou and defender of that prefecture; Minister of Rites Cui Guangyuan was made Henan military commissioner.',
    idiomatic: 'On wuzi Zhang Hao, Henan commissioner and vice director, became grand protector of Jingzhou and its defender; Cui Guangyuan, minister of rites, took Henan command.',
  },
  s0285: {
    literal: 'On gengyin Prince of Cheng Li Chu was established as crown prince.',
    idiomatic: 'On gengyin Li Chu, Prince of Cheng, was named crown prince.',
  },
  s0286: {
    literal: 'Jingzhou chief administrator Ji Guangchen was sent to the Henan field headquarters to settle accounts and pursue the rebels in Hebei.',
    idiomatic: 'Ji Guangchen, chief administrator of Jingzhou, was dispatched to the Henan headquarters to settle accounts and join the Hebei campaign.',
  },
  s0287: {
    literal: 'On jiwei Director of the Secretariat Cui Yuan was made junior preceptor of the heir apparent; Minister of Justice and associate director Li Lin junior grand tutor of the heir apparent—both were removed from active governance.',
    idiomatic: 'On jiwei Cui Yuan, director of the Secretariat, became junior preceptor of the heir apparent; Li Lin, minister of justice and associate director, junior grand tutor—both left the council.',
  },
  s0288: {
    literal: 'Vice director of the Court of Imperial Sacrifices Wang Yu, knowing ritual affairs, was made vice director of the Secretariat and associate director of the Chancellery.',
    idiomatic: 'Wang Yu, vice director of the Court of Imperial Sacrifices and master of ritual, joined the council as vice director of the Secretariat and associate director of the Chancellery.',
  },
  s0289: {
    literal: 'On bingshen Prince of Dunhuang Li Chengcai died.',
    idiomatic: 'On bingshen Li Chengcai, Prince of Dunhuang, died.',
  },
  s0290: {
    literal: 'On the xinchou new moon of the sixth month Tokharistan and Kang sent envoys with tribute.',
    idiomatic: 'On the xinchou new moon envoys arrived from Tokharistan and Kang with tribute.',
  },
  s0291: {
    literal: 'On jiyou the Grand Unity Spirit Altar was first established east of the Round Altar.',
    idiomatic: 'On jiyou the Grand Unity Spirit Altar was erected east of the Round Altar.',
  },
  s0292: {
    literal: 'That day the chancellor Wang Yu was ordered to perform the sacrifice by proxy.',
    idiomatic: 'That day Chancellor Wang Yu was ordered to officiate at the rites.',
  },
  s0293: {
    literal: 'On the night of guichou the moon entered the Dipper\'s leading stars.',
    idiomatic: 'That night of guichou the moon passed into the Dipper\'s leading stars.',
  },
  s0294: {
    literal: 'On wuwu an edict said: "Those impeached by the Three Offices for accepting false rebel appointments have repeatedly received grace; the charges have been reduced step by step, and considering the facts their cases now approach those of common men—the interrogated should all be released."',
    idiomatic: 'On wuwu an edict declared: "Collaborators impeached by the Three Offices have already seen repeated leniency; their offenses have been reduced until their cases resemble those of ordinary men—all under investigation shall be released."',
  },
  s0295: {
    literal: '」 — closing quotation of the edict.',
    idiomatic: '[Close of edict.]',
  },
  s0296: {
    literal: 'On the xinwei new moon of the seventh autumn month the Tokharistan protector Ulida and chiefs of nine states came to court to aid the realm against the rebels; the emperor ordered them to the Shuofang field headquarters.',
    idiomatic: 'On the xinwei new moon Ulida, Tokharistan protector, and chiefs of nine states came to aid the campaign; the emperor sent them to the Shuofang headquarters.',
  },
  s0297: {
    literal: 'On bingxu new coin was first cast, inscribed Qianyuan Heavy Treasure, valued at ten and circulated alongside Kaiyuan Tongbao.',
    idiomatic: 'On bingxu new coin was cast—Qianyuan Heavy Treasure, ten to one Kaiyuan Tongbao—and put into circulation.',
  },
  s0298: {
    literal: 'On dinghai an edict made the emperor\'s second daughter Princess Ningguo marry the Uyghur qaghan Yingwu Weiyuan Piqie.',
    idiomatic: 'On dinghai Princess Ningguo, the emperor\'s second daughter, was given in marriage to the Uyghur qaghan Yingwu Weiyuan Piqie.',
  },
  s0299: {
    literal: 'On renyin of the eighth month Ji Guangchen, military commissioner of Qing, Xu, and five other prefectures, was made concurrent prefect of Xu; Cui Guangyuan, Henan military commissioner, was made concurrent prefect of Bian.',
    idiomatic: 'On renyin Ji Guangchen, commissioner of Qing, Xu, and five prefectures, also took Xu; Cui Guangyuan, Henan commissioner, also took Bian.',
  },
  s0300: {
    literal: 'Qing prefect Xu Shuji was made concurrent prefect of Hua and military commissioner of the six prefectures of Qing and Hua.',
    idiomatic: 'Xu Shuji, prefect of Qing, was made commissioner of Qing and Hua and concurrent prefect of Hua.',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/010.json';
const TRANS_PATH = 'translations/current_translation_jiutangshu.json';
const START = 201;
const END = 300;

function extractRange(chapterPath, startN, endN) {
  const data = JSON.parse(readFileSync(chapterPath, 'utf8'));
  const out = [];
  const seenIds = new Set();

  for (let blockIndex = 0; blockIndex < data.content.length; blockIndex++) {
    const block = data.content[blockIndex];
    let blockSentences = [];

    if (block.type === 'paragraph') {
      blockSentences = block.sentences;
    } else if (block.type === 'table_row') {
      blockSentences = block.cells.filter((cell) => cell.content && cell.content.trim());
    } else if (block.type === 'table_header') {
      blockSentences = block.sentences.filter((s) => s.zh && s.zh.trim());
    }

    for (const sentence of blockSentences) {
      const sentenceId = sentence.id;
      const n = parseInt(sentenceId.slice(1), 10);
      if (n < startN || n > endN) continue;

      let chineseText = '';
      if (block.type === 'paragraph' || block.type === 'table_header') {
        chineseText = sentence.zh;
      } else if (block.type === 'table_row') {
        chineseText = sentence.content;
      }

      let displayId = sentenceId;
      if (seenIds.has(displayId)) {
        displayId = `${sentenceId}@${blockIndex}`;
      }
      seenIds.add(displayId);

      out.push({
        id: displayId,
        originalId: sentenceId,
        blockIndex,
        chinese: chineseText,
        literal: '',
        idiomatic: '',
      });
    }
  }

  out.sort((a, b) => parseInt(a.originalId.slice(1), 10) - parseInt(b.originalId.slice(1), 10));
  return out;
}

const chapterPath = CHAPTER_PATH;
let trans = JSON.parse(readFileSync(TRANS_PATH, 'utf8'));
if (trans.metadata.chapter !== '010') {
  throw new Error(`Expected chapter 010, got ${trans.metadata.chapter}`);
}

const expectedIds = new Set(
  Array.from({ length: END - START + 1 }, (_, i) => `s${String(START + i).padStart(4, '0')}`)
);
const hasAll =
  trans.sentences.length >= END - START + 1 &&
  [...expectedIds].every((id) => trans.sentences.some((s) => (s.originalId || s.id) === id));

if (!hasAll) {
  const extracted = extractRange(chapterPath, START, END);
  const map = new Map(trans.sentences.map((s) => [s.originalId || s.id, s]));
  for (const s of extracted) {
    map.set(s.originalId, s);
  }
  trans.sentences = [...map.values()].sort(
    (a, b) => parseInt((a.originalId || a.id).slice(1), 10) - parseInt((b.originalId || b.id).slice(1), 10)
  );
}

let applied = 0;
for (const s of trans.sentences) {
  const key = s.originalId || s.id;
  const pair = T[key];
  if (!pair) continue;
  if (pair.literal === pair.idiomatic) {
    throw new Error(`${key}: literal and idiomatic must differ`);
  }
  s.literal = pair.literal;
  s.idiomatic = pair.idiomatic;
  applied++;
}

const missing = [...expectedIds].filter(
  (id) => !trans.sentences.some((s) => (s.originalId || s.id) === id && s.idiomatic)
);
if (missing.length) {
  throw new Error(`Missing translations for: ${missing.join(', ')}`);
}
if (applied !== Object.keys(T).length) {
  throw new Error(`Applied ${applied}, expected ${Object.keys(T).length}`);
}

writeFileSync(TRANS_PATH, JSON.stringify(trans, null, 2) + '\n');
console.log('Applied', applied, 'translations (s' + String(START).padStart(4, '0') + '–s' + String(END).padStart(4, '0') + ')');
