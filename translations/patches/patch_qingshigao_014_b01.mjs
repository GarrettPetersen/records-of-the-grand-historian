#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Forty-first year, spring, first month, new moon on day guiyou: Fu De captured blockhouses and forts at Dagazhapuderwo, Ma\'erbang, and elsewhere.',
    'In spring of Qianlong 41, on the first-month new moon, Fu De took Dagazhapuderwo, Ma\'erbang, and other Jinchuan forts.',
  ],
  s0002: [
    'Ming Liang and others captured blockhouses and forts at Dusong and elsewhere.',
    'Ming Liang seized Dusong and other blockhouse forts.',
  ],
  s0003: [
    'On day jiaxu, Prince Ding Mian De was stripped of his title for collusion with a Ministry of Rites clerk; Mian En was ordered to succeed.',
    'On jiaxu, Prince Ding Mian De lost his rank for Rites collusion and Mian En inherited.',
  ],
  s0004: [
    'Agui captured blockhouses and forts at Lawula and elsewhere, and monasteries at Sheqi and elsewhere.',
    'Agui took Lawula forts and Sheqi monasteries.',
  ],
  s0005: [
    'On day jimao, Agui led the armies in advancing to besiege Galayi; Sonom\'s mother and his paternal aunts and sisters came out to surrender.',
    'On jimao, Agui besieged Galayi and Sonom\'s mother and aunts surrendered.',
  ],
  s0006: [
    'He was ordered enfeoffed as a first-class Duke of Sincere Planning and Brave Merit, granted four-claw dragon insignia and a golden yellow belt.',
    'Agui was made a first-class duke with four-claw dragon dress and a golden yellow belt.',
  ],
  s0007: [
    'Feng Sheng\'e, Duke Guoyi Jiyong, was additionally granted the rank of first-class viscount.',
    'Feng Sheng\'e, Duke Guoyi Jiyong, was raised to a first-class viscount.',
  ],
  s0008: [
    'Ming Liang was enfeoffed as a first-class Baron Xiangyong; Hai Lancha as a first-class Marquis Chaoyong; Esente as a first-class baron; Helongwu as a third-class Marquis Guoyong; Fukang\'an and Pu\'erpu as third-class barons.',
    'Ming Liang became Baron Xiangyong; Hai Lancha, Marquis Chaoyong; Esente, baron; Helongwu, Marquis Guoyong; Fukang\'an and Pu\'erpu, barons.',
  ],
  s0009: [
    'Kuilin was additionally granted the rank of first-class baron.',
    'Kuilin was raised to a first-class baron.',
  ],
  s0010: [
    'Feng Sheng\'e, Ming Liang, Hai Lancha, Kuilin, and Helongwu were each again granted double-eyed peacock feathers; Yu Minzhong was granted a first-class Commandant of Light Chariots—all hereditary.',
    'The five commanders kept double peacock feathers; Yu Minzhong received a hereditary chariot commandancy.',
  ],
  s0011: [
    'Agui requested that surrendered people be resettled in the territories of the twelve Chosiakabu tusi; the request was approved.',
    'Agui\'s plan to resettle surrenderers among twelve Chosiakabu tusi was approved.',
  ],
  s0012: [
    'On day renwu, Agui was rewarded with purple reins.',
    'On renwu, Agui received purple reins.',
  ],
  s0013: [
    'On day jiashen, Ming Shan was transferred to be Kobdo expedition minister.',
    'On jiashen, Ming Shan became Kobdo expedition minister.',
  ],
  s0014: [
    'Fa Fuli was made Uliasutai expedition minister.',
    'Fa Fuli took Uliasutai as expedition minister.',
  ],
  s0015: [
    'On day jichou, Minister of Personnel and Associate Grand Secretary Guan Bao, because of illness, requested retirement; permission was granted.',
    'On jichou, Guan Bao, personnel minister and associate grand secretary, retired on illness.',
  ],
  s0016: [
    'Agui was made Minister of Personnel and Associate Grand Secretary.',
    'Agui became personnel minister and associate grand secretary.',
  ],
  s0017: [
    'Feng Sheng\'e was transferred to be Minister of Revenue; Fu Long\'an to Minister of War.',
    'Feng Sheng\'e took revenue; Fu Long\'an, war.',
  ],
  s0018: [
    'Choertu was made Minister of Works.',
    'Choertu became works minister.',
  ],
  s0019: [
    'On day gengyin, Jiamo was transferred to be granary commissioner.',
    'On gengyin, Jiamo became granary commissioner.',
  ],
  s0020: [
    'Asiha was ordered to act as grain-transport governor-general; Yonggui to act as Minister of Personnel; Yinglian to act as Minister of Revenue.',
    'Asiha acted as grain-transport governor-general; Yonggui, personnel; Yinglian, revenue.',
  ],
  s0021: [
    'Second month, day jiyou: Wenshou was appointed Sichuan governor-general; Fulehun was transferred to be Huguang governor-general.',
    'In month 2, jiyou, Wenshou took Sichuan and Fulehun took Huguang.',
  ],
  s0022: [
    'On day gengxu, an order stated that henceforth when the earth-altar sacrifice fell on days of wind or rain, the rite was to be performed inside the hall.',
    'On gengxu, earth-altar rites in bad weather were ordered moved indoors.',
  ],
  s0023: [
    'Quota taxes were remitted for forty years of drought disaster in thirty-nine Jiangsu prefectures and counties including Shangyuan and in five guards including Zhenjiang.',
    'Thirty-nine Jiangsu counties and five guards lost forty years of drought taxes.',
  ],
  s0024: [
    'On day xinhai, the Emperor paid rites at the Eastern Tombs.',
    'On xinhai, Hongli worshipped at the Eastern Tombs.',
  ],
  s0025: [
    'Because he was paying rites at both tombs and making a progress tour of Shandong, one-third of this year\'s quota taxes were remitted for prefectures and counties along the route.',
    'One-third of the year\'s tax was remitted along the Shandong progress route.',
  ],
  s0026: [
    'On day jiayin, the Emperor paid rites at the Western Zhao Tombs, Xiaoling, Xiao East Tombs, and Jing Tomb, and offered wine at Empress Xiaoxian\'s tomb.',
    'On jiayin, Hongli worshipped at the Western Zhao, Xiaoling, Xiao East, and Jing tombs and at Empress Xiaoxian\'s tomb.',
  ],
  s0027: [
    'Agui and others memorialized that Sonom and others had come out to surrender and were caged and sent to the capital; both Jinchuan were pacified.',
    'Agui reported Sonom\'s surrender in a cage cart and the pacification of both Jinchuan.',
  ],
  s0028: [
    'On day yimao, Yonggui was ordered to return as Minister of Rites while still acting in Personnel affairs.',
    'On yimao, Yonggui resumed rites while still acting in personnel.',
  ],
  s0029: [
    'On day bingchen, an order was issued to paint the likenesses of fifty meritorious officials before and after the pacification of the Two Jinchuan in the Hall of Purple Splendor.',
    'On bingchen, fifty Jinchuan victors were ordered painted at the Purple Splendor Pavilion.',
  ],
  s0030: [
    'An order was issued to establish a new general stationed at Ya\'an and to station Sichuan regional commander Guilin at Jinchuan.',
    'A new general was posted to Ya\'an and Guilin to Jinchuan.',
  ],
  s0031: [
    'On day dingsi, the Emperor returned to the capital.',
    'On dingsi, Hongli returned to Beijing.',
  ],
  s0032: [
    'On day wuwu, the Emperor paid rites at Tailing.',
    'On wuwu, Hongli worshipped at Tailing.',
  ],
  s0033: [
    'Yuan Shoudong was ordered to go to Sichuan to join Agui in investigating and handling the case of expedition minister Fu De.',
    'Yuan Shoudong was sent to Sichuan to try Fu De with Agui.',
  ],
  s0034: [
    'On day renxu, the Emperor paid rites at Tailing.',
    'On renxu, Hongli worshipped at Tailing again.',
  ],
  s0035: [
    'The post of Yunnan Tengyue garrison commander was established.',
    'Yunnan gained a Tengyue garrison commander.',
  ],
  s0036: [
    'On day dingmao, the Emperor, escorting the Empress Dowager, made a progress tour of Shandong.',
    'On dingmao, Hongli and the Empress Dowager toured Shandong.',
  ],
  s0037: [
    'On day jisi, unfinished land-tax grain and granary grain were remitted for twenty-eight prefectures and counties including Tongzhou in Shuntian-Zhili.',
    'On jisi, twenty-eight Zhili counties including Tongzhou were forgiven unfinished grain taxes.',
  ],
  s0038: [
    'On day gengwu, the Hubei survey of lake lands was halted.',
    'On gengwu, Hubei lake-land surveying was stopped.',
  ],
  s0039: [
    'Unfinished land-tax grain and granary grain were remitted for twenty-one prefectures and counties including Bazhou in Zhili.',
    'Twenty-one Zhili counties including Bazhou lost unfinished grain taxes.',
  ],
  s0040: [
    'On day xinwei, punishments were reduced for military exiles and below in Zhili.',
    'On xinwei, Zhili reduced sentences for military exiles and below.',
  ],
  s0041: [
    'Third month, day dingchou: quota taxes for this year were remitted for Tai\'an and Qufu in Shandong.',
    'In month 3, dingchou, Tai\'an and Qufu were tax-exempt for the year.',
  ],
  s0042: [
    'On day wuyin, all categories of civilian tax arrears were remitted for thirty-nine Shandong prefectures, counties, and guards including Zouping.',
    'On wuyin, thirty-nine Shandong districts lost civilian tax arrears.',
  ],
  s0043: [
    'On day jimao, the post of Chengdu general was added, with Ming Liang appointed to it.',
    'On jimao, Ming Liang became the new Chengdu general.',
  ],
  s0044: [
    'On day xinsi, punishments were reduced for military exiles and below in Shandong.',
    'On xinsi, Shandong reduced sentences for military exiles and below.',
  ],
  s0045: [
    'On day renwu, deferred grain-transport rice and transport levies were remitted for eleven Shandong prefectures and counties including Dezhou.',
    'On renwu, eleven Shandong districts lost deferred transport grain levies.',
  ],
  s0046: [
    'On day guiwei, Sa Zai was made Jiangnan canal governor-general; Yang Kui was made Jiangsu governor.',
    'On guiwei, Sa Zai took the Jiangnan canal and Yang Kui, Jiangsu.',
  ],
  s0047: [
    'On day jiashen, Le\'erjin had an audience; Bi Yuan was ordered to act as Shaanxi-Gansu governor-general.',
    'On jiashen, Le\'erjin had audience and Bi Yuan acted as Shaanxi-Gansu governor-general.',
  ],
  s0048: [
    'On day bingxu, the Emperor halted at Tai\'an and paid rites at the Dai Temple.',
    'On bingxu, Hongli halted at Tai\'an and worshipped at the Dai Temple.',
  ],
  s0049: [
    'An order was issued to return governors\' tribute gifts, while still issuing strict admonitions.',
    'Governors\' tribute gifts were returned under renewed strict warnings.',
  ],
  s0050: [
    'The post of Jinchuan Lewei garrison commander was established.',
    'Jinchuan gained a Lewei garrison commander.',
  ],
  s0051: [
    'On day dinghai, the Emperor ascended Mount Tai.',
    'On dinghai, Hongli climbed Mount Tai.',
  ],
  s0052: [
    'On day xinmao, Minister of Revenue Wang Jihua died; Yuan Shoudong was transferred to replace him.',
    'On xinmao, Wang Jihua died and Yuan Shoudong took revenue.',
  ],
  s0053: [
    'Quota taxes for the previous year and this year\'s yi levies were remitted for all of Sichuan province, with differing amounts.',
    'All Sichuan lost last year\'s quota tax and this year\'s yi levies, by degree.',
  ],
  s0054: [
    'Quota taxes were remitted for forty years of flood disaster in Henan\'s Wuzhi county.',
    'Wuzhi in Henan lost forty years of flood taxes.',
  ],
  s0055: [
    'On day yiwei, the Emperor reached Qufu and paid rites at the Temple of Confucius.',
    'On yiwei, Hongli reached Qufu and worshipped at Confucius\'s temple.',
  ],
  s0056: [
    'Quota taxes were remitted for forty years of flood and drought disaster in thirty-two Anhui prefectures and counties including Huaining and in seven guards including Jianyang.',
    'Thirty-two Anhui counties and seven guards lost forty years of flood and drought taxes.',
  ],
  s0057: [
    'On day bingshen, the libation sacrifice to the Master was performed and the pacification of the Two Jinchuan was announced.',
    'On bingshen, Hongli sacrificed to Confucius and announced the Two Jinchuan victory.',
  ],
  s0058: [
    'On day dingyou, the Emperor paid rites at the Kong Forest.',
    'On dingyou, Hongli worshipped at the Kong Forest.',
  ],
  s0059: [
    'Li Zhiying was transferred to be Guangdong governor; Min E-yuan was made Anhui governor.',
    'Li Zhiying took Guangdong; Min E-yuan, Anhui.',
  ],
  s0060: [
    'On day wuxu, Fu De was stripped of office and arrested for trial.',
    'On wuxu, Fu De was stripped and arrested.',
  ],
  s0061: [
    'On day jihai, the fugitive Cheli yi Dao Weiping and others repented and returned of their own accord; they were instructed to be spared death and imprisoned.',
    'On jihai, Cheli fugitive Dao Weiping and others surrendered and were imprisoned instead of executed.',
  ],
  s0062: [
    'On day gengzi, Household Vice Minister He Shen was ordered to serve in the Grand Council.',
    'On gengzi, He Shen joined the Grand Council.',
  ],
  s0063: [
    'On day xinchou, the Emperor, escorting the Empress Dowager, boarded a boat at Jining.',
    'On xinchou, Hongli and the Empress Dowager sailed from Jining.',
  ],
  s0064: [
    'Summer, fourth month, day guimao: because the Two Jinchuan had been pacified, officials were dispatched to report to Heaven, the Ancestral Temple, and the Altar of Soil and Grain.',
    'In month 4, guimao, officials reported the Jinchuan victory to Heaven, the Ancestral Temple, and the Altar of Soil and Grain.',
  ],
  s0065: [
    'Yinglian was ordered additionally to act as Minister of Revenue.',
    'Yinglian also acted as revenue minister.',
  ],
  s0066: [
    'Liu Yong was ordered to join Chen Huizu in surveying the breached dikes at Mianyang subprefecture in Hubei.',
    'Liu Yong and Chen Huizu were sent to survey Hubei Mianyang\'s breached dikes.',
  ],
  s0067: [
    'On day jiachen, retired Associate Grand Secretary Guan Bao died.',
    'On jiachen, retired associate grand secretary Guan Bao died.',
  ],
  s0068: [
    'On day dingwei, the Emperor inspected the old city at Linqing subprefecture.',
    'On dingwei, Hongli inspected Linqing\'s old city.',
  ],
  s0069: [
    'On day xinhai, Agui was ordered to continue serving in the Grand Council.',
    'On xinhai, Agui remained on the Grand Council.',
  ],
  s0070: [
    'On day guichou, quota taxes were remitted for forty years of flood disaster in fifty-two Zhili prefectures and counties including Bazhou, with differing amounts.',
    'On guichou, fifty-two Zhili flood counties lost forty years of taxes, by degree.',
  ],
  s0071: [
    'Because the Two Jinchuan had been pacified, officials were dispatched to report at the Western Zhao Tombs, Xiaoling, Xiao East Tombs, Jing Tomb, Tailing, and Empress Xiaoxian\'s tomb.',
    'Officials reported the Jinchuan victory at the Western Zhao, Xiaoling, Xiao East, Jing, Tailing, and Empress Xiaoxian tombs.',
  ],
  s0072: [
    'On day bingchen, officials were dispatched to report at Confucius\'s home in Qufu.',
    'On bingchen, officials reported the victory at Confucius\'s Qufu shrine.',
  ],
  s0073: [
    'On day renxu, officials were dispatched to report at Yong Tomb, Fu Tomb, and Zhao Tomb.',
    'On renxu, officials reported the victory at Yong, Fu, and Zhao tombs.',
  ],
  s0074: [
    'On day jiazi, Asiha was made grain-transport governor-general; Suo\'erne was made Left Censor-in-Chief; Suolin was made Minister of Colonial Affairs while remaining on business at Kulun; Feng Sheng\'e was ordered to act as Minister of Colonial Affairs.',
    'On jiazi, Asiha took grain transport; Suo\'erne, the censorate; Suolin stayed at Kulun as colonial minister; Feng Sheng\'e acted for him.',
  ],
  s0075: [
    'On day yichou, the Emperor escorted the Empress Dowager from Baojia camp back to the capital.',
    'On yichou, Hongli sent the Empress Dowager home from Baojia camp.',
  ],
  s0076: [
    'On day bingyin, Jinchuan captives and heads were presented at the temple and altar.',
    'On bingyin, Jinchuan captives and heads were presented at the temple and altar.',
  ],
  s0077: [
    'On day dingmao, General Who Pacifies the West Agui and others returned in triumph.',
    'On dingmao, Dingxi General Agui returned in triumph.',
  ],
  s0078: [
    'On day wuchen, the Emperor went to the southern outskirts of Liangxiang to perform the suburban rites of congratulation on the campaign, feasted the general and the officers and soldiers who had accompanied the expedition, and bestowed on Agui and others one imperial saddle and horse each.',
    'On wuchen, Hongli feasted Agui\'s army at Liangxiang with suburban victory rites and imperial saddlery.',
  ],
  s0079: [
    'The Emperor returned to the capital.',
    'Hongli returned to Beijing.',
  ],
  s0080: [
    'On day jisi, captives were received.',
    'On jisi, the court received the captives.',
  ],
  s0081: [
    'The Emperor went to the Ocean Terrace and personally interrogated the captive prisoners.',
    'Hongli interrogated the prisoners at the Ocean Terrace.',
  ],
  s0082: [
    'Sonom and others were all executed by dismemberment in the market.',
    'Sonom and his party were dismembered in public.',
  ],
  s0083: [
    'The Emperor went to the Hall of Purple Splendor, performed the rite of drinking to the army\'s arrival, feasted the returning soldiers and princes and grand ministers, and granted silver coins to General Agui and those below, with differing amounts.',
    'At the Purple Splendor Pavilion Hongli held a victory feast and granted silver to Agui and his officers.',
  ],
  s0084: [
    'On day gengwu, the Tibetan chiefs Bulungpuzhaba and Yamapeng Akuru were beheaded in the market.',
    'On gengwu, Tibetan chiefs Bulungpuzhaba and Yamapeng Akuru were executed in public.',
  ],
  s0085: [
    'Fifth month, new moon on day xinwei: the Emperor, escorting the Empress Dowager, went to Cining Palace; the honorific title Chongqing Cixuan Kanghui Dunhe Yushou Chunxi Gongyi Anqi Ningyu Empress Dowager was ceremonially offered; an amnesty edict was issued with differing favors.',
    'On the fifth-month new moon, Hongli and the Empress Dowager at Cining offered a long honorific and a graded amnesty.',
  ],
  s0086: [
    'On day wuyin, Fu De was executed for slandering Agui with treason and rebellion.',
    'On wuyin, Fu De was executed for accusing Agui of treason.',
  ],
  s0087: [
    'On day xinsi, void corvée quota silver for three Shanxi counties including Shilou was remitted.',
    'On xinsi, three Shanxi counties including Shilou lost void corvée quota silver.',
  ],
  s0088: [
    'On day guiwei, the Emperor, escorting the Empress Dowager, set out on the autumn hunt at Mulan.',
    'On guiwei, Hongli and the Empress Dowager left for the Mulan autumn hunt.',
  ],
  s0089: [
    'On day jichou, the Emperor halted at the Mountain Resort for Escaping Summer Heat.',
    'On jichou, Hongli reached the Summer Resort.',
  ],
  s0090: [
    'Sixth month, new moon on day gengzi: the regulations of the Wenyuan Pavilion were fixed.',
    'At the sixth-month new moon, Wenyuan Pavilion regulations were fixed.',
  ],
  s0091: [
    'On day renzi, because of drought disaster in twenty-nine Gansu prefectures, counties, and departments including Gaolan, an order was issued to retain more market grain for the people\'s food.',
    'On renzi, twenty-nine drought-stricken Gansu districts were told to keep more market grain.',
  ],
  s0092: [
    'On day gengshen, Huang Bangning was sentenced to decapitation; the former acting Guangxi governor Surde and the acting provincial judge Guangde were arrested for trial.',
    'On gengshen, Huang Bangning was condemned to death and former Guangxi officials Surde and Guangde were arrested.',
  ],
  s0093: [
    'Autumn, seventh month, day gengshen: Suolin was demoted in rank for dereliction of duty; Wu Mitai was made Minister of Colonial Affairs.',
    'In month 7, gengshen, Suolin was demoted for incompetence and Wu Mitai took colonial affairs.',
  ],
  s0094: [
    'On day dinghai, Bayansan was appointed Shanxi governor; E Bao was transferred to be Hunan governor.',
    'On dinghai, Bayansan took Shanxi and E Bao, Hunan.',
  ],
  s0095: [
    'Eighth month, day dingwei: Huturiangga was summoned; the Ba Lin prince Batu was made western frontier left deputy general; the imperial son-in-law Lawangdorji was made Yili expedition minister.',
    'In month 8, dingwei, Huturiangga was recalled; Prince Batu of Ba Lin became western deputy general and Lawangdorji, Yili minister.',
  ],
  s0096: [
    'On day yimao, the Emperor went to Mulan for the enclosure hunt.',
    'On yimao, Hongli hunted at Mulan.',
  ],
  s0097: [
    'Ninth month, day bingzi: the Emperor returned to halt at the Mountain Resort for Escaping Summer Heat.',
    'In month 9, bingzi, Hongli returned to the Summer Resort.',
  ],
  s0098: [
    'On day gengchen, the Emperor escorted the Empress Dowager on her return journey.',
    'On gengchen, Hongli escorted the Empress Dowager homeward.',
  ],
  s0099: [
    'On day gengyin, the Emperor, escorting the Empress Dowager, returned to the capital.',
    'On gengyin, Hongli and the Empress Dowager returned to Beijing.',
  ],
  s0100: [
    'Winter, tenth month, new moon on day jihai: Feng Sheng\'e was made commander of the Metropolitan Garrison; Fu Long\'an was still ordered to manage it concurrently.',
    'On the tenth-month new moon, Feng Sheng\'e took the Metropolitan Garrison and Fu Long\'an kept concurrent charge.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_014_b01.mjs <translation.json>'
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
