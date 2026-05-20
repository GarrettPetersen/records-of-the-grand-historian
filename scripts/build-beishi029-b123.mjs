#!/usr/bin/env node
import fs from "node:fs";

const T1 = {
  s0001: [
    "Sima Xiuzhi, Sima Chuzhi, Liu Chang, Xiao Baoyin, Xiao Zhengbiao, Xiao Zhi, Xiao Tui, Xiao Tai, Xiao Hui, Xiao Yuansu, Xiao Dahuan",
    "Sima Xiuzhi, Sima Chuzhi, Liu Chang, Xiao Baoyin, Xiao Zhengbiao, Xiao Zhi, Xiao Tui, Xiao Tai, Xiao Hui, Xiao Yuansu, and Xiao Dahuan",
  ],
  s0002: ["Biographies 17", "Biographies 17"],
  s0003: [
    "Sima Xiuzhi, Sima Chuzhi, great-grandson Yi, Sima Jingzhi, Sima Shufan, Sima Tianzhu, Liu Chang, Xiao Baoyin, nephew Zan, Xiao Zhengbiao, Xiao Zhi, Xiao Tui, Xiao Tai, Xiao Hui, Xiao Yuansu, Xiao Dahuan",
    "Sima Xiuzhi, Sima Chuzhi, great-grandson Yi, Sima Jingzhi, Sima Shufan, Sima Tianzhu, Liu Chang, Xiao Baoyin, nephew Zan, Xiao Zhengbiao, Xiao Zhi, Xiao Tui, Xiao Tai, Xiao Hui, Xiao Yuansu, and Xiao Dahuan",
  ],
  s0004: [
    "Sima Xiuzhi, styled Jiyu, was a man of Wen in Henei, a descendant of Prince of Qiao Jin, youngest brother of Emperor Xuan of Jin.",
    "Sima Xiuzhi, styled Jiyu, was from Wen in Henei, descended from Prince Jin of Qiao, youngest brother of Jin's Emperor Xuan.",
  ],
  s0005: [
    "After the Jin crossed the Yangzi, Jin's descendants inherited the fief of Prince of Qiao.",
    "After the Jin crossed south, the line of Prince Jin held the Qiao title in succession.",
  ],
  s0006: [
    "By Xiuzhi's time his father Tian was General Who Pacifies the North and Inspector of Qing and Yan Provinces.",
    "Xiuzhi's father Tian was General Who Pacifies the North and dual Inspector of Qing and Yan.",
  ],
  s0007: [
    "In the fifth year of Tianxing, Xiuzhi was Inspector of Jing Province; driven out by Huan Xuan, he fled to Murong De.",
    "In Tianxing year 5 he governed Jing until Huan Xuan expelled him and he fled to Murong De.",
  ],
  s0008: [
    "When Xuan was executed, he returned to Jiankang and again became Inspector of Jing.",
    "After Xuan's death he returned to Jiankang and resumed the Jing inspectorship.",
  ],
  s0009: [
    "Xiuzhi had won considerable favor among the people of the Jiang and Han region.",
    "He had won deep goodwill along the Jiang and Han.",
  ],
  s0010: [
    "His son Wensi succeeded his elder brother Shangzhi as Prince of Qiao and plotted against Liu Yu.",
    "His son Wensi succeeded elder brother Shangzhi as Prince of Qiao and plotted against Liu Yu.",
  ],
  s0011: [
    "Yu seized Xiuzhi and sent him forward, making him act at Yu's bidding.",
    "Yu seized him and used him as his instrument.",
  ],
  s0012: [
    "Xiuzhi memorialized to depose Wensi and also wrote Yu a letter of apology.",
    "Xiuzhi petitioned to depose Wensi and wrote Yu apologizing.",
  ],
  s0013: [
    "In the Shenrui era Yu seized Xiuzhi's son Wenbao and his nephew Wenzu and killed them, then marched against Xiuzhi.",
    "In Shenrui, Yu killed Xiuzhi's son Wenbao and nephew Wenzu, then attacked Xiuzhi.",
  ],
  s0014: [
    "Xiuzhi with Lu Zongzhi and Zongzhi's son Gui raised troops to attack Yu.",
    "Xiuzhi joined Lu Zongzhi and Zongzhi's son Gui in arms against Yu.",
  ],
  s0015: [
    "Defeated, he fled with his son Wensi and Zongzhi to Yao Xing.",
    "Beaten, he fled with Wensi and Zongzhi to Yao Xing.",
  ],
  s0016: [
    "When Yu destroyed Yao Hong, Xiuzhi with Wensi and several hundred men including Jin Prince of Hejian Zidaosi all brought wives and children and surrendered to Changsun Song.",
    "When Yu destroyed Yao Hong, Xiuzhi, Wensi, Prince Zidaosi of Hejian, and hundreds more surrendered to Changsun Song with their families.",
  ],
  s0017: [
    "At death he was posthumously made Grand General Who Conquers the West, Right Grandee of Splendid Virtue, Duke of Shiping, posthumous name Sheng.",
    "He died and was posthumously Grand General Who Conquers the West, Right Grandee of Splendid Virtue, Duke of Shiping, posthumous name Sheng.",
  ],
  s0018: [
    "Wensi was at odds with Duke of Huainan Guo Fan and Pool-Yang Zidaosi, yet feigned closeness with them.",
    "Wensi disliked Duke Guo Fan of Huainan and Zidaosi of Chiyang but pretended friendship.",
  ],
  s0019: [
    "Guo Fan was blunt by nature; drunk, he wished to defect outward.",
    "Guo Fan was blunt; drunk once, he meant to flee.",
  ],
  s0020: ["Wensi reported them; all were executed for the crime.", "Wensi informed; all were put to death."],
  s0021: [
    "Wensi was made Minister of Justice and enfeoffed Duke of Yulin.",
    "Wensi became Minister of Justice and Duke of Yulin.",
  ],
  s0022: [
    "Wensi was skilled in his office; in hearing cases the people could not hide their circumstances.",
    "He excelled at his post; in court the people could not conceal the facts.",
  ],
  s0023: [
    "Advanced to Prince of Qiao, he held the post of General Who Pacifies the Wilderness and died.",
    "He rose to Prince of Qiao and General Who Pacifies the Wilderness, then died.",
  ],
  s0024: [
    "Sima Chuzhi, styled Dexiu, was an eighth-generation descendant of Grand Commandant Kui, younger brother of Emperor Xuan of Jin.",
    "Sima Chuzhi, styled Dexiu, was eight generations from Grand Commandant Kui, Jin Emperor Xuan's younger brother.",
  ],
  s0025: [
    "His father Rongqi was Jin Inspector of Yi Province and was killed by his aide Yang Chengzu.",
    "His father Rongqi, Jin's Yi Inspector, was killed by aide Yang Chengzu.",
  ],
  s0026: [
    "Chuzhi was then seventeen; he escorted his father's coffin back to Danyang.",
    "Chuzhi was seventeen and bore his father's coffin back to Danyang.",
  ],
  s0027: [
    "When Liu Yu exterminated the Sima clan, his uncle Xuanqi and elder brother Zhenzhi were both killed.",
    "When Liu Yu purged the Simas, uncle Xuanqi and brother Zhenzhi perished.",
  ],
  s0028: [
    "Chuzhi fled and hid among monks, crossed the river to the Ru and Ying region.",
    "He hid among monks, crossed the river, and reached the Ru–Ying country.",
  ],
  s0029: [
    "Chuzhi from youth had heroic spirit and could humble himself to treat scholars.",
    "From youth he had heroic bearing and knew how to win men by courtesy.",
  ],
  s0030: [
    "When Song received the mandate, he planned revenge.",
    "When the Song took the throne he plotted vengeance.",
  ],
  s0031: [
    "He gathered followers and held Changshe; those who came to him often numbered more than ten thousand.",
    "He held Changshe with more than ten thousand followers.",
  ],
  s0032: [
    "Emperor Wu of Song feared him deeply and sent the assassin Mu Qian to plot his death.",
    "Song's Emperor Wu sent the assassin Mu Qian against him.",
  ],
  s0033: ["Chuzhi treated Qian with great kindness.", "Chuzhi treated Qian with exceptional kindness."],
  s0034: [
    "Qian feigned illness by night, knowing Chuzhi would surely come, intending to kill him when he did.",
    "Qian feigned sickness at night, sure Chuzhi would visit and meaning to strike then.",
  ],
  s0035: [
    "Hearing Qian was ill, Chuzhi indeed brought soup and medicine himself to visit him.",
    "Hearing of the illness, Chuzhi came in person with soup and medicine.",
  ],
  s0036: [
    "Qian was moved by his intent, produced a dagger from beneath the mat, told the whole plan, and thereupon devoted himself to serve him.",
    "Moved, Qian drew the dagger from under the mat, confessed the plot, and served him thereafter.",
  ],
  s0037: [
    "His pushing sincerity and trusting things—winning men's hearts—were all of this kind.",
    "Winning hearts by sincerity was always his way.",
  ],
  s0038: [
    "At the end of Mingyuan, Duke of Shanyang Xi Jin overran Henan; Chuzhi sent envoys to surrender and was made Inspector of Jing.",
    "Late in Mingyuan, Duke Xi Jin of Shanyang took Henan; Chuzhi surrendered and was made Jing Inspector.",
  ],
  s0039: [
    "When Xi Jin had pacified Henan, Chuzhi's following in households was distributed into the four commanderies Runan, Ruyang, Nandun, and Xincai to enlarge Yu Province.",
    "After Henan fell, his households were split among Runan, Ruyang, Nandun, and Xincai to swell Yu.",
  ],
  s0040: [
    "At the beginning of Taiwu, Chuzhi sent wife and children to live within at Ye.",
    "Early in Taiwu he sent family to live inside at Ye.",
  ],
  s0041: [
    "Soon summoned to court, he was made Grand General Who Pacifies the South, enfeoffed Prince of Langye, to resist the Song army.",
    "Soon at court he was Grand General Who Pacifies the South and Prince of Langye against Song.",
  ],
  s0042: ["He was granted front and rear guard musicians.", "He received front and rear guard musicians."],
  s0043: [
    "He defeated a detached force of the Song general Dao Yanzhi at Changshe.",
    "He routed Song general Dao Yanzhi's detached force at Changshe.",
  ],
  s0044: [
    "Again with Champion An Qi he stormed and took Huatai, capturing Song generals Zhu Xiuzhi and Li Yuande and Administrator of Dongjun Shen Mo, with more than ten thousand prisoners.",
    "With Champion An Qi he took Huatai, capturing Zhu Xiuzhi, Li Yuande, Dongjun's Shen Mo, and over ten thousand men.",
  ],
  s0045: [
    "He memorialized asking to advance further in attack; Taiwu, because the army had long been weary, did not agree and recalled him as Regular Attendant.",
    "He asked to press the attack; Taiwu, the troops weary, refused and recalled him as Regular Attendant.",
  ],
  s0046: [
    "Song generals Pei Fangming and Hu Chongzhi invaded Chouchi.",
    "Song generals Pei Fangming and Hu Chongzhi attacked Chouchi.",
  ],
  s0047: [
    "Chuzhi with Duke of Huainan Pi Baozi and others supervised the Guanzhong armies, routed Fangming, and captured Chongzhi.",
    "Chuzhi with Duke Pi Baozi of Huainan commanded Guanzhong forces, routed Fangming, and took Chongzhi.",
  ],
  s0048: ["Chouchi was pacified and he returned.", "Chouchi pacified, he returned."],
  s0049: [
    "When the imperial carriage campaigned against the Rouran, Chuzhi with Duke of Jiyin Lu Zhongshan and others supervised transport to follow the great army.",
    "On the Rouran campaign Chuzhi with Duke Lu Zhongshan of Jiyin directed supply trains for the main host.",
  ],
  s0050: [
    "At the time General Who Pacifies the North Feng Dang had fled into the Rouran and urged them to strike Chuzhi to cut off grain transport.",
    "General Feng Dang had fled to the Rouran and urged them to hit Chuzhi and sever supplies.",
  ],
  s0051: [
    "The Rouran then sent scouts to Chuzhi's army, cut off donkeys' ears, and left.",
    "The Rouran scouted his camp, clipped donkeys' ears, and withdrew.",
  ],
  s0052: [
    "When someone reported the lost donkeys' ears, Chuzhi said: \"Surely the scouts cut them as proof—the enemy is coming.",
    "Told of the clipped ears, Chuzhi said, \"Scouts took them as proof—the foe is near.",
  ],
  s0053: [
    "\" He then felled willows for a wall, poured water to freeze it; the wall stood and the enemy came but could not storm it and scattered.",
    "He felled willows, flooded them to ice a wall; when the enemy came they could not breach it and broke away.",
  ],
  s0054: ["Taiwu heard and praised him.", "Taiwu heard and praised him."],
  s0055: [
    "Soon he was given acting credentials, made Palace Attendant, Grand General Who Pacifies the West, Grand Marshal with credentials equal to the Three Excellencies, Grand General of the Yunzhong Garrison, and Inspector of Shuo.",
    "Soon acting credentials, Palace Attendant, Grand General Who Pacifies the West, Grand Marshal equal to the Three Excellencies, Yunzhong commander, and Shuo Inspector.",
  ],
  s0056: [
    "At the beginning of Jinlong he married the daughter of Grand Commandant and Duke of Longxi Yuan He.",
    "In Jinlong's opening he wed Grand Commandant Yuan He's daughter, Duchess of Longxi.",
  ],
  s0057: ["He had sons Yanzong, next Zuan, next Yue.", "Sons Yanzong, then Zuan, then Yue."],
  s0058: [
    "Later he took a Juqu wife and had son Huiliang—that was the daughter of Hexi King Juqu Mujian, born of Taiwu's sister Princess Wuwei.",
    "Later a Juqu wife bore Huiliang—daughter of King Juqu Mujian of Hexi, child of Taiwu's sister Princess Wuwei.",
  ],
  s0059: [
    "Favored by Empress Dowager Wenming, Huiliang therefore inherited.",
    "Favored by Empress Dowager Wenming, Huiliang inherited the house.",
  ],
  s0060: [
    "By precedent he was reduced to duke; implicated in Mu Tai's crime he lost his title and died.",
    "Reduced by precedent to duke, implicated in Mu Tai's affair he lost rank and died.",
  ],
  s0061: ["Yue, styled Qingzong, rose to Inspector of Yu Province.", "Yue, styled Qingzong, became Inspector of Yu."],
  s0062: [
    "At the time there was one Dong Maonu of Shangcai in Runan, carrying five thousand cash.",
    "In Runan's Shangcai a man named Dong Maonu carried five thousand cash.",
  ],
  s0063: ["He died on the road.", "He died on the road."],
  s0064: [
    "The commandery and county people suspected Zhang Di of robbery; at Di's house they also found five thousand cash; Di, fearing torture, falsely confessed to murder.",
    "Locals suspected Zhang Di; five thousand cash was found at his house; fearing torture he confessed murder.",
  ],
  s0065: [
    "At the province Yue studied his expression and doubted it was true.",
    "At the province Yue read his face and doubted the confession.",
  ],
  s0066: [
    "He summoned Maonu's elder brother Lingzhi and said: \"In killing for money one is flustered at the time and ought to leave something behind—what did you get?",
    "He summoned brother Lingzhi: \"A killer in haste leaves something—what was it?",
  ],
  s0067: ["Lingzhi said: \"Only a knife-handle plane.", "Lingzhi said, \"Only a knife-handle plane.",
  ],
  s0068: [
    "\" Yue took it to look and said: \"This is not the work of a lane thug.",
    "Yue inspected it: \"No alley thug made this.",
  ],
  s0069: ["He then summoned knife-makers within the province to show it.", "He called the province's blade-makers."],
  s0070: [
    "One before the Guo Gate said: \"This plane was made by the gate artisan; last year it was sold to Guo townsman Dong Jizu.",
    "One at the Guo Gate said a gate artisan made it and sold it last year to Dong Jizu.",
  ],
  s0071: ["Yue seized Jizu and interrogated him; Jizu confessed in full.", "Yue seized Jizu; he confessed everything."],
  s0072: [
    "Lingzhi also found on Jizu's person the black jacket Maonu had worn; Jizu was executed by law.",
    "On Jizu Lingzhi found Maonu's black jacket; Jizu was executed.",
  ],
  s0073: ["Yue's scrutiny of prisons was often of this kind.", "Yue's prison work was often thus."],
  s0074: [
    "Soon with General Who Pacifies the South Yuan Ying he stormed Yiyang; an edict changed Liang's Si Province to Ying Province and made Yue its inspector.",
    "Soon with Yuan Ying he took Yiyang; Liang's Si became Ying and Yue was made inspector.",
  ],
  s0075: ["Changed to Inspector of Yu Province;", "He was shifted to Inspector of Yu;"],
  s0076: [
    "for former merit he was enfeoffed Marquis of Yuyang.",
    "for past merit he was enfeoffed Marquis of Yuyang.",
  ],
  s0077: [
    "In the first year of Yongping, the city man Bai Zaosheng plotted rebellion and beheaded Yue's head to send to Liang.",
    "Yongping year 1, Bai Zaosheng rebelled and sent Yue's head to Liang.",
  ],
  s0078: [
    "An edict had Yang Province transfer a reward for Yue's head; he was posthumously made Inspector of Qing, posthumous name Zhuangzi.",
    "Yang Province was ordered to ransom the head; posthumously Qing Inspector, posthumous name Zhuangzi.",
  ],
  s0079: ["Son Fei inherited.", "Son Fei inherited."],
  s0080: [
    "Fei married Emperor Xuanwu's sister Princess Huayang, was made Commandant of the Horse Guards and Supernumerary Regular Attendant.",
    "Fei wed Princess Huayang, sister of Xuanwu, and became Commandant of Horse Guards and supernumerary attendant.",
  ],
  s0081: ["He died; posthumously made Inspector of Cang.", "He died and was posthumously Cang Inspector."],
  s0082: ["Son Hong, styled Qingyun, was rough and martial by nature.", "Son Hong, styled Qingyun, was rough and martial."],
  s0083: [
    "He inherited the title, held the post of Commissioner of the Imperial Waterways, and was sentenced to death for communicating with Western Wei.",
    "He inherited, served as Commissioner of Waterways, and was executed for ties to Western Wei.",
  ],
  s0084: ["Son Xiaozheng inherited.", "Son Xiaozheng inherited."],
  s0085: ["When Qi received the mandate, by precedent he was reduced in rank.", "When Qi took the throne his rank was reduced by precedent."],
  s0086: ["Fei's younger brother Yi.", "Fei's younger brother Yi."],
  s0087: [
    "Yi, styled Zunyin, was orphaned young and had resolve and conduct.",
    "Yi, styled Zunyin, was orphaned young but steadfast.",
  ],
  s0088: [
    "He began as staff officer in the Minister of State's office, later became Supernumerary Regular Attendant.",
    "He began in the Minister of State's office, later supernumerary attendant.",
  ],
  s0089: [
    "In the third year of Datong, when the great army recovered Hongnong, he at Wencheng offered allegiance and returned to Western Wei.",
    "Datong 3, when Hongnong was recovered, he submitted at Wencheng to Western Wei.",
  ],
  s0090: ["In the sixth year he was made Inspector of Northern Xu Province.", "Year 6 he became Northern Xu Inspector."],
  s0091: ["In the eighth year he entered court.", "Year 8 he came to court."],
  s0092: [
    "Emperor Wen of Zhou praised him and especially rewarded and comforted him.",
    "Zhou's Emperor Wen praised and specially rewarded him.",
  ],
  s0093: [
    "Before long, more than four thousand households in Henei came over—all Yi's old neighbors—and he was ordered to lead as Administrator of Henei to settle the displaced.",
    "Soon four thousand Henei households, his old neighbors, submitted; he was made Henei magistrate to settle refugees.",
  ],
  s0094: [
    "In the fifteenth year Zhou Wen ordered that righteous leaders east of the mountains who could lead crowds through the Pass would all receive added rewards.",
    "Year 15 Zhou Wen promised added reward to eastern leaders who could bring men through the Pass.",
  ],
  s0095: [
    "Yi led a thousand households first to arrive; Zhou Wen wished to enfeoff Yi for it.",
    "Yi brought a thousand households first; Wen meant to enfeoff him for it.",
  ],
  s0096: [
    "Yi declined: \"Men who rise in righteousness and return from afar to the imperial transformation all do so from sincere hearts within—how could Yi lead them?",
    "Yi declined: \"Righteous men who return from afar act from their own hearts—how could I lead them?",
  ],
  s0097: [
    "To enfeoff Yi now would be to sell righteous men for glory.",
    "Enfeoffing me now would be buying glory with righteous men.",
  ],
  s0098: ["Zhou Wen approved and followed his wish.", "Wen approved and let it pass."],
  s0099: [
    "He was made Commander-in-Chief and his wife Yuan was made Princess of Xiangcheng Commandery.",
    "He was made Commander-in-Chief; his wife Yuan became Princess of Xiangcheng.",
  ],
  s0100: [
    "When Emperor Xiaomin of Zhou took the throne, he was made Inspector of Ba Province, advanced to Commissioner with credentials, Grand General of Agile Cavalry, and Grand Marshal with credentials equal to the Three Excellencies, advanced to Baron of Langye.",
    "At Xiaomin's accession he was Ba Inspector, then Commissioner, Agile Cavalry Grand General, Grand Marshal equal to the Three Excellencies, Baron of Langye.",
  ],
};

