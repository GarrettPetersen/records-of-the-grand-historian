#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'He was transferred back and made staff equal on the staff of the Prince of Shaoling, Light Chariots; he followed the prince\'s headquarters to Kuaiji and again entered mourning for his birth mother.',
    'He returned to office as staff equal to the Prince of Shaoling of Light Chariots, followed the headquarters to Kuaiji, and again mourned his birth mother.',
  ],
  s0202: [
    'Returning from mourning to the capital, he crossed the Zhe River; midstream he met wind and the boat was about to capsize—Shami embraced the coffin and wailed, and presently the wind fell still—thought to be moved by filial response.',
    'On the homeward crossing of the Zhe the boat nearly capsized in a squall; Shami clung to the coffin and wailed, and soon the wind died—men took it as filial feeling answered from Heaven.',
  ],
  s0203: [
    'When mourning ended he was made staff equal of Trustworthy Might criminal judge, concurrently [lacuna] of Danyang commandery; he was promoted in succession recording secretary of Ningyuan and transferred to marshal.',
    'After mourning he became Trustworthy Might criminal judge staff equal and concurrently [text lost] in Danyang; he rose to Ningyuan recording secretary, then marshal.',
  ],
  s0204: [
    'He went out as magistrate of Changcheng and died.',
    'He served as magistrate of Changcheng and died in office.',
  ],
  s0205: [
    'Jiang Gou, styled Hanjie, was a man of Kaocheng in Jiyang.',
    'Jiang Gou, styled Hanjie, was from Kaocheng in Jiyang.',
  ],
  s0206: [
    'His father Qian was Grand Master for Splendid Happiness.',
    'His father Qian was Grand Master for Splendid Happiness.',
  ],
  s0207: [
    'From childhood Gou had a filial nature.',
    'Gou was filial from childhood.',
  ],
  s0208: [
    'At thirteen his father suffered eye disease; Gou attended the illness for nearly a month without undoing his belt.',
    'At thirteen, when his father had eye trouble, Gou nursed him nearly a month without leaving his side.',
  ],
  s0209: [
    'One night he dreamed a monk said, "For eye disease, drink Wisdom-Eye water and you will be cured."',
    'In a dream a monk told him, "For eye disease, drink Wisdom-Eye water and it will heal."',
  ],
  s0210: [
    'When he woke and told it, no one could explain it.',
    'He told the dream at dawn, but no one could explain it.',
  ],
  s0211: [
    'Gou\'s third uncle Lu was on good terms with the Wise One of Caotang Temple; he went to visit him.',
    'His third uncle Lu was close to the Wise One of Caotang Temple and went to ask him.',
  ],
  s0212: [
    'The Wise One said, "The Infinite Life Sutra says: the wisdom-eye sees truth and can ferry to the farther shore."',
    'The Wise One said, "The Infinite Life Sutra says, \'The wisdom-eye sees truth and can ferry to the farther shore.\'"',
  ],
  s0213: [
    'Qian thereupon through the Wise One petitioned to donate the house and land at Niutun in Tongxia county as a monastery and begged a fine name.',
    'Qian then asked the Wise One to petition donating the Niutun estate in Tongxia as a monastery and to grant it a worthy name.',
  ],
  s0214: [
    'The edict in reply said, "Pure ministers and filial sons often meet with response."',
    'The reply edict said, "Pure ministers and filial sons often meet with response."',
  ],
  s0215: [
    'In Jin times Yan Han thus saw medicine sent from the shades.',
    'In Jin times Yan Han likewise saw medicine sent from the shades.',
  ],
  s0216: [
    'Recently seeing the Wise One, I know your second son was moved in a dream, saying to drink wisdom-eye water."',
    'Recently the Wise One told me your second son dreamed of drinking wisdom-eye water."',
  ],
  s0217: [
    'Wisdom-eye is the name of one of the five eyes; if you wish to build a monastery, you may take Wisdom-Eye as its name."',
    'Wisdom-eye is one of the five eyes; if you build a monastery, call it Wisdom-Eye."',
  ],
  s0218: [
    'When construction was undertaken they opened an old well; the well water was clear and sweet, unlike ordinary springs.',
    'When they built, they cleared an old well whose water was clear and sweet, unlike ordinary springs.',
  ],
  s0219: [
    'Following the dream they took the water to wash the eyes and boil medicine; he felt somewhat better, and thereby was cured.',
    'As the dream directed they washed his eyes and boiled medicine in it; he improved and was cured.',
  ],
  s0220: [
    'Men of the time called it filial feeling answered.',
    'People called it filial feeling answered.',
  ],
  s0221: [
    'When the Prince of Nankang was southern inspector he summoned Gou as reception chief clerk.',
    'When the Prince of Nankang governed the south he made Gou reception chief clerk.',
  ],
  s0222: [
    'Gou\'s nature was quiet; he loved the dark learning of Laozi and Zhuangzi and was especially skilled in Buddhist meaning, and did not delight in advancing in office.',
    'Quiet by nature, he loved Laozi and Zhuangzi and Buddhist teaching and did not care to advance in office.',
  ],
  s0223: [
    'When his father died Gou built a hut at the tomb and wailed without cease all day; after more than a month he died.',
    'When his father died he lodged at the tomb and wailed without cease; after more than a month he died.',
  ],
  s0224: [
    'Liu Ji, styled Shixuan, was a man of Pingyuan.',
    'Liu Ji, styled Shixuan, was from Pingyuan.',
  ],
  s0225: [
    'His grandfather Chenmin was Song inspector of Ji.',
    'His grandfather Chenmin was Song inspector of Ji.',
  ],
  s0226: [
    'His father Wenwei was a Qi artisan officer.',
    'His father Wenwei was a Qi artisan officer.',
  ],
  s0227: [
    'At nine years Ji could recite the Zuo Commentary; clan and kin all marveled at him.',
    'At nine he could recite the Zuo Commentary; kin and clan marveled.',
  ],
  s0228: [
    'At fourteen, in mourning for his father, he had utmost nature; each time he wept he vomited blood.',
    'At fourteen, mourning his father, he was utterly devoted; each cry brought up blood.',
  ],
  s0229: [
    'The family was poor; with his younger brothers Xiao and Gao Chu he urged one another in study.',
    'Poor at home, he and his brothers Xiao and Gao Chu urged one another in study.',
  ],
  s0230: [
    'When grown he read widely and mastered many subjects.',
    'Grown, he read widely and mastered many subjects.',
  ],
  s0231: [
    'In the Tianjian era he first entered office as court gentleman for attendance, then was promoted staff equal on the staff of the Prince of Xuanhui of Jin\'an, concurrently inner recorder within limits, and went out to supplement magistrate of Xichang.',
    'In Tianjian he began as court gentleman, rose to staff equal on the Prince of Jin\'an of Xuanhui\'s staff with inner recorder duties, then magistrate of Xichang.',
  ],
  s0232: [
    'He entered office as Master of Guests in the Secretariat.',
    'He entered the Secretariat as Master of Guests.',
  ],
  s0233: [
    'Before the term ended he was made magistrate of Haiyan.',
    'Before long he was made magistrate of Haiyan.',
  ],
  s0234: [
    'Ji in succession governed two districts and in both was famed for harmony and good order.',
    'He governed two districts in turn and in both was famed for harmony.',
  ],
  s0235: [
    'He returned and became magistrate of Jiankang—not to his liking.',
    'He became magistrate of Jiankang, which he did not enjoy.',
  ],
  s0236: [
    'Before long, on illness, he was dismissed.',
    'Soon illness freed him from office.',
  ],
  s0237: [
    'Shortly after he was made magistrate of Jiankang but would not accept.',
    'He was offered Jiankang again and refused.',
  ],
  s0238: [
    'His mother Lady Ming lay ill; Ji was already fifty and for seventy days did not undo his belt, reciting the Scripture of Guanshiyin Bodhisattva tens of thousands of times; one night, moved in a dream, he saw a monk who said, "Your lady mother\'s allotted span is ended; your sincerity is utmost—I shall plead to extend it for you."',
    'When his mother Lady Ming fell ill, though fifty he did not leave her side for seventy days, chanting the Guanshiyin sutra tens of thousands of times; in a dream a monk said, "Your mother\'s span is done, but your devotion is so deep I shall ask to extend it."',
  ],
  s0239: [
    'After more than sixty days she died.',
    'She lived more than sixty days longer, then died.',
  ],
  s0240: [
    'Ji lodged at the tomb and mourned beyond the rites.',
    'He lodged at the tomb and mourned beyond the rites.',
  ],
  s0241: [
    'A pair of white cranes constantly hovered tame beside the hut.',
    'A pair of white cranes hovered tame beside his mourning hut.',
  ],
  s0242: [
    'The recluse Ruan Xiaoxu sent a letter to restrain and comfort him, but Ji\'s longing did not cease; before mourning ended he died, aged fifty-two.',
    'Ruan Xiaoxu wrote to restrain him, but Ji\'s longing never ceased; before mourning ended he died at fifty-two.',
  ],
  s0243: [
    'He authored Clarifying Common Speech in eight scrolls and a collected works in ten scrolls.',
    'He wrote Clarifying Common Speech in eight scrolls and collected works in ten.',
  ],
  s0244: [
    'His younger brother Xiao is in the Literary Treatise; Gao is in the Recluses Treatise.',
    'His brother Xiao has a biography in the Literary Treatise; Gao in the Recluses Treatise.',
  ],
  s0245: [
    'Chu Xiu was a man of Qiantang in Wu commandery.',
    'Chu Xiu was from Qiantang in Wu commandery.',
  ],
  s0246: [
    'His father Zhongdu was skilled in the Book of Changes and was foremost of his day.',
    'His father Zhongdu mastered the Book of Changes and was foremost of his day.',
  ],
  s0247: [
    'In the Tianjian era he held office through the ranks as erudite of the Five Classics.',
    'Under Tianjian he rose to erudite of the Five Classics.',
  ],
  s0248: [
    'Xiu from youth transmitted his father\'s craft, and also mastered the Classic of Filial Piety and the Analects, was skilled at letters, and understood composition fairly well.',
    'From youth Xiu took his father\'s learning, also mastered the Filial Classic and Analects, wrote well, and understood composition.',
  ],
  s0249: [
    'He first became gentleman of the Prince of Xiangdong\'s kingdom, then was promoted staff equal on the Light Chariots staff of the Prince of Xiangdong, and concurrently assistant teacher of the National University.',
    'He began as gentleman of the Prince of Xiangdong\'s kingdom, then staff equal on his Light Chariots staff and National University assistant teacher.',
  ],
  s0250: [
    'When the Prince of Wuling was Yangzhou inspector he summoned him as staff equal of Xuanhui and inner recorder within limits.',
    'When the Prince of Wuling governed Yangzhou he made him Xuanhui staff equal and inner recorder.',
  ],
  s0251: [
    'Xiu\'s nature was utmost filial; in mourning for his father he wasted away beyond the rites and thereby suffered a chill in the vital breath.',
    'Utterly filial, he wasted away beyond the rites mourning his father and took a chill in the vital breath.',
  ],
  s0252: [
    'When he entered mourning for his mother he did not take water or gruel for twenty-three days, lost breath and revived; each time he wailed he vomited blood, and thereby died of grief.',
    'Mourning his mother he took no food for twenty-three days, fainted and revived, wailed until he vomited blood, and died of grief.',
  ],
  s0253: [
    'Xie Lan, styled Xiru, was a man of Yangxia in Chen commandery.',
    'Xie Lan, styled Xiru, was from Yangxia in Chen commandery.',
  ],
  s0254: [
    'He was eighth-generation descendant of Jin Grand Tutor An.',
    'He was eighth-generation descendant of Jin Grand Tutor An.',
  ],
  s0255: [
    'His father Jing was staff equal for consultation in the Central Guard.',
    'His father Jing was staff equal for consultation in the Central Guard.',
  ],
  s0256: [
    'At five, whenever his parents had not yet eaten, the wet nurse wished to let Lan eat first; Lan said, "I am not yet aware of hunger."',
    'At five, if his parents had not eaten the nurse would feed Lan first; he said, "I do not yet feel hungry."',
  ],
  s0257: [
    '" Though pressed he would in the end not eat.',
    '" Pressed, he still would not eat.',
  ],
  s0258: [
    'His maternal uncle Ruan Xiaoxu heard of it and sighed, "This child at home is of Zengzi\'s sort; in serving his lord he would match the lad Lan."',
    'His uncle Ruan Xiaoxu sighed, "At home this boy is like Zengzi; in serving a lord he would match young Lan."',
  ],
  s0259: [
    '" He therefore gave him the name Lan.',
    '" So he was named Lan.',
  ],
  s0260: [
    'Gradually he received instruction in the classics and histories; what passed before his eyes he could chant from memory.',
    'Taught the classics and histories, he could chant from memory whatever he read.',
  ],
  s0261: [
    'Xiaoxu often said, "He is the Yang element of our house."',
    'Xiaoxu often said, "He is our house\'s Yang element."',
  ],
  s0262: [
    'When mourning for his father ended he wailed day and night, wasted away until only bone stood, and his mother Lady Ruan constantly watched over him herself to restrain and comfort him.',
    'After his father\'s death he wailed day and night until only bone remained; his mother Lady Ruan constantly watched and restrained him.',
  ],
  s0263: [
    'After mourning he was recommended for utmost conduct by Minister of Personnel Xiao Zixian and was promoted court gentleman for legal affairs on the prince\'s staff, then in succession outer staff recorder.',
    'When mourning ended Minister Xiao Zixian recommended his utmost conduct; he became princely legal affairs gentleman, then outer staff recorder.',
  ],
  s0264: [
    'At that time sweet dew fell on the Scholars\' Grove; Lan presented a eulogy and Gaozu praised it, whereupon an edict ordered him to compose the Stele on the Virtuous Government of Xiao Kai, Inspector of North Yanzhou, and he was also ordered to compose the "Eulogy on the Prince of Xuancheng\'s Presentation of the Mean."',
    'When sweet dew fell on the Scholars\' Grove Lan presented a eulogy the emperor praised; he was ordered to compose the stele on Xiao Kai\'s virtuous rule in North Yanzhou and the eulogy on the Prince of Xuancheng presenting the Mean.',
  ],
  s0265: [
    'In the first year of Taiqing he was promoted Gentleman Attendant of the Palace Secretariat and concurrently Regular Attendant of Scattered Cavalry and sent as envoy to Wei.',
    'In Taiqing year one he became Gentleman Attendant and Regular Attendant of Scattered Cavalry and envoy to Wei.',
  ],
  s0266: [
    'When Hou Jing surrendered territory and came over, fighting broke out on the borders; Lan\'s mother feared he could not return and died of grief.',
    'When Hou Jing defected and border fighting broke out, Lan\'s mother feared he would not return and died of grief.',
  ],
  s0267: [
    'When Lan returned and entered the realm, that very evening he dreamed ill omens; at dawn he submitted his resignation and raced home.',
    'On re-entering the realm that night he dreamed ill omens; at dawn he resigned and raced home.',
  ],
  s0268: [
    'When he arrived he wailed and vomited blood and long lost breath; he would not take water or gruel.',
    'Arriving, he wailed until he vomited blood and long lost breath, and took no food.',
  ],
  s0269: [
    'Kin and friends feared he would not survive and mourned together; they forced him to take thin gruel.',
    'Kin feared he would not live and wept together, forcing thin gruel on him.',
  ],
  s0270: [
    'At first Lan forced himself to accept it but in the end could not swallow; after more than a month, one night at the tomb he died, aged thirty-eight.',
    'He forced himself at first but could not swallow; after more than a month he died one night at the tomb, aged thirty-eight.',
  ],
  s0271: [
    'Lan composed several tens of pieces of poetry, fu, steles, and eulogies.',
    'Lan composed several tens of poems, rhapsodies, steles, and eulogies.',
  ],
  s0272: [
    'Commentary section marker in the source text.',
    'Marker denoting the historian\'s commentary section in the source text.',
  ],
  s0273: [
    'The historian says: Confucius said "grief should not destroy one\'s nature," teaching the people not to harm life through death; therefore mourning regulations were made and ritual texts set for restraint.',
    'The historian says: Confucius said grief must not destroy one\'s nature, teaching people not to harm life through death; hence mourning rules and ritual restraint were ordained.',
  ],
  s0274: [
    'Gao Chai and Zhong You embraced the sage\'s teaching; Zeng Shen and Min Sun were reverently filial—some did not take water or gruel, some wept blood a full year: did they not know the wound was deep and the mourning in "Luxuriant Reeds" keen?',
    'Gao Chai and Zhong You followed the sage; Zeng Shen and Min Sun were reverently filial—some took no food, some wept blood a year: did they not know wound and longing in "Luxuriant Reeds"?',
  ],
  s0275: [
    'This is what is meant when the former kings made ritual and worthies bow to it.',
    'So when the former kings made ritual, worthies bowed to it.',
  ],
  s0276: [
    'As for Qiu and Wu, they ended in self-destruction.',
    'Men such as Qiu and Wu ended in self-destruction.',
  ],
  s0277: [
    'If Liu Tanjing, He Jiong, Jiang Gou, and Xie Lan are considered, are they not of those two men\'s intent?',
    'Were Liu Tanjing, He Jiong, Jiang Gou, and Xie Lan not of that same intent?',
  ],
  s0278: [
    '[1] Editorial footnote marker in the source text.',
    '[1] Editorial footnote marker.',
  ],
  s0279: [
    'The full text has been collated against the Zhonghua Shuju edition of the Book of Liang, May 1973.',
    'The full text has been collated against the Zhonghua Shuju edition of the Book of Liang, May 1973.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_047_b3.mjs <translation.json>'
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
