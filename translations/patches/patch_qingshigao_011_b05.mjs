#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'Winter, tenth month, new moon on day renwu: five thousand Manchu troops were transferred to the Jinchuan army camp.',
    'On the tenth-month new moon of renwu, five thousand Manchu troops were sent to the Jinchuan front.',
  ],
  s0402: [
    'Princes and grand ministers asked that Neqin be punished.',
    'Princes and ministers requested punishment for Neqin.',
  ],
  s0403: [
    'An edict rebuked Neqin for betraying state and grace; further orders would await his memorial on return.',
    'Neqin was rebuked for disloyalty; further punishment would follow his return memorial.',
  ],
  s0404: [
    'On day yiyou, Yin Jishan was summoned to the capital; Shuose was made Liangguang governor-general, and E Rong\'an acted as Henan governor.',
    'On yiyou day, Yin Jishan was recalled; Shuose became Liangguang governor-general and E Rong\'an acted at Henan.',
  ],
  s0405: [
    'Relief was granted for flood disaster in Xinning county, Hunan.',
    'Hunan\'s Xinning received flood relief.',
  ],
  s0406: [
    'On day bingxu, Bandi was demoted for failing to impeach Neqin.',
    'On bingxu day, Bandi was demoted for not impeaching Neqin.',
  ],
  s0407: [
    'Suhede was made Minister of War.',
    'Suhede became Minister of War.',
  ],
  s0408: [
    'On day dinghai, Fu Heng was appointed Grand Secretary of the Hall of Preserving Harmony and ordered concurrently to manage the Ministry of Revenue.',
    'On dinghai day, Fu Heng became Grand Secretary of the Hall of Preserving Harmony and took charge of Revenue.',
  ],
  s0409: [
    'On day wuzi, Empress Xiaoxian\'s coffin was moved to Jing\'anzhuang; the Emperor went there to offer libation.',
    'On wuzi day, Empress Xiaoxian\'s coffin went to Jing\'anzhuang and the Emperor poured libation there.',
  ],
  s0410: [
    'On day yichou, flood relief was granted for thirty prefectures, counties, and garrisons in Shandong including Zouping.',
    'On yichou day, thirty Shandong districts including Zouping received flood relief.',
  ],
  s0411: [
    'Yin Jishan was made Minister of Revenue.',
    'Yin Jishan became Minister of Revenue.',
  ],
  s0412: [
    'On day xinmao, the Emperor visited Fengze Garden and granted a feast to Commissioner-General Fu Heng and the officers and troops on campaign.',
    'On xinmao day, the Emperor feasted Fu Heng and the campaign forces at Fengze Garden.',
  ],
  s0413: [
    'Yue Zhongqi memorialized victory in capturing Genza.',
    'Yue Zhongqi reported the capture of Genza.',
  ],
  s0414: [
    'On day renchen, Kaitai was transferred to Hunan governor; Tang Suizu was made Jiangxi governor.',
    'On renchen day, Kaitai became Hunan governor and Tang Suizu Jiangxi governor.',
  ],
  s0415: [
    'On day jiawu, drought relief was granted for fifteen Shanxi prefectures and counties including Yangqu.',
    'On jiawu day, fifteen Shanxi districts including Yangqu received drought relief.',
  ],
  s0416: [
    'On day wuxu, the Emperor visited Baodi Temple and reviewed Eight Banner cloud-ladder drill.',
    'On wuxu day, the Emperor reviewed cloud-ladder troops at Baodi Temple.',
  ],
  s0417: [
    'On day dingwei, disaster relief was granted for prefectures, counties, and garrisons in Anhui including Fuyang.',
    'On dingwei day, Anhui districts including Fuyang received disaster relief.',
  ],
  s0418: [
    'On day jiyou, Yin Jishan was ordered to serve as Assistant Grand Secretary.',
    'On jiyou day, Yin Jishan was made Assistant Grand Secretary.',
  ],
  s0419: [
    'On day renzi, the Emperor visited the Palace of Double Glory and granted Commissioner-General Fu Heng a feast.',
    'On renzi day, the Emperor feasted Fu Heng at the Palace of Double Glory.',
  ],
  s0420: [
    'On day guichou, the Emperor went to the Tangzi for a prayer sacrifice and sacrificed to the Galdan standard.',
    'On guichou day, the Emperor prayed at the Tangzi and sacrificed to Galdan\'s standard.',
  ],
  s0421: [
    'On day jiayin, flood relief was granted for Tongshan in Jiangsu and eight prefectures, counties, and garrisons in Hubei including Hanchuan.',
    'On jiayin day, flood relief reached Tongshan and eight Hubei districts including Hanchuan.',
  ],
  s0422: [
    'On day bingchen, all provincial governors were ordered to hold additionally the nominal rank of Vice Censor-in-Chief of the Right.',
    'On bingchen day, every governor received the concurrent Right Vice Censor-in-Chief title.',
  ],
  s0423: [
    'On day dingsi, the Emperor went to the Southern Park for the hunt enclosure.',
    'On dingsi day, the Emperor hunted at the Southern Park.',
  ],
  s0424: [
    'On day wuwu, the Emperor reviewed troops.',
    'On wuwu day, the Emperor held a troop review.',
  ],
  s0425: [
    'On day wuchen, Zhou Xuejian was granted suicide.',
    'On wuchen day, Zhou Xuejian was allowed to take his own life.',
  ],
  s0426: [
    'Prince Ping Fu Peng died; court mourning was suspended for two days.',
    'Prince Ping Fu Peng died and the court mourned two days.',
  ],
  s0427: [
    'On day jisi, Yin Jishan was ordered to serve at the Grand Council.',
    'On jisi day, Yin Jishan joined the Grand Council.',
  ],
  s0428: [
    'Relief was granted for drought, tidal inundation, and other disasters in fourteen Fujian counties including Jinjiang.',
    'Fourteen Fujian counties including Jinjiang received drought and tidal relief.',
  ],
  s0429: [
    'On day gengwu, land tax was remitted for three Zhili counties including Wen\'an on account of flood.',
    'On gengwu day, flood land tax was remitted in three Zhili counties including Wen\'an.',
  ],
  s0430: [
    'On day guiyou, the Emperor visited Fengze Garden, feasted the Manchuria banner detachments, and granted rewards in varying degrees.',
    'On guiyou day, the Emperor feasted the Three Eastern Provinces troops at Fengze Garden and rewarded them.',
  ],
  s0431: [
    'Celeng was made Sichuan-Shaanxi governor-general; Yarghasan acted as Two Jiangs governor-general.',
    'Celeng became Sichuan-Shaanxi governor-general; Yarghasan acted at Two Jiangs.',
  ],
  s0432: [
    'Because Fu Heng rode over two hundred li a day, he was praised and rewarded.',
    'Fu Heng was commended for riding more than two hundred li daily.',
  ],
  s0433: [
    'On day jiaxu, Yin Jishan was given the seal of Imperial Commissioner and acted as Sichuan-Shaanxi governor-general.',
    'On jiaxu day, Yin Jishan received an imperial commission and acted as Sichuan-Shaanxi governor-general.',
  ],
  s0434: [
    'On day dingchou, because Neqin had ordered Zhang Guangsi and Yue Zhongqi to advance by separate routes yet contradicted himself, he was rebuked and arrested for punishment.',
    'On dingchou day, Neqin was arrested for contradicting his own orders to Zhang Guangsi and Yue Zhongqi.',
  ],
  s0435: [
    'On day jimao, because the Jinchuan war was costly, Fu Heng was secretly instructed to settle matters and restore peace.',
    'On jimao day, Fu Heng was secretly told to end the costly Jinchuan war peacefully.',
  ],
  s0436: [
    'On day gengchen, Sichuan and Shaanxi-Gansu governor-generalships were split: Yin Jishan became Shaanxi-Gansu governor-general, Celeng Sichuan governor-general with supervisory charge over governors, and E Chang Gansu governor.',
    'On gengchen day, Yin Jishan took Shaanxi-Gansu, Celeng Sichuan with governor oversight, and E Chang Gansu.',
  ],
  s0437: [
    'Suhede was transferred to the Ministry of Revenue and Hubao to the Ministry of War.',
    'Suhede went to Revenue and Hubao to War.',
  ],
  s0438: [
    'Twelfth month, day jiashen: Grand Secretaries were fixed at two Manchu and two Chinese; Assistant Grand Secretaries at one or two Manchu and Chinese; concurrent nominal halls were changed from four halls and two pavilions to three halls and three pavilions.',
    'In the twelfth month on jiashen, Grand Secretariat ranks were reordered to two Manchu and two Chinese secretaries and three halls with three pavilions.',
  ],
  s0439: [
    'On day yiyou, Fu Heng was given the added title Senior Guardian of the Heir Apparent.',
    'On yiyou day, Fu Heng became Senior Guardian of the Heir Apparent.',
  ],
  s0440: [
    'Akedun was ordered to serve as Assistant Grand Secretary.',
    'Akedun was made Assistant Grand Secretary.',
  ],
  s0441: [
    'On day dinghai, Huang Tinggui was made Two Jiangs governor-general.',
    'On dinghai day, Huang Tinggui became Two Jiangs governor-general.',
  ],
  s0442: [
    'The Emperor sat at Yingtai and personally tried Zhang Guangsi.',
    'The Emperor personally tried Zhang Guangsi at Yingtai.',
  ],
  s0443: [
    'On day wuzi, Suhede was sent to escort Neqin to camp to join Fu Heng in a rigorous examination.',
    'On wuzi day, Suhede was sent to bring Neqin to Fu Heng for strict trial at the front.',
  ],
  s0444: [
    'Haiwang acted as Revenue Minister; Hadaha acted as War Minister and Metropolitan Banner commander.',
    'Haiwang acted at Revenue; Hadaha acted at War and commanded the Metropolitan Banners.',
  ],
  s0445: [
    'On day xinmao, Qing Fu and Li Zhicui were sentenced to decapitation after debate.',
    'On xinmao day, Qing Fu and Li Zhicui received death sentences.',
  ],
  s0446: [
    'Grand Secretary Chen Shijuan was dismissed.',
    'Chen Shijuan left the Grand Secretariat.',
  ],
  s0447: [
    'On day renchen, Zhang Guangsi was executed.',
    'On renchen day, Zhang Guangsi was executed.',
  ],
  s0448: [
    'On day bingyin, Fu Heng was secretly told that if no victory was reported by the third month of the coming year, he should accept surrender and withdraw troops.',
    'On bingyin day, Fu Heng was secretly ordered to accept surrender and withdraw if no victory came by the third month.',
  ],
  s0449: [
    'On day dingyou, Sichuan and Shaanxi governors and governors-general were all placed under Fu Heng\'s command; Bandi handled governor\'s affairs alone, and Zhaohui grain transport alone.',
    'On dingyou day, Sichuan and Shaanxi officials were put under Fu Heng; Bandi ran civil government and Zhaohui supplies.',
  ],
  s0450: [
    'Gao Bin was removed as Grand Secretary but kept as Grand Canal governor-general.',
    'Gao Bin lost his grand secretaryship but remained Grand Canal governor-general.',
  ],
  s0451: [
    'On day guimao, Fu Heng and others were ordered to examine Neqin and execute him before the army with the saber of his grandfather Ebilun.',
    'On guimao day, Fu Heng was told to try Neqin and behead him at the front with Ebilun\'s saber.',
  ],
  s0452: [
    'On day jiachen, drought relief was granted for twenty-five Shaanxi prefectures and counties including Yaozhou.',
    'On jiachen day, twenty-five Shaanxi districts including Yaozhou received drought relief.',
  ],
  s0453: [
    'Year 14, spring, first month, on xinhai: Fu Heng and Yue Zhongqi were instructed to advance from Dangba; Furdan was to manage the Kasai route.',
    'In year 14 spring, on xinhai, Fu Heng and Yue Zhongqi were to advance from Dangba and Furdan handle Kasai.',
  ],
  s0454: [
    'On day guichou, because Grand Secretary Zhang Tingyu was aged, he was ordered to enter the palace every five days as adviser.',
    'On guichou day, Zhang Tingyu was told to attend court every five days as adviser.',
  ],
  s0455: [
    'Fu Heng was instructed to accept surrender and withdraw by the fourth month.',
    'Fu Heng was ordered to take surrender and withdraw by the fourth month.',
  ],
  s0456: [
    'On day yimao, disaster relief was granted for Jinxiang and other Shandong prefectures and counties.',
    'On yimao day, Shandong districts including Jinxiang received disaster relief.',
  ],
  s0457: [
    'On day dingji, Furdan, Daledang\'a, Suhede, Yin Jishan, and Celeng were ordered to assist in Greater Jinchuan military affairs.',
    'On dingji day, Furdan, Daledang\'a, Suhede, Yin Jishan, and Celeng were assigned to Greater Jinchuan staff duty.',
  ],
  s0458: [
    'On day wuwu, Hubao acted as Shaanxi-Gansu governor-general; Vice Minister Bandi was stripped of rank but still acted as Sichuan governor.',
    'On wuwu day, Hubao acted at Shaanxi-Gansu; Bandi lost rank but kept acting as Sichuan governor.',
  ],
  s0459: [
    'On day jiazi, Fu Heng was summoned back to the capital.',
    'On jiazi day, Fu Heng was recalled to Beijing.',
  ],
  s0460: [
    'Ministers Daledang\'a, Suhede, and Yin Jishan were all ordered back to their posts; Celeng and Yue Zhongqi were to manage Greater Jinchuan military affairs.',
    'Daledang\'a, Suhede, and Yin Jishan returned to office; Celeng and Yue Zhongqi ran Greater Jinchuan affairs.',
  ],
  s0461: [
    'On day bingyin, Furdan was sternly rebuked for asking to advance deep.',
    'On bingyin day, Furdan was sharply rebuked for seeking a deep advance.',
  ],
  s0462: [
    'On day dingmao, because Greater Jinchuan chiefs Sarob Dpon and Langka begged to surrender, Fu Heng was ordered to withdraw the army and was specially enfeoffed as Duke of Loyal Valor.',
    'On dingmao day, Sarob Dpon and Langka sued for peace; Fu Heng withdrew and was made Duke of Loyal Valor.',
  ],
  s0463: [
    'On day bingzi, Fu Heng was instructed to accept Sarob Dpon\'s surrender and the others.',
    'On bingzi day, Fu Heng was told to accept Sarob Dpon\'s surrender.',
  ],
  s0464: [
    'On day dingchou, the king of Lan Xang, Chao Sun, presented ivory tusks.',
    'On dingchou day, Lan Xang\'s King Chao Sun sent ivory tribute.',
  ],
  s0465: [
    'Second month, day yiyou: Tang Suizu asked to lead his subordinates in donating salary for army funds.',
    'In the second month on yiyou, Tang Suizu sought to donate official salaries for the army.',
  ],
  s0466: [
    'The Emperor sternly rebuked him for not understanding proper government practice.',
    'The Emperor rebuked Tang Suizu for misunderstanding government norms.',
  ],
  s0467: [
    'On day bingxu, Laibao was made Grand Tutor of the Heir Apparent; Chen Dashou, Suhede, Celeng, and Yin Jishan Senior Guardians; Wang Youdun and Liang Shizheng Grand Mentors; Daledang\'a, Nayantai, Akedun, and Hadaha Junior Mentors.',
    'On bingxu day, Laibao and others received heir-apparent honorific ranks in graded titles.',
  ],
  s0468: [
    'On day renchen, Fu Heng memorialized that on the fifth day of the second month an altar was prepared, the road cleared, and an edict read to receive the surrender of Greater Jinchuan native chieftain Sarob Dpon and tuzha Langka.',
    'On renchen day, Fu Heng reported receiving Sarob Dpon and Langka\'s surrender on the second month\'s fifth day.',
  ],
  s0469: [
    'Fu Heng was granted a four-dragon rank patch, two leopard-tail lances, and two bodyguards in addition; Yue Zhongqi was made Junior Guardian of the Heir Apparent.',
    'Fu Heng received a four-dragon patch, extra arms and guards; Yue Zhongqi became Junior Guardian.',
  ],
  s0470: [
    'On day guisi, because Yue Zhongqi had gone in person to Lewuwei to summon Sarob Dpon and others to surrender, he was specially praised in an edict.',
    'On guisi day, Yue Zhongqi was specially praised for summoning Sarob Dpon at Lewuwei.',
  ],
  s0471: [
    'On day bingshen, Labudun and Zhongfobao were summoned to the capital.',
    'On bingshen day, Labudun and Zhongfobao were recalled to Beijing.',
  ],
  s0472: [
    'On day gengzi, Suhede was ordered to inspect garrisons in Yunnan and other provinces and join Xinzhu in surveying Jinsha River works; Hubao acted as Huguang governor-general.',
    'On gengzi day, Suhede inspected Yunnan garrisons and Jinsha works with Xinzhu; Hubao acted at Huguang.',
  ],
  s0473: [
    'On day yisi, the Emperor visited Fengze Garden for the ceremonial ploughing.',
    'On yisi day, the Emperor performed the ploughing rite at Fengze Garden.',
  ],
  s0474: [
    'Sarob Dpon presented ten Tibetan boys and ten Tibetan girls; an edict declined them.',
    'Sarob Dpon\'s gift of Tibetan boys and girls was refused by edict.',
  ],
  s0475: [
    'Third month, day guichou: the eldest imperial son and Prince Yu and others were ordered to welcome Fu Heng at the outskirts.',
    'In the third month on guichou, the heir and Prince Yu were sent to welcome Fu Heng.',
  ],
  s0476: [
    'On day yimao, the Emperor escorted the Empress Dowager to Jing\'anzhuang to mourn before Empress Xiaoxian\'s coffin.',
    'On yimao day, the Emperor took the Empress Dowager to mourn at Xiaoxian\'s coffin in Jing\'anzhuang.',
  ],
  s0477: [
    'On day dingji, the Emperor led Commissioner-General and Grand Secretary Duke Fu Heng to the Empress Dowager\'s palace to inquire after her health.',
    'On dingji day, the Emperor and Duke Fu Heng paid respects to the Empress Dowager.',
  ],
  s0478: [
    'Yue Zhongqi was enfeoffed as duke of the third rank and given the nominal rank of Minister of War.',
    'Yue Zhongqi became a third-rank duke with the nominal War Minister title.',
  ],
  s0479: [
    'On day jiwei, Fu Heng was ordered to take charge additionally of the Court of Colonial Affairs; Laibao additionally of the Ministry of War.',
    'On jiwei day, Fu Heng also took the Colonial Affairs Court and Laibao the War Ministry.',
  ],
  s0480: [
    'Namuzhale and Debao were again made Directors-General of the Imperial Household.',
    'Namuzhale and Debao returned as Imperial Household directors-general.',
  ],
  s0481: [
    'On day xinyou, the Emperor went to the Eastern Tombs.',
    'On xinyou day, the Emperor visited the Eastern Tombs.',
  ],
  s0482: [
    'On day jiazi, the Emperor paid respects at Zhaoxi, Xiao, Xiaodong, and Jing tombs.',
    'On jiazi day, the Emperor visited Zhaoxi, Xiao, Xiaodong, and Jing mausoleums.',
  ],
  s0483: [
    'On day dingmao, the Emperor went to the Southern Park for the hunt enclosure.',
    'On dingmao day, the Emperor hunted at the Southern Park.',
  ],
  s0484: [
    'On day guiyou, the Emperor paid respects at Tai Tomb.',
    'On guiyou day, the Emperor visited Tai Tomb.',
  ],
  s0485: [
    'On day jiaxu, flood relief was granted for six Hubei prefectures and counties including Hanchuan.',
    'On jiaxu day, six Hubei districts including Hanchuan received flood relief.',
  ],
  s0486: [
    'On day yihai, quota land tax was remitted for ten Zhili prefectures, counties, and garrisons including Bao\'an on account of drought.',
    'On yihai day, drought tax was remitted in ten Zhili districts including Bao\'an.',
  ],
  s0487: [
    'On day dingchou, the Zhili river governor-generalship was abolished; its duties were absorbed and added to seals and commissions.',
    'On dingchou day, the Zhili river governor-general post was cut and its duties merged into other commissions.',
  ],
  s0488: [
    'Fusen was transferred to be Xi\'an general.',
    'Fusen became Xi\'an general.',
  ],
  s0489: [
    'Furdan was made Heilongjiang general.',
    'Furdan became Heilongjiang general.',
  ],
  s0490: [
    'Fourth month, day renwu: the Emperor took Taihe Hall; by the Empress Dowager\'s command, Noble Consort Xian of the Nara clan was invested as Imperial Noble Consort with charge of the six palaces.',
    'In the fourth month on renwu, the Nara Noble Consort Xian was raised to Imperial Noble Consort to run the six palaces.',
  ],
  s0491: [
    'On day jiashen, Laibao\'s additional charge was changed to the Ministry of Punishments.',
    'On jiashen day, Laibao\'s concurrent post shifted to Punishments.',
  ],
  s0492: [
    'Yunzhu was summoned to the capital; Gu Cong acted as grain-transport governor-general.',
    'Yunzhu was recalled; Gu Cong acted as grain-transport governor-general.',
  ],
  s0493: [
    'Nayantai and others were ordered to survey Ha\'er flood damage.',
    'Nayantai and others were sent to inspect Ha\'er flood damage.',
  ],
  s0494: [
    'On day yiyou, the Empress Dowager was given the honorific Chongqing Cixuan Kanghui; next day an amnesty edict granted favor in varying degrees.',
    'On yiyou day, the Empress Dowager received the honorific Chongqing Cixuan Kanghui and an amnesty followed.',
  ],
  s0495: [
    'On day xinmao, quota tax was remitted for twenty Shandong prefectures and counties including Zouping for flood and twelve Gansu districts including Gaolan for hail.',
    'On xinmao day, flood tax was remitted in twenty Shandong districts and hail tax in twelve Gansu districts.',
  ],
  s0496: [
    'Peng Shukui was summoned to the capital; Tang Suizu was transferred to Hubei governor; Asiha became Jiangxi governor.',
    'Peng Shukui was recalled; Tang Suizu went to Hubei and Asiha to Jiangxi.',
  ],
  s0497: [
    'Granary Commissioner Zhang Shizai was ordered to assist Jiangnan river works at his original rank.',
    'Zhang Shizai was assigned to help Jiangnan river works at his existing rank.',
  ],
  s0498: [
    'On day wuxu, Hubao was made grain-transport governor-general; Tang Suizu was ordered to act as Huguang governor-general.',
    'On wuxu day, Hubao became grain-transport governor-general and Tang Suizu acted at Huguang.',
  ],
  s0499: [
    'Hadaha was transferred to Minister of War; Sanhe was made Minister of Works.',
    'Hadaha became War Minister and Sanhe Works Minister.',
  ],
  s0500: [
    'Quota tax was remitted for four Shandong salterns including Wangjiagang.',
    'Tax quotas were remitted at four Shandong salterns including Wangjiagang.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_011_b05.mjs <translation.json>'
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
