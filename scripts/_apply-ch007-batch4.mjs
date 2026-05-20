#!/usr/bin/env node
/** Batch 4: s0301–s0400 (Jiutangshu ch.007, Zhongzong close, historian's appraisal, Ruizong rise) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0301: {
    literal: 'On guiwei he returned from Jincheng.',
    idiomatic: 'On guiwei he came back from Jincheng.',
  },
  s0302: {
    literal:
      'On gengxu he ordered Secretariat attendants of fifth rank and above, civil and military officials of third rank and above, and all academicians to enter by the Fragrant Grove Gate, assemble at the Pear Garden ball ground, divide into teams for tug-of-war; the Emperor, Empress, and princesses went in person to watch.',
    idiomatic:
      'On gengxu he had fifth-rank Secretariat attendants, third-rank civil and military officers, and all academicians enter Fragrant Grove Gate to the Pear Garden grounds for tug-of-war; emperor, empress, and princesses watched in person.',
  },
  s0303: {
    literal:
      'Third month, jiayin: he visited Linwei Pavilion for the spring purification feast and granted officials willow wreaths to ward off evil.',
    idiomatic:
      'On jiayin of the third month he held the spring purification at Linwei Pavilion and gave officials willow wreaths against ill luck.',
  },
  s0304: {
    literal: 'On bingchen he toured and feasted at Peach Blossom Garden.',
    idiomatic: 'On bingchen he feasted at Peach Blossom Garden.',
  },
  s0305: {
    literal: 'On gengshen trees in the capital were glazed with ice; wells overflowed.',
    idiomatic:
      'On gengshen ice sheathed the trees in the capital and wells brimmed over.',
  },
  s0306: {
    literal: 'On renxu he granted palace-style caps to chief ministers and below.',
    idiomatic:
      'On renxu he gave palace-style caps to the chief ministers and those below.',
  },
  s0307: {
    literal:
      'Summer, fourth month, dinghai: the Emperor toured Cherry Orchard, led Secretariat officials of fifth rank and above, chiefs of offices, and academicians into Fragrant Grove Garden to taste cherries, ordered them to pick from horseback, and set out wine for pleasure.',
    idiomatic:
      'On dinghai of the fourth summer month he toured Cherry Orchard, brought fifth-rank Secretariat men, department heads, and scholars into Fragrant Grove to taste cherries from horseback, and made a revel of it.',
  },
  s0308: {
    literal:
      'On yiwei he visited Longqing Pond, built a pavilion of colored silks, feasted close ministers, sported in boats, then visited Minister of Rites Dou Xi\'s residence.',
    idiomatic:
      'On yiwei he went to Longqing Pond, hung a pavilion in colored silk, banqueted intimates, sported in boats, then called at Dou Xi\'s house.',
  },
  s0309: {
    literal:
      'Fifth month, xinyou: Director of the Palace Library and Prince of Guo Yong was re-enfeoffed Prince of Bian.',
    idiomatic:
      'On xinyou of the fifth month Yong, director of the palace library and Prince of Guo, was re-enfeoffed Prince of Bian.',
  },
  s0310: {
    literal:
      'On yichou the Empress requested that collateral princes be raised to third rank.',
    idiomatic:
      'On yichou the empress asked that collateral princes be raised to third rank.',
  },
  s0311: {
    literal:
      'On dingmao former Xuzhou military adjutant Yan Qinrong submitted a memorial saying the Empress interfered in state affairs, and Princess Anle, Wu Yanxiu, and Zong Chuke alike endangered the altars of soil and grain.',
    idiomatic:
      'On dingmao Yan Qinrong, former Xuzhou adjutant, memorialized that the empress meddled in rule and Princess Anle, Wu Yanxiu, and Zong Chuke together threatened the dynasty.',
  },
  s0312: {
    literal:
      'The Emperor in anger summoned Qinrong to court audience and had him beaten to death.',
    idiomatic:
      'The emperor in fury summoned Qinrong and had him beaten to death in the hall.',
  },
  s0313: {
    literal:
      'At that time Princess Anle wished the Empress to hold court and rule in her own name, and sought to be made heir apparent as "Grand Imperial Daughter"; from this she joined the Empress in plotting to advance poison.',
    idiomatic:
      'Princess Anle then wanted the empress to rule openly and herself named heir as "Grand Imperial Daughter"; with the empress she plotted poison.',
  },
  s0314: {
    literal:
      'Sixth month, renwu: the Emperor met poison and died in the Divine Dragon Hall, aged fifty-five.',
    idiomatic:
      'On renwu of the sixth month the emperor took poison and died in the Divine Dragon Hall, aged fifty-five.',
  },
  s0315: {
    literal: 'Death was kept secret; the Empress personally directed all government.',
    idiomatic:
      'The death was concealed while the empress seized every lever of government.',
  },
  s0316: {
    literal:
      'On guiwei Minister of Punishments Pei Tan and Minister of Works Zhang Xi were made co-equal with the Secretariat third grade, remaining as before at the eastern capital.',
    idiomatic:
      'On guiwei Pei Tan, minister of punishments, and Zhang Xi, minister of works, entered the council as third grade, still stationed at the eastern capital.',
  },
  s0317: {
    literal:
      'Minister of Personnel Zhang Xifu, Vice Director of the Secretariat Cen Yi, and Vice Director of Personnel Cui Shi were made co-equal with the Secretariat as Rectifiers.',
    idiomatic: 'Zhang Xifu, Cen Yi, and Cui Shi joined the council as rectifiers.',
  },
  s0318: {
    literal:
      'He also ordered Left Golden Guard Grand General Zhao Chengen and Right Gate Guard Grand General Xue Jian to lead five hundred troops to Junzhou to guard against Prince of Qiao Chongfu.',
    idiomatic:
      'He sent Zhao Chengen and Xue Jian with five hundred guards to Junzhou against Prince of Qiao Chongfu.',
  },
  s0319: {
    literal: 'Prince of Wen Chongmao was installed as crown prince.',
    idiomatic: 'Prince of Wen Chongmao was made crown prince.',
  },
  s0320: {
    literal:
      'On jiashen mourning was proclaimed in the Hall of Supreme Ultimate and the testamentary edict was announced.',
    idiomatic:
      'On jiashen mourning was opened in the Hall of Supreme Ultimate and the testament read aloud.',
  },
  s0321: {
    literal:
      'The Empress Dowager held court; a general amnesty was proclaimed and the era name changed to Tanglong.',
    idiomatic:
      'The empress dowager ruled from court, amnestied the realm, and renamed the era Tanglong.',
  },
  s0322: {
    literal:
      'Prisoners in custody whom regular amnesties never spared were all pardoned; long exiles might return to their villages; marks of crime and punishment were washed clean.',
    idiomatic:
      'Even prisoners regular amnesties never touched were freed; long exiles could go home; criminal marks were erased.',
  },
  s0323: {
    literal:
      'Officials within and without of third rank and above received one noble rank; those of fourth rank and below one step.',
    idiomatic:
      'Officials of third rank and above gained a noble rank, those of fourth rank and below a step.',
  },
  s0324: {
    literal: 'The Prince of An\'guo Li Dan was made Grand Tutor of the Heir Apparent.',
    idiomatic: 'Li Dan, Prince of An\'guo, was made grand tutor of the heir apparent.',
  },
  s0325: {
    literal:
      'Prince of Yong Shouli was advanced to Prince of Bin; Prince of Shouchun Chengi to Prince of Song; Director of the Imperial Clan Jin to Prince of Xing.',
    idiomatic:
      'Shouli became Prince of Bin; Chengi, Prince of Song; Jin, director of the imperial clan, Prince of Xing.',
  },
  s0326: {
    literal:
      'On dinghai the crown prince assumed the throne before the coffin, aged sixteen.',
    idiomatic:
      'On dinghai the crown prince took the throne before the coffin, aged sixteen.',
  },
  s0327: {
    literal:
      'Empress Dowager Wei held court and ruled in her own name; a general amnesty was proclaimed; even those regular amnesties never spared were pardoned.',
    idiomatic:
      'Empress Wei ruled in her own name, amnestied the realm, and pardoned even those whom ordinary amnesties excluded.',
  },
  s0328: {
    literal:
      'All military affairs within and without and among the imperial kin remained under Wei Wen\'s overall command.',
    idiomatic:
      'Wei Wen kept overall command of armies within and without and among the imperial kin.',
  },
  s0329: {
    literal:
      'At the time fifty thousand frontier soldiers were summoned and stationed in the capital in left and right camps; Wei nephews and sons-in-law each commanded them.',
    idiomatic:
      'Fifty thousand frontier troops were called in and split into left and right camps around the capital, each camp under a Wei nephew or son-in-law.',
  },
  s0330: {
    literal:
      'On renchen envoys were sent to inspect the circuits: Ji Chuna for Guannei, Zhang Jiafu for Hebei, Cen Yi for Henan.',
    idiomatic:
      'On renchen inspection envoys were sent: Ji Chuna to Guannei, Zhang Jiafu to Hebei, Cen Yi to Henan.',
  },
  s0331: {
    literal:
      'On gengzi night the Prince of Linzi raised troops, executed the Wei and Wu clans; all were exposed at the head outside Peace and Blessing Gate; Empress Dowager Wei was killed by the mutinous troops.',
    idiomatic:
      'On the night of gengzi Li Longji, Prince of Linzi, rose and slaughtered the Wei and Wu factions; their heads hung outside Peace and Blessing Gate, and Empress Wei died at the soldiers\' hands.',
  },
  s0332: {
    literal:
      'Ninth month, dingmao: the hundred officials proposed the posthumous title Emperor Xiaohé and temple name Zhongzong.',
    idiomatic:
      'In the ninth month, on dingmao, the court gave the posthumous title Emperor Xiaohé and temple name Zhongzong.',
  },
  s0333: {
    literal: 'Eleventh month, jiyou: he was buried at Ding Mausoleum.',
    idiomatic: 'On jiyou of the eleventh month he was buried at Ding Mausoleum.',
  },
  s0334: {
    literal:
      'Second month of the thirteenth year of Tianbao, the posthumous title was changed to Emperor Dahe Dasheng Dazhao Xiaohé.',
    idiomatic:
      'In the second month of Tianbao 13 his posthumous title was raised to Emperor Dahe Dasheng Dazhao Xiaohé.',
  },
  s0335: {
    literal:
      '【Historian\'s appraisal】 The historian says: An upright man can restrain a greedy one by law; a worthy minister cannot support a feeble sovereign.',
    idiomatic:
      '【Historian\'s appraisal】 The historian says: Law in the hands of the upright can bind the greedy, but no worthy minister can shore up a weak throne.',
  },
  s0336: {
    literal:
      'Truly, when the will is dimmed by those near at hand and the heart holds no far design, one does not know the hardship of founding, but only grasps the pleasures of the moment.',
    idiomatic:
      'When the will is dulled by favorites and the heart has no distant design, the hardship of founding is forgotten and only the day\'s pleasures are seized.',
  },
  s0337: {
    literal:
      'Emperor Xiaohé, from taking the throne at the royal screen to removal to Fangling, in rugged lands of miasma and plague, in the trials of close imprisonment—',
    idiomatic:
      'Emperor Xiaohé, from the throne to exile at Fangling, knew rugged miasma country and the bitterness of close imprisonment—',
  },
  s0338: {
    literal:
      'therefore Zhang Hanyang hesitated at restoration, Di Liang Gong wept as he presented his memorial, and he was able to return alive—not by his own strength alone.',
    idiomatic:
      'Zhang Hanyang then wavered at restoration, Di Renjie pleaded through tears, and the emperor lived to return—hardly by his own power alone.',
  },
  s0339: {
    literal:
      'When the golden tiger was washed away and he again grasped the jade axis, he could not blame himself before the ten thousand directions, but wandered further and ruined the eight policies.',
    idiomatic:
      'When the Wu usurpation ended and he again held the jade scepter, he would not confess fault to the realm but roamed on, wrecking the eight great duties of rule.',
  },
  s0340: {
    literal:
      'He indulged a lustful wife\'s faction, and then Zhu and Yu contended for power;',
    idiomatic:
      'He let a wanton consort fan her faction until Zhu and Yu wrestled for the scale;',
  },
  s0341: {
    literal:
      'he trusted a sorcerous woman to twist authority, and then the human relations lost their order.',
    idiomatic: 'he trusted a witch-woman to bend the law until human order itself broke.',
  },
  s0342: {
    literal:
      'Huan and Jing were ruined by this; Jiemin therefore raised arms—yet in the end, though he held the sovereign\'s person, he could not escape the calamity of bowed brows.',
    idiomatic:
      'Huan and Jing fell to it; Jiemin took up arms—yet though he wore the crown he could not escape death at his consort\'s hands.',
  },
  s0343: {
    literal:
      'Compared with the Hui and Ying of Han and Jin he was the better man, yet unless a world-ordering talent followed, the virtue of earth would depart.',
    idiomatic:
      'Beside the Hui and Ying of Han and Jin he shines, yet without a world-ordering heir the Mandate of earth would have slipped away.',
  },
  s0344: {
    literal:
      'Ruizong Emperor Ruizong the Mysterious True Great Sage Great Prosperous Filial, taboo name Dan, was the eighth son of Gaozong and the younger brother of Zhongzong by the same mother.',
    idiomatic:
      'Ruizong, the Mysterious True Great Sage Great Prosperous Filial Emperor, taboo name Dan, was Gaozong\'s eighth son and Zhongzong\'s younger brother by the same mother.',
  },
  s0345: {
    literal: 'Longshuo, second year, sixth month, jiwei: he was born in Chang\'an.',
    idiomatic:
      'In the sixth month of the second year of Longshuo, on jiwei, he was born in Chang\'an.',
  },
  s0346: {
    literal:
      'That year he was enfeoffed Prince of Yin, holding from afar the governorship-general of Ji and the qaghanate of the Shanyu, and Grand General of the Right Golden Guard.',
    idiomatic:
      'That year he was made Prince of Yin, titular governor-general of Ji and qaghan of the Shanyu, and right golden guard grand general.',
  },
  s0347: {
    literal:
      'When grown he was modest, respectful, filial, and friendly, fond of learning, skilled in draft cursive script, and especially loved books on characters and glosses.',
    idiomatic:
      'As he grew he was modest, filial, and fond of learning, skilled in cursive script and especially devoted to philology.',
  },
  s0348: {
    literal: 'First year of Qianfeng: he was transferred to Prince of Yu.',
    idiomatic: 'In the first year of Qianfeng he was transferred to Prince of Yu.',
  },
  s0349: {
    literal: 'Second year of Zongzhang: he was transferred to Prince of Ji.',
    idiomatic: 'In the second year of Zongzhang he was made Prince of Ji.',
  },
  s0350: {
    literal: 'At first his name was Xulun; at this time the character Xu was removed.',
    idiomatic: 'He had first been named Xulun; now the character Xu was dropped.',
  },
  s0351: {
    literal:
      'Second year of Shangyuan: he was transferred to Prince of Xiang and appointed Grand General of the Right Guard.',
    idiomatic:
      'In the second year of Shangyuan he became Prince of Xiang and right guard grand general.',
  },
  s0352: {
    literal: 'Third year of Yifeng: he was made Governor of Luo;',
    idiomatic: 'In the third year of Yifeng he was made governor of Luo;',
  },
  s0353: {
    literal: 'his name was changed to Dan and he was transferred to Prince of Yu.',
    idiomatic: 'renamed Dan, and transferred to Prince of Yu.',
  },
  s0354: {
    literal:
      'First year of Sisheng: Wu Zetian held court; Zhongzong was deposed to Prince of Luling and Yu Wang was installed as emperor, while she still ruled in her own name.',
    idiomatic:
      'In the first year of Sisheng Wu Zetian ruled from court, deposed Zhongzong to Prince of Luling, and set Yu Wang on the throne while she still held power.',
  },
  s0355: {
    literal:
      'When she changed the dynasty, the state name became Zhou; the Emperor was reduced to Imperial Heir and ordered to use his former name Lun, moved to the eastern palace, his rites matching the crown prince\'s.',
    idiomatic:
      'When she declared Zhou, the emperor became imperial heir, took back the name Lun, moved to the eastern palace, and was treated as crown prince.',
  },
  s0356: {
    literal: 'First year of Shenglí: Zhongzong returned from Fangling.',
    idiomatic: 'In the first year of Shenglí Zhongzong returned from Fangling.',
  },
  s0357: {
    literal:
      'The Emperor repeatedly claimed illness and did not attend court, asking to yield the throne to Zhongzong.',
    idiomatic:
      'Li Dan repeatedly pleaded illness, stayed from court, and asked to yield to Zhongzong.',
  },
  s0358: {
    literal:
      'Wu Zetian then installed Zhongzong as crown prince, enfeoffed the Emperor as Prince of Xiang, again changed his name to Dan, and appointed him Right Commander of the Crown Prince\'s Guard.',
    idiomatic:
      'Wu Zetian made Zhongzong crown prince, created Li Dan Prince of Xiang, renamed him Dan, and made him right commander of the crown prince\'s guard.',
  },
  s0359: {
    literal:
      'In the Chang\'an era he was appointed Grand Tutor and Grand General of the Right Yulin Guard.',
    idiomatic:
      'In the Chang\'an years he became grand tutor and right Yulin grand general.',
  },
  s0360: {
    literal:
      'From Wu Zetian\'s first holding of court through the change of dynasty, the royal house suffered repeated upheavals; the Emperor each time was respectful, frugal, and yielding, and in the end escaped harm.',
    idiomatic:
      'Through Wu Zetian\'s rise and the Zhou revolution the house of Li shook again and again; each time Li Dan bowed, yielded, and in the end survived.',
  },
  s0361: {
    literal:
      'First year of Shenlong: for the merit of executing Zhang Yizhi and his brothers he was advanced to Prince of An\'guo, made Grand Marshal, and given added fief.',
    idiomatic:
      'In the first year of Shenlong, for killing Zhang Yizhi and his brothers, he was advanced to Prince of An\'guo, made grand marshal, and given added fief.',
  },
  s0362: {
    literal:
      'That year he was installed as Imperial Younger Brother; he firmly declined and did not accept.',
    idiomatic:
      'That year he was offered the title imperial younger brother and firmly refused.',
  },
  s0363: {
    literal:
      'First year of Jingyun, summer, sixth month of Jinglong\'s fourth year: Zhongzong died; Empress Wei held court, brought in her faction, divided grasp of power, and because the Emperor\'s repute had long been high, secretly plotted harm.',
    idiomatic:
      'In the sixth month of Jinglong 4, in the first year of Jingyun, Zhongzong died; Empress Wei ruled, packed office with her kin, and, fearing Li Dan\'s standing, plotted against him in secret.',
  },
  s0364: {
    literal:
      'On gengzi night Li Longji, with Xue Chongjian son of Princess Taiping, former Chaoyi county magistrate Liu Youqiu, long-serving guard Ma Sizong, park director Zhong Shaojing, and others led troops into the Northern Army, executed Wei Wen, Ji Chuna, Zong Chuke, Wu Yanxiu, Ma Qinke, Ye Jingneng, Zhao Lüwen, Yang Jun, and the rest; all Wei and Wu partisans were put to death.',
    idiomatic:
      'On the night of gengzi Li Longji, with Xue Chongjian, Liu Youqiu, Ma Sizong, Zhong Shaojing, and others, stormed the Northern Army, killed Wei Wen, Ji Chuna, Zong Chuke, Wu Yanxiu, and the rest, and wiped out the Wei and Wu factions.',
  },
  s0365: {
    literal:
      'On xinchou the Emperor, supporting the young emperor, mounted Peace and Blessing Gate tower to reassure the people; a general amnesty was proclaimed; prisoners whom regular amnesties never spared were all pardoned.',
    idiomatic:
      'On xinchou Li Dan, supporting the boy on the throne, mounted Peace and Blessing Gate to calm the people and amnestied even those whom ordinary amnesties excluded.',
  },
  s0366: {
    literal:
      'Civil and military officials within and without of third rank and above received one noble rank; those of fourth rank and below one step; imperial kin of third rank and above two steps, of fourth rank and below and other kin three turns of merit; the people\'s land tax for the year was halved.',
    idiomatic:
      'Third-rank officials and above gained a noble rank, those below a step; close kin of third rank and above two steps; other kin three turns of merit; the year\'s land tax was halved for the people.',
  },
  s0367: {
    literal:
      'The Prince of Linzi was advanced to Prince of Ping; Xue Chongjian was made Prince of Lijie.',
    idiomatic: 'Li Longji became Prince of Ping; Xue Chongjian was made Prince of Lijie.',
  },
  s0368: {
    literal:
      'Zhong Shaojing was made Vice Director of the Secretariat; Liu Youqiu Secretariat Drafting Officer; both shared in secrets of state and received added fief.',
    idiomatic:
      'Zhong Shaojing became vice director of the Secretariat; Liu Youqiu, drafting officer; both entered the inner council and gained added fief.',
  },
  s0369: {
    literal: 'The rest received enfeoffment and reward in varying measure.',
    idiomatic: 'Others were enfeoffed and rewarded in varying measure.',
  },
  s0370: {
    literal:
      'Envoys were sent on separate routes to proclaim the news, still ordered to go to Junzhou to comfort Prince of Qiao.',
    idiomatic:
      'Envoys carried the proclamation on every road and were still sent to Junzhou to comfort Prince of Qiao.',
  },
  s0371: {
    literal:
      'On renyin Left Thousand-Oxen Captain Prince of Song Chengi was made Left Guard Grand General; Assistant Director of Agriculture with concurrent regular appointment Prince of Hengyang Chengyi Right Guard Grand General; Assistant Director of the Grand Treasury with concurrent regular appointment Prince of Baling Longfan Left Yulin Grand General; Assistant Director of the Imperial Stud with concurrent regular appointment Prince of Pengcheng Longye Right Yulin Grand General.',
    idiomatic:
      'On renyin Chengi became left guard grand general; Chengyi, right guard; Longfan, left Yulin; Longye, right Yulin.',
  },
  s0372: {
    literal:
      'Vice Director of the Yellow Gate Li Rizhi was made co-equal with the Secretariat third grade.',
    idiomatic:
      'Li Rizhi, vice director of the Yellow Gate, entered the council as third grade.',
  },
  s0373: {
    literal:
      'On guimao Prince of Ping, palace attendant in charge of inner and outer stud farms, inspecting general of the Right Dragon Martial Army, and still commanding the left and right Ten Thousand Horse wings, was made co-equal with the Secretariat third grade.',
    idiomatic:
      'On guimao Li Longji, Prince of Ping, with stud, dragon martial, and Ten Thousand Horse commands, joined the council as third grade.',
  },
  s0374: {
    literal:
      'Vice Director of the Secretariat and Duke of Yingchuan Zhong Shaojing was made Director of the Secretariat.',
    idiomatic:
      'Zhong Shaojing, vice director and Duke of Yingchuan, became director of the Secretariat.',
  },
  s0375: {
    literal:
      'Director of the Secretariat and Duke of Zan Xiao Zhi Zhong was made Prefect of Xuzhou; Minister of War and Duke of Carefree Wandering Wei Sili Prefect of Songzhou; Vice Director of the Secretariat Zhao Yanzhao Prefect of Jiangzhou—Xiao, Wei, and Zhao were specially placed.',
    idiomatic:
      'Xiao Zhi Zhong was sent to Xuzhou, Wei Sili to Songzhou, Zhao Yanzhao to Jiangzhou—posts made for them alone.',
  },
  s0376: {
    literal: 'Minister of Personnel Zhang Jiafu was executed at Huaizhou.',
    idiomatic: 'Zhang Jiafu, minister of personnel, was executed at Huaizhou.',
  },
  s0377: {
    literal:
      'That day the dukes and hundred officials memorialized together: the state faced many calamities and should install a mature sovereign; because the Emperor was where all eyes turned, they asked that he immediately take the supreme seat.',
    idiomatic:
      'That day the nobles and officials memorialized: the realm was in peril and needed a seasoned ruler; all eyes were on Li Dan, and they begged him to mount the throne at once.',
  },
  s0378: {
    literal:
      'On jiachen the young emperor\'s edict said: "From antiquity emperors and kings have had their mandates; brothers succeeding one another is preserved in the rites.',
    idiomatic:
      'On jiachen the boy emperor\'s edict ran: "Since antiquity rulers have borne a mandate; brother succeeding brother stands in the rites.',
  },
  s0379: {
    literal:
      'I, being young and small, have met family hardship; facing this burden my understanding does not reach the way of rule.',
    idiomatic:
      'I am young and small and have met a house in grief; set on this seat I do not yet know how to govern.',
  },
  s0380: {
    literal:
      'The four seas stretch vast—whom shall they belong to? The piled blessing of many sages seems about to fall to earth.',
    idiomatic:
      'The four seas are vast—whom shall they obey? The piled blessing of many sages seems ready to fall.',
  },
  s0381: {
    literal:
      'The royal house has many woes; righteousness chooses the elder lord. I wish with you lords to exalt a bright sage.',
    idiomatic:
      'The house of Li is in peril; righteousness demands the elder. I wish with you, lords, to raise a bright sage.',
  },
  s0382: {
    literal:
      'My uncle the Prince of Xiang, son of Gaozong, once yielded the realm to the former emperor; filial, friendly, broad, and simple, his faith shines on the myriad people.',
    idiomatic:
      'My uncle the Prince of Xiang, Gaozong\'s son, once yielded the realm to my father; filial, gentle, and trusted by the people.',
  },
  s0383: {
    literal:
      'At the beginning of Shenlong there was already a clear decree to install the imperial younger brother as deputy ruler.',
    idiomatic:
      'At Shenlong\'s beginning a clear decree already named him imperial younger brother and deputy ruler.',
  },
  s0384: {
    literal:
      'The Prince of Wang firmly declined and the investiture was not carried out, so the eastern palace stood empty for years.',
    idiomatic:
      'He firmly declined and the seal was never given, so the eastern palace stood empty for years.',
  },
  s0385: {
    literal:
      'The imperial robe hung in the hour of chen; calamity changed in sudden haste; the rear palace ruled in her own name and plotted to set a child on the throne.',
    idiomatic:
      'The robe was torn in the hour of chen; disaster struck in haste; the rear palace ruled and meant to set a child on the throne.',
  },
  s0386: {
    literal: 'Reverently holding the former wish, I wish to follow reason\'s command.',
    idiomatic: 'Holding to the former wish, I mean to follow reason\'s command.',
  },
  s0387: {
    literal:
      'Above to declare Heaven and the sages\' intent; below to settle the heart of the black-haired people;',
    idiomatic:
      'Above to declare Heaven\'s will and the sages\' intent; below to settle the people\'s hearts;',
  },
  s0388: {
    literal: 'bowing to the charts and apocrypha, looking up to the ancestors\' glory.',
    idiomatic:
      'I bow to the charts and apocrypha and look up to the glory of the ancestors.',
  },
  s0389: {
    literal:
      'Choosing this day, I ask my uncle the Prince of Xiang to assume the imperial seat.',
    idiomatic: 'On this day I ask my uncle the Prince of Xiang to take the throne.',
  },
  s0390: {
    literal: 'I withdraw to guard my original fief and return to my old residence.',
    idiomatic: 'I withdraw to my fief and return to my old residence.',
  },
  s0391: {
    literal:
      'All you ministers, respect my words, help fulfill this heaven-and-man season of rest, and brighten our Tang\'s achievement.',
    idiomatic:
      'All you ministers, heed my words, help fulfill this season of heaven and man, and brighten the achievement of Tang.',
  },
  s0392: {
    literal: 'Proclaim far and near and let all hear and know."',
    idiomatic: 'Let this be proclaimed far and near."',
  },
  s0393: {
    literal:
      'The Prince of Xiang submitted a memorial declining, saying: "The altars\' affair is weighty, the house and state are deep in my heart; I executed great rebels and supported the successor lord.',
    idiomatic:
      'Li Dan memorialized his refusal: "The altars weigh heavy on my heart; I slew great rebels and upheld the successor.',
  },
  s0394: {
    literal:
      'Now I receive the imperial command and am rashly pushed to the imperial pinnacle.',
    idiomatic: 'Now I receive the command and am rashly pushed to the pinnacle.',
  },
  s0395: {
    literal: 'In my emptiness and shallowness I dare not reverently accept.',
    idiomatic: 'I am empty and shallow and dare not accept with reverence.',
  },
  s0396: {
    literal: 'Turning in shock and trembling, I cannot bear the grief and choke!"',
    idiomatic: 'Turning in shock and trembling, I cannot bear the grief!"',
  },
  s0397: {
    literal:
      'The edict answered: "The great treasure of the imperial pole is the utmost public good under heaven; for a king to face it is mostly not by his own wish.',
    idiomatic:
      'The reply edict said: "The great treasure of the pole is the utmost public good under heaven; a king takes it mostly not by his own wish.',
  },
  s0398: {
    literal:
      'You, Prince, have the former sage\'s old intent; the black-haired people look up to you; dragon light at the purple court should fulfill the succession\'s hope.',
    idiomatic:
      'You, prince, hold the former sage\'s intent; the people look up to you; let dragon light at the purple court fulfill what all await.',
  },
  s0399: {
    literal: 'Please follow the former command and do not again decline."',
    idiomatic: 'Follow the former command and do not decline again."',
  },
  s0400: {
    literal: 'Thereupon the young emperor withdrew to a separate palace.',
    idiomatic: 'Thereupon the boy emperor withdrew to a separate palace.',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/007.json';
const TRANS_PATH = 'translations/current_translation_jiutangshu.json';
const START = 301;
const END = 400;

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
console.log('Applied', applied, 'translations (s0301–s0400)');
