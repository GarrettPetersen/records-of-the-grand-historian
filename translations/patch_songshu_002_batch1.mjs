import fs from 'node:fs';

const data = JSON.parse(
  fs.readFileSync('translations/current_translation_songshu.json', 'utf8')
);

const T = {
  s0102: [
    'A commoner in plain cloth, he restored the altars of state; south he destroyed Lu Xun, north he pacified Guanggu—in a thousand years, no achievement has equaled his.',
    'Born a commoner, he restored the dynasty; in the south he crushed Lu Xun, in the north he took Guanggu. In a thousand years, no man had matched such feats.',
  ],
  s0103: [
    'From this the Four Seas turned to praise him, and court and countryside alike exalted him.',
    'All under Heaven sang his praise, and court and country alike held him in awe.',
  ],
  s0104: [
    'Once he stood at the summit as terrace lord and pasturage minister, his power overawed the sovereign; he could not treat his achievements with the Way, but relied on favor and waxed arrogant beyond measure.',
    'Once he held the highest posts and his power eclipsed the throne, he could not bear his merit with restraint. Swollen by favor, he grew insufferably proud.',
  ],
  s0105: [
    'He considered that rewards had reached their limit, and his heart set on being above all; punishments and executions were perverse and excessive, and government was cruel and harsh.',
    'Thinking he had been rewarded to the full, he set his heart on standing above all. Executions ran wild, and his rule turned brutal and harsh.',
  ],
  s0106: [
    'The traces of his desire to seize the vessel grew plainer day by day, and the rites owed by a subject were suddenly cast aside.',
    'Day by day his ambition to seize the throne showed more plainly, and the obligations of a subject were cast aside.',
  ],
  s0107: [
    "Your Majesty's four-seasons meals and provisions—at every turn the cupboards hung empty; of what the palace offices should supply, not one in ten remained.",
    "Even Your Majesty's meals through the four seasons were left bare; scarcely one item in ten of what the palace should provide ever arrived.",
  ],
  s0108: [
    'When the Empress lay ill, medicines were not properly provided; by his own hand he wrote family letters with many requests and petitions.',
    'When the Empress lay ill, medicines were wanting, while he wrote personal letters full of demands and pleas.',
  ],
  s0109: [
    'These were all things the court officials heard and saw together; none failed to ache in heart and sigh in anger, yet none dared speak.',
    'Every courtier saw and heard these things; all grieved and seethed, yet none dared speak aloud.',
  ],
  s0110: [
    "The fifth son of the former Inspector of Yangzhou Yuan Xian, Faxing, when Huan Xuan's trouble arose, fled far abroad; once the kingly road was opened again, he was at last able to return to his roots.",
    "Faxing, fifth son of the former Yangzhou inspector Yuan Xian, had fled abroad during Huan Xuan's rebellion. Only when the imperial road was open again could he return home.",
  ],
  s0111: [
    'An heir of the Grand Tutor, cut off and then revived—among all who had hearts, who did not feel moved and rejoice?',
    'A grandson of the Grand Tutor, lost and restored—who with any conscience would not rejoice?',
  ],
  s0112: [
    "Yu's heart of devouring showed no regard for weight or light; because Faxing was clever and bright, certain to be where the people's hopes gathered, and the fragrant orchid had already flourished, he harbored hatred within, then groundlessly stirred alien talk and executed him though guiltless.",
    "Liu Yu's devouring envy spared no one. Faxing was clever and bright, sure to win the people's hearts; like a flourishing orchid he drew Yu's secret hate. Yu spread false charges and put him to death without cause.",
  ],
  s0113: [
    'The Grand Marshal, your subject Dewen, and the princess consort and imperial princesses—their feelings and plans were pressed to extremity; all alike scrambled to beg for their lives.',
    'Grand Marshal Sima Dewen, the princesses, and the royal ladies were driven to desperation and pleaded for their lives in disorder.',
  ],
  s0114: [
    'The rebel wantonly loosed harm and poison, swearing never to show mercy; the pain of false accusation and cruel injustice moved even those on the road.',
    'The traitor wreaked havoc and refused all mercy. The injustice of it moved even passers-by on the road.',
  ],
  s0115: [
    "Considering himself low in station but heavy in position, bearing great elevated favor, he then joined a child of a concubine in marriage with Dewen's legitimate daughter, bringing about this ill-matched union—which in truth came from coercive power.",
    "Thinking himself humble in origin yet raised so high, he forced Dewen's legitimate daughter to marry his own bastard son—a grotesque match born of naked intimidation.",
  ],
  s0116: [
    'The Defender General Liu Yi, the Right General Liu Fan, the Forward General Zhuge Changmin, the Master of Writing Vice Director Xie Hun, and the Colonel of the Southern Man Xi Sengshi—some were men of towering merit and noble descent, their reputation still upon them; all were pillars of the altars of state, entrusted with joint support—yet without guilt or crime, in a single day they were exterminated.',
    'Defender General Liu Yi, Right General Liu Fan, Forward General Zhuge Changmin, Vice Director of the Masters of Writing Xie Hun, and Colonel of the Southern Man Xi Sengshi—men of great merit and standing, pillars of the realm—were destroyed in a single day, innocent and blameless.',
  ],
  s0117: [
    'A suspicious and cruel nature such as this is rare in all antiquity.',
    'Such suspicion and cruelty are scarcely known in all history.',
  ],
  s0118: [
    'I reflect that my own house has declined and been broken, and that I survive only through reliance on him; the weight the imperial house places on us is unmatched since antiquity.',
    'My own house has fallen into ruin; I survive only through his protection. The throne has placed a weight on us unmatched in history.',
  ],
  s0119: [
    'For this reason public and private affairs alike were entrusted to Feng, and in all matters I showed utmost deference.',
    'For this reason public and private affairs alike went through him, and I deferred in everything.',
  ],
  s0120: [
    'When Jingzhou was conferred on me again, I earnestly petitioned, considering my talent slight and my position lofty, unfit to bear the partition of the two halves long; I repeatedly sought release from office, yet was never heeded.',
    'When Jingzhou was given me again, I pleaded that my talent was slight and my rank too high to bear such a burden long, and asked repeatedly to be relieved—but was never heard.',
  ],
  s0121: [
    'Earlier I took my aged mother in attendance, half the household going west; all my sons and nephews I left in the capital.',
    'I had brought my aged mother west with half the household, leaving all my sons and nephews in the capital.',
  ],
  s0122: [
    "My elder brother's son, Prince of Qiao Wang Wensi, though young was no worse than ordinary men and broadly free of blame; his nature loved company and friendship, and he did not know how to guard against distance; the rabble joined plots and made him their talk.",
    "My nephew, Prince of Qiao Wang Wensi, was young but no worse than most men, fond of company and slow to see danger. Schemers made him their pretext.",
  ],
  s0123: [
    'Yu then cut down gentlemen and sent Wensi far away.',
    'Yu then slaughtered the gentry and had Wensi sent far away.',
  ],
  s0124: [
    'I complied with this intent, memorialized with full documents, asked that Wensi be deposed, that the great line be changed in succession, and sent my son Wenbao to escort my daughter east.',
    'I complied: I memorialized to depose Wensi, change the succession, and sent my son Wenbao to escort my daughter east.',
  ],
  s0125: [
    'I thought that in pushing sincerity and showing compliance, reason could go no further than this.',
    'I believed I had shown every possible loyalty and submission.',
  ],
  s0126: [
    'Who would have thought Yu harbored a treacherous heart and then came to attack and punish, heaping further crimes on Wensi and fabricating guilt?',
    'Yet Yu harbored treachery all along and now marched against me, heaping false crimes on Wensi.',
  ],
  s0127: [
    'The talk of the petty crowd spread near and far in murmurs, yet I, pure and foolish, trusted in the dark that it could not be so.',
    'Rumors spread far and wide, yet I, foolishly trusting, refused to believe them.',
  ],
  s0128: [
    'Soon my headquarters Master of Records Zhang Maodu fled east in disorder, and the Governor of Nanping Tan Fanzhi on the third of this month abandoned his commandery in rebellion; there has since been investigation, and the eastern army has already set out.',
    'Soon my chief clerk Zhang Maodu fled east in disarray, and Nanping governor Tan Fanzhi abandoned his post in rebellion on the third of this month. The eastern army is already on the march.',
  ],
  s0129: [
    "Yu takes this action not from any personal hatred, but simply because I am the trunk of the royal house, holding a frontier lord's position at the top of the screen; when the men of the age are all gone, only I remain—he plans to cut me down and complete his usurpation and slaughter.",
    'This campaign is not born of personal hatred. I am the royal house\'s mainstay, a great frontier lord; when all others of merit are gone, only I remain. He means to destroy me and complete his usurpation.',
  ],
  s0130: [
    'Defender of the North General Zongzhi and Inspector of Qingzhou Jingxuan are both men Yu deeply fears and dreads; he wishes to remove them in turn and then shift the sun and moon—then the affair will be easy.',
    'Defender of the North Zongzhi and Qingzhou inspector Jingxuan are men Yu deeply fears; he means to eliminate them one by one, then seize the throne—and the rest will be easy.',
  ],
  s0131: [
    'Now the righteous bands of Jing and Yong gather without being summoned; the masses come like children, their assembly like a forest.',
    'Now the loyal forces of Jing and Yong rally unbidden; men flock to us like children returning home, thick as a forest.',
  ],
  s0132: [
    'How could it be that I have virtue enough to bring this about? It is rather the numen of the seven temples, whose principle runs through the hidden and manifest.',
    'Surely this is not my virtue alone, but the spirits of the ancestral shrines, whose justice reaches from this world to the next.',
  ],
  s0133: [
    "I have appointed Wensi General Who Quells Martial Affairs and Governor of Nanjun, and Zongzhi's son, the Governor of Jingling Lu Gui, advanced to General Who Assists the State.",
    'I have appointed Wensi General Who Quells Martial Affairs and governor of Nanjun, and Zongzhi\'s son Jingling governor Lu Gui promoted to General Who Assists the State.',
  ],
  s0134: [
    'I now, with Zongzhi, personally lead the great host forth and take position at the river crossing; we set armor and resist his might, responding as occasion demands.',
    'I now lead the main force with Zongzhi to the river crossing, armor set and ready to meet whatever comes.',
  ],
  s0135: [
    'Where the crimson banner points, it is only at Yu and his brothers and sons.',
    'Our crimson banners aim only at Yu and his brothers and sons.',
  ],
  s0136: [
    'Once the bandits and rebels are swept away, I shall immediately send further word.',
    'When the rebels are crushed, I shall report at once.',
  ],
  s0137: [
    'Because I am slight and weak, Yu has grown overbearing; above I am ashamed, below I cannot set my face.',
    'My own weakness has let Yu grow arrogant; I am ashamed before Heaven and cannot hold up my head.',
  ],
  s0138: [
    "Xiuzhi's headquarters Record-keeping Adjutant Han Yanzhi was a former subordinate, capable and talented.",
    "Xiuzhi's chief clerk Han Yanzhi, a former subordinate, was capable and talented.",
  ],
  s0139: [
    'Before the Duke reached Jiangling, he secretly sent him a letter saying: "The source of the Wensi affair is known near and far; last autumn, when Kangzhi was sent to return him to the Master of Records, [6] that was pushing favor to the utmost.',
    'Before Gaozu reached Jiangling, he secretly wrote to him: "The Wensi affair is known to all. Last autumn, when I sent Kangzhi to return him to your clerk, [6] that was the utmost concession.',
  ],
  s0140: [
    'Yet he showed not the least shame, nor submitted any memorial.',
    'Yet he showed no shame and sent no memorial.',
  ],
  s0141: [
    'Wensi, having been corrected and not returning—this is what Heaven and Earth cannot contain.',
    'Wensi was corrected and still would not return—that Heaven and Earth cannot abide.',
  ],
  s0142: [
    'I have received the mandate to campaign west and aim only at father and sons.',
    'I march west by imperial command, and my target is only father and son.',
  ],
  s0143: [
    'The old settlers of that land, driven by force, are not to be questioned at all.',
    'The local gentry, forced into this, will not be punished.',
  ],
  s0144: [
    "In former years Xi Sengshi, Xie Shao, Ren Jizhi, and others plotted together for years, serving exclusively as Liu Yi's chief strategists—hence things came to this.",
    'For years Xi Sengshi, Xie Shao, Ren Jizhi, and others plotted for Liu Yi—that is how we came here.',
  ],
  s0145: [
    'You and the others were for a time under pressure; originally there was not the slightest fault.',
    'You were pressed for a time; you had no real guilt.',
  ],
  s0146: [
    'My heart in embracing men looks to what is to come, and has its reasons from of old.',
    'I judge men by what they may yet do; that has always been my way.',
  ],
  s0147: [
    'Now on the near road is precisely the day for you all to return to yourselves.',
    'Now, on the eve of battle, is the day for you to come back to yourselves.',
  ],
  s0148: [
    'If the great army takes the road and blades meet in clash, I truly make no distinction between orchid and mugwort.',
    'If the armies meet in battle, I will not spare orchid for mugwort.',
  ],
  s0149: [
    'Therefore I set forth my meaning in full and show it to those of like heart among you.',
    'I state this plainly and show it to all who share your plight.',
  ],
  s0150: [
    'Yanzhi replied:',
    'Han Yanzhi replied:',
  ],
  s0151: [
    'I have received that you personally lead war-horses and have come far into the western domain; throughout the commandery, scholars and commoners—none fail to be struck with terror.',
    'Word has come that you lead your army deep into the west; every man in the region is struck with terror.',
  ],
  s0152: [
    'Why?',
    'Why?',
  ],
  s0153: [
    'None knows the name for which the army goes forth.',
    'Because no one knows why your army marches.',
  ],
  s0154: [
    "Now, shamed by your letter, I learn at last that it is on account of the Prince of Qiao's former affair—how this increases my sighs.",
    'Your letter shames me into learning at last that this is about the Prince of Qiao—how that deepens my grief.',
  ],
  s0155: [
    'The Western Campaigning Marshal in his person serves the state with loyalty and sincerity, treats men with generous affection—one should seek such a man among the ancients.',
    'Marshal Sima Xiuzhi serves the state with loyal heart and treats men with generous affection—such a man belongs among the ancients.',
  ],
  s0156: [
    'Because you, my lord, had the achievement of restoration, and the house and state relied on you, he entrusted virtue and gave sincerity, in every affair seeking your counsel.',
    'Because you restored the dynasty and the realm relied on you, he trusted you utterly and sought your counsel in everything.',
  ],
  s0157: [
    'The Prince of Qiao, when before he was impeached on a small matter, still memorialized in his own person to yield his place;',
    'When the Prince of Qiao was charged on a minor matter, he still offered to step down;',
  ],
  s0158: [
    'how much more, when the fault was great, could he remain silent?',
    'how then could he stay silent when the charge was grave?',
  ],
  s0159: [
    "Only Kangzhi's earlier words did not say everything, so he again sent Hu Daozhi to speak plainly what was in his heart.",
    'Kangzhi\'s earlier message did not say all; so he sent Hu Daozhi to speak his mind plainly.',
  ],
  s0160: [
    'The envoy had not yet returned when a memorial was already submitted to depose him—what was not said was settled by fate alone.',
    'Before the envoy returned, you had already memorialized to depose him—what was left unsaid was settled by your will alone.',
  ],
  s0161: [
    'Is this how one should treat mutual trust?',
    'Is this how trust between you was meant to work?',
  ],
  s0162: [
    'What could not be borne, that you should at once raise arms?',
    'What could not wait, that you must raise arms at once?',
  ],
  s0163: [
    'Since the righteous banner took power, which frontier lord has dared not first consult you, yet go straight to memorializing the Son of Heaven?',
    'Since you took power, which frontier lord has dared report to the throne without consulting you first?',
  ],
  s0164: [
    'The Prince of Qiao was rebuked by the chief minister and again memorialized to be deposed—where does rectitude lie, what cause does the memorial have? One may say, "When you wish to condemn a man, you will find the words."',
    'The Prince of Qiao was charged by the chief minister and deposed by memorial—where is the justice, what is the ground? Truly: "When you wish to condemn a man, you will find the words."',
  ],
  s0165: [
    'Liu Yu, beneath Heaven—who does not see this heart of yours, yet you would again deceive and beguile the men of the state!',
    'Liu Yu, all under Heaven see your heart—yet you would still deceive the realm!',
  ],
  s0166: [
    'What Heaven and Earth cannot contain lies with you, not with us.',
    'What Heaven and Earth cannot abide is on your side, not ours.',
  ],
  s0167: [
    'Your letter says, "My heart in embracing men looks to what is to come, and has its reasons from of old."',
    'You write, "I judge men by what they may yet do; that has always been my way."',
  ],
  s0168: [
    "Now you attack another's lord and feed men with profit—truly one may say, \"My heart in embracing men looks to what is to come, and has its reasons from of old.\"",
    'Now you attack a lord and bait men with profit—yes, that is "judging men by what they may yet do."',
  ],
  s0169: [
    'Liu Fan died within the palace gate, Zhuge perished at the hands of those beside you; sweet words deceived the frontier lords, and light troops fell upon them—so that within the hall there were no men of sincere heart, and beyond the gates no lords who trusted themselves. To call this winning the reckoning is truly shameful.',
    'Liu Fan died at the palace gate, Zhuge at the hands of your intimates. You lured frontier lords with sweet words, then struck with light troops—so that within the court no man dared speak honestly, and beyond the gates no lord felt secure. To call that strategy is shameful indeed.',
  ],
  s0170: [
    'The generals and aides of your headquarters and the worthy men of the court stake their lives day by day, their hearts long set on peace.',
    'Your officers and the court\'s worthies stake their lives each day, longing for peace.',
  ],
  s0171: [
    'I am indeed base and inferior, yet I have heard the Way from gentlemen.',
    'I am base and low, yet I have heard the Way from gentlemen.',
  ],
  s0172: [
    "With the Western Campaigning Marshal's utmost virtue, could there be no minister who would give his life in command?",
    'With Marshal Xiuzhi\'s supreme virtue, could he lack men who would die for him?',
  ],
  s0173: [
    "That I could not throw myself into the tiger's maw makes me clearly unlike Xi, Ren, and their kind.",
    'That I will not throw myself into the tiger\'s maw sets me clearly apart from Xi and Ren and their like.',
  ],
  s0174: [
    'Even if Heaven long prolongs disorder and the nine streams run turbid, I shall wander underground with Zang Hong—no more words.',
    'Even if chaos endures and the world runs foul, I shall keep company underground with Zang Hong—and say no more.',
  ],
  s0175: [
    'The Duke read the letter and sighed, showing it to his aides and saying: "To serve a man should be like this."',
    'Gaozu read the letter, sighed, and showed it to his staff: "To serve a lord should be like this."',
  ],
  s0176: [
    'In the third month the army halted at Jiangling.',
    'In the third month the army reached Jiangling.',
  ],
  s0177: [
    'Earlier the Inspector of Yongzhou Lu Zongzhi had often feared he would not be tolerated by the Duke; he allied with Xiuzhi, and now led his son, the Governor of Jingling Gui, to join Xiuzhi at Jiangling.',
    'Yongzhou inspector Lu Zongzhi had long feared Gaozu would not tolerate him; allied with Xiuzhi, he now brought his son Jingling governor Gui to join him at Jiangling.',
  ],
  s0178: [
    'The Governor of Jiangxia Liu Qianzhi intercepted him; his army was defeated and he was killed.',
    'Jiangxia governor Liu Qianzhi intercepted them; Zongzhi was defeated and killed.',
  ],
  s0179: [
    'The Duke ordered the Administrator of Pengcheng Interior Xu Daizhi and the Adjutant Wang Yunzhi to go out to the Jiangxia mouth; they were again defeated by Gui and both perished.',
    'Gaozu sent Pengcheng interior administrator Xu Daizhi and adjutant Wang Yunzhi to the Jiangxia crossing; Gui defeated them and both were lost.',
  ],
  s0180: [
    "At that time the Duke's army was moored at Matou; that same day he led the host across the river, personally supervising the generals as they went ashore—none failed to leap forward striving to be first.",
    'The army lay at Matou; that same day Gaozu led the host across the river and personally supervised the landing—every man strove to be first ashore.',
  ],
  s0181: [
    "Xiuzhi's host collapsed; with Gui and the others he fled to Xiangyang, and Jiangling was pacified.",
    'Xiuzhi\'s army collapsed; he fled with Gui and others to Xiangyang, and Jiangling was pacified.',
  ],
  s0182: [
    'He was further appointed Colonel of the Southern Man.',
    'He was further made Colonel of the Southern Man.',
  ],
  s0183: [
    'When he was about to take office, it fell on a day of the four prohibitions; the clerks Zheng Xianzhi, Chu Shudu, Wang Hong, and Fu Liang asked to move the day—the request was not granted.',
    'On taking office the day fell among the four prohibited days; clerks Zheng Xianzhi, Chu Shudu, Wang Hong, and Fu Liang asked to postpone it—he refused.',
  ],
  s0184: [
    'An edict said: "This province has long accumulated abuses, affairs and troubles succeeding one another; the people are weary, the fields overgrown, and the loom\'s axle stands empty.',
    'An edict said: "This province has long been abused, troubles piled one on another; the people are worn out, fields lie fallow, and the treasury is empty.',
  ],
  s0185: [
    'Moreover old regulations are confused and obscure, corvée and service are frequent and bitter; the very young are robbed of nurture, old and young don armor; empty households follow service, some even answering the summons before the mourning cloth is removed.',
    'Regulations are confused, corvée endless; children are robbed of care, old and young bear arms; empty households are pressed into service, some called up before mourning is done.',
  ],
  s0186: [
    "Whenever I forever cherish the people's afflictions, I forget sleep at midnight; truly we should abolish harsh government and extend this simple favor.",
    "I brood on the people's suffering and lose sleep at midnight; harsh rule must be abolished and simple mercy extended.",
  ],
  s0187: [
    'May the withered wind and corrupt government be renewed with the affair; may the transformation of repose in unity be accomplished within a month.',
    'May corrupt ways be made new with this change; may peace be restored within a month.',
  ],
  s0188: [
    'In the two provinces Jing and Yong, clerks of the western bureau and the southern-barbarian headquarters, and soldiers aged twelve and above, sixty and below, and those nurturing orphans and the young, single men in great hardship—all are to be sent home.',
    'In Jing and Yong, clerks of the western bureau and southern-barbarian office, and soldiers twelve and over, sixty and under, and those nursing orphans, widows, or in grave hardship—all are dismissed.',
  ],
  s0189: [
    'Those destitute and alone who cannot survive shall be given long-term relief.',
    'Those too poor to live shall receive long-term relief.',
  ],
  s0190: [
    'Officers and clerks of the headquarters and provinces who have long served shall be ranked according to merit.',
    'Officers and clerks who have served long shall be promoted by merit.',
  ],
  s0191: [
    "This year's land tax is also remitted.\"",
    "This year's taxes are also remitted.\"",
  ],
  s0192: [
    'In the fourth month the Duke again led the host forward on campaign; reaching Xiangyang, Xiuzhi fled to the Qiang.',
    'In the fourth month Gaozu advanced again; reaching Xiangyang, Xiuzhi fled to the Qiang.',
  ],
  s0193: [
    'The Son of Heaven again earnestly repeated the former commands, appointing Grand Tutor and Governor of Yangzhou, sword and shoes in the hall, no need to hurry in court audience, bowing in praise without giving his name, adding the former feather canopy and guard of honor, and four each of Senior and Junior Masters of Records and Adjutants.',
    'The emperor again repeated the former honors: Grand Tutor, Governor of Yangzhou, sword and shoes in the hall, no need to hurry in audience, bowing without giving his name, the feather canopy and guard of honor as before, and four Senior and Junior Masters of Records and adjutants.',
  ],
  s0194: [
    "The Duke's third son Yilong was enfeoffed as Duke of Northern Pengcheng county.",
    'His third son Yilong was enfeoffed as Duke of Northern Pengcheng.',
  ],
  s0195: [
    'Central Army General Daoling was made Inspector of Jingzhou.',
    'Central Army General Daoling was made inspector of Jingzhou.',
  ],
  s0196: [
    'On the day jiazi in the eighth month the Duke returned from Jiangling, presented back the yellow battle-axe, and firmly declined Grand Tutor, Governor of Yangzhou, the feather canopy and guard of honor; the rest he accepted.',
    'On the day jiazi in the eighth month Gaozu returned from Jiangling, returned the yellow battle-axe, and declined Grand Tutor, Governor of Yangzhou, and the feather canopy and guard of honor; the rest he accepted.',
  ],
  s0197: [
    "Court discussion held that the Duke's Way was lofty and his merit weighty, and that it was not fitting again to show respect to the Protector Army; since extraordinary honors had been added, in memorials he was no longer to give his name.",
    'The court held that Gaozu\'s merit was too great to show respect to the Protector Army; with such honors, memorials no longer bore his name.',
  ],
  s0198: [
    'The heir was made Inspector of Yanzhou.',
    'The heir was made inspector of Yanzhou.',
  ],
  s0199: [
    'In the first month of the twelfth year, an edict ordered the Duke to recruit scholars as before.',
    'In the first month of the twelfth year an edict ordered him to recruit scholars as before.',
  ],
  s0200: [
    'He was further appointed General Who Pacifies the North and Inspector of Yanzhou.',
    'He was further made General Who Pacifies the North and inspector of Yanzhou.',
  ],
  s0201: [
    'His area of supervision was increased to include Southern Qin, twenty-two provinces in all.',
    'His supervision was extended to Southern Qin, twenty-two provinces in all.',
  ],
};

for (const s of data.sentences) {
  const pair = T[s.id];
  if (!pair) {
    console.error('Missing translation for', s.id);
    process.exit(1);
  }
  s.literal = pair[0];
  s.idiomatic = pair[1];
}

fs.writeFileSync(
  'translations/current_translation_songshu.json',
  JSON.stringify(data, null, 2) + '\n'
);
console.log('Patched', Object.keys(T).length, 'sentences');
