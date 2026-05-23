#!/usr/bin/env node
import fs from 'node:fs';

const path = 'translations/current_translation_songshu.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

/** @type {Record<string, {literal: string, idiomatic: string}>} */
const T = {
  s0101: {
    literal: 'Ghost restlessness is a sign of a violent end.',
    idiomatic: 'Ghost restlessness is a sign of a violent end.',
  },
  s0102: {
    literal: 'Later he was executed and died.',
    idiomatic: 'Later he was executed and died.',
  },
  s0103: {
    literal: 'During the Yuankang era under Emperor Hui of Jin, sons of noble families together held drinking parties with disheveled hair and naked bodies, sporting with servant girls and concubines.',
    idiomatic: 'During the Yuankang era under Emperor Hui of Jin, sons of noble families held drinking parties with hair loose and bodies bare, sporting with servant girls and concubines.',
  },
  s0104: {
    literal: 'Those who resisted were wounded in friendship; those who disapproved bore ridicule.',
    idiomatic: 'Those who resisted lost friends; those who disapproved bore ridicule.',
  },
  s0105: {
    literal: 'Men aspiring to worldly fame were ashamed not to join in.',
    idiomatic: 'Men who craved renown were ashamed not to join in.',
  },
  s0106: {
    literal: 'This was surely the sprouting of the Hu and Di encroaching upon Central China.',
    idiomatic: 'This was surely the first sprouting of Hu and Di encroachment upon the Central Plains.',
  },
  s0107: {
    literal: 'Was it not merely like the people of the Yi River, who once let down their hair and offered sacrifices?',
    idiomatic: 'Was it not merely like the people of the Yi River, who once let down their hair and offered sacrifice?',
  },
  s0108: {
    literal: 'During Yuankang under Emperor Hui of Jin, Jia Mi was close and honored; he repeatedly entered the two palaces and played with the crown prince, without a subordinate\'s demeanor.',
    idiomatic: 'During Yuankang under Emperor Hui of Jin, Jia Mi stood close to power; he repeatedly entered the two palaces to play with the crown prince, showing none of a subject\'s deference.',
  },
  s0109: {
    literal: 'Once when they played go together and disputed the board, Prince Chengdu Sima Ying said sternly: "The crown prince is the state\'s heir apparent.',
    idiomatic: 'Once when they played go together and disputed the board, Prince Chengdu Sima Ying said sternly: "The crown prince is the heir to the realm.',
  },
  s0110: {
    literal: 'How dare Jia Mi act without propriety!"',
    idiomatic: 'How dare Jia Mi act without propriety!"',
  },
  s0111: {
    literal: 'Yet Mi still did not repent, and therefore met disaster.',
    idiomatic: 'Mi still would not repent, and therefore met disaster.',
  },
  s0112: {
    literal: 'Prince Qi Sima Jiong, having executed Zhao Lun, remained to assist in government; he received bows while seated, issued orders to the central offices, indulged in wine and pride, and did not once attend court audiences.',
    idiomatic: 'Prince Qi Sima Jiong, having executed Zhao Lun, stayed on to govern; he accepted bows while seated, issued orders to the central offices, drowned himself in wine and pride, and never once attended court.',
  },
  s0113: {
    literal: 'This was the bearing of reckless insolence without solemnity.',
    idiomatic: 'This was the bearing of reckless insolence without solemnity.',
  },
  s0114: {
    literal: 'All under Heaven praised his achievement yet feared his destruction.',
    idiomatic: 'All under Heaven praised his achievement yet feared his downfall.',
  },
  s0115: {
    literal: 'Jiong in the end did not reform, and was utterly extinguished.',
    idiomatic: 'Jiong never reformed, and was utterly destroyed.',
  },
  s0116: {
    literal: 'During the Taiyuan era, people no longer wore the zhatou headwrap.',
    idiomatic: 'During the Taiyuan era, people ceased wearing the zhatou headwrap.',
  },
  s0117: {
    literal: 'The head is the chief; the zhatou keeps the hair from hanging loose and assists the chief as ritual adornment.',
    idiomatic: 'The head is the sovereign part; the zhatou keeps the hair from falling loose and assists the head as ritual adornment.',
  },
  s0118: {
    literal: 'Now it was suddenly abandoned — as if the sovereign stood alone without ministers, leading to peril and ruin.',
    idiomatic: 'Now it was suddenly cast aside — as if the ruler stood alone without ministers, leading to peril and ruin.',
  },
  s0119: {
    literal: 'Afterward Huan Xuan usurped the throne.',
    idiomatic: 'Afterward Huan Xuan usurped the throne.',
  },
  s0120: {
    literal: 'Formerly when making wooden clogs, the teeth reached the upper frame, called "exposed mortise."',
    idiomatic: 'Formerly when making wooden clogs, the pegs reached the upper frame — they were called "exposed mortise."',
  },
  s0121: {
    literal: 'During Taiyuan they suddenly stopped finishing them through, calling them "hidden mortise."',
    idiomatic: 'During Taiyuan they suddenly stopped driving the pegs through, calling them "hidden mortise."',
  },
  s0122: {
    literal: 'Afterward conspiracies multiplied and great chaos ensued.',
    idiomatic: 'Afterward conspiracies multiplied and the realm fell into great chaos.',
  },
  s0123: {
    literal: 'In the seventh year of Yixi under Emperor An of Jin, the Jin court invested Liu Yi\'s heir.',
    idiomatic: 'In the seventh year of Yixi under Emperor An of Jin, the Jin court invested Liu Yi\'s heir.',
  },
  s0124: {
    literal: 'Liu Yi, considering the weight of the royal mandate, should have held a feast for kinsmen and invited officials to witness.',
    idiomatic: 'Liu Yi, considering the weight of the royal mandate, ought to have held a feast for his kinsmen and invited his officers to witness.',
  },
  s0125: {
    literal: 'On the day, his state retainers did not report properly and performed the obeisance in silence in the stable.',
    idiomatic: 'On the day, his state retainers failed to announce the rite properly and performed the obeisance in silence in the stable.',
  },
  s0126: {
    literal: 'When the court envoy was about to report back, Yi only then learned of it; he resented this deeply and dismissed Gentleman of the Palace Liu Jingshu from office.',
    idiomatic: 'When the court envoy was about to report back, Yi only then learned of it; he resented this deeply and stripped Gentleman of the Palace Liu Jingshu of his post.',
  },
  s0127: {
    literal: 'Those who understood were astonished.',
    idiomatic: 'Those who understood were astonished.',
  },
  s0128: {
    literal: 'This was a prodigy of neglecting excellent ritual and lacking solemnity.',
    idiomatic: 'This was a prodigy of neglecting excellent ritual and lacking solemnity.',
  },
  s0129: {
    literal: 'Xie Lingyun of Chen Commandery had exceptional talent; whenever he went out or in, several men supported him by the arms.',
    idiomatic: 'Xie Lingyun of Chen Commandery had exceptional talent; whenever he went out or in, several men supported him by the arms.',
  },
  s0130: {
    literal: 'A folk song said, "Four men carry gown and skirt, three men hold the seat" — this was it.',
    idiomatic: 'A folk song ran, "Four men carry gown and skirt, three men hold the seat" — this was it.',
  },
  s0131: {
    literal: 'This was surely the fault of lacking solemnity; afterward he was executed for it.',
    idiomatic: 'This was surely the fault of lacking solemnity; afterward he was executed for it.',
  },
  s0132: {
    literal: 'During the Taishi era under Emperor Ming of Song, the favorite minister Ruan Tianfu\'s power tilted the court; his halls were sumptuous, his carriages and vestments brilliant; riding he constantly leaned to one side, violating the proper posture of standing erect and holding the reins.',
    idiomatic: 'During the Taishi era under Emperor Ming of Song, the favorite Ruan Tianfu\'s power tilted the court; his halls were sumptuous, his carriages and vestments brilliant; when he rode he constantly leaned to one side, violating the upright posture of standing square and holding the reins.',
  },
  s0133: {
    literal: 'Many people at the time admired and imitated this.',
    idiomatic: 'Many at the time admired and copied him.',
  },
  s0134: {
    literal: 'This too was the fault of unseemly bearing.',
    idiomatic: 'This too was bearing lacking respect.',
  },
  s0135: {
    literal: 'The fashion of leaning left spread; the way of uprightness and squareness was abandoned.',
    idiomatic: 'The fashion of leaning left spread; the way of uprightness and squareness was abandoned.',
  },
  s0136: {
    literal: 'The Deposed Emperor often rode alone on excursions, entering and leaving markets, wards, and monasteries, never using the imperial carriage.',
    idiomatic: 'The Deposed Emperor often rode alone on excursions, passing through markets, wards, and monasteries, never using the imperial carriage.',
  },
  s0137: {
    literal: 'In the end he met destruction.',
    idiomatic: 'In the end he met destruction.',
  },
  s0138: {
    literal: 'Constant Rain',
    idiomatic: 'Constant Rain',
  },
  s0139: {
    literal: 'In autumn of the first year of Taihe under Emperor Ming of Wei, heavy rains fell repeatedly with violent thunder and lightning — something extraordinary, even killing birds.',
    idiomatic: 'In autumn of the first year of Taihe under Emperor Ming of Wei, heavy rains fell again and again with violent thunder and lightning — something extraordinary, even killing birds.',
  },
  s0140: {
    literal: 'According to Yang Fu\'s memorial, this was the punishment of constant rain.',
    idiomatic: 'According to Yang Fu\'s memorial, this was the punishment of constant rain.',
  },
  s0141: {
    literal: 'At the time the emperor was not mournful during mourning; he went out hunting without limit; extravagance flourished; he seized the people\'s farming seasons — therefore wood lost its nature and constant rain became disaster.',
    idiomatic: 'At the time the emperor was not mournful during mourning; he hunted without restraint; extravagance flourished; he seized the people\'s farming seasons — therefore wood lost its nature and constant rain became disaster.',
  },
  s0142: {
    literal: 'In the eighth month of the fourth year of Taihe came incessant rain for more than thirty days; the Yi, Luo, Yellow, and Han rivers all overflowed, and the year brought famine.',
    idiomatic: 'In the eighth month of the fourth year of Taihe came incessant rain for more than thirty days; the Yi, Luo, Yellow, and Han rivers all overflowed, and the year brought famine.',
  },
  s0143: {
    literal: 'In the second year of Taiping under Sun Liang of Wu, on jiayin of the second month, heavy rain and thunder;',
    idiomatic: 'In the second year of Taiping under Sun Liang of Wu, on jiayin of the second month, heavy rain and thunder;',
  },
  s0144: {
    literal: 'on yimao, snow and severe cold.',
    idiomatic: 'on yimao, snow and severe cold.',
  },
  s0145: {
    literal: 'According to Liu Xin\'s explanation, at this time there should have been rain but not so much — heavy rain is the punishment of constant rain.',
    idiomatic: 'According to Liu Xin\'s explanation, at this season there should have been rain but not so much — heavy rain is the punishment of constant rain.',
  },
  s0146: {
    literal: 'That snow and severe cold came the day after the first thunder was also the punishment of constant cold.',
    idiomatic: 'That snow and severe cold came the day after the first thunder was also the punishment of constant cold.',
  },
  s0147: {
    literal: 'Liu Xiang held that once thunder had occurred, snow ought not to fall again — all were anomalies out of season.',
    idiomatic: 'Liu Xiang held that once thunder had sounded, snow ought not to fall again — all were anomalies out of season.',
  },
  s0148: {
    literal: 'Heaven\'s warning seemed to say: the ruler has lost the season; a rebel minister will rise.',
    idiomatic: 'Heaven\'s warning seemed to say: the ruler has lost the season; a rebel minister will rise.',
  },
  s0149: {
    literal: 'Thunder first and snow afterward means Yin saw an opening and rose to overcome Yang.',
    idiomatic: 'Thunder first and snow afterward means Yin saw an opening and rose to overcome Yang.',
  },
  s0150: {
    literal: 'The calamity of treacherous killing was about to arrive.',
    idiomatic: 'The calamity of treacherous killing was about to arrive.',
  },
  s0151: {
    literal: 'Liang did not understand; soon he was deposed.',
    idiomatic: 'Liang did not understand; soon he was deposed.',
  },
  s0152: {
    literal: 'This was the same as Duke Yin of Lu in the Spring and Autumn Annals.',
    idiomatic: 'This was the same as Duke Yin of Lu in the Spring and Autumn Annals.',
  },
  s0153: {
    literal: 'In the sixth month of the sixth year of Taishi under Emperor Wu of Jin came incessant rain; on jiachen the Yellow, Luo, and Qin rivers overflowed together, sweeping away more than four thousand nine hundred households, killing more than two hundred people, and drowning more than thirteen hundred sixty qing of autumn grain.',
    idiomatic: 'In the sixth month of the sixth year of Taishi under Emperor Wu of Jin came incessant rain; on jiachen the Yellow, Luo, and Qin rivers overflowed together, sweeping away more than four thousand nine hundred households, killing more than two hundred people, and drowning more than thirteen hundred sixty qing of autumn grain.',
  },
  s0154: {
    literal: 'In the seventh month of the fifth year of Taikang under Emperor Wu of Jin, torrential rain in Rencheng and Liang struck beans and wheat.',
    idiomatic: 'In the seventh month of the fifth year of Taikang under Emperor Wu of Jin, torrential rain in Rencheng and Liang struck beans and wheat.',
  },
  s0155: {
    literal: 'In the ninth month of the fifth year of Taikang, incessant rain and sudden snow in Nan\'an broke trees and harmed autumn grain;',
    idiomatic: 'In the ninth month of the fifth year of Taikang, incessant rain and sudden snow in Nan\'an broke trees and harmed autumn grain;',
  },
  s0156: {
    literal: 'in Wei, Huainan, and Pingyuan, rain and flood harmed autumn grain.',
    idiomatic: 'in Wei, Huainan, and Pingyuan, rain and flood harmed autumn grain.',
  },
  s0157: {
    literal: 'That autumn, incessant rain and sudden flood in nine counties of Wei and Xiping, with frost, harmed autumn grain.',
    idiomatic: 'That autumn, incessant rain and sudden flood in nine counties of Wei and Xiping, with frost, harmed autumn grain.',
  },
  s0158: {
    literal: 'In the tenth month of the first year of Yongning under Emperor Hui of Jin, incessant rain in Yiyang, Nanyang, and Donghai flooded and harmed autumn wheat.',
    idiomatic: 'In the tenth month of the first year of Yongning under Emperor Hui of Jin, incessant rain in Yiyang, Nanyang, and Donghai flooded and harmed autumn wheat.',
  },
  s0159: {
    literal: 'On yichou of the eighth month in the first year of Xiankang under Emperor Cheng of Jin, in the three counties of Changsha, You, and Longyang in Wuling of Jing Province, floodwaters floated houses, killed people, and harmed autumn grain.',
    idiomatic: 'On yichou of the eighth month in the first year of Xiankang under Emperor Cheng of Jin, in the three counties of Changsha, You, and Longyang in Wuling of Jing Province, floodwaters floated houses, killed people, and harmed autumn grain.',
  },
  s0160: {
    literal: 'In the sixth month of the twenty-first year of Yuanjia under Emperor Wen of Song, the capital saw rain for more than a hundred consecutive days and great flood.',
    idiomatic: 'In the sixth month of the twenty-first year of Yuanjia under Emperor Wen of Song, the capital saw rain for more than a hundred consecutive days and great flood.',
  },
  s0161: {
    literal: 'In the first month of the first year of Daming under Emperor Xiaowu of Song, the capital saw rain and flood.',
    idiomatic: 'In the first month of the first year of Daming under Emperor Xiaowu of Song, the capital saw rain and flood.',
  },
  s0162: {
    literal: 'In the seventh month of the fifth year of Daming, the capital saw rain and flood.',
    idiomatic: 'In the seventh month of the fifth year of Daming, the capital saw rain and flood.',
  },
  s0163: {
    literal: 'In the eighth month of the eighth year of Daming, the capital saw rain and flood.',
    idiomatic: 'In the eighth month of the eighth year of Daming, the capital saw rain and flood.',
  },
  s0164: {
    literal: 'In the sixth month of the second year of Taishi under Emperor Ming of Song, the capital saw rain and flood.',
    idiomatic: 'In the sixth month of the second year of Taishi under Emperor Ming of Song, the capital saw rain and flood.',
  },
  s0165: {
    literal: 'On yihai of the fourth month in the third year of Shengming under Emperor Shun of Song, in Tonglu County of Wu Commandery came violent wind, thunder, and lightning; sand was whipped up and trees broken; water stood two zhang above level ground and swept away inhabitants.',
    idiomatic: 'On yihai of the fourth month in the third year of Shengming under Emperor Shun of Song, in Tonglu County of Wu Commandery came violent wind, thunder, and lightning; sand was whipped up and trees broken; water stood two zhang above level ground and swept away inhabitants.',
  },
  s0166: {
    literal: 'Costume Prodigies',
    idiomatic: 'Costume Prodigies',
  },
  s0167: {
    literal: 'Because the realm was stricken with famine and resources were exhausted, Emperor Wu of Wei first modeled the ancient leather cap and cut silk cloth into a white cap to replace the old dress.',
    idiomatic: 'Because the realm was stricken with famine and resources were exhausted, Emperor Wu of Wei first modeled the ancient leather cap and cut silk cloth into a white cap to replace the old dress.',
  },
  s0168: {
    literal: 'Fu Xuan said: "White is military bearing, not the bearing of the state."',
    idiomatic: 'Fu Xuan said: "White is military bearing, not the bearing of the state."',
  },
  s0169: {
    literal: 'Gan Bao took plain white silk to be the image of mourning and calamity; the cap was a word of disgrace and ruin.',
    idiomatic: 'Gan Bao took plain white silk to be the image of mourning and calamity; the cap was a word of disgrace and ruin.',
  },
  s0170: {
    literal: 'This was surely the prodigy of attack and slaughter after a change of dynasty.',
    idiomatic: 'This was surely the prodigy of attack and slaughter after a change of dynasty.',
  },
  s0171: {
    literal: 'At first the white cap had a horizontal seam in front to distinguish back from front, called "face"; the custom spread it widely.',
    idiomatic: 'At first the white cap had a horizontal seam in front to distinguish back from front, called "face"; the custom spread it widely.',
  },
  s0172: {
    literal: 'By the Yongjia era of Jin they gradually removed the seam, calling it the "faceless cap."',
    idiomatic: 'By the Yongjia era of Jin they gradually removed the seam, calling it the "faceless cap."',
  },
  s0173: {
    literal: 'Meanwhile women bound their hair ever more loosely; though tied tight it could not stand upright; hair spread over the forehead, with only the eyes showing.',
    idiomatic: 'Meanwhile women bound their hair ever more loosely; though tied tight it could not stand upright; hair spread over the forehead, with only the eyes showing.',
  },
  s0174: {
    literal: '"Faceless" is a word of shame;',
    idiomatic: '"Faceless" is a word of shame;',
  },
  s0175: {
    literal: 'covering the forehead is the appearance of embarrassment;',
    idiomatic: 'covering the forehead is the appearance of embarrassment;',
  },
  s0176: {
    literal: 'that the binding grew ever looser speaks of the realm forgetting ritual and righteousness, indulging feeling and nature, and at the extreme reaching great shame.',
    idiomatic: 'that the binding grew ever looser speaks of the realm forgetting ritual and righteousness, indulging feeling and nature, and at the extreme reaching great shame.',
  },
  s0177: {
    literal: 'After Yongjia the two emperors did not return; all under Heaven was shamed.',
    idiomatic: 'After Yongjia the two emperors did not return; all under Heaven was shamed.',
  },
  s0178: {
    literal: 'Emperor Ming of Wei wore an embroidered cap and a light silk half-sleeve, and once appeared thus before the upright minister Yang Fu.',
    idiomatic: 'Emperor Ming of Wei wore an embroidered cap and a light silk half-sleeve, and once appeared thus before the upright minister Yang Fu.',
  },
  s0179: {
    literal: 'Fu remonstrated: "By what rule of ritual is this dress?"',
    idiomatic: 'Fu remonstrated: "By what rule of ritual is this dress?"',
  },
  s0180: {
    literal: 'The emperor fell silent.',
    idiomatic: 'The emperor fell silent.',
  },
  s0181: {
    literal: 'This was a recent costume prodigy.',
    idiomatic: 'This was a recent costume prodigy.',
  },
  s0182: {
    literal: 'Light blue is not a color of ritual; intimate dress should not be duplicated.',
    idiomatic: 'Light blue is not a color of ritual; intimate dress should not be duplicated.',
  },
  s0183: {
    literal: 'Now the ruler personally wore unlawful adornment — what is called bringing calamity upon oneself with no rite to avert it.',
    idiomatic: 'Now the ruler personally wore unlawful adornment — what is called bringing calamity upon oneself with no rite to avert it.',
  },
  s0184: {
    literal: 'The emperor did not enjoy long years; after his death stipends departed the royal house, later heirs did not endure, and the realm was lost.',
    idiomatic: 'The emperor did not enjoy long years; after his death stipends departed the royal house, later heirs did not endure, and the realm was lost.',
  },
  s0185: {
    literal: 'In the first year of Jingchu under Emperor Ming of Wei, copper was cast into two giant figures called "Wengzhong."',
    idiomatic: 'In the first year of Jingchu under Emperor Ming of Wei, copper was cast into two giant figures called "Wengzhong."',
  },
  s0186: {
    literal: 'They were placed outside the Sima Gate.',
    idiomatic: 'They were placed outside the Sima Gate.',
  },
  s0187: {
    literal: 'According to antiquity, when a giant man appeared, the state perished;',
    idiomatic: 'According to antiquity, when a giant man appeared, the state perished;',
  },
  s0188: {
    literal: 'when the Long Di appeared at Lintao, it was the calamity of Qin\'s destruction.',
    idiomatic: 'when the Long Di appeared at Lintao, it was the calamity of Qin\'s destruction.',
  },
  s0189: {
    literal: 'The First Emperor did not understand, but instead took it as an auspice and cast bronze men to imitate it.',
    idiomatic: 'The First Emperor did not understand, but instead took it as an auspice and cast bronze men to imitate it.',
  },
  s0190: {
    literal: 'Wei\'s law held such things to be instruments of a state\'s destruction, yet in righteousness they were utterly without merit.',
    idiomatic: 'Wei\'s law held such things to be instruments of a state\'s destruction, yet in righteousness they were utterly without merit.',
  },
  s0191: {
    literal: 'This too was a costume prodigy.',
    idiomatic: 'This too was a costume prodigy.',
  },
  s0192: {
    literal: 'He Yan, Master of Writing of Wei, delighted in wearing women\'s dress.',
    idiomatic: 'He Yan, Master of Writing of Wei, delighted in wearing women\'s dress.',
  },
  s0193: {
    literal: 'Fu Xuan said: "This is a costume prodigy."',
    idiomatic: 'Fu Xuan said: "This is a costume prodigy."',
  },
  s0194: {
    literal: 'The system of garments and robes is what fixes high and low and distinguishes inner from outer.',
    idiomatic: 'The system of garments and robes is what fixes high and low and distinguishes inner from outer.',
  },
  s0195: {
    literal: 'The Greater Odes say: "Dark robes and red shoes, hooked breastplate and carved bell."',
    idiomatic: 'The Greater Odes say: "Dark robes and red shoes, hooked breastplate and carved bell."',
  },
  s0196: {
    literal: 'They sing its ornament.',
    idiomatic: 'They sing its ornament.',
  },
  s0197: {
    literal: 'The Lesser Odes say: "Stern and supportive, together in martial dress."',
    idiomatic: 'The Lesser Odes say: "Stern and supportive, together in martial dress."',
  },
  s0198: {
    literal: 'They chant its martial bearing.',
    idiomatic: 'They chant its martial bearing.',
  },
  s0199: {
    literal: 'If inner and outer are not distinguished, the royal system loses order; once costume prodigies appear, the person follows them to destruction.',
    idiomatic: 'If inner and outer are not distinguished, the royal system loses order; once costume prodigies appear, the person follows them to destruction.',
  },
  s0200: {
    literal: 'Mo Xi wore a man\'s cap and Jie lost the realm;',
    idiomatic: 'Mo Xi wore a man\'s cap and Jie lost the realm;',
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
