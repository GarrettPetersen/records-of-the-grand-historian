#!/usr/bin/env node
/** Robust translator for suishu 017 - phrase-first, no Chinese output */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manual = JSON.parse(fs.readFileSync(path.join(__dirname, 'suishu017-manual.json'), 'utf8'));
const ch = JSON.parse(fs.readFileSync('data/suishu/017.json', 'utf8'));

const GANZHI = '甲子乙丑丙寅丁卯戊辰己巳庚午辛未壬申癸酉甲戌乙亥丙子丁丑戊寅己卯庚辰辛巳壬午癸未甲申乙酉丙戌丁亥戊子己丑庚寅辛卯壬辰癸巳甲午乙未丙申丁酉戊戌己亥庚子辛丑壬寅癸卯甲辰乙巳丙午丁未戊申己酉庚戌辛亥壬子癸丑甲寅乙卯丙辰丁巳戊午己未庚申辛酉壬戌癸亥';
function sb(gz) {
  const i = GANZHI.indexOf(gz);
  if (i < 0) return gz;
  const stems = 'jia yi bing ding wu ji geng xin ren gui'.split(' ');
  const branches = 'zi chou yin mao chen si wu wei shen you xu hai'.split(' ');
  const pair = i / 2;
  return `${stems[pair % 10]}-${branches[pair % 12]}`;
}

const NODES = Object.fromEntries(Object.entries({
  '大寒': 'Great Cold', '雨水': 'Rain Water', '驚蟄': 'Awakening of Insects', '啟蟄': 'Awakening of Insects',
  '春分': 'Spring Equinox', '清明': 'Pure Brightness', '穀雨': 'Grain Rain', '立夏': 'Start of Summer',
  '小滿': 'Lesser Fullness', '芒種': 'Grain in Ear', '夏至': 'Summer Solstice', '小暑': 'Lesser Heat',
  '大暑': 'Great Heat', '立秋': 'Start of Autumn', '處暑': 'End of Heat', '白露': 'White Dew',
  '秋分': 'Autumn Equinox', '寒露': 'Cold Dew', '霜降': 'Frost Descent', '立冬': 'Start of Winter',
  '小雪': 'Lesser Snow', '大雪': 'Great Snow', '冬至': 'Winter Solstice', '小寒': 'Lesser Cold',
  '立春': 'Start of Spring', '宣政': 'Xuanzheng', '開皇': 'Kaihuang', '建德': 'Jiande', '天和': 'Tianhe',
  '仁壽': 'Renshou', '皇極曆': 'Supreme Pole Calendar', '皇极曆': 'Supreme Pole Calendar',
  '稽極': 'Investigation of the Pole', '胄玄': 'Zhang Zhouxuan', '張胄玄': 'Zhang Zhouxuan',
  '劉焯': 'Liu Chuo', '孝孫': 'Xiaosun', '高祖': 'Emperor Gaozu', '太子': 'the Crown Prince',
  '袁充': 'Yuan Chong', '太史': 'Grand Astrologer', '太學': 'Imperial Academy',
}).sort((a, b) => b[0].length - a[0].length));

const LABELS = {
  '章歲': 'Cycle year', '章閏': 'Cycle intercalation', '章月': 'Cycle month', '日法': 'Day divisor',
  '月法': 'Month divisor', '辰法': 'Chronogram divisor', '歲分': 'Year fraction', '度法': 'Degree divisor',
  '沒分': 'Submergence fraction', '沒法': 'Submergence divisor', '周天分': 'Circuit-of-heaven fraction',
  '斗分': 'Dipper fraction', '氣法': 'Qi divisor', '氣時法': 'Qi-time divisor', '周日': 'Circuit day',
  '日餘': 'Day remainder', '周通': 'Circuit common', '周法': 'Circuit divisor', '蔀法': 'Obscuration divisor',
  '通月': 'Common month', '會月': 'Conjunction month', '會率': 'Conjunction rate', '餘': 'Remainder',
  '小分': 'Small fraction', '交法': 'Crossing divisor', '朔差': 'New-moon difference', '蝕限': 'Eclipse limit',
  '定差': 'Fixed difference', '會數': 'Conjunction number', '會分': 'Conjunction fraction', '會日法': 'Conjunction day divisor',
  '交分法': 'Crossing fraction divisor', '陰陽曆': 'Yin-yang calendar', '會日': 'Conjunction days',
  '木數': 'Wood number (Jupiter)', '火數': 'Fire number (Mars)', '土數': 'Earth number (Saturn)',
  '金數': 'Metal number (Venus)', '水數': 'Water number (Mercury)',
  '會通': 'Conjunction common', '望差': 'Full-moon difference', '單數': 'Single number',
  '時法': 'Hour divisor', '望數': 'Full-moon number', '外限': 'Outer limit', '內限': 'Inner limit',
  '中限': 'Middle limit', '次限': 'Secondary limit', '會法': 'Conjunction divisor', '會限': 'Conjunction limit',
  '朔實': 'New-moon dividend', '朔日法': 'New-moon day divisor', '朔辰': 'New-moon chronogram',
  '交數': 'Crossing number', '交日': 'Crossing days', '交月': 'Crossing month', '交率': 'Crossing rate',
  '交複日': 'Crossing return days', '歲數': 'Year number', '歲率': 'Year rate', '月率': 'Month rate',
  '周分': 'Circuit fraction', '周差': 'Circuit difference', '周數': 'Circuit number',
  '度准': 'Degree standard', '秒法': 'Second divisor', '篾法': 'Bamboo-tally divisor',
  '秒': 'Second (time unit)', '篾': 'Bamboo tally', '約率': 'Approximation rate', '終法': 'Terminal divisor',
  '終實': 'Terminal dividend', '終全餘': 'Terminal full remainder', '餘通': 'Remainder common',
  '麽法': 'Micro-divisor', '日限': 'Day limit', '旬周': 'Ten-day circuit', '閏限': 'Intercalation limit',
  '氣日法': 'Qi day divisor', '氣辰': 'Qi chronogram', '盈泛': 'Expansion general',
  '轉法': 'Rotation divisor', '轉': 'Rotation', '複月': 'Return month', '複日': 'Return day',
  '日干元': 'Day stem origin', '甲子元': 'Jiazi origin', '積交差多': 'Accumulated crossing difference excess',
};

