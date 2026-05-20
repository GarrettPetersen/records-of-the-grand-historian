#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0001: {
    literal:
      'Taizong, Part One: Taizong, Emperor Wenwu the Great Sage, Greatly Broad and Filial, bore the taboo personal name Shimin; he was Gaozu\'s second son.',
    idiomatic:
      'Taizong, Part One. Taizong, posthumously styled Emperor Wenwu the Great Sage, Greatly Broad and Filial, bore the taboo name Shimin and was Gaozu\'s second son.',
  },
  s0002: {
    literal: 'His mother was Empress Taimu the Shunsheng, née Dou.',
    idiomatic: 'His mother was Empress Taimu the Shunsheng of the Dou clan.',
  },
  s0003: {
    literal:
      'In the twelfth month, day wuwu, of the eighteenth year of Kaihuang of Sui, he was born at the detached lodge in Wugong.',
    idiomatic:
      'On wuwu of the twelfth month in the eighteenth year of Sui Kaihuang, he was born at the detached lodge in Wugong.',
  },
  s0004: {
    literal: 'At the time two dragons sported outside the lodge gate; after three days they departed.',
    idiomatic: 'At that time two dragons were seen sporting outside the lodge gate; after three days they vanished.',
  },
  s0005: {
    literal: 'When Gaozu took up his post at Qizhou, Taizong was then four years old.',
    idiomatic: 'When Gaozu assumed office at Qizhou, Taizong was four years old.',
  },
  s0006: {
    literal:
      'A scholar who styled himself skilled in physiognomy called on Gaozu and said, "Your Excellency is a man of rank, and moreover you have a noble son.',
    idiomatic:
      'A scholar claiming skill in physiognomy called on Gaozu and said, "Your Excellency is a man of eminent rank, and you have a son who will be still greater.',
  },
  s0007: {
    literal:
      '" Seeing Taizong, he said, "Dragon-and-phoenix bearing, a countenance like heaven and sun; when his years approach twenty, he will surely save the age and bring peace to the people.',
    idiomatic:
      '" When he saw Taizong, he said, "He has the bearing of dragon and phoenix and a countenance like heaven and sun. When his years approach twenty, he will surely save the realm and bring peace to the people.',
  },
  s0008: {
    literal:
      '" Gaozu feared his words would leak out and was about to kill him, but the man suddenly vanished; he therefore took the sense of "saving the age and bringing peace to the people" as his name.',
    idiomatic:
      '" Gaozu feared the prophecy would leak out and was about to have him killed, but the man vanished without trace; Gaozu therefore drew on the phrase "save the age and bring peace to the people" and gave him the name.',
  },
  s0009: {
    literal:
      'In youth Taizong was clever and keen, with far-reaching insight; at a crisis he was resolute, heedless of small points—men of the time could not fathom him.',
    idiomatic:
      'As a youth Taizong was clever and penetrating, with vision that ran deep; in crisis he acted with decision and scorned petty scruples—contemporaries could not take his measure.',
  },
  s0010: {
    literal:
      'At the end of the Daye era, when Emperor Yang at Yanmen was besieged by the Turks, Taizong answered the call for relief and was attached to the camp of Garrison Guard General Yun Dingxing.',
    idiomatic:
      'Late in the Daye reign, when Emperor Yang was besieged by the Turks at Yanmen, Taizong answered the call for relief and served under Garrison Guard General Yun Dingxing.',
  },
  s0011: {
    literal: 'As he was about to march, he said to Dingxing, "You must carry banners and drums to set up a decoy force.',
    idiomatic: 'Before marching, he told Dingxing, "You must bring banners and drums to stage a feint.',
  },
  s0012: {
    literal:
      'Moreover, Shibi Khagan has led the whole nation\'s army and dared to encircle the Son of Heaven; he must think the state has no aid in sudden peril.',
    idiomatic:
      'Shibi Khagan has thrown the whole nation into this campaign and dared to hem in the Son of Heaven; he surely believes the court has no sudden help at hand.',
  },
  s0013: {
    literal:
      'If we display a great host, with banners and flags strung for tens of li, and at night let gongs and drums answer one another, the barbarians will surely think relief has massed in clouds and flee at the mere sight of dust.',
    idiomatic:
      'If we parade a vast host—banners and flags unbroken for tens of li, gongs and drums answering through the night—the enemy will take it for clouds of relief troops and flee at the first whiff of dust.',
  },
  s0014: {
    literal: 'Otherwise, with their numbers against our few, if they bring the whole army to battle, we surely cannot hold.',
    idiomatic: 'Otherwise, outnumbered, if they throw their full strength into battle, we cannot stand.',
  },
  s0015: {
    literal: '" Dingxing followed this counsel.',
    idiomatic: '" Dingxing did as he advised.',
  },
  s0016: {
    literal:
      'When the army halted at Guo County, Turkic scouts galloped to tell Shibi, "The royal army has arrived in great force."',
    idiomatic:
      'When the army reached Guo County, Turkic scouts galloped to Shibi with word that the imperial host had arrived in strength.',
  },
  s0017: {
    literal: 'Thereupon the siege was lifted and they fled.',
    idiomatic: 'The Turks thereupon broke the siege and withdrew.',
  },
  s0018: {
    literal: 'When',
    idiomatic: 'Later, when',
  },
  s0019: {
    literal: 'Gaozu was holding Taiyuan, Taizong was then eighteen.',
    idiomatic: 'Gaozu was garrisoning Taiyuan, Taizong was eighteen.',
  },
  s0020: {
    literal:
      'There was a Gaoyang bandit chieftain, Wei Dao\'er, who styled himself Lishan Fei.',
    idiomatic:
      'A Gaoyang bandit chieftain, Wei Dao\'er, styled himself Lishan Fei.',
  },
  s0021: {
    literal: 'He came to attack Taiyuan; Gaozu struck back and drove deep into the rebel lines.',
    idiomatic: 'He attacked Taiyuan; Gaozu counterattacked and plunged deep into the rebel formation.',
  },
  s0022: {
    literal:
      'Taizong with light cavalry broke through the encirclement and advanced, shooting; wherever he turned, the enemy scattered, and he pulled Gaozu from amid ten thousand men.',
    idiomatic:
      'Taizong led light cavalry through the encirclement, shooting as he charged; wherever he turned the enemy broke, and he drew Gaozu out from amid ten thousand men.',
  },
  s0023: {
    literal:
      'Just then the infantry arrived; Gaozu and Taizong struck again with fury and routed them utterly.',
    idiomatic:
      'Just then the foot soldiers came up; Gaozu and Taizong attacked again with fury and won a great victory.',
  },
  s0024: {
    literal:
      'By then the Sui mandate was spent; Taizong secretly plotted a righteous rising. He humbled himself to win scholars, spent wealth to keep clients—great bandits and wandering swordsmen all wished to die for him.',
    idiomatic:
      'The Sui mandate was already spent; Taizong secretly planned a righteous uprising. He lowered himself to win men of talent, spent his wealth to keep clients—outlaws and wandering champions alike were ready to die for him.',
  },
  s0025: {
    literal: 'When the righteous army rose, he led troops to seize and subdue Xihe and took it.',
    idiomatic: 'When the righteous army rose, he led troops to overrun Xihe and captured it.',
  },
  s0026: {
    literal:
      'He was appointed Right Army Commander-in-chief; the three right armies were all placed under him, and he was enfeoffed as Duke of Dunhuang.',
    idiomatic:
      'He was made Right Army Commander-in-chief, with all three right armies under his command, and enfeoffed as Duke of Dunhuang.',
  },
  s0027: {
    literal:
      'As the main army marched west to Jiahu Fort, Sui general Song Laosheng led twenty thousand picked troops to camp at Huoyi and block the righteous army.',
    idiomatic:
      'As the main host marched west toward Jiahu Fort, Sui general Song Laosheng led twenty thousand elite troops to Huoyi to block the righteous army.',
  },
  s0028: {
    literal:
      'Prolonged rain had exhausted the grain; Gaozu and Pei Ji debated withdrawing to Taiyuan to plan another attempt.',
    idiomatic:
      'Endless rain had exhausted their grain; Gaozu and Pei Ji debated falling back to Taiyuan to try again later.',
  },
  s0029: {
    literal:
      'Taizong said, "We raised a great cause to save the black-haired people; we must first enter Xianyang and command the realm;',
    idiomatic:
      'Taizong said, "We took up arms to save the people; we must first enter Xianyang and command the realm.',
  },
  s0030: {
    literal:
      'if at the first small enemy we turn back, I fear those who joined the cause will dissolve in a morning.',
    idiomatic:
      'If we retreat at the first small foe, those who joined us will scatter overnight.',
  },
  s0031: {
    literal:
      'To hold only the ground of Taiyuan city makes us mere bandits—how can we preserve ourselves!"',
    idiomatic:
      'Holding one city at Taiyuan would make us nothing but bandits—how could we survive?"',
  },
  s0032: {
    literal: '" Gaozu did not accept this and urgently ordered the army to withdraw.',
    idiomatic: '" Gaozu would not listen and ordered a prompt withdrawal.',
  },
  s0033: {
    literal: 'Taizong then wept aloud outside the tent until the sound reached within.',
    idiomatic: 'Taizong wept outside the tent until his voice carried inside.',
  },
  s0034: {
    literal:
      'Gaozu summoned him and asked why; he replied, "Now the army moves on righteousness; if we advance we are sure to win, if we retreat we are sure to scatter.',
    idiomatic:
      'Gaozu called him in and asked why; he answered, "The army marches on righteousness now—advance and we win, retreat and we scatter.',
  },
  s0035: {
    literal:
      'The host scatters before us and the enemy presses from behind—death comes in an instant; that is why I grieve."',
    idiomatic:
      'Our men will break before us and the enemy will strike from behind—death in an instant. That is why I weep."',
  },
  s0036: {
    literal: '" Gaozu then understood and halted.',
    idiomatic: '" Gaozu understood and called off the retreat.',
  },
  s0037: {
    literal: 'On jimao of the eighth month the rain cleared; Gaozu led the army toward Huoyi.',
    idiomatic: 'On jimao of the eighth month the skies cleared; Gaozu marched on Huoyi.',
  },
  s0038: {
    literal:
      'Taizong feared Laosheng would not come out to fight; he took several horsemen ahead to the foot of the wall, raised his whip and gestured as if to invest the city, to provoke him.',
    idiomatic:
      'Fearing Laosheng would not sally forth, Taizong rode ahead with a few horsemen to the wall, gestured with his whip as though to invest the city, and goaded him into battle.',
  },
  s0039: {
    literal: 'Laosheng was indeed enraged, opened the gate and sent out troops, and drew up his battle line with his back to the wall.',
    idiomatic: 'Laosheng took the bait, opened the gates, and formed his line with the wall at his back.',
  },
  s0040: {
    literal:
      'Gaozu and Jiancheng joined battle lines east of the city; Taizong and Chai Shao formed lines south of the city.',
    idiomatic:
      'Gaozu and Jiancheng drew up east of the city; Taizong and Chai Shao south of it.',
  },
  s0041: {
    literal:
      'Laosheng waved his troops forward in haste; they first pressed Gaozu, and Jiancheng fell from his horse; Laosheng seized the chance—Gaozu\'s and Jiancheng\'s forces all fell back.',
    idiomatic:
      'Laosheng drove his men forward; they first bore down on Gaozu. Jiancheng was thrown from his horse, and Laosheng pressed the advantage—Gaozu\'s and Jiancheng\'s lines gave way.',
  },
  s0042: {
    literal:
      'Taizong from the southern heights led two horsemen charging down the steep slope, cut through the enemy army, led his troops in fierce attack, and the rebels were utterly routed, each casting aside weapons and fleeing.',
    idiomatic:
      'Taizong swept down the southern heights with two horsemen, smashed through the enemy line, and led a furious charge; the rebels broke completely, casting aside weapons as they fled.',
  },
  s0043: {
    literal:
      'The drawbridge was raised; Laosheng tried to haul himself up by rope, but was beheaded; Huoyi was pacified.',
    idiomatic:
      'The drawbridge rose; Laosheng tried to climb the rope but was cut down; Huoyi fell.',
  },
  s0044: {
    literal: 'Reaching the east of the River, the bold men of Guanzhong vied to join the cause.',
    idiomatic: 'When they reached the east of the River, Guanzhong\'s champions hurried to the cause.',
  },
  s0045: {
    literal:
      'Taizong asked to advance into the Pass, take Yongfeng Granary to relieve the destitute, gather the bandits to aim at the capital—Gaozu praised this.',
    idiomatic:
      'Taizong asked leave to enter the Pass, seize Yongfeng Granary to feed the hungry, and rally the outlaws against the capital; Gaozu approved.',
  },
  s0046: {
    literal: 'Taizong with the vanguard crossed the river and first secured the north of the Wei.',
    idiomatic: 'Taizong crossed first with the vanguard and secured the north bank of the Wei.',
  },
  s0047: {
    literal:
      'Officials and people of the Three Adjuncts and all manner of local strongmen who came to the camp gate to offer service numbered thousands a day; old and young filled his command.',
    idiomatic:
      'Each day thousands of officials, commoners, and local strongmen of the Three Adjuncts came to his gate to serve—old and young crowding under his banner.',
  },
  s0048: {
    literal:
      'He gathered outstanding men to fill his staff; those who heard of him from afar all entrusted themselves to him.',
    idiomatic:
      'He gathered able men for his staff; all who heard of him from afar came to his side.',
  },
  s0049: {
    literal:
      'The army halted at Jingyang with ninety thousand effectives, defeated the Hu bandit Liu Yaozi, and absorbed his followers.',
    idiomatic:
      'Halting at Jingyang with ninety thousand fighting men, he defeated the Hu bandit Liu Yaozi and took his force into his own.',
  },
  s0050: {
    literal: 'He left Yin Kaishan and Liu Hongji to garrison the old city of Chang\'an.',
    idiomatic: 'He left Yin Kaishan and Liu Hongji to hold the old walls of Chang\'an.',
  },
  s0051: {
    literal:
      'Taizong himself pressed on to Sizhu; bandit chiefs Li Zhongwen, He Panren, Xiang Shanzi, and others all came to join him. He encamped at Acheng and gathered a hundred and thirty thousand troops.',
    idiomatic:
      'Taizong pressed on to Sizhu; bandit chiefs Li Zhongwen, He Panren, Xiang Shanzi, and others joined him. He camped at Acheng with a hundred and thirty thousand men.',
  },
  s0052: {
    literal:
      'Chang\'an elders who brought oxen and wine to his standard gate could not be counted; he thanked them and sent them away, accepting nothing.',
    idiomatic:
      'Countless Chang\'an elders brought oxen and wine to his camp; he thanked them and sent them away, taking nothing.',
  },
  s0053: {
    literal: 'Army discipline was stern; not the slightest thing was taken.',
    idiomatic: 'Discipline was iron; not a hair of the people was touched.',
  },
  s0054: {
    literal: 'Soon afterward he joined the main army in pacifying the capital.',
    idiomatic: 'Soon he joined the main host in taking the capital.',
  },
  s0055: {
    literal:
      'When Gaozu served as regent, Taizong received the post of Director of the Secretariat for the State of Tang and was transferred to Duke of Qin.',
    idiomatic:
      'While Gaozu acted as regent, Taizong became Director of the Secretariat for the State of Tang and was raised to Duke of Qin.',
  },
  s0056: {
    literal:
      'When Xue Ju came with a hundred thousand crack troops to press the Wei shore, Taizong met him in person, routed his host, pursued and slew more than ten thousand, and carried the frontier to Longdi.',
    idiomatic:
      'When Xue Ju brought a hundred thousand crack troops to the Wei, Taizong met him in person, shattered his army, cut down more than ten thousand in pursuit, and carried the frontier to Longdi.',
  },
  s0057: {
    literal:
      'In the twelfth month of the first year of Yining, he was again made Right Grand Marshal and commanded a hundred thousand troops to overrun the Eastern Capital.',
    idiomatic:
      'In the twelfth month of Yining 1 he was again Right Grand Marshal, commanding a hundred thousand men against the Eastern Capital.',
  },
  s0058: {
    literal: 'As he was about to turn back, he told those beside him, "When the rebels see us return, they will surely pursue.',
    idiomatic: 'Before turning back he told his staff, "When the enemy sees us withdraw, they will surely give chase.',
  },
  s0059: {
    literal: '" He set three ambushes to await them.',
    idiomatic: '" He laid three ambushes to receive them.',
  },
  s0060: {
    literal:
      'Before long Sui general Duan Da led more than ten thousand men up from the rear; when they reached Sanwang Mound the ambush struck and Da was utterly defeated; the pursuit ran to the city wall.',
    idiomatic:
      'Soon Sui general Duan Da came from behind with more than ten thousand men; at Sanwang Mound the ambush sprang and Da was shattered; pursuit carried to the walls.',
  },
  s0061: {
    literal:
      'He then established the two prefectures of Xiong and Gu in Yiyang and Xin\'an and garrisoned them before returning.',
    idiomatic:
      'He then set up the prefectures of Xiong and Gu at Yiyang and Xin\'an, left garrisons, and returned.',
  },
  s0062: {
    literal: 'His enfeoffment was changed to Duke of Zhao.',
    idiomatic: 'He was transferred to Duke of Zhao.',
  },
  s0063: {
    literal:
      'When Gaozu received the abdication, Taizong was appointed Director of the Secretariat and Right Martial Guard Grand General; he was advanced to Prince of Qin and additionally made Governor of Yong Prefecture.',
    idiomatic:
      'When Gaozu took the throne, Taizong became Director of the Secretariat and Right Martial Guard Grand General, was advanced to Prince of Qin, and made Governor of Yong.',
  },
  s0064: {
    literal:
      'In the seventh month of the first year of Wude, Xue Ju raided Jing Prefecture; Taizong led troops against him, met ill fortune, and withdrew.',
    idiomatic:
      'In the seventh month of Wude 1, Xue Ju raided Jing Prefecture; Taizong marched against him, fared badly, and withdrew.',
  },
  s0065: {
    literal: 'In the ninth month Xue Ju died; his son Rengao succeeded him.',
    idiomatic: 'In the ninth month Xue Ju died; his son Rengao took his place.',
  },
  s0066: {
    literal:
      'Taizong was again made Grand Marshal to strike Rengao; they faced each other at Zheyu Fort for more than sixty days behind deep ditches and high ramparts.',
    idiomatic:
      'Taizong was again Grand Marshal against Rengao; for more than sixty days they faced each other at Zheyu behind deep trenches and high walls.',
  },
  s0067: {
    literal:
      'The rebel host numbered more than a hundred thousand; their edge was keen and they came repeatedly to offer battle; Taizong held his armor to wear them down.',
    idiomatic:
      'The rebels numbered more than a hundred thousand, keen and bold, challenging battle again and again; Taizong kept his men under cover to break their spirit.',
  },
  s0068: {
    literal: 'When the rebels\' grain was spent, their generals Mou Jun\'ai and Liang Hulang came over.',
    idiomatic: 'When their grain ran out, generals Mou Jun\'ai and Liang Hulang defected.',
  },
  s0069: {
    literal: 'Taizong told the generals, "Their spirit is spent; I shall take them."',
    idiomatic: 'Taizong told his commanders, "Their spirit is broken; I will finish them."',
  },
  s0070: {
    literal:
      '" He sent General Pang Yu to form a line south of Qianshui Plain to lure them; rebel general Zong Luohou joined his whole army to resist, and Yu\'s force nearly collapsed.',
    idiomatic:
      '" He sent Pang Yu to draw them on south of Qianshui Plain; rebel general Zong Luohou brought his full host to meet him, and Yu nearly broke.',
  },
  s0071: {
    literal:
      'Then Taizong personally led the main army, sweeping down from the north of the plain to take them unawares.',
    idiomatic:
      'Then Taizong led the main host himself, sweeping from the north of the plain to strike where they did not expect.',
  },
  s0072: {
    literal: 'When Luohou saw this, he wheeled his army back to resist.',
    idiomatic: 'Luohou saw him and turned back to meet the blow.',
  },
  s0073: {
    literal:
      'Taizong led several dozen of his finest horsemen into the rebel lines; then the royal army struck from within and without together—Luohou was utterly routed, several thousand heads were taken, and those who plunged into ravines and gullies could not be counted.',
    idiomatic:
      'Taizong plunged in with several dozen of his finest horsemen; the imperial line struck from every side at once. Luohou\'s host collapsed; thousands were slain, and the dead choked the ravines beyond counting.',
  },
  s0074: {
    literal:
      'Taizong with some twenty horsemen at his side pursued the rout straight to Zheyu to press the advantage.',
    idiomatic:
      'With barely twenty horsemen at his side, Taizong chased the rout straight to Zheyu to press the kill.',
  },
  s0075: {
    literal: 'Rengao was greatly afraid and shut himself in the city to defend it.',
    idiomatic: 'Rengao was terrified and walled himself in.',
  },
  s0076: {
    literal: 'Toward evening the main army came up and invested the city on all sides.',
    idiomatic: 'By evening the main host arrived and ringed the city.',
  },
  s0077: {
    literal:
      'At dawn Rengao asked to surrender; they captured more than ten thousand of his crack troops and fifty thousand men and women.',
    idiomatic:
      'At dawn Rengao surrendered; they took more than ten thousand of his best troops and fifty thousand men and women captive.',
  },
  s0078: {
    literal:
      'Then the generals offered congratulations and asked, "At first Your Highness broke the rebels in field battle, yet their lord still held a stout city; Your Highness had no siege engines, yet with light cavalry you galloped in pursuit, not waiting for the foot soldiers, and pressed straight to the wall—all doubted you could take it, yet you did. Why?"',
    idiomatic:
      'The generals then congratulated him and asked, "Your Highness shattered them in the field, yet their lord still held a strong city; you had no engines of siege, yet with light horse you raced in pursuit without waiting for the foot, and pressed straight to the walls—we doubted you could take it, yet you did. How?"',
  },
  s0079: {
    literal:
      'Taizong said, "This was to press them by expedient so their plans had no time to form; that is why we took it.',
    idiomatic:
      'Taizong said, "I pressed them by stratagem so their plans never had time to form—that is how we took it.',
  },
  s0080: {
    literal:
      'Luohou relied on victories in former years and had long been sharpening his edge; seeing that we did not come out, he meant to hold us cheap.',
    idiomatic:
      'Luohou trusted his old victories and had long been resting on his steel; seeing us hold back, he thought little of us.',
  },
  s0081: {
    literal:
      'Now, pleased that we had come out, he brought his whole army to battle; though we broke them, captures and kills were still few.',
    idiomatic:
      'When he saw us advance, he threw his whole strength into battle; though we broke him, few were killed or taken.',
  },
  s0082: {
    literal:
      'If we did not press the pursuit at once and they fled back to the city for Rengao to gather and comfort them, we could not have had them so soon.',
    idiomatic:
      'Had we not pressed hard at once, they would have fled back to the city for Rengao to rally and steady them, and the prize would have slipped away.',
  },
  s0083: {
    literal:
      'Moreover, his soldiers were all men of Longxi; once beaten they would scatter in flight without looking back, drifting beyond Long; then Zheyu would stand empty, and as our army pressed close behind, that is why he was afraid and surrendered.',
    idiomatic:
      'And his men were Longxi men—once broken they would flee without a backward glance, scattering beyond Long, leaving Zheyu empty; our host pressed on their heels, and that is why he surrendered in fear.',
  },
  s0084: {
    literal: 'This was a settled plan—did you all not see it?"',
    idiomatic: 'It was a settled plan—did none of you see it?"',
  },
  s0085: {
    literal: '" The generals said, "This is beyond what an ordinary man could reach."',
    idiomatic: '" The generals said, "No ordinary man could have done this."',
  },
  s0086: {
    literal:
      '" They had taken many of the rebels\' finest horsemen; Taizong sent Rengao\'s brothers and the rebel chiefs Zong Luohou, Zhai Changsun, and others to lead them.',
    idiomatic:
      '" They had taken many of the enemy\'s best horse; Taizong put Rengao\'s brothers and chiefs Zong Luohou, Zhai Changsun, and others in command of them.',
  },
  s0087: {
    literal:
      'Taizong hunted and shot with them in the open field without the least reserve.',
    idiomatic:
      'Taizong rode to hunt and shoot with them in the open without reserve.',
  },
  s0088: {
    literal:
      'The rebels, grateful and awed, all wished to die for him.',
    idiomatic:
      'Bound by gratitude and fear, the captives were ready to die for him.',
  },
  s0089: {
    literal:
      'At that time Li Mi had just submitted; Gaozu ordered Mi to dispatch a fast courier to welcome Taizong at Bin Prefecture.',
    idiomatic:
      'Li Mi had just submitted; Gaozu sent him with a fast courier to welcome Taizong at Bin.',
  },
  s0090: {
    literal:
      'Mi saw Taizong\'s heaven-sent bearing and stern military majesty, was startled and sighed in admiration, and privately told Yin Kaishan, "A true hero-emperor.',
    idiomatic:
      'Mi saw Taizong\'s bearing—heaven-sent, his host iron-disciplined—and was shaken to admiration; privately he told Yin Kaishan, "This is a true hero-emperor.',
  },
  s0091: {
    literal: 'Were he not such, how could the age\'s calamities be settled?"',
    idiomatic: 'Without such a man, how could this chaos ever be stilled?"',
  },
  s0092: {
    literal: '" Returning in triumph, he presented the victory at the Imperial Ancestral Temple.',
    idiomatic: '" On his triumphant return he reported victory at the Imperial Ancestral Temple.',
  },
  s0093: {
    literal:
      'He was appointed Grand Commandant, Director of the Secretariat for the Shaan-dong Circuit, garrisoned Changchun Palace, and all troops east of the Pass were placed under his command.',
    idiomatic:
      'He was made Grand Commandant and Director of the Secretariat for the Shaan-dong Circuit, garrisoned Changchun Palace, and all armies east of the Pass answered to him.',
  },
  s0094: {
    literal: 'Soon he was additionally made Left Martial Guard Grand General and Overall Commander of Liang Prefecture.',
    idiomatic: 'Soon he was also Left Martial Guard Grand General and Overall Commander of Liang.',
  },
  s0095: {
    literal: 'When Song Jingang took Fen Prefecture, his military edge was keen.',
    idiomatic: 'When Song Jingang seized Fen Prefecture, his armies were at their sharpest.',
  },
  s0096: {
    literal:
      'Gaozu, with Wang Xingben still holding Pu Prefecture and Lü Chongmao in revolt at Xia County, with Jin and Fen falling in turn and Guanzhong shaken, wrote in his own hand: "The rebels\' power is such that it is hard to meet their edge; we should abandon the lands east of the River and guard only the Pass west."',
    idiomatic:
      'Wang Xingben still held Pu, Lü Chongmao had risen at Xia, Jin and Fen had fallen in turn, and Guanzhong trembled; Gaozu wrote in his own hand, "The enemy is too strong to meet head-on—we should yield the east of the River and hold only the west of the Pass."',
  },
  s0097: {
    literal:
      'Taizong memorialized: "Taiyuan is the base of the royal enterprise, the root of the state; Hedong is rich and solid, the sustenance of the capital.',
    idiomatic:
      'Taizong memorialized, "Taiyuan is where our house was founded, the root of the realm; Hedong is rich and feeds the capital.',
  },
  s0098: {
    literal: 'To raise it up and then cast it away—I, your servant, burn with resentment.',
    idiomatic: 'To win it and then throw it away—I cannot bear the thought.',
  },
  s0099: {
    literal:
      'I beg for thirty thousand picked troops; I will surely destroy Wu Zhou and recover Fen and Jin."',
    idiomatic:
      'Give me thirty thousand picked men, and I will destroy Wu Zhou and win back Fen and Jin."',
  },
  s0100: {
    literal:
      'Gaozu thereupon sent out all the troops of Guanzhong to reinforce him, and in person went to Changchun Palace to see Taizong off.',
    idiomatic:
      'Gaozu then sent every soldier Guanzhong could spare to strengthen him, and went in person to Changchun Palace to see him off.',
  },
};

const path = 'translations/current_translation_jiutangshu.json';
const data = JSON.parse(readFileSync(path, 'utf8'));
if (data.metadata.chapter !== '002') {
  throw new Error(`Expected chapter 002, got ${data.metadata.chapter}`);
}
let applied = 0;
for (const s of data.sentences) {
  const pair = T[s.id];
  if (!pair) continue;
  if (pair.literal === pair.idiomatic) {
    throw new Error(`${s.id}: literal and idiomatic must differ`);
  }
  s.literal = pair.literal;
  s.idiomatic = pair.idiomatic;
  applied++;
}
writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', applied, 'translations (expected', Object.keys(T).length, ')');
