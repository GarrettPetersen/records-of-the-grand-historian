#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'On day dinghai, Minister of War Tongzhi was dismissed; Fengtian General Nasutu replaced him.',
    'On dinghai day, Tongzhi was removed as Minister of War and Nasutu took the post.',
  ],
  s0202: [
    'Bodi was transferred to be Fengtian general.',
    'Bodi became Fengtian general.',
  ],
  s0203: [
    'Jierdang\'a was made Ningguta general.',
    'Jierdang\'a was appointed general at Ningguta.',
  ],
  s0204: [
    'Hail disaster relief was granted for Shenmu and Fugu in Shaanxi.',
    'Shaanxi\'s Shenmu and Fugu received hail relief.',
  ],
  s0205: [
    'On day xinmao, flood relief was granted for six counties including Lanxi in Zhejiang, twenty-four prefectures and counties including Lishui in Jiangnan, and nine prefectures, counties, and garrisons including Qianjiang in Hubei.',
    'On xinmao day, flood relief reached Zhejiang, Jiangnan, and Hubei districts in varying numbers.',
  ],
  s0206: [
    'Ninth month, day bingshen: Zhang Zhao, Ha Yuansheng, Dong Fang, Yuan Zhancheng, and Dexishou were pardoned for errors in the Miao frontier.',
    'In the ninth month, five officials were forgiven for Miao frontier mistakes.',
  ],
  s0207: [
    'On day dingyou, Minister of Rites Yang Mingshi died.',
    'On dingyou day, Yang Mingshi, Minister of Rites, died.',
  ],
  s0208: [
    'On day wuxu, Qingfu was made Minister of Justice and also administered the Ministry of Personnel.',
    'On wuxu day, Qingfu became Minister of Justice and acting head of Personnel.',
  ],
  s0209: [
    'Fu Nai was ordered to serve temporarily as Minister of War.',
    'Fu Nai was appointed acting Minister of War.',
  ],
  s0210: [
    'On day gengzi, autumn executions for the year were suspended.',
    'On gengzi day, the autumn judicial executions were halted.',
  ],
  s0211: [
    'On day guimao, flood relief was granted for four counties including Anji in Zhejiang.',
    'On guimao day, Zhejiang flood districts received relief.',
  ],
  s0212: [
    'On day bingwu, the Emperor visited Grand Secretary Zhu Shi at his residence to inquire after his illness.',
    'On bingwu day, the Emperor called on the ailing Grand Secretary Zhu Shi.',
  ],
  s0213: [
    'Registered tax quotas were remitted for Anfu in Jiangxi after flood.',
    'Jiangxi\'s Anfu had flood taxes forgiven.',
  ],
  s0214: [
    'On day gengxu, Grand Secretary Zhu Shi died; the Emperor personally attended and bestowed funeral offerings.',
    'On gengxu day, Zhu Shi died and the Emperor attended in person to offer mourning gifts.',
  ],
  s0215: [
    'On day renzi, flood relief was granted for twenty prefectures, counties, and garrisons including Suzhou in Anhui.',
    'On renzi day, twenty Anhui districts received flood relief.',
  ],
  s0216: [
    'Retired Grand Secretary Chen Yuanlong died.',
    'The retired Grand Secretary Chen Yuanlong died.',
  ],
  s0217: [
    'On day yimao, flood relief was granted for three prefectures and counties including Xiaoxian in Jiangsu.',
    'On yimao day, three Jiangsu districts received flood relief.',
  ],
  s0218: [
    'On day jiwei, one hundred seventy-six candidates in the Erudite Hongci examination were tested in the Hall of Preserving Harmony; Liu Lun and others were granted offices.',
    'On jiwei day, 176 erudite-scholar candidates were examined at Baohe Hall and offices were awarded.',
  ],
  s0219: [
    'Flood relief was granted for thirteen prefectures and garrisons including Wuxi in Jiangsu.',
    'Thirteen Jiangsu prefectures and garrisons received flood relief.',
  ],
  s0220: [
    'Zungar taiji Chelun and others came to submit.',
    'Zungar nobles including Chelun surrendered.',
  ],
  s0221: [
    'Winter, tenth month, day renxu: Shao Ji was made Jiangsu governor.',
    'In the tenth month, Shao Ji became Jiangsu governor.',
  ],
  s0222: [
    'On day yichou, registered tax quotas were remitted for flood districts including Renhe in Zhejiang.',
    'On yichou day, Zhejiang flood counties had taxes forgiven.',
  ],
  s0223: [
    'On day gengwu, Yue Jun was transferred to be Jiangxi governor; Fa Min was made Shandong governor.',
    'On gengwu day, Yue Jun went to Jiangxi and Fa Min to Shandong as governors.',
  ],
  s0224: [
    'On day xinwei, the Emperor, escorting the Empress Dowager, conveyed Shizong\'s coffin to Tailing.',
    'On xinwei day, the Emperor and Empress Dowager escorted Yongzheng\'s coffin to Tailing.',
  ],
  s0225: [
    'On day gengchen, the Emperor, escorting the Empress Dowager, returned to the capital.',
    'On gengchen day, the imperial party returned to Beijing.',
  ],
  s0226: [
    'Eleventh month, day jiawu: the Emperor began to hold court and hear affairs at the Gate of Heavenly Purity.',
    'In the eleventh month, the Emperor resumed governance at Qianqing Gate.',
  ],
  s0227: [
    'Ji Zengyun was promoted to Grand Tutor of the Heir Apparent.',
    'Ji Zengyun received the title Grand Tutor of the Heir Apparent.',
  ],
  s0228: [
    'Xu Ben was appointed Grand Secretary of the Eastern Pavilion, still concurrently administering the Ministry of Justice.',
    'Xu Ben became an Eastern Pavilion Grand Secretary while keeping charge of Justice.',
  ],
  s0229: [
    'Sun Jiahan was made Minister of Justice; Yang Rugu was made Left Censor-in-chief.',
    'Sun Jiahan became Minister of Justice and Yang Rugu Left Censor-in-chief.',
  ],
  s0230: [
    'E\'ertu was made Heilongjiang general.',
    'E\'ertu was appointed general at Heilongjiang.',
  ],
  s0231: [
    'On day bingshen, registered tax quotas were remitted for four prefectures and counties including Chuxiong in Yunnan.',
    'On bingshen day, Yunnan tax quotas were forgiven in four districts.',
  ],
  s0232: [
    'On day dingyou, flood relief was granted for three counties and garrisons including Huoqiu in Anhui and thirteen counties in Hubei including Hankou.',
    'On dingyou day, flood relief reached Anhui and Hubei districts.',
  ],
  s0233: [
    'On day jiyou, the winter solstice, Heaven was sacrificed at the Round Mound; the Emperor went in person to perform the rites.',
    'On jiyou day, the winter solstice sacrifice at the Round Mound was performed by the Emperor in person.',
  ],
  s0234: [
    'Henceforth this was done every year.',
    'The practice continued annually thereafter.',
  ],
  s0235: [
    'On day jiwei, hail relief was granted for Dingbian in Shaanxi and flood relief for twelve prefectures, counties, and garrisons including Changzhou in Jiangnan.',
    'On jiwei day, hail and flood relief reached Shaanxi and Jiangnan.',
  ],
  s0236: [
    'Twelfth month, day xinyou: drought relief was granted for four banners including the Prince of Balin.',
    'In the twelfth month, four banners including Balin received drought relief.',
  ],
  s0237: [
    'On day jiazi, flood relief was granted for thirteen prefectures and counties including Lou and Lishui in Jiangsu.',
    'On jiazi day, thirteen Jiangsu districts received flood relief.',
  ],
  s0238: [
    'On day yichou, Jiangnan\'s Shouchun brigade was upgraded to a garrison and a commander-in-chief was appointed.',
    'On yichou day, Shouchun brigade became a garrison with its own commander.',
  ],
  s0239: [
    'On day jisi, this year\'s hail-disaster tax quotas were remitted for Fugu and Shenmu in Shaanxi.',
    'On jisi day, Shaanxi hail taxes for Fugu and Shenmu were forgiven.',
  ],
  s0240: [
    'The deputy director-general of the Southern Rivers was moved to station at Xuzhou.',
    'The Southern Rivers deputy was relocated to Xuzhou.',
  ],
  s0241: [
    'On day dingchou, flood tax quotas were remitted for Sizhou garrison fields in Anhui and saltworks at Changlu and Guangyun.',
    'On dingchou day, flood taxes were forgiven for Anhui garrison land and saltworks.',
  ],
  s0242: [
    'On day dinghai, Dai Linbu was transferred to be Jiangning general.',
    'On dinghai day, Dai Linbu became Jiangning general.',
  ],
  s0243: [
    'Wang Chang was made General Who Establishes Might; Ya\'ertu was made assisting commissioner.',
    'Wang Chang received the rank General Who Establishes Might; Ya\'ertu became assisting commissioner.',
  ],
  s0244: [
    'Flood tax quotas were remitted for three salt fields including Guandu in the Two Huai region.',
    'Two Huai salt fields had flood taxes forgiven.',
  ],
  s0245: [
    'This year Korea, Lan Xang, Siam, and Annam sent tribute.',
    'Korea, Lan Xang, Siam, and Annam presented tribute this year.',
  ],
  s0246: [
    'Second year, spring, first month, new moon on day gengyin: court congratulations were waived.',
    'In the second year\'s first month, the new-year audience was omitted.',
  ],
  s0247: [
    'On day gengzi, Zhao Hongen was summoned to the capital.',
    'On gengzi day, Zhao Hongen was called to Beijing.',
  ],
  s0248: [
    'Qingfu was made governor-general of the Two Jiangs.',
    'Qingfu became governor-general of the Two Jiangs.',
  ],
  s0249: [
    'Nasutu was transferred to be Minister of Justice.',
    'Nasutu became Minister of Justice.',
  ],
  s0250: [
    'Neqin was made Minister of War.',
    'Neqin became Minister of War.',
  ],
  s0251: [
    'On day yisi, Yang Chaozeng was made Guangxi governor.',
    'On yisi day, Yang Chaozeng became Guangxi governor.',
  ],
  s0252: [
    'On day bingwu, Wang Shijun was released.',
    'On bingwu day, Wang Shijun was pardoned.',
  ],
  s0253: [
    'On day wuzi, Li Wei impeached guards of Prince Cheng\'s establishment for taking bribes and pulling strings.',
    'On wuzi day, Li Wei charged Prince Cheng\'s guards with corruption and favoritism.',
  ],
  s0254: [
    'The Emperor commended him and rewarded a robe with four round dragons.',
    'The Emperor praised Li Wei and granted him a four-dragon court robe.',
  ],
  s0255: [
    'Second month, day bingyin: the king of Annam, Le Duy Hu, died; his heir Le Duy Y sent envoys to announce mourning and also presented tribute goods.',
    'In the second month, Annam\'s king died and his heir sent mourning envoys with tribute.',
  ],
  s0256: [
    'On day guiyou, flood relief was granted for Gaoyou in Jiangsu.',
    'On guiyou day, Gaoyou received flood relief.',
  ],
  s0257: [
    'On day wuyin, Hanlin Academy reader Song Shou and compiler Chen Tan were dispatched to invest Le Duy Y as king of Annam.',
    'On wuyin day, Song Shou and Chen Tan were sent to enfeoff Le Duy Y as king of Annam.',
  ],
  s0258: [
    'On day gengchen, the coffin of Empress Xiaojingxian was moved; the Emperor, escorting the Empress Dowager, escorted it to Tailing.',
    'On gengchen day, the late empress\'s coffin set out and the Emperor escorted it to Tailing with the Empress Dowager.',
  ],
  s0259: [
    'Third month, day gengyin: Shizong was buried at Tailing and Empress Xiaojingxian was enshrined beside him.',
    'In the third month, Yongzheng was buried at Tailing with his empress enshrined together.',
  ],
  s0260: [
    'On day renchen, the Emperor returned to the capital.',
    'On renchen day, the Emperor returned to Beijing.',
  ],
  s0261: [
    'On day guisi, Emperor Shizong and Empress Xiaojingxian were enshrined in the Imperial Ancestral Temple; an edict of general grace was issued with distinctions.',
    'On guisi day, Yongzheng and his empress entered the ancestral temple and a graded amnesty was proclaimed.',
  ],
  s0262: [
    'On day xinchou, Baode and others were ordered to proclaim the enshrinement edict in Korea.',
    'On xinchou day, Baode\'s mission carried the enshrinement edict to Korea.',
  ],
  s0263: [
    'On day jiachen, Tu Tianxiang was dismissed.',
    'On jiachen day, Tu Tianxiang left office.',
  ],
  s0264: [
    'Zhao Hongen was made Minister of Works.',
    'Zhao Hongen became Minister of Works.',
  ],
  s0265: [
    'Gu Cong was appointed to assist in the Ministry of Personnel.',
    'Gu Cong was assigned to assist the Ministry of Personnel.',
  ],
  s0266: [
    'On day wushen, Hanlin and censorate officials were ordered to present memorials on the classics and histories in rotation.',
    'On wushen day, Hanlin and censorate scholars were told to submit rotating essays on the classics.',
  ],
  s0267: [
    'On day gengxu, the Right Guard general was moved to station at the new city of Guihua and two deputy commanders were added.',
    'On gengxu day, the Right Guard headquarters shifted to Guihua New City with two new deputies.',
  ],
  s0268: [
    'On day xinhai, Shuo Se was transferred to be Sichuan governor.',
    'On xinhai day, Shuo Se became Sichuan governor.',
  ],
  s0269: [
    'On day renzi, Yang Yongbin was transferred to be Hubei governor.',
    'On renzi day, Yang Yongbin became Hubei governor.',
  ],
  s0270: [
    'Fourth month, day jiazi: because of drought, the Ministry of Justice was ordered to review ordinary prisons.',
    'In the fourth month, drought prompted a Ministry of Justice review of common cases.',
  ],
  s0271: [
    'On day yimao, memorializing officials were admonished and instructed.',
    'On yimao day, officials who offered advice received imperial correction.',
  ],
  s0272: [
    'On day jisi, the Qingkou outlet and the Jiangnan Grand Canal were dredged.',
    'On jisi day, dredging began at Qingkou and on the Jiangnan canal.',
  ],
  s0273: [
    'Drought relief was granted for Nanjing and Changzhou prefectures in Jiangsu.',
    'Jiangsu\'s Nanjing and Changzhou received drought relief.',
  ],
  s0274: [
    'On day jiaxu, Heaven was sacrificed at the Round Mound with Shizong as collateral spirit; the next day an edict of general grace was issued with distinctions.',
    'On jiaxu day, the Round Mound sacrifice paired Yongzheng; a graded amnesty followed next day.',
  ],
  s0275: [
    'That day it rained.',
    'Rain fell that day.',
  ],
  s0276: [
    'Furdan, Chen Tai, and Yue Zhongqi were released.',
    'Furdan, Chen Tai, and Yue Zhongqi were pardoned.',
  ],
  s0277: [
    'On day bingzi, registered tax quotas in Shuntian and Zhili were remitted.',
    'On bingzi day, Zhili land taxes were forgiven.',
  ],
  s0278: [
    'On day jimao, Yin Jishan was summoned to the capital.',
    'On jimao day, Yin Jishan was called to Beijing.',
  ],
  s0279: [
    'Zhang Yunsui was made acting Yunnan governor-general.',
    'Zhang Yunsui became acting governor-general of Yunnan.',
  ],
  s0280: [
    'On day jiashen, flood tax quotas were remitted for five prefectures, counties, and garrisons including Hankou in Hubei.',
    'On jiashen day, five Hubei districts had flood taxes forgiven.',
  ],
  s0281: [
    'Lan Xang sent tribute.',
    'Lan Xang presented tribute.',
  ],
  s0282: [
    'On day dinghai, flood tax quotas were remitted for Xiao and Dang counties in Jiangsu.',
    'On dinghai day, two Jiangsu counties had flood taxes forgiven.',
  ],
  s0283: [
    'Fifth month, day renchen: Yu Minzhong and three hundred twenty-four others were granted jinshi degrees and metropolitan graduate status in varying ranks.',
    'In the fifth month, 324 candidates including Yu Minzhong received jinshi honors.',
  ],
  s0284: [
    'On day guisi, flood tax quotas were remitted for Jingzhou and Anlu prefectures in Hubei.',
    'On guisi day, two Hubei prefectures had flood taxes forgiven.',
  ],
  s0285: [
    'On day yiwei, flood relief was granted for twelve prefectures and counties including Nanyang in Henan.',
    'On yiwei day, twelve Henan districts received flood relief.',
  ],
  s0286: [
    'On day wuxu, Hanlin, Household, and other officials were examined by the Emperor; Chen Dashou and two others were raised to first rank, the rest promoted or demoted with distinctions.',
    'On wuxu day, the palace examination ranked Chen Dashou and two others first among the Hanlin corps.',
  ],
  s0287: [
    'This year\'s new jinshi were permitted to memorialize on local advantages and disadvantages.',
    'New degree-holders could submit memorials on provincial policy.',
  ],
  s0288: [
    'On day wushen, one million taels of Shandong\'s principal grain tax were remitted.',
    'On wushen day, Shandong\'s grain tax was cut by one million taels.',
  ],
  s0289: [
    'On day xinhai, Earth was sacrificed at the Square Mound with Shizong as collateral spirit.',
    'On xinhai day, the Square Mound rite paired Yongzheng as collateral spirit.',
  ],
  s0290: [
    'Rice tax was abolished for Kaijian and Enping counties in Guangdong.',
    'Guangdong abolished rice tax in two counties.',
  ],
  s0291: [
    'On day yimao, extra levies were abolished in Yongzhou and other places in Hunan.',
    'On yimao day, Hunan\'s surplus levies were removed.',
  ],
  s0292: [
    'Flood tax quotas were remitted for Suzhou in Anhui.',
    'Anhui\'s Suzhou had flood taxes forgiven.',
  ],
  s0293: [
    'Flood tax quotas were remitted for four prefectures and counties including Renhe in Zhejiang.',
    'Four Zhejiang districts had flood taxes forgiven.',
  ],
  s0294: [
    'Hail relief was granted for Shangnan, Fushi, and other counties in Shaanxi.',
    'Shaanxi hail districts including Shangnan received relief.',
  ],
  s0295: [
    'On day jiaxu, because the Emperor held court at the gate and timely rain fell abundantly, gauze lengths were bestowed on attending officials in varying amounts.',
    'On jiaxu day, good rain at court prompted gifts of gauze to officials.',
  ],
  s0296: [
    'On day xinyou, Zhili was ordered to trial the district-field farming method.',
    'On xinyou day, Zhili was told to test Zhao Xu\'s district-field system.',
  ],
  s0297: [
    'On day wuxu, flood relief was granted for six prefectures and counties including Shizhi in Anhui.',
    'On wuxu day, six Anhui districts received flood relief.',
  ],
  s0298: [
    'Autumn, seventh month, day wuzi: because the Yongding River breached, guards Celeng and others were sent separately to Lugou Bridge and Liangxiang to comfort disaster victims.',
    'In the seventh month, Yongding River floods sent Celeng and others to aid victims at Lugou and Liangxiang.',
  ],
  s0299: [
    'On day guimao, guards Song Fu and others were sent to Wen\'an, Bazhou, and other places to comfort disaster victims.',
    'On guimao day, Song Fu\'s party relieved flood victims in Hebei towns.',
  ],
  s0300: [
    'On day yiwei, Gu Cong was ordered to inspect each breach work on the Yongding River.',
    'On yiwei day, Gu Cong was assigned to survey Yongding River break sites.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_010_b03.mjs <translation.json>'
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
