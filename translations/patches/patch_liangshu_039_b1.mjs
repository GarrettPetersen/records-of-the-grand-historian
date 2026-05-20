#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 39, Biography 33',
    'Book of Liang, Volume 39, Biography 33',
  ],
  s0002: [
    'Yuan Faseng; Yuan Shu; Yuan Yuanda; Wang Shenian; Yang Hua; Yang Kan; his son Kun; Yang Yaren',
    'Yuan Faseng; Yuan Shu; Yuan Yuanda; Wang Shenian; Yang Hua; Yang Kan; Kun; Yang Yaren',
  ],
  s0003: [
    'Yuan Faseng was a collateral branch of the Wei house.',
    'Yuan Faseng belonged to a cadet line of Northern Wei.',
  ],
  s0004: [
    'His founding ancestor was Emperor Daowu.',
    'His line traced back to Emperor Daowu.',
  ],
  s0005: [
    'His father was Zhongkui, Prince of Jiangyang.',
    'His father Zhongkui held the title Prince of Jiangyang.',
  ],
  s0006: [
    'Faseng served Wei, rose through Grand Master of Splendid Happiness, and later became Bearer of the Staff with Full Powers, Area Commander-in-Chief of All Military Affairs in Xuzhou, Inspector of Xuzhou, and garrisoned Pengcheng.',
    'In Wei service he reached Grand Master of Splendid Happiness, then held full staff authority as area commander of Xuzhou forces, inspector of Xuzhou, with his seat at Pengcheng.',
  ],
  s0007: [
    'In the fifth year of Putong the Wei house fell into great disorder; Faseng seized his garrison, declared himself emperor, executed and uprooted dissenters, enfeoffed his sons as kings, deployed generals and commanders, and intended to discuss restoring the dynasty.',
    'When Putong year 5 brought chaos to Wei, Faseng took his post, crowned himself, purged rivals, made his sons kings, and arrayed commanders for a campaign to restore the throne.',
  ],
  s0008: [
    'Before long the Wei disorder eased somewhat, and they were about to attack Faseng.',
    'As Wei’s turmoil subsided, the court turned to punish Faseng.',
  ],
  s0009: [
    'Faseng was afraid and sent envoys to submit in good faith, asking to become a vassal; Emperor Wu assented, appointing him Palace Attendant and Minister of Works, enfeoffing him as Duke of Shian commandery with a fief of five thousand households.',
    'Terrified, Faseng sent envoys to swear allegiance and ask for protected status. Emperor Wu agreed, made him Palace Attendant and Minister of Works, and created him Duke of Shian with five thousand households.',
  ],
  s0010: [
    'When Wei armies had already pressed close, Faseng asked to return to court; Emperor Wu dispatched Zhu Yi, Gentleman Attendant of the Secretariat for Drafting, to welcome him.',
    'As Wei troops closed in, Faseng begged to come south; the emperor sent Zhu Yi of the Secretariat to receive him.',
  ],
  s0011: [
    'Once he arrived, he was greatly favored and indulged.',
    'On arrival he was showered with honors.',
  ],
  s0012: [
    'At the time they were actively recruiting and reassuring defectors; he was granted mansions, female musicians, gold and silk—countless gifts before and after.',
    'The court was wooing turncoats, and Faseng received mansions, musicians, gold, and silk beyond counting.',
  ],
  s0013: [
    'Because during his Wei days Faseng had long held frontier duties and in every raid had killed many, he requested troops for self-protection; an edict granted him a hundred sets of armor and weapons, with leave to enter and leave the inner palace gates.',
    'Years on the border in Wei service had left him with many enemies from raiding; he asked for a guard, and the throne gave him a hundred armored men and access to the inner palace.',
  ],
  s0014: [
    'In the second year of Datong he was promoted to General of the Champion.',
    'In Datong year 2 he was made General of the Champion.',
  ],
  s0015: [
    'In the first year of Zhongdatong he was transferred to General of Chariots and Cavalry.',
    'Zhongdatong year 1 brought promotion to General of Chariots and Cavalry.',
  ],
  s0016: [
    'In the fourth year he advanced to Grand Commandant and concurrently held Grand Master of Splendid Happiness with the Golden Ornament.',
    'Four years later he rose to Grand Commandant, bearing the golden seal of Grand Master of Splendid Happiness.',
  ],
  s0017: [
    'That year he was installed as ruler of Eastern Wei but did not take it up; still he received Bearer of the Staff, Regular Attendant-in-Ordinary, General-in-Chief of Agile Cavalry, privileges equal to the Three Dukes with an open office, and the post of Inspector of Yingzhou.',
    'The same year he was named sovereign of Eastern Wei—a title he never exercised—yet kept staff authority, Regular Attendant, General-in-Chief of Agile Cavalry, Three-Duke ceremonial rank with an open office, and the Yingzhou inspectorate.',
  ],
  s0018: [
    'In the second year of Datong he was summoned as Palace Attendant and Grand Commandant, concurrently Army Instructor General; he died at the age of eighty-three.',
    'Datong year 2 recalled him as Palace Attendant and Grand Commandant with the Army Instructor generalship; he died at eighty-three.',
  ],
  s0019: [
    'He had two sons, Jinglong and Jingzhong, who in Putong accompanied Faseng to court.',
    'His sons Jinglong and Jingzhong followed him to Liang during Putong.',
  ],
  s0020: [
    'Jinglong was enfeoffed Duke of Dunyang county with a fief of one thousand households and sent out as Bearer of the Staff, Area Commander-in-Chief of All Military Affairs in the thirteen provinces of Guang, Yue, Jiao, Gui, and others, General Who Pacifies the South, Inspector General Who Pacifies Yue, and Inspector of Guangzhou.',
    'Jinglong became Duke of Dunyang with a thousand-household fief, then went south as staff-bearing commander over thirteen provinces, General Who Pacifies the South, Pacifier of Yue, and inspector of Guangzhou.',
  ],
  s0021: [
    'In the third year of Zhongdatong he was summoned as Palace Attendant and General Who Guards the Right.',
    'Zhongdatong year 3 brought him back as Palace Attendant and General Who Guards the Right.',
  ],
  s0022: [
    'In the fourth year he became General Who Campaigns North and Inspector of Xuzhou and was enfeoffed Prince of Pengcheng, but did not take up the post; soon after he was relieved as Palace Attendant and Minister of Revenue.',
    'Year 4 made him General Who Campaigns North and Xuzhou inspector and Prince of Pengcheng, though he never went; shortly he was Palace Attendant and Minister of Revenue instead.',
  ],
  s0023: [
    'At the opening of Taiqing he again became Bearer of the Staff, Area Commander-in-Chief of All Military Affairs in the thirteen provinces of Guang, Yue, Jiao, Gui, and others, General Who Campaigns South, Inspector General Who Pacifies Yue, and Inspector of Guangzhou; he reached Leishou, fell ill, and died at the age of fifty-eight.',
    'Early in Taiqing he returned to Guangzhou with the same vast command, reached Leishou, sickened, and died at fifty-eight.',
  ],
  s0024: [
    'Jingzhong was enfeoffed Duke of Zhijiang county with a fief of one thousand households and appointed Palace Attendant and General of the Right Guard.',
    'Jingzhong received Zhijiang duke with a thousand households and posts as Palace Attendant and General of the Right Guard.',
  ],
  s0025: [
    'In the third year of Datong his enfeoffment was increased, bringing the total to two thousand households, and he was also granted a troupe of female musicians.',
    'Datong year 3 enlarged his fief to two thousand households and gave him a company of palace musicians.',
  ],
  s0026: [
    'He was sent out as Bearer of the Staff, Area Commander-in-Chief of All Military Affairs in Guang, Yue, and the other provinces, General Who Proclaims Grace, Inspector General Who Pacifies Yue, and Inspector of Guangzhou.',
    'He then took staff authority over Guang and Yue as General Who Proclaims Grace, Pacifier of Yue, and Guangzhou inspector.',
  ],
  s0027: [
    'In Datong he was summoned as Palace Attendant and General of the Left Guard.',
    'During Datong he was recalled as Palace Attendant and General of the Left Guard.',
  ],
  s0028: [
    'His elder brother Jinglong later became Inspector of Guangzhou.',
    'His brother Jinglong had already served as Guangzhou inspector.',
  ],
  s0029: [
    'When Hou Jing rebelled, because Jingzhong was of the Yuan clan, Jing sent envoys to entice him, promising to set him up as sovereign.',
    'Hou Jing’s revolt led him to court Yuan Jingzhong as a puppet emperor, sending envoys with that pledge.',
  ],
  s0030: [
    'Jingzhong thereupon raised troops, intending to march down and join Jing.',
    'Jingzhong mobilized to link arms with Hou Jing from the south.',
  ],
  s0031: [
    'Just then Chen Baxian, Supervisor of the West River, and Wang Huaiming, Inspector of Chengzhou, among others, raised forces to attack him; Baxian proclaimed to the troops: “The court holds that Yuan Jingzhong has marched with the bandits and plots against the altars of state; it now sends Bo, Duke of Qujiang, as inspector to pacify this province.”',
    'Chen Baxian of the West River commandery and Chengzhou inspector Wang Huaiming rose against him. Baxian told the soldiers, “The throne judges Yuan Jingzhong in league with Hou Jing and a danger to the realm. Duke Bo of Qujiang is coming as your new inspector.”',
  ],
  s0032: [
    'When the crowd heard this, all cast off armor and scattered; Jingzhong then hanged himself.',
    'At the news his army melted away; Jingzhong strangled himself.',
  ],
  s0033: [
    'Yuan Shu, courtesy name Junli, was likewise a close kinsman of Wei.',
    'Yuan Shu, styled Junli, was another near kinsman of the Wei imperial house.',
  ],
  s0034: [
    'His grandfather was Emperor Xianwen.',
    'His grandfather was Emperor Xianwen.',
  ],
  s0035: [
    'His father Xi was Prince of Xianyang.',
    'His father Xi held the title Prince of Xianyang.',
  ],
  s0036: [
    'Shu served Wei as Director of the Imperial Clan; when Erzhu Rong’s turmoil broke out, he came over in the eighth year of Tianjian, was enfeoffed Prince of Ye with a fief of two thousand households, and appointed Regular Attendant-in-Ordinary.',
    'In Wei he was Director of the Imperial Clan; after Erzhu Rong’s upheaval he defected in Tianjian year 8, was made Prince of Ye with two thousand households, and became Regular Attendant.',
  ],
  s0037: [
    'In the sixth year of Putong he went out to meet Yuan Faseng on his return to court, was transferred to Bearer of the Staff, Area Commander-in-Chief of All Military Affairs in Ying, Si, and Huo, General of Cloudlike Pennants, and Inspector of Yingzhou, and his enfeoffment was increased to three thousand households in all.',
    'Putong year 6 saw him escort Faseng home, then take staff command over Ying, Si, and Huo as General of Cloudlike Pennants and Yingzhou inspector, with his fief raised to three thousand households.',
  ],
  s0038: [
    'He campaigned against southern barbarian bandits, pacified them, was promoted to Regular Attendant-in-Ordinary and General Who Pacifies the West, and his fief was again increased by five hundred households.',
    'A campaign against southern rebels succeeded; he gained Regular Attendant, General Who Pacifies the West, and five hundred more households.',
  ],
  s0039: [
    'In the second year of Zhongdatong he was summoned as Palace Attendant and General Who Guards the Right.',
    'Zhongdatong year 2 recalled him as Palace Attendant and General Who Guards the Right.',
  ],
  s0040: [
    'In the fourth year he became Bearer of the Staff, General Who Guards the North, Area Commander-in-Chief of All Northern Campaign Military Affairs, was granted a suite of war drums, and campaigned against Wei; he attacked the Wei city of Qiao and took it.',
    'Year 4 gave him staff authority as General Who Guards the North and commander of the northern expedition, with war drums and orders against Wei; he stormed and seized Qiao.',
  ],
  s0041: [
    'The Wei general Dugu Ruyuan came to the rescue, then besieged Shu; the city fell and he was captured; he died of grief in Wei at the age of forty-eight.',
    'Dugu Ruyuan relieved the city, then trapped Shu until it fell. Captured in Wei, he died of humiliation at forty-eight.',
  ],
  s0042: [
    'His son Zhen, in Datong, asked to follow the Wei envoy Cui Changqian to Ye to bury his father, then returned and was appointed Attendant of the Heir Apparent.',
    'His son Zhen, in Datong, traveled north with envoy Cui Changqian to bury his father at Ye, came back, and became Attendant of the Heir Apparent.',
  ],
  s0043: [
    'At the opening of Taiqing, when Hou Jing surrendered, he asked for a Yuan kinsman to set up as sovereign; an edict enfeoffed Zhen Prince of Xianyang and sent him north with imperial ceremony, but Jing was defeated before he could go and he returned.',
    'Early Taiqing brought Hou Jing’s offer to crown a Yuan prince; Zhen was made Prince of Xianyang and sent north in state, but Hou Jing’s fall sent him home again.',
  ],
  s0044: [
    'Yuan Yuanda was likewise a collateral of Wei.',
    'Yuan Yuanda, too, came from a Wei cadet branch.',
  ],
  s0045: [
    'His grandfather was Emperor Mingyuan.',
    'His grandfather was Emperor Mingyuan.',
  ],
  s0046: [
    'His father was Prince of Leping.',
    'His father held the title Prince of Leping.',
  ],
  s0047: [
    'Yuanda served Wei as Director of the Secretariat and Inspector of Yingzhou.',
    'In Wei he was Director of the Secretariat and inspector of Yingzhou.',
  ],
  s0048: [
    'In Putong, during the great northern campaign against Yiyang, Yuanda surrendered the whole province; an edict enfeoffed him Duke of Leping with a fief of one thousand households and granted him a mansion and female musicians.',
    'During Putong’s northern offensive on Yiyang he handed over his province; the court made him Duke of Leping with a thousand households, a mansion, and musicians.',
  ],
  s0049: [
    'He was then sent out as Bearer of the Staff, Regular Attendant-in-Ordinary, Area Commander-in-Chief of All Military Affairs in Xiangzhou, General Who Pacifies the South, and Inspector of Xiangzhou.',
    'He next went to Xiangzhou with staff authority, Regular Attendant, General Who Pacifies the South, and the inspector’s seal.',
  ],
  s0050: [
    'In the second year of Zhongdatong he was summoned as Palace Attendant, Grand Master for All, and General Who Assists the Left.',
    'Zhongdatong year 2 brought him back as Palace Attendant, Grand Master for All, and General Who Assists the Left.',
  ],
  s0051: [
    'In the third year of Datong he died at the age of fifty-seven.',
    'He died in Datong year 3 at fifty-seven.',
  ],
  s0052: [
    'Wang Shenian was a native of Qi in Taiyuan.',
    'Wang Shenian came from Qi in Taiyuan commandery.',
  ],
  s0053: [
    'In youth he loved Confucian learning and was especially versed in Buddhist scriptures.',
    'As a youth he studied Confucian texts and delved deep into Buddhist sutras.',
  ],
  s0054: [
    'He began his career in Wei as a commandery secretariat aide, rose to Inspector of Yingchuan, and then held the commandery and submitted in allegiance.',
    'He entered Wei service as a prefectural aide, became Yingchuan inspector, then surrendered the commandery to Liang.',
  ],
  s0055: [
    'When Wei armies arrived, he crossed the river with his household and was enfeoffed Marquis of Nancheng county with a fief of five hundred households.',
    'Wei troops forced him across the Yangzi with his family; Liang enfeoffed him Marquis of Nancheng with five hundred households.',
  ],
  s0056: [
    'Soon after he was made Administrator of Ancheng and then served as Administrator of Wuyang and Xuancheng, in each post leaving a record of good governance.',
    'He governed Ancheng, then Wuyang and Xuancheng, earning a name for effective rule in each.',
  ],
  s0057: [
    'On return he was made Director of the Imperial Stud.',
    'Recalled to court, he became Director of the Imperial Stud.',
  ],
  s0058: [
    'He was sent out as Bearer of the Staff, Area Commander-in-Chief of All Military Affairs in Qing and Ji, General of Trustworthy Martiality, and Inspector of Qing and Ji.',
    'He then took Qing and Ji as staff-bearing area commander, General of Trustworthy Martiality, and dual inspector.',
  ],
  s0059: [
    'Shenian was upright and stern by nature; in every province or commandery he held, he forbade licentious shrines.',
    'Stern and upright, he banned improper cults wherever he served.',
  ],
  s0060: [
    'At that time in the northeast of Qing and Ji provinces there was a Stone Deer Mountain facing the sea, with a shrine of old; shamans deceived the people, and prayers came from far and near, wasting wealth beyond measure.',
    'On the coast northeast of Qing and Ji stood Stone Deer Mountain, long home to a spirit shrine where shamans bled the people dry with endless offerings.',
  ],
  s0061: [
    'When Shenian arrived, he ordered it destroyed and demolished, and local custom was thereby changed.',
    'Shenian had the shrine torn down, and the custom died with it.',
  ],
  s0062: [
    'In Putong, during the great northern campaign, he was summoned as General of the Right Guard.',
    'Putong’s great northern expedition recalled him as General of the Right Guard.',
  ],
  s0063: [
    'In the sixth year he was transferred to Bearer of the Staff, Regular Attendant-in-Ordinary, and General of the Talons, while retaining the Right Guard.',
    'Year 6 added staff authority, Regular Attendant, and General of the Talons while he kept the Right Guard.',
  ],
  s0064: [
    'He fell ill and died at the age of seventy-five.',
    'Illness took him at seventy-five.',
  ],
  s0065: [
    'An edict posthumously granted his former office and the post of Inspector of Hengzhou, with a suite of war drums added.',
    'The throne honored him with his last ranks plus Hengzhou inspector and a war-drum suite.',
  ],
  s0066: [
    'His posthumous title was Zhuang.',
    'His posthumous name was Zhuang (“Stalwart”).',
  ],
  s0067: [
    'Shenian had been skilled in mounted archery from youth; even in old age he did not decline, and once before Emperor Wu he grasped two sabers and shields in his hands, crossing them left and right as he charged back and forth on horseback, surpassing the whole company.',
    'A superb horse-archer even in old age, he once rode before Emperor Wu wielding twin sabers and shields, weaving them left and right at full gallop until none in the host could match him.',
  ],
  s0068: [
    'At the time there was also Yang Hua, who could perform startling cavalry maneuvers; both were marvels of agility for their age, and Emperor Wu deeply admired them.',
    'Yang Hua, who could startle an army with his horsemanship, shared the spotlight; the emperor delighted in both men.',
  ],
  s0069: [
    'His son Zunye rose to Director of the Imperial Stud.',
    'His son Zunye reached Director of the Imperial Stud.',
  ],
  s0070: [
    'On death he was posthumously granted General of Trustworthy Prestige and Inspector of Qing and Ji, with a suite of war drums.',
    'After his death he received General of Trustworthy Prestige, the Qing-Ji inspectorate, and war drums.',
  ],
  s0071: [
    'The second son, Sengbian, has a separate biography.',
    'His second son Sengbian is treated in another chapter.',
  ],
  s0072: [
    'Yang Hua was a native of Chouchi in Wudu.',
    'Yang Hua came from Chouchi in Wudu.',
  ],
  s0073: [
    'His father Dayan was a famed general of Wei.',
    'His father Yang Dayan was one of Wei’s great commanders.',
  ],
  s0074: [
    'Hua in youth had courage and strength, a heroic bearing; Empress Dowager Hu of Wei forced him into intimacy; Hua, fearing disaster, led his personal troops to surrender.',
    'Young, strong, and striking in looks, he fled Wei after Empress Dowager Hu forced herself on him, bringing his household guard south.',
  ],
  s0075: [
    'The Empress Dowager could not stop longing for him and composed the song lyrics “Yang Baihua,” ordering palace women day and night to link arms, stamp their feet, and sing it—the words were exceedingly mournful.',
    'Hu could not forget him and wrote the “Yang Baihua” lyrics, set palace women to sing them ceaselessly, hand in hand, stamping the measure—the song was heartbreakingly sad.',
  ],
  s0076: [
    'Hua later took part repeatedly in campaigns and won merit, rising through Director of the Imperial Stud and Left Commandant of the Heir Apparent’s Guard, and was enfeoffed Marquis of Yiyang county.',
    'He fought in many campaigns, became Director of the Imperial Stud and Left Commandant of the Heir Apparent’s Guard, and was made Marquis of Yiyang.',
  ],
  s0077: [
    'In Taiqing, when Hou Jing rebelled, Hua wished to hold to integrity, but his wife and children were seized by the bandits, so he surrendered and died among them.',
    'Taiqing’s Hou Jing rebellion found him wanting to stand firm until bandits seized his family; he submitted and died in their camp.',
  ],
  s0078: [
    'Yang Kan, courtesy name Zuxin, was a native of Liangfu in Taishan, a descendant of Yang Xu, Grand Administrator of Nanyang in Han.',
    'Yang Kan, styled Zuxin, of Liangfu in Taishan, traced his line to Han’s Yang Xu, grand administrator of Nanyang.',
  ],
  s0079: [
    'His grandfather Gui, when Emperor Wu of Song was provisional inspector of Xuzhou, was summoned as Libationer and Attendant for All in the staff.',
    'His grandfather Gui served Song’s Emperor Wu when the latter was provisional Xuzhou inspector, joining his staff as libationer and Attendant for All.',
  ],
  s0080: [
    'When Xue Andu raised Pengcheng and went over to the north, Gui was thereby trapped in Wei; Wei appointed him General of the Guard and Inspector of Yingzhou.',
    'Xue Andu’s surrender of Pengcheng to Northern Wei left Gui on the wrong side of the line; Wei made him General of the Guard and Yingzhou inspector.',
  ],
  s0081: [
    'His father Zhi was Palace Attendant and Grand Master of Splendid Happiness with the Golden Ornament in Wei.',
    'His father Zhi held Wei’s Palace Attendant and golden Grand Master of Splendid Happiness.',
  ],
  s0082: [
    'Kan from youth was magnificent in bearing, seven feet eight inches in height, fond of letters by nature, broadly versed in records and documents, and especially loved the Zuo Commentary to the Spring and Autumn and the Art of War of Sun and Wu.',
    'Even young he was imposing—seven feet eight inches tall—loved literature, read widely, and favored the Zuo Commentary and the military classics of Sun and Wu.',
  ],
  s0083: [
    'At twenty he followed his father in Liangzhou and won merit.',
    'At twenty he campaigned with his father in Liangzhou and earned distinction.',
  ],
  s0084: [
    'In Zhengguang of Wei he gradually became a separate commander.',
    'Under Wei’s Zhengguang era he rose to independent command.',
  ],
  s0085: [
    'At that time among the Qiang of Qinzhou, Mo Zhaoniansheng held the province in revolt, declared himself emperor, and still sent his younger brother Tiansheng at the head of the host to take Qi Province and then raid Yong Province.',
    'Qinzhou’s Qiang leader Mo Zhaoniansheng rebelled, crowned himself, and sent his brother Tiansheng to seize Qi Province and raid Yong.',
  ],
  s0086: [
    'Kan was a subordinate general under Xiao Baoyin on the punitive expedition; he went in secret along the line of battle, watched for a shot at Tiansheng, and when the arrow flew Tiansheng fell at once and the host collapsed.',
    'Serving under Xiao Baoyin, Kan stole along the front, drew on Tiansheng, and dropped him with one arrow; the rebels broke.',
  ],
  s0087: [
    'For merit he was transferred to Bearer of the Staff, General Who Campaigns East, Eastern Expedition Commissioner, concurrent Grand Administrator of Taishan, and advanced in rank to Marquis of Juping.',
    'The victory won him staff authority, General Who Campaigns East, eastern commissioner, Taishan administrator, and the marquisate of Juping.',
  ],
  s0088: [
    'Earlier his father had often wished to return south and would regularly tell his sons: “How can a man long linger in a foreign land? You should go home and serve the Eastern Court.”',
    'His father had long dreamed of the south and told his sons, “No one should die a stranger—go back and serve the Liang.”',
  ],
  s0089: [
    'Kan now intended to raise the Yellow and Ji rivers to fulfill that earlier wish.',
    'Kan now meant to stir the Yellow and Ji region to honor that vow.',
  ],
  s0090: [
    'Yang Dun, Inspector of Yanzhou, was Kan’s paternal cousin; he learned of it in secret and held the province to resist Kan.',
    'His cousin Yang Dun, Yanzhou inspector, got wind of the plot and barred the province against him.',
  ],
  s0091: [
    'Kan then led thirty thousand picked troops to strike him, could not overcome him, and still built more than ten walled camps to hold him.',
    'Kan hit him with thirty thousand elite troops, failed to take him, and ringed the land with a dozen fortified camps.',
  ],
  s0092: [
    'The court’s rewards and appointments were the same as for Yuan Faseng.',
    'Liang treated him with the same honors it had given Yuan Faseng.',
  ],
  s0093: [
    'Yang Yaren and Wang Bian led armies to support him; Li Yuanlü transported grain and weapons.',
    'Yang Yaren and Wang Bian marched to his aid while Li Yuanlü ran supplies.',
  ],
  s0094: [
    'When the Wei emperor heard of it, he sent orders appointing Kan General-in-Chief of Agile Cavalry, Minister of Works, Duke of Taishan commandery, and long-term Inspector of Yanzhou; Kan beheaded the envoy and displayed the head.',
    'Wei tried to buy him with General-in-Chief of Agile Cavalry, Minister of Works, Duke of Taishan, and permanent Yanzhou inspector; Kan killed the envoy and exposed the head.',
  ],
  s0095: [
    'The Wei were greatly alarmed and sent Vice Director of the Secretariat Yu Hui at the head of several hundred thousand men, while Gao Huan, Erzhu Yangdu, and others came in succession, surrounding Kan in more than a dozen rings and inflicting heavy casualties.',
    'Wei sent Yu Hui with hundreds of thousands, then Gao Huan and Erzhu Yangdu in waves, wrapping Kan in layer after layer of siege and slaughter.',
  ],
  s0096: [
    'Arrows in the stockade ran out and the southern armies did not advance; he then broke out by night, fighting as he went, and only after a day and a night did he leave Wei territory.',
    'When arrows failed and southern relief stalled, he burst out at night, fighting nonstop for a day and a night before he crossed the border.',
  ],
  s0097: [
    'At Zhakou he still had more than ten thousand men and two thousand horses; about to enter the south, the soldiers all sang laments through the night.',
    'At Zhakou ten thousand men and two thousand horses remained; on the eve of crossing south, his troops keened through the night.',
  ],
  s0098: [
    'Kan then said in farewell: “You cherish your homeland and cannot rightly follow me; go or stay as you please—here we part.”',
    'Kan told them, “You long for home and need not follow me—stay or go; this is where we divide.”',
  ],
  s0099: [
    'Thereupon each bowed in leave and departed.',
    'Each man bowed farewell and went his way.',
  ],
  s0100: [
    'Kan reached the capital in the third year of Datong; an edict appointed him Bearer of the Staff, Regular Attendant-in-Ordinary, Area Commander-in-Chief of All Military Affairs for the Xiqiu Campaign, General Who Pacifies the North, and Inspector of Xuzhou, and his elder brother Mo and three younger brothers Chen, Ji, and Yuan were all appointed inspectors.',
    'He entered the capital in Datong year 3 with staff authority, Regular Attendant, Xiqiu campaign commander, General Who Pacifies the North, and Xuzhou inspector—and his brother Mo and brothers Chen, Ji, and Yuan were all made inspectors too.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_039_b1.mjs <translation.json>'
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
