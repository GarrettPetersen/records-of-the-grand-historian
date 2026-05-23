#!/usr/bin/env node
import fs from 'node:fs';

const path = 'translations/current_translation_songshu.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const T = {
  s0201: {
    literal: 'Collation notes',
    idiomatic: 'Textual collation notes',
  },
  s0202: {
    literal: '"Moved out to dwell in the Eastern Palace": All editions omit the character "dwell"; restored according to Yuan ce 256.',
    idiomatic: '"Moved out to the Eastern Palace": All editions drop the word "dwell"; restored from Yuan ce 256.',
  },
  s0203: {
    literal: 'Director of Danyang Prince of Yongjia Ziren was made Inspector of Southern Yu: In Ziren\'s biography this reads "Southern Yan."',
    idiomatic: 'Director of Danyang Prince of Yongjia Ziren as Inspector of Southern Yu: his biography has Southern Yan instead.',
  },
  s0204: {
    literal: '"Elaborate and harmful to governance": In all editions "harmful" appears as "made"; emended according to Yuan ce 191.',
    idiomatic: '"Elaborate and harmful to governance": every edition reads "made" for "harmful"; corrected per Yuan ce 191.',
  },
  s0205: {
    literal: '"The qi-lines are at odds": In all editions "at odds" appears as "mysterious"; likely a graphic error near in form—now corrected.',
    idiomatic: '"The qi-lines are at odds": all editions have "mysterious" for "at odds," probably a graphic confusion—corrected here.',
  },
  s0206: {
    literal: 'General of the Guard Wang Xuanmo was made General Who Pacifies the North and Inspector of Qing and Ji: Below "General Who Pacifies the North" all editions interpolate the eleven characters "Inspector of Southern Xu Prince of Xin\'an Ziluan was."',
    idiomatic: 'Wang Xuanmo as General Who Pacifies the North and Inspector of Qing and Ji: all editions wrongly insert "Inspector of Southern Xu Prince of Xin\'an Ziluan was" after "General Who Pacifies the North."',
  },
  s0207: {
    literal: 'According to the biography of Prince of Xin\'an Ziluan, it does not say he ever served as Inspector of Qing and Ji, whereas Wang Xuanmo\'s biography says Xuanmo was at that time transferred to Inspector of Qing and Ji.',
    idiomatic: 'Ziluan\'s biography never makes him Inspector of Qing and Ji, while Xuanmo\'s biography says he was transferred there at the time.',
  },
  s0208: {
    literal: 'Now emended.',
    idiomatic: 'The text is corrected accordingly.',
  },
  s0209: {
    literal: 'Jichou: In all editions this reads "jiwei."',
    idiomatic: 'Jichou: every edition reads jiwei instead.',
  },
  s0210: {
    literal: 'For this month dingmao was the new moon; the twenty-third day was jichou—there was no jiwei or yichou.',
    idiomatic: 'That month began on dingmao; the twenty-third day was jichou—neither jiwei nor yichou occurred.',
  },
  s0211: {
    literal: 'Now corrected according to the Jiankang shilu and Zizhi tongjian.',
    idiomatic: 'Corrected here according to the Jiankang shilu and Zizhi tongjian.',
  },
  s0212: {
    literal: 'Gengyin: In all editions this reads "gengzi."',
    idiomatic: 'Gengyin: all editions read gengzi.',
  },
  s0213: {
    literal: 'For this month dingmao was the new moon—there was no gengzi; after the twenty-third day jichou, the twenty-fourth day was gengyin.',
    idiomatic: 'That month began on dingmao, so there was no gengzi; jichou was the twenty-third day and gengyin the twenty-fourth.',
  },
  s0214: {
    literal: 'Now corrected.',
    idiomatic: 'Corrected here.',
  },
  s0215: {
    literal: 'General Who Assists the State Zong Yue was made Inspector of Si: In the book "Zong Yue" is often wrongly written as "Song Yue"; now corrected according to Zong Yue\'s biography.',
    idiomatic: 'Zong Yue as Inspector of Si: the book often miswrites his name as Song Yue—corrected from his biography.',
  },
  s0216: {
    literal: 'Similar cases below are emended directly without full collation.',
    idiomatic: 'Similar cases below are corrected without separate notes.',
  },
  s0217: {
    literal: 'Right Vice Director of the Masters of Writing Yan Shibo was made Vice Director of the Masters of Writing: In all editions this reads "Left Vice Director of the Masters of Writing"; the Nanshi has no "Left."',
    idiomatic: 'Yan Shibo as Vice Director of the Masters of Writing: all editions add "Left," which the Nanshi omits.',
  },
  s0218: {
    literal: 'Li Ciming\'s Song shu zhaji says: "The character Left is superfluous and should be deleted according to the Nanshi.',
    idiomatic: 'Li Ciming\'s Song shu zhaji notes: "Left is redundant and should be dropped per the Nanshi."',
  },
  s0219: {
    literal: '" At this time only a single Vice Director of the Masters of Writing was established, with no separate Left and Right.',
    idiomatic: '" At the time there was only one Vice Director of the Masters of Writing, not separate Left and Right posts.',
  },
  s0220: {
    literal: 'Now the character Left is deleted according to the Nanshi.',
    idiomatic: 'The character Left is therefore deleted per the Nanshi.',
  },
  s0221: {
    literal: 'Reduce the field stipends of provinces, commanderies, and counties by half: The Song edition, Sanzhao edition, Beijian edition, Mao edition, and Nanshi read "field stipends."',
    idiomatic: 'Halving field stipends in provinces, commanderies, and counties: the Song, Sanzhao, Beijian, and Mao editions and the Nanshi all read "field stipends."',
  },
  s0222: {
    literal: 'The Dian edition and Ju edition read "field rent."',
    idiomatic: 'The Dian and Ju editions read "field rent."',
  },
  s0223: {
    literal: 'The Jiankang shilu reads "stipend ranks."',
    idiomatic: 'The Jiankang shilu has "stipend ranks."',
  },
  s0224: {
    literal: 'A general halving of land rent throughout the realm is not something a feudal ruler would undertake; this must mean halving the field stipends of officials in provinces, commanderies, and counties.',
    idiomatic: 'A general halving of land rent empire-wide is not something a feudal ruler would do; the passage must mean halving officials\' field stipends in provinces, commanderies, and counties.',
  },
  s0225: {
    literal: 'Therefore the Jiankang shilu changed the wording to "stipend ranks."',
    idiomatic: 'Hence the Jiankang shilu rephrases it as "stipend ranks."',
  },
  s0226: {
    literal: 'General of the Guard and Inspector of Southern Yu Prince of Xiangdong Yu was changed to Inspector of Yong: All editions omit the character "Southern."',
    idiomatic: 'Prince of Xiangdong Yu, General of the Guard and Inspector of Southern Yu, reassigned as Inspector of Yong: all editions drop "Southern."',
  },
  s0227: {
    literal: 'According to the annals of Emperor Ming, in the first year of Yongguang he was Inspector of Southern Yu, stationed at Gushu.',
    idiomatic: 'Emperor Ming\'s annals show that in Yongguang year 1 he was Inspector of Southern Yu at Gushu.',
  },
  s0228: {
    literal: 'According to the Treatise on Provinces and Commanderies, at this time Southern Yu was stationed at Gushu, whereas Yu province had never used Gushu as its seat.',
    idiomatic: 'The Treatise on Provinces and Commanderies places Southern Yu at Gushu at this time, while Yu province had never had its seat there.',
  },
  s0229: {
    literal: 'Now restored according to the annals of Emperor Ming.',
    idiomatic: '"Southern" is restored here from Emperor Ming\'s annals.',
  },
  s0230: {
    literal: 'Left Vice Director of the Masters of Writing Yan Shibo: In all editions this reads "Vice Director of the Masters of Writing"; emended according to the Nanshi, as explained above.',
    idiomatic: 'Left Vice Director Yan Shibo: all editions lack "Left"; added back from the Nanshi, as noted above.',
  },
  s0231: {
    literal: 'General Who Pacifies the West and Inspector of Yu Prince of Shanyang Xiuyou was made General Who Pacifies the Army with an office equal in ceremonial honor to the Three Dukes: In all editions "General Who Pacifies the West" reads "General Who Pacifies the North."',
    idiomatic: 'Xiuyou promoted to General Who Pacifies the Army with Three-Dukes honors: all editions read General Who Pacifies the North instead of the West.',
  },
  s0232: {
    literal: 'Above, under the ninth month on xinhai, it reads General Who Pacifies the West, and Xiuyou\'s biography also reads the West—now corrected.',
    idiomatic: 'The ninth-month xinhai entry and Xiuyou\'s biography both have General Who Pacifies the West—corrected here.',
  },
  s0233: {
    literal: '"The son of Director of the Palace Treasury Liu Sheng": "Liu Sheng" appears thus in Yuan ce 197 and 207 in the same annals.',
    idiomatic: '"Son of Director of the Palace Treasury Liu Sheng": Yuan ce 197 and 207 give Liu Sheng in the same annals.',
  },
  s0234: {
    literal: 'The Treatise on Omens, the biography of Prince of Shian Xiuren, the Song lüe, and the Nanshi imperial annals read Liu Meng; the Nanshi biography of Xiuren reads Liu Meng in another form.',
    idiomatic: 'The Treatise on Omens, Xiuren\'s biography, the Song lüe, and the Nanshi annals have Liu Meng; the Nanshi biography of Xiuren gives another form of the name.',
  },
  s0235: {
    literal: '"With a bath-and-music fief of two thousand households": In all editions "with" appears as "marquis."',
    idiomatic: '"Bath-and-music fief of two thousand households": all editions read "marquis" for "with."',
  },
  s0236: {
    literal: 'Emended according to the Yulan 152.',
    idiomatic: 'Corrected per the Yulan, juan 152.',
  },
  s0237: {
    literal: '"The emperor from youth loved reading": In all editions "reading" appears as "lecturing"; emended according to the Nanshi, Yuan ce 192, and the Yulan 128 citation.',
    idiomatic: '"Loved reading from youth": all editions have "lecturing" instead of "reading"; corrected from the Nanshi, Yuan ce 192, and Yulan 128.',
  },
  s0238: {
    literal: '"Prince of Jian\'an Xiuren and Prince of Shanyang Xiuyou were put in charge": All editions omit the five characters "Xiuren, Prince of Shanyang"; restored according to the Nanshi.',
    idiomatic: '"Xiuren and Prince of Shanyang Xiuyou were put in charge": all editions omit "Xiuren, Prince of Shanyang"; restored from the Nanshi.',
  },
  s0239: {
    literal: 'Zhang Hui\'s Du shi juzheng says: "Prince of Jian\'an is Xiuren, and Xiuyou is Prince of Shanyang.',
    idiomatic: 'Zhang Hui\'s Du shi juzheng explains: "Prince of Jian\'an is Xiuren, and Xiuyou is Prince of Shanyang."',
  },
  s0240: {
    literal: 'The Nanshi\'s wording, "Prince of Jian\'an Xiuren and Prince of Shanyang Xiuyou were put in charge," is correct."',
    idiomatic: 'Zhang Hui concludes that the Nanshi reading, with both princes named, is the right one."',
  },
};

let n = 0;
for (const s of data.sentences) {
  const t = T[s.id];
  if (t) {
    s.literal = t.literal;
    s.idiomatic = t.idiomatic;
    n++;
  }
}
fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log(`Filled ${n} sentences`);
