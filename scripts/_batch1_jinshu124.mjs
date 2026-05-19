#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0001: [
    'Murong Bao, Murong Sheng, Murong Xi, Murong Yun',
    'Murong Bao · Murong Sheng · Murong Xi · Murong Yun',
  ],
  s0002: [
    'Murong Bao, courtesy name Daoyou, was Chui\'s fourth son.',
    'Murong Bao, whose courtesy name was Daoyou, was the fourth son of Murong Chui.',
  ],
  s0003: [
    'In youth he was light, rash, and without settled purpose; he loved men who flattered him.',
    'As a youth he was reckless and fickle, with no firm principles, and he surrounded himself with flatterers.',
  ],
  s0004: [
    'In Fu Jian\'s time he served as gentleman attendant of the heir apparent and magistrate of Wannian.',
    'Under Fu Jian he held the posts of gentleman attendant to the crown prince and magistrate of Wannian county.',
  ],
  s0005: [
    'At Fu Jian\'s campaign at Huainan and Feishui, Bao was made general who crosses the river.',
    'During Fu Jian\'s defeat at Feishui, Bao was appointed general who crosses the Jiang.',
  ],
  s0006: [
    'When he became heir apparent, he honed himself, honored Confucian learning, was skilled at discussion and literary composition, and obsequiously served Chui\'s attendants and petty officials to seek a good reputation.',
    'Once made heir apparent, he cultivated himself, promoted Confucian studies, excelled at debate and prose, and curried favor with Chui\'s courtiers to win praise.',
  ],
  s0007: [
    'Chui\'s courtiers all at once praised him, and Chui also thought he could preserve the family enterprise and greatly regarded him as worthy.',
    'The whole court took up the chorus; Chui believed his son could safeguard the house and held him in high esteem.',
  ],
  s0008: [
    'When Chui died, that same year Bao succeeded to the usurped throne, proclaimed a general amnesty within the borders, and changed the era name to Yongkang.',
    'Chui\'s death that year brought Bao to the throne; he amnestied the realm and proclaimed the Yongkang era.',
  ],
  s0009: [
    'He made his grand marshal Kuoruguan Wei grand preceptor and left grand master of the palace, Duan Chong grand guardian, and the rest received appointments each according to rank.',
    'He named his grand marshal Kuoruguan Wei grand preceptor and left grand master of the palace, made Duan Chong grand guardian, and distributed the remaining offices by rank.',
  ],
  s0010: [
    'Following Chui\'s testament, he audited households, abolished military camps and assigned them to commanderies and counties, fixed the old registers of the gentry clans, clarified official ritual, yet the laws were severe and government stern, above and below parted in virtue, and in nine houses out of ten the people thought of rebellion.',
    'He carried out Chui\'s last orders—household surveys, dismantling military camps into civil districts, fixing aristocratic registers, and clarifying court ceremony—but harsh law and stern rule estranged elites from the throne until rebellion stirred in nearly every household.',
  ],
  s0011: [
    'Earlier, because Bao had no heir established in the ancestral tomb rites, Chui had continually worried over this.',
    'Chui had long worried that Bao had not secured his succession with a proper heir.',
  ],
  s0012: [
    'Bao\'s son by a concubine, Qinghe Duke Hui, was endowed with many talents and arts and possessed bold strategy; Chui deeply marveled at him.',
    'Bao\'s bastard son, the Prince of Qinghe, Hui, combined many gifts with bold strategy, and Chui took him for a wonder.',
  ],
  s0013: [
    'When Bao marched north, he had Hui act as regent over palace affairs, with oversight and honors equal to the heir apparent—thus showing the settled intent.',
    'On Bao\'s northern campaign he left Hui as regent with honors matching the heir apparent, a clear sign of his intended successor.',
  ],
  s0014: [
    'When Chui attacked Wei, because Longcheng was the old capital and held the ancestral temples, he again had Hui garrison You Province and entrusted him with the weight of the northeast, selecting high officials to augment his prestige.',
    'Chui\'s assault on Wei sent Hui back to garrison You Province—Longcheng held the imperial tombs—and loaded him with northeastern authority and handpicked aides to magnify his stature.',
  ],
  s0015: [
    'On his deathbed in his final charge he named Hui as Bao\'s successor, but Bao favored his youngest son, Puyang Duke Ce, and his mind was not on Hui.',
    'Chui\'s deathbed testament named Hui as Bao\'s heir, yet Bao doted on his youngest son, the Duke of Puyang, Ce, and had no heart for Hui.',
  ],
  s0016: [
    'Bao\'s eldest son by a concubine, Changle Duke Sheng, regarded himself as senior by birth and was shamed that Hui should go before him; he therefore loudly praised Ce as fit for the secondary heir and slandered Hui.',
    'Sheng, Bao\'s eldest bastard, chafed at being passed over for the younger Hui and campaigned for Ce as crown prince while blackening Hui\'s name.',
  ],
  s0017: [
    'Bao was greatly pleased and thereupon consulted Princes of Zhao and Gaoyang, Lin and Long; Lin and the rest all heeded his intent and praised the plan.',
    'Bao was delighted and consulted Murong Lin and Murong Long, who eagerly seconded the proposal.',
  ],
  s0018: [
    'Bao then with Lin and the others settled the plan, made Ce\'s mother Lady Duan empress, Ce crown prince, and advanced Sheng and Hui in rank to princes.',
    'With Lin\'s backing, Bao made Ce\'s mother Lady Duan empress, named Ce crown prince, and elevated Sheng and Hui to princely rank.',
  ],
  s0019: [
    'Ce, courtesy name Daofu, was eleven years old, of fine appearance, yet dull, weak, and without wisdom.',
    'Ce, whose courtesy name was Daofu, was eleven—handsome but feeble-minded and witless.',
  ],
  s0020: [
    'When Wei attacked Bing Province, the quick cavalry commander Nong met them in battle and was defeated; returning to Jinyang, the marshal Murong Song shut the gates and barred him.',
    'Wei\'s invasion of Bing Province routed Murong Nong; when he retreated to Jinyang, Marshal Murong Song locked him out.',
  ],
  s0021: [
    'Nong led several thousand horsemen in flight back to Zhongshan; on reaching Luchuan he was overtaken by Wei\'s pursuit—his remaining riders were all lost, and he escaped back alone on a single horse.',
    'Nong fled toward Zhongshan with a few thousand cavalry but was run down at Luchuan; his escort was wiped out and he rode home alone.',
  ],
  s0022: [
    'Bao convened the ministers in the Eastern Hall to deliberate on it.',
    'Bao gathered his ministers in the Eastern Hall for counsel.',
  ],
  s0023: [
    'Zhongshan intendant Fu Mo said, "Wei\'s forces are powerful; they have fought a thousand li and come on the crest of victory with courage doubled. If they range cavalry on the plain the situation will be stronger still, and we will scarcely be able to face them—we should use perilous ground to hold them off.',
    'Fu Mo, intendant of Zhongshan, argued: "Wei is strong; its army has fought a thousand miles and arrives flushed with victory. On open ground their horsemen will be unstoppable—we must meet them in defensible terrain."',
  ],
  s0024: [
    '" Chief minister of the Secretariat Qi Sui said, "Wei has many cavalry; their columns move with raiding speed, carrying grain on horseback—no more than ten days.',
    'Qi Sui replied: "Wei relies on cavalry that raid in lightning strikes and carry provisions on horseback—they cannot last ten days."',
  ],
  s0025: [
    'We should order the commanderies and counties to gather a thousand households into one fort, dig deep moats and raise high ramparts, and clear the countryside to await them.',
    'Let every district mass a thousand households into walled forts, dig deep ditches, build high walls, and strip the countryside bare to starve them out."',
  ],
  s0026: [
    'When they have nothing to plunder and no supplies to draw on, in no more than sixty days they will naturally withdraw in exhaustion.',
    'Without loot or forage they will break within sixty days."',
  ],
  s0027: [
    '" Minister Feng Yi said, "Now Wei\'s army numbers a hundred thousand—the fiercest foe under Heaven.',
    'Feng Yi objected: "Wei fields a hundred thousand men, the strongest army in the realm."',
  ],
  s0028: [
    'Though the people wish to gather in forts, they are not enough to defend themselves; that would only pile grain and troops to strengthen the enemy, stir popular fear, and show weakness. Blocking the passes and fighting at the frontier is the best plan.',
    'The people cannot hold such forts; massing grain and soldiers would only feed the invader, spread panic, and advertise weakness. We should bar the passes and give battle—that is the superior strategy."',
  ],
  s0029: [
    '" Murong Lin said, "Wei now rides the tide of victory with sharp morale; its edge cannot be met—we should complete our defenses and wait for their exhaustion, then strike when they falter.',
    'Murong Lin urged: "Wei comes drunk on victory; we cannot meet that edge head-on. Fortify, hoard grain, and strike only when they weaken."',
  ],
  s0030: [
    '" Thereupon they repaired the walls and amassed grain, making preparations for a prolonged defense.',
    'They repaired the walls, stockpiled grain, and settled in for a long siege.',
  ],
  s0031: [
    'Wei attacked Zhongshan without success, advanced and held Boling Lukou; the generals fled at the sight of them, and the commanderies and counties all surrendered to Wei. Bao heard that Wei had internal troubles and then led his entire host out to resist—one hundred twenty thousand foot soldiers and thirty-seven thousand cavalry—and halted at Quyang Baixi.',
    'Wei failed to take Zhongshan but seized Boling Lukou; commanders fled and districts surrendered. Hearing of turmoil within Wei, Bao marched out with his full strength—120,000 infantry and 37,000 horse—and camped at Quyang Baixi.',
  ],
  s0032: [
    'Wei\'s army advanced to Xinliang.',
    'The Wei host moved up to Xinliang.',
  ],
  s0033: [
    'Bao feared the sharpness of Wei\'s troops and sent the northern campaign commander Long to raid Wei\'s camp by night; he was defeated and returned.',
    'Fearing Wei\'s edge, Bao sent Murong Long on a night attack; Long was beaten back.',
  ],
  s0034: [
    'Wei\'s army came on in steady columns; the camps faced each other, and above and below were filled with dread—the three armies lost heart.',
    'Wei advanced in ordered ranks; the armies faced each other across the lines, and dread spread until the whole host lost its nerve.',
  ],
  s0035: [
    'Nong and Lin urged Bao to return to Zhongshan, and he thereupon led the army back.',
    'Nong and Lin persuaded Bao to fall back on Zhongshan, and he withdrew.',
  ],
  s0036: [
    'Wei\'s army pursued them; Bao, Nong, and the others abandoned the great host and led twenty thousand cavalry in flight back.',
    'Wei gave chase; Bao and Nong abandoned the main army and fled north with twenty thousand horsemen.',
  ],
  s0037: [
    'At that time a great wind and snow blew; those who froze to death lay pillow to pillow along the road.',
    'A blizzard swept the retreat; the dead lay heaped along the road.',
  ],
  s0038: [
    'Bao feared being overtaken by Wei\'s army and ordered robes, staves, and weapons cast away—not a blade was to return.',
    'Fearing capture, Bao ordered his men to discard robes, staffs, and arms until not a weapon remained.',
  ],
  s0039: [
    'Wei\'s army advanced to attack Zhongshan and encamped at Fanglin Garden.',
    'Wei pressed Zhongshan and pitched camp in Fanglin Garden.',
  ],
  s0040: [
    'That night the minister of the Secretariat Murong Hao plotted to kill Bao and install Murong Lin.',
    'That night Minister Murong Hao plotted to kill Bao and raise Murong Lin.',
  ],
  s0041: [
    'Hao\'s wife\'s elder brother Su Ni reported it; Bao sent Murong Long to arrest Hao. Hao and several dozen fellow conspirators cut through the gate and fled to Wei.',
    'Su Ni, Hao\'s brother-in-law, betrayed the plot; Bao sent Murong Long to seize Hao, but Hao and dozens of conspirators broke out and fled to Wei.',
  ],
  s0042: [
    'Lin, in fear for himself, took troops and seized the left guard general, Prince of Beidi Jing, plotting to lead the palace guard to assassinate Bao.',
    'Lin, terrified, seized Prince Jing of Beidi, commander of the left guard, and plotted to murder Bao with the palace troops.',
  ],
  s0043: [
    'Jing resisted on grounds of righteousness; Lin in anger killed Jing and fled to the Dingling.',
    'Jing refused on principle; Lin slew him in rage and fled to the Dingling.',
  ],
  s0044: [
    'Earlier, when Bao heard that Wei was coming to attack, he had Murong Hui lead the hosts of You and Bing to hurry to Zhongshan. After Lin rebelled, Bao feared Hui would seize the army in revolt and was about to send troops to meet him.',
    'When Wei invaded, Bao had summoned Murong Hui from You and Bing; after Lin\'s revolt he feared Hui would turn the army against him and prepared to intercept him.',
  ],
  s0045: [
    'Lin\'s attendant Duan Pingzi fled back from the Dingling and reported that Lin was gathering Dingling forces in great numbers, planning to strike Hui\'s army and seize Longcheng in the east.',
    'Duan Pingzi, Lin\'s aide, escaped from the Dingling and warned that Lin was rallying them in force to crush Hui and seize Longcheng.',
  ],
  s0046: [
    'Bao with his crown prince Ce and Nong, Long, and more than ten thousand cavalry went to meet Hui at Ji, leaving Duke of Kaifeng Murong Xiang to hold Zhongshan.',
    'Bao rode out with Ce, Nong, and Long and over ten thousand cavalry to meet Hui at Ji, leaving Murong Xiang to defend Zhongshan.',
  ],
  s0047: [
    'Hui devoted himself to winning men over, repaired armor and sharpened weapons, and with twenty thousand foot and horse advanced in battle array to welcome Bao south of Ji.',
    'Hui worked every tie, drilled his troops, and marched south of Ji with twenty thousand men in battle order to receive Bao.',
  ],
  s0048: [
    'Bao divided troops between Nong and Long and sent Duke of Xihe Kuoruguan Ji with three thousand men to help hold Zhongshan.',
    'Bao split his force between Nong and Long and sent Kuoruguan Ji of Xihe with three thousand men to reinforce Zhongshan.',
  ],
  s0049: [
    'When Hui learned that Ce had been made crown prince, he showed resentment on his face.',
    'Learning that Ce was crown prince, Hui could not hide his bitterness.',
  ],
  s0050: [
    'Bao told Nong and Long; both said, "Hui is still young and holds sole authority in the regions—this is the arrogance of habit; there is nothing else to it.',
    'Bao confided in Nong and Long; both said, "Hui is young and commands the frontier alone—his pride is only the habit of power, nothing more."',
  ],
  s0051: [
    'We shall rebuke him with ritual propriety.',
    'We will bring him to heel with proper ceremony.',
  ],
  s0052: [
    '" The gentlemen of You and Ping all cherished Hui\'s prestige and virtue and were unwilling to leave him; they all petitioned, saying, "The Prince of Qinghe is gifted by Heaven with divine martial prowess and strategy beyond other men; we have sworn with him to live and die together, and feeling his grace we are each redoubled in courage.',
    'Officers of You and Ping, devoted to Hui, petitioned: "The Prince of Qinghe is heaven-sent in war and counsel; we have pledged our lives to him, and under his favor our courage has doubled."',
  ],
  s0053: [
    'We beg Your Majesty, the crown prince, and the princes to halt at the Ji palace and let the prince lead us to raise the siege of the capital, and afterward we shall escort the imperial carriage back.',
    'Let Your Majesty, the crown prince, and the princes remain at Ji while the prince leads us to lift the siege of the capital; then we shall escort you home."',
  ],
  s0054: [
    '" Bao\'s attendants all feared Hui\'s valor and strategy; they slandered him and would not consent, and the multitude all murmured in resentment.',
    'Bao\'s courtiers, fearing Hui\'s talent, blocked the plan with slander, and the soldiers grumbled.',
  ],
  s0055: [
    'His attendants urged Bao to kill Hui; the attendant censor Qiuni Gui heard of it and told Hui, saying, "Those at your side are secretly plotting thus; the sovereign will follow them.',
    'Courtiers urged Bao to kill Hui; Qiuni Gui warned Hui: "Your father\'s men are plotting murder, and the emperor will listen."',
  ],
  s0056: [
    'What the great king relies on is only his parents—and the father already harbors a different design;',
    'You trust only your parents, and your father has already turned against you;',
  ],
  s0057: [
    'what you lean on is arms, and arms have already left your hand; advance and retreat have no road, and I fear there is no way to preserve yourself.',
    'your strength was your army, and that army is gone. With no path forward or back, you cannot survive."',
  ],
  s0058: [
    'Why not kill the two princes, depose the crown prince, and let the great king take the eastern palace himself while also holding the posts of general and minister to set the altars right?',
    'Slay the two princes, remove the crown prince, take the heir\'s place yourself, and command both army and state—that is how you save the dynasty."',
  ],
  s0059: [
    '" Hui did not follow this.',
    'Hui refused."',
  ],
  s0060: [
    'Bao said to Nong and Long, "Seeing Hui\'s intent to rebel, the matter is surely so—we ought to kill him early.',
    'Bao told Nong and Long, "Hui means to rebel; we must kill him now."',
  ],
  s0061: [
    'If not, I fear a great calamity.',
    'Otherwise disaster will follow."',
  ],
  s0062: [
    '" Nong said, "Bandits and enemies trouble us within; the central provinces are in turmoil. Hui pacifies the old capital and settles the people and secures the borders; when the capital is in peril he hurries a thousand li like a shooting star—his weight in prestige can awe the Rong and Di.',
    'Nong objected: "Enemies press within and the heartland is in chaos. Hui holds Longcheng, calms the northeast, and when the capital calls he races a thousand li—his name alone can awe the barbarians."',
  ],
  s0063: [
    'Moreover his rebellious tracks are not yet clear; we ought for now to endure in concealment.',
    'His treason is not yet proven; we should endure a while longer."',
  ],
  s0064: [
    'Now the peril to the altars hangs by a single thread; to kill kin within would harm our prestige.',
    'The state hangs by a thread; fratricide now would only shatter what authority we have left."',
  ],
  s0065: [
    '" Bao said, "Hui\'s rebellious heart is already formed, yet you kings are benevolent and unwilling to remove him; I fear that once trouble breaks out he will first harm the princes, then reach me.',
    'Bao said, "Hui\'s treason is set, yet you are too merciful to act. When the blow falls he will kill your kin first, then me."',
  ],
  s0066: [
    'After the affair fails, you will think of my words.',
    'When it is too late, remember what I told you."',
  ],
  s0067: [
    '" Nong and the others firmly remonstrated, and he thereupon stopped.',
    'Nong and Long pressed him until he relented."',
  ],
  s0068: [
    'When Hui heard of this he was all the more afraid and fled to Guangdu Huangyu Valley.',
    'Hui, terrified, fled to Huangyu Valley at Guangdu.',
  ],
  s0069: [
    'Hui sent Qiuni Gui and others with more than two thousand stalwarts to strike Nong and Long in separate attacks; Long was killed that night, and Nong was gravely wounded.',
    'Hui sent Qiuni Gui with two thousand men to strike Nong and Long; Long died that night and Nong was badly wounded.',
  ],
  s0070: [
    'Shortly afterward Hui returned to Bao; Bao intended to execute Hui, lured him with reassurances, and secretly sent the left guard Murong Teng to behead Hui—but could not wound him.',
    'Hui then came back to Bao, who meant to kill him, soothed him with false kindness, and set Murong Teng to cut him down—yet Teng could not harm him.',
  ],
  s0071: [
    'Hui again fled to his troops, and thereupon he marshaled the army to attack Bao.',
    'Hui fled to his soldiers and turned them against Bao.',
  ],
  s0072: [
    'Bao led several hundred cavalry in gallop toward Longcheng; Hui led his host in pursuit and sent envoys asking that the flattering ministers at Bao\'s side be executed and the crown prince demanded as well—Bao would not agree.',
    'Bao raced for Longcheng with a few hundred horsemen; Hui pursued and demanded the execution of Bao\'s favorites and the surrender of the crown prince—Bao refused.',
  ],
  s0073: [
    'Hui besieged Longcheng; the attendant Gentleman Gao Yun by night led more than a hundred dare-to-die men to strike Hui, defeated him, and his host all scattered in flight; he alone on a single horse fled back to Zhongshan, crossed the siege lines to enter, and was killed by Murong Xiang.',
    'Hui besieged Longcheng until Gao Yun led a hundred dare-to-die men in a night attack, routed him, and scattered his army; Hui rode alone to Zhongshan, slipped through the lines, and Murong Xiang killed him.',
  ],
  s0074: [
    'Xiang usurped the exalted title, set up the hundred offices, and changed the era name.',
    'Murong Xiang seized the imperial title, appointed officials, and proclaimed a new era.',
  ],
  s0075: [
    'He was dissolute in wine and extravagant in lust, killing without measure; he executed more than five hundred princes and officials from the kingly house downward, and within and without were shaken—none dared meet his gaze.',
    'Drunken, lecherous, and murderous without limit, he slaughtered more than five hundred royals and officials until the court trembled and no one dared look him in the eye.',
  ],
  s0076: [
    'Famine gripped the city; several tens of the nobility starved to death.',
    'Famine stalked the city, and dozens of high officials starved.',
  ],
  s0077: [
    'Lin led the Dingling host into Zhongshan, beheaded Xiang and his intimate faction of more than three hundred, and again usurped the exalted title.',
    'Lin entered Zhongshan with the Dingling, killed Xiang and three hundred of his kin and allies, and proclaimed himself emperor.',
  ],
  s0078: [
    'Zhongshan was in extreme famine; Lin went out and held Xincheng, and fought Wei\'s army at Yitai; Lin\'s army was defeated.',
    'Starvation wracked Zhongshan; Lin moved to Xincheng and met Wei at Yitai, where he was routed.',
  ],
  s0079: [
    'Wei\'s army then entered Zhongshan; Lin thereupon fled to Ye.',
    'Wei took Zhongshan, and Lin fled to Ye.',
  ],
  s0080: [
    'Murong De sent his attendant Li Yan to urge Bao to march south; Bao was greatly pleased. Murong Sheng remonstrated earnestly, holding that the troops were weary and the army aged, Wei had newly pacified the Central Plain, and they ought to nurture their forces and watch for openings, waiting for another year.',
    'Murong De sent Li Yan to urge a southern campaign; Bao was elated, but Murong Sheng argued that the army was exhausted, Wei had just secured the Central Plain, and they should rest and wait for another chance.',
  ],
  s0081: [
    'Bao was about to follow this.',
    'Bao was on the point of agreeing.',
  ],
  s0082: [
    'The commissioner of the army Murong Teng advanced and said, "Now the hosts are already gathered; we ought to seize the newly settled moment to accomplish the merit of advance.',
    'Murong Teng objected: "The troops are assembled; we must strike now while the moment is fresh and win glory."',
  ],
  s0083: [
    'Men may be made to follow, but it is hard to plan the beginning with them; Your Sagely Resolve alone should decide—there is no need to gather many differing views and thereby disrupt the army\'s counsel.',
    'Soldiers can be led once the order is given, but they cannot be consulted at the start. Your Majesty must decide alone and not let debate wreck the campaign."',
  ],
  s0084: [
    '" Bao said, "My plan is settled—whoever dares remonstrate shall be beheaded!',
    'Bao declared, "My mind is made up. Anyone who objects dies!"',
  ],
  s0085: [
    '" Bao set out from Longcheng, making Murong Teng grand marshal of the vanguard, Murong Nong the center army, and himself the rear army, with thirty thousand foot and horse, and halted at Yilian.',
    'He marched from Longcheng with Murong Teng leading the van, Murong Nong the center, and himself the rear—thirty thousand men—and camped at Yilian.',
  ],
  s0086: [
    'The senior soldier Duan Sugubone and Song Chimei, because the host feared corvée labor, killed the minister of works, Prince of Lelang Zhou, and forced Gaoyang Prince Chong to be established.',
    'Duan Sugubone and Song Chimei, exploiting the army\'s fear of forced labor, murdered Prince Zhou of Lelang, minister of works, and installed Prince Chong of Gaoyang.',
  ],
  s0087: [
    'Bao fled alone on horseback to Nong and then led the army to attack Sugubone.',
    'Bao rode alone to Nong and marched against Sugubone.',
  ],
  s0088: [
    'The host all feared the campaign and mutiny; they cast aside their staves and fled to join the rebels.',
    'The soldiers dreaded another march; they threw down their weapons and joined the mutineers.',
  ],
  s0089: [
    'Teng\'s host also collapsed; Bao and Nong galloped back to Longcheng.',
    'Teng\'s force dissolved as well; Bao and Nong fled back to Longcheng.',
  ],
  s0090: [
    'Lan Han secretly plotted with Sugubone; Sugubone advanced to attack the city. Nong was deceived by Lan Han, slipped out secretly to join the rebels, and was killed by Sugubone.',
    'Lan Han conspired with Sugubone, who besieged Longcheng; Nong, tricked by Lan Han, slipped out to the rebels and was killed.',
  ],
  s0091: [
    'The host all scattered in flight; Bao fled south with Murong Sheng, Murong Teng, and the others.',
    'The army broke apart; Bao fled south with Sheng, Teng, and the rest.',
  ],
  s0092: [
    'Lan Han supported the crown prince Ce to hold the government by imperial order and sent envoys to welcome Bao; they met him at Ji city.',
    'Lan Han set Ce up as regent and sent envoys to welcome Bao, meeting him at Ji.',
  ],
  s0093: [
    'Bao wished to return north; Sheng and the others all held that Han\'s loyalty and sincerity, true or false, were not yet known, and that if he went back alone on horseback, should Han harbor a divided heart, there would be no time for regret.',
    'Bao wanted to go north, but Sheng warned that Lan Han\'s loyalty was untested and a lone rider returning north would have no escape if Han turned false.',
  ],
  s0094: [
    'Bao followed this and thereupon went south from Ji.',
    'Bao took their advice and turned south from Ji.',
  ],
  s0095: [
    'When he reached Liyang he heard that Murong De had assumed regency and, in fear, withdrew.',
    'At Liyang he learned Murong De had taken power and retreated in alarm.',
  ],
  s0096: [
    'He sent Murong Teng to gather scattered troops at Julu; Murong Sheng rallied bold men in Ji Province; Duan Yi and Duan Wen gathered their followings at Neihuang—the multitude all responded and fixed a day to assemble.',
    'He sent Teng to rally broken units at Julu, Sheng to gather champions in Ji, and Duan Yi and Duan Wen to raise their bands at Neihuang; men answered from every side and set a date to rise.',
  ],
  s0097: [
    'It happened that Lan Han sent the left general Su Chao to welcome Bao; Bao, because Han was Chui\'s youngest uncle by the mother\'s line and Sheng was Han\'s son-in-law, was certain there could be no divided loyalty, and returned to Longcheng.',
    'Lan Han sent Su Chao to escort him home; trusting Han as Chui\'s uncle and Sheng\'s father-in-law, Bao believed him loyal and returned to Longcheng.',
  ],
  s0098: [
    'Han led Bao into the outer residence and assassinated him; he was forty-four years old, had held the throne three years, in the third year of Longan.',
    'Lan Han received him in the outer palace and murdered him. Bao was forty-four, had reigned three years, in Longan year three.',
  ],
  s0099: [
    'Han also killed the crown prince Ce and more than a hundred princes, dukes, and ministers.',
    'He also killed Crown Prince Ce and more than a hundred royals and officials.',
  ],
  s0100: [
    'Han styled himself area commander-in-chief, grand general, grand chanyu, and Prince of Changli.',
    'Lan Han proclaimed himself area commander-in-chief, grand general, grand chanyu, and Prince of Changli.',
  ],
};

const path = 'translations/current_translation_jinshu.json';
const data = JSON.parse(readFileSync(path, 'utf8'));
for (const s of data.sentences) {
  const pair = T[s.id];
  if (!pair) throw new Error(`Missing translation for ${s.id}`);
  s.literal = pair[0];
  s.idiomatic = pair[1];
}
writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', Object.keys(T).length, 'translations');