const T2 = {
  s0101: [
    "In the fourth year he was made Chief Rectifier of the Imperial Clan and advanced to duke.",
    "Year 4 he became Chief Rectifier and was advanced to duke.",
  ],
  s0102: [
    "When the great army campaigned east, Yi with Junior Mentor Yang Yi held Zhiguan Pass and at once was made Inspector of Huai.",
    "On the eastern campaign Yi with Yang Yi held Zhiguan and was made Huai Inspector.",
  ],
  s0103: [
    "At the beginning of Tianhe he followed Duke of Shangyong Lu Teng in attacking the rebellious Man of Xinzhou, Ran Lingxian and others.",
    "At Tianhe's start he followed Duke Lu Teng of Shangyong against Xinzhou rebels Ran Lingxian and others.",
  ],
  s0104: [
    "Yi entered by the Kaizhou route, first sent envoys to proclaim fortune and calamity, and the tribes all submitted.",
    "He entered by Kaizhou, proclaimed fortune and ruin, and the tribes submitted.",
  ],
  s0105: ["He held the posts of Inspector of Xin and Tong in succession.", "He governed Xin and Tong in turn."],
  s0106: [
    "In the sixth year he was summoned as Grand General and made Inspector of Xining, but before reaching his post he died in the capital.",
    "Year 6 he was summoned Grand General and Xining Inspector but died in the capital before taking post.",
  ],
  s0107: [
    "Yi was frugal by nature and did not pursue production; the salary he received he gave entirely to kin;",
    "Yi lived plainly and gave all salary to kin;"],
  s0108: ["at the day of his death the house had no surplus wealth.", "at his death the house held nothing."],
  s0109: [
    "His dwelling was low and shabby; there was no place for the mourning hall—an edict built a shrine for him.",
    "His house was mean; no hall for mourning—an edict raised a shrine.",
  ],
  s0110: [
    "Posthumously his former office, with addition of Inspector of Si, posthumous name Ding.",
    "Posthumously his rank plus Si Inspector, posthumous name Ding.",
  ],
  s0111: ["Son Kan inherited.", "Son Kan inherited."],
  s0112: [
    "Kan, styled Daoyuan, was resolute and brave from youth; before the capping age he already followed the army.",
    "Kan, styled Daoyuan, was bold young and took the field before capping age.",
  ],
  s0113: [
    "He held the post of Administrator of Lean, and for military merit was added Grand General of Agile Cavalry and Grand Marshal with credentials equal to the Three Excellencies.",
    "He governed Lean, and for merit gained Agile Cavalry Grand General and Grand Marshal equal to the Three Excellencies.",
  ],
  s0114: [
    "Transferred to Inspector of Yan, he did not reach his post and died.",
    "Shifted to Yan Inspector, he died before arriving.",
  ],
  s0115: [
    "Posthumously his former office, with addition of Inspector of Yu, posthumous name Hui.",
    "Posthumously his rank plus Yu Inspector, posthumous name Hui.",
  ],
  s0116: ["Son Yun inherited.", "Son Yun inherited."],
  s0117: [
    "Chuzhi's younger brother Yue, styled Baolong, married the Princess of Zhao Commandery and was made Commandant of the Horse Guards.",
    "Younger brother Yue, styled Baolong, wed Princess of Zhao and became Commandant of Horse Guards.",
  ],
  s0118: [
    "He replaced his elder brother as commander of the Yunzhong garrison, was made Inspector of Shuo, acting General Who Pacifies the North, and Duke of Henei.",
    "He replaced his brother at Yunzhong, became Shuo Inspector, acting General Who Pacifies the North, Duke of Henei.",
  ],
  s0119: [
    "He memorialized asking to abolish the Hexi park preserve and grant the land to people for cultivation.",
    "He asked to open the Hexi imperial park to settlers.",
  ],
  s0120: [
    "The offices held fast and reported: this park is where elk gather and the Imperial Kitchen draws supply; if granted to people, they feared something would be lacking.",
    "Offices objected: elk feed the kitchen; opening it might leave a shortfall.",
  ],
  s0121: ["Yue pressed the request firmly; Emperor Xiaowen followed it.", "Yue pressed on; Xiaowen agreed."],
  s0122: [
    "Returned as Minister of the Imperial Clan, Grand Master of Splendid Happiness, and tutor to Prince of Yingchuan, and died.",
    "He returned as Minister of the Imperial Clan, Grand Master of Splendid Happiness, tutor to Prince of Yingchuan, then died.",
  ],
  s0123: [
    "Father and son Chuzhi in succession garrisoned Yunzhong; the northern soil submitted to their might and virtue.",
    "Father and son held Yunzhong in turn; the north honored their might and virtue.",
  ],
  s0124: [
    "Among the Sima clan who returned north in the time of Huan Xuan and Liu Yu were also Sima Jingzhi, Shufan, and Tianzhu, all holding lofty posts.",
    "Other Simas who fled north in the days of Huan Xuan and Liu Yu—Jingzhi, Shufan, Tianzhu—also rose high.",
  ],
  s0125: [
    "Jingzhi, styled Honglue, was a descendant of Jin Prince of Runan Liang.",
    "Jingzhi, styled Honglue, descended from Jin's Prince Liang of Runan.",
  ],
  s0126: [
    "In the Mingyuan era he came to court, was enfeoffed Duke of Cangwu, and added Grand General Who Pacifies the South.",
    "In Mingyuan he came to court, was made Duke of Cangwu and Grand General Who Pacifies the South.",
  ],
  s0127: ["He was upright and had integrity.", "He was upright and principled."],
  s0128: ["He died; posthumously enfeoffed Prince of Runan.", "He died and was posthumously Prince of Runan."],
  s0129: ["Son Shizi inherited the title.", "Son Shizi inherited."],
  s0130: [
    "Jingzhi's elder brother Zhun, styled Juzhi, returned to Wei at the end of Taichang.",
    "Elder brother Zhun, styled Juzhi, came to Wei late in Taichang.",
  ],
  s0131: ["Enfeoffed Duke of Xin'an.", "He was enfeoffed Duke of Xin'an."],
  s0132: [
    "Made Administrator of Guangning, changed to Marquis of Miling.",
    "He governed Guangning, then was made Marquis of Miling.",
  ],
  s0133: ["He died; son Anguo inherited the title.", "He died; son Anguo inherited."],
  s0134: [
    "Shufan was a descendant of Jin Prince of Anping, Duke Xian Fu.",
    "Shufan descended from Jin's Prince Xian Fu of Anping.",
  ],
  s0135: ["His father Tanzhi was Jin Prince of Hejian.", "His father Tanzhi was Jin Prince of Hejian."],
  s0136: [
    "In the time of Huan Xuan and Liu Yu, Shufan with his elder brother Guo Fan fled to Murong Chao.",
    "In the turmoil Shufan and brother Guo Fan fled to Murong Chao.",
  ],
  s0137: ["Later he went to Yao Hong.", "Later he joined Yao Hong."],
  s0138: ["When Hong was destroyed, he fled to Qu Mugai.", "When Hong fell he fled to Qu Mugai."],
  s0139: [
    "When Tongwan was pacified, the brothers both entered Wei.",
    "When Tongwan fell both brothers entered Wei.",
  ],
  s0140: [
    "Guo Fan was enfeoffed Duke of Huainan; Shufan was enfeoffed Marquis of Danyang.",
    "Guo Fan became Duke of Huainan; Shufan Marquis of Danyang.",
  ],
  s0141: [
    "Tianzhu was himself son of Jin General of Agile Cavalry Yuanxian.",
    "Tianzhu was son of Jin's Agile Cavalry General Yuanxian.",
  ],
  s0142: [
    "Coming to court, he was enfeoffed Duke of Donghai and held the posts of Inspector of Qing and Yan in succession.",
    "At court he was Duke of Donghai and dual Inspector of Qing and Yan.",
  ],
  s0143: ["Chang loved dogs and horses and delighted in military affairs.", "Chang loved hounds and horses and delighted in arms."],
  s0144: [
    "Having entered Wei and passed through several reigns, he still wore plain cloth and black cap, the same garb as for fierce mourning.",
    "In Wei through several reigns he still wore plain cloth and black cap like mourning dress.",
  ],
  s0145: [
    "Yet he would shout at and beat servants; his speech mixed barbarian and Chinese.",
    "Yet he abused servants in a mixed barbarian-Chinese tongue.",
  ],
  s0146: [
    "Even in public sessions the princes would each mock and toy with him.",
    "Even in open court the princes mocked him.",
  ],
  s0147: [
    "Some would twist his hand and bite his arm until he was wounded in pain; the sound of their laughter reached the emperor's hearing.",
    "Some twisted his hand or bit his arm till he cried; laughter reached the throne.",
  ],
  s0148: [
    "Emperor Xiaowen always treated him with extra favor and did not regard it as strange to question.",
    "Xiaowen always indulged him and never took offense.",
  ],
  s0149: [
    "But when he memorialized on affairs of his native state and spoke of levies and corvée, he would compose his face and weep; grief moved those beside him.",
    "Yet memorializing on his old country and corvée he wept till all beside him grieved.",
  ],
  s0150: ["Yet by nature he was narrow and quick; joy and anger were not constant.", "By nature he was narrow and volatile."],
  s0151: [
    "Whenever wrath flared, the cudgel and switch were especially harsh;",
    "In rage his beatings were savage;"],
  s0152: [
    "toward southern gentlemen his courtesy was often lacking.",
    "toward southerners his courtesy often failed.",
  ],
  s0153: ["Because of this, men harbored fear and kept away.", "Men feared him and kept their distance."],
  s0154: [
    "At the beginning of Taihe he was transferred to Director of the Inner Court's Grand Provisioners.",
    "Early in Taihe he became Director of the Inner Court's Grand Provisioners.",
  ],
  s0155: [
    "At the beginning of Qi an edict had Chang and the generals campaign south.",
    "At Qi's founding Chang was ordered south with the generals.",
  ],
  s0156: [
    "Passing Xuzhou, he wept and bowed at his mother's old hall; grief moved those who followed.",
    "At Xuzhou he wept at his mother's old hall and moved his escort.",
  ],
  s0157: [
    "He then went everywhere through his old dwellings; at each place tears fell, and those beside him could not keep from stinging in the nose.",
    "He walked his old streets weeping; companions wept with him.",
  ],
  s0158: [
    "When he reached the army's place and was about to take the field, he bowed on four sides to the officers and soldiers and himself declared that his house and state were destroyed and he was covered by the court's kindness.",
    "Before battle he bowed to the ranks, saying his state was gone and only the court's grace remained.",
  ],
  s0159: [
    "His words were cutting and true, his voice excited and rising; tears streamed; the whole army was moved to sigh.",
    "His words were keen, his voice fierce; tears ran; the whole army sighed.",
  ],
  s0160: [
    "Later Chang, fearing that rain would soon come, memorialized asking to withdraw the army, and it was granted.",
    "Later, fearing rain, he asked to withdraw and was allowed.",
  ],
  s0161: [
    "Again added Grand Marshal with credentials equal to the Three Excellencies and head of the Ministry of Rites.",
    "He was again Grand Marshal equal to the Three Excellencies and head of Rites.",
  ],
  s0162: [
    "At the time the court was reforming court ceremony; an edict had Chang and Jiang Shaoyou take sole charge of the matter.",
    "The court reformed ritual; Chang and Jiang Shaoyou were put in sole charge.",
  ],
  s0163: [
    "Chang listed the old forms upward; scarcely anything was forgotten.",
    "Chang listed the old forms and forgot almost nothing.",
  ],
  s0164: [
    "Emperor Xiaowen at the Xuanwen Hall summoned Prince of Wuxing Yang Jishi to enter the feast and told Chang: \"Jishi is a frontier chieftain—not enough to match the rites due feudal lords.",
    "At Xuanwen Hall Xiaowen feasted Prince Yang Jishi of Wuxing and told Chang, \"A frontier chief cannot match feudal rites—yet the throne does not disdain small states' ministers, so we trouble you nobles here.",
  ],
  s0165: [
    "Yet the king does not disdain the minister of a small state, and therefore has wearied you, duke and ministers, here.",
    "That is why you are wearied here.",
  ],
  s0166: ["Again made Director of the Secretariat.", "He was again Director of the Secretariat."],
  s0167: [
    "When the five ranks were established, Chang was enfeoffed Duke of Qi Commandery with the added title of King of Song.",
    "When five ranks were founded he was Duke of Qi Commandery with the added title King of Song.",
  ],
  s0168: [
    "In the seventeenth year Xiaowen at the Jingwu Hall held great discussion of the southern campaign.",
    "Year 17 Xiaowen at Jingwu Hall debated the southern war.",
  ],
  s0169: [
    "When talk touched the usurpations of Liu and Xiao, Chang would weep without end.",
    "Speaking of Liu and Xiao usurpations he wept without cease.",
  ],
  s0170: [
    "The emperor also wept for it; his courtesy toward Chang grew ever more exalted.",
    "The emperor wept too and honored him the more.",
  ],
  s0171: [
    "In the eighteenth year he was made Commissioner with credentials, Area Commander of Wu, Yue, Chu, and Pengcheng forces, Grand General, and Grand Marshal, garrisoning Xuzhou.",
    "Year 18 he was Commissioner, area commander of Wu, Yue, Chu, and Pengcheng, Grand General and Grand Marshal at Xuzhou.",
  ],
  s0172: [
    "Chang repeatedly memorialized declining the post of Grand General; the edict did not permit it.",
    "He repeatedly declined Grand General; the throne refused.",
  ],
  s0173: [
    "At his departure the emperor personally saw him off and ordered the hundred officials to compose poems to present to Chang.",
    "At departure the emperor feasted him and ordered poems from the hundred offices.",
  ],
  s0174: ["He also gave him one collection of his own writings.", "He also gave a volume of his own writings."],
  s0175: [
    "The emperor then showed him the brushwork he himself had composed and said: \"The times fit ending slaughter; affairs turn on literary enterprise.",
    "The emperor showed his own writing and said, \"Times favor ending slaughter; affairs turn on letters.",
  ],
  s0176: [
    "Though I do not study, I cannot bear to stop.",
    "Though I do not study, I cannot stop.",
  ],
  s0177: [
    "On a whim I wished you to see them, and therefore show them—though they have no flavor worth speaking of, they may still raise a laugh.",
    "I wished you to see them—thin fare, but perhaps a laugh.",
  ],
  s0178: ["He valued Chang to this degree.", "He valued Chang to that degree."],
  s0179: [
    "From the time Chang left Pengcheng until now was long; his former fasting halls, mountains, and pools still stood;",
    "Long since he left Pengcheng his old halls, hills, and pools still stood;"],
  s0180: ["Chang repaired them anew and dwelt within them again.", "Chang restored them and lived there again."],
  s0181: [
    "He could not soothe the frontier and cherish men, comfort and receive old associates, yet within the inner gates it was noisy and vulgar, inside and outside mixed with villainy, and old officials all sighed in regret.",
    "He failed the border and old friends while his household grew riotous and corrupt; veterans sighed.",
  ],
  s0182: [
    "He prepared his tomb southwest of Pengcheng, in the same mound as the Third Princess but in a separate chamber.",
    "He prepared a tomb southwest of Pengcheng, sharing a mound with the Third Princess but not her vault.",
  ],
  s0183: [
    "When stone was piled the mound collapsed and crushed more than ten men to death.",
    "While piling stone the mound collapsed and killed more than ten.",
  ],
  s0184: [
    "Later it was moved and altered again; public and private expense was harmed.",
    "Later it was moved again at great public and private cost.",
  ],
  s0185: [
    "Chang's eldest son Chengxu was born of the princess, his principal wife.",
    "Eldest son Chengxu was the princess's child.",
  ],
  s0186: [
    "Sickly from youth, he married Emperor Xiaowen's sister Princess of Pengcheng, was Commandant of Horse Guards, and died before Chang.",
    "Frail from youth, he wed Xiaowen's sister Princess of Pengcheng, was Commandant of Horse Guards, and predeceased Chang.",
  ],
  s0187: [
    "Chengxu's son Hui, styled Chongchang, was heir and inherited the fief.",
    "Chengxu's son Hui, styled Chongchang, was heir and inherited.",
  ],
  s0188: [
    "He married Emperor Xuanwu's second elder sister Princess of Lanling.",
    "He married Xuanwu's second elder sister, Princess of Lanling.",
  ],
  s0189: [
    "The princess was fiercely jealous; Hui once secretly favored her waiting maid.",
    "The princess was fiercely jealous; Hui once lay with her maid.",
  ],
  s0190: [
    "She became pregnant; the princess flogged her to death;",
    "The maid conceived; the princess beat her dead;"],
  s0191: [
    "cut open the pregnancy, dismembered it limb by limb, stuffed the maid's belly with straw, and displayed her naked to Hui.",
    "she cut out the child, dismembered it, stuffed straw in the maid's belly, and showed the corpse naked to Hui.",
  ],
  s0192: [
    "Hui then nursed resentment and grew cold toward the princess.",
    "Hui nursed hatred and grew cold toward her.",
  ],
  s0193: [
    "The princess's elder sister, entering to hear lectures, told Empress Dowager Ling the cause.",
    "Her elder sister, attending lectures at court, told Empress Dowager Ling.",
  ],
  s0194: [
    "The empress dowager ordered Prince of Qinghe Yi to investigate the affair to the end.",
    "The empress dowager ordered Prince Yi of Qinghe to investigate.",
  ],
  s0195: [
    "Yi with Prince of Gaoyang Yong and Prince of Guangping Huai memorialized their disharmony and asked divorce and removal of enfeoffment.",
    "Yi with Prince Yong of Gaoyang and Prince Huai of Guangping reported their strife and sought divorce and loss of rank.",
  ],
  s0196: ["The empress dowager followed it.", "The empress dowager agreed."],
  s0197: [
    "The princess was in the palace a full year; Yong and the others repeatedly asked permission to restore the old bond.",
    "A year in the palace Yong and others repeatedly asked to restore the marriage.",
  ],
  s0198: [
    "The empress dowager wept as she sent the princess back and admonished her to be cautious and restrained.",
    "The empress dowager wept sending her back and warned her to be restrained.",
  ],
  s0199: [
    "At the beginning of Zhengguang Hui again secretly debauched the daughters of the Zhang and Chen families.",
    "Early in Zhengguang Hui again lay secretly with daughters of Zhang and Chen.",
  ],
  s0200: ["The princess no longer checked or forbade it.", "The princess no longer restrained him."],
};