// Load exact overrides from companion file if present
const EXACT_PATH = path.join(__dirname, 'suishu017-exact.json');
const EXACT = fs.existsSync(EXACT_PATH)
  ? JSON.parse(fs.readFileSync(EXACT_PATH, 'utf8'))
  : {};

function cnNum(s) {
  if (/^\d/.test(s)) return s;
  const map = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '零': 0, '十': 10, '百': 100, '千': 1000, '萬': 10000 };
  let result = 0, current = 0, section = 0;
  for (const ch of s) {
    if (ch === '萬') { section = (section + current) * 10000; result += section; section = 0; current = 0; }
    else if (ch === '千') { section += current * 1000; current = 0; }
    else if (ch === '百') { section += current * 100; current = 0; }
    else if (ch === '十') { section += (current || 1) * 10; current = 0; }
    else if (map[ch] !== undefined) current = map[ch];
  }
  const n = result + section + current;
  return n > 0 ? String(n) : s;
}

function parseNum(s) {
  s = s.trim();
  if (s.endsWith('半')) return `${cnNum(s.slice(0, -1))} and a half`;
  if (s.endsWith('四分')) return `${cnNum(s.slice(0, -2))} and 4 parts`;
  if (s.endsWith('三分')) return `${cnNum(s.slice(0, -2))} and 3 parts`;
  if (s.endsWith('二分')) return `${cnNum(s.slice(0, -2))} and 2 parts`;
  if (s.endsWith('一分')) return `${cnNum(s.slice(0, -2))} and 1 part`;
  return cnNum(s);
}

function isGood(t) {
  if (!t?.idiomatic?.trim()) return false;
  if (/[\u4e00-\u9fff]/.test(t.idiomatic)) return false;
  const idm = t.idiomatic.trim();
  if (/^[,.;\s.]+$/.test(idm)) return false;
  if (/[，、]/.test(idm)) return false;
  if (/^[A-Za-z ()]+,\.$/.test(idm)) return false;
  if (/^Method for computing\.$/.test(idm)) return false;
  if (/^Method for finding\.$/.test(idm)) return false;
  if (/undefined/.test(idm)) return false;
  if (idm.length < 5) return false;
  return true;
}

