#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'Soon Jing reached the Zhuque floating bridge; Xiao Zhengde had earlier garrisoned Danyang commandery—now he led his troops to join Jing.',
    'Soon Jing reached the Zhuque Bridge. Xiao Zhengde had been garrisoned at Danyang; now he marched out with his men to join him.',
  ],
  s0202: [
    'Jiankang magistrate Yu Xin led over a thousand troops to garrison north of the bridge; when he saw Jing reach the bridge he ordered it dismantled; after removing only one vessel he abandoned his army and fled to Nantang; roaming patrol units again closed the bridge and let Jing cross.',
    'Jiankang magistrate Yu Xin held the north bank with a thousand-odd troops. Seeing Jing at the bridge, he ordered it broken—but only one boat was cleared before he fled to Nantang with his force abandoned. Patrol units then reclosed the bridge and let Jing cross.',
  ],
  s0203: [
    'The crown prince gave his own mount to Wang Zhi and assigned three thousand elite troops to aid Yu Xin.',
    'The crown prince gave Wang Zhi his own horse and three thousand picked troops to relieve Yu Xin.',
  ],
  s0204: [
    'Zhi reached the Commandant-in-Chief\'s office, met the rebels, and fled before forming ranks; Jing pressed his victory to the palace gates.',
    'Zhi reached the commandant\'s headquarters, met the rebels, and broke before he could form ranks. Jing rode the momentum to the palace gates.',
  ],
  s0205: [
    'Western Feng duke Dachun abandoned Stone Fort city and fled; Jing sent his Yitong Yu Ziyue to hold it.',
    'Western Feng duke Dachun abandoned Stone Fort and fled. Jing sent his Yitong Yu Ziyue to occupy it.',
  ],
  s0206: [
    'Xie Xi also abandoned Baixia city and fled.',
    'Xie Xi likewise abandoned Baixia and fled.',
  ],
  s0207: [
    'Jing then assaulted the city from a hundred directions, bearing torches to burn the Grand Marshal Gate and the East and West Flower gates.',
    'Jing assaulted from every direction, torches in hand, setting fire to the Grand Marshal Gate and the East and West Flower gates.',
  ],
  s0208: [
    'Inside the city, caught unprepared, they hacked through the gate tower, poured water to douse the fire—it was long before it went out.',
    'The city was caught flat-footed. They hacked through the gate tower and poured water on the flames; only after a long while did the fire die.',
  ],
  s0209: [
    'The rebels again hacked at the East Side Gate about to open; Yang Kan hacked through the gate panels and killed several men—the rebels withdrew.',
    'The rebels hacked at the East Side Gate as it was about to open. Yang Kan smashed the gate panels and killed several men, and the rebels fell back.',
  ],
  s0210: [
    'They also climbed the Eastern Palace wall and shot into the city; at night Taizong recruited men to go out and burn the Eastern Palace—the Eastern Palace halls and pavilions were utterly destroyed.',
    'They scaled the Eastern Palace wall and shot into the city. That night Taizong raised volunteers to burn the Eastern Palace; its halls and towers were consumed entirely.',
  ],
  s0211: [
    'Jing also burned the west city\'s horse stables, Scholars Grove Hall, and the Grand Treasury.',
    'Jing also burned the western horse stables, Scholars Grove Hall, and the Grand Treasury.',
  ],
  s0212: [
    'The next day Jing built several hundred wooden siege tortoises to attack the city; from the walls catapult stones were hurled—whatever they struck was shattered.',
    'The next day Jing built hundreds of wooden siege tortoises. Stones flew from the walls; whatever they hit shattered.',
  ],
  s0213: [
    'Jing, unable to take the city despite bitter assault and heavy casualties, halted the attack and built a long encirclement to cut off inside from out; he petitioned for the execution of Central Commandant Zhu Yi, Crown Prince\'s Right Guard leader Lu Yan, concurrent Minister of the Palace Treasury Xu Lin, Office of Manufacture Supervisor Zhou Shizhen, and others.',
    'Unable to break the city despite heavy losses, Jing stopped the assault and built a long encirclement to seal inside from out. He petitioned for the heads of Central Commandant Zhu Yi, Crown Prince Right Guard leader Lu Yan, concurrent Palace Treasury minister Xu Lin, Manufacture Supervisor Zhou Shizhen, and others.',
  ],
  s0214: [
    'Inside the city they also shot out reward placards: "Whoever can cut off Jing\'s head shall receive Jing\'s rank, plus a hundred million cash, ten thousand bolts each of cloth and silk, and two ensembles of female musicians."',
    'The city shot out reward placards: "Whoever brings Jing\'s head gets his rank, a hundred million cash, ten thousand bolts of cloth and silk each, and two troupes of female musicians."',
  ],
  s0215: [
    'In the eleventh month Jing installed Xiao Zhengde as emperor, who immediately took the false throne at the Hall of Virtuous Worthies and changed the era name to Zhengping.',
    'In the eleventh month Jing set up Xiao Zhengde as emperor. Zhengde took the false throne at the Hall of Virtuous Worthies and changed the era to Zhengping.',
  ],
  s0216: [
    'Earlier a children\'s rhyme had spoken of "Zhengping"—so he took that era name to match it.',
    'A children\'s rhyme had already spoken of "Zhengping," so he chose that name to answer the omen.',
  ],
  s0217: [
    'Jing made himself Chancellor of State and Pillar of Heaven General; Zhengde gave him his daughter in marriage.',
    'Jing made himself chancellor and Pillar of Heaven General. Zhengde gave him his daughter in marriage.',
  ],
  s0218: [
    'Jing again attacked the Eastern Palace city, setting up hundred-foot tower wagons; hooks pulled down all the battlements—the city fell.',
    'Jing attacked the Eastern Palace city again with hundred-foot tower wagons. Hooks tore down the battlements, and the city fell.',
  ],
  s0219: [
    'Jing had his Yitong Lu Huilue lead several thousand men, long knives at the city gates on both sides, driving all civil and military officials inside the city out naked; the rebels crossed weapons and killed them—over two thousand dead.',
    'Jing sent Yitong Lu Huilue with several thousand men, long knives flanking the gates, driving every official inside out stripped bare. The rebels cut them down—more than two thousand dead.',
  ],
  s0220: [
    'Marquis Tui of Nanpu was killed that day.',
    'Marquis Tui of Nanpu died that day.',
  ],
  s0221: [
    'Jing had Zhengde\'s son Jianli and Yitong Lu Huilue guard the Eastern Palace city.',
    'Jing put Zhengde\'s son Jianli and Yitong Lu Huilue in charge of the Eastern Palace city.',
  ],
  s0222: [
    'Jing also raised an earthen mound on east and west of the city to overlook the interior; inside the city two mounds were built in response—princes and officials down all carried earth.',
    'Jing raised earthen mounds east and west to overlook the city. Inside, two counter-mounds went up; princes and officials down to the lowest ranks all carried earth.',
  ],
  s0223: [
    'At first when Jing arrived he expected swiftly to pacify the capital; his orders were very clear and he did not harm the common people.',
    'When Jing first arrived he expected a quick capture of the capital. His orders were strict, and he did not molest the people.',
  ],
  s0224: [
    'Once the city could not be taken, hearts turned away and resistance grew; fearing relief armies would gather and his force would scatter, he unleashed his troops to kill and plunder—corpses blocked the roads; wealthy and powerful households were stripped at will; sons and daughters, wives and concubines—all entered the military camps.',
    'When the city would not fall, morale cracked and fear spread. Afraid relief armies would mass and his host dissolve, he let his troops kill and loot. Corpses choked the roads; rich houses were stripped bare; sons, daughters, wives, and concubines—all were taken into camp.',
  ],
  s0225: [
    'When building the earthen mounds, without distinction of noble or base, day and night without cease, they beat people at random; the weak and exhausted were killed to fill the mounds—the sound of wailing shook heaven and earth.',
    'To build the mounds, noble and common alike were driven day and night without rest, beaten at random. The weak were killed to fill the earthworks. Wailing shook heaven and earth.',
  ],
  s0226: [
    'The common people dared not hide; all came out to follow him; within ten days or so his force reached tens of thousands.',
    'The people dared not hide and turned out to serve him. Within ten days his numbers swelled to tens of thousands.',
  ],
  s0227: [
    'Jing\'s Yitong Fan Taobang secretly sent envoys offering surrender and begging to defect—when the matter leaked out he was killed.',
    'Jing\'s Yitong Fan Taobang secretly sent envoys to offer surrender. The plot leaked, and he was executed.',
  ],
  s0228: [
    'At this time Prince of Shaoling Lun led Western Feng duke Dachun, New Tu general Marquis Que of Yong\'an, Super-Martial general Marquis Jun of Nanxiang, former Qiao province inspector Zhao Bochao, Wu province inspector Xiao Nongzhang, Colonel of Footsoldiers Yin Sihe, and others—thirty thousand horse and foot setting out from Jingkou, directly taking Zhong Mountain.',
    'Then Prince of Shaoling Lun led Western Feng duke Dachun, New Tu general Marquis Que of Yong\'an, Super-Martial general Marquis Jun of Nanxiang, former Qiao inspector Zhao Bochao, Wu inspector Xiao Nongzhang, Colonel of Footsoldiers Yin Sihe, and others—thirty thousand horse and foot from Jingkou, seizing Zhong Mountain outright.',
  ],
  s0229: [
    'Jing\'s faction was greatly terrified; all who had boats wanted to flee and scatter; he dispatched over ten thousand men to block Lun; Lun struck and routed them, cutting off over a thousand heads.',
    'Jing\'s men were terrified. Everyone with a boat wanted to flee. He sent ten thousand-odd men to stop Lun, but Lun routed them and took more than a thousand heads.',
  ],
  s0230: [
    'At dawn Jing again deployed troops north of Fuzhou Mountain; Lun also drew up ranks to await him.',
    'At dawn Jing formed ranks north of Fuzhou Mountain. Lun lined up to meet him.',
  ],
  s0231: [
    'Jing did not advance—they faced off.',
    'Jing did not advance. The two armies stood facing each other.',
  ],
  s0232: [
    'At dusk Jing withdrew his army; Marquis Jun of Nan\'an led several dozen horsemen to provoke him; Jing turned his army to fight—Jun retreated.',
    'At dusk Jing pulled back. Marquis Jun of Nan\'an rode out with several dozen men to taunt him. Jing turned and fought; Jun withdrew.',
  ],
  s0233: [
    'At the time Zhao Bochao was deployed north of Xuanwu Lake; seeing Jun in distress he did not go to help but instead led his army forward in flight—the army fell into disorder and was defeated.',
    'Zhao Bochao was posted north of Xuanwu Lake. Seeing Jun in trouble, he did not go to his aid but fled forward with his own force. The army broke ranks and was routed.',
  ],
  s0234: [
    'Lun fled to Jingkou.',
    'Lun fled back to Jingkou.',
  ],
  s0235: [
    'The rebels captured all baggage, armor, and weapons, cut off several hundred heads, took over a thousand alive; they seized Western Feng duke Dachun, Lun\'s staff officer Zhuangqiu Huida, Direct Gate general Hu Ziyue, Guangling magistrate Huo Jun, and others; they were brought to the city wall and paraded; forced to say "The Prince of Shaoling has been captured," Jun alone said "My lord suffered a small setback and has returned with his full army to Jingkou—hold firm inside the city, relief will soon arrive."',
    'The rebels took all baggage, armor, and arms, killed several hundred, and captured more than a thousand alive—including Western Feng duke Dachun, Lun\'s staff officer Zhuangqiu Huida, Direct Gate general Hu Ziyue, and Guangling magistrate Huo Jun. They were paraded beneath the wall and forced to cry that the Prince of Shaoling had been taken. Only Huo Jun said, "My lord met a small reverse and has returned whole to Jingkou. Hold the city—relief is near."',
  ],
  s0236: [
    'The rebels beat him with swords; Jun\'s words and countenance remained as before; Jing admired his integrity and released him.',
    'They beat him with blades, but Jun\'s words and face never changed. Jing admired his courage and let him go.',
  ],
  s0237: [
    'That day the Prince of Poyang\'s heir Si and Pei Zhigao reached Later Islet and encamped at Cai Isle.',
    'That day the Prince of Poyang\'s heir Si and Pei Zhigao reached Later Islet and camped on Cai Isle.',
  ],
  s0238: [
    'Jing divided his army to garrison the south bank.',
    'Jing split his force to hold the south bank.',
  ],
  s0239: [
    'In the twelfth month Jing built all manner of siege engines—flying towers, ram wagons, scaling wagons, battlement-scaling wagons, ramp wagons, fire wagons—all several zhang high, some wagons with twenty wheels; arrayed before the palace gates, they were all used together in the hundred-direction assault.',
    'In the twelfth month Jing built every sort of siege engine—flying towers, rams, scaling wagons, battlement climbers, ramp carts, fire carts—each several zhang tall, some with twenty wheels. They stood before the palace gates and were all deployed in the hundred-direction assault.',
  ],
  s0240: [
    'Using fire wagons they burned the great tower at the southeast corner of the city; the rebels used the blaze to press the assault; from the walls fire was released and all their siege engines were burned—the rebels withdrew.',
    'Fire wagons burned the great tower at the southeast corner. The rebels used the blaze to press the attack, but the defenders set counter-fires from the wall and burned every engine. The rebels withdrew.',
  ],
  s0241: [
    'They again built earthen mounds to press the city; inside the city they dug tunnels to undermine the mounds; the rebels could not hold—they burned their siege engines and retreated to their stockade.',
    'They raised earthworks again to press the city. Defenders dug tunnels to undercut the mounds. Unable to hold, the rebels burned their engines and fell back to their stockade.',
  ],
  s0242: [
    'Materials-and-works general Song Ni surrendered to the rebels and devised a plan: divert Xuanwu Lake water to flood Terrace City; outside the walls water rose several feet—the imperial avenue before the palace became a vast flood.',
    'Materials-and-works general Song Ni defected and advised diverting Xuanwu Lake to flood Terrace City. Water rose several feet outside the walls, and the imperial avenue before the palace became a surging flood.',
  ],
  s0243: [
    'They also burned the south bank\'s dwellings and temples—none were spared.',
    'They burned the dwellings and temples on the south bank until nothing remained.',
  ],
  s0244: [
    'Si province inspector Liu Zhongli, Heng province inspector Wei Can, Nanling administrator Chen Wenche, Proclamation-Fierce general Li Xiaoqin, and others all came to the relief.',
    'Si inspector Liu Zhongli, Heng inspector Wei Can, Nanling administrator Chen Wenche, Proclamation-Fierce general Li Xiaoqin, and others all marched to relieve the city.',
  ],
  s0245: [
    'The Prince of Poyang\'s heir Si and Pei Zhigao also crossed the river.',
    'The Prince of Poyang\'s heir Si and Pei Zhigao crossed the river as well.',
  ],
  s0246: [
    'Zhongli encamped south of Zhuque Bridge; Pei Zhigao at South Park; Wei Can at Qingtang; Chen Wenche and Li Xiaoqin garrisoned Danyang commandery; the Prince of Poyang\'s heir Si south of Little Bridge—all built stockades along the Huai.',
    'Zhongli camped south of Zhuque Bridge; Pei Zhigao at South Park; Wei Can at Qingtang; Chen Wenche and Li Xiaoqin at Danyang; the Prince of Poyang\'s heir Si south of Little Bridge—all building stockades along the river.',
  ],
  s0247: [
    'At dawn Jing finally noticed; he ascended the gate tower of Zen Spirit Temple to survey; seeing Wei Can\'s encampment not yet closed, he first sent troops across to strike.',
    'At dawn Jing finally saw them. From the gate tower of Zen Spirit Temple he looked out, saw Wei Can\'s camp still open, and sent troops across first to strike.',
  ],
  s0248: [
    'Can resisted but was defeated; Jing cut off Can\'s head and displayed it beneath the city wall.',
    'Can fought but was routed. Jing cut off his head and displayed it below the wall.',
  ],
  s0249: [
    'Liu Zhongli hearing of Can\'s defeat, without time to don full armor, galloped with several dozen horsemen to the rescue; he met the rebels in battle, cut off several hundred heads; over a thousand drowned.',
    'Hearing Can had fallen, Liu Zhongli galloped out with several dozen men before he could arm fully. He met the rebels, took several hundred heads, and more than a thousand drowned.',
  ],
  s0250: [
    'Zhongli pressed deep in; his horse sank in mud and he too was badly wounded.',
    'Zhongli pressed too far in. His horse sank in mud, and he was badly wounded himself.',
  ],
  s0251: [
    'From then the rebels dared not cross to the shore.',
    'After that the rebels dared not cross to the bank.',
  ],
  s0252: [
    'Prince of Shaoling Lun and Duke of Lincheng Dalian and others gathered on the south bank from the eastern route; Jing province inspector Prince of Xiangdong Yi sent his heir Fangde, concurrent staff officer Wu Ye, and Tianmen administrator Fan Wenjiao down to the capital, encamping before Xiangzi Shore; Gaozhou inspector Li Qianshi and former Si province inspector Yang Yaren also led troops arriving in succession.',
    'Prince of Shaoling Lun and Duke of Lincheng Dalian gathered on the south bank from the east. Jing inspector Prince of Xiangdong Yi sent his heir Fangde, staff officer Wu Ye, and Tianmen administrator Fan Wenjiao toward the capital, camping before Xiangzi Shore. Gaozhou inspector Li Qianshi and former Si inspector Yang Yaren followed with more troops.',
  ],
  s0253: [
    'Soon the Prince of Poyang\'s heir Si, Marquis Que of Yong\'an, Yang Yaren, Li Qianshi, and Fan Wenjiao led their forces across the Huai, attacked the rebels\' stockade before the Eastern Palace city, broke it, and encamped east of Qingxi River.',
    'Soon the Prince of Poyang\'s heir Si, Marquis Que of Yong\'an, Yang Yaren, Li Qianshi, and Fan Wenjiao crossed the river, stormed the stockade before the Eastern Palace city, broke it, and camped east of Qingxi River.',
  ],
  s0254: [
    'Jing sent his Yitong Song Zixian to station at the Prince of Nanping\'s residence and built stockades west along the water to oppose them.',
    'Jing posted Yitong Song Zixian at the Prince of Nanping\'s mansion and built stockades west along the water to block them.',
  ],
  s0255: [
    'Jing\'s food gradually ran out; by then a hu of rice cost several hundred thousand—one or two in ten resorted to cannibalism.',
    'Jing\'s provisions dwindled. A hu of rice now cost several hundred thousand cash, and one or two people in ten turned to eating human flesh.',
  ],
  s0256: [
    'At first when relief troops reached the north bank, the people, supporting the old and leading the young, waited for the royal army; once they had just crossed the Huai they competed in plunder; rebels who wished to desert themselves, hearing this, all stopped.',
    'When relief first reached the north bank, people old and young waited for the royal army. But the moment troops crossed the river they looted one another. Rebels who meant to defect heard this and held back.',
  ],
  s0257: [
    'When the rebels first arrived the city had barely managed to hold; for the task of pacification they looked to relief armies.',
    'When the rebels first came, the city barely held. Everyone looked to the relief armies to finish the work.',
  ],
  s0258: [
    'Soon forces gathered from four directions, numbering in the millions by report, camps linked in stalemate for over a month; inside the city plague spread—more than half the people died.',
    'Forces gathered from every quarter, said to number a million. Camps faced one another for more than a month. Inside the city plague raged, and more than half the people died.',
  ],
  s0259: [
    'Since the year\'s beginning Jing had begged for peace; the court did not grant it; now with matters urgent they agreed.',
    'Since the year\'s start Jing had asked for peace, and the court had refused. Now, with crisis pressing, they agreed.',
  ],
  s0260: [
    'He requested ceding the four provinces of Jiangyou and also demanded Prince of Xuancheng Daqi be sent out as hostage, then he would lift the siege and cross the river;',
    'He asked to keep the four Jiangyou provinces and demanded that Prince of Xuancheng Daqi be sent out as hostage; then he would lift the siege and cross the river.',
  ],
  s0261: [
    'he also permitted sending his Yitong Yu Ziyue and Left Director Wang Wei into the city as hostages.',
    'He also agreed to send his Yitong Yu Ziyue and Left Director Wang Wei into the city as hostages.',
  ],
  s0262: [
    'Central Commandant Fu Qi argued that the Prince of Xuancheng as legitimate heir was too weighty to grant.',
    'Central Commandant Fu Qi argued that the Prince of Xuancheng, as legitimate heir, was too important to hand over.',
  ],
  s0263: [
    'They then requested Duke of Stone Fort Dakuan be sent out instead, and an edict approved.',
    'They asked instead for Duke of Stone Fort Dakuan, and an edict approved.',
  ],
  s0264: [
    'Thereupon outside the West Flower Gate an altar was set; Palace Secretary Wang Ke, concurrent Palace Attendant Marquis Shao of Shangjia township, and concurrent Palace Cadet Xiao Chuo with Yu Ziyue, Wang Wei, and others ascended the altar to swear the oath together.',
    'Outside the West Flower Gate they raised an altar. Palace Secretary Wang Ke, concurrent Palace Attendant Marquis Shao of Shangjia, and concurrent Palace Cadet Xiao Chuo joined Yu Ziyue, Wang Wei, and others on the altar to swear the pact.',
  ],
  s0265: [
    'Left Guard general Liu Jin went out below the West Flower Gate; Jing came out his stockade gate—they faced each other from afar and swore by slaughtering victims and tasting blood.',
    'Left Guard general Liu Jin went out below the West Flower Gate. Jing came out his stockade gate. They faced each other from afar and swore over slaughtered victims and blood.',
  ],
  s0266: [
    'South Yanzhou inspector Prince of Nankang heir Huili, former Qing and Ji province inspector Marquis Tui of Xiangtan, and Heir of Marquis of Xichang Yu led thirty thousand men, reaching Magongzhou.',
    'South Yanzhou inspector Prince of Nankang heir Huili, former Qing and Ji inspector Marquis Tui of Xiangtan, and the Heir of Marquis of Xichang Yu led thirty thousand men to Magongzhou.',
  ],
  s0267: [
    'Jing feared northern forces ascending from Baixia would cut his river route; he requested all armies be mustered on the south bank; an edict then sent the northern army to advance into Jiangtan Park.',
    'Jing feared northern troops coming up from Baixia would cut his river line. He asked that all armies mass on the south bank. An edict then sent the northern force into Jiangtan Park.',
  ],
  s0268: [
    'Jing petitioned: "Marquis Que of Yong\'an and Zhao Wei frequently shout across the stockade at me, saying \'The Son of Heaven made peace with you himself—I will still drive you out.\'',
    'Jing petitioned: "Marquis Que of Yong\'an and Zhao Wei keep shouting across the stockade at me, \'The Son of Heaven made peace with you himself—I will still drive you out.\'',
  ],
  s0269: [
    'I beg they be summoned into the city—then I will advance.',
    'Summon them into the city, and I will advance at once.',
  ],
  s0270: [
    '" An edict summoned both.',
    '" An edict summoned them both.',
  ],
  s0271: [
    'Jing again petitioned: "Word has come from the west bank that Gao Cheng has taken Shouyang and Zhongli—there is nowhere left to stand.',
    'Jing petitioned again: "Word from the west bank says Gao Cheng has taken Shouyang and Zhongli. I have nowhere left to stand.',
  ],
  s0272: [
    'I beg to borrow Guangling and Qiao province temporarily; once I recover Shouyang and Zhongli I will return them to the court."',
    'Let me hold Guangling and Qiao for now. Once I recover Shouyang and Zhongli I will return them to the court."',
  ],
  s0273: [
    'Earlier Liu Miao of Pengcheng said to Jing: "Great General, your army has halted long; the city cannot be taken; now relief forces gather like clouds—not easy to break;',
    'Earlier Liu Miao of Pengcheng told Jing: "Great General, you have stalled too long and still cannot take the city. Relief armies are massing like clouds—not easy to break now.',
  ],
  s0274: [
    'I hear army provisions won\'t last a month, transport routes are cut, nothing to plunder in the fields—a child in the palm, the truth lies in this day.',
    'I hear your grain will not last a month, your supply lines are cut, and the countryside is bare. The matter is like a child in the palm—the truth is plain today.',
  ],
  s0275: [
    'Better to beg peace, return with your army intact—this is the best plan."',
    'Better to sue for peace and withdraw whole. That is the best course."',
  ],
  s0276: [
    'Jing agreed with his words and therefore sought peace.',
    'Jing accepted this and therefore asked for peace.',
  ],
  s0277: [
    'Later learning that relief armies\' orders were not unified and there would be no effect of loyal kings coming to the rescue;',
    'Later he learned the relief armies gave conflicting orders and would never truly save the throne.',
  ],
  s0278: [
    'and hearing that inside the city deaths and sickness grew ever more—there would surely be those who responded.',
    'He also heard that deaths and sickness inside the city kept mounting—surely someone would answer.',
  ],
  s0279: [
    'Jing\'s strategist Wang Wei also said: "My lord, as a subject you raised troops in rebellion, besieged and held the palace gates for over a hundred days, humiliated consorts and princesses, defiled the ancestral temple—with this on your hands today, where can you find shelter?',
    'Jing\'s counselor Wang Wei also said: "My lord, you rose in rebellion as a subject, besieged the palace for more than a hundred days, humiliated consorts and princesses, and defiled the ancestral temple. With that on your hands, where can you go?',
  ],
  s0280: [
    'I wish my lord would watch for changes.',
    'Watch for what changes, my lord.',
  ],
  s0281: [
    '" Jing agreed and submitted a defiant memorial saying:',
    '" Jing agreed and submitted a defiant memorial:',
  ],
  s0282: [
    'Your servant has heard "writing cannot exhaust words, words cannot exhaust meaning."',
    'Your servant has heard that writing cannot exhaust words, and words cannot exhaust meaning.',
  ],
  s0283: [
    'Yet meaning cannot be declared without words, words cannot be fully written without the brush—that is why your servant harbors indignation and cannot keep silent.',
    'Yet meaning needs words, and words need the brush. That is why your servant stores up anger and cannot stay silent.',
  ],
  s0284: [
    'Your servant privately considers that Your Majesty possesses wisdom in person, many talents and many arts.',
    'Your servant considers that Your Majesty carries wisdom in your person and mastery in many arts.',
  ],
  s0285: [
    'In past days amid a declining age you soared like a dragon over Han and Mian, quelled evil and cut disorder, avenged the house\'s grievance—then followed the former kings\' footsteps, illuminated the lands south of the river, took Wen and Wu as models, claimed Yao and Shun as forebears.',
    'In a fallen age you rose like a dragon over Han and Mian, cut down the wicked and stilled chaos, and avenged your house. Then you followed the former kings, lit the lands south of the river, took Wen and Wu as your model, and claimed Yao and Shun as your line.',
  ],
  s0286: [
    'Moreover as Wei declined with no formidable foe abroad, you could take Hualing in the west, seal Huai and Si in the north, ally with the Gao clan—envoys\' chariots unbroken, borders untroubled for over ten years.',
    'Wei declined abroad and you had no strong enemy, so you took Hualing in the west, sealed Huai and Si in the north, and allied with the Gao clan. Envoys came and went without cease, and the borders were quiet for more than ten years.',
  ],
  s0287: [
    'You personally oversee all affairs, toiling at governance.',
    'You personally handle every affair and toil at governance.',
  ],
  s0288: [
    'You revised the surviving texts of Zhou and Confucius, explicated the secret depths of True Suchness.',
    'You corrected the surviving texts of Zhou and Confucius and explained the hidden depths of True Suchness.',
  ],
  s0289: [
    'Long-lived years, the root branch firm as bedrock.',
    'Long life, and the root branch firm as bedrock.',
  ],
  s0290: [
    'No sovereign\'s accomplishments match yours.',
    'No ruler\'s achievements can match yours.',
  ],
  s0291: [
    'That is why your servant leapt with joy in my corner, sighed facing the south wind—who thought name and reality would diverge, that what I heard and what I see differ?',
    'That is why your servant rejoiced in my corner and sighed toward the south wind. Who thought name and reality would part, that what I heard and what I see would differ?',
  ],
  s0292: [
    'From the day I pledged loyalty and entered your rolls, my deeds before and after, memorials submitted—all have been set forth.',
    'From the day I pledged myself and entered your service, my deeds and memorials have already been laid out in full.',
  ],
  s0293: [
    'Unable to contain my indignation, I again lay before Your Majesty:',
    'Unable to bear my anger, I lay this again before Your Majesty:',
  ],
  s0294: [
    'Your Majesty made peace with the Gao clan for over twelve years; boats and carts went back and forth, visible on every road—you were sure to share disaster and relieve suffering, share joy and grief alike;',
    'Your Majesty was at peace with the Gao clan for more than twelve years. Boats and carts traveled back and forth on every road—you were bound to share disaster and ease suffering, to share joy and grief alike.',
  ],
  s0295: [
    'how could you receive one thread-worn servant, covet my lands of Ru and Ying, then sever friendship with Hebei, send indictments cursing Gao Cheng—envoys not yet returned, trap him in the tiger\'s maw, raise drums and troops pressing Peng and Song?',
    'How could you take in one worn servant, covet my lands of Ru and Ying, then break with Hebei, send indictments cursing Gao Cheng, trap his envoys in a tiger\'s maw before they returned, and march drums and troops against Peng and Song?',
  ],
  s0296: [
    'When enemy states attack each other, they halt on hearing of mourning; even a common man\'s friendship trusts orphans and entrusts lives.',
    'When enemy states fight, they stop at news of mourning. Even a common man\'s bond can hold orphans and entrust lives.',
  ],
  s0297: [
    'Can there be a lord of ten thousand chariots who forgets righteousness at sight of profit like this!',
    'Can a lord of ten thousand chariots forget righteousness for profit like this!',
  ],
  s0298: [
    'This is your first fault.',
    'That is your first fault.',
  ],
  s0299: [
    'Your servant and Gao Cheng have old hatred; righteousness bars sharing a state—I turned to the Way.',
    'Your servant and Gao Cheng bear old hatred. Righteousness forbids sharing one state, so I turned to the Way.',
  ],
  s0300: [
    'Your Majesty granted me the title of Grand General, entrusted me with sole command, song bells, female musicians, chariots, robes, bows and arrows.',
    'Your Majesty made me grand general, gave me sole command, song bells, female musicians, chariots, robes, bows, and arrows.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_056_b3.mjs <translation.json>'
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
