#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'They use oxen for draft and horses for riding; men and women keep apart.',
    'They draft with oxen, ride horses, and keep the sexes separate.',
  ],
  s0502: [
    'Their office titles include zibenhanzhi, qihanzhi, yehanzhi, yigaozhi, and qibeihanzhi.',
    'Offices include zibenhanzhi, qihanzhi, yehanzhi, yigaozhi, and qibeihanzhi.',
  ],
  s0503: [
    'Their crown is called yizili, their jacket wei-jie, their skirt ke-ban, their boots xi.',
    'They call the crown yizili, the jacket wei-jie, the skirt ke-ban, and boots xi.',
  ],
  s0504: [
    'Their bows and their gait resemble Goguryeo.',
    'Their bows and gait match Goguryeo.',
  ],
  s0505: [
    'They have no writing; they carve wood for tokens of trust.',
    'Without writing, they carve wood for tokens.',
  ],
  s0506: [
    'Their speech requires Baekje before it can be understood.',
    'Their language needs a Baekje interpreter.',
  ],
  s0507: [
    'Wa—they say themselves they are descendants of Taibo; by custom all tattoo the body.',
    'Wa claim descent from Taibo and tattoo by custom.',
  ],
  s0508: [
    'More than twelve thousand li from Daifang, broadly east of Kuaiji—the distance is utterly remote.',
    'Over twelve thousand li from Daifang, east of Kuaiji—utterly remote.',
  ],
  s0509: [
    'From Daifang to Wa, following the sea, passing through the Han states, now east now south, more than seven thousand li before crossing one sea;',
    'From Daifang to Wa one sails the coast through Han lands, veering east and south seven thousand li before the first sea crossing;',
  ],
  s0510: [
    'the sea is more than a thousand li wide, called the Han Sea, reaching the land of Itsu;',
    'a thousand-li sea called the Han Sea leads to Itsu;',
  ],
  s0511: [
    'crossing another sea of more than a thousand li reaches the land of Miro;',
    'another thousand-li crossing reaches Miro;',
  ],
  s0512: [
    'southeast by land five hundred li reaches the land of Ito;',
    'five hundred li southeast by land brings one to Ito;',
  ],
  s0513: [
    'southeast another hundred li reaches the land of Nu;',
    'a hundred li farther southeast lies Nu;',
  ],
  s0514: [
    'east another hundred li reaches the land of Fumi;',
    'a hundred li east lies Fumi;',
  ],
  s0515: [
    'south by water twenty days reaches the land of Tuma;',
    'twenty days south by water reaches Tuma;',
  ],
  s0516: [
    'south by water ten days, by land one month, reaches Yamatai—the seat of the Wa king.',
    'ten days south by water and one month by land reaches Yamatai, where the Wa king dwells.',
  ],
  s0517: [
    'Its offices include ikima, next mimakazhi, next nuchangti.',
    'Offices run ikima, then mimakazhi, then nuchangti.',
  ],
  s0518: [
    'The people plant millet, rice, hemp, and mulberry; they raise silkworms and weave.',
    'They grow grain, hemp, and mulberry, raise silkworms, and weave.',
  ],
  s0519: [
    'They have ginger, cassia, oranges, pepper, and perilla.',
    'Ginger, cassia, oranges, pepper, and perilla grow there.',
  ],
  s0520: [
    'They produce black pheasants, pearls, and green jade.',
    'Black pheasants, pearls, and green jade come from the land.',
  ],
  s0521: [
    'There is a beast like an ox, called the mountain rat;',
    'A beast like an ox, called the mountain rat, lives there;',
  ],
  s0522: [
    'there is also a great serpent that swallows this beast.',
    'and a great serpent that devours it.',
  ],
  s0523: [
    'The serpent\'s hide is hard and cannot be cut; on it are holes that now open, now close; at times light shines from them—shoot through one and the serpent dies.',
    'Its hide is uncuttable, pierced with holes that open and shut and sometimes shine; a shot through a hole kills the serpent.',
  ],
  s0524: [
    'Products are roughly the same as Dan\'er and Zhuya.',
    'Local products resemble Dan\'er and Zhuya.',
  ],
  s0525: [
    'The land is warm; custom is not licentious.',
    'The climate is mild and morals restrained.',
  ],
  s0526: [
    'Men and women all wear their hair loose.',
    'Men and women wear loose hair.',
  ],
  s0527: [
    'The wealthy make caps of brocade and mixed colors, resembling the Hu gong head of China.',
    'Wealthy men wear brocade caps like the Hu gong head of China.',
  ],
  s0528: [
    'For food and drink they use platters and bowls.',
    'Meals are served on platters and in bowls.',
  ],
  s0529: [
    'At death there is an inner coffin but no outer shell; earth is piled to make the mound.',
    'The dead receive an inner coffin without an outer shell, and earth is heaped for the tomb.',
  ],
  s0530: [
    'By nature the people all love wine.',
    'The people are fond of wine.',
  ],
  s0531: [
    'Custom does not know the proper New Year; many live long, often reaching eighty or ninety, sometimes a hundred.',
    'They keep no proper calendar year; many live to eighty or ninety, some to a hundred.',
  ],
  s0532: [
    'Custom has more women than men; the noble may have four or five wives, the lowly still two or three.',
    'Women outnumber men; nobles take four or five wives, commoners two or three.',
  ],
  s0533: [
    'Wives feel no jealous rage over licentiousness.',
    'Wives do not grow jealous over affairs.',
  ],
  s0534: [
    'There is no theft; lawsuits are few.',
    'Theft is rare and lawsuits few.',
  ],
  s0535: [
    'If one breaks the law, the lighter penalty enslaves wife and children; the heavier exterminates the whole clan.',
    'Light crimes cost wife and children; grave ones wipe out the clan.',
  ],
  s0536: [
    'In the Guanghe era of Han Emperor Ling, Wa fell into disorder and attacked one another for years; then together they set up one woman, Himiko, as king.',
    'Under Han Ling\'s Guanghe era Wa warred for years until the realms jointly raised the woman Himiko as king.',
  ],
  s0537: [
    'Himiko had no husband; she clung to ghost-craft and could beguile the masses—therefore the people of the state set her up.',
    'Himiko had no husband, ruled through spirit-craft, and swayed the people—so they made her queen.',
  ],
  s0538: [
    'She had a younger brother who assisted in governing the state.',
    'A younger brother helped govern.',
  ],
  s0539: [
    'Since becoming king she was seldom seen; a thousand maidservants waited on her, and only one man was allowed in and out to transmit edicts.',
    'Once enthroned she was rarely seen; a thousand maids served her while a single man carried edicts in and out.',
  ],
  s0540: [
    'The palace where she dwelt was always guarded by soldiers.',
    'Armed guards always ringed her dwelling.',
  ],
  s0541: [
    'By the third year of Jingchu under Wei, after Gongsun Yuan was executed, Himiko first sent envoys with tribute; Wei made her King Who Honors Wei and granted a gold seal with purple cord.',
    'In Wei Jingchu 3, after Gongsun Yuan\'s execution, Himiko first sent tribute; Wei titled her King Who Honors Wei and gave a gold seal on purple cord.',
  ],
  s0542: [
    'In the Zhengshi era Himiko died; a male king was set up, but the state would not obey; they killed one another again and restored Himiko\'s clan-daughter Iyo as king.',
    'In Zhengshi Himiko died; a male king failed to command loyalty, bloodshed resumed, and Himiko\'s kinswoman Iyo was crowned.',
  ],
  s0543: [
    'Later a male king was set up again, and both received titles and commands from China.',
    'Later a male king ruled again, and both received Chinese investiture.',
  ],
  s0544: [
    'In the time of Jin Emperor An there was a Wa king called Zan.',
    'Under Jin Emperor An a Wa king named Zan reigned.',
  ],
  s0545: [
    'When Zan died, his brother Chen was set up;',
    'Zan\'s death brought his brother Chen to the throne;',
  ],
  s0546: [
    'when Chen died, his son Ji was set up;',
    'Chen\'s death brought his son Ji;',
  ],
  s0547: [
    'when Ji died, his son Xing was set up;',
    'Ji\'s death brought his son Xing;',
  ],
  s0548: [
    'when Xing died, his brother Wu was set up.',
    'Xing\'s death brought his brother Wu.',
  ],
  s0549: [
    'In Qi Jianyuan, Wu was made Bearer of the Staff, Supervisor of Military Affairs for Wa, Silla, Imna, Kara, Jinhan, and Mahan, and General Who Pacifies the East.',
    'In Qi Jianyuan Wu received the staff, command over Wa, Silla, Imna, Kara, Jinhan, and Mahan, and the title General Who Pacifies the East.',
  ],
  s0550: [
    'When Gaozu took the throne, Wu\'s title was advanced to General Who Campaigns East.',
    'Gaozu promoted Wu to General Who Campaigns East.',
  ],
  s0551: [
    'South of them is the Dwarf Country; the people are three or four feet tall.',
    'South lies the Dwarf Country, whose people stand three or four feet.',
  ],
  s0552: [
    'Farther south are the Black-Tooth Country and the Naked Country, more than four thousand li from Wa—a year\'s voyage by ship.',
    'Farther south lie Black-Tooth and Naked countries, four thousand li from Wa and a year\'s sail away.',
  ],
  s0553: [
    'Still farther southwest, ten thousand li off, are sea people—black of body, white of eye, naked and ugly.',
    'Ten thousand li southwest live sea people, black-skinned and white-eyed, naked and foul.',
  ],
  s0554: [
    'Their flesh is savory; travelers sometimes shoot and eat them.',
    'Travelers find their flesh savory and sometimes shoot them for food.',
  ],
  s0555: ['Tattooed Country', 'Tattooed Country'],
  s0556: [
    'The Tattooed Country lies more than seven thousand li northeast of Wa.',
    'Tattooed Country stands seven thousand li northeast of Wa.',
  ],
  s0557: [
    'People\'s bodies bear marks like beasts; on the forehead are three marks—straight marks mean nobility, small marks mean baseness.',
    'Bodies are tattooed like beasts; three forehead marks rank the person—straight for noble, small for low.',
  ],
  s0558: [
    'Local custom is joyous; goods are plentiful and cheap; travelers need not carry provisions.',
    'Life is merry, goods cheap and abundant; travelers carry no rations.',
  ],
  s0559: [
    'They have houses but no walled cities.',
    'They build houses without city walls.',
  ],
  s0560: [
    'Where the king dwells is adorned with gold, silver, and rare splendor.',
    'The king\'s residence gleams with gold, silver, and rare finery.',
  ],
  s0561: [
    'Around the house runs a fringe one zhang wide, filled with mercury; when it rains the water flows atop the mercury.',
    'A one-zhang fringe rings the house, filled with mercury; rain runs over the mercury\'s surface.',
  ],
  s0562: [
    'The market uses precious gems.',
    'Markets trade in precious gems.',
  ],
  s0563: [
    'Light crimes are punished with the whip and staff;',
    'Light offenses bring the whip and staff;',
  ],
  s0564: [
    'capital crimes are punished by setting fierce beasts to devour the offender—if there is injustice the beasts avoid and will not eat; after one night he is pardoned.',
    'capital crimes are judged by fierce beasts—if the man is wronged the beasts refuse him; after a night he goes free.',
  ],
  s0565: ['Great Han Country', 'Great Han Country'],
  s0566: [
    'The Great Han Country lies more than five thousand li east of the Tattooed Country.',
    'Great Han Country lies five thousand li east of Tattooed Country.',
  ],
  s0567: [
    'They have no weapons of war and do not make battle.',
    'They keep no arms and make no war.',
  ],
  s0568: [
    'Custom is the same as the Tattooed Country, but the language differs.',
    'Custom matches Tattooed Country; speech differs.',
  ],
  s0569: ['Fusang Country', 'Fusang Country'],
  s0570: [
    'Fusang Country—in the first year of Qi Yongyuan a monk of that land, Hui Shen, came to Jing Province and said: "Fusang lies more than twenty thousand li east of the Great Han Country, its land east of China; the soil has much fusang wood, hence the name.',
    'Fusang—in Qi Yongyuan 1 the monk Hui Shen reached Jing Province and reported, "Fusang lies twenty thousand li east of Great Han, east of China; fusang trees abound, giving the land its name.',
  ],
  s0571: [
    '" Fusang leaves resemble paulownia and when first sprouting are like bamboo shoots; the people eat them; the fruit is like a pear and red; they spin the bark into cloth for clothing, also using it as cotton.',
    '" Leaves resemble paulownia, new shoots like bamboo; the people eat them; fruit is red like pears; bark is spun into cloth for dress and padding.',
  ],
  s0572: [
    'They build plank houses and have no walled cities.',
    'They live in plank houses without walled cities.',
  ],
  s0573: [
    'They have writing and use fusang bark for paper.',
    'They write on paper made from fusang bark.',
  ],
  s0574: [
    'They have no armor or weapons and do not make battle.',
    'They keep no armor or arms and make no war.',
  ],
  s0575: [
    'By the law of the state there are southern and northern prisons.',
    'State law divides prisons into south and north.',
  ],
  s0576: [
    'Light offenders enter the southern prison; grave offenders enter the northern prison.',
    'Light crimes go to the south prison, grave crimes to the north.',
  ],
  s0577: [
    'When there is an amnesty the southern prison is pardoned; the northern prison is not pardoned.',
    'Amnesties free the south prison, never the north.',
  ],
  s0578: [
    'Those in the northern prison are paired man and woman; a boy at eight becomes a slave, a girl at nine a maid.',
    'Northern prisoners are paired; boys become slaves at eight, girls maids at nine.',
  ],
  s0579: [
    'The bodies of the condemned never leave until death.',
    'Condemned bodies never leave until death.',
  ],
  s0580: [
    'When a noble commits a crime the state holds a great assembly, seating the guilty in a pit while feasting opposite him—parting words as at a final farewell.',
    'When nobles sin the realm feasts above a pit where the condemned sit, taking leave as at death.',
  ],
  s0581: [
    'Ash is piled around them; one layer of ash removes one person from the company, two layers reach sons and grandsons, three layers reach seven generations.',
    'Ash rings the pit—one layer dismisses the offender, two reach sons and grandsons, three reach seven generations.',
  ],
  s0582: [
    'The king is called yiji;',
    'They call the king yiji;',
  ],
  s0583: [
    'the first-rank noble is called dadu-lu, the second xiaodu-lu, the third nazuo-sha.',
    'first nobles are dadu-lu, second xiaodu-lu, third nazuo-sha.',
  ],
  s0584: [
    'When the king travels drums and horns lead the procession.',
    'The king travels to drum and horn.',
  ],
  s0585: [
    'Garment colors change with the year—green in jia and yi years, red in bing and ding, yellow in wu and ji, white in geng and xin, black in ren and gui.',
    'Dress color follows the year—green for jia-yi, red for bing-ding, yellow for wu-ji, white for geng-xin, black for ren-gui.',
  ],
  s0586: [
    'Ox horns are very long and used to carry goods, bearing up to twenty hu.',
    'Long ox horns serve as load-bearers, holding twenty hu.',
  ],
  s0587: [
    'Carts include horse-carts, ox-carts, and deer-carts.',
    'They use horse-carts, ox-carts, and deer-carts.',
  ],
  s0588: [
    'The people raise deer as China raises cattle, making curds from the milk.',
    'They herd deer as China herds cattle and make curds from the milk.',
  ],
  s0589: [
    'They have mulberry pears that keep for years without spoiling.',
    'Mulberry pears keep for years.',
  ],
  s0590: [
    'Grapes are plentiful.',
    'Grapes abound.',
  ],
  s0591: [
    'The land has no iron but has copper; gold and silver are not prized.',
    'Iron is absent, copper present; gold and silver are cheap.',
  ],
  s0592: [
    'Markets levy no tolls or appraisals.',
    'Markets take no toll or appraisal fee.',
  ],
  s0593: [
    'In marriage the bridegroom builds a house outside the bride\'s family gate, sweeping morning and evening; if after a year the girl is not pleased she drives him off—only when both are pleased do they marry.',
    'The groom builds a hut outside the bride\'s gate and sweeps it daily; if she is displeased after a year she sends him away—marriage comes only by mutual consent.',
  ],
  s0594: [
    'The wedding rites are broadly the same as China\'s.',
    'Wedding rites largely match China\'s.',
  ],
  s0595: [
    'For a parent\'s death one does not eat for seven days;',
    'On a parent\'s death one fasts seven days;',
  ],
  s0596: [
    'for grandparents\' death, five days without eating;',
    'for grandparents, five days;',
  ],
  s0597: [
    'for brothers, uncles, aunts, and sisters, three days without eating.',
    'for siblings, uncles, aunts, and sisters, three days.',
  ],
  s0598: [
    'Spirit tablets are set up as spirit-images; morning and evening they bow and offer sacrifice—no hemp mourning garments are prescribed.',
    'Spirit-images stand for the dead; morning and evening bring bowing and offerings—no hemp mourning garb is required.',
  ],
  s0599: [
    'When the heir succeeds he does not attend to state affairs for three years.',
    'A new king leaves state affairs untouched for three years.',
  ],
  s0600: [
    'By old custom there was no Buddhist Law; in the second year of Song Daming, five monks from Gandhara once traveled to that country, spreading Buddhist Law and sutra-images, teaching men to leave the household—and custom was thereby changed."',
    'Once there was no Buddhism; in Song Daming 2 five Gandharan monks reached the land, spread the Law and images, and taught renunciation—and custom changed."',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_054_b6.mjs <translation.json>'
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
