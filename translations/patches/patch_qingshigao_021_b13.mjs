#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1201: [
    'Wu Longa was ordered to take overall command of the armies relieving Urumchi, with authority over expedition commanders and those below.',
    'Wu Longa was put in command of Urumchi relief forces, controlling all field commanders.',
  ],
  s1202: [
    'On day renshen, Bao Chao\'s army won a great victory over the bandits and was rewarded with the double-eyed peacock feather.',
    'On renshen day, Bao Chao routed the rebels and received the double-eyed peacock feather.',
  ],
  s1203: [
    'Xi Baotian\'s army captured the bandit chieftain Hong Rengan and others.',
    'Xi Baotian\'s troops seized Hong Rengan and other rebel leaders.',
  ],
  s1204: [
    'North and south Anhui were fully pacified.',
    'Anhui north and south were cleared of rebels.',
  ],
  s1205: [
    'On day yihai, Hui rebels took the Manchu city of Urumchi and Suilai; Commandant Ping Rui and others died.',
    'On yihai day, Muslim rebels seized Urumchi\'s Manchu quarter and Suilai; Ping Rui and other officials were killed.',
  ],
  s1206: [
    'Disturbances broke out among Han and Muslims at Hami.',
    'Hami saw Han–Muslim unrest.',
  ],
  s1207: [
    'Bao Heng was ordered to act as Urumchi commandant; Li Hongzhang as Liangjiang governor-general; Wu Tang as Jiangsu governor; and Fu Ming\'a as grain-transport governor-general.',
    'Bao Heng became acting Urumchi commandant; Li Hongzhang acting Liangjiang governor-general; Wu Tang acting Jiangsu governor; Fu Ming\'a acting grain-transport governor-general.',
  ],
  s1208: [
    'On day wuyin, Hong Fuxian was captured at Shicheng and executed.',
    'On wuyin day, Hong Fuxian was taken at Shicheng and put to death.',
  ],
  s1209: [
    'Shen Baozhen was rewarded with first-class Commandant of Chariots and Cavalry.',
    'Shen Baozhen received first-class Commandant of Chariots and Cavalry.',
  ],
  s1210: [
    'Bao Chao was enfeoffed as a first-class viscount.',
    'Bao Chao was made a first-class viscount.',
  ],
  s1211: [
    'For merit in recovering all Zhejiang, Zuo Zongtang was enfeoffed as a first-class earl and Jiang Yili was rewarded with Commandant of Cavalry.',
    'Zuo Zongtang became a first-class earl for retaking Zhejiang; Jiang Yili received Commandant of Cavalry.',
  ],
  s1212: [
    'Guangdong bandits took Ruijin but it was soon recovered.',
    'Taiping rebels seized Ruijin and the city was soon retaken.',
  ],
  s1213: [
    'On day gengchen, Guangdong bandits took Zhangzhou, Longyan, Nanjing, and Wuping; Surveillance Commissioner Zhang Yunlan and others died.',
    'On gengchen day, rebels took Zhangzhou, Longyan, Nanjing, and Wuping; Zhang Yunlan and other officials were killed.',
  ],
  s1214: [
    'Liu Rong divided his army to hold Binzhou and other places.',
    'Liu Rong detached troops to garrison Binzhou and nearby posts.',
  ],
  s1215: [
    'On day yiyou, Mingyi exchanged boundary treaties with the Russian envoy; Mongolia beyond the Kobdo border posts and the Altai Nor Urianghai all went to Russia.',
    'On yiyou day, Mingyi signed a border treaty with Russia, ceding Outer Mongolia beyond Kobdo and the Altai Nor Urianghai.',
  ],
  s1216: [
    'Bao Chao was granted leave; Song Guoyong\'s troops and others under him were sent to aid Fujian under Zuo Zongtang\'s command.',
    'Bao Chao went on leave while Song Guoyong\'s Fujian relief force was placed under Zuo Zongtang.',
  ],
  s1217: [
    'On day dinghai, Lei Zhengkuan\'s army took Lotus City; Cao Kezhong was rewarded with a yellow jacket.',
    'On dinghai day, Lei Zhengkuan captured Lotus City and Cao Kezhong received a yellow jacket.',
  ],
  s1218: [
    'Sengge Rinchen won a great victory in suppressing bandits; Guo Baochang and others were rewarded with yellow jackets, and the bandit chief Ma Ronghe surrendered with his followers.',
    'Sengge Rinchen routed the rebels; Guo Baochang and others got yellow jackets, and Ma Ronghe surrendered with his men.',
  ],
  s1219: [
    'On day jichou, Sichuan relief troops recovered Renhuai.',
    'On jichou day, Sichuan reinforcements retook Renhuai.',
  ],
  s1220: [
    'On day gengyin, Guangdong bandits took Pinghe.',
    'On gengyin day, rebels seized Pinghe.',
  ],
  s1221: [
    'On day xinmao, they took Jiaying and Dabu.',
    'On xinmao day, Jiaying and Dabu fell.',
  ],
  s1222: [
    'On day bingyin, an edict ordered Zeng Guofan to remain at Jinling and Li Hongzhang and others to return to their original posts.',
    'On bingyin day, Zeng Guofan was told to stay at Jinling while Li Hongzhang and others resumed their regular posts.',
  ],
  s1223: [
    'That month, the assessed grain tax was remitted for Xinyang and other disturbed places in Henan and arrears were remitted for Xi\'an and other counties in Zhejiang.',
    'That month, Henan\'s Xinyang district and Zhejiang\'s Xi\'an county were granted tax relief for war damage.',
  ],
  s1224: [
    'Eleventh month, day jihai: grain levies under Jiangning jurisdiction were waived for three years.',
    'In month 11, on jihai, Jiangning grain taxes were exempted for three years.',
  ],
  s1225: [
    'On day renyin, Hui rebels took Hezhou.',
    'On renyin day, Muslim rebels seized Hezhou.',
  ],
  s1226: [
    'On day guimao, the golden dike at Puzhou was built.',
    'On guimao day, Puzhou\'s golden river dike was completed.',
  ],
  s1227: [
    'On day yisi, Wen Qi and Boser suppressed the Hami Muslims.',
    'On yisi day, Wen Qi and Boser pacified the Hami rebels.',
  ],
  s1228: [
    'On day jiyou, the silver levied over the years by Jiangsu prefectures and counties for apportioned indemnities was remitted, and such apportionment titles were permanently forbidden.',
    'On jiyou day, Jiangsu\'s indemnity surcharges were cancelled and future apportionments were banned.',
  ],
  s1229: [
    'On day renzi, Shen Baozhen requested urgent reinforcements for Fujian and precautions against the bandits fleeing back by sea.',
    'On renzi day, Shen Baozhen urged Fujian reinforcements and coastal blockades against rebel escape.',
  ],
  s1230: [
    'On day jiayin, Guangdong troops recovered Wuping; Fujian, Zhejiang, and Jiangxi forces were ordered to pursue jointly and not let the bandits escape to sea.',
    'On jiayin day, Wuping was retaken and the three provinces were ordered to corner the rebels before they reached the sea.',
  ],
  s1231: [
    'Hui rebels took Aksu and Ush; Commissioner Fuzhuli, Wen Xing, and others died.',
    'Muslim rebels seized Aksu and Ush; Fuzhuli, Wen Xing, and other officials were killed.',
  ],
  s1232: [
    'On day guihai, Sengge Rinchen fought the bandits raiding from Xiangyang and Zaoyang unsuccessfully; Fa and Nian rebels then fled into Dengzhou.',
    'On guihai day, Sengge Rinchen failed against Xiang–Zao raiders, and Nian and other rebels broke into Dengzhou.',
  ],
  s1233: [
    'On day jiazi, an edict ordered the armies of Liu Lianjie and Liu Mingchuan to advance and come under Sengge Rinchen\'s command.',
    'On jiazi day, Liu Lianjie and Liu Mingchuan were told to advance under Sengge Rinchen.',
  ],
  s1234: [
    'On day yichou, the armies of Lei Zhengkuan and others defeated the Hui rebels of Guyuan.',
    'On yichou day, Lei Zhengkuan\'s force routed the Guyuan Muslim rebels.',
  ],
  s1235: [
    'On day bingyin, Wen Qi and others suppressed the Barkul Muslims and pacified them.',
    'On bingyin day, Wen Qi pacified the Barkul rebels.',
  ],
  s1236: [
    'Hui rebels took Kurkara Usu and Yili was placed on alert.',
    'Muslim rebels seized Kurkara Usu and Yili went on military alert.',
  ],
  s1237: [
    'On day dingmao, Manqing reported that Wang Qujiebu had died and requested the nomanhan title of Qingrao Wangqu to assist in Tibetan Shang affairs; this was granted.',
    'On dingmao day, Manqing\'s request to award Qingrao Wangqu the nomanhan title to manage Tibetan Shang affairs was approved.',
  ],
  s1238: [
    'That month, arrears were remitted for Shangyuan and other disturbed counties in Jiangsu.',
    'That month, Jiangsu\'s Shangyuan and other war-hit counties received tax arrears relief.',
  ],
  s1239: [
    'Twelfth month, new moon on day wuchen: Fujian troops fought the Zhangzhou bandits unsuccessfully; Lin Wenchao and others died.',
    'In month 12, wuchen new moon, Fujian forces were beaten at Zhangzhou; Lin Wenchao and others were killed.',
  ],
  s1240: [
    'On day jisi, Wu Tang was again ordered to oversee northern Jiangsu affairs concurrently.',
    'On jisi day, Wu Tang resumed concurrent charge of northern Jiangsu.',
  ],
  s1241: [
    'On day gengwu, the guest bandits of Zhaoqing were pacified.',
    'On gengwu day, Zhaoqing\'s guest rebels were suppressed.',
  ],
  s1242: [
    'The armies of Duxing\'a and others took Qingshuibao.',
    'Duxing\'a\'s troops captured Qingshuibao.',
  ],
  s1243: [
    'On day jiaxu, the tribute of jujubes from Henan by established quota was suspended.',
    'On jiaxu day, Henan\'s routine jujube tribute was halted.',
  ],
  s1244: [
    'The Zhejiang seawall was built.',
    'Work began on Zhejiang\'s coastal dike.',
  ],
  s1245: [
    'On day yihai, Hui rebels took Jinxian.',
    'On yihai day, Muslim rebels seized Jinxian.',
  ],
  s1246: [
    'Cao Kezhong\'s army took Yanguan.',
    'Cao Kezhong captured Yanguan.',
  ],
  s1247: [
    'On day wuyin, government troops in Yili suffered defeat; Brigade Commander Toktonai and others died.',
    'On wuyin day, Yili forces were defeated; Toktonai and other commanders were killed.',
  ],
  s1248: [
    'Mingxu\'s request to borrow Russian troops for suppression was granted.',
    'Mingxu was allowed to enlist Russian aid against the rebels.',
  ],
  s1249: [
    'On day jimao, government troops at Jimsar were defeated.',
    'On jimao day, the Jimsar garrison was beaten.',
  ],
  s1250: [
    'On day gengchen, generous posthumous grace was granted to the righteous commoners of Zhuji, including Bao Lishen.',
    'On gengchen day, Zhuji loyalists such as Bao Lishen received special mourning honors.',
  ],
  s1251: [
    'Wu Tang\'s request to trial grain transport by the Grand Canal was granted.',
    'The court approved Wu Tang\'s trial of canal grain transport.',
  ],
  s1252: [
    'On day yiyou, Tao Maolin\'s army recovered Jinxian.',
    'On yiyou day, Tao Maolin retook Jinxian.',
  ],
  s1253: [
    'On day bingxu, Li Yuandu was exiled to a military garrison.',
    'On bingxu day, Li Yuandu was sent to frontier military service.',
  ],
  s1254: [
    'On day jichou, Sengge Rinchen moved his army to Baofeng to suppress bandits and won.',
    'On jichou day, Sengge Rinchen shifted to Baofeng, defeated the rebels, and won.',
  ],
  s1255: [
    'On day jiawu, government troops won a great victory over Hui rebels; the siege of Yili was lifted and Mingxu was rewarded with a yellow jacket.',
    'On jiawu day, a major victory raised the Yili siege; Mingxu received a yellow jacket.',
  ],
  s1256: [
    'That month, arrears were remitted for disturbed Rui\'an in Zhejiang; disaster taxes were remitted for Taicang and other prefectures, departments, and counties in Jiangsu and for Huai\'an and other guards.',
    'That month, tax relief was granted to war-hit Rui\'an in Zhejiang and to Jiangsu\'s Taicang district and Huai\'an guards.',
  ],
  s1257: [
    'That year, Korea and Ryukyu sent tribute missions.',
    'Korea and Ryukyu presented tribute that year.',
  ],
  s1258: [
    'Fourth year, spring, first month, new moon on day dingyou: government troops took the bandit lair at Jingning.',
    'In spring of the fourth year, dingyou new moon, the army captured the Jingning rebel stronghold.',
  ],
  s1259: [
    'Hui rebels took the Han city of Gucheng.',
    'Muslim rebels seized Gucheng\'s Han quarter.',
  ],
  s1260: [
    'On day gengzi, Bayandai city was besieged and government troops fared badly.',
    'On gengzi day, Bayandai was surrounded and government forces were beaten.',
  ],
  s1261: [
    'Chen Fuen and Le Shan were released and ordered to assist in provisioning the Yili army.',
    'Chen Fuen and Le Shan were freed to help supply the Yili campaign.',
  ],
  s1262: [
    'On day renyin, at Zeng Guofan\'s request, Liu Mingchuan\'s army was transferred to Fujian and Bao Chao was ordered to recruit Sichuan troops for Gansu.',
    'On renyin day, Liu Mingchuan went to Fujian and Bao Chao was told to raise Sichuan troops for Gansu.',
  ],
  s1263: [
    'Posthumous titles were granted to the fallen circuit intendant He Guizhen, prefect Liu Tenghong, and colonel Bi Jinke.',
    'He Guizhen, Liu Tenghong, and Bi Jinke received posthumous honors.',
  ],
  s1264: [
    'On day jiachen, Wen Qi, Urumchi provincial commander-in-chief, died at Barkul.',
    'On jiachen day, Urumchi commander Wen Qi died at Barkul.',
  ],
  s1265: [
    'Hui rebels took Mulei and other places.',
    'Muslim rebels seized Mulei and neighboring posts.',
  ],
  s1266: [
    'On day dingwei, Zhang Jixin was dismissed from office for crime.',
    'On dingwei day, Zhang Jixin was stripped of office for misconduct.',
  ],
  s1267: [
    'The dismissed provincial commander-in-chief Ma Dezhao was restored to his former rank.',
    'Disgraced commander Ma Dezhao was reinstated.',
  ],
  s1268: [
    'Hui rebels from Pingliang and Guyuan raided Lingtai and Qianyang and Longzhou.',
    'Ping–Gu Muslim rebels harassed Lingtai, Qianyang, and Longzhou.',
  ],
  s1269: [
    'On day wushen, Boser was ordered to act as Hami assistant commissioner.',
    'On wushen day, Boser became acting Hami assistant commissioner.',
  ],
  s1270: [
    'On day xinhai, the Taiwan secret-society rebels were pacified.',
    'On xinhai day, Taiwan\'s secret societies were suppressed.',
  ],
  s1271: [
    'On day jiayin, Guangdong bandits took Yongding and Yunxiao.',
    'On jiayin day, rebels seized Yongding and Yunxiao.',
  ],
  s1272: [
    'On day bingchen, the Huai–Yang river conservancy circuit was re-established and the Xu–Hai river conservancy circuit was reorganized.',
    'On bingchen day, Huai–Yang and Xu–Hai river conservancy posts were reinstated.',
  ],
  s1273: [
    'On day dingsi, Guangdong and Nian bandits together fled into Lushan; Guard Commander Hengling and others died.',
    'On dingsi day, Guangdong and Nian rebels entered Lushan; Hengling and others were killed.',
  ],
  s1274: [
    'On day guihai, Hui rebels took Jimsar.',
    'On guihai day, Muslim rebels seized Jimsar.',
  ],
  s1275: [
    'On day jiazi, Guizhou bandits took Dingfan and soon recovered it, then took Qianxi.',
    'On jiazi day, Guizhou rebels took Dingfan, lost it, then seized Qianxi.',
  ],
  s1276: [
    'On day yichou, Hui rebels fled into Yongchang.',
    'On yichou day, Muslim rebels raided Yongchang.',
  ],
  s1277: [
    'Second month, day xinwei: Mongol troops were sent to relieve Gucheng but fought unsuccessfully; an edict ordered all troops already transferred to return to their banners.',
    'In month 2, xinwei, Mongol relief for Gucheng failed and transferred troops were recalled to their banners.',
  ],
  s1278: [
    'On day renshen, Shaanxi troops defeated Hui rebels at Liquan; Hu Zhonghe was ordered to take overall command of the advance.',
    'On renshen day, Shaanxi forces beat Muslim rebels at Liquan; Hu Zhonghe was made overall commander.',
  ],
  s1279: [
    'On day wuyin, because the officials and gentry of Lin\'an in Yunnan did not join the Muslim rebels, an edict praised them.',
    'On wuyin day, Lin\'an\'s loyal officials and gentry in Yunnan were commended.',
  ],
  s1280: [
    'On day jimao, Shen Baozhen\'s request for leave to return home was granted.',
    'On jimao day, Shen Baozhen was granted home leave.',
  ],
  s1281: [
    'On day guiwei, because of thunder and hail disasters in the metropolitan provinces, an edict called for self-examination and reform.',
    'On guiwei day, hail disasters in Zhili prompted an edict of court self-reform.',
  ],
  s1282: [
    'Lei Zhengkuan\'s army again recovered Guyuan and other places.',
    'Lei Zhengkuan retook Guyuan and neighboring posts.',
  ],
  s1283: [
    'Guizhou Assistant Commander Cao Yuanxing plotted rebellion and was executed.',
    'Cao Yuanxing of Guizhou was executed for treason.',
  ],
  s1284: [
    'On day jiashen, the bandits of Changyang were pacified.',
    'On jiashen day, Changyang bandits were suppressed.',
  ],
  s1285: [
    'On day bingxu, Yongding and Longyan were recovered.',
    'On bingxu day, Yongding and Longyan were retaken.',
  ],
  s1286: [
    'The armies of Wu Longe and others went to relieve Bayandai city but were defeated.',
    'Wu Longe\'s relief force for Bayandai was beaten.',
  ],
  s1287: [
    'On day jichou, Qianxi bandits took Dading.',
    'On jichou day, rebels from Qianxi seized Dading.',
  ],
  s1288: [
    'Miao bandits took Tianzhu and Guzhou.',
    'Miao rebels captured Tianzhu and Guzhou.',
  ],
  s1289: [
    'Because Ma Rulong and Cen Yuying had pacified Qujing and Xundian and captured and executed the rebel leaders including Ma Liansheng, rewards were granted in varying degrees.',
    'Ma Rulong and Cen Yuying were rewarded for clearing Qujing and Xundian and killing Ma Liansheng and other rebel chiefs.',
  ],
  s1290: [
    'On day guisi, Fujian government troops won a great victory over the forces of Li Shixian and Wang Haiyang at Gutian and Zhangzhou.',
    'On guisi day, Fujian troops routed Li Shixian and Wang Haiyang at Gutian and Zhangzhou.',
  ],
  s1291: [
    'Third month, day dingyou: Tian Xingyu was exiled to Xinjiang for neglecting military affairs and brutally killing Christians.',
    'In month 3, dingyou, Tian Xingyu was sent to Xinjiang for dereliction and massacre of Christians.',
  ],
  s1292: [
    'On day xinchou, Tao Maolin suppressed the Hui rebels at Guojia Post and other places.',
    'On xinchou day, Tao Maolin pacified Muslim rebels at Guojia Post and elsewhere.',
  ],
  s1293: [
    'An edict warned Sengge Rinchen: "Hold command from camp and direct operations; do not lightly go to the front lest you fall into peril."',
    'The court told Sengge Rinchen to command from the rear and not risk himself at the front.',
  ],
  s1294: [
    'On day renyin, Prince Gong was removed from the Grand Council and stripped of the prince-regency.',
    'On renyin day, Prince Gong left the Grand Council and lost his regency role.',
  ],
  s1295: [
    'Wenxiang and others were ordered to manage affairs of the Office for the Management of Affairs of All Foreign Countries.',
    'Wenxiang and others were assigned to run the Zongli Yamen.',
  ],
  s1296: [
    'Guangdong bandits took Zhao\'an; Magistrate Zhao Rencheng died.',
    'Rebels seized Zhao\'an and Magistrate Zhao Rencheng was killed.',
  ],
  s1297: [
    'On day guimao, the Muslims of Liangzhou rebelled and were suppressed.',
    'On guimao day, Liangzhou Muslims rebelled and were pacified.',
  ],
  s1298: [
    'Britain and France were permitted to trade at Jiangning.',
    'British and French trade at Nanjing was approved.',
  ],
  s1299: [
    'Bao Chao was ordered to prepare the western expedition and was allowed memorials on his own authority.',
    'Bao Chao was told to ready the western campaign with independent memorial rights.',
  ],
  s1300: [
    'Prince Dun stated that the charges against Prince Gong were unfounded; the matter was referred to princes, grand secretaries, and others for detailed deliberation and report.',
    'Prince Dun said Prince Gong had been wrongly accused; princes and grand secretaries were ordered to investigate and report.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_021_b13.mjs <translation.json>'
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
