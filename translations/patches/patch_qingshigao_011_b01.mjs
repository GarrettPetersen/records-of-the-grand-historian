#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Eleventh year, spring, first month, day gengwu: because the year\'s annals were opened, punishments were ordered reduced.',
    'On gengwu in spring of Qianlong 11, the new year\'s record-keeping began and sentences were reduced.',
  ],
  s0002: [
    'On day guiwei, Qingfu was ordered to advance and suppress Zhandui and support Li Zhicui.',
    'On guiwei, Qingfu was sent to reinforce Li Zhicui against Zhandui.',
  ],
  s0003: [
    'On day xinmao, famine relief was given for hunger in Tongshan, Jiangsu, Suzhou, Anhui, and other prefectures and counties.',
    'On xinmao, relief went to Tongshan, Suzhou prefecture, and other famine counties.',
  ],
  s0004: [
    'On day jiawu, Korea presented tribute.',
    'On jiawu, Korea sent tribute.',
  ],
  s0005: [
    'Li Zhicui attacked Lingda; Ban Gun\'s mother came to the camp to beg for his life and was again released.',
    'Li Zhicui attacked Lingda; Ban Gun\'s mother begged at camp and was sent home again.',
  ],
  s0006: [
    'The Emperor rebuked him for missing the opportunity.',
    'Hongli rebuked Li for letting the chance slip.',
  ],
  s0007: [
    'Qingfu was instructed to supervise the troops in advancing.',
    'Qingfu was told to advance with the army.',
  ],
  s0008: [
    'Second month, day wuxu: famine relief was given for hunger in Datong and eleven other Shanxi prefectures and counties.',
    'In month 2, wuxu, twelve Shanxi counties received famine relief.',
  ],
  s0009: [
    'On day xinchou, the Northern Route army camp assistant grand ministers Labdon and Ule were recalled to the capital; Talimashan and Nuden replaced them.',
    'On xinchou, Labdon and Ule left the northern staff; Talimashan and Nuden took their posts.',
  ],
  s0010: [
    'On day guimao, the Emperor went to the Southern Park for the hunt enclosure.',
    'On guimao, Hongli hunted at the Southern Park.',
  ],
  s0011: [
    'On day dingwei, quota taxes were remitted for flood in Xinning and other Guangdong prefectures and counties and in Heqing prefecture, Yunnan.',
    'On dingwei, Guangdong and Yunnan flood counties were exempted from quota tax.',
  ],
  s0012: [
    'On day xinhai, because there would be a solar eclipse on the new moon of the third month, an edict ordered sincere self-examination and reform in fact.',
    'On xinhai, with a third-month eclipse coming, Hongli called for genuine introspection.',
  ],
  s0013: [
    'It was fixed that in years when the Empress did not perform the silkworm rite herself, a consort would perform it in her stead.',
    'A rule was set: when the Empress skipped the silkworm ceremony, a consort would substitute.',
  ],
  s0014: [
    'On day bingchen, quota taxes were remitted for flood in Yongcheng and four other Henan counties.',
    'On bingchen, five Henan flood counties were tax-exempt.',
  ],
  s0015: [
    'On day gengshen, the Tibetan taiji Leng Zongnai, for withdrawing troops on his own while attacking Zhandui, was sentenced to decapitation.',
    'On gengshen, Tibetan prince Leng Zongnai was condemned to death for withdrawing from the Zhandui campaign without orders.',
  ],
  s0016: [
    'He was commanded to be spared death.',
    'His sentence was commuted.',
  ],
  s0017: [
    'Third month, day jisi: quota taxes were remitted for flood in Yanshan and seven other Zhili prefectures and counties.',
    'In month 3, jisi, eight Zhili flood districts were exempted from quota tax.',
  ],
  s0018: [
    'On day jiaxu, relief was given for flood at Baiyanjing in Yunnan.',
    'On jiaxu, Baiyanjing flood victims were relieved.',
  ],
  s0019: [
    'On day yihai, the Dzungar taiji Tsewang Dorji Namjal, having newly succeeded, sent the envoy Haliu with tribute and asked that men be sent to Tibet for the tea ceremony.',
    'On yihai, the new Dzungar chief Tsewang Dorji Namjal sent Haliu with gifts and a request for escorts to Tibet for tea rites.',
  ],
  s0020: [
    'On day wuyin, Qingfu reached Dartsedo, impeached Li Zhicui and others for aging the army and playing with the enemy, and requested further dispatch of officers and troops for the expedition—approved.',
    'At Dartsedo, Qingfu impeached Li Zhicui for dilatory campaigning and got reinforcements approved.',
  ],
  s0021: [
    'On day xinsi, inner grand minister Bandi and others were dispatched to the Zhandui army camp.',
    'On xinsi, Bandi and other inner court ministers went to the Zhandui front.',
  ],
  s0022: [
    'On day renwu, Haliu and others were given a banquet.',
    'On renwu, Haliu\'s party was feasted.',
  ],
  s0023: [
    'They were summoned for audience; permission was granted to go to Tibet for the tea ceremony; ruyi scepters were bestowed as gifts.',
    'They were received; the Tibet tea mission was approved; ruyi were granted.',
  ],
  s0024: [
    'On day jiashen, an imperial letter was granted to the Dzungar taiji Tsewang Dorji Namjal.',
    'On jiashen, an imperial missive went to Tsewang Dorji Namjal.',
  ],
  s0025: [
    'Buddhist offerings were made for the late taiji Galdan Tseren.',
    'Offerings were made for the deceased Galdan Tseren.',
  ],
  s0026: [
    'On day bingshen, quota taxes were remitted for last year\'s flood in Qianjiang and other Hubei prefectures and counties.',
    'On bingshen, last year\'s Hubei flood taxes were forgiven.',
  ],
  s0027: [
    'Qingfu memorialized that he had advanced and encamped at Lingque.',
    'Qingfu reported advancing to Lingque.',
  ],
  s0028: [
    'Intercalary third month, new moon on day dingyou: Shaanxi was ordered to repair the tombs of successive dynasties.',
    'On the intercalary third-month new moon, Shaanxi was told to restore dynastic tombs.',
  ],
  s0029: [
    'On day gengzi, Bai Zhongshan was recalled to the capital; Gu Cong was ordered acting Jiangnan canal governor-general; Gao Bin temporarily managed it; Liu Tongxun acted as grain transport governor-general.',
    'On gengzi, Bai Zhongshan was recalled; Gu Cong and Gao Bin took the canal; Liu Tongxun acted at grain transport.',
  ],
  s0030: [
    'Famine relief was given for hunger in Xuanhua prefecture, Zhili.',
    'Xuanhua in Zhili received famine relief.',
  ],
  s0031: [
    'Relief was given for flood, drought, hail, and frost in Longxi and eleven other Gansu prefectures and counties.',
    'Twelve Gansu counties received disaster relief.',
  ],
  s0032: [
    'On day bingwu, Wang Youdun was ordered acting Left Censor-in-Chief.',
    'On bingwu, Wang Youdun became acting Left Censor-in-Chief.',
  ],
  s0033: [
    'On day guichou, Left Censor-in-Chief Hang Yilu retired; Akedun replaced him.',
    'On guichou, Hang Yilu retired; Akedun succeeded.',
  ],
  s0034: [
    'Summer, fourth month, day dingchou: Bai Zhongshan was stripped of office and sent to serve on the Southern Canal.',
    'In month 4, dingchou, Bai Zhongshan lost office and was sent to the southern works.',
  ],
  s0035: [
    'The Grand Council was admonished against leaking secrets.',
    'The Grand Council was warned against leaks.',
  ],
  s0036: [
    'E Chang was made acting Guangxi governor.',
    'E Chang became acting Guangxi governor.',
  ],
  s0037: [
    'On day dinghai, quota taxes were remitted for flood in Xiangyin and four other Hunan counties.',
    'On dinghai, five Hunan flood counties were exempted.',
  ],
  s0038: [
    'On day jichou, quota taxes were remitted for flood in Xinning and three other Guangdong prefectures and counties.',
    'On jichou, four Guangdong flood districts were tax-exempt.',
  ],
  s0039: [
    'Fifth month, new moon on day bingshen: Sheng An was made Left Censor-in-Chief; Akedun Minister of Punishments.',
    'On the fifth-month new moon, Sheng An took the censorate; Akedun, Punishments.',
  ],
  s0040: [
    'On day dingyou, Gu Cong was instructed to investigate wasted Southern Canal funds and have Bai Zhongshan make restitution.',
    'On dingyou, Gu Cong was to trace canal waste and make Bai Zhongshan pay.',
  ],
  s0041: [
    'On day renyin, quota taxes were remitted for last year\'s drought, frost, and other disasters in Datong and seventeen other Shanxi prefectures and counties.',
    'On renyin, eighteen Shanxi counties were exempted from last year\'s disaster taxes.',
  ],
  s0042: [
    'On day bingwu, Qingfu memorialized the advance on Zhandui; the barbarian chief Ban Gun would be captured within days.',
    'On bingwu, Qingfu reported the Zhandui assault; Ban Gun\'s fall was imminent.',
  ],
  s0043: [
    'Qingfu was promoted with the title Grand Guardian of the Heir Apparent.',
    'Qingfu received Grand Guardian of the Heir Apparent.',
  ],
  s0044: [
    'On day wushen, quota taxes were remitted for last year\'s drought in Jingyuan and two other Gansu counties.',
    'On wushen, three Gansu drought counties were exempted.',
  ],
  s0045: [
    'On day jiyou, a permanent remission of three-tenths of Qingyun county\'s annual quota tax in Zhili was ordered.',
    'On jiyou, Qingyun county in Zhili lost three-tenths of its tax permanently.',
  ],
  s0046: [
    'On day yimao, the Dalai Lama and others asked that Ban Gun be spared—not permitted.',
    'On yimao, the Dalai Lama\'s plea for Ban Gun was refused.',
  ],
  s0047: [
    'Because Fu Qing memorialized on their behalf, they were sternly admonished.',
    'Fu Qing\'s memorial drew a sharp rebuke.',
  ],
  s0048: [
    'Sixth month, day bingyin: Qingfu, Bandi, and others jointly attacked the Yarunuri stockade and took it.',
    'In month 6, bingyin, Qingfu and Bandi captured Yarunuri.',
  ],
  s0049: [
    'Ban Gun burned himself to death.',
    'Ban Gun died by self-immolation.',
  ],
  s0050: [
    'On day dingmao, because the tribes within and beyond Dartsedo Pass had followed the expedition in service, tribute and levies were again remitted for two years.',
    'On dingmao, tribes around Dartsedo got two more years without tribute for campaign service.',
  ],
  s0051: [
    'On day bingzi, the capital was shaken by earthquake.',
    'On bingzi, Beijing felt an earthquake.',
  ],
  s0052: [
    'On day renchen, Russian fugitives were ordered returned at Kyakhta.',
    'On renchen, Russian deserters were sent back via Kyakhta.',
  ],
  s0053: [
    'Autumn, seventh month, day bingshen: Nasutu and Celeng received the rank Junior Grand Mentor of the Heir Apparent; Zhou Xuejian Junior Grand Preceptor of the Heir Apparent.',
    'In month 7, Nasutu and Celeng became Junior Grand Mentors; Zhou Xuejian, Junior Grand Preceptor.',
  ],
  s0054: [
    'On day dingyou, Gao Bin was ordered to Jiangsu to inspect Yellow River and Grand Canal works; Liu Yuyi acted as Zhili canal governor-general.',
    'On dingyou, Gao Bin inspected Jiangsu river works; Liu Yuyi acted at Zhili canals.',
  ],
  s0055: [
    'On day renyin, Liu Qi, leader of the Mahayana sect in Sichuan, was dismembered at the market for crafting seditious writings.',
    'On renyin, Sichuan Mahayana leader Liu Qi was executed by lingchi for sedition.',
  ],
  s0056: [
    'On day gengxu, Zhou Xuejian memorialized that over two thousand Catholics had been arrested.',
    'On gengxu, Zhou Xuejian reported arresting more than two thousand Catholics.',
  ],
  s0057: [
    'The Emperor, finding this contrary to the intent to win over the distant, pardoned them.',
    'Hongli found it against pacification policy and released them.',
  ],
  s0058: [
    'On day renxu, flood relief was given for Hanchuan and six other Hubei counties.',
    'On renxu, seven Hubei flood counties were relieved.',
  ],
  s0059: [
    'On day guihai, because Zhang Baotai of Yunnan spread heterodox teachings affecting several provinces, those who had been enticed were told to surrender within a deadline; those who still built churches were to be arrested and punished.',
    'On guihai, with Zhang Baotai\'s cult spreading, converts were told to confess; church-builders would be seized.',
  ],
  s0060: [
    'On day dingmao, Jilin general Baling\'a was recalled to the capital; Alantai replaced him.',
    'On dingmao, Baling\'a left Jilin; Alantai took command.',
  ],
  s0061: [
    'Relief was given for drought at salt fields in Qingyun and six other Zhili counties.',
    'Seven Zhili salt-field districts received drought relief.',
  ],
  s0062: [
    'On day jisi, Sichuan provincial commander Li Zhicui was dismissed for deception in the Zhandui campaign.',
    'On jisi, Li Zhicui was removed for fraud in the Zhandui war.',
  ],
  s0063: [
    'Levies on banner lands in Guangning and other places were remitted for flood.',
    'Guangning banner lands were flood-tax exempt.',
  ],
  s0064: [
    'On day xinwei, flood relief was given for Yiyang and three other Hunan prefectures and counties.',
    'On xinwei, four Hunan flood districts were relieved.',
  ],
  s0065: [
    'On day guiyou, extra silver was granted to flood victims in Jiangsu and Anhui for repairing houses.',
    'On guiyou, Jiangsu and Anhui flood victims got repair subsidies.',
  ],
  s0066: [
    'On day yiyou, flood relief was given for Jinxiang and ten other Shandong prefectures, counties, and guards.',
    'On yiyou, eleven Shandong districts received flood relief.',
  ],
  s0067: [
    'On day gengyin, the Emperor ascended Yingtai and bestowed a banquet on princes of the imperial clan and others.',
    'On gengyin, Hongli feasted the imperial clan at Yingtai.',
  ],
  s0068: [
    'Chongya Hall was renamed Dunxu Hall.',
    'Chongya Hall became Dunxu Hall.',
  ],
  s0069: [
    'On day xinmao, the Emperor ascended Yingtai and bestowed a banquet on grand secretaries, the Nine Ministers, Hanlin, censorate and remonstrance officials, and proclaimed four regulated verses in seven characters.',
    'On xinmao, Hongli feasted the bureaucracy at Yingtai and recited four seven-character poems.',
  ],
  s0070: [
    'On day renchen, Luo Riguang and others of Shanghang county, Fujian, gathered a crowd to demand equalized tenant rents and caused trouble—they were arrested and punished.',
    'On renchen, rent protesters in Fujian\'s Shanghang were arrested.',
  ],
  s0071: [
    'On day guisi, at the Korean king\'s request, the sentry post at Mukden with mulberry-ox outpost troops was discontinued.',
    'On guisi, Korea\'s request ended the Mukden sentry garrison.',
  ],
  s0072: [
    'Ninth month, new moon on day jiawu: levies were removed on silted and collapsed land in Guian and two other Zhejiang counties.',
    'On the ninth-month new moon, three Zhejiang counties lost tax on washed-away land.',
  ],
  s0073: [
    'On day wuxu, governors and governors-general were admonished to administer affairs with sincere hearts.',
    'On wuxu, Hongli told governors to govern honestly.',
  ],
  s0074: [
    'Flood relief was given for Teng county and two other Shandong prefectures and counties, and six salt fields at Banpu in the Two Huai region.',
    'Shandong and Liang-Huai flood districts were relieved.',
  ],
  s0075: [
    'On day jihai, Gao Bin was ordered to Mukden to dredge rivers.',
    'On jihai, Gao Bin went to Mukden to dredge waterways.',
  ],
  s0076: [
    'On day xinchou, this year\'s autumn executions were halted.',
    'On xinchou, autumn executions were suspended.',
  ],
  s0077: [
    'Zhou Xuejian was made Jiangnan canal governor-general.',
    'Zhou Xuejian became Jiangnan canal commissioner.',
  ],
  s0078: [
    'Chen Dashou was transferred to Fujian governor; An Ning acted as Jiangsu governor.',
    'Chen Dashou took Fujian; An Ning acted at Jiangsu.',
  ],
  s0079: [
    'Regulations were fixed for imperial commissioners touring military camps in the provinces.',
    'Rules were set for envoy inspections of provincial troops.',
  ],
  s0080: [
    'Flood relief was given for Zhengzhou and two other Henan prefectures and counties.',
    'Three Henan flood districts were relieved.',
  ],
  s0081: [
    'On day renyin, Neqin was ordered concurrently to manage the Board of Revenue.',
    'On renyin, Neqin also took charge of Revenue.',
  ],
  s0082: [
    'Quota taxes were remitted for flood in Longxi and eight other Gansu prefectures and counties.',
    'Nine Gansu flood counties were tax-exempt.',
  ],
  s0083: [
    'On day guimao, the Emperor, escorting the Empress Dowager, set out for Tailing and also made an inspection tour to Wutai Mountain.',
    'On guimao, Hongli and the Empress Dowager left for Tailing and Wutai.',
  ],
  s0084: [
    'On day dingwei, the Emperor paid rites at Tailing.',
    'On dingwei, Hongli worshipped at Tailing.',
  ],
  s0085: [
    'On day jiyou, Alihun fell ill; Bandi acted as Shanxi governor.',
    'On jiyou, sick Alihun was replaced by acting governor Bandi.',
  ],
  s0086: [
    'On day gengxu, gifts were bestowed on elderly commoners in Zhili prefectures and counties along the route.',
    'On gengxu, elders along the route in Zhili received gifts.',
  ],
  s0087: [
    'On day jiayin, hailstorm relief was given for Feng county and two other Jiangsu prefectures and counties.',
    'On jiayin, three Jiangsu hail districts were relieved.',
  ],
  s0088: [
    'On day yimao, encamped at Wutai Mountain, the Emperor shot a tiger.',
    'On yimao, at Wutai, Hongli shot a tiger.',
  ],
  s0089: [
    'Because Shanxi customs were pure and simple, frontier officials were instructed to combine instruction and nurture so the common people would honor ritual and deference.',
    'Hongli told Shanxi officials to teach and nourish the people\'s regard for ritual.',
  ],
  s0090: [
    'On day bingchen, three-tenths of next year\'s quota tax for Wutai county, Shanxi, was remitted.',
    'On bingchen, Wutai county got a three-tenths tax cut for next year.',
  ],
  s0091: [
    'On day dingsi, Maertai was recalled to the capital; Ka\'erjishan was made Fujian-Zhejiang governor-general.',
    'On dingsi, Maertai was recalled; Ka\'erjishan took Fujian-Zhejiang.',
  ],
  s0092: [
    'Selengge was transferred to Shandong governor; Chen Hongmou to Jiangxi governor; Xu Qi was made Shaanxi governor.',
    'Selengge to Shandong, Chen Hongmou to Jiangxi, Xu Qi to Shaanxi.',
  ],
  s0093: [
    'On day gengshen, the Emperor, escorting the Empress Dowager, returned.',
    'On gengshen, Hongli and the Empress Dowager returned.',
  ],
  s0094: [
    'On day renxu, E\'mida was recalled to the capital; Selengge was made Huguang governor-general.',
    'On renxu, E\'mida was recalled; Selengge became Huguang governor-general.',
  ],
  s0095: [
    'Alihun was transferred to Shandong governor; Aibida to Shanxi governor.',
    'Alihun to Shandong; Aibida to Shanxi.',
  ],
  s0096: [
    'Flood relief was given for Yanling and twenty-five other Henan prefectures and counties.',
    'Twenty-six Henan flood districts were relieved.',
  ],
  s0097: [
    'Winter, tenth month, day jiazi: relief was given for flood, hail, and other disasters in Yangqu and twenty-one other Shanxi prefectures and counties.',
    'In month 10, jiazi, twenty-two Shanxi disaster counties were relieved.',
  ],
  s0098: [
    'On day dingmao, the Emperor inspected the Hutuo River dike.',
    'On dingmao, Hongli inspected the Hutuo dikes.',
  ],
  s0099: [
    'Flood relief was given for Hanchuan and eight other Hubei prefectures, counties, and guards.',
    'Nine Hubei flood districts were relieved.',
  ],
  s0100: [
    'On day gengwu, the Emperor, escorting the Empress Dowager, halted at Baoding prefecture.',
    'On gengwu, Hongli and the Empress Dowager stopped at Baoding.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_011_b01.mjs <translation.json>'
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
