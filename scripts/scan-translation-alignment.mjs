#!/usr/bin/env node
/**
 * Scan for likely Chinese/English sentence misalignment and low glossary
 * coverage using bilingual anchors.
 *
 * This does not try to prove semantic fidelity. Distinctive manual terms are
 * treated as high-confidence anchors. The full glossary, including proper nouns,
 * is used as fuzzy aggregate evidence when several terms point to the same
 * neighboring sentence. It is also used to score same-sentence glossary coverage
 * so review passes can surface translations that are not obvious offsets but
 * still fail to carry enough distinctive source terms into English.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const GLOSSARY_PATH = path.join(DATA_DIR, 'glossary.json');
const SCANNER_VERSION = '2026-07-10-calendar-technical-anchors';

const CHECK_FIELDS = new Set([
  'idiomatic',
  'translation',
  'en',
  'english',
]);
const SUPPORT_FIELDS = new Set([
  ...CHECK_FIELDS,
  'literal',
]);

const MANUAL_ANCHORS = [
  ['Taiyi', ['太一', '泰一', '泰畤'], /\bTai ?yi\b/i],
  ['Shangdi', ['上帝'], /\b(?:Shangdi|Shang Di|Supreme (?:God|Deity))\b/i],
  ['Houtu', ['后土', '後土'], /\bHou ?tu\b/i],
  ['Lingxing', ['靈星', '灵星'], /\bLingxing\b/i],
  ['Penglai', ['蓬萊', '蓬莱'], /\bPenglai\b/i],
  ['Fangzhang', ['方丈'], /\bFangzhang\b/i],
  ['Yingzhou', ['瀛洲'], /(?<!of\s)\bYingzhou\b/i],
  ['Jianzhang Palace', ['建章宮', '建章宫'], /\bJianzhang Palace\b/i],
  ['Ganquan', ['甘泉'], /\bGanquan\b/i],
  ['Mount Tai', ['泰山', '太山', '岱'], /\b(?:Mount Tai|Tai Shan|Taishan|Dai zong)\b/i],
  ['Daizong', ['代宗', '代時', '代时'], /\bDai ?zong\b/i],
  ['Langya', ['瑯邪', '琅邪', '琅琊'], /\bLang(?:ya|ye)\b/i],
  ['Linzi', ['臨菑', '臨淄', '临淄'], /\bLinzi\b/i],
  ["Chang'an", ['長安', '长安'], /\bChang[’']?an\b/i],
  ['Jieshi', ['碣石'], /\bJieshi\b/i],
  ['Liaoxi', ['遼西', '辽西'], /\bLiaoxi\b/i],
  ['Jiuyuan', ['九原'], /\bJiuyuan\b/i],
  ['Pengcheng', ['彭城'], /\bPengcheng\b/i],
  ['Jiang-Huai', ['江淮'], /\b(?:Jiang-?Huai|Yangzi and Huai)\b/i],
  ['Yellow River', ['黃河', '黄河'], /\bYellow River\b/],
  ['Itō Hirobumi', ['伊藤博文'], /\bIt[oō] Hirobumi\b/i],
  ['Mutsu Munemitsu', ['陸奧宗光', '陆奥宗光'], /\bMutsu Munemitsu\b/i],
  ['Shimonoseki', ['馬關', '马关'], /\bShimonoseki\b/i],
  // Common topical ethnonyms/titles are too often supplied from context in English;
  // let the glossary aggregate catch them only when several terms shift together.
  ['Linhu', ['林胡'], /\bLinhu\b/i],
  ['Jizi', ['箕子'], /\bJizi\b/i],
  ['Bigan', ['比干'], /\bBigan\b/i],
  ['Wei Zi', ['微子'], /\bWei Zi\b/i],
  ['Wu Geng', ['武庚'], /\bWu Geng\b/i],
  ['Guan Shu', ['管叔'], /\bGuan Shu\b/i],
  ['Cai Shu', ['蔡叔'], /\bCai Shu\b/i],
  ['Xinyuan Ping', ['新垣平'], /\bXinyuan Ping\b/i],
  ['Gongsun Qing', ['公孫卿', '公孙卿'], /\bGongsun Qing\b/i],
  ['Gongsun Chen', ['公孫臣', '公孙臣'], /\bGongsun Chen\b/i],
  ['Shaojun', ['少君'], /\bShaojun\b/i],
  ['Shaoweng', ['少翁'], /\bShao ?weng\b/i],
  ['General of the Five Benefits', ['五利'], /\b(?:Five Benefits|Wuli)\b/i],
  ['Guiyu Qu', ['鬼臾區', '鬼臾区'], /\bGuiyu Qu\b/i],
  ['Jade Hall', ['玉堂'], /\bJade Hall\b/i],
  ['Bi Gate', ['璧門', '璧门'], /\b(?:Bi|Jade) Gate\b/i],
  ['Great Bird', ['大鳥', '大鸟'], /\bGreat Bird\b/i],
  ['immortals', ['僊', '仙', '神仙'], /\bimmortals?\b/i],
  ['fangshi', ['方士'], /\bfangshi\b/i],
  ['tripods', ['鼎'], /\b(?:dings?|tripods?|Nine Tripods)\b/],
  ['white deer', ['白鹿'], /\bwhite deer\b/i],
  ['white gold', ['白金'], /\bwhite gold\b/i],
  ['jade cup', ['玉杯'], /\bjade cup\b/i],
];

const SUPPLEMENTAL_GLOSSARY_ANCHORS = [
  ['檢校', ['檢校', '检校'], /\bacting\b/i],
  ['尚書', ['尚書', '尚书'], /\b(?:minister|Department of State Affairs)\b/i],
  ['侍郎', ['侍郎'], /\bvice minister\b/i],
  ['刺史', ['刺史'], /\bprefect\b/i],
  ['節度使', ['節度使', '节度使', '節度', '节度'], /\b(?:military commissioner|commissioner)\b/i],
  ['觀察使', ['觀察使', '观察使', '觀察', '观察'], /\b(?:observation|observer)\b/i],
  ['平章事', ['平章事'], /\bgrand councillor\b/i],
  ['兵部', ['兵部'], /\b(?:Ministry of War|minister of war)\b/i],
  ['吏部', ['吏部'], /\b(?:Ministry of Personnel|ministry of personnel)\b/i],
  ['工部', ['工部'], /\b(?:Ministry of Works|minister of works)\b/i],
  ['禮部', ['禮部', '礼部'], /\b(?:Ministry of Rites|minister of rites)\b/i],
  ['刑部', ['刑部'], /\b(?:Ministry of Punishments|Ministry of Justice|Minister of Justice|minister of punishments|minister of justice)\b/i],
  ['戶部', ['戶部', '户部'], /\b(?:Ministry of Revenue|minister of revenue|revenue commissioner|Revenue)\b/i],
  ['御史大夫', ['御史大夫'], /\bcensor-in-chief\b/i],
  ['金吾衛', ['金吾衛', '金吾卫'], /\bGolden Crow Guards\b/i],
  ['上將軍', ['上將軍', '上将军'], /\bSenior Generals\b/i],
  ['樞密', ['樞密', '枢密'], /\bmilitary affairs\b/i],
  ['都承旨', ['都承旨'], /\bchief reception officer\b/i],
  ['國子祭酒', ['國子祭酒', '国子祭酒'], /\bChancellor of the Directorate of Education\b/i],
  ['國子監', ['國子監', '国子监'], /\bDirectorate of Education\b/i],
  ['太常', ['太常'], /\b(?:Court of Imperial Sacrifices|sacrifices)\b/i],
  ['承德郎', ['承德郎'], /\bGentleman of Continued Merit\b/i],
  ['儒林郎', ['儒林郎'], /\bGentleman of the Forest of Scholars\b/i],
  ['宣德郎', ['宣德郎'], /\bGentleman of Propagating Virtue\b/i],
  ['文林郎', ['文林郎'], /\bGentleman of Literary Forest\b/i],
  ['宣義郎', ['宣義郎', '宣义郎'], /\bGentleman of Propagating Righteousness\b/i],
  ['徵仕郎', ['徵仕郎', '征仕郎'], /\bGentleman Summoned to Office\b/i],
  ['修職郎', ['修職郎', '修职郎'], /\bGentleman of Cultivated Office\b/i],
  ['修職佐郎', ['修職佐郎', '修职佐郎'], /\bAssociate Gentleman of Cultivated Office\b/i],
  ['登仕郎', ['登仕郎'], /\bGentleman of Ascending Office\b/i],
  ['登仕佐郎', ['登仕佐郎'], /\bAssociate Gentleman of Ascending Office\b/i],
  ['敕命', ['敕命'], /\bedicts? of appointment\b/i],
  ['典藥', ['典藥', '典药'], /\bpharmacy director\b/i],
  ['少府', ['少府'], /\bPalace Manufactories\b/i],
  ['將作', ['將作', '将作'], /\b(?:Imperial Construction|Palace Construction|construction)\b/i],
  ['軍器', ['軍器', '军器'], /\b(?:Armaments|Military Equipment)\b/i],
  ['都水', ['都水'], /\bWaterways\b/i],
  ['內侍省', ['內侍省', '内侍省'], /\b(?:Inner Palace Eunuch Service|inner palace eunuch service|inner attendant)\b/i],
  ['太子侍讀', ['太子侍讀', '太子侍读'], /\bheir(?: apparent)? lecturer\b/i],
  ['侍講', ['侍講', '侍讲'], /\bpreceptor\b/i],
  ['散騎常侍', ['散騎常侍', '散骑常侍'], /\b(?:attendant cavalier|Cavalier)\b/i],
  ['紫金魚袋', ['紫金魚袋', '紫金鱼袋'], /\b(?:purple robe and gold fish-bag|purple-gold fish)\b/i],
  ['金魚袋', ['金魚袋', '金鱼袋'], /\bgold fish-bag\b/i],
  ['柱國', ['柱國', '柱国'], /\bpillar of state\b/i],
  ['食邑', ['食邑'], /\b(?:households?|fief)\b/i],
  ['大都督府', ['大都督府'], /\bgrand commandery\b/i],
  ['長史', ['長史', '长史'], /\b(?:chief secretary|chief administrator)\b/i],
  ['翰林學士', ['翰林學士', '翰林学士'], /\bHanlin academician\b/i],
  ['知制誥', ['知制誥', '知制诰'], /\bdrafter of edicts\b/i],
  ['承旨', ['承旨'], /\bacademician-in-chief\b/i],
  ['宰相', ['宰相'], /\b(?:chief ministers?|grand councillors?)\b/i],
  ['史館', ['史館', '史馆'], /\bHistory Office\b/i],
  ['故事', ['故事'], /\bprecedent\b/i],
  ['時政', ['時政', '时政'], /\bcurrent policy\b/i],
  ['庫部', ['庫部', '库部'], /\bStores Bureau\b/i],
  ['員外郎', ['員外郎', '员外郎'], /\bouter-section member\b/i],
  ['長安令', ['長安令', '长安令'], /\bChang[’']?an magistrate\b/i],
  ['職司', ['職司', '职司'], /\boffices?\b/i],
  ['口岸', ['口岸'], /\bports?\b/i],
  ['度量權衡', ['度量權衡', '度量权衡'], /\bweights? and measures?\b/i],
  ['米穀', ['米穀', '米谷'], /\brice and grain\b/i],
  ['商牌', ['商牌'], /\btrademarks?\b/i],
  ['國幣', ['國幣', '国币'], /\bnational currency\b/i],
  ['領海', ['領海', '领海'], /\bterritorial sea\b/i],
  ['公海', ['公海'], /\bhigh seas\b/i],
  ['海里', ['海里'], /\b(?:nautical )?miles?\b/i],
  ['載籍', ['載籍', '载籍'], /\barchival records\b/i],
  ['散亡', ['散亡'], /\bscattered(?: and lost)?\b/i],
  ['祠部', ['祠部'], /\b(?:Sacrificial Affairs|Ministry of Rites)\b/i],
  ['職方', ['職方', '职方'], /\b(?:Military Appointments|Ministry of War)\b/i],
  ['閏年', ['閏年', '闰年'], /\bintercalary\b/i],
  ['大辟', ['大辟'], /\bcapital cases\b/i],
  ['案牘', ['案牘', '案牍'], /\bfiles\b/i],
  ['戶口', ['戶口', '户口'], /\bhousehold numbers\b/i],
  ['等級', ['等級', '等级'], /\bgrades\b/i],
  ['舊章', ['舊章', '旧章'], /\bold regulations\b/i],
  ['常參', ['常參', '常参'], /\bregular court officials\b/i],
  ['通判', ['通判'], /\bcircuit controller\b/i],
  ['天官', ['天官'], /\bminister of heaven\b/i],
  ['選舉', ['選舉', '选举'], /\bselection\b/i],
  ['功過', ['功過', '功过'], /\bmerits? and faults?\b/i],
  ['太守', ['太守'], /\bgovernors?\b/i],
  ['數年', ['數年', '数年'], /\byears\b/i],
  ['樞密院', ['樞密院', '枢密院'], /\bmilitary affairs\b/i],
  ['參知政事', ['參知政事', '参知政事'], /\bparticipants? in governance\b/i],
  ['同知', ['同知'], /\bassociate\b/i],
  ['五行', ['五行'], /\b(?:Five Phases|five phases)\b/i],
  ['立春', ['立春'], /\b(?:Spring Begins|Beginning of Spring)\b/i],
  ['立夏', ['立夏'], /\b(?:Summer Begins|Beginning of Summer)\b/i],
  ['立秋', ['立秋'], /\b(?:Autumn Begins|Beginning of Autumn)\b/i],
  ['立冬', ['立冬'], /\b(?:Winter Begins|Beginning of Winter)\b/i],
  ['四分曆', ['四分曆', '四分历'], /\b(?:Sifen|Quarter-Day) Calendar\b/i],
  ['春秋', ['春秋'], /\bSpring and Autumn(?: Annals)?\b/i],
  ['藝文志', ['藝文志', '艺文志'], /\bBibliographic Treatise\b/i],
  ['日蝕', ['日蝕', '日食'], /\bsolar eclipses?\b/i],
  ['冬至', ['冬至'], /\bwinter solstice\b/i],
  ['大餘', ['大餘', '大余'], /\blarge remainder\b/i],
  ['光祿大夫', ['光祿大夫', '光禄大夫'], /\b(?:Grand Master|grandee)s?\b/i],
  ['金紫光祿大夫', ['金紫光祿大夫', '金紫光禄大夫'], /\b(?:Gold-Purple Grand Master|Golden purple grandees?)\b/i],
  ['倉部', ['倉部', '仓部'], /\bGranaries\b/i],
  ['主客', ['主客'], /\bForeign Guests\b/i],
  ['膳部', ['膳部'], /\bProvisions\b/i],
  ['屯田', ['屯田'], /\bAgriculture\b/i],
  ['虞部', ['虞部'], /\bForestry\b/i],
  ['水部', ['水部'], /\bWaterways\b/i],
  ['春官', ['春官'], /\bSpring .*Office\b/i],
  ['夏官', ['夏官'], /\bSummer .*Office\b/i],
  ['秋官', ['秋官'], /\bAutumn .*Office\b/i],
  ['冬官', ['冬官'], /\bWinter .*Office\b/i],
  ['司馬', ['司馬', '司马'], /\b(?:administration secretary|military adjutant|adjutant)\b/i],
  ['秘書', ['秘書', '秘书'], /\b(?:Secretariat|Archive|archive)\b/i],
  ['殿直', ['殿直'], /\bclass attendants?\b/i],
  ['著作', ['著作'], /\b(?:author|compilation|Compilation)\b/i],
  ['大理寺', ['大理寺'], /\b(?:Court of Judgments|Court of Judicial Review)\b/i],
  ['太學', ['太學', '太学'], /\b(?:Imperial Academy|academy)\b/i],
  ['廣文', ['廣文', '广文'], /\bBroad Learning\b/i],
  ['書學', ['書學', '书学'], /\bCalligraphy\b/i],
  ['算學', ['算學', '算学'], /\bMathematics\b/i],
  ['軍器監', ['軍器監', '军器监'], /\bDirectorate of Military Equipment\b/i],
  ['校書郎', ['校書郎', '校书郎'], /\bcollators?\b/i],
  ['監候', ['監候'], /\b(?:astronomical )?observers?\b/i],
  ['監事', ['監事'], /\bsupervisors?\b/i],
  ['太醫', ['太醫', '太医'], /\b(?:imperial medical|medical)\b/i],
  ['太公', ['太公'], /\bGrand Duke\b/i],
  ['博士', ['博士'], /\berudites?\b/i],
  ['助教', ['助教'], /\bassistant instructors?\b/i],
  ['宗正', ['宗正'], /\bImperial Clan\b/i],
  ['大理', ['大理'], /\b(?:Judicial Review|Judgments)\b/i],
  ['太中大夫', ['太中大夫'], /\bGrand Masters? of Central Merit\b/i],
  ['保和殿', ['保和殿'], /\bBaohe\b/i],
  ['大匠', ['大匠'], /\bpalace construction\b/i],
  ['太史', ['太史'], /\bAstronom(?:ical|y)\b/i],
  ['司天監', ['司天監', '司天监'], /\bDirectorate of Astronomy\b/i],
  ['天監', ['天監', '天监'], /\bDirectorate of Astronomy\b/i],
  ['靈台', ['靈台', '灵台'], /\bObservatory\b/i],
  ['保章', ['保章'], /\bCalendar Keeper\b/i],
  ['挈壺', ['挈壺', '挈壶'], /\bClepsydra Keeper\b/i],
  ['樞密使', ['樞密使', '枢密使'], /\bCommissioners? of Military Affairs\b/i],
  ['三司', ['三司'], /\bThree Excellencies\b/i],
  ['太師', ['太師', '太师'], /\bGrand Preceptor\b/i],
  ['太傅', ['太傅'], /\bGrand Tutor\b/i],
  ['太保', ['太保'], /\bGrand Guardian\b/i],
  ['主司', ['主司'], /\bchief examiner\b/i],
  ['試藝', ['試藝', '试艺'], /\btests? arts\b/i],
  ['與奪', ['與奪', '与夺'], /\bdecide pass or fail\b/i],
  ['戍卒', ['戍卒'], /\bgarrison\b/i],
  ['戍', ['戍'], /\bgarrison(?:ing)?\b/i],
  ['貞觀', ['貞觀', '贞观'], /\bZhenguan\b/i],
  ['監察御史', ['監察御史', '监察御史'], /\bSupervising Censor\b/i],
  ['有限', ['有限'], /\blimits?\b/i],
  ['隨身', ['隨身', '随身'], /\bpersonal guards?\b/i],
  ['經略', ['經略', '经略'], /\bfrontier commissioners?\b/i],
  ['領侍衛內大臣', ['領侍衛內大臣', '领侍卫内大臣'], /\bchief ministers? of the Imperial Guard\b/i],
  ['前鋒統領', ['前鋒統領', '前锋统领'], /\bvanguard commanders?\b/i],
  ['護軍統領', ['護軍統領', '护军统领'], /\bguard commanders?\b/i],
  ['步軍統領', ['步軍統領', '步军统领'], /\bmetropolitan infantry commanders?\b/i],
  ['火器營', ['火器營', '火器营'], /\bFirearms Battalion\b/i],
  ['神機營', ['神機營', '神机营'], /\bDivine Engine Camp\b/i],
  ['官兵', ['官兵'], /\bcorps\b/i],
  ['大將軍', ['大將軍', '大将军'], /\bgrand generals?\b/i],
  ['參贊大臣', ['參贊大臣', '参赞大臣'], /\b(?:assistant|consultant) ministers?\b/i],
  ['宣撫使司', ['宣撫使司', '宣抚使司'], /\bpacification commissioners?\b/i],
  ['安撫使司', ['安撫使司', '安抚使司'], /\bpacification commissioners?\b/i],
  ['千總', ['千總', '千总'], /\bbattalion chiefs?\b/i],
  ['漢文', ['漢文', '汉文'], /\bHan\b/i],
  ['懸針篆', ['懸針篆', '悬针篆'], /\bsuspended-needle seal script\b/i],
  ['旗手衛', ['旗手衛', '旗手卫'], /\bBanner Drummer Guard\b/i],
  ['長官司', ['長官司', '长官司'], /\bchiefs?\b/i],
  ['指揮僉事', ['指揮僉事', '指挥佥事'], /\bassistant regional commanders?\b/i],
  ['詹事府', ['詹事府'], /\b(?:heir apparent(?:’s|'s)? establishment|Court of the Heir Apparent)\b/i],
  ['太僕寺', ['太僕寺', '太仆寺'], /\bImperial Stud\b/i],
  ['主簿', ['主簿'], /\b(?:chief clerks?|registr(?:y|ies)|registry halls?)\b/i],
  ['鹽運使司', ['鹽運使司', '盐运使司'], /\bsalt transport commissions?\b/i],
  ['宣慰使司', ['宣慰使司'], /\bpacification commissions?\b/i],
  ['經歷', ['經歷', '经历'], /\b(?:registrars?|registr(?:y|ies))\b/i],
  ['鴻臚寺', ['鴻臚寺', '鸿胪寺'], /\bCourt of State Ceremonial\b/i],
  ['欽天監', ['欽天監', '钦天监'], /\b(?:Directorate of Astronomy|astronomy)\b/i],
  ['王府', ['王府'], /\bprincely\b/i],
  ['良醫', ['良醫', '良医'], /\bCourt Physician\b/i],
  ['宣撫司', ['宣撫司', '宣抚司'], /\bPacification Offices?\b/i],
  ['布政司', ['布政司'], /\bProvincial Administration Commission\b/i],
  ['照磨', ['照磨'], /\brubbing(?:-and-copying)?\b/i],
  ['典簿', ['典簿'], /\bRegistry Halls?\b/i],
  ['司獄司', ['司獄司', '司狱司'], /\bprison offices?\b/i],
  ['上林苑監', ['上林苑監', '上林苑监'], /\b(?:Directorate of the )?(?:Imperial Parks|Upper Forest Park)\b/i],
  ['寶鈔', ['寶鈔', '宝钞'], /\b(?:Treasure Notes|Paper Currency)\b/i],
  ['四清吏司', ['四清吏司'], /\bfour Clear Officials Bureaus\b/i],
  ['職方', ['職方', '职方'], /\bAppointments and Operations\b/i],
  ['車駕', ['車駕', '车驾'], /\bChariots and Travels\b/i],
  ['武庫', ['武庫', '武库'], /\bMilitary Storehouses\b/i],
  ['都護', ['都護', '都护'], /\bprotector\b/i],
  ['留後', ['留後', '留后'], /\bprovisional .*commander\b/i],
  ['兵馬', ['兵馬', '兵马'], /\b(?:troops|forces)\b/i],
  ['防禦', ['防禦', '防御'], /\bdefen[cs]e\b/i],
  ['轉運使', ['轉運使', '转运使'], /\btransport commissioner\b/i],
  ['鹽鐵', ['鹽鐵', '盐铁'], /\bsalt-and-iron\b/i],
  ['迴紇', ['迴紇', '回紇', '回鹘'], /\bUighur\b/i],
  ['京師', ['京師', '京师'], /\b(?:capital|Capital)\b/i],
  ['御史台', ['御史台'], /\bCensorate\b/i],
  ['刑獄', ['刑獄', '刑狱'], /\bcriminal cases\b/i],
  ['尚書省', ['尚書省', '尚书省'], /\b(?:Ministry of State|Department of State Affairs)\b/i],
  ['朝官', ['朝官'], /\bcourt officials\b/i],
  ['官吏', ['官吏'], /\bofficials?\b/i],
  ['百姓', ['百姓'], /\b(?:people|commoners?)\b/i],
  ['州縣', ['州縣', '州县'], /\bprefectures? and counties\b/i],
  ['錢物', ['錢物', '钱物'], /\bmoney and goods\b/i],
  ['什物', ['什物'], /\bgoods\b/i],
  ['舊例', ['舊例', '旧例'], /\bold categories\b/i],
  ['諫議大夫', ['諫議大夫', '谏议大夫'], /\bremonstrance grandees?\b/i],
  ['給事中', ['給事中', '给事中'], /\bsupervising secretar(?:y|ies)\b/i],
  ['中書舍人', ['中書舍人', '中书舍人'], /\bSecretariat drafters?\b/i],
  ['寺', ['寺'], /\b(?:temple|monaster(?:y|ies))\b/i],
  ['僧尼', ['僧尼'], /\bmonks? and nuns?\b/i],
  ['兩稅戶', ['兩稅戶', '两税户'], /\btwo-tax households?\b/i],
  ['招提', ['招提'], /\bshrine\b/i],
  ['蘭若', ['蘭若', '兰若'], /\bhermitage\b/i],
  ['上田', ['上田'], /\bupper-grade fields?\b/i],
  ['奴婢', ['奴婢'], /\bbond ?servants?\b/i],
  ['隋朝', ['隋朝'], /\bSui\b/i],
  ['帝王', ['帝王'], /\bimperial\b/i],
  ['詔令', ['詔令', '诏令'], /\bedicts?\b/i],
  ['制置', ['制置'], /\binstitutions?\b/i],
  ['錢穀', ['錢穀', '钱谷'], /\b(?:coin|grain)\b/i],
  ['損益', ['損益', '损益'], /\b(?:changes|gains and losses)\b/i],
  ['利害', ['利害'], /\b(?:advantages?|dangers?|harm)\b/i],
  ['僧道', ['僧道'], /\b(?:Buddhism|Daoism|Buddhist|Daoist)\b/i],
  ['編年', ['編年', '编年'], /\bchronolog(?:y|ical|ically)\b/i],
];

const COMMON_SOURCE_MIN_LENGTH = 2;
const VALID_GLOSSARY_SCOPES = new Set(['all', 'proper', 'manual']);
const PROPER_GLOSSARY_MIN_NEARBY_SCORE = 2.35;
const MIXED_GLOSSARY_MIN_NEARBY_SCORE = 2.7;
const COMMON_ONLY_GLOSSARY_MIN_NEARBY_SCORE = 4.2;
const SAME_SENTENCE_MIN_SOURCE_SCORE = 4.2;
const SAME_SENTENCE_REVIEW_MIN_SOURCE_SCORE = 1.5;
const SAME_SENTENCE_MAX_COVERAGE = 0.12;
const SAME_SENTENCE_REVIEW_MAX_COVERAGE = 0.4;
const MAX_VARIANT_LENGTH = 40;

function stripDiacritics(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function definitionVariants(definition) {
  return String(definition || '')
    .split(/[;,/]/)
    .map((value) => value.replace(/\([^)]*\)/g, '').replace(/^(?:the|a|an)\s+/i, '').trim())
    .filter((value) => (
      value.length >= 3
      && value.length <= MAX_VARIANT_LENGTH
      && /[A-Za-z]/.test(value)
      && !/^(?:of|and|or|to|in|on|at|by|for|from|with|as|is|are|was|were)\b/i.test(value)
    ));
}

function pinyinVariants(pinyin) {
  const normalized = stripDiacritics(String(pinyin || ''))
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!normalized || normalized.length < 3) return [];
  const compact = normalized.replace(/\s+/g, '');
  if (compact.length < 5) return [];
  const spaced = normalized
    .split(' ')
    .map((word) => word ? `${word[0].toUpperCase()}${word.slice(1)}` : '')
    .join(' ');
  const compactTitle = compact[0].toUpperCase() + compact.slice(1);
  return [...new Set([compact, compactTitle, spaced].filter(Boolean))];
}

function expandedEnglishVariants(variants) {
  const expanded = [];
  for (const variant of variants) {
    const plainApostrophe = variant.replace(/[’']/g, ' ').replace(/\s+/g, ' ').trim();
    if (plainApostrophe !== variant) expanded.push(plainApostrophe);
    const noApostrophe = variant.replace(/[’']/g, '');
    if (noApostrophe !== variant) expanded.push(noApostrophe);

    const mt = variant.match(/^Mt\.?\s+(.+)$/);
    if (mt) {
      expanded.push(`Mount ${mt[1]}`);
      expanded.push(`Mount ${mt[1].replace(/[’']/g, ' ').replace(/\s+/g, ' ').trim()}`);
    }

    const trailingDynasty = variant.match(/^((?:King|Queen|Emperor|Prince|Duke|Marquis|Lord) [A-Z][A-Za-z'’.-]+) of [A-Z][A-Za-z'’.-]+$/);
    if (trailingDynasty) expanded.push(trailingDynasty[1]);

    const compactTitle = variant.match(/^(Duke|Marquis|Lord|Prince) ([A-Z][A-Za-z'’.-]+)$/);
    if (compactTitle) expanded.push(`${compactTitle[1]} of ${compactTitle[2]}`);

    const compactKing = variant.match(/^King ([A-Z][A-Za-z'’.-]+)$/);
    if (compactKing) expanded.push(`${compactKing[1]} Wang`);

    const wangTitle = variant.match(/^([A-Z][A-Za-z'’.-]+) Wang$/);
    if (wangTitle) expanded.push(`King ${wangTitle[1]}`);

    const heavenlyEmperor = variant.match(/^(.+?) Heavenly Emperor$/);
    if (heavenlyEmperor) expanded.push(`${heavenlyEmperor[1]} Emperor`);

    const dukeOf = variant.match(/^Duke of ([A-Z][A-Za-z'’.-]+)$/);
    if (dukeOf) {
      expanded.push(`${dukeOf[1]} Gong`);
      expanded.push(`Lord ${dukeOf[1]}`);
    }
  }
  return [...new Set([...variants, ...expanded])];
}

function variantRegex(variants) {
  const parts = expandedEnglishVariants([...new Set(variants)])
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map((variant) => escapeRegex(variant).replace(/ /g, "[\\s\\-'’]+"));
  if (parts.length === 0) return null;
  return new RegExp(`\\b(?:${parts.join('|')})\\b`, 'i');
}

function capitalizedDefinitionVariants(definitions) {
  return definitions
    .flatMap(definitionVariants)
    .filter((variant) => /(?:^|[\s-])[A-Z][a-z]/.test(variant));
}

function isBareNumericGlossaryText(text) {
  return /^[〇零一二兩两三四五六七八九十百千萬万億亿兆又有余餘半分]+$/u.test(text);
}

function loadGlossaryAnchors({ properOnly = false, commonOnly = false, mode = 'pinyin' } = {}) {
  if (!fs.existsSync(GLOSSARY_PATH)) return [];
  const glossary = Object.values(JSON.parse(fs.readFileSync(GLOSSARY_PATH, 'utf8')));
  const anchors = [];
  const seen = new Set();
  for (const entry of glossary) {
    const text = String(entry.text || '');
    const isProperNoun = Boolean(entry.isProperNoun);
    if (properOnly && !isProperNoun) continue;
    if (commonOnly && isProperNoun) continue;
    if (text.length < (isProperNoun ? 2 : COMMON_SOURCE_MIN_LENGTH)) continue;
    if (/^[一二三四五六七八九十]+月$/.test(text)) continue;
    if (!isProperNoun && isBareNumericGlossaryText(text)) continue;
    const definitions = Array.isArray(entry.definitions) ? entry.definitions : [];
    let variants = [];
    if (mode === 'pinyin') {
      variants = [
        ...pinyinVariants(entry.pinyin),
        ...capitalizedDefinitionVariants(definitions),
      ].filter(Boolean);
    } else if (mode === 'definitions') {
      variants = definitions.flatMap(definitionVariants);
    }
    const englishRe = variantRegex(variants);
    if (!englishRe) continue;
    const key = `${text}:${englishRe.source}`;
    if (seen.has(key)) continue;
    seen.add(key);
    anchors.push({
      label: text,
      sourceForms: [text],
      englishRe,
      glossary: true,
      proper: isProperNoun,
      common: !isProperNoun,
    });
  }
  return anchors;
}

let HARD_ANCHORS = [];
let COMMON_ANCHORS = [];
let COMMON_SOURCE_INDEX = new Map();
let ANCHOR_STATS = {};

function configureAnchors({ glossaryScope = 'all' } = {}) {
  const manualAnchors = MANUAL_ANCHORS
    .map(([label, sourceForms, englishRe]) => ({ label, sourceForms, englishRe, manual: true }));
  const glossaryAnchors = [];
  if (glossaryScope === 'all') {
    glossaryAnchors.push(...SUPPLEMENTAL_GLOSSARY_ANCHORS.map(([label, sourceForms, englishRe]) => ({
      label,
      sourceForms,
      englishRe,
      glossary: true,
      common: true,
    })));
  }
  if (glossaryScope !== 'manual') {
    glossaryAnchors.push(...loadGlossaryAnchors({ properOnly: true, mode: 'pinyin' }));
  }
  if (glossaryScope === 'all') {
    glossaryAnchors.push(...loadGlossaryAnchors({ commonOnly: true, mode: 'definitions' }));
  }
  HARD_ANCHORS = manualAnchors;
  COMMON_ANCHORS = glossaryAnchors;
  COMMON_SOURCE_INDEX = sourceIndex(COMMON_ANCHORS);
  ANCHOR_STATS = {
    glossaryScope,
    manualAnchors: HARD_ANCHORS.length,
    glossaryAnchors: COMMON_ANCHORS.length,
    properGlossaryAnchors: COMMON_ANCHORS.filter((anchor) => anchor.proper).length,
    commonGlossaryAnchors: COMMON_ANCHORS.filter((anchor) => anchor.common).length,
  };
}

function sourceIndex(anchors) {
  const index = new Map();
  for (const anchor of anchors) {
    for (const form of anchor.sourceForms) {
      const first = form[0];
      if (!first) continue;
      const bucket = index.get(first) || [];
      bucket.push({ form, anchor });
      index.set(first, bucket);
    }
  }
  for (const bucket of index.values()) {
    bucket.sort((a, b) => b.form.length - a.form.length);
  }
  return index;
}

function usage() {
  console.error(`Usage:
  node scripts/scan-translation-alignment.mjs [--book BOOK] [--json] [--summary] [--fail] [--out PATH] [--merge-out] [--cache-current] [--force] [--min-severity N] [--min-glossary-risk N] [--review-priorities] [--offset-clusters] [--glossary-scope all|proper|manual] [--include-sentence-scores] [--no-same-sentence-glossary] [--no-chapter-glossary-health] [path ...]

Flags likely sentence-misalignment candidates using distinctive manual anchors plus fuzzy aggregate matches from the full glossary.
Also scores same-sentence glossary coverage and flags suspiciously low coverage when the Chinese sentence has enough distinctive anchors.
It also reports chapter-level glossary health when fuzzy matches are consistently weak across many scorable sentences.
Proper nouns carry more weight; common terms are used only when several terms corroborate one another.
Use --offset-clusters for a hard publication gate: it reports adjacent nearby-anchor
warnings as probable sentence shifts, and also keeps high-confidence
FABRICATED_OR_SUBSTITUTED_TRANSLATION hits where dense source anchors vanish
from suspiciously thin English. It ignores isolated glossary noise.

Glossary scopes:
  all      Use proper nouns and common multi-character terms as fuzzy evidence (default)
  proper   Use only proper nouns as fuzzy evidence
  manual   Use only the curated hard anchors`);
}

function parseArgs(argv) {
  const opts = {
    inputs: [],
    book: null,
    json: false,
    summary: false,
    fail: false,
    out: null,
    mergeOut: false,
    cacheCurrent: false,
    force: false,
    quiet: false,
    minSeverity: 3,
    minGlossaryRisk: null,
    reviewPriorities: false,
    offsetClusters: false,
    glossaryScope: 'all',
    sameSentenceGlossary: true,
    chapterGlossaryHealth: true,
    includeSentenceScores: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--json') {
      opts.json = true;
      continue;
    }
    if (arg === '--summary') {
      opts.summary = true;
      continue;
    }
    if (arg === '--fail') {
      opts.fail = true;
      continue;
    }
    if (arg === '--out') {
      opts.out = argv[++i];
      if (!opts.out) {
        usage();
        process.exit(2);
      }
      continue;
    }
    if (arg.startsWith('--out=')) {
      opts.out = arg.slice('--out='.length);
      if (!opts.out) {
        usage();
        process.exit(2);
      }
      continue;
    }
    if (arg === '--merge-out') {
      opts.mergeOut = true;
      continue;
    }
    if (arg === '--cache-current') {
      opts.cacheCurrent = true;
      continue;
    }
    if (arg === '--force') {
      opts.force = true;
      continue;
    }
    if (arg === '--quiet') {
      opts.quiet = true;
      continue;
    }
    if (arg === '--review-priorities') {
      opts.reviewPriorities = true;
      continue;
    }
    if (arg === '--offset-clusters') {
      opts.offsetClusters = true;
      continue;
    }
    if (arg === '--no-same-sentence-glossary') {
      opts.sameSentenceGlossary = false;
      continue;
    }
    if (arg === '--no-chapter-glossary-health') {
      opts.chapterGlossaryHealth = false;
      continue;
    }
    if (arg === '--include-sentence-scores') {
      opts.includeSentenceScores = true;
      continue;
    }
    if (arg === '--glossary-scope') {
      opts.glossaryScope = argv[++i];
      if (!VALID_GLOSSARY_SCOPES.has(opts.glossaryScope)) {
        usage();
        process.exit(2);
      }
      continue;
    }
    if (arg.startsWith('--glossary-scope=')) {
      opts.glossaryScope = arg.slice('--glossary-scope='.length);
      if (!VALID_GLOSSARY_SCOPES.has(opts.glossaryScope)) {
        usage();
        process.exit(2);
      }
      continue;
    }
    if (arg === '--book') {
      opts.book = argv[++i];
      if (!opts.book) {
        usage();
        process.exit(2);
      }
      continue;
    }
    if (arg === '--min-severity') {
      opts.minSeverity = Number(argv[++i]);
      if (!Number.isFinite(opts.minSeverity)) {
        usage();
        process.exit(2);
      }
      continue;
    }
    if (arg === '--min-glossary-risk') {
      opts.minGlossaryRisk = Number(argv[++i]);
      if (!Number.isFinite(opts.minGlossaryRisk)) {
        usage();
        process.exit(2);
      }
      continue;
    }
    if (arg.startsWith('--min-glossary-risk=')) {
      opts.minGlossaryRisk = Number(arg.slice('--min-glossary-risk='.length));
      if (!Number.isFinite(opts.minGlossaryRisk)) {
        usage();
        process.exit(2);
      }
      continue;
    }
    if (arg.startsWith('--min-severity=')) {
      opts.minSeverity = Number(arg.slice('--min-severity='.length));
      if (!Number.isFinite(opts.minSeverity)) {
        usage();
        process.exit(2);
      }
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.book = arg.slice('--book='.length);
      continue;
    }
    if (arg.startsWith('-')) {
      console.error(`Unknown option: ${arg}`);
      usage();
      process.exit(2);
    }
    opts.inputs.push(arg);
  }
  if (opts.book && opts.inputs.length > 0) {
    console.error('Use either --book or explicit paths, not both.');
    process.exit(2);
  }
  return opts;
}

function chapterFiles(inputs) {
  const files = [];
  const isChapterFile = (entry) => /^\d{3}\.json$/u.test(path.basename(entry));
  const enqueue = (entry) => {
    if (!fs.existsSync(entry)) return;
    const st = fs.statSync(entry);
    if (st.isDirectory()) {
      for (const child of fs.readdirSync(entry).sort()) enqueue(path.join(entry, child));
      return;
    }
    if (entry.endsWith('.json') && isChapterFile(entry)) files.push(entry);
  };
  if (inputs.length === 0) enqueue(DATA_DIR);
  else inputs.forEach(enqueue);
  return files.sort();
}

function stableJson(value) {
  if (Array.isArray(value)) return value.map(stableJson);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, nested]) => [key, stableJson(nested)])
    );
  }
  return value;
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function glossaryFingerprint() {
  if (!fs.existsSync(GLOSSARY_PATH)) return null;
  return sha256(fs.readFileSync(GLOSSARY_PATH));
}

function cacheConfig(opts) {
  return {
    scannerVersion: SCANNER_VERSION,
    glossaryFingerprint: glossaryFingerprint(),
    glossaryScope: opts.glossaryScope,
    reviewPriorities: opts.reviewPriorities,
    offsetClusters: opts.offsetClusters,
    sameSentenceGlossary: opts.sameSentenceGlossary,
    chapterGlossaryHealth: opts.chapterGlossaryHealth,
    includeSentenceScores: opts.includeSentenceScores,
    minSeverity: opts.minSeverity,
    minGlossaryRisk: opts.minGlossaryRisk,
  };
}

function chapterFingerprint(file, opts, config = cacheConfig(opts)) {
  const chapterHash = sha256(fs.readFileSync(file));
  return sha256(JSON.stringify(stableJson({
    config,
    chapterHash,
  })));
}

function progress(opts, message) {
  if (!opts.quiet) console.error(message);
}

function sentenceRecords(chapter, file = '') {
  const records = [];
  for (const [blockIndex, block] of (chapter.content || []).entries()) {
    for (const [sentenceIndex, sentence] of (block.sentences || []).entries()) {
      const translation = (sentence.translations || [])[0] || {};
      const englishParts = [];
      const supportEnglishParts = [];
      for (const [key, value] of Object.entries(translation)) {
        if (CHECK_FIELDS.has(key) && typeof value === 'string') englishParts.push(value);
        if (SUPPORT_FIELDS.has(key) && typeof value === 'string') supportEnglishParts.push(value);
      }
      records.push({
        file,
        id: sentence.id || '',
        blockIndex,
        sentenceIndex,
        zh: sentence.zh || '',
        english: englishParts.join(' '),
        supportEnglish: supportEnglishParts.join(' '),
      });
    }
  }
  return records;
}

function hasSource(record, anchor) {
  return anchor.sourceForms.some((form) => record.zh.includes(form));
}

function contextualEnglishAnchorHasSource(record, anchor) {
  if (
    anchor.label === 'Yellow River'
    && String(record.file || '').split(path.sep).join('/').endsWith('data/qingshigao/126.json')
    && /[黃黄]流|[黃黄]水|[黃黄]|河/.test(record.zh)
  ) {
    return true;
  }
  if (anchor.label === '中國' && /中[、日]|中日/.test(record.zh)) return true;
  if (anchor.label === '日本' && /[中、]日|中日/.test(record.zh)) return true;
  if (anchor.label === '朝鮮' && /駐朝|朝王/.test(record.zh)) return true;
  return false;
}

function hasEnglish(record, anchor) {
  anchor.englishRe.lastIndex = 0;
  if (anchor.englishRe.test(record.english)) return true;
  anchor.englishRe.lastIndex = 0;
  return anchor.englishRe.test(stripDiacritics(record.english));
}

function normalizedEnglishMatch(value) {
  return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function matchedEnglishTexts(record, anchor) {
  anchor.englishRe.lastIndex = 0;
  const match = record.english.match(anchor.englishRe);
  if (match) return [normalizedEnglishMatch(match[0])];
  anchor.englishRe.lastIndex = 0;
  const strippedMatch = stripDiacritics(record.english).match(anchor.englishRe);
  return strippedMatch ? [normalizedEnglishMatch(strippedMatch[0])] : [];
}

function nearbyHasSource(records, index, anchor) {
  return [-2, -1, 1, 2].some((offset) => {
    const record = records[index + offset];
    return record && hasSource(record, anchor);
  });
}

function nearbyHasEnglish(records, index, anchor) {
  return [-2, -1, 1, 2].some((offset) => {
    const record = records[index + offset];
    return record && hasEnglish(record, anchor);
  });
}

function nearbySourceOffsets(records, index, anchor) {
  return [-2, -1, 1, 2].filter((offset) => {
    const record = records[index + offset];
    return record && hasSource(record, anchor);
  });
}

function nearbyEnglishOffsets(records, index, anchor) {
  return [-2, -1, 1, 2].filter((offset) => {
    const record = records[index + offset];
    return record && hasEnglish(record, anchor);
  });
}

function nearbyRecords(records, index) {
  return [-2, -1, 0, 1, 2]
    .map((offset) => ({ offset, record: records[index + offset] }))
    .filter((entry) => entry.record);
}

function sourceMatchedAnchorsForRecord(record, index) {
  const matches = [];
  const seen = new Set();
  for (let i = 0; i < record.zh.length; i += 1) {
    const bucket = index.get(record.zh[i]);
    if (!bucket) continue;
    for (const { form, anchor } of bucket) {
      if (!record.zh.startsWith(form, i)) continue;
      if (seen.has(anchor.label)) continue;
      seen.add(anchor.label);
      matches.push(anchor);
    }
  }
  return matches;
}

function sourceMatchedCommonAnchorsForRecord(record) {
  return sourceMatchedAnchorsForRecord(record, COMMON_SOURCE_INDEX);
}

function sourceMatchedCommonAnchors(records, index) {
  const window = nearbyRecords(records, index);
  const matches = [];
  for (const { offset, record } of window) {
    for (const anchor of sourceMatchedCommonAnchorsForRecord(record)) {
      matches.push({ anchor, offset });
    }
  }
  return matches;
}

function anchorWeight(anchor) {
  if (anchor.proper) return 1;
  // Common glossary terms are useful as corroboration, but are too noisy to
  // prove misalignment on their own.
  return 0.35;
}

function uniqueGlossaryAnchors(anchors) {
  return [...new Map(anchors.map((anchor) => [anchor.label, anchor])).values()]
    .filter((anchor, _index, unique) => !unique.some((other) => (
      other !== anchor
      && other.label.length > anchor.label.length
      && other.label.includes(anchor.label)
    )));
}

function glossaryGroupScore(labels, { reviewPriorities = false } = {}) {
  const unique = uniqueGlossaryAnchors(labels);
  const properCount = unique.filter((anchor) => anchor.proper).length;
  const commonCount = unique.filter((anchor) => anchor.common).length;
  const score = unique.reduce((sum, anchor) => sum + anchorWeight(anchor), 0);
  let threshold = properCount >= 2
    ? PROPER_GLOSSARY_MIN_NEARBY_SCORE
    : properCount >= 1
      ? MIXED_GLOSSARY_MIN_NEARBY_SCORE
      : COMMON_ONLY_GLOSSARY_MIN_NEARBY_SCORE;
  if (reviewPriorities) {
    threshold = properCount >= 2
      ? 1.75
      : properCount >= 1
        ? 2
        : 3.5;
  }
  return {
    anchors: unique,
    properCount,
    commonCount,
    score,
    threshold,
    reportable: score >= threshold,
  };
}

function scoreSentenceGlossaryCoverage(record) {
  const sourceAnchors = uniqueGlossaryAnchors(sourceMatchedCommonAnchorsForRecord(record));
  if (sourceAnchors.length === 0) return null;

  const properCount = sourceAnchors.filter((anchor) => anchor.proper).length;
  const commonCount = sourceAnchors.filter((anchor) => anchor.common).length;
  const sourceScore = sourceAnchors.reduce((sum, anchor) => sum + anchorWeight(anchor), 0);
  const matchedAnchors = sourceAnchors.filter((anchor) => hasEnglish(record, anchor));
  const matchedProperCount = matchedAnchors.filter((anchor) => anchor.proper).length;
  const matchedCommonCount = matchedAnchors.filter((anchor) => anchor.common).length;
  const matchedScore = matchedAnchors.reduce((sum, anchor) => sum + anchorWeight(anchor), 0);
  const coverage = sourceScore > 0 ? matchedScore / sourceScore : 1;

  return {
    sourceAnchors,
    matchedAnchors,
    missingAnchors: sourceAnchors.filter((anchor) => !matchedAnchors.includes(anchor)),
    properCount,
    commonCount,
    matchedProperCount,
    matchedCommonCount,
    sourceScore,
    matchedScore,
    coverage,
  };
}

function sameSentenceGlossaryCoverage(record, { reviewPriorities = false } = {}) {
  const score = scoreSentenceGlossaryCoverage(record);
  if (!score) return null;

  const {
    sourceAnchors,
    matchedAnchors,
    missingAnchors,
    properCount,
    commonCount,
    matchedProperCount,
    matchedCommonCount,
    sourceScore,
    matchedScore,
    coverage,
  } = score;
  const minSourceScore = reviewPriorities
    ? SAME_SENTENCE_REVIEW_MIN_SOURCE_SCORE
    : SAME_SENTENCE_MIN_SOURCE_SCORE;
  if (sourceScore < minSourceScore) return null;

  const maxCoverage = reviewPriorities
    ? SAME_SENTENCE_REVIEW_MAX_COVERAGE
    : SAME_SENTENCE_MAX_COVERAGE;

  // Do not let a pile of generic common terms create a priority unless there is
  // enough cumulative evidence to make the fuzzy check meaningful. Review mode
  // is intentionally broader: a single proper noun with weak coverage can be
  // useful triage, but common-only sentences still need several anchors.
  if (properCount === 0 && commonCount < (reviewPriorities ? 5 : 10)) return null;
  if (!reviewPriorities && properCount === 1 && commonCount < 4 && sourceScore < 3) return null;
  if (reviewPriorities && properCount === 1 && commonCount === 0 && coverage > 0) return null;

  if (coverage > maxCoverage) return null;
  if (isCompactTableOrFormulaRecord(record, score)) return null;

  const glossaryRiskScore = sourceScore * (1 - coverage)
    * (properCount > 0 && matchedProperCount === 0 ? 1.35 : 1);

  const highSignal = (
    (coverage === 0 && sourceScore >= 3.5)
    || (coverage <= SAME_SENTENCE_MAX_COVERAGE && (sourceScore >= 5 || properCount >= 3))
    || (properCount >= 2 && matchedProperCount === 0 && coverage <= SAME_SENTENCE_MAX_COVERAGE)
  );
  const severity = highSignal ? 3 : 2;

  return {
    sourceAnchors,
    matchedAnchors,
    missingAnchors,
    properCount,
    commonCount,
    matchedProperCount,
    matchedCommonCount,
    sourceScore,
    matchedScore,
    coverage,
    glossaryRiskScore,
    severity,
  };
}

function fabricatedOrSubstitutedTranslation(record) {
  const score = scoreSentenceGlossaryCoverage(record);
  if (!score) return null;
  if (isCompactTableOrFormulaRecord(record, score)) return null;

  const {
    sourceAnchors,
    matchedAnchors,
    missingAnchors,
    properCount,
    commonCount,
    matchedProperCount,
    matchedCommonCount,
    sourceScore,
    matchedScore,
    coverage,
  } = score;

  // This is stricter than LOW_GLOSSARY_SAME_SENTENCE_COVERAGE. It targets the
  // incident class where the English is fluent but is effectively about a
  // different source sentence: enough distinctive source anchors are present,
  // yet almost none survive in English.
  const hasEnoughDistinctiveSource = (
    (properCount >= 2 && sourceScore >= 8)
    || (properCount >= 1 && commonCount >= 10 && sourceScore >= 8)
    || (properCount === 0 && commonCount >= 24 && sourceScore >= 9)
  );
  if (!hasEnoughDistinctiveSource) return null;
  if (matchedProperCount > 0) return null;
  if (matchedScore > 0.35 || coverage > 0.05) return null;

  const supportEnglish = record.supportEnglish || record.english || '';
  const englishWords = String(record.english || '').match(/[A-Za-z][A-Za-z'’-]*/g) || [];
  if (englishWords.length < 8) return null;
  const sourceLength = String(record.zh || '').replace(/\s+/g, '').length;
  const englishLength = String(supportEnglish || '').replace(/\s+/g, ' ').trim().length;
  if (sourceLength > 0 && englishLength / sourceLength > 4.25) return null;
  if (englishSpecificityScore(supportEnglish) >= 4) return null;
  if (englishFormulaOrListScore(supportEnglish) >= 4) return null;

  const glossaryRiskScore = sourceScore * (1 - coverage)
    * (properCount >= 2 ? 1.6 : 1.25);
  if (glossaryRiskScore < 10) return null;

  return {
    sourceAnchors,
    matchedAnchors,
    missingAnchors,
    properCount,
    commonCount,
    matchedProperCount,
    matchedCommonCount,
    sourceScore,
    matchedScore,
    coverage,
    glossaryRiskScore,
    severity: 3,
  };
}

