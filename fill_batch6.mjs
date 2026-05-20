import fs from 'fs';

const EQ = 'Equals sign used as a typographical section divider.';
const EQi = 'Typographical section divider.';

const raw = fs.readFileSync('translations/current_translation_jinshu.json', 'utf8');
const cur = JSON.parse(raw);

const B6 = {
  s0502: [
    'One explanation says: In years when water dominates, many chickens die and prodigious anomalies occur—this too counts.',
    'Another gloss holds that water-phase years bring mass deaths among fowl and strange portents—and that belongs here as well.',
  ],
  s0503: [
    'When those above lose dignity of bearing, there will be powerful ministers who harm the sovereign; hence there are ailments of the lower body appearing upon the upper.',
    'When superiors forfeit proper bearing, strong ministers wound the ruler—which yields the prodigy of “lower members sprouting on the upper body.”',
  ],
  s0504: [
    'The color of wood is green; hence there are green calamities (qing sheng) and green auspices (qing xiang).',
    'Wood’s hue is green, which is why green blights and green omens appear.',
  ],
  s0505: [
    'Generally, when bearing is impaired it sickens the qi of wood; when the qi of wood is sick, metal harms it—the clashing qi communicate with one another.',
    'Whenever demeanor falters, the wood phase suffers; when wood ails, metal strikes it—the two opposing forces interact.',
  ],
  s0506: [
    'In the Changes, Zhen lies in the east; it stands for spring and for wood.',
    'In the Book of Changes, the trigram Zhen is placed in the east—it signifies spring and wood.',
  ],
  s0507: [
    'Dui lies in the west; it stands for autumn and for metal.',
    'Dui belongs to the west—it signifies autumn and metal.',
  ],
  s0508: [
    'Li lies in the south; it stands for summer and for fire.',
    'Li belongs to the south—it signifies summer and fire.',
  ],
  s0509: [
    'Kan lies in the north; it stands for winter and for water.',
    'Kan belongs to the north—it signifies winter and water.',
  ],
  s0510: [
    'In spring and autumn day and night are evenly divided and cold and heat are balanced; therefore the qi of metal and wood readily transform each other; hence injury to bearing brings autumn gloom and constant rain, injury to speech brings spring sunshine and constant drought.',
    'Spring and autumn balance day and night and level cold with heat, so metal and wood readily trade influence—thus impaired bearing yields endless autumn rains, while impaired speech yields spring drought beneath a glaring sun.',
  ],
  s0511: [
    'As for winter and summer, day and night are opposed and cold and heat are utterly different; the qi of water and fire cannot stand together; hence injury to sight brings constant warmth and injury to hearing brings constant cold—their qi are thus.',
    'Winter and summer invert day and night and separate cold from heat so sharply that water and fire cannot mingle—so impaired sight trends warm and impaired hearing trends cold: that is how their phases behave.',
  ],
  s0512: [
    'If one opposes it, its culmination is called “evil.”',
    'Defy the pattern, and the extreme is named evil.',
  ],
  s0513: [
    'If one follows it, its blessing is called “that fondness for virtue.”',
    'Follow it, and the blessing is “delight in virtue.”',
  ],
  s0514: [
    'Liu Xin’s “Treatise on Bearing” says there are calamities of scale-covered creatures, sheep disasters, and ailments of the nose.',
    'Liu Xin’s Treatise on Bearing lists prodigies among scaly creatures, sheep omens, and nasal deformities.',
  ],
  s0515: [
    'The explanation holds that in astrology the eastern chen is the Dragon Star; hence they count as scale-covered creatures.',
    'The gloss identifies the eastern asterism chen as the Dragon Star—hence “scaly creatures.”',
  ],
  s0516: [
    'In the Changes, Dui represents sheep; wood is overcome by metal; hence it brings sheep disasters, responding together with constant rain.',
    'In the Changes Dui signifies sheep; wood falls ill to metal—hence sheep calamities that align with ceaseless rain.',
  ],
  s0517: [
    'This explanation is not correct.',
    'That reading is wrong.',
  ],
  s0518: [
    'In spring and autumn yin and yang are evenly matched; wood is sick and metal prevails; hence they can interact—only in this one case.',
    'Only in spring and autumn do yin and yang contend as equals, with enfeebled wood under dominant metal, so the phases can combine—nowhere else.',
  ],
  s0519: [
    'Disasters belong with prodigies, ailments, auspices, and calamities of the same kind; they cannot be treated as uniquely different.',
    'Calamities sit on the same spectrum as prodigies, lesions, omens, and blights—you cannot set them apart.',
  ],
  s0520: [
    'Among Wei, Minister Deng Yang’s gait was reckless and unbridled, sinews failing to bind his frame; sitting or rising he leaned and tilted as if he had no hands or feet—this was irreverence of bearing.',
    'Deng Yang of Wei, a Secretariat director, walked with a loose, racing stride—his sinews seemed not to hold his body; he slumped when he sat or rose as though limbless: irreverence of demeanor.',
  ],
  s0521: [
    'Guan Lu called it “ghost agitation.”',
    'Guan Lu dubbed it “demon restlessness.”',
  ],
  s0522: [
    '“Ghost agitation” is a portent of a violent end; later he was executed.',
    '“Ghost restlessness” foretells a bloody finish—he was put to death in the end.',
  ],
  s0523: [
    'In Emperor Hui’s Yuan-kang era, noble youths together held drinking parties with hair loosened and bodies bare, sporting with concubine-maids before one another; whoever opposed them injured friendships, whoever criticized them bore ridicule, and men seeking fame were ashamed not to join.',
    'Under Emperor Hui in the Yuan-kang years, young aristocrats threw banquets with hair unbound and skins naked, fondling servant girls in plain sight; crossing them cost goodwill, criticizing them earned jeers, and career-minded men were ashamed to stay away.',
  ],
  s0524: [
    'This was irreverence of bearing—the first sprouting of northern tribes invading the Central Plains.',
    'It was bearing without dignity—the first stirrings of steppe peoples overrunning China.',
  ],
  s0525: [
    'Afterward there came the turmoil of the Five Hu—this again lay in the fault called frenzy.',
    'The Five Hu upheaval followed—another case of the “madness” failing.',
  ],
  s0526: [
    'In Yuan-kang, Jia Mi was honored as kin, entered the two inner palaces repeatedly, and played games with the heir apparent, showing no mind of submission.',
    'During Yuan-kang, Jia Mi enjoyed imperial favor: he kept slipping into the two palaces to amuse the crown prince and never lowered himself in deference.',
  ],
  s0527: [
    'Moreover he once quarreled over a weiqi move; the Prince of Chengdu, Sima Ying, said sternly: “The imperial heir is the nation’s successor—how dare Jia Mi be rude!',
    'Once, disputing a chess placement, Sima Ying, Prince of Chengdu, snapped: “The crown prince is the realm’s reserve—how dare Jia Mi lack respect!',
  ],
  s0528: [
    '” Jia Mi still did not reform, hence he met disaster—the punishment for irreverence of bearing.',
    '” Yet Jia Mi refused to mend his ways and paid with his life—the reckoning for disrespectful bearing.',
  ],
  s0529: [
    'Prince Qi, Sima Jiong, having executed Prince Zhao, Sima Lun, remained to assist governance: seated he invested the hundred officials, issued edicts from terrace offices, drowned in wine and sole arrogance, and never once attended court—this was the fault of mad presumption and want of solemnity.',
    'After killing Prince Zhao Sima Lun, Prince Qi Sima Jiong stayed as regent: he handed out posts from his seat, ran the ministries by decree, reveled in wine and pride, and skipped every audience—mad impudence with no dignity.',
  ],
  s0530: [
    'None under Heaven failed to honor his merit yet dread his ruin; Jiong to the end did not reform, and so met extinction.',
    'The realm praised his deed yet feared his fall; Jiong never changed—and was wiped out.',
  ],
  s0531: [
    'Sima Daozi set out market stalls in his manor garden, had concubines sell ale, and traded in person.',
    'Sima Daozi lined his estate with shops, put concubines behind the counter, and haggled himself.',
  ],
  s0532: [
    'Gan Bao took it as the image of the noble losing position and descending among dark-clad servants.',
    'Gan Bao read it as rank pulled down among common hirelings.',
  ],
  s0533: [
    'Soon Daozi was deposed and ended as a commoner—this responded to irreverence of bearing.',
    'Daozi was soon stripped of office and died a commoner—the sign answering irreverent bearing.',
  ],
  s0534: [
    'Emperor An, about to invest Liu Yi’s son as heir, Liu Yi—because the royal command was weighty—ought to have laid a feast and personally invited clerks to oversee it.',
    'When Emperor An was to ennoble Liu Yi’s heir, Liu Yi—because the imperial commission mattered—should have spread a banquet and brought his staff to witness it.',
  ],
  s0535: [
    'On the day of investiture, his household colleagues did not report upward again; they silently performed the rite in the stable.',
    'Come the ceremony, his officers never cleared it upstairs; they muttered the investiture inside the stables.',
  ],
  s0536: [
    'When the king’s envoy was about to return his report, Liu Yi only then learned of it, greatly resented it, and dismissed Director of Gentlemen of the Palace Liu Jingshu.',
    'The imperial messenger was nearly on the road back before Liu Yi heard—he was furious and cashiered Liu Jingshu, director of the gentlemen-of-the-palace.',
  ],
  s0537: [
    'Heaven’s warning seemed to say: this was the prodigy of lazily slighting a splendid rite and lacking solemnity.',
    'Heaven warned: skimping on a sacred ceremony without gravity yields this portent.',
  ],
  s0538: [
    'Afterward Liu Yi was then killed.',
    'Liu Yi was executed soon after.',
  ],
  s0539: [
    'Among the miscellaneous signs, constant rain—Liu Xin took it as “great rain” in the Spring and Autumn; Liu Xiang as “great flood.”',
    'Under “miscellaneous omens,” endless rain: Liu Xin reads the Spring and Autumn’s “great rains”; Liu Xiang reads catastrophic flood.',
  ],
  s0540: [
    'In Wei Mingdi’s autumn it rained heavily many times; many died suddenly; thunder and lightning were extraordinary, even killing birds.',
    'One autumn under Wei’s Mingdi the skies opened repeatedly; people dropped dead; lightning flashed unnaturally, killing even small birds.',
  ],
  s0541: [
    'According to Yang Fu’s memorial, this was the punishment of constant rain.',
    'Yang Fu’s memorial treats it as the scourge of ceaseless rain.',
  ],
  s0542: [
    'At the time the Son of Heaven in mourning was not mournful, went out and in hunting without limit, luxury flourished in profusion, and farming seasons were seized; hence water lost its nature and constant rain served as punishment.',
    'The emperor wore mourning without grief, hunted without restraint, lavished wealth, and stole time from the fields—water lost its proper character, and unending rain was the penalty.',
  ],
  s0543: [
    'In the eighth month, great rain fell more than thirty days; the Yi, Luo, Yellow River, and Han all overflowed; the year saw famine.',
    'For over thirty days in the eighth month torrents fell; the Yi, Luo, Yellow River, and Han burst their banks; the harvest failed and hunger spread.',
  ],
  s0544: [
    'Wu’s Sun Liang, second month, day jiayin: great rain, thunder and lightning.',
    'On jiayin of the second month under Wu’s Sun Liang came deluges and lightning.',
  ],
  s0545: [
    'Yimao: snow, great cold.',
    'The next day, yimao: snow and bitter cold.',
  ],
  s0546: [
    'According to Liu Xin’s doctrine, at this season it ought to rain but not heavily; heavy rain is the punishment of constant rain.',
    'Liu Xin argues it should have sprinkled then—a deluge instead marks the “constant rain” scourge.',
  ],
  s0547: [
    'At first thunder and lightning; the next day snow, great cold—again the punishment of constant cold.',
    'Lightning first, then snow and killing frost the day after—another stroke of “constant cold.”',
  ],
  s0548: [
    'Liu Xiang held that once there had been thunder and lightning, snow ought not to fall again—all were anomalies of mistimed seasons.',
    'Liu Xiang thought lightning should rule out more snow—each event arrived out of season.',
  ],
  s0549: [
    'Heaven’s warning seemed to say: the ruler loses the seasons; traitorous ministers will arise.',
    'Heaven warned: mistiming sovereignty breeds rebellious ministers.',
  ],
  s0550: [
    'Thunder and lightning first and snow afterward means yin saw an opening, rose, and overcame yang—the disaster of usurpation and regicide will take shape.',
    'Lightning then snow means yin spied a gap, surged, and mastered yang—the blade and coup draw near.',
  ],
  s0551: [
    'Liang did not understand; soon he was deposed.',
    'Sun Liang never saw it—soon he was cast down.',
  ],
  s0552: [
    'This matches Duke Yin of Lu in the Spring and Autumn.',
    'It parallels the Spring and Autumn record for Duke Yin of Lu.',
  ],
  s0553: [
    'Emperor Wu, sixth month: great soaking rain.',
    'In Emperor Wu’s sixth month the rains would not stop.',
  ],
  s0554: [
    'Jiachen: the Yellow River, Luo, Yi, and Qin streams overflowed together, swept four thousand nine hundred-odd households, killed two hundred-odd people, and submerged autumn crops over thirteen hundred sixty qing.',
    'On jiachen the Yellow River, Luo, Yi, and Qin floods crested as one, washing away nearly five thousand homes, killing over two hundred, and drowning more than 1,360 qing of autumn grain.',
  ],
  s0555: [
    'Seventh month: Ren-cheng and Liang-nation violent rain, harming beans and wheat.',
    'In the seventh month Ren-cheng and Liang were hit by cloudbursts that ruined beans and wheat.',
  ],
  s0556: [
    'Ninth month: Nan-an commandery unending rain and violent snow; trees snapped; autumn crops were harmed.',
    'Nan-an commandery endured weeks of rain and blizzard that shattered trees and spoiled the autumn harvest.',
  ],
  s0557: [
    'That autumn, nine counties of Wei commandery and Xi-ping commandery, Huai-nan, and Ping-yuan saw soaking rain and sudden floods; frost injured autumn crops.',
    'That fall, nine counties across Wei and Xi-ping along with Huai-nan and Ping-yuan were flooded; late frost ruined the crops.',
  ],
  s0558: [
    'Emperor Hui, tenth month: Yi-yang, Nan-yang, and Dong-hai soaking rain, inundating and harming autumn wheat.',
    'In Emperor Hui’s tenth month relentless rain swamped Yi-yang, Nan-yang, and Dong-hai and drowned the winter wheat.',
  ],
  s0559: [
    'Emperor Yuan: spring rain lasting into summer.',
    'Under Emperor Yuan spring rains dragged into summer.',
  ],
  s0560: [
    'At this time Wang Dun held power—the punishment of irreverence.',
    'Wang Dun held the reins then—the penalty for irreverent bearing.',
  ],
  s0561: [
    ', Spring rain lasted more than forty days; day and night thunder and lightning shook for more than fifty days.',
    'For over forty days spring rains fell; thunder rolled night and day for more than fifty.',
  ],
  s0562: [
    'At this time Wang Dun raised troops—this responded to the defeat of the royal army.',
    'Wang Dun was marching then—the omen of the imperial army’s rout.',
  ],
  s0563: [
    'Emperor Cheng: spring rain more than fifty days, constant thunder and lightning.',
    'Emperor Cheng’s reign brought fifty-odd days of spring rain and ceaseless thunder.',
  ],
  s0564: [
    'At this time although Su Jun had been beheaded, his remaining partisans still held Stone Citadel; only after they were extinguished did the excessive rain clear.',
    'Su Jun was dead but his followers still held Stone City; only when they were wiped out did the endless rain break.',
  ],
  s0565: [
    'Eighth month, yichou: You county (Chang-sha), Li-ling, and Long-yang (Wu-ling)—three counties’ rainwater floated houses, killed people, and harmed autumn crops.',
    'On yichou in the eighth month, downpours in You (Chang-sha), Li-ling, and Long-yang (Wu-ling) swept away homes, took lives, and ruined the autumn harvest.',
  ],
  s0566: [
    'At this time the emperor was young; power lay below.',
    'The sovereign was a child; real power sat beneath the throne.',
  ],
  s0567: [EQ, EQi],
  s0568: [
    'Clothing prodigies.',
    'Garment omens.',
  ],
  s0569: [
    'Emperor Wu of Wei, because all under Heaven suffered famine and goods were scarce, first imitated the ancient leather cap, cutting silk tabby to make a white qia in place of the former dress.',
    'Emperor Wu of Wei, with the realm starving and supplies exhausted, copied the old leather bonnet and tailored plain silk into a white qia to replace court headgear.',
  ],
  s0570: [
    'Fu Xuan said;',
    'Fu Xuan observed:',
  ],
  s0571: [
    '“White is military dress, not court dress.',
    '“White belongs on campaign, not in state ritual.',
  ],
  s0572: [
    '” Gan Bao held that “plain white silk is the image of death and mourning.”',
    '” Gan Bao read it as “bleached cloth signals bereavement.”',
  ],
  s0573: [
    'Naming it qia is language of insult and ruin; after the change of mandate it was the prodigy of robbery and slaughter.',
    'Calling it a qia was mockery—a portent of usurpation and bloodshed after the throne changed hands.',
  ],
  s0574: [
    'Wei Mingdi wore an embroidered cap and draped a half-sleeve of sky-blue tabby; he often wore it to audience the upright minister Yang Fu, who remonstrated: “What ritual norm of dress is this!',
    'Mingdi of Wei sported an embroidered hat and a sky-blue half-sleeve; he wore them to see the upright Yang Fu, who protested: “What canonical garment is this!',
  ],
  s0575: [
    '” The emperor was silent.',
    '” The emperor had no reply.',
  ],
  s0576: [
    'This bordered on clothing prodigy.',
    'It skirted a garment omen.',
  ],
  s0577: [
    'Now sky-blue is not a color sanctioned by ritual.',
    'Sky-blue is not a ritual hue.',
  ],
  s0578: [
    'Even intimate garments do not use red and purple—how much more when receiving ministers below?',
    'Undress eschews forbidden reds and purples—how dare court robes flout them before ministers?',
  ],
  s0579: [
    'The ruler personally assumes unlawful insignia—what is called self-made calamity cannot be expiated.',
    'When the sovereign dons unlawful regalia, he courts a doom no rite can lift.',
  ],
  s0580: [
    'The emperor did not enjoy long years; his person gone and stipends departed from the royal house, posterity did not reach its term, and so all under Heaven was lost.',
    'He gained no long reign; dead, his line lost the mandate—his heirs did not endure, and the realm slipped away.',
  ],
  s0581: [
    ', They melted copper to cast two giants, called them Wengzhong, and placed them outside the Sima Gate.',
    'Bronze was recast into two colossal statues dubbed Wengzhong and set outside the Sima Gate.',
  ],
  s0582: [
    'According to antiquity, when tall men appear, it is for the state’s perishing.',
    'Ancient precedent says giants foretell a kingdom’s end.',
  ],
  s0583: [
    'The Long Di appeared at Lintao—disaster for Qin’s perishing.',
    'The Long Di at Lintao spelled Qin’s doom.',
  ],
  s0584: [
    'The First Emperor did not understand; instead he took it as auspicious omen and cast bronze men to image them.',
    'The First Emperor misread the sign as blessing and cast bronze giants in their likeness.',
  ],
  s0585: [
    'Wei copied the device of a perishing state, and in rectitude it ultimately took nothing.',
    'Wei copied a dying dynasty’s stunt—to no moral purpose.',
  ],
  s0586: [
    'This was clothing prodigy.',
    'Another garment omen.',
  ],
  s0587: [
    'Minister He Yan liked to wear women’s dress; Fu Xuan said: “This is prodigy dress.',
    'Director He Yan favored women’s clothing; Fu Xuan said: “This is omen dress.',
  ],
  s0588: [
    'The system of upper and lower garments is how one fixes superiors and inferiors and distinguishes inner from outer.',
    'Robes exist to set high against low and inside against outside.',
  ],
  s0589: [
    'The Greater Odes says, “Dark robe and red shoes, hooked breastplate and carved bells”—it sings its pattern.',
    'The Greater Odes exclaims “black robe, red slippers, hooked breast-straps, chased bells”—praising its ornament.',
  ],
  s0590: [
    'The Lesser Odes says, “Awesome and aiding, together in martial dress”—it chants its martial quality.',
    'The Lesser Odes cries “solemn, supportive—those martial robes together”—honoring their strength.',
  ],
  s0591: [
    'If inner and outer are not distinguished, royal regulation loses order; once clothing prodigy arises, the person follows it in death.',
    'Blur inner with outer and royal order collapses; garment omens appear—and the wearer perishes.',
  ],
  s0592: [
    'Mo Xi capped herself with a man’s cap—Jie lost all under Heaven;',
    'Mo Xi wore a man’s crown—Jie lost the realm;',
  ],
  s0593: [
    'He Yan wore women’s dress—also lost his family; the fault is equal.”',
    'He Yan dressed as a woman—and lost his house; the guilt matches.”',
  ],
  s0594: [
    'Among Wu women who adorned their faces, they tightly bound their hair and shaved the temples past the ears—this speaks of their custom binding itself too tight and of corners losing the mean.',
    'Wu women who styled their looks wrenched their hair tight and cropped temples past the ears—vanity pulled so taut that proportion broke.',
  ],
  s0595: [
    'Hence Wu’s customs drove one another with haste; speech shot accusations; harshness was esteemed.',
    'Hence Wu’s manners chased urgency: words flew like bolts, and cruelty passed for cleverness.',
  ],
  s0596: [
    'Those observing three-year mourning often brought destruction unto death.',
    'Mourners for parents often wasted away unto death.',
  ],
  s0597: [
    'Zhuge Ke worried over it and composed “Treatise on Correct Associations”; though it cannot with canonical teaching rectify chaos, it is also a work to rescue the times.',
    'Zhuge Ke fretted and wrote On Proper Associations—not scripture enough to cure chaos, but a tract for its age.',
  ],
  s0598: [
    'After Sun Xiu, the cut of garments was long above and short below; moreover collars stacked five or six layers while skirts counted only one or two.',
    'After Sun Xiu, fashion ran long on top and short below—five or six layered collars against one or two skirt panels.',
  ],
  s0599: [
    'Gan Bao said: “Above indulges luxury while below is squeezed by austerity—the prodigy of surplus above and shortage below.',
    'Gan Bao said: “Extravagance reigns aloft while austerity pinches below—a portent of plenty upstairs and want downstairs.',
  ],
  s0600: [
    '” Down to Sun Hao, extravagance and cruelty indeed ran riot above while the hundred surnames were hollowed out below; the state finally perished—this was its response.',
    '” Under Sun Hao, indulgence and brutality flourished above while commoners were bled dry below; the realm fell—that was the fulfillment.',
  ],
  s0601: [
    'Early in Emperor Wu’s Taishi reign, garments were austere above and ample below; wearers all trailed hems—this is the image of the lord weak, ministers unrestrained, and the base overshadowing the top.',
    'Early in Emperor Wu’s Taishi era, coats grew tight above and billowing below—every sleeve pooled on the floor: the sovereign enfeebled, his ministers unchecked, the base veiling the crown.',
  ],
};

for (const s of cur.sentences) {
  if (B6[s.id]) {
    s.literal = B6[s.id][0];
    s.idiomatic = B6[s.id][1];
  }
}

fs.writeFileSync('translations/current_translation_jinshu.json', JSON.stringify(cur, null, 2));
console.log('OK');
