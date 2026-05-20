#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0001: {
    literal:
      'In the fourth year of Zhenguan, in the spring of the first month, on yihai, Li Jing, commander-in-chief of the Dingxiang campaign, routed the Turks, captured Sui Empress Xiao and Yangdi\'s grandson Zhengdao, and sent them to the capital.',
    idiomatic:
      'In the fourth year of Zhenguan, on yihai of the first spring month, Li Jing, commander of the Dingxiang campaign, crushed the Turks, took Sui Empress Xiao and Yangdi\'s grandson Zhengdao prisoner, and sent them to Chang\'an.',
  },
  s0002: {
    literal: 'On guisi, fire broke out in the north courtyard of Wude Hall.',
    idiomatic: 'On guisi a fire consumed the north courtyard of Wude Hall.',
  },
  s0003: {
    literal: 'In the second month, on jihai, he visited the hot springs.',
    idiomatic: 'On jihai of the second month the emperor went to the hot springs.',
  },
  s0004: {
    literal:
      'On jiachen, Li Jing again defeated the Turks at Yinshan; Illig Khagan fled far with a light escort.',
    idiomatic:
      'On jiachen Li Jing routed the Turks again at Yinshan, and Illig Khagan fled into the distance with only a few horsemen.',
  },
  s0005: {
    literal: 'On bingwu, he returned from the hot springs.',
    idiomatic: 'On bingwu he returned from the hot springs.',
  },
  s0006: {
    literal: 'On jiayin, a great amnesty was proclaimed and communal feasting was granted for five days.',
    idiomatic: 'On jiayin he proclaimed a general amnesty and granted five days of public feasting.',
  },
  s0007: {
    literal:
      'Dai Zhou, Minister of Popular Affairs, while retaining that office checked and supervised the Ministry of Personnel and took part in court governance.',
    idiomatic:
      'Dai Zhou, minister of popular affairs, was ordered to supervise the Ministry of Personnel in addition to his own post and to join in deliberating state affairs.',
  },
  s0008: {
    literal:
      'Xiao Yu, Director of Imperial Sacrifices, became Censor-in-Chief and deliberated court affairs with the chief ministers.',
    idiomatic:
      'Xiao Yu, director of imperial sacrifices, was made censor-in-chief and joined the chief ministers in governing.',
  },
  s0009: {
    literal:
      'Wen Yanbo, Censor-in-Chief and Duke of Xihe Commandery, became Secretariat Director.',
    idiomatic:
      'Wen Yanbo, censor-in-chief and Duke of Xihe, was appointed director of the Secretariat.',
  },
  s0010: {
    literal:
      'In the third month, on gengchen, Zhang Baoxiang, deputy commander of the Datong campaign, captured Illig Khagan alive and presented him at the capital.',
    idiomatic:
      'On gengchen of the third month Zhang Baoxiang, deputy commander on the Datong front, took Illig Khagan alive and brought him to Chang\'an.',
  },
  s0011: {
    literal: 'On jiashen, Du Ruhui, Right Vice Director of the Masters of Writing and Duke of Cai, died.',
    idiomatic: 'On jiashen Du Ruhui, right vice director and Duke of Cai, died.',
  },
  s0012: {
    literal: 'On jiawu, the capture of Illig was announced at the Imperial Ancestral Temple.',
    idiomatic: 'On jiawu the court reported Illig\'s capture to the ancestral temple.',
  },
  s0013: {
    literal:
      'In the fourth month of summer, on dingyou, he took his seat at Shuntian Gate while military officers led Illig forward to present the victory.',
    idiomatic:
      'On dingyou of the fourth summer month he sat at Shuntian Gate as officers marched Illig forward to present the triumph.',
  },
  s0014: {
    literal:
      'Thereafter the tribes of the northwest all asked to honor him with the title "Heaven Khagan"; he then sent imperial writs to invest their chieftains, who might also bear that title.',
    idiomatic:
      'From then on the northwestern peoples asked to call him Heaven Khagan; he sent imperial patents to their rulers, who might use the title alongside their own.',
  },
  s0015: {
    literal: 'In the seventh month of autumn, on the jiazi new moon, there was a solar eclipse.',
    idiomatic: 'On the jiazi new moon of the seventh autumn month the sun was eclipsed.',
  },
  s0016: {
    literal: 'The emperor said to Fang Xuanling and Xiao Yu, "What sort of ruler was Sui Wendi?"',
    idiomatic: 'The emperor asked Fang Xuanling and Xiao Yu, "What manner of ruler was Emperor Wen of Sui?"',
  },
  s0017: {
    literal:
      'They replied, "He restrained himself and returned to ritual propriety, labored diligently over government and policy, and at each court session sometimes sat until the sun had declined.',
    idiomatic:
      'They answered, "He disciplined himself and honored the rites, toiled over policy, and often held court until the sun was low in the west.',
  },
  s0018: {
    literal: 'Officials of the fifth rank and above he summoned to discuss affairs.',
    idiomatic: 'He called in officials of the fifth rank and above to debate affairs of state.',
  },
  s0019: {
    literal: 'Palace guards passed meals hand to hand while they ate.',
    idiomatic: 'Palace guards ate their meals in relays, passing food along the line.',
  },
  s0020: {
    literal:
      'Though not by nature benevolent and perspicacious, he was still a ruler who strove to refine his spirit."',
    idiomatic:
      'He was not by nature humane and luminous, yet he was a ruler who drove himself to excel."',
  },
  s0021: {
    literal: 'The emperor said, "You grasp one part and do not know the second.',
    idiomatic: 'The emperor said, "You see one side of him, not the other.',
  },
  s0022: {
    literal: 'This man\'s nature was excessively keen in scrutiny yet his mind was not clear.',
    idiomatic: 'His nature was piercingly suspicious, yet his judgment was clouded.',
  },
  s0023: {
    literal:
      'When the mind is dark, illumination cannot reach everywhere; when scrutiny is extreme, one grows doubtful of all things.',
    idiomatic:
      'A dark mind cannot see far; excessive scrutiny breeds doubt in everything.',
  },
  s0024: {
    literal:
      'Because he had won the throne by deceiving the orphaned and widowed, he believed his subordinates could not be trusted; he decided every matter himself, and though he wore out spirit and body, he could not wholly accord with reason.',
    idiomatic:
      'Having seized power by tricking the bereaved court, he trusted no one beneath him, decided everything alone, and though he exhausted mind and body, his rule still missed the mark.',
  },
  s0025: {
    literal:
      'Once the courtiers knew the sovereign\'s mind, they again dared not speak plainly; from the chancellor down, they merely received orders and carried them out.',
    idiomatic:
      'Once ministers knew what he wanted, they dared not speak plainly; from the chancellor down, they only took orders and obeyed.',
  },
  s0026: {
    literal: 'My view is not so.',
    idiomatic: 'I do not think that way.',
  },
  s0027: {
    literal: 'With a realm so vast, how can one man\'s judgment decide all?',
    idiomatic: 'How can one man\'s wit govern a realm this wide?',
  },
  s0028: {
    literal:
      'I am now selecting talent from across the empire for the empire\'s tasks, entrusting offices and demanding results, each to use his utmost—then we may approach good order."',
    idiomatic:
      'I mean to choose the best people in the land for the land\'s work, give them charge, hold them to results, and let each serve where he excels—only then can we hope for right rule."',
  },
  s0029: {
    literal:
      'He thereupon ordered the responsible offices: "Whenever an edict or command is ill-suited to the times, you should memorialize against it at once and must not carry it out merely to please my intent."',
    idiomatic:
      'He then ordered the offices: "If any edict does not suit the times, memorialize against it immediately; do not obey my whim."',
  },
  s0030: {
    literal: '"',
    idiomatic: '[End of the order.]',
  },
  s0031: {
    literal:
      'In the eighth month, on bingwu, an edict ordered that officials of the third rank and above wear purple, those of the fifth rank and above wear scarlet, ranks six and seven green, and ranks eight and nine blue;',
    idiomatic:
      'On bingwu of the eighth month an edict fixed court colors: third rank and above in purple, fifth rank and above in scarlet, sixth and seventh in green, eighth and ninth in blue;',
  },
  s0032: {
    literal: 'women were to follow their husbands\' colors.',
    idiomatic: 'and wives were to dress in their husbands\' colors.',
  },
  s0033: {
    literal:
      'On jiayin, Li Jing, Minister of War and Duke of Dai, became Left Vice Director of the Masters of Writing.',
    idiomatic:
      'On jiayin Li Jing, minister of war and Duke of Dai, was made left vice director of the Masters of Writing.',
  },
  s0034: {
    literal:
      'In the ninth month, on gengwu, he ordered the gathering and burial of bones south of the Great Wall and that sacrifices be offered.',
    idiomatic:
      'On gengwu of the ninth month he ordered the bones scattered south of the Great Wall collected, buried, and mourned.',
  },
  s0035: {
    literal:
      'On renwu, he ordered that the tombs of sage emperors and kings, worthy ministers, and martyred heroes of old must not be pastured or cut for fodder, and that sacrifices be offered in spring and autumn.',
    idiomatic:
      'On renwu he forbade grazing or cutting fodder on the graves of ancient sage rulers, worthy ministers, and loyal dead, and required spring and autumn offerings at their tombs.',
  },
  s0036: {
    literal:
      'In the tenth month of winter, on renchen, he visited Long Prefecture, granted a partial amnesty to Long and Qi prefectures, and remitted taxes for one year.',
    idiomatic:
      'On renchen of the tenth winter month he visited Longzhou, pardoned Long and Qi in part, and granted a year\'s tax relief.',
  },
  s0037: {
    literal: 'On xinchou, he conducted a hunting review at Guiquan Valley.',
    idiomatic: 'On xinchou he held a hunt at Guiquan Valley.',
  },
  s0038: {
    literal:
      'On jiachen, he conducted a hunting review at Yulong River, shot a deer himself, and presented it at D\'an Palace.',
    idiomatic:
      'On jiachen he hunted at Yulong River, shot a deer with his own bow, and sent it as tribute to D\'an Palace.',
  },
  s0039: {
    literal: 'On jiazi, he returned from Long Prefecture.',
    idiomatic: 'On jiazi he returned from Longzhou.',
  },
  s0040: {
    literal:
      'On wuyin, a statute forbade flogging condemned persons on the back, because the Hall of Enlightenment\'s acupoints are sites for needle therapy.',
    idiomatic:
      'On wuyin he decreed that convicts must not be flogged on the back, the locus of acupuncture points at the Hall of Enlightenment.',
  },
  s0041: {
    literal: 'Hou Junji, Minister of War, took part in deliberating court affairs.',
    idiomatic: 'Hou Junji, minister of war, joined in governing.',
  },
  s0042: {
    literal:
      'In the twelfth month, on xinhai, Li Shentong, Generalissimo with the Golden Seal and Duke of Huai\'an, died.',
    idiomatic:
      'On xinhai of the twelfth month Li Shentong, generalissimo with the golden seal and Prince of Huai\'an, died.',
  },
  s0043: {
    literal: 'On jiayin, Qu Wentai, king of Gaochang, came to court.',
    idiomatic: 'On jiayin Qu Wentai, king of Gaochang, presented himself at court.',
  },
  s0044: {
    literal: 'That year, twenty-nine persons were sentenced to death—nearly achieving the abolition of punishment.',
    idiomatic: 'That year only twenty-nine people were executed—punishment all but fell into disuse.',
  },
  s0045: {
    literal:
      'East to the sea, south to the mountains, outer doors were left unbarred and travelers went without carrying provisions.',
    idiomatic:
      'From the eastern sea to the southern ranges, outer gates stood unlatched and travelers needed no grain on the road.',
  },
  s0046: {
    literal:
      'In the fifth year of Zhenguan, in the first month, on guiyou, a great hunt was held at Kunming Pool; chieftains of the barbarian tribes all followed.',
    idiomatic:
      'In the fifth year of Zhenguan, on guiyou of the first month, he held a grand hunt at Kunming Pool with foreign chieftains in attendance.',
  },
  s0047: {
    literal: 'On bingzi, he personally presented game at D\'an Palace.',
    idiomatic: 'On bingzi he presented the hunt\'s kill in person at D\'an Palace.',
  },
  s0048: {
    literal:
      'On jimao, he visited the Left Treasury and bestowed silk on officials of the third rank and above, letting each take as much or as little as he wished.',
    idiomatic:
      'On jimao he opened the Left Treasury and gave silk to every official of third rank and above, each free to choose his portion.',
  },
  s0049: {
    literal: 'On guiwei, the assembly envoys requested a feng and shan sacrifice.',
    idiomatic: 'On guiwei the provincial assembly envoys petitioned for a feng and shan rite.',
  },
  s0050: {
    literal:
      'On jiyou, the emperor\'s younger brothers were enfeoffed: Yuan Yu as Prince of Zheng, Yuanming as Prince of Qiao, Lingchai as Prince of Wei, Yuanxiang as Prince of Xu, and Yuanxiao as Prince of Mi.',
    idiomatic:
      'On jiyou he enfeoffed his brothers: Yuan Yu Prince of Zheng, Yuanming Prince of Qiao, Lingchai Prince of Wei, Yuanxiang Prince of Xu, and Yuanxiao Prince of Mi.',
  },
  s0051: {
    literal:
      'On gengxu, the princes were enfeoffed: Yin as Prince of Liang, Zhen as Prince of Han, Yun as Prince of Tan, Zhi as Prince of Jin, Shen as Prince of Shen, Xiao as Prince of Jiang, and Jian as Prince of Dai.',
    idiomatic:
      'On gengxu he enfeoffed his sons: Yin Prince of Liang, Zhen Prince of Han, Yun Prince of Tan, Zhi Prince of Jin, Shen Prince of Shen, Xiao Prince of Jiang, and Jian Prince of Dai.',
  },
  s0052: {
    literal: 'In the fourth month of summer, on renchen, Prince Jian of Dai died.',
    idiomatic: 'On renchen of the fourth summer month Prince Jian of Dai died.',
  },
  s0053: {
    literal:
      'With gold and silk he ransomed eighty thousand men and women of the Central States who, because of Sui disorder, had fallen into Turkic hands, and returned them all to their families.',
    idiomatic:
      'He paid gold and silk to redeem eighty thousand Chinese men and women enslaved among the Turks during the Sui collapse and sent them home to their kin.',
  },
  s0054: {
    literal:
      'In the sixth month, on jiayin, Li Gang, Junior Tutor to the crown prince and Duke of Xinchang, died.',
    idiomatic:
      'On jiayin of the sixth month Li Gang, junior tutor to the crown prince and Duke of Xinchang, died.',
  },
  s0055: {
    literal:
      'In the seventh month, on jiachen, he sent envoys to destroy the victory mounds Goguryeo had raised, gathered the bones of Sui dead, sacrificed to them, and buried them.',
    idiomatic:
      'On jiachen of the seventh month he sent envoys to tear down Goguryeo\'s victory mounds, collect Sui dead, mourn them, and bury them with honor.',
  },
  s0056: {
    literal:
      'On wushen, for the first time he ordered that death sentences empire-wide must receive threefold review; in the capital the offices must review five times; on that day the Imperial Kitchen served vegetarian food, and the Inner Music Office and the Court of Imperial Sacrifices performed no music.',
    idiomatic:
      'On wushen he first required three reviews before any execution in the realm, five in the capital; on execution days the palace kitchen served only vegetables and court music fell silent.',
  },
  s0057: {
    literal: 'In the ninth month, on yichou, he granted the officials a great archery contest at Wude Hall.',
    idiomatic: 'On yichou of the ninth month he held a grand archery feast for the officials at Wude Hall.',
  },
  s0058: {
    literal:
      'In the tenth month of winter, Ashina Shibobi, General-in-Chief of the Right Guard, Governor of Shun Prefecture, and Prince of Beiping, died.',
    idiomatic:
      'In the tenth winter month Ashina Shibobi, general of the right guard, governor of Shunzhou, and Prince of Beiping, died.',
  },
  s0059: {
    literal: 'In the twelfth month, on renyin, he visited the hot springs.',
    idiomatic: 'On renyin of the twelfth month he went to the hot springs.',
  },
  s0060: {
    literal: 'On guimao, he hunted at Mount Li.',
    idiomatic: 'On guimao he hunted on Mount Li.',
  },
  s0061: {
    literal: 'On bingwu, he bestowed silk on the aged of Xinfeng in graded amounts.',
    idiomatic: 'On bingwu he gave graded gifts of silk to the elderly of Xinfeng.',
  },
  s0062: {
    literal: 'On wushen, he returned from the hot springs.',
    idiomatic: 'On wushen he returned from the hot springs.',
  },
  s0063: {
    literal:
      'In the sixth year of Zhenguan, in the spring of the first month, on the yimao new moon, there was a solar eclipse.',
    idiomatic:
      'In the sixth year of Zhenguan, on the yimao new moon of the first spring month, the sun was eclipsed.',
  },
  s0064: {
    literal: 'In the second month, on bingxu, the offices of the Three Preceptors were established.',
    idiomatic: 'On bingxu of the second month he established the Three Preceptors.',
  },
  s0065: {
    literal: 'On wuzi, the Law School was established for the first time.',
    idiomatic: 'On wuzi he founded the school of law.',
  },
  s0066: {
    literal: 'In the third month, on wuchen, he visited Jiucheng Palace.',
    idiomatic: 'On wuchen of the third month he went to Jiucheng Palace.',
  },
  s0067: {
    literal: 'In the sixth month, on jihai, Prince Yuanheng of Feng died.',
    idiomatic: 'On jihai of the sixth month Prince Yuanheng of Feng died.',
  },
  s0068: {
    literal: 'On xinhai, Prince Xiao of Jiang died.',
    idiomatic: 'On xinhai Prince Xiao of Jiang died.',
  },
  s0069: {
    literal: 'In the tenth month of winter, on yimao, he returned from Jiucheng Palace.',
    idiomatic: 'On yimao of the tenth winter month he returned from Jiucheng Palace.',
  },
  s0070: {
    literal:
      'In the twelfth month, on xinwei, he personally reviewed prisoners and sent two hundred ninety persons sentenced to death home, ordering execution in the autumn of the coming year.',
    idiomatic:
      'On xinwei of the twelfth month he reviewed prisoners in person and sent two hundred ninety condemned men home to await execution the next autumn.',
  },
  s0071: {
    literal: 'Thereafter, when the appointed time arrived, they all came in; an edict wholly pardoned them.',
    idiomatic: 'When autumn came they all returned as ordered, and he pardoned every one of them.',
  },
  s0072: {
    literal: 'That year, before and after, three hundred thousand Tangut submitted.',
    idiomatic: 'That year three hundred thousand Tangut submitted in successive waves.',
  },
  s0073: {
    literal:
      'In the seventh year of Zhenguan, in the spring of the first month, on wuzi, an edict said: "Yuwen Huazhi\'s brother Zhiyi, Sima Dekan, Pei Qiantong, Meng Jing, Yuan Li, Yang Lan, Tang Fengyi, Niu Fangyu, Yuan Min, Xue Liang, Ma Ju, Yuan Wuda, Li Xiaoben, Li Xiaozhi, Zhang Kai, Xu Hongren, Linghu Xingda, Xi Defang, Li Fu, and others—in the closing years of Daye all held court rank, some bound by grace to a generation, some bearing weight for a season;',
    idiomatic:
      'In the seventh year of Zhenguan, on wuzi of the first spring month, an edict named Yuwen Zhiyi, Sima Dekan, Pei Qiantong, and the rest who, in Yangdi\'s last years, had held high office—men once favored by the throne—',
  },
  s0074: {
    literal:
      'yet they harbored fierce wickedness and gave no thought to loyalty; at Jiangdu they carried out regicide, crimes surpassing Yan and Zhao, guilt deeper than the parricide-beast.',
    idiomatic:
      'yet at Jiangdu they murdered their sovereign, crimes blacker than regicide itself.',
  },
  s0075: {
    literal:
      'Though the deed belongs to a former dynasty and the years are long, the evil under heaven is rejected in every age; a heavy statute should be set to steel the hearts of ministers.',
    idiomatic:
      'Though the deed lies in the past, such evil is condemned in every age; let the law be severe to warn those who serve.',
  },
  s0076: {
    literal: 'Their sons and grandsons should all be placed under restraint and barred from official advancement."',
    idiomatic: 'Their sons and grandsons shall be barred from office and from mingling in court ranks."',
  },
  s0077: {
    literal: 'That same day, the emperor composed the dance tableau Breaking the Battle Line.',
    idiomatic: 'That same day he composed the dance tableau Breaking the Battle Line.',
  },
  s0078: {
    literal: 'On xinchou, communal feasting was granted in the capital for three days.',
    idiomatic: 'On xinchou he granted three days of public feasting in the capital.',
  },
  s0079: {
    literal: 'On dingmao, earth rained from the sky.',
    idiomatic: 'On dingmao dust fell from the sky like rain.',
  },
  s0080: {
    literal: 'On yiyou, envoys from Xueyantuo came to court.',
    idiomatic: 'On yiyou Xueyantuo sent envoys to court.',
  },
  s0081: {
    literal:
      'On gengyin, Wei Zheng, Director of the Secretariat and acting Palace Attendant, became Palace Attendant.',
    idiomatic:
      'On gengyin Wei Zheng, director of the Secretariat and acting palace attendant, was made palace attendant.',
  },
  s0082: {
    literal:
      'On guisi, Li Chunfeng, Director of the Imperial Observatory and Gentleman for Court Service, cast the armillary sphere of the Yellow Path, presented it, and it was placed in Ninghui Pavilion.',
    idiomatic:
      'On guisi Li Chunfeng cast the armillary sphere of the yellow path, presented it to the throne, and it was installed in Ninghui Pavilion.',
  },
  s0083: {
    literal: 'In the fifth month of summer, on guiwei, he visited Jiucheng Palace.',
    idiomatic: 'On guiwei of the fifth summer month he went to Jiucheng Palace.',
  },
  s0084: {
    literal:
      'In the eighth month, thirty prefectures east and south of the mountains suffered great floods; envoys were sent to relieve and comfort.',
    idiomatic:
      'In the eighth month thirty prefectures east and south of the mountains were flooded; he sent envoys with relief.',
  },
  s0085: {
    literal: 'In the tenth month of winter, on gengshen, he returned from Jiucheng Palace.',
    idiomatic: 'On gengshen of the tenth winter month he returned from Jiucheng Palace.',
  },
  s0086: {
    literal: 'In the eleventh month, on dingchou, the newly revised Five Classics were promulgated.',
    idiomatic: 'On dingchou of the eleventh month he promulgated the newly fixed Five Classics.',
  },
  s0087: {
    literal:
      'On renchen, Zhangsun Wuji, Generalissimo with the Golden Seal and Duke of Qi, became Minister of Works.',
    idiomatic:
      'On renchen Zhangsun Wuji, generalissimo with the golden seal and Duke of Qi, was made minister of works.',
  },
  s0088: {
    literal:
      'In the twelfth month, on bingchen, he hunted at Shaoling Plain and ordered the secondary sacrifice offered at the tombs of Du Ruhui, Du Yan, and Li Gang.',
    idiomatic:
      'On bingchen of the twelfth month he hunted on Shaoling Plain and ordered secondary sacrifices at the tombs of Du Ruhui, Du Yan, and Li Gang.',
  },
  s0089: {
    literal:
      'In the eighth year of Zhenguan, in the first month, on guiwei, Ashina Tubo, General-in-Chief of the Right Guard, died.',
    idiomatic:
      'In the eighth year of Zhenguan, on guiwei of the first month, Ashina Tubo, general of the right guard, died.',
  },
  s0090: {
    literal:
      'On xinchou, Zhang Shigui, General-in-Chief of the Right Garrison Guard, suppressed the rebel Liao of the eastern and western Five Caves and pacified them.',
    idiomatic:
      'On xinchou Zhang Shigui, general of the right garrison guard, crushed the rebel Liao of the eastern and western Five Caves.',
  },
  s0091: {
    literal:
      'On renyin, he appointed Li Jing, Right Vice Director of the Masters of Writing; Xiao Yu and Yang Gongren, Senior Advisors; Wang Gui, Minister of Rites; Wei Ting, Censor-in-Chief; Huangfu Wuyi, chief administrator of the metropolitan prefecture of Bian; Li Xiyu, chief administrator of Yangzhou; Zhang Liang, chief administrator of Youzhou; Li Daliang, metropolitan protector of Liangzhou; Dou Dan, General-in-Chief of the Right Vanguard; Du Zhenlun, left aide to the crown prince; Liu Dewei, prefect of Mian; and Zhao Hongzhi, Vice Director of the Yellow Gate, as envoys to the four quarters to observe local customs.',
    idiomatic:
      'On renyin he dispatched Li Jing, Xiao Yu, Yang Gongren, Wang Gui, Wei Ting, Huangfu Wuyi, Li Xiyu, Zhang Liang, Li Daliang, Dou Dan, Du Zhenlun, Liu Dewei, and Zhao Hongzhi to tour the realm and report on local custom.',
  },
  s0092: {
    literal: 'In the second month, on yisi, the crown prince received the cap of manhood.',
    idiomatic: 'On yisi of the second month the crown prince came of age.',
  },
  s0093: {
    literal: 'On bingwu, communal feasting was granted throughout the empire for three days.',
    idiomatic: 'On bingwu he granted three days of public feasting empire-wide.',
  },
  s0094: {
    literal: 'In the third month, on gengchen, he visited Jiucheng Palace.',
    idiomatic: 'On gengchen of the third month he went to Jiucheng Palace.',
  },
  s0095: {
    literal: 'In the fifth month, on the xinwei new moon, there was a solar eclipse.',
    idiomatic: 'On the xinwei new moon of the fifth month the sun was eclipsed.',
  },
  s0096: {
    literal:
      'On dingchou, for the first time the emperor wore the Yishan crown and nobles wore the Jinde crown.',
    idiomatic:
      'On dingchou he first wore the Yishan crown himself and required nobles to wear the Jinde crown.',
  },
  s0097: {
    literal: 'In the seventh month, the Cloud Pennon General rank was made subordinate third rank for the first time.',
    idiomatic: 'In the seventh month the rank of Cloud Pennon General was fixed at subordinate third grade.',
  },
  s0098: {
    literal: 'In Longyou the mountains collapsed and great serpents were repeatedly seen.',
    idiomatic: 'Mountains collapsed in Longyou and great serpents were seen again and again.',
  },
  s0099: {
    literal:
      'East and south of the mountains and in Huainan there were great floods; envoys were sent to relieve and comfort.',
    idiomatic:
      'Great floods struck the eastern and southern provinces and Huainan; he sent envoys with relief.',
  },
  s0100: {
    literal:
      'In the eighth month, on jiazi, a broom star appeared in Xu and Wei, passed through Di, and was extinguished in the first ten days of the eleventh month.',
    idiomatic:
      'On jiazi of the eighth month a comet blazed in Xu and Wei, crossed Di, and vanished in the first third of the eleventh month.',
  },
};

const path = 'translations/current_translation_jiutangshu.json';
const data = JSON.parse(readFileSync(path, 'utf8'));
if (data.metadata.chapter !== '003') {
  throw new Error(`Expected chapter 003, got ${data.metadata.chapter}`);
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
