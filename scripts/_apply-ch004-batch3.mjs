#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0201: {
    literal:
      'The Ministry of Revenue minister was renamed Minister of Disbursements, and the vice minister likewise.',
    idiomatic:
      'The post of Minister of Revenue was retitled Minister of Disbursements, and the vice minister likewise.',
  },
  s0202: {
    literal:
      'In the eighth month, on bingshen, Palace Preceptor Cui Dunli died.',
    idiomatic:
      'In the eighth month, on bingshen, Cui Dunli, preceptor to the heir, died.',
  },
  s0203: {
    literal:
      'Left Guard General Cheng Zhijie fought at Yumugu Valley with the Qarluqs, Geluo, Zhifa, Yuezhi, and Yuzhi shihou under Qulluğ\'s command, routed them greatly, beheaded more than a thousand, and captured camels, horses, cattle, and sheep by the ten thousands.',
    idiomatic:
      'At Yumugu Valley, Left Guard General Cheng Zhijie crushed Qulluğ\'s Qarluq, Geluo, Zhifa, Yuezhi, and Yuzhi forces, taking more than a thousand heads and tens of thousands of camels, horses, cattle, and sheep.',
  },
  s0204: {
    literal:
      'In the ninth month, on guiyou, an initial edict ordered prefectures with thirty thousand households and above to be upper grade, and twenty thousand and above to be middle grade;',
    idiomatic:
      'In the ninth month, on guiyou, the court first ranked prefectures with thirty thousand households or more as upper grade and those with twenty thousand or more as middle grade;',
  },
  s0205: {
    literal:
      'those previously upper or middle prefectures each followed the old [rank].',
    idiomatic:
      'prefectures already so ranked kept their standing.',
  },
  s0206: {
    literal: 'The Empress composed "Admonitions for Empress Kin."',
    idiomatic: 'The Empress composed Admonitions for Imperial Kin.',
  },
  s0207: {
    literal:
      'On gengchen, Kuozhou seawater overflowed broadly, destroying An\'gu and Yongjia two counties, damaging more than four thousand households.',
    idiomatic:
      'On gengchen a tidal surge at Kuozhou wrecked An\'gu and Yongjia counties and harmed more than four thousand households.',
  },
  s0208: {
    literal:
      'On xinsi, it was first decreed that area supervisors and upper prefectures each establish fifteen saber-bearers, middle and lower prefectures ten persons.',
    idiomatic:
      'On xinsi the court first ordered area supervisors and upper prefectures to post fifteen saber guards each, and middle and lower prefectures ten apiece.',
  },
  s0209: {
    literal:
      'On guiwei, the post of Flying Cavalry Grand General was first established, rank being second-first grade.',
    idiomatic:
      'On guiwei the court created the post of Flying Cavalry Grand General at the second rank of the first grade.',
  },
  s0210: {
    literal:
      'Cheng Zhijie fought Qulluğ\'s son Zhayun, beheaded several thousand, advanced to Tudu City, and captured his tribal households and goods in great accumulation.',
    idiomatic:
      'Cheng Zhijie fought Qulluğ\'s son Zhayun, took several thousand heads, advanced to Tudu City, and seized vast herds of captives and booty.',
  },
  s0211: {
    literal:
      'In the eleventh winter month, on yichou, the imperial prince Xian was born; an edict ordered capital officials and court-gathering commissioners each to receive added merit ranks.',
    idiomatic:
      'In the eleventh month, on yichou, Prince Xian was born; capital officials and assembly commissioners received an additional merit rank each.',
  },
  s0212: {
    literal: 'In the twelfth month, on yiyou, the Mathematics School was established.',
    idiomatic: 'In the twelfth month, on yiyou, the court established a school of mathematics.',
  },
  s0213: {
    literal:
      'Left Army Guard General Cheng Zhijie, on account of campaigning against Qulluğ with delay and pursuing the bandits without catching them, had death reduced and was dismissed from office.',
    idiomatic:
      'Cheng Zhijie, general of the Left Army Guards, was sentenced to death commuted for delaying pursuit of Qulluğ and was stripped of his post.',
  },
  s0214: {
    literal: 'The Lanzhou area supervisor was abolished.',
    idiomatic: 'The Lanzhou military governorship was abolished.',
  },
  s0215: {
    literal: 'Shanzhou established an area supervisor.',
    idiomatic: 'A military governor was installed at Shanzhou.',
  },
  s0216: {
    literal:
      'In the second year of Xianqing, spring first month, on gengyin, he visited Luoyang.',
    idiomatic:
      'In the second year of Xianqing, on gengyin of the first spring month, the Emperor went to Luoyang.',
  },
  s0217: {
    literal:
      'He ordered Right Army Guard General Su Dingfang and four other generals to be Yili Circuit generals, leading armies to attack Qulluğ.',
    idiomatic:
      'He appointed Su Dingfang of the Right Army Guards and three other generals commanders of the Yili campaign to march against Qulluğ.',
  },
  s0218: {
    literal:
      'In the second month, on xinyou, he entered Luoyang Palace; partial pardon for Luozhou.',
    idiomatic:
      'On xinyou of the second month he entered the Luoyang palace and granted Luozhou a partial amnesty.',
  },
  s0219: {
    literal:
      'On gengwu, the seventh imperial son Xian was enfeoffed as Prince of Zhou; transferred enfeoffment of Prince of Xu Su Jie to Prince of Xun.',
    idiomatic:
      'On gengwu the seventh prince, Xian, was created Prince of Zhou, and Prince Su Jie of Xu was retitled Prince of Xun.',
  },
  s0220: {
    literal:
      'In the third month, on jiazi, Vice Director of Secretariat Li Yifu became Secretariat Director concurrent with investigating censor-in-chief; Vice Director of Yellow Gate Du Zhenglun concurrent Disbursements Minister, as before third-grade co-equal with Secretariat and Chancellery.',
    idiomatic:
      'On jiazi of the third month Li Yifu became Secretariat director and acting censor-in-chief, and Du Zhenglun became vice director with concurrent charge of disbursements, both remaining chief ministers of the third grade.',
  },
  s0221: {
    literal: 'In the fifth summer month, on bingshen, he visited Mingde Palace.',
    idiomatic: 'In the fifth month, on bingshen, he went to Mingde Palace.',
  },
  s0222: {
    literal: 'In the seventh autumn month, on dinghai, he returned to Luoyang Palace.',
    idiomatic: 'In the seventh month, on dinghai, he returned to the Luoyang palace.',
  },
  s0223: {
    literal:
      'In the eighth month, on dingmao, Palace Attendant, Duke of Yingchuan Han Yuan was demoted left to prefect of Zhen; Secretariat Director concurrent Crown Prince Household Superintendent, Marquis of Nanyang Lai Ji demoted left to prefect of Tai — all on account of remonstrating to install Lady Wu as empress, rescuing Chu Suiliang\'s demotion.',
    idiomatic:
      'On dingmao of the eighth month Han Yuan, Duke of Yingchuan and palace attendant, was demoted to prefect of Zhen, and Lai Ji, Marquis of Nanyang and director of the Secretariat, to prefect of Tai — both for opposing Empress Wu\'s elevation and defending the exiled Chu Suiliang.',
  },
  s0224: {
    literal:
      'Minister of Rites, Duke of Gaoyang Xu Jingzong became Palace Attendant, on account of merit in establishing Empress Wu.',
    idiomatic:
      'Xu Jingzong, Duke of Gaoyang and minister of rites, became palace attendant for his role in making Wu empress.',
  },
  s0225: {
    literal:
      'In the ninth month, on gengyin, Disbursements Minister Du Zhenglun became Secretariat Director.',
    idiomatic:
      'In the ninth month, on gengyin, Du Zhenglun was appointed director of the Secretariat.',
  },
  s0226: {
    literal:
      'In the tenth winter month, on wuxu, he personally lectured on warfare at the borders of Xu and Zheng; partial pardon for Zheng Prefecture.',
    idiomatic:
      'In the tenth month, on wuxu, he personally reviewed troops between Xu and Zheng and granted Zhengzhou a partial amnesty.',
  },
  s0227: {
    literal:
      'He sent envoys to sacrifice at the tomb of Zheng grandee Guo Qiao and Han grand warden of Taiqiu Chen Shi.',
    idiomatic:
      'He sent envoys to offer sacrifice at the tombs of Guo Qiao of Zheng and Chen Shi, grand warden of Taiqiu.',
  },
  s0228: {
    literal: 'In the twelfth month, on yimao, he returned to Luoyang Palace.',
    idiomatic: 'In the twelfth month, on yimao, he returned to the Luoyang palace.',
  },
  s0229: {
    literal: 'On gengwu, the characters "hao" and "ye" were altered.',
    idiomatic:
      'On gengwu the court changed the characters hao and ye in certain names and titles.',
  },
  s0230: {
    literal:
      'On dingmao, by imperial autograph edict Luoyang Palace was changed to Eastern Capital; Luozhou officials\' ranks and grades all followed Yongzhou.',
    idiomatic:
      'On dingmao an autograph edict renamed the Luoyang palace the Eastern Capital and aligned Luozhou official ranks with those of Yongzhou.',
  },
  s0231: {
    literal:
      'Gu Prefecture was abolished; with Fuchang and other four counties, together with Huai Prefecture\'s Heyang, Jiyuan, Wen, Zheng Prefecture\'s Yishui, all were attached to Luozhou.',
    idiomatic:
      'Gu Prefecture was abolished; Fuchang and three other counties, together with Heyang, Jiyuan, and Wen from Huai and Yishui from Zheng, were all placed under Luozhou.',
  },
  s0232: {
    literal:
      'On jisi, the Secretariat established two recorders-of-imperial-residence, rank equal to recorders-of-the-palace.',
    idiomatic:
      'On jisi the Secretariat added two court diarists of equal rank to the palace diarists.',
  },
  s0233: {
    literal: 'On gengwu, Prince of Zhou Xian was made Luozhou governor.',
    idiomatic: 'On gengwu Prince Xian of Zhou was appointed governor of Luozhou.',
  },
  s0234: {
    literal:
      'On renwu, the scattered cavalry attendant-at-court was divided into left and right, two persons each; the right scattered cavalry attendant-at-court was subordinated to the Secretariat.',
    idiomatic:
      'On renwu the post of attendant cavalier was split into left and right, two each; the right attendants were attached to the Secretariat.',
  },
  s0235: {
    literal:
      'In the third year of Xianqing, spring first month, on wuzi, Grand Mentor, Duke of Zhao Wuji and others completed revision of New Rites, altogether one hundred thirty scrolls, two hundred fifty-nine sections; edict promulgated throughout the realm.',
    idiomatic:
      'In the third year of Xianqing, on wuzi of the first spring month, Zhangsun Wuji, Duke of Zhao and grand mentor, completed the New Rites in one hundred thirty scrolls and two hundred fifty-nine sections; the court ordered them promulgated empire-wide.',
  },
  s0236: {
    literal: 'In the second month, on dingsi, the imperial carriage returned to the capital.',
    idiomatic: 'On dingsi of the second month the Emperor returned to Chang\'an.',
  },
  s0237: {
    literal:
      'On renwu, he personally recorded prisoners; many were pardoned and forgiven.',
    idiomatic: 'On renwu he personally reviewed prisoners and pardoned many.',
  },
  s0238: {
    literal:
      'Su Dingfang broke the Western Turkic Shaboluo Khagan Qulluğ and Zhayun, Quechuo.',
    idiomatic:
      'Su Dingfang defeated the Western Turk khagan Qulluğ and his sons Zhayun and Quechuo.',
  },
  s0239: {
    literal:
      'Qulluğ fled to Shiguo; deputy general Xiao Siye pursued and captured him, gathering his people and livestock before and after more than four hundred thousand.',
    idiomatic:
      'Qulluğ fled to the state of Stone; deputy commander Xiao Siye ran him down and took more than four hundred thousand people and animals in all.',
  },
  s0240: {
    literal:
      'On jiayin, the Western Regions were pacified; on their lands Mengchi and Kunling two protectorate offices were established.',
    idiomatic:
      'On jiayin the Western Regions were pacified and the court created the Mengchi and Kunling protectorates on their lands.',
  },
  s0241: {
    literal:
      'At Kucha state Anxi Protectorate was restored; on Gaochang\'s former territory Western Prefecture was established.',
    idiomatic:
      'The Anxi Protectorate was restored at Kucha and Western Prefecture created on the old lands of Gaochang.',
  },
  s0242: {
    literal:
      'Pacifying-attachment Grand General of orthodox third grade, Submitting-to-transformation General of subordinate third grade were established, to invest newly submitted chieftains, still divided to be subordinated to the guards.',
    idiomatic:
      'The court created the Pacification-general at the third rank and the Submission-general at the lower third rank for newly submitted tribal leaders, who were then assigned to the guard regiments.',
  },
  s0243: {
    literal: 'In the sixth month, Cheng Mingzhen attacked Goguryeo.',
    idiomatic: 'In the sixth month Cheng Mingzhen marched against Goguryeo.',
  },
  s0244: {
    literal:
      'In the ninth month, the schools of writing, mathematics, and law were abolished.',
    idiomatic:
      'In the ninth month the court abolished the schools of letters, mathematics, and law.',
  },
  s0245: {
    literal:
      'The relevant offices memorialized requesting to build seven hundred cart barriers, planning for imperial progress to carry barrier-walls;',
    idiomatic:
      'The ministry asked to build seven hundred barrier carts to carry a mobile stockade on tour;',
  },
  s0246: {
    literal:
      'the Emperor considered it laborious to the people, and thus at the old halt established courtyard walls instead.',
    idiomatic:
      'the Emperor deemed it a burden on the people and had stockade walls built at the old encampment instead.',
  },
  s0247: {
    literal:
      'In the eleventh winter month, on yiyou, concurrent Secretariat Director, Crown Prince Guest concurrent investigating censor-in-chief, Duke of Hejian Li Yifu demoted left to prefect of Pu; concurrent Secretariat Director, Crown Prince Guest, Duke of Xiangyang Du Zhenglun demoted left to prefect of Heng.',
    idiomatic:
      'In the eleventh month, on yiyou, Li Yifu, Duke of Hejian and acting director of the Secretariat, was demoted to prefect of Pu, and Du Zhenglun, Duke of Xiangyang and concurrent director, to prefect of Heng.',
  },
  s0248: {
    literal:
      'Vice Director of Secretariat Li Youyi was struck from the rolls, assigned exile to Xizhou.',
    idiomatic:
      'Secretariat vice director Li Youyi was struck from the registers and exiled to Xizhou.',
  },
  s0249: {
    literal:
      'On wuxu, Palace Attendant Xu Jingzong was provisional investigating Secretariat Director.',
    idiomatic:
      'On wuxu palace attendant Xu Jingzong was named acting director of the Secretariat.',
  },
  s0250: {
    literal:
      'On wuzi, Palace Attendant, Crown Prince Guest, provisional investigating Secretariat Director, Duke of Gaoyang Xu Jingzong became Secretariat Director, guest-of-crown-prince and below as before;',
    idiomatic:
      'On wuzi Xu Jingzong, Duke of Gaoyang, became director of the Secretariat while keeping his post as crown-prince guest;',
  },
  s0251: {
    literal: 'Court of Review director Xin Maojiang became Palace Attendant.',
    idiomatic:
      'Xin Maojiang, chief of the Court of Judicial Review, became palace attendant.',
  },
  s0252: {
    literal:
      'Court of State Ceremonial director Xiao Siye took Qulluğ from Shiguo and presented him at Zhaoling.',
    idiomatic:
      'Chief of ceremonies Xiao Siye brought Qulluğ from the Stone Kingdom and presented the captive at Taizong\'s tomb.',
  },
  s0253: {
    literal:
      'On jiachen, Pillar of State, Equal in Honor to the Three Excellencies, Duke of E State Yuchi Jingde died.',
    idiomatic: 'On jiachen Yuchi Jingde, Duke of E and pillar of state, died.',
  },
  s0254: {
    literal:
      'In the fourth year of Xianqing, spring second month, on yihai, the Emperor personally examined candidates by policy questions; altogether nine hundred persons, only Guo Daifeng, Zhang Jiuling and five others placed in upper grade, ordered to await imperial edict at Hongwen Academy, following the guard in attendance.',
    idiomatic:
      'In the fourth year of Xianqing, on yihai of the second spring month, the Emperor personally examined nine hundred candidates; only Guo Daifeng, Zhang Jiuling, and four others won top honors and were ordered to await appointment at the Hongwen Academy with the imperial guard.',
  },
  s0255: {
    literal:
      'In the third month, Left Martial Steeds Guard General, Duke of Bin State Qibi Heli was sent to Liaodong to oversee strategy.',
    idiomatic:
      'In the third month Qibi Heli, Duke of Bin and general of the Left Martial Steeds Guards, was sent to oversee Liaodong.',
  },
  s0256: {
    literal:
      'In the fourth summer month, on jiwei, Crown Prince Grand Tutor, Left Vice Director of Masters of Writing, Duke of Yan State Yu Zhining became Crown Prince Grand Preceptor, still third-grade co-equal with Secretariat and Chancellery.',
    idiomatic:
      'In the fourth month, on jiwei, Yu Zhining, Duke of Yan and left vice director of the Masters of Writing, became grand preceptor to the heir while retaining his seat among the chief ministers.',
  },
  s0257: {
    literal:
      'On yichou, Vice Director of Yellow Gate Xu Yuanshi became third-grade co-equal with Secretariat and Chancellery.',
    idiomatic:
      'On yichou Xu Yuanshi, vice director of the Chancellery, joined the chief ministers of the third grade.',
  },
  s0258: {
    literal:
      'On bingxu, Crown Prince Grand Preceptor, third-grade co-equal with Secretariat and Chancellery, Duke of Yan State Yu Zhining was dismissed from office, released to return to private residence.',
    idiomatic:
      'On bingxu Yu Zhining, Duke of Yan and grand preceptor to the heir, was dismissed and sent home.',
  },
  s0259: {
    literal:
      'On wuxu, Grand Mentor, Yangzhou area supervisor, Duke of Zhao Wuji bore Yangzhou area supervisor title while settled at Qian Prefecture, as before supplied according to first grade.',
    idiomatic:
      'On wuxu Zhangsun Wuji, Duke of Zhao and grand mentor, was banished to Qian Prefecture while retaining his nominal rank as Yangzhou governor and his first-grade stipend.',
  },
  s0260: {
    literal:
      'In the fifth month, on bingshen, Minister of War Ren Yaxiang, Disbursements Minister Lu Chengqing both participated in knowing governance affairs.',
    idiomatic:
      'In the fifth month, on bingshen, Ren Yaxiang, minister of war, and Lu Chengqing, minister of disbursements, joined the deliberative council.',
  },
  s0261: {
    literal:
      'In the seventh autumn month, on renzi, Pu Prefecture prefect Li Yifu became Minister of Personnel, third-grade co-equal with Secretariat and Chancellery.',
    idiomatic:
      'In the seventh month, on renzi, Li Yifu was recalled from Pu to become minister of personnel and chief minister of the third grade.',
  },
  s0262: {
    literal:
      'In the tenth winter month, on yisi, the crown prince received capping ceremony; great pardon throughout the realm; civil and military fifth grade and above whose sons and grandsons were heirs to fathers and grandfathers added one merit officer grade; great communal feasting three days.',
    idiomatic:
      'In the tenth month, on yisi, the crown prince came of age; the court proclaimed a general amnesty, granted an extra merit rank to fifth-grade officials and above who stood as heirs to their fathers or grandfathers, and ordered three days of public feasting.',
  },
  s0263: {
    literal:
      'In the intercalary tenth month, on wuyin, he visited Eastern Capital; crown prince supervised the realm.',
    idiomatic:
      'On wuyin of the intercalary tenth month he went to the Eastern Capital and left the heir to govern.',
  },
  s0264: {
    literal: 'On wuxu, he arrived at Eastern Capital.',
    idiomatic: 'On wuxu he reached the Eastern Capital.',
  },
  s0265: {
    literal:
      'In the eleventh month, Vice Director of Secretariat Xu Yuanshi became scattered cavalry attendant-at-court, investigating palace attendant.',
    idiomatic:
      'In the eleventh month Xu Yuanshi was made attendant cavalier and acting palace attendant.',
  },
  s0266: {
    literal: 'On wuwu, concurrent Palace Attendant Xin Maojiang died.',
    idiomatic: 'On wuwu Xin Maojiang, concurrent palace attendant, died.',
  },
  s0267: {
    literal:
      'On guihai, Duke of Xing State Su Dingfang was made Shenqiu Circuit commander-in-chief, Liu Boying made Kunyi Circuit commander-in-chief.',
    idiomatic:
      'On guihai Su Dingfang, Duke of Xing, was made commander of the Shenqiu expedition and Liu Boying commander of the Kunyi route.',
  },
  s0268: {
    literal:
      'In the fifth year of Xianqing, spring first month, on jiazi, he visited Bing Prefecture.',
    idiomatic:
      'In the fifth year of Xianqing, on jiazi of the first spring month, the Emperor went to Bingzhou.',
  },
  s0269: {
    literal: 'In the second month, on xinsi, he arrived at Bing Prefecture.',
    idiomatic: 'On xinsi of the second month he arrived at Bingzhou.',
  },
  s0270: {
    literal:
      'On bingxu, he feasted attending officials and various kin, Bing Prefecture officials and elders, bestowing silk in varying measure.',
    idiomatic:
      'On bingxu he feasted his entourage, kinsmen, and Bingzhou officials and elders, granting cloth and silk by rank.',
  },
  s0271: {
    literal:
      'Partial pardon for Bing Prefecture and all prefectures under its administration.',
    idiomatic: 'Bingzhou and its circuit received a partial amnesty.',
  },
  s0272: {
    literal:
      'At the banner-raising beginning, officials of fifth grade and above who had died with graves in Bing Prefecture — ordered the relevant offices to perform sacrifice.',
    idiomatic:
      'The court ordered sacrifice for every fifth-rank founding official buried in Bingzhou.',
  },
  s0273: {
    literal:
      'Assist-the-mandate meritorious officials\' descendants and great-general household staff and below now living — bestowed rank grades in varying measure, disposition according to talent.',
    idiomatic:
      'Living descendants of founding ministers and staff of the great-general households received graded promotions according to ability.',
  },
  s0274: {
    literal:
      'Uprising followers, officials from first grade down — bestowed goods in varying measure.',
    idiomatic:
      'Participants in the founding uprising below the first rank received graded gifts.',
  },
  s0275: {
    literal:
      'Age eighty and above — patent appointment as prefect or magistrate.',
    idiomatic:
      'Men and women eighty or older were granted nominal posts as prefect or magistrate.',
  },
  s0276: {
    literal:
      'Assist-the-mandate meritorious officials who had eaten separate enfeoffments but body already died — for their descendant sons each added two grades.',
    idiomatic:
      'For deceased founding ministers who had held separate fiefs, each surviving heir received two extra ranks.',
  },
  s0277: {
    literal: 'Communal feasting bestowed three days.',
    idiomatic: 'The court granted three days of public feasting.',
  },
  s0278: {
    literal:
      'On jiawu, he sacrificed at the old residence; with Wu Shihuo, Yin Kaishan, Liu Zhenghui at accompanying sacrifice.',
    idiomatic:
      'On jiawu he sacrificed at the old Taiyuan mansion, with Wu Shihuo, Yin Kaishan, and Liu Zhenghui as spirit associates.',
  },
  s0279: {
    literal:
      'In the third month, on bingwu, the Empress feasted kin, neighborhood and old friends at court hall, ordered ladies of merit and women to enter meeting at inner hall, and various imperial kin bestowed silk each differing, and civil-military fifth grade and above who followed on the journey.',
    idiomatic:
      'On bingwu of the third month the Empress feasted kin, neighbors, and old friends in the audience hall, summoned titled ladies and women to an inner gathering, and granted graded gifts of silk to the imperial clan, attendants of fifth rank and above, and the traveling court.',
  },
  s0280: {
    literal:
      'By decree, because of the Empress\'s hometown, Bing Prefecture chief administrator and vice administrator each received added merit rank.',
    idiomatic:
      'An edict promoted the chief and vice administrators of Bingzhou one merit rank each in honor of the Empress\'s birthplace.',
  },
  s0281: {
    literal:
      'Also the Empress personally attended the meeting; each time bestowed goods one thousand bolts, close kin five hundred bolts, lesser mourning and below and kin without mourning, neighborhood and old friends — varying.',
    idiomatic:
      'Where the Empress attended in person she gave a thousand bolts of goods to each honoree, five hundred to close kin, and graded gifts to more distant kin, neighbors, and old friends.',
  },
  s0282: {
    literal:
      'Within the city and various women age eighty and above — each patent-appointed as district lady, still bestowed goods and the like.',
    idiomatic:
      'Every woman in the city eighty or older was titled district lady and given gifts besides.',
  },
  s0283: {
    literal:
      'On jiyou, warfare was lectured at west of Bing Prefecture city; the Emperor mounted Flying Tower, leading ministers to observe from afar.',
    idiomatic:
      'On jiyou he held a martial review west of Bingzhou; from the Flying Tower he led his ministers to watch.',
  },
  s0284: {
    literal: 'On xinhai, the Shenqiu Circuit army was dispatched to attack Baekje.',
    idiomatic: 'On xinhai the Shenqiu expedition marched against Baekje.',
  },
  s0285: {
    literal:
      'On dingsi, Left and Right Lead-Guard were changed to Left and Right Thousand-Ox.',
    idiomatic:
      'On dingsi the Left and Right Lead Guards were renamed the Left and Right Thousand-Ox Guards.',
  },
  s0286: {
    literal:
      'In the fourth summer month, on wuyin, the imperial carriage returned to Eastern Capital; built Eight-Pass Palace in Eastern Capital park interior.',
    idiomatic:
      'In the fourth month, on wuyin, he returned to the Eastern Capital and built the Eight-Pass Palace in the eastern park.',
  },
  s0287: {
    literal: 'On guihai, he arrived from Bing Prefecture.',
    idiomatic: 'On guihai he came back from Bingzhou.',
  },
  s0288: {
    literal:
      'In the fifth month, on renxu, he visited Eight-Pass Palace, changed to United-Halves Palace.',
    idiomatic:
      'In the fifth month, on renxu, he went to the Eight-Pass Palace and renamed it the United-Halves Palace.',
  },
  s0289: {
    literal:
      'In the sixth month, on the gengwu new moon, the sun had an eclipse.',
    idiomatic: 'On the gengwu new moon of the sixth month the sun was eclipsed.',
  },
  s0290: {
    literal:
      'On xinmao, an edict ordered civil and military fifth grade and above to present candidates in four categories.',
    idiomatic:
      'On xinmao an edict called on fifth-rank civil and military officials to nominate men in four examination categories.',
  },
  s0291: {
    literal: 'On jiawu, the carriage returned to Eastern Capital.',
    idiomatic: 'On jiawu the Emperor returned to the Eastern Capital.',
  },
  s0292: {
    literal:
      'In the seventh autumn month, on yisi, Prince of Liang Zhong was deposed to commoner, moved to Qian Prefecture.',
    idiomatic:
      'In the seventh month, on yisi, Prince Zhong of Liang was degraded to commoner and exiled to Qianzhou.',
  },
  s0293: {
    literal:
      'On wuchen, Disbursements Minister, third-grade co-equal with Secretariat and Chancellery Lu Chengqing was dismissed on account of crime.',
    idiomatic:
      'On wuchen Lu Chengqing, minister of disbursements and chief minister, was dismissed for his crimes.',
  },
  s0294: {
    literal:
      'In the eighth month, on gengchen, Su Dingfang and others campaigned to pacify Baekje, bound its king Buyeo Yici face-forward.',
    idiomatic:
      'In the eighth month, on gengchen, Su Dingfang pacified Baekje and brought King Buyeo Yici forward bound.',
  },
  s0295: {
    literal:
      'The state was divided into five departments, thirty-seven commanderies, two hundred cities, seven hundred sixty thousand households; on its territory were separately established Xiongjin and other five area-supervisor prefectures.',
    idiomatic:
      'The realm had five provinces, thirty-seven districts, two hundred towns, and seven hundred sixty thousand households; the court divided the land into five military governorships including Xiongjin.',
  },
  s0296: {
    literal:
      'Partial pardon for Shenqiu, Kunyi circuit commanders-in-chief and below; bestowed realm-wide great communal feasting three days.',
    idiomatic:
      'The Shenqiu and Kunyi commanders and their troops received a partial amnesty, and the empire was granted three days of public feasting.',
  },
  s0297: {
    literal:
      'In the ninth month, on wuwu, granted Duke of Ying State Ji one tomb mound site.',
    idiomatic:
      'In the ninth month, on wuwu, the court granted Li Ji, Duke of Ying, a tomb estate.',
  },
  s0298: {
    literal:
      'In the tenth winter month, on bingzi, Lady of Dai State the Yang clan was changed to Lady of Rong State, grade first, position above princes and dukes\' mothers and wives.',
    idiomatic:
      'In the tenth month, on bingzi, Lady Yang of Dai was retitled Lady of Glory at the first rank, ranking above the mothers and consorts of kings and dukes.',
  },
  s0299: {
    literal:
      'In the eleventh month, on the wuxu new moon, Duke of Xing State Su Dingfang presented Baekje king Buyeo Yici, crown prince Yong and others, fifty-eight persons as captives at Zetian Gate, reproached yet pardoned them.',
    idiomatic:
      'On the wuxu new moon of the eleventh month Su Dingfang presented fifty-eight Baekje captives, including King Buyeo Yici and Crown Prince Yong, at Zetian Gate; the Emperor rebuked them and then spared them.',
  },
  s0300: {
    literal: 'On yimao, he hunted at the borders of Xu and Zheng.',
    idiomatic: 'On yimao he hunted between Xu and Zheng.',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/004.json';
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
if (trans.metadata.chapter !== '004') {
  throw new Error(`Expected chapter 004, got ${trans.metadata.chapter}`);
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
      chapter: '004',
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
