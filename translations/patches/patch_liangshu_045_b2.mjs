#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'Thereupon he led the armies in advance to Jiushui.',
    'He then led the armies forward to Jiushui.',
  ],
  s0102: [
    'The bandit false Commissioner Fan Xirong and Lu Huilue still held Tuncheng; when Sengbian\'s army arrived, Xirong and the others took the Prince of Lincheng, governor of Jiangzhou, and abandoned the city in flight.',
    'Fan Xirong and Lu Huilue still held Tuncheng; when Sengbian came, they seized the Prince of Lincheng, Jiangzhou governor, and fled the city.',
  ],
  s0103: [
    'The Heir added Sengbian as palace attendant, Minister President, and General Who Conquers the East, granting one set of martial music.',
    'The Heir added palace attendant, Minister President, and General Who Conquers the East, with one set of martial music.',
  ],
  s0104: [
    'He still ordered Sengbian to halt at Jiangzhou until the armies gathered, then advance when the time came.',
    'He still ordered Sengbian to halt at Jiangzhou until the armies gathered, then advance in season.',
  ],
  s0105: [
    'Before long the Heir ordered all Jiangzhou troops to join the great advance together; Sengbian then memorialized the emperor\'s grievous news and announced it at Jiangling.',
    'Before long the Heir ordered all Jiangzhou troops on the great advance; Sengbian memorialized the emperor\'s death and announced it at Jiangling.',
  ],
  s0106: [
    'He still led more than a hundred great generals in joint memorial urging the Heir to take the throne;',
    'He led more than a hundred great generals in joint memorial urging the Heir to the throne;',
  ],
  s0107: [
    'when he was about to march he again presented a memorial.',
    'when he was about to march he again memorialized.',
  ],
  s0108: [
    'Though he was not followed, all received gracious replies.',
    'Though not followed, all received gracious replies.',
  ],
  s0109: [
    'The matter is recorded in the Basic Annals.',
    'The matter is in the Basic Annals.',
  ],
  s0110: [
    'Sengbian then set out from Jiangzhou straight for Jiankang; he first ordered the governor of South Yangzhou Hou Tian to lead crack troops in light boats to strike the garrisons at Nanling, Quetou, and others—they were taken as soon as he arrived.',
    'Sengbian set out from Jiangzhou straight for Jiankang; he first ordered South Yangzhou\'s Hou Tian with crack troops in light boats to strike Nanling, Quetou, and other garrisons—they fell at once.',
  ],
  s0111: [
    'Earlier Chen Baxian had led fifty thousand men out from the southern river; the vanguard five thousand reached Tunkou.',
    'Earlier Chen Baxian had led fifty thousand from the southern river; five thousand vanguard reached Tunkou.',
  ],
  s0112: [
    'Baxian was bold and full of stratagems; his fame overshadowed Sengbian, and Sengbian feared him.',
    'Baxian was bold and full of stratagems; his fame overshadowed Sengbian, who feared him.',
  ],
  s0113: [
    'When he reached Tunkou he met Sengbian at White Reed Ford; they ascended the altar and swore alliance.',
    'At Tunkou he met Sengbian at White Reed Ford; they ascended the altar and swore alliance.',
  ],
  s0114: [
    'Baxian drafted the text, saying: "The traitor minister Hou Jing, a vicious Di and petty barbarian, rebels against Heaven without measure and contrives wickedness and evil;',
    'Baxian drafted the text: "The traitor Hou Jing, a vicious Di and petty barbarian, rebels against Heaven without measure and contrives wickedness;',
  ],
  s0115: [
    'he has betrayed our grace and righteousness, plundered our state, poisoned our living people, and overturned and ruined our altars.',
    'he betrayed our grace, plundered our state, poisoned our people, and overturned our altars.',
  ],
  s0116: [
    'Our High Ancestor the Martial Emperor was numinous and wise, his light dwelling over all under Heaven; he toiled for the myriad peoples and nurtured the ten thousand folk like father and mother—for fifty years.',
    'Our High Ancestor the Martial Emperor was numinous and wise, his light over all Heaven; he toiled for the myriad peoples and nurtured the ten thousand like father and mother—for fifty years.',
  ],
  s0117: [
    'Pitying Jing who came in extremity he received him back; fully sparing Jing from the head that would be struck, he placed Jing in a vital position and heaped on him glory beyond his rank.',
    'Pitying Jing in extremity he took him in; fully sparing him from execution, he placed Jing in a vital post and heaped unmerited glory on him.',
  ],
  s0118: [
    'How were our High Ancestor and Jing ever shallow toward each other?',
    'What did our High Ancestor ever owe Jing?',
  ],
  s0119: [
    'What grievance had our common people against Jing?',
    'What grievance had our people against Jing?',
  ],
  s0120: [
    'Yet Jing with long halberd and strong crossbow pressed and crushed the court, sawed at the suburbs, and devoured those who bore spirit.',
    'Yet Jing with long halberd and strong crossbow pressed the court, sawed at the suburbs, and devoured the living.',
  ],
  s0121: [
    'He flayed livers and chopped toes and did not think it enough pleasure;',
    'He flayed livers and chopped toes and did not call it pleasure enough;',
  ],
  s0122: [
    'he exposed bones and burned corpses and did not call it cruel enough.',
    'he exposed bones and burned corpses and did not call it cruel enough.',
  ],
  s0123: [
    'The High Ancestor ate sparingly and dwelt in a low palace; in his ninetieth spring he bent his will and gathered wrath—yet died at the traitor\'s hand.',
    'The High Ancestor ate sparingly and dwelt humbly; in his ninetieth spring he bent his will and gathered wrath—yet died at the traitor\'s hand.',
  ],
  s0124: [
    'The late emperor was warm, stern, reverent, and silent, greatly keeping the great name—what did he ever owe Jing, that Jing should add further poisonous cruelty?',
    'The late emperor was warm, stern, reverent, and silent, keeping the great name—what did he owe Jing, that Jing should add further poison?',
  ],
  s0125: [
    'Imperial branches in swaddling clothes and above, kin in hemp mourning and beyond—all met the extreme knife and chopping block, slaughtered and minced.',
    'Imperial branches in swaddling and above, kin in hemp mourning and beyond—all met the extreme knife and block, slaughtered and minced.',
  ],
  s0126: [
    'How can there be one who on the banks of all within the seas is called a king\'s minister, eats the people\'s grain, drinks the people\'s water, yet bears to hear this pain and not grieve in heart?',
    'How can one on all the banks within the seas be called the king\'s minister, eat the people\'s grain, drink the people\'s water, yet hear this pain and not grieve?',
  ],
  s0127: [
    'Moreover your subjects Sengbian and Baxian and others bear the Prince of Xiangdong\'s charge of weeping blood and holding grief in the mouth, the grace of rubbing crown to sole; generation after generation we have received the former court\'s virtue and personally bear the generals\' charge—',
    'Moreover we subjects Sengbian and Baxian bear Prince of Xiangdong\'s charge of weeping blood and grief in the mouth, grace to crown and sole; generation after generation we received the former court\'s virtue and bear the generals\' charge—',
  ],
  s0128: [
    'yet if we cannot pour out our gall and draw out our entrails to jointly execute the traitor, to wash away Heaven and Earth\'s pain and repay lord and father\'s enmity, then we cannot report to spirits who bear consciousness, nor bear Heaven above and tread Earth below!',
    'yet if we cannot pour gall and draw entrails to execute the traitor together, wash Heaven and Earth\'s pain and repay lord and father\'s enmity, we cannot face spirits with consciousness, nor bear Heaven and tread Earth!',
  ],
  s0129: [
    'Today the Prince, supremely filial and mysteriously moved, his numinous martial thus roused, has already broken the bandit host and captured their commander; only Jing\'s person remains, still in the capital region.',
    'Today the Prince, supremely filial and mysteriously moved, his martial spirit roused, has broken the bandits and taken their commander; only Jing remains in the capital.',
  ],
  s0130: [
    'Your subjects Sengbian and Baxian harmonize the generals and join hearts in covenant; we must execute the vicious and honor the Prince, succeeding to the great enterprise and presiding over suburban sacrifice.',
    'We subjects Sengbian and Baxian harmonize the generals and join in covenant; we must kill the vicious, honor the Prince, succeed to the great enterprise, and preside at suburban sacrifice.',
  ],
  s0131: [
    'If on the road ahead there is one merit or one reward, your subjects Sengbian and others will not push ourselves aside or yield the thing—we will lead the host in person—then the spirits of Heaven and Earth, the altars, and the hundred gods will jointly punish and jointly blame.',
    'If on the road there is one merit or one reward, we will not push aside or yield—we will lead the host in person—then Heaven and Earth, altars, and the hundred gods will jointly punish and blame.',
  ],
  s0132: [
    'Your subjects Sengbian and Baxian join hearts in the affair and will not deceive or fail each other; if there is violation, the bright spirits will strike us dead.',
    'We subjects Sengbian and Baxian join hearts and will not deceive each other; if we violate this, the bright spirits will strike us dead.',
  ],
  s0133: [
    '" Thereupon they ascended the altar, drank blood, and together read the alliance text; all wept until their collars were wet, their words and bearing impassioned.',
    '" Thereupon they ascended the altar, drank blood, and read the alliance together; all wept to wet their collars, impassioned in word and bearing.',
  ],
  s0134: [
    'When the royal army halted at South Isle, the bandit commander Hou Zijian and others led more than ten thousand foot and horse to challenge battle on the bank; they also had more than a thousand war-boats each loaded with troops, both sides with eighty oars apiece, the oarsmen all Yue men—coming and going in swift raid, faster than wind and lightning.',
    'When the royal army halted at South Isle, rebel commander Hou Zijian and others led over ten thousand foot and horse to challenge on the bank; more than a thousand war-boats each loaded troops, both sides eighty oars, oarsmen all Yue men—raiding faster than wind and lightning.',
  ],
  s0135: [
    'Sengbian waved the light boats all to draw back and made the great ships moor close along both banks.',
    'Sengbian waved the light boats back and moored great ships along both banks.',
  ],
  s0136: [
    'The bandits thought the river army meant to retreat and all rushed out to pursue; the armies then rowed the great ships to cut their return, drums and shouts roaring, joining battle mid-river—the bandits all threw themselves into the water.',
    'The rebels thought the fleet was retreating and rushed out; the armies rowed great ships to cut their return, drums and shouts mid-river—the rebels all threw themselves into the water.',
  ],
  s0137: [
    'Sengbian at once supervised the armies downstream, advancing to Dou City at Stone Hill, building linked camps to press the bandits.',
    'Sengbian at once led the armies downstream to Dou City at Stone Hill and built linked camps to press the rebels.',
  ],
  s0138: [
    'The bandits then built five cities across the ridge to hold out; Hou Jing came out himself and fought the royal army greatly north of Stone Hill.',
    'The rebels built five cities across the ridge; Hou Jing came out himself and fought the royal army greatly north of Stone Hill.',
  ],
  s0139: [
    'Baxian said to Sengbian: "The ugly bandit is a wandering soul; his guilt is full and ripe—fleeing execution he comes to die, wishing for one decisive battle.',
    'Baxian told Sengbian, "The ugly bandit is a wandering soul; his guilt is full—fleeing the executioner he comes to die and wants one decisive battle.',
  ],
  s0140: [
    'Our host is many and the bandit few—let us divide their force.',
    'We are many and they few—divide their force.',
  ],
  s0141: [
    '" He at once sent two thousand strong crossbows to attack the bandits\' two western cities and still arrayed ranks to meet the bandit.',
    '" He sent two thousand strong crossbows against the rebels\' two western cities and still arrayed ranks to meet them.',
  ],
  s0142: [
    'Sengbian in the rear waved the army forward and again broke them greatly.',
    'Sengbian in the rear waved the army on and broke them again.',
  ],
  s0143: [
    'Lu Huilue, hearing Jing was defeated in battle, surrendered Stone City; Sengbian led the army in to occupy it.',
    'Lu Huilue, hearing Jing was beaten, surrendered Stone City; Sengbian entered and held it.',
  ],
  s0144: [
    'When Jing retreated he fled north to Zhufang; then Jing\'s scattered soldiers came reporting to Sengbian, and Sengbian ordered the generals to enter and hold Terrace City.',
    'When Jing retreated north to Zhufang, scattered soldiers reported to Sengbian, and he ordered the generals into Terrace City.',
  ],
  s0145: [
    'That night soldiers gathering firewood started a fire that burned the Hall of Supreme Pole and the eastern and western halls.',
    'That night soldiers gathering firewood set a fire that burned the Hall of Supreme Pole and the eastern and western halls.',
  ],
  s0146: [
    'At the time soldiers plundered the capital, stripping gentry and commoners; those seized by them could not keep even a single garment.',
    'Soldiers plundered the capital, stripping gentry and commoners; those seized could not keep a single garment.',
  ],
  s0147: [
    'They drove and pressed the residents to ransom themselves; from Stone Hill to the eastern city, along the Huai the cries of appeal shook the capital—thereupon the people lost hope.',
    'They drove residents for ransom; from Stone Hill to the eastern city cries along the Huai shook the capital—the people lost hope.',
  ],
  s0148: [
    'Sengbian ordered Hou Tian and Pei Zhihheng to lead five thousand elite armored troops east to pursue Jing.',
    'Sengbian ordered Hou Tian and Pei Zhihheng with five thousand elites east to pursue Jing.',
  ],
  s0149: [
    'Sengbian seized more than twenty of Jing\'s party including Wang Wei and sent them to Jiangling.',
    'Sengbian seized more than twenty of Jing\'s party including Wang Wei and sent them to Jiangling.',
  ],
  s0150: [
    'The false Mobile Headquarters Zhao Bochao surrendered from the Wu Song River to Hou Tian; Tian at the time delivered him to Sengbian.',
    'False Mobile Headquarters Zhao Bochao surrendered from Wu Song River to Hou Tian, who delivered him to Sengbian.',
  ],
  s0151: [
    'Sengbian said to Bochao: "Master Zhao, you bore the state\'s heavy grace yet again joined the rebellion.',
    'Sengbian told Bochao, "Master Zhao, you bore the state\'s heavy grace yet joined the rebellion again.',
  ],
  s0152: [
    'Today\'s affair—what do you intend?',
    'Today\'s affair—what will you do?',
  ],
  s0153: [
    '" He thereupon ordered him sent to Jiangling.',
    '" He ordered him sent to Jiangling.',
  ],
  s0154: [
    'After Bochao went out Sengbian looked at the seated guests and said: "The court in former days knew only Zhao Bochao—who knew Wang Sengbian?',
    'After Bochao left Sengbian looked at the guests and said, "The court once knew only Zhao Bochao—who knew Wang Sengbian?',
  ],
  s0155: [
    'The altars had already toppled and were restored by me;',
    'The altars had toppled and I restored them;',
  ],
  s0156: [
    'the rise and fall of men—how can it be constant?',
    'the rise and fall of men—how can it stay constant?',
  ],
  s0157: [
    '" The guests all came forward praising his merit and virtue.',
    '" The guests all came forward praising his merit.',
  ],
  s0158: [
    'Sengbian started in alarm and falsely answered: "This is the sage sovereign\'s majestic virtue and the host of generals\' obedience to orders.',
    'Sengbian started, then falsely answered, "This is the sage sovereign\'s majesty and the generals\' obedience.',
  ],
  s0159: [
    'This old man may occupy the army\'s head in name—what strength is there in me?',
    'This old man may sit at the army\'s head in name—what strength have I?',
  ],
  s0160: [
    '" Thereupon the rebellious bandits were all pacified and the capital was recovered.',
    '" Thereupon the rebels were all pacified and the capital was recovered.',
  ],
  s0161: [
    'The Heir took the imperial throne; for Sengbian\'s merit he was promoted to General Who Guards the Realm, Grand Minister, with twenty ceremonial swords added, enfeoffed Duke of Yongning commandery with a fief of five thousand households; palace attendant, Minister President, and martial music all as before.',
    'The Heir took the throne; for Sengbian\'s merit he was promoted General Who Guards the Realm and Grand Minister, twenty ceremonial swords, Duke of Yongning with five thousand households; palace attendant, Minister President, and martial music unchanged.',
  ],
  s0162: [
    'Afterward the Xiang bandit Lu Na and others broke the governor of Heng Ding Daogui at Lukou and seized all his military stores;',
    'Afterward Xiang bandit Lu Na and others broke Heng governor Ding Daogui at Lukou and seized all his stores;',
  ],
  s0163: [
    'Li Hongya also led a host from Lingling out through Kongling Ford, claiming to aid the campaign against Na.',
    'Li Hongya also led men from Lingling out Kongling Ford, claiming to aid the campaign against Na.',
  ],
  s0164: [
    'The court had not yet understood his heart and was deeply worried; it sent the palace gentleman Luo Chonghuan to summon Sengbian up to join the General of Swift Cavalry the Marquis of Yifeng Xun on the southern campaign.',
    'The court had not read his heart and was deeply worried; it sent palace gentleman Luo Chonghuan to summon Sengbian to join Swift Cavalry Marquis of Yifeng Xun south.',
  ],
  s0165: [
    'Sengbian thereupon supervised Du Kan and the other armies, setting out from Jiankang; the army halted at Baling.',
    'Sengbian supervised Du Kan and the other armies from Jiankang; the army halted at Baling.',
  ],
  s0166: [
    'An edict made Sengbian commander of eastern-upper military affairs and Baxian commander of western-upper military affairs.',
    'An edict made Sengbian commander of eastern-upper forces and Baxian commander of western-upper forces.',
  ],
  s0167: [
    'Earlier Baxian had yielded the command to Sengbian, and Sengbian did not accept; therefore the Heir divided eastern and western commanders, and both marched south together.',
    'Earlier Baxian had yielded command to Sengbian, who refused; the Heir therefore split eastern and western command, and both marched south.',
  ],
  s0168: [
    'At the time Na and the others held downstream at Chelun, building cities on both banks, cutting the water\'s force; their soldiers were fierce and bold, all veterans of a hundred battles.',
    'Na held Chelun downstream, cities on both banks, cutting the water; his soldiers were fierce, all veterans of a hundred battles.',
  ],
  s0169: [
    'Sengbian feared them and did not advance lightly; he thereupon built linked walls bit by bit to press the bandits.',
    'Sengbian feared them and would not advance lightly; he built linked walls bit by bit to press them.',
  ],
  s0170: [
    'The bandits saw they dared not cross blades and all grew slack.',
    'The rebels saw no crossing of blades and grew slack.',
  ],
  s0171: [
    'Sengbian used their lack of preparation and ordered the armies to attack by water and land; he personally held drum and banner to warn advance and halt.',
    'Sengbian used their unreadiness and ordered attack by water and land; he held drum and banner himself to command advance and halt.',
  ],
  s0172: [
    'Thereupon the armies all rushed out and fought a great battle at Chelun; with the Swift Cavalry Xun they joined in bitter attack and took two of their cities.',
    'The armies rushed out and fought greatly at Chelun; with Swift Cavalry Xun they joined in bitter attack and took two cities.',
  ],
  s0173: [
    'The bandits were greatly defeated and fled on foot back to hold Changsha, driving and pressing the residents to enter the city and hold out.',
    'The rebels were greatly defeated and fled on foot to Changsha, driving residents into the city to hold.',
  ],
  s0174: [
    'Sengbian pursued; he ordered ramparts built to besiege them and ordered all armies to raise broad siege palisades; Sengbian sat on the mound and personally oversaw.',
    'Sengbian pursued, ordered ramparts and broad siege palisades, and sat on the mound overseeing himself.',
  ],
  s0175: [
    'The bandits looked out, recognized Sengbian, and knew he was unprepared; the bandit party Wu Zang, Li Xianming, and others then led a thousand crack troops to burst out the gate with shields, charging straight at Sengbian.',
    'The rebels looked out, recognized Sengbian, knew he was unprepared; Wu Zang, Li Xianming, and others led a thousand crack troops out the gate with shields straight at Sengbian.',
  ],
  s0176: [
    'At the time Du Qi and Du Kan both attended at his side; armored guards numbered only a little more than a hundred; he sent men down to fight the bandits.',
    'Du Qi and Du Kan attended at his side; armored guards were only a little over a hundred; he sent men down to fight.',
  ],
  s0177: [
    'Li Xianming rode armored horse with ten followers following, shouting and charging; Sengbian still sat on his folding chair unmoved.',
    'Li Xianming rode armored horse with ten followers, shouting and charging; Sengbian still sat on his folding chair unmoved.',
  ],
  s0178: [
    'Thereupon he directed the brave and captured Xianming, and at once beheaded him.',
    'He directed the brave, captured Xianming, and beheaded him at once.',
  ],
  s0179: [
    'The bandits then withdrew into the city.',
    'The rebels withdrew into the city.',
  ],
  s0180: [
    'Earlier, when Lu Na obstructed the army in internal rebellion, he used Wang Lin as his plea, saying: "If the court releases Wang Lin, Na and the others will themselves surrender.',
    'Earlier Lu Na obstructed the army in rebellion and used Wang Lin as plea, saying, "If the court releases Wang Lin, Na and the others will surrender.',
  ],
  s0181: [
    '" At the time the armies were all advancing and it was not granted.',
    '" The armies were all advancing and it was not granted.',
  ],
  s0182: [
    'But the Prince of Wuling held a host on the upper stream; inside and outside were terrified; the Heir then sent Lin to reconcile.',
    'But Prince of Wuling held a host upstream; inside and outside were terrified; the Heir sent Lin to reconcile.',
  ],
  s0183: [
    'By then Xiangzhou was pacified.',
    'By then Xiangzhou was pacified.',
  ],
  s0184: [
    'Sengbian returned to Jiangling and, by edict, gathered the armies for the western campaign, supervising twenty thousand river troops; the imperial carriage came out to Heavenly Dwelling Temple to see them off.',
    'Sengbian returned to Jiangling and by edict gathered armies for the western campaign, supervising twenty thousand river troops; the carriage came to Heavenly Dwelling Temple to see them off.',
  ],
  s0185: [
    'Before long Wuling was defeated; Sengbian withdrew from Zhijiang to Jiangling and soon garrisoned Jiankang.',
    'Before long Wuling was defeated; Sengbian withdrew from Zhijiang to Jiangling and soon garrisoned Jiankang.',
  ],
  s0186: [
    'That month, after dwelling only a short time, he returned again to Jiangling.',
    'That month, after dwelling only briefly, he returned again to Jiangling.',
  ],
  s0187: [
    'The Qi ruler Gao Yang sent Guo Yuanjian with twenty thousand men, arraying many warships at Hefei, intending to raid Jiankang; he also sent his great generals Xing Jingyuan, Buluohan Sa, Dongfang Lao, and others with troops to follow.',
    'Qi ruler Gao Yang sent Guo Yuanjian with twenty thousand, many warships at Hefei, intending to raid Jiankang; he also sent great generals Xing Jingyuan, Buluohan Sa, Dongfang Lao, and others to follow.',
  ],
  s0188: [
    'At the time Chen Baxian garrisoned Jiankang; hearing this he raced word to Jiangling.',
    'Chen Baxian garrisoned Jiankang; hearing this he raced word to Jiangling.',
  ],
  s0189: [
    'The Heir at once ordered Sengbian to halt at Gushu and remain to garrison there.',
    'The Heir ordered Sengbian to halt at Gushu and garrison there.',
  ],
  s0190: [
    'He first ordered the governor of Yu Hou Tian to lead three thousand elite armored men to build ramparts at East Pass to resist the northern invaders;',
    'He first ordered Yu governor Hou Tian with three thousand elites to build ramparts at East Pass against the northern invaders;',
  ],
  s0191: [
    'he summoned the governor of Wu Commandery Zhang Biao and the governor of Wuxing Pei Zhihheng to join Tian at the pass;',
    'he summoned Wu governor Zhang Biao and Wuxing governor Pei Zhihheng to join Tian at the pass;',
  ],
  s0192: [
    'they fought the northern army and broke it greatly; Sengbian led the mass of armies in triumphant return to Jiankang.',
    'they fought the northern army and broke it greatly; Sengbian led the armies in triumphant return to Jiankang.',
  ],
  s0193: [
    'In the second month of the third year of Chengsheng, on the day jiachen, an edict said: "Promoting the worthy and advancing the able was praised in Qin\'s canons;',
    'In Chengsheng year three, second month, day jiachen, an edict said, "Promoting the worthy and advancing the able was praised in Qin\'s canons;',
  ],
  s0194: [
    'ordering from above and securing below was heard in Han\'s institutions.',
    'ordering from above and securing below was heard in Han\'s institutions.',
  ],
  s0195: [
    'Therefore one looks up to harmonize the terrace stars and looks down to assist the great design.',
    'Therefore one looks up to harmonize the terrace stars and looks down to assist the great design.',
  ],
  s0196: [
    'Bearer of the staff, palace attendant, Grand Minister, Minister President, commander of military affairs in Yang, South Xu, and East Yang provinces, General Who Guards the Realm, governor of Yangzhou, Duke of Yongning commandery the Opening State Wang Sengbian—his vessel is deep and settled, his style detailed and far-reaching; in conduct he is the scholar\'s measure, in speech and appearance he bodies the literary; in learning he spans the nine streams, in martial affairs he covers the seven summaries.',
    'Bearer of the staff, palace attendant, Grand Minister, Minister President, commander in Yang, South Xu, and East Yang, General Who Guards the Realm, Yangzhou governor, Opening Duke of Yongning Wang Sengbian—vessel deep and settled, style detailed and far; conduct is the scholar\'s measure, speech and bearing body the literary; learning spans nine streams, martial covers seven summaries.',
  ],
  s0197: [
    'In recent years in campaigns from west to east—',
    'In recent campaigns from west to east—',
  ],
  s0198: [
    'the armies were not weary, the people had no complaint;',
    'the armies were not weary, the people had no complaint;',
  ],
  s0199: [
    'the royal enterprise was arduous, truly mixing barbarian peril.',
    'the royal enterprise was arduous, truly mixing barbarian peril.',
  ],
  s0200: [
    'He should harmonize this central terrace and bear this upper generalship;',
    'He should harmonize this central terrace and bear this upper generalship;',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_045_b2.mjs <translation.json>'
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
