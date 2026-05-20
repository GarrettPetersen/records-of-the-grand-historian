#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'If we now combine armies to besiege the city while also sending detachments forward, Lushan will block the Mian route—what they call "strangling the throat."',
    'If we mass for a siege and still split columns to push ahead, Lushan will choke the Mian route—the classic grip on the throat.',
  ],
  s0202: [
    'If grain transport is cut off, the host will naturally disperse—what is meant by lasting out?',
    'Cut the grain lines and the army falls apart on its own—where is the staying power in that?',
  ],
  s0203: [
    'Deng Yuanqi recently wishes to take three thousand men to secure Xunyang; if they readily grasp the moment, one Li Yi would suffice;',
    'Deng Yuanqi wants three thousand men to take Xunyang; if the town sees its chance and yields, a single envoy like Li Yi is enough;',
  ],
  s0204: [
    'but if they resist the royal army, three thousand cannot take it.',
    'but if they stand against the imperial force, three thousand will not suffice.',
  ],
  s0205: [
    'Advancing or retreating without footing—I do not see how it can work.',
    'With no firm ground to advance or fall back on, I see no way this succeeds.',
  ],
  s0206: [
    'Xiyang and Wuchang can be taken when convenient; once taken they ought to be garrisoned.',
    'Xiyang and Wuchang can be seized when the moment allows—and once taken, they must be held.',
  ],
  s0207: [
    'Garrisoning both cities requires no fewer than ten thousand men, and commensurate grain stores—with no troops left over.',
    'Holding both towns takes at least ten thousand men and matching stores, leaving nothing in reserve.',
  ],
  s0208: [
    'If enemy forces come upstream, ten thousand attack one city, and the two cities cannot aid each other.',
    'If rebels move upriver, ten thousand can storm one town while the other cannot help.',
  ],
  s0209: [
    'If we split forces to reinforce, both ends grow weak;',
    'Split to relieve them and both wings weaken;',
  ],
  s0210: [
    'if we send none, the isolated city will surely fall.',
    'send none and the lone fortress is lost.',
  ],
  s0211: [
    'Once one city falls, the other cities collapse in succession, and the great enterprise of the realm is lost thereby.',
    'One city gone, the rest crumble in turn—and with them the realm\'s great cause.',
  ],
  s0212: [
    'If Yingzhou is taken, sweeping downstream, Xiyang and Wuchang will naturally bow before us—why hurry to divide troops and scatter the host, bringing trouble on ourselves!',
    'Take Yingzhou and sweep downriver—Xiyang and Wuchang will fall of themselves. Why rush to split the army and invite our own trouble!',
  ],
  s0213: [
    'Moreover, when a man of resolve acts, his words should steady the steps of Heaven;',
    'Besides, a true man\'s deeds should calm the very pace of Heaven;',
  ],
  s0214: [
    'how much more when wielding the armies of several provinces to execute the ruffian band—like pouring a river or pouring fire—is there anything that would not be destroyed?',
    'how much less when we hold several provinces\' worth of troops to crush these villains—like a river poured out or fire tipped over—what could stand?',
  ],
  s0215: [
    'How can we turn north to beg for aid and show our own weakness!',
    'How can we face north and plead for rescue, exposing our weakness!',
  ],
  s0216: [
    'They may well not trust us, and we gain only shame.',
    'They may not believe us anyway—we would only earn disgrace.',
  ],
  s0217: [
    'This is the lower plan—how can it be called the upper strategy?',
    'That is the worst counsel—how can anyone call it the best plan?',
  ],
  s0218: [
    'You tell the Pacification General for me: for future conquests, simply leave them to me; the matter is plain to the eye, and there is no fear of failure—I rely only on the Pacification General to hold things quiet and firm."',
    'Tell the Pacification General for me: leave the fighting ahead to me. It is plain before our eyes; success is certain. I ask only that he keep the rear calm and secure."',
  ],
  s0219: [
    'Wu Ziyang and others advanced on Wukou; Gaozu then ordered army commanders Liang Tianhui and Cai Daoyou to hold Yuhu City, and Tang Xiuqi and Liu Daoman to camp at Baiyang Fortress, waiting on both banks.',
    'Wu Ziyang marched on Wukou. Gaozu posted Liang Tianhui and Cai Daoyou at Yuhu City and Tang Xiuqi and Liu Daoman at Baiyang Fortress, lining both shores.',
  ],
  s0220: [
    'Ziyang then advanced and held Jiahu, thirty li from Ying, leaning on mountains and embracing water, building ramparts and palisades for self-defense.',
    'Ziyang next seized Jiahu, thirty li from Ying, backed by hills and fronted by water, and walled himself in with ramparts and palisades.',
  ],
  s0221: [
    'Lushan garrison commander Fang Sengji died; the host again raised Assistant Defender Sun Lezu to replace him.',
    'Fang Sengji, commander of Lushan, died; the garrison again chose Assistant Defender Sun Lezu to succeed him.',
  ],
  s0222: [
    'In the seventh month, Gaozu ordered Wang Mao to lead army commanders Cao Zhongzong, Kang Xuan, Wu Huichao, and others with a secret force to strike Jiahu, pressing close on Ziyang.',
    'In the seventh month Gaozu sent Wang Mao with Cao Zhongzong, Kang Xuan, Wu Huichao, and others in a hidden column to strike Jiahu and close on Ziyang.',
  ],
  s0223: [
    'The water had fallen and boats could not pass; that night it rose in a sudden flood. The armies rode the current forward together, drumming and shouting in the assault; the rebels soon broke completely, and Ziyang and others fled—in the end all drowned in the river.',
    'The river had dropped too low for ships; that night it surged. The whole force rode the flood together, drums roaring as they attacked. The enemy broke at once. Ziyang and his officers fled—and in the end all drowned in the river.',
  ],
  s0224: [
    'Wang Mao captured the remainder and returned.',
    'Wang Mao took the survivors and withdrew.',
  ],
  s0225: [
    'Thereupon the two cities of Ying and Lu lost heart at sight of each other.',
    'Ying and Lushan, looking across at each other, lost all spirit.',
  ],
  s0226: [
    'Earlier, Dong Hun had sent Champion General Chen Bozhi to garrison Jiangzhou as support for Ziyang and the rest.',
    'Before this Dong Hun had posted Champion General Chen Bozhi at Jiangzhou to back Wu Ziyang.',
  ],
  s0227: [
    'Gaozu then told the generals: "Expedition and punishment do not always require real strength—what matters is the authority of renown.',
    'Gaozu told his commanders, "Campaigns are not always won by brute force alone. What counts is the weight of your name.',
  ],
  s0228: [
    'Who now, after the defeat at Jiahu, would not submit in awe?',
    'After Jiahu, who would not bow his head?',
  ],
  s0229: [
    'Chen Huya is Bozhi\'s son; he fled back in disarray. The mood in that region must surely be panic—I say Jiujiang can be settled by proclamation alone."',
    'Chen Huya is Bozhi\'s son—he ran home in tatters. The whole region must be terrified. I say Jiujiang can be taken by proclamation alone."',
  ],
  s0230: [
    'He thereupon ordered a search among captured prisoners and found Bozhi\'s banner-chief Su Longzhi, richly rewarded him, and had him carry a message.',
    'He searched the prisoners, found Bozhi\'s banner-chief Su Longzhi, rewarded him generously, and sent him back with a letter.',
  ],
  s0231: [
    'Lushan commander Sun Lezu, Ying commander Cheng Mao, and Xue Yuansi all successively asked to surrender.',
    'Sun Lezu at Lushan, Cheng Mao at Ying, and Xue Yuansi all surrendered in turn.',
  ],
  s0232: [
    'At first, when Ying city was closed, civil and military officers and men, women and children numbered over a hundred thousand; plague and swelling sickness killed seven or eight in ten, and when the city opened Gaozu extended compassionate relief to all; for the dead he ordered coffins supplied.',
    'While Ying was besieged, more than a hundred thousand people—soldiers, officials, men, women, and children—were inside. Plague and swelling sickness killed seven or eight in ten. When the city fell Gaozu showed mercy to all survivors and ordered coffins for the dead.',
  ],
  s0233: [
    'Earlier, Runan man Hu Wenchao had risen in rebellion at Zhenyang, offering to attack Yiyang, Anlu, and other commanderies to prove his loyalty; Gaozu also sent army commander Tang Xiuqi to attack Suicommandery, and both were taken.',
    'Earlier Hu Wenchao of Runan had risen at Zhenyang, offering to seize Yiyang, Anlu, and neighboring commanderies for the cause. Gaozu also sent Tang Xiuqi against Suicommandery. Both efforts succeeded.',
  ],
  s0234: [
    'Inspector of Sizhou Wang Sengjing sent his son Zhensun in as hostage.',
    'Wang Sengjing, inspector of Sizhou, sent his son Zhensun as hostage.',
  ],
  s0235: [
    'The Sizhou region was wholly pacified.',
    'All of Sizhou was pacified.',
  ],
  s0236: [
    'Chen Bozhi sent Su Longzhi back with a reply, asking that advance not be made before a suitable moment.',
    'Chen Bozhi returned Su Longzhi with a reply asking that the army not advance until conditions were right.',
  ],
  s0237: [
    'Gaozu said: "In this remark Bozhi reveals a vacillating mind; while he still hesitates, press him hard—he will have no plan, and circumstances will not allow violence."',
    'Gaozu said, "That answer shows a man with one foot in each camp. While he wavers, press him hard. He will have no plan left, and the moment will not allow him to resist."',
  ],
  s0238: [
    'He then ordered Deng Yuanqi to lead the host downstream that same day.',
    'That same day he ordered Deng Yuanqi to march the army downriver.',
  ],
  s0239: [
    'In the eighth month, the Son of Heaven sent Yellow Gate Gentleman Su Hui to congratulate the army.',
    'In the eighth month the emperor sent Yellow Gate Gentleman Su Hui to congratulate the troops.',
  ],
  s0240: [
    'Gaozu boarded his boat and ordered the generals to advance in turn; he left Upper Yong Administrator Wei Rui to guard Ying city and conduct provincial affairs.',
    'Gaozu embarked and sent the generals forward in sequence, leaving Upper Yong Administrator Wei Rui to hold Ying and govern the province.',
  ],
  s0241: [
    'As Deng Yuanqi was about to reach Xunyang, Chen Bozhi still nursed suspicion and fear; he gathered his troops and withdrew to hold Hukou, leaving his son Huya to guard Pencheng.',
    'When Deng Yuanqi neared Xunyang, Chen Bozhi still mistrusted the cause. He pulled back to Hukou and left his son Huya at Pencheng.',
  ],
  s0242: [
    'When Gaozu arrived, Bozhi bound his armor and begged forgiveness.',
    'When Gaozu arrived, Bozhi laid down his arms and asked for pardon.',
  ],
  s0243: [
    'In the ninth month, the Son of Heaven decreed that Gaozu pacify Eastern Xia and act at discretion as events required.',
    'In the ninth month the emperor authorized Gaozu to pacify Eastern Xia and act as he saw fit.',
  ],
  s0244: [
    'That month, he left Junior Master of the Palace and Chief Clerk Zheng Shaoshu to guard Jiangzhou city.',
    'That month he left Junior Master of the Palace and chief clerk Zheng Shaoshu to hold Jiangzhou.',
  ],
  s0245: [
    'The vanguard halted at Wuhu; South Yuzhou Inspector Shen Zhou abandoned Gushu and fled; at this the great army advanced and occupied it, and still sent Cao Jingzong and Xiao Yingda to lead horse and foot and encamp at Jiangning.',
    'The vanguard stopped at Wuhu. Shen Zhou, inspector of South Yuzhou, abandoned Gushu and fled. The main force took it and sent Cao Jingzong and Xiao Yingda with cavalry and infantry to encamp at Jiangning.',
  ],
  s0246: [
    'Dong Hun sent Campaign General Li Jushi with foot soldiers to meet in battle; Jingzong struck and drove him off.',
    'Dong Hun sent Campaign General Li Jushi with infantry to meet them. Cao Jingzong routed him.',
  ],
  s0247: [
    'Thereupon Wang Mao, Deng Yuanqi, and Lu Sengzhen advanced and held Chibiyi Rampart; Cao Jingzong and Chen Bozhi served as mobile detachments.',
    'Wang Mao, Deng Yuanqi, and Lu Sengzhen then took Chibiyi Rampart. Cao Jingzong and Chen Bozhi served as flying columns.',
  ],
  s0248: [
    'That day, Xinting garrison commander Jiang Daolin led troops out to fight; the armies captured him in the formation.',
    'That day Xinting commander Jiang Daolin came out to fight and was taken in the line of battle.',
  ],
  s0249: [
    'The great army reached Xinglin, ordered Wang Mao to advance and hold Yue City, Cao Jingzong to hold Zaojia Bridge, Deng Yuanqi to hold Daoshi Mound, and Chen Bozhi to hold Limen.',
    'The army reached Xinglin. Wang Mao took Yue City, Cao Jingzong Zaojia Bridge, Deng Yuanqi Daoshi Mound, and Chen Bozhi Limen.',
  ],
  s0250: [
    'Daolin\'s remaining troops withdrew and encamped south of the crossing; the Righteous Army pressed them, and they again scattered and fled, retreating to hold Zhujue, relying on the Huai for defense.',
    'Daolin\'s survivors fell back south of the crossing. The Righteous Army pressed them; they broke again and withdrew to Zhujue, clinging to the Huai for cover.',
  ],
  s0251: [
    'At the time Li Jushi still held the Xinting fortress and asked Dong Hun to burn the towns on the south bank to open a battlefield.',
    'Li Jushi still held the Xinting fort and asked Dong Hun to burn the south-bank towns and clear a field of battle.',
  ],
  s0252: [
    'From the Great Crossing west to Xinting north, all was laid bare.',
    'From the Great Crossing west to Xinting north, nothing was left standing.',
  ],
  s0253: [
    'In the tenth month, Dong Hun\'s Shitou garrison commander Zhu Sengyong led two thousand water troops in surrender.',
    'In the tenth month Zhu Sengyong, Dong Hun\'s commander at Shitou, surrendered with two thousand sailors.',
  ],
  s0254: [
    'Dong Hun again sent Campaign General Wang Zhenguo leading army commanders Hu Huya and others to deploy ranks on the great road south of the crossing, all equipped with crack archers and sharp weapons—more than a hundred thousand in all.',
    'Dong Hun sent Campaign General Wang Zhenguo with Hu Huya and other commanders to form battle lines on the road south of the crossing, all armed with elite archers and sharp weapons—more than a hundred thousand men.',
  ],
  s0255: [
    'The eunuch Wang Shuan held the white tiger banner to supervise the armies, and opened the crossing with water at the rear to cut off retreat.',
    'The eunuch Wang Shuan carried the white tiger banner to direct the host and flooded the crossing behind them to cut off retreat.',
  ],
  s0256: [
    'Wang Mao, Cao Jingzong, and others attacked from both flanks; officers and men all fought to the death, none failing to meet one against a hundred—the drum and shout shook heaven and earth.',
    'Wang Mao and Cao Jingzong hit them from both sides. Every man fought as if one could match a hundred. The roar of drums shook heaven and earth.',
  ],
  s0257: [
    'Zhenguo\'s host collapsed at once; those who plunged into the Huai drowned until corpses piled level with the crossing, and those who came later crossed on them; thereupon all the Zhujue armies saw this and fled.',
    'Zhenguo\'s army shattered at once. Men who threw themselves into the Huai drowned until the dead piled even with the crossing, and those behind walked over them to get across. Every force at Zhujue broke and ran.',
  ],
  s0258: [
    'The Righteous Army pursued to Xuanyang Gate; Li Jushi surrendered with the Xinting fortress, and Xu Yuanyu with the Eastern Mansion city; the Shitou and Baixia garrisons all fled by night.',
    'The Righteous Army chased them to Xuanyang Gate. Li Jushi surrendered the Xinting fort; Xu Yuanyu surrendered the Eastern Mansion. The garrisons at Shitou and Baixia melted away overnight.',
  ],
  s0259: [
    'On day rencwu, Gaozu garrisoned Shitou and ordered the armies to surround the six gates; Dong Hun burned everything inside the gates, drove camps and government offices into the city, and had two hundred thousand men.',
    'On day rencwu Gaozu occupied Shitou and surrounded the six gates. Dong Hun burned the districts within the walls, herded camps and offices into the city, and mustered two hundred thousand men.',
  ],
  s0260: [
    'Qingzhou Inspector Huan He deceived Dong Hun into coming out to fight, then came over with his troops in surrender.',
    'Huan He, inspector of Qingzhou, tricked Dong Hun into marching out, then defected with his whole force.',
  ],
  s0261: [
    'Gaozu ordered the armies to build a long encirclement.',
    'Gaozu ordered a long siege line built around the city.',
  ],
  s0262: [
    'At first, when the Righteous Army pressed close, Dong Hun had sent garrison commander Left Sengqing to hold Jingkou, Chang Sengjing to hold Guangling, and Li Shuxian to encamp at Guabu; when Shen Zhou fled Gushu and returned, he was also sent to encamp at Podun as northeast support.',
    'When the Righteous Army first closed in, Dong Hun had posted Left Sengqing at Jingkou, Chang Sengjing at Guangling, and Li Shuxian at Guabu. When Shen Zhou fled back from Gushu, he too was sent to Podun to guard the northeast.',
  ],
  s0263: [
    'At this Gaozu sent envoys to explain and persuade them; all led their hosts in surrender.',
    'Gaozu now sent envoys to win them over, and all came over with their troops.',
  ],
  s0264: [
    'He then sent his younger brother Auxiliary General Xiu to garrison Jingkou, Auxiliary General Hui to encamp at Podun, and his younger cousin Unassuming General Jing to garrison Guangling.',
    'He posted his brother Auxiliary General Xiu at Jingkou, Auxiliary General Hui at Podun, and his cousin Unassuming General Jing at Guangling.',
  ],
  s0265: [
    'Wu commandery Administrator Cai Yin abandoned his commandery and joined the Righteous Army.',
    'Cai Yin, administrator of Wu commandery, left his post and joined the Righteous Army.',
  ],
  s0266: [
    'On the morning of day bingyin in the twelfth month, Concurrent Minister of the Guard Zhang Ji and North Xuzhou Inspector Wang Zhenguo beheaded Dong Hun and sent his head to the Righteous Army.',
    'At dawn on day bingyin in the twelfth month, Concurrent Minister of the Guard Zhang Ji and North Xuzhou Inspector Wang Zhenguo cut off Dong Hun\'s head and sent it to the Righteous Army.',
  ],
  s0267: [
    'Gaozu ordered Lu Sengzhen to marshal troops to seal the treasuries and archives, seize the concubine Consort Pan and the villainous faction including Wang Xuanzhi—forty-one persons in all—and turn them over to the judicial officers for execution.',
    'Gaozu ordered Lu Sengzhen to seal the treasuries and archives, seize Consort Pan and the ringleaders led by Wang Xuanzhi—forty-one people in all—and hand them to the courts for execution.',
  ],
  s0268: [
    'Empress Dowager Xuande decreed the deposed Prince of Fuling reduced to Marquis Donghun, following the precedent of Han\'s Marquis of Haihun.',
    'Empress Dowager Xuande stripped the deposed Prince of Fuling of his rank and made him Marquis Donghun, on the model of Han\'s Marquis of Haihun.',
  ],
  s0269: [
    'Gaozu was appointed Director of the Masters of Writing, Commander of military affairs of Yang and South Xu provinces, Grand Marshal, Supervisor of the Masters of Writing, Fast General-in-Chief, and Inspector of Yangzhou; enfeoffed as Duke of Jian\'an commandery, fief of ten thousand households; granted forty halberd guards; yellow battle-axe, Palace Attendant, and campaign command—all as before;',
    'Gaozu was made Director of the Masters of Writing, commander of Yang and South Xu military affairs, Grand Marshal, supervisor of the Masters of Writing, Fast General-in-Chief, and inspector of Yangzhou; enfeoffed Duke of Jian\'an commandery with ten thousand households; granted forty halberd guards; yellow battle-axe, palace attendant, and campaign authority unchanged;',
  ],
  s0270: [
    'following the precedent of Jin\'s Prince of Wuling Zun exercising regal authority.',
    'following Jin\'s precedent of Prince of Wuling Zun acting with imperial authority.',
  ],
  s0271: [
    'On day jimao, Gaozu entered and encamped at the Review-of-Troops Hall.',
    'On day jimao Gaozu moved into the Review-of-Troops Hall.',
  ],
  s0272: [
    'He issued an order: "The imperial house met misfortune and encountered this benighted villain; calamity reached moving things and planted things, cruelty afflicted men and ghosts; the altars hung by a thread, tottering as if on a fraying cord.',
    'He proclaimed, "The dynasty has suffered ruin and met this dark tyrant. Disaster touched every living thing; cruelty reached from men to ghosts. The altars of state hang by a thread, swaying as if on a fraying cord.',
  ],
  s0273: [
    'I by birth belong to the imperial clan, was privately favored by my predecessors, received duty on the frontier, trusted at the chariot yoke ten thousand li away; gazing at the parentless bird, the pain is before my eyes—therefore I lead the sentiment of honoring the sovereign and stiffen the will to forget life itself.',
    'I am of the imperial blood, was favored by those before me, and was trusted on the frontier a thousand leagues away. When I see the orphaned bird, grief is before my eyes—so I roused the loyal heart and hardened the will to risk my life.',
  ],
  s0274: [
    'Though the precious mandate rises anew and the bright mandate has a successor, this lone villain\'s ugly excess still fans the capital.',
    'Though the throne is restored and the mandate renewed, this lone monster\'s wickedness still burns in the capital.',
  ],
  s0275: [
    'I flung aside my sleeves and grasped my weapon, and was able to quell many disasters.',
    'I rolled up my sleeves, took up arms, and put down many calamities.',
  ],
  s0276: [
    'Tyrannical government has flowed unchecked for long; those sharing the same evil aid one another—it is surely not one clan alone.',
    'Bad government has run wild for years. Those who shared in the evil helped one another—it was not one house alone.',
  ],
  s0277: [
    'Looking up to receive the court\'s command, my charge is sole expedition; I think to spread imperial grace and cover all within the four seas.',
    'Heeding the court\'s charge, my duty is to lead the campaign alone. I mean to spread imperial mercy over all the realm.',
  ],
  s0278: [
    'All who bear guilt shall share in renewal.',
    'All who have sinned shall share in a new beginning.',
  ],
  s0279: [
    'Let there be a great amnesty throughout the realm;',
    'Let there be a general amnesty throughout the land;',
  ],
  s0280: [
    'only Wang Xuanzhi and forty-one others are excluded from amnesty."',
    'Wang Xuanzhi and forty-one others alone are excluded."',
  ],
  s0281: [
    'Another order: "Trees are planted to appoint shepherds—not to enslave things to nourish the ruler.',
    'He also ordered, "Officials are set over the people to govern them—not to grind the world down to feed a tyrant.',
  ],
  s0282: [
    'To see the people as wounded—how could one above indulge cruelty at will?',
    'To treat the people as if every wound were your own—how could a ruler indulge cruelty at will?',
  ],
  s0283: [
    'The deposed lord abandoned the constant way and cut himself off from the ancestral temples.',
    'The deposed emperor cast off the eternal order and severed himself from the ancestral temples.',
  ],
  s0284: [
    'His extremity of wickedness and utter perversity have no parallel in written record.',
    'His wickedness and perversity exceed anything recorded in history.',
  ],
  s0285: [
    'Levies and taxes were inconsistent; harshness and cruelty daily increased.',
    'Taxes were arbitrary and cruelty grew day by day.',
  ],
  s0286: [
    'Silk embroidery and timber works, grain and dogs and horses—the commonfolk of the lanes were conscripted to fill construction needs.',
    'Silk brocades and timber palaces, grain and horses and dogs—the people of the lanes were dragooned to build them.',
  ],
  s0287: [
    'Driven from summer heat to winter cold, then struck by plague and pestilence; dying they fell into ditches, never once relieved—rotten flesh and dry bones fed crows and kites.',
    'They were driven through heat and cold, then plague followed. They died in ditches with no one to save them. Rotting flesh and bare bones were food for crows and kites.',
  ],
  s0288: [
    'Added to this were heaven\'s disasters and human fires; palace quarters and official halls were repeatedly burned, not a foot of rafter left—grief like "Grain Tall," pain combining with "Wheat in Bloom."',
    'On top of that came fire from heaven and from men. Palaces and offices burned again and again until not a rafter remained—grief like Grain Tall, sorrow doubled like Wheat in Bloom.',
  ],
  s0289: [
    'Thus millions lost heart, borders and marches grew weak—what crime did these people commit, that they should leave this scorched earth?',
    'Millions lost faith; the frontiers weakened. What had these people done to deserve such ruin?',
  ],
  s0290: [
    'Now bright replaces dark and the great Way goes forth openly; people who long for order return to life on this day.',
    'Now light follows darkness and the great Way is open again. People who hunger for peace may breathe free today.',
  ],
  s0291: [
    'I, unworthy and thin in virtue, happen to bear the great favor; though fate blocks full restoration and hardship matches the wild beginning, I mean to extend imperial blessing and begin anew with them.',
    'I am unworthy and weak in virtue, yet have been given this great charge. Though fortune still blocks full revival and hardship matches the founding days, I will spread imperial grace and start anew with the people.',
  ],
  s0292: [
    'All benighted institutions, mistaken levies, licentious punishments, and abusive corvée—outside these halls let a detailed review of their origins be made, and all be abolished.',
    'Every dark law, mistaken tax, cruel punishment, and abusive levy—let the ministries trace each to its source and abolish them all.',
  ],
  s0293: [
    'Where prefects and defenders let things scatter and all kinds of losses occurred, let strict statutes be set and all be restored to former rules.',
    'Where local officials allowed losses and disorder, let clear rules be drawn up and all be made good under the old standards."',
  ],
  s0294: [
    'He also said: "In the last years of Yongyuan, the heavenly axis lost its knot.',
    'He also said, "In the closing years of Yongyuan the axis of Heaven slipped its knot.',
  ],
  s0295: [
    'Government indeed had many doors—as in Duke Wen of Wey\'s time;',
    'Government had too many masters, as in Duke Wen of Wei\'s day;',
  ],
  s0296: [
    'authority shifted downward—events equaled Cao Gong\'s day.',
    'power sank to the bottom, as in the time of Cao Gong.',
  ],
  s0297: [
    'Eunuch chamberlains acquired the titles of old man and old woman; Gao\'an held the edict of Fa Yao.',
    'Palace eunuchs were called Old Father and Old Mother; Gao\'an carried the decree of Fa Yao.',
  ],
  s0298: [
    'Selling verdicts and peddling offices, monopolizing mountains and guarding marshes—the keys of access were turned by petty villains.',
    'Justice was for sale, offices were traded, mountains and marshes were fenced off for private gain—the gates of power were worked by petty men.',
  ],
  s0299: [
    'The straight path and right justice were suppressed year on year; those nursing wrongs and holding reason knew not whom to appeal to.',
    'Honest men and just causes were crushed year after year. Those with grievances did not know where to turn.',
  ],
  s0300: [
    'Corrupt clerks seized on this, wielding brush and knife as they pleased."',
    'Corrupt clerks seized the chance and wrote the record—and the sentence—as they pleased."',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_001_b3.mjs <translation.json>'
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
