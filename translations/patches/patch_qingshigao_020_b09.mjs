#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0801: [
    'On day renyin, Xiangyang-Fancheng rebels attacked Dengzhou.',
    'On renyin day, Xiang-Fan rebels struck Dengzhou.',
  ],
  s0802: [
    'Henan rebels from Xiayi moved to harass Xuzhou.',
    'Henan raiders from Xiayi pressed toward Xuzhou.',
  ],
  s0803: [
    'On day jiachen, Zhejiang government troops again recovered Xiuning.',
    'On jiachen day, Zhejiang forces retook Xiuning.',
  ],
  s0804: [
    'Former governor Zhang Fei was granted third-rank grand secretary rank.',
    'Ex-governor Zhang Fei received third-rank grand secretary rank.',
  ],
  s0805: [
    'On day dingwei, the Right River garrison of Guangxi mutinied; Lao Chongguang suppressed it.',
    'On dingwei day, Guangxi\'s Right River garrison mutinied and Lao Chongguang put it down.',
  ],
  s0806: [
    'On day renzi, He Guiqing memorialized that Zhejiang troops had taken Yi county and Huizhou was cleared.',
    'On renzi day, He Guiqing reported Yi county taken and Huizhou pacified.',
  ],
  s0807: [
    'Shao Can memorialized that government troops had beaten back Nian bandits and the siege of Xuzhou was lifted.',
    'Shao Can reported Nian bandits driven off and Xuzhou relieved.',
  ],
  s0808: [
    'Changqing was made Ili general.',
    'Changqing became Ili general.',
  ],
  s0809: [
    'Eleventh month, new moon day yimao: the Veritable Record of the Xuanzong Emperor was completed.',
    'In the eleventh month, on the new moon yimao, the Xuanzong Veritable Record was finished.',
  ],
  s0810: [
    'Peng Yunzhang was made Grand Secretary; Weng Xincun was made cooperating Grand Secretary; Xu Naipu was made Minister of Works; Zhu Yun was made Left Censor-in-Chief.',
    'Peng Yunzhang became Grand Secretary, Weng Xincun cooperating secretary, Xu Naipu works minister, and Zhu Yun left censor-in-chief.',
  ],
  s0811: [
    'On day xinyou, Yunnan government troops recovered Yao prefecture.',
    'On xinyou day, Yunnan forces retook Yao prefecture.',
  ],
  s0812: [
    'On day yichou, Wenchang was promoted to middle sacrifice rank.',
    'On yichou day, Wenchang was raised to middle sacrifice.',
  ],
  s0813: [
    'Zheng Kuishi was ordered to move his army to join Ying Gui in suppressing Nian bandits; Qin Dingsan was to join Fu Ji in suppressing Anhui bandits.',
    'Zheng Kuishi was sent to join Ying Gui against the Nian, and Qin Dingsan to join Fu Ji against Anhui rebels.',
  ],
  s0814: [
    'On day bingyin, Shengbao was ordered to proceed to the Anhui army camp.',
    'On bingyin day, Shengbao was ordered to the Anhui front.',
  ],
  s0815: [
    'On day xinwei, Grand Secretary Wenqing died.',
    'On xinwei day, Grand Secretary Wenqing died.',
  ],
  s0816: [
    'The English at Guangdong used ship inspection as a pretext for trouble and fired on the city.',
    'At Guangdong the British provoked a clash over ship searches and shelled the city.',
  ],
  s0817: [
    'Gentry militia angrily attacked them and killed several hundred.',
    'Local gentry forces struck back and killed hundreds.',
  ],
  s0818: [
    'An edict ordered Ye Mingchen to handle matters as circumstances required.',
    'Ye Mingchen was told to manage the affair as he saw fit.',
  ],
  s0819: [
    'On day renshen, Bo Shu was made Grand Councilor.',
    'On renshen day, Bo Shu joined the Grand Council.',
  ],
  s0820: [
    'On day yihai, Jiangxi rebels took Fuzhou.',
    'On yihai day, Jiangxi rebels captured Fuzhou.',
  ],
  s0821: [
    'On day wuyin, Hunan army circuit intendant Liu Changyou successively recovered Yuanzhou and Fenyi in Jiangxi; he was given the rank of surveillance commissioner, his parents a third-rank enfeoffment patent, and Governor Luo Bingzhang a peacock feather.',
    'On wuyin day, Liu Changyou retook Jiangxi\'s Yuanzhou and Fenyi, received surveillance commissioner rank and honors for his parents, and Luo Bingzhang a peacock feather.',
  ],
  s0822: [
    'Ying Gui memorialized that the bandit nest at Zhiheji had been stormed.',
    'Ying Gui reported the Zhiheji bandit lair taken.',
  ],
  s0823: [
    'On day gengchen, the Emperor went in person to Grand Secretary Wenqing\'s residence to offer condolence sacrifices.',
    'On gengchen day, the Emperor personally mourned at Wenqing\'s home.',
  ],
  s0824: [
    'On day renwu, Hu Linyi recovered Wuchang; on day guiwei, Guan Wen recovered Hanyang; both received commendatory edicts.',
    'On renwu day Hu Linyi retook Wuchang and on guiwei Guan Wen retook Hanyang, each praised by edict.',
  ],
  s0825: [
    'Guizhou troops stormed and took Duyun.',
    'Guizhou forces captured Duyun.',
  ],
  s0826: [
    'Twelfth month, day yiyou: Hubei government troops stormed and took Laohekou.',
    'In the twelfth month, on yiyou day, Hubei forces took Laohekou.',
  ],
  s0827: [
    'On day bingxu, the Emperor prayed for snow.',
    'On bingxu day, the Emperor prayed for snow.',
  ],
  s0828: [
    'On day wuzi, Prince Su Hua Feng was made inner grand minister.',
    'On wuzi day, Prince Su Hua Feng became an inner grand minister.',
  ],
  s0829: [
    'On day jichou, an edict said: "Hubei has repeatedly been occupied by bandits; the common soldiers and people, survivors of war and slaughter, bear wounds that call for pity.',
    'On jichou day the court said: "Hubei has been ravaged by rebels; soldiers and civilians left alive deserve compassion.',
  ],
  s0830: [
    'Now that Wuhan has been recovered, relief for the people\'s suffering must be urgent.',
    'With Wuhan restored, the people\'s hardships must be eased at once.',
  ],
  s0831: [
    'Grain taxes are to be remitted or deferred by category; how disaster victims are to be comforted—plan quickly and report."',
    'Remit or defer taxes by case and report quickly how the afflicted are to be relieved."',
  ],
  s0832: [
    'Hubei government troops successively recovered Wuchang county and Huangzhou prefectural city.',
    'Hubei forces then retook Wuchang county and Huangzhou city.',
  ],
  s0833: [
    'On day jiawu, Hu Linyi memorialized on Hubei military affairs and civil administration.',
    'On jiawu day, Hu Linyi reported on Hubei army and government.',
  ],
  s0834: [
    'An edict said: "Since you truly have definite views, you should carry them out in earnest."',
    'The court replied: "Where you have clear views, put them into practice."',
  ],
  s0835: [
    'On day bingshen, Guan Wen memorialized on suppressing bandits in Suizhou; the bandit chiefs were captured.',
    'On bingshen day, Guan Wen reported Suizhou bandits suppressed and their leaders taken.',
  ],
  s0836: [
    'Further reports said government troops had successively recovered Xingguo, Daye, Qishui, Qizhou, and Guangji.',
    'Further word came that Xingguo, Daye, Qishui, Qizhou, and Guangji had been retaken.',
  ],
  s0837: [
    'On day xinchou, Anhui and Zhejiang government troops recovered Ningguo; He Guiqing was granted a peacock feather.',
    'On xinchou day, Anhui and Zhejiang forces retook Ningguo and He Guiqing received a peacock feather.',
  ],
  s0838: [
    'On day guimao, because Hunan government troops had exterminated bandits in Chongyang and Tongcheng, Hubei, candidate circuit intendant Wang Zhen was given surveillance commissioner rank.',
    'On guimao day, Wang Zhen received surveillance commissioner rank for clearing Chong and Tong bandits in Hubei.',
  ],
  s0839: [
    'On day jiachen, Guan Wen memorialized that government troops at Jiujiang had burned rebel boats.',
    'On jiachen day, Guan Wen reported rebel shipping burned at Jiujiang.',
  ],
  s0840: [
    'An edict ordered Zeng Guofan to urge his officers and men to advance from the lake onto the river so that joint suppression might be effected.',
    'Zeng Guofan was told to drive his forces from the lake to the Yangtze for a combined campaign.',
  ],
  s0841: [
    'On day wushen, Shandong government troops killed and destroyed Nian chieftain Wang Fangyun.',
    'On wushen day, Shandong forces killed Nian leader Wang Fangyun.',
  ],
  s0842: [
    'Hubei government troops recovered Huangmei.',
    'Hubei forces retook Huangmei.',
  ],
  s0843: [
    'On day jiyou, Gui Liang was made Grand Secretary and Bo Shu cooperating Grand Secretary.',
    'On jiyou day, Gui Liang became Grand Secretary and Bo Shu cooperating secretary.',
  ],
  s0844: [
    'Tan Tingxiang was made Zhili governor-general; Zeng Wangyan was made Shaanxi governor.',
    'Tan Tingxiang took Zhili and Zeng Wangyan Shaanxi.',
  ],
  s0845: [
    'On day renzi, joint sacrifice was performed at the Imperial Ancestral Temple.',
    'On renzi day, the court held joint ancestral sacrifice.',
  ],
  s0846: [
    'That year, quota levies were remitted for one hundred sixty-five prefectures and counties in Zhili, Jiangsu, Shandong, Shanxi, Henan, Hunan, Guizhou, and other provinces stricken by disaster or bandits; Jiangsu\'s six salterns also had salt levies remitted in varying degrees.',
    'That year 165 disaster- and bandit-stricken districts in several provinces had taxes remitted, and six Jiangsu salterns received salt-tax relief.',
  ],
  s0847: [
    'Korea sent tribute.',
    'Korea presented tribute.',
  ],
  s0848: [
    'Seventh year, day dingsi, spring, first month, day gengwu: Yiliang memorialized that Fu Zhenbang had recovered Gaochun and Zhang Guoliang was advancing on Jurong.',
    'In year 7, spring month 1, gengwu, Yiliang reported Fu Zhenbang\'s recovery of Gaochun and Zhang Guoliang\'s advance on Jurong.',
  ],
  s0849: [
    'He Guiqing memorialized that Zhejiang was sending relief columns while defending its own territory and protecting neighboring circuits.',
    'He Guiqing reported Zhejiang aiding neighbors while holding its own ground.',
  ],
  s0850: [
    'An edict praised and rewarded them.',
    'The court praised and rewarded them.',
  ],
  s0851: [
    'Quanqing was transferred as Minister of War; Wencai as Minister of Works; Sushun as Left Censor-in-Chief.',
    'Quanqing took war, Wencai works, and Sushun the left censorate.',
  ],
  s0852: [
    'Bandits in Taiping prefecture, Guangxi, were pacified.',
    'Guangxi\'s Taiping prefecture bandits were pacified.',
  ],
  s0853: [
    'On day bingzi, Xiling\'a and Chong\'an were recalled to the capital.',
    'On bingzi day, Xiling\'a and Chong\'an were recalled.',
  ],
  s0854: [
    'Shengbao was given vice censor-in-chief rank to assist in suppressing bandit affairs.',
    'Shengbao received vice censor rank to help suppress bandits.',
  ],
  s0855: [
    'Wang Lvqian returned to his native place; Li Jun was ordered to take over river defense.',
    'Wang Lvqian went home and Li Jun took charge of river defense.',
  ],
  s0856: [
    'On day jimao, Ye Mingchen memorialized victory in defending against and suppressing the English.',
    'On jimao day, Ye Mingchen reported victory over the British.',
  ],
  s0857: [
    'An edict said: "Controlling foreign barbarians is not comparable to the interior.',
    'The court said: "Managing foreigners is not like governing inland provinces.',
  ],
  s0858: [
    'The Dinghai affair of old may serve as a warning.',
    'The earlier Dinghai episode should be a warning.',
  ],
  s0859: [
    'You must manipulate matters suitably and not leave regrets; I shall not control you from afar."',
    'Handle them skillfully and avoid regret; I will not micromanage from afar."',
  ],
  s0860: [
    'Governors-general and governors of Jiangsu, Zhili, Fujian, and Zhejiang were informed.',
    'The order went to the Jiangsu, Zhili, Fujian, and Zhejiang governors.',
  ],
  s0861: [
    '"',
    'So ordered.',
  ],
  s0862: [
    'Second month, day yiyou: Zeng Guofan memorialized the recovery of Jianchang.',
    'In the second month, on yiyou day, Zeng Guofan reported Jianchang recovered.',
  ],
  s0863: [
    'On day bingxu, the Emperor attended the classics lecture.',
    'On bingxu day, the Emperor held court lecture on the classics.',
  ],
  s0864: [
    'On day xinmao, Hubei government troops recovered Yichang.',
    'On xinmao day, Hubei forces retook Yichang.',
  ],
  s0865: [
    'On day jiawu, Yunnan Binchuan Hui bandits rebelled.',
    'On jiawu day, Hui rebels rose at Yunnan\'s Binchuan.',
  ],
  s0866: [
    'On day jiachen, Hubei rebels took Yuan\'an and Jingmen; government troops drove them off.',
    'On jiachen day, Hubei rebels seized Yuan\'an and Jingmen but were beaten back.',
  ],
  s0867: [
    'On day dingwei, Anhui bandits advanced to attack Huangmei; Du Xing\'a defeated them.',
    'On dingwei day, Anhui rebels pressed Huangmei and Du Xing\'a repulsed them.',
  ],
  s0868: [
    'Anhui bandits took Lu\'an.',
    'Anhui rebels captured Lu\'an.',
  ],
  s0869: [
    'On day renzi, Ying Gui and Shengbao memorialized on suppressing Nian bandits, recapturing Wulongji, and advancing against Gushi.',
    'On renzi day, Ying Gui and Shengbao reported Nian bandits beaten, Wulongji retaken, and an advance on Gushi.',
  ],
  s0870: [
    'Third month, new moon day guisi: Zeng Guofan entered mourning for his father; leave was granted to observe mourning, and Yang Zaifu was ordered temporarily to command the navy with Peng Yulin as his deputy.',
    'In the third month, on the new moon guisi, Zeng Guofan mourned his father; Yang Zaifu commanded the fleet and Peng Yulin assisted.',
  ],
  s0871: [
    'On day bingchen, Hubei government troops Tang Xunfang and Bayanga suppressed southern Zhang bandits, defeated them, and bandit chief Liu Shangyi surrendered.',
    'On bingchen day, Tang Xunfang and Bayanga defeated southern Zhang bandits and Liu Shangyi surrendered.',
  ],
  s0872: [
    'Guizhou provincial commander-in-chief Xiaoshun\'s troops were routed at Duyun and he died.',
    'Guizhou commander Xiaoshun was defeated at Duyun and killed.',
  ],
  s0873: [
    'On day jiwei, Xiang-Fan rebels took Neixiang in Henan; government troops struck and recovered it.',
    'On jiwei day, Xiang-Fan rebels took Neixiang but government troops retook it.',
  ],
  s0874: [
    'An edict ordered Yiliang: "Secretly investigate whether Zhang Guoliang and Hechun are at odds in opinion.',
    'Yiliang was told: "Secretly find out whether Zhang Guoliang and Hechun disagree.',
  ],
  s0875: [
    'Command of an army depends wholly on winning men\'s hearts; if control is poor and able generals refuse to exert themselves, the harm is no light matter."',
    'An army lives on loyalty; if command fails and good officers hold back, the damage is grave."',
  ],
  s0876: [
    'On day guihai, the Emperor plowed the sacred field.',
    'On guihai day, the Emperor performed the plowing rite.',
  ],
  s0877: [
    'On day dingmao, Qiling was made Jiangxi governor.',
    'On dingmao day, Qiling became Jiangxi governor.',
  ],
  s0878: [
    'On day gengwu, merit in recovering Wuhan was recorded; assistant banner commander Duolong\'a was employed as vice censor-in-chief.',
    'On gengwu day, Wuhan recovery honors went out and Duolong\'a received vice censor rank.',
  ],
  s0879: [
    'On day xinwei, Hengchun memorialized that Hui rebels were spreading disturbance and commanders were lacking; he asked that Zhenyangguan garrison commander Wang Guocai be transferred to Yunnan to assist suppression, and assent was given.',
    'On xinwei day, Hengchun reported Hui unrest and shortage of officers; Wang Guocai was transferred to Yunnan to help.',
  ],
  s0880: [
    'On day renshen, Jiangxi government troops attacked Jingdezhen without success; battalion commander Bi Jinke died in battle, and Liu Changyou was again defeated at Xinyu.',
    'On renshen day, Jiangxi forces failed at Jingdezhen; Bi Jinke fell and Liu Changyou lost again at Xinyu.',
  ],
  s0881: [
    'On day xinsi, bandits in Hengzhou, Guangxi, made trouble; Guangdong government troops suppressed them.',
    'On xinsi day, Guangxi Hengzhou bandits rose and Guangdong forces suppressed them.',
  ],
  s0882: [
    'Ye Mingchen memorialized that English ships had withdrawn from the provincial river.',
    'Ye Mingchen reported British ships had left the provincial river.',
  ],
  s0883: [
    'An edict said: "You should always quell this quarrel and must not let border trouble arise."',
    'The court said: "End the quarrel and do not let it become a frontier war."',
  ],
  s0884: [
    '"',
    'So ordered.',
  ],
  s0885: [
    'Summer, fourth month, day jiashen: Hengchun memorialized that western Yunnan Hui bandits had surrendered.',
    'In the fourth month, on jiashen day, Hengchun reported western Yunnan Hui rebels had submitted.',
  ],
  s0886: [
    'Deleke duo\'erji memorialized that Russia asked to send envoys to the capital; an edict forbade it.',
    'Deleke duo\'erji reported a Russian request for envoys to Beijing; the court refused.',
  ],
  s0887: [
    'On day dinghai, Jiangxi rebels fled into Fujian and took Shaowu and Guangze.',
    'On dinghai day, Jiangxi rebels entered Fujian and captured Shaowu and Guangze.',
  ],
  s0888: [
    'On day guisi, Yiliang was dismissed for illness; He Guiqing was made Liang-Jiang governor-general.',
    'On guisi day, Yiliang left office for illness and He Guiqing became Liang-Jiang governor-general.',
  ],
  s0889: [
    'On day yiwei, Guizhou rebels took Yongcong.',
    'On yiwei day, Guizhou rebels captured Yongcong.',
  ],
  s0890: [
    'On day dingyou, Hunan relief army commander Liu Changyou stormed and took Xinyu in Jiangxi.',
    'On dingyou day, Liu Changyou\'s Hunan relief force retook Jiangxi\'s Xinyu.',
  ],
  s0891: [
    'Fifth month, day bingchen: Saying\'a died; Liu Zheng acted as Xi\'an general.',
    'In the fifth month, on bingchen day, Saying\'a died and Liu Zheng acted as Xi\'an general.',
  ],
  s0892: [
    'Hubei government troops recovered Fengxin, Jing\'an, and Anyi in Jiangxi.',
    'Hubei forces retook Jiangxi\'s Fengxin, Jing\'an, and Anyi.',
  ],
  s0893: [
    'On day guihai, Li Mengqun memorialized on going to relieve Luzhou and recovering Yingshan.',
    'On guihai day, Li Mengqun reported marching to Luzhou and retaking Yingshan.',
  ],
  s0894: [
    'Fujian rebels took Tingzhou.',
    'Fujian rebels captured Tingzhou.',
  ],
  s0895: [
    'On day bingzi, Deleke duo\'erji memorialized that the Russian envoy came to the capital by way of Tianjin; Tan Tingxiang was ordered to detain him tactfully.',
    'On bingzi day, Deleke duo\'erji reported a Russian envoy via Tianjin; Tan Tingxiang was to detain him diplomatically.',
  ],
  s0896: [
    'Intercalary fifth month, day jiashen: Hechun memorialized the recovery of Lishui.',
    'In the intercalary fifth month, on jiashen day, Hechun reported Lishui recovered.',
  ],
  s0897: [
    'On day yiyou, Zeng Guofan memorialized asking to observe full mourning; a warm edict detained him and still ordered him to hurry to Jiangxi to take command.',
    'On yiyou day, Zeng Guofan asked for full mourning but was kept in service and told to hurry to Jiangxi.',
  ],
  s0898: [
    'On day gengyin, Yunnan Wuding prefecture Hui bandits made trouble; government troops suppressed them.',
    'On gengyin day, Hui rebels at Yunnan\'s Wuding rose and government troops put them down.',
  ],
  s0899: [
    'Li Mengqun memorialized defeating Huoqiu raiding bandits; an edict praised and rewarded him.',
    'Li Mengqun reported victory over Huoqiu raiders and received praise.',
  ],
  s0900: [
    'On day dingyou, Shengbao attacked Zhengyang Pass without success; circuit intendant Jin Guangzhu died and was posthumously granted administration commissioner rank.',
    'On dingyou day, Shengbao failed at Zhengyang Pass; Jin Guangzhu was killed and posthumously made administration commissioner.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_020_b09.mjs <translation.json>'
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
