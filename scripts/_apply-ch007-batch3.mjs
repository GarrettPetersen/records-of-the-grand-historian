#!/usr/bin/env node
/** Batch 3: s0201–s0300 (Jiutangshu ch.007, Zhongzong — Jinglong through death) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0201: {
    literal: 'On bingwu, Mo-ch\'o of the Turks slew our envoy Zang Siyan.',
    idiomatic: 'On bingwu the Turk qaghan Mo-chu murdered the court envoy Zang Siyan.',
  },
  s0202: {
    literal: 'Sixth month, dingmao new moon: the sun was eclipsed.',
    idiomatic: 'In the sixth month, on the dingmao new moon, the sun was eclipsed.',
  },
  s0203: {
    literal:
      'On wuzi, Pacification Commissioner of Yaoxian Circuit Tang Jiuzheng, also investigating censor, attacked the rebel tribes of Yaozhou, defeated them, and took some three thousand captives; he then set up a stone there to record the achievement.',
    idiomatic:
      'On wuzi Tang Jiuzheng, pacification commissioner of Yaoxian circuit and investigating censor, crushed the Yaozhou rebels, took some three thousand captives, and had the victory carved in stone on the spot.',
  },
  s0204: {
    literal:
      'That summer more than twenty circuits in Shandong and Hebei suffered drought; famine and pestilence killed thousands. Envoys were sent to relieve and comfort the people.',
    idiomatic:
      'That summer drought struck more than twenty prefectures in Shandong and Hebei; famine and plague killed thousands, and the court sent envoys with relief.',
  },
  s0205: {
    literal:
      'Autumn, seventh month, gengzi: Crown Prince Chongjun, with Yulin General Li Duozuo and others, led more than three hundred Yulin thousand-horse guards, executed Wu Sansi and Wu Chongxun, then led troops through the Suozhang Gate, cutting the bar to enter.',
    idiomatic:
      'In the seventh month, on gengzi, Crown Prince Chongjun and Yulin general Li Duozuo led over three hundred elite guards, killed Wu Sansi and Wu Chongxun, then forced the Suozhang Gate and burst into the palace.',
  },
  s0206: {
    literal:
      'The Emperor in alarm ascended the Xuanwu Tower; Chongjun led troops below. The Emperor himself leaned from the balustrade to address them, and the host dispersed; Li Duozuo was killed.',
    idiomatic:
      'The emperor fled in panic to the Xuanwu Tower. Chongjun brought his men beneath the balcony; the emperor leaned out to reason with them, the soldiers melted away, and Li Duozuo was slain.',
  },
  s0207: {
    literal: 'Chongjun fled to Hu County; he was killed by his own followers.',
    idiomatic: 'Chongjun fled toward Hu County and was killed by his own men.',
  },
  s0208: {
    literal: 'On guimao a general amnesty was proclaimed throughout the realm.',
    idiomatic: 'On guimao the throne proclaimed a general amnesty.',
  },
  s0209: {
    literal:
      'Eighth month, bingzi: Xuanwu Gate was renamed Divine Martial Gate, the tower renamed Tower of Sure Victory.',
    idiomatic:
      'In the eighth month, on bingzi, Xuanwu Gate was renamed Divine Martial Gate and its tower Tower of Sure Victory.',
  },
  s0210: {
    literal:
      'On bingxu Left Vice Director of the Secretariat and concurrently Left Director Wei Yuanzhong requested retirement; he was granted specially advanced rank.',
    idiomatic:
      'On bingxu Wei Yuanzhong, left vice director of the Secretariat, asked to retire and was made specially advanced.',
  },
  s0211: {
    literal:
      'Ninth month, dingyou: Minister of War and Prince of Ying Zong Chuke, and Left Guard General concurrently Grand Steward Ji Chuna were both made co-equal with the Secretariat third grade;',
    idiomatic:
      'In the ninth month, on dingyou, Zong Chuke, minister of war and Prince of Ying, and Ji Chuna, left guard general and grand steward, entered the Secretariat as co-equal third-grade ministers;',
  },
  s0212: {
    literal:
      'Vice Director of the Ministry of Personnel and concurrently Vice Censor-in-Chief of the Left Bureau Xiao Zhi Zhong became Vice Director of the Yellow Gate and concurrently Vice Censor-in-Chief of the Left, co-equal with the Secretariat third grade;',
    idiomatic:
      'Xiao Zhi Zhong, vice director of personnel and left vice censor-in-chief, was made vice director of the Yellow Gate with the same standing;',
  },
  s0213: {
    literal:
      'Vice Director of the Secretariat and Duke of Donghai Yu Wei Qian was made Rector of the Directorate of Education and ceased managing state affairs.',
    idiomatic:
      'Yu Wei Qian, vice director of the Secretariat and Duke of Donghai, was made rector of the Directorate of Education and left the council of state.',
  },
  s0214: {
    literal:
      'On gengzi the Emperor\'s honorific was raised to Responsive Spirit Divine Dragon; the Empress\'s to Compliant Heaven Aiding Sage. A general amnesty was proclaimed and the era name changed to Jinglong.',
    idiomatic:
      'On gengzi the emperor took the honorific Responsive Spirit Divine Dragon and the empress Compliant Heaven Aiding Sage; the realm was amnestied and the era renamed Jinglong.',
  },
  s0215: {
    literal:
      'Civil and military officials of the two capitals of third rank and above were granted one noble rank; those of fourth rank and below received one step; outer officials one turn of merit.',
    idiomatic:
      'At the two capitals, officials of third rank and above gained a noble rank, those of fourth rank and below a step in rank, and outer officials one turn of merit.',
  },
  s0216: {
    literal:
      'Jinglong, first year, ninth month, jiachen: Specially Advanced Wei Yuanzhong was demoted to Wuchuan county magistrate, on the charge of plotting with Chongjun.',
    idiomatic:
      'In the ninth month of the first year of Jinglong, on jiachen, Wei Yuanzhong was stripped of specially advanced rank and sent to serve as magistrate of Wuchuan, accused of collusion with Chongjun.',
  },
  s0217: {
    literal:
      'On gengchen Attendant-in-Chief and concurrently Left Censor-in-Chief Yang Zaisi became Director of the Secretariat; Minister of Personnel Wei Juyuan and Grand Steward Ji Chuna became attendants-in-chief; Attendant-in-Chief Su Gui became Minister of Personnel.',
    idiomatic:
      'On gengchen Yang Zaisi became director of the Secretariat; Wei Juyuan and Ji Chuna, attendants-in-chief; Su Gui, minister of personnel.',
  },
  s0218: {
    literal:
      'On renxu the Left and Right Yulin Guards\' thousand-horse units were renamed Ten Thousand Horse units and again divided into left and right.',
    idiomatic:
      'On renxu the Yulin thousand-horse guards were renamed Ten Thousand Horse regiments, each split into left and right wings.',
  },
  s0219: {
    literal:
      'Tenth month, winter, renwu: a comet appeared in the west and was extinguished after more than a month.',
    idiomatic:
      'In the tenth winter month, on renwu, a comet blazed in the west for more than a month.',
  },
  s0220: {
    literal:
      'On renwu the Empress submitted the "Ode to Divine Martiality" and ordered it carved in stone at the two capitals and the four great protectorates.',
    idiomatic:
      'That same renwu the empress presented the "Ode to Divine Martiality" and had it cut into stone at the two capitals and the four great protectorates.',
  },
  s0221: {
    literal: 'Twelfth month, yichou new moon: the sun was eclipsed.',
    idiomatic: 'On the yichou new moon of the twelfth month the sun was eclipsed.',
  },
  s0222: {
    literal: 'On dingchou earth rained in the capital.',
    idiomatic: 'On dingchou dust fell like rain over the capital.',
  },
  s0223: {
    literal:
      'Jinglong, second year, first month, bingshen: in Cangzhou hail as large as hen\'s eggs fell.',
    idiomatic:
      'In the first month of the second year of Jinglong, on bingshen, hailstones as large as hen\'s eggs struck Cangzhou.',
  },
  s0224: {
    literal:
      'Second month, xinwei: the Emperor visited the residence of Left Golden Guard Grand General and Duke of Chen Lu Song.',
    idiomatic:
      'On xinwei of the second month the emperor visited Lu Song, left golden guard grand general and Duke of Chen.',
  },
  s0225: {
    literal:
      'The Empress said that on a skirt in her wardrobe five-colored clouds had risen; she had a painter depict it and showed it to the hundred officials, then proclaimed a general amnesty.',
    idiomatic:
      'The empress claimed five-colored clouds had risen from a skirt in her wardrobe, had the omen painted for the court, and proclaimed a general amnesty.',
  },
  s0226: {
    literal:
      'On guiwei night the Celestial Treasure star fell in the southwest with a sound like thunder; wild pheasants all crowed.',
    idiomatic:
      'On the night of guiwei the Celestial Treasure star plunged southwest with a thunderous roar, and wild pheasants cried out across the fields.',
  },
  s0227: {
    literal:
      'On yiyou, because the empress\'s robes bore the auspicious sign of felicitous clouds, a general amnesty was proclaimed.',
    idiomatic:
      'On yiyou, citing felicitous clouds on the empress\'s robes, the throne again amnestied the realm.',
  },
  s0228: {
    literal:
      'Mothers and wives of officials within and without of fifth rank and above each received one step in noble title; those without wives might confer it on a daughter;',
    idiomatic:
      'Within and without the court, mothers and wives of officials of fifth rank and above gained a noble title; the wifeless might pass the honor to a daughter;',
  },
  s0229: {
    literal:
      'every woman in the realm eighty years and above was granted by patent the title of district, county, or commandery lady.',
    idiomatic:
      'and every woman in the realm eighty or older was granted a patent as district, county, or commandery lady.',
  },
  s0230: {
    literal:
      'Third month, bingzi: Zhang Renyuan, grand commander of Shuofang circuit, built the Accepting Surrender fortress on the river.',
    idiomatic:
      'On bingzi of the third month Zhang Renyuan, grand commander of Shuofang, built Accepting Surrender fortress on the Yellow River.',
  },
  s0231: {
    literal:
      'Summer, fourth month, gengwu: Left Regular Attendant, Prince of Leshou, and Chief Commandant of Horse for the Imperial Son-in-Law Wu Youji yielded the princedom and was re-enfeoffed Duke of Chu.',
    idiomatic:
      'On gengwu of the fourth summer month Wu Youji, left regular attendant, Prince of Leshou, and chief commandant for imperial sons-in-law, surrendered his princedom and was made Duke of Chu.',
  },
  s0232: {
    literal:
      'On guiwei the Cultivation of Letters Hall added eight grand academicians and twelve direct academicians.',
    idiomatic:
      'On guiwei eight grand academicians and twelve direct academicians were added to the Cultivation of Letters Hall.',
  },
  s0233: {
    literal:
      'On jichou the Emperor visited Princess Changle\'s estate and returned to the palace the same day.',
    idiomatic:
      'On jichou he visited Princess Changle\'s villa and returned to the palace that day.',
  },
  s0234: {
    literal:
      'Sixth month, dinghai: the Astrological Service was renamed the Astrological Bureau and removed from the Secretariat\'s jurisdiction.',
    idiomatic:
      'On dinghai of the sixth month the Astrological Service became the Astrological Bureau, no longer subordinate to the Secretariat.',
  },
  s0235: {
    literal: 'Seventh month, autumn, xinmao: Taizhou was struck by earthquake.',
    idiomatic: 'In the seventh month, on xinmao, Taizhou suffered an earthquake.',
  },
  s0236: {
    literal:
      'On guisi Left Encampment Guard Grand General, acting Right Censor-in-Chief, and Shuofang field commander Duke of Han Zhang Renyuan was made co-equal with the Secretariat third grade.',
    idiomatic:
      'On guisi Zhang Renyuan, left encampment grand general, acting right censor-in-chief, and Shuofang commander, Duke of Han, entered the Secretariat as co-equal third grade.',
  },
  s0237: {
    literal:
      'Crimson vapor stretched across the sky, its light illuminating the earth; after three days it ceased.',
    idiomatic:
      'Crimson light spanned the heavens and lit the earth for three days before it faded.',
  },
  s0238: {
    literal:
      'Eleventh month, winter, gengshen: the Turk leader Suoge rebelled, installed himself qaghan, and sent his younger brother Zhenu to lead troops in raiding the frontier.',
    idiomatic:
      'On gengshen of the eleventh winter month the Turk chief Suoge rebelled, declared himself qaghan, and sent his brother Zhenu to raid the borders.',
  },
  s0239: {
    literal:
      'On jimao, because Princess Anle was sent in marriage, the empress\'s ceremonial guard was lent from within the palace to magnify the spectacle; the Emperor and Empress mounted Peace and Blessing Tower to watch.',
    idiomatic:
      'On jimao, for Princess Anle\'s wedding procession, the empress lent her ceremonial guard from the inner palace to swell the display; emperor and empress watched from Peace and Blessing Tower.',
  },
  s0240: {
    literal:
      'When the rites were complete a general amnesty was proclaimed and revelry granted for three days.',
    idiomatic:
      'When the rites ended the court amnestied the realm and granted three days of public revelry.',
  },
  s0241: {
    literal:
      'On guiwei Protector-General of Anxi Niu Shiji fought Suoge at Fire-Burning City; Shiji was defeated and fell in battle.',
    idiomatic:
      'On guiwei Niu Shiji, protector-general of Anxi, met Suoge at Fire-Burning City, was routed, and died on the field.',
  },
  s0242: {
    literal:
      'That winter the Ministry of Personnel at the western capital set up two vice directors for examination; the eastern capital also set up two examiners, who freely sold their favor.',
    idiomatic:
      'That winter the western capital\'s Ministry of Personnel doubled its examining vice directors; the eastern capital added two more, and posts were openly traded for bribes.',
  },
  s0243: {
    literal:
      'There were also slanting-seal appointments, drawing on the autumn quota in advance.',
    idiomatic: 'Slanting-seal appointments also preempted the autumn quota of offices.',
  },
  s0244: {
    literal:
      'Jinglong, third year, first month, spring, dingmao: yellow mist sealed the four quarters.',
    idiomatic:
      'In the first spring month of the third year of Jinglong, on dingmao, yellow fog choked the horizon.',
  },
  s0245: {
    literal: 'On guiyou the Emperor visited Jianfu Temple.',
    idiomatic: 'On guiyou he visited Jianfu Temple.',
  },
  s0246: {
    literal: 'On yihai he feasted close ministers and kin at Pear Garden Pavilion.',
    idiomatic: 'On yihai he banqueted close ministers and kin at Pear Garden Pavilion.',
  },
  s0247: {
    literal:
      'Second month, jichou: he visited the Divine Martial Gate, watched palace women in great revelry with close ministers, then had left and right cohorts compete for victory.',
    idiomatic:
      'On jichou of the second month he went to Divine Martial Gate, watched palace women revel with his intimates, then set left and right factions to compete.',
  },
  s0248: {
    literal:
      'The Emperor also had palace women set up market stalls to sell goods, ordered chief ministers and dukes to act as merchants and trade with them, and quarrels arose with foul and lewd words.',
    idiomatic:
      'He had palace women open market stalls, made chief ministers and dukes haggle as merchants, and quarrels broke out in foul, lewd speech.',
  },
  s0249: {
    literal: 'The Emperor and Empress watched and took it for laughter.',
    idiomatic: 'Emperor and empress looked on and laughed.',
  },
  s0250: {
    literal:
      'On renyin Attendant-in-Chief and Duke of Shu Wei Juyuan was made Left Director of the Secretariat, co-equal with the Secretariat third grade.',
    idiomatic:
      'On renyin Wei Juyuan, attendant-in-chief and Duke of Shu, became left director of the Secretariat with third-grade standing.',
  },
  s0251: {
    literal:
      'On wuwu Minister of War and Duke of Ying Zong Chuke became Director of the Secretariat; Vice Director of the Secretariat and Duke of Zan Xiao Zhi Zhong became Attendant-in-Chief; Grand Steward Wei Sili became Minister of War, co-equal with the Secretariat third grade; Vice Director of the Secretariat and Acting Vice Director of Personnel Cui Shi was made co-equal with the Secretariat as Rectifier; Vice Director of War Zhao Yanzhao became Vice Director of the Secretariat, co-equal with the Secretariat as Rectifier.',
    idiomatic:
      'On wuwu Zong Chuke became director of the Secretariat; Xiao Zhi Zhong, attendant-in-chief; Wei Sili, minister of war with third-grade council standing; Cui Shi and Zhao Yanzhao entered as rectifiers of the Secretariat.',
  },
  s0252: {
    literal: 'On gengshen the sun was reddish purple and without light.',
    idiomatic: 'On gengshen the sun turned reddish purple and dim.',
  },
  s0253: {
    literal:
      'On wuyin Minister of Rites and concurrently Governor-General of Yangzhou and Duke of Cao Wei Wen was made Junior Tutor of the Heir Apparent, concurrently Governor-General of Yangzhou, co-equal with the Secretariat third grade.',
    idiomatic:
      'On wuyin Wei Wen, minister of rites and governor-general of Yangzhou, Duke of Cao, was made junior tutor of the heir apparent with the same Yangzhou command and council standing.',
  },
  s0254: {
    literal:
      'Vice Director of the Court of Imperial Sacrifices and Acting Vice Director of Personnel Zheng Yin was made co-equal with the Secretariat as Rectifier.',
    idiomatic:
      'Zheng Yin, vice director of imperial sacrifices and acting vice director of personnel, joined the council as rectifier.',
  },
  s0255: {
    literal:
      'Summer, fifth month, bingxu: Cui Shi and Zheng Yin were convicted of corruption; Shi was demoted to prefect of Xiangzhou, Yin to military adjutant of Jiangzhou.',
    idiomatic:
      'On bingxu of the fifth summer month Cui Shi and Zheng Yin were found corrupt; Shi was sent to Xiangzhou as prefect, Yin to Jiangzhou as adjutant.',
  },
  s0256: {
    literal: 'Sixth month, guichou: Venus appeared by day in the Well constellation.',
    idiomatic: 'On guichou of the sixth month Venus shone by day in the Well.',
  },
  s0257: {
    literal:
      'On gengzi, because many classics were missing, a search was ordered throughout the realm.',
    idiomatic:
      'On gengzi, with canonical texts widely lost, the throne ordered a empire-wide search.',
  },
  s0258: {
    literal:
      'On renyin, because of drought, he left the main hall, reduced his meals, and personally reviewed prisoners.',
    idiomatic:
      'On renyin, for drought, he quit the main hall, ate sparingly, and heard criminal cases in person.',
  },
  s0259: {
    literal: 'On guimao Right Director of the Secretariat Yang Zaisi died.',
    idiomatic: 'On guimao Yang Zaisi, right director of the Secretariat, died.',
  },
  s0260: {
    literal:
      'Seventh month, yimao new moon: General of the Garrison Army, Right Valiant Cavalry General, and concurrently in charge of the Astrological Service Xiao Zhi Zhong was banished to Liuzhou.',
    idiomatic:
      'On the yimao new moon of the seventh month Xiao Zhi Zhong, garrison general and right valiant cavalry commander, was banished to Liuzhou.',
  },
  s0261: {
    literal: 'On bingchen Suoge sent envoys to surrender.',
    idiomatic: 'On bingchen Suoge sent envoys to submit.',
  },
  s0262: {
    literal:
      'On xinyou the Emperor visited Pear Garden Pavilion and feasted scholar-officials.',
    idiomatic: 'On xinyou he banqueted scholar-officials at Pear Garden Pavilion.',
  },
  s0263: {
    literal:
      'The Empress memorialized that women who did not receive noble titles through husband or son should, like serving officials, be allowed to use their sons\' yin privilege; the request was granted.',
    idiomatic:
      'The empress asked that women without titles from husband or son might, like officeholders, use their sons\' yin privilege; the throne agreed.',
  },
  s0264: {
    literal:
      'On renxu outside Peace and Blessing Gate an unbounded Buddhist offering was set up; officials of third rank and above went to burn incense.',
    idiomatic:
      'On renxu a boundless Buddhist offering was held outside Peace and Blessing Gate; officials of third rank and above burned incense.',
  },
  s0265: {
    literal: 'On guihai he presided at Chengqing Hall and reviewed prisoners.',
    idiomatic: 'On guihai he reviewed prisoners at Chengqing Hall.',
  },
  s0266: {
    literal:
      'On renwu envoys were sent to invest Valiant Cavalry Grand General, concurrently Commandant of the Court of the Imperial Stud, and Prince of Jinhe Turgesh Shouzhong as Qaghan Submitting to Transformation.',
    idiomatic:
      'On renwu envoys invested Turgesh Shouzhong, valiant cavalry grand general and prince of Jinhe, as Qaghan Submitting to Transformation.',
  },
  s0267: {
    literal:
      'Eighth month, yiyou: Specially Advanced and Acting Director of the Secretariat Duke of Zhao Li Qiao was made specially advanced, co-equal with the Secretariat third grade; Attendant-in-Chief and Duke of Zan Xiao Zhi Zhong became Director of the Secretariat; Specially Advanced and Duke of Yun Wei Anshi became Attendant-in-Chief.',
    idiomatic:
      'On yiyou Li Qiao remained specially advanced with council standing; Xiao Zhi Zhong became director of the Secretariat; Wei Anshi, attendant-in-chief.',
  },
  s0268: {
    literal: 'On gengyin each circuit was to place one agricultural inspector.',
    idiomatic: 'On gengyin every circuit received one agricultural inspector.',
  },
  s0269: {
    literal:
      'The Tibetan king sent envoy Boluoxing with state gifts, the late king\'s dowry goods, and separate gifts for the inner palace, the Prince of An\'guo, the Prince of Xiang, and Princess Taiping.',
    idiomatic:
      'The Tibetan king sent Boluoxing with tribute, the late king\'s bridal goods, and separate gifts for the inner palace, the Prince of An\'guo, the Prince of Xiang, and Princess Taiping.',
  },
  s0270: {
    literal: 'On renchen ten envoys were dispatched to inspect the realm.',
    idiomatic: 'On renchen ten inspection envoys were sent through the empire.',
  },
  s0271: {
    literal: 'A broom star appeared in the Purple Palace.',
    idiomatic: 'A comet swept the Purple Palace constellation.',
  },
  s0272: {
    literal: 'Specially advanced officials were ordered to wear fish insignia.',
    idiomatic: 'Specially advanced officials were granted fish insignia.',
  },
  s0273: {
    literal: 'Dispersed-office holders wearing fish insignia began from this.',
    idiomatic: 'From this date dispersed-office holders also wore the fish tally.',
  },
  s0274: {
    literal:
      'On yiwei the Emperor in person escorted Shuofang commander Duke of Han Zhang Renyuan beyond Tonghua Gate, composing a preface and poems.',
    idiomatic:
      'On yiwei he personally escorted Zhang Renyuan, Shuofang commander and Duke of Han, beyond Tonghua Gate and composed preface and verse.',
  },
  s0275: {
    literal:
      'On yisi he visited Princess Anle\'s mountain pavilion, feasted scholar-officials, and granted silks in varying measure.',
    idiomatic:
      'On yisi he feasted scholars at Princess Anle\'s mountain pavilion and gave silks in varying measure.',
  },
  s0276: {
    literal:
      'Ninth month, renxu: he visited Nine-Bend Pavilion and feasted scholar-officials.',
    idiomatic: 'On renxu of the ninth month he feasted scholars at Nine-Bend Pavilion.',
  },
  s0277: {
    literal:
      'On wuchen Minister of Personnel and Duke of Huai Su Gui was made Right Director of the Secretariat, co-equal with the Secretariat third grade.',
    idiomatic:
      'On wuchen Su Gui, minister of personnel and Duke of Huai, became right director of the Secretariat with council standing.',
  },
  s0278: {
    literal:
      'Tenth month, winter, gengyin: he visited Princess Anle\'s new estate at Jincheng and feasted scholar-officials.',
    idiomatic:
      'On gengyin of the tenth winter month he banqueted scholars at Princess Anle\'s new Jincheng mansion.',
  },
  s0279: {
    literal:
      'Eleventh month, yichou: he personally sacrificed at the southern suburb; the Empress ascended the altar for the second offering; Left Director and Duke of Shu Wei Juyuan made the final offering.',
    idiomatic:
      'On yichou of the eleventh month he sacrificed at the southern suburb; the empress made the second offering; Wei Juyuan, left director and Duke of Shu, the final one.',
  },
  s0280: {
    literal:
      'A general amnesty was proclaimed; prisoners in custody and even the ten abominations were pardoned; miscellaneous offenders in exile were all sent home.',
    idiomatic:
      'He amnestied the realm, pardoning even those held for the ten capital crimes and returning miscellaneous exiles.',
  },
  s0281: {
    literal:
      'Capital officials of third rank and above received one noble rank; those of fourth rank and below one step; capital officials and those due to inherit frontier governorships of third and fifth rank had examinations reduced; the aged received patents by rank.',
    idiomatic:
      'Capital officials of third rank and above gained a noble rank, those below a step; heirs to frontier posts had examinations eased; the aged received honorary titles.',
  },
  s0282: {
    literal: 'Great revelry was granted for three days.',
    idiomatic: 'Three days of public revelry were granted.',
  },
  s0283: {
    literal: 'On renshen he visited Ziyu Ling\'s tomb.',
    idiomatic: 'On renshen he visited the tomb of Ziyu Ling.',
  },
  s0284: {
    literal:
      'On jiaxu Acting Third-Rank-in-the-Same-Office-as-the-Three-Dukes and Duke of Rui Dou Lu Qinwang died.',
    idiomatic: 'On jiaxu Dou Lu Qinwang, acting third grade and Duke of Rui, died.',
  },
  s0285: {
    literal:
      'The Tibetan king sent his minister Shangzan Tu to escort a bride in reverse direction.',
    idiomatic:
      'The Tibetan king sent minister Shangzan Tu to fetch a bride for the court.',
  },
  s0286: {
    literal:
      'Twelfth month, renxu: former Right Director of the Secretariat and Duke of Song Tang Xiujing was made Junior Tutor of the Heir Apparent, co-equal with the Secretariat third grade.',
    idiomatic:
      'On renxu of the twelfth month Tang Xiujing, former right director and Duke of Song, became junior tutor with council standing.',
  },
  s0287: {
    literal: 'On jiazi the Emperor visited the hot springs at Xinfeng.',
    idiomatic: 'On jiazi he went to the hot springs at Xinfeng.',
  },
  s0288: {
    literal:
      'On gengzi he visited Minister of War Wei Sili\'s estate, enfeoffed Sili as Duke of Carefree Wandering, composed preface and poems himself, then toured White Deer Abbey.',
    idiomatic:
      'On gengzi he visited Wei Sili\'s villa, created him Duke of Carefree Wandering, wrote preface and verse himself, and wandered White Deer Abbey.',
  },
  s0289: {
    literal:
      'On jiachen Xinfeng County was specially favored; the people were exempted from corvée for one year, and followers received one turn of merit.',
    idiomatic:
      'On jiachen Xinfeng was favored: its people were exempted from corvée for a year and those in the entourage gained one turn of merit.',
  },
  s0290: {
    literal: 'That day he visited Mount Li.',
    idiomatic: 'That day he went to Mount Li.',
  },
  s0291: {
    literal: 'On yisi he returned from the hot springs.',
    idiomatic: 'On yisi he returned from the springs.',
  },
  s0292: {
    literal:
      'On yiyou he ordered chief ministers of every office to go to Liquan Ward to watch the Pot-Hu King\'s cold-weather play.',
    idiomatic:
      'On yiyou he ordered every chief minister to Liquan Ward to watch the Pot-Hu King\'s cold-weather pageant.',
  },
  s0293: {
    literal:
      'Jinglong, fourth year, first month, spring, yimao: at the gate of Huadu Temple an unbounded great offering was set up.',
    idiomatic:
      'On yimao of the first spring month of the fourth year of Jinglong a great unbounded offering was held at Huadu Temple\'s gate.',
  },
  s0294: {
    literal:
      'On the Lantern Festival night the Emperor and Empress went in disguise to view the lamps, then visited Attendant-in-Chief Xiao Zhi Zhong\'s residence.',
    idiomatic:
      'On Lantern Festival night emperor and empress went out incognito to see the lamps and called at Xiao Zhi Zhong\'s house.',
  },
  s0295: {
    literal:
      'That night several thousand palace women were released to view the lamps, and many fled because of it.',
    idiomatic:
      'That night thousands of palace women were let out to see the lamps, and many used the chance to escape.',
  },
  s0296: {
    literal: 'On dingmao night he again went out incognito to view the lamps.',
    idiomatic: 'On the night of dingmao he again stole out to see the lamps.',
  },
  s0297: {
    literal:
      'On dingchou he appointed Left Valiant Cavalry Grand General and Protector of Heyuan Yang Ju as envoy escorting Princess Jincheng into Tibet.',
    idiomatic:
      'On dingchou Yang Ju, left valiant cavalry grand general and protector of Heyuan, was made envoy escorting Princess Jincheng to Tibet.',
  },
  s0298: {
    literal: 'On jimao he visited Shiping and sent Princess Jincheng home to Tibet.',
    idiomatic: 'On jimao he went to Shiping and sent Princess Jincheng on to Tibet.',
  },
  s0299: {
    literal:
      'Second month, renwu: Xianyang and Shiping were specially pardoned; Shiping was renamed Jincheng County.',
    idiomatic:
      'On renwu of the second month Xianyang and Shiping were specially pardoned and Shiping renamed Jincheng County.',
  },
  s0300: {
    literal:
      'He then visited the estate of Chang\'an magistrate Wang Guangfu on the north plain of Mawei.',
    idiomatic:
      'From there he visited the north-plain villa of Chang\'an magistrate Wang Guangfu at Mawei.',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/007.json';
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
if (trans.metadata.chapter !== '007') {
  throw new Error(`Expected chapter 007, got ${trans.metadata.chapter}`);
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
console.log('Applied', applied, 'translations (s0201–s0300)');
