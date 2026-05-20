#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'Gui Xuangang was made Minister of Rites.',
    'Gui Xuangang became Minister of Rites.',
  ],
  s0202: [
    'On day gengyin, a fire broke out at Xiamen in Fujian.',
    'On gengyin day, Xiamen in Fujian caught fire.',
  ],
  s0203: [
    'On day dingyou, the Emperor went to the Blue Indigo Works to welcome the Empress Dowager to residence at the Shenyong Spring Garden.',
    'On dingyou day, the Emperor met the Empress Dowager at Blue Indigo Works and lodged her at Shenyong Spring Garden.',
  ],
  s0204: [
    'On day yisi, Cai Yitai and two hundred forty-two others were granted jinshi with rank and origin in varying grades.',
    'On yisi day, two hundred forty-two new jinshi including Cai Yitai received graded ranks.',
  ],
  s0205: [
    'On day dingwei, Huojizhan rebelled and Vice Commander-in-Chief A Mindao died in the affair.',
    'On dingwei day, Huojizhan rebelled and A Mindao was killed.',
  ],
  s0206: [
    'Sixth month, new moon on day xinyou: Hu Baojun was made Henan governor; Asheha acted as Jiangxi governor.',
    'In the sixth month, Hu Baojun became Henan governor and Asheha acted in Jiangxi.',
  ],
  s0207: [
    'On day renxu, next year\'s registered taxes were remitted for Gansu and four counties including Xiayi in Henan.',
    'On renxu day, next year\'s taxes were forgiven in Gansu and four Henan counties.',
  ],
  s0208: [
    'On day guihai, Ebidai was made Yunnan-Guizhou governor-general; Chen Hongmou was transferred to Jiangsu governor, Mingde to Shaanxi governor, and Ding Chang to Shanxi governor.',
    'On guihai day, Ebidai took Yunnan-Guizhou; Chen Hongmou, Mingde, and Ding Chang were shifted to Jiangsu, Shaanxi, and Shanxi.',
  ],
  s0209: [
    'On day jiazi, flood relief was granted for Yanling and other districts in Henan.',
    'On jiazi day, Henan flood districts received relief.',
  ],
  s0210: [
    'On day wuchen, Peng Jiaping was sentenced to decapitation.',
    'On wuchen day, Peng Jiaping was condemned to be beheaded.',
  ],
  s0211: [
    'On day dingchou, two months\' rations were granted to Dashdawa\'s tribe.',
    'On dingchou day, Dashdawa\'s tribe received two months\' grain.',
  ],
  s0212: [
    'On day guiwei, Khalkha Damalin rebelled; Sangsa Dorji was ordered to suppress him.',
    'On guiwei day, Damalin of Khalkha rebelled and Sangsa Dorji was sent against him.',
  ],
  s0213: [
    'On day jichou, flood relief was granted for sixteen Anhui districts including Suzhou and hail relief for thirty-eight Gansu districts including Nianbo.',
    'On jichou day, flood and hail relief reached Anhui and Gansu in large numbers.',
  ],
  s0214: [
    'Autumn, seventh month, new moon on day xinmao: flood relief was granted for Guantao and other districts in Shandong.',
    'In the seventh month, Shandong flood districts received relief.',
  ],
  s0215: [
    'On day renchen, Liu Zao was made Yunnan governor.',
    'On renchen day, Liu Zao became Yunnan governor.',
  ],
  s0216: [
    'On day guimao, Peng Jiaping was granted suicide.',
    'On guimao day, Peng Jiaping was allowed to take his own life.',
  ],
  s0217: [
    'Shi Yizhi was ordered to continue concurrently administering the Ministry of Works.',
    'Shi Yizhi was kept in concurrent charge of Works.',
  ],
  s0218: [
    'On day yisi, flood and hail relief was granted for ten Anhui districts including Suzhou.',
    'On yisi day, ten Anhui districts received flood and hail relief.',
  ],
  s0219: [
    'On day bingwu, flood relief was granted for five Shandong districts including Dongping.',
    'On bingwu day, five Shandong districts received flood relief.',
  ],
  s0220: [
    'Bayar, taken captive, was granted to Fu De as inner chamberlain; Beile Luobuzangdorji was enfeoffed as prince of the second rank.',
    'Captive Bayar was given to Fu De; Beile Luobuzangdorji was raised to junwang rank.',
  ],
  s0221: [
    'On day dingwei, Yang Yingju was made Fujian-Zhejiang governor-general; Yihenian Guangdong-Guangxi governor-general, Jiang Zhou Shandong governor, and Ta Yongning Shanxi governor.',
    'On dingwei day, Yang Yingju, Yihenian, Jiang Zhou, and Ta Yongning received four governor posts.',
  ],
  s0222: [
    'The Kazakh khan Abulai sent envoys with tribute.',
    'Kazakh Khan Abulai presented tribute through envoys.',
  ],
  s0223: [
    'On day wushen, the Emperor, attending the Empress Dowager, toured Mulan.',
    'On wushen day, the imperial party toured Mulan.',
  ],
  s0224: [
    'On day guichou, Oirat taiji Hunqi and others killed Zanagarbu and came in surrender with his head.',
    'On guichou day, Hunqi\'s party killed Zanagarbu and surrendered with his head.',
  ],
  s0225: [
    'On day wuwu, flood relief was granted for thirty-two Shandong districts including Jining and two Fujian districts including Longyan.',
    'On wuwu day, flood relief reached Shandong and Fujian districts.',
  ],
  s0226: [
    'Eighth month, day bingyin: Kazakh Khojiberken and others surrendered.',
    'In the eighth month, Kazakh leaders including Khojiberken submitted.',
  ],
  s0227: [
    'On day dingmao, Salashan was made Jilin general; Fusen acted for him.',
    'On dingmao day, Salashan became Jilin general with Fusen as acting.',
  ],
  s0228: [
    'On day wuchen, drought relief was granted for three Gansu garrisons including Liugou.',
    'On wuchen day, three Gansu garrisons received drought relief.',
  ],
  s0229: [
    'On day yihai, the Emperor, attending the Empress Dowager, toured Mulan and conducted a hunt.',
    'On yihai day, the court hunted at Mulan.',
  ],
  s0230: [
    'Flood relief was granted for Fenyang in Shanxi.',
    'Shanxi\'s Fenyang received flood relief.',
  ],
  s0231: [
    'On day xinsi, Bayar and Dashiceling were executed.',
    'On xinsi day, Bayar and Dashiceling were put to death.',
  ],
  s0232: [
    'Ninth month, day guisi: the Kereit and Uliut tribes were all pacified.',
    'In the ninth month, Kereit and Uliut tribes were fully pacified.',
  ],
  s0233: [
    'On day jiawu, at the traveling palace the Emperor received envoys of Kazakh Abulai and others in audience and granted a banquet.',
    'On jiawu day, Kazakh envoys were received in audience and feasted.',
  ],
  s0234: [
    'On day wuxu, Fulehun was made Hunan governor.',
    'On wuxu day, Fulehun became Hunan governor.',
  ],
  s0235: [
    'Hunqi and others rebelled again.',
    'Hunqi\'s party rose again.',
  ],
  s0236: [
    'On day gengzi, Oirat zaisang Shalas and Mahusi rebelled; Commander-in-Chief Manfu was ordered to suppress them.',
    'On gengzi day, two Oirat zaisang rebelled and Manfu was dispatched against them.',
  ],
  s0237: [
    'Yaerhashan was made Minister of War.',
    'Yaerhashan became Minister of War.',
  ],
  s0238: [
    'On day xinchou, the Emperor, attending the Empress Dowager, returned to lodge at the Mountain Resort.',
    'On xinchou day, the court returned to the Mountain Resort.',
  ],
  s0239: [
    'On day renyin, Nima and others were dismembered before the tomb of the late General Heqi.',
    'On renyin day, Nima\'s party suffered lingchi at Heqi\'s tomb.',
  ],
  s0240: [
    'On day dingwei, Liu Tongxun was ordered to Shandong and Jiangnan to manage river works.',
    'On dingwei day, Liu Tongxun was sent to oversee rivers in Shandong and Jiangnan.',
  ],
  s0241: [
    'On day xinhai, the Emperor, attending the Empress Dowager, returned to the capital.',
    'On xinhai day, the imperial party returned to Beijing.',
  ],
  s0242: [
    'Winter, tenth month, day renxu: the Emperor visited the Southern Park and conducted a hunt.',
    'In the tenth month, the Emperor hunted in the Southern Park.',
  ],
  s0243: [
    'On day guihai, Ryukyu sent tribute.',
    'On guihai day, Ryukyu presented tribute.',
  ],
  s0244: [
    'On day yichou, Yaerhashan was made acting Pacification Commissioner on the Right for the Border.',
    'On yichou day, Yaerhashan acted as right border deputy general.',
  ],
  s0245: [
    'On day dingmao, Chebudengzhabu was summoned to the capital; Namuzhale acted as Pacification Commissioner on the Left for the Border.',
    'On dingmao day, Chebudengzhabu was called to court and Namuzhale acted as left border deputy general.',
  ],
  s0246: [
    'A Gui went to Kobdo; Mangubai was made Northern Route participating minister.',
    'A Gui proceeded to Kobdo and Mangubai became northern-route coordinator.',
  ],
  s0247: [
    'On day xinwei, Zhaohui was made Pacification General for the Border; Chebudengzhabu was made Pacification Commissioner on the Right.',
    'On xinwei day, Zhaohui became border general and Chebudengzhabu his right deputy.',
  ],
  s0248: [
    'On day bingxu, Yonggui was made Shaanxi governor.',
    'On bingxu day, Yonggui became Shaanxi governor.',
  ],
  s0249: [
    'Eleventh month, day bingshen: Khalkha Prince Dexinjab was made Northern Route participating minister.',
    'In the eleventh month, Prince Dexinjab became northern-route coordinator.',
  ],
  s0250: [
    'On day renzi, Wu Bai was made Censor-in-Chief of the Left.',
    'On renzi day, Wu Bai became left censor-in-chief.',
  ],
  s0251: [
    'On day wuwu, frost and hail relief was granted for twenty-two Gansu districts including Gaolan.',
    'On wuwu day, twenty-two Gansu districts received frost and hail relief.',
  ],
  s0252: [
    'Twelfth month, day guihai: Chen Hongmou was made Guangdong-Guangxi governor-general with Li Shiyao acting; Tuoenduo was made Jiangsu governor and Aletai Shandong governor.',
    'In the twelfth month, Chen Hongmou, Li Shiyao, Tuoenduo, and Aletai received southern posts.',
  ],
  s0253: [
    'On day jisi, Grand Secretary Chen Shiguan requested retirement and was permitted.',
    'On jisi day, Chen Shiguan\'s retirement was granted.',
  ],
  s0254: [
    'On day yihai, Chemuchukezhabu was enfeoffed as prince of the second rank.',
    'On yihai day, Chemuchukezhabu was made a junwang.',
  ],
  s0255: [
    'On day dingchou, disaster relief was granted for the Zhalute, Aru, and Horqin banners.',
    'On dingchou day, three banners received disaster relief.',
  ],
  s0256: [
    'On day gengchen, Shuhede was stripped of office for military failure.',
    'On gengchen day, Shuhede lost his post for mishandling the campaign.',
  ],
  s0257: [
    'On day jiashen, Shi Yizhi and Chen Shiguan were advanced to Grand Preceptor of the Heir Apparent; Emin Da and Liu Tongxun to Grand Guardian of the Heir Apparent.',
    'On jiashen day, four ministers received heir-apparent honors.',
  ],
  s0258: [
    'That year Korea, Siam, and Ryukyu sent tribute.',
    'That year tribute missions came from Korea, Siam, and Ryukyu.',
  ],
  s0259: [
    'Twenty-third year, spring, first month, day jichou: one month\'s relief was granted for disaster victims in Henan prefectures including Weihui.',
    'In the twenty-third year\'s first month, Henan victims received a month of relief.',
  ],
  s0260: [
    'Arrears of registered taxes from Qianlong 16 through 22 were remitted in Gansu.',
    'Gansu tax arrears from years sixteen through twenty-two were forgiven.',
  ],
  s0261: [
    'On day gengyin, Zhaohui and Chebudengzhabu were ordered against Shalabole; Yaerhashan and Emin Hezhuo were ordered to campaign in the Muslim west.',
    'On gengyin day, western campaigns were assigned to Zhaohui\'s and Yaerhashan\'s columns.',
  ],
  s0262: [
    'On day xinmao, disaster victims in eighteen Jiangsu districts including Qinghe and ten Anhui districts including Suzhou received relief in varying amounts.',
    'On xinmao day, Jiangsu and Anhui victims received graded relief.',
  ],
  s0263: [
    'On day guiyou, disaster victims in Zhili districts including Daming received relief.',
    'On guiyou day, Zhili disaster victims were relieved.',
  ],
  s0264: [
    'On day bingwu, because Russia presented Amursana\'s corpse for inspection and the Kazakhs submitted as vassals with tribute, an edict was proclaimed within and without.',
    'On bingwu day, Russia\'s exhibit and Kazakh submission were announced empire-wide.',
  ],
  s0265: [
    'On day jiyou, Personnel Minister Wang Youdun died; the Emperor attended in person to grant mourning offerings.',
    'On jiyou day, Wang Youdun died and the Emperor mourned him in person.',
  ],
  s0266: [
    'On day renzi, Liu Tongxun was made Personnel Minister; Qin Huitian was transferred to Minister of Punishments; Ji Huang was made Minister of Works; Zhong Yin was transferred to Guangdong governor; Zhou Wan was made Fujian governor; Zhou Renji acted as Guizhou governor.',
    'On renzi day, six ministries and governorships were reassigned.',
  ],
  s0267: [
    'On day guichou, Yaerhashan was made Pacification General for Suppressing Rebels; Emin Hezhuo and Haning\'a were made participating ministers; Shunden\'e, Ailong\'a, and Yusubu were made lead commanders—to campaign in the Muslim west.',
    'On guichou day, Yaerhashan was sent west with Emin Hezhuo and three lead commanders.',
  ],
  s0268: [
    'Yonggui and Ding Chang were ordered to handle garrison farming under imperial commissioner seals.',
    'Yonggui and Ding Chang were commissioned for frontier farming.',
  ],
  s0269: [
    'Second month, day gengshen: Korea sent tribute.',
    'In the second month, Korea presented tribute.',
  ],
  s0270: [
    'On day guihai, drought relief was granted for eight Shaanxi districts including Jiazhou.',
    'On guihai day, eight Shaanxi districts received drought relief.',
  ],
  s0271: [
    'On day yichou, disaster victims in thirty-seven districts including Dezhou received relief.',
    'On yichou day, thirty-seven districts including Dezhou were relieved.',
  ],
  s0272: [
    'Third month, day gengyin: the Emperor visited the Western Tombs.',
    'In the third month, the Emperor worshipped at the Western Tombs.',
  ],
  s0273: [
    'On day guisi, the Emperor visited Zhaoxi, Xiao, Xiaodong, and Jing tombs.',
    'On guisi day, the Emperor worshipped at four imperial tombs.',
  ],
  s0274: [
    'On day gengzi, the Emperor visited the Tai Tomb.',
    'On gengzi day, the Emperor worshipped at Taizong\'s tomb.',
  ],
  s0275: [
    'On day xinchou, Zhaohui advanced on Shalabole, captured Zhahakin Halabai, and annihilated his force.',
    'On xinchou day, Zhaohui destroyed Halabai\'s band at Shalabole.',
  ],
  s0276: [
    'Sheling fled; Hesuoqi and Tangkalu were ordered to pursue him.',
    'Sheling escaped and two officers were sent in pursuit.',
  ],
  s0277: [
    'On day renyin, registered taxes were remitted in varying degrees for twenty-five Jiangsu districts including Shanyang.',
    'On renyin day, twenty-five Jiangsu districts had taxes forgiven.',
  ],
  s0278: [
    'On day yisi, the palace examination of Hanlin and Household officials was held; Wang Mingsheng and two others were ranked first class, the rest promoted or demoted in varying degrees.',
    'On yisi day, the palace exam ranked Wang Mingsheng and two others top.',
  ],
  s0279: [
    'Officials transferred from ministries into Hanlin were examined; Deertai was ranked first class, the rest adjusted in varying degrees.',
    'Transferred officials were examined; Deertai ranked first.',
  ],
  s0280: [
    'On day dingwei, Wu Shigong was made Fujian governor; Zhong Yin Shaanxi governor; Tuoenduo Guangdong governor; Zhuang Yougong acted as Jiangsu governor; Feng Ling Hubei governor.',
    'On dingwei day, five governorships were reassigned.',
  ],
  s0281: [
    'Summer, fourth month, day renxu: arrears from Qianlong 3 through 10 were remitted in six Gansu prefectures including Lanzhou.',
    'In the fourth month, Gansu tax arrears through year ten were forgiven.',
  ],
  s0282: [
    'On day wuchen, the imperial son-in-law Sebutengbalzhu\'er was re-enfeoffed as prince of the first rank.',
    'On wuchen day, Sebutengbalzhu\'er\'s princedom was restored.',
  ],
  s0283: [
    'Arrears from Qianlong 10 through 20 were remitted in thirty-three Zhili districts including Bazhou.',
    'Thirty-three Zhili districts had decade-long arrears forgiven.',
  ],
  s0284: [
    'On day gengwu, retired Grand Secretary Chen Shiguan died.',
    'On gengwu day, the retired Grand Secretary Chen Shiguan died.',
  ],
  s0285: [
    'On day renshen, Li Yuanliang was ordered concurrently to act as Minister of Revenue.',
    'On renshen day, Li Yuanliang acted as Revenue minister.',
  ],
  s0286: [
    'Last year\'s flood tax quotas were remitted in twenty-nine Zhili districts including Wei County.',
    'Twenty-nine Zhili districts had flood-year taxes forgiven.',
  ],
  s0287: [
    'On day bingzi, Chen Hongmou was ordered back to Jiangsu to handle governor affairs with governor-general rank.',
    'On bingzi day, Chen Hongmou returned to run Jiangsu with vice-regal rank.',
  ],
  s0288: [
    'Feng Ling was made Hunan governor; Zhuang Yougong acted in Hubei; Li Shiyao acted in Guangdong-Guangxi.',
    'Feng Ling, Zhuang Yougong, and Li Shiyao received three southern posts.',
  ],
  s0289: [
    'On day gengchen, the Emperor went to Black Dragon Pool to pray for rain.',
    'On gengchen day, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0290: [
    'On day renwu, because of drought the Ministry of Punishments was ordered to clear common prisons and reduce punishments below exile; Zhili followed likewise.',
    'On renwu day, drought prompted prison review and sentence reductions.',
  ],
  s0291: [
    'Fifth month, day wuzi: the twenty-fourth year\'s registered taxes were remitted for all Gansu.',
    'In the fifth month, Gansu\'s year-twenty-four taxes were forgiven province-wide.',
  ],
  s0292: [
    'On day guichou, drought relief was granted for three Shaanxi prefectures including Yan\'an.',
    'On guichou day, Yan\'an and other Shaanxi districts received drought relief.',
  ],
  s0293: [
    'Sixth month, day xinwei: tax arrears were remitted in eight Shaanxi districts including Yulin.',
    'In the sixth month, eight Shaanxi districts had arrears forgiven.',
  ],
  s0294: [
    'On day guiwei, last year\'s registered taxes were remitted in eight Shaanxi districts including Jingbian.',
    'On guiwei day, eight Shaanxi border districts had last year\'s taxes forgiven.',
  ],
  s0295: [
    'Locusts struck Yuancheng and other districts in Zhili.',
    'Locust plague hit Yuancheng and other Zhili districts.',
  ],
  s0296: [
    'Autumn, seventh month, day dinghai: wind-disaster taxes from year twenty-two were remitted in three Gansu posts including Anxi.',
    'In the seventh month, three Gansu posts had wind-disaster taxes forgiven.',
  ],
  s0297: [
    'On day jichou, the Maochangpu River burst its banks.',
    'On jichou day, the Maochangpu River breached.',
  ],
  s0298: [
    'On day gengyin, Huojizhan reinforced Kuche; Yaerhashan and others defeated him.',
    'On gengyin day, Huojizhan\'s Kuche relief was beaten back.',
  ],
  s0299: [
    'Drought tax quotas were remitted for Taiwan County in Fujian.',
    'Fujian\'s Taiwan County had drought taxes forgiven.',
  ],
  s0300: [
    'On day bingshen, Huang Tinggui was advanced to Junior Tutor; Yang Yingju and Kaitai to Grand Guardian of the Heir Apparent; Yang Xifu to Junior Preceptor; Chen Hongmou, Gao Jin, and Hu Baojun to Junior Tutor; Bai Zhongshan, Ebidai, and Wu Dashan to Junior Guardian of the Heir Apparent.',
    'On bingshen day, nine officials received heir-apparent honors.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_012_b03.mjs <translation.json>'
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

