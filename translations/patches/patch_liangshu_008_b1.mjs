#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 8, Biographies 2',
    'Book of Liang, Volume Eight, Biographies, Second',
  ],
  s0002: [
    'Crown Prince Zhaoming; Crown Prince Ai; Crown Prince Huai',
    'Crown Prince Zhaoming; the Grieving Crown Prince; the Lamenting Crown Prince',
  ],
  s0003: [
    'From birth the crown prince was clever and perspicacious; at three he received the Classic of Filial Piety and the Analects, at five he read through the Five Classics in full and could all chant them from memory.',
    'The crown prince was bright from birth; at three he studied the Classic of Filial Piety and the Analects, at five he had read the Five Classics through and could recite them all.',
  ],
  s0004: [
    'In the fifth year, fifth month, day gengxu, he first went out to dwell in the Eastern Palace.',
    'In year five, on the fifth month\'s gengxu day, he first took up residence in the Eastern Palace.',
  ],
  s0005: [
    'The crown prince by nature was humane and filial; from leaving the palace he constantly thought longingly and was unhappy.',
    'By nature the crown prince was humane and filial; once he left the palace grounds he pined constantly and was never at ease.',
  ],
  s0006: [
    'Gaozu knew this; every fifth day he attended court once, often keeping him at Yongfu Ward, sometimes five days or three before returning to the palace.',
    'Gaozu knew it: court was held every five days, and he often kept the heir at Yongfu Ward—or only let him return after three or five days.',
  ],
  s0007: [
    'In the ninth month of the eighth year, at Shou\'an Hall he lectured on the Classic of Filial Piety and fully penetrated its great meaning.',
    'In the ninth month of year eight he lectured on the Classic of Filial Piety in Shou\'an Hall and mastered its main meaning.',
  ],
  s0008: [
    'When the lecture ended, he personally performed the libation sacrifice at the Imperial Academy.',
    'When the lecture ended he personally offered the libation sacrifice at the Imperial Academy.',
  ],
  s0009: [
    'On the first morning of the first month of the fourteenth year, Gaozu faced the hall and capped the crown prince in the Hall of Supreme Ultimate.',
    'At dawn on New Year\'s Day of year fourteen Gaozu faced the hall and capped the crown prince in the Hall of Supreme Ultimate.',
  ],
  s0010: [
    'By old regulation the crown prince wore the Far-Wandering cap, with golden cicada and emerald tassels and ribbons;',
    'By old custom the crown prince wore the Far-Wandering cap with golden cicada and emerald tassels and ribbons;',
  ],
  s0011: [
    'at this time an edict added the golden Boshan ornament.',
    'now an edict added the golden Boshan ornament.',
  ],
  s0012: [
    'The crown prince had a fine countenance and graceful bearing.',
    'The crown prince was handsome in face and graceful in bearing.',
  ],
  s0013: [
    'In reading, several lines came down together; what passed his eye he all remembered.',
    'He read several lines at a glance and remembered whatever passed his eyes.',
  ],
  s0014: [
    'Whenever at feasts or parting rites he composed poetry to as many as ten rhyme groups.',
    'At feasts or parting rites he would compose poems in as many as ten rhyme groups.',
  ],
  s0015: [
    'Sometimes he was ordered to make impromptu rhyme compositions and would complete them as thought flowed, with nothing to change.',
    'Sometimes ordered to improvise rhymed verse, he finished at once as thought came, without a single revision.',
  ],
  s0016: [
    'Gaozu greatly spread Buddhism and personally lectured on it;',
    'Gaozu greatly promoted Buddhism and lectured on it himself;',
  ],
  s0017: [
    'the crown prince also deeply believed in the Three Treasures and read through all the sutras.',
    'the crown prince also revered the Three Treasures and read through all the sutras.',
  ],
  s0018: [
    'He then within the palace separately established Huiyi Hall, devoted solely to assemblies of the Dharma.',
    'He then built Huiyi Hall within the palace, set apart solely for Dharma gatherings.',
  ],
  s0019: [
    'He drew in famous monks; discussions never ceased.',
    'He drew in eminent monks, and doctrinal discussion never ceased.',
  ],
  s0020: [
    'The crown prince himself set forth doctrines of the Two Truths and Dharma-body, both with fresh meaning.',
    'The crown prince himself framed doctrines of the Two Truths and the Dharma-body, each with fresh insight.',
  ],
  s0021: [
    'In the fourth month of the first year of Putong, sweet dew fell on Huiyi Hall; all took it as a response to supreme virtue.',
    'In the fourth month of Putong year one sweet dew fell on Huiyi Hall; all deemed it a response to supreme virtue.',
  ],
  s0022: [
    'In the eleventh month of the third year, Prince Xing of Shixing died.',
    'In the eleventh month of year three Prince Xing of Shixing died.',
  ],
  s0023: [
    'By former precedent, because Eastern Palace ritual cuts off collateral kin, letters and memorials all followed ordinary rites.',
    'Formerly, because Eastern Palace ritual severs collateral kin, letters and memorials all followed ordinary usage.',
  ],
  s0024: [
    'The crown prince thought this doubtful and ordered his secretary Liu Xiaochuo to deliberate the matter.',
    'The crown prince found this doubtful and ordered his secretary Liu Xiaochuo to deliberate it.',
  ],
  s0025: [
    'Xiaochuo\'s deliberation said: "According to Zhang Jing\'s compilation Eastern Palace Ritual Record, it states, \'For those who begin mourning at the three audiences, for more than a month music is not performed;',
    'Xiaochuo wrote: "Zhang Jing\'s Eastern Palace Ritual Record says, \'For mourning begun at the three audiences, for more than a month music is not performed;',
  ],
  s0026: [
    'drums and pipes cease performance, and the limit on dress is likewise.\'"',
    'drums and pipes cease, and the dress limit is the same.\'"',
  ],
  s0027: [
    'Seeking the meaning of cutting off collateral kin, the meaning lies in removing mourning dress; dress may be stripped away, but can feeling be without grief?',
    'The sense of severing collateral kin is that mourning dress ends; dress may be removed, but feeling cannot be stripped of grief.',
  ],
  s0028: [
    'The striking of gongs and songs ceasing performance is truly also for this.',
    'Halting gongs and songs is truly for this reason as well.',
  ],
  s0029: [
    'Since there is feeling of grief, one should style it "combined mourning"; after the wailing sacrifice, follow custom in performing music, calling grief ended—this principle and precedent accord.',
    'Where grief remains, one should call it combined mourning; after the wailing sacrifice music may resume as usual, grief being ended—principle and precedent agree.',
  ],
  s0030: [
    'It is held that one should still style it combined mourning until the wailing sacrifice."',
    'He held that combined mourning should still be named until the wailing sacrifice."',
  ],
  s0031: [
    'Vice Director Xu Mian, Left Leader Zhou She, and Household Intendant Lu Xiang all agreed with Xiaochuo\'s deliberation.',
    'Vice Director Xu Mian, Left Leader Zhou She, and Household Intendant Lu Xiang all sided with Xiaochuo.',
  ],
  s0032: [
    'The crown prince\'s order said: "Zhang Jing\'s Ritual Record says, \'According to the Rites of the Scholar, after full mourning for a month one styles mourning tribute.\'"',
    'The crown prince ordered: "Zhang Jing\'s Ritual Record says, \'Per the Rites of the Scholar, after full mourning for a month one styles mourning tribute.\'"',
  ],
  s0033: [
    'It also says, \'For all who begin mourning at the three audiences, for more than a month music is not performed.\'"',
    'It also says, \'For all who begin mourning at the three audiences, for more than a month music is not performed.\'"',
  ],
  s0034: [
    'Secretary Liu\'s deliberation says, \'The meaning of cutting off collateral kin lies in removing mourning dress; dress may be stripped away, but can feeling be without grief? After the wailing sacrifice, follow custom in performing music, calling grief ended—this principle and precedent accord.\'"',
    'Secretary Liu says, \'Severing collateral kin means mourning dress ends; dress may go, but grief cannot; after the wailing sacrifice music resumes as usual, grief ended—principle and precedent agree.\'"',
  ],
  s0035: [
    'Seeking the doctrine of feeling grief, it is not only after the wailing sacrifice; taking feeling as the argument, this itself is hard to unify.',
    'On feeling grief, the issue is not only after the wailing sacrifice; arguing from feeling alone, this is hard to unify.',
  ],
  s0036: [
    'To use Zhang Jing\'s performing of music while abandoning Zhang Jing\'s styling of grief—in one mirror\'s words, taking and discarding differ; this itself is hard, second.',
    'To take Zhang Jing\'s music while dropping his grief styling—in one author\'s words the choices conflict; this is the second difficulty.',
  ],
  s0037: [
    'Household Intendant Lu only said \'for many years\'—I fear this is not evidence of the matter;',
    'Lu the Household Intendant only cited \'many years\'—I fear that is not proof;',
  ],
  s0038: [
    'though used for accumulated years, in mind one has never been at ease.',
    'though long in use, the mind has never been easy with it.',
  ],
  s0039: [
    'Recently one has also often passed this question outward; from the outset the established intent has been that there should still be words of mourning tribute.',
    'Lately this has often been asked outside court; from the first the intent has been that mourning tribute should still be named.',
  ],
  s0040: [
    'How could Zhang not know that performing music is great and styling grief a small matter?',
    'Surely Zhang knew performing music was the greater matter and styling grief the lesser.',
  ],
  s0041: [
    'The reason for using the small and neglecting the great truly also has its grounds.',
    'He used the lesser and set aside the greater for good reason.',
  ],
  s0042: [
    'As for the first of the year with six rows of dancers, the affair is a statute of the state;',
    'As for New Year\'s six rows of dancers, the affair is a state statute;',
  ],
  s0043: [
    'though feeling may not be at ease, ritual cannot be abandoned.',
    'though feeling may be uneasy, ritual cannot be set aside.',
  ],
  s0044: [
    'Gongs, pipes, and military music are comparable in the same way.',
    'Gongs, pipes, and military music stand on the same footing.',
  ],
  s0045: [
    'Compared with letters and memorials, the affair is then smaller and may somewhat follow the heart.',
    'Letters and memorials are the smaller affair and may somewhat follow the heart.',
  ],
  s0046: [
    'Music and sound come from without; letters and memorials come from within; music from others, letters from oneself.',
    'Music comes from outside; letters come from within—music from others, letters from oneself.',
  ],
  s0047: [
    'Vice Director Liu\'s deliberation—feeling is not at ease.',
    'Vice Director Liu\'s view leaves feeling uneasy.',
  ],
  s0048: [
    'Let the various worthies together deliberate further to the end."',
    'Let the worthies deliberate further to the end."',
  ],
  s0049: [
    'Director of Agriculture Ming Shanbin and Colonel of Footsoldiers Zhu Yi deliberated, stating, "The interpretation of mourning tribute should run through the month of full mourning."',
    'Director of Agriculture Ming Shanbin and Colonel of Footsoldiers Zhu Yi held that mourning tribute should last through the month of full mourning.',
  ],
  s0050: [
    'Thereupon the order was handed to the Director of Documents to follow in use, taken as everlasting standard.',
    'The order was then handed to the Director of Documents for permanent use as standard.',
  ],
  s0051: [
    'In the eleventh month of the seventh year the honored consort fell ill; the crown prince returned to Yongfu Ward, attending her morning and evening, his clothes\' belt never loosened.',
    'In the eleventh month of year seven the honored consort fell ill; the crown prince returned to Yongfu Ward and tended her day and night without loosening his belt.',
  ],
  s0052: [
    'When she died he walked behind the coffin back to the palace; until the lying-in-state he took no food or drink, and each lament ended in fainting.',
    'When she died he walked behind the coffin back to the palace; through the lying-in-state he took no food or drink, and each cry ended in collapse.',
  ],
  s0053: [
    'Gaozu sent Palace Secretary Gu Xie to proclaim the intent: "Destroying oneself does not extinguish one\'s nature—this is the sage\'s regulation.',
    'Gaozu sent Palace Secretary Gu Xie with an edict: "Self-destruction does not extinguish nature—the sage\'s rule.',
  ],
  s0054: [
    'The Rites say that not bearing up under mourning is classed with unfilial conduct.',
    'The Rites say failing to bear mourning ranks with unfilial conduct.',
  ],
  s0055: [
    'While I am here, how can you destroy yourself thus!',
    'While I still live, how can you destroy yourself so!',
  ],
  s0056: [
    'You must at once force yourself to take food and drink."',
    'Force yourself to eat and drink at once."',
  ],
  s0057: [
    'The crown prince received the command and then took several mouthfuls.',
    'The crown prince obeyed and took a few mouthfuls.',
  ],
  s0058: [
    'From then until the burial he daily took one sheng of wheat porridge.',
    'From then until burial he took only one sheng of wheat porridge a day.',
  ],
  s0059: [
    'Gaozu again commanded: "I hear what you take is too little and you are turning wasted and ill.',
    'Gaozu commanded again: "I hear you eat too little and grow wasted and ill.',
  ],
  s0060: [
    'I lately have no other illness—only because of you thus does my breast also clog and become diseased.',
    'I have no other sickness—only because of you my chest clogs into illness.',
  ],
  s0061: [
    'Therefore you should force yourself to take more gruel and porridge, and not make me always hang my heart thus."',
    'So force more gruel and porridge on yourself and do not keep my heart always suspended."',
  ],
  s0062: [
    'Though repeatedly receiving commands to urge and compel, daily he stopped at one yi and did not taste vegetables or fruit.',
    'Though repeatedly urged by edict, daily he took only one yi and tasted no vegetables or fruit.',
  ],
  s0063: [
    'His constitution had been robust, his waist belt ten encirclements; by then it was reduced by more than half.',
    'His frame had been sturdy, his waist ten encirclements; by then more than half was gone.',
  ],
  s0064: [
    'Whenever he entered court, scholars and commoners who saw him none failed to weep below.',
    'Whenever he entered court, officials and commoners who saw him wept.',
  ],
  s0065: [
    'From the time the crown prince himself added the capping ceremony, Gaozu had him review the myriad affairs; within and without the hundred offices, those memorializing filled the space before him.',
    'After his capping Gaozu had him review myriad affairs; memorialists from every office filled the forecourt.',
  ],
  s0066: [
    'The crown prince was clear on common affairs; the finest strand he always understood. Whenever what was memorialized had error or crafty falsehood, he at once went to analyze and show what might or might not be so, slowly ordered correction, and never once punished a person.',
    'The crown prince knew common affairs down to the finest strand; whenever a memorial erred or lied, he analyzed it on the spot, showed what stood, ordered correction without haste, and never punished anyone.',
  ],
  s0067: [
    'In leveling and deciding legal cases he often fully pardoned; all under Heaven called him humane.',
    'In judging legal cases he often spared lives; all under Heaven called him humane.',
  ],
  s0068: [
    'By nature magnanimous and accommodating the multitude, pleasure and anger never showed on his face.',
    'By nature magnanimous and accommodating, pleasure and anger never showed on his face.',
  ],
  s0069: [
    'He drew in talented and learned men and cherished and rewarded without tiring.',
    'He drew in men of talent and learning and cherished them without tiring.',
  ],
  s0070: [
    'He constantly himself discussed books and records, or with academicians weighed past and present;',
    'He constantly discussed texts himself, or weighed past and present with academicians;',
  ],
  s0071: [
    'in leisure he followed with literary composition and writing, taking it as his constant way.',
    'in leisure he wrote, taking composition as his daily habit.',
  ],
  s0072: [
    'At that time the Eastern Palace had books approaching thirty thousand volumes; famous talents all gathered; the flourishing of letters had not been seen since Jin and Song.',
    'The Eastern Palace then held nearly thirty thousand volumes; eminent talents gathered; literary brilliance unmatched since Jin and Song.',
  ],
  s0073: [
    'He loved mountains and waters; in the Mystic Garden he dug and built, further establishing pavilions and lodges, roaming there with court gentlemen of established name.',
    'He loved landscape; in the Mystic Garden he excavated and built pavilions and lodges, roaming with noted courtiers.',
  ],
  s0074: [
    'Once he floated on the rear pool; the Marquis of Panyu Gui greatly praised, "Here one ought to present female music."',
    'Once boating on the rear pool, the Marquis of Panyu Gui said, "This is the place for female musicians."',
  ],
  s0075: [
    'The crown prince did not answer but chanted Zuo Si\'s "Summoning the Recluse": "Why need silk and bamboo? Mountains and waters have clear sound."',
    'The crown prince did not answer but recited Zuo Si\'s "Summoning the Recluse": "Why silk and bamboo? Mountains and waters have clear sound."',
  ],
  s0076: [
    'The marquis, ashamed, stopped.',
    'The marquis, ashamed, fell silent.',
  ],
  s0077: [
    'For more than twenty years after leaving the palace he kept no music.',
    'For more than twenty years after leaving the palace he kept no musicians.',
  ],
  s0078: [
    'In youth an edict granted him one troupe of the Grand Music Office\'s female performers—barely what he favored.',
    'In youth an edict granted him a troupe of imperial music girls—barely to his taste.',
  ],
  s0079: [
    'In Putong, the great army campaigned north; in the capital grain was dear; the crown prince therefore ordered plain clothes and reduced meals, changing the usual fare to small repasts.',
    'During Putong the great army marched north, grain in the capital grew dear, and the crown prince ordered plain dress and frugal meals, changing his usual fare to small repasts.',
  ],
  s0080: [
    'Whenever long rain accumulated snow, he sent trusted intimates left and right to circle the lanes and alleys, viewing poor households; where any wandered the roads, he secretly added relief and gifts.',
    'Whenever rain or snow lingered, he sent trusted aides through lanes and alleys to find the poor and those wandering the roads and secretly gave relief.',
  ],
  s0081: [
    'He also issued the palace\'s silk and cloth, making many jackets and trousers, in winter months giving them to the poor and frozen.',
    'He also issued palace silk and cloth, made many jackets and trousers, and in winter gave them to the poor and cold.',
  ],
  s0082: [
    'If any died with nothing to enshroud them, he prepared coffins.',
    'For those who died with nothing to enshroud them, he provided coffins.',
  ],
  s0083: [
    'Whenever he heard that common people far and near suffered bitter labor from taxes and corvée, he immediately composed his countenance.',
    'Whenever he heard of the people\'s tax and corvée burdens near or far, his face grew grave.',
  ],
  s0084: [
    'He constantly took household registers as not yet full and weighed heavily on labor and disturbance.',
    'He constantly worried that household registers were incomplete and that labor pressed too hard.',
  ],
  s0085: [
    'Wu commandery repeatedly because of flood disaster lost harvest; someone memorialized that the Grand Canal should be dredged to drain into the Zhe River.',
    'Wu commandery repeatedly lost its harvest to floods; a memorial proposed dredging the Grand Canal to drain the Zhe River.',
  ],
  s0086: [
    'In spring of the second year of Zhongdatong, an edict sent former Inspector of Jiaozhi Wang Dan with credentials to mobilize civilian labor from the three commanderies Wu, Wuxing, and Yixing for the work.',
    'In spring of Zhongdatong year two an edict sent former Inspector of Jiaozhi Wang Dan with credentials to levy labor from Wu, Wuxing, and Yixing commanderies.',
  ],
  s0087: [
    'The crown prince memorialized: "I hear that Wang Dan and others are to be sent to mobilize civilian labor from the three eastern commanderies, open and dredge canals and ditches, guide and release Zhen Marsh, so that within Wu commandery there will never again be flood disaster—truly the utmost humane care and a far-reaching plan of statecraft.',
    'The crown prince memorialized: "I hear Wang Dan and others are to levy labor from the three eastern commanderies, open canals, drain Zhen Marsh, and end floods in Wu commandery—truly utmost humane care and far-sighted policy.',
  ],
  s0088: [
    'Temporary labor for lasting ease—surely afterward benefit will be obtained.',
    'Temporary toil for lasting ease will surely bring later profit.',
  ],
  s0089: [
    'What is not yet sprouted is hard to see; I venture a foolish thought.',
    'What has not yet sprouted is hard to foresee; I venture a humble thought.',
  ],
  s0090: [
    'What I hear is that Wu commandery for successive years has lost harvest and the people have quite wandered away.',
    'I hear Wu commandery has lost harvest year after year and many people have wandered away.',
  ],
  s0091: [
    'Of Wu commandery\'s ten cities, not all fully ripened.',
    'Of Wu commandery\'s ten cities, not all ripened fully.',
  ],
  s0092: [
    'Only Yixing last autumn had a full harvest, yet again not people of ordinary corvée.',
    'Only Yixing had a full harvest last autumn, and even there the people are not those of ordinary corvée.',
  ],
  s0093: [
    'Just now in the eastern region grain is still dear and robbery repeatedly arises; those in office everywhere do not all hear and report.',
    'Just now grain in the eastern region is still dear and banditry keeps arising; not every office reports it.',
  ],
  s0094: [
    'Now the expedition garrisons have not returned and strong men are few and scattered; though this is a small mobilization, I fear it will be hard to combine—one call from an official at the door and it moves as a plague on the people.',
    'Now the garrisons have not returned and strong men are few; though this is a small levy, I fear it will not cohere—one shout from an official at the door becomes a plague on the people.',
  ],
  s0095: [
    'Also the places sending out labor are far and near not one; by the time they are gathered together, silkworm farming is already harmed.',
    'Also the places levying labor lie at uneven distances; by the time men are gathered, silkworm season is already harmed.',
  ],
  s0096: [
    'Last year was called a abundant year, yet public and private could not yet fully eat;',
    'Last year was called abundant, yet public and private stores were still not full;',
  ],
  s0097: [
    'if again this year loses livelihood, I fear the harm will be deeper.',
    'if this year loses livelihood again, I fear the harm will go deeper.',
  ],
  s0098: [
    'Moreover grass bandits often watch the people\'s emptiness and fullness; if good people go to corvée, then robbery and plunder increase all the more—Wu commandery will not yet receive the benefit, while the interior will already suffer the harm.',
    'Moreover bandits often watch whether the people are weak or strong; if good men are conscripted, robbery only increases—Wu commandery will not yet gain, while the interior will already suffer.',
  ],
  s0099: [
    'I do not know whether this work may be temporarily halted, to wait until prosperity is full or not?',
    'Might this work be paused for now until prosperity returns?',
  ],
  s0100: [
    'The sage heart bends in pity on the black-haired people; divine measure long since already has its place.',
    'The sovereign heart cherishes the common people; divine foresight already has its place.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_008_b1.mjs <translation.json>'
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
