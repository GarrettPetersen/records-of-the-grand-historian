#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'In Han times the Three Lord Mao of Xianyang attained the Way and came to govern this mountain; hence it was called Mt Mao.',
    'In Han the Three Mao lords of Xianyang attained the Way and ruled this mountain—hence Mt Mao.',
  ],
  s0302: [
    '" He then built a lodge on Mt Zhong and styled himself the Recluse of Huayang.',
    '" He built a lodge on Mt Zhong and called himself the Recluse of Huayang.',
  ],
  s0303: [
    'At first he received talisman charts and classic methods from Sun Yoyue of Dongyang.',
    'First he studied talismans and charts under Sun Yoyue of Dongyang.',
  ],
  s0304: [
    'He traveled every famous mountain seeking elixirs.',
    'He ranged famous mountains seeking elixirs.',
  ],
  s0305: [
    'Whenever he passed a ravine he would sit or lie within it, chanting and lingering, unable to tear himself away.',
    'At every ravine he sat or lay, chanting and lingering, unable to leave.',
  ],
  s0306: [
    'Shen Yue was then prefect of Dongyang; he honored Hongjing\'s integrity, wrote repeatedly to summon him, but he never came.',
    'Shen Yue, Dongyang prefect, prized his integrity and wrote again and again; Hongjing never came.',
  ],
  s0307: [
    'Hongjing was rounded, tactful, and modest; his comings and goings matched deep design; his mind was like a bright mirror—he grasped things at once, his words never tangled, and he sensed error the moment it appeared.',
    'Rounded and modest, he matched occasion in silence; his mind was a mirror—things cleared at a glance, speech never snarled, fault felt at once.',
  ],
  s0308: [
    'During Jianwu Prince Keng of Yidu was killed by Mingdi; that night Hongjing dreamed Keng taking leave; he inquired into affairs of the nether world, heard many secret marvels, and wrote Dream Records.',
    'In Jianwu Prince Keng of Yidu died by Mingdi\'s hand; that night Hongjing dreamed him farewell, asked of the shades, heard strange secrets, and wrote Dream Records.',
  ],
  s0309: [
    'Early Yongyuan he built a three-story tower: Hongjing lived on top, disciples in the middle, guests below—cut off from the world; only one houseboy waited beside him.',
    'Early Yongyuan he raised a three-story tower—Hongjing above, disciples between, guests below—world cut off; one boy alone served at his side.',
  ],
  s0310: [
    'He especially loved pine wind; whenever he heard it he took joy in it.',
    'He loved pine wind; at its sound he always rejoiced.',
  ],
  s0311: [
    'Sometimes he wandered alone among springs and rocks; those who saw him took him for an immortal.',
    'Sometimes he roamed springs and stone alone; watchers thought him an immortal.',
  ],
  s0312: [
    'By nature he loved writing and prized the strange; he cherished time, and in old age grew only more intense.',
    'He loved to write and prized the strange, hoarded daylight, and in old age grew keener still.',
  ],
  s0313: [
    'He was especially versed in yin-yang and the five phases, wind angles and star reckoning, mountains and rivers, local products on maps, medicine and materia medica.',
    'He excelled at yin-yang and five phases, wind and stars, land and maps, drugs and herbs.',
  ],
  s0314: [
    'He wrote Imperial Eras Chronology and once made an armillary heaven model, saying, "What cultivating the Way requires is not merely for historiographers."',
    'He wrote Imperial Eras Chronology and once built an armillary sphere, saying cultivation needs more than historians use.',
  ],
  s0315: [
    'When the army of righteousness took Jiankang and talk of transfer of the mandate arose, Hongjing drew on prognostic texts—several places formed the character Liang—and had disciples present them.',
    'When the righteous army took Jiankang and abdication was debated, Hongjing cited omens where Liang formed again and again and sent disciples to present them.',
  ],
  s0316: [
    'Gaozu had long been his friend; after enthronement favor deepened, letters unceasing, emissaries in constant view.',
    'Gaozu had known him early; enthroned, his grace deepened—letters without end, coaches in sight.',
  ],
  s0317: [
    'In the fourth year of Tianjian he moved to Golden Accumulation\'s eastern brook.',
    'Tianjian year four he moved to Golden Accumulation\'s eastern stream.',
  ],
  s0318: [
    'Skilled in grain avoidance and guiding exercises; past eighty he still looked robust.',
    'Skilled in fasting and breath guidance; past eighty he still looked hale.',
  ],
  s0319: [
    'He deeply admired Zhang Liang, saying no ancient worthy could match him.',
    'He deeply admired Zhang Liang, saying no sage of old could equal him.',
  ],
  s0320: [
    'Once he dreamed the Buddha gave him a bodhi record, naming him the Bodhisattva Victorious Power.',
    'He once dreamed the Buddha gave him a bodhi record and named him the Bodhisattva Victorious Power.',
  ],
  s0321: [
    'He went to King Asoka\'s tower in Mao county, vowed himself, and received the five great precepts.',
    'He went to King Asoka\'s stupa in Mao, vowed, and took the five great precepts.',
  ],
  s0322: [
    'Later Taizong governed southern Xuzhou, honored his integrity, summoned him to the rear hall, talked for days and sent him away—Taizong greatly respected him.',
    'Later Taizong held southern Xuzhou, prized his character, called him to the rear hall, talked days, and sent him off in deep respect.',
  ],
  s0323: [
    'Early Datong he sent two blades to Gaozu—one named Good Victory, one Achieved Victory—both fine treasures.',
    'Early Datong he presented two swords to Gaozu—Good Victory and Achieved Victory—both prized blades.',
  ],
  s0324: [
    'In the second year of Datong he died, aged eighty-five.',
    'Datong year two he died, at eighty-five.',
  ],
  s0325: [
    'His color did not change; his limbs flexed as before.',
    'His color held; his limbs moved as ever.',
  ],
  s0326: [
    'He was posthumously made Palace Attendant and honored as Master Zhenbai, with a household steward to oversee the funeral.',
    'The court made him palace attendant posthumously, titled Master Zhenbai, and sent a steward to oversee the rites.',
  ],
  s0327: [
    'Hongjing left orders for a modest burial, which his disciples followed.',
    'Hongjing ordered a plain burial; disciples obeyed.',
  ],
  s0328: [
    'Zhuge Ju',
    'Zhuge Ju',
  ],
  s0329: [
    'Zhuge Ju, styled Youmin, was a man of Yangdu in Langye; his family had long lived at Jingkou.',
    'Zhuge Ju, styled Youmin, came from Yangdu in Langye; his clan had long dwelt at Jingkou.',
  ],
  s0330: [
    'As a youth Ju studied under the recluse Guan Kangzhi and ranged widely through classics and history.',
    'Ju as a boy served the recluse Guan Kangzhi and ranged classics and history.',
  ],
  s0331: [
    'He also studied under the recluse Zang Rongxu.',
    'He also studied under the recluse Zang Rongxu.',
  ],
  s0332: [
    'When Rongxu wrote the Jin history he praised Ju\'s contributions to discovery, comparing him to Hu Sui.',
    'Rongxu\'s Jin history credits Ju with uncovering sources and compares him to Hu Sui.',
  ],
  s0333: [
    'Early in Jianwu Jiang Si, acting for southern Xuzhou, recommended Ju to Mingdi: "Ju keeps to poverty and the Way, delights in the Rites and honors the Odes, never calls on a prefect or trails his robe through offices—with such simplicity he could purify custom. I ask he be made aide in the advisory staff."',
    'Early Jianwu Jiang Si of southern Xuzhou told Mingdi: "Ju keeps poverty and the Way, loves Rites and Odes, never visits a magistrate or haunts offices—such withdrawal could purify custom. Make him advisory aide."',
  ],
  s0334: [
    '" The emperor agreed; Ju declined and would not go.',
    '" The emperor assented; Ju refused and stayed away.',
  ],
  s0335: [
    'Xie Tiao of Chen commandery, as prefect of Donghai, issued an edict: "Long ago Sun Qiu of the east bound his sash and lowered the banner of Dragon Hill;',
    'Xie Tiao of Chen, Donghai prefect, wrote: "Once Sun Qiu bound his sash and lowered Dragon Hill\'s banner;',
  ],
  s0336: [
    'Kong Wenju drove north with light carts and won the name of lofty virtue.',
    'Kong Wenju drove north in light carts and won fame for lofty virtue.',
  ],
  s0337: [
    'Thus they stirred the greedy and stiffened the timid, setting the pattern of conduct.',
    'So they stirred the greedy and stiffened the timid, setting conduct for others.',
  ],
  s0338: [
    'The gentleman Zhuge Ju, touched by lofty winds, follows the wheel-tracks of earlier worthies.',
    'Recluse Zhuge Ju, touched by lofty winds, follows earlier worthies\' tracks.',
  ],
  s0339: [
    'Does he hide a pearl in coarse cloth, jade in his breast, waiting for price?',
    'Does he hide pearl in sackcloth, jade in his breast, waiting for price?',
  ],
  s0340: [
    'Or does he go alone in hidden integrity, serving no prince?',
    'Or does he walk alone in hidden integrity, serving no lord?',
  ],
  s0341: [
    'I hear that in serving his mother he is poor as bean-broth, and in supporting her lacks even steamed greens—how can he alone enjoy ten thousand bushels and forget these five pecks?',
    'I hear he serves his mother on bean broth and can barely feed her greens—how enjoy ten thousand bushels and forget five pecks?',
  ],
  s0342: [
    'Let him be given a hundred bushels of grain."',
    'Grant him a hundred bushels of grain."',
  ],
  s0343: [
    '" During Tianjian Prefect Xiao Chen, Inspector An Cheng Prince Xiu, and Prince of Poyang Hui all honored him distinctly.',
    '" Under Tianjian Prefect Xiao Chen, Inspector Prince Xiu of An Cheng, and Prince Hui of Poyang all treated him with special honor.',
  ],
  s0344: [
    'Ju mourned his mother to emaciation; Hui repeatedly sent inquiries of care.',
    'Ju wasted away in mourning his mother; Hui wrote again and again to comfort him.',
  ],
  s0345: [
    'When mourning ended he was nominated as cultivated talent but would not take office.',
    'Mourning done, he was nominated cultivated talent and refused.',
  ],
  s0346: [
    'Ju was diligent in teaching; students came daily, but his house was narrow and could not hold them, so Prefect Zhang You built a lecture hall.',
    'Ju taught tirelessly; students came daily until his house would not hold them, and Prefect Zhang You built a lecture hall.',
  ],
  s0347: [
    'Ju kept himself pure and upright; wife and children never saw pleasure or anger on his face.',
    'Ju was pure in conduct; wife and children never saw joy or anger on his face.',
  ],
  s0348: [
    'Morning and evening he labored without cease in lecture and recitation, and people honored him all the more for it.',
    'Morning and night he lectured without pause, and the world honored him the more.',
  ],
  s0349: [
    'In the seventh year Gaozu ordered the prefect Wang Fen questioned; Fen answered fully as things were, but before Ju could be summoned he died at home that year.',
    'Year seven Gaozu asked Prefect Wang Fen, who told the truth; before Ju could be called he died at home that year.',
  ],
  s0350: [
    'Ju\'s writings filled twenty scrolls; his disciple Liu Xiao collected and recorded them.',
    'His writings ran twenty scrolls; disciple Liu Xiao compiled them.',
  ],
  s0351: [
    'Shen Yan',
    'Shen Yan',
  ],
  s0352: [
    'Shen Yan, styled Chumo, was a man of Wukang in Wuxing.',
    'Shen Yan, styled Chumo, came from Wukang in Wuxing.',
  ],
  s0353: [
    'His father Tanzhi was director of the Ministry of Justice under Qi.',
    'His father Tanzhi was Qi director of the Ministry of Justice.',
  ],
  s0354: [
    'As a boy Yan was quiet and possessed utmost conduct; he admired Huang Shidu and Xu Jizi.',
    'As a boy he was quiet and of utmost conduct, admiring Huang Shidu and Xu Jizi.',
  ],
  s0355: [
    'In reading he did not chase glosses; in writing he did not pursue ornament.',
    'He read without chasing glosses and wrote without chasing ornament.',
  ],
  s0356: [
    'He often sat alone in one room; few saw his face.',
    'He often sat alone in one room; few ever saw his face.',
  ],
  s0357: [
    'Yan\'s paternal uncle Bo rose to glory in Qi; whenever he returned to Wuxing guests filled the courtyard, but Yan never came to his gate.',
    'His uncle Bo was grand in Qi; when Bo returned to Wuxing guests choked the court, but Yan never came to his gate.',
  ],
  s0358: [
    'Bo went to him; Yan\'s coming and going never crossed the threshold.',
    'Bo visited him; Yan\'s courtesy never crossed the threshold.',
  ],
  s0359: [
    'Bo sighed and said, "Only today do I know that noble rank is not as good as low."',
    'Bo sighed: "Only now I know rank is worse than low estate."',
  ],
  s0360: [
    'Soon he was summoned as left regular attendant to the Prince of Nan commandery but would not go.',
    'Soon summoned as left attendant to the Prince of Nan—he refused.',
  ],
  s0361: [
    'Yan\'s inner conduct was very strict; in serving mother and brothers he was filial and friendly, and the district praised and admired him.',
    'His inner life was strict; filial to mother, friendly to brothers—the district praised him.',
  ],
  s0362: [
    'In the third year of Yongming he was summoned as drafting secretary;',
    'Yongming year three he was called drafting secretary;',
  ],
  s0363: [
    'in the second year of Jianwu as crown prince attendant—he went to neither.',
    'Jianwu year two as crown prince attendant—he went to neither.',
  ],
  s0364: [
    'In the second year of Yongyuan he was again summoned as courier gentleman and again would not go.',
    'Yongyuan year two he was called courier gentleman and again refused.',
  ],
  s0365: [
    'Yan never managed family property; at the end of Qi, with soldiers and famine, he and his household ate one meal a day.',
    'He never kept house; at Qi\'s end, war and famine, his household ate once a day.',
  ],
  s0366: [
    'When someone offered him grain and meat he shut the door and would not accept.',
    'Offered grain and meat, he shut the door and would not take it.',
  ],
  s0367: [
    'He supported himself only by gathering firewood, yet remained easy and never lost his joy.',
    'He lived by firewood alone, yet stayed easy and never lost his joy.',
  ],
  s0368: [
    'In the fourth year of Tianjian a great northern campaign was launched and commoners were levied.',
    'Tianjian year four a great northern campaign levied the people.',
  ],
  s0369: [
    'Wuxing Prefect Liu Yun wanted Yan for corvee; the vice-prefect of Yangzhou Lu Ren wrote to rebuke him, and Yun was deeply ashamed, treated him with great courtesy, and sent him away.',
    'Prefect Liu Yun pressed Yan into corvee; Yangzhou vice-prefect Lu Ren rebuked him in writing; Yun was ashamed, honored him, and released him.',
  ],
  s0370: [
    'That year he died at home.',
    'That year he died at home.',
  ],
  s0371: [
    'His writings ran to several dozen pieces.',
    'His writings ran to several dozen pieces.',
  ],
  s0372: [
    'Liu Huifei',
    'Liu Huifei',
  ],
  s0373: [
    'Liu Huifei, styled Wensuan, was a man of Pengcheng.',
    'Liu Huifei, styled Wensuan, came from Pengcheng.',
  ],
  s0374: [
    'In youth he was broadly learned and could write; he began office as aide in the law bureau of the Prince of An Cheng.',
    'Young, broadly learned and able to write, he began as law-bureau aide to the Prince of An Cheng.',
  ],
  s0375: [
    'Once returning to the capital he passed Xunyang, wandered Mt Kuang, met the recluse Zhang Xiaoxiu, and took great delight in him; he then resolved to end his days there.',
    'Returning to court he passed Xunyang, roamed Mt Kuang, met recluse Zhang Xiaoxiu, delighted in him, and resolved to end his days there.',
  ],
  s0376: [
    'He therefore left office and lived at East Grove Temple.',
    'He left office and dwelt at East Grove Temple.',
  ],
  s0377: [
    'He also built a garden north of the mountain called the Garden Free of Defilement; people then called him Master Free of Defilement.',
    'North of the mountain he built the Garden Free of Defilement; men called him Master Free of Defilement.',
  ],
  s0378: [
    'Huifei was especially versed in Buddhist canon and skilled in seal and clerical script; on the mountain he copied more than two thousand scrolls of sutras by hand and regularly recited over a hundred.',
    'He excelled in Buddhist canon and seal script, copied two thousand sutra scrolls by hand on the mountain, and daily recited over a hundred.',
  ],
  s0379: [
    'Day and night he practiced the Way without slackening; near and far admired him.',
    'Day and night he walked the Way without slackening; near and far admired him.',
  ],
  s0380: [
    'Taizong governed Jiang province and sent him a couch and staff.',
    'Taizong governing Jiang sent him couch and staff.',
  ],
  s0381: [
    'Critics said that from Master Yuan\'s death it had been nearly two hundred years before Zhang and Liu flourished again.',
    'Critics said nearly two hundred years after Master Yuan died before Zhang and Liu rose again.',
  ],
  s0382: [
    'Shizu and the Prince of Wuling and others wrote without cease.',
    'Shizu and the Prince of Wuling wrote without cease.',
  ],
  s0383: [
    'In the second year of Datong he died, aged fifty-nine.',
    'Datong year two he died, at fifty-nine.',
  ],
  s0384: [
    'Fan Yuanyan',
    'Fan Yuanyan',
  ],
  s0385: [
    'Fan Yuanyan, styled Bogui, was a man of Qiantang in Wu commandery.',
    'Fan Yuanyan, styled Bogui, came from Qiantang in Wu commandery.',
  ],
  s0386: [
    'His grandfather Yuezhi was summoned as Erudite of the Imperial Academy but would not go.',
    'His grandfather Yuezhi was summoned imperial erudite and would not go.',
  ],
  s0387: [
    'His father Lingyu died in mourning for his father, wasted by grief.',
    'His father Lingyu died mourning his father, destroyed by grief.',
  ],
  s0388: [
    'Yuanyan was then a child; his mourning and yearning fulfilled every rite, and kin marveled at him.',
    'Yuanyan was still a child; his mourning fulfilled every rite, and kin marveled.',
  ],
  s0389: [
    'Grown, he loved learning, ranged through classics and history, and was also versed in Buddhist doctrine.',
    'Grown, he loved learning, ranged classics and history, and knew Buddhist teaching.',
  ],
  s0390: [
    'Yet by nature he was modest and did not flaunt what he knew.',
    'Yet modest by nature, he never flaunted what he knew.',
  ],
  s0391: [
    'His family was poor; he lived only by garden vegetables.',
    'Poor, he lived only on garden vegetables.',
  ],
  s0392: [
    'Once on a walk he saw someone stealing his vegetables; Yuanyan hurried away. His mother asked why; he told her fully.',
    'Once walking out he saw a man steal his greens; Yuanyan hurried away. His mother asked; he told all.',
  ],
  s0393: [
    'His mother asked who the thief was. He answered, "I withdrew because I feared shaming him.',
    'She asked who stole. He said, "I fled lest I shame him.',
  ],
  s0394: [
    'Now that I name him, I beg you not to reveal it."',
    'Now I name him—please do not tell."',
  ],
  s0395: [
    'Mother and son kept the secret.',
    'Mother and son kept silence.',
  ],
  s0396: [
    'When someone waded a ditch to steal his bamboo shoots, Yuanyan cut wood and built a bridge for crossing.',
    'When a man waded a ditch to steal bamboo shoots, Yuanyan built a wooden bridge.',
  ],
  s0397: [
    'After that the thief was deeply ashamed, and the whole village ceased stealing grass and wood.',
    'Then the thief was ashamed, and the village stopped stealing plants.',
  ],
  s0398: [
    'He usually did not leave the city; sitting alone he was as if facing stern guests—those who saw him could not but straighten their bearing and color.',
    'He rarely left town; sitting alone as before stern guests, viewers straightened face and bearing.',
  ],
  s0399: [
    'Liu Huan of Pei greatly prized him and once memorialized in praise.',
    'Liu Huan of Pei prized him and once memorialized praise.',
  ],
  s0400: [
    'In the second year of Jianwu he was first summoned as aide to the Army Pacifying the North; he would not go.',
    'Jianwu year two he was first summoned aide to the Army Pacifying the North and refused.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_051_b4.mjs <translation.json>'
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
