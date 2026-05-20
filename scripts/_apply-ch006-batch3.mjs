#!/usr/bin/env node
/** Batch 3: s0201–s0300 (Suishu ch.006) */
import { readFileSync, writeFileSync } from 'fs';

const transPath = 'translations/current_translation_suishu.json';

const T = {
  s0201: {
    literal: 'Queen Earth altar square five zhang, height six chi.',
    idiomatic: 'the Queen Earth altar was five zhang square and six chi high.',
  },
  s0202: {
    literal: 'Liang Southern Suburb altar upper diameter eleven zhang, lower diameter eighteen zhang, height two zhang seven chi; Northern Suburb altar upper side ten zhang, lower side twelve zhang, height one zhang.',
    idiomatic: 'The Liang Southern Suburb altar measured eleven zhang across at the top and eighteen at the base, two zhang seven chi high; the Northern Suburb altar was ten zhang across at the top, twelve at the base, and one zhang high.',
  },
  s0203: {
    literal: 'As of today the Southern Suburb altar is ten zhang wide, two zhang two chi five cun high; the Northern Suburb altar nine zhang three chi wide, one zhang five cun high.',
    idiomatic: 'At present the Southern Suburb altar is ten zhang wide and two zhang two chi five cun high; the Northern Suburb altar is nine zhang three chi wide and one zhang five cun high.',
  },
  s0204: {
    literal: 'Now deliberation proposes increasing the Southern Suburb altar upper diameter to twelve zhang—then Heaven\'s great number; lower diameter eighteen zhang, taking one-third increase; height two zhang seven chi, taking three times the nine-chi hall.',
    idiomatic: 'The proposal increases the Southern Suburb altar to twelve zhang across at the top—Heaven\'s great number; eighteen zhang at the base, a one-third increase; two zhang seven chi high, three times the nine-chi hall.',
  },
  s0205: {
    literal: 'Northern Suburb altar upper side ten zhang, to model Earth\'s meaning; lower to fifteen zhang, also taking one-half increase; height one zhang two chi, also taking twice the Han number.',
    idiomatic: 'The Northern Suburb altar would be ten zhang across at the top, modeling Earth\'s principle; fifteen zhang at the base, a half increase; one zhang two chi high, twice the Han measurement.',
  },
  s0206: {
    literal: ': The Record of Rites says: "To build high one must follow hills and mounds; to build low one must follow rivers and marshes."',
    idiomatic: 'The Record of Rites states: "To build high one must follow hills and mounds; to build low one must follow rivers and marshes."',
  },
  s0207: {
    literal: 'Ascending the central peak of a famous mountain to report to Heaven; with auspicious soil feasting the Lord at the suburb.',
    idiomatic: 'One ascends a famous mountain\'s central peak to report to Heaven; with auspicious soil one feasts the Lord at the suburb.',
  },
  s0208: {
    literal: '" The Rites of Zhou say: "At the winter solstice, sacrifice to Heaven at the Round Mound upon the earth."',
    idiomatic: 'The Rites of Zhou state: "At the winter solstice, sacrifice to Heaven at the Round Mound upon the earth."',
  },
  s0209: {
    literal: 'At the summer solstice, sacrifice to Earth at the Square Marsh in the marsh.',
    idiomatic: 'At the summer solstice, sacrifice to Earth at the Square Marsh within the marsh.',
  },
  s0210: {
    literal: 'The Record of Sacrifices says: "Burn firewood at the Great Altar—sacrifice to Heaven."',
    idiomatic: 'The Record of Sacrifices states: "Burn firewood at the Great Altar—this is sacrifice to Heaven."',
  },
  s0211: {
    literal: 'Bury in the Great Break—sacrifice to Earth.',
    idiomatic: '"Bury offerings at the Great Break—this is sacrifice to Earth."',
  },
  s0212: {
    literal: 'The Record says: "Supreme reverence needs no altar—sweep the ground and sacrifice."',
    idiomatic: 'The Record also says: "Supreme reverence needs no altar—sweep the ground and sacrifice."',
  },
  s0213: {
    literal: 'In its substance, to report the merit of covering and sustaining.',
    idiomatic: 'In substance, this reports Heaven and Earth\'s merit of covering and sustaining all things.',
  },
  s0214: {
    literal: 'The Erya also says: "Mound—meaning not made by human hands."',
    idiomatic: 'The Erya likewise says: "A mound is what no human hand has made."',
  },
  s0215: {
    literal: 'Ancient round and square mounds both sacrificed at existing sites.',
    idiomatic: 'The ancient round and square mounds both sacrificed at naturally existing sites.',
  },
  s0216: {
    literal: 'Originally there were no numbers for height and width.',
    idiomatic: 'Originally there were no prescribed dimensions for height and width.',
  },
  s0217: {
    literal: 'Later generations, following events, moved capitals—and established suburban rites.',
    idiomatic: 'Later generations, moving capitals as circumstances required, established suburban rites anew.',
  },
  s0218: {
    literal: 'Sometimes the land was auspicious yet not necessarily with a mound; sometimes a mound was seen yet not necessarily broad and pure.',
    idiomatic: 'Sometimes the land was auspicious but had no natural mound; sometimes a mound existed but was not broad and pure enough.',
  },
  s0219: {
    literal: 'Therefore there were methods of construction—and regulations of zhang and chi.',
    idiomatic: 'Hence construction methods and dimensional regulations arose.',
  },
  s0220: {
    literal: 'I hold that suburban sacrifice affairs are weighty; round and square mounds\' height, breadth, and narrowness have no explicit text—but the Five Emperors did not follow one another, the Three Kings did not inherit from each other.',
    idiomatic: 'Suburban sacrifice is weighty; the round and square mounds\' dimensions lack explicit canonical text—the Five Emperors did not follow one another, nor the Three Kings inherit from each other.',
  },
  s0221: {
    literal: 'Now respectfully setting forth Han, Liang, and the present three generations\' altars\' differences, and further increasing and repairing the zhang and chi as above.',
    idiomatic: 'I respectfully set forth the differences among Han, Liang, and the present altars, and propose the dimensional increases described above.',
  },
  s0222: {
    literal: 'Awaiting imperial decision.',
    idiomatic: 'I await the imperial decision.',
  },
  s0223: {
    literal: 'Vice Director of the Secretariat Chen Shan, Left Household Minister Chen Yuanyao, Left Assistant Director Zhou Que, Drafting Attendant Xiao Chun, Director of Ritual Affairs Shen Keqing—all agreed with Yuangui\'s deliberation.',
    idiomatic: 'Vice Director Chen Shan, Left Household Minister Chen Yuanyao, Left Assistant Director Zhou Que, Drafting Attendant Xiao Chun, and Director of Ritual Affairs Shen Keqing all concurred with Yuangui\'s proposal.',
  },
  s0224: {
    literal: 'An edict followed and adopted it.',
    idiomatic: 'An edict approved and adopted it.',
  },
  s0225: {
    literal: 'When the Later Ruler succeeded, he had no mind for canonical ritual affairs; moreover the old Confucian scholars gradually perished—until the dynasty\'s fall, there was ultimately no revision.',
    idiomatic: 'When the Later Ruler succeeded, he cared nothing for canonical ritual; the old Confucian masters gradually died off—and until the dynasty\'s fall, no revision was made.',
  },
  s0226: {
    literal: 'Later Qi regulations: Round Mound and Square Marsh both once every three years—called the di sacrifice.',
    idiomatic: 'Northern Qi regulations: the Round Mound and Square Marsh rites were both performed once every three years—the di sacrifice.',
  },
  s0227: {
    literal: 'The Round Mound was south of the capital\'s Southern Suburb.',
    idiomatic: 'The Round Mound stood south of the capital\'s Southern Suburb.',
  },
  s0228: {
    literal: 'Below the mound circumference two hundred seventy chi; upper circumference forty-six chi; height forty-five chi.',
    idiomatic: 'The base circumference was two hundred seventy chi; the top, forty-six chi; the height, forty-five chi.',
  },
  s0229: {
    literal: 'Three tiers; each tier fifteen chi high; the upper and middle tiers each had steps on four sides; the lower tier had eight steps on the square perimeter.',
    idiomatic: 'It had three tiers, each fifteen chi high; the upper and middle tiers had steps on four sides; the lower tier had eight steps around its square perimeter.',
  },
  s0230: {
    literal: 'Enclosing walls in three rings, fifty paces from the mound.',
    idiomatic: 'Three concentric enclosure walls stood fifty paces from the mound.',
  },
  s0231: {
    literal: 'The middle wall from the inner wall; the outer wall from the middle wall—each twenty-five paces.',
    idiomatic: 'The middle wall stood twenty-five paces from the inner; the outer, twenty-five paces from the middle.',
  },
  s0232: {
    literal: 'All had eight gates.',
    idiomatic: 'Each wall had eight gates.',
  },
  s0233: {
    literal: 'Also a great encampment was made outside the outer wall, circumference three hundred seventy paces.',
    idiomatic: 'A great encampment outside the outer wall measured three hundred seventy paces in circumference.',
  },
  s0234: {
    literal: 'Its encampment moat twelve chi wide, one zhang deep; four sides each with one gate.',
    idiomatic: 'Its moat was twelve chi wide and one zhang deep, with one gate on each side.',
  },
  s0235: {
    literal: 'Also a firewood altar was made outside the middle wall, at the mound\'s bing position.',
    idiomatic: 'A firewood altar was also erected outside the middle wall, at the mound\'s bing position.',
  },
  s0236: {
    literal: 'Circumference thirty-six chi, height three chi; four sides each with steps.',
    idiomatic: 'It measured thirty-six chi in circumference and three chi in height, with steps on four sides.',
  },
  s0237: {
    literal: 'The Square Marsh altar was at the Northern Suburb north of the capital.',
    idiomatic: 'The Square Marsh altar stood at the Northern Suburb north of the capital.',
  },
  s0238: {
    literal: 'Circumference forty chi, height four chi; one set of steps on each side.',
    idiomatic: 'It measured forty chi in circumference and four chi in height, with one set of steps on each side.',
  },
  s0239: {
    literal: 'Outside it three enclosing walls; the breadth and narrowness between them the same as the Round Mound.',
    idiomatic: 'Three enclosing walls stood outside it, spaced as at the Round Mound.',
  },
  s0240: {
    literal: 'Outside the wall, a great encampment, circumference three hundred twenty paces.',
    idiomatic: 'Outside the walls, a great encampment measured three hundred twenty paces in circumference.',
  },
  s0241: {
    literal: 'Encampment moat twelve chi wide, one zhang deep; four sides each with one gate.',
    idiomatic: 'The encampment moat was twelve chi wide and one zhang deep, with one gate on each side.',
  },
  s0242: {
    literal: 'Also a burial pit was made at the altar\'s ren position, outside the middle wall—width and depth one zhang two chi.',
    idiomatic: 'A burial pit was also prepared at the altar\'s ren position, outside the middle wall, one zhang two chi wide and deep.',
  },
  s0243: {
    literal: 'The Round Mound used a green jade disc and bundled silks; on the first xin of the first month, August Heaven Supreme Lord was sacrificed to upon it, with the High Ancestor Emperor Shenwu as associate.',
    idiomatic: 'The Round Mound rite used a green jade bi and bundled silks; on the first xin day of the first month, August Heaven Supreme Lord was sacrificed to upon it, with High Ancestor Emperor Shenwu as associate.',
  },
  s0244: {
    literal: 'The Five Essence Emperors were associated sacrifices within the middle mound.',
    idiomatic: 'The Five Essence Emperors received associated sacrifice within the middle mound.',
  },
  s0245: {
    literal: 'All faced inward.',
    idiomatic: 'All faced inward.',
  },
  s0246: {
    literal: 'Sun, Moon, Five Stars, Northern Dipper, Twenty-eight Lodges, Director of the Center, Director of Fate, Director of Man, Director of Emolument, Wind Master, Rain Master, and Spirit Star were on the lower mound—in positions for the multitude of stars, moved within the inner enclosure.',
    idiomatic: 'Sun, Moon, Five Stars, Northern Dipper, Twenty-eight Lodges, Director of the Center, Director of Fate, Director of Man, Director of Emolument, Wind Master, Rain Master, and Spirit Star occupied the lower mound—as seats for the multitude of stars, placed within the inner enclosure.',
  },
  s0247: {
    literal: 'In total nine dark victims were used.',
    idiomatic: 'Nine dark-colored victims were used in total.',
  },
  s0248: {
    literal: 'On the morning of the evening victim, the Grand Commandant announced at the temple; silks were displayed at the Shenwu Temple, then buried between the two pillars.',
    idiomatic: 'On the morning of the evening victim, the Grand Commandant announced at the temple; silks were displayed at the Shenwu Temple, then buried between the two pillars.',
  },
  s0249: {
    literal: 'The emperor made the first offering; the Grand Commandant the second; the Director of Imperial Sacrifices the final.',
    idiomatic: 'The emperor made the first offering; the Grand Commandant the second; the Director of Imperial Sacrifices the final.',
  },
  s0250: {
    literal: 'The Minister of Education offered to the Five Emperors; the Minister of Works to Sun, Moon, Five Stars, and Twenty-eight Lodges; the Assistant Director of the Grand Master of Ceremonies and below offered to the multitude of stars.',
    idiomatic: 'The Minister of Education offered to the Five Emperors; the Minister of Works to Sun, Moon, Five Stars, and Twenty-eight Lodges; the Assistant Director of the Grand Master of Ceremonies and below to the multitude of stars.',
  },
  s0251: {
    literal: 'The Square Marsh used a yellow jade tube and bundled silks; on the summer solstice, Kunlun Queen Earth Numen was sacrificed to upon it, with Empress Wuming as associate.',
    idiomatic: 'The Square Marsh rite used a yellow jade cong and bundled silks; on the summer solstice, Kunlun Queen Earth Numen was sacrificed to upon it, with Empress Wuming as associate.',
  },
  s0252: {
    literal: 'The Spirit of the Central Land, altars of soil and grain, Mount Dai, Mount Yi guardian peak, Kuaiji guardian peak, Cloud Cloud Mountain, Tingting Mountain, Mount Meng, Mount Yu, Mount Yi, Mount Song, Mount Huo, Heng guardian peak, Mount Jing, Mount Neifang, Great Pie Mountain, Fushan Plain, Mount Tongbai, Mount Peiwei, Mount Hua, Mount Tainyue guardian peak, Mount Jishi, Mount Longmen, Mount Jiang, Mount Qi, Mount Jing, Mount Bozhong, Mount Hukou, Mount Leishou, Mount Dizhu, Mount Xicheng, Mount Wangwu, Mount Xiqing Zhuyuan, Mount Niaoshutongxue, Mount Xionger, Mount Dunwu, Mount Caimeng, Mount Liang, Mount Min, Mount Wugong, Mount Taibai, Mount Heng, Mount Yiwulü guardian peak, Mount Yin, Mount Baideng, Mount Jieshi, Mount Taihang, Mount Lang, Mount Fenglong, Mount Zhang, Mount Xuanwu, Mount Yanshan, Mount Fang, Mount Gou, Mount Xialong, Mount Huai River, Eastern Sea, Si River, Yi River, Zi River, Wei River, Yangtze River, Southern Sea, Han River, Gu River, Luo River, Yi River, Yang River, Mian River, Yellow River, Western Sea, Black River, Lao River, Wei River, Jing River, Feng River, Ji River, Northern Sea, Song River, Jing River, Sanggan River, Zhang River, Hutuo River, Wei River, Huan River, Yan River—all were associated sacrifices.',
    idiomatic: 'The Spirit of the Central Land, altars of soil and grain, Mount Tai, guardian peaks, mountains, rivers, and seas too numerous to list—all received associated sacrifice.',
  },
  s0253: {
    literal: 'The Central Land\'s position was at the north of the green steps in the jiayin position; the soil altar at the west of the red steps in the wei position; the grain altar at the south of the white steps in the geng position;',
    idiomatic: 'The Central Land occupied the jiayin position north of the green steps; the soil altar the wei position west of the red steps; the grain altar the geng position south of the white steps;',
  },
  s0254: {
    literal: 'The rest were all within the inner enclosure, facing inward, each according to its direction.',
    idiomatic: 'All others were within the inner enclosure, facing inward according to their directions.',
  },
  s0255: {
    literal: 'In total twelve victims were used; ceremony the same as the Round Mound.',
    idiomatic: 'Twelve victims were used in total; the ceremony matched the Round Mound rite.',
  },
  s0256: {
    literal: 'Afterward the Confucian scholars fixed the rites—the Round Mound changed to use the winter solstice.',
    idiomatic: 'Later Confucian scholars fixed the rites—the Round Mound rite was moved to the winter solstice.',
  },
  s0257: {
    literal: 'The Northern and Southern suburbs were once per year—both on the first xin of the first month.',
    idiomatic: 'The Northern and Southern suburbs were performed once per year—both on the first xin day of the first month.',
  },
  s0258: {
    literal: 'The Southern Suburb altar south of the capital, circumference thirty-six chi, height nine chi; one set of steps on each of four sides.',
    idiomatic: 'The Southern Suburb altar south of the capital measured thirty-six chi in circumference and nine chi in height, with steps on each of four sides.',
  },
  s0259: {
    literal: 'Three enclosing walls; the inner wall twenty-five paces from the altar; middle and outer walls spaced as the inner.',
    idiomatic: 'Three enclosing walls surrounded it; the inner stood twenty-five paces from the altar; middle and outer walls were similarly spaced.',
  },
  s0260: {
    literal: 'Four sides each with one gate.',
    idiomatic: 'Each side had one gate.',
  },
  s0261: {
    literal: 'Also a great encampment outside the outer wall, circumference two hundred seventy paces.',
    idiomatic: 'A great encampment outside the outer wall measured two hundred seventy paces in circumference.',
  },
  s0262: {
    literal: 'Encampment moat one zhang wide, eight chi deep; one gate on each of four sides.',
    idiomatic: 'The encampment moat was one zhang wide and eight chi deep, with one gate on each side.',
  },
  s0263: {
    literal: 'Also a firewood altar outside the middle wall at the bing position, circumference twenty-seven chi, height one chi eight cun; one set of steps on each of four sides.',
    idiomatic: 'A firewood altar outside the middle wall at the bing position measured twenty-seven chi in circumference and one chi eight cun in height, with steps on four sides.',
  },
  s0264: {
    literal: 'The Responsive Emperor Lingweiyang was sacrificed to upon the altar, with High Ancestor Emperor Shenwu as associate.',
    idiomatic: 'The Responsive Emperor Lingweiyang was sacrificed to upon the altar, with High Ancestor Emperor Shenwu as associate.',
  },
  s0265: {
    literal: 'The rite used four gui with base; silks each according to the direction\'s color.',
    idiomatic: 'The rite used four gui jade tablets with base; silks according to each direction\'s color.',
  },
  s0266: {
    literal: 'The Supreme Lord and associate lords each used one red bull victim; ceremony and firewood burning the same as the Round Mound.',
    idiomatic: 'The Supreme Lord and associate lords each received one red bull; ceremony and firewood burning matched the Round Mound rite.',
  },
  s0267: {
    literal: 'The Northern Suburb altar was made like the Southern Suburb altar; a burial pit like the Square Marsh pit; the Spirit of the Central Land was sacrificed to upon it, with Empress Wuming as associate.',
    idiomatic: 'The Northern Suburb altar matched the Southern Suburb altar; its burial pit matched the Square Marsh pit; the Spirit of the Central Land was sacrificed to upon it, with Empress Wuming as associate.',
  },
  s0268: {
    literal: 'The rite used two gui with base; each used one yellow victim; ceremony and burial like the Northern Suburb.',
    idiomatic: 'The rite used two gui jade tablets with base; each direction used one yellow victim; ceremony and burial followed Northern Suburb precedent.',
  },
  s0269: {
    literal: 'Later Zhou took the Zhou of Ji as its model; sacrificial forms largely followed the Ceremonial Rites.',
    idiomatic: 'Northern Zhou modeled itself on the Zhou of Ji; sacrificial forms largely followed the Ceremonial Rites.',
  },
  s0270: {
    literal: 'The Director of Measures presided over altar construction: Round Mound three tiers; each tier one zhang two chi high, two zhang deep.',
    idiomatic: 'The Director of Measures presided over altar construction: the Round Mound had three tiers, each one zhang two chi high and two zhang deep.',
  },
  s0271: {
    literal: 'Upper diameter six zhang; twelve steps; each tier twelve sections.',
    idiomatic: 'The upper diameter was six zhang, with twelve steps; each tier had twelve sections.',
  },
  s0272: {
    literal: 'Seven li yang from the capital\'s suburb.',
    idiomatic: 'It stood seven li yang from the capital\'s suburb.',
  },
  s0273: {
    literal: 'Round enclosure diameter three hundred paces; inner enclosure half of it.',
    idiomatic: 'The round enclosure measured three hundred paces in diameter; the inner enclosure, half that.',
  },
  s0274: {
    literal: 'Square mound one tier; lower height one zhang, diameter six zhang eight chi; upper height five chi, square four zhang; eight directions; one set of steps on each side, ten levels per step, one chi per level.',
    idiomatic: 'The square mound had one tier: lower height one zhang, diameter six zhang eight chi; upper height five chi, four zhang square; eight directions with one set of steps per side, ten levels of one chi each.',
  },
  s0275: {
    literal: 'Square mound six li yin from the capital\'s suburb.',
    idiomatic: 'The square mound stood six li yin from the capital\'s suburb.',
  },
  s0276: {
    literal: 'Mound one tier; eight directions; lower height one zhang, square six zhang eight chi; upper height five chi, square four zhang.',
    idiomatic: 'The mound had one tier in eight directions: lower height one zhang, six zhang eight chi square; upper height five chi, four zhang square.',
  },
  s0277: {
    literal: 'One set of steps on each side; one chi per level.',
    idiomatic: 'One set of steps on each side, one chi per level.',
  },
  s0278: {
    literal: 'Its enclosure eight-sided, diameter one hundred twenty paces; inner enclosure half of it.',
    idiomatic: 'Its eight-sided enclosure measured one hundred twenty paces in diameter; the inner enclosure, half that.',
  },
  s0279: {
    literal: 'Southern Suburb square altar five li south of the capital.',
    idiomatic: 'The Southern Suburb square altar stood five li south of the capital.',
  },
  s0280: {
    literal: 'Height one zhang two chi; width four zhang.',
    idiomatic: 'It was one zhang two chi high and four zhang wide.',
  },
  s0281: {
    literal: 'Its enclosure square one hundred twenty paces; inner enclosure half of it.',
    idiomatic: 'Its square enclosure measured one hundred twenty paces; the inner enclosure, half that.',
  },
  s0282: {
    literal: 'Spirit of the Central Land altar, height one zhang, square four zhang—north of the Northern Suburb square mound, to its right.',
    idiomatic: 'The Spirit of the Central Land altar stood one zhang high and four zhang square, north of the Northern Suburb square mound, to its right.',
  },
  s0283: {
    literal: 'Its enclosure like the square mound.',
    idiomatic: 'Its enclosure matched the square mound.',
  },
  s0284: {
    literal: 'Sacrifices at the Round Mound and Southern Suburb both on the first xin of the first month.',
    idiomatic: 'Sacrifices at the Round Mound and Southern Suburb both fell on the first xin day of the first month.',
  },
  s0285: {
    literal: 'The Round Mound paired the former Emperor Shennong with August Heaven Supreme Lord upon it.',
    idiomatic: 'At the Round Mound, the former Emperor Shennong was paired with August Heaven Supreme Lord.',
  },
  s0286: {
    literal: 'Five Direction Supreme Lords, Sun, Moon, inner officials, central officials, outer officials, and multitude of stars—all were associated sacrifices.',
    idiomatic: 'Five Direction Supreme Lords, Sun, Moon, inner officials, central officials, outer officials, and the multitude of stars—all received associated sacrifice.',
  },
  s0287: {
    literal: 'The emperor rode the dark chariot, wore the dark cap, with full imperial escort to perform.',
    idiomatic: 'The emperor rode the dark chariot, wore the dark ceremonial cap, and with full imperial escort performed the rite.',
  },
  s0288: {
    literal: 'Those participating in the preliminary sacrifice all wore dark robes.',
    idiomatic: 'All participants in the preliminary sacrifice wore dark robes.',
  },
  s0289: {
    literal: 'Southern Suburb: the Founding Ancestor Duke Monajia was paired with the Responsive Emperor Lingweiyang upon it.',
    idiomatic: 'At the Southern Suburb, Founding Ancestor Duke Monajia was paired with the Responsive Emperor Lingweiyang.',
  },
  s0290: {
    literal: 'Northern Suburb square mound: Shennong was paired with Queen Earth Numen.',
    idiomatic: 'At the Northern Suburb square mound, Shennong was paired with Queen Earth Numen.',
  },
  s0291: {
    literal: 'Spirit of the Central Land: Duke Monajia was paired.',
    idiomatic: 'At the Spirit of the Central Land altar, Duke Monajia was paired.',
  },
  s0292: {
    literal: 'Regulations for victims: sacrificing to August Heaven Supreme Lord, Queen Earth Numen, Five Emperors, Sun, Moon, Five Stars, Twelve Branches, Four Outlooks, Five Officials—each used victims of its direction\'s color.',
    idiomatic: 'Victim regulations: sacrifices to August Heaven Supreme Lord, Queen Earth Numen, Five Emperors, Sun, Moon, Five Stars, Twelve Branches, Four Outlooks, and Five Officials each used victims of the appropriate directional color.',
  },
  s0293: {
    literal: 'Ancestral temple used yellow; altars of soil and grain used dark; miscellaneous sacrifices used pure; expiation and exorcism used mottled.',
    idiomatic: 'The ancestral temple used yellow victims; altars of soil and grain, dark; miscellaneous sacrifices, pure-colored; expiation and exorcism, mottled.',
  },
  s0294: {
    literal: 'When the High Ancestor received the mandate, he wished to establish new institutions.',
    idiomatic: 'When the High Ancestor received the mandate, he sought to establish new institutions.',
  },
  s0295: {
    literal: 'He then commanded the Director of the Imperial Academy Xin Yanzhi to deliberate and fix the sacrificial canon.',
    idiomatic: 'He ordered Imperial Academy Director Xin Yanzhi to deliberate and fix the sacrificial canon.',
  },
  s0296: {
    literal: 'A Round Mound was made south of the capital, two li east of the road outside the Taiyang Gate.',
    idiomatic: 'A Round Mound was erected south of the capital, two li east of the road outside the Taiyang Gate.',
  },
  s0297: {
    literal: 'The mound had four tiers; each tier eight chi one cun high.',
    idiomatic: 'The mound had four tiers, each eight chi one cun high.',
  },
  s0298: {
    literal: 'Lower tier twenty zhang wide; second tier fifteen zhang; third tier ten zhang; fourth tier five zhang.',
    idiomatic: 'The lower tier was twenty zhang wide; the second, fifteen zhang; the third, ten zhang; the fourth, five zhang.',
  },
  s0299: {
    literal: 'Every other year on the winter solstice, August Heaven Supreme Lord was sacrificed to upon it, with Founding Ancestor Emperor Wuyuan as associate.',
    idiomatic: 'Every other winter solstice, August Heaven Supreme Lord was sacrificed to upon it, with Founding Ancestor Emperor Wuyuan as associate.',
  },
  s0300: {
    literal: 'Five Direction Supreme Lords, Sun, Moon, Five Stars, inner officials forty-two seats, secondary officials one hundred thirty-six seats, outer officials one hundred eleven seats, multitude of stars three hundred sixty seats—all were associated sacrifices.',
    idiomatic: 'Five Direction Supreme Lords, Sun, Moon, Five Stars, forty-two inner official seats, one hundred thirty-six secondary official seats, one hundred eleven outer official seats, and three hundred sixty multitude-of-stars seats—all received associated sacrifice.',
  },
};

const data = JSON.parse(readFileSync(transPath, 'utf8'));
let applied = 0;
for (const s of data.sentences) {
  const key = s.originalId || s.id;
  const pair = T[key];
  if (!pair) continue;
  s.literal = pair.literal;
  s.idiomatic = pair.idiomatic;
  applied++;
}
writeFileSync(transPath, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', applied, 'translations to', transPath);