const T3 = {
  s0201: [
    "The princess's aunt Princess of Chenliu together wielded fans to encourage them, and with Hui again came to angry quarrel.",
    "Her aunt Princess of Chenliu fanned the affair on, and Hui quarreled with the princess again.",
  ],
  s0202: [
    "Hui pushed the princess from the bed and beat and trampled her hands and feet; the princess thus miscarried.",
    "Hui threw her from the bed and trampled her; she miscarried.",
  ],
  s0203: ["Hui, fearing punishment, fled.", "Fearing punishment, Hui fled."],
  s0204: [
    "Empress Dowager Ling summoned Prince of Qinghe Yi to decide the affair.",
    "Empress Dowager Ling summoned Prince Yi of Qinghe to judge.",
  ],
  s0205: [
    "The two families' daughters were shaved and flogged at the palace assembly; the brothers were all punished with the whip.",
    "The Zhang and Chen daughters were shaved and flogged at court; their brothers were whipped.",
  ],
  s0206: ["They were banished to Dunhuang as soldiers.", "They were sent to Dunhuang as soldiers."],
  s0207: [
    "The princess died from her wounds; the empress dowager came in person to mourn and weep, and mourning was raised at the eastern hall of the Supreme Ultimate.",
    "The princess died of her wounds; the empress dowager mourned at the eastern hall of the Supreme Ultimate.",
  ],
  s0208: [
    "Burial was outside the western wall; the empress dowager escorted several li and returned only when grief was spent.",
    "Buried outside the west wall; the empress dowager escorted her several li and returned in grief.",
  ],
  s0209: [
    "Later Hui was seized at Wen in Henei, imprisoned in Si Province, and was to receive the death penalty.",
    "Later Hui was taken at Wen in Henei, held in Si Province, and marked for death.",
  ],
  s0210: ["An amnesty came and he was spared.", "An amnesty spared him."],
  s0211: [
    "Later his office and title were restored; he was moved to General Who Conquers the Barbarians and Regular Attendant, and died—the house then declined.",
    "Later rank was restored; he was General Who Conquers the Barbarians and Regular Attendant, then died—the house faded.",
  ],
  s0212: [
    "Xiao Baoyin, styled Zhiliang, was the sixth son of Emperor Ming of Qi, younger brother of the mother of the deposed emperor Baojuan.",
    "Xiao Baoyin, styled Zhiliang, was Qi Emperor Ming's sixth son, younger brother of deposed Emperor Baojuan's mother.",
  ],
  s0213: ["In Qi he was enfeoffed Prince of Jian'an.", "In Qi he was Prince of Jian'an."],
  s0214: [
    "When Emperor He of Qi took the throne, he was changed to Prince of Poyang.",
    "When Emperor He acceded he was made Prince of Poyang.",
  ],
  s0215: [
    "When Emperor Wu of Liang took Jiankang, troops guarded him and were about to harm him.",
    "When Liang's Emperor Wu took Jiankang, guards were set to kill him.",
  ],
  s0216: [
    "His household eunuch Yan Wenzhi with attendants Ma Gong and Huang Shen secretly plotted, broke through the wall by night, and brought Baoyin out.",
    "Eunuch Yan Wenzhi with Ma Gong and Huang Shen broke through the wall at night and stole him out.",
  ],
  s0217: [
    "They prepared a small boat on the riverbank; they stripped his formal dress and put on a black cloth jacket;",
    "A small boat waited on the bank; they stripped his robes for a black cloth jacket;"],
  s0218: [
    "at the waist he tied more than a thousand cash and stole to the riverbank;",
    "he tied a thousand-odd cash at his waist and stole to the shore;"],
  s0219: [
    "treading sandals he went on foot; his feet had no whole skin.",
    "in sandals he walked until his feet had no whole skin.",
  ],
  s0220: ["The guards pursued at dawn.", "Guards pursued at dawn."],
  s0221: [
    "Baoyin pretended to be a fisherman, drifting up and down the stream more than ten li; the pursuers did not suspect.",
    "He played fisherman, drifting ten li; pursuers passed him by.",
  ],
  s0222: [
    "When they dispersed, he then crossed to the west bank.",
    "When they broke off he crossed to the west bank.",
  ],
  s0223: ["He then entrusted his life to Hua Wenrong.", "He then cast himself on Hua Wenrong."],
  s0224: [
    "Wenrong with his followers Tianlong, Huilian, and three others abandoned their families, hid Baoyin in mountain ravines, hired donkeys to ride, lay by day and marched by night.",
    "Wenrong with Tianlong, Huilian, and three others abandoned home, hid him in the hills, rode hired donkeys, and marched by night.",
  ],
  s0225: [
    "In the second year of Jingming he reached the eastern-wall garrison of Shouyang.",
    "Jingming year 2 he reached Shouyang's eastern garrison.",
  ],
  s0226: [
    "Garrison chief Du Yuanlun examined him and knew he was truly a son of the Xiao house; he received him with ritual courtesy.",
    "Garrison chief Du Yuanlun identified a true Xiao prince and received him with ceremony.",
  ],
  s0227: [
    "He sent word in haste to Yang Province Inspector, Prince of Rencheng Cheng.",
    "He reported at once to Yang Inspector Prince Cheng of Rencheng.",
  ],
  s0228: ["Cheng came with carriage, horses, and guards to welcome him.", "Cheng came with carriage, horses, and escort."],
  s0229: [
    "He was then sixteen; on foot, haggard and worn, viewers thought him a kidnapped slave being sold.",
    "Sixteen, on foot and haggard, onlookers took him for a sold captive.",
  ],
  s0230: ["Cheng received him with guest rites.", "Cheng treated him as a guest."],
  s0231: [
    "He then asked for the hemp mourning of a murdered lord; Cheng sent men to explain the proper feeling and ritual, and in the rites for a murdered elder brother gave him the hemp of the next degree; Baoyin obeyed.",
    "He asked for hemp mourning for a slain sovereign; Cheng explained ritual and gave him second-degree hemp for a slain elder brother; Baoyin obeyed.",
  ],
  s0232: ["Cheng led the officials to offer condolence.", "Cheng led officials to mourn."],
  s0233: [
    "Baoyin's dwelling had ritual propriety; he did not drink wine or eat meat;",
    "Baoyin lived with ritual; no wine or meat;"],
  s0234: [
    "he ceased laughter and spoke briefly, all one with the utmost of mourning.",
    "he ceased laughter and spoke little, in utmost mourning.",
  ],
  s0235: [
    "In Shouyang many of his old associates came; all received his comfort and condolence.",
    "Many old associates in Shouyang came; he received them in mourning.",
  ],
  s0236: [
    "Only he did not see the Xiahou clan, because they were of Liang.",
    "He avoided the Xiahous, being Liang men.",
  ],
  s0237: [
    "Another day he visited Cheng; Cheng deeply valued him.",
    "Another day he called on Cheng, who prized him deeply.",
  ],
  s0238: [
    "When he reached the capital, Emperor Xuanwu honored him heavily.",
    "At the capital Xuanwu honored him greatly.",
  ],
  s0239: [
    "He prostrated himself below the palace gate and begged troops for a southern campaign; though violent wind and heavy rain came, he never moved for a moment.",
    "He knelt at the gate begging troops south; through storm he did not stir.",
  ],
  s0240: [
    "That year Liang's Inspector of Jiangzhou Chen Bozhi with his chief clerk Chu Zhou and others returned from Shouyang to surrender and asked to lead an army for merit.",
    "That year Liang's Jiang Inspector Chen Bozhi with Chu Zhou surrendered from Shouyang offering service.",
  ],
  s0241: [
    "The emperor said that what Bozhi reported could not be lost in time.",
    "The emperor said Bozhi's offer could not wait.",
  ],
  s0242: [
    "Because Baoyin was earnest and sincere, he was made Commissioner with credentials, Area Commander, Inspector of Eastern Yang, General Who Pacifies the East, Duke of Danyang, Prince of Qi, with ten thousand troops assigned, ordered to hold the eastern wall and await the great stroke in autumn and winter.",
    "For his earnestness he was Commissioner, eastern commander, Eastern Yang Inspector, General Who Pacifies the East, Duke of Danyang, Prince of Qi, with ten thousand men at the eastern wall till autumn's campaign.",
  ],
  s0243: [
    "The night before he was to receive the appointment he wept in anguish.",
    "The night before investiture he wept in anguish.",
  ],
  s0244: [
    "At dawn the full ritual of investiture was prepared; carriage, horses, and objects were granted; the affair was rich and thick, yet still not equal to Liu Chang's exceptional favor.",
    "At dawn full investiture came with rich gifts—yet still short of Liu Chang's favor.",
  ],
  s0245: [
    "He was also allowed to recruit valiant men throughout the realm and got several thousand.",
    "He was allowed to recruit braves and gathered thousands.",
  ],
  s0246: [
    "Wenzhi and the other three were made generals of powerful crossbows; Wenrong and the other three were made generals of strong crossbows, all as army commanders.",
    "Wenzhi's three became powerful-crossbow generals; Wenrong's three strong-crossbow generals—all army commanders.",
  ],
  s0247: [
    "Though Baoyin was young and long a hostage, his will and nature were elegant and weighty.",
    "Young and long exiled, his will was still elegant and grave.",
  ],
  s0248: [
    "Past the mourning term he still abstained from wine and meat; his face was haggard, he ate vegetables and coarse cloth and never laughed.",
    "Past mourning he still abstained; haggard, in vegetables and coarse cloth, he never laughed.",
  ],
  s0249: [
    "When ordered to campaign south, the great and powerful relied on him in multitudes; his gate was like a market of guests.",
    "Ordered south, the powerful crowded his gate like a market.",
  ],
  s0250: [
    "Yet letters followed one another and Baoyin answered and replied without losing reason.",
    "Letters piled up; he answered each without losing reason.",
  ],
  s0251: [
    "In the first year of Zhengshi, Baoyin reached Ruyin; the eastern wall had fallen, so he stopped at Shouyang's Qixian Temple.",
    "Zhengshi year 1 he reached Ruyin; the eastern wall had fallen, so he halted at Shouyang's Qixian Temple.",
  ],
  s0252: [
    "He met Liang general Jiang Qingzhen invading within; Qingzhen besieged Shouyang.",
    "Liang's Jiang Qingzhen invaded and besieged Shouyang.",
  ],
  s0253: [
    "Baoyin led the crowd in fierce battle and routed him.",
    "Baoyin fought hard and routed him.",
  ],
  s0254: [
    "Baoyin's courage topped the armies; those who heard and saw were all stirred.",
    "His courage topped the armies; all who saw were stirred.",
  ],
  s0255: ["On return he was changed to Duke of Liang Commandery.", "On return he was made Duke of Liang Commandery."],
  s0256: [
    "When Prince of Zhongshan Ying campaigned south, Baoyin again memorialized asking to campaign.",
    "When Prince Ying of Zhongshan marched south Baoyin again asked to go.",
  ],
  s0257: [
    "With Ying he repeatedly defeated Liang armies and pressed the attack on Zhongli.",
    "With Ying he repeatedly beat Liang and pressed Zhongli.",
  ],
  s0258: [
    "The Huai overflowed; Baoyin and Ying withdrew in disorder; soldiers drowned and perished—four or five in ten.",
    "The Huai flooded; Baoyin and Ying fled in disorder; four or five in ten drowned.",
  ],
  s0259: [
    "The offices memorialized that he should receive the extreme penalty.",
    "Offices asked the extreme penalty.",
  ],
  s0260: [
    "An edict pardoned death; he was dismissed from office, stripped of title, and returned to his house.",
    "An edict spared death, stripped office and rank, and sent him home.",
  ],
  s0261: ["Soon he married the Princess of Nanyang.", "Soon he married the Princess of Nanyang."],
  s0262: [
    "The princess had wifely virtue; Baoyin fully observed harmonious rites; though fond of her, his respectful service did not slacken.",
    "The princess was virtuous; he kept full harmony; fond yet never slack in respect.",
  ],
  s0263: [
    "Whenever Baoyin entered the chamber the princess always stood to await him; they met like guests; unless the queen mother's illness was grave he never retired to rest.",
    "When he entered she stood; they met as guests; unless the queen mother was gravely ill he never rested within.",
  ],
  s0264: [
    "Baoyin's disposition was gentle and compliant; he placed himself within ritual, revered the princess, and inside and outside were sheltered in harmony.",
    "Gentle and compliant, he kept ritual, revered her, and household and court were at peace.",
  ],
  s0265: ["Prince of Qinghe Yi was kin and valued him.", "Prince Yi of Qinghe was kin and prized him."],
  s0266: [
    "In the fourth year of Yongping, Lu Chang took Liang's Zhushan garrison; Langye garrison chief Fu Wenji guarded it.",
    "Yongping year 4 Lu Chang took Liang's Zhushan; Langye chief Fu Wenji held it.",
  ],
  s0267: [
    "Liang's army attacked Wenji; Chang supervised the mass of armies to rescue him.",
    "Liang attacked Wenji; Chang led the host to relieve him.",
  ],
  s0268: [
    "An edict made Baoyin Commissioner with credentials and acting General Who Pacifies the South, a separate commander driving deep to the rescue, under Chang's command.",
    "Baoyin was Commissioner and acting General Who Pacifies the South, a separate column under Chang.",
  ],
  s0269: [
    "Receiving the edict, tears streamed; he choked for a long while.",
    "Receiving the edict he wept and choked long.",
  ],
  s0270: [
    "Later Chang's army was defeated; only Baoyin brought the whole army back intact.",
    "Later Chang was beaten; only Baoyin brought the army back whole.",
  ],
  s0271: [
    "At the beginning of Yanxi he was made Inspector of Ying, restored as Prince of Qi, and moved to Inspector of Ji.",
    "Yanxi's start made him Ying Inspector, restored Prince of Qi, then Ji Inspector.",
  ],
  s0272: [
    "When the Mahayana rebels rose, Baoyin sent troops to attack them and was repeatedly beaten by the rebels.",
    "When Mahayana rebels rose he sent troops and was repeatedly beaten.",
  ],
  s0273: [
    "When the capital army arrived, they were then destroyed.",
    "When the capital army came they were destroyed.",
  ],
  s0274: ["Empress Dowager Ling held court and he returned to the capital.", "Empress Dowager Ling held court; he returned to the capital."],
  s0275: [
    "Liang general Kang Xuan at Fushan dammed the Huai to flood Yang and Xu.",
    "Liang's Kang Xuan dammed the Huai at Fushan to flood Yang and Xu.",
  ],
  s0276: [
    "Baoyin was made Commissioner with credentials, Area Commander of the Eastern Expedition, General Who Pacifies the East, to attack him, and again enfeoffed Duke of Liang Commandery.",
    "Baoyin was eastern commander and General Who Pacifies the East against him, again Duke of Liang Commandery.",
  ],
  s0277: [
    "At the beginning of Xiping, when Liang's dam was complete and the Huai was about to become a calamity for Yang and Xu, Baoyin cut a new channel above the dam and the water lessened somewhat.",
    "Xiping's start: Liang's dam threatened Yang and Xu; Baoyin cut a channel above it and eased the flood.",
  ],
  s0278: [
    "He then sent more than a thousand stalwarts by night across the Huai, burned their bamboo-and-wood camps, broke three fortresses, and fires burned for days without going out.",
    "He sent a thousand men by night across the Huai, burned bamboo camps, broke three forts; fires burned for days.",
  ],
  s0279: [
    "He also sent separate commanders to defeat Liang generals Yuan Mengsun and Zhang Sengfu north of the Huai.",
    "Separate columns defeated Liang generals Yuan Mengsun and Zhang Sengfu north of the Huai.",
  ],
  s0280: [
    "He then crossed south of the Huai and burned eleven camps of Liang's Inspector of Xuzhou Zhang Baozi and others.",
    "He crossed south and burned eleven camps of Liang's Xu Inspector Zhang Baozi and others.",
  ],
  s0281: ["On return to the capital he was made Director of the Palace Department.", "Back at court he was Director of the Palace Department."],
  s0282: [
    "While Baoyin was at the Huai dam, Emperor Wu of Liang sent a letter lodged to entice him.",
    "At the Huai dam Liang's Emperor Wu sent a letter to entice him.",
  ],
  s0283: [
    "Baoyin memorialized forwarding the letter and stated his bitter, poisonous intent.",
    "Baoyin forwarded the letter and declared his bitter resolve.",
  ],
  s0284: [
    "His will was set on wiping away shame; he repeatedly asked to dwell on the frontier.",
    "His heart was vengeance; he repeatedly asked the border.",
  ],
  s0285: [
    "In the Shengui era he was Area Commander and Inspector of Xuzhou and Grand General of the Cavalry.",
    "In Shengui he was Xuzhou commander and Grand General of Cavalry.",
  ],
  s0286: [
    "He then raised a school east of Qing, and on the first and fifteenth of the month summoned local gentry's sons, received them with kind face, and discussed the classics with them.",
    "He raised a school east of Qing and on the first and fifteenth summoned local sons to discuss the classics.",
  ],
  s0287: [
    "Diligent in hearing cases, clerks and people loved him.",
    "Diligent in judgment, clerks and people loved him.",
  ],
  s0288: [
    "In the second year of Zhengguang he was summoned as Left Vice Director of the Secretariat.",
    "Zhengguang year 2 he was summoned as Left Secretariat Vice Director.",
  ],
  s0289: [
    "Skilled in clerical duty, he had a great reputation.",
    "Skilled in office work, he won great fame.",
  ],
  s0290: ["In the fourth year he memorialized, saying:", "In year 4 he memorialized:"],
  s0291: [
    "I reflect that the names civil and martial stand at the utmost of men;",
    "I reflect that civil and martial names stand at men's utmost;"],
  s0292: [
    "the title of virtue and conduct is the foremost of life.",
    "virtue and conduct are life's foremost titles.",
  ],
  s0293: [
    "The beauty of loyalty and integrity is the praise of standing at court;",
    "Loyalty and integrity are praise at court;"],
  s0294: [
    "the name of benevolence and righteousness is the beginning of comporting oneself.",
    "benevolence and righteousness begin personal conduct.",
  ],
  s0295: [
    "Unless one's office is among the nine ministers and one's charge is the four mountains, with appointment saying \"you shall harmonize\" and yielding called \"we go,\" how can one bear the great name and fulfill this fine repute?",
    "Unless one holds the nine ministries or the four mountains' charge—with \"you shall harmonize\" in appointment and \"we go\" in yielding—how bear the great name and fulfill fine repute?",
  ],
  s0296: [
    "From recent times, office knows no high or low, man knows no noble or base—all adorn words with borrowed talk and use it to praise and lift one another.",
    "Lately, high or low, noble or base—all polish borrowed phrases to praise each other.",
  ],
  s0297: [
    "Those who ask cannot measure how much; those who give cannot verify right and wrong; thus cap and shoe are traded, name and reality both lost.",
    "Givers cannot verify truth; caps and shoes trade places; name and fact both fail.",
  ],
  s0298: [
    "Calling it examination of merit, the affair is like indiscriminate promotion—confused and boundless, how can it be told!",
    "Merit review becomes indiscriminate promotion—endless confusion, beyond telling!",
  ],
  s0299: [
    "Again, officials in the capital accumulate ten years of examinations.",
    "Again, capital officials pile ten years of reviews.",
  ],
  s0300: [
    "Among them, some have had masters they served shift three or four times;",
    "Some have served masters who shifted three or four times;"],
};

