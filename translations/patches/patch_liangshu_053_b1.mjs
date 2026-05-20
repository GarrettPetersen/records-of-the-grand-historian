#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'In antiquity Han Emperor Xuan held that "When government is level and lawsuits are settled, is this not the work of good two-thousand-bushel officials!"',
    'In antiquity Han Emperor Xuan said, "When government is level and lawsuits are settled, is this not the work of good two-thousand-bushel officials!"',
  ],
  s0002: [
    '" The earlier histories also say: "Today\'s prefectural administrators are the feudal lords of old.',
    '" the earlier histories also say, "Today\'s prefects are the feudal lords of old.',
  ],
  s0003: [
    '" Therefore the office of chief administrators is called "bringing close to the people"; hence to guide virtue, equalize ritual, shift custom, and change habit—all must pass through them.',
    '" therefore the office of chief administrator is called "bringing close to the people"; guiding virtue, equalizing ritual, shifting custom, and changing habit—all must pass through them.',
  ],
  s0004: [
    'At the end of Qi, amid disorder, government passed to petty men; levies and taxes rose like clouds; corvée labor knew no limits.',
    'At the end of Qi, amid disorder, government passed to petty men; levies piled up like clouds and corvée knew no limit.',
  ],
  s0005: [
    'Prefects and magistrates mostly leaned on powerful cliques, each feeding greed and cruelty, squeezing and hoarding wealth, pressing and anguishing the common folk—the realm trembled, and nowhere could people place hands and feet.',
    'Prefects and magistrates leaned on powerful cliques, fed one another\'s greed and cruelty, squeezed and hoarded, and pressed the common folk until the realm shook and people had nowhere to turn.',
  ],
  s0006: [
    'While Gaozu was still in the fields he knew the people\'s toil and pain; when the Liang platform was established he issued writs of leniency, abolishing every miscellaneous exaction of the dark age—within the four seas people at last could rest their shoulders.',
    'While Gaozu was still in the fields he knew the people\'s suffering; when the Liang regime was established he issued writs of leniency and abolished every miscellaneous levy of the dark age—within the four seas people at last could breathe easier.',
  ],
  s0007: [
    'When he ascended the throne he personally reviewed myriad affairs, hearing governance until sundown, seeking the people\'s sores.',
    'When he took the throne he personally reviewed myriad affairs, hearing governance past sundown and seeking the people\'s wounds.',
  ],
  s0008: [
    'He ordered touring carriages to inspect regional customs, set up the grievance stone to reach the destitute, strove to add hidden succor, and ease their urgent distress.',
    'He sent touring carriages to inspect regional customs, set up the grievance stone so the destitute could be heard, strove to add hidden relief, and ease urgent distress.',
  ],
  s0009: [
    'In the first year he first abolished the household-asset tax, counting males for cloth levies;',
    'In the first year he abolished the household-asset tax and counted males for cloth levies;',
  ],
  s0010: [
    'he himself wore washed clothes; the imperial storehouse had no ornamental trim; the palace women wore no more than figured silk—no pearls, gems, brocade, or embroidery;',
    'he himself wore washed clothes; the imperial storehouse had no ornament; palace women wore no more than figured silk—no pearls, gems, brocade, or embroidery;',
  ],
  s0011: [
    'the Grand Steward withdrew lavish banquets—daily meals were vegetables, wine limited to three cups: taking frugality ahead of all within the seas.',
    'the Grand Steward withdrew lavish banquets—daily meals were vegetables and wine was limited to three cups: taking frugality ahead of all within the seas.',
  ],
  s0012: [
    'Whenever choosing chief administrators he sought simplicity, integrity, and fairness—each was summoned before the throne and personally urged in the way of governance.',
    'Whenever he chose chief administrators he sought simplicity, integrity, and fairness—each was summoned before the throne and personally urged in the way of governance.',
  ],
  s0013: [
    'At first he promoted Attendant in the Secretariat Inner Section Dao Gai to Internal Administrator of Jian\'an, and Left People Section Director Liu Zong to Administrator of Jin\'an—Gai and the others in office all became known for pure integrity.',
    'At first he promoted Attendant in the Secretariat Inner Section Dao Gai to internal administrator of Jian\'an and Left People Section Director Liu Zong to administrator of Jin\'an—Gai and the others in office all became known for pure integrity.',
  ],
  s0014: [
    'He also issued an ordinance: if a small county magistrate showed ability, transfer him to a large county;',
    'He also issued an ordinance: if a small county magistrate showed ability, transfer him to a large county;',
  ],
  s0015: [
    'if a large county magistrate showed ability, promote him to two-thousand-bushel rank.',
    'if a large county magistrate showed ability, promote him to two-thousand-bushel rank.',
  ],
  s0016: [
    'Thus Shanyin Magistrate Qiu Zhongfu, whose governance showed extraordinary merit, was made Internal Administrator of Changsha;',
    'Thus Shanyin Magistrate Qiu Zhongfu, whose governance showed extraordinary merit, was made internal administrator of Changsha;',
  ],
  s0017: [
    'Wukang Magistrate He Yuan, pure and fair, was made Administrator of Xuancheng.',
    'Wukang Magistrate He Yuan, pure and fair, was made administrator of Xuancheng.',
  ],
  s0018: [
    'Those who received tally seals as administrators often took up the wind accordingly.',
    'Those who received tally seals as administrators often followed suit.',
  ],
  s0019: [
    'Such as Yu Bi of Xinye and others who took office—using classical learning to polish administration, some leaving flowing grace in their tenure, some missed after departing—were indeed the good officials of later times.',
    'Such as Yu Bi of Xinye and others who took office—using classical learning to polish administration, some leaving grace in their tenure, some missed after departing—were the good officials of later times.',
  ],
  s0020: [
    'They are collected in this "Biography of Good Officials."',
    'They are collected in this Biography of Good Officials.',
  ],
  s0021: [
    'Yu Bi, styled Xiuye, was a man of Xinye.',
    'Yu Bi, styled Xiuye, came from Xinye.',
  ],
  s0022: [
    'His father Shenzhi was Song Inspector of Yingzhou.',
    'His father Shenzhi was Song inspector of Yingzhou.',
  ],
  s0023: [
    'At ten Bi suffered his father\'s death; in mourning he wasted and withered, praised by the province and district.',
    'At ten Bi lost his father; in mourning he wasted away, praised by the province and district.',
  ],
  s0024: [
    'At his capping he became the province\'s Chief Clerk for Reception, was recommended as Cultivated Talent, and rose through Western Pacification Army Chief Clerk, Attendant in the Secretariat Inner Section, and Merit Officer in the Rapid Cavalry.',
    'At his capping he became the province\'s chief clerk for reception, was recommended as Cultivated Talent, and rose through Western Pacification Army chief clerk, Attendant in the Secretariat Inner Section, and merit officer in the Rapid Cavalry.',
  ],
  s0025: [
    'He ranged broadly through books and had skill in debate.',
    'He ranged broadly through books and had skill in debate.',
  ],
  s0026: [
    'In Qi Yongming, when peace was made with Wei, Bi was additionally made Attendant-in-Ordinary of the Scattered Cavalry on the return mission; on return he was appointed Attendant of the Scattered Cavalry and managed the Eastern Palace record-keeping.',
    'In Qi Yongming, when peace was made with Wei, Bi was additionally made Attendant-in-Ordinary of the Scattered Cavalry on the return mission; on return he was appointed Attendant of the Scattered Cavalry and managed Eastern Palace records.',
  ],
  s0027: [
    'When Prince of Yulin was enthroned and then deposed, he managed Secretariat edicts; he went out as Vice Administrator of Jingzhou.',
    'When Prince of Yulin was enthroned and then deposed, he managed Secretariat edicts; he went out as vice administrator of Jingzhou.',
  ],
  s0028: [
    'Soon he was transferred to Army Adviser of the Western Middle General, again serving as Vice Administrator of the province.',
    'Soon he was transferred to army adviser of the Western Middle General, again serving as vice administrator of the province.',
  ],
  s0029: [
    'His predecessors in managing the province all grew rich.',
    'His predecessors in managing the province all grew rich.',
  ],
  s0030: [
    'Bi twice held the post—purifying himself and leading subordinates, cutting off all entreaties, hemp bedding and vegetable fare; wife and children still knew hunger and cold.',
    'Bi twice held the post—purifying himself and leading subordinates, cutting off all entreaties, with hemp bedding and vegetable fare; wife and children still knew hunger and cold.',
  ],
  s0031: [
    'Mingdi heard and praised him, personally decreeing commendation—the province and district honored him.',
    'Mingdi heard and praised him, personally decreeing commendation—the province and district honored him.',
  ],
  s0032: [
    'Shen Yu, styled Boyu, was a man of Wukang in Wuxing.',
    'Shen Yu, styled Boyu, came from Wukang in Wuxing.',
  ],
  s0033: [
    'His uncle Chang served Song Prince of Jianping Jing Su; when Jing Su plotted rebellion, Chang left him first;',
    'His uncle Chang served Song Prince of Jianping Jing Su; when Jing Su plotted rebellion, Chang left him first;',
  ],
  s0034: [
    'when the plot failed he was imprisoned; Yu went to the capital to plead and secured release—by this he became known.',
    'when the plot failed he was imprisoned; Yu went to the capital to plead and secured release—by this he became known.',
  ],
  s0035: [
    'He began his career as Province Attendant and Bearer of the Court Greeting.',
    'He began his career as province attendant and bearer of the court greeting.',
  ],
  s0036: [
    'Once he called on Qi Right Director in the Secretariat Yin Mi; Mi spoke with him on governance and greatly valued him, saying: "Judging your talent, you should hold this office of mine.',
    'Once he called on Qi Right Director in the Secretariat Yin Mi; Mi spoke with him on governance and greatly valued him, saying, "Judging your talent, you should hold this office of mine.',
  ],
  s0037: [
    '" Minister of Works and Prince of Jingling Zi Liang heard Yu\'s name and brought him in as a staff officer, concurrently leading Yangzhou\'s relay and transport duties.',
    '" Minister of Works and Prince of Jingling Zi Liang heard Yu\'s name and brought him in as a staff officer, concurrently leading Yangzhou relay and transport duties.',
  ],
  s0038: [
    'At the time Jiankang Magistrate Shen Zhengfu relied on power to insult Yu; Yu bound him with law—all feared his strength.',
    'At the time Jiankang Magistrate Shen Zhengfu relied on power to insult Yu; Yu bound him with law—all feared his strength.',
  ],
  s0039: [
    'Zi Liang knew and prized him deeply; even household affairs he entrusted entirely to Yu.',
    'Zi Liang knew and prized him deeply; even household affairs he entrusted entirely to Yu.',
  ],
  s0040: [
    'When Zi Liang died, Yu again served the Inspector, Prince of Shi\'an Yao Guang.',
    'When Zi Liang died, Yu again served the inspector, Prince of Shi\'an Yao Guang.',
  ],
  s0041: [
    'Once sent to register household males for corvée, he was swift and without complaint.',
    'Once sent to register household males for corvée, he was swift and without complaint.',
  ],
  s0042: [
    'Yao Guang said to his fellow envoys: "Why do you not learn from what Shen Yu does?"',
    'Yao Guang said to his fellow envoys, "Why do you not learn from what Shen Yu does?"',
  ],
  s0043: [
    '" He then had Yu solely manage the province\'s prison affairs.',
    '" he then had Yu solely manage the province\'s prison affairs.',
  ],
  s0044: [
    'Hushu County\'s Fangshan dam was steep and high; in winter months travelers public and private found it arduous—Mingdi sent Yu to go and repair it.',
    'Hushu County\'s Fangshan dam was steep and high; in winter travelers public and private found it arduous—Mingdi sent Yu to repair it.',
  ],
  s0045: [
    'Yu opened four sluices and halted travelers until they worked—within three days it was finished.',
    'Yu opened four sluices and halted travelers until they worked—within three days it was finished.',
  ],
  s0046: [
    'A Yangzhou clerical aide traveled privately, falsely claiming to be a provincial envoy, and refused to work—Yu flogged him thirty strokes.',
    'A Yangzhou clerical aide traveled privately, falsely claiming to be a provincial envoy, and refused to work—Yu flogged him thirty strokes.',
  ],
  s0047: [
    'The clerk returned and complained to Yao Guang; Yao Guang said: "Shen Yu would surely not wrongly flog you.',
    'The clerk returned and complained to Yao Guang; Yao Guang said, "Shen Yu would surely not wrongly flog you.',
  ],
  s0048: [
    '" On reinvestigation there was indeed fraud.',
    '" on reinvestigation there was indeed fraud.',
  ],
  s0049: [
    'Mingdi again had Yu build Chishan Pond—the expense was reduced by several hundred thousand from what the Works Bureau estimated, and the Emperor prized him all the more.',
    'Mingdi again had Yu build Chishan Pond—the expense fell several hundred thousand below the Works Bureau estimate, and the Emperor prized him all the more.',
  ],
  s0050: [
    'In the first year of Yongtai he was Magistrate of Jiande; he taught each male to plant fifteen mulberry trees, four persimmon trees, and pear and chestnut trees—female workers half as much—all rejoiced, and shortly groves were formed.',
    'In the first year of Yongtai he was magistrate of Jiande; he taught each male to plant fifteen mulberry trees, four persimmon trees, and pear and chestnut trees—female workers half as much—all rejoiced, and shortly groves were formed.',
  ],
  s0051: [
    'Leaving office he returned to the capital and concurrently served as an officer in the Selection Bureau.',
    'Leaving office he returned to the capital and concurrently served as an officer in the Selection Bureau.',
  ],
  s0052: [
    'Following Chen Bozhi\'s army to Jiangzhou, when the righteous army besieged Yingcheng, Yu persuaded Bozhi to welcome Gaozu.',
    'Following Chen Bozhi\'s army to Jiangzhou, when the righteous army besieged Yingcheng, Yu persuaded Bozhi to welcome Gaozu.',
  ],
  s0053: [
    'Bozhi wept and said: "My sons are in the capital and cannot leave the city—I cannot but love them.',
    'Bozhi wept and said, "My sons are in the capital and cannot leave the city—I cannot but love them.',
  ],
  s0054: [
    '" Yu said: "Not so—the mood is turbulent and all wish to change course; if you do not plan early, when the host disperses it will be hard to reunite.',
    '" Yu said, "Not so—the mood is turbulent and all wish to change course; if you do not plan early, when the host disperses it will be hard to reunite.',
  ],
  s0055: [
    '" Bozhi then raised his host in surrender, and Yu followed in Gaozu\'s army.',
    '" Bozhi then raised his host in surrender, and Yu followed in Gaozu\'s army.',
  ],
  s0056: [
    'Earlier, while Yu was in the Prince of Jingling\'s household, he had long been close to Fan Yun.',
    'Earlier, while Yu was in the Prince of Jingling\'s household, he had long been close to Fan Yun.',
  ],
  s0057: [
    'At the end of Qi he once stayed overnight with Yun and dreamed he sat atop a house beam and pillar, looking up to see characters in the sky reading "Fan\'s residence."',
    'At the end of Qi he once stayed overnight with Yun and dreamed he sat atop a house beam and pillar, looking up to see characters in the sky reading "Fan\'s residence."',
  ],
  s0058: [
    'At this time Yu told this dream to Gaozu.',
    'At this time Yu told this dream to Gaozu.',
  ],
  s0059: [
    'Gaozu said: "If Yun does not die, this dream may be verified.',
    'Gaozu said, "If Yun does not die, this dream may be verified.',
  ],
  s0060: [
    '" When Gaozu took the throne, Yun deeply recommended Yu, promoting him from Magistrate of Jiyang to Concurrent Right Director in the Secretariat.',
    '" when Gaozu took the throne, Yun deeply recommended Yu, promoting him from magistrate of Jiyang to concurrent Right Director in the Secretariat.',
  ],
  s0061: [
    'When the realm was first settled, Chen Bozhi memorialized that Yu hastened transport and supply—the army and state were sustained; Gaozu held him capable.',
    'When the realm was first settled, Chen Bozhi memorialized that Yu hastened transport and supply—the army and state were sustained; Gaozu held him capable.',
  ],
  s0062: [
    'He was transferred to Master of Carriages in the Secretariat, concurrently Right Director as before.',
    'He was transferred to Master of Carriages in the Secretariat, concurrently Right Director as before.',
  ],
  s0063: [
    'Yu recommended his clansmen Shen Senglong and Sengzhao for administrative skill—Gaozu took both in.',
    'Yu recommended his clansmen Shen Senglong and Sengzhao for administrative skill—Gaozu took both in.',
  ],
  s0064: [
    'He left office on mother\'s mourning, then was recalled as General Who Quells Martial Affairs and Magistrate of Yuyao.',
    'He left office on mother\'s mourning, then was recalled as General Who Quells Martial Affairs and magistrate of Yuyao.',
  ],
  s0065: [
    'In the county the great Yu clan numbered over a thousand households—entreaties crowded like a market; successive magistrates could never stop it.',
    'In the county the great Yu clan numbered over a thousand households—entreaties crowded like a market; successive magistrates could never stop it.',
  ],
  s0066: [
    'From Yu\'s arrival, what did not belong to litigation—if any came, he had them all stand below the steps and bound them with law.',
    'From Yu\'s arrival, what did not belong to litigation—if any came, he had them all stand below the steps and bound them with law.',
  ],
  s0067: [
    'South of the county were also several hundred powerful clans; their sons and younger kin ran wild, shielding one another in turn, thickly planting themselves—common folk greatly suffered.',
    'South of the county were also several hundred powerful clans; their sons and younger kin ran wild, shielding one another and thickly planting themselves—common folk greatly suffered.',
  ],
  s0068: [
    'Yu summoned their elders as overseers of the Stone Fort granary, the younger as county runners—all wailed on the roads; from then the mighty hid their tracks.',
    'Yu summoned their elders as overseers of the Stone Fort granary, the younger as county runners—all wailed on the roads; from then the mighty hid their tracks.',
  ],
  s0069: [
    'When Yu first arrived, rich clerks all wore bright clothes and fine dress to distinguish themselves.',
    'When Yu first arrived, rich clerks all wore bright clothes and fine dress to distinguish themselves.',
  ],
  s0070: [
    'Yu angrily said: "You are low county clerks—why do you compare yourselves to the nobly born?"',
    'Yu angrily said, "You are low county clerks—why do you compare yourselves to the nobly born?"',
  ],
  s0071: [
    '" He had them all wear straw sandals and coarse cloth, standing attendance all day—if the feet stumbled he added the rod.',
    '" he had them all wear straw sandals and coarse cloth, standing attendance all day—if the feet stumbled he added the rod.',
  ],
  s0072: [
    'When Yu was still obscure he had once come here selling pottery and was humiliated by a rich man—therefore he took this chance to repay; hence gentlemen and commoners were alarmed and resentful.',
    'When Yu was still obscure he had once come here selling pottery and was humiliated by a rich man—therefore he took this chance to repay; hence gentlemen and commoners were alarmed and resentful.',
  ],
  s0073: [
    'Yet Yu kept himself pure and white, and so could carry out his will.',
    'Yet Yu kept himself pure and white, and so could carry out his will.',
  ],
  s0074: [
    'Later when the royal army marched north, Yu was summoned as General Who Establishes Might, supervising transport; soon he was additionally Commissioner of Waterways.',
    'Later when the royal army marched north, Yu was summoned as General Who Establishes Might, supervising transport; soon he was additionally Commissioner of Waterways.',
  ],
  s0075: [
    'Shortly afterward he was transferred to Minister of the Palace Supplies.',
    'Shortly afterward he was transferred to Minister of the Palace Supplies.',
  ],
  s0076: [
    'He went out as Chief Clerk of the Army of the South and Administrator of Xunyang.',
    'He went out as chief clerk of the Army of the South and administrator of Xunyang.',
  ],
  s0077: [
    'Inspector of Jiangzhou Cao Jingzong was gravely ill—Yu acted for the prefecture and province.',
    'Inspector of Jiangzhou Cao Jingzong was gravely ill—Yu acted for the prefecture and province.',
  ],
  s0078: [
    'When Jingzong died, he became Chief Clerk to Xiao Yingda of Trustworthy Might, administrator as before.',
    'When Jingzong died, he became chief clerk to Xiao Yingda of Trustworthy Might, administrator as before.',
  ],
  s0079: [
    'Yu by nature was stubborn and unyielding—often opposing Yingda; Yingda bore a grudge.',
    'Yu by nature was stubborn and unyielding—often opposing Yingda; Yingda bore a grudge.',
  ],
  s0080: [
    'In the eighth year of Tianjian, when entering to consult on affairs, his words were again fierce—Yingda showed anger: "Did the court employ you as a mere acting officer?"',
    'In the eighth year of Tianjian, when entering to consult on affairs, his words were again fierce—Yingda showed anger, "Did the court employ you as a mere acting officer?"',
  ],
  s0081: [
    '" Yu left and told others: "Only after I die will I stop—I can never lean and turn my face to follow.',
    '" Yu left and told others, "Only after I die will I stop—I can never lean and turn my face to follow.',
  ],
  s0082: [
    '" That same day on the road he was killed by bandits—aged fifty-nine; many believed Yingda had harmed him.',
    '" that same day on the road he was killed by bandits—aged fifty-nine; many believed Yingda had harmed him.',
  ],
  s0083: [
    'His son Xu repeatedly sued; Yingda also soon died—the matter was never fully pursued.',
    'His son Xu repeatedly sued; Yingda also soon died—the matter was never fully pursued.',
  ],
  s0084: [
    'Xu thereafter wore hemp and ate vegetables to the end of his days.',
    'Xu thereafter wore hemp and ate vegetables to the end of his days.',
  ],
  s0085: ['Fan Shuzeng', 'Fan Shuzeng'],
  s0086: [
    'Fan Shuzeng, styled Zixuan, was a man of Qiantang in Wu commandery.',
    'Fan Shuzeng, styled Zixuan, came from Qiantang in Wu commandery.',
  ],
  s0087: [
    'In youth he loved learning; from Yuhang\'s Lü Daohui he received the Five Classics and broadly grasped their clause-and-commentary.',
    'In youth he loved learning; from Yuhang\'s Lü Daohui he received the Five Classics and broadly grasped their clause-and-commentary.',
  ],
  s0088: [
    'Daohui\'s students often numbered a hundred, yet he alone praised Shuzeng: "This boy will surely be teacher to a king.',
    'Daohui\'s students often numbered a hundred, yet he alone praised Shuzeng, "This boy will surely be teacher to a king.',
  ],
  s0089: [
    '" In Qi, when the Filial and Cultured Heir and Prince of Jingling the Cultured and Sagely were young, Emperor Gao brought in Shuzeng as their teacher and friend.',
    '" in Qi, when the Filial and Cultured Heir and Prince of Jingling the Cultured and Sagely were young, Emperor Gao brought in Shuzeng as their teacher and friend.',
  ],
  s0090: [
    'He began his career as Gentleman of the Kingdom of Prince Jinxi of Song.',
    'He began his career as Gentleman of the Kingdom of Prince Jinxi of Song.',
  ],
  s0091: [
    'At the beginning of Qi he reached Commandant of the Kingdom of the Prince of Nankeng, then was transferred to Master of Guests in the Secretariat, Colonel of Footsoldiers of the Heir Apparent, and concurrently Magistrate of Kaiyang.',
    'At the beginning of Qi he reached Commandant of the Kingdom of the Prince of Nankeng, then was transferred to Master of Guests in the Secretariat, Colonel of Footsoldiers of the Heir Apparent, and concurrently magistrate of Kaiyang.',
  ],
  s0092: [
    'Shuzeng as a man was blunt and upright; in the palace he often remonstrated—the Heir Apparent could not fully employ his counsel, yet did not blame him.',
    'Shuzeng as a man was blunt and upright; in the palace he often remonstrated—the Heir Apparent could not fully employ his counsel, yet did not blame him.',
  ],
  s0093: [
    'The Prince of Jingling valued him deeply and called him "Zhou She."',
    'The Prince of Jingling valued him deeply and called him "Zhou She."',
  ],
  s0094: [
    'At the time Left Guard Commandant of the Heir Apparent Shen Yue also compared Shuzeng to Ji An.',
    'At the time Left Guard Commandant of the Heir Apparent Shen Yue also compared Shuzeng to Ji An.',
  ],
  s0095: [
    'Because his parents were old, he begged to return and support them—he was appointed Grand Master with Leisure.',
    'Because his parents were old, he begged to return and support them—he was appointed Grand Master with Leisure.',
  ],
  s0096: [
    'When Mingdi took the throne he was made General Who Patrols and Attacks and went out as Administrator of Yongjia.',
    'When Mingdi took the throne he was made General Who Patrols and Attacks and went out as administrator of Yongjia.',
  ],
  s0097: [
    'In governance he was clear and level, not favoring fierceness—the folk found it convenient.',
    'In governance he was clear and level, not favoring fierceness—the folk found it convenient.',
  ],
  s0098: [
    'Within his jurisdiction Hengyang County had steep mountain valleys where fugitives gathered—successive two-thousand-bushel officials hunted them without cease.',
    'Within his jurisdiction Hengyang County had steep mountain valleys where fugitives gathered—successive two-thousand-bushel officials hunted them without cease.',
  ],
  s0099: [
    'When Shuzeng took office he opened with grace and trust—all violent factions came out carrying infants on their backs; over two hundred households were registered and enrolled.',
    'When Shuzeng took office he opened with grace and trust—all violent factions came out carrying infants on their backs; over two hundred households were registered and enrolled.',
  ],
  s0100: [
    'From then merchants flowed and residents rested in their occupations.',
    'From then merchants flowed and residents rested in their occupations.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_053_b1.mjs <translation.json>'
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
