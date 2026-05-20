#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'Yin opened the case: inside was the *Treatise on the Great Majestic*, not yet known in the world.',
    'Yin opened the box and found the *Treatise on the Great Majestic*—unknown anywhere in the world.',
  ],
  s0202: [
    'They also set up a pearl pillar in the temple; for seven days and nights it shone, and Governor He Yuan reported the matter in a memorial.',
    'A pearl pillar was raised in the temple and glowed seven days and nights; Governor He Yuan memorialized the court.',
  ],
  s0203: [
    'Crown Prince Zhaoming admired his virtue and sent Gentleman of the Household He Sicheng with a personal letter of praise.',
    'Crown Prince Zhaoming, honoring his virtue, sent He Sicheng with a handwritten commendation.',
  ],
  s0204: [
    'In the third year of Zhongdatong he died, aged eighty-six.',
    'He died in the third year of Zhongdatong, at eighty-six.',
  ],
  s0205: [
    'Earlier, when Yin fell ill, his wife Lady Jiang dreamed that a spirit told her: "Your husband\'s allotted span is finished.',
    'Before his death, while Yin was ill, Lady Jiang dreamed a spirit say, "Your husband\'s life is spent.',
  ],
  s0206: [
    'Because he has reached virtue, he should receive an extension; you must take his place."',
    'His virtue merits a reprieve—you must die in his stead."',
  ],
  s0207: [
    'The wife woke and told him; soon she fell ill and died, and Yin\'s sickness was cured.',
    'She told him on waking; soon she sickened and died, and Yin recovered.',
  ],
  s0208: [
    'By then Yin dreamed a goddess with some eighty attendants, all in headcloths, marching in ranks to his bed and bowing together; waking, he saw them again and ordered funeral goods prepared.',
    'Then he dreamed a goddess and eighty attendants in headcloths, ranked before his bed and bowing; waking he saw them again and ordered his coffin made.',
  ],
  s0209: [
    'Soon his illness worsened and he could no longer care for himself.',
    'His illness soon worsened beyond his power to tend it.',
  ],
  s0210: [
    'Yin annotated the *Hundred Dharmas Treatise* and the *Twelve Gates Treatise*, one scroll each; annotated the *Book of Changes* in ten scrolls, the *General Collection of the Mao Odes* in six, the *Hidden Meanings of the Mao Odes* in ten, the *Hidden Meanings of the Book of Rites* in twenty, and *Ritual Questions Answered* in fifty-five.',
    'He wrote commentaries: one scroll each on the *Hundred Dharmas* and *Twelve Gates*; ten on the *Changes*; six on the Mao odes; ten on their hidden meanings; twenty on ritual hidden meanings; fifty-five of ritual Q and A.',
  ],
  s0211: [
    'His son Zhuan also refused office; Prince of Luling summoned him as chief clerk, but he did not accept.',
    'His son Zhuan would not serve either; the Prince of Luling made him chief clerk, and he declined.',
  ],
  s0212: [
    'Ruan Xiaoxu',
    'Ruan Xiaoxu',
  ],
  s0213: [
    'Ruan Xiaoxu, styled Shizong, was a man of Wei county in Chenliu.',
    'Ruan Xiaoxu, styled Shizong, came from Wei in Chenliu.',
  ],
  s0214: [
    'His father Yanzhi was attendant gentleman in the Song Grand Marshal\'s office.',
    'His father Yanzhi served as attendant gentleman to the Song Grand Marshal.',
  ],
  s0215: [
    'At seven, Xiaoxu was given in adoption to his father\'s cousin Yinzhi.',
    'At seven he was adopted by his father\'s cousin Yinzhi.',
  ],
  s0216: [
    'When Yinzhi\'s mother Lady Zhou died, more than a million in legacy property should have gone to Xiaoxu; he accepted none of it and gave all to Yinzhi\'s sister, mother of Wang Yan of Langya—all who heard it sighed in wonder.',
    'When Yinzhi\'s mother died, a million-plus legacy was Xiaoxu\'s by right; he took nothing and gave all to Yinzhi\'s sister, Wang Yan\'s mother—hearers marveled.',
  ],
  s0217: [
    'From childhood he was utmost in filial piety and quiet by nature; even playing with other children, he always took delight in digging ponds and piling hills.',
    'Filial and withdrawn from childhood, he played only at digging ponds and building miniature mountains.',
  ],
  s0218: [
    'At thirteen he had mastered the Five Classics throughout.',
    'At thirteen he had read through the Five Classics.',
  ],
  s0219: [
    'At fifteen, capped, he was presented to his father; Yanzhi admonished him: "Three times capped, ever more honored—this is the beginning of human relations.',
    'Capped at fifteen and presented to his father, Yanzhi warned him: "Three investitures, growing honor—that is where human duty begins.',
  ],
  s0220: [
    'You should strive to strengthen yourself to shelter your own person."',
    'Strive to brace yourself and shelter your own life."',
  ],
  s0221: [
    'He answered: "I wish to follow Master Zi on the eastern sea and Xu You in the deep valley, hoping to keep my life short and escape the dust of the world."',
    'He answered, "I would trace Master Zi on the eastern sea and Xu You in the deep valley, keep my life brief, and slip the world\'s dust."',
  ],
  s0222: [
    'From then on he shut himself in one room and would not step outside except for the fixed visits to his parents; the household scarcely saw his face, and kin and friends therefore called him "the Recluse."',
    'He shut himself in one room, leaving only for obligatory visits to his parents; kin called him "the Recluse," for none saw his face.',
  ],
  s0223: [
    'His cousin by marriage Wang Yan was powerful and visited his gate again and again; Xiaoxu gauged that Yan would surely fall and constantly hid himself, refusing to meet him.',
    'His cousin Wang Yan, risen high, came often; Xiaoxu foresaw his ruin and hid, refusing every meeting.',
  ],
  s0224: [
    'Once he ate a tasty sauce; asked where it came from, he was told the Wang household had sent it, and he vomited the meal and overturned the relish.',
    'He once ate a fine sauce; learning it came from the Wangs, he vomited his meal and dashed the dish aside.',
  ],
  s0225: [
    'When Yan was executed, his kinsmen were all afraid for themselves; Xiaoxu said, "Love kin but do not take their party—why should guilt reach me?"',
    'At Yan\'s execution his kin trembled; Xiaoxu said, "One may love kin without siding with them—why would I be punished?"',
  ],
  s0226: [
    'In the end he was spared.',
    'He was spared after all.',
  ],
  s0227: [
    'When the righteous army besieged the capital, the household was too poor to cook; a servant secretly took a neighbor\'s firewood to keep the fire going.',
    'As the righteous army besieged the capital, they were too poor to cook; a servant stole a neighbor\'s firewood to feed the hearth.',
  ],
  s0228: [
    'When Xiaoxu learned of it, he would not eat and had them pull down the house to burn for fuel.',
    'Learning this, he refused food and had them dismantle the house for firewood.',
  ],
  s0229: [
    'The room he lived in held only a deer-hide couch, ringed by bamboo and trees.',
    'He lived in a room with only a deer-hide couch, surrounded by bamboo and trees.',
  ],
  s0230: [
    'Early in Tianjian, Imperial Censor Ren Fang sought his elder brother Lüzhi and wished to visit but did not dare; gazing from afar he sighed, "The house is near, yet the man is far."',
    'Early Tianjian, censor Ren Fang sought his brother Lüzhi, wanting to visit yet afraid; he sighed from afar, "Near the house, far the man."',
  ],
  s0231: [
    'Thus was he honored by the famous.',
    'So the famous honored him.',
  ],
  s0232: [
    'In the twelfth year he and Fan Yuanyan of Wu commandery were both summoned, and neither came.',
    'In year twelve he and Fan Yuanyan of Wu were summoned together; neither came.',
  ],
  s0233: [
    'Yuan Jun of Chen commandery said to him, "Formerly, when Heaven and Earth were shut, worthies hid;',
    'Yuan Jun of Chen said to him, "Once Heaven and Earth were closed and worthies hid;',
  ],
  s0234: [
    'today the age\'s road is clear—yet you still withdraw. Is that fitting?"',
    'now the way is open—yet you still flee. How can that be right?"',
  ],
  s0235: [
    'He answered, "Of old, though Zhou virtue was rising, Boyi and Shuqi did not weary of fern and bracken;',
    'He answered, "Though Zhou\'s virtue was rising, Boyi and Shuqi still lived on ferns;',
  ],
  s0236: [
    'when Han\'s way was at its height, Huang and Qi were not troubled in mountain and forest.',
    'when Han flourished, Huang and Qi were untroubled in the hills."',
  ],
  s0237: [
    'To practice benevolence lies with oneself—what has it to do with the world of men!"',
    'Benevolence is one\'s own affair—what has it to do with the age!"',
  ],
  s0238: [
    'Besides, am I of the sort of those worthies of old?"',
    'And am I their kind of man?"',
  ],
  s0239: [
    'Later, while listening to lectures on Zhongshan, his mother Lady Wang suddenly fell ill; his brothers wished to summon him.',
    'Later, lecturing on Zhongshan, he heard his mother was ill; his brothers meant to call him home.',
  ],
  s0240: [
    'His mother said, "Xiaoxu\'s nature is utmost filial and joins with the unseen—he will surely come of himself."',
    'His mother said, "Xiaoxu\'s filial nature pierces the unseen—he will come on his own."',
  ],
  s0241: [
    'Sure enough his heart leapt and he returned; neighbors sighed in wonder.',
    'His heart indeed started and he returned; neighbors marveled.',
  ],
  s0242: [
    'To compound medicine they needed fresh ginseng; tradition said it grew on Zhongshan, and Xiaoxu himself traversed dangerous ravines for many days without finding any.',
    'The prescription needed fresh ginseng, said to grow on Zhongshan; he searched the wild ravines for days without success.',
  ],
  s0243: [
    'Suddenly he saw a deer go ahead; moved, he followed, and where it vanished he looked and indeed found the herb.',
    'A deer appeared; he followed it in wonder, and where it vanished he found the plant.',
  ],
  s0244: [
    'His mother took it and was cured.',
    'His mother took it and recovered.',
  ],
  s0245: [
    'All then praised this as the fruit of filial feeling.',
    'All said filial feeling had wrought it.',
  ],
  s0246: [
    'At the time the skilled diviner Zhang Youdao said to Xiaoxu, "I see you hide your tracks yet your heart is hard to read; unless we test by tortoise and yarrow, there is no proof."',
    'The diviner Zhang Youdao told him, "You hide your tracks and your heart is obscure; only tortoise and yarrow can test you."',
  ],
  s0247: [
    'When the hexagram was cast and five lines had been counted, he said, "This will become *Influence*—the hexagram of responsive feeling, not an omen of noble withdrawal."',
    'Casting the lines, he stopped at five and said, "This becomes *Influence*—responsive feeling, not noble retreat."',
  ],
  s0248: [
    'Xiaoxu said, "How do you know the next line will not be the top nine?"',
    'Xiaoxu said, "Who says the next line is not top nine?"',
  ],
  s0249: [
    'It indeed became the hexagram *Retreat*.',
    'It became *Retreat*.',
  ],
  s0250: [
    'Youdao sighed and said, "This is \'Fat retreat—nothing unfavorable.\'"',
    'Youdao sighed, "This is \'Fat retreat—nothing unfavorable.\'"',
  ],
  s0251: [
    '" The image truly answers to virtue; heart and track are one."',
    '" Image and virtue match; heart and trail are one."',
  ],
  s0252: [
    'Xiaoxu said, "Though I receive *Retreat*, the top nine line does not stir—the way of ascending afar must soon make me take leave of Master Xu\'s sort."',
    'Xiaoxu said, "Though I get *Retreat*, top nine never stirs—the high path of withdrawal will soon make me quit Xu You\'s company."',
  ],
  s0253: [
    'He then wrote the *Record of High Reclusion*, from the Flame and Yellow emperors down to the end of Tianjian, weighing and dividing them into three grades, altogether several tens of scrolls.',
    'He wrote the *Record of High Reclusion* from Yan and Huang to Tianjian\'s end, sorted into three grades in several tens of scrolls.',
  ],
  s0254: [
    'He also wrote a treatise saying, "The root of the utmost Way lies in nonaction;',
    'He argued in a treatise: "The utmost Way\'s root is nonaction;',
  ],
  s0255: [
    'the traces of the sage remain in rescuing what is broken.',
    'the sage\'s traces remain in rescuing decay."',
  ],
  s0256: [
    'When decay is rescued by traces, the use of traces conflicts with the root; since the root is nonaction, action is not the fullness of the Way.',
    'Rescuing decay needs traces, yet traces war with the root; the root is nonaction, so action is not the Way\'s fullness.',
  ],
  s0257: [
    'Yet if traces are not let fall, the world has no means to be set level;',
    'Yet without traces the world cannot be leveled;',
  ],
  s0258: [
    'if the root is not pursued, the Way in truth is lost in crossing.',
    'without pursuing the root, the Way itself is lost in the crossing."',
  ],
  s0259: [
    'Confucius and the Duke of Zhou wished to preserve their traces, and so should for a time hide their root;',
    'Confucius and the Duke of Zhou kept their traces and rightly veiled their root for a time;',
  ],
  s0260: [
    'Laozi and Zhuangzi only clarified their root, and so should deeply restrain their traces.',
    'Laozi and Zhuangzi clarified the root and rightly pressed their traces down."',
  ],
  s0261: [
    'Since traces can be restrained, those several masters therefore have surplus;',
    'Traces can be restrained, so those masters have something left over;',
  ],
  s0262: [
    'since the root was hidden, Confucius therefore falls short.',
    'the root was hidden, so Confucius falls short."',
  ],
  s0263: [
    'Those who attain only one side lack that bright wisdom;',
    'Men of one side lack that bright wisdom;',
  ],
  s0264: [
    'those who embody both alone hold the mirror of discernment.',
    'those who hold both carry the mirror of insight."',
  ],
  s0265: [
    'Yet the sage had already reached utmost illumination and in turn created his traces;',
    'Yet the sage, already utmost in light, still made traces;',
  ],
  s0266: [
    'the worthy had not yet taken the chief seat and again spoke of the root.',
    'the worthy, not yet chief, again spoke of the root."',
  ],
  s0267: [
    'Truly because traces must rescue the age, it is not for any but a sage;',
    'Traces must save the age—only a sage can;',
  ],
  s0268: [
    'the root in truth clarifies principle, and in the worthy it can shine.',
    'the root clarifies principle—in the worthy it can shine."',
  ],
  s0269: [
    'If one can embody this root and these traces and awaken to that restraint and that display, then the intent of Confucius and Zhuangzi is more than half grasped."',
    'Grasp root and trace, their restraint and display, and you hold more than half of Confucius and Zhuangzi."',
  ],
  s0270: [
    'Prince Yuanxiang of Nanping heard his name and sent a letter summoning him; he did not go.',
    'Prince Yuanxiang of Nanping summoned him by letter; he would not go.',
  ],
  s0271: [
    'Xiaoxu said, "It is not that my will is proud of wealth and rank, but that my nature fears the temple hall.',
    'He said, "I do not scorn wealth, but I fear the court.',
  ],
  s0272: [
    'If deer and roebuck could draw the chariot, how would that differ from matchless steeds?"',
    'If deer and roebuck could be harnessed, how would that differ from thoroughbreds?"',
  ],
  s0273: [
    'Early on, at the end of Jianwu, the east gate of Qingxi Palace collapsed for no reason, and a great wind uprooted the poplars outside the Eastern Palace gate.',
    'Late Jianwu, Qingxi Palace\'s east gate fell without cause, and a great wind uprooted the Eastern Palace poplars.',
  ],
  s0274: [
    'Some asked Xiaoxu about it; Xiaoxu said, "Qingxi is the royal house\'s old dwelling.',
    'Asked about it, Xiaoxu said, "Qingxi was the imperial clan\'s old seat.',
  ],
  s0275: [
    'Qi belonged to the Wood phase; east is Wood\'s position—now the east gate has collapsed of itself: Wood is failing."',
    'Qi ruled by Wood; east is Wood\'s place—the east gate fell by itself: Wood is failing."',
  ],
  s0276: [
    'The princess-consort of Poyang, loyal and fierce, was Xiaoxu\'s elder sister.',
    'His elder sister was princess-consort of Poyang, styled loyal and fierce.',
  ],
  s0277: [
    'The prince once ordered his carriage, wishing to visit and keep his company; Xiaoxu broke through the wall and fled, and in the end would not see him.',
    'The prince once drove out to visit him; Xiaoxu broke through the wall and fled, and never would meet him.',
  ],
  s0278: [
    'When nephews brought yearly gifts, he accepted none.',
    'Nephews\' yearly gifts he refused entirely.',
  ],
  s0279: [
    'Some thought it strange; he answered, "It was never my first wish, and so I do not receive."',
    'Asked why, he said, "It was never what I first wished for, so I will not take it."',
  ],
  s0280: [
    'The stone image he always made offering to had earlier been damaged; he wished to repair it, and after one night it was suddenly whole again—all marveled.',
    'A stone image he worshipped had been damaged; he meant to mend it, and overnight it was whole—everyone marveled.',
  ],
  s0281: [
    'In the second year of Datong he died, aged fifty-eight.',
    'He died in the second year of Datong, at fifty-eight.',
  ],
  s0282: [
    'His disciples eulogized his virtue and conduct; his posthumous title was Recluse Wen Zhen.',
    'Disciples praised his conduct; he was titled Recluse Wen Zhen.',
  ],
  s0283: [
    'His works such as the *Bibliographic Treatise in Seven Categories*, two hundred fifty scrolls in all, circulated in the world.',
    'Works including the *Sevenfold Bibliography*, 250 scrolls in all, circulated in his time.',
  ],
  s0284: [
    'Tao Hongjing',
    'Tao Hongjing',
  ],
  s0285: [
    'Tao Hongjing, styled Tongming, was a man of Moling in Danyang.',
    'Tao Hongjing, styled Tongming, came from Moling in Danyang.',
  ],
  s0286: [
    'At first his mother dreamed a green dragon came forth from her womb, and she also saw two heaven-men bearing censers come to her place; afterward she conceived and bore Hongjing.',
    'His mother dreamed a green dragon left her womb and two celestial men with censers came to her; then she bore Hongjing.',
  ],
  s0287: [
    'In childhood he had an uncommon bent.',
    'As a boy he was unlike others.',
  ],
  s0288: [
    'At ten he obtained Ge Hong\'s *Biographies of Immortals* and studied it day and night, and then had the will to nurture life.',
    'At ten he found Ge Hong\'s *Biographies of Immortals*, studied it day and night, and resolved to seek long life.',
  ],
  s0289: [
    'He told others, "Looking up at blue clouds and gazing at the white sun, I do not feel them far away."',
    'He said, "Raise your eyes to blue clouds and the white sun—they do not seem far."',
  ],
  s0290: [
    'When grown he stood seven feet four inches; his spirit and bearing were bright and elegant, his eyes clear and brows sparse, his form slender and ears long.',
    'Grown, he stood seven feet four; bright of spirit, clear-eyed, sparse-browed, slender, long-eared.',
  ],
  s0291: [
    'He read more than ten thousand scrolls.',
    'He read over ten thousand scrolls.',
  ],
  s0292: [
    'He was skilled at zither and chess and accomplished in draft and clerical script.',
    'He played zither and chess and wrote draft and clerical script well.',
  ],
  s0293: [
    'Before he had capped his years, when Qi Gaodi was prime minister, he was brought in as lecturer to the princes and appointed palace attendant.',
    'Before his capping year, with Qi Gaodi as prime minister, he became princes\' lecturer and palace attendant.',
  ],
  s0294: [
    'Though he was in the vermilion gate, he shut his shadow away and mingled with nothing outside, taking only reading as his task.',
    'Though he lived in the great house, he hid from the world and read without cease.',
  ],
  s0295: [
    'Court ritual and precedent mostly took their decisions from him.',
    'Court ritual mostly followed his judgment.',
  ],
  s0296: [
    'In the tenth year of Yongming he submitted a memorial resigning his salary; the emperor approved and granted him silks.',
    'Yongming year ten he memorialized to resign his stipend; the emperor agreed and gave him silks.',
  ],
  s0297: [
    'When he set out, the court nobles saw him off at the Pacifying-the-Barbarians Pavilion; the feast was very grand, carriages and horses jammed the road—all said that since Song and Qi there had never been such a thing.',
    'At his departure nobles feasted him at the Pacifying-the-Barbarians Pavilion—carriages choked the road; none since Song and Qi had seen the like.',
  ],
  s0298: [
    'Court and countryside honored him.',
    'Court and country honored him.',
  ],
  s0299: [
    'He then stopped on Mt Gouqu in Jurong.',
    'He settled on Mt Gouqu in Jurong.',
  ],
  s0300: [
    'He constantly said, "Below this mountain is the eighth grotto-palace, called the Golden Altar Huayang Heaven, circling one hundred fifty li.',
    'He always said, "Below this mountain lies the eighth grotto-palace—the Golden Altar Huayang Heaven, one hundred fifty li around.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_051_b3.mjs <translation.json>'
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
