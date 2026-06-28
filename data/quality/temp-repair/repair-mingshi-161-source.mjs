#!/usr/bin/env node
/**
 * Patch manualTranslations for mingshi/161 source-correspondence items.
 */

import fs from 'node:fs';

const QUEUE_PATH = 'data/quality/source-correspondence-corpus-wikisource-mingshi.json';
const META = {
  translator: 'Garrett M. Petersen (2026)',
  model: 'Composer 2.5',
};

function withMeta(rows) {
  return rows.map((row) => ({ ...row, ...META }));
}

const ZHOU_XIN_OMISSION = withMeta([
  {
    zh: '成祖即位，改監察御史。',
    literal: 'When the Yongle Emperor took the throne, Xin was transferred to investigating censor.',
    idiomatic: 'When the Yongle Emperor took the throne, Xin was transferred to investigating censor.',
  },
  {
    zh: '敢言，多所彈劾。',
    literal: 'He spoke boldly and impeached many.',
    idiomatic: 'He spoke boldly and impeached many.',
  },
  {
    zh: '貴戚震懼，目為「冷面寒鐵」。',
    literal: 'Nobles and kinsmen were terrified and called him the "Cold-Faced Iron."',
    idiomatic: 'Nobles and kinsmen were terrified and called him "Cold-Faced Iron."',
  },
  {
    zh: '京師中至以其名怖小兒，輒皆奔匿。',
    literal: 'In the capital they even used his name to frighten small children, who would all flee and hide.',
    idiomatic: 'In the capital they even used his name to frighten small children, who would all flee and hide.',
  },
  {
    zh: '巡按福建，奏請都司衛所不得凌府州縣，府衛官相見均禮，武人為之戢。',
    literal: 'On inspection tour in Fujian he memorialized that provincial command guards must not bully prefectures and counties, that guard and prefectural officials should meet on equal ceremonial footing, and the military were thereby restrained.',
    idiomatic: 'On an inspection tour of Fujian he memorialized that provincial command guards must not bully prefectures and counties, that guard and prefectural officials should meet on equal ceremonial footing, and the military were thereby restrained.',
  },
  {
    zh: '改按北京。',
    literal: 'He was reassigned to inspect Beijing.',
    idiomatic: 'He was reassigned to inspect Beijing.',
  },
  {
    zh: '時令吏民罪徒流者耕北京閑田，監禁詳擬，往復待報，多瘐死。',
    literal: 'At the time officials and commoners sentenced to penal servitude or exile were made to farm idle land around Beijing; prisons drafted detailed proposals and waited back and forth for approval, and many died of neglect in custody.',
    idiomatic: 'At the time officials and commoners sentenced to penal servitude or exile were made to farm idle land around Beijing; prisons drafted detailed proposals and waited back and forth for approval, and many died of neglect in custody.',
  },
  {
    zh: '新請從北京行部或巡按詳允就遣，以免淹滯。',
    literal: 'Xin requested that approval be granted on the spot by the Beijing regional administration or the touring inspector, to avoid delays.',
    idiomatic: 'Xin asked that the Beijing regional administration or the touring inspector approve and dispatch cases on the spot, to avoid delays.',
  },
  {
    zh: '從之。',
    literal: 'The proposal was adopted.',
    idiomatic: 'Approved.',
  },
  {
    zh: '且命畿內罪人應決者許收贖。',
    literal: 'Moreover, criminals in the capital region who were due for execution were permitted to redeem their sentences.',
    idiomatic: 'Moreover, criminals in the capital region who were due for execution were permitted to redeem their sentences.',
  },
  {
    zh: '帝知新，所奏無不允。',
    literal: 'The emperor knew Xin well, and none of his memorials went unapproved.',
    idiomatic: 'The emperor knew Xin well, and none of his memorials went unapproved.',
  },
]);

