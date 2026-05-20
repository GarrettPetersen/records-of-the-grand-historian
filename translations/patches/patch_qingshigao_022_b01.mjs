#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'In the sixth year, dingmao, spring, first month, on day jiwei, Ren and Lai bandits fled to Xiaogan and De\'an; government troops were defeated; Grand Commander Zhang Shushan died in battle.',
    'Year 6, spring 1, jiwei: Ren and Lai bandits reached Xiaogan and De\'an; troops lost and Zhang Shushan was killed.',
  ],
  s0002: [
    'On day renxu, Jingyuan was recovered.',
    'On renxu day Jingyuan was retaken.',
  ],
  s0003: [
    'On day bingyin, Guan Wen was removed as governor-general and summoned to the capital.',
    'On bingyin day Guan Wen lost his governor-general post and was recalled to Beijing.',
  ],
  s0004: [
    'Li Hongzhang was made Huguang governor-general; Li Hanzhang was transferred as Jiangsu governor; Liu Kun was made Hunan governor.',
    'Li Hongzhang took Huguang, Li Hanzhang Jiangsu, and Liu Kun Hunan.',
  ],
  s0005: [
    'On day jisi, Zhang Xisheng attacked Nian bandits at Yuhua town in Xi\'an and died.',
    'On jisi day Zhang Xisheng fell fighting Nian bandits at Xi\'an\'s Yuhua town.',
  ],
  s0006: [
    'Liu Songshan\'s army won a great victory.',
    'Liu Songshan won a major victory.',
  ],
  s0007: [
    'Qiao Songnian was ordered to supervise Shaanxi military affairs exclusively.',
    'Qiao Songnian was put in sole charge of Shaanxi operations.',
  ],
  s0008: [
    'On day xinwei, Zuo Zongtang was made Imperial Commissioner to supervise Shaanxi-Gansu military affairs; Liu Dian was rewarded with Third Rank Courtier rank to assist in military affairs.',
    'On xinwei day Zuo Zongtang became commissioner for Shaanxi-Gansu and Liu Dian received third-rank rank to assist.',
  ],
  s0009: [
    'On day yihai, Hami Hui rebels raided Barkol; government troops drove them back.',
    'On yihai day Hami Hui raiders hit Barkol and were driven back.',
  ],
  s0010: [
    'Nierji was dismissed on illness; Yiletun was made Barkol detachment commander.',
    'Ill Nierji was relieved and Yiletun became Barkol detachment commander.',
  ],
  s0011: [
    'On day bingzi, Xu Jishe was ordered to continue serving at the Zongli Yamen and manage affairs of the newly established Tongwenguan.',
    'On bingzi day Xu Jishe stayed at the Zongli Yamen to run the new Tongwenguan.',
  ],
  s0012: [
    'On day jimao, government troops recovered Zhenxiong.',
    'On jimao day troops retook Zhenxiong.',
  ],
  s0013: [
    'Second month, new moon on day yiyou: Liu Mingchuan pursued and attacked Ren and Lai at Zhongxiang and was defeated.',
    'At the second-month new moon, yiyou, Liu Mingchuan lost a pursuit fight with Ren and Lai at Zhongxiang.',
  ],
  s0014: [
    'Bao Chao advanced to attack and routed them completely.',
    'Bao Chao counterattacked and crushed them.',
  ],
  s0015: [
    'On day gengyin, Li Hongzhang was ordered to lead troops to Henan.',
    'On gengyin day Li Hongzhang was sent to command in Henan.',
  ],
  s0016: [
    'On day renchen, pestilence broke out in the capital.',
    'On renchen day plague struck Beijing.',
  ],
  s0017: [
    'On day jiawu, Liu Songshan was promoted to Guangdong provincial military commander.',
    'On jiawu day Liu Songshan became Guangdong land commander.',
  ],
  s0018: [
    'On day dingyou, Shaanxi Hui Ma Shengyan and others surrendered.',
    'On dingyou day Shaanxi Hui led by Ma Shengyan surrendered.',
  ],
  s0019: [
    'Collection of rice commutation silver under Guangzhou\'s jurisdiction was reduced by over 190,000 taels and fixed as statute.',
    'Guangzhou rice-commutation silver was cut by 190,000-odd taels and made permanent law.',
  ],
  s0020: [
    'On day yisi, Guangxi troops recovered Sicheng.',
    'On yisi day Guangxi troops retook Sicheng.',
  ],
  s0021: [
    'On day gengxu, Ding Baozhen was made Shandong governor.',
    'On gengxu day Ding Baozhen became Shandong governor.',
  ],
  s0022: [
    'On day xinhai, Taozhou fell again.',
    'On xinhai day Taozhou was lost again.',
  ],
  s0023: [
    'On day renzi, Yunnan-Guizhou Governor-General Lao Chongguang died; Zhang Kaisong replaced him.',
    'On renzi day Lao Chongguang died and Zhang Kaisong took Yunnan-Guizhou.',
  ],
  s0024: [
    'Third month, day dingsi: Hubei troops attacked bandits at Qishui and were defeated; Circuit Intendant Peng Yuju and others died.',
    'In month 3, dingsi, Hubei troops lost at Qishui and Peng Yuju was killed.',
  ],
  s0025: [
    'On day guihai, Grand Commander Duan Buyun\'s army was routed at Fuzhou.',
    'On guihai day Duan Buyun\'s force collapsed at Fuzhou.',
  ],
  s0026: [
    'On day wuchen, Bao Chao repeatedly begged sick leave; he was instructed to proceed nonetheless to Huangzhou.',
    'On wuchen day Bao Chao\'s repeated sick leaves were denied and he was told to go to Huangzhou.',
  ],
  s0027: [
    'On day yihai, Woren was ordered to serve at the Zongli Yamen; he declined and was not permitted to do so.',
    'On yihai day Woren was ordered to the Zongli Yamen, refused, and was overruled.',
  ],
  s0028: [
    'On day dingchou, Li Yunlin and others were instructed to settle Xinjiang refugees.',
    'On dingchou day Li Yunlin was told to resettle Xinjiang refugees.',
  ],
  s0029: [
    'On day xinsi, Cao Kezhong\'s army recovered Taozhou.',
    'On xinsi day Cao Kezhong retook Taozhou.',
  ],
  s0030: [
    'On day renwu, Hui bandits Ma Zhan\'ao and others attacked Xining.',
    'On renwu day Ma Zhan\'ao\'s Hui raiders struck Xining.',
  ],
  s0031: [
    'That spring, overdue levies were remitted for Zhejiang Renhe and other salt yards disturbed by raids and for civilian grain debts to government granaries in Shanxi Pingding and other places.',
    'That spring Zhejiang salt-yard arrears and Shanxi granary debts were forgiven after disturbance.',
  ],
  s0032: [
    'Summer, fourth month, day dinghai: the request that Ryukyu princes and sons study in the Imperial Academy was approved.',
    'In summer month 4, dinghai, Ryukyu students were allowed into the Imperial Academy.',
  ],
  s0033: [
    'Bao Chao was granted sick leave.',
    'Bao Chao got sick leave.',
  ],
  s0034: [
    'On day wuzi, He Guan\'s army recovered Hami.',
    'On wuzi day He Guan retook Hami.',
  ],
  s0035: [
    'On day jichou, Zhou Zupei died.',
    'On jichou day Zhou Zupei died.',
  ],
  s0036: [
    'On day guisi, Jilin horse bandits were pacified.',
    'On guisi day Jilin horse bandits were pacified.',
  ],
  s0037: [
    'On day bingshen, the Spanish envoy came to exchange treaties.',
    'On bingshen day Spain\'s envoy arrived to renew treaties.',
  ],
  s0038: [
    'On day renyin, Liu Songshan heavily defeated Nian and Hui forces at Tongzhou.',
    'On renyin day Liu Songshan routed Nian and Hui at Tongzhou.',
  ],
  s0039: [
    'On day bingwu, the Zasak prince of Hami who died resisting invasion, Boshier, was posthumously ennobled as prince and given a temple.',
    'On bingwu day Boshier of Hami was made a posthumous prince and memorialized.',
  ],
  s0040: [
    'Delekeduoerji was dismissed on illness; Lin Xing was made Uriankhai general and Rongquan was transferred as co-administrator.',
    'Ill Delekeduoerji was relieved; Lin Xing became Uriankhai general and Rongquan his deputy.',
  ],
  s0041: [
    'On day dingwei, the Zhandui tribal chief Dage Zhebu was executed.',
    'On dingwei day Zhandui chief Dage Zhebu was executed.',
  ],
  s0042: [
    'On day gengxu, Guide Hui rebels mutinied and took the circuit seat.',
    'On gengxu day Guide Hui rebels seized the seat.',
  ],
  s0043: [
    'Fifth month, day jiayin: Hami Hui rebels raided Yumen; government troops drove them back.',
    'In month 5, jiayin, Hami Hui raiders hit Yumen and were driven back.',
  ],
  s0044: [
    'Because of drought, orders were issued to succor refugees, rear infants, bury the exposed dead, and support families of troops killed in battle.',
    'Drought orders told officials to aid refugees, care for infants, bury the dead, and support soldiers\' families.',
  ],
  s0045: [
    'On day wuwu, purchase of books was broadly ordered and imperially compiled and approved classics and histories were reprinted and distributed to all schools.',
    'On wuwu day the court ordered book purchases and reprints of imperial classics for all schools.',
  ],
  s0046: [
    'On day jiwei, the armies of Guo Baochang and Liu Songshan defeated Zhang Zongyu at Chaoyi.',
    'On jiwei day Guo Baochang and Liu Songshan beat Zhang Zongyu at Chaoyi.',
  ],
  s0047: [
    'Guo Baochang was exempted from banishment to military colonies.',
    'Guo Baochang\'s exile sentence was lifted.',
  ],
  s0048: [
    'On day xinyou, Zeng Guofan was made Grand Secretary and Luo Bingzhang assistant Grand Secretary.',
    'On xinyou day Zeng Guofan became Grand Secretary with Luo Bingzhang as assistant.',
  ],
  s0049: [
    'On day bingyin, an edict ordered clearing up miscellaneous prisons.',
    'On bingyin day an edict ordered jail cleanup.',
  ],
  s0050: [
    'On day dingmao, Guangxi troops recovered Libo and Yining.',
    'On dingmao day Guangxi troops retook Libo and Yining.',
  ],
  s0051: [
    'On day wuchen, an edict sought frank remonstrance and verified reduction of palace expenditures.',
    'On wuchen day the throne sought candor and cut palace spending.',
  ],
  s0052: [
    'On day jisi, Nian bandits crossed the Grand Canal; Ding Baozhen was subjected to severe deliberation.',
    'On jisi day Nian bandits crossed the canal and Ding Baozhen faced severe censure.',
  ],
  s0053: [
    'On day gengwu, bandits fled to Changyuan; government troops drove them back.',
    'On gengwu day raiders reached Changyuan and were driven off.',
  ],
  s0054: [
    'On day guiyou, for failure to suppress bandits, Zeng Guoquan\'s peacock feather was removed and he and Li Henian were referred for severe deliberation.',
    'On guiyou day Zeng Guoquan lost his feather and he and Li Henian faced severe censure for failure.',
  ],
  s0055: [
    'Li Hongzhang was instructed to achieve merit while bearing guilt.',
    'Li Hongzhang was told to redeem himself by winning.',
  ],
  s0056: [
    'The capital suffered an earthquake.',
    'Beijing shook.',
  ],
  s0057: [
    'On day gengchen, Dong Fuxiang seized Ganquan in Shaanxi.',
    'On gengchen day Dong Fuxiang took Shaanxi\'s Ganquan.',
  ],
  s0058: [
    'Sixth month, day jiashen: the Zongli Yamen reported Russians were watching Xinjiang covetously; the matter was referred to Grand Secretaries, ministers, the left censor-in-chief, and the prince-ministers of the Zongli Yamen for proper deliberation.',
    'In month 6, jiashen, the Zongli Yamen warned of Russian designs on Xinjiang and referred the matter upstairs.',
  ],
  s0059: [
    'On day bingxu, over-collection of grain transport tax by prefectures and counties was sternly forbidden.',
    'On bingxu day counties were forbidden from excess grain-tax levies.',
  ],
  s0060: [
    'On day jiawu, Woren begged sick leave; his duties were removed but he remained Grand Secretary attending at Hongde Hall.',
    'On jiawu day Woren took sick leave, lost his posts, but kept his grand secretary seat at Hongde Hall.',
  ],
  s0061: [
    'On day yiwei, government troops defeated Nian bandits at Jimo.',
    'On yiwei day troops beat Nian bandits at Jimo.',
  ],
  s0062: [
    'On day gengzi, Shuntian and Zhili had long drought and famine; relief was granted.',
    'On gengzi day drought and famine in Shuntian-Zhili brought relief orders.',
  ],
  s0063: [
    'Bao Chao\'s request to return home was approved.',
    'Bao Chao was allowed to go home.',
  ],
  s0064: [
    'On day xinchou, Li Hongzhang ordered Liu Mingchuan, Pan Dingxin, and other armies to defend the Grand Canal and block Jiao and Lai.',
    'On xinchou day Li Hongzhang sent Liu Mingchuan and Pan Dingxin to hold the canal against Jiao and Lai.',
  ],
  s0065: [
    'Cheng Lu was ordered to command the armies of Huang Zugan and Wang Renhe.',
    'Cheng Lu was put over Huang Zugan and Wang Renhe.',
  ],
  s0066: [
    'Because of severe drought in the metropolitan region, 300,000 taels from Fujian-Guangdong-Jiangxi transit levies and 350,000 from Zhejiang-Fujian customs foreign taxes were allocated for relief.',
    'Metropolitan drought drew 300,000 taels from transit levies and 350,000 from customs for relief.',
  ],
  s0067: [
    'On day guimao, Gansu Hui forces took Huating in Shaanxi but soon it was recovered.',
    'On guimao day Gansu Hui took Shaanxi\'s Huating but troops soon retook it.',
  ],
  s0068: [
    'On day dingwei, the annual tribute of fruit from Changping was remitted.',
    'On dingwei day Changping\'s fruit tribute was waived.',
  ],
  s0069: [
    'On day jiyou, since rain had failed from the third month onward, the Emperor repeatedly prayed for rain.',
    'On jiyou day the Emperor kept praying for rain after drought since month 3.',
  ],
  s0070: [
    'By this day it rained.',
    'Rain finally came that day.',
  ],
  s0071: [
    'That month, assessed taxes were remitted for Qianzhou and other districts in Shaanxi disturbed by disaster.',
    'That month Shaanxi disaster districts had taxes remitted.',
  ],
  s0072: [
    'Autumn, seventh month, day jiwei: rain.',
    'In autumn month 7, jiwei, it rained.',
  ],
  s0073: [
    'Shaanxi troops recovered Ganquan.',
    'Shaanxi troops retook Ganquan.',
  ],
  s0074: [
    'On day gengwu, the Yongding River breached its banks.',
    'On gengwu day the Yongding River broke.',
  ],
  s0075: [
    'On day jimao, because Nian bandits had crossed the Jiaolai River, all routes were instructed to hold the Yellow River and canal defenses; Ding Baozhen\'s post was removed but he remained in office.',
    'On jimao day Nian crossed the Jiaolai and routes were told to hold river defenses; Ding Baozhen lost rank but stayed on.',
  ],
  s0076: [
    'That month, overdue taxes were remitted for Hunan Huangzhou disturbed by raids.',
    'That month Huangzhou\'s disturbed tax arrears were forgiven.',
  ],
  s0077: [
    'Eighth month, day bingxu: the winter hunt in Fengtian was halted.',
    'In month 8, bingxu, Fengtian\'s winter hunt was canceled.',
  ],
  s0078: [
    'On day wuzi, Hubei rebel chief Liu Hanzhong was executed.',
    'On wuzi day Hubei chief Liu Hanzhong was executed.',
  ],
  s0079: [
    'On day gengyin, Li Peijing was ordered to assist in Guizhou suppression-pacification and military colony affairs.',
    'On gengyin day Li Peijing was sent to assist Guizhou pacification and colonies.',
  ],
  s0080: [
    'On day renchen, Fengtian troops pacified bandits at Gushan, Faku, and other places.',
    'On renchen day Fengtian troops pacified Gushan and Faku bandits.',
  ],
  s0081: [
    'On day xinmao, Acting Guizhou Military Commander Zhao Deguang attacked bandits at Anping and died.',
    'On xinmao day acting commander Zhao Deguang died fighting at Anping.',
  ],
  s0082: [
    'On day bingshen, Mulonga and others\' army attacked outlaw bands at Wen\'an and was defeated.',
    'On bingshen day Mulonga lost a fight with outlaw bands at Wen\'an.',
  ],
  s0083: [
    'Bandits rose in Jiyang; they were suppressed and pacified.',
    'Jiyang bandits rebelled and were crushed.',
  ],
  s0084: [
    'On day dingyou, Western Yunnan Hui attacked Yaozhou.',
    'On dingyou day western Yunnan Hui struck Yaozhou.',
  ],
  s0085: [
    'On day wuxu, Guizhou Governor Zhang Liangji was opened from office for severe deliberation; Zeng Biguang was ordered to act; Provincial Administration Commissioner Yan Shusen was stripped of office for dawdling.',
    'On wuxu day Zhang Liangji faced severe censure, Zeng Biguang acted as governor, and Yan Shusen lost his post for delay.',
  ],
  s0086: [
    'On day renyin, Chen Guorui was summoned to the capital.',
    'On renyin day Chen Guorui was recalled to Beijing.',
  ],
  s0087: [
    'On day bingwu, because Huai and Chu armies everywhere committed disturbances, Li Hongzhang was instructed to enforce military discipline strictly.',
    'On bingwu day Li Hongzhang was told to tighten discipline after Huai-Chu troops harassed civilians.',
  ],
  s0088: [
    'On day jiyou, Rehe timber tax was abolished.',
    'On jiyou day Rehe\'s timber tax was abolished.',
  ],
  s0089: [
    'On day gengxu, the Fujian shipyard was established.',
    'On gengxu day Fujian\'s naval dockyard was founded.',
  ],
  s0090: [
    'Ninth month, day renzi: Zuo Zongtang\'s request to transfer Cao Kezhong to Shaanxi was approved.',
    'In month 9, renzi, Zuo Zongtang\'s transfer of Cao Kezhong to Shaanxi was approved.',
  ],
  s0091: [
    'On day bingchen, Lai and Ren bandits attacked the Grand Canal; Niu Shihan\'s army drove them back.',
    'On bingchen day Lai and Ren hit the canal and Niu Shihan drove them off.',
  ],
  s0092: [
    'On day dingsi, Hui communities of He, Di, and Xining submitted in allegiance.',
    'On dingsi day He, Di, and Xining Hui groups surrendered.',
  ],
  s0093: [
    'On day gengshen, Shandong\'s annual tribute presentation was halted.',
    'On gengshen day Shandong\'s tribute presentations were halted.',
  ],
  s0094: [
    'On day xinyou, Oirat nomads were resettled on the Irtysh River.',
    'On xinyou day Oirat nomads were settled on the Irtysh.',
  ],
  s0095: [
    'On day jiazi, the Zongli Yamen reported on pre-arranging treaty revision affairs.',
    'On jiazi day the Zongli Yamen reported on preparing treaty revisions.',
  ],
  s0096: [
    'Zeng Guofan and others were instructed to state their views separately for report.',
    'Zeng Guofan and others were told to submit their views.',
  ],
  s0097: [
    'On day jisi, Ding Richang was ordered to go to Shanghai to handle Italy\'s treaty exchange.',
    'On jisi day Ding Richang was sent to Shanghai for Italy\'s treaty renewal.',
  ],
  s0098: [
    'On day renshen, victims of flood disaster at Wushan were succored.',
    'On renshen day Wushan flood victims were relieved.',
  ],
  s0099: [
    'On day dingchou, Rongquan and Kungazhala were ordered to deliberate measures for Kazakh suppression and pacification.',
    'On dingchou day Rongquan and Kungazhala were told to plan Kazakh pacification.',
  ],
  s0100: [
    'On day jimao, Feng Zicai was ordered to proceed to Zuojiang to supervise exclusively Nan and Tai military affairs.',
    'On jimao day Feng Zicai was sent to Zuojiang for Nan and Tai operations.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_022_b01.mjs <translation.json>'
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
