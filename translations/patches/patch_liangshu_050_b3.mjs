#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'Zhao in youth was skilled at composition; when grown he was broadly learned.',
    'In youth Zhao wrote well; grown, he was widely learned.',
  ],
  s0202: [
    'In Qi he first took office as Court Attendant and Champion acting aide.',
    'Under Qi he began as court attendant and champion acting aide.',
  ],
  s0203: [
    'Early Tianjian he was made Rear Army Prince of Linchuan staff secretary and Moling magistrate, then died.',
    'Early Tianjian he served Linchuan prince as staff secretary and governed Moling, then died.',
  ],
  s0204: [
    'Xie Jiqing was a man of Yangxia in Chen commandery.',
    'Xie Jiqing was from Yangxia in Chen.',
  ],
  s0205: [
    'His great-grandfather Lingyun was Song Administrator of Linchuan;',
    'Great-grandfather Lingyun was Song Linchuan administrator;',
  ],
  s0206: [
    'his father Chaozong was Qi Gentleman of the Yellow Gate;',
    'father Chaozong was Qi yellow-gate gentleman;',
  ],
  s0207: [
    'both had great fame in former ages.',
    'both were famed in earlier times.',
  ],
  s0208: [
    'Jiqing in youth was clear in debate; his age called him a wonder-child.',
    'Young Jiqing debated clearly; his age called him a prodigy.',
  ],
  s0209: [
    'Later when Chaozong was banished to Yuezhou and passed Xinting ford, Jiqing could not bear parting and threw himself into the river; attendants raced to save him and he did not drown.',
    'When Chaozong was exiled to Yue and passed Xinting, Jiqing leapt into the river; aides saved him from drowning.',
  ],
  s0210: [
    'In his father\'s mourning his grief exceeded ritual.',
    'Mourning his father, he grieved beyond the rites.',
  ],
  s0211: [
    'When mourning ended he was summoned as National University student.',
    'After mourning he entered the National University.',
  ],
  s0212: [
    'Qi Crown Prince Wen Hui personally presided at the examination and told Libationer Wang Jian: "Jiqing has long excelled in dark learning; now you may question him on the meaning of the classics."',
    'Wen Hui prince tested him himself and told Wang Jian: "Jiqing masters dark learning; examine him on the classics."',
  ],
  s0213: [
    'Jian followed the intent and questioned him; Jiqing answered every point without hesitation, and Wen Hui greatly praised him.',
    'Jian questioned him; Jiqing answered without pause and Wen Hui praised him highly.',
  ],
  s0214: [
    'Jian told others: "Xie Chaozong is not dead."',
    'Jian said: "Xie Chaozong lives again."',
  ],
  s0215: [
    'Grown, he loved learning, was broadly versed, and had literary color.',
    'Grown, he studied widely and wrote with grace.',
  ],
  s0216: [
    'He began as Regular Attendant of the Prince of Yuzhang, rising to Cavalry General law-court acting aide and prince libationer.',
    'He began in Yuzhang prince\'s service, rose to cavalry law aide and prince libationer.',
  ],
  s0217: [
    'He went out as magistrate of Ningguo, returned as Secretariat palace gentleman and Grand Marshal Prince of Jin\'an chief clerk.',
    'He governed Ningguo, then became secretariat palace gentleman and Jin\'an prince chief clerk.',
  ],
  s0218: [
    'Early Tianjian he was made staff secretary to the Pacification Army Prince of Poyang and Secretariat third-rank gentleman, soon Imperial Censor.',
    'Early Tianjian he was Poyang staff secretary and secretariat gentleman, soon imperial censor.',
  ],
  s0219: [
    'Former custom called transfer from gentleman to this post "running south."',
    'Office gentlemen called this transfer "fleeing south."',
  ],
  s0220: [
    'Jiqing was much disappointed, often pleaded illness, and basically ignored Board business.',
    'Dispirited, he often feigned illness and neglected ministry work.',
  ],
  s0221: [
    'He was moved to Supernumerary Cavalry Gentleman, rising to Secretariat gentleman, National University erudite, and Secretariat Vice Director.',
    'He became supernumerary cavalry gentleman, then secretariat gentleman, university erudite, and secretariat vice director.',
  ],
  s0222: [
    'Jiqing knew past matters in detail; Vice Director Xu Mian whenever doubtful would consult him.',
    'He knew antiquities; Xu Mian often asked his advice.',
  ],
  s0223: [
    'Yet his nature was free and easy; where intent struck he acted, not bound by court statutes.',
    'Yet he was free-spirited and ignored court decorum when mood moved him.',
  ],
  s0224: [
    'Once at a Leyou Park feast he returned without getting drunk and stopped at a roadside wine shop, lifted the curtain of his carriage, and drank facing the three outriders before his coach; onlookers packed like a wall yet Jiqing was at ease.',
    'Drunkless after Leyou feast, he drank with his outriders at a roadside inn while crowds stared unabashed.',
  ],
  s0225: [
    'Later in the provincial office he wore crotchless shorts at night and caroused with students on the gallery, shouting drunk; the authorities impeached him and he was dismissed.',
    'Caught drinking on the gallery in shorts at night, he was impeached and dismissed.',
  ],
  s0226: [
    'Soon reappointed National University erudite, soon Hedong Administrator; before his term ended he pleaded illness and resigned.',
    'Soon erudite again, then Hedong governor; he resigned ill before term\'s end.',
  ],
  s0227: [
    'Soon Crown Prince Rate Officer, then Chief Secretary to the Pacification Guard Prince of Pingnan.',
    'Soon crown prince rate officer, then Pingnan prince chief secretary.',
  ],
  s0228: [
    'In the sixth year of Putong an edict sent General Who Pacifies the Army Marquis of Xichang Xiao Yuanyu to lead armies north; Jiqing asked to go and was promoted to Chief Secretary and Weirong General.',
    'Putong year six he joined Marquis of Xichang Xiao Yuanyu\'s northern campaign as chief secretary and weirong general.',
  ],
  s0229: [
    'When the army retreated defeated at Woyang, Jiqing was dismissed for it.',
    'Defeat at Woyang cost him his post.',
  ],
  s0230: [
    'His home was at White Poplar Stone Well; court friends brought wine to him and guests filled the seats.',
    'At White Poplar Stone Well court friends flocked with wine.',
  ],
  s0231: [
    'Vice Director Yu Zhongrong was also dismissed and returned; the two wills matched and they indulged wildly together, sometimes riding open carriages through suburbs; drunk they would take bells and sing, heedless of public talk.',
    'Dismissed Yu Zhongrong joined him in wild outings, singing with bells and scorning opinion.',
  ],
  s0232: [
    'Prince Xiangdong at his Jing post wrote to comfort him.',
    'Prince Xiangdong in Jingzhou wrote to console him.',
  ],
  s0233: [
    'Jiqing replied: "Your humble servant since parting from the southern ford has withdrawn tracks to the eastern suburbs; day by day facing the wind, I stand gazing in speech."',
    'He answered: "Since leaving the southern ford I hide in the eastern suburbs, daily facing the wind in longing."',
  ],
  s0234: [
    'Looking up I recall your kindness, accompanying your tours and feasts, floating cassia oars on clear pools and spreading fallen blossoms on layered hills.',
    'I recall your kindness at feasts—cassia boats on clear pools, blossoms on layered hills.',
  ],
  s0235: [
    'Orchid fragrance on both sides, feathered cups competing; listening to the overflow of discourse I bathed in dark learning.',
    'Orchid scent and competing cups; I heard your discourse and bathed in dark learning.',
  ],
  s0236: [
    'Debate like surging waves—hanging rivers are not enough to compare;',
    'Debate like surging waves outdid hanging rivers;',
  ],
  s0237: [
    'spring foliage in phrasing—ornate text has no match.',
    'spring foliage in phrasing had no match.',
  ],
  s0238: [
    'All turned to look moved, convinced in heart beyond words, not noticing spring days as distant or long nights as short.',
    'All were moved, convinced beyond words, not feeling spring distant or night short.',
  ],
  s0239: [
    'Fine meetings are hard to keep; clutching clouds is easily far—thinking of yesterday, suddenly it is plain autumn.',
    'Fine meetings fade; yesterday feels suddenly like autumn.',
  ],
  s0240: [
    'Your grace does not abandon me; kind jest descends from afar.',
    'Your grace remains; kind words come from afar.',
  ],
  s0241: [
    'Dismissed on business and returned—is that called resting?',
    'Dismissed on business—is that rest?',
  ],
  s0242: [
    'I am not a high official; reason leads to one hamlet.',
    'No high office—only one hamlet suits me.',
  ],
  s0243: [
    'Farm work is bitter; it truly fits your pure teaching.',
    'Farm toil is bitter, as your teaching says.',
  ],
  s0244: [
    'Originally I lacked gold bridle ornaments and had no jade disks for capital;',
    'I lacked gold trappings and jade capital;',
  ],
  s0245: [
    'only age makes the form sparse and illness blocks the heart, sunk on the couch more than seventy days.',
    'age thins me and illness blocks the heart—seventy days on the couch.',
  ],
  s0246: [
    'Dreams and illusion in a moment; sorrow in mind knows it is useless and I think to cast it off.',
    'Dreams pass in a moment; sorrow is useless and I would cast it off.',
  ],
  s0247: [
    'Seeking principle to cleanse intent, I take appointment as salve;',
    'Seeking clarity, I take office as salve;',
  ],
  s0248: [
    'holding the mirror to see form, I instead take deformity for the daylily tree.',
    'in the mirror I see deformity where others see daylilies.',
  ],
  s0249: [
    'Thus I look up to lofty tracks and forever speak of sages past;',
    'So I honor sages past;',
  ],
  s0250: [
    'Gui Guzi dwelt deep; Jie Yu held high;',
    'Gui Guzi hid deep; Jie Yu held high;',
  ],
  s0251: [
    'hid their names in butcher stalls, rose from barrier markets;',
    'names in butcher stalls, rise from market gates;',
  ],
  s0252: [
    'those men are remote; their traces may be imagined.',
    'those men are far; their traces remain.',
  ],
  s0253: [
    'If the dead have awareness, would they not grieve in dark earth, bitter at separation from fragrant dust;',
    'If the dead know, they grieve in dark earth, parted from life;',
  ],
  s0254: [
    'if the departed could act, they would surely shine in light and joy as in former tours;',
    'if the dead could act, they would shine as in former tours;',
  ],
  s0255: [
    'let this one old gardener join the empty seat at the end.',
    'let this old gardener join the last seat.',
  ],
  s0256: [
    'The day of parting is already sparse; coming attendance is not yet weak;',
    'Parting is long past; new attendance is not slight;',
  ],
  s0257: [
    'linked swords and flying ducks are not my kind;',
    'linked swords and flying ducks are not my kind;',
  ],
  s0258: [
    'cherishing private virtue I steal tears."',
    'cherishing your virtue I weep in private."',
  ],
  s0259: [
    'Though Jiqing did not restrain conduct, in the family he was deeply affectionate.',
    'Though unrestrained, he was deeply affectionate at home.',
  ],
  s0260: [
    'Elder brother Caicheng died early; his son Zao was young and orphaned; Jiqing raised him with utmost care.',
    'Brother Caicheng died young; Jiqing raised orphan Zao devotedly.',
  ],
  s0261: [
    'When Zao was established, his clear offices as household libationer and chief clerk were all through Jiqing\'s encouragement and teaching.',
    'Zao\'s offices came from Jiqing\'s training.',
  ],
  s0262: [
    'The age praised this.',
    'The age praised it.',
  ],
  s0263: [
    'Jiqing before he could be employed in order died of illness.',
    'He died ill before full use.',
  ],
  s0264: [
    'His collected works circulated in the world.',
    'His works circulated.',
  ],
  s0265: [
    'Liu Xie, styled Yanhe, was a man of Ju in Dongguan.',
    'Liu Xie, styled Yanhe, was from Ju in Dongguan.',
  ],
  s0266: [
    'Grandfather Lingzhen was younger brother of Song Minister of Works Xiu.',
    'Grandfather Lingzhen was younger brother of Song Minister of Works Xiu.',
  ],
  s0267: [
    'Father Shang was Rapid Cavalry Commandant.',
    'Father Shang was rapid cavalry commandant.',
  ],
  s0268: [
    'Xie was orphaned early, devoted in will and fond of learning.',
    'Orphaned early, he studied devotedly.',
  ],
  s0269: [
    'The family was poor and he did not marry; he relied on the monk Sengyou, living with him more than ten years, until he thoroughly mastered sutras and treatises and sorted them by category, recording and ordering them.',
    'Poor and unmarried, he lived with monk Sengyou ten years, mastered sutras, and classified the canon.',
  ],
  s0270: [
    'The scripture treasury of Dinglin Temple today was fixed by Xie.',
    'Dinglin Temple\'s canon was his ordering.',
  ],
  s0271: [
    'Early Tianjian he began as Court Attendant; Prince of Linchuan Hong of the Center Army summoned him as acting staff secretary, then Cavalry storehouse acting aide.',
    'Early Tianjian he was court attendant, then Linchuan prince staff secretary and cavalry storehouse aide.',
  ],
  s0272: [
    'He went out as magistrate of Taimo; his administration had pure achievement.',
    'As Taimo magistrate his rule was exemplary.',
  ],
  s0273: [
    'He was made staff secretary to Benevolent Might Prince of Nankang and Eastern Palace Communications Attendant.',
    'He became Nankang staff secretary and Eastern Palace attendant.',
  ],
  s0274: [
    'At that time the seven temples\' offerings already used fruits and vegetables, but the two suburban altars and agricultural and community rites still had victims.',
    'Seven temples used fruit; two suburbs still sacrificed animals.',
  ],
  s0275: [
    'Xie memorialized that the two suburbs should be changed like the seven temples; an edict sent it to the Ministry of Rites to discuss, and they followed what Xie stated.',
    'He urged matching suburbs to temples; the ministry agreed.',
  ],
  s0276: [
    'He was promoted to Infantry Commandant, still Communications Attendant as before.',
    'He rose to infantry commandant while keeping attendant duty.',
  ],
  s0277: [
    'Crown Prince Zhaoming loved literature and deeply favored and received him.',
    'Zhaoming prince loved letters and favored him.',
  ],
  s0278: [
    'Earlier Xie composed Literary Mind and Carved Dragon in fifty chapters, discussing styles of writing ancient and modern, citing and arranging them.',
    'He wrote Literary Mind and Carved Dragon in fifty chapters on styles past and present.',
  ],
  s0279: [
    'Its preface says:',
    'The preface says:',
  ],
  s0280: [
    'Literary Mind means the mind applied to writing.',
    'Literary Mind means mind applied to writing.',
  ],
  s0281: [
    'Long ago Juanzi had "Lute Mind" and Wang Sun "Clever Mind"—how beautiful the mind is! Hence I use it.',
    'Juanzi\'s Lute Mind and Wang Sun\'s Clever Mind show how beautiful mind is—hence the title.',
  ],
  s0282: [
    'Writings from antiquity take ornate carving as their form—does one take Zou Yi\'s many words and "carve the dragon"?',
    'Ancient writings are ornate—is the title from Zou Yi\'s "carving the dragon"?',
  ],
  s0283: [
    'The cosmos is vast; the people numerous and mixed; to stand out from the crowd is a matter of intelligence alone.',
    'The cosmos is vast; to stand out takes intelligence alone.',
  ],
  s0284: [
    'Years and months flit; nature and spirit do not stay; to raise sound and solid achievement is a matter of making alone.',
    'Time flies; raising sound and fact is making alone.',
  ],
  s0285: [
    'We mirror heaven and earth, receive the nature of the five talents, model ear and eye on sun and moon and square voice and breath on wind and thunder—we already surpass the ten thousand things in spirit.',
    'We mirror heaven and earth, model senses on sun and moon and voice on wind and thunder—we surpass all things in spirit.',
  ],
  s0286: [
    'Form is frailer than grass and trees; fame harder than metal and stone—therefore the gentleman in the world plants virtue and sets forth words: is it because he loves debate?',
    'Form is fragile, fame hard—gentlemen plant virtue and speak: not from love of debate',
  ],
  s0287: [
    'It is because he cannot do otherwise.',
    'but because they must.',
  ],
  s0288: [
    'My teeth had passed twenty; once at night I dreamed I held vermilion-lacquered ritual vessels and followed Confucius south; waking at dawn I was pleased in spirit.',
    'Past twenty I dreamed I held ritual vessels following Confucius south and woke pleased.',
  ],
  s0289: [
    'Great indeed is the difficulty of seeing the sage!',
    'How hard to see the sage!',
  ],
  s0290: [
    'Was it the small man\'s dream granted below?',
    'Was it a small man\'s dream below?',
  ],
  s0291: [
    'Since men arose there has been none like the Master.',
    'Since men arose none like the Master.',
  ],
  s0292: [
    'To spread and praise the sage intent nothing surpasses annotating the classics; yet Ma, Zheng, and the Ru have already refined that; even deep understanding cannot establish a school.',
    'Annotating classics spreads the sage intent, but Ma and Zheng refined it—deep insight cannot found a school.',
  ],
  s0293: [
    'Only the use of writing is truly branches of the classics: the five rites rely on it to form, the six canons use it to function; lord and minister thereby shine, army and state thereby clarify.',
    'Writing alone is the classics\' branches: rites and canons depend on it; lord and minister and army and state shine through it.',
  ],
  s0294: [
    'Examined to their root, none are not from the classics.',
    'At root all come from the classics.',
  ],
  s0295: [
    'But departed from the sage long, styles dissolved; writers love the strange, words prize floating guile, adorn feathers and esteem paint, embroider saddle flaps—ever farther from the root, about to sink into false overflow.',
    'Far from sages, styles dissolved; writers loved the strange and ornament, drifting from root toward false overflow.',
  ],
  s0296: [
    'The Zhou Documents discuss phrasing and prize substance;',
    'Zhou Documents prize substance in phrasing;',
  ],
  s0297: [
    'Confucius in instruction hated heterodox branches.',
    'Confucius hated heterodox branches.',
  ],
  s0298: [
    'The difference of phrasing and instruction should take substance as body.',
    'Phrasing and instruction should take substance as body.',
  ],
  s0299: [
    'Thereupon I took brush and ink and began to discuss writing.',
    'So I took brush and ink and began to discuss writing.',
  ],
  s0300: [
    'I have looked closely at recent discussions of writing—there are many.',
    'Recent writing discussions are many.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_050_b3.mjs <translation.json>'
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
