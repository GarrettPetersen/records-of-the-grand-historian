#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Sun, Moon, Five Planets, Fixed Stars, Yellow and Red Paths, Twelve Stations, Lodge Assignments, Dusk-and-Dawn Meridian Stars',
    'Sun and Moon, the Five Planets, Fixed Stars, the Yellow and Red Paths, the Twelve Stations, Assigned Lodges, and Dusk-and-Dawn Meridian Stars',
  ],
  s0002: [
    'Sun, moon, and five planets—from antiquity those who spoke of heaven\'s essence knew them only as the armillary-sphere image.',
    'Since antiquity, heaven\'s "essence" was understood as no more than the sun, moon, and five planets modeled on the armillary sphere.',
  ],
  s0003: [
    'In recent times Westerners made great telescopes and measured the luminaries\' bodies and nearby small stars, halos, vapors, and the like—each age differing; here what their authors recorded.',
    'Recently Westerners built great telescopes and mapped planetary bodies, companion stars, halos, and vapors as their authors recorded—unlike anything known in antiquity.',
  ],
  s0004: [
    'On the sun\'s face are small black shapes, constantly moving to complete one circuit in twenty-eight days.',
    'Sunspots appear on the solar disk and complete one revolution in twenty-eight days.',
  ],
  s0005: [
    'The moon\'s face shows bright scenery under direct sunlight and dark scenery under oblique light.',
    'Full sunlight on the moon yields bright terrain; grazing light yields shadowed terrain.',
  ],
  s0006: [
    'Its surface has highs and lows, so even at full brightness faint dark patches mingle.',
    'Lunar relief leaves faint dark patches even at full phase.',
  ],
  s0007: [
    'Saturn\'s body is egg-shaped; old measures said two ears at its sides; new measures find the disk near the equatorial stars very narrow and the disk far from the equator very wide.',
    'Saturn appears egg-shaped; older observers spoke of "ears," but telescopes show a narrow ring edge-on near the equatorial stars and a broad ring when seen obliquely.',
  ],
  s0008: [
    'At its side are five fixed small stars; the nearest first star travels in a little over two days;',
    'Five attendant stars lie beside it; the innermost completes a circuit in just over two days;',
  ],
  s0009: [
    'the second star in a little over three days;',
    'the second in just over three;',
  ],
  s0010: [
    'the third in four and a half days plus;',
    'the third in about four and a half days;',
  ],
  s0011: [
    'the fourth, slightly larger, in sixteen days;',
    'the fourth, somewhat larger, in sixteen days;',
  ],
  s0012: [
    'the fifth in eighty days.',
    'the fifth in eighty days.',
  ],
  s0013: [
    'All revolve once around Saturn.',
    'All orbit Saturn once per revolution.',
  ],
  s0014: [
    'Jupiter\'s face often shows parallel dark bands; outside are four small stars.',
    'Jupiter shows parallel dark belts with four small stars outside.',
  ],
  s0015: [
    'The first star travels one day and seventy-three quarters;',
    'The innermost moon: one day and seventy-three quarters;',
  ],
  s0016: [
    'the second three days and fifty-three quarters;',
    'the second: three days and fifty-three quarters;',
  ],
  s0017: [
    'the third, slightly larger, seven days and sixteen quarters;',
    'the third, larger: seven days and sixteen quarters;',
  ],
  s0018: [
    'the fourth sixteen days and seventy-two quarters.',
    'the fourth: sixteen days and seventy-two quarters.',
  ],
  s0019: [
    'All revolve once around Jupiter.',
    'All orbit Jupiter once per revolution.',
  ],
  s0020: [
    'Mars\'s face has irregular dark patches within.',
    'Mars shows shifting dark markings on its disk.',
  ],
  s0021: [
    'Venus and Mercury both borrow the sun\'s light; at conjunction, first quarter, full, and last quarter they are like the moon.',
    'Venus and Mercury shine by reflected sunlight and show lunar-like phases from conjunction through full.',
  ],
  s0022: [
    'The Fixed Stars Calendar and Phenomena Compilation says: "Names of fixed stars appear in the Spring and Autumn Annals; the four seasonal midpoint stars and Dipper, Ox, Weaver, Shen, Mao, Ji, Bi, Great Fire, Nongxiang, Dragon Tail, Bird Banner, Yuanji, Yuanyuan and the like are scattered through the Documents, Changes, Odes, Zuo Commentary, and Discourses of the States.',
    'The Fixed Stars section of the Calendar Compilation notes: star names appear in the Spring and Autumn Annals; midpoint stars of the four seasons and groups such as the Dipper, Ox, Weaver, Shen, Mao, Ji, Bi, Great Fire, Nongxiang, Dragon Tail, Bird Banner, Yuanji, and Yuanyuan recur across the Classics.',
  ],
  s0023: [
    'By the Zhou Ritual\'s Director of Astronomy who kept the positions of the twenty-eight stars, and the Monthly Ordinances of the Book of Rites and the Great Dai\'s Lesser Annals of Summer, the seasons of stars\' appearance and hiding were somewhat complete.',
    'The Zhou Ritual\'s astronomer tracked the twenty-eight mansions; the Monthly Ordinances and Great Dai\'s Summer Annals further fixed when stars rose and set.',
  ],
  s0024: [
    'In antiquity men revered heaven and toiled for the people; issuing government by season—all took stars as their record.',
    'Ancient rulers revered heaven, served the people, and timed policy by the stars.',
  ],
  s0025: [
    'After the Qin burning, the old arts of Xihe could no longer be traced; what survived was only the Grand Historian\'s Treatise on the Heavenly Offices, and what it records is brief.',
    'After the Qin bibliocaust the Xihe tradition was lost; only Sima Qian\'s Heavenly Offices survives, and briefly.',
  ],
  s0026: [
    'Later Han Zhang Heng said: \'Of inner and outer offices, those always bright are one hundred twenty-four; nameable ones three hundred twenty; stars two thousand five hundred\'—yet his book does not survive.',
    'Zhang Heng of Later Han wrote that 124 offices shone constantly, 320 could be named, and 2,500 stars were counted—but his treatise is lost.',
  ],
  s0027: [
    'By the Three Kingdoms, Grand Clerk Chen Zhuo first arrayed the star charts of Wu Xian, Gan, and Shi, totaling two hundred eighty-three offices and one thousand four hundred sixty-four stars.',
    'In the Three Kingdoms, Chen Zhuo compiled star maps by Wu Xian, Gan, and Shi: 283 offices and 1,464 stars.',
  ],
  s0028: [
    'Sui\'s Dan Yuanzi made the Steps to Heaven Song, treating the Three Enclosures and Twenty-eight Mansions—one thousand four hundred sixty-seven stars in all—as a bridge for observing the sky, yet there were still no each-star ecliptic and equatorial degrees.',
    'Dan Yuanzi\'s Steps to Heaven Song (Sui) listed the Three Enclosures and Twenty-eight Mansions—1,467 stars—as a sky-watcher\'s guide, but gave no per-star coordinates.',
  ],
  s0029: [
    'From Tang and Song onward, schools measured with armillary instruments and began to have each star\'s lodge entry and polar distance in degrees and minutes—denser than antiquity.',
    'From Tang and Song, instrument surveys yielded lodge longitudes and polar distances for individual stars—far finer than older catalogs.',
  ],
  s0030: [
    '"The New Methods Calculation Book\'s fixed-star tables list one thousand two hundred sixty-six stars in six grades: first magnitude seventeen, second fifty-seven, third one hundred eighty-five, fourth three hundred eighty-nine, fifth three hundred twenty-three, sixth two hundred ninety-five, and four hundred fifty-nine unnamed below grade.',
    '"The New Methods Calculation Book catalogs 1,266 stars in six magnitudes: 17 of the first, 57 of the second, 185 of the third, 389 of the fourth, 323 of the fifth, 295 of the sixth, plus 459 ungraded and unnamed.',
  ],
  s0031: [
    'In Kangxi renzi the Directorate revised the Observational Instruments Treatise; fixed stars were also divided into six grades, but the counts differ slightly.',
    'The Kangxi Directorate\'s 1672 Observational Instruments Treatise also ranks stars in six grades, with slightly different totals.',
  ],
  s0032: [
    'First magnitude sixteen, second sixty-eight, third two hundred eight, fourth five hundred twelve, fifth three hundred forty-two, sixth seven hundred thirty-two—total one thousand eight hundred seventy-eight.',
    'Sixteen of the first magnitude, sixty-eight of the second, 208 of the third, 512 of the fourth, 342 of the fifth, 732 of the sixth—1,878 in all.',
  ],
  s0033: [
    'Observers name stars by what the eye can distinguish, linking nearby ones into a figure and giving it a name.',
    'Observers group stars the eye can resolve into figures and name them.',
  ],
  s0034: [
    'The dim and faint mostly cannot be verified.',
    'Faint stars mostly defy reliable identification.',
  ],
  s0035: [
    'Hence the counts of star offices in each school cannot be made uniform.',
    'So star-office totals differ from school to school.',
  ],
  s0036: [
    'Yet the mansions and the great stars are the same in antiquity, China, and the West.',
    'Major mansions and bright stars nonetheless agree across antiquity, China, and the West.',
  ],
  s0037: [
    '" (closing quotation mark in the source.)',
    '(closing quotation mark in the source.)',
  ],
  s0038: [
    'It also says: "Fixed-star motion is the ancient precession; old methods all held fixed stars unmoving while the ecliptic shifted west;',
    'It adds: "Apparent fixed-star motion is precession. Classical theory held stars fixed while the ecliptic drifted westward;',
  ],
  s0039: [
    'now it is held the ecliptic is unmoving while fixed stars move east.',
    'modern theory holds the ecliptic fixed and stars drifting eastward.',
  ],
  s0040: [
    'If fixed stars were unmoving and the ecliptic shifted west, fixed stars\' ecliptic longitude and latitude should differ each year while equatorial longitude and latitude should never change.',
    'If stars were fixed and only the ecliptic moved west, stellar ecliptic coordinates would change yearly but equatorial ones would not.',
  ],
  s0041: [
    'Now measuring fixed stars\' ecliptic longitude, each year they move east while latitude is unchanged.',
    'Measurement shows ecliptic longitude increasing eastward yearly with latitude constant.',
  ],
  s0042: [
    'As for equatorial longitude, it differs year by year, and latitude even more so.',
    'Equatorial longitude changes annually; latitude changes even more.',
  ],
  s0043: [
    'Among stars of the six palaces from Xingji to Zuishou, those south of the equator have latitude greater in antiquity and gradually less now; those north of the equator the reverse.',
    'From Xingji through Zuishou, stars south of the equator show higher ancient latitudes that now decrease; northern stars show the opposite.',
  ],
  s0044: [
    'Among stars of the six palaces from Zuishou to Xingji, those south of the equator have latitude less in antiquity and gradually more now; those north of the equator the reverse.',
    'From Zuishou back to Xingji, southern stars show lower ancient latitudes that now increase; northern stars reverse again.',
  ],
  s0045: [
    'For all stars within twenty-three and a half degrees of the equator, those north of the equator may cross to the south, and those south may cross north—then fixed stars move east along the ecliptic, and the ecliptic\'s westward shift is clear.',
    'Stars within 23.5° of the equator can cross it north or south—proof that stars move east along the ecliptic rather than the ecliptic sliding west.',
  ],
  s0046: [
    'The New Methods Calculation Book records that before the Westerner Tycho some said fixed stars move east one degree in a hundred years, some in seventy-odd, some in sixty-odd—revised with the times, never settled—like the ancients\' repeated changes to precession.',
    'Before Tycho, Westerners guessed precession at one degree per century, per seventy-odd years, or per sixty-odd—each revision unsettled, mirroring China\'s shifting precession rates.',
  ],
  s0047: [
    'Only at Tycho was it fixed that fixed stars move east fifty-one seconds each year—about seventy-odd years for one degree—and the Yuan\'s Guo Shoujing\'s precession number is also close.',
    'Tycho fixed annual eastward motion at 51 seconds—about one degree in seventy years—close to Guo Shoujing\'s Yuan rate.',
  ],
  s0048: [
    'To the present, one hundred forty-odd years verified in the sky show no error, yet star motion is minute and only after many years does the discrepancy appear.',
    'Observations over 140 years show no error yet, though such minute drift needs centuries to expose.',
  ],
  s0049: [
    'Then Tycho\'s fixed number also cannot be taken as an immutable rate; only by measuring in season and inferring the number from heaven\'s motion will do.',
    'Tycho\'s rate should not be treated as eternal; periodic measurement must track heaven\'s actual motion.',
  ],
  s0050: [
    '" (closing quotation mark in the source.)',
    '(closing quotation mark in the source.)',
  ],
  s0051: [
    'The Compendium of Observational Instruments says: "In Kangxi 13, supervising official Ferdinand Verbiest revised the Observational Instruments Treatise; star names matching antiquity totaled two hundred fifty-nine offices and one thousand one hundred twenty-nine stars—twenty-four offices and three hundred thirty-five stars fewer than the Steps to Heaven Song.',
    'The Compendium records: in 1674 Verbiest revised the star catalog to 259 offices and 1,129 named stars matching antiquity—24 offices and 335 stars fewer than the Steps to Heaven Song.',
  ],
  s0052: [
    'Beyond named constants, five hundred ninety-seven stars were added.',
    'Another 597 stars were added beyond the classical named set.',
  ],
  s0053: [
    'Also twenty-three offices and one hundred fifty stars near the south pole.',
    'Twenty-three south polar offices with 150 stars were added.',
  ],
  s0054: [
    'In recent years repeated measurement and verification show many star-office degrees still not matching the Observational Instruments Treatise.',
    'Recent remeasurements show many coordinates still diverging from Verbiest\'s treatise.',
  ],
  s0055: [
    'Also the ordering of stars is often not sequential and should be rectified.',
    'Star sequences, too, were often out of order and needed correction.',
  ],
  s0056: [
    'Thereupon each star was measured, its degrees inferred, its figure observed, its sequence ordered, and set down in charts.',
    'Officials then measured each star, derived coordinates, noted figures, fixed sequence, and charted the sky anew.',
  ],
  s0057: [
    'Counting the Three Enclosures and Twenty-eight Mansions, star names matching antiquity totaled two hundred seventy-seven offices and one thousand three hundred nineteen stars—eighteen offices and one hundred ninety stars more than the Observational Instruments Treatise, close to the Steps to Heaven Song.',
    'The revised Three Enclosures and Twenty-eight Mansions list 277 offices and 1,319 classical stars—18 offices and 190 stars more than Verbiest, nearer the Steps to Heaven Song.',
  ],
  s0058: [
    'What especially matched antiquity: for the twenty-eight mansions\' successive lodges, from antiquity Mouth (Zi) was always before Shen; which star served as determining star antiquity left unstated.',
    'Classical lodge order always placed Zi (Mouth) before Shen (Three Stars); which star was the determining star remained undocumented.',
  ],
  s0059: [
    'The Tang History says: \'In antiquity Shen\'s right shoulder was taken as determining star\'—too far off.',
    'The Tang History claims the ancient determining star for Shen was its right shoulder—far too remote.',
  ],
  s0060: [
    'The Wenxian Tongkao cites the Song dynasties\' Astronomical Treatises: \'Mouth—three stars, determining star the southwest star;',
    'The Wenxian Tongkao quotes Song astronomical treatises: "For Zi\'s three stars, the determining star is the southwestern one;',
  ],
  s0061: [
    'Shen—ten stars, determining star the one west of the center star.',
    'for Shen\'s ten stars, the star one step west of the center."',
  ],
  s0062: [
    '\'Western method: Zi lodge\'s determining star is the central upper star; Shen also takes the one west of center.',
    'Western method makes Zi\'s determining star the central upper star and Shen\'s the star west of center.',
  ],
  s0063: [
    'Now examining Zi\'s central upper star: it lies only six-odd minutes before the southwest star, yet the southwest star is small and the central upper large—so the central upper may serve as determining star.',
    'Zi\'s central upper star precedes the southwestern by only six minutes and is brighter—so it rightly serves as determining star.',
  ],
  s0064: [
    'If Shen takes the west-of-center star as determining star, then Zi\'s ecliptic degree already lies more than one degree behind Shen—and equatorial degree more than thirty-one minutes behind Shen.',
    'If Shen\'s determining star is west of center, Zi\'s ecliptic longitude falls over a degree past Shen—thirty-one minutes past in equatorial longitude.',
  ],
  s0065: [
    'Now following sequence, taking the eastern of Shen\'s three center stars as determining star, Zi\'s ecliptic degree always stands a little over one degree before Shen—matching the order of Zi before Shen.',
    'Taking the eastern of Shen\'s central trio as determining star keeps Zi about one degree ahead of Shen, preserving classical Zi-before-Shen order.',
  ],
  s0066: [
    'The remaining offices\' stars all follow in sequence without leap or inversion.',
    'Other mansions were sequenced likewise, without leap or reversal.',
  ],
  s0067: [
    'Beyond named constants, one thousand six hundred fourteen stars were added.',
    'Another 1,614 supplemental stars were catalogued.',
  ],
  s0068: [
    'Those near a given office were named supplemental stars of that office, with direction noted in sequence for reference.',
    'Stars near a mansion were labeled as its supplemental stars with positional notes for lookup.',
  ],
  s0069: [
    'The twenty-three south polar offices and one hundred fifty stars invisible in China still follow the old Western survey.',
    'Twenty-three south polar offices (150 stars) unseen in China retain Western survey coordinates.',
  ],
  s0070: [
    'Total: three hundred star offices, three thousand eighty-three stars.',
    'In all: 300 offices and 3,083 stars.',
  ],
  s0071: [
    '" (closing quotation mark in the source.)',
    '(closing quotation mark in the source.)',
  ],
  s0072: [
    'Yellow and red-path twelve stations and lodge assignments: antiquity divided twelve stations as solar terms, so winter solstice was at Chou\'s center, spring equinox at Xu\'s center, summer solstice at Wei\'s center, autumn equinox at Chen\'s center.',
    'The twelve ecliptic stations originally aligned with solar terms: winter solstice at mid-Chou, spring equinox at mid-Xu, summer solstice at mid-Wei, autumn equinox at mid-Chen.',
  ],
  s0073: [
    'Later men used mid-climate qi, so winter solstice fell at the start of Xingji.',
    'Later astronomers used mid-climate points, placing winter solstice at the beginning of Xingji.',
  ],
  s0074: [
    'Antiquity did not know mansions drift east along the ecliptic and did not see precession; they named each station from the starry figure then present—hence Kui and Lou are Jianglou, Fang, Heart, and Tail are Great Fire; later men kept the names while the figures shifted.',
    'Unaware of precession, ancients named stations for then-current constellations—so Kui-Lou became Jianglou and Fang-Heart-Tail Great Fire—names later generations kept though the stars moved on.',
  ],
  s0075: [
    'Over thousands of years the Azure Dragon, Black Tortoise, White Tiger, and Vermilion Bird would even exchange quarters; the twelve stations\' names preserve ancient intent only.',
    'Given millennial drift, even the Four Symbols would swap quadrants; the twelve station names preserve only ancient meaning.',
  ],
  s0076: [
    'Now the lodges at each twelve-station initial degree are fixed for Kangxi jiazi and revised for Qianlong jiazi, all recorded at left.',
    'Below are lodge assignments at each station\'s initial degree for Kangxi jiazi (1684) and the Qianlong jiazi revision.',
  ],
  s0077: [
    'Kangxi jiazi year—ecliptic twelve stations\' initial-degree lodge assignments:',
    'Kangxi jiazi (1684)—ecliptic twelve stations, initial-degree lodges:',
  ],
  s0078: [
    'Xingji: Ji 3° 10\';',
    'Xingji: Ji 3° 10\';',
  ],
  s0079: [
    'Yuanxiao: Ox beginning 23\';',
    'Yuanxiao: Ox 0° 23\';',
  ],
  s0080: [
    'Juzi: Wei 1°;',
    'Juzi: Wei 1°;',
  ],
  s0081: [
    'Jianglou: Encampment 10° 57\';',
    'Jianglou: Encampment (Shi) 10° 57\';',
  ],
  s0082: [
    'Daliang: Lou beginning 27\';',
    'Daliang: Lou 0° 27\';',
  ],
  s0083: [
    'Shishen: Mao 5° 12\';',
    'Shishen: Mao 5° 12\';',
  ],
  s0084: [
    'Zuishou: Zi 10° 38\';',
    'Zuishou: Zi (Mouth) 10° 38\';',
  ],
  s0085: [
    'Zhuohuo: Well 29° 5\';',
    'Zhuohuo: Well (Jing) 29° 5\';',
  ],
  s0086: [
    'Zhuowei: Seven Stars 7° 4\';',
    'Zhuowei: Seven Stars 7° 4\';',
  ],
  s0087: [
    'Shouxing: Wings 10° 37\';',
    'Shouxing: Wings 10° 37\';',
  ],
  s0088: [
    'Dahuo: Horn 10° 34\';',
    'Dahuo: Horn 10° 34\';',
  ],
  s0089: [
    'Ximu: Room 1° 39\'.',
    'Ximu: Room 1° 39\'.',
  ],
  s0090: [
    'Kangxi jiazi year—equatorial twelve stations\' initial-degree lodge assignments:',
    'Kangxi jiazi (1684)—equatorial twelve stations, initial-degree lodges:',
  ],
  s0091: [
    'Xingji: Ji 3° 39\';',
    'Xingji: Ji 3° 39\';',
  ],
  s0092: [
    'Yuanxiao: Southern Dipper 23° 27\';',
    'Yuanxiao: Southern Dipper 23° 27\';',
  ],
  s0093: [
    'Juzi: Wei 2° 34\';',
    'Juzi: Wei 2° 34\';',
  ],
  s0094: [
    'Jianglou: Eastern Wall beginning 42\';',
    'Jianglou: Eastern Wall 0° 42\';',
  ],
  s0095: [
    'Daliang: Lou 5° 42\';',
    'Daliang: Lou 5° 42\';',
  ],
  s0096: [
    'Shishen: Mao 8° 40\';',
    'Shishen: Mao 8° 40\';',
  ],
  s0097: [
    'Zuishou: Zi 10° 29\';',
    'Zuishou: Zi (Mouth) 10° 29\';',
  ],
  s0098: [
    'Zhuohuo: Well 29°;',
    'Zhuohuo: Well (Jing) 29°;',
  ],
  s0099: [
    'Zhuowei: Extended Net 5° 57\';',
    'Zhuowei: Extended Net (Zhang) 5° 57\';',
  ],
  s0100: [
    'Shouxing: Axle Hub beginning 2\';',
    'Shouxing: Axle Hub (Zhen) 0° 2\';',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_028_b01.mjs <translation.json>'
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;

for (const s of data.sentences) {
  const pair = T[s.id];
  if (!pair) continue;
  s.literal = pair[0];
  s.idiomatic = pair[1];
  patched++;
}

const missing = data.sentences.filter((s) => !s.literal || !s.idiomatic);
if (missing.length) {
  console.error(`Missing: ${missing.map((s) => s.id).join(', ')}`);
  process.exit(1);
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patched ${patched} sentences`);