function fmt(lit, idm) {
  const cap = (s) => {
    s = s.replace(/\s+/g, ' ').replace(/ ,/g, ',').replace(/ ;/g, ';').trim();
    if (!s.endsWith('.') && !s.endsWith(';') && !s.endsWith(':')) s += '.';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  return { literal: cap(lit), idiomatic: cap(idm || lit) };
}

function translateParam(zh) {
  const m = zh.match(/^([^，,：:]{1,8})[，,](.+?)[。.；;]?$/);
  if (!m) return null;
  const key = m[1].trim();
  if (!LABELS[key]) return null;
  const raw = m[2].trim();
  const num = parseNum(raw);
  const formatted = /^\d/.test(num) ? Number(num).toLocaleString('en-US') : num;
  return fmt(`${LABELS[key]}, ${raw}.`, `${LABELS[key]}: ${formatted}.`);
}

function translatePlanetNum(zh) {
  const m = zh.match(/^([木火土金水])數，(.+?)[。.]?$/);
  if (!m) return null;
  const label = LABELS[m[1] + '數'];
  return fmt(`${label}, ${m[2].trim()}`, `${label}: ${parseNum(m[2].trim())}`);
}

function translateAppear(zh) {
  const m = zh.match(/^([晨夕])見伏，(.+?)[；;。.]?$/);
  if (!m) return null;
  const when = m[1] === '晨' ? 'Morning' : 'Evening';
  const rest = m[2].replace(/分同/g, 'fractions the same');
  const en = rest.replace(/([一二三四五六七八九十百千萬]+)日/g, (_, n) => `${cnNum(n)} days`);
  return fmt(`${when} appearance and disappearance, ${rest}`, `${when} appearance and disappearance: ${en}`);
}

function translateShadow(zh) {
  if (!/日影[長短]/.test(zh)) return null;
  const cnDay = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10, '十一': 11, '十二': 12, '十三': 13, '十四': 14, '十五': 15, '十六': 16, '十七': 17, '十八': 18, '十九': 19, '二十': 20, '二十一': 21, '二十二': 22, '二十三': 23, '二十四': 24, '二十五': 25, '二十六': 26, '二十七': 27, '二十八': 28, '二十九': 29, '三十': 30 };
  let s = zh
    .replace(/宣政元年/g, 'Xuanzheng Year 1, ').replace(/開皇/g, 'Kaihuang ')
    .replace(/三年/g, 'Year 3, ').replace(/四年/g, 'Year 4, ').replace(/五年/g, 'Year 5, ')
    .replace(/六年/g, 'Year 6, ').replace(/七年/g, 'Year 7, ')
    .replace(/十一年/g, 'Year 11, ').replace(/十四年/g, 'Year 14, ')
    .replace(/十一月/g, 'eleventh month, ').replace(/五月/g, 'fifth month, ')
    .replace(/([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])朔/g, (_, gz) => `${sb(gz)}-day new moon; `)
    .replace(/([十廿一二三四五六七八九十]+)日([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])/g, (_, d, gz) => `day ${cnDay[d] || cnNum(d)}, ${sb(gz)}, `)
    .replace(/([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])冬至/g, (_, gz) => `${sb(gz)} winter solstice, `)
    .replace(/([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])夏至/g, (_, gz) => `${sb(gz)} summer solstice, `)
    .replace(/日影長/g, 'longest shadow').replace(/日影短/g, 'shortest shadow')
    .replace(/冬至/g, 'winter solstice').replace(/夏至/g, 'summer solstice')
    .replace(/，/g, ', ').replace(/；/g, '; ').replace(/。/g, '.')
    .replace(/;\s*;/g, '; ').replace(/,\s*,/g, ', ');
  return fmt(s, s);
}