const YING_LUPING_OMISSION = withMeta([
  {
    zh: '山雲鎮廣西以備蠻，歲調貴州軍萬人，春秋更代，還多逃亡，則取原衛軍以補，不逐逃者。',
    literal: 'Shan Yun guarded Guangxi against the barbarians, annually transferring ten thousand Guizhou troops who were rotated in spring and autumn; many fled on return, so original guard troops were taken to fill the rolls while deserters were not pursued.',
    idiomatic: 'Shan Yun guarded Guangxi against the barbarians, annually transferring ten thousand Guizhou troops on spring and autumn rotations; many fled on return, so original guard troops were used to fill the rolls while deserters were not pursued.',
  },
  {
    zh: '履平奏：「貴州四境皆苗蠻，軍伍虛，有急孰與戰守？',
    literal: 'Luping memorialized: "Guizhou is surrounded on all sides by Miao barbarians; the military rolls are hollow—if there is an emergency, who will fight and defend?',
    idiomatic: 'Luping memorialized: "Guizhou is surrounded on all sides by Miao barbarians; the military rolls are hollow—if there is an emergency, who will fight and defend?',
  },
  {
    zh: '今衛軍逃於廣西，而以在衛者補。',
    literal: 'Now guard troops flee to Guangxi while those still in the guards are used to fill the gaps.',
    idiomatic: 'Now guard troops flee to Guangxi while those still in the guards are used to fill the gaps.',
  },
  {
    zh: '不數年，貴州軍伍盡空，邊釁且起。」',
    literal: 'Within a few years Guizhou\'s military rolls will be entirely empty and border trouble will arise."',
    idiomatic: 'Within a few years Guizhou\'s military rolls will be entirely empty and border trouble will arise."',
  },
  {
    zh: '帝乃命雲嚴責廣西諸衛，追還逃軍，俟足用，即遣歸。',
    literal: 'The emperor then ordered Yun to strictly hold the Guangxi guards accountable, recover the deserters, and send the Guizhou troops home once they were no longer needed.',
    idiomatic: 'The emperor then ordered Yun to strictly hold the Guangxi guards accountable, recover the deserters, and send the Guizhou troops home once they were no longer needed.',
  },
  {
    zh: '罷貴州戍卒。',
    literal: 'The Guizhou garrison troops were withdrawn.',
    idiomatic: 'The Guizhou garrison troops were withdrawn.',
  },
  {
    zh: '雲，名將，鎮粵有功，輕履平書生。',
    literal: 'Yun was a famed general who had rendered meritorious service guarding Guangdong and looked down on Luping as a mere scholar.',
    idiomatic: 'Yun was a famed general who had rendered meritorious service guarding Guangdong and looked down on Luping as a mere scholar.',
  },
  {
    zh: '正統元年，履平劾雲弄權，擅作威福，帝令雲自陳。',
    literal: 'In the first year of Zhengtong, Luping impeached Yun for manipulating power and arrogating authority; the emperor ordered Yun to explain himself.',
    idiomatic: 'In the first year of Zhengtong, Luping impeached Yun for manipulating power and arrogating authority; the emperor ordered Yun to explain himself.',
  },
  {
    zh: '雲大驚，引罪。',
    literal: 'Yun was greatly alarmed and confessed his fault.',
    idiomatic: 'Yun was greatly alarmed and confessed his fault.',
  },
  {
    zh: '帝宥之。',
    literal: 'The emperor pardoned him.',
    idiomatic: 'The emperor pardoned him.',
  },
]);

