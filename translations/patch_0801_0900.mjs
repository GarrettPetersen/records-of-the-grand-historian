import fs from 'fs';
const p = 'translations/current_translation_jinshu.json';
const d = JSON.parse(fs.readFileSync(p, 'utf8'));
const P = {
  s0801: [
    'When Teng had been defeated, Zhen and his men intercepted and routed Ji Sang at Red Bridge; Yue appointed Zhen Grand Administrator of Ji commandery and Lan Grand Administrator of Julu.',
    'After Teng fell, Tian Zhen broke Ji Sang at Red Bridge; Sima Yue rewarded him with Ji commandery and made Tian Lan governor of Julu.'
  ],
  s0802: [
    'Zhen sought Wei commandery; Yue did not permit it; Zhen grew angry, and therefore when summoned he failed to appear.',
    'Tian Zhen asked for Wei commandery; Yue refused; Zhen sulked and ignored further summons.'
  ],
  s0803: [
    'Once Liu Wang had crossed the river, Zhen withdrew.',
    'When Surveillance Officer Liu Wang crossed the Yellow River, Tian Zhen pulled back.'
  ],
  s0804: [
    'Li Yun and Bo Sheng executed Tian Lan, led his troops in surrender, and Zhen, Ren Zhi, and Qi Ji abandoned their army and fled to Shangdang.',
    'Li Yun and Bo Sheng killed Tian Lan and surrendered his force; Tian Zhen, Ren Zhi, and Qi Ji bolted and ran for Shangdang.'
  ],
  s0805: [
    'Yue returned from Xingyang to Luoyang and made the Imperial Academy his headquarters.',
    'Sima Yue came back from Xingyang to Luoyang and quartered his staff in the Imperial Academy.'
  ],
  s0806: [
    'Suspecting that court ministers were divided against him, he falsely accused the Emperor\'s maternal uncle Wang Yan and others of rebellion, dispatched Wang Jing at the head of three thousand armored soldiers to enter the palace and seize Yan and the rest, handed them to the Commandant of Justice, and had them executed.',
    'Paranoid about the bureaucracy, he framed Emperor Huai\'s uncle Wang Yan for treason, sent Wang Jing with three thousand guards into the palace, and had Yan and his alleged accomplices executed.'
  ],
  s0807: [
    'Yue relinquished the office of Yanzhou shepherd and concurrently served as Minister of Education.',
    'He stepped down as Yanzhou shepherd and took the portfolio of Minister of Education.'
  ],
  s0808: [
    'Yue had already nursed a grudge against Gou Xi; moreover, because recent troubles had largely originated in the palace halls, he memorialized that all night guards holding marquis ranks should be dismissed.',
    'Already at odds with Gou Xi, he blamed palace insiders for recent unrest and cashiered every night guard who held a marquisate.'
  ],
  s0809: [
    'At that time the martial officers of the palace halls had all been enfeoffed as marquises; accordingly almost all who departed left weeping.',
    'Those martial officers had all been made marquises; nearly every one left his post in tears.'
  ],
  s0810: [
    'Thereupon he appointed He Lun of the Donghai kingdom\'s Superior Army as General of the Right Guard and Wang Jing as General of the Left Guard, placing several hundred troops of the kingdom on palace duty.',
    'He assigned He Lun of Donghai\'s superior army to the Right Guard, Wang Jing to the Left Guard, and left several hundred royal troops to watch the palace.'
  ],
  s0811: [
    'After Yue himself had executed Wang Yan and the others, he forfeited popular expectation and was subject to much suspicion.',
    'Murdering Wang Yan destroyed his credibility and fed endless mistrust.'
  ],
  s0812: [
    'Gentleman Attendant Gao Tao spoke words that showed concern for the state; Yue falsely accused him of slandering current policy and brought harm upon him, yet did not feel secure himself.',
    'When Gao Tao voiced patriotic concern, Yue framed him for defaming the court and had him killed, yet remained uneasy.'
  ],
  s0813: [
    'Thereupon he appeared in martial dress for audience, requested a campaign against Shi Le, and proposed gathering Yanzhou and Yuzhou forces to relieve the capital.',
    'He appeared in armor, pledging to strike Shi Le while rallying Yan and Yu to shield Luoyang.'
  ],
  s0814: [
    'The Emperor said, "Now the rebel bandits press against the royal suburbs; the royal house trembles, and none hold firm resolve."',
    'Emperor Huai replied that rebels besieged the capital region and the court had lost its nerve.'
  ],
  s0815: [
    '"The court and the altars of soil and grain rely upon you—how can you go far away and isolate the root!"',
    '"The throne depends on you—how can you abandon the capital?"'
  ],
  s0816: [
    'Yue replied, "Your servant now leads the host to intercept the bandits; the situation will surely destroy them."',
    'Yue insisted his army would intercept the enemy and crush them.'
  ],
  s0817: [
    '"Once the bandits are destroyed, then unrestrained evil will be extinguished, and tribute from the provinces east of Xiao will flow without obstruction."',
    'Victory, he said, would pacify the east and restore tribute routes.'
  ],
  s0818: [
    '"This is how to broadcast the state\'s majesty—the proper duty of a frontier shield."',
    'That, he argued, would project imperial prestige along the border marches.'
  ],
  s0819: [
    '"If one sits idle in the capital coach and misses the opportunity, then blame and decay will grow daily, and our worries will weigh heavier still."',
    'Staying put, he warned, would only deepen the crisis.'
  ],
  s0820: [
    'With that, he set out.',
    'He marched anyway.'
  ],
  s0821: [
    'He left Consort Pei, the heir Pi (General Who Guards the Army), and General Who Flies His Dragons Li Yun together with He Lun and others to defend the capital.',
    'He left Consort Pei, heir Pi, Li Yun, He Lun, and others to hold Luoyang.'
  ],
  s0822: [
    'He memorialized that the mobile headquarters should follow the army; leading forty thousand armored soldiers he encamped east at Xiang, and many nobles, ministers, and gentlemen accompanied him.',
    'His field headquarters followed forty thousand armored men to Xiang; a host of nobles and officials trailed along.'
  ],
  s0823: [
    'An edict added the nine bestowals.',
    'The throne stacked the nine ceremonial gifts on him.'
  ],
  s0824: [
    'Yue then sent feathered summons to the four quarters, saying, "The imperial net has lost its governance; the altars face many hardships; I, weak in talent, have been charged with a great duty."',
    'He issued a manifesto lamenting lost control and naming himself the burdened rescuer of the dynasty.'
  ],
  s0825: [
    '"Recently Hu bandits have pressed inward; lieutenants have suffered defeat; the imperial district has become a barbarian zone; caps and sashes have suddenly turned into alien lands—above and below at court all feel alarm and fear."',
    'He described barbarian pressure, defeated wings, and the heartland slipping into foreign hands.'
  ],
  s0826: [
    '"All this is because the feudal lords hesitated and dragged their feet, until we reached this calamity."',
    'He blamed rival princes for dithering until disaster struck.'
  ],
  s0827: [
    '"They cast aside sleeves and forgot shoes—the time to punish them is already late."',
    'They had stirred too late—vengeance now came behind events.'
  ],
  s0828: [
    '"Human hearts cling to their sovereign; none fail to rise in righteous zeal."',
    'Loyalty to the throne, he urged, should galvanize every commander.'
  ],
  s0829: [
    '"We must assemble united hosts and await readiness for battle and defense."',
    'He called for united armies ready to fight and hold ground.'
  ],
  s0830: [
    '"The ancestral temples and our sovereign depend upon one another for rescue."',
    'Altar and emperor alike needed joint rescue.'
  ],
  s0831: [
    '"On the day this summons arrives, let all rally when they hear the wind—the hour when loyal ministers and warriors prove their devotion."',
    'He proclaimed this the moment for loyalists to answer.'
  ],
  s0832: [
    'None of those summoned came.',
    'Nobody responded.'
  ],
  s0833: [
    'Gou Xi moreover memorialized for a campaign against Yue; the account is given in the biography of Gou Xi.',
    'Gou Xi attacked him—the story belongs to Gou\'s biography.'
  ],
  s0834: [
    'Yue appointed Feng Song, Inspector of Yuzhou, as Left Major and himself concurrently served as shepherd of Yuzhou.',
    'He named Feng Song Left Major and took the Yuzhou shepherd\'s seal himself.'
  ],
  s0835: [
    'Yue monopolized awe-inspiring authority and plotted hegemonic rule; eminent courtiers of plain renown were selected as his clerks; famed generals and crack troops filled his own mansion—conduct unbefitting a minister was known throughout the realm.',
    'He hoarded power like a warlord: eminent ministers became his clerks, elite troops his household guard—everyone knew he no longer behaved as a subject.'
  ],
  s0836: [
    'Yet public and private stores were exhausted; banditry arose everywhere; provinces and commanderies wavered in loyalty; high and low split apart; calamity and ill will knotted deep—thereupon anxiety and fear turned into illness.',
    'Exhaustion and rebellion everywhere, provinces turning coat, court split—fear sickening him.'
  ],
  s0837: [
    'In the fifth year of the Yongjia reign he died at Xiang.',
    'He died in Yongjia year five at Xiang.'
  ],
  s0838: [
    'His death was concealed and mourning was not announced.',
    'His staff hid the corpse.'
  ],
  s0839: [
    'Prince Fan of Xiangyang was named Grand General and placed in command of his forces.',
    'Prince Fan of Xiangyang took command of the army.'
  ],
  s0840: [
    'His remains were returned for burial in Donghai.',
    'His body went home to Donghai for burial.'
  ],
  s0841: [
    'Shi Le overtook them at Ningping city in Ku county; General Qian Duan led troops out to oppose Le, died in battle, and the army collapsed.',
    'Shi Le caught the procession at Ningping in Ku county; Qian Duan died resisting and the column dissolved.'
  ],
  s0842: [
    'Le ordered Yue\'s coffin burned, saying, "This man threw All-under-Heaven into chaos; your servant avenges All-under-Heaven; therefore I burn his bones to inform Heaven and Earth."',
    'Shi Le burned Yue\'s coffin, calling it cosmic justice.'
  ],
  s0843: [
    'Thereupon, amid several hundred thousand troops, Le ringed them with cavalry and shot them down; they trampled one another like a mountain.',
    'His horsemen surrounded hundreds of thousands and shot them into a writhing heap.'
  ],
  s0844: [
    'More than a hundred thousand nobles, gentlemen, and commoners perished.',
    'Over a hundred thousand nobles and commoners died.'
  ],
  s0845: [
    'Wang Mi\'s younger brother Zhang burned the remainder of the host and devoured them together.',
    'Wang Mi\'s brother Wang Zhang burned survivors and fed on the dead.'
  ],
  s0846: [
    'All-under-Heaven laid the blame on Yue.',
    'The realm blamed Yue for the catastrophe.'
  ],
  s0847: [
    'The Emperor issued an edict demoting Yue to Prince of a county.',
    'Emperor Huai stripped him to a county-level princedom.'
  ],
  s0848: [
    'He Lun and Li Yun, hearing of Yue\'s death, concealed it and did not announce mourning; escorting Consort Pei and Pi they quit the capital; their followers emptied the city, and wherever they passed they plundered violently.',
    'He Lun and Li Yun smuggled Consort Pei and Pi out of Luoyang without mourning Yue publicly; their train looted half the city.'
  ],
  s0849: [
    'When they reached the Wei granary, they were again defeated by Le; Pi and thirty-six princes of the imperial clan together fell to the bandits.',
    'Near the Wei granary Shi Le smashed them; Pi and thirty-six imperial princes perished.'
  ],
  s0850: [
    'Li Yun killed his wife and children and fled to Guangzong; He Lun fled down to Xiapi.',
    'Li Yun slaughtered his family and ran to Guangzong; He Lun fled toward Xiapi.'
  ],
  s0851: [
    'Consort Pei was seized by others and sold to the Wu clan; in the Taixing era she was able to cross the Yangzi and wished to summon his soul and bury Yue.',
    'Kidnappers sold Consort Pei into the Wu household; she later crossed south in Taixing and wanted a soul-summoning burial for Yue.'
  ],
  s0852: [
    'Emperor Yuan ordered the relevant offices to deliberate in detail; Erudite Fu Chun said, "The sages instituted ritual so that affairs follow feeling: they set mound and outer coffin to hide the form and serve it with the accursed rites;',
    'Emperor Yuan asked the ministry; Fu Chun argued that burial rites hide the body under ill-omened observance.'
  ],
  s0853: [
    'they established distant shrine temples to settle the spirit and served it with auspicious rites.',
    'Ancestral temples house the spirit under auspicious cult.'
  ],
  s0854: [
    'Send the form away; welcome the essence back.',
    'You escort the corpse out and welcome the spirit home by another path.'
  ],
  s0855: [
    'This is the great distinction between tomb and temple—the different systems for body and spirit.',
    'Graves and temples answer to different rules for body and soul.'
  ],
  s0856: [
    'As for side-chamber and distant temples, side sacrifices not being in one place—thereby they broadly seek the way of the spirits; yet they alone do not sacrifice at the tomb, making clear that it is not where the spirit dwells.',
    'Because worship ranges across shrines, the dead are not venerated at the burial mound—that place is not the spirit\'s seat.'
  ],
  s0857: [
    'Now we confuse the distinction of body and spirit and invert the propriety of temple and tomb; nothing greater violates ritual and rightness than this."',
    'Equating tomb cult with temple rites, he said, was the grossest breach of ritual.'
  ],
  s0858: [
    'Thereupon an edict was issued forbidding it.',
    'The court refused her request.'
  ],
  s0859: [
    'Consort Pei did not obey the edict and buried Yue at Guangling.',
    'She buried him at Guangling anyway.'
  ],
  s0860: [
    'Near the end of Taixing the tomb was destroyed; he was reburied at Dantu.',
    'Late in Taixing robbers broke the tomb; he was moved to Dantu.'
  ],
  s0861: [
    'At first, when Emperor Yuan garrisoned Jianye, it was Consort Pei\'s intent; the Emperor deeply valued her virtue, visited her mansion several times, and made his third son Chong heir to Yue\'s line.',
    'Consort Pei had urged Emperor Yuan to base himself at Jianye; grateful, he adopted her cause and let his third son Chong continue Yue\'s posterity.'
  ],
  s0862: [
    'When she died she had no son; Emperor Cheng had his youngest son Yi continue the line.',
    'When Chong died without issue, Emperor Cheng placed his youngest son Yi in the line.'
  ],
  s0863: [
    'Emperor Ai moved Yi to Prince of Langye, and Donghai had no heir.',
    'Emperor Ai transferred Yi to Langye, leaving Donghai vacant.'
  ],
  s0864: [
    'At the start of Long\'an, Emperor An again appointed Yanzhang, second son of Prince Zhong of Kuaiji, Prince of Donghai, to succeed Chong as great-grandson.',
    'Early in Long\'an, Emperor An named Yanzhang, Prince Zhong of Kuaiji\'s second son, Prince of Donghai to continue Chong\'s line.'
  ],
  s0865: [
    'He was harmed by Huan Xuan, and the state was abolished.',
    'Huan Xuan killed him and abolished the fief.'
  ],
  s0866: [
    'The historians say: In antiquity the High Lord nurtured his fortune, yet strife arose between Shen and Shang;',
    'The chroniclers say: ancient Gaoxin saw strife flare between Shen and Shang.'
  ],
  s0867: [
    'The Zhou house inherited the calendar, but disaster tangled Guan and Cai.',
    'Zhou\'s succession snared Guan and Cai in revolt.'
  ],
  s0868: [
    'When one scans the registers of old and listens across former ages, rebellious ministers and traitorous sons stand reflected in the bright mirror.',
    'History leaves traitors nowhere to hide.'
  ],
  s0869: [
    'When Jin flourished, it honored its feudal bulwarks; it divided fiefs and granted auspicious tokens—its virtue shone in enduring canon;',
    'Jin ennobled kin, handed out jade tokens, and wrapped the act in shining precedent.'
  ],
  s0870: [
    'Its ceremonial terrace and ornamented robes completed the constant statutes of ritual.',
    'Regalia and ritual crowned each prince properly.'
  ],
  s0871: [
    'The Prince of Runan, by a disposition purely mild, failed through indecision;',
    'Runan\'s gentle temper left him irresolute.'
  ],
  s0872: [
    'The Hidden Prince of Chu, practicing sharp audacity, thereby became cruel and fierce.',
    'Chu\'s aggressive streak curdled into cruelty.'
  ],
  s0873: [
    'Some held rank at the court\'s right; some served within the forbidden precincts—all were deceived by women and executed one after another; though it is said they brought it on themselves, how pitiable!',
    'Whether at court or in the harem, women outplayed them—each died in turn, pitiable even if self-inflicted.'
  ],
  s0874: [
    'Lun was truly mean and petty; deceived by Sun Xiu, he secretly framed a different plot and fanned treacherous evil.',
    'Lun was a vulgar pawn of Sun Xiu\'s conspiracy.'
  ],
  s0875: [
    'Thereby he caused the crown prince to meet cruel resentment and the chief minister to fall to execution and slaughter—the heavenly radiance thereby tilted briefly, and the imperial net thereby broke mid-course.',
    'He destroyed the heir and top ministers; the throne flickered and the dynastic net tore.'
  ],
  s0876: [
    'Then crowns were torn and caps destroyed, chancing upon the conjunction of the hundred and six;',
    'Regalia shattered when fate hit its crisis.'
  ],
  s0877: [
    'Seals were threaded and banners raised, spying on the honor of the Nine-and-Five.',
    'He grasped the seal and eyed the throne.'
  ],
  s0878: [
    'How may the sacred vessel be seized in ease—how may the great name be falsely borrowed!',
    'The mandate cannot be stolen; the imperial style cannot be faked.'
  ],
  s0879: [
    'Yet wishing to rely on licentious sacrifice and enjoy those Heaven-allotted years—nothing could be darker or more vicious.',
    'Seeking long life through foul worship—nothing viler.'
  ],
  s0880: [
    'Jiong was the son of a famed father; he raised righteousness and diligently served the king—he shattered the false enterprise once accomplished and raised the imperial carriage once fallen; his deeds merited praise in the assessment of merit.',
    'Jiong rallied loyal armies, broke the usurper, and restored the carriage—his record deserved praise.'
  ],
  s0881: [
    'Yet facing calamity he forgot worry; he indulged his heart and gave rein to desire—never knowing that joy cannot reach its limit nor fullness endure long—he laughed that the ancients lacked skill and forgot how clumsy his own affairs had become.',
    'Yet amid peril he chased pleasure, mocked the wise, and missed his own folly.'
  ],
  s0882: [
    'Had he adopted Wang Bao\'s singular stratagem and accepted Sun Hui\'s fine counsel—high refusing the ceremonial robes and forever displaying integrity east of the sea—even the ancient Yi Yin and Huo Guang—what could add beyond that!',
    'Had he taken Wang Bao and Sun Hui\'s advice—abdicating glory for exile east of the sea—he might have rivaled Yi Yin or Huo Guang.'
  ],
  s0883: [
    'The Prince of Changsha\'s strength of materials surpassed others; his loyalty towered beyond custom—he cast aside his bow at Ye Gate and stood tall with the air of a stalwart;',
    'Changsha\'s Yi matched peerless courage with loyalty—at Ye Gate he dropped bow and stood like a champion.'
  ],
  s0884: [
    'He raced his carriage at the Wei towers and clasped the wind of a martyr in awe.',
    'He drove on the Wei palace tiers with martyr fire in his eyes.'
  ],
  s0885: [
    'Though the fate of "yang nine" repeated its oppression, the affection of "being in three" was not taken from him.',
    'Ill omens multiplied, yet kinship duty held.'
  ],
  s0886: [
    'Cherish his surviving integrity—beginning to end it invites regard.',
    'His steadfast honor stands clear from first to last.'
  ],
  s0887: [
    'Once Ying had entered to wield overall power and gone out to dwell on a heavy garrison, the central terrace relied on him to finish affairs and the eastern summer supplied his settled intent—then he joined covenant with Hejian to plot advance together.',
    'Ying ruled from court and camp alike, then allied with Prince Yong of Hejian for further grabs.'
  ],
  s0888: [
    'Yet Yong employed Li Han\'s deceit and leaned on Zhang Fang\'s oppression—thereby Wu Min lost his head and Changsha yielded his neck; he displayed his lordless ambition and boasted of unrighteous strength.',
    'Yong wielded Li Han and Zhang Fang until Wu Min fell and Changsha died—flaunting treason and brute force.'
  ],
  s0889: [
    'The imperial carriage toured north—unlike a campaign without battle;',
    'The imperial train went north—no peaceful punitive march.'
  ],
  s0890: [
    'The throne went west in favor—not by inspecting ranks and observing the winds.',
    'The throne fled west—not a ritual tour of the provinces.'
  ],
  s0891: [
    'If fire spreads across the prairie it may still be extinguished—how much more such cruelty—how can calamity fail to arrive!',
    'Grassfires can be stamped out—this cruelty spread unchecked.'
  ],
  s0892: [
    'Donghai rallied allies in covenant and began a righteous undertaking; merit of restoration was not yet established, yet the offense of bullying supremacy was already manifest—he emptied those chariots and foot soldiers and insisted on seeking assignment beyond the capital.',
    'Donghai\'s league claimed restoration yet bullied the throne—before victory he drained the capital guard and bolted to a frontier command.'
  ],
  s0893: [
    'Afterward the imperial capital was feeble; cunning bandits leaned upon it—thereupon the sacred vessel was seized and moved, the ancestral altars overturned; several hundred thousand hosts together hung as bait for wolves and jackals; thirty-six princes all fell upon blades.',
    'Luoyang collapsed; regalia moved, altars fell—hundreds of thousands fed wolves while thirty-six princes died by the sword.'
  ],
  s0894: [
    'The extremity of calamity—unheard of since antiquity shook.',
    'No age had seen ruin so complete.'
  ],
  s0895: [
    'Though it reached the burning annihilation (of Hexagram Li), still it counted as fortune.',
    'Even fiery slaughter seemed mercy beside what followed.'
  ],
  s0896: [
    'From Emperor Hui\'s loss of governance, hardship rose within the curtain wall—flesh and bone slew one another; the black-haired people were smeared in charcoal; Hu dust alarmed and Heaven and Earth closed; barbarian weapons met and palace temples ruined—the collateral branches began the disaster\'s edge; Rong and Jie rode the gap—alas!',
    'After Emperor Hui lost control, kin slaughtered kin while commoners burned; northern alarms sealed heaven and earth, barbarian blades smashed the palace—the princes opened the breach for Rong and Jie hordes—alas!'
  ],
  s0897: [
    'What the Book of Songs calls, "Who gave rise to the stairway of harm—it remains a stumbling block to this day"—that refers to these eight princes.',
    'As the Songs ask who carved the stairway of ruin still blocking the realm—these eight princes did.'
  ],
  s0898: [
    'Encomium: Liang oversaw court government; Wei harbored rivalry for office.',
    'Encomium: Liang ran the court; Wei craved higher station.'
  ],
  s0899: [
    'Slander and craft rode the gaps; a beautiful wife listened too credulously.',
    'Slander slipped through when favored wives believed too fast.'
  ],
  s0900: [
    'They built up resentment and linked calamities; one after another they met violent deaths.',
    'Hatred chained into disaster; each prince died an unnatural death.'
  ]
};
for (const [id, v] of Object.entries(P)) {
  const s = d.sentences.find((x) => x.id === id);
  if (!s) {
    console.error('missing', id);
    process.exit(1);
  }
  s.literal = v[0];
  s.idiomatic = v[1];
}
fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n');
console.log('patched', Object.keys(P).length);
