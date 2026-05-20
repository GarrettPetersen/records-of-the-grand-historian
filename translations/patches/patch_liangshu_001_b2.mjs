#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'Wang Mao again said privately to Zhang Hongce: "I serve Your Grace with a duty that admits no advance or retreat; yet now, with the Prince of Nankang placed in another\'s hands, they will seize the Son of Heaven to command the feudal lords—and Your Grace going forward will be made someone\'s tool. Is this truly a plan for the bitter cold?"',
    'Wang Mao took Zhang Hongce aside and said, "I serve you without thought of turning back—but if Nankang falls into other hands, they will hold the emperor hostage and rule the lords through him, and you will march only as their instrument. Is that a strategy for hard times?"',
  ],
  s0102: [
    'Hongce spoke of this; Gaozu said: "If the great enterprise ahead should not succeed, then orchid and mugwort burn together indeed;',
    'Hongce relayed this; Gaozu answered, "If the great cause ahead fails, orchid and mugwort may burn together after all;',
  ],
  s0103: [
    'if merit and enterprise are fully achieved, awe will overawe the four seas, orders will command the realm—who would dare not obey!',
    'but if success is won, awe will fill the four seas and orders will run through the realm—who would dare refuse?',
  ],
  s0104: [
    'How could one meekly submit to another\'s disposal?',
    'Why should we tamely accept someone else\'s terms?',
  ],
  s0105: [
    'When we reach Stone City, I shall instruct Wang Mao and Cao Jingzong face to face."',
    'When we reach Stone City, I will explain this to Wang Mao and Cao Jingzong in person."',
  ],
  s0106: [
    'South of the Mian he established Xin Ye commandery to gather newly attached people.',
    'South of the Mian River he created Xin Ye commandery to settle new adherents.',
  ],
  s0107: [
    'In the second month of the third year, the Prince of Nankang became Chancellor of State; Gaozu was made General Who Conquers the East and granted one suite of martial music.',
    'In the third year, second month, the Prince of Nankang was made Chancellor of State; Gaozu was appointed General Who Conquers the East and given one suite of martial music.',
  ],
  s0108: [
    'On day wushen, Gaozu departed Xiangyang.',
    'On day wushen, Gaozu set out from Xiangyang.',
  ],
  s0109: [
    'He left his younger brother Wei to hold Xiangyang city and oversee prefectural affairs; his younger brother Dan to hold Lei city; Prefecture Marshal Zhuangqiu Hei to hold Fan city; Merit Officer Shi Qishi to serve additionally as chief administrator; Garrison Commander Huang Sizu of White Horse to serve additionally as marshal; Administrator Du Yong of Shao to serve additionally as aide-de-camp; petty office recorder Guo Yan to manage grain transport.',
    'He left his brother Wei to guard Xiangyang and oversee the prefecture; his brother Dan to hold Lei city; Zhuangqiu Hei, prefecture marshal, to hold Fan city; Shi Qishi, merit officer, to double as chief administrator; Huang Sizu, garrison chief at White Horse, to double as marshal; Du Yong, magistrate of Shao, to double as aide-de-camp; and Guo Yan, petty office recorder, to handle grain transport.',
  ],
  s0110: [
    'He issued a proclamation to the capital, saying:',
    'He sent a proclamation to the capital that read:',
  ],
  s0111: [
    'The Way is not constantly level; times have no eternal transformation; peril and ease follow one another, obscurity and clarity are not one—all must dwell in hardship before flourishing, and draw on many troubles to inaugurate the sage.',
    'The Way is never always smooth; ages never stay unchanged; danger and safety alternate, darkness and light shift—great beginnings rise from hardship, and sages are forged through trial.',
  ],
  s0112: [
    'Thus when the Prince of Changyi rebelled in virtue, Emperor Xiao of Han arose; when Haixi ruled in disorder, Emperor Jianwen ascended—all opened foundations and continued the imperial mandate; reason verifies the former classics, events illuminate past records.',
    'When Prince Changyi turned wicked, Emperor Xuan arose; when Haixi misruled, Emperor Jianwen took the throne—each renewed the dynasty and carried forward Heaven\'s mandate, as the old texts foretold and past annals confirm.',
  ],
  s0113: [
    'The lone tyrant disturbed Heaven\'s constants, destroyed princely virtue; wickedness and licentious excess grew day by day.',
    'This solitary ruler overturned Heaven\'s order and ruined royal virtue; treachery and debauchery deepened with every passing month.',
  ],
  s0114: [
    'He raised cruelty from the years of first shearing; he planted peril from the days of childhood locks.',
    'Even in the years when his hair was first cut, he showed cruelty; from childhood itself he nurtured danger.',
  ],
  s0115: [
    'Suspicion and poisonous malice showed at every turn; violence, perversity, and reckless ruin broke out with every affair.',
    'Suspicion and venom marked every path he took; brutality, perversity, and ruin followed every deed.',
  ],
  s0116: [
    'From when the late emperor\'s illness was announced, a gleeful countenance appeared before all; though the spirit coffin lay in state, he showed no grief, but feasted and made merry beyond the ordinary, wearing strange garments of utmost ostentation.',
    'Once the late emperor\'s illness was announced, joy showed on his face; though the imperial coffin still lay in the hall, he wore no mourning and feasted beyond all measure, dressing in outlandish finery more lavish still.',
  ],
  s0117: [
    'In choosing concubines he made no distinction between sisters; in summoning attendants for hair and toilet, aunt and niece could not be told apart—the rear palace had the name of a marketplace, and palace women wore arms-bearing garb.',
    'He chose consorts without distinguishing sisters from one another; he called in attendants until aunt and niece were indistinguishable—the inner palace became a public market, and palace women went armed like soldiers.',
  ],
  s0118: [
    'At times bodies were exposed naked, undergarments worn upside down, and cutting and chopping performed for amusement.',
    'Sometimes bodies were displayed bare, underclothes worn reversed, and mutilation staged for laughter.',
  ],
  s0119: [
    'He rode unrestrained in lewd abandon, driving people from suburban towns.',
    'He indulged every excess and drove the people from towns beyond the walls.',
  ],
  s0120: [
    'Old and weak drifted like waves; men and women were ground to charcoal.',
    'The aged and weak were swept away like floodwater; men and women were crushed to ruin.',
  ],
  s0121: [
    'Women in labor filled the roads; coffins lined the ways; mothers could not reach to hold their children; sons had no time to weep.',
    'Women giving birth clogged the roads; corpses filled the streets; mothers could not cradle their infants; sons could not pause to mourn.',
  ],
  s0122: [
    'Plunder and abduction continued day after day.',
    'Robbery and kidnapping went on without pause, day into night.',
  ],
  s0123: [
    'He hid by day and roamed by night, never resting.',
    'He lay low by day and prowled by night, never ceasing.',
  ],
  s0124: [
    'Drunken debauchery and riotous noise—singing drunk in alehouse districts.',
    'He drowned himself in wine and riot, singing drunken songs in tavern quarters.',
  ],
  s0125: [
    'He favored and indulged foolish lads and deluded himself with demonic women.',
    'He pampered witless youths and let sorcerous women lead him astray.',
  ],
  s0126: [
    'Mei Chon\'er and Ru Fazhen—base slaves of the lowest sort—monopolized authority, executed the loyal and good, and slaughtered ministers and high officials.',
    'Mei Chon\'er and Ru Fazhen, men of the meanest bond-servant stock, seized all power, cut down the loyal, and butchered ministers and high officials.',
  ],
  s0127: [
    'General Who Guards the Army Liu, honored as maternal uncle, served the state with full loyalty;',
    'General Who Guards the Army Liu, the emperor\'s uncle by marriage, gave the state his whole loyalty;',
  ],
  s0128: [
    'Vice Director Jiang, weighty among outer kin, devoted his utmost in service to the throne;',
    'Vice Director Jiang, a kinsman of weight, served the throne with complete devotion;',
  ],
  s0129: [
    'Army Commander Xiao, kin by marriage, held will to be a pillar of the state;',
    'Army Commander Xiao, related by marriage, meant to stand as a pillar of the realm;',
  ],
  s0130: [
    'Minister of Works Xu and Vice Director Shen—crown of the gentry—were where men\'s hopes gathered.',
    'Minister of Works Xu and Vice Director Shen, foremost among the gentry, were the men to whom all looked.',
  ],
  s0131: [
    'Some bore the lingering feelings of "Wei Yang," some had merit in harmony, some showed loyalty through hardship, some toiled for the royal house—all received the late emperor\'s trust, jointly shared the regent\'s charge, served the departed and attended the living, each exhausting heart and strength.',
    'Some were bound by kinship, some by long service, some by loyalty tested in crisis, some by labor for the throne—all had been entrusted at the deathbed, appointed regents together, and served the dead and the living with all their strength.',
  ],
  s0132: [
    'They should have overflowed with blessings in their years, and fortune descended on their descendants;',
    'They deserved blessings in their own time and glory for their heirs;',
  ],
  s0133: [
    'Yet in a single morning they were ground to dust, not even children spared.',
    'Yet in one morning they were destroyed to the last, not even infants left alive.',
  ],
  s0134: [
    'Men and gods alike nursed grievance; travelers on the road sighed in rage.',
    'Heaven and earth seethed with resentment; wayfarers groaned in fury.',
  ],
  s0135: [
    'Minister Xiao was loyal, capable of public service; his sincerity pierced the hidden and the manifest.',
    'Minister Xiao was loyal and able in public affairs; his devotion reached from the living world to the dead.',
  ],
  s0136: [
    'In past years when bandit rebels roamed, Nan Zheng was pressed to crisis; he drew sword at Flying Spring and alone roused the isolated city.',
    'In earlier years, when raiders threatened Nan Zheng, he seized his blade at Flying Spring and alone held the besieged city firm.',
  ],
  s0137: [
    'When midstream rebellion defied orders and threatened the capital, he plotted within the forbidden precincts, directed the commanders, cut down the whale and crocodile, and cleared our royal measure.',
    'When rebellion rose mid-river and pressed on the capital, he planned within the palace, directed the generals, destroyed the great foe, and restored the royal order.',
  ],
  s0138: [
    'When Cui Huijing\'s strange blade flashed swift and dreadful, troops clashed at the Elephant Gate—armed might lost its spirit, men of righteous courage seized their courage; names were submitted in surrender, house after house raced to join, carrying grain and following like shadows, wise and foolish alike rushing forward.',
    'When Cui Huijing struck with sudden fury and armies met at the palace gate, enemy courage broke and loyal men found theirs; men sent in their names, households rushed to join, grain carriers followed in their tracks, and wise and simple alike hurried to the cause.',
  ],
  s0139: [
    'Again he mustered troops on the Yangtze front, striving without regard for self, rousing loyal followers, lightning-swift against strong foes, destroying the great villain, to firm the imperial foundation.',
    'Again he gathered forces along the Yangtze, risking himself without hesitation, rousing loyal men, falling on strong enemies like lightning, and crushing the arch-villain to secure the throne.',
  ],
  s0140: [
    'His merit exceeded Huan and Wen; his achievement surpassed Yi and Lu.',
    'His service outdid Duke Huan and Duke Wen; his achievement surpassed Yi Yin and Lu Wang.',
  ],
  s0141: [
    'Yet he was toilsome and modest, examining himself; the facts showed his heart\'s path—merit achieved, he withdrew, not seeking glory\'s fullness.',
    'Yet he remained humble and restrained; his deeds revealed his heart—once success was won, he stepped back and asked for no excess of honor.',
  ],
  s0142: [
    'No generous reward was heard of; cruel disaster swiftly arrived—foreknowing the spirits, who was not aggrieved and pained!',
    'No reward came; brutal ruin followed at once—knowing what the spirits foresaw, who did not cry out in injustice and grief!',
  ],
  s0143: [
    'Yet the wicked pack cast off restraint; bees and scorpions nursed poison—they sent Liu Shanyang to drive fugitives, summon desperate men, plot secretly, intending surprise attack.',
    'Yet the villainous faction threw off all restraint; like bees and scorpions they brewed poison—sending Liu Shanyang to stir fugitives, gather outlaws, and plot a secret strike.',
  ],
  s0144: [
    'General of the Right Xiao and General Who Conquers Captives Xiahou—foremost in loyal resolve, righteousness shown on their faces—wondrous plans resounded greatly; at a touch, heads hung; Heaven\'s way punishes excess; their crimes admit no sparing.',
    'General of the Right Xiao and General Who Conquers Captives Xiahou, long steadfast in loyalty, showed justice in their bearing; their bold plans prevailed, and the enemy\'s heads fell at once—Heaven punishes excess, and such guilt cannot be spared.',
  ],
  s0145: [
    'As for violating ritual and teaching, harming transformation and torturing people—compared to shooting at Heaven and pelting the roads, those were still mild; compared to gouging wombs and severing shins, those were not cruel—all the bamboo strips of the commanderies could not record his offenses; all the rabbits of hills and marshes could not inscribe his crimes.',
    'Even his breaches of ritual, corruption of custom, and torture of the people—shooting at Heaven and stoning travelers seem mild beside them; gouging wombs and severing legs seem merciful by comparison—not all the bamboo records of every commandery could list his crimes; not all the brush pens in hill and marsh could write them out.',
  ],
  s0146: [
    'Since primordial chaos, in all records charted and written, no depraved ruler or violent consort has been so extreme.',
    'From the earliest ages to all that history records, no depraved ruler or brutal consort has ever gone so far.',
  ],
  s0147: [
    'Since men and gods lack a master, the altars and grain stand on the brink—the realm within the seas boils, the common folk are swept away; the hundred surnames tremble like deer awaiting the horn-blow; the dark-haired people murmur, with nowhere to set foot.',
    'Men and gods are left without a ruler; the altars teeter on the edge; the realm seethes and the people are uprooted; common folk tremble like deer before the hunt; the living have nowhere to stand.',
  ],
  s0148: [
    'The headquarters bears the former dynasty\'s favor, sharing joy and sorrow alike—above bearing the weight of entrustment, below feeling the pain of kin; how can we lie on kindling and invite fire, sitting and watching collapse!',
    'This command bears the old court\'s trust and shares its weal and woe—charged from above, bound by kinship below—how can we lie on kindling beside the flames and watch the realm fall!',
  ],
  s0149: [
    'The Supreme One descends from High Ancestor, specially showered with tender favor—brightness matching sun and moon, pure spirit shining forth; auspice opened on the sacred tortoise, tokens verified the jade disk; he was made to guard the Shaan-Fan barrier, his transformation flowed to western Xia—all sang his praise, all under Heaven gladly pushed him forward.',
    'The sovereign springs from High Ancestor, singled out for special grace—bright as sun and moon, pure in spirit; omens appeared on the sacred tortoise and the jade token confirmed his mandate; set to guard the western frontier, his virtue spread through the land—all the people sang his praise and pressed him forward.',
  ],
  s0150: [
    'General of the Right Xiao Yingzhao and General Who Conquers Captives Xiahou Xiang together aided and upheld him with one heart—in the old Chu palace, the three spirits brightened anew, the nine provinces renewed; the fortune of rising peace begins here again, the grandeur of "How wholesome!" lies in this day.',
    'General of the Right Xiao Yingzhao and General Who Conquers Captives Xiahou Xiang have upheld him with one heart—in the old palace of Chu the three realms shine again, the nine domains are made new; the age of peace begins once more, and the glory of a well-ruled realm starts today.',
  ],
  s0151: [
    'Yet though imperial virtue is manifest, the realm is not settled; the arch-villain is not removed; the capital still blocks the way.',
    'Yet though the emperor\'s virtue shines, the realm is still unsettled; the chief villain remains; the capital is still obstructed.',
  ],
  s0152: [
    'Looking up to receive the imperial plan, we lead the vanguard and open the road.',
    'Obeying the imperial design, we march at the fore and clear the way.',
  ],
  s0153: [
    'This day we dispatch Champion and Interior Administrator of Jingling Cao Jingzong and twenty other army commanders—fifty thousand with long spears, swift horses in masses, eagle-eyed and striving to be first, dragon-mounting and charging together—marching from Hengjiang straight toward Zhuque.',
    'Today we send Champion Cao Jingzong, interior administrator of Jingling, and twenty army commanders with fifty thousand long spears—swift horses massed, eyes fierce as eagles, banners like dragons— marching from Hengjiang straight at Zhuque Gate.',
  ],
  s0154: [
    'Chief Administrator, Champion General, and Administrator of Xiangyang Wang Mao and thirty army commanders—seventy thousand war boats, riding the current like lightning, pressing the vanguard and holding narrow passes, cutting obliquely toward White City.',
    'Chief Administrator Wang Mao, champion general and administrator of Xiangyang, and thirty army commanders—seventy thousand war boats riding the current like lightning, driving the vanguard and seizing the defiles, angling toward White City.',
  ],
  s0155: [
    'Consulting Officer and Army Commander Xiao Wei and thirty-nine army commanders—great ships with swift oars, charging waves that choked the water, eighty thousand with banners and drums, blazing toward Stone Fort.',
    'Consulting officer and army commander Xiao Wei and thirty-nine commanders—great ships with swift oars, waves crashing until the river choked, eighty thousand banners and drums converging on Stone Fort.',
  ],
  s0156: [
    'Consulting Officer and Army Commander Xiao Dan and forty-two army commanders—warriors bold as bear and pi, a hundred thousand in armor and shields, racing boats along the waves, seizing and holding Xinting.',
    'Consulting officer and army commander Xiao Dan and forty-two commanders—warriors fierce as bear and pi, a hundred thousand in armor and shield, racing along the waves to seize Xinting.',
  ],
  s0157: [
    'Inspector of Yizhou Liu Jilian, Inspector of Liangzhou Liu Yan, Inspector of Sizhou Wang Sengjing, Administrator of Weixing Pei Shuairen, Administrator of Shangyong Wei Rui, Administrator of Xincheng Cui Sengji—all reverently obeying the clear edict, march to execute Heaven\'s punishment.',
    'Liu Jilian, inspector of Yizhou; Liu Yan, inspector of Liangzhou; Wang Sengjing, inspector of Sizhou; Pei Shuairen, administrator of Weixing; Wei Rui, administrator of Shangyong; Cui Sengji, administrator of Xincheng—all reverently obey the imperial command and march to carry out Heaven\'s punishment.',
  ],
  s0158: [
    'Shu and Han troops, sharp and bold, descend along the river;',
    'Shu and Han forces, keen and bold, come down the river;',
  ],
  s0159: [
    'Huai and Ru warriors, fierce and brave, gaze on the waves and race swiftly forward.',
    'Huai and Ru fighters, strong and brave, sight the river and rush forward at speed.',
  ],
  s0160: [
    'The headquarters commands in all a million bold and brave troops—repairing armor and Yan bows, stationing soldiers on Ji horses; gongs shake the ground, drums deafen heaven; frost blades gleam in the sun, vermilion banners and crimson pennons; boats a thousand li, linked in succession advancing.',
    'This command gathers a million fierce warriors—armor polished, Yan bows strung, Ji horses stationed; bronze gongs shake the earth, war drums deafen the sky; frost-bright blades flash in sunlight, crimson banners and pennons blaze; a thousand li of boats advance in endless file.',
  ],
  s0161: [
    'General of the Right Xiao—supreme talent in counsel, combining civil and martial gifts; heroic strategy lofty and far-reaching—holds the balance and rectifies the age.',
    'General of the Right Xiao is a man of supreme counsel, skilled in both civil and military affairs; his vision is bold and far-reaching, and he holds the scales that set the age right.',
  ],
  s0162: [
    'He holds the hosts of southern Jing, supervises armies of the four directions, proclaims and assists the central authority, guards and escorts the imperial carriage.',
    'He commands the forces of southern Jing, directs armies on every side, supports the central power, and guards the imperial carriage.',
  ],
  s0163: [
    'Where his banners point, awe extends without outward limit; dragon-mounting, tiger-striding—all gather at Jianye.',
    'Wherever his banners turn, none can stand against him; dragon and tiger alike converge on Jianye.',
  ],
  s0164: [
    'Drive out the foolish and cunning; restore proper ritual to the Sea-Dulled; clear the divine capital region; sweep and settle the capital realm.',
    'Cast out the wicked and deceitful; restore order to the ruined court; cleanse the sacred capital; sweep the realm clean.',
  ],
  s0165: [
    'It is like Mount Tai collapsing to crush an anthill, like a hanging river released to pour on blazing embers—how could anything not be exterminated!',
    'It is as if Mount Tai were falling on an anthill, as if a hanging river were poured onto burning coals—what could survive such ruin!',
  ],
  s0166: [
    'Now the axe of punishment falls only on Mei Chon\'er and Ru Fazhen.',
    'Now the punitive axe is aimed only at Mei Chon\'er and Ru Fazhen.',
  ],
  s0167: [
    'You all are noble heirs and feathered insignia of the age, merit recorded in the princely house—yet all bow brows to the wicked faction, controlled by brutal power.',
    'You are all noble scions and honored servants, men whose merit is recorded in the royal house—yet you bow to the villainous faction and submit to brutal force.',
  ],
  s0168: [
    'If you can exploit change to achieve merit, turning disaster to blessing—all swearing by the River and Mount, forever granted purple and blue ranks.',
    'If you seize this moment to earn merit and turn disaster into fortune, you may swear by the River and Mount and receive rank and honor for generations.',
  ],
  s0169: [
    'If you cling to delusion without awakening, resist the royal army—when the great host arrives, punishment will know no pardon; as they say, when fire blazes the high plain, orchid and mugwort perish together.',
    'If you persist in error and resist the imperial army, when the host arrives there will be no mercy—as the saying goes, when fire sweeps the high plain, orchid and mugwort burn alike.',
  ],
  s0170: [
    'Strive to seek much blessing; do not bring regret upon yourselves.',
    'Seek your fortune now; do not leave yourselves room for regret.',
  ],
  s0171: [
    'The law of reward and punishment is as clear as white water.',
    'Reward and punishment stand as clear as white water.',
  ],
  s0172: [
    'Gaozu reached Jingling and ordered Chief Administrator Wang Mao and Administrator Cao Jingzong as vanguard; Central Troops Officer Zhang Fa\'an to hold Jingling city.',
    'Gaozu reached Jingling and made Chief Administrator Wang Mao and Administrator Cao Jingzong the vanguard; Central Troops Officer Zhang Fa\'an was left to guard Jingling city.',
  ],
  s0173: [
    'Mao and the others reached Hankou; light troops crossed the river and pressed Ying city.',
    'Mao and his force reached Hankou; light troops crossed the river and pressed on Ying city.',
  ],
  s0174: [
    'Its inspector Zhang Chong set battle lines and held Stone Bridge Ford; the righteous army fought without success, and Army Commander Zhu Sengqi died in the battle.',
    'Inspector Zhang Chong drew up his lines at Stone Bridge Ford; the righteous army fought unsuccessfully, and Army Commander Zhu Sengqi was killed.',
  ],
  s0175: [
    'The generals discussed combining forces to besiege Ying and dividing troops to strike Xiyang and Wuchang.',
    'The generals debated merging the armies to besiege Ying while sending detachments against Xiyang and Wuchang.',
  ],
  s0176: [
    'Gaozu said: "Hankou is less than a li wide; arrow-paths cross from every direction; Fang Sengji holds fast with heavy troops, forming pincers with the people of Ying city.',
    'Gaozu said, "Hankou is less than a li across; arrows can cross from every side; Fang Sengji holds it with a heavy force, pincering Ying city from without.',
  ],
  s0177: [
    'If we advance with the full host, the enemy will certainly cut off our rear; once blocked in a day, regret will come too late.',
    'If we move the whole army forward, the enemy will surely cut our rear; once trapped, regret will come too late.',
  ],
  s0178: [
    'Now I wish to send Wang, Cao, and the other armies across the river to join the Jingzhou army and press the enemy fort.',
    'Now I mean to send Wang, Cao, and the rest across the river to join the Jingzhou force and press the enemy camp.',
  ],
  s0179: [
    'I myself will surround Mount Lu from behind to open the Mian and Han route.',
    'I will myself take Mount Lu from the rear and open the route between the Mian and Han rivers.',
  ],
  s0180: [
    'Grain between Ying city and Jingling will come down in linked boats;',
    'Grain from between Ying city and Jingling will be floated down in convoys;',
  ],
  s0181: [
    'Troops from Jiangling and mid-Xiang will arrive with banners in succession.',
    'Soldiers from Jiangling and the Xiang basin will follow with banners one after another.',
  ],
  s0182: [
    'Once provisions are sufficient and soldiers somewhat numerous, besieging and holding both cities—without attack they will surrender of themselves; the affairs of the realm will be taken while lying down."',
    'Once grain is ample and our numbers grow, we need only hold both cities under siege—they will fall without a fight, and the realm will be ours as if taken at rest."',
  ],
  s0183: [
    'The generals all said, "Well said."',
    'The generals all agreed, "Excellent."',
  ],
  s0184: [
    'He then ordered Wang Mao and Cao Jingzong to lead the host across the shore and advance to encamp at Jiuli.',
    'He then ordered Wang Mao and Cao Jingzong to lead the army across and encamp at Jiuli.',
  ],
  s0185: [
    'That day Zhang Chong came out with troops to meet battle; Mao and the others intercepted and struck, routing them completely—all cast off armor and fled.',
    'That day Zhang Chong came out to fight; Mao and the others intercepted him, broke his force completely, and the enemy threw off their armor and fled.',
  ],
  s0186: [
    'Jingzhou sent Champion General Deng Yuanqi, Army Commander Wang Shixing, Tian An, and several thousand others to join the main army at Xia Shou.',
    'Jingzhou sent Champion General Deng Yuanqi, Army Commander Wang Shixing, Tian An, and several thousand men to join the main force at Xia Shou.',
  ],
  s0187: [
    'Gaozu built Hankou city to hold Mount Lu, and ordered naval commanders Zhang Huishao, Zhu Siyuan, and others to patrol and block the river, cutting communication between Ying and Lu cities.',
    'Gaozu built Hankou city to guard Mount Lu and ordered naval commanders Zhang Huishao and Zhu Siyuan to patrol the river and sever communications between Ying and Lu.',
  ],
  s0188: [
    'In the third month he ordered Yuanqi to advance and hold the western islet of South Hall; Tian An encamped north of the city; Wang Shixing encamped at the old city of Qu Shui.',
    'In the third month he ordered Yuanqi to take the western islet of South Hall; Tian An encamped north of the city; Wang Shixing encamped at the old city of Qu Shui.',
  ],
  s0189: [
    'At this time Zhang Chong died; his troops again raised Army Commander Xue Yuansi and Chong\'s chief administrator Cheng Mao as leaders.',
    'At this point Zhang Chong died; his men again made Army Commander Xue Yuansi and Chong\'s chief administrator Cheng Mao their leaders.',
  ],
  s0190: [
    'On day yisi, the Prince of Nankang ascended the throne at Jiangling, changing the third year of Yongyuan to the first year of Zhongxing, and remotely deposed Dong Hun as Prince of Fuling.',
    'On day yisi the Prince of Nankang took the throne at Jiangling, renamed the third year of Yongyuan as the first year of Zhongxing, and deposed Dong Hun from afar as Prince of Fuling.',
  ],
  s0191: [
    'Gaozu was made Left Vice Director of the Masters of Writing, additionally Great General Who Conquers the East and Commander of all punitive military affairs, granted the yellow battle-axe.',
    'Gaozu was appointed Left Vice Director of the Masters of Writing, additionally made Great General Who Conquers the East and commander of all punitive forces, and granted the yellow battle-axe.',
  ],
  s0192: [
    'The Western Secretariat also sent Champion General Xiao Yingda to lead troops and join the army.',
    'The Western Secretariat also sent Champion General Xiao Yingda with troops to join the campaign.',
  ],
  s0193: [
    'That same day, Yuansi\'s Army Commander Shen Nandang led several thousand light boats, coming to fight in the confused current; Zhang Huishao and others struck and broke them, capturing all.',
    'That same day Yuansi\'s commander Shen Nandang led several thousand light boats into the swirling current to fight; Zhang Huishao and the others defeated them and took every man.',
  ],
  s0194: [
    'In the fourth month Gaozu exited the Mian and ordered Wang Mao, Xiao Yingda, and others to advance and press Ying city.',
    'In the fourth month Gaozu moved out along the Mian and ordered Wang Mao, Xiao Yingda, and the rest to advance against Ying city.',
  ],
  s0195: [
    'Yuansi was quite worn from battle and therefore dared not come out.',
    'Yuansi was exhausted by fighting and no longer dared to sally forth.',
  ],
  s0196: [
    'The generals wished to attack; Gaozu did not permit it.',
    'The generals wanted to assault the city; Gaozu refused.',
  ],
  s0197: [
    'In the fifth month Dong Hun sent Pacification North General Wu Ziyang, Army Commander Guang Zijin, and thirteen armies to relieve Yingzhou, advancing to hold Bako.',
    'In the fifth month Dong Hun sent Pacification North General Wu Ziyang, Army Commander Guang Zijin, and thirteen armies to rescue Yingzhou, advancing to occupy Bako.',
  ],
  s0198: [
    'In the sixth month the Western Secretariat sent Chamberlain Xi Chanwen to comfort the army, bearing deliberations from Xiao Yingzhao and others, saying to Gaozu: "Now with troops halted on both banks, not combining forces to besiege Ying, securing Xiyang and Wuchang, and taking Jiangzhou—this opportunity is already lost;',
    'In the sixth month the Western Secretariat sent Chamberlain Xi Chanwen to visit the army with a proposal from Xiao Yingzhao and others, telling Gaozu, "With troops halted on both banks, failing to combine forces, besiege Ying, secure Xiyang and Wuchang, and seize Jiangzhou—that chance is already gone;',
  ],
  s0199: [
    'better to seek aid from Wei and join in alliance with the north—that would still be the superior plan."',
    'better to ask Wei for help and ally with the north—that would still be the best course."',
  ],
  s0200: [
    'Gaozu said to Chanwen: "Hankou\'s routes connect Jing and Yong, control and draw on Qin and Liang; grain transport and supplies depend on its breath—therefore we press troops on Hankou, linking several provinces.',
    'Gaozu told Chanwen, "Hankou links Jing and Yong, controls Qin and Liang, and holds the lifeline of grain and supplies—that is why we press the army on Hankou and tie several provinces together.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_001_b2.mjs <translation.json>'
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
