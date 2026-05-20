#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 46, Biography 40',
    'Book of Liang, Volume 46, Biography 40',
  ],
  s0002: [
    'Hu Sengyou, Xu Wensheng, Du Ze, elder brother An, younger brother You\'an, elder brother\'s son Kan, Yin Zichun',
    'Hu Sengyou; Xu Wensheng; Du Ze; Du An; Du You\'an; Du Kan; Yin Zichun',
  ],
  s0003: [
    'In his later years he served Emperor Shizu as staff recorder in the Pacifying West headquarters.',
    'Later he served Shizu as recorder on the Pacifying West staff.',
  ],
  s0004: [
    'When Hou Jing rebelled, the Western Ju barbarians revolted; Shizu ordered Sengyou to suppress them and to execute all their chieftains; Sengyou remonstrated and, defying the edict, was thrown into prison.',
    'When Hou Jing rebelled the Western Ju rose; Shizu ordered Sengyou to put them down and kill every chieftain; Sengyou remonstrated, offended the throne, and was jailed.',
  ],
  s0005: [
    'In the second year of Great Treasure, when Hou Jing raided Jing and Shan and besieged Wang Sengbian at Baling, Shizu brought Sengyou out of prison, made him acting bearer of the staff, General of Martial Ferocity, and Marquis of Xinxian county, and ordered him to relieve the siege.',
    'In Great Treasure year two Hou Jing raided Jing-Shan and besieged Wang Sengbian at Baling; Shizu freed Sengyou, made him acting staff bearer, General of Martial Ferocity, and Marquis of Xinxian, and sent him to relieve the siege.',
  ],
  s0006: [
    'As Sengyou was about to set out he told his son: "You may prepare two gates—one gate for red, one gate for white.',
    'As he was about to march he told his son, "Prepare two gates—one for red, one for white.',
  ],
  s0007: [
    'If fortune comes, enter by the red gate; if misfortune, by the white gate.',
    'If I win, come in by the red gate; if I lose, by the white.',
  ],
  s0008: [
    'I shall not return unless victorious."',
    'I will not come home unless I win."',
  ],
  s0009: [
    'When Shizu heard this he admired his spirit.',
    'Shizu heard and was stirred.',
  ],
  s0010: [
    'Reaching Yangpu, Jing sent his general Ren Yue with five thousand crack troops to hold White Embankment, watching for him from afar.',
    'At Yangpu, Jing sent Ren Yue with five thousand elites to hold White Embankment and wait for him.',
  ],
  s0011: [
    'Sengyou took a bypath westward; Yue thought he had feared him and retreated, and pursued urgently; at Nan\'an Qian Ford he called to Sengyou: "Wu boy—why do you not surrender early?',
    'Sengyou took a side road west; Yue thought he had fled in fear and chased hard; at Nan\'an Qian Ford he shouted to Sengyou, "Wu whelp—why not surrender now?',
  ],
  s0012: [
    'Where will you run?"',
    'Where can you run?"',
  ],
  s0013: [
    '" Sengyou did not speak with him but secretly drew back; at Red Sand Pavilion layman Lu Fahe arrived, and together they joined armies and struck Yue, routing him greatly; they captured Yue and sent him to Jiangling.',
    '" Sengyou would not answer but quietly withdrew; at Red Sand Pavilion Lu Fahe came up, and together they attacked Yue, broke him utterly, captured him, and sent him to Jiangling.',
  ],
  s0014: [
    'When Hou Jing heard of it he fled.',
    'Hou Jing heard and fled.',
  ],
  s0015: [
    'Shizu made Sengyou palace attendant and General Who Commands the Army, and summoned him back to Jingzhou.',
    'Shizu made him palace attendant and commanding general and recalled him to Jingzhou.',
  ],
  s0016: [
    'In the second year of Chengsheng he was promoted to General of Chariots and Cavalry and Opening-the-Fortress with Three Staffs Equals, all else unchanged.',
    'In Chengsheng year two he was promoted General of Chariots and Cavalry and Opening-the-Fortress with Three Staffs Equals; the rest unchanged.',
  ],
  s0017: [
    'When Western Wei raided, Shizu made Sengyou commander of military affairs east of the city.',
    'When Western Wei attacked, Shizu made him commander east of the city.',
  ],
  s0018: [
    'Wei armies attacked from all four sides, a hundred routes rising together; Sengyou himself met arrows and stones, supervising battle day and night, rewarding soldiers, clear in reward and punishment—all were moved and fought to the death; wherever he turned he crushed and destroyed; the bandits dared not advance.',
    'Wei forces assaulted from every side, a hundred lines at once; Sengyou took arrows and stones himself, fighting day and night, clear in rewards and punishments—the men were stirred and died where they stood; nothing could stand before him; the enemy dared not come forward.',
  ],
  s0019: [
    'Before long he was struck by a stray arrow and died, aged sixty-three.',
    'Soon he was hit by a stray arrow and died at sixty-three.',
  ],
  s0020: [
    'When Shizu heard, he raced to attend and weep over the corpse.',
    'Shizu heard and rushed to mourn over the body.',
  ],
  s0021: [
    'Thereupon inside and outside were terrified and alarmed, and the city fell.',
    'Inside and outside panicked, and the city fell.',
  ],
  s0022: [
    'Xu Wensheng, styled Daomao, was a man of Pengcheng.',
    'Xu Wensheng, styled Daomao, was from Pengcheng.',
  ],
  s0023: [
    'For generations his family served Wei as generals.',
    'His family had served Wei as generals for generations.',
  ],
  s0024: [
    'His father Qingzhi, at the beginning of Heavenly Surveillance, led more than a thousand men to surrender from the north but died on the road before arriving.',
    'His father Qingzhi, early in Heavenly Surveillance, led over a thousand men south to defect but died on the way.',
  ],
  s0025: [
    'Wensheng then took command of his force, gradually achieved merit, and Gaozu favored him exceedingly.',
    'Wensheng took over the troops, won merit step by step, and Gaozu favored him greatly.',
  ],
  s0026: [
    'At the end of Great Unity he was made bearer of the staff and inspector of Ning prefecture.',
    'At the end of Great Unity he became staff bearer and inspector of Ning.',
  ],
  s0027: [
    'Earlier the prefecture lay in remote borderland; the tribal barbarians it governed knew no civil teaching, coveted bribes and goods, and plundered one another in succession—no former inspector could control them.',
    'The prefecture was remote; the tribes knew no law, only greed and raiding—no earlier governor had controlled them.',
  ],
  s0028: [
    'Wensheng opened his heart to soothe them, showed them might and virtue; the Yi and Liao were moved, and custom was reformed.',
    'Wensheng won them with sincerity and awed them with strength; the tribes were moved and manners changed.',
  ],
  s0029: [
    'In the second year of Supreme Clarity, hearing of the state\'s calamity, he mustered and recruited several tens of thousands to come to the relief.',
    'In Supreme Clarity year two, hearing the capital was in peril, he raised tens of thousands and marched east.',
  ],
  s0030: [
    'Shizu praised this and made him bearer of the staff, regular palace attendant, Left Guard general, commander of military affairs in Liang, South Qin, Sha, East Yi, Ba, and North Ba—six prefectures—General of Benevolent Might, and inspector of Qin prefecture, entrusting him with the eastern campaign plan.',
    'Shizu praised him and made him staff bearer, palace attendant, Left Guard general, commander of six prefectures\' forces, General of Benevolent Might, and Qin inspector, with the eastern campaign plan.',
  ],
  s0031: [
    'Thereupon Wensheng led the armies east; reaching Wuchang he met Hou Jing\'s general Ren Yue and locked in stalemate.',
    'Wensheng led his host east; at Wuchang he met Ren Yue and stood locked.',
  ],
  s0032: [
    'After a long while Shizu again ordered Protector of the Army Yin Yue, Pacifying East general Du You\'an, Ba prefecture governor Wang Xun and others to join him, all under Wensheng\'s command.',
    'After long delay Shizu sent Yin Yue, Du You\'an, Wang Xun, and others to join him, all under Wensheng.',
  ],
  s0033: [
    'They struck Ren Yue at Shell Ford; Yue was greatly defeated and withdrew to hold Xiyang.',
    'They fought Ren Yue at Shell Ford; Yue was routed and fell back on Xiyang.',
  ],
  s0034: [
    'Wensheng advanced and held Reed Islet, again in stalemate.',
    'Wensheng took Reed Islet and faced him again.',
  ],
  s0035: [
    'When Hou Jing heard, he led a great host west to relieve Yue, reaching Xiyang.',
    'Hou Jing heard and led a great force west to save Yue, reaching Xiyang.',
  ],
  s0036: [
    'Wensheng did not dare fight.',
    'Wensheng would not give battle.',
  ],
  s0037: [
    'The generals all said: "Jing\'s river army advanced lightly and is very hungry and weary—we can strike now and surely win a great victory.',
    'The generals said, "Jing\'s fleet came fast and is starving—we can strike now and win a great victory.',
  ],
  s0038: [
    '" Wensheng did not permit it.',
    '" Wensheng refused.',
  ],
  s0039: [
    'Wensheng\'s wife the Lady Shi had been in Jiankang; at this time Jing conveyed her back to him.',
    'Wensheng\'s wife Lady Shi had been in Jiankang; Jing now sent her back to him.',
  ],
  s0040: [
    'Wensheng felt deep obligation to Jing and then secretly exchanged envoys; he had no will to fight at all—the host was furious and resentful.',
    'Wensheng felt beholden to Jing and began secret correspondence; he would not fight—the army seethed with anger.',
  ],
  s0041: [
    'Du You\'an, the garrison officer Shouzao and others then led their detachments forward alone, fought Jing, and routed him greatly, capturing his boats and returning.',
    'Du You\'an, Shouzao, and others led their men out alone, fought Jing, smashed him, and brought back his ships.',
  ],
  s0042: [
    'Just then Jing secretly sent cavalry by a hidden path to raid and seize E prefecture; the army was panic-stricken and utterly routed.',
    'Then Jing sent cavalry by a hidden road, took E prefecture, and the army collapsed in terror.',
  ],
  s0043: [
    'Wensheng fled back to Jingzhou; Shizu still made him commander of the north face of the city.',
    'Wensheng fled to Jingzhou; Shizu still made him commander of the north wall.',
  ],
  s0044: [
    'He had also amassed much corrupt booty; Shizu was greatly angered, issued orders to reproach him, counted his ten crimes, and stripped rank and title.',
    'He had also piled up loot; Shizu raged, rebuked him, listed ten crimes, and stripped his titles.',
  ],
  s0045: [
    'Having lost military authority, he harbored private resentment; when Shizu heard, he was thrown into prison.',
    'Stripped of command, he nursed grievance; Shizu heard and jailed him.',
  ],
  s0046: [
    'At the time Ren Yue had been captured and was imprisoned with Wensheng.',
    'Ren Yue had been captured and shared his cell.',
  ],
  s0047: [
    'Wensheng said to Yue: "Why did you not surrender early and put me in this plight?',
    'Wensheng said to Yue, "Why did you not surrender sooner and spare me this?',
  ],
  s0048: [
    '" Yue said: "Outside the gate one saw no trace of your horses—how was I to surrender at once?',
    '" Yue said, "I saw no hoofprints of yours outside the gate—how could I surrender so soon?',
  ],
  s0049: [
    '" Wensheng had nothing to answer and died in prison.',
    '" Wensheng had no reply and died in prison.',
  ],
  s0050: [
    'Du Ze, of Dulings in Jingzhao commandery.',
    'Du Ze was from Dulings in Jingzhao.',
  ],
  s0051: [
    'His ancestors had returned south from the north and settled at Xiangyang in Yong province; descendants made their home there.',
    'His forebears came south from the north and settled at Xiangyang in Yong; the family remained there.',
  ],
  s0052: [
    'Grandfather Lingqi served Qi as attendant within the court.',
    'Grandfather Lingqi was a Qi court attendant.',
  ],
  s0053: [
    'Father Huaibao from youth had resolve and integrity, always awaiting the right moment.',
    'His father Huaibao had spirit and principle from youth and waited for his hour.',
  ],
  s0054: [
    'When Gaozu\'s righteous army marched east, he followed Prince of Nanping Wei remaining to garrison Xiangyang.',
    'When Gaozu\'s army marched east he stayed with Prince of Nanping Wei to hold Xiangyang.',
  ],
  s0055: [
    'In Heavenly Surveillance he gradually achieved merit and reached General of Fierce Valor and inspector of Liang prefecture.',
    'Under Heavenly Surveillance he rose through merit to General of Fierce Valor and Liang inspector.',
  ],
  s0056: [
    'At the beginning of Great Unity Wei inspector of Liang Yuan Luo surrendered the prefecture inward; Huaibao was further made superintending commander of Hua prefecture.',
    'Early in Great Unity Yuan Luo, Wei inspector of Liang, surrendered; Huaibao was also made commander of Hua.',
  ],
  s0057: [
    'Qin prefecture\'s dependent Wu Xing had Di king Yang Zhao rebel; Huaibao defeated and broke him.',
    'Yang Zhao, Di king of Wu Xing in Qin, rebelled; Huaibao defeated him.',
  ],
  s0058: [
    'In the fifth year he died at his post.',
    'In the fifth year he died in office.',
  ],
  s0059: [
    'Ze was Huaibao\'s seventh son.',
    'Ze was Huaibao\'s seventh son.',
  ],
  s0060: [
    'From youth he had fighting spirit and was known in his hometown for courage and daring.',
    'From youth he had nerve and was known at home for boldness.',
  ],
  s0061: [
    'On leaving the office he became army recorder in the Rapid Cavalry command of Lujiang.',
    'He began as army recorder on the Lujiang Rapid Cavalry staff.',
  ],
  s0062: [
    'When Shizu governed Jingzhou he still served on his staff, later becoming governor of Xinxing.',
    'When Shizu held Jingzhou he served on his staff, later becoming governor of Xinxing.',
  ],
  s0063: [
    'In the second year of Supreme Clarity he followed the Prince of Yueyang in coming to raid Jingzhou; Shizu, having old ties with him, secretly invited him.',
    'In Supreme Clarity year two he came with the Prince of Yueyang to attack Jingzhou; Shizu, who knew him of old, secretly called him over.',
  ],
  s0064: [
    'Ze then with his elder brother An, younger brother You\'an, and nephew Kan by night returned to Shizu; Shizu made him bearer of the staff, General of Trustworthy Might, and inspector of Wu prefecture.',
    'Ze came by night with his brother An, younger brother You\'an, and nephew Kan; Shizu made him staff bearer, General of Trustworthy Might, and Wu inspector.',
  ],
  s0065: [
    'Before long he was transferred General Who Chastises the Yi, concurrently Barbarian-quelling Protector, interior minister of Wuling, and Marquis of Zhijiang with a fief of a thousand households.',
    'Soon he became General Who Chastises the Yi, Barbarian-quelling Protector, interior minister of Wuling, and Marquis of Zhijiang with a thousand households.',
  ],
  s0066: [
    'He was ordered to follow Wang Sengbian east to campaign against Hou Jing.',
    'He was ordered to follow Wang Sengbian east against Hou Jing.',
  ],
  s0067: [
    'Reaching Baling, Jing came to attack; for many days he could not take it and fled.',
    'At Baling Hou Jing attacked; after many days he could not win and fled.',
  ],
  s0068: [
    'He was added palace attendant and Left Guard general, promoted in rank to duke, fief increased five hundred households.',
    'He was made palace attendant and Left Guard general, raised to duke, fief increased five hundred households.',
  ],
  s0069: [
    'He still followed Sengbian pursuing Jing to Stonehead, stalemate with the bandit at Heng Ridge.',
    'He followed Sengbian in pursuit to Stonehead and faced the bandit at Heng Ridge.',
  ],
  s0070: [
    'In battle Jing personally led elites, charging left and right; Ze cut in from behind the ridge and Jing was greatly defeated, fleeing east to Jinling; Ze entered and held the city.',
    'In the fight Jing led his best men in person; Ze struck from behind the ridge; Jing was shattered and fled east to Jinling; Ze took the city.',
  ],
  s0071: [
    'When Jing was pacified he was added regular palace attendant, bearer of the staff, commander of Jiang military affairs, inspector of Jiang—fief increased a thousand households.',
    'When Jing fell he was added palace attendant, staff bearer, Jiang commander, and Jiang inspector—fief increased a thousand households.',
  ],
  s0072: [
    'That month Qi general Guo Yuanjian attacked Qin prefecture inspector Yan Chaoyuan at Qin commandery; Wang Sengbian ordered Ze to relieve him.',
    'That month Qi general Guo Yuanjian besieged Yan Chaoyuan at Qin; Wang Sengbian sent Ze to relieve him.',
  ],
  s0073: [
    'Chen Baxian also came from Ouyang to join; with Yuanjian they fought a great battle at Shilin; Baxian ordered strong crossbowmen to shoot and Yuanjian\'s host withdrew.',
    'Chen Baxian came from Ouyang to join; at Shilin they fought Guo Yuanjian; Baxian ordered heavy crossbows and Yuanjian\'s men fell back.',
  ],
  s0074: [
    'Ze then released his troops to strike, routing them greatly—more than ten thousand heads cut, more than a thousand captured alive; Yuanjian gathered the remnant and fled.',
    'Ze charged and broke them—ten thousand heads, a thousand prisoners; Yuanjian gathered what was left and fled.',
  ],
  s0075: [
    'At the time Shizu held Wang Lin at Jiangling; his chief clerk Lu Na and others then rebelled at Changsha; Shizu summoned Ze and Wang Sengbian to suppress them.',
    'Shizu held Wang Lin at Jiangling; Lu Na rebelled at Changsha; Shizu called Ze and Wang Sengbian to suppress him.',
  ],
  s0076: [
    'In Chengsheng year two they fought Na and others at Wheel Ford, were greatly victorious, took two of their forts; Na and others fled to hold Changsha; Ze and the others besieged them.',
    'In Chengsheng year two they fought Lu Na at Wheel Ford, took two forts, and drove him to Changsha; Ze besieged the city.',
  ],
  s0077: [
    'Later Na and others surrendered; Ze again with Wang Sengbian campaigned west against the Prince of Wuling at Gorge Mouth—reaching there they broke and pacified him at once.',
    'When Na surrendered Ze went west with Wang Sengbian against the Prince of Wuling at Gorge Mouth and broke him at once.',
  ],
  s0078: [
    'Thereupon he returned to his command but met illness and died.',
    'He returned to his post, fell ill, and died.',
  ],
  s0079: [
    'An edict said: "Ze—of the old surname of Jingzhao, descendant of Yuan Kai.',
    'The edict said, "Ze, of the ancient house of Jingzhao, line of Yuan Kai.',
  ],
  s0080: [
    'His family transmitted learning; generation after generation bore loyal fidelity.',
    'His clan carried learning; generation after generation served in loyalty.',
  ],
  s0081: [
    'From driving the relay-chariot on the river isles, his rule was called incorrupt and able.',
    'From service on the river isles his rule was called clean and capable.',
  ],
  s0082: [
    'Pushing the chariot-wheel on the shallow ford, one truly heard of his quiet governance.',
    'On the shallow fords of command one heard only of his quiet rule.',
  ],
  s0083: [
    'Suddenly he met ruin and death—grief pierces the breast.',
    'Suddenly he is gone—grief pierces the heart.',
  ],
  s0084: [
    'He may be posthumously made General of Chariots and Cavalry, with one suite of martial music added.',
    'Let him be posthumously made General of Chariots and Cavalry, with martial music.',
  ],
  s0085: [
    'His posthumous title shall be Martial."',
    'Posthumous title: Martial."',
  ],
  s0086: [
    'Ze had nine brothers—elder brothers Song, Cen, Cong, Ji, Yi, Yan and An, and younger brother You\'an—all famous in their day.',
    'Ze had nine brothers—Song, Cen, Cong, Ji, Yi, Yan, An, and the younger You\'an—all famed in their time.',
  ],
  s0087: [
    'An, styled Gongheng.',
    'An, styled Gongheng.',
  ],
  s0088: [
    'From youth he had martial capacity and loved schemes of alliance and pressure.',
    'From youth he had martial talent and loved bold stratagems.',
  ],
  s0089: [
    'In Supreme Clarity he returned with Ze to Shizu; Shizu made him bearer of the staff, Pacifying North general, inspector of North Liang, Marquis of Jiangling, fief a thousand households.',
    'In Supreme Clarity he returned with Ze; Shizu made him staff bearer, Pacifying North general, North Liang inspector, and Marquis of Jiangling with a thousand households.',
  ],
  s0090: [
    'An thereupon requested to raid Xiangyang; Shizu granted it.',
    'An asked to strike Xiangyang; Shizu agreed.',
  ],
  s0091: [
    'He marched day and night, first going to attack the city—but could not take it.',
    'He marched day and night and struck the city first—but could not take it.',
  ],
  s0092: [
    'When the Prince of Yueyang arrived he fled to rely on his brother Yan at Nanyang—Yan was then governor of Nanyang.',
    'When the Prince of Yueyang came he fled to his brother Yan at Nanyang, who was then Nanyang governor.',
  ],
  s0093: [
    'The Prince of Yueyang soon sent troops to take the city; An and Yan both met disaster.',
    'The prince soon took the city; An and Yan both perished.',
  ],
  s0094: [
    'You\'an was utterly filial by nature, generous and mild, and surpassed others in fierce courage.',
    'You\'an was deeply filial, open-handed and mild, yet fiercer than most in battle.',
  ],
  s0095: [
    'In Supreme Clarity he returned with his brother Ze to Shizu; Shizu made him Cloud Banner general, inspector of West Jing, Marquis of Huarong, fief a thousand households.',
    'In Supreme Clarity he returned with Ze; Shizu made him Cloud Banner general, West Jing inspector, and Marquis of Huarong with a thousand households.',
  ],
  s0096: [
    'He was ordered with Pacifying South general Wang Sengbian to campaign against the Prince of Hedong Yu at Changsha and pacify him.',
    'He was ordered with Wang Sengbian to campaign against the Prince of Hedong at Changsha and pacify him.',
  ],
  s0097: [
    'He was also ordered to lead ten thousand picked armored troops to aid Left Guard general Xu Wensheng in the eastern campaign against Hou Jing.',
    'He was also told to lead ten thousand armored men to aid Xu Wensheng against Hou Jing.',
  ],
  s0098: [
    'Reaching Shell Ford he met Jing\'s general Ren Yue coming to resist; they fought and routed him greatly.',
    'At Shell Ford he met Ren Yue; they fought and broke him.',
  ],
  s0099: [
    'They beheaded his Staff Equal Chiluo Zitong, Xiangzhou inspector Zhao Weifang and others, and sent the heads to Jiangling.',
    'They cut off Chiluo Zitong, Zhao Weifang of Xiangzhou, and others, and sent the heads to Jiangling.',
  ],
  s0100: [
    'Thereupon the army advanced in force and stalemate with Jing.',
    'Then the host pushed forward and faced Jing in stalemate.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_046_b1.mjs <translation.json>'
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
