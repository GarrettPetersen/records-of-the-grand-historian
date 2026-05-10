#!/usr/bin/env python3
"""Apply Jinshu chapter 107 batch-3 translations (s0202–s0301) to current_translation_jinshu.json."""

import json
from pathlib import Path

T = [
    (
        "s0202",
        "Jin's General of the Household for the West Chen Kui advanced and occupied Shouchun.",
        "Chen Kui, Jin's western palace general, marched into Shouchun and seized it.",
    ),
    (
        "s0203",
        "General Who Conquers the North Chu Pou led troops against Shi Zun and halted at Xiapi; Zun appointed Li Nong grand commander-in-chief for the southern expedition and sent twenty thousand horsemen to oppose him.",
        "Chu Pou, commanding Jin's northern expedition, struck toward Shi Zun and stopped at Xiapi; Zun gave Li Nong the southern front with twenty thousand horse to hold the line.",
    ),
    (
        "s0204",
        "Pou could not advance; he withdrew and encamped at Guangling.",
        "Chu Pou failed to push forward and fell back to Guangling.",
    ),
    (
        "s0205",
        "When Chen Kui heard this he became afraid; he then burned the accumulated stores at Shouchun, tore down the walls, and withdrew.",
        "Chen Kui panicked at the news, torched the Shouchun granaries, demolished the ramparts, and retreated.",
    ),
    (
        "s0206",
        "Shi Bao was then stationed at Chang'an and plotted to lead the armies of Guanzhong against Ye; left chief clerk Shi Guang, marshal Cao Yao, and others repeatedly remonstrated.",
        "Shi Bao held Chang'an and planned to march all Guanzhong on Ye; his chief clerk Shi Guang and marshal Cao Yao pleaded in vain against the venture.",
    ),
    (
        "s0207",
        "Bao grew furious and executed Guang and more than a hundred others.",
        "In his rage Shi Bao put Shi Guang and over a hundred men to the sword.",
    ),
    (
        "s0208",
        "Bao was greedy by nature and devoid of strategy; the magnates of Yongzhou knew he would accomplish nothing and jointly sent envoys to inform Jin's governor of Liangzhou, Sima Xun.",
        "Shi Bao was grasping and witless; Yongzhou's leading families saw no hope in him and messaged Jin's Liangzhou governor Sima Xun.",
    ),
    (
        "s0209",
        "Xun therefore led his forces to join them, fortified at Xuangu over two hundred li from Chang'an, and ordered his aide Liu Huan to attack the governor of Jingzhao, Liu Xiuli, whom he beheaded.",
        "Sima Xun marched to their aid, dug in at Xuangu two hundred-odd li from Chang'an, and sent Liu Huan against Liu Xiuli of Jingzhao—who lost his head.",
    ),
    (
        "s0210",
        "Throughout the Three Adjuncts the powerful gentry slew many of their magistrates, held more than thirty fortified camps, and rallied fifty thousand men to answer Xun.",
        "Across the Three Adjuncts notables killed their officials, holed up in thirty-odd stockades, and raised fifty thousand fighters for Sima Xun.",
    ),
    (
        "s0211",
        "Bao abandoned the plan to strike Ye and ordered Ma Qiu, Yao Guo, and others to lead cavalry against Xun.",
        "Shi Bao dropped his Ye offensive and sent Ma Qiu and Yao Guo out with mounted troops to meet Sima Xun.",
    ),
    (
        "s0212",
        "Zun dispatched Wang Lang of the chariot-and-cavalry corps with twenty thousand picked riders; under the pretext of campaigning against Xun abroad he seized Bao and sent him to Ye.",
        "Shi Zun ordered Wang Lang forward with twenty thousand elite horse—ostensibly to fight Sima Xun—only to arrest Shi Bao in transit and haul him to Ye.",
    ),
    (
        "s0213",
        "Xun was again blocked by Lang; he abandoned Xuangu, took Wancheng, executed Yuan Jing, Zun's governor of Nanyang, and returned.",
        "Wang Lang checked Sima Xun again; he quit Xuangu, seized Wancheng, killed Yuan Jing, Shi Zun's prefect of Nanyang, and withdrew.",
    ),
    (
        "s0214",
        "At first, when Zun set out from Licheng, he said to Shi Min: \"Exert yourself!",
        "When Shi Zun first rode out from Licheng he told Shi Min, \"Throw your whole weight behind this.",
    ),
    (
        "s0215",
        "When the deed is done We shall make you heir apparent.\"",
        "Succeed, and you will be my heir.\"",
    ),
    (
        "s0216",
        "\" Thereafter he enthroned Yan; Min was deeply disappointed. Deeming his own merit unrivaled in the age, he aimed to monopolize court power, while Zun envied him and would not entrust him.",
        "Yet he raised Shi Yan instead. Shi Min burned—he alone had turned the tide—and meant to rule the council while Shi Zun mistrusted him and withheld real authority.",
    ),
    (
        "s0217",
        "Once Min became commander-in-chief and held all military authority inside and outside the palace, he won over the palace guard and more than ten thousand former eastern-palace Gao Li veterans, memorializing them all as supernumerary generals of the palace hall with noble rank as marquises beyond the passes, granting them palace women to cultivate gratitude toward himself.",
        "As grand commander Shi Min held every blade; he courted the hall troops and ten thousand eastern-palace toughs, had them named supernumerary hall generals and marquises beyond the passes, and showered them with palace women to seal their loyalty.",
    ),
    (
        "s0218",
        "Zun did not suspect him in this; instead he posted lists grading good and evil names to humiliate and suppress them, and everyone harbored resentment.",
        "Shi Zun never sensed the danger; he published virtue-and-vice rosters to shame them instead, and resentment spread through the ranks.",
    ),
    (
        "s0219",
        "Moreover he adopted the counsel of secretariat director Meng Zhun and left guard general Wang Luan, grew suspicious and fearful of Min, and gradually stripped away his military authority.",
        "He also listened to Meng Zhun and Wang Luan, turned wary of Shi Min, and slowly peeled away his commands.",
    ),
    (
        "s0220",
        "Min increasingly showed hatred on his face; Zhun and the rest all urged executing him.",
        "Shi Min's glare turned murderous; Meng Zhun's faction pressed Shi Zun to kill him.",
    ),
    (
        "s0221",
        "Zun summoned Shi Jian and others to deliberate before his empress dowager, Lady Zheng; all petitioned to execute Min.",
        "Shi Zun assembled Shi Jian and the princes before Empress Dowager Zheng; every voice demanded Shi Min's death.",
    ),
    (
        "s0222",
        "Lady Zheng said: \"When the army turned back at Licheng, without Thorn Slave where would today be!",
        "Lady Zheng answered, \"When your host wheeled home from Licheng, without Jinu you would have no throne.",
    ),
    (
        "s0223",
        "He is a little proud—indulge him; you must not kill him outright.\"",
        "Let his small arrogance pass—you must not cut him down yet.\"",
    ),
    (
        "s0224",
        "\" When Jian left, he sent the eunuch Yang Huan galloping to warn Min; Min then seized Li Nong and Wang Ji of the right guard and secretly plotted to depose Zun.",
        "Shi Jian slipped out and sent the eunuch Yang Huan racing to alert Shi Min, who kidnapped Li Nong and Wang Ji of the right guard and schemed to oust Shi Zun.",
    ),
    (
        "s0225",
        "He ordered generals Su Hai and Zhou Cheng to lead thirty armored soldiers and seize Zun at the Ruyi Observatory.",
        "He told Su Hai and Zhou Cheng to take thirty armored men and arrest Shi Zun at the Ruyi belvedere.",
    ),
    (
        "s0226",
        "Zun was at that moment playing pitch-and-roam chess with women; he asked Cheng and the others: \"Who rebels?\"",
        "Shi Zun was playing pitch-pot with his consorts when they burst in. \"Who turns traitor?\" he asked.",
    ),
    (
        "s0227",
        "\" Cheng said: \"The Prince of Yiyang, Jian, is to be enthroned.\"",
        "\"The prince of Yiyang, Shi Jian, takes the crown,\" Zhou Cheng replied.",
    ),
    (
        "s0228",
        "\" Zun said: \"Even I am treated thus; when you enthrone Jian, how long can it last!\"",
        "Shi Zun laughed bitterly. \"If this is my fate, how long will any of you endure Shi Jian?\"",
    ),
    (
        "s0229",
        "\" Thereupon they killed him in Kunhua Hall and executed Lady Zheng, his heir Yan, superior household groom Zhang Fei, secretariat director Meng Zhun, Wang Luan of the left guard, and others.",
        "They slew him in Kunhua Hall, then butchered Lady Zheng, Crown Prince Yan, Zhang Fei of the superior household income, Meng Zhun, Wang Luan, and the rest.",
    ),
    (
        "s0230",
        "In all Zun occupied the throne one hundred eighty-three days.",
        "Shi Zun had ruled one hundred eighty-three days.",
    ),
    (
        "s0231",
        "Shi Jian.",
        "Section heading: Shi Jian.",
    ),
    (
        "s0232",
        "Jian then usurped the throne and proclaimed a general amnesty short of capital crimes.",
        "Shi Jian seized the throne and ordered mercy for all crimes below death.",
    ),
    (
        "s0233",
        "He appointed Shi Min grand general and prince of Wude, Li Nong grand minister of war, both with custody of Masters-of-Writing affairs;",
        "He named Shi Min commander-in-chief and prince of Wude, Li Nong minister of war—both controlling the secretariat—",
    ),
    (
        "s0234",
        "Lang Kai minister of works, Liu Qun governor of Qinzhou left vice-director of Masters-of-Writing, attendant Lu Chen supervisor of the secretariat.",
        "made Lang Kai minister of works, Liu Qun of Qinzhou left vice-director of the secretariat, and palace attendant Lu Chen overseer of the palace writers.",
    ),
    (
        "s0235",
        "Jian ordered Shi Bao, secretariat director Li Song, palace-hall general Zhang Cai, and others to assassinate Min and Li Nong by night in Kunhua Hall; they failed, and the forbidden precincts erupted in chaos.",
        "Shi Jian sent Shi Bao, Li Song, and Zhang Cai to murder Shi Min and Li Nong after dark in Kunhua Hall; the bid collapsed and the inner palace exploded into riot.",
    ),
    (
        "s0236",
        "Jian feared Min might mutiny; pretending ignorance, he had Song and Cai executed that night at the western Zhonghua Gate and put Shi Bao to death as well.",
        "Terrified of Shi Min's revenge, Shi Jian feigned innocence and that same night killed Li Song and Zhang Cai at the western Zhonghua gate, along with Shi Bao.",
    ),
    (
        "s0237",
        "At that time Shi Zhi was at Xiangguo; he had opened talks with Yao Yizhong, Fu Hong, and others, linked armies, and issued proclamations calling for the execution of Min and Li Nong.",
        "Shi Zhi held Xiangguo and had made peace with Yao Yizhong and Fu Hong; their allied hosts broadcast warrants for Shi Min and Li Nong's heads.",
    ),
    (
        "s0238",
        "Jian dispatched Shi Kun as grand commander-in-chief with Zhang Ju and attendant Huyan Sheng to lead seventy thousand infantry and horse on separate strikes against Zhi and company.",
        "Shi Jian named Shi Kun supreme commander and sent him with Zhang Ju and Huyan Sheng at the head of seventy thousand foot and horse against Shi Zhi.",
    ),
    (
        "s0239",
        "Palace-army commander Shi Cheng, attendant Shi Qi, and former Hedong governor Shi Hui plotted to kill Min and Li Nong; Min and Li Nong slew them.",
        "Shi Cheng, Shi Qi, and ex-prefect Shi Hui of Hedong conspired against Shi Min and Li Nong; the pair struck first and killed them.",
    ),
    (
        "s0240",
        "Sun Fudu and Liu Zhu of the Dragon Raising guard rallied three thousand Jie soldiers in ambush at Hutian, intending likewise to execute Min and his allies.",
        "Sun Fudu and Liu Zhu mustered three thousand Jie fighters in hiding at Hutian, aiming to cut down Shi Min.",
    ),
    (
        "s0241",
        "Jian was then at the central terrace; Fudu led more than thirty men intending to ascend the terrace, seize Jian, and turn against Min.",
        "Shi Jian sat on the central terrace while Sun Fudu rushed thirty followers up the stairs to seize the emperor and wheel on Shi Min.",
    ),
    (
        "s0242",
        "Seeing Fudu tear down the elevated walkway, Jian asked the reason.",
        "Watching Sun Fudu wreck the skywalk, Shi Jian demanded why.",
    ),
    (
        "s0243",
        "Fudu said: \"Li Nong and the others rebel; they are already at the eastern Ye Gate; your servant sternly leads the guards and respectfully informs you first.\"",
        "\"Li Nong has risen—the eastern Ye gate has fallen; I rally the household guard and came first to report,\" Sun Fudu said.",
    ),
    (
        "s0244",
        "\" Jian said: \"You are a minister of merit; exert yourself faithfully for the throne.",
        "Shi Jian answered, \"You are a champion—serve the dynasty with everything you have.",
    ),
    (
        "s0245",
        "We shall watch you from the terrace; do not fear that reward will not come.\"",
        "I will watch from this height; do not doubt you will be repaid.\"",
    ),
    (
        "s0246",
        "\" Thereupon Fudu and Zhu led their forces against Min and Li Nong, failed, and encamped at Fengyang Gate.",
        "Sun Fudu and Liu Zhu threw their weight at Shi Min and Li Nong, lost, and dug in at Fengyang Gate.",
    ),
    (
        "s0247",
        "Min and Li Nong led several thousand men, smashed the Jinming Gate, and entered.",
        "Shi Min and Li Nong shattered the Jinming Gate with thousands of fighters and poured through.",
    ),
    (
        "s0248",
        "Jian feared Min would execute him; he galloped to summon Min and Li Nong, opened the gates to admit them, and said: \"Sun Fudu rebels; you must hurry to punish him.",
        "Certain Shi Min meant to kill him, Shi Jian raced to open the gates: \"Sun Fudu rebels—strike him now.",
    ),
    (
        "s0249",
        "\" Min and Li Nong attacked, beheaded Fudu and his party, and from Fengyang to Kunhua corpses lay piled head to heel while blood ran in channels.",
        "Shi Min and Li Nong cut Sun Fudu down; from Fengyang to Kunhua the dead lay in windrows and blood pooled in the streets.",
    ),
    (
        "s0250",
        "They proclaimed that any tribesman who dared bear arms inside or outside would be beheaded.",
        "They decreed instant death for any armed northern tribesman within the walls or beyond.",
    ),
    (
        "s0251",
        "Northerners who hacked the gates or scaled the walls to flee were beyond counting.",
        "Countless men broke the barriers or climbed out over the battlements.",
    ),
    (
        "s0252",
        "They ordered Masters-of-Writing Wang Jian and lesser treasury Wang Yu to command several thousand troops, guard Jian inside the Dragon-Taming Observatory, and lower food to him on ropes.",
        "Wang Jian of the secretariat and Wang Yu of the lesser treasury penned Shi Jian inside the Dragon-Taming belvedere with thousands of men and lowered baskets of food.",
    ),
    (
        "s0253",
        "They commanded within the city: \"Those of one mind with the court may stay; those not of one mind may each go where they will.",
        "An order echoed through the wards: stay if you stand with the throne, leave freely if you do not.",
    ),
    (
        "s0254",
        "\" They ordered the gates no longer mutually barred.",
        "The gates were commanded open and none barred the roads.",
    ),
    (
        "s0255",
        "Thereupon Zhao commoners within a hundred li all entered the city, while departing Hu and Jie clogged the gates.",
        "Zhao townsfolk for a hundred li flooded inward as Jie and Hu streamed out until every gate jammed.",
    ),
    (
        "s0256",
        "Min knew the northerners would not serve him; he issued an edict to Zhao people inside and outside that whoever delivered one northern tribesman's head to Fengyang Gate would advance three grades as a civil official, while military officers would all be commissioned as gate guards.",
        "Seeing the tribes would never obey, Shi Min promised three civil promotions—or a gate-captain's commission—to any Zhao who brought a tribesman's head to Fengyang Gate.",
    ),
    (
        "s0257",
        "In a single day tens of thousands of heads were taken.",
        "That one day saw tens of thousands slain.",
    ),
    (
        "s0258",
        "Min personally led Zhao people in slaughtering every Hu and Jie; without regard to noble or base, male or female, young or old, all were beheaded—more than two hundred thousand dead whose corpses were piled beyond the walls until wild dogs and wolves devoured them.",
        "Shi Min himself led the Zhao in butchering every Jie and Hu—rich or poor, young or old—until two hundred thousand corpses littered the plain outside Ye for curs and wolves to tear apart.",
    ),
    (
        "s0259",
        "Garrisons holding the four quarters, wherever they received Min's document, executed targets accordingly; at that time those with high noses and heavy beards were slain indiscriminately until perhaps half died wrongfully.",
        "Outlying commands acted on Shi Min's writ and killed on sight—so many tall-nosed, bearded men fell by mistake that innocents may have matched the guilty.",
    ),
    (
        "s0260",
        "Grand steward Zhao Lu, grand commandant Zhang Ju, central army Zhang Chun, household groom Shi Yue, pacification general Shi Ning, martial guard Zhang Ji, together with various dukes, marquises, ministers, colonels, Dragon Surge officers, and others—more than ten thousand—fled toward Xiangguo.",
        "Over ten thousand grandees—Zhao Lu, Zhang Ju, Zhang Chun, Shi Yue, Shi Ning, Zhang Ji, and Dragon Surge commanders—bolted for Xiangguo.",
    ),
    (
        "s0261",
        "Shi Kun fled to hold Jizhou; pacification general Zhang Shen encamped at Fukou; Zhang Heduo held Shidu; Duan Qin the righteous-establishment general held Liyang; Yang Qun of southern pacification encamped at Sangbi; Liu Guo held Yangcheng; Duan Kan held Chenliu; Yao Yizhong held Hunqiao; Fu Hong held Fangtou—each with armies numbering several tens of thousands.",
        "Shi Kun seized Jizhou while Zhang Shen held Fukou, Zhang Heduo Shidu, Duan Qin Liyang, Yang Qun Sangbi, Liu Guo Yangcheng, Duan Kan Chenliu, Yao Yizhong Hunqiao, and Fu Hong Fangtou—each commanding tens of thousands.",
    ),
    (
        "s0262",
        "Wang Lang and Ma Qiu fled from Chang'an to Luoyang.",
        "Wang Lang and Ma Qiu raced from Chang'an to Luoyang.",
    ),
    (
        "s0263",
        "Qiu acting on Min's document executed more than a thousand Hu in Lang's command.",
        "On Shi Min's orders Ma Qiu slaughtered over a thousand tribesmen under Wang Lang.",
    ),
    (
        "s0264",
        "Lang fled to Xiangguo.",
        "Wang Lang fled to Xiangguo.",
    ),
    (
        "s0265",
        "Ma Qiu led his host and fled to Fu Hong.",
        "Ma Qiu defected to Fu Hong with his troops.",
    ),
    (
        "s0266",
        "Shi Kun together with Zhang Ju and Wang Lang led seventy thousand troops against Ye; Shi Min led more than a thousand riders and opposed them north of the walls.",
        "Shi Kun, Zhang Ju, and Wang Lang brought seventy thousand men against Ye; Shi Min met them beyond the north wall with a thousand horse.",
    ),
    (
        "s0267",
        "Min wielded a double-bladed spear, galloped among them, and shattered every line he touched, taking three thousand heads.",
        "He charged with a twin-edged lance and rode through their ranks as if they were straw, claiming three thousand kills.",
    ),
    (
        "s0268",
        "Kun and the others were utterly defeated and withdrew into Jizhou.",
        "Shi Kun's coalition broke and crawled back to Jizhou.",
    ),
    (
        "s0269",
        "Min with Li Nong led thirty thousand riders against Zhang Heduo at Shidu; Jian secretly sent eunuchs with letters summoning Zhang Shen and others to exploit the emptiness and raid Ye.",
        "Shi Min and Li Nong marched thirty thousand horse on Zhang Heduo at Shidu while Shi Jian secretly dispatched eunuchs urging Zhang Shen to strike undefended Ye.",
    ),
    (
        "s0270",
        "The eunuchs informed Min and Li Nong; Min and Li Nong galloped back, deposed Jian and killed him, executed thirty-eight grandsons of Jilong, and utterly extinguished the Shi clan.",
        "The eunuchs betrayed the plot; Shi Min and Li Nong wheeled home, deposed and executed Shi Jian, slew thirty-eight of Shi Hu's grandsons, and erased the Shi house.",
    ),
    (
        "s0271",
        "Jian occupied the throne one hundred three days.",
        "Shi Jian had reigned one hundred three days.",
    ),
    (
        "s0272",
        "Jilong's youngest son Hun fled to the capital with several wives and concubines; an edict ordered him seized and handed to the minister of justice; shortly he was beheaded in Jiankang market.",
        "Shi Hu's youngest, Shi Hun, reached the Jin court with a handful of women; the emperor jailed him and soon struck off his head in Jiankang's marketplace.",
    ),
    (
        "s0273",
        "Of Jilong's thirteen sons, five were killed by Ran Min, eight destroyed one another, and Hun likewise died upon reaching this point.",
        "Of Shi Hu's thirteen sons five fell to Ran Min, eight slew each other, and Shi Hun died last at Jiankang.",
    ),
    (
        "s0274",
        "Earlier a prophecy said \"ling\" would destroy the Shi; soon Shi Min was moved to prince of Lanling; Jilong detested this and renamed Lanling commandery Wuxing; reaching this point they were finally extinguished by Min.",
        "A rumor once named \"ling\" as the doom of Shi—then Shi Min became prince of Lanling, so Shi Hu renamed the district Wuxing in superstition—yet Ran Min ended the clan all the same.",
    ),
    (
        "s0275",
        "From the time Shi Le usurped under Emperor Cheng through two rulers and four sons—twenty-three years in all—they were destroyed under Emperor Mu.",
        "From Shi Le's seizure of power under Cheng-di through two emperors and four heirs stretched twenty-three years of Zhao rule until Mu-di watched it vanish.",
    ),
    (
        "s0276",
        "Shi Min.",
        "Section heading: Shi Min.",
    ),
    (
        "s0277",
        "〈Ran Min〉",
        "Alternate name: Ran Min.",
    ),
    (
        "s0278",
        "Min's style name was Yongzeng; his childhood name Thorn Slave; he was Jilong's adopted grandson.",
        "Shi Min, courtesy Yongzeng and childhood name Jinu, was Shi Hu's adopted grandson.",
    ),
    (
        "s0279",
        "His father Zhan, style Hongwu, originally bore the surname Ran and the personal name Liang; he was a man of Neihuang in Wei commandery.",
        "His father Ran Zhan (Hongwu), born Ran Liang of Neihuang in Wei commandery.",
    ),
    (
        "s0280",
        "His ancestors had been Han-era cavalry directors at Liyang; for generations they served as gate captains.",
        "His family had served Han as Liyang cavalry directors for generations of gate-captain posts.",
    ),
    (
        "s0281",
        "When Le defeated Chen Wu he captured Zhan, then twelve years old, and ordered Jilong to adopt him as a son.",
        "When Shi Le broke Chen Wu he seized the twelve-year-old boy and told Shi Hu to adopt him.",
    ),
    (
        "s0282",
        "He was fierce, brave, and immensely strong; in attack none stood before him.",
        "He fought like a demon—strong, relentless, and always in the van.",
    ),
    (
        "s0283",
        "He rose through the posts of general of the left for stacked volleys and marquis of Xihua.",
        "He climbed to left rapid-crossbow general and marquis of Xihua.",
    ),
    (
        "s0284",
        "Min was decisive and keen even as a boy; Jilong cherished him as a grandson.",
        "Even young he was bold and sharp; Shi Hu pampered him like blood kin.",
    ),
    (
        "s0285",
        "When grown he stood eight chi tall, excelled in stratagem, and his courage and strength surpassed other men.",
        "Full grown at eight chi, he was cunning in counsel and unmatched in raw valor.",
    ),
    (
        "s0286",
        "He was appointed general who establishes the standard, transferred to marquis of Xiucheng, and served as northern palace general and roaming-strike general.",
        "He became general of the established standard, then marquis of Xiucheng, and held northern palace general and roaming-strike commands.",
    ),
    (
        "s0287",
        "When Jilong was defeated at Changli, Min's army alone remained intact; from this his merit and fame rose greatly.",
        "When Shi Hu lost at Changli only Shi Min's corps marched home whole—and his legend ignited.",
    ),
    (
        "s0288",
        "After he defeated Liang Du his dread reputation spread further; veteran generals of Hu and Xia lands none did not fear him.",
        "After he shattered Liang Du his name shook north and south; every old soldier dreaded him.",
    ),
    (
        "s0289",
        ", killed Shi Jian; forty-eight men including his minister of education Shen Zhong and minister of works Lang Kai offered Min the supreme title; Min firmly yielded to Li Nong; Li Nong begged with his life; thereupon Min usurped the emperor's position at the southern suburb, proclaimed a general amnesty, changed the era name to Yongxing, styled the state Great Wei, and restored the surname Ran.",
        "Having killed Shi Jian, forty-eight ministers led by Shen Zhong and Lang Kai pressed the throne on him; he thrust it at Li Nong until Li Nong pleaded with his life that Min accept. At the southern altar he proclaimed himself emperor of Great Wei, adopted Yongxing, restored the surname Ran, and declared a general amnesty.",
    ),
    (
        "s0290",
        "He posthumously honored his grandfather Long as Emperor Yuan, his father Zhan as Emperor Gaodi with temple name Liezu, elevated Lady Wang as empress dowager, invested Lady Dong as empress, and named his son Zhi heir apparent.",
        "He canonized his grandfather as Yuan emperor, his father Ran Zhan as martyr-king Gaodi, raised Lady Wang to empress dowager, Lady Dong to empress, and named Ran Zhi crown prince.",
    ),
    (
        "s0291",
        "He appointed Li Nong grand steward with concurrent grand commandant and custody of Masters-of-Writing affairs, enfeoffed him prince of Qi, and enfeoffed Li Nong's sons as district dukes.",
        "Li Nong became grand tutor with the minister of war's portfolio and secretariat control, prince of Qi, while each of his sons took a district duchy.",
    ),
    (
        "s0292",
        "He enfeoffed his sons Yin, Ming, and Yu all as princes.",
        "His sons Yin, Ming, and Yu were all created princes.",
    ),
    (
        "s0293",
        "Civil and military officers advanced three grades in rank; noble titles were granted according to merit.",
        "Civil and martial ranks rose three steps; titles landed according to desert.",
    ),
    (
        "s0294",
        "He dispatched envoys bearing credentials to offer amnesty to the various entrenched camps; none obeyed.",
        "Staff-bearing envoys carried pardons to every rebel camp; all refused.",
    ),
    (
        "s0295",
        "When Shi Zhi heard that Jian was dead, he usurped the supreme title at Xiangguo; every tribal leader holding a province or commandery with troops responded to him.",
        "Learning of Shi Jian's death, Shi Zhi crowned himself at Xiangguo, and every tribal warlord with a seal rallied to him.",
    ),
    (
        "s0296",
        "Min sent an envoy to the riverbank to inform Jin: \"The northern tribes rebelled and threw the Central Plain into chaos; now We have executed them.",
        "Shi Min sent a messenger to the Yangzi shore to tell Jin, \"The nomads tore the heartland apart—we have slaughtered them.",
    ),
    (
        "s0297",
        "If you can join Us in punishing them, you may dispatch armies.\"",
        "March with us if you dare—send your armies.\"",
    ),
    (
        "s0298",
        "\" The court made no reply.",
        "The Jin court answered nothing.",
    ),
    (
        "s0299",
        "Min executed Li Nong and his three sons, together with Masters-of-Writing director Wang Mo, attendant Wang Yan, palace attendant Yan Zhen, Zhao Sheng, and others.",
        "Shi Min killed Li Nong, his three sons, chief secretary Wang Mo, attendant Wang Yan, eunuchs Yan Zhen and Zhao Sheng, and their circle.",
    ),
    (
        "s0300",
        "Jin's governor of Lujiang, Yuan Zhen, attacked Hefei, captured southern tribes colonel Sang Tan, and relocated the populace before returning.",
        "Yuan Zhen, Jin's prefect of Lujiang, struck Hefei, took southern frontier colonel Sang Tan prisoner, and marched the people home.",
    ),
    (
        "s0301",
        "Shi Zhi dispatched his minister of state Shi Kun to lead one hundred thousand troops against Ye and advanced to occupy Handan.",
        "Shi Zhi sent his minister Shi Kun with a hundred thousand men against Ye and seized Handan.",
    ),
]


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    path = root / "translations" / "current_translation_jinshu.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    if len(T) != len(data["sentences"]):
        raise SystemExit(f"len(T)={len(T)} does not match file sentence count {len(data['sentences'])}")
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
