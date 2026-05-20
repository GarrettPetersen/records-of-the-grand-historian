#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 40, Biography 34',
    'Book of Liang, Volume 40, Biography 34',
  ],
  s0002: [
    'Sima Jiong; Dao Gai; Liu Xian; Liu Zhilin; his brother Zhixian; Xu Mao',
    'Sima Jiong; Dao Gai; Liu Xian; Liu Zhilin; his brother Zhixian; Xu Mao',
  ],
  s0003: [
    'Sima Jiong, courtesy name Yuansu, was a native of Wen in Henei.',
    'Sima Jiong, styled Yuansu, came from Wen in Henei.',
  ],
  s0004: [
    'His great-grandfather Chunzhi was Jin Minister of Finance and Prince Jing of Gaomi.',
    'His great-grandfather Chunzhi had been Jin’s Minister of Finance and Prince Jing of Gaomi.',
  ],
  s0005: [
    'His grandfather Rangzhi was an External Regular Attendant.',
    'His grandfather Rangzhi served as External Regular Attendant.',
  ],
  s0006: [
    'His father Xie was expert in the Three Rites; serving Qi, he reached the post of Erudite of the National University.',
    'His father Xie mastered the Three Rites and, under Qi, rose to Erudite of the National University.',
  ],
  s0007: [
    'Jiong in youth inherited the family craft, applied himself with fierce concentration, and never laid his scrolls aside; of every ritual text his work touched, he had looked into nearly all.',
    'From boyhood Jiong carried on the family learning, drove himself without relent, and scarcely set a book down; among ritual writings, there was scarcely one he had not read through.',
  ],
  s0008: [
    'Liu Yun of Pei, acclaimed as patriarch of the ru, honored his learning and was deeply fond of him.',
    'Liu Yun of Pei, hailed as doyen of the Confucian scholars, admired his erudition and became his warm friend.',
  ],
  s0009: [
    'In youth he was close with Ren Fang of Le’an, who likewise held him in esteem.',
    'As a young man he was intimate with Ren Fang of Le’an, who also prized him highly.',
  ],
  s0010: [
    'He first served as a student of the National University, entered office as Supporter of the Court, and was soon promoted to Administrative Officer on the prince’s staff.',
    'He began as a National University student, took his first post as Supporter of the Court, and soon became an administrative officer on a princely staff.',
  ],
  s0011: [
    'At the opening of Tianjian, an edict called on broad scholars to compile the Five Rites; the authorities nominated Jiong to work on the ceremonial rites, and he was appointed Attendant Gentleman in the Ministry of Rites.',
    'When Tianjian opened, the throne ordered learned men to shape the Five Rites; Jiong was put forward for the ceremonial canon and made Attendant Gentleman in the Ministry of Rites.',
  ],
  s0012: [
    'At that time ritual and music were being newly fixed, and many of Jiong’s proposals were put into practice.',
    'While the court was founding its ritual music, much of what Jiong proposed was adopted.',
  ],
  s0013: [
    'He was appointed Commandant of Footsoldiers and concurrently Master of Documents for Palace Affairs.',
    'He was made Commandant of Footsoldiers and also Master of Documents for Palace Affairs.',
  ],
  s0014: [
    'Jiong’s learning was especially sharp in liturgical minutiae; for state rites of fortune and calamity, celebrated ru of the day—Mingshan Bin, He Qian, and others—when they could not decide, all turned to him.',
    'Jiong excelled above all in the arithmetic of ceremony; when eminent ritualists such as Mingshan Bin and He Qian could not settle a point of state rite, they took his word as final.',
  ],
  s0015: [
    'He was promoted in succession to Regular Attendant and Military Advisor to the Defender of the South, still holding his post as Master of Documents.',
    'He rose in turn to Regular Attendant and military advisor to the Defender of the South, keeping his palace secretariat post.',
  ],
  s0016: [
    'He was transferred to Right Vice Director of the Ministry of Works.',
    'He was moved to Right Vice Director of the Ministry of Works.',
  ],
  s0017: [
    'He went out as Chief Clerk to Renwei and Interior Magistrate of Changsha.',
    'He left the capital as chief clerk to Renwei and magistrate of Changsha.',
  ],
  s0018: [
    'On return he was made General of Clouded Cavalry and acting Censor-in-Chief; before long the acting title became permanent.',
    'Recalled, he became General of Clouded Cavalry and acting Censor-in-Chief; soon the acting post was confirmed.',
  ],
  s0019: [
    'In year sixteen he went out as Chief Clerk to the Prince of Nankang, Xuanyi, with charge of the princely administration and the Shitou garrison.',
    'In year sixteen he served as chief clerk to Prince Xuanyi of Nankang, directing both the princely household and the Shitou garrison.',
  ],
  s0020: [
    'Though serving outside the capital, he received orders to attend the Wende and Wude Halls for roster salutation with no fixed schedule.',
    'Even while posted abroad, he was ordered to present himself for roster greeting at the Wende and Wude halls whenever summoned.',
  ],
  s0021: [
    'In year seventeen he was transferred to General of Illustrious Might and Chief Clerk to the Prince of Jin’an; before long he died.',
    'Year seventeen brought him the rank of General of Illustrious Might and chief clerk to the Prince of Jin’an; he died not long after.',
  ],
  s0022: [
    'The prince ordered Recorder Yu Jianyi to collect his writings in ten scrolls; he also authored Ceremonial Rites with Commentary in one hundred twelve scrolls.',
    'The prince had Yu Jianyi compile his writings in ten scrolls; Jiong himself had composed Ceremonial Rites with Commentary in one hundred twelve scrolls.',
  ],
  s0023: [
    'Dao Gai, courtesy name Maoguan, was a native of Wuyuan in Pengcheng.',
    'Dao Gai, styled Maoguan, came from Wuyuan in Pengcheng.',
  ],
  s0024: [
    'His great-grandfather Yanzhi was a Cavalry General of Song.',
    'His great-grandfather Yanzhi had been Song’s Cavalry General.',
  ],
  s0025: [
    'His grandfather Zhongdu was Attendant on the King of Jiangxia, Cavalry General.',
    'His grandfather Zhongdu served the King of Jiangxia, Cavalry General, as attendant.',
  ],
  s0026: [
    'His father Tan was a Secretariat Gentleman of Qi.',
    'His father Tan was a Secretariat Gentleman under Qi.',
  ],
  s0027: [
    'Gai was orphaned young and poor; he and his younger brother Qia were both clever and talented, early known to Ren Fang, and his reputation spread all the more.',
    'Gai lost his parents early and grew up poor; he and his brother Qia were both bright and learned, noticed early by Ren Fang, and his name rang farther still.',
  ],
  s0028: [
    'He entered office as Left Regular Attendant in the prince’s domain, became Acting Administrative Officer of the Rear Army, and served through as a Palace Attendant.',
    'He began as left regular attendant in a princely fief, became acting administrative officer of the Rear Army, and rose to palace attendant.',
  ],
  s0029: [
    'He went out as Interior Magistrate of Jian’an, was promoted Secretariat Gentleman, jointly held the Ministry of Personnel, and Attendant of the Heir Apparent.',
    'He served as magistrate of Jian’an, then became Secretariat Gentleman, joint director of the Ministry of Personnel, and attendant to the heir apparent.',
  ],
  s0030: [
    'When the Prince of Xiangdong, Yi, was Governor of Kuaiji, Gai was made Chief Clerk of Light Chariots with charge of the prefecture and princely administration.',
    'When Prince Yi of Xiangdong governed Kuaiji, Gai was made chief clerk of light chariots with full charge of prefecture and princely affairs.',
  ],
  s0031: [
    'The Founding Emperor instructed the prince: “Dao Gai is not merely here to work for you; he is fit to be your teacher. Whenever anything arises, you must consult him.”',
    'The Founding Emperor told the prince, “Dao Gai is not simply your agent—he is fit to be your teacher. On every matter you should seek his counsel.”',
  ],
  s0032: [
    'When his mother died, he observed mourning to the letter, and the court praised him.',
    'At his mother’s death he mourned to the last propriety, and the court commended him.',
  ],
  s0033: [
    'After mourning ended, he ate only vegetables and wore plain cloth for years.',
    'When mourning was done, he kept to vegetables and plain cloth for years on end.',
  ],
  s0034: [
    'He was appointed Regular Attendant-in-Ordinary with Unimpeded Access, Censor-in-Chief, Director of the Palace Treasuries, Minister Director of Justice, Chief Clerk and Governor of Jiangxia in Yingzhou, with promotion to General Who Attracts from Afar, then entered court as Minister of the Left Household.',
    'He became Regular Attendant with unimpeded access, Censor-in-Chief, Director of the Palace Treasuries, Minister Director of Justice, chief clerk and governor of Jiangxia in Yingzhou, then General Who Attracts from Afar, and finally returned as Minister of the Left Household.',
  ],
  s0035: [
    'Gai stood eight feet tall, with handsome bearing and graceful deportment; wherever he served he cultivated himself in integrity.',
    'Eight feet in stature, with striking presence and measured grace, he kept his conduct white wherever he was posted.',
  ],
  s0036: [
    'By nature he was also plain and frugal, indifferent to music and women; his rooms held only a bare bed and no concubine attended him.',
    'He was spare by temperament, caring nothing for music or women; his chamber held a single bed and no attendant concubine.',
  ],
  s0037: [
    'Beyond that, he cared nothing for show in carriage or dress; cap and shoes he changed once in ten years, court robes sometimes worn to holes, yet when heralds cleared the road it was only to observe what office required.',
    'Carriage and garments he kept unadorned; cap and shoes he replaced once a decade, court robes sometimes patched through, yet when runners cleared the way it was only to honor the dignity of office.',
  ],
  s0038: [
    'Before long he was demoted for an offense to Grand Master for the Imperial Clan with the Golden Ornament; soon after he was appointed Regular Attendant-in-Ordinary, Chamberlain for Attendants, and Grand Master of Sacrifices.',
    'Shortly he was demoted to Grand Master for the Imperial Clan with the Golden Ornament for an offense; soon he was again Regular Attendant, Chamberlain for Attendants, and Grand Master of Sacrifices.',
  ],
  s0039: [
    'Gai was by nature cautious and steadfast and enjoyed special favor from the Founding Emperor; they often played go from evening till dawn.',
    'Steadfast and decorous, he won unusual favor from the Founding Emperor, who would play go with him from dusk until daybreak.',
  ],
  s0040: [
    'In Gai’s residence among hills and pools was a strange stone; the emperor jested of wagering for it along with a full copy of the Book of Rites, and Gai lost both—but had not yet delivered them when the emperor said to Zhu Yi:',
    'Among the hills and pools at Gai’s house stood a curious stone; the emperor wagered it against a complete Book of Rites, and Gai lost both—yet before he could send them over, the emperor said to Zhu Yi:',
  ],
  s0041: [
    '“Do you think what Dao Gai has lost can be sent yet?”',
    '“Do you suppose Dao Gai’s losses are ready to be delivered?”',
  ],
  s0042: [
    'Gai folded his tablet and replied: “Having taken service under my lord, how dare I fail in propriety.”',
    'Gai folded his memorial tablet and answered, “Having become your servant, how dare I be remiss in ritual?”',
  ],
  s0043: [
    'The emperor laughed loud; such was his cherished intimacy.',
    'The emperor laughed heartily—such was the warmth between them.',
  ],
  s0044: [
    'Later blindness overtook him through illness; an edict let him hold his posts as Grand Master for the Imperial Clan and Regular Attendant-in-Ordinary while convalescing at home.',
    'Later illness took his sight; he was ordered to keep his titles as Grand Master for the Imperial Clan and Regular Attendant while nursing himself at home.',
  ],
  s0045: [
    'The Dao household was harmonious; the brothers were deeply fond of one another.',
    'The Dao family lived in concord; the brothers loved one another with uncommon devotion.',
  ],
  s0046: [
    'Early on he and his brother Qia had shared one study; after Qia’s death he turned the room into a temple, forsook meat for life, ate only vegetables, and built a small chamber where morning and evening he chanted with the monks.',
    'Once he and Qia had shared a single study; when Qia died he made it a temple, renounced flesh for life, ate only vegetables, and built a small room where dawn and dusk he joined the monks in chant.',
  ],
  s0047: [
    'Every month on the third day the Founding Emperor sent pure food; his favor was deep indeed.',
    'On the third of each month the Founding Emperor sent him pure fare—his kindness ran that deep.',
  ],
  s0048: [
    'On Mount Jiang was Yanxian Monastery, which the Dao family had founded in generations past; his public salary in life all went to it—he took almost nothing for himself.',
    'On Mount Jiang stood Yanxian Monastery, founded by the Dao line; in life he poured his official salary into it and kept almost nothing.',
  ],
  s0049: [
    'He also shunned socializing, sharing only close friendship with Zhu Yi, Liu Zhilin, and Zhang Chuan.',
    'He cared little for society, counting only Zhu Yi, Liu Zhilin, and Zhang Chuan as intimate friends.',
  ],
  s0050: [
    'When sick at home his gate could have been strung with nets for birds; the three friends each year would ride with state escort out of their way to call on him, set wine, recall their lives together, and leave in highest spirits.',
    'Ill at home, his gate might have been hung with nets for sparrows; yet each year the three would ride with official escort out of their way, bring wine, talk over old times, and part in full joy.',
  ],
  s0051: [
    'At the end he entrusted Zhang and Liu to urge his sons toward simple burial; he died at seventy-two.',
    'Near death he asked Zhang and Liu to press his sons toward a plain funeral; he died at seventy-two.',
  ],
  s0052: [
    'An edict posthumously granted his former office.',
    'An edict restored his last office posthumously.',
  ],
  s0053: [
    'His collected writings in twenty scrolls circulated in the world.',
    'His collected works, twenty scrolls, circulated abroad.',
  ],
  s0054: [
    'Of the day Gai and Qia were likened to the two Lu brothers, so Emperor Shizong wrote in verse: “Wei prized the twin Dings, Jin acclaimed the two Lus—how does it compare with two Daos now, bamboo braving the cold?”',
    'Men compared Gai and Qia to the two Lu brothers, and Emperor Shizong wrote, “Wei honored the twin Dings, Jin praised the two Lus—what of two Daos today, bamboo standing through the cold?”',
  ],
  s0055: [
    'His son Jing, courtesy name Yuanzhao, was Acting Administrative Officer in the Law Bureau of the Prince of Xiangdong in the West, Attendant to the Heir Apparent—and died young.',
    'His son Jing, styled Yuanzhao, served as acting law officer to the Prince of Western Xiangdong and attendant to the heir apparent, and died young.',
  ],
  s0056: [
    'Jing’s son Shen was clever from childhood; he entered office as Assistant Editor in the Palace Library, served as Attendant to the Heir Apparent, secretary to the Prince of Xuancheng, Groom of the Heir Apparent, and Attendant in the Secretariat Chancellery.',
    'Jing’s son Shen was precocious; he began in the Palace Library, became attendant to the heir apparent, secretary to the Prince of Xuancheng, groom of the heir apparent, and chancellery attendant.',
  ],
  s0057: [
    'Once when he followed the Founding Emperor to Jingkou and the emperor composed a poem on the Northern Prospect Tower, Shen received the command to compose on the spot; the emperor showed it to Gai: “Shen must be a gifted man—I fear your writings all along were Shen’s hand at work.”',
    'Once, when the Founding Emperor visited Jingkou and improvised a poem on the Northern Prospect Tower, Shen was told to answer on the spot; the emperor showed Gai the result: “Shen is surely a talent—I suspect your essays have been his work all along.”',
  ],
  s0058: [
    'He then bestowed on Gai a Linked Pearls verse: “Grind ink for soaring words, let the brush’s tip fly in faithful script.',
    'He then gave Gai a Linked Pearls poem: “Grind ink till the words take flight; let the brush-tip race in loyal script.',
  ],
  s0059: [
    'Like the moth that seeks the flame—how can it spare its body being burned?”',
    'Like the moth that flies to flame—what body would it not burn?”',
  ],
  s0060: [
    'When old age must come, one may borrow from young Shen.”',
    'When old age arrives, one may borrow from young Shen.”',
  ],
  s0061: [
    'Such was the measure of his regard.',
    'Such was the depth of his esteem.',
  ],
  s0062: [
    'He was appointed Assistant Magistrate of Danyang.',
    'He was made assistant magistrate of Danyang.',
  ],
  s0063: [
    'In the chaos of Taiqing he went to Jiangling and died there.',
    'In the Taiqing turmoil he went to Jiangling and died there.',
  ],
  s0064: [
    'Liu Xian, courtesy name Sifang, was a native of Xiang in Pei.',
    'Liu Xian, styled Sifang, came from Xiang in Pei.',
  ],
  s0065: [
    'His father Kan was Interior Magistrate of Jin’an.',
    'His father Kan had been interior magistrate of Jin’an.',
  ],
  s0066: [
    'Xian was clever from childhood; his contemporaries called him a divine child.',
    'Xian was bright from childhood; men of his day called him a prodigy.',
  ],
  s0067: [
    'At the opening of Tianjian he was recommended as a cultivated talent, relieved his clerk’s collar as Administrative Officer on the staff of the Prince of Linchuan in the Central Army, and soon served as Chief of the Law Bureau.',
    'When Tianjian opened he was presented as a cultivated talent, entered service as staff officer to the Prince of Linchuan in the Central Army, and soon headed the law bureau.',
  ],
  s0068: [
    'Xian loved learning and ranged widely in many fields; once Ren Fang obtained a fragmentary bamboo text with characters scattered and eroded, showed it to everyone, and none could read it—Xian said it was a lost passage deleted from the Old Text Documents, and when Fang checked the Documents of Zhou it matched exactly; Fang was thereafter greatly struck by him.',
    'Xian loved study and ranged across many disciplines; once Ren Fang had a bamboo slip with characters broken and faded, showed it around, and no one could read it—Xian said it was a lost passage cut from the Old Text Documents; Fang checked the Documents of Zhou and found it exact, and from then held him in wonder.',
  ],
  s0069: [
    'When his mother’s mourning ended, the Minister and Chief Minister of Works Shen Yue came in his carriage to visit, and at the seat tested Xian on ten matters from the classics and histories—Xian answered nine.',
    'After his mother’s mourning, Minister Shen Yue came by carriage to call on him and, seated, examined him on ten points of canon and history—Xian answered nine.',
  ],
  s0070: [
    'Yue said: “This old man is muddled and forgetful; I cannot submit to examination—”',
    'Yue said, “This old man is dim and forgetful; I cannot sit for your test—”',
  ],
  s0071: [
    '“Even so, let me try a few things—you must not reach ten.”',
    '“Still, try me on a few—you must not make it ten.”',
  ],
  s0072: [
    'Xian questioned him on five; Yue answered two.',
    'Xian put five questions to him; Yue answered two.',
  ],
  s0073: [
    'Lu Zuo heard of it and sighed: “One may say Master Liu is a man apart—even when our house’s Lu Ji called on Zhang Hua, or when Wang Can visited Cai Yong, there could not have been such parry and riposte.”',
    'Lu Zuo heard and sighed, “Master Liu is a man apart—even when our Lu Ji sought out Zhang Hua, or Wang Can called on Cai Yong, there was never such an exchange.”',
  ],
  s0074: [
    'Such was the esteem in which leading minds held him.',
    'So the leading men of the age honored him.',
  ],
  s0075: [
    'When Yue became Mentor to the Heir Apparent, he brought Xian in as Aide in the Five Offices, and soon he also served as Director under the Court of Judicial Review.',
    'When Yue became mentor to the heir apparent, he drew Xian in as aide in the Five Offices; soon Xian also served as director under the Court of Judicial Review.',
  ],
  s0076: [
    'Fu Zhao, Minister of the Five Armies and in charge of historiography, was compiling the national history and brought Xian in as assistant.',
    'Fu Zhao, Minister of the Five Armies and overseer of historiography, was compiling the national history and took Xian as his assistant.',
  ],
  s0077: [
    'In year nine the Ministry system was first reformed for the five directorates of selection; Xian in his existing post also served as Director in the Ministry of Personnel, was further appointed External Military Officer to the Prince of Linchuan, Minister of Ceremonies, and was transferred to Attendant Gentleman for Ceremonial Affairs.',
    'In year nine the five selection directorates were first reformed; Xian kept his post while also serving as director in the Ministry of Personnel, was made external military officer to the Prince of Linchuan, Minister of Ceremonies, and then Attendant Gentleman for Ceremonial Affairs.',
  ],
  s0078: [
    'Once he composed a poem on morning audience; Shen Yue read it with admiration, and at the time Yue’s suburban residence was newly built—he had a scribe paint it on the wall.',
    'He once wrote a poem on the morning audience; Shen Yue admired it, and when Yue’s suburban house was newly finished he had a scribe brush it on the wall.',
  ],
  s0079: [
    'He went out as Recorder on the staff of the Prince of Linchuan.',
    'He left the capital as recorder to the Prince of Linchuan.',
  ],
  s0080: [
    'When Jiankang was pacified he returned as Vice Director of Ceremonial Affairs in the Ministry of Rites and concurrently Master of Documents for Palace Affairs.',
    'After Jiankang was pacified he returned as vice director of ceremonial affairs and again Master of Documents for Palace Affairs.',
  ],
  s0081: [
    'He went out as Magistrate of Moling, was again made Recorder to the Prince of Poyang, Cavalry General, with concurrent service as Master of Documents, and was promoted in succession to Commandant of Footsoldiers and Gentleman of the Secretariat, still Master of Documents.',
    'He served as magistrate of Moling, then recorder to the Prince of Poyang, Cavalry General, again Master of Documents, and rose to Commandant of Footsoldiers and Secretariat gentleman, keeping the palace post throughout.',
  ],
  s0082: [
    'Xian, Pei Ziye of Hedong, Liu Zhilin of Nanyang, and Gu Xie of Wu commandery served together inside the palace in rotation, teaching one another as teacher and friend—the men of the time all envied them.',
    'Xian, Pei Ziye of Hedong, Liu Zhilin of Nanyang, and Gu Xie of Wu served together within the palace gates, learning from one another as teacher and friend—men of the age envied them.',
  ],
  s0083: [
    'Xian’s learning and memory exceeded Pei and Gu; when Wei presented an ancient vessel with raised characters none could read, Xian traced the text without hesitation, checked dates without a single error, and the Founding Emperor was much pleased.',
    'Xian’s erudition and memory surpassed Pei and Gu; when Wei sent an antique with raised script no one could decipher, Xian read it straight through, fixed the dates without one mistake, and the Founding Emperor was delighted.',
  ],
  s0084: [
    'He was transferred to Left Vice Director of the Ministry of Works and appointed Erudite of the National University.',
    'He became Left Vice Director of the Ministry of Works and Erudite of the National University.',
  ],
  s0085: [
    'He went out as Chief Clerk to the Prince of Yueyang, Xuan yuan, with charge of the princely administration—but before he took up the post was transferred as Chief Clerk to the Prince of Shaoling, Yunhui, and Governor of Xunyang.',
    'He was named chief clerk to Prince Xuanyuan of Yueyang with charge of the princely household, but before he assumed the post was shifted to chief clerk to Prince Yunhui of Shaoling and governor of Xunyang.',
  ],
  s0086: [
    'In the ninth year of Datong the prince was reassigned to garrison Yingzhou; Xian was made Military Advisor for Pacifying the West with promotion to General of Martial Brilliance.',
    'In Datong year nine the prince was reassigned to garrison Yingzhou; Xian became military advisor for pacifying the west with the rank of General of Martial Brilliance.',
  ],
  s0087: [
    'That year he died, aged sixty-three.',
    'That year he died, at sixty-three.',
  ],
  s0088: [
    'His friend Liu Zhilin memorialized the Crown Prince: “Zhilin has heard that Boyi, Shuqi, and Liuxia Hui—had Confucius not spoken a word, they would have been starving men of the western hills, disgraced scholars of the eastern state; would their names have reached later ages?',
    'His friend Liu Zhilin wrote to the crown prince: “Zhilin has heard that Boyi, Shuqi, and Liuxia Hui—without a word from Confucius—would have been starving men on the western hills, humbled scholars in the eastern state; would their names have lived on?',
  ],
  s0089: [
    'So it is true!',
    'Truly so!',
  ],
  s0090: [
    'Born with a body seven feet tall, in the end one coffin’s earth.',
    'A body seven feet high is born; in the end it fills but one coffin of earth.',
  ],
  s0091: [
    'What outlasts death is entrusted to words on the page; those who clasp pearl and jade yet go nameless when they die—what sigh can be longer? And who more so than this?',
    'Immortality is left to what is written; those who hold pearl and jade may still die without a name—what grief is deeper? And who deeper than this?',
  ],
  s0092: [
    'I grieve that my friend Liu Xian of Pei, his literary gifts wrapped close as gems in a casket, delving to the depths of the profound, with singular intelligence surpassing his kind—',
    'I mourn my friend Liu Xian of Pei, who hoarded learning like gems in a casket, plumbed the deepest texts, and with rare brilliance stood above his peers—',
  ],
  s0093: [
    'The coffin closed in Ying’s capital, his soul returning to the upper realm; the day to fix his grave approaches and the tomb tablet must be carved.',
    'His coffin was closed in the capital of Ying, his soul returning to the upper land; the day to choose his grave is near, and the tomb stone must be cut.',
  ],
  s0094: [
    'Zhilin has already drafted an account of his conduct and now respectfully submits it.',
    'Zhilin has already drafted his life’s record and now respectfully presents it.',
  ],
  s0095: [
    'I bow that your vast grace may descend in luminous composition, to honor these dry bones and comfort a shadow soul.',
    'I beg that your vast mercy may grant luminous words, to grace these dry bones and comfort a shade in the dark.',
  ],
  s0096: [
    'Presuming to raise this dust before your hearing, I tremble without a place to stand.',
    'Daring to trouble your hearing with this dust, I tremble and know not where to stand.',
  ],
  s0097: [
    'He received an order for an inscription: “When Fanruo drew its nature from emptiness, Kongsang gave forth its tone—distributed, vessels gained weight; spread abroad, music and fame endure.',
    'He received an order to compose the epitaph: “When the strong bow drew substance from the void, the hollow mulberry gave forth its sound—once the vessel was allotted, it was prized; once the music spread, its name endured.',
  ],
  s0098: [
    'Who balanced such things?',
    'Who held the balance?',
  ],
  s0099: [
    'There was a brilliant gentleman.',
    'There was a splendid gentleman.',
  ],
  s0100: [
    'Rites marked in boyhood, accomplishment clear in mature years.',
    'Ritual showed itself in his youth, mastery in his prime.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_040_b1.mjs <translation.json>'
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
