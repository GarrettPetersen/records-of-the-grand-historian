#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 45, Biography 39',
    'Book of Liang, Volume 45, Biography 39',
  ],
  s0002: [
    'Wang Sengbian',
    'Wang Sengbian',
  ],
  s0003: [
    'Wang Sengbian, courtesy name Juncai, was the son of Right Palace Guard General Wang Shennian.',
    'Wang Sengbian, styled Juncai, was son of Right Palace Guard General Wang Shennian.',
  ],
  s0004: [
    'In the Heavenly Surveillance era he followed his father in coming to surrender.',
    'During Heavenly Surveillance he came with his father to defect.',
  ],
  s0005: [
    'His first office was Left Regular Attendant in the Kingdom of the Prince of Xiangdong.',
    'He began as Left Regular Attendant in Prince of Xiangdong\'s kingdom.',
  ],
  s0006: [
    'When the prince became governor of Danyang, he was transferred to acting staff aide in the prince\'s headquarters.',
    'When the prince became Danyang governor, he became acting staff aide.',
  ],
  s0007: [
    'When the prince went out to govern Kuaiji, he concurrently served as middle army staff officer.',
    'When the prince governed Kuaiji, he served concurrently as middle army staff officer.',
  ],
  s0008: [
    'When the prince took Jingzhou, he was again appointed middle army officer, within the term limit.',
    'When the prince took Jingzhou, he was again made middle army officer within his term.',
  ],
  s0009: [
    'At the time Wuning commandery rebelled; the prince ordered Sengbian to suppress and pacify it.',
    'Wuning commandery rebelled; the prince sent Sengbian to put it down.',
  ],
  s0010: [
    'He was promoted to General of Sincere Might and governor of Wuning.',
    'He was promoted General of Sincere Might and governor of Wuning.',
  ],
  s0011: [
    'Soon after he was promoted to General Who Quells the Distance and governor of Guangping.',
    'Soon after he became General Who Quells the Distance and governor of Guangping.',
  ],
  s0012: [
    'When his term ended he returned as chief clerk of the prince\'s headquarters, his staff officer post unchanged.',
    'When his term ended he returned as the prince\'s chief clerk, still staff officer.',
  ],
  s0013: [
    'When the prince was summoned as Protector of the Army, Sengbian concurrently served as headquarters marshal.',
    'When the prince was summoned Protector of the Army, Sengbian served concurrently as headquarters marshal.',
  ],
  s0014: [
    'When the prince took Jiangzhou, he was again appointed marshal to the General of the Cloud Banner Cavalry and defended Tuncheng.',
    'When the prince took Jiangzhou, he was again marshal to the Cloud Banner general and defended Tuncheng.',
  ],
  s0015: [
    'Shortly he supervised Anlu commandery, then before long returned.',
    'He briefly supervised Anlu, then soon returned.',
  ],
  s0016: [
    'Soon after he became governor of Xincai, still holding the marshal post, his general rank unchanged.',
    'Soon he became governor of Xincai, still marshal, same general rank.',
  ],
  s0017: [
    'When the prince took Jingzhou again, he was made staff adviser to the headquarters as General of Steadfast Resolution with a fief of one thousand, replacing Liu Zhongli as governor of Jingling, and his title was changed to General of Mighty Trust.',
    'When the prince took Jingzhou again, he was staff adviser as General of Steadfast Resolution with a thousand-household fief, replacing Liu Zhongli at Jingling and retitled General of Mighty Trust.',
  ],
  s0018: [
    'When Hou Jing rebelled the prince ordered Sengbian, with acting staff of authority, to command ten thousand river troops and concurrently transport grain for relief.',
    'When Hou Jing rebelled the prince gave Sengbian acting staff, command of ten thousand river troops, and grain transport for relief.',
  ],
  s0019: [
    'He had just reached the capital when the palace city fell and the Son of Heaven suffered dust.',
    'He had just reached the capital when the palace fell and the emperor was driven into exile.',
  ],
  s0020: [
    'Sengbian, together with Liu Zhongli and his brothers and Zhao Bochao and others, first bent the knee to Jing and only then entered court.',
    'Sengbian, with the Liu brothers and Zhao Bochao and others, first submitted to Jing, then entered court.',
  ],
  s0021: [
    'Jing seized all their military stores yet treated them generously with soothing measures.',
    'Jing confiscated their stores yet soothed them generously.',
  ],
  s0022: [
    'Before long he sent Sengbian back to Jingling; thereupon Sengbian traveled day and night by double stages west to join the Heir of Zhenhui.',
    'Before long Jing sent him back to Jingling; Sengbian then raced west by double stages to join the Heir of Zhenhui.',
  ],
  s0023: [
    'The Heir, acting on imperial authority, appointed Sengbian General of the Guards.',
    'The Heir, acting on imperial authority, made Sengbian General of the Guards.',
  ],
  s0024: [
    'When Jing and Xiang grew doubtful and the army lost discipline, the Heir again ordered Sengbian and Bao Quan to command troops to suppress them, allotting soldiers and grain with a fixed day to take the road.',
    'When Jing and Xiang wavered and the army lost discipline, the Heir again ordered Sengbian and Bao Quan south with troops and grain, fixed to march on a set day.',
  ],
  s0025: [
    'At the time Sengbian\'s Jingling subordinates had not all arrived; he wished to wait until they gathered before advancing.',
    'His Jingling troops had not all arrived; he wished to wait until they gathered before marching.',
  ],
  s0026: [
    'He said to Bao Quan: "You and I were both ordered on a southern campaign, yet our army looks like this—what plan can settle it?',
    'He told Bao Quan, "We were both ordered south, yet our force looks like this—what are we to do?',
  ],
  s0027: [
    '" Quan said: "Having received the temple\'s battle plan, we drive fierce warriors—the affair is like pouring snow on boiling water; what is there to worry about?',
    '" Quan said, "We have the court\'s plan and drive fierce men—the thing is like snow on boiling water; why so much worry?',
  ],
  s0028: [
    '" Sengbian said: "Not so.',
    '" Sengbian said, "Not so.',
  ],
  s0029: [
    'What you say is indeed the usual talk of literary men.',
    'What you say is the usual talk of literary men.',
  ],
  s0030: [
    'East of the river has few men of military talent, and their weapons are strong; they have just broken our army and are sharpening their edge to await the enemy—unless we have ten thousand elite troops we cannot control them.',
    'East of the river has few soldiers of real talent and strong arms; they have just crushed our army and rest their blades—without ten thousand elites we cannot hold them.',
  ],
  s0031: [
    'My Jingling armored men have marched the lines many times; I have already sent to summon them and they will arrive before long.',
    'My Jingling veterans have marched many campaigns; I have summoned them and they will come soon.',
  ],
  s0032: [
    'Though the deadline is limited, we can still ask for an extension; I wish to go in with you to speak—please lend me your support.',
    'Though the day is fixed, we can still ask for delay; I want to go in with you—stand with me.',
  ],
  s0033: [
    '" Quan said: "Success or failure hangs on this one march; whether to hurry or delay must in the end be heard from above.',
    '" Quan said, "Success or failure rides on this march; fast or slow we must obey above.',
  ],
  s0034: [
    'The Heir was stern and suspicious by nature; he faintly heard their words and thought Sengbian was delaying and unwilling to go, and was already somewhat angry.',
    'The Heir was stern and suspicious; he caught wind of their talk, thought Sengbian was stalling, and was already angry.',
  ],
  s0035: [
    'When Sengbian was about to enter he told Quan: "I will speak first; you may be seized.',
    'Before entering he told Quan, "I will speak first; you may be seized.',
  ],
  s0036: [
    '" Quan again promised.',
    '" Quan agreed again.',
  ],
  s0037: [
    'When they saw the Heir he came forward asking: "Are you ready?',
    'When they saw the Heir he came forward asking, "Are you ready?',
  ],
  s0038: [
    'What day will you set out?',
    'What day do you march?',
  ],
  s0039: [
    '" Sengbian answered in full as he had said before.',
    '" Sengbian answered fully as before.',
  ],
  s0040: [
    'The Heir was greatly enraged; he gripped his sword and said in a harsh voice: "You fear the march!',
    'The Heir raged, gripped his sword, and shouted, "You fear the march!',
  ],
  s0041: [
    '" and rose and went inside.',
    '" and rose and went within.',
  ],
  s0042: [
    'Quan was shaken and turned pale, and in the end did not dare speak.',
    'Quan shook with terror and dared not speak.',
  ],
  s0043: [
    'Before long he sent several tens of attendants to seize Sengbian.',
    'Before long he sent dozens of attendants to seize Sengbian.',
  ],
  s0044: [
    'When he arrived the Heir said to him: "You defy orders and will not go—you wish to join the rebels; now there is only death.',
    'When he arrived the Heir said, "You defy orders and refuse to march—you would join the rebels; now only death remains.',
  ],
  s0045: [
    'Sengbian replied: "Sengbian has eaten salary deeply and bears heavy responsibility; coming to execution today, how could I harbor resentment?',
    'Sengbian replied, "I have eaten deep salary and bear heavy blame; facing execution today, how could I resent it?',
  ],
  s0046: [
    'I only regret not seeing my old mother.',
    'I only regret not seeing my old mother.',
  ],
  s0047: [
    'The Heir thereupon hacked at him, striking his left thigh; blood ran to the ground.',
    'The Heir hacked at him, cutting his left thigh; blood pooled on the ground.',
  ],
  s0048: [
    'Sengbian lost consciousness and only after long time revived.',
    'Sengbian fainted and only after long time revived.',
  ],
  s0049: [
    'He was at once sent to the Minister of Justice, and his sons and nephews were seized and all imprisoned.',
    'He was sent at once to the Minister of Justice; his sons and nephews were seized and imprisoned.',
  ],
  s0050: [
    'Just then the Prince of Yueyang\'s army raided Jiangling; the people were agitated and did not know his preparations.',
    'Just then the Prince of Yueyang raided Jiangling; the people were unsettled and did not know his plans.',
  ],
  s0051: [
    'The Heir sent an attendant to the prison to ask Sengbian\'s plan; Sengbian laid out his strategy in full and was immediately pardoned and made commander within the city.',
    'The Heir sent an attendant to the prison for Sengbian\'s plan; he laid out his strategy and was immediately pardoned and made city commander.',
  ],
  s0052: [
    'Before long the Prince of Yueyang fled in defeat, and Bao Quan could not take Changsha by force; the Heir then ordered Sengbian to replace him.',
    'Before long Yueyang fled in defeat and Quan could not take Changsha; the Heir ordered Sengbian to replace him.',
  ],
  s0053: [
    'He charged Quan with ten crimes and sent the palace gentleman Luo Chonghuan leading three hundred armed guards with Sengbian to depart together.',
    'He charged Quan with ten crimes and sent palace gentleman Luo Chonghuan with three hundred armed guards to march with Sengbian.',
  ],
  s0054: [
    'When they arrived he sent word to Quan: "Gentleman Luo has been ordered to deliver the Wang of Jingling.',
    'On arrival he sent word to Quan, "Gentleman Luo is ordered to deliver the Wang of Jingling.',
  ],
  s0055: [
    '" Quan was greatly startled and said to those beside him: "With the Wang of Jingling to aid my strategy, the bandits cannot stand.',
    '" Quan was startled and told his attendants, "With the Wang of Jingling to aid me, the rebels will not stand.',
  ],
  s0056: [
    'Before long Chonghuan carried the written order in first and Sengbian followed with the armed guard; Quan had just brushed the mat and sat waiting.',
    'Before long Chonghuan entered with the written order and Sengbian followed with the guard; Quan had just brushed the mat and sat waiting.',
  ],
  s0057: [
    'When Sengbian entered he sat with his back to Quan and said: "Master Bao, you have guilt; by imperial order I am to lock you—do not take it as old friendship.',
    'When Sengbian entered he sat with his back to Quan and said, "Master Bao, you are guilty; by order I lock you—do not take it as old friendship.',
  ],
  s0058: [
    '" He told Chonghuan to produce the order; Quan at once left the floor and was chained beside the bed.',
    '" He had Chonghuan produce the order; Quan left the floor and was chained beside the bed.',
  ],
  s0059: [
    'Sengbian then deployed the generals and joined forces in siege, and pacified the land of Xiang.',
    'Sengbian then deployed the generals, joined in siege, and pacified Xiang.',
  ],
  s0060: [
    'He returned to his post as General of the Guards.',
    'He returned as General of the Guards.',
  ],
  s0061: [
    'Hou Jing floated west on the river to raid; his army halted at Xiakou.',
    'Hou Jing sailed west on the river to raid; his army stopped at Xiakou.',
  ],
  s0062: [
    'Sengbian as grand commander led the governor of Ba Chunyu Liang, the governor of Ding Du Kan, the governor of Yi Wang Lin, the governor of Chen Pei Zhihang, and others, all hurrying to Xiyang.',
    'Sengbian as grand commander led Ba\'s Chunyu Liang, Ding\'s Du Kan, Yi\'s Wang Lin, Chen\'s Pei Zhihang, and others to Xiyang.',
  ],
  s0063: [
    'The army halted at Baling; hearing that Yingzhou had fallen, Sengbian thereupon held Baling city.',
    'The army halted at Baling; hearing Yingzhou had fallen, Sengbian held Baling.',
  ],
  s0064: [
    'The Heir ordered the governor of Luo Xu Siwei and the governor of Wu Du Kan both to join Sengbian at Baling.',
    'The Heir ordered Luo\'s Xu Siwei and Wu\'s Du Kan to join Sengbian at Baling.',
  ],
  s0065: [
    'Jing had already taken Ying city; his troops grew ever broader, his followers very sharp, and he was about to press the invasion of Jingzhou.',
    'Jing had taken Ying; his troops swelled, his followers were keen, and he was about to invade Jingzhou.',
  ],
  s0066: [
    'He sent the false Commissioner of Ceremonials Ding He with five thousand men to hold Jiangxia, the great general Song Zixian with ten thousand as vanguard to build Baling, and Jing himself followed with all his fierce followers by water and land.',
    'He sent false Commissioner Ding He with five thousand to hold Jiangxia, great general Song Zixian with ten thousand as vanguard against Baling, and Jing followed with all his fierce men by water and land.',
  ],
  s0067: [
    'Thereupon the river garrisons along the route submitted at the wind\'s breath; the bandits extended their net to Yinji.',
    'River garrisons along the route submitted at a glance; the rebels spread their net to Yinji.',
  ],
  s0068: [
    'Sengbian sent all grain on the upper river sandbars upriver and sank public and private boats in the water.',
    'Sengbian sent all grain from the river islets upriver and sank public and private boats.',
  ],
  s0069: [
    'When the bandit vanguard reached the river mouth, Sengbian divided orders among the armies to man the walls and hold firm, lower banners and silence drums, calm as if no one were there.',
    'When the rebel vanguard reached the river mouth, Sengbian ordered the armies to hold the walls, lower banners and silence drums, calm as if empty.',
  ],
  s0070: [
    'The next day the bandit host crossed the river; light cavalry came below the wall and asked: "Who is in the city?',
    'Next day the rebels crossed the river; light horse came below the wall and asked, "Who holds the city?',
  ],
  s0071: [
    '" The answer came: "It is the Wang, General of the Guards.',
    '" The answer came, "General of the Guards Wang.',
  ],
  s0072: [
    '" The bandits said: "Tell General Wang—the situation is thus; why not surrender early?',
    '" The rebels said, "Tell General Wang—the situation is what it is; why not surrender soon?',
  ],
  s0073: [
    '" Sengbian sent a man to answer: "The great army need only go to Jingzhou; this city will not be in the way.',
    '" Sengbian sent word, "The great army need only go to Jingzhou; this city will not hinder you.',
  ],
  s0074: [
    'Sengbian\'s hundred mouths are in others\' hands—how could he surrender at once?',
    'Sengbian\'s whole household is in your hands—how could he surrender at once?',
  ],
  s0075: [
    '" The bandit horsemen had barely left when before long they came again, saying: "Our king has arrived—General Wang, why do you not come out to meet our king?',
    '" The horsemen had barely left when they returned, saying, "Our king has come—General Wang, why not come out and meet him?',
  ],
  s0076: [
    '" Sengbian did not answer.',
    '" Sengbian did not answer.',
  ],
  s0077: [
    'Before long they brought Wang Xun and others below the wall; Xun wrote letters to entice those within.',
    'Before long they brought Wang Xun and others below the wall; Xun wrote to entice the garrison.',
  ],
  s0078: [
    'Jing massed warships at North Temple and also sent detachments into the harbor mouths, came ashore to build roads, set out many felt tents, and displayed his army on the eastern ridge above the city; they mowed grass and opened eight roads toward the wall, sending five thousand rabbit-head assault troops in bitter close attack.',
    'Jing massed ships at North Temple, sent men into the harbors, came ashore to build roads and felt tents, displayed his host on the eastern ridge, mowed grass and opened eight approaches, and sent five thousand rabbit-head storm troops in bitter assault.',
  ],
  s0079: [
    'Within the city they drummed and shouted at once; arrows and stones fell like rain and killed many bandits, and the bandits withdrew.',
    'Within the city they drummed and shouted; arrows and stones fell like rain, killed many rebels, and the rebels withdrew.',
  ],
  s0080: [
    'The Heir again ordered the General Who Pacifies the North Hu Sengyou to lead troops down to reinforce Sengbian.',
    'The Heir again ordered General Who Pacifies the North Hu Sengyou down with troops to reinforce Sengbian.',
  ],
  s0081: [
    'That day the bandits again attacked Baling at ten points by water and land, beating drums and whistling, pressing close and hacking upward.',
    'That day the rebels again attacked Baling at ten points by water and land, drums and whistles, pressing close and hacking upward.',
  ],
  s0082: [
    'From the wall they dropped timbers, cast fire, and hurled stones; casualties were very many.',
    'From the wall they dropped timbers, fire, and stones; casualties were very heavy.',
  ],
  s0083: [
    'In the afternoon the bandits withdrew, then raised long palisades around the city and arrayed many warships, attacking the water gate at the southwest corner with tower ships;',
    'In the afternoon the rebels withdrew, then raised long palisades and many warships, attacking the southwest water gate with tower ships;',
  ],
  s0084: [
    'they also sent men across the sandbar, drawing rakes and pushing tortoise rams to fill the moat, drawing screen wagons up to the wall—two days before they stopped.',
    'they also sent men across the sandbar with rakes and tortoise rams to fill the moat and screen wagons against the wall—two days before they stopped.',
  ],
  s0085: [
    'The bandits again set wooden siege towers on the ships, heaped straw and set fire to burn the water palisade; the wind was unfavorable and they burned themselves and withdrew.',
    'The rebels again raised wooden towers on the ships, heaped straw to burn the water palisade; wind turned against them and they burned themselves off.',
  ],
  s0086: [
    'Having suffered repeated defeats in battle, the bandit commander Ren Yue was also captured by Lu Fahe; Jing then burned his camp and fled by night, wheeling his army back to Xiakou.',
    'After repeated defeats, rebel commander Ren Yue was captured by Lu Fahe; Jing burned camp and fled by night, wheeling back to Xiakou.',
  ],
  s0087: [
    'The Heir assessed merit and gave rewards; Sengbian was made General Who Conquers the East, Commissioner with the Golden Seal and Purple Ribbon, and governor of Jiangzhou, enfeoffed Duke of Changning.',
    'The Heir assessed merit; Sengbian was made General Who Conquers the East, Commissioner with Golden Seal, governor of Jiangzhou, and Duke of Changning.',
  ],
  s0088: [
    'Thereupon the Heir ordered Sengbian at once to lead the Baling armies downstream to pursue Jing.',
    'The Heir ordered Sengbian at once to lead the Baling armies downstream against Jing.',
  ],
  s0089: [
    'The army halted at Ying city and attacked Lushan on foot.',
    'The army halted at Ying and attacked Lushan on foot.',
  ],
  s0090: [
    'The Lushan garrison commander Zhi Huaren, a mounted general of Jing\'s, led his party in fierce fighting; the armies were greatly broken and Huaren then surrendered.',
    'Lushan\'s Zhi Huaren, Jing\'s cavalry general, fought fiercely; the armies broke him greatly and Huaren surrendered.',
  ],
  s0091: [
    'Sengbian still supervised the armies in crossing the river to attack Ying and entered the outer city at once.',
    'Sengbian still supervised the armies across the river against Ying and entered the outer city at once.',
  ],
  s0092: [
    'Song Zixian clustered like ants in the Golden City and held out; the attack did not take it.',
    'Song Zixian clustered in Golden City and held; the attack did not take it.',
  ],
  s0093: [
    'Zixian sent his follower Shi Linghu with three thousand men to open the gate and fight out; Sengbian again broke them greatly, captured Linghu alive, and beheaded more than a thousand.',
    'Zixian sent Shi Linghu with three thousand out the gate; Sengbian broke them again, captured Linghu alive, and beheaded over a thousand.',
  ],
  s0094: [
    'Zixian\'s host withdrew to hold the granary gate, barred by the river\'s peril; the armies attacked but could not take it despite repeated battles.',
    'Zixian\'s men withdrew to the granary gate, river-barred and perilous; repeated attacks could not take it.',
  ],
  s0095: [
    'Jing, hearing Lushan had fallen and Ying had lost the outer city, then led his remaining troops by double stages back to Jiankang.',
    'Jing, hearing Lushan had fallen and Ying lost the outer city, raced the remnant back to Jiankang by double stages.',
  ],
  s0096: [
    'Zixian and the others were hard pressed with nowhere to go; they begged to hand over Ying city and return in person to Jing.',
    'Zixian and the others were trapped with nowhere to go; they begged to yield Ying and return to Jing in person.',
  ],
  s0097: [
    'Sengbian falsely agreed and ordered a hundred ships given them to dull their intent.',
    'Sengbian feigned agreement and ordered a hundred ships given to dull their intent.',
  ],
  s0098: [
    'Zixian thought it true; as the boats were about to set out, Sengbian ordered Du Kan to lead a thousand elite men up the battlements, and at once drums and shouts sounded as they burst upon the granary gate.',
    'Zixian believed it; as boats were about to sail, Sengbian ordered Du Kan with a thousand elites up the wall; drums and shouts burst on the granary gate.',
  ],
  s0099: [
    'The river commander Song Yao led tower ships; on the hidden river the four quarters closed like clouds;',
    'River commander Song Yao led tower ships; on the hidden river four quarters closed like clouds;',
  ],
  s0100: [
    'Zixian fought walking and fighting until he reached Baiyang Ford; there he was greatly broken, captured alive, and sent to Jiangling.',
    'Zixian fought on land and water until Baiyang Ford; there he was broken, captured alive, and sent to Jiangling.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_045_b1.mjs <translation.json>'
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
