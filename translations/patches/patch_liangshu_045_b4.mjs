#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'Great Qi\'s vast virtue—faith moving gods and people.',
    'Great Qi\'s vast virtue moved gods and people.',
  ],
  s0302: [
    'Now we look up to rely on imperial might and respectfully lean on the chief minister to punish rebels at Xianyang and execute traitors at Yunmeng—with one heart and united strength to settle the state.',
    'Now we rely on imperial might and lean on the chief minister to punish rebels at Xianyang and traitors at Yunmeng—with one heart to settle the state.',
  ],
  s0303: [
    'Reading the Quan Jingxuan letter you showed, the upriver generals originally had loyal designs; to abandon kin and turn to the foe—they surely would not; preventing treachery and settling chaos ultimately rests with you.',
    'Reading Quan Jingxuan\'s letter you showed, upriver generals had loyal designs; to abandon kin for the foe they surely would not—preventing treachery rests with you.',
  ],
  s0304: [
    'For now we halt at the eastern pass and await further word—do not know where on water or land you will welcome us.',
    'For now we halt at the eastern pass and await word—where on water or land will you welcome us?',
  ],
  s0305: [
    'Founding a state and setting up a ruler are set down in the records; entering alliance and sending hostages has its own long precedent.',
    'Founding a state and setting a ruler are in the records; alliance and hostages have long precedent.',
  ],
  s0306: [
    'If your loyal integrity moves the azure heavens;',
    'If your loyal integrity moves heaven;',
  ],
  s0307: [
    'the commanders in common counsel surely are not of divided allegiance.',
    'the commanders in common counsel are surely not divided.',
  ],
  s0308: [
    'then Qi\'s army will turn its banners and by righteousness will not cross the Yangtze; if contrary words are sent, I vow we shall not conquer.',
    'then Qi\'s army will turn its banners and by righteousness will not cross the Yangtze; if contrary words are sent, I vow we shall not conquer.',
  ],
  s0309: [
    'Lower the flags and sit sidewise—awaiting the envoy\'s return.',
    'Lower the flags and sit sidewise—awaiting the envoy\'s return.',
  ],
  s0310: [
    'Cao Chong presents a memorial to the Qi capital and is detained and sent at once.',
    'Cao Chong presents a memorial to Qi and is detained and sent at once.',
  ],
  s0311: [
    'Below Weiqiao I only await your words;',
    'Below Weiqiao I only await your words;',
  ],
  s0312: [
    'south of the Sishui I already have the cry of fear."',
    'south of the Sishui I already have the cry of fear."',
  ],
  s0313: [
    '" Sengbian again memorialized: "Regular Attendant Jiang Gao has returned bearing your edict; bowing low I have received your movements.',
    '" Sengbian again memorialized, "Regular Attendant Jiang Gao has returned with your edict; bowing low I have your movements.',
  ],
  s0314: [
    'Great Qi\'s wind of benevolence and righteousness bends graciously on a neighboring state; pitying disaster and rescuing hardship—this great design is declared.',
    'Great Qi\'s benevolence bends on a neighbor; pitying disaster and rescuing hardship declares this great design.',
  ],
  s0315: [
    'The imperial clan\'s kin—none do not glory in the burden;',
    'The imperial clan—none do not glory in the burden;',
  ],
  s0316: [
    'the crowned heads east of the Yangtze all know whom to rely on.',
    'the crowned heads east of the Yangtze all know whom to rely on.',
  ],
  s0317: [
    'Today the oath is not to forget faith—faith truly comes from the heart; I respectfully send my seventh son Xian, Xian\'s mother Liu, and my nephew Shizhen to go there as hostages;',
    'Today the oath does not forget faith—faith comes from the heart; I send my seventh son Xian, his mother Liu, and nephew Shizhen as hostages;',
  ],
  s0318: [
    'and I also send Minister of the Left Zhou Hongzheng to Liyang to welcome you.',
    'and send Minister of the Left Zhou Hongzheng to Liyang to welcome you.',
  ],
  s0319: [
    'Warships float on the river, awaiting the one dragon\'s crossing;',
    'Warships float on the river, awaiting the dragon\'s crossing;',
  ],
  s0320: [
    'the pure palace and cinnabar steps await the six relays\' entry.',
    'the pure palace and cinnabar steps await the six relays\' entry.',
  ],
  s0321: [
    'The myriad states bend their hearts—together they glory in Duke Wen of Jin\'s return;',
    'The myriad states bend their hearts—together they glory in Duke Wen\'s return;',
  ],
  s0322: [
    'the three goods can be proclaimed—flowing in Song Chang\'s discourse.',
    'the three goods can be proclaimed—in Song Chang\'s discourse.',
  ],
  s0323: [
    'The dynastic fortune is already lofty; the altars have support.',
    'The dynastic fortune is lofty; the altars have support.',
  ],
  s0324: [
    'Then the ministers will exhaust their integrity, repaying Great Qi\'s thick favor;',
    'Then ministers will exhaust integrity, repaying Great Qi\'s favor;',
  ],
  s0325: [
    'they will deploy their utmost loyalty to Your Majesty.',
    'they will show utmost loyalty to Your Majesty.',
  ],
  s0326: [
    'Now I send Minister of Personnel Wang Tong to present this memorial."',
    'Now I send Minister of Personnel Wang Tong to present this memorial."',
  ],
  s0327: [
    'Sengbian thereupon asked that Emperor Jing be made heir apparent.',
    'Sengbian then asked that Emperor Jing be made heir apparent.',
  ],
  s0328: [
    'Zhenyang again replied: "Wang Tong, Minister of Personnel, has arrived and again wrongly shows that you wish to send your worthy younger brother Shizhen to display sincerity—I fully know your heart anxious for the state.',
    'Zhenyang replied, "Minister Wang Tong has arrived and shows you wish to send your nephew Shizhen as pledge—I know your heart anxious for the state.',
  ],
  s0329: [
    'Again you offer the jade tree in the courtyard and the bright pearl in the palm—no burden on the breast, the will set on rescue—is this not toiling for our altars and grandly aiding our house?',
    'Again you offer the courtyard jade tree and palm bright pearl—no burden on the breast, the will on rescue—is this not toiling for our altars and aiding our house?',
  ],
  s0330: [
    'The feeling of shame and sighing makes one forget to rise or sleep.',
    'Shame and sighing make one forget to rise or sleep.',
  ],
  s0331: [
    'Prince Jin\'an\'s weight as heir in the eastern capital and the western capital\'s worth as successor in the line—to continue guarding the imperial house is surely the people\'s hope.',
    'Prince Jin\'an\'s weight in the eastern capital and the western capital heir\'s worth—to continue the house is the people\'s hope.',
  ],
  s0332: [
    'But the age is in chaos and ruin—a mature ruler should be set up; because he bears misfortune, it is hard to undertake the enterprise.',
    'But the age is in chaos—a mature ruler should be set up; because he bears misfortune, he cannot undertake the enterprise.',
  ],
  s0333: [
    'The virtue of Cheng and Zhao is rare since antiquity;',
    'The virtue of Cheng and Zhao is rare since antiquity;',
  ],
  s0334: [
    'the peril of Chong and Zhi—which age has lacked it?',
    'the peril of Chong and Zhi—which age has lacked it?',
  ],
  s0335: [
    'Alone I meet an unkind age; my will is not to scheme for life.',
    'Alone I meet an unkind age; my will is not to live for myself.',
  ],
  s0336: [
    'Suddenly I bear an unworldly grace and again meet an extraordinary elevation.',
    'Suddenly I bear unworldly grace and meet extraordinary elevation.',
  ],
  s0337: [
    'Reflecting on my emptiness and shallowness, my fear and trembling are already deep.',
    'Reflecting on my emptiness, my fear is already deep.',
  ],
  s0338: [
    'If the Heir Apparent\'s establishment is built, it fundamentally returns to the imperial grandson;',
    'If the Heir Apparent is built, it returns to the imperial grandson;',
  ],
  s0339: [
    'heart and mouth together swear—only Prince Jin\'an is intended.',
    'heart and mouth swear—only Prince Jin\'an is intended.',
  ],
  s0340: [
    'If empty words, the spirits will destroy me.',
    'If empty words, the spirits will destroy me.',
  ],
  s0341: [
    'Reading what you now show, it deeply fulfills my original heart.',
    'Reading what you show, it fulfills my original heart.',
  ],
  s0342: [
    'The feeling of restraint and comfort has no words to carry it.',
    'Restraint and comfort have no words to carry them.',
  ],
  s0343: [
    'But the weight of your anxious toil has already received Qi\'s grace;',
    'But your anxious toil has already received Qi\'s grace;',
  ],
  s0344: [
    'the feeling of loyalty and righteousness again reaches Liang\'s second rank.',
    'loyalty and righteousness again reach Liang\'s second rank.',
  ],
  s0345: [
    'The hundred surnames of China and barbarians—who does not turn to the wind?',
    'Chinese and barbarians—who does not turn to the wind?',
  ],
  s0346: [
    'The temple\'s bright spirits—how would they not respond in feeling?',
    'The temple spirits—how would they not respond?',
  ],
  s0347: [
    'Just now I turn the banners and still head for Liyang.',
    'Just now I turn the banners and still head for Liyang.',
  ],
  s0348: [
    'The hostages expected—look to their coming there.',
    'The hostages expected—look to their coming there.',
  ],
  s0349: [
    'The armies will not cross—this is already written in the covenant.',
    'The armies will not cross—this is already in the covenant.',
  ],
  s0350: [
    'This is Great Qi\'s sage ruler\'s gracious plan and the Prince of Shangdang\'s sworn promise—having obtained forgiveness for breach of faith, in the end he will not do otherwise.',
    'This is Great Qi\'s gracious plan and Prince of Shangdang\'s sworn promise—having obtained forgiveness for breach, in the end he will not do otherwise.',
  ],
  s0351: [
    'I only await meeting you—may the envoy not delay.',
    'I only await meeting you—may the envoy not delay.',
  ],
  s0352: [
    'The homeland is not far—at every sight, wailing and sobbing."',
    'The homeland is not far—at every sight, wailing."',
  ],
  s0353: [
    'Sengbian sent the hostages to Ye.',
    'Sengbian sent the hostages to Ye.',
  ],
  s0354: [
    'Zhenyang asked for three thousand guards to cross; Sengbian feared they would cause trouble and accepted only a thousand scattered troops; he also sent the dragon boat and imperial equipage to welcome him.',
    'Zhenyang asked for three thousand guards to cross; Sengbian feared trouble and accepted only a thousand scattered troops; he also sent the dragon boat and imperial equipage to welcome him.',
  ],
  s0355: [
    'On the day Zhenyang crossed the river, Sengbian held the oars midstream and did not dare approach the shore.',
    'When Zhenyang crossed the river, Sengbian held the oars midstream and did not dare approach shore.',
  ],
  s0356: [
    'Later they met together at Jiangning Ford.',
    'Later they met at Jiangning Ford.',
  ],
  s0357: [
    'When Zhenyang had taken the false throne he still appointed Sengbian Grand Marshal, concurrently Grand Tutor to the Heir Apparent and Governor of Yang Province; all else as before.',
    'When Zhenyang took the false throne he appointed Sengbian Grand Marshal, Grand Tutor to the Heir Apparent, and Governor of Yang; all else unchanged.',
  ],
  s0358: [
    'Chen Baxian was then Minister of Works and inspector of South Xu—he hated this reversal and discussed with the generals; from Jingkou he raised a hundred thousand men, coming by water and land together, and struck at Jiankang.',
    'Chen Baxian was Minister of Works and inspector of South Xu—he hated the reversal and with the generals raised a hundred thousand men from Jingkou by water and land and struck Jiankang.',
  ],
  s0359: [
    'When the water army arrived, Sengbian was usually at Stone City; that day he was just handling affairs when soldiers had already crossed north of the city and entered; the southern gate also galloped word that troops were coming.',
    'When the fleet arrived, Sengbian was at Stone City handling affairs when soldiers crossed north of the city; the south gate also reported troops coming.',
  ],
  s0360: [
    'Sengbian and his son Wei hurried out of the pavilion; close retainers of heart and belly still numbered several tens.',
    'Sengbian and his son Wei hurried from the pavilion; close retainers still numbered several tens.',
  ],
  s0361: [
    'When all the armies had arrived, Sengbian had no plan left; he then held the southern gate tower, begging for life and bowing in request.',
    'When all armies arrived, Sengbian had no plan; he held the south gate tower, begging life and bowing.',
  ],
  s0362: [
    'Baxian thereupon ordered fire set to burn it; only then did he and Wei come down and be seized.',
    'Baxian ordered fire set to burn it; only then he and Wei came down and were seized.',
  ],
  s0363: [
    'Baxian said: "What crime have I, that you wished to grant Qi\'s army leave to come punish me?',
    'Baxian said, "What crime have I, that you wished to let Qi\'s army come punish me?',
  ],
  s0364: [
    '" He also said: "Why did you intend to have no defense at all?',
    '" He also said, "Why no defense at all?',
  ],
  s0365: [
    '" Sengbian said: "I entrusted the north gate to you—how do you call that no defense?',
    '" Sengbian said, "I entrusted the north gate to you—how is that no defense?',
  ],
  s0366: [
    '" That night he was beheaded.',
    'That night he was beheaded.',
  ],
  s0367: [
    'The eldest son, Yi, in the early Manifest Fidelity era successively reached office up to palace attendant.',
    'Eldest son Yi in early Manifest Fidelity rose to palace attendant.',
  ],
  s0368: [
    'Earlier, when Sengbian pacified Jiankang, he sent Baxian to guard Jingkou with no defensive preparations at all.',
    'When Sengbian pacified Jiankang, he sent Baxian to guard Jingkou with no defenses.',
  ],
  s0369: [
    'Yi repeatedly spoke of this; Sengbian would not listen, and in the end he met disaster.',
    'Yi repeatedly warned him; Sengbian would not listen and met disaster.',
  ],
  s0370: [
    'When Western Wei raided Jiangling, Emperor Yuan sent Yi to supervise military affairs within the city.',
    'When Western Wei raided Jiangling, Yuan sent Yi to supervise military affairs in the city.',
  ],
  s0371: [
    'When Jing city fell, Yi followed Wang Lin into Qi and became magistrate of Jingling commandery.',
    'When Jing fell, Yi followed Wang Lin into Qi and became magistrate of Jingling.',
  ],
  s0372: [
    'Qi sent Lin to garrison Shouyang, intending to take the left of the Yangtze.',
    'Qi sent Lin to garrison Shouyang, intending to take the Yangtze left bank.',
  ],
  s0373: [
    'When Chen pacified Huainan, they seized Lin and killed him.',
    'When Chen pacified Huainan, they seized Lin and killed him.',
  ],
  s0374: [
    'When Yi heard Lin was dead, he went south of the commandery city, climbed a high mound, and wailed; in one burst of grief he died.',
    'When Yi heard Lin was dead, he went south of the city, climbed a high mound, wailed once, and died.',
  ],
  s0375: [
    'Yi\'s younger brother Biao from youth had lofty resolve and always followed Emperor Yuan.',
    'Yi\'s younger brother Biao from youth had lofty resolve and always followed Yuan.',
  ],
  s0376: [
    'When Jing city was overrun he was lost in Western Wei.',
    'When Jing was overrun he was lost in Western Wei.',
  ],
  s0377: [
    'The historian says: From the time Hou Jing rebelled, Emperor Yuan held the upper reaches and entrusted the troops of all Chu to Sengbian\'s command.',
    'The historian writes: From Hou Jing\'s rebellion, Yuan held the upper reaches and entrusted all Chu\'s troops to Sengbian.',
  ],
  s0378: [
    'When he had crushed the calamity his merit too was manifest; in recording merit he ought to have received reward on the highest terrace.',
    'When he crushed the calamity his merit was manifest; in recording merit he ought to have received the highest reward.',
  ],
  s0379: [
    'Emperor Jing bore the weight of Emperor Gaozu\'s legacy and Emperor Yuan\'s succession in the line; when Zhugong Palace was submerged, by right he should have received the precious throne.',
    'Emperor Jing bore Gaozu\'s legacy and Yuan\'s succession; when Zhugong fell, by right he should have received the throne.',
  ],
  s0380: [
    'Sengbian stood in the place of general and minister with the righteousness of Yi Yin and Huo Guang—yet he accepted coercion from Qi\'s army and set up a collateral scion at the side.',
    'Sengbian stood as general and minister with Yi Yin and Huo Guang\'s righteousness—yet he accepted Qi\'s coercion and set up a collateral scion.',
  ],
  s0381: [
    'If he wished to practice loyalty and righteousness, how far loyalty and righteousness had fled!',
    'If he wished loyalty and righteousness, how far they had fled!',
  ],
  s0382: [
    'The way of establishing a state was already lost; the plan for preserving himself was insufficient—he brought on his own destruction. Lamentable!',
    'The way of establishing a state was lost; the plan for himself insufficient—he brought on his own destruction. Lamentable!',
  ],
  s0383: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0384: [
    'The full text has been collated against the Zhonghua Shuju edition of the Book of Liang, May 1973.',
    'The full text has been collated against the Zhonghua Shuju edition of the Book of Liang, May 1973.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_045_b4.mjs <translation.json>'
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
