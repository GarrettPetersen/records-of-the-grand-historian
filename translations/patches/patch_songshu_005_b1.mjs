#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'In the middle of the seventh month of Jingping year 2, the young emperor was deposed.',
    'In the middle of the seventh month of Jingping 2 (424 CE), the young emperor was deposed.',
  ],
  s0002: [
    'All officials prepared the imperial chariot to welcome him and receive the imperial succession.',
    'The officials arrayed the imperial carriage to welcome him and install him in the imperial line.',
  ],
  s0003: [
    'When the mobile imperial secretariat reached Jiangling, it presented the imperial seal and ribbon.',
    'When the mobile secretariat reached Jiangling, it presented the imperial seal and ribbon.',
  ],
  s0004: [
    'Palace Attendant Pei, Regular Attendant of the Scattered Cavalry Yi, Director of the Palace Library and Director of the Masters of Writing, Protector of the Army, Duke of Jiancheng Liang, General of the Left Guard Jingren, Gentlemen of the Palace and General Who Strikes in Guerrilla Warfare, Marquis of Longxiang Long, Colonel of the Rapid Cavalry, Marquis of Duting Gang, Gentleman of the Yellow Gate Kong Qunzhi, Attendant of the Scattered Cavalry Liu Sikao, Extraordinary Attendant of the Scattered Cavalry Pan Sheng, Attendant of the Palace Library He Shangzhi, Supervisor of the Forest Guards, Marquis Who Opens a State of Fengyang Xiao Sihua, Concurrent Left Vice Director of the Masters of Writing, Marquis of Deyang Sun Kang, Director of the Ministry of Personnel, Commandant of Cavalry Zhang Maodu, Director of the Ministry of Rites Xu Changlin, Director of the Ministry of Revenue Yu Junzhi, Director of the Ministry of Justice Yuan Xun, and others submitted a memorial, saying: "Your subjects have heard that decline and prosperity transform each other, and when the cycle reaches its end there is change; this is why the Way of Heaven does not grow stale and why oracle divination for dynastic longevity proves spiritually enduring."',
    'Palace Attendant Pei, Regular Attendant of the Scattered Cavalry Yi, Director of the Palace Library and Director of the Masters of Writing Protector of the Army Duke of Jiancheng Liang, General of the Left Guard Jingren, Gentlemen of the Palace and General Who Strikes in Guerrilla Warfare Marquis of Longxiang Long, Colonel of the Rapid Cavalry Marquis of Duting Gang, Gentleman of the Yellow Gate Kong Qunzhi, Attendant of the Scattered Cavalry Liu Sikao, Extraordinary Attendant of the Scattered Cavalry Pan Sheng, Attendant of the Palace Library He Shangzhi, Supervisor of the Forest Guards Marquis Who Opens a State of Fengyang Xiao Sihua, Concurrent Left Vice Director of the Masters of Writing Marquis of Deyang Sun Kang, Director of the Ministry of Personnel Commandant of Cavalry Zhang Maodu, Director of the Ministry of Rites Xu Changlin, Director of the Ministry of Revenue Yu Junzhi, Director of the Ministry of Justice Yuan Xun, and others submitted a memorial: "We have heard that adversity and prosperity succeed each other, and when fate runs its course change follows—this is why Heaven\u2019s way never grows stale and why auguries for a dynasty\u2019s endurance hold true."',
  ],
  s0005: [
    'Recently the age\u2019s momentum declined, the royal house fell into hardship and obscurity, and the mandate of the nine domains had nowhere to settle; the enterprise of the High Ancestor was about to fall to the ground.',
    'Of late the age had declined, the royal house was in distress, and the mandate of the nine domains had nowhere to rest; the High Ancestor\u2019s founding enterprise was on the verge of collapse.',
  ],
  s0006: [
    'Relying on your profound virtue and deep foundation, men and spirits alike lent their aid, so the altars of state were secured and the living were brought to order.',
    'Thanks to your profound virtue and deep foundation, men and spirits alike lent their aid, the altars were secured, and the people were brought to peace.',
  ],
  s0007: [
    'We respectfully consider that Your Majesty\u2019s sovereign virtue is natural, your sagely brilliance holds the throne, filial piety and brotherly duty shine in your family and state, and your moral influence is proclaimed in the borderlands you govern.',
    'We respectfully consider that Your Majesty\u2019s sovereign virtue is innate, your sagely brilliance holds the throne, filial piety and brotherly duty are manifest in your family and state, and your moral influence is proclaimed in the domains you govern.',
  ],
  s0008: [
    'Therefore auspicious signs came in profusion and talismans blazed with brilliance.',
    'Hence auspicious omens crowded in and talismans blazed with brilliance.',
  ],
  s0009: [
    'The spirits of the ancestral temple turned their regard westward; the myriad states and all the people looked to your radiance and entrusted their lives to you.',
    'The spirits of the ancestral temple turned their gaze westward; the myriad states and all the people looked to your radiance and entrusted their lives to you.',
  ],
  s0010: [
    'We, who unworthily bear office in the court, were privileged to carry out your command, and have again gathered in this age of splendor to witness once more an enterprise of great peace.',
    'We, who unworthily bear office at court, were privileged to carry your command and have again gathered in this age of splendor to witness an enterprise of great peace once more.',
  ],
  s0011: [
    'The mobile secretariat has arrived; gazing upon the capital walls, we cannot contain our joy like ducks on duckweed; we respectfully come to the gate to bow and submit this memorial for your notice.',
    'The mobile secretariat has arrived; gazing upon the capital walls, we cannot contain our joy; we respectfully come to the gate to bow and submit this memorial for your notice.',
  ],
  s0012: [
    'The Emperor replied: "The imperial fortune has been hard pressed, and the cycle has struck repeated adversity. Looking up to the lofty foundation, I feel the nation\u2019s past and forever mourn that person; grief and agitation mingle together."',
    'The Emperor replied: "The imperial fortune has been hard pressed and the cycle has struck repeated adversity. Looking up to the lofty foundation, I feel the nation\u2019s past and forever mourn that person; grief and agitation mingle together."',
  ],
  s0013: [
    'Relying on the enduring fortune of the seven hundred years, and on loyal and worthy arms and legs of the throne, we have been able to turn adversity to prosperity and put Heaven and man in their proper order.',
    'Relying on the enduring fortune of the seven hundred years and on loyal, worthy arms and legs of the throne, we have been able to turn adversity to prosperity and put Heaven and man in their proper order.',
  ],
  s0014: [
    'I am unworthy and have wrongly received the great mandate; looking back at myself, how could I bear it?',
    'I am unworthy and have wrongly received the great mandate; looking back at myself, how could I bear it?',
  ],
  s0015: [
    'I shall for the time being return to the court, display mourning at the imperial tombs, and together with worthy men fully express what is in my heart.',
    'I shall for the time being return to court, display mourning at the imperial tombs, and together with worthy men fully express what is in my heart.',
  ],
  s0016: [
    'I hope you will enter into my feelings and not make excessive protestations.',
    'I hope you will enter into my feelings and not make excessive protestations.',
  ],
  s0017: [
    'The prefectural and district aides all styled themselves subjects and asked to inscribe plaques on every gate according to the palace standard; the Emperor did not permit it.',
    'The prefectural and district aides all styled themselves subjects and asked to inscribe plaques on every gate according to the palace standard; the Emperor did not permit it.',
  ],
  s0018: [
    'On jiaxu, he set out from Jiangling.',
    'On jiaxu, he set out from Jiangling.',
  ],
  s0019: [
    'On bingshen of the eighth month, the imperial carriage reached the capital.',
    'On bingshen of the eighth month, the imperial carriage reached the capital.',
  ],
  s0020: [
    'On dingyou, he paid respects at the Chuning Mausoleum, then returned to the central hall and there assumed the imperial throne.',
    'On dingyou, he paid respects at the Chuning Mausoleum, then returned to the central hall and there assumed the imperial throne.',
  ],
  s0021: [
    'On dingyou of the eighth month of autumn in the first year of Yuanjia, a general amnesty was proclaimed for the empire, and Jingping year 2 was changed to Yuanjia year 1.',
    'On dingyou of the eighth month of autumn in Yuanjia 1 (424 CE), a general amnesty was proclaimed for the empire, and Jingping 2 was changed to Yuanjia 1.',
  ],
  s0022: [
    'Civil and military officials were advanced two ranks in status; overdue rents and old debts were not to be collected again.',
    'Civil and military officials were advanced two ranks in status; overdue rents and old debts were not to be collected again.',
  ],
  s0023: [
    'On gengzi, Acting Pacifying Army General and Jingzhou Inspector Xie Hui was made Pacifying Army General and Jingzhou Inspector.',
    'On gengzi, Acting Pacifying Army General and Jingzhou Inspector Xie Hui was confirmed as Pacifying Army General and Jingzhou Inspector.',
  ],
  s0024: [
    'On guimao, Minister of Works, Supervisor of the Masters of Writing, and Yangzhou Inspector Xu Xianzhi was promoted to Grand Commandant; General Who Guards the Army and Jiangzhou Inspector Wang Hong was promoted to Minister of Works; Director of the Palace Library and Protector of the Army Fu Liang was given the additional title of Left Grand Master of the Palace and Bearer of the Golden Battle-Ax, Opening Office with the same ceremonial as the Three Excellencies; Pacifying Army General and Jingzhou Inspector Xie Hui was given the title General Who Guards the Army; General Who Pacifies the North and Southern Xuzhou Inspector Tan Daoji was given the title General Who Campaigns in the North.',
    'On guimao, Minister of Works, Supervisor of the Masters of Writing, and Yangzhou Inspector Xu Xianzhi was promoted to Grand Commandant; General Who Guards the Army and Jiangzhou Inspector Wang Hong was promoted to Minister of Works; Director of the Palace Library and Protector of the Army Fu Liang was given the additional title of Left Grand Master of the Palace and Bearer of the Golden Battle-Ax, Opening Office with the same ceremonial as the Three Excellencies; Pacifying Army General and Jingzhou Inspector Xie Hui was given the title General Who Guards the Army; General Who Pacifies the North and Southern Xuzhou Inspector Tan Daoji was given the title General Who Campaigns in the North.',
  ],
  s0025: [
    'On jiachen, his birth mother, Lady Hu the Talented Beauty, was posthumously honored as Empress Dowager with the posthumous title Empress Zhang.',
    'On jiachen, his birth mother, Lady Hu the Talented Beauty, was posthumously honored as Empress Dowager with the posthumous title Empress Zhang.',
  ],
  s0026: [
    'General Who Guards the Army and Southern Xuzhou Inspector Prince of Pengcheng Yikang was given the title General Who Acts as Commander-in-Chief; General Who Conquers and Southern Yuzhou Inspector Yigong was given the title Pacifying Army General and enfeoffed as Prince of Jiangxia.',
    'General Who Guards the Army and Southern Xuzhou Inspector Prince of Pengcheng Yikang was given the title General Who Acts as Commander-in-Chief; General Who Conquers and Southern Yuzhou Inspector Yigong was given the title Pacifying Army General and enfeoffed as Prince of Jiangxia.',
  ],
  s0027: [
    'The sixth younger imperial brother Yixuan was established as Prince of Jingling, and the seventh younger imperial brother Yiji as Prince of Hengyang.',
    'The sixth younger imperial brother Yixuan was established as Prince of Jingling, and the seventh younger imperial brother Yiji as Prince of Hengyang.',
  ],
  s0028: [
    'On wushen, Yuzhou Inspector Liu Cui was made Yongzhou Inspector, General of Valiant Cavalry Guan Yizhi was made Yuzhou Inspector, and Colonel of the Southern Man Dao Yanzhi was made General of the Central Army.',
    'On wushen, Yuzhou Inspector Liu Cui was made Yongzhou Inspector, General of Valiant Cavalry Guan Yizhi was made Yuzhou Inspector, and Colonel of the Southern Man Dao Yanzhi was made General of the Central Army.',
  ],
  s0029: [
    'On jiyou, this year\u2019s cloth tax in Jing and Xiang provinces was reduced by half.',
    'On jiyou, this year\u2019s cloth tax in Jing and Xiang provinces was reduced by half.',
  ],
  s0030: [
    'On bingzi of the ninth month, Consort Yuan was established as Empress.',
    'On bingzi of the ninth month, Consort Yuan was established as Empress.',
  ],
  s0031: [
    'On bingyin of the first month of spring in year 2, Grand Commandant Xu Xianzhi and Director of the Masters of Writing Fu Liang submitted a memorial returning power to the throne, and the Emperor began to handle affairs personally.',
    'On bingyin of the first month of spring in year 2, Grand Commandant Xu Xianzhi and Director of the Masters of Writing Fu Liang submitted a memorial returning power to the throne, and the Emperor began to handle affairs personally.',
  ],
  s0032: [
    'On xinwei, the imperial carriage performed sacrifice at the southern suburban altar, and a general amnesty was proclaimed for the empire.',
    'On xinwei, the imperial carriage performed sacrifice at the southern suburban altar, and a general amnesty was proclaimed for the empire.',
  ],
  s0033: [
    'On yichou of the third month, General of the Left and Xuzhou Inspector Wang Zhongde was given the title General Who Pacifies the North.',
    'On yichou of the third month, General of the Left and Xuzhou Inspector Wang Zhongde was given the title General Who Pacifies the North.',
  ],
  s0034: [
    'In summer, on wuyin of the fifth month, Special Grand Master Xie Dan died.',
    'In summer, on wuyin of the fifth month, Special Grand Master Xie Dan died.',
  ],
  s0035: [
    'In autumn, on jiashen of the eighth month, because refugees from Guanzhong had left for the Han River region, the commanderies of Jingzhao, Fufeng, and Pingyi were established.',
    'In autumn, on jiashen of the eighth month, because refugees from Guanzhong had left for the Han River region, the commanderies of Jingzhao, Fufeng, and Pingyi were established.',
  ],
  s0036: [
    'On yiyou, General Who Acts as Commander-in-Chief and Southern Xuzhou Inspector Prince of Pengcheng Yikang was given Opening Office with the same ceremonial as the Three Excellencies; the newly appointed Minister of Works Wang Hong was made General of Chariots and Cavalry, Opening Office with the same ceremonial as the Three Excellencies; Chief Clerk of the Right Army Jiang Heng was made Guangzhou Inspector.',
    'On yiyou, General Who Acts as Commander-in-Chief and Southern Xuzhou Inspector Prince of Pengcheng Yikang was given Opening Office with the same ceremonial as the Three Excellencies; the newly appointed Minister of Works Wang Hong was made General of Chariots and Cavalry, Opening Office with the same ceremonial as the Three Excellencies; Chief Clerk of the Right Army Jiang Heng was made Guangzhou Inspector.',
  ],
  s0037: [
    'In winter, on guiyou of the eleventh month, former General Yang Xuan was made General Who Campaigns in the West and Qinzhou Inspector of the North.',
    'In winter, on guiyou of the eleventh month, former General Yang Xuan was made General Who Campaigns in the West and Qinzhou Inspector of the North.',
  ],
  s0038: [
    'On bingyin of the first month of spring in year 3, Grand Commandant, Supervisor of the Masters of Writing, and Yangzhou Inspector Xu Xianzhi; Director of the Masters of Writing, Protector of the Army, and Left Grand Master of the Palace Fu Liang—having committed crimes—were executed.',
    'On bingyin of the first month of spring in year 3, Grand Commandant, Supervisor of the Masters of Writing, and Yangzhou Inspector Xu Xianzhi, and Director of the Masters of Writing, Protector of the Army, and Left Grand Master of the Palace Fu Liang, having committed crimes, were executed.',
  ],
  s0039: [
    'General of the Central Army Dao Yanzhi and General Who Campaigns in the North Tan Daoji were sent to campaign against Jingzhou Inspector Xie Hui; the Emperor personally led the six armies on a western expedition.',
    'General of the Central Army Dao Yanzhi and General Who Campaigns in the North Tan Daoji were sent to campaign against Jingzhou Inspector Xie Hui; the Emperor personally led the six armies on a western expedition.',
  ],
  s0040: [
    'A general amnesty was proclaimed for the empire.',
    'A general amnesty was proclaimed for the empire.',
  ],
  s0041: [
    'On dingmao, General of Chariots and Cavalry and Jiangzhou Inspector Wang Hong was made Grand Commandant, Supervisor of the Masters of Writing, and Yangzhou Inspector; General Who Acts as Commander-in-Chief and Southern Xuzhou Inspector Prince of Pengcheng Yikang was changed to Jingzhou Inspector; Pacifying Army General and Southern Yuzhou Inspector Prince of Jiangxia Yigong was changed to Southern Xuzhou Inspector.',
    'On dingmao, General of Chariots and Cavalry and Jiangzhou Inspector Wang Hong was made Grand Commandant, Supervisor of the Masters of Writing, and Yangzhou Inspector; General Who Acts as Commander-in-Chief and Southern Xuzhou Inspector Prince of Pengcheng Yikang was changed to Jingzhou Inspector; Pacifying Army General and Southern Yuzhou Inspector Prince of Jiangxia Yigong was changed to Southern Xuzhou Inspector.',
  ],
  s0042: [
    'On jisi, former Protector of the Army Zhao Lunzhi was made General Who Guards the Army.',
    'On jisi, former Protector of the Army Zhao Lunzhi was made General Who Guards the Army.',
  ],
  s0043: [
    'On bingxu of the intercalary month, the imperial son Shao was born.',
    'On bingxu of the intercalary month, the imperial son Shao was born.',
  ],
  s0044: [
    'On yimao of the second month, all prisoners in custody and convicts in exile were entirely pardoned.',
    'On yimao of the second month, all prisoners in custody and convicts in exile were entirely pardoned.',
  ],
  s0045: [
    'On wuwu, Jinzi-guanglu Grand Master Wang Jinghong was made Left Vice Director of the Masters of Writing, and Zhangzhang Prefect Zheng Xianzhi was made Right Vice Director of the Masters of Writing.',
    'On wuwu, Jinzi-guanglu Grand Master Wang Jinghong was made Left Vice Director of the Masters of Writing, and Zhangzhang Prefect Zheng Xianzhi was made Right Vice Director of the Masters of Writing.',
  ],
  s0046: [
    'Jian\u2019an Prefect Pan Sheng, having committed a crime, was executed.',
    'Jian\u2019an Prefect Pan Sheng, having committed a crime, was executed.',
  ],
  s0047: [
    'On gengshen, Special Grand Master Fan Tai was given the additional title of Grand Master of the Palace.',
    'On gengshen, Special Grand Master Fan Tai was given the additional title of Grand Master of the Palace.',
  ],
  s0048: [
    'That day, the imperial carriage set out from the capital.',
    'That day, the imperial carriage set out from the capital.',
  ],
  s0049: [
    'On wuchen, Dao Yanzhi and Tan Daoji inflicted a great defeat on Xie Hui at Yinji.',
    'On wuchen, Dao Yanzhi and Tan Daoji inflicted a great defeat on Xie Hui at Yinji.',
  ],
  s0050: [
    'On bingzi, the imperial carriage turned its banners back from Wuhu.',
    'On bingzi, the imperial carriage turned its banners back from Wuhu.',
  ],
  s0051: [
    'On jimao, Hui was captured at Yantou and sent to the capital, where he was executed.',
    'On jimao, Hui was captured at Yantou and sent to the capital, where he was executed.',
  ],
  s0052: [
    'On xinsi of the third month, the imperial carriage returned to the palace.',
    'On xinsi of the third month, the imperial carriage returned to the palace.',
  ],
  s0053: [
    'In summer, on yiwei of the fifth month, General Who Campaigns in the North and Southern Xuzhou Inspector Tan Daoji was made General Who Campaigns in the South and Jiangzhou Inspector; General of the Central Army Dao Yanzhi was made Southern Yuzhou Inspector.',
    'In summer, on yiwei of the fifth month, General Who Campaigns in the North and Southern Xuzhou Inspector Tan Daoji was made General Who Campaigns in the South and Jiangzhou Inspector; General of the Central Army Dao Yanzhi was made Southern Yuzhou Inspector.',
  ],
  s0054: [
    'On wuxu, Rear General Prince of Changsha Yixin was made Southern Xuzhou Inspector.',
    'On wuxu, Rear General Prince of Changsha Yixin was made Southern Xuzhou Inspector.',
  ],
  s0055: [
    'On yisi, General Who Acts as Commander-in-Chief and Liangzhou Governor Juqu Mengxun was changed to General of Chariots and Cavalry.',
    'On yisi, General Who Acts as Commander-in-Chief and Liangzhou Governor Juqu Mengxun was changed to General of Chariots and Cavalry.',
  ],
  s0056: [
    'An edict said: "When a wise king governs the age, he broadly extends the four kinds of hearing, yet still tours the sacred mountains and inspects the regions, gathering the winds and observing government."',
    'An edict said: "When a wise king governs the age, he broadly extends the four kinds of hearing, yet still tours the sacred mountains and inspects the regions, gathering the winds and observing government."',
  ],
  s0057: [
    'Thus the true and false are surely examined, the remote and hidden are not neglected, royal favor is not blocked, and the nine marshes have those who hear.',
    'Thus the true and false are surely examined, the remote and hidden are not neglected, royal favor is not blocked, and the nine marshes have those who hear.',
  ],
  s0058: [
    'I, with my meager virtue, have unworthily inherited the great enterprise.',
    'I, with my meager virtue, have unworthily inherited the great enterprise.',
  ],
  s0059: [
    'Though I forever ponder the way of governance and keep my purpose at dawn, longing to speak of Fu Yue I rise from sleep at night—yet the worthy in hill and garden, their talents still unrevealed, and the people\u2019s hidden hardships remain cut off from sight and hearing.',
    'Though I forever ponder the way of governance and keep my purpose at dawn, longing to speak of Fu Yue I rise from sleep at night—yet the worthy in hill and garden, their talents still unrevealed, and the people\u2019s hidden hardships remain cut off from sight and hearing.',
  ],
  s0060: [
    'Therefore I turn my regard to the regions and pause my rest, forgetting to eat.',
    'Therefore I turn my regard to the regions and pause my rest, forgetting to eat.',
  ],
  s0061: [
    'Now the baleful omens have been swept away, and within the four seas there is tranquility; to display the worthy and expand transformation begins from this moment.',
    'Now the baleful omens have been swept away, and within the four seas there is tranquility; to display the worthy and expand transformation begins from this moment.',
  ],
  s0062: [
    'Grand envoys may be dispatched to tour the four quarters.',
    'Grand envoys may be dispatched to tour the four quarters.',
  ],
  s0063: [
    'Those prefects and magistrates who are good at their duties, and every fine quality in humble cottage or byre, are to be reported in full detail in memorials—let nothing be omitted.',
    'Those prefects and magistrates who are good at their duties, and every fine quality in humble cottage or byre, are to be reported in full detail in memorials—let nothing be omitted.',
  ],
  s0064: [
    'If criminal cases are not relieved, if government is perverse and mistaken, or if the people are harmed and teaching injured, report the facts in full.',
    'If criminal cases are not relieved, if government is perverse and mistaken, or if the people are harmed and teaching injured, report the facts in full.',
  ],
  s0065: [
    'Those of advanced age, widowers and widows, orphans and the young, and the six kinds of affliction who cannot support themselves may be given relief according to the best measure of the commandery and county.',
    'Those of advanced age, widowers and widows, orphans and the young, and the six kinds of affliction who cannot support themselves may be given relief according to the best measure of the commandery and county.',
  ],
  s0066: [
    'Broadly gather popular songs, widely receive excellent counsel, and exhaust the intent of those bearing the mandate, as if I myself were viewing it.',
    'Broadly gather popular songs, widely receive excellent counsel, and exhaust the intent of those bearing the mandate, as if I myself were viewing it.',
  ],
  s0067: [
    'On bingwu, the imperial carriage attended at the Hall for Honoring the Worthy to hear litigation.',
    'On bingwu, the imperial carriage attended at the Hall for Honoring the Worthy to hear litigation.',
  ],
  s0068: [
    'On jiwei of the sixth month, General Who Guards the Army Zhao Lunzhi was made Left Grand Master of the Palace and General of the Palace Guard.',
    'On jiwei of the sixth month, General Who Guards the Army Zhao Lunzhi was made Left Grand Master of the Palace and General of the Palace Guard.',
  ],
  s0069: [
    'On bingyin, the imperial carriage again attended at the Hall for Honoring the Worthy to hear litigation.',
    'On bingyin, the imperial carriage again attended at the Hall for Honoring the Worthy to hear litigation.',
  ],
  s0070: [
    'On bingzi, he again heard litigation.',
    'On bingzi, he again heard litigation.',
  ],
  s0071: [
    'General of the Right Guard Wang Hua was made General of the Central Guard.',
    'General of the Right Guard Wang Hua was made General of the Central Guard.',
  ],
  s0072: [
    'In winter, on wuyin of the eleventh month, Liang and Southern Qin Inspector Ji Han was made Yizhou Inspector, and Staff Officer of the General Who Acts as Commander-in-Chief Liu Daochan was made Liang and Southern Qin Inspector.',
    'In winter, on wuyin of the eleventh month, Liang and Southern Qin Inspector Ji Han was made Yizhou Inspector, and Staff Officer of the General Who Acts as Commander-in-Chief Liu Daochan was made Liang and Southern Qin Inspector.',
  ],
  s0073: [
    'On jihai, Colonel of the Southern Man Liu Zunkao was made Yongzhou Inspector.',
    'On jihai, Colonel of the Southern Man Liu Zunkao was made Yongzhou Inspector.',
  ],
  s0074: [
    'On guichou of the twelfth month, Attendant of the Palace Library Xiao Sihua was made Qingzhou Inspector.',
    'On guichou of the twelfth month, Attendant of the Palace Library Xiao Sihua was made Qingzhou Inspector.',
  ],
  s0075: [
    'On renxu, former Wu Prefect Xu Peizhi plotted rebellion; he and his accomplices were all executed.',
    'On renxu, former Wu Prefect Xu Peizhi plotted rebellion; he and his accomplices were all executed.',
  ],
  s0076: [
    'On yihai, the new moon of the first month of spring in year 4, a partial amnesty was proclaimed within one hundred li of the capital.',
    'On yihai, the new moon of the first month of spring in year 4, a partial amnesty was proclaimed within one hundred li of the capital.',
  ],
  s0077: [
    'On xinsi, the imperial carriage personally performed sacrifice at the southern suburban altar.',
    'On xinsi, the imperial carriage personally performed sacrifice at the southern suburban altar.',
  ],
  s0078: [
    'On yimao of the second month, he traveled to Dantu and paid respects at the Jing Mausoleum.',
    'On yimao of the second month, he traveled to Dantu and paid respects at the Jing Mausoleum.',
  ],
  s0079: [
    'On bingzi of the third month, an edict said: "Dantu is bound to me by ties of native place; the great enterprise began from there. Treading that soil, my feelings are everlasting; touched by it, my emotion knows no limit."',
    'On bingzi of the third month, an edict said: "Dantu is bound to me by ties of native place; the great enterprise began from there. Treading that soil, my feelings are everlasting; touched by it, my emotion knows no limit."',
  ],
  s0080: [
    'Formerly Emperor Zhang of Han on his southern tour added favor to the Yuan clan; how much more when affection and obligation are doubled or tripled, as in days past.',
    'Formerly Emperor Zhang of Han on his southern tour added favor to the Yuan clan; how much more when affection and obligation are doubled or tripled, as in days past.',
  ],
  s0081: [
    'I wish to spread lingering bounty and repay and comfort the gentry and people.',
    'I wish to spread lingering bounty and repay and comfort the gentry and people.',
  ],
  s0082: [
    'This county\u2019s rent and cloth for this year are to be remitted; all punishments of five years or less are entirely pardoned and released.',
    'This county\u2019s rent and cloth for this year are to be remitted; all punishments of five years or less are entirely pardoned and released.',
  ],
  s0083: [
    'Those who fought three battles in the assault on the city and the households of great generals are to receive condolence and relief as appropriate.',
    'Those who fought three battles in the assault on the city and the households of great generals are to receive condolence and relief as appropriate.',
  ],
  s0084: [
    'On dinghai, the imperial carriage returned to the palace.',
    'On dinghai, the imperial carriage returned to the palace.',
  ],
  s0085: [
    'On wuzi, Right Vice Director of the Masters of Writing Zheng Xianzhi died.',
    'On wuzi, Right Vice Director of the Masters of Writing Zheng Xianzhi died.',
  ],
  s0086: [
    'On renyin, the use on the summer solstice of five-colored silk life-cords and the like was forbidden—this was the proposal of Fuyang Magistrate Zhuge Kan.',
    'On renyin, the use on the summer solstice of five-colored silk life-cords and the like was forbidden—this was the proposal of Fuyang Magistrate Zhuge Kan.',
  ],
  s0087: [
    'In summer, on gengxu of the fourth month, Director of the Court of Justice Wang Huizhi was made Jiaozhou Inspector.',
    'In summer, on gengxu of the fourth month, Director of the Court of Justice Wang Huizhi was made Jiaozhou Inspector.',
  ],
  s0088: [
    'On renwu of the fifth month, General of the Central Guard Wang Hua died.',
    'On renwu of the fifth month, General of the Central Guard Wang Hua died.',
  ],
  s0089: [
    'An epidemic struck the capital; on jiawu, envoys were sent to inquire after the people and provide medicine.',
    'An epidemic struck the capital; on jiawu, envoys were sent to inquire after the people and provide medicine.',
  ],
  s0090: [
    'If the dead had no family, coffins and burial goods were bestowed.',
    'If the dead had no family, coffins and burial goods were bestowed.',
  ],
  s0091: [
    'On guimao, the new moon of the sixth month, there was a solar eclipse.',
    'On guimao, the new moon of the sixth month, there was a solar eclipse.',
  ],
  s0092: [
    'On gengshen, Jinzi-guanglu Grand Master Yin Mu was made Protector of the Army.',
    'On gengshen, Jinzi-guanglu Grand Master Yin Mu was made Protector of the Army.',
  ],
  s0093: [
    'On yihai of the first month of spring in year 5, an edict said: "I respectfully receive the great enterprise and preside over feasting for the four seas; custom and transformation are not yet broadly spread, and the way of governance has many obscurities. Seeking it in human affairs, in waking and sleeping alike there is only worry."',
    'On yihai of the first month of spring in year 5, an edict said: "I respectfully receive the great enterprise and preside over feasting for the four seas; custom and transformation are not yet broadly spread, and the way of governance has many obscurities. Seeking it in human affairs, in waking and sleeping alike there is only worry."',
  ],
  s0094: [
    'Moreover, yin and yang have lately been out of order, drought and plague have become calamities; looking up at these disaster warnings, the blame lies deep in me.',
    'Moreover, yin and yang have lately been out of order, drought and plague have become calamities; looking up at these disaster warnings, the blame lies deep in me.',
  ],
  s0095: [
    'I think how to turn my person and restrain my thoughts, deliberate on punishments and examine penalties, to answer Heaven\u2019s reproof above and comfort the people\u2019s afflictions below.',
    'I think how to turn my person and restrain my thoughts, deliberate on punishments and examine penalties, to answer Heaven\u2019s reproof above and comfort the people\u2019s afflictions below.',
  ],
  s0096: [
    'All the hosts of ministers and the hundred offices are each to present loyal words, pointing out gains and losses—let nothing be concealed.',
    'All the hosts of ministers and the hundred offices are each to present loyal words, pointing out gains and losses—let nothing be concealed.',
  ],
  s0097: [
    'On jiashen, the imperial carriage attended at the Black Tortoise Hall to review the troops.',
    'On jiashen, the imperial carriage attended at the Black Tortoise Hall to review the troops.',
  ],
  s0098: [
    'On wuzi, a great fire broke out in the capital; envoys were sent to tour, comfort, and grant relief.',
    'On wuzi, a great fire broke out in the capital; envoys were sent to tour, comfort, and grant relief.',
  ],
  s0099: [
    'In summer, on jihai of the fourth month, Colonel of the Southern Man Xiao Muzhi was made Xiangzhou Inspector.',
    'In summer, on jihai of the fourth month, Colonel of the Southern Man Xiao Muzhi was made Xiangzhou Inspector.',
  ],
  s0100: [
    'On wuwu, Shixing Prefect Xu Huo was made Guangzhou Inspector.',
    'On wuwu, Shixing Prefect Xu Huo was made Guangzhou Inspector.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_songshu_005_b1.mjs <translation.json>'
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;

for (const s of data.sentences) {
  const pair = T[s.id];
  if (pair) {
    s.literal = pair[0];
    s.idiomatic = pair[1];
    patched++;
  }
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patch count: ${patched}`);

if (patched !== Object.keys(T).length) {
  process.exitCode = 1;
}
