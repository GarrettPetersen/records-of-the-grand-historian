/** Fix 116 identical literal/idiomatic pairs in jiuwudaishi chapter 007 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const patch = {
  s0009: {
    literal: "Teng was the son of Tang Vice Minister of Revenue Cui Jie.",
    idiomatic: "He was the son of Tang Vice Minister of Revenue Cui Jie.",
  },
  s0013: {
    literal: "On bingxu the authorities memorialized on the first-spring offering at the Imperial Ancestral Temple; the Emperor ordered Chancellor Du Xiao to perform the rites as proxy.",
    idiomatic: "On bingxu the court reported on the spring ancestral offering; the Emperor had Chancellor Du Xiao conduct the rite in his stead.",
  },
  s0014: {
    literal: "On the night of bingshen, Mars trespassed the second star of Fang.",
    idiomatic: "On the night of bingshen, Mars encroached on the second star of the Fang asterism.",
  },
  s0016: {
    literal: "《Five Dynasties Huiyao》: In the second month the late Weibo Military Commissioner Luo Hongxin was posthumously enfeoffed as Prince of Zhao.",
    idiomatic: "《Five Dynasties Huiyao》: In the second month the court posthumously enfeoffed the late Weibo commissioner Luo Hongxin as Prince of Zhao.",
  },
  s0019: {
    literal: "On renxu the Emperor was about to tour the northern frontier; court and country were placed on alert; an edict appointed Henan Intendant, Keeper of the Secretariat, and Director of the Six Armies Zhang Zongshi Grand Inner Custodian.",
    idiomatic: "On renxu, as the Emperor prepared to inspect the northern border, court and realm went on alert; Zhang Zongshi, Henan intendant, keeper of the Secretariat, and director of the Six Armies, was named Grand Inner Custodian.",
  },
  s0021: {
    literal: "An edict ordered Minister of Works Li Jiao, Left Regular Attendant Sun Zhi, Right Remonstrance Official Zhang Yan, Vice Minister of War Liu Miao, War Bureau Director Zhang Jun, and Vice Director of Imperial Sacrifices Lu Bingyi all to attend the progress.",
    idiomatic: "By edict Li Jiao, minister of works, Sun Zhi, left regular attendant, Zhang Yan, right remonstrator, Liu Miao, vice minister of war, Zhang Jun, war bureau director, and Lu Bingyi, vice director of imperial sacrifices, were all ordered on the progress.",
  },
  s0022: {
    literal: "On jiazi he set out from Luoyang and halted at Heyang that evening.",
    idiomatic: "On jiazi he left Luoyang and stopped at Heyang that night.",
  },
  s0024: {
    literal: "Left Regular Attendant Sun Zhi, Right Remonstrance Official Zhang Yan, and War Bureau Director Zhang Jun arrived last; the Emperor ordered them beaten to death.",
    idiomatic: "Sun Zhi, Zhang Yan, and Zhang Jun came late; the Emperor had them beaten to death.",
  },
  s0025: {
    literal: "On yichou he halted at Wen County.",
    idiomatic: "On yichou he stopped at Wen County.",
  },
  s0026: {
    literal: "On bingyin he halted at Wuzhi.",
    idiomatic: "On bingyin he stopped at Wuzhi.",
  },
  s0027: {
    literal: "Huai Prefecture Inspector Duan Mingyuan met and bowed at the border; all provisions inside and out were abundantly lavish.",
    idiomatic: "Duan Mingyuan, inspector of Huai Prefecture, met him at the border with obeisance; supplies within and without were lavish beyond measure.",
  },
  s0028: {
    literal: "On dingmao he halted at Huojia.",
    idiomatic: "On dingmao he stopped at Huojia.",
  },
  s0029: {
    literal: "On wuchen he halted at Xinxiang in Weizhou.",
    idiomatic: "On wuchen he stopped at Xinxiang in Weizhou.",
  },
  s0030: {
    literal: "On jisi he set out from Weizhou in the morning and halted at Qimen in the evening; Inner Palace Ten Generals led soldiers by the tens to the imperial camp.",
    idiomatic: "On jisi he left Weizhou in the morning and camped at Qimen that evening; Inner Palace Ten Generals marched their commands to the imperial camp.",
  },
  s0031: {
    literal: "On xinwei he halted at Liyang.",
    idiomatic: "On xinwei he encamped at Liyang.",
  },
  s0032: {
    literal: "On guiyou he set out from Liyang and halted at Neihuang that evening.",
    idiomatic: "On guiyou he left Liyang and camped at Neihuang that night.",
  },
  s0033: {
    literal: "On jiaxu he halted at Changle County.",
    idiomatic: "On jiaxu he stopped at Changle County.",
  },
  s0034: {
    literal: "On dingchou he halted at Yongji County.",
    idiomatic: "On dingchou he stopped at Yongji County.",
  },
  s0035: {
    literal: "Qingzhou Military Commissioner He Delun memorialized that he was leading troops to the front at Liting.",
    idiomatic: "He Delun, Qingzhou commissioner, reported that he was marching his forces to Liting.",
  },
  s0039: {
    literal: "《Comprehensive Mirror》: On xinsi he reached south of Xiabo and climbed Guanjin Mound.",
    idiomatic: "《Comprehensive Mirror》: On xinsi he came to south of Xiabo and ascended Guanjin Mound.",
  },
  s0042: {
    literal: "\" The Emperor left his traveling pavilion, hastily led troops toward Zaoqiang, and joined Yang Shihou’s army.",
    idiomatic: "\" The Emperor quit his camp, hurried his troops toward Zaoqiang, and united with Yang Shihou's army.",
  },
  s0044: {
    literal: "On dinghai he returned to Beizhou.",
    idiomatic: "On dinghai he was back at Beizhou.",
  },
  s0045: {
    literal: "On gengyin Yang Shihou and Deputy Pacifier Li Zhouyi and others came to court as ordered.",
    idiomatic: "On gengyin Yang Shihou, deputy pacifier Li Zhouyi, and others presented themselves at court by edict.",
  },
  s0047: {
    literal: "On renchen he ordered mutton and wine given separately to attending officials.",
    idiomatic: "On renchen he had mutton and wine distributed to each attending official.",
  },
  s0048: {
    literal: "On jiawu he visited the east gate of Beizhou to review troops.",
    idiomatic: "On jiawu he went to Beizhou's east gate to review the army.",
  },
  s0049: {
    literal: "On yiwei the Emperor again visited the east gate to review the cavalry.",
    idiomatic: "On yiwei he again went to the east gate to review the cavalry.",
  },
  s0050: {
    literal: "An order stated that eleven meritorious officers in the capture of Zaoqiang County, including Du Hui, were all given supernumerary inspector ranks, and twenty-five yamen officers including Song Yan were all promoted in military office.",
    idiomatic: "An order promoted eleven officers distinguished in taking Zaoqiang, including Du Hui, with supernumerary inspector ranks, and gave twenty-five yamen officers including Song Yan higher military posts.",
  },
  s0051: {
    literal: "On bingwu he halted at Jiyuan County.",
    idiomatic: "On bingwu he stopped at Jiyuan County.",
  },
  s0055: {
    literal: "to nurture the weary and weak depends entirely on magistrates.",
    idiomatic: "nurturing the exhausted and feeble falls wholly to local magistrates.",
  },
  s0057: {
    literal: "We hear that when the Ministry of Personnel proposes offices and the Secretariat appoints, sometimes through kin and friends’ requests, sometimes through powerful men’s intercession—they indulge private feeling and do not seek real talent; mindful of this corruption, regulations should be promulgated.",
    idiomatic: "We hear that appointments proposed by the Ministry of Personnel and confirmed by the Secretariat often follow kin or patrons, favor private ties over merit—this abuse must be met with clear rules.",
  },
  s0059: {
    literal: "If anyone still practices solicitation or lends goods and money, the responsible clerks must be thoroughly investigated and punished severely.\"",
    idiomatic: "Should solicitation or bribery continue, responsible officials are to investigate fully and punish without mercy.\"",
  },
  s0060: {
    literal: "On jiyou in the fourth month he visited Weizhou.",
    idiomatic: "On jiyou in the fourth month he went to Weizhou.",
  },
  s0061: {
    literal: "At Jinbo Pavilion he gave a feast to chancellors, civil and military officials, and the Six Academicians.",
    idiomatic: "At Jinbo Pavilion he feasted the chancellors, the civil and military officials, and the Six Academicians.",
  },
  s0062: {
    literal: "On the night of jiayin the moon occulted the great star of Heart.",
    idiomatic: "On jiayin night the moon occulted the great star of Heart.",
  },
  s0065: {
    literal: "\" On jiwei he halted at Liyang County.",
    idiomatic: "\" On jiwei he stopped at Liyang County.",
  },
  s0066: {
    literal: "《Comprehensive Mirror》: On yimao Prince of Bo Youwen came to court and asked the Emperor to return to the Eastern Capital.",
    idiomatic: "《Comprehensive Mirror》: On yimao the Prince of Bo, Youwen, attended court and urged the Emperor to return east.",
  },
  s0067: {
    literal: "On dingsi he set out from Weizhou.",
    idiomatic: "On dingsi he departed Weizhou.",
  },
  s0068: {
    literal: "On jiwei he reached Liyang and lingered there because of illness.",
    idiomatic: "On jiwei he came to Liyang and stayed on, held up by sickness.",
  },
  s0069: {
    literal: "Eastern Capital custodian officials presented memorials of inquiry; the chancellor and attending officials were given food and drink in varying measure.",
    idiomatic: "Custodian officials at the Eastern Capital sent memorials of greeting; chancellor and attendants received graded gifts of food and drink.",
  },
  s0070: {
    literal: "On jisi he reached the Eastern Capital; Prince of Bo Youwen memorialized on the newly built Dining Hall and also presented three thousand strings of cash and fifteen hundred taels of silverware prepared for an inner banquet.",
    idiomatic: "On jisi he arrived at the Eastern Capital; Prince of Bo Youwen reported on the new Dining Hall and presented three thousand strings of cash and fifteen hundred taels of silver for an inner banquet.",
  },
  s0073: {
    literal: "An order advanced Jianchang Palace Commissioner, Grand Master of Splendid Happiness with Golden Seal and Purple Ribbon, Honorary Grand Mentor, Kaifeng Intendant, and Prince of Bo Youwen to Special Court Attendance and Honorary Grand Guardian, also Kaifeng Intendant, continuing as Jianchang Palace Commissioner and Eastern Capital Custodian.",
    idiomatic: "By order Youwen, Prince of Bo, Jianchang palace commissioner, golden-seal grand master of splendid happiness, honorary grand mentor, and Kaifeng intendant, was raised to special court attendance and honorary grand guardian, kept Kaifeng intendant, and remained Jianchang commissioner and Eastern Capital custodian.",
  },
  s0074: {
    literal: "On wuyin the imperial carriage set out from the Eastern Capital and halted at Zhongmou County that evening.",
    idiomatic: "On wuyin the imperial train left the Eastern Capital and camped at Zhongmou that evening.",
  },
  s0077: {
    literal: "Heyang Acting Commissioner Shao Zan, Huai Prefecture Inspector Duan Mingyuan, and others came in succession to meet.",
    idiomatic: "Shao Zan, acting Heyang commissioner, Duan Mingyuan of Huai, and others met him in turn along the route.",
  },
  s0078: {
    literal: "That evening he halted at Sishui County; the Emperor summoned Prince of Wei Zongshi to audience and at once bestowed food before the throne; after several quarters he withdrew.",
    idiomatic: "That night he stopped at Sishui; the Emperor called Prince of Wei Zongshi to audience, fed him before the throne, and after some time sent him away.",
  },
  s0079: {
    literal: "On renwu he halted at Sishui; chancellors, Henan Intendant, and Six Academicians all made inquiry in the inner hall; an order entrusted Jianchang Palace affairs to Chancellor Yu Jing.",
    idiomatic: "On renwu he was at Sishui; chancellors, the Henan intendant, and the Six Academicians attended in the inner hall; Jianchang Palace business was placed in Chancellor Yu Jing's hands.",
  },
  s0080: {
    literal: "《Five Dynasties Huiyao》: In the sixth month of that year Jianchang Palace was abolished; Henan Intendant Prince of Wei Zhang Zongshi was made State Comptroller; all realm grain, funds, and troops formerly under Jianchang Palace were placed under him.",
    idiomatic: "《Five Dynasties Huiyao》: In the sixth month Jianchang Palace was abolished and Prince of Wei Zhang Zongshi, Henan intendant, became state comptroller, taking over all grain, funds, and troops formerly held by the palace.",
  },
  s0081: {
    literal: "On guawei the Emperor set out from Sishui and proclaimed that Shao Zan and Duan Mingyuan should each return to their jurisdictions.",
    idiomatic: "On guawei he left Sishui and announced that Shao Zan and Duan Mingyuan should each return to their posts.",
  },
  s0082: {
    literal: "At noon he rested at Rencun Station; that evening he halted at Xiaoyi Palace.",
    idiomatic: "He rested at Rencun Station at noon and lodged at Xiaoyi Palace that evening.",
  },
  s0083: {
    literal: "Capital custodian civil and military officials from Minister of Rites Kong Xu down met and bowed on the left of the road.",
    idiomatic: "Civil and military officials left in the capital, from Minister of Rites Kong Xu down, lined the road to welcome him.",
  },
  s0084: {
    literal: "He halted at Yanshi.",
    idiomatic: "He stopped at Yanshi.",
  },
  s0085: {
    literal: "On jiashen he reached the capital; civil and military officials welcomed him at the eastern suburb.",
    idiomatic: "On jiashen he entered the capital; civil and military officials received him at the eastern suburb.",
  },
  s0086: {
    literal: "Bohai sent envoys with tribute.",
    idiomatic: "Bohai presented tribute envoys.",
  },
  s0087: {
    literal: "Chancellor Xue Yiju was ill on leave and could not attend the progress; inquiries were frequent, and he was still ordered to remain at the Eastern Capital until fully recovered.",
    idiomatic: "Chancellor Xue Yiju was ill on leave and could not join the tour; the Emperor's inquiries came often, yet ordered him to stay at the Eastern Capital until recovery.",
  },
  s0088: {
    literal: "When he died the Emperor mourned a long while, ordered Luoyuan Commissioner Cao Shoucong to go offer condolences, and also ordered court attendance suspended on the sixth, seventh, and eighth; chancellor and civil and military officials all went to the Upper Gate to enter their names in condolence.",
    idiomatic: "At his death the Emperor mourned at length, sent Luoyuan commissioner Cao Shoucong to condole, and cancelled court for the sixth through eighth; chancellor and officials filed condolence at the Upper Gate.",
  },
  s0089: {
    literal: "On dinghai, because a comet had appeared, an edict ordered that in the two capitals all imprisoned convicts down from capital crimes should have their sentences reduced one grade, with review completed and reported within three days.",
    idiomatic: "On dinghai, after a comet appeared, an edict reduced by one grade the sentences of all prisoners in both capitals down through capital offenses, requiring review within three days.",
  },
  s0090: {
    literal: "《Five Dynasties Huiyao》: A comet appeared west of Lingtai; only in the fifth month was an amnesty granted for crimes, to answer Heaven’s reproof.",
    idiomatic: "《Five Dynasties Huiyao》: A comet showed west of Lingtai; not until the fifth month did the court grant amnesty for crimes to answer Heaven's reproof.",
  },
  s0091: {
    literal: "It also says: On the night of renxu in the fifth month Mars trespassed the great star of Heart, four degrees from Heart, moving direct.",
    idiomatic: "It adds: On renxu night in the fifth month Mars crossed the great star of Heart, four degrees off, moving direct.",
  },
  s0092: {
    literal: "The Directorate of Astronomy memorialized: \"The great star is the star of the Son of Heaven—self-cultivation is fitting to answer Heaven’s reproof.",
    idiomatic: "The directorate reported: \"The great star is the sovereign's star—the ruler should cultivate virtue to answer Heaven's reproof.",
  },
  s0094: {
    literal: "If one recklessly slaughters, how can one extend kindness in nurturing—let there be no extermination, to aid generation.",
    idiomatic: "Wanton slaughter cannot square with nurturing life; let killing cease that growth may flourish.",
  },
  s0095: {
    literal: "Let the two capitals and every prefecture and circuit forbid slaughter and hunting through the summer.",
    idiomatic: "The two capitals and all prefectures and circuits shall forbid slaughter and hunting for the summer.",
  },
  s0096: {
    literal: "The people’s poverty is surely from allotted fate;",
    idiomatic: "The people's want surely lies in fate's decree;",
  },
  s0097: {
    literal: "where the state’s regulations lie, one must also practice benevolence.",
    idiomatic: "yet where the state's charge rests, benevolence must still be practiced.",
  },
  s0098: {
    literal: "Wherever widowers, orphans, the solitary, the disabled, and those in distress are found, commission the chief official to grant relief as appropriate.",
    idiomatic: "Where widowers, orphans, the solitary poor, the disabled, and the destitute are found, let chief officials give relief as needed.",
  },
  s0099: {
    literal: "History records burying the withered, to show compassion;",
    idiomatic: "History praises burying the unburied dead as proof of compassion;",
  },
  s0100: {
    literal: "ritual speaks of covering exposed bones, to bring peace.",
    idiomatic: "ritual demands covering bleached bones to restore peace.",
  },
  s0102: {
    literal: "The state’s plague texts still mark the seven sacrifices;",
    idiomatic: "State plague ordinances still prescribe the seven sacrifices;",
  },
  s0103: {
    literal: "the market of good medicines also records three physicians.",
    idiomatic: "the registry of fine medicines still lists three doctors.",
  },
  s0104: {
    literal: "Out of pity for those with no one to plead for them, skilled healing should be sought.",
    idiomatic: "Pity those with none to speak for them—let skilled physicians be sought.",
  },
  s0108: {
    literal: "Spirit shrines near the capital should be entrusted to the Henan Intendant; the Five Emperors Altar, Wind Master, Rain Master, and Nine Palaces Noble Spirits should each have officials dispatched by the Secretariat to pray.",
    idiomatic: "Shrines near the capital were left to the Henan intendant; the Five Emperors Altar, Wind Master, Rain Master, and Nine Palaces spirits each received Secretariat officers to pray.",
  },
  s0109: {
    literal: "\" 《Comprehensive Mirror》: On renxu in the intercalary month the Emperor’s illness was grave; he told close ministers: \"I have managed the realm for thirty years and did not expect the Taiyuan remnant to flourish so!",
    idiomatic: "\" 《Comprehensive Mirror》: On renxu of the intercalary month the Emperor was gravely ill; he said to his intimates: \"Thirty years I have ruled, and never thought the Taiyuan remnant would grow so strong!",
  },
  s0110: {
    literal: "I see their ambition is no small thing; Heaven again shortens my years—when I die my sons are no match for them; I have no burial ground!",
    idiomatic: "Their aim is not small; Heaven again cuts my years—when I die my sons cannot stand against them; I have no grave prepared!",
  },
  s0111: {
    literal: "\" He choked with sobs, stopped breathing, and revived.",
    idiomatic: "\" He sobbed until breath failed, then came back.",
  },
  s0112: {
    literal: "The Emperor’s eldest son Prince of Chen Youyu had died early.",
    idiomatic: "His eldest son, Prince of Chen Youyu, had died young.",
  },
  s0113: {
    literal: "Next was the adopted son Youwen, whom the Emperor especially loved; he often remained at the Eastern Capital as Jianchang Palace Commissioner.",
    idiomatic: "Next came the adopted son Youwen, the Emperor's favorite, who often stayed at the Eastern Capital as Jianchang palace commissioner.",
  },
  s0114: {
    literal: "Next was Prince of Ying Yougui, whose mother was a camp entertainer from Bozhou; he was Commander of the Left and Right Crane-Controlled Armies.",
    idiomatic: "Next was Prince of Ying Yougui, born of a Bozhou camp singer, commander of the left and right Crane-Controlled Armies.",
  },
  s0115: {
    literal: "Next was Prince of Jun Youzhen, Eastern Capital Horse and Foot Commander.",
    idiomatic: "Next was Prince of Jun Youzhen, commander of horse and foot at the Eastern Capital.",
  },
  s0116: {
    literal: "Although the Emperor had not made Youwen crown prince, his intent often rested on him.",
    idiomatic: "Youwen was not named crown prince, yet the Emperor's heart was often set on him.",
  },
  s0118: {
    literal: "The intent had been proclaimed but the edict had not yet been issued.",
    idiomatic: "The choice had been announced, but no edict had followed.",
  },
  s0119: {
    literal: "At that time many demoted officials were pursued and granted death; Yougui grew more fearful.",
    idiomatic: "Many recently demoted men were hunted down and forced to die; Yougui's fear deepened.",
  },
  s0120: {
    literal: "On wuyin Yougui changed clothes and went in secret to the Left Dragon-Tiger Army, saw Commander-in-Chief Han Qin, and told him his plight.",
    idiomatic: "On wuyin Yougui went in disguise to the Left Dragon-Tiger Army, confided in commander Han Qin, and laid bare his fear.",
  },
  s0121: {
    literal: "Qin also saw meritorious generals and veteran officers often executed for small faults and feared he could not preserve himself; they then plotted together.",
    idiomatic: "Qin too had seen meritorious officers killed for trifles and feared for himself; they took counsel together.",
  },
  s0122: {
    literal: "Qin led five hundred guardsmen to follow Yougui mixed among the Crane-Controlled troops into the palace; they lay in ambush within the forbidden precinct;",
    idiomatic: "Qin brought five hundred guardsmen; Yougui mixed them with the Crane-Controlled troops and hid them inside the palace;",
  },
  s0123: {
    literal: "At night they broke through the gate and reached the sleeping hall; those attending the sick all fled.",
    idiomatic: "At night they forced the gate and reached the sleeping hall; attendants scattered.",
  },
  s0124: {
    literal: "The Emperor started up and asked: \"Who are the rebels?",
    idiomatic: "The Emperor roused himself and cried: \"Who rebels?",
  },
  s0125: {
    literal: "\" Yougui said: \"It is no other.",
    idiomatic: "\" Yougui said: \"No other.",
  },
  s0126: {
    literal: "\" The Emperor said: \"I always suspected this villain—regret I did not kill him sooner.",
    idiomatic: "\" The Emperor said: \"I long suspected this villain—only regret I did not kill him sooner.",
  },
  s0127: {
    literal: "You are so rebellious—how could Heaven and Earth tolerate you!",
    idiomatic: "You rebel thus—Heaven and Earth will not bear you!",
  },
  s0128: {
    literal: "\" Yougui said: \"Old villain, ten thousand cuts!",
    idiomatic: "\" Yougui cried: \"Old thief, ten thousand cuts!",
  },
  s0129: {
    literal: "\" Yougui’s servant Feng Tingyu stabbed the Emperor in the belly; the blade came out his back.",
    idiomatic: "\" Yougui's groom Feng Tingyu drove a blade into the Emperor's belly until it showed at his back.",
  },
  s0130: {
    literal: "Yougui himself wrapped the corpse in a worn rug, buried it in the sleeping hall, and kept the death secret.",
    idiomatic: "Yougui himself wrapped the body in a cast-off rug, buried it in the hall, and concealed the death.",
  },
  s0131: {
    literal: "He dispatched Palace Attendant Ding Zhaopu posthaste to the Eastern Capital ordering Prince of Jun Youzhen to kill Youwen.",
    idiomatic: "He sent palace attendant Ding Zhaopu in haste to the Eastern Capital to order Prince of Jun Youzhen to kill Youwen.",
  },
  s0132: {
    literal: "On jimao a forged edict stated: \"Prince of Bo Youwen plotted rebellion and sent troops bursting into the hall; thanks to Prince of Ying Yougui’s loyalty and filial piety, who led troops to execute them and preserved Our person.",
    idiomatic: "On jimao a forged edict read: \"Prince of Bo Youwen plotted revolt and burst into the hall with troops; Prince of Ying Yougui, loyal and filial, led forces to execute them and saved Us.",
  },
  s0133: {
    literal: "Yet the illness from shock grows critical—let Yougui provisionally direct state and military affairs.",
    idiomatic: "Shock has worsened Our illness—let Yougui govern state and army affairs for now.",
  },
  s0134: {
    literal: "\" Han Qin plotted for Yougui, taking much gold and silk from the treasury to bestow on the armies and the hundred officials to win favor.",
    idiomatic: "\" Han Qin schemed for him, emptying much gold and silk from the treasury to buy the armies and the officials.",
  },
  s0135: {
    literal: "On xinsi Ding Zhaopu returned; hearing Youwen was already dead, they then announced the mourning, proclaimed the testamentary order, and Yougui at once took the throne.",
    idiomatic: "On xinsi Ding Zhaopu returned; learning Youwen was dead, they announced mourning, proclaimed the testament, and Yougui seized the throne.",
  },
  s0136: {
    literal: "Yougui buried Taizu in Yique County, titled the tomb Xuan Mausoleum.",
    idiomatic: "Yougui buried Taizu at Yique, naming the tomb Xuan.",
  },
  s0137: {
    literal: "《Supplement to the History of the Five Dynasties》: Taizu Zhu Quanzhong was vanguard of Huang Chao.",
    idiomatic: "《Supplement to the History of the Five Dynasties》: Taizu Zhu Quanzhong was Huang Chao's vanguard.",
  },
  s0138: {
    literal: "When Chao entered Chang’an, Wang Duo besieged Tongzhou; Taizu then surrendered and Duo, acting on imperial order, appointed him prefect of Tong.",
    idiomatic: "When Chao took Chang'an, Wang Duo besieged Tongzhou; Taizu surrendered, and Duo, with imperial warrant, made him prefect of Tong.",
  },
  s0139: {
    literal: "When Huang Chao was destroyed, Qin Zongquan revived his strength between Huai and Cai; the court, because Huai and Cai bordered Bianzhou and Taizu was a man of Bian, was bound to test his ability, and so transferred him as Xuanwu Military Commissioner to attack Zongquan; before long he destroyed him.",
    idiomatic: "After Huang Chao fell, Qin Zongquan rose again between Huai and Cai; because those regions marched with Bian and Taizu was a native of Bian, the court had to try him and transferred him as Xuanwu commissioner to destroy Zongquan—which he soon did.",
  },
  s0140: {
    literal: "From then on power and favor were his own and the court could not control him; he then possessed the realm.",
    idiomatic: "Thereafter he held power in his own hands and the court could not restrain him until he possessed the realm.",
  },
  s0141: {
    literal: "Earlier the people had transmitted a prophecy saying \"Five Lords tally,\" also called the \"Li Chunfeng Turning Heaven Song\"; its characters had \"the year of eight oxen\"—those who understood took \"eight oxen\" as the character Zhu—thus the omen of Taizu’s revolution.",
    idiomatic: "Earlier folk prophecy spoke of \"Five Lords' tally,\" also called Li Chunfeng's Turning Heaven Song, containing \"the year of eight oxen\"—readers saw eight oxen as the character Zhu, presaging Taizu's rise.",
  },
  s0142: {
    literal: "In Taizu’s use of troops the laws were stern; in each battle if a unit commander was lost and did not return, the rest were all beheaded—called \"beheading the straggling unit.\"",
    idiomatic: "Taizu's armies were ruled by harsh law: when a unit commander fell and did not return, his whole unit was beheaded—this was called \"beheading the straggler.\"",
  },
  s0143: {
    literal: "From then on in battle there was no not winning.",
    idiomatic: "From then on his battles knew no defeat.",
  },
  s0144: {
    literal: "Yet strong soldiers often hid in prefectures and counties, weary of pursuit; therefore he ordered facial tattooing—facial tattooing of strong soldiers began here.",
    idiomatic: "Yet able men often hid among the prefectures, exhausted from pursuit—so he ordered facial brands, and the branding of strong soldiers began.",
  },
  s0145: {
    literal: "《Lost Passages of the History of the Five Dynasties》: The world transmits that when Liang Taizu welcomed Emperor Zhaozong from Fengxiang, in plain clothes he awaited punishment; Zhaozong pretended his shoe thong came loose and called Liang Taizu: \"Quanzhong, tie my shoe for me.",
    idiomatic: "《Lost Passages》: Tradition says that when Liang Taizu welcomed Emperor Zhaozong from Fengxiang, he wore plain dress to await punishment; Zhaozong feigned a loose shoe-thong and called: \"Quanzhong, tie my shoe for me.",
  },
  s0146: {
    literal: "\" Liang Taizu had no choice but to kneel and tie it; sweat streamed down his back.",
    idiomatic: "\" Liang Taizu could only kneel to tie it, sweat soaking his back.",
  },
  s0147: {
    literal: "At that time the Son of Heaven’s progress still had guard troops; Zhaozong’s intent was that those beside him seize Liang Taizu and kill him—but none dared move.",
    idiomatic: "The Son of Heaven's escort still had guards; Zhaozong hoped those beside him would seize Taizu and kill him—yet none dared.",
  },
  s0148: {
    literal: "From then on when Liang Taizu was summoned he often did not come; he removed all Zhaozong’s forbidden guards and used only men of Bian.",
    idiomatic: "Thereafter Taizu often ignored summons; he stripped Zhaozong of every palace guard and replaced them with men from Bian.",
  },
  s0149: {
    literal: "Your servant respectfully notes: Liang Taizu in the third year of Tianfu welcomed Tang Emperor Zhaozong from below Qi—year jiazi; that year was changed to Tianyou; from the founding of the state in the gengshen year of Jianlong it was only fifty-six years—yet people of the Qiande era, seventy years old, all witnessed the affair.",
    idiomatic: "This commentator notes: Liang Taizu in Tianfu year 3 welcomed Tang Emperor Zhaozong from below Qi in the jiazi year, then Tianyou; from Jianlong's founding gengshen to our day is only fifty-six years—yet men of seventy in the Qiande era saw it with their own eyes.",
  },
  s0150: {
    literal: "It is that from Emperor Yizong of Tang the government was lost and the realm torn apart; therefore veritable records from Emperor Wuzong down were not transmitted in the world.",
    idiomatic: "From Tang Yizong's loss of rule the realm shattered; veritable records from Wuzong down no longer circulated.",
  },
  s0151: {
    literal: "For Zhaozong’s entire reign there was no record at all.",
    idiomatic: "Zhaozong's entire reign left no record whatsoever.",
  },
  s0152: {
    literal: "Liang Taizu reigned only six years; in Emperor Jun’s reign an edict ordered historians to compile Taizu’s veritable record—the affair of tying shoes below Qi was shameful and not written.",
    idiomatic: "Taizu reigned only six years; under Emperor Jun historians were ordered to compile his veritable record—yet the shoe-tying at Qi was too shameful to write.",
  },
  s0153: {
    literal: "In the Tianfu era of Jin, historian Zhang Zhao revised the 《History of Tang》, and only then was there 《Annals of Emperor Zhaozong》, but it said only that at the beginning of his reign there was the style of the Huichang era; affairs at Qi-yang could not be pursued and supplemented.",
    idiomatic: "In Jin's Tianfu era Zhang Zhao revised the Tang history and added Annals of Emperor Zhaozong, noting only Huichang-era style at his accession—affairs at Qi-yang could not be recovered.",
  },
  s0154: {
    literal: "This also shows that Tang Emperor Zhaozong had keen and discerning spirit, yet the declining fortune did not revive;",
    idiomatic: "This shows that Zhaozong had keen spirit, yet declining fortune would not turn;",
  },
  s0155: {
    literal: "it also shows that those beside him had no loyal and righteous ministers who would rise up, so Liang Taizu could carry out his will.",
    idiomatic: "and that none beside him were loyal enough to strike, so Taizu could do as he pleased.",
  },
  s0156: {
    literal: "There is warning in this—it must not go unwritten.",
    idiomatic: "There is a lesson here, and it must be written.",
  },
};

export default patch;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultChapter = path.resolve(__dirname, '../../data/jiuwudaishi/007.json');

if (process.argv[1] === fileURLToPath(import.meta.url) || process.argv[1]?.endsWith('jiuwudaishi-007-idiomatic-fix.mjs')) {
  const chapterPath = process.argv[2]
    ? path.resolve(process.argv[2])
    : defaultChapter;

  const data = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
  let fixed = 0;

  for (const block of data.content) {
    for (const s of block.sentences || []) {
      const p = patch[s.id];
      if (!p) continue;
      const en = s.translations?.find((x) => x.lang === 'en');
      if (!en) continue;
      if (p.literal !== undefined) en.literal = p.literal;
      if (p.idiomatic !== undefined) en.idiomatic = p.idiomatic;
      fixed++;
    }
  }

  fs.writeFileSync(chapterPath, JSON.stringify(data, null, 2) + '\n');
  console.log(`Applied ${fixed} idiomatic fixes to ${chapterPath}`);
}