function loadTxt(path) {
  return fs
    .readFileSync(path, "utf8")
    .trim()
    .split("\n")
    .map((line) => {
      const i = line.indexOf("\t");
      return { id: line.slice(0, i) };
    });
}

function validate(arr, label) {
  let longIdent = 0;
  for (const { id, literal, idiomatic } of arr) {
    if (!literal?.trim() || !idiomatic?.trim()) throw new Error(`${label} ${id}: empty field`);
    if (literal.trim() === idiomatic.trim() && literal.length > 50) longIdent++;
  }
  return longIdent;
}

for (const [num, path, table] of [
  [1, "/tmp/beishi029-batch1.txt", T1],
  [2, "/tmp/beishi029-batch2.txt", T2],
  [3, "/tmp/beishi029-batch3.txt", T3],
]) {
  const rows = loadTxt(path);
  const arr = rows.map(({ id }) => {
    const pair = table[id];
    if (!pair) throw new Error(`Missing ${id} batch ${num}`);
    return { id, literal: pair[0], idiomatic: pair[1] };
  });
  const out = `/workspace/translations/patches/beishi-029-batch${num}.json`;
  fs.writeFileSync(out, JSON.stringify(arr, null, 2) + "\n");
  const longIdent = validate(arr, `batch${num}`);
  console.log(
    `${out}: ${arr[0].id} .. ${arr[arr.length - 1].id} (${arr.length}) long_identical=${longIdent}`
  );
  if (longIdent > 0) process.exitCode = 1;
}
