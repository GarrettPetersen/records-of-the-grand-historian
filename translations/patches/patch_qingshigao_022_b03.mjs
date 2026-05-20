#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'Muslim rebels attacked Hami; Yiletun and others jointly repelled them.',
    'Muslim rebels hit Hami; Yiletun and others drove them back.',
  ],
  s0202: [
    'On day guimao, Hong Jun and two hundred seventy others were granted jinshi degrees and appointment with distinctions.',
    'On guimao, Hong Jun and 270 others received jinshi degrees with distinctions.',
  ],
  s0203: [
    'That month, three years\' rent and tax were remitted for all native chieftains in Sichuan.',
    'That month, Sichuan tusi were exempted three years\' rent and tax.',
  ],
  s0204: [
    'Intercalary fourth month, new moon on day wushen: rebels from western Yunnan seized Kunyang, Xinxing, Jinning, Chenggong, and Songming.',
    'Intercalary month 4, wushen new moon, western Yunnan rebels took Kunyang, Xinxing, Jinning, Chenggong, and Songming.',
  ],
  s0205: [
    'On day wuwu, Muslim rebels again seized Shenmu.',
    'On wuwu Muslim rebels again took Shenmu.',
  ],
  s0206: [
    'On day guihai, Shaanxi forces recovered Yanchang.',
    'On guihai Shaanxi forces recovered Yanchang.',
  ],
  s0207: [
    'On day jiazi, Dong Fuxiang submitted; he was ordered to redeem himself by merit.',
    'On jiazi Dong Fuxiang submitted and was told to earn pardon by merit.',
  ],
  s0208: [
    'On day yichou, Muslim rebels held Wushen Banner, raided the Dzungar banners in separate columns, and pressed Tuoketuo.',
    'On yichou Muslim rebels held Wushen Banner, raided Dzungar banners, and pressed Tuoketuo.',
  ],
  s0209: [
    'On day dingmao, the armies of Cheng Wenbing, Chen Guorui, and Liu Songshan attacked Zhang Zongyu at Gaotang, Chiping, and Boxing and won a great victory.',
    'On dingmao Cheng Wenbing, Chen Guorui, and Liu Songshan routed Zhang Zongyu at Gaotang, Chiping, and Boxing.',
  ],
  s0210: [
    'The bandits fled into Dongguang.',
    'The bandits fled into Dongguang.',
  ],
  s0211: [
    'On day jisi, Muslim rebels again seized Qingyang as well as Ningzhou and Heshui; Magistrate Yang Binghua died.',
    'On jisi Muslim rebels retook Qingyang, Ningzhou, and Heshui; Magistrate Yang Binghua was killed.',
  ],
  s0212: [
    'On day xinwei, Du Xing\'a was appointed Imperial Commissioner to join Zuo Zongtang and Li Hongzhang in suppressing the Nian; Chunxi, Chen Guorui, Zhang Yao, and Song Qing\'s four armies were assigned, and Chonghou was ordered to assist military affairs.',
    'On xinwei Du Xing\'a was made commissioner to join Zuo Zongtang and Li Hongzhang against the Nian; four armies were assigned and Chonghou assisted.',
  ],
  s0213: [
    'Fifth month, day wuyin: Liu Songshan and other forces fought Zhang Zongyu at Yanshan and Haifeng and won a great victory.',
    'In month 5, wuyin, Liu Songshan routed Zhang Zongyu at Yanshan and Haifeng.',
  ],
  s0214: [
    'On day jimao, the Yangtze River flotilla was established, with regional commanders at Yuezhou, Hanyang, Hukou, and Guazhou.',
    'On jimao the Yangtze flotilla was set up with commanders at Yuezhou, Hanyang, Hukou, and Guazhou.',
  ],
  s0215: [
    'On day guiwei, Shaanxi forces repelled Muslim rebels raiding Bin and Feng.',
    'On guiwei Shaanxi forces repelled Muslim rebels from Bin and Feng.',
  ],
  s0216: [
    'On day renchen, Beishan bandits attacked Yan\'an; government troops were defeated and Deputy Commander Liu Wenhua and others were killed in battle.',
    'On renchen Beishan bandits hit Yan\'an; government troops lost and Liu Wenhua and others died.',
  ],
  s0217: [
    'On day gengzi, Yunnan forces recovered Yuanmou, Wuding, Luquan, and Luoci.',
    'On gengzi Yunnan forces recovered Yuanmou, Wuding, Luquan, and Luoci.',
  ],
  s0218: [
    'That month, arrears of tax were remitted for disturbed Huangzhou in Hunan.',
    'That month, Hunan Huangzhou arrears were remitted.',
  ],
  s0219: [
    'Sixth month, day jiwei: Guo Songlin and others fought the Nian at Linyi, Binzhou, and Yangxin and won a great victory.',
    'In month 6, jiwei, Guo Songlin routed the Nian at Linyi, Binzhou, and Yangxin.',
  ],
  s0220: [
    'An edict told the naval forces strictly to block the grain-transport defenses.',
    'Edict told the flotilla to guard the grain route strictly.',
  ],
  s0221: [
    'On day xinyou, Guangxi forces recovered Guishun.',
    'On xinyou Guangxi forces recovered Guishun.',
  ],
  s0222: [
    'On day guihai, gold bandits raided the Ningguta border; government troops pacified them.',
    'On guihai gold bandits raided Ningguta; government troops pacified them.',
  ],
  s0223: [
    'On day jiazi, Shaanxi forces took Yichuan.',
    'On jiazi Shaanxi forces took Yichuan.',
  ],
  s0224: [
    'On day bingyin, Zhang Zongyu attacked the grain-transport river banks; government troops defeated him and many Nian surrendered.',
    'On bingyin Zhang Zongyu hit the transport river; troops defeated him and many Nian surrendered.',
  ],
  s0225: [
    'On day wuchen, they attacked again at Shanghe and won a great victory.',
    'On wuchen they won again at Shanghe.',
  ],
  s0226: [
    'On day yihai, Li Yunlin was stripped of office for investigation.',
    'On yihai Li Yunlin was stripped for investigation.',
  ],
  s0227: [
    'Mingyao was ordered to serve as Office-in-Charge at Lake Bor.',
    'Mingyao was made Office-in-Charge at Lake Bor.',
  ],
  s0228: [
    'The Zhejiang seawall works were completed.',
    'Zhejiang seawall works were completed.',
  ],
  s0229: [
    'Autumn, seventh month, day dingchou: land tax was remitted in disturbed prefectures and counties of Zhili, Shandong, and Henan.',
    'In autumn month 7, dingchou, land tax was remitted in disturbed Zhili, Shandong, and Henan counties.',
  ],
  s0230: [
    'On day jimao, Chunshou was stripped of office for deception.',
    'On jimao Chunshou was stripped for deception.',
  ],
  s0231: [
    'On day renwu, refugees in Cangzhou and other places were given relief.',
    'On renwu Cangzhou and other refugees were relieved.',
  ],
  s0232: [
    'On day yiyou, Zhang Zongyu drowned himself and the Nian bandits were pacified.',
    'On yiyou Zhang Zongyu drowned and the Nian were pacified.',
  ],
  s0233: [
    'Li Hongzhang and Zuo Zongtang were given the rank of Grand Guardian of the Heir Apparent; Li, as Huguang governor, also assisted the Grand Secretariat; Ding Baozhen, Ying Han, and Chonghou were all given Junior Guardian of the Heir Apparent rank; Guan Wen\'s rank and plume were restored; Liu Mingchuan was advanced to first-class baron; Guo Songlin to first-class Commandant of Light Chariots; Song Qing and Shan Qing were granted second-class Commandant of Light Chariots; Liu Songshan received a yellow jacket and third-class Commandant of Light Chariots; Guo Baochang, Zhang Yao, and Wendelerci were granted Commandant of Cavalry; Huang Yisheng received one additional Cloud-Cavalry Commandant; Chen Guorui\'s hereditary provincial commander title was restored; the rest were promoted with distinctions.',
    'Li Hongzhang and Zuo Zongtang became Grand Guardians; Li also assisted the Grand Secretariat; Ding Baozhen, Ying Han, and Chonghou became Junior Guardians; Guan Wen\'s honors were restored; Liu Mingchuan became a baron; Guo Songlin a Commandant of Light Chariots; Song Qing and Shan Qing second-class Commandants; Liu Songshan got a yellow jacket; others were rewarded variously.',
  ],
  s0234: [
    'Prince Dun was ordered to offer sacrifice at the Ding Mausoleum.',
    'Prince Dun was ordered to sacrifice at the Ding Mausoleum.',
  ],
  s0235: [
    'Peng Yulin was allowed to return home to complete mourning.',
    'Peng Yulin was allowed home to finish mourning.',
  ],
  s0236: [
    'On day bingxu, Zuo Zongtang and Li Hongzhang were summoned to audience.',
    'On bingxu Zuo Zongtang and Li Hongzhang were summoned to court.',
  ],
  s0237: [
    'On day dinghai, the Rongze River burst its banks.',
    'On dinghai the Rongze River burst.',
  ],
  s0238: [
    'On day xinmao, Mao Changxi said military affairs were gradually calming and the court should think more of cautious reverence; soon Censor Zhang Xukai memorialized on preserving peace and holding to fullness and on studying in good time, and both were commended.',
    'On xinmao Mao Changxi urged caution as war eased; Censor Zhang Xukai then urged preserving peace and study, and both were praised.',
  ],
  s0239: [
    'On day renchen, Zuo Zongtang\'s request to send surrendered troops home with provisions was granted.',
    'On renchen Zuo Zongtang was allowed to send surrendered troops home.',
  ],
  s0240: [
    'On day guisi, the Wuzhi Qin River dike burst.',
    'On guisi the Wuzhi Qin River dike burst.',
  ],
  s0241: [
    'On day yiwei, Zeng Guofan was transferred to Zhili governor, Ma Xingyi to Liangjiang governor, and Ying Gui to Fujian-Zhejiang governor.',
    'On yiwei Zeng Guofan went to Zhili, Ma Xingyi to Liangjiang, and Ying Gui to Fujian-Zhejiang.',
  ],
  s0242: [
    'Peng Yulin was ordered to go to Jiangsu and Anhui to plan the Yangtze flotilla.',
    'Peng Yulin was sent to Jiangsu and Anhui to plan the Yangtze flotilla.',
  ],
  s0243: [
    'On day wuxu, an edict told Jiangsu, Anhui, Henan, and Shandong to repair dikes and stockades and organize local militia.',
    'On wuxu Jiangsu, Anhui, Henan, and Shandong were told to repair dikes and organize militia.',
  ],
  s0244: [
    'On day gengzi, the Song Neo-Confucian Yuan Xie was granted posthumous enshrinement in the Confucian temple.',
    'On gengzi Yuan Xie was enshrined in the Confucian temple.',
  ],
  s0245: [
    'Sichuan forces aiding Guizhou recovered Longli and Guiding.',
    'Sichuan relief troops recovered Longli and Guiding.',
  ],
  s0246: [
    'Sichuan troops fought Yi bandits in Yuexi, defeated them, and captured their chief Lewuli.',
    'Sichuan troops beat Yuexi Yi bandits and captured chief Lewuli.',
  ],
  s0247: [
    'Zeng Biguang was appointed Guizhou governor.',
    'Zeng Biguang became Guizhou governor.',
  ],
  s0248: [
    'On day xinchou, mutineers at Lake Bor fled to the Wulungu River.',
    'On xinchou Lake Bor mutineers fled to the Wulungu River.',
  ],
  s0249: [
    'Deleke Duoerji died.',
    'Deleke Duoerji died.',
  ],
  s0250: [
    'On day guimao, disaster victims in Xingyang and Zhengzhou were given relief.',
    'On guimao Xingyang and Zhengzhou disaster victims were relieved.',
  ],
  s0251: [
    'Gansu Muslims harassed Baishui and Heyang; Shaanxi forces repelled them.',
    'Gansu Muslims harassed Baishui and Heyang; Shaanxi troops drove them back.',
  ],
  s0252: [
    'On day jiachen, Hunan forces aiding Guizhou recovered Weng\'an.',
    'On jiachen Hunan relief troops recovered Weng\'an.',
  ],
  s0253: [
    'Eighth month, new moon on day yisi: Censor Detai was stripped of office for memorializing to repair the imperial gardens.',
    'In month 8, yisi new moon, Censor Detai was stripped for asking to repair the gardens.',
  ],
  s0254: [
    'Treasury guard Gui Xiang falsely claimed profit and was sent to Heilongjiang as a slave.',
    'Treasury guard Gui Xiang lied about profit and was banished to Heilongjiang as a slave.',
  ],
  s0255: [
    'The Yongding River burst its banks.',
    'The Yongding River burst.',
  ],
  s0256: [
    'On day jiyou, an edict told Mingyao and others to restore the old regulations at Lake Bor.',
    'On jiyou Mingyao and others were told to restore Lake Bor\'s old system.',
  ],
  s0257: [
    'Ma Xingyi was also ordered to serve as Commissioner for Foreign Trade Affairs.',
    'Ma Xingyi was also made Commissioner for Foreign Trade Affairs.',
  ],
  s0258: [
    'On day renzi, the Yan\'an bandit Hu Zhang surrendered.',
    'On renzi Yan\'an bandit Hu Zhang surrendered.',
  ],
  s0259: [
    'On day guihai, an edict told Zuo Zongtang also to oversee Shanxi military affairs.',
    'On guihai Zuo Zongtang was told also to oversee Shanxi military affairs.',
  ],
  s0260: [
    'On day wuchen, an edict told Jilin strictly to fix the boundaries of reclamation and enclosure.',
    'On wuchen Jilin was told to fix reclamation boundaries strictly.',
  ],
  s0261: [
    'On day xinwei, an edict told Jin Shun to specialize in military affairs for aiding Shaanxi.',
    'On xinwei Jin Shun was told to specialize in aiding Shaanxi.',
  ],
  s0262: [
    'That month, years of arrears were remitted in disturbed Anhui, Jiangsu, Shandong, Henan, and Hubei.',
    'That month, long arrears were remitted in disturbed Anhui, Jiangsu, Shandong, Henan, and Hubei.',
  ],
  s0263: [
    'Ninth month, day renwu: government troops recovered Qingyang.',
    'In month 9, renwu, government troops recovered Qingyang.',
  ],
  s0264: [
    'On day jiashen, Suzhou Muslims attacked Dunhuang and government troops repelled them.',
    'On jiashen Suzhou Muslims attacked Dunhuang and were repelled.',
  ],
  s0265: [
    'An edict told Yiletun and others to organize reclamation at Barkol.',
    'Edict told Yiletun and others to organize reclamation at Barkol.',
  ],
  s0266: [
    'On day yiyou, Sichuan forces aiding Guizhou jointly recovered Pingyue.',
    'On yiyou Sichuan relief troops jointly recovered Pingyue.',
  ],
  s0267: [
    'On day xinmao, Yanshu was ordered beyond the pass to investigate Fengtian border expansion.',
    'On xinmao Yanshu was sent beyond the pass to investigate Fengtian border expansion.',
  ],
  s0268: [
    'On day guisi, Yunnan forces recovered Jinning and Chenggong.',
    'On guisi Yunnan forces recovered Jinning and Chenggong.',
  ],
  s0269: [
    'That month, salt-furnace tax was remitted for poor harvests at Hengpu and other fields in Zhejiang.',
    'That month, Zhejiang Hengpu and other salt fields had furnace tax remitted.',
  ],
  s0270: [
    'Winter, tenth month, day dingwei: Muslim rebels attacked Jingzhou and Lingtai and were repelled.',
    'In winter month 10, dingwei, Muslim rebels hit Jingzhou and Lingtai and were repelled.',
  ],
  s0271: [
    'On day yimao, Wen Lin reached Hami and was ordered to establish reclamation at Chaibash Lake and other places.',
    'On yimao Wen Lin reached Hami and was told to open reclamation at Chaibash Lake and elsewhere.',
  ],
  s0272: [
    'On day bingchen, Mutushan took Hezhou.',
    'On bingchen Mutushan took Hezhou.',
  ],
  s0273: [
    'Relief was given for flood disaster in Jinan and Wuding.',
    'Jinan and Wuding flood victims were relieved.',
  ],
  s0274: [
    'On day dingsi, Li Yunlin was banished to Heilongjiang.',
    'On dingsi Li Yunlin was banished to Heilongjiang.',
  ],
  s0275: [
    'On day wuwu, Li Hongzao was ordered to continue duty at Hongde Hall and on the Grand Council.',
    'On wuwu Li Hongzao was told to continue at Hongde Hall and the Grand Council.',
  ],
  s0276: [
    'On day gengshen, for guarding Kobdo, Torghut Prince Ling Zhadonglubu was given princely rank.',
    'On gengshen Torghut Prince Ling Zhadonglubu was raised to prince for guarding Kobdo.',
  ],
  s0277: [
    'On day jisi, Guizhou Miao again seized Xingyi and soon recovered it.',
    'On jisi Guizhou Miao retook Xingyi and it was soon recovered.',
  ],
  s0278: [
    'Eleventh month, day jiaxu: Sichuan forces aiding Guizhou recovered Ma Ha.',
    'In month 11, jiaxu, Sichuan relief troops recovered Ma Ha.',
  ],
  s0279: [
    'On day dinghai, Liangzhou Commander Zhou Shengbo was stripped of office for failing to restrain his troops.',
    'On dinghai Liangzhou Commander Zhou Shengbo was stripped for lax discipline.',
  ],
  s0280: [
    'Muslim rebels harassed the Ordos and other banners and fled into Yulin.',
    'Muslim rebels harassed Ordos banners and fled into Yulin.',
  ],
  s0281: [
    'An edict told Ding An and others to intercept and suppress them.',
    'Edict told Ding An and others to intercept and suppress them.',
  ],
  s0282: [
    'On day renchen, an edict ordered the removal of accumulated abuses of clerks and runners.',
    'On renchen an edict ordered removal of clerk and runner abuses.',
  ],
  s0283: [
    'On day jihai, Guizhou troops took Duyun and Zhang Wende was rewarded with a yellow jacket.',
    'On jihai Guizhou troops took Duyun and Zhang Wende received a yellow jacket.',
  ],
  s0284: [
    'On day gengzi, the British consul in Taiwan let a foreign captain seize a ship, occupy the barracks, burn the offices, and extort military funds.',
    'On gengzi Taiwan\'s British consul let a foreign captain seize a ship, occupy barracks, burn offices, and extort troops\' pay.',
  ],
  s0285: [
    'The Zongli Yamen was ordered to investigate and Ying Gui and others were told to select officials to negotiate.',
    'The Zongli Yamen was told to investigate and Ying Gui and others to negotiate.',
  ],
  s0286: [
    'On day renyin, Rehe bandits were pacified.',
    'On renyin Rehe bandits were pacified.',
  ],
  s0287: [
    'Rent and tax were remitted for flooded fields at Shuangcheng Castle in Jilin.',
    'Jilin Shuangcheng Castle flooded fields had rent remitted.',
  ],
  s0288: [
    'Twelfth month, new moon on day jiachen: Sichuan troops fought Yi bandits at Xichang, won successive victories, and all Yi groups surrendered.',
    'In month 12, jiachen new moon, Sichuan troops beat Xichang Yi bandits and all Yi groups surrendered.',
  ],
  s0289: [
    'Hunan forces aiding Guizhou recovered Tianzhu.',
    'Hunan relief troops recovered Tianzhu.',
  ],
  s0290: [
    'On day bingwu, Muslim rebels attacked Baotou and Mongol troops were defeated.',
    'On bingwu Muslim rebels attacked Baotou and Mongol troops lost.',
  ],
  s0291: [
    'On day dingwei, the Rehe bandit leader Mile Sengge was executed.',
    'On dingwei Rehe bandit leader Mile Sengge was executed.',
  ],
  s0292: [
    'On day jiayin, following Zeng Guofan\'s memorial that Sichuan salt was harming Hubei, an edict ordered planning to stop Sichuan salt entering Chu, withdraw the bureaus, and halt the tax.',
    'On jiayin, after Zeng Guofan said Sichuan salt harmed Hubei, an edict ordered plans to stop Sichuan salt to Chu and end the tax bureaus.',
  ],
  s0293: [
    'On day dingsi, Yunnan forces recovered Chengjiang.',
    'On dingsi Yunnan forces recovered Chengjiang.',
  ],
  s0294: [
    'On day gengshen, an edict was reiterated to all provinces forbidding opium cultivation.',
    'On gengshen all provinces were again forbidden to grow opium.',
  ],
  s0295: [
    'On day renxu, Guizhou Miao raided Hechi and government troops repelled them.',
    'On renxu Guizhou Miao raided Hechi and were repelled.',
  ],
  s0296: [
    'On day yichou, an edict said those with three or more deferred capital sentences in the winter review should all have one grade reduced.',
    'On yichou those deferred three times or more in winter review were all reduced one grade.',
  ],
  s0297: [
    'The Yongding River works were completed.',
    'Yongding River works were completed.',
  ],
  s0298: [
    'On day wuchen, Qi Qing was dismissed and Qingchun was made Rehe governor-general.',
    'On wuchen Qi Qing was dismissed and Qingchun made Rehe governor-general.',
  ],
  s0299: [
    'On day gengwu, Liu Songshan fought bandits at Dalichuan and won a great victory.',
    'On gengwu Liu Songshan won a great victory at Dalichuan.',
  ],
  s0300: [
    'On day renshen, two hundred ten thousand taels of Hubei grain funds were diverted to relieve disaster in Henan.',
    'On renshen 210,000 taels of Hubei grain funds were diverted to relieve Henan.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_022_b03.mjs <translation.json>'
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
