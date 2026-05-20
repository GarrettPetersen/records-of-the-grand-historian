#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'Each time they condemn emptiness yet demand substance, all point at what is hard and call it easy.',
    'Again and again they rail at the void and hunt for substance, calling every hardship easy.',
  ],
  s0302: [
    'Not content with themselves yet seeking fullness, together they blame things for raising burdens.',
    'Unsatisfied in themselves yet greedy for more, they heap blame on things and call it burden.',
  ],
  s0303: [
    'What past gentlemen were lost in is what I now avoid.',
    'The maze that trapped men of old is the path I turn from today.',
  ],
  s0304: [
    'I trace to where the Divine Farmer first began, inquire into the cloud-origins of sowing.',
    'I reach back to where the Divine Farmer began and ask how the first seeding rose from cloud.',
  ],
  s0305: [
    'When raw flesh turned to grain for food—that was what human life stored up.',
    'When blood and raw meat became grain—that was the storehouse of human life.',
  ],
  s0306: [
    'I seek the old records of the well-field, examine the front books on field paths.',
    'I follow the well-field in old annals and read the former texts on field and path.',
  ],
  s0307: [
    'Yan Hui had a bamboo basket yet joy remained; Zheng\'s high granaries stood empty.',
    'Yan Hui ate from a bamboo basket and was glad; Zheng filled the high granary and still stood empty.',
  ],
  s0308: [
    'A whole district\'s four hundred was not enough; fifty per mu yet had surplus.',
    'Four hundred for the district was too little; fifty per mu still left plenty.',
  ],
  s0309: [
    'I stroke my hidden heart and brood cramped, fortunate to be fed from the courtyard\'s thatched shelters.',
    'I press a cramped sorrow in my breast, glad to be fed from the thatch by the yard.',
  ],
  s0310: [
    'I warp the eastern furrow\'s old plough, soak the northern field\'s new ditch.',
    'I set the eastern furrow\'s old plough, flood the northern field\'s new channel.',
  ],
  s0311: [
    'No lifting the cooking pot at dawn bedding, no cradling hunger at morning greens.',
    'No pot lifted at dawn on the rush mat, no hunger nursed over the morning greens.',
  ],
  s0312: [
    'I cast off outer things to align my letting-go, alone the burden rests on me.',
    'I cast outer things aside to match my release—only on me does the burden lie.',
  ],
  s0313: [
    'Why envy a thousand stores heaped high? I do not envy the fields of Wenyang.',
    'Why envy barns stacked a thousand deep? I do not covet Wenyang\'s fields.',
  ],
  s0314: [
    'I gaze toward the southeast domain and let my eyes run free, then turn to the mound-tombs and let my glance stream on.',
    'I look to the southeast and let the eye run free, then to the mound-tombs and let the gaze pour on.',
  ],
  s0315: [
    'Though this hill is but a low mound, it was where Wen Jing feasted.',
    'This hill is only a low mound—yet Wen Jing once feasted here.',
  ],
  s0316: [
    'I drive the four chestnuts\' rise and fall; clear panpipes answer with bright turns.',
    'Four chestnuts rise and fall beneath the whip; clear panpipes answer in bright turns.',
  ],
  s0317: [
    'Round and square vessels spread in brocade confusion; sea and land are exhausted in joint offering.',
    'Round and square dishes tangle like brocade; sea and land are drained in one offering.',
  ],
  s0318: [
    'How could one shaft\'s splendor suffice? A thousand gold seems but a thread.',
    'How could one beam\'s grandeur suffice? A thousand in gold is thin as thread.',
  ],
  s0319: [
    'I try to press my breast and speak: can such a wind be fanned?',
    'I press my breast and try to speak—can such a wind be stirred?',
  ],
  s0320: [
    'It will reach the far intent of the penetrating man—not a vulgar sentiment\'s sight.',
    'It reaches the far intent of the penetrating man—not what vulgar feeling sees.',
  ],
  s0321: [
    'For a moment I shift my heart and turn my gaze, discerning the square hillock at the returning ford.',
    'For a moment I shift heart and turn my gaze, and know the square hill at the returning ford.',
  ],
  s0322: [
    'A belt of level sand at Cassia Ford, first raising the spade in mighty Qin.',
    'Level sand belts Cassia Ford; the spade was first raised in mighty Qin.',
  ],
  s0323: [
    'The road winds through Wu and knocks at Yue; the track skirts the sea and threads through Min.',
    'The road coils through Wu and knocks at Yue; the track skirts the sea and threads Min.',
  ],
  s0324: [
    'I embrace the three birds in long remembrance—how precious the old homeland is!',
    'I hold the three birds in long remembrance—how dear the old country is!',
  ],
  s0325: [
    'Truly my hope rests on the year\'s late span; I have not missed the step at spring\'s prime.',
    'Truly my hope waits on the year\'s late span; I have not missed the step in spring\'s prime.',
  ],
  s0326: [
    'Why does the eastern stream flow so wide—only I shed tears for our men?',
    'Why does the eastern stream run so wide—only I weep for our men?',
  ],
  s0327: [
    'Wrongly I was judged worthy beside the worthies of old ages, hastening to roam at this place.',
    'Wrongly I was ranked among the worthies of old, hurrying to roam at this place.',
  ],
  s0328: [
    'I attended the feathered banners and matched their pace, accompanied the dragon boats along the islets.',
    'I waited on feathered banners and matched their pace, followed dragon boats along the islets.',
  ],
  s0329: [
    'Sometimes we took ranks and composed verse; sometimes we passed cups and feasted in talk.',
    'Sometimes we took rank and wrote verse; sometimes we passed cups and feasted in talk.',
  ],
  s0330: [
    'The coloured curtain—one morning turned dusk-dark; the western mounds suddenly grew thick with scrub.',
    'The coloured curtain—one morning went dark; the western mounds suddenly choked with scrub.',
  ],
  s0331: [
    'I gaze at the autumn gale and sigh without end, each time finding joy in this view.',
    'I gaze at the autumn gale and sigh without end, yet each time find joy in this view.',
  ],
  s0332: [
    'At first bells and stones chimed bright; at last fish and dragons surged in waves.',
    'First bells and stones rang clear; in the end fish and dragons rolled in waves.',
  ],
  s0333: [
    'Some rose and fell in order; some drained their cups beyond counting.',
    'Some rose and fell in order; some drained cups beyond counting.',
  ],
  s0334: [
    'Noble were Bing Ji, Wei Xiang, Xiao He, and Cao Shen; intimate were the Duke of Zhou and Liang Wu.',
    'Noble were Bing Ji, Wei Xiang, Xiao He, and Cao Shen; close were the Duke of Zhou and Liang Wu.',
  ],
  s0335: [
    'None failed to rest with the frost-mist and perish, to scatter with wind and cloud.',
    'None failed to lie down with frost-mist and perish, to scatter with wind and cloud.',
  ],
  s0336: [
    'I look upon the tomb-fields of Sun\'s empress; I seek the martial traces of a hegemon\'s pride.',
    'I look on the tomb-fields of Sun\'s empress and seek a hegemon\'s martial traces.',
  ],
  s0337: [
    'Truly he succeeded the kings after Han, trusted as the heroic lord who opened Wu.',
    'Truly he followed Han\'s later kings, trusted as the heroic lord who opened Wu.',
  ],
  s0338: [
    'He made Heng Mountain his barrier, wrapped the Yangtze and Han as his domain.',
    'He set Heng Mountain as his barrier and wrapped Yangtze and Han as his realm.',
  ],
  s0339: [
    'Only to summon words from a stone coffin, and thereby prolong disaster through gold threads.',
    'Only to summon words from a stone coffin—and so prolong disaster through gold threads.',
  ],
  s0340: [
    'Suddenly overgrown, untended—together with Yuanling\'s stretching mounds.',
    'Suddenly overgrown and untended—like Yuanling\'s stretching mounds.',
  ],
  s0341: [
    'Who knew that ants and fox-rabbits matter no more than woodcutters and shepherd boys?',
    'Who knew ants and fox-rabbits matter no more than woodcutters and shepherd boys?',
  ],
  s0342: [
    'I gaze at the eastern hill-crest and let my eyes drift—the heart grieves and will not ease.',
    'I gaze at the eastern hill-crest and let the eyes drift—the heart grieves and will not ease.',
  ],
  s0343: [
    'This was once the old park of the heir\'s storehouse, truly the remnant base of Bo Wang.',
    'This was once the heir\'s old park, truly Bo Wang\'s remnant base.',
  ],
  s0344: [
    'The trim groves were marked out with cassia trees; the ordered grasses crowned with fragrant orchids.',
    'Trim groves were marked with cassia; ordered grasses crowned with fragrant orchids.',
  ],
  s0345: [
    'Wind terraces piled wings; moon pavilions doubled rafters.',
    'Wind terraces piled wing on wing; moon pavilions doubled rafters.',
  ],
  s0346: [
    'A thousand pillars thrust swift; a hundred brackets braced each other.',
    'A thousand pillars shot up sharp; a hundred brackets locked together.',
  ],
  s0347: [
    'Dark carriage shafts lined the forest; orchid oars played on the waters.',
    'Dark shafts lined the woods; orchid oars sported on the water.',
  ],
  s0348: [
    'More than three years since affairs passed; suddenly two cycles have spanned to now.',
    'More than three years since affairs passed; suddenly two cycles have reached to now.',
  ],
  s0349: [
    'All was levelled and washed by flood and sweep—not a different age from ancient to present.',
    'All was levelled and washed by flood and sweep—not a different age from then to now.',
  ],
  s0350: [
    'I turn my eyes to the northeast domain, beholding the high lodge on this ridge.',
    'I turn my eyes to the northeast and behold the high lodge on this ridge.',
  ],
  s0351: [
    'Though merged into completion without a trace, truly the bequeathed teaching can be held.',
    'Though he merged into the whole and left no trace, his handed-down teaching can still be grasped.',
  ],
  s0352: [
    'At first he ate cloud-mist and spat fog; at last he crossed the void and cast reflections downward.',
    'At first he ate cloud-mist and spat fog; at last he crossed the void and cast reflections down.',
  ],
  s0353: [
    'He drove the rainbow-hued female serpent in rolling coils, floated on the heavenly river\'s long reach.',
    'He drove the rainbow serpent in rolling coils and floated on the heavenly river\'s long reach.',
  ],
  s0354: [
    'He pointed at Marsh Pool for one rest, gazed toward Jewelled Terrace and sped high—not flattering himself with boastful words, hoping the divine method might be sought.',
    'He pointed at Marsh Pool for one rest, gazed at Jewelled Terrace and sped high—not boasting, hoping the divine method might be sought.',
  ],
  s0355: [
    'Only Bell Crag\'s hidden mass, manifesting the imperial capital as loftiness—surely where the sacrifice-altars look, holding wind and cloud and breathing moisture.',
    'Only Bell Crag\'s hidden mass, showing the imperial capital as loftiness—where altars look, holding wind and cloud and breathing moisture.',
  ],
  s0356: [
    'As to its form: towering and clasping in grandeur, tall branches brushing the sun;',
    'As to its form: towering, clasping in grandeur, tall branches brushing the sun;',
  ],
  s0357: [
    'lofty, perilous peaks and hanging crags, fallen stones piled like stars.',
    'lofty perilous peaks and hanging crags, fallen stones piled like stars.',
  ],
  s0358: [
    'Peak on peak, jagged and steep, now hollow now flat;',
    'Peak on peak, jagged and steep, now hollow, now flat;',
  ],
  s0359: [
    'coiled solid, pillowing recumbent, strange shapes and different forms.',
    'coiled hard, laid recumbent, strange shapes and alien forms.',
  ],
  s0360: [
    'Lone crags thrust crosswise, caves and holes slanting through;',
    'Lone crags jut crosswise; caves and holes cut slanting through;',
  ],
  s0361: [
    'a thousand zhang, ten thousand ren, three layers and nine terraces.',
    'a thousand zhang high, ten thousand ren deep, three tiers and nine stages.',
  ],
  s0362: [
    'Stretching round about the district towns, spanning across suburbs and fields;',
    'Stretching round district towns, spanning suburbs and fields;',
  ],
  s0363: [
    'plain mist belts the evening, white fog curls in morning.',
    'plain mist belts the dusk; white fog coils at dawn.',
  ],
  s0364: [
    'Close along them, one crag has a different hue; gazing far, a hundred peaks are all green.',
    'Near at hand each crag wears its own colour; far off, a hundred peaks share one green.',
  ],
  s0365: [
    'I view the tombs of two dynasties, behold the remnant mesh of their destruction.',
    'I view two dynasties\' tombs and behold the remnant mesh of their destruction.',
  ],
  s0366: [
    'Cheng was overturned by vicious eunuchs; Kang held his lapels before an empty throne;',
    'Cheng fell to vicious eunuchs; Kang smoothed his lapels before an empty throne;',
  ],
  s0367: [
    'Mu Gongyi was courteous already in the rocky gallery; Jian loosened his heart in the dark stalls;',
    'Mu Gongyi was courteous in the rocky gallery; Jian loosened his heart in the dark stalls;',
  ],
  s0368: [
    'Lie drank to the limit and brought disaster; An forgot his cares and received bane.',
    'Lie drank past measure and drew disaster; An laid down care and drew harm.',
  ],
  s0369: [
    'How extraordinary the ancestral founders—might spanning heaven, dominance over earth.',
    'What men were those founding ancestors—power across heaven, rule across earth.',
  ],
  s0370: [
    'Only the sage Wen continued the martial—perhaps great peace could be attained.',
    'Only sage Wen carried on the martial work—perhaps true peace could come.',
  ],
  s0371: [
    'For generations my clan\'s virtue has ruled them; I look up at the ancestral tombs and veil my tears.',
    'For generations my clan\'s virtue has ruled them; I look up at ancestral tombs and veil my tears.',
  ],
  s0372: [
    'The spirit palaces are not one; the numinous lodges stand apart.',
    'Spirit halls are many, not one; numinous lodges face each other across distance.',
  ],
  s0373: [
    'Mats spread with reddish calves; halls flow with cassia wine.',
    'Mats spread for ruddy calves; halls stream with cassia wine.',
  ],
  s0374: [
    'Purple Emperor descends at the heavenly gate; the two Xiang ladies are summoned at Xiang Ford.',
    'Purple Emperor comes down at the heavenly gate; the two Xiang consorts are called at Xiang Ford.',
  ],
  s0375: [
    'Orchid smoke floats on cassia beams; Wu Yang is called to southern Chu.',
    'Orchid smoke drifts on cassia beams; Wu Yang is summoned to southern Chu.',
  ],
  s0376: [
    'Jade sounding-sticks are raised; peppered millet is grasped.',
    'Jade clappers lift; peppered millet is taken in hand.',
  ],
  s0377: [
    'As if chanting to the wind in vast song, breaking cassia grass and lingering long.',
    'As though singing vast songs into the wind, breaking cassia grass and standing long.',
  ],
  s0378: [
    'Reverently—the void road is remote; divine tracks stretch far.',
    'In reverence—the void road is far; the divine trace stretches farther still.',
  ],
  s0379: [
    'I think how startling is the gale; life is still foam clustered.',
    'I think how sharp the sudden gale is; living is still clustered foam.',
  ],
  s0380: [
    'Return the subtle carriage to one vehicle; open the dark door on three roads.',
    'Bring the subtle carriage back to one conveyance; open the dark gate on three paths.',
  ],
  s0381: [
    'If you wish to calm the heart and shed burdens, you must leave the crowd—only then is it open.',
    'To quiet the heart and cast off burdens, you must turn from the crowd—only then does it clear.',
  ],
  s0382: [
    'Some knot a thatched hut at the rock\'s root, some open a lattice window at the tree\'s crown.',
    'Some tie a thatched hut to the rock\'s foot, some open a lattice window in the tree\'s crown.',
  ],
  s0383: [
    'The room is dim with creeping vines; the eaves trail pine and cypress.',
    'The room dims with creeping vines; pine and cypress trail from the eaves.',
  ],
  s0384: [
    'Having gained principle in mutual leaving behind, firmly forgetting hunger and thirst.',
    'Once principle came through mutual release, hunger and thirst were firmly forgotten.',
  ],
  s0385: [
    'Some clamber branches alone into distance; some tread clouds in high steps.',
    'Some climb branches alone into the far; some walk clouds in high steps.',
  ],
  s0386: [
    'By thatching huts they make a name; still, gazing at emptiness they take a title.',
    'They make a name by thatching huts; still they take a title by gazing at emptiness.',
  ],
  s0387: [
    'On this day one may forget oneself—who could expect the heart\'s return in time to come?',
    'Today one may forget the self—who could expect the heart\'s return in days to come?',
  ],
  s0388: [
    'Heaven lent me great virtue, bearing this gift without boundary.',
    'Heaven lent me great virtue and loaded me with a gift without boundary.',
  ],
  s0389: [
    'I received the old gentleman\'s fine praise, and banquet rites were conferred at the upper school.',
    'I took the old gentleman\'s fine praise, and banquet rites were set at the upper school.',
  ],
  s0390: [
    'I have not the fine substance of a thousand-li steed, nor the fair prospect of a jade sceptre.',
    'I lack the thousand-li steed\'s fine substance and the jade sceptre\'s fair prospect.',
  ],
  s0391: [
    'I invite the former grace of the old lord, again receiving unfit robes from today\'s emperor.',
    'I call back the old lord\'s former grace, yet again take unfit robes from today\'s emperor.',
  ],
  s0392: [
    'I look up at the flourishing rule of honouring the aged, asking that this slight frame rest in the setting sun.',
    'I look up at the flourishing rule that honours age and ask this slight frame to rest in the setting sun.',
  ],
  s0393: [
    'Though toiling at the ministry gate I gained dismissal, still I held office in the spring palace.',
    'Though I toiled at the ministry gate and won dismissal, I still held office in the spring palace.',
  ],
  s0394: [
    'Then words turned toward my humble dwelling; for a time I had leisure days to soar.',
    'Then speech turned toward my humble house; for a while I had leisure days to wander.',
  ],
  s0395: [
    'My will nests in the pure land; my heart returns to the dharma field.',
    'My will nests in the pure land; my heart goes home to the dharma field.',
  ],
  s0396: [
    'Beasts crouch by the terrace and do not startle; fish fill the pool yet nets are not cast.',
    'Beasts crouch by the terrace unstartled; fish fill the pool and no net is cast.',
  ],
  s0397: [
    'I turn back on the lost track of departing wheel-ruts, fix deep thought on the light of setting forth.',
    'I turn from the lost track of departing ruts and fix deep thought on the light of going forth.',
  ],
  s0398: [
    'Late trees open with flowers; first blossoms drop their pistils.',
    'Late trees break into flower; first blossoms shed their pistils.',
  ],
  s0399: [
    'Sometimes different groves split green and red; suddenly wind mixes scarlet and purple.',
    'Sometimes separate groves split green from red; suddenly wind mingles scarlet and purple.',
  ],
  s0400: [
    'Purple lotus blooms by night; red lotus opens at dawn.',
    'Purple lotus flowers at night; red lotus opens with dawn.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_013_b4.mjs <translation.json>'
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