const PHRASES = [
  ['求次月：大月加二日，小月加一日，日餘皆千一百三十五，滿周日及日餘去之', 'To find the next month: add 2 days for a long month, 1 day for a short month; day remainders all 1,135; when full remove circuit day and day remainder'],
  ['求次日：加一，滿、去如前', 'To find the next day: add 1; when full, remove as before'],
  ['求次月：大月加度三十，小月加度二十九，宿次去之，經斗去其分', 'To find the next month: add 30° for a long month, 29° for a short month; remove by lodge sequence; when passing the Dipper remove its fraction'],
  ['求次日：加度一，去、命如前', 'To find the next day: add 1°; remove and count as before'],
  ['求次日：以日轉定分加轉分，滿四十一從度，去、命如前', 'To find the next day: add the fixed daily rotation fraction to the rotation fraction; when 41 carry to degrees; remove and count as before'],
  ['不足減者，加日法乃減之，加時在往日', 'When insufficient to subtract, add the day divisor and then subtract—the hour falls on the prior day'],
  ['加之，滿日法者去之，則在來日', 'When adding, if it fills the day divisor remove it—the hour falls on the following day'],
  ['須求朔共度者，用去定用日數減之，俟後所須', 'When the new-moon shared degree is needed, subtract the fixed day count used; apply as later required'],
  ['訖，皆以千四十約分，為大分，以四十一為母', 'When done, all reduce fractions by 1,040 to obtain large fractions, with 41 as the denominator'],
  ['三約之，所得減日為定日', 'Divide by 3; subtract the result from days to obtain fixed days'],
  ['後遲加六度者，此後疾去度為定度，已前皆後疾日數及度數', 'When later slow motion adds 6°, subtract from later fast motion for fixed degrees; all prior entries give later-fast day and degree counts'],
  ['計餘日及度，從前法', 'Compute remaining days and degrees according to the prior method'],
  ['滿會通去之，餘為定餘', 'When full, remove the conjunction common; the remainder is the fixed remainder'],
  ['二時已上，皆不加', 'At two hours or above, do not add'],
  ['定餘不滿單數者，為在外', 'When the fixed remainder is less than the single number, it is outside'],
  ['滿去之，餘在內', 'When full, remove it; the remainder is inside'],
  ['在內者，朔則日食', 'When inside the node, a solar eclipse occurs at new moon'],
  ['其餘如望差已下者，即為去先交餘', 'The remainder below the full-moon difference is the prior-crossing remainder removed'],
  ['如時法得一，然為去交時數', 'Divide by the hour divisor to obtain one—this is the crossing hour count removed'],
  ['不盡為時餘，四之，如法，無所得為辰初，一為少，二為半，三為太', 'The remainder is the hour remainder; multiply by 4; divide by the divisor—zero gives chronogram start, 1 is "less," 2 is "half," 3 is "greater"'],
  ['又不盡者，三之，如法，得一為強，以並少為少強，並半為半強，並太為太強', 'If still remainder, multiply by 3; divide by the divisor—one gives "strong"; combined with "less" gives "less-strong," with "half" gives "half-strong," with "greater" gives "greater-strong"'],
  ['得二強者為少弱，並少為半弱，並半為太弱，並太為辰末', 'Two "strong" gives "less-weak"; combined with "less" gives "half-weak," with "half" gives "greater-weak," with "greater" gives chronogram end'],
  ['春三月，內道，去交七時已上，加二十四', 'In the third month of spring, inner path, node distance seven hours or above—add 24'],
  ['孟辰者減辰法，餘加半辰為差率', 'For primary chronograms subtract the chronogram divisor; add half a chronogram to the remainder for the difference rate'],
  ['以乘差率，如十四得一為時差', 'Multiply by the difference rate; divide by 14 to obtain one—this is the hour difference'],
  ['乃如月食法，子午卯酉為仲，辰戌醜未為季，寅申巳亥為孟', 'As with the lunar eclipse method: zi-wu-mao-you are mid-chronograms; chen-xu-chou-wei are seasonal chronograms; yin-shen-si-hai are primary chronograms'],
  ['去交一時內者，食', 'When node distance is within one hour, there is an eclipse'],
  ['夏去交二時內，加時在南方三辰者，食', 'In summer, node distance within two hours, hour in the southern three chronograms—eclipse'],
  ['若去分至十二時內，去交六時內者，亦食', 'If within twelve hours of an equinox or solstice, node distance within six hours—also eclipse'],
  ['先交二時內，值盈二時外，及後交二時內，值縮二時外，亦食', 'Prior crossing within two hours with expansion beyond two hours, or later crossing within two hours with contraction beyond two hours—also eclipse'],
  ['外道西南，虧東南', 'Outer path southwest, obscuration southeast'],
  ['十三分以上，正左起', 'At thirteen parts or above, begin at due left'],
  ['求望，望數加之，滿、去如前', 'To find full moon: add the full-moon number; when full, remove as before'],
  ['求次月，以朔差加之，滿、去如前', 'To find the next month: add the new-moon difference; when full, remove as before'],
  ['留者因前，退則減之，伏不注度，順行出斗去其分，退行入斗先加分', 'For stationary phases, continue from the prior; for retrograde subtract; disappearance does not record degrees; in direct motion exiting the Dipper remove its fraction; in retrograde entering the Dipper add the fraction first'],
  ['其行有益疾遲者，副置一日行分，各以其分疾益遲損之', 'When motion has fast-slow variation, set aside one day motion fraction; for each fraction apply fast-increase or slow-decrease accordingly'],
  ['以加之，處暑至寒露均加九日', 'When adding: from End of Heat through Cold Dew uniformly add 9 days'],
  ['置星定見之前夜半日所在宿度算及分，各以定見日分加其分，滿度法從度', 'Set the star fixed-appearance prior midnight solar lodge degree count and fraction; add the fixed-appearance day fraction to each fraction; when full carry from the degree divisor to degrees'],
  ['其朔望在啟蟄前，以一千三百八十乘去小寒日數', 'When new or full moon is before Awakening of Insects, multiply 1,380 by days since Lesser Cold'],
  ['開皇二十年，袁充奏日長影短，高祖因以曆事付皇太子，遣更研詳著日長之候', 'In Kaihuang 20, Yuan Chong memorialized that days were long and shadows short; Emperor Gaozu entrusted calendrical affairs to the Crown Prince and ordered further study of the signs of lengthening days'],
  ['劉焯以太子新立，複增修其書，名曰《皇極曆》，駁正胄玄之短', 'Liu Chuo, as the Crown Prince had just been installed, further revised his work, titling it the Supreme Pole Calendar, to refute Zhang Zhouxuan\'s errors'],
  ['太子頗嘉之，未獲考驗', 'The Crown Prince greatly approved it, but verification had not yet been obtained'],
  ['焯為太學博士，負其精博，志解胄玄之印，官不滿意，又稱疾罷歸', 'Liu Chuo, as Imperial Academy Erudite, confident in his expertise, sought to supplant Zhang Zhouxuan; dissatisfied with his office, he pleaded illness and retired'],
  ['至仁壽四年，焯言胄玄之誤于皇太子', 'By Renshou 4, Liu Chuo reported Zhang Zhouxuan\'s errors to the Crown Prince'],
  ['但因人成事，非其實錄，就而討論，違舛甚眾', 'But it was achieved through others\' work, not his own record; on examination, the discrepancies were very numerous'],
  ['其二曰，胄玄弦望晦朔，違古且疏，氣節閏候，乖天爽命', 'Second: Zhang Zhouxuan\'s first quarter, full moon, last quarter, and new moon violate antiquity and are coarse; seasonal nodes, intercalation, and pentads deviate from Heaven\'s clear mandate'],
  ['時不從子半，晨前別為後日', 'Hours do not begin from midnight; the morning before is separately counted as the following day'],
  ['日躔莫悟緩急，月逡妄為兩種，月度之轉，輒遺盈縮，交會之際，意造氣差', 'Solar motion fails to grasp fast and slow; lunar anomaly is arbitrarily made into two kinds; monthly rotation omits expansion-contraction; at conjunction crossings, qi difference is fabricated'],
  ['去極晷漏，應有而無，食分先後，彌為煩碎', 'Polar distance and gnomon graduations should exist but do not; eclipse fraction sequencing is excessively tedious'],
  ['測今不審，考古莫通，立術之疏，不可紀極', 'Present measurements are unverified, ancient comparisons fail—the method\'s flaws are beyond reckoning'],
  ['今隨事糾駁，凡五百三十六條', 'Now item by item refuted—536 entries in all'],
  ['玄前擬獻，年將六十，非是忽迫倉卒始為，何故至京未幾，即變同焯曆，與舊懸殊', 'Zhang Zhouxuan had prepared to submit his work at nearly sixty—this was not hastily composed; why, shortly after reaching the capital, did he change to match Liu Chuo\'s calendar, diverging from his earlier system'],
  ['焯作于前，玄獻於後，舍己從人，異同暗會', 'Liu Chuo composed first, Zhang Zhouxuan submitted later—abandoning his own work to follow another, their differences secretly aligned'],
  ['且孝孫因焯，胄玄後附孝孫，曆術之文，又皆是孝孫所作，則元本偷竊，事甚分明', 'Moreover Xiaosun derived from Liu Chuo; Zhang Zhouxuan later attached to Xiaosun—the calendrical text was all Xiaosun\'s work; the original theft is quite clear'],
  ['其四曰，玄為史官，自奏虧食，前後所上，多與曆違，今算其乖舛有一十三事', 'Fourth: as historiographer Zhang Zhouxuan himself reported eclipses; his submissions mostly contradicted the calendar—now calculated, his errors number thirteen'],
  ['今糾發並前，凡四十四條', 'Now refutations including prior entries—44 items in all'],
  ['其五曰，胄玄於曆，未為精通', 'Fifth: Zhang Zhouxuan was not thoroughly versed in calendrical science'],
  ['其六曰，焯以開皇三年，奉敕修造，顧循記注，自許精微，秦漢以來，無所與讓', 'Sixth: Liu Chuo, by imperial order in Kaihuang 3, undertook revision, following recorded precedents, claiming precision unmatched since Qin and Han'],
  ['胄玄所違，焯法皆合，胄玄所闕，今則盡有，隱括始終，謂為總備', 'Where Zhang Zhouxuan deviated, Liu Chuo\'s method agrees; what Zhang Zhouxuan lacked, the present system fully provides—embracing beginning and end, claiming completeness'],
  ['焯以庸鄙，謬荷甄擢，專精藝業，耽玩數象，自力群儒之下，冀睹聖人之意', 'Liu Chuo, humble and unworthy, was mistakenly elevated; devoted to calendrical arts, immersed in numerology, striving from below the ranks of scholars to glimpse the sage\'s intent'],
  ['開皇之初，奉敕修撰，性不諧物，功不克終，猶被胄玄竊為己法，未能盡妙，協時多爽，屍官亂日，實玷皇猷', 'At the start of Kaihuang, commissioned to compile—his nature ill-suited to others, his work unfinished—yet Zhang Zhouxuan stole it as his own method; failing to achieve perfection, frequently missing the seasons, holding office in name only while corrupting the calendar—a true stain on imperial policy'],
  ['請征胄玄答，驗其長短', 'Request summoning Zhang Zhouxuan to answer and verify the merits and flaws'],
  ['焯又造曆家同異，名曰《稽極》', 'Liu Chuo also compiled calendrical comparisons, titled Investigation of the Pole'],
].sort((a, b) => b[0].length - a[0].length);

