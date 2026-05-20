#!/usr/bin/env node
/**
 * Apply translations for songshu chapter 004.
 * Usage: node translations/patch_songshu_004.mjs [batch1|batch2|all]
 */
import fs from 'node:fs';

const T = {
  s0001: {
    literal:
      'On the guihai day of the fifth month of the third year of Yongchu, Emperor Wu died; on that same day the crown prince assumed the imperial throne.',
    idiomatic:
      'On the guihai day of the fifth month of the third year of Yongchu, Emperor Wu died; that same day the crown prince ascended the throne.',
  },
  s0002: {
    literal: 'A general amnesty was proclaimed.',
    idiomatic: 'A general amnesty was proclaimed.',
  },
  s0003: {
    literal: 'The empress dowager was honored as grand empress dowager.',
    idiomatic: 'The empress dowager was elevated to grand empress dowager.',
  },
  s0004: {
    literal:
      'On the renshen day of the sixth month, Fu Liang, Vice Director of the Masters of Writing, was made Supervisor of the Masters of Writing; the Minister of Works Xu Xianzhi, the General Who Leads the Army Xie Hui, and Liang were appointed to assist in government.',
    idiomatic:
      'On the renshen day of the sixth month, Fu Liang, Vice Director of the Masters of Writing, was appointed Supervisor of the Masters of Writing; the Minister of Works Xu Xianzhi, the General Who Leads the Army Xie Hui, and Liang were made regents.',
  },
  s0005: {
    literal: 'On the wuzi day, the Grand Commandant, the Prince of Changsha, Dao Lian, died.',
    idiomatic: 'On the wuzi day, the Grand Commandant, Prince of Changsha Dao Lian, died.',
  },
  s0006: {
    literal:
      'In autumn, on the dingwei day of the ninth month, the relevant offices memorialized that Emperor Wu should be paired at the southern suburb altar and Empress Wu Jing at the northern suburb altar.',
    idiomatic:
      'In autumn, on the dingwei day of the ninth month, the relevant offices submitted that Emperor Wu should receive joint sacrifice at the southern suburban altar and Empress Wu Jing at the northern suburban altar.',
  },
  s0007: {
    literal: 'In winter, on the wuwu day of the eleventh month, a comet appeared in the Encampment mansion.',
    idiomatic: 'In winter, on the wuwu day of the eleventh month, a broom star appeared in the Encampment lodge.',
  },
  s0008: {
    literal: 'On the gengxu day of the twelfth month, the Wei army captured Huatai.',
    idiomatic: 'On the gengxu day of the twelfth month, the Wei army took Huatai.',
  },
  s0009: {
    literal:
      'On the new moon of the first month of spring of the following year, the day jihai, a general amnesty was proclaimed and the era name was changed to Jingping, year one.',
    idiomatic:
      'On the new moon of the first month of spring of the following year, on the day jihai, a general amnesty was proclaimed and the era name was changed to Jingping, year one.',
  },
  s0010: {
    literal: 'Civil and military officials were promoted two ranks.',
    idiomatic: 'Civil and military officials were advanced two ranks in status.',
  },
  s0011: {
    literal: 'On the xinchou day, sacrifice was offered at the southern suburb.',
    idiomatic: 'On the xinchou day, the southern suburban sacrifice was performed.',
  },
  s0012: {
    literal:
      '[3] The barbarian general Daxi Ang captured Jinyong and advanced to besiege Hulao.',
    idiomatic:
      '[3] The enemy general Daxi Ang took Jinyong and pressed on to besiege Hulao.',
  },
  s0013: {
    literal:
      '[4] Mao Dezu struck the barbarians and defeated them; the barbarians withdrew and then regrouped.',
    idiomatic:
      '[4] Mao Dezu attacked the enemy and routed them; the enemy withdrew and then rallied again.',
  },
  s0014: {
    literal: 'Tuoba Mumo again sent the Prince of Anping, Shegui, to raid Qingzhou.',
    idiomatic: 'Tuoba Mumo again sent the Prince of Anping, Shegui, to invade Qingzhou.',
  },
  s0015: {
    literal: '[5] On the guimao day, Henan Commandery was lost.',
    idiomatic: '[5] On the guimao day, Henan Commandery fell.',
  },
  s0016: {
    literal: 'On the yimao day, a comet appeared in the Eastern Wall mansion.',
    idiomatic: 'On the yimao day, a broom star appeared in the Eastern Wall lodge.',
  },
  s0017: {
    literal: 'On the dingchou day of the second month, the grand empress dowager died.',
    idiomatic: 'On the dingchou day of the second month, the grand empress dowager died.',
  },
  s0018: {
    literal: 'Juqu Mengxun and Tuguhun A\'ai both sent envoys with tribute.',
    idiomatic: 'Juqu Mengxun and Tuguhun A\'ai both sent envoys to court with tribute.',
  },
  s0019: {
    literal:
      'On the gengchen day, [6] Mengxun was ennobled as General of Agile Cavalry, [7] and enfeoffed as Prince of Hexi.',
    idiomatic:
      'On the gengchen day, [6] Mengxun was created General of Agile Cavalry [7] and enfeoffed as Prince of Hexi.',
  },
  s0020: {
    literal:
      'A\'ai was made General Who Pacifies the West and Inspector of Shazhou, and enfeoffed as Duke of Jiaohe.',
    idiomatic:
      'A\'ai was appointed General Who Pacifies the West and Inspector of Shazhou, and created Duke of Jiaohe.',
  },
  s0021: {
    literal:
      'On the xinwei day, Sun Faguang of Fuyang rebelled, [8] raided Shanyin, and the Governor of Kuaiji Chu Danzhi sent the Magistrate of Shanyin Lu Shao to attack and defeat him.',
    idiomatic:
      'On the xinwei day, Sun Faguang of Fuyang rose in revolt, [8] raided Shanyin, and the Governor of Kuaiji Chu Danzhi sent the Magistrate of Shanyin Lu Shao to defeat him.',
  },
  s0022: {
    literal:
      '[9] Editorial note nine stands in the received text at this point in the narrative.',
    idiomatic:
      '[9] Editorial note nine stands in the received text at this point in the narrative.',
  },
  s0023: {
    literal:
      'On the renyin day of the third month, Empress Xiaoyi was enshrined and buried at Xingning Mausoleum.',
    idiomatic:
      'On the renyin day of the third month, Empress Xiaoyi was enshrined and buried at Xingning Mausoleum.',
  },
  s0024: {
    literal: 'That month, Goguryeo sent envoys with tribute.',
    idiomatic: 'That month, Goguryeo sent envoys to court with tribute.',
  },
  s0025: {
    literal:
      'On the jiazi day, Liu Cui, Inspector of Yuzhou, sent troops to raid Xuchang and killed the barbarian Administrator of Yingchuan, Yu Long.',
    idiomatic:
      'On the jiazi day, Liu Cui, Inspector of Yuzhou, sent troops to raid Xuchang and killed the enemy Administrator of Yingchuan, Yu Long.',
  },
  s0026: {
    literal: '[10] On the yichou day, barbarian horsemen raided Gaoping.',
    idiomatic: '[10] On the yichou day, enemy horsemen raided Gaoping.',
  },
  s0027: {
    literal:
      'Earlier, after their defeat north of the Yellow River, the barbarians had requested a marriage alliance;',
    idiomatic:
      'Earlier, after their defeat north of the Yellow River, the enemy had sought a marriage alliance;',
  },
  s0028: {
    literal:
      'when they heard that Emperor Gaozu had died, they again launched raids, and the lands along the Yellow and Luo rivers were thrown into turmoil.',
    idiomatic:
      'when they learned that Emperor Gaozu had died, they resumed their incursions, and the Yellow and Luo region was thrown into turmoil.',
  },
  s0029: {
    literal:
      'In summer, the fourth month, Tan Daoji marched north on campaign, halted at Linqu, and burned the barbarians\' siege equipment.',
    idiomatic:
      'In summer, the fourth month, Tan Daoji marched north on campaign, halted at Linqu, and burned the enemy siege equipment.',
  },
  s0030: {
    literal:
      'On the yiwei day, the Wei army captured Hulao and took the Inspector of Sizhou, Mao Dezu, back with them.',
    idiomatic:
      'On the yiwei day, the Wei army took Hulao and carried off the Inspector of Sizhou, Mao Dezu.',
  },
  s0031: {
    literal:
      'In autumn, on the guiyou day of the seventh month, the birth mother, Lady Zhang, was honored as empress dowager.',
    idiomatic:
      'In autumn, on the guiyou day of the seventh month, his birth mother, Lady Zhang, was honored as empress dowager.',
  },
  s0032: {
    literal:
      'On the dingchou day, because of drought, an edict pardoned offenders sentenced to five years or less.',
    idiomatic:
      'On the dingchou day, because of drought, an edict pardoned offenders sentenced to five years or less.',
  },
  s0033: {
    literal:
      '[11] Editorial note eleven stands in the received text at this point in the narrative.',
    idiomatic:
      '[11] Editorial note eleven stands in the received text at this point in the narrative.',
  },
  s0034: {
    literal:
      'In winter, on the jiwei day of the tenth month, a comet appeared in the Root mansion, pointing toward the Tail, piercing Sheti, and heading toward the Great Horn; in the middle month it was in Rooftop, in the last month it swept the Celestial Granary, and then it vanished.',
    idiomatic:
      'In winter, on the jiwei day of the tenth month, a broom star appeared in the Root lodge, pointing toward the Tail, piercing Sheti, and heading toward the Great Horn; in the middle month it stood in Rooftop, in the last month it swept the Celestial Granary, and then it vanished.',
  },
  s0035: {
    literal: 'That year, the Wei ruler Tuoba Si died and his son Tao succeeded.',
    idiomatic: 'That year, the Wei ruler Tuoba Si died and his son Tao succeeded him.',
  },
  s0036: {
    literal:
      'On the bingyin day of the twelfth month, [12] the three commanderies of Jiangyang, Qianwei, and Anshang in Ningzhou were abolished and combined into Songchang Commandery.',
    idiomatic:
      'On the bingyin day of the twelfth month, [12] the three commanderies of Jiangyang, Qianwei, and Anshang in Ningzhou were abolished and combined into Songchang Commandery.',
  },
  s0037: {
    literal: 'In spring of the second year, on the new moon of the second month, the day guisi, there was an eclipse of the sun.',
    idiomatic: 'In spring of the second year, on the new moon of the second month, the day guisi, there was a solar eclipse.',
  },
  s0038: {
    literal:
      '[13] The Prince of Luling, Yizhen, Inspector of South Yuzhou, was deposed as a commoner and moved to Xin\'an Commandery.',
    idiomatic:
      '[13] Prince of Luling Yizhen, Inspector of South Yuzhou, was deposed to commoner status and exiled to Xin\'an Commandery.',
  },
  s0039: {
    literal:
      'On the yiwei day, the emperor\'s younger brother Yigong was made General Who Establishes Champions and Inspector of South Yuzhou.',
    idiomatic:
      'On the yiwei day, the emperor\'s younger brother Yigong was appointed General Who Establishes Champions and Inspector of South Yuzhou.',
  },
  s0040: {
    literal:
      'On the yisi day, a great wind blew; [14] five-colored clouds appeared in the sky, and diviners took this as a sign of war.',
    idiomatic:
      'On the yisi day, a great wind blew; [14] five-colored clouds appeared in the sky, and diviners interpreted this as a portent of war.',
  },
  s0041: {
    literal: 'Goguryeo sent envoys with tribute.',
    idiomatic: 'Goguryeo sent envoys to court with tribute.',
  },
  s0042: {
    literal: 'The regents sent an envoy to execute Yizhen at Xin\'an.',
    idiomatic: 'The regents sent an envoy to execute Yizhen at Xin\'an.',
  },
  s0043: {
    literal:
      'In summer, the fifth month, Wang Hong, Inspector of Jiangzhou, and Tan Daoji, Inspector of South Yanzhou, came to court.',
    idiomatic:
      'In summer, the fifth month, Wang Hong, Inspector of Jiangzhou, and Tan Daoji, Inspector of South Yanzhou, came to court.',
  },
  s0044: {
    literal: '[15] In his conduct the emperor committed many faults.',
    idiomatic: '[15] In his conduct the emperor committed many faults.',
  },
  s0045: {
    literal: 'On the yiyou day, the empress dowager issued an order, saying:',
    idiomatic: 'On the yiyou day, the empress dowager issued an order, saying:',
  },
  s0046: {
    literal:
      'The royal house has met with misfortune, Heaven\'s calamity has not yet relented, the late emperor\'s founding work did not last long, and he departed the world and ascended afar.',
    idiomatic:
      'The royal house has suffered misfortune; Heaven\'s wrath has not yet lifted; the late emperor\'s founding work was cut short when he died and passed beyond.',
  },
  s0047: {
    literal:
      'Yifu, as the eldest son and heir, was entrusted with the position under Heaven, yet who would have thought his utter villainy and extreme depravity would reach this point.',
    idiomatic:
      'Yifu, as the eldest son, was meant to inherit the throne under Heaven; none could have foreseen that his vicious depravity would go so far.',
  },
  s0048: {
    literal:
      'While the late emperor lay in coffin, the realm mourned in grief, yet he took others\' disaster as his pleasure and poured forth rebellious words, and showed joy upon his face even in the period of mourning.',
    idiomatic:
      'While the late emperor still lay in state and the realm mourned, he delighted in others\' misfortune and spoke rebelliously, wearing a cheerful countenance even amid mourning.',
  },
  s0049: {
    literal:
      'He even summoned the Music Bureau, gathered actors, and had singers, musicians, and string players all perform without exception; rare delicacies and fine foods exceeded those of ordinary days.',
    idiomatic:
      'He even summoned the Music Bureau, gathered performers, and had singers, musicians, and string players perform without exception; delicacies and fine foods exceeded those of ordinary days.',
  },
  s0050: {
    literal:
      'He selected concubines, and when they bore children he brought them into the palace with perfect composure and no shame; foul reports spread in every direction.',
    idiomatic:
      'He selected concubines, and when they bore children he brought them into the palace without the least shame; scandal spread in every direction.',
  },
  s0051: {
    literal:
      'When Empress Yi died, Heaven added a further punishment: he personally joined his attendants in grasping the mourning cords and singing aloud, pushed the inner coffin about, clapped his hands and laughed and jested—the palace offices all heard of it.',
    idiomatic:
      'When Empress Yi died, he added Heaven\'s punishment to his own: he personally joined his attendants in grasping the mourning cords and singing aloud, pushed the inner coffin about, and clapped his hands in laughter and jest—the palace offices all heard of it.',
  },
  s0052: {
    literal:
      'Moreover, day and night he indulged in lewd sport; his petty followers treated him with disrespect; he launched a thousand projects and spent ten thousand sums; the treasury was emptied and manpower exhausted.',
    idiomatic:
      'Moreover, day and night he indulged in lewd sport; his petty followers treated him with disrespect; he launched a thousand projects and spent ten thousand sums; the treasury was emptied and manpower exhausted.',
  },
  s0053: {
    literal: 'Punishments were harsh and cruel, and those imprisoned increased daily.',
    idiomatic: 'Punishments were harsh and cruel, and those imprisoned increased daily.',
  },
  s0054: {
    literal:
      'Though he occupied the position of an emperor, he delighted in the tasks of black-clad servants; though he possessed the honor of the ten-thousand-chariot ruler, he took pleasure in groom and stable work.',
    idiomatic:
      'Though he occupied the throne, he delighted in the tasks of menial servants; though he possessed imperial dignity, he took pleasure in groom and stable work.',
  },
  s0055: {
    literal:
      'He personally wielded the whip and flail, beat the innocent, and made this his amusement.',
    idiomatic:
      'He personally wielded the whip and flail, beat the innocent, and made this his amusement.',
  },
  s0056: {
    literal:
      'He dug ponds and built towers, completing them in the morning and destroying them in the evening; he conscripted craftsmen until the people were exhausted to the utmost.',
    idiomatic:
      'He dug ponds and built towers, completing them in the morning and destroying them in the evening; he conscripted craftsmen until the people were exhausted to the utmost.',
  },
  s0057: {
    literal:
      'Near and far sighed in lament; men and spirits were angered; the altars of soil and grain were about to fall—how could he again inherit and guard the great enterprise and rule the myriad states.',
    idiomatic:
      'Near and far sighed in lament; men and spirits were angered; the altars of soil and grain were about to fall—how could he again inherit and guard the great enterprise and rule the myriad states.',
  },
  s0058: {
    literal:
      'He is now deposed as Prince of Yingyang, following entirely the precedents of the Han Prince of Changyi and the Jin Emperor Haixi.',
    idiomatic:
      'He is now deposed as Prince of Yingyang, following entirely the precedents of the Han Prince of Changyi and the Jin Emperor Haixi.',
  },
  s0059: {
    literal:
      'General Who Guards the West, the Prince of Yidu, is benevolent, bright, filial, and fraternal, renowned from his earliest years.',
    idiomatic:
      'The Prince of Yidu, General Who Guards the West, is benevolent, bright, filial, and fraternal, renowned from his earliest years.',
  },
  s0060: {
    literal: 'His virtue and conduct are pure, and his mind and judgment are clear and fair.',
    idiomatic: 'His virtue and conduct are pure, and his mind and judgment are clear and fair.',
  },
  s0061: {
    literal: 'He should inherit the great succession and preside over the hundred million.',
    idiomatic: 'He should inherit the great succession and preside over the hundred million.',
  },
  s0062: {
    literal:
      'The responsible officials should examine the precedents in detail and welcome him at the proper time.',
    idiomatic:
      'The responsible officials should examine the precedents in detail and welcome him at the proper time.',
  },
  s0063: {
    literal:
      'This surviving widow bears a hundred calamities; though alive, it is as if she had perished.',
    idiomatic:
      'This surviving widow bears a hundred calamities; though alive, it is as if she had perished.',
  },
  s0064: {
    literal:
      'Forever grieving over these affairs, she presses her heart and is overwhelmed with anguish.',
    idiomatic:
      'Forever grieving over these affairs, she presses her heart and is overwhelmed with anguish.',
  },
  s0065: {
    literal:
      '〕[16] Editorial note sixteen stands in the received text at this point in the narrative.',
    idiomatic:
      '〕[16] Editorial note sixteen stands in the received text at this point in the narrative.',
  },
  s0066: {
    literal:
      'At first Xu Xianzhi and Fu Liang were about to depose the emperor; they hinted to Wang Hong and Tan Daoji that they should come for the state mourning.',
    idiomatic:
      'At first Xu Xianzhi and Fu Liang were about to depose the emperor; they hinted to Wang Hong and Tan Daoji that they should come for the state mourning.',
  },
  s0067: {
    literal: 'Hong and the others came to court.',
    idiomatic: 'Hong and the others came to court.',
  },
  s0068: {
    literal:
      'They made the Attendant of the Masters of Writing Xing Antai and Pan Sheng their inside contacts.',
    idiomatic:
      'They made the Attendant of the Masters of Writing Xing Antai and Pan Sheng their inside contacts.',
  },
  s0069: {
    literal:
      'That morning, Tan Daoji and Xie Hui led troops in front while Xu Xianzhi and the others followed; because the East Side Gate was open, they entered through the Cloud Dragon Gate.',
    idiomatic:
      'That morning, Tan Daoji and Xie Hui led troops in front while Xu Xianzhi and the others followed; because the East Side Gate was open, they entered through the Cloud Dragon Gate.',
  },
  s0070: {
    literal:
      'Sheng and the others had first warned the night guards, and none resisted.',
    idiomatic:
      'Sheng and the others had first warned the night guards, and none resisted.',
  },
  s0071: {
    literal:
      'At the time the emperor was in the Hualin Garden setting up a row of shops and personally selling wine.',
    idiomatic:
      'At the time the emperor was in the Hualin Garden setting up a row of shops and personally selling wine.',
  },
  s0072: {
    literal:
      'He also opened a canal and piled earth to imitate the Pogang dam, and with his attendants pulled boats while shouting and calling—taking this as his pleasure.',
    idiomatic:
      'He also opened a canal and piled earth to imitate the Pogang dam, and with his attendants pulled boats while shouting and calling—taking this as his pleasure.',
  },
  s0073: {
    literal: 'In the evening he toured the Tianyuan Pool and slept on the dragon boat.',
    idiomatic: 'In the evening he toured the Tianyuan Pool and slept on the dragon boat.',
  },
  s0074: {
    literal:
      'The court had not yet risen when soldiers entered, killed two attendants at the emperor\'s side, and wounded his finger.',
    idiomatic:
      'The court had not yet risen when soldiers entered, killed two attendants at the emperor\'s side, and wounded his finger.',
  },
  s0075: {
    literal:
      'He was taken out through the East Gate Pavilion, the seals and cords were taken from him, the officials bowed in farewell, he was sent to the Eastern Palace, and then confined in Wu Commandery.',
    idiomatic:
      'He was taken out through the East Gate Pavilion, the seals and cords were taken from him, the officials bowed in farewell, he was sent to the Eastern Palace, and then confined in Wu Commandery.',
  },
  s0076: {
    literal: 'That day, those sentenced to death and below were pardoned.',
    idiomatic: 'That day, those sentenced to death and below were pardoned.',
  },
  s0077: {
    literal: 'The empress dowager ordered that the seals and cords be returned.',
    idiomatic: 'The empress dowager ordered that the seals and cords be returned.',
  },
  s0078: {
    literal: 'Tan Daoji entered to guard the court hall.',
    idiomatic: 'Tan Daoji entered to guard the court hall.',
  },
  s0079: {
    literal:
      'On the guichou day of the sixth month, Xu Xianzhi and the others had the Attendant of the Masters of Writing Xing Antai assassinate the emperor at Jinchang Pavilion.',
    idiomatic:
      'On the guichou day of the sixth month, Xu Xianzhi and the others had the Attendant of the Masters of Writing Xing Antai assassinate the emperor at Jinchang Pavilion.',
  },
  s0080: {
    literal:
      'The emperor had strength and courage and did not submit at once; he burst out through Chang Gate, and pursuers struck him down with the gate bar, causing his death.',
    idiomatic:
      'The emperor was strong and courageous and did not submit at once; he burst out through Chang Gate, and pursuers struck him down with the gate bar, killing him.',
  },
  s0081: {
    literal: 'He was nineteen years old.',
    idiomatic: 'He was nineteen years old.',
  },
  s0082: {
    literal:
      '[17] Editorial note seventeen stands in the received text at this point in the narrative.',
    idiomatic:
      '[17] Editorial note seventeen stands in the received text at this point in the narrative.',
  },
  s0083: {
    literal: '〈Upper portion missing〉',
    idiomatic: '〈The beginning of the passage is missing in the received text.〉',
  },
  s0084: {
    literal: 'then the founding ruler is one whom Heaven itself has opened the way for;',
    idiomatic: 'then the founding ruler is one whom Heaven itself has opened the way for;',
  },
  s0085: {
    literal: 'for a ruler who merely keeps the inheritance, how hard it is!',
    idiomatic: 'for a ruler who merely keeps the inheritance, how hard it is!',
  },
  s0086: {
    literal:
      '[18] Editorial note eighteen stands in the received text at this point in the narrative.',
    idiomatic:
      '[18] Editorial note eighteen stands in the received text at this point in the narrative.',
  },
  s0087: {
    literal: 'Collation notes',
    idiomatic: 'Textual collation notes',
  },
  s0088: {
    literal:
      'He was the eldest son of Emperor Wu. The Collected Variants in the Twenty-two Histories says: "According to the annals and biographies, all emperors are called by their temple names; only in this annal is Emperor Wu named four times, and there are still places that call him Emperor Gaozu.',
    idiomatic:
      'He was the eldest son of Emperor Wu. The Collected Variants in the Twenty-two Histories says: "According to the annals and biographies, all emperors are called by their temple names; only in this annal is Emperor Wu named four times, and there are still places that call him Emperor Gaozu.',
  },
  s0089: {
    literal:
      'Moreover, other chapters by rule call Wei the Northern Barbarians, yet this annal once says the Wei army captured Huatai and once says the Wei ruler Tuoba Si died—entirely unlike Shen Yue\'s usage.',
    idiomatic:
      'Moreover, other chapters by rule call Wei the Northern Barbarians, yet this annal once says the Wei army captured Huatai and once says the Wei ruler Tuoba Si died—entirely unlike Shen Yue\'s usage.',
  },
  s0090: {
    literal:
      'Again, in the first month of the twelfth year of Yixi, the heir of the Duke of Yuzhang was made General of the West Center and Inspector of Yuzhou.',
    idiomatic:
      'Again, in the first month of the twelfth year of Yixi, the heir of the Duke of Yuzhang was made General of the West Center and Inspector of Yuzhou.',
  },
  s0091: {
    literal:
      'In the third month he was relieved as General Who Subdues the Barbarians and made Inspector of Xu and Yan provinces, stationed at Jingkou.',
    idiomatic:
      'In the third month he was relieved as General Who Subdues the Barbarians and made Inspector of Xu and Yan provinces, stationed at Jingkou.',
  },
  s0092: {
    literal:
      'In the sixth month of the fourteenth year he was relieved as General of the Center and made deputy to the Chancellor\'s Office.',
    idiomatic:
      'In the sixth month of the fourteenth year he was relieved as General of the Center and made deputy to the Chancellor\'s Office.',
  },
  s0093: {
    literal:
      'If these ought to appear in this annal, they are entirely omitted.',
    idiomatic:
      'If these ought to appear in this annal, they are entirely omitted.',
  },
  s0094: {
    literal: 'At the end of the scroll there is no historian\'s judgment.',
    idiomatic: 'At the end of the scroll there is no historian\'s judgment.',
  },
  s0095: {
    literal: 'That it is not Shen Yue\'s writing is obvious.',
    idiomatic: 'That it is not Shen Yue\'s writing is obvious.',
  },
  s0096: {
    literal:
      'Presumably this chapter was long lost and later men pieced it together from other books, which is why the usage is so inconsistent."',
    idiomatic:
      'Presumably this chapter was long lost and later men pieced it together from other books, which is why the usage is so inconsistent."',
  },
  s0097: {
    literal:
      'At age ten he was made heir of the Duke of Yuzhang. According to Emperor Shao Yifu\'s birth in the second year of Yixi, and according to the Five Phases Treatise his appointment as heir of Yuzhang in the seventh year of Yixi, it should say six years old; this says ten years old—there is probably an error.',
    idiomatic:
      'At age ten he was made heir of the Duke of Yuzhang. According to Emperor Shao Yifu\'s birth in the second year of Yixi, and according to the Five Phases Treatise his appointment as heir of Yuzhang in the seventh year of Yixi, it should say six years old; this says ten years old—there is probably an error.',
  },
  s0098: {
    literal:
      'Sacrifice at the southern suburb on xinchou day. "Xinchou": all editions read "xinsi"; changed according to the Bureau edition and the History of the Southern Dynasties.',
    idiomatic:
      'Sacrifice at the southern suburb on xinchou day. "Xinchou": all editions read "xinsi"; changed according to the Bureau edition and the History of the Southern Dynasties.',
  },
  s0099: {
    literal:
      'According to that year\'s first month, new moon on jihai; there was no xinsi; on the third day was xinchou.',
    idiomatic:
      'According to that year\'s first month, new moon on jihai; there was no xinsi; on the third day was xinchou.',
  },
  s0100: {
    literal:
      'The barbarian general Daxi Ang captured Jinyong and advanced to besiege Hulao. According to the Wei History biography of Xi Jin, the one who besieged Hulao was Xi Jin; Jin\'s original surname was the Daxi clan.',
    idiomatic:
      'The barbarian general Daxi Ang captured Jinyong and advanced to besiege Hulao. According to the Wei History biography of Xi Jin, the one who besieged Hulao was Xi Jin; Jin\'s original surname was the Daxi clan.',
  },
  // batch 2
  s0101: {
    literal: '"Ang" must be a corruption of the character "Jin."',
    idiomatic: '"Ang" must be a corruption of the character "Jin."',
  },
  s0102: {
    literal:
      'Tuoba Mumo again sent the Prince of Anping, Shegui, to raid Qingzhou. Tuoba Mumo is the Wei ruler Tuoba Si.',
    idiomatic:
      'Tuoba Mumo again sent the Prince of Anping, Shegui, to raid Qingzhou. Tuoba Mumo is the Wei ruler Tuoba Si.',
  },
  s0103: {
    literal: 'Later in this scroll he is again called Si.',
    idiomatic: 'Later in this scroll he is again called Si.',
  },
  s0104: {
    literal:
      'Presumably because heterogeneous sources were drawn on, the names are inconsistent before and after.',
    idiomatic:
      'Presumably because heterogeneous sources were drawn on, the names are inconsistent before and after.',
  },
  s0105: {
    literal:
      '"Prince of Anping": all editions read "Prince of Ping\'an"; now following the Bureau edition.',
    idiomatic:
      '"Prince of Anping": all editions read "Prince of Ping\'an"; now following the Bureau edition.',
  },
  s0106: {
    literal:
      'According to the Barbarians biography: "In the first year of Jingping, the barbarians sent the Prince of Anping, Shegui, Fannengjian, and others to attack eastward and strike Qingzhou.',
    idiomatic:
      'According to the Barbarians biography: "In the first year of Jingping, the barbarians sent the Prince of Anping, Shegui, Fannengjian, and others to attack eastward and strike Qingzhou.',
  },
  s0107: {
    literal:
      '" Shegui Fannengjian is Shusun Jian; the Wei History has his biography; in the time of Emperor Daowu of Wei he was once granted the title Prince of Anping.',
    idiomatic:
      '" Shegui Fannengjian is Shusun Jian; the Wei History has his biography; in the time of Emperor Daowu of Wei he was once granted the title Prince of Anping.',
  },
  s0108: {
    literal:
      'Gengchen day. Zhang Zeng\'s Corrections in Reading History says: "The dingchou and gengchen entries are placed before the xinwei entry—this is an error.',
    idiomatic:
      'Gengchen day. Zhang Zeng\'s Corrections in Reading History says: "The dingchou and gengchen entries are placed before the xinwei entry—this is an error.',
  },
  s0109: {
    literal: '" According to Zhang, this is correct.',
    idiomatic: '" According to Zhang, this is correct.',
  },
  s0110: {
    literal:
      'In the second month the new moon was on wuchen; the fourth day was xinwei, the tenth day dingchou, the thirteenth day gengchen—xinwei should not come after gengchen.',
    idiomatic:
      'In the second month the new moon was on wuchen; the fourth day was xinwei, the tenth day dingchou, the thirteenth day gengchen—xinwei should not come after gengchen.',
  },
  s0111: {
    literal:
      'Ennobled Mengxun as General of Agile Cavalry. All editions lack the two characters "Agile Cavalry."',
    idiomatic:
      'Ennobled Mengxun as General of Agile Cavalry. All editions lack the two characters "Agile Cavalry."',
  },
  s0112: {
    literal:
      'According to the Annals of Emperor Wen in this book, in the second year of Yuanjia, the General of Agile Cavalry, Governor of Liangzhou, the Great Juqu Mengxun, was changed to General of Chariots and Cavalry.',
    idiomatic:
      'According to the Annals of Emperor Wen in this book, in the second year of Yuanjia, the General of Agile Cavalry, Governor of Liangzhou, the Great Juqu Mengxun, was changed to General of Chariots and Cavalry.',
  },
  s0113: {
    literal: 'Thus all editions together omit the two characters "Agile Cavalry."',
    idiomatic: 'Thus all editions together omit the two characters "Agile Cavalry."',
  },
  s0114: {
    literal: 'Now supplemented according to the History of the Southern Dynasties.',
    idiomatic: 'Now supplemented according to the History of the Southern Dynasties.',
  },
  s0115: {
    literal:
      'Sun Faguang of Fuyang rebelled. "Sun Faguang" in the biography of Chu Shudu is written "Sun Faliang."',
    idiomatic:
      'Sun Faguang of Fuyang rebelled. "Sun Faguang" in the biography of Chu Shudu is written "Sun Faliang."',
  },
  s0116: {
    literal:
      'The Governor of Kuaiji Chu Danzhi sent the Magistrate of Shanyin Lu Shao to attack and defeat him. "Chu Danzhi": all editions read "Chu Tan"; according to the biography of Chu Shudu, at the time the Governor of Kuaiji was Chu Danzhi—"Tan" is probably a graphic corruption of "Dan."',
    idiomatic:
      'The Governor of Kuaiji Chu Danzhi sent the Magistrate of Shanyin Lu Shao to attack and defeat him. "Chu Danzhi": all editions read "Chu Tan"; according to the biography of Chu Shudu, at the time the Governor of Kuaiji was Chu Danzhi—"Tan" is probably a graphic corruption of "Dan."',
  },
  s0117: {
    literal:
      'According to this, the final character "zhi" in names of the Northern and Southern Dynasties is sometimes omitted.',
    idiomatic:
      'According to this, the final character "zhi" in names of the Northern and Southern Dynasties is sometimes omitted.',
  },
  s0118: {
    literal:
      'Now "Tan" is still changed to "Dan," and the character "zhi" is supplemented.',
    idiomatic:
      'Now "Tan" is still changed to "Dan," and the character "zhi" is supplemented.',
  },
  s0119: {
    literal:
      'Killed the barbarian Administrator of Yingchuan Yu Long. "Yingchuan": all editions read "Yingzhou"; changed according to the biography of Liu Cui.',
    idiomatic:
      'Killed the enemy Administrator of Yingchuan Yu Long. "Yingchuan": all editions read "Yingzhou"; changed according to the biography of Liu Cui.',
  },
  s0120: {
    literal:
      'Because of drought, an edict pardoned offenders of five years\' punishment and below. All editions omit the character "punishment"; supplemented according to the History of the Southern Dynasties.',
    idiomatic:
      'Because of drought, an edict pardoned offenders of five years\' punishment and below. All editions omit the character "punishment"; supplemented according to the History of the Southern Dynasties.',
  },
  s0121: {
    literal:
      'Bingyin day of the twelfth month. According to the first year of Jingping, twelfth month new moon on guisi—there was no bingyin.',
    idiomatic:
      'Bingyin day of the twelfth month. According to the first year of Jingping, twelfth month new moon on guisi—there was no bingyin.',
  },
  s0122: {
    literal:
      'In spring of the second year, second month, new moon on guisi, there was an eclipse of the sun. "Second month, new moon on guisi": the Bureau edition agrees; the Song edition, Northern Directorate edition, Mao edition, Hall edition, and Zizhi Tongjian Collation citing Song Lue and Jiankang shilu read "first month, new moon on guisi"; the Song edition annals in the History of the Southern Dynasties read "second month, new moon on jimao."',
    idiomatic:
      'In spring of the second year, second month, new moon on guisi, there was an eclipse of the sun. "Second month, new moon on guisi": the Bureau edition agrees; the Song edition, Northern Directorate edition, Mao edition, Hall edition, and Zizhi Tongjian Collation citing Song Lue and Jiankang shilu read "first month, new moon on guisi"; the Song edition annals in the History of the Southern Dynasties read "second month, new moon on jimao."',
  },
  s0123: {
    literal:
      'According to Chen Yuan\'s table of new and intercalary moons, in the second year of Jingping the first month new moon was on guihai and the second month new moon on renchen.',
    idiomatic:
      'According to Chen Yuan\'s table of new and intercalary moons, in the second year of Jingping the first month new moon was on guihai and the second month new moon on renchen.',
  },
  s0124: {
    literal:
      'Checking the first month, there was no guisi; guisi was the second day of the second month.',
    idiomatic:
      'Checking the first month, there was no guisi; guisi was the second day of the second month.',
  },
  s0125: {
    literal:
      'Yet a solar eclipse should fall on the new-moon day; that year the first month had only twenty-nine days—those who made the second month new moon renchen probably erred in fixing the new moon.',
    idiomatic:
      'Yet a solar eclipse should fall on the new-moon day; that year the first month had only twenty-nine days—those who made the second month new moon renchen probably erred in fixing the new moon.',
  },
  s0126: {
    literal: 'The Treatise on the Five Phases in the Song History reads "second month, new moon on guisi."',
    idiomatic: 'The Treatise on the Five Phases in the Song History reads "second month, new moon on guisi."',
  },
  s0127: {
    literal: 'Now changed to follow the Bureau edition.',
    idiomatic: 'Now changed to follow the Bureau edition.',
  },
  s0128: {
    literal:
      'Yiwei day: the emperor\'s younger brother Yigong made General Who Establishes Champions and Inspector of South Yuzhou; yisi day: great wind. According to Chen Yuan\'s table, in the second year of Jingping the first month new moon was on guihai—there were no yiwei or yisi days that month.',
    idiomatic:
      'Yiwei day: the emperor\'s younger brother Yigong made General Who Establishes Champions and Inspector of South Yuzhou; yisi day: great wind. According to Chen Yuan\'s table, in the second year of Jingping the first month new moon was on guihai—there were no yiwei or yisi days that month.',
  },
  s0129: {
    literal:
      'Second month new moon on renchen; third day yiwei, thirteenth day yisi.',
    idiomatic:
      'Second month new moon on renchen; third day yiwei, thirteenth day yisi.',
  },
  s0130: {
    literal:
      'This proves that the spring first month above should read spring second month.',
    idiomatic:
      'This proves that the spring first month above should read spring second month.',
  },
  s0131: {
    literal:
      'Wang Hong, Inspector of Jiangzhou, and Tan Daoji, Inspector of South Yanzhou, came to court. All editions read "Tan Daoji, Inspector of Jiangzhou, and Wang Hong, Inspector of Yangzhou, came to court."',
    idiomatic:
      'Wang Hong, Inspector of Jiangzhou, and Tan Daoji, Inspector of South Yanzhou, came to court. All editions read "Tan Daoji, Inspector of Jiangzhou, and Wang Hong, Inspector of Yangzhou, came to court."',
  },
  s0132: {
    literal:
      'The Veritable Records of Jiankang read "Wang Hong, Inspector of Jiangzhou, and Tan Daoji, Inspector of South Yanzhou, came to court"—this is correct; now changed accordingly.',
    idiomatic:
      'The Veritable Records of Jiankang read "Wang Hong, Inspector of Jiangzhou, and Tan Daoji, Inspector of South Yanzhou, came to court"—this is correct; now changed accordingly.',
  },
  s0133: {
    literal:
      'Qian Daxin\'s Collected Variants in the Twenty-two Histories says: "According to this, at the time Tan Daoji was Inspector of South Yanzhou, not Jiangzhou;',
    idiomatic:
      'Qian Daxin\'s Collected Variants in the Twenty-two Histories says: "According to this, at the time Tan Daoji was Inspector of South Yanzhou, not Jiangzhou;',
  },
  s0134: {
    literal: 'Hong was Inspector of Jiangzhou, not Yangzhou.',
    idiomatic: 'Hong was Inspector of Jiangzhou, not Yangzhou.',
  },
  s0135: {
    literal:
      'Yangzhou administered the capital region; at the time the Minister of Works Xu Xianzhi held it concurrently."',
    idiomatic:
      'Yangzhou administered the capital region; at the time the Minister of Works Xu Xianzhi held it concurrently."',
  },
  s0136: {
    literal: 'What the annal records is all wrong."',
    idiomatic: 'What the annal records is all wrong."',
  },
  s0137: {
    literal: 'General Who Guards the West, the Prince of Yidu',
    idiomatic: 'General Who Guards the West, the Prince of Yidu',
  },
  s0138: {
    literal: '〈to〉',
    idiomatic: '〈text omitted at this point〉',
  },
  s0139: {
    literal:
      'Pressing her heart, she is overwhelmed. All editions omit this; now supplemented according to Yuan gui 188.',
    idiomatic:
      'Pressing her heart, she is overwhelmed. All editions omit this; now supplemented according to Yuan gui 188.',
  },
  s0140: {
    literal: 'At first Xu Xianzhi and Fu Liang were about to depose the emperor',
    idiomatic: 'At first Xu Xianzhi and Fu Liang were about to depose the emperor',
  },
  s0141: {
    literal: '〈to〉',
    idiomatic: '〈text omitted at this point〉',
  },
  s0142: {
    literal:
      'He was nineteen years old. This passage in the Song edition already had missing leaves.',
    idiomatic:
      'He was nineteen years old. This passage in the Song edition already had missing leaves.',
  },
  s0143: {
    literal:
      'The Northern Directorate edition, Mao edition, Hall edition, and Bureau edition supplemented according to the History of the Southern Dynasties.',
    idiomatic:
      'The Northern Directorate edition, Mao edition, Hall edition, and Bureau edition supplemented according to the History of the Southern Dynasties.',
  },
  s0144: {
    literal: 'It is still recorded here.',
    idiomatic: 'It is still recorded here.',
  },
  s0145: {
    literal:
      'The passage in which Xu Xianzhi, Fu Liang, Tan Daoji, Xie Hui, and the others entered the Cloud Dragon Gate to the Hualin Garden to depose Emperor Shao also appears in Shen Yue\'s Song History, biography of Xu Xianzhi.',
    idiomatic:
      'The passage in which Xu Xianzhi, Fu Liang, Tan Daoji, Xie Hui, and the others entered the Cloud Dragon Gate to the Hualin Garden to depose Emperor Shao also appears in Shen Yue\'s Song History, biography of Xu Xianzhi.',
  },
  s0146: {
    literal:
      'Tianyuan Pool: all editions read Tianquan Pool—probably following Li Yanshou\'s History of the Southern Dynasties to avoid the Tang taboo.',
    idiomatic:
      'Tianyuan Pool: all editions read Tianquan Pool—probably following Li Yanshou\'s History of the Southern Dynasties to avoid the Tang taboo.',
  },
  s0147: {
    literal:
      'Now still changed to Tianyuan Pool according to Shen Yue\'s Song History, biography of Xu Xianzhi.',
    idiomatic:
      'Now still changed to Tianyuan Pool according to Shen Yue\'s Song History, biography of Xu Xianzhi.',
  },
  s0148: {
    literal:
      'How hard it is! All editions omit this one line; only the Song edition underlying the Hanfenlou photolithographic Baona edition of the Hundred-Scroll edition has this surviving leaf.',
    idiomatic:
      'How hard it is! All editions omit this one line; only the Song edition underlying the Hanfenlou photolithographic Baona edition of the Hundred-Scroll edition has this surviving leaf.',
  },
  s0149: {
    literal:
      'Presumably it is the surviving closing line of the historian\'s judgment for this scroll.',
    idiomatic:
      'Presumably it is the surviving closing line of the historian\'s judgment for this scroll.',
  },
};

const mode = process.argv[2] || 'all';
const batch1 = new Set(
  Array.from({ length: 100 }, (_, i) => `s${String(i + 1).padStart(4, '0')}`)
);
const batch2 = new Set(
  Array.from({ length: 49 }, (_, i) => `s${String(i + 101).padStart(4, '0')}`)
);

let ids;
if (mode === 'batch1') ids = Object.keys(T).filter((k) => batch1.has(k));
else if (mode === 'batch2') ids = Object.keys(T).filter((k) => batch2.has(k));
else ids = Object.keys(T);

const file = 'translations/current_translation_songshu.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
let applied = 0;
for (const s of data.sentences) {
  const t = T[s.id];
  if (!t || !ids.includes(s.id)) continue;
  s.literal = t.literal;
  s.idiomatic = t.idiomatic;
  applied++;
}
fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Applied ${applied} translations (${mode}) to ${file}`);
