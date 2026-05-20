#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 9, Biographies 3',
    'Book of Liang, Volume Nine, Biographies, Third',
  ],
  s0002: [
    'Wang Mao; Cao Jingzong; Liu Qingyuan',
    'Wang Mao; Cao Jingzong; Liu Qingyuan',
  ],
  s0003: [
    'Wang Mao, styled Xiuyuan, was a native of Qi in Taiyuan.',
    'Wang Mao, styled Xiuyuan, came from Qi in Taiyuan commandery.',
  ],
  s0004: [
    'His grandfather Shen was Major of the Northern Central Commandant.',
    'His grandfather Shen served as major to the Northern Central Commandant.',
  ],
  s0005: [
    'His father Tiansheng in late Song was a ranked general; at Shitou he defeated Minister over the Masses Yuan Can, and by merit rose to Administrator of the two commanderies Brazil and Zitong, and was enfeoffed as Marquis of Shanghuang district.',
    'His father Tiansheng, a ranked general in late Song, took Shitou and defeated Minister over the Masses Yuan Can; for merit he became administrator of Brazil and Zitong and was made Marquis of Shanghuang district.',
  ],
  s0006: [
    'When Mao was only a few years old, his grandfather Shen regarded him as extraordinary and often told acquaintances: "This boy is our family\'s thousand-li colt; he who will uphold our house must be this child.',
    'While Mao was still a child, his grandfather Shen singled him out and often told friends: "This boy is our thousand-li colt—the one who will uphold our house.',
  ],
  s0007: [
    '" When he grew up, he loved reading books of war and broadly grasped their main purport.',
    '" When he came of age he loved military texts and broadly mastered their essentials.',
  ],
  s0008: [
    'By nature reserved and self-contained, he did not casually associate; he stood eight chi tall, fair-skinned and handsome in appearance.',
    'Reserved by nature, he made no casual friendships; eight chi tall, fair and striking in looks.',
  ],
  s0009: [
    'When Emperor Wu of Qi was still in plain dress, seeing him he sighed and said: "Wang Mao is young, yet so imposing; he will surely be minister and counselor material."',
    'Before Emperor Wu of Qi took the throne, he saw Mao and sighed: "So young, yet so imposing—he will surely reach the highest offices."',
  ],
  s0010: [
    'At the end of Song\'s Shengming era he first entered office as Attendant at Court, and passed through Rear Army Aide, Cavalry of the Minister of Works, and Central Commandant\'s Army Aide.',
    'At the end of Song\'s Shengming era he began as Attendant at Court, then served as Rear Army aide, Minister of Works cavalry officer, and Central Commandant\'s army aide.',
  ],
  s0011: [
    'When Wei general Li Wunu raided Hanzhong, Mao received orders for a western campaign.',
    'When the Wei general Li Wunu raided Hanzhong, Mao was ordered west to attack him.',
  ],
  s0012: [
    'The Wei army withdrew; he returned as Pacify the South Major, concurrently holding the magistracy of Linxiang.',
    'After the Wei withdrew he became Pacify the South major, also serving as magistrate of Linxiang.',
  ],
  s0013: [
    'He entered the capital as Colonel of Agile Cavalry.',
    'He then entered court as Colonel of Agile Cavalry.',
  ],
  s0014: [
    'When Wei raided Yanzhou, Mao at the time was chief clerk to the General Who Pacifies the North, garrisoning the northern border in relief; he entered court as Front Army General\'s major to the Prince of Jiangxia.',
    'When Wei struck Yanzhou, Mao was chief clerk to the General Who Pacifies the North on the northern frontier; he then entered court as major to the Front Army General and Prince of Jiangxia.',
  ],
  s0015: [
    'He was again transferred to General Who Pacifies the North and Interior Administrator of Jiangxia.',
    'He was again made General Who Pacifies the North and interior administrator of Jiangxia.',
  ],
  s0016: [
    'At the beginning of Jianwu, Wei besieged Sizhou; Mao led the Yingzhou army to relieve it.',
    'Early in Jianwu the Wei besieged Sizhou, and Mao led Yingzhou troops to its relief.',
  ],
  s0017: [
    'Gaozu led the host first to mount Xianshou; Wei generals Wang Su and Liu Chang came to give battle, and Mao followed Gaozu to resist them, greatly defeating Su and the rest.',
    'Gaozu led the army up Xianshou Mountain first; when Wei generals Wang Su and Liu Chang attacked, Mao followed Gaozu and routed them.',
  ],
  s0018: [
    'The Wei army withdrew; Mao returned to Ying and was then transferred to Support-the-State chief clerk and Administrator of Xiangyang.',
    'The Wei withdrew; Mao returned to Ying and was made Support-the-State chief clerk and administrator of Xiangyang.',
  ],
  s0019: [
    'When Gaozu\'s righteous army rose, Mao privately told Zhang Hongce to urge Gaozu to welcome Emperor He; Gaozu thought otherwise—the account is in the Annals of Gaozu.',
    'When Gaozu raised the righteous army, Mao privately urged Zhang Hongce to have Gaozu welcome Emperor He; Gaozu disagreed, as told in the Annals of Gaozu.',
  ],
  s0020: [
    'When Gaozu launched from the Yong region, each time he sent Mao as vanguard.',
    'Whenever Gaozu marched out of Yong, he sent Mao ahead as vanguard.',
  ],
  s0021: [
    'When the army halted at Ying city, Mao advanced and pacified Jiahu, defeated Guangziqin, Wu Ziyang, and others, and decapitations numbered in the tens of thousands; he returned and presented the victory at Hanchuan.',
    'At Ying city Mao advanced to pacify Jiahu, defeated Guangziqin and Wu Ziyang, took tens of thousands of heads, and returned to report victory at Hanchuan.',
  ],
  s0022: [
    'After Ying and Lu were pacified, he followed Gaozu east and again served as the army\'s spearhead.',
    'Once Ying and Lu were pacified, he followed Gaozu east and again led the van.',
  ],
  s0023: [
    'When the army reached Moling, Dong Hun sent Grand General Wang Zhenguo, who massed troops at Zhuque Gate; the host was said to number two hundred thousand, and they crossed the floating bridge to request battle.',
    'At Moling, Dong Hun sent Grand General Wang Zhenguo with a host said to number two hundred thousand at Zhuque Gate; they crossed the floating bridge and offered battle.',
  ],
  s0024: [
    'Mao joined Cao Jingzong and others in the attack and greatly defeated them.',
    'Mao joined Cao Jingzong and others in a combined strike and routed them.',
  ],
  s0025: [
    'He released troops in pursuit; corpses piled level with the bridge railings, and those who drowned in the Huai were beyond counting.',
    'He drove the pursuit until corpses stood level with the bridge rails; the dead in the Huai could not be counted.',
  ],
  s0026: [
    'They drove in long columns to Xuanyang Gate.',
    'The army swept on to Xuanyang Gate.',
  ],
  s0027: [
    'When Jiankang was pacified, Mao was made Guard Army General; soon he was transferred to Palace Attendant and Army Inspector General.',
    'After Jiankang fell, Mao was made Guard Army General, then soon Palace Attendant and Army Inspector General.',
  ],
  s0028: [
    'When bandits burned Divine Tiger Gate, Mao led his command to East Yiji Gate to answer the alarm; shot by bandits, he leapt his horse forward and the bandits turned and fled.',
    'When bandits burned Divine Tiger Gate, Mao rushed his men to East Yiji Gate; though shot at, he spurred forward and the bandits fled.',
  ],
  s0029: [
    'Because he could not restrain the wicked bandits, Mao memorialized to resign; a gracious edict did not permit it.',
    'Unable to stop the outlaws, Mao asked to resign; a gracious edict refused.',
  ],
  s0030: [
    'He was given the additional title Pacify the Army General and enfeoffed as Duke of Wangcai county with a fief of two thousand three hundred households.',
    'He was also made Pacify the Army General and enfeoffed as Duke of Wangcai with two thousand three hundred households.',
  ],
  s0031: [
    'That year Jiangzhou Inspector Chen Bozhi raised troops in rebellion; Mao went out as Bearer of Staff, Scattered Cavalry Attendant, Area Commander of Jiangzhou military affairs, Pacify the South General, and Jiangzhou Inspector, granted one suite of drums and pipes, and marched south to attack Bozhi.',
    'That year Chen Bozhi rebelled as Jiangzhou inspector; Mao went out with staff insignia as Scattered Cavalry Attendant, area commander, Pacify the South General, and Jiangzhou inspector, with drums and pipes, to attack him.',
  ],
  s0032: [
    'Bozhi fled to Wei.',
    'Bozhi fled to Wei.',
  ],
  s0033: [
    'At the time Jiujiang had newly suffered military disaster and the people longed to return to their livelihoods; Mao devoted himself to farming and reducing corvee, and the common people were at peace.',
    'Jiujiang had just been ravaged by war and the people wanted to farm again; Mao pushed farming and cut levies, and the region grew calm.',
  ],
  s0034: [
    'In the fourth year Wei invaded Hanzhong; Mao received orders for a western campaign, and Wei then withdrew its army.',
    'In year four Wei invaded Hanzhong; Mao was ordered west, and the Wei army withdrew.',
  ],
  s0035: [
    'In the sixth year he was transferred to Right Vice Director of the Masters of Writing, his Palace Attendant post remaining as before.',
    'In year six he became Right Vice Director of the Masters of Writing while keeping his Palace Attendant post.',
  ],
  s0036: [
    'He firmly declined and would not accept; he was instead appointed Palace Attendant, Central Guard General, and concurrent Crown Prince Steward.',
    'He firmly declined; the appointment was changed to Palace Attendant, Central Guard General, and Crown Prince Steward.',
  ],
  s0037: [
    'In the seventh year he was appointed Chariots and Cavalry General, Crown Prince Steward remaining as before.',
    'In year seven he was made Chariots and Cavalry General, still Crown Prince Steward.',
  ],
  s0038: [
    'In the eighth year, under his original title, he received Open Office Equal in Protocol to the Three Excellencies and became Danyang Intendant, Palace Attendant as before.',
    'In year eight he kept his title but received open office equal to the Three Excellencies and became Danyang intendant, remaining Palace Attendant.',
  ],
  s0039: [
    'At the time the realm was at peace and Gaozu was just then trusting literary elegance; Mao\'s heart was rather displeased, and after feasts when drunk he often showed it in words and countenance—yet Gaozu always pardoned him without blame.',
    'The realm was at peace and Gaozu favored literary men; Mao was ill at ease, and after banquets, drunk, he often showed it in face and speech—yet Gaozu always forgave him.',
  ],
  s0040: [
    'In the eleventh year he was advanced to Minister of Works, Palace Attendant and Intendant as before.',
    'In year eleven he was promoted to Minister of Works, keeping Palace Attendant and the intendant post.',
  ],
  s0041: [
    'Mao declined the Capital Intendant post and was instead made concurrent Central Authority General.',
    'Mao declined the capital intendant post and took the concurrent Central Authority Generalship instead.',
  ],
  s0042: [
    'Mao was generous and forbearing by nature; though in office he won no special praise, officials and commoners alike were at ease with him.',
    'By nature generous and easy, he won little fame in office, yet officials and people alike trusted him.',
  ],
  s0043: [
    'In his dwelling he was upright: cap and robes dignified even in a single room, and even concubines never saw him slack in appearance.',
    'At home he kept himself square; even alone in one room his dress was formal, and servants never saw him look lax.',
  ],
  s0044: [
    'His bearing was splendid and fine; beard and brows were like painted.',
    'He was splendid in bearing, with beard and brows like painted lines.',
  ],
  s0045: [
    'Entering and leaving court assemblies, each time he was gazed upon by the multitude.',
    'Whenever he attended court, all eyes followed him.',
  ],
  s0046: [
    'The next year he went out as Bearer of Staff, Scattered Cavalry Attendant, Fast Cavalry General, Open Office Equal in Protocol to the Three Excellencies, Area Commander of Jiangzhou military affairs, and Jiangzhou Inspector.',
    'The next year he went out with staff insignia as Scattered Cavalry Attendant, Fast Cavalry General with open office equal to the Three Excellencies, area commander, and Jiangzhou inspector.',
  ],
  s0047: [
    'He administered affairs three years and died in the province at age sixty.',
    'After three years in office he died in the province, aged sixty.',
  ],
  s0048: [
    'Gaozu deeply mourned him, granting funeral money of three hundred thousand cash and three hundred bolts of cloth.',
    'Gaozu mourned him deeply and granted three hundred thousand cash and three hundred bolts of cloth for the funeral.',
  ],
  s0049: [
    'An edict said: "To honor virtue and record merit is the enlightened king\'s excellent standard;',
    'An edict said, "To honor virtue and record merit is the enlightened king\'s true measure;',
  ],
  s0050: [
    'to think of the end and pursue the distant is the former canon\'s clear charge.',
    'to remember the dead and reach back to the ancestors is the clear charge of former canons.',
  ],
  s0051: [
    'The late Bearer of Staff, Scattered Cavalry Attendant, Fast Cavalry General, Open Office Equal in Protocol to the Three Excellencies, and Jiangzhou Inspector Mao had discernment broad and deep and bearing firm and upright.',
    'The late Bearer of Staff, Scattered Cavalry Attendant, Fast Cavalry General, Open Office Equal to the Three Excellencies, and Jiangzhou Inspector Mao was broad in judgment and firm in bearing.',
  ],
  s0052: [
    'From the first in hardship and obscurity he devoted loyalty and proclaimed his effort, binding himself in joy and sorrow and sharing ordeals in difficulty.',
    'From the first days of hardship he gave loyal service, sharing joy and sorrow and every trial.',
  ],
  s0053: [
    'We were about to rely on his strategies and forever exalt the court\'s trust;',
    'We meant to rely on his counsel and long entrust him with the court;',
  ],
  s0054: [
    'suddenly he died, and We are grieved in Our heart.',
    'yet suddenly he died, and Our heart is stricken.',
  ],
  s0055: [
    'It is fitting to increase the rites and manifest his splendid merit.',
    'His rites should be raised to show forth his great merit.',
  ],
  s0056: [
    'He may be posthumously granted Palace Attendant and Grand Commandant, with twenty Office Swords and one suite of drums and pipes.',
    'Let him be granted posthumously Palace Attendant and Grand Commandant, with twenty Office Swords and one suite of drums and pipes.',
  ],
  s0057: [
    'Posthumous name Loyal and Ardent."',
    'Posthumous name Loyal and Ardent."',
  ],
  s0058: [
    'Earlier, because Mao was a founding merit-holder, Gaozu had granted him the music of bells and chimes.',
    'Earlier, as a founding merit-holder, Mao had been granted bells and chimes from Gaozu.',
  ],
  s0059: [
    'While Mao was in Jiangzhou, he dreamed that the bells and chimes on their rack fell for no reason; his heart was troubled.',
    'In Jiangzhou he dreamed the bells and chimes on their stand fell for no reason, and he took it ill.',
  ],
  s0060: [
    'On waking he ordered the music performed.',
    'When he woke he ordered the music played.',
  ],
  s0061: [
    'When the array was complete, the bells and chimes on the rack indeed, for no reason, had all their cords break and fell to the ground.',
    'When the musicians were in place, every cord on the bells and chimes broke without cause and they crashed to the floor.',
  ],
  s0062: [
    'Mao said to Chief Clerk Jiang Quan: "This music is what the Son of Heaven uses to grace and comfort his ministers.',
    'Mao told Chief Clerk Jiang Quan, "This music is what the Son of Heaven grants to reward his ministers.',
  ],
  s0063: [
    'When music reaches its utmost—can there be no worry!',
    'When music has reached its limit, can there be no foreboding!',
  ],
  s0064: [
    '" Soon after he fell ill, and within a few days died.',
    '" Soon after he fell ill and died within days.',
  ],
  s0065: [
    'His son Zhenxiu succeeded; for observing mourning without propriety he was memorialized by the authorities and banished to Yuezhou.',
    'His son Zhenxiu succeeded him but was banished to Yuezhou after the authorities reported his improper mourning.',
  ],
  s0066: [
    'Later an edict retained him at Guangzhou; he then secretly joined with Renwei Mansion Army Aide Du Jing to attack the prefectural city, and Inspector Xiao Ang attacked them.',
    'Later an edict kept him at Guangzhou; he then secretly allied with Renwei Mansion army aide Du Jing to seize the city, and Inspector Xiao Ang put them down.',
  ],
  s0067: [
    'Jing was a Wei surrender; he and Zhenxiu were executed together.',
    'Jing, a Wei defector, was executed together with Zhenxiu.',
  ],
  s0068: [
    'Cao Jingzong, styled Zizhen, was a native of Xinye.',
    'Cao Jingzong, styled Zizhen, came from Xinye.',
  ],
  s0069: [
    'His father Xinbei was a Song general who reached Pacify the Barbarians General and Xuzhou Inspector.',
    'His father Xinbei was a Song general who rose to Pacify the Barbarians General and inspector of Xuzhou.',
  ],
  s0070: [
    'Jingzong in youth was skilled at riding and shooting and loved hunting.',
    'As a youth Jingzong excelled at riding and archery and loved the chase.',
  ],
  s0071: [
    'He often went with several dozen youths into the marshes to chase deer; when the crowd galloped at the deer, deer and horses became a chaos, yet Jingzong shot among them—everyone feared he would hit a horse\'s leg, but the deer at the bowstring\'s release always fell dead; he took this as his pleasure.',
    'He often rode with dozens of youths through the marshes after deer; when horses and deer tangled in the rush, he shot into the melee—men feared he would hit their mounts, yet every arrow dropped a deer, which he found delightful.',
  ],
  s0072: [
    'Before he had reached the weak-crown age, Xinbei at Xinye sent him out of the province with one horse and a few men; on the road he suddenly met several hundred Man bandits surrounding him.',
    'Before he came of age, Xinbei sent him out of Xinye with one horse and a few followers; on the road several hundred Man bandits suddenly surrounded him.',
  ],
  s0073: [
    'Jingzong carried more than a hundred arrows; he then galloped and shot in four directions, each arrow killing one barbarian, and the barbarians scattered and fled—thereby he became known for bold courage.',
    'He carried more than a hundred arrows, wheeled his horse, and shot in every direction, killing one tribesman with each shaft until they broke and fled; from then on he was famed for courage.',
  ],
  s0074: [
    'He quite loved historical writings; whenever he read the Records of Rang Ju and the Biography of Yue Yi, he would put down the scroll and sigh: "A man should be like this!',
    'He loved history; reading the Records of Rang Ju and the Biography of Yue Yi, he would close the scroll and sigh, "A man should be like this!',
  ],
  s0075: [
    '" He declined appointment to the Western Bureau.',
    '" He declined appointment to the Western Bureau.',
  ],
  s0076: [
    'In Yuanhui of Song he followed his father to the capital, served as Attendant at Court and Outer Member, and was transferred to Left People Officer of the Masters of Writing.',
    'In Song\'s Yuanhui era he followed his father to the capital as Attendant at Court and outer member, then became Left People Officer in the Masters of Writing.',
  ],
  s0077: [
    'Soon, on his father\'s death, he left office and returned to his home district.',
    'Soon his father died; he left office and went home.',
  ],
  s0078: [
    'When mourning ended, Inspector Xiao Chifu commissioned him as Champion Army Aide, concurrently Administrator of Tianshui.',
    'After mourning, Inspector Xiao Chifu made him Champion Army aide and concurrent administrator of Tianshui.',
  ],
  s0079: [
    'At the time, early in Jianyuan, Man bandits were active everywhere; Jingzong campaigned east and west, capturing and defeating many.',
    'Early in Jianyuan, when Man raiders rose on every side, Jingzong campaigned east and west and took many captives.',
  ],
  s0080: [
    'When Qi\'s Prince of Poyang Xiao Zhen held Yongzhou, Jingzong was again made Pacify the Barbarians Army Aide, concurrently Administrator of Fengyi, supervised military affairs south of Xian, and was promoted to Colonel of Garrison Cavalry.',
    'When Prince of Poyang Xiao Zhen became inspector of Yongzhou, Jingzong was again made Pacify the Barbarians army aide and administrator of Fengyi, supervised troops south of Xian, and was promoted to Colonel of Garrison Cavalry.',
  ],
  s0081: [
    'In youth he was on close terms with his fellow townsman Zhang Daomen.',
    'In youth he was close to a townsman, Zhang Daomen.',
  ],
  s0082: [
    'Daomen was the youngest son of Qi\'s Chariots and Cavalry General Jinger and served as Administrator of Wuling.',
    'Daomen was the youngest son of Qi\'s Chariots and Cavalry General Zhang Jinger and was administrator of Wuling.',
  ],
  s0083: [
    'When Jinger was executed, Daomen was executed in the commandery; kin and former subordinates none dared collect the corpse—yet Jingzong sent men and boats from Xiangyang to Wuling, collected the remains, and returned them for burial; the hometown therefore honored his righteousness.',
    'When Jinger was put to death, Daomen was executed in the commandery and none of kin or former staff dared claim the body; Jingzong sent men and boats from Xiangyang to Wuling, recovered the corpse, and buried it at home—the district praised his loyalty.',
  ],
  s0084: [
    'In the second year of Jianwu, Wei ruler Tuoba Hong raided Zheyang; Jingzong was a supporting general and each charge broke the enemy line, with beheadings each time; by merit he was made Raids General.',
    'In Jianwu year two Tuoba Hong of Wei raided Zheyang; Jingzong was a flank commander, broke the line each time he charged, and was made Raids General for merit.',
  ],
  s0085: [
    'In the fourth year Grand Commandant Chen Xianda commanded the armies north to besiege Maquan; Jingzong followed him and, with two thousand armored men, set an ambush and defeated Wei relief under Tuoba Ying—forty thousand men.',
    'In year four Grand Commandant Chen Xianda besieged Maquan in the north; Jingzong followed with two thousand armored men in ambush and routed forty thousand Wei troops under Tuoba Ying.',
  ],
  s0086: [
    'When Maquan was taken, Xianda assessed merit and ranked Jingzong last; Jingzong withdrew without complaint.',
    'When Maquan fell, Xianda ranked the merit and put Jingzong last; Jingzong withdrew without a word.',
  ],
  s0087: [
    'The Wei ruler led a great army up; Xianda fled by night, and Jingzong guided him into mountain paths—therefore Xianda and his son were wholly saved.',
    'The Wei ruler came in force; Xianda fled by night, and Jingzong led him through the mountains, so Xianda and his son escaped whole.',
  ],
  s0088: [
    'In the fifth year Gaozu was Yongzhou Inspector; Jingzong attached himself deeply and repeatedly invited Gaozu to his residence.',
    'In year five Gaozu was inspector of Yongzhou; Jingzong courted him closely and often asked him to his house.',
  ],
  s0089: [
    'At the time the realm was in disorder, and Gaozu also greatly favored him.',
    'The realm was in turmoil, and Gaozu in turn treated him generously.',
  ],
  s0090: [
    'At the beginning of Yongyuan he was memorialized as Champion General and Administrator of Jingling.',
    'At the start of Yongyuan he was recommended as Champion General and administrator of Jingling.',
  ],
  s0091: [
    'When the righteous army rose, Jingzong gathered troops and sent his kinsman Du Sichong to urge that they first welcome the Prince of Nankang at Xiangyang to ascend the throne and then march— a plan for complete security.',
    'When the righteous army rose, Jingzong mustered troops and sent his kinsman Du Sichong to urge welcoming the Prince of Nankang at Xiangyang as emperor before marching— a plan for perfect safety.',
  ],
  s0092: [
    'Gaozu did not follow—the account is in the Annals of Gaozu.',
    'Gaozu refused, as told in the Annals of Gaozu.',
  ],
  s0093: [
    'When Gaozu reached Jingling, he made Jingzong and Champion General Wang Mao cross the river and besiege Ying city; from the second month to the seventh the city then surrendered.',
    'At Jingling Gaozu sent Jingzong and Champion General Wang Mao across the river to besiege Ying; from the second month to the seventh month the city surrendered.',
  ],
  s0094: [
    'He again led troops as vanguard to Nanzhou and commanded horse and foot to take Jiankang.',
    'He again led the van to Nanzhou and commanded horse and foot against Jiankang.',
  ],
  s0095: [
    'Passing Jiangning, Dong Hun\'s general Li Jushi held Xinting with heavy troops; that day he selected a thousand elite cavalry to Jiangning marching halt—Jingzong had just arrived and his camp was not yet set;',
    'At Jiangning, Dong Hun\'s general Li Jushi held Xinting with a heavy force; that day he sent a thousand picked horsemen to Jingzong\'s halt—Jingzong had just arrived and his camp was not yet pitched;',
  ],
  s0096: [
    'moreover the army had marched long and weapons and armor were worn through; Jushi seeing this despised them and therefore beat drums, clamored, and pressed forward close on Jingzong.',
    'and the column had marched long, its arms in tatters; Jushi saw this, despised them, and charged with drums and shouts straight at Jingzong.',
  ],
  s0097: [
    'Jingzong donned armor and galloped to battle; in close combat they had barely joined when Jushi abandoned his armor and fled; Jingzong captured them all, then drummed forward and went straight to Zaojia Bridge to build a rampart.',
    'Jingzong armored and rode to meet them; in close fight Jushi threw off his armor and ran; Jingzong took them all, drummed forward, and built a rampart at Zaojia Bridge.',
  ],
  s0098: [
    'Jingzong again joined Wang Mao and Lu Sengzhen in a pincer attack and defeated Wang Zhenguo at the Great Floating Bridge.',
    'Jingzong again joined Wang Mao and Lu Sengzhen in a pincer and defeated Wang Zhenguo at the Great Floating Bridge.',
  ],
  s0099: [
    'Mao charged the hard center and it fell at once; Jingzong released troops to exploit the victory.',
    'Mao broke the enemy center and it collapsed at once; Jingzong drove the troops to press the rout.',
  ],
  s0100: [
    'Jingzong\'s soldiers were all fierce and unbridled ruffians; along the imperial avenue, right and left, there were none but wealthy houses—they looted goods and seized women and children, and Jingzong could not forbid it.',
    'Jingzong\'s men were violent and lawless; along the imperial way every house was rich, and they plundered goods and seized women and children—Jingzong could not stop them.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_009_b1.mjs <translation.json>'
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
