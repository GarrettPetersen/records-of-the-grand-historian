#!/usr/bin/env node
/** Batch 5: s0401–s0500 (Jiutangshu ch.008, Xuanzong — Kaiyuan 12–15) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0401: {
    literal:
      'In the eighth month of autumn, on wushen, the temple titles of the eight-generation ancestors the Propagating Emperor and the Radiant Emperor were fixed as Xianzu and Yizu and they were first enshrined in the nine temples of the Grand Temple.',
    idiomatic:
      'That autumn, on wushen, the Propagating and Radiant emperors were enshrined as Xianzu and Yizu in the Grand Temple’s nine shrines.',
  },
  s0402: {
    literal:
      'On jisi of the ninth month, the self-authored Great Beneficial Formulas was promulgated throughout the realm; each prefecture was to appoint one medical instructor.',
    idiomatic:
      'In the ninth month the emperor’s Great Beneficial Formulas went empire-wide, with one medical instructor per prefecture.',
  },
  s0403: {
    literal:
      'At the spring and autumn libations, prefectures should as before use oxen and sheep; subordinate counties need only offer wine and dried meat.',
    idiomatic:
      'Prefectures kept full sacrificial beasts at the seasonal rites; counties offered wine and dried meat only.',
  },
  s0404: {
    literal: 'In the tenth month of winter, on dingyou, he visited the Hot Springs Palace at Xinfeng.',
    idiomatic: 'In the tenth month he went to the Hot Springs at Xinfeng.',
  },
  s0405: {
    literal: 'On jiayin, he returned from the Hot Springs.',
    idiomatic: 'On jiayin he came back from the springs.',
  },
  s0406: {
    literal:
      'In the eleventh month, on wuyin, he personally sacrificed at the southern suburb, proclaimed a great amnesty for all under Heaven, and released prisoners from death through penal service.',
    idiomatic:
      'In the eleventh month he worshipped at the southern altar, amnestied the realm, and freed prisoners down to penal labor.',
  },
  s0407: {
    literal:
      'Officials of third rank and above who performed the rite or served in attendance received one noble rank; those of fourth rank were promoted one step.',
    idiomatic:
      'Third-rank officers at the rite gained a noble grade; fourth-rank men rose one step.',
  },
  s0408: {
    literal:
      'Meritorious enfeoffees since Wude and chief ministers who had suffered wrongful demotion were to be reported by the relevant offices.',
    idiomatic:
      'Offices were to report meritorious enfeoffees and wronged chief ministers since Wude.',
  },
  s0409: {
    literal: 'The realm enjoyed great feasting for three days; the capital for five.',
    idiomatic: 'Three days of public feasting were proclaimed; the capital feasted five.',
  },
  s0410: {
    literal:
      'That month, from the capital east to Shandong and Huainan, heavy snow piled more than three feet in the level fields.',
    idiomatic:
      'That month snow buried the roads from the capital through Shandong and Huainan three feet deep.',
  },
  s0411: {
    literal:
      'On dinghai, the staff of the Directorate of Armaments was abolished; the Directorate of the Palace Workshops added one Vice Director to take their place.',
    idiomatic:
      'On dinghai the Armaments directorate was folded into the Palace Workshops, with an added vice director.',
  },
  s0412: {
    literal: 'In the twelfth month, on jiawu, he visited the Phoenix Spring baths.',
    idiomatic: 'In the twelfth month he went to the Phoenix Spring baths.',
  },
  s0413: {
    literal: 'On wushen, he returned from the Phoenix Spring baths.',
    idiomatic: 'On wushen he returned from Phoenix Spring.',
  },
  s0414: {
    literal: 'On gengshen, Wang Jun was appointed Qizhou governor.',
    idiomatic: 'On gengshen Wang Jun became governor of Qi.',
  },
  s0415: {
    literal: 'In the first year of Kaiyuan 12, in spring, the first month.',
    idiomatic: 'Kaiyuan 12 opened in the first month of spring.',
  },
  s0416: {
    literal: 'In summer, the fourth month, Yijun, son of the late Prince of Ze Shangjin, was enfeoffed as heir to the Prince of Ze.',
    idiomatic: 'In the fourth month Shangjin’s son Yijun succeeded as Prince of Ze.',
  },
  s0417: {
    literal:
      'Heir Prince of Xu Guan was demoted to Ezhou vice-prefect because his younger brother Qiong had succeeded Prince Shangjin.',
    idiomatic:
      'Prince of Xu Guan was sent to Ezhou as vice-prefect when his brother Qiong took Shangjin’s title.',
  },
  s0418: {
    literal:
      'On guimao, Heir Prince of Jiang Yi was reduced to Prince of Xin’an; Heir Prince of Shu Shiyu to Prince of Guanghan; Heir Prince of Mi Che to Prince of Puyang; Heir Prince of Cao Zhen to Duke of Ji; Heir Prince of Zhao Ju to Prince of Zhongshan; Prince of Wuyang Kan to Duke of Li.',
    idiomatic:
      'On guimao the collateral heirs were demoted: Yi to Xin’an, Shiyu to Guanghan, Che to Puyang, Zhen to Duke of Ji, Ju to Zhongshan, Kan to Duke of Li.',
  },
  s0419: {
    literal:
      'Yi and the others had all been made kings by adoption after Shenlong; because Guan had coveted the Ze fief, they were all returned to the clan rolls and re-enfeoffed.',
    idiomatic:
      'These princes had been adopted into the line after Shenlong; Guan’s grasp for Ze’s title brought them all back to ordinary enfeoffments.',
  },
  s0420: {
    literal: 'In the seventh month of autumn, on renshen, there was a total eclipse of the moon.',
    idiomatic: 'In the seventh month the moon was wholly eclipsed.',
  },
  s0421: {
    literal: 'On jimao, Empress Wang was deposed and made a commoner.',
    idiomatic: 'On jimao Empress Wang was cast down to commoner status.',
  },
  s0422: {
    literal:
      'Her brother, the heir’s Junior Tutor and Commandant of the Horse, Shouyi, was demoted to Zezhou vice-prefect; at Lantian he was ordered to die.',
    idiomatic:
      'Her brother Shouyi, the heir’s tutor and imperial son-in-law, was banished to Ze and ordered to die at Lantian.',
  },
  s0423: {
    literal: 'Minister of Revenue and Earl of Hedong Zhang Jiazhen was demoted to Taizhou governor.',
    idiomatic: 'Zhang Jiazhen, Minister of Revenue and Earl of Hedong, was sent to govern Taizhou.',
  },
  s0424: {
    literal:
      'In the eleventh month of winter, on gengshen, he went to the eastern capital; at Huayin he composed a text for the mountain temple, had it carved in stone, and set it up along the road south of the shrine.',
    idiomatic:
      'In the eleventh month he traveled east; at Huayin he carved his hymn to the sacred peak and set it beside the temple road.',
  },
  s0425: {
    literal: 'On wuyin, he returned from the eastern capital.',
    idiomatic: 'On wuyin he came back from Luoyang.',
  },
  s0426: {
    literal: 'On gengchen, the Prince of Shen, Grand Mentor, died; posthumously he was titled Crown Prince Hui Zhuang.',
    idiomatic: 'On gengchen the Prince of Shen died and was mourned as Crown Prince Hui Zhuang.',
  },
  s0427: {
    literal:
      'Qin Xingzhang, chieftain of the Five Streams, rebelled; General of Garrisoned Armies and Palace Attendant Yang Sixu was sent to crush him.',
    idiomatic:
      'The Five Streams rose under Qin Xingzhang; Yang Sixu marched in and broke them.',
  },
  s0428: {
    literal: 'In the intercalary twelfth month, on bingchen the new moon, there was a solar eclipse.',
    idiomatic: 'At the intercalary year’s end the new moon was eclipsed.',
  },
  s0429: {
    literal: 'In the first year of Kaiyuan 13, in spring, the first month, on yiyou, the Youzhou area command was made a great area command.',
    idiomatic: 'Early in Kaiyuan 13, on yiyou, Youzhou became a great area command.',
  },
  s0430: {
    literal: 'On wuzi, death sentences were commuted to exile; all crimes below exile were pardoned.',
    idiomatic: 'On wuzi capital convicts were sent into exile; lesser sentences were wiped clean.',
  },
  s0431: {
    literal:
      'Assistant Censor-in-Chief Jiang Qinxu and others were separately dispatched to the ten circuits to review and decide prisoners.',
    idiomatic:
      'Jiang Qinxu and fellow censors fanned out across ten circuits to judge the prisons.',
  },
  s0432: {
    literal: 'In the second month, on wuwu, he visited Longmen and returned the same day.',
    idiomatic: 'In the second month he made a day trip to Longmen.',
  },
  s0433: {
    literal: 'On yihai, the Elite Cavalry was first established, divided among the twelve guards.',
    idiomatic: 'On yihai the Elite Cavalry corps was founded under the twelve guard offices.',
  },
  s0434: {
    literal:
      'On bingzi, the prefecture Bin (豳) was changed to Bin (邠), Mei to Mo, Liang to Bao, Yuan to Wu, Wu to He, and Quan to Fu—to avoid graphs resembling wen in writing or homophones in speech.',
    idiomatic:
      'On bingzi six prefectures were renamed to dodge characters and sounds that clashed with the emperor’s name.',
  },
  s0435: {
    literal: 'In the third month, on jiawu, the crown prince Sizhi changed his name to Hong;',
    idiomatic: 'In the third month the crown prince Sizhi took the name Hong;',
  },
  s0436: {
    literal: 'Prince of Tan Sizhi changed his name to Tan and was enfeoffed Prince of Qing;',
    idiomatic: 'the Prince of Tan became Tan, Prince of Qing;',
  },
  s0437: {
    literal: 'Prince of Shan Sisheng changed his name to Jun and was enfeoffed Prince of Zhong;',
    idiomatic: 'the Prince of Shan became Jun, Prince of Zhong;',
  },
  s0438: {
    literal: 'Prince of Zeng Sizhen changed his name to Qia and was enfeoffed Prince of Di;',
    idiomatic: 'the Prince of Zeng became Qia, Prince of Di;',
  },
  s0439: {
    literal: 'Prince of E Sichu changed his name to Juan and was enfeoffed Prince of Lang;',
    idiomatic: 'the Prince of E became Juan, Prince of Lang;',
  },
  s0440: {
    literal: 'Sixuan changed his name to Huang and was enfeoffed Prince of Rong.',
    idiomatic: 'and Sixuan became Huang, Prince of Rong.',
  },
  s0441: {
    literal:
      'The eighth son Ti was enfeoffed Prince of Guang; the twelfth son Wei Prince of Yi; the thirteenth Yun Prince of Ying; the sixteenth Ze Prince of Yong; the eighteenth Qing Prince of Shou; the twentieth Hui Prince of Yan; the twenty-first Mu Prince of Sheng; the twenty-second Yi Prince of Ji.',
    idiomatic:
      'Younger sons received fiefs: Ti as Guang, Wei as Yi, Yun as Ying, Ze as Yong, Qing as Shou, Hui as Yan, Mu as Sheng, Yi as Ji.',
  },
  s0442: {
    literal:
      'On bingshen, Censor-in-Chief Cheng Hangqian memorialized: “The Zhou persecutors Lai Zixun, Wan Guojun, Wang Hongyi, Hou Sizhi, Guo Ba, Jiao Renchan, Zhang Zhim, Li Jingren, Tang Fengyi, Lai Junyi, Zhou Xing, Qiu Shenji, Suo Yuanli, Cao Renzhe, Wang Jingzhao, Pei Ji, Li Qinshou, Liu Guangye, Wang Deshou, Qu Zhenyun, Bao Sigong, Liu Jingyang, Wang Chuzhen—twenty-three men—mutilated the imperial clan and framed the innocent in the gravest cases; their descendants shall not hold office.',
    idiomatic:
      'On bingshen Cheng Hangqian named twenty-three Zhou torturers—from Lai Junyi and Zhou Xing to Wang Chuzhen—and barred their descendants forever from office.',
  },
  s0443: {
    literal:
      'Chen Jiayan, Yu Chengye, Huangfu Wenbei, and Fu Youyi, though their guilt was lighter, shall have no descendant appointed to posts nearby.',
    idiomatic:
      'Four lesser offenders—Chen Jiayan, Yu Chengye, Huangfu Wenbei, Fu Youyi—were barred from near appointments for their kin as well.',
  },
  s0444: {
    literal: 'We ask that the edict of the fifth day of the second month of Kaiyuan 2 be followed.',
    idiomatic: 'The memorial asked that Kaiyuan 2 policy apply.',
  },
  s0445: {
    literal: '” — end of the memorial.',
    idiomatic: '[Close of memorial.]',
  },
  s0446: {
    literal:
      'In summer, the fourth month, on dingsi, the Hall of Collected Immortals was changed to the Hall of Gathered Worthies, and the Lizheng Hall Academy to the Gathered Worthies Academy;',
    idiomatic:
      'In the fourth month the Hall of Collected Immortals became the Hall of Gathered Worthies, its academy renamed likewise;',
  },
  s0447: {
    literal: 'those of fifth rank and above within the palace were made academicians; sixth rank and below, direct academicians.',
    idiomatic: 'palace officers of fifth rank up became academicians, sixth rank down direct academicians.',
  },
  s0448: {
    literal:
      'On guiyou, assembly envoys were ordered each to recommend filial, fraternal, civil, and martial men of their circuits to gather below Mount Tai.',
    idiomatic:
      'On guiyou circuit envoys were told to send the worthy to assemble at Mount Tai.',
  },
  s0449: {
    literal:
      'In the fifth month, on gengyin, the sorcerer Liu Dinggao led his band in a night attack on the Tongluo Gate; all were seized and beheaded.',
    idiomatic:
      'In the fifth month the sorcerer Liu Dinggao stormed Tongluo Gate by night; his band was caught and killed.',
  },
  s0450: {
    literal: 'In the sixth month, on yihai, the western market of the capital was abolished.',
    idiomatic: 'In the sixth month the capital’s western market was shut.',
  },
  s0451: {
    literal:
      'In the tenth month of winter, on guichou, the new bronze armillary was completed and set inside the Jingyun Gate to be shown to the hundred officials.',
    idiomatic:
      'In the tenth month a new bronze armillary sphere was finished and displayed inside Jingyun Gate.',
  },
  s0452: {
    literal: 'On xinyou, the eastern tour to perform the Feng and Shan rites on Mount Tai set out from the eastern capital.',
    idiomatic: 'On xinyou the court set out from Luoyang to seal Mount Tai.',
  },
  s0453: {
    literal: 'In the eleventh month, on bingxu, they reached the Dai Temple halt at Yanzhou.',
    idiomatic: 'In the eleventh month they reached the sacred halt at Yanzhou.',
  },
  s0454: {
    literal: 'On dinghai, they fasted in the traveling palace.',
    idiomatic: 'On dinghai the emperor fasted in the travel palace.',
  },
  s0455: {
    literal:
      'On jichou, the winter solstice, the full imperial train climbed the mountain; guards and insignia lined the foothills for more than a hundred li.',
    idiomatic:
      'On the solstice the imperial procession climbed Tai; armor glittered a hundred li below.',
  },
  s0456: {
    literal:
      'An edict kept the followers at the valley mouth; the emperor ascended with chief ministers and ritual officers.',
    idiomatic:
      'The train waited in the valley while the emperor went up with his ministers and masters of rites.',
  },
  s0457: {
    literal:
      'On gengyin, he sacrificed to August Heaven on the upper altar; the relevant offices sacrificed to the Five Emperors and the hundred spirits on the lower altar.',
    idiomatic:
      'On gengyin he offered to Heaven on the summit altar; officers tended the lower altar to the Five Emperors and all spirits.',
  },
  s0458: {
    literal:
      'When the rite was complete, the jade register was placed in the stone casque of the altar of the seal; then the firewood was lit.',
    idiomatic:
      'The rite ended with the jade book sealed in stone; then the offering fire was kindled.',
  },
  s0459: {
    literal:
      'As the flames rose, the ministers cried “Ten thousand years!”; the shout rolled from the peak to the foothills and shook the valleys.',
    idiomatic:
      'Flames climbed and a hundred voices shouted “Ten thousand years!” from peak to foothill until the mountains rang.',
  },
  s0460: {
    literal: 'The emperor returned to the fasting palace; auspicious clouds appeared, and the sun wore a halo.',
    idiomatic: 'Back in the fasting palace, lucky clouds gathered and a halo crowned the sun.',
  },
  s0461: {
    literal:
      'On xinmao, he sacrificed to Earth at Sheshou, placed the jade register in the stone casque, and followed the rites of the seal altar.',
    idiomatic:
      'On xinmao he worshipped Earth at Sheshou, sealed the jade book in stone as on the summit.',
  },
  s0462: {
    literal:
      'On renchen, in the tent hall he received congratulations; a great amnesty was proclaimed for all under Heaven, and exiles not yet home were sent back.',
    idiomatic:
      'On renchen he took homage in the tent hall, amnestied the realm, and called exiles home.',
  },
  s0463: {
    literal:
      'Inner and outer officials of third rank and above received one noble rank; fourth rank and below one promotion; officers who climbed the mountain one further rank; the Marquis Who Exalts the Sage was given office according to talent.',
    idiomatic:
      'Third-rank officers gained a noble grade, fourth-rank men a step, mountaineers an extra rank; Confucius’ marquis was employed by merit.',
  },
  s0464: {
    literal:
      'The spirit of Mount Tai was enfeoffed as King Equalizing Heaven, with ritual rank one grade above the Three Excellencies; within ten li of the mountain, fuel-cutting was forbidden.',
    idiomatic:
      'Tai’s god became King Equalizing Heaven, honored above the Three Excellencies; for ten li around the peak, axes were forbidden.',
  },
  s0465: {
    literal: 'The realm enjoyed great feasting for seven days.',
    idiomatic: 'Seven days of public feasting followed.',
  },
  s0466: {
    literal:
      'Palace Attendant Yuan Qianyao was made Left Director of the Department of State Affairs and still Palace Attendant; Director of the Secretariat Zhang Yue was made Right Director and still Director of the Secretariat.',
    idiomatic:
      'Yuan Qianyao became Left Director while keeping his palace post; Zhang Yue became Right Director and kept the Secretariat.',
  },
  s0467: {
    literal: 'On jiawu, they set out from Dai.',
    idiomatic: 'On jiawu the procession left Dai.',
  },
  s0468: {
    literal: 'On bingshen, he visited Confucius’ house and personally set out the offering.',
    idiomatic: 'On bingshen he entered Confucius’ dwelling and sacrificed with his own hands.',
  },
  s0469: {
    literal: 'In the twelfth month, on jisi, they reached the eastern capital.',
    idiomatic: 'In the twelfth month the tour returned to Luoyang.',
  },
  s0470: {
    literal:
      'For years harvests had been rich; in the eastern capital rice was ten cash the peck, in Qing and Qi five.',
    idiomatic:
      'Grain was cheap after years of plenty—ten cash a peck in Luoyang, five in the east.',
  },
  s0471: {
    literal:
      'That winter the Personnel ministry was divided into ten selection boards; Ministers of Rites Su Ting, of Justice Wei Kang, and of Works Hu Congyuan and others were ordered each to take a share of appointments.',
    idiomatic:
      'That winter appointments were split among ten boards headed by Su Ting, Wei Kang, Hu Congyuan, and other ministers.',
  },
  s0472: {
    literal:
      'In the first year of Kaiyuan 14, in spring, the first month, on guihai, the Khitan Prince of Songmo Li Zhaogu was changed to Prince of Broad Transformation, the Xi Prince of Raole Li Lusu to Prince of Upholding Sincerity; two daughters of the imperial clan by marriage were made princesses and given to them in marriage.',
    idiomatic:
      'Early in Kaiyuan 14 the Khitan and Xi kings were re-titled and given imperial brides.',
  },
  s0473: {
    literal:
      'On gengxu the new moon, the Liao chieftains Liang Dahai and Zhou Guang seized Bin and Heng and rebelled; General of Agile Cavalry and Palace Attendant Yang Sixu was sent against them.',
    idiomatic:
      'At month’s start Liao rebels seized Bin and Heng; Yang Sixu marched south.',
  },
  s0474: {
    literal: 'In the third month, on renyin, the emperor’s niece the Eastern Splendor Princess was married to the Khitan Li Zhaogu.',
    idiomatic: 'In the third month the Eastern Splendor Princess was sent to Li Zhaogu of the Khitan.',
  },
  s0475: {
    literal:
      'In summer, the fourth month, on guichou, Assistant Censor-in-Chief Yuwen Rong and Censor-in-Chief Cui Yinpu impeached Right Director and Director of the Secretariat Zhang Yue; he was tried at the Department of State Affairs.',
    idiomatic:
      'In the fourth month Yuwen Rong and Cui Yinpu impeached Zhang Yue; the Secretariat chief stood trial.',
  },
  s0476: {
    literal: 'On dingsi, Vice Minister of Revenue Li Yuanhong was made co-signer of Secretariat-Chancellery documents.',
    idiomatic: 'On dingsi Li Yuanhong joined the inner council.',
  },
  s0477: {
    literal: 'On gengshen, Zhang Yue ceased serving as Director of the Secretariat.',
    idiomatic: 'On gengshen Zhang Yue was stripped of the Secretariat.',
  },
  s0478: {
    literal: 'On dingmao, the Prince of Qi, Junior Tutor of the Heir, died; he was posthumously titled Crown Prince Hui Wen.',
    idiomatic: 'On dingmao the Prince of Qi died and was mourned as Crown Prince Hui Wen.',
  },
  s0479: {
    literal:
      'On xinchou, military commands were established in Ding, Heng, Mo, Yi, and Cang to guard against the Turks.',
    idiomatic:
      'On xinchou five Hebei prefectures were garrisoned against the Turks.',
  },
  s0480: {
    literal:
      'On guimao the Household ministry presented the census: registered households 7,069,565; registered persons 41,419,712.',
    idiomatic:
      'On guimao the census reported more than seven million households and forty-one million souls.',
  },
  s0481: {
    literal:
      'On wuwu a great wind uprooted trees and tore off roofs; the owl finials of the Endless Gate and half the finials on city gates and temples fell.',
    idiomatic:
      'On wuwu a gale uprooted trees, stripped roofs, and knocked half the palace and city finials to earth.',
  },
  s0482: {
    literal:
      'Because of drought and violent storms, the emperor ordered inner and outer officials to submit sealed memorials frankly stating gains and losses in current policy, concealing nothing.',
    idiomatic:
      'Drought and storms moved him to demand sealed memorials on policy without fear or flattery.',
  },
  s0483: {
    literal:
      'On the night of guichou in the seventh month, the Chan River surged into the canal and sank several hundred grain barges from the circuits; many drowned.',
    idiomatic:
      'One night in the seventh month the Chan burst into the canal and drowned hundreds of tax barges.',
  },
  s0484: {
    literal:
      'On jichou, Acting Vice Director of the Yellow Gate and Acting Vice Protector-General of the Western Regions Du Xian was made co-signer of Secretariat-Chancellery documents.',
    idiomatic:
      'On jichou Du Xian of the Western Regions joined the inner council.',
  },
  s0485: {
    literal:
      'That autumn, fifteen circuits reported drought and frost; fifty reported flood; Henan and Hebei suffered worst; in Su, Tong, Chang, and Fu prefectures houses were washed away—Assistant Censor-in-Chief Yuwen Rong was sent to inspect and grant relief.',
    idiomatic:
      'Autumn brought drought, frost, and floods across the north; Yuwen Rong went out to survey and feed the ruined.',
  },
  s0486: {
    literal: 'In the tenth month of winter, Lin Prefecture was abolished.',
    idiomatic: 'In the tenth month Lin prefecture was abolished.',
  },
  s0487: {
    literal: 'On gengshen, he visited the Broad Completion baths at Ruzhou.',
    idiomatic: 'On gengshen he went to the Broad Completion hot springs.',
  },
  s0488: {
    literal: 'On jisi, he returned to the eastern capital.',
    idiomatic: 'On jisi he returned to Luoyang.',
  },
  s0489: {
    literal: 'In the eleventh month, on jiaxu, the Turks sent envoys to court.',
    idiomatic: 'In the eleventh month Turkish envoys arrived.',
  },
  s0490: {
    literal:
      'On xinchou, the Mohe of Bohai sent the heir’s son Yixin to court with tribute of local products.',
    idiomatic:
      'On xinchou Bohai’s heir sent his son Yixin with tribute.',
  },
  s0491: {
    literal: 'In the twelfth month, on dingsi, he visited the Square Excellence River in Shou’an.',
    idiomatic: 'In the twelfth month he hunted at Square Excellence River in Shou’an.',
  },
  s0492: {
    literal: 'On jiwei, the sun’s color was red as ochre.',
    idiomatic: 'On jiwei the sun burned ochre-red.',
  },
  s0493: {
    literal: 'On renxu, he returned to the eastern capital.',
    idiomatic: 'On renxu he came back to Luoyang.',
  },
  s0494: {
    literal:
      'In the first year of Kaiyuan 15, in spring, the first month, on wuyin, an edict invited men of talent, civil or martial, from common life to present themselves at court.',
    idiomatic:
      'Early in Kaiyuan 15 an edict called hidden worthies of every kind to court.',
  },
  s0495: {
    literal:
      'On gengzi, the Astrological Directorate was again made the Astrological Bureau, subordinate to the Secretariat as before.',
    idiomatic:
      'On gengzi the Astrological Directorate again became a bureau under the Secretariat.',
  },
  s0496: {
    literal:
      'On xinchou, Protector-General of Liangzhou Wang Junchuo defeated the Tibetans west of Qinghai and returned with wagons, horses, and sheep.',
    idiomatic:
      'On xinchou Wang Junchuo routed Tibetans west of Qinghai and drove home their herds.',
  },
  s0497: {
    literal:
      'In the second month, Left Gate General Li Jingren was sent to Hebei to relieve the poor; cattle pestilence was severe in Hebei.',
    idiomatic:
      'In the second month Li Jingren carried grain to plague-stricken Hebei.',
  },
  s0498: {
    literal:
      'On jisi, Right Director Zhang Yue, Censor-in-Chief Cui Yinpu, and Assistant Censor-in-Chief Yuwen Rong were judged to have formed factions against one another; Zhang Yue was ordered to retire, Cui Yinpu dismissed to serve his mother, and Yuwen Rong demoted to Weizhou governor.',
    idiomatic:
      'On jisi faction fighting toppled Zhang Yue into retirement, sent Cui Yinpu home to his mother, and banished Yuwen Rong to Wei.',
  },
  s0499: {
    literal: 'In summer, the fifth month, Jin Prefecture suffered great flood, washing away dwellings.',
    idiomatic: 'In the fifth month Jin was flooded and houses swept away.',
  },
  s0500: {
    literal:
      'On guiyou, Prince of Qing Tan was made Liangzhou governor and commander of Hexi armies; Prince of Zhong Jun was made Protector-General of the Shanyu and Shuofang commissioner; Prince of Di Qia was made Taiyuan and Jibei herdsman and Hebei army commissioner; Prince of E Juan was Youzhou governor and Hebei commissioner; Prince of Rong Huang was Metropolitan Governor of Jingzhao and Longyou commissioner; Prince of Guang Ti was Guangzhou governor and commissioner of the Five Offices; Prince of Yi Wei was Henan herdsman; Prince of Ying Tan was Protector-General of Andong and Pinglu commissioner; Prince of Yong Ze was Governor-General of Jingzhou; Prince of Shou Qing was Governor-General of Yizhou and Sword South commissioner; Prince of Yan Hui was Protector-General of Anxi and Western Regions commissioner; Prince of Sheng Mu was Governor-General of Yangzhou—all without leaving the palace.',
    idiomatic:
      'On guiyou each prince received a titular frontier command—Qing, Zhong, Di, E, Rong, Guang, Yi, Ying, Yong, Shou, Yan, and Sheng—yet none left the palace.',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/008.json';
const TRANS_PATH = 'translations/current_translation_jiutangshu.json';
const START = 401;
const END = 500;

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

  out.sort(
    (a, b) => parseInt(a.originalId.slice(1), 10) - parseInt(b.originalId.slice(1), 10)
  );
  return out;
}

const chapterPath = CHAPTER_PATH;
let trans = JSON.parse(readFileSync(TRANS_PATH, 'utf8'));
if (trans.metadata.chapter !== '008') {
  throw new Error(`Expected chapter 008, got ${trans.metadata.chapter}`);
}

const expectedIds = new Set(
  Array.from({ length: END - START + 1 }, (_, i) => `s${String(START + i).padStart(4, '0')}`)
);

for (const id of expectedIds) {
  if (!T[id]) throw new Error(`Missing translation for ${id}`);
}

const byOriginal = new Map(trans.sentences.map((s) => [s.originalId || s.id, s]));

for (const id of expectedIds) {
  if (!byOriginal.has(id)) {
    const extracted = extractRange(chapterPath, START, END).find((s) => s.originalId === id);
    if (!extracted) throw new Error(`Missing ${id} in ${chapterPath}`);
    trans.sentences.push(extracted);
    byOriginal.set(id, extracted);
  }
}

trans.sentences.sort(
  (a, b) =>
    parseInt((a.originalId || a.id).slice(1), 10) -
    parseInt((b.originalId || b.id).slice(1), 10)
);

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

const missing = [...expectedIds].filter((id) => {
  const row = trans.sentences.find((s) => (s.originalId || s.id) === id);
  return !row || !row.idiomatic;
});
if (missing.length) {
  throw new Error(`Missing translations for: ${missing.join(', ')}`);
}
if (applied !== Object.keys(T).length) {
  throw new Error(`Applied ${applied}, expected ${Object.keys(T).length}`);
}

writeFileSync(TRANS_PATH, JSON.stringify(trans, null, 2) + '\n');
console.log(`Applied ${applied} translations (s0401–s0500)`);
