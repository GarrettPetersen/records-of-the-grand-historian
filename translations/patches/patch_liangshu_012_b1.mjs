#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 12, Biographies 6',
    'Book of Liang, Volume 12, Biographies 6',
  ],
  s0002: [
    'Liu Tan; younger brother Chen; Xi Chanwen; Wei Rui; clan cousin Ai',
    'Liu Tan; his younger brother Chen; Xi Chanwen; Wei Rui; and clan cousin Ai',
  ],
  s0003: [
    'Liu Tan, styled Wentong, was a native of Jie in Hedong.',
    'Liu Tan, styled Wentong, came from Jie in Hedong.',
  ],
  s0004: [
    'His father Shilong was Minister of Works in Qi.',
    'His father Shilong had been Qi\'s minister of works.',
  ],
  s0005: [
    'At seventeen Tan met Qi\'s Emperor Wu serving as Central Army commander; he was made a retainer, then chief clerk.',
    'At seventeen, with Emperor Wu of Qi as central army commander, Tan became his retainer, then chief clerk.',
  ],
  s0006: [
    'Early in Qi he entered the Masters of Writing as attendant of the Three Ducal Officials, rose through posts to crown prince gentleman companion, and became a friend of the Prince of Badong, Zi Xiang.',
    'Early in Qi he entered the secretariat as three-ducal attendant, rose to crown prince gentleman companion, and befriended the Prince of Badong, Zi Xiang.',
  ],
  s0007: [
    'When Zi Xiang took Jing province, Tan followed him to the post.',
    'When Zi Xiang went to Jing province, Tan followed him there.',
  ],
  s0008: [
    'Zi Xiang doted on petty men; Tan saw disaster coming, feigned illness, and returned to the capital.',
    'Zi Xiang clung to petty men; Tan foresaw ruin, claimed illness, and went back to the capital.',
  ],
  s0009: [
    'When the crisis broke, Tan was spared because he had left early.',
    'When trouble came, Tan escaped because he had returned first.',
  ],
  s0010: [
    'He served as gentleman of the Secretariat and long-term staff officer to the Central Guard.',
    'He was gentleman of the secretariat and long-term staff officer to the central guard.',
  ],
  s0011: [
    'He went out as prefect of Xin\'an; in the commandery he achieved nothing and was dismissed.',
    'He went out as Xin\'an prefect, achieved nothing in office, and was sent home.',
  ],
  s0012: [
    'After a long interval he became advisory staff officer to the Right Army.',
    'Long afterward he became an advisory staff officer of the right army.',
  ],
  s0013: [
    'At the end of Jianwu he was made Colonel of the Western Rong and inspector of Liang and Southern Qin provinces.',
    'At the end of Jianwu he was western rong colonel and inspector of Liang and Southern Qin.',
  ],
  s0014: [
    'When Gaozu raised the army, Tan raised Hanzhong in support of the righteous cause.',
    'When Gaozu rose in arms, Tan raised Hanzhong for the cause.',
  ],
  s0015: [
    'When Emperor He took the throne, Tan was made Attendant Within and given acting charge as Front Army General.',
    'Emperor He made him attendant within and acting front army general.',
  ],
  s0016: [
    'When Gaozu ascended the throne, Tan was summoned as Protector of the Army General; before he accepted he was transferred to Household Head of the Heir Apparent with additional appointment as Scattered Cavalry Attendant.',
    'Gaozu summoned him as protector of the army; before he took the post he became heir apparent household head and scattered cavalry attendant.',
  ],
  s0017: [
    'For his merit he was enfeoffed as Marquis of Qujiang with a fief of one thousand households.',
    'For merit he was made marquis of Qujiang with one thousand households.',
  ],
  s0018: [
    'At a banquet Gaozu composed a poem and gave it to Tan, saying: "You truly crown the feudal lords; only you truly remember my merit.',
    'At a feast Gaozu wrote a poem for Tan: "You alone crown the lords; only you keep my deeds in mind.',
  ],
  s0019: [
    '" On another occasion, while attending him, Gaozu said: "Xu Yuanyu defied orders in Lingnan—the Book of Zhou says crimes do not reach kin. I have already pardoned his sons. What do you think?',
    '" Another time at court Gaozu said, "Xu Yuanyu rebelled in Lingnan. The Book of Zhou says punishment does not chain to kin—I have pardoned his sons. What say you?',
  ],
  s0020: [
    '" Tan replied: "Punishment does not reach heirs; reward extends through generations—today we see it again in the sage court.',
    '" Tan answered, "Punishment stops at the man; reward flows to his line—we see that again in this sage reign.',
  ],
  s0021: [
    '" The age regarded it as perceptive speech.',
    '" Men called it words that knew the times.',
  ],
  s0022: [
    'Soon he was transferred to Right Vice Director of the Masters of Writing.',
    'He was soon made right vice director of the masters of writing.',
  ],
  s0023: [
    'In the fourth year of Tianjian a great northern campaign was launched; the Prince of Linchuan, Hong, commanded the massed armies, with Tan as his deputy.',
    'In Tianjian year four the court launched a great northern campaign; the Prince of Linchuan, Hong, commanded the armies with Tan as deputy.',
  ],
  s0024: [
    'When the army returned, he again became vice director.',
    'When the armies came home he was again vice director.',
  ],
  s0025: [
    'Because of long illness he was transferred to Golden Crown and Purple Light Grandee with additional appointment as Scattered Cavalry Attendant and twenty trusted retainers.',
    'Long illness moved him to golden crown and purple light grandee, scattered cavalry attendant, and twenty trusted retainers.',
  ],
  s0026: [
    'Before he accepted the post he went out as envoy with credentials, Pacify the South General, and inspector of Xiang province.',
    'Before he took office he went out with credentials as pacify-the-south general and Xiangzhou inspector.',
  ],
  s0027: [
    'In the tenth month of the sixth year he died in the province, aged forty-six.',
    'In the tenth month of year six he died in the province at forty-six.',
  ],
  s0028: [
    'Gaozu wore plain robes and raised lament for him.',
    'Gaozu wore undyed robes and mourned him.',
  ],
  s0029: [
    'He was posthumously granted Attendant Within and Pacify the Army General, with one suite of drums and pipes.',
    'Posthumously he was attendant within and pacify-the-army general, with one suite of drums and pipes.',
  ],
  s0030: [
    'Posthumous name: Mu.',
    'Posthumous name Mu.',
  ],
  s0031: [
    'Tan wrote the Record of Benevolent Government and various poems and rhapsodies, all with some literary merit.',
    'Tan wrote Record of Benevolent Government and poems and fu with modest literary force.',
  ],
  s0032: [
    'His son Zhao succeeded him.',
    'His son Zhao inherited the title.',
  ],
  s0033: [
    'Tan\'s fourth younger brother Cheng also enjoyed a fine reputation; he served as Attendant Within and long-term staff officer to Pacify the West.',
    'Tan\'s fourth brother Cheng was also praised; he was attendant within and pacify-the-west long-term staff officer.',
  ],
  s0034: [
    'In the twelfth year of Tianjian he died; posthumously he was granted Pacify the Distant General and inspector of Yu province.',
    'In Tianjian year twelve he died and was posthumously pacify-the-distant general and Yuzhou inspector.',
  ],
  s0035: [
    'Chen, styled Wenruo, was Tan\'s fifth younger brother.',
    'Chen, styled Wenruo, was Tan\'s fifth brother.',
  ],
  s0036: [
    'When he was only a few years old, his father Shilong and his mother, Lady Yan, lay ill; Chen went without loosening his belt for a full year.',
    'Still a child, he tended his father Shilong and mother Lady Yan through long illness without undoing his belt for a year.',
  ],
  s0037: [
    'In mourning he was famed for destroying his health.',
    'In mourning his grief was famed for wrecking his body.',
  ],
  s0038: [
    'He first entered office as a retainer on the Minister of Education\'s staff, rose through posts to crown prince gentleman companion, Western Zhonglang chief clerk, and merit-records officer.',
    'He began on the minister of education\'s staff, rose to crown prince gentleman companion, western Zhonglang chief clerk, and merit-records officer.',
  ],
  s0039: [
    'Dong Hun sent Liu Shanyang, prefect of Brazil, from Jing to strike Gaozu; the Western Zhonglang long-term staff officer Xiao Yingzhou had not settled on a plan and summoned Chen and his intimate Xi Chanwen and others to enter by night to discuss it.',
    'Dong Hun sent Brazil prefect Liu Shanyang from Jing against Gaozu; Xiao Yingzhou, western Zhonglang long-term staff officer, had no plan yet and called Chen, Xi Chanwen, and others to a night council.',
  ],
  s0040: [
    'Chen said: "The court is mad and wicked; its evils grow day by day.',
    'Chen said, "The court is deranged and wicked, and its crimes swell daily.',
  ],
  s0041: [
    'Of late I hear that elders in the capital—none do not walk on tiptoe, holding their breath;',
    'Lately I hear that in the capital the old and honored dare not breathe aloud;',
  ],
  s0042: [
    'we are fortunate to be far away and may take a day to rest in safety.',
    'we are lucky to be distant and may steal a day\'s peace.',
  ],
  s0043: [
    'The Yongzhou affair—let us for now rely on it to destroy one another.',
    'As for Yongzhou, for now let it kill them for us.',
  ],
  s0044: [
    'Have you alone not seen Commander Xiao?',
    'Have you not seen Commander Xiao?',
  ],
  s0045: [
    'With a few thousand crack troops he shattered Cui\'s force of a hundred thousand, yet in the end was trapped by a pack of villains, calamity heaped upon calamity.',
    'A few thousand elite troops broke Cui\'s hundred thousand, yet villains trapped him and ruin followed ruin.',
  ],
  s0046: [
    'What is past and not forgotten is the teacher of what follows.',
    'What came before, if remembered, teaches what comes after.',
  ],
  s0047: [
    'If their wicked hearts have already had their way, do you suppose our lord will not be next in chains?',
    'If their evil will is satisfied, do you think our lord will not be chained next?',
  ],
  s0048: [
    'Moreover Yongzhou\'s soldiers are sharp and its grain abundant; Commander Xiao\'s heroic bearing crowns the age—he is surely not someone Liu Shanyang can match;',
    'Yongzhou has sharp troops and full granaries; Commander Xiao\'s heroism tops the age—Liu Shanyang cannot compare;',
  ],
  s0049: [
    'if you defeat Liu Shanyang, Jingzhou will again bear blame for losing discipline.',
    'break Liu Shanyang and Jingzhou again pays for failure in arms.',
  ],
  s0050: [
    'Whether you advance or retreat there is no way—ponder this deeply.',
    'Advance or retreat, there is no road—think hard on this.',
  ],
  s0051: [
    '" Xi Chanwen also urged joining Gaozu in depth.',
    '" Xi Chanwen too pressed hard for alliance with Gaozu.',
  ],
  s0052: [
    'Yingzhou then lured and killed Shanyang and made Chen Pacify the North General.',
    'Yingzhou baited and killed Shanyang and made Chen pacify-the-north general.',
  ],
  s0053: [
    'When Emperor He took the throne, Chen was made Gentleman of the Masters of Writing in the Ministry of Personnel and advanced in rank to Supporting State General and prefect of Nanping.',
    'Emperor He made him personnel gentleman of the masters of writing, then supporting state general and Nanping prefect.',
  ],
  s0054: [
    'Soon he was transferred to Attendant Within and Champion General, retaining the prefecture.',
    'Soon he was attendant within and champion general, still holding the prefecture.',
  ],
  s0055: [
    'He was transferred to Minister of the Masters of Writing but did not accept.',
    'He was offered minister of the masters of writing and declined.',
  ],
  s0056: [
    'When Ying city was pacified, Yingzhou debated moving the capital to Xiakou; Chen again remonstrated firmly, holding that Ba and the Gorges were not yet subdued and one should not lightly abandon the root and shake the people\'s hearts.',
    'When Ying fell, Yingzhou wanted to move the capital to Xiakou; Chen argued again that Ba and the gorges were not yet loyal and the root must not be shaken.',
  ],
  s0057: [
    'Yingzhou did not heed him.',
    'Yingzhou would not listen.',
  ],
  s0058: [
    'Before long Ba-Dong troops reached the gorge mouth and talk of moving the capital ceased.',
    'Soon Ba-Dong troops reached the gorge and the move was dropped.',
  ],
  s0059: [
    'Commentators held that he had seen the moment.',
    'Men said he had read the times.',
  ],
  s0060: [
    'When Gaozu ascended the throne, Chen was made Minister of the Five Armies and given acting charge as Valiant Cavalry General.',
    'Gaozu made him minister of the five armies and acting valiant cavalry general.',
  ],
  s0061: [
    'For merit in founding the righteous cause he was enfeoffed as Baron of Zhouling with a fief of seven hundred households.',
    'For founding merit he was baron of Zhouling with seven hundred households.',
  ],
  s0062: [
    'In the second year of Tianjian he went out as long-term staff officer to Pacify the West, Champion General, and prefect of Nan commandery.',
    'In Tianjian year two he was pacify-the-west long-term staff officer, champion general, and Nan commandery prefect.',
  ],
  s0063: [
    'In the sixth year he was summoned as Extraordinary Attendant of Scattered Cavalry and Right Commandant of the Heir Apparent\'s Guard.',
    'In year six he was summoned as extraordinary scattered-cavalry attendant and heir apparent right guard commandant.',
  ],
  s0064: [
    'Before he set out he was transferred to envoy with credentials, supervisor of military affairs in Xiang province, Supporting State General, and inspector of Xiang province.',
    'Before he left he became credentialed envoy, Xiang military supervisor, supporting state general, and Xiangzhou inspector.',
  ],
  s0065: [
    'In the eighth year he was dismissed for releasing conscript soldiers on his own authority.',
    'In year eight he was removed for freeing conscripts without leave.',
  ],
  s0066: [
    'Soon he entered the court as Director of the Secretariat, was transferred to Scattered Cavalry Attendant, then Minister of Sacrifices—but before he accepted he fell ill; an edict changed his appointment to Supervisor of the Palace and Grandee of Splendid Light; his illness was severe and he did not accept.',
    'Soon he was secretariat director, then scattered-cavalry attendant, then minister of sacrifices; illness came before he took office and an edict made him palace supervisor and splendid-light grandee, but he was too ill to accept.',
  ],
  s0067: [
    'In the tenth year he died at home, aged forty-one.',
    'In year ten he died at home at forty-one.',
  ],
  s0068: [
    'Posthumously he was granted Director of the Secretariat; posthumous name: Mu.',
    'Posthumously he was director of the secretariat; posthumous name Mu.',
  ],
  s0069: [
    'His son Fan succeeded him.',
    'His son Fan inherited the line.',
  ],
  s0070: [
    'Xi Chanwen was a native of Linjing in Anding.',
    'Xi Chanwen came from Linjing in Anding.',
  ],
  s0071: [
    'Orphaned young and poor, he ranged widely through books and histories.',
    'Orphaned and poor in youth, he read widely in books and histories.',
  ],
  s0072: [
    'Early in Qi he was a central army retainer to Xiao Chifu, inspector of Yong province, and through this became close to Chifu\'s son Yingzhou.',
    'Early in Qi he was central army retainer to Yongzhou inspector Xiao Chifu and grew close to his son Yingzhou.',
  ],
  s0073: [
    'He later served as central army retainer in the Western Zhonglang headquarters and held charge of the city bureau.',
    'He later was western Zhonglang central army retainer and held the city bureau.',
  ],
  s0074: [
    'When Gaozu was about to raise the righteous army, Chanwen urged him deeply; Yingzhou agreed and sent Tian Zugong in secret to report to Gaozu, also presenting a silver-mounted knife—Gaozu replied with a gold ruyi scepter.',
    'As Gaozu prepared to rise, Chanwen urged him hard; Yingzhou agreed and sent Tian Zugong secretly to Gaozu with a silver-mounted knife—Gaozu answered with a gold ruyi.',
  ],
  s0075: [
    'When Emperor He assumed the exalted title, Chanwen was made Attendant of the Yellow Gates in the Secretariat and soon transferred to Commandant of the Court.',
    'When Emperor He took the throne Chanwen was yellow-gates attendant, then court commandant.',
  ],
  s0076: [
    'When Yingzhou died suddenly, the province and prefecture were in turmoil; Chanwen held that Emperor He was young and weak while the midstream bore heavy responsibility—at the time the Prince of Shixing, Dan, was left to guard Yong, and Chanwen joined the western court ministers in welcoming the prince to take overall charge of the province, and through this order was restored.',
    'Yingzhou died suddenly and the province shook; Chanwen said the emperor was young and the midstream heavy—Prince of Shixing Dan held Yong, and Chanwen with western ministers brought him to head the province and calm the land.',
  ],
  s0077: [
    'When Gaozu received the abdication, Chanwen was made Minister of Punishments and Supporting State General.',
    'When Gaozu took the throne Chanwen was minister of punishments and supporting state general.',
  ],
  s0078: [
    'He was enfeoffed as Baron of Shanyang with a fief of seven hundred households.',
    'He was baron of Shanyang with seven hundred households.',
  ],
  s0079: [
    'He went out as prefect of Dongyang and was later re-enfeoffed as Baron of Xiangxi, his household fief unchanged.',
    'He went out as Dongyang prefect, then was re-enfeoffed as baron of Xiangxi with the same fief.',
  ],
  s0080: [
    'In two years of office he was famed for integrity and died in his post.',
    'In two years in office his integrity was famed; he died there.',
  ],
  s0081: [
    'An edict granted thirty thousand cash and fifty bolts of cloth for his funeral.',
    'An edict granted thirty thousand cash and fifty bolts of cloth.',
  ],
  s0082: [
    'Posthumous name: Wei.',
    'Posthumous name Wei.',
  ],
  s0083: [
    'Wei Rui, styled Huaiwen, was a native of Duling in Jingzhao.',
    'Wei Rui, styled Huaiwen, came from Duling in Jingzhao.',
  ],
  s0084: [
    'From Chancellor Xian of Han onward, for generations his clan was a leading surname of the Three Metropolises.',
    'Since Han chancellor Xian, for generations the clan was a great house of the three metropolises.',
  ],
  s0085: [
    'His grandfather Xuan, to avoid summons as an official, hid on the southern slopes of Chang\'an.',
    'His grandfather Xuan hid on Chang\'an\'s southern hills to avoid office.',
  ],
  s0086: [
    'When Emperor Wu of Song entered the passes, he was summoned as aide to the Grand Commandant but did not come.',
    'Song\'s Emperor Wu entering the passes summoned him as grand commandant aide; he did not go.',
  ],
  s0087: [
    'His father\'s elder brother Zuzheng, at the end of Song, was Director of the Imperial Clan.',
    'His uncle Zuzheng, late in Song, was director of the imperial clan.',
  ],
  s0088: [
    'His father Zugui was long-term staff officer to Pacify the Distant.',
    'His father Zugui was pacify-the-distant long-term staff officer.',
  ],
  s0089: [
    'Rui served his stepmother with a fame for filial piety.',
    'Rui was famed for filial service to his stepmother.',
  ],
  s0090: [
    'Rui\'s elder brothers Zuan and Chan were both known early.',
    'His elder brothers Zuan and Chan were known early as well.',
  ],
  s0091: [
    'Zuan and Rui both loved learning; Chan had pure conduct.',
    'Zuan and Rui loved study; Chan had clear integrity.',
  ],
  s0092: [
    'Zuzheng repeatedly served as prefect and always took Rui to his post, treating him as a son.',
    'Zuzheng held many prefectures and always took Rui along, treating him like a son.',
  ],
  s0093: [
    'At the time Rui\'s brother-in-law Wang Cheng and cousin Du Heng both enjoyed great local fame.',
    'Then his brother-in-law Wang Cheng and cousin Du Heng were famed in the district.',
  ],
  s0094: [
    'Zuzheng said to Rui: "How do you rate yourself beside Cheng and Heng?"',
    'Zuzheng asked Rui, "How do you think you compare to Cheng and Heng?"',
  ],
  s0095: [
    'Rui modestly did not answer.',
    'Rui modestly would not answer.',
  ],
  s0096: [
    'Zuzheng said: "Your literary writing may be somewhat less, but your learning should surpass theirs;',
    'Zuzheng said, "Your writing may fall a little short, but your learning should exceed theirs;',
  ],
  s0097: [
    'yet in managing the state and accomplishing great works, none of them can match you."',
    'yet in serving the state and winning great deeds, none can match you."',
  ],
  s0098: [
    'His cousin Du Youwen was inspector of Liang province and asked Rui to go with him.',
    'Cousin Du Youwen was Liangzhou inspector and asked Rui to accompany him.',
  ],
  s0099: [
    'Liang territory was rich; those who went there often fell to bribery;',
    'Liang was rich; many who went there were ruined by bribes;',
  ],
  s0100: [
    'though Rui was still young, he alone was famed for integrity.',
    'yet Rui, though young, alone was famed for integrity.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_012_b1.mjs <translation.json>'
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
