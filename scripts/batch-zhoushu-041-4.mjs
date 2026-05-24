#!/usr/bin/env node
import fs from 'node:fs';

const T = [
  [
    's0301',
    'Having already left official administration and withdrawn far away, thereupon military counsel was leaked.',
    'They had abandoned government and withdrawn to a distance—and then their battle plans were betrayed.',
  ],
  [
    's0302',
    'They looked to the Commandant of Punishments for escaped prisoners, yet instead turned back the desperate bandits of Huainan.',
    'They hoped for fugitives from the Commandant of Punishments, but released Huainan\'s cornered rebels instead.',
  ],
  [
    's0303',
    'The azure birds of Di Spring flew up; the cornered beasts of Hengjiang rose.',
    'Like the blue birds that flew from Di Spring, like trapped beasts stirring along the Heng River.',
  ],
  [
    's0304',
    'On earth the stone drums sounded in the mountains; in heaven the golden essence moved the lodges.',
    'Earth: stone drums thundered in the hills; heaven: the golden star stirred the constellations.',
  ],
  [
    's0305',
    'At the Northern Gate dragons cried; at Eastern Mound the qilin fought.',
    'Dragons moaned at the northern palaces; qilin clashed at Eastern Mound.',
  ],
  [
    's0306',
    'Then the cruel and cunning fomented disorder, relying on force to overrun the capital district.',
    'Then the vicious and crafty stirred rebellion, overrunning the capital environs by force.',
  ],
  [
    's0307',
    'They held Langwang at the Yellow Chart and filled Mount Lu in the Red Counties.',
    'Rebels seized Langwang in the imperial realm and packed Mount Lu with troops across the empire.',
  ],
  [
    's0308',
    'Blue robes were like grass; white horses were like silk streamers.',
    'Blue-clad soldiers spread like grass; white horses stretched like bolts of silk.',
  ],
  [
    's0309',
    'The Son of Heaven at New Year\'s abandoned court; the Xiongnu chieftain prolonged the siege and feasted high.',
    'The emperor canceled New Year court; the barbarian lord prolonged the siege and held a grand banquet.',
  ],
  [
    's0310',
    'The twin watchtowers met halberds; a thousand gates received arrows.',
    'Halberds at the twin towers; a thousand palace gates struck by arrows.',
  ],
  [
    's0311',
    'A white rainbow pierced the sun; a dark hawk struck the palace.',
    'A white rainbow spanned the sun; a dark eagle attacked the hall.',
  ],
  [
    's0312',
    'All alike met the calamity of Xia Terrace and came to witness the change at Yao\'s city.',
    'They suffered imprisonment as at Xia Terrace and beheld the fall of Yao\'s city.',
  ],
  [
    's0313',
    'Officials on duty had none who ran to inquire; shield and axe were not battles to pacify the barbarians.',
    'No one rushed to report for duty; arms were not raised to repel the enemy.',
  ],
  [
    's0314',
    'Tao Kan merely loaded rice ships in vain; Gu Rong merely fanned an empty feather fan.',
    'Tao Kan loaded grain ships to no avail; Gu Rong waved his feather fan in vain.',
  ],
  [
    's0315',
    'Generals died holding the frontier cord; the road was cut off by layered sieges.',
    'Generals died defending to the last; every escape route was sealed by siege.',
  ],
  [
    's0316',
    'Beacon fires followed falling stars; letters pursued flying kites.',
    'Beacon fires fell with the stars; messages flew away on kites.',
  ],
  [
    's0317',
    'Thereupon Han was split and Zhao cracked; drums lay fallen and banners broke.',
    'Armies split like Han and Zhao; drums toppled and banners snapped.',
  ],
  [
    's0318',
    'They lost their herds like Ban\'s horses; wheels wandered and tracks tangled.',
    'Horses scattered like Ban\'s steeds; wheels strayed and ruts tangled.',
  ],
  [
    's0319',
    'Fierce warriors clung to the walls; strategists rolled up their tongues.',
    'Brave men held the walls; advisers fell silent.',
  ],
  [
    's0320',
    'At the battle of Kunyang elephants ran through forests; at the battle array of Changshan serpents fled into holes.',
    'Like Kunyang where elephants stampeded through the woods; like Changshan where serpents fled to their holes.',
  ],
  [
    's0321',
    'In five commanderies brothers grieved for each other; in three provinces fathers and sons were parted.',
    'Across five commanderies brothers mourned each other; in three provinces fathers and sons were torn apart.',
  ],
  [
    's0322',
    'The Protector of the Army was ardent; loyal unto death in righteousness.',
    'The army protector was spirited and died a loyal death.',
  ],
  [
    's0323',
    'Three generations as generals—ended in destruction here.',
    'Three generations of generals ended in ruin here.',
  ],
  [
    's0324',
    'The loyal stalwart of Jiyang personally joined the rear guard.',
    'The loyal champion of Jiyang served among the rearguard.',
  ],
  [
    's0325',
    'Three brothers together; righteous fame they all proclaimed.',
    'Three brothers together raised their voices in righteous defiance.',
  ],
  [
    's0326',
    'When the lord is shamed the minister dies; fame remains though life is lost.',
    'The lord humiliated, the ministers died—fame survived, bodies did not.',
  ],
  [
    's0327',
    'The Di returned with the general\'s head; the three armies grieved bitterly.',
    'When the Di returned his severed head the whole army wept.',
  ],
  [
    's0328',
    'The Master of Writings was skilled in calculation; defense was his strength.',
    'The Master of Writings plotted well and excelled at holding the defenses.',
  ],
  [
    's0329',
    'Cloud ladders could be repelled; tunneling could be blocked.',
    'They repelled siege towers and blocked underground assaults.',
  ],
  [
    's0330',
    'There were Qi generals who closed their walls; there were no Yan troops who leaned on the wall.',
    'They shut the walls like Qi generals—but none held them like Yan\'s men.',
  ],
  [
    's0331',
    'The great affair was lost; men said they perished.',
    '"The great cause is lost"—and with it, their lives.',
  ],
  [
    's0332',
    'Shenzi roused himself; courage roared like thunder.',
    'Shen Zi roused himself, courage thundering.',
  ],
  [
    's0333',
    'He truly commanded the chief army; his body went ahead of the soldiers.',
    'He commanded the main force and led from the front.',
  ],
  [
    's0334',
    'Helmets fell at Fish Gate; soldiers filled the horse mangers.',
    'Helmets littered Fish Gate; corpses choked the horse stalls.',
  ],
  [
    's0335',
    'Repeatedly struck in the vital center; frequently suffered scraped bone.',
    'Arrow after arrow found their mark; wound after wound peeled to the bone.',
  ],
  [
    's0336',
    'Meritorious achievement cut short and wronged; body and name buried in oblivion.',
    'Glory cut short before its time; name and body lost to obscurity.',
  ],
  [
    's0337',
    'Some bore falcon wings with finch robes; tiger might borrowed from foxes.',
    'Some wore falcon wings in finch feathers; tigers\' might that foxes borrowed.',
  ],
  [
    's0338',
    'Drenched in sword points; grease and fat fattened the wild fields.',
    'Soaked in blade and arrow; fat and marrow greased the wilderness.',
  ],
  [
    's0339',
    'Soldiers weak, bandits strong; city lonely, spirit scant.',
    'They were few, the enemy many; the city stood alone, morale spent.',
  ],
  [
    's0340',
    'Hearing crane cries they startled in vain fear; hearing nomad pipes tears fell.',
    'At the cry of cranes they panicked without cause; at nomad reeds they wept.',
  ],
  [
    's0341',
    'At Shenting they held the ground yet lost halberds; at Hengjiang they came to the shore yet abandoned horses.',
    'They held Shenting and left their halberds; reached Hengjiang and abandoned their horses.',
  ],
  [
    's0342',
    'Collapsed on the sands of Julu; shattered on the tiles of Changping.',
    'They crumbled like at Julu; shattered like at Changping.',
  ],
  [
    's0343',
    'Thereupon Guilin overturned; Changzhou became deer pasture.',
    'Guilin fell; Long Isle ran with deer.',
  ],
  [
    's0344',
    'Swelling, boiling, seething; boundless gloom and pitch black.',
    'Waters surged and boiled; darkness spread without end.',
  ],
  [
    's0345',
    'Heaven and earth divided and blocked; men and spirits grievously resentful.',
    'Heaven and earth were torn apart; men and gods groaned under bitter wrath.',
  ],
  [
    's0346',
    'Jin and Zheng had none to rely on; Lu and Wei were not at peace.',
    'Allies like Jin and Zheng had no one to trust; kin like Lu and Wei turned on each other.',
  ],
  [
    's0347',
    'All rushed to move heaven\'s gates; all strove to turn earth\'s axis.',
    'They shook the pivots of heaven and turned the axle of earth.',
  ],
  [
    's0348',
    'Plucking sparrowhawks yet not sated; waiting for bear paws—how could they be cooked?',
    'Snatching sparrowhawks before they were full; awaiting bear paws before they could stew.',
  ],
  [
    's0349',
    'Then there were bodies crushed beside the outer gate; sinews hung from temple rafters.',
    'Bodies piled at the outer gate; sinews hung from the temple eaves.',
  ],
  [
    's0350',
    'Ghosts shared the Cao She altar\'s plots; men had the Qin court\'s weeping.',
    'Spirits connived as at the Cao shrine; men wept as at the envoy\'s plea in Qin.',
  ],
  [
    's0351',
    'I then borrowed to forge seals at the passes, posing as an envoy in parley.',
    'I forged seals at the frontier passes and passed myself off as an envoy answering summons.',
  ],
  [
    's0352',
    'I met Eban\'s mockery and suspicion; I encountered Ran Gate\'s levy and toll.',
    'I met contempt at Eban Pass and tax at Ran Gate.',
  ],
  [
    's0353',
    'Riding a white horse yet unable to advance; spurring a black mule yet turning blocked.',
    'On a white horse I could not advance; on a black mule I could not turn.',
  ],
  [
    's0354',
    'Blowing fallen leaves in a small skiff; drifting a long sail upstream.',
    'I sailed a leaf-thin skiff; a long sail carried me upriver.',
  ],
  [
    's0355',
    'Those with saw teeth and hooked claws; again they patrolled the river and trained in currents.',
    'Their teeth were saws, their claws hooks; they patrolled the river and drilled on the water.',
  ],
  [
    's0356',
    'Arraying Azure Dragon warships; fighting from Flying Swallow ship towers.',
    'They lined Azure Dragon warships and fought from Flying Swallow towers.',
  ],
  [
    's0357',
    'Zhang Liao approached at Red Cliffs; Wang Jun descended at Baling.',
    'Like Zhang Liao at Red Cliffs, like Wang Jun at Baling.',
  ],
  [
    's0358',
    'Suddenly wind startled and they shot fire; or arrows grew heavy and boats turned back.',
    'Suddenly wind rose and fire arrows flew; sometimes heavy with arrows the boats turned back.',
  ],
  [
    's0359',
    'Before distinguishing sound from Yellow Canopy, already first sunk was Duke Du.',
    'Before they could tell Huang Gai\'s ruse they had sunk like Du Yu.',
  ],
  [
    's0360',
    'Furled sails at Yellow Crane\'s ford; hid ships at Parrot Isle.',
    'Sails fell at Yellow Crane Ford; ships hid at Parrot Isle.',
  ],
  [
    's0361',
    'The road already divided at Xiang and Han; stars still could be seen at Dipper and Ox.',
    'Ways parted at the Xiang and Han; the Dipper and Ox still shone above.',
  ],
  [
    's0362',
    'Then at Yinling he lost the way; the angling terrace slanted in his course.',
    'As at Yinling where he lost the way; as the angling terrace leaned in flight.',
  ],
  [
    's0363',
    'Gazing at Red Bank his robes were wet; moored at Black River he did not cross.',
    'Gazing at Red Cliff he wet his robes; moored at the Wu River he could not cross.',
  ],
  [
    's0364',
    'Leichi barred the ford; Que\'ling burned the garrison.',
    'Leichi blocked the crossing; Que tomb\'s garrison burned.',
  ],
  [
    's0365',
    'Inns had no smoke; nest birds lost their trees.',
    'No smoke rose from inns; birds lost their nests.',
  ],
  [
    's0366',
    'They thought Jing and Heng\'s catalpa and nan could be relied on; they hoped the Jiang and Han could be trusted.',
    'They trusted catalpa from Jingzhou and timber from Hengshan; they hoped the Yangzi and Han could shield them.',
  ],
  [
    's0367',
    'Between Huai and sea, maintaining Yang—more than three thousand li.',
    'From Huai to sea, holding Yangzhou—three thousand li and more.',
  ],
  [
    's0368',
    'Passing Piao Ford to beg food; trusting the reed shelter to ford the water.',
    'Like passing Spotted Islet for a meal; like hiding in the reeds to cross the water.',
  ],
  [
    's0369',
    'Arriving at the seven marshes; nearing the ten deaths.',
    'He came to the seven marshes on the brink of ten deaths.',
  ],
  [
    's0370',
    'Alas—heaven\'s protection was not yet fixed; he saw deep sorrow just beginning.',
    'Alas—divine protection unassured; anguish only beginning.',
  ],
  [
    's0371',
    'Originally he did not attain dangerous conduct; furthermore he had no feeling for salary and office.',
    'He was never cut out for perilous deeds nor cared for salary and rank.',
  ],
  [
    's0372',
    'Erroneously he held command of the central army; vainly he served as aide among the censores.',
    'By mistake he commanded the central army; unworthily he held the censor\'s post.',
  ],
  [
    's0373',
    'Truly birth in life equaled Longmen; parting from kin was as at He and Luo.',
    'His birth seemed like crossing Dragon Gate; parting kin like leaving He and Luo.',
  ],
  [
    's0374',
    'He received the departed instruction on establishing the person; he undertook the entrustment of the completed book.',
    'He inherited instructions on how to live and accepted the charge of the testament.',
  ],
  [
    's0375',
    'Formerly three generations without shame; now seven branches at last fall.',
    'Three generations without shame; now the seventh leaf falls at last.',
  ],
  [
    's0376',
    'Weeping wind and rain on Mount Liang in the Ode; only the dried fish biting the cord.',
    'He wept like wind and rain on Mount Liang; like a dying fish on a hook.',
  ],
  [
    's0377',
    'Entering a skewed small path; closing a wretched gate of thatch and brambles.',
    'He took the winding path and shut the ramshackle gate of brambles.',
  ],
  [
    's0378',
    'Approaching the islet\'s angelica; awaiting reed grass for a single garment.',
    'He sought angelica on the sandbar; waited for reeds to make a single robe.',
  ],
  [
    's0379',
    'At that time the Overlord of Western Chu, sword reaching Fanyang.',
    'Then the Hegemon of Western Chu reached Fanyang sword in hand.',
  ],
  [
    's0380',
    'Battles fiercely at Golden Coffer; contests arms at Jade Hall.',
    'Battle raged at Golden Coffer; arms clashed at Jade Hall.',
  ],
  [
    's0381',
    'Azure Hawk and Red Sparrow; iron prows and comb-tooth masts.',
    'Azure Hawk and Red Sparrow ships with iron prows and jagged masts.',
  ],
  [
    's0382',
    'Sinking the white horse to oath the host; bearing the yellow dragon to cross the Xiang.',
    'White horses were drowned to swear the host; the yellow dragon standard crossed the Xiang.',
  ],
  [
    's0383',
    'Sea tides welcomed the fleet; river duckweed sent off the king.',
    'Sea tides bore the fleet in; river weeds sped the king along.',
  ],
  [
    's0384',
    'War chariots camped at Stone City; ko-halberd ships veiled Huai and Si.',
    'Chariots massed at Stone City; spear ships covered Huai and Si.',
  ],
  [
    's0385',
    'Among the lords the Earl of Zheng advanced in the van; the covenant leader Xun Ying arrived at dusk.',
    'Lords rode as Earl of Zheng in the van; the hegemon came at dusk like Xun Ying.',
  ],
  [
    's0386',
    'Splitting nests and smoking dens; demons fleeing, goblins running.',
    'They tore nests and smoked burrows; evil spirits fled in terror.',
  ],
  [
    's0387',
    'Burying the Long Di at Jumen Gate; beheading Chiyou in central Ji.',
    'Long Di was buried at Jumen; Chiyou was slain in Ji.',
  ],
  [
    's0388',
    'Yet bellies for lamps; drinking from heads for vessels.',
    'Yet bellies served as lamps and skulls as cups.',
  ],
  [
    's0389',
    'A straight rainbow pierced the fortress; a long star touched earth.',
    'A straight rainbow pierced the camp; a long comet touched earth.',
  ],
  [
    's0390',
    'Formerly tiger-crouched and dragon-coiled, with yellow banners and purple vapors moreover—all followed foxes and rabbits into burrows, with wind and dust were exterminated and withered.',
    'Once they crouched like tigers, coiled like dragons, wrapped in purple mist and yellow banners—yet all ended in fox and rabbit warrens, perishing in wind and dust.',
  ],
  [
    's0391',
    'West they gazed on Bowang; north they overlooked the Dark Garden.',
    'West to Bowang Terrace; north to the Dark Garden.',
  ],
  [
    's0392',
    'Moon pavilions and wind towers; pools leveled and trees ancient.',
    'Moon pavilions, wind towers, leveled pools, ancient trees.',
  ],
  [
    's0393',
    '[Damaged text] bow at the Jade Maiden\'s window; tether horse at Phoenix Tower pillar.',
    '[Damaged text] He strung his bow at the Jade Maiden\'s window; tethered his horse to the Phoenix Tower pillar.',
  ],
  [
    's0394',
    'The Renshou mirror hung in vain; the Maoling books gathered empty.',
    'The Renshou mirror hung useless; Maoling\'s books piled untouched.',
  ],
  [
    's0395',
    'As for establishing virtue and establishing words, plans bright and assisting in the light.',
    'Those who established virtue and left words—counsel bright, service loyal.',
  ],
  [
    's0396',
    'Voice surpassing the tied chart; Way higher than upon the river.',
    'Fame beyond the attached record; teaching loftier than on the riverbank.',
  ],
  [
    's0397',
    'Already they did not meet Floating Mound; thus they had no words from Master Kuang.',
    'They never met Floating Mound; the blind Music Master spoke no more.',
  ],
  [
    's0398',
    'Pointing to a beloved child to entrust to others; knowing Western Mound—who would gaze there?',
    'Pointing to a beloved son to entrust to another—knowing Western Mound, who still looks that way?',
  ],
  [
    's0399',
    'It was not that there was no northern gate army; there was still Cloud Terrace\'s weapons.',
    'They were not without armies at the northern palace nor arms on Cloud Terrace.',
  ],
  [
    's0400',
    'The Minister of Works\' interior-exterior statecraft; Hu Yan\'s "for the king truly diligent."',
    'Like the Minister of Works weaving inside and out; like Hu Yan toiling only for the king.',
  ],
];

const path = 'translations/current_translation_zhoushu.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const map = new Map(T.map((row) => [row[0], row]));
for (const s of data.sentences) {
  const row = map.get(s.id);
  if (!row) continue;
  s.literal = row[1];
  s.idiomatic = row[2];
}
fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', T.length, 'translations');
