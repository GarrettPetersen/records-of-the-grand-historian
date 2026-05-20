import fs from 'node:fs';

const data = JSON.parse(
  fs.readFileSync('translations/current_translation_songshu.json', 'utf8')
);

const T = {
  s0202: [
    'The Duke considered that the civil and military officials of Pacifier of the North were few and insufficient, and that a separate establishment was unsuitable.',
    'Gaozu judged the Pacifier of the North too thinly staffed to warrant a separate office.',
  ],
  s0203: [
    'Thereupon he abolished the Pacifier of the North headquarters and merged it into the grand headquarters.',
    'He abolished the Pacifier of the North headquarters and merged it into the main command.',
  ],
  s0204: [
    'The heir was made Inspector of Yuzhou.',
    'The heir was made inspector of Yuzhou.',
  ],
  s0205: [
    'In the third month, the Duke was further made Grand Commander of All Affairs Within and Without.',
    'In the third month Gaozu was made Grand Commander over all civil and military affairs.',
  ],
  s0206: [
    'When the Duke had first pacified Qi, he still intended to settle Guan and Luo; as it happened Lu Xun pressed in invasion, so the matter did not succeed.',
    'After pacifying Qi he still meant to retake the Guan and Luo region, but Lu Xun\'s invasion forced him to set that plan aside.',
  ],
  s0207: [
    'Once Jing and Yong were pacified, he then planned outward expansion.',
    'With Jing and Yong secure, he turned to campaigns beyond the borders.',
  ],
  s0208: [
    'It happened that the Qiang ruler Yao Xing died; his son Hong was installed; brothers killed one another; Guanzhong was disturbed and in disorder; the Duke thereupon put the army on alert and campaigned north.',
    'Yao Xing of the Qiang died; his son Hong took the throne; brothers turned on one another and Guanzhong fell into chaos. Gaozu mobilized for a northern campaign.',
  ],
  s0209: [
    'He was further appointed General Who Campaigns West and Inspector of the two provinces Si and Yu.',
    'He was further made General Who Campaigns West and inspector of Si and Yu.',
  ],
  s0210: [
    'The heir was made Inspector of the two provinces Xu and Yan.',
    'The heir was made inspector of Xu and Yan.',
  ],
  s0211: [
    'He issued a document saying: "I raised the great cause, beginning from this province, restored the imperial succession, and thus established meritorious achievement; the foreign barbarians and fierce foes without, and the cleaning of traitors and evil within—all were the effect of the men of the province and the clans giving their utmost loyalty and strength.',
    'He issued a proclamation: "I raised the great cause from this province, restored the throne, and built a record of merit. Clearing foreign enemies abroad and traitors at home—all this came from the whole province giving its utmost loyalty and strength.',
  ],
  s0212: [
    'Affection like frost and wind, righteousness piercing through metal and stone.',
    'Your loyalty has been fierce as frost and wind; your righteousness, firm as metal and stone.',
  ],
  s0213: [
    'Now, about to take leave with the western banner and take action at Guan and the Yellow River, my weak heir undeservedly receives favor, and again is unworthily given the present appointment—feelings and affairs entwined, it may be called deep indeed.',
    'I now take leave to march west toward Guan and the River, while my young heir undeservedly receives this new burden—our bonds of duty and feeling run very deep indeed.',
  ],
  s0214: [
    'Recently military and state affairs have been pressing, and punishments and executions have not ceased; looking back with remembrance, how could one not sigh greatly?',
    'Affairs of war and state have pressed hard of late, and executions have not ceased. Thinking on this, how can I not sigh?',
  ],
  s0215: [
    'Those whose crimes date from imprisonment five years back may all be pardoned and released.',
    'Prisoners convicted five years ago or earlier may all be pardoned and released.',
  ],
  s0216: [
    'Civil and military men whose service is complete yet who have not received promotion in honor may immediately be registered according to rank and roster."',
    'Civil and military officers who have completed their terms but have not yet been promoted shall be advanced according to rank."',
  ],
  s0217: [
    'When the Duke received the grand commandership within and without and Si province, he together declined the ceremonial respect due to the Grand Marshal, the Prince of Langye, and court discussion followed this.',
    'On accepting grand command of all affairs and Si province, Gaozu also declined ceremonial obeisance to the Grand Marshal, Prince of Langye; the court agreed.',
  ],
  s0218: [
    'The Duke wished to win the distant regions with the sound of righteousness, and escorted the Prince of Langye on the northern expedition.',
    'Wishing to win distant peoples by righteous example, Gaozu escorted the Prince of Langye on the northern campaign.',
  ],
  s0219: [
    'In the fifth month, Yin Chong, the Qiang pretender\'s Yellow Gate Attendant, led his brothers in submission.',
    'In the fifth month Yin Chong, Attendant at the Yellow Gate to the Qiang pretender, came over with his brothers.',
  ],
  s0220: [
    'The Duke was further made Inspector of Northern Yongzhou, given front feather canopy and drums and pipes, and his ceremonial swords were increased to forty men.',
    'Gaozu was further made inspector of Northern Yongzhou, granted an imperial feather canopy and drums, and forty ceremonial swords.',
  ],
  s0221: [
    'He was relieved of Supervisor of the Masters of Writing.',
    'He was relieved of the post of Supervisor of the Masters of Writing.',
  ],
  s0222: [
    'On the day disi of the eighth month he led the great host forth from the capital.',
    'On the day disi in the eighth month he led the main army out of the capital.',
  ],
  s0223: [
    'The heir was made General of the Central Army and overseer of the Grand Marshal\'s duties left behind at the headquarters.',
    'The heir was made General of the Central Army and left to oversee affairs at headquarters.',
  ],
  s0224: [
    'Liu Muzhi, Vice Director of the Masters of Writing on the Right, became Left Vice Director, concurrently held the military adjunct posts of the Supervising Army and Central Army headquarters, entered and dwelled in the Eastern Headquarters, and took overall charge within and without.',
    'Liu Muzhi, Vice Director of the Masters of Writing, was promoted to Left Vice Director, made military adjutant to the supervising and central armies, moved into the Eastern Headquarters, and took overall charge of internal and external affairs.',
  ],
  s0225: [
    'In the ninth month the Duke halted at Pengcheng and was further appointed Inspector of Xuzhou.',
    'In the ninth month Gaozu halted at Pengcheng and was further made inspector of Xuzhou.',
  ],
  s0226: [
    'Earlier he had sent Champion General Tan Daoji and Flying Dragon General Wang Zhen\'e by land toward Xu and Luo; the Qiang garrisoned along the route all saw the wind and submitted.',
    'He had earlier sent Champion General Tan Daoji and Flying Dragon General Wang Zhen\'e toward Xu and Luoyang by land; Qiang garrisons along the route surrendered at the first approach.',
  ],
  s0227: [
    'Wei Hua, the pretender\'s Inspector of Yanzhou, had earlier held Cangyuan and also led his multitude in submission.',
    'Wei Hua, the pretender\'s inspector of Yanzhou, who had held Cangyuan, also came over with his troops.',
  ],
  s0228: [
    'The Duke again sent Wang Zhongde, Inspector of Northern Yanzhou, ahead with the water army into the river.',
    'Gaozu also sent Northern Yanzhou inspector Wang Zhongde ahead with the fleet into the river.',
  ],
  s0229: [
    'Zhongde defeated the Suo barbarians at Liangcheng in Dong commandery and advanced peacefully to take Pingtai.',
    'Zhongde defeated the northern barbarians at Liangcheng in Dong commandery and took Pingtai.',
  ],
  s0230: [
    'In the tenth month the multitudinous armies reached Luoyang and besieged Jinyong.',
    'In the tenth month the armies reached Luoyang and besieged Jinyong.',
  ],
  s0231: [
    'Hong\'s younger brother, the pretender\'s General Who Pacifies the South Guang, requested surrender and was sent to the capital.',
    'Hong\'s brother Guang, the pretender\'s General Who Pacifies the South, surrendered and was sent to the capital.',
  ],
  s0232: [
    'The five Jin mausoleums were repaired and restored, and guards were set.',
    'The five Jin imperial tombs were restored and placed under guard.',
  ],
  s0233: [
    'The Son of Heaven\'s edict said:',
    'The emperor\'s edict said:',
  ],
  s0234: [
    'When Song and Dai match the pole, then the Way of Heaven adds brilliance; when frontier peaks serve as screen, then the tasks of emperors and kings are accomplished.',
    'When Song and Tai stand as the earth\'s pillars, Heaven\'s radiance grows; when border mountains serve as the throne\'s screen, the ruler\'s work is done.',
  ],
  s0235: [
    'For this reason Xia and Yin drew on the lords Kun and Peng; Zhou relied on the aides of Qi and Jin.',
    'Thus Xia and Yin leaned on lords like Kun and Peng; Zhou depended on aides from Qi and Jin.',
  ],
  s0236: [
    'Looking to the former canons, a model for ten thousand generations—supporting governance and sustaining peril—none fails to proceed from this.',
    'The ancient records show it: helpers who steady the throne and rescue the realm have always been the pattern for all ages.',
  ],
  s0237: [
    'The Grand Marshal Duke, destiny\'s man and Heaven-entrusted, equal to the sage and broad and deep, bright illuminates the four quarters, his Way shines through the cosmos.',
    'The Grand Marshal Gaozu is heaven-sent—a sage\'s breadth and depth, whose light reaches the four quarters and whose virtue fills the cosmos.',
  ],
  s0238: [
    'From □□ at the first advancement, then he poured effort into the royal domain; when the evil locusts were greatly rampant, then his achievement preserved the altars of state.',
    'From □□ at the outset he gave himself wholly to the royal cause; when disaster ran wild, his merit preserved the dynasty.',
  ],
  s0239: [
    'Truly he bore the four bonds on his shoulders—a man on whom the myriad states relied.',
    'He bore the four pillars of the realm on his shoulders; all the states depended on him.',
  ],
  s0240: [
    'When Huan Xuan usurped in rebellion and overturned and swept the Four Seas, the Duke deeply upheld the great constancy; spirit and martial virtue thundered and shook; broadly rescued Our person; and again made the royal house.',
    'When Huan Xuan rebelled and plunged the realm into chaos, Gaozu held fast to supreme loyalty; his power shook the land like thunder, saved the throne, and remade the dynasty.',
  ],
  s0241: [
    'Ever mindful of his feats and virtue, engraved in Our heart—thereupon north he cleared Hai and Dai, south he subjugated the hundred Yue; Jing and Yong bowed in submission; Yong and Min followed the track; he overcame and removed regional troubles and checked and halted invaders and tyrants.',
    'His merit is engraved on Our heart: he cleared the north to the sea and Mount Tai, pacified the southern Yue, brought Jing and Yong to heel, opened Yong and Min to the royal road, quelled regional rebellion, and checked foreign plunderers.',
  ],
  s0242: [
    'And as balancer of the ruler\'s plans, he ordered ranks within and without, looked upward to revive the extinguished style, and alongside succeeded to the lingering enterprise.',
    'As chief minister he ordered court and realm, revived fallen traditions, and carried forward the unfinished work of the throne.',
  ],
  s0243: [
    'Holding rites to set customs in order, following the king to hand down instruction—his voice and teaching reached far and were spread; no region unenlightened went unpervaded.',
    'He upheld rites to order the people, followed royal precedent to teach the realm; his influence reached everywhere, and none were left untouched.',
  ],
  s0244: [
    'Down to chiefs who dwell in trees and live on the sea, and chieftains with loose hair and tattooed foreheads—none failed to forget their crude perils; through ninefold translation they came to court—this is broadly proclaimed in the glorious records, though the details cannot be fully traced.',
    'Even chiefs who live in trees or on distant shores, even leaders with tattooed faces, put aside their wild ways and came to court through layer upon layer of interpreters—widely proclaimed in the annals, though the full story exceeds what records can tell.',
  ],
  s0245: [
    'Formerly, at Yongjia when the laws were not in their proper measure, the many Xia were torn apart; from ancient times the imperial dwelling was reduced to barbarian captivity; speaking forever of the gardens and tombs—the whole land alike yearned.',
    'In the Yongjia era law and order collapsed and the heartland split apart; the old imperial capital fell to the barbarians; speaking of the tombs, all under Heaven mourned as one.',
  ],
  s0246: [
    'The Duke, with bright dawn of far-reaching sighs, seized the moment and swiftly campaigned; personally supervised the marquis and earls; with angular might reached and punished.',
    'Gaozu burned with resolve; seizing the moment he marched at once, personally led the lords, and brought crushing force to bear on the enemy.',
  ],
  s0247: [
    'When banners and pennants first touched the road, then the eight directions echoed in shock;',
    'When his banners first moved, the eight directions trembled;',
  ],
  s0248: [
    'when a detached force led the way, then many strongholds scattered like clouds driven off.',
    'when his vanguard advanced, fortress after fortress fell like clouds blown away.',
  ],
  s0249: [
    'The old capital was altogether cleared; the five mausoleums restored to ritual; a hundred cities bent the knee; a thousand settlements followed like shadows.',
    'The old capital was cleansed, the five tombs restored to honor; a hundred cities submitted, a thousand settlements followed in his train.',
  ],
  s0250: [
    'From what the written records carry, since the birth of the people, meritorious virtue and abundant achievement—none has been so great as this.',
    'In all the records since the beginning of mankind, no merit has ever matched this in scale.',
  ],
  s0251: [
    'Formerly Zhou and Lü aided the sage sovereign; relying on the shape of the Three Parts, grasping yak-tail banners and battle-axes, at one stroke commanding—all greatly opened territory and crossed provinces to hold kingdoms.',
    'In old times Zhou Gong and Lü Wang served sage rulers; at a stroke of command, banner and battle-axe in hand, they opened vast territories spanning many provinces.',
  ],
  s0252: [
    'Even in the cases of Huan and Wen, compared with this they were markedly restrained—yet even so they were clearly clothed in favors and seals, brightly bestowed extraordinary ranks.',
    'Even Duke Huan and Duke Wen, though far less than this in achievement, still received lavish honors and exceptional rank.',
  ],
  s0253: [
    'How much more one who alone surpasses a hundred generations and looks back to distant forefathers!',
    'How much more then for one who stands alone above all the ages and looks back on even the greatest of the past!',
  ],
  s0254: [
    'We each time broadly mirror the ancient instruction and think to follow the present plan.',
    'We have ever looked to the ancient teaching and sought to follow the right course.',
  ],
  s0255: [
    'Because the Duke deeply upholds modest restraint, thereby omitting the great rites—the people and Heaven stretch their necks in this for years already.',
    'Because Gaozu in deep humility has declined the grand honors, Heaven and the people have waited for years.',
  ],
  s0256: [
    'How much more now that Yu\'s traces run level on the same track, the nine borderlands share the same script, and the merit office raises its bamboo tally—the whole Heaven\'s people increase in expectation.',
    'Now the empire stands united, the far borders share one script, and the whole realm awaits the reward of merit.',
  ],
  s0257: [
    'Yet the Duke\'s lofty restraint has greatly violated the state\'s statutes; the Three Numina look upon him with favor—We are truly reverently fearful.',
    'Yet Gaozu\'s continued refusal greatly breaches royal protocol; Heaven, Earth, and the spirits approve—and We are deeply awed.',
  ],
  s0258: [
    'It is fitting clearly to answer the multitude\'s hopes and truly to exalt the grand ceremony.',
    'It is right to answer the people\'s hope and grant the supreme honors they deserve.',
  ],
  s0259: [
    'He is to advance to the rank of Chancellor of State, oversee the hundred officials, Governor of Yangzhou, enfeoff with ten commanderies as Duke of Song, provided the rites of the Nine Bestowals, add seal cord and the Far-Wandering cap, rank above the feudal princes and kings, and add the green sash of Chancellor of State.',
    'Let him be made Chancellor of State, overseer of all offices and Governor of Yangzhou, enfeoffed as Duke of Song over ten commanderies, granted the Nine Bestowals, the seal and Far-Wandering cap, rank above all princes, and the chancellor\'s green sash.',
  ],
  s0260: [
    'The citation said:',
    'The investiture document read:',
  ],
  s0261: [
    'We, being solitary and dim, look upward to assist the great foundation; Yi of the Yi seized the chance, swept and overturned the royal house, crossed to the southern borderlands, and moved to the Nine Rivers.',
    'We, feeble and untested, lean on the great foundation of the throne. When Yi usurped power and overturned the dynasty, the court fled south to the Yangzi.',
  ],
  s0262: [
    'Ancestral sacrifices were cut off from offerings; men and spirits had no allotted place; dragging along the crowd of villains, We entrusted Our fate to the river\'s bank.',
    'Ancestral rites were cut off; men and spirits lost their proper place; We clung to a crowd of villains on the Yangzi\'s bank.',
  ],
  s0263: [
    'Then Our ancestors\' enterprise suddenly fell to earth; the seven hundred years\' fortune was already sheared and toppled; as if wading a deep abyss—we knew not by what to cross.',
    'Our forefathers\' legacy collapsed; seven centuries of fortune was cut short; We were as one drowning in a deep sea with no way to shore.',
  ],
  s0264: [
    'Heaven had not yet cut off Jin; it brought forth an heroic aide; he shook up the slackened bonds; again made the realm; revived what was perishing and continued what was cut off; made the dark become bright.',
    'Heaven had not abandoned Jin; it raised up a great helper who tightened the loose bonds of state, remade the realm, restored what was dying, and turned darkness into light.',
  ],
  s0265: [
    'Primary merit and supreme virtue—We truly rely on him.',
    'On this supreme merit and virtue We truly rely.',
  ],
  s0266: [
    'Now about to confer on the Duke the canonical citation, reverently listen to Our command:',
    'We now confer the canonical investiture upon Gaozu. Hear Our command:',
  ],
  s0267: [
    'Formerly Huan Xuan unrestrainedly usurped; floods to Heaven and extinguished Xia; uprooted the root and blocked the source; inverted the Six Positions; the multitude of officials bowed eyebrows; the four quarters none showed care.',
    'When Huan Xuan seized the throne, his crime flooded Heaven, uprooting the foundation and inverting the cosmic order; officials bowed their heads and none in the four quarters dared to care.',
  ],
  s0268: [
    'The Duke\'s spirit pierced the morning sun, his breath over-topped the Milky Way; he roused his numinous martial power; greatly exterminated the crowd of evil; overcame and recovered the imperial city; presented the emperor to the savoring of spirits.',
    'Gaozu\'s spirit pierced the morning sun, his valor rose to the heavens; he roused divine martial power, destroyed the wicked host, retook the capital, and restored the emperor to the altars.',
  ],
  s0269: [
    'This is the Duke\'s great constancy, [7] beginning from the king\'s loyal service.',
    'This was Gaozu\'s supreme loyalty, [7] his first great deed in serving the throne.',
  ],
  s0270: [
    'Transferring the law to the host of lords, upstream for a long gallop, lightly campaigning against the rugged heights, presenting victory at Southern Ying—the great enemy\'s head broken, the crowd of rebels all extinguished; the three luminaries turned their brilliance; old things returned to the right.',
    'He gave the law to the lords and drove upstream in long pursuit; he struck the rugged south and reported victory at Southern Ying; the chief rebel was beheaded, all traitors destroyed; the heavenly lights shone again and the realm was restored.',
  ],
  s0271: [
    'This too is the Duke\'s achievement.',
    'This too was Gaozu\'s merit.',
  ],
  s0272: [
    'Going out to the frontier and entering as aide, he expanded this protective support; enriched goods and benefited use; multiplied the living people; registered households yearly increased; territory daily opened; guided virtue and clarified punishments—the four borders had boundaries.',
    'Whether governing the frontier or aiding the court, he enriched the realm, grew the people, expanded registered households and territory day by day, guided by virtue and clear law until the four borders were secure.',
  ],
  s0273: [
    'This too is the Duke\'s achievement.',
    'This too was Gaozu\'s merit.',
  ],
  s0274: [
    'The Xianbei, relying on their multitude, usurped and stole the Three Qi; wolf-like devoured Ji and Qing; reverent-sword slaughtered Yi and Dai; depended on distant barriers and continued as a border poison.',
    'The Xianbei, swollen with numbers, seized the Three Qi, ravaged Ji and Qing, slaughtered their way to Yi and Mount Tai, and leaning on distant barriers continued to plague the borders.',
  ],
  s0275: [
    'The Duke gathered chariots and foddered the four-horse teams, far entered the distant border; assault towers on four sides; ten thousand ramparts all collapsed; the usurping-title barbarians openly executed by the Minister of Justice; territory expanded three thousand; authority proclaimed at the Dragon Desert.',
    'Gaozu mustered chariots and horses and marched deep into the frontier; siege engines closed on every side and a thousand walls fell; the usurping barbarians were publicly executed; he opened three thousand li of territory and proclaimed his might to the northern desert.',
  ],
  s0276: [
    'This too is the Duke\'s achievement.',
    'This too was Gaozu\'s merit.',
  ],
  s0277: [
    'Lu Xun, demonic and vicious, watched for a gap in the Five Ridges, seized the void and unrestrainedly rebelled; invaded and overturned Jiang and Yu; his banners swept the realm within; arrows reached the royal city; court and countryside lost heart and despaired; none had a firm will; households offered plans for moving and divining; the state deliberated schemes for shifting the capital.',
    'Lu Xun, that demon of rebellion, watched for a gap among the Five Ridges and struck when the realm was open; he overran Jiang and Yu, his banners swept the empire, his arrows reached the capital; court and country lost heart; households urged flight and the state debated moving the capital.',
  ],
  s0278: [
    'The Duke mounted the carriage-shafts and crossed the Yangzi south; righteousness showed in his countenance; toweringly still within; viewed peril as level plain; deployed strategy and wielded the extraordinary; heroic plans unmatched in the age; the cunning foe exhausted and wounded; lost banners and fled by night; caused Our capital domain to be saved from the verge of falling.',
    'Gaozu crossed the Yangzi south with righteous fury in his face, calm amid danger as on level ground; his unmatched stratagems drove the cunning foe wounded into flight by night and saved the capital domain from collapse.',
  ],
  s0279: [
    'This too is the Duke\'s achievement.',
    'This too was Gaozu\'s merit.',
  ],
  s0280: [
    'Pursuing the fleeing and chasing the routed, he raised banners on the river\'s bank; a detached force floated on the sea; within sight of a day swiftly arrived.',
    'He chased the fleeing foe, raised his banners on the riverbank; a detached force sailed the sea and arrived within days.',
  ],
  s0281: [
    'At the achievement at Panyu, captives and severed heads numbered in the tens of thousands; at the victory at Zuoli, fish scattered and birds dispersed.',
    'At Panyu his captives numbered in the thousands; at Zuoli the enemy broke like fish and scattered like birds.',
  ],
  s0282: [
    'The chief culprit fled far; his head was transmitted ten thousand li; Hainan was altogether cleared; the wild domains came to pledge obedience.',
    'The chief rebel fled far; his head was sent a thousand miles; the south was cleared and distant tribes came to submit.',
  ],
  s0283: [
    'This too is the Duke\'s achievement.',
    'This too was Gaozu\'s merit.',
  ],
  s0284: [
    'Liu Yi rebelled and changed sides; bearing guilt in Western Xia; over-topping the sovereign and deceiving the ruler; his will unrestrainedly wicked and violent; attaching to faction and coordinating parties; fanned and swept the royal precincts.',
    'Liu Yi rebelled in the west, guilty and defiant, lording over his sovereign with violent ambition; he gathered factions and stirred turmoil in the capital region.',
  ],
  s0285: [
    'The Duke met him with track and punishment; extinguished him within days; the azure rhinoceros lightning-like upstream; divine troops wind-swept; the guilty man was obtained; Jing and Heng were cleared and at peace.',
    'Gaozu met him with law and arms and destroyed him within days; his fleet drove upstream like lightning, his troops swept like wind; the traitor was taken and Jing and Heng were pacified.',
  ],
  s0286: [
    'This too is the Duke\'s achievement.',
    'This too was Gaozu\'s merit.',
  ],
  s0287: [
    'Qiao Zong relied on disorder; as a raider stole one corner; royal transformation was blocked and impeded; the Three Ba were drowned and submerged.',
    'Qiao Zong relied on chaos and seized a corner of the realm; royal influence was blocked and the Three Ba drowned in war.',
  ],
  s0288: [
    'The Duke pointed and commissioned a detached force; granted a good plan; crossed waves and floated on rapids; reached and arrived at the well-net of channels; the usurping rogue submitted to the axe; Liang and Min grass lay flat.',
    'Gaozu sent a detached force with a clear plan; they crossed rivers and rapids to reach the Shu basin; the usurper submitted to the axe and Liang and Min bowed like grass before the wind.',
  ],
  s0289: [
    'This too is the Duke\'s achievement.',
    'This too was Gaozu\'s merit.',
  ],
  s0290: [
    'Ma Xiu and Lu Zong blocked arms and insulted within; drove and led the two regions; joined banners and declared rebellion.',
    'Ma Xiu and Lu Zong raised troops in rebellion, rousing two regions under their banners.',
  ],
  s0291: [
    'The Duke, casting sleeves, set out at starlight; refined the supreme strategy; at the Yangzi crossing the army\'s momentum exceeded wind and lightning; turned banners at the Mian River—the host truly multiplied in shock and awe; the two rebels fled in rout; Jing and Yong came back to life; dark favor soaked and nourished; warm winds secretly spread.',
    'Gaozu set out at once with a master plan; at the Yangzi crossing his army moved faster than wind and lightning; turning his banners at the Mian River he struck terror; the two rebels fled; Jing and Yong revived; his deep mercy spread like a hidden warm wind.',
  ],
  s0292: [
    'This too is the Duke\'s achievement.',
    'This too was Gaozu\'s merit.',
  ],
  s0293: [
    'At Yongjia when there was no strength of contest, the four barbarians monopolized Hua; the Five Capitals were torn apart; mountains and tombs suffered hidden disgrace; ancestors harbored fury until death\'s end; surviving commoners had thoughts of the unrighteous wind.',
    'After the Yongjia disaster the barbarians held the heartland; the five capitals were torn apart and the imperial tombs desecrated; the dead ancestors seethed with unending wrath and the survivors yearned for righteousness.',
  ],
  s0294: [
    'The Duke, afar matching the Yi minister\'s virtue of accepting the moat; near sharing Small Bai\'s shame of annihilation; mustered troops and arrayed the host; brilliantly raised the great cry; divided commands to the crowd of marshals; northward advanced through Si and Yan.',
    'Gaozu matched the ancient minister\'s mercy and shared Duke Huan\'s shame at national ruin; he mustered his armies, raised a great cry, sent his generals north into Si and Yan.',
  ],
  s0295: [
    'Xu and Zheng wind-scattered; Gong and Luo were loaded with clarity; pretender governors and rebellious frontier lords, arms crossed, begged guilt; a hundred years of thorn and filth—in one morning swept clean.',
    'Xu and Zheng fell before him; Gong and Luoyang were cleansed; pretender governors and rebel lords surrendered with arms bound; a century of ruin was swept away in a single morning.',
  ],
  s0296: [
    '[8] This too is the Duke\'s achievement.',
    '[8] This too was Gaozu\'s merit.',
  ],
  s0297: [
    'The Duke has the achievement of bringing peace within the realm, doubled with bright virtue.',
    'Gaozu has brought peace to the realm, crowned with luminous virtue.',
  ],
  s0298: [
    'From the first emergence of his track—then his extraordinary plans topped antiquity; lightning-struck the strong demons—then no blade-point had a match before him; thereupon pacified the eastern capital domain; greatly made the black-haired people.',
    'From his first rise his plans surpassed all antiquity; when he struck the powerful demons none stood before his blade; he pacified the eastern capital and wrought great good for the people.',
  ],
  s0299: [
    'As for founding in darkness and ordering the threads—transformation melted within the year\'s reckoning; sustaining peril and stilling disorder—the Way was firm as wrapped mulberry.',
    'In founding the state amid chaos his governance matured year by year; in sustaining peril and stilling disorder his Way was firm as the mulberry in a storm.',
  ],
  s0300: [
    'Discriminating direction and setting positions, bringing them within track and measure; remitting and cutting away troublesome harshness, compared as if drawn with one stroke; pure wind and beautified transformation filled and blocked the cosmos.',
    'He set things in their proper place and brought them under law; he cut away harsh burdens until all was uniform; his pure influence filled the universe.',
  ],
  s0301: [
    'For this reason the farthest regions presented gems; distant barbarians paid tribute; where the king\'s strategy was proclaimed—the nine services all followed.',
    'Thus the farthest lands sent tribute and distant peoples brought gifts; wherever royal policy reached, all the realm followed.',
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
