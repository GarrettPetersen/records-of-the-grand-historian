#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'The crown prince stands second to the pole star; all within the seas perform the protocol of subordinate officials. Having done full ritual to the royal heir, one cannot withhold reverence toward her who bore him.',
    'The crown prince stands second only to the throne; all the realm performs the rites of subordinate officials. Once the heir is fully honored, his mother cannot go without honor.',
  ],
  s0102: [
    'Yet imperial consorts stand apart by principle from the outer court; by reason and precedent there is no path of formal reverence.',
    'Yet imperial consorts are cut off by principle from the outer court; by reason and precedent there is no way to show formal reverence.',
  ],
  s0103: [
    'Now the crown prince\'s sage brilliance is in his person, the heir\'s rites long since prepared—the way of honoring the mother through the son indeed has old statutes.',
    'Now the crown prince\'s wisdom is manifest and his heir\'s rites long in place—the way of exalting the mother through the son has old statutes after all.',
  ],
  s0104: [
    'Princesses and feudal ladies who ordinarily may exchange messages, and the six palaces\' three ladies of rank though equal to the honored consort in standing—all should use the same reverence shown the crown prince to revere the honored consort.',
    'Princesses and feudal ladies who may ordinarily exchange messages, and the six palaces\' three ladies of rank though equal to the honored consort—all should honor her with the same rites used for the crown prince.',
  ],
  s0105: [
    'In Yuanjia of Song, ministers of the principalities of Shixing and Wuling all used subordinate-official reverence toward their lords\' mothers, Consorts Pan and Lady Lu.',
    'In Song Yuanjia, ministers of Shixing and Wuling both used subordinate-official reverence toward their lords\' mothers, Consort Pan and Lady Lu.',
  ],
  s0106: [
    'To palace officials the honored consort is not the lesser lord, yet the principle is unchanged; it matches exactly the Song Taizong-era deliberation that all officials use subordinate reverence toward the emperor\'s mother.',
    'To palace officials the honored consort is not a lesser lord, yet the principle is the same; it matches the Song Taizong deliberation that all officials use subordinate reverence toward the emperor\'s mother.',
  ],
  s0107: [
    'It is proposed that eunuchs of the palace who show reverence should follow subordinate protocol, going to the Spirit Tiger Gate with memorial tablets to pay audience;',
    'Palace eunuchs who show reverence should follow subordinate protocol, going to the Spirit Tiger Gate with memorial tablets to pay audience;',
  ],
  s0108: [
    'New Year felicitations should follow the same rule.',
    'New Year felicitations should follow the same rule.',
  ],
  s0109: [
    'Women have no affairs outside the inner quarter; congratulatory and inquiry memorials should simply be reported by the responsible office.',
    'Women have no affairs outside the inner quarter; congratulatory and inquiry memorials need only be reported by the responsible office.',
  ],
  s0110: [
    'The way of wifehood allows no self-direction; if one does not look up and attach to one\'s husband, one must look down and attach to one\'s son.',
    'The way of wifehood allows no self-direction; if one does not look up to one\'s husband, one must look down to one\'s son.',
  ],
  s0111: [
    'The way of honoring kin should reach the fullest honor due; never has what the son practices been matched by insufficient observance from those who follow him.',
    'The way of honoring kin should reach the fullest honor due; never has the son\'s observance been matched by insufficient observance from those who follow him.',
  ],
  s0112: [
    'Hence in the Spring and Autumn Annals, whenever the king appointed someone as lady, ritual rank equaled that of her sons.',
    'Hence in the Spring and Autumn Annals, whenever the king appointed someone as lady, ritual rank equaled that of her sons.',
  ],
  s0113: [
    'Among feudal states it differed from the heir apparent, yet the principle of following the honored was the same.',
    'Among feudal states it differed from the heir apparent, yet the principle of following the honored was the same.',
  ],
  s0114: [
    'Former generations\' precedents are set forth in old records.',
    'Former generations\' precedents are set forth in old records.',
  ],
  s0115: [
    'The honored consort bore the primary heir and secured the great enterprise; ritual equal to the heir is indeed the old canon.',
    'The honored consort bore the primary heir and secured the great enterprise; ritual equal to the heir is indeed the old canon.',
  ],
  s0116: [
    'Searching former ages, when the honored consort was first instituted, her place was second to the empress, with no title to which others looked for comparison;',
    'Searching former ages, when the honored consort was first instituted, her place was second to the empress, with no comparable title;',
  ],
  s0117: [
    'the next office below viewed the chancellor of state in rank, titles compared to feudal kings.',
    'the next office below ranked with the chancellor of state, titles compared to feudal kings.',
  ],
  s0118: [
    'Even this ritual for the honored consort already stood above the court ranks;',
    'Even this ritual for the honored consort already stood above the court ranks;',
  ],
  s0119: [
    'how much more when she is mother-exemplar of the eastern palace—the reckoning breaks ordinary measure.',
    'how much more when she is mother-exemplar of the eastern palace—the reckoning breaks ordinary measure.',
  ],
  s0120: [
    'Moreover the heir\'s consort is paired by the grandest norms;',
    'Moreover the heir\'s consort is paired by the grandest norms;',
  ],
  s0121: [
    'for a daughter-in-law to outrank her husband\'s mother only further violates the order of submission.',
    'for a daughter-in-law to outrank her husband\'s mother only further violates the order of submission.',
  ],
  s0122: [
    'It is proposed that the honored consort\'s statutes and insignia be wholly without difference from the crown prince.',
    'It is proposed that the honored consort\'s statutes and insignia be wholly without difference from the crown prince.',
  ],
  s0123: [
    'Thereupon the honored consort was equipped with statutes and ritual numbers identical to the crown prince; in speech she was addressed as "Command."',
    'Thereupon the honored consort was equipped with statutes and ritual numbers identical to the crown prince; in speech she was addressed as "Command."',
  ],
  s0124: [
    'The honored consort was by nature kind and forgiving; once she dwelt within the palace, she received and guided those below and won all their hearts.',
    'The honored consort was by nature kind and forgiving; once she dwelt within the palace, she received and guided those below and won all their hearts.',
  ],
  s0125: [
    'She did not care for ornate dress; utensils and garments had no lavish gems; she never received private audiences for kin.',
    'She did not care for ornate dress; utensils and garments had no lavish gems; she never received private audiences for kin.',
  ],
  s0126: [
    'When Gaozu spread Buddhism, the honored consort followed it, banishing rich foods and keeping to vegetables long term.',
    'When Gaozu spread Buddhism, the honored consort followed it, banishing rich foods and keeping to vegetables long term.',
  ],
  s0127: [
    'On the day she received the precepts, sweet dew fell before the hall, a square of one zhang and five chi.',
    'On the day she received the precepts, sweet dew fell before the hall, a square of one zhang and five chi.',
  ],
  s0128: [
    'Of the sutra meanings Gaozu established, she grasped every import.',
    'Of the sutra meanings Gaozu established, she grasped every import.',
  ],
  s0129: [
    'She was especially versed in the Vimalakirti Sutra.',
    'She was especially versed in the Vimalakirti Sutra.',
  ],
  s0130: [
    'All stipends and gifts she received went entirely to Buddhist rites.',
    'All stipends and gifts she received went entirely to Buddhist rites.',
  ],
  s0131: [
    'In the eleventh month, gengchen, year 7 of Putong, she died; her bier lay in the Eastern Palace\'s Cloud-Approach Hall; age forty-two.',
    'In the eleventh month, gengchen, year 7 of Putong, she died; her bier lay in the Eastern Palace\'s Cloud-Approach Hall; age forty-two.',
  ],
  s0132: [
    'An edict ordered Minister of Personnel Zhang Zuan to compose the lament-seal text, saying:',
    'An edict ordered Minister of Personnel Zhang Zuan to compose the lament-seal text, saying:',
  ],
  s0133: [
    'The cypress path is opened, the cassia coffin stands void and still; the dragon curtains are offered up, the ceremonial robes are about to be raised.',
    'The funeral road opens; the cassia coffin waits empty and still. Dragon curtains are laid in offering; court robes are ready to be raised.',
  ],
  s0134: [
    'The emperor grieves that the jade terrace\'s banners fly on forever, mourns that the lofty citadel may not be tread; he stops the village songs of Yan music, suspends the clearing of vessels from the sacrificial canon.',
    'The emperor mourns the jade terrace\'s banners drifting on, the high citadel he cannot climb; village songs of feast music cease, and sacrificial vessels go uncleared from the canon.',
  ],
  s0135: [
    'In the Odes there is "Gathering White Eulalia"; virtue flowed to the southern states—therefore he commands the historiographer to let the consort\'s virtue stream forth.',
    'The Odes have "Gathering Eulalia," virtue spreading through the southern realm—so he charges the historiographer to carry her consort\'s virtue abroad.',
  ],
  s0136: [
    'The text says:',
    'The text says:',
  ],
  s0137: [
    'Essence of the axis star, splendor of Yangtze and Han;',
    'Essence of the pole star, splendor of the great rivers;',
  ],
  s0138: [
    'returning to the ruler\'s sleeve, she bore this departing radiance.',
    'she entered the ruler\'s embrace and bore this departing light.',
  ],
  s0139: [
    'From her beginning, the season was full nurture;',
    'From the first, her season was ripe with nurture;',
  ],
  s0140: [
    'pivot-lightning coiled the suburbs, divine light filled the house.',
    'lightning coiled the suburbs; divine radiance filled the house.',
  ],
  s0141: [
    'When she reached the age to wait upon marriage, grace was already complete;',
    'When she reached the age to wait upon marriage, grace was already complete;',
  ],
  s0142: [
    'her fame reached the sunlit lands, her reputation spread through the central valley.',
    'her fame reached the sunlit lands, her reputation spread through the central valley.',
  ],
  s0143: [
    'Dragon virtue lay in the fields; she reverently attended this sacrifice;',
    'Dragon virtue lay in the fields; she reverently attended this sacrifice;',
  ],
  s0144: [
    'feminine transformation succeeded the end, royal wind began.',
    'feminine transformation succeeded the end, royal wind began.',
  ],
  s0145: [
    'bearing and expression followed the patterns, words departed to consult the histories;',
    'bearing and expression followed the patterns, words departed to consult the histories;',
  ],
  s0146: [
    '"Harmonize his household," she modeled the state\'s discipline.',
    '"Harmonize his household," she modeled the state\'s discipline.',
  ],
  s0147: [
    'She received this charge of favor, from this took her dwelling of the heart;',
    'She received this charge of favor, from this took her dwelling of the heart;',
  ],
  s0148: [
    'Di bells strung colored studs, girdle-pendants moved with elegant sound.',
    'Di bells strung colored studs, girdle-pendants moved with elegant sound.',
  ],
  s0149: [
    'At noon she pondered warnings, at the full moon she cherished admonitions;',
    'At noon she pondered warnings, at the full moon she cherished admonitions;',
  ],
  s0150: [
    'how could she not be cramped? Heaven\'s height looked down.',
    'how could she not be cramped? Heaven\'s height looked down.',
  ],
  s0151: [
    'The dark sash was not repaired, ceremonial robes early torn;',
    'The dark sash was not repaired, ceremonial robes early torn;',
  ],
  s0152: [
    'who can complete the world\'s work? fragrant plans had blaze.',
    'who can complete the world\'s work? fragrant plans had blaze.',
  ],
  s0153: [
    'plain moon faithful and bright, purple palace clearly lit;',
    'plain moon faithful and bright, purple palace clearly lit;',
  ],
  s0154: [
    'reaching down without harm, thinking on worth without blindness.',
    'reaching down without harm, thinking on worth without blindness.',
  ],
  s0155: [
    'personal thrift was her rule, solemn service wholly devout;',
    'personal thrift was her rule, solemn service wholly devout;',
  ],
  s0156: [
    'gold and jade held no play, baskets and bamboo were never cast aside.',
    'gold and jade held no play, baskets and bamboo were never cast aside.',
  ],
  s0157: [
    'auspicious virtue flowed, celebration appeared for kin;',
    'auspicious virtue flowed, celebration appeared for kin;',
  ],
  s0158: [
    'excellence ever opened, she nurtured Lu, molded Yan.',
    'excellence ever opened, she nurtured Lu, molded Yan.',
  ],
  s0159: [
    'just as they discussed women\'s teaching, bright statutes for the inner seat—',
    'just as they discussed women\'s teaching, bright statutes for the inner seat—',
  ],
  s0160: [
    'the dark pool was barred early, Xiang and Yuan already silent.',
    'the dark pool was barred early, Xiang and Yuan already silent.',
  ],
  s0161: [
    'unfolding robes laid aside splendor, vermilion curtains covered her traces;',
    'unfolding robes laid aside splendor, vermilion curtains covered her traces;',
  ],
  s0162: [
    'longing knotted the heir\'s quarters, grief deep for the feudal ramparts.',
    'longing knotted the heir\'s quarters, grief deep for the feudal ramparts.',
  ],
  s0163: [
    'Alas, how mournful!',
    'Alas—how mournful!',
  ],
  s0164: [
    'Order the tortoise augury for a lucky day, lead the soul to move the ancestors;',
    'Order the tortoise augury for a lucky day, lead the soul to move the ancestors;',
  ],
  s0165: [
    'all officials ranked in order, Succession Flourishing lined shoulder to shoulder.',
    'all officials ranked in order, Succession Flourishing lined shoulder to shoulder.',
  ],
  s0166: [
    'The sun dim and misted over spring, wind bleak and knotting grief;',
    'The sun dim and misted over spring, wind bleak and knotting grief;',
  ],
  s0167: [
    'leaving the former side-wing she lingered in delay, adorning the new palace she prolonged her stay.',
    'leaving the former side-wing she lingered in delay, adorning the new palace she prolonged her stay.',
  ],
  s0168: [
    'Alas, how mournful!',
    'Alas—how mournful!',
  ],
  s0169: [
    'Raise the scarlet banner\'s star pennant, shake the carriage\'s brocade hangings;',
    'Raise the scarlet banner\'s star pennant, shake the carriage\'s brocade hangings;',
  ],
  s0170: [
    'imitate the spirit bronze\'s Chu gloom, float the chill pipe\'s congealed sorrow.',
    'imitate the spirit bronze\'s Chu gloom, float the chill pipe\'s congealed sorrow.',
  ],
  s0171: [
    'remaining things left in the encampment hall, covering the heavy inner gates in silent dark;',
    'remaining things left in the encampment hall, covering the heavy inner gates in silent dark;',
  ],
  s0172: [
    'pepper breeze warm as of old, orchid hall dim without sun.',
    'pepper breeze warm as of old, orchid hall dim without sun.',
  ],
  s0173: [
    'Alas, how mournful!',
    'Alas—how mournful!',
  ],
  s0174: [
    'the side gate\'s lofty righteousness, red tube had joy;',
    'the side gate\'s lofty righteousness, red tube had joy;',
  ],
  s0175: [
    'the Way changed Yu\'s wind, merit joined Tang\'s tracks.',
    'the Way changed Yu\'s wind, merit joined Tang\'s tracks.',
  ],
  s0176: [
    'a yielding such person, resting light on red slippers;',
    'a yielding such person, resting light on red slippers;',
  ],
  s0177: [
    'spread through heaven and earth, without morning or evening.',
    'spread through heaven and earth, without morning or evening.',
  ],
  s0178: [
    'Alas, how mournful!',
    'Alas—how mournful!',
  ],
  s0179: [
    'The responsible offices memorialized posthumous title: Mu.',
    'The responsible offices memorialized posthumous title: Mu.',
  ],
  s0180: [
    'When Emperor Taizong took the throne, she was posthumously honored as Empress Dowager Mu.',
    'When Emperor Taizong took the throne, she was posthumously honored as Empress Dowager Mu.',
  ],
  s0181: [
    'The empress dowager\'s father Zhongqian, in early Tianjian, reached office as inspector of Yan province.',
    'The empress dowager\'s father Zhongqian, in early Tianjian, reached office as inspector of Yan province.',
  ],
  s0182: [
    'Gaozu\'s Ruan Xiurong',
    'Gaozu\'s Ruan Xiurong',
  ],
  s0183: [
    'Gaozu\'s Ruan Xiurong, taboo name Lingying, originally surname Shi, was of Yuyao in Kuaiji.',
    'Gaozu\'s Ruan Xiurong, taboo name Lingying, born a Shi of Yuyao in Kuaiji.',
  ],
  s0184: [
    'Prince of Shi\'an Yaoguang of Qi took her in marriage.',
    'Qi\'s Prince of Shi\'an, Yaoguang, took her to wife.',
  ],
  s0185: [
    'When Yaoguang was defeated, she entered the Depraved Emperor\'s palace.',
    'When Yaoguang fell, she was taken into the Depraved Emperor\'s palace.',
  ],
  s0186: [
    'When Jiankang fell, Gaozu took her as a painted attendant.',
    'When Jiankang fell, Gaozu took her as a painted attendant.',
  ],
  s0187: [
    'In the eighth month, year 7 of Tianjian, she bore Shizu.',
    'In the eighth month, year 7 of Tianjian, she bore Shizu.',
  ],
  s0188: [
    'Soon she was appointed Xiurong, and often followed Shizu when he went out to his fief.',
    'Soon she was appointed Xiurong, and often followed Shizu when he went out to his fief.',
  ],
  s0189: [
    'In the sixth month, year 6 of Datong, she died in the inner chamber at Jiang Province; age sixty-seven.',
    'In the sixth month, year 6 of Datong, she died in the inner chamber at Jiang Province; age sixty-seven.',
  ],
  s0190: [
    'That year in the eleventh month she was returned for burial at Tongwang Mountain in Jiangning county.',
    'That year in the eleventh month she was returned for burial at Tongwang Mountain in Jiangning county.',
  ],
  s0191: [
    'Posthumous title: Xuan.',
    'Posthumous title: Xuan.',
  ],
  s0192: [
    'When Shizu took the throne, the responsible offices memorialized to posthumously honor her as Empress Dowager Wenxuan.',
    'When Shizu took the throne, the responsible offices memorialized to posthumously honor her as Empress Dowager Wenxuan.',
  ],
  s0193: [
    'In year 2 of Chengsheng, her father was posthumously given Qi former court gentleman Lingbao, Staff Officer for the Fast Cavalry, Left Guard General, enfeoffed Marquis of Wukang with five hundred households;',
    'In year 2 of Chengsheng, her father was posthumously given Qi former court gentleman Lingbao, Staff Officer for the Fast Cavalry, Left Guard General, enfeoffed Marquis of Wukang with five hundred households;',
  ],
  s0194: [
    'mother née Chen, Lady of the Marquis of Wukang.',
    'mother née Chen, Lady of the Marquis of Wukang.',
  ],
  s0195: [
    'Shizu\'s Consort Xu',
    'Shizu\'s Consort Xu',
  ],
  s0196: [
    'Shizu\'s consort Xu, taboo name Zhaopei, was from Tan in Donghai.',
    'Shizu\'s consort Xu, taboo name Zhaopei, was from Tan in Donghai.',
  ],
  s0197: [
    'grandfather Xiaosi, Grand Commandant, Duke of Zhijiang the Cultured and Loyal.',
    'grandfather Xiaosi, Grand Commandant, Duke of Zhijiang the Cultured and Loyal.',
  ],
  s0198: [
    'father Chun, Attendant-in-Ordinary, Trustworthy Martial General.',
    'father Chun, Attendant-in-Ordinary, Trustworthy Martial General.',
  ],
  s0199: [
    'In the twelfth month, year 16 of Tianjian, she was appointed consort of the Prince of Xiangdong.',
    'In the twelfth month, year 16 of Tianjian, she was appointed consort of the Prince of Xiangdong.',
  ],
  s0200: [
    'She bore the heir Fangdeng and Princess Yichang Hanzhen.',
    'She bore the heir Fangdeng and Princess Yichang Hanzhen.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_007_b2.mjs <translation.json>'
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
