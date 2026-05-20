#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 18, Biographies 12',
    'Book of Liang, Volume 18, Biographies 12',
  ],
  s0002: [
    'Zhang Huishao; Feng Daogen; Kang Xuan; Chang Yizhi',
    'Zhang Huishao; Feng Daogen; Kang Xuan; Chang Yizhi',
  ],
  s0003: [
    'Zhang Huishao, styled Deji, was a native of Yiyang.',
    'Zhang Huishao, styled Deji, came from Yiyang.',
  ],
  s0004: [
    'From youth he had martial talent.',
    'From youth he showed martial talent.',
  ],
  s0005: [
    'In Qi Mingdi\'s time he was in the direct attendants; later he went out to supplement garrison commandant of Hengsang at Jingling.',
    'Under Qi Mingdi he served in the direct attendants; later he was posted as garrison commandant of Hengsang at Jingling.',
  ],
  s0006: [
    'At the start of Yongyuan his mother died; he returned to bury her in his native place.',
    'At the start of Yongyuan his mother died; he went home to bury her.',
  ],
  s0007: [
    'Hearing the Righteous Army had risen, he galloped to join Gaozu; he was commissioned central army staff officer with additional pacifying-the-north general and army leader.',
    'When he heard the Righteous Army had risen, he rode to Gaozu, who made him central army staff officer with additional pacifying-the-north general and army leader.',
  ],
  s0008: [
    'When the army halted at Hankou, Gaozu had Huishao and army leader Zhu Siyuan patrol the river to cut grain transport to Ying and Lu.',
    'When the army halted at Hankou, Gaozu sent Huishao and army leader Zhu Siyuan to patrol the river and cut grain supply to Ying and Lu.',
  ],
  s0009: [
    'Ying city\'s naval commander Shen Nandang led several dozen light boats to challenge; Huishao defeated him, beheaded Nandang, and seized all his military gear.',
    'Ying\'s naval commander Shen Nandang led dozens of light boats to challenge him; Huishao routed him, killed Nandang, and took all his arms.',
  ],
  s0010: [
    'When the Righteous Army reached Xinlin and Zhuque, Huishao repeatedly had battle merit.',
    'When the Righteous Army reached Xinlin and Zhuque, Huishao won repeated battle honors.',
  ],
  s0011: [
    'When Jiankang was pacified, he was transferred to supporting-the-state general and vanguard army, direct attendants and left fine-arms chief.',
    'When Jiankang fell, he was made supporting-the-state general and vanguard army commander, direct attendants and left fine-arms chief.',
  ],
  s0012: [
    'When Gaozu ascended the throne, he was enfeoffed Marquis of Shiyang with five hundred households.',
    'When Gaozu took the throne, he was enfeoffed marquis of Shiyang with five hundred households.',
  ],
  s0013: [
    'Transferred to tiger-cavalry general, direct attendants and fine-arms chief as before.',
    'He was transferred to tiger-cavalry general; direct attendants and fine-arms chief as before.',
  ],
  s0014: [
    'At the time several hundred surviving Donghun partisans secretly entered the south and north side gates, burned Divine Tiger Gate, and killed Ministry of Guard Zhang Hongce.',
    'Several hundred Donghun holdouts slipped into the south and north side gates, burned Divine Tiger Gate, and killed Ministry of Guard Zhang Hongce.',
  ],
  s0015: [
    'Huishao galloped with his command to fight, beheaded several dozen heads, and the rebels scattered and fled.',
    'Huishao galloped in with his men, took several dozen heads, and the rebels broke and fled.',
  ],
  s0016: [
    'For merit his fief was increased by two hundred households.',
    'For merit his fief grew by two hundred households.',
  ],
  s0017: [
    'Transferred to crown prince right guard leader.',
    'He was transferred to crown prince right guard leader.',
  ],
  s0018: [
    'In Tianjian year four a great northern campaign was launched; Huishao with champion chief of staff Hu Xinsheng and pacifying-the-north general Zhang Baozi attacked Su prefecture, seized city lord Ma Chenglong, and sent him to the capital.',
    'In Tianjian year four the court launched a great northern campaign; Huishao, champion chief of staff Hu Xinsheng, and pacifying-the-north general Zhang Baozi took Su prefecture, seized the city lord Ma Chenglong, and sent him to the capital.',
  ],
  s0019: [
    'He sent subordinate general Lan Huangong to build a city south of the water as a pincer.',
    'He sent his deputy Lan Huangong to build a city south of the river as a pincer.',
  ],
  s0020: [
    'Before long Wei reinforcements arrived in great numbers, defeated and captured Huangong; Huishao could not hold, that night fled back to Huaiyin, and Wei again took Su prefecture.',
    'Soon Wei reinforcements came in force, defeated Huangong and took him; Huishao could not hold the line and fled to Huaiyin that night, and Wei retook Su prefecture.',
  ],
  s0021: [
    'In year six Wei forces attacked Zhongli; an edict ordered left guard general Cao Jingzong to supervise the armies as relief, advancing to hold Shaoyang.',
    'In year six Wei attacked Zhongli; an edict sent left guard general Cao Jingzong to command the relief armies and advance to Shaoyang.',
  ],
  s0022: [
    'Huishao with Feng Daogen, Pei Sui, and others attacked and severed Wei\'s pontoon bridges, fought at close quarters, and the Wei army was utterly routed.',
    'Huishao, Feng Daogen, Pei Sui, and others cut Wei\'s pontoon bridges and fought hand to hand until the Wei army broke completely.',
  ],
  s0023: [
    'For merit his fief was increased by three hundred households; he returned as left tiger-cavalry general.',
    'For merit his fief grew by three hundred households; he returned as left tiger-cavalry general.',
  ],
  s0024: [
    'Soon he went out as bearer of staff, commander of north Yanzhou military affairs, champion general, and north Yanzhou inspector.',
    'Soon he went out bearer of staff, commander of north Yanzhou military affairs, champion general, and north Yanzhou inspector.',
  ],
  s0025: [
    'When Wei\'s Su prefecture and Huaiyang cities surrendered inward, Huishao comforted and received them with merit, was advanced to wise martial general, and his fief increased by two hundred households.',
    'When Wei\'s garrisons at Su prefecture and Huaiyang came over, Huishao won them over with merit, was raised to wise martial general, and gained two hundred more households.',
  ],
  s0026: [
    'He entered as Ministry of Guard director and was transferred to left guard general.',
    'He entered as Ministry of Guard director, then became left guard general.',
  ],
  s0027: [
    'He went out as bearer of staff, commander of Si province military affairs, faithful prestige general, Si inspector, with concurrent Anlu prefect.',
    'He went out bearer of staff, commander of Si military affairs, faithful prestige general and Si inspector, and also held Anlu prefect.',
  ],
  s0028: [
    'In the province he governed harmoniously; officials and people loved him.',
    'In the province he ruled fairly; officials and commoners held him dear.',
  ],
  s0029: [
    'Summoned back as left guard general with additional undisguised cavalier attendant-in-ordinary, a hundred armed guards, guarding within the palace hall.',
    'Recalled as left guard general with additional undisguised cavalier attendant-in-ordinary, a hundred armed guards, and palace duty within the hall.',
  ],
  s0030: [
    'In year eighteen he died, aged sixty-three.',
    'In year eighteen he died at sixty-three.',
  ],
  s0031: [
    'Edict said: "Zhang Huishao\'s will and strategy are broad and sustaining; his ability and use are steadfast and resolute.',
    'An edict said, "Zhang Huishao\'s mind is far-reaching and his hand sure.',
  ],
  s0032: [
    'Sincerely diligent from righteousness\'s start, merit heard through successive appointments.',
    'From the first days of the righteous cause he served faithfully, and merit followed him through every post.',
  ],
  s0033: [
    'Dwelling in the forbidden guard, he gave his heart morning and evening.',
    'In the forbidden guard he gave his heart morning and evening.',
  ],
  s0034: [
    'Suddenly reaching death and ruin, I am pained in the breast.',
    'Sudden death moves me to grief.',
  ],
  s0035: [
    'He should receive posthumous favor to manifest his martial splendor.',
    'Let posthumous honors show his martial worth.',
  ],
  s0036: [
    'Grant Protector General, give one set of martial music, a hundred bolts of cloth, and two hundred jin of wax."',
    'Grant him Protector General, one set of martial music, a hundred bolts of cloth, and two hundred jin of wax."',
  ],
  s0037: [
    'Posthumous title: Zhong.',
    'Posthumous title: Zhong.',
  ],
  s0038: [
    '" His son Cheng inherited.',
    '" His son Cheng inherited.',
  ],
  s0039: [
    'Cheng at first was direct-attendants general; on his father\'s mourning he was recalled as Jinxi prefect, followed Yu inspector Pei Sui on the northern campaign, repeatedly had battle merit, and with Zhan Sengzhi, Hu Shaoshi, and Yu Hong was among the fierce generals of the age.',
    'Cheng began as direct-attendants general; after his father\'s mourning he took up Jinxi prefect and followed Yu inspector Pei Sui north, winning repeated honors alongside Zhan Sengzhi, Hu Shaoshi, and Yu Hong among the age\'s fiercest commanders.',
  ],
  s0040: [
    'Through office he reached Ministry of Guard director and crown prince left guard leader.',
    'He rose to Ministry of Guard director and crown prince left guard leader.',
  ],
  s0041: [
    'He died in office; posthumous title: Min.',
    'He died in office; posthumous title: Min.',
  ],
  s0042: [
    'Feng Daogen, styled Juji, was a native of Zan in Guangping.',
    'Feng Daogen, styled Juji, came from Zan in Guangping.',
  ],
  s0043: [
    'Young, he lost his father; the family was poor; he hired out his labor to support his mother.',
    'He lost his father young; the household was poor, and he hired himself out to feed his mother.',
  ],
  s0044: [
    'When traveling he got sweet and rich food, he dared not eat first, always hurried back to present it to his mother.',
    'On the road he might find rich food, but he never tasted it first—he always hurried home to set it before his mother.',
  ],
  s0045: [
    'At age thirteen he was famed in the village for filial conduct.',
    'At thirteen his filial conduct was known through the village.',
  ],
  s0046: [
    'The commandery summoned him as chief clerk; he declined and did not accept.',
    'The commandery made him chief clerk; he refused.',
  ],
  s0047: [
    'At age sixteen his fellow villager Cai Daoban was Huyang garrison commandant; Daoban attacked Man at Xicheng, in turn was trapped by the Man, and Daogen rescued him.',
    'At sixteen his neighbor Cai Daoban held Huyang garrison; Daoban attacked the Man at Xicheng, was surrounded, and Daogen saved him.',
  ],
  s0048: [
    'Alone on horseback he wheeled through battle; killing and wounding were many; Daoban escaped harm, and thus Daogen became known.',
    'Alone on horseback he fought round and round, killing many; Daoban was spared, and Daogen\'s name spread.',
  ],
  s0049: [
    'Late in Qi Jianwu, Wei ruler Tuoba Hong raided and captured Nan Yang and five other commanderies; Mingdi sent Grand Marshal Chen Xianda with a host to recover them.',
    'Late in Qi Jianwu, Wei\'s Tuoba Hong overran Nan Yang and five commanderies; Mingdi sent Grand Marshal Chen Xianda to win them back.',
  ],
  s0050: [
    'The army entered at Fen and Jun mouth; Daogen with fellow villagers brought oxen and wine to greet the army and said to Xianda: "The Chuo water runs swift—hard to advance, easy to retreat.',
    'The army entered Fen and Jun mouth; Daogen and his neighbors brought oxen and wine to the camp and told Xianda, "The Chuo runs fast—hard to advance, easy to retreat.',
  ],
  s0051: [
    'If Wei holds the pass, then head and tail are both pressed.',
    'If Wei holds the narrows, you are caught at both ends.',
  ],
  s0052: [
    'Better to abandon all boats at Zan city, march by land roads, build camps in succession, and drum forward.',
    'Better leave the boats at Zan, march by land, set camps in line, and advance to the drum.',
  ],
  s0053: [
    'Thus they can be broken at once."',
    'Then you will break them at once."',
  ],
  s0054: [
    'Xianda would not listen; Daogen still followed the army with his private followers.',
    'Xianda would not hear him; Daogen still followed with his own men.',
  ],
  s0055: [
    'When Xianda was defeated, at night the soldiers fled, many not knowing the mountain roads;',
    'When Xianda was beaten, the army fled by night, many lost on the mountain paths;',
  ],
  s0056: [
    'at every dangerous point Daogen halted his horse and pointed the way; the multitude relied on him and were preserved whole.',
    'at every pass Daogen stopped his horse and showed the way, and many owed their lives to him.',
  ],
  s0057: [
    'Soon he was made Fen mouth garrison deputy.',
    'Soon he was made deputy at Fen mouth garrison.',
  ],
  s0058: [
    'In Yongyuan his mother died and he returned home.',
    'In Yongyuan his mother died and he went home.',
  ],
  s0059: [
    'Hearing Gaozu had raised the Righteous Army, he said to intimates: "Metal and war seize mourning ritual—men of old did not avoid it; to raise a name for later ages—is that not filial?',
    'When he heard Gaozu had raised the Righteous Army, he told those close to him, "War suspends mourning—men of old did not shrink from it; to leave a name behind—is that not filial?',
  ],
  s0060: [
    'The time cannot be lost; I shall go."',
    'The moment will not wait; I am going."',
  ],
  s0061: [
    'Leading fellow villagers and younger kinsmen fit for arms, all returned to Gaozu.',
    'He led able men from the village and his kin and went to Gaozu.',
  ],
  s0062: [
    'At the time Cai Daofu was a general in the army; Gaozu had Daogen assist him, both subordinate to Wang Mao.',
    'Cai Daofu was then a general in the host; Gaozu set Daogen under him, both under Wang Mao.',
  ],
  s0063: [
    'Mao attacked Mian, assaulted Ying city, and took Jiahu; Daogen was often vanguard breaking formations.',
    'Mao struck Mian, besieged Ying, and took Jiahu; Daogen was often first through the line.',
  ],
  s0064: [
    'When Daofu died in the army, Gaozu ordered Daogen also to lead his troops.',
    'When Daofu died in camp, Gaozu gave Daogen his men as well.',
  ],
  s0065: [
    'The great army reached Xinlin; following Wang Mao at Zhuque ford he fought a great battle, and beheadings and captures were especially many.',
    'When the host reached Xinlin, he followed Wang Mao at Zhuque ford in a great battle and took heads and prisoners in unusual numbers.',
  ],
  s0066: [
    'When Gaozu took the throne, Daogen was made tiger-cavalry general and enfeoffed Baron of Zengcheng with two hundred households.',
    'When Gaozu took the throne, he made Daogen tiger-cavalry general and baron of Zengcheng with two hundred households.',
  ],
  s0067: [
    'He led Wendé commanders and was transferred to raiding general.',
    'He led Wendé commanders, then became raiding general.',
  ],
  s0068: [
    'That year Jiangzhou inspector Chen Bozhi rebelled; Daogen followed Wang Mao to pacify him.',
    'That year Jiangzhou inspector Chen Bozhi rebelled; Daogen followed Wang Mao and put him down.',
  ],
  s0069: [
    'In Tianjian year two he was made pacifying-the-north general and Nan Liang prefect, leading Fuling city garrison.',
    'In Tianjian year two he was pacifying-the-north general and Nan Liang prefect, holding Fuling garrison.',
  ],
  s0070: [
    'When he first reached Fuling he repaired walls and moats and posted distant scouts as if a great enemy were about to come; the host mostly laughed.',
    'On reaching Fuling he repaired walls and moats and set far scouts as if a great enemy were near; his men mostly laughed.',
  ],
  s0071: [
    'Daogen said: "Timidity guards against courage in battle—that is the saying."',
    'Daogen said, "Guard like a coward, fight like a brave man—that is the saying."',
  ],
  s0072: [
    'Before the walls were finished, Wei generals Dang Fazong and Fu Shuyan led twenty thousand men and suddenly reached the city.',
    'Before the walls were done, Wei generals Dang Fazong and Fu Shuyan came with twenty thousand men and were suddenly at the gates.',
  ],
  s0073: [
    'Daogen\'s trenches and ramparts were not yet solid; there were few men in the city; all turned pale.',
    'Trenches and ramparts were unfinished; the city held few men; faces went white.',
  ],
  s0074: [
    'Daogen ordered the gates opened wide, dressed plainly, climbed the wall, chose two hundred elite men, went out to fight the Wei army, and defeated them.',
    'Daogen had the gates thrown wide, climbed the wall in plain dress, chose two hundred elite, went out, and beat the Wei force.',
  ],
  s0075: [
    'The Wei men saw his bearing at ease and that battle was also unfavorable, so they withdrew.',
    'Seeing his ease and their own ill luck, the Wei men drew off.',
  ],
  s0076: [
    'Then Wei divided troops at Great and Small Xian, Dongsang, and other places, linking cities in stalemate.',
    'Wei then split forces at Great and Small Xian, Dongsang, and elsewhere, chaining towns in a standoff.',
  ],
  s0077: [
    'Wei general Gao Zuzhen ranged three thousand horse among them; Daogen led a hundred horse in a cross strike, broke them, and seized their drums, horns, and military banners.',
    'Wei general Gao Zuzhen moved three thousand horse between them; Daogen led a hundred horsemen in a flanking strike, routed him, and took drums, horns, and standards.',
  ],
  s0078: [
    'Thereupon grain transport was cut off and the armies withdrew.',
    'Grain supply was cut, and the Wei armies pulled back.',
  ],
  s0079: [
    'Daogen was transferred to supporting-the-state general.',
    'Daogen was made supporting-the-state general.',
  ],
  s0080: [
    'Yu inspector Wei Rui besieged Hefei and took it.',
    'Yu inspector Wei Rui besieged Hefei and captured it.',
  ],
  s0081: [
    'Daogen advanced with the armies together; wherever he went he had merit.',
    'Daogen marched with the host and won merit wherever he fought.',
  ],
  s0082: [
    'In year six Wei attacked Zhongli; Gaozu again edicted Rui to rescue; Daogen led three thousand men as Rui\'s vanguard.',
    'In year six Wei attacked Zhongli; Gaozu again ordered Wei Rui to the rescue; Daogen led three thousand as his vanguard.',
  ],
  s0083: [
    'Reaching Xuzhou, he devised a plan to hold Shaoyang islet, build ramparts, and dig moats to press the Wei city.',
    'At Xuzhou he planned to hold Shaoyang islet, raise ramparts, and dig moats against the Wei city.',
  ],
  s0084: [
    'Daogen could run on horseback and pace the ground, calculating horse labor enough to assign work; walls and moats were set up at once.',
    'Daogen could ride hard and pace a site, allotting horse labor so work matched need; walls and moats rose at once.',
  ],
  s0085: [
    'When the Huai rose, Daogen boarded warships, attacked and severed several hundred zhang of Wei pontoon bridges, and the Wei army suffered great defeat.',
    'When the Huai swelled, he took war boats, cut hundreds of zhang of Wei pontoon bridge, and the Wei army was routed.',
  ],
  s0086: [
    'His fief increased by three hundred households and he was advanced to marquis.',
    'His fief grew by three hundred households and he was raised to marquis.',
  ],
  s0087: [
    'On return he was transferred to cloud-cavalry general and leading direct-attendants general; his enfeoffment was changed to Yuning county, households as before.',
    'Recalled, he became cloud-cavalry general and led the direct attendants; his fief moved to Yuning county, households unchanged.',
  ],
  s0088: [
    'He was repeatedly transferred through central staff marshal, right raiding general, martial guard general, and Liyang prefect.',
    'He rose through central staff marshal, right raiding general, martial guard general, and Liyang prefect.',
  ],
  s0089: [
    'In year eight he was transferred to steadfast resolve general, acting credentials, commander of Yu military affairs, Yu inspector, with concurrent Ruyin prefect.',
    'In year eight he was steadfast resolve general with acting credentials, commander of Yu military affairs, Yu inspector, and also Ruyin prefect.',
  ],
  s0090: [
    'His governance was pure and simple; within the borders was peaceful.',
    'He ruled plainly and kept the borders quiet.',
  ],
  s0091: [
    'In year eleven he was summoned as crown prince right guard leader.',
    'In year eleven he was recalled as crown prince right guard leader.',
  ],
  s0092: [
    'In year thirteen he went out as faithful martial general, proclaiming-grace staff officer, and prefect of Xin and Yongning commanderies.',
    'In year thirteen he went out faithful martial general, proclaiming-grace staff officer, and prefect of Xin and Yongning.',
  ],
  s0093: [
    'In year fourteen he was summoned as outer cavalier attendant-in-ordinary and right raiding general, leading crimson-robed direct attendants.',
    'In year fourteen he was recalled as outer cavalier attendant-in-ordinary and right raiding general, leading the crimson-robed direct attendants.',
  ],
  s0094: [
    'In year fifteen he was made right guard general.',
    'In year fifteen he was made right guard general.',
  ],
  s0095: [
    'Daogen\'s nature was careful and thick, wooden and reticent with few words; as a general he could restrain his squads; wherever he passed village lanes his soldiers dared not plunder.',
    'Daogen was careful and plain, slow of speech; as a commander he held his men tight, and on village roads they dared not loot.',
  ],
  s0096: [
    'In every campaign he never spoke of merit; when generals clamored and competed for credit, Daogen was silent—that was all.',
    'He never spoke of merit on campaign; while other generals shouted over credit, Daogen stayed mute.',
  ],
  s0097: [
    'His squads sometimes resented and blamed him; Daogen explained: "The bright lord himself discerns how much merit there is—what affair is it of mine?"',
    'Some in his command grumbled; Daogen told them, "The bright lord sees merit for himself—what is there for me to say?"',
  ],
  s0098: [
    'Gaozu once pointed at Daogen to show Director of the Court for Public Works Shen Yue: "This man\'s mouth does not discuss merit."',
    'Gaozu once pointed Daogen out to Director Shen Yue and said, "This one never speaks of merit."',
  ],
  s0099: [
    'Yue said: "This is Your Majesty\'s great-tree general."',
    'Yue said, "This is Your Majesty\'s great-tree general."',
  ],
  s0100: [
    'Dwelling in provinces and commanderies, he governed harmoniously and quietly and was cherished by those below.',
    'In province and commandery he ruled fairly and quietly, and those under him held him close.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_018_b1.mjs <translation.json>'
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
