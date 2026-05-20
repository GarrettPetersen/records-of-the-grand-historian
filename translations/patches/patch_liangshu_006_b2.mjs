#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'In summer, the fourth month, on guiyou, a partial amnesty was granted to Jiang, Guang, and Heng provinces;',
    'In the fourth month of summer, on guiyou, Jiang, Guang, and Heng received a partial amnesty;',
  ],
  s0102: [
    'and all within those provinces who had been coerced by rebels were likewise not questioned.',
    'and all in those provinces coerced by rebels were pardoned without inquiry.',
  ],
  s0103: [
    'On jimao, four-pillar cash was cast, one standard to twenty.',
    'On jimao four-pillar coin was cast, one worth twenty.',
  ],
  s0104: [
    'Qi sent envoys seeking peace.',
    'Qi sent envoys seeking peace.',
  ],
  s0105: [
    'On renchen, four-pillar cash was changed to one standard to ten.',
    'On renchen four-pillar coin was revalued one to ten.',
  ],
  s0106: [
    'On bingshen, small cash was again closed from circulation.',
    'On bingshen small coin was again abolished.',
  ],
  s0107: [
    'Xiao Bo\'s former chief commander, former Direct Attendant Lan Ai, raided and killed Tan Shiyuan; Ai was then killed by the outlaw Xia Hou Mingche.',
    'Xiao Bo\'s former chief commander Lan Ai, a former Direct Attendant, killed Tan Shiyuan; Ai was then killed by the outlaw Xia Hou Mingche.',
  ],
  s0108: [
    'Bo\'s former secretary Li Baocang supported Marquis of Huai\'an Xiao Ren in holding Guangzhou and rising in rebellion.',
    'Bo\'s former secretary Li Baocang backed Marquis of Huai\'an Xiao Ren in seizing Guangzhou and rebelling.',
  ],
  s0109: [
    'On wuxu, Hou Andu advanced his army; Yu Xiaoxiang abandoned his force and fled; Xiao Zi asked to surrender, and Yuzhang was pacified.',
    'On wuxu Hou Andu advanced; Yu Xiaoxiang fled; Xiao Zi surrendered, and Yuzhang was pacified.',
  ],
  s0110: [
    'In the fifth month, on yisi, General Who Pacifies the West Zhou Wenyü was promoted to General Who Pacifies the South; General Who Pacifies the South Hou Andu was promoted to General Who Pacifies the North—both with their former titles received Opening Office Equal to Three Departments.',
    'In the fifth month, on yisi, Zhou Wenyü was promoted from General Who Pacifies the West to General Who Pacifies the South; Hou Andu from General Who Pacifies the South to General Who Pacifies the North—both kept their titles and received Opening Office Equal to Three Departments.',
  ],
  s0111: [
    'On bingwu, General of the Pacifying Army Xu Du was made Inspector of South Yuzhou.',
    'On bingwu Pacifying Army General Xu Du became South Yuzhou inspector.',
  ],
  s0112: [
    'On wuchen, Yu Xiaoxiang sent envoys to the Chancellor\'s office begging to surrender.',
    'On wuchen Yu Xiaoxiang sent envoys to the chancellor\'s office to surrender.',
  ],
  s0113: [
    'In the eighth month of autumn, on jiawu, Chancellor Chen Baxian was granted the yellow axe, made Grand Tutor, sword and shoes in the hall, no hurrying in court attendance, not named when praised in obeisance, granted feather canopy and martial music.',
    'On jiawu in the eighth month of autumn Chancellor Chen Baxian received the yellow axe, became Grand Tutor, and was granted sword in the hall, no hurrying at court, praise without naming, and feather canopy and martial music.',
  ],
  s0114: [
    'In the ninth month, on xinchou, the Chancellor was exalted to Chancellor of State, head of the hundred officials, enfeoffed as Duke of Chen over ten commanderies, granted the full Nine Bestowals, with seal ribbon and far-wandering cap added, rank above kings and dukes.',
    'On xinchou in the ninth month the chancellor was raised to chancellor of state, head of the hundred officials, enfeoffed Duke of Chen over ten commanderies, granted the Nine Bestowals with seal ribbon and far-wandering cap, and ranked above princes.',
  ],
  s0115: [
    'Green sash for the Chancellor of State was added.',
    'A green sash was added for the chancellor of state.',
  ],
  s0116: [
    'The hundred offices of the State of Chen were established.',
    'The hundred offices of the state of Chen were established.',
  ],
  s0117: [
    'In the tenth month of winter, on wuchen, Duke of Chen was advanced to King; ten more commanderies were added to the enfeoffment, making twenty altogether.',
    'On wuchen in the tenth winter month the Duke of Chen was advanced to king, with ten more commanderies added for twenty in all.',
  ],
  s0118: [
    'The King of Chen was ordered to wear twelve cap tassels, raise the Son of Heaven\'s banners, clear the road on going out and returning, ride the golden-root carriage, drive six horses, have five-season secondary carriages prepared, set yak-tail and cloud pennants, music and dance of eight rows, and establish bell frames and palace suspended instruments.',
    'The king of Chen was ordered twelve cap tassels, Son of Heaven banners, road cleared on exit and return, the golden-root carriage with six horses, five-season secondary carriages, yak-tail and cloud pennants, eight rows of music and dance, and palace bell frames.',
  ],
  s0119: [
    'The regulations for investiture of queen, king\'s children, and enfeoffment ranks all followed the old ceremonies.',
    'Rites for queen, royal children, and enfeoffment all followed former usage.',
  ],
  s0120: [
    'On xinwei, an edict said:',
    'On xinwei an edict said:',
  ],
  s0121: [
    'The five movements begin anew, the three orthodoxies succeed one another; to shepherd the black-haired people belongs to the sage and worthy, whereby one can weave heaven and earth, cover the four quarters, greatly shelter the people, and spread the grand achievement.',
    'The five phases turn anew, the three calendars succeed one another; to shepherd the people belongs to the sage, who can weave heaven and earth, cover the realm, shelter the masses, and spread the grand achievement.',
  ],
  s0122: [
    'Changing darkness to brightness, age piled upon age on the same track—hundred kings followed in martial steps, all by this rule.',
    'Darkness gave way to light, age after age on one track—hundred kings followed in martial steps, all by this rule.',
  ],
  s0123: [
    'Liang virtue sank and faded; calamity and disorder arose in succession: at the beginning of Great Clarity one was trapped by the long serpent;',
    'Liang virtue sank; calamity followed in succession: at Great Clarity\'s start one was trapped by the long serpent;',
  ],
  s0124: [
    'in the year of Receiving Sagacity one again suffered the ravenous boar;',
    'in Receiving Sagacity\'s year one again suffered the ravenous boar;',
  ],
  s0125: [
    'when it reached Heavenly Completion, the sacred vessel was again stolen.',
    'when Heavenly Completion came, the sacred vessel was stolen again.',
  ],
  s0126: [
    'The three luminaries swiftly changed, the seven temples lacked sacrifice; living beings were already extinguished, the bronze mandate fell—our emperor\'s fortune was like a dangling tassel; quietly I pondered difficulty and stripping, evening vigilance filled my breast.',
    'The three lights changed, the seven temples went without sacrifice; life was spent, the mandate fell—our imperial fortune hung like a dangling tassel; quietly I pondered ruin and stripping, and evening vigilance filled my breast.',
  ],
  s0127: [
    'The Chancellor of State, King of Chen, was Heaven\'s chosen, his descending spirit from the sacred peak; heaven and earth united in virtue, the sun-staff and stars alike bright.',
    'Chancellor of state and king of Chen were Heaven\'s chosen, spirit from the sacred peak; heaven and earth shared his virtue, sun and stars burned bright with him.',
  ],
  s0128: [
    'He saved the altars from the crosscurrent and lifted the hundred million from charcoal.',
    'He saved the altars from the flood and lifted the millions from the coals.',
  ],
  s0129: [
    'East he punished rebellion, north he destroyed the Xianyun fiends; awesomeness reached the four seas, benevolence spread to the myriad states.',
    'East he punished rebels, north he destroyed the Xianyun; his awesomeness filled the four seas, his kindness spread to every state.',
  ],
  s0130: [
    'He restored collapsed music, again raised extinct rites; Confucian halls were repaired, barbarian posts stood empty of scouts.',
    'He restored fallen music and raised extinct rites; Confucian halls were repaired and barbarian posts stood empty.',
  ],
  s0131: [
    'Though great merit lay in Shun and splendid achievement only in Yu, vast, vast—none could name it.',
    'Though his merit matched Shun and his achievement only Yu, he was vast beyond naming.',
  ],
  s0132: [
    'White rings came as tribute—was it only in the age of august Yu?',
    'White rings came as tribute—was that only in the age of august Yu?',
  ],
  s0133: [
    'White pheasants entered tribute—not only on the exalted Zhou day.',
    'White pheasants were offered—not only in exalted Zhou.',
  ],
  s0134: [
    'Thus treasures were offered on rivers and land, omens shown in mist and cloud; sweet dew and sweet springs morning and evening welled and surged; fine grain and auspicious grass sprouted thick in the suburbs; the Way was clear in distant ages, merit reached the august vault.',
    'Treasures rose from rivers and land, omens from mist and cloud; sweet dew and sweet springs welled morning and evening; fine grain and auspicious grass sprouted thick in the suburbs; the Way shone in distant ages and merit reached heaven.',
  ],
  s0135: [
    'Bright, bright was high heaven, glory to sun and moon; change of the old was written in the dark signs, succession of virtue shown in the charts; lawsuits had their turn, songs of praise turned this way—the heavenly succession truly had its place.',
    'Bright was high heaven, glory to sun and moon; change of the old was written in the dark signs, succession of virtue in the charts; lawsuits found their judge, songs of praise turned here—the heavenly succession truly had its lord.',
  ],
  s0136: [
    'Though I am mediocre and small, dark on antiquity, long have I traced exaltation and replacement; how dare I forget the former dynasties\' handed statutes and the utmost wish of men and spirits!',
    'Though I am mediocre and small, dark on antiquity, long have I traced rise and fall; how dare I forget the former dynasties\' statutes and the utmost wish of men and spirits!',
  ],
  s0137: [
    'Now I yield the throne to a separate palace and respectfully abdicate to Chen, all following the stories of Tang and Yu, Song and Qi.',
    'Now I yield the throne to a separate palace and respectfully abdicate to Chen, following the stories of Tang and Yu, Song and Qi.',
  ],
  s0138: [
    'The historiographer says: When the Liang age collapsed in ruin, calamities and disorder came one after another; at this time Heaven\'s mandate had departed; Emperor Jing\'s high abdication was about to be like laying down a burden.',
    'The historiographer says: When the Liang age collapsed, calamity followed calamity; Heaven\'s mandate had departed; Emperor Jing\'s high abdication was like laying down a burden.',
  ],
  s0139: [
    'The historiographer, Attendant-in-Ordinary and Duke of Zheng Wei Zheng, said: "The High Ancestor was indeed Heaven\'s chosen, intelligent and versed in antiquity; his Way nearly matched innate knowledge, his learning was that of broad learning; he was both wen and wu, with many arts and many talents.',
    'Attendant-in-Ordinary and Duke of Zheng Wei Zheng said, "The High Ancestor was Heaven\'s chosen, intelligent and versed in antiquity; his Way nearly matched innate knowledge; he was learned, wen and wu, with many arts and talents.',
  ],
  s0140: [
    'From his days as a student he had an untamed spirit; when the wicked and fierce ran rampant and family bonds met calamity, he gathered righteous troops to wipe away the family\'s wrong.',
    'From his student days he had an untamed spirit; when the wicked ran rampant and kin met calamity, he gathered righteous troops to avenge the family.',
  ],
  s0141: [
    'He said Zhou could be punished; without expecting it they assembled; he leapt like a dragon at Fan and Han and struck like lightning at Xiang and Ying; cutting off the virtue of Li was like shaking dry stalks; taking the lone tyrant was like picking up what was lost.',
    'He said Zhou could be punished; allies assembled unlooked-for; he leapt like a dragon at Fan and Han and struck like lightning at Xiang and Ying; cutting Li was like shaking dry stalks; taking the lone tyrant was like picking up what was lost.',
  ],
  s0142: [
    'His heroic talent and great design truly cannot be fully praised.',
    'His heroic talent and great design truly cannot be fully praised.',
  ],
  s0143: [
    'Already he had hung the head on the white flag; then he answered Heaven\'s favor; he spread virtue and showed grace, pleasing the near and reaching the far; he opened the broad Way of kings and reformed the decadent customs of Shang; he greatly cultivated wen and education, richly adorned ritual and bearing, stirred the mysterious wind, and exalted Confucian enterprise; armor wore benevolence and righteousness; he overturned the enemy at the banquet table; his fame shook the realm and his grace flowed to distant lands; weapons were laid aside for several decades.',
    'He hung the head on the white flag, then answered Heaven\'s favor; he spread virtue and grace, pleased the near and reached the far; opened the broad royal Way and reformed Shang decadence; cultivated wen and education, adorned ritual, stirred the mysterious wind, and exalted Confucian learning; armor wore benevolence and righteousness; he overturned foes at the banquet table; his fame shook the realm and grace flowed abroad; weapons were laid aside for decades.',
  ],
  s0144: [
    'Vast and abundant—since Wei and Jin there had been nothing like this splendor.',
    'Vast and abundant—since Wei and Jin there had been nothing like this splendor.',
  ],
  s0145: [
    'Yet he could not rest the branch and strengthen the root, carve away ornament and return to simplicity; he admired reputation and loved novelty and honored the floating and splendid; he elevated and suppressed Confucius and Mozi and lingered over Buddhism and Daoism.',
    'Yet he could not rest the branch and strengthen the root or carve away ornament for simplicity; he admired reputation, loved novelty, and honored the floating and splendid; he elevated and suppressed Confucius and Mozi and lingered over Buddhism and Daoism.',
  ],
  s0146: [
    'Sometimes he did not sleep the whole night; sometimes he did not eat until the sun set—not to broaden the Way to benefit things, but only to adorn wisdom and startle fools.',
    'Sometimes he did not sleep all night; sometimes he did not eat until sunset—not to broaden the Way for the world\'s good, but only to adorn wisdom and startle fools.',
  ],
  s0147: [
    'Moreover his heart had not left glory; he vainly sat among the ranks of menials;',
    'Moreover his heart had not left glory; he vainly sat among menials;',
  ],
  s0148: [
    'he talked loftily of casting off the world yet to the end cherished the honor of the yellow canopy.',
    'he talked loftily of casting off the world yet to the end cherished the yellow canopy.',
  ],
  s0149: [
    'The great desires of man lie in food, drink, and the relations of men and women; as for carriages, caps, halls, and palaces—there is no urgent need touching the person.',
    'Man\'s great desires lie in food, drink, and men and women; carriages, caps, halls, and palaces are no urgent personal need.',
  ],
  s0150: [
    'The High Ancestor screened out appetites yet clung to carriages and caps; he obtained what is hard yet stalled at what is easy—this may be called spirit not reaching everywhere and wisdom not penetrating all.',
    'The High Ancestor screened out appetites yet clung to rank and display; he mastered what is hard yet stalled at what is easy—spirit did not reach everywhere and wisdom did not penetrate all.',
  ],
  s0151: [
    'When his essence and splendor gradually failed and phoenix virtue had declined, he was deluded in what he heard and power lay with wicked flatterers; the heir and the hundred officials—none could speak fully.',
    'When his essence failed and phoenix virtue declined, he was deluded in what he heard and power lay with flatterers; heir and hundred officials could not speak fully.',
  ],
  s0152: [
    'His rash and restless heart grew worse in old age.',
    'His rash and restless heart grew worse in old age.',
  ],
  s0153: [
    'Seeing profit he moved; stubbornly he rejected remonstrance and defied divination; he opened the gate to welcome robbers, abandoned friendship and turned to enmity; the provocation arose within the palace wall; calamity was completed by the Rong and Jie; he died an unnatural death and disaster struck hundreds of millions; gentlemen and officials perished under blade and arrow; old and young were ground beneath the hooves of war horses.',
    'Seeing profit he moved; he rejected remonstrance and defied divination; opened the gate to robbers, abandoned friendship for enmity; trouble rose within the palace wall; Rong and Jie brought calamity; he died unnaturally and disaster struck the millions; officials perished under arms; old and young were trampled by war horses.',
  ],
  s0154: [
    'Gazing at that millet in ruin, the pain exceeded the Zhou temple;',
    'Gazing at that millet in ruin, grief exceeded the Zhou temple;',
  ],
  s0155: [
    'forever speaking of the wheat in ear, the grief exceeded the ruins of Yin.',
    'forever speaking of the wheat in ear, grief exceeded the ruins of Yin.',
  ],
  s0156: [
    'From antiquity, taking peace as peril and success as failure—the speed of overturning is unheard of in written records.',
    'From antiquity, taking peace as peril and success as failure—the speed of ruin is unheard of in written records.',
  ],
  s0157: [
    'The Changes says: "Heaven helps the faithful; men help the obedient.',
    'The Changes says, "Heaven helps the faithful; men help the obedient.',
  ],
  s0158: [
    '" That the High Ancestor met this time of hardship and stripping and did not obtain natural death—surely because in movement he went toward peril and did not follow faith and obedience; losing Heaven\'s and men\'s help, how could he escape this?',
    '" The High Ancestor met hardship and stripping and did not die a natural death—because he moved toward peril, not faith and obedience; losing Heaven\'s and men\'s help, how could he escape?',
  ],
  s0159: [
    'Emperor Taizong was keen and surpassing in men, with spirit and appearance splendidly flourishing; he heard much, reached far, and was rich and ample in literary ornament.',
    'Taizong was keen beyond others, with splendid spirit and appearance; he heard much, reached far, and was rich in literary ornament.',
  ],
  s0160: [
    'Yet his writing was brilliant but his use sparse, flowery but not solid; his style exhausted licentious beauty and his meaning rarely penetrated; the tone of mournful longing shifted custom—by this to hold the myriad states differs from King Song of Zhou and Emperor Zhuang of Han.',
    'Yet his writing was brilliant but thin, flowery but not solid; his style exhausted licentious beauty and his meaning rarely penetrated; mournful tones shifted custom—holding the myriad states thus differs from King Song of Zhou and Emperor Zhuang of Han.',
  ],
  s0161: [
    'I was born at the wrong time and repeatedly parted from peace; the cruel rebel constructed turmoil and the great villain flooded Heaven—I began like one confined in the windowed room and ended like the calamity at Wangyi.',
    'I was born at the wrong time, repeatedly parted from peace; cruel rebels stirred turmoil and great villains flooded Heaven—I began like confinement in Youli and ended like Wangyi\'s calamity.',
  ],
  s0162: [
    'Vast blue Heaven—can it be questioned?',
    'Vast blue Heaven—can it be questioned?',
  ],
  s0163: [
    'Formerly when the nation\'s step first faltered, war entangled the Wei gate; the feudal lords released their posts and rolled up their sleeves to serve the king.',
    'When the nation first faltered, war entangled the Wei gate; lords released their posts and rolled up their sleeves to serve the king.',
  ],
  s0164: [
    'Emperor Yuan as a foundation stone of the clan received the charge of dividing Shaan; facing the ruler\'s and parent\'s calamity, he held the post of regional commander—yet he could not grasp the sword and taste gall, pillow the spear and weep blood, take the lead among soldiers and stake his life in the vanguard;',
    'Emperor Yuan as a foundation stone of the clan received the charge of dividing Shaan; facing ruler and parent in calamity, he held the regional command—yet he could not grasp the sword and taste gall, pillow the spear and weep blood, lead soldiers and stake his life in the vanguard;',
  ],
  s0165: [
    'he then held the host yet hesitated, inwardly harbored divided hopes, sat watching the nation\'s change and took it as personal fortune.',
    'he held the host yet hesitated, inwardly harbored divided hopes, watched the nation change, and took it as personal fortune.',
  ],
  s0166: [
    'He did not urgently seek the punishment of Wang Mang and Zhuo—first he carried out the slaughter of brothers.',
    'He did not urgently punish Wang Mang and Zhuo—first he slaughtered his brothers.',
  ],
  s0167: [
    'Again he was deep in suspicion, cruel, and ruthless, often acting without propriety.',
    'Again he was deep in suspicion, cruel, and ruthless, often acting without propriety.',
  ],
  s0168: [
    'He deployed clever debate to cover wrong and unleashed wrath and harshness to harm people.',
    'He deployed clever debate to cover wrong and unleashed wrath to harm people.',
  ],
  s0169: [
    'Trusted generals and ministers of heart and spine—some were seized with a glance, some reached minced pickle with a single word.',
    'Trusted generals and chief ministers—some were seized with a glance, some reached minced pickle with a single word.',
  ],
  s0170: [
    'The gentlemen of the court looked at one another in fear.',
    'Court gentlemen looked at one another in fear.',
  ],
  s0171: [
    'He thought himself secure as Mount Tai, his calculations without omission; deluded by perverse counsel, he then settled in Jing and Chu.',
    'He thought himself secure as Mount Tai, his plans without omission; deluded by perverse counsel, he settled in Jing and Chu.',
  ],
  s0172: [
    'Though the great villain was cut down and the altars were not yet at peace, the western neighbor reproached him and disaster and defeat soon followed.',
    'Though the great villain was cut down and the altars were not yet at peace, the western neighbor reproached him and disaster soon followed.',
  ],
  s0173: [
    'Heaven lowered inspection and lent its hand here; Heaven\'s Way and human affairs—how can they be deceived?',
    'Heaven lowered inspection and lent its hand here; Heaven\'s Way and human affairs—how can they be deceived?',
  ],
  s0174: [
    'His steadfast will in arts and letters gathered the floating and splendid and cast aside loyalty and faith;',
    'His steadfast will in arts and letters gathered the floating and splendid and cast aside loyalty and faith;',
  ],
  s0175: [
    'in martial proclamation he was resolute and bold—first against kin, then against enemies.',
    'in martial proclamation he was resolute and bold—first against kin, then against enemies.',
  ],
  s0176: [
    'Though his mouth recited the Six Classics and his heart penetrated the hundred schools; he had the learning of Confucius and the talent of the Duke of Zhou—yet it only increased his pride and added to his calamities; what did it remedy the fall of Jinling, what did it save the extinction of Jiangling!',
    'Though his mouth recited the Six Classics and his heart penetrated the hundred schools; he had Confucius\' learning and the Duke of Zhou\'s talent—yet it only increased his pride and calamities; what did it remedy Jinling\'s fall or save Jiangling\'s extinction!',
  ],
  s0177: [
    'Emperor Jing met with an unpropitious house and inherited this time of hardship; campaigns issued from elsewhere and government and punishment were not in his own hands; at the time there were no Yi and Huo to assist him—how could he not yield the throne high?',
    'Emperor Jing met an unpropitious house and inherited hardship; campaigns issued elsewhere and government and punishment were not his own; with no Yi and Huo to assist, how could he not yield the throne high?',
  ],
  s0178: [
    '" [1]',
    'Editorial footnote marker in the source text.',
  ],
  s0179: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_006_b2.mjs <translation.json>'
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
