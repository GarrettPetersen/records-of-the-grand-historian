#!/usr/bin/env node
/** Batch 3: s0201–s0300 (Jiutangshu ch.009, Xuanzong 2 — Tianbao 2–7, Yang Guifei, Wei Jian purge) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0201: {
    literal: 'Gao Yao was posthumously honored as Emperor Deming.',
    idiomatic: 'Gao Yao was posthumously enshrined as Emperor Deming.',
  },
  s0202: {
    literal: 'The Xuan Yuan temple in the western capital was renamed Grand Pure Palace; in the eastern capital, Grand Aperture Palace; in all commanderies, Purple Pole Palace.',
    idiomatic: 'The western capital\'s temple to the Mysterious Origin was renamed Grand Pure Palace; Luoyang\'s became Grand Aperture Palace; every commandery temple became Purple Pole Palace.',
  },
  s0203: {
    literal: 'Wei Jian completed opening the Guangyun Canal and arrayed many ships in display.',
    idiomatic: 'Wei Jian finished the Guangyun Canal and staged a great fleet upon its waters.',
  },
  s0204: {
    literal: 'On bingyin the emperor went to the Guangyun Tower to view them and returned to the palace the same day.',
    idiomatic: 'On bingyin the emperor visited the Guangyun Tower to watch the spectacle and returned to the palace that same day.',
  },
  s0205: {
    literal: 'On the night of jiaxu in the sixth summer month, lightning struck the Yingtian Gate observatory in the eastern capital; fire spread to the left and right Yanfu gates and burned for a day without going out.',
    idiomatic: 'On the night of jiaxu in the sixth summer month lightning shattered the Yingtian Gate observatory at Luoyang; flames reached the Yanfu gates on either side and burned all day without dying.',
  },
  s0206: {
    literal: 'On guichou of the seventh month, retired minister of rites Wang Qiu died.',
    idiomatic: 'On guichou of the seventh month Wang Qiu, retired minister of rites, died.',
  },
  s0207: {
    literal: 'On bingchen, right vice director of the Department of State Affairs Pei Yaoqing died.',
    idiomatic: 'On bingchen Pei Yaoqing, right vice director of the Department of State Affairs, died.',
  },
  s0208: {
    literal: 'In the ninth month, junior tutor of the heir apparent Cui Lin died.',
    idiomatic: 'In the ninth month Cui Lin, junior tutor of the heir apparent, died.',
  },
  s0209: {
    literal: 'On xinyou, the Purple Pole Palace in Qiao commandery was renamed Grand Pure Palace.',
    idiomatic: 'On xinyou the Purple Pole Palace in Qiao commandery was renamed Grand Pure Palace.',
  },
  s0210: {
    literal: 'On wuchen of the tenth winter month, heir apparent grand protector and Prince of Xin\'an Li Yi died.',
    idiomatic: 'On wuchen of the tenth winter month Li Yi, heir apparent grand protector and Prince of Xin\'an, died.',
  },
  s0211: {
    literal: 'On wuyin, he went to the hot springs palace.',
    idiomatic: 'On wuyin he went to the hot springs palace.',
  },
  s0212: {
    literal: 'On yimao of the eleventh month, he returned from the hot springs palace.',
    idiomatic: 'On yimao of the eleventh month he returned from the hot springs palace.',
  },
  s0213: {
    literal: 'On jihai of the twelfth month, the Yingtian Gate of the eastern capital was renamed Qianyuan Gate.',
    idiomatic: 'On jihai of the twelfth month Luoyang\'s Yingtian Gate was renamed Qianyuan Gate.',
  },
  s0214: {
    literal: 'On wushen, he went to the hot springs palace.',
    idiomatic: 'On wushen he went to the hot springs palace.',
  },
  s0215: {
    literal: 'On bingchen, he returned from the hot springs palace.',
    idiomatic: 'On bingchen he returned from the hot springs palace.',
  },
  s0216: {
    literal: 'On yiyou of the twelfth month, heir apparent guest He Zhizhang requested to be ordained a Daoist and return home.',
    idiomatic: 'On yiyou of the twelfth month He Zhizhang, guest of the heir apparent, asked to take Daoist orders and go home.',
  },
  s0217: {
    literal: 'That winter there was no snow.',
    idiomatic: 'That winter no snow fell.',
  },
  s0218: {
    literal: 'On the new moon of bingchen, first month of Tianbao 3, the era name was changed so that nian became zai.',
    idiomatic: 'On the bingchen new moon of the first month of Tianbao 3 the era word nian was changed to zai.',
  },
  s0219: {
    literal: 'An amnesty was granted to prisoners in custody.',
    idiomatic: 'An amnesty was granted to prisoners still in custody.',
  },
  s0220: {
    literal: 'On gengzi, the left and right chancellors and officials below escorted He Zhizhang to bid farewell at Changle Slope; the emperor composed a poem and presented it as a gift.',
    idiomatic: 'On gengzi the left and right chancellors and all officials below them saw He Zhizhang off at Changle Slope; the emperor wrote him a parting poem.',
  },
  s0221: {
    literal: 'On renyin, he went to the hot springs palace.',
    idiomatic: 'On renyin he went to the hot springs palace.',
  },
  s0222: {
    literal: 'On jisi of the second month, he returned to the capital.',
    idiomatic: 'On jisi of the second month he returned to the capital.',
  },
  s0223: {
    literal: 'On dingchou, the emperor\'s younger brother Lin was made successor Prince of Ning; the former Prince of Bin\'s son Chengning was made successor Prince of Bin; the emperor\'s younger brother Shan was made successor Prince of Shen; the late Prince Huixuan\'s son Zhen was made successor Prince of Qi; Yuan was made successor Prince of Xue.',
    idiomatic: 'On dingchou Lin was made successor Prince of Ning; Chengning, son of the former Prince of Bin, successor Prince of Bin; Shan successor Prince of Shen; Zhen, son of the late Prince Huixuan, successor Prince of Qi; and Yuan successor Prince of Xue.',
  },
  s0224: {
    literal: 'On gengyin, the crown prince Shao was renamed Heng.',
    idiomatic: 'On gengyin the crown prince Shao was renamed Heng.',
  },
  s0225: {
    literal: 'That month, Henan intendant Pei Dunfu died.',
    idiomatic: 'That month Pei Dunfu, intendant of Henan, died.',
  },
  s0226: {
    literal: 'On xinhai of the intercalary month, a star like the moon fell in the southeast; after it fell there was a sound.',
    idiomatic: 'On xinhai of the intercalary month a moon-sized star fell in the southeast, and a sound followed its fall.',
  },
  s0227: {
    literal: 'Rumors spread in the capital that officials were sending sticks to seize people\'s livers for sacrifice to the Heavenly Dog.',
    idiomatic: 'The capital buzzed with rumor that the court was dispatching clubs to seize human livers as offerings to the Heavenly Dog.',
  },
  s0228: {
    literal: 'People were mutually terrified; the metropolitan counties were especially affected; envoys were sent to reassure them.',
    idiomatic: 'Panic spread among the people, worst in the metropolitan counties; the court sent envoys to calm them.',
  },
  s0229: {
    literal: 'On gengwu of the third month, Wuwei commandery reported that at Mount Tianbao in Fanhe county a sweet spring had welled up and ridge stones had turned into auspicious wheat; the poor from near and far took it for food.',
    idiomatic: 'On gengwu of the third month Wuwei reported that at Mount Tianbao in Fanhe a sweet spring had burst forth and cliff stone had become miraculous grain, which the poor came from far and near to eat.',
  },
  s0230: {
    literal: 'Fanhe was renamed Tianbao county.',
    idiomatic: 'Fanhe county was renamed Tianbao.',
  },
  s0231: {
    literal: 'On guiyou, an edict ordered that among prisoners in custody, those sentenced to death were reduced to exile, and those exiled or below were all pardoned.',
    idiomatic: 'On guiyou an edict commuted death sentences to exile and pardoned all prisoners at exile or below.',
  },
  s0232: {
    literal: 'In the fourth summer month, Nanhai protector Liu Juxi defeated the pirate Wu Lingguang and pacified Yongjia commandery.',
    idiomatic: 'In the fourth summer month Liu Juxi, protector of Nanhai, crushed the pirate Wu Lingguang and pacified Yongjia commandery.',
  },
  s0233: {
    literal: 'An edict ordered commanderies in both capitals and throughout the empire to cast one bronze statue each of the Heavenly Worthy and of the Buddha from official goods, and send them to Kaiyuan Abbey and Kaiyuan Monastery.',
    idiomatic: 'An edict ordered every commandery in the two capitals and the realm to cast from official bronze one image each of the Heavenly Worthy and the Buddha and send them to Kaiyuan Abbey and Kaiyuan Monastery.',
  },
  s0234: {
    literal: 'On wuyin of the fifth month, Chang\'an magistrate Liu Sheng was executed in the court hall for corruption.',
    idiomatic: 'On wuyin of the fifth month Liu Sheng, magistrate of Chang\'an, was beaten to death in open court for corruption.',
  },
  s0235: {
    literal: 'On bingwu of the eighth autumn month, the Basmyl qaghan of the Nine Surnames attacked and killed the Turk qaghan Wushimi, and his head was sent to the capital.',
    idiomatic: 'On bingwu of the eighth autumn month the Basmyl qaghan of the Nine Surnames slew the Turk qaghan Wushimi and sent his head to court.',
  },
  s0236: {
    literal: 'On gengshen, civil and military officials inside and outside the court from sixth rank downward were hereafter, after taking up their posts, allowed to complete their merit review upon two hundred full days of service.',
    idiomatic: 'On gengshen an edict granted civil and military officials of sixth rank and below, once two hundred days in post had elapsed, the right to a completed merit review.',
  },
  s0237: {
    literal: 'On guisi of the tenth winter month, he went to the hot springs palace.',
    idiomatic: 'On guisi of the tenth winter month he went to the hot springs palace.',
  },
  s0238: {
    literal: 'On dingwei, State of Shi was renamed State of Laiwei.',
    idiomatic: 'On dingwei the State of Shi was renamed State of Laiwei.',
  },
  s0239: {
    literal: 'On guimao of the eleventh month, he returned to the capital.',
    idiomatic: 'On guimao of the eleventh month he returned to the capital.',
  },
  s0240: {
    literal: 'On guichou, each zai as before on the fourteenth, fifteenth, and sixteenth of the first month the ward gates were opened and lamps lit—a perpetual statute.',
    idiomatic: 'On guichou it was made perpetual law that on the fourteenth, fifteenth, and sixteenth of the first month each year ward gates should open and festival lamps burn.',
  },
  s0241: {
    literal: 'Princess Yuzhen had earlier become a female Daoist; she was granted title and a substantive fief, and the name Chiying was bestowed.',
    idiomatic: 'Princess Yuzhen, already a female Daoist, received a title and substantive fief; the name Chiying was bestowed on her.',
  },
  s0242: {
    literal: 'On jiawu of the twelfth month, Huichang county was established by dividing Xinfeng county.',
    idiomatic: 'On jiawu of the twelfth month Huichang county was carved from Xinfeng.',
  },
  s0243: {
    literal: 'On jiayin, he personally sacrificed to the Nine Palaces Noble Spirits at the eastern suburban altar; when the rites were finished, a great amnesty was granted throughout the empire.',
    idiomatic: 'On jiayin he sacrificed in person to the Nine Palaces spirits at the eastern suburb; when the rites ended he proclaimed a great amnesty for the realm.',
  },
  s0244: {
    literal: 'Commoners eighteen and above were made zhongnan; twenty-three and above counted as adult males.',
    idiomatic: 'Men eighteen and older were classed as zhongnan; at twenty-three they counted as adult males liable for service.',
  },
  s0245: {
    literal: 'Each year\'s corvée and land-tax levy was to begin collection in the eighth month and could be extended to the ninth.',
    idiomatic: 'Annual corvée and land-tax collection might begin in the eighth month and run into the ninth.',
  },
  s0246: {
    literal: 'An edict ordered that every household throughout the empire keep one copy of the Classic of Filial Piety.',
    idiomatic: 'An edict required every household in the empire to keep a copy of the Classic of Filial Piety.',
  },
  s0247: {
    literal: 'On jiashen of the third spring month of Tianbao 4, he feasted the host of officials at the Qinzheng Tower.',
    idiomatic: 'On jiashen of the third spring month of Tianbao 4 he feasted the officials at the Qinzheng Tower.',
  },
  s0248: {
    literal: 'On renshen, an external granddaughter of the Dugu clan was created Princess Jingle and married to Khitan Songmo protector Li Huaijie.',
    idiomatic: 'On renshen a Dugu granddaughter was created Princess Jingle and sent to marry Khitan Songmo protector Li Huaijie.',
  },
  s0249: {
    literal: 'An external granddaughter of the Yang clan was created Princess Yifang and married to Xi Raole protector Li Yanchong.',
    idiomatic: 'A Yang granddaughter was created Princess Yifang and sent to marry Xi Raole protector Li Yanchong.',
  },
  s0250: {
    literal: 'On jiachen of the eighth autumn month, Noble Consort True Yang was installed as imperial consort.',
    idiomatic: 'On jiachen of the eighth autumn month Lady Yang, consort of Taizhen rank, was elevated to imperial consort.',
  },
  s0251: {
    literal: 'That month, eight commanderies including Suiyang, Huaiyang, and Qiao in Henan suffered great floods.',
    idiomatic: 'That month great floods struck eight Henan commanderies, including Suiyang, Huaiyang, and Qiao.',
  },
  s0252: {
    literal: 'In the ninth month, Khitan and Xi chieftains each killed their princesses and rose in rebellion with their tribes.',
    idiomatic: 'In the ninth month Khitan and Xi chiefs each slew their Tang princesses and led their tribes in revolt.',
  },
  s0253: {
    literal: 'Longyou military commissioner Huangfu Weiming fought Tibetans at Stone Fortress City; the government army was unsuccessful and deputy commander Chu Zhilian and others were killed.',
    idiomatic: 'At Stone Fortress City Huangfu Weiming, commissioner of Longyou, fought Tibetans and lost; deputy commander Chu Zhilian and others fell.',
  },
  s0254: {
    literal: 'In the tenth winter month, Jinhe county was established at the Chanyu Protectorate and Yinshan county at the Anbei Protectorate.',
    idiomatic: 'In the tenth winter month Jinhe county was set up under the Chanyu Protectorate and Yinshan under Anbei.',
  },
  s0255: {
    literal: 'On dingyou, he went to the hot springs palace.',
    idiomatic: 'On dingyou he went to the hot springs palace.',
  },
  s0256: {
    literal: 'On renzi, Huichang county was made Tongjing county.',
    idiomatic: 'On renzi Huichang county was renamed Tongjing.',
  },
  s0257: {
    literal: 'On wuxu of the twelfth month, he returned to the capital.',
    idiomatic: 'On wuxu of the twelfth month he returned to the capital.',
  },
  s0258: {
    literal: 'On guiyou of the first spring month of Tianbao 5, minister of punishments Wei Jian was demoted to protector of Kuocang;',
    idiomatic: 'On guiyou of the first spring month of Tianbao 5 Wei Jian, minister of punishments, was demoted to protector of Kuocang;',
  },
  s0259: {
    literal: 'Longyou military commissioner Huangfu Weiming was demoted to protector of Bo River; soon both were ordered executed in Qianzhong.',
    idiomatic: 'Huangfu Weiming, commissioner of Longyou, was demoted to protector of Bo River—and soon both men were ordered executed in Qianzhong.',
  },
  s0260: {
    literal: 'On yihai, an edict ordered that magistrates of large and small counties alike would, like metropolitan officials, complete three selections before being summoned to court.',
    idiomatic: 'On yihai an edict required magistrates of every county, like capital officials, to pass three selections before being summoned.',
  },
  s0261: {
    literal: 'Record of Rites Monthly Ordinances was renamed Seasonal Ordinances.',
    idiomatic: 'The Record of Rites Monthly Ordinances was retitled Seasonal Ordinances.',
  },
  s0262: {
    literal: 'Mount Song was enfeoffed as King of Central Heaven, Mount Heng of the south as King of Heaven of Offices, Mount Heng of the north as King of Peaceful Heaven.',
    idiomatic: 'Mount Song was enfeoffed King of Central Heaven; the southern Mount Heng, King of Heaven of Offices; the northern Mount Heng, King of Peaceful Heaven.',
  },
  s0263: {
    literal: 'Mountains and waters throughout the empire—many names duplicated or were improper, often from vulgar local sayings; the relevant offices were ordered to correct them according to maps and registers.',
    idiomatic: 'Mountains and rivers across the realm bore duplicate or improper names, many from vulgar local usage; each office was ordered to rectify them against the official maps.',
  },
  s0264: {
    literal: 'On bingzi, minister of rites Xi Yu and left assistant director Cui Qiao, censor-in-chief Wang Hong, and seven others were dispatched throughout the empire to promote and demote officials.',
    idiomatic: 'On bingzi Xi Yu, minister of rites, Cui Qiao, left assistant director, Wang Hong, censor-in-chief, and seven others were sent through the realm to promote and demote officials.',
  },
  s0265: {
    literal: 'On gengyin of the fourth summer month, left chancellor and Count of Weiyuan Li Shizhi became grand protector of the heir apparent and ceased to manage government.',
    idiomatic: 'On gengyin of the fourth summer month Li Shizhi, left chancellor and Count of Weiyuan, became grand protector of the heir apparent and left the council.',
  },
  s0266: {
    literal: 'On dingyou, Yellow Gate vice minister Chen Xilie became co-equal Zhongshu Menxia chief minister.',
    idiomatic: 'On dingyou Chen Xilie, yellow gate vice minister, joined the council as co-equal chief minister.',
  },
  s0267: {
    literal: 'On gengshen of the fifth month, an edict ordered that on each decanal holiday the Zhongshu Menxia civil and military officials need not attend court, and outside officials need not assemble at their yamen.',
    idiomatic: 'On gengshen of the fifth month an edict freed Zhongshu Menxia officials from court on decanal holidays and outside officials from yamen assembly.',
  },
  s0268: {
    literal: 'On guimao, the county practice of assessing white-service corvée money was stopped.',
    idiomatic: 'On guimao the counties ceased levying white-service corvée money.',
  },
  s0269: {
    literal: 'In the sixth month, an edict ordered that during the three fu periods chancellors might return home at chen hour.',
    idiomatic: 'In the sixth month an edict allowed chancellors to leave office at chen hour during the three fu periods.',
  },
  s0270: {
    literal: 'On bingzi of the seventh autumn month, Wei Jian was framed by Li Linfu, sentenced to exile to Linfeng commandery, and granted death.',
    idiomatic: 'On bingzi of the seventh autumn month Li Linfu framed Wei Jian; sentenced to exile at Linfeng, he was granted death.',
  },
  s0271: {
    literal: 'Wei Jian\'s sister, the crown prince\'s consort, was ordered to divorce; his external nephew, successor Prince of Xue Yuan, was demoted to Baling prefect; his son-in-law Baling protector Lu Youlin was exiled far to Hepu commandery.',
    idiomatic: 'Wei Jian\'s sister, the crown prince\'s consort, was made to divorce; his nephew, successor Prince of Xue Yuan, was demoted to Baling prefect; his son-in-law Lu Youlin, protector of Baling, was exiled to Hepu.',
  },
  s0272: {
    literal: 'Grand protector of the heir apparent Li Shizhi was demoted to Yichun protector; upon reaching his post he took poison and died.',
    idiomatic: 'Li Shizhi, grand protector of the heir apparent, was demoted to Yichun; on reaching his post he drank poison and died.',
  },
  s0273: {
    literal: 'In the eighth month, vice minister of revenue Guo Xuji was made censor-in-chief and Jiannan military commissioner.',
    idiomatic: 'In the eighth month Guo Xuji, vice minister of revenue, became censor-in-chief and Jiannan military commissioner.',
  },
  s0274: {
    literal: 'On renzi of the ninth month, stone images of Li Linfu and Chen Xilie were carved at the Grand Pure Palace and placed beside the sage\'s portrait.',
    idiomatic: 'On renzi of the ninth month stone images of Li Linfu and Chen Xilie were carved at the Grand Pure Palace and set beside the sage\'s likeness.',
  },
  s0275: {
    literal: 'On dingyou of the tenth winter month, he went to the hot springs palace.',
    idiomatic: 'On dingyou of the tenth winter month he went to the hot springs palace.',
  },
  s0276: {
    literal: 'Linzi commandery was renamed Jinan commandery.',
    idiomatic: 'Linzi commandery was renamed Jinan.',
  },
  s0277: {
    literal: 'On jisi of the eleventh month, he returned to the capital.',
    idiomatic: 'On jisi of the eleventh month he returned to the capital.',
  },
  s0278: {
    literal: 'On xinwei of the twelfth month, good-order grandee Du Youlin, Director of Composition Wang Zeng, left Yaoqiwei military assessor Liu Ji, and others were framed by Li Linfu; all were imprisoned and put to death.',
    idiomatic: 'On xinwei of the twelfth month Du Youlin, good-order grandee, Wang Zeng, director of composition, Liu Ji, left Yaoqiwei assessor, and others were framed by Li Linfu and died in prison.',
  },
  s0279: {
    literal: 'On the new moon of xinsi, first month of Tianbao 6, Beihai protector Li Yong and Zichuan protector Pei Dunfu, implicated through Wang Zeng and Liu Ji, were dispatched and killed on the spot.',
    idiomatic: 'On the xinsi new moon of the first month of Tianbao 6 Li Yong of Beihai and Pei Dunfu of Zichuan, implicated through Wang Zeng and Liu Ji, were met on the road and executed.',
  },
  s0280: {
    literal: 'On dinghai, he personally sacrificed at the Imperial Ancestral Temple.',
    idiomatic: 'On dinghai he sacrificed in person at the Imperial Ancestral Temple.',
  },
  s0281: {
    literal: 'On wuzi, he personally sacrificed at the Round Altar; when the rites were finished a great amnesty was granted throughout the empire; strangulation and decapitation were removed—only heavy beating was imposed.',
    idiomatic: 'On wuzi he sacrificed at the Round Altar; when the rites ended he proclaimed a great amnesty, abolishing strangulation and decapitation in favor of heavy rod punishment.',
  },
  s0282: {
    literal: 'Temples to the Three Sovereigns and Five Emperors were established in the capital and sacrifices were offered seasonally.',
    idiomatic: 'Temples to the Three Sovereigns and Five Emperors were built in the capital and honored on the seasonal schedule.',
  },
  s0283: {
    literal: 'Crown princes Zhanghuai, Jiemin, Huizhuang, Huiwen, and Huixuan should share one temple with the hidden crown prince and the Posthumous Virtue crown prince.',
    idiomatic: 'Crown princes Zhanghuai, Jiemin, Huizhuang, Huiwen, and Huixuan were to share one temple with the Hidden Crown Prince and the Posthumous Virtue Crown Prince.',
  },
  s0284: {
    literal: 'Daily standing-ration food and setting guards in the courtyard were afterward all to be abolished.',
    idiomatic: 'Daily rations for the standing guard and the courtyard guard-mount were abolished.',
  },
  s0285: {
    literal: 'Since the five sacred mountains had been enfeoffed as kings, the four streams should be raised to duke: Yellow River as Duke of Spiritual Source, Ji as Duke of Clear Source, Yangtze as Duke of Broad Source, Huai as Duke of Long Source.',
    idiomatic: 'With the five mountains already enfeoffed as kings, the four rivers were raised to duke: the Yellow River, Duke of Spiritual Source; the Ji, Duke of Clear Source; the Yangtze, Duke of Broad Source; the Huai, Duke of Long Source.',
  },
  s0286: {
    literal: 'On wuxu of the third month, Nanhai protector Peng Guo was convicted of corruption, beaten with the staff, and exiled far to Qinxi commandery; he died on the road.',
    idiomatic: 'On wuxu of the third month Peng Guo, protector of Nanhai, was beaten for corruption and exiled to Qinxi; he died on the way.',
  },
  s0287: {
    literal: 'On wuwu of the fourth summer month, Yellow Gate vice minister Chen Xilie became left chancellor and concurrent minister of war.',
    idiomatic: 'On wuwu of the fourth summer month Chen Xilie became left chancellor and minister of war.',
  },
  s0288: {
    literal: 'On guiyou, the Directorate of Armaments was reestablished.',
    idiomatic: 'On guiyou the Directorate of Armaments was restored.',
  },
  s0289: {
    literal: 'From the fifth month there was no rain until the seventh autumn month.',
    idiomatic: 'From the fifth month no rain fell until the seventh autumn month.',
  },
  s0290: {
    literal: 'On yiyou, because of drought, chancellors, censorial and temple offices, and prefectural and county authorities were ordered to record prisoners in custody; death sentences were commuted to beating and exile, and penal servitude and below were specially pardoned.',
    idiomatic: 'On yiyou, with drought gripping the land, chancellors, censorial and temple offices, and every prefecture and county were ordered to review prisoners; death sentences became beating and exile, and penal servitude or less was pardoned.',
  },
  s0291: {
    literal: 'On gengyin rain began.',
    idiomatic: 'On gengyin rain at last fell.',
  },
  s0292: {
    literal: 'On wushen of the tenth winter month, he went to the hot springs palace, which was renamed Huaqing Palace.',
    idiomatic: 'On wushen of the tenth winter month he went to the hot springs palace, now renamed Huaqing Palace.',
  },
  s0293: {
    literal: 'On yihai of the eleventh month, vice minister of revenue Yang Shenjin and his elder brother, vice director of the palace workshops Shenyu, and his younger brother Luoyang magistrate Shenming were all framed by Li Linfu and censor-in-chief Wang Hong and died in prison.',
    idiomatic: 'On yihai of the eleventh month Yang Shenjin, vice minister of revenue, his brother Shenyu of the palace workshops, and his brother Shenming, magistrate of Luoyang, were framed by Li Linfu and Wang Hong and died in prison.',
  },
  s0294: {
    literal: 'On bingchen of the twelfth month, minister of works Lu Jingrong died.',
    idiomatic: 'On bingchen of the twelfth month Lu Jingrong, minister of works, died.',
  },
  s0295: {
    literal: 'On renxu, he returned to the capital.',
    idiomatic: 'On renxu he returned to the capital.',
  },
  s0296: {
    literal: 'On jimao of the first spring month of Tianbao 7, minister of rites Xi Yu died.',
    idiomatic: 'On jimao of the first spring month of Tianbao 7 Xi Yu, minister of rites, died.',
  },
  s0297: {
    literal: 'On jihai, Wei Jiang memorialized that imperial couch quilts, drapes, curtains, etc. should remove purple and use red-yellow; the request was granted.',
    idiomatic: 'On jihai Wei Jiang asked that imperial bedding and hangings drop purple for red-yellow; the court agreed.',
  },
  s0298: {
    literal: 'On yiyou of the third month, a jade fungus grew on a pillar of the Datong Hall, with divine light illuminating the hall.',
    idiomatic: 'On yiyou of the third month a jade fungus sprouted on a Datong Hall pillar, and a sacred light filled the hall.',
  },
  s0299: {
    literal: 'The host of officials requested adding to the emperor\'s honorific title "Kaiyuan Tianbao Sacred-Cultured Divinely Martial Responsive-to-the-Way"; permission was granted.',
    idiomatic: 'Officials petitioned to add to the emperor\'s honorific the phrase Kaiyuan Tianbao Sacred-Cultured Divinely Martial Responsive-to-the-Way; he assented.',
  },
  s0300: {
    literal: 'On xinchou of the fourth summer month, Gao Lishi was made chief general of swift cavalry.',
    idiomatic: 'On xinchou of the fourth summer month Gao Lishi was made chief general of swift cavalry.',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/009.json';
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
if (trans.metadata.chapter !== '009') {
  throw new Error(`Expected chapter 009, got ${trans.metadata.chapter}`);
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

