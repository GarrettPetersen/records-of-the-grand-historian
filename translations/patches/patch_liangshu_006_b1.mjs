#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 6, Basic Annals 6',
    'Book of Liang, Volume 6, Annals 6',
  ],
  s0002: [
    'In the third month, Qi sent its Prince of Shangdang Gao Huan to escort Marquis of Zhenyang Xiao Yuanming to assume the Liang succession; reaching Dong Pass, they sent Wuxing Administrator Pei Zhiheng to fight; defeated in battle, Zhiheng died.',
    'In the third month Qi sent Prince of Shangdang Gao Huan to escort Zhenyang marquis Xiao Yuanming to take the Liang succession; at Dong Pass Wuxing administrator Pei Zhiheng fought them and was defeated and killed.',
  ],
  s0003: [
    'Grand Marshal Wang Senbian led the masses and went out to encamp at Gudu.',
    'Grand marshal Wang Senbian led troops out to camp at Gudu.',
  ],
  s0004: [
    'In the fourth month, Minister of Education Lu Fafa attached Yingzhou to Qi; they sent Jiangzhou Inspector Hou Tian to suppress him.',
    'In the fourth month Minister of Education Lu Fafa surrendered Yingzhou to Qi; Jiangzhou inspector Hou Tian was sent against him.',
  ],
  s0005: [
    'On xinchou in the seventh month Wang Senbian received Marquis of Zhenyang Xiao Yuanming and crossed the river from Caishi.',
    'On xinchou in the seventh month Wang Senbian received Zhenyang marquis Xiao Yuanming and crossed from Caishi.',
  ],
  s0006: [
    'On jiachen he entered the capital; the emperor was made crown prince.',
    'On jiachen he entered the capital and the emperor was made crown prince.',
  ],
  s0007: [
    'On jiachen in the ninth month Minister of Works Chen Baxian raised righteousness, launched a surprise attack and killed Wang Senbian, and deposed Xiao Yuanming.',
    'On jiachen in the ninth month Minister of Works Chen Baxian rose in revolt, killed Wang Senbian in a surprise attack, and deposed Xiao Yuanming.',
  ],
  s0008: [
    'On bingwu the emperor ascended the imperial throne.',
    'On bingwu the emperor took the throne.',
  ],
  s0009: [
    'In winter, the tenth month, day jisi, year 1 of Shaotai, an edict said: "The royal house is not established, suffering calamity and misfortune; the western capital was lost, the court fell into ruin; the former emperor\'s coffin was cast to improper places, the royal foundation tilted and slackened, and throughout the realm none upheld [us].',
    'On jisi in the tenth month of winter, Shaotai year 1, an edict said: "The royal house is unformed, stricken with disaster; the western capital fell, the court collapsed; the late emperor\'s coffin wandered abroad, the throne shook, and the realm had no support.',
  ],
  s0010: [
    'I, being crude and young, again belonged to hardship; weeping blood and sleeping on spear, my will was to restore vengeance against rebels.',
    'I was young and untried, thrust again into hardship; weeping blood and sleeping on my spear, I meant to avenge rebellion.',
  ],
  s0011: [
    'Great shame not yet washed away, dawn and dusk choked with anger.',
    'Great shame was unavenged; day and night I choked on rage.',
  ],
  s0012: [
    'All dukes, ministers, and officials urged me with great righteousness to overstep and ascend to my dimness, succeeding to uphold the great enterprise.',
    'The ministers urged me with great righteousness to step beyond my worth and succeed to the great enterprise.',
  ],
  s0013: [
    'Looking back on my former heart, I never thought to reach here.',
    'Looking to my former heart, I never imagined this.',
  ],
  s0014: [
    'I hope to rely on former spirits above and borrow generals and ministers beside me to overcome the chief evil and repay wrong at the imperial tomb.',
    'I hope to lean on our forefathers\' spirits and on our generals and ministers to destroy the chief villain and settle the wrong done the imperial tombs.',
  ],
  s0015: [
    'Now fate anew is recorded, ancestral temples again sacrifice; blessing flows to the hundred millions—is it mine alone?',
    'Now fate is renewed and the ancestral shrines restored; joy reaches the myriad people—not mine alone.',
  ],
  s0016: [
    'It is permissible to change Chengsheng year 4 to Shaotai year 1, great amnesty under heaven, inner and outer civil and military granted one rank in position.',
    'Chengsheng year 4 is to become Shaotai year 1; amnesty is granted throughout the realm, and civil and military officials within and without receive one rank.',
  ],
  s0017: [
    '" Marquis of Zhenyang Yuanming was made Minister of Education, enfeoffed Duke of Jian\'an commandery with fief of three thousand households.',
    '" Zhenyang marquis Yuanming was made Minister of Education and enfeoffed as Duke of Jian\'an with three thousand households.',
  ],
  s0018: [
    'On renzi Chen Baxian as Minister of Works was made Director of the Masters of Writing, commander over all military affairs within and without, Chariots and Cavalry General, and Inspector of Yang and South Xu—Minister of Works as before.',
    'On renzi Chen Baxian, still Minister of Works, became Director of the Masters of Writing, commander of all armies at home and abroad, Chariots and Cavalry General, and inspector of Yang and South Xu.',
  ],
  s0019: [
    'Zhenzhou Inspector Du Kan raised troops and attacked Trustworthy Martial General Chen Qian at Changcheng; Yixing Administrator Wei Zai held the commandery in response.',
    'Zhenzhou inspector Du Kan raised troops and attacked Trustworthy Martial General Chen Qian at Changcheng; Yixing administrator Wei Zai held the commandery in support.',
  ],
  s0020: [
    'On guichou Grand Master of War Xiao Xun was advanced to Grand Mentor, newly appointed Minister of Education Duke of Jian\'an Yuanming was made Grand Tutor, and Minister of Education Xiao Bo was made Grand Master of War.',
    'On guichou Grand Master of War Xiao Xun was promoted to Grand Mentor; newly appointed Minister of Education Duke of Jian\'an Yuanming became Grand Tutor; Minister of Education Xiao Bo became Grand Master of War.',
  ],
  s0021: [
    'Pacifying South General Wang Lin was made Chariots and Cavalry General with gate equal to the Three Excellencies.',
    'Pacifying South General Wang Lin was made Chariots and Cavalry General with an office equal to the Three Excellencies.',
  ],
  s0022: [
    'On wuwu his birth mother Consort Xia Gui was honored as empress dowager.',
    'On wuwu his birth mother, Consort Xia Gui, was honored as empress dowager.',
  ],
  s0023: [
    'Consort Wang was established as empress.',
    'Consort Wang was made empress.',
  ],
  s0024: [
    'Pacifying East General and Yangzhou Inspector Zhang Biao had his title advanced to Grand General Who Conquers the East.',
    'Pacifying East General and Yangzhou inspector Zhang Biao was promoted to Grand General Who Conquers the East.',
  ],
  s0025: [
    'Pacifying North General and Qiao-Qin two-province inspector Xu Sihui had his title advanced to Grand General Who Conquers the North.',
    'Pacifying North General and inspector of Qiao and Qin Xu Sihui was promoted to Grand General Who Conquers the North.',
  ],
  s0026: [
    'Conquering South General and South Yuzhou Inspector Ren Yue had his title advanced to Grand General Who Conquers the South.',
    'Conquering South General and South Yuzhou inspector Ren Yue was promoted to Grand General Who Conquers the South.',
  ],
  s0027: [
    'On xinwei an edict ordered Minister of Works Chen Baxian east to attack Wei Zai.',
    'On xinwei an edict ordered Minister of Works Chen Baxian east against Wei Zai.',
  ],
  s0028: [
    'On bingzi Ren Yue and Xu Sihui raised troops in revolt, taking advantage of the capital\'s lack of preparation and stealthily seizing Shitou.',
    'On bingzi Ren Yue and Xu Sihui rebelled, exploiting the capital\'s unreadiness and seizing Shitou.',
  ],
  s0029: [
    'On dingchou Wei Zai surrendered and Yixing was pacified.',
    'On dingchou Wei Zai surrendered and Yixing was pacified.',
  ],
  s0030: [
    'Jinling Administrator Zhou Wenyu was sent leading troops to aid Changcheng.',
    'Jinling administrator Zhou Wenyu was sent with troops to relieve Changcheng.',
  ],
  s0031: [
    'On gengchen in the eleventh month Qi Anzhou Inspector Zhai Zichong, Chuzhou Inspector Liu Shirong, and Huaizhou Inspector Liu Damo led troops to join Ren Yue and entered Shitou.',
    'On gengchen in the eleventh month Qi\'s Anzhou inspector Zhai Zichong, Chuzhou inspector Liu Shirong, and Huaizhou inspector Liu Damo led troops to Ren Yue and entered Shitou.',
  ],
  s0032: [
    'On gengyin Minister of Works Chen Baxian returned to the capital.',
    'On gengyin Minister of Works Chen Baxian returned to the capital.',
  ],
  s0033: [
    'On gengxu in the twelfth month Xu Sihui and Ren Yue again jointly went to Caishi to welcome Qi reinforcements.',
    'On gengxu in the twelfth month Xu Sihui and Ren Yue again went together to Caishi to meet Qi reinforcements.',
  ],
  s0034: [
    'On bingchen Fierce General Hou Andu with a naval force intercepted them at Jiangning; the rebel masses were greatly routed; Sihui, Yue, and others fled to lands west of the river.',
    'On bingchen Fierce General Hou Andu intercepted them on the water at Jiangning; the rebels broke; Sihui, Yue, and others fled west of the river.',
  ],
  s0035: [
    'On gengshen Zhai Zichong and others requested surrender and were all released to return north.',
    'On gengshen Zhai Zichong and others surrendered and were sent back north.',
  ],
  s0036: [
    'In spring, the first month, day wuyin, year 1 of Taiping, great amnesty under heaven; those who with Ren Yue and Xu Sihui had sworn covenant and plotted together—no inquiry whatsoever.',
    'On wuyin in the first month of spring, Taiping year 1, a general amnesty was declared; those who had conspired with Ren Yue and Xu Sihui were not questioned.',
  ],
  s0037: [
    'Posthumous gifts were granted to all sons of Emperor Jianwen.',
    'The sons of Emperor Jianwen were posthumously honored.',
  ],
  s0038: [
    'The former Marquis of Yong\'an Que\'s son Hou succeeded to enfeoffment as Prince of Shaoling, attending upon Empress Hou of Emperor Xie.',
    'Hou, son of former Yong\'an marquis Que, succeeded as Prince of Shaoling to serve Empress Hou.',
  ],
  s0039: [
    'On guiwei Pacifying East General and Zhenzhou Inspector Du Kan surrendered; an edict granted death by gift; partial amnesty for Wuxing commandery.',
    'On guiwei Pacifying East General and Zhenzhou inspector Du Kan surrendered; an edict granted him death; Wuxing commandery received a partial amnesty.',
  ],
  s0040: [
    'On jihai Grand Mentor, Marquis of Yifeng Xiao Xun succeeded to enfeoffment as Prince of Poyang.',
    'On jihai Grand Mentor and Marquis of Yifeng Xiao Xun succeeded as Prince of Poyang.',
  ],
  s0041: [
    'East Yangzhou Inspector Zhang Biao besieged Taizhou Administrator Wang Huaizhen at Yan Rock.',
    'East Yangzhou inspector Zhang Biao besieged Taizhou administrator Wang Huaizhen at Yan Rock.',
  ],
  s0042: [
    'On gengxu in the second month Zhou Wenyu and Chen Qian were sent in surprise attack on Kuaiji to suppress Biao.',
    'On gengxu in the second month Zhou Wenyu and Chen Qian were sent to strike Kuaiji and suppress Biao.',
  ],
  s0043: [
    'On guichou Biao\'s chief clerk Xie Qi, marshal Shen Tai, and army commander Wu Baozhen and others raised the city in surrender; Biao was defeated and fled.',
    'On guichou Biao\'s chief clerk Xie Qi, marshal Shen Tai, and army commander Wu Baozhen surrendered the city; Biao was beaten and fled.',
  ],
  s0044: [
    'Central Guard General Prince Dakuen of Linchuan at his original title was given gate equal to the Three Excellencies; Central Protector Prince Dacheng of Guiyang was made Protector-General of the Army.',
    'Central Guard General Prince Dakuen of Linchuan received a gate equal to the Three Excellencies at his existing rank; Central Protector Prince Dacheng of Guiyang became Protector-General of the Army.',
  ],
  s0045: [
    'On bingchen a man of Ruoye village beheaded Zhang Biao; the head was sent to the capital; partial amnesty for East Yangzhou.',
    'On bingchen a man of Ruoye village beheaded Zhang Biao and sent his head to the capital; East Yangzhou received a partial amnesty.',
  ],
  s0046: [
    'On jiwei Zhenzhou was abolished and restored again to Wuxing commandery.',
    'On jiwei Zhenzhou was abolished and Wuxing commandery restored.',
  ],
  s0047: [
    'On guihai rebels Xu Sihui and Ren Yue raided Caishi garrison, seized garrison commander Mingzhou Inspector Zhang Huaijun, and entered Qi.',
    'On guihai rebels Xu Sihui and Ren Yue raided Caishi garrison, seized its commander Mingzhou inspector Zhang Huaijun, and went over to Qi.',
  ],
  s0048: [
    'On jiazi because the eastern lands had suffered Du Kan\'s and Zhang Biao\'s plunder and violence, envoys were sent to tour and inspect.',
    'On jiazi, because the east had suffered the ravages of Du Kan and Zhang Biao, touring envoys were dispatched.',
  ],
  s0049: [
    'On bingzi in the third month East Yangzhou was abolished and restored again to Kuaiji commandery.',
    'On bingzi in the third month East Yangzhou was abolished and Kuaiji commandery restored.',
  ],
  s0050: [
    'On renwu orders were issued far and near to use ancient and modern coins mixed together.',
    'On renwu orders went out far and near to use old and new coin together.',
  ],
  s0051: [
    'On wuxu Qi sent Grand General Xiao Gui out through Zha Pass toward Liang Mountain; Minister of Works Chen Baxian and army commander Huang Kan struck in counterattack and greatly defeated them.',
    'On wuxu Qi sent Grand General Xiao Gui from Zha Pass toward Liang Mountain; Minister of Works Chen Baxian and army commander Huang Kan counterattacked and routed them.',
  ],
  s0052: [
    'Gui retreated to hold Wuhu.',
    'Gui fell back to Wuhu.',
  ],
  s0053: [
    'Zhou Wenyu and Hou Andu with the massed armies were sent to hold Liang Mountain and resist them.',
    'Zhou Wenyu and Hou Andu were sent with the main armies to hold Liang Mountain against them.',
  ],
  s0054: [
    'In summer, the fourth month, day dingsi, Minister of Works Chen Baxian memorialized to go to Liang Mountain to comfort and tour the generals.',
    'On dingsi in the fourth month of summer Minister of Works Chen Baxian memorialized to visit Liang Mountain and reassure the commanders.',
  ],
  s0055: [
    'On renshen Hou Andu with light troops raided Qi field headquarters Sima Gong at Liyang, greatly defeated him, captives and booty in tens of thousands.',
    'On renshen Hou Andu with light troops raided Qi field headquarters Sima Gong at Liyang, routed him, and took tens of thousands captive.',
  ],
  s0056: [
    'On jiachen in the sixth month Qi secretly sent troops to Jiang Mountain Dragon Tail, slanting toward Mofu Mountain north, reaching northwest of the Xuanwu Shrine.',
    'On jiachen in the sixth month Qi secretly moved troops to Jiang Mountain\'s Dragon Tail, angling north past Mofu Mountain to the northwest of the Xuanwu Shrine.',
  ],
  s0057: [
    'On yimao Minister of Works Chen Baxian conferred command tokens on the massed armies and joined battle with Qi troops, greatly defeating them; beheaded Qi North Yanzhou Inspector Du Fangqing and Xu Sihui and his younger brother Sizong; captured alive Xu Sichan, Xiao Gui, Dongfang Lao, Wang Jingbao, Li Xiguang, Pei Yingqi, Liu Guiyi, and others—all were executed.',
    'On yimao Minister of Works Chen Baxian took command of the armies, met the Qi force, and won a great victory; he beheaded Qi\'s North Yanzhou inspector Du Fangqing, Xu Sihui, and Sihui\'s brother Sizong; he captured Xu Sichan, Xiao Gui, Dongfang Lao, Wang Jingbao, Li Xiguang, Pei Yingqi, Liu Guiyi, and others alive and executed them all.',
  ],
  s0058: [
    'On wuwu great amnesty under heaven; soldiers whose bodies fell on the battlefield—all were sent for burial rites; those without kin were at once buried in the field.',
    'On wuwu a general amnesty was declared; soldiers who fell in battle were given burial rites, and those without kin were buried on the spot.',
  ],
  s0059: [
    'On xinyou the emergency was lifted.',
    'On xinyou the emergency curfew was lifted.',
  ],
  s0060: [
    'In autumn, the seventh month, day bingzi, Chariots and Cavalry General and Minister of Works Chen Baxian was advanced to Minister of Education with added Supervisor of the Masters of Documents; the rest unchanged.',
    'On bingzi in the seventh month of autumn Chariots and Cavalry General and Minister of Works Chen Baxian was promoted to Minister of Education and Supervisor of the Masters of Documents; other posts were unchanged.',
  ],
  s0061: [
    'On dinghai Gate Equal to Three Excellencies Hou Tian was made Minister of Works.',
    'On dinghai Hou Tian, whose gate equaled the Three Excellencies, became Minister of Works.',
  ],
  s0062: [
    'On jiyou in the eighth month Grand Mentor Prince Xun of Poyang died.',
    'On jiyou in the eighth month Grand Mentor Prince Xun of Poyang died.',
  ],
  s0063: [
    'On renyin in the ninth month the era name was changed and great amnesty granted; filial piety, brotherliness, and strength in farming were granted one noble rank; extraordinary talent and conduct were to be memorialized from wherever found; those displaced by famine were ordered back to native lands.',
    'On renyin in the ninth month the era name was changed and a general amnesty granted; the filial, dutiful, and diligent in farming received one noble rank; unusual talent was to be reported from each region; famine refugees were ordered home.',
  ],
  s0064: [
    'Newly appointed Minister of Education Chen Baxian was advanced to Chancellor, Director of the Masters of Writing, Grand General Who Guards the Realm, and Yangzhou Governor; he was enfeoffed Duke of Yixing commandery.',
    'The new Minister of Education Chen Baxian was promoted to chancellor, Director of the Masters of Writing, Grand General Who Guards the Realm, and Yangzhou governor, and enfeoffed as Duke of Yixing.',
  ],
  s0065: [
    'Central Authority General Wang Chong at his original title was given gate equal to the Three Excellencies.',
    'Central Authority General Wang Chong received a gate equal to the Three Excellencies at his existing rank.',
  ],
  s0066: [
    'Minister of Personnel Wang Tong was made Right Vice Director of the Masters of Writing.',
    'Minister of Personnel Wang Tong became Right Vice Director of the Masters of Writing.',
  ],
  s0067: [
    'On dingsi Yingzhou Inspector Xu Du was made General of the Forward Command.',
    'On dingsi Yingzhou inspector Xu Du became General of the Forward Command.',
  ],
  s0068: [
    'In winter, the eleventh month, day yimao, Cloud Dragon and Spirit Tiger gates were raised.',
    'On yimao in the eleventh month of winter the Cloud Dragon and Spirit Tiger gates were built.',
  ],
  s0069: [
    'On renshen in the twelfth month Grand Master of War and Pacifying South General Xiao Bo was advanced to Grand Mentor and Rapid Cavalry General.',
    'On renshen in the twelfth month Grand Master of War and Pacifying South General Xiao Bo was promoted to Grand Mentor and Rapid Cavalry General.',
  ],
  s0070: [
    'Newly appointed Left Guard General Ouyang He was made Pacifying South General and Hengzhou Inspector.',
    'Newly appointed Left Guard General Ouyang He became Pacifying South General and Hengzhou inspector.',
  ],
  s0071: [
    'On renwu Pacifying South General Liu Fayu had his title advanced to Pacifying South General.',
    'On renwu Pacifying South General Liu Fayu was promoted to Annan General.',
  ],
  s0072: [
    'On jiawu former Shouchang magistrate Liu Rui was made Prince of Yiyin; former Pacify West legal bureau acting staff officer Xiao Hong was made Prince of Baling, attending upon the empresses of Song and Qi.',
    'On jiawu former Shouchang magistrate Liu Rui was made Prince of Yiyin; former Pacify West legal bureau acting staff officer Xiao Hong was made Prince of Baling to attend the Song and Qi empresses.',
  ],
  s0073: [
    'In spring, the first month, day renyin, year 2, an edict said: "The Master descended in spirit with perfected substance, threading benevolence and weaving righteousness, truly illuminating the uncrowned king, bearing forth mysterious achievement—those who look up find him ever higher, those he teaches never tire.',
    'On renyin in the first month of spring, year 2, an edict said: "The Master came down in spirit with perfected substance, threading benevolence and weaving righteousness, truly illuminating the uncrowned king and unfolding his hidden work; those who look up find him ever higher, those he teaches never weary.',
  ],
  s0074: [
    'Establishing loyalty and filial piety, his virtue covered the ordinary people; making rites and composing music, his Way topped all rulers.',
    'He established loyalty and filial piety and his virtue covered the people; he made rites and composed music and his Way surpassed all kings.',
  ],
  s0075: [
    'Though Mount Tai collapsed in loftiness and not one basket of earth remained, yet the surplus ripples of Sishui remain a thousand years later.',
    'Though Mount Tai fell and not a basket of earth was left, the lingering ripples of Sishui endure a thousand years on.',
  ],
  s0076: [
    'Since the imperial chart was obstructed, sacrificial offerings were not maintained; the gate of Veneration of the Sage—heirs and offspring were annihilated; the shrine of revering the spirit—meat and grain vessels stood empty.',
    'Since the imperial house was blocked, sacrifices were not kept up; at the Gate of Veneration of the Sage heirs were destroyed; at the shrine of the revered spirit meat and grain vessels stood empty.',
  ],
  s0077: [
    'Forever speaking his fame and splendor, truly mixed with reverent anguish.',
    'His fame and merit move one always to reverent grief.',
  ],
  s0078: [
    'Without, one may search and recommend the clan of Lu state to serve as heir to Veneration of the Sage;',
    'Abroad, the clan of Lu is to be sought out and one chosen as heir to Veneration of the Sage;',
  ],
  s0079: [
    'and together repair temple halls, supply and prepare sacrificial canon; seasonal offerings—all follow the old.',
    'and temple halls are to be repaired, offerings supplied, and seasonal sacrifices conducted as of old.',
  ],
  s0080: [
    '" That day, another edict: "Each province shall establish a rectifier, according to old custom visiting and recommending.',
    '" That same day another edict said: "Each province shall appoint a rectifier and, as before, seek out candidates.',
  ],
  s0081: [
    'One may not at once receive a single petition to sequence office; all must have the rectifier\'s seal affixed above, then measure and appoint.',
    'No one may advance on a lone petition alone; the rectifier must endorse it first, and only then is appointment to be made.',
  ],
  s0082: [
    'Examine in detail according to rank grades, striving to make them refined and true.',
    'Grades are to be applied with care so that appointments are exact.',
  ],
  s0083: [
    'Though Jing, Yong, Qing, and Yan for a time were blocked apart, gentry and officials mostly dwelt at Huaihai—still one should not abolish their bureau existence.',
    'Though Jing, Yong, Qing, and Yan were for a time cut off, many gentry and officials still lived around the Huai; their offices should not be abolished.',
  ],
  s0084: [
    'Kuaiji had abolished its province yet was still a great commandery; scholars and officials were numerous and broad—one may separately establish town residences.',
    'Kuaiji, though its province had been abolished, remained a great commandery with many scholars and officials; separate settlements may be established.',
  ],
  s0085: [
    'As for dividing commanderies and counties and newly titling provincial governors—all attach to original towns, without trouble of duplicate establishment.',
    'Where commanderies and counties are split and new provincial governors are named, they remain tied to their original seats and need no duplicate offices.',
  ],
  s0086: [
    'In selecting rectifiers, each time seek elders of virtue; comprehensively know and have other offices lead them.',
    'In choosing rectifiers, elders of virtue are to be sought, and knowledgeable men in other offices are to head the process.',
  ],
  s0087: [
    '" Chariots and Cavalry General, Gate Equal to Three Excellencies Wang Lin was made Minister of Works and Grand Rapid Cavalry General.',
    '" Chariots and Cavalry General Wang Lin, whose gate equaled the Three Excellencies, became Minister of Works and Grand Rapid Cavalry General.',
  ],
  s0088: [
    'Xunyang, Taiyuan, Qichang, Gaotang, and Xincai—five commanderies were divided to establish West Jiang province; at Xunyang it still served as provincial seat.',
    'Five commanderies—Xunyang, Taiyuan, Qichang, Gaotang, and Xincai—were split off to form West Jiang province, with Xunyang as its seat.',
  ],
  s0089: [
    'Another edict: "Among the imperial clan in court who opened states and inherited families, they still now say heir apparent—all may be permitted to succeed to their original ranks.',
    'Another edict said: "Among the imperial clan in court who hold fiefs and inherit houses, those still called heir apparent may all succeed to their original titles.',
  ],
  s0090: [
    '" Right Vice Director Wang Tong was made Left Vice Director of the Masters of Writing.',
    '" Right Vice Director Wang Tong became Left Vice Director of the Masters of Writing.',
  ],
  s0091: [
    'On dingsi Pacify West General and Yizhou Inspector Prince Shao of Changsha had his title advanced to Conquering South General.',
    'On dingsi Pacify West General and Yizhou inspector Prince Shao of Changsha was promoted to Conquering South General.',
  ],
  s0092: [
    'On gengwu in the second month Forward Command General Xu Du entered Dong Pass.',
    'On gengwu in the second month Forward Command General Xu Du entered Dong Pass.',
  ],
  s0093: [
    'Grand Mentor and Guangzhou Inspector Xiao Bo raised troops in revolt; he sent false commander Ouyang He, Fu Tai, and Bo\'s nephew son Zi as forward army; South Jiangzhou Inspector Yu Xiaoping joined with troops.',
    'Grand Mentor and Guangzhou inspector Xiao Bo rebelled; he sent Ouyang He, Fu Tai, and his nephew Zi as the vanguard; South Jiangzhou inspector Yu Xiaoping joined him with troops.',
  ],
  s0094: [
    'An edict ordered Pacify West General Zhou Wenyu, Pacify South General Hou Andu, and others to lead the massed armies south to suppress.',
    'An edict ordered Pacify West General Zhou Wenyu, Pacify South General Hou Andu, and others to lead the armies south against him.',
  ],
  s0095: [
    'On wuzi Xu Du reached Hefei and burned three thousand Qi ships.',
    'On wuzi Xu Du reached Hefei and burned three thousand Qi ships.',
  ],
  s0096: [
    'On guisi Zhou Wenyu\'s army at Bashan captured Ouyang He alive.',
    'On guisi Zhou Wenyu\'s army at Bashan took Ouyang He alive.',
  ],
  s0097: [
    'On gengzi in the third month Wenyu\'s forward army Ding Fahong at Zhi Pass captured Fu Tai alive.',
    'On gengzi in the third month Wenyu\'s vanguard Ding Fahong at Zhi Pass captured Fu Tai alive.',
  ],
  s0098: [
    'Xiao Zi and Yu Xiaoping\'s armies retreated and fled.',
    'Xiao Zi and Yu Xiaoping\'s armies withdrew and fled.',
  ],
  s0099: [
    'On jiachen newly appointed Minister of Works Wang Lin was made inspector of Xiang and Ying two provinces.',
    'On jiachen the new Minister of Works Wang Lin became inspector of Xiang and Ying.',
  ],
  s0100: [
    'On jiayin Dezhou Inspector Chen Fawu and former Hengzhou Inspector Tan Shiyuan at Shixing attacked and killed Xiao Bo.',
    'On jiayin Dezhou inspector Chen Fawu and former Hengzhou inspector Tan Shiyuan attacked and killed Xiao Bo at Shixing.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_006_b1.mjs <translation.json>'
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
