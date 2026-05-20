#!/usr/bin/env python3
"""Apply Jinshu chapter 107 batch-2 translations (s0102–s0201) to current_translation_jinshu.json."""

import json
from pathlib import Path

T = [
    (
        "s0102",
        "Grand Minister of Agriculture Cao Mo did not affix his signature; Jilong sent Zhang Chao to ask him the reason.",
        "When Grand Minister of Agriculture Cao Mo withheld his signature, Shi Hu—Jilong—dispatched Zhang Chao to demand an explanation.",
    ),
    (
        "s0103",
        "Mo knocked his head on the ground and said: \"The enterprise of All-under-Heaven is weighty; it is not fitting to establish the young; therefore I dare not sign.\"",
        "Cao Mo kowtowed and answered, \"The realm is too heavy a burden to lay on a child—that is why I could not put my name to the deed.\"",
    ),
    (
        "s0104",
        "\" Jilong said: \"Mo is a loyal subject, yet he has not grasped Our intention.\"",
        "Shi Hu replied, \"Cao Mo is a faithful minister; he simply does not see what I mean.\"",
    ),
    (
        "s0105",
        "Zhang Ju and Li Nong know Our mind; order them to explain it to him.\"",
        "\"Zhang Ju and Li Nong already understand my purpose—have them make it clear to him.\"",
    ),
    (
        "s0106",
        "\" Thereupon he established Shi as heir apparent and the Liu clan woman as empress.",
        "He then named Shi Shi crown prince and invested Lady Liu as empress.",
    ),
    (
        "s0107",
        "Jilong summoned Grand Master of Ceremonies Tiao You and Superintendent of the Household Du Gu and said to them: \"We trouble you two to tutor the heir; We truly hope for a change of course; as for Our entrusting this matter to you, you ought to understand it clearly.\"",
        "Shi Hu called in Tiao You, grand master of ceremonies, and Du Gu, superintendent of the household, and told them, \"I ask you to instruct the heir and truly wish him to mend his ways; what I am handing you, you must take to heart.\"",
    ),
    (
        "s0108",
        "\" He appointed You grand tutor and Gu junior tutor.",
        "He named Tiao You grand tutor and Du Gu junior tutor to the heir.",
    ),
    (
        "s0109",
        "When at that time Jilong's illness had abated, he usurped the imperial title at the southern suburb, granted a general amnesty within the borders, and established the era name Great Tranquility.",
        "Once Shi Hu had rallied from his sickness, he arrogated the throne at the southern suburban altar, proclaimed an empire-wide amnesty, and adopted the reign title Tauning.",
    ),
    (
        "s0110",
        "All officials had their positions raised one grade; his various sons were advanced in noble rank to princes of commanderies.",
        "Every minister gained a step in rank, and his sons were promoted to princes of commanderies.",
    ),
    (
        "s0111",
        "He appointed Masters-of-Writing Zhang Liang as right vice-director.",
        "Zhang Liang of the secretariat was made right vice-director.",
    ),
    (
        "s0112",
        "Former eastern-palace degraded soldiers called the Gao Li, more than ten thousand men, were due to be garrisoned in Liangzhou; en route they reached Yongcheng; they were not within the categories of amnesty, and moreover an edict ordered Yongzhou Governor Zhang Mao to escort them on.",
        "Over ten thousand demoted eastern-palace toughs known as the Gao Li were bound for Liangzhou; when they reached Yongcheng they fell outside the amnesty, and the throne ordered Governor Zhang Mao to march them onward.",
    ),
    (
        "s0113",
        "Mao seized all their horses, ordered them to go on foot pushing deer carts, and had grain delivered to the garrison place.",
        "Zhang Mao confiscated their mounts and made them haul supplies on foot in handcarts all the way to the posting.",
    ),
    (
        "s0114",
        "Gao Li supervisor Liang Du of Dingyang and others nursed the resentment boiling in every breast, plotted to raise troops and return east, secretly ordered the Hu man Xiedulu to hint to the garrison men, and the garrison men all leaped, clapped, and shouted.",
        "Their overseer Liang Du of Dingyang and his comrades, burning with the men's grievances, plotted an eastern mutiny; Xiedulu quietly tipped off the conscripts, who burst into cheers and stamped their approval.",
    ),
    (
        "s0115",
        "Liang Du then styled himself Jin's General Who Conquers the East, led the host to storm and take Xiabian, compelled Zhang Mao to become grand commander-in-chief and grand marshal, and conveyed him in a light carriage.",
        "Liang Du declared himself Jin's eastern-expedition commander, seized Xiabian, forced Zhang Mao to take the titles of grand commander and grand marshal, and paraded him in an open coach.",
    ),
    (
        "s0116",
        "Anxi Liu Ning struck them from Anding and was greatly defeated and returned.",
        "Liu Ning, the western pacifier, attacked from Anding and limped back in rout.",
    ),
    (
        "s0117",
        "Between Qin and Yong no city garrison failed to be shattered; they beheaded administrators of two-thousand-shi salary rank and drove straight east.",
        "Fort after fort between Qin and Yong fell; they slew salary-rank governors and swept eastward without pause.",
    ),
    (
        "s0118",
        "The Gao Li and their like were all strong of arm and skilled at archery; one man matched more than ten; though they lacked armor and weapons, wherever they went they plundered the common people's great axes, fitted shafts of one zhang, fought as if divine, and wherever they aimed lines collapsed; garrison troops all followed them; by the time they reached Chang'an, the host already numbered one hundred thousand.",
        "Those Gao Li fighters were archers and brawlers who could each hold off a dozen men; unarmed, they seized farmers' broadaxes, mounted them on ten-foot helves, and swept through defenses like spirits until every garrison joined them—by Chang'an their horde had swollen to a hundred thousand.",
    ),
    (
        "s0119",
        "Prince of Leping Shi Bao at that time was stationed at Chang'an; he committed his sharpest troops to resisting them and was defeated in one battle.",
        "Shi Bao, prince of Leping, held Chang'an and threw his best troops against the rebels, only to lose at the first clash.",
    ),
    (
        "s0120",
        "Liang Du then went east out of Tong Pass and advanced toward the Luochuan region.",
        "Liang Du broke east through Tong Pass and rolled on toward the Luoyang basin.",
    ),
    (
        "s0121",
        "Jilong appointed Li Nong as grand commander-in-chief, acting grand general's duties, commanding guards-army Zhang Hedu, western campaign Zhang Liang, captive-quelling Shi Min, and others, and led one hundred thousand infantry and horse to punish them.",
        "Shi Hu named Li Nong commander-in-chief with plenipotentiary general's powers, put Zhang Hedu, Zhang Liang, Shi Min, and others under him, and sent a hundred thousand horse and foot to crush the rising.",
    ),
    (
        "s0122",
        "They fought at Xin'an; Li Nong's army fared ill.",
        "Battle joined at Xin'an, and Li Nong's line buckled.",
    ),
    (
        "s0123",
        "Again they fought at Luoyang; Li Nong's army was again defeated; thereupon he withdrew and fortified at Chenggao.",
        "A second clash at Luoyang broke him again, so he pulled back and dug in at Chenggao.",
    ),
    (
        "s0124",
        "Liang Du raided east through Xingyang, Chenliu, and the various commanderies; Jilong was greatly afraid; he appointed Prince of Yan Shi Bin as grand commander-in-chief of all military affairs within and without, led ten thousand picked cavalry, commanded Yao Yizhong, Fu Hong, and others, and struck Liang Du east of Xingyang, greatly defeated him, beheaded Liang Du and returned, punished his remaining faction, and utterly extinguished them.",
        "As Liang Du pillaged Xingyang and Chenliu, Shi Hu panicked; he gave Shi Bin, prince of Yan, supreme command, ten thousand elite riders, and lieutenants Yao Yizhong and Fu Hong, shattered Liang Du east of Xingyang, brought back his head, and extirpated the rest of his party.",
    ),
    (
        "s0125",
        "Before long Jin general Wang Kan captured their Pei commandery.",
        "Soon afterward Jin's Wang Kan ripped Pei commandery from Zhao hands.",
    ),
    (
        "s0126",
        "A man of Shiping, Ma Xu, raised troops at Luoshi Ge Valley and styled himself general.",
        "Ma Xu of Shiping rose in Luoshi Ge Valley and proclaimed himself a general.",
    ),
    (
        "s0127",
        "Shi Bao attacked and destroyed him, executing more than three thousand households.",
        "Shi Bao stamped out the band and put over three thousand households to the sword.",
    ),
    (
        "s0128",
        "At that time Mars encroached on the Pile of Corpses asterism, also encroached on Mao and the moon, and Mars went north to encroach on River Drum.",
        "Heaven sent Mars across the Pile of Corpses, across the Pleiades and the moon, and north toward the River Drum stars—a grim sky.",
    ),
    (
        "s0129",
        "Before long Jilong's illness was severe; he appointed Shi Zun as grand general guarding the land west of the passes, Shi Bin as chancellor and recorder of Masters-of-Writing affairs, Zhang Chao as grand general who guards the realm, commanding-general of the army, and minister of personnel, all receiving testamentary mandate to assist rule.",
        "Shi Hu soon sank mortally ill; he named Shi Zun grand general for the Guanzhong west, Shi Bin chancellor with custody of the secretariat, and Zhang Chao capital guardian, army commander, and personnel minister—each charged by deathbed edict to steer the state.",
    ),
    (
        "s0130",
        "Lady Liu feared that if Bin assisted rule he would harm Shi; she plotted with Zhang Chao to execute him.",
        "Empress Liu feared Shi Bin as regent would murder young Shi Shi; she conspired with Zhang Chao to kill him first.",
    ),
    (
        "s0131",
        "Bin was at Xiangguo; she then sent an envoy falsely telling Bin: \"The sovereign's ailment has gradually lessened; if the king needs hunting, he may pause a little.\"",
        "Shi Bin was in Xiangguo; she sent a messenger with a lie: \"The emperor is mending; if you mean to hunt, you may linger awhile.\"",
    ),
    (
        "s0132",
        "Bin by nature loved wine and was addicted to hunting; thereupon he roamed hunting and drank without restraint.",
        "Shi Bin loved wine and the chase; he gave himself to hunts and drinking binges.",
    ),
    (
        "s0133",
        "Lady Liu forged orders saying Bin lacked loyal and filial heart, dismissed Bin from office, ordered him as a prince to return to his mansion, and sent Zhang Chao's brother Zhang Xiong leading five hundred Dragon Surge troops to guard him.",
        "She forged an edict accusing Shi Bin of disloyalty, stripped his offices, sent the prince home under house arrest, and posted Zhang Xiong with five hundred Dragon Surge guards.",
    ),
    (
        "s0134",
        "Shi Zun came from Youzhou to Ye; he was ordered to receive appointment at the court hall, was allotted thirty thousand palace guards and dispatched; Zun wept bitterly and departed.",
        "Shi Zun rode from Youzhou to Ye, was made to take his commission in open court, handed thirty thousand household troops, and sent away weeping.",
    ),
    (
        "s0135",
        "That day Jilong's illness slightly abated; he asked: \"Has Zun arrived?\"",
        "That same day Shi Hu briefly rallied and asked, \"Has Shi Zun come?\"",
    ),
    (
        "s0136",
        "\" Those at his side answered that long ago he had already gone.",
        "His attendants said he had left long since.",
    ),
    (
        "s0137",
        "Jilong said: \"We regret not having seen him.\"",
        "Shi Hu murmured, \"How I wish I could have seen him.\"",
    ),
    (
        "s0138",
        "\" Jilong attended at the western gallery; more than two hundred Dragon Surge generals and gentlemen-of-the-household lined up and bowed before him.",
        "He received them at the western gallery, where over two hundred Dragon Surge officers and household gentlemen bowed in ranks.",
    ),
    (
        "s0139",
        "Jilong said: \"What do you seek?\"",
        "\"What do you want of me?\" he asked.",
    ),
    (
        "s0140",
        "\" They all said the sacred person was unwell; Yan Wang ought to enter to guard overnight and command troops and horses; some begged to become crown prince.",
        "They pleaded that the sovereign was failing and the prince of Yan should enter to command the guard; others clamored to be named heir.",
    ),
    (
        "s0141",
        "Jilong did not know Bin had been dismissed; he rebuked them, saying: \"Is not the Prince of Yan within?\"",
        "Unaware Shi Bin had been cashiered, Shi Hu snapped, \"Is not the prince of Yan already inside?\"",
    ),
    (
        "s0142",
        "Call him here!\"",
        "\"Summon him at once!\"",
    ),
    (
        "s0143",
        "\" Those at his side said the king was ill from wine and could not enter.",
        "They answered that the prince was drunk-sick and could not come.",
    ),
    (
        "s0144",
        "Jilong said: \"Hurry—take a palanquin to welcome him; We shall hand him the seals and cords.\"",
        "\"Send a litter—quickly,\" Shi Hu ordered. \"I will give him the seals myself.\"",
    ),
    (
        "s0145",
        "\" Yet in the end none went.",
        "No one moved to obey.",
    ),
    (
        "s0146",
        "Shortly he entered in dizziness.",
        "Moments later he collapsed into a stupor.",
    ),
    (
        "s0147",
        "Zhang Chao had his brother Xiong and others forge Jilong's order to kill Bin; Lady Liu again forged orders appointing Zhang Chao grand guardian, commander-in-chief of all armies within and without, recorder of Masters-of-Writing affairs, adding a thousand infantry and hundred horse in guard, entirely according to the precedent of Huo Guang assisting Han.",
        "Zhang Chao's brother Xiong forged an order executing Shi Bin; Liu forged another elevating Zhang Chao to grand guardian, supreme commander, and secretariat overseer with a thousand foot and a hundred horse—aping Huo Guang's regency over Han.",
    ),
    (
        "s0148",
        "Attendant-in-chief Xu Tong sighed: \"Calamity is about to arise; I will not put myself among those who prepare for it beforehand.\"",
        "Palace attendant Xu Tong groaned, \"The storm is coming—I want no part of the schemes ahead.\"",
    ),
    (
        "s0149",
        "\" Thereupon he drank poison and died.",
        "He swallowed poison and died.",
    ),
    (
        "s0150",
        "Before long Jilong also died.",
        "Soon Shi Hu followed him to the grave.",
    ),
    (
        "s0151",
        "Jilong had begun by usurping the throne; reaching this point, altogether he had occupied the throne fifteen years.",
        "From his seizure of the throne to this hour Shi Hu had reigned fifteen years.",
    ),
    (
        "s0152",
        "Shi Shi.",
        "Section heading: the boy emperor Shi Shi.",
    ),
    (
        "s0153",
        "Thereupon Shi succeeded to the false throne, honored Lady Liu as empress dowager with court regency, and advanced Zhang Chao to chancellor.",
        "Shi Shi mounted the puppet throne, raised Lady Liu to ruling empress dowager, and made Zhang Chao chancellor.",
    ),
    (
        "s0154",
        "Zhang Chao requested Shi Zun and Shi Jian as left and right chancellors to soothe their hearts; Lady Liu followed this.",
        "Zhang Chao named Shi Zun and Shi Jian left and right chancellors to buy their loyalty; Liu agreed.",
    ),
    (
        "s0155",
        "Zhang Chao plotted with Zhang Ju to kill Li Nong, but Zhang Ju was on good terms with Li Nong and informed Li Nong of Zhang Chao's plot.",
        "Zhang Chao and Zhang Ju planned Li Nong's murder, yet Zhang Ju, Li Nong's friend, leaked the plot.",
    ),
    (
        "s0156",
        "Li Nong feared, led more than a hundred horsemen and fled to Guangzong, and led several tens of thousands of Qiehuo households to hold Shangbai.",
        "Terrified, Li Nong galloped to Guangzong with a hundred riders and rallied tens of thousands of Qiehuo refugee families on Mount Shangbai.",
    ),
    (
        "s0157",
        "Lady Liu sent Zhang Ju and others to command elite palace-guard troops to besiege them.",
        "Lady Liu dispatched Zhang Ju with the household elite to invest the mountain.",
    ),
    (
        "s0158",
        "Zhang Chao appointed Zhang Li as grand general who stabilizes the army, overseer of all military affairs within and without, metropolitan governor, as his own deputy.",
        "Zhang Chao made Zhang Li army-stabilizing commander, overseer of all forces, metropolitan governor, and his second-in-command.",
    ),
    (
        "s0159",
        "In Ye bandits arose in great numbers, repeatedly raiding one another.",
        "Ye erupted in robbery as gangs preyed on one another.",
    ),
    (
        "s0160",
        "When Shi Zun heard of Jilong's death, he encamped at Henei.",
        "Learning of Shi Hu's death, Shi Zun halted his army at Henei.",
    ),
    (
        "s0161",
        "Yao Yizhong, Fu Hong, Shi Min, Liu Ning, and martial guard Wang Luan, western pacification Wang Wu, Shi Rong, Wang Tie, righteous-establishment general Duan Qin and others, having pacified Qin and Luo, rotated the army home, met Zun at Licheng, and urged Zun, saying: \"Your Highness is eldest and worthy; the late emperor also had intentions toward Your Highness.",
        "Yao Yizhong, Fu Hong, Shi Min, Liu Ning, Wang Luan of the martial guard, Wang Wu of western pacification, Shi Rong, Wang Tie, Duan Qin the righteous-establishment general, and the rest—fresh from pacifying Qin and Luoyang—ran into Shi Zun at Licheng and pleaded, \"You are the eldest worthy prince; the late emperor already favored you.",
    ),
    (
        "s0162",
        "Only because in his closing years he was muddled and deluded was he misled by Zhang Chao.",
        "Only his final confusion let Zhang Chao lead him astray.\"",
    ),
    (
        "s0163",
        "Now Shangbai still stalemates unconquered; the capital's palace guard stands empty; if we proclaim Zhang Chao's crimes and march with drums beating to punish him, who would not turn halberds and open gates to welcome Your Highness!\"",
        "Shangbai still holds out and the capital guard is hollow—denounce Zhang Chao and march in formation, and every soldier will drop his weapon and throw open the gates for you!\"",
    ),
    (
        "s0164",
        "Zun followed this.",
        "Shi Zun took their counsel.",
    ),
    (
        "s0165",
        "Luozhou Governor Liu Guo and others also led Luoyang's host and arrived at Licheng.",
        "Liu Guo, governor of Luozhou, marched the Luoyang garrison to join them at Licheng.",
    ),
    (
        "s0166",
        "When Zun's proclamation reached Ye, Zhang Chao was greatly afraid and urgently recalled the army at Shangbai.",
        "Zhang Chao panicked when Shi Zun's manifesto hit Ye and frantically pulled the Shangbai siege army home.",
    ),
    (
        "s0167",
        "Zun halted at Dangyin; field troops numbered ninety thousand; Shi Min was vanguard.",
        "Shi Zun camped at Dangyin with ninety thousand veterans and Shi Min spearheading the column.",
    ),
    (
        "s0168",
        "When Zhang Chao was about to go out to resist them, the elderly Jie warriors all said: \"The Son of Heaven's son has come to mourn the funeral; we ought to go out to welcome him; we cannot be wall-and-garrison men for Zhang Chao.\"",
        "As Zhang Chao prepared to meet them in the field, gray-haired Jie soldiers shouted, \"The emperor's son rides to bury his father—we should welcome him, not man Zhang Chao's ramparts.\"",
    ),
    (
        "s0169",
        "\" They climbed over the walls and went out; Zhang Chao executed them but could not stop it.",
        "They scaled the walls to desert; Zhang Chao slaughtered them but could not stem the tide.",
    ),
    (
        "s0170",
        "Zhang Li led two thousand Dragon Surge troops to cut through the barrier and welcome Zun.",
        "Zhang Li smashed a gate with two thousand Dragon Surge troops and ushered Shi Zun inside.",
    ),
    (
        "s0171",
        "Lady Liu feared, led Zhang Chao in, and wept miserably to him, saying: \"The late emperor's catafalque has not yet been buried, yet disasters multiply and arise.",
        "Terror-stricken, Lady Liu drew Zhang Chao in and sobbed, \"The late ruler still lies unburied while calamities pile up.",
    ),
    (
        "s0172",
        "Now the imperial heir is young and tender; We entrust him to you, general—how will you rescue and aid?\"",
        "The boy on the throne is helpless—I lean on you, general—how will you save us?\"",
    ),
    (
        "s0173",
        "Add Zun high office—can it quell this?\"",
        "Would stacking honors on Shi Zun quiet this storm?\"",
    ),
    (
        "s0174",
        "\" Zhang Chao was panic-stricken and lost his guard, had no further schemes, and only said yes-yes.",
        "Zhang Chao went blank with fright, offered no plan, and muttered empty assent.",
    ),
    (
        "s0175",
        "Lady Liu ordered Zun appointed chancellor, concurrently grand marshal, grand commander-in-chief of all armies within and without, recorder of Masters-of-Writing affairs, adding golden battle-axe and nine bestowals, increasing fief by ten commanderies, entrusting him with the burden of prime minister like Yi Yin.",
        "She ordered Shi Zun made chancellor, grand marshal, supreme commander, secretariat overseer, golden-axe bearer, nine-insignia recipient, and holder of ten added commanderies—the full weight of chief minister.",
    ),
    (
        "s0176",
        "When Zun reached Anyang pavilion, Zhang Chao feared and came out to welcome him; Zun ordered him seized.",
        "At Anyang pavilion Zhang Chao crept out to greet Shi Zun, who had him arrested on the spot.",
    ),
    (
        "s0177",
        "Thereupon they donned armor and displayed weapons, entered by Fengyang Gate, ascended the Grand Martial front hall, beat their breasts and stamped in full mourning, then withdrew to the eastern gallery.",
        "Armored and banners blazing, they entered through Fengyang Gate, climbed the Grand Martial hall to keen and drum their grief, then retired to the eastern wing.",
    ),
    (
        "s0178",
        "Zhang Chao was beheaded at Pingle market; his three clans were exterminated.",
        "Zhang Chao died on Pingle market scaffold, his three kinships extirpated.",
    ),
    (
        "s0179",
        "Forging Lady Liu's order it said: \"The heir is young and tender; he was appointed by the late emperor's private favor; the imperial enterprise is supremely weighty—not what he can bear.",
        "A forged rescript in Liu's voice read, \"The boy was enthroned by a father's whim; the mandate is too vast for him.",
    ),
    (
        "s0180",
        "Let Zun succeed to the throne.\"",
        "Let Shi Zun inherit the throne.\"",
    ),
    (
        "s0181",
        "Zun falsely declined reaching thrice; the ministers urgently urged; then he accepted, usurped the supreme title at the Grand Martial front hall, granted general amnesty short of capital crimes, and lifted the siege of Shangbai.",
        "Shi Zun thrice refused the crown until his ministers pressed him; then he seized the throne in the Grand Martial hall, amnested all but capital crimes, and raised the siege of Shangbai.",
    ),
    (
        "s0182",
        "He enfeoffed Shi as Prince of Qiao with ten thousand households and treated him with the rites due one who is not a subject; he demoted Lady Liu to senior consort; before long both were killed.",
        "He made Shi Shi prince of Qiao with a ten-thousand-household fief yet honored him like a peer, reduced Lady Liu to senior consort, and soon murdered them both.",
    ),
    (
        "s0183",
        "Shi had altogether occupied the position thirty-three days.",
        "Shi Shi had ruled thirty-three days in all.",
    ),
    (
        "s0184",
        "Shi Zun.",
        "Section heading: Shi Zun.",
    ),
    (
        "s0185",
        "Thereupon Li Nong returned to ask forgiveness; Zun restored his position and treated him as at first.",
        "Li Nong came back to plead guilt; Shi Zun restored his offices and favored him as before.",
    ),
    (
        "s0186",
        "He honored his mother Lady Zheng as empress dowager, his wife Lady Zhang as empress, appointed Shi Bin's son Yan as crown prince, Shi Jian as attendant-in-chief, Shi Chong as grand guardian, Shi Bao as grand marshal, Shi Kun as grand general, Shi Min as overseer of all military affairs within and without, grand general who aids the state, recorder of Masters-of-Writing affairs, assisting rule.",
        "He raised Lady Zheng to empress dowager, Lady Zhang to empress, named Shi Yan—Shi Bin's son—heir apparent, Shi Jian palace attendant, Shi Chong grand guardian, Shi Bao grand marshal, Shi Kun commander-in-chief, and Shi Min supreme military overseer, state-aiding grand general, and secretariat regent.",
    ),
    (
        "s0187",
        "A violent wind uprooted trees; shaking thunder; hail fell as large as bowls and sheng-measures.",
        "Gales tore up timber, thunder cracked, and hailstones wide as bowls hammered the capital.",
    ),
    (
        "s0188",
        "Grand Martial and Huihua halls suffered fire disaster; gates, towers, and galleries were swept bare; of imperial carriages and wardrobe those burned were more than half; light and flame illumined heaven; metal and stone were all consumed; the fire after more than a month then died.",
        "Flames gutted the Grand Martial and Huihua halls, stripped gates and belvederes bare, and consumed more than half the chariots and robes—molten metal glared skyward for over a month before the blaze died.",
    ),
    (
        "s0189",
        "Blood rain fell everywhere throughout Ye city.",
        "Rain the color of blood drenched every ward of Ye.",
    ),
    (
        "s0190",
        "Shi Chong at that time was stationed at Ji; hearing Zun had killed Shi and established himself, he said to his staff and aides: \"Shi received the late emperor's mandate; Zun abruptly deposed and killed him—the crime of rebellion is greatest; order inner and outer to tighten armor; I myself will personally punish him.\"",
        "Shi Chong held Ji when news came that Shi Zun had murdered Shi Shi and seized power; he told his advisers, \"The boy bore the late emperor's charge—Shi Zun slew him by treason; seal the passes—I march myself to punish him.\"",
    ),
    (
        "s0191",
        "\" Thereupon he left northern pacification Mu Jian to garrison Youzhou, led a host of fifty thousand, from Ji punished Zun, transmitted proclamations through Yan and Zhao; wherever they went clouds gathered; by the time they reached Changshan, the host exceeded one hundred thousand.",
        "He left Mu Jian of northern pacification to hold Youzhou, took fifty thousand men from Ji, broadcast manifestos across Yan and Zhao until recruits swarmed in—beyond Changshan his army topped a hundred thousand.",
    ),
    (
        "s0192",
        "He halted at Yuanxiang; encountering Zun's amnesty edict, he said to those at his side: \"My younger brother and I are one; the dead cannot be pursued back—why again mutually injure one another!",
        "Camped at Yuanxiang, he read Shi Zun's pardon and mused aloud, \"He is still my brother—the dead cannot return; why cut one another down again?",
    ),
    (
        "s0193",
        "I shall return.\"",
        "I am going home.\"",
    ),
    (
        "s0194",
        "\" His general Chen Xian advanced saying: \"The prince of Pengcheng usurped and murdered to honor himself—the crime is great.",
        "General Chen Xian cut in, \"The prince of Pengcheng murdered his way to the throne—the guilt is monstrous.",
    ),
    (
        "s0195",
        "Though Your Highness turns the banner north, your servant will turn the axle south, pacify the capital, capture the prince of Pengcheng, then welcome the great chariot.\"",
        "You may wheel north, my lord, but I will drive south, seize the capital, cage the prince of Pengcheng, and only then escort your majesty home.\"",
    ),
    (
        "s0196",
        "\" Chong followed this.",
        "Shi Chong agreed.",
    ),
    (
        "s0197",
        "Zun urgently sent Wang Zhuo with a letter to enlighten Chong; Chong did not listen.",
        "Shi Zun raced Wang Zhuo ahead with a letter dissuading Shi Chong, who ignored it.",
    ),
    (
        "s0198",
        "Zun lent Shi Min the yellow battle-axe and golden cymbals; together with Li Nong and others he led one hundred thousand elite troops to punish him.",
        "Shi Zun handed Shi Min the yellow axe and golden bells; with Li Nong and others he marched one hundred thousand picked troops against the rebel.",
    ),
    (
        "s0199",
        "They fought at Pingji; Chong's army was greatly defeated; Chong was captured at Yuanshi, granted death, and more than thirty thousand of his soldiers were buried alive in pits.",
        "At Pingji Shi Chong's host shattered; taken at Yuanshi he was forced to kill himself, and thirty thousand of his men were buried alive in mass graves.",
    ),
    (
        "s0200",
        "They began burying Jilong; his tomb was titled Manifest Plain Mound; false posthumous title Martial Emperor; temple name Taizu.",
        "They laid Shi Hu to rest on Manifest Plain tumulus, posthumously dubbing him Martial Emperor with temple name Taizu.",
    ),
    (
        "s0201",
        "Zun's Yangzhou Governor Wang Jie brought Huainan to allegiance in surrender.",
        "Shi Zun's Yangzhou governor Wang Jie delivered Huainan to Jin in submission.",
    ),
]


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    path = root / "translations" / "current_translation_jinshu.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    by_id = {sid: (lit, idio) for sid, lit, idio in T}
    for s in data["sentences"]:
        if s["id"] in by_id:
            lit, idio = by_id[s["id"]]
            s["literal"] = lit
            s["idiomatic"] = idio
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("updated", len(T), "sentences")


if __name__ == "__main__":
    main()
