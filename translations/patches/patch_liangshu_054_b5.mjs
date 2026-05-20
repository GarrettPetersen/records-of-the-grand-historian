#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'Lesser xiang wear zhefeng, shaped like a bian cap.',
    'Lesser xiang wear zhefeng caps shaped like court bian.',
  ],
  s0402: [
    'The state has no prisons; when someone is guilty, the various xiang assemble to discuss and execute him, and his wife and children are confiscated.',
    'There are no prisons; the guilty are judged in council by the xiang and put to death, their wives and children seized.',
  ],
  s0403: [
    'Their custom favors licentiousness; men and women often elope and seduce one another.',
    'They are licentious by custom; men and women often run off together in mutual seduction.',
  ],
  s0404: [
    'Once married, they soon make slight preparations for burial garments.',
    'After marriage they quickly begin preparing modest burial clothes.',
  ],
  s0405: [
    'In death and burial, they have outer coffins but no inner coffins.',
    'The dead are buried in outer coffins without inner coffins.',
  ],
  s0406: [
    'They favor lavish burial; gold, silver, and currency are all spent on the dead.',
    'They love lavish funerals and pour gold, silver, and coin into the dead.',
  ],
  s0407: [
    'They pile stones for the tomb mound and plant pine and cypress in rows.',
    'Stone mounds mark the graves, with pine and cypress planted in rows.',
  ],
  s0408: [
    'When an elder brother dies, the younger brother takes the widow as wife.',
    'A younger brother takes his dead elder brother\'s widow as wife.',
  ],
  s0409: [
    'Their horses are all small, suited for climbing mountains.',
    'Their horses are small and nimble on mountain paths.',
  ],
  s0410: [
    'The people value physical strength and are skilled with bow, arrow, blade, and spear.',
    'The people honor strength and excel with bow, arrow, blade, and spear.',
  ],
  s0411: [
    'They have armor and practice warfare; Wolu and Eastern Hui all belong to them.',
    'They wear armor and train for battle; Wolu and Eastern Hui are subject to them.',
  ],
  s0412: [
    'At the beginning of Wang Mang\'s reign, Goguryeo troops were levied to campaign against the Hu; unwilling to go, they were forcibly dispatched, then all fled beyond the frontier and became bandits.',
    'Early in Wang Mang\'s reign Goguryeo soldiers were drafted against the Hu; forced to march, they fled beyond the passes and turned to raiding.',
  ],
  s0413: [
    'The provinces and commanderies blamed Marquis Zou of Goguryeo; Yan You lured and beheaded him; Wang Mang was greatly pleased and renamed Goguryeo to Lower Goguryeo—at this time it was a marquisate.',
    'Provinces blamed Marquis Zou of Goguryeo; Yan You tricked and killed him; Wang Mang rejoiced and renamed the realm Lower Goguryeo—it was a marquisate then.',
  ],
  s0414: [
    'In the eighth year of Guangwu, the king of Goguryeo sent envoys with tribute and first styled himself king.',
    'In Guangwu eight the Goguryeo king sent tribute envoys and first took the title of king.',
  ],
  s0415: [
    'Between the reigns of Shang and An, their king was named Gong; he repeatedly raided Liaodong; Administrator Cai Feng of Xuantu campaigned against him but could not restrain him.',
    'Under Shang and An, King Gong raided Liaodong again and again; Xuantu Administrator Cai Feng could not stop him.',
  ],
  s0416: [
    'Gong died; his son Bogu succeeded.',
    'Gong died and his son Bogu took the throne.',
  ],
  s0417: [
    'Between Shun and He, they again repeatedly violated Liaodong with raids.',
    'Under Shun and He they again and again raided Liaodong.',
  ],
  s0418: [
    'In the second year of Jianning under Emperor Ling, Administrator Geng Lin of Xuantu campaigned; hundreds of heads and captives were taken; Bogu then surrendered and submitted to Liaodong.',
    'In Ling\'s Jianning two, Xuantu Administrator Geng Lin attacked, took hundreds of heads and captives, and Bogu surrendered to Liaodong.',
  ],
  s0419: [
    'When Gongsun Du dominated the eastern sea, Bogu maintained friendly relations with him.',
    'While Gongsun Du held sway over the eastern sea, Bogu kept friendly ties with him.',
  ],
  s0420: [
    'Bogu died; his son Yiyimo succeeded.',
    'Bogu died and his son Yiyimo succeeded.',
  ],
  s0421: [
    'Yiyimo had already repeatedly raided Liaodong since Bogu\'s time, and also received over five hundred households of fugitive Hu.',
    'Since Bogu\'s day Yiyimo had raided Liaodong often and sheltered more than five hundred fugitive Hu households.',
  ],
  s0422: [
    'In the Jian\'an era, Gongsun Kang marched out and attacked; he broke their state, burned settlements, the surrendered Hu also rebelled against Yiyimo, and Yiyimo built a new state.',
    'Under Jian\'an, Gongsun Kang marched against them, broke the realm, burned towns, and the surrendered Hu turned on Yiyimo—who then built a new capital.',
  ],
  s0423: [
    'Afterward Yiyimo again attacked Xuantu; Xuantu and Liaodong jointly struck and thoroughly defeated him.',
    'Later Yiyimo struck Xuantu again; Xuantu and Liaodong joined forces and routed him.',
  ],
  s0424: [
    'Yiyimo died; his son Weigong succeeded.',
    'Yiyimo died and his son Weigong took the throne.',
  ],
  s0425: [
    'Weigong had courage and strength, was skilled on saddle and horse, and excelled at hunting.',
    'Weigong was brave and strong, handy in the saddle, and a fine hunter.',
  ],
  s0426: [
    'In the second year of Jingchu under Wei, the Grand Tutor Sima the Prefectural King led an army to campaign against Gongsun Yuan; Weigong sent his chief clerk and a great xiang with a thousand troops to assist.',
    'In Wei Jingchu two, Grand Tutor Sima the Prefectural King marched on Gongsun Yuan; Weigong sent his chief clerk and a great xiang with a thousand men to help.',
  ],
  s0427: [
    'In the third year of Zhengshi, Weigong raided Xi\'an and Jiaping.',
    'In Zhengshi three Weigong raided Xi\'an and Jiaping.',
  ],
  s0428: [
    'In the fifth year, Inspector Guanqiu Jian of Youzhou led ten thousand men out from Xuantu to campaign against Weigong; Weigong led twenty thousand foot and horse to meet the army; a great battle was fought at Feiliu.',
    'In the fifth year Youzhou Inspector Guanqiu Jian led ten thousand out of Xuantu against Weigong; Weigong met him with twenty thousand foot and horse at Feiliu.',
  ],
  s0429: [
    'Weigong was defeated and fled; Jian\'s army pursued to Xian, unhitched chariots and hobbled horses, ascended Wandu Mountain, slaughtered their capital, and took over ten thousand heads and captives.',
    'Weigong fled in defeat; Jian pursued to Xian, left chariots and hobbled horses, climbed Wandu Mountain, sacked the capital, and took more than ten thousand heads and captives.',
  ],
  s0430: [
    'Weigong alone led his wife and children far in flight.',
    'Weigong fled alone with wife and children.',
  ],
  s0431: [
    'In the sixth year, Jian campaigned again; Weigong fled lightly with the various xiang to Wolu; Jian sent General Wang Qi in pursuit, crossing over a thousand li of Wolu territory to the southern border of Sushen, inscribing stone to record merit;',
    'In the sixth year Jian attacked again; Weigong fled lightly with the xiang to Wolu; Jian sent General Wang Qi in pursuit over a thousand li of Wolu to Sushen\'s southern border, carving stone to record the feat;',
  ],
  s0432: [
    'then went again to Wandu Mountain, inscribed on Bu Nai city, and returned.',
    'then returned by way of Wandu Mountain, leaving an inscription at Bu Nai city.',
  ],
  s0433: [
    'Afterward, they again opened contact with central China.',
    'After that they reopened ties with central China.',
  ],
  s0434: [
    'During the Yongjia turmoil of Jin, the Xianbei Murong Hui held Daji city in Changli; Emperor Yuan appointed him Governor of Pingzhou.',
    'In Jin\'s Yongjia chaos Murong Hui the Xianbei held Daji in Changli; Emperor Yuan made him governor of Pingzhou.',
  ],
  s0435: [
    'Goguryeo King Yifuli repeatedly raided Liaodong; Hui could not control him.',
    'Goguryeo King Yifuli raided Liaodong again and again; Hui could not restrain him.',
  ],
  s0436: [
    'Fuli died; his son Zhao succeeded.',
    'Fuli died and his son Zhao succeeded.',
  ],
  s0437: [
    'In the first year of Jianyuan under Emperor Kang, Murong Hui\'s son Huang led troops to attack; Zhao fought and was thoroughly defeated, fleeing alone on horseback.',
    'In Kang\'s Jianyuan one, Murong Hui\'s son Huang attacked; Zhao was routed and fled alone on horseback.',
  ],
  s0438: [
    'Huang pressed the victory to Wandu, burned their palaces, and carried off over fifty thousand men in captivity.',
    'Huang pursued to Wandu, burned the palaces, and carried off more than fifty thousand men.',
  ],
  s0439: [
    'In the tenth year of Taiyuan under Emperor Xiaowu, Goguryeo attacked Liaodong and Xuantu commanderies; Later Yan\'s Murong Chui sent his brother Nong to campaign against Goguryeo and recovered the two commanderies.',
    'In Xiaowu\'s Taiyuan ten Goguryeo struck Liaodong and Xuantu; Later Yan\'s Murong Chui sent his brother Nong against Goguryeo and retook both commanderies.',
  ],
  s0440: [
    'Chui died; his son Bao succeeded, appointing Goguryeo King An as Governor of Pingzhou and enfeoffing him as king of the two states of Liaodong and Daifang.',
    'Chui died; his son Bao made Goguryeo King An governor of Pingzhou and king of Liaodong and Daifang.',
  ],
  s0441: [
    'An first established offices of Chief Clerk, Marshal, and Staff Officer; later he gradually occupied Liaodong commandery.',
    'An first set up chief clerk, marshal, and staff officer posts, then gradually seized Liaodong commandery.',
  ],
  s0442: [
    'Down to his grandson Gao Lian, in the Yixi era under Emperor An of Jin he first submitted memorials and opened tribute duties; through Song and Qi he received ranks and titles; he died aged over a hundred.',
    'His grandson Gao Lian, in Jin An\'s Yixi era, first sent memorials and tribute; Song and Qi both granted him rank; he died past a hundred.',
  ],
  s0443: [
    'His son Yun—in Longchang of Qi—was appointed Bearer of the Staff, Regular Attendant of the Scattered Cavalry, Commander of Ying and Ping two provinces, General Who Conquers the East, and Duke of Lelang.',
    'His son Yun, in Qi Longchang, became Bearer of the Staff, Regular Attendant of the Scattered Cavalry, commander of Ying and Ping, General Who Conquers the East, and Duke of Lelang.',
  ],
  s0444: [
    'When Gaozu took the throne, Yun was promoted to General of Chariots and Cavalry.',
    'When Gaozu ascended, Yun was promoted to General of Chariots and Cavalry.',
  ],
  s0445: [
    'In the seventh year of Tianjian, an edict said: "King Yun of Goguryeo, Duke of Lelang commandery, has shown sincere devotion; tribute envoys follow in succession—his rank and mandate should be exalted to glorify the court\'s standards.',
    'In Tianjian seven an edict read, "Goguryeo King Yun, Duke of Lelang, has shown true loyalty; tribute envoys come in steady succession—his rank should rise to honor the court\'s standards.',
  ],
  s0446: [
    'Let him be General Who Pacifies the East, Honorific Equal to the Three Excellencies with an opening office, Bearer of the Staff, Regular Attendant, Commander—the kingship as before."',
    'Let him be General Who Pacifies the East, Honorific Equal to the Three Excellencies with an opening office, Bearer of the Staff, Regular Attendant, and Commander—the kingship unchanged."',
  ],
  s0447: [
    'In the eleventh and fifteenth years, envoys were repeatedly sent with tribute.',
    'In the eleventh and fifteenth years they sent tribute envoys again and again.',
  ],
  s0448: [
    'In the seventeenth year, Yun died; his son An succeeded.',
    'In the seventeenth year Yun died and his son An succeeded.',
  ],
  s0449: [
    'In the first year of Putong, an edict had An inherit the enfeoffment and rank: Bearer of the Staff, Commander of all military affairs of Ying and Ping two provinces, General Who Pacifies the East.',
    'In Putong one an edict had An inherit the title: Bearer of the Staff, commander of Ying and Ping military affairs, General Who Pacifies the East.',
  ],
  s0450: [
    'In the seventh year, An died; his son Yan succeeded; envoys were sent with tribute; an edict had Yan inherit the title.',
    'In the seventh year An died; his son Yan succeeded, sent tribute envoys, and received an edict inheriting the title.',
  ],
  s0451: [
    'In the fourth and sixth years of Zhongdatong, and the first and seventh years of Datong, memorials and local products were repeatedly offered.',
    'In Zhongdatong four and six and Datong one and seven they repeatedly sent memorials and local goods.',
  ],
  s0452: [
    'In the second year of Taiqing, Yan died; an edict had his son inherit Yan\'s title and rank.',
    'In Taiqing two Yan died; an edict had his son inherit Yan\'s title.',
  ],
  s0453: [
    'Baekje—in antiquity among the Eastern Yi there were three Han states: the first called Ma Han, the second Jin Han, the third Byeon Han.',
    'Baekje arose among the Eastern Yi\'s three Han realms—Ma Han, Jin Han, and Byeon Han.',
  ],
  s0454: [
    'Byeon Han and Jin Han each had twelve states; Ma Han had fifty-four.',
    'Byeon Han and Jin Han held twelve states each; Ma Han held fifty-four.',
  ],
  s0455: [
    'Large states had over ten thousand households, small ones several thousand; altogether over a hundred thousand households—Baekje was one of them.',
    'Great states held ten thousand households or more, small ones a few thousand—over a hundred thousand households in all; Baekje was one.',
  ],
  s0456: [
    'Later it gradually grew powerful and absorbed the smaller states.',
    'Later it grew strong and swallowed the lesser states.',
  ],
  s0457: [
    'Its state originally lay with Goguryeo east of Liaodong; in Jin times, once Goguryeo had occupied Liaodong, Baekje also held the territory of Liaoxi and Jinping two commanderies and established its own Baekje commandery.',
    'It once shared Liaodong\'s east with Goguryeo; when Goguryeo seized Liaodong in Jin, Baekje took Liaoxi and Jinping and set up its own Baekje commandery.',
  ],
  s0458: [
    'In Taiyuan of Jin, King Xu;',
    'In Jin Taiyuan, King Xu;',
  ],
  s0459: [
    'In Yixi, King Yuying;',
    'In Yixi, King Yuying;',
  ],
  s0460: [
    'In Yuanjia of Song, King Yubi;',
    'In Song Yuanjia, King Yubi;',
  ],
  s0461: [
    'all sent captives as tribute.',
    'all sent living captives as tribute.',
  ],
  s0462: [
    'Yubi died; his son Qing was enthroned.',
    'Yubi died and his son Qing succeeded.',
  ],
  s0463: [
    'Qing died; his son Moudu succeeded.',
    'Qing died and Moudu succeeded.',
  ],
  s0464: [
    'Moudu died; his son Outai was enthroned.',
    'Moudu died and his son Outai succeeded.',
  ],
  s0465: [
    'In Yongming of Qi he was appointed Grand Commander of all Baekje military affairs, General Who Guards the East, and King of Baekje.',
    'In Qi Yongming he became Grand Commander of Baekje military affairs, General Who Guards the East, and King of Baekje.',
  ],
  s0466: [
    'In the first year of Tianjian, his grand title was advanced to General Who Campaigns East.',
    'In Tianjian one his grand title rose to General Who Campaigns East.',
  ],
  s0467: [
    'Soon he was broken by Goguryeo; weakened for many years, they moved to settle in southern Han territory.',
    'Soon Goguryeo broke them; weakened for years, they moved to southern Han lands.',
  ],
  s0468: [
    'In the second year of Putong, King Yulong first again sent envoys with a memorial, stating "Having repeatedly broken Goguryeo, we now first establish friendly relations"—and Baekje again became a powerful state.',
    'In Putong two King Yulong sent envoys again, reporting repeated victories over Goguryeo and a new opening of friendly ties—and Baekje grew strong once more.',
  ],
  s0469: [
    'That year, Gaozu\'s edict said: "Acting Commander of all Baekje military affairs, General Who Guards the East, King Yulong of Baekje guards the frontier beyond the seas and maintains tribute from afar—sincerity has arrived; We commend this.',
    'That year Gaozu\'s edict said, "Acting Commander of Baekje military affairs, General Who Guards the East, King Yulong of Baekje keeps the overseas frontier and sends distant tribute—your sincerity reaches Us and We commend it.',
  ],
  s0470: [
    'Following established statutes, We grant this honorable mandate.',
    'Following old statutes, We grant this honorable mandate.',
  ],
  s0471: [
    'Let him be Bearer of the Staff, Commander of all Baekje military affairs, General Who Pacifies the East, and King of Baekje."',
    'Let him be Bearer of the Staff, Commander of Baekje military affairs, General Who Pacifies the East, and King of Baekje."',
  ],
  s0472: [
    'In the fifth year, Long died; an edict had his son Ming succeed as Bearer of the Staff, Commander of Baekje military affairs, General Who Assuages the East, and King of Baekje.',
    'In the fifth year Long died; an edict made his son Ming Bearer of the Staff, commander of Baekje military affairs, General Who Assuages the East, and King of Baekje.',
  ],
  s0473: [
    'They call their capital city Guma, and settlements Cheon-nok—like China\'s terms for commanderies and counties.',
    'Their capital is called Guma and their towns Cheon-nok—like China\'s commanderies and counties.',
  ],
  s0474: [
    'The state has twenty-two cheon-nok, all held separately by sons, younger relatives, and clansmen.',
    'The realm has twenty-two cheon-nok, each held by sons, younger kin, and clansmen.',
  ],
  s0475: [
    'The people are tall in form; their clothes are clean.',
    'The people are tall and keep their dress clean.',
  ],
  s0476: [
    'Their country lies near Wa; many practice tattooing.',
    'Their land lies near Wa; tattooing is common.',
  ],
  s0477: [
    'Now speech and dress largely resemble Goguryeo; they differ in that they do not spread their arms when walking or extend both feet when bowing.',
    'Speech and dress now mostly match Goguryeo; they differ in walking without spread arms and bowing without both feet extended.',
  ],
  s0478: [
    'They call a cap a guan, a jacket a fushan, trousers a kun.',
    'They call hats guan, jackets fushan, and trousers kun.',
  ],
  s0479: [
    'Their speech partakes of the Central States—it is said to preserve customs of Qin and Han.',
    'Their language mixes with the Central States—said to preserve Qin and Han customs.',
  ],
  s0480: [
    'In the sixth year of Zhongdatong and the seventh of Datong, envoys were repeatedly sent offering local products;',
    'In Zhongdatong six and Datong seven they sent envoys again and again with local goods;',
  ],
  s0481: [
    'and requested masters of the Nirvana Sutra and other doctrinal texts, a Doctor of the Mao Odes, together with craftsmen and painters—the court ordered all to be granted.',
    'and asked for masters of the Nirvana Sutra and other scriptures, a Doctor of the Mao Odes, plus craftsmen and painters—all were granted by edict.',
  ],
  s0482: [
    'In the third year of Taiqing, unaware of bandits ravaging the capital, they still sent envoys with tribute;',
    'In Taiqing three, not knowing bandits had ravaged the capital, they still sent tribute envoys;',
  ],
  s0483: [
    'once arrived, seeing the capital gates in ruin, they all wailed and wept.',
    'on arrival, seeing ruined gates and walls, they wailed and wept aloud.',
  ],
  s0484: [
    'Hou Jing grew angry and imprisoned them; only when Jing was pacified could they return home.',
    'Hou Jing in anger seized and held them; only after his defeat could they return home.',
  ],
  s0485: [
    'Silla—their ancestors were originally of the Jin Han stock.',
    'Silla—its people originally came from Jin Han stock.',
  ],
  s0486: [
    'Jin Han is also called Qin Han; they lie ten thousand li apart; tradition says that in Qin times fugitives fleeing corvée came to Ma Han; Ma Han also ceded its eastern border for them to dwell—the name Qin Han comes from these Qin people.',
    'Jin Han is also Qin Han; the lands lie ten thousand li apart. Tradition holds that Qin-era fugitives fleeing corvée reached Ma Han, which ceded its eastern marches for them—hence Qin Han, for Qin people.',
  ],
  s0487: [
    'Their speech and nomenclature resemble Chinese: they call a state bang, a bow hu, a bandit kou, and serving wine xingshang.',
    'Their words and names echo China: realm is bang, bow is hu, bandit is kou, and passing wine is xingshang.',
  ],
  s0488: [
    'They address one another as tu—it differs from Ma Han.',
    'They call one another tu—not as Ma Han does.',
  ],
  s0489: [
    'Moreover the king of Jin Han was usually a Ma Han man appointed to the post, generation after generation; Jin Han could not establish its own king—clear evidence they were displaced people;',
    'Jin Han kings were usually Ma Han appointees, generation after generation; Jin Han could not crown its own king—proof they were migrants;',
  ],
  s0490: [
    'always controlled by Ma Han.',
    'always under Ma Han\'s control.',
  ],
  s0491: [
    'Jin Han originally had six states, gradually dividing into twelve—Silla is one of them.',
    'Jin Han began with six states and later split into twelve; Silla is one.',
  ],
  s0492: [
    'Its state lies over five thousand li southeast of Baekje.',
    'The realm lies more than five thousand li southeast of Baekje.',
  ],
  s0493: [
    'Its territory fronts the great sea to the east; north and south it borders Goguryeo and Baekje.',
    'It faces the eastern sea; north and south it touches Goguryeo and Baekje.',
  ],
  s0494: [
    'Under Wei it was called Sin Lu; under Song, Silla—or Sila.',
    'Wei called it Sin Lu; Song called it Silla, or Sila.',
  ],
  s0495: [
    'The state is small and could not on its own dispatch envoys.',
    'The realm was small and could not send envoys on its own.',
  ],
  s0496: [
    'In the second year of Putong, King Munjin first sent envoys following Baekje to offer local products.',
    'In Putong two King Munjin first sent envoys with Baekje to present local goods.',
  ],
  s0497: [
    'Their custom calls a city Geonmullara; settlements within are called chokpyeong, without are called eollok—again like China\'s commanderies and counties.',
    'They call a city Geonmullara; inner towns are chokpyeong, outer ones eollok—again like China\'s commanderies and counties.',
  ],
  s0498: [
    'The state has six chokpyeong and fifty-two eollok.',
    'The realm has six chokpyeong and fifty-two eollok.',
  ],
  s0499: [
    'The land is rich and fair, suited for planting the five grains.',
    'The soil is rich and good for the five grains.',
  ],
  s0500: [
    'Mulberry and hemp are abundant; they make fine cloth.',
    'Mulberry and hemp abound; they weave fine cloth.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_054_b5.mjs <translation.json>'
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
