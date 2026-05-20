#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'He first took office as Gentleman of the Prince of Yuzhang\'s kingdom in Qi, and was promoted in succession to Court Attendant and staff officer on the Western Campaign.',
    'He entered service as Gentleman of the Qi Prince of Yuzhang\'s kingdom, then rose to Court Attendant and Western Campaign staff officer.',
  ],
  s0402: [
    'At the beginning of the Tianjian era he was transferred as staff officer to the Prince of Linchuan, concurrently Assistant Instructor at the Imperial University, then became Merit Officer of the Prince of Ancheng and concurrently Doctor of the Five Classics, gathering disciples to teach.',
    'Early in Tianjian he became the Prince of Linchuan\'s staff officer and Imperial University assistant instructor, then the Prince of Ancheng\'s merit officer and Five Classics doctor, teaching a large following.',
  ],
  s0403: [
    'Hua was broadly learned and quick in debate; in expounding the classics and analyzing principle he was the foremost of the age.',
    'Hua was widely read and sharp in debate; in lecturing and analysis he stood first in his day.',
  ],
  s0404: [
    'Since the Eastern Jin, pitch-pipes and scales had been a lost study; with Hua it was mastered again.',
    'Since the Eastern Jin, music theory had died out; Hua revived it.',
  ],
  s0405: [
    'He was promoted to Gentleman of the Ministry of Rites and sent out as magistrate of Wu, where he died.',
    'He rose to Gentleman of the Ministry of Rites, served as magistrate of Wu, and died in office.',
  ],
  s0406: [
    'Cui Ling\'en',
    'Cui Ling\'en',
  ],
  s0407: [
    'Cui Ling\'en was a man of Wucheng in Qinghe.',
    'Cui Ling\'en was from Wucheng in Qinghe.',
  ],
  s0408: [
    'In youth he was devoted to study; following teachers he mastered the Five Classics throughout, and was especially expert in the Three Rites and the Three Commentaries.',
    'As a youth he studied hard, mastered the Five Classics under many teachers, and excelled in the Three Rites and Three Commentaries.',
  ],
  s0409: [
    'He had first served in the north as Erudite of the Grand Temple; in the thirteenth year of Tianjian he returned to the realm.',
    'He had served in the north as Grand Temple erudite and returned home in Tianjian year thirteen.',
  ],
  s0410: [
    'The High Ancestor, for his Confucian learning, promoted him to Outer Attendant of Scattered Cavalry and in succession to Commandant of Footsoldiers, concurrently Doctor of the Imperial University.',
    'Gaozu valued his scholarship and made him Outer Attendant of Scattered Cavalry, then Commandant of Footsoldiers and Imperial University doctor.',
  ],
  s0411: [
    'Ling\'en gathered disciples to lecture; listeners often numbered several hundred.',
    'Ling\'en taught a large following; audiences often ran to hundreds.',
  ],
  s0412: [
    'By nature he was plain and unadorned, without presence; yet in explaining the classics and analyzing principle he was very refined, and the old scholars of the capital all esteemed him—Assistant Instructor Kong Qian especially favored his learning.',
    'Plain and without airs, he was nonetheless keen in exegesis; capital scholars esteemed him, and Assistant Instructor Kong Qian prized his teaching above all.',
  ],
  s0413: [
    'Ling\'en had first studied Fu Qian\'s commentary on the Zuo Tradition, which was not followed east of the Yangzi;',
    'He had first studied Fu Qian on the Zuo Tradition, unused in the southeast;',
  ],
  s0414: [
    'when he turned to expounding Du Yu\'s meaning, in every phrase he would invoke Fu to challenge Du, and therefore wrote "Entries on the Zuo Tradition" to clarify his view.',
    'then taught Du Yu and constantly used Fu to press Du, writing Entries on the Zuo Tradition to set out his case.',
  ],
  s0415: [
    'At the time Assistant Instructor Yu Sengdan was also expert in Du\'s learning and therefore composed "Challenging Fu through Du" in reply to Ling\'en; both circulated in the world.',
    'Assistant Instructor Yu Sengdan, expert in Du, answered with Challenging Fu through Du; both works circulated.',
  ],
  s0416: [
    'Sengdan was a man of Yuyao in Kuaiji; he taught the Zuo Tradition, and his listeners too numbered several hundred.',
    'Sengdan of Yuyao in Kuaiji taught the Zuo Tradition to hundreds.',
  ],
  s0417: [
    'His comprehensive mastery of principles and examples was unmatched in the age.',
    'None of the day matched his grasp of principle and example.',
  ],
  s0418: [
    'Earlier Confucian scholars debating Heaven had each held to the dome or the armillary theories; advocates of the dome did not accord with the armillary, and advocates of the armillary did not accord with the dome.',
    'Earlier scholars had split between dome and armillary theories of Heaven, each side rejecting the other.',
  ],
  s0419: [
    'Ling\'en established a doctrine that made dome and armillary one.',
    'Ling\'en argued that dome and armillary were one doctrine.',
  ],
  s0420: [
    'He went out as Interior Governor of Changsha, returned and was appointed Doctor of the Imperial University, and his lecturing audience was especially large.',
    'After governing Changsha he became Imperial University doctor; his audience swelled.',
  ],
  s0421: [
    'He went out as General of Illustrious Might and Inspector of Guizhou and died in office.',
    'He served as General of Illustrious Might and Inspector of Guizhou and died in office.',
  ],
  s0422: [
    'Ling\'en compiled commentaries on the Mao Odes in twenty-two scrolls, commentaries on the Rites of Zhou in forty scrolls, composed "Summaries of the Meaning of the Three Rites" in forty-seven scrolls, "Meaning of the Zuo Classic and Commentary" in twenty scrolls, "Entries on the Zuo Tradition" in ten scrolls, and "Meaning of the Gongyang and Guliang Textual Phrases" in ten scrolls.',
    'His works included twenty-two scrolls on the Mao Odes, forty on the Rites of Zhou, forty-seven on the Three Rites, twenty on the Zuo classic and commentary, ten Zuo entries, and ten on Gongyang and Guliang phrasing.',
  ],
  s0423: [
    'Kong Qian was a man of Shanyin in Kuaiji.',
    'Kong Qian was from Shanyin in Kuaiji.',
  ],
  s0424: [
    'In youth he studied under He Yin, mastered the Five Classics, and was especially expert in the Three Rites, the Classic of Filial Piety, and the Analects; he lectured on each several tens of times, and his students too numbered several hundred.',
    'He studied under He Yin, mastered the Five Classics, and excelled in the Three Rites, Filial Piety, and Analects, lecturing each dozens of times to hundreds of pupils.',
  ],
  s0425: [
    'In office he was Assistant Instructor at the Imperial University, three times Doctor of the Five Classics, and was promoted to Gentleman of the Ministry of Rites.',
    'He was Imperial University assistant instructor, thrice Five Classics doctor, then Gentleman of the Ministry of Rites.',
  ],
  s0426: [
    'He went out as magistrate of the two counties Haiyan and Shanyin.',
    'He served as magistrate of Haiyan and Shanyin.',
  ],
  s0427: [
    'Qian was a Confucian and not skilled in administration; in the counties he achieved nothing.',
    'A scholar without administrative talent, he left no mark as magistrate.',
  ],
  s0428: [
    'In the disorders of the Taiqing era he died at home.',
    'He died at home amid the Taiqing turmoil.',
  ],
  s0429: [
    'His son Chuxuan dabbled in letters and reached the post of Erudite of the Grand Academy.',
    'His son Chuxuan took to literature and became Erudite of the Grand Academy.',
  ],
  s0430: [
    'Qian\'s elder brother\'s son Yuansu was also skilled in the Three Rites, enjoyed great fame, and died young.',
    'His nephew Yuansu, famed for the Three Rites, also died young.',
  ],
  s0431: [
    'Lu Guang was a man of Zhuo in Fanyang and claimed descent from Chen, Attendant at the Masters\' Lodge under Jin.',
    'Lu Guang of Zhuo in Fanyang claimed descent from Jin Attendant Chen.',
  ],
  s0432: [
    'Chen perished in the chaos of Ran Min; of the old clans of the Central Plains in Jin, Chen had descendants.',
    'Chen died in Ran Min\'s rebellion; among Jin\'s central plains families his line survived.',
  ],
  s0433: [
    'Guang in youth understood the classics and possessed Confucian learning.',
    'In youth Guang mastered the classics and Confucian learning.',
  ],
  s0434: [
    'In the Tianjian era he returned to the realm.',
    'He returned south in the Tianjian era.',
  ],
  s0435: [
    'He was first appointed Outer Attendant of Scattered Cavalry, went out as Governor of Shian, and was dismissed for an offense.',
    'He first became Outer Attendant of Scattered Cavalry, governed Shian, and was dismissed for an offense.',
  ],
  s0436: [
    'Before long he was recalled as General Who Breaks the Charge, assigned a thousand troops for the northern campaign, and on return was appointed Commandant of Footsoldiers and concurrently Doctor of the Imperial University, lecturing on the Five Classics throughout.',
    'Soon he was made General Who Breaks the Charge with a thousand men for the northern campaign; returning, he became Commandant of Footsoldiers and Five Classics doctor, lecturing on all five classics.',
  ],
  s0437: [
    'At the time among northerners who came south, the Confucian scholars included Cui Ling\'en, Sun Xiang, and Jiang Xian; all gathered disciples to lecture, yet their pronunciation and diction were coarse and clumsy;',
    'Northern scholars such as Cui Ling\'en, Sun Xiang, and Jiang Xian all taught large followings, but their speech was crude;',
  ],
  s0438: [
    'only Guang\'s discourse was refined and clear, not like a northerner.',
    'only Guang spoke elegantly, unlike a northerner.',
  ],
  s0439: [
    'The Vice Director Xu Mian, who was also versed in the classics, deeply appreciated and favored him.',
    'Vice Director Xu Mian, himself learned in the classics, prized him highly.',
  ],
  s0440: [
    'Soon he was promoted to Outer Regular Attendant of Scattered Cavalry, his doctorate unchanged.',
    'He soon rose to Outer Regular Attendant of Scattered Cavalry while keeping his doctorate.',
  ],
  s0441: [
    'He went out as Chief Clerk to the Heir of Prince Xinyang of Guiyang and Governor of Xunyang.',
    'He served as chief clerk to the Guiyang heir and governor of Xunyang.',
  ],
  s0442: [
    'He then became Chief Clerk to the Prince of Wuling, his governorship unchanged, and died in office.',
    'He became chief clerk to the Prince of Wuling, kept his prefecture, and died in office.',
  ],
  s0443: [
    'Shen Jun, courtesy name Shisong, was a man of Wukang in Wuxing.',
    'Shen Jun, styled Shisong, was from Wukang in Wuxing.',
  ],
  s0444: [
    'His family for generations were farmers; Jun came to love learning and, with his maternal uncle Taishi Shuming, studied for many years under their clansman Shen Linshi.',
    'Farmers for generations, Jun turned to study and, with his uncle Taishi Shuming, spent years under Shen Linshi.',
  ],
  s0445: [
    'Day and night he set himself lessons; when he sometimes fell asleep he would strike himself with a staff—such was his resolute will.',
    'He studied day and night and beat himself with a staff when he dozed—such was his resolve.',
  ],
  s0446: [
    'After Linshi died he went to the capital, traveled every lecture hall, and thus mastered the Five Classics, especially excelling in the Three Rites.',
    'After Linshi\'s death he went to the capital, visited every school, mastered the Five Classics, and excelled in the Three Rites.',
  ],
  s0447: [
    'He first served as Commandant of a princely kingdom, was gradually promoted to Gentleman, and in both posts concurrently served as Assistant Instructor at the Imperial University.',
    'He began as a kingdom commandant, rose to gentleman, and held both posts while assisting at the Imperial University.',
  ],
  s0448: [
    'At the time the Director of the Ministry of Personnel Lu Chan wrote to Vice Director Xu Mian recommending Jun, saying: "The Doctor of the Five Classics Yu Jida must be replaced; I reckon the court will wish to choose the man with care.',
    'Director Lu Chan wrote Xu Mian recommending Jun: "Five Classics doctor Yu Jida must be replaced; the court will choose carefully.',
  ],
  s0449: [
    'Of all books the sages and worthies could lecture on, principle must be established through the Offices of Zhou—thus that book is truly the source and root of the cluster of classics.',
    'Sacred books that can be taught must take the Offices of Zhou as their foundation—that book is the root of the classics.',
  ],
  s0450: [
    'This learning has not been transmitted for many years; northerners Sun Xiang and Jiang Xian also once heard and studied it, yet their accents mixed Chu and Xia, so students did not come;',
    'The subject has been lost for generations; Sun Xiang and Jiang Xian studied it, but their accents mixed north and south, and pupils stayed away;',
  ],
  s0451: [
    'only Assistant Instructor Shen Jun is especially expert in this book.',
    'only Assistant Instructor Shen Jun truly masters it.',
  ],
  s0452: [
    'Recently he has opened a lecture hall; the Confucians Liu Yan, Shen Hong, Shen Xiong, and the like all hold the classics and sit below, facing north to receive his teaching—none fail to sigh in admiration, and no one voices dissent.',
    'He has lately opened a hall; Liu Yan, Shen Hong, Shen Xiong, and others sit below with their texts, face north, and all admire him without dissent.',
  ],
  s0453: [
    'I would say this man should be employed at once, ordered to devote himself to this one learning, turning and returning without end.',
    'He should be appointed at once to teach this subject alone, again and again.',
  ],
  s0454: [
    'Let the sage\'s correct canon, though abandoned, rise anew;',
    'Let the sage\'s canon, though fallen, rise again;',
  ],
  s0455: [
    'let learning cut off for generations pass to scholars.',
    'let a craft lost for generations pass to students.',
  ],
  s0456: [
    '" Mian followed this and memorialized Jun as concurrent Doctor of the Five Classics.',
    '" Mian agreed and memorialized Jun as concurrent Five Classics doctor.',
  ],
  s0457: [
    'At the academy he lectured; listeners often numbered several hundred.',
    'He lectured at the academy to audiences of hundreds.',
  ],
  s0458: [
    'He went out as magistrate of Huarong, returned and was appointed Outer Attendant of Scattered Cavalry, and again served concurrently as Doctor of the Five Classics.',
    'After Huarong he became Outer Attendant of Scattered Cavalry and again Five Classics doctor.',
  ],
  s0459: [
    'At the time Palace Secretary He Chen received an edict to compile the "Offices of Liang" and therefore memorialized Jun and Kong Ziqu to be added as Western Department academicians to assist in compilation.',
    'Palace Secretary He Chen, compiling the Offices of Liang, named Jun and Kong Ziqu Western Department academicians to assist.',
  ],
  s0460: [
    'When the book was finished he entered service concurrently as Palace Secretary for General Affairs.',
    'When the work was done he became Palace Secretary for General Affairs.',
  ],
  s0461: [
    'He went out as magistrate of Wukang and died in office.',
    'He governed Wukang and died in office.',
  ],
  s0462: [
    'His son Wen\'a inherited his father\'s craft and was especially expert in the Zuo Tradition.',
    'His son Wen\'a followed his father and excelled in the Zuo Tradition.',
  ],
  s0463: [
    'In the Taiqing era he rose from Assistant Instructor at the Imperial University to Doctor of the Five Classics.',
    'In Taiqing he rose from Imperial University assistant to Five Classics doctor.',
  ],
  s0464: [
    'Those who transmitted Jun\'s craft also included Zhang Ji of Wu commandery and Kong Ziyun of Kuaiji; all reached the posts of Doctor of the Five Classics and Gentleman of the Ministry of Rites.',
    'Zhang Ji of Wu and Kong Ziyun of Kuaiji also carried on his teaching and became Five Classics doctors and Gentlemen of the Ministry of Rites.',
  ],
  s0465: [
    'Taishi Shuming',
    'Taishi Shuming',
  ],
  s0466: [
    'Taishi Shuming was a man of Wucheng in Wuxing and a descendant of Wu\'s Taishi Ci.',
    'Taishi Shuming of Wucheng in Wuxing was descended from Wu\'s Taishi Ci.',
  ],
  s0467: [
    'In youth he was skilled in the Zhuangzi and Laozi and also studied the Classic of Filial Piety and the Record of Rites; in the Three Mysteries he was especially refined in explanation, unmatched in the age; whenever he lectured, listeners often exceeded five hundred.',
    'He mastered Zhuangzi and Laozi, Filial Piety and the Record of Rites, and above all the Three Mysteries; audiences often exceeded five hundred.',
  ],
  s0468: [
    'In office he was Assistant Instructor at the Imperial University.',
    'He served as Imperial University assistant instructor.',
  ],
  s0469: [
    'Prince of Shaoling Lun favored his learning; when Lun went out as governor of Jiangzhou he took Shuming to his post.',
    'Prince of Shaoling Lun prized his learning and took him to Jiangzhou.',
  ],
  s0470: [
    'When the prince moved to Yingzhou Shuming followed the headquarters; wherever they arrived he lectured, and gentlemen beyond the river all transmitted his learning.',
    'When the prince moved to Yingzhou he followed and lectured everywhere; men south of the Yangzi spread his teaching.',
  ],
  s0471: [
    'In the thirteenth year of Datong he died, aged seventy-three.',
    'He died in Datong year thirteen, aged seventy-three.',
  ],
  s0472: [
    'Kong Ziqu',
    'Kong Ziqu',
  ],
  s0473: [
    'Kong Ziqu was a man of Shanyin in Kuaiji.',
    'Kong Ziqu was from Shanyin in Kuaiji.',
  ],
  s0474: [
    'Orphaned young and poor, he loved learning; while plowing and gathering firewood he always carried books with him and, when free, recited them.',
    'Orphaned and poor, he studied while farming and cutting wood, books always at hand for spare moments.',
  ],
  s0475: [
    'Through hard striving he mastered the classics, especially the Ancient Text Book of Documents.',
    'By relentless effort he mastered the classics, especially the Ancient Text Documents.',
  ],
  s0476: [
    'He first served as Gentleman to the Heir of the Prince of Changsha, concurrently Assistant Instructor at the Imperial University; he lectured on the Documents forty times and listeners often numbered several hundred.',
    'He began as gentleman to the Changsha heir and Imperial University assistant, lecturing on the Documents forty times to hundreds.',
  ],
  s0477: [
    'Palace Secretary He Chen received an edict to compile the "Offices of Liang" and memorialized Ziqu as Western Department academician to assist in compilation.',
    'He Chen, compiling the Offices of Liang, named Ziqu a Western Department academician.',
  ],
  s0478: [
    'When the book was finished he was concurrently appointed Vice Director of the Bureau of Letters but did not accept.',
    'When the work was finished he was offered Vice Director of the Bureau of Letters and declined.',
  ],
  s0479: [
    'After long service he was concurrently Master of Guests and Secretary, his academician post unchanged.',
    'Later he doubled as Master of Guests and secretary while remaining an academician.',
  ],
  s0480: [
    'He was promoted in succession to Gentleman of the Prince of Xiangdong\'s kingdom, Regular Attendant, and Outer Attendant of Scattered Cavalry; he also served as Recorder on the staff of the Duke of Lujiang, Cloud-Banner General, and was transferred to concurrent Palace Secretary for General Affairs.',
    'He rose through posts in the Xiangdong princedom to Regular and Outer Attendant of Scattered Cavalry, served the Duke of Lujiang as recorder, and became Palace Secretary for General Affairs.',
  ],
  s0481: [
    'Soon he was promoted to Commandant of Footsoldiers, his secretary post unchanged.',
    'He soon became Commandant of Footsoldiers while keeping his secretary post.',
  ],
  s0482: [
    'The High Ancestor composed "Expository Lectures on the Five Classics" and the "Correct Words of Confucius" and specially ordered Ziqu to examine the mass of books as textual proofs.',
    'Gaozu wrote Expository Lectures on the Five Classics and Correct Words of Confucius and had Ziqu collate the libraries for evidence.',
  ],
  s0483: [
    'When the task was done he was ordered, with Right Guard Zhu Yi and Left Director He Chen, to hold the classics in turn at the Scholars\' Grove.',
    'When finished he was ordered with Zhu Yi and He Chen to lecture in turn at the Scholars\' Grove.',
  ],
  s0484: [
    'He was promoted in succession to Direct Regular Attendant, his secretary post unchanged.',
    'He rose to Direct Regular Attendant while remaining secretary.',
  ],
  s0485: [
    'In the first year of Zhongdatong he died in office, aged fifty-one.',
    'He died in office in Zhongdatong year one, aged fifty-one.',
  ],
  s0486: [
    'Ziqu in all composed "Meaning of the Documents" in twenty scrolls, "Collected Commentary on the Documents" in thirty scrolls, continued Zhu Yi\'s "Collected Commentary on the Changes" in one hundred scrolls, and continued He Chengtian\'s "Collected Discussions on Rites" in one hundred fifty scrolls.',
    'His works included twenty scrolls on the Documents, thirty of collected commentary, one hundred continuing Zhu Yi on the Changes, and one hundred fifty continuing He Chengtian on rites.',
  ],
  s0487: [
    'Huang Kan was a man of Wu commandery, ninth-generation descendant of Regional Inspector Huang Xiang.',
    'Huang Kan of Wu commandery was ninth in descent from Regional Inspector Huang Xiang.',
  ],
  s0488: [
    'Kan in youth loved learning; he studied under He Yan, devoted his energy to a single specialty, and fully mastered his teacher\'s craft, especially excelling in the Three Rites, the Classic of Filial Piety, and the Analects.',
    'He studied under He Yan, mastered his teacher\'s craft, and excelled in the Three Rites, Filial Piety, and Analects.',
  ],
  s0489: [
    'He first took office as concurrent Assistant Instructor at the Imperial University; at the academy he lectured and listeners numbered several hundred.',
    'He began as Imperial University assistant instructor and lectured to hundreds at the academy.',
  ],
  s0490: [
    'He composed "Expository Commentary on the Record of Rites" in fifty scrolls; when the book was finished he presented it, and an edict ordered it deposited in the Secret Archive.',
    'He wrote fifty scrolls of Expository Commentary on the Record of Rites and, when finished, had it placed in the Secret Archive.',
  ],
  s0491: [
    'Before long he was summoned to the Hall of Everlasting Light to lecture on the Meaning of the Record of Rites; the High Ancestor approved and appointed him Outer Attendant of Scattered Cavalry, his assistant instructorship unchanged.',
    'Soon he lectured on the Record of Rites in the Hall of Everlasting Light; Gaozu praised him and made him Outer Attendant of Scattered Cavalry while keeping his instructorship.',
  ],
  s0492: [
    'By nature he was utmost in filial piety; each day he set himself to recite the Classic of Filial Piety twenty times, taking it as parallel to the Scripture of Guanshiyin.',
    'Deeply filial, he recited the Classic of Filial Piety twenty times daily, as others recite the Guanshiyin scripture.',
  ],
  s0493: [
    'When his mother died he resigned and returned to his home district.',
    'He resigned and went home to mourn his mother.',
  ],
  s0494: [
    'The Prince of Shaoling, Pacifier of the West, admired his learning and welcomed him with generous rites.',
    'Prince of Shaoling Lun, Pacifier of the West, honored his learning and received him with great ceremony.',
  ],
  s0495: [
    'Once Kan arrived he was seized by heart illness; in the eleventh year of Datong he died at Xiashou, aged fifty-eight.',
    'On arrival he fell ill at heart; he died at Xiashou in Datong year eleven, aged fifty-eight.',
  ],
  s0496: [
    'His "Meaning of the Analects" in ten scrolls, together with his "Meaning of the Record of Rites," were both esteemed in the world, and scholars transmitted them.',
    'His ten-scroll Meaning of the Analects and Meaning of the Record of Rites were both prized and widely transmitted.',
  ],
  s0497: [
    'Commentary section marker in the source text.',
    'Marker denoting the historian\'s commentary section in the source text.',
  ],
  s0498: [
    'Yao Cha, Minister of Personnel of Chen, says: In old times Shusun Tong lectured from horseback, and Huan Rong exerted his strength through famine and chaos;',
    'The historian Yao Cha writes: Shusun Tong once lectured on horseback; Huan Rong labored through famine and chaos;',
  ],
  s0499: [
    'once peace came they themselves attained glory and favor;',
    'when peace came they won glory and favor;',
  ],
  s0500: [
    'as for Cui, Fu, He, and Yan, each in turn had their share.',
    'Cui, Fu, He, and Yan each had their share in turn.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_048_b5.mjs <translation.json>'
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
