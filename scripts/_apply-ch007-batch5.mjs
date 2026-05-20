#!/usr/bin/env node
/** Batch 5: s0401–s0500 (Jiutangshu ch.007, Ruizong — enthronement through Jingyun 3) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0401: {
    literal: 'That day he at once took the imperial throne, attended from Chengtian Gate tower, and proclaimed a great amnesty for all under Heaven; those not normally exempted in regular amnesties were all likewise pardoned.',
    idiomatic: 'That same day he took the throne, appeared on Chengtian Gate tower, and proclaimed a general amnesty; even crimes ordinary amnesties would not touch were forgiven.',
  },
  s0402: {
    literal: 'Inner and outer officials of fourth rank and above received one rank promotion; Xiangwang Mansion clerks received two.',
    idiomatic: 'Civil and military officers of fourth rank and above were promoted one step; staff of the Prince of Xiang’s household, two.',
  },
  s0403: {
    literal: 'Exiles on perpetual banishment or perpetual penal service not yet returned were all released to go home.',
    idiomatic: 'Those still abroad on lifelong exile or lifelong penal service were all sent home.',
  },
  s0404: {
    literal: 'More than a thousand men who had won merit, from Wang Chengye downward, were granted titles and ranks in varying degrees.',
    idiomatic: 'Over a thousand merit-holders from Wang Chengye down received enfeoffments and offices according to their deeds.',
  },
  s0405: {
    literal: 'The Young Emperor was enfeoffed as Prince of Wen.',
    idiomatic: 'The deposed emperor was made Prince of Wen.',
  },
  s0406: {
    literal: 'That day, auspicious clouds appeared.',
    idiomatic: 'That day the sky showed auspicious clouds.',
  },
  s0407: {
    literal: 'On yisi, Grand Counselor Zhong Shaojing was made Minister of Revenue and Duke of Yue, with a substantive fief of five hundred households;',
    idiomatic: 'On yisi Zhong Shaojing, Grand Counselor, became Minister of Revenue and Duke of Yue with five hundred household fiefs;',
  },
  s0408: {
    literal: 'Palace Draftsman Liu Youqiu was made Left Assistant Director of the Department of State Affairs and Duke of Xu, with a substantive fief of five hundred households: both continued as before in managing state affairs.',
    idiomatic: 'Palace Draftsman Liu Youqiu became Left Assistant Director and Duke of Xu with five hundred households: both men kept their roles in governance.',
  },
  s0409: {
    literal: 'General of the Left Guards, Prince of Song Chengqi, was made Grand Preceptor of the Heir Apparent, Governor of Yongzhou, and Grand Commander of Yangzhou, with an added substantive fief of two hundred households.',
    idiomatic: 'Chengqi, Prince of Song and General of the Left Guards, was named Grand Preceptor of the Heir Apparent, Yongzhou governor, and Yangzhou commander, with two hundred added fief households.',
  },
  s0410: {
    literal: 'Palace women who had lately taken commoners’ sons and daughters into the palace were sent back to their families.',
    idiomatic: 'Commoners’ children recently seized for the palace were returned home.',
  },
  s0411: {
    literal: 'On bingwu, the newly appointed Vice Minister of Rites Xue Ji was made Attendant of the Yellow Gate and joined in managing critical affairs.',
    idiomatic: 'On bingwu Xue Ji, fresh from Vice Minister of Rites, entered the Yellow Gate and the inner council.',
  },
  s0412: {
    literal: 'On dingwei, Xu Prefecture governor and Marquis of Liangxian Yao Yuanzhi was made Minister of War and Grand Counselor of the third rank; Minister of War Wei Sili was made Grand Counselor.',
    idiomatic: 'On dingwei Yao Yuanzhi of Xu became Minister of War and third-rank counselor; Wei Sili moved from that ministry to Grand Counselor.',
  },
  s0413: {
    literal: 'The titles and ranks of Wu Sansi and Wu Chongxun were posthumously stripped.',
    idiomatic: 'Wu Sansi and Wu Chongxun were posthumously disgraced and their ranks revoked.',
  },
  s0414: {
    literal: 'On wushen, Xiao Zhizhong, Wei Sili, Zhao Yanzhao, and Cui Shi were all removed from prefectural posts.',
    idiomatic: 'On wushen Xiao Zhizhong, Wei Sili, Zhao Yanzhao, and Cui Shi left their governorships.',
  },
  s0415: {
    literal: 'Prince of Hengyang Chengyi was enfeoffed as Prince of Shen; Prince of Baling Jiangfan as Prince of Qi; Prince of Pengcheng Longye as Prince of Xue.',
    idiomatic: 'Chengyi became Prince of Shen, Jiangfan Prince of Qi, and Longye Prince of Xue.',
  },
  s0416: {
    literal: 'On jiyou, the Princess of Zhenguo Taiping received an added substantive fief of five hundred households, ten thousand in all with prior grants.',
    idiomatic: 'On jiyou Princess Taiping of Zhenguo gained five hundred more fief households, ten thousand in total.',
  },
  s0417: {
    literal: 'In the seventh month of autumn, on guichou, Vice Minister of War and acting Yongzhou chief administrator Cui Riyong was made Attendant of the Yellow Gate and joined in managing critical affairs.',
    idiomatic: 'On guichou in the seventh month Cui Riyong, Vice Minister of War and acting Yongzhou chief, entered the Yellow Gate and the inner council.',
  },
  s0418: {
    literal: 'On bingchen, Empress Zetian the Great Sage was restored to her former title of Empress.',
    idiomatic: 'On bingchen Wu Zetian was again styled Empress.',
  },
  s0419: {
    literal: 'Prince of Yong Xian was posthumously titled Crown Prince Zhanghuai; the commoner Chongjun was styled Crown Prince Jiemin.',
    idiomatic: 'The deposed Prince of Yong Xian was posthumously named Crown Prince Zhanghuai; Chongjun, Crown Prince Jiemin.',
  },
  s0420: {
    literal: 'The offices and ranks of Jing Hui, Huan Yanfan, Cui Xuanwei, Zhang Jianzhi, Yuan Shuoji, Prince of Cheng Qianli, Li Duozuo, and others were restored.',
    idiomatic: 'Jing Hui, Huan Yanfan, Cui Xuanwei, Zhang Jianzhi, Yuan Shuoji, Prince of Cheng Qianli, Li Duozuo, and the rest had rank and title restored.',
  },
  s0421: {
    literal: 'On dingsi, Henan, Luoyang, and Hua prefectures all resumed their former names.',
    idiomatic: 'On dingsi Henan, Luoyang, and Hua prefectures took back their old names.',
  },
  s0422: {
    literal: 'Luozhou chief administrator Song Jing was made acting Minister of Personnel and Grand Counselor of the third rank; Palace Draftsman Cen Xi was made Right Regular Attendant.',
    idiomatic: 'Song Jing of Luozhou became acting Personnel minister and third-rank counselor; Cen Xi, Right Regular Attendant.',
  },
  s0423: {
    literal: 'On renxu, Xiao Zhizhong was made Jinzhou governor, Wei Sili Xuzhou governor, Zhao Yanzhao Songzhou governor; Minister of War Yao Yuanzhi also served as Right Subprefect of the Heir Apparent; Minister of Personnel Song Jing also served as Left Subprefect of the Heir Apparent.',
    idiomatic: 'On renxu Xiao Zhizhong went to Jinzhou, Wei Sili to Xuzhou, Zhao Yanzhao to Songzhou; Yao Yuanzhi doubled as Right Heir Apparent subprefect and Song Jing as Left.',
  },
  s0424: {
    literal: 'On guihai, Vice Minister of Personnel Cui Shi was made Right Assistant Director and removed from managing state affairs.',
    idiomatic: 'On guihai Cui Shi became Right Assistant Director and left the inner council.',
  },
  s0425: {
    literal: 'On jiazi, Right Vice Director Su Gui of Xu, Minister of War Yao Yuanzhi, Minister of Personnel Song Jing, and Right Regular Attendant acting as Minister of Justice Cen Xi were all commissioned to fix the regnal title of Dingling.',
    idiomatic: 'On jiazi Su Gui, Yao Yuanzhi, Song Jing, and Cen Xi (acting Justice minister) were sent to set the posthumous style for Dingling.',
  },
  s0426: {
    literal: 'On bingyin, Yao Yuanzhi also served as Grand Counselor.',
    idiomatic: 'On bingyin Yao Yuanzhi added the Grand Counselor title.',
  },
  s0427: {
    literal: 'On dingmao, Su Gui was made Left Vice Director, still Grand Counselor of the third rank as before.',
    idiomatic: 'On dingmao Su Gui became Left Vice Director while keeping third-rank Grand Counselor status.',
  },
  s0428: {
    literal: 'Tang Xiujing, Duke of Song, retired.',
    idiomatic: 'Tang Xiujing, Duke of Song, left office.',
  },
  s0429: {
    literal: 'General of the Right Martial Guards, acting Right Censor-in-Chief, Grand Counselor of the third rank, Zhang Renbian, Duke of Han, was made General of the Right Guards.',
    idiomatic: 'Zhang Renbian, Duke of Han, moved from Right Martial Guards and acting Right Censor-in-Chief to General of the Right Guards.',
  },
  s0430: {
    literal: 'On wuchen, Cui Riyong was made Yongzhou chief administrator and Xue Ji Right Regular Attendant; both ceased managing critical affairs.',
    idiomatic: 'On wuchen Cui Riyong took Yongzhou and Xue Ji the Right Regular Attendant post; both left the inner council.',
  },
  s0431: {
    literal: 'Special Advance, Grand Counselor of the third rank, Li Jiao, Duke of Zhao, was made Huai Prefecture governor.',
    idiomatic: 'Li Jiao, Duke of Zhao, went out to govern Huai prefecture.',
  },
  s0432: {
    literal: 'The office of Field-plot Assessor was abolished.',
    idiomatic: 'The Field-plot Assessor post was abolished.',
  },
  s0433: {
    literal: 'On jisi, Prince of Ping was installed as crown prince.',
    idiomatic: 'On jisi the Prince of Ping was made heir apparent.',
  },
  s0434: {
    literal: 'A great amnesty was proclaimed for all under Heaven; the era name was changed to Jingyun.',
    idiomatic: 'The realm was amnestied and the reign title became Jingyun.',
  },
  s0435: {
    literal: 'Officials of ninth rank and above inside and outside the capital, and sons who succeeded fathers in office, each received one merit turn; from the Shenlong era those who remonstrated and died wrongfully were all granted tomb tablets; all prefectures and counties whose names had been changed to the character Wu since the Tianshou era were ordered restored to their former names.',
    idiomatic: 'Officials of ninth rank and up, and sons inheriting fathers’ posts, gained one merit notch; wronged remonstrators since Shenlong received tomb tablets; counties renamed with Wu since Tianshou reverted to old names.',
  },
  s0436: {
    literal: 'The Chongen Temple of the Wu clan was abolished; Haoling and Shunling likewise lost the word ling in their names.',
    idiomatic: 'The Wu clan’s Chongen Temple was shut; Haoling and Shunling dropped the tomb suffix.',
  },
  s0437: {
    literal: 'On jisi of the seventh month of the first year of Jingyun, a statute provided that from now on appointees to Left and Right Vice Directors, Attendants-in-Chief, Grand Counselors, and the six ministers and above might decline if offered; the rest might not decline.',
    idiomatic: 'A seventh-month statute allowed new appointees from vice director up to refuse office; lower ranks could not.',
  },
  s0438: {
    literal: 'The deposed Empress Wei was posthumously reduced to commoner; Princess Anle to the rebellious commoner.',
    idiomatic: 'Empress Wei was posthumously demoted to commoner; Princess Anle to “rebellious commoner.”',
  },
  s0439: {
    literal: 'On dingchou, the Astrological Directorate was changed to the Astrological Bureau, subordinate to the Secretariat.',
    idiomatic: 'On dingchou the Astrological Directorate became a bureau under the Secretariat.',
  },
  s0440: {
    literal: 'On guisi of the eighth month, the newly appointed Qiaozhou governor, Prince of Qiao Chongfu, secretly entered the eastern capital to plot rebellion; prefectures and counties suppressed him.',
    idiomatic: 'On guisi Prince of Qiao Chongfu, fresh Qiaozhou governor, slipped into Luoyang to rebel and was crushed by local forces.',
  },
  s0441: {
    literal: 'Earlier, in Zhongzong’s time official titles had been wantonly sold; because of imperial consorts’ and princesses’ ink edicts granting office, such appointments were called “slant-seal”; now they were all ordered dismissed.',
    idiomatic: 'Under Zhongzong offices had been sold through consorts’ and princesses’ private edicts—“slant-seal” appointments—and now all were cashiered.',
  },
  s0442: {
    literal: 'On guimao, the Gate-Down Quarters were renamed the Left Eastern Palace, the Canon-keeping Quarters the Right Eastern Palace; the Left and Right Feathered Forest Guards reverted to the Left and Right Feathered Forest Armies.',
    idiomatic: 'On guimao the eastern palaces were reorganized and the Feathered Forest guards again became armies.',
  },
  s0443: {
    literal: 'On gengxu of the ninth month, the crown prince’s son Sizhen was enfeoffed Prince of Xuchang and Siqian Prince of Zhending.',
    idiomatic: 'On gengxu the heir’s sons Sizhen and Siqian became princes of Xuchang and Zhending.',
  },
  s0444: {
    literal: 'In the tenth month of winter, on jiashen, an edict said that installing the spirit tablet of the Filial and Respectful Emperor ahead of time in the Grand Temple violated ancient propriety; a separate Yizong Temple was to be built in the eastern capital.',
    idiomatic: 'On jiashen an edict ruled that Zhongzong’s tablet in the Grand Temple broke ancient usage; Luoyang would have a separate Yizong shrine.',
  },
  s0445: {
    literal: 'On dingwei, Yao Yuanzhi was made Grand Counselor and acting Minister of War.',
    idiomatic: 'On dingwei Yao Yuanzhi became Grand Counselor and acting War minister.',
  },
  s0446: {
    literal: 'On yiyou of the eleventh month, the Filial and Harmonious Emperor was buried at Dingling.',
    idiomatic: 'In the eleventh month Zhongzong was buried at Dingling.',
  },
  s0447: {
    literal: 'On xinhai, Grand Preceptor of the Heir Apparent, Prince of Song Chengqi, was made Left Vice Director.',
    idiomatic: 'On xinhai Chengqi, Prince of Song, became Left Vice Director.',
  },
  s0448: {
    literal: 'Su Gui was made Junior Tutor of the Heir Apparent; Attendant-in-Chief, Duke of Yun Wei Anshi was made Junior Protector of the Heir Apparent, his fief changed to Duke of Xun, and both ceased managing state affairs.',
    idiomatic: 'Su Gui tutored the heir; Wei Anshi, Duke of Yun, became Junior Protector as Duke of Xun—both left the inner council.',
  },
  s0449: {
    literal: 'On wuchen, Prince of Song Chengqi was made Minister of Works and still held the Grand Commandery of Yangzhou.',
    idiomatic: 'On wuchen Chengqi became Minister of Works while still commanding Yangzhou.',
  },
  s0450: {
    literal: 'On gengwu, Junior Tutor of the Heir Apparent Su Gui died.',
    idiomatic: 'On gengwu Su Gui died.',
  },
  s0451: {
    literal: 'That year the commoner consort Wei and the rebellious commoner were reburied with full rites; the corpses of Wu Sansi and his son were exhumed and their bodies hacked.',
    idiomatic: 'That year Empress Wei and Princess Anle were reburied properly; Wu Sansi and his son were dug up and mutilated.',
  },
  s0452: {
    literal: 'In the second year of Jingyun, in spring, the first month, on dingwei the new moon: because the imperial tomb day drew near, court congratulations were not accepted.',
    idiomatic: 'Early in Jingyun 2, on the dingwei new moon, mourning for the tomb kept the court from accepting New Year homage.',
  },
  s0453: {
    literal: 'On guichou, Quanzhou was changed to Minzhou with a military governorship installed; Wurongzhou was changed to Quanzhou.',
    idiomatic: 'On guichou Quan became Min with a governor-general; Wurong reverted to Quan.',
  },
  s0454: {
    literal: 'The Türk Mo-ch’o sent envoys requesting a marriage alliance; it was granted.',
    idiomatic: 'Mo-ch’o of the Turks asked for a marriage pact and was accepted.',
  },
  s0455: {
    literal: 'On jiwei, Minister of the Imperial Stud Guo Yuanzhen and Palace Draftsman Zhang Shuo were both made Grand Counselors of the third rank with the “equal” designation.',
    idiomatic: 'On jiwei Guo Yuanzhen and Zhang Shuo joined the third-rank council as “equals.”',
  },
  s0456: {
    literal: 'On jiazi, Prince of Wen Chongmao was re-enfeoffed as Prince of Xiang and moved to Jizhou.',
    idiomatic: 'On jiazi Chongmao, Prince of Wen, became Prince of Xiang and was sent to Jizhou.',
  },
  s0457: {
    literal: 'On yichou, the late Empress Liu was posthumously honored as Empress Suming; her tomb was called Huiling;',
    idiomatic: 'On yichou Empress Liu was posthumously named Suming, tomb Huiling;',
  },
  s0458: {
    literal: 'Consort Dou as Empress Zhaocheng; her tomb was called Jingling.',
    idiomatic: 'Consort Dou as Empress Zhaocheng, buried at Jingling.',
  },
  s0459: {
    literal: 'On dingchou of the second month, the crown prince was ordered to oversee the state.',
    idiomatic: 'In the second month the heir was told to supervise government.',
  },
  s0460: {
    literal: 'On jiachen, Yao Yuanzhi was demoted to Shenzhou governor and Song Jing to Chuzhou governor.',
    idiomatic: 'On jiachen Yao Yuanzhi and Song Jing were sent out to Shen and Chu.',
  },
  s0461: {
    literal: 'Wei Anshi was made Attendant-in-Chief.',
    idiomatic: 'Wei Anshi became Attendant-in-Chief.',
  },
  s0462: {
    literal: 'On bingxu, Liu Youqiu was made Minister of Revenue and ceased managing state affairs.',
    idiomatic: 'On bingxu Liu Youqiu took Revenue and left the inner council.',
  },
  s0463: {
    literal: 'On wuzi, an edict allowed slant-seal officials of Zhongzong’s time to keep their posts as before.',
    idiomatic: 'On wuzi slant-seal appointees from Zhongzong’s reign were allowed to remain.',
  },
  s0464: {
    literal: 'On gengshen, Left and Right Mentors of the Heir Apparent and Left and Right Supporters of Goodness were restored, two of each.',
    idiomatic: 'On gengshen the heir’s mentor and supporter posts were restored, two each side.',
  },
  s0465: {
    literal: 'On wuxu, Guo Yuanzhen was made Minister of War, still Grand Counselor of the third rank with the “equal” designation as before.',
    idiomatic: 'On wuxu Guo Yuanzhen became War minister while keeping his equal council seat.',
  },
  s0466: {
    literal: 'On jiwei, the Cultivated Texts Hall was changed to the Broad Texts Hall.',
    idiomatic: 'On jiwei the Cultivated Texts Hall became the Broad Texts Hall.',
  },
  s0467: {
    literal: 'Attendant of the Yellow Gate Li Rizhi was made Left Censor-in-Chief, still Grand Counselor of the third rank as before.',
    idiomatic: 'Li Rizhi moved to Left Censor-in-Chief while keeping third-rank council rank.',
  },
  s0468: {
    literal: 'In summer, the fourth month, on gengchen, Zhang Shuo was made Vice Minister of War, still Grand Counselor of the third rank with the “equal” designation.',
    idiomatic: 'In the fourth month Zhang Shuo became Vice Minister of War and kept his equal council seat.',
  },
  s0469: {
    literal: 'On guimao, Zhengzhou was established by dividing Yingzhou.',
    idiomatic: 'On guimao Ying was split to create Zheng.',
  },
  s0470: {
    literal: 'An edict said that Buddhist sutras reveal the profound origin, reason and traces differ, yet in saving men and transforming custom teaching and merit are alike.',
    idiomatic: 'An edict held that Buddhist teaching and Daoist practice alike save the people—different paths, one aim.',
  },
  s0471: {
    literal: 'Henceforth at every legal assembly monks, nuns, Daoist priests, and female adepts should process together.',
    idiomatic: 'Henceforth at state rituals clergy of all three traditions would march together.',
  },
  s0472: {
    literal: 'On jiashen, Wei Anshi was made Grand Counselor;',
    idiomatic: 'On jiashen Wei Anshi became Grand Counselor;',
  },
  s0473: {
    literal: 'Prince of Song Chengqi was made Guest of the Heir Apparent, still holding Yangzhou Grand Commandery from afar as before.',
    idiomatic: 'Chengqi, Prince of Song, became the heir’s guest while still titular Yangzhou commander.',
  },
  s0474: {
    literal: 'On bingshen, Li Rizhi was made Attendant-in-Chief.',
    idiomatic: 'On bingshen Li Rizhi became Attendant-in-Chief.',
  },
  s0475: {
    literal: 'On renyin, a great amnesty was proclaimed for all under Heaven; Chongfu’s partisans were released and cleared.',
    idiomatic: 'On renyin the realm was amnestied and Chongfu’s followers cleared.',
  },
  s0476: {
    literal: 'Capital officials of fourth rank and below received one rank; outer officials one merit turn; third rank and above each received one noble rank.',
    idiomatic: 'Capital officers to fourth rank rose one step; field officers one merit notch; third rank and up gained a noble grade.',
  },
  s0477: {
    literal: 'Buddhist monks and nuns, Daoist priests and female adepts ordained beyond quota throughout the realm were restored as before.',
    idiomatic: 'Excess ordinations of clergy nationwide were regularized.',
  },
  s0478: {
    literal: 'It was also ordered that inner and outer officials from ninth rank up, civil and military, all carry hand-towels and counting pouches as in the first year of Shangyuan; military officers all carried the seven-item saber-set and boots.',
    idiomatic: 'Civil and military officers of ninth rank and up again wore hand-towels and pouches; soldiers carried full saber-kit and boots.',
  },
  s0479: {
    literal: 'Belts of first through fifth rank used gold; sixth and seventh silver; eighth and ninth white bronze.',
    idiomatic: 'First- to fifth-rank belts were gold; sixth and seventh silver; eighth and ninth white bronze.',
  },
  s0480: {
    literal: 'Fish pouches on purple robes were gold-mounted; on scarlet, silver-mounted.',
    idiomatic: 'Purple robes bore gold fish-pouches; scarlet, silver.',
  },
  s0481: {
    literal: 'Arrears before the third year of Jinglong were all remitted.',
    idiomatic: 'Tax arrears before Jinglong 3 were forgiven.',
  },
  s0482: {
    literal: 'The realm enjoyed great feasting for five days.',
    idiomatic: 'Five days of public feasting were proclaimed.',
  },
  s0483: {
    literal: 'On gengxu, the Wu clan’s Haoling and Shunling were restored, with officials appointed in due measure, at Princess Taiping’s request for Wu Youji.',
    idiomatic: 'On gengxu the Wu tombs were restored with staff, at Taiping’s plea for Wu Youji.',
  },
  s0484: {
    literal: 'On gengshen, Wei Anshi was given the Grand Mentor of the Palace with the same ceremony as the Three Excellencies.',
    idiomatic: 'On gengshen Wei Anshi received the “Opening the Mansion” honor.',
  },
  s0485: {
    literal: 'On xinchou, Princess of Xicheng was changed to Princess of Jinxian and Princess of Changlong to Princess of Yuzhen; the Jinxian and Yuzhen monasteries were established.',
    idiomatic: 'On xinchou two princesses were renamed and given the Jinxian and Yuzhen abbeys.',
  },
  s0486: {
    literal: 'On renxu, Palace Director Dou Huai’zhen was made Left Censor-in-Chief and Grand Counselor of the third rank with the “equal” designation.',
    idiomatic: 'On renxu Dou Huai’zhen joined the council as Left Censor-in-Chief.',
  },
  s0487: {
    literal: 'On renwu of the sixth month, following Han precedent, twenty-four military governorships were established.',
    idiomatic: 'In the sixth month twenty-four area commands were set up on the Han model.',
  },
  s0488: {
    literal: 'In the intercalary sixth month, circuit investigating commissioners were first appointed for the ten circuits.',
    idiomatic: 'The intercalary month saw the first ten-circuit investigating commissioners.',
  },
  s0489: {
    literal: 'In the seventh month of autumn, the newly established governorships were all halted.',
    idiomatic: 'That autumn the new area commands were abolished.',
  },
  s0490: {
    literal: 'Only the chief administrators of Yong and Luo and the four great area commands of Yang, Yi, Jing, and Bing were raised to third rank.',
    idiomatic: 'Only chiefs of the two capitals and four great commands kept third-rank standing.',
  },
  s0491: {
    literal: 'On yimao of the eighth month, an edict said that Xingsheng Monastery was the High Ancestor’s old residence and had a persimmon tree that died in the Tianshou era and now lived again; a great amnesty was proclaimed for all under Heaven.',
    idiomatic: 'On yimao a dead persimmon at Gaozu’s old monastery sprouted anew; the court amnestied the realm.',
  },
  s0492: {
    literal: 'Plotters of murder, robbers of murder, and chief forgers of false documents were all spared death and sent to penal service in Lingnan; clerks who took bribes were specially released.',
    idiomatic: 'Capital crimes short of the gravest were commuted to Lingnan; bribe-taking clerks were also freed.',
  },
  s0493: {
    literal: 'The realm enjoyed great feasting for three days.',
    idiomatic: 'Three days of public feasting followed.',
  },
  s0494: {
    literal: 'On dingsi, the crown prince performed the libation rite at the Imperial Academy.',
    idiomatic: 'On dingsi the heir offered at the National University.',
  },
  s0495: {
    literal: 'On jisi, Wei Anshi was made Right Vice Director and Grand Counselor of the third rank and also Guest of the Heir Apparent; Minister of Rites Dou Xijie was made Junior Tutor of the Heir Apparent.',
    idiomatic: 'On jisi Wei Anshi became Right Vice Director and heir’s guest; Dou Xijie tutored the heir.',
  },
  s0496: {
    literal: 'On gengwu, the Left and Right Garrison Guards were renamed the Left and Right Martial Guards; the Left and Right Imperial Clan Guard rate offices the Left and Right Palace Horse offices; the Armillary Directorate became the Astrological Directorate.',
    idiomatic: 'On gengwu guard units were renamed and the armillary office became the Astrological Directorate again.',
  },
  s0497: {
    literal: 'On dingmao of the ninth month, Dou Huai’zhen was made Attendant-in-Chief.',
    idiomatic: 'In the ninth month Dou Huai’zhen became Attendant-in-Chief.',
  },
  s0498: {
    literal: 'On jiachen of the tenth month of winter, Minister of Personnel Liu Youqiu was made Attendant-in-Chief; Regular Attendant Wei Zhigu Grand Counselor of the third rank; Heir Apparent Steward Cui Shi Palace Draftsman and third-rank counselor; Palace Draftsman Lu Xiangxian Grand Counselor of the third rank with the “equal” designation.',
    idiomatic: 'On jiachen Liu Youqiu became Attendant-in-Chief; Wei Zhigu joined the council; Cui Shi and Lu Xiangxian entered high office.',
  },
  s0499: {
    literal: 'Wei Anshi was made Left Vice Director and eastern capital intendant; Attendant-in-Chief Li Rizhi Minister of Revenue; Minister of War Guo Yuanzhen Minister of Personnel; Attendant-in-Chief and acting Left Censor-in-Chief Dou Huai’zhen Left Censor-in-Chief; Vice Minister of War and Left Subprefect Zhang Shuo Left Assistant Director: all ceased managing state affairs.',
    idiomatic: 'A sweeping reshuffle sent Wei Anshi to the eastern capital, rotated ministers, and cleared the inner council.',
  },
  s0500: {
    literal: 'On wuyin of the eleventh month, the Astrological Directorate was changed to the Astrological Bureau, again subordinate to the Secretariat as before.',
    idiomatic: 'In the eleventh month the Astrological Directorate again became a Secretariat bureau.',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/007.json';
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
if (trans.metadata.chapter !== '007') {
  throw new Error(`Expected chapter 007, got ${trans.metadata.chapter}`);
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
