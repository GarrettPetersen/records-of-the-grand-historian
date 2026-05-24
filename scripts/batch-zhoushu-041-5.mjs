#!/usr/bin/env node
import fs from 'node:fs';

const T = [
  [
    's0401',
    'Laying across an inlaid halberd to face the hegemon; grasping gold drums to interrogate the traitor-minister.',
    'Halberd laid crosswise, he faced the hegemon; gold drums in hand, he questioned the traitor at court.',
  ],
  [
    's0402',
    'The achievement of pacifying Wu was grander than Du Yuankai\'s.',
    'His pacification of Wu outshone even Du Yu\'s glory.',
  ],
  [
    's0403',
    'On him the royal house relied—more deeply than on Wen Taizhen.',
    'The throne leaned on him more than it ever had on Wen Jiao.',
  ],
  [
    's0404',
    'At first a place was named Whole Integrity; in the end a mountain was named to wrong a man.',
    'First a district bore the name "Whole Integrity"; at last a mountain was named for the innocent man wrongly killed.',
  ],
  [
    's0405',
    'The collator of books at Nanyang—already far away.',
    'The scholar at Nanyang—how distant that age now seems.',
  ],
  [
    's0406',
    'Hunting at Shangcai—how late to know!',
    'Hunting at Shangcai—how late the knowing came.',
  ],
  [
    's0407',
    'The Northern Pacifier bore old fame and pride; the wind-gust was awe-inspiring.',
    'Huan Wen, praised and proud from old campaigns, struck fear like a rising gale.',
  ],
  [
    's0408',
    'The water god suffered arrows; the mountain spirit was seen being whipped.',
    'He shot arrows at the river god; he lashed the mountain spirit before men\'s eyes.',
  ],
  [
    's0409',
    'Therefore the hibernating bear wounded horses; the floating flood-dragon sank boats.',
    'So the bear in its winter den crippled horses, and flood-dragons beneath the waves swallowed ships.',
  ],
  [
    's0410',
    'Talented men died together; none reached a hundred years.',
    'Men of genius died in their prime—not one lived out a full century.',
  ],
  [
    's0411',
    'Zhongzong\'s quelling of villains and calming of chaos greatly avenged shame.',
    'When the Middle Sovereign crushed rebels and stilled disorder, he washed away deep humiliation.',
  ],
  [
    's0412',
    'Leaving the Dai lodge to inherit the foundation; moving to Tang suburbs to continue sacrifices.',
    'Like Liu Bang leaving the lodge at Dai to seize the throne, like Tang moving the altars to carry on the rites.',
  ],
  [
    's0413',
    'Restored old statutes at the Metropolitan Governor; returned lingering winds to Zhengshi.',
    'Old laws were restored in the capital; the refined style of Zhengshi returned.',
  ],
  [
    's0414',
    'Deep suspicion—then desires indulged at will; concealing illness—then pride in oneself.',
    'Buried in suspicion, he gave free rein to appetite; hiding his sickness, he preened on his own wit.',
  ],
  [
    's0415',
    'Affairs of All-under-Heaven sank away; feudal lords\' hearts wavered.',
    'The realm\'s business sank from sight; the great lords\' loyalty began to shake.',
  ],
  [
    's0416',
    'Then Qi\'s ties to the north were cut; Qin\'s disaster rose in the west.',
    'Soon northern ties with Qi were severed; trouble from Qin flared in the west.',
  ],
  [
    's0417',
    'Moreover, turning one\'s back on the pass to yearn for Chu; handing the frontier post to another and opening Wu.',
    'Worse still: pining for old Chu while abandoning the frontier pass, entrusting distant posts and opening the road to Wu.',
  ],
  [
    's0418',
    'Driving scattered soldiers of the Green Forest; resisting rebels from Lishan.',
    'They drove outlaw bands of Green Forest troops against rebels from Lishan.',
  ],
  [
    's0419',
    'Encamped armies at Liang and Shang; sought chariot teams from Ba and Yu.',
    'They camped along the Liang and Shang rivers and pressed Ba and Yu for war-chariots.',
  ],
  [
    's0420',
    'Inquired of licentious deluded ghosts; sought from exorcist shamans.',
    'They questioned corrupt spirits and courted shamans who claimed to drive out evil.',
  ],
  [
    's0421',
    'Jingmen suffered Bao Yan\'s slaughter; Xiaoshou abused execution like at Kuiquan.',
    'At Jingmen came Bao Yan\'s massacre; at Xiaoshou killings as wanton as at Kuiquan.',
  ],
  [
    's0422',
    'Scorned teaching love through kinship; bore archery in harmonious times.',
    'They scorned kinship and the bonds of love; they drew bows in days meant for peace.',
  ],
  [
    's0423',
    'Alas—no strategy among the meat-eaters; not what was hoped from "Discourse on the Capital."',
    'High ministers at table had no plan—far from the counsel Ban Gu set forth in his Discourse on the Capital.',
  ],
  [
    's0424',
    'Not deeply pondering the five difficulties; first arrogating both ends to oneself.',
    'They never weighed the five perils, yet seized both extremes for themselves.',
  ],
  [
    's0425',
    'Ascending Yang city to avoid peril; lying at the bottom pillar to seek safety.',
    'They fled to Yang city for refuge and clung to the bottom of the pillar seeking safety.',
  ],
  [
    's0426',
    'Already words exceeded jealous severity; in truth the will was bold in cruel punishment.',
    'Talk overflowed with jealous barbs; in deed he delighted in cruel punishments.',
  ],
  [
    's0427',
    'Only sat watching the changes of the age; originally no feeling for urgent difficulty.',
    'Officials only watched the times shift and never rose to the crisis.',
  ],
  [
    's0428',
    'Land like a black mole; cities still like cannonballs.',
    'Territory no larger than a mole on the skin; strongholds no bigger than pellets.',
  ],
  [
    's0429',
    'Their complaints were excessive; their alliances cold.',
    'Grievances turned to outrage; alliances turned to ice.',
  ],
  [
    's0430',
    'Could a wronged bird fill the sea? Could a foolish old man move mountains?',
    'No wronged bird could fill the sea; no fool could move a mountain—such labors were vain.',
  ],
  [
    's0431',
    'Moreover pestilential qi floated by day; evil spirits fell by night.',
    'Pestilence hung in the morning air; demons fell from the night sky.',
  ],
  [
    's0432',
    'Red birds—three mornings flanking the sun; azure clouds—sevenfold encircling the chariot hub.',
    'Red birds three mornings running blotted the sun; azure clouds seven layers deep ringed the imperial axle.',
  ],
  [
    's0433',
    'Years of Wu\'s destruction already exhausted; year of entering Ying now ended.',
    'The years of Wu\'s fall had run out; the year of entering Ying was spent.',
  ],
  [
    's0434',
    'Zhou harbored Zheng\'s anger; Chu bound Qin\'s enmity.',
    'Zhou nursed Zheng\'s wrath; Chu sealed Qin\'s vengeance—allies turned foes.',
  ],
  [
    's0435',
    'There was the southern wind not competing; met the western neighbor\'s reproach.',
    'The southern wind could not prevail; the western neighbor\'s rebuke fell upon them.',
  ],
  [
    's0436',
    'Suddenly scaling ladders and rams danced wildly; Ji horses clouded in mass.',
    'Soon battering rams and siege towers surged forward; cavalry from Ji massed like clouds.',
  ],
  [
    's0437',
    'Decking Qin chariots at Changgu; stacking Han drums at Leimen.',
    'Qin war-chariots lined the ramparts at Changgu; Han drums thundered piled at Leimen.',
  ],
  [
    's0438',
    'Descending on Chencang with linked crossbows; crossing Linjin with boats laid across.',
    'They took Chencang with linked crossbows; they crossed Linjin with boats moored beam to beam.',
  ],
  [
    's0439',
    'Though again Chu had seven marshes, men called "three households."',
    'Chu still had its seven lakes; men still said "three households survive."',
  ],
  [
    's0440',
    'Arrows did not pierce the six elk; thunder did not startle the nine tigers.',
    'No arrow bit the six elk; no thunder shook the nine tigers—the omens of defense failed.',
  ],
  [
    's0441',
    'Leaving Dongting—fallen leaves; departing Cenyang—the utmost shore.',
    'Farewell to Dongting and its falling leaves; farewell to Cenyang and the farthest shore.',
  ],
  [
    's0442',
    'Blazing fire burned banners; true wind harmed the gu.',
    'Fierce flames devoured the standards; a malign wind bred poison in the camp.',
  ],
  [
    's0443',
    'Thereupon jade axles threw up ash; dragon-pattern halberds cut pillars.',
    'Jade axles turned to ash; dragon-pattern blades hacked the palace pillars.',
  ],
  [
    's0444',
    'Below the Yangtze few cities remain; Changlin, the old camp.',
    'South of the river, cities were few; at Changlin, only an abandoned camp remained.',
  ],
  [
    's0445',
    'Vainly thinking of hobbling horses\' fodder; not seeing the fire-ox army.',
    'They dreamed of starving the enemy\'s horses but never deployed the fire-ox stratagem.',
  ],
  [
    's0446',
    'Zhang Manzhi fled with carriage rims; Gong Zhiqi went with his clan.',
    'Zhang Manzhi fled with nothing but his carriage wheels; Gong Zhiqi went into exile with all his kin.',
  ],
  [
    's0447',
    'River without ice yet horses crossed; pass before dawn yet cocks crowed.',
    'Horses crossed rivers not yet frozen; cocks crowed before the passes were clear at dawn.',
  ],
  [
    's0448',
    'Loyal ministers\' bones undone; gentlemen swallowed their voices.',
    'Loyal ministers were torn limb from limb; gentlemen dared not speak aloud.',
  ],
  [
    's0449',
    'Zhanghua where sacrifices were gazed upon; Yunmeng where false tours were made.',
    'At Zhanghua they once looked out on ritual sacrifice; at Yunmeng they staged imperial tours that were mere pretense.',
  ],
  [
    's0450',
    'Desolate valley—the Mo\'ao hanged himself; Yefu imprisoned by the host of commanders.',
    'In a desolate vale the Mo\'ao hung himself; at Yefu princes were imprisoned by their own generals.',
  ],
  [
    's0451',
    'Whetstone traps broke and tore; hawks and falcons struck and swept.',
    'Men fell into hidden pits and were torn apart; like hawks and falcons, soldiers struck and swept all before them.',
  ],
  [
    's0452',
    'Wronged frost fell in summer; indignant springs boiled in autumn.',
    'Frost of injustice fell in summer; springs of wrath boiled in autumn.',
  ],
  [
    's0453',
    'City walls collapsed at the Qi woman\'s cry; bamboo stained with Xiang consorts\' tears.',
    'Walls crumbled at the wailing of the woman of Qi; bamboo ran dark with the tears of the Xiang queens.',
  ],
  [
    's0454',
    'Waters poisoned like Qin Jing; mountains high like Zhao Xing.',
    'The waters were as bitter as Qin\'s Jing River; the mountains as steep as Zhao\'s Xing passes.',
  ],
  [
    's0455',
    'Ten li, five li—long pavilions, short pavilions.',
    'Ten li here, five li there—post stations long and short marked every stage of exile.',
  ],
  [
    's0456',
    'Hunger followed hibernating swallows; darkness pursued drifting fireflies.',
    'Hunger dogged them like swallows returning to winter sleep; darkness followed like drifting fireflies.',
  ],
  [
    's0457',
    'Waters in Qin land black; mud on the passes green.',
    'The waters of Qin ran black; the mud on the frontier passes turned green.',
  ],
  [
    's0458',
    'Then like tile broken and ice melted; wind flew and lightning scattered.',
    'Then empires shattered like tile and ice; kin scattered like wind and lightning.',
  ],
  [
    's0459',
    'For a thousand li all one blur; Zi and Shi rivers alike confused.',
    'For a thousand li all was one blur; the Zi and the Shi could no longer be told apart.',
  ],
  [
    's0460',
    'Snow dark as sand; ice crossing like banks.',
    'Snow dimmed the horizon like blown sand; ice lay across the road like a second shore.',
  ],
  [
    's0461',
    'Meeting Lu Ji bound for Luoyang; seeing Wang Can leaving home.',
    'One met Lu Ji on the road to Luoyang; one saw Wang Can driven from his home.',
  ],
  [
    's0462',
    'None but hearing Longshui wept concealed; facing frontier passes sighed long.',
    'All who heard the waters of Longshui wept in secret; all who faced the frontier passes sighed long.',
  ],
  [
    's0463',
    'Moreover husband at Jiaohe, wife on Clear Wave.',
    'Worse still when the husband was at Jiaohe and the wife on the Clear Wave—worlds apart.',
  ],
  [
    's0464',
    'Stone watching husband grows ever farther; mountain watching son grows ever more.',
    'The stone that watched for her husband grew ever more distant; the mountain that watched for her son grew ever more numerous.',
  ],
  [
    's0465',
    'Talented man\'s longing for Dai commandery; princess departing Qinghe.',
    'A man of letters yearned for Dai; a princess was sent away to Qinghe.',
  ],
  [
    's0466',
    'Xuyang pavilion had a parting fu; Prince of Linjiang had a song of sorrowful thought.',
    'At Xuyang Pavilion someone wrote a fu of farewell; the Prince of Linjiang composed a song of grief.',
  ],
  [
    's0467',
    'Separately there were drifting at Wuwei; detained at Jinwei.',
    'Others drifted through Wuwei; others were exiled to Jinwei.',
  ],
  [
    's0468',
    'Ban Chao born already looking to return; Wen Xu dead yet thinking of return.',
    'Ban Chao was born already longing for home; Wen Xu died still thinking of return.',
  ],
  [
    's0469',
    'Li Ling\'s paired ducks gone forever; Su Wu\'s lone goose flew empty.',
    'Li Ling\'s paired ducks were gone forever; only Su Wu\'s lone goose flew back in vain.',
  ],
  [
    's0470',
    'Formerly Jiangling\'s stagnation—thus was Jinling\'s disaster\'s beginning.',
    'Jiangling\'s fall once foretold was the beginning of Jinling\'s ruin.',
  ],
  [
    's0471',
    'Though borrowing others\' external strength, in truth it rose within the courtyard wall.',
    'Though foreign armies lent their force, the blow came from within the house.',
  ],
  [
    's0472',
    'The lord who quelled chaos—suddenly gone; the house of restoration—unenthroned.',
    'The ruler who had put down chaos was suddenly no more; the line meant to restore the dynasty went unsacrificed.',
  ],
  [
    's0473',
    'Elder brother and younger—alike slain by the nephew\'s son.',
    'Elder brother and younger alike were slaughtered by the nephew\'s son.',
  ],
  [
    's0474',
    'Jingshan magpie flew and jade shattered; Sui shore snake born and pearl died.',
    'When the magpie flew from Jing Mountain, jade shattered; when the snake was born on the Sui shore, the pearl died.',
  ],
  [
    's0475',
    'Ghost fires riled Ping forest; young spirits startled at Xin market.',
    'Ghost fires flickered through Ping Forest; the souls of the young were shaken in Xin Market.',
  ],
  [
    's0476',
    'Liang\'s old abundance moved; Chu in truth Qin destroyed.',
    'Liang\'s former glory was uprooted; Chu in truth perished as Qin had.',
  ],
  [
    's0477',
    'Without something discarded, how could there be flourishing?',
    'Without what is cast away, how can anything flourish?',
  ],
  [
    's0478',
    'Descendants of You Gui then nurtured by Jiang.',
    'The line of You Gui was nourished at last by the house of Jiang.',
  ],
  [
    's0479',
    'Yielding our divine vessel, dwelling as yielding king.',
    'I surrendered the sacred regalia and lived on as a king who had yielded the throne.',
  ],
  [
    's0480',
    'Heaven and earth\'s greatest virtue is life; the sage\'s greatest treasure is position.',
    '"The greatest virtue of Heaven and earth is to give life; the greatest treasure of the sage is the throne."',
  ],
  [
    's0481',
    'Employing worthless descendants; raising Jiangdong then wholly abandoning it.',
    'They set worthless heirs on the throne and threw away all of Jiangdong.',
  ],
  [
    's0482',
    'Pitying the realm as one family; meeting southeast\'s contrary qi.',
    'They cherished the realm as one household—yet met the ill-omened air of the southeast.',
  ],
  [
    's0483',
    'Giving Qin the Quinshou sector—why does Heaven so drunkenly err!',
    'Heaven gave the Quinshou mansions to Qin—why is the sky so drunk with error!',
  ],
  [
    's0484',
    'Moreover heaven\'s way revolves; human life is foretold therein.',
    'Heaven\'s course turns in circles, and mortal lives are written within its wheel.',
  ],
  [
    's0485',
    'My blazing ancestors of Western Jin first wandered broadcast to eastern rivers.',
    'My fierce forebears of Western Jin first fled east along the rivers.',
  ],
  [
    's0486',
    'Down to my person, seven generations; again met the age and migrated north.',
    'By my own day we had been seven generations in the south—and then, in my time, we were driven north again.',
  ],
  [
    's0487',
    'Leading old and young; pass and river for accumulated years.',
    'I led the old and the young through passes and rivers, year upon year.',
  ],
  [
    's0488',
    'Life and death, separation and reunion—cannot be asked of heaven.',
    '"In life or death, in union or parting"—that no longer admits questioning Heaven.',
  ],
  [
    's0489',
    'Moreover scattered and almost gone; Lingguang still towering alone.',
    'And now my line is nearly spent, while the Spirit Light Temple still stands towering alone.',
  ],
  [
    's0490',
    'Sun exhausted at Ji, year about to begin anew.',
    'The year turns at the sun\'s rest in the Ji lodge; a new cycle is about to begin.',
  ],
  [
    's0491',
    'Pressed by perilous thoughts; upright sorrow in evening teeth.',
    'Peril presses in upon my thoughts; upright grief attends my aging years.',
  ],
  [
    's0492',
    'Treading Changle\'s sacred heights; gazing at Xuanping\'s noble quarter.',
    'I walk the sacred terraces of Changle and look toward the noble lanes of Xuanping.',
  ],
  [
    's0493',
    'Wei River pierced Heaven Gate; Mount Li turned back at earth market.',
    'The Wei River runs through Heaven Gate; Mount Li curves back above the markets of the underworld.',
  ],
  [
    's0494',
    'In the headquarters great general\'s cherished guests; Chancellor Pingjin Marquis\'s treatment of scholars.',
    'I am welcomed as a cherished guest of the great general in his headquarters, tended as Zhu Gongzi once tended men of talent.',
  ],
  [
    's0495',
    'Saw bell and tripod families like Jin and Zhang; heard strings and songs like Xu and Shi.',
    'I see great houses like Jin and Zhang with their bronze bells; I hear music like that of Xu and Shi.',
  ],
  [
    's0496',
    'Who knew Baling\'s night hunt was still the general of old times;',
    'Who would have known that the general hunting by night at Baling was still the man of former days?',
  ],
  [
    's0497',
    'A commoner in Xianyang—not only a prince longing to return.',
    'A plain-cloth man in Xianyang—I am not the only prince who longs to go home.',
  ],
  [
    's0498',
    'At the beginning of Daxiang, he resigned for illness and died.',
    'Early in the Daxiang reign, he resigned on account of illness and died.',
  ],
  [
    's0499',
    'Emperor Wen of Sui deeply mourned him, conferred his former office, added Governor of Jing and Huai provinces.',
    'Emperor Wen of Sui deeply mourned him, restored his former rank, and added the post of Governor over Jing and Huai provinces.',
  ],
  [
    's0500',
    'His son Li succeeded.',
    'His son Li succeeded him.',
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
