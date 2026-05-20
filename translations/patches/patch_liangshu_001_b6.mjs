#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'So it is said: talent is born of the age, and success or failure depends on the times alone;',
    'As the saying goes, talent rises with the age, and fortune turns on timing alone;',
  ],
  s0502: [
    'yet the elegant spirit has passed away, rushing pursuit has become custom, slander and boasting flourish, and profit is measured to the knife\'s edge—so that at officials\' gates shoulders rub and wheels collide.',
    'Yet refinement has faded, ambition has hardened into habit, flattery and self-display rule the day, and every gain is counted to the last coin—until the doors of office swarm shoulder to shoulder and wheel to wheel.',
  ],
  s0503: [
    'Not only do they go bareheaded and uncapped, unafraid of heat and cold; they even tie up their shoes and take up staffs, coming even through wind and rain.',
    'Men no longer merely brave sun and frost with uncovered heads; they strap on their sandals, take up their staves, and come through storm and tempest.',
  ],
  s0504: [
    'Truly because village recommendation and district selection no longer follow ancient ways—flesh is weighed to judge the bone, and men are left to granary posts.',
    'The cause lies in local recommendation and district selection turned from ancient practice: appearance is weighed like meat on a scale, and worthy men are shelved in storehouse clerkships.',
  ],
  s0505: [
    'Added to this, the grace of imperial summons after the Mount Liang examination is lacking;',
    'On top of this, the old favor of imperial summons after the frontier examination has vanished;',
  ],
  s0506: [
    'the Jin, Zhang, Xu, and Shi clans forget the decline of their ancestral calling.',
    'and clans once as proud as Jin, Zhang, Xu, and Shi forget how far their old estates have fallen.',
  ],
  s0507: [
    'Alas—how sad!',
    'Alas, how lamentable!',
  ],
  s0508: [
    'Moreover, genealogical registers are riddled with error and fraud has many threads; no one attends to whether a man is refined or coarse.',
    'Genealogies are corrupt, imposture ramifies in every direction, and no one cares whether a man is cultivated or crude.',
  ],
  s0509: [
    'Thus those who falsely claim good families at once become crowned clans;',
    'So a man who steals a respectable lineage becomes a great clan overnight;',
  ],
  s0510: [
    'those who vainly dress up their appearance at once become elegant scholars;',
    'one who merely trims his outward show passes for a man of taste;',
  ],
  s0511: [
    'those deeply burdened by vulgar repute are suddenly favored and promoted;',
    'men long stained by ill repute are suddenly raised and favored;',
  ],
  s0512: [
    'when the tomb trees already arch, then they receive glory and honor.',
    'and honor arrives only after the trees above their graves have grown tall.',
  ],
  s0513: [
    'Therefore in former ages, when selecting officials, they all established selection registers; those who should stand in the string of fish had their own order of evaluation.',
    'In earlier times every office of selection kept its own register, and men due for advancement stood in a fixed order, like fish strung on a line.',
  ],
  s0514: [
    'Pedigree rose and fell, conduct and ability were praised or condemned—sometimes settled by long-held judgment, sometimes obtained from wider discussion; thus they could briefly receive guests without needing to sweep the gate.',
    'Family standing, talent, and moral worth were already known—by long acquaintance or public report—so a man could receive visitors without waiting at his gate for petitioners.',
  ],
  s0515: [
    'In recent generations decline has set in; the nine currents have gone awry.',
    'In recent generations standards have collapsed, and every path of worth has lost its way.',
  ],
  s0516: [
    'Those who bravely withdraw and forget advancement, who embrace quality and hold to truth—the Selection Bureau sometimes, because they have not yet had audience at court, finds it hard to appoint them.',
    'Men who shun ambition and keep their integrity are often passed over because they have never yet presented themselves at court.',
  ],
  s0517: [
    'Some who hide their goodness and conceal their voice, burying themselves in humble thatch—because their names are not known, their ladder of advancement is cut off.',
    'Others bury their gifts in obscurity and live in humble seclusion, only to find the rungs of office closed to them because no one knows their names.',
  ],
  s0518: [
    'They must write visiting cards and submit petitions, then only dust off the hat—this drives and compels modest restraint, rewarding shallow competition.',
    'Only after writing cards and filing petitions may they dust off the official cap—thus integrity is driven out and shameless rivalry is rewarded.',
  ],
  s0519: [
    'I foolishly think that from now on the Selection Bureau should carefully scrutinize and select, establish registers as before, so cap and sandal do not err and name and reality do not diverge; then common people will know the bank, and forced visits will cease of themselves.',
    'I submit that hereafter the Bureau of Selection should examine candidates with rigor, restore the old registers, and keep rank and conduct, name and fact, in accord—so that men know their bounds and the plague of importunate petitioning dies away.',
  ],
  s0520: [
    'Moreover I hear that in between rules were established: noble clans enter office at twenty, while back doors after thirty become probationary clerks—seeking this in my foolish thought, I fear there is what is not understood.',
    'I also hear that new rules were set: great families may take office at twenty, while lesser men must wait until after thirty to serve as clerks—and in my humble judgment this too misses the mark.',
  ],
  s0521: [
    'Why?',
    'Why so?',
  ],
  s0522: [
    'Establishing offices and dividing duties—only talent is the aim.',
    'Offices exist and duties are divided for one purpose: to employ the able.',
  ],
  s0523: [
    'If the Eight Worthies at their appointed age were stationed among black-robed clerks and were suppressed;',
    'If the Eight Worthies, come of age, were kept among menials and passed over;',
  ],
  s0524: [
    'the Four Evils at weak cap could sit in great clans and should be selected.',
    'while the Four Evils, barely grown, sat in great houses and were deemed fit for office—',
  ],
  s0525: [
    'then hereditary salary families would have no intent to do good;',
    'then hereditary houses would see no reason to cultivate virtue;',
  ],
  s0526: [
    'common cloth scholars would give free rein to evil.',
    'and men of humble birth would feel free to do as they pleased.',
  ],
  s0527: [
    'How is this the way to broadly encourage elegant spirit and hope for later generations?',
    'How could this encourage excellence or give the young anything worth striving toward?',
  ],
  s0528: [
    'This is truly a great pest; especially it should be cut and reformed.',
    'This is a grievous corruption and should be abolished at once.',
  ],
  s0529: [
    'Otherwise, it will make Zhou people weep by the roadside and Jin ministers sigh at fishing and hunting.',
    'Otherwise we shall again see the roadside weeping of Zhou and the hunting-sighs of Jin ministers who neglect the realm.',
  ],
  s0530: [
    'Moreover custom favors shallow rivalry; people lack retiring sentiment; if age limits entry to court, ages for office must increase—thus appearance is truly a child but the register already passes thirty; defiling name and teaching, in this it is worst.',
    'The age loves display and hates restraint; if office is tied to a fixed age, men will delay entry and grow old in waiting—so that a man looks like a boy while his record says he is past thirty. Nothing defiles the teaching of the sages more than this.',
  ],
  s0531: [
    'Your servant oversees inner and outer affairs; worry and responsibility are mine; gains and losses of court government—righteousness cannot permit concealment.',
    'I oversee affairs within and without the palace, and the burden of care is mine; on the right and wrong of government I cannot keep silent.',
  ],
  s0532: [
    'Humbly I wish Your Majesty to let fall sacred and fine bearing, descend to the end of listening—then constant norms will harmonize themselves, and statutes will be just.',
    'I humbly pray that Your Majesty will lend your sacred ear to these words at last, so that human order may right itself and law may stand true.',
  ],
  s0533: [
    'An edict ordered that Gaozu\'s memorial be implemented.',
    'An edict approved Gaozu\'s memorial and ordered it carried out.',
  ],
  s0534: [
    'On day bingxu, an edict said:',
    'On bingxu day, an edict read:',
  ],
  s0535: [
    'Song Mountain alone is the peak; pairing with Heaven is why its fame flows abroad;',
    'Song Mountain stands supreme among peaks, and its name endures because it shares Heaven\'s majesty;',
  ],
  s0536: [
    'great founding at Nanyang—overbearing virtue is why its glory spreads.',
    'Nanyang saw a great founding, and hegemonic virtue is why its light still shines.',
  ],
  s0537: [
    'Loyalty and sincerity choosing the emperor—Lord Fan received the honor of highest rank;',
    'Lord Fan, loyal and discerning, won the highest noble rank;',
  ],
  s0538: [
    'diligent labor for the royal house—Duke Ji increased attached fief lands.',
    'Duke Ji, toiling for the royal house, was granted broader domains.',
  ],
  s0539: [
    'Former kings\' fine statutes, spread in writings on bamboo—long reign and the prosperity of the people, none not from this.',
    'The worthy precedents of former kings, set down in the records, have ever been the source of long rule and the people\'s peace.',
  ],
  s0540: [
    'The Chancellor of State, Duke of Liang, embodies this supreme wisdom, equal in holiness and broad in depth.',
    'The Chancellor of State, Duke of Liang, embodies this highest wisdom—holy in stature and vast in understanding.',
  ],
  s0541: [
    'Civil teaching harmonized within, martial achievement flourishing without.',
    'Within, culture has taken root; without, martial glory has spread.',
  ],
  s0542: [
    'Pushing the wheel and serving as frontier lord—then awe and gentle rule spread to foreign customs;',
    'As frontier lord he drove the chariot of state, and his awe and kindness reached distant peoples;',
  ],
  s0543: [
    'training soldiers and teaching war—then thunder and lightning blaze ten thousand li.',
    'training armies and teaching war—until thunder rolled across ten thousand li.',
  ],
  s0544: [
    'The Way was lost in dark times; slander and evil greatly flourished.',
    'The age had lost the Way; slander and wickedness ran wild.',
  ],
  s0545: [
    'Was it merely that the altars hung by a thread and the sacred vessel had no master!',
    'And was the ruin only that the altars hung by a thread and the throne stood empty?',
  ],
  s0546: [
    'As for the hundred million slaughtered, caps and robes extinguished, remnant kinds gasping, life hanging by a morning—all living things trembled, nowhere to set foot—so mountains and rivers overturned and grass and trees painted the ground.',
    'Countless people were slain, scholars and officials wiped out, survivors gasping out their lives from dawn to dusk; every living thing trembled with nowhere to stand, until mountains and rivers were overturned and the earth was covered with the dead.',
  ],
  s0547: [
    'Compared with the time when benevolence covered the marching rushes, when faith reached pigs and fish—how vast the distance between them!',
    'What a gulf lies between that age and the days when benevolence fell even on roadside weeds and trust reached beasts in the pen!',
  ],
  s0548: [
    'The Duke ordered armies and mustered troops, pointing to the sun and racing far.',
    'The Duke raised armies and mustered his hosts, driving forward as though chasing the sun itself.',
  ],
  s0549: [
    'Yet our dynasty was critically imperiled; Fan and Deng were distant; violent bands entrenched, land and water facing each other—from Gushu, pinned at Xiashou—strong cities and fierce troops, relying on rivers for defense.',
    'Yet the dynasty stood on the brink; Fan and Deng were far away; rebels held entrenched positions across land and water, from Gushu to Xiashou, with strong walls, fierce soldiers, and rivers for their ramparts.',
  ],
  s0550: [
    'The Duke floated along the Han and sailed the river—lightning shock, wind sweep; boatmen drowned, terrain fell like clouds; with these righteous warriors, no strong formation stood before him; saving the perilous capital, clearing our imperial domain; beating fire already burning on the plain, sparing those about to be executed house to house.',
    'The Duke swept down the Han and sailed the Yangtze like lightning and wind; boats capsized, defenses crumbled like clouds in storm; led by loyal courage he broke every line, rescued the capital in its peril, cleansed the imperial domain, stamped out fires already running across the fields, and spared household after household from the executioner.',
  ],
  s0551: [
    'Far and wide the hundred million—fate was not in Heaven;',
    'For countless people, life no longer hung on Heaven alone;',
  ],
  s0552: [
    'vastly the six directions all received his gift.',
    'throughout the six directions all shared in his deliverance.',
  ],
  s0553: [
    'Correcting custom and righting the root, people did not lose their posts.',
    'He set custom aright and restored the foundations, so that men did not lose their proper place.',
  ],
  s0554: [
    'Benevolence and faith together practiced, rites and music together fluent.',
    'Benevolence and trust went hand in hand, and rites and music flourished together.',
  ],
  s0555: [
    'Yi Yin and the Duke of Zhou are not enough to share the track; Duke Huan and Duke Wen far have shame in virtue.',
    'Even Yi Yin and the Duke of Zhou cannot stand beside him; Duke Huan and Duke Wen would blush at the comparison.',
  ],
  s0556: [
    'Yet ennobling him as later frontier lord, with lands ending at Qin and Chu—this is not the way to repay glorious deeds and fully answer primal merit.',
    'Yet to reward him only as a frontier prince, with lands bounded by Qin and Chu, is no fit repayment for such blazing merit and founding achievement.',
  ],
  s0557: [
    'Truly because the Duke takes humility as root, shown even in haste, fine rewards not yet declared, new moon and old moon add longing.',
    'This is because the Duke, rooted in humility, has again and again refused what is due—so that month after month the realm waits in longing.',
  ],
  s0558: [
    'It is fitting to exalt this ritual rank, fully matching the hope of far and near.',
    'It is right to raise him to this higher station and satisfy the hopes of all, near and far.',
  ],
  s0559: [
    'He may advance the Duke of Liang to King.',
    'The Duke of Liang shall be advanced to King.',
  ],
  s0560: [
    'With the ten commanderies of Southern Qiao and Lujiang of Yuzhou, Xunyang of Jiangzhou, Wuchang and Xiyang of Yingzhou, Southern Langye, Southern Donghai, and Jinling of South Xuzhou, and Linhai and Yongjia of Yangzhou—increase the State of Liang, together with the former domains making twenty commanderies.',
    'Let the ten commanderies of Southern Qiao and Lujiang in Yuzhou, Xunyang in Jiangzhou, Wuchang and Xiyang in Yingzhou, Southern Langye, Southern Donghai, and Jinling in South Xuzhou, and Linhai and Yongjia in Yangzhou be added to the State of Liang, making twenty commanderies in all with those already held.',
  ],
  s0561: [
    'His posts as Chancellor of State, Governor of Yangzhou, and General of Cavalry on the Fast March remain as before.',
    'He shall retain his posts as Chancellor of State, Governor of Yangzhou, and General of Cavalry on the Fast March.',
  ],
  s0562: [
    'The Duke firmly declined.',
    'The Duke refused firmly.',
  ],
  s0563: [
    'An edict cut off his memorial.',
    'An edict rejected his refusal.',
  ],
  s0564: [
    'Left Chief Clerk of the Chancellery Wang Ying and others led the hundred officials in earnest urging.',
    'Wang Ying, Left Chief Clerk of the Chancellery, led the hundred officials in pressing him to accept.',
  ],
  s0565: [
    'Third month, xinmao: Yanling county Huayang district chief Dai Che submitted a report saying, "Twelfth month, yiyou: sweet dew fell on Maoshan, spreading several li.',
    'Third month, xinmao: Dai Che, chief of Huayang district in Yanling county, reported, "On yiyou in the twelfth month, sweet dew fell on Maoshan and spread for several li.',
  ],
  s0566: [
    'First month, jiyou: district general Pan Daogai obtained one hairy turtle in a mountain stone cave.',
    'First month, jiyou: district general Pan Daogai found a hairy turtle in a mountain cave.',
  ],
  s0567: [
    'Second month, xinyou: district general Xu Lingfu again saw one white deer on the eastern mountain.',
    'Second month, xinyou: district general Xu Lingfu also saw a white deer on the eastern slope.',
  ],
  s0568: [
    'On day bingyin at dawn, clouds and mist on the mountain joined on four sides; in a moment there was black-yellow color, shaped like a dragon more than ten zhang long, now hidden now visible; long after, it rose to heaven from the northwest.',
    'On bingyin at dawn, cloud and mist closed in on every side; then black and yellow light took the shape of a dragon more than ten zhang long, now vanishing, now appearing, until at last it ascended to heaven from the northwest.',
  ],
  s0569: [
    '" On day dingmao, Yanzhou Inspector Ma Yuanhe reported: "In Shouzhang county of Dongping commandery under his jurisdiction one Zouyu was seen."',
    '" On dingmao, Yanzhou Inspector Ma Yuanhe reported, "In Shouzhang county of Dongping, under his command, a Zouyu was seen."',
  ],
  s0570: [
    'On day guisi, he received the mandate of King of Liang.',
    'On guisi day, he accepted the mandate of King of Liang.',
  ],
  s0571: [
    'An order said: "I, in my emptiness and dimness, take charge of the nation\'s helm; though I toil early and rest late, my thought is on raising governance, yet nurturing virtue and stirring the people still seems far.',
    'He issued an order: "I, unworthy and obscure, hold the nation\'s helm; though I rise early and sleep late with governance always in mind, to nurture virtue and lift the people still seems far off.',
  ],
  s0572: [
    'The sacred court ever speaks of the old style, elevating this cherished mandate.',
    'The sacred court has honored the old forms and raised me to this cherished charge.',
  ],
  s0573: [
    'Marquis and count grand ceremony, sharing track with former glorious ones; fine gifts richly spread, ritual number clearly exalted.',
    'The rites due a marquis or count now match the great founders of old; honors have been heaped upon me and ceremonial rank made bright.',
  ],
  s0574: [
    'In vain I guard willing integrity, finally separated from mutual understanding.',
    'Yet I have held to modest refusal and remain far from true accord.',
  ],
  s0575: [
    'All the lords and hundred offices, again this earnest reward—putting forth thick face at this fine fortune.',
    'The lords and the hundred offices have pressed this reward upon me again, and I must bear the shame of accepting in such a fortunate hour.',
  ],
  s0576: [
    'Looking to Kun Wu and Peng Zu for long thought, admiring Duke Huan and Duke Wen and sighing, I think to spread the path of governance yet know not the ford.',
    'I think of Kun Wu and Peng Zu and feel how small I am; I look to Duke Huan and Duke Wen and sigh; I would broaden the way of rule, yet cannot see the crossing.',
  ],
  s0577: [
    'The realm\'s inner territories have just opened, frontier domains are just new—I think to spread fine celebration, covering the lower states.',
    'The inner realm has only just been restored and the frontiers made new; I would spread this blessing through all the lands below.',
  ],
  s0578: [
    'Within the state below death penalty—before dawn on the fifteenth of this month, all entirely pardoned.',
    'Throughout the realm, all crimes short of death are pardoned before dawn on the fifteenth of this month.',
  ],
  s0579: [
    'Widows, widowers, orphans, and the alone who cannot support themselves—given five hu of grain.',
    'Widows, widowers, orphans, and the destitute who cannot support themselves shall receive five hu of grain.',
  ],
  s0580: [
    'Prefectures and provinces under command—also same exemption and sweeping."',
    'The prefectures and provinces under my rule shall grant the same pardon and relief."',
  ],
  s0581: [
    'On day bingwu, he was ordered the king\'s cap of twelve tassels, established the Son of Heaven\'s banners, going out with police and entering with halts, riding the golden-root chariot, driving six horses, equipped with seasonal secondary chariots, setting battle-standard and cloud banner, music and dance in eight rows, establishing bell and chime palace ensemble.',
    'On bingwu day he was granted the twelve-tasseled royal cap, the banners of the Son of Heaven, imperial escort on departure and return, the golden-root chariot drawn by six horses, seasonal secondary chariots, the battle-standard and cloud banner, eight rows of dancers, and the full palace bell ensemble.',
  ],
  s0582: [
    'Queen consort, princes, and princesses—the titles of rank and command, all according to old ritual.',
    'Titles for the queen, princes, and princesses followed the old rites.',
  ],
  s0583: [
    'On day bingchen, the Qi emperor abdicated the throne to the King of Liang.',
    'On bingchen day, the Qi emperor abdicated in favor of the King of Liang.',
  ],
  s0584: [
    'An edict said:',
    'An edict read:',
  ],
  s0585: [
    'The five virtues alternate and renew; the three orthodoxies rise in succession; governing things requires the worthy, and ascending to office opens the sage—thus imperial traces change and flourish, royal measures change and shine, changing darkness to light, from of old this has been honored.',
    'The five virtues succeed one another, the three calendars take turn after turn; to govern the world one must employ the worthy, and to rise to office is to open the way for sages. Dynasties flourish as they change, royal law shines as it is renewed, and the turning of darkness into light has been honored since antiquity.',
  ],
  s0586: [
    'Qi\'s virtue sank in decline; danger and extinction came in succession.',
    'Qi\'s virtue collapsed, and ruin followed ruin.',
  ],
  s0587: [
    'Longchang\'s cruel tyranny truly violated Heaven and Earth;',
    'Emperor Longchang was savage and cruel, offending Heaven and Earth;',
  ],
  s0588: [
    'Yongyuan\'s disordered violence seized and confused human and divine.',
    'Emperor Yongyuan was violent and benighted, overturning the order of men and gods.',
  ],
  s0589: [
    'The three luminaries again sank; the seven temples hung like a thread.',
    'Sun, moon, and stars were darkened again; the seven ancestral temples hung by a thread.',
  ],
  s0590: [
    'The cauldron enterprise nearly shifted; all knowing consciousness nearly extinguished.',
    'The royal mandate nearly passed away, and all who had understanding were nearly destroyed.',
  ],
  s0591: [
    'Our Gao and Ming dynastic fortune, faintly about to fall.',
    'The fortune of our Gao and Ming line trembled on the edge of collapse.',
  ],
  s0592: [
    'Ever thinking of accumulated hardship, ice and valley fill the heart.',
    'Remembering these accumulated calamities, I feel perils as cold as ice and as deep as a ravine.',
  ],
  s0593: [
    'Chancellor of State King of Liang—Heaven bore keen wisdom, spirit unrestrained in divine martiality, virtue reaching dark deities, achievement equal to creating things.',
    'The Chancellor of State, King of Liang, was born with Heaven\'s keen wisdom and a spirit of divine martial power; his virtue moves the hidden powers, his achievement matches the work of creation.',
  ],
  s0594: [
    'He stopped the altars\' cross-flow and reversed the people\'s burnt coating.',
    'He halted the flood that threatened the altars and turned the people back from charred ruin.',
  ],
  s0595: [
    'Under leaning pillars and collapsing framework, he saved the drowning in the flowing river.',
    'Beneath tottering beams and falling rafters, he pulled the drowning from the rushing stream.',
  ],
  s0596: [
    'The nine regions re-gathered; the four bonds were re-threaded.',
    'The nine regions were knit together again; the four pillars of order were restored.',
  ],
  s0597: [
    'Broken rites returned to order; collapsed music was restored and spread.',
    'Rites that had broken were made whole again; music that had fallen silent sounded once more.',
  ],
  s0598: [
    'Literary halls full of girdled officials; martial posts ceased alarms.',
    'Literary halls filled again with robed scholars; frontier posts fell quiet of alarm.',
  ],
  s0599: [
    'Reaching sea and realm with running wind, exhausting wheel and robe in receiving the new moon.',
    'His influence ran like wind across land and sea; every cart and robe turned to acknowledge the new dawn.',
  ],
  s0600: [
    'Eight directions show auspice; five spirits show blessing.',
    'The eight directions brought forth omens; the five spirits offered their blessing.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_001_b6.mjs <translation.json>'
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