function englishSpecificityScore(english) {
  const stop = new Set([
    'A', 'An', 'And', 'As', 'At', 'But', 'By', 'For', 'From', 'He', 'His',
    'If', 'In', 'It', 'On', 'Or', 'She', 'The', 'They', 'This', 'To', 'When',
    'While', 'With',
  ]);
  const genericTitles = new Set([
    'Administrator', 'Attendant', 'Cavalier', 'Chancellor', 'Commander',
    'Director', 'Emperor', 'General', 'Governor', 'Inspector', 'King',
    'Marquis', 'Minister', 'Palace', 'Prince', 'Secretary',
  ]);
  const tokens = String(english || '').match(/\b[A-Z][A-Za-z'’-]{2,}\b/g) || [];
  return tokens.filter((token) => !stop.has(token) && !genericTitles.has(token)).length;
}

function englishFormulaOrListScore(english) {
  const text = String(english || '');
  const numeric = (text.match(/\b\d+(?:[.,]\d+)*\b|[°¼½¾]/g) || []).length;
  const separators = (text.match(/[;:]/g) || []).length;
  const commas = (text.match(/,/g) || []).length;
  return numeric + separators + Math.floor(commas / 3);
}

function isCompactTableOrFormulaRecord(record, score) {
  const zh = String(record.zh || '');
  const english = String(record.english || '');
  if (!zh || !english) return false;

  const compactEnglish = english.replace(/\s+/g, '');
  const compactSource = zh.replace(/\s+/g, '');
  const numericSourceChars = (compactSource.match(/[一二三四五六七八九十百千萬万\d年月日度分刻丈尺寸步里斗牛女虛虚危室壁奎婁娄胃昴畢毕觜參参井鬼柳星張张翼軫轸角亢氐房心尾箕甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]/g) || []).length;
  const numericEnglishChars = (compactEnglish.match(/[\d°′'½¼~+\\/—;:.,-]/g) || []).length;
  const hasFormulaEnglish = /(?:\d|°|′|½|¼|\b(?:d|p)\b|\.{3}|…|\+|\/)/i.test(english);
  const hasFormulaSource = numericSourceChars >= 10 && numericSourceChars / Math.max(compactSource.length, 1) >= 0.28;
  const mostlyCommonAnchors = score.properCount <= 1 && score.commonCount >= 6;

  if (hasFormulaSource && hasFormulaEnglish && mostlyCommonAnchors) return true;
  if (/[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]{6,}/.test(zh) && /[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]/.test(english)) return true;
  if (hasFormulaSource && numericEnglishChars >= 8 && compactEnglish.length <= 180 && mostlyCommonAnchors) return true;

  return false;
}

function excerpt(text, width = 110) {
  return text.replace(/\s+/g, ' ').trim().slice(0, width);
}

function chapterGlossaryHealthHit(file, records, { reviewPriorities = false } = {}) {
  const scored = [];
  for (const record of records) {
    if (!record.english || !record.zh) continue;
    const score = scoreSentenceGlossaryCoverage(record);
    if (!score) continue;
    if (isCompactTableOrFormulaRecord(record, score)) continue;

    const minSourceScore = reviewPriorities ? 1.75 : 2.5;
    const hasEnoughAnchorMass = (
      score.sourceScore >= minSourceScore
      || score.properCount >= 2
      || (score.properCount >= 1 && score.commonCount >= 3)
      || score.commonCount >= 8
    );
    if (!hasEnoughAnchorMass) continue;

    scored.push({ record, score });
  }

  const totalSourceScore = scored.reduce((sum, item) => sum + item.score.sourceScore, 0);
  const totalMatchedScore = scored.reduce((sum, item) => sum + item.score.matchedScore, 0);
  const weightedCoverage = totalSourceScore > 0 ? totalMatchedScore / totalSourceScore : 1;
  const lowItems = scored.filter((item) => item.score.coverage <= 0.35);
  const zeroItems = scored.filter((item) => item.score.coverage <= 0.05);
  const lowRate = scored.length > 0 ? lowItems.length / scored.length : 0;
  const zeroRate = scored.length > 0 ? zeroItems.length / scored.length : 0;

  const minScoredSentences = reviewPriorities ? 12 : 20;
  const minTotalSourceScore = reviewPriorities ? 35 : 60;
  if (scored.length < minScoredSentences || totalSourceScore < minTotalSourceScore) return null;

  const sustainedLowScores = lowRate >= 0.4 && weightedCoverage < 0.55;
  const sustainedVanishingScores = zeroRate >= 0.25 && weightedCoverage < 0.65;
  if (!sustainedLowScores && !sustainedVanishingScores) return null;

  const missingAnchors = new Map();
  for (const { score } of lowItems) {
    for (const anchor of score.missingAnchors) {
      const current = missingAnchors.get(anchor.label) || { anchor, count: 0 };
      current.count += 1;
      missingAnchors.set(anchor.label, current);
    }
  }

  const examples = [...lowItems]
    .sort((a, b) => (
      (a.score.coverage - b.score.coverage)
      || (b.score.sourceScore - a.score.sourceScore)
    ))
    .slice(0, 5);

  return {
    file,
    id: 'chapter',
    block: 0,
    sentence: 0,
    rule: 'LOW_GLOSSARY_CHAPTER_HEALTH',
    severity: 3,
    anchor: [...missingAnchors.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 12)
      .map((entry) => `${entry.anchor.label} (${entry.count})`)
      .join(', '),
    glossarySourceScore: Number(totalSourceScore.toFixed(2)),
    glossaryMatchedScore: Number(totalMatchedScore.toFixed(2)),
    glossaryCoverage: Number(weightedCoverage.toFixed(2)),
    lowGlossarySentenceRate: Number(lowRate.toFixed(2)),
    zeroGlossarySentenceRate: Number(zeroRate.toFixed(2)),
    scorableSentences: scored.length,
    lowGlossarySentences: lowItems.length,
    zeroGlossarySentences: zeroItems.length,
    zh: `Chapter-level fuzzy glossary scores are consistently weak across ${scored.length} scorable sentence(s).`,
    english: examples
      .map(({ record, score }) => `${record.id}: coverage ${score.coverage.toFixed(2)}; missing ${score.missingAnchors.slice(0, 4).map((anchor) => anchor.label).join(', ')}`)
      .join(' | '),
    examples: examples.map(({ record, score }) => ({
      id: record.id,
      glossarySourceScore: Number(score.sourceScore.toFixed(2)),
      glossaryMatchedScore: Number(score.matchedScore.toFixed(2)),
      glossaryCoverage: Number(score.coverage.toFixed(2)),
      missingAnchor: score.missingAnchors.slice(0, 8).map((anchor) => anchor.label).join(', '),
      zh: excerpt(record.zh),
      english: excerpt(record.english),
    })),
  };
}

function scanFile(file, {
  reviewPriorities = false,
  sameSentenceGlossary = true,
  chapterGlossaryHealth = true,
  includeSentenceScores = false,
} = {}) {
  const chapter = JSON.parse(fs.readFileSync(file, 'utf8'));
  const records = sentenceRecords(chapter, file);
  const hits = [];
  const sentenceScores = [];

  for (const [index, record] of records.entries()) {
    if (!record.english || !record.zh) continue;
    if (includeSentenceScores) {
      const score = scoreSentenceGlossaryCoverage(record);
      if (score) {
        sentenceScores.push({
          file,
          id: record.id,
          block: record.blockIndex + 1,
          sentence: record.sentenceIndex + 1,
          glossarySourceScore: Number(score.sourceScore.toFixed(2)),
          glossaryMatchedScore: Number(score.matchedScore.toFixed(2)),
          glossaryCoverage: Number(score.coverage.toFixed(2)),
          properAnchors: score.properCount,
          commonAnchors: score.commonCount,
          matchedProperAnchors: score.matchedProperCount,
          matchedCommonAnchors: score.matchedCommonCount,
          sourceAnchor: score.sourceAnchors.slice(0, 12).map((anchor) => anchor.label).join(', '),
          matchedAnchor: score.matchedAnchors.slice(0, 12).map((anchor) => anchor.label).join(', '),
          missingAnchor: score.missingAnchors.slice(0, 12).map((anchor) => anchor.label).join(', '),
          zh: excerpt(record.zh),
          english: excerpt(record.english),
        });
      }
    }
    for (const anchor of HARD_ANCHORS) {
      const source = hasSource(record, anchor);
      const english = hasEnglish(record, anchor);
      if (english && !source && contextualEnglishAnchorHasSource(record, anchor)) continue;
      if (english && !source) {
        const nearbySource = nearbyHasSource(records, index, anchor);
        hits.push({
          file,
          id: record.id,
          block: record.blockIndex + 1,
          sentence: record.sentenceIndex + 1,
          rule: nearbySource ? 'ENGLISH_ANCHOR_NEARBY_SOURCE' : 'ENGLISH_ANCHOR_ABSENT_SOURCE',
          severity: nearbySource ? 3 : 2,
          anchor: anchor.label,
          zh: excerpt(record.zh),
          english: excerpt(record.english),
        });
      } else if (source && !english && (anchor.manual || nearbyHasEnglish(records, index, anchor))) {
        const nearbyEnglish = nearbyHasEnglish(records, index, anchor);
        hits.push({
          file,
          id: record.id,
          block: record.blockIndex + 1,
          sentence: record.sentenceIndex + 1,
          rule: nearbyEnglish ? 'SOURCE_ANCHOR_NEARBY_ENGLISH' : 'SOURCE_ANCHOR_MISSING_ENGLISH',
          severity: nearbyEnglish ? 3 : 1,
          anchor: anchor.label,
          zh: excerpt(record.zh),
          english: excerpt(record.english),
        });
      }
    }

    const englishNearbySource = new Map();
    const sourceNearbyEnglish = new Map();
    const currentMatchedEnglishTexts = new Set(
      sourceMatchedCommonAnchorsForRecord(record).flatMap((anchor) => matchedEnglishTexts(record, anchor)),
    );
    for (const { anchor, offset } of sourceMatchedCommonAnchors(records, index)) {
      const source = hasSource(record, anchor);
      const english = hasEnglish(record, anchor);
      if (english && !source) {
        if (contextualEnglishAnchorHasSource(record, anchor)) continue;
        const sameRenderedEntity = matchedEnglishTexts(record, anchor)
          .some((match) => currentMatchedEnglishTexts.has(match));
        if (sameRenderedEntity) continue;
        const group = englishNearbySource.get(offset) || [];
        group.push(anchor);
        englishNearbySource.set(offset, group);
      }
      if (source && !english) {
        for (const englishOffset of nearbyEnglishOffsets(records, index, anchor)) {
          const group = sourceNearbyEnglish.get(englishOffset) || [];
          group.push(anchor);
          sourceNearbyEnglish.set(englishOffset, group);
        }
      }
    }

    for (const [offset, labels] of englishNearbySource.entries()) {
      const group = glossaryGroupScore(labels, { reviewPriorities });
      if (!group.reportable) continue;
      hits.push({
        file,
        id: record.id,
        block: record.blockIndex + 1,
        sentence: record.sentenceIndex + 1,
        rule: 'COMMON_GLOSSARY_NEARBY_SOURCE',
        severity: 3,
        offset,
        anchor: group.anchors.slice(0, 8).map((anchor) => anchor.label).join(', '),
        glossaryScore: Number(group.score.toFixed(2)),
        glossaryThreshold: Number(group.threshold.toFixed(2)),
        properAnchors: group.properCount,
        commonAnchors: group.commonCount,
        zh: excerpt(record.zh),
        english: excerpt(record.english),
      });
    }

    for (const [offset, labels] of sourceNearbyEnglish.entries()) {
      const group = glossaryGroupScore(labels, { reviewPriorities });
      if (!group.reportable) continue;
      hits.push({
        file,
        id: record.id,
        block: record.blockIndex + 1,
        sentence: record.sentenceIndex + 1,
        rule: 'COMMON_GLOSSARY_NEARBY_ENGLISH',
        severity: 3,
        offset,
        anchor: group.anchors.slice(0, 8).map((anchor) => anchor.label).join(', '),
        glossaryScore: Number(group.score.toFixed(2)),
        glossaryThreshold: Number(group.threshold.toFixed(2)),
        properAnchors: group.properCount,
        commonAnchors: group.commonCount,
        zh: excerpt(record.zh),
        english: excerpt(record.english),
      });
    }

    if (sameSentenceGlossary) {
      const fabricated = fabricatedOrSubstitutedTranslation(record);
      if (fabricated) {
        hits.push({
          file,
          id: record.id,
          block: record.blockIndex + 1,
          sentence: record.sentenceIndex + 1,
          rule: 'FABRICATED_OR_SUBSTITUTED_TRANSLATION',
          severity: fabricated.severity,
          anchor: fabricated.missingAnchors.slice(0, 12).map((anchor) => anchor.label).join(', '),
          glossarySourceScore: Number(fabricated.sourceScore.toFixed(2)),
          glossaryMatchedScore: Number(fabricated.matchedScore.toFixed(2)),
          glossaryCoverage: Number(fabricated.coverage.toFixed(2)),
          glossaryRiskScore: Number(fabricated.glossaryRiskScore.toFixed(2)),
          properAnchors: fabricated.properCount,
          commonAnchors: fabricated.commonCount,
          matchedProperAnchors: fabricated.matchedProperCount,
          matchedCommonAnchors: fabricated.matchedCommonCount,
          matchedAnchor: fabricated.matchedAnchors.slice(0, 8).map((anchor) => anchor.label).join(', '),
          zh: excerpt(record.zh),
          english: excerpt(record.english),
        });
      }

      const coverage = sameSentenceGlossaryCoverage(record, { reviewPriorities });
      if (coverage) {
        hits.push({
          file,
          id: record.id,
          block: record.blockIndex + 1,
          sentence: record.sentenceIndex + 1,
          rule: 'LOW_GLOSSARY_SAME_SENTENCE_COVERAGE',
          severity: coverage.severity,
          anchor: coverage.missingAnchors.slice(0, 10).map((anchor) => anchor.label).join(', '),
          glossarySourceScore: Number(coverage.sourceScore.toFixed(2)),
          glossaryMatchedScore: Number(coverage.matchedScore.toFixed(2)),
          glossaryCoverage: Number(coverage.coverage.toFixed(2)),
          glossaryRiskScore: Number(coverage.glossaryRiskScore.toFixed(2)),
          properAnchors: coverage.properCount,
          commonAnchors: coverage.commonCount,
          matchedProperAnchors: coverage.matchedProperCount,
          matchedCommonAnchors: coverage.matchedCommonCount,
          matchedAnchor: coverage.matchedAnchors.slice(0, 8).map((anchor) => anchor.label).join(', '),
          zh: excerpt(record.zh),
          english: excerpt(record.english),
        });
      }
    }
  }

  if (chapterGlossaryHealth) {
    const healthHit = chapterGlossaryHealthHit(file, records, { reviewPriorities });
    if (healthHit) hits.push(healthHit);
  }

  return { hits, sentenceScores };
}

function bookFromFile(file) {
  const parts = file.split(path.sep);
  const dataIndex = parts.lastIndexOf('data');
  return dataIndex >= 0 ? parts[dataIndex + 1] || '' : '';
}

function printSummary(hits) {
  const byBook = new Map();
  const byChapter = new Map();
  const byRule = new Map();
  for (const hit of hits) {
    const book = bookFromFile(hit.file);
    const bookStats = byBook.get(book) || { chapters: new Set(), hits: 0 };
    bookStats.chapters.add(hit.file);
    bookStats.hits += 1;
    byBook.set(book, bookStats);

    const chapterStats = byChapter.get(hit.file) || { hits: 0, maxSeverity: 0 };
    chapterStats.hits += 1;
    chapterStats.maxSeverity = Math.max(chapterStats.maxSeverity, hit.severity);
    byChapter.set(hit.file, chapterStats);

    const ruleStats = byRule.get(hit.rule) || { hits: 0, severity: hit.severity };
    ruleStats.hits += 1;
    ruleStats.severity = Math.max(ruleStats.severity, hit.severity);
    byRule.set(hit.rule, ruleStats);
  }
  console.log(`Translation alignment candidates: ${hits.length} hit(s) in ${new Set(hits.map((hit) => hit.file)).size} chapter(s)`);
  console.log(`Anchors: ${ANCHOR_STATS.manualAnchors} manual, ${ANCHOR_STATS.glossaryAnchors} glossary (${ANCHOR_STATS.glossaryScope}; ${ANCHOR_STATS.properGlossaryAnchors} proper, ${ANCHOR_STATS.commonGlossaryAnchors} common)`);
  console.log('\nbook\tchapters\thits');
  for (const [book, stats] of [...byBook.entries()].sort()) {
    console.log(`${book}\t${stats.chapters.size}\t${stats.hits}`);
  }
  console.log('\nrule\tseverity\thits');
  for (const [rule, stats] of [...byRule.entries()].sort()) {
    console.log(`${rule}\t${stats.severity}\t${stats.hits}`);
  }
  console.log('\ntop chapters');
  console.log('hits\tseverity\tfile');
  for (const [file, stats] of [...byChapter.entries()].sort((a, b) => b[1].hits - a[1].hits).slice(0, 20)) {
    console.log(`${stats.hits}\t${stats.maxSeverity}\t${file}`);
  }
}

function sentenceNumber(id) {
  const match = String(id || '').match(/^s(\d+)$/);
  return match ? Number(match[1]) : null;
}

function nearbyAnchorClusters(hits, { minUniqueSentences = 4, maxSpan = 4 } = {}) {
  const nearby = hits
    .filter((hit) => /NEARBY/.test(hit.rule))
    .filter((hit) => sentenceNumber(hit.id) !== null);
  const byFile = new Map();
  for (const hit of nearby) {
    const list = byFile.get(hit.file) || [];
    list.push(hit);
    byFile.set(hit.file, list);
  }

  const clusters = [];
  const seen = new Set();
  for (const [file, fileHits] of byFile) {
    fileHits.sort((a, b) => sentenceNumber(a.id) - sentenceNumber(b.id));
    const sentenceStarts = [...new Set(fileHits.map((hit) => sentenceNumber(hit.id)))];
    for (const start of sentenceStarts) {
      const inWindow = fileHits.filter((hit) => {
        const n = sentenceNumber(hit.id);
        return n >= start && n <= start + maxSpan;
      });
      const uniqueIds = [...new Set(inWindow.map((hit) => hit.id))].sort();
      if (uniqueIds.length < minUniqueSentences) continue;
      const key = `${file}:${uniqueIds.join(',')}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const anchors = [...new Set(inWindow.map((hit) => hit.anchor).filter(Boolean))];
      clusters.push({
        file,
        id: `${uniqueIds[0]}-${uniqueIds[uniqueIds.length - 1]}`,
        block: inWindow[0].block,
        sentence: inWindow[0].sentence,
        rule: 'NEARBY_ANCHOR_CLUSTER',
        severity: Math.max(...inWindow.map((hit) => hit.severity || 0), 3),
        anchor: anchors.slice(0, 8).join('; '),
        glossaryScore: Number(Math.max(...inWindow.map((hit) => Number(hit.glossaryScore || 0))).toFixed(2)),
        zh: `Probable offset cluster across ${uniqueIds.length} nearby sentence(s).`,
        english: inWindow
          .slice(0, 4)
          .map((hit) => `${hit.id} ${hit.rule}: ${hit.english}`)
          .join(' | '),
        clusteredHits: inWindow.map((hit) => ({
          id: hit.id,
          rule: hit.rule,
          anchor: hit.anchor,
          zh: hit.zh,
          english: hit.english,
        })),
      });
    }
  }
  return clusters;
}

const opts = parseArgs(process.argv.slice(2));
configureAnchors(opts);
const inputs = opts.book ? [path.join(DATA_DIR, opts.book)] : opts.inputs;
const files = chapterFiles(inputs);
const startedAt = Date.now();
progress(opts, `Translation alignment scan: ${files.length} chapter file${files.length === 1 ? '' : 's'} selected.`);
const normalizedReportFile = (file) => {
  const value = String(file || '');
  const relative = path.isAbsolute(value) ? path.relative(process.cwd(), value) : value;
  return relative.replaceAll(path.sep, '/');
};

let existingReport = null;
if (opts.out && fs.existsSync(opts.out)) {
  try {
    existingReport = JSON.parse(fs.readFileSync(opts.out, 'utf8'));
  } catch (error) {
    console.warn(`Could not read existing ${opts.out}: ${error.message}`);
  }
}

const fileFingerprints = new Map();
let fingerprinted = 0;
let lastFingerprintProgressAt = 0;
const fingerprintConfig = cacheConfig(opts);
for (const file of files) {
  fileFingerprints.set(normalizedReportFile(file), chapterFingerprint(file, opts, fingerprintConfig));
  fingerprinted += 1;
  const now = Date.now();
  if (
    fingerprinted === files.length
    || fingerprinted % 100 === 0
    || now - lastFingerprintProgressAt >= 5000
  ) {
    const elapsedSeconds = ((now - startedAt) / 1000).toFixed(1);
    progress(opts, `Prepared cache fingerprint ${fingerprinted}/${files.length} chapter${files.length === 1 ? '' : 's'} (${normalizedReportFile(file)}; ${elapsedSeconds}s elapsed).`);
    lastFingerprintProgressAt = now;
  }
}

const cacheEnabled = Boolean(opts.cacheCurrent && opts.out && existingReport && !opts.force && !opts.offsetClusters);
const currentCachedFiles = new Set();
if (cacheEnabled) {
  const existingFingerprints = existingReport.chapterFingerprints || {};
  for (const [file, fingerprint] of fileFingerprints.entries()) {
    if (existingFingerprints[file] === fingerprint) currentCachedFiles.add(file);
  }
}

const filesToScan = files.filter((file) => !currentCachedFiles.has(normalizedReportFile(file)));
if (cacheEnabled) {
  progress(opts, `Cache: reusing ${currentCachedFiles.size} current chapter${currentCachedFiles.size === 1 ? '' : 's'}; scanning ${filesToScan.length}.`);
} else if (opts.cacheCurrent) {
  progress(opts, 'Cache: not available for this run; scanning selected chapters.');
}
const cachedHits = cacheEnabled
  ? (existingReport.hits || [])
      .map((hit) => ({ ...hit, file: normalizedReportFile(hit.file) }))
      .filter((hit) => currentCachedFiles.has(hit.file))
  : [];
const cachedSentenceScores = cacheEnabled && opts.includeSentenceScores
  ? (existingReport.sentenceScores || [])
      .map((score) => ({ ...score, file: normalizedReportFile(score.file) }))
      .filter((score) => currentCachedFiles.has(score.file))
  : [];

const scanner = (file) => scanFile(file, {
  reviewPriorities: opts.reviewPriorities,
  sameSentenceGlossary: opts.sameSentenceGlossary,
  chapterGlossaryHealth: opts.chapterGlossaryHealth,
  includeSentenceScores: opts.includeSentenceScores,
});
const scanReports = [];
let lastProgressAt = 0;
for (const [index, file] of filesToScan.entries()) {
  scanReports.push(scanner(file));
  const done = index + 1;
  const now = Date.now();
  if (done === 1 || done === filesToScan.length || done % 25 === 0 || now - lastProgressAt >= 5000) {
    const elapsedSeconds = ((now - startedAt) / 1000).toFixed(1);
    progress(opts, `Scanned ${done}/${filesToScan.length} chapter${filesToScan.length === 1 ? '' : 's'} (${normalizedReportFile(file)}; ${elapsedSeconds}s elapsed).`);
    lastProgressAt = now;
  }
}
let hits = [...cachedHits, ...scanReports.flatMap((report) => report.hits)
  .filter((hit) => hit.severity >= opts.minSeverity)
  .filter((hit) => (
    opts.minGlossaryRisk === null
    || hit.rule !== 'LOW_GLOSSARY_SAME_SENTENCE_COVERAGE'
    || Number(hit.glossaryRiskScore || 0) >= opts.minGlossaryRisk
  ))];
if (opts.offsetClusters) {
  const fabricatedHits = hits.filter((hit) => hit.rule === 'FABRICATED_OR_SUBSTITUTED_TRANSLATION');
  hits = [...nearbyAnchorClusters(hits), ...fabricatedHits];
}
const sentenceScores = opts.includeSentenceScores
  ? [...cachedSentenceScores, ...scanReports.flatMap((report) => report.sentenceScores)]
  : [];

const jsonReport = {
    scanner: 'scan-translation-alignment',
    scannerVersion: SCANNER_VERSION,
    generatedAt: new Date().toISOString(),
    count: hits.length,
    anchorStats: ANCHOR_STATS,
    cache: {
      enabled: cacheEnabled,
      scannedChapters: filesToScan.length,
      cachedChapters: currentCachedFiles.size,
    },
    chapterFingerprints: Object.fromEntries(fileFingerprints.entries()),
    hits,
    ...(opts.includeSentenceScores ? { sentenceScores } : {}),
  };

for (const hit of jsonReport.hits) {
  if (hit?.file) hit.file = normalizedReportFile(hit.file);
}
if (Array.isArray(jsonReport.sentenceScores)) {
  for (const score of jsonReport.sentenceScores) {
    if (score?.file) score.file = normalizedReportFile(score.file);
  }
}

if (opts.out) {
  if (opts.mergeOut && existingReport) {
    try {
      const scannedFiles = new Set(files.map(normalizedReportFile));
      const existingHits = (existingReport.hits || [])
        .map((hit) => ({ ...hit, file: normalizedReportFile(hit.file) }))
        .filter((hit) => !scannedFiles.has(hit.file));
      jsonReport.hits = [...existingHits, ...jsonReport.hits];
      jsonReport.count = jsonReport.hits.length;
      if (opts.includeSentenceScores) {
        const existingScores = (existingReport.sentenceScores || [])
          .map((score) => ({ ...score, file: normalizedReportFile(score.file) }))
          .filter((score) => !scannedFiles.has(score.file));
        jsonReport.sentenceScores = [...existingScores, ...(jsonReport.sentenceScores || [])];
      }
      jsonReport.chapterFingerprints = {
        ...(existingReport.chapterFingerprints || {}),
        ...jsonReport.chapterFingerprints,
      };
    } catch (error) {
      console.warn(`Could not merge existing ${opts.out}: ${error.message}`);
    }
  }
  fs.mkdirSync(path.dirname(opts.out), { recursive: true });
  fs.writeFileSync(opts.out, `${JSON.stringify(jsonReport, null, 2)}\n`);
}

progress(opts, `Translation alignment scan complete: ${jsonReport.count} hit${jsonReport.count === 1 ? '' : 's'}; scanned ${filesToScan.length}, cached ${currentCachedFiles.size}; ${((Date.now() - startedAt) / 1000).toFixed(1)}s.`);

if (opts.json) {
  console.log(JSON.stringify(jsonReport, null, 2));
} else if (opts.summary) {
  printSummary(hits);
} else {
  printSummary(hits);
  for (const hit of hits) {
    console.log(`${hit.file}: ${hit.id || `block ${hit.block} sentence ${hit.sentence}`} ${hit.rule} ${hit.anchor}: ${hit.english}`);
  }
}

if (opts.fail && hits.length > 0) process.exit(1);
