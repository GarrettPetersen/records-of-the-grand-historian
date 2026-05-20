#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'South of the Han was weak and far; powerful enemies stood within a hand\'s reach—military grain was likely spent, weapons and armor all but gone.',
    'The lands south of the Han had grown feeble and remote, yet fierce enemies pressed within arm\'s reach—grain for the armies was nearly gone, arms and armor nearly exhausted.',
  ],
  s0402: [
    'When the Duke first took up his fief, though resources could not be relied upon, he drilled soldiers and ordered hunts in due season—our perilous city was turned into a strong fortress.',
    'When the Duke first went out to his fief, though he had little to lean on, he trained troops and kept hunts in order—what had been a city in peril became a stronghold.',
  ],
  s0403: [
    'This too is the Duke\'s achievement.',
    'This too was the Duke\'s merit.',
  ],
  s0404: [
    'In the Yongyuan era title the crow-fearing omen had already come—though there was precedent for deposing a worthless ruler, even Yi Yin and Huo Guang found it difficult.',
    'Under the Yongyuan reign the omen of the perched crow had arrived—though deposing a worthless ruler had precedent, even Yi Yin and Huo Guang had called it hard.',
  ],
  s0405: [
    'The Duke first framed the great policy and established the enlightened sage—righteousness beyond the hemp tally, merit surpassing the replacement of one ruler, changing disorder into order and making the blind see clear.',
    'The Duke was first to set the great design and raise the enlightened sovereign—his righteousness exceeded the hemp tally of enfeoffment, his merit outshone a change of dynasties; he turned chaos to order and darkness to light.',
  ],
  s0406: [
    'This too is the Duke\'s achievement.',
    'This too was the Duke\'s merit.',
  ],
  s0407: [
    'Though King Wen\'s transforming wind reached the Yangtze and Han, the capital stirred and was swallowed in a flood tide—Wu and Yue were like birds in a nest over a burning curtain, beyond all comparison.',
    'Though the civilizing wind of King Wen had reached the Yangtze and Han, the capital seethed and sank under a rising flood—Wu and Yue were birds nesting above a burning curtain, a peril beyond words.',
  ],
  s0408: [
    'The Duke set out ten thousand li with sleeve thrust aside, intent only on saving the drowning—where his righteous renown reached, none failed to approve.',
    'The Duke flung aside his sleeve and marched ten thousand li, thinking only of those drowning in peril—wherever his righteous name reached, none withheld approval.',
  ],
  s0409: [
    'This too is the Duke\'s achievement.',
    'This too was the Duke\'s merit.',
  ],
  s0410: [
    'Lucheng and Xia Rui blocked the midstream, building ramparts on mountains and entrenching along rivers for self-defense.',
    'Lucheng and Xia Rui held the river\'s heart, piling ramparts on the hills and winding defenses along the streams.',
  ],
  s0411: [
    'The Duke faced these gathered crows, crossed this treacherous terrain, halted troops in armor through cold and heat—our march was long and soldiers forgot return; with far-reaching strategy and enduring policy, not an arrow wasted and battle never pushed to exhaustion—the fortified positions at Jianhua were taken one after another.',
    'The Duke met this flock of crows, crossed perilous ground, and held his army in armor through winter into summer—our campaign ran long and the men forgot home; with distant design and patient strategy he spent no arrow in vain and never drove war to its limit—the strongholds of Jianhua fell one after another.',
  ],
  s0412: [
    'This too is the Duke\'s achievement.',
    'This too was the Duke\'s merit.',
  ],
  s0413: [
    'These villains aided one another\'s evil, clinging to river hazards and swarming at Jia Lake like ants.',
    'These criminals helped one another in wickedness, hugging the river\'s defenses and massing at Jia Lake like ants.',
  ],
  s0414: [
    'They held land and water, planning to reinforce Xia Shou—with one approach of the fleet they collapsed at once.',
    'They occupied land and water alike, scheming to relieve Xia Shou—but at the first arrival of our fleet they crumbled on the spot.',
  ],
  s0415: [
    'This too is the Duke\'s achievement.',
    'This too was the Duke\'s merit.',
  ],
  s0416: [
    'The treacherous minister shook the throne, again harbored axe-raising intent, and massed troops at the nine branches of the Yangtze to muster for loyal rescue of the throne.',
    'A treacherous minister alarmed the throne, again nursed rebellion, and gathered armies at the Yangtze\'s nine mouths under the banner of saving the dynasty.',
  ],
  s0417: [
    'The Duke\'s stern prestige pointed straight—momentum surpassing wind and lightning; at the slightest arrival of banners and flags the whole province submitted.',
    'The Duke\'s aweful authority drove straight ahead, swifter than wind or lightning—at the least touch of his banners and flags, the whole province bowed.',
  ],
  s0418: [
    'This too is the Duke\'s achievement.',
    'This too was the Duke\'s merit.',
  ],
  s0419: [
    'Gushu was strategically vital and close to the capital—a nest of villains blocked the ferry routes.',
    'Gushu was a vital crossing near the capital, where fierce rebels massed and cut the ferry roads.',
  ],
  s0420: [
    'The Duke\'s detached force opened the road, columns following in succession—where military prestige fell, flags alone made them tremble; they burned boats, abandoned walls, rolled armor and fled by night.',
    'The Duke sent a flanking force to clear the way, columns pressing after in turn—where his army\'s might struck, men quailed at the sight of his flags; they burned their boats, abandoned their walls, and fled by night in rolled armor.',
  ],
  s0421: [
    'This too is the Duke\'s achievement.',
    'This too was the Duke\'s merit.',
  ],
  s0422: [
    'The mob ran wild, intent on one last gamble—boars charging the Huai shore, martial cavalry cloud-thick.',
    'The rabble raged, staking everything on one throw—charging the Huai like wild boars, war-horses massed like clouds.',
  ],
  s0423: [
    'The Duke summoned the brave, seized the moment and unleashed sharp forces—spirit surpassing Banquan, momentum exceeding the Huan River; pursuing routed foes northward he seized the vital crossings—Bear-Ear Peaks\' steepness cannot compare, the Sui River ceasing to flow falls short.',
    'The Duke called forth the valiant and, seizing the moment, let loose his keenest troops—his spirit outdid Banquan, his force surpassed the Huan; chasing the routed north he seized every crossing—steep as Bear-Ear Peaks, still not his equal; still as the Sui, who could match him?',
  ],
  s0424: [
    'This too is the Duke\'s achievement.',
    'This too was the Duke\'s merit.',
  ],
  s0425: [
    'Langye and Shishou girded by steep passes, Xinlei and East Wall ramparts gold-boiling-water strongholds.',
    'Langye and Shishou were belted by rugged terrain; Xinlei and the eastern wall were strongholds of bronze and boiling water.',
  ],
  s0426: [
    'They relied on terrain for defense with both troops and grain—in wind and lightning shock all trembled and collapsed; cities returned to their moats—thus it came to pass.',
    'Trusting to terrain, they held out with arms and provisions—struck by wind and lightning, all quaked and fell; the cities sank back into their moats, and so it was done.',
  ],
  s0427: [
    'This too is the Duke\'s achievement.',
    'This too was the Duke\'s merit.',
  ],
  s0428: [
    'The sole tyrant was blind and cruel, unafraid behind his walls—drums and bells throbbed as if he had surplus strength.',
    'The lone despot was maddened and savage, fearless behind his walls—drums and bells thundered as though strength still overflowed.',
  ],
  s0429: [
    'He indulged wicked favorites, envied this crown and robe—the treacherous seized their chance, about to extend slaughter to wives and children.',
    'He doted on evil favorites and resented the crown upon another head—the vicious took their opening and were ready to slaughter families whole.',
  ],
  s0430: [
    'The Duke\'s hidden counsel ran in secret, grand strategy passed underground—the loyal and brave achieved their purpose; the white banners at the Palace of Bright Cultivation were matchless.',
    'The Duke\'s secret design worked unseen, his great plan passed in silence—loyal and brave men at last could act; the white banners raised at the Bright Cultivation Hall had no parallel.',
  ],
  s0431: [
    'This too is the Duke\'s achievement.',
    'This too was the Duke\'s merit.',
  ],
  s0432: [
    'The Duke had merit of saving the millions, weighted with bright virtue—from the first he set his will, embraced the Way of the Confucian gates, washed his tassel to enter office, and his pure governance shone across the age.',
    'The Duke had saved the myriad people and was crowned with bright virtue—from the first he hardened his purpose, took the Way from the gates of the Ru, washed his tassel to enter service, and his clean governance lit the age.',
  ],
  s0433: [
    'Times were hard, the altars in peril—the Kunlun ridge already burned, jade and stone burned together.',
    'The times were dire and the altars tottered—the ridge of Kunlun was already afire, jade and common stone consumed together.',
  ],
  s0434: [
    'He drove the fierce warriors, wielded thunder and lightning—righteousness equal to Nanchao, merit matching Muye.',
    'He led the tiger hosts, wielding thunder and lightning—righteous as the campaign at Nanchao, meritorious as the battle at Muye.',
  ],
  s0435: [
    'As for Yu\'s silent merit, who would succeed if not for Guan Zhong—rescuing those about to become fish, driving off those wearing unkempt hair, undoing this tangled net, ordering these tangled threads, restoring ritual and mats, returning joy to the rivers and seas.',
    'When Yu\'s achievement lay in silence, who could follow if not Guan Zhong? He saved men about to become fish, drove off those with shorn and tangled hair, cut this snarled net, straightened these knotted threads, restored ritual to the mat, and brought music back to river and sea.',
  ],
  s0436: [
    'Yongping\'s old example—those who hear it sigh;',
    'The old ways of Yongping—those who hear of them sigh;',
  ],
  s0437: [
    'the Commandant\'s former regulations—those who see them shed tears.',
    'the Commandant\'s former statutes—those who read them weep.',
  ],
  s0438: [
    'He petitioned for the people\'s lives, returning them to the pole star\'s protection.',
    'He pleaded for the people\'s lives and restored them to the turning of the Dipper.',
  ],
  s0439: [
    'Sighing gentry bore anew heaven\'s grace;',
    'The gentry sighed and again bore the blessing of Heaven above;',
  ],
  s0440: [
    'wretched common folk again received earth-treading kindness.',
    'the common people mourned and again received the mercy of firm ground beneath their feet.',
  ],
  s0441: [
    'Virtue surpassed Song and Dai, merit neighbored creation—so far beyond speech that words fail.',
    'His virtue exceeded Song and Dai, his achievement touched the work of creation—so lofty and far that words cannot reach it.',
  ],
  s0442: [
    'I have also heard: rewarding merit and assigning virtue, enfeoffing lords as screens—all to strengthen the four corners and forever flourish through myriad branches.',
    'I have also heard that merit must be rewarded and virtue appointed, that lords are enfeoffed as bulwarks—all to brace the four corners of the realm and make the ten thousand branches flourish forever.',
  ],
  s0443: [
    'Thus the "Two Souths" spread transformation, the nine lords were dispatched, the royal way ran pure and penalties went unused.',
    'Thus the "Two Souths" flowed with transforming influence, the nine lords went forth on campaign, the royal Way ran clear, and punishments fell unused.',
  ],
  s0444: [
    'Overturning governance did not arise through this long span—as at the burning of the beacon towers, Jin and Zheng had none to rely on.',
    'No overturning of rule arose through all this long age—yet as when beacon fires already burn, Jin and Zheng had none to lean on.',
  ],
  s0445: [
    'Only the Duke orders heaven and earth and pacifies the realm—Way surpassing Yi Yin and Hou Ji, reward thinner than Duke Huan and Duke Wen—how can this model Qi and Lu and hold long reins over the cosmos?',
    'Only the Duke has woven heaven and earth and brought peace to the realm—his Way crowns Yi Yin and Hou Ji, yet his reward is less than Duke Huan\'s or Duke Wen\'s; how can this be the model of Qi and Lu, the long reins over all under heaven?',
  ],
  s0446: [
    'Reverently considering former worthies, I am deeply afraid.',
    'Reverently weighing the deeds of those before me, I am deeply afraid.',
  ],
  s0447: [
    'Now I advance and confer Chancellor of State, change Yangzhou Inspector to Governor, and with ten commanderies—Liang and Liyang of Yuzhou, Yixing of South Xuzhou, Huainan, Xuancheng, Wu, Wuxing, Kuaiji, Xin\'an, and Dongyang of Yangzhou—enfeoff you as Duke of Liang.',
    'Now I advance you to Chancellor of State, change the Yangzhou inspector to governor, and with ten commanderies—Liang and Liyang in Yuzhou, Yixing in South Xuzhou, and Huainan, Xuancheng, Wu, Wuxing, Kuaiji, Xin\'an, and Dongyang in Yangzhou—I enfeoff you as Duke of Liang.',
  ],
  s0448: [
    'Bestow this white earth wrapped in white thatch—thus fixing your state and establishing your ancestral shrine.',
    'Grant this white soil bound in white thatch—thereby fixing your domain and founding your ancestral altar.',
  ],
  s0449: [
    'In former times the Dukes of Zhou and Shao dwelt in protecting blessing; down to Bi and Mao, who also served as ministers—holding duties inner and outer, ritual truly demands it.',
    'In olden days the Duke of Zhou and the Duke of Shao entered to guard and bless; later Bi and Mao too became ministers—bearing duties within and without, as ritual truly requires.',
  ],
  s0450: [
    'Now I order Bearer of the Staff and concurrent Grand Commandant Wang Liang to confer the Chancellor of State and Yangzhou Governor seals and cords, and the Duke of Liang credentials;',
    'Now I command Bearer of the Staff and concurrent Grand Commandant Wang Liang to confer the seals and cords of Chancellor of State and Yangzhou governor, and the Duke of Liang insignia;',
  ],
  s0451: [
    'Bearer of the Staff and concurrent Minister of Works Wang Zhi to confer the Duke of Liang thatched earth, gold tiger tally first through fifth left, and bamboo envoy tally first through tenth left.',
    'and Bearer of the Staff and concurrent Minister of Works Wang Zhi to confer the Duke of Liang\'s earthen fief wrapped in thatch, gold tiger tallies one through five left, and bamboo envoy tallies one through ten left.',
  ],
  s0452: [
    'Chancellor of State ranks above all lords, duties summing all bureaus—constant regulations and canonical numbers should change with affairs.',
    'The chancellor stands above all feudal lords and oversees every office—fixed statutes and canonical numbers should shift with the times.',
  ],
  s0453: [
    'Let him as Chancellor oversee all governance, remove the Recorder of the Masters of Writing title, and return the provisional tally, Attendant-in-Ordinary cicada badge, Masters of Writing Director seal, Inner-Outer Commander Grand Marshal seals, and Jian\'an Duke patent and credentials—Grand General of Agile Cavalry as before.',
    'Let him, as chancellor, govern all affairs, drop the title Recorder of the Masters of Writing, and return the borrowed tally, Attendant-in-Ordinary cicada badge, Director of the Secretariat seal, seals of Inner-Outer Commander and Grand Marshal, and the Jian\'an Duke patent and credentials—Grand General of Agile Cavalry unchanged.',
  ],
  s0454: [
    'Further bestow the Nine Gifts—listen respectfully to the ensuing commands: because the Duke jointly cultivated ritual and law, punishment and virtue complete, pitying in judging cases and using no feeling improperly—therefore bestow one great chariot and one war chariot, and two teams of black stallions.',
    'I further add the Nine Bestowments—hear and obey what follows: because the Duke has perfected both ritual and law, both punishment and virtue, and in judging cases shows pity without bending feeling—therefore I bestow one grand chariot and one war chariot, and two four-horse teams of black stallions.',
  ],
  s0455: [
    'The Duke toiled at agriculture, mind on the people\'s heaven, greatly honored fundamental work and grain as treasure—bestow the ceremonial robe and cap, with vermilion shoes beside.',
    'Because the Duke labors over the fields and keeps the people as his heaven, exalting the root and treasuring grain—I bestow the sacrificial robe and cap, with vermilion shoes to match.',
  ],
  s0456: [
    'Where the Duke\'s transforming power reached, vulgar custom became refined, people molded and nations harmonized—bestow suspended bells and the six-row dance.',
    'Where the Duke\'s melting influence has touched, rough ways turn elegant and peoples are shaped into harmony—I bestow suspended bells and the six-row dance.',
  ],
  s0457: [
    'His civil virtue spread wide, righteous fame reached far—topknotted barbarians sang songs requesting officials—bestow vermilion doorposts for residence.',
    'Because his civil virtue spreads far and his righteous name reaches distant lands, and men with knotted hair and shaved crowns sing barbarian songs asking for officers—I bestow vermilion gateposts for his dwelling.',
  ],
  s0458: [
    'He raised the pure and suppressed the foul, official ranks ordered, many scholars arose and "Old Stump" flowed in song—bestow the inner steps for ascent.',
    'Because he lifts the clear and checks the turbid, puts office in order, and many scholars rise while "Old Stump" is sung in praise—I bestow the inner steps for ascent.',
  ],
  s0459: [
    'Upright in mien governing below, by body setting things straight, checking the unforeseen and repelling foes afar—bestow three hundred tiger-guard warriors.',
    'Because he governs with stern countenance and by his own conduct sets the measure, checking the unforeseen and breaking the enemy from afar—I bestow three hundred tiger guards.',
  ],
  s0460: [
    'His prestige like summer sun, intent to purge traitors—those who defy fate and ruin clans, punish without pardon—bestow one axe and one battle-axe.',
    'Because his authority is like the summer sun and his will is to purge treachery, and those who defy command and destroy clans shall not be spared—I bestow one axe and one ceremonial axe.',
  ],
  s0461: [
    'He strode across Mount Song and the eastern sea, towered over the realm—as sun and moon, where light falls it must reach—bestow one red bow and one hundred red arrows;',
    'Because he strides over Mount Song and the eastern sea and towers over the realm, like sun and moon whose radiance must reach wherever it shines—I bestow one red bow and one hundred red arrows;',
  ],
  s0462: [
    'ten black bows and one thousand black arrows.',
    'ten black bows and one thousand black arrows.',
  ],
  s0463: [
    'Ever speaking of filial piety, utmost feeling reaching spirits—reverently strict in sacrificial rites, offering surplus reverence—bestow one ewer of dark millet wine, with libation cup beside.',
    'Because he ever speaks of filial piety and deepest feeling moves the spirits, reverently observing the sacrifices with overflowing respect—I bestow one ewer of dark millet wine, with libation vessels to match.',
  ],
  s0464: [
    'The Liang state appoints Chancellor of State downward, all following the old pattern.',
    'In the state of Liang, appointments from chancellor downward shall all follow the former pattern.',
  ],
  s0465: [
    'Take heed!',
    'Take heed!',
  ],
  s0466: [
    'Respectfully follow past policy, reverently accept the great rites, respond to Heaven\'s favor, receive abundant blessing, and spread our founding ancestor\'s auspicious mandate!',
    'Reverently follow the policies of old, humbly receive the great rites, answer Heaven\'s grace, take up many blessings, and extend the glorious mandate of our founding ancestor!',
  ],
  s0467: [
    'Gaozu firmly declined.',
    'Gaozu firmly refused.',
  ],
  s0468: [
    'His staff urged acceptance: "We respectfully receive the splendid mandate and plainly await your policy.',
    'His staff urged him onward: "We humbly receive this glorious command and plainly await your design.',
  ],
  s0469: [
    'The Illustrious Duke hesitates at the grand rites—this is truly modest reverence, not yet reaching far-reaching purpose.',
    'The Illustrious Duke holds back from these great rites—this is indeed the intent of humble respect, yet it does not exhaust the greater need.',
  ],
  s0470: [
    'Why is this?',
    'Why so?',
  ],
  s0471: [
    'The successor ruler abandoned norm and cut himself from the altars—the nation\'s mandate and its master were carved into enemies; beams broke, rafters collapsed, crushing upon himself—ministers felt the pain of minced flesh, common folk feared extermination house by house.',
    'The reigning lord cast off the constant way and severed himself from the ancestral temples—the nation\'s mandate and its sovereign were hacked into foes; beams snapped, rafters fell, and the ruin crushed him in turn—ministers tasted the agony of being minced alive, common people feared slaughter house by house.',
  ],
  s0472: [
    'The Illustrious Duke displayed heaven-reaching merit, rescued from fire and water\'s urgency, twice tracked sun and moon and re-strung the constellation stars, returned jade and turtle to mud, saved these people from pit and cliff—so that wives and children blush to speak of Yi and Lü, village schools shame to discuss the Five Hegemons.',
    'The Illustrious Duke showed merit that measured heaven, pulled the realm from fire and flood, twice restored sun and moon and restrung the stars of Shen, returned jade and turtle from the mud, and lifted the people from pit and cliff—so that wives and children blush to name Yi and Lü, and village schools are ashamed to speak of the Five Hegemons.',
  ],
  s0473: [
    'Yet your rank is lower than Aheng, your lands narrower than Qufu—the way of reward and favor is still not complete.',
    'Yet your rank stands below Aheng, your domain is narrower than Qufu—the path of reward and grace is still unfinished.',
  ],
  s0474: [
    'The great treasure is a public vessel—not to be craved, not to be refused—in utmost fairness, who yields when it is one\'s turn for benevolent rule?',
    'The great mandate is a vessel for all—not to be grasped, not to be pushed away—in perfect fairness, when benevolent rule is due, who should yield?',
  ],
  s0475: [
    'The Illustrious Duke should reverently receive Heaven and the people, fully accept the great rite.',
    'The Illustrious Duke should reverently answer Heaven and the people and fully accept the great rite.',
  ],
  s0476: [
    'Do not let songs of "after me" echo that old resentment, turning one who would benefit all into one who benefits himself alone.',
    'Do not let the song of "after me" share that ancient bitterness, making one who would rescue all become one who saves himself alone.',
  ],
  s0477: [
    '" The Duke did not agree.',
    '" The Duke would not consent.',
  ],
  s0478: [
    'On day xinyou in the second month, the staff again petitioned: "Recently, bearing the court\'s mandate in secret policy, we presumptuously presented our sincere hearts, received return orders, and were not granted empty acceptance—gentry look on eagerly, deeply unable to comprehend.',
    'On day xinyou in the second month the staff petitioned again: "Not long ago, carrying the court\'s hidden design, we ventured to lay our loyal hearts bare; we received your refusal and were not granted gracious acceptance—the gentry look on with longing, deeply unable to understand.',
  ],
  s0479: [
    'We have heard: receiving gold from the treasury is the great man\'s broad purpose; high stepping to the sea corner is the petty man\'s small scruple—thus treading the stone steps, the Duke of Zhou was not suspected; gifted the jade tablet, Duke Tai was not deemed to have refused.',
    'We have heard that to take gold from the treasury is the enlightened man\'s broad aim, while to hide oneself at the sea\'s edge is the common man\'s petty scruple—thus when the Duke of Zhou trod the stone steps, none doubted him; when Duke Tai was given the jade tablet, none called it refusal.',
  ],
  s0480: [
    'How much more when a sage successor follows the track, ancestral virtue lives in the people—in ordering the primeval chaos, who does not sigh deeply for "if not for Guan Zhong"?',
    'How much more when a sage heir follows the former path and ancestral virtue still lives in the people—in ordering the realm from chaos, who does not sigh over "if not for Guan Zhong"?',
  ],
  s0481: [
    'Add to this the campaign at Zhufang, reliance on Jing and He—withdrawal of troops and shaking of armies, great savior of the royal house.',
    'Add the campaign at Zhufang, leaning on the Jing and the He—withdrawing the army and rallying the host, a great renewal of the royal house.',
  ],
  s0482: [
    'Though again shoes piled with calluses saved Song, soles layered thick preserved Chu—measured against the ancients from today, what are those beside this?',
    'Even shoes heaped with calluses for Song, even soles thickened to save Chu—set beside your deeds today, what are they worth?',
  ],
  s0483: [
    'Yet doubts like the bell-thief\'s confusion, merit doubted and unrewarded—Heaven and Earth cannot bear such cruelty.',
    'Yet merit is doubted and left unrewarded, as though one were the bell-thief deceiving himself—Heaven and Earth cannot endure such harshness.',
  ],
  s0484: [
    'Thus the jade horses galloped swift, showing Weizi\'s departure;',
    'Thus the jade horses ran in haste, showing Weizi\'s going away;',
  ],
  s0485: [
    'the gold tablets emerged from earth, reporting Longfeng\'s grievance.',
    'and the gold tablets rose from the ground, proclaiming Longfeng\'s wrong.',
  ],
  s0486: [
    'The Illustrious Duke gripped the saddle and halted weeping, steeling the three armies\' will; alone in private he wiped tears, stirring the righteous—thus making the sea lord ascend and offer blessings, Mountain Rong and Guzhu tying horses to follow in shadow—punishing crime and mourning for the people, one correction and chaos stilled.',
    'The Illustrious Duke clutched the saddle and checked his tears, hardening the will of the three armies; alone he hid his weeping and stirred the hearts of men of honor—so that the sea lord came up to offer blessing, Mountain Rong and Guzhu tied their horses and followed like shadows—punishing the guilty, comforting the people, and in one stroke setting chaos at rest.',
  ],
  s0487: [
    'Not claiming Heaven\'s work—in truth he toiled with wet feet.',
    'This was not stealing Heaven\'s achievement; in truth he labored with soaked feet.',
  ],
  s0488: [
    'Moreover the Illustrious Duke came from the schoolmen, took joy in name and teaching—Way-wind and plain discourse, sitting firm over refined custom—he did not study Sun and Wu, yet met this divine martial prowess.',
    'Moreover the Illustrious Duke began as a scholar, finding joy in teaching and moral order—his Way and plain speech steadied elegant custom; he did not study Sun and Wu, yet met this divine martial gift.',
  ],
  s0489: [
    'He drove the utterly condemned mob, aided customs ripe for enfeoffment—turtle and jade undestroyed—whose achievement is this if not yours?',
    'He drove off the mob marked for destruction and lifted customs ready for enfeoffment—the turtle and jade were not shattered—whose work is this if not yours?',
  ],
  s0490: [
    'To remain alone a gentleman—where then would Yi Yin and the Duke of Zhou stand?"',
    'If you alone remain the gentleman, where shall Yi Yin and the Duke of Zhou have place?"',
  ],
  s0491: [
    'Thereupon he first accepted appointment as Chancellor and Duke of Liang.',
    'Only then did he first accept appointment as Chancellor and Duke of Liang.',
  ],
  s0492: [
    'That day, sixty-two kinds of Dong Hun\'s lewd, extravagant, and strange garments were burned in the capital streets.',
    'That same day sixty-two kinds of Dong Hun\'s licentious, luxurious, and outlandish dress were burned in the streets of the capital.',
  ],
  s0493: [
    'Prince of Xiangdong Bao Zhi plotted rebellion and was granted death.',
    'Prince of Xiangdong Bao Zhi plotted rebellion and was sentenced to death.',
  ],
  s0494: [
    'An edict posthumously enfeoffed the late wife of the Duke of Liang as Liang Consort.',
    'An edict posthumously made the Duke of Liang\'s late wife Consort of Liang.',
  ],
  s0495: [
    'On day yichou, Chen Wenxing, squad chief of South Yanzhou, digging a well within Huan city, obtained two jade-inlaid qilin, two gold-inlaid jade bi, and two crystal rings each.',
    'On day yichou, Chen Wenxing, squad chief of South Yanzhou, while digging a well inside Huan city, found two jade-inlaid qilin, two gold-inlaid jade bi, and two crystal rings.',
  ],
  s0496: [
    'Jiankang Magistrate Yang Zhan also reported that a phoenix was seen at Tongxia village in the county.',
    'Jiankang magistrate Yang Zhan also reported that a phoenix had been seen at Tongxia village in the county.',
  ],
  s0497: [
    'Empress Xuande praised the auspicious signs and attributed them to the Chancellor\'s office.',
    'Empress Xuande praised these auspicious omens and ascribed them to the chancellor\'s office.',
  ],
  s0498: [
    'On day bingyin, an edict: "The Liang state is newly established and requires comprehensive governance—select all key posts according to the old pattern, all following the imperial court\'s system.',
    'On day bingyin an edict said: "The state of Liang is newly founded and must be put in order—choose all important offices as before, all according to the imperial court\'s system.',
  ],
  s0499: [
    '" Gaozu submitted a memorial saying:',
    '" Gaozu submitted a memorial saying:',
  ],
  s0500: [
    '" Your subject has heard: if you choose scholars by words, scholars adorn their words; if you choose men by deeds, men exhaust their deeds.',
    '" Your subject has heard that if one selects scholars by speech, scholars polish their speech; if one selects men by conduct, men spend themselves in conduct.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_001_b5.mjs <translation.json>'
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
