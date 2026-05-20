#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 42, Biography 36',
    'Book of Liang, Volume 42, Biography 36',
  ],
  s0002: [
    'Zang Dun; younger brother Jue; Fu Qi',
    'Zang Dun; his younger brother Jue; Fu Qi',
  ],
  s0003: [
    'Zang Dun, courtesy name Xuanqing, was a native of Ju in Dongguan.',
    'Zang Dun, styled Xuanqing, came from Ju in Dongguan.',
  ],
  s0004: [
    'His great-grandfather Tao had been Left Glorious Grand Master under Song.',
    'His great-grandfather Tao had served Song as Left Glorious Grand Master.',
  ],
  s0005: [
    'His grandfather Tanzhi had been Minister of the Left for the People.',
    'His grandfather Tanzhi had been Minister of the Left for the People.',
  ],
  s0006: [
    'His father Weizhen was broadly learned in letters and history and gifted in affairs; in youth he won the notice of his maternal uncle Zhou Yong of Runan.',
    'His father Weizhen read widely in letters and history and showed real talent; as a youth he came to the attention of his uncle by marriage, Zhou Yong of Runan.',
  ],
  s0007: [
    'At the end of Song he began office as recorder in the headquarters of the Army of the Capital; the lord he served was Emperor Wu of Qi.',
    'At the end of Song he took his first post as recorder on the staff of the Army of the Capital—the lord he served was Emperor Wu of Qi.',
  ],
  s0008: [
    'Entering Qi he held posts as libationer to the Grand Marshal, gentleman in the Ministry of Rites in charge of foreign guests, secretariat aide to the princes of Jian\'an and Luling, merit officer in the Forward Army, palace attendant for direct communication, rectifier of the central register of South Xuzhou, and assistant in the yamen of the governor of Danyang.',
    'Under Qi he served as libationer to the Grand Marshal, gentleman for foreign guests in the Ministry of Rites, secretariat aide to the princes of Jian\'an and Luling, merit officer on the Forward Army staff, direct-communication attendant, rectifier of the South Xuzhou central register, and assistant to the governor of Danyang.',
  ],
  s0009: [
    'When the Founding Emperor pacified the capital region and established the headquarters, Dun was brought in as penal and judicial adviser on the staff of Rapid Cavalry.',
    'When the Founding Emperor secured the capital and set up his headquarters, Dun joined the staff of Rapid Cavalry as penal and judicial adviser.',
  ],
  s0010: [
    'At the opening of Heavenly Surveillance he was made staff adviser and middle director in the Rear Army and chief clerk of South Xuzhou, then entered court as gentleman in the Yellow Gate, and was promoted to chief clerk to the Prince of Ancheng of the Right Army and minister of the palace supplies.',
    'At the start of Heavenly Surveillance he became staff adviser and middle director in the Rear Army and chief clerk of South Xuzhou, then entered court as a Yellow Gate gentleman and rose to chief clerk to the Prince of Ancheng of the Right Army and minister of the palace supplies.',
  ],
  s0011: [
    'He went out as magistrate of Xin\'an and won a name for ability.',
    'Sent out as magistrate of Xin\'an, he earned a reputation for competence.',
  ],
  s0012: [
    'Returning he became junior tutor to the crown prince, minister of the national granaries, and chief clerk to the Grand Marshal.',
    'Recalled, he became junior tutor to the crown prince, minister of the national granaries, and chief clerk to the Grand Marshal.',
  ],
  s0013: [
    'He entered mourning for his birth mother and for three years dwelt in a hut beside the grave.',
    'He mourned his birth mother and for three years lived in a hut by the grave.',
  ],
  s0014: [
    'When mourning ended he was made minister of justice.',
    'When mourning ended he was appointed minister of justice.',
  ],
  s0015: [
    'He went out as chief clerk to the Prince of Ancheng and magistrate of Jiangxia, and died in office.',
    'He left the capital as chief clerk to the Prince of Ancheng and magistrate of Jiangxia, and died in office.',
  ],
  s0016: [
    'In youth Dun studied the Five Classics from the reclusive scholar Zhuge Huan of Langye, mastering chapter and phrase.',
    'As a youth Dun studied the Five Classics under the recluse Zhuge Huan of Langye and mastered chapter and phrase.',
  ],
  s0017: [
    'Huan\'s students often numbered in the dozens, yet among them Dun kept close with no one.',
    'Huan\'s pupils often ran to dozens, but Dun kept company with none of them.',
  ],
  s0018: [
    'Huan marveled at him and sighed: "This youth is a vessel of weight—the stuff of a king\'s aide.',
    'Huan marked him out and sighed, "This boy is a heavy vessel—the makings of a king\'s counselor.',
  ],
  s0019: [
    '" He first served as traveling aide on the staff of the Forward Army and was promoted to gentleman in the Secretariat bureau of soldiers.',
    '" He began as traveling aide on the Forward Army staff and was promoted to gentleman in the Secretariat bureau of soldiers.',
  ],
  s0020: [
    'Dun had a handsome bearing and graceful carriage; whenever he hurried to audience the Founding Emperor was greatly pleased.',
    'Dun was handsome in bearing and graceful in manner; each time he hurried to audience the Founding Emperor took great delight in him.',
  ],
  s0021: [
    'He entered court concurrently as communications attendant in the Secretariat, was made recording aide on the right of stability, and kept his post as attendant.',
    'He entered court as concurrent communications attendant in the Secretariat, was made recording aide on the right of stability, and kept his attendant post.',
  ],
  s0022: [
    'Dun was deeply filial; he followed his father on night duty at the court of justice, while his mother Liu remained at home. She died suddenly that night; the middle finger of his left hand throbbed with pain and he could not sleep.',
    'Dun was deeply filial. He followed his father on night duty at the court of justice while his mother Liu stayed at home. That night she died suddenly; the middle finger of his left hand throbbed with pain and he could not sleep.',
  ],
  s0023: [
    'At dawn a messenger from the house brought word of death—his sensitivities worked thus.',
    'At dawn a messenger from home brought word of her death—such was the reach of his feeling.',
  ],
  s0024: [
    'Before the mourning period for her had ended his father also died; Dun kept mourning five years without leaving the hut, his frame wasted to bone until kin could no longer recognize him.',
    'Before her mourning had ended his father died too; Dun mourned five years without leaving the hut, wasted to bone until his family could no longer know him.',
  ],
  s0025: [
    'A townsman named Wang Duan reported this to the throne; the Founding Emperor praised him and repeatedly sent orders urging restraint.',
    'A townsman, Wang Duan, reported this to the throne; the Founding Emperor praised him and again and again sent orders urging him to moderate his grief.',
  ],
  s0026: [
    'When mourning ended he was made assistant in the yamen of the governor of Danyang, then promoted to gentleman of the Secretariat, again concurrently attendant in the Secretariat, promoted to left assistant in the Secretariat, and made chief clerk to the Prince of Wuling of the Eastern Army with charge of the prefecture and state affairs and concurrently assistant magistrate of Kuaiji commandery.',
    'When mourning ended he became assistant to the governor of Danyang, then Secretariat gentleman, again concurrent Secretariat attendant, then left assistant in the Secretariat, and chief clerk to the Prince of Wuling of the Eastern Army with charge of prefectural and princely affairs and concurrent assistant magistrate of Kuaiji.',
  ],
  s0027: [
    'Returning he was made minister of the palace supplies and colonel of the infantry guard, then promoted to censor-in-chief.',
    'Recalled, he became minister of the palace supplies and colonel of the infantry guard, then censor-in-chief.',
  ],
  s0028: [
    'Dun was by nature upright and forceful; in the censorate he proved highly capable.',
    'Dun was upright and forceful by nature and proved highly capable at the censorate.',
  ],
  s0029: [
    'In the second month of the fifth year of Zhongdatong the Founding Emperor visited Tongtai Temple to open a lecture and held a great assembly in four sections with tens of thousands present.',
    'In the second month of the fifth year of Zhongdatong the Founding Emperor went to Tongtai Temple to open a lecture and held a great assembly in four sections with tens of thousands present.',
  ],
  s0030: [
    'A tame elephant presented by Southern Yue suddenly went mad in the crowd; carriage guards and attendants and the assembly all scattered in terror—only Dun and the regular palace attendant Pei Zhili stood unmoved, to the Founding Emperor\'s great admiration.',
    'A tame elephant from Southern Yue suddenly ran wild in the crowd; carriage guards, attendants, and the whole assembly fled in terror—only Dun and the regular palace attendant Pei Zhili stood unmoved, to the Founding Emperor\'s great admiration.',
  ],
  s0031: [
    'Soon an edict added him as regular palace attendant, but before he took office another edict said: "To command the Six Armies—give the post only to talent.',
    'Soon an edict made him regular palace attendant, but before he took office another edict said, "To command the Six Armies—give the post only to the worthy.',
  ],
  s0032: [
    'Censor-in-chief and newly appointed regular palace attendant Dun is loyal at heart and careful in judgment; in office he is fair and in affairs diligent—surely able to order these military matters.',
    'Censor-in-chief and newly appointed regular palace attendant Dun is loyal at heart and careful in judgment; fair in office and diligent in affairs—surely fit to order these military matters.',
  ],
  s0033: [
    'He may concurrently command the Army of the Capital while keeping his post as regular attendant.',
    'Let him concurrently command the Army of the Capital while keeping his post as regular attendant.',
  ],
  s0034: [
    'In the second year of Great Unity he was promoted to commandant of the central army.',
    'In the second year of Great Unity he was promoted to commandant of the central army.',
  ],
  s0035: [
    'The commandant\'s post controlled the empire\'s military keys and supervised many bureaus.',
    'The commandant controlled the empire\'s military keys and oversaw many bureaus.',
  ],
  s0036: [
    'Dun was quick and capable, had force of character, and excelled at cutting through complexity—the work ran in good order.',
    'Dun was quick and capable, forceful in character, and excelled at cutting through complexity; the work ran in good order.',
  ],
  s0037: [
    'In Heavenly Surveillance the Marquis of Pingwu Xiao Jing had held this post with famed reputation.',
    'In Heavenly Surveillance the Marquis of Pingwu, Xiao Jing, had held this post to wide renown.',
  ],
  s0038: [
    'Now Dun followed him in succession.',
    'Now Dun followed him in that line.',
  ],
  s0039: [
    'In the fifth year he went out as General of Renowned Might and magistrate of Wu commandery; before his term was half done he pleaded illness and resigned.',
    'In the fifth year he went out as General of Renowned Might and magistrate of Wu; before half his term was done he pleaded illness and resigned.',
  ],
  s0040: [
    'He was appointed Grand Master of Splendid Happiness with the golden seal and purple ribbon.',
    'He was appointed Grand Master of Splendid Happiness with the golden seal and purple ribbon.',
  ],
  s0041: [
    'In the seventh year, recovered from illness, he again became commandant of the army.',
    'In the seventh year, recovered from illness, he again became commandant of the army.',
  ],
  s0042: [
    'In the ninth year he died at age sixty-six.',
    'In the ninth year he died at sixty-six.',
  ],
  s0043: [
    'That very day an edict ordered mourning rites.',
    'That very day an edict ordered mourning rites for him.',
  ],
  s0044: [
    'He was posthumously made palace attendant and kept his commandant\'s title.',
    'He was posthumously made palace attendant and kept his commandant\'s title.',
  ],
  s0045: [
    'Eastern Garden funerary objects were granted, one set of court robes, one suit of garments, money and cloth each in fixed amounts.',
    'Eastern Garden funerary objects were granted, one set of court robes, one suit of garments, and money and cloth each in fixed amounts.',
  ],
  s0046: [
    'His posthumous title was Loyal.',
    'His posthumous title was Loyal.',
  ],
  s0047: [
    'His son Changbo, styled Menghong, became interior minister of Guiyang.',
    'His son Changbo, styled Menghong, became interior minister of Guiyang.',
  ],
  s0048: [
    'His second son Zhongbo became magistrate of Qu\'a.',
    'His second son Zhongbo became magistrate of Qu\'a.',
  ],
  s0049: [
    'Dun\'s younger brother Jue.',
    'Dun\'s younger brother was Jue.',
  ],
  s0050: [
    'Jue, courtesy name Xianqing, was also known for administrative talent.',
    'Jue, styled Xianqing, was also known for administrative talent.',
  ],
  s0051: [
    'He first served as traveling aide in the Western Central Command and gentleman in the foreign-guests bureau.',
    'He began as traveling aide in the Western Central Command and gentleman in the foreign-guests bureau.',
  ],
  s0052: [
    'He entered court concurrently as communications attendant, rose through full attendant to minister of guests, and kept his attendant post.',
    'He entered court as concurrent communications attendant, rose to full attendant and minister of guests, and kept his attendant post.',
  ],
  s0053: [
    'He was promoted to left assistant in the Secretariat; before taking office he went out as magistrate of Jin\'an.',
    'Promoted to left assistant in the Secretariat, he did not take office but went out as magistrate of Jin\'an.',
  ],
  s0054: [
    'The commandery lay among mountains and sea and bandits often gathered; though previous magistrates had raised troops to hunt them, robbery never ceased.',
    'The commandery lay among mountains and sea where fugitives often gathered; though earlier magistrates had raised troops to hunt them down, banditry never ceased.',
  ],
  s0055: [
    'When Jue took office he proclaimed moral guidance; all the violent factions came forward bearing their crimes, the people returned to their trades, and merchants traveled freely again.',
    'When Jue took office he proclaimed moral guidance; every violent faction came forward bearing guilt, the people returned to their trades, and merchants traveled freely again.',
  ],
  s0056: [
    'Yet in government he was harsh and showed little grace; for small matters officials and people alike were flogged, and the folk called him "Tiger Zang."',
    'Yet his rule was harsh and showed little grace; officials and commoners were flogged for trifles, and the people called him "Tiger Zang."',
  ],
  s0057: [
    'Returning he was made staff adviser to the Prince of Luling of Rapid Cavalry and again concurrent attendant.',
    'Recalled, he became staff adviser to the Prince of Luling of Rapid Cavalry and again concurrent attendant.',
  ],
  s0058: [
    'He was promoted to exterior regular palace attendant and concurrently minister of the national granaries, attendant as before.',
    'He rose to exterior regular palace attendant and concurrently minister of the national granaries, keeping his attendant post.',
  ],
  s0059: [
    'In the eighth year of Great Unity he died in office at age forty-eight.',
    'In the eighth year of Great Unity he died in office at forty-eight.',
  ],
  s0060: [
    'Throughout his career the major matters of the bureaus he ran—and cases the Orchid Terrace and court of justice could not decide—were all entrusted to Jue.',
    'Throughout his career the major matters of the bureaus he ran—and cases the Orchid Terrace and court of justice could not settle—were all entrusted to Jue.',
  ],
  s0061: [
    'Jue\'s judgments were precise and detailed; all accorded with reason.',
    'Jue\'s judgments were precise and detailed, and all accorded with reason.',
  ],
  s0062: [
    'After Jue died someone beat the petition drum at the Gate of Impartial Hearing, asking that his cases be given to a fair and upright attendant.',
    'After Jue died someone beat the petition drum at the Gate of Impartial Hearing, asking that his cases be given to a fair and upright attendant.',
  ],
  s0063: [
    'The Founding Emperor said: "Now that Zang Jue is gone, there is no one to whom this can be entrusted.',
    'The Founding Emperor said, "Now that Zang Jue is gone, there is no one to whom this can be entrusted.',
  ],
  s0064: [
    '" Such was the esteem in which he was held.',
    '" Such was the esteem in which he was held.',
  ],
  s0065: [
    'His son Cao was gentleman in the three excellencies bureau of the Secretariat.',
    'His son Cao was gentleman in the three excellencies bureau of the Secretariat.',
  ],
  s0066: [
    'Fu Qi, courtesy name Jingping, was a native of Lingzhou in Beidi.',
    'Fu Qi, styled Jingping, came from Lingzhou in Beidi.',
  ],
  s0067: [
    'His great-grandfather Hongren had been grand chamberlain under Song.',
    'His great-grandfather Hongren had served Song as grand chamberlain.',
  ],
  s0068: [
    'His grandfather Yan, in Qi times magistrate of Shan commandery, had governing ability and was promoted from that county post to governor of Yi province.',
    'His grandfather Yan, in Qi times magistrate of Shan, governed well and was raised from that county post to governor of Yi province.',
  ],
  s0069: [
    'His father Hui, in Heavenly Surveillance, held the magistracies of Shan and Jiankang in succession, likewise famed for ability, and reached staff adviser to Rapid Cavalry.',
    'His father Hui, under Heavenly Surveillance, held Shan and Jiankang in succession, likewise famed for ability, and reached staff adviser to Rapid Cavalry.',
  ],
  s0070: [
    'Qi first served as a classics fellow in the National University, then began office as attendant to Prince Hong of Nankang, was promoted to traveling aide, and concurrently gentleman in the treasury bureau of gold.',
    'Qi first was a classics fellow in the National University, then began as attendant to Prince Hong of Nankang, rose to traveling aide, and concurrently gentleman in the treasury bureau of gold.',
  ],
  s0071: [
    'He left office for his mother\'s mourning and observed the rites to the full.',
    'He left office to mourn his mother and observed every rite to the full.',
  ],
  s0072: [
    'After mourning ended he was long disabled by illness.',
    'After mourning ended he was long disabled by illness.',
  ],
  s0073: [
    'At that time the northern suburban altar was being newly built; Qi was first put in charge of supervising construction, and when the work was done he was appointed as if under the new regulations.',
    'At that time the northern suburban altar was being rebuilt; Qi was first put in charge of construction, and when the work was finished he was appointed as if under the new regulations.',
  ],
  s0074: [
    'Among the county people two men fought and one died; the dead man\'s family sued at the prefecture, which arrested the enemy and tortured him through every means, yet he would not confess; the prefecture then transferred the case to the county.',
    'Among the county people two men fought and one died; the dead man\'s kin sued at the prefecture, which arrested the enemy and tortured him by every means, yet he would not confess; the prefecture then transferred the case to the county.',
  ],
  s0075: [
    'Qi at once ordered the shackles removed and questioned him in gentle words; the man immediately confessed.',
    'Qi at once ordered the shackles removed and questioned him gently; the man confessed on the spot.',
  ],
  s0076: [
    'By law he should pay with his life, but the winter solstice was at hand; Qi then sent him home to pass the festival and return to prison after one day.',
    'By law he should pay with his life, but the winter solstice was near; Qi sent him home to pass the festival and return to prison after one day.',
  ],
  s0077: [
    'The clerks argued firmly: "In antiquity there was such a thing, but in our day it cannot be done.',
    'The clerks argued firmly, "In antiquity there was such a thing, but in our day it cannot be done.',
  ],
  s0078: [
    '" Qi said: "If he breaks faith, the magistrate will bear the penalty—you need not worry.',
    '" Qi said, "If he breaks faith, the magistrate will bear the penalty—you need not worry.',
  ],
  s0079: [
    '" He returned on the appointed day after all.',
    '" He returned on the appointed day after all.',
  ],
  s0080: [
    'The prefect was deeply struck and at once reported it upward.',
    'The prefect was deeply struck and at once reported it upward.',
  ],
  s0081: [
    'Later, when Qi left the county, young and old alike went beyond the border to bow him farewell; the sound of weeping was heard for dozens of li.',
    'Later, when Qi left the county, young and old alike went beyond the border to bow him farewell; the sound of weeping carried for dozens of li.',
  ],
  s0082: [
    'Reaching the capital he was made director of the court of justice, entered court concurrently as communications attendant, was promoted to secretariat aide to the Prince of Peaceful Distance at Mount Yue, and kept his attendant post.',
    'At the capital he became director of the court of justice, entered court as concurrent communications attendant, was promoted to secretariat aide to the Prince of Peaceful Distance at Mount Yue, and kept his attendant post.',
  ],
  s0083: [
    'He went out as magistrate of Jiankang and was dismissed for an official matter.',
    'He went out as magistrate of Jiankang and was dismissed over an official matter.',
  ],
  s0084: [
    'Soon he was again made attendant and rose through secretariat aide in the Anxi Central Command and staff adviser to the southern pacification army, attendant as before.',
    'Soon he was again made attendant and rose through secretariat aide in the Anxi Central Command and staff adviser to the southern pacification army, keeping his attendant post.',
  ],
  s0085: [
    'Qi had a fine bearing and was broadly learned, skilled in repartee.',
    'Qi had a fine bearing, read widely, and was skilled in repartee.',
  ],
  s0086: [
    'In Great Unity, when Liang and Wei made peace, their envoys came twice a year; Qi was often sent to receive them.',
    'In Great Unity, when Liang and Wei made peace, Wei envoys came twice a year; Qi was often sent to receive them.',
  ],
  s0087: [
    'In the first year of Supreme Purity he rose in succession to grand charioteer and minister of the national granaries, attendant as before.',
    'In the first year of Supreme Purity he rose in succession to grand charioteer and minister of the national granaries, keeping his attendant post.',
  ],
  s0088: [
    'For more than ten years in the forbidden precinct he handled confidential affairs, second only to Zhu Yi.',
    'For more than ten years in the forbidden precinct he handled confidential affairs, second only to Zhu Yi.',
  ],
  s0089: [
    'That winter Marquis Zhenyang of Xiao Yuanming, governor of Yuzhou, led troops to attack Pengcheng; the army was defeated and Yuanming was taken by Wei.',
    'That winter Marquis Zhenyang, Xiao Yuanming, governor of Yuzhou, led troops against Pengcheng; the army was defeated and Yuanming fell into Wei hands.',
  ],
  s0090: [
    'In the second year Yuanming sent envoys back, reporting that the Wei wished renewed peace and harmony; an edict ordered the relevant offices and nearby ministers to decide.',
    'In the second year Yuanming sent envoys back, saying the Wei wished renewed peace; an edict ordered the relevant offices and nearby ministers to decide.',
  ],
  s0091: [
    'Left Guard Zhu Yi said: "Gao Cheng\'s intent is surely to renew the good relations and not break the prior peace;',
    'Left Guard Zhu Yi said, "Gao Cheng\'s intent is surely to renew good relations and not break the prior peace;',
  ],
  s0092: [
    'the borders may rest from raiders and the people from harm—for affairs this is convenient.',
    'the borders may rest from raiders and the people from harm—for affairs this is convenient.',
  ],
  s0093: [
    'The debaters all agreed with him.',
    'The debaters all agreed with him.',
  ],
  s0094: [
    'Qi alone said: "Gao Cheng has newly secured his aims; his power is not weak—why should he need peace?',
    'Qi alone said, "Gao Cheng has newly secured his aims; his power is not weak—why should he need peace?',
  ],
  s0095: [
    'This must be a stratagem: he has Zhenyang send envoys so that Hou Jing will suspect he is to be exchanged for Zhenyang.',
    'This must be a stratagem: he has Zhenyang send envoys so Hou Jing will suspect he is to be exchanged for Zhenyang.',
  ],
  s0096: [
    'Uneasy in mind, Jing is sure to plot rebellion.',
    'Uneasy in mind, Jing is sure to plot rebellion.',
  ],
  s0097: [
    'If we now grant Cheng peace, we fall straight into his scheme.',
    'If we now grant Cheng peace, we fall straight into his scheme.',
  ],
  s0098: [
    'Moreover, last year Pengcheng lost its army and Guoyang has newly suffered defeat and retreat—to make peace now only shows the state\'s weakness.',
    'Moreover, last year Pengcheng lost its army and Guoyang has newly suffered defeat and retreat—to make peace now only shows the state\'s weakness.',
  ],
  s0099: [
    'In my humble view this peace ought not be granted.',
    'In my humble view this peace ought not be granted.',
  ],
  s0100: [
    'Zhu Yi and the rest held firm; the Founding Emperor followed Yi\'s counsel.',
    'Zhu Yi and the rest held firm; the Founding Emperor followed Yi\'s counsel.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_042_b1.mjs <translation.json>'
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
