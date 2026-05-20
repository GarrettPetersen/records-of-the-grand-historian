import fs from 'node:fs';

const path = 'translations/current_translation_beishi.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const T = {
  s0001: [
    'Shizu Emperor Taiwu; taboo name Tao; eldest son of Emperor Mingyuan.',
    'Emperor Taiwu the Grand Ancestor, taboo name Tao, was the eldest son of Emperor Mingyuan.',
  ],
  s0002: [
    'His mother was Lady Du the Esteemed Consort.',
    'His mother was Consort Du Gui.',
  ],
  s0003: [
    'In the fifth year of Tianci he was born in the Eastern Palace.',
    'In the fifth year of Tianci he was born in the Eastern Palace.',
  ],
  s0004: [
    'His form and countenance were rare and extraordinary; Emperor Daowu marveled at him and said, "He who completes my enterprise must be this boy.',
    'His bearing was singular and splendid; Emperor Daowu marveled at him, saying, "This boy alone will finish what I began.',
  ],
  s0005: [
    '" In the fourth month of the seventh year of Taichang he was enfeoffed as Prince of Taiping.',
    '" In the fourth month of Taichang year seven he received the title Prince of Taiping.',
  ],
  s0006: [
    'In the fifth month he was installed as crown prince.',
    'In the fifth month he was made crown prince.',
  ],
  s0007: [
    'When Emperor Mingyuan fell ill, he ordered the Emperor to take overall charge of all government affairs.',
    'When Mingyuan fell ill, he put the heir in charge of the whole administration.',
  ],
  s0008: [
    'The Emperor was intelligent and magnanimous, his mind broad and open.',
    'He was quick-witted and large-hearted, his thoughts clear and unconfined.',
  ],
  s0009: [
    'In the eleventh month of the eighth year, on the day jisi, Emperor Mingyuan died; on the day renshen the crown prince took the imperial throne and proclaimed a general amnesty throughout the realm.',
    'In the eleventh month of year eight, on jisi day Mingyuan died; on renshen day the crown prince ascended the throne and pardoned the empire.',
  ],
  s0010: [
    'In the twelfth month he posthumously honored his imperial mother as Empress Dowager Mi.',
    'In the twelfth month he raised his birth mother to Empress Dowager Mi.',
  ],
  s0011: [
    'He advanced Minister of Works Changle Fu Sun Yuan\'s noble rank to Prince of Beiping;',
    'He promoted Minister of Works Sun Yuan, Prince of Beiping;',
  ],
  s0012: [
    'Minister of Works Xi Jin to Prince of Yicheng;',
    'Minister of Works Xi Jin to Prince of Yicheng;',
  ],
  s0013: [
    'Duke of Lantian Changle Fu Sun Han to Prince of Pingyang.',
    'Duke of Lantian Sun Han to Prince of Pingyang.',
  ],
  s0014: [
    'The rest received general advancement of noble rank, each according to his measure.',
    'All others had their ranks raised in varying degrees.',
  ],
  s0015: [
    'Thereupon he lifted prohibitions and confinements, released those held under suspicion, opened the granaries, and relieved the destitute.',
    'He ended detention and suspicion, opened the storehouses, and succored the poor.',
  ],
  s0016: [
    'Refugees south of the Yellow River came over in great numbers in succession.',
    'South-of-the-River exiles flocked inward in droves.',
  ],
  s0017: [
    'In the spring of the second year, on the day jimao of the first month, the imperial carriage returned from the northern campaign.',
    'In spring of year two, on jimao of the first month, the emperor came back from the northern expedition.',
  ],
  s0018: [
    'On the day bingchen of the third month he honored his foster mother, the Dou clan, as Empress Dowager Bao.',
    'On bingchen in the third month he raised his nurse, Lady Dou, to Empress Dowager Bao.',
  ],
  s0019: [
    'On the day dingsi he appointed Prince of Beiping Changle Fu Sun Yuan Grand Commandant, Prince of Pingyang Changle Fu Sun Han Minister over the Masses, and Prince of Yicheng Xi Jin Minister of Works.',
    'On dingsi he named Sun Yuan of Beiping Grand Commandant, Sun Han of Pingyang Minister over the Masses, and Xi Jin of Yicheng Minister of Works.',
  ],
  s0020: [
    'On the day gengshen he turned the former Eastern Palace into the Palace of Long Life and raised the Yong\'an and Anle Halls, the Linwang View, and the Jiuhua Hall.',
    'On gengshen he made the old Eastern Palace the Palace of Long Life and built the Yong\'an and Anle halls, the Linwang belvedere, and the Jiuhua hall.',
  ],
  s0021: [
    'For the first time he devised more than a thousand new characters.',
    'He first created more than a thousand new written characters.',
  ],
  s0022: [
    'In the fourth month of summer an edict ordered Dragon Cavalry General Bu Dui to go as envoy to Song.',
    'In the fourth summer month he sent Dragon Cavalry General Bu Dui on embassy to Song.',
  ],
  s0023: [
    'In the fifth month an edict ordered every ten households throughout the realm to furnish one great ox to haul grain to the frontier.',
    'In the fifth month he ordered every ten households to send one draft ox to haul grain to the border.',
  ],
  s0024: [
    'In the eighth month of autumn Helian Qubu died.',
    'In the eighth month of autumn Helian Qubu died.',
  ],
  s0025: [
    'In the ninth month the Yong\'an and Anle Halls were completed; on the day dingmao he held a great feast to mark their completion.',
    'In the ninth month the Yong\'an and Anle halls were finished; on dingmao he held a grand banquet to dedicate them.',
  ],
  s0026: [
    'In the tenth month of winter, on the day guimao, the imperial carriage marched north to campaign, five routes setting out east and west together.',
    'On guimao in the tenth winter month the emperor marched north on campaign, five columns advancing east and west at once.',
  ],
  s0027: [
    'Prince of Pingyang Changle Fu Sun Han and others crossed the desert in pursuit of the enemy; the Rouran fled north.',
    'Sun Han of Pingyang and others chased the foe beyond the desert; the Rouran broke north.',
  ],
  s0028: [
    'In the spring of the third year, on the day renshen of the first month, the imperial carriage returned from the northern campaign.',
    'In spring of year three, on renshen of the first month, the emperor returned from the northern expedition.',
  ],
  s0029: [
    'Qifu Chipo sent envoys to present tribute and asked permission to attack Helian Chang.',
    'Qifu Chipo sent tribute and asked leave to strike Helian Chang.',
  ],
  s0030: [
    'In the second month he founded the Imperial Academy east of the city, sacrificed to Confucius, and paired Yan Hui in the rites.',
    'In the second month he founded the Imperial Academy east of the capital, sacrificed to Confucius, and paired Yan Hui at the altar.',
  ],
  s0031: [
    'On the day xinmao of the fifth month of summer he advanced Duke of Zhongshan Zuan\'s noble rank to prince and restored Duke of Nan\'an Su Xian to Prince of Changshan.',
    'On xinmao in the fifth summer month he raised Duke Zuan of Zhongshan to princely rank and restored Su Xian of Nan\'an as Prince of Changshan.',
  ],
  s0032: [
    'In the sixth month he visited the old palace at Yunzhong, paid homage at the imperial tombs, went west to Wuyuan, hunted on Yinshan, and went east to Mount Hedou.',
    'In the sixth month he visited the old palace at Yunzhong, worshipped at the tombs, went west to Wuyuan, hunted on Yinshan, and east to Mount Hedou.',
  ],
  s0033: [
    'In the seventh month of autumn he built a horse-archery platform on the Long River; the Emperor himself mounted the platform and galloped.',
    'In the seventh autumn month he built a mounted archery terrace on the Long River and rode there himself.',
  ],
  s0034: [
    'Princes, dukes, and the chieftains of the various states who hit the mark in the galloping shoot received gold, brocade, and silk wadding, each according to his measure.',
    'Princes, lords, and tribal chiefs who scored in the galloping shoot won gold, brocade, and silk in graded gifts.',
  ],
  s0035: [
    'In the eighth month the imperial carriage returned to the palace.',
    'In the eighth month the emperor returned to the capital.',
  ],
  s0036: [
    'Men of Song came on a friendly mission.',
    'Envoys from Song arrived on a courtesy visit.',
  ],
  s0037: [
    'Because Helian Qubu had died and his sons were attacking one another, on the day dingsi of the tenth month of winter the imperial carriage marched west to campaign, visited Yunzhong, and came to Junzi Ford.',
    'When Qubu died and his sons turned on each other, on dingsi in the tenth winter month the emperor marched west, stopped at Yunzhong, and reached Junzi Ford.',
  ],
  s0038: [
    'It happened that heaven turned violently cold; within days the ice closed.',
    'A sudden bitter freeze came; within days the river froze solid.',
  ],
  s0039: [
    'On the day wuyin of the eleventh month he led light cavalry in a surprise strike on Helian Chang.',
    'On wuyin in the eleventh month he led light horse in a surprise raid on Helian Chang.',
  ],
  s0040: [
    'On the day renwu he moved more than ten thousand households and returned.',
    'On renwu he relocated more than ten thousand households and withdrew.',
  ],
  s0041: [
    'At Mount Zuo he distributed captives and booty to the officers and soldiers, each according to his measure.',
    'At Mount Zuo he divided captives and spoils among the troops in graded shares.',
  ],
  s0042: [
    'In the twelfth month an edict ordered Xi Jin to seize and hold Chang\'an in the west.',
    'In the twelfth month he ordered Xi Jin to occupy Chang\'an in the west.',
  ],
  s0043: [
    'The Di and Qiang of Qin and Long all rebelled against Chang and came to Xi Jin to surrender.',
    'The Di and Qiang of Qin and Long all renounced Chang and surrendered to Xi Jin.',
  ],
  s0044: [
    'King of Wudu Yang Xuan and Juqu Mengxun and others sent envoys to submit.',
    'Yang Xuan of Wudu and Juqu Mengxun and others sent envoys to tender allegiance.',
  ],
  s0045: [
    'In the spring of the fourth year, on the day yiyou of the first month, the imperial carriage returned from the western campaign and bestowed rewards on the civil and military officials who had remained at the capital, each according to his measure.',
    'In spring of year four, on yiyou of the first month, the emperor returned from the western campaign and rewarded the capital officials in graded gifts.',
  ],
  s0046: [
    'Many of those who had followed him on the road died; of those who arrived, barely one or two in ten survived.',
    'Many who marched with him died on the road; barely a tenth of the host reached home.',
  ],
  s0047: [
    'On the day jihai he traveled in state to You province.',
    'On jihai he went in state to You province.',
  ],
  s0048: [
    'Helian Chang sent his younger brother Ding toward Chang\'an.',
    'Helian Chang sent his brother Ding against Chang\'an.',
  ],
  s0049: [
    'When the Emperor heard of it, he sent men to Yinshan to fell timber and build siege engines.',
    'Hearing this, he sent men to Yinshan to cut timber for siege machines.',
  ],
  s0050: [
    'In the second month the imperial carriage returned to the palace.',
    'In the second month the emperor returned to the capital.',
  ],
  s0051: [
    'On the day bingwu of the third month an edict ordered Commandant of the Imperial Insignia Huan Dai to build a bridge at Junzi Ford.',
    'On bingwu in the third month he ordered Commandant Huan Dai to bridge Junzi Ford.',
  ],
  s0052: [
    'On the day dingchou Prince of Guangping Lian died.',
    'On dingchou Prince Lian of Guangping died.',
  ],
  s0053: [
    'On the day dingwei of the fourth month of summer an edict ordered Supernumerary Palace Attendant Bu Dui to go as envoy to Song.',
    'On dingwei in the fourth summer month he sent Palace Attendant Bu Dui on embassy to Song.',
  ],
  s0054: [
    'In the fifth month the imperial carriage marched west to attack Helian Chang and halted at Bolin Mountain.',
    'In the fifth month the emperor marched west against Helian Chang and camped at Bolin Mountain.',
  ],
  s0055: [
    'He walled a city, left the baggage train, and sent thirty thousand light cavalry ahead.',
    'He fortified a camp, left the train, and pushed thirty thousand light horse forward.',
  ],
  s0056: [
    'On the day wuxu he reached the Black River.',
    'On wuxu he reached the Black River.',
  ],
  s0057: [
    'The Emperor personally prayed to Heaven, addressed the spirits of the ancestors, and swore the host.',
    'The emperor prayed to Heaven in person, invoked the ancestral spirits, and bound the army with an oath.',
  ],
  s0058: [
    'On the first day guimao of the sixth month there was an eclipse of the sun.',
    'On guimao, the first day of the sixth month, the sun was eclipsed.',
  ],
  s0059: [
    'On the day jiachen he utterly defeated Helian Chang; Chang fled to Shanggui.',
    'On jiachen he shattered Helian Chang, who fled to Shanggui.',
  ],
  s0060: [
    'On the day yisi the imperial carriage entered the city; he captured Chang\'s younger brothers in a body, together with their mother, sisters, wives, concubines, and palace women by the tens of thousands, while treasuries, jewels, chariots, banners, and utensils were beyond counting.',
    'On yisi he entered the city and took Chang\'s brothers, their mother, sisters, wives, concubines, and palace women by the tens of thousands, with treasuries and spoils past numbering.',
  ],
  s0061: [
    'On the day xinyou he led the army back.',
    'On xinyou he withdrew the army.',
  ],
  s0062: [
    'He left Prince of Changshan Su and Commandant of the Imperial Insignia Huan Dai to garrison and command Tongwan.',
    'He left Prince Su of Changshan and Commandant Huan Dai to hold Tongwan.',
  ],
  s0063: [
    'On the day jimao of the seventh month of autumn he built an altar on Zuo Ridge, staged horse games and mounted archery, and bestowed gold, silk, and wadding on those who hit the mark, each according to his measure.',
    'On jimao in the seventh autumn month he raised an altar on Zuo Ridge, held riding games and archery, and gave graded gifts of gold and silk to the winners.',
  ],
  s0064: [
    'The Rouran raided Yunzhong; hearing that Helian Chang had been broken, they took fright and fled.',
    'The Rouran struck Yunzhong; learning that Chang was beaten, they fled in fear.',
  ],
  s0065: [
    'On the day renzi of the eighth month the imperial carriage returned from the western campaign; he held the victory feast and recorded merit, reported to the ancestral temple, and distributed military booty to the hundred officials who had remained at the capital, each according to his measure.',
    'On renzi in the eighth month he returned from the western campaign, held the victory feast, reported to the temple, and divided spoils among the capital officials in graded shares.',
  ],
  s0066: [
    'In the eleventh month of winter he appointed the Di king Yang Xuan acting General Who Conquers the South, Area Commander, Inspector of Liang province, and King of Southern Qin.',
    'In the eleventh winter month he named the Di chief Yang Xuan acting General Who Conquers the South, commander, Liang inspector, and King of Southern Qin.',
  ],
  s0067: [
    'In the twelfth month he traveled to Zhongshan; more than ten district magistrates were dismissed for corruption.',
    'In the twelfth month he went to Zhongshan and removed more than ten corrupt local administrators.',
  ],
  s0068: [
    'On the day guimao the imperial carriage returned to the palace and remitted half the field tax along the route of the tour.',
    'On guimao he returned to the capital and halved the land tax in the regions he had passed through.',
  ],
  s0069: [
    'In the first month of the first year of Shenqi, because prefects and magistrates throughout the realm were often lawless, he carefully selected the loyal and good and replaced them all.',
    'In the first month of Shenqi year one, finding that local administrators were often corrupt, he chose loyal men and replaced them wholesale.',
  ],
  s0070: [
    'On the day xinwei Prince of Jingzhao Li died.',
    'On xinwei Prince Li of Jingzhao died.',
  ],
  s0071: [
    'In the second month the reign title was changed.',
    'In the second month the era name was changed.',
  ],
  s0072: [
    'Minister of Works Xi Jin advanced his army on Anding.',
    'Minister of Works Xi Jin marched on Anding.',
  ],
  s0073: [
    'Supervising Army Attendant Censor An Yi went out to battle and captured Chang alive.',
    'Army Supervisor An Yi took the field and seized Chang alive.',
  ],
  s0074: [
    'The rest set up Chang\'s younger brother Ding as their lord and fled back to Pingliang.',
    'The remnant made Chang\'s brother Ding their leader and withdrew to Pingliang.',
  ],
  s0075: [
    'On the day xinsi of the third month Palace Attendant Gu Bi escorted Helian Chang to the capital.',
    'On xinsi in the third month Palace Attendant Gu Bi brought Helian Chang to the capital.',
  ],
  s0076: [
    'Minister of Works Xi Jin pursued Helian Ding to Mamiao Ridge in Pingliang and was captured by Ding.',
    'Xi Jin pursued Helian Ding to Mamiao Ridge in Pingliang and was taken by Ding.',
  ],
  s0077: [
    'General Qiu Dui had earlier been at Anding; hearing that Xi Jin was defeated, he fled east to Chang\'an.',
    'General Qiu Dui, who had been at Anding, heard of Xi Jin\'s defeat and fled east to Chang\'an.',
  ],
  s0078: [
    'The Emperor was greatly enraged and ordered Yi to behead Qiu Dui.',
    'The emperor was furious and ordered Yi to execute Qiu Dui.',
  ],
  s0079: [
    'In the fourth month of summer Helian Ding sent envoys to present tribute.',
    'In the fourth summer month Helian Ding sent tribute.',
  ],
  s0080: [
    'On the day renzi he toured the west.',
    'On renzi he toured the west.',
  ],
  s0081: [
    'On the day wuwu he hunted on the west of the river and proclaimed a general amnesty.',
    'On wuwu he hunted west of the river and proclaimed a general amnesty.',
  ],
  s0082: [
    'King of Southern Qin Yang Xuan sent envoys to present tribute.',
    'King Yang Xuan of Southern Qin sent tribute.',
  ],
  s0083: [
    'In the fifth month Qifu Chipo died.',
    'In the fifth month Qifu Chipo died.',
  ],
  s0084: [
    'In the eighth month of autumn he traveled east to Guangning and came to view the hot springs.',
    'In the eighth autumn month he went east to Guangning and visited the hot springs.',
  ],
  s0085: [
    'With the great offering he sacrificed at the temples of the Yellow Emperor, Yao, and Shun.',
    'He sacrificed with the highest victims at the temples of the Yellow Emperor, Yao, and Shun.',
  ],
  s0086: [
    'In the ninth month the imperial carriage returned to the palace.',
    'In the ninth month the emperor returned to the capital.',
  ],
  s0087: [
    'On the first day yiwei of the eleventh month of winter there was an eclipse of the sun.',
    'On yiwei, the first day of the eleventh winter month, the sun was eclipsed.',
  ],
  s0088: [
    'That month he traveled to the west of the river and held a great hunt.',
    'That month he toured west of the river and held a grand hunt.',
  ],
  s0089: [
    'On the day jiashen of the twelfth month the imperial carriage returned to the palace.',
    'On jiashen in the twelfth month the emperor returned to the capital.',
  ],
  s0090: [
    'In the fourth month of summer of the second year, men of Song came on a friendly mission.',
    'In the fourth summer month of year two, envoys from Song arrived on a courtesy visit.',
  ],
  s0091: [
    'On the day gengyin the imperial carriage marched north to campaign.',
    'On gengyin the emperor marched north on campaign.',
  ],
  s0092: [
    'On the day dingwei of the fifth month he halted in the desert, left the baggage train, and with light cavalry and double-horsed riders together reached Chestnut Water.',
    'On dingwei in the fifth month he camped in the desert, shed the train, and with light horse and double mounts reached Chestnut Water.',
  ],
  s0093: [
    'The Rouran were shaken and terrified; they burned their dwellings and vanished without trace, fleeing west.',
    'The Rouran were stricken with terror; they burned their camps and fled west without a trace.',
  ],
  s0094: [
    'In the tenth month of winter he reformed the army in triumph at the capital and reported to the ancestral temple.',
    'In the tenth winter month he brought the army home in triumph at the capital and reported to the temple.',
  ],
  s0095: [
    'He arrayed the new subjects south of the desert, east to the Ruyuan, west to Wuyuan and Yinshan, three thousand li in all.',
    'He settled the new subjects south of the desert from the Ruyuan in the east to Wuyuan and Yinshan in the west, three thousand li across.',
  ],
  s0096: [
    'In the eleventh month he toured the west, hunted on the west of the river, and returned when he reached Mount Zuo.',
    'In the eleventh month he toured the west, hunted west of the river, and turned back at Mount Zuo.',
  ],
  s0097: [
    'On the day wuwu of the fifth month he deliberated on the merit of the campaign against the Chile and made rewards and punishments clear.',
    'On wuwu in the fifth month he reviewed the Chile campaign and pronounced rewards and punishments in full.',
  ],
  s0098: [
    'On the day jihai of the seventh month of autumn an edict allowed generals on campaign and princes and dukes bearing staffs in the far marches to open offices and recruit followers; the next rank below was to have their clerical staffs enlarged.',
    'On jihai in the seventh autumn month he allowed frontier generals and princes with command staffs to open offices and recruit aides, and ordered lesser ranks to enlarge their staffs.',
  ],
  s0099: [
    'On the day gengzi an edict made Grand Herald Du Chao acting Area Commander of the military affairs of Ji, Ding, and Xiang provinces, acting General Who Conquers the South, Grand Mentor, advanced his noble rank to prince, and stationed him at Ye to command all the armies.',
    'On gengzi he named Grand Herald Du Chao acting commander of Ji, Ding, and Xiang, acting General Who Conquers the South, Grand Mentor, raised him to princely rank, and posted him at Ye to direct all forces.',
  ],
  s0100: [
    'In the eighth month the Song general Dao Yanzhi entered the river from Qingshui and rowed upstream to the west.',
    'In the eighth month the Song commander Dao Yanzhi entered the river at Qingshui and sailed upstream to the west.',
  ],
};

let applied = 0;
for (const s of data.sentences) {
  const pair = T[s.id];
  if (!pair) continue;
  s.literal = pair[0];
  s.idiomatic = pair[1];
  applied++;
}

fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', applied, 'translations to', path);
