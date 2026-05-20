#!/usr/bin/env node
/** Batch 5: s0401–s0463 (Suishu ch.006) */
import { readFileSync, writeFileSync } from 'fs';

const transPath = 'translations/current_translation_suishu.json';

const T = {
  s0401: {
    literal: 'Also says "Heaven and Earth\'s ox—horns like mulberry buds and chestnuts."',
    idiomatic: 'It also says, "Heaven and Earth\'s ox—horns like mulberry buds and chestnuts."',
  },
  s0402: {
    literal: 'The Five Emperors being called celestial spirits—in principle there is no three-victim sacrifice.',
    idiomatic: 'Since the Five Emperors are celestial spirits, a three-victim sacrifice is inappropriate in principle.',
  },
  s0403: {
    literal: 'Yet in the Mao Odes\' "I Will" poem—sacrificing to King Wen at the Bright Hall—there is the saying "both sheep and ox."',
    idiomatic: 'Yet the Mao Odes\' "I Will" poem, sacrificing to King Wen at the Bright Hall, says "both sheep and ox."',
  },
  s0404: {
    literal: 'Truly because Zhou observed the two dynasties—its meaning valued ornament; the Bright Hall compared to the suburb was not yet ultimate substance—therefore specially used three victims—only as a single generation\'s regulation.',
    idiomatic: 'This was because Zhou observed the two preceding dynasties and valued ornament; the Bright Hall, compared to the suburb, was not yet ultimate simplicity—hence three victims were specially used, as a single generation\'s regulation.',
  },
  s0405: {
    literal: 'Now weighing the hundred kings—meaning preserving the universal canon; vegetables and fruits\' offerings—though matching the Rites of Zhou; yet victim use—should follow Xia and Yin.',
    idiomatic: 'Weighing all previous kings and preserving the universal canon: vegetables and fruits match the Rites of Zhou, but victim use should follow Xia and Yin.',
  },
  s0406: {
    literal: 'From now on the Bright Hall only uses a special ox—both fitting the mean of substance and ornament, and showing the meaning of honoring sincerity.',
    idiomatic: 'Henceforth the Bright Hall should use only a special ox—fitting the balance of substance and ornament and honoring sincerity.',
  },
  s0407: {
    literal: '" The Emperor followed all of this.',
    idiomatic: 'The emperor accepted all of these proposals.',
  },
  s0408: {
    literal: 'Before this, the emperor wished to make revisions—he then issued an imperial decree, and with ministers and subjects refined the meaning.',
    idiomatic: 'Previously the emperor had wished to make revisions—he issued an imperial decree and refined the meaning with his ministers.',
  },
  s0409: {
    literal: 'The decree said: "The Bright Hall follows the Great Dai Rites: \'Nine chambers eight windows, thirty-six doors."',
    idiomatic: 'The decree stated: "The Bright Hall follows the Great Dai Rites: \'Nine chambers, eight windows, thirty-six doors."',
  },
  s0410: {
    literal: 'Thatched roof, round above square below.\'"',
    idiomatic: 'Thatched roof, round above and square below.\'"',
  },
  s0411: {
    literal: 'Zheng Xuan according to the Received Spiritual Contract also says "round above square below," also says "eight windows four reaching."',
    idiomatic: 'Zheng Xuan, following the Received Spiritual Contract, also says "round above square below" and "eight windows reaching in four directions."',
  },
  s0412: {
    literal: 'The Bright Hall\'s meaning fundamentally is sacrificing to the Five Emperors spirits—the number of nine chambers—its principle is not seen.',
    idiomatic: 'The Bright Hall\'s fundamental purpose is sacrificing to the Five Emperors spirits—the rationale for nine chambers is not evident.',
  },
  s0413: {
    literal: 'If speaking of five halls—though matching the Five Emperors\' number—facing south then backs Leaf Light Era; facing north then backs Red Blazing Anger; east facing west facing—likewise so—in the affair especially not yet acceptable.',
    idiomatic: 'If five halls are proposed—though matching the Five Emperors\' number—facing south backs the Leaf Light Era; facing north backs Red Blazing Anger; east and west likewise—in principle this is unacceptable.',
  },
  s0414: {
    literal: 'And the Bright Hall\'s sacrifice to the Five Emperors—then is the general meaning; the suburb\'s sacrifice to the Five Emperors—then is the separate meaning.',
    idiomatic: 'Bright Hall sacrifice to the Five Emperors expresses the general meaning; suburban sacrifice to the Five Emperors, the separate meaning.',
  },
  s0415: {
    literal: 'The ancestral sacrifice\'s associate—again should have a chamber; if exclusively associating one chamber—then the meaning is not pairing five; if all pairing five—then it becomes five positions.',
    idiomatic: 'The ancestral sacrifice\'s associate should have a chamber; if only one chamber is paired, the meaning of pairing five is lost; if all five are paired, it becomes five positions.',
  },
  s0416: {
    literal: 'In principle speaking—the Bright Hall fundamentally has no chambers.',
    idiomatic: 'In principle, the Bright Hall fundamentally has no chambers."',
  },
  s0417: {
    literal: '" Zhu Yi held: "The Monthly Ordinance \'the Son of Heaven dwells in the Bright Hall\'s left and right bays.\'"',
    idiomatic: 'Zhu Yi argued: "The Monthly Ordinance states, \'The Son of Heaven dwells in the Bright Hall\'s left and right bays.\'"',
  },
  s0418: {
    literal: 'The audience-for-the-new-moon rite—since at the Bright Hall—now if there are no chambers—then in meaning there is deficiency.',
    idiomatic: 'The new-moon audience rite is performed at the Bright Hall—without chambers, the meaning is deficient.',
  },
  s0419: {
    literal: '" The decree said: "If following Zheng Xuan\'s meaning—the new-moon audience must be at the Bright Hall—here then human and spirit are confused; the way of solemn reverence has abandonment."',
    idiomatic: 'The decree replied: "If following Zheng Xuan\'s meaning, the new-moon audience must be at the Bright Hall—human and spirit would be confused and solemn reverence abandoned."',
  },
  s0420: {
    literal: 'The Spring and Autumn Annals say: "Situated between two great states."',
    idiomatic: 'The Spring and Autumn Annals say: "Situated between two great states."',
  },
  s0421: {
    literal: 'This speaking of the Bright Hall\'s left and right bays—means south of the Five Emperors\' hall there are again small chambers, also called Bright Hall, divided into three places for the new-moon audience.',
    idiomatic: 'The Bright Hall\'s left and right bays refer to small chambers south of the Five Emperors\' hall, also called Bright Hall, divided into three places for the new-moon audience.',
  },
  s0422: {
    literal: 'Since three places—then there is the meaning of left and right.',
    idiomatic: 'Since there are three places, the left and right distinction applies.',
  },
  s0423: {
    literal: 'Within the encampment walls, outside the Bright Hall—then there is the bay name; therefore called Bright Hall left and right bays.',
    idiomatic: 'Within the encampment walls, outside the Bright Hall—these are the bays; hence Bright Hall left and right bays.',
  },
  s0424: {
    literal: 'By this speaking—the new-moon audience\'s place—naturally outside the Five Emperors\' hall; human and spirit have distinction—nearly without mutual involvement.',
    idiomatic: 'Thus the new-moon audience naturally occurs outside the Five Emperors\' hall; human and spirit are distinct and do not interfere.',
  },
  s0425: {
    literal: '" The debate\'s right and wrong was not fixed; at first still not revised.',
    idiomatic: 'The debate remained unresolved; no revision was made at first.',
  },
  s0426: {
    literal: 'In the twelfth year, Assistant Director of the Grand Master of Ceremonies Yu Yan again cited the Rites of Zhou Bright Hall\'s nine-chi mat—as the numbers for height, breadth, and narrowness; hall height one mat—therefore steps nine chi high.',
    idiomatic: 'In the twelfth year, Assistant Director Yu Yan again cited the Rites of Zhou Bright Hall\'s nine-chi mat as the standard for dimensions; hall height one mat, hence steps nine chi high.',
  },
  s0427: {
    literal: 'Han dynasty institutions still followed this rite—therefore Zhang Heng says "measure the hall by mat."',
    idiomatic: 'Han institutions still followed this rite—hence Zhang Heng\'s "measure the hall by mat."',
  },
  s0428: {
    literal: 'Zheng Xuan held temple and dwelling three systems alike—all should use nine chi as measure.',
    idiomatic: 'Zheng Xuan held that temple, dwelling, and the three systems alike should use nine chi as measure.',
  },
  s0429: {
    literal: '" The decree said: "Approved."',
    idiomatic: 'The decree read: "Approved."',
  },
  s0430: {
    literal: 'Thereupon the Song Supreme Ultimate Hall was demolished; its timber constructed the Bright Hall\'s twelve bays—standard the Grand Temple.',
    idiomatic: 'The Song Supreme Ultimate Hall was demolished; its timber was used to build a twelve-bay Bright Hall, modeled on the Grand Temple.',
  },
  s0431: {
    literal: 'In the central six bays six seats were installed—all facing south.',
    idiomatic: 'In the central six bays six seats were installed, all facing south.',
  },
  s0432: {
    literal: 'From the east coming: first Green Emperor, second Red Emperor, third Yellow Emperor, fourth White Emperor, fifth Black Emperor.',
    idiomatic: 'From the east: first the Green Emperor, second the Red Emperor, third the Yellow Emperor, fourth the White Emperor, fifth the Black Emperor.',
  },
  s0433: {
    literal: 'Associate lords collectively associated with the Five Emperors—on the eastern steps above, facing west.',
    idiomatic: 'Associate lords collectively shared sacrifice with the Five Emperors—on the eastern steps above, facing west.',
  },
  s0434: {
    literal: 'Behind the great hall were five small halls—in which the five assistant chambers.',
    idiomatic: 'Behind the great hall stood five small halls serving as the five assistant chambers.',
  },
  s0435: {
    literal: 'Chen regulations: Bright Hall hall twelve bays.',
    idiomatic: 'Chen regulations: the Bright Hall hall had twelve bays.',
  },
  s0436: {
    literal: 'Central six bays—following Qi regulations, six seats installed.',
    idiomatic: 'The central six bays, following Qi regulations, held six seats.',
  },
  s0437: {
    literal: 'Four Direction Emperors each according to their direction; Yellow Emperor at the southwest corner; associate feast seat following Liang method.',
    idiomatic: 'Four Direction Emperors each according to their direction; the Yellow Emperor at the southwest corner; the associate feast seat following Liang method.',
  },
  s0438: {
    literal: 'Under Emperor Wu, the Virtue Emperor was paired.',
    idiomatic: 'Under Emperor Wu, the Virtue Emperor was paired.',
  },
  s0439: {
    literal: 'Under Emperor Wen, Emperor Wu was paired.',
    idiomatic: 'Under Emperor Wen, Emperor Wu was paired.',
  },
  s0440: {
    literal: 'After Emperor Fei, Emperor Wen was paired.',
    idiomatic: 'After Emperor Fei, Emperor Wen was paired.',
  },
  s0441: {
    literal: 'Victims used the great victim; sacrificial grain six meals; tripod soup, fruits and vegetables fully offered.',
    idiomatic: 'Victims used the great victim; sacrificial grain comprised six meals; tripod soup, fruits, and vegetables were fully offered.',
  },
  s0442: {
    literal: 'Later Qi adopted the Rites of Zhou Artificer\'s Record for five chambers; Zhou adopted the Han Three Assistants Yellow Chart for nine chambers—each preserved its system, yet ultimately neither was built.',
    idiomatic: 'Northern Qi adopted the Rites of Zhou Artificer\'s Record for five chambers; Northern Zhou the Han Three Assistants Yellow Chart for nine chambers—each preserved its system, yet neither was ultimately built.',
  },
  s0443: {
    literal: 'When the High Ancestor pacified Chen, he gathered talented men; suburban mounds, ancestral temple, and altars of soil and grain—canonical rites were roughly complete—only the Bright Hall was not yet built.',
    idiomatic: 'When the High Ancestor pacified Chen, he gathered talented men; suburban mounds, ancestral temple, and altars of soil and grain were roughly complete—only the Bright Hall remained unbuilt.',
  },
  s0444: {
    literal: 'In the thirteenth year of Kaihuang, an edict ordered deliberation.',
    idiomatic: 'In Kaihuang 13, an edict ordered deliberation.',
  },
  s0445: {
    literal: 'Minister of Rites Niu Hong, Imperial Academy Director Xin Yanzhi, and others fixed the deliberation—the affair is in Hong\'s biography.',
    idiomatic: 'Minister of Rites Niu Hong, Imperial Academy Director Xin Yanzhi, and others fixed the deliberation—the account is in Hong\'s biography.',
  },
  s0446: {
    literal: 'Later Inspector-General of the Director of Palace Construction Yuwen Kai, according to the Monthly Ordinance text, made a Bright Hall wooden model—double eaves and multiple halls, five chambers four reaching; zhang and chi regulations all had standards—to present.',
    idiomatic: 'Later Inspector-General Yuwen Kai, following the Monthly Ordinance, made a Bright Hall wooden model—double eaves, multiple halls, five chambers reaching in four directions; all dimensions had standards—and presented it.',
  },
  s0447: {
    literal: 'The High Ancestor was impressed; he commanded the relevant offices to establish the site at Anyeli within the outer city.',
    idiomatic: 'The High Ancestor was impressed and ordered the site established at Anyeli within the outer city.',
  },
  s0448: {
    literal: 'Just as he wished to build on a grand scale, he again commanded detailed fixing; various Confucians debated—none could decide.',
    idiomatic: 'Just as he wished to build on a grand scale, he ordered further detailed fixing; Confucian scholars debated without resolution.',
  },
  s0449: {
    literal: 'Hong and others again submitted the canonical and historical original texts.',
    idiomatic: 'Hong and others again submitted the canonical and historical texts.',
  },
  s0450: {
    literal: 'At the time objections were many; long without fixing—again deliberation abandoned it.',
    idiomatic: 'Objections were numerous; deliberation continued without resolution—and the project was abandoned.',
  },
  s0451: {
    literal: 'In the Daye era, Kai again made Bright Hall deliberation and model to submit.',
    idiomatic: 'In the Daye era, Kai again submitted Bright Hall deliberation and a model.',
  },
  s0452: {
    literal: 'Emperor Yang sent down the deliberation—but only ordered timber cut at Mount Huo; yet capital construction and labor projects—the institution was ultimately shelved.',
    idiomatic: 'Emperor Yang sent down the deliberation—but only ordered timber cut at Mount Huo; capital construction and labor projects ultimately shelved the institution.',
  },
  s0453: {
    literal: 'Through the Sui dynasty, sacrifice to the Five Direction Supreme Lords—only at the Bright Hall—always in late autumn at the rain-prayer altar.',
    idiomatic: 'Throughout the Sui dynasty, sacrifice to the Five Direction Supreme Lords occurred only at the Bright Hall—always in late autumn at the rain-prayer altar.',
  },
  s0454: {
    literal: 'Silks used each according to its direction.',
    idiomatic: 'Silks were used according to each direction.',
  },
  s0455: {
    literal: 'Human Emperors each to the left of the Heavenly Emperors.',
    idiomatic: 'Human Emperors each stood to the left of the Heavenly Emperors.',
  },
  s0456: {
    literal: 'Founding Ancestor Emperor Wuyuan south of Taihao, facing west.',
    idiomatic: 'Founding Ancestor Emperor Wuyuan stood south of Taihao, facing west.',
  },
  s0457: {
    literal: 'Five Officials in the courtyard—each also according to its direction.',
    idiomatic: 'Five Officials stood in the courtyard, each according to its direction.',
  },
  s0458: {
    literal: 'Victims used twelve calves.',
    idiomatic: 'Twelve calves were used as victims.',
  },
  s0459: {
    literal: 'Emperor, Grand Commandant, and Minister of Agriculture performed three offerings to the Green Emperor and the Founding Ancestor.',
    idiomatic: 'The emperor, Grand Commandant, and Minister of Agriculture performed three offerings to the Green Emperor and the Founding Ancestor.',
  },
  s0460: {
    literal: 'The rest of the relevant offices assisted in offering.',
    idiomatic: 'The remaining relevant offices assisted in the offerings.',
  },
  s0461: {
    literal: 'Sacrifice to the Five Officials below the hall—performing one offering.',
    idiomatic: 'The Five Officials were sacrificed to below the hall with a single offering.',
  },
  s0462: {
    literal: 'There was firewood burning.',
    idiomatic: 'Firewood was burned.',
  },
  s0463: {
    literal: 'Inspecting victims and presenting cooked offerings—followed the Southern Suburb regulations.',
    idiomatic: 'Inspecting victims and presenting cooked offerings followed Southern Suburb regulations.',
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
