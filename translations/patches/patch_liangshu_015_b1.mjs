#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 15, Biographies 9',
    'Book of Liang, Volume 15, Biographies 9',
  ],
  s0002: [
    'Xie Fei; his nephew Lan',
    'Xie Fei; his nephew Lan',
  ],
  s0003: [
    'Xie Fei, styled Jingchong, was a native of Yangxia in Chen commandery.',
    'Xie Fei, styled Jingchong, came from Yangxia in Chen commandery.',
  ],
  s0004: [
    'His grandfather Hongwei was Song Grand Minister of Ceremonies; his father Zhuang was Right Grand Master of Splendid Happiness—both were famed in earlier generations.',
    'His grandfather Hongwei had been Song grand minister of ceremonies; his father Zhuang, right grand master of splendid happiness—both were celebrated in earlier ages.',
  ],
  s0005: [
    'Fei was clever from childhood; Zhuang treasured him and kept him always at his side.',
    'Fei was bright as a boy; Zhuang prized him and never let him leave his side.',
  ],
  s0006: [
    'At ten he could compose literary pieces.',
    'At ten he could write finished prose.',
  ],
  s0007: [
    'When Zhuang visited Mount Tu and composed poetry, he set Fei a topic; Fei took up the brush and finished at once.',
    'When Zhuang toured Mount Tu and wrote verse, he gave Fei the theme; Fei took brush and finished on the spot.',
  ],
  s0008: [
    'Prince Jing of Langye, Wang Jingwen, said to Zhuang: "Your worthy son deserves the name wonder child; he will be a singular talent yet to come.',
    'Prince Jing of Langye, Wang Jingwen, told Zhuang, "Your worthy son may be called a wonder child—a singular talent still to come.',
  ],
  s0009: [
    '" Zhuang laughed, stroked Fei\'s back, and said: "Truly the thousand gold of our house."',
    '" Zhuang laughed, stroked Fei\'s back, and said, "Truly the thousand gold of our house."',
  ],
  s0010: [
    'Emperor Xiaowu toured Gudu; he ordered Zhuang to bring Fei in the entourage and commanded him to compose "Ode on the Cave Well," which he presented in the assembly.',
    'Emperor Xiaowu toured Gudu, ordered Zhuang to bring Fei in the train, and commanded an "Ode on the Cave Well," which Fei presented in the hall.',
  ],
  s0011: [
    'The emperor said, "Small though he is, a wonder child."',
    'The emperor said, "Small as he is, a wonder child."',
  ],
  s0012: [
    'He began office as Acting Staff Officer in the Pacifying Army, moved to Crown Prince Attendant, and left office on his father\'s mourning.',
    'He began as pacifying-army acting staff officer, became crown prince attendant, and left office for his father\'s mourning.',
  ],
  s0013: [
    'When mourning ended he again became attendant, served as Palace Secretariat Gentleman and chief of staff to Guard General Yuan Can.',
    'When mourning ended he was again attendant, then palace secretariat gentleman and chief of staff to guard general Yuan Can.',
  ],
  s0014: [
    'Can was stern and sparing with guests; men of the time compared him to Li Ying.',
    'Can was austere and rarely received guests; contemporaries likened him to Li Ying.',
  ],
  s0015: [
    'After Fei\'s audience withdrew, Can said, "Commander Xie does not die."',
    'When Fei\'s visit ended, Can said, "Commander Xie is not dead."',
  ],
  s0016: [
    'Soon he was promoted to Attendant and Yellow Gate Gentleman.',
    'Soon he rose to attendant and yellow gate gentleman.',
  ],
  s0017: [
    'He went out as Interior Magistrate of Linchuan; accused of bribery, the case reached Yuan Can, who suppressed it.',
    'He went out as Linchuan interior magistrate; bribery charges reached Yuan Can, who buried the case.',
  ],
  s0018: [
    'Qi Emperor Gao, as Rapid Cavalry General assisting government, chose Fei as chief of staff and ordered him with Chu Xuan of Henan, Jiang Jiao of Jiyang, and Liu Hou of Pengcheng to attend the Song emperor—they were called the Son of Heaven\'s Four Friends.',
    'Qi Emperor Gao, as regent rapid-cavalry general, made Fei his chief of staff and sent him with Chu Xuan of Henan, Jiang Jiao of Jiyang, and Liu Hou of Pengcheng to attend the Song emperor—men called them the Son of Heaven\'s Four Friends.',
  ],
  s0019: [
    'He was further made Attendant-in-Ordinary, jointly managing the edicts of the Secretariat and Scattered Cavalry bureaus.',
    'He was further made attendant-in-ordinary and jointly managed secretariat and scattered-cavalry edicts.',
  ],
  s0020: [
    'When Gao advanced to Grand Marshal, he again made Fei chief of staff with concurrent Southern Donghai prefect.',
    'When Gao became grand marshal, he again made Fei chief of staff with Southern Donghai prefect in addition.',
  ],
  s0021: [
    'Gao was plotting to seize the throne and sought ministers who would aid the mandate; because Fei had great renown, he deeply admired and relied on him.',
    'Gao was plotting the abdication and wanted ministers to crown the change; Fei\'s great name made Gao admire and lean on him.',
  ],
  s0022: [
    'Discussing Wei and Jin precedents, he said: "When Jin changed the mandate the signs were long visible; Shi Bao did not early urge Wen of Jin—he only wailed at death. Compared to Feng Yi, that is not knowing the moment.',
    'Discussing Wei and Jin precedents, he said, "When Jin took the mandate the omen was old; Shi Bao did not urge Wen of Jin in time—he wept only at death. Set beside Feng Yi, that is not reading the hour.',
  ],
  s0023: [
    '" Fei answered: "Of old among Wei ministers some urged Martial Emperor of Wei to take the throne; Martial Emperor said, \'If heaven would use me, would I not be like King Wen of Zhou!',
    '" Fei answered, "Of old a Wei minister urged Martial Emperor of Wei to take the throne; Martial Emperor said, \'If Heaven would use me, would I not be King Wen of Zhou!',
  ],
  s0024: [
    '\' Wen of Jin served the house of Wei and was bound to die facing north;',
    '\' Wen of Jin served the house of Wei and was bound to end his days facing north;',
  ],
  s0025: [
    'had Wei early followed the model of Yao and Shun, he would still have thrice yielded to the highest degree.',
    'had Wei early followed Yao and Shun, he would still have yielded three times to the utmost height.',
  ],
  s0026: [
    '" The emperor was displeased.',
    '" The emperor was displeased.',
  ],
  s0027: [
    'He brought in Wang Jian as left chief of staff and kept Fei as attendant-in-ordinary with charge of the Imperial Library.',
    'He brought in Wang Jian as left chief of staff and kept Fei as attendant-in-ordinary directing the imperial library.',
  ],
  s0028: [
    'When Qi received the abdication, Fei was on duty that day; all officials took their places; the attendant-in-ordinary should unseal the imperial seal. Fei pretended not to know and said, "What business is there?',
    'When Qi received the abdication, Fei was on duty; the hundred officials took their stations; the attendant-in-ordinary should unseal the seal. Fei played ignorant and said, "What business is there?',
  ],
  s0029: [
    '" The relay edict said, "Unseal and transfer to the King of Qi.',
    '" The relay edict said, "Unseal and hand it to the King of Qi.',
  ],
  s0030: [
    '" Fei said, "Qi surely has its own attendant-in-ordinary.',
    '" Fei said, "Qi ought to have its own attendant-in-ordinary.',
  ],
  s0031: [
    '" He took a pillow and lay down.',
    '" He fetched a pillow and lay down.',
  ],
  s0032: [
    'The relay messenger was afraid; they had him feign illness to fetch a substitute.',
    'The relay messenger panicked and had him claim illness to bring in a stand-in.',
  ],
  s0033: [
    'Fei said, "I have no illness; what is there to say?',
    'Fei said, "I am not ill; what is there to report?',
  ],
  s0034: [
    '" He put on court dress, walked out the eastern side gate, got a carriage, and returned home.',
    '" He dressed in court robes, walked out the eastern side gate, found a carriage, and went home.',
  ],
  s0035: [
    'That day Wang Jian was made attendant-in-ordinary to unseal the seal.',
    'That day Wang Jian was made attendant-in-ordinary to unseal the seal.',
  ],
  s0036: [
    'Soon Emperor Wu of Qi spoke to Gao, asking to execute Fei.',
    'Soon Emperor Wu of Qi spoke to Gao and asked to kill Fei.',
  ],
  s0037: [
    'Gao said, "Kill him and his name is made; better to tolerate him beyond the pale."',
    'Gao said, "Kill him and you make his name; better to spare him beyond the pale."',
  ],
  s0038: [
    'He was dismissed and kept at home.',
    'He was dismissed and kept at home.',
  ],
  s0039: [
    'In the first year of Yongming he began as Regular Palace Attendant-in-Ordinary, rose through offices to Attendant-in-Ordinary with charge as National University Erudite.',
    'In Yongming\'s first year he began as regular palace attendant-in-ordinary, rose to attendant-in-ordinary, and led the national university as erudite.',
  ],
  s0040: [
    'In the fifth year he went out as Champion General and Yixing prefect, with rank of middle two thousand bushels.',
    'In the fifth year he went out as champion general and Yixing prefect with middle two-thousand-bushel rank.',
  ],
  s0041: [
    'In the commandery he did not oversee miscellaneous affairs, giving all to the clerks, and said, "I cannot be the clerk who runs things; I can only be the prefect."',
    'In the commandery he ignored routine business and gave it all to clerks, saying, "I cannot be the clerk in charge—I can only be the prefect."',
  ],
  s0042: [
    'After three years in office he was recalled as Director of the Court Offices and Palace Secretariat Director.',
    'After three years he was recalled as director of the court offices and palace secretariat director.',
  ],
  s0043: [
    'In the first year of Longchang he was again Attendant-in-Ordinary, leading tutor to the Prince of Xin\'an.',
    'In Longchang\'s first year he was again attendant-in-ordinary, leading tutor to the prince of Xin\'an.',
  ],
  s0044: [
    'Before taking the appointment he firmly sought to go out on assignment.',
    'Before investiture he begged hard to go out on assignment.',
  ],
  s0045: [
    'He was still made General Who Punishes Barbarians and Wu-xing prefect; on summons he took office at once.',
    'He was still made general who punishes barbarians and Wu-xing prefect; summoned, he took office at once.',
  ],
  s0046: [
    'Mingdi was then plotting succession to the throne; old ministers of the court were all drawn into counsel.',
    'Mingdi was then plotting to enter the succession; old courtiers were all drawn into counsel.',
  ],
  s0047: [
    'Fei inwardly sought sufficiency and truly wished to avoid affairs.',
    'Fei inwardly sought enough and truly meant to avoid affairs.',
  ],
  s0048: [
    'His brother Yin was then Director of the Ministry of Personnel.',
    'His brother Yin was then director of the ministry of personnel.',
  ],
  s0049: [
    'Arriving at the commandery, he sent Yin several piculs of wine with a letter that said, "Drink this with all your strength; do not meddle in human affairs."',
    'At the commandery he sent Yin several piculs of wine with a letter: "Drink this hard; keep out of men\'s business."',
  ],
  s0050: [
    'In the commandery Fei rarely governed yet constantly pursued levies; many criticized him, and he did not care.',
    'In the commandery Fei seldom governed yet always gathered revenue; many mocked him, and he did not care.',
  ],
  s0051: [
    'In the fourth year of Jianwu an edict summoned him as Attendant-in-Ordinary and Palace Secretariat Director; he submitted a memorial refusing the summons.',
    'In Jianwu\'s fourth year an edict summoned him as attendant-in-ordinary and palace secretariat director; he memorialized and refused.',
  ],
  s0052: [
    'He sent his sons back to the capital but stayed alone with his mother, building a house west of the commandery seat.',
    'He sent his sons to the capital, stayed alone with his mother, and built a house west of the commandery wall.',
  ],
  s0053: [
    'Mingdi issued an edict: "One who stands apart from glory views the world from afar;',
    'Mingdi issued an edict: "To stand beyond glory is to see the world from far off;',
  ],
  s0054: [
    'one who treads the hermit\'s path is rarely met in full flower.',
    'to walk the hermit\'s way is to bloom in solitude.',
  ],
  s0055: [
    'Hence Chang Fu\'s long bow to the Chu minister won praise in the southern states;',
    'hence the long bow of the Chu minister won praise in the southern states;',
  ],
  s0056: [
    'the Han worthy\'s high refusal won honor from fine historians.',
    'the Han worthy\'s lofty refusal won honor from fine historians.',
  ],
  s0057: [
    'The newly appointed Attendant-in-Ordinary and Palace Secretariat Director Fei long bore the court insignia and from youth bore a pure reputation; in court he built merit, going out he made his name heard.',
    'The newly appointed attendant-in-ordinary and palace secretariat director Fei long wore court insignia and from youth bore a clear name; in court he built merit, abroad he made his name heard.',
  ],
  s0058: [
    'Then he gathered his steps from the broad highway and shook the dust from his forest robes, embracing the lingering fragrance of Jiqian and Ying, content in lean exile without regret.',
    'Then he gathered his steps from the broad highway and shook dust from forest robes, keeping the after-scent of Jiqian and Ying, glad in lean exile without regret.',
  ],
  s0059: [
    'Hearing of his deeds one keeps him in honored thought.',
    'Hearing his story, one keeps him in honored thought.',
  ],
  s0060: [
    'He should receive added courtesy to mark his plain integrity.',
    'Let added courtesy mark his plain integrity.',
  ],
  s0061: [
    'Grant bed curtains and padded mats, salary at minister rank, always provided at his dwelling."',
    'Grant bed curtains and padded mats, salary at minister rank, always sent to his dwelling."',
  ],
  s0062: [
    'At that time National University Chancellor He Yin of Lujiang also submitted a memorial to return to Kuaiji.',
    'At that time national university chancellor He Yin of Lujiang also memorialized to return to Kuaiji.',
  ],
  s0063: [
    'In the second year of Yongyuan an edict summoned Fei as Regular Palace Attendant-in-Ordinary and Imperial Library Director, and Yin as Regular Palace Attendant-in-Ordinary and Grand Minister of Ceremonies—neither yielded.',
    'In Yongyuan\'s second year an edict summoned Fei as regular palace attendant-in-ordinary and imperial library director, and Yin as regular palace attendant-in-ordinary and grand minister of ceremonies—neither came.',
  ],
  s0064: [
    'In the third year another edict summoned Fei as Attendant-in-Ordinary and Junior Tutor to the Crown Prince, and Yin as Regular Palace Attendant-in-Ordinary and Crown Prince Household Superintendent.',
    'In the third year another edict summoned Fei as attendant-in-ordinary and junior tutor to the crown prince, and Yin as regular palace attendant-in-ordinary and crown prince household superintendent.',
  ],
  s0065: [
    'By then Emperor Donghun was under house arrest at the palace; messengers were sent to hurry them, but the righteous army was already near, so neither could be fetched.',
    'By then Emperor Donghun was confined at the palace; messengers were sent to hurry them, but the righteous army was already near, so neither was reached.',
  ],
  s0066: [
    'When Gaozu pacified the capital and advanced to Chancellor of State, he memorialized requesting Fei and Yin, saying: "When poor, one keeps to oneself; when risen, one aids all.',
    'When Gaozu pacified the capital and advanced to chancellor of state, he memorialized for Fei and Yin, saying, "In want one keeps to oneself; risen, one aids all.',
  ],
  s0067: [
    'Though the way of going out and staying in differs in measure, timing decides employment, and the wise tread accordingly.',
    'Though the way of going out and staying in differs in measure, use and refusal follow the hour, and the wise tread it.',
  ],
  s0068: [
    'The former newly appointed Attendant-in-Ordinary and Junior Tutor to the Crown Prince Fei, and the former newly appointed Regular Palace Attendant-in-Ordinary, Crown Prince Household Superintendent, and Marquis of Duting Yin—both are feathered scions of noble houses, emblem bearers of the crown, their conduct and fame a balm to refined custom.',
    'The former newly appointed attendant-in-ordinary and junior tutor to the crown prince Fei, and the former newly appointed regular palace attendant-in-ordinary, crown prince household superintendent, and marquis of Duting Yin—feathered heirs of noble lines, emblem bearers of the crown, conduct and fame a balm to refined custom.',
  ],
  s0069: [
    'In former days at court they were without appetite for office; guests were few and grandees rarely met; their rank sashes were not yet removed when the dust of turmoil brushed them off.',
    'In former days at court they had no taste for office; guests were few and grandees rarely met; rank sashes were not yet off when turmoil\'s dust brushed them away.',
  ],
  s0070: [
    'One was master of the Confucian grove;',
    'One was master of the Confucian grove;',
  ],
  s0071: [
    'the other combined elegant rule with refined judgment.',
    'the other combined elegant rule with refined judgment.',
  ],
  s0072: [
    'Each saw deep and judged early, foresaw the sprouting chaos, knew vulgar quality at first glance, and knew there was nothing to pass on to heirs.',
    'Each saw deep and judged early, foresaw chaos sprouting, knew vulgar quality at first glance, and knew there was nothing to pass to heirs.',
  ],
  s0073: [
    'They shook out their robes on the eastern hills and cut the dust from their tracks.',
    'They shook out robes on the eastern hills and cut dust from their tracks.',
  ],
  s0074: [
    'Though they surrendered their seals in a prosperous age, they truly fled a benighted time.',
    'Though they surrendered seals in a prosperous age, they truly fled a benighted time.',
  ],
  s0075: [
    'Families that ate from the tripod yet savored oak and mugwort;',
    'Families that ate from the tripod yet savored oak and mugwort;',
  ],
  s0076: [
    'lineages that inherited purple and blue yet rested easy as hanging quail.',
    'lineages that inherited purple and blue yet rested easy as hanging quail.',
  ],
  s0077: [
    'Since the shallow wind first stirred, the south became custom; the pure current and plain track still had much force left.',
    'Since the shallow wind first stirred, the south became custom; the pure current and plain track still had force left.',
  ],
  s0078: [
    'Who stirs against greed—the merit returns to the Way; who revives custom and lifts the people makes court and countryside one.',
    'Who stirs against greed—the merit returns to the Way; who revives custom and lifts the people makes court and countryside one.',
  ],
  s0079: [
    'Though they dwelt by rivers and sea, their merit matched the Wei audience hall.',
    'Though they dwelt by rivers and sea, their merit matched the Wei audience hall.',
  ],
  s0080: [
    'Now the great fortune is just opening; to be poor and low is shame;',
    'Now the great fortune is just opening; to be poor and low is shame;',
  ],
  s0081: [
    'how much more those who long harbored jade and ritual vessels, who for a time loathed the Bright Hall—can they seek their will at the sea\'s edge and forever chase Master Chizi?',
    'how much more those who long harbored jade and ritual vessels, who for a time loathed the Bright Hall—can they seek their will at the sea\'s edge and forever chase Master Chizi?',
  ],
  s0082: [
    'Your servant bears a singular burden and shares in the myriad affairs of state; he truly relies on many talents to raise the roof beam together.',
    'Your servant bears a singular burden and shares in the myriad affairs of state; he truly relies on many talents to raise the roof beam together.',
  ],
  s0083: [
    'He wishes to draw from the clear spring and take the still water as mirror.',
    'He wishes to draw from the clear spring and take still water as mirror.',
  ],
  s0084: [
    'He wishes to bend them to the first rank among his staff, to consult morning and evening, that they may help spread his thin virtue and shape the kingly measure.',
    'He wishes to bend them to the first rank among his staff, to consult morning and evening, that they may help spread his thin virtue and shape the kingly measure.',
  ],
  s0085: [
    'Request that both be appointed military affairs adviser and libation officer in your servant\'s chancellery, with Fei additionally made Rear General."',
    'Request that both be appointed military affairs adviser and libation officer in your servant\'s chancellery, with Fei additionally made rear general."',
  ],
  s0086: [
    'Neither came.',
    'Neither came.',
  ],
  s0087: [
    'When Gaozu took the throne, Fei was summoned as Attendant-in-Ordinary, Left Grand Master of Splendid Happiness, and Bearer of the Golden Halberd with Protocol Equal to the Three Excellencies; Yin was summoned as Regular Palace Attendant-in-Ordinary, Special Grandee, and Right Grand Master of Splendid Happiness—they again both refused.',
    'When Gaozu took the throne, Fei was summoned as attendant-in-ordinary, left grand master of splendid happiness, and bearer of the golden halberd with protocol equal to the three excellencies; Yin as regular palace attendant-in-ordinary, special grandee, and right grand master of splendid happiness—they again both refused.',
  ],
  s0088: [
    'A messenger from the palace guard staff officer Wang Guo was again sent to convey the edict with earnest persuasion.',
    'Palace guard staff officer Wang Guo was again sent to convey the edict with earnest persuasion.',
  ],
  s0089: [
    'The next year in the sixth month Fei took a light boat and came to the palace to report in person.',
    'The next year, in the sixth month, Fei took a light boat and came to the palace to report in person.',
  ],
  s0090: [
    'On arrival an edict made him Attendant-in-Ordinary, Grand Marshal, and Director of the Masters of Writing.',
    'On arrival an edict made him attendant-in-ordinary, grand marshal, and director of the masters of writing.',
  ],
  s0091: [
    'Fei pleaded that leg ailment prevented kneeling in audience; he wore kerchief and shoulder carriage and came to Cloud Dragon Gate to give thanks.',
    'Fei pleaded leg ailment and could not kneel in audience; he wore kerchief and rode a shoulder carriage to Cloud Dragon Gate to give thanks.',
  ],
  s0092: [
    'An edict received him in Hualin Garden; he sat in a small carriage at the mat.',
    'An edict received him in Hualin Garden; he sat in a small carriage at the mat.',
  ],
  s0093: [
    'Next morning the imperial carriage went out to visit Fei\'s house; they feasted and talked in full joy.',
    'Next morning the imperial carriage visited Fei\'s house; they feasted and talked in full joy.',
  ],
  s0094: [
    'Fei firmly stated his original intent; the emperor would not allow it;',
    'Fei firmly stated his original intent; the emperor would not allow it;',
  ],
  s0095: [
    'he then asked to go east himself to fetch his mother, and permission was granted.',
    'he then asked to go east himself to fetch his mother, and permission was granted.',
  ],
  s0096: [
    'On the eve of departure the imperial carriage again came to visit, composing poetry to see him off.',
    'On the eve of departure the imperial carriage again visited, composing poetry to see him off.',
  ],
  s0097: [
    'Court envoys went out and escorted him back—one party\'s procession met the other\'s on the road.',
    'Court envoys went out and escorted him back—processions met on the road.',
  ],
  s0098: [
    'On reaching the capital, an order had the materiel office raise a mansion at his old residence; the emperor came to the front hall and sent an usher to the mansion to invest him with office; an edict suspended all public business and the new-moon and full-moon audiences.',
    'On reaching the capital, an order had the materiel office raise a mansion at his old residence; the emperor came to the front hall and sent an usher to the mansion to invest him; an edict suspended all public business and new-moon and full-moon audiences.',
  ],
  s0099: [
    'His son Xuan rose to Right Chief of Staff of the Grand Marshal; he was dismissed from office for killing an ox and died at home.',
    'His son Xuan rose to right chief of staff of the grand marshal; dismissed for killing an ox, he died at home.',
  ],
  s0100: [
    'His second son Sao had considerable literary talent, served to Jin\'an prefect, and died in office.',
    'His second son Sao had considerable literary gift, served to Jin\'an prefect, and died in office.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_015_b1.mjs <translation.json>'
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
