#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.004, Gaozong 1 — birth through Yonghui 2) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0001: {
    literal:
      'Gaozong, Emperor Tensho the Great Sage, Greatly Broad and Filial, bore the taboo name Zhi; he was Taizong\'s ninth son; his mother was Empress Wende the Shunsheng of the Zhangsun clan.',
    idiomatic:
      'Gaozong, posthumously styled Emperor Tensho the Great Sage, Greatly Broad and Filial, bore the taboo name Zhi. He was Taizong\'s ninth son; his mother was Empress Wende the Shunsheng of the Zhangsun clan.',
  },
  s0002: {
    literal: 'In the sixth month of the second year of Zhenguan he was born in the Lizheng Hall of the Eastern Palace.',
    idiomatic:
      'In the sixth month of Zhenguan 2 he was born in the Lizheng Hall of the Eastern Palace.',
  },
  s0003: {
    literal: 'In the fifth year he was enfeoffed as Prince of Jin.',
    idiomatic: 'In the fifth year he was created Prince of Jin.',
  },
  s0004: {
    literal: 'In the seventh year he was appointed from afar as Military Governor of Bingzhou.',
    idiomatic: 'In the seventh year he received the distant appointment as Military Governor of Bingzhou.',
  },
  s0005: {
    literal: 'From childhood he was precocious, composed, broad, benevolent, filial, and friendly.',
    idiomatic: 'As a boy he was sharp and steady, open-handed, benevolent, filial, and loyal to his kin.',
  },
  s0006: {
    literal:
      'He first received instruction in the Classic of Filial Piety from Master of Writing Xiao Deyan; Taizong asked, "What passage in this book is essential?',
    idiomatic:
      'He first studied the Classic of Filial Piety under Master of Writing Xiao Deyan. Taizong asked, "What passage in this book matters most?',
  },
  s0007: {
    literal:
      '" He replied, "Filial piety begins in serving one\'s parents, centers in serving one\'s lord, and ends in establishing oneself.',
    idiomatic:
      '" Deyan answered, "Filial piety begins with honoring one\'s parents, finds its center in serving one\'s lord, and ends in making a life of one\'s own.',
  },
  s0008: {
    literal:
      'In serving his superiors the gentleman, when advancing, thinks how to exhaust loyalty; when withdrawing, thinks how to remedy faults; he follows what is good in them and corrects what is evil.',
    idiomatic:
      'A gentleman serving his ruler, when in office, strives to give full loyalty; when out of office, weighs how to repair his faults—he furthers what is good in the ruler and rescues him from what is bad.',
  },
  s0009: {
    literal:
      '" Taizong was greatly pleased and said, "Put this into practice and you will be fit to serve father and elder brothers and to be a minister and son.',
    idiomatic:
      '" Taizong was delighted and said, "Live by that, and you will be fit to serve father and brothers and to stand as a minister and son.',
  },
  s0010: {
    literal:
      '" When Empress Wende died, the Prince of Jin was then nine years old; his grief and longing moved those beside him; Taizong repeatedly comforted him, and from this showed him exceptional favor.',
    idiomatic:
      '" When Empress Wende died, the Prince of Jin was nine; his mourning touched all who saw him. Taizong comforted him again and again, and from then on favored him above the rest.',
  },
  s0011: {
    literal: 'Shortly thereafter he was appointed General of the Right Martial Guard.',
    idiomatic: 'Soon after he was made General of the Right Martial Guard.',
  },
  s0012: {
    literal:
      'In the seventeenth year the Heir Apparent Chengqian was deposed; the Prince of Wei, Tai, was also dismissed for crime; Taizong deliberated with Zhangsun Wuji, Fang Xuanling, Li Ji, and others and established the Prince of Jin as Heir Apparent.',
    idiomatic:
      'In the seventeenth year Heir Apparent Chengqian was deposed and Prince of Wei Tai was disgraced and removed. Taizong consulted Zhangsun Wuji, Fang Xuanling, Li Ji, and others and set up the Prince of Jin as heir.',
  },
  s0013: {
    literal:
      'Whenever Taizong attended court he regularly had him at his side to observe the deciding of common affairs, or had him join in deliberation; Taizong often praised his excellence.',
    idiomatic:
      'Whenever Taizong held court he kept the heir at his side to watch the dispatch of ordinary business, or called him into counsel; Taizong often praised his judgment.',
  },
  s0014: {
    literal: 'In the eighteenth year, when Taizong was about to campaign against Goguryeo, he ordered the Heir Apparent to remain and guard Dingzhou.',
    idiomatic: 'In the eighteenth year, as Taizong prepared to attack Goguryeo, he left the heir to hold Dingzhou.',
  },
  s0015: {
    literal:
      'When the imperial departure was fixed, he wept for many days; he therefore asked to send urgent dispatches with memorials on the emperor\'s well-being and to receive edicts in return by the same route, and all was granted.',
    idiomatic:
      'When the day of departure was set, the heir wept for days and begged leave to use flying relays for health memorials and to receive edicts by the same route; Taizong granted both.',
  },
  s0016: {
    literal: 'Flying memorials to report affairs began from this.',
    idiomatic: 'The practice of urgent memorials by relay began here.',
  },
  s0017: {
    literal: 'When the army returned, the Heir Apparent followed to Bingzhou.',
    idiomatic: 'When the army came back, the heir followed to Bingzhou.',
  },
  s0018: {
    literal:
      'At that time Taizong suffered from a carbuncle; the Heir Apparent personally sucked the pus and for several days supported the carriage and walked in attendance.',
    idiomatic:
      'Taizong was then afflicted with a carbuncle; the heir sucked the wound himself and for days walked beside the carriage, steadying it.',
  },
  s0019: {
    literal: 'In the twenty-third year of Zhenguan, on the fifth month, day jisi, Taizong died.',
    idiomatic: 'In the twenty-third year of Zhenguan, on jisi of the fifth month, Taizong died.',
  },
  s0020: {
    literal:
      'On gengwu, Yu Zhining, Minister of Rites, concurrent Junior Tutor to the Heir Apparent, and Duke of Liyang, was made Chief Minister; Zhang Xingcheng, Junior Steward of the Heir Apparent, concurrent Vice Director of the Left in the Masters of Writing, was made concurrent Chief Minister and Acting Minister of Justice; Gao Jifu, Right Aide to the Heir Apparent, concurrent Vice Minister of Personnel and Acting Minister of Revenue, was made concurrent Director of the Secretariat and Acting Minister of Personnel; Xu Jingzong, Left Aide to the Heir Apparent and Baron of Gaoyang, was made concurrent Minister of Rites.',
    idiomatic:
      'On gengwu, Yu Zhining, minister of rites and junior tutor to the heir, Duke of Liyang, became chief minister; Zhang Xingcheng, junior steward of the heir and vice director on the left in the Masters of Writing, became concurrent chief minister and acting minister of justice; Gao Jifu, right aide to the heir, vice minister of personnel and acting minister of revenue, became concurrent director of the Secretariat and acting minister of personnel; Xu Jingzong, left aide to the heir and Baron of Gaoyang, was also named minister of rites.',
  },
  s0021: {
    literal: 'On xinwei, they returned to the capital.',
    idiomatic: 'On xinwei the court returned to Chang\'an.',
  },
  s0022: {
    literal:
      'On jiaxu, the first day of the sixth month, the Heir Apparent assumed the imperial throne; he was then twenty-two.',
    idiomatic:
      'On jiaxu, the new moon of the sixth month, the heir took the throne; he was twenty-two.',
  },
  s0023: {
    literal:
      'An edict said, "The late emperor has suddenly left all under Heaven; grief pierces the spirit as though one were cast into boiling water.',
    idiomatic:
      'He issued an edict: "The late emperor has suddenly forsaken all under Heaven; grief pierces the heart as though one stood in fire.',
  },
  s0024: {
    literal:
      'Thinking to follow great filial piety, I dare not destroy my person; forever mourning with long cries—how can I ever reach him again?',
    idiomatic:
      'In great filial piety I dare not take my own life, yet endless mourning and long lament—how shall I ever reach him again?',
  },
  s0025: {
    literal:
      'Alas, solitary and slight, I have fallen heir to the primal succession; I think to rouse my empty weakness and bring peace to the black-haired people.',
    idiomatic:
      'Alone and slight, I have inherited the primal succession; I mean to stir my meager strength and bring peace to the people.',
  },
  s0026: {
    literal:
      'Reverently following renewal, looking up to display the former virtue, it is fitting to spread triumphant grace over the hundred millions.',
    idiomatic:
      'In reverent renewal, looking up to the virtue of those before, let triumphant grace spread over the realm.',
  },
  s0027: {
    literal: 'A great amnesty for all under Heaven is permitted.',
    idiomatic: 'Let there be a general amnesty throughout the realm.',
  },
  s0028: {
    literal: 'Civil and military officials within and without are granted one rank of merit office.',
    idiomatic: 'All civil and military officials at court and in the provinces receive one rank of merit office.',
  },
  s0029: {
    literal: 'All persons eighty years of age and above are bestowed grain and silk.',
    idiomatic: 'Those eighty years of age and above receive gifts of grain and silk.',
  },
  s0030: {
    literal:
      'In Yongzhou and in prefectures where corvée for supplying the army has been especially heavy in recent years, tax and labor service are remitted for one year.',
    idiomatic:
      'Yongzhou and every prefecture lately crushed by army supply and corvée are granted a year\'s remission of tax and labor.',
  },
  s0031: {
    literal: '" On xinsi, the Ministry of the People was renamed the Ministry of Revenue.',
    idiomatic: '" On xinsi the Ministry of the People was renamed the Ministry of Revenue.',
  },
  s0032: {
    literal:
      'Li Ji, Military Governor of Die Prefecture and Duke of Ying, was made Special Advancement and Acting Governor of Luozhou, remaining to guard Luoyang Palace.',
    idiomatic:
      'Li Ji, governor of Die and Duke of Ying, was promoted to special advancement and made acting governor of Luozhou, with orders to remain and guard Luoyang Palace.',
  },
  s0033: {
    literal:
      'On guiwei, an edict: Zhangsun Wuji, Minister of Education, Military Governor of Yangzhou, and Duke of Zhao, was made Grand Tutor and concurrent Inspector-General of the Secretariat, directing the Secretariat and Chancellery ministries; the rest as before; he was granted three thousand bolts of goods.',
    idiomatic:
      'On guiwei an edict named Zhangsun Wuji, minister of education, governor of Yangzhou, and Duke of Zhao, grand tutor and concurrent inspector-general of the Secretariat, in charge of Secretariat and Chancellery affairs; his other posts stood; he received three thousand bolts of goods.',
  },
  s0034: {
    literal:
      'On guisi, Li Ji, Special Advancement and Duke of Ying, was made Grand Master of Splendid Happiness with the same privileges as the Three Excellencies and a seat in confidential counsel.',
    idiomatic:
      'On guisi Li Ji, special advancement and Duke of Ying, was made grand master of splendid happiness with the same privileges as the three excellencies and a seat at confidential counsel.',
  },
  s0035: {
    literal:
      'In the seventh month of autumn, on bingwu, the relevant offices asked to change Imperial Secretary to Censor-in-Chief, prefectural Administrators to Marshals, Vice-Prefects to Chief Administrators, and Ritual Clerks to Ceremonial Attendants, to avoid the emperor\'s name.',
    idiomatic:
      'On bingwu of the seventh autumn month the relevant offices asked to rename imperial secretary as censor-in-chief, prefectural administrators as marshals, vice-prefects as chief administrators, and ritual clerks as ceremonial attendants, to avoid the emperor\'s taboo name.',
  },
  s0036: {
    literal:
      'Because in the Zhenguan era the late emperor\'s two characters were not tabooed, an edict went to the offices; they memorialized, "The late emperor\'s two names—ritual does not require partial taboo.',
    idiomatic:
      'Since under Zhenguan the late emperor\'s two name-characters had not been tabooed, he ordered the offices to report; they replied, "The late emperor\'s two names need not be partially tabooed by ritual.',
  },
  s0037: {
    literal: 'Now that Your Majesty has a single name, ministers and subjects ought not to point and name it.',
    idiomatic: 'But Your Majesty bears a single name; ministers and subjects should not speak it aloud.',
  },
  s0038: {
    literal: '" The emperor then followed this.',
    idiomatic: '" The emperor accepted their view.',
  },
  s0039: {
    literal: 'On jiyou, Fokan, king of Khotan, came to court.',
    idiomatic: 'On jiyou Fokan, king of Khotan, presented himself at court.',
  },
  s0040: {
    literal:
      'On guiyou, the first day of the eighth month, an earthquake struck east of the River; Jin Prefecture suffered most—dwellings collapsed and more than five thousand were crushed to death.',
    idiomatic:
      'On guiyou, the new moon of the eighth month, the east of the River shook; Jin Prefecture suffered worst—houses fell and more than five thousand were crushed.',
  },
  s0041: {
    literal: 'Three days later it shook again.',
    idiomatic: 'Three days later the earth shook again.',
  },
  s0042: {
    literal:
      'An edict sent envoys to inquire after the people, granted two years\' remission, and gave three bolts of silk to families of the dead.',
    idiomatic:
      'He sent envoys to comfort the people, granted two years\' remission, and gave three bolts of silk for each person killed.',
  },
  s0043: {
    literal:
      'Li Ji, Grand Master of Splendid Happiness and Duke of Ying, was made Left Vice Director of the Masters of Writing with a seat in confidential counsel.',
    idiomatic:
      'Li Ji, grand master of splendid happiness and Duke of Ying, was appointed left vice director of the Masters of Writing with a seat at confidential counsel.',
  },
  s0044: {
    literal: 'Vice directors from this time carried the concurrent title "with confidential counsel."',
    idiomatic: 'From this time vice directors also bore the title "with confidential counsel."',
  },
  s0045: {
    literal: 'On gengyin, Taizong was buried at Zhaoling.',
    idiomatic: 'On gengyin Taizong was buried at Zhaoling.',
  },
  s0046: {
    literal:
      'On jiayin, Prince Jing of Jing, Military Governor of Bin, was further invested as Minister of Education; Prince Ke of Wu, former Military Governor of An, was made Minister of Works and concurrent Military Governor of Liang.',
    idiomatic:
      'On jiayin Prince Jing of Jing, governor of Bin, was further named minister of education; Prince Ke of Wu, former governor of An, became minister of works and governor of Liang.',
  },
  s0047: {
    literal:
      'On bingyin, posthumous Grand Tutor Fang Xuanling, Duke of Liang, posthumous Minister of Education Liu Shiliang, Duke of Shen, and posthumous Left Vice Director Qu Tu Tong, Duke of Jiang, were all permitted to share sacrifice in Taizong\'s temple court.',
    idiomatic:
      'On bingyin posthumous Grand Tutor Fang Xuanling, Duke of Liang, posthumous Minister of Education Liu Shiliang, Duke of Shen, and posthumous Left Vice Director Qu Tu Tong, Duke of Jiang, were all granted places at Taizong\'s temple.',
  },
  s0048: {
    literal:
      'In the eleventh month of winter, on jiazi, Ashina Helu, Military Governor of Jade Pool, was made General of the Left Martial Cavalry.',
    idiomatic:
      'On jiazi of the eleventh winter month Ashina Helu, governor of Jade Pool, was made general of the left martial cavalry.',
  },
  s0049: {
    literal: 'On yichou, Jin Prefecture shook again.',
    idiomatic: 'On yichou Jin Prefecture shook again.',
  },
  s0050: {
    literal: 'That winter there was no snow.',
    idiomatic: 'That winter no snow fell.',
  },
  s0051: {
    literal:
      'In the first year of Yonghui, in the spring of the first month, on xinchou, the new moon, the emperor did not receive court; an edict changed the era name.',
    idiomatic:
      'In the first year of Yonghui, on the xinchou new moon of the first spring month, the emperor declined court and proclaimed a new era name.',
  },
  s0052: {
    literal: 'On renyin, he took his seat in the Hall of Supreme Ultimate and received court but held no assembly.',
    idiomatic: 'On renyin he sat in the Hall of Supreme Ultimate and received court without holding a full assembly.',
  },
  s0053: {
    literal: 'Day bingwu.',
    idiomatic: 'On bingwu.',
  },
  s0054: {
    literal: 'Consort Wang was established as empress.',
    idiomatic: 'Consort Wang was installed as empress.',
  },
  s0055: {
    literal: 'On dingwei, Prince Zhong of Chen was made Military Governor of Yong.',
    idiomatic: 'On dingwei Prince Zhong of Chen was made governor of Yong.',
  },
  s0056: {
    literal:
      'In the second month, on xinmao, the princes Xiao was enfeoffed as Prince of Xu, Shangjin as Prince of Qi, and Sujie as Prince of Yong.',
    idiomatic:
      'On xinmao of the second month the princes Xiao was created Prince of Xu, Shangjin Prince of Qi, and Sujie Prince of Yong.',
  },
  s0057: {
    literal: 'In the fourth month of summer, on jisi, the new moon, Jin Prefecture shook again.',
    idiomatic: 'On the jisi new moon of the fourth summer month Jin Prefecture shook again.',
  },
  s0058: {
    literal:
      'On dingwei, the emperor said to the assembled ministers, "I have wrongly received the great throne; my government and teaching are unclear, and therefore Jin Prefecture has repeatedly shaken.',
    idiomatic:
      'On dingwei the emperor told his ministers, "I have unworthily taken the throne; my rule is unclear, and so Jin Prefecture keeps shaking.',
  },
  s0059: {
    literal: 'Truly rewards and punishments miss the mark and the way of government is astray.',
    idiomatic: 'Surely rewards and punishments are out of balance and the way of rule is wrong.',
  },
  s0060: {
    literal:
      'You should each submit sealed memorials, speaking to the utmost of gain and loss, to correct my shortcomings.',
    idiomatic:
      'Each of you should submit sealed memorials, speaking plainly of what is right and wrong, to repair my failings.',
  },
  s0061: {
    literal:
      '" Tokhara sent envoys presenting a great bird like a camel that ate copper and iron; the emperor sent it as tribute to Zhaoling.',
    idiomatic:
      '" Tokhara sent envoys with a great bird like a camel that ate copper and iron; the emperor had it presented at Zhaoling.',
  },
  s0062: {
    literal:
      'The Tibetan king died; the Right Martial Guard General Yu Kuaiji was sent bearing imperial writ to mourn and sacrifice.',
    idiomatic:
      'The Tibetan king died; the emperor sent Yu Kuaiji of the right martial guard with imperial writ to mourn and sacrifice.',
  },
  s0063: {
    literal: 'In the sixth month, on gengchen, Jin Prefecture shook.',
    idiomatic: 'On gengchen of the sixth month Jin Prefecture shook.',
  },
  s0064: {
    literal: 'In the seventh month of autumn, on bingyin, because of drought he personally reviewed the capital\'s prisoners.',
    idiomatic: 'On bingyin of the seventh autumn month, because of drought, he personally reviewed the capital\'s prisoners.',
  },
  s0065: {
    literal:
      'On guimao, Gao Kan, commandant of the Right Martial Cavalry, brought Chebi Khagan captive to the palace, presenting him at the Altar of Soil and Grain and at Zhaoling.',
    idiomatic:
      'On guimao Gao Kan, commandant of the right martial cavalry, brought Chebi Khagan captive to court and presented him at the Altar of Soil and Grain and at Zhaoling.',
  },
  s0066: {
    literal:
      'On jiwei, Li Ji, Left Vice Director and Duke of Ying, firmly asked to resign his post; this was granted, and he was ordered to remain Grand Master of Splendid Happiness with a seat in confidential counsel.',
    idiomatic:
      'On jiwei Li Ji, left vice director and Duke of Ying, firmly asked to leave office; the emperor agreed and kept him as grand master of splendid happiness with a seat at confidential counsel.',
  },
  s0067: {
    literal:
      'In the eleventh month, on jiji, Chu Suiliang, Director of the Secretariat and Duke of Henan, was demoted to Governor of Tong.',
    idiomatic:
      'In the eleventh month, on jiji, Chu Suiliang, director of the Secretariat and Duke of Henan, was demoted to governor of Tong.',
  },
  s0068: {
    literal:
      'In the twelfth month, Ashina Helu, Military Governor of Jade Pool and Yabghu of the Shaboluo, rebelled with his commandery, styled himself khagan, and held all the lands of the Western Regions.',
    idiomatic:
      'In the twelfth month Ashina Helu, governor of Jade Pool and yabghu of the Shaboluo, rebelled with his district, took the title of khagan, and seized the Western Regions.',
  },
  s0069: {
    literal:
      'That year Yong, Jiang, Tong, and nine other prefectures suffered drought and locusts; Qi, Ding, and sixteen other prefectures suffered flood.',
    idiomatic:
      'That year Yong, Jiang, Tong, and nine other prefectures suffered drought and locusts; Qi, Ding, and sixteen others were flooded.',
  },
  s0070: {
    literal:
      'In the second year of Yonghui, in the spring of the first month, on wuxu, an edict said, "Last year the lands about the passes suffered badly from locusts; throughout the empire\'s prefectures some met flood or drought, and among the people destitution arose.',
    idiomatic:
      'In the second year of Yonghui, on wuxu of the first spring month, an edict said, "Last year the pass country was ravaged by locusts; across the provinces flood and drought struck, and the people fell into want.',
  },
  s0071: {
    literal: 'This is because my virtue is insufficient—what crime have the millions committed?',
    idiomatic: 'This comes from my lack of virtue—what fault have the millions done?',
  },
  s0072: {
    literal: 'Pitying things and blaming oneself, I bear deep anxious fear.',
    idiomatic: 'Pitying the realm and blaming myself, I am deeply afraid.',
  },
  s0073: {
    literal:
      'Now the offering year opens with spring and eastern tillage is just beginning; granaries in places stand empty, and relief must be supplied.',
    idiomatic:
      'Now spring opens the tribute year and eastern plowing begins; granaries in stricken places stand empty and must be filled by relief.',
  },
  s0074: {
    literal:
      'Where locusts and flood struck and the poor are in want, relief may be lent from the Ever-Normal and Righteous granaries.',
    idiomatic:
      'Where locust and flood left the poor in need, lend grain from the Ever-Normal and Righteous granaries.',
  },
  s0075: {
    literal:
      'For Yong and Tong, send one gentleman of the ministry each as commissioner to inquire after the people, striving to exhaust the intent of compassionate care and fulfill my heart of constant regard.',
    idiomatic:
      'Send one ministry gentleman each to Yong and Tong to comfort the people, with full compassion, as my constant care demands.',
  },
  s0076: {
    literal:
      '" On yisi, Yu Wenjie, Vice Director of the Yellow Gate and Duke of Pingchang, was given the silver-blue-gleam grandee rank and remained with a seat in confidential counsel.',
    idiomatic:
      '" On yisi Yu Wenjie, vice director of the yellow gate and Duke of Pingchang, received the silver-blue-gleam grandee rank and kept his seat at confidential counsel.',
  },
  s0077: {
    literal:
      'Liu Shi, Attendant Secretary of the Secretariat, was made Vice Director of the Secretariat, remaining with a seat in confidential counsel.',
    idiomatic:
      'Liu Shi, attendant secretary of the Secretariat, became vice director of the Secretariat with a seat at confidential counsel.',
  },
  s0078: {
    literal:
      'In the fourth month of summer, on yiyou, the ranks of Director of the Imperial Ancestral Temple and of the Directors of the Xian and Zhao Mausoleums were set at fifth grade; their assistants at seventh grade.',
    idiomatic:
      'On yiyou of the fourth summer month the directors of the Imperial Ancestral Temple and of the Xian and Zhao mausoleums were ranked fifth grade; their assistants, seventh.',
  },
  s0079: {
    literal:
      'In the fifth month, on renchen, Grand Masters of Splendid Happiness and capital civil and military officials of the fourth and fifth grades were all given personal fish tally.',
    idiomatic:
      'On renchen of the fifth month grand masters of splendid happiness and capital officials of the fourth and fifth grades received personal fish tally.',
  },
  s0080: {
    literal: 'In the sixth month, on xinyou, Prince Shenfu of Xiangyi died.',
    idiomatic: 'On xinyou of the sixth month Prince Shenfu of Xiangyi died.',
  },
  s0081: {
    literal:
      'In the seventh month, on dingwei, Helu raided and took Jinjiling and Pulei County; Liang Jianfang, General of the Martial Guard, and Qibi Heli, General of the Right Martial Cavalry, were made commanders-in-chief of the Bow-Moon campaign to attack him.',
    idiomatic:
      'On dingwei of the seventh month Helu stormed Jinjiling and Pulei County; Liang Jianfang, general of the martial guard, and Qibi Heli, general of the right martial cavalry, were made commanders of the Bow-Moon campaign against him.',
  },
  s0082: {
    literal: 'In the eighth month, on yichou, the state of Dashi first sent envoys with tribute.',
    idiomatic: 'On yichou of the eighth month the Arabs first sent envoys with tribute.',
  },
  s0083: {
    literal:
      'On jisi, Yu Zhining, Chief Minister and Duke of Yan, was made Left Vice Director of the Masters of Writing; Zhang Xingcheng, Chief Minister and concurrent Minister of Justice, Baron of Beiping, was made Right Vice Director, both with seats in confidential counsel, still not entering the titulary line.',
    idiomatic:
      'On jisi Yu Zhining, chief minister and Duke of Yan, became left vice director of the Masters of Writing; Zhang Xingcheng, chief minister and minister of justice, Baron of Beiping, became right vice director—both with seats at counsel, still without titular rank in the line.',
  },
  s0084: {
    literal:
      'Gao Jifu, Director of the Secretariat and concurrent Acting Minister of Personnel, Baron of Tiao, was made Vice Minister.',
    idiomatic:
      'Gao Jifu, director of the Secretariat and acting minister of personnel, Baron of Tiao, was made vice minister.',
  },
  s0085: {
    literal:
      'In the ninth month, on guisi, Jiucheng Palace was renamed Palace of Ten Thousand Years; Yuhua Palace was abolished and made a Buddhist monastery.',
    idiomatic:
      'On guisi of the ninth month Jiucheng Palace was renamed Palace of Ten Thousand Years; Yuhua Palace was abolished and turned into a Buddhist monastery.',
  },
  s0086: {
    literal:
      'In the intercalary month, on xinwei, the new statutes, ordinances, regulations, and forms were promulgated throughout the realm.',
    idiomatic:
      'On xinwei of the intercalary month the new statutes, ordinances, regulations, and forms were promulgated throughout the realm.',
  },
  s0087: {
    literal: 'In the tenth month of winter, on xinmao, Jin Prefecture shook.',
    idiomatic: 'On xinmao of the tenth winter month Jin Prefecture shook.',
  },
  s0088: {
    literal: 'In the eleventh month, on xinyou, he offered at the Southern Altar.',
    idiomatic: 'On xinyou of the eleventh month he sacrificed at the Southern Altar.',
  },
  s0089: {
    literal: 'On wuchen, Dingxiang shook.',
    idiomatic: 'On wuchen Dingxiang shook.',
  },
  s0090: {
    literal: 'On dingchou, the Protectorate General of Anxi was established on the former Gaochang lands.',
    idiomatic: 'On dingchou he established the Protectorate General of Anxi on the former Gaochang territory.',
  },
  s0091: {
    literal:
      'The White-Water barbarians raided Ma Prefecture; the Left Palace Guard General Zhao Xiaozu was ordered to attack and pacify them.',
    idiomatic:
      'White-Water tribesmen raided Ma Prefecture; the emperor ordered Zhao Xiaozu of the left palace guard to attack and pacify them.',
  },
  s0092: {
    literal:
      'In the third year of Yonghui, in the spring of the first month, on guihai, because from last autumn until this month there had been no rain, the emperor avoided the main hall, reduced death sentences and exile by one degree throughout the realm, and pardoned all below hard labor.',
    idiomatic:
      'In the third year of Yonghui, on guihai of the first spring month, with no rain since last autumn, the emperor left the main hall, reduced capital crimes and exile by one degree empire-wide, and pardoned all below hard labor.',
  },
  s0093: {
    literal:
      'Liang Jianfang, Qibi Heli, and others of the Bow-Moon command greatly defeated the Chuyue Zhu Ye Guzhu at Mount Lao; nine thousand heads were taken, six thousand chieftains captured, more than ten thousand living captives, and seventy thousand head of cattle and horses and mixed livestock.',
    idiomatic:
      'Liang Jianfang, Qibi Heli, and the Bow-Moon command crushed the Chuyue leader Zhu Ye Guzhu at Mount Lao—nine thousand heads, six thousand chiefs taken, more than ten thousand captives, and seventy thousand cattle, horses, and mixed herds.',
  },
  s0094: {
    literal:
      'On bingyin, Zhangsun Wuji, Grand Tutor and Duke of Zhao, because of drought asked to yield his place; this was not permitted.',
    idiomatic:
      'On bingyin Zhangsun Wuji, grand tutor and Duke of Zhao, asked to step down because of drought; the emperor refused.',
  },
  s0095: {
    literal:
      'On jisi, Chu Suiliang, Governor of Tong and Duke of Henan, was made Minister of Personnel with a seat in confidential counsel.',
    idiomatic:
      'On jisi Chu Suiliang, governor of Tong and Duke of Henan, became minister of personnel with a seat at confidential counsel.',
  },
  s0096: {
    literal: 'On bingzi, he personally sacrificed at the Imperial Ancestral Temple.',
    idiomatic: 'On bingzi he sacrificed in person at the Imperial Ancestral Temple.',
  },
  s0097: {
    literal: 'On dinghai, he plowed the thousand-acre field and bestowed silk on the assembled officials in varying measure.',
    idiomatic: 'On dinghai he plowed the thousand-acre field and gave silk to the officials in graded gifts.',
  },
  s0098: {
    literal:
      'In the third month, on xinsi, Yu Wenjie, Vice Director of the Yellow Gate and Duke of Pingchang, was made Chief Minister; Liu Shi, Vice Director of the Secretariat, was made Director of the Secretariat.',
    idiomatic:
      'On xinsi of the third month Yu Wenjie, vice director of the yellow gate and Duke of Pingchang, became chief minister; Liu Shi, vice director of the Secretariat, became director of the Secretariat.',
  },
  s0099: {
    literal: 'On gengshen, he visited the Hall of Observing Virtue and granted the great archery contest to civil and military officials.',
    idiomatic: 'On gengshen he visited the Hall of Observing Virtue and held the great archery contest for the assembled officials.',
  },
  s0100: {
    literal:
      'In the fourth month of summer, on gengyin, Zhao Xiaozu, Left Palace Guard General, greatly defeated the White-Water barbarian chief Bo Lü.',
    idiomatic:
      'On gengyin of the fourth summer month Zhao Xiaozu, general of the left palace guard, crushed the White-Water chieftain Bo Lü.',
  },
};

const path = 'translations/current_translation_jiutangshu.json';
const data = JSON.parse(readFileSync(path, 'utf8'));
if (data.metadata.chapter !== '004') {
  throw new Error(`Expected chapter 004, got ${data.metadata.chapter}`);
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
