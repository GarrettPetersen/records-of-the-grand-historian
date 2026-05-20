#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'Already it stood crosswise and lengthwise; wind had stripped it and rain had scattered it.',
    'It had been built out and across; wind cleared it and rain tore it down.',
  ],
  s0202: [
    'In Western Han\'s declining age, my wandering began when the clouds first gathered.',
    'In the twilight of Western Han, my exile began at the clouded dawn.',
  ],
  s0203: [
    'We left Lizhou\'s seat at Haihun and planted mulberry on the Jiang ford.',
    'We forsook Haihun\'s prosperous seat and set mulberry on the river\'s edge.',
  ],
  s0204: [
    'Like the Huang and Ji basin through heavy generations, we passed beyond Ban\'s ten epochs.',
    'We shared the Yellow and Ji country\'s long ages and outlived Ban\'s ten generations.',
  ],
  s0205: [
    'Some refused salary and returned to the plow; some dusted their caps and came to office.',
    'Some turned down rank and went back to the fields; some shook off dust and entered service.',
  ],
  s0206: [
    'Then came Jin\'s Long\'an prosperity, gathering hardship and peril at heaven\'s pace.',
    'Then Jin\'s Long\'an gathered trial and trouble into the march of days.',
  ],
  s0207: [
    'Ages clashed in tumbling waves; the people lost their season and glanced back like wolves.',
    'Generations fought in rolling surf; men lost their hour and looked over their shoulders like wolves.',
  ],
  s0208: [
    'Chaos\'s hemp stretched over towns and hamlets; ruin like wild grass blazed along the roads.',
    'Disorder\'s tangle covered market and lane; waste like rank weeds burned on every road.',
  ],
  s0209: [
    'The great earth lay empty with no room for a man; the distant sky was far—who would hear my plea?',
    'The wide land had no place left for a body; the high heaven was remote—who could I call?',
  ],
  s0210: [
    'In my imperial ancestor\'s feeble years, the season\'s hardship pressed sharp as a thorn.',
    'In the soft years of my royal forebear, the times\' trouble came close as a barb.',
  ],
  s0211: [
    'Fleeing the perilous state in alarm, he sought a safe land and moved to settle.',
    'He fled a realm in danger, sought a gentler country, and went to make his home.',
  ],
  s0212: [
    'First he found shelter at Zhufang, closing the quiet courtyard to rest in peace.',
    'He first took roof at Zhufang, shut the still court, and slept untroubled.',
  ],
  s0213: [
    'When the dragon countenance rose in splendor, then on wind he spread his correcting wings.',
    'When the dragon face lifted in glory, he rode the wind and straightened his wings.',
  ],
  s0214: [
    'He aimed the carriage yoke at the imperial city and drove south; he harnessed the broad highway to exert his strength.',
    'He turned the yoke toward the royal capital and went south; he took the great road and put his strength to use.',
  ],
  s0215: [
    'He moved the splendid gates and came to open them; he raised the high beam and transplanted it.',
    'He shifted the bright doors and came to set them wide; he lifted the tall ridgepole and set it anew.',
  ],
  s0216: [
    'Beside the leisure avenues\' smooth expanse, facing the Huai\'s current clear and straight.',
    'By the level paths of the outer lanes, before the Huai\'s clear, straight flow.',
  ],
  s0217: [
    'Fragrant dust soaked ever farther off; the world\'s way suddenly rose and fell.',
    'Perfumed dust steeped the distance; the age\'s road pitched up and down.',
  ],
  s0218: [
    'Four generations stretch down to this day; a hundred sacrificial years upon my humble person.',
    'Four generations run to this morning; a hundred rites weigh on my slight life.',
  ],
  s0219: [
    'Alas for the ruined cottage hard to keep, like rain-broken bamboo swept by the wind.',
    'Ah—the broken lodge that will not stand, like split bamboo driven by the gale.',
  ],
  s0220: [
    'Some cut thatch and pruned thorns anew; some had gone west and returned east again.',
    'Some mended the roof and cleared the thorns; some went west, then came back east.',
  ],
  s0221: [
    'Now sheltering in the White Shrine, now entrusting wife and children to Bo Tong.',
    'Now hiding in the White Shrine, now lodging kin with Bo Tong.',
  ],
  s0222: [
    'The traces of my life\'s upright integrity—truly I kept a heart that walked alone.',
    'The track of my days was straight and hard; I meant to keep a heart that went alone.',
  ],
  s0223: [
    'I thought of the reclusive man and felt deep pity; I gazed at the eastern ridge and longed.',
    'I mourned the man apart from the world and turned my eyes to the eastern terrace in longing.',
  ],
  s0224: [
    'By nature I had forgotten feeling for outer things, only to be bound by heaven\'s dust.',
    'I was born to forget the world\'s goods, yet only wound in heaven\'s dust.',
  ],
  s0225: [
    'Ying Pu-ke sighed again and again at threads that pulled; Lu Ji spoke of the world\'s net.',
    'Ying Pu-ke groaned at every tug of thread; Lu Ji named the net the age weaves.',
  ],
  s0226: [
    'Affairs ran on, ungathered; my will was anxious yet never lost its integrity.',
    'Business poured on without rest; my heart was tight but never bent.',
  ],
  s0227: [
    'The road neared its end and grew steeper still; feeling at dusk spread ever wider.',
    'The path was nearly spent and grew sharper; at evening my longing widened.',
  ],
  s0228: [
    'I held an inch of heart fragrant as orchids—how vast this longing\'s flood!',
    'I carried a span of heart sweet as orchid—how wide this wish runs!',
  ],
  s0229: [
    'I chanted "Returning!" yet stood rooted in place; I looked toward the rocky crags and clapped my hands.',
    'I sang of going home yet could not move; I turned to the cliff and struck my palms.',
  ],
  s0230: [
    'I met a lord who had lost virtue; how deep the wicked darkness burned!',
    'I met a ruler without virtue; how thick the evil night burned!',
  ],
  s0231: [
    'Battles at Muye were never arrayed such as this; feats at Mount Sheng were not set down in records.',
    'No battle at Muye was ever fought like this; no deed at Mount Sheng was ever written in the books.',
  ],
  s0232: [
    'The common people chattered—they would soon be fed to beasts as bait.',
    'The people murmured—they would soon be meat hung out for beasts.',
  ],
  s0233: [
    'They looked up at the round sky and had no refuge; though not in the pen, they were meat on the block.',
    'They stared at the round heaven and had nowhere to turn; though not yet in the stall, they were already flesh on the board.',
  ],
  s0234: [
    'At first I sighed at the threads and saw no way through; at last I met the prime minister who opened the web.',
    'First I grieved at the snarl and saw no end; at last I met the chief minister who cut the threads.',
  ],
  s0235: [
    'I found grace bestowed from above on high—surely no people were more sorely tried.',
    'Heaven\'s kindness reached down—surely no folk had suffered more.',
  ],
  s0236: [
    'The dark tally was granted at the Well and Wings constellations—truly the numinous mandate was received.',
    'The hidden token came at the Well and Wings—truly the bright charge was taken.',
  ],
  s0237: [
    'At the season when heaven lowered its watch, the piled evil ripened like clouds.',
    'When heaven first bent its gaze, long-stored wrong ripened like thundercloud.',
  ],
  s0238: [
    'Though the lower realm was carved into regions, the heavy miasma was cleared from the upper vault.',
    'Though the lower land was cut into parts, the thick haze was swept from the high dome.',
  ],
  s0239: [
    'He himself had no leisure for the morning meal; he often sought his garment at the night\'s pillow.',
    'He had no time even to eat at dawn; he often looked for his robe on the night pillow.',
  ],
  s0240: [
    'Already he had caged the dynasties of Yao and Xia; again he drove the eras of Xuan and Zhuan.',
    'He had already bound the lines of Yao and Xia; again he drove the reigns of Xuan and Zhuan.',
  ],
  s0241: [
    'Virtue reached where no place was remote; illumination spared not the smallest flicker.',
    'His virtue went where no land was far; his light left no corner unlit.',
  ],
  s0242: [
    'He beat the dark marsh across the great waste; he sowed humane winds through distant lands.',
    'He drummed the deep fen across the wild; he scattered humane wind through far-off custom.',
  ],
  s0243: [
    'From the remotest antiquity he turned his far thought—truly the royal plan was jade.',
    'He looked back through deepest time—truly the king\'s design was jade.',
  ],
  s0244: [
    'He met an age when the River Chart was held in the mouth; he encountered the season when a sagely rise was blessed.',
    'He came to a time when the River Chart was in hand; he met the hour when a holy rise was praised.',
  ],
  s0245: [
    'I left the inner attendant\'s post on the first day and received the light of a supporting minister in this hour.',
    'I quit the inner attendant on the first day and took the bright post of a helping minister in this season.',
  ],
  s0246: [
    'I lacked the fierce will to cast stones; I had no splendid words of flying arrow-phrases.',
    'I had no heart to cast the stone; I had no shining speech of the flying arrow.',
  ],
  s0247: [
    'I drove off the sun-bird and was ordered a district; I squared the mountains and rivers and opened the foundation.',
    'I drove away the sun-bird and was given a town; I set the mountains and rivers in order and laid the base.',
  ],
  s0248: [
    'I aided the stored light of the three excellences and long held royal duty among the hundred offices.',
    'I helped the stored light of the three virtues and long kept royal work among the hundred bureaus.',
  ],
  s0249: [
    'I trembled at the vulgar man\'s easy loss; I feared favor and salary were hard to keep.',
    'I feared how quickly the common man loses his hold; I dreaded how hard rank and pay are to keep.',
  ],
  s0250: [
    'In former ages the honored officials—how rarely they bent their hearts to hill and cave!',
    'In old days the great ministers—how seldom they bowed their hearts to hill and hollow!',
  ],
  s0251: [
    'Like clustered glory in Chu and Zhao, each drove pride and extravagance beyond the next.',
    'Like flowers massed in Chu and Zhao, each outdid the last in pride and waste.',
  ],
  s0252: [
    'They built armored halls at the Bronze Camel; they stacked high gates at the northern tower.',
    'They raised armored lodges at the Bronze Camel; they piled tall gates at the northern watch.',
  ],
  s0253: [
    'Heavy gates opened on the flower ward—how could wild mugwort bury them?',
    'Great doors opened on the flowered ward—how could mere mugwort cover them?',
  ],
  s0254: [
    'Proud Ao left his line on broken ground—how could one settle body in a straitened place?',
    'Proud Ao\'s heirs lived on broken soil—how could a man find rest in a narrow land?',
  ],
  s0255: [
    'I take the former sages\' words for my own speech—truly my heart\'s taste alone delights.',
    'I make the old wise men\'s sayings my tongue—only what my heart loves pleases me.',
  ],
  s0256: [
    'I do not admire power in the market city; I do not beg fame in the butcher\'s lane.',
    'I do not crave power in the market streets; I do not hunt name in the butcher\'s row.',
  ],
  s0257: [
    'I chant the rare and subtle to shape my chamber; good fortune that wind and frost may shelter me.',
    'I sing the hidden and fine to build my room; luck that wind and frost can roof me.',
  ],
  s0258: [
    'Thus I came beside the forsaken wilds, reaching the waste outskirts;',
    'So I came by the empty wild, to the bare edge of the suburbs;',
  ],
  s0259: [
    'I plaited frost-reed and patched the cold thatch.',
    'I wove frost-reed and mended the winter roof.',
  ],
  s0260: [
    'I built a perch where clamor gathered, laid out strips where field paths met.',
    'I made a roost where noise would settle, traced plots where field tracks crossed.',
  ],
  s0261: [
    'Because eaves offended, I cut the trees; because the base would suffer, I trimmed the nests.',
    'Where the eaves were blocked, I felled trees; where the footings would fail, I cleared nests.',
  ],
  s0262: [
    'I opened the stagnant pool\'s shallow backwater; I blocked the well tile\'s sunken hollow.',
    'I cut the still pond\'s shallow rim; I filled the well curb\'s fallen dip.',
  ],
  s0263: [
    'I planted fragrant trifoliate on the north ditch, set tall poplars on the south ford.',
    'I set sweet orange on the north ditch, tall poplar on the south bank.',
  ],
  s0264: [
    'I moved the pottery window into the orchid room; the shared shoulder-wall matched a splendid rampart.',
    'I brought the clay window into the orchid chamber; the shared wall stood like a bright fortress.',
  ],
  s0265: [
    'I wove overnight rushes for a gate, took the outer leaf-boards for doors.',
    'I bound last night\'s rushes into a gate, took outer boards for doors.',
  ],
  s0266: [
    'I already took shade from the courtyard\'s shade trees, and relied on the hedge of fragrant elm.',
    'I took shade from the court trees, and leaned on a hedge of sweet elm.',
  ],
  s0267: [
    'I opened the inner chamber for a far prospect; I cleared the high hall\'s side view.',
    'I opened the inner room to look far off; I widened the high hall to see aside.',
  ],
  s0268: [
    'The marsh islet soaked in at the eaves\' drip; the field paths ringed the hall below.',
    'The marsh edge crept under the dripping eaves; field paths circled the hall below.',
  ],
  s0269: [
    'Of water plants—duckweed, water-shield, gorgon, lotus, duckweed, reed, rush;',
    'For water growth—duckweed, shield-plant, gorgon, lotus, duckweed, reed, rush;',
  ],
  s0270: [
    'stone moss, sea tresses, yellow pondweed, green cattail.',
    'stone moss, sea hair, yellow pondweed, green cattail.',
  ],
  s0271: [
    'Red lotus stirred on light ripples; green leaves covered the clear lake.',
    'Red lotus moved on soft waves; green leaf roofed the clear mere.',
  ],
  s0272: [
    'We ate fine fruit to push off age; we shook feather robes in the pure capital.',
    'We ate good fruit to turn back age; we shook feather coats in the clean court.',
  ],
  s0273: [
    'Of land plants—purple turtle, green sprout, sky thistle, mountain chive;',
    'For land herbs—purple turtle, green sprout, sky thistle, mountain chive;',
  ],
  s0274: [
    'goose-tooth, elk-tongue, ox-lip, pig-head.',
    'goose tooth, elk tongue, ox lip, pig head.',
  ],
  s0275: [
    'Spread on the south pond\'s sunny bank, riotous behind the north tower.',
    'They spread on the south pool\'s bright side, ran wild behind the north lodge.',
  ],
  s0276: [
    'Some shaded the islet and roofed the ground; some threaded the window to peep at the frame.',
    'Some roofed the islet and covered the earth; some laced the window to look through the frame.',
  ],
  s0277: [
    'Then gardens and dwellings had special forms; fields and orchards different zones.',
    'Then garden and house had their own shapes; field and orchard their own plots.',
  ],
  s0278: [
    'Li Heng had a thousand orange trees; Shi Chong had ten thousand mixed fruits.',
    'Li Heng kept a thousand orange trees; Shi Chong ten thousand mixed fruits.',
  ],
  s0279: [
    'Both were what proud spirit loved to display—not what a frugal will took for pleasure.',
    'Both were what bold hearts loved to show—not what a spare heart took for joy.',
  ],
  s0280: [
    'I wanted them thick and lush, pouring green and heaped crimson;',
    'I wished them rank and thick, green poured out and red piled high;',
  ],
  s0281: [
    'latticing windows, reflecting doors, linked eaves meeting corners.',
    'latticed windows, mirrored doors, joined eaves at every corner.',
  ],
  s0282: [
    'Opening crimson chambers on four sides, spreading jade leaves on nine crossroads.',
    'Crimson rooms opened to four lights; jade leaves spread on nine ways.',
  ],
  s0283: [
    'Drawing red blossoms from purple sashes, holding white stamens on green calyxes.',
    'Red bloom drawn from purple bands; white stamen held on green calyx.',
  ],
  s0284: [
    'Of forest birds—darting, resting, nodding, leaving sound above and below;',
    'For birds of the wood—wheeling, settling, dipping, leaving cry above and below;',
  ],
  s0285: [
    'Chu sparrows of many names, flowing warbles in mixed choruses.',
    'Chu finches of many names, flowing song in mixed chorus.',
  ],
  s0286: [
    'Some with patterned tails and brocade wings, some with green collars and scarlet crowns.',
    'Some with brocade tail and patterned wing, some with green neck and red brow.',
  ],
  s0287: [
    'They loved hidden leaves and concealed branches, now and then crossing with calls in passage.',
    'They loved hidden leaf and covered branch, now and then calling as they crossed.',
  ],
  s0288: [
    'Of water birds—great swan and small goose, celestial hound and marsh guardian;',
    'For water fowl—great swan and small goose, sky hound and marsh keeper;',
  ],
  s0289: [
    'autumn egret, winter gull, long egret, short teal.',
    'autumn heron, winter gull, long egret, short duck.',
  ],
  s0290: [
    'trailing uneven frail weeds, playing their light bodies in the shallows;',
    'dragging uneven soft weed, sporting light bodies in the shallows;',
  ],
  s0291: [
    'wings beat the stream and lifted foam, wings stirred waves into pearls.',
    'wings struck the flow and raised foam, wings ruffled the wave into pearls.',
  ],
  s0292: [
    'Of fish—red carp and green bream, slender minnow and great catfish.',
    'For fish—red carp and green bream, thin dart and heavy catfish.',
  ],
  s0293: [
    'jade scales and cinnabar tails, long heads and flat brows.',
    'jade scale and cinnabar tail, long head and flat brow.',
  ],
  s0294: [
    'small ones patterned the shallows in play; great ones spewed the current in white spray.',
    'small ones wrote patterns on the shoal; great ones threw white spray from the stream.',
  ],
  s0295: [
    'I do not envy river and sea; for now we forget each other in my dwelling.',
    'I do not envy the river and the sea; for now we only forget each other in my house.',
  ],
  s0296: [
    'Of bamboo—the southeast\'s lone excellence, nine prefectures\' special wonder.',
    'For bamboo—the southeast\'s single glory, the nine offices\' own marvel.',
  ],
  s0297: [
    'Not transplanted from the Qi waters; how could roots be divided at the music pool?',
    'Not moved from the Qi river; how could roots be split at the music pool?',
  ],
  s0298: [
    'Autumn cicadas sang on the leaves; winter sparrows clamored on the branches.',
    'Autumn cicada sang on the leaf; winter sparrow cried on the branch.',
  ],
  s0299: [
    'Wind came to the south study\'s eaves; snow pressed the north hall\'s fringe.',
    'Wind reached the south study\'s eaves; snow weighed the north hall\'s edge.',
  ],
  s0300: [
    'I visited past roads\' turning traces; I watched earlier men\'s true and false.',
    'I walked the old road\'s wheel tracks; I watched how the men before judged true and false.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_013_b3.mjs <translation.json>'
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
