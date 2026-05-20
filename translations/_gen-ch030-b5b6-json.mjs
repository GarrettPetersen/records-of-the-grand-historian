#!/usr/bin/env node
/** Jiutangshu ch.030 batches 5–6 (s0401–s0600) → _ch030-batch5.json, _ch030-batch6.json */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0401: [
    'Again, Han and Wei xia sacrifices were all held in the tenth month. Jin ritual officers wished to use the mid-autumn yin sacrifice; Left Vice Director Kong Anguo memorialized impeachment, and more than one was dismissed from office.',
    'Han and Wei xia rites fell in the tenth month. Jin ritualists proposed a mid-autumn yin sacrifice; Left Vice Director Kong Anguo impeached them, and several lost their posts.',
  ],
  s0402: [
    'Early in Liang, meritorious ministers were mistakenly included in the di sacrifice; Left Assistant Minister He Tongzhi submitted a rebutting deliberation, and Emperor Wu approved and followed it.',
    'Early Liang wrongly ranked meritorious ministers in the di sacrifice; Left Assistant Minister He Tongzhi objected, and Emperor Wu approved his view.',
  ],
  s0403: [
    'Down through Zhou and Qi, all followed this rite.',
    'From Zhou and Qi onward all followed this practice.',
  ],
  s0404: [
    'Your subject holds that two yin sacrifices in five years accord with Heaven\'s Way—a great and a small; refined scholars agree that in the small, ministers do not participate, while in the great, meritorious ministers are also included.',
    'Two yin sacrifices in five years match Heaven\'s pattern—one great, one small. Learned opinion holds that the lesser excludes ministers, the greater includes meritorious ministers.',
  ],
  s0405: [
    'Now the rite has di without meritorious ministers; your subject truly holds the rite cannot be altered.',
    'The present rite omits meritorious ministers from di; the rite should not be changed.',
  ],
  s0406: ['" An edict then ordered the regulations changed to follow the rite.', '" An edict ordered the rules brought into line with ritual.'],
  s0407: [
    'In the Kaiyuan era, when the rites were revised, di and xia were again both made to include meritorious ministers in accompanying offerings.',
    'When Kaiyuan revised the rites, di and xia again both assigned meritorious ministers accompanying offerings.',
  ],
  s0408: [
    'In the tenth month of the third year of Shangyuan under Emperor Gaozong, a xia offering was to be performed at the Grand Temple.',
    'Gaozong, Shangyuan 3, tenth month: a Grand Temple xia was planned.',
  ],
  s0409: [
    'Deliberators cited the Rites Apocrypha, "xia once in three years, di once in five years," and the Gongyang Commentary, "two yin sacrifices in five years"; the arguments crossed and none could decide.',
    'Debates cited the Rites Apocrypha ("xia every three years, di every five") and Gongyang ("two yin sacrifices in five years") and could not be resolved.',
  ],
  s0410: [
    'Erudite of the Imperial Academy Shi Can and others deliberated: "According to the Correct Meaning of the Book of Rites citing Zheng Xuan\'s Record of Di and Xia: \'The Spring and Autumn Annals: Duke Xi died in the twelfth month of his thirty-third year.',
    'Academician Shi Can et al. argued: per the Book of Rites citing Zheng Xuan\'s Di-Xia Record, Spring and Autumn records Duke Xi\'s death in month 12, year 33.',
  ],
  s0411: [
    'In the second year of Duke Wen, eighth month, dingmao, a great offering was made at the Grand Temple.',
    'Duke Wen year 2, month 8, dingmao: a great offering at the Grand Temple.',
  ],
  s0412: ['The Gongyang Commentary says: What is a great offering?', 'Gongyang asks: what is a great offering?'],
  s0413: ['It is xia.', 'Xia.'],
  s0414: [
    '\' When the three-year mourning was complete, in the new ruler\'s second year there should be xia; the next year di at the group temples.',
    'After three-year mourning, year 2 is xia; year 3 is di at the group temples.',
  ],
  s0415: [
    'Dukes Xi and Xuan both had di in their eighth years; thus the later di was five years from the earlier di.',
    'Xi and Xuan each held di in year 8—five years between successive di.',
  ],
  s0416: [
    'By this determination, a new ruler has xia in year 2 and di in year 3.',
    'Thus a new ruler: xia year 2, di year 3.',
  ],
  s0417: [
    'Thereafter, with two yin sacrifices in five years, year 6 should be xia and year 8 di.',
    'Thereafter, two yin sacrifices in five years means xia in year 6 and di in year 8.',
  ],
  s0418: [
    'Again, in Duke Zhao\'s tenth year Qi Gui died; by the thirteenth year mourning was complete and xia was due, but because of the Pingqiu conference, in winter the duke went to Jin.',
    'Duke Zhao year 10: Qi Gui died; mourning ended year 13 when xia was due, but the Pingqiu meeting sent the duke to Jin that winter.',
  ],
  s0419: [
    'Xia came in year 14 and di in year 15—the Commentary\'s "there were affairs at the Martial Shrine" refers to this.',
    'Xia in year 14, di in year 15—the "affairs at the Martial Shrine" passage applies.',
  ],
  s0420: ['Xia in year 18, di in year 20.', 'Xia year 18, di year 20.'],
  s0421: ['Xia in year 23, di in year 25.', 'Xia year 23, di year 25.'],
  s0422: [
    'Duke Zhao year 25, "there were affairs at the Xiang Shrine," refers to this.',
    'Zhao year 25, "affairs at the Xiang Shrine," is the same pattern.',
  ],
  s0423: [
    'As stated above, after di, xia follows three years later; after xia, di follows two years later.',
    'After di, xia is three years later; after xia, di is two years later.',
  ],
  s0424: [
    'This accords with the ritual classics and does not violate the Commentary\'s meaning.',
    'This fits the classics and Gongyang\'s sense.',
  ],
  s0425: ['" From this, Can and others\' deliberation was adopted as fixed.', '" Can\'s view became the fixed rule.'],
  s0426: [
    'In autumn of the sixth Kaiyuan year, when Emperor Ruizong\'s mourning was complete, xia was performed at the Grand Temple.',
    'Kaiyuan 6 autumn: after Ruizong\'s mourning, Grand Temple xia was held.',
  ],
  s0427: [
    'Thereafter it was again handed down as xia once in three years and di once in five years, each counted separately, not reckoned together.',
    'Later practice counted xia every three years and di every five, separately—not jointly.',
  ],
  s0428: ['By year 27, there had been five di and seven xia in all.', 'By year 27 there had been five di and seven xia.'],
  s0429: [
    'That year, after summer di was complete, winter again called for xia.',
    'That year summer di had just ended when winter again required xia.',
  ],
  s0430: ['The Court of Imperial Sacrifices deliberated:', 'The Court of Imperial Sacrifices reported:'],
  s0431: [
    'The two rites di and xia are both yin sacrifices: xia is combined feasting at the ancestral temple; di means ordering ranks of honor.',
    'Di and xia are both yin sacrifices: xia combines ancestors at the Grand Temple; di orders seniority.',
  ],
  s0432: [
    'They extend the former ruler\'s kindness reaching down and gather the filial piety of descendants in serving kin—unlike regular offerings, they are performed at set times.',
    'They extend a late ruler\'s care and gather heirs\' filial service—unlike seasonal rites, performed only at appointed times.',
  ],
  s0433: ['Yet offerings should not be frequent; frequency breeds irreverence;', 'Sacrifice should not be too frequent, lest it become irreverent;'],
  s0434: ['nor should they be too sparse, lest neglect arise.', 'nor too sparse, lest it breed neglect.'],
  s0435: [
    'Therefore the king models Heaven\'s Way and fixes the sacrificial canon.',
    'Kings therefore model Heaven and fix the sacrificial canon.',
  ],
  s0436: [
    'Zheng and chang mirror the seasons; di and xia are like intercalary months.',
    'Zheng and chang follow the seasons; di and xia follow the intercalary pattern.',
  ],
  s0437: [
    'Two intercalations in five years complete Heaven\'s great pattern; the ancestral temple follows this with two yin sacrifices.',
    'Two intercalations in five years complete Heaven\'s cycle; the temple mirrors this with two yin sacrifices.',
  ],
  s0438: [
    'Respectfully according to the "Royal Regulations" in the Book of Rites, the Director of Ritual in the Offices of Zhou, Zheng Xuan\'s commentary, and Gaotang\'s deliberation—all say: "When a state lord succeeds, after three-year mourning is complete, xia at the Grand Ancestor.',
    'Per Book of Rites "Royal Regulations," Zhou Offices Director of Ritual, Zheng Xuan, and Gaotang: after succession and three-year mourning, xia at the Grand Ancestor.',
  ],
  s0439: ['The next year di at the group temples.', 'The next year, di at the group temples.'],
  s0440: [
    'Thereafter, two yin sacrifices in five years—one xia and one di."',
    'Thereafter two yin sacrifices in five years—one xia, one di."',
  ],
  s0441: [
    'Han and Wei precedents and the Veritable Records of Zhenguan all used this rite.',
    'Han, Wei, and Zhenguan records all followed this schedule.',
  ],
  s0442: [
    'Again according to the Rites Apocrypha and the Lu Rites Commentary on Di and Xia: xia once in three years, di once in five years—what is called two yin sacrifices in five years.',
    'The Rites Apocrypha and Lu commentary likewise say xia every three years and di every five—the "two yin sacrifices in five years."',
  ],
  s0443: [
    'Again according to the Baihu Treatise, Comprehensive Meaning of the Five Classics, Xu Shen\'s Dissenting Views, He Xiu\'s Spring and Autumn, and He Xun\'s Sacrificial Deliberation—all say di once in three years.',
    'Baihu, Five Classics Meaning, Xu Shen, He Xiu, and He Xun\'s Sacrificial Deliberation all say di every three years.',
  ],
  s0444: ['Why?', 'Why?'],
  s0445: [
    'They hold that one intercalation in three years means Heaven\'s small completion; two intercalations in five years means Heaven\'s great completion.',
    'One intercalation in three years is Heaven\'s lesser cycle; two in five is the greater—hence the count.',
  ],
  s0446: [
    'Thus two yin sacrifices in five years, reckoned through the whole number, one xia and one di alternate in succession.',
    'Two yin sacrifices in five years mean one xia and one di alternating through the whole period.',
  ],
  s0447: [
    'Now Grand Temple di and xia each count their own years; two branches are issued, not reckoned together.',
    'Today di and xia are counted separately—two schedules, not one integrated cycle.',
  ],
  s0448: [
    'Sometimes offerings cluster in successive years, or twice in one year; sometimes after one di there are two xia, or within five years suddenly three yin sacrifices.',
    'Offerings sometimes pile up year after year or twice in one year; one di may be followed by two xia, or three yin sacrifices within five years.',
  ],
  s0449: [
    'The period modeled on Heaven\'s intercalary pattern is already violated;',
    'The intercalary pattern is already broken;',
  ],
  s0450: [
    'the rule of two yin sacrifices in five years also differs in number.',
    'and the "two yin sacrifices in five years" count no longer holds.',
  ],
  s0451: [
    'Sought in ritual texts, it is quite at odds.',
    'Measured against ritual text, the practice is seriously awry.',
  ],
  s0452: [
    'Some explainers say: "The two rites di and xia differ in greatness; the sacrifice names differ and the year-counts cross.',
    'Some argue di and xia differ in rank and name, so their year-counts cannot be unified.',
  ],
  s0453: [
    'Xia uses three cycles, reaching the small and combining;',
    'Xia uses three cycles to reach the lesser union;',
  ],
  s0454: [
    'di uses five divisions, reaching ten to complete the cycle.',
    'di uses five divisions to complete a ten-year cycle.',
  ],
  s0455: [
    'With such discrepancy, it is hard to reckon together."',
    'Such discrepancy, they say, forbids a single reckoning."',
  ],
  s0456: [
    'Your subject holds that the theory of three xia and five di comes from the Rites Apocrypha; the count of two yin sacrifices in five years is in the same chapter—harmonizing the two texts, they do not contradict.',
    'The "three xia, five di" theory and "two yin sacrifices in five years" both come from the Rites Apocrypha and can be harmonized.',
  ],
  s0457: [
    'It is that after di, xia is placed two and a half cycles later; taking the full number, it is called three years—like one intercalation in three years using only thirty-six months.',
    'After di, xia follows two and a half cycles; rounded to a full number that is "three years," as one intercalation uses thirty-six months.',
  ],
  s0458: [
    'Di and xia have different names, each following the four seasons: autumn-winter for xia, spring-summer for di.',
    'Di and xia take different names by season—xia in autumn-winter, di in spring-summer.',
  ],
  s0459: [
    'Though the sacrifice names differ, as yin sacrifices they are the same—like yue, ci, zheng, and chang, their substance is one.',
    'Names differ, but as yin sacrifices they are one—like yue, ci, zheng, and chang.',
  ],
  s0460: [
    'Zheng Xuan holds xia is great and di small; some commentaries hold xia small and di great—in the array of offerings there may be increase or decrease, but in reckoning together there is fundamentally no difference.',
    'Zheng Xuan says xia is greater, some texts say di is greater; offerings may vary, but the combined reckoning is the same.',
  ],
  s0461: ['The method modeled on intercalation has been transmitted long.', 'The intercalary model is ancient.'],
  s0462: [
    'Only Jin-era Chen Shu had a deliberation of one yin sacrifice in three years—from five, eight, eleven, and fourteen; tracing his deliberation\'s citations, he too spoke of modeling intercalation.',
    'Only Jin\'s Chen Shu argued one yin sacrifice every three years (years 5, 8, 11, 14), still citing the intercalary model.',
  ],
  s0463: ['Yet two yin sacrifices in six years—how can it be called modeling intercalation?', 'Two yin sacrifices in six years is not "modeling intercalation."'],
  s0464: ['And di once in five years—where is it applied?', 'Nor does "di every five years" fit.'],
  s0465: [
    'Contradictory theories are indeed hard to rely on.',
    'Contradictory theories cannot be relied on.',
  ],
  s0466: [
    'Since the measure that models Heaven already has its direction, and investigating antiquity the principle is so clear.',
    'Heaven\'s measure has a clear direction; antiquity confirms it.',
  ],
  s0467: [
    'Reckoning di and xia together is plain.',
    'Joint reckoning of di and xia is plain.',
  ],
  s0468: [
    'We now ask to take Kaiyuan 27, year jimao, fourth month for di; to year xinsi tenth month for xia; to year jiashen fourth month again di; to year bingxu tenth month again xia; to year jichou fourth month again di; to year xinmao tenth month again xia.',
    'Proposed schedule from Kaiyuan 27 jimao month 4 di, through xinsi month 10 xia, jiashen month 4 di, bingxu month 10 xia, jichou month 4 di, xinmao month 10 xia.',
  ],
  s0469: [
    'From this, two yin sacrifices in five years, cycling and beginning again.',
    'Thereafter two yin sacrifices in five years, cycling indefinitely.',
  ],
  s0470: [
    'Again, theories of di and xia are not from one school alone; texts on two yin sacrifices in five years already follow one another, and the principle of modeling Heaven\'s intercalation is broadly the same.',
    'Di-xia theory has many schools, but "two yin sacrifices in five years" and the intercalary model largely agree.',
  ],
  s0471: [
    'Yet placing xia after di may be near or far; in the measure of expansion and contraction there are two methods: Zheng Xuan and Gaotang place three first then two;',
    'After di, xia may be nearer or farther. Zheng Xuan and Gaotang put "three" before "two";',
  ],
  s0472: ['Xu Miao\'s deliberation puts two first then three.', 'Xu Miao puts "two" before "three."'],
  s0473: [
    'Respectfully according to Zheng\'s commentary, the method of three first approximates the text of three xia and five di, preserving the positions of three years and five years.',
    'Zheng\'s "three first" method fits the three-xia five-di texts and preserves the three-year and five-year slots.',
  ],
  s0474: [
    'It holds that if in year jia there is di, in year ding there should be xia, in year ji again di, in year ren again xia, in year jia again di, in year ding again xia—cycling and beginning again, handed down thus.',
    'On Zheng\'s scheme: jia year di, ding xia, ji di, ren xia, and repeat—jia di, ding xia, and so on.',
  ],
  s0475: [
    'From xia to di is eighteen months—near; from di to xia thirty-six months—far; the analysis is uneven and crude in calculation.',
    'Xia to di is 18 months (too near); di to xia is 36 (too far)—uneven spacing.',
  ],
  s0476: [
    'Suppose one pursues heterodox views and places xia in autumn: then thirty-nine months before and twenty-one after—though slightly better, the interval is still skewed.',
    'Placing xia in autumn yields 39 months before and 21 after—slightly better but still skewed.',
  ],
  s0477: [
    'Your subject relies on the original texts, which all say "model intercalation"; two intercalations apart are then evenly divided.',
    'The texts all say "model intercalation"; two intercalations apart divide evenly.',
  ],
  s0478: [
    'Why should the order of the two yin sacrifices be unequal?',
    'Why should the two yin sacrifices be unequal?',
  ],
  s0479: [
    'Moreover, "three years" originally states the full number; two and a half cycles truly equals three years—placing xia here does not violate the text; why must one rigidly insist on skipping three first months?',
    '"Three years" is a round number for two and a half cycles; placing xia here does not violate the text—why insist on three whole years?',
  ],
  s0480: [
    'It is the one flaw in a thousand deliberations—the blind spot of accomplished scholars.',
    'Even great scholars err once in a thousand deliberations.',
  ],
  s0481: [
    'Xu\'s deliberation differs from this; examined thoroughly, it is most reliable.',
    'Xu Miao\'s view differs and, on close review, is most reliable.',
  ],
  s0482: [
    'It holds that two di are sixty months apart; halve to thirty and place one xia.',
    'Two di are 60 months apart; halve to 30 and insert one xia.',
  ],
  s0483: [
    'If in year jia summer di, in year bing winter xia, the intercalary model is followed without the slightest deviation.',
    'Jia summer di, bing winter xia—exact intercalary spacing.',
  ],
  s0484: [
    'The text "xia once in three years" is not violated;',
    'This satisfies "xia every three years";',
  ],
  s0485: [
    'the rule of two yin sacrifices in five years has even spacing in its count.',
    'and keeps "two yin sacrifices in five years" evenly spaced.',
  ],
  s0486: [
    'Compared with the various Ru, the meaning is truly enduring.',
    'Among Ru traditions it is the soundest long-term reading.',
  ],
  s0487: [
    'We now ask to fix the two yin sacrifices on this basis, projecting sacrifice months in advance, cycling and beginning again.',
    'We ask to fix the two yin sacrifices on this basis, project the months, and cycle indefinitely.',
  ],
  s0488: [
    'Supernumerary Secretary in the Ministry of Rites Cui Zongzhi rebutted and sent the matter down to the Court of Imperial Sacrifices for further deliberation; Academician of the Hall of Assembled Worthies Lu Shanqing and others were ordered to examine further, and Shanqing also approved this deliberation.',
    'Cui Zongzhi of the Ministry of Rites objected and sent the case back to the Court of Imperial Sacrifices; Lu Shanqing and other academicians reviewed it and approved.',
  ],
  s0489: [
    'Thereupon Director Wei Zong memorialized: "The rites provide di and xia, both called yin sacrifices; the two methods alternate in scale-like succession.',
    'Director Wei Zong reported: di and xia are both yin sacrifices, alternating in regular succession.',
  ],
  s0490: [
    'Some say two yin sacrifices in five years—one di and one xia.',
    'Some say two yin sacrifices in five years—one di, one xia.',
  ],
  s0491: [
    'Some say xia once in three years, di once in five years.',
    'Others say xia every three years and di every five.',
  ],
  s0492: [
    'Modeling Heaven\'s intercalation—the main tendency is the same.',
    'All model Heaven\'s intercalation in broad outline.',
  ],
  s0493: [
    'All because Grand Temple di and xia count years differently; examined against classics and commentaries, there is slight deviation.',
    'But because the Grand Temple counts di and xia separately, the practice slightly departs from the classics.',
  ],
  s0494: [
    'Recently in the fourth month, di was already performed; now pointing to mid-winter, xia rites are again proposed—combined feasting too frequent, fearing violation of former canons.',
    'Di was just performed in the fourth month; mid-winter xia is now proposed—combined feasting too often, against ancient precedent.',
  ],
  s0495: [
    'Your subject notes that Your Majesty\'s accomplishments are complete and old things all restored—at a time when the ancestral temple is reverently cautious and canonical teaching is clarified.',
    'Your Majesty has restored the rites; this is the moment to clarify ancestral practice.',
  ],
  s0496: [
    'We who disgracefully hold ritual office are charged with deliberation and venture according to old texts to fix the sequence.',
    'We in ritual office venture to fix the sequence from old texts.',
  ],
  s0497: [
    'We ask that this year\'s summer di serve as the source of yin sacrifices; from this onward di and xia alternate, two yin sacrifices in five years, cycling and beginning again.',
    'Let this summer\'s di begin the cycle; thereafter di and xia alternate every five years.',
  ],
  s0498: [
    'This year\'s winter xia should by the rite be stopped; we hope the responsible offices will perform only the seasonal offering, so solemn sacrifice is not irreverent and the old rite is approximated.',
    'This winter\'s xia should be omitted; only seasonal offerings should be held, avoiding irreverent frequency.',
  ],
  s0499: ['" The edict followed this.', '" Approved.'],
  s0500: [
    'Former practice: edict of Tianbao 8, intercalary sixth month, sixth day: "The rites of di and xia preserve ordered rank; changes in substance and ornament take their cue from the times.',
    'Former practice—Tianbao 8, intercalary month 6, day 6 edict: "Di and xia preserve rank; ornament may change with the times.',
  ],
  s0501: [
    'The state traces its origin to the Immortal Ancestor and inherits the sage forebear; repeated glory and accumulated splendor have already been granted boundless blessing; combined offerings ascend to the spirits—we think to expand the unchanging canon.',
    'The dynasty descends from the Immortal Ancestor and inherits sage forebears; we seek to uphold the unchanging canon of ascent and offering.',
  ],
  s0502: [
    'From now on, at every di and xia, set ranks in order before the Sage Ancestor at the Temple of Supreme Clarity, above to clarify the rite of ascent and matching, reverently conforming to the dark heavens, below to fulfill the sincerity of reverent sacrifice, not departing from the ultimate Way.',
    'Henceforth at each di and xia arrange ranks before the Sage Ancestor at Supreme Clarity, clarifying ascent and matching above and full sincerity below.',
  ],
  s0503: [
    'Recently, whenever di and xia occurred, seasonal offerings were suspended; though the affair suited expedience, the rite perhaps fell short of what must be complete.',
    'Lately seasonal offerings stopped during di and xia—expedient but incomplete.',
  ],
  s0504: [
    'Hereafter whenever di and xia occur, regular offerings shall use plain food; three burnings of incense replace the three presentations."',
    'Hereafter during di and xia, regular offerings use plain food and three incense burnings replace three presentations."',
  ],
  s0505: [
    'On the fourth day of the ninth month of the second Jianzhong year, Erudite of the Court of Imperial Sacrifices Chen Jing memorialized: "This tenth month, xia at the Grand Temple should jointly feast the relocated temple spirit tablets of the Ancestors of Offerings and Eminence.',
    'Jianzhong 2, month 9, day 4: Erudite Chen Jing urged that the tenth-month Grand Temple xia include the Offerings and Eminence ancestors\' relocated tablets.',
  ],
  s0506: [
    'The meaning of the Spring and Autumn Annals: tablets of destroyed temples are displayed before the Grand Ancestor; tablets of temples not yet destroyed all ascend for combined feasting at the Grand Ancestor.',
    'Spring and Autumn: destroyed temples\' tablets are set before the Grand Ancestor; others ascend for combined feasting.',
  ],
  s0507: [
    'The Grand Ancestor\'s position faces east from the west; descendants below are arranged zhao and mu opposite, south and north as distinction—originally there is no text of destroyed temples\' relocated tablets not receiving offerings.',
    'The Grand Ancestor faces east; descendants are arranged in zhao-mu rows—no rule excludes relocated tablets of destroyed shrines.',
  ],
  s0508: [
    'Examining this rite, from the Zhou house onward, yet our dynasty\'s sacrificial canon ought to differ from Zhou.',
    'Zhou did thus, but Tang ritual should differ.',
  ],
  s0509: [
    'Moreover Zhou took Hou Ji to match Heaven as the ancestor of the first enfeoffment, and only below him established temples.',
    'Zhou matched Hou Ji to Heaven as first enfeoffment ancestor, then built lower temples.',
  ],
  s0510: [
    'When temples were destroyed and tablets moved, all were after the Grand Ancestor.',
    'Destroyed shrines and moved tablets all stood after the Grand Ancestor.',
  ],
  s0511: [
    'At di and xia, none preceded the Grand Ancestor in the Grand Temple.',
    'At di and xia nothing preceded the Grand Temple Grand Ancestor.',
  ],
  s0512: [
    'Correcting the Grand Ancestor\'s east-facing position preserves his honor without doubt.',
    'The Grand Ancestor\'s east-facing seat preserves unquestioned honor.',
  ],
  s0513: [
    'Yet this tenth month\'s Grand Temple xia feast—your subject asks to take Wei and Jin old institutions as comparison and build separate temples.',
    'For this tenth-month xia, Chen asks to follow Wei-Jin precedent and build separate temples.',
  ],
  s0514: [
    'Eastern Jin took the four lords such as the Western Campaign General as separate temples; at di and xia they corrected the Grand Ancestor\'s position in the Grand Temple to assert his honor, while the separate temples sacrificed to the High Emperor, Grand Emperor, Western Campaign General, and the other four lords to express kinship.',
    'Eastern Jin gave four forebears separate temples; at di and xia the Grand Ancestor kept honor in the Grand Temple while separate temples served the remote forebears.',
  ],
  s0515: [
    'Your subject holds that if the state uses this principle, separate temples should be built for the Ancestors of Offerings and Eminence and they should receive di and xia;',
    'Tang should build separate temples for Offerings and Eminence and sacrifice to them at di and xia;',
  ],
  s0516: [
    'then the Grand Ancestor in the Grand Temple would occupy the east-facing position to preserve his full honor.',
    'so the Grand Ancestor can face east in the Grand Temple.',
  ],
  s0517: [
    'Your subject notes the two emperors Deming and Xingsheng formerly had temples; at di and xia regular feast rites were commonly used—now the separate-temple system should have enshrinement in the Xingsheng temple as fitting."',
    'Deming and Xingsheng once had their own temples; separate shrines should enshrine the tablets in the Xingsheng temple."',
  ],
  s0518: ['" An edict sent the matter down to the Department of State Affairs for assembly deliberation by the hundred officials.', '" The edict ordered the Department of State Affairs to convene deliberation.'],
  s0519: [
    'Commissioner of Ritual Protocol, Junior Tutor to the Heir Apparent Yan Zhenqing, deliberated: "Some deliberators say the Ancestors of Offerings and Eminence, kin distant and temples moved, should not receive xia and ought permanently to be shut in the western side chambers.',
    'Yan Zhenqing argued: some said Offerings and Eminence, being remote, should not join xia and should stay shut in the western side chambers;',
  ],
  s0520: [
    'Others say the two ancestors should share xia, ranking zhao and mu with the Grand Ancestor while leaving the Grand Ancestor\'s east-facing position empty.',
    'others that both should share xia with the Grand Ancestor in zhao-mu order while leaving his east seat empty;',
  ],
  s0521: [
    'Others say if the two ancestors share xia, the Grand Ancestor\'s position can never be corrected; the two ancestors\' tablets should be moved and enshrined in the temple of Emperor Deming."',
    'others that if they share xia the Grand Ancestor can never face east and both tablets should move to the Deming temple."',
  ],
  s0522: [
    'Your subject holds all three deliberations are not acceptable.',
    'Yan held all three views unacceptable.',
  ],
  s0523: [
    'The ritual classics are damaged and lack clear authority; if scholars can compare categories and weigh among them, then it may be enacted—this broadly accords with rectitude.',
    'The classics are incomplete; where scholars analogize and weigh categories, practice may proceed in accord with right principle.',
  ],
  s0524: [
    'Your subject notes Grand Ancestor Emperor Jing, by merit of receiving the mandate at first enfeoffment, occupies the temple of a hundred generations without removal, matching Heaven in lofty offering—this is ultimate honor.',
    'Grand Ancestor Emperor Jing, first enfeoffment and mandate, occupies the immovable shrine and matches Heaven—ultimate honor.',
  ],
  s0525: [
    'At di and xia he temporarily takes the zhao-mu position, lowering himself to express filial piety and reverently serving the ancestors—by the rite of kin order, broadening the way of honoring forebears; this is truly the Grand Ancestor\'s bright intent of teeming blessing, and also how to transform the realm and lead all to filial piety.',
    'At di and xia he temporarily takes a zhao-mu place, humbling himself to honor ancestors—his teeming intent and the empire\'s model of filial piety.',
  ],
  s0526: [
    'We ask to follow Jin Cai Mo and others\' deliberation: on the day of the tenth-month xia offering, place the Ancestor of Offerings\' tablet in the east-facing position; from the Ancestor of Eminence and Grand Ancestor through all ancestors, follow the left-zhao right-mu array.',
    'Follow Jin Cai Mo: at the October xia, Offerings faces east; Eminence, Grand Ancestor, and the rest follow left-zhao right-mu.',
  ],
  s0527: [
    'This manifests the state\'s bright principle of honoring the root and esteeming order—sufficient as an unchanging statute for ten thousand generations.',
    'This shows Tang\'s regard for root and order—a statute for all generations.',
  ],
  s0528: [
    'Again, deliberators ask to place the two ancestors\' tablets in the temple of Emperor Deming and perform xia sacrifice.',
    'Others proposed moving both tablets to the Deming temple for xia.',
  ],
  s0529: ['Xia means "combined."', 'Xia means combined offering.'],
  s0530: ['Therefore the Gongyang Commentary says: "What is the great affair?', 'Gongyang asks: "What is the great affair?'],
  s0531: ['It is xia."', 'Xia."'],
  s0532: [
    'If xia sacrifice is not displayed in the Grand Temple but offered in the Deming temple, this is divided feasting—how can it be called combined feasting?',
    'Xia not in the Grand Temple but in the Deming temple is divided feasting, not combined feasting.',
  ],
  s0533: [
    'Name and substance cross; it deeply loses ritual intent and absolutely cannot be enacted."',
    'Name and fact diverge—it violates ritual and must be rejected."',
  ],
  s0534: [
    'On the twenty-eighth day of the eleventh month of the seventh Zhenyuan year, Director Pei Yu memorialized: "The rites of di and xia—in Yin and Zhou, because moved temples all came after the Grand Ancestor, combined feasting could be ordered and honor and baseness not err.',
    'Zhenyuan 7, month 11, day 28: Director Pei Yu noted that in Yin and Zhou moved shrines followed the Grand Ancestor, so combined feasting kept order.',
  ],
  s0535: [
    'When Han Gaozu received the mandate, there was no ancestor of first enfeoffment; he took Emperor Gao as Grand Ancestor.',
    'Han Gaozu had no first-enfeoffment forebear and made Emperor Gao Grand Ancestor.',
  ],
  s0536: [
    'The Supreme Emperor, Gaodi\'s father, had a temple for offerings—not in the zhao-mu combined-feasting array, because he was honored above the Grand Ancestor.',
    'The Supreme Emperor, Gaodi\'s father, had his own temple and stood outside zhao-mu combined feasting as senior to the Grand Ancestor.',
  ],
  s0537: [
    'Wei Wu founded the enterprise and Emperor Wen received the mandate; he too took Emperor Wu as Grand Ancestor.',
    'Wei Wu founded the state; Emperor Wen took Emperor Wu as Grand Ancestor.',
  ],
  s0538: [
    'The High Emperor, Grand Emperor, Recluse Lord, and others were all kin seniors—not in the zhao-mu combined-feasting array.',
    'High Emperor, Grand Emperor, and Recluse Lord were kin seniors outside zhao-mu feasting.',
  ],
  s0539: [
    'Jin Xuan founded the enterprise and Emperor Wu received the mandate; he too took Emperor Xuan as Grand Ancestor.',
    'Jin Xuan founded the state; Emperor Wu took Emperor Xuan as Grand Ancestor.',
  ],
  s0540: [
    'The Western Campaign General, Yingchuan, and the other four lords were also kin seniors—not in the zhao-mu combined-feasting array.',
    'Western Campaign General, Yingchuan, and three other lords were kin seniors outside zhao-mu feasting.',
  ],
  s0541: [
    'The state received Heaven\'s mandate; successive sages restored glory.',
    'Our dynasty received Heaven\'s mandate through successive sages.',
  ],
  s0542: [
    'Emperor Jing at first enfeoffment as Duke of Tang was truly the Grand Ancestor.',
    'Emperor Jing, first enfeoffed as Duke of Tang, was truly Grand Ancestor.',
  ],
  s0543: [
    'The generations in between were near; within the three zhao and three mu, so the imperial Grand Temple had only six chambers.',
    'Generations were still near; the imperial temple had only six chambers within three zhao and three mu.',
  ],
  s0544: [
    'The Lord of Hongnong and the two ancestors Xuan and Guang, honored above the Grand Ancestor, when kin was exhausted were moved—not in the zhao-mu count.',
    'Hongnong Lord and ancestors Xuan and Guang, senior to the Grand Ancestor, moved when kin was exhausted—not in zhao-mu.',
  ],
  s0545: [
    'Recorded in the ritual monograph—it may be enacted.',
    'This is recorded in the ritual monograph and may be followed.',
  ],
  s0546: [
    'In Kaiyuan, nine temples were added; the two ancestors Offerings and Eminence were both in zhao-mu, so Grand Ancestor Emperor Jing could not occupy the east-facing honor.',
    'Kaiyuan added nine temples; Offerings and Eminence entered zhao-mu, so Emperor Jing could not face east.',
  ],
  s0547: [
    'Now the two ancestors have been tithed; the nine chambers are in order only—how can the Grand Ancestor\'s position again not be corrected?',
    'Now both ancestors are tithed and nine chambers are ordered—how can the Grand Ancestor\'s seat remain uncorrected?',
  ],
  s0548: [
    'Your subject asks: the Grand Ancestor matches Heaven above and is immovable for a hundred generations, yet occupies zhao-mu; the Ancestors of Offerings and Eminence, kin exhausted and temples moved, occupy the east-facing position—examined against old facts, this is truly unsettling.',
    'The Grand Ancestor matches Heaven and is immovable, yet sits in zhao-mu while remote Offerings and Eminence face east—this is unsettling.',
  ],
  s0549: ['We ask that deliberation be sent down to the hundred officials for joint discussion.', 'He asked the hundred officials to deliberate jointly.'],
  s0550: ['" The edict followed this.', '" Approved.'],
  s0551: [
    'On the twenty-third day of the first month of the eighth year, Left Assistant to the Heir Apparent Li Rong and six others deliberated:',
    'Year 8, month 1, day 23: Left Assistant to the Heir Apparent Li Rong and six others deliberated:',
  ],
  s0552: [
    'The "Royal Regulations": "The Son of Heaven has seven temples—three zhao, three mu, and with the Grand Ancestor, seven."',
    '"Royal Regulations": "The Son of Heaven has seven temples—three zhao, three mu, with the Grand Ancestor, seven."',
  ],
  s0553: ['This is the Zhou system.', 'This is Zhou practice.'],
  s0554: [
    'The seven are the Grand Ancestor and the tithes of King Wen and King Wu, with four intimate temples.',
    'Seven means the Grand Ancestor plus Wen and Wu tithes and four intimate temples.',
  ],
  s0555: ['The Grand Ancestor is Hou Ji.', 'Grand Ancestor is Hou Ji.'],
  s0556: [
    'Yin had six temples—Qi and Tang with two zhao and two mu.',
    'Yin had six: Qi and Tang plus two zhao and two mu.',
  ],
  s0557: [
    'Xia had five temples, without a Grand Ancestor—Yu with two zhao and two mu only.',
    'Xia had five without Grand Ancestor—Yu plus two zhao and two mu.',
  ],
  s0558: [
    'Jin Erudite Sun Qin deliberated: "The king receiving the mandate\'s Grand Ancestor and feudal lords\' ancestors of first enfeoffment—for spirit tablets before them, according to the count above, passing five generations destroys the temple; di and xia no longer reach them.',
    'Jin Erudite Sun Qin: tablets before the mandate Grand Ancestor or first-enfeoffment ancestor are destroyed after five generations and excluded from di and xia.',
  ],
  s0559: [
    'Those reached by di and xia mean after the mandate Grand Ancestor, successively destroyed temples\' tablets ascending to storage in the two tithe shrines.',
    'Di and xia reach only descendants after the mandate Grand Ancestor, stored in the two tithe shrines.',
  ],
  s0560: [
    'Even for a hundred generations, di and xia reach them."',
    'Even after a hundred generations di and xia still reach them."',
  ],
  s0561: [
    'Your subject notes the Ancestors of Offerings and Eminence are tablets of kin exhausted before the Grand Ancestor.',
    'Offerings and Eminence are kin-exhausted forebears before the Grand Ancestor.',
  ],
  s0562: [
    'Compared with institutions from the Three Dynasties downward, di and xia do not reach them.',
    'By Three Dynasties precedent they are outside di and xia.',
  ],
  s0563: [
    'The tablet of the dynastic ancestor is among tablets of destroyed temples below the Grand Ancestor—this is what the Gongyang Commentary means by "tablets of destroyed temples displayed before the Grand Ancestor."',
    'The dynastic ancestor\'s tablet is a destroyed-shrine tablet displayed before the Grand Ancestor per Gongyang.',
  ],
  s0564: [
    'Respectfully according to Han Yongguang 4 edict, deliberating abolition of commandery and state temples and ancestors of exhausted kin—Chancellor Wei Xuancheng deliberated the Supreme and Filial Emperor temples, all kin exhausted and fit to destroy; the Supreme temple tablet should be buried in the park, the Filial Emperor tablet moved to the Grand Ancestor temple.',
    'Han Yongguang 4: Wei Xuancheng urged destroying kin-exhausted shrines; the Supreme tablet was buried in the park and Filial Emperor\'s moved to the Grand Ancestor temple.',
  ],
  s0565: ['Memorial approved.', 'Approved.'],
  s0566: [
    'The Supreme Emperor, like tablets before the Grand Ancestor, buried in the park—di and xia do not reach them; this compares to today\'s Ancestors of Offerings and Eminence.',
    'The Supreme Emperor, like pre-Grand Ancestor tablets, was buried in the park and excluded from di and xia—like today\'s Offerings and Eminence.',
  ],
  s0567: [
    'Filial Emperor moved to the Grand Ancestor temple, showing descendants below the Grand Ancestor share di and xia\'s reach—this compares to today\'s dynastic ancestor Emperor Yuan\'s tablet.',
    'Filial Emperor moved to the Grand Ancestor temple and joined di and xia—like today\'s Emperor Yuan tablet.',
  ],
  s0568: [
    'From Wei and Jin through Song, Qi, Chen, and Sui in succession, each founding ruler of the mandate established a temple and left the Grand Ancestor\'s position empty.',
    'Wei through Sui founders each built temples and left the Grand Ancestor seat empty.',
  ],
  s0569: [
    'From after the Grand Ancestor to the seventh-generation ruler, then the Grand Ancestor\'s east-facing position completed the seven temples.',
    'Seven generations after the Grand Ancestor filled the east-facing seat and completed seven temples.',
  ],
  s0570: [
    'Tablets before the Grand Ancestor—Ming of Wei moved the Recluse Lord\'s tablet to the park settlement; each year an aide was sent to offer sacrifice, because generations were still near.',
    'Pre-Grand Ancestor tablets: Wei Ming moved the Recluse Lord to the park with seasonal offerings because generations were still near.',
  ],
  s0571: [
    'When Ming of Eastern Jin died, the three ancestors including the Western Campaign General were moved into the western side chamber, named tithe, approximating remote temples.',
    'When Eastern Jin Ming died, three forebears including the Western Campaign General entered the western side chamber as tithe, like remote shrines.',
  ],
  s0572: [
    'When Emperor Kang died and Emperor Mu succeeded, then Jingzhao was moved into the western side chamber, likewise called tithe; as in the former rite, all were outside di and xia.',
    'Under Kang and Mu, Jingzhao entered the western tithe chamber and, like the earlier case, was excluded from di and xia.',
  ],
  s0573: [
    'Our dynasty at first feasted at four temples; Xuan and Guang together with the Grand Ancestor and Shizu tablets were enshrined in the temple.',
    'Tang first had four temples; Xuan and Guang were enshrined with Grand Ancestor and Shizu.',
  ],
  s0574: [
    'In the ninth Zhenguan year, when Gaozu was to be enshrined in the Grand Temple, Zhu Zishe asked to establish seven temples per the rite—the three zhao and three mu each with a tablet.',
    'Zhenguan 9: enshrining Gaozu, Zhu Zishe asked for seven temples with separate zhao and mu tablets.',
  ],
  s0575: [
    'The Grand Ancestor, following Jin-Song precedent, left the position empty, awaiting successive moves to place him in the east-facing seat.',
    'The Grand Ancestor seat was left empty per Jin-Song precedent until succession filled the east-facing place.',
  ],
  s0576: [
    'Thereupon Hongnong Lord and Gaozu were first enshrined as six chambers; the Grand Ancestor\'s position was left empty while di and xia were performed.',
    'Hongnong Lord and Gaozu filled six chambers; the Grand Ancestor seat stayed empty during di and xia.',
  ],
  s0577: [
    'By the twenty-third year, when Taizong was enshrined, the Hongnong Lord was stored in the western side chamber.',
    'Year 23, when Taizong was enshrined, Hongnong Lord went to the western side chamber.',
  ],
  s0578: [
    'In the first Weming year, when Gaozong was enshrined, Emperor Xuan was first moved to the western side chamber.',
    'Weming 1, enshrining Gaozong, moved Emperor Xuan to the western side chamber.',
  ],
  s0579: [
    'In the tenth Kaiyuan year, Xuanzong specially established nine temples; he posthumously honored Emperor Xuan as Ancestor of Offerings, restored to the main chamber, and Emperor Guang as Ancestor of Eminence to complete nine chambers.',
    'Kaiyuan 10: Xuanzong made nine temples, renaming Xuan Offerings and Guang Eminence in the main chambers.',
  ],
  s0580: [
    'Di and xia still left the Grand Ancestor\'s position empty.',
    'Di and xia still left the Grand Ancestor seat empty.',
  ],
  s0581: [
    'Prayer texts did not call the three ancestors "subject," clarifying that the full temple count alone was intended.',
    'Prayers did not style the three ancestors as subjects—only the full temple count mattered.',
  ],
  s0582: [
    'After recovery in the second Zhide year, new nine-temple tablets were made; the Hongnong Lord tablet was not made, clarifying that di and xia did not reach him.',
    'After Zhide 2 recovery new tablets were made but not for Hongnong Lord—he was outside di and xia.',
  ],
  s0583: [
    'In the second Baoying year, Xuanzong and Suzong were enshrined; Offerings and Eminence moved to the western side chamber; only then was the Grand Ancestor placed in the east-facing position, treating Offerings and Eminence as kin-exhausted tablets before the Grand Ancestor—per the rite, di and xia did not reach them—for eighteen years in all.',
    'Baoying 2: Xuanzong and Suzong were enshrined; Offerings and Eminence went to the western side chamber; the Grand Ancestor finally faced east for eighteen years.',
  ],
  s0584: [
    'By the tenth month of the second Jianzhong year, when the xia feast was to be held, Commissioner Yan Zhenqing memorialized that the Offerings and Eminence tablets should be brought out; for array order and the eastern seat of honor, he asked to fix it per Eastern Jin Cai Mo and others\' deliberation.',
    'Jianzhong 2, month 10: Yan Zhenqing urged bringing out Offerings and Eminence and fixing placement per Eastern Jin Cai Mo.',
  ],
  s0585: [
    'Thereupon the Ancestor of Offerings faced east, the Ancestor of Eminence in the zhao position facing south, the Grand Ancestor in the mu position facing north, and in sequence left-zhao right-mu for the array.',
    'Offerings faced east, Eminence south in zhao, Grand Ancestor north in mu, with left-zhao right-mu thereafter.',
  ],
  s0586: [
    'Yet though Cai Mo had this deliberation at the time, the affair in the end was not enacted—how can our Tang temple line be taken as standard?',
    'Cai Mo\'s view was never enacted—Tang cannot take it as standard.',
  ],
  s0587: [
    'Rong notes that chang, di, suburban, and altar rites allow no second supreme honor; burial, destruction, relocation, and storage have ritual grounds for decision.',
    'Chang, di, suburban, and altar rites admit no second supreme; burial and relocation follow ritual breaks.',
  ],
  s0588: [
    'Treating Offerings and Eminence as kin-exhausted tablets while the Grand Ancestor should already hold east-facing honor—to shift this in one morning is truly not precedent.',
    'Offerings and Eminence are kin-exhausted; the Grand Ancestor should face east—one-morning reversal is not precedent.',
  ],
  s0589: [
    'We hold the former court\'s precedent should be restored: Offerings and Eminence tablets stored in the western side chamber, analogous to the Canon of Sacrifices: "Remote temples become tithe; leaving tithe becomes altar; leaving altar becomes open ground; altars and open ground are sacrificed to when there is prayer, otherwise stopped."',
    'Restore precedent: store Offerings and Eminence in the western side chamber like "remote temples become tithe" in the Canon of Sacrifices.',
  ],
  s0590: [
    'The Grand Ancestor, having illustriously matched Heaven, should occupy the east-facing honor.',
    'The Grand Ancestor, matching Heaven, should face east.',
  ],
  s0591: [
    'Then above one may keep Zhenguan\'s opening institution, in the middle follow Kaiyuan\'s completed rule, below observe Baoying\'s strict form—accordant with canonical meaning, not losing old statutes.',
    'Thus Zhenguan\'s opening rule, Kaiyuan\'s settled form, and Baoying\'s strict practice are all preserved.',
  ],
  s0592: ['Supernumerary Secretary in the Ministry of Personnel Liu Mian and twelve others deliberated:', 'Liu Mian of the Ministry of Personnel and twelve others deliberated:'],
  s0593: [
    'The Son of Heaven\'s ruler who received the mandate and feudal lords\' ancestor of first enfeoffment are all called Grand Ancestor.',
    'The mandate-receiving ruler and a lord\'s first-enfeoffment ancestor are both Grand Ancestor.',
  ],
  s0594: [
    'Therefore even the Son of Heaven must have one honored—thus the Grand Ancestor is honored;',
    'Even the Son of Heaven has one who is honored—therefore the Grand Ancestor;',
  ],
  s0595: [
    'therefore even feudal lords must have forebears—also the Grand Ancestor is honored.',
    'even lords have forebears—also honored as Grand Ancestor.',
  ],
  s0596: [
    'Below the Grand Ancestor, when kin is exhausted, temples are destroyed.',
    'Below the Grand Ancestor, kin exhaustion destroys temples.',
  ],
  s0597: [
    'By the time Qin extinguished learning, Han did not reach the rites—neither arrayed zhao-mu nor established successive destruction.',
    'After Qin ended learning, Han failed to array zhao-mu or successive destruction.',
  ],
  s0598: ['Jin lost it; Song followed.', 'Jin lost it; Song followed.'],
  s0599: [
    'Thus there was violation of the five-temple system and emptying of the Grand Ancestor\'s position.',
    'Thus the five-temple rule was violated and the Grand Ancestor seat left empty.',
  ],
  s0600: [
    'Not arraying zhao-mu is not how to show people there is order;',
    'Failure to array zhao-mu does not show people there is order;',
  ],
};

function build(batchNum) {
  const zh = JSON.parse(
    readFileSync(`translations/_ch030-zh-batch${batchNum}.json`, 'utf8')
  );
  const out = {};
  for (const { id } of zh) {
    const pair = T[id];
    if (!pair) throw new Error(`Missing translation: ${id}`);
    out[id] = { literal: pair[0], idiomatic: pair[1] };
  }
  return out;
}

writeFileSync(
  'translations/_ch030-batch5.json',
  JSON.stringify(build(5), null, 2) + '\n'
);
writeFileSync(
  'translations/_ch030-batch6.json',
  JSON.stringify(build(6), null, 2) + '\n'
);
console.log('Wrote _ch030-batch5.json and _ch030-batch6.json');
