#!/usr/bin/env node
/**
 * Apply translations for songshu chapter 010.
 * Usage: node translations/patch_songshu_010.mjs [batch1|batch2|all]
 */
import fs from 'node:fs';

const T = {
  s0001: {
    literal:
      'Emperor Shun, taboo name Zhun, courtesy name Zhongmou, [1] childhood name Zhiguan, was the third son of Emperor Ming.',
    idiomatic:
      'Emperor Shun, taboo name Zhun, courtesy name Zhongmou, [1] childhood name Zhiguan, was the third son of Emperor Ming.',
  },
  s0002: {
    literal: 'He was born on the guichou day of the seventh month of the fifth year of Taishi.',
    idiomatic: 'He was born on the guichou day of the seventh month of the fifth year of Taishi.',
  },
  s0003: {
    literal: 'In the seventh year he was enfeoffed as Prince of Ancheng with a fief of three thousand households.',
    idiomatic: 'In the seventh year he was created Prince of Ancheng with a fief of three thousand households.',
  },
  s0004: {
    literal: 'He was at once appointed General Who Pacifies the Army, with aides and clerks established.',
    idiomatic: 'He was at once appointed General Who Pacifies the Army, with aides and clerks assigned.',
  },
  s0005: {
    literal: 'When the Deposed Emperor acceded, he became Inspector of Yangzhou.',
    idiomatic: 'When the Deposed Emperor acceded, he became Inspector of Yangzhou.',
  },
  s0006: {
    literal:
      'In the second year of Yuanhui he was advanced to General of Chariots and Cavalry and Commander-in-Chief of all military affairs in Yang, South Yu, and Xu provinces, granted one set of martial pipes and drums, and remained Inspector as before.',
    idiomatic:
      'In the second year of Yuanhui he was promoted to General of Chariots and Cavalry and Commander-in-Chief of all military affairs in Yang, South Yu, and Xu provinces, granted one set of martial pipes and drums, and remained Inspector as before.',
  },
  s0007: {
    literal:
      'In the fourth year he was further advanced to Grand General of Agile Cavalry with the Baimen of the Three Ministries, thirty ceremonial swords, and remained Commander-in-Chief and Inspector as before.',
    idiomatic:
      'In the fourth year he was further promoted to Grand General of Agile Cavalry with Baimen equal to the Three Ministries, thirty ceremonial swords, and remained Commander-in-Chief and Inspector as before.',
  },
  s0008: {
    literal:
      'On the night of the wuzi day of the seventh month of the fifth year of Yuanhui, the Deposed Emperor died; the king was welcomed and entered to dwell in the court hall.',
    idiomatic:
      'On the night of the wuzi day of the seventh month of the fifth year of Yuanhui, the Deposed Emperor died; the prince was escorted into the court hall.',
  },
  s0009: {
    literal: 'On the renchen day he assumed the imperial throne.',
    idiomatic: 'On the renchen day he ascended the throne.',
  },
  s0010: {
    literal:
      'In the first year of Shengming the era name was changed, a general amnesty was proclaimed throughout the realm, and civil and military officials were granted two ranks in status.',
    idiomatic:
      'In the first year of Shengming the era name was changed, a general amnesty was proclaimed, and civil and military officials were advanced two ranks in status.',
  },
  s0011: {
    literal:
      'On the jiawu day the Prince of Qi, General Who Pacifies the Army, went out to garrison the Eastern Fortress and served as regent and chancellor.',
    idiomatic:
      'On the jiawu day the Prince of Qi, General Who Pacifies the Army, went out to garrison the Eastern Fortress and took up regency as chancellor.',
  },
  s0012: {
    literal:
      'On the bingyin day an edict said: "Ceasing construction on the Terrace of Dew shed light on Han virtue;',
    idiomatic:
      'On the bingyin day an edict said: "Ceasing construction on the Terrace of Dew shed light on Han virtue;',
  },
  s0013: {
    literal: 'burning the pheasant-fur robe exalted the way of Jin.',
    idiomatic: 'burning the pheasant-fur robe exalted the way of Jin.',
  },
  s0014: {
    literal:
      'Thus extravagance is checked to transform customs, and thrift is honored to govern the people.',
    idiomatic:
      'Thus extravagance is checked to transform customs, and thrift is honored to govern the people.',
  },
  s0015: {
    literal:
      'Recently the imperial domain has not been tranquil; armies have campaigned year after year; stored supplies are repeatedly depleted and toil and exhaustion never ease.',
    idiomatic:
      'Recently the realm has not been at peace; armies have campaigned year after year; granaries stand empty again and again, and exhaustion never lets up.',
  },
  s0016: {
    literal:
      'Yet vermilion and cinnabar ornament wastes beyond reckoning, and treasure outlays for tribute levies cannot be calculated.',
    idiomatic:
      'Yet lacquer and cinnabar ornament consume resources beyond measure, and treasure levies cannot be reckoned.',
  },
  s0017: {
    literal:
      'Now carriage robes and ritual regalia truly ought to be reduced in scale, so that emblems and insignia keep their order and excess not be allowed.',
    idiomatic:
      'Carriage dress and ritual regalia should now be pared back, so that ranks and insignia stay in order and excess is not permitted.',
  },
  s0018: {
    literal: 'The two bureaus of the Inner Palace may be abolished.',
    idiomatic: 'The two bureaus of the Inner Palace are to be abolished.',
  },
  s0019: {
    literal:
      'All ingenious carving and fine chasing that harm customs and ruin governance—every one is forbidden.',
    idiomatic:
      'Every sort of ornate carving and fine chasing that harms custom and undermines good government is forbidden.',
  },
  s0020: {
    literal: 'Thus may the canonical law shine forever and this inaugural governance be enlarged."',
    idiomatic: 'May the statutes shine forever and this new rule be broadly proclaimed."',
  },
  s0021: {
    literal:
      'The General Who Conquers the West and Inspector of Jingzhou Shen Youzhi was advanced to General of Chariots and Cavalry with Baimen equal to the Three Ministries; the Vice Director of the Masters of Writing, Central Army Commander, General Who Pacifies the Army, and Inspector of South Yanzhou, the Prince of Qi, was made Minister of Works, Recording Secretary, and Grand General of Agile Cavalry, remaining Inspector as before; Master of Writing, Guards General, Baimen equal to the Three Ministries; the General Who Pacifies the Army Liu Bing was made Director of the Masters of Writing and additionally Central Army Commander; [2] the General Who Pacifies the West and Inspector of Yingzhou, Prince of Jinxi Xie, was made General Who Pacifies the Army and Inspector of Yangzhou; the Prince of Nanyang Hui was made Inspector of Yingzhou.',
    idiomatic:
      'Shen Youzhi, General Who Conquers the West and Inspector of Jingzhou, was promoted to General of Chariots and Cavalry with Baimen equal to the Three Ministries; the Prince of Qi, Vice Director of the Masters of Writing, Central Army Commander, General Who Pacifies the Army, and Inspector of South Yanzhou, was appointed Minister of Works, Recording Secretary, and Grand General of Agile Cavalry, remaining Inspector as before; Master of Writing, Guards General, Baimen equal to the Three Ministries; Liu Bing, General Who Pacifies the Army, was appointed Director of the Masters of Writing and additionally Central Army Commander; [2] Xie, Prince of Jinxi, General Who Pacifies the West and Inspector of Yingzhou, was appointed General Who Pacifies the Army and Inspector of Yangzhou; Prince of Nanyang Hui was appointed Inspector of Yingzhou.',
  },
  s0022: {
    literal:
      'On the xinchou day the Vice Director of the Masters of Writing Wang Sengqian was made Director of the Masters of Writing; the Right Guards General Liu Yun was made Central Army Commander; the Grandee of Splendid Gold and Purple Guanglu Wang Kun was made Right Grandee of Splendid Service.',
    idiomatic:
      'On the xinchou day Wang Sengqian, Vice Director of the Masters of Writing, was appointed Director of the Masters of Writing; Liu Yun, Right Guards General, was appointed Central Army Commander; Wang Kun, Grandee of Splendid Gold and Purple Guanglu, was appointed Right Grandee of Splendid Service.',
  },
  s0023: {
    literal: 'Five million cash and five thousand bolts of cloth were granted to the Prince of Qi, Minister of Works.',
    idiomatic: 'Five million cash and five thousand bolts of cloth were granted to the Prince of Qi, Minister of Works.',
  },
  s0024: {
    literal: 'On the guimao day the imperial carriage visited the Ancestral Temple.',
    idiomatic: 'On the guimao day the emperor visited the Ancestral Temple.',
  },
  s0025: {
    literal:
      'On the bingwu day the Anxi staff officer Ming Qingfu was made Inspector of Qing and Ji provinces; the Prince of Wuling Zan was made Inspector of Yingzhou; the newly appointed Inspector of Yingzhou, Prince of Nanyang Hui, was made Inspector of Xiangzhou; the Prince of Qi, Minister of Works and Inspector of South Yanzhou, was changed to hold concurrently the post of Inspector of South Xuzhou; Li Anmin, General Who Conquers the Barbarians, was made Inspector of South Yanzhou.',
    idiomatic:
      'On the bingwu day Ming Qingfu, staff officer of Anxi, was appointed Inspector of Qing and Ji provinces; Prince of Wuling Zan was appointed Inspector of Yingzhou; Prince of Nanyang Hui, newly appointed Inspector of Yingzhou, was appointed Inspector of Xiangzhou; the Prince of Qi, Minister of Works and Inspector of South Yanzhou, was reassigned to hold concurrently Inspector of South Xuzhou; Li Anmin, General Who Conquers the Barbarians, was appointed Inspector of South Yanzhou.',
  },
  s0026: {
    literal:
      'On the jichou day of the ninth month an edict said: "When the sage kings passed away, pure custom already declined; the Tortoise Book was forever submerged and the Dragon Chart long concealed.',
    idiomatic:
      'On the jichou day of the ninth month an edict said: "When the sage kings passed away, pure custom had already decayed; the Tortoise Book lay forever hidden and the Dragon Chart long sealed away.',
  },
  s0027: {
    literal:
      'Thus at the end of the Three Dynasties, virtue and punishment mutually encroached; the age sank into wrangling over things, the Way broke down and men flattered.',
    idiomatic:
      'Thus at the end of the Three Dynasties virtue and punishment encroached on one another; the age sank into contention over things, the Way collapsed, and men traded in flattery.',
  },
  s0028: {
    literal:
      'Yet upright gentlemen were still numerous as wagon hubs, and extraordinary talents followed in unbroken succession.',
    idiomatic:
      'Yet upright gentlemen still thronged like spokes at a hub, and extraordinary talents came one after another.',
  },
  s0029: {
    literal:
      'We have inherited the golden pivot of fortune and received the jade pole of numinous mandate; bearing the screen at court we govern without rest, forgetting weariness at day\'s end, ever speaking of rise and fall, looking to antiquity with full concern.',
    idiomatic:
      'We have inherited the golden pivot of the age and received the jade axis of the mandate; seated behind the screen we govern without rest, forgetting fatigue at day\'s end, ever pondering rise and fall and looking to antiquity with full concern.',
  },
  s0030: {
    literal:
      'The archives of Zhou and Xia are still preserved in silk volumes; remaining writings of Han and Wei are spread among the registers.',
    idiomatic:
      'The records of Zhou and Xia still survive in silk volumes; the remaining writings of Han and Wei lie spread among the registers.',
  },
  s0031: {
    literal:
      'Therefore in the Yuanshou era the institution for eminent talent was raised, and in the Dijie era the rank for lone excellence was created.',
    idiomatic:
      'Therefore in the Yuanshou era the eminent-talent institution was established, and in the Dijie era the rank for lone excellence was created.',
  },
  s0032: {
    literal: 'To brace the cords and hold fast to the root lies in obtaining men.',
    idiomatic: 'To brace the framework and hold to the root lies in finding the right men.',
  },
  s0033: {
    literal:
      'Now this may be proclaimed to the provinces and commanderies: search out the hidden and remote, take specimens from villages and hamlets, and recommend by name to the court.',
    idiomatic:
      'Let this now be proclaimed through the provinces and commanderies: search out the hidden and remote, gather talent from villages and hamlets, and recommend them by name to the throne.',
  },
  s0034: {
    literal: 'We shall personally review them and distinguish their outstanding excellence.',
    idiomatic: 'We shall personally examine them and distinguish the truly outstanding.',
  },
  s0035: {
    literal:
      'Thus no worthy shall be left in the wilds, and distant fragrance shall be stirred forever."',
    idiomatic:
      'Thus no worthy shall be left in obscurity, and distant virtue shall be stirred forever."',
  },
  s0036: {
    literal: 'On the jiyou day Prince of Luling Hao died.',
    idiomatic: 'On the jiyou day Prince of Luling Hao died.',
  },
  s0037: {
    literal: 'In winter, on the jiyou day of the eleventh month, [4] Wa sent envoys presenting local products.',
    idiomatic: 'In winter, on the jiyou day of the eleventh month, [4] Wa sent envoys presenting tribute goods.',
  },
  s0038: {
    literal:
      'On the bingwu day the Supernumerary Palace Attendant Hu Xiansheng acted as Inspector of Yuezhou, and Shen Jingde, Inspector of Jiaozhou, was made Inspector of Guangzhou.',
    idiomatic:
      'On the bingwu day Hu Xiansheng, Supernumerary Palace Attendant, was dispatched as Inspector of Yuezhou, and Shen Jingde, Inspector of Jiaozhou, was appointed Inspector of Guangzhou.',
  },
  s0039: {
    literal:
      'On the dingsi day of the twelfth month Wang Guangzhi, General of Agile Cavalry, was made Inspector of Xuzhou.',
    idiomatic:
      'On the dingsi day of the twelfth month Wang Guangzhi, General of Agile Cavalry, was appointed Inspector of Xuzhou.',
  },
  s0040: {
    literal: 'Shen Youzhi, General of Chariots and Cavalry and Inspector of Jingzhou, raised troops in rebellion.',
    idiomatic: 'Shen Youzhi, General of Chariots and Cavalry and Inspector of Jingzhou, rose in rebellion.',
  },
  s0041: {
    literal:
      'On the dingmao day the Recording Secretary, the Prince of Qi, entered to guard the court hall, and the Palace Attendant Xiao Luan garrisoned the Eastern Palace.',
    idiomatic:
      'On the dingmao day the Recording Secretary, the Prince of Qi, entered to guard the court hall, and Palace Attendant Xiao Luan garrisoned the Eastern Palace.',
  },
  s0042: {
    literal: 'On the wuchen day martial law was imposed within and without.',
    idiomatic: 'On the wuchen day martial law was imposed within and without the capital.',
  },
  s0043: {
    literal:
      'On the jisi day the Prince of Wuling Zan, Inspector of Yingzhou, was made General Who Pacifies the West and Inspector of Jingzhou; Zhang Jinger, General Who Conquers the Barbarians and Inspector of Yongzhou, was advanced to General Who Pacifies the Army.',
    idiomatic:
      'On the jisi day Prince of Wuling Zan, Inspector of Yingzhou, was appointed General Who Pacifies the West and Inspector of Jingzhou; Zhang Jinger, General Who Conquers the Barbarians and Inspector of Yongzhou, was promoted to General Who Pacifies the Army.',
  },
  s0044: {
    literal:
      'Huang Hui, Right Guards General, was made General Who Pacifies the West and Inspector of Yingzhou, commanding the vanguard armies in the southern campaign.',
    idiomatic:
      'Huang Hui, Right Guards General, was appointed General Who Pacifies the West and Inspector of Yingzhou, commanding the vanguard in the southern expedition.',
  },
  s0045: {
    literal:
      'Lu Anguo, General Who Conquers the Barbarians, was made Inspector of Xiangzhou; Wang Kuan, Director of Palace Affairs, was additionally made General Who Pacifies the West.',
    idiomatic:
      'Lu Anguo, General Who Conquers the Barbarians, was appointed Inspector of Xiangzhou; Wang Kuan, Director of Palace Affairs, was additionally appointed General Who Pacifies the West.',
  },
  s0046: {
    literal:
      'On the gengwu day the newly appointed Left Guards General, heir of the Prince of Qi, escorted the newly appointed General Who Pacifies the Army and Inspector of Yangzhou, Prince of Jinxi Xie, to garrison Pencheng at Xunyang.',
    idiomatic:
      'On the gengwu day the newly appointed Left Guards General, heir of the Prince of Qi, escorted the newly appointed General Who Pacifies the Army and Inspector of Yangzhou, Prince of Jinxi Xie, to garrison Pencheng at Xunyang.',
  },
  s0047: {
    literal:
      'On the renshen day Zhou Panlong, General of Agile Cavalry, was made Inspector of Guangzhou.',
    idiomatic:
      'On the renshen day Zhou Panlong, General of Agile Cavalry, was appointed Inspector of Guangzhou.',
  },
  s0048: {
    literal:
      'That day Minister over the Masses Yuan Can held Stone City in rebellion; the Director of the Masters of Writing Liu Bing, the Gentleman Attendant of the Yellow Gate Liu Shu, and the General Who Establishes Champions Wang Yun led troops to join him.',
    idiomatic:
      'That same day Minister over the Masses Yuan Can seized Stone City in rebellion; Director of the Masters of Writing Liu Bing, Gentleman Attendant of the Yellow Gate Liu Shu, and General Who Establishes Champions Wang Yun led troops to his side.',
  },
  s0049: {
    literal:
      'Huang Hui and the General Who Assists the State Sun Tanxuan, Commandant of Valiant Cavalry Wang Yixing, General Who Assists the State Ren Houbo, and General of the Left Army Peng Wenzhi secretly responded in concert.',
    idiomatic:
      'Huang Hui, Sun Tanxuan, General Who Assists the State, Commandant of Valiant Cavalry Wang Yixing, General Who Assists the State Ren Houbo, and General of the Left Army Peng Wenzhi secretly acted in concert.',
  },
  s0050: {
    literal:
      'Central Army Commander Liu Yun and the Direct Attendant Bo Xing plotted together inside the palace.',
    idiomatic:
      'Central Army Commander Liu Yun and Direct Attendant Bo Xing plotted together inside the palace.',
  },
  s0051: {
    literal: 'The Recording Secretary, the Prince of Qi, executed Yun and the others inside the Secretariat.',
    idiomatic: 'The Recording Secretary, the Prince of Qi, executed Yun and the others inside the Secretariat.',
  },
  s0052: {
    literal:
      'The army commanders Su Lie, Wang Tiansheng, Xue Daoyuan, Dai Sengjing, and others took Stone City and beheaded Can inside the walls.',
    idiomatic:
      'Army commanders Su Lie, Wang Tiansheng, Xue Daoyuan, and Dai Sengjing took Stone City and beheaded Can within the walls.',
  },
  s0053: {
    literal:
      'Bing, Shu, and Yun fled over the wall; they were pursued and captured, and all were executed.',
    idiomatic:
      'Bing, Shu, and Yun fled over the wall; pursued and captured, they were all executed.',
  },
  s0054: {
    literal: 'The rest were not prosecuted.',
    idiomatic: 'The rest were not prosecuted.',
  },
  s0055: {
    literal:
      'Liu Huaizhen, Inspector of Yuzhou; Zhang Jinger, Inspector of Yongzhou; and Chen Xianda, Inspector of Guangzhou, all raised righteous armies.',
    idiomatic:
      'Liu Huaizhen, Inspector of Yuzhou; Zhang Jinger, Inspector of Yongzhou; and Chen Xianda, Inspector of Guangzhou, all raised loyal forces.',
  },
  s0056: {
    literal:
      'Yao Daohuo, Inspector of Sizhou; Fan Bonian, Inspector of Liangzhou; and Yu Peiyu, acting for Xiangzhou, all mustered troops with divided loyalties.',
    idiomatic:
      'Yao Daohuo, Inspector of Sizhou; Fan Bonian, Inspector of Liangzhou; and Yu Peiyu, acting for Xiangzhou, all raised forces with divided loyalties.',
  },
  s0057: {
    literal: 'On the jiaxu day a general amnesty was proclaimed throughout the realm.',
    idiomatic: 'On the jiaxu day a general amnesty was proclaimed.',
  },
  s0058: {
    literal:
      'On the yihai day Wang Sengqian, Director of the Masters of Writing, was made Vice Director of the Masters of Writing; Wang Yanzhi, newly appointed Master of Writing, was made Vice Director of the Masters of Writing.',
    idiomatic:
      'On the yihai day Wang Sengqian, Director of the Masters of Writing, was appointed Vice Director of the Masters of Writing; Wang Yanzhi, newly appointed Master of Writing, was appointed Vice Director of the Masters of Writing.',
  },
  s0059: {
    literal:
      'Liu Xia, Governor of Wu Commandery, held the commandery in rebellion; Zhang Gui, General Who Assists the State, attacked and beheaded him.',
    idiomatic:
      'Liu Xia, Governor of Wu Commandery, rebelled and held the commandery; Zhang Gui, General Who Assists the State, attacked and killed him.',
  },
  s0060: {
    literal:
      'In the intercalary month, on the xinsi day, Wang Yixing, Commandant of Valiant Cavalry, was guilty and executed.',
    idiomatic:
      'In the intercalary month, on the xinsi day, Wang Yixing, Commandant of Valiant Cavalry, was found guilty and executed.',
  },
  s0061: {
    literal:
      'On the guisi day Shen Youzhi attacked and besieged Yingcheng; Liu Shilong, chief clerk of the vanguard, held firm in defense.',
    idiomatic:
      'On the guisi day Shen Youzhi besieged Yingcheng; Liu Shilong, chief clerk of the vanguard, held firm in defense.',
  },
  s0062: {
    literal:
      'Youzhi\'s younger brother Dengzhi made trouble in Wuxing; Shen Wenji, Governor of Wuxing, attacked and beheaded him.',
    idiomatic:
      'Youzhi\'s younger brother Dengzhi rose in revolt in Wuxing; Shen Wenji, Governor of Wuxing, attacked and killed him.',
  },
  s0063: {
    literal:
      '[5] On the jihai day martial law was imposed within and without, and the Recording Secretary, the Prince of Qi, was lent the yellow battle-axe.',
    idiomatic:
      '[5] On the jihai day martial law was imposed within and without the capital, and the Recording Secretary, the Prince of Qi, was granted the yellow battle-axe.',
  },
  s0064: {
    literal:
      'On the xinchou day Yang Wendu, General of Pacifying the North and Inspector of North Qinzhou, Prince of Wudu, was advanced to General Who Conquers the West.',
    idiomatic:
      'On the xinchou day Yang Wendu, General of Pacifying the North and Inspector of North Qinzhou, Prince of Wudu, was promoted to General Who Conquers the West.',
  },
  s0065: {
    literal: '[6] On the yisi day the Recording Secretary, the Prince of Qi, went out and encamped at Xinting.',
    idiomatic: '[6] On the yisi day the Recording Secretary, the Prince of Qi, went out and encamped at Xinting.',
  },
  s0066: {
    literal:
      'In spring of the second year, the first month, Shen Youzhi sent the general Gongsun Fangping to hold Xiyang; on the xinyou day Zhang Mo, Governor of Jianning, attacked and defeated him.',
    idiomatic:
      'In spring of the second year, the first month, Shen Youzhi sent the general Gongsun Fangping to hold Xiyang; on the xinyou day Zhang Mo, Governor of Jianning, attacked and defeated him.',
  },
  s0067: {
    literal: 'On the dingmao day Shen Youzhi fled in rout from Yingcheng.',
    idiomatic: 'On the dingmao day Shen Youzhi fled in rout from Yingcheng.',
  },
  s0068: {
    literal: 'On the jisi day the people of Huarong district beheaded him and sent his head.',
    idiomatic: 'On the jisi day the people of Huarong district killed him and sent his head.',
  },
  s0069: {
    literal:
      'Liu Huaizhen, General of the Left Army and Inspector of Yuzhou, was advanced to General Who Pacifies the South.',
    idiomatic:
      'Liu Huaizhen, General of the Left Army and Inspector of Yuzhou, was promoted to General Who Pacifies the South.',
  },
  s0070: {
    literal:
      'On the xinwei day Zhang Jinger, General Who Pacifies the Army and Inspector of Yongzhou, took Jiangling, beheaded Youzhi\'s son Guangyan, pacified Jingzhou, and all fellow rebels were executed.',
    idiomatic:
      'On the xinwei day Zhang Jinger, General Who Pacifies the Army and Inspector of Yongzhou, took Jiangling, beheaded Youzhi\'s son Guangyan, pacified Jingzhou, and all fellow rebels were executed.',
  },
  s0071: {
    literal: 'On the bingzi day martial law was lifted.',
    idiomatic: 'On the bingzi day martial law was lifted.',
  },
  s0072: {
    literal:
      'The newly appointed Palace Attendant Liu Shilong was made Vice Director of the Masters of Writing.',
    idiomatic:
      'Liu Shilong, newly appointed Palace Attendant, was appointed Vice Director of the Masters of Writing.',
  },
  s0073: {
    literal: 'That day the Recording Secretary, the Prince of Qi, returned to garrison the Eastern Palace.',
    idiomatic: 'That same day the Recording Secretary, the Prince of Qi, returned to garrison the Eastern Palace.',
  },
  s0074: {
    literal:
      'On the dingchou day the Prince of Shaoling You was made General Who Pacifies the South and Inspector of South Yuzhou.',
    idiomatic:
      'On the dingchou day Prince of Shaoling You was appointed General Who Pacifies the South and Inspector of South Yuzhou.',
  },
  s0075: {
    literal:
      '[7] The Left Guards General, heir of the Prince of Qi, was made Inspector of Jiangzhou; the Palace Attendant Xiao Luan was made Commander of the Guards; Zhang Jinger, General Who Pacifies the Army and Inspector of Yongzhou, was advanced to General Who Conquers the West; Huang Hui, General Who Pacifies the West and Inspector of Yingzhou, was advanced to General Who Pacifies the West.',
    idiomatic:
      '[7] The Left Guards General, heir of the Prince of Qi, was appointed Inspector of Jiangzhou; Palace Attendant Xiao Luan was appointed Commander of the Guards; Zhang Jinger, General Who Pacifies the Army and Inspector of Yongzhou, was promoted to General Who Conquers the West; Huang Hui, General Who Pacifies the West and Inspector of Yingzhou, was promoted to General Who Pacifies the West.',
  },
  s0076: {
    literal:
      'On the gengchen day of the second month Wang Sengqian, Vice Director of the Masters of Writing, was made Director of the Masters of Writing; Wang Yanzhi, Vice Director of the Masters of Writing, was made Vice Director of the Masters of Writing.',
    idiomatic:
      'On the gengchen day of the second month Wang Sengqian, Vice Director of the Masters of Writing, was appointed Director of the Masters of Writing; Wang Yanzhi, Vice Director of the Masters of Writing, was appointed Vice Director of the Masters of Writing.',
  },
  s0077: {
    literal:
      'On the guiwei day the Recording Secretary, the Prince of Qi, was additionally invested as Grand Commandant; Chu Yuan, Guards General, was made Master of Writing and Minister of Works.',
    idiomatic:
      'On the guiwei day the Recording Secretary, the Prince of Qi, was additionally appointed Grand Commandant; Chu Yuan, Guards General, was appointed Master of Writing and Minister of Works.',
  },
  s0078: {
    literal: 'On the jiashen day a partial amnesty was proclaimed for Jingzhou.',
    idiomatic: 'On the jiashen day a partial amnesty was proclaimed for Jingzhou.',
  },
  s0079: {
    literal:
      'On the bingxu day Prince of Jinxi Xie, General Who Pacifies the Army and Inspector of Yangzhou, was advanced to Central Army Commander with Baimen equal to the Three Ministries.',
    idiomatic:
      'On the bingxu day Prince of Jinxi Xie, General Who Pacifies the Army and Inspector of Yangzhou, was promoted to Central Army Commander with Baimen equal to the Three Ministries.',
  },
  s0080: {
    literal:
      'On the wuzi day the grain tax and cloth levy for three years were remitted for residents along the Han in Yongzhou who had earlier suffered flood disaster.',
    idiomatic:
      'On the wuzi day grain tax and cloth levy were remitted for three years for residents along the Han in Yongzhou who had earlier suffered flooding.',
  },
  s0081: {
    literal:
      'On the xinmao day Huang Hui, Inspector of Yingzhou and newly appointed General Who Pacifies the South, was made General Who Pacifies the North and Inspector of South Yanzhou; Li Anmin, Inspector of South Yanzhou, was made Inspector of Yingzhou.',
    idiomatic:
      'On the xinmao day Huang Hui, Inspector of Yingzhou and newly appointed General Who Pacifies the South, was appointed General Who Pacifies the North and Inspector of South Yanzhou; Li Anmin, Inspector of South Yanzhou, was appointed Inspector of Yingzhou.',
  },
  s0082: {
    literal: 'On the guisi day Fu Yan of Shanyin was made Inspector of Yizhou.',
    idiomatic: 'On the guisi day Fu Yan of Shanyin was appointed Inspector of Yizhou.',
  },
  s0083: {
    literal:
      'On the bingshen day Peng Wenzhi, General of the Left Army, was guilty, imprisoned, and died.',
    idiomatic:
      'On the bingshen day Peng Wenzhi, General of the Left Army, was found guilty, imprisoned, and died.',
  },
  s0084: {
    literal:
      'Ren Houbo, acting for Xiangzhou, killed the former Xiangzhou acting officer Yu Peiyu and sent his head to the capital.',
    idiomatic:
      'Ren Houbo, acting for Xiangzhou, killed the former acting officer of Xiangzhou Yu Peiyu and sent his head to the capital.',
  },
  s0085: {
    literal:
      'On the gengxu day of the third month Zhou Panlong, Inspector of Guangzhou, was made Inspector of Sizhou; Liu Jun, General Who Assists the State, was made Inspector of Guangzhou.',
    idiomatic:
      'On the gengxu day of the third month Zhou Panlong, Inspector of Guangzhou, was appointed Inspector of Sizhou; Liu Jun, General Who Assists the State, was appointed Inspector of Guangzhou.',
  },
  s0086: {
    literal: 'On the bingzi day the canopy of feathers and martial pipes and drums were granted to the Prince of Qi, Grand Commandant.',
    idiomatic: 'On the bingzi day the canopy of feathers and martial pipes and drums were granted to the Prince of Qi, Grand Commandant.',
  },
  s0087: {
    literal:
      'In summer, the fourth month, on the jimao day Yuan Chongzu, General of the Mobile Corps, was made Inspector of Yanzhou.',
    idiomatic:
      'In summer, the fourth month, on the jimao day Yuan Chongzu, General of the Mobile Corps, was appointed Inspector of Yanzhou.',
  },
  s0088: {
    literal:
      'On the xinmao day Huang Hui, newly appointed General Who Pacifies the North and Inspector of South Yanzhou, was guilty and ordered to die.',
    idiomatic:
      'On the xinmao day Huang Hui, newly appointed General Who Pacifies the North and Inspector of South Yanzhou, was found guilty and ordered to die.',
  },
  s0089: {
    literal:
      'On the jiawu day Xiao Ying, General Who Assists the State and Governor of Huainan and Xuancheng, acted as Inspector of South Yanzhou.',
    idiomatic:
      'On the jiawu day Xiao Ying, General Who Assists the State and Governor of Huainan and Xuancheng, acted as Inspector of South Yanzhou.',
  },
  s0090: {
    literal:
      'On the wuwu day of the fifth month the King of Wa, Bu, sent envoys presenting local products; Bu was made General Who Pacifies the East.',
    idiomatic:
      'On the wuwu day of the fifth month the King of Wa, Bu, sent envoys presenting tribute; Bu was created General Who Pacifies the East.',
  },
  s0091: {
    literal:
      'Ren Houbo, General Who Assists the State and acting for Xiangzhou, was guilty and executed.',
    idiomatic:
      'Ren Houbo, General Who Assists the State and acting for Xiangzhou, was found guilty and executed.',
  },
  s0092: {
    literal:
      'On the jichou day of the sixth month Zhao Chaomin, former Governor of Xinping, was made Inspector of Jiaozhou.',
    idiomatic:
      'On the jichou day of the sixth month Zhao Chaomin, former Governor of Xinping, was appointed Inspector of Jiaozhou.',
  },
  s0093: {
    literal:
      'On the dingyou day Yang Wenhong, General Who Assists the State, was made Inspector of North Qinzhou and Prince of Wudu.',
    idiomatic:
      'On the dingyou day Yang Wenhong, General Who Assists the State, was appointed Inspector of North Qinzhou and created Prince of Wudu.',
  },
  s0094: {
    literal:
      'On the xinmao day of the eighth month the Prince of Qi, Grand Commandant, memorialized to forbid extravagant ornament and splendid dress, fourteen articles in all.',
    idiomatic:
      'On the xinmao day of the eighth month the Prince of Qi, Grand Commandant, memorialized to forbid extravagant ornament and splendid dress, fourteen articles in all.',
  },
  s0095: {
    literal:
      '[8] On the yiwei day the heir of the Prince of Qi, Inspector of Jiangzhou, was made Commander of the Guards and General Who Pacifies the Army.',
    idiomatic:
      '[8] On the yiwei day the heir of the Prince of Qi, Inspector of Jiangzhou, was appointed Commander of the Guards and General Who Pacifies the Army.',
  },
  s0096: {
    literal: 'On the bingshen day Xiao Luan, Commander of the Guards, was made Inspector of Jiangzhou.',
    idiomatic: 'On the bingshen day Xiao Luan, Commander of the Guards, was appointed Inspector of Jiangzhou.',
  },
  s0097: {
    literal: 'On the first day of the ninth month, the day yisi, there was an eclipse of the sun.',
    idiomatic: 'On the new moon of the ninth month, the day yisi, there was a solar eclipse.',
  },
  s0098: {
    literal:
      'On the bingwu day the Prince of Qi, Grand Commandant, was additionally granted the yellow battle-axe, made Commander-in-Chief of all military affairs within and without, and appointed Grand Preceptor, holding concurrently the governorship of Yangzhou; he was permitted sword and shoes in the palace hall, not to quicken his step on entering court, and not to have his name spoken in congratulatory address.',
    idiomatic:
      'On the bingwu day the Prince of Qi, Grand Commandant, was additionally granted the yellow battle-axe, made Commander-in-Chief of all military affairs within and without, and appointed Grand Preceptor, holding concurrently the governorship of Yangzhou; he was permitted sword and shoes in the palace hall, not to quicken his step on entering court, and not to have his name spoken in congratulatory address.',
  },
  s0099: {
    literal:
      'Left and right chief clerks, marshals, attendants, aides, and subordinates were established, four of each.',
    idiomatic:
      'Left and right chief clerks, marshals, attendants, aides, and subordinates were established, four of each.',
  },
  s0100: {
    literal:
      'Prince of Jinxi Xie, Central Army Commander and Inspector of Yangzhou, was made Minister over the Masses.',
    idiomatic:
      'Prince of Jinxi Xie, Central Army Commander and Inspector of Yangzhou, was appointed Minister over the Masses.',
  },
  s0101: {
    literal:
      'On the wushen day Xiao Ying, acting Inspector of South Yanzhou, was made Inspector of South Yanzhou.',
    idiomatic:
      'On the wushen day Xiao Ying, acting Inspector of South Yanzhou, was appointed Inspector of South Yanzhou.',
  },
  s0102: {
    literal: 'On the jiayin day three imperial lookout chariots were granted to the Prince of Qi, Grand Preceptor.',
    idiomatic: 'On the jiayin day three imperial lookout chariots were granted to the Prince of Qi, Grand Preceptor.',
  },
  s0103: {
    literal: 'On the jiwei day Ruru sent envoys presenting local products.',
    idiomatic: 'On the jiwei day Ruru sent envoys presenting tribute.',
  },
  s0104: {
    literal:
      'On the guiyou day Zhang Dan, Interior Secretary of Wuling, was guilty, imprisoned, and died.',
    idiomatic:
      'On the guiyou day Zhang Dan, Interior Secretary of Wuling, was found guilty, imprisoned, and died.',
  },
  s0105: {
    literal:
      'On the dingchou day of the tenth month Xiao Huang, General of Pacifying the North and Governor of Huainan and Xuancheng, was made Inspector of Yuzhou.',
    idiomatic:
      'On the dingchou day of the tenth month Xiao Huang, General of Pacifying the North and Governor of Huainan and Xuancheng, was appointed Inspector of Yuzhou.',
  },
  s0106: {
    literal:
      'Sun Tanxuan had earlier fled; on the jimao day he was captured and executed.',
    idiomatic:
      'Sun Tanxuan had earlier fled; on the jimao day he was captured and executed.',
  },
  s0107: {
    literal:
      'On the renyin day Empress Xie was established; death sentences were reduced one degree, and punishments of five years or less were all remitted.',
    idiomatic:
      'On the renyin day Empress Xie was installed; death sentences were reduced one degree, and punishments of five years or less were all pardoned.',
  },
  s0108: {
    literal:
      'On the renzi day of the eleventh month the son of the late Governor of Wuchang Liu Kun, Bin, was established as Prince of Nanfeng County.',
    idiomatic:
      'On the renzi day of the eleventh month Bin, son of the late Governor of Wuchang Liu Kun, was created Prince of Nanfeng County.',
  },
  s0109: {
    literal:
      'On the guihai day Marquis of Linli Liu Huang plotted rebellion; Huang and his partisans were all executed.',
    idiomatic:
      'On the guihai day Marquis of Linli Liu Huang plotted rebellion; Huang and his associates were all executed.',
  },
  s0110: {
    literal:
      'On the jiazi day Prince of Nanyang Hui was changed in enfeoffment to Prince of Suixiang, and Suixiang Commandery was renamed.',
    idiomatic:
      'On the jiazi day Prince of Nanyang Hui was reassigned in enfeoffment to Prince of Suixiang, and Suixiang Commandery was renamed accordingly.',
  },
  s0111: {
    literal: 'On the bingxu day of the twelfth month the empress was presented at the Ancestral Temple.',
    idiomatic: 'On the bingxu day of the twelfth month the empress was presented at the Ancestral Temple.',
  },
  s0112: {
    literal: 'On the wuzi day Goguryeo sent envoys presenting local products.',
    idiomatic: 'On the wuzi day Goguryeo sent envoys presenting tribute.',
  },
  s0113: {
    literal:
      'In spring of the third year, on the jiachen day of the first month, Xiao Luan, Inspector of Jiangzhou, was made General Who Pacifies the West and Inspector of Jingzhou; Wang Yanzhi, Vice Director of the Masters of Writing, was made General Who Pacifies the South and Inspector of Jiangzhou.',
    idiomatic:
      'In spring of the third year, on the jiachen day of the first month, Xiao Luan, Inspector of Jiangzhou, was appointed General Who Pacifies the West and Inspector of Jingzhou; Wang Yanzhi, Vice Director of the Masters of Writing, was appointed General Who Pacifies the South and Inspector of Jiangzhou.',
  },
  s0114: {
    literal: 'Xiao Shunzhi, chief clerk of Anxi, was made Inspector of Yingzhou.',
    idiomatic: 'Xiao Shunzhi, chief clerk of Anxi, was appointed Inspector of Yingzhou.',
  },
  s0115: {
    literal:
      'On the yimao day the Prince of Qi, Grand Preceptor, memorialized that all who owed official goods or corvée labor should be wholly remitted.',
    idiomatic:
      'On the yimao day the Prince of Qi, Grand Preceptor, memorialized that all who owed official goods or corvée labor should be wholly remitted.',
  },
  s0116: {
    literal:
      'On the xinhai day Wang Xuanmiao, General of Agile Cavalry, was made Inspector of Liang and South Qin provinces.',
    idiomatic:
      'On the xinhai day Wang Xuanmiao, General of Agile Cavalry, was appointed Inspector of Liang and South Qin provinces.',
  },
  s0117: {
    literal:
      'The heir of the Prince of Qi, Commander of the Guards and General Who Pacifies the Army, was additionally made Vice Director of the Masters of Writing and advanced to Grand Central Army Commander with Baimen equal to the Three Ministries.',
    idiomatic:
      'The heir of the Prince of Qi, Commander of the Guards and General Who Pacifies the Army, was additionally appointed Vice Director of the Masters of Writing and promoted to Grand Central Army Commander with Baimen equal to the Three Ministries.',
  },
  s0118: {
    literal: 'On the bingchen day the front canopy of feathers and martial pipes and drums were granted to the Prince of Qi, Grand Preceptor.',
    idiomatic: 'On the bingchen day the front canopy of feathers and martial pipes and drums were granted to the Prince of Qi, Grand Preceptor.',
  },
  s0119: {
    literal: 'On the dingsi day an edict ordered the Grand Preceptor\'s office to recruit as of old.',
    idiomatic: 'On the dingsi day an edict ordered the Grand Preceptor\'s office to recruit staff as before.',
  },
  s0120: {
    literal:
      'Zhang Jinger, General Who Conquers the West and Inspector of Yongzhou, was made General Who Protects the Army; Xiao Changmao, newly appointed Gentleman Attendant of the Yellow Gate, was made Inspector of Yongzhou.',
    idiomatic:
      'Zhang Jinger, General Who Conquers the West and Inspector of Yongzhou, was appointed General Who Protects the Army; Xiao Changmao, newly appointed Gentleman Attendant of the Yellow Gate, was appointed Inspector of Yongzhou.',
  },
  s0121: {
    literal:
      'On the bingzi day of the second month the Prince of Shaoling You, General Who Pacifies the South and Inspector of South Yuzhou, died.',
    idiomatic:
      'On the bingzi day of the second month Prince of Shaoling You, General Who Pacifies the South and Inspector of South Yuzhou, died.',
  },
  s0122: {
    literal: 'On the new moon of the third month, the day guimao, there was an eclipse of the sun.',
    idiomatic: 'On the new moon of the third month, the day guimao, there was a solar eclipse.',
  },
  s0123: {
    literal:
      'On the jiachen day the Grand Preceptor was elevated to Chancellor of State, directing all affairs of government, enfeoffed with ten commanderies as Duke of Qi, granted the full rites of the Nine Bestowals, additionally given the imperial seal-cord and the Far Roaming cap, ranking above all princes, with a green cord for the Chancellor of State; he remained Grand General of Agile Cavalry, Governor of Yangzhou, and Inspector of South Xuzhou as before.',
    idiomatic:
      'On the jiachen day the Grand Preceptor was elevated to Chancellor of State, directing all affairs of government, enfeoffed with ten commanderies as Duke of Qi, granted the full rites of the Nine Bestowals, additionally given the imperial seal-cord and the Far Roaming cap, ranking above all princes, with a green cord for the Chancellor of State; he remained Grand General of Agile Cavalry, Governor of Yangzhou, and Inspector of South Xuzhou as before.',
  },
  s0124: {
    literal:
      'On the bingwu day Xiao Ze, Grand Central Army Commander, was made Inspector of South Yuzhou and heir of the Duke of Qi, deputy to the Chancellor of State, with a green cord.',
    idiomatic:
      'On the bingwu day Xiao Ze, Grand Central Army Commander, was appointed Inspector of South Yuzhou and heir of the Duke of Qi, deputy to the Chancellor of State, with a green cord.',
  },
  s0125: {
    literal:
      'On the gengxu day Prince of Linchuan Chuo plotted rebellion; Chuo and his partisans were all executed.',
    idiomatic:
      'On the gengxu day Prince of Linchuan Chuo plotted rebellion; Chuo and his associates were all executed.',
  },
  s0126: {
    literal:
      'On the dingsi day, because the State of Qi was newly established, five million cash, five thousand bolts of cloth, and one thousand bolts of silk were granted.',
    idiomatic:
      'On the dingsi day, because the State of Qi was newly established, five million cash, five thousand bolts of cloth, and one thousand bolts of silk were granted.',
  },
  s0127: {
    literal:
      'On the jiwei day of the fifth month of the first year of Jianyuan he died in the Danyang Palace, aged thirteen.',
    idiomatic:
      'On the jiwei day of the fifth month of the first year of Jianyuan he died in the Danyang Palace, aged thirteen.',
  },
  s0128: {
    literal: 'His posthumous title was Emperor Shun.',
    idiomatic: 'His posthumous title was Emperor Shun.',
  },
  s0129: {
    literal: 'On the yiyou day of the sixth month he was buried at Suining Mausoleum.',
    idiomatic: 'On the yiyou day of the sixth month he was buried at Suining Mausoleum.',
  },
  s0130: {
    literal:
      'The historian says: When a sage king receives the register of rule, it is not unless he meets disorder and inherits a fragile age that the celestial mandate does not arrive.',
    idiomatic:
      'The historian says: When a sage king receives the mandate, it is only after meeting disorder and inheriting a fragile age that the celestial ordination arrives.',
  },
  s0131: {
    literal:
      'From the Three Sovereigns and Five Emperors onward, every ruler who received the mandate did so only after riding the extreme of ruin, and only then did the talisman and musical verification of the transfer of rule appear.',
    idiomatic:
      'From the Three Sovereigns and Five Emperors onward, every ruler who received the mandate did so only at the furthest point of collapse, and only then did the talisman and musical verification of dynastic change appear.',
  },
  s0132: {
    literal:
      'The transfer of the Water virtue had come long ago—how could it stop at the mere yielding of the throne at Ruyin!',
    idiomatic:
      'The transfer of the Water virtue had been long in coming—how could it be limited to the mere yielding of the throne at Ruyin!',
  },
  s0133: {
    literal: 'Collation notes',
    idiomatic: 'Textual collation notes',
  },
  s0134: {
    literal: 'Courtesy name Zhongmou: Yuan gui 182 agrees.',
    idiomatic: 'Courtesy name Zhongmou: Yuan gui 182 agrees.',
  },
  s0135: {
    literal:
      'The History of the Southern Dynasties, Veritable Record of Jiankang, and Imperial Digest 128 cite "courtesy name Zhongmo."',
    idiomatic:
      'The History of the Southern Dynasties, Veritable Record of Jiankang, and Imperial Digest 128 cite "courtesy name Zhongmo."',
  },
  s0136: {
    literal:
      'Master of Writing, Guards General, Baimen equal to the Three Ministries, General Who Pacifies the Army Liu Bing made Director of the Masters of Writing and additionally Central Army Commander: According to Li Ciming\'s Notes on the Song History and Sun Ao\'s Studies on the Song History, and with reference to the annals of Song in the History of the Southern Dynasties, the biography of Yuan Can in this book, and the biography of Chu Yuan in the Book of Southern Qi, "Master of Writing" should read "Director of the Masters of Writing," and below "Guards General" it seems nineteen characters are missing: "Yuan Can was made Master of Writing and held concurrently Minister over the Masses; Chu Yuan was made Guards General, and."',
    idiomatic:
      'Master of Writing, Guards General, Baimen equal to the Three Ministries, General Who Pacifies the Army Liu Bing made Director of the Masters of Writing and additionally Central Army Commander: According to Li Ciming\'s Notes on the Song History and Sun Ao\'s Studies on the Song History, and with reference to the annals of Song in the History of the Southern Dynasties, the biography of Yuan Can in this book, and the biography of Chu Yuan in the Book of Southern Qi, "Master of Writing" should read "Director of the Masters of Writing," and below "Guards General" it seems nineteen characters are missing: "Yuan Can was made Master of Writing and held concurrently Minister over the Masses; Chu Yuan was made Guards General, and."',
  },
  s0137: {
    literal:
      'Minister over the Masses Yuan Can held Stone City: in all editions "Minister over the Masses" reads "Minister of Works."',
    idiomatic:
      'Minister over the Masses Yuan Can held Stone City: in all editions "Minister over the Masses" reads "Minister of Works."',
  },
  s0138: {
    literal:
      'At the time Xiao Daocheng was Minister of Works and Yuan Can was Minister over the Masses, as seen in the annals of the Founding Emperor in the Book of Southern Qi and the biography of Yuan Can in this book.',
    idiomatic:
      'At the time Xiao Daocheng was Minister of Works and Yuan Can was Minister over the Masses, as seen in the annals of the Founding Emperor in the Book of Southern Qi and the biography of Yuan Can in this book.',
  },
  s0139: {
    literal: 'Now corrected according to the History of the Southern Dynasties and the Veritable Record of Jiankang.',
    idiomatic: 'Now corrected according to the History of the Southern Dynasties and the Veritable Record of Jiankang.',
  },
  s0140: {
    literal: 'Winter, eleventh month, jiyou day: below it there is a bingwu day.',
    idiomatic: 'Winter, eleventh month, jiyou day: below it there is a bingwu day.',
  },
  s0141: {
    literal:
      'According to this, the first day of the month was xinsi; the fifth day was yiyou, the twenty-sixth day was bingwu, and the twenty-ninth day was jiyou.',
    idiomatic:
      'According to this, the first day of the month was xinsi; the fifth day was yiyou, the twenty-sixth day was bingwu, and the twenty-ninth day was jiyou.',
  },
  s0142: {
    literal: 'jiyou cannot stand before bingwu.',
    idiomatic: 'jiyou cannot stand before bingwu.',
  },
  s0143: {
    literal:
      'The Veritable Record of Jiankang reads yiyou; presumably jiyou is a corruption of yiyou.',
    idiomatic:
      'The Veritable Record of Jiankang reads yiyou; presumably jiyou is a corruption of yiyou.',
  },
  s0144: {
    literal:
      'Governor of Wuxing Shen Wenji attacked and beheaded him: the Three Dynasties editions read "Shen Wenli"; the Northern Directorate edition, Mao edition, Hall edition, and Bureau edition read "Shen Wenxiu."',
    idiomatic:
      'Governor of Wuxing Shen Wenji attacked and beheaded him: the Three Dynasties editions read "Shen Wenli"; the Northern Directorate edition, Mao edition, Hall edition, and Bureau edition read "Shen Wenxiu."',
  },
  s0145: {
    literal:
      'Shen Wenxiu in the reign of Emperor Ming guarded Qingzhou and had already been captured by the Northern Wei.',
    idiomatic:
      'Shen Wenxiu in the reign of Emperor Ming guarded Qingzhou and had already been captured by the Northern Wei.',
  },
  s0146: {
    literal: 'The Governor of Wuxing here is Shen Wenji.',
    idiomatic: 'The Governor of Wuxing here is Shen Wenji.',
  },
  s0147: {
    literal: 'This is confirmed by the biography of Shen Wenji in the Book of Southern Qi.',
    idiomatic: 'This is confirmed by the biography of Shen Wenji in the Book of Southern Qi.',
  },
  s0148: {
    literal:
      'General of Pacifying the North, Inspector of North Qinzhou, Prince of Wudu Yang Wendu advanced to General Who Conquers the West: all editions corrupt "Yang Wendu" as "Yang Wenqing"; corrected according to the biography of the Di.',
    idiomatic:
      'General of Pacifying the North, Inspector of North Qinzhou, Prince of Wudu Yang Wendu advanced to General Who Conquers the West: all editions corrupt "Yang Wendu" as "Yang Wenqing"; corrected according to the biography of the Di.',
  },
  s0149: {
    literal:
      'Made Inspector of South Yuzhou for the Prince of Shaoling You, General Who Pacifies the South: in all editions "South Yuzhou" reads "Yuzhou."',
    idiomatic:
      'Made Inspector of South Yuzhou for the Prince of Shaoling You, General Who Pacifies the South: in all editions "South Yuzhou" reads "Yuzhou."',
  },
  s0150: {
    literal:
      'Sun Ao\'s Studies on the Song History says: "The character \'South\' should stand above \'Yuzhou.\'"',
    idiomatic:
      'Sun Ao\'s Studies on the Song History says: "The character \'South\' should stand above \'Yuzhou.\'"',
  },
  s0151: {
    literal:
      'According to the biography of the Prince of Shaoling You, at the time he was Inspector of South Yuzhou; Sun\'s view is correct, and it is now supplemented.',
    idiomatic:
      'According to the biography of the Prince of Shaoling You, at the time he was Inspector of South Yuzhou; Sun\'s view is correct, and it is now supplemented.',
  },
  s0152: {
    literal:
      'Fourteen articles in all: the annals of Qi in the History of the Southern Dynasties and the annals of the Founding Emperor in the Book of Southern Qi both read "seventeen articles."',
    idiomatic:
      'Fourteen articles in all: the annals of Qi in the History of the Southern Dynasties and the annals of the Founding Emperor in the Book of Southern Qi both read "seventeen articles."',
  },
};

const mode = process.argv[2] || 'all';
const batch1 = new Set(
  Array.from({ length: 100 }, (_, i) => `s${String(i + 1).padStart(4, '0')}`)
);
const batch2 = new Set(
  Array.from({ length: 52 }, (_, i) => `s${String(i + 101).padStart(4, '0')}`)
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
