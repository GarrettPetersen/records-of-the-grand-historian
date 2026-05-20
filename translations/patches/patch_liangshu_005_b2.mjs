#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'Golden pillars and jade stems—all alike suffered the same wrong.',
    'Golden pillars and jade stems: none escaped the same injustice.',
  ],
  s0102: [
    'O distant azure Heaven, how boundless your cruelty!',
    'O distant azure Heaven—how boundless your cruelty!',
  ],
  s0103: [
    'I have heard that when a ruler dies there is yet a ruler—the splendid canon of the Spring and Autumn;',
    'I have heard that when a ruler dies, another must rule—the splendid canon of the Spring and Autumn Annals;',
  ],
  s0104: [
    'to choose the virtuous and the elder is the universal teaching of former kings.',
    'to choose the virtuous and the elder is the universal teaching of the former kings.',
  ],
  s0105: [
    'Shaokang gathered the people and steadied his office, and so sacrificing to Xia he matched Heaven;',
    'Shaokang gathered the people and steadied his charge, and by sacrificing to Xia he matched Heaven;',
  ],
  s0106: [
    'King Ping dwelt in righteousness and moved east, and so the Zhou of the Ancestor divined its age.',
    'King Ping held to righteousness and moved east, and so the Ancestral Zhou divined its span of years.',
  ],
  s0107: [
    'Guangwu of Han, for capturing the lawless, saw the Jing era bloom again;',
    'Han Guangwu, because he could seize the lawless, saw the Jing calendar flourish again;',
  ],
  s0108: [
    'Zhongzong, for not defying the multitude\'s counsel, could be established in Jiangdong.',
    'Zhongzong, because he did not defy the assembly\'s counsel, could be enthroned in Jiangdong.',
  ],
  s0109: [
    'Compared with antiquity today, there is no second plan.',
    'Measured against antiquity today, there is no second counsel.',
  ],
  s0110: [
    'I humbly consider that Your Majesty\'s utmost filial piety penetrates the hidden realms, your heroism and martial resolve are sharp and clear—you face the calamity of seven-nines yet answer the term of a thousand years;',
    'I humbly consider that Your Majesty\'s filial piety reaches into the unseen, your heroism and martial clarity are keen—you meet the calamity of seven-nines and answer the term of a thousand years;',
  ],
  s0111: [
    'you open the brightness within deep sorrow and stand at the gathering of a hundred kings.',
    'you open light within deep sorrow and stand where a hundred kings meet.',
  ],
  s0112: [
    'You take awe and fix hegemony through peril and hardship, raise altars and order armies, ever following the ancient Way.',
    'You take awe and fix hegemony through peril and hardship, raise altars and order armies, ever following the ancient Way.',
  ],
  s0113: [
    'Affairs of house and state have come to this.',
    'Affairs of house and state have come to this pass.',
  ],
  s0114: [
    'Heaven\'s mandate to Great Liang surely must have a lord.',
    'Heaven\'s mandate to Great Liang surely must have a lord.',
  ],
  s0115: [
    'When Xuanyuan received his surname, two survived;',
    'When Xuanyuan received his surname, only two survived;',
  ],
  s0116: [
    'among Gaozu\'s five princes, your generation truly holds the eldest.',
    'among Gaozu\'s five princes, your generation truly holds the eldest rank.',
  ],
  s0117: [
    'You ride the chariot as Qu Wan did to array the feudal lords, bow as Zi Wu did and receive the great carriage.',
    'You ride as Qu Wan did to array the feudal lords, bow as Zi Wu did and receive the great carriage.',
  ],
  s0118: [
    'Your merit equals the Nine Domains, your Way succors the living people.',
    'Your merit equals the Nine Domains, your Way succors the living people.',
  ],
  s0119: [
    'Unless we serve the sacred and bright, who will succeed the martial below?',
    'Unless we serve the sacred and bright, who will succeed the martial below?',
  ],
  s0120: [
    'I have heard that sun and moon stand in bright constancy—the great sun cannot long withhold its light;',
    'I have heard that sun and moon stand in bright constancy—the great sun cannot long withhold its light;',
  ],
  s0121: [
    'Heaven and earth stand in constant regard—the Way of Qian cannot long remain in caution.',
    'Heaven and earth stand in constant regard—the Way of Qian cannot long remain in caution.',
  ],
  s0122: [
    'The yellow canopy and left banner-pole are honored for the hundred millions;',
    'The yellow canopy and left banner-pole are honored for the hundred millions;',
  ],
  s0123: [
    'the phoenix carriage and dragon insignia are held noble for suburban sacrifice.',
    'the phoenix carriage and dragon insignia are held noble for suburban sacrifice.',
  ],
  s0124: [
    'The sacred vessel rests in utmost weight; stand firm as on a whetstone, cautious lest ease bring slip.',
    'The sacred vessel rests in utmost weight; stand firm as on a whetstone, cautious lest ease bring slip.',
  ],
  s0125: [
    'Can the black-haired people lack a lord for even a brief span? Can the altars of state lack a master for even one day?',
    'Can the black-haired people lack a lord for even a brief span? Can the altars of state lack a master for even one day?',
  ],
  s0126: [
    'I humbly wish Your Majesty to sweep the earth and ascend Mount Zhong, burn offerings to Heaven and renew all things.',
    'I humbly wish Your Majesty to sweep the earth and ascend Mount Zhong, burn offerings to Heaven and renew all things.',
  ],
  s0127: [
    'Affairs press in grim peril, the age rings with turmoil—in this case one need not trouble the Director of the Imperial Clan to present the edict or the Erudites to choose the hour; facing south you may at once take the honored seat, with no virtue to yield to the west.',
    'Affairs press in grim peril, the age rings with turmoil—there is no need to trouble the Director of the Imperial Clan to present the edict or the Erudites to choose the hour; face south and take the honored seat at once, with no virtue to yield westward.',
  ],
  s0128: [
    'When the four quarters know there is one to whom they may turn, only then can the eight hundred begin to join in one purpose.',
    'When the four quarters know there is one to whom they may turn, only then can the eight hundred begin to join in one purpose.',
  ],
  s0129: [
    'The remnant rebels lurk hidden, regalia is buried at the altars—the sign of Qian has already tipped, the measure of Kun already overturned.',
    'The remnant rebels lurk hidden, regalia is buried at the altars—the sign of Qian has already tipped, the measure of Kun already overturned.',
  ],
  s0130: [
    'Cut down Wang Mang\'s cortege, burn Dong Zhuo and light the market, clear all within the passes and seas—rightly for the imperial tombs, break the snowed palace ring and preserve in hope the bells and tripods—yet that millet, swaying, swaying—what words can tell it?',
    'Strike down Wang Mang\'s funeral train, burn Dong Zhuo till the market glows, clear all within the passes and seas—for the imperial tombs, break the snowed palace ring and save what bells and tripods may remain—yet that millet, swaying, swaying—what can be said?',
  ],
  s0131: [
    'Your Majesty continues the bright succession and opens the mandate, taking your palace in old Chu.',
    'Your Majesty continues the bright succession and opens the mandate, taking your palace in old Chu.',
  ],
  s0132: [
    'The order of ancestral temple left and soil-altar right may be provisionally arranged;',
    'The order of ancestral temple left and soil-altar right may be provisionally arranged;',
  ],
  s0133: [
    'the forms of the five rites and six harmonies may be gathered season by season as they come due.',
    'the forms of the five rites and six harmonies may be gathered season by season as they come due.',
  ],
  s0134: [
    'Golden fungus with nine stalks, jade-thatched grass with triple ridges.',
    'Golden fungus with nine stalks, jade-thatched grass with triple ridges.',
  ],
  s0135: [
    'Key defenses discharge their duties, frontier posts face one another.',
    'Key defenses discharge their duties, frontier posts face one another.',
  ],
  s0136: [
    'Sit in the hall of state to receive the four barbarians, ascend the Spirit Terrace to observe cloud-signs, offer the feng on Mount Tai by way of Liangfu, stand on the eastern shore and worship at Mount Riguang.',
    'Sit in the hall of state to receive the four barbarians, ascend the Spirit Terrace to observe cloud-signs, offer the feng on Mount Tai by way of Liangfu, stand on the eastern shore and worship at Mount Riguang.',
  ],
  s0137: [
    'Then with the great ministers of the Three Offices, reconvene to plan capital and countryside.',
    'Then with the great ministers of the Three Offices, reconvene to plan capital and countryside.',
  ],
  s0138: [
    'With the Luo\'s left-bank Chan and right-bank Jian as bounds one may dwell, raise the hall and unfurl the dragon banner—only a king may abide in Hao; why need one toil endlessly at Jianye?',
    'With the Luo\'s left-bank Chan and right-bank Jian as bounds one may dwell, raise the hall and unfurl the dragon banner—only a king may abide in Hao; why need one toil endlessly at Jianye?',
  ],
  s0139: [
    'We your subjects cannot contain our earnest plea—respectfully we bow and present this memorial for your hearing.',
    'We your subjects cannot contain our earnest plea—respectfully we bow and present this memorial for your hearing.',
  ],
  s0140: [
    'The Shizu observed mourning taboo, presided over the great lying-in for three days, and all officials wore white hemp.',
    'The Shizu observed mourning taboo, presided over the great lying-in for three days, and all officials wore white hemp.',
  ],
  s0141: [
    'He then replied: "I, lacking virtue, suffer Heaven\'s calamity; I sleep upon my spear and taste gall, beat my breast and weep blood.',
    'He then replied, "I, lacking virtue, suffer Heaven\'s calamity; I sleep upon my spear and taste gall, beat my breast and weep blood.',
  ],
  s0142: [
    'The cruelty of wind and tree—nothing can overtake what is gone;',
    'The cruelty of wind and tree—nothing can overtake what is gone;',
  ],
  s0143: [
    'the grief of frost and dew—all hundred sorrows gather at once.',
    'the grief of frost and dew—all hundred sorrows gather at once.',
  ],
  s0144: [
    'Just hearing of Bo Sheng\'s calamity deepens the grief I share with Zhongmou.',
    'Just hearing of Bo Sheng\'s calamity deepens the grief I share with Zhongmou.',
  ],
  s0145: [
    'If the great boar is already destroyed and the long snake soon slain, I would then follow Yanling\'s withdrawn track, emulate Zizang\'s lofty yield—how could I rely on Qiu Ting\'s altar, or trouble myself with Fanyang\'s stone?',
    'If the great boar is already destroyed and the long snake soon slain, I would then follow Yanling\'s withdrawn track, emulate Zizang\'s lofty yield—how could I rely on Qiu Ting\'s altar, or trouble myself with Fanyang\'s stone?',
  ],
  s0146: [
    'Hou Jing is Xiang Yu;',
    'Hou Jing is Xiang Yu;',
  ],
  s0147: [
    'Xiao Dong is Yin Xin of Shang.',
    'Xiao Dong is Yin Xin of Shang.',
  ],
  s0148: [
    'Before Chiquan\'s reward, Liu Bang was still called King of Han;',
    'Before Chiquan\'s reward, Liu Bang was still called King of Han;',
  ],
  s0149: [
    'Before the white banners were raised, Fa of Zhou was still called crown prince.',
    'Before the white banners were raised, Fa of Zhou was still called crown prince.',
  ],
  s0150: [
    'The seat of the soaring dragon—who says one may leap to it?',
    'The seat of the soaring dragon—who says one may leap to it?',
  ],
  s0151: [
    'Those who would attach to the phoenix have already heard my intent.',
    'Those who would attach to the phoenix have already heard my intent.',
  ],
  s0152: [
    'Lords, ministers, and officers—take counsel with my resolve, and do not neglect it!"',
    'Lords, ministers, and officers—take counsel with my resolve, and do not neglect it!"',
  ],
  s0153: [
    'Minister of Works Prince Ke of Nanping led more than fifty of the imperial clan, General of the Guards Hu Sengyou led more than two hundred officials, and Zhang Yi, acting governor of Jiangzhou, led more than three hundred clerks and people—all submitting memorials urging accession.',
    'Minister of Works Prince Ke of Nanping led more than fifty of the imperial clan, General of the Guards Hu Sengyou led more than two hundred officials, and Zhang Yi, acting governor of Jiangzhou, led more than three hundred clerks and people—all submitting memorials urging accession.',
  ],
  s0154: [
    'The Shizu firmly declined.',
    'The Shizu firmly declined.',
  ],
  s0155: [
    'On yihai in the eleventh month, Wang Senbian again submitted a memorial, saying:',
    'On yihai in the eleventh month, Wang Senbian again submitted a memorial, saying,',
  ],
  s0156: [
    'The Purple Forbidden stands empty of its seat, the Red Land has no lord—all hundred spirits tremble, ten thousand realms turn their faces to the throne.',
    'The Purple Forbidden Hall stands vacant, the Red Land has no lord—a hundred spirits quiver, ten thousand realms turn toward the throne.',
  ],
  s0157: [
    'Though drunk and sober support one another homeward to Jing Bo, singing and chanting, all bound for Tang\'s suburbs—we still fear Your Majesty will bow your head in tears, your yielding virtue unaccepted as succession.',
    'Though drunk and sober lean on one another toward Jing Bo, singing and chanting, all bound for Tang\'s suburbs—we still fear Your Majesty will bow your head in tears and let yielding virtue go unheeded.',
  ],
  s0158: [
    'The relay-chariot is already on the road—we must heed Song Chang\'s counsel;',
    'The relay-chariot is already on the road—we must heed Song Chang\'s counsel;',
  ],
  s0159: [
    'the imperial equipage is already arrayed—yet still we block Geng Chun\'s urging.',
    'the imperial equipage is already arrayed—yet still we block Geng Chun\'s urging.',
  ],
  s0160: [
    'Mountain lords and pasture chiefs crane their necks; the people of Heaven draw breath in hope.',
    'Mountain lords and pasture chiefs crane their necks; the people of Heaven draw breath in hope.',
  ],
  s0161: [
    'I have heard that when stars wheel and the sun draws near, thunder is struck and lightning lashed—that is called Heaven;',
    'I have heard that when stars wheel and the sun draws near, thunder is struck and lightning lashed—that is called Heaven;',
  ],
  s0162: [
    'when peaks stand and rivers flow, mist is breathed and clouds steamed—that is called Earth.',
    'when peaks stand and rivers flow, mist is breathed and clouds steamed—that is called Earth.',
  ],
  s0163: [
    'To embrace Heaven and Earth\'s blended completion, pierce yin and yang\'s unfathomable depth, and thereby trim and finish the ten thousand things—is this not the sage?',
    'To embrace Heaven and Earth\'s blended completion, pierce yin and yang\'s unfathomable depth, and thereby trim and finish the ten thousand things—is this not the sage?',
  ],
  s0164: [
    'Thus it is said, "Heaven and Earth\'s greatest virtue is life; the sage\'s greatest treasure is the throne.',
    'Thus it is said, "Heaven and Earth\'s greatest virtue is life; the sage\'s greatest treasure is the throne.',
  ],
  s0165: [
    '"Beneath the yellow canopy in the temple hall one does not dwell by one\'s own wish;',
    'Beneath the yellow canopy in the temple hall one does not dwell by one\'s own wish;',
  ],
  s0166: [
    'the clear mirror and goblet at the four crossroads—in teaching, one responds to things as they come.',
    'the clear mirror and goblet at the four crossroads—in teaching, one responds to things as they come.',
  ],
  s0167: [
    'I humbly consider Your Majesty traces antiquity in literary thought, heroic and uniquely penetrating.',
    'I humbly consider Your Majesty traces antiquity in literary thought, heroic and uniquely penetrating.',
  ],
  s0168: [
    'Compared with Duke of Zhou, you are King Wen\'s son;',
    'Compared with Duke of Zhou, you are King Wen\'s son;',
  ],
  s0169: [
    'matched with Emperor Yao, you are Emperor Zhi\'s younger brother.',
    'matched with Emperor Yao, you are Emperor Zhi\'s younger brother.',
  ],
  s0170: [
    'A thousand years\' dawn and dusk—can they lie elsewhere than here?',
    'A thousand years\' dawn and dusk—can they lie elsewhere than here?',
  ],
  s0171: [
    'Court and gate are drowned in ruin, bells and tripods overturned—who but Your Majesty should receive the bright succession?',
    'Court and gate are drowned in ruin, bells and tripods overturned—who but Your Majesty should receive the bright succession?',
  ],
  s0172: [
    'Can we allow the Red Eyebrows to set up Penzi again, or Wei Xiao to enthrone his choice in the High Temple?',
    'Can we allow the Red Eyebrows to set up Penzi again, or Wei Xiao to enthrone his choice in the High Temple?',
  ],
  s0173: [
    'Your Majesty would yet leisurely yield on high, clutching modest light.',
    'Your Majesty would yet leisurely yield on high, clutching modest light.',
  ],
  s0174: [
    'Display their crooked conduct and forged writs, mock the true calendar—the time to act is clear; the decision can be seen.',
    'Display their crooked conduct and forged writs, mock the true calendar—the time to act is clear; the decision can be seen.',
  ],
  s0175: [
    'When doubt is gone, why divine? No need to wait on yarrow or tortoise.',
    'When doubt is gone, why divine? No need to wait on yarrow or tortoise.',
  ],
  s0176: [
    'Lately the high ministers lost the reins, calamity coiled about heaven\'s pole—Hou Jing overran all, treacherous ministers rose in turn; leading armies to strike Ying, nowhere was it otherwise; urging clear punishment of Jin, all stood on tiptoe likewise.',
    'Lately the high ministers lost the reins, calamity coiled about heaven\'s pole—Hou Jing overran all, treacherous ministers rose in turn; leading armies to strike Ying, nowhere was it otherwise; urging clear punishment of Jin, all stood on tiptoe likewise.',
  ],
  s0177: [
    'At night the garrison-clappers sounded, beacon fires lit one another.',
    'At night the garrison-clappers sounded, beacon fires lit one another.',
  ],
  s0178: [
    'Men of the central court looked upon one another, grief in their mouths;',
    'Men of the central court looked upon one another, grief in their mouths;',
  ],
  s0179: [
    'righteous followers from Liangzhou gazed east and shed tears to their death—the trembling common people, whither could they turn!',
    'righteous followers from Liangzhou gazed east and shed tears to their death—the trembling common people, whither could they turn!',
  ],
  s0180: [
    'Your Majesty\'s heroic designs net the heavens, your deep clarity cuts within; you weep blood over a sword laid across your lap, taste gall upon the spear beside your pillow—plans of Nong Mountain and the crumbled mound, counsels from the golden casket and jade tripod—all settled behind the curtain, victory decided a thousand li away.',
    'Your Majesty\'s heroic designs span the heavens, your deep clarity cuts within; you weep blood with a sword across your lap, taste gall beside your pillow—plans of Nong Mountain and the crumbled mound, counsels from the golden casket and jade tripod—all settled behind the curtain, victory decided a thousand li away.',
  ],
  s0181: [
    'You beat the spirit-croc\'s drum and raise the king\'s azure banner, drive the armies of six provinces and marshal the nine lords\' campaign—though the four quarters still worried, one battle made you hegemon.',
    'You beat the spirit-croc\'s drum and raise the king\'s azure banner, drive the armies of six provinces and marshal the nine lords\' campaign—though the four quarters still worried, one battle made you hegemon.',
  ],
  s0182: [
    'You cut down their leviathans; great punishments were already proclaimed; ears cropped, necks bound in cangue—not one was not a traitor; the histories never stopped writing, the archives had no empty month.',
    'You cut down their leviathans; great punishments were already proclaimed; ears cropped, necks bound in cangue—not one was not a traitor; the histories never stopped writing, the archives had no empty month.',
  ],
  s0183: [
    'Since the waves of Dongting grew calm and Pengli was settled, civil brilliance and martial depth fragrant as pepper and orchid, enemy states lowered their walls in peace like kin, nine domains took counsel together, a hundred roads advanced as one—national shame and family grudge were reckoned to be whitened soon, the altars would not fall: all hung upon sacred brilliance.',
    'Since the waves of Dongting grew calm and Pengli was settled, civil brilliance and martial depth fragrant as pepper and orchid, enemy states lowered their walls in peace like kin, nine domains took counsel together, a hundred roads advanced as one—national shame and family grudge were reckoned to be whitened soon, the altars would not fall: all hung upon sacred brilliance.',
  ],
  s0184: [
    'What hour is this, yet you voice Di Qi\'s withdrawal; peril so grim, yet you set forth the Earl of Tai\'s words?',
    'What hour is this, yet you voice Di Qi\'s withdrawal; peril so grim, yet you set forth the Earl of Tai\'s words?',
  ],
  s0185: [
    'The state has its proper ministers—who dares accept an edict of delay?',
    'The state has its proper ministers—who dares accept an edict of delay?',
  ],
  s0186: [
    'All under Heaven is Great Gaozu\'s Heaven; Your Majesty is the ten thousand realms\' heart\'s joy—the realms cannot lack a lord, Gaozu cannot lack sacrifice.',
    'All under Heaven is Great Gaozu\'s Heaven; Your Majesty is the ten thousand realms\' heart\'s joy—the realms cannot lack a lord, Gaozu cannot lack sacrifice.',
  ],
  s0187: [
    'That very night the five stars gathered; the eight winds blew through; clouds and mist welled thick, sun and moon shone with glory; the hundred offices moved as omens dictated, military affairs stood ready without rallying call.',
    'That very night the five stars gathered; the eight winds blew through; clouds and mist welled thick, sun and moon shone with glory; the hundred offices moved as omens dictated, military affairs stood ready without rallying call.',
  ],
  s0188: [
    'Flying war-boats and great ships filled the waters and floated upon the streams;',
    'Flying war-boats and great ships filled the waters and floated upon the streams;',
  ],
  s0189: [
    'iron horses and silver saddles crossed mountains and spanned valleys.',
    'iron horses and silver saddles crossed mountains and spanned valleys.',
  ],
  s0190: [
    'heroes came one on another\'s heels, the loyal and brave looked to one another—some drowned their clans to repay grace, some burned wife and children to answer their lord.',
    'heroes came one on another\'s heels, the loyal and brave looked to one another—some drowned their clans to repay grace, some burned wife and children to answer their lord.',
  ],
  s0191: [
    'None failed to turn shield and bear awe, lift axe and strike the mass—wind-flying, lightning-flashing, wills bent on extinguishing the vicious and ugly.',
    'None failed to turn shield and bear awe, lift axe and strike the mass—wind-flying, lightning-flashing, wills bent on extinguishing the vicious and ugly.',
  ],
  s0192: [
    'What awaits is only Your Majesty proclaiming to the earth below, reverently serving the Lord on High, broadly issuing a bright edict, taking the army forth with righteousness named—five elements returned by evening, six armies advancing at dawn—then one would fully wield the Minister of Crime\'s awe, pursue the War of Chiyu to its end, seize Shi Le of Zhao and demand the seal, cut down Yao Qin and take the bells, repair and sweep the imperial tombs, welcome home the ancestral temple.',
    'All that awaits is Your Majesty proclaiming to the earth below, reverently serving the Lord on High, broadly issuing a bright edict, taking the army forth in righteousness\'s name—five elements home by evening, six armies advancing at dawn—then fully wield the Minister of Crime\'s awe, pursue Chiyu\'s war to its end, seize Shi Le of Zhao and demand the seal, cut down Yao Qin and take the bells, repair and sweep the imperial tombs, welcome home the ancestral temple.',
  ],
  s0193: [
    'How can Your Majesty fail to look up and preserve the state\'s plan, bow down and follow the people\'s plea?',
    'How can Your Majesty fail to look up and preserve the state\'s plan, bow down and follow the people\'s plea?',
  ],
  s0194: [
    'After Emperor Xuan of Han succeeded, he at once sent the army to Lake Pulei;',
    'After Emperor Xuan of Han succeeded, he at once sent the army to Lake Pulei;',
  ],
  s0195: [
    'when Guangwu had finished ascending the pole, only then came victory at Chang\'an.',
    'when Guangwu had finished ascending the pole, only then came victory at Chang\'an.',
  ],
  s0196: [
    'Spoken thus, precedent is not lacking.',
    'Spoken thus, precedent is not lacking.',
  ],
  s0197: [
    'We your subjects have either received dynastic favor through generations or borne heavy kindness in person; we share fortune and disaster, from state to family—forfeit life if need be, we dare not hold back our hearts.',
    'We your subjects have either received dynastic favor through generations or borne heavy kindness in person; we share fortune and disaster, from state to family—forfeit life if need be, we dare not hold back our hearts.',
  ],
  s0198: [
    'Unable to bear our utmost earnestness, we respectfully present this memorial again for your hearing.',
    'Unable to bear our utmost earnestness, we respectfully present this memorial again for your hearing.',
  ],
  s0199: [
    'The Shizu replied: "Your memorial is received; you have set it out point by point once more.',
    'The Shizu replied, "Your memorial is received; you have set it out point by point once more.',
  ],
  s0200: [
    'I have heard that Heaven bore the teeming people and set a lord over them, to echo Heaven\'s favor and shepherd the black-haired masses.',
    'I have heard that Heaven bore the teeming people and set a lord over them, to echo Heaven\'s favor and shepherd the black-haired masses.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_005_b2.mjs <translation.json>'
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