const PENG_XU_OMISSION = withMeta([
  {
    zh: '正統元年，以楊士奇薦，召授御史。',
    literal: 'In the first year of Zhengtong, on Yang Shiqi\'s recommendation, he was summoned and appointed censor.',
    idiomatic: 'In the first year of Zhengtong, on Yang Shiqi\'s recommendation, he was summoned and appointed censor.',
  },
  {
    zh: '時初設提學官，命督南畿學校。',
    literal: 'At the time the education-intendant office had just been established, and he was ordered to supervise schools in the Southern Metropolitan Region.',
    idiomatic: 'At the time the education-intendant office had just been established, and he was ordered to supervise schools in the Southern Metropolitan Region.',
  },
  {
    zh: '詳立教條，士風大振。',
    literal: 'He drew up teaching regulations in detail, and scholarly morale was greatly revived.',
    idiomatic: 'He drew up teaching regulations in detail, and scholarly morale was greatly revived.',
  },
  {
    zh: '疏言：「國朝祠祭，載在禮官。',
    literal: 'He memorialized: "Our dynasty\'s temple sacrifices are recorded in the ritual offices.',
    idiomatic: 'He memorialized: "Our dynasty\'s temple sacrifices are recorded in the ritual offices.',
  },
  {
    zh: '修齋起梁武帝，設醮起宋徽宗，宜一切除之。',
    literal: 'Vegetarian fasts began with Emperor Wu of Liang and Daoist rites with Emperor Huizong of Song; all of these should be abolished.',
    idiomatic: 'Vegetarian fasts began with Emperor Wu of Liang and Daoist rites with Emperor Huizong of Song; all of these should be abolished.',
  },
  {
    zh: '禁立庵院，罷給僧尼度牒。」',
    literal: 'Establishing nunneries and monasteries should be forbidden, and the issuance of ordination certificates to monks and nuns should cease."',
    idiomatic: 'Establishing nunneries and monasteries should be forbidden, and the issuance of ordination certificates to monks and nuns should cease."',
  },
  {
    zh: '又言：「真定、保定、山東民逃鳳陽、潁州以萬計，皆守令匿災暴斂所致，乞厚軫恤。',
    literal: 'He also said: "People from Zhending, Baoding, and Shandong flee to Fengyang and Yingzhou by the tens of thousands, all because local officials conceal disasters and levy oppressive taxes; I beg generous relief.',
    idiomatic: 'He also said: "People from Zhending, Baoding, and Shandong flee to Fengyang and Yingzhou by the tens of thousands, all because local officials conceal disasters and levy oppressive taxes; I beg generous relief.',
  },
  {
    zh: '守令課績，宜以戶口增耗為殿最。」',
    literal: 'In assessing local officials\' performance, increases and decreases in household registers should serve as the chief criterion."',
    idiomatic: 'In assessing local officials\' performance, increases and decreases in household registers should serve as the chief criterion."',
  },
  {
    zh: '又請設南京諸衛武學。',
    literal: 'He also requested the establishment of military schools in the Nanjing guards.',
    idiomatic: 'He also requested the establishment of military schools in the Nanjing guards.',
  },
  {
    zh: '皆報可。',
    literal: 'All were approved.',
    idiomatic: 'All were approved.',
  },
  {
    zh: '所至葺治先賢墳祠。',
    literal: 'Wherever he went he repaired the tombs and shrines of former worthies.',
    idiomatic: 'Wherever he went he repaired the tombs and shrines of former worthies.',
  },
  {
    zh: '母憂歸，以孫鼎代。',
    literal: 'When his mother died he returned home in mourning, and Sun Ding replaced him.',
    idiomatic: 'When his mother died he returned home in mourning, and Sun Ding replaced him.',
  },
  {
    zh: '勗起復，改吏部考功郎中，出為山東副使。',
    literal: 'Xu was recalled from mourning, transferred to director in the Ministry of Personnel\'s merit-review bureau, and went out as vice commissioner of Shandong.',
    idiomatic: 'Xu was recalled from mourning, transferred to director in the Ministry of Personnel\'s merit-review bureau, and went out as vice commissioner of Shandong.',
  },
  {
    zh: '土木之變，數言兵事。',
    literal: 'After the Tumu crisis he repeatedly spoke on military affairs.',
    idiomatic: 'After the Tumu crisis he repeatedly spoke on military affairs.',
  },
  {
    zh: '以直不容於時，致仕歸。',
    literal: 'Because his forthrightness was not tolerated in his time, he retired and returned home.',
    idiomatic: 'Because his forthrightness was not tolerated in his time, he retired and returned home.',
  },
]);

