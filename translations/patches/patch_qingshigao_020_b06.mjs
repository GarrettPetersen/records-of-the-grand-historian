#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    "Luo Bingzhang memorialized that bandits had taken Yuezhou; Zeng Guofan returned to the province to defend and block, leaving candidate circuit intendant Hu Linyi to suppress bandits in southern Chu.",
    "Luo Bingzhang reported Yuezhou lost; Zeng Guofan went home to defend while Hu Linyi stayed to fight in southern Hunan.",
  ],
  s0502: [
    "On day renyin, bandits took Yanggu; magistrate Wen Ying, in office five days, died; he received preferential condolence and a shrine was built.",
    "On renyin day, Yanggu fell; Wen Ying, magistrate for five days, was killed and honored with a shrine.",
  ],
  s0503: [
    "On day jiachen, bandits fled from Yanggu and Guan county to Xiao Tan in Qinghe and also split off to Liguangzhuang in Linqing.",
    "On jiachen day, rebels from Yanggu and Guan reached Qinghe's Xiao Tan and a detachment reached Linqing's Liguangzhuang.",
  ],
  s0504: [
    "On day yisi, Sengbao was ordered to meet and attack the fleeing bandits in Shandong; provincial administration commissioner Chong'en reported leading troops to hold Linqing prefecture.",
    "On yisi day, Sengbao was sent against Shandong raiders and Chong'en reported holding Linqing.",
  ],
  s0505: [
    "On day xinhai, the Emperor plowed the sacred field.",
    "On xinhai day, the Emperor plowed the sacred field.",
  ],
  s0506: [
    "On day dingsi, bandits took Linqing.",
    "On dingsi day, Linqing fell.",
  ],
  s0507: [
    "Ten days later government troops recovered it; the routed bandits fled south and Sengbao pursued.",
    "Ten days later the city was retaken; routed rebels fled south and Sengbao pursued.",
  ],
  s0508: [
    "Zeng Guofan memorialized that the campaign at Yuezhou had failed and he had returned to hold Changsha.",
    "Zeng Guofan reported defeat at Yuezhou and withdrew to Changsha.",
  ],
  s0509: [
    "The matter was referred down for deliberation and punishment.",
    "The ministries were ordered to deliberate punishment.",
  ],
  s0510: [
    "Summer, fourth month, day gengchen: Prince of Shuncheng Chunshan died.",
    "In summer, month 4, gengchen, Prince Chunshan of Shuncheng died.",
  ],
  s0511: [
    "Fucheng bandits fled to Lianzhen; Senggelinqin pursued and besieged them.",
    "Fucheng rebels fled to Lianzhen and Senggelinqin besieged them.",
  ],
  s0512: [
    "On day renwu, Sengbao memorialized that cavalry in pursuit had annihilated the Linqing routed bandits entirely.",
    "On renwu day, Sengbao reported the Linqing fugitives were wiped out.",
  ],
  s0513: [
    "He received an edict of praise, was made Junior Guardian of the Heir Apparent, and Delekeseleng and Shanlu were given yellow jackets.",
    "He was praised, made Junior Guardian, and Delekeseleng and Shanlu received yellow jackets.",
  ],
  s0514: [
    "On day jichou, Grand Secretary Pan Shien on leave for mourning died.",
    "On jichou day, retired Grand Secretary Pan Shien died.",
  ],
  s0515: [
    "Inner court minister Bi Chang died.",
    "Inner court minister Bi Chang died.",
  ],
  s0516: [
    "On day xinmao, Bao Qibao was dismissed; Taqibu was made acting Hunan provincial military commissioner and Zeng Guofan was stripped of office to campaign against bandits.",
    "On xinmao day, Bao Qibao was dismissed; Taqibu acted as Hunan commander and Zeng Guofan was demoted to fight rebels.",
  ],
  s0517: [
    "Zeng Guofan recovered Xiangtan; Taqibu, Peng Yulin, and Yang Zaifu won great victories suppressing bandits and Jinggang bandits withdrew.",
    "Zeng Guofan retook Xiangtan; Taqibu, Peng Yulin, and Yang Zaifu routed rebels and Jinggang rebels withdrew.",
  ],
  s0518: [
    "Fifth month, new moon on day jihai: Ge Yunfei's shrine was completed and an imperial inscribed plaque was bestowed.",
    "In month 5, jihai new moon, Ge Yunfei's shrine was finished and the Emperor bestowed an inscribed plaque.",
  ],
  s0519: [
    "The king of Gorkha memorialized requesting to send troops to suppress bandits.",
    "The Gorkha king asked to send troops against the rebels.",
  ],
  s0520: [
    "A mild edict forbade it.",
    "A gentle edict refused the request.",
  ],
  s0521: [
    "On day xinchou, Sun Ruizhen was dismissed; Zhu Fengbiao was made Minister of Revenue, Zhao Guang Minister of Justice, and Peng Yunzhang Minister of Works.",
    "On xinchou day, Sun Ruizhen was dismissed and Zhu Fengbiao, Zhao Guang, and Peng Yunzhang took the revenue, justice, and works ministries.",
  ],
  s0522: [
    "Vice Commander-in-Chief Mianxun pursued bandits at Feng county, defeated them, and was given the Baturu brave title.",
    "Mianxun routed rebels at Feng county and received the Baturu title.",
  ],
  s0523: [
    "On day yisi, Lianzhen bandit chief Li Kaifang fled and took Gaotang prefecture; Sengbao supervised troops in pursuit.",
    "On yisi day, Li Kaifang of Lianzhen seized Gaotang and Sengbao pursued.",
  ],
  s0524: [
    "On day renshen, the Emperor prayed for rain at the Hall of Great Heights.",
    "On renshen day, the Emperor prayed for rain at the Hall of Great Heights.",
  ],
  s0525: [
    "On day dingsi, he prayed for rain at the Altar of the God of Heaven.",
    "On dingsi day, he prayed for rain at the Altar of the God of Heaven.",
  ],
  s0526: [
    "On day gengshen, Jingzhou general Guan Wen memorialized that government troops had recovered Jianli county and Yichang prefectural city.",
    "On gengshen day, Guan Wen reported Jianli county and Yichang city recovered.",
  ],
  s0527: [
    "Taqibu was ordered to lead troops to Hubei to suppress bandits.",
    "Taqibu was ordered to Hubei to suppress rebels.",
  ],
  s0528: [
    "Former Hubei governor Chong Lun was stripped of office for feigning illness.",
    "Ex-governor Chong Lun was dismissed for sham illness.",
  ],
  s0529: [
    "On day renxu, rain fell.",
    "On renxu day, rain fell.",
  ],
  s0530: [
    "On day guihai, Hechun and Fu Ji memorialized recovering Lu'an prefectural city in Anhui.",
    "On guihai day, Hechun and Fu Ji reported Lu'an city recovered.",
  ],
  s0531: [
    "Sixth month, new moon on day wuchen: one month's ration grain was given to victims of bandit hardship in Linqing and Guan county.",
    "In month 6, wuchen new moon, Linqing and Guan victims received one month's rations.",
  ],
  s0532: [
    "Jiangxi bandits fled into De'an, Hubei.",
    "Jiangxi rebels entered Hubei's De'an.",
  ],
  s0533: [
    "On day gengchen, Xu Naijiao was dismissed; Gilang'a was made Jiangsu governor.",
    "On gengchen day, Xu Naijiao was dismissed and Gilang'a became Jiangsu governor.",
  ],
  s0534: [
    "Edict: \"At China's sea ports, apart from the five treaty ports for trade, foreign ships were never permitted to enter.",
    "An edict said China's ports, except the five treaty ports, had never admitted foreign ships.",
  ],
  s0535: [
    "Recently there have been intrusions into Jinling and Zhenjiang—what do they intend?\"",
    "Recently they had entered Jinling and Zhenjiang—what was their purpose?\"",
  ],
  s0536: [
    "Ye Mingchen is forthwith to speak plainly to the chiefs of each country and stop them.\"",
    "Ye Mingchen was to speak plainly to each foreign chief and stop them.\"",
  ],
  s0537: [
    "On day xinsi, an edict: those in the provinces who in militia training killed bandits were to have a general memorial arch erected and be entered in the Loyalty and Righteousness Shrine; women who met calamity and gave their lives were to be entered in the Chastity and Filial Piety Shrine.",
    "On xinsi day, militia who killed rebels were to have memorial arches and shrine honors; women who died in calamity were to enter the Chastity Shrine.",
  ],
  s0538: [
    "On day guimao, bandits took Wuchang.",
    "On guimao day, Wuchang fell.",
  ],
  s0539: [
    "Tai Yong was dismissed; Yang Yue was made Hubei governor and acting governor-general.",
    "Tai Yong was dismissed; Yang Yue became Hubei governor and acting governor-general.",
  ],
  s0540: [
    "Zeng Guofan was ordered to advance from Yuezhou in suppression; Ying Gui went to Xinyang to defend and block.",
    "Zeng Guofan was to advance from Yuezhou and Ying Gui was sent to block Xinyang.",
  ],
  s0541: [
    "Vice Commander-in-Chief Da Hong'a died in the army and was posthumously made commander-in-chief.",
    "Da Hong'a died in camp and was posthumously made commander-in-chief.",
  ],
  s0542: [
    "On day xinmao, Ye Mingchen was ordered to suppress and capture Guangdong secret-society bandits' pirate ships.",
    "On xinmao day, Ye Mingchen was ordered to suppress Guangdong society pirates.",
  ],
  s0543: [
    "Iron cash and lead cash were cast.",
    "Iron and lead cash were cast.",
  ],
  s0544: [
    "Autumn, seventh month, day xinchou: Hubei bandits took Yuezhou and in succession took Changde.",
    "In autumn, month 7, xinchou, Hubei rebels took Yuezhou and then Changde.",
  ],
  s0545: [
    "On day renzi, edict: \"Qing Lin abandoned the city and fled, going far to Changsha; order Guan Wen to transmit the decree for execution by law.\"",
    "On renzi day, an edict ordered Qing Lin executed by law for abandoning the city and fleeing to Changsha.",
  ],
  s0546: [
    "Vice Commander-in-Chief Teer Qing'e died in the army.",
    "Teer Qing'e died in the army.",
  ],
  s0547: [
    "On day gengshen, Hunan river forces recovered Yuezhou; dismissed Vice Minister Zeng Guofan was given third-rank status.",
    "On gengshen day, Hunan forces retook Yuezhou and demoted Zeng Guofan received third rank.",
  ],
  s0548: [
    "Circuit intendant Hu Linyi was ordered to attack and suppress Changde.",
    "Hu Linyi was ordered to attack Changde.",
  ],
  s0549: [
    "On day renxu, Yang Yue memorialized recovering Mianyang; bandits took Anlu.",
    "On renxu day, Yang Yue reported Mianyang recovered but Anlu fell.",
  ],
  s0550: [
    "Intercalary seventh month, day wuchen: Hubei government troops recovered Anlu.",
    "In intercalary month 7, wuchen, Hubei troops retook Anlu.",
  ],
  s0551: [
    "On day dingchou, Imperial Commissioner Qishan died in the army; Tuoming'a was made Imperial Commissioner to oversee Yangzhou military affairs.",
    "On dingchou day, Qishan died in camp and Tuoming'a became commissioner for Yangzhou.",
  ],
  s0552: [
    "On day gengchen, Yang Yue memorialized recovering Jingshan, Xiaogan, Tianmen, Huangpi, Macheng, and other cities.",
    "On gengchen day, Yang Yue reported Jingshan, Xiaogan, Tianmen, Huangpi, Macheng, and others recovered.",
  ],
  s0553: [
    "Xiang Rong memorialized that government troops had recovered Gaochun.",
    "Xiang Rong reported Gaochun recovered.",
  ],
  s0554: [
    "On day bingshen, Hechun memorialized recovering Taiping.",
    "On bingshen day, Hechun reported Taiping recovered.",
  ],
  s0555: [
    "Eighth month, day gengzi: Guan Wen memorialized in succession recovering Jiayu and Puqi.",
    "In month 8, gengzi, Guan Wen reported Jiayu and Puqi recovered.",
  ],
  s0556: [
    "On day guimao, Guangdong local bandits took Zhaoqing; Hunan and Fujian troops were transferred to suppress them.",
    "On guimao day, Guangdong bandits took Zhaoqing and Hunan and Fujian troops were sent.",
  ],
  s0557: [
    "On day jiayin, Hunan government troops advanced from Chenglingji to attack Tongcheng.",
    "On jiayin day, Hunan troops advanced from Chenglingji against Tongcheng.",
  ],
  s0558: [
    "On day guihai, British and American warships reached Tianjin's sea mouth; Gui Liang was ordered to go handle matters.",
    "On guihai day, British and American ships reached Tianjin and Gui Liang was sent to handle them.",
  ],
  s0559: [
    "Ninth month, day xinwei: Hubei and Hunan government troops captured Wuchang and Hanyang.",
    "In month 9, xinwei, Hubei and Hunan troops took Wuchang and Hanyang.",
  ],
  s0560: [
    "Yang Yue was made governor-general of Huguang; Zeng Guofan with second-rank status acted as Hubei governor; Taqibu was given a yellow jacket; Li Mengqun, Luo Zemin, and Li Xubin were promoted with distinctions.",
    "Yang Yue became Huguang governor-general; Zeng Guofan acted as Hubei governor at second rank; Taqibu got a yellow jacket; Li Mengqun, Luo Zemin, and Li Xubin were promoted.",
  ],
  s0561: [
    "Martyred administration commissioner Yue Xing and acting surveillance commissioner Li Qinggu were both given posthumous titles and shrines built.",
    "Yue Xing and acting commissioner Li Qinggu received posthumous titles and shrines.",
  ],
  s0562: [
    "On day renwu, Hubei government troops recovered Huangzhou.",
    "On renwu day, Hubei troops retook Huangzhou.",
  ],
  s0563: [
    "Zeng Guofan was ordered with Vice Minister of War status to join Taqibu in supervising the army eastward.",
    "Zeng Guofan was ordered east with vice minister rank alongside Taqibu.",
  ],
  s0564: [
    "On day jiashen, Yu Rui was dismissed; Huang Zonghan was made Sichuan governor-general and He Guiqing Zhejiang governor.",
    "On jiashen day, Yu Rui was dismissed; Huang Zonghan took Sichuan and He Guiqing took Zhejiang.",
  ],
  s0565: [
    "On day wuzi, Anhui government troops recovered Lujiang.",
    "On wuzi day, Anhui troops retook Lujiang.",
  ],
  s0566: [
    "On day yiwei, Wei Yuanyao died; Weng Xincun was made Minister of War.",
    "On yiwei day, Wei Yuanyao died and Weng Xincun became minister of war.",
  ],
  s0567: [
    "Winter, tenth month, day bingchen: Huashana was made Minister of Personnel, Quan Qing Minister of Works and head of the Directorate of Education.",
    "In winter, month 10, bingchen, Huashana took personnel, Quan Qing took works and the Directorate of Education.",
  ],
  s0568: [
    "Wen Qing was transferred to Manchu commandant-in-chief, Yi Xing to Han Army commandant-in-chief, and Yi Shan to inner court minister.",
    "Wen Qing became Manchu commandant, Yi Xing Han Army commandant, and Yi Shan inner court minister.",
  ],
  s0569: [
    "On day dingsi, Zeng Guofan memorialized that combined land and river forces attacked bandits at Banbishan and killed more than ten thousand bandits.",
    "On dingsi day, Zeng Guofan reported land and river forces killed over ten thousand rebels at Banbishan.",
  ],
  s0570: [
    "On day wuwu, Zhala Fentai was made Ili general.",
    "On wuwu day, Zhala Fentai became Ili general.",
  ],
  s0571: [
    "On day jiazi, Zeng Guofan and others memorialized capturing Tianjiazhen; Yang Zaifu and Peng Yulin were promoted.",
    "On jiazi day, Zeng Guofan reported Tianjiazhen taken and Yang Zaifu and Peng Yulin were promoted.",
  ],
  s0572: [
    "Hubei forces recovered Qizhou.",
    "Hubei forces retook Qizhou.",
  ],
  s0573: [
    "Eleventh month, day dingchou: the Emperor went to the Hall of Great Heights to pray for snow.",
    "In month 11, dingchou, the Emperor prayed for snow at the Hall of Great Heights.",
  ],
  s0574: [
    "On day gengchen, Yang Yue memorialized recovering Guangji and Huangmei.",
    "On gengchen day, Yang Yue reported Guangji and Huangmei recovered.",
  ],
  s0575: [
    "On day wuzi, Luo Raodian died; Hengchun was made Yunnan-Guizhou governor-general, Wang Qingyun Shanxi governor, and Wu Zhenduo Shaanxi governor.",
    "On wuzi day, Luo Raodian died; Hengchun took Yunnan-Guizhou, Wang Qingyun Shanxi, and Wu Zhenduo Shaanxi.",
  ],
  s0576: [
    "Suiyuan City general Shanlu died in the army.",
    "Shanlu died in the army at Suiyuan City.",
  ],
  s0577: [
    "On day gengyin, Grand Secretary and Grand Councillor Qi Junyuan retired.",
    "On gengyin day, Grand Secretary Qi Junyuan retired.",
  ],
  s0578: [
    "Jia Zhen was made Grand Secretary, Weng Xincun Minister of Personnel, Zhou Zupei Minister of War, and Xu Naipu Left Censor-in-Chief.",
    "Jia Zhen became grand secretary; Weng Xincun took personnel, Zhou Zupei war, and Xu Naipu the left censorate.",
  ],
  s0579: [
    "On day guisi, Hubei bandits took Yingshan, Anhui.",
    "On guisi day, Hubei rebels took Yingshan in Anhui.",
  ],
  s0580: [
    "Anqing bandits fled to Jiujiang, Hukou, and as far as Wucheng.",
    "Anqing rebels fled to Jiujiang, Hukou, and Wucheng.",
  ],
  s0581: [
    "Twelfth month, day yiwei: Zeng Guofan memorialized capturing Xiao Chikou; the Emperor praised him and bestowed a fox-leg yellow jacket.",
    "In month 12, yiwei, Zeng Guofan reported Xiao Chikou taken and received a fox-leg yellow jacket.",
  ],
  s0582: [
    "On day wuxu, Hechun memorialized recovering Yingshan.",
    "On wuxu day, Hechun reported Yingshan recovered.",
  ],
  s0583: [
    "Because recovery of Ying and Huo counties had relied on the people's strength, three years of grain transport tax were remitted.",
    "Ying and Huo counties were exempted from three years of transport tax for popular effort in recovery.",
  ],
  s0584: [
    "On day xinchou, Yuan Jiasan memorialized that licentiate Zang Yuqing in attacking Tongcheng exhausted his strength and died in battle; he was given third-rank status and a hereditary office.",
    "On xinchou day, Yuan Jiasan reported licentiate Zang Yuqing died attacking Tongcheng and received third rank and a hereditary post.",
  ],
  s0585: [
    "On day yimao, Yi Ji's son Zai Zhong was enfeoffed as beile and succeeded to Prince of Yin Zhi; his name was changed to Zai Zhi.",
    "On yimao day, Yi Ji's son Zai Zhong became beile, succeeded Prince Yin Zhi as Zai Zhi.",
  ],
  s0586: [
    "Guizhou government troops attacked bandits, defeated them, and relieved the siege of Xingyi city.",
    "Guizhou troops defeated rebels and lifted the siege of Xingyi.",
  ],
  s0587: [
    "On day xinyou, Anhui government troops recovered Hanshan.",
    "On xinyou day, Anhui troops retook Hanshan.",
  ],
  s0588: [
    "Senggelinqin memorialized attacking and destroying the bandit nest at West Lianzhen.",
    "Senggelinqin reported destroying the rebel nest at West Lianzhen.",
  ],
  s0589: [
    "On day guihai, the joint autumn sacrifice was performed at the Imperial Ancestral Temple.",
    "On guihai day, the autumn joint sacrifice was held at the Imperial Ancestral Temple.",
  ],
  s0590: [
    "That year, grain tax was remitted for 129 prefectures and counties in Henan, Shandong, Shanxi, Fujian, Hunan, Guangxi, and other provinces, and disaster levies were remitted in varying degrees for twelve native prefectures and counties in Guangxi.",
    "That year, 129 prefectures and counties in six provinces had grain tax remitted and twelve Guangxi native districts had disaster levies reduced.",
  ],
  s0591: [
    "Korea and Ryukyu sent tribute.",
    "Korea and Ryukyu paid tribute.",
  ],
  s0592: [
    "Fifth year, yimao, spring, first month, day jisi: Sichuan government troops recovered Tongzi in Guizhou.",
    "In year 5, month 1, jisi, Sichuan troops retook Guizhou's Tongzi.",
  ],
  s0593: [
    "On day renshen, Guizhou government troops suppressed bandits at Leitai Mountain and captured bandit chief Chen Liangmo.",
    "On renshen day, Guizhou troops took Leitai Mountain and captured Chen Liangmo.",
  ],
  s0594: [
    "On day jiaxu, because Jiangsu and Zhejiang transport grain was insufficient for the capital granaries, Yi Liang was ordered to open rice contributions for delivery to the capital.",
    "On jiaxu day, insufficient Jiangsu-Zhejiang grain transport led Yi Liang to open rice contributions for Beijing.",
  ],
  s0595: [
    "On day wuyin, Gilang'a memorialized recovering Shanghai county seat.",
    "On wuyin day, Gilang'a reported Shanghai county recovered.",
  ],
  s0596: [
    "An edict praised him.",
    "An edict praised him.",
  ],
  s0597: [
    "On day xinsi, Hubei bandits from Huangmei doubled back to Hankou; Yang Yue withdrew to defend De'an, was stripped of office but remained in post.",
    "On xinsi day, rebels from Huangmei retook Hankou; Yang Yue fell back to De'an, was demoted but kept his post.",
  ],
  s0598: [
    "On day guimao, Jiangxi government troops recovered Wuning.",
    "On guimao day, Jiangxi troops retook Wuning.",
  ],
  s0599: [
    "On day yiyou, Senggelinqin memorialized capturing Lianzhen and chief rebel Lin Fengxiang was taken.",
    "On yiyou day, Senggelinqin reported Lianzhen taken and Lin Fengxiang captured.",
  ],
  s0600: [
    "Senggelinqin was enfeoffed as prince, shifted his army to Shandong, and attacked and suppressed the bandits entrenched at Gaotang.",
    "Senggelinqin was made prince, moved to Shandong, and attacked the rebels at Gaotang.",
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_020_b06.mjs <translation.json>'
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
