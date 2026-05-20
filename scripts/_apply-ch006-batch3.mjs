#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0201: {
    literal: 'On dingyou, returned from Mount Song.',
    idiomatic: 'On dingyou she returned from Mount Song.',
  },
  s0202: {
    literal:
      'Summer, fourth month: Tibet\'s grand councilor Zanpo came to defect.',
    idiomatic:
      'In the fourth summer month Zanpo, Tibet\'s grand councilor, fled to the court.',
  },
  s0203: {
    literal:
      'Autumn, seventh month: The Emperor, being advanced in years, feared that the Crown Prince, the Prince of Xiang, and the Liang Prince Wu Sansi, the Prince of Ding Wu Youning, and the like would not be in harmony; she ordered an oath sworn at the Bright Hall.',
    idiomatic:
      'In the seventh month, now aged, the Emperor feared strife between the crown prince, the Prince of Xiang, and the Liang Prince Wu Sansi, the Prince of Ding Wu Youning, and their factions; she had them swear an oath in the Bright Hall.',
  },
  s0204: {
    literal:
      'Eighth month: Wang Jishan became Director of the Left of the Wenchang Platform; Dou Lu Qinwang became Director of the Right, both still co-equal with Fengge and Luantai third grade.',
    idiomatic:
      'In the eighth month Wang Jishan was made left director of the Wenchang Platform and Dou Lu Qinwang right director, each retaining third-rank standing at Fengge and Luantai.',
  },
  s0205: {
    literal: 'Winter, tenth month, yihai: Visited Xingfuchang County.',
    idiomatic: 'On yihai of the tenth winter month she visited Xingfuchang County.',
  },
  s0206: {
    literal: 'Wang Jishan died.',
    idiomatic: 'Wang Jishan died at court.',
  },
  s0207: {
    literal:
      'Third year, first month, wuyin: Liang Prince Wu Sansi was made specially advanced; Palace Ministry Vice Minister Ji Xu was sentenced to exile in Lingbiao.',
    idiomatic:
      'On wuyin of the first month of the third year Wu Sansi of Liang was promoted to specially advanced rank and Ji Xu, vice minister of the palace ministry, was banished to Lingbiao.',
  },
  s0208: {
    literal:
      'Twelfth month, xinsi: The Crown Prince\'s son Chongrun was enfeoffed as Prince of Shao.',
    idiomatic:
      'In the twelfth month, on xinsi, the crown prince\'s son Chongrun was created Prince of Shao.',
  },
  s0209: {
    literal: 'Di Renjie became Director of the Secretariat.',
    idiomatic: 'Di Renjie was appointed director of the Secretariat.',
  },
  s0210: {
    literal: 'wuyin: Visited the hot springs of Wen in Ruzhou.',
    idiomatic: 'On wuyin she traveled to the hot springs at Wen in Ruzhou.',
  },
  s0211: {
    literal:
      'jiaxu: Returned from the hot springs; built the Three Yang Palace on Mount Song.',
    idiomatic:
      'On jiaxu she returned from the springs and ordered the Three Yang Palace built on Mount Song.',
  },
  s0212: {
    literal:
      'Spring, third month: Li Qiao became Luantai Vice Minister, managing affairs as before.',
    idiomatic:
      'In the third spring month Li Qiao was made vice minister of Luantai and kept his previous duties in government.',
  },
  s0213: {
    literal: 'Summer, fourth month, wushen: Visited the Three Yang Palace.',
    idiomatic: 'On wushen of the fourth summer month she went to the Three Yang Palace.',
  },
  s0214: {
    literal:
      'Fifth month, guichou: Because her illness had healed, she proclaimed a great amnesty, changed the era name to Jiusi, abolished the Golden Wheel and other honorific titles, and held a grand feast for five days.',
    idiomatic:
      'On guichou of the fifth month, declaring herself recovered, she proclaimed a general amnesty, renamed the era Jiusi, dropped the Golden Wheel and other exalted titles, and granted five days of public revelry.',
  },
  s0215: {
    literal:
      'Sixth month: Wei Yuanzhong became Left Censor-in-Chief of the Bureau of Integrity, continuing to manage affairs as before.',
    idiomatic:
      'In the sixth month Wei Yuanzhong was made left censor-in-chief of the Bureau of Integrity while retaining his seat in government.',
  },
  s0216: {
    literal: 'That summer there was great drought.',
    idiomatic: 'That summer a severe drought struck.',
  },
  s0217: {
    literal: 'Autumn, seventh month: Returned from the Three Yang Palace.',
    idiomatic: 'In the seventh month she returned from the Three Yang Palace.',
  },
  s0218: {
    literal:
      'Palace Ministry Vice Minister Zhang Xi became Fengge Vice Minister and co-equal Fengge Luantai Chief Minister;',
    idiomatic:
      'Zhang Xi, vice minister of the palace ministry, was made Fengge vice minister and co-equal chief minister of Fengge and Luantai;',
  },
  s0219: {
    literal:
      'his nephew, Fengge Luantai Chief Minister Li Qiao, became Rector of the Directorate of Education and ceased managing affairs.',
    idiomatic:
      'his nephew Li Qiao, chief minister of Fengge and Luantai, was made rector of the Directorate of Education and left the council of state.',
  },
  s0220: {
    literal:
      'renyin, edict: "Sui Minister-over-Ministers Yang Su, in former times in this court, early received extraordinary favor.',
    idiomatic:
      'On renyin an edict declared: "Yang Su, Sui minister-over-ministers, once served this dynasty and in youth received exceptional grace.',
  },
  s0221: {
    literal:
      'He bore a treacherous nature and possessed the talent of flattery; he confused the sovereign above and sundered flesh-and-blood kin.',
    idiomatic:
      'He carried a treacherous heart and a flatterer\'s wit; he bewildered his lord and set kin against kin.',
  },
  s0222: {
    literal:
      'He shook the legitimate heir—was it only the calamity of witchcraft he grasped?',
    idiomatic:
      'He unsettled the lawful heir—as if grasping witchcraft were not crime enough.',
  },
  s0223: {
    literal:
      'He incited and fanned the later sovereign, until at last the crime of begging for a piece of flesh was complete.',
    idiomatic:
      'He goaded the later sovereign until the offense of begging flesh from one\'s own body was fully ripened.',
  },
  s0224: {
    literal:
      'The Sui house perished—was it not because of many perversities? Tracing the first sprout, the office lay here.',
    idiomatic:
      'The house of Sui fell because wickedness multiplied; trace the first seed of ruin and it leads here.',
  },
  s0225: {
    literal:
      'Alive he was an unfaithful man; dead he is an unrighteous ghost. Though his person escaped, his sons were exterminated to the clan.',
    idiomatic:
      'Living, he was faithless; dead, he is an unrighteous ghost. Though he himself was spared, his sons were wiped out to the last clan.',
  },
  s0226: {
    literal:
      'Thus treacherous designs became household instruction;',
    idiomatic:
      'Thus treachery became the lesson taught at home;',
  },
  s0227: {
    literal: 'crafty and shallow conduct became the family style.',
    idiomatic: 'cunning and shallow conduct became the family way.',
  },
  s0228: {
    literal:
      'Though punishment was added, branches and descendants remained—how could they shoulder-by-shoulder attend in close service and take rank in the court procession?',
    idiomatic:
      'Though the law struck them down, their line still stood—how could their descendants walk shoulder to shoulder with close attendants and take their places in court?',
  },
  s0229: {
    literal:
      'We, succeeding the hundred kings and reverently facing the four seas, above we praise worthy assistants, below we detest traitorous ministers.',
    idiomatic:
      'We, inheriting the hundred kings and facing the four seas in reverence, honor the worthy above and hate traitors below.',
  },
  s0230: {
    literal:
      'We constantly wish, in the leisure after the myriad affairs, to praise and blame across a thousand years—how much more when the age is not distant and what the ears still hear is present!',
    idiomatic:
      'We have long wished, between the myriad affairs, to judge the dead across a thousand years—how much more when the age is near and the living still remember!',
  },
  s0231: {
    literal:
      'Yang Su and his brothers\' sons and grandsons and below—all are forbidden to hold capital office or serve as palace guards."',
    idiomatic:
      'Yang Su and his brothers\' sons and grandsons and all below them are forbidden to hold office in the capital or serve as palace guards."',
  },
  s0232: {
    literal: 'Ninth month: Secretariat Director Di Renjie died.',
    idiomatic: 'In the ninth month Di Renjie, director of the Secretariat, died.',
  },
  s0233: {
    literal:
      'Winter, tenth month, jiayin: Restored the former calendar; changed the first month back to the first month and again made it year\'s beginning; the former first month again became the eleventh month; great amnesty.',
    idiomatic:
      'On jiayin of the tenth winter month she restored the old calendar, made the first month again the year\'s beginning and the former first month the eleventh, and proclaimed a general amnesty.',
  },
  s0234: {
    literal:
      'Wei Juyuan became Minister of Earth; Wenchang Left Assistant Wei Anshi became Luantai Vice Minister and co-equal Fengge Luantai Chief Minister.',
    idiomatic:
      'Wei Juyuan was made minister of earth; Wei Anshi, left assistant of Wenchang, was made Luantai vice minister and co-equal chief minister.',
  },
  s0235: {
    literal: 'dingmao: Visited Xin\'an; partial amnesty for that county.',
    idiomatic: 'On dingmao she visited Xin\'an and granted a partial amnesty to the county.',
  },
  s0236: {
    literal: 'renshen: Returned from Xin\'an.',
    idiomatic: 'On renshen she returned from Xin\'an.',
  },
  s0237: {
    literal:
      'Twelfth month: The slaughter ban was lifted; all sacrifices were ordered to use oxen and sheep as before.',
    idiomatic:
      'In the twelfth month she lifted the ban on slaughter; all sacrifices were again to use oxen and sheep.',
  },
  s0238: {
    literal: 'First year of Dazu, spring first month: Edict changing the era name.',
    idiomatic: 'In the first year of Dazu, on the first spring month, an edict changed the era name.',
  },
  s0239: {
    literal:
      'Second month: Luantai Vice Minister Li Huaiyuan became co-equal Fengge Luantai Chief Minister.',
    idiomatic:
      'In the second month Li Huaiyuan, vice minister of Luantai, joined the council as co-equal chief minister.',
  },
  s0240: {
    literal:
      'Third month: Yao Yuanchong became Fengge Vice Minister, managing affairs as before.',
    idiomatic:
      'In the third month Yao Yuanchong was made Fengge vice minister and kept his seat in government.',
  },
  s0241: {
    literal:
      'bingshen: Fengge Vice Minister Zhang Xi, for corruption, was sentenced to exile in Xun Prefecture.',
    idiomatic:
      'On bingshen Zhang Xi, Fengge vice minister, was banished to Xun Prefecture on a charge of graft.',
  },
  s0242: {
    literal: 'Summer, fifth month: Visited the Three Yang Palace.',
    idiomatic: 'In the fifth summer month she went to the Three Yang Palace.',
  },
  s0243: {
    literal:
      'Ordered Left Censor-in-Chief Wei Yuanzhong to serve as commander-in-chief to guard against the Turks.',
    idiomatic:
      'She ordered Wei Yuanzhong, left censor-in-chief, to serve as commander-in-chief against the Turks.',
  },
  s0244: {
    literal:
      'Palace Ministry Vice Minister Gu Cong became co-equal Fengge Luantai Chief Minister.',
    idiomatic:
      'Gu Cong, vice minister of the palace ministry, joined the council as co-equal chief minister.',
  },
  s0245: {
    literal:
      'Sixth month: Summer Office Vice Minister Li Jiongxiu became co-equal Fengge Luantai Chief Minister.',
    idiomatic:
      'In the sixth month Li Jiongxiu, vice minister of the summer office, joined the council as co-equal chief minister.',
  },
  s0246: {
    literal: 'xinwei: Partial amnesty for Gaocheng County.',
    idiomatic: 'On xinwei she granted a partial amnesty to Gaocheng County.',
  },
  s0247: {
    literal: 'Autumn, seventh month, jiaxu: Returned from the Three Yang Palace.',
    idiomatic: 'On jiaxu of the seventh month she returned from the Three Yang Palace.',
  },
  s0248: {
    literal:
      'Ninth month: Prince of Shao Chongrun, framed by Yizhi, was ordered to take his own life.',
    idiomatic:
      'In the ninth month Prince of Shao Chongrun, framed by Zhang Yizhi, was ordered to kill himself.',
  },
  s0249: {
    literal:
      'Winter, tenth month: Visited the capital; great amnesty; changed the era name to Chang\'an.',
    idiomatic:
      'In the tenth winter month she went to the capital, proclaimed a general amnesty, and renamed the era Chang\'an.',
  },
  s0250: {
    literal:
      'Second year, spring first month: The Turks raided Yan, Xia, and other prefectures, killing and plundering officials and people.',
    idiomatic:
      'In the first month of the second year the Turks raided Yan, Xia, and other prefectures, slaughtering officials and people.',
  },
  s0251: {
    literal:
      'Autumn, ninth month, yichou: There was a solar eclipse, not fully like a hook; the capital and the four directions saw it.',
    idiomatic:
      'On yichou of the ninth month the sun was eclipsed, not quite to a hook; the capital and the realm beheld it.',
  },
  s0252: {
    literal:
      'Winter, tenth month: The state of Japan sent envoys presenting local products.',
    idiomatic:
      'In the tenth winter month Japan sent envoys with tribute.',
  },
  s0253: {
    literal: 'Eleventh month: Prince of Xiang Dan was made Minister of Works.',
    idiomatic: 'In the eleventh month the Prince of Xiang, Dan, was made minister of works.',
  },
  s0254: {
    literal:
      'wuzi: Personally sacrificed at the Southern Suburb; great amnesty.',
    idiomatic:
      'On wuzi she sacrificed at the Southern Suburb in person and proclaimed a general amnesty.',
  },
  s0255: {
    literal: 'Third year, spring third month, renxu: There was a solar eclipse.',
    idiomatic: 'On renxu of the third spring month of the third year the sun was eclipsed.',
  },
  s0256: {
    literal:
      'Summer, fourth month, gengzi: Prince of Xiang Dan memorialized declining the post of Minister of Works; it was granted.',
    idiomatic:
      'On gengzi of the fourth summer month the Prince of Xiang, Dan, asked to resign as minister of works and was allowed.',
  },
  s0257: {
    literal: 'The Wenchang Platform was renamed the Central Platform.',
    idiomatic: 'The court renamed the Wenchang Platform the Central Platform.',
  },
  s0258: {
    literal: 'Li Qiao managed the affairs of the Director of Proclamations.',
    idiomatic: 'Li Qiao took charge of the directorate of proclamations.',
  },
  s0259: {
    literal:
      'Sixth month: In Ning Prefecture rain fell; mountains and rivers swelled violently; more than two thousand households were swept away; more than a thousand drowned.',
    idiomatic:
      'In the sixth month Ning Prefecture was flooded; mountain torrents swept away more than two thousand households and drowned more than a thousand people.',
  },
  s0260: {
    literal: 'Autumn, seventh month: Right Golden Guard General Tang Xiujing was executed.',
    idiomatic: 'In the seventh month Tang Xiujing, right general of the golden guards, was put to death.',
  },
  s0261: {
    literal:
      'Autumn, ninth month: Direct Remonstrator Zhu Jingze became co-equal Fengge Luantai Chief Minister.',
    idiomatic:
      'In the ninth month Zhu Jingze, direct remonstrator, joined the council as co-equal chief minister.',
  },
  s0262: {
    literal: 'wushen: Prince of Xiang Dan was made Governor of Yong Prefecture.',
    idiomatic: 'On wushen the Prince of Xiang, Dan, was made governor of Yong Prefecture.',
  },
  s0263: {
    literal:
      'That month: Censor-in-Chief and concurrent manager of affairs, Right Vice Tutor to the Heir Wei Yuanzhong was slandered by Zhang Changzong and demoted to defender of Gaoyao in Duan Prefecture.',
    idiomatic:
      'That month Wei Yuanzhong, censor-in-chief, councilor, and right vice tutor to the heir, was slandered by Zhang Changzong and demoted to defender of Gaoyao in Duan Prefecture.',
  },
  s0264: {
    literal:
      'The capital had heavy rain and hail; men and livestock froze to death.',
    idiomatic:
      'A great hailstorm struck the capital; people and livestock froze to death.',
  },
  s0265: {
    literal: 'Winter, tenth month, bingyin: The imperial carriage returned to Shendu.',
    idiomatic: 'On bingyin of the tenth winter month the court returned to Shendu.',
  },
  s0266: {
    literal: 'yiyou: Returned from the capital.',
    idiomatic: 'On yiyou she returned from the capital.',
  },
  s0267: {
    literal:
      'Fourth year, spring first month: Built Xingtai Palace on Mount Wan\'an in Shou\'an County.',
    idiomatic:
      'In the first spring month of the fourth year she built Xingtai Palace on Mount Wan\'an in Shou\'an County.',
  },
  s0268: {
    literal:
      'Palace Ministry Vice Minister Wei Silizhi became Fengge Vice Minister and co-equal Fengge Luantai Chief Minister.',
    idiomatic:
      'Wei Silizhi, vice minister of the palace ministry, was made Fengge vice minister and co-equal chief minister.',
  },
  s0269: {
    literal: 'Zhu Jingze requested retirement; it was granted.',
    idiomatic: 'Zhu Jingze asked to retire and was permitted.',
  },
  s0270: {
    literal:
      'Third month: Prince of Ping\'en Commandery Chongfu was advanced to Prince of Qiao; Summer Office Vice Minister Zong Chuke became co-equal Fengge Luantai Chief Minister.',
    idiomatic:
      'In the third month Chongfu, prince of Ping\'en commandery, was raised to prince of Qiao, and Zong Chuke, vice minister of the summer office, joined the council as co-equal chief minister.',
  },
  s0271: {
    literal:
      'Summer, fourth month: Wei Anshi managed the affairs of the Director of Proclamations; Li Qiao managed the affairs of the Secretariat.',
    idiomatic:
      'In the fourth summer month Wei Anshi took charge of proclamations and Li Qiao took charge of the Secretariat.',
  },
  s0272: {
    literal:
      'bingzi: Visited Xingtai Palace. Sixth month: Palace Ministry Vice Minister Cui Xuanwei became co-equal Fengge Luantai Chief Minister;',
    idiomatic:
      'On bingzi she visited Xingtai Palace. In the sixth month Cui Xuanwei, vice minister of the palace ministry, joined the council as co-equal chief minister;',
  },
  s0273: {
    literal:
      'Li Qiao became Rector of the Directorate of Education, managing affairs as before.',
    idiomatic:
      'Li Qiao was made rector of the Directorate of Education while retaining his seat in government.',
  },
  s0274: {
    literal: 'Seventh month, bingxu: Yang Zaisi became Director of the Secretariat.',
    idiomatic: 'On bingxu of the seventh month Yang Zaisi was appointed director of the Secretariat.',
  },
  s0275: {
    literal: 'jiawu: Returned from Xingtai Palace.',
    idiomatic: 'On jiawu she returned from Xingtai Palace.',
  },
  s0276: {
    literal: 'Zong Chuke was demoted to military governor of Yuan Prefecture.',
    idiomatic: 'Zong Chuke was demoted and sent to govern Yuan Prefecture.',
  },
  s0277: {
    literal:
      'Eighth month: Yao Yuanchong became Director of Palace Studs, managing affairs;',
    idiomatic:
      'In the eighth month Yao Yuanchong was made director of palace studs and kept his seat in government;',
  },
  s0278: {
    literal:
      'Wei Anshi was made acting governor-general of Yangzhou Metropolitan Prefecture.',
    idiomatic:
      'Wei Anshi was made acting governor-general of Yangzhou metropolitan prefecture.',
  },
  s0279: {
    literal:
      'Winter, tenth month: Autumn Office Vice Minister Zhang Jianzhi became co-equal Fengge Luantai Chief Minister.',
    idiomatic:
      'In the tenth winter month Zhang Jianzhi, vice minister of the autumn office, joined the council as co-equal chief minister.',
  },
  s0280: {
    literal:
      'Eleventh month: Li Qiao became Minister of Earth; Zhang Jianzhi became Fengge Luantai Chief Minister.',
    idiomatic:
      'In the eleventh month Li Qiao was made minister of earth and Zhang Jianzhi chief minister of Fengge and Luantai.',
  },
  s0281: {
    literal:
      'From the ninth month until now, day and night were overcast; great rain and snow fell; in the capital some died of hunger and cold; the offices were ordered to open granaries for relief.',
    idiomatic:
      'From the ninth month until now the skies stayed dark; heavy snow and rain fell; in the capital some froze or starved; the court ordered the granaries opened for relief.',
  },
  s0282: {
    literal: 'First year of Shenlong, spring first month: Great amnesty; changed the era name.',
    idiomatic:
      'In the first year of Shenlong, on the first spring month, she proclaimed a general amnesty and changed the era name.',
  },
  s0283: {
    literal:
      'The Emperor was unwell; an edict from the era of Civil Exaltation onward, for those convicted of crime—except the three prefectures of Yang, Yu, and Bo and the chiefs of various rebellions—all were pardoned and released.',
    idiomatic:
      'The Emperor fell ill; she decreed that from the era of Civil Exaltation onward all the condemned—save the three prefectures of Yang, Yu, and Bo and the ringleaders of rebellion—were pardoned and released.',
  },
  s0284: {
    literal:
      'guhai: Lintai Director Zhang Yizhi and his brother, Director of Palace Studs Changzong, rebelled; the Crown Prince led the Left and Right Forest Guards, Huan Yanfan, Jing Hui, and others, entering the forbidden precinct with forest troops to execute them.',
    idiomatic:
      'On guhai Zhang Yizhi, director of Lintai, and his brother Changzong, director of palace studs, rose in rebellion; the crown prince led the left and right forest guards—Huan Yanfan, Jing Hui, and others—into the inner palace with armored troops and put them to death.',
  },
  s0285: {
    literal:
      'jiazi: The Crown Prince supervised the state, presiding over the myriad affairs; great amnesty.',
    idiomatic:
      'On jiazi the crown prince assumed regency over all affairs of state and a general amnesty was proclaimed.',
  },
  s0286: {
    literal:
      'That day the Emperor transmitted the imperial throne to the Crown Prince and moved to Shangyang Palace.',
    idiomatic:
      'That same day the Emperor abdicated in favor of the crown prince and withdrew to Shangyang Palace.',
  },
  s0287: {
    literal:
      'wushen: The Emperor was honored with the title August Emperor Zetian the Great Sage.',
    idiomatic:
      'On wushen the Emperor was honored as August Emperor Zetian the Great Sage.',
  },
  s0288: {
    literal:
      'Winter, eleventh month, renyin: Zetian was near death; her final edict ordered enshrinement in the temple and burial in the mausoleum, and commanded that the imperial title be removed—she was to be called Empress Zetian the Great Sage;',
    idiomatic:
      'On renyin of the eleventh winter month Zetian was failing; her testament ordered temple enshrinement and burial in the imperial tomb, and stripped away the title of emperor—she was to be styled Empress Zetian the Great Sage;',
  },
  s0289: {
    literal:
      'the Wang and Xiao families and the sons and grandsons and kin of Chu Suiliang, Han Yuan, and others who had been implicated at the time—all were ordered restored to their professions.',
    idiomatic:
      'the Wang and Xiao clans and the sons, grandsons, and kin of Chu Suiliang, Han Yuan, and others implicated in those days were all ordered restored to their professions.',
  },
  s0290: {
    literal:
      'That day she died in the Hall of Immortal Dwelling at Shangyang Palace, aged eighty-three; posthumous title Empress Zetian the Great Sage.',
    idiomatic:
      'That day she died in the Hall of Immortal Dwelling at Shangyang Palace, aged eighty-three; her posthumous title was Empress Zetian the Great Sage.',
  },
  s0291: {
    literal:
      'Second year, fifth month, gengshen: Enshrined and buried at Qianling.',
    idiomatic:
      'On gengshen of the fifth month of the second year she was enshrined and buried at Qianling.',
  },
  s0292: {
    literal:
      'When Ruizong took the throne, an edict followed the precedent of the first year of Shangyuan and styled her Empress of Heaven; before long she was posthumously honored as Great Sage Empress of Heaven, and the title was changed to Empress Dowager Zetian.',
    idiomatic:
      'When Emperor Ruizong ascended, an edict following the Shangyuan precedent styled her Empress of Heaven; soon she was posthumously honored Great Sage Empress of Heaven, then retitled Empress Dowager Zetian.',
  },
  s0293: {
    literal:
      'The Empress Dowager once summoned literary scholars Zhou Simao, Fan Lübing, and Wei Jingye and ordered them to compile the Mysterious Overview and the Inner Canon of Past and Present, each one hundred scrolls; the Essentials of the Eastern Palace and the Standards of the Young Yang, each thirty scrolls; the Canon of the Moated City and the New Admonitions of the Phoenix Tower, the Biographies of Filial Sons and Exemplary Women, each twenty scrolls; the Essentials of Inner Rule and the Essentials of Music, each ten scrolls; the New Admonitions for the Hundred Officials and the Basic Occupations of the Myriad People, each five scrolls; the Model for Ministers in two scrolls; the Chuihong Regulations in four scrolls, and collected writings in one hundred twenty scrolls—all stored in the secret archive.',
    idiomatic:
      'The empress dowager once summoned the scholars Zhou Simao, Fan Lübing, and Wei Jingye and ordered them to compile the Mysterious Overview and the Inner Canon of Past and Present at one hundred scrolls each; the Essentials of the Eastern Palace and the Standards of the Young Yang at thirty each; the Canon of the Moated City, the New Admonitions of the Phoenix Tower, and the Biographies of Filial Sons and Exemplary Women at twenty each; the Essentials of Inner Rule and the Essentials of Music at ten each; the New Admonitions for the Hundred Officials and the Basic Occupations of the Myriad People at five each; the Model for Ministers in two scrolls; the Chuihong Regulations in four; and her collected writings in one hundred twenty scrolls—all lodged in the secret archive.',
  },
  s0294: {
    literal: 'The historian writes: Order and disorder depend on the age; survival and perishing depend on circumstance.',
    idiomatic:
      'The historian writes: Whether the age is ordered or chaotic depends on the times; whether a house survives or falls depends on circumstance.',
  },
  s0295: {
    literal:
      'Had Jie and Zhou been above, even ten Yao could not have governed;',
    idiomatic:
      'Had Jie and Zhou held the throne, even ten Yao could not have brought order;',
  },
  s0296: {
    literal:
      'had Yao and Shun been above, even ten Jie could not have thrown it into chaos;',
    idiomatic:
      'had Yao and Shun held it, even ten Jie could not have thrown the realm into chaos;',
  },
  s0297: {
    literal:
      'let a cowardly man or a woman seize the moment and gain power, and it is enough to sit and command the lives of the multitude and wantonly wield unrighteous might.',
    idiomatic:
      'let a timid man or a woman seize the moment and gain power, and it is enough to sit in command of every life and wield unrighteous might at will.',
  },
  s0298: {
    literal:
      'Consider the years when the Wu clan held power: men of talent came in unbroken succession, yet none failed to grieve at the ruin of their houses and clench their fists at the court\'s peril—still they could not repay the former emperor\'s grace or defend their lord\'s son.',
    idiomatic:
      'In the years of Wu\'s rule, talent crowded the court in endless file, yet all grieved for ruined houses and clenched their fists at a court in peril—still they could not repay the late emperor\'s grace or defend their sovereign\'s son.',
  },
  s0299: {
    literal:
      'Soon the innocent were trapped; they stretched their necks to the execution—Heaven and Earth became a cage; whither could they flee?',
    idiomatic:
      'Soon the innocent were trapped, necks offered to the blade—Heaven and Earth themselves were the cage; where could they flee?',
  },
  s0300: {
    literal: 'Lamentable!',
    idiomatic: 'How lamentable!',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/006.json';
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
if (trans.metadata.chapter !== '006') {
  throw new Error(`Expected chapter 006, got ${trans.metadata.chapter}`);
}

const expectedIds = new Set(
  Array.from({ length: END - START + 1 }, (_, i) => `s${String(START + i).padStart(4, '0')}`)
);
const hasAll =
  trans.sentences.length === END - START + 1 &&
  trans.sentences.every((s) => expectedIds.has(s.originalId || s.id));

if (!hasAll) {
  trans = {
    metadata: {
      book: 'jiutangshu',
      chapter: '006',
      file: chapterPath,
    },
    sentences: extractRange(chapterPath, START, END),
  };
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
console.log('Applied', applied, 'translations (s0201–s0300)');
