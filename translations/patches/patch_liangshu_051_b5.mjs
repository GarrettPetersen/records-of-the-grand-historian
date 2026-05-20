#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'In the ninth year of Tianjian the county magistrate Guan Huibian memorialized on his righteous conduct; Yangzhou inspector Prince Linchuan Hong sent a summons—he did not come.',
    'Tianjian year nine the magistrate Guan Huibian praised his conduct; Prince Linchuan of Yangzhou summoned him, and he stayed away.',
  ],
  s0402: [
    'In the tenth year the prince submitted a memorial recommending him; in the end he was never summoned.',
    'Year ten the prince recommended him in a memorial, but no summons ever came.',
  ],
  s0403: [
    'That year he died at home, aged seventy.',
    'He died at home that year, at seventy.',
  ],
  s0404: [
    'Liu Xu, courtesy name Yandu, was a man of Pingyuan.',
    'Liu Xu, styled Yandu, came from Pingyuan.',
  ],
  s0405: [
    'His father Lingzhen was Qi Administrator of Wuchang.',
    'His father Lingzhen had been Qi administrator of Wuchang.',
  ],
  s0406: [
    'From childhood Xu was famed for pure filial piety; when only a few years old his parents died in succession. In mourning he wept with a child\'s yearning, nearly destroying himself; all who came to condole were moved.',
    'As a boy he was famed for filial piety; his parents died in turn while he was still small, and his mourning weeping, childlike and desperate, nearly killed him and broke every visitor\'s heart.',
  ],
  s0407: [
    'Later he was raised by his father\'s elder brother; toward his uncle\'s wife and elder sisters his filial affection and brotherly love were so deep that the clan praised him.',
    'His uncle raised him; toward the uncle\'s wife and his elder sisters he showed such filial love that the clan spoke of him with praise.',
  ],
  s0408: [
    'Grieving his early orphanhood, when anyone carelessly touched a tabooed name he never failed to be overcome and weep.',
    'Still wounded by early orphanhood, he wept whenever someone blundered into a name he could not bear to hear.',
  ],
  s0409: [
    'His eldest brother Jie secured a wife for him and set the wedding day; Xu heard of it and fled into hiding, returning only when the affair had passed.',
    'His brother Jie arranged a bride and fixed the wedding day; Xu fled and hid until the plan collapsed.',
  ],
  s0410: [
    'The provincial inspector Zhang Ji summoned him as chief clerk; he would not accept.',
    'Provincial inspector Zhang Ji offered him chief clerk; he refused.',
  ],
  s0411: [
    'When the authorities issued a summons he hung the document on a tree and fled.',
    'When a summons arrived he nailed it to a tree and ran.',
  ],
  s0412: [
    'Xu was skilled in Dark Learning and especially versed in Buddhist scriptures.',
    'He excelled at Dark Learning and knew the Buddhist canon deeply.',
  ],
  s0413: [
    'Once with his clan elder Liu Shao he listened to lectures at monasteries on Mt Zhong, and together they cast lots to build on the east brook of Songxi Monastery, with the will to end their days there.',
    'With his kinsman Liu Shao he heard lectures on Mt Zhong and chose a site east of Songxi Monastery where both meant to live out their lives.',
  ],
  s0414: [
    'In the seventeenth year of Tianjian he died in Shao\'s house, aged thirty-one.',
    'Tianjian year seventeen he died in Shao\'s lodging, at thirty-one.',
  ],
  s0415: [
    'At the end he took Shao\'s hand and said: "When breath fails, wrap the body at once; when wrapping is done, bury immediately. Do not set up a spirit altar, do not offer funeral feasts, do not seek heirs."',
    'Dying, he gripped Shao\'s hand: "When I stop breathing, wrap me and bury me—no spirit altar, no funeral feast, no heirs."',
  ],
  s0416: [
    'Shao carried it out.',
    'Shao did exactly as he asked.',
  ],
  s0417: [
    'Clansmen and close friends together carved stone and set up an inscription; his posthumous title was Recluse of Mysterious Integrity.',
    'Kin and friends raised a stone inscription and gave him the posthumous name Recluse of Mysterious Integrity.',
  ],
  s0418: [
    'Liu Shao, courtesy name Shiguang, was Xu\'s clan elder.',
    'Liu Shao, styled Shiguang, was Xu\'s elder kinsman.',
  ],
  s0419: [
    'His grandfather Chenmin was Song Inspector of Jizhou;',
    'His grandfather Chenmin had been Song inspector of Jizhou;',
  ],
  s0420: [
    'his father Wenwei was Qi Regular Attendant.',
    'his father Wenwei, a Qi regular attendant.',
  ],
  s0421: [
    'For generations they had held two-thousand-bushel posts, all with a clean name.',
    'For generations the family had held two-thousand-bushel office, each man leaving a spotless name.',
  ],
  s0422: [
    'Shao from childhood had keen understanding; at four he lost his father. Among the boys he alone would not play.',
    'Clever from childhood, he lost his father at four and would not join the other boys at play.',
  ],
  s0423: [
    'At six he recited the *Analects* and *Mao Odes*; what he did not understand he could at once question.',
    'At six he knew the *Analects* and *Mao Odes* and pressed hard questions on whatever puzzled him.',
  ],
  s0424: [
    'At eleven he read the "Free and Easy Wandering" chapter of the *Zhuangzi* and said, "This can be explained."',
    'At eleven he read Zhuangzi\'s "Free and Easy Wandering" and said, "I can make sense of this."',
  ],
  s0425: [
    'A guest thereupon questioned him; he answered each question as it came, all with reason—and his family always marveled.',
    'Guests tested him; he answered every question with sense, and his family marveled each time.',
  ],
  s0426: [
    'When grown he was broadly learned and had literary talent; he neither married nor took office. With his cousin Xu he recluded to seek his aim, roaming forest and marsh and taking mountains, waters, books, and records for his only pleasure.',
    'Grown, he was learned and literary, never married, never served. With cousin Xu he withdrew to seek his purpose, roaming wild country and finding joy only in landscape and books.',
  ],
  s0427: [
    'He had long wished to leave the human world, but his mother was old and he could not bear to leave her; he always followed his brothers Ji and Yao in their official rounds.',
    'He yearned to leave the world yet could not abandon his aged mother and so often trailed his brothers Ji and Yao on their posts.',
  ],
  s0428: [
    'In youth he loved to give and strove to relieve others\' urgent need; if someone offered him something he never refused.',
    'Young, he loved giving and rushed to ease others\' distress; gifts offered him he never turned away.',
  ],
  s0429: [
    'After long years he sighed and said, "One who receives from others must repay; otherwise he owes them shame.',
    'In time he sighed: "To receive is to owe; without repayment one lives in debt to others.',
  ],
  s0430: [
    'I truly have no way to repay others—how can I always carry such shame?"',
    'I have nothing with which to repay—how can I bear perpetual shame?"',
  ],
  s0431: [
    'In the seventeenth year of Tianjian, without warning he composed the *Discourse on Changing the End*.',
    'Tianjian year seventeen he suddenly wrote the *Discourse on Changing the End*.',
  ],
  s0432: [
    'Its words run thus:',
    'It reads:',
  ],
  s0433: [
    'Matters of death and life the sages rarely speak of.',
    'On death and life the sages say little.',
  ],
  s0434: [
    'Confucius said: "The refined breath becomes things; the wandering soul becomes change—knowing the condition of ghosts and spirits, similar to Heaven and earth yet not opposing them."',
    'Confucius said, "Refined breath becomes things, the wandering soul becomes change—to know ghosts and spirits is to be like Heaven and earth and not oppose them."',
  ],
  s0435: [
    'His words are spare, his aim subtle, the matter hidden, the meaning deep—not to be cut off by guesswork or finely checked by reckoning; I venture my rash blindness and ask leave to try speech.',
    'The words are few, the aim subtle, the matter hidden, the meaning deep—no guesswork can sever it, no reckoning nail it down; forgive my rashness if I try to speak.',
  ],
  s0436: [
    'Form and thought unite and we call it life; soul-substance separates and we call it death;',
    'Form and thought unite—that is life; soul-substance parts—that is death;',
  ],
  s0437: [
    'united, movement rises; separated, stillness rests.',
    'united, the body stirs; parted, it falls still.',
  ],
  s0438: [
    'While it moves, all men know its spirit;',
    'While it moves, everyone knows the spirit is there;',
  ],
  s0439: [
    'when it is still, nothing measures where it tends.',
    'when still, nothing can measure where it goes.',
  ],
  s0440: [
    'What all know needs no words yet meaning shows; what none measures, the more one argues the finer reason grows dim.',
    'What all know needs no words; what none can measure grows dimmer the more one argues.',
  ],
  s0441: [
    'Therefore the achievements of Xun and Hua lie vast and unspoken; the Ji and Kong line suppressed and did not expound—worthies of old and sages of the past each bore a different view.',
    'So the deeds of Xun and Hua lie vast and unspoken; Ji and Kong held back—and sages of old disagreed.',
  ],
  s0442: [
    'Ji Zha said: "Flesh and bone return to earth; breath and soul go everywhere."',
    'Ji Zha said, "Flesh and bone return to earth; breath and soul go everywhere."',
  ],
  s0443: [
    'Zhuang Zhou said: "Life is corvée labor; death is rest."',
    'Zhuang Zhou said, "Life is forced labor; death is rest."',
  ],
  s0444: [
    'Seek these two sayings—they seem to oppose each other.',
    'Set the two sayings side by side—they seem to contradict.',
  ],
  s0445: [
    'How so?',
    'Why?',
  ],
  s0446: [
    '"Goes everywhere" means spirit exists;',
    '"Goes everywhere" admits spirit;',
  ],
  s0447: [
    '"Death is rest" means spirit does not.',
    '"Death is rest" denies spirit.',
  ],
  s0448: [
    'Yuan Xian said: "The Xia used bright vessels to show the people there was no knowing;',
    'Yuan Xian said, "Xia used bright vessels to show the people had no knowing;',
  ],
  s0449: [
    'the Yin used sacrificial vessels to show the people there was knowing;',
    'Yin used sacrificial vessels to show they had knowing;',
  ],
  s0450: [
    'the Zhou used both, to show the people doubt."',
    'Zhou used both, to leave the people in doubt."',
  ],
  s0451: [
    'Examining the records and testing former chronicles, the debate over being and non-being cannot be told in full.',
    'Records and chronicles show the debate over being and non-being cannot be told whole.',
  ],
  s0452: [
    'If one weighs the inner teaching and judges within the Buddha\'s fold, then the words of the masters can be traced and the rites of the three dynasties do not overstep.',
    'Weigh the inner teaching in the Buddha\'s fold and the masters\' words align while the three dynasties\' rites stay in bounds.',
  ],
  s0453: [
    'How so?',
    'Why?',
  ],
  s0454: [
    'Spirit is the root of life; form is life\'s equipment.',
    'Spirit is life\'s root; form is its gear.',
  ],
  s0455: [
    'The dead spirit leaves this equipment and is no longer that equipment.',
    'When we die the spirit leaves this gear and is no longer this gear.',
  ],
  s0456: [
    'Though the dead cannot return, spirit and soul in succession change and are never extinguished.',
    'The dead do not return, yet spirit and soul shift in turn and are never snuffed out.',
  ],
  s0457: [
    'At the day they leave this body, consciousness is vast and empty; therefore the Xia\'s bright vessels show they do not return.',
    'The day they leave the body, knowing is empty—so Xia bright vessels show no return.',
  ],
  s0458: [
    'At that other moment soul and spirit know extinction; therefore the Yin\'s sacrificial vessels show they still remain.',
    'Then soul and spirit know extinction—so Yin sacrificial vessels show they still remain.',
  ],
  s0459: [
    'If they do not remain, that agrees with Zhuang Zhou; if they remain, that agrees with Ji Zha—each holds one corner without harming the meaning.',
    'No remainder agrees with Zhuang Zhou; remainder with Ji Zha—each holds one corner, neither breaks the sense.',
  ],
  s0460: [
    'Suppose the reality: then there is also non-being; therefore the Zhou had the rite of using both, and the Master raised the song of the wandering soul—is it not so?',
    'Grant the reality and there is also non-being—hence Zhou\'s rite of both, and the Master\'s song of the wandering soul—is it not so?',
  ],
  s0461: [
    'If one sets aside partial, one-sided doctrines and probes the middle way\'s intent, then the reproach of being neither benevolent nor wise may here be stilled.',
    'Drop partial doctrines and take the middle way and the charge of lacking benevolence and wisdom can rest.',
  ],
  s0462: [
    'Form is the substance without knowing;',
    'Form is substance without knowing;',
  ],
  s0463: [
    'spirit is the nature with knowing.',
    'spirit is nature with knowing.',
  ],
  s0464: [
    'Knowing does not stand alone; it relies on the unknowing to set itself up—therefore form to spirit is but an inn on the journey.',
    'Knowing cannot stand alone; it leans on the unknowing—so form to spirit is an inn on the road.',
  ],
  s0465: [
    'When death comes, spirit leaves this and goes to that.',
    'At death spirit leaves this and goes elsewhere.',
  ],
  s0466: [
    'Spirit has already left this—of what use is the inn?',
    'Spirit has left—what use the inn?',
  ],
  s0467: [
    'Quick decay is according to reason.',
    'Quick decay is reasonable.',
  ],
  s0468: [
    'Spirit has already gone there—what is there to sacrifice?',
    'Spirit is already there—what is sacrifice for?',
  ],
  s0469: [
    'To sacrifice is to miss reason.',
    'Sacrifice misses reason.',
  ],
  s0470: [
    'Yet the teaching of Ji and Kong is not so—must there be a cause!',
    'Yet Ji and Kong taught otherwise—there must be a reason!',
  ],
  s0471: [
    'Rites and music arose from a thinning age; offering stands and grave mounds sprang from vulgar decay.',
    'Rites and music rose from a thin age; offering stands and grave mounds from vulgar rot.',
  ],
  s0472: [
    'Setting spirit altars, arraying coffins, laying out funeral feasts, building mound and ridge—all was to give the filial son a place for longing; what does it mend the spirit already gone?',
    'Spirit altars, coffins, funeral feasts, mounds and ridges—all so the filial son might mourn; what help to a spirit already gone?',
  ],
  s0473: [
    'Therefore in high antiquity they clothed the dead in firewood and cast them in the wild—can we say Chonglu, Hexu, Huangxiong, and Yandi trampled on reason?',
    'High antiquity wrapped the dead in firewood and cast them in the wild—were Chonglu, Hexu, Huangxiong, and Yandi wrong?',
  ],
  s0474: [
    'Thus Ziyu sank in the river, Han Bo in a great mound, King Wen in yellow earth, and Shi An in hemp rope.',
    'Ziyu sank in the river, Han Bo in a great mound, King Wen in yellow earth, Shi An in hemp rope.',
  ],
  s0475: [
    'These four men grasped reason and forgot the teaching.',
    'These four grasped reason and forgot the teaching.',
  ],
  s0476: [
    'If one followed the four men in roaming, one\'s lifelong aim would be fulfilled.',
    'Follow the four and a lifetime\'s aim would be fulfilled.',
  ],
  s0477: [
    'Yet accumulated habit becomes custom and is hard to reform at once; to give free rein to one\'s will in a single morning—perhaps none would follow.',
    'Habit becomes custom and is hard to break overnight; to act at once on one\'s will—perhaps none would follow.',
  ],
  s0478: [
    'Now I wish to cut away the cumbersome and thick and strive to keep what is spare and easy;',
    'Now I would cut the cumbersome and keep what is spare and easy;',
  ],
  s0479: [
    'advance not to bare the corpse, retreat yet differ from common custom;',
    'not bare the corpse, yet differ from common custom;',
  ],
  s0480: [
    'not harming the living in their thoughts, yet agreeing with the Way of the perfected man.',
    'not wounding the living, yet matching the perfected man\'s Way.',
  ],
  s0481: [
    'Confucius said: "Wrap head and feet and shape, return to burial without inner coffin."',
    'Confucius said, "Wrap head and feet and shape, bury without inner coffin."',
  ],
  s0482: [
    'That too is the rite of the poor—what is base in me?',
    'That is the poor man\'s rite—what is base in me?',
  ],
  s0483: [
    'Moreover Zhang Huan used only a headcloth, Wang Su washed only hands and feet, Fan Ran was buried as soon as wrapping was done, Xi Zhen set no altar or table, Wen Du once made his boat the coffin, Zilian carried the bier on an ox cart, Shuji warned against grave mounds, and Kang Cheng had no divination for auspicious ground.',
    'Zhang Huan used only a headcloth, Wang Su washed only hands and feet, Fan Ran buried at once, Xi Zhen set no altar, Wen Du made his boat the coffin, Zilian used an ox cart, Shuji warned against mounds, Kang Cheng forwent divination.',
  ],
  s0484: [
    'These gentlemen at least did so;',
    'These men at least did so;',
  ],
  s0485: [
    'how much more for a man like me should there be pomp and splendor!',
    'how much more should I parade pomp and splendor!',
  ],
  s0486: [
    'Now I wish to take their bright conduct as measure and rule, and if it fits the middle way perhaps I may escape the reproach of waste in vain.',
    'Now I take their bright conduct as measure; if it fits the middle way I may escape vain waste.',
  ],
  s0487: [
    'When breath fails there is no need to recall the soul; wash and wrap.',
    'When breath fails, do not recall the soul—wash and wrap.',
  ],
  s0488: [
    'With one thousand cash buy a plain coffin, old skirt and jacket, clothes, towel, pillow, and shoes.',
    'Spend a thousand cash on a plain coffin, old skirt and jacket, clothes, towel, pillow, and shoes.',
  ],
  s0489: [
    'Beyond that, whatever is sent off with the bier, ordinary things in the coffin, and remaining side offerings—nothing may be laid out.',
    'Beyond that, whatever goes with the bier, ordinary coffin goods, and side offerings—nothing may be laid out.',
  ],
  s0490: [
    'The age mostly believes the words of Li and Peng—one may call that delusion.',
    'The age mostly believes Li and Peng—call that delusion.',
  ],
  s0491: [
    'I take Kong and the Buddha as teachers and am somewhat free of this delusion.',
    'I take Confucius and the Buddha as teachers and am somewhat free of this delusion.',
  ],
  s0492: [
    'When wrapping is done, load on an open cart and return to the old hill; wherever ground suffices for a pit and the pit suffices for the coffin—no bricks, no labor to mound and plant trees, no funeral feast, no altar table, no empty seat of Lord Mao, no Yi Bo\'s libation water.',
    'When wrapping is done, load on an open cart to the old hill; wherever a pit fits the coffin—no brick, no mound, no funeral feast, no altar, no Lord Mao\'s empty seat, no Yi Bo\'s libation water.',
  ],
  s0493: [
    'As for seasonal offerings and heirs, what image and speech cut off—let the matter stop with my body without harming the world\'s teaching.',
    'Seasonal offerings and heirs—what image and speech cut off—let it stop with my body and not harm the world\'s teaching.',
  ],
  s0494: [
    'Family young and old, kin within and without, all friends, and every lodging I have known—each alike wishes to fulfill my will; pray do not wrest it away.',
    'Family, kin, friends, and every lodging I have known—all wish to fulfill my will; pray do not wrest it away.',
  ],
  s0495: [
    'The next year he died of illness, aged thirty-two.',
    'The next year he died of illness, at thirty-two.',
  ],
  s0496: [
    'When Shao was young he once sat alone in an empty room; an old man came to the door and said to Shao: "Mind and strength are fierce; you can penetrate death and life—',
    'Young, Shao sat alone in an empty room; an old man at the door said, "Mind and strength are fierce; you can penetrate death and life—',
  ],
  s0497: [
    'only you cannot long linger in one place."',
    'only you cannot long linger in one place."',
  ],
  s0498: [
    'He snapped his fingers and left.',
    'He snapped his fingers and left.',
  ],
  s0499: [
    'When Shao had grown he devoted his mind to learning Buddhism.',
    'Grown, he devoted his mind to Buddhism.',
  ],
  s0500: [
    'There was a monk, Shibao Zhi, whom men of the time could not fathom; meeting Shao at Xinghuang Monastery he started up and said: "Reclusion and the Way, purity and ascent to Buddhahood."',
    'The monk Shibao Zhi, whom no one could fathom, met Shao at Xinghuang Monastery and cried: "Reclusion and the Way, purity and Buddhahood."',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_051_b5.mjs <translation.json>'
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
