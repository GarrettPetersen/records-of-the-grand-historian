#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'Thus I came to wear the imperial robe myself, eat food fit for jade, enjoy wealth and honor in my prime, and bring glory to my person and lineage.',
    'Thus I came to wear the imperial robe myself, dine on food fit for jade, enjoy wealth and honor in my prime, and bring glory to my person and lineage.',
  ],
  s0102: [
    'Why then, all at once raising banners and standards, beating drums, and facing north in resistance—why?',
    'Why then did I suddenly raise banners, beat the drums, and turn north to resist you?',
  ],
  s0103: [
    'Truly because I feared destruction and dreaded inviting disaster—sacrificing the body without righteousness means both body and name are destroyed.',
    'Because I feared ruin and dreaded inviting disaster—dying for no righteous cause destroys both body and name.',
  ],
  s0104: [
    'Why so?',
    'Why?',
  ],
  s0105: [
    'In the twilight of last year my lord fell ill; the spirits did not bless the good, and prayers could not cure him.',
    'At the end of last year my lord fell ill; heaven did not protect the good, and no prayer could cure him.',
  ],
  s0106: [
    'Thus favored minions seized power, eunuchs ran wild with deceit, above and below mutually suspected one another, and confidants split in loyalty.',
    'Favored minions seized power, eunuchs spun deceit, court and camp turned on each other, and trusted men divided their loyalties.',
  ],
  s0107: [
    'My wife and children were at home, yet without cause were besieged;',
    'My wife and children were at home, yet for no reason they were besieged;',
  ],
  s0108: [
    'the plot of Duan Kang—I know not why;',
    'the plot involving Duan Kang—I do not know why;',
  ],
  s0109: [
    'Lu Qian entered the army—for what reason I could not tell.',
    'Lu Qian entered the army—for what reason I could not tell.',
  ],
  s0110: [
    'Treading cautiously, I constantly trembled with fear; with shame upon my face, how could I not doubt myself?',
    'I walked on eggshells and lived in dread; with shame burning on my face, how could I not doubt myself?',
  ],
  s0111: [
    'When I returned to the army at Changshe, hoping to explain myself, my letter had not arrived before the axe and yue were already at hand.',
    'When I returned to the army at Changshe hoping to explain myself, my letter had not even arrived before the executioner\'s axe was at my throat.',
  ],
  s0112: [
    'With banners already facing each other, barely a stone\'s throw apart, I sent letters again and again, also stating my humble feelings;',
    'Our banners already faced each other, barely a spear\'s length apart; I sent letter after letter, pleading my case as best I could;',
  ],
  s0113: [
    'yet your host relied on its strength, disdained me utterly, wheeled halberds and thrust with blades, intent solely on slaughter.',
    'yet your army trusted its numbers, ignored me completely, wheeled halberds and drove the blades, bent on nothing but annihilation.',
  ],
  s0114: [
    'They built siege works and dammed water; only three planks of the wall remained; we looked at each other—life hung by a moment; unable to bear death, I went out to fight below the walls.',
    'They built earthworks and dammed the water; only three layers of wall remained; we stared at one another with our lives on the clock; unable to wait for death, I went out to fight beneath the walls.',
  ],
  s0115: [
    'Beasts hate death; human nature loves life—yielding territory and submitting to Qin was no joy.',
    'Beasts hate death and men love life—surrendering land and submitting to Qin was no pleasure of mine.',
  ],
  s0116: [
    'Yet my lord in times past treated me as an equal, shoulder to shoulder in praising the imperial house—though circumstances differed and seasons varied slightly, Chancellor and Minister of Works were merely geese flying in formation.',
    'Yet in the past my lord treated me as an equal, shoulder to shoulder in serving the imperial house—though our stations differed and seasons changed, Chancellor and Minister of Works were only geese in a single flight.',
  ],
  s0117: [
    'Fortune, salary, rank, and glory are Heaven\'s grants, earned after labor—the matter is unrelated; to seek to swallow charcoal—how absurd!',
    'Fortune, salary, rank, and glory are gifts of Heaven, earned only after toil—the cases have nothing to do with each other; to demand I swallow charcoal—how absurd!',
  ],
  s0118: [
    'Yet stealing another\'s wealth is still called theft; when salary left the public office, we considered it something not to take.',
    'Stealing another man\'s wealth is still called theft; when salary left the public treasury, we both refused to take what was not ours.',
  ],
  s0119: [
    'Now Wei\'s virtue may be in decline, but Heaven\'s mandate has not changed—pleading for favor in a private residence is hardly worth mention.',
    'Wei\'s virtue may be fading, but Heaven\'s mandate has not changed—begging for grace in a private house is hardly worth discussing.',
  ],
  s0120: [
    'You showed me "unable to seal off Hangu eastward, subject to others\' control"—as if teaching me to praise Ji Zhong while honoring the Ji clan.',
    'You wrote that I was "unable to seal Hangu in the east and subject to others\' control"—as if instructing me to praise Ji Zhong while exalting the Ji clan.',
  ],
  s0121: [
    'A lordless state—in ritual never heard of; acting without law, how can one take instruction?',
    'A state without a lord is nowhere mentioned in ritual; to act without law—how can one learn from that?',
  ],
  s0122: [
    'I hold that sharing wealth to raise the young brings a fitting end; giving up a house to preserve orphans—who calls that a petty rupture?',
    'I believe that sharing wealth to raise the young is a proper ending, and giving up a house to save orphans—who would call that a petty break?',
  ],
  s0123: [
    'You also say I "lack the numbers to strengthen myself, danger like piled eggs."',
    'You also say my forces "are too few to stand alone, perilous as piled eggs."',
  ],
  s0124: [
    'Yet Zhou had billions of barbarian subjects and in the end was reduced by the Ten Disorders;',
    'Yet Zhou had billions of subjects and in the end fell to the Ten Disorders;',
  ],
  s0125: [
    'Jie\'s hundred victories—in the end he had no successor.',
    'Jie won a hundred battles and in the end left no heir.',
  ],
  s0126: [
    'The battle at Yingchuan is the mirror of Yin.',
    'The battle at Yingchuan is the warning mirror of the Shang.',
  ],
  s0127: [
    'Weight and lightness depend on men, not the tripod on virtue alone.',
    'Whether a state stands or falls depends on its men, not on the tripod alone.',
  ],
  s0128: [
    'If one can be loyal and faithful, though weak one must become strong.',
    'If one can be loyal and faithful, even the weak must grow strong.',
  ],
  s0129: [
    'Deep worry gives birth to sagacity—what hardship in standing in peril?',
    'Deep worry breeds wisdom—what hardship is there in standing in danger?',
  ],
  s0130: [
    'Moreover now the Liang Way is harmonious and bright; it gathers the distant by ritual, cloaks us in tiger-pattern robes, and ties us with noble ranks.',
    'Moreover the Liang Way is now broad and bright; it gathers the distant by ritual, robes us in tiger-pattern insignia, and binds us with noble ranks.',
  ],
  s0131: [
    'It intends to take the Five Peaks as parks and the Four Seas as ponds, sweep barbarian filth to rescue the people, tie down Ou and Yue in the east, and open Qian and Long in the west.',
    'It means to make the Five Peaks its park and the Four Seas its pond, sweep away barbarian filth to save the people, bind Ou and Yue in the east, and open Qian and Long in the west.',
  ],
  s0132: [
    'Wu and Chu are fierce and sharp, with a thousand groups in armor;',
    'Wu and Chu are fierce and sharp, with a thousand armored hosts;',
  ],
  s0133: [
    'Wu soldiers and Ji horses, a hundred thousand with bowstrings drawn.',
    'Wu troops and Ji horses, a hundred thousand bowstrings drawn.',
  ],
  s0134: [
    'Together with the righteous warriors under my command thick as a forest, rousing righteousness to seize glory, erupting without warning—a great wind one blast and dry trunks must fall; frost briefly drops and autumn fruit falls of itself.',
    'Add the righteous warriors under my command, thick as a forest, rousing righteousness to win glory and striking without warning—a great wind one gust and dry trunks snap; frost falls for a moment and autumn fruit drops by itself.',
  ],
  s0135: [
    'If this is called weak, who dare call himself strong!',
    'If this is weak, who has the right to call himself strong!',
  ],
  s0136: [
    'Again I am slandered from both sides, suspected by two states.',
    'Again I am slandered from both sides and suspected by two states.',
  ],
  s0137: [
    'Weighing human sentiment—how could it come to this!',
    'Weighing how men feel—how could it come to this!',
  ],
  s0138: [
    'In the past Chen Ping turned from Chu; returning to Han he was made king;',
    'In the past Chen Ping abandoned Chu; when he returned to Han he was made king;',
  ],
  s0139: [
    'Baili left Yu; entering Qin he became hegemon.',
    'Baili left Yu; entering Qin he became hegemon.',
  ],
  s0140: [
    'Brightness and darkness depend on the ruler; use and discard depend on the times—follow ritual and act, and the spirits will shelter you.',
    'Clarity and obscurity depend on the ruler; use and discard depend on the times—follow ritual and act, and the spirits will protect you.',
  ],
  s0141: [
    'Your letter says troops and horses are fresh and new, on a set day all will advance together, boasting of strategic advantage, pointing to a date for total destruction.',
    'Your letter says troops and horses are fresh, that on a fixed day all will march together, boasting of strategic advantage and promising total destruction by a set date.',
  ],
  s0142: [
    'I note that cold wind and white dew—the seasons are the same;',
    'I note that cold wind and white dew—the seasons are the same;',
  ],
  s0143: [
    'autumn wind raises dust—the horse\'s head—what difference?',
    'autumn wind raises dust from the horses\' hooves—what difference does that make?',
  ],
  s0144: [
    'You only know the struggle for power in the north, not the alliance of west and south; if you wish to indulge your will on the road ahead, you do not notice the pitfall at your side.',
    'You see only the power struggle in the north, not the alliance of west and south; if you indulge your will on the road ahead, you will not notice the pitfall beside you.',
  ],
  s0145: [
    'If you say to leave danger and return to the true calendar, turn calamity to escape the net—there they already mock my folly and blindness, here too they laugh at your obscurity.',
    'If you say to leave danger, return to the true calendar, and turn calamity into escape from the net—there they already mock my folly, and here they laugh at your blindness.',
  ],
  s0146: [
    'Now I have already drawn in two states, raised banners for a northern campaign, bear and tiger together rousing, to recover the Central Plain—Jing, Xiang, Guang, and Ying already belong to the west; Xiangcheng and Xuan\'gu also obey the Southern Court; take them yourself if you please—why trouble yourself with gracious bestowal.',
    'I have already drawn in two states, raised banners for a northern campaign, and roused bear and tiger together to recover the Central Plain—Jing, Xiang, Guang, and Ying already belong to the west; Xiangcheng and Xuan\'gu already serve the Southern Court; take them yourself if you wish—why need your gracious grant?',
  ],
  s0147: [
    'Yet expedients vary endlessly; reason has ten thousand paths.',
    'Yet expedients vary endlessly; reason has ten thousand paths.',
  ],
  s0148: [
    'For your planning, nothing better than dividing territory and making peace in two, three parts standing like tripods—Yan, Wei, Jin, and Zhao enough to supply each other\'s salaries; Qi, Cao, Song, and Lu all returning to Great Liang—let me contribute strength to the Southern Court, cement affinity ties with the north, silks going back and forth, war chariots unmoving.',
    'For your planning, nothing beats dividing the land and making peace in two—three kingdoms standing like tripods—Yan, Wei, Jin, and Zhao supplying one another\'s salaries; Qi, Cao, Song, and Lu all returning to Great Liang—let me serve the Southern Court, bind ties with the north, exchange silks, and keep war chariots still.',
  ],
  s0149: [
    'I would establish merit for the age; you would complete the work of ancestors and fathers—each guarding our borders, personally enjoying the seasons, the people peaceful, the four classes settled.',
    'I would win merit for the age; you would finish the work of ancestors and fathers—each keeping his borders, enjoying the seasons in peace, the people tranquil, the four classes settled.',
  ],
  s0150: [
    'Compared with driving farmers from the fields, resisting fierce enemies on three sides, avoiding weapons at head and tail, meeting blades and arrowheads at the heart—',
    'How much better that than driving farmers from the fields, facing fierce enemies on three sides, dodging weapons at both ends, and taking blades and arrows in the heart—',
  ],
  s0151: [
    'even with the Grand Duke as general, one cannot survive; entrusted to your lofty wisdom—how can you overcome and succeed?',
    'even with the Grand Duke as general one could not survive; given to your lofty wisdom—how could you overcome and succeed?',
  ],
  s0152: [
    'Again searching your letter, it says my wife and children are all detained by the Minister of Justice.',
    'Reading your letter again, it says my wife and children are all held by the Minister of Justice.',
  ],
  s0153: [
    'Using them to threaten me—perhaps it could succeed.',
    'Using them to threaten me—perhaps that could work.',
  ],
  s0154: [
    'This must be narrow-minded suspicion, not understanding the larger design.',
    'That must be narrow suspicion, not understanding the larger design.',
  ],
  s0155: [
    'Why so?',
    'Why?',
  ],
  s0156: [
    'In the past Wang Ling adhered to Han—his mother alive, he did not return;',
    'In the past Wang Ling sided with Han—though his mother lived, he did not return;',
  ],
  s0157: [
    'the Supreme One was prisoner of Chu—begged for broth as if normal.',
    'the Supreme One was prisoner of Chu—he begged for broth as if nothing were wrong.',
  ],
  s0158: [
    'How much more so—mere wife and children—could one care?',
    'How much less, then, should mere wife and children matter?',
  ],
  s0159: [
    'If killing them were said to help, wanting to stop but unable;',
    'If killing them were said to help, you might want to stop but could not;',
  ],
  s0160: [
    'killing them without loss—only further massacre in vain.',
    'killing them without loss would only add pointless slaughter.',
  ],
  s0161: [
    'My family\'s lives are in your hands—what has that to do with me?',
    'My family\'s lives are in your hands—what has that to do with me?',
  ],
  s0162: [
    'What Zun Dao transmitted is also not without reason, but while in bonds I fear I cannot be complete—therefore I restate my case and again discuss sincerity.',
    'What Zun Dao reported is not entirely wrong, but while in chains I fear I cannot say everything—so I restate my case and speak again of sincerity.',
  ],
  s0163: [
    'What I hope for is a good plan; please timely grant a reply.',
    'What I hope for is a wise plan; please reply in good time.',
  ],
  s0164: [
    'Yet in the past with our covenant lord, our affairs were like lute and zither—slanderers came between us and we turned into enemies.',
    'Yet in the past with our covenant lord our bond was like lute and zither—slanderers came between us and we became enemies.',
  ],
  s0165: [
    'Touching the strings and grasping the arrow, I unknowingly wound my heart; tearing silk to reply—how can words suffice?',
    'Touching the strings and grasping the arrow, I wound my own heart without noticing; tearing silk to write back—how can words say enough?',
  ],
  s0166: [
    'In the twelfth month, Jing led troops to besiege Qiao city but could not take it; withdrew to attack Chengfucheng and captured it.',
    'In the twelfth month Jing led troops to besiege Qiao but failed to take it; he withdrew to attack Chengfucheng and captured it.',
  ],
  s0167: [
    'He also sent his Mobile Headquarters Left Director Wang Wei and Left Civil Affairs Attendant Wang Ze to the palace with a plan, asking that a member of the Yuan clan be installed as Wei ruler to assist in a northern campaign—they assented.',
    'He also sent his Mobile Headquarters Left Director Wang Wei and Left Civil Affairs Attendant Wang Ze to court with a plan, asking that a Yuan prince be installed as Wei ruler to assist a northern campaign—the court agreed.',
  ],
  s0168: [
    'An edict sent the Crown Prince\'s Aide Yuan Zhen as Prince of Xianyang; once he crossed the river he was granted the false throne, with imperial carriage attendants to supply him.',
    'An edict sent Crown Prince\'s Aide Yuan Zhen as Prince of Xianyang; once he crossed the river he would take the false throne, with imperial carriage attendants provided for him.',
  ],
  s0169: [
    'Qi Wenxiang again sent Murong Shaozong to pursue Jing; Jing withdrew into Woyang, still had several thousand horses, tens of thousands of armored soldiers, more than ten thousand carts—a standoff north of the Wo River.',
    'Qi Wenxiang again sent Murong Shaozong to pursue Jing; Jing withdrew into Woyang with several thousand horses, tens of thousands of armored men, and more than ten thousand carts—a standoff north of the Wo River.',
  ],
  s0170: [
    'Jing\'s army ran out of food; the soldiers were all northerners, unwilling to cross south; his generals Bao Xian and others each led their units to surrender to Shaozong.',
    'Jing\'s army ran out of food; his soldiers were all northerners and unwilling to cross south; generals such as Bao Xian each led their units to surrender to Shaozong.',
  ],
  s0171: [
    'Jing\'s army collapsed and scattered; then with a few trusted horsemen he himself crossed the Huai at Xiashi, gradually gathered scattered troops, got eight hundred foot and horse, fled to Shouyang; Acting Prefect Wei An received him.',
    'Jing\'s army broke and scattered; with a few trusted horsemen he crossed the Huai at Xiashi himself, slowly gathered scattered troops until he had eight hundred foot and horse, fled to Shouyang, and Acting Prefect Wei An took him in.',
  ],
  s0172: [
    'Jing memorialized asking to be demoted and stripped; a gracious edict refused; he was still made Inspector of Yuzhou, original posts unchanged.',
    'Jing memorialized asking to be demoted and stripped; a gracious edict refused; he remained Inspector of Yuzhou with his original posts unchanged.',
  ],
  s0173: [
    'Once Jing held Shouchun, he harbored rebellion; residents of subordinate cities were all conscripted as soldiers; market dues and land tax were halted; commoners\' sons and daughters were all assigned to officers and soldiers.',
    'Once Jing held Shouchun he turned rebellious; residents of subordinate cities were all conscripted as soldiers; market dues and land tax were stopped; commoners\' sons and daughters were all assigned to officers and soldiers.',
  ],
  s0174: [
    'He also memorialized requesting ten thousand bolts of brocade for soldiers\' robes; Supreme Commander Zhu Yi argued the imperial brocade office only supplied rewards near and far—it could not furnish border garrison military dress; request to send blue cloth instead.',
    'He also memorialized requesting ten thousand bolts of brocade for soldiers\' robes; Supreme Commander Zhu Yi argued the imperial brocade office only supplied rewards near and far and could not clothe border garrisons—blue cloth should be sent instead.',
  ],
  s0175: [
    'Jing got the cloth, used it all for robes and jackets, and hence favored azure.',
    'Jing got the cloth, used it all for robes and jackets, and from then on favored azure.',
  ],
  s0176: [
    'Also because the weapons supplied by the court were mostly not fine, he memorialized requesting Eastern Workshop smiths to rebuild—an edict granted them all.',
    'Because the weapons supplied by the court were mostly poor, he memorialized requesting Eastern Workshop smiths to rebuild them—an edict granted all he asked.',
  ],
  s0177: [
    'After Jing\'s defeat at Woyang, he made many demands; the court was tolerant and never refused.',
    'After Jing\'s defeat at Woyang he made many demands; the court was tolerant and never refused.',
  ],
  s0178: [
    'Earlier, Inspector of Yuzhou Marquis Yuanming of Zhenyang had supervised the host besieging Pengcheng; the army was defeated and he perished in Wei.',
    'Earlier, Yuzhou Inspector Marquis Yuanming of Zhenyang had commanded the armies besieging Pengcheng; the army was defeated and he perished in Wei.',
  ],
  s0179: [
    'At this time he sent envoys back reporting the Wei people asked to renew the former friendship.',
    'At this time he sent envoys back saying the Wei people asked to renew the former friendship.',
  ],
  s0180: [
    'In the second month of the second year, Gaozu again made alliance with Wei.',
    'In the second month of the second year Gaozu again made alliance with Wei.',
  ],
  s0181: [
    'Jing heard and feared; sent urgent memorials firmly remonstrating—Gaozu would not listen.',
    'Jing heard and was afraid; he sent urgent memorials firmly remonstrating, but Gaozu would not listen.',
  ],
  s0182: [
    'Thereafter his memorials were arrogant, his words irreverent.',
    'Thereafter his memorials grew arrogant and his words irreverent.',
  ],
  s0183: [
    'Prince Fan of Poyang was garrisoned at Hefei, and Inspector of Si Province Yang Yaren both repeatedly memorialized that Jing had rebellious intent; Zhu Yi said: "Hou Jing—a few hundred rebel captives—how can he be of service?',
    'Prince Fan of Poyang held Hefei, and Si Province Inspector Yang Yaren both repeatedly memorialized that Jing had rebellious intent; Zhu Yi said, "Hou Jing—a few hundred rebel captives—how can he be of any use?',
  ],
  s0184: [
    '" All were suppressed without being reported upward, yet rewards only increased—thus his treacherous plot grew bolder.',
    '" All were suppressed without being reported upward, yet rewards only increased—so his treacherous plot grew bolder.',
  ],
  s0185: [
    'He also knew Prince Zhengde of Linhe resented the court; secretly sent to win him over—Zhengde promised to open from within.',
    'He also knew Prince Zhengde of Linhe resented the court; he secretly sent to win him over, and Zhengde promised to open the gates from within.',
  ],
  s0186: [
    'In the eighth month, Jing then raised troops in rebellion, attacked Matou and Mu Fort, seized Administrator Liu Shenmao, garrison commander Cao Qiu, and others.',
    'In the eighth month Jing raised troops in rebellion, attacked Matou and Mu Fort, and seized Administrator Liu Shenmao, garrison commander Cao Qiu, and others.',
  ],
  s0187: [
    'Thereupon an edict made Inspector of Yingzhou Prince Fan of Poyang southern-route Commander, Inspector of North Xuzhou Marquis Zhengbiao of Fengshan northern-route Commander, Inspector of Si Province Liu Zhongli western-route Commander, General-of-Regular-Gateway Attendant Pei Zhigao eastern-route Commander, all to attack Jing together, crossing from Liyang;',
    'Thereupon an edict made Yingzhou Inspector Prince Fan of Poyang southern-route commander, North Xuzhou Inspector Marquis Zhengbiao of Fengshan northern-route commander, Si Province Inspector Liu Zhongli western-route commander, and General-of-Regular-Gateway Attendant Pei Zhigao eastern-route commander, all to attack Jing together, crossing from Liyang;',
  ],
  s0188: [
    'also ordered General with Staff Equal to the Three Dukes, Danyang Governor, Prince Lun of Shaoling to bear the staff and supervise the host.',
    'It also ordered General with Staff Equal to the Three Dukes, Danyang governor, Prince Lun of Shaoling to bear the staff and supervise the armies.',
  ],
  s0189: [
    'In the tenth month, Jing left his Central Army Wang Xiankui to hold Shouchun city, marched out feigning toward Hefei, then suddenly attacked Qiaozhou; Assistant Defender Dong Shaoxian opened the gates and surrendered; seized Inspector Marquis Tai of Fengcheng.',
    'In the tenth month Jing left Central Army Wang Xiankui to hold Shouchun, marched out feigning toward Hefei, then suddenly attacked Qiaozhou; Assistant Defender Dong Shaoxian opened the gates and surrendered; Inspector Marquis Tai of Fengcheng was seized.',
  ],
  s0190: [
    'Gaozu heard and sent Crown Prince House Steward Wang Zhi with three thousand troops to patrol the river and block.',
    'Gaozu heard and sent Crown Prince House Steward Wang Zhi with three thousand troops to patrol the river and block the crossing.',
  ],
  s0191: [
    'Jing advanced to attack Liyang; Liyang Administrator Zhuang Tie sent his younger brother Jun with several hundred men to raid Jing\'s camp by night—failed; Jun died in battle; Tie again surrendered to him.',
    'Jing advanced to attack Liyang; Liyang Administrator Zhuang Tie sent his younger brother Jun with several hundred men to raid Jing\'s camp by night but failed; Jun died in battle, and Tie surrendered to him again.',
  ],
  s0192: [
    'Xiao Zhengde first sent several dozen large ships, falsely claiming to carry reeds—in reality equipped to ferry Jing.',
    'Xiao Zhengde first sent several dozen large ships, falsely claiming to carry reeds but in reality ready to ferry Jing.',
  ],
  s0193: [
    'Jing reached Jingkou, about to cross, fearing Wang Zhi would obstruct.',
    'Jing reached Jingkou and was about to cross, fearing Wang Zhi would block him.',
  ],
  s0194: [
    'Suddenly Zhi withdrew for no apparent reason; Jing heard but did not yet believe; he secretly sent scouts.',
    'Suddenly Zhi withdrew for no apparent reason; Jing heard but did not yet believe it, and secretly sent scouts.',
  ],
  s0195: [
    'He told the messenger: "If Zhi has truly withdrawn, break branches from east-of-river trees as proof.',
    'He told the messenger, "If Zhi has truly withdrawn, break branches from east-of-river trees as proof.',
  ],
  s0196: [
    '" The scout returned as instructed; Jing rejoiced greatly: "My business is accomplished.',
    '" The scout returned as instructed; Jing rejoiced greatly and said, "My business is accomplished.',
  ],
  s0197: [
    '" Then he himself crossed from Caishi—several hundred horses, a thousand soldiers—the capital did not notice.',
    '" Then he crossed from Caishi himself—several hundred horses, a thousand soldiers—and the capital did not notice.',
  ],
  s0198: [
    'Jing then divided forces to strike Gudu, seized Huainan Administrator Marquis Ning of Wencheng, and reached Cihu.',
    'Jing then divided his forces to strike Gudu, seized Huainan Administrator Marquis Ning of Wencheng, and reached Cihu.',
  ],
  s0199: [
    'Thereupon an edict made Inspector of Yangzhou Prince Daqi of Xuancheng commander of all forces within the walls, Minister of Justice Yang Kan as Army Advisor General to assist;',
    'Thereupon an edict made Yangzhou Inspector Prince Daqi of Xuancheng commander of all forces within the walls, and Minister of Justice Yang Kan Army Advisor General to assist him;',
  ],
  s0200: [
    'Marquis Tui of Nanpu held the Eastern Palace city, Duke Dachun of Xifeng held Stone City, Light Chariot Chief Clerk Xie Xi held Baixia.',
    'Marquis Tui of Nanpu held the Eastern Palace city, Duke Dachun of Xifeng held Stone City, and Light Chariot Chief Clerk Xie Xi held Baixia.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_056_b2.mjs <translation.json>'
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