const CHEN_XUAN_OMISSION = withMeta([
  {
    zh: '憲宗即位，嘗劾尚書馬昂、侍郎吳復、鴻臚卿齊政，救修撰羅倫，學士倪謙、錢溥。',
    literal: 'When the Xianzong Emperor took the throne, Xuan once impeached Minister Ma Ang, Vice Minister Wu Fu, and Court of Imperial Entertainments Director Qi Zheng, and defended Compiler Luo Lun and Academicians Ni Qian and Qian Pu.',
    idiomatic: 'When the Xianzong Emperor took the throne, Xuan once impeached Minister Ma Ang, Vice Minister Wu Fu, and Court of Imperial Entertainments Director Qi Zheng, and defended Compiler Luo Lun and Academicians Ni Qian and Qian Pu.',
  },
  {
    zh: '言雖不盡行，一時憚其風采。',
    literal: 'Though his words were not all carried out, for a time people feared his moral authority.',
    idiomatic: 'Though his words were not all carried out, for a time people feared his moral authority.',
  },
  {
    zh: '已，督學南畿。',
    literal: 'Later he supervised education in the Southern Metropolitan Region.',
    idiomatic: 'Later he supervised education in the Southern Metropolitan Region.',
  },
  {
    zh: '頒冠、婚、祭、射儀於學宮，令諸生以時肄之。',
    literal: 'He promulgated capping, marriage, sacrifice, and archery rites in the schools and ordered students to practice them on schedule.',
    idiomatic: 'He promulgated capping, marriage, sacrifice, and archery rites in the schools and ordered students to practice them on schedule.',
  },
  {
    zh: '作《小學集註》以教諸生。',
    literal: 'He compiled Collected Commentaries on the Elementary Learning to instruct the students.',
    idiomatic: 'He compiled Collected Commentaries on the Elementary Learning to instruct the students.',
  },
  {
    zh: '按部常止宿學宮，夜巡兩廡，察諸生誦讀。',
    literal: 'On inspection tours he regularly lodged in the schools, patrolling both side halls at night to observe students reciting their lessons.',
    idiomatic: 'On inspection tours he regularly lodged in the schools, patrolling both side halls at night to observe students reciting their lessons.',
  },
  {
    zh: '除試牘糊名之陋，曰：「己不自信，何以信於人？」',
    literal: 'He abolished the abuse of sealed examination papers and said: "If I do not trust myself, how can I be trusted by others?"',
    idiomatic: 'He abolished the abuse of sealed examination papers and said: "If I do not trust myself, how can I be trusted by others?"',
  },
]);

const ZHANG_BING_OMISSION = withMeta([
  {
    zh: '擢南京御史。',
    literal: 'He was promoted to censor in Nanjing.',
    idiomatic: 'He was promoted to censor in Nanjing.',
  },
  {
    zh: '弘治元年七月偕同官上言：「邇臺諫交章論事矣，而扈蹕糾儀者不免錦衣捶楚之辱，是言路將塞之漸也。',
    literal: 'In the seventh month of the first year of Hongzhi he joined colleagues in memorializing: "Recently censors and remonstrators have submitted memorial after memorial on affairs, yet those who correct protocol on imperial progresses still suffer the humiliation of beating by the Brocade Guard—this is the beginning of the remonstrance path being blocked.',
    idiomatic: 'In the seventh month of the first year of Hongzhi he joined colleagues in memorializing: "Recently censors and remonstrators have submitted memorial after memorial on affairs, yet those who correct protocol on imperial progresses still suffer the humiliation of beating by the Brocade Guard—this is the beginning of the remonstrance path being blocked.',
  },
  {
    zh: '經筵既舉矣，而封章累進，卒不能回寒暑停免之說，是聖學將怠之漸也。',
    literal: 'The classics lecture has already been held, yet sealed memorials keep arriving and still cannot reverse the proposal to suspend it in heat and cold—this is the beginning of the emperor\'s learning growing slack.',
    idiomatic: 'The classics lecture has already been held, yet sealed memorials keep arriving and still cannot reverse the proposal to suspend it in heat and cold—this is the beginning of the emperor\'s learning growing slack.',
  },
  {
    zh: '內幸雖斥梁芳，而賜祭仍及便辟，是復啟寵幸之漸也。',
    literal: 'Though the inner eunuch Liang Fang was dismissed, sacrificial grants still reach favored minions—this is the beginning of favored attendants being revived.',
    idiomatic: 'Though the inner eunuch Liang Fang was dismissed, sacrificial grants still reach favored minions—this is the beginning of favored attendants being revived.',
  },
  {
    zh: '外戚雖罪萬喜，而莊田又賜皇親，是驕縱姻婭之漸也。',
    literal: 'Though the maternal kinsman Wan Xi was punished, estate lands are again granted to imperial relatives—this is the beginning of indulging affinal kin.',
    idiomatic: 'Though the maternal kinsman Wan Xi was punished, estate lands are again granted to imperial relatives—this is the beginning of indulging affinal kin.',
  },
  {
    zh: '左道雖斥，而符書尚揭於官禁，番僧旋復於京師，是異端復興之漸也。',
    literal: 'Though heterodox ways were condemned, talismanic writings are still posted within the official prohibitions and Tibetan monks soon return to the capital—this is the beginning of heterodoxy reviving.',
    idiomatic: 'Though heterodox ways were condemned, talismanic writings are still posted within the official prohibitions and Tibetan monks soon return to the capital—this is the beginning of heterodoxy reviving.',
  },
  {
    zh: '傳奉雖革，而千戶復除張質，通政不去張苗，是傳奉復啟之漸也。',
    literal: 'Though direct appointments were abolished, the battalion commander Zhang Zhi is again appointed and Transmission Commissioner Zhang Miao is not removed—this is the beginning of direct appointments being revived.',
    idiomatic: 'Though direct appointments were abolished, the battalion commander Zhang Zhi is again appointed and Transmission Commissioner Zhang Miao is not removed—this is the beginning of direct appointments being revived.',
  },
  {
    zh: '織造停矣，仍聞有蟒衣牛鬥之織，淫巧其漸作乎？',
    literal: 'Weaving has been halted, yet one still hears of fabrics with python robes and fighting oxen—is frivolous craft gradually returning?',
    idiomatic: 'Weaving has been halted, yet one still hears of fabrics with python robes and fighting oxen—is frivolous craft gradually returning?',
  },
  {
    zh: '寶石廢矣，又聞有戚裏不時之賜，珍玩其漸崇乎？',
    literal: 'Precious stones have been abolished, yet one again hears of untimely grants to imperial relatives—is the veneration of curios gradually rising?',
    idiomatic: 'Precious stones have been abolished, yet one again hears of untimely grants to imperial relatives—is the veneration of curios gradually rising?',
  },
  {
    zh: '《詩》雲『靡不有初，鮮克有終』，願陛下以為戒。」',
    literal: 'The Odes says, \'Few things lack a beginning; few can keep the end,\' and I ask Your Majesty to take this as a warning."',
    idiomatic: 'The Odes says, \'Few things lack a beginning; few can keep the end,\' and I ask Your Majesty to take this as a warning."',
  },
  {
    zh: '帝嘉納之。',
    literal: 'The emperor praised and accepted it.',
    idiomatic: 'The emperor praised and accepted it.',
  },
  {
    zh: '先是，昺以雷震孝陵柏樹，與同官劾大學士劉吉等十餘人，給事中周纮亦與同官劾吉，吉銜之。',
    literal: 'Earlier, because lightning struck a cypress at the Xiaoling tomb, Bing together with colleagues impeached Grand Secretary Liu Ji and more than ten others; Supervising Secretary Zhou Hong also joined colleagues in impeaching Ji, and Ji nursed a grudge.',
    idiomatic: 'Earlier, because lightning had struck a cypress at the Xiaoling tomb, Bing together with colleagues impeached Grand Secretary Liu Ji and more than ten others; Supervising Secretary Zhou Hong also joined colleagues in impeaching Ji, and Ji nursed a grudge.',
  },
]);

