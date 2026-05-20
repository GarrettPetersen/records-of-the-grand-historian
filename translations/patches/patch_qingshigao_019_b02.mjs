#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'On day xinmao, English ships entered Taiwan\'s harbor mouth; Da Hong\'a and others drove them off.',
    'On xinmao day, British ships entered Taiwan\'s harbor and Da Hong\'a drove them off.',
  ],
  s0102: [
    'Wang Delu was ordered to proceed to Taiwan for joint suppression.',
    'Wang Delu was sent to Taiwan for joint suppression.',
  ],
  s0103: [
    'That month, flood disaster relief was given to Hunan\'s Huarong county and Yuezhou Guard, and ten Jiangxi counties including Dehua.',
    'That month, Huarong and Yuezhou and ten Jiangxi counties including Dehua received flood relief.',
  ],
  s0104: [
    'Additional relief was given to disaster victims in nine Hubei prefectures and counties including Mianyang, Shanxi\'s Saragel Office, and fifteen Jiangsu counties and guards including Shangyuan; quota levies were also remitted.',
    'Extra relief went to Mianyang and eight other Hubei units, Saragel, and fifteen Jiangsu counties and guards including Shangyuan, with quota levies remitted.',
  ],
  s0105: [
    'Ration grain and housing funds were issued for flood disaster to twelve Anhui prefectures and counties including Wuwei; quota levies were also remitted.',
    'Wuwei and eleven other Anhui districts received flood rations and housing funds, with quota levies remitted.',
  ],
  s0106: [
    'Eleventh month, day gengwu: Cheng Yucai was ordered to act as Jiangsu governor.',
    'In month 11, gengwu, Cheng Yucai acted as Jiangsu governor.',
  ],
  s0107: [
    'Because of snow disaster among Qinghai\'s Yushu tribes, levied silver was remitted for two years.',
    'Yushu tribes\' snow disaster brought a two-year remission of levied silver.',
  ],
  s0108: [
    'On day wuyin, the English took Zhejiang\'s Yuyao county and again entered Cixi.',
    'On wuyin day, the British took Yuyao and re-entered Cixi.',
  ],
  s0109: [
    'That month, disaster victims in Jiangsu\'s Shangyuan and Jiangning counties received relief.',
    'That month, Shangyuan and Jiangning received disaster relief.',
  ],
  s0110: [
    'Twelfth month, day wuzi: Yan Bozhao was stripped of office; Yang Guozhen was made Min-Zhe governor-general.',
    'In month 12, wuzi, Yan Bozhao lost office and Yang Guozhen became Min-Zhe governor-general.',
  ],
  s0111: [
    'On day jichou, Liang Ehan was made Shanxi governor.',
    'On jichou day, Liang Ehan became Shanxi governor.',
  ],
  s0112: [
    'On day guisi, the English took Zhejiang\'s Fenghua county.',
    'On guisi day, the British took Fenghua.',
  ],
  s0113: [
    'On day renyin, bandit Zhong Renjie rebelled in Hubei\'s Chongyang county and took the county seat; Yu Tai and others were ordered to lead troops to suppress him.',
    'On renyin day, Zhong Renjie took Chongyang and Yu Tai was ordered to suppress him.',
  ],
  s0114: [
    'Cheng Yucai was made Jiangsu governor.',
    'Cheng Yucai became Jiangsu governor.',
  ],
  s0115: [
    'On day bingwu, English ships raided Zhejiang\'s Zhapu.',
    'On bingwu day, British ships raided Zhapu.',
  ],
  s0116: [
    'On day wushen, English ships raided Taiwan\'s Tamsui and Jilong; Da Hong\'a and others drove them off.',
    'On wushen day, British ships hit Tamsui and Jilong and Da Hong\'a drove them off.',
  ],
  s0117: [
    'That month, disaster victims in Jiangsu\'s Xinyang county received relief.',
    'That month, Xinyang received disaster relief.',
  ],
  s0118: [
    'Extended relief was given to disaster victims in six Henan counties including Xiangfu and ten Jiangsu counties including Shangyuan.',
    'Xiangfu and five other Henan counties and Shangyuan and nine other Jiangsu counties received extended relief.',
  ],
  s0119: [
    'Seed grain and ration loans were given to poor households in Henan\'s Suizhou and Zhecheng county; Huaining county granary grain was sold at fair price.',
    'Suizhou and Zhecheng poor received seed and ration loans and Huaining granary grain was sold fairly.',
  ],
  s0120: [
    'Overdue levies were deferred for twenty-two Jiangxi counties including Nanchang, and saltern duties at Zhejiang\'s Hengpu and Pudong posts.',
    'Nanchang and twenty-one other Jiangxi counties had overdue levies deferred, with Hengpu and Pudong saltern duties deferred.',
  ],
  s0121: [
    'That year, Korea, Ryukyu, and Nanzhang paid tribute.',
    'That year Korea, Ryukyu, and Nanzhang sent tribute.',
  ],
  s0122: [
    'In the twenty-second year, spring, first month, day bingchen: Yang Guozhen left office on illness; Yiliang was made Min-Zhe governor-general and Liang Baochang Guangdong governor.',
    'In year 22, month 1, bingchen, Yang Guozhen retired ill; Yiliang took Min-Zhe and Liang Baochang took Guangdong.',
  ],
  s0123: [
    'On day jiazi, Mukden General Qiying was transferred to Guangzhou general; Xi\'en acted for him.',
    'On jiazi day, Qiying moved from Mukden to Guangzhou general and Xi\'en acted.',
  ],
  s0124: [
    'On day jisi, Chongyang rebels took Tongshan; Yu Tai sent troops and defeated them.',
    'On jisi day, Chongyang rebels took Tongshan and Yu Tai defeated them.',
  ],
  s0125: [
    'On day dingchou, Hubei\'s Chongyang county was recovered and bandit chief Zhong Renjie was captured.',
    'On dingchou day, Chongyang was recovered and Zhong Renjie was captured.',
  ],
  s0126: [
    'That month, disaster relief was given to twelve Anhui prefectures, counties, and guards including Wuwei, six Fengtian districts including Liaoyang, and four offices and counties including Xinmin.',
    'That month, Wuwei and eleven other Anhui units, Liaoyang and five other Fengtian districts, and Xinmin and three other counties received relief.',
  ],
  s0127: [
    'Flood ration grain was issued to twenty-two Anhui prefectures, counties, and guards including Suzhou, and seven Zhejiang prefectures and counties including Haining.',
    'Suzhou and twenty-one other Anhui units and Haining and six other Zhejiang districts received flood rations.',
  ],
  s0128: [
    'Flood seed and ration loans were given to seven Jiangxi counties including Dehua, Hunan\'s Wuling county, nine Hubei counties and guards including Jiayu, five Shaanxi prefectures and counties including Jiazhou; poor-harvest granary grain at Shanxi\'s Saragel Office; and pay for troops at Jiangsu disaster-area camps including Jingyou.',
    'Flood seed loans went to Dehua and six other Jiangxi counties, Wuling, Jiayu and eight other Hubei units, five Shaanxi districts including Jiazhou, Saragel granary grain, and Jiangsu disaster-camp pay.',
  ],
  s0129: [
    'New and old quota levies for flood disaster were remitted or deferred at nine Zhejiang prefectures, counties, and guards including Haining.',
    'Haining and eight other Zhejiang districts had flood quota levies remitted or deferred.',
  ],
  s0130: [
    'Second month, day bingxu: Lin Zexu was ordered to remain banished at Yili.',
    'In month 2, bingxu, Lin Zexu was kept at Yili exile.',
  ],
  s0131: [
    'On day bingchen, Yijing and others attacked Ningbo without success.',
    'On bingchen day, Yijing\'s attack on Ningbo failed.',
  ],
  s0132: [
    'Yilibu was released to proceed to the Zhejiang army camp.',
    'Yilibu was freed to go to the Zhejiang camp.',
  ],
  s0133: [
    'Qiying was ordered to act as Hangzhou general.',
    'Qiying acted as Hangzhou general.',
  ],
  s0134: [
    'Wang Ding requested leave.',
    'Wang Ding took leave.',
  ],
  s0135: [
    'Qi Shen was again ordered to be staff commissioner to handle Zhejiang military affairs.',
    'Qi Shen again became staff commissioner for Zhejiang military affairs.',
  ],
  s0136: [
    'On day bingwu, Qiying was made Imperial Commissioner to hold Zhejiang\'s provincial city jointly with Te Yishun; Liu Yunke was ordered to join coastal defense; Yijing and others were charged to guard every coastal port.',
    'On bingwu day, Qiying became Imperial Commissioner to hold Hangzhou with Te Yishun; Liu Yunke joined defense; Yijing was charged to guard every coastal port.',
  ],
  s0137: [
    'That month, disaster victims at Mukden\'s Liaoyang and elsewhere and eight Jiangsu counties including Shangyuan received relief.',
    'That month, Liaoyang and other Mukden districts and Shangyuan and seven other Jiangsu counties received relief.',
  ],
  s0138: [
    'Third month, day renzi: the Emperor visited the Southern Park.',
    'In month 3, renzi, the Emperor visited the Southern Park.',
  ],
  s0139: [
    'On day guichou, the Emperor went on the hunt enclosure; the next day likewise.',
    'On guichou day, the Emperor hunted; the next day as well.',
  ],
  s0140: [
    'On day dingsi, the Emperor returned to Yuanming Garden.',
    'On dingsi day, the Emperor returned to Yuanming Garden.',
  ],
  s0141: [
    'Enteheng\'e died; Funiyang\'a was made Shaanxi-Gansu governor-general and Bichang Shaanxi governor.',
    'Enteheng\'e died; Funiyang\'a took Shaanxi-Gansu and Bichang took Shaanxi.',
  ],
  s0142: [
    'Qingchang was made Yili staff commissioner.',
    'Qingchang became Yili staff commissioner.',
  ],
  s0143: [
    'That month, overdue levies on waterlogged land at Henan\'s Zhengzhou were remitted or deferred.',
    'That month, Zhengzhou\'s waterlogged land had overdue levies remitted or deferred.',
  ],
  s0144: [
    'Summer, fourth month, day guiwei: the English again raided Taiwan; Da Hong\'a and others drove them off.',
    'In summer, month 4, guiwei, the British raided Taiwan again and Da Hong\'a drove them off.',
  ],
  s0145: [
    'Da Hong\'a was given the additional title Grand Guardian of the Heir Apparent.',
    'Da Hong\'a received the additional title Grand Guardian of the Heir Apparent.',
  ],
  s0146: [
    'On day jichou, the English left Ningbo prefecture.',
    'On jichou day, the British left Ningbo.',
  ],
  s0147: [
    'On day jiawu, the Emperor went to the Black Dragon Pool shrine to pray for rain.',
    'On jiawu day, the Emperor prayed for rain at the Black Dragon Pool shrine.',
  ],
  s0148: [
    'On day yiwei, the English took Zhejiang\'s Zhapu; Subprefect Wei Fengjia died.',
    'On yiwei day, the British took Zhapu and Wei Fengjia was killed.',
  ],
  s0149: [
    'On day gengzi, Yu Buyun was stripped of office and arrested for interrogation.',
    'On gengzi day, Yu Buyun lost office and was arrested.',
  ],
  s0150: [
    'On day bingwu, Zhong Renjie was executed.',
    'On bingwu day, Zhong Renjie was executed.',
  ],
  s0151: [
    'That month, seed and ration loans were given to Hunan\'s Fenghuang and four other offices and counties for garrison households and Miao tenants; granary grain was loaned to fourteen Shanxi prefectures and counties including Jizhou.',
    'That month, Fenghuang and four other Hunan districts received seed loans for garrison and Miao tenants, and Jizhou and thirteen other Shanxi districts received granary loans.',
  ],
  s0152: [
    'Overdue grain levies were deferred at Shanxi\'s Yangqu county and Saragel Office.',
    'Yangqu and Saragel had overdue grain levies deferred.',
  ],
  s0153: [
    'Fifth month, day jiyou: Grand Secretary Wang Ding died suddenly.',
    'In month 5, jiyou, Grand Secretary Wang Ding died suddenly.',
  ],
  s0154: [
    'On day bingchen, Tang Jinzhao was demoted to Director of the Court of Imperial Entertainments.',
    'On bingchen day, Tang Jinzhao was demoted to Court of Imperial Entertainments director.',
  ],
  s0155: [
    'On day dingsi, Tang Jinzhao requested retirement; it was granted.',
    'On dingsi day, Tang Jinzhao retired.',
  ],
  s0156: [
    'On day wuwu, Yishan lost the post of Left Censor-in-chief for false memorials; Qi and Liang Baochang were stripped of office but kept on.',
    'On wuwu day, Yishan lost Left Censor-in-chief rank for false memorials; Qi and Liang Baochang lost rank but stayed on.',
  ],
  s0157: [
    'On day jiwei, Minister of Rites Sekejin\'e died; En Gui replaced him.',
    'On jiwei day, Sekejin\'e died and En Gui took Rites.',
  ],
  s0158: [
    'Jiluntai was made Minister of the Court of Colonial Affairs.',
    'Jiluntai became colonial affairs minister.',
  ],
  s0159: [
    'Kuizhao was made Left Censor-in-chief.',
    'Kuizhao became Left Censor-in-chief.',
  ],
  s0160: [
    'On day renxu, the English took Jiangsu\'s Baoshan county; Regional Commander Chen Huacheng died.',
    'On renxu day, the British took Baoshan and Chen Huacheng was killed.',
  ],
  s0161: [
    'Qiying and Yilibu were ordered to Jiangsu to join Niu Jian in coastal defense and suppression.',
    'Qiying and Yilibu were sent to Jiangsu to join Niu Jian in defense.',
  ],
  s0162: [
    'On day dingmao, the English took Shanghai county; Clerk Yang Qing\'en died.',
    'On dingmao day, the British took Shanghai and Yang Qing\'en was killed.',
  ],
  s0163: [
    'Saishang\'a was made Imperial Commissioner to join Ne\'erjing\'e in defense and suppression.',
    'Saishang\'a became Imperial Commissioner with Ne\'erjing\'e for defense.',
  ],
  s0164: [
    'That month, poor-harvest seed loans were given to Jiangsu\'s Shanyang county and two counties and guards at Huai\'an.',
    'That month, Shanyang and two Huai\'an counties and guards received poor-harvest seed loans.',
  ],
  s0165: [
    'Sixth month, new moon on day wuyin: solar eclipse.',
    'In month 6, wuyin new moon, there was a solar eclipse.',
  ],
  s0166: [
    'New and old quota levies were remitted or deferred for five Hubei counties and guards including Chongyang disturbed by bandits.',
    'Chongyang and four other Hubei units disturbed by bandits had quota levies remitted or deferred.',
  ],
  s0167: [
    'On day xinmao, Wen Qing was made Urga commissioner.',
    'On xinmao day, Wen Qing became Urga commissioner.',
  ],
  s0168: [
    'On day renchen, new and old quota levies were remitted or deferred for twelve Zhejiang counties including Dinghai that had been disturbed.',
    'On renchen day, Dinghai and eleven other disturbed Zhejiang counties had quota levies remitted or deferred.',
  ],
  s0169: [
    'On day guisi, English ships raided Jingkou.',
    'On guisi day, British ships raided Jingkou.',
  ],
  s0170: [
    'On day bingchen, English ships raided Zhenjiang; Qi Shen and others fled.',
    'On bingchen day, British ships raided Zhenjiang and Qi Shen fled.',
  ],
  s0171: [
    'On day dingyou, the English took Zhenjiang; Vice Commander-in-chief Hailing died.',
    'On dingyou day, the British took Zhenjiang and Hailing was killed.',
  ],
  s0172: [
    'Autumn, seventh month, day jiayin: English ships raided Jiangning provincial city.',
    'In autumn, month 7, jiayin, British ships raided Nanjing.',
  ],
  s0173: [
    'Yilibu and others were ordered to negotiate terms.',
    'Yilibu and others were told to negotiate terms.',
  ],
  s0174: [
    'Yijing was ordered to advance and station at Changzhou.',
    'Yijing was ordered to station at Changzhou.',
  ],
  s0175: [
    'On day jiwei, Qiying memorialized that he had discussed ceasefire with British officers including Morrison.',
    'On jiwei day, Qiying reported ceasefire talks with Morrison and other British officers.',
  ],
  s0176: [
    'An edict said, "We place the people\'s lives foremost," and ordered the agreement settled properly.',
    'The court said it put the people first and ordered the agreement settled properly.',
  ],
  s0177: [
    'On day guihai, Qiying and others asked to fix a treaty with British officers; the imperial seal was applied.',
    'On guihai day, Qiying asked to seal a treaty with British officers.',
  ],
  s0178: [
    'An edict said, "We act for the countless lives at stake," and granted the request.',
    'The court cited countless lives at stake and granted the request.',
  ],
  s0179: [
    'On day gengwu, the Jiangnan Taobei Office river breached.',
    'On gengwu day, the Jiangnan Taobei Office river broke.',
  ],
  s0180: [
    'That month, earthquake disaster relief was given at Barkul.',
    'That month, Barkul received earthquake relief.',
  ],
  s0181: [
    'Eighth month, day wuyin: Qiying memorialized that at Guangzhou, Fuzhou, Xiamen, Ningbo, and Shanghai treaty ports trade with Britain had been agreed.',
    'In month 8, wuyin, Qiying reported treaty trade at Guangzhou, Fuzhou, Xiamen, Ningbo, and Shanghai.',
  ],
  s0182: [
    'On day wuzi, Lin Qing lost office for negligence in river defense but remained in post.',
    'On wuzi day, Lin Qing lost rank for river negligence but stayed on.',
  ],
  s0183: [
    'Jingzheng and Liao Hongquan were ordered to Jiangnan to survey river works.',
    'Jingzheng and Liao Hongquan were sent to Jiangnan to survey river works.',
  ],
  s0184: [
    'That month, earthquake rebuilding funds were loaned at Barkul.',
    'That month, Barkul received earthquake rebuilding loans.',
  ],
  s0185: [
    'Ninth month, day dingwei: Shen Qi requested mourning leave to care for a parent; it was granted.',
    'In month 9, dingwei, Shen Qi was granted mourning leave.',
  ],
  s0186: [
    'Li Zongfang was made Left Censor-in-chief.',
    'Li Zongfang became Left Censor-in-chief.',
  ],
  s0187: [
    'On day jiyou, Xi\'en was appointed Mukden general.',
    'On jiyou day, Xi\'en became Mukden general.',
  ],
  s0188: [
    'On day wuwu, Zhu Shu requested mourning leave; it was granted.',
    'On wuwu day, Zhu Shu was granted mourning leave.',
  ],
  s0189: [
    'Zhou Tianjue was ordered to act as Grand Canal transport governor-general with second-rank hat button.',
    'Zhou Tianjue acted as canal transport governor-general with second-rank button.',
  ],
  s0190: [
    'On day jiwei, Liang-Jiang governor-general Niu Jian was stripped and arrested; Qiying replaced him.',
    'On jiwei day, Niu Jian was stripped and arrested and Qiying took Liang-Jiang.',
  ],
  s0191: [
    'Yishan was summoned to the capital.',
    'Yishan was called to Beijing.',
  ],
  s0192: [
    'Yilibu was made Imperial Commissioner and Guangzhou general to handle aftermath affairs.',
    'Yilibu became Imperial Commissioner and Guangzhou general for aftermath affairs.',
  ],
  s0193: [
    'On day xinyou, Grand Canal-East transport governor-general Zhu Xiang died; Huicheng acted for him.',
    'On xinyou day, Zhu Xiang died and Huicheng acted as canal-east transport.',
  ],
  s0194: [
    'On day guihai, Yijing and Wen Wei were summoned to the capital.',
    'On guihai day, Yijing and Wen Wei were called to Beijing.',
  ],
  s0195: [
    'Qi Shen was ordered back to Sichuan as regional commander.',
    'Qi Shen returned to Sichuan as regional commander.',
  ],
  s0196: [
    'On day jiaxu, Yilibu was ordered to negotiate treaty-port tax matters.',
    'On jiaxu day, Yilibu was told to negotiate treaty-port taxes.',
  ],
  s0197: [
    'On day yihai, Bichang was transferred to Fuzhou general; Li Xingyuan was made Shaanxi governor.',
    'On yihai day, Bichang took Fuzhou general and Li Xingyuan took Shaanxi.',
  ],
  s0198: [
    'Winter, tenth month, day gengchen: the Emperor reviewed Eight Banner musketeers at Yuanming Garden.',
    'In winter, month 10, gengchen, the Emperor reviewed Yuanming Garden musketeers.',
  ],
  s0199: [
    'On day bingxu, Yishan, Yijing, and Wen Wei were handed to the Ministry of Punishments for trial; Te Yishun and Qi Shen were referred to the ministries for severe deliberation.',
    'On bingxu day, Yishan, Yijing, and Wen Wei went to Punishments; Te Yishun and Qi Shen faced severe review.',
  ],
  s0200: [
    'On day gengyin, new and old quota levies were reduced or remitted by grade for forty Jiangsu coastal offices, prefectures, counties, and guards including Taicang that had suffered war.',
    'On gengyin day, Taicang and thirty-nine other war-hit Jiangsu coastal districts had quota levies reduced or remitted by grade.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_019_b02.mjs <translation.json>'
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
