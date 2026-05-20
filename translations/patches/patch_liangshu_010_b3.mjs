#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'He was transferred to administrator of Fufeng and left office on his mother\'s mourning.',
    'He became administrator of Fufeng, then left office to mourn his mother.',
  ],
  s0202: [
    'Yongzhou Inspector Chen Xianda raised him as General Who Pacifies the North.',
    'Yongzhou inspector Chen Xianda raised him as General Who Pacifies the North.',
  ],
  s0203: [
    'He again held the post of administrator.',
    'He again held the post of administrator.',
  ],
  s0204: [
    'Before long the Prince of Badong, Jingzhou inspector, plotted rebellion; Gongze led troops to attack him.',
    'Soon after, the Prince of Badong, as Jingzhou inspector, raised rebellion; Gongze marched against him.',
  ],
  s0205: [
    'When the affair was settled, he was transferred to administrator of Wuning.',
    'When order was restored, he was made administrator of Wuning.',
  ],
  s0206: [
    'Seven years in the commandery, his household not a dan and stone to its name; the common people found his rule a blessing.',
    'For seven years in the commandery he owned scarcely a bushel of grain, yet the people flourished under him.',
  ],
  s0207: [
    'He entered office as General of the Vanguard.',
    'He entered the capital as General of the Vanguard.',
  ],
  s0208: [
    'When the Prince of Nankang held Jingzhou, he again became western middle army central military aide.',
    'When the Prince of Nankang took Jingzhou, he again served as western middle army central military aide.',
  ],
  s0209: [
    'Commandant of Guards Xiao Yingmao joined the righteous rising and made Gongze General Who Supports the State, concurrent western middle army consultant aide, central army duties unchanged, and led his forces east.',
    'When Commandant of Guards Xiao Yingmao joined the righteous rising, Gongze was made General Who Supports the State and concurrent western middle army consultant aide, kept his central army post, and led his men east.',
  ],
  s0210: [
    'At the time Zhang Baoji, acting for Xiangzhou, had raised troops to hold himself and did not know whom to follow; Gongze\'s army reached Baling and turned south to attack.',
    'Zhang Baoji, acting for Xiangzhou, had mobilized to hold his ground and wavered between sides; when Gongze reached Baling he swung south to subdue him.',
  ],
  s0211: [
    'The army halted at Baisha; Baoji grew afraid, laid down arms, and waited.',
    'The army stopped at Baisha; Baoji, afraid, disarmed and waited.',
  ],
  s0212: [
    'When Gongze arrived he comforted and accepted him, and Xiang territory was settled.',
    'Gongze arrived, reassured him, and took him in; Xiang was pacified.',
  ],
  s0213: [
    'When Emperor He ascended, Gongze was granted Bearer of the Staff, superintendent of all military affairs of Xiangzhou, and inspector of Xiangzhou.',
    'When Emperor He took the throne, Gongze received the staff, command of Xiangzhou forces, and the inspectorship of Xiangzhou.',
  ],
  s0214: [
    'Gaozu halted the massed armies at Hankou; Sun Lezu, lord of Lushan city, and Yingzhou Inspector Zhang Chong each held a city not yet taken; Gongze led the Xiang office troops to join at Xiakou.',
    'Gaozu camped the main armies at Hankou while Sun Lezu held Lushan and Zhang Chong held Ying; Gongze brought the Xiang forces to Xiakou.',
  ],
  s0215: [
    'At the time all Jingzhou armies were under Gongze\'s command; even Xiao Yingda of the imperial clan\'s eminence was subordinate to him.',
    'Every army in Jingzhou now answered to Gongze—even Xiao Yingda of the imperial house marched under his orders.',
  ],
  s0216: [
    'He was repeatedly promoted to General Who Captures the Barbarians and Left Guard General; Bearer of the Staff and inspector remained as before.',
    'He rose to General Who Captures the Barbarians and Left Guard General, keeping the staff and the inspectorship.',
  ],
  s0217: [
    'When Ying city fell, Gaozu ordered every army to march down that same day; Gongze received orders as vanguard and struck straight at Chaisang.',
    'Ying fell; Gaozu ordered a general advance that day; Gongze went first and seized Chaisang.',
  ],
  s0218: [
    'When Jiangzhou was settled, linked banners moved east and went straight to the capital.',
    'Jiangzhou secured, the banners turned east and bore straight on the capital.',
  ],
  s0219: [
    'Gongze\'s orders were strict and clear; not a hair was harmed; wherever he passed, people relied on him.',
    'Gongze\'s discipline was iron; nothing was taken; wherever his men went, people trusted them.',
  ],
  s0220: [
    'When the great army reached Xinlin, Gongze moved from Yue city to camp at the north tower of the Commandant of Guards headquarters rampart, opposite the South Yeb Gate, and once climbed the tower to watch the fighting.',
    'At Xinlin, Gongze shifted from Yue city to the north tower of the commandant\'s rampart, facing the South Yeb Gate, and watched the battle from above.',
  ],
  s0221: [
    'In the city men saw his banners and canopy from afar and let fly divine-edge crossbows; an arrow pierced his folding chair, and those at his side all turned pale.',
    'From the walls they saw his canopy and shot with divine-edge crossbows; a bolt drove through his camp chair, and his attendants blanched.',
  ],
  s0222: [
    'Gongze said: "Nearly hit my foot.',
    'Gongze said, "That almost took my foot.',
  ],
  s0223: [
    '" He talked and laughed as before.',
    '" Then he joked as if nothing had happened.',
  ],
  s0224: [
    'Dong Hun at night chose brave men to attack Gongze\'s palisade; the army was alarmed and stirred, but Gongze lay firm and would not rise, slowly ordered a counterattack, and Dong Hun\'s troops withdrew.',
    'Dong Hun sent picked warriors by night against Gongze\'s camp; the lines panicked, but Gongze stayed in bed, gave the order to strike, and the enemy fell back.',
  ],
  s0225: [
    'Gongze\'s troops were mostly men of the Xiang streams, by nature timid; inside the city they were despised as easy prey, and whenever raiders went out they always struck Gongze\'s camp first.',
    'His men were mostly Xiang river folk, thought soft; the defenders mocked them and made Gongze\'s camp their first target on every sortie.',
  ],
  s0226: [
    'Gongze encouraged his soldiers, and they took more captives and booty.',
    'Gongze roused his troops, and they brought back richer spoils each time.',
  ],
  s0227: [
    'When the city was pacified, those who came out were sometimes stripped and robbed; Gongze personally led his men and formed ranks at the East Yeb Gate to guard and escort nobles and commoners, so most who left passed through Gongze\'s camp.',
    'After the fall, looters preyed on those leaving the city; Gongze lined his men at the East Yeb Gate and escorted officials and people safely out, and most exits ran through his camp.',
  ],
  s0228: [
    'He was advanced to Left General; Bearer of the Staff and inspector remained as before, and he returned to garrison the southern marches.',
    'He was promoted to Left General, kept staff and inspectorship, and returned to hold the south.',
  ],
  s0229: [
    'When Gongze had first marched east, many commanderies of the Xiang region had not yet submitted; when Gongze returned to the province, then all fortified clusters dispersed.',
    'On his first march east many Xiang commanderies had held back; only when he came back did the hill forts melt away.',
  ],
  s0230: [
    'In Tianjian year 1 he was advanced to General Who Pacifies the South, enfeoffed as Marquis of Ningdu district with a fief of one thousand five hundred households.',
    'In Tianjian year 1 he became General Who Pacifies the South and Marquis of Ningdu with fifteen hundred households.',
  ],
  s0231: [
    'Xiangzhou had suffered banditry for years and the people had scattered; Gongze lightened punishments and levies, and before long households filled and were restored.',
    'Years of raiding had emptied Xiangzhou; Gongze eased law and tax, and soon the registers swelled again.',
  ],
  s0232: [
    'In governance he lacked awe-inspiring sternness, yet he kept himself in integrity and caution, and officials and commoners loved him.',
    'He ruled without harsh display, but he was honest and careful, and officials and people adored him.',
  ],
  s0233: [
    'In Xiang custom lone families used bribes to win provincial posts; when Gongze arrived he cut it all off; those he recruited were all prominent surnames of province and commandery, and Gaozu circulated his example to every province.',
    'Xiang families had bought office with gifts; Gongze ended that, appointed only notable local houses, and Gaozu made every province follow his model.',
  ],
  s0234: [
    'In year 4 he was summoned to be Central Army Protector.',
    'In year 4 he was called to the capital as Central Army Protector.',
  ],
  s0235: [
    'When his successor arrived he boarded two light boats and set out at once, taking none of the farewell gifts.',
    'His replacement came; he took two light boats and left that day, refusing every parting gift.',
  ],
  s0236: [
    'He was then transferred to Court Commandant with the additional title Palace Attendant Who Remains at Ease.',
    'He was then made Court Commandant and Palace Attendant Who Remains at Ease.',
  ],
  s0237: [
    'The court had begun to discuss a northern expedition; because Gongze\'s repute was long established, on reaching the capital an edict granted him temporary staff to encamp first at Luokou.',
    'As the court debated a northern campaign, Gongze\'s fame brought him to the capital with orders to take the staff and hold Luokou ahead of the army.',
  ],
  s0238: [
    'On receiving his orders Gongze fell ill and told those close to him: "In old days Lian Po and Ma Yuan, though set aside for age, still strove to ask for employment.',
    'Gongze took the commission but fell ill and told his kin, "Long ago Lian Po and Ma Yuan were cast off as old men, yet they still begged to serve.',
  ],
  s0239: [
    'Now the state does not regard my decayed weakness and appoints me vanguard—compared with the ancients, the trust is weighty indeed.',
    'The state does not despise my frailty but puts me in the van—that is heavier honor than they knew.',
  ],
  s0240: [
    'Though illness afflicts me on the road, how can I bow my head and decline the charge?',
    'I am sick on the march, but how can I cringe away from the task?',
  ],
  s0241: [
    'Burial wrapped in horse hide—this is my wish.',
    'To come home in horse leather—that is what I want.',
  ],
  s0242: [
    '" Thereupon he forced himself up and boarded ship.',
    '" He dragged himself aboard.',
  ],
  s0243: [
    'Reaching Luokou, gentlemen and women of Shouchun who submitted numbered several thousand households.',
    'At Luokou several thousand households of Shouchun came over to him.',
  ],
  s0244: [
    'Wei Yuzhou Inspector Xue Gongdu sent Chief Clerk Shi Rong as vanguard to meet battle; Gongze at once beheaded Shi Rong, pursued north to Shouchun, and turned back only when several tens of li from the city.',
    'Wei\'s Yuzhou inspector Xue Gongdu sent his chief clerk Shi Rong to fight; Gongze killed him at once, chased to Shouchun, and withdrew ten-odd li from the walls.',
  ],
  s0245: [
    'He died of illness in the army, aged sixty-one.',
    'Illness took him in camp at sixty-one.',
  ],
  s0246: [
    'Gaozu grieved deeply, held mourning that same day, and posthumously made him General of Chariots and Cavalry with one set of martial pipes and drums.',
    'Gaozu mourned him the same day, posthumously made him General of Chariots and Cavalry, and granted martial pipes and drums.',
  ],
  s0247: [
    'Posthumous name Lie.',
    'His posthumous name was Lie, "Fierce."',
  ],
  s0248: [
    'Gongze was by nature thick in kindness and love; at home he was devoted and harmonious, regarded his brother\'s sons more than his own, and entrusted all family wealth to them.',
    'Gongze was gentle and warm at home, favored his brother\'s sons over his own, and gave them the whole household fortune.',
  ],
  s0249: [
    'He loved learning; though in the army his hand never left the scroll, and scholar-officials praised him for it.',
    'He loved books; even in camp he read without pause, and the gentry spoke of it with respect.',
  ],
  s0250: [
    'His son Biao succeeded; he committed a crime and the fief was extinguished.',
    'His son Biao inherited, then forfeited the fief for a crime.',
  ],
  s0251: [
    'Gaozu, because Gongze was a meritorious minister, issued a special edict allowing the eldest son by a concubine, Tuan, to succeed.',
    'Gaozu, honoring Gongze\'s service, specially allowed his eldest son by a concubine, Tuan, to inherit.',
  ],
  s0252: [
    'Tuan firmly declined; only after years did he accept.',
    'Tuan refused for years before he would take the title.',
  ],
  s0253: [
    'Deng Yuanqi, styled Zhongju, was a native of Dangyang in Nan commandery.',
    'Deng Yuanqi, styled Zhongju, came from Dangyang in Nan commandery.',
  ],
  s0254: [
    'In youth he had courage and ability; his physical strength surpassed other men.',
    'As a youth he was bold and strong beyond ordinary men.',
  ],
  s0255: [
    'By nature chivalrous, he loved giving relief; many young men of the village attached themselves to him.',
    'He was a rover who gave freely, and the young men of the countryside followed him.',
  ],
  s0256: [
    'He began his career with a provincial summons as aide in the discussion affairs bureau and was transferred to Court Gentleman for the Court.',
    'The province first summoned him as discussion-affairs aide; he later became a court gentleman.',
  ],
  s0257: [
    'Yongzhou Inspector Xiao Mian commissioned him magistrate of Huaili.',
    'Yongzhou inspector Xiao Mian appointed him magistrate of Huaili.',
  ],
  s0258: [
    'He was transferred to administrator of Hongnong and western pacification military affairs.',
    'He became administrator of Hongnong and held western pacification military affairs.',
  ],
  s0259: [
    'At the time Ma Rong of Xiyang led masses along the river to raid and plunder, cutting off merchants and travelers; Inspector Xiao Yaoxin sent Yuanqi to lead troops and pacify him.',
    'Ma Rong of Xiyang was raiding along the river and choking trade; inspector Xiao Yaoxin sent Yuanqi to crush him.',
  ],
  s0260: [
    'He was transferred to administrator of Wuning.',
    'He was made administrator of Wuning.',
  ],
  s0261: [
    'At the end of Yongyuan the Wei army pressed Yiyang; Yuanqi marched from his commandery to its relief.',
    'In the last years of Yongyuan Wei pressed Yiyang; Yuanqi came from his commandery to help.',
  ],
  s0262: [
    'The Man chief Tian Kongming had attached himself to Wei, styled himself Yingzhou inspector, raided the Three Passes, and plotted to strike Xiakou; Yuanqi led elite troops against him and within a month repeatedly took six cities, beheaded and captured by the tens of thousands, and the remnant factions all scattered and fled.',
    'The Man leader Tian Kongming joined Wei, called himself Yingzhou inspector, and raided the Three Passes toward Xiakou; Yuanqi struck with picked men, took six towns in a month, killed and captured by the ten thousands, and broke the rest.',
  ],
  s0263: [
    'He thereupon garrisoned the Three Passes.',
    'He then held the Three Passes.',
  ],
  s0264: [
    'Yingzhou Inspector Zhang Chong supervised military affairs north of the river; Yuanqi repeatedly wrote Chong asking to withdraw his army.',
    'Yingzhou inspector Zhang Chong commanded north of the river; Yuanqi wrote again and again asking leave to return.',
  ],
  s0265: [
    'Chong replied in a letter: "You there and I here—an inside-outside position, what they call a metal city and boiling pool;',
    'Chong answered, "You hold one gate and I the other—that is the golden rampart and boiling moat.',
  ],
  s0266: [
    'once you abandon it, brambles will grow."',
    'Leave it, and thorns spring up at once."',
  ],
  s0267: [
    'He thereupon memorialized Yuanqi as southern pacification central army military aide.',
    'He then memorialized Yuanqi as southern pacification central army military aide.',
  ],
  s0268: [
    'From this time every battle was a victory; his courage crowned the age, and men willing to die for him numbered more than ten thousand.',
    'After that he won every fight; no one matched his daring, and more than ten thousand men would die for him.',
  ],
  s0269: [
    'When the righteous army rose, Xiao Yingmao summoned him by letter.',
    'When the righteous cause rose, Xiao Yingmao called him by letter.',
  ],
  s0270: [
    'Zhang Chong had always treated Yuanqi generously, and the masses all feared Chong;',
    'Zhang Chong had long favored Yuanqi, and the troops feared offending him;',
  ],
  s0271: [
    'when the letter arrived, many of Yuanqi\'s followers urged him to return to Ying.',
    'when the summons came, many of his officers urged him back to Ying.',
  ],
  s0272: [
    'Yuanqi spoke grandly to the masses: "The court is violent and cruel, executing chief ministers; petty men wield commands, and the way of rites and caps is utterly exhausted.',
    'Yuanqi addressed the host: "The throne is savage, butchers its ministers, and lets lackeys rule—the rites are dead.',
  ],
  s0273: [
    'Jing and Yong together raise a great affair—what worry is there of not conquering?',
    'Jing and Yong rise together—how can we fail?',
  ],
  s0274: [
    'Moreover my old mother is in the west—how could I turn my back on my roots?',
    'My mother is still in the west—I cannot betray my home.',
  ],
  s0275: [
    'If the affair does not succeed, let me simply receive execution from this benighted court and luckily escape the crime of unfiliality."',
    'If we lose, let the dark court kill me and spare me the shame of a bad son."',
  ],
  s0276: [
    'That same day he prepared baggage and took the road.',
    'That day he packed and marched.',
  ],
  s0277: [
    'Reaching Jiangling, he was made western middle army central military aide with the additional title Champion General, led his masses, and joined Gaozu at Xiakou.',
    'At Jiangling he became western middle army central military aide and Champion General, then led his men to Gaozu at Xiakou.',
  ],
  s0278: [
    'Gaozu ordered Wang Mao, Cao Jingzong, and Yuanqi and the rest to besiege the city, linking ramparts for nine li; Zhang Chong fought repeatedly and was always heavily defeated, then closed the city and held firm.',
    'Gaozu set Wang Mao, Cao Jingzong, and Yuanqi to siege Ying with ramparts nine li long; Zhang Chong fought and lost again and again, then shut the gates and endured.',
  ],
  s0279: [
    'When the righteous army first rose, Yizhou Inspector Liu Jilian had held both ends;',
    'At first Yizhou inspector Liu Jilian had sat on the fence;',
  ],
  s0280: [
    'when he heard Yuanqi was coming, he sent troops to resist and hold.',
    'but when he heard Yuanqi was coming he armed the passes and resisted.',
  ],
  s0281: [
    'The account is in the biography of Liu Jilian.',
    'The fuller account is in Liu Jilian\'s biography.',
  ],
  s0282: [
    'When Yuanqi reached Baxi, Baxi Administrator Zhu Shilue opened the gates to await him.',
    'Yuanqi reached Baxi, and administrator Zhu Shilue opened the city to him.',
  ],
  s0283: [
    'Earlier many people of Shu had fled; now they came out to join Yuanqi, all calling it a righteous rising in answer to the court; new and old in the army numbered more than thirty thousand.',
    'Shu refugees who had hidden now flocked to him as men answering the throne; his army, old and new, passed thirty thousand.',
  ],
  s0284: [
    'Yuanqi had been long on the road and army grain was exhausted.',
    'Yuanqi had marched so long that the granaries were empty.',
  ],
  s0285: [
    'Someone advised him: "Shu governance is slack and the people often feign illness; if you investigate the register of Baxi commandery alone, distress them and punish them, the harvest will surely be rich."',
    'An adviser said, "Shu is slack and the people lie about sickness; audit one commandery, Baxi, squeeze and fine them, and you will fill the stores."',
  ],
  s0286: [
    'Yuanqi approved.',
    'Yuanqi agreed.',
  ],
  s0287: [
    'Fuling Magistrate Li Ying remonstrated: "My lord has a fierce enemy ahead and no relief behind; the hill people have just attached themselves and are watching our virtue—if you investigate them with harshness the people cannot bear it, and once hearts divide, though you regret it nothing can be done. Why must you raise illness when you can thereby supply the army?',
    'Fuling magistrate Li Ying warned him, "You face a hard enemy ahead with no help behind; the hill folk have only just joined and are watching how you rule. Harsh levies will break them, and once they turn away you cannot win them back. Why invite trouble when you can feed the army another way?',
  ],
  s0288: [
    'Let Ying go out and devise a plan; there is no need to fear insufficient provisions."',
    'Let me try, and you will not lack grain."',
  ],
  s0289: [
    'Yuanqi said: "Good—I entrust it all to you."',
    'Yuanqi said, "Good—do as you will."',
  ],
  s0290: [
    'Ying withdrew, led wealthy households to submit army grain, and soon obtained thirty thousand hu.',
    'Li Ying left, rallied the rich to bring rice, and within days raised thirty thousand hu.',
  ],
  s0291: [
    'Yuanqi had earlier sent the generals Wang Yuanzong and the rest to defeat Jilian\'s general Li Fengbo at Xinba and Qi Wansheng at Chishui; the masses advanced and encamped at Xiping.',
    'Yuanqi had already sent Wang Yuanzong and others to beat Liu Jilian\'s Li Fengbo at Xinba and Qi Wansheng at Chishui, then pushed the host to Xiping.',
  ],
  s0292: [
    'Jilian then closed the city and held in self-defense.',
    'Jilian finally shut Chengdu and dug in.',
  ],
  s0293: [
    'Wansheng again defeated Yuanqi\'s general Lu Fangda at Hushi; more than a thousand soldiers died; the army was afraid; Yuanqi then personally led troops and gradually advanced to Jiangqiao, twenty li from Chengdu, leaving baggage at Pi.',
    'Qi Wansheng crushed Lu Fangda at Hushi and killed more than a thousand; the army shook; Yuanqi led the van himself to Jiangqiao, twenty li from Chengdu, and left the baggage at Pi.',
  ],
  s0294: [
    'Jilian again sent Fengbo and Wansheng with two thousand men by a hidden path to raid Pi, took it, and all military stores were lost.',
    'Jilian sent Fengbo and Wansheng with two thousand men by a bypath, seized Pi, and burned Yuanqi\'s stores.',
  ],
  s0295: [
    'Yuanqi sent Lu Fangda\'s troops to the rescue; they were defeated and returned, and he could not overcome.',
    'Yuanqi sent Lu Fangda to retake it; he was beaten back and could not break through.',
  ],
  s0296: [
    'Yuanqi abandoned Pi, went straight to besiege the provincial city, palisaded three sides, and dug moats.',
    'Yuanqi left Pi, ringed the provincial capital on three sides, and dug trenches.',
  ],
  s0297: [
    'Yuanqi went out to inspect the siege palisades; Jilian sent elite troops to ambush him; when they were about to reach his presence, Yuanqi descended from his carriage, held a shield, and shouted; the masses scattered and dared not advance.',
    'Yuanqi walked the lines; Jilian sent killers to rush him; as they closed in he stepped down, raised his shield, and roared them off.',
  ],
  s0298: [
    'Military chaos in Yizhou had lasted long; the people abandoned farming; inside and outside suffered bitter hunger; many ate one another; roads were cut off; Jilian\'s plans were exhausted.',
    'War had raged so long in Yizhou that fields lay waste, hunger ruled inside and out, men fed on men, and the roads were dead; Jilian was at his end.',
  ],
  s0299: [
    'The next year Gaozu sent orders pardoning Jilian\'s crimes and permitting his surrender.',
    'The following year Gaozu pardoned Jilian and promised to accept his surrender.',
  ],
  s0300: [
    'Jilian that same day opened the city and admitted Yuanqi; Yuanqi sent Jilian to the capital.',
    'Jilian opened the gates that day; Yuanqi took the city and sent him to the capital.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_010_b3.mjs <translation.json>'
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
