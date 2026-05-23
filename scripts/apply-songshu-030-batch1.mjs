#!/usr/bin/env node
import fs from 'node:fs';

const path = 'translations/current_translation_songshu.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

/** @type {Record<string, {literal: string, idiomatic: string}>} */
const T = {
  s0001: {
    literal: '[Residual markup from the source text.]',
    idiomatic: '[Residual markup from the source text.]',
  },
  s0002: {
    literal: '[Preface]',
    idiomatic: 'Preface',
  },
  s0003: {
    literal: 'In antiquity the Eight Trigrams appeared and the principle of Heaven and man was made manifest; the Nine Categories were ordered and the responses of emperors and kings were clarified.',
    idiomatic: 'In antiquity the Eight Trigrams appeared and the principle of Heaven and man was made manifest; the Nine Categories were ordered and the responses of emperors and kings were clarified.',
  },
  s0004: {
    literal: 'Although one may know that following virtue wins Heaven\'s blessing and violating the Way falls into the crime of divine hearing, yet omens and effects have not been fully set forth, and a complete examination of the hidden and manifest remains wanting — though the times list such anomalies as tripods, pheasants, and courtyard grain, still what has not been investigated is numerous.',
    idiomatic: 'Although one may know that following virtue wins Heaven\'s blessing and violating the Way falls into the crime of divine hearing, the omens and effects have not been fully set forth and a complete examination of the hidden and manifest remains wanting — though the times list such anomalies as tripods, pheasants, and courtyard grain, what has not been investigated remains numerous.',
  },
  s0005: {
    literal: 'As for illuminating and awakening later kings, much is lacking.',
    idiomatic: 'As for illuminating and awakening later kings, much remains lacking.',
  },
  s0006: {
    literal: 'Therefore Confucius composed the Spring and Autumn Annals, fully recording auspices and calamities to verify conduct.',
    idiomatic: 'Therefore Confucius composed the Spring and Autumn Annals, fully recording auspices and calamities to verify conduct.',
  },
  s0007: {
    literal: 'Thus the Nine Categories set forth their meaning beforehand, and the Spring and Autumn Annals listed their effects afterward.',
    idiomatic: 'Thus the Nine Categories set forth their meaning beforehand, and the Spring and Autumn Annals listed their effects afterward.',
  },
  s0008: {
    literal: 'When it reached Fu Sheng\'s creation of the Great Commentary, the substance of the Five Elements first became detailed;',
    idiomatic: 'When Fu Sheng composed the Great Commentary, the substance of the Five Elements first became detailed;',
  },
  s0009: {
    literal: 'Liu Xiang broadly expounded the Great Plan, and the texts on blessing and calamity became more complete.',
    idiomatic: 'Liu Xiang broadly expounded the Great Plan, and the texts on blessing and calamity became more complete.',
  },
  s0010: {
    literal: 'Therefore Ban Gu weighed the classics and commentaries and recorded in detail each category and branch — truly because the statutes of a single dynasty cannot be allowed to stand alone incomplete.',
    idiomatic: 'Therefore Ban Gu weighed the classics and commentaries and recorded each category and branch in detail — truly because the statutes of a single dynasty cannot be allowed to stand alone incomplete.',
  },
  s0011: {
    literal: 'Now the Way of Heaven, though without sound and without odor, yet responds like shadow and echo; the verification of Heaven and man — its principle cannot be deceived.',
    idiomatic: 'The Way of Heaven, though without sound and without odor, responds like shadow and echo; the verification of Heaven and man — its principle cannot be deceived.',
  },
  s0012: {
    literal: 'Sima Biao compiled and gathered from Guangwu onward to investigate Han affairs;',
    idiomatic: 'Sima Biao compiled and gathered from Guangwu onward to investigate Han affairs;',
  },
  s0013: {
    literal: 'Wang Shen\'s Book of Wei lacked treatise chapters; all such disasters and anomalies were only compiled in the imperial annals.',
    idiomatic: 'Wang Shen\'s Book of Wei lacked treatise chapters; all such disasters and anomalies were only compiled in the imperial annals.',
  },
  s0014: {
    literal: 'From Huangchu downward, over two hundred years, surveying its disasters and prodigies and examining them against events, they constantly accord like overlapping compasses and stacked carpenter\'s squares, not contradicting prior explanations.',
    idiomatic: 'From Huangchu downward, over two hundred years, surveying its disasters and prodigies and examining them against events, they constantly accord like overlapping compasses and stacked carpenter\'s squares, not contradicting prior explanations.',
  },
  s0015: {
    literal: 'Further, Gaotang Long, Guo Jingchun, and others, grounding their words in the classics, in the end all found clear fulfillment.',
    idiomatic: 'Further, Gaotang Long, Guo Jingchun, and others, grounding their words in the classics, in the end all found clear fulfillment.',
  },
  s0016: {
    literal: 'To leave them out without ordering them — the form of history would be damaged.',
    idiomatic: 'To leave them out without ordering them — the form of history would be damaged.',
  },
  s0017: {
    literal: 'Now from Sima Biao onward, all have been composed and arranged with discussion and prefaces — this too is Ban Gu\'s example of drawing remotely from the Spring and Autumn Annals to illuminate the near.',
    idiomatic: 'Now from Sima Biao onward, all have been composed and arranged with discussion and prefaces — this too is Ban Gu\'s example of drawing remotely from the Spring and Autumn Annals to illuminate the near.',
  },
  s0018: {
    literal: 'Again, when speech is not followed, there is the calamity of shell-bearing creatures; Liu Xin took them to be hairy creatures;',
    idiomatic: 'Again, when speech is not followed, there is the calamity of shell-bearing creatures; Liu Xin took them to be hairy creatures;',
  },
  s0019: {
    literal: 'when vision is not clear, there is the calamity of naked creatures; Liu Xin took them to be feathered creatures.',
    idiomatic: 'when vision is not clear, there is the calamity of naked creatures; Liu Xin took them to be feathered creatures.',
  },
  s0020: {
    literal: 'According to the Monthly Ordinances, summer creatures are feathered and autumn creatures are hairy — Liu Xin\'s explanation is appropriate, and therefore the earlier histories followed it.',
    idiomatic: 'According to the Monthly Ordinances, summer creatures are feathered and autumn creatures are hairy — Liu Xin\'s explanation is appropriate, and therefore the earlier histories followed it.',
  },
  s0021: {
    literal: 'The subtleties of the Five Elements are not what shallow learning can exhaust.',
    idiomatic: 'The subtleties of the Five Elements are not what shallow learning can exhaust.',
  },
  s0022: {
    literal: 'For all that have already been discussed by earlier commentators, I take their words to explain them;',
    idiomatic: 'For all that have already been discussed by earlier commentators, I take their words to explain them;',
  },
  s0023: {
    literal: 'where no prior explanation exists, I infer by analogy from principle and fact, awaiting later sages.',
    idiomatic: 'where no prior explanation exists, I infer by analogy from principle and fact, awaiting later sages.',
  },
  s0024: {
    literal: 'The Five Elements Commentary says: "If hunting does not lodge overnight, eating and drinking are not offered in sacrifice, coming and going lack restraint, the people\'s farming seasons are seized, and there are treacherous plots — then wood loses its bending and straightening; this means wood has lost its nature and become a disaster.',
    idiomatic: 'The Five Elements Commentary says: "When hunts roll on without pause, feasts ignore sacrificial propriety, movement ignores measure, corvées steal the farming calendar, and treachery festers — then wood forfeits its office of bending and straightening; this means wood has lost its nature and become a disaster.',
  },
  s0025: {
    literal: '" It also says: "When bearing lacks respect, this is called lacking solemnity.',
    idiomatic: '" It also says: "When bearing lacks respect, this is called lacking solemnity.',
  },
  s0026: {
    literal: 'Its fault is madness, its punishment constant rain, its extreme wickedness.',
    idiomatic: 'Its fault is madness, its punishment constant rain, its extreme wickedness.',
  },
  s0027: {
    literal: 'At times there are costume prodigies; at times turtle calamities; at times chicken disasters; at times ailments of the lower body growing on the upper; at times green internal misfortune and green auguries.',
    idiomatic: 'At times there are costume prodigies; at times turtle calamities; at times chicken disasters; at times ailments of the lower body growing on the upper; at times green internal misfortune and green auguries.',
  },
  s0028: {
    literal: 'Only metal encroaches upon wood.',
    idiomatic: 'Only metal encroaches upon wood.',
  },
  s0029: {
    literal: '" Ban Gu said: "Generally when craftsmen make wheels and arrows many are damaged and ruined, and when wood becomes strange anomalies —',
    idiomatic: '" Ban Gu said: "Generally when craftsmen make wheels and arrows many are damaged and ruined, and when wood becomes strange anomalies —',
  },
  s0030: {
    literal: '" all of these are wood losing its bending and straightening."',
    idiomatic: '" all of these are wood losing its bending and straightening."',
  },
  s0031: {
    literal: 'Wood Loses Its Bending and Straightening',
    idiomatic: 'Wood Loses Its Straightness and Suppleness',
  },
  s0032: {
    literal: 'In the first month of the sixth year of Huangchu under Emperor Wen of Wei, there was rain and trees iced.',
    idiomatic: 'In the first month of the sixth year of Huangchu under Emperor Wen of Wei, rain fell and encased the trees in ice.',
  },
  s0033: {
    literal: 'Following Liu Xin\'s explanation, this was wood losing its bending and straightening.',
    idiomatic: 'Following Liu Xin\'s explanation, this was wood losing its straightness and suppleness.',
  },
  s0034: {
    literal: 'Liu Xiang said: "Ice is the flourishing of Yin; wood is lesser Yang; it is the image of honored ministers.',
    idiomatic: 'Liu Xiang said: "Ice is the flourishing of Yin; wood is lesser Yang; it is the image of honored ministers.',
  },
  s0035: {
    literal: 'When this person is about to suffer harm, then Yin qi coerces wood; wood first becomes cold; therefore it obtains rain and ice."',
    idiomatic: 'When such an official faces mortal peril, Yin first presses upon wood\'s Yang; the timber turns chill before the freezing rain seals it."',
  },
  s0036: {
    literal: 'That year in the sixth month, soldiers of Licheng commandery, Cai Fang and others, killed Administrator Xu Zhi, held the commandery in rebellion, coerced and plundered widely, and gathered together fugitives.',
    idiomatic: 'That sixth month the Licheng garrison under Cai Fang murdered Prefect Xu Zhi and seized the commandery in revolt, coercing and plundering widely and gathering fugitives.',
  },
  s0037: {
    literal: 'Two commandants were dispatched together with the Inspector of Qing Province to campaign against them and pacify them.',
    idiomatic: 'Two commandants were dispatched together with the Inspector of Qing Province to campaign against them and pacify them.',
  },
  s0038: {
    literal: 'The administrator is the feudal lord of antiquity — the response of honored ministers suffering harm.',
    idiomatic: 'A commandery governor ranked as a feudal lord of old — precisely the ministerial token Liu Xiang had named.',
  },
  s0039: {
    literal: 'One explanation takes icing on trees as the image of armor and weapons.',
    idiomatic: 'Another explanation takes glazed branches as the image of armor and weapons.',
  },
  s0040: {
    literal: 'That year, having already campaigned against Cai Fang, again in the eighth month the Son of Heaven personally led a naval force to campaign against Wu; garrison troops were over a hundred thousand; connected banners stretched several hundred li; viewing troops along the river.',
    idiomatic: 'The same year saw Cai Fang crushed; then in the eighth month the emperor personally led a river fleet against Wu — more than a hundred thousand men and banners unbroken for hundreds of li massed along the bank.',
  },
  s0041: {
    literal: 'In the third year of Taixing under Emperor Yuan of Jin, on the day xinwei of the second month, there was rain and trees iced.',
    idiomatic: 'On the xinwei day of the second month in the third year of Taixing under Emperor Yuan of Jin came freezing rain and ice-rimed trees.',
  },
  s0042: {
    literal: 'Two years later, Zhou Yi, Dai Yuan, Diao Xie, and Liu Kui all met harm — the same sort of affair as in the Spring and Autumn Annals; this was its response.',
    idiomatic: 'Two years later Zhou Yi, Dai Yuan, Diao Xie, and Liu Kui were all killed — the same sort of affair as in the Spring and Autumn Annals; this was its response.',
  },
  s0043: {
    literal: 'One account says: afterward Wang Dun attacked the capital — this too was its portent.',
    idiomatic: 'One account says: afterward Wang Dun attacked the capital — this too was its portent.',
  },
  s0044: {
    literal: 'In the eighth year of Yonghe under Emperor Mu of Jin, on the day yisi of the first month, there was rain and trees iced.',
    idiomatic: 'On the yisi day of the first month in the eighth year of Yonghe under Emperor Mu of Jin, rain fell and trees froze over.',
  },
  s0045: {
    literal: 'That year Yin Hao campaigned north; the next year the army was defeated; in the tenth year he was dismissed and degraded.',
    idiomatic: 'Yin Hao marched north that year; his army collapsed the next, and within ten years he was stripped of rank.',
  },
  s0046: {
    literal: 'It is also said: Xun Xian and Yin Hao campaigned north — this was the portent of Huan Wen entering the passes.',
    idiomatic: 'Commentators also tie the sign to Xun Xian\'s and Yin Hao\'s northern expeditions — the prelude to Huan Wen\'s thrust into Guanzhong.',
  },
  s0047: {
    literal: 'In the fourteenth year of Taiyuan under Emperor Xiaowu of Jin, on the day yisi of the twelfth month, there was rain and trees iced.',
    idiomatic: 'On the yisi day of the twelfth month in the fourteenth year of Taiyuan under Emperor Xiaowu of Jin, freezing rain glazed the trees.',
  },
  s0048: {
    literal: 'The next year in the second month Wang Gong became northern bulwark;',
    idiomatic: 'The following spring Wang Gong took charge of the northern marches;',
  },
  s0049: {
    literal: 'in the eighth month Yu Kai became western bulwark;',
    idiomatic: 'by the eighth month Yu Kai held the western frontier;',
  },
  s0050: {
    literal: 'in the ninth month Wang Guobao became Palace Writer and soon added command of the guards;',
    idiomatic: 'in the ninth month Wang Guobao entered the Palace Secretariat, soon adding command of the capital guards;',
  },
  s0051: {
    literal: 'in the seventeenth year Yin Zhongkan became Inspector of Jing Province.',
    idiomatic: 'within seventeen years Yin Zhongkan gained Jing Province.',
  },
  s0052: {
    literal: 'Although wicked and upright followed different plans, in the end alike they were exterminated together — this was its response.',
    idiomatic: 'Rival camps clashed in principle yet every faction was annihilated alike — this was its response.',
  },
  s0053: {
    literal: 'One account says: although Fu Jian was defeated, the passes and rivers were not yet unified; the Dingling and Xianbei invaded Si and Yan; Dou Yangsheng fanned rebellion and pressed Liang and Yong; military corvées did not cease — this too was its portent.',
    idiomatic: 'One account says: although Fu Jian was defeated, the passes and rivers were not yet unified; the Dingling and Xianbei invaded Si and Yan; Dou Yangsheng fanned rebellion and pressed Liang and Yong; military corvées did not cease — this too was its portent.',
  },
  s0054: {
    literal: 'In the second year of Jianxing under Sun Liang of Wu, when Zhuge Ke campaigned against Huainan, after he set out the ridgepole of the hall where he sat broke in the middle.',
    idiomatic: 'In the second year of Jianxing under Sun Liang of Wu, after Zhuge Ke marched against Huainan the central beam of his audience hall snapped.',
  },
  s0055: {
    literal: 'Ke rashly raised campaigns and corvées, seized the people\'s farming seasons, enacted evil plots, and harmed the state\'s wealth and strength — therefore wood lost its nature and reached destruction and breakage.',
    idiomatic: 'Zhuge Ke had stirred needless wars, seized the farming calendar, and spun treasonous schemes that drained the realm — wood therefore abandoned its nature and shattered his hall.',
  },
  s0056: {
    literal: 'When he turned the army and was executed and extinguished, in the Zhou Changes it was again "the misfortune of a ridgepole bent."',
    idiomatic: 'His retreat ended in execution and clan extinction — the Zhou yi calls such collapse the ill omen of the sagging ridgepole.',
  },
  s0057: {
    literal: 'In the fifth month of the fifth year of Taikang under Emperor Wu of Jin, the earth of Emperor Xuan\'s temple sank and beams broke.',
    idiomatic: 'In the fifth month of the fifth year of Taikang under Emperor Wu of Jin, the floor of Emperor Xuan\'s temple subsided and its beams gave way.',
  },
  s0058: {
    literal: 'In the first month of the eighth year the Grand Temple hall again sank; they rebuilt the temple, digging the foundation down to the springs.',
    idiomatic: 'The first month of the eighth year brought another collapse of the imperial ancestral hall; builders dug a new foundation to the water table.',
  },
  s0059: {
    literal: 'That year in the ninth month they then built anew a temple at distance, bringing celebrated timbers and mixing in bronze pillars.',
    idiomatic: 'That autumn they raised a new shrine elsewhere, importing prized lumber and bronze columns.',
  },
  s0060: {
    literal: 'Chen Xie was master craftsman; those who worked were sixty thousand men.',
    idiomatic: 'Chen Xie directed sixty thousand laborers.',
  },
  s0061: {
    literal: 'In the fourth month of the tenth year it was completed.',
    idiomatic: 'The structure stood finished in the tenth year\'s fourth month.',
  },
  s0062: {
    literal: 'In the eleventh month on the day gengyin the beams again broke.',
    idiomatic: 'Yet on gengyin in the eleventh month the beams snapped again.',
  },
  s0063: {
    literal: 'According to this, sinking earth is the image of division and separation; breaking beams is wood losing its bending and straightening.',
    idiomatic: 'Heaven\'s lesson read partition into the sinking soil and wood\'s failed office into the splintered beams.',
  },
  s0064: {
    literal: 'Sun Sheng said: At that time there was calamitous fire in the rear palace halls, and the temple beams again broke without cause.',
    idiomatic: 'Sun Sheng said: At that time there was calamitous fire in the rear palace halls, and the temple beams again broke without cause.',
  },
  s0065: {
    literal: 'Before this the emperor had often been unwell and grew all the more troubled by it.',
    idiomatic: 'Before this the emperor had often been unwell and grew all the more troubled by it.',
  },
  s0066: {
    literal: 'The next year the emperor died, and the royal house repeatedly fell into chaos and in the end lost the realm.',
    idiomatic: 'The emperor died the next year, and the royal house repeatedly fell into chaos and in the end lost the realm.',
  },
  s0067: {
    literal: 'In the second year of Tai\'an under Emperor Hui of Jin, the Prince of Chengdu Sima Ying had Lu Ji lead forces toward the capital to strike the Prince of Changsha Sima Yi.',
    idiomatic: 'In the second year of Tai\'an under Emperor Hui of Jin, Prince Chengdu Sima Ying sent Lu Ji against Prince Changsha Sima Yi at the capital.',
  },
  s0068: {
    literal: 'When the army had just set out the banner pole snapped; shortly they were defeated in battle; Lu Ji was executed.',
    idiomatic: 'The host had barely marched when the standard mast splintered — soon Lu Ji fell defeated and was executed.',
  },
  s0069: {
    literal: 'Ying then fled in collapse and in the end was ordered to die.',
    idiomatic: 'Ying\'s army melted away, and he himself was ultimately compelled to suicide.',
  },
  s0070: {
    literal: 'Earlier the Prince of Hejian Sima Yong had plotted first to execute the Prince of Changsha, depose the crown prince, and install Ying.',
    idiomatic: 'Earlier Prince Hejian Sima Yong had plotted first to execute Prince Changsha, depose the crown prince, and install Ying.',
  },
  s0071: {
    literal: 'The Prince of Changsha learned of it and executed his faction, Bian Cui and others — therefore Ying came to attack.',
    idiomatic: 'Prince Changsha learned of it and executed his faction, Bian Cui and others — therefore Ying came to attack.',
  },
  s0072: {
    literal: 'Lu Ji also, because Ying had won the hearts of near and far and would become a replacement king for Han, then submitted to Ying and became a general in the ranks of the accomplice.',
    idiomatic: 'Lu Ji also, because Ying had won the hearts of near and far and would become a replacement king for Han, then submitted to Ying and became a general in the ranks of the accomplice.',
  },
  s0073: {
    literal: 'All of these were punishments for treacherous plotting — wood losing its bending and straightening.',
    idiomatic: 'Heaven punished the conspiracy by stripping wood of its bend-and-straight virtue.',
  },
  s0074: {
    literal: 'When Wang Dun was at Wuchang, halberds and paraphernalia under the guard sprouted blossoms like lotus flowers; after five or six days they withered and fell.',
    idiomatic: 'When Wang Dun was at Wuchang, halberds and paraphernalia under the guard sprouted blossoms like lotus flowers; after five or six days they withered and fell.',
  },
  s0075: {
    literal: 'This was wood losing its nature and becoming a transformation.',
    idiomatic: 'Wood had plainly forfeited its proper nature and become a transformation.',
  },
  s0076: {
    literal: 'Gan Bao said: "The bell pavilion is the ritual of the honored;',
    idiomatic: 'Gan Bao said: "The bell pavilion is the ritual of the honored;',
  },
  s0077: {
    literal: 'those under the bell are officials who maintain awe-inspiring bearing.',
    idiomatic: 'those under the bell are officials who maintain awe-inspiring bearing.',
  },
  s0078: {
    literal: 'Now mad blossoms grow on dead wood, moreover within the bell pavilion — this speaks of the fullness of awe-inspiring ritual and the flourishing of glory and splendor, all like the blooming of mad blossoms, unable to endure long."',
    idiomatic: 'Now freak blossoms grow on dead timber beside the headquarters bell — this speaks of the fullness of awe-inspiring ritual and the flourishing of glory and splendor, all flashing as briefly as those unnatural flowers."',
  },
  s0079: {
    literal: 'Afterward he in the end by disobedient mandate met ruin, and after death corporal punishment was added — this was its response.',
    idiomatic: 'Wang Dun later died in rebellion and suffered posthumous mutilation for defying the throne — this was its response.',
  },
  s0080: {
    literal: 'One explanation takes this as the calamity of blossoms; in the Zhou Changes it is "withered poplar sprouts blossoms."',
    idiomatic: 'Another reading classes it among floral prodigies — the Zhou yi image of fresh blossoms on a withered poplar.',
  },
  s0081: {
    literal: 'When Huan Xuan first usurped, the dragon-banner pole snapped.',
    idiomatic: 'As Huan Xuan seized the throne, the great dragon standard broke.',
  },
  s0082: {
    literal: 'At that time Xuan hunted in coming and going without cease day and night, ate and drank extravagantly, earth and water works harmed farming, and there were many treacherous plots — therefore wood lost its nature.',
    idiomatic: 'He hunted without restraint day and night, feasted extravagantly, and pressed construction works that tore peasants from their fields while intrigue multiplied — wood therefore lost its nature.',
  },
  s0083: {
    literal: 'The banner is what displays the three luminaries and manifests brightness.',
    idiomatic: 'The banner displays the Three Lights of sovereignty and manifests brightness.',
  },
  s0084: {
    literal: 'Breaking the banner pole means the lofty brightness departs.',
    idiomatic: 'A shattered mast meant manifest legitimacy had departed.',
  },
  s0085: {
    literal: 'He held office eighty days and was defeated.',
    idiomatic: 'He held office eighty days and was defeated.',
  },
  s0086: {
    literal: 'In the second year of Taishi under Emperor Ming of Song, on the day bingwu of the fifth month, at Huangcheng Mountain in Linyi, Nanlangya, the Daoist Sheng Daodu\'s hall had one pillar spontaneously glow, its light illuminating the chamber at night.',
    idiomatic: 'On bingwu day in the fifth month of the second year of Taishi under Emperor Ming of Song, at Huangcheng Mountain in Linyi, Nanlangya, one pillar of the Daoist Sheng Daodu\'s hall spontaneously glowed, its light illuminating the chamber at night.',
  },
  s0087: {
    literal: 'This was wood losing its nature.',
    idiomatic: 'Wood had plainly lost its nature.',
  },
  s0088: {
    literal: 'Some say rotted wood naturally glows.',
    idiomatic: 'Some say rotted wood naturally glows.',
  },
  s0089: {
    literal: 'In the first year of Shengming under the Deposed Emperor, at Sheting in Yuhang, Wuxing, a hetong tree bore plum fruit.',
    idiomatic: 'In the first year of Shengming under the Deposed Emperor, at Sheting in Yuhang, Wuxing, a hetong tree bore plum fruit.',
  },
  s0090: {
    literal: 'The hetong tree is what the common people call the hutui tree.',
    idiomatic: 'The hetong tree is what the common people call the hutui tree.',
  },
  s0091: {
    literal: 'Improper Bearing',
    idiomatic: 'Bearing Lacks Respect',
  },
  s0092: {
    literal: 'At the beginning of Emperor Wen of Wei\'s period of mourning for his father, he repeatedly went out hunting and sporting; his bearing lacked weight; the prevailing fashion favored easy unconventionality.',
    idiomatic: 'At the beginning of Emperor Wen of Wei\'s period of mourning for his father, he repeatedly went out hunting and sporting; his bearing lacked weight; the prevailing fashion favored easy unconventionality.',
  },
  s0093: {
    literal: 'Therefore Dai Ling suffered punishment for direct remonstrance, and Bao Xun received the extreme penalty for opposing the imperial will.',
    idiomatic: 'Therefore Dai Ling suffered punishment for direct remonstrance, and Bao Xun received the extreme penalty for opposing the imperial will.',
  },
  s0094: {
    literal: 'All under Heaven were transformed by it and alike despised maintaining propriety — this was bearing lacking respect.',
    idiomatic: 'All under Heaven were transformed by it and alike despised maintaining propriety — this was bearing lacking respect.',
  },
  s0095: {
    literal: 'Therefore his enjoyment of the realm was not long-lasting and the later fortune was brief.',
    idiomatic: 'Therefore his enjoyment of the realm was not long-lasting and the later fortune was brief.',
  },
  s0096: {
    literal: 'In the Spring and Autumn Annals, the lord of Lu during mourning was not mournful; while in grief he yet had a pleasing countenance; Mu Shu called this lacking measure, and afterward he finally fled into exile.',
    idiomatic: 'In the Spring and Autumn Annals, the lord of Lu during mourning was not mournful; while in grief he yet had a pleasing countenance; Mu Shu called this lacking measure, and afterward he finally fled into exile.',
  },
  s0097: {
    literal: 'Generally it was the same sort of affair.',
    idiomatic: 'Generally it was the same sort of affair.',
  },
  s0098: {
    literal: 'Deng Yang of Wei, Master of Writing, walked loose-limbed and reckless — sinews not binding the body; sitting and rising he leaned and slouched as if without hands or feet.',
    idiomatic: 'Deng Yang of Wei, Master of Writing, walked loose-limbed and reckless — sinews not binding the body; sitting and rising he leaned and slouched as if without hands or feet.',
  },
  s0099: {
    literal: 'This was bearing lacking respect.',
    idiomatic: 'This was bearing lacking respect.',
  },
  s0100: {
    literal: 'Guan Lu called it ghost restlessness.',
    idiomatic: 'Guan Lu called it ghost restlessness.',
  },
};

let updated = 0;
for (const s of data.sentences) {
  const t = T[s.id];
  if (!t) {
    console.error('Missing translation for', s.id);
    process.exit(1);
  }
  if (!s.literal?.trim() || !s.idiomatic?.trim()) {
    s.literal = t.literal;
    s.idiomatic = t.idiomatic;
    updated++;
  }
}
fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log(`Updated ${updated} sentences in ${path}`);
