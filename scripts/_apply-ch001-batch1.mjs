#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0001: {
    literal:
      'Gaozu Gaozu, Emperor Shenyao the Great Sage, Greatly Glorious and Filial, bore the surname Li; his taboo personal name was Yuan.',
    idiomatic:
      'Gaozu Gaozu, styled Emperor Shenyao the Great Sage, Greatly Glorious and Filial, was of the Li clan; his personal name was Yuan.',
  },
  s0002: {
    literal:
      'His forebears were men of Didao in Longxi, seventh-generation descendants of Lü Wu Zhaowang Hao.',
    idiomatic:
      'His ancestors came from Didao in Longxi—seventh in descent from Lü Wu Zhaowang Hao.',
  },
  s0003: {
    literal: 'Hao begat Xin; Xin begat Chong\'er, who served Wei as Administrator of Hongnong.',
    idiomatic:
      'Hao had a son Xin; Xin had a son Chong\'er, who served the Wei as Administrator of Hongnong.',
  },
  s0004: {
    literal:
      'Chong\'er begat Xi, who was a garrison commander at Jintun, leading the bold to hold Wuchuan, and there made his home.',
    idiomatic:
      'Chong\'er had a son Xi, who served as commandant of the Jintun garrison, leading local champions to secure Wuchuan, where the family settled.',
  },
  s0005: {
    literal: 'In the Yifeng era he was posthumously honored as Emperor Xuan.',
    idiomatic: 'During the Yifeng reign he was posthumously honored as Emperor Xuan.',
  },
  s0006: {
    literal: 'Xi begat Tianshi, who served Wei as a standard-bearer chief.',
    idiomatic: 'Xi had a son Tianshi, who served the Wei as a chief of standard-bearers.',
  },
  s0007: {
    literal: 'In the Datong era he was posthumously granted the office of Minister of Works.',
    idiomatic: 'In the Datong era he was posthumously granted the title Minister of Works.',
  },
  s0008: {
    literal: 'In the Yifeng era he was posthumously honored as Emperor Guang.',
    idiomatic: 'During the Yifeng reign he was posthumously honored as Emperor Guang.',
  },
  s0009: {
    literal:
      'The imperial grandfather, taboo name Hu, was Vice Minister of the Left in Later Wei and Duke of Longxi Commandery; with Zhou Wendi and the Grand Tutor Li Bi, the Grand Marshal Dugu Xin, and others he aided the founding by merit and was then styled among the "Eight Pillar Families," and was moreover granted the surname Daye.',
    idiomatic:
      'The Emperor\'s grandfather, personal name Hu, served as Vice Minister of the Left under the Later Wei and was enfeoffed as Duke of Longxi. With Zhou Wendi, Grand Tutor Li Bi, Grand Marshal Dugu Xin, and others he helped establish the dynasty by merit and was acclaimed as one of the "Eight Pillar Families"; he was also granted the surname Daye.',
  },
  s0010: {
    literal:
      'When Zhou received the abdication, he was posthumously enfeoffed as Duke of Tang and given the posthumous title Xiang.',
    idiomatic:
      'When the Zhou received the abdication, he was posthumously enfeoffed as Duke of Tang with the posthumous title Xiang.',
  },
  s0011: {
    literal: 'When Sui Wendi became regent, he restored the original surname.',
    idiomatic: 'When Sui Wendi became regent, the family surname was restored.',
  },
  s0012: {
    literal:
      'At the beginning of Wude he was posthumously honored as Emperor Jing, temple name Taizu, tomb Yongkang.',
    idiomatic:
      'At the opening of the Wude era he was posthumously honored as Emperor Jing, with temple name Taizu and tomb Yongkang.',
  },
  s0013: {
    literal:
      'The imperial father, taboo name Bing, was Zhou\'s General-in-Chief of Anzhou and Pillar General, succeeding as Duke of Tang, posthumous title Ren.',
    idiomatic:
      'The Emperor\'s father, personal name Bing, was General-in-Chief of Anzhou and a Pillar General under the Zhou, inherited the Dukedom of Tang, and bore the posthumous title Ren.',
  },
  s0014: {
    literal:
      'At the beginning of Wude he was posthumously honored as Emperor Yuan, temple name Shizu, tomb Xingning.',
    idiomatic:
      'At the opening of the Wude era he was posthumously honored as Emperor Yuan, with temple name Shizu and tomb Xingning.',
  },
  s0015: {
    literal:
      'Gaozu was born in Chang\'an in the first year of the Zhou Tianhe era; at seven he inherited the Dukedom of Tang.',
    idiomatic:
      'Gaozu was born in Chang\'an in the first year of Tianhe under the Northern Zhou; at age seven he inherited the Dukedom of Tang.',
  },
  s0016: {
    literal:
      'When grown he was bold and open, willful and sincere, generous and embracing the multitude; noble and base alike found favor with him.',
    idiomatic:
      'When he came of age he was bold and open-hearted, willful yet sincere, generous and inclusive; high and low alike took delight in him.',
  },
  s0017: {
    literal: 'When Sui received the abdication, he was appointed Thousand-Ox Guard attendant.',
    idiomatic: 'When the Sui received the abdication, he was appointed an attendant of the Thousand-Ox Guard.',
  },
  s0018: {
    literal:
      'Empress Dugu of Wendi was Gaozu\'s maternal aunt; for this he was especially cherished, and he was repeatedly transferred as prefect of Qiao, Long, and Qi.',
    idiomatic:
      'Empress Dugu, consort of Wendi, was Gaozu\'s aunt on his mother\'s side; he was therefore especially favored and rose through appointments as prefect of Qiao, Long, and Qi.',
  },
  s0019: {
    literal:
      'There was one Shi Shiliang, skilled at physiognomy, who said to Gaozu: "Your bone structure is extraordinary; you are certain to become a sovereign. I beg you cherish yourself—do not forget my humble words.',
    idiomatic:
      'A physiognomist named Shi Shiliang told Gaozu, "Your bone structure is extraordinary—you are destined to rule. Cherish yourself, and do not forget what I have said."',
  },
  s0020: {
    literal: '" Gaozu was quite proud on this account.',
    idiomatic: 'After this Gaozu grew quite proud.',
  },
  s0021: {
    literal:
      'At the beginning of the Daye era he was prefect of Xingyang and Loufan, then summoned as Vice Director of the Palace Internal.',
    idiomatic:
      'At the opening of the Daye era he served as prefect of Xingyang and Loufan, then was summoned as Vice Director of the Palace Internal.',
  },
  s0022: {
    literal: 'In the ninth year he was moved to Vice Minister of the Commandant of the Guards.',
    idiomatic: 'In the ninth year he was promoted to Vice Minister of the Commandant of the Guards.',
  },
  s0023: {
    literal: 'In the Liaodong campaign he supervised transport at Huaiyuan Garrison.',
    idiomatic: 'During the Liaodong campaign he oversaw supply transport at Huaiyuan Garrison.',
  },
  s0024: {
    literal:
      'When Yang Xuangan rebelled, an edict ordered Gaozu to ride post-horses to secure Honghua Commandery and concurrently oversee military affairs west of the passes.',
    idiomatic:
      'When Yang Xuangan rose in rebellion, an edict ordered Gaozu to ride post relays to secure Honghua Commandery and take concurrent command of military affairs west of the passes.',
  },
  s0025: {
    literal:
      'Gaozu had long been tested in central and outer posts and had steadily planted favor; now he drew in the bold, and many pledged themselves to him.',
    idiomatic:
      'Gaozu had served in posts throughout the empire and had long cultivated goodwill; now he gathered bold men, and many pledged their loyalty.',
  },
  s0026: {
    literal: 'At that time Yangdi was much given to suspicion, and men harbored fear.',
    idiomatic: 'At that time Emperor Yang was deeply suspicious, and men lived in fear.',
  },
  s0027: {
    literal:
      'There came an edict summoning Gaozu to the imperial camp; he fell ill and did not attend audience.',
    idiomatic:
      'An edict then summoned Gaozu to the imperial camp; he fell ill and did not present himself.',
  },
  s0028: {
    literal:
      'At that time his maternal nephew, the Lady Wang, was in the inner palace; the Emperor asked, "Why is your uncle so late?',
    idiomatic:
      'His maternal nephew Lady Wang was then in the inner palace. The Emperor asked her, "Why is your uncle so slow in coming?',
  },
  s0029: {
    literal: '" The Lady Wang answered that he was ill; the Emperor said, "Can he die?',
    idiomatic: '" She replied that he was ill. The Emperor said, "Can he simply die?"',
  },
  s0030: {
    literal:
      '" When Gaozu heard this he grew still more afraid, and therefore drowned himself in wine and paid bribes to blur his tracks.',
    idiomatic:
      'When Gaozu heard this he grew still more afraid; he drowned himself in wine and paid bribes to obscure his intentions.',
  },
  s0031: {
    literal:
      'In the eleventh year Yangdi visited Fenyang Palace and ordered Gaozu to go to Shanxi and Hedong to investigate, promote, and punish, and to pursue bandits.',
    idiomatic:
      'In the eleventh year Emperor Yang visited Fenyang Palace and ordered Gaozu to Shanxi and Hedong to conduct inspections and pursue bandits.',
  },
  s0032: {
    literal:
      'When the army halted at Longmen, the bandit chief Wu Duan\'er led several thousand men to press upon the city.',
    idiomatic:
      'When the army halted at Longmen, the bandit chief Wu Duan\'er led several thousand men against the city.',
  },
  s0033: {
    literal:
      'Gaozu with a dozen horsemen attacked them; of seventy arrows he loosed, each struck its target and the man fell; the bandits were routed in great disorder.',
    idiomatic:
      'Gaozu attacked with barely a dozen horsemen. Of seventy arrows he loosed, each found its mark and a man fell; the bandits broke and fled in disorder.',
  },
  s0034: {
    literal: 'In the twelfth year he was transferred to General of the Right Valiant Cavalry.',
    idiomatic: 'In the twelfth year he was appointed General of the Right Valiant Cavalry.',
  },
  s0035: {
    literal:
      'In the thirteenth year he was garrison commander of Taiyuan; the assistant prefect Wang Wei and the martial guard officer Gao Junya served as his deputies.',
    idiomatic:
      'In the thirteenth year he became garrison commander of Taiyuan, with Assistant Prefect Wang Wei and Martial Guard Officer Gao Junya as deputies.',
  },
  s0036: {
    literal:
      'Bandits rose everywhere like bees; communications with Jiangdu were cut. Taizong and the magistrate of Jinyang, Liu Wenjing, were first to plot and urge raising the righteous army.',
    idiomatic:
      'Bandits swarmed on every side; the road to Jiangdu was cut. Taizong and Liu Wenjing, magistrate of Jinyang, were the first to plot and urge an uprising.',
  },
  s0037: {
    literal:
      'Before long the garrison commandant of Mayi, Liu Wuzhou, seized Fenyang Palace and rose in rebellion; Taizong with Wang Wei and Gao Junya were about to gather troops to attack him.',
    idiomatic:
      'Soon Liu Wuzhou, garrison commandant of Mayi, seized Fenyang Palace and rebelled; Taizong, Wang Wei, and Gao Junya prepared to gather troops against him.',
  },
  s0038: {
    literal:
      'Gaozu then ordered Taizong, Liu Wenjing, and his retainers Sun Shunde and Liu Hongji each to recruit soldiers; within ten days their forces approached ten thousand, and he secretly sent messengers to summon the heir Jiancheng and Yuanji from Hedong.',
    idiomatic:
      'Gaozu ordered Taizong, Liu Wenjing, and retainers Sun Shunde and Liu Hongji each to raise troops; within ten days they mustered nearly ten thousand men, and he secretly summoned the heir Jiancheng and Yuanji from Hedong.',
  },
  s0039: {
    literal:
      'Wei and Junya, seeing the armies massed, feared Gaozu would turn against them; they grew suspicious together and asked Gaozu to pray for rain at the Jin Shrine, intending harm.',
    idiomatic:
      'Seeing the armies massed, Wei and Junya feared Gaozu would rebel; suspicious, they asked him to pray for rain at the Jin Shrine, planning treachery.',
  },
  s0040: {
    literal:
      'The district elder of Jinyang, Liu Shilong, learned of it and told Gaozu; Gaozu secretly made ready.',
    idiomatic:
      'Liu Shilong, district elder of Jinyang, learned of the plot and informed Gaozu, who quietly prepared his defenses.',
  },
  s0041: {
    literal:
      'On the day jiazi of the fifth month, Gaozu sat in council with Wei and Junya; Taizong secretly arrayed troops outside to guard against the unexpected.',
    idiomatic:
      'On jiazi, the fifth month, Gaozu held court with Wei and Junya while Taizong secretly deployed troops outside against any surprise.',
  },
  s0042: {
    literal:
      'He sent the Kaiyang Prefecture marshal Liu Zhenghui to accuse Wei and the others of treason, and at once beheaded them as a warning; then he raised the righteous army.',
    idiomatic:
      'He sent Liu Zhenghui, marshal of Kaiyang Prefecture, to accuse Wei and the others of treason, beheaded them as a warning, and raised the righteous army.',
  },
  s0043: {
    literal:
      'On jiaxu he sent Liu Wenjing as envoy to the Göktürk Shibi Qaghan, asking him to lead troops in support.',
    idiomatic:
      'On jiaxu he dispatched Liu Wenjing as envoy to the Göktürk Shibi Qaghan to request allied troops.',
  },
  s0044: {
    literal: 'On jiashen of the sixth month he ordered Taizong to lead troops against Xihe and take it.',
    idiomatic: 'On jiashen of the sixth month he ordered Taizong to lead troops west against Xihe and capture it.',
  },
  s0045: {
    literal:
      'On guisi he established the Grand General\'s Headquarters and set three armies, divided into left and right: the heir Jiancheng was made Duke of Longxi, Left Commander-in-Chief, with the left army under him;',
    idiomatic:
      'On guisi he established the Grand General\'s Headquarters with three armies, left and right: the heir Jiancheng became Duke of Longxi, Left Commander-in-Chief, commanding the left army;',
  },
  s0046: {
    literal:
      'Taizong was made Duke of Dunhuang, Right Commander-in-Chief, with the right army under him.',
    idiomatic:
      'Taizong became Duke of Dunhuang, Right Commander-in-Chief, commanding the right army.',
  },
  s0047: {
    literal:
      'Pei Ji was Chief Clerk of the Grand General\'s Headquarters, Liu Wenjing Marshal, Yin Kaishan of Shiai County a staff officer, Liu Zhenghui an aide, and Sun Shunde, Liu Hongji, Dou Cong, and others were made left and right army commanders.',
    idiomatic:
      'Pei Ji served as chief clerk, Liu Wenjing as marshal, Yin Kaishan of Shiai as staff officer, Liu Zhenghui as aide, and Sun Shunde, Liu Hongji, Dou Cong, and others as left and right army commanders.',
  },
  s0048: {
    literal: 'They opened the granaries to relieve the destitute; from near and far men answered the call.',
    idiomatic: 'They opened the granaries to relieve the poor, and men rallied from far and near.',
  },
  s0049: {
    literal:
      'On renzi of the seventh month, autumn, Gaozu led troops west to strike for Guanzhong, appointing Yuanji Garrison General of the North and Taiyuan garrison commander.',
    idiomatic:
      'On renzi in the seventh month of autumn, Gaozu marched west toward Guanzhong, appointing Yuanji Garrison General of the North and left him to hold Taiyuan.',
  },
  s0050: {
    literal: 'On guichou he set out from Taiyuan with thirty thousand troops.',
    idiomatic: 'On guichou he departed Taiyuan with an army of thirty thousand.',
  },
  s0051: {
    literal: 'On bingchen the army stopped at Lingshi County and made camp at Jiahu Fort.',
    idiomatic: 'On bingchen the army halted at Lingshi County and encamped at Jiahu Fort.',
  },
  s0052: {
    literal:
      'The Sui martial guard officer Song Laosheng garrisoned Huoyi to resist the righteous army.',
    idiomatic:
      'The Sui martial guard officer Song Laosheng held Huoyi to block the righteous army.',
  },
  s0053: {
    literal:
      'Rain fell in torrents for more than ten days; supplies could not be brought up; Gaozu ordered withdrawal, but Taizong urgently remonstrated and he stopped.',
    idiomatic:
      'Rain fell for more than ten days; supply lines failed. Gaozu ordered a retreat, but Taizong urgently remonstrated and he held his course.',
  },
  s0054: {
    literal:
      'An old man in white clothes came to the camp gate and said, "I am the envoy of Mount Huo come to address the Tang Emperor: \'When the rains cease in the eighth month, the road will emerge southeast of Huoyi—I shall aid your army.',
    idiomatic:
      'An old man in white came to the camp gate and said, "I am envoy of Mount Huo, sent to tell the Tang Emperor: \'When the rains end in the eighth month, the road will open southeast of Huoyi—I shall aid your army.',
  },
  s0055: {
    literal: '\'" Gaozu said, "This spirit did not deceive Zhao Wuxu—how would it betray me!',
    idiomatic: 'Gaozu said, "This spirit did not deceive Zhao Wuxu—surely it will not fail me!"',
  },
  s0056: {
    literal:
      '" On xinsi of the eighth month Gaozu led the army toward Huoyi, beheaded Song Laosheng, and pacified Huoyi.',
    idiomatic:
      '" On xinsi of the eighth month Gaozu advanced on Huoyi, beheaded Song Laosheng, and pacified the city.',
  },
  s0057: {
    literal: 'On bingxu he advanced and took Linfen and Jiang commanderies.',
    idiomatic: 'On bingxu he advanced and captured Linfen and Jiang commanderies.',
  },
  s0058: {
    literal:
      'On guisi he reached Longmen; the Göktürk Shibi Qaghan sent Kang Shaoli with five hundred troops and two thousand horses to join Liu Wenjing under his banner.',
    idiomatic:
      'On guisi he reached Longmen. The Göktürk Shibi Qaghan sent Kang Shaoli with five hundred men and two thousand horses to join Liu Wenjing.',
  },
  s0059: {
    literal:
      'The Sui Valiant Cavalry Grand General Qu Tu Tong held Hedong; the ford was cut off, and those in Guanzhong who wished to join the cause were much hindered.',
    idiomatic:
      'The Sui Valiant Cavalry Grand General Qu Tu Tong held Hedong; the crossing was blocked, and sympathizers in Guanzhong were greatly hindered.',
  },
  s0060: {
    literal:
      'People dwelling along the banks of the Hedong River vied to bring boats; without planning they came, several hundred in all before and after.',
    idiomatic:
      'People along the Hedong River vied to offer boats; hundreds came unbidden, one after another.',
  },
  s0061: {
    literal:
      'On renyin of the ninth month, Sun Hua, bandit chief of Fengyi, and Bai Xuandu, bandit chief of Tumen, each led their followers to submit, fully providing boats to await the righteous army.',
    idiomatic:
      'On renyin of the ninth month, Sun Hua of Fengyi and Bai Xuandu of Tumen each led their bands to submit, providing boats for the righteous army.',
  },
  s0062: {
    literal:
      'Gaozu ordered Hua, with the army commanders Wang Changqi and Liu Hongji, to lead troops across the river.',
    idiomatic:
      'Gaozu ordered Hua, with army commanders Wang Changqi and Liu Hongji, to lead troops across the river.',
  },
  s0063: {
    literal:
      'Qu Tu Tong sent his martial guard officer Sang Xianhe with several thousand men to raid Changqi by night; the righteous army fared ill.',
    idiomatic:
      'Qu Tu Tong sent his martial guard officer Sang Xianhe with several thousand men to raid Changqi by night; the righteous army suffered a setback.',
  },
  s0064: {
    literal:
      'Taizong with several hundred light horsemen struck their rear; Xianhe broke and scattered, and the righteous army rallied.',
    idiomatic:
      'Taizong struck their rear with several hundred light horsemen; Xianhe broke and fled, and the army rallied.',
  },
  s0065: {
    literal: 'On bingchen the Administrator of Fengyi, Xiao Zao, surrendered the commandery.',
    idiomatic: 'On bingchen Xiao Zao, Administrator of Fengyi, surrendered the commandery.',
  },
  s0066: {
    literal:
      'On wuwu Gaozu personally led the host to besiege Hedong; Qu Tu Tong held firm and would not come out, so he ordered an assault on the city, which failed and he withdrew.',
    idiomatic:
      'On wuwu Gaozu personally besieged Hedong. Qu Tu Tong held the city and would not emerge; an assault failed and Gaozu withdrew.',
  },
  s0067: {
    literal:
      'Civil and military officers and generals asked Gaozu to assume the post of Grand Commandant and add staff; he consented.',
    idiomatic:
      'Civil and military officers asked Gaozu to assume the post of Grand Commandant with a full staff; he agreed.',
  },
  s0068: {
    literal: 'Li Xiaochang, the magistrate of Huayin, came over with Yongfeng Granary.',
    idiomatic: 'Li Xiaochang, magistrate of Huayin, surrendered Yongfeng Granary.',
  },
  s0069: {
    literal: 'On gengshen Gaozu led the army across the river and lodged at Changchun Palace.',
    idiomatic: 'On gengshen Gaozu crossed the river with his army and encamped at Changchun Palace.',
  },
  s0070: {
    literal:
      'Gentry and commoners of the Three Qin came by the thousands each day; Gaozu treated them with courtesy exceeding their hopes, and all were glad.',
    idiomatic:
      'Gentry and commoners of the Three Qin arrived by the thousands daily; Gaozu received them with courtesy beyond their hopes, and all rejoiced.',
  },
  s0071: {
    literal:
      'On bingyin he sent the Duke of Longxi Jiancheng and Marshal Liu Wenjing to encamp at Yongfeng Granary and also hold Tong Pass against other bandits.',
    idiomatic:
      'On bingyin he sent Duke of Longxi Jiancheng and Marshal Liu Wenjing to hold Yongfeng Granary and guard Tong Pass against other raiders.',
  },
  s0072: {
    literal:
      'Taizong led Liu Hongji, Sun Shunde, and others—several tens of thousands in all—from north of the Wei to sweep the Three Metropolises; wherever they went, all submitted.',
    idiomatic:
      'Taizong led Liu Hongji, Sun Shunde, and others—tens of thousands in all—from north of the Wei to sweep the Three Metropolises; every place they reached submitted.',
  },
  s0073: {
    literal:
      'Gaozu\'s paternal cousin Shitong raised troops in E County; the Lady Chai raised troops at Sizhu; now both joined Taizong.',
    idiomatic:
      'Gaozu\'s paternal cousin Shitong had raised troops in E County, and Lady Chai at Sizhu; now both joined Taizong.',
  },
  s0074: {
    literal:
      'Qiu Shili of Mei County, Li Zhongwen, He Panren of Zhouzhi, and others combined several tens of thousands and came to surrender.',
    idiomatic:
      'The bandit chiefs Qiu Shili and Li Zhongwen of Mei, and He Panren of Zhouzhi, brought several tens of thousands to surrender.',
  },
  s0075: {
    literal:
      'On yihai he ordered Taizong to encamp at Acheng from the bend of the Wei, and the Duke of Longxi Jiancheng to advance from Xinfeng toward Bashang.',
    idiomatic:
      'On yihai he ordered Taizong to encamp at Acheng from the Wei bend, and Duke of Longxi Jiancheng to advance from Xinfeng toward Bashang.',
  },
  s0076: {
    literal:
      'Gaozu led the great army west from Xiaji, passing the touring palaces and parks of Yangdi; he abolished them all and sent the palace women back to their kin.',
    idiomatic:
      'Gaozu led the main army west from Xiaji, passing Yangdi\'s touring palaces and parks; he abolished them and sent the palace women home to their families.',
  },
  s0077: {
    literal: 'On xinsi in the tenth month, winter, he reached Changle Palace with two hundred thousand followers.',
    idiomatic: 'On xinsi in the tenth month of winter he reached Changle Palace with two hundred thousand men.',
  },
  s0078: {
    literal:
      'Wei Wensheng, Minister of Punishments and capital garrison commander, Yin Shishi, General of the Right Yiji Guard, and Hua Yi, Assistant Prefect of Jingzhao, held Prince Dai You to resist the righteous army.',
    idiomatic:
      'Wei Wensheng, Minister of Punishments and capital garrison commander, Yin Shishi of the Right Yiji Guard, and Hua Yi, Assistant Prefect of Jingzhao, held Prince Dai You and resisted the righteous army.',
  },
  s0079: {
    literal:
      'Gaozu sent envoys below the walls to announce his intent to restore the realm; again and again there was no reply.',
    idiomatic:
      'Gaozu sent envoys to the walls to proclaim his intent to restore the dynasty; again and again they received no answer.',
  },
  s0080: {
    literal: 'The generals firmly asked to besiege the city.',
    idiomatic: 'The generals urgently pressed to besiege the capital.',
  },
  s0081: {
    literal: 'On bingchen of the eleventh month they attacked and seized the capital.',
    idiomatic: 'On bingchen of the eleventh month they stormed and took the capital.',
  },
  s0082: {
    literal:
      'Wei Wensheng had already died of illness; for resisting the righteous army Yin Shishi, Hua Yi, and the others were beheaded.',
    idiomatic:
      'Wei Wensheng had already died of illness; Yin Shishi, Hua Yi, and others who had resisted the righteous army were beheaded.',
  },
  s0083: {
    literal:
      'On guihai he led the hundred officials, fully equipped with imperial regalia, to install Prince Dai You as Son of Heaven, honoring Yangdi from afar as Retired Emperor, granting a general amnesty, and changing the era name to Yining.',
    idiomatic:
      'On guihai he led the officials in full imperial regalia to install Prince Dai You as emperor, honoring Yangdi from afar as Retired Emperor, proclaiming a general amnesty, and changing the era name to Yining.',
  },
  s0084: {
    literal:
      'On jiazi the Sui emperor issued an edict granting Gaozu the provisional yellow axe, credentials as envoy holding the staff of authority, Grand Commandant over all military affairs within and without, and enfeoffing him as Prince of Tang with charge of all affairs of state.',
    idiomatic:
      'On jiazi the Sui emperor issued an edict granting Gaozu the provisional yellow axe, credentials as commissioner holding the staff of authority, and Grand Commandant over all military affairs, enfeoffing him as Prince of Tang with charge of state affairs.',
  },
  s0085: {
    literal: 'The Wude Hall became the prince\'s chancellery; edicts were changed to orders.',
    idiomatic: 'The Wude Hall became the princely chancellery; edicts were restyled as orders.',
  },
  s0086: {
    literal: 'The Duke of Longxi Jiancheng was made Heir of Tang;',
    idiomatic: 'Duke of Longxi Jiancheng was made Heir of Tang;',
  },
  s0087: {
    literal: 'Taizong was made Metropolitan Governor of Jingzhao and his fief was changed to Duke of Qin;',
    idiomatic: 'Taizong was made Metropolitan Governor of Jingzhao and enfeoffed as Duke of Qin;',
  },
  s0088: {
    literal: 'Yuanji of Guzang was enfeoffed as Duke of Qi.',
    idiomatic: 'Yuanji of Guzang was made Duke of Qi.',
  },
  s0089: {
    literal:
      'On guwei of the twelfth month the princely chancellery established officials from Chief Clerk and Registrar on down.',
    idiomatic:
      'On guwei of the twelfth month the princely chancellery established offices from chief clerk and registrar downward.',
  },
  s0090: {
    literal:
      'Xue Ju, bandit chief of Jincheng, raided Fufeng; he ordered Taizong as supreme commander to strike him.',
    idiomatic:
      'Xue Ju, bandit chief of Jincheng, raided Fufeng; Gaozu ordered Taizong as supreme commander to attack him.',
  },
  s0091: {
    literal:
      'He sent the Duke of Zhao Commandery Xiaogong to win over the south of the mountains; wherever he went, all submitted.',
    idiomatic:
      'He sent Duke of Zhao Commandery Xiaogong to win over the south of the mountains; every place submitted.',
  },
  s0092: {
    literal: 'On guisi Taizong routed Xue Ju\'s forces at Fufeng in a great victory.',
    idiomatic: 'On guisi Taizong won a great victory over Xue Ju\'s army at Fufeng.',
  },
  s0093: {
    literal:
      'Qu Tu Tong fled east from Tong Pass; Liu Wenjing and others pursued and captured him at Wenxiang, taking several tens of thousands captive.',
    idiomatic:
      'Qu Tu Tong fled east from Tong Pass; Liu Wenjing and others pursued and captured him at Wenxiang, taking tens of thousands prisoner.',
  },
  s0094: {
    literal: 'Xiao Yu, Administrator of Hechi, submitted the commandery.',
    idiomatic: 'Xiao Yu, Administrator of Hechi, surrendered the commandery.',
  },
  s0095: {
    literal:
      'On bingwu he sent Yunyang Magistrate Zhan Jun and Wugong District Director Li Zhonggun to sweep Ba and Shu and take them.',
    idiomatic:
      'On bingwu he sent Yunyang Magistrate Zhan Jun and Wugong District Director Li Zhonggun to subdue Ba and Shu.',
  },
  s0096: {
    literal:
      'In the first year of Wude, in the spring of the first month, on the day wuchen, the heir Jiancheng was made Pacification Grand General and Eastern Campaign Commander-in-Chief, Taizong his deputy; together they commanded seventy thousand troops to sweep the eastern capital.',
    idiomatic:
      'In the first year of Wude, in the spring of the first month, on the day wuchen, the heir Jiancheng was appointed Pacification Grand General and Eastern Campaign Commander-in-Chief, with Taizong as his deputy; together they led seventy thousand men against the eastern capital.',
  },
  s0097: {
    literal:
      'In the second month, Dou Jiande, bandit chief of Qinghe, presumptuously styled himself Prince of Changle.',
    idiomatic:
      'In the second month, Dou Jiande, bandit chief of Qinghe, presumptuously declared himself Prince of Changle.',
  },
  s0098: {
    literal: 'A man of Wuxing, Shen Faxing, raised troops and occupied Danyang.',
    idiomatic: 'Shen Faxing of Wuxing raised troops and seized Danyang.',
  },
  s0099: {
    literal:
      'On bingchen of the third month, the Right Garrison General Yuwen Huaji killed the Sui Retired Emperor at Jiangdu Palace, set up Prince Hao of Qin as emperor, and called himself Grand Chancellor.',
    idiomatic:
      'On bingchen of the third month, Right Garrison General Yuwen Huaji assassinated the Sui Retired Emperor at Jiangdu Palace, installed Prince Hao of Qin as emperor, and styled himself Grand Chancellor.',
  },
  s0100: {
    literal: 'Taizong\'s fief was changed to Duke of Zhao.',
    idiomatic: 'Taizong\'s enfeoffment was changed to Duke of Zhao.',
  },
};

const path = 'translations/current_translation_jiutangshu.json';
const data = JSON.parse(readFileSync(path, 'utf8'));
if (data.metadata.chapter !== '001') {
  throw new Error(`Expected chapter 001, got ${data.metadata.chapter}`);
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
