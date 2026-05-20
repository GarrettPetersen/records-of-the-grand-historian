#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'The state borders a great river called Xintao; its source rises in Kunlun and divides into five streams, all together called the Heng River.',
    'The realm fronts a great river, Xintao—born on Kunlun, split into five branches, and known in sum as the Heng River.',
  ],
  s0302: [
    'Its water is sweet and fine; beneath it lies true salt, pure white like crystal.',
    'The water tastes sweet and clear, and true salt lies below, white as crystal.',
  ],
  s0303: [
    'Local products include rhinoceros horn, elephant ivory, sable, beaver, tortoiseshell, fire-glass, gold, silver, iron, gold-thread weaving, gold-skinned felt, fine white cotton cloth, fine furs, and carpets.',
    'The land yields rhinoceros horn, ivory, sable, beaver pelts, tortoiseshell, fire-glass, gold, silver, iron, gold-thread brocade, gold-skinned felt, fine white cotton, good furs, and carpets.',
  ],
  s0304: [
    'Fire-glass looks like mica, its color like purple gold and luminous; split apart it is thin as a cicada\'s wing, piled up like layered gauze.',
    'Fire-glass resembles mica, purple-gold and bright; peeled thin as cicada wing, stacked like folds of gauze.',
  ],
  s0305: [
    'To the west it trades on the sea with Da Qin and Parthia; many Da Qin treasures come—coral, amber, gold, green pearls, carnelian, turmeric, and storax.',
    'Westward it trades at sea with Rome and Parthia, and many Roman treasures arrive—coral, amber, gold, green pearls, carnelian, turmeric, and storax.',
  ],
  s0306: [
    'Storax is made by boiling together the juices of many fragrant substances—it is not a single thing found in nature.',
    'Storax is distilled from many fragrant juices boiled together, not a single natural product.',
  ],
  s0307: [
    'It is also said that Da Qin men gather storax by first pressing out the juice for fragrant paste, then sell the dregs to merchants of other lands; thus by many hands it reaches China, and is not very fragrant.',
    'Romans are said to press storax for fragrant paste first, then sell the leavings to foreign traders—so by the time it reaches China through many hands, much of the scent is gone.',
  ],
  s0308: [
    'Turmeric comes only from Kasmira; its blossoms are pure yellow and fine, resembling hibiscus flowers among lotus leaves.',
    'Turmeric grows only in Kasmira, its flowers bright yellow and delicate, like hibiscus among lotus pads.',
  ],
  s0309: [
    'The people first take them to Buddhist temples; after days the blossoms wither and are removed as fertilizer;',
    'Locals first offer the flowers at temples; when they wilt after some days, the spent blossoms are cleared away as compost;',
  ],
  s0310: [
    'merchants hire men from the temples and resell them to other countries.',
    'and merchants hire temple workers to buy them up and sell them abroad.',
  ],
  s0311: [
    'In the ninth year of Yanxi under Han Emperor Huan, King Andun of Da Qin sent envoys from beyond the Rinan frontier to offer tribute—the only contact in Han times.',
    'In Han Huan\'s ninth Yanxi year, King Andun of Rome sent envoys from beyond the Rinan border with tribute—the sole Han-era contact.',
  ],
  s0312: [
    'Their merchants often reach Funan, Rinan, and Jiaozhi; people of the southern frontier lands rarely reach Da Qin.',
    'Roman traders often reach Funan, Rinan, and Jiaozhi, but folk of the southern marches seldom travel as far as Rome.',
  ],
  s0313: [
    'In the fifth year of Huangwu under Sun Quan, a Da Qin merchant named Qin Lun came to Jiaozhi; Administrator Wu Miao of Jiaozhi sent him on to Quan.',
    'In Sun Quan\'s fifth Huangwu year, a Roman merchant called Qin Lun arrived at Jiaozhi, and Governor Wu Miao forwarded him to Quan.',
  ],
  s0314: [
    'Quan asked about local songs and customs; Lun answered in full detail.',
    'Quan questioned him about lands and customs, and Lun answered at length.',
  ],
  s0315: [
    'At the time Zhuge Ke was campaigning against Danyang and captured short men of You and She; when Lun saw them he said, "Da Qin rarely sees people like this."',
    'Zhuge Ke was then campaigning in Danyang and had captured pygmies from You and She; Lun said, "Rome seldom sees men like these."',
  ],
  s0316: [
    'Quan gave ten men and ten women; he dispatched the official Liu Xian of Kuaiji to escort Lun—Xian died on the road, and Lun went straight back to his own country.',
    'Quan gave him ten men and ten women and sent Kuaiji official Liu Xian to escort him home; Xian died en route, and Lun returned directly to his country.',
  ],
  s0317: [
    'In the time of Emperor He of Han, Tianzhu sent envoys with tribute several times; later the Western Regions rebelled and contact ceased.',
    'Under Han Emperor He, India sent tribute envoys several times; after the Western Regions rebelled, contact broke off.',
  ],
  s0318: [
    'By the second and fourth years of Yanxi under Emperor Huan, they came frequently from beyond the Rinan frontier to offer tribute.',
    'Under Huan, in Yanxi 2 and 4, envoys again came often from beyond Rinan with tribute.',
  ],
  s0319: [
    'In Wei and Jin times contact never resumed.',
    'Under Wei and Jin, the route never reopened.',
  ],
  s0320: [
    'Only in Wu times did Funan King Fan Zhan send his kinsman Su Wu to that country; from Funan they put out at Jvli mouth, followed the great bay northwest, passed several countries along the bay\'s edge, and in a little over a year reached the mouth of Tianzhu\'s river; against the current they traveled seven thousand li before arriving.',
    'Only in Wu did Funan\'s King Fan Zhan send his kinsman Su Wu thither: from Funan they sailed from Jvli mouth, tracked the great gulf northwest past many coastal states, and in little over a year reached India\'s river mouth; seven thousand li upstream against the current brought them at last to port.',
  ],
  s0321: [
    'The Tianzhu king was astonished: "At the farthest edge of the sea, there are still people like this."',
    'The Indian king marveled, "At the sea\'s farthest rim, such men still exist."',
  ],
  s0322: [
    'He at once had them shown through the country, and also sent Chen and Song with four Yuezhi horses to report to Zhan; Su Wu and the others returned, and four years passed before they arrived.',
    'He had them toured through the realm and sent Chen and Song back to Zhan with four Yuezhi horses; Su Wu\'s party took four years to return.',
  ],
  s0323: [
    'At that time Wu sent Attendant Kang Tai as envoy to Funan; when he saw Chen, Song, and the others he asked in full about Tianzhu customs, and they said, "It is the country where the Buddha-Dharma arose."',
    'Wu then sent Attendant Kang Tai to Funan; meeting Chen and Song, he questioned them closely on Indian ways, and they said, "That is the land where Buddhism arose."',
  ],
  s0324: [
    'The people are honest and generous; the land is rich and fertile.',
    'Its people are plain and generous, its soil rich and well watered.',
  ],
  s0325: [
    'Their king is titled Maolun.',
    'The king bears the title Maolun.',
  ],
  s0326: [
    'The capital city\'s walls and moats—springs and streams divide and flow around irrigation channels, then descend into the great river.',
    'In the capital, springs branch into channels that ring the walls and feed the great river below.',
  ],
  s0327: [
    'Palaces are all carved and inlaid; streets and lanes, houses and towers, bells and drums and music, dress and incense and flowers—',
    'Palaces are carved and inlaid; streets and markets, houses and towers, bells, drums, and music, dress, incense, and flowers abound;',
  ],
  s0328: [
    'water and land routes connect; merchants meet; rare treasures and fine objects are had at will.',
    'water and land trade freely, merchants throng, and rare wonders may be had for the asking.',
  ],
  s0329: [
    'To left and right are sixteen great countries such as Jiawei, Shewei, and Yabo, two or three thousand li from Tianzhu; all honor and serve it, taking themselves to stand at the center of heaven and earth.',
    'Sixteen great realms—Jiawei, Shewei, Yabo, and others—lie two or three thousand li away yet all honor India as standing at the world\'s center.',
  ],
  s0330: [
    'At the start of Tianjian, King Quduo sent Chief Clerk Zhuluo Da with a memorial saying, "I have heard that your state rests by river and sea, its mountains and rivers secure on every side, every excellence complete, its realm solemn as a Buddha-field.',
    'Early in Tianjian, King Quduo sent Chief Clerk Zhuluo Da with a memorial: "I hear your realm rests on river and sea, walled by mountains and rivers, complete in every excellence, solemn as a pure Buddha-land.',
  ],
  s0331: [
    'Palaces are stately and adorned; streets and lanes are level; the people fill the land, rejoicing in ease and delight.',
    'Palaces stand adorned, streets lie level, and the people fill the land in joy and peace.',
  ],
  s0332: [
    'When the Great King goes abroad, the four armies follow; he is sage and humane and harms no living being.',
    'When the Great King rides abroad, the four hosts attend; sage and humane, he harms no living thing.',
  ],
  s0333: [
    'Within the state ministers and people all follow the upright Law; the Great King, sage and humane, transforms them with the Way, compassionate to all beings, abandoning none.',
    'Ministers and people keep the true Law; the Great King, sage and humane, transforms them by the Way, compassionate to all, leaving none behind.',
  ],
  s0334: [
    'He ever keeps pure precepts, guides those not yet reached, and launches the supreme Dharma-ship to ferry the drowning.',
    'He keeps pure precepts, guides the unreached, and sends forth the supreme Dharma-ship to save the drowning.',
  ],
  s0335: [
    'Officials and common folk receive joy without fear.',
    'Officials and commoners live in joy without dread.',
  ],
  s0336: [
    'Heavenly hosts protect him; myriad spirits attend; heavenly demons are subdued—all turn toward him in reverence.',
    'Heavenly hosts guard him, myriad spirits attend, heavenly demons bow—all revere him.',
  ],
  s0337: [
    'The King\'s person is upright and solemn, like the sun at first rising; his benevolent dew broadly moistens, like a great cloud—among the lands of Zhendan he is most surpassing.',
    'The King\'s bearing is upright as the newly risen sun; his grace spreads like a great cloud—in all the lands of China, none surpass him.',
  ],
  s0338: [
    'In the country where your servant dwells, Shakra guards the realm and keeps the state secure and glad.',
    'In my own land Shakra guards the realm and keeps it safe and glad.',
  ],
  s0339: [
    'Kings have succeeded kings without break.',
    'Kings have followed kings without interruption.',
  ],
  s0340: [
    'Throughout the state are images of the seven treasures, all finely adorned; your servant has disciplined himself like a Buddha-king in the Law.',
    'The land holds seven-jewel images, finely adorned; I have disciplined myself as a Buddha-king in the Law.',
  ],
  s0341: [
    'Your servant is named Quduo, of a royal line for generations.',
    'I am Quduo, of royal blood for generations.',
  ],
  s0342: [
    'I only pray the Great King\'s sacred person be at peace.',
    'I pray only that the Great King\'s sacred person be at peace.',
  ],
  s0343: [
    'Now I offer this state\'s ministers, people, mountains, and treasures—all to belong to you; I cast myself down in the five prostrations and return my heart to the Great King.',
    'Now I offer this realm\'s ministers, people, mountains, and treasures—all to your rule; I prostrate myself and give my heart to the Great King.',
  ],
  s0344: [
    'The envoy Zhuluo Da has long been loyal and trustworthy; therefore I send him now.',
    'The envoy Zhuluo Da has ever been loyal and true; therefore I send him now.',
  ],
  s0345: [
    'If the Great King should need any rare or wondrous thing, I shall send it all.',
    'Should the Great King desire any rare or wondrous thing, I shall send all you require.',
  ],
  s0346: [
    'This land is itself the Great King\'s realm;',
    'this land is itself the Great King\'s realm;',
  ],
  s0347: [
    'the King\'s laws and good Way—I shall all receive and use.',
    'your laws and good Way I shall receive and follow.',
  ],
  s0348: [
    'May envoys of the two states come and go without cease.',
    'May envoys of our two realms pass without cease.',
  ],
  s0349: [
    'When this letter returns, I pray you grant one envoy to proclaim the sacred command and instruct what is fitting.',
    'When this letter returns, grant an envoy to proclaim your sacred command and teach what is fitting.',
  ],
  s0350: [
    'The sincerity of this greeting—I pray it not return empty; if what I report is acceptable, I pray you receive it.',
    'This greeting comes in full sincerity; may it not return unanswered; if what I say is acceptable, I pray you receive it.',
  ],
  s0351: [
    'Now I present glass spittoons, mixed incense, kapok cloth, and other things."',
    'Now I present glass spittoons, mixed incense, kapok cloth, and other gifts."',
  ],
  s0352: [
    'Lion Country',
    'Lion Country',
  ],
  s0353: [
    'Lion Country is a neighboring state of Tianzhu.',
    'Lion Country lies beside India.',
  ],
  s0354: [
    'Its land is temperate; there is no difference between winter and summer.',
    'The climate is mild; winter and summer scarcely differ.',
  ],
  s0355: [
    'The five grains follow whatever men plant; seasons need not be observed.',
    'The five grains grow whenever men sow them; no season need be kept.',
  ],
  s0356: [
    'The country originally had no people—only ghosts and spirits and dragons dwelt there.',
    'Once the land had no people; only ghosts, spirits, and dragons lived there.',
  ],
  s0357: [
    'Merchants of many lands came to trade together; the ghosts and spirits showed no form, but set out treasures and named the price they would accept; merchants took goods according to the price.',
    'Merchants of many lands came to trade; the spirits stayed unseen, set out treasures, and marked the price; traders took goods for the price named.',
  ],
  s0358: [
    'When people of many lands heard the land was pleasant, they raced to come; some stayed, and it gradually became a great country.',
    'Hearing the land was pleasant, men raced thither; some remained, and it grew into a great realm.',
  ],
  s0359: [
    'At the start of Yixi under Jin, they first sent a jade Buddha-image; ten years passed before it arrived.',
    'Early in Jin Yixi they first sent a jade Buddha-image; ten years passed before it arrived.',
  ],
  s0360: [
    'The image was four chi two cun in height; the jade was lustrous and moist, its form extraordinary—hardly the work of human hands.',
    'The image stood four chi two cun tall; the jade glowed moist and bright, its form beyond ordinary craft.',
  ],
  s0361: [
    'This image through Jin and Song stood in Waguan Temple; the temple already had five Buddha-images made by the hand of Recluse Dai Andao and Gu Kaizhi\'s painting of Vimalakirti—men of the age called them the three supreme works.',
    'Through Jin and Song the image stood in Waguan Temple, which already held five Buddha-images by Recluse Dai Andao and Gu Kaizhi\'s Vimalakirti—called the age\'s three supreme works.',
  ],
  s0362: [
    'By the Dong Hun of Qi it was destroyed—the jade image first had its arms cut off, then its body taken, to make hairpins and bracelets for the favorite concubine Pan Guifei.',
    'Under Qi\'s Dong Hun the image was destroyed—arms cut first, then the body taken to make hairpins and bracelets for concubine Pan Guifei.',
  ],
  s0363: [
    'In the sixth and twelfth years of Yuanjia under Song, King Shakramati sent envoys with tribute.',
    'In Song Yuanjia 6 and 12, King Shakramati sent tribute envoys.',
  ],
  s0364: [
    'Eastern Yi and Various Rong',
    'Eastern Yi and Various Rong',
  ],
  s0365: [
    'Among the states of the Eastern Yi, Korea is greatest; it received Gija\'s transformation, and its vessels still preserve ritual and music, it is said.',
    'Of the Eastern Yi, Korea is greatest; civilized by Gija, its vessels still keep ritual and music, they say.',
  ],
  s0366: [
    'In Wei times, east of Korea the Ma Han, Jin Han, and the like communicated with China generation after generation.',
    'Under Wei, Ma Han, Jin Han, and others east of Korea traded with China generation after generation.',
  ],
  s0367: [
    'After Jin crossed the Yangzi, sea envoys eastward included Goguryeo and Baekje; under Song and Qi they often sent tribute and office.',
    'After Jin crossed the river, Goguryeo and Baekje sent sea envoys; under Song and Qi they often paid tribute.',
  ],
  s0368: [
    'When Liang rose, there was increase still.',
    'When Liang arose, contact increased further.',
  ],
  s0369: [
    'Fusang Country—in former times it was unheard of.',
    'Fusang—in former times none had heard of it.',
  ],
  s0370: [
    'In the Putong era a monk claimed to have come from there; his original account was especially thorough, and so it is recorded together here.',
    'In Putong a monk claimed to come from there; his account was unusually full, and so it is recorded here.',
  ],
  s0371: [
    'Goguryeo',
    'Goguryeo',
  ],
  s0372: [
    'The Goguryeo people trace their origin to Dongming.',
    'Goguryeo traces its origin to Dongming.',
  ],
  s0373: [
    'Dongming was originally the son of the Turo king of the Northern Yi.',
    'Dongming was son of the Northern Yi king of Turo.',
  ],
  s0374: [
    'The king went abroad; behind him his serving maid became pregnant; when the king returned he wished to kill her.',
    'The king went abroad; a serving maid conceived in his absence; on his return he meant to kill her.',
  ],
  s0375: [
    'The serving maid said, "Before this I saw qi in the sky like a great hen\'s egg descend upon me, and thus I became pregnant."',
    'She said, "I saw sky-qi like a great egg descend on me, and so I conceived."',
  ],
  s0376: [
    'The king imprisoned her; afterward she bore a boy.',
    'The king imprisoned her; later she bore a son.',
  ],
  s0377: [
    'The king put him in a pigsty; the pigs breathed on him with their breath and he did not die; the king thought him divine and allowed him to be raised.',
    'The king cast him into a pigsty; pigs breathed on him and he lived; the king took him for divine and let him be reared.',
  ],
  s0378: [
    'Grown, he was skilled at archery; the king feared his fierceness and wished to kill him again; Dongming fled south to Yanchi Water, shot the water with his bow, and fish and turtles all floated up to form a bridge; Dongming crossed and reached Buyeo, where he became king.',
    'Grown, he excelled at archery; the king feared his fierceness and sought his life again; Dongming fled south to Yanchi Water, shot the stream, and fish and turtles rose to form a bridge; he crossed, reached Buyeo, and became king.',
  ],
  s0379: [
    'Later a branch separated off as the Goguryeo clan.',
    'Later a branch split away as the Goguryeo clan.',
  ],
  s0380: [
    'Its country was Han\'s Xuantu commandery, east of Liaodong, a thousand li from Liaodong.',
    'Its realm was Han\'s Xuantu commandery, east of Liaodong, a thousand li from Liaodong.',
  ],
  s0381: [
    'In Han and Wei times it bordered Korea and the Hui tribes to the south, Wolu to the east, and Buyeo to the north.',
    'Under Han and Wei it touched Korea and the Hui southward, Wolu eastward, and Buyeo northward.',
  ],
  s0382: [
    'In the fourth year of Yuannfeng under Han Emperor Wu, Korea was destroyed and Xuantu commandery was established; Goguryeo was made a county under it.',
    'In Han Wu\'s fourth Yuannfeng year Korea fell, Xuantu commandery was set up, and Goguryeo was made a county under it.',
  ],
  s0383: [
    'Goguryeo territory was about two thousand li; within it is Liaoshan, whence the Liaoshui flows.',
    'Goguryeo covered some two thousand li; Liaoshan rises there, source of the Liaoshui.',
  ],
  s0384: [
    'The king\'s capital lay below Wandu; there were many great mountains and deep valleys, no plains or marshes; the people lived along the slopes and drank stream water.',
    'The king\'s seat lay below Wandu amid great mountains and deep valleys without plains; people clung to the slopes and drank from streams.',
  ],
  s0385: [
    'Though settled, they had no good farmland; therefore their custom was to eat sparingly.',
    'Though settled, they lacked good fields; so their custom was frugal eating.',
  ],
  s0386: [
    'They liked to build palaces; to the left of where they dwelt they raised a great hall to sacrifice to ghosts and spirits, and also worshipped the scattered stars and the soil-altar.',
    'They loved grand buildings; left of each dwelling stood a hall for ghost and spirit sacrifice, and for worship of scattered stars and the soil-altar.',
  ],
  s0387: [
    'By nature they were fierce and hasty, fond of raiding and plunder.',
    'Fierce and hasty by nature, they loved raiding and plunder.',
  ],
  s0388: [
    'Their offices included xiangjia, duilu, peizhe, guzoujia, chief clerk, youtai, envoy, and zaoyi elder—high and low each had rank.',
    'Offices included xiangjia, duilu, peizhe, guzoujia, chief clerk, youtai, envoy, and zaoyi elder—each rank had its place.',
  ],
  s0389: [
    'In speech and affairs they mostly resembled Buyeo; in temperament and dress they differed.',
    'Speech and custom mostly matched Buyeo; temperament and dress differed.',
  ],
  s0390: [
    'Originally there were five clans: the Xiaonu, Juenu, Shennu, Huannu, and Guilou.',
    'Five clans originally ruled: Xiaonu, Juenu, Shennu, Huannu, and Guilou.',
  ],
  s0391: [
    'Originally the Xiaonu clan held kingship; weakened, the Guilou clan replaced them.',
    'Once the Xiaonu clan held the throne; when they weakened, the Guilou clan replaced them.',
  ],
  s0392: [
    'In Han times they were granted clothes, caps, court dress, and music; they regularly received these from Xuantu commandery.',
    'Han granted them clothes, caps, court dress, and music; they received these regularly from Xuantu commandery.',
  ],
  s0393: [
    'Later they grew gradually arrogant and no longer went to the commandery; they only built a small city on the eastern border to receive the gifts—and to this day that city is called Ze-gou Lou.',
    'Later they grew proud and ceased visiting the commandery, building only a small border town to receive gifts—still called Ze-gou Lou.',
  ],
  s0394: [
    '"Gou Lou" is the Goguryeo word for "city."',
    '"Gou Lou" means "city" in Goguryeo.',
  ],
  s0395: [
    'In appointing offices, if there is a duilu there is no peizhe; if there is a peizhe there is no duilu.',
    'In office, duilu and peizhe are not appointed together—where one stands, the other is omitted.',
  ],
  s0396: [
    'Their custom loves song and dance; in settlements throughout the state, men and women each night gather in groups to sing and play.',
    'They love song and dance; in every settlement men and women gather nightly to sing and play.',
  ],
  s0397: [
    'The people are clean and self-pleasing, skilled at brewing liquor; in bowing they extend one foot; in walking and in steps they always run.',
    'They are fastidious and proud of cleanliness, skilled at brewing; they kowtow on one foot and walk and run at a trot.',
  ],
  s0398: [
    'In the tenth month they hold a great assembly to sacrifice to Heaven, called "Dongming."',
    'In the tenth month they hold a great heaven-sacrifice called "Dongming."',
  ],
  s0399: [
    'At public assemblies their clothes are all brocade and gold and silver for self-adornment.',
    'At public assemblies all dress in brocade and gold and silver adornment.',
  ],
  s0400: [
    'The great xiang and the chief clerk wear on the head something like a cap but without a back;',
    'Great xiang and chief clerks wear headgear like a cap but without a back;',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_054_b4.mjs <translation.json>'
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
