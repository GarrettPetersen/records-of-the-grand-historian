import fs from 'node:fs';

const data = JSON.parse(
  fs.readFileSync('translations/current_translation_songshu.json', 'utf8')
);

const T = {
  s0302: [
    'Although Yu the Great spread east and covered west, and Gao Yao advanced in planting virtue—how could they surpass this?',
    'Even the virtue of Yu the Great, spreading east and west, and of Gao Yao, planting merit far and wide, cannot match what you have done.',
  ],
  s0303: [
    'We have heard that when the former kings governed the world, they employed merit and honored the worthy, established feudal lords and enfeoffed them with land, rewarded them with favor-granting regalia, and exalted their emblematic objects—thereby to assist and support the royal house and forever elevate the screen of the frontiers.',
    'We have heard that the ancient kings ruled by rewarding merit, honoring the worthy, enfeoffing lords with land, and granting them honors and emblems, so that they might assist the throne and guard the realm forever.',
  ],
  s0304: [
    'Therefore Qufu was gloriously opened, and the Xu domain was brought to waste; Yingqiu faced the sea, and its fame was heard in the four treads.',
    'Thus the house of Lu was ennobled at Qufu and held Xu; Qi was established at Yingqiu by the sea, and their fame reached the four quarters.',
  ],
  s0305: [
    'In the time of King Xiang of Zhou, he too relied on one who rectified hegemony; again Duke Wen of Jin was commanded, and full gifts were brightly bestowed.',
    'King Xiang of Zhou relied on a lord who restored hegemony; Duke Wen of Jin too received the full ceremonial gifts.',
  ],
  s0306: [
    'Only the Duke, in Way crowns the former worthies and merit towers to shake antiquity—yet special statutes have not been added; We are very bewildered indeed.',
    'Your Way surpasses the heroes of old and your merit shakes antiquity, yet the highest honors have not been granted you. We are deeply troubled.',
  ],
  s0307: [
    'Now We advance and appoint you Chancellor of State, with the ten commanderies Pengcheng, Pei, Lanling, Xiapi, Huaiyang, Shanyang, and Guangling of Xuzhou, and Gaoping, Lu, and Taishan of Yanzhou, and enfeoff you as Duke of Song.',
    'We now appoint you Chancellor of State and enfeoff you as Duke of Song over ten commanderies: Pengcheng, Pei, Lanling, Xiapi, Huaiyang, Shanyang, and Guangling in Xuzhou, and Gaoping, Lu, and Taishan in Yanzhou.',
  ],
  s0308: [
    'We bestow this dark earth, wrap it with white thatch, thereby fix your dwelling, and use it to establish your ancestral altar.',
    'We grant you the sacred earth wrapped in white thatch, fix your seat, and establish your ancestral shrine.',
  ],
  s0309: [
    'Formerly Jin and Zheng opened their principalities and entered to serve as ministers; Zhou and Shao guarded and tutored, and going forth they oversaw the Two Souths—the weight of inner and outer—you, Duke, truly combine both.',
    'Jin and Zheng once opened their domains and became ministers at court; the Duke of Zhou and Duke of Shao guarded the heir within and governed without. You, Duke, hold both burdens.',
  ],
  s0310: [
    'Now We command the Bearer of the Staff, concurrently Grand Commandant, Left Vice Director of the Masters of Writing, and Baron of the fifth rank of Jinning county, Zhan, to confer the Chancellor of States seal and cord, [9] and the Duke of Songs seal and ribbon;',
    'We command Zhan, Bearer of the Staff, Grand Commandant, and Left Vice Director of the Masters of Writing, to confer the seal and cord of Chancellor of State [9] and the seal and ribbon of Duke of Song;',
  ],
  s0311: [
    'the Bearer of the Staff, concurrently Minister of Works, Regular Attendant of the Scattered Cavalry, Master of Writing, and Marquis of Yangsui township, Tai, to confer the Duke of Songs fief-soil, gold tiger tallies first through fifth on the left, [10] and bamboo envoy tallies first through tenth on the left.',
    'and Tai, Bearer of the Staff, Minister of Works, and Master of Writing, to confer the fief-soil of Song, gold tiger tallies one through five on the left, [10] and bamboo envoy tallies one through ten on the left.',
  ],
  s0312: [
    'The Chancellor of States position has nothing it does not oversee; his ritual stands apart from the court ranks—ordinary titles should be reformed along with the affair.',
    'The Chancellor of State oversees all affairs and stands above the court ranks; his ordinary titles should be changed accordingly.',
  ],
  s0313: [
    'Let him, as Chancellor of State, oversee the hundred offices, [11] and remove the title "Recorder of the Masters of Writing."',
    'Let him as Chancellor of State oversee all government [11] and drop the title Recorder of the Masters of Writing.',
  ],
  s0314: [
    'He shall send up the borrowed staff, Palace Attendants sable cicada, seals and cords of Grand Tutor and Grand Commandant of the inner and outer command, [12] and the seal and patent of Duke of Yuzhang.',
    'He shall return the borrowed staff, the Palace Attendants insignia, the seals of Grand Tutor and Grand Commandant, [12] and the seal and patent of Duke of Yuzhang.',
  ],
  s0315: [
    'He is advanced as Governor of Yangzhou, continuing as before as Campaigning-west General and Governor of the four provinces Si, Yu, Northern Xu, and Yong.',
    'He is advanced to Governor of Yangzhou and continues as Campaigning-west General and governor of Si, Yu, Northern Xu, and Yong.',
  ],
  s0316: [
    'The Duke, in statutes and ritual measure, is the model for ten thousand states; riding the go-between and treading the square, he has no shifting intent.',
    'The Duke sets statutes and ritual for all states, holds his course without wavering, and never turns aside.',
  ],
  s0317: [
    'Therefore We bestow on the Duke one great carriage and one war carriage, and two teams of black stallions.',
    'Therefore We bestow one state carriage and one war carriage, and two teams of black stallions.',
  ],
  s0318: [
    'The Duke restrains the branch and honors the root, devotes himself to agriculture and values stores; picking artemisia is truly abundant, and the crops are luxuriant.',
    'The Duke restrains luxury and honors the root, devotes himself to farming and stores grain; the harvest is rich and the fields abundant.',
  ],
  s0319: [
    'For this We bestow on the Duke the robe and cap of nine emblems, with red shoes besides.',
    'For this We bestow the robe and cap of nine emblems, with red shoes.',
  ],
  s0320: [
    'The Duke restrains evil and receives the upright, shifts the wind and changes custom, potters and balances all things like the harmony of music.',
    'The Duke restrains evil and upholds the upright, transforms customs, and molds all things in harmony like music.',
  ],
  s0321: [
    'For this We bestow on the Duke the music of the suspended bells, and the dance of six rows.',
    'For this We bestow the music of suspended bells and the six-row dance.',
  ],
  s0322: [
    'The Duke proclaims the beautiful royal transformation, guides and raises excellent custom; Chinese and barbarian stand on tiptoe, and distant men all gather.',
    'The Duke proclaims the royal transformation and excellent custom; Chinese and barbarian alike look to him, and distant peoples gather.',
  ],
  s0323: [
    'For this We bestow on the Duke vermilion doors to dwell in.',
    'For this We bestow vermilion doors for his dwelling.',
  ],
  s0324: [
    'The Duke, in office, employs the able, nets the hidden and stagnant; the nine marshes send forth from the wild, and eminent scholars fill the court.',
    'The Duke in office employs the able and draws forth the neglected; talents emerge from obscurity and fill the court.',
  ],
  s0325: [
    'For this We bestow on the Duke the covered ramp to ascend.',
    'For this We bestow the covered ramp for his ascent.',
  ],
  s0326: [
    'The Duke, at the hub and in the center, leads those below by righteousness, checks the bandit foe, and clears away harsh evil.',
    'The Duke stands at the center, leads by righteousness, checks the enemy, and clears away harsh wrongs.',
  ],
  s0327: [
    'For this We bestow on the Duke three hundred tiger-guardsmen.',
    'For this We bestow three hundred tiger guards.',
  ],
  s0328: [
    'The Duke clarifies punishments and pities in sentencing; the many prisons are examined and approved; those who defy orders and violate discipline—none are left to roam free.',
    'The Duke clarifies punishments and shows mercy in judgment; prisons are justly decided; rebels against order are not spared.',
  ],
  s0329: [
    'For this We bestow on the Duke one battle-axe and one great-axe.',
    'For this We bestow one battle-axe and one great-axe.',
  ],
  s0330: [
    'The Duke, dragon-soaring and phoenix-rising, within a foot the eight cords; he enfolds the four seas in a bag and repels the foe without.',
    'The Duke rises like dragon and phoenix; within a foot lie the eight directions; he holds the four seas and repels all foes abroad.',
  ],
  s0331: [
    'For this We bestow on the Duke one red bow, one hundred red arrows, ten black bows, and one thousand black arrows.',
    'For this We bestow one red bow, one hundred red arrows, ten black bows, and one thousand black arrows.',
  ],
  s0332: [
    'The Duke is warm, respectful, and filially mindful; he extends utmost sincerity in suburban sacrifice; his loyal and solemn intent is the model for ten thousand regions.',
    'The Duke is warm, respectful, and filial; he is utmost in suburban sacrifice; his loyal solemnity is the model for all lands.',
  ],
  s0333: [
    'For this We bestow on the Duke one jar of black millet ale, with a jade libation cup besides.',
    'For this We bestow one jar of black millet ale and a jade libation cup.',
  ],
  s0334: [
    'In the state of Song, from Chancellor of State downward, all follow the old statutes.',
    'In the state of Song, from the chancellor downward, all follow the former statutes.',
  ],
  s0335: [
    'Reverently!',
    'Reverently!',
  ],
  s0336: [
    'Respectfully take on the command you go to, richly respond to Heavens favor, simply comfort the many states, respectfully spread bright virtue, and thereby complete Our High Ancestors excellent mandate.',
    'Respectfully accept this command, answer Heavens favor, comfort the many states, spread bright virtue, and complete Our High Ancestors mandate.',
  ],
  s0337: [
    'Establish in the state of Song Palace Attendants, Gentlemen of the Yellow Gate, Left Assistant of the Masters of Writing, and Gentlemen, to follow the great envoy in welcoming.',
    'Establish Palace Attendants, Gentlemen of the Yellow Gate, the Left Assistant of the Masters of Writing, and Gentlemen in the state of Song, to follow the great envoy in welcoming the regalia.',
  ],
  s0338: [
    'Citation marker in the source text: [13].',
    'Editorial note marker in the source: [13].',
  ],
  s0339: [
    'The barbarian of Baohan, Qifu Chipan, sent envoys to the Duke to offer service in attacking the Qiang; he was appointed General Who Pacifies the West and Duke of Henan.',
    'Qifu Chipan of Baohan sent envoys to offer service against the Qiang; he was appointed General Who Pacifies the West and Duke of Henan.',
  ],
  s0340: [
    'In the first month of the thirteenth year, the Duke advanced by river army to attack; he left Prince of Pengcheng Yilong to guard Pengcheng.',
    'In the first month of the thirteenth year the Duke marched by river to attack; Prince of Pengcheng Yilong was left to guard Pengcheng.',
  ],
  s0341: [
    'The army halted at Liucheng and passed Zhang Liangs temple; he issued an order: "Great virtue is not extinguished; righteousness lies in the sacrificial canon. The sigh over the small share of Guan Zhong—the more one dwells on the matter, the deeper it runs.',
    'The army halted at Liucheng and passed Zhang Liangs temple. He issued an order: "Great virtue is never lost; righteousness belongs in the sacrificial canon. The sigh over Guan Zhong—the more one reflects, the deeper the feeling.',
  ],
  s0342: [
    'Zhang Zifang: his Way was next to the yellow center, his illumination neighbored the near common; wind and cloud responded in mystery, [14] and he rose to be the emperors teacher; he greatly rescued the crosswise flood, leveled Xiang and settled Han—thus he may be ranked with Yi and Wang, and his crowning virtue was like benevolence.',
    'Zhang Zifang stood next to the center of the realm and shone on all near him; wind and cloud answered in mystery [14] and he became the emperors teacher; he rescued the realm from flood, overthrew Xiang, and settled Han—equal to Yi Yin and Lü Wang, his virtue crowned with benevolence.',
  ],
  s0343: [
    'As for his spirit-meeting on the ruined wall, his Way joined with Shangluo—between the manifest and the hidden it is remote and hard to fathom; the source-stream is deep and vast, and none can measure its end.',
    'His meeting with the old man on the ruined wall and his bond with Shangluo lie between manifest and hidden, remote and hard to fathom; the source is deep and vast beyond measure.',
  ],
  s0344: [
    'Passing by on the road through old Pei, halting the chariot at Liucheng—the spirit temple was desolate and ruined, the surviving images dim; stroking the traces and cherishing the man, he sighed long in emotion.',
    'Passing old Pei and halting at Liucheng, he found the spirit temple ruined and the images faded; stroking the traces and cherishing the man, he sighed long.',
  ],
  s0345: [
    'Those who passed Daliang perhaps stood in thought at the Yi Gate; those who traveled the Nine Mounds also lingered at Sui Hui.',
    'Travelers at Daliang paused in thought at the Yi Gate; those at the Nine Mounds lingered over Sui Hui.',
  ],
  s0346: [
    'The timbers and rafters may be rebuilt, the cinnabar and green restored; duckweed and gathered water may be offered in season.',
    'Rebuild the timbers and rafters, restore the painted colors, and offer duckweed and gathered water in season.',
  ],
  s0347: [
    'Thus to ease the feeling of cherishing antiquity, and thereby preserve his undying splendor.',
    'Thus to ease the heart that cherishes antiquity and preserve his undying fame.',
  ],
  s0348: [
    '" The Son of Heaven posthumously honored the Dukes grandfather as Grand Master of Splendor and his father as Left Grand Master of Splendor; he declined and did not accept.',
    'The Son of Heaven posthumously honored the Dukes grandfather as Grand Master of Splendor and his father as Left Grand Master of Splendor; he declined and did not accept.',
  ],
  s0349: [
    'In the second month, Champion General Tan Daoji and others halted at Tong Pass.',
    'In the second month Champion General Tan Daoji and others camped at Tong Pass.',
  ],
  s0350: [
    'On the day gengchen in the third month, the great army entered the Yellow River.',
    'On gengchen day in the third month the main army crossed into the Yellow River.',
  ],
  s0351: [
    'The Northern barbarians infantry and cavalry in the tens of thousands camped and held the river ford.',
    'Northern Di infantry and cavalry, one hundred thousand strong, held the river crossing.',
  ],
  s0352: [
    'The Duke ordered the armies to cross the river and struck and broke them.',
    'The Duke ordered the armies to cross the river and defeated them.',
  ],
  s0353: [
    'The Duke reached Luoyang.',
    'The Duke reached Luoyang.',
  ],
  s0354: [
    'In the seventh month, he reached Shancheng.',
    'In the seventh month he reached Shancheng.',
  ],
  s0355: [
    'Dragon-soaring General Wang Zhen\u2019e felled trees to make boats and floated from the Yellow River onto the Wei.',
    'Dragon-soaring General Wang Zhen\u2019e felled trees for boats and sailed from the Yellow River onto the Wei.',
  ],
  s0356: [
    'In the eighth month, Fufeng Administrator Shen Tianzi greatly defeated Yao Hong at Lantian.',
    'In the eighth month Fufeng Administrator Shen Tianzi routed Yao Hong at Lantian.',
  ],
  s0357: [
    'Wang Zhen\u2019e took Chang\u2019an and captured Hong alive.',
    'Wang Zhen\u2019e took Chang\u2019an and captured Hong alive.',
  ],
  s0358: [
    'In the ninth month, the Duke reached Chang\u2019an.',
    'In the ninth month the Duke reached Chang\u2019an.',
  ],
  s0359: [
    'Chang\u2019an was abundant and complete; the treasury stores were full and piled.',
    'Chang\u2019an was rich and whole; treasuries were full to overflowing.',
  ],
  s0360: [
    'The Duke first collected its ritual vessels, armillary sphere, earth-square, and the like, and presented them to the capital;',
    'The Duke first sent its ritual vessels, armillary sphere, earth-square, and the like to the capital;',
  ],
  s0361: [
    'the remaining precious treasures, pearls, and jade he distributed in reward to generals and commanders.',
    'and distributed the remaining treasures, pearls, and jade among his generals.',
  ],
  s0362: [
    'He escorted and sent Yao Hong, who was beheaded in the market of Jiankang.',
    'Yao Hong was sent to the capital and beheaded in the market at Jiankang.',
  ],
  s0363: [
    'He visited the tomb-mound of Emperor Gao of Han and held a great assembly of civil and military officials in Weiyang Palace.',
    'He visited the tomb of Emperor Gao of Han and held a great assembly of civil and military officials in Weiyang Palace.',
  ],
  s0364: [
    'In the tenth month, the Son of Heaven issued an edict:',
    'In the tenth month the Son of Heaven issued an edict:',
  ],
  s0365: [
    'We have heard that when the former kings held the world, above they took the great treasure to honor virtue, below they established feudal lords to reward merit.',
    'We have heard that when the ancient kings ruled the world, above they honored virtue with the great treasure, below they enfeoffed lords to reward merit.',
  ],
  s0366: [
    'Therefore when the achievement was complete and announced, Wenming had the black jade scepter bestowed; when the four seas came as kings, Ji Dan enjoyed the tortoise and banner enfeoffment.',
    'When achievement was complete, Yu received the black jade scepter; when the four seas submitted, the Duke of Zhou received the tortoise and banner enfeoffment.',
  ],
  s0367: [
    'To wing the sage and proclaim achievement, assist virtue and enlarge the plan—the ritual exhausts the highest reward, and favor-regalia is rare in the age.',
    'To assist the sage and proclaim achievement, to aid virtue and enlarge the design—such merit wins the highest reward and honors rare in any age.',
  ],
  s0368: [
    'How much more when one clearly protects the tender and dim, and alone turns the potters wheel!',
    'How much more when one clearly protects the young ruler and alone turns the potters wheel!',
  ],
  s0369: [
    'We, with little virtue, encountered many difficulties in Our house; cloud and thunder made difficulty, Yi the Archer stole the mandate; We lost Our place in the capital region and were driven among the southern barbarians; in hardship and low estate We were constrained by the vicious and ugly.',
    'We, lacking virtue, met many troubles in Our house; cloud and thunder brought hardship, and Yi the Archer stole the mandate; We lost the capital and were driven among the southern barbarians; in hardship We were constrained by vicious foes.',
  ],
  s0370: [
    'Chancellor of State and Duke of Song: Heaven overspreads him with sagely intelligence; he answers the age by mandate; sincerity penetrates the three spirits; great integrity broadly rises.',
    'The Chancellor of State and Duke of Song: Heaven endowed him with sagely intelligence; he answers the age; his sincerity reaches the three spirits; his great integrity rises abroad.',
  ],
  s0371: [
    'He rescued Our person from the nest and curtain, turned the numinous mandate back from already collapsed—thus his Way has exhausted the north-facing subject, and his radiance grids the eight regions.',
    'He rescued Us from the nest and curtain, restored the mandate from collapse—his Way has gone beyond any north-facing subject, and his radiance covers the eight regions.',
  ],
  s0372: [
    'Moreover, outwardly he accumulated achievement of completing the state, inwardly he piled achievement of pacifying the black-haired people; at the beginning of cutting down the strong demons, at the source of heaping up the crafty and slippery—of the Way of displaying benevolence and concealing use, and the achievement of the six treasuries greatly repaired—none were not cloud-walking and rain-bestowing; able affairs were certainly raised; truly he has already squared his track with the Three Sovereigns and Five Emperors, and cannot be contained in canon and statute.',
    'Outwardly he completed the state, inwardly he pacified the people; he cut down mighty foes at the root and cleared treacherous sources; he displayed benevolence and concealed his methods, and repaired the six treasuries—cloud and rain followed his acts; truly he matches the Three Sovereigns and Five Emperors and cannot be contained in canon and statute.',
  ],
  s0373: [
    'Since the Yongjia loss of the army, more than ten reigns have passed in succession; the five capitals split apart, yet the orthodox calendar still reached in time;',
    'Since the Yongjia disaster more than ten reigns have passed; the five capitals fell apart, yet the orthodox calendar still held;',
  ],
  s0374: [
    'only the three Qins hung apart and for a time were not guests.',
    'only the three Qin hung apart and for a time did not submit.',
  ],
  s0375: [
    'Until now the Qiang barbarians have carried on disorder, licentious and cruel through three reigns; relying on the ease of holding the hundred-and-two, trusting that Hangu Pass could be closed—temple calculation and hidden strategy were not plotted for many days.',
    'Until now the Qiang have carried on disorder, licentious and cruel through three reigns, trusting in the ease of holding the heartland and the strength of Hangu Pass—long had no plan been laid against them.',
  ],
  s0376: [
    'The Duke, by mandate of the age, calms the turning; he unfolds bright martial spirit, inwardly studies the lords anxieties, outwardly brings down Heavens punishment.',
    'The Duke, born for the age, calms the turning; he unfolds bright martial spirit, studies the lords within, and brings down Heavens punishment without.',
  ],
  s0377: [
    'Therefore when the storehouse rhinoceros had just been instructed, Xu and Zheng bent to the wind; before battle-axes and halberds were pointed, Chan and Luo scattered like mist.',
    'When he first taught discipline, Xu and Zheng bent to the wind; before his axes were pointed, Chan and Luo scattered like mist.',
  ],
  s0378: [
    'He made the yang of the old breach again gather the axle-pins of ten thousand states; the elders of the eastern capital again beheld the statutes of the Minister of the Masses.',
    'He made the sun of the old capital shine again and gathered the axle-pins of ten thousand states; the elders of the eastern capital again beheld the statutes of the Minister of the Masses.',
  ],
  s0379: [
    'He made Us, back to the throne with arms folded high, preserve the great flood of merit.',
    'He made Us, leaning on the throne with folded arms, preserve the great flood of merit.',
  ],
  s0380: [
    'For this We, looking far to former canon, extended and took counsel of the multitude, respectfully conferred special gifts, and brightly opened the frontier lands.',
    'For this We looked to former canon, took counsel of the multitude, and conferred special gifts to open the frontier.',
  ],
  s0381: [
    'The system of chariots of honor has been narrow compared with old statutes;',
    'The chariots of honor have been narrow compared with old statutes;',
  ],
  s0382: [
    'the beauty of emblematic titles has not exhausted the highest rank.',
    'the beauty of emblematic titles has not reached the highest rank.',
  ],
  s0383: [
    'How could they suffice to display repayment of abundant merit and truly fill the peoples hope;',
    'How could they suffice to repay abundant merit and truly fill the peoples hope;',
  ],
  s0384: [
    'to be screen and assistant to the royal precinct, long reins on the six harmonies?',
    'to be screen and assistant to the throne and hold the long reins of the realm?',
  ],
  s0385: [
    'Truly because the Duke each time holds modest virtue, low and not to be overstepped—the Way hard to advance—We take favor as sorrow.',
    'Truly because the Duke each time holds modest virtue, humble and not to be overstepped—the Way hard to advance—We take favor as sorrow.',
  ],
  s0386: [
    'Therefore We lowered and reduced the grand system, and there was a later mandate.',
    'Therefore We lowered the grand system, and there was a later mandate.',
  ],
  s0387: [
    'From then until now, the great achievement has grown ever stronger; edge and might fill the nine rivers, Wei and Zhao reach the bottom in submission; turning the chariot at Xiao and Tong, linked cities melt like ice.',
    'From then until now his great achievement has grown; his might fills the nine rivers, Wei and Zhao submit at the bottom; turning at Xiao and Tong, linked cities melt like ice.',
  ],
  s0388: [
    'Then he drove far at Ba and Chan, hung his banners at Long Gate; the rebellious captive Yao Hong was bound by the neck and came to capture.',
    'Then he drove far along Ba and Chan, hung his banners at Long Gate; the rebel Yao Hong was bound by the neck and captured.',
  ],
  s0389: [
    'A hundred years of obstruction and filth were washed in one morning;',
    'A hundred years of obstruction were washed clean in one morning;',
  ],
  s0390: [
    'the ancestors stored wrath was snowed in one day.',
    'the wrath stored by the ancestors was avenged in one day.',
  ],
  s0391: [
    'He treads the traces of Yu and his square travels the world; reaching to beyond the seas, none do not submit.',
    'He treads the traces of Yu; his rule travels the world; beyond the seas, none do not submit.',
  ],
  s0392: [
    'His achievement is solid for ten thousand generations—its tranquillity is everlasting; how could stone, metal, elegant odes, and hymns suffice to praise it? Truly it may be announced to the spirits and carved on Song and Dai.',
    'His achievement will stand for ten thousand generations—everlasting in tranquillity; stone, metal, odes, and hymns cannot praise it enough; truly it may be announced to the spirits and carved on Song and Dai.',
  ],
  s0393: [
    'We have also heard that when the Zhou Way was just far-reaching, then the zixie bird sang at Qi; when the Two Souths spread virtue, then the qilin and zouyu appeared as omens.',
    'We have also heard that when the Zhou Way was far-reaching, the zixie bird sang at Qi; when the Two Souths spread virtue, qilin and zouyu appeared.',
  ],
  s0394: [
    'From when the Dukes great title was first raised until the announcement of completion, numinous omens blazed and shone beyond counting—how could it be only the plain pheasant coming from afar and fine grain returning from near!',
    'From when the Dukes great title was first raised until completion, numinous omens blazed beyond counting—far more than plain pheasants from afar and fine grain from near!',
  ],
  s0395: [
    'We each time look up to mirror the mysterious response, look down to examine human plans; advancing We consider the Ways achievement, retreating We consider the states canon—how can We follow the Dukes modest restraint and long hoard the grand plan?',
    'We look up to mirror the mysterious response and down to examine human plans; advancing We consider the Ways achievement, retreating the states canon—how can We follow the Dukes modest restraint and long hoard the grand plan?',
  ],
  s0396: [
    'It is fitting respectfully to carry out the great rite and truly fulfill the hope of the hidden and manifest.',
    'It is fitting respectfully to carry out the great rite and fulfill the hope of the hidden and manifest.',
  ],
  s0397: [
    'Let him advance from Duke of Song to King, with the ten commanderies Hailing, Dongan, Northern Langye, Northern Dongguan, Northern Donghai, Northern Qiao, and Northern Liang of Xuzhou, and Runan, Northern Yingchuan, and Northern Nandun of Yuzhou, to enlarge the state of Song.',
    'Let him advance from Duke of Song to King, adding ten commanderies—Hailing, Dongan, Northern Langye, Northern Dongguan, Northern Donghai, Northern Qiao, and Northern Liang in Xuzhou, and Runan, Northern Yingchuan, and Northern Nandun in Yuzhou—to enlarge the state of Song.',
  ],
  s0398: [
    'His Chancellor of State, Governor of Yangzhou, and continuing as Campaigning-west General and Governor of the four provinces Si, Yu, Northern Xu, and Yong are as before.',
    'He remains Chancellor of State, Governor of Yangzhou, Campaigning-west General, and governor of Si, Yu, Northern Xu, and Yong.',
  ],
  s0399: [
    'In the eleventh month, Forward General Liu Muzhi died; Left Army Marshal Xu Xianzhi was appointed to take over the duties left behind.',
    'In the eleventh month Forward General Liu Muzhi died; Left Army Marshal Xu Xianzhi took over the duties left behind.',
  ],
  s0400: [
    'Great affairs that formerly were decided by Muzhi were all alike brought to consultation.',
    'All great affairs formerly decided by Muzhi were alike referred to him for consultation.',
  ],
  s0401: [
    'The Duke wished to halt his chariot at Chang\u2019an and plan strategy for Zhao and Wei; it happened that Muzhi died, and therefore he returned.',
    'The Duke wished to halt at Chang\u2019an and plan for Zhao and Wei; when Muzhi died, he returned.',
  ],
};

for (const s of data.sentences) {
  const t = T[s.id];
  if (!t) {
    console.error('missing', s.id);
    process.exit(1);
  }
  s.literal = t[0];
  s.idiomatic = t[1];
}

fs.writeFileSync(
  'translations/current_translation_songshu.json',
  JSON.stringify(data, null, 2) + '\n'
);
console.log('done', data.sentences.length);
