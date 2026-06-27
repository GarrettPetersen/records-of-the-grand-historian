#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const REPORT_PATH = 'data/quality/placeholder-translations.json';
const DEFAULT_REVIEWER = 'repair-placeholder-translations';
const GENERIC_PLACEHOLDER_RE = /^(?:Source note:|Textual note:)|^(?:Commentary lemma|Commentary|Subcomment|Editorial gloss|Gloss):\s*["“]?(?:cosmological|bureaucratic|parallel|etymology|Han-school)|the cited text|See Chinese/iu;
const RAW_NOTE_COPY_EXCLUDED_IDS = new Set([
  's1639',
]);

const CN_DIGIT = {
  零: 0, 〇: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9,
};
const CN_UNIT = { 十: 10, 百: 100, 千: 1000, 萬: 10000 };

const COMMON_SURNAME_RE = /(?:司馬|歐陽|諸葛|上官|夏侯|長孫|慕容|尉遲|宇文|令狐|皇甫|公孫|司徒|司空|太史|万俟|[趙錢孫李周吳鄭王馮陳褚衛蔣沈韓楊朱秦尤許何呂施張孔曹嚴華金魏陶姜戚謝鄒喻柏水竇章雲蘇潘葛奚范彭郎魯韋昌馬苗鳳花方俞任袁柳鮑史唐費廉岑薛雷賀倪湯滕殷羅畢郝鄔安常樂于時傅皮卞齊康伍余元卜顧孟平黃和穆蕭尹姚邵湛汪祁毛禹狄米貝明臧計伏成戴談宋龐熊紀舒屈項祝董梁杜阮藍閔席季麻強賈路婁危江童顏郭梅盛林刁鍾徐邱駱高夏蔡田胡凌霍虞萬支柯昝管盧莫經房裘繆干解應宗丁宣鄧郁單杭洪包左石崔吉龔程嵇邢裴陸榮翁荀羊於惠甄曲家封芮羿儲靳汲邴糜松井段富巫烏焦巴弓牧隗山谷車侯宓蓬全郗班仰秋仲伊宮寧仇欒暴甘斜厲戎祖武符劉景詹束龍葉幸司韶郜黎薊薄印宿白懷蒲邰從鄂索咸籍賴卓藺屠蒙池喬陰鬱胥能蒼雙聞莘党翟譚貢勞逄姬申扶堵冉宰酈雍郤璩桑桂濮牛壽通邊扈燕冀郟浦尚農溫別莊晏柴瞿閻充慕連茹習宦艾魚容向古易慎戈廖庾終暨居衡步都耿滿弘匡國文寇廣祿闕東毆殳沃利蔚越夔隆師鞏厙聶晁勾敖融冷訾辛闞那簡饒空曾毋沙乜養鞠須豐巢關蒯相查后荊紅游竺權逯蓋益桓公])/gu;

function usage() {
  console.error(`Usage:
  node scripts/repair-placeholder-translations.mjs [--apply] [--report PATH] [--limit N] [--sample-limit N] [--book BOOK] [--chapter CHAPTER]

Repairs placeholder English using source-preserving deterministic rewrites.
Dry-run by default; pass --apply to write JSON files.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    report: REPORT_PATH,
    limit: Infinity,
    sampleLimit: 40,
    book: null,
    chapter: null,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--apply') {
      opts.apply = true;
      continue;
    }
    if (arg === '--report') {
      opts.report = argv[++i];
      continue;
    }
    if (arg.startsWith('--report=')) {
      opts.report = arg.slice('--report='.length);
      continue;
    }
    if (arg === '--limit') {
      opts.limit = Number(argv[++i]);
      continue;
    }
    if (arg.startsWith('--limit=')) {
      opts.limit = Number(arg.slice('--limit='.length));
      continue;
    }
    if (arg === '--sample-limit') {
      opts.sampleLimit = Number(argv[++i]);
      continue;
    }
    if (arg.startsWith('--sample-limit=')) {
      opts.sampleLimit = Number(arg.slice('--sample-limit='.length));
      continue;
    }
    if (arg === '--book') {
      opts.book = argv[++i];
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.book = arg.slice('--book='.length);
      continue;
    }
    if (arg === '--chapter') {
      opts.chapter = String(argv[++i]).padStart(3, '0');
      continue;
    }
    if (arg.startsWith('--chapter=')) {
      opts.chapter = String(arg.slice('--chapter='.length)).padStart(3, '0');
      continue;
    }
    console.error(`Unknown option: ${arg}`);
    usage();
    process.exit(2);
  }
  if (!Number.isFinite(opts.limit)) opts.limit = Infinity;
  if (!Number.isFinite(opts.sampleLimit)) opts.sampleLimit = 40;
  return opts;
}

function parseChineseNumber(text) {
  const s = String(text || '').replace(/\s/g, '');
  if (!s) return null;
  if (/^\d+$/u.test(s)) return Number(s);
  if (!/[十百千萬]/u.test(s) && s.length > 1) {
    let digits = '';
    for (const ch of s) {
      if (!(ch in CN_DIGIT)) return null;
      digits += String(CN_DIGIT[ch]);
    }
    return Number(digits);
  }
  let total = 0;
  let section = 0;
  let num = 0;
  for (const ch of s) {
    if (ch in CN_DIGIT) {
      num = CN_DIGIT[ch];
    } else if (ch in CN_UNIT) {
      const unit = CN_UNIT[ch];
      if (unit === 10000) {
        section = (section + num) * unit;
        num = 0;
      } else {
        section += (num || 1) * unit;
        num = 0;
      }
    } else {
      return null;
    }
  }
  return total + section + num;
}

function loadGlossary() {
  const file = 'data/glossary.json';
  if (!fs.existsSync(file)) return new Map();
  const rows = Object.values(JSON.parse(fs.readFileSync(file, 'utf8')));
  const map = new Map();
  for (const row of rows) {
    if (!row?.text || !Array.isArray(row.definitions) || row.definitions.length === 0) continue;
    const first = row.definitions.find((value) => /^[A-Z][A-Za-z' .-]+$/u.test(value));
    if (first) map.set(row.text, first);
  }
  return map;
}

const GLOSSARY = loadGlossary();
const EXACT_NAMES = new Map([
  ['梁武帝', 'Emperor Wu of Liang'],
]);
const MANUAL_TRANSLATIONS = new Map([
  ['後漢又使曹褒定漢儀，是後相承，世有製作。', 'The Later Han also had Cao Bao fix the Han rites; thereafter the tradition was continued, and each generation produced new works.'],
  ['然而刑書之作久矣。', 'Yet the making of penal books had long existed.'],
  ['後漢光武，始詔南陽，撰作風俗，故沛、三輔有耆舊節士之序，魯、廬江有名德先賢之贊。', 'Under Guangwu of the Later Han, an edict first ordered Nanyang to compile accounts of its customs; therefore Pei and Sanfu had prefaces on elders and men of integrity, and Lu and Lujiang had appreciations of famous and virtuous former worthies.'],
  ['郡國之書，由是而作。', 'Books on commanderies and kingdoms were made from this.'],
  ['因其事類，相繼而作者甚眾，名目轉廣，而又雜以虛誕怪妄之說。', 'Because these works followed their subject categories, many authors continued one after another; the titles grew ever broader, and they were also mixed with empty, extravagant, strange, and absurd tales.'],
  ['魯、沛、三輔，序贊並亡，後之作者，亦多零失。', 'The prefaces and appreciations for Lu, Pei, and Sanfu are all lost, and later works too have mostly fallen into fragmentary loss.'],
  ['按：校補謂李注，訊，息對反，疑本「誶」之鬥。', 'The collation supplement says that Li\'s note gives 訊 with the fanqie 息對反, and suspects a transposition involving "誶" in the base text.'],
  ['*所解皮也 按：汲本作「蟬蛻蟬所解皮也」，殿本作「蟬蛻所解皮也」，並有脫鬥，茲 據說文改。', 'The Jiben edition reads "蟬蛻蟬所解皮也"; the Dianben edition reads "蟬蛻所解皮也". Both have omissions or transpositions, so this text is corrected according to Shuowen.'],
  ['按：「慌」《文選》作「荒」。', 'Wenxuan writes "荒" for "慌".'],
  ['校補引錢大昭說，謂秀乃光武諱，作「禾」者不誤。', 'The collation supplement cites Qian Dazhao, who says that 秀 was Guangwu\'s tabooed personal name, so the reading "禾" is not wrong.'],
  ['今據改 按：沉家本謂此注引說文以解禾字，則章懷所 據本實作「禾」，不作「秀」。', 'The text is now changed accordingly. The Shen family edition says this note cites Shuowen to explain the graph 禾, so the text used by Zhanghuai in fact read "禾", not "秀".'],
  ['按：集解引柳從辰說，謂「歐」當讀為「驅」。', 'Jijie cites Liu Congchen as saying that "歐" should be read as "驅".'],
  ['一九三八頁九行 歔欷歸耕來日安所耕歷山盤乎 按：《文選》李注「日」「乎」均作「兮」。', 'Page 1938, line 9: in "歔欷歸耕來日安所耕歷山盤乎", Li\'s Wenxuan note writes both "日" and "乎" as "兮".'],
  ['按：《文選》遊仙詩李注作「駐」，駐住聲近義通。', 'Li\'s Wenxuan note to the "Youxian" poem writes "駐"; 駐 and 住 are close in sound and compatible in meaning.'],
  ['好吹笙作鳳鳴，游伊洛閒。', 'He liked to play the sheng in imitation of phoenix cries and wandered between the Yi and Luo rivers.'],
  ['衡集作「玄圖」，蓋玄與懸通。', 'Heng\'s collected works write "玄圖"; probably 玄 and 懸 are interchangeable.'],
  ['機物謂作候地動儀等。', 'Mechanical devices means making instruments such as the seismoscope for detecting earthquakes.'],
  ['嶢崢，高峻魍。', 'Yaozheng describes height and steepness.'],
  ['道真謂道德之真。', 'Daozhen refers to the truth of the Way and virtue.'],
  ['*(躑)', 'The critical apparatus marks 躑.'],
  ['壽卒後，梁州大中正範穎表奏其事，帝詔河南尹、洛陽令，就壽家寫之。', 'After Shou died, Fan Ying, Grand Rectifier of Liang Province, submitted a memorial reporting the matter; the emperor ordered the governor of Henan and the magistrate of Luoyang to go to Shou\'s home and copy it.'],
  ['記庖犧已來，至漢建安二十七年。', 'It recorded events from Paoxi down to the twenty-seventh year of Jian\'an under the Han.'],
  ['梁有《翟遼書》二卷，《諸國略記》二卷，《永嘉後纂年記》二卷，《段業傳》一卷，亡。', 'The Liang catalog listed 《翟遼書》, 2 scrolls; 《諸國略記》, 2 scrolls; 《永嘉後纂年記》, 2 scrolls; and 《段業傳》, 1 scroll. These are now lost.'],
  ['自晉永嘉之亂，皇綱失馭，九州君長，據有中原者甚眾。', 'From the Yongjia disorders of the Jin onward, the imperial reins were lost, and many regional rulers throughout the Nine Provinces occupied the Central Plain.'],
  ['或推奉正朔，或假名竊號，然其君臣忠義之節，經國字民之務，蓋亦勤矣。', 'Some upheld the orthodox calendar, while others falsely assumed names and titles; yet their rulers and ministers were also diligent in loyalty and righteousness and in the work of ordering states and nurturing the people.'],
  ['而當時臣子，亦各記錄。', 'The ministers and subjects of the time also each made records.'],
  ['後魏克平諸國，據有嵩、華，始命司徒崔浩，博采舊聞，綴述國史。', 'After Later Wei conquered and pacified the various states and held Song and Hua, it first ordered Situ Cui Hao to broadly gather old accounts and compile the state history.'],
  ['爾硃之亂，並皆散亡。', 'During the Erzhu disturbances, all of these were scattered and lost.'],
  ['今舉其見在，謂之霸史。', 'Now we list those presently extant and call them hegemon histories.'],
  ['郭璞注。', 'Annotated by Guo Pu.'],
  ['梁有三百二十二卷。', 'The Liang catalog had 322 scrolls.'],
  ['然皆零落，不可複知。', 'Yet all have fallen into fragmentary loss and can no longer be fully known.'],
  ['今依其先後，編而次之。', 'Now we arrange them according to their order of succession.'],
  ['梁有《荀攸魏官儀》一卷，《韋昭官儀職訓》一卷，亡。', 'The Liang catalog listed 《荀攸魏官儀》, 1 scroll, and 《韋昭官儀職訓》, 1 scroll. These are now lost.'],
  ['然則塚宰總六卿之屬，以治其政，御史掌其在位名數，先後之次焉。', 'Thus the Chief Minister oversaw the offices under the Six Ministers in order to manage their administration, while the Censorate kept track of the numbers and order of those holding office.'],
  ['梁有衛敬仲《漢中興儀》一卷，亡。', 'The Liang catalog listed Wei Jingzhong\'s 《漢中興儀》, 1 scroll, now lost.'],
  ['梁有何胤《士喪儀注》九卷，亡。', 'The Liang catalog listed He Yin\'s 《士喪儀注》, 9 scrolls, now lost.'],
  ['自君臣父子，六親九族，各有上下親疏之別。', 'From ruler and minister, father and son, to the six kin and nine clans, each had distinctions of superior and inferior, close and distant.'],
  ['養生送死，吊恤賀慶，則有進止威儀之數。', 'In nourishing the living and sending off the dead, offering condolences and relief, and giving congratulations and celebrations, there were rules of movement and ceremonial deportment.'],
  ['唐、虞已上，分之為三，在周因而為五。', 'From Tang and Yu upward, these were divided into three; under Zhou they were accordingly made five.'],
  ['是時典章皆具，可履而行。', 'At that time the statutes and institutions were all complete and could be followed and put into practice.'],
  ['周衰，諸侯削除其籍。', 'When Zhou declined, the feudal lords cut away and discarded its records.'],
  ['至秦，又焚而去之。', 'By Qin, they were further burned and removed.'],
  ['漢興，叔孫通定朝儀，武帝時始祀汾陰後土，成帝時初定南北之郊，節文漸具。', 'When Han arose, Shusun Tong fixed the court rites; in Emperor Wu\'s time the sacrifice to Houtu at Fenyin first began; in Emperor Cheng\'s time the northern and southern suburban sacrifices were first fixed, and the regulations gradually became complete.'],
  ['然猶以舊章殘缺，各遵所見，彼此紛爭，盈篇滿牘。', 'Yet the old statutes were still fragmentary and deficient; each followed what he had seen, disputes arose between one side and another, and they filled chapters and documents.'],
  ['而後世多故，事在通變，或一時之制，非長久之道，載筆之士，刪其大綱，編于史志。', 'In later generations, however, affairs were often troubled and matters required adaptation; some were regulations for a single time, not long-enduring principles, so writers took only their major outlines and compiled them into historical treatises.'],
  ['而或傷於淺近，或失于未達，不能盡其旨要。', 'Some suffered from shallowness and narrowness, and some erred through incomplete understanding, so they could not fully exhaust the essential meaning.'],
  ['遺文餘事，亦多散亡。', 'Surviving texts and remaining affairs were also often scattered and lost.'],
  ['司刑掌五刑之法，麗萬民之罪；', 'The Director of Punishments administered the laws of the five punishments and attached crimes to the myriad people;'],
  ['太史又以典法逆于邦國；', 'the Grand Historian also used the canons and laws to check the states;'],
  ['內史執國法以考政事。', 'the Interior Scribe held the state laws in order to examine government affairs.'],
  ['蓋藏於官府，懼人之知爭端，而輕於犯。', 'They were probably kept in government offices because there was fear that, if people knew the grounds of dispute, they would become casual about offending.'],
  ['及其末也，肆情越法，刑罰僭濫。', 'By its end, feelings were indulged beyond the law, and punishments became usurping and excessive.'],
  ['至秦，重之以苛虐，先王之正刑滅矣。', 'By Qin, this was made harsher with cruelty and oppression, and the correct punishments of the former kings perished.'],
  ['漢初，蕭何定律九章，其後漸更增益，令甲已下，盈溢架藏。', 'At the beginning of Han, Xiao He fixed the laws in nine chapters; afterward they were gradually changed and augmented, and from Statute A downward they overflowed the shelves and storehouses.'],
  ['晉初，賈充、杜預刪而定之，有律，有令，有故事。', 'At the beginning of Jin, Jia Chong and Du Yu abridged and fixed them, producing laws, ordinances, and precedents.'],
  ['隋則律令格式並行。', 'Under Sui, laws, ordinances, forms, and procedures were all in force.'],
  ['本一百四十七卷，亡。', 'Originally 147 scrolls, now lost.'],
  ['本七十卷，亡。', 'Originally 70 scrolls, now lost.'],
  ['古之史官，必廣其所記，非獨人君之舉。', 'The historians of antiquity necessarily made broad records, not only of the ruler\'s actions.'],
  ['臧紇之叛，季孫命太史召掌惡臣而盟之。', 'When Zang He rebelled, Jisun ordered the Grand Historian to summon the officer in charge of evil ministers and bind him by covenant.'],
  ['太史、內史、司會，六官皆受其貳而藏之。', 'The Grand Historian, Interior Scribe, and Director of Accounts, and all six offices, received duplicates and stored them.'],
  ['是則王者誅賞，具錄其事，昭告神明，百官史臣，皆藏其書。', 'Thus, when the king punished or rewarded, the matter was fully recorded and announced to the spirits; the hundred officials and historical ministers all stored the writings.'],
  ['故自公卿諸侯，至於群士，善惡之跡，畢集史職。', 'Therefore, from high ministers and feudal lords down to the various officers, traces of good and evil all gathered in the historians\' offices.'],
  ['而又閭胥之政，凡聚眾庶，書其敬敏任恤者，族師每月書其孝悌睦涘有學者，党正歲書其德行道藝者，而入之于鄉大夫。', 'And in the administration of the village overseer, whenever the common people were assembled, he recorded those who were reverent, diligent, responsible, and compassionate; the clan instructor each month recorded those who were filial, fraternal, harmonious, peaceful, and learned; the district chief annually recorded those who had virtue, conduct, ways, and arts, and submitted them to the district grand officer.'],
  ['鄉大夫三年大比，考其德行道藝，舉其賢者能者，而獻其書。', 'Every three years, at the great comparison, the district grand officer examined their virtue, conduct, ways, and arts, recommended the worthy and capable, and presented the records.'],
  ['王再拜受之，登於天府，內史貳之。', 'The king bowed twice and received them, placed them in the Heavenly Repository, and the Interior Scribe made a duplicate.'],
  ['是以窮居側陋之士，言行必達，皆有史傳。', 'For this reason, even men dwelling in poverty and obscurity necessarily had their words and conduct made known, and all had historical biographies.'],
  ['自史官曠絕，其道廢壞，漢初，始有丹書之約，白馬之盟。', 'After the historians\' offices fell vacant and severed, their Way decayed; at the beginning of Han there first were the covenant written in red and the covenant of the white horse.'],
  ['武帝從董仲舒之言，始舉賢良文學。', 'Emperor Wu followed Dong Zhongshu\'s advice and first recommended the worthy and good and literary scholars.'],
  ['天下計書，先上太史，善惡之事，靡不畢集。', 'The accounting documents from all under Heaven were first submitted to the Grand Historian, and matters good and evil were all completely gathered.'],
  ['司馬遷、班固，撰而成之，股肱輔弼之臣，扶義俶儻之士，皆有記錄。', 'Sima Qian and Ban Gu compiled them into completed works, so ministers who served as arms and legs and aides, and men who upheld righteousness with outstanding bearing, all had records.'],
  ['載筆之士，刪采其要焉。', 'The writers selected and excerpted the essentials.'],
  ['今取其見存，部而類之，謂之雜傳。', 'Now we take those that survive, arrange them by category, and call them miscellaneous biographies.'],
  ['載物產之異。', 'They recorded unusual products.'],
  ['澄本之外，其舊事並多零失。', 'Apart from Cheng\'s own copy, the old accounts were mostly fragmentary and lost.'],
  ['見存別部自行者，唯四十二家，今列之於上。', 'Of separate sections still extant and circulating independently, there are only forty-two; we list them above.'],
  ['其所增舊書，亦多零失。', 'The old books that it added were also mostly fragmentary and lost.'],
  ['見存別部行者，唯十二家，今列之於上。', 'Of separate sections still extant and circulating, there are only twelve; we list them above.'],
  ['昔者先王之化民也，以五方土地，風氣所生，剛柔輕重，飲食衣服，各有其性，不可遷變。', 'In ancient times, when the former kings transformed the people, the lands of the five regions, what their winds and qi produced, their hardness and softness, lightness and heaviness, food and clothing, each had its own nature and could not be shifted or changed.'],
  ['是故疆理天下，物其土宜，知其利害，達其志而通其欲，齊其政而修其教。', 'Therefore they delimited and ordered all under Heaven, assessed what the lands were suited for, understood their advantages and harms, reached their intentions and communicated their desires, unified their governance and cultivated their teaching.'],
  ['故曰廣穀大川異制，人居其間異俗。', 'Thus it says: "Broad valleys and great rivers have different systems; people dwelling among them have different customs."'],
  ['周則夏官司險，掌建九州之圖，周知山林川澤之阻，達其道路。', 'Under Zhou, the Summer-office Director of Frontiers was charged with establishing maps of the Nine Provinces, knowing thoroughly the obstacles of mountains, forests, rivers, and marshes, and communicating their roads.'],
  ['地官誦訓，掌方志以詔觀事，以知地俗。', 'The Reciter of Instructions in the offices of the earth was in charge of regional records, using them to announce matters to be observed and to know local customs.'],
  ['春官保章，以星土辨九州之地，所封之域，以觀祅祥。', 'The Guardian of Patterns in the spring offices used stars and terrestrial divisions to distinguish the lands of the Nine Provinces and the regions enfeoffed, in order to observe baleful and auspicious signs.'],
  ['夏官職方，掌天下之圖地，辨四夷八蠻九貉五戎六狄之人，與其財用九穀六畜之數，周知利害，辨九州之國，使同其貫。', 'The Director of Regions in the summer offices was in charge of maps and lands under Heaven; distinguished the peoples of the four Yi, eight Man, nine Mo, five Rong, and six Di, together with their resources and the numbers of the nine grains and six domestic animals; fully knew advantages and harms; distinguished the states of the Nine Provinces; and caused them to share a common order.'],
  ['司徒掌邦之土地之圖與其人民之教，以佐王擾邦國，周知九州之域，廣輪之數，辨其山林川澤丘陵墳衍原隰之名物，及土會之法。', 'The Minister of Education was in charge of maps of the state\'s lands and of teaching its people, to assist the king in pacifying states and domains; he fully knew the extent of the Nine Provinces and the measures of breadth and length, distinguished the names and products of mountains, forests, rivers, marshes, hills, mounds, plains, and wetlands, and knew the laws for land accounting.'],
  ['然則其事分在眾職，而塚宰掌建邦之六典，實總其事。', 'Thus these affairs were divided among many offices, while the Chief Minister, who established the six canons of the state, in fact oversaw them.'],
  ['太史以典逆塚宰之治，其書蓋亦總為史官之職。', 'The Grand Historian used the canons to check the Chief Minister\'s governance; those records were probably also collectively the responsibility of the historians\' office.'],
  ['漢初，蕭何得秦圖書，故知天下要害。', 'At the beginning of Han, Xiao He obtained Qin maps and documents, and therefore knew the strategic places under Heaven.'],
  ['武帝時，計書既上太史，郡國地志，固亦在焉。', 'In Emperor Wu\'s time, after the accounting documents had been submitted to the Grand Historian, the geographical treatises of commanderies and kingdoms were also certainly included among them.'],
  ['而史遷所記，但述河渠而已。', 'But what Sima Qian recorded only described rivers and canals.'],
  ['是後載筆之士，管窺末學，不能及遠，但記州郡之名而已。', 'After this, writers had narrow views and superficial learning, could not reach far, and merely recorded the names of provinces and commanderies.'],
  ['而學者因其經歷，並有記載，然不能成一家之體。', 'Scholars, drawing on their own travels, also made records, but they could not form the structure of a school.'],
  ['隋大業中，普詔天下諸郡，條其風俗物產地圖，上于尚書。', 'During the Daye era of Sui, an edict was sent broadly to the commanderies throughout the empire, ordering them to list their customs, products, and maps and submit them to the Department of State Affairs.'],
  ['梁有王逡之《續儉百家譜》四卷，《南族譜》二卷，《百家譜拾遺》一卷，又有《齊、梁帝譜》四卷，《梁帝譜》十三卷，亡。', 'The Liang catalog listed Wang Xunzhi\'s 《續儉百家譜》, 4 scrolls; 《南族譜》, 2 scrolls; 《百家譜拾遺》, 1 scroll; 《齊、梁帝譜》, 4 scrolls; and 《梁帝譜》, 13 scrolls. These are now lost.'],
  ['氏姓之書，其所由來遠矣。', 'Books on clan names have origins that go back far.'],
  ['秦兼天下，剗除舊跡，公侯子孫，失其本系。', 'When Qin annexed all under Heaven, it cut away the old traces, and descendants of dukes and marquises lost their original lineages.'],
  ['後魏遷洛，有八氏十姓，鹹出帝族。', 'After Later Wei moved to Luoyang, there were eight clans and ten surnames, all from the imperial lineage.'],
  ['又有三十六族，則諸國之從魏者；', 'There were also thirty-six clans, those of the various states that had followed Wei;'],
  ['九十二姓，世為部落大人者，並為河南洛陽人。', 'and ninety-two surnames whose lineages had served for generations as tribal chiefs; all became people of Luoyang in Henan.'],
  ['其中國士人，則第其門閥，有四海大姓、郡姓、州姓、縣姓。', 'Among the Chinese gentry, their lineages were ranked, with great surnames within the four seas, commandery surnames, province surnames, and county surnames.'],
  ['又以關內諸州，為其本望。', 'They also took the provinces within the passes as their ancestral seats.'],
  ['自餘亦多遺失。', 'The rest, too, have mostly been lost.'],
  ['今錄其見存者，以為譜系篇。', 'Now we record those that presently survive and make them the chapter on genealogies.'],
]);

function renderName(text) {
  const value = String(text || '').trim();
  if (!value) return '';
  return EXACT_NAMES.get(value) || GLOSSARY.get(value) || value;
}

function renderTitle(text) {
  const value = String(text || '').trim();
  if (!value) return '';
  return GLOSSARY.get(value) || `《${value}》`;
}

function quote(text) {
  return `"${text}"`;
}

function sourceLabel(text) {
  const value = String(text || '');
  if (/文選/u.test(value)) return 'Wenxuan';
  if (/汲本、殿本|殿本、汲本/u.test(value)) return 'the Jiben and Dianben editions';
  if (/汲本/u.test(value)) return 'the Jiben edition';
  if (/殿本/u.test(value)) return 'the Dianben edition';
  if (/說文/u.test(value)) return 'Shuowen';
  if (/校補/u.test(value)) return 'the collation supplement';
  return 'the note';
}

function translateTextualNote(zh) {
  const text = String(zh || '').trim();
  if (!text) return null;
  const gloss = text.match(/^\(([^)]+)\)$/u);
  if (gloss) return `Gloss: ${gloss[1]}.`;

  const parts = [];
  const bracketed = [...text.matchAll(/［([^］]+)］/gu)].map((match) => match[1]);
  if (bracketed.length > 0 && /據/u.test(text)) {
    const action = /補/u.test(text) ? 'supplied' : 'changed';
    parts.push(`The bracketed ${bracketed.map(quote).join(', ')} ${bracketed.length === 1 ? 'is' : 'are'} ${action} according to ${sourceLabel(text)}.`);
  } else if (bracketed.length > 0) {
    parts.push(`The note marks bracketed ${bracketed.map(quote).join(', ')}.`);
  }

  for (const match of text.matchAll(/[「『]([^」』]+)[」』](原)?作[「『]([^」』]+)[」』]/gu)) {
    if (match[2]) {
      parts.push(`${quote(match[1])} originally read ${quote(match[3])}.`);
    } else {
      parts.push(`${sourceLabel(text)} writes ${quote(match[3])} for ${quote(match[1])}.`);
    }
  }
  for (const match of text.matchAll(/[「『]([^」』]+)[」』](?:應|當)作[「『]([^」』]+)[」』]/gu)) {
    parts.push(`${quote(match[1])} should read ${quote(match[2])}.`);
  }
  for (const match of text.matchAll(/[「『]([^」』]+)[」』]不作[「『]([^」』]+)[」』]/gu)) {
    parts.push(`${sourceLabel(text)} does not write ${quote(match[2])} for ${quote(match[1])}.`);
  }
  for (const match of text.matchAll(/[「『]([^」』]+)[」』]上有[「『]([^」』]+)[」』]字/gu)) {
    parts.push(`${sourceLabel(text)} has ${quote(match[2])} before ${quote(match[1])}.`);
  }
  for (const match of text.matchAll(/[「『]([^」』]+)[」』]下無[「『]([^」』]+)[」』]字/gu)) {
    parts.push(`${sourceLabel(text)} has no ${quote(match[2])} after ${quote(match[1])}.`);
  }

  if (parts.length > 0) return parts.join(' ');
  if (/音/u.test(text)) {
    const match = text.match(/^(.+?)音(.+?)(?:反)?(?:。)?$/u);
    if (match) return `${match[1]} is pronounced ${match[2]}.`;
  }
  return null;
}

function sourceTokens(zh) {
  const titles = [...zh.matchAll(/《([^》]+)》/gu)].map((match) => renderTitle(match[1]));
  const quoted = [...zh.matchAll(/[「『]([^」』]+)[」』]/gu)].map((match) => quote(match[1]));
  const angles = [...zh.matchAll(/〈([^〉]+)〉/gu)].map((match) => renderAngle(match[1]));
  return { titles, quoted, angles };
}

function sourceTokensRaw(zh) {
  const titles = [...zh.matchAll(/《([^》]+)》/gu)].map((match) => renderTitle(match[1]));
  const quoted = [...zh.matchAll(/[「『]([^」』]+)[」』]/gu)].map((match) => match[1]);
  const angles = [...zh.matchAll(/〈([^〉]+)〉/gu)].map((match) => renderAngle(match[1]));
  return { titles, quoted, angles };
}

function collationPairs(zh) {
  return [...String(zh || '').matchAll(/[「『]([^」』]+)[」』](?:原)?作[「『]([^」』]+)[」』]/gu)]
    .map((match) => ({ base: match[1], variant: match[2] }));
}

function contextualPlaceholderCandidates(zh, oldText) {
  const source = String(zh || '');
  const text = String(oldText || '');
  const candidates = [];
  if (/\bis pronounced\b/iu.test(text)) {
    const pronounced = source.match(/[「『]([^，,」』]+)[，,]?音/u);
    if (pronounced) candidates.push(pronounced[1]);
  }
  if (/\b(?:dropped|omitted|omits|lack|lacks|missing)\b/iu.test(text)) {
    for (const re of [
      /脫[「『]([^」』]+)[」』]字/gu,
      /所脫是[「『]([^」』]+)[」』]字/gu,
      /無[「『]([^」』]+)[」』]字/gu,
      /缺[「『]([^」』]+)[」』]字/gu,
    ]) {
      for (const match of source.matchAll(re)) candidates.push(match[1]);
    }
  }
  if (/\b(?:corrupt|corruption|graphic similarity)\b/iu.test(text)) {
    for (const match of source.matchAll(/[「『]([^」』]+)[」』]字?乃[「『]([^」』]+)[」』]/gu)) {
      candidates.push(match[1], match[2]);
    }
    for (const re of [
      /這裏[「『]([^」』]+)[」』]字訛/gu,
      /[「『]([^」』]+)[」』]字訛/gu,
      /訛作[「『]([^」』]+)[」』]/gu,
    ]) {
      for (const match of source.matchAll(re)) candidates.push(match[1]);
    }
  }
  if (/\breading\b.*\bcorrect\b/iu.test(text)) {
    for (const match of source.matchAll(/作[「『]([^」』]+)[」』]是/gu)) candidates.push(match[1]);
  }
  if (/\bchanged\b.*\bto\b/iu.test(text)) {
    for (const match of source.matchAll(/改[「『]([^」』]+)[」』]為[「『]([^」』]+)[」』]/gu)) {
      candidates.push(match[1], match[2]);
    }
  }
  if (/\bsuspected to be\b/iu.test(text)) {
    for (const match of source.matchAll(/[「『]([^」』]+)[」』]疑當作[「『]([^」』]+)[」』]/gu)) {
      candidates.push(match[1], match[2]);
    }
  }
  if (/\btwo\b.*\bcharacters repeat\b/iu.test(text)) {
    for (const match of source.matchAll(/兩[「『]([^」』]+)[」』]字/gu)) candidates.push(match[1]);
  }
  if (/\bshould\b.*\b(?:read|be)\b/iu.test(text)) {
    for (const match of source.matchAll(/(?:當|應)作[「『]([^」』]+)[」』]/gu)) candidates.push(match[1]);
  }
  return candidates;
}

function fillPlaceholdersInExistingEnglish(zh, oldText) {
  let text = String(oldText || '');
  if (!/the cited (?:text|graph)/iu.test(text)) return null;
  const raw = sourceTokensRaw(zh);
  const pairs = collationPairs(zh);
  let candidates = [];
  const contextual = contextualPlaceholderCandidates(zh, oldText);
  if (contextual.length > 0) {
    candidates = contextual;
  } else if (pairs.length > 0 && /\b(?:read|reads|write|writes|wrote|written|has|have)\b.*\bfor\b/iu.test(text)) {
    candidates = pairs.flatMap((pair) => [pair.variant, pair.base]);
  } else if (pairs.length > 0 && /\boriginally (?:read|written|wrote)\b/iu.test(text)) {
    candidates = pairs.flatMap((pair) => [pair.base, pair.variant]);
  } else {
    candidates = [...raw.titles, ...raw.quoted, ...raw.angles];
  }
  if (candidates.length === 0) return null;
  let index = 0;
  const next = () => candidates[index++] || candidates[candidates.length - 1] || '';
  text = text.replace(/\bthe cited (?:text|graph)\b/giu, () => next());
  text = text
    .replace(/""([^"]+)""/gu, '"$1"')
    .replace(/''([^']+)''/gu, "'$1'")
    .replace(/ {2,}/gu, ' ')
    .trim();
  return /the cited (?:text|graph)/iu.test(text) ? null : text;
}

function renderAngle(inner) {
  const text = String(inner || '').trim();
  const match = text.match(/^卷([一二三四五六七八九十百千萬〇零０两兩]+)(.*)$/u);
  if (match) {
    const num = parseChineseNumber(match[1].replace(/０/gu, '〇'));
    const rest = match[2].trim();
    return num == null ? `juan ${match[1]}${rest ? `, ${rest}` : ''}` : `juan ${num}${rest ? `, ${rest}` : ''}`;
  }
  return text;
}

function stripRoles(text) {
  return String(text || '')
    .replace(/^(?:五經博士|秘書學士|光祿大夫|太學博士|國子助教|侍中|太尉|司徒|郎中|中散大夫|護軍|方士|著作佐郎|右僕射|左民尚書|大將軍從事中郎|侍御史|梁州大中正|河南尹|洛陽令)+/u, '')
    .trim();
}

function extractNameFromChunk(chunk) {
  const cleaned = stripRoles(chunk.replace(/[，,；;。].*$/u, '').trim());
  if (!cleaned) return '';
  const exact = renderName(cleaned);
  if (exact !== cleaned) return exact;
  if (/^[\u4e00-\u9fff]{1,3}帝$/u.test(cleaned)) return cleaned;
  const glossary = GLOSSARY.get(cleaned);
  if (glossary) return glossary;
  const surnameMatches = [...cleaned.matchAll(COMMON_SURNAME_RE)]
    .map((match) => ({ index: match.index, text: match[0], tail: cleaned.slice(match.index) }))
    .filter((match) => match.tail.length >= 2 && match.tail.length <= 4);
  if (surnameMatches.length > 0) {
    return renderName(surnameMatches.at(-1).tail);
  }
  return cleaned;
}

function extractCreators(zh, verb) {
  const before = String(zh || '').split(verb)[0] || '';
  const tail = before.split(/[；;。，,]/u).at(-1).split(/卷/u).at(-1);
  if (!tail) return [];
  return tail
    .split(/、|及|并|與/u)
    .map(extractNameFromChunk)
    .filter(Boolean);
}

function creatorPhrase(zh, verb) {
  const creators = extractCreators(zh, verb);
  if (creators.length === 0) return '';
  return creators.join(', ');
}

function scrollWord(count) {
  return count === 1 ? 'scroll' : 'scrolls';
}

function workWord(count) {
  return count === 1 ? 'work' : 'works';
}

function translateCatalogTotal(zh) {
  const text = String(zh || '').trim();
  let match = text.match(/^右([一二三四五六七八九十百千萬〇零０两兩]+)部，(?:合|共)?([一二三四五六七八九十百千萬〇零０两兩]+)卷。?$/u);
  if (match) {
    const works = parseChineseNumber(match[1].replace(/０/gu, '〇'));
    const scrolls = parseChineseNumber(match[2].replace(/０/gu, '〇'));
    if (works != null && scrolls != null) {
      return `Above: ${works} ${workWord(works)}, ${scrolls} ${scrollWord(scrolls)}.`;
    }
  }
  match = text.match(/^通計亡書，(?:合)?([一二三四五六七八九十百千萬〇零０两兩]+)(?:部|郎)，(?:共)?([一二三四五六七八九十百千萬〇零０两兩]+)卷。?$/u);
  if (match) {
    const works = parseChineseNumber(match[1].replace(/０/gu, '〇'));
    const scrolls = parseChineseNumber(match[2].replace(/０/gu, '〇'));
    if (works != null && scrolls != null) {
      return `Including lost books, ${works} ${workWord(works)} in all, ${scrolls} ${scrollWord(scrolls)}.`;
    }
  }
  return null;
}

function translateBiblio(zh) {
  const titles = [...zh.matchAll(/《([^》]+)》/gu)].map((match) => renderTitle(match[1]));
  if (titles.length === 0 || !/[卷]/u.test(zh)) return null;
  const liangAlso = zh.match(/^《([^》]+)》([一二三四五六七八九十百千萬〇零０两兩]+)卷梁又有《([^》]+)》並《([^》]+)》([一二三四五六七八九十百千萬〇零０两兩]+)卷[；;。]?$/u);
  if (liangAlso) {
    const firstScrolls = parseChineseNumber(liangAlso[2].replace(/０/gu, '〇'));
    const secondScrolls = parseChineseNumber(liangAlso[5].replace(/０/gu, '〇'));
    const first = `${renderTitle(liangAlso[1])}${firstScrolls == null ? '' : `, ${firstScrolls} ${scrollWord(firstScrolls)}`}`;
    const secondTitles = `${renderTitle(liangAlso[3])} and ${renderTitle(liangAlso[4])}`;
    const second = secondScrolls == null ? secondTitles : `${secondTitles}, ${secondScrolls} ${scrollWord(secondScrolls)}`;
    return `${first}. The Liang catalog also listed ${second}.`;
  }
  const scrollMatch = zh.match(/([一二三四五六七八九十百千萬〇零０两兩]+)卷/u);
  const scrolls = scrollMatch ? parseChineseNumber(scrollMatch[1].replace(/０/gu, '〇')) : null;
  const parts = [];
  if (/梁有/u.test(zh)) {
    parts.push(`The Liang catalog listed ${titles.length === 1 ? titles[0] : titles.join(' and ')}`);
  } else {
    parts.push(titles.length === 1 ? titles[0] : titles.join(' and '));
  }
  if (scrolls != null) parts.push(`${scrolls} ${scrollWord(scrolls)}`);
  const composed = creatorPhrase(zh, '撰');
  const annotated = creatorPhrase(zh, '注');
  if (composed) parts.push(`composed by ${composed}`);
  if (annotated) parts.push(`annotated by ${annotated}`);
  if (/問/u.test(zh) && /答/u.test(zh)) {
    const asker = creatorPhrase(zh, '問');
    const answerer = creatorPhrase(zh, '答');
    if (asker || answerer) parts.push(`questions by ${asker || 'the named questioner'}, answers by ${answerer || 'the named respondent'}`);
  }
  if (/(?:[，,；;]\s*亡|亡。)$/u.test(zh.replace(/《[^》]*》/gu, ''))) parts.push('now lost');
  return `${parts.filter(Boolean).join(', ')}.`;
}

function translateSimple(zh) {
  const text = String(zh || '').trim();
  let match = text.match(/^\(([^)]+)\)$/u);
  if (match) return `Gloss: ${match[1]}.`;
  match = text.match(/^(.+?)音(.+?)(?:。)?$/u);
  if (match) return `${match[1]} is pronounced ${match[2]}.`;
  match = text.match(/^(.+?)，(.+?)也。?$/u);
  if (match) return `${match[1]} means ${match[2]}.`;
  match = text.match(/^(.+?)曰：「(.*)$/u);
  if (match) return `${match[1]} says: "${match[2]}`;
  match = text.match(/^(.+?)云：「(.*)$/u);
  if (match) return `${match[1]} says: "${match[2]}`;
  match = text.match(/^(.+?)作「(.+?)」(?:。)?$/u);
  if (match) return `${match[1]} is written as "${match[2]}."`;
  return null;
}

function replaceCitedText(zh, oldText) {
  let text = String(oldText || '');
  const { titles, quoted, angles } = sourceTokens(zh);
  const authors = [];
  for (const verb of ['撰', '注', '問', '答']) {
    authors.push(...extractCreators(zh, verb));
  }
  if (titles.length === 0 && quoted.length === 0 && angles.length === 0 && authors.length === 0) return null;
  const nextAuthor = () => authors.shift() || titles[0] || quoted[0] || angles[0] || '';
  text = text.replace(/to the tune the cited text/giu, () => `to the tune ${titles[0] || quoted[0] || angles[0] || ''}`);
  text = text.replace(/hymn the cited text/giu, () => `hymn ${titles[0] || quoted[0] || angles[0] || ''}`);
  text = text.replace(/composed by the cited text/giu, () => `composed by ${nextAuthor()}`);
  text = text.replace(/annotated by the cited text/giu, () => `annotated by ${nextAuthor()}`);
  text = text.replace(/commentarial glosses by the cited text/giu, () => `commentarial glosses by ${nextAuthor()}`);
  text = text.replace(/by the cited text/giu, () => `by ${nextAuthor()}`);
  text = text.replace(/juan the cited text/giu, () => angles.shift() || titles.shift() || quoted.shift() || nextAuthor());
  text = text.replace(/the cited graph/giu, () => quoted.shift() || titles.shift() || angles.shift() || nextAuthor());
  const candidates = [...titles, ...quoted, ...angles, ...authors].filter(Boolean);
  let index = 0;
  text = text.replace(/the cited text/giu, () => candidates[index++] || candidates[candidates.length - 1] || '');
  text = text
    .replace(/\s+,/gu, ',')
    .replace(/,\s*,/gu, ', ')
    .replace(/\s+\./gu, '.')
    .replace(/ {2,}/gu, ' ')
    .trim();
  if (!text || /the cited (?:text|graph)/iu.test(text)) return null;
  return text;
}

function repairText(zh, oldText, pattern) {
  if (!oldText) return null;
  const manual = MANUAL_TRANSLATIONS.get(String(zh || '').trim());
  if (manual) return manual;
  if (pattern === 'raw-note-label-template') return null;
  if (!['cited-text-template', 'see-chinese-subcommentary-template'].includes(pattern)) return null;
  if (pattern === 'cited-text-template') {
    const total = translateCatalogTotal(zh);
    if (total) return total;
    const biblio = translateBiblio(zh);
    if (biblio && /(?:scroll|listed|composed|annotated|lost)/u.test(biblio)) return biblio;
    const filled = fillPlaceholdersInExistingEnglish(zh, oldText);
    if (filled) return filled;
    const textualNote = translateTextualNote(zh);
    if (textualNote) return textualNote;
    const replaced = replaceCitedText(zh, oldText);
    if (replaced) return replaced;
    return translateSimple(zh);
  }
  const textualNote = translateTextualNote(zh);
  if (textualNote) return textualNote;
  if (pattern === 'see-chinese-subcommentary-template' && /^\([^)]+\)$/u.test(String(zh).trim())) {
    return translateSimple(zh);
  }
  return translateSimple(zh);
}

function canCopyIdiomaticForSourceNote(item, unit, translation, oldText) {
  if (item.pattern !== 'raw-note-label-template') return false;
  if (item.field !== 'literal') return false;
  if (!/^Source note:/u.test(String(oldText || ''))) return false;
  if (RAW_NOTE_COPY_EXCLUDED_IDS.has(String(item.id || ''))) return false;
  const zh = String(item.chinese || unit?.zh || unit?.content || '');
  if (/[「『」』]/u.test(zh)) return false;
  const idiomatic = String(translation?.idiomatic || '').trim();
  if (!idiomatic || GENERIC_PLACEHOLDER_RE.test(idiomatic)) return false;
  return true;
}

function iterUnits(data) {
  const units = new Map();
  for (const block of data.content || []) {
    for (const unit of [...(block.sentences || []), ...(block.cells || [])]) {
      if (unit?.id) units.set(unit.id, unit);
    }
  }
  return units;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const report = JSON.parse(fs.readFileSync(opts.report, 'utf8'));
  const items = (report.items || [])
    .filter((item) => !opts.book || item.book === opts.book)
    .filter((item) => !opts.chapter || item.chapter === opts.chapter)
    .slice(0, opts.limit);
  const byFile = new Map();
  for (const item of items) {
    if (!byFile.has(item.file)) byFile.set(item.file, []);
    byFile.get(item.file).push(item);
  }

  let repaired = 0;
  let skipped = 0;
  const samples = [];
  for (const [file, fileItems] of byFile) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const units = iterUnits(data);
    let changed = false;
    for (const item of fileItems) {
      const unit = units.get(item.id);
      const translation = unit?.translations?.[0];
      if (!translation || !(item.field in translation)) {
        skipped += 1;
        continue;
      }
      const oldText = translation[item.field];
      let newText = repairText(item.chinese || unit.zh || unit.content || '', oldText, item.pattern);
      if (!newText && canCopyIdiomaticForSourceNote(item, unit, translation, oldText)) {
        newText = translation.idiomatic.trim();
      }
      if (!newText || newText === oldText || /the cited (?:text|graph)/iu.test(newText) || /See Chinese subcommentary/iu.test(newText)) {
        skipped += 1;
        continue;
      }
      translation[item.field] = newText;
      translation.model = 'GPT-5 Codex';
      changed = true;
      repaired += 1;
      if (opts.sampleLimit < 0 || samples.length < opts.sampleLimit) {
        samples.push({ file, id: item.id, field: item.field, oldText, newText });
      }
    }
    if (changed && opts.apply) {
      fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    }
  }
  console.log(JSON.stringify({
    mode: opts.apply ? 'apply' : 'dry-run',
    reviewer: DEFAULT_REVIEWER,
    considered: items.length,
    repaired,
    skipped,
    samples,
  }, null, 2));
}

main();
