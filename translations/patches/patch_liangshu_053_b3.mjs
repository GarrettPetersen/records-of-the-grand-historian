#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'When Gaozu ascended the throne, he was transferred to Erudite of the National University; on his father\'s death he left office.',
    'When Gaozu took the throne, he was made Erudite of the National University, then left office to mourn his father.',
  ],
  s0202: [
    'When mourning ended, he became Army Adviser on the Chariots and Cavalry Campaign, rising through Chief Clerk of the Minister of Works, Attendant of the Secretariat, General of the Vanguard, and concurrent Erudite of the Five Classics; with Minister of Personnel Xu Mian and Attendant of the Secretariat Zhou She he oversaw the Five Rites.',
    'After mourning he served as Army Adviser on the Chariots and Cavalry Campaign, then rose through Chief Clerk of the Minister of Works, Attendant of the Secretariat, General of the Vanguard, and concurrent Erudite of the Five Classics; with Xu Mian of Personnel and Zhou She of the Secretariat he oversaw the Five Rites.',
  ],
  s0203: [
    'He went out as Internal Magistrate of Yongyang; in the commandery he was pure and clean, and his governance was tranquil.',
    'He went out as internal magistrate of Yongyang, governing with purity and quiet efficiency.',
  ],
  s0204: [
    'One hundred fifty-four commandery commoners including He Zhenxiu went to the province to report his conduct; the Inspector of Xiangzhou memorialized it.',
    'One hundred fifty-four commoners including He Zhenxiu went to the province to praise his conduct, and the inspector of Xiangzhou reported it upward.',
  ],
  s0205: [
    'An edict reviewed and found fifteen matters for which officials and people cherished him; Gaozu approved and summoned him as Administrator of Xin\'an.',
    'An imperial review found fifteen deeds that officials and people cherished; Gaozu approved and summoned him as administrator of Xin\'an.',
  ],
  s0206: [
    'In the commandery he was pure and scrupulous, as in Yongyang times.',
    'In the commandery he was pure and scrupulous, as he had been at Yongyang.',
  ],
  s0207: [
    'For commoners who could not meet tax levies, he at once supplied them from the administrator\'s field grain.',
    'When commoners could not meet their tax levies, he paid from the administrator\'s own field grain.',
  ],
  s0208: [
    'The commandery had much hemp and ramie, yet his household came to lack even rope for binding—such was his stern resolve.',
    'The commandery abounded in hemp and ramie, yet his household lacked even rope to bind things—such was his austerity.',
  ],
  s0209: [
    'The subordinate counties Shixin, Suian, and Haining all while he still lived built shrines to him.',
    'The subordinate counties Shixin, Suian, and Haining all built living shrines to him while he was still in office.',
  ],
  s0210: [
    'He was summoned as Erudite of the National University and concurrently Colonel of the Changshui Guard.',
    'He was summoned as Erudite of the National University and concurrently colonel of the Changshui Guard.',
  ],
  s0211: [
    'At the time He Yuan, Internal Magistrate of Shixing, had repeatedly shown pure merit; Gaozu edicted his promotion to Attendant of the Yellow Gate, and soon he was transferred to General of Trustworthy Might and Supervisor of Wu commandery.',
    'At the time He Yuan, internal magistrate of Shixing, had repeatedly shown pure merit; Gaozu promoted him to Attendant of the Yellow Gate, and soon made him General of Trustworthy Might and supervisor of Wu commandery.',
  ],
  s0212: [
    'Xuan thought his name and seniority had always ranked above Yuan\'s—both were called pure in office—yet Yuan was repeatedly promoted while Xuan only advanced in rank; dissatisfied with his prospects, he often pleaded illness and stayed home.',
    'Xuan believed his name and seniority had always outranked Yuan\'s—both were praised as incorrupt officials—yet Yuan was promoted again and again while Xuan only moved up in rank; bitter and dissatisfied, he often pleaded illness and stayed home.',
  ],
  s0213: [
    'Soon he sought leave to go to Dongyang for his sister\'s funeral, then stayed in Kuaiji building a house; he memorialized to resign, Gaozu edicted him Internal Magistrate of Yuzhang, and Xuan at last went out to take the appointment.',
    'Soon he asked leave to go to Dongyang for his sister\'s funeral, then remained in Kuaiji building a house; he memorialized to resign, Gaozu appointed him internal magistrate of Yuzhang, and Xuan at last went out to accept.',
  ],
  s0214: [
    'Imperial Secretary in the Office of the Censor Yu Yan memorialized:',
    'Imperial Secretary in the Office of the Censor Yu Yan memorialized:',
  ],
  s0215: [
    'I have heard that when loyalty and trust are lost, the way of single-heartedness is impaired;',
    'I have heard that when loyalty and trust are lost, the path of undivided devotion is broken;',
  ],
  s0216: [
    'when the face is yes and the heart is no, the execution at the Two Watchtowers should follow.',
    'when appearance and feeling diverge, the punishment of the Two Watchtowers is warranted.',
  ],
  s0217: [
    'Never has one who violated name and teaching and importuned against lord and kin been fit to weave custom and govern the realm.',
    'No one who tramples name and teaching and importunes lord and kin can weave custom and govern the realm.',
  ],
  s0218: [
    'By report Internal Magistrate of Yuzhang Fu Xuan, last year sought leave on the pretext of meeting his sister\'s funeral, then halted in Kuaiji and did not leave.',
    'By report Fu Xuan, internal magistrate of Yuzhang, last year sought leave to meet his sister\'s funeral, then stayed in Kuaiji and never returned.',
  ],
  s0219: [
    'At the start of entering the east, he mortgaged a house and sold a carriage.',
    'As soon as he entered the east, he mortgaged a house and sold a carriage.',
  ],
  s0220: [
    'From this one infers he originally had no intention of returning.',
    'From this one infers he never meant to return.',
  ],
  s0221: [
    'Xuan had governed two commanderies and had few taints of greed and corruption—this itself is the root of governing; how can it be called merit?',
    'Xuan had governed two commanderies with little taint of greed— that is merely the baseline of office; how can it be called merit?',
  ],
  s0222: [
    'He constantly held that in talent, rank, and reputation he stood above He Yuan, yet Yuan was promoted for pure integrity and name and office rose ever higher; Xuan deeply resented and blamed, showing it in word and face, sighing and lamenting waking and sleeping, losing his design in dreams.',
    'He constantly held that in talent, rank, and reputation he stood above He Yuan, yet Yuan was promoted for pure integrity while name and office rose ever higher; Xuan seethed with resentment, showing it in word and face, sighing day and night and losing sleep over it.',
  ],
  s0223: [
    'Heaven is high yet listens below; nothing private escapes its light.',
    'Heaven is high yet hears what is low; nothing hidden escapes its gaze.',
  ],
  s0224: [
    'On the twenty-first day of the twelfth month last year an edict said: "Erudite of the National University and Colonel of the Changshui Guard Fu Xuan, governing with pure fairness—nurture him accordingly; do not let resentment and desire impair the scholar\'s wind.',
    'On the twenty-first day of the twelfth month last year an edict said: "Erudite of the National University and colonel of the Changshui Guard Fu Xuan governs with pure fairness; nurture him and do not let resentment impair the scholar\'s wind.',
  ],
  s0225: [
    'Let him be Internal Magistrate of Yuzhang."',
    'Let him be internal magistrate of Yuzhang."',
  ],
  s0226: [
    'Could a minister receiving such an edict fail to lose soul and break gall, returning blame to the responsible office;',
    'Could any minister receiving such an edict fail to lose soul and break gall, turning blame upon himself;',
  ],
  s0227: [
    'pull out hair and rend bowels, and offer some apology?',
    'pull out his hair and rend his bowels in remorse and offer apology?',
  ],
  s0228: [
    'Yet he followed and accepted with arrogant composure, showing not the slightest change of color.',
    'Yet he accepted it with arrogant composure, showing not the slightest change of color.',
  ],
  s0229: [
    'Xuan\'s insight reaches this far—he fully grasped the intent—yet he accepted favor without declining, stingy in grasping what was opportunely gained; hence scholar-officials dissolved in disgust and travelers seethed; tracing deeds to seek the heart, not one thing can be pardoned.',
    'Xuan understood this perfectly, yet accepted favor without declining, clinging to opportune gain; scholar-officials were disgusted, travelers seethed, and tracing deed to intent, nothing can be pardoned.',
  ],
  s0230: [
    'I venture that Xuan, stumbling and fallen for thirty-odd years, when imperial fortune surged anew—all sharing in the founding, removing the old and spreading the new, washed in the Jiang and Han—in the span of one era three generations rose to glory.',
    'I venture that Xuan, adrift and fallen for thirty-odd years, when imperial fortune surged—all sharing in the founding, washing away the old in the Jiang and Han—in one era three generations rose to glory.',
  ],
  s0231: [
    'He could not harbor the least gratitude, repaying the smallest fraction on high; instead by clumsy schemes he wrought this artful crime—disloyalty and disrespect have reached this point.',
    'He could not feel the least gratitude or repay the smallest fraction; instead by clumsy scheming he wrought this artful crime—disloyalty and disrespect have reached this point.',
  ],
  s0232: [
    'I ask that Xuan be judged under Great Irreverence.',
    'I ask that Xuan be judged under Great Irreverence.',
  ],
  s0233: [
    'Reviewing the matter against the law, he deserves execution and display in market; I have him taken to the nearest prison for examination and closure, to be dealt with by law.',
    'Reviewing the matter against the law, he deserves execution at market; I have had him taken to the nearest prison for examination and closure, to be dealt with by law.',
  ],
  s0234: [
    'As the law provides, Xuan is the principal offender.',
    'As the law provides, Xuan is the principal offender.',
  ],
  s0235: [
    'I respectfully charge: Internal Magistrate of Yuzhang, minister Fu Xuan, bearing flaws that mark his conduct, leaning on perversity as his heart; in speech and silence alike he violated duty, exhausting what should be reverence.',
    'I respectfully charge: internal magistrate of Yuzhang, minister Fu Xuan, whose flaws mark his conduct and whose perversity has become his heart; in speech and silence alike he violated duty and exhausted all reverence owed.',
  ],
  s0236: [
    'Fortunate to live in a flourishing age, he was promoted out of turn.',
    'Fortunate to live in a flourishing age, he was promoted out of turn.',
  ],
  s0237: [
    'Ravines and gullies can be filled, yet ambition and desire know no satisfaction.',
    'Ravines and gullies can be filled, yet ambition and desire know no limit.',
  ],
  s0238: [
    'Importuning his lord to flee east—can this be called the return of knowing when to stop?',
    'Importuning his lord to flee east—can this be called knowing when to stop?',
  ],
  s0239: [
    'Bearing resentment to remove the towel—different from the reach of one stirred to withdrawal.',
    'Bearing resentment while doffing office—far from the impulse that drives a man to withdraw.',
  ],
  s0240: [
    'Savoring this fat and grease—what is not bitter thorn?',
    'Savoring this fat and grease—what is not bitter as thorn?',
  ],
  s0241: [
    'Wearing these turtle seals and silken cords—how is it different from hemp bonds?',
    'Wearing these turtle seals and silken cords—how is it different from hempen bonds?',
  ],
  s0242: [
    'Wind and law should be made clear; the red bamboo registers should be sternly corrected.',
    'Wind and law should be made clear; the red registers should be sternly corrected.',
  ],
  s0243: [
    'We counsellors jointly propose: on grounds of the present case remove Xuan from all offices held—every rank and appointment, delete entirely.',
    'We counsellors jointly propose: on grounds of the present case remove Xuan from all offices held—every rank and appointment, delete entirely.',
  ],
  s0244: [
    'An edict came not to prosecute; Xuan thus took up the commandery.',
    'An edict came not to prosecute; Xuan thus took up the commandery.',
  ],
  s0245: [
    'After three years in office he was summoned as Secretariat Attendant of the Yellow Gate and concurrent Erudite of the National University; before he could take up the appointment—',
    'After three years in office he was summoned as Secretariat Attendant of the Yellow Gate and concurrent Erudite of the National University, but before he could take up the appointment—',
  ],
  s0246: [
    'In the first year of Putong he died in the commandery, aged fifty-nine.',
    'In the first year of Putong he died in the commandery, aged fifty-nine.',
  ],
  s0247: [
    'Right Vice Minister of Works Xu Mian wrote his tomb inscription; one section reads: "In the eastern districts and southern realm, affection bound officials and people; crowding the gate in prostration, one after another they memorialized in writing.',
    'Right Vice Minister of Works Xu Mian wrote his tomb inscription; one section reads: "In the eastern districts and southern realm, affection bound officials and people; crowding the gate in prostration, one after another they memorialized in writing.',
  ],
  s0248: [
    'Some lay on his carriage tracks, some pulled at his cart, some painted his likeness, some bowed at his lane."',
    'Some lay across his carriage tracks, some pulled at his cart, some painted his likeness, some bowed at his lane."',
  ],
  s0249: [
    'Longing for Geng and borrowing Kou—how can this be surpassed?"',
    'Longing for Geng and borrowing Kou—how can this be surpassed?"',
  ],
  s0250: [
    'Earlier, Xuan\'s father Manrong and Ren Yao of Lean both found shelter with Qi Grand Marshal Wang Jian; Yao\'s son Fang and Xuan were both recognized.',
    'Earlier, Xuan\'s father Manrong and Ren Yao of Lean both found shelter with Qi Grand Marshal Wang Jian; Yao\'s son Fang and Xuan were both recognized.',
  ],
  s0251: [
    'Before long Fang\'s talent and favor grew; by the end of Qi, Fang was already Right Chief Clerk of the Minister of Education while Xuan still languished as a staff officer;',
    'Before long Fang\'s talent and favor grew; by the end of Qi, Fang was already right chief clerk of the Minister of Education while Xuan still languished as a staff officer;',
  ],
  s0252: [
    'yet when Fang died, name and rank were roughly equal.',
    'yet when Fang died, name and rank were roughly equal.',
  ],
  s0253: [
    'Xuan was frugal and plain by nature; carriage and dress were coarse and poor; outwardly he seemed withdrawn and calm, inwardly he could not escape rivalry of heart—hence ridicule in his day.',
    'Xuan was frugal and plain by nature; carriage and dress were coarse; outwardly withdrawn and calm, inwardly he could not escape rivalry—hence ridicule in his day.',
  ],
  s0254: [
    'He could recommend those who came after, as if always falling short; young scholar-officials sometimes relied on him for this.',
    'He could recommend those who came after, as if always falling short; young scholar-officials sometimes relied on him for this.',
  ],
  s0255: [
    'He Yuan, styled Yifang, was a man of Tan in Donghai commandery.',
    'He Yuan, styled Yifang, came from Tan in Donghai commandery.',
  ],
  s0256: [
    'His father Huiju was Qi Gentleman of the Masters of Writing.',
    'His father Huiju was Qi Gentleman of the Masters of Writing.',
  ],
  s0257: [
    'Yuan began his career as Gentleman of the Kingdom of Jiangxia and transferred to Respite at Court.',
    'Yuan began as Gentleman of the Kingdom of Jiangxia and transferred to Respite at Court.',
  ],
  s0258: [
    'In Yongyuan, Prince of Jiangxia Bao Xuan at Jingkou was backed by Guard General Cui Huijing and entered to besiege the palace city; Yuan took part in the affair.',
    'In Yongyuan, Prince of Jiangxia Bao Xuan at Jingkou was backed by Guard General Cui Huijing and entered to besiege the palace city; Yuan took part.',
  ],
  s0259: [
    'When the affair failed, he fled to Prince of Changsha, the Xuanwu King, who deeply protected and hid him.',
    'When the affair failed, he fled to the Xuanwu King, Prince of Changsha, who deeply protected and hid him.',
  ],
  s0260: [
    'Yuan found Prince of Guiyang Wang Rong to shelter him; when this was discovered and arresters came, Yuan scaled a wall and escaped;',
    'Yuan found Prince of Guiyang Wang Rong to shelter him; when this was discovered and arresters came, Yuan scaled a wall and escaped;',
  ],
  s0261: [
    'Rong and Yuan\'s family were all seized; Rong met disaster, and Yuan\'s kin were held in the Imperial Workshop.',
    'Rong and Yuan\'s family were all seized; Rong met disaster, and Yuan\'s kin were held in the Imperial Workshop.',
  ],
  s0262: [
    'Yuan fled across the river and had his old acquaintance Gao Jiangchan gather men to welcome Gaozu\'s righteous army; Donghun\'s faction heard and sent to capture Yuan and the rest—the crowd scattered again.',
    'Yuan fled across the river and had his old acquaintance Gao Jiangchan gather men to welcome Gaozu\'s righteous army; Donghun\'s faction heard and sent to capture them—the crowd scattered again.',
  ],
  s0263: [
    'Yuan then surrendered to Wei, entered Shouyang, saw Inspector Wang Su, wished to join in righteous action; Su could not employ him, so he asked to welcome Gaozu—Su consented.',
    'Yuan then surrendered to Wei, entered Shouyang, and saw Inspector Wang Su, wishing to join in righteous action; Su could not employ him, so he asked to welcome Gaozu—and Su consented.',
  ],
  s0264: [
    'Su sent troops to escort him, and he reached Gaozu.',
    'Su sent troops to escort him, and he reached Gaozu.',
  ],
  s0265: [
    'Gaozu saw Yuan and said to Zhang Hongce: "He Yuan is a fine man—able to ruin his family to repay old kindness; not easy to match."',
    'Gaozu saw Yuan and said to Zhang Hongce: "He Yuan is a fine man—able to ruin his family to repay old kindness; not easy to match."',
  ],
  s0266: [
    'He was provisionally made General Who Supports the State, followed the army east; after the Zhuzque army was broken, he was made Magistrate of Jiankang.',
    'He was provisionally made General Who Supports the State, followed the army east; after the Zhuzque army was broken, he was made magistrate of Jiankang.',
  ],
  s0267: [
    'When Gaozu ascended the throne, he was Colonel of the Footsoldiers; for merit in welcoming the throne he was enfeoffed as Baron of Guangxing, fief of three hundred households.',
    'When Gaozu took the throne, he was colonel of the Footsoldiers; for merit in welcoming the throne he was enfeoffed as Baron of Guangxing, fief of three hundred households.',
  ],
  s0268: [
    'He was transferred to General Who Establishes Might and Recorder of the Rear Army under the Prince of Poyang, Hui.',
    'He was transferred to General Who Establishes Might and recorder of the rear army under Prince Hui of Poyang.',
  ],
  s0269: [
    'Yuan and Hui had long been on good terms; in the princely office he exhausted his will and strength, leaving nothing undone; Hui too relied on him with open heart—favor and trust were very close.',
    'Yuan and Hui had long been on good terms; in the princely office he exhausted his will and strength, leaving nothing undone; Hui too relied on him with open heart—favor and trust were very close.',
  ],
  s0270: [
    'Before long he was transferred to Administrator of Wuchang.',
    'Before long he was transferred to administrator of Wuchang.',
  ],
  s0271: [
    'Yuan had been free and easy by nature, fond of light chivalry; now he restrained himself as an official, cut off social ties, and accepted not the slightest gift.',
    'Yuan had been free and easy by nature, fond of light chivalry; now he restrained himself as an official, cut off social ties, and accepted not the slightest gift.',
  ],
  s0272: [
    'Custom in Wuchang was to draw from the river; in high summer Yuan feared the warm water and always bought cold well water from commoners with cash;',
    'Custom in Wuchang was to draw from the river; in high summer Yuan feared the warm water and always bought cold well water from commoners with cash;',
  ],
  s0273: [
    'those who would not take money, he drew water for them in return.',
    'those who would not take money, he drew water for them in return.',
  ],
  s0274: [
    'Other matters were mostly like this.',
    'Other matters were mostly like this.',
  ],
  s0275: [
    'The track may seem like artifice, yet he could bend and turn with thoughtful intent.',
    'The track may seem like artifice, yet he could bend and turn with thoughtful intent.',
  ],
  s0276: [
    'Carriage and dress were especially worn and plain; utensils had no bronze or lacquer.',
    'Carriage and dress were especially worn and plain; utensils had no bronze or lacquer.',
  ],
  s0277: [
    'South of the Yangtze has many aquatic foods, very cheap; Yuan\'s meals were no more than a few slices of dried fish.',
    'South of the Yangtze has many aquatic foods, very cheap; Yuan\'s meals were no more than a few slices of dried fish.',
  ],
  s0278: [
    'Yet his nature was hard and severe; officials and people often suffered whipping over small matters—thus someone sued him; he was summoned to the Minister of Justice and impeached on several dozen counts.',
    'Yet his nature was hard and severe; officials and people often suffered whipping over small matters—thus someone sued him; he was summoned to the Minister of Justice and impeached on several dozen counts.',
  ],
  s0279: [
    'At the time when scholar-officials faced the law, none would stand for questioning; Yuan judged himself innocent of corruption, stood for inquiry, and for twenty-seven days made no confession—yet was still struck from the rolls for privately storing forbidden weapons.',
    'At the time when scholar-officials faced the law, none would stand for questioning; Yuan judged himself innocent of corruption, stood for inquiry, and for twenty-seven days made no confession—yet was still struck from the rolls for privately storing forbidden weapons.',
  ],
  s0280: [
    'Later he was restored as staff officer to the General Who Pacifies the South and Magistrate of Wukang.',
    'Later he was restored as staff officer to the General Who Pacifies the South and magistrate of Wukang.',
  ],
  s0281: [
    'He redoubled his integrity, eliminated illicit shrines, corrected his person and led his duty—the people praised him greatly.',
    'He redoubled his integrity, eliminated illicit shrines, corrected his person and led his duty—the people praised him greatly.',
  ],
  s0282: [
    'Administrator Wang Bin toured subordinate counties; each county lavishly prepared provision tents to receive him—at Wukang, Yuan alone set out parched grain and water.',
    'Administrator Wang Bin toured subordinate counties; each county lavishly prepared provision tents to receive him—at Wukang, Yuan alone set out parched grain and water.',
  ],
  s0283: [
    'When Bin left, Yuan saw him to the border and offered a peck of wine and paired geese as farewell.',
    'When Bin left, Yuan saw him to the border and offered a peck of wine and paired geese as farewell.',
  ],
  s0284: [
    'Bin joked: "Your courtesy exceeds Lu Na\'s—will you not be laughed at by the men of old?"',
    'Bin joked: "Your courtesy exceeds Lu Na\'s—will you not be laughed at by the men of old?"',
  ],
  s0285: [
    'Gaozu heard of his ability and promoted him to Administrator of Xuancheng.',
    'Gaozu heard of his ability and promoted him to administrator of Xuancheng.',
  ],
  s0286: [
    'From magistrate to a great near-capital commandery—nothing like it in recent times.',
    'From magistrate to a great near-capital commandery—nothing like it in recent times.',
  ],
  s0287: [
    'The commandery had suffered raids and plunder; Yuan devoted himself to pacification and governance, again leaving notable traces.',
    'The commandery had suffered raids and plunder; Yuan devoted himself to pacification and governance, again leaving notable traces.',
  ],
  s0288: [
    'After one year he was transferred to General Who Establishes Merit and Internal Magistrate of Shixing.',
    'After one year he was transferred to General Who Establishes Merit and internal magistrate of Shixing.',
  ],
  s0289: [
    'At the time Marquis of Quanling Yuan Lang held Guizhou; along the route he plundered—entering Shixing\'s borders, not even grass and trees were harmed.',
    'At the time Marquis of Quanling Yuan Lang held Guizhou; along the route he plundered—entering Shixing\'s borders, not even grass and trees were harmed.',
  ],
  s0290: [
    'While in office Yuan loved to open roads and lanes, repair walls and houses— dwelling quarters, market streets, city walls, stables and granaries—wherever he passed it was as if tending his own home.',
    'While in office Yuan loved to open roads and lanes, repair walls and houses— dwelling quarters, market streets, city walls, stables and granaries—wherever he passed it was as if tending his own home.',
  ],
  s0291: [
    'Field salary and stipend cash he took none of; at year\'s end he chose the poorest commoners and paid their tax levies—this became his custom.',
    'Field salary and stipend cash he took none of; at year\'s end he chose the poorest commoners and paid their tax levies—this became his custom.',
  ],
  s0292: [
    'Yet in hearing cases he was like other men, unable to go beyond that; but his nature was resolute and sharp—people did not dare find fault, fearing yet cherishing him.',
    'Yet in hearing cases he was like other men, unable to go beyond that; but his nature was resolute and sharp—people did not dare find fault, fearing yet cherishing him.',
  ],
  s0293: [
    'Wherever he went, while he still lived shrines were built; memorials reported his governance—Gaozu each time replied with gracious edicts.',
    'Wherever he went, while he still lived shrines were built; memorials reported his governance—Gaozu each time replied with gracious edicts.',
  ],
  s0294: [
    'In the sixteenth year of Tianjian an edict said: "He Yuan earlier at Wukang already showed pure fairness;',
    'In the sixteenth year of Tianjian an edict said: "He Yuan earlier at Wukang already showed pure fairness;',
  ],
  s0295: [
    'again governing two commanderies, he has ever more fully shown unsullied integrity.',
    'again governing two commanderies, he has ever more fully shown unsullied integrity.',
  ],
  s0296: [
    'He puts governance before all, leaves kindness and keeps the people\'s love— even the good two-thousand-bushel officials of old cannot surpass this.',
    'He puts governance before all, leaves kindness and keeps the people\'s love— even the good two-thousand-bushel officials of old cannot surpass this.',
  ],
  s0297: [
    'Inner honor should be raised to display outer achievement.',
    'Inner honor should be raised to display outer achievement.',
  ],
  s0298: [
    'Let him be Attendant of the Yellow Gate in the Secretariat."',
    'Let him be Attendant of the Yellow Gate in the Secretariat."',
  ],
  s0299: [
    'Yuan returned at once and became Chief Clerk to the General of Humane Might.',
    'Yuan returned at once and became chief clerk to the General of Humane Might.',
  ],
  s0300: [
    'Before long he went out as General of Trustworthy Might and Supervisor of Wu commandery.',
    'Before long he went out as General of Trustworthy Might and supervisor of Wu commandery.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_053_b3.mjs <translation.json>'
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