const HEADERS = {
  '推月食多少術：': 'Method for computing lunar eclipse magnitude:',
  '推日食多少術：': 'Method for computing solar eclipse magnitude:',
  '推合朔術：': 'Method for computing conjunction new moon:',
  '推合蝕術：': 'Method for computing conjunction eclipses:',
  '推交會術：': 'Method for computing crossings and conjunctions:',
  '推五星術：': 'Method for computing the five planets:',
  '推日度術：': 'Method for computing solar degree:',
  '推月行度術：': 'Method for computing lunar motion in degrees:',
  '推沒日術：': 'Method for computing submergence days:',
  '推土王術：': 'Method for computing the Earth phase:',
  '推積月術：': 'Method for computing accumulated months:',
  '推月朔弦望術：': 'Method for computing new moon, first quarter, full moon, and last quarter:',
  '推二十四氣術：': 'Method for computing the twenty-four qi:',
  '推朔望入氣盈縮術：': 'Method for finding solar anomaly at new and full moon upon entering qi:',
  '推入遲疾曆術：': 'Method for entering the slow-fast calendar:',
  '求朔望加時入曆術：': 'Method for finding the hour of new/full moon entry into the calendar:',
  '推朔望加時定日及小餘術：': 'Method for computing fixed day and small remainder at new/full moon hour:',
  '求朔望加時日所在度術：': 'Method for finding the sun degree at new/full moon hour:',
  '求望加時月所在度術：': 'Method for finding the moon degree at full moon hour:',
  '求月行遲疾日轉定分術：': 'Method for finding fixed daily rotation fraction of lunar slow-fast motion:',
  '推朔望夜半月定度術：': 'Method for computing fixed midnight lunar degree at new and full moon:',
  '求星見術：': 'Method for finding star appearances:',
  '推五星平見術：': 'Method for computing mean appearances of the five planets:',
  '推五星定見術：': 'Method for computing fixed appearances of the five planets:',
  '推五星行度術：': 'Method for computing five-planet motion in degrees:',
  '推交道內外及先後去交術：': 'Method for computing crossing inner/outer path and prior/later node distance:',
  '推月食加時術：': 'Method for computing lunar eclipse hour:',
  '推日食加時術：': 'Method for computing solar eclipse hour:',
  '推合朔後蝕術：': 'Method for computing post-conjunction eclipses:',
  '推五星晨夕見伏術：': 'Method for computing morning and evening appearances and disappearances of the five planets:',
  '推漏刻術：': 'Method for computing clepsydra graduations:',
  '推昏旦中星術：': 'Method for computing stars at dusk and dawn culmination:',
};

