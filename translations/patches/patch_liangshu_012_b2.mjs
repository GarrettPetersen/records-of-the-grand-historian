#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'In the first year of Yongguang of Song, Yuan Yan was Inspector of Yongzhou; he saw Rui and was struck with wonder, and took him as chief clerk.',
    'In Song\'s first Yongguang year Yuan Yan held Yongzhou; he saw Rui, marveled, and made him chief clerk.',
  ],
  s0102: [
    'When Yan reached his province he joined Deng Wan in raising troops; Rui asked to go out as Administrator of Yicheng and so escaped the ruin that overtook Yan.',
    'Yan reached his post and rose with Deng Wan; Rui secured an exit as administrator of Yicheng and missed Yan\'s downfall.',
  ],
  s0103: [
    'Later he was Regular Attendant to the Prince of Jinping, then a staff officer on the Prince of Guiyang\'s suite under the Minister of Works; he followed Qi Minister of Works Liu Shilong in holding Yingcheng against Jingzhou Inspector Shen Youzhi.',
    'He became regular attendant to the Prince of Jinping, then staff officer to the Prince of Guiyang under the Minister of Works, and followed Liu Shilong in the defense of Yingcheng against Shen Youzhi.',
  ],
  s0104: [
    'When Youzhi was pacified, he was promoted to Army Aide of the Van.',
    'After Youzhi\'s defeat he was made army aide of the van.',
  ],
  s0105: [
    'After some time he was made magistrate of Guangde.',
    'In time he became magistrate of Guangde.',
  ],
  s0106: [
    'He rose repeatedly to Administrator of Qixing, provincial aide of his native prefecture, Colonel of the Long River, and General of the Right.',
    'He advanced through administrator of Qixing, provincial aide, colonel of the Long River, and general of the right.',
  ],
  s0107: [
    'At the end of Qi turmoil was everywhere; unwilling to leave his home country, he asked to be Administrator of Shangyong, with the additional rank General Who Establishes Might.',
    'Qi\'s last days were full of upheaval; he did not wish to leave his native hills and asked for Shangyong, with the added title general who establishes might.',
  ],
  s0108: [
    'Before long Grand Marshal Chen Xianda and Protector of the Army Cui Huijing pressed the capital again and again; the people\'s hearts were frantic and nothing was settled, and the men of the western lands looked to Rui for counsel.',
    'Soon Chen Xianda and Cui Huijing harried the capital repeatedly; fear ran wild and the west turned to Rui for a plan.',
  ],
  s0109: [
    'Rui said, "Chen is an old commander, but no man of the age;',
    'Rui said, "Chen is a veteran, yet not a man born for the times;',
  ],
  s0110: [
    'Cui has seen much, but he is timid and no warrior.',
    'Cui has weathered many storms, yet he is soft and no soldier.',
  ],
  s0111: [
    'That their clans should be wiped to the last man is only fitting!',
    'They deserve the extinction of their houses—of course they do!',
  ],
  s0112: [
    'The true lord of the realm will likely rise from our province.',
    'The man Heaven favors will probably rise from our province.',
  ],
  s0113: [
    '" He then sent his two sons to attach themselves to Gaozu.',
    'With that he sent his two sons to bind themselves to Gaozu.',
  ],
  s0114: [
    'When the righteous army\'s manifesto arrived, Rui led the people of his command to cut bamboo for rafts, came by forced marches, and brought two thousand men and two hundred horses.',
    'The call to arms came; Rui had his district cut bamboo rafts, marched night and day, and arrived with two thousand foot and two hundred horse.',
  ],
  s0115: [
    'Gaozu was greatly pleased when he saw Rui and struck the table, saying, "Another day I would have seen your face; today I see your heart—my cause is assured.',
    'Gaozu rejoiced at the sight of him and smote the table: "I might have met your face another day; today I meet your heart—my work is done.',
  ],
  s0116: [
    '" The righteous army took Ying and Lu, pacified Jiahu Lake, and Rui offered many plans, all of which were adopted.',
    'The righteous army took Ying and Lu and pacified Jiahu; Rui\'s counsel was offered at every turn and taken.',
  ],
  s0117: [
    'When the great army set out from Ying, they debated who should stay to guard it; Gaozu found no man equal to the task.',
    'The host marched from Ying and debated a garrison commander; Gaozu could find no fit man.',
  ],
  s0118: [
    'After a long while he turned to Rui and said, "To leave a thoroughbred unmounted and go running about for another—what folly is that?',
    'At length he looked at Rui and said, "To abandon a stallion and go begging for another mount—what sort of hurry is that?',
  ],
  s0119: [
    '" That same day he was made General of the Champions, Administrator of Jiangxia, and acting governor of the Ying prefecture.',
    'That day he was made general of the champions, administrator of Jiangxia, and acting head of the Ying prefecture.',
  ],
  s0120: [
    'Earlier, when Ying city had held out under siege, the population within the walls had neared a hundred thousand; the gates were shut for a year, and of plague and sickness seven or eight in ten died—corpses were heaped under the beds while the living slept above them, and every house was packed full.',
    'When Ying had been besieged, nearly a hundred thousand people were trapped inside for a year; plague killed seven or eight in ten—they piled the dead beneath the beds and slept above, house after house packed to the rafters.',
  ],
  s0121: [
    'Rui sifted the hidden cases and showed compassion; he had all of it put in order, so the dead were buried and the living returned to their trades—the people relied on him.',
    'Rui sorted the neglected and the suffering and set everything right; the dead were buried, the living went back to their work, and the people lived by his hand.',
  ],
  s0122: [
    'When the Liang regime was established he was summoned as Grand Judge.',
    'When the Liang platform rose he was called to be grand judge.',
  ],
  s0123: [
    'When Gaozu took the throne, Rui was made Minister of Justice and enfeoffed as Viscount of Duliang with a fief of three hundred households.',
    'At Gaozu\'s accession he became minister of justice, enfeoffed viscount of Duliang with three hundred households.',
  ],
  s0124: [
    'In the second year of Tianjian his enfeoffment was changed to Yongchang, the households and fief as before.',
    'In Tianjian year 2 he was re-enfeoffed as Yongchang, fief and households unchanged.',
  ],
  s0125: [
    'When the Eastern Palace was established he was made Right Commandant of the Crown Prince\'s Guard, then went out as General Who Assists the State, Inspector of Yuzhou, and concurrent Administrator of Liyang.',
    'The eastern palace rose; he became right commandant of the crown prince\'s guard, then left office as general who assists the state, inspector of Yuzhou, and administrator of Liyang.',
  ],
  s0126: [
    'In the third year Wei sent armies to raid; he led the provincial troops and drove them off.',
    'In year 3 Wei raided; he led the province\'s soldiers and beat them back.',
  ],
  s0127: [
    'In the fourth year the imperial army marched north; an edict made Rui commander-in-chief of the massed forces.',
    'In year 4 the court marched north; Rui was ordered to command the armies.',
  ],
  s0128: [
    'Rui sent Chief Clerk Wang Chaozong and Administrator of Liangjun Feng Daogen to attack the Wei fort of Xiaokeng, but they could not take it.',
    'He sent chief clerk Wang Chaozong and Liangjun administrator Feng Daogen against Xiaokeng; they failed to crack the walls.',
  ],
  s0129: [
    'Rui walked the siege lines; several hundred men suddenly sallied from the Wei city and formed ranks outside the gate. Rui meant to strike them, but the generals all said, "We came light, without battle gear—withdraw, arm, and then advance.',
    'Rui toured the encirclement; hundreds of Wei soldiers burst from the gate and drew up outside. He meant to hit them, but his officers said, "We came lightly, without armor—fall back, arm, then fight.',
  ],
  s0130: [
    '" Rui said, "Not so.',
    'Rui said, "No.',
  ],
  s0131: [
    'Within the Wei city are a little more than two thousand men, shut in behind closed gates—enough to hold themselves. For them to come out without cause means these must be their fiercest fighters; if we break them, the city will fall of itself.',
    'Two thousand-odd men behind barred gates can hold that place. If they come out without reason, these are their bravest; crush them and the city will take itself.',
  ],
  s0132: [
    'The host still hesitated; Rui pointed to his staff of command and said:',
    'The army still hung back; Rui pointed to his command baton and said:',
  ],
  s0133: [
    '"The court gave this—not for ornament. Wei Rui\'s law admits no breach.',
    '"The throne gave me this, not for show. Wei Rui\'s law is not to be broken.',
  ],
  s0134: [
    '" He advanced.',
    'He marched.',
  ],
  s0135: [
    'The men fought as if each meant to die; the Wei army broke and fled, and he pressed the assault—by midnight the city was his.',
    'The soldiers fought to the death; Wei broke and ran, and he pressed hard—before midnight the walls were his.',
  ],
  s0136: [
    'He then marched to invest Hefei.',
    'Then he moved against Hefei.',
  ],
  s0137: [
    'Earlier, Right Army Major Hu Lue and others had reached Hefei but long could not reduce it. Rui surveyed the rivers and hills and said, "I have heard that the Fen can flood Pingyang and the Jiang can flood Anyi—this is that same thing.',
    'Hu Lue and the rest had besieged Hefei without success. Rui walked the ground and said, "They say the Fen flooded Pingyang and the Jiang flooded Anyi—here is the same trick.',
  ],
  s0138: [
    '" He dammed the Fei River and worked at the head of the labor himself; before long the dam was done, the water ran through, and war-boats came up in succession.',
    'He dammed the Fei and led the work in person; soon the water flowed, and warships followed one after another.',
  ],
  s0139: [
    'Wei had first built eastern and western forts flanking Hefei; Rui attacked the two cities first.',
    'Wei had split Hefei with twin forts east and west; Rui struck those first.',
  ],
  s0140: [
    'Then Wei\'s relief commander Yang Lingyin led fifty thousand men in a sudden arrival; the army feared it could not match them and asked to memorialize for reinforcements.',
    'Then Yang Lingyin came with fifty thousand in relief; fear spread, and they asked to petition for more troops.',
  ],
  s0141: [
    'Rui laughed and said, "The enemy is already at the walls and you ask for soldiers—who forges blades when the battle is on? Will that reach the horse\'s belly in time?',
    'Rui laughed: "The foe is at the wall and you want more men—to cast weapons mid-battle, will that reach the horse\'s belly?',
  ],
  s0142: [
    'If we ask for help, they too will summon hosts—like Wu reinforcing Baqiu while Shu reinforced White Emperor.',
    'If we beg for reinforcements, they will summon theirs too—Wu thickening Baqiu while Shu thickened White Emperor.',
  ],
  s0143: [
    '"Victory lies in harmony, not in numbers"—that is the ancient teaching.',
    '"The army wins by unity, not by mass"—so the ancients taught.',
  ],
  s0144: [
    '" He gave battle and broke them; the army breathed a little easier.',
    'He fought and routed them; the men drew breath again.',
  ],
  s0145: [
    'When the Fei dam was first raised, he had Army Commander Wang Huaijing build a fort on the bank to hold it; Wei attacked and took Huaijing\'s fort, and more than a thousand men perished.',
    'When the dam went up he left Wang Huaijing to fortify the bank; Wei stormed that fort and a thousand men were lost.',
  ],
  s0146: [
    'The Wei men pressed their victory to Rui\'s embankment in great force; Army Supervisor Pan Lingyou urged Rui to fall back to Chaohu Lake, and the generals again asked to retreat to Sancha.',
    'Wei surged to the dike in strength; Pan Lingyou urged retreat to Chaohu, and the officers again begged to fall back to Sancha.',
  ],
  s0147: [
    'Rui said in anger, "Could there be such a thing!',
    'Rui raged, "How could there be such a thing!',
  ],
  s0148: [
    'A general dies with his colors—there is advance, no retreat.',
    'A general dies with his banner—forward only, never back.',
  ],
  s0149: [
    '" He ordered umbrella-fans and command banners brought and planted on the dike to show there would be no move.',
    'He had parasols and command pennons set on the dike to show he would not stir.',
  ],
  s0150: [
    'Rui had always been frail; in every battle he never rode a horse, but was carried in a wooden litter while he drove the army.',
    'Rui was slight of body; he never mounted in battle, riding a wooden litter while he harried the ranks.',
  ],
  s0151: [
    'The Wei soldiers came to breach the dike; Rui struggled with them in person, the Wei host fell back a little, and he built ramparts on the dike to make himself secure.',
    'Wei came to cut the dike; Rui fought them hand to hand, they gave ground, and he threw up ramparts on the bank.',
  ],
  s0152: [
    'Rui raised tower-ships as high as the walls of Hefei and pressed the city on every side.',
    'He built fighting towers level with Hefei\'s walls and closed in on four sides.',
  ],
  s0153: [
    'The Wei men were at their wits\' end and wept together.',
    'Wei was spent; men wept in each other\'s arms.',
  ],
  s0154: [
    'When Rui\'s siege engines were ready and the dammed water stood full, Wei\'s relief could do nothing.',
    'His engines were ready and the water stood high; Wei\'s rescuers were useless.',
  ],
  s0155: [
    'Wei\'s defender Du Yuanlun climbed the wall to direct the fight, was struck by a crossbow bolt, and died; the city collapsed at once.',
    'Du Yuanlun commanded from the wall, took a bolt, and fell; the city broke.',
  ],
  s0156: [
    'Captives numbered more than ten thousand ranks; cattle and horses by the ten-thousands; silk filled ten rooms—all went to reward the army.',
    'Prisoners passed ten thousand; cattle and horses beyond count; silk filled ten chambers—everything went to the soldiers.',
  ],
  s0157: [
    'By day Rui received travelers; by night he reckoned military papers—rising at the third watch with lamps burning until dawn, comforting and guiding his men as though he could never do enough, so that men who came to enlist contended to join him.',
    'By day he met guests; by night he tallied dispatches—up at the third watch, lamps to dawn, tending his men as if he could never finish, so volunteers fought to serve under him.',
  ],
  s0158: [
    'Wherever he halted he set up camp in proper order; lodges, fences, and walls all met the standard.',
    'Every halt became a measured camp—quarters, palisades, and walls squared to the rule.',
  ],
  s0159: [
    'When Hefei was pacified, Gaozu ordered the armies to advance and encamp at Dongling.',
    'Hefei fell; Gaozu ordered the hosts forward to Dongling.',
  ],
  s0160: [
    'Dongling lay twenty li from Wei\'s Brick City; battle was about to join when an edict recalled the army.',
    'Dongling stood twenty li from Wei\'s Brick City; as battle neared, orders came to withdraw.',
  ],
  s0161: [
    'The enemy was close; fearing pursuit, Rui sent all the baggage train ahead while he himself rode in a small litter at the rear—the Wei men revered Rui\'s name and dared not press him; the whole army returned intact.',
    'The foe was near; he sent wagons ahead and rode a small litter in the rear—Wei feared his name and would not close; the army came home whole.',
  ],
  s0162: [
    'At that time Yuzhou\'s seat was moved to Hefei.',
    'Then the seat of Yuzhou was shifted to Hefei.',
  ],
  s0163: [
    'In the fifth year Wei\'s Prince of Zhongshan Yuan Ying raided North Xuzhou and besieged Inspector Chang Yizhi at Zhongli; they claimed a million men and more than forty linked camps.',
    'In year 5 Yuan Ying, prince of Zhongshan, struck North Xuzhou and penned Chang Yizhi at Zhongli—"a million" men, forty-odd camps chained together.',
  ],
  s0164: [
    'Gaozu sent Pacification-North General Cao Jingzong to command two hundred thousand men to resist.',
    'Gaozu sent Cao Jingzong, general who pacifies the north, with two hundred thousand to meet them.',
  ],
  s0165: [
    'They encamped at Shaoyang Isle and built ramparts to hold each other; Gaozu ordered Rui to bring the forces of Yuzhou and join them.',
    'They held Shaoyang Isle behind fresh ramparts; Gaozu told Rui to bring Yuzhou\'s army to the rendezvous.',
  ],
  s0166: [
    'Rui came from Hefei by the direct road through the great marshes of Yinling; whenever he met ravines he threw flying bridges across.',
    'He left Hefei by the straight track through Yinling\'s great bogs, bridging every gully as he came.',
  ],
  s0167: [
    'The soldiers feared the Wei host\'s strength and many urged Rui to go slowly.',
    'His men dreaded Wei\'s numbers and begged him to march slowly.',
  ],
  s0168: [
    'Rui said, "At Zhongli they are digging holes to live in and carrying water on their backs; chariots race and runners sprint, and still they fear they come too late—how much less should we linger!',
    'Rui said, "At Zhongli they burrow in the earth and haul water on their shoulders; chariots fly and runners dash, and still they fear they are late—shall we crawl?',
  ],
  s0169: [
    'The Wei men are already in my belly—do not fret.',
    'Wei is already in my gut—have no fear.',
  ],
  s0170: [
    '" Within ten days he reached Shaoyang.',
    'In ten days he was at Shaoyang.',
  ],
  s0171: [
    'Earlier Gaozu had charged Jingzong, "Wei Rui is the leading man of your native place—you must honor him well.',
    'Gaozu had told Jingzong, "Wei Rui is the great man of your district—treat him with respect.',
  ],
  s0172: [
    '" Jingzong received Rui with the utmost courtesy.',
    'Jingzong received him with deep courtesy.',
  ],
  s0173: [
    'When Gaozu heard of it he said, "When two generals are in harmony, the army will surely succeed.',
    'Gaozu heard and said, "Two generals in accord—the host will win.',
  ],
  s0174: [
    '" Twenty li before Jingzong\'s camp, Rui dug a long trench by night, set antlers, and cut the isle into a walled camp; by dawn the fort stood.',
    'Twenty li short of Jingzong\'s lines he dug a trench by night, planted stakes, and walled off the isle—by dawn a camp stood.',
  ],
  s0175: [
    'Yuan Ying was greatly alarmed and struck the ground with his staff, crying, "What spirit is this!',
    'Yuan Ying was thunderstruck and beat the earth with his staff: "What sorcery is this!',
  ],
  s0176: [
    'At dawn Ying himself led the host to battle; Rui rode a plain wooden litter, white horn ruyi in hand to command the ranks, clashing several times in a day—Ying greatly feared his strength.',
    'At first light Ying came in person; Rui sat in a plain wooden litter, white ruyi in hand, and fought several rounds in a day—Ying dreaded his power.',
  ],
  s0177: [
    'The Wei army came again by night to storm the wall; arrows fell like rain. Rui\'s son An asked to leave the wall to escape the shafts; Rui would not allow it.',
    'Wei stormed the wall by night; arrows poured. His son An begged to come down; Rui refused.',
  ],
  s0178: [
    'Panic ran through the army; Rui shouted from the wall in a fierce voice and the host steadied.',
    'The ranks wavered; he roared from the battlements and they steadied.',
  ],
  s0179: [
    'The Wei men had earlier built twin bridges on both banks of Shaoyang Isle, with palisades for several hundred paces, spanning the Huai as a road.',
    'Wei had bridged both shores of Shaoyang with palisades for hundreds of paces, a road across the Huai.',
  ],
  s0180: [
    'Rui fitted great warships and made Administrator of Liangjun Feng Daogen, Administrator of Lujiang Pei Sui, and Administrator of Qinjun Li Wenzhao command the river force.',
    'He fitted great ships and set Feng Daogen of Liangjun, Pei Sui of Lujiang, and Li Wenzhao of Qinjun over the fleet.',
  ],
  s0181: [
    'The Huai suddenly rose in flood; Rui sent the fleet at once, tower-ships racing out, all bearing on the enemy ramparts.',
    'The Huai swelled; he launched at once—tower-ships leaped forward and closed on the Wei lines.',
  ],
  s0182: [
    'Small boats carried grass soaked in grease and set the bridges ablaze behind them.',
    'Small craft heaped greased grass and fired the bridges in their wake.',
  ],
  s0183: [
    'Wind fed the flames until smoke and dust blotted the sky; death-defying men tore down palisades and hacked the bridges, while the current ran fierce—in an instant bridges and stakes were gone.',
    'Wind made a furnace of the sky; men who did not care for life wrenched down stakes and chopped bridges while the flood raced—bridges and palisades vanished in a breath.',
  ],
  s0184: [
    'Feng Daogen and the rest fought hand to hand themselves; the soldiers fought with fury, their cries shaking heaven and earth, none meeting less than a hundred—the Wei host collapsed utterly.',
    'Feng Daogen and the others fought in the van; the soldiers roared till heaven shook, each man worth a hundred—Wei broke completely.',
  ],
  s0185: [
    'Yuan Ying saw the bridges gone and fled for his life.',
    'Yuan Ying saw the bridges destroyed and ran.',
  ],
  s0186: [
    'Wei soldiers rushing to the water drowned by the hundred-thousands; heads taken were as many.',
    'Men drowning in the river ran to the hundred-thousands; heads heaped as high.',
  ],
  s0187: [
    'The rest cast off armor and bowed their foreheads, begging to be prisoners—still several hundred thousand.',
    'The rest dropped mail and knocked their heads, begging captivity—still hundreds of thousands.',
  ],
  s0188: [
    'Arms, cattle, and horses captured could not be counted.',
    'Booty in arms, cattle, and horses passed counting.',
  ],
  s0189: [
    'Rui sent word to Chang Yizhi; Yizhi was by turns grieving and glad, too overwhelmed to answer, and could only cry, "Reborn!',
    'Rui sent to Chang Yizhi; Yizhi wept and laughed, unable to answer, and could only shout, "Born again!',
  ],
  s0190: [
    'Reborn!',
    'Born again!',
  ],
  s0191: [
    '" Gaozu sent Palace Secretary Zhou She to labor the army on the Huai; Rui piled the spoils at the camp gate for him to see. She looked and said to Rui, "Your capture here rivals Bear-Ear Mountain.',
    'Gaozu sent Zhou She to comfort the Huai army; Rui heaped booty at the gate. She said, "This haul matches Bear-Ear Mountain.',
  ],
  s0192: [
    'For his merit his fief was increased by seven hundred households, he was advanced to marquis, and summoned as Regular Attendant of Direct Transmission and Right Guard General.',
    'His fief grew by seven hundred households, he became a marquis, and was called to court as regular attendant of direct transmission and right guard general.',
  ],
  s0193: [
    'In the seventh year he was made Left Guard General, then soon Anxi Chief Clerk and Administrator of Nanjun at the salary of two thousand dan.',
    'In year 7 he became left guard general, then chief clerk of Anxi and administrator of Nanjun at two-thousand-dan rank.',
  ],
  s0194: [
    'When Sizhou Inspector Ma Xianbi marched north and returned, Wei pursued him; the Three Passes were shaken, and an edict made Rui commander of the relief armies.',
    'Ma Xianbi of Sizhou marched north and was chased home by Wei; the Three Passes trembled, and Rui was ordered to command the rescue.',
  ],
  s0195: [
    'Rui reached Anlu, raised the walls more than two zhang, opened a great trench, and built tall towers; many mocked him for showing fear.',
    'At Anlu he raised walls two zhang higher, dug a deep moat, and built tall towers—many sneered that he showed weakness.',
  ],
  s0196: [
    'Rui said, "Not so—a commander must know when to be timid; courage alone is not enough.',
    'Rui said, "No—a general must know fear; bravery alone will not do.',
  ],
  s0197: [
    'At that time Yuan Ying again pursued Xianbi, meaning to wash away the shame of Shaoyang; when he heard Rui had come, he withdrew.',
    'Yuan Ying chased Xianbi again to avenge Shaoyang; hearing Rui had arrived, he retreated.',
  ],
  s0198: [
    'The emperor also ordered the armies disbanded.',
    'The throne recalled the host.',
  ],
  s0199: [
    'The next year he was made Trustworthy-War General and Inspector of Jiangzhou.',
    'Next year he became trustworthy-war general and inspector of Jiangzhou.',
  ],
  s0200: [
    'In the ninth year he was summoned as Supernumerary Regular Attendant of the Scattered Cavalry and Right Guard General, and rose repeatedly to Left Guard General and Supervisor of the Crown Prince\'s Household, then with the additional title Regular Attendant of Direct Transmission.',
    'In year 9 he was recalled as supernumerary regular attendant of the scattered cavalry and right guard general, then advanced through left guard general and supervisor of the crown prince\'s household, with the added title regular attendant of direct transmission.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_012_b2.mjs <translation.json>'
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
