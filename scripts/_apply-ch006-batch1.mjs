#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.006, Empress Wu Zetian — Wu clan, rise, Two Sages, through Zhou founding) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0001: {
    literal:
      'Empress Wu Zetian of the Wu clan bore the taboo name Zhao; she was a native of Wenshui in Bingzhou.',
    idiomatic:
      'Empress Wu Zetian, née Wu, bore the taboo name Zhao and came from Wenshui in Bingzhou.',
  },
  s0002: {
    literal:
      'Her father Shi Yue, at the end of the Sui dynasty\'s Daye reign, served as captain of the Eagle-Forging Garrison.',
    idiomatic:
      'Her father Shi Yue, in the closing years of Sui, held the rank of captain in the Eagle-Forging Garrison.',
  },
  s0003: {
    literal:
      'When Gaozu marched through Fen and Jin, he always rested at their household.',
    idiomatic:
      'When Gaozu campaigned through Fen and Jin, he often lodged at their home.',
  },
  s0004: {
    literal: 'When the righteous banner first rose, he followed in the pacification of the capital.',
    idiomatic: 'At the first raising of the rebel standard he joined the march that took the capital.',
  },
  s0005: {
    literal:
      'In the Zhenguan era he was repeatedly promoted to Minister of Works and military governor of Jingzhou, and enfeoffed as Duke of Ying.',
    idiomatic:
      'Under Zhenguan he rose through the Ministry of Works and the Jingzhou governorship to the dukedom of Ying.',
  },
  s0006: {
    literal:
      'At first, when Wu Zetian was fourteen, Taizong heard of her beauty and deportment, summoned her to the palace, and installed her as a cairen.',
    idiomatic:
      'When she was fourteen, Taizong, hearing of her beauty and grace, brought her to court and made her a cairen.',
  },
  s0007: {
    literal: 'When Taizong died, she became a nun and dwelt at Ganye Temple.',
    idiomatic: 'After Taizong\'s death she took the tonsure and lived at Ganye Temple.',
  },
  s0008: {
    literal:
      'The Great Emperor saw her at the temple, summoned her again to the palace, and appointed her Imperial Consort Zhaoyi.',
    idiomatic:
      'Gaozong met her at the temple, recalled her to the palace, and created her Imperial Consort Zhaoyi.',
  },
  s0009: {
    literal:
      'At that time Empress Wang and Lady Xiao the fair consort repeatedly vied with Consort Wu Zhaoyi for favor, each slandering the other; the emperor accepted none of it.',
    idiomatic:
      'Empress Wang and Consort Xiao then fought Consort Wu for the emperor\'s favor, trading slanders; he believed neither side.',
  },
  s0010: {
    literal: 'Her title was advanced to Chen Consort.',
    idiomatic: 'She was promoted to Chen Consort.',
  },
  s0011: {
    literal:
      'In the sixth year of Yonghui, Empress Wang was deposed and Chen Consort Wu was installed as empress.',
    idiomatic:
      'In Yonghui 6 Empress Wang was deposed and Consort Wu was raised to empress.',
  },
  s0012: {
    literal: 'Gaozong styled himself Heavenly Sovereign, and Empress Wu styled herself Heavenly Empress.',
    idiomatic: 'Gaozong took the title Heavenly Sovereign; Empress Wu took that of Heavenly Empress.',
  },
  s0013: {
    literal: 'The empress had long been resourceful in stratagem and also versed in letters and history.',
    idiomatic: 'She was clever in counsel and well read in the classics and histories.',
  },
  s0014: {
    literal:
      'From Xianqing onward the emperor often suffered wind ailments; memorials from the hundred offices were all entrusted to the Heavenly Empress for detailed decision.',
    idiomatic:
      'After Xianqing the emperor was often crippled by wind sickness; every ministry memorial went to the Heavenly Empress for final ruling.',
  },
  s0015: {
    literal:
      'From this she assisted in governing the realm for several decades; her authority differed in no way from the emperor\'s, and the age called them the "Two Sages."',
    idiomatic:
      'For decades she shared rule from within; her power matched the emperor\'s, and contemporaries named them the Two Sages.',
  },
  s0016: {
    literal:
      'On wuwu of the second month the emperor was deposed as Prince of Luling, confined in a separate residence, and his given name was changed to Zhe.',
    idiomatic:
      'On wuwu of the second month the emperor was demoted to Prince of Luling, shut away, and renamed Zhe.',
  },
  s0017: {
    literal:
      'On jiwei Prince Lun of Yu was installed as emperor and ordered to dwell in a separate hall.',
    idiomatic:
      'On jiwei Prince Lun of Yu was enthroned and lodged in a side palace.',
  },
  s0018: {
    literal: 'A general amnesty was proclaimed throughout the realm and the era name changed to Wenming.',
    idiomatic: 'The court proclaimed a general amnesty and renamed the era Wenming.',
  },
  s0019: {
    literal: 'The empress dowager still held court and exercised regency.',
    idiomatic: 'The empress dowager continued to rule from behind the curtain.',
  },
  s0020: {
    literal: 'On gengwu the heir\'s grandson Chongzhao was deposed to commoner status.',
    idiomatic: 'On gengwu the heir\'s grandson Chongzhao was stripped to common rank.',
  },
  s0021: {
    literal:
      'Wang Dezhen, Grand Master of Ceremonies and concurrent chief administrator of the Prince of Yu\'s household, became attendant-in-chief; Liu Yizhi, vice director of the Secretariat and concurrent marshal of the Prince of Yu\'s household, was made equal in rank to the Three Offices at the Secretariat Chancellery.',
    idiomatic:
      'Wang Dezhen, grand master of ceremonies and chief administrator to the Prince of Yu, became attendant-in-chief; Liu Yizhi, secretariat vice director and the prince\'s marshal, joined the third rank at the Secretariat Chancellery.',
  },
  s0022: {
    literal: 'In the third month the commoner Xian died in Bazhou.',
    idiomatic: 'In the third month the deposed heir Xian died in Bazhou.',
  },
  s0023: {
    literal: 'In the fourth month of summer Prince Yuanying of Teng died.',
    idiomatic: 'In the fourth summer month Prince Yuanying of Teng died.',
  },
  s0024: {
    literal:
      'Prince Shangjin of Bi was re-enfeoffed as Prince of Ze; Prince Sunjie of Ge as Prince of Xu.',
    idiomatic:
      'Prince Shangjin of Bi was made Prince of Ze; Prince Sunjie of Ge was made Prince of Xu.',
  },
  s0025: {
    literal: 'On dingchou Prince Zhe of Luling was moved to Junzhou.',
    idiomatic: 'On dingchou Prince Zhe of Luling was exiled to Junzhou.',
  },
  s0026: {
    literal:
      'In the intercalary fifth month Wu Chengsi, Minister of Rites, was made equal in rank to the Three Offices at the Secretariat Chancellery.',
    idiomatic:
      'In the intercalary fifth month Wu Chengsi, minister of rites, joined the third rank at the Secretariat Chancellery.',
  },
  s0027: {
    literal:
      'In the seventh month of autumn the Turks Kutlug and Yuanzhen raided Shuozhou; the Left Majestic Guard General Cheng Wuting was ordered to repel them.',
    idiomatic:
      'In the seventh autumn month the Turks Kutlug and Yuanzhen struck Shuozhou; Cheng Wuting, general of the left majestic guard, was sent against them.',
  },
  s0028: {
    literal:
      'A comet appeared in the northwest, more than two zhang in length; after thirty-three days it vanished.',
    idiomatic:
      'A comet blazed in the northwest for thirty-three days, its tail longer than two zhang.',
  },
  s0029: {
    literal: 'In the ninth month a general amnesty was proclaimed and the era name changed to Guangzhai.',
    idiomatic: 'In the ninth month the court proclaimed a general amnesty and renamed the era Guangzhai.',
  },
  s0030: {
    literal: 'Banners and flags were changed to gold, trimmed with purple and painted with mixed designs.',
    idiomatic: 'Imperial banners were recolored gold, edged in purple, and painted with mixed emblems.',
  },
  s0031: {
    literal:
      'The Eastern Capital was renamed the Divine Capital, and the Secretariat and the names of the various offices were also changed.',
    idiomatic:
      'Luoyang was renamed the Divine Capital, and the Secretariat together with many ministry titles were retitled.',
  },
  s0032: {
    literal: 'For the first time officials of the Right Office for Censorial Reform were appointed.',
    idiomatic: 'The court first staffed the Right Office for Censorial Reform.',
  },
  s0033: {
    literal:
      'Xu Jingye, grandson of the former Minister of Works Li Ji and prefectural marshal of Liuzhou, falsely styled himself acting prefect of Yangzhou, killed the chief administrator Chen Jingzhi, seized Yangzhou and raised troops, styled himself supreme commander, and took restoration of the dynasty as his pretext.',
    idiomatic:
      'Xu Jingye, grandson of Li Ji and marshal of Liuzhou, posed as acting prefect of Yangzhou, murdered chief administrator Chen Jingzhi, seized the city, declared himself supreme commander, and marched under the banner of restoring Tang.',
  },
  s0034: {
    literal:
      'In the tenth month of winter Li Chongfu, prefectural marshal of Chuzhou, led the three counties under his command to join Jingye.',
    idiomatic:
      'In the tenth winter month Li Chongfu of Chuzhou rallied his three counties to Jingye\'s cause.',
  },
  s0035: {
    literal:
      'Li Xiaoyi, general of the Left Jade-Belled Guard, was appointed grand commander and led three hundred thousand troops to suppress them.',
    idiomatic:
      'Li Xiaoyi of the left jade-belled guard was named grand commander and marched with three hundred thousand men to crush the rebellion.',
  },
  s0036: {
    literal: 'The Grand Secretary Pei Yan was executed.',
    idiomatic: 'Grand Secretary Pei Yan was put to death.',
  },
  s0037: {
    literal:
      'On dingyou Jingye\'s father and forebears were posthumously stripped of rank and title, and the clan name was restored to Xu.',
    idiomatic:
      'On dingyou the court erased Jingye\'s ancestral honors and restored the clan name Xu.',
  },
  s0038: {
    literal: 'In the twelfth month the former Grand Secretary Xue Yuanchao died.',
    idiomatic: 'In the twelfth month the former grand secretary Xue Yuanchao died.',
  },
  s0039: {
    literal: 'Cheng Wuting, Left Majestic Guard General, was executed.',
    idiomatic: 'Cheng Wuting, general of the left majestic guard, was executed.',
  },
  s0040: {
    literal:
      'In the first month of spring in the inaugural year of Chuigong, after Jingye\'s suppression a general amnesty was proclaimed and the era name installed.',
    idiomatic:
      'In the first spring month of Chuigong 1, with Jingye defeated, the court proclaimed a general amnesty and fixed the new era name.',
  },
  s0041: {
    literal: 'Liu Ren\'gui died.',
    idiomatic: 'Liu Ren\'gui, the great commander, died.',
  },
  s0042: {
    literal: 'In the third month Prince Zhe of Luling was moved to Fangzhou.',
    idiomatic: 'In the third month Prince Zhe of Luling was transferred to Fangzhou.',
  },
  s0043: {
    literal: 'The personally drafted Chuigong Code was promulgated throughout the realm.',
    idiomatic: 'Her personally drafted Chuigong Code was issued empire-wide.',
  },
  s0044: {
    literal:
      'In the fourth month of summer Grand Secretary Qian Weidao was demoted and sent out as prefect of Qingzhou.',
    idiomatic:
      'In the fourth summer month Grand Secretary Qian Weidao was demoted to prefect of Qingzhou.',
  },
  s0045: {
    literal:
      'In the fifth month Pei Judao, Minister of Autumn, became Grand Secretary; Remonstrator Wang Dezhen was banished to Xiangzhou; Su Liangsi, Minister of Winter, became Remonstrator.',
    idiomatic:
      'In the fifth month Pei Judao became grand secretary; Wang Dezhen was exiled to Xiangzhou; Su Liangsi became remonstrator.',
  },
  s0046: {
    literal:
      'An edict ordered civil and military officials of the ninth rank and above, and the common people, all to nominate themselves.',
    idiomatic:
      'An edict commanded every official of the ninth rank or higher—and commoners as well—to put forward their own names.',
  },
  s0047: {
    literal: 'That summer there was great drought.',
    idiomatic: 'That summer a severe drought struck.',
  },
  s0048: {
    literal:
      'In the first month of spring of the second year, the empress dowager issued an edict restoring rule to the emperor.',
    idiomatic:
      'In the first spring month of her second regnal year the empress dowager edicted the return of power to the emperor.',
  },
  s0049: {
    literal:
      'Because the empress dowager\'s intent was not genuine, he firmly declined.',
    idiomatic:
      'Knowing her offer was not sincere, he refused it outright.',
  },
  s0050: {
    literal:
      'The empress dowager still held court as before and exercised regency, and a general amnesty was proclaimed.',
    idiomatic:
      'She resumed regency as before and proclaimed another general amnesty.',
  },
  s0051: {
    literal:
      'For the first time military governors and prefects were likewise permitted to wear the court fish tally like capital officials.',
    idiomatic:
      'For the first time provincial governors and prefects were allowed the court fish tally worn by capital officials.',
  },
  s0052: {
    literal:
      'In the third month chests were first set up in the audience hall; those submitting memorials or reports were permitted to deposit them, and thereby good and ill in the realm became widely known.',
    idiomatic:
      'In the third month complaint boxes were placed in the audience hall; anyone with a petition could deposit it, and court and country alike learned what the people knew.',
  },
  s0053: {
    literal: 'In the fourth month of summer Cen Changqian became Grand Secretary.',
    idiomatic: 'In the fourth summer month Cen Changqian became grand secretary.',
  },
  s0054: {
    literal:
      'In the sixth month Su Liangsi became Left Minister of the Department of State Affairs; Wei Daibao, Minister of Heaven, became Right Minister—both equal in rank to the Three Offices at Phoenix Pavilion and Phoenix Terrace.',
    idiomatic:
      'In the sixth month Su Liangsi became left minister of state and Wei Daibao right minister, each of third rank at Phoenix Pavilion and Terrace.',
  },
  s0055: {
    literal:
      'Wei Siqian, Censor-in-Chief of the Right Office for Censorial Reform, became Remonstrator.',
    idiomatic:
      'Wei Siqian, censor-in-chief of the Right Office for Censorial Reform, became remonstrator.',
  },
  s0056: {
    literal:
      'In the first month of spring of the third year, Prince Chengyi was enfeoffed as Prince of Heng, Longji as Prince of Chu, Longfan as Prince of Wei, and Longye as Prince of Zhao.',
    idiomatic:
      'In the first spring month of the third year Chengyi was made Prince of Heng, Longji Prince of Chu, Longfan Prince of Wei, and Longye Prince of Zhao.',
  },
  s0057: {
    literal: 'In the second month Wei Siqian requested retirement; permission was granted.',
    idiomatic: 'In the second month Wei Siqian asked to retire and was allowed.',
  },
  s0058: {
    literal:
      'In the fourth month of summer Pei Judao became Remonstrator; Zhang Guangfu, vice minister of summer affairs, became vice minister at Phoenix Pavilion, equal in rank to the Phoenix Terrace chancellor.',
    idiomatic:
      'In the fourth summer month Pei Judao became remonstrator and Zhang Guangfu, vice minister of summer affairs, joined the Phoenix Terrace as vice minister and chancellor.',
  },
  s0059: {
    literal: 'On gengwu Liu Yizhi was granted death at home.',
    idiomatic: 'On gengwu Liu Yizhi was ordered to take his own life at home.',
  },
  s0060: {
    literal:
      'In the eighth month of autumn Wei Xuantong, Minister of Earth, was made acting Remonstrator.',
    idiomatic:
      'In the eighth autumn month Wei Xuantong, minister of earth, was appointed acting remonstrator.',
  },
  s0061: {
    literal:
      'In the second month of spring of the fourth year the Qianyuan Hall was demolished and the Bright Hall built on its site.',
    idiomatic:
      'In the second spring month of the fourth year Qianyuan Hall was torn down and the Bright Hall raised in its place.',
  },
  s0062: {
    literal:
      'Shandong and Henan suffered severe famine; Wang Jishan, Director of Retainers; Ouyang Tong, Director of the Palace Storehouse; and Di Renjie, vice minister of winter affairs, were ordered on inspection tours to relieve and supply.',
    idiomatic:
      'With Shandong and Henan in famine, Wang Jishan, Ouyang Tong, and Di Renjie were sent to inspect, relieve, and provision the stricken regions.',
  },
  s0063: {
    literal:
      'In the fourth month of summer Prince Wu Chengsi of Wei forged an auspicious stone inscribed: "The Holy Mother presides over the people; the imperial line shall flourish forever.',
    idiomatic:
      'In the fourth summer month Prince Wu Chengsi of Wei forged a prophetic stone that read, "The Holy Mother rules mankind; the imperial house shall flourish forever.',
  },
  s0064: {
    literal:
      '" A man of Yongzhou, Tang Tongtai, memorialized that it had been obtained from the Luo River.',
    idiomatic:
      '" Tang Tongtai of Yongzhou reported its discovery in the Luo River.',
  },
  s0065: {
    literal:
      'The empress dowager was greatly pleased, named the stone the "Treasure Chart," and promoted Tongtai to general of the mobile guard.',
    idiomatic:
      'The empress dowager rejoiced, named the stone the Treasure Chart, and made Tongtai a general of the mobile guard.',
  },
  s0066: {
    literal:
      'In the fifth month the empress dowager added the honorific title Holy Mother, Divine Sovereign.',
    idiomatic:
      'In the fifth month she took the added honorific Holy Mother, Divine Sovereign.',
  },
  s0067: {
    literal: 'In the seventh month of autumn a general amnesty was proclaimed.',
    idiomatic: 'In the seventh autumn month the court proclaimed a general amnesty.',
  },
  s0068: {
    literal:
      'The "Treasure Chart" was renamed the "Chart Bestowed by Heaven," the spirit of the Luo was enfeoffed as Manifest Sage with special advancement, and a temple was established.',
    idiomatic:
      'The Treasure Chart was retitled the Chart Bestowed by Heaven; the Luo spirit was enfeoffed Manifest Sage with special advancement and given a temple.',
  },
  s0069: {
    literal: 'Beside the river the county of Yongchang was established.',
    idiomatic: 'Yongchang County was founded on the riverbank.',
  },
  s0070: {
    literal: 'Throughout the realm there were five days of public feasting.',
    idiomatic: 'The empire feasted for five days.',
  },
  s0071: {
    literal:
      'On renyin of the eighth month Prince Chong of Langye, prefect of Bozhou, seized Bozhou and raised troops; Qiu Shenji, general of the Left Golden Crow Guard, was appointed campaigning commander to suppress him.',
    idiomatic:
      'On renyin of the eighth month Prince Chong of Langye, prefect of Bozhou, rebelled; Qiu Shenji of the left golden crow guard was named campaigning commander against him.',
  },
  s0072: {
    literal:
      'On gengxu Chong\'s father Zhen, Prince of Yue and prefect of Yuzhou, also raised troops at Yuzhou in concert with Chong.',
    idiomatic:
      'On gengxu Chong\'s father Zhen, Prince of Yue and prefect of Yuzhou, rose at Yuzhou in support.',
  },
  s0073: {
    literal:
      'In the ninth month Cen Changqian, Grand Secretary; Zhang Guangfu, vice minister at Phoenix Pavilion; and Ju Chongyu, general of the Left Gate Guard, were ordered to lead troops in suppression.',
    idiomatic:
      'In the ninth month Cen Changqian, Zhang Guangfu, and Ju Chongyu were ordered to march against them.',
  },
  s0074: {
    literal:
      'On bingyin Zhen, Chong, and the rest were beheaded; their heads were sent to the Divine Capital, and their surname was changed to Hui.',
    idiomatic:
      'On bingyin Zhen, Chong, and their fellows were executed; their heads were displayed in the Divine Capital and the clan renamed Hui.',
  },
  s0075: {
    literal: 'A partial amnesty was granted for Bozhou.',
    idiomatic: 'Bozhou alone received a partial amnesty.',
  },
  s0076: {
    literal:
      'Prince Yuancheng of Han, Prince Lingqian of Lu, Yuancheng\'s son Chan the Duke of Huang, Lingqian\'s son Ai the Prince of Fanyang and left attendant of the cavalry, Prince Yuan\'gui of Huo and his son Xu the Prince of Jiangdu, and Rong the Duke of Dongguan, son of the late Prince Yuanfeng of Guo, were implicated in plotting with Zhen; Yuancheng and Lingqian killed themselves, Yuan\'gui was banished to Qianzhou, and Chan and the rest were executed—their surname changed to Hui.',
    idiomatic:
      'Princes Yuancheng of Han and Lingqian of Lu, their sons Chan and Ai, Prince Yuan\'gui of Huo and his son Xu, and Rong of Dongguan, son of the late Prince Yuanfeng of Guo, were judged complicit with Zhen; Yuancheng and Lingqian took their own lives, Yuan\'gui was exiled to Qianzhou, and the rest were executed—the clan renamed Hui.',
  },
  s0077: {
    literal:
      'From this the imperial princes were executed one after another, until they were nearly all gone.',
    idiomatic:
      'Thereafter imperial princes were killed in succession until the house was nearly extinct.',
  },
  s0078: {
    literal:
      'Their young sons and grandsons were all banished beyond the ranges, and several hundred families of their kin and partisans were executed.',
    idiomatic:
      'Young heirs were exiled beyond the mountains; kin and allies of hundreds of families were put to death.',
  },
  s0079: {
    literal:
      'On jiyou of the twelfth month the Divine Sovereign worshipped at the Luo River and received the Chart Bestowed by Heaven; that day she returned to the palace.',
    idiomatic:
      'On jiyou of the twelfth month the Divine Sovereign worshipped the Luo and received the Chart Bestowed by Heaven, then returned to court the same day.',
  },
  s0080: {
    literal: 'The Bright Hall was completed.',
    idiomatic: 'The Bright Hall was finished.',
  },
  s0081: {
    literal:
      'In the sixth month civil and military officials of the fifth rank and above were ordered each to recommend someone known to them.',
    idiomatic:
      'In the sixth month every civil and military official of the fifth rank or higher was ordered to nominate a worthy man.',
  },
  s0082: {
    literal:
      'In the seventh month of autumn Prince Shen of Ji was falsely accused of plotting rebellion, loaded into a caged cart, and banished to Bazhou; his surname was changed to Hui.',
    idiomatic:
      'In the seventh autumn month Prince Shen of Ji was denounced for treason, carted in a cage to Bazhou, and renamed Hui.',
  },
  s0083: {
    literal:
      'Wei Daibao was punished for delay in advancing; many soldiers died of hunger, and he was banished to Xiuzhou.',
    idiomatic:
      'Wei Daibao was punished for slow marching; his troops starved in great numbers, and he was exiled to Xiuzhou.',
  },
  s0084: {
    literal:
      'In the eighth month Wang Benli, Censor-in-Chief of the Right Office for Censorial Reform, was made equal in rank to the Three Offices at Phoenix Pavilion and Phoenix Terrace.',
    idiomatic:
      'In the eighth month Wang Benli, censor-in-chief of the Right Office for Censorial Reform, joined the third rank at Phoenix Pavilion and Terrace.',
  },
  s0085: {
    literal: 'On xinsi Grand Secretary Zhang Guangfu was executed.',
    idiomatic: 'On xinsi the court executed Grand Secretary Zhang Guangfu.',
  },
  s0086: {
    literal: 'In the ninth month Remonstrator Wei Xuantong was granted death at home.',
    idiomatic: 'In the ninth month Remonstrator Wei Xuantong was ordered to die at home.',
  },
  s0087: {
    literal:
      'In the tenth month of winter Fan Lubing, Minister of Spring; and Xing Wenwei, vice minister at Phoenix Pavilion, were both made equal in rank to the Phoenix Terrace chancellor.',
    idiomatic:
      'In the tenth winter month Fan Lubing and Xing Wenwei were both made chancellors of the Phoenix Terrace.',
  },
  s0088: {
    literal: 'The hundred riders of the Imperial Guard were changed to a thousand riders.',
    idiomatic: 'The Imperial Guard\'s hundred riders were expanded to a thousand.',
  },
  s0089: {
    literal:
      'In the first month of spring in the inaugural year of Zaichu, the Divine Sovereign personally performed sacrifice at the Bright Hall and proclaimed a general amnesty.',
    idiomatic:
      'In the first spring month of Zaichu 1 the Divine Sovereign sacrificed at the Bright Hall and proclaimed a general amnesty.',
  },
  s0090: {
    literal:
      'Following Zhou practice the zi month was made the year\'s opening; the eleventh month of Yongchang 1 was reckoned the first month of Zaichu 1, the twelfth month became the year-end month, and the former first month was renamed the First Month; there were three days of public feasting.',
    idiomatic:
      'Adopting the Zhou calendar, the zi month opened the year; Yongchang 1\'s eleventh month became Zaichu 1\'s first month, the twelfth became the year-end month, and the old New Year month was redesignated the First Month; the court feasted for three days.',
  },
  s0091: {
    literal:
      'The Divine Sovereign took the character Zhao as her name, and therefore changed edicts to "imperial pronouncements."',
    idiomatic:
      'Because she had adopted the character Zhao as her name, edicts were renamed imperial pronouncements.',
  },
  s0092: {
    literal:
      'In the first month, Su Liangsi became special advancement; Wu Chengsi became Left Minister of the Department of State Affairs; Cen Changqian became Right Minister; Pei Judao became Junior Tutor to the Heir Apparent—all retaining equal rank to the Three Offices at Phoenix Pavilion and Phoenix Terrace.',
    idiomatic:
      'In the new first month Su Liangsi became special advancement; Wu Chengsi left minister of state; Cen Changqian right minister; Pei Judao junior tutor to the heir—all of third rank at Phoenix Pavilion and Terrace.',
  },
  s0093: {
    literal:
      'Wu Youning, vice minister at Phoenix Pavilion, became Remonstrator; Xing Wenwei became Grand Secretary.',
    idiomatic:
      'Wu Youning became remonstrator; Xing Wenwei became grand secretary.',
  },
  s0094: {
    literal:
      'In the seventh month of autumn Prince Dan of Yuzhang was killed, and his father Prince Yuanming of Shu was moved to Hezhou.',
    idiomatic:
      'In the seventh autumn month Prince Dan of Yuzhang was executed and his father Prince Yuanming of Shu was exiled to Hezhou.',
  },
  s0095: {
    literal:
      'Ten monks forged the Great Cloud Sutra and presented it, lavishly proclaiming the Divine Sovereign\'s mandate to rule.',
    idiomatic:
      'Ten monks forged the Great Cloud Sutra and presented it, proclaiming at length that Heaven had chosen the Divine Sovereign.',
  },
  s0096: {
    literal:
      'An imperial pronouncement was issued throughout the realm ordering each prefecture to establish a Great Cloud Monastery and ordain a thousand monks in all.',
    idiomatic:
      'A pronouncement ordered every prefecture to found a Great Cloud Monastery and ordain a thousand monks empire-wide.',
  },
  s0097: {
    literal:
      'On dinghai Prince Shangjin of Ze, prefect of Suizhou, and Prince Sunjie of Xu, prefect of Shuzhou, together with several tens of their sons, were executed.',
    idiomatic:
      'On dinghai Princes Shangjin of Ze and Sunjie of Xu, with dozens of their sons, were put to death.',
  },
  s0098: {
    literal:
      'On renwu, the ninth day of the ninth month, the mandate of Tang was set aside and the state name changed to Zhou.',
    idiomatic:
      'On renwu, the Double Ninth, Tang\'s mandate was cast off and the dynasty renamed Zhou.',
  },
  s0099: {
    literal:
      'The era name was changed to Tianshou, a general amnesty was proclaimed, and seven days of public feasting were granted.',
    idiomatic:
      'The era was renamed Tianshou; the court proclaimed a general amnesty and granted seven days of feasting.',
  },
  s0100: {
    literal:
      'On yiyou the honorific title Holy Divine Emperor was added, and the emperor was demoted to imperial heir.',
    idiomatic:
      'On yiyou she took the title Holy Divine Emperor and reduced the emperor to imperial heir.',
  },
};

const path = 'translations/current_translation_jiutangshu.json';
const data = JSON.parse(readFileSync(path, 'utf8'));
if (data.metadata.chapter !== '006') {
  throw new Error(`Expected chapter 006, got ${data.metadata.chapter}`);
}
const source = JSON.parse(readFileSync('data/jiutangshu/006.json', 'utf8'));
const zhById = new Map();
for (const block of source.content) {
  for (const s of block.sentences ?? []) zhById.set(s.id, s.zh);
}
let applied = 0;
for (const s of data.sentences) {
  const pair = T[s.id];
  if (!pair) continue;
  const zh = zhById.get(s.id);
  if (zh && s.chinese !== zh) {
    throw new Error(`${s.id}: chinese mismatch with data/jiutangshu/006.json`);
  }
  if (pair.literal === pair.idiomatic) {
    throw new Error(`${s.id}: literal and idiomatic must differ`);
  }
  s.literal = pair.literal;
  s.idiomatic = pair.idiomatic;
  applied++;
}
writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', applied, 'translations (expected', Object.keys(T).length, ')');