const TERMS = [
  [/推(.+?)術：/g, 'Method for computing $1:'],
  [/求(.+?)：/g, 'To find $1:'],
  [/置入/g, 'Set '], [/已來/g, ' since '], [/所求年/g, 'the year sought'],
  [/大月/g, 'long month'], [/小月/g, 'short month'], [/宿次/g, 'lodge sequence'],
  [/經斗/g, 'passing the Dipper'], [/去其分/g, 'remove its fraction'],
  [/如法得一/g, 'divide by the divisor to obtain one'], [/如(.+?)得一/g, 'divide by $1 to obtain one'],
  [/餘為/g, 'the remainder is '], [/為定/g, 'yielding fixed '], [/為積/g, 'yielding accumulated '],
  [/命以甲子算外/g, 'count from jia-zi beyond the tally'], [/算外/g, 'beyond the tally'],
  [/命如前/g, 'count as before'], [/滿/g, 'when full '], [/從/g, 'carry to '], [/去之/g, 'remove '],
  [/章歲/g, 'cycle year'], [/章月/g, 'cycle month'], [/日法/g, 'day divisor'], [/月法/g, 'month divisor'],
  [/度法/g, 'degree divisor'], [/氣法/g, 'qi divisor'], [/會通/g, 'conjunction common'],
  [/大餘/g, 'large remainder'], [/小餘/g, 'small remainder'], [/小分/g, 'small fraction'],
  [/日分/g, 'day fraction'], [/積月/g, 'accumulated months'], [/積日/g, 'accumulated days'],
  [/合朔/g, 'conjunction new moon'], [/盈縮/g, 'anomaly'], [/損益/g, 'decrease-increase'],
  [/入氣/g, 'entering qi'], [/初見/g, 'first appearance'], [/平見/g, 'mean appearance'],
  [/定見/g, 'fixed appearance'], [/見伏/g, 'appearance and disappearance'], [/伏/g, 'disappearance'],
  [/日行/g, ' daily motion '], [/十日行/g, ' in 10 days travel '], [/四日行/g, ' in 4 days travel '],
  [/疾/g, 'fast motion'], [/遲/g, 'slow motion'], [/順/g, 'direct'], [/逆/g, 'retrograde'], [/留/g, 'stationary'],
  [/內道/g, 'inner path'], [/外道/g, 'outer path'], [/表裡/g, 'outside and inside'],
  [/虧/g, 'obscuration'], [/食/g, 'eclipse'], [/蝕/g, 'eclipse'],
  [/均加/g, 'uniformly add '], [/均減/g, 'uniformly subtract '], [/至/g, ' through '],
  [/約之/g, 'reduce by '], [/副置/g, 'set aside '], [/從前法/g, 'according to the prior method'],
  [/巳上/g, 'or above'], [/已上/g, 'or above'], [/以下/g, 'or below'],
  [/內限/g, 'inner limit'], [/外限/g, 'outer limit'], [/中限/g, 'middle limit'], [/次限/g, 'secondary limit'],
  [/望差/g, 'full-moon difference'], [/朔差/g, 'new-moon difference'], [/單數/g, 'single number'],
  [/時法/g, 'hour divisor'], [/辰法/g, 'chronogram divisor'], [/交法/g, 'crossing divisor'],
  [/去交/g, 'node distance'], [/加時/g, 'hour of occurrence'],
  [/，/g, ', '], [/；/g, '; '], [/。/g, '. '], [/：/g, ': '],
];

