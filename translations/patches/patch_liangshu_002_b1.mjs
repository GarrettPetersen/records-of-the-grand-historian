#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 2, Basic Annals 2',
    'Book of Liang, Volume 2, Annals 2',
  ],
  s0002: [
    'Emperor Wu, Part 2',
    'Emperor Wu, Middle Period',
  ],
  s0003: [
    'In the fourth month, day bingyin, summer of the first year of Tianjian, Gaozu assumed the imperial throne at the Southern Suburbs.',
    'On bingyin day in the fourth month of Tianjian 1 (502 CE), Gaozu took the throne at the Southern Suburbs.',
  ],
  s0004: [
    'They set up an altar and burnt sacrificial wood, announcing to Heaven: "The Emperor, your servant Yan, dares to use a black bullock to declare clearly to August Heaven and August Lord: The Qi dynasty\'s allotted span has ended; when obstruction ends, prosperity follows; reverently following Heaven\'s response, the mandate is conferred upon Yan.',
    'An altar was raised and sacrificial wood burned as he announced to Heaven, "Your servant Yan, Emperor, dares with a black bullock to declare to August Heaven: Qi\'s allotted time is spent; obstruction has given way to prosperity; following Heaven\'s sign, the mandate falls to Yan.',
  ],
  s0005: [
    'In appointing those who govern the people, only the capable are granted office;',
    'To govern the people, office goes only to the capable;',
  ],
  s0006: [
    'Heaven\'s mandate is not fixed, and emperors and kings are not confined to one lineage.',
    'Heaven\'s mandate is not constant, and rulers need not come from one clan.',
  ],
  s0007: [
    'Tang yielded to Yu\'s acceptance, Han replaced Wei and rose, extending to Jin and Song—the pattern is set in antiquity.',
    'Tang gave way to Yu, Han rose in Wei\'s place, and Jin and Song followed—the precedent runs deep.',
  ],
  s0008: [
    'All governed the four seas with sovereign virtue, owed their founding achievement to the myriad people, and thus could greatly shelter the common folk and gloriously possess the realm.',
    'Each ruled the realm by virtue, owed his founding to the people, sheltered the masses, and held the land in glory.',
  ],
  s0009: [
    'The Qi age reached its twilight; the ruling lord was benighted and cruel; cunning evil men were exalted and indulged, spreading their treachery and violent disorder to afflict our state, making all under Heaven tremble as if about to plunge into a deep abyss.',
    'Qi entered its decline under a benighted, cruel ruler who exalted wicked men; treachery and violence spread through the realm until all under Heaven seemed ready to fall into an abyss.',
  ],
  s0010: [
    'Within the nine domains and eight wilds, regional governors and frontier lords kowtowed with foreheads to earth, found no means of rescue, slept on firewood awaiting the fire, and had no way to appeal to Heaven.',
    'Across the realm, governors and frontier lords bowed low, could find no remedy, lay on kindling waiting for the blaze, and had no recourse to Heaven.',
  ],
  s0011: [
    'Yan threw up his sleeves and set forth at star-rise, driving his spear-points ten thousand li, steeling his resolve to resign office, to deliver the people from their urgent distress.',
    'Yan flung up his sleeves and marched at once, driving his spears ten thousand li, hardened in his resolve to lay down office and save the people from urgent peril.',
  ],
  s0012: [
    'Biting gall he swore the multitude, overturned sharp blades and slaughtered the stubborn, established a rightful sovereign, and cut down benighted disorder.',
    'He swore the host with gall between his teeth, broke sharp ranks and cut down the hard, raised a rightful ruler, and swept away benighted chaos.',
  ],
  s0013: [
    'He then seized the moment to govern the state, brought ease to the people and peace to the age, and truly earned his merit.',
    'Seizing the moment, he governed the realm, brought ease to the people and peace to the age, and truly earned his merit.',
  ],
  s0014: [
    'Solar and stellar omens appeared auspicious, rivers and mountains yielded blessings, morning and evening came reports from the frontier pastures, day and night from the capital suburbs.',
    'Heavenly signs turned auspicious, rivers and mountains sent blessings, and reports flowed morning and evening from the frontiers and the capital.',
  ],
  s0015: [
    'The signs of dynastic change were manifest, the time for transformation had gathered; foreign customs and the hundred barbarians sent tribute through repeated translation; men and spirits near and far all joined in harmony.',
    'The omens of dynastic change were clear, the hour of revolution had come, distant peoples sent tribute through many translators, and men and spirits near and far all joined in accord.',
  ],
  s0016: [
    'Thereupon the assembled lords, ministers, and officials all offered their sincerity, saying that August Heaven had lowered its mandate—humility could not refuse it.',
    'Then lords, ministers, and officials all pledged their loyalty, saying Heaven had lowered the mandate and modest refusal was impossible.',
  ],
  s0017: [
    'The Qi emperor cast off his realm like casting off worn shoes and handed over the sacred regalia.',
    'The Qi emperor cast off the realm like worn shoes and surrendered the imperial regalia.',
  ],
  s0018: [
    'Yan reflected on his lack of virtue but his refusal was not accepted.',
    'Yan judged himself unworthy, but his refusal was not accepted.',
  ],
  s0019: [
    'Pressed from above by Heaven\'s favor, considering below the hearts of the hundred millions—the throne could not long stand empty, the people and spirits could not lack a lord—he therefore accepted this blessed fortune through the people\'s willing acclaim.',
    'Heaven pressed from above, the people pressed from below; the throne could not stand empty, the realm could not lack a ruler—so he accepted the mandate through the people\'s willing acclaim.',
  ],
  s0020: [
    'With such scant virtue he ascended to rule the ten thousand directions, looking back to his long-held aims, ever speaking with reverent caution.',
    'With scant virtue he took the throne over all lands, mindful of his old resolve, ever reverent and cautious.',
  ],
  s0021: [
    'Respectfully selecting the auspicious day, reverently performing this great rite, ascending the altar to receive abdication, announcing to the Supreme Lord, he might spread blessings, magnify the glorious achievement, transmit it to posterity, and forever preserve our Liang.',
    'On the chosen day he performed the great rite, ascended the altar to receive abdication, and announced to Heaven his hope to spread blessing, magnify the achievement, pass it to posterity, and forever preserve Liang.',
  ],
  s0022: [
    'May the bright spirits partake of this offering."',
    'May the bright spirits accept this offering."',
  ],
  s0023: [
    'When the rites were complete, with full imperial equipage he entered Jiankang Palace and took his seat at the Hall of Supreme Ultimate.',
    'When the rites ended, he entered Jiankang Palace with full imperial escort and took his seat in the Hall of Supreme Ultimate.',
  ],
  s0024: [
    'An edict said: "The Five Essences succeed one another—this is how emperors and kings receive the mandate;',
    'An edict said, "The Five Essences pass in turn—that is how emperors and kings receive the mandate;',
  ],
  s0025: [
    'When the four seas gladly acclaim one—such was how Yin and Zhou changed the regime.',
    'when the four seas gladly acclaim one—that is how Yin and Zhou changed the throne.',
  ],
  s0026: [
    'Though abdication and replacement differ and the times of encounter vary, the faint and bright alternating in use—the current runs far back.',
    'Though abdication and succession differ and times change, the pattern of light and shadow alternating runs far back.',
  ],
  s0027: [
    'None failed to revive the people and nourish virtue, spreading their light over the common folk.',
    'None failed to revive the people, nurture virtue, and spread their light over the common folk.',
  ],
  s0028: [
    'I am obscure and dim; my mandate did not come early; the work of settling the realm falls to this present fortune; seizing this moment, conforming my heart to the ten thousand things, I restored the slackened bonds, greatly remade the Central Xia—forever speaking of the paths of old, in righteousness I am equally shamed by virtue.',
    'I am obscure and untested; the work of settling the realm falls to this hour; seizing the moment, I restored slackened bonds and remade the Central Xia—yet beside the paths of old I feel my virtue wanting.',
  ],
  s0029: [
    'The Qi clan\'s dynastic term had its end and limit; the reckoning of fate was said to change; reverently following former records, the great mandate gathered upon my person.',
    'Qi\'s allotted span had reached its limit, the reckoning of fate had turned, and reverently following precedent the great mandate gathered on me.',
  ],
  s0030: [
    'Reflecting on my slight virtue, my refusal did not win consent; with deep reverence for the Supreme Spirit, I accepted the bright enterprise.',
    'Knowing my slight virtue, I could not refuse; in awe of Heaven I accepted the bright enterprise.',
  ],
  s0031: [
    'Performing the rites of burnt offerings, matching the fortune of the capable, following in the tracks of the hundred kings, ruling the four seas—I am as one crossing a great river, not knowing where to ford.',
    'Having performed the burnt-offering rites and taken up the throne of the capable, I follow the hundred kings and rule the four seas like a man crossing a great river without knowing where to land.',
  ],
  s0032: [
    'The great foundation is newly begun, the myriad things are in their first rising; I think to let blessed favor spread and drench all within the realm.',
    'The great foundation is newly laid and the myriad things just rising; I wish to spread blessing through the whole realm.',
  ],
  s0033: [
    'A general amnesty for the empire may be granted.',
    'A general amnesty is granted for the empire.',
  ],
  s0034: [
    'Change Qi Zhongxing year 2 to Tianjian year 1.',
    'Qi Zhongxing 2 is changed to Tianjian 1.',
  ],
  s0035: [
    'Bestow two ranks of nobility upon the people;',
    'The people are granted two ranks of nobility;',
  ],
  s0036: [
    'Advance civil and military officials two ranks;',
    'civil and military officials are advanced two ranks;',
  ],
  s0037: [
    'To widowers, widows, orphans, and solitaries unable to support themselves, five hu of grain per person.',
    'widowers, widows, orphans, and the destitute receive five hu of grain each.',
  ],
  s0038: [
    'Arrears in cloth levies, head taxes, and old debts shall no longer be collected.',
    'Arrears in cloth levies, head taxes, and old debts are forgiven.',
  ],
  s0039: [
    'Those guilty under local moral verdicts—corruption, debauchery, theft—shall all be wiped clean, previous records erased, and given a fresh start."',
    'Those condemned for corruption, debauchery, or theft under local moral verdicts are pardoned, their records erased, and given a fresh start."',
  ],
  s0040: [
    'Enfeoff the Qi emperor as Prince of Baling, with full revenue of one commandery.',
    'The Qi emperor is enfeoffed as Prince of Baling with the full revenue of one commandery.',
  ],
  s0041: [
    'Bearing the imperial banner and riding in the five-seasons escort chariots.',
    'He bears the imperial banner and rides in the five-season escort chariots.',
  ],
  s0042: [
    'Follow Qi\'s calendar.',
    'He follows Qi\'s calendar.',
  ],
  s0043: [
    'Sacrifices to Heaven and Earth, ritual, music, and institutions—all use Qi precedents.',
    'Sacrifices to Heaven and Earth, ritual, music, and institutions all follow Qi precedent.',
  ],
  s0044: [
    'Qi Empress Xuande was made consort to Qi Emperor Wen; Qi Empress Wang was made Princess of Baling.',
    'Qi Empress Xuande became consort to Qi Emperor Wen, and Qi Empress Wang became Princess of Baling.',
  ],
  s0045: [
    'An edict said: "The rise and fall of fortune—former dynasties had their old rules.',
    'An edict said, "The rise and fall of fortune was governed by old rules in former dynasties.',
  ],
  s0046: [
    'Qi-era princes and marquises and their enfeoffments shall all be reduced.',
    'Qi-era princes, marquises, and their enfeoffments are all reduced.',
  ],
  s0047: [
    'Those whose merit in hardship was outstanding shall receive separate later orders.',
    'Those who showed outstanding merit in hardship will receive separate orders later.',
  ],
  s0048: [
    'Only the Song Prince of Ruyin is excluded from this reduction.',
    'Only the Song Prince of Ruyin is exempt from this reduction.',
  ],
  s0049: [
    'Another edict said: "As the great fortune newly rises and auspicious celebration begins, remnant captives from banditry held in government offices may all be released.',
    'Another edict said, "As the new fortune rises and celebration begins, captives taken from bandits and held in government offices may all be released.',
  ],
  s0050: [
    'All households subjected to exile shall be permitted to return home."',
    'All exiled households are permitted to return home."',
  ],
  s0051: [
    'Posthumously honor the Late Emperor\'s father as Emperor Wen, temple name Taizu;',
    'The Late Emperor\'s father is posthumously honored as Emperor Wen, temple name Taizu;',
  ],
  s0052: [
    'The Late Emperor\'s mother as Empress Xian.',
    'and his mother as Empress Xian.',
  ],
  s0053: [
    'Posthumously give the consort Lady Chi the title Empress De.',
    'Consort Lady Chi is posthumously titled Empress De.',
  ],
  s0054: [
    'Posthumously enfeoff elder brother Yi, Grand Tutor, as Prince of Changsha, posthumous title Xuanwu;',
    'Elder brother Yi, Grand Tutor, is posthumously enfeoffed Prince of Changsha with posthumous title Xuanwu;',
  ],
  s0055: [
    'Qi Rear Army Advisory Aide Fu as Prince of Yongyang, posthumous title Zhao;',
    'Qi Rear Army Advisory Aide Fu as Prince of Yongyang, posthumous title Zhao;',
  ],
  s0056: [
    'Younger brother Qi Grand Master of Ceremonies Chang as Prince of Hengyang, posthumous title Xuan;',
    'younger brother Qi Grand Master of Ceremonies Chang as Prince of Hengyang, posthumous title Xuan;',
  ],
  s0057: [
    'Qi Bearer of the Yellow Gate Rong as Prince of Guiyang, posthumous title Jian.',
    'and Qi Bearer of the Yellow Gate Rong as Prince of Guiyang, posthumous title Jian.',
  ],
  s0058: [
    'That day, an edict enfeoffed fifteen civil and military merit officials including newly appointed General of Chariots and Cavalry Xiahou Xiang as dukes and marquises, fiefs varying in size.',
    'That day an edict enfeoffed fifteen civil and military merit officials, including newly appointed General of Chariots and Cavalry Xiahou Xiang, as dukes and marquises with fiefs of varying size.',
  ],
  s0059: [
    'Younger brother Hong, Central Army Protector, was made Yangzhou Inspector and enfeoffed Prince of Linchuan;',
    'Younger brother Hong, Central Army Protector, was made Yangzhou inspector and enfeoffed Prince of Linchuan;',
  ],
  s0060: [
    'Xiu, South Xu province Inspector, Prince of Ancheng;',
    'Xiu, South Xu province inspector, Prince of Ancheng;',
  ],
  s0061: [
    'Wei, Yong province Inspector, Prince of Jian\'an;',
    'Wei, Yong province inspector, Prince of Jian\'an;',
  ],
  s0062: [
    'Hui, Left Guard General, Prince of Poyang;',
    'Hui, Left Guard General, Prince of Poyang;',
  ],
  s0063: [
    'Dan, Jing province Inspector, Prince of Shixing.',
    'and Dan, Jing province inspector, Prince of Shixing.',
  ],
  s0064: [
    'On dingmao, General Who Leads the Army Wang Mao was additionally given the title General Who Stabilizes the Army.',
    'On dingmao, General Who Leads the Army Wang Mao was additionally made General Who Stabilizes the Army.',
  ],
  s0065: [
    'Palace Director Wang Liang was made Director of the Masters of Writing and Central Army General; Chancellor of State Left Chief Clerk Wang Ying was made Palace Director and Pacification Army General; Minister of Personnel Shen Yue was made Vice Director of the Masters of Writing; Chief Concurrent Palace Attendant Fan Yun was made Cavalier Attendant-in-Ordinary and Minister of Personnel.',
    'Palace Director Wang Liang became Director of the Masters of Writing and Central Army General; Chancellor of State Left Chief Clerk Wang Ying became Palace Director and Pacification Army General; Minister of Personnel Shen Yue became Vice Director of the Masters of Writing; Chief Concurrent Palace Attendant Fan Yun became Cavalier Attendant-in-Ordinary and Minister of Personnel.',
  ],
  s0066: [
    'An edict said: "Since the Song dynasty, extravagance ran unchecked; the wealth emptied from the palace swelled to thousands.',
    'An edict said, "Since Song, extravagance ran unchecked until the wealth drained from the palace reached thousands.',
  ],
  s0067: [
    'Calculating across the five capitals, the sorrow and impoverishment filled the four seas; all suffered wrongful affliction, confinement and coercion in countless forms.',
    'Across the five capitals, sorrow and poverty filled the four seas; all suffered wrongful harm, confinement, and coercion in countless forms.',
  ],
  s0068: [
    'Touching strings and commanding pipes—good families received no exemption;',
    'Musicians were pressed from good families without exemption;',
  ],
  s0069: [
    'In weaving rooms and embroidery chambers, women in secluded hardship were still pressed to labor.',
    'in weaving rooms and embroidery chambers, women in hidden hardship were still forced to labor.',
  ],
  s0070: [
    'Harm to the state and injury to harmony—nothing surpasses this.',
    'Nothing harmed the state and disrupted harmony more than this.',
  ],
  s0071: [
    'All palace women\'s quarters, music offices, Western Release, Violent Chamber, and all such cases shall entirely be discharged.',
    'All palace women\'s quarters, music offices, Western Release, Violent Chamber, and all such cases are to be discharged.',
  ],
  s0072: [
    'If aged and unable to support themselves, the government shall supply grain rations."',
    'Those too old to support themselves are to receive grain from the government."',
  ],
  s0073: [
    'On jisi, Palace Grandee Zhang Gui was made Right Palace Grandee.',
    'On jisi, Palace Grandee Zhang Gui was made Right Palace Grandee.',
  ],
  s0074: [
    'On gengwu, General Who Stabilizes the South and Jiangzhou Inspector Chen Bozhi was promoted to General Who Conquers the South.',
    'On gengwu, General Who Stabilizes the South and Jiangzhou inspector Chen Bozhi was promoted to General Who Conquers the South.',
  ],
  s0075: [
    'An edict said: "Observing the wind and examining custom—enlightened rulers had grand models;',
    'An edict said, "Observing the wind and examining custom was the grand model of enlightened rulers;',
  ],
  s0076: [
    'Hunting on the sacred mountains and touring the regions—illumined kings had great precedents.',
    'hunting on the sacred mountains and touring the regions was the great precedent of illumined kings.',
  ],
  s0077: [
    'Thus when Chonghua ruled on high, the five ranks were thereby regulated;',
    'Thus when Chonghua ruled, the five ranks were put in order;',
  ],
  s0078: [
    'When Wenming laid the foundation, over four years he traveled them.',
    'when Wenming laid the foundation, he traveled the realm for four years.',
  ],
  s0079: [
    'Thus could he seek out the obscure and subtle, take fisherfolk and butchers to his ear and eye, bring royal enterprise to bright splendor, and spread pure custom to the far and near.',
    'Thus he could seek out the obscure, take fisherfolk and butchers into his counsel, bring royal enterprise to splendor, and spread pure custom far and near.',
  ],
  s0080: [
    'I am scant and slight, ignorant of governance, relying on the fortune of dynastic end, bearing the weight of the mandate\'s sign—taking warning from antiquity, trembling as one who drives rotten wood.',
    'I am slight and untested, ignorant of governance, bearing the weight of the mandate at a dynastic turning point—taking warning from antiquity, I tremble like one driving rotten wood.',
  ],
  s0081: [
    'I think how to revive the people and nourish virtue, replace killing with overcoming cruelty, loosen the net and spread it anew, placing all in benevolence and longevity;',
    'I seek to revive the people and nurture virtue, replace killing with mercy, loosen the net and spread it anew, and place all in benevolence and long life;',
  ],
  s0082: [
    'Yet my illumination is shamed by its failure to reach far, my wisdom does not compass all things; moreover the year is not easy, and I have not yet been able to set out on tour—speaking of it, I am vigilant evening and morning, never forgetting even in sleep.',
    'yet my light does not reach far enough, my wisdom does not compass all things, and this hard year leaves no time for a tour—I am vigilant evening and morning and cannot forget it even in sleep.',
  ],
  s0083: [
    'Palace attendants may be dispatched to everywhere survey the four directions, observe government and hear songs, visit the worthy and recommend the stalled.',
    'Palace attendants are to be sent out to survey the four directions, observe government and hear folk songs, visit the worthy, and recommend the stalled.',
  ],
  s0084: [
    'Where fields lie uncultivated, lawsuits lack standards, public duty is forgotten for private gain, or oppression is the sole pursuit—all shall be reported as matters arise.',
    'Where fields lie fallow, lawsuits lack standards, public duty is sacrificed to private gain, or oppression is the sole pursuit—all is to be reported as it arises.',
  ],
  s0085: [
    'If one hides treasure and loses the state, hoards talent awaiting its price, stores repute and conceals truth, seeking no renown—each shall be memorialized by name, none left out or concealed.',
    'If one hides talent and loses the state, hoards ability awaiting its price, stores repute and conceals truth, seeking no renown—each is to be memorialized by name, none omitted or concealed.',
  ],
  s0086: [
    'Where the imperial carriage reaches, it shall be as if I viewed it in person."',
    'Where the imperial carriage reaches, it shall be as if I saw it myself."',
  ],
  s0087: [
    'Another edict said: "Using metal to redeem punishment was known from old; paying silk to avoid penalty was applied in the middle age—the people delighted in the law\'s operation, nothing was more esteemed.',
    'Another edict said, "Redeeming punishment with metal was known from old, and paying silk to avoid penalty was used in the middle age—the people delighted in the law, and nothing was more esteemed.',
  ],
  s0088: [
    'Long have I spoken of the declining age—pettiness became the wind; infants falling into guilt, the paths thereof are not one.',
    'Long have I lamented the declining age, when pettiness became the wind and even infants fell into guilt by many paths.',
  ],
  s0089: [
    'Documents cutting off evils daily entangle my hearing and sight;',
    'Documents cutting off abuses daily crowd my hearing and sight;',
  ],
  s0090: [
    'Fetter and cangue punishments year upon year pile in the prisons.',
    'fetter and cangue punishments pile year upon year in the prisons.',
  ],
  s0091: [
    'The dead cannot live again; the punished have no means to return on their own—from this how can one expect the population to increase and fields to thrive?',
    'The dead cannot live again, and the punished cannot return on their own—how then can the population grow and the fields flourish?',
  ],
  s0092: [
    'I am vigilantly thoughtful of governance evening by evening, intent on elevating the art of rule, weighing the former kings and selecting their fine statutes—what can serve as law and model for the realm, none shall fail to follow it.',
    'I think of governance every evening, intent on elevating the art of rule, weighing the former kings and choosing their fine statutes—what can serve as law for the realm, none shall fail to follow.',
  ],
  s0093: [
    'Release a shamed heart before the four seas, declare sincerity and plainness to the ten thousand things.',
    'I would release shame before the four seas and declare plain sincerity to the ten thousand things.',
  ],
  s0094: [
    'Custom has been false long; prohibitions and nets grow ever more numerous.',
    'Custom has long been false, and prohibitions and nets grow ever more numerous.',
  ],
  s0095: [
    'Four hundred years since Han Wendi—how distant already.',
    'Four hundred years have passed since Han Wendi—how distant that seems.',
  ],
  s0096: [
    'Though I reduce affairs and clear the heart, not forgetting daily use, yet entrusting the reins and abandoning plans—the matter has not yet been achieved.',
    'Though I reduce affairs and clear the heart, not forgetting daily governance, the plan to loosen the reins has not yet been achieved.',
  ],
  s0097: [
    'We may follow Zhou and Han old statutes—those guilty may redeem by payment; details shall be set out as articles and submitted in due time."',
    'We may follow Zhou and Han old statutes and allow the guilty to redeem by payment; detailed articles are to be drawn up and submitted in due time."',
  ],
  s0098: [
    'On xinwei, Central Army Commander Cai Daogong was made Si province Inspector.',
    'On xinwei, Central Army Commander Cai Daogong was made Si province inspector.',
  ],
  s0099: [
    'The newly dismissed Duke of Xiemu county Xiao Baoyi was made Prince of Baling, to maintain Qi ancestral rites.',
    'The newly dismissed Duke of Xiemu county Xiao Baoyi was made Prince of Baling to maintain Qi ancestral rites.',
  ],
  s0100: [
    'Restore Nan Lanling\'s Wujin county according to former dynasties\' statutes.',
    'Nan Lanling\'s Wujin county was restored according to former dynasties\' statutes.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_002_b1.mjs <translation.json>'
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
