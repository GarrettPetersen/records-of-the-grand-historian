#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'An edict ordered Jing Lun and others to rigorously apprehend sect bandits in Jilin.',
    'Jing Lun and others were ordered to hunt down Jilin sect rebels.',
  ],
  s0502: [
    'On day renyin, Fu Ming\'a was ordered to hurry to Yangzhou to assist in Du Xing\'a\'s military affairs.',
    'On renyin day, Fu Ming\'a was sent to Yangzhou to help Du Xing\'a.',
  ],
  s0503: [
    'On day guimao, Senggebao requested to pacify Muslim rebels at Sanyuan and elsewhere; it was not permitted.',
    'On guimao day, Senggebao\'s request to pacify Sanyuan Muslims was refused.',
  ],
  s0504: [
    'On day jiachen, Liu Changyou was made governor-general of Liangguang.',
    'On jiachen day, Liu Changyou became governor-general of the two Guangs.',
  ],
  s0505: [
    'Tian Xingshu was permitted to remain temporarily in Guizhou to suppress bandits.',
    'Tian Xingshu was allowed to stay in Guizhou to fight rebels.',
  ],
  s0506: [
    'On day yisi, Shi Dakai fled to Qijiang and other places; government troops pursued and defeated him.',
    'On yisi day, Shi Dakai fled to Qijiang; government troops routed him.',
  ],
  s0507: [
    'Muslim rebels fled to Binzhou, Baoji, and other places.',
    'Muslim rebels raided Binzhou and Baoji.',
  ],
  s0508: [
    'On day bingwu, Henan Nian bandit Li Ruying surrendered.',
    'On bingwu day, Henan Nian leader Li Ruying surrendered.',
  ],
  s0509: [
    'On day wushen, Shi Dakai fled to Renhuai.',
    'On wushen day, Shi Dakai fled to Renhuai.',
  ],
  s0510: [
    'On day jiyou, Guan Wen was made Grand Secretary of the Wenhua Hall and Woren Grand Secretary of the Wenyuan Pavilion.',
    'On jiyou day, Guan Wen and Woren were made grand secretaries of Wenhua and Wenyuan halls.',
  ],
  s0511: [
    'Ninth month, day xinhai: Empress Xiaojingcheng was enshrined in the Grand Temple; an edict granted differentiated grace.',
    'In month 9, xinhai, Empress Xiaojingcheng entered the Grand Temple and grace was proclaimed.',
  ],
  s0512: [
    'Henan Nian bandits fled to Neixiang and Xinye.',
    'Henan Nian rebels entered Neixiang and Xinye.',
  ],
  s0513: [
    'On day renzi, Censor Liu Qing requested that recruiting exiles, reclaiming land, and land-tax harvest be used to judge prefectural and county performance; approved.',
    'On renzi day, Liu Qing\'s plan to rate officials by resettling exiles and reclaiming land was approved.',
  ],
  s0514: [
    'On day jiayin, Shen Baozhen\'s request was approved to drill selected quota troops and arrange allowances.',
    'On jiayin day, Shen Baozhen was allowed to drill quota troops and fund allowances.',
  ],
  s0515: [
    'On day yimao, because Wenzong was being moved to the mausoleum, quota levies were remitted for counties along the route.',
    'On yimao day, transit counties had levies remitted for Wenzong\'s burial procession.',
  ],
  s0516: [
    'An edict ordered Wen Yu to select capable officials to plan waterworks in the capital region.',
    'Wen Yu was told to choose good officials for capital-region waterworks.',
  ],
  s0517: [
    'On day bingchen, Zhili sorcerers Wang Shouqing and others who compiled rebellious writings were discovered and executed.',
    'On bingchen day, Wang Shouqing and other Zhili sorcerers were executed for seditious writings.',
  ],
  s0518: [
    'On day dingsi, an edict ordered Zheng Yuanshan and Mao Changxi to attack Nian bandits on the southwest routes from both sides.',
    'On dingsi day, Zheng Yuanshan and Mao Changxi were ordered to pinch the southwest Nian bands.',
  ],
  s0519: [
    'Zeng Guofan said that in handling Miao Peilin one should pardon his crimes but not employ his forces; the court approved.',
    'Zeng Guofan urged pardoning Miao Peilin without using his troops; the court agreed.',
  ],
  s0520: [
    'On day wuwu, Guangdong bandits Huang Jinlong, Li Zhihuai, and others stirred rebellion; government troops suppressed and pacified them.',
    'On wuwu day, Huang Jinlong and Li Zhihuai rose in Guangdong and were crushed.',
  ],
  s0521: [
    'Dolong\'a was urged to lead his troops into Shaanxi; bandits who fled to Suizhou and Zaozhou were ordered suppressed by Mutu Shan\'s army.',
    'Dolong\'a was pressed into Shaanxi while Mutu Shan cleared Suizhou and Zaozhou.',
  ],
  s0522: [
    'On day jiwei, Senggebao requested to transfer Miao Peilin to Shaanxi to assist suppression; it was not permitted.',
    'On jiwei day, Senggebao\'s request for Miao Peilin in Shaanxi was denied.',
  ],
  s0523: [
    'Sichuan rebels fled to Ningshan; government troops defeated them at Ziwu Valley.',
    'Sichuan rebels entered Ningshan and were beaten at Ziwu Valley.',
  ],
  s0524: [
    'On day gengshen, Shi Dakai fled to Tongzi.',
    'On gengshen day, Shi Dakai fled to Tongzi.',
  ],
  s0525: [
    'On day guihai, because Fujian, Guangdong, and Shandong treated military funds lightly, frontier officials were given severe deliberation and penalties for defaulting on capital funds were fixed.',
    'On guihai day, Fujian, Guangdong, and Shandong were censured for slack pay and capital-fund defaults were tightened.',
  ],
  s0526: [
    'On day jiazi, Taiping chief Li Xiucheng launched a major relief effort for Jinling.',
    'On jiazi day, Li Xiucheng marched in force to relieve Jinling.',
  ],
  s0527: [
    'Chen Decai took Yingcheng and Xiaogan; government troops recovered them.',
    'Chen Decai seized Yingcheng and Xiaogan but government troops retook them.',
  ],
  s0528: [
    'Anhui forces captured the bandit nest at Hugou.',
    'Anhui troops took the Hugou rebel nest.',
  ],
  s0529: [
    'On day bingyin, Senggelinqin\'s army captured the Nian nest at Bozhou.',
    'On bingyin day, Senggelinqin seized the Bozhou Nian nest.',
  ],
  s0530: [
    'Shaanxi Muslims besieged Fengxiang.',
    'Shaanxi Muslims besieged Fengxiang.',
  ],
  s0531: [
    'On day gengwu, Feng Zicai captured the bandit nest at Tanggang.',
    'On gengwu day, Feng Zicai took the Tanggang rebel nest.',
  ],
  s0532: [
    'Muslims rebelled at Lingzhou.',
    'Lingzhou Muslims rose in revolt.',
  ],
  s0533: [
    'Li Xuyi was urged to proceed to the army.',
    'Li Xuyi was ordered to the front.',
  ],
  s0534: [
    'On day renshen, Muslim masses attacked Tongzhou and Chaoyi; an edict ordered Senggebao personally to supervise suppression; Lei Zhengwan supervised north of Xianyang.',
    'On renshen day, Muslims struck Tongzhou and Chaoyi; Senggebao was sent in person and Lei Zhengwan took the north of Xianyang.',
  ],
  s0535: [
    'On day guiyou, Zhejiang troops recovered Shouchang.',
    'On guiyou day, Zhejiang forces retook Shouchang.',
  ],
  s0536: [
    'On day jiaxu, for extorting Muslim merchants, Urga minister Seketong\'e was stripped of office and banished to Xinjiang.',
    'On jiaxu day, Seketong\'e was dismissed and sent to Xinjiang for extorting Muslim traders.',
  ],
  s0537: [
    'Abusive Urga tea-ticket practices were abolished.',
    'Urga tea-ticket abuses were abolished.',
  ],
  s0538: [
    'Li Hongzhang\'s army with British and French forces recovered Jiading.',
    'Li Hongzhang, with British and French allies, retook Jiading.',
  ],
  s0539: [
    'A treaty allowing trade with the Netherlands was approved.',
    'Dutch treaty trade was approved.',
  ],
  s0540: [
    'On day yihai, Hubei troops recovered Jingshan.',
    'On yihai day, Hubei forces retook Jingshan.',
  ],
  s0541: [
    'Cantonese rebels fled to Huangpi and Huang\'an.',
    'Taiping rebels entered Huangpi and Huang\'an.',
  ],
  s0542: [
    'An edict ordered Zeng Guofan and others to select military officers to study foreign tactics at Shanghai and Ningbo; Fujian, Guangdong, and other provinces were to follow.',
    'Zeng Guofan was told to train officers in foreign tactics at Shanghai and Ningbo for other provinces to copy.',
  ],
  s0543: [
    'On day bingzi, Henan troops captured the bandit nest at Longjing.',
    'On bingzi day, Henan troops took the Longjing rebel nest.',
  ],
  s0544: [
    'Su Tingkui, Zeng Wangyan, Liu Xizai, Huang Pengnian, Zhu Qi, and others were summoned to the capital; provinces were still ordered to conduct militia training.',
    'Su Tingkui, Liu Xizai, Zhu Qi, and others were called to court while provinces kept up militia drill.',
  ],
  s0545: [
    'On day dingchou, an edict ordered the capital region to practice the scorched-earth defense method.',
    'On dingchou day, the capital region was ordered to use scorched-earth defense.',
  ],
  s0546: [
    'An edict ordered Zeng Guofan and others to select officers in advance to drill with foreign ships and cannon.',
    'Zeng Guofan was told to pick officers to train with foreign ships and guns.',
  ],
  s0547: [
    'On day jimao, worship at the Grand Temple.',
    'On jimao day, the Grand Temple was worshipped.',
  ],
  s0548: [
    'Winter, tenth month, gengchen new moon: Sichuan troops captured Longchang; bandit chiefs Li Yonghe and others were executed; Regional Commander Hu Zhonghe was rewarded with a yellow jacket.',
    'In winter, month 10, gengchen new moon, Sichuan took Longchang; Li Yonghe and other chiefs were executed and Hu Zhonghe got a yellow jacket.',
  ],
  s0549: [
    'On day xinsi, large Cantonese rebel forces besieged Shanghai troops at Nanxiang and elsewhere.',
    'On xinsi day, Taiping forces besieged Shanghai troops at Nanxiang.',
  ],
  s0550: [
    'Senggebao went to Tongguan to suppress bandits.',
    'Senggebao went to Tongguan to fight rebels.',
  ],
  s0551: [
    'On day guimao, Hunan relief forces jointly recovered Xiuren.',
    'On guimao day, Hunan relief troops retook Xiuren.',
  ],
  s0552: [
    'Lao Chongguang was ordered to Guizhou to investigate Tian Xingshu\'s killing of Christians.',
    'Lao Chongguang was sent to Guizhou to probe Tian Xingshu\'s massacre of Christians.',
  ],
  s0553: [
    'Zhang Kaisong was assigned to take over Guangxi military affairs.',
    'Zhang Kaisong took charge of Guangxi military affairs.',
  ],
  s0554: [
    'On day bingxu, Emperor Wenzong and Empress Xiaode were enshrined in the Ancestral Hall; the Emperor personally went to perform the rites.',
    'On bingxu day, Wenzong and Empress Xiaode entered the Ancestral Hall and the Emperor performed the rites in person.',
  ],
  s0555: [
    'On day wuzi, Ruichang was ordered to assist as Grand Secretary.',
    'On wuzi day, Ruichang was made assistant grand secretary.',
  ],
  s0556: [
    'On day jichou, Cao Yuying was appointed Grand Councilor.',
    'On jichou day, Cao Yuying joined the Grand Council.',
  ],
  s0557: [
    'On day gengyin, Henan troops defeated Nian bandits in suppression and lifted the siege of Linying.',
    'On gengyin day, Henan troops beat the Nian and raised the siege of Linying.',
  ],
  s0558: [
    'Senggebao was urged to go suppress bandits at Tongzhou and Chaoyi.',
    'Senggebao was pressed to fight at Tongzhou and Chaoyi.',
  ],
  s0559: [
    'Senggebao again requested to transfer Miao Peilin to Shaanxi; an edict severely reprimanded him.',
    'Senggebao again asked for Miao Peilin in Shaanxi and was sharply rebuked.',
  ],
  s0560: [
    'Government troops recovered Fenghua.',
    'Government troops retook Fenghua.',
  ],
  s0561: [
    'Xu Zhiming reported pacifying Muslim rebels at Xingyi.',
    'Xu Zhiming reported pacifying Xingyi Muslims.',
  ],
  s0562: [
    'An edict said he was controlled by Yunnan Muslims.',
    'An edict said Yunnan Muslims were manipulating him.',
  ],
  s0563: [
    'Pan Duo was ordered to recall commissioners so Xu Zhiming would not intervene in Guizhou affairs.',
    'Pan Duo was told to recall agents and keep Xu Zhiming out of Guizhou.',
  ],
  s0564: [
    'On day xinmao, Yan\'an Muslim rebels revolted.',
    'On xinmao day, Yan\'an Muslims rebelled.',
  ],
  s0565: [
    'Ying Gui organized militia defense at Hequ and Baode.',
    'Ying Gui organized militia at Hequ and Baode.',
  ],
  s0566: [
    'Li Hongzhang was ordered to choose a general to command the Ever-Victorious Army; he was formally appointed Jiangsu governor.',
    'Li Hongzhang was told to pick a commander for the Ever-Victorious Army and was made Jiangsu governor.',
  ],
  s0567: [
    'Gansu Muslims fled and pressed Huamachi.',
    'Gansu Muslims threatened Huamachi.',
  ],
  s0568: [
    'On day guisi, Guizhou troops defeated Shi Dakai in suppression and the siege of Zunyi was lifted.',
    'On guisi day, Guizhou troops beat Shi Dakai and lifted the Zunyi siege.',
  ],
  s0569: [
    'Shi Dakai fled to Renhuai.',
    'Shi Dakai fled to Renhuai.',
  ],
  s0570: [
    'On day yiwei, an edict ordered Fengtian to rigorously apprehend bandits.',
    'On yiwei day, Fengtian was ordered to hunt bandits.',
  ],
  s0571: [
    'Troops under the late foreign officer Ward were disbanded.',
    'Ward\'s former foreign-led troops were cut.',
  ],
  s0572: [
    'Russian warships were permitted to assist suppression at Shanghai but not enter the Yangzi.',
    'Russian ships could help at Shanghai but not sail upriver.',
  ],
  s0573: [
    'It was fixed that hereafter foreigners leading troops must not change uniform colors.',
    'Foreign commanders were barred from changing uniform colors.',
  ],
  s0574: [
    'Deleng\'e\'s army was routed in Shandong; an edict stripped his office and ordered investigation.',
    'Deleng\'e was routed in Shandong, dismissed, and put under investigation.',
  ],
  s0575: [
    'On day bingshen, Ningxia troops were defeated suppressing Muslims.',
    'On bingshen day, Ningxia troops lost a fight with Muslims.',
  ],
  s0576: [
    'Shaanxi Muslims fled to Qingshui.',
    'Shaanxi Muslims raided Qingshui.',
  ],
  s0577: [
    'On day wuxu, Senggelinqin was ordered to suppress widespread bandits in Shandong.',
    'On wuxu day, Senggelinqin was sent against Shandong bandits.',
  ],
  s0578: [
    'On day jihai, Jiangnan troops repelled rebels at Jinzhuguan.',
    'On jihai day, Jiangnan troops drove off rebels at Jinzhuguan.',
  ],
  s0579: [
    'On day gengzi, Tan Tingxiang was dismissed.',
    'On gengzi day, Tan Tingxiang was dismissed.',
  ],
  s0580: [
    'Mourning circuit intendant Yan Jingming was ordered to act as Shandong governor and handle military affairs.',
    'Yan Jingming, on mourning leave as intendant, was made acting Shandong governor for the campaign.',
  ],
  s0581: [
    'On day guimao, Muteng\'e was ordered to assist in Senggebao\'s military affairs.',
    'On guimao day, Muteng\'e was assigned to help Senggebao.',
  ],
  s0582: [
    'On day yisi, an edict to the Ministry of Punishments: "This year executions at the autumn assizes are suspended by precedent. He Guiqing lost discipline commanding troops and was only sentenced to beheading with delay—already clemency beyond the law.',
    'On yisi day, the Ministry of Punishments was told: assizes were suspended this year, yet He Guiqing had only drawn delayed beheading for losing his army—already mercy.',
  ],
  s0583: [
    'Now the term has arrived; if because of the suspension it is delayed again, leaving execution long outstanding, how can we answer the dead and the myriad living? Execute him at once.',
    'The deadline had come; further delay would wrong the dead and the people—execute him now.',
  ],
  s0584: [
    'Hereafter in years when assizes are suspended, offenders whose guilt is grave are still to be specially memorialized for imperial decision."',
    'In future suspension years, grave offenders would still be memorialized for the throne\'s decision."',
  ],
  s0585: [
    'Earlier, Xu Zhiming had commissioned the Muslim Ma Liansheng to act as Anyi garrison commander; Muslim rebels therefore occupied Pu\'an city.',
    'Earlier Xu Zhiming had put Ma Liansheng in charge at Anyi, and Muslims seized Pu\'an.',
  ],
  s0586: [
    'At this point the matter was reported.',
    'The affair was now reported.',
  ],
  s0587: [
    'An edict ordered Zhiming to recall Ma Liansheng and swiftly investigate how the trouble arose and memorialize in detail.',
    'Zhiming was told to recall Ma Liansheng and report how the revolt began.',
  ],
  s0588: [
    'Eleventh month, jiyou new moon: solar eclipse.',
    'In month 11, jiyou new moon, there was a solar eclipse.',
  ],
  s0589: [
    'Shen Hongfu was appointed acting Guizhou provincial military commissioner to take over Tian Xingshu\'s military affairs.',
    'Shen Hongfu acted as Guizhou commander and replaced Tian Xingshu.',
  ],
  s0590: [
    'On day gengxu, Changsha prefect Ding Baozhen was promoted to act as Shandong circuit intendant.',
    'On gengxu day, Ding Baozhen of Changsha was made acting Shandong intendant.',
  ],
  s0591: [
    'On day renzi, Zheng Yuanshan was demoted to circuit intendant for neglect of duty.',
    'On renzi day, Zheng Yuanshan was demoted for slackness.',
  ],
  s0592: [
    'Zhang Zhiwan was ordered to act as Henan governor.',
    'Zhang Zhiwan was made acting Henan governor.',
  ],
  s0593: [
    'An edict ordered Mao Changxi to reduce his troops.',
    'Mao Changxi was told to cut his forces.',
  ],
  s0594: [
    'Taiwan secret-society bandits took Douliumen.',
    'Taiwan society rebels seized Douliumen.',
  ],
  s0595: [
    'On day jiayin, Huang Bin was stripped of office and removed from assistant command; Wu Quanmei was ordered to take over the navy, under Zeng Guofan and Du Xing\'a.',
    'On jiayin day, Huang Bin was dismissed; Wu Quanmei took the fleet under Zeng Guofan and Du Xing\'a.',
  ],
  s0596: [
    'On day bingchen, Weng Xincun died; he was posthumously made Grand Guardian.',
    'On bingchen day, Weng Xincun died and was posthumously made Grand Guardian.',
  ],
  s0597: [
    'Zeng Guoquan\'s army won a great victory suppressing Jinling relief rebels; Zeng Guoquan and Xiao Fusi were rewarded with yellow jackets.',
    'Zeng Guoquan routed Jinling relief rebels; he and Xiao Fusi received yellow jackets.',
  ],
  s0598: [
    'On day wuwu, government troops with British and French forces recovered Shangyu, Sheng, and Xinchang.',
    'On wuwu day, allied forces retook Shangyu, Shengxian, and Xinchang.',
  ],
  s0599: [
    'On day jiwei, Peng Yunzhang died.',
    'On jiwei day, Peng Yunzhang died.',
  ],
  s0600: [
    'On day gengshen, Jinling Cantonese rebels raided Gaozi; Feng Zicai\'s army repelled them.',
    'On gengshen day, Jinling rebels raided Gaozi and Feng Zicai drove them off.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_021_b06.mjs <translation.json>'
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