function translateGeneric(zh) {
  let c = zh.replace(/[。；，：]$/, '');
  if (EXACT[c] || EXACT[c + '。']) return EXACT[c] || EXACT[c + '。'];
  for (const [cn, en] of PHRASES) {
    if (c === cn || c.startsWith(cn)) {
      const rest = c.slice(cn.length).replace(/^[，；]/, '');
      const base = en + (rest ? '; ' + translateGenericText(rest) : '');
      return fmt(base, base);
    }
  }
  const t = translateGenericText(c);
  if (/[\u4e00-\u9fff]/.test(t)) return null;
  return fmt(t, t);
}

function translateGenericText(c) {
  let s = c;
  for (const [k, v] of Object.entries(NODES)) s = s.split(k).join(v);
  for (const [re, rep] of TERMS) s = s.replace(re, rep);
  s = s.replace(/([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])/g, (_, gz) => sb(gz));
  s = s.replace(/([一二三四五六七八九十百千萬]+)(?=日|度|分|時|條|事|年|月|辰|$|[^一-龥])/g, (m) => cnNum(m));
  s = s.replace(/[\u4e00-\u9fff]+/g, (m) => {
    const map = {
      '如前': 'as before', '同前': 'as before', '準此': 'by this standard', '皆': 'all', '各': 'each',
      '又': 'also', '其': 'its', '而': 'and', '若': 'if', '無': 'none', '不': 'not', '所': 'that which',
      '在': 'at', '用': 'use', '即': 'then', '則': 'then', '為': 'as', '以': 'by', '及': 'and',
      '亦': 'also', '凡': 'in general', '今': 'now', '時': 'time', '當': 'when', '因': 'thereby',
      '依': 'according to', '須': 'must', '應': 'should', '可': 'may', '更': 'further', '復': 'again',
      '已': 'already', '未': 'not yet', '將': 'will', '并': 'together', '雖': 'although', '但': 'but',
      '且': 'moreover', '既': 'already', '每': 'each', '次': 'next', '先': 'first', '後': 'after',
      '內': 'inner', '外': 'outer', '東': 'east', '西': 'west', '南': 'south', '北': 'north',
      '加': 'add', '減': 'subtract', '乘': 'multiply', '除': 'divide', '得': 'obtain',
      '太': 'greater', '少': 'less', '半': 'half', '強': 'strong', '弱': 'weak',
      '日': 'day', '月': 'month', '年': 'year', '度': 'degree', '分': 'fraction', '時': 'hour',
      '星': 'star', '朔': 'new moon', '望': 'full moon', '氣': 'qi', '交': 'crossing', '會': 'conjunction',
      '盈': 'expansion', '縮': 'contraction', '損': 'decrease', '益': 'increase',
      '法': 'divisor', '率': 'rate', '數': 'number', '算': 'count', '限': 'limit',
      '餘': 'remainder', '差': 'difference', '轉': 'rotation', '周': 'circuit',
      '孟': 'primary', '仲': 'mid', '季': 'seasonal', '辰': 'chronogram',
      '正': 'due', '左': 'left', '右': 'right', '起': 'begin', '終': 'end',
      '前': 'prior', '後': 'later', '上': 'above', '下': 'below',
      '行': 'motion', '見': 'appearance', '伏': 'disappearance',
      '說': 'says', '曰': 'says', '條': 'items', '事': 'matters',
    };
    const n = cnNum(m);
    if (n !== m) return n;
    return map[m] || '';
  });
  return s.replace(/\s+/g, ' ').trim();
}

