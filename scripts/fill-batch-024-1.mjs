import { readFileSync, writeFileSync } from 'fs';

const translations = {
  s0001: {
    literal: "The king measures land to establish settlements, gauges land to settle people, totals what the land produces, estimates the profit of mountains and marshes, reverently follows and implements orders, respectfully grants the seasons to the people, farmers and merchants hasten toward their pursuits, each attending to his own occupation.",
    idiomatic: "The sovereign measures land to lay out towns, assesses terrain to settle the people, tallies what the soil yields, estimates the bounty of hills and marshes, reverently upholds and enforces the laws, dutifully grants the seasons to the people, and farmers and merchants each pursue their calling according to their trade."
  },
  s0002: {
    literal: "The Documents say 'diligently move what is lacking and what is abundant,' meaning grain and goods circulate and all obtain their proper place.",
    idiomatic: "The Book of Documents speaks of 'diligently moving abundance to where there is want'—that is, grain and goods circulate so that each reaches its proper place."
  },
  s0003: {
    literal: "In the Offices of Zhou, the Grand Steward managed the methods of the nine tributes and nine levies; the king's regular expenditures each had their grades.",
    idiomatic: "In the Rites of Zhou, the Grand Steward oversaw the methods of the nine tributes and nine levies; the king's routine expenditures were graded by rank."
  },
  s0004: {
    literal: "What is called taking by the Way and using with restraint—thus one can sustain the governance of the hundred officials, encourage the merit of warriors, relieve heavenly disasters, subdue the outer regions, and preserve the state and settle the people—the great constant of governance.",
    idiomatic: "This is what is meant by taking through proper means and spending with restraint: only thus can one sustain the administration of officials, reward the achievements of soldiers, relieve natural disasters, bring distant lands to submission, and preserve the state and secure the people—the great principle of governance."
  },
  s0005: {
    literal: "From Xuanyuan and Zhuanxu down to Yao and Shun, all encouraged them according to what benefited them and transformed them according to what they desired.",
    idiomatic: "From the Yellow Emperor and Zhuanxu down to Yao and Shun, each ruler encouraged the people through what benefited them and transformed them through what they desired."
  },
  s0006: {
    literal: "Not seizing their seasons, not exhausting their strength, lightening their levies, reducing their taxes—this is the teaching of the Five Emperors and Three Sovereigns that never changes.",
    idiomatic: "Not seizing their seasons, not exhausting their strength, lightening levies, and reducing taxes—this is the unchanging teaching of the Five Emperors and Three Sovereigns."
  },
  s0007: {
    literal: "An ancient saying says: 'One who is good at governing others cherishes their strength and completes their wealth.",
    idiomatic: "An old saying runs: 'A good ruler cherishes the people's strength and builds up their wealth."
  },
  s0008: {
    literal: "' If one employs them not by the Way, and collects as though unable to catch up, when wealth is exhausted there is resentment; when strength is exhausted there is rebellion.",
    idiomatic: "' But if one employs them unjustly and levies taxes as though never satisfied, when wealth is exhausted resentment follows, and when strength is exhausted rebellion follows."
  },
  s0009: {
    literal: "Formerly Yu established nine grades and songs of contentment arose; the Zhou people took one in eleven and hymns of praise were composed.",
    idiomatic: "In antiquity Yu established the nine grades of land, and songs of contentment arose; the Zhou took one part in eleven, and hymns of praise were composed."
  },
  s0010: {
    literal: "Thereupon the Eastern Zhou moved to Luoyang, the feudal lords fell out of line, Duke Xuan of Lu first taxed by the mu, Zichan of Zheng made the hill levy, and of the former kings' institutions not one remained.",
    idiomatic: "Then the Eastern Zhou moved to Luoyang, the feudal lords fell into disorder, Duke Xuan of Lu first taxed fields by the mu, and Zichan of Zheng instituted the hill levy—of the ancient kings' institutions scarcely a trace survived."
  },
  s0011: {
    literal: "The Qin clan arose from the western Rong, by force corrected the realm, drove the people with punishments and abandoned them with benevolence and grace, with collections of more than half, the Long Wall severed the earth's veins, with levies to the last head, garrison duty exhausted men beyond the mountain passes.",
    idiomatic: "The Qin rose from the western borderlands and by force brought the realm to order; they drove the people with punishments and cast aside benevolence, taking more than half the harvest, building the Great Wall across the land's veins, and levying taxes to the last coin while garrison labor exhausted men beyond the frontier passes."
  },
  s0012: {
    literal: "Emperor Gaozu of Han inherited Qin's exhaustion; one part in fifteen was taxed; in the Zhongyuan era martial glory continued and the granaries grew ever fuller.",
    idiomatic: "Emperor Gaozu of Han inherited Qin's exhaustion and taxed at one part in fifteen; under the Zhongyuan reign martial glory continued and the state granaries grew ever fuller."
  },
  s0013: {
    literal: "Emperor Wu obtained it and used it to achieve grandeur and extravagance, opened the frontiers and struck the Hu, and all was suddenly emptied.",
    idiomatic: "Emperor Wu inherited this prosperity and turned it to grandeur and extravagance; he opened the frontiers to strike the Xiongnu until the treasury was utterly drained."
  },
  s0014: {
    literal: "Palaces reached to the Milky Way, tours and hunts crossed beyond the seas; in drought years roads were cleared, in famine years fodder was tasted; the registered population was thereby halved, and banditry walked openly.",
    idiomatic: "Palaces reached toward the Milky Way, imperial tours crossed the seas; in drought years roads were cleared for the emperor, in famine years fodder was procured for his horses—the registered population was halved, and banditry flourished openly."
  },
  s0015: {
    literal: "Thereupon devious and irregular taxes and levies, every sort of anomaly arose together; levies reached infants in swaddling clothes, and the poll tax extended to boats and carts.",
    idiomatic: "Then devious taxes and irregular levies multiplied; tribute was exacted even from infants in swaddling clothes, and the poll tax reached boats and carts."
  },
  s0016: {
    literal: "Emperor Guangwu restored the dynasty, reverently followed the former affairs, completed levies that were thin and light, sufficient to be called far-reaching in principle.",
    idiomatic: "Emperor Guangwu restored the dynasty, reverently followed precedent, kept levies light and thin, and earned a reputation for enduring principle."
  },
  s0017: {
    literal: "Emperor Ling opened the Hongdu placard and opened the path of selling offices; dukes, ministers, provinces, and commanderies each had their grades.",
    idiomatic: "Emperor Ling posted the Hongdu placard and opened the way to selling offices; ranks for dukes, ministers, provinces, and commanderies each had their price."
  },
  s0018: {
    literal: "Han's regular categories included local tribute and regional products; the emperor also sent them first to the inner palace, called 'guiding the procession,' until bribery pervaded the realm and the people suffered the harm.",
    idiomatic: "Han's regular tribute included local products and regional goods; the emperor also required them sent first to the inner palace under the name of 'guiding the procession,' until bribery pervaded the realm and the people bore the cost."
  },
  s0019: {
    literal: "From Wei and Jin's twenty-one emperors and Song and Qi's fifteen rulers, though expenditures had greater and lesser amounts and rent and levies had heavier and lighter rates, for the most part they could not overturn people's livelihoods or bring governance to disorder.",
    idiomatic: "From Wei's and Jin's twenty-one emperors through Song's and Qi's fifteen rulers, though expenditures varied in scale and rent and levies in weight, for the most part they did not ruin people's livelihoods or bring governance to ruin."
  },
  s0020: {
    literal: "[Note: '政' should read '治'; altered under Tang taboo.]",
    idiomatic: "[Textual note: the character for 'governance' should read 'order and disorder'; altered under Tang dynastic taboo.]"
  },
  s0021: {
    literal: "After Emperor Wen of Sui pacified the lands south of the Yangtze, the realm was greatly unified; he personally took the lead in frugality to serve the treasury.",
    idiomatic: "After Emperor Wen of Sui pacified the lands south of the Yangtze and unified the realm, he personally led the way in frugality to fill the treasury."
  },
  s0022: {
    literal: "In the seventeenth year of Kaihuang, the registered population flourished; inner and outer granaries and storehouses were all overflowing.",
    idiomatic: "In Kaihuang year 17 the registered population surged; granaries and storehouses throughout the empire overflowed with grain."
  },
  s0023: {
    literal: "All grants and gifts did not exceed regular expenditures; when the capital offices' treasury rooms were full and grain piled beneath the corridors, Gaozu stopped the regular levy of that year and bestowed it upon the common people.",
    idiomatic: "All grants and gifts stayed within regular expenditure; when the capital treasuries were full and grain piled beneath the corridors, Gaozu suspended that year's regular levy and bestowed it upon the people."
  },
  s0024: {
    literal: "Emperor Yang succeeded to the great foundation; the state was rich and abundant; he elegantly loved grand curiosities, indulged his feelings and was just spreading his wings; he first built the Eastern Capital and exhausted every magnificence.",
    idiomatic: "Emperor Yang inherited the great foundation when the state was rich and abundant; he loved grand curiosities and indulged his desires without restraint; he first built the Eastern Capital and pursued every extravagance."
  },
  s0025: {
    literal: "The emperor formerly resided as a prince on the frontier, personally pacified the lands east of the Yangtze, and also took Liang and Chen's twists and turns to complete his design.",
    idiomatic: "While still a prince on the frontier, the emperor had personally pacified the lands east of the Yangtze, and he also drew on Liang and Chen's architectural styles to shape his design."
  },
  s0026: {
    literal: "Battlements exceeded Mang Hill, floating bridges crossed the Luo, the Golden Gate and Elephant Watchtower all rose in flying towers; crumbling cliffs blocked rivers and formed cloud brocade; ridge trees were moved to make groves, and Mang Hill was enclosed as a park.",
    idiomatic: "Battlements rose higher than Mang Hill, floating bridges spanned the Luo River, the Golden Gate and Elephant Watchtower soared in flying towers; crumbling cliffs dammed rivers into brocade clouds; trees from the ridges were transplanted to form groves, and Mang Hill was enclosed as an imperial park."
  },
  s0027: {
    literal: "The Long Wall and Imperial Canal did not count human labor; transporting mules and war horses was fixed on a schedule for the common people; the realm died in corvée and families were wounded in wealth.",
    idiomatic: "The Great Wall and Imperial Canal paid no heed to human cost; transport of mules and war horses was scheduled at the people's expense—the realm perished in corvée labor and households were ruined in wealth."
  },
  s0028: {
    literal: "Then one campaign against the Hun court, three imperial visits to Liaozhe; the Son of Heaven personally attacked, armies were greatly raised, flying grain and fodder were transported, and land and water supplies arrived together.",
    idiomatic: "Then came one campaign against the Tujue court and three imperial tours to Liaozhe; the emperor personally took the field, armies were raised on a vast scale, grain and fodder were rushed by land and water together."
  },
  s0029: {
    literal: "Where the frontier collapsed, where exhaustion and toil caused death—even though more than half did not return, every year levies were raised; from every good household sons mostly went to the border; sounds of parting and weeping echoed through the provinces and counties.",
    idiomatic: "Where the frontier collapsed and exhaustion claimed lives—even though more than half never returned, levies were raised every year; sons from every respectable household were sent to the borders, and cries of parting echoed through province after county."
  },
  s0030: {
    literal: "The old and weak tilled but could not save them from hunger; women spun and wove but could not supply travel expenses.",
    idiomatic: "The old and weak tilled the fields but could not stave off hunger; women spun and wove but could not supply travel expenses."
  },
  s0031: {
    literal: "Within the nine regions the imperial carriage moved every year; the palace women who accompanied him regularly numbered a hundred thousand; all supplies needed were borne by the provinces and counties.",
    idiomatic: "Within the nine regions the imperial carriage moved every year; the palace women in attendance regularly numbered a hundred thousand, and all supplies depended on the provinces and counties."
  },
  s0032: {
    literal: "Beyond rent and levies, everything was requisitioned and collected, hastening to completeness, heedless of the common people; officials thereby extorted and seized more than half for themselves.",
    idiomatic: "Beyond rent and regular levies, every sort of exaction was imposed to make supplies complete, with no regard for the people; officials extorted and kept more than half for themselves."
  },
  s0033: {
    literal: "Rare delicacies from distant regions necessarily entered the kitchens; flying birds' feathers were used as ornaments; buying to supply the court cost a thousand times the price.",
    idiomatic: "Rare delicacies from distant lands always reached the imperial kitchens; the feathers of wild birds served as ornaments; purchases for the court cost a thousandfold the ordinary price."
  },
  s0034: {
    literal: "People, unable to bear their grief, abandoned their dwellings; district officials knocked on doors until dawn, and fierce dogs barked in greeting all night.",
    idiomatic: "People, crushed by their burdens, abandoned their homes; district officials knocked on doors until dawn, and fierce dogs barked at visitors through the night."
  },
  s0035: {
    literal: "From Yan and Zhao across Qi and Han, from the Jiang and Huai into Xiang and Deng, the lands of Eastern Zhou's Luoyang and western Qin's lands beyond Longshan—usurpers and rebels invaded each other, and bandits filled the land.",
    idiomatic: "From Yan and Zhao across Qi and Han, from the Jiang and Huai into Xiang and Deng, from the lands of Eastern Zhou's Luoyang to western Qin beyond Longshan—usurpers and rebels clashed, and bandits filled the land."
  },
  s0036: {
    literal: "Palaces and temples became rank grass; village posts lost their cooking smoke; people ate one another—four or five in ten.",
    idiomatic: "Palaces and temples turned to rank weeds; village posts lost their cooking smoke; people ate one another—four or five in ten."
  },
  s0037: {
    literal: "Plague struck Guanzhong, scorching drought harmed the crops; Prince Dai opened the grain of Yongfeng to relieve the hungry; hundreds of li from the granary, old and young gathered like clouds.",
    idiomatic: "Plague struck Guanzhong and scorching drought ruined the harvest; Prince Dai opened the Yongfeng granary to feed the hungry; old and young gathered like clouds hundreds of li from the granary."
  },
  s0038: {
    literal: "Officials were greedy and cruel, offices had no order; all demanded bribes; movement took ten-day periods and more; they collapsed in the wilderness, wishing to return but unable; the dead piled like heaps, beyond counting.",
    idiomatic: "Officials were greedy and cruel, government had no order; all demanded bribes; journeys took months; people collapsed in the wilderness, unable to return; the dead piled in heaps beyond counting."
  },
  s0039: {
    literal: "Although the sage kings received Heaven's mandate and heavenly fortune has its end, the fall of the Sui house also came from this.",
    idiomatic: "Though sage kings receive Heaven's mandate and heavenly fortune must end, the fall of the Sui dynasty also came from this."
  },
  s0040: {
    literal: "Ma Qian wrote the Treatise on the Equalization of Goods; Ban Gu narrated the Treatise on Food and Money; spanning several thousand years above and below, gains and losses are roughly set forth.",
    idiomatic: "Sima Qian wrote the Treatise on the Equalization of Goods and Ban Gu the Treatise on Food and Money; spanning several thousand years, they roughly set forth what was gained and lost."
  },
  s0041: {
    literal: "From this time the historiographers never had a general survey.",
    idiomatic: "Since then the official historians never produced a comprehensive survey."
  },
  s0042: {
    literal: "When people first arose, food and goods were the foundation.",
    idiomatic: "When people first arose, food and goods were the foundation of life."
  },
  s0043: {
    literal: "The sage kings divided huts and wells to give them occupations, circulated goods and wealth to enrich them.",
    idiomatic: "The sage kings divided land into huts and wells to give the people their occupations and circulated goods and wealth to enrich them."
  },
  s0044: {
    literal: "When enriched, teach them; benevolence and righteousness thereby arise; when poor they become bandits, and punishments cannot stop them.",
    idiomatic: "When the people are enriched, teach them—benevolence and righteousness then flourish; when they are poor they turn to banditry, and punishments cannot stop them."
  },
  s0045: {
    literal: "Therefore this Treatise on Food and Money is compiled at the end of the preceding books.",
    idiomatic: "Therefore this Treatise on Food and Money is compiled to conclude the preceding books."
  },
  s0046: {
    literal: "After Jin lost the Central Plains to chaos, Emperor Yuan resided east of the Yangtze; common people who escaped south on their own were all called émigrés.",
    idiomatic: "After Jin lost the Central Plains to chaos, Emperor Yuan established his court east of the Yangtze; common people who fled south on their own were all called émigrés."
  },
  s0047: {
    literal: "All took names of old territories and established émigré commanderies and counties; they often lived scattered, with no fixed native places.",
    idiomatic: "They took names from their old homelands and established émigré commanderies and counties; they often lived scattered, with no fixed native registration."
  },
  s0048: {
    literal: "But the customs of Jiangnan were slash-and-burn and water-rice cultivation; the land was low and damp, with no resources for accumulation.",
    idiomatic: "But Jiangnan custom was slash-and-burn and water-rice cultivation; the land was low and damp, with little capacity for accumulation."
  },
  s0049: {
    literal: "Among the various Man tribes, Li caves, and Dong settlements touched by royal transformation, each according to lighter or heavier status collected their tribute goods to supplement state use.",
    idiomatic: "Among the various Man tribes, Li settlements, and Dong communities touched by royal civilization, tribute was collected according to rank to supplement state revenue."
  },
  s0050: {
    literal: "Also chieftains beyond the mountain passes, because of the abundance of captives, jadeite, pearls, rhinoceros horn, and elephants, who were powerful in their districts—the court often appointed them accordingly to collect their profit.",
    idiomatic: "Chieftains beyond the passes, enriched by captives, jadeite, pearls, rhinoceros horn, and elephants and powerful in their districts, were often appointed by the court to collect tribute for the state."
  },
  s0051: {
    literal: "Through Song, Qi, Liang, and Chen, all followed this without change.",
    idiomatic: "Through Song, Qi, Liang, and Chen, this practice continued unchanged."
  },
  s0052: {
    literal: "Miscellaneous goods needed for military and state use, according to what each region produced, were temporarily assessed and purchased in the market—there were no fixed laws or orders.",
    idiomatic: "Miscellaneous goods needed for military and state use were purchased locally according to regional products through temporary assessments—there were no fixed statutes."
  },
  s0053: {
    literal: "Provinces, commanderies, and counties were listed, fixing what each region's soil produced as the basis for levies and tribute.",
    idiomatic: "Provinces, commanderies, and counties were assigned fixed products of their soil as the basis for levies and tribute."
  },
  s0054: {
    literal: "Those without registration who did not wish to be registered in provincial and county household rolls were called floating drifters; voluntary contributions also had no fixed amount, according to quantity, based on what was contributed, [Note: Tongdian reads '惟' for '准'] ultimately still better than the regular levy.",
    idiomatic: "Those without registration who refused provincial and county household rolls were called floating drifters; their voluntary contributions had no fixed amount but were assessed by quantity—[Note: the Tongdian reads 'only' for 'according to']—yet still ultimately lighter than the regular levy."
  },
  s0055: {
    literal: "Many in the capital served princes, dukes, and nobles as attendants, tenant clients, stewards, and clothing-and-food clients—all exempt from levies and corvée.",
    idiomatic: "Many in the capital served princes, dukes, and nobles as attendants, tenant clients, stewards, and provision clients—all exempt from levies and corvée."
  },
  s0056: {
    literal: "For official ranks first and second, tenant clients could not exceed forty households.",
    idiomatic: "For ranks one and two, tenant clients could not exceed forty households."
  },
  s0057: {
    literal: "Third rank: thirty-five households.",
    idiomatic: "Third rank: thirty-five households."
  },
  s0058: {
    literal: "Fourth rank: thirty households.",
    idiomatic: "Fourth rank: thirty households."
  },
  s0059: {
    literal: "Fifth rank: twenty-five households.",
    idiomatic: "Fifth rank: twenty-five households."
  },
  s0060: {
    literal: "Sixth rank: twenty households.",
    idiomatic: "Sixth rank: twenty households."
  },
  s0061: {
    literal: "Seventh rank: fifteen households.",
    idiomatic: "Seventh rank: fifteen households."
  },
  s0062: {
    literal: "Eighth rank: ten households.",
    idiomatic: "Eighth rank: ten households."
  },
  s0063: {
    literal: "Ninth rank: five households.",
    idiomatic: "Ninth rank: five households."
  },
  s0064: {
    literal: "Their tenant grain was all divided by measure with the great families.",
    idiomatic: "Grain from tenant fields was divided by measure with the great families."
  },
  s0065: {
    literal: "For stewards, ranks first and second were allotted three persons.",
    idiomatic: "For stewards, ranks one and two were allotted three persons."
  },
  s0066: {
    literal: "Third and fourth, two persons.",
    idiomatic: "Third and fourth ranks, two persons."
  },
  s0067: {
    literal: "Fifth and sixth, and ducal-house staff officers, palace supervisors, army supervisors, chief administrators, marshals, commanders of private troops, marquises outside the passes, materiel officers, and advisory gentlemen and above—one person.",
    idiomatic: "Fifth and sixth ranks, and ducal-house staff officers, palace supervisors, army supervisors, chief administrators, marshals, commanders of private troops, marquises outside the passes, materiel officers, and advisory gentlemen and above—one person each."
  },
  s0068: {
    literal: "All were counted within the tenant-client quota.",
    idiomatic: "All were counted within the tenant-client quota."
  },
  s0069: {
    literal: "From official rank sixth and above, each also received three clothing-and-food clients.",
    idiomatic: "From rank six and above, each also received three provision clients."
  },
  s0070: {
    literal: "Seventh and eighth, two persons.",
    idiomatic: "Seventh and eighth ranks, two persons."
  },
  s0071: {
    literal: "Ninth rank and imperial carriage attendants, trace-hunters, vanguard runners, Youji strong-crossbow marshals, Forest Guard gentlemen, palace supernumerary warrior guards, palace warrior guards, mace-and-axe cavalry warrior guards, supernumerary warrior guards with iron clubs, and marksmanship cavalry warrior guards—one person.",
    idiomatic: "Ninth rank and imperial carriage attendants, trace-hunters, vanguard runners, Youji strong-crossbow marshals, Forest Guard gentlemen, palace supernumerary warrior guards, palace warrior guards, mace-and-axe cavalry warrior guards, supernumerary warrior guards with iron clubs, and marksmanship cavalry warrior guards—one person each."
  },
  s0072: {
    literal: "Clients were all registered on the household rolls of their masters.",
    idiomatic: "All clients were registered on their masters' household rolls."
  },
  s0073: {
    literal: "The levy: adult males paid two zhang each of cloth and silk, three liang of silk thread, eight liang of cotton, eight chi of salary silk, three liang two fen of salary cotton, five shi of rent grain, and two shi of salary grain.",
    idiomatic: "The levy on adult males: two zhang each of cloth and silk, three liang of silk thread, eight liang of cotton, eight chi of salary silk, three liang two fen of salary cotton, five shi of rent grain, and two shi of salary grain."
  },
  s0074: {
    literal: "Adult females paid half.",
    idiomatic: "Adult females paid half."
  },
  s0075: {
    literal: "Males and females from sixteen up to sixty were counted as adult laborers.",
    idiomatic: "Males and females from age sixteen to sixty were counted as adult laborers."
  },
  s0076: {
    literal: "Males at sixteen also paid half the levy; at eighteen the full levy; at sixty-six exempt from the levy.",
    idiomatic: "Males at sixteen paid half the levy; at eighteen the full levy; at sixty-six they were exempt."
  },
  s0077: {
    literal: "Females counted as adult laborers when married; if unmarried, only at twenty.",
    idiomatic: "Married women counted as adult laborers; unmarried women only at age twenty."
  },
  s0078: {
    literal: "For adult males, corvée each year did not exceed twenty days.",
    idiomatic: "Adult males owed no more than twenty days of corvée per year."
  },
  s0079: {
    literal: "Also, one transport corvée laborer was levied from every eighteen persons.",
    idiomatic: "Also, one transport corvée laborer was levied from every eighteen persons."
  },
  s0080: {
    literal: "For fields, the tax was two dou of grain per mu.",
    idiomatic: "Fields were taxed two dou of grain per mu."
  },
  s0081: {
    literal: "Generally the overall rate was like this.",
    idiomatic: "Generally the overall rate was as described."
  },
  s0082: {
    literal: "For measures: three dou equaled one present-day dou; three liang equaled one present-day liang; one chi two cun equaled one present-day chi.",
    idiomatic: "For measures: three dou equaled one present-day dou; three liang equaled one present-day liang; one chi two cun equaled one present-day chi."
  },
  s0083: {
    literal: "For granaries: in the capital there were Longshou Granary—that is, Shitoujin Granary—Inner City Granary, Nantang Granary, Ever-Normal Granary, East and West Great Granaries, and Eastern Palace Granary; total stored grain did not exceed five hundred thousand-plus.",
    idiomatic: "In the capital there were Longshou Granary (that is, Shitoujin Granary), Inner City Granary, Nantang Granary, Ever-Normal Granary, East and West Great Granaries, and Eastern Palace Granary; total storage did not exceed five hundred thousand-plus."
  },
  s0084: {
    literal: "Outside there were Yuzhang Granary, Diaoji Granary, and Qiantang Granary—all major reserve storage places.",
    idiomatic: "Outside the capital were Yuzhang Granary, Diaoji Granary, and Qiantang Granary—all major reserve depots."
  },
  s0085: {
    literal: "The remaining provinces, commanderies, and relay stations each also had granaries.",
    idiomatic: "Other provinces, commanderies, and relay stations each also had granaries."
  },
  s0086: {
    literal: "Generally from the chaos of Hou Jing onward, state revenue was constantly strained.",
    idiomatic: "Generally from Hou Jing's rebellion onward, state revenue was constantly strained."
  },
  s0087: {
    literal: "Capital civil and military officials monthly received only grain rations; many remotely held a commandery or county office and took its salary and rank.",
    idiomatic: "Capital civil and military officials received only monthly grain rations; many remotely held a commandery or county post and drew its salary and rank."
  },
  s0088: {
    literal: "Large provinces like Yang and Xu ranked with ministers.",
    idiomatic: "Large provinces like Yang and Xu ranked with ministers."
  },
  s0089: {
    literal: "Small provinces like Ning and Gui ranked with staff officers.",
    idiomatic: "Small provinces like Ning and Gui ranked with staff officers."
  },
  s0090: {
    literal: "Commanderies like Danyang, Wu, and Kuaiji ranked with the Crown Prince's household superintendent and ministers.",
    idiomatic: "Commanderies like Danyang, Wu, and Kuaiji ranked with the Crown Prince's household superintendent and ministers."
  },
  s0091: {
    literal: "Small commanderies like Gaoliang and Jinkang, only three grades.",
    idiomatic: "Small commanderies like Gaoliang and Jinkang ranked only three grades."
  },
  s0092: {
    literal: "Large counties six grades; small counties required two promotions to reach one grade.",
    idiomatic: "Large counties ranked six grades; small counties required two promotions to reach one grade."
  },
  s0093: {
    literal: "Since the grades differed, they cannot all be listed in detail.",
    idiomatic: "Since the grades differed, they cannot all be listed in detail."
  },
  s0094: {
    literal: "[Note: '妄' in the preceding sentence should read '委' (detail); corrected per Tongdian 35.] Province, commandery, and county salary grain, silk, cloth, thread, and cotton were delivered locally to relay granaries and storehouses.",
    idiomatic: "[Note: 'cannot all be wrongly listed' in the preceding sentence should read 'cannot all be listed in detail; corrected per the Tongdian.] Province, commandery, and county salary grain, silk, cloth, thread, and cotton were delivered locally to relay granaries and storehouses."
  },
  s0095: {
    literal: "When supplying prefects, magistrates, and the like, first according to the number of civil and military personnel in their jurisdiction, it was decided by imperial order.",
    idiomatic: "When supplying prefects, magistrates, and the like, allocations were first determined by the number of civil and military personnel in their jurisdiction, as decided by imperial order."
  },
  s0096: {
    literal: "Generally such salaries, since they also supplied the garrison soldiers of the jurisdiction, what the household actually received was very little.",
    idiomatic: "Since such salaries also had to supply garrison soldiers in the jurisdiction, what the official's household actually received was very little."
  },
  s0097: {
    literal: "Princes and princesses, when leaving the palace for their estates for marriage and capping ceremonies, and clothing and adornments, as well as wine, grain, fish, salmon, fragrant oil, paper, candles, and the like, were all supplied by the state.",
    idiomatic: "Princes and princesses, when leaving the palace for their estates for marriage and capping ceremonies, and for clothing, adornments, wine, grain, fish, salmon, fragrant oil, paper, candles, and the like, were all supplied by the state."
  },
  s0098: {
    literal: "Princes and princesses' husbands who held external salaries were not supplied.",
    idiomatic: "Princes and princesses' husbands who held external salaries received no such provision."
  },
  s0099: {
    literal: "When relieved of office and returning to the capital, they were still publicly supplied.",
    idiomatic: "When relieved of office and returning to the capital, they were still publicly supplied."
  },
  s0100: {
    literal: "After Yong'an in Wei, governance declined, banditry and chaos were truly numerous, and farmers and merchants lost their occupations.",
    idiomatic: "After Wei's Yong'an era, governance declined, banditry and chaos multiplied, and farmers and merchants lost their livelihoods."
  }
};

const file = JSON.parse(readFileSync('translations/current_translation_suishu.json', 'utf8'));
for (const s of file.sentences) {
  const t = translations[s.id];
  if (t) {
    s.literal = t.literal;
    s.idiomatic = t.idiomatic;
  }
}
writeFileSync('translations/current_translation_suishu.json', JSON.stringify(file, null, 2) + '\n');
console.log('Filled batch 1:', file.sentences.filter(s => s.literal).length, 'sentences');
