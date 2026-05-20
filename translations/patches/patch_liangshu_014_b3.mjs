#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'Moreover hearts matched like qin and se; words grew lush as orchids on iris; the Way bonded like glue and lacquer; wills entwined tender as xun and chi.',
    'Hearts were tuned like qin and se; words breathed orchid and iris; the Way clung like glue and lacquer; wills leaned together like paired pipes.',
  ],
  s0202: [
    'Sages for this carved gold plates and engraved bronze basins, wrote jade registers and cut bells and tripods.',
    'For this the sages cut gold plates, graved bronze vessels, wrote jade registers, and struck bells and tripods.',
  ],
  s0203: [
    'As when a craftsman lays down the wind\'s subtle craft, or Boya ceases the flowing wave\'s elegant strain.',
    'As when the craftsman sets aside the wind\'s subtle craft, or Boya stills the flowing wave\'s elegant tune.',
  ],
  s0204: [
    'Fan and Zhang were earnest in the lower spring; Yin and Ban were at ease through the long night.',
    'Fan and Zhang kept faith in the underworld spring; Yin and Ban lingered easy through the long night.',
  ],
  s0205: [
    'Galloping crosswise, mist veiling and rain scattering—all beyond the clever reckoner\'s ken, beyond the heart\'s measure.',
    'They galloped crosswise, veiled in mist, scattered in rain—beyond any clever reckoner, beyond any heart\'s measure.',
  ],
  s0206: [
    'Yet Inspector Zhu of Yizhou penned his Yi narrative and Yue admonition, beat straight speech, severed all companionship, looked on the black-haired folk as hawk and kite, and matched human bonds to jackal and tiger.',
    'Yet Zhu of Yizhou wrote his Yi narrative and Yue admonition, struck down straight speech, cut off all fellowship, saw common folk as hawks and kites, and weighed human ties against jackals and tigers.',
  ],
  s0207: [
    'I have doubts—please clear my confusion."',
    'I am puzzled—please resolve my doubt."',
  ],
  s0208: [
    'The host smiled and said, "What you call stroking the strings for pure tone has not reached how dryness and dampness change the sound;',
    'The host smiled and said, "You speak of stroking strings for pure tone, yet miss how dryness and dampness change the sound;',
  ],
  s0209: [
    'spreading nets in the marsh and not seeing the swan and wild goose soar high."',
    'you spread nets in the marsh and never see swan and wild goose wheel high."',
  ],
  s0210: [
    'The sage holds the golden mirror and unfolds wind and merit; dragon rampant or silkworm bent, he follows the Way whether it sinks or rises.',
    'The sage holds the golden mirror, unfolds wind and merit; dragon rampant or silkworm bent, he follows the Way in rise or fall.',
  ],
  s0211: [
    'Sun and moon like linked jades—he sighs at the tireless vast reach;',
    'Sun and moon like linked jades—he sighs at tireless vast reach;',
  ],
  s0212: [
    'clouds flying, lightning thin—he shows the subtle intent of flowering paulownia.',
    'clouds flying, lightning thin—he shows the subtle bloom of flowering paulownia.',
  ],
  s0213: [
    'Like the five tones\' changes completing the nine accomplishments\' subtle melody—',
    'Like the five tones\' changes completing the nine accomplishments\' subtle melody—',
  ],
  s0214: [
    'this is Zhu gaining the dark pearl from Red Water, his admonition divine in wisdom made speech.',
    'this is Zhu winning the dark pearl from Red Water—divine wisdom turned into words.',
  ],
  s0215: [
    'As for weaving benevolence and righteousness, polishing the moral Way, rejoicing in its pleasure, grieving its decline—',
    'As for weaving benevolence and righteousness, polishing the moral Way, rejoicing in its pleasure, grieving its ruin—',
  ],
  s0216: [
    'lodging beneath the Spirit Terrace, leaving traces on rivers and lakes, wind and rain urgent yet never ceasing its tone, frost and snow fallen yet never staining its hue—such is the sage\'s plain friendship, met once in ten thousand ages.',
    'lodging beneath the Spirit Terrace, leaving traces on rivers and lakes—wind and rain urgent yet the tone never breaks, frost and snow fallen yet the hue never stains—such is the sage\'s plain friendship, once in ten thousand ages.',
  ],
  s0217: [
    'When the age turned corrupt and the people went astray, trickery and fraud rose like a gale; ravines and valleys could not hold back its peril, ghosts and spirits could not trace its shifts; all raced after feather-light gain and hurried to the knife\'s edge.',
    'When the age turned corrupt, trickery rose like a gale; ravines could not hold its peril, spirits could not trace its shifts; all raced after feather-light gain and hurried to the knife\'s edge.',
  ],
  s0218: [
    'Then plain friendship perished and profit friendship arose; under heaven all seethed, birds startled and thunder crashed.',
    'Then plain friendship died and profit friendship rose; the world seethed—birds startled, thunder crashed.',
  ],
  s0219: [
    'Yet profit friendship shares one source while its branches differ; compared in outline, there are five arts:',
    'Yet profit friendship shares one source with differing streams; in outline, five arts:',
  ],
  s0220: [
    '"Consider those who enjoy favor like Dong Xian and Shi Chong, whose power presses down Liang Ji and the Dou clan.',
    '"Consider those who enjoy favor like Dong Xian and Shi Chong, whose power crushes Liang Ji and the Dou clan.',
  ],
  s0221: [
    'They carve the hundred crafts, smelt the ten thousand things; exhaling they raise cloud and rain, inhaling they send down frost and dew; the nine regions shudder at their dust, the four seas pile their scorch.',
    'They carve the hundred crafts, smelt ten thousand things; breath out cloud and rain, breath in frost and dew; the nine regions shudder at their dust, the four seas pile their scorch.',
  ],
  s0222: [
    'None fail to gaze at their star and run, borrow their echo and flock like geese on the stream; at the cock\'s first cry crane-canopies mass into shade, high gates open at dawn, flowing carriages link hub to hub.',
    'All gaze at their star and run, borrow their echo and flock like stream geese; at the cock\'s first cry crane-canopies mass into shade, high gates open at dawn, carriages link hub to hub.',
  ],
  s0223: [
    'All wish to grind the crown to the heel, crush the gall and draw the gut, pledge with Yao Li to burn wife and children, vow with Jing Ke to drown seven clans.',
    'All would grind crown to heel, crush gall and draw gut, pledge with Yao Li to burn wife and children, vow with Jing Ke to drown seven clans.',
  ],
  s0224: [
    'This is power friendship—its current is the first.',
    'This is power friendship—the first current.',
  ],
  s0225: [
    '"Wealth rivals Tao Zhugong and Bai Gui, assets exceed Cheng and Luo; mountains hold copper mines, houses hide gold pits; leaving the plain they link horses, dwelling in the lane they ring bells.',
    '"Wealth rivals Tao Zhugong and Bai Gui, assets exceed Cheng and Luo; mountains hold copper mines, houses hide gold pits; leaving the plain they link horses, in the lane they ring bells.',
  ],
  s0226: [
    'Then poor-lane guests and hemp-door scholars hope for the night candle\'s last gleam, beg the dripping-house\'s slight favor; fish strung, ducks hopping, rustling and scaling in heaps, they share the wild goose\'s grain and dip from the jade goblet\'s lees.',
    'Then poor-lane guests and hemp-door scholars hope for the night candle\'s last gleam, beg the dripping-house\'s slight favor; they string in like fish, hop like ducks, rustling in heaps, share the goose\'s grain, dip from the jade goblet\'s lees.',
  ],
  s0227: [
    'They bear favor received, advance earnest regard, offer the green pine to show the heart, point to white water to display faith.',
    'They bear favor, advance earnest regard, offer green pine to show the heart, point to white water to display faith.',
  ],
  s0228: [
    'This is bribe friendship—its current is the second.',
    'This is bribe friendship—the second current.',
  ],
  s0229: [
    '"Grand Master Lu feasted in the western capital; Guo the Worthy ranked men in the eastern state; dukes and ministers prized his great fame, gentry envied his ascent to immortals.',
    '"Grand Master Lu feasted in the western capital; Guo the Worthy ranked men in the eastern state; nobles prized his fame, gentry envied his ascent among immortals.',
  ],
  s0230: [
    'Add a drawn chin and knitted brow, tears and spittle in foam, galloping yellow horses in fierce debate, loosing green cocks in bold argument—speak of warmth and the cold valley turns mild; speak of stern drought and spring thickets shed leaves; rise or fall follows a glance, glory or shame hangs on one word.',
    'Add drawn chin and knitted brow, tears and spittle flying, fierce debate on yellow horses, bold argument on green cocks—speak of warmth and the cold valley turns mild; speak of drought and spring thickets shed leaves; rise or fall follows a glance, glory or shame on one word.',
  ],
  s0231: [
    'Then young lords in silk caps and brocade-clad heirs, whose Way never snags on the accomplished, whose voice never rings strong in the cloud pavilion, climb their scales and wings, beg their spare discourse, cling to the qiji\'s mane-tip, outpace the homing goose at Jieshi.',
    'Then young lords in silk caps and brocade heirs whose Way never snags on the accomplished, whose voice never rings in the cloud pavilion, climb their scales and wings, beg spare discourse, cling to the qiji\'s mane-tip, outpace the homing goose at Jieshi.',
  ],
  s0232: [
    'This is talk friendship—its current is the third.',
    'This is talk friendship—the third current.',
  ],
  s0233: [
    '"Yang ease and yin grim are the great feelings of the living folk; sorrow joined and joy parted are the constant nature of things.',
    '"Yang ease and yin grim are the great feelings of living folk; sorrow joined and joy parted are things\' constant nature.',
  ],
  s0234: [
    'So fish bubble when the spring dries, birds mourn as death nears.',
    'Fish bubble when the spring dries; birds mourn as death nears.',
  ],
  s0235: [
    'Those who share affliction pity one another, stringing the river-bank\'s mournful tune;',
    'Those who share affliction pity one another, stringing the river-bank\'s mournful tune;',
  ],
  s0236: [
    'fear placed in the breast displays the Gu Feng ode\'s grand ceremony.',
    'fear placed in the breast displays the Gu Feng ode\'s grand ceremony.',
  ],
  s0237: [
    'Thus broken gold comes from narrow straits, and severed necks rise from thatched mourning.',
    'Thus broken gold comes from narrow straits; severed necks rise from thatched mourning.',
  ],
  s0238: [
    'So Wu Yuan was washed by Zai Pi, Zhang and Wang spread wings at Chen\'s minister.',
    'So Wu Yuan was washed by Zai Pi; Zhang and Wang spread wings at Chen\'s minister.',
  ],
  s0239: [
    'This is destitution friendship—its current is the fourth.',
    'This is destitution friendship—the fourth current.',
  ],
  s0240: [
    '"In the rushing-grouse age, the thin and shallow sort, none fails to hold the balance-scale and grasp the gossamer.',
    '"In the rushing-grouse age, the thin and shallow sort—none fails to hold the balance-scale and grasp gossamer.',
  ],
  s0241: [
    'The scale weighs their heaviness and lightness; the gossamer tests their breath.',
    'The scale weighs heaviness and lightness; the gossamer tests their breath.',
  ],
  s0242: [
    'If the scale cannot lift and the gossamer cannot fly, though Yan and Ran had dragon sinews and phoenix pinions, Zeng and Shi orchid scent and snow-white, Shu and Xiang jade and gold, Yuan and Yun abyss-sea, He and Han brocade and Milky Way—they are seen as wandering dust.',
    'If the scale cannot lift and the gossamer cannot fly, though Yan and Ran had dragon sinews and phoenix pinions, Zeng and Shi orchid scent and snow-white, Shu and Xiang jade and gold, Yuan and Yun abyss-sea, He and Han brocade and Milky Way—they are wandering dust.',
  ],
  s0243: [
    'Met as clay puppets, none will spend half a bean; rarely does one lose a single hair.',
    'Met as clay puppets, none spends half a bean; rarely does one lose a single hair.',
  ],
  s0244: [
    'If the scale weighs heavy as a cash-weight and the gossamer stirs the slightest breath, though Gong Gong\'s search for evil, Huan Dou\'s masking of righteousness, the southern Jing\'s arrogance, the eastern mound\'s great knavery—all crawl and writhe, break branches and lick hemorrhoids; gold paste and kingfisher plumes suit their intent, grease and rush smooth the way to their sincerity.',
    'If the scale weighs heavy as a cash-weight and the gossamer stirs the slightest breath, though Gong Gong\'s evil, Huan Dou\'s masked righteousness, southern Jing\'s arrogance, eastern mound\'s great knavery—all crawl and writhe, break branches and lick hemorrhoids; gold paste and kingfisher plumes suit their intent, grease and rush smooth their sincerity.',
  ],
  s0245: [
    'Thus wherever carriage wheels travel, it cannot be Bo Yi and Hui Shi\'s house;',
    'Thus wherever carriage wheels travel, it is not Bo Yi and Hui Shi\'s house;',
  ],
  s0246: [
    'wherever bribes enter, it is truly Zhang and Huo\'s home.',
    'wherever bribes enter, it is truly Zhang and Huo\'s home.',
  ],
  s0247: [
    'They plot before they act; not a hair\'s error.',
    'They plot before they act—not a hair\'s error.',
  ],
  s0248: [
    'This is measure friendship—its current is the fifth.',
    'This is measure friendship—the fifth current.',
  ],
  s0249: [
    '"All these five friendships share the righteousness of buying and selling; thus Huan Tan compared them to the market stall, Lin Hui to sweet wine.',
    '"All five friendships share the righteousness of buying and selling; Huan Tan compared them to the market stall, Lin Hui to sweet wine.',
  ],
  s0250: [
    'Cold and heat advance in turn, flourishing and decline succeed each other; some glory first then wither, some rich at first then poor, some whole at first then perish, some austere in old days and opulent now—turning in cycles, swift as waves.',
    'Cold and heat advance in turn, flourishing and decline succeed; some glory first then wither, some rich then poor, some whole then perish, some austere once and opulent now—turning in cycles, swift as waves.',
  ],
  s0251: [
    'Thus the feeling that runs after profit has never differed, yet the Way of change cannot be one.',
    'Thus the feeling that runs after profit never differs, yet the Way of change cannot be one.',
  ],
  s0252: [
    'Viewed thus, why Zhang and Chen met violent ends, why Xiao and Zhu found rifts at the close—it can be known at a glance.',
    'Viewed thus, why Zhang and Chen met violent ends, why Xiao and Zhu found rifts at the close—clear at a glance.',
  ],
  s0253: [
    'Yet Duke Zhai stood primly at his gate to admonish guests—how late his sight!',
    'Yet Duke Zhai stood primly at his gate to admonish guests—how late his sight!',
  ],
  s0254: [
    '"Yet from these five friendships three faults arise: ruining virtue and extinguishing righteousness, beasts matching beasts—the first fault;',
    '"Yet from these five friendships three faults arise: ruining virtue and extinguishing righteousness, beasts matching beasts—the first fault;',
  ],
  s0255: [
    'hard to bind, easy to break, quarrels and lawsuits gather—the second fault;',
    'hard to bind, easy to break, quarrels and lawsuits gather—the second fault;',
  ],
  s0256: [
    'name fallen to gluttony, integrity shamed—the third fault.',
    'name fallen to gluttony, integrity shamed—the third fault.',
  ],
  s0257: [
    'The ancients knew the three faults were obstruction and feared the five friendships\' swift blame.',
    'The ancients knew the three faults obstructed and feared the five friendships\' swift blame.',
  ],
  s0258: [
    'Thus Wang Dan chastised his son with the mulberry rod; Zhu Mu spoke plainly to show severance—how apt!',
    'Thus Wang Dan chastised his son with the mulberry rod; Zhu Mu spoke plainly to show severance—how apt!',
  ],
  s0259: [
    '"In recent times there was Ren Fang of Le\'an, a crest of the realm, who early bound the silver seal and long drew the people\'s praise.',
    '"In recent times Ren Fang of Le\'an, a crest of the realm, early bound the silver seal and long drew the people\'s praise.',
  ],
  s0260: [
    'His forceful prose and gorgeous pattern rivaled Cao and Wang;',
    'His forceful prose and gorgeous pattern rivaled Cao and Wang;',
  ],
  s0261: [
    'outstanding and far-reaching, he matched Xu and Guo in the scales.',
    'outstanding and far-reaching, he matched Xu and Guo in the scales.',
  ],
  s0262: [
    'Like Lord Mengchang he loved guests, like Zheng Zhuang he delighted in the worthy.',
    'Like Lord Mengchang he loved guests; like Zheng Zhuang he delighted in the worthy.',
  ],
  s0263: [
    'See one good deed and he threw back his head and clenched his wrist; meet one talent and he arched his brow and clapped his palm.',
    'See one good deed and he threw back his head and clenched his wrist; meet one talent and he arched his brow and clapped his palm.',
  ],
  s0264: [
    'Orpiment and cinnabar came from his lips; scarlet and purple from his monthly rating.',
    'Orpiment and cinnabar came from his lips; scarlet and purple from his monthly rating.',
  ],
  s0265: [
    'Then carriage canopies converged like wheel spokes, robes clouded together, curtained coaches clattered at the hubs, and seated guests were always full.',
    'Carriage canopies converged like wheel spokes, robes clouded together, curtained coaches clattered at the hubs, seated guests always full.',
  ],
  s0266: [
    'Tread his threshold as if ascending the Hall of the Confucian temple;',
    'Tread his threshold as if ascending the Hall of the Confucian temple;',
  ],
  s0267: [
    'enter his inner chambers as if climbing the Dragon Gate\'s slope.',
    'enter his inner chambers as if climbing the Dragon Gate\'s slope.',
  ],
  s0268: [
    'A single glance from him doubled a man\'s worth; a stroke along the mane made the horse cry out into the long wind. Ribbons from the cloud platform crowded shoulder to shoulder; runners on the cinnabar steps left their tracks in layers.',
    'One glance from him doubled a man\'s worth; one comb-stroke along the mane made the horse cry long. Cloud-platform ribbons pressed shoulder to shoulder; runners on the cinnabar steps left tracks in layers.',
  ],
  s0269: [
    'None failed to bind favor close, knot intimacy tight—dreaming of Hui Shi and Zhuang Zhou\'s clear dust, reaching for Yang and Zuo\'s bright merit.',
    'All bound favor close and knotted intimacy tight—dreaming of Hui Shi and Zhuang Zhou\'s clear dust, reaching for Yang and Zuo\'s bright merit.',
  ],
  s0270: [
    'Then his eyes closed in eastern Yue and his bones went home to the Luo ford; the mourning curtain still hung, yet at the gate scarcely a worthy soul came to steep the wine.',
    'Then his eyes closed in eastern Yue and his bones went home to the Luo ford; the mourning curtain still hung, yet scarcely a worthy soul came to steep the gate in wine.',
  ],
  s0271: [
    'The mound had not yet taken last year\'s grass; in the wild, no guest turned the carriage wheels.',
    'The mound had not yet taken last year\'s grass; in the wild, no guest turned carriage wheels.',
  ],
  s0272: [
    'How slight those orphans were—morning without a plan for evening, cast adrift to the great sea\'s south, their lives entrusted to the land of miasma.',
    'How slight those orphans—morning without a plan for evening, cast adrift to the great sea\'s south, lives entrusted to the land of miasma.',
  ],
  s0273: [
    'Of all those arm-clasping heroes, those gold-and-orchid friends of old—not one wept Yangshe Xi\'s tears below the bier; who now would divide a house as Zou did for Cheng\'s orphans?',
    'Of all those arm-clasping heroes, those gold-and-orchid friends—not one wept Yangshe Xi\'s tears below the bier; who would divide a house as Zou did for Cheng\'s orphans?',
  ],
  s0274: [
    'Alas!',
    'Alas!',
  ],
  s0275: [
    'The world\'s road is perilous—even to this!',
    'The world\'s road is perilous—even to this!',
  ],
  s0276: [
    'Mount Taihang, Meng Gate—are they not called sheer?',
    'Mount Taihang, Meng Gate—are they not called sheer?',
  ],
  s0277: [
    'Therefore the upright man hates it so, tears his robe to bind his feet, and casts it off on the long road,',
    'Therefore the upright man hates it so, tears his robe to bind his feet, and casts it off on the long road,',
  ],
  s0278: [
    'stands alone on the high mountain\'s crown, takes joy in sharing a flock with deer, and in brightness severs the murky haze—he is ashamed of it; he is afraid of it."',
    'stands alone on the high mountain\'s crown, takes joy in sharing a flock with deer, and in brightness severs the murky haze—he is ashamed of it; he is afraid of it."',
  ],
  s0279: [
    'Fang compiled Miscellaneous Biographies in two hundred forty-seven scrolls, Gazetteer of Lands in two hundred fifty-two scrolls, and literary works in thirty-three scrolls.',
    'Fang compiled Miscellaneous Biographies in 247 scrolls, Gazetteer of Lands in 252 scrolls, and literary works in 33 scrolls.',
  ],
  s0280: [
    'Fang\'s fourth son Dongli had much of his father\'s manner and reached office as Secretariat Master of External Troops.',
    'Fang\'s fourth son Dongli had much of his father\'s manner and reached office as Secretariat Master of External Troops.',
  ],
  s0281: [
    'Chen Minister of Personnel Yao Cha said: Considering how the two Han sought the worthy, they put classical learning first;',
    'Chen Minister of Personnel Yao Cha said: In the two Han they sought the worthy and put classical learning first;',
  ],
  s0282: [
    'in recent times men were taken mostly through letters and histories.',
    'in recent times men were taken mostly through letters and histories.',
  ],
  s0283: [
    'The two men\'s works are gorgeously ornate—truly they matched their time.',
    'The two men\'s works are gorgeously ornate—truly they matched their time.',
  ],
  s0284: [
    'Yan could hold stillness within; Fang kept inner conduct—they both ended in name and rank from start to finish, as they should.',
    'Yan could hold stillness within; Fang kept inner conduct—both ended in name and rank from start to finish, as they should.',
  ],
  s0285: [
    'Had Jiang not been foreknowing and Ren not held old favor, then high rank and splendid gifts at the end would not have come about.',
    'Had Jiang not been foreknowing and Ren not held old favor, high rank and splendid gifts at the end would not have come about.',
  ],
  s0286: [
    '[1] Editorial footnote marker in the source text.',
    '[1] Editorial footnote marker.',
  ],
  s0287: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_014_b3.mjs <translation.json>'
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