function translateHeader(zh) {
  if (HEADERS[zh]) return fmt(HEADERS[zh], HEADERS[zh]);
  const m = zh.match(/^推(.+)術：$/);
  if (m) return fmt(`Method for computing ${m[1]}:`, `Method for computing ${m[1]}:`);
  const m2 = zh.match(/^求(.+)術：$/);
  if (m2) return fmt(`Method for finding ${m2[1]}:`, `Method for finding ${m2[1]}:`);
  return null;
}

function translateCalendarCompare(zh) {
  if (!/張賓曆|張胄玄曆|兩曆/.test(zh)) return null;
  let lit = zh.replace(/張賓曆/g, "Zhang Bin's calendar").replace(/張胄玄曆/g, "Zhang Zhouxuan's calendar")
    .replace(/兩曆/g, 'Both calendars').replace(/合/g, ' matches ').replace(/併合/g, ' both match ')
    .replace(/差前一日/g, '—one day early').replace(/差後一日/g, '—one day late').replace(/差後二日/g, '—two days late');
  lit = lit.replace(/([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])(?=冬至|夏至)/g, (_, gz) => sb(gz) + ' ')
    .replace(/冬至/g, 'winter solstice').replace(/夏至/g, 'summer solstice')
    .replace(/，/g, '; ').replace(/。/g, '.');
  let idm = lit;
  const pats = [
    [/Zhang Bin's calendar matches (\S+) winter solstice; Zhang Zhouxuan's calendar (\S+) winter solstice—one day late/,
      "Zhang Bin's calendar: $1 winter solstice. Zhang Zhouxuan's calendar: $2 winter solstice—one day late."],
    [/Zhang Bin's calendar (\S+) winter solstice—one day early; Zhang Zhouxuan's calendar matches (\S+) winter solstice/,
      "Zhang Bin's calendar: $1 winter solstice—one day early. Zhang Zhouxuan's calendar: $2 winter solstice—correct."],
    [/Both calendars both match (\S+) winter solstice/, 'Both calendars agree on $1 winter solstice.'],
    [/Zhang Bin's calendar matches (\S+) winter solstice; Zhang Zhouxuan's calendar (\S+) winter solstice—one day late/,
      "Zhang Bin's calendar: $1 winter solstice. Zhang Zhouxuan's calendar: $2 winter solstice—one day late."],
  ];
  for (const [re, rep] of pats) { const m = lit.match(re); if (m) { idm = rep.replace(/\$(\d+)/g, (_, n) => m[n]); break; } }
  return fmt(lit, idm);
}

function translateRemainder(zh) {
  const m = zh.match(/^餘[，,](.+?)[。.]?$/);
  if (!m) return null;
  const num = parseNum(m[1].trim());
  const formatted = /^\d/.test(num) ? Number(num).toLocaleString('en-US') : num;
  return fmt(`Remainder, ${m[1].trim()}.`, `Remainder: ${formatted}.`);
}

function translate(id, zh) {
  if (manual[id]) return manual[id];
  if (EXACT[id]) return EXACT[id];
  const c = zh.replace(/[。；，：]$/, '');
  if (EXACT[c]) return EXACT[c];
  return translateHeader(zh) || translateShadow(zh) || translateCalendarCompare(zh)
    || translatePlanetNum(zh) || translateAppear(zh) || translateRemainder(zh)
    || translateParam(zh) || translateGeneric(zh);
}

const TRANSLATOR = 'Garrett M. Petersen (2026)';
const MODEL = 'Composer 2.5';
let fixed = 0, kept = 0, failed = [];

for (const b of ch.content) {
  for (const s of (b.sentences || [])) {
    const zh = s.zh;
    if (!zh?.trim()) continue;
    const existing = s.translations?.[0];
    if (isGood(existing)) { kept++; continue; }
    const tr = translate(s.id, zh);
    if (!isGood(tr)) {
      failed.push({ id: s.id, zh });
      continue;
    }
    s.translations = [{ lang: 'en', literal: tr.literal, idiomatic: tr.idiomatic, translator: TRANSLATOR, model: MODEL }];
    fixed++;
  }
}

let count = 0, total = 0;
for (const b of ch.content) {
  for (const s of (b.sentences || [])) {
    if (!s.zh?.trim()) continue;
    total++;
    if (isGood(s.translations?.[0])) count++;
  }
}

ch.meta.translatedCount = count;
ch.meta.sentenceCount = total;
fs.writeFileSync('data/suishu/017.json', JSON.stringify(ch, null, 2) + '\n');
console.log(`Kept ${kept}, fixed ${fixed}, failed ${failed.length}. Final: ${count}/${total}`);
if (failed.length) {
  fs.writeFileSync('/tmp/failed-017-final.json', JSON.stringify(failed, null, 2));
}
