#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'The place where Zhongchang You dwelt in retirement and the beauty Xiu Lian described—my longing runs deep and empty; how could one even sketch it?',
    'Zhongchang You\'s retreat and Xiu Lian\'s praise left me yearning with no likeness.',
  ],
  s0402: [
    'You love plain feeling greatly and have favored me with two encomia.',
    'Your generous gift of two encomia shows how much you cherish plain feeling.',
  ],
  s0403: [
    'The diction is rich and lovely, the matter and meaning fully set forth; between lines and rhymes light and shadow answer each other—suddenly this place seems ten times itself by nature.',
    'Lovely diction, full meaning, line answering line in light—this place seems tenfold brighter.',
  ],
  s0404: [
    'Thus one knows the benefit of fine words is vast; I shall place them on the upper shelf and sigh over them sitting or lying down.',
    'Fine words help so much—I will keep them on the shelf and read them again and again.',
  ],
  s0405: [
    'The other scrolls and pieces are all famous compositions.',
    'Your other pieces are all masterworks.',
  ],
  s0406: [
    'Again, the mountain-temple piece is already a sharp admonition; the gentlemen\'s pieces of the time are again lofty and strange—delighting the cheek and curing illness; the meaning joins with this.',
    'Your mountain-temple essay already warns; your friends\' pieces are lofty too—joy and healing together.',
  ],
  s0407: [
    'Delay this meeting for talk; let us analyze together again.',
    'Let us meet soon and discuss them further.',
  ],
  s0408: [
    'Thus was he prized by Yue.',
    'Yue prized him in this way.',
  ],
  s0409: [
    'Again, once at Ren Fang\'s seat someone presented Fang with jujube wine and wrote the character with the "wood" form.',
    'At Ren Fang\'s seat someone sent jujube wine and wrote the character with a wood radical.',
  ],
  s0410: [
    'Fang asked Cha: "Is this character correct?"',
    'Fang asked Cha whether the character was right.',
  ],
  s0411: [
    'Cha replied: "Ge Hong\'s Character Garden writes it with wood beside 朌."',
    'Cha said Ge Hong\'s Character Garden puts wood beside 朌.',
  ],
  s0412: [
    'Fang also said: "Wine that makes one drunk a thousand days must be empty talk."',
    'Fang also said thousand-day drunkenness must be fiction.',
  ],
  s0413: [
    'Cha said: "In Guiyang\'s Chengxiang there is thousand-li wine; drink it and you are drunk when you reach home—that is also an example."',
    'Cha said Guiyang\'s Chengxiang had thousand-li wine that left you drunk at home—another example.',
  ],
  s0414: [
    'Fang was greatly startled and said: "I must have forgotten myself; I truly do not recall this."',
    'Fang was startled: "I must have forgotten; I truly do not recall this."',
  ],
  s0415: [
    'Cha said: "It comes from Yang Yuanfeng\'s compiled Record of Establishing Commanderies."',
    'Cha said it came from Yang Yuanfeng\'s Record of Establishing Commanderies.',
  ],
  s0416: [
    'Yuanfeng was a man of Wei; that book still carries his fu, saying "triple ranks and five grades, Shangxi and Zeli."',
    'Yuanfeng was a Wei man; the book still has his fu on triple ranks and five grades at Shangxi and Zeli.',
  ],
  s0417: [
    'They immediately checked Yang\'s record; every word matched.',
    'They checked Yang\'s record at once; all matched.',
  ],
  s0418: [
    'Wang Sengru received an edict to compile genealogies and asked Cha about the origins of blood lines.',
    'Wang Sengru, ordered to compile genealogies, asked Cha about blood-line origins.',
  ],
  s0419: [
    'Cha said: "Huan Tan\'s New Discourses says: \'The Grand Historian\'s Genealogical Tables of Three Ages run sideways and slant upward, all imitating Zhou genealogies.\'"',
    'Cha cited Huan Tan: the Grand Historian\'s tables ran sideways like Zhou genealogies.',
  ],
  s0420: [
    'By this one infers they must begin in the Zhou era.',
    'From that he inferred they began in Zhou.',
  ],
  s0421: [
    'Sengru sighed and said: "One may say this is something never heard before."',
    'Sengru sighed: "Truly unheard-of."',
  ],
  s0422: [
    'Zhou She also asked Cha: "Attendants-in-ordinary wear purple lotus pouches; tradition says \'grasping the pouch\'—where does it ultimately come from?"',
    'Zhou She asked why attendants-in-ordinary wore purple lotus pouches—the "grasping the pouch" tradition.',
  ],
  s0423: [
    'Cha answered: "The Biography of Zhang Anshi says \'holding the pouch and pinning the brush, serving Emperor Xiaowu for several decades.\'"',
    'Cha cited Zhang Anshi\'s biography on holding pouch and brush for decades.',
  ],
  s0424: [
    'Wei Zhao\'s and Zhang Yan\'s commentaries both say \'pouch means bag.\'',
    'Wei Zhao and Zhang Yan both glossed pouch as bag.',
  ],
  s0425: [
    'A close minister pins the brush to await consultation.',
    'Close ministers pinned brushes to await consultation.',
  ],
  s0426: [
    'Fan Xiu compiled Pronunciation and Glosses for the Character Book and again consulted Cha.',
    'Fan Xiu, compiling pronunciation glosses, consulted Cha again.',
  ],
  s0427: [
    'His broad learning and strong memory were all of this kind.',
    'His erudition and memory were all like this.',
  ],
  s0428: [
    'Soon he assisted Zhou She in compiling the national history.',
    'Soon he assisted Zhou She on the national history.',
  ],
  s0429: [
    'He went out as Magistrate of Linjin and had good achievements.',
    'As Linjin magistrate he achieved good results.',
  ],
  s0430: [
    'When his term ended, more than three hundred men of the county went to the gate to ask that he be kept; an edict permitted it.',
    'At term\'s end three hundred county men petitioned to keep him; the throne agreed.',
  ],
  s0431: [
    'Cha cited illness and asked to be released, then was appointed again as Cloud-Banner Prince Jin\'an\'s staff officer.',
    'Illness made him resign; he returned as Prince Jin\'an\'s staff officer.',
  ],
  s0432: [
    'Household Steward Xu Mian recommended Cha and Gu Xie and four others to enter Hualin to compile the Comprehensive Digest; when the book was finished he held his original office concurrently as Director of the Court of Justice, then resigned again because of foot ailment.',
    'Xu Mian sent Cha and Gu Xie and others to Hualin for the Comprehensive Digest; afterward he was concurrent director of justice, then quit for foot ailment.',
  ],
  s0433: [
    'Thereupon he composed the "Forest Garden Fu."',
    'He then wrote the "Forest Garden Fu."',
  ],
  s0434: [
    'Wang Sengru, seeing it, sighed: "After the \'Suburban Dwelling\' there is no such work again."',
    'Wang Sengru sighed: "Nothing like this since the \'Suburban Dwelling.\'"',
  ],
  s0435: [
    'In the first year of Putong he was again appointed Director of Jiankang, then promoted to Director of the Imperial Stud;',
    'In Putong 1 he was Jiankang director, then imperial stud director;',
  ],
  s0436: [
    'after several months he was transferred to act as Director of Ceremonies; Vice Minister Mian entrusted all court literary deliberations to Cha alone.',
    'months later he acted as director of ceremonies; Mian entrusted all literary business to him.',
  ],
  s0437: [
    'He went out as Magistrate of Yuyao; in the county he was pure and clean, accepting nothing from anyone who offered gifts; Prince Xiangdong issued a commendation praising him.',
    'As Yuyao magistrate he was pure and took no gifts; Prince Xiangdong praised him.',
  ],
  s0438: [
    'Returning, he was appointed Staff Officer to the Prince of Xuanhui, Prince Xiangdong, and left office for mourning his mother.',
    'He returned as Prince Xiangdong\'s staff officer, then mourned his mother.',
  ],
  s0439: [
    'When mourning ended he again became the prince\'s staff officer, concurrently Eastern Palace Attendant for Miscellaneous Affairs.',
    'After mourning he was staff officer again and eastern-palace attendant.',
  ],
  s0440: [
    'In the first year of Datong he was promoted to Commandant of Footsoldiers, still concurrently attendant as before.',
    'In Datong 1 he became footsoldier commandant, still attendant.',
  ],
  s0441: [
    'Crown Prince Zhaoming said to Cha: "Wine is not what you love, yet you hold the office of wine steward—truly you do not shame the ancients."',
    'Zhaoming said: "You dislike wine yet hold the wine office—you shame no ancients."',
  ],
  s0442: [
    'Soon there was an edict having him replace Pei Ziye in charge of the Director of Writings.',
    'Soon an edict had him replace Pei Ziye as director of writings.',
  ],
  s0443: [
    'When Crown Prince Zhaoming died and the new palace was built, by old rule former staff were not kept; an edict specially retained Cha.',
    'When Zhaoming died and the new palace rose, old staff were dismissed—but Cha was kept by edict.',
  ],
  s0444: [
    'He also annotated the crown prince\'s "Fu on Returning," and was called thorough in knowledge.',
    'He annotated the crown prince\'s "Fu on Returning" and was called thorough.',
  ],
  s0445: [
    'Vice Minister He Jingrong memorialized to transfer Cha to the prince\'s staff counselor; Gaozu said: "Liu Cha must first pass through the Secretariat."',
    'He Jingrong wanted Cha as prince counselor; Gaozu said he must pass the secretariat first.',
  ],
  s0446: [
    'He was then appointed Secretariat Gentleman.',
    'He was appointed secretariat gentleman.',
  ],
  s0447: [
    'Soon he was Pacifying-West Prince Xiangdong\'s staff counselor, concurrently attendant and in charge of writings as before.',
    'Soon he was Xiangdong\'s pacifying-west counselor, still attendant and director of writings.',
  ],
  s0448: [
    'He was promoted to Left Vice Director of the Masters of Writing.',
    'He rose to left vice director of the masters of writing.',
  ],
  s0449: [
    'In the second year of Datong he died in office at age fifty.',
    'In Datong 2 he died in office at fifty.',
  ],
  s0450: [
    'Cha governed himself in purity and frugality and had no indulgences.',
    'Cha lived purely and frugally without indulgence.',
  ],
  s0451: [
    'By nature he did not boast; he did not discuss others\' faults and strengths; when he saw Buddhist sutras he constantly practiced compassion and forbearance.',
    'He did not boast or judge others; Buddhist texts moved him to compassion.',
  ],
  s0452: [
    'In the seventeenth year of Tianjian, from the time he mourned his mother, he long cut off meat and fish and kept vegetarian fast.',
    'From mourning his mother in Tianjian 17 he ate no meat and kept vegetarian fast.',
  ],
  s0453: [
    'At the end he left instructions to be dressed in monastic robes, carried on an open cart, and buried in the old tomb with only enough ground for the coffin; spirit tables and sacrificial feasts were not to be set up.',
    'Dying, he ordered monastic dress, an open cart, a simple grave, and no spirit table or feast.',
  ],
  s0454: [
    'His son Zun carried it out.',
    'His son Zun obeyed.',
  ],
  s0455: [
    'From youth to age Cha composed many works.',
    'From youth to age he wrote much.',
  ],
  s0456: [
    'He compiled Essential Elegantiae in five juan, Exegesis of Plants in the Songs of Chu in one juan, Biographies of Lofty Men in two juan, Old and New Records of the Eastern Palace in thirty juan, and Catalogue of Books in Four Divisions, Ancient and Modern, in five juan—all circulating in the world.',
    'He compiled Essential Elegantiae (5 j.), Chu plants (1 j.), Lofty Men (2 j.), Eastern Palace records (30 j.), and a four-division catalogue (5 j.)—all extant.',
  ],
  s0457: [
    'Xie Zheng, courtesy name Xuandu, was a man of Yangxia in Chen commandery.',
    'Xie Zheng, styled Xuandu, was from Yangxia in Chen.',
  ],
  s0458: [
    'His founding ancestor for the dynasty Jingren was Song Left Vice Director of the Masters of Writing.',
    'Dynasty founder Jingren was Song left vice director.',
  ],
  s0459: [
    'His grandfather Zhi was Song Director of the Secretariat Secretariat.',
    'Grandfather Zhi was Song secretariat director.',
  ],
  s0460: [
    'His father Jing was young when he and his cousin Tiao were both famous.',
    'Father Jing and cousin Tiao were both famous young.',
  ],
  s0461: [
    'In Qi, Prince Jingling of Jingling opened the Western Lodge to recruit men of letters; Jing also took part.',
    'In Qi, Prince Jingling\'s western lodge drew writers; Jing joined them.',
  ],
  s0462: [
    'In Longchang he was staff counselor to Mingdi\'s Rapid Cavalry general, heading the secretariat.',
    'In Longchang he was Mingdi\'s rapid-cavalry counselor and headed the secretariat.',
  ],
  s0463: [
    'He was promoted to Secretariat Gentleman and Interior Minister of Jin\'an.',
    'He rose to secretariat gentleman and Jin\'an interior minister.',
  ],
  s0464: [
    'When Gaozu pacified the capital region he was staff counselor to the Lord of Hegemony and Huangmen Gentleman of the Liang Terrace.',
    'When Gaozu took the capital he was hegemon counselor and Liang terrace huangmen gentleman.',
  ],
  s0465: [
    'In the early Tianjian era he was promoted in succession to Director of the Imperial Granaries, Director of the Secretariat, Director of the Left Household, General of Illustrious Might, and Grand Administrator of Dongyang.',
    'Early Tianjian he rose through granaries, secretariat, left household, illustrious might general, and Dongyang grand administrator.',
  ],
  s0466: [
    'Gaozu wished to use him as Attendant-in-ordinary; he firmly declined on grounds of age and sought gold and purple rank; before the order was issued he died of illness.',
    'Gaozu wanted him as attendant-in-ordinary; he declined for age and sought gold-purple rank, then died before appointment.',
  ],
  s0467: [
    'Zheng was clever as a child; Jing marveled at him and often told close kin: "This boy is no ordinary vessel; what I worry about is his lifespan;',
    'Clever as a child, Jing told kin: "This boy is extraordinary; I only fear a short life;',
  ],
  s0468: [
    'if Heaven grants him years, I shall have no regret."',
    'if Heaven grants years, I have no regret."',
  ],
  s0469: [
    'When grown he had fine bearing, loved learning, and was skilled at literary composition.',
    'Grown, he had fine bearing, loved learning, and wrote well.',
  ],
  s0470: [
    'At first he was Law Officer to the Prince of An\'an, Prince Ancheng; he was promoted to Gentleman of the Gold Bureau and the Three Dukes in the Masters of Writing and Staff Officer to the Prince of Yuzhang, concurrently Secretariat Attendant.',
    'He began as Ancheng\'s law officer, then masters-of-writing gentleman and Yuzhang staff officer and secretariat attendant.',
  ],
  s0471: [
    'He was promoted and removed to Pacifying-North staff counselor, concurrently Director of the Court for Dependencies, still attendant as before.',
    'He became pacifying-north counselor and director of dependencies, still attendant.',
  ],
  s0472: [
    'Zheng was on friendly terms with Hedong Pei Ziye and Pei Guo Liu Xian in the same office; Ziye once composed "Fu on Night Duty in the Cold" to present to Zheng, and Zheng composed "Fu on Moved by Friends" in reply.',
    'Zheng befriended Pei Ziye and Liu Xian; they exchanged fu on night duty and friendship.',
  ],
  s0473: [
    'At that time Wei Prince Yuan Lue of Zhongshan was returning north; Gaozu feasted him at Wude Hall and assigned a poem of thirty rhymes to be finished within three quarter-hours.',
    'When Wei\'s Prince Yuan Lue left north, Gaozu feasted him at Wude and set a thirty-rhyme poem in three quarters of an hour.',
  ],
  s0474: [
    'Zheng finished in two quarter-hours; the wording was very fine, and Gaozu read it twice.',
    'Zheng finished in two quarters; Gaozu read it twice.',
  ],
  s0475: [
    'He also composed the "Essay on Releasing Life" for the Marquis of Linru, Yuan You, and it too was prized in the world.',
    'His "Essay on Releasing Life" for Marquis Yuan You was also prized.',
  ],
  s0476: [
    'Zang Yan, courtesy name Yanwei, was a man of Ju in Dongguan.',
    'Zang Yan, styled Yanwei, was from Ju in Dongguan.',
  ],
  s0477: [
    'His great-grandfather Tao was Song Left Grand Master of Splendid Happiness.',
    'Great-grandfather Tao was Song left grand master of splendid happiness.',
  ],
  s0478: [
    'His grandfather Ning was Qi Right Vice Director of the Masters of Writing.',
    'Grandfather Ning was Qi right vice director.',
  ],
  s0479: [
    'His father Ling was Rear Army staff officer.',
    'Father Ling was rear army staff officer.',
  ],
  s0480: [
    'Yan from childhood had filial nature; in mourning his father he was known for grief that injured him.',
    'As a child he was filial; mourning his father he was known for destructive grief.',
  ],
  s0481: [
    'Orphaned and poor, he studied diligently; going and stopping, books never left his hand.',
    'Orphaned and poor, he studied hard and always carried a book.',
  ],
  s0482: [
    'At first he was Gentleman to the Prince of Ancheng, then transferred to Regular Attendant.',
    'He began as Prince Ancheng\'s gentleman, then regular attendant.',
  ],
  s0483: [
    'His paternal uncle Wei Zhen was Grand Administrator of Jiangxia and took Yan to his post; on the road he composed the "Fu on Garrison Travel"; Ren Fang saw it and praised it.',
    'Uncle Wei Zhen took him to Jiangxia; on the road he wrote "Fu on Garrison Travel" and Ren Fang praised it.',
  ],
  s0484: [
    'He also composed the "Seven Calculations"; the wording too was rich and lovely.',
    'His "Seven Calculations" was also rich and lovely.',
  ],
  s0485: [
    'By nature he was solitary and aloof; among men he never paid calls.',
    'Solitary by nature, he never paid social calls.',
  ],
  s0486: [
    'Vice Minister Xu Mian wished to know him; Yan to the end did not visit.',
    'Xu Mian wished to know him; Yan never came.',
  ],
  s0487: [
    'He was promoted to Army Adjutant in the Champion\'s office and attended Prince Xiangdong\'s studies, then in succession to the prince\'s Xuanhui Light-Carriage staff officer, concurrently secretariat.',
    'He rose to champion adjutant, tutored Xiangdong, then light-carriage staff officer and secretariat.',
  ],
  s0488: [
    'Yan in learning knew and remembered much, especially mastering the Book of Han; he could recite nearly all of it by heart.',
    'He knew much, especially the Book of Han, nearly all by heart.',
  ],
  s0489: [
    'The prince once himself held the catalogue of the four divisions to test him; from juan A through D in each volume Yan answered one item and the author\'s name, with nothing lost—so broadly learned was he.',
    'The prince tested him with the four-division catalogue; from A to D he named every item and author without error.',
  ],
  s0490: [
    'When the prince moved to Jingzhou, he followed the headquarters and became Recorder of the Western Central and Pacifying-West headquarters.',
    'When the prince went to Jingzhou he became western headquarters recorder.',
  ],
  s0491: [
    'He served in succession as Inspector of Yiyang and Wuning commanderies; successive posts were all on the barbarian frontier; former grand administrators often chose military men to hold them with troops;',
    'He inspected Yiyang and Wuning on the frontier where former magistrates used soldiers;',
  ],
  s0492: [
    'Yan alone entered the territory with a few students in a single cart; the barbarian clans were pleased and submitted, and banditry ceased.',
    'Yan entered alone with a few students; the tribes submitted and banditry ceased.',
  ],
  s0493: [
    'When the prince entered the capital as military affairs officer at Stone City, he was appointed Pacifying-Right recorder.',
    'When the prince entered as Stone City officer he was pacifying-right recorder.',
  ],
  s0494: [
    'When the prince moved to Jiangzhou he was Pacifying-South staff counselor and died in office.',
    'At Jiangzhou he was pacifying-south counselor and died in office.',
  ],
  s0495: [
    'His collected writings were ten juan.',
    'Collected writings: ten juan.',
  ],
  s0496: [
    'Fu Ting, courtesy name Shibiao.',
    'Fu Ting, styled Shibiao.',
  ],
  s0497: [
    'His father Peng was Interior Minister of Yuzhang and appears in the Biography of Good Officials.',
    'Father Peng was Yuzhang interior minister, in the Good Officials biography.',
  ],
  s0498: [
    'Ting as a child was clever and understanding; at seven he mastered the Classic of Filial Piety and the Analects.',
    'As a child he was clever; at seven he knew the Filial Classic and Analects.',
  ],
  s0499: [
    'When grown he had literary talent and thought, loved composition, wrote five-word poetry, and was skilled at imitating Xie Kangyue\'s style.',
    'Grown, he wrote poetry in Xie Kangyue\'s style.',
  ],
  s0500: [
    'His father\'s friend Ren Fang of Le\'an deeply marveled at him and often said: "This boy under heaven has no peer."',
    'Ren Fang of Le\'an often said: "This boy has no peer under heaven."',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_050_b5.mjs <translation.json>'
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
