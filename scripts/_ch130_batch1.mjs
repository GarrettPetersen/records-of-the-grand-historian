import fs from 'node:fs';

const T = {
  s0001: ['Helian Bobo', 'Helian Bobo'],
  s0002: [
    'Helian Bobo, courtesy name Qujie, was a descendant of the Xiongnu Right Worthy King Qubei and a clansman of Liu Yuanhai.',
    'Helian Bobo, styled Qujie, traced his line to the Xiongnu Right Worthy King Qubei and belonged to the same clan as Liu Yuanhai.',
  ],
  s0003: [
    'His great-grandfather Wu, during the reign of Liu Cong, was enfeoffed as Duke of Loufan for his status within the imperial clan, appointed General Who Pacifies the North, Supervisor of Xianbei Military Affairs, and Central Commandant of the Dingling, and dominated the Silu River region.',
    'His great-grandfather Wu, in Liu Cong\'s day, received the title Duke of Loufan as a member of the imperial house and held the posts of General Who Pacifies the North, overseer of Xianbei military affairs, and Central Commandant of the Dingling, ruling the Silu River country as a regional power.',
  ],
  s0004: [
    'He was defeated by the Dai king Tuoba Yilu and fled beyond the frontier.',
    'Defeated by Dai King Tuoba Yilu, he withdrew beyond the border.',
  ],
  s0005: [
    'His grandfather Baozi gathered the tribal peoples and again became chief among the tribes; Shi Jilong sent envoys to appoint him on the spot as General Who Pacifies the North, Left Worthy King, and Chanyu of the Dingling.',
    'His grandfather Baozi rallied the tribes and once more rose to leadership among them; Shi Jilong dispatched envoys to invest him as General Who Pacifies the North, Left Worthy King, and Chanyu of the Dingling.',
  ],
  s0006: [
    'His father Wei Chen entered and settled within the frontier; Fu Jian made him Western Chanyu, put him in charge of the various barbarians west of the river, and garrisoned him at Dailai city.',
    'His father Wei Chen moved inside the frontier, where Fu Jian named him Western Chanyu, entrusted him with the barbarian peoples of Hexi, and stationed him at Dailai.',
  ],
  s0007: [
    'When Fu Jian\'s state fell into turmoil, he secured the Shuofang region and had thirty-eight thousand bow-bearing warriors.',
    'Once Fu Jian\'s realm collapsed into disorder, he held Shuofang with thirty-eight thousand archers under arms.',
  ],
  s0008: [
    'Later Wei forces attacked him; Chen ordered his son Lishiti to resist in battle, and they were defeated by Wei.',
    'When Wei marched against him, Chen sent his son Lishiti to hold the line, but Wei broke them.',
  ],
  s0009: [
    'The Wei troops crossed the river in pursuit of victory, captured Dailai, seized Chen, and killed him.',
    'Wei crossed the river on the momentum of victory, took Dailai, captured Chen, and put him to death.',
  ],
  s0010: [
    'Bobo thereupon fled to the Chigan tribe.',
    'Bobo fled to the Chigan tribe.',
  ],
  s0011: [
    'The Chigan chief Tadoufu sent Bobo to Wei.',
    'Tadoufu of the Chigan delivered Bobo to Wei.',
  ],
  s0012: [
    'Tadoufu\'s nephew Ali had already been garrisoned at the Daluo River.',
    'Tadoufu\'s nephew Ali was already stationed on the Daluo River.',
  ],
  s0013: [
    'Hearing that Bobo was to be handed over, he raced to remonstrate, saying, "When birds come seeking refuge among people, one ought still to aid and spare them—how much more so when Bobo, his state shattered and his family destroyed, has entrusted himself to us?',
    'When he learned Bobo was to be turned over, he rode in haste to protest: "Even a sparrow that flies to a man deserves mercy—how much more a man whose kingdom is gone and whose house is ruined, who has come to us for shelter?',
  ],
  s0014: [
    'Even if we cannot harbor him, we should at least let him flee whither he will.',
    'If we cannot keep him, we should at least let him go where he chooses.',
  ],
  s0015: [
    'To seize and deliver him now would be deeply contrary to the conduct of the humane.',
    'To bind him and send him off would be a deed far from humane.',
  ],
  s0016: [
    'Tadoufu, fearing blame from Wei, did not heed him.',
    'Tadoufu, afraid Wei would hold him accountable, refused to listen.',
  ],
  s0017: [
    'Ali secretly sent fierce warriors to abduct Bobo on the road and deliver him to Yao Xing\'s Duke of Gaoping, Moyiyu; Moyiyu gave his daughter to Bobo in marriage.',
    'Ali secretly sent bold men to snatch Bobo on the road and convey him to Moyiyu, Duke of Gaoping under Yao Xing, who gave Bobo his daughter in marriage.',
  ],
  s0018: [
    'Bobo stood eight chi and five cun in height, his waist girdle ten wei in circumference; by nature he was eloquent and clever, with handsome bearing.',
    'Bobo stood eight feet five inches tall, with a waist ten handspans around; he was quick-witted and eloquent, and carried himself with striking grace.',
  ],
  s0019: [
    'Xing saw him and found him extraordinary, treating him with deep courtesy; he appointed him General of Valiant Cavalry and added Chariot Commandant; he regularly participated in great state councils, and the favor shown him exceeded that given to meritorious veterans.',
    'Yao Xing was struck by him at once, honored him lavishly, and made him General of Valiant Cavalry with the additional title Chariot Commandant; Bobo took part in every major council of war and state, and was favored beyond the old servants of merit.',
  ],
  s0020: [
    'Xing\'s younger brother Yong said to Xing, "Bobo\'s nature is cruel and lacks humanity—he is difficult to draw near.',
    'Yao Xing\'s younger brother Yong said to him, "Bobo is ruthless by nature and not a man one can trust.',
  ],
  s0021: [
    'Your Majesty favors him excessively—I find it puzzling.',
    'Your Majesty honors him far too much; I cannot make sense of it.',
  ],
  s0022: [
    'Xing said, "Bobo has talent to bring order to the age—I am just now harnessing his abilities to pacify the realm together with him—what is wrong with that!',
    'Xing replied, "Bobo has the talent to set the age aright. I mean to use what he can do and win the realm with him—what harm is there in that?',
  ],
  s0023: [
    'Thereupon he made Bobo General Who Pacifies the Distant, enfeoffed him as Marquis of Yangchuan, had him assist Moyiyu in garrisoning Gaoping, assigned him thirty thousand troops including the mixed barbarians of Sancheng and Shuofang and Wei Chen\'s followers, and had him serve as a scout for attacking Wei.',
    'He then made Bobo General Who Pacifies the Distant and Marquis of Yangchuan, set him to aid Moyiyu in holding Gaoping, and gave him thirty thousand men drawn from the mixed tribes of Sancheng and Shuofang and from Wei Chen\'s following, with orders to reconnoiter against Wei.',
  ],
  s0024: [
    'Yao Yong firmly remonstrated that this was inadvisable.',
    'Yao Yong pressed his objections and said it must not be done.',
  ],
  s0025: [
    'Xing said, "How do you know his temperament?',
    'Xing asked, "How do you know what sort of man he is?',
  ],
  s0026: [
    'Yong said, "Bobo is disrespectful toward his superiors, cruel toward his followers, greedy and violent without loyalty, and fickle in his alliances—favor him beyond his due and he will ultimately become a frontier calamity."',
    'Yong answered, "He is slack toward his lord, harsh with his men, greedy, brutal, and faithless, and he shifts allegiance lightly. Honor him beyond measure and he will become a scourge on the borderlands."',
  ],
  s0027: [
    'Xing then desisted.',
    'Xing held back and did not proceed.',
  ],
  s0028: [
    'Before long, he appointed Bobo Bearer of the Staff, General Who Pacifies the North, and Duke of Wuyuan, assigned him more than twenty thousand tribes of the three-jiao Wubu Xianbei and various barbarians, and stationed him in Shuofang.',
    'Not long after, he made Bobo Bearer of the Staff, General Who Pacifies the North, and Duke of Wuyuan, gave him more than twenty thousand households of the three-jiao Wubu Xianbei and other barbarian peoples, and posted him in Shuofang.',
  ],
  s0029: [
    'At that time the Hexi Xianbei Du Lun presented eight thousand horses to Yao Xing, crossed the river, and reached Dacheng; Bobo detained him, summoned his more than thirty thousand followers under pretense of hunting on the Gaoping River, attacked and killed Moyiyu and absorbed his forces, and his army reached tens of thousands.',
    'About then the Hexi Xianbei chief Du Lun brought eight thousand horses as tribute to Yao Xing, crossed the river, and came to Dacheng. Bobo held him there, called up his own force of more than thirty thousand under the guise of a hunt on the Gaoping River, struck and killed Moyiyu, took over his troops, and raised his following to tens of thousands.',
  ],
  s0030: [
    'In the third year of Yixi, he presumptuously styled himself Heavenly King and Grand Chanyu, amnestied his territory, established the era name Longsheng, and installed officials throughout the government.',
    'In the third year of Yixi he declared himself Heavenly King and Grand Chanyu, proclaimed a general amnesty, took the era name Longsheng, and appointed a full roster of officials.',
  ],
  s0031: [
    'Considering himself a descendant of the Xiongnu and the Xia dynasty, he named his state Great Xia.',
    'He claimed descent from the Xiongnu and from the house of Xia, and named his state Great Xia.',
  ],
  s0032: [
    'He made his eldest brother Youdidai chancellor and Duke of Dai, his second brother Lishiti grand general and Duke of Wei, Chigan Ali censor-in-chief and Duke of Liang, his younger brother Aliluoyin General Who Conquers the South and Director of the Masters of Writing, Ruomen Director of the Masters of Writing, Chiyijian General Who Conquers the West and Left Vice Director of the Masters of Writing, Yidou General Who Conquers the North and Right Vice Director of the Masters of Writing, and assigned the rest in descending order.',
    'He appointed his eldest brother Youdidai chancellor and Duke of Dai, his second brother Lishiti grand general and Duke of Wei, Chigan Ali censor-in-chief and Duke of Liang, his younger brother Aliluoyin General Who Conquers the South and Director of the Masters of Writing, Ruomen Director of the Masters of Writing, Chiyijian General Who Conquers the West and Left Vice Director of the Masters of Writing, Yidou General Who Conquers the North and Right Vice Director of the Masters of Writing, and filled the remaining posts in rank below them.',
  ],
  s0033: [
    'That year he attacked the three Xianbei tribes including Xuegan, defeated them, and received the submission of tens of thousands.',
    'That same year he campaigned against the three Xianbei tribes led by Xuegan, broke them, and accepted the surrender of many thousands.',
  ],
  s0034: [
    'Advancing, he attacked the garrisons north of Sancheng under Yao Xing and beheaded the generals Yang Pi and Yao Shisheng and others.',
    'He pushed forward against Yao Xing\'s posts north of Sancheng, killing the generals Yang Pi, Yao Shisheng, and others.',
  ],
  s0035: [
    'The generals remonstrated, urging him to hold secure positions, but he would not listen; they again said to Bobo, "If Your Majesty intends to manage affairs within the realm and march south to take Chang\'an, you should first secure the root foundation so that the people have something to rely upon—only then can the great enterprise succeed.',
    'His officers urged him to dig in and hold defensible ground, but he refused. They spoke to him again: "If Your Majesty means to rule the realm and seize Chang\'an in the south, you must first make the foundation firm so that hearts have something to cling to. Only then can the great work stand.',
  ],
  s0036: [
    'Gaoping is perilous and secure, its mountains and rivers rich and fertile—it can serve as a capital.',
    'Gaoping is strong by nature, its land fertile—fit to be your capital.',
  ],
  s0037: [
    'Bobo said, "You know only one part and not the other.',
    'Bobo said, "You see one thing and miss the other.',
  ],
  s0038: [
    'My great enterprise is newly founded and my forces are still few; Yao Xing too is a hero of the age—the Guanzhong region cannot yet be taken.',
    'My state is still in its first days and my army is small. Yao Xing is a formidable man of his time, and Guanzhong is not yet within reach.',
  ],
  s0039: [
    'Moreover his garrisons obey his orders; if I concentrate on holding a single city, he is sure to bring all his strength against me—I cannot match his numbers, and destruction would come at once.',
    'Besides, his frontier posts answer his call. If I lock myself into one fortress, he will throw every force at me. I cannot match him in numbers, and ruin would follow quickly.',
  ],
  s0040: [
    'I shall ride like clouds and gallop like wind, strike where they do not expect; if they rescue the front I shall hit the rear, if they rescue the rear I shall hit the front, wear them out with constant running to and fro while I live off the land at ease—in less than ten years all the country north of the mountains and east of the river will be mine.',
    'I will move like wind-driven cavalry and strike where no one looks for me. Let them rush to save the van and I will fall on the rear; let them save the rear and I will fall on the van. I will keep them exhausted while my men forage freely. In less than ten years everything north of the ridges and east of the river will be mine.',
  ],
  s0041: [
    'When Yao Xing is dead, I shall take Chang\'an at leisure.',
    'After Yao Xing dies, I will take Chang\'an in my own time.',
  ],
  s0042: [
    'Yao Hong is a weak and childish man—the plan to capture him is already settled in my mind.',
    'Yao Hong is a feeble boy. The way to seize him is already laid in my mind.',
  ],
  s0043: [
    'In antiquity the Yellow Emperor too moved his dwelling without fixed abode for more than twenty years—am I alone in this!',
    'Even the Yellow Emperor wandered without a fixed seat for more than twenty years—why should I alone be blamed for it!',
  ],
  s0044: [
    'Thereupon he raided north of the mountains, and north of the mountains the city gates were not opened in daylight.',
    'He then harried the country north of the ridges, and there the city gates stayed shut even by day.',
  ],
  s0045: [
    'Xing sighed and said, "Had I heeded Yellow Boy\'s words, I would not have come to this!',
    'Yao Xing sighed, "Had I listened to Yellow Boy, I would never have come to this pass!',
  ],
  s0046: [
    '"Yellow Boy" was Yao Yong\'s childhood name.',
    '"Yellow Boy" was the childhood name of Yao Yong.',
  ],
  s0047: [
    'When Bobo first assumed his royal title, he sought marriage with Tufa Rutan, but Rutan refused.',
    'Soon after Bobo first took royal rank, he asked Tufa Rutan for a marriage alliance, and Rutan declined.',
  ],
  s0048: [
    'Bobo in anger led twenty thousand horsemen to attack him, from Yangfei to Zhiyang a distance of more than three hundred li, killing and wounding more than ten thousand men and driving off twenty-seven thousand captives and several hundred thousand cattle, sheep, and horses before returning.',
    'Enraged, Bobo led twenty thousand cavalry against him. From Yangfei to Zhiyang—more than three hundred li—he killed and wounded over ten thousand men, carried off twenty-seven thousand people, and drove away tens of thousands of cattle, sheep, and horses before turning back.',
  ],
  s0049: [
    'Rutan led his army in pursuit; his general Jiao Lang said to Rutan, "Bobo is by nature bold and fierce, and his command of troops is strict and orderly—he must not be treated lightly.',
    'Rutan pursued with his host. His officer Jiao Lang warned him, "Bobo is a born warrior, and his army is disciplined and hard to break. Do not underestimate him.',
  ],
  s0050: [
    'Now, with the spoils of plunder behind them and men eager to return home, each will fight for himself—it will be hard to contend with them in open battle.',
    'They are laden with booty and filled with men who want to go home. Each soldier will fight for himself. It will be hard to meet them head on.',
  ],
  s0051: [
    'It would be better to cross north from Wenwei, make for Wanhudui, and encamp where the water blocks their path, controlling their throat—this is the tactic that wins a hundred battles out of a hundred.',
    'Better to cross north from Wenwei, strike for Wanhudui, and camp where the river narrows their road. Hold the choke point—that is the way to win every fight.',
  ],
  s0052: [
    'Rutan\'s general Helian Nu said, "Bobo is leading the remnant of the defeated, a mob hastily gathered together; he has offended the right order and brought disaster on himself, and only by luck has he won a great success.',
    'Rutan\'s officer Helian Nu said, "Bobo commands the wreckage of defeat, a crowd patched together overnight. He has defied heaven and courted ruin, and only by fortune gained a great victory.',
  ],
  s0053: [
    'Now cattle and sheep choke the roads and treasure piles like mountains; worn and exhausted as they are, the men are greedy and contentious—they cannot be driven to stand firm against us.',
    'Now their road is blocked with livestock and their wagons heaped with plunder. Exhausted as they are, the men are greedy and unruly. He cannot keep them in line to face us.',
  ],
  s0054: [
    'When I bring the main army down on them, they are sure to collapse like a wall of earth or fish in a drained pond.',
    'When my main force falls on them, they will break like a crumbling dike or fish stranded in a dry pool.',
  ],
  s0055: [
    'To withdraw the army now and avoid them would show the enemy weakness.',
    'To pull back now would show them we are afraid.',
  ],
  s0056: [
    'Our men\'s spirit is sharp—we should pursue swiftly.',
    'Our troops are eager. We should chase them at once.',
  ],
  s0057: [
    'Rutan said, "My mind is made up to pursue—I behead anyone who dares remonstrate!',
    'Rutan said, "My decision stands. Anyone who argues against the pursuit dies!',
  ],
  s0058: [
    'Bobo, hearing this, was greatly pleased; he then at Yangwu dug trenches, buried wagons, and blocked the road.',
    'When Bobo heard this he was delighted. At Yangwu he dug ditches, buried carts, and blocked the way.',
  ],
  s0059: [
    'Rutan sent skilled archers to shoot at him, and one struck Bobo in the left arm.',
    'Rutan sent his best bowmen against him, and one arrow hit Bobo in the left arm.',
  ],
  s0060: [
    'Bobo then rallied his troops and counterattacked, inflicting a great defeat; he pursued the fleeing enemy for more than eighty li, killing and wounding beyond count, beheaded more than ten of their great generals, built a mound of skulls called the "Skull Platform," and returned north of the mountains.',
    'Bobo wheeled his men and counterattacked, crushing them. He chased the rout more than eighty li, killing and wounding beyond number, took the heads of more than ten senior commanders, and raised a mound of skulls he named the Skull Platform before withdrawing north of the ridges.',
  ],
  s0061: [
    'Bobo fought Yao Xing\'s general Zhang Fusheng at Qing Shi Plain and again defeated him, capturing and killing five thousand seven hundred men.',
    'At Qing Shi Plain Bobo fought Yao Xing\'s general Zhang Fusheng, defeated him again, and killed or captured five thousand seven hundred men.',
  ],
  s0062: [
    'Xing dispatched the general Qi Nan at the head of twenty thousand men to attack; Bobo withdrew toward the river bend.',
    'Yao Xing sent General Qi Nan with twenty thousand men against him, and Bobo fell back toward the river bend.',
  ],
  s0063: [
    'Qi Nan, thinking Bobo was already far away, let his troops plunder the countryside; Bobo secretly moved his army to envelop them, capturing more than seven thousand men and seizing their horses, armor, and weapons.',
    'Believing Bobo was already distant, Qi Nan allowed his men to ravage the fields. Bobo slipped a force behind him, took more than seven thousand prisoners, and seized horses, armor, and arms.',
  ],
  s0064: [
    'Qi Nan led his army in retreat; Bobo again pursued and attacked him at Mucheng, captured the city, seized Qi Nan, and took thirteen thousand of his officers and soldiers and ten thousand horses captive.',
    'Qi Nan withdrew, but Bobo pursued him to Mucheng, stormed the place, captured Qi Nan, and took thirteen thousand soldiers and ten thousand horses.',
  ],
  s0065: [
    'Barbarian and Han peoples north of the mountains submitted to him by the tens of thousands; Bobo thereupon appointed and installed local administrators to pacify them.',
    'Tens of thousands of tribesmen and settlers north of the ridges came over to him, and Bobo appointed magistrates to govern them.',
  ],
  s0066: [
    'Bobo again led twenty thousand horsemen into Gaogang and as far as Wujing, plundering more than seven thousand households of mixed barbarians in Pingliang to assign to the rear guard, and advanced to encamp at Yili River.',
    'Bobo led twenty thousand cavalry into Gaogang and on to Wujing, carried off more than seven thousand mixed barbarian households from Pingliang for his rear guard, and moved forward to camp on the Yili River.',
  ],
  s0067: [
    'Yao Xing came to attack and reached Sancheng; Bobo waited until Xing\'s various armies had not yet assembled and led his cavalry to strike them.',
    'Yao Xing marched against him and reached Sancheng. Bobo watched until Xing\'s columns were still scattered, then led his cavalry in a sudden blow.',
  ],
  s0068: [
    'Xing was greatly afraid and sent his general Yao Wenzong to resist; Bobo feigned retreat and set an ambush to await them.',
    'Yao Xing was terrified and sent General Yao Wenzong to hold him off. Bobo pretended to flee and laid an ambush.',
  ],
  s0069: [
    'Xing sent his generals Yao Yusheng and others in pursuit; the hidden troops attacked from both sides and captured them all.',
    'Xing sent Yao Yusheng and others in pursuit, but troops hidden on both flanks sprang up and took them all.',
  ],
  s0070: [
    'Xing\'s general Wang Xi had gathered more than three thousand households of Qiang and barbarians at Chiqi Fortress; Bobo advanced to attack it.',
    'Xing\'s officer Wang Xi had gathered more than three thousand Qiang and barbarian households at Chiqi Fortress, and Bobo marched to besiege it.',
  ],
  s0071: [
    'Xi was fierce and strong, fighting at close quarters; many of Bobo\'s men were wounded by him.',
    'Wang Xi was a brutal fighter in close combat, and many of Bobo\'s soldiers fell to him.',
  ],
  s0072: [
    'Thereupon they dammed and cut off the water supply; the people in the fortress were hard pressed, seized Xi, and came out to surrender.',
    'Bobo\'s men then dammed the stream that fed the fort. Trapped without water, the defenders seized Wang Xi and surrendered.',
  ],
  s0073: [
    'Bobo said to Xi, "You are a loyal minister!',
    'Bobo told Wang Xi, "You are a faithful servant!',
  ],
  s0074: [
    'I am just about to win the realm together with you.',
    'I mean to settle the realm with men like you.',
  ],
  s0075: [
    'Xi said, "If I receive great grace, a quick death would be the greater kindness.',
    'Wang Xi answered, "If Your Majesty would show mercy, let it be a swift death.',
  ],
  s0076: [
    'He then, together with several dozen of his close followers, cut his own throat and died.',
    'Then he and several dozen of his companions drew their blades and killed themselves.',
  ],
  s0077: [
    'Bobo again attacked Yao Xing\'s general Jin Luosheng at Huangshi Fort and Mijie Haodi at Wuluocheng, captured both, moved more than seven thousand households to Dacheng, and had his chancellor Youdidai serve as Governor of Youzhou to garrison the region.',
    'Bobo attacked Yao Xing\'s general Jin Luosheng at Huangshi Fort and Mijie Haodi at Wuluocheng, took both places, relocated more than seven thousand households to Dacheng, and put his chancellor Youdidai in charge as Governor of Youzhou.',
  ],
  s0078: [
    'He dispatched his Director of the Masters of Writing Jin Zuan at the head of ten thousand horsemen to attack Pingliang; Yao Xing came to the rescue, defeated Zuan, and killed him.',
    'He sent Director of the Masters of Writing Jin Zuan with ten thousand cavalry against Pingliang. Yao Xing marched to relieve the city, broke Jin Zuan, and killed him.',
  ],
  s0079: [
    'Bobo\'s nephew, Left General Luoti, led ten thousand infantry and cavalry to attack Yao Xing\'s general Yao Guangdu at Dingyang, captured it, buried alive more than four thousand officers and soldiers, and distributed the women and children as rewards to the army.',
    'Bobo\'s nephew Luoti, Left General, led ten thousand foot and horse against Yao Guangdu at Dingyang, took the city, entombed more than four thousand soldiers alive, and gave the women and children to his troops as booty.',
  ],
  s0080: [
    'He appointed Guangdu Director of Ceremonial.',
    'He made Guangdu Director of Ceremonial.',
  ],
  s0081: [
    'Bobo again attacked Yao Xing\'s general Yao Shoudu at Qingshui city; Shoudu fled to Shanggui, and Bobo moved sixteen thousand six hundred of the inhabitants to Dacheng.',
    'Bobo attacked Yao Shoudu at Qingshui. Shoudu fled to Shanggui, and Bobo resettled sixteen thousand six hundred of the local people in Dacheng.',
  ],
  s0082: [
    'That year Qi Nan and Yao Guangdu plotted rebellion; both were executed.',
    'That year Qi Nan and Yao Guangdu plotted revolt, and both were put to death.',
  ],
  s0083: [
    'Yao Xing\'s general Yao Xiang abandoned Sancheng and fled south to Dasu.',
    'Yao Xing\'s general Yao Xiang abandoned Sancheng and fled south to Dasu.',
  ],
  s0084: [
    'Bobo sent his general Pingdong Luyiyu to intercept him on the road, captured Xiang, and took all his followers prisoner.',
    'Bobo sent General Pingdong Luyiyu to cut him off, seized Yao Xiang, and captured his entire force.',
  ],
  s0085: [
    'When Xiang arrived, Bobo rebuked him and beheaded him.',
    'When Yao Xiang was brought in, Bobo denounced him and had him executed.',
  ],
  s0086: [
    'That year Bobo led thirty thousand horsemen to attack Anding and fought Yao Xing\'s general Yang Fusong on the north plain of Qing Shi, defeated him, received the submission of forty-five thousand of his followers, and captured twenty thousand horses.',
    'That year Bobo led thirty thousand cavalry against Anding and on the north plain of Qing Shi defeated Yao Xing\'s general Yang Fusong, accepted the surrender of forty-five thousand of his men, and took twenty thousand horses.',
  ],
  s0087: [
    'Advancing, he attacked Yao Xing\'s general Dang Zhilong at Dongxiang, received his surrender, appointed Zhilong Grand Master of Splendid Happiness, and moved more than three thousand of his households to Ercheng.',
    'He pushed on against Dang Zhilong at Dongxiang, accepted his surrender, made him Grand Master of Splendid Happiness, and resettled more than three thousand of his households at Ercheng.',
  ],
  s0088: [
    'Wang Maide, Adjutant to Yao Xing\'s northern garrison commander, came over to Bobo.',
    'Wang Maide, staff officer to Yao Xing\'s northern frontier command, defected to Bobo.',
  ],
  s0089: [
    'Bobo said to Maide, "I am a descendant of Yu the Great; for generations my house has dwelt in You and Shuofang.',
    'Bobo told Wang Maide, "I am descended from Yu the Great. My forebears have long held the northern lands.',
  ],
  s0090: [
    'Our ancestors, heavy with glory, were constantly rival states to Han and Wei.',
    'In their days of power they stood as equals to Han and Wei.',
  ],
  s0091: [
    'In the middle generations they could not contend and fell under the control of others.',
    'Later generations could not keep pace and were forced to serve others.',
  ],
  s0092: [
    'Now that I am unworthy and cannot continue and enlarge what my ancestors built, my state is destroyed and my family lost, and I have wandered as a captive in exile.',
    'I have lacked the strength to restore what my fathers built. My kingdom was broken, my house was ruined, and I was driven into exile as a captive.',
  ],
  s0093: [
    'Now I am about to rise with the times and restore the enterprise of Yu the Great—what do you think of this?',
    'Now I mean to rise with fortune and renew the work of Yu the Great. What do you say to that?',
  ],
  s0094: [
    'Maide said, "Since the Jin lost the mandate and the sacred vessel moved south, heroes have stood like mountain peaks and every man has harbored the thought of seizing the throne—how much more so when Your Majesty, generation after generation bearing virtue, has restored glory in the northern wilds, with divine martial prowess surpassing the Han emperors and sage strategy exceeding the Wei founders—yet would you not, at heaven\'s opening moment, complete the great enterprise!',
    'Wang Maide answered, "Since Jin lost the mandate and the imperial regalia went south, strong men have risen on every side and every heart has turned toward the throne. Your Majesty carries merit through many generations and has brought light again to the northern frontier. Your warlike genius outshines the Han emperors and your design surpasses the founders of Wei. How can heaven\'s moment pass without your completing the great work?',
  ],
  s0095: [
    'Though Qin\'s government is now in decline, its frontier garrisons are still firm—I deeply wish that you would gather strength and wait for the right time, plan carefully, and then act.',
    'Qin\'s power may be fading, but its border commands still hold. I beg Your Majesty to store up strength, watch the hour, and move only after careful planning.',
  ],
  s0096: [
    'Bobo approved of this and appointed him Military Adviser Commandant.',
    'Bobo was pleased and made him Military Adviser Commandant.',
  ],
  s0097: [
    'He thereupon amnestied his territory, changed the era name to Fengxiang, put Chigan Ali in charge as Director of Palace Construction, and mobilized one hundred thousand barbarian and Han people north of the mountains to build a capital on the north bank of the Shuofang River and south of the Black Water.',
    'He proclaimed another amnesty, changed the era name to Fengxiang, appointed Chigan Ali Director of Palace Construction, and drafted one hundred thousand tribesmen and settlers north of the ridges to raise a capital on the north bank of the Shuofang River and south of the Black Water.',
  ],
  s0098: [
    'Bobo himself said, "I am just now about to unify the realm and rule the myriad states—it can be named Tongwan.',
    'Bobo declared, "I mean to unite the realm and rule every land under heaven. Let the city be called Tongwan—Unified Ten Thousand.',
  ],
  s0099: [
    'Ali was especially skilled in craftsmanship, yet cruel, harsh, and violent; he steamed earth to build the walls, and if a probe sank one cun into the wall, he killed the builder and had the body built into the wall together with the earth.',
    'Ali was a master craftsman but savage by nature. He steamed earth to raise the walls, and whenever an awl sank one inch into the masonry he killed the builder and built the corpse into the wall along with the earth.',
  ],
  s0100: [
    'Bobo considered this loyalty and therefore entrusted him with the task of construction.',
    'Bobo took this for loyalty and therefore put him in charge of building the city.',
  ],
};

const path = '/workspace/translations/current_translation_jinshu.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

let updated = 0;
for (const s of data.sentences) {
  const entry = T[s.id];
  if (entry) {
    s.literal = entry[0];
    s.idiomatic = entry[1];
    updated++;
  }
}

fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');

const expected = 100;
const missing = Object.keys(T).length;
console.log(`Applied ${updated} of ${expected} sentences (T has ${missing} entries)`);
if (updated !== expected) {
  process.exitCode = 1;
}
