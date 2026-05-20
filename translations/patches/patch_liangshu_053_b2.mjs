#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'In the commandery he urged his will toward purity and whiteness, accepted no gifts or presents, Emperor Ming heard and greatly praised him, and issued an edict commending him.',
    'In office he kept to pure conduct and refused gifts; Emperor Ming heard of it, greatly approved, and issued an edict of praise.',
  ],
  s0102: [
    'He was summoned to serve as General Who Attacks with Cavalry.',
    'He was summoned as General Who Attacks with Cavalry.',
  ],
  s0103: [
    'The commandery sent more than two hundred thousand cash from old acquaintances, and Shuzeng accepted none of it.',
    'The commandery sent over two hundred thousand cash from old associates; Shuzeng refused it all.',
  ],
  s0104: [
    'When he first went to the commandery, he did not bring his family;',
    'When he first took office, he came without his family;',
  ],
  s0105: [
    'when he returned, no clerk bore burdens.',
    'when he returned, no clerk carried a load.',
  ],
  s0106: [
    'Young and old among the people all came out to bow and bid farewell, and their wailing could be heard for dozens of li.',
    'Young and old came out to bow farewell; their wailing was heard for dozens of li.',
  ],
  s0107: [
    'At the time of Dong Hun, he was appointed Grand Master of Palace Leisure and returned to his home village.',
    'Under Dong Hun he became Grand Master of Palace Leisure and returned home.',
  ],
  s0108: [
    'When Gaozu ascended the throne, he then took a light boat to go to the palace gate, yet declined and returned east.',
    'When Gaozu took the throne, he came by light boat to court, then declined and returned east.',
  ],
  s0109: [
    'Gaozu\'s edict said: "Grand Master of Palace Leisure Fan Shuzeng—in Qi times was loyal and upright in serving his lord; when he went to govern Yongjia he governed his person with frugality and restraint. He should receive increased rank and salary to encourage pure conduct.',
    'Gaozu\'s edict said: "Grand Master of Palace Leisure Fan Shuzeng served his lord loyally in Qi; governing Yongjia he lived in frugal integrity. Increase his rank and salary to encourage pure conduct.',
  ],
  s0110: [
    'Let him be Grand Master of Palace Leisure with Regular Attendance, and award twenty bolts of silk."',
    'Appoint him Grand Master of Palace Leisure with Regular Attendance and award twenty bolts of silk."',
  ],
  s0111: [
    'Throughout his life Shuzeng received salary and always divided it to bestow upon others.',
    'Shuzeng\'s salary he always divided and gave away.',
  ],
  s0112: [
    'When old, he stood like a wall with nothing to rely on.',
    'In old age he had nothing to his name.',
  ],
  s0113: [
    'In the eighth year of Tianjian he died, aged seventy-nine.',
    'In the eighth year of Tianjian he died, aged seventy-nine.',
  ],
  s0114: [
    'He annotated the Changes "Words on Language" and authored several tens of chapters of miscellaneous poetry and fu.',
    'He annotated the Changes "Words on Language" and wrote several tens of chapters of miscellaneous poetry and fu.',
  ],
  s0115: ['Qiu Zhongfu', 'Qiu Zhongfu'],
  s0116: [
    'Qiu Zhongfu, courtesy name Gongxin, was a man of Wucheng in Wuxing.',
    'Qiu Zhongfu, styled Gongxin, came from Wucheng in Wuxing.',
  ],
  s0117: [
    'As a youth he loved learning; his father\'s cousin Lingju had a discerning eye for men and often called him a colt of a thousand li.',
    'As a youth he loved learning; his cousin Lingju had a discerning eye for men and often called him a colt of a thousand li.',
  ],
  s0118: [
    'At the beginning of Yongming in Qi, he was selected as a National University student, achieved highest rank, but before appointment returned to his home village.',
    'At the start of Yongming in Qi he was selected as a National University student, ranked highest, but before appointment returned home.',
  ],
  s0119: [
    'His family was poor and could not support themselves, so he joined a band of robbers, planning for them and raiding the Three Wu regions.',
    'His family was poor and could not support themselves, so he joined a band of robbers, planned their raids, and plundered the Three Wu.',
  ],
  s0120: [
    'Zhongfu was clever and resourceful; the band feared and obeyed him, and their actions all succeeded, so they were never exposed.',
    'Clever and resourceful, Zhongfu made the band fear and obey him; their raids always succeeded and they were never caught.',
  ],
  s0121: [
    'Prefect Xu Si summoned him to fill the post of chief clerk; he served as Yangzhou staff officer, National University erudite, and magistrate of Yuhu, gaining a reputation for competence.',
    'Prefect Xu Si made him chief clerk; he served as Yangzhou staff officer, National University erudite, and magistrate of Yuhu, gaining a reputation for competence.',
  ],
  s0122: [
    'Prefect Lü Wenxian was a favored minister of the time and insulted subordinate counties; only Zhongfu would not yield to him.',
    'Prefect Lü Wenxian, a court favorite, bullied subordinate counties; only Zhongfu would not yield.',
  ],
  s0123: [
    'He left office on account of his father\'s death.',
    'He left office on his father\'s death.',
  ],
  s0124: [
    'When Emperor Ming took the throne, he was recalled as General of Fierce Martiality and magistrate of Qu\'a.',
    'When Emperor Ming took the throne, he was recalled as General of Fierce Martiality and magistrate of Qu\'a.',
  ],
  s0125: [
    'It happened that the Administrator of Kuaiji, Wang Jingze, raised troops in rebellion; taking advantage of the court\'s unpreparedness, word of the revolt had just arrived when the vanguard already reached Qu\'a.',
    'Kuaiji Administrator Wang Jingze raised troops in rebellion; catching the court unprepared, word had just arrived when the vanguard already reached Qu\'a.',
  ],
  s0126: [
    'Zhongfu told clerks and people: "Though the rebels are sharp riding victory, a mob easily gathered will easily scatter.',
    'Zhongfu told clerks and people: "Though the rebels are sharp on victory, a mob easily gathered will easily scatter.',
  ],
  s0127: [
    'If we now gather boats and ships, cut the Changgang dam, release the sluice waters to block their path, and can hold for several days, the metropolitan army will surely arrive—then the great affair will succeed."',
    'Gather boats, cut the Changgang dam, release the sluice waters to block their path, and hold for several days—the metropolitan army will arrive and the great affair will succeed."',
  ],
  s0128: [
    'When Jingze\'s army arrived, the sluice had run dry and he indeed halted his troops and could not advance, and so was defeated and scattered.',
    'When Jingze\'s army arrived, the sluice had run dry; he halted and could not advance, and was defeated and scattered.',
  ],
  s0129: [
    'Zhongfu for meritorious defense was transferred to magistrate of Shanyin; in office he had great renown, and the people made a song: "Two Fus, Shen, and Liu—none equals one Qiu."',
    'For meritorious defense Zhongfu was transferred to magistrate of Shanyin; in office he won great renown, and the people sang: "Two Fus, Shen, and Liu—none equals one Qiu."',
  ],
  s0130: [
    'In earlier generations Fu Yan and his son, Shen Xian, and Liu Xuanming had successively governed Shanyin, all with political achievements—the saying meant Zhongfu surpassed them all.',
    'Earlier Fu Yan and his son, Shen Xian, and Liu Xuanming had successively governed Shanyin with distinction—the saying meant Zhongfu surpassed them all.',
  ],
  s0131: [
    'At the end of Qi, government was chaotic and there was much bribery; reported by the authorities and about to be arrested, Zhongfu secretly fled, went straight back to the capital to present himself at court, and met an amnesty—thus escaped punishment.',
    'At the end of Qi, government was chaotic and bribery rife; reported and about to be arrested, Zhongfu secretly fled to the capital and presented himself at court; an amnesty spared him.',
  ],
  s0132: [
    'When Gaozu ascended the throne, he again became magistrate of Shanyin.',
    'When Gaozu took the throne, he again became magistrate of Shanyin.',
  ],
  s0133: [
    'Zhongfu excelled at cutting through tangles and was adept at adapting to circumstances; clerks and people respected and obeyed him, called him divine in governance, and his administration was ranked first under Heaven.',
    'Zhongfu excelled at cutting through red tape and adapting to circumstances; clerks and people revered him, called him divine, and his administration ranked first under Heaven.',
  ],
  s0134: [
    'He was exceptionally promoted to Chief Clerk of the Chariots and Cavalry and Internal Administrator of Changsha; before his term ended he was summoned as Right Director of the Masters of Writing, transferred to Left Director, then promoted to Minister of the Guard—all with great favor and trust.',
    'He was exceptionally promoted to Chief Clerk of the Chariots and Cavalry and internal administrator of Changsha; before his term ended he became Right Director of the Masters of Writing, then Left Director, then Minister of the Guard—with great favor.',
  ],
  s0135: [
    'When the Twin Gate-towers were first built, Zhongfu was put in charge as Master of Crafts.',
    'When the Twin Gate-towers were first built, Zhongfu served as Master of Crafts.',
  ],
  s0136: [
    'When the work was done, he went out as Chief Clerk of the Pacifying West and Administrator of Nan commandery.',
    'When the work was done, he went out as Chief Clerk of the Pacifying West and administrator of Nan.',
  ],
  s0137: [
    'He was transferred to Chief Clerk of the Cloudy Banner and Administrator of Jiangxia, acting on Yingzhou prefectural affairs; he encountered mourning for his mother but was recalled to hold office provisionally.',
    'Transferred to Chief Clerk of the Cloudy Banner and administrator of Jiangxia, acting on Yingzhou affairs; he mourned his mother but was recalled to hold office.',
  ],
  s0138: [
    'For an offense he was dismissed from the register; later he was recalled as staff officer to the Minister of Works.',
    'For an offense he was dismissed; later recalled as staff officer to the Minister of Works.',
  ],
  s0139: [
    'Shortly afterward he was transferred to Internal Administrator of Yuzhang; in the commandery he further urged pure integrity.',
    'Shortly afterward he became internal administrator of Yuzhang and further urged pure integrity in office.',
  ],
  s0140: [
    'Before long he died, aged forty-eight.',
    'Before long he died, aged forty-eight.',
  ],
  s0141: [
    'An edict said: "Internal Administrator Qiu Zhongfu of Yuzhang was tried again in a great commandery and charged with later results—not merely regret that is gone, but in truth his political achievements were fully attained.',
    'An edict said: "Internal Administrator Qiu Zhongfu of Yuzhang was tried in a great commandery and charged with later results—not merely regret at his loss, but his achievements were fully attained.',
  ],
  s0142: [
    'His untimely death is truly heart-wrenching.',
    'His untimely death is truly heart-wrenching.',
  ],
  s0143: [
    'Let him posthumously receive Attendant of Affairs and Gentleman Attendant at the Yellow Gate."',
    'Posthumously award him Attendant of Affairs and Gentleman Attendant at the Yellow Gate."',
  ],
  s0144: [
    'As Zhongfu\'s coffin was about to return, old and young of Yuzhang wailed and clung to see him off—the carriage wheels could not move forward.',
    'As Zhongfu\'s coffin was about to return, old and young of Yuzhang wailed and clung to see him off—the wheels could not turn.',
  ],
  s0145: [
    'When Zhongfu was Left Director, he compiled twenty chapters of the Imperial Canon and one hundred chapters of Southern Palace Precedents, and also compiled Miscellaneous Rituals of the Masters of Writing with Complete Particulars, circulated in the world.',
    'As Left Director, Zhongfu compiled twenty chapters of the Imperial Canon and one hundred of Southern Palace Precedents, plus Miscellaneous Rituals of the Masters of Writing with Complete Particulars—all circulated in the world.',
  ],
  s0146: [
    'Sun Qian, courtesy name Changxun, was a man of Ju in Dongguan.',
    'Sun Qian, styled Changxun, came from Ju in Dongguan.',
  ],
  s0147: [
    'As a youth he was recognized by his kinsman Zhao Bofu.',
    'As a youth he was recognized by his kinsman Zhao Bofu.',
  ],
  s0148: [
    'When Qian was seventeen, Bofu was Inspector of Yuzhou and brought him in as Acting Military Staff Officer of the Left Army, renowned for governing competence.',
    'At seventeen, when Bofu was inspector of Yuzhou, he brought Qian in as acting military staff officer of the Left Army, renowned for governing competence.',
  ],
  s0149: [
    'He left office on his father\'s death, lived as a guest in Liyang, personally tilled fields to support younger siblings, and the village praised his warm harmony.',
    'He left office on his father\'s death, lived in Liyang, tilled fields to support younger siblings, and the village praised his warm harmony.',
  ],
  s0150: [
    'In Song, Prince Jiangxia Wang Yigong heard of it and brought him in as acting staff officer; he served through both the Grand Marshal\'s and Grand Tutor\'s offices.',
    'In Song, Prince Jiangxia Wang Yigong heard of it and brought him in as acting staff officer; he served in both the Grand Marshal\'s and Grand Tutor\'s offices.',
  ],
  s0151: [
    'He went out as magistrate of Gou Rong, pure, cautious, and with strong memory—the county people called him divine.',
    'He went out as magistrate of Gou Rong—pure, cautious, with strong memory—and the county people called him divine.',
  ],
  s0152: [
    'At the beginning of Taishi he served Prince Jian\'an Wang Xiuren; Xiuren made him staff officer to the Minister of Education and spoke of him to Emperor Ming, who promoted him to General of Illustrious Might and Administrator of the two commanderies of Badong and Jianping.',
    'At the start of Taishi he served Prince Jian\'an Wang Xiuren, who made him staff officer to the Minister of Education and recommended him to Emperor Ming, who promoted him to General of Illustrious Might and administrator of Badong and Jianping.',
  ],
  s0153: [
    'The commandery lay in the Three Gorges; constantly they used armed might to control it.',
    'The commandery lay in the Three Gorges and was constantly controlled by armed might.',
  ],
  s0154: [
    'When Qian was about to report to his post, an edict ordered recruiting a thousand men to accompany him.',
    'When Qian was about to take office, an edict ordered a thousand men recruited to accompany him.',
  ],
  s0155: [
    'Qian said: "The barbarians do not submit—surely it is because they are treated without proper measure.',
    'Qian said: "The barbarians do not submit because they are treated without proper measure.',
  ],
  s0156: [
    'Why trouble military service and burden state expense?"',
    'Why trouble military service and burden state expense?"',
  ],
  s0157: [
    'He firmly declined and would not accept.',
    'He firmly declined.',
  ],
  s0158: [
    'Reaching the commandery he spread benevolent transforming influence; the Man and Liao cherished him and competed to offer gold and jewels—Qian comforted and instructed them and sent them away, accepting none.',
    'Reaching the commandery he spread benevolent rule; the Man and Liao cherished him and competed to offer gold and jewels—Qian comforted them and sent them away, accepting none.',
  ],
  s0159: [
    'When captives were taken in raids, he released them all to return home.',
    'Captives taken in raids he released to return home.',
  ],
  s0160: [
    'Salary levies drawn from clerks and people—he remitted them all.',
    'Salary levies drawn from clerks and people he remitted entirely.',
  ],
  s0161: [
    'The commandery realm settled in harmony; prestige and trust greatly flourished.',
    'The commandery settled in harmony; prestige and trust greatly flourished.',
  ],
  s0162: [
    'After three years in office he was summoned back as Military Staff Officer of the Pacification Army Central Regiment.',
    'After three years in office he was summoned back as military staff officer of the Pacification Army Central Regiment.',
  ],
  s0163: [
    'At the beginning of Yuanhui he was transferred to Inspector of Liangzhou, declined and did not take office, and was transferred to Colonel of Rapid Cavalry and chief clerk of the Northern Expedition Grand Marshal\'s office.',
    'At the start of Yuanhui he was transferred to inspector of Liangzhou but declined; he was then made Colonel of Rapid Cavalry and chief clerk of the Northern Expedition Grand Marshal\'s office.',
  ],
  s0164: [
    'Prince Jianping was about to raise troops and feared Qian\'s stern uprightness; he contrived an affair to send him as envoy to the capital, then launched rebellion.',
    'Prince Jianping planned to raise troops and feared Qian\'s stern uprightness; he contrived an affair to send him as envoy to the capital, then rebelled.',
  ],
  s0165: [
    'When Jianping was executed, he was transferred to General of the Left Army.',
    'When Jianping was executed, he was transferred to General of the Left Army.',
  ],
  s0166: [
    'In the sixth year of Tianjian he went out as General Who Assists the State and Administrator of Lingling; though already aged, he still governed with force—clerks and people were at peace.',
    'In the sixth year of Tianjian he went out as General Who Assists the State and administrator of Lingling; though aged, he still governed vigorously—clerks and people were at peace.',
  ],
  s0167: [
    'Before this the commandery had many violent tigers; when Qian arrived they vanished utterly.',
    'Before this the commandery had many violent tigers; when Qian arrived they vanished.',
  ],
  s0168: [
    'On the night he left office, a tiger at once harmed residents.',
    'The night he left office, a tiger at once harmed residents.',
  ],
  s0169: [
    'When Qian served commanderies and counties he always diligently urged farming and sericulture, striving to use all land to advantage—revenue constantly exceeded neighboring regions.',
    'Serving commanderies and counties he always urged farming and sericulture and strove to use all land—revenue constantly exceeded neighboring regions.',
  ],
  s0170: [
    'In the ninth year, because of age, he was summoned as Grand Master of Splendor.',
    'In the ninth year, because of age, he was summoned as Grand Master of Splendor.',
  ],
  s0171: [
    'When he arrived, Gaozu praised his purity and treated him with great special honor.',
    'When he arrived, Gaozu praised his purity and treated him with great honor.',
  ],
  s0172: [
    'At every court audience he still requested heavy duties to prove himself.',
    'At every court audience he still requested heavy duties to prove himself.',
  ],
  s0173: [
    'Gaozu laughed and said: "I employ your wisdom, not your strength."',
    'Gaozu laughed and said: "I employ your wisdom, not your strength."',
  ],
  s0174: [
    'In the fourteenth year, an edict said: "Grand Master of Splendor Sun Qian—pure and cautious with fame, white-haired yet unwearying, old in years and elder in rank—should receive preferential rank.',
    'In the fourteenth year, an edict said: "Grand Master of Splendor Sun Qian—pure and cautious, white-haired yet unwearying, old in years and rank—deserves preferential rank.',
  ],
  s0175: [
    'Let him be granted twenty trusted attendants, together with a walking staff."',
    'Grant him twenty trusted attendants and a walking staff."',
  ],
  s0176: [
    'From youth to old age, Qian served two counties and five commanderies—in every place, incorrupt.',
    'From youth to old age Qian served two counties and five commanderies—incorrupt in every place.',
  ],
  s0177: [
    'His person was frugal and plain: his bed had screens of arrowroot and coarse rush; in winter, cotton quilts and cattail mats; in summer no mosquito curtains—yet sleeping at night he never had mosquitoes or gnats, and many found this strange.',
    'Frugal and plain in person: his bed had arrowroot and coarse-rush screens; in winter cotton quilts and cattail mats; in summer no mosquito curtains—yet he never had mosquitoes or gnats at night, and many found this strange.',
  ],
  s0178: [
    'Past ninety years, strong as a man of fifty—at every court assembly he always arrived at the gate before the crowd.',
    'Past ninety, strong as a man of fifty—at every court assembly he always arrived at the gate before the crowd.',
  ],
  s0179: [
    'He exerted himself in benevolence and righteousness; his personal conduct far exceeded others.',
    'He exerted himself in benevolence and righteousness; his conduct far exceeded others.',
  ],
  s0180: [
    'His older male cousin Lingqing was often ill and lodged with Qian; when Qian went out and returned he would ask after his health.',
    'His cousin Lingqing was often ill and lodged with Qian; when Qian went out and returned he asked after his health.',
  ],
  s0181: [
    'Lingqing said: "Just now I drank something hot and cold out of balance—still thirsty at once."',
    'Lingqing said: "Just now I drank something hot and cold out of balance—I am still thirsty."',
  ],
  s0182: [
    'Qian withdrew and sent his wife.',
    'Qian withdrew and sent his wife.',
  ],
  s0183: [
    'There was a Pengcheng man Liu Rong, a wandering beggar desperately ill with nowhere to go; a friend carried him in a litter to Qian\'s house, and Qian opened the reception hall to await him.',
    'Liu Rong of Pengcheng was a wandering beggar, desperately ill with nowhere to go; a friend carried him to Qian\'s house, and Qian opened the reception hall to await him.',
  ],
  s0184: [
    'When Rong died, he buried him with full rites.',
    'When Rong died, he buried him with full rites.',
  ],
  s0185: [
    'All admired his righteous conduct.',
    'All admired his righteous conduct.',
  ],
  s0186: [
    'In the fifteenth year he died in office, aged ninety-two.',
    'In the fifteenth year he died in office, aged ninety-two.',
  ],
  s0187: [
    'An edict awarded funeral gifts of thirty thousand cash and fifty bolts of cloth.',
    'An edict awarded funeral gifts of thirty thousand cash and fifty bolts of cloth.',
  ],
  s0188: [
    'Gaozu held mourning for him and deeply lamented his loss.',
    'Gaozu held mourning for him and deeply lamented his loss.',
  ],
  s0189: [
    'Qian\'s nephew by the younger male line, Lian, was smooth and clever in office-seeking.',
    'Qian\'s nephew Lian was smooth and clever in office-seeking.',
  ],
  s0190: [
    'In Qi times he had already served large counties and been Right Director of the Masters of Writing.',
    'In Qi he had already served large counties and been Right Director of the Masters of Writing.',
  ],
  s0191: [
    'At the beginning of Tianjian, Shen Yue and Fan Yun held power in court; Lian inclined his will to serve them.',
    'At the start of Tianjian, Shen Yue and Fan Yun held power; Lian inclined himself to serve them.',
  ],
  s0192: [
    'With Palace Secretariat Attendants Huang Muzhi and others he was especially connected and attached.',
    'He was especially connected with Palace Secretariat Attendants Huang Muzhi and others.',
  ],
  s0193: [
    'Whenever the noble and powerful dined, Lian would daily send rich delicacies, all personally fried and seasoned, not shunning toil—thus attaining rank among ministers, Censor-in-Chief, and Administrator of Jinling and Wuxing.',
    'Whenever the noble and powerful dined, Lian daily sent rich delicacies, all personally prepared, not shunning toil—thus attaining ministerial rank, Censor-in-Chief, and administrator of Jinling and Wuxing.',
  ],
  s0194: [
    'At the time Gaoling\'s Gao Shuang had a sharp and shallow talent; lodging with Lian, Lian entrusted him with documents; Shuang once had a request unmet and made a riddle on clogs to mock Lian: "Pierced nose knows not to sneeze, stepped face knows not to rage, gnashing teeth count paces—with this one outdoes men."',
    'Gaoling\'s Gao Shuang had a sharp, shallow talent; lodging with Lian, Lian entrusted him with documents; once denied a request, Shuang made a clog riddle to mock Lian: "Pierced nose knows not to sneeze, stepped face knows not to rage, gnashing teeth count paces—with this one outdoes men."',
  ],
  s0195: [
    'It mocked him for not counting disgrace and thus winning name and rank.',
    'It mocked him for ignoring disgrace to win name and rank.',
  ],
  s0196: [
    'Fu Xuan, courtesy name Xuanyao, was Manrong\'s son.',
    'Fu Xuan, styled Xuanyao, was Manrong\'s son.',
  ],
  s0197: [
    'As a child he inherited his father\'s learning, could discourse on abstruse principles, and was renowned together with Ren Fang of Le\'an and Liu Man of Pengcheng.',
    'As a child he inherited his father\'s learning, could discourse on abstruse principles, and was renowned with Ren Fang of Le\'an and Liu Man of Pengcheng.',
  ],
  s0198: [
    'He began as Qi Court Gentleman for the Dynasty, concurrently National University erudite; soon removed as Assistant Administrator of Dongyang commandery, and at term\'s end became magistrate of Yin.',
    'He began as Qi Court Gentleman for the Dynasty, concurrently National University erudite; soon became assistant administrator of Dongyang, and at term\'s end became magistrate of Yin.',
  ],
  s0199: [
    'At the time Manrong had already retired, so repeatedly he was placed in outer posts so Xuan could support him.',
    'Manrong had already retired, so Xuan was repeatedly placed in outer posts so he could support him.',
  ],
  s0200: [
    'At the end of Qi he first became Director in the Ministry of Justice Section of the Masters of Writing, then Staff Secretary in the Guard Army office.',
    'At the end of Qi he first became Director in the Ministry of Justice Section, then staff secretary in the Guard Army office.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_053_b2.mjs <translation.json>'
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