const patches = {
  'source-mingshi-161-wikisource-6bbda727ac15': {
    manualTranslations: ZHOU_XIN_OMISSION,
  },
  'source-mingshi-161-wikisource-ccd6de6a76a6': {
    manualTranslations: YING_LUPING_OMISSION,
  },
  'source-mingshi-161-wikisource-99cbfc103245': {
    manualTranslations: PENG_XU_OMISSION,
  },
  'source-mingshi-161-wikisource-4cbf5465c16e': {
    acceptedSourceText:
      '憲宗即位，嘗劾尚書馬昂、侍郎吳復、鴻臚卿齊政，救修撰羅倫，學士倪謙、錢溥。言雖不盡行，一時憚其風采。已，督學南畿。頒冠、婚、祭、射儀於學宮，令諸生以時肄之。作《小學集註》以教諸生。按部常止宿學宮，夜巡兩廡，察諸生誦讀。除試牘糊名之陋，曰：「己不自信，何以信於人？」',
    manualTranslations: CHEN_XUAN_OMISSION,
  },
  'source-mingshi-161-wikisource-60c34e4e1294': {
    manualTranslations: ZHANG_BING_OMISSION,
  },
};

const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
let patched = 0;

for (const [itemId, patch] of Object.entries(patches)) {
  const item = queue.items.find((row) => row.id === itemId);
  if (!item) throw new Error(`Queue item not found: ${itemId}`);
  if (patch.acceptedSourceText) item.acceptedSourceText = patch.acceptedSourceText;
  item.manualTranslations = patch.manualTranslations;
  patched += 1;
  console.log(`Patched ${itemId} (${patch.manualTranslations.length} translations).`);
}

queue.updatedAt = new Date().toISOString();
fs.writeFileSync(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`);
console.log(`Patched manualTranslations for ${patched} mingshi/161 source item(s).`);
