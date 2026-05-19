import fs from 'node:fs';

const data = JSON.parse(
  fs.readFileSync('translations/current_translation_songshu.json', 'utf8')
);

const T = {
  s0202: [
    'The Duke thought the Pacifying-north civil and military staff were few and should not be separately established.',
    'Gaozu held that the Pacifying-north staff were too few to warrant a separate establishment.',
  ],
  s0203: [
    'Thereupon he abolished the Pacifying-north headquarters and merged it into the Grand headquarters.',
    'He abolished the Pacifying-north headquarters and merged it with his main command.',
  ],
  s0204: [
    'He made the heir Prince Governor of Yuzhou.',
    'The heir was made governor of Yuzhou.',
  ],
  s0205: [
    'In the third month, the Duke was advanced to Grand Commander of Court and Country.',
    'In the third month he was made Grand Commander of Court and Country.',
  ],
  s0206: [
    'When first he had pacified Qi, he still had the intent to settle the Passes and Luoyang; it happened that Lu Xun pressed in attack, and therefore the matter did not succeed.',
    'After pacifying Qi he still meant to recover the passes and Luoyang, but Lu Xuns rebellion forced him to set that plan aside.',
  ],
  s0207: [
    'Jing and Yong being already pacified, he then plotted outward expansion.',
    'With Jing and Yong secure, he turned to campaigns beyond the frontier.',
  ],
  s0208: [
    'It happened that the Qiang ruler Yao Xing died, his son Hong established himself, brothers killed one another, and Guanzhong was thrown into turmoil; the Duke then ordered the army on alert for a northern campaign.',
    'Yao Xing of the Qiang died; his son Hong took the throne while brothers slaughtered one another and Guanzhong fell into chaos. Gaozu ordered the army to mobilize for a northern expedition.',
  ],
  s0209: [
    'He was additionally appointed Campaigning-west General and Governor of the two provinces Si and Yu.',
    'He was additionally made Campaigning-west General and governor of Si and Yu.',
  ],
  s0210: [
    'He made the heir Prince Governor of the two provinces Xu and Yan.',
    'The heir was made governor of Xu and Yan.',
  ],
  s0211: [
    'His order went down: "I raised the great cause first from my home province, recovered the imperial succession, and thus built merit and achievement; foreign barbarians as fierce enemies, and within the realm traitorous paths—all were the effect of fellow countrymen and provincial kin devoting heart and strength to the utmost."',
    'He issued an order: "I raised the righteous cause in my own province, restored the dynasty, and built these achievements. Fierce foes abroad and traitors within were overcome only because the men of our land gave their utmost loyalty."',
  ],
  s0212: [
    'Feeling like wind and frost, righteousness penetrating metal and stone.',
    'My feeling is cold as frost; my duty cuts to the bone.',
  ],
  s0213: [
    'Now I am to take leave with the western banners and have business in the Passes and the Yellow River; the weak heir presumptuously receives favor, again bearing the present appointment—affairs and feelings tangled together, one may say it is deep indeed.',
    'Now I march west toward the passes and the Yellow River. My young heir has been given this charge again—the ties bind deep indeed.',
  ],
  s0214: [
    'Recently military and state affairs have been pressing, punishments and executions not yet ceased; whenever I speak of it in remembrance, how can I not sigh greatly?',
    'Lately state and army affairs have pressed hard and executions have not ceased. When I think of it, how can I not sigh?',
  ],
  s0215: [
    'Those whose crimes warrant imprisonment for five years and back may all once be pardoned and sent away.',
    'Prisoners sentenced to five years or less are to be pardoned and released.',
  ],
  s0216: [
    'Civil and military men whose labor was full yet who had not received honored promotion should at once be reported according to roster order.',
    'Civil and military officers whose service is complete but who have not yet been promoted are to be reported in roster order.',
  ],
  s0217: [
    'The Duke received the Commander of Court and Country and the province of Si, and both declined the ceremonial respect owed to the Grand Marshal, Prince of Langye; court discussion followed him.',
    'He accepted the posts of Commander of Court and Country and governor of Si, but declined the ceremonial deference owed to Grand Marshal Sima of Langye; the court agreed.',
  ],
  s0218: [
    'The Duke wished with righteous renown to embrace the distant, and to lead the Prince of Langye on a northern campaign.',
    'He wished to win the distant lands by righteous fame and to conduct the northern campaign in the name of the Prince of Langye.',
  ],
  s0219: [
    'In the fifth month, the false Qiang Gentleman of the Yellow Gate Yin Chong led his brothers in submission.',
    'In the fifth month Yin Chong, false Qiang Gentleman of the Yellow Gate, led his brothers in surrender.',
  ],
  s0220: [
    'He was again advanced as Governor of Northern Yongzhou, with front guard of feather parasols and musical procession, and ceremonial swords increased to forty.',
    'He was again made governor of Northern Yongzhou, with front parasols and drums and forty ceremonial swords.',
  ],
  s0221: [
    'He was released from Supervisor of the Masters of Writing.',
    'He resigned the post of Supervisor of the Masters of Writing.',
  ],
  s0222: [
    'On the day dingsi in the eighth month, he led the great host forth from the capital.',
    'On dingsi day in the eighth month he led the main army out of the capital.',
  ],
  s0223: [
    'He made the heir Prince Central Army General, supervising the Grand Commandants retained headquarters affairs.',
    'The heir was made Central Army General and left to supervise the Grand Commandants headquarters.',
  ],
  s0224: [
    'Master of Writing, Right Vice Director Liu Muzhi was made Left Vice Director, heading supervision of the Army and Central Army headquarters as army clerks, entering to reside in the Eastern Headquarters, overseeing all within and without.',
    'Liu Muzhi, Right Vice Director of the Masters of Writing, became Left Vice Director, supervising the Army and Central Army headquarters, moved into the Eastern Headquarters, and oversaw affairs within and without.',
  ],
  s0225: [
    'In the ninth month, the Duke halted at Pengcheng and was additionally appointed Governor of Xuzhou.',
    'In the ninth month he halted at Pengcheng and was additionally made governor of Xuzhou.',
  ],
  s0226: [
    'Earlier he had sent Champion General Tan Daoji and Flying-dragon General Wang Zhen\u2019e on foot toward Xu and Luoyang; Qiang along the road garrisoned and held, all looked to the wind and submitted.',
    'He had earlier sent Tan Daoji and Wang Zhen\u2019e toward Xu and Luoyang on foot; Qiang garrisons along the route submitted at the first report of his approach.',
  ],
  s0227: [
    'The false Governor of Yanzhou Wei Hua had first held Cangyuan, and also led his host in submission.',
    'Wei Hua, the false governor of Yanzhou, who had held Cangyuan, also surrendered with his troops.',
  ],
  s0228: [
    'The Duke again sent Northern Yanzhou Governor Wang Zhongde first to enter the river with the navy.',
    'Gaozu also sent Wang Zhongde, governor of Northern Yanzhou, to lead the fleet into the river first.',
  ],
  s0229: [
    'Zhongde defeated the Suolu barbarians at Liangcheng in Dongjun and advanced to pacify Pingtai.',
    'Zhongde defeated the Suolu at Liangcheng in Dong commandery and advanced to pacify Pingtai.',
  ],
  s0230: [
    'In the tenth month, the host of armies reached Luoyang and besieged Jinyong.',
    'In the tenth month the armies reached Luoyang and besieged Jinyong.',
  ],
  s0231: [
    'Hongs younger brother, the false Pacifying-south General Guang, asked to surrender and was sent to the capital.',
    'Hong\u2019s younger brother Guang, false Pacifying-south General, surrendered and was sent to the capital.',
  ],
  s0232: [
    'The five tombs of Jin were restored and guards were set.',
    'The five Jin imperial tombs were restored and guards appointed.',
  ],
  s0233: [
    'The Son of Heavens edict said:',
    "The emperor's edict said:",
  ],
  s0234: [
    'Song and Dai match the pole, then the way of Heaven adds brilliance; frontier mountains serve as screens, then emperors and kings complete their task.',
    'When Song and Dai stand as the cosmic pillars, the Way of Heaven shines brighter; when frontier mountains serve as the royal screen, the work of emperors and kings is fulfilled.',
  ],
  s0235: [
    'Therefore Xia and Yin relied on the lords Kun and Peng; Zhou had Qi and Jin as assistants.',
    'Thus Xia and Yin drew on lords like Kun and Peng; Zhou leaned on Qi and Jin as its supports.',
  ],
  s0236: [
    'Mirroring the former canons, as law and model for ten thousand generations—supporting rule and upholding the endangered, none is not through this.',
    'Looking to the ancient precedents, the model for ten thousand generations: to steady the throne and rescue the imperiled, nothing serves better than this.',
  ],
  s0237: [
    'The Grand Commandant, Duke, was by fate of the age Heaven-sent, together sagely and broadly deep, illuminating the four directions, his Way shining through the cosmos.',
    'The Grand Commandant was Heaven-sent for his age, sage and far-reaching, his light falling on the four quarters, his Way filling the universe.',
  ],
  s0238: [
    'From the beginning of □□, then he devoted his effort to the royal house; when the demon locusts were greatly raging, then his merit lay in preserving the altars of state.',
    'From the first stirrings of the righteous restoration he gave himself to the royal house; when ruin threatened the realm, he preserved the altars of state.',
  ],
  s0239: [
    'Thus the four bonds were what he bore, and the ten thousand states relied on him.',
    'The four pillars of the realm rested on him; the myriad states looked to him for support.',
  ],
  s0240: [
    'When Huan Xuan usurped and rebelled, overturning and sweeping the four seas, the Duke deeply held the great constancy; his numinous martiality thundered and quaked, broadly saving Our person, again making the royal house.',
    'When Huan Xuan usurped the throne and shook the four seas, the Duke held fast to the highest loyalty. His martial power thundered forth; he saved Us and remade the dynasty.',
  ],
  s0241: [
    'Every time I reflect on merit and virtue, it is engraved in this heart; then north he cleared the sea and Mount Tai, south he subdued the hundred Yue, Jing and Yong bowed in submission, Yong and Min followed the track, he overcame and removed regional difficulties, and checked and halted bandit cruelty.',
    'His merit is engraved in Our heart: he cleared the north to the sea and Mount Tai, subdued the Yue in the south, brought Jing and Yong to submission, and won Yong and Min to the royal path; he crushed regional rebels and held back invaders.',
  ],
  s0242: [
    'And as chief minister to the royal plan, he ordered ranks within and without, raised up the dying wind, and continued the drifting enterprise beside it.',
    'As chief minister he ordered the court within and without, revived what had nearly perished, and carried on the imperiled enterprise.',
  ],
  s0243: [
    'Holding rites to rectify custom, following the king to hand down instruction—his voice and teaching reached far, none unmoistened.',
    'He upheld ritual to reform custom and followed the royal Way to hand down instruction, until his teaching reached far and all were brought to harmony.',
  ],
  s0244: [
    'Down to chiefs who dwelt in trees and by the sea, and elders with loose hair and tattooed foreheads—none forgot their rugged passes; through nine translations they came to court. This is broadly set forth in glorious records, yet none can exhaust the detail.',
    'Even chiefs who lived in trees and by the sea, men with loose hair and tattooed brows, left their remote strongholds and came to court through many relays of translation—this is recorded in the glorious annals, though the full tale cannot be told.',
  ],
  s0245: [
    'Formerly at the Yongjia disorder the bonds were not maintained, the many Xia were torn apart, the imperial residence of old was lost to barbarian captivity; long we speak of the imperial park and tombs, and all the land shares this longing.',
    'Since the Yongjia disaster the realm had broken apart and the ancient capital had fallen to barbarians; every heart longed for the imperial tombs and the old domain.',
  ],
  s0246: [
    'The Duke, with bright resolve and far-reaching indignation, seized the moment like lightning in campaign, personally directing the feudal lords, and with stern majesty delivered punishment.',
    'With bright resolve and righteous wrath he seized the moment, led the lords in person, and marched in stern majesty to punish the foe.',
  ],
  s0247: [
    'When banners and flags took the road, then the eight regions echoed and trembled;',
    'When his banners took the road, the eight directions trembled at the news;',
  ],
  s0248: [
    'when detached columns went first, then many ramparts were swept like clouds.',
    'when his vanguard advanced, fortress after fortress fell like clouds parting.',
  ],
  s0249: [
    'The old capital was cleared, the five tombs restored to rites; a hundred cities bent the knee, a thousand settlements followed in shadow.',
    'The old capital was cleansed, the five tombs restored to ritual; a hundred cities bowed and a thousand settlements followed in his wake.',
  ],
  s0250: [
    'From what the books record, since living men arose, in merit, virtue, and great achievement there has never been splendor such as this.',
    'In all that the records contain, since men first arose, no merit or achievement has ever matched this splendor.',
  ],
  s0251: [
    'In antiquity Zhou and Lü assisted sage rulers; because of the form of tripartite division, they grasped yak-tail banners and battle-axes—at one time they pointed and commanded, all greatly opening border territories, spanning provinces and holding several states.',
    'Of old Zhou and Lü aided sage rulers; in an age divided in three they bore commanders staffs and axes, opened great territories, and held several provinces at once.',
  ],
  s0252: [
    'Even in the age of Duke Huan and Duke Wen, compared with this they were still more sparing, yet they too clearly received favoring seals and were brightly granted extraordinary ranks.',
    'Even Duke Huan and Duke Wen of Qi were more modest than this, yet they too received conspicuous honors and extraordinary rank.',
  ],
  s0253: [
    'How much more for one who stands alone beyond a hundred generations and looks down on former heroes!',
    'How much more, then, for one who stands alone across a hundred generations and towers above the heroes of the past!',
  ],
  s0254: [
    'We each broadly mirror the ancient instructions and think to follow the present chart.',
    'We have long studied the ancient teachings and sought to follow the proper model.',
  ],
  s0255: [
    'Because the Duke deeply holds modest restraint, the great rites have been left vacant; Heaven and men stretch their necks—for years now this has continued.',
    'Because the Duke has held himself in deep modesty, the greatest honors have been withheld, while Heaven and men have waited these many years.',
  ],
  s0256: [
    'Moreover now the traces of Yu are aligned in one track, the nine frontiers share one script; the Director of Merits raises his plan, and all under Heaven increases its waiting.',
    'Now the realm is united and the nine regions share one script; the Director of Merits has urged this course, and all the world stands waiting.',
  ],
  s0257: [
    'Yet the Duke, lofty in restraint, greatly transgresses the statutes of state; the three spirits look to him with favor—We are truly in reverent fear.',
    'Yet the Duke still holds back, to the great injury of the realm; the spirits of Heaven, Earth, and Man look to him—We are filled with reverent dread.',
  ],
  s0258: [
    'It is fitting at once to answer clearly the hopes of the multitude and to grant and exalt the great ceremony.',
    'It is time to answer the hopes of all and grant the supreme ceremony.',
  ],
  s0259: [
    'He is advanced to Chief Minister, overseeing the hundred officials, Governor of Yangzhou, enfeoffed with ten commanderies as Duke of Song, provided the rites of the Nine Bestowals, with added seal-cord and the Far-roaming cap, rank above the feudal princes and kings, with added green ribbon for the Chief Minister.',
    'He is promoted to Chief Minister, director of the hundred offices, Governor of Yangzhou, enfeoffed as Duke of Song over ten commanderies, granted the Nine Bestowals, the Far-roaming cap, and rank above the princes, with the chief ministers green ribbon.',
  ],
  s0260: [
    'The mandate read:',
    'The mandate read:',
  ],
  s0261: [
    'We, with little clarity, look up to assist the great foundation; Yi of the east seized the opportunity, overturning and capsizing the royal house; Yue was in the southern borderlands, and We moved to the Jiujiang.',
    'We, though lacking in wisdom, uphold the great foundation. Yi seized his chance and overturned the royal house; the court was driven south to Jiujiang.',
  ],
  s0262: [
    'The ancestral sacrifices were cut off from offerings, men and spirits had no place; We led the flock of villains and entrusted Our life to the riverbank.',
    'Ancestral sacrifices ceased and men and spirits were left without place; We were driven among the wicked and Our life was cast upon the rivers bank.',
  ],
  s0263: [
    'Then the enterprise of Our ancestors fell suddenly to earth; the seven hundred years of fortune were already cut down; as if crossing a deep sea, We knew not how to cross.',
    'The work of Our ancestors collapsed; seven hundred years of fortune were cut short; We were as one drowning in a deep sea, with no way to cross.',
  ],
  s0264: [
    'Heaven had not ended Jin; it bore and nurtured an heroic assistant, who shook the slackened bonds and again made the realm, continuing the dying and restoring the cut off, making the dim bright.',
    'Heaven had not ended Jin. It raised an heroic helper who tightened the slackened bonds, remade the realm, continued the dying line, and brought light where there had been darkness.',
  ],
  s0265: [
    'The first merit and utmost virtue—We truly rely on him.',
    'His supreme merit and virtue are Our reliance.',
  ],
  s0266: [
    'Now We shall confer on the Duke the canon and mandate; respectfully hear Our command:',
    'Now We confer the canon and mandate upon the Duke. Hear Our command:',
  ],
  s0267: [
    'Then Huan Xuan wantonly usurped, flooding Heaven and extinguishing Xia, uprooting the root and blocking the source, overturning the six positions; the multitude of officials bowed their brows, and the four directions none pitied.',
    'Huan Xuan usurped the throne, overwhelmed Heaven, and extinguished Xia; he uprooted the root and blocked the source, overturned the six ranks, and left officials bowed in fear while the four quarters looked on without pity.',
  ],
  s0268: [
    'The Duke, essence penetrating the morning sun, spirit mounting the Han of Heaven, roused his numinous martiality and greatly slaughtered the flock of villains, recovering the imperial city and presenting the emperor to the spirits.',
    'The Duke, bright as the morning sun and lofty as the Milky Way, roused his martial power, destroyed the rebels, recovered the imperial city, and restored the emperor before the spirits.',
  ],
  s0269: [
    'This was the Dukes great constancy, [7] beginning in the service of the righteous king.',
    'This was the Dukes great loyalty, [7] shown first in restoring the righteous ruler.',
  ],
  s0270: [
    'He received the law among the feudal lords, went upstream in long gallop, made light war on the lofty peaks, presented victory at Southern Ying, the great villain broke his head, the flock of rebels were all leveled, the three luminaries turned their light, and old things returned to the right.',
    'He took command among the lords, marched upstream in swift pursuit, struck the high peaks, and reported victory at Southern Ying; the chief villain was beheaded, the rebels destroyed, the three lights shone again, and the old order was restored.',
  ],
  s0271: [
    'This too was the Dukes achievement.',
    'This too was the Dukes achievement.',
  ],
  s0272: [
    'Going out to the frontier and entering as assistant, he spread this protection and support, enriched goods and benefited use, multiplied the living people; registered households increased year by year, border territories opened day by day; he guided virtue and clarified punishments, and the four borders had bounds.',
    'Whether in the provinces or at court he guarded and aided the throne, enriched goods, multiplied the people, increased registered households, and opened the borders; he guided by virtue and clarified punishments until the four quarters were bounded.',
  ],
  s0273: [
    'This too was the Dukes achievement.',
    'This too was the Dukes achievement.',
  ],
  s0274: [
    'The Xianbei bore their multitudes, usurped and stole the three Qi, wolf-like devoured Ji and Qing, reverent-slaying ravaged Yi and Dai, relying on distant barriers, still making border harm.',
    'The Xianbei gathered their hosts, seized the three Qi, wolfed down Ji and Qing, ravaged Yi and Dai, and trusting in distance continued to plague the borders.',
  ],
  s0275: [
    'The Duke gathered chariots and fed steeds, entered the far frontier, assault towers looked on all four sides, ten thousand ramparts all collapsed; the usurping captives were displayed in punishment before the Minister of Crime, territory expanded by three thousand, and might was declared on the Dragon Desert.',
    'He gathered chariots and fed his horses, entered the far frontier, assaulted from four sides until every wall fell; the usurpers were displayed in punishment, three thousand li of territory were won, and his might reached the Dragon Desert.',
  ],
  s0276: [
    'This too was the Dukes achievement.',
    'This too was the Dukes achievement.',
  ],
  s0277: [
    'Lu Xun, demonic and vicious, watched for a gap in the five ridges, seized emptiness and wantonly rebelled, invaded and overturned Jiang and Yu; banners brushed the inner realm, arrows reached the royal city; court and countryside lost heart, none had firm resolve; families offered plans to move the divination boards, the state debated plans to move the capital.',
    'Lu Xun, that demon of the five ridges, seized his chance and rebelled, overran Jiang and Yu, and sent his banners and arrows to the royal city; court and country lost heart and some urged moving the capital.',
  ],
  s0278: [
    'The Duke rode the shafts south across the river; righteousness showed in his face; sternly calm within, he viewed peril as level ground; deploying strategy and moving wonders, heroic plans unmatched in the age—the cunning bandit was driven to extremity, lost his banners and fled by night, and made Our capital district rescued from the verge of falling.',
    'He drove south across the river, righteousness plain on his face, calm in peril as on level ground; by strategy he drove the rebel to ruin, made him flee by night, and saved the capital from the brink of fall.',
  ],
  s0279: [
    'This too was the Dukes achievement.',
    'This too was the Dukes achievement.',
  ],
  s0280: [
    'Pursuing the fleeing and chasing the north, he raised banners on the river bank; detached brigades floated the sea and within days swiftly arrived.',
    'He pursued the fleeing foe and raised his banners on the river; detachments crossed the sea and arrived within days.',
  ],
  s0281: [
    'At Panyu the achievement: captives and severed heads in tens of thousands; at Zuoli the victory: fish scattered and birds dispersed.',
    'At Panyu the captives numbered in the tens of thousands; at Zuoli the enemy broke like fish and scattered like birds.',
  ],
  s0282: [
    'The chief villain fled far, his head transmitted ten thousand li; Hainan was swept clear, and the wild domains came in good faith.',
    'The chief rebel fled far; his head was sent ten thousand li; Hainan was pacified and the distant regions submitted.',
  ],
  s0283: [
    'This too was the Dukes achievement.',
    'This too was the Dukes achievement.',
  ],
  s0284: [
    'Liu Yi rebelled and changed sides, bearing guilt in western Xia, insulting superiors and deceiving the ruler, his will set on wicked violence; clinging to factions and stirring parties, he fanned and swept the royal precinct.',
    'Liu Yi rebelled in the west, insulted his sovereign, and gave his heart to treason; he gathered factions and shook the capital.',
  ],
  s0285: [
    'The Duke controlled the track with punishment; within days they were dissolved; the storehouse rhinoceros flashed like lightning upstream, divine troops swept like wind; the guilty man was obtained, Jing and Heng were cleared and tranquil.',
    'He met them with punishment and destroyed them within days; his armies moved like lightning and wind; the guilty were taken and Jing and Heng were pacified.',
  ],
  s0286: [
    'This too was the Dukes achievement.',
    'This too was the Dukes achievement.',
  ],
  s0287: [
    'Qiao Zong relied on disorder, bandits stealing one corner; royal transformation was blocked and barred, and the three Ba were drowned.',
    'Qiao Zong clung to rebellion and stole a corner of the realm; royal rule was blocked and the three Ba were lost.',
  ],
  s0288: [
    'The Duke pointed and ordered a detached column, entrusted them with a good plan; crossing waves and floating rapids, they arrived at Jingluo; the usurping villain submitted to the axe, Liang and Min lay down like grass.',
    'He sent a detached column with a sound plan; crossing waves and rapids they reached Jingluo; the rebel submitted to the axe and Liang and Min lay down like grass.',
  ],
  s0289: [
    'This too was the Dukes achievement.',
    'This too was the Dukes achievement.',
  ],
  s0290: [
    'Ma Xiu and Lu Zong blocked arms and insulted within; driving and leading the two regions, they linked banners and called it rebellion.',
    'Ma Xiu and Lu Zong took up arms in internal revolt, raised banners in two regions, and called it rebellion.',
  ],
  s0291: [
    'The Duke, with sleeves flung back and words like stars, studied the upper strategy; at the Jiangjin army the momentum exceeded wind and lightning; turning banners on the Mian River, the reality was abundant in shock and fear—the two rebels fled in haste, Jing and Yong came back to life, dark blessings soaked in nurture, warm winds secretly spread.',
    'He flung back his sleeves and planned at once; at Jiangjin his army moved faster than wind and lightning; turning on the Mian he struck terror; the two rebels fled and Jing and Yong revived, soaked in his grace.',
  ],
  s0292: [
    'This too was the Dukes achievement.',
    'This too was the Dukes achievement.',
  ],
  s0293: [
    'At the Yongjia disorder there was no contest; the four barbarians seized China; the five capitals were torn apart, hills and tombs suffered hidden shame; the ancestors harbored wrath for a world never seen, and the remnant people had the longing of the unorthodox wind.',
    'Since the Yongjia disaster the four barbarians had seized the heartland, the five capitals were torn apart, and the tombs were shamed; the ancestors wrath never died, and the remnant people longed for restoration.',
  ],
  s0294: [
    "The Duke, far aligning with the Yi minister's benevolence of receiving the moat, near sharing the small white's shame of extinction destroyed, rolled up brigades and arrayed armies, awesomely raising the great call; he divided command among the host of generals and marched north through Si and Yan.",
    "He matched the Yi minister's mercy in receiving those in the moat and shared Duke Huan of Qi's shame at extinction; he gathered his armies, raised the great call, and sent his generals north through Si and Yan.",
  ],
  s0295: [
    'Xu and Zheng bent to the wind, Gong and Luo were loaded clear; false governors and rebellious frontiers interlocked arms and asked guilt; a hundred years of thorns and filth were swept clean in one morning.',
    'Xu and Zheng submitted, Gong and Luo were cleared; false governors and rebel frontiers surrendered at once; a hundred years of ruin were swept clean in a morning.',
  ],
  s0296: [
    '[8]This too was the Dukes achievement.',
    '[8]This too was the Dukes achievement.',
  ],
  s0297: [
    'The Duke has merit in bringing peace to the realm within, and weight is added by bright virtue.',
    'The Duke has brought peace within the seas, and bright virtue crowns his merit.',
  ],
  s0298: [
    'When first he raised his traces, then wondrous plans crowned antiquity; lightning struck strong demons, then the point met no front opposite; he tranquilly settled the eastern capital region and greatly made the black-haired people.',
    'From his first rise his plans surpassed the ancients; he struck down mighty foes as lightning strikes; he pacified the eastern capital and gave new life to the people.',
  ],
  s0299: [
    'As for grass and darkness, warp and woof—transformation melted within the years reckoning; supporting the endangered and quieting disorder—the Way was firm in the mulberry wrapped round.',
    'In founding the realm he wove order year by year; in supporting the endangered and quieting disorder his Way was firm as mulberry roots.',
  ],
  s0300: [
    'Discerning the square and setting position, he received them into measure and rule; he cut away troublesome severity, compared as if drawn with one stroke; pure wind and beautiful transformation filled and blocked the cosmos.',
    'He set ranks in their proper places, cut away harsh rule until it was uniform as a single line, and filled the cosmos with pure custom and gracious transformation.',
  ],
  s0301: [
    'Therefore the farthest domains presented tribute, distant barbarians offered tribute; where the royal plan was proclaimed, the nine services followed in obedience.',
    'Therefore the farthest lands sent tribute and distant peoples offered gifts; where his royal design reached, the nine regions followed.',
  ],
};

for (const s of data.sentences) {
  const t = T[s.id];
  if (!t) {
    console.error('missing', s.id);
    process.exit(1);
  }
  s.literal = t[0];
  s.idiomatic = t[1];
}

fs.writeFileSync(
  'translations/current_translation_songshu.json',
  JSON.stringify(data, null, 2) + '\n'
);
console.log('done', data.sentences.length);
