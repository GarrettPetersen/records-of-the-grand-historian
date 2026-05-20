#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'If there were no root in my form, yet it could be lodged everywhere in other places.',
    'If thought had no root in one\'s form, it could lodge everywhere abroad.',
  ],
  s0202: [
    'One might as well lodge Zhang Jia\'s feelings in Wang Yi\'s body;',
    'Zhang\'s mind could lodge in Wang\'s body;',
  ],
  s0203: [
    'and Li Bing\'s nature in Zhao Ding\'s frame.',
    'and Li Bing\'s nature in Zhao Ding\'s frame.',
  ],
  s0204: [
    'Is it so?',
    'Could that be?',
  ],
  s0205: [
    'It is not so."',
    'It is not so."',
  ],
  s0206: [
    'Question: "Sages\' forms are like ordinary men\'s forms, yet there is ordinary and sage distinction—thus form and spirit differ."',
    'Question: "Sages look like ordinary men, yet sage and commoner differ—so body and soul must differ."',
  ],
  s0207: [
    'Answer: "Not so.',
    'Answer: "Not so.',
  ],
  s0208: [
    'Refined gold can shine; dross cannot shine—if there is refined gold that can shine, how could there be dross that does not shine?',
    'Fine gold shines; base ore does not—given shining fine gold, can there be non-shining dross?',
  ],
  s0209: [
    'How could a sage\'s spirit lodge in an ordinary man\'s vessel, or an ordinary man\'s spirit lodge in a sage\'s frame?',
    'How could a sage\'s soul inhabit a commoner\'s body, or a commoner\'s soul a sage\'s?',
  ],
  s0210: [
    'Hence eight-colored regalia and double pupils—the countenances of Yao and Shun;',
    'Hence eight hues and double pupils—the faces of Yao and Shun;',
  ],
  s0211: [
    'dragon face and horse mouth—the forms of Xuanyuan and Shaohao;',
    'dragon face and horse mouth—the looks of the Yellow Emperor and Shaohao;',
  ],
  s0212: [
    'these are differences of outward form.',
    'these are outward differences.',
  ],
  s0213: [
    'Bi Gan\'s heart with seven openings arrayed like horns;',
    'Bi Gan\'s heart, seven openings like horns;',
  ],
  s0214: [
    'Jiang Wei\'s gall, large as a fist;',
    'Jiang Wei\'s gall, big as a fist;',
  ],
  s0215: [
    'these are differences of heart and vessel.',
    'these are inner differences.',
  ],
  s0216: [
    'Thus one knows sages\' allotted stations each transcend the common run—not only does the Way transform the masses, their forms also surpass all things.',
    'Sages\' stations transcend the ordinary—not only transforming the people but surpassing all in form.',
  ],
  s0217: [
    'That sage and commoner share the same body—I dare not accept."',
    'That sage and commoner share one body—I cannot accept."',
  ],
  s0218: [
    'Question: "You say a sage\'s form must differ from an ordinary man\'s.',
    'Question: "You say sages\' forms must differ from ordinary men\'s.',
  ],
  s0219: [
    'May I ask: Yang Huo resembled Zhongni, Xiang Yu resembled great Shun;',
    'Consider Yang Huo like Zhongni, Xiang Yu like great Shun;',
  ],
  s0220: [
    'Shun, Xiang, Kong, and Yang—wisdom differed yet forms were alike; what is the reason?"',
    'yet Shun, Xiang, Kong, and Yang differed in wisdom though alike in form—why?"',
  ],
  s0221: [
    'Answer: "Min stone resembles jade but is not jade; a cock resembles a phoenix but is not a phoenix;',
    'Answer: "Min stone looks like jade but is not jade; a cock like a phoenix but not a phoenix;',
  ],
  s0222: [
    'things truly have such cases; among men it is likewise fitting."',
    'such things exist in nature; among men it is the same."',
  ],
  s0223: [
    'Xiang and Yang resembled in appearance but not in reality; heart and vessel were unequal—though the face matched, it availed nothing."',
    'Xiang and Yang looked alike but were not truly alike; unequal inner endowment made likeness useless."',
  ],
  s0224: [
    'Question: "That sage and commoner differ and vessels of form are not one—acceptable.',
    'Question: "Sage and commoner may differ in form—that is fine.',
  ],
  s0225: [
    'Sages reach the ultimate; principle admits no twain;',
    'Sages reach the ultimate; principle has no second;',
  ],
  s0226: [
    'yet Qiu and Dan had different looks, Tang and Wen different forms—spirit does not match appearance; here it is still clearer."',
    'yet Confucius and the Duke of Zhou differed in looks, Tang and Wen in form—soul does not match face; this is clearer still."',
  ],
  s0227: [
    'Answer: "Sages are alike in heart and vessel; forms need not be alike—just as horses differ in hair yet equal in speed, jades differ in color yet equal in beauty.',
    'Answer: "Sages share heart and vessel; forms need not match—as horses differ in coat yet run alike, jades in hue yet equal in worth.',
  ],
  s0228: [
    'Hence Jin Thorn and Jing He—equal price for cities chained together;',
    'Hence Jin Thorn and Jing He—worth a chain of cities;',
  ],
  s0229: [
    'Hualiu and Lüer—both reach a thousand li."',
    'Hualiu and Lüer—both run a thousand li."',
  ],
  s0230: [
    'Question: "Form and spirit are not two—I have heard that; when form decays spirit perishes—reason surely requires it.',
    'Question: "Body and soul are one—I accept that; when the body fails the soul ends—as reason demands.',
  ],
  s0231: [
    'May I ask: the classic says \'Make for him an ancestral temple, to feed him as a ghost\'—what does it mean?"',
    'But the classic says, \'Make ancestral temples and feed them as ghosts\'—what does that mean?"',
  ],
  s0232: [
    'Answer: "It is the sage\'s teaching.',
    'Answer: "It is the sage\'s teaching.',
  ],
  s0233: [
    'Thus to soothe the filial son\'s heart and to sharpen the lax and mean in intent—\'spirit\' made manifest: that is what is meant."',
    'It soothes filial hearts and rebukes lax conduct—\'spirit\' made clear: that is all."',
  ],
  s0234: [
    'Question: "Bo You wore armor, Peng Sheng appeared as a pig—the histories record these matters; can they be mere didactic devices?"',
    'Question: "Bo You in armor, Peng Sheng as a pig—histories record them; mere teaching devices?"',
  ],
  s0235: [
    'Answer: "Strange apparitions are vast and dim—sometimes present, sometimes gone; many die by violence yet not all become ghosts.',
    'Answer: "Strange things are dim—now here, now gone; many violent deaths do not all become ghosts.',
  ],
  s0236: [
    'Peng Sheng and Bo You—why alone could they do so?',
    'Why should Peng Sheng and Bo You alone do so?',
  ],
  s0237: [
    'Suddenly becoming a man or a pig—not necessarily the lords of Qi and Zheng."',
    'Turning into man or pig—not necessarily Qi and Zheng\'s princes."',
  ],
  s0238: [
    'Question: "The Changes says, \'Thus one knows the ghosts\' and spirits\' conditions, similar to Heaven and Earth and not at odds with them.\'',
    'Question: "The Changes says one may know ghosts\' and spirits\' states, akin to Heaven and Earth without conflict."',
  ],
  s0239: [
    'It also says: \'A cartload of ghosts.\'',
    'It also says, \'A cartload of ghosts.\'',
  ],
  s0240: [
    'What is the meaning?"',
    'What does that mean?"',
  ],
  s0241: [
    'Answer: "There are birds and there are beasts—the distinction of flying and running;',
    'Answer: "There are birds and beasts—the flying and walking kinds;',
  ],
  s0242: [
    'there are men and there are ghosts—the distinction of dark and bright.',
    'there are men and ghosts—the living and the dead.',
  ],
  s0243: [
    'Man perishing to become ghost, ghost perishing to become man—I have not yet known it."',
    'Men becoming ghosts, ghosts becoming men—that I do not know."',
  ],
  s0244: [
    'Question: "Knowing this spirit perishes—what use is there?"',
    'Question: "Knowing the soul perishes—what is the use?"',
  ],
  s0245: [
    'Answer: "The Buddha harms government; clerics corrupt custom.',
    'Answer: "Buddhism harms rule; monks corrupt custom.',
  ],
  s0246: [
    'Wind startles and mist rises—they rush and swirl without cease.',
    'Winds rise and mists swirl—they rush on endlessly.',
  ],
  s0247: [
    'I pity their harm and wish to save the drowning.',
    'I pity the harm and would save the drowning.',
  ],
  s0248: [
    'Why do men exhaust wealth to attend monks, ruin estates to hurry to Buddha, yet not care for kin and not pity the poor and destitute?',
    'Why exhaust wealth on monks, ruin estates for Buddha, yet neglect kin and pity no poor?',
  ],
  s0249: [
    'Truly because feeling for self runs deep and intent to aid things runs shallow.',
    'Because love of self runs deep and care for others runs shallow.',
  ],
  s0250: [
    'Hence a cup or spoon for a poor friend—stingy feeling shows in the face;',
    'A cup for a poor friend brings a stingy face;',
  ],
  s0251: [
    'a thousand zhong given to a rich monk—joy shows in the expression.',
    'a thousand zhong to a rich monk brings a bright face.',
  ],
  s0252: [
    'Is it not because monks promise many harvests while friends offer no leftover sheaf in return—urgent aid is neglected while merit must return to oneself?',
    'Monks promise harvests; friends offer no return—aid in need is skimped while merit must accrue to oneself.',
  ],
  s0253: [
    'They are also deluded by dim vague words, frightened by Avici torment, enticed by empty false phrases, delighted by Tusita joy.',
    'Dim words delude them, Avici frightens, false tales entice, Tusita delights.',
  ],
  s0254: [
    'Hence they cast off wide sleeves, don cross-robe, abandon meat and grain stands, array alms bowls;',
    'They cast off scholar robes, don monks\' garb, abandon ritual vessels, take up begging bowls;',
  ],
  s0255: [
    'every household abandons those it loves; every man cuts off his line.',
    'households abandon kin; men end their lines.',
  ],
  s0256: [
    'Hence troops fail in the ranks, offices stand empty, grain is spent on idlers, goods exhausted on clay and wood.',
    'Armies weaken, offices empty, grain spent on idlers, wealth on idols.',
  ],
  s0257: [
    'Thus villains are not overcome yet praise still crowds—only for this cause: the current never stops; the disease has no limit.',
    'Villains thrive while praise abounds—for this the flood never ends and the disease has no limit.',
  ],
  s0258: [
    'If pottery and casting receive from nature and the forested myriad are equal in spontaneous transformation;',
    'If all things arise from nature and transform alike;',
  ],
  s0259: [
    'suddenly they exist, dimly they vanish; coming cannot be barred, going cannot be pursued—riding Heaven\'s principle, each rests in its nature.',
    'suddenly present, dimly gone; coming unbarred, going unchased—each rests in its nature by Heaven\'s law.',
  ],
  s0260: [
    'The petty man is content with his furrow; the gentleman keeps his plain simplicity;',
    'Petty men content with fields; gentlemen keep plain simplicity;',
  ],
  s0261: [
    'plowing to eat—food cannot be exhausted;',
    'plow to eat—food never runs out;',
  ],
  s0262: [
    'silkworms to clothe—clothing cannot be used up;',
    'raise silkworms to clothe—cloth never runs out;',
  ],
  s0263: [
    'below has surplus to serve above; above is non-active to await below—by this one can preserve life, rectify the state, and make a lord hegemon: use this Way."',
    'the lower has surplus for the upper; the upper is inactive awaiting the lower—life preserved, state rectified, hegemony won: this is the Way."',
  ],
  s0264: [
    'When this treatise appeared court and countryside clamored; Ziliang gathered monks to refute it but could not bend him.',
    'When the essay appeared court and country clamored; Ziliang gathered monks to challenge him but could not prevail.',
  ],
  s0265: [
    'Zhen remained in the south many years, then was recalled to the capital.',
    'Zhen stayed in the south many years, then was recalled to the capital.',
  ],
  s0266: [
    'When he arrived he was made Secretariat Gentleman and Erudite of the National University and died in office.',
    'On arrival he became Secretariat Gentleman and National University erudite and died in office.',
  ],
  s0267: [
    'Collected writings in ten juan.',
    'His collected works ran to ten juan.',
  ],
  s0268: [
    'His son Xu, styled Changcai.',
    'His son Xu, styled Changcai.',
  ],
  s0269: [
    'He inherited his father\'s learning and first took office as Erudite of the Imperial University.',
    'He inherited his father\'s learning and began as Imperial University erudite.',
  ],
  s0270: [
    'Xu had eloquence; in the Datong era he often concurrently served as Master of Guests and received northern envoys.',
    'Xu was eloquent; in Datong he often doubled as Master of Guests receiving northern envoys.',
  ],
  s0271: [
    'He was promoted Adviser to the Prince of Xiangdong of Pacifying West and attended the Prince of Xuancheng in study.',
    'He rose to Adviser to Pacifying West\'s Prince of Xiangdong and tutored the Prince of Xuancheng.',
  ],
  s0272: [
    'He went out as Administrator of Poyang and died in the commandery.',
    'He served as Administrator of Poyang and died in office.',
  ],
  s0273: [
    'Yan Zhizhi',
    'Yan Zhizhi',
  ],
  s0274: [
    'Yan Zhizhi, styled Xiaoyuan, was a man of Zigui in Jianping.',
    'Yan Zhizhi, styled Xiaoyuan, was from Zigui in Jianping.',
  ],
  s0275: [
    'His grandfather Qin was Song Regular Attendant and Supernumerary Cavalier Attendant-in-Ordinary.',
    'His grandfather Qin was Song Regular Attendant and Supernumerary Cavalier Attendant-in-Ordinary.',
  ],
  s0276: [
    'Zhizhi in youth was skilled in Zhuangzi and Laozi, could speak arcane words, and had penetrating understanding of the Mourning Dress, Classic of Filial Piety, and Analects.',
    'In youth he mastered Zhuangzi and Laozi, spoke arcane doctrine, and excelled in Mourning Dress, Filial Piety, and Analects.',
  ],
  s0277: [
    'When grown he thoroughly studied the Zheng clan Rites, Book of Changes, Mao Odes, and Zuo\'s Spring and Autumn.',
    'Grown, he mastered Zheng Rites, Changes, Mao Odes, and Zuo\'s Spring and Autumn.',
  ],
  s0278: [
    'His nature was pure, filial, careful, and thick; he did not set himself above others by his strengths.',
    'Pure, filial, and modest, he did not lord his learning over others.',
  ],
  s0279: [
    'In youth he suffered his father\'s death and therefore ate only vegetables for twenty-three years; later he contracted wind-cold illness and only then stopped.',
    'He mourned his father with vegetable fare for twenty-three years until wind-cold illness made him stop.',
  ],
  s0280: [
    'In Qi\'s Yongming era he first took office as Gentleman of the Kingdom of Luling, then was transferred Right Regular Attendant in the Kingdom of Guanghan.',
    'In Qi Yongming he began as Luling kingdom gentleman, then Guanghan Right Regular Attendant.',
  ],
  s0281: [
    'When the prince was executed none in the state dared look on the corpse; Zhizhi alone ran to weep, with his own hands arranged encoffining, went barefoot to escort the bier to the grave, raised a mound, and only after burial returned—men of the time praised his righteousness.',
    'When the prince was killed none dared view the body; Zhizhi alone wept, encoffined him, went barefoot to the grave, raised a mound, and returned—men praised his duty.',
  ],
  s0282: [
    'In the Jianwu era he was promoted Outer Gentleman and Supernumerary Cavalier Attendant-in-Ordinary.',
    'In Jianwu he became Outer Gentleman and Supernumerary Cavalier Attendant-in-Ordinary.',
  ],
  s0283: [
    'Soon he was made Marquis of Kangle\'s Chancellor; in the district he was pure and white, and people and officials praised him.',
    'Soon Marquis of Kangle\'s chancellor; his rule was pure and officials and people praised him.',
  ],
  s0284: [
    'In the second year of Tianjian he was commissioned Cavalry Command Staff Officer in the Rear Army.',
    'In Tianjian year two he was commissioned Rear Army cavalry staff officer.',
  ],
  s0285: [
    'Gaozu edicted to seek comprehensive scholars to compile the Five Rites; the relevant offices memorialized that Zhizhi should handle mourning rites.',
    'Gaozu sought scholars for the Five Rites; the offices named Zhizhi for mourning rites.',
  ],
  s0286: [
    'At the beginning of the fourth year Erudites of the Five Classics were established, each opening a hall to teach; Zhizhi was made concurrent Erudite of the Five Classics.',
    'In year four Five Classics erudites were set up; Zhizhi was made concurrent erudite.',
  ],
  s0287: [
    'Zhizhi\'s hall was at Chaogou; pupils often numbered in the hundreds.',
    'His hall at Chaogou usually had hundreds of pupils.',
  ],
  s0288: [
    'When Zhizhi lectured, pupils of all five halls had to attend—listeners exceeded a thousand.',
    'When he lectured, all five halls attended—over a thousand listeners.',
  ],
  s0289: [
    'In the sixth year he was promoted Staff Officer to the Pacifying Center Army, still concurrently erudite.',
    'In year six he became Pacifying Center Army staff officer, still erudite.',
  ],
  s0290: [
    'In the seventh year he died in the hall, aged fifty-two.',
    'In year seven he died in the hall at fifty-two.',
  ],
  s0291: [
    'After his illness Zhizhi would not accept salary grain; wife and children were in want.',
    'After illness he refused salary; his wife and children were destitute.',
  ],
  s0292: [
    'After death there was nowhere for the funeral; pupils bought a house so the rites could be completed.',
    'After death there was no home for the funeral; pupils bought a house to complete the rites.',
  ],
  s0293: [
    'Zhizhi\'s nature was benevolent and kind; he loved to perform hidden virtue—even in a dark room he never slackened.',
    'Benevolent by nature, he did hidden good and never slackened even alone.',
  ],
  s0294: [
    'In youth once on a mountain walk he saw a sick man; Zhizhi asked his name but he could not answer; he carried him home, provided medicine, and after six days the man died.',
    'Once on a mountain path he found a sick man who could not speak his name; he took him home, gave medicine, and he died in six days.',
  ],
  s0295: [
    'Zhizhi coffined and buried him; in the end he never knew where the man was from.',
    'Zhizhi coffined and buried him, never learning who he was.',
  ],
  s0296: [
    'Once walking along the Zhazha embankment he saw a sick man lying beside the pond; Zhizhi left the carriage and asked the reason. The man said his surname was Huang, his family was originally from Jingzhou, he had been hired as a laborer, his illness was already critical, the boat master was about to depart, and he had been abandoned on the bank.',
    'By Zhazha pond he found a sick Huang from Jingzhou, a hired laborer abandoned on the bank as the boat was leaving.',
  ],
  s0297: [
    'Zhizhi\'s heart was moved with pity; he carried him back and treated him. After a year Huang recovered and asked to serve as slave for life to repay the great kindness.',
    'Zhizhi took him in and cured him; Huang offered lifelong service in thanks.',
  ],
  s0298: [
    'Zhizhi would not accept it but gave him provisions and sent him away.',
    'Zhizhi refused, gave him supplies, and sent him off.',
  ],
  s0299: [
    'His righteous conduct was mostly of this kind.',
    'His righteous deeds were mostly like this.',
  ],
  s0300: [
    'He compiled Rites Notes on Mourning in 479 juan.',
    'He compiled Rites Notes on Mourning in 479 juan.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_048_b3.mjs <translation.json>'
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
