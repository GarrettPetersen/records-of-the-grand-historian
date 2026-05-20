#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'On day jihai, for allowing troops to plunder, regional commander Tian Zaitian was stripped of office.',
    'On jihai, Tian Zaitian lost his command for letting troops loot.',
  ],
  s0402: [
    'On day gengzi, Shen Zhaolin, having supervised suppression of the Salar rebels and returned, reached Pingfan when sudden flood from mountains and water struck; he died.',
    'On gengzi, Shen Zhaolin died at Pingfan when a flash flood hit as he returned from Salar operations.',
  ],
  s0403: [
    'Guangdong rebels fled into Nanyang; Sheng Bao was ordered into Shaanxi to oversee military affairs and command all armies.',
    'Cantonese rebels slipped into Nanyang; Sheng Bao entered Shaanxi to run operations and command all forces.',
  ],
  s0404: [
    'Xilin was appointed Shaanxi-Gansu governor-general.',
    'Xilin became Shaanxi-Gansu governor-general.',
  ],
  s0405: [
    'Feng Zicai\'s request was granted to streamline the Zhenjiang army.',
    'Feng Zicai was allowed to weed out the Zhenjiang force.',
  ],
  s0406: [
    'On day guimao, Mao Hongbin reported successive victories against Guizhou rebels; Han Chao was ordered to recover lost territory, Liu Changyou to disband Yao tribesmen, and Mao Hongbin to coordinate suppression of rebels in Guizhou and Guangxi.',
    'On guimao, Mao Hongbin beat Guizhou rebels repeatedly; Han Chao was told to retake lost ground, Liu Changyou to disband Yao levies, and Mao Hongbin to join operations in Guizhou and Guangxi.',
  ],
  s0407: [
    'On day jiachen, Fujian troops recovered Xuanping, Songyang, and Ruian.',
    'On jiachen, Fujian forces retook Xuanping, Songyang, and Ruian.',
  ],
  s0408: [
    'Qingduan was made Fuzhou general and Qiling Min-Zhe governor-general.',
    'Qingduan took Fuzhou and Qiling became Min-Zhe governor-general.',
  ],
  s0409: [
    'On day yisi, Li Xuyi\'s mother died; he was ordered to waive mourning and act as Anhui governor.',
    'On yisi, Li Xuyi was told to set aside mourning and serve as acting Anhui governor.',
  ],
  s0410: [
    'On day bingwu, a comet appeared in the northwest.',
    'On bingwu, a comet showed in the northwest sky.',
  ],
  s0411: [
    'The Sino-Portuguese commercial treaty was concluded.',
    'China and Portugal concluded a commercial treaty.',
  ],
  s0412: [
    'Sengge Rinchen was ordered to command Henan and Shandong military affairs, controlling governors and below, and to consult Li Xuyi on Anhui rebel suppression.',
    'Sengge Rinchen took Henan and Shandong command over all governors and was to work with Li Xuyi on Anhui rebels.',
  ],
  s0413: [
    'The Office for the General Management of Foreign Affairs requested establishing the Tongwen Guan to study foreign languages; it was approved.',
    'The foreign affairs office asked to open the Tongwen Guan for foreign languages; the court agreed.',
  ],
  s0414: [
    'On day dingwei, Bao Chao\'s army recovered Ningguo.',
    'On dingwei, Bao Chao retook Ningguo.',
  ],
  s0415: [
    'Government troops recovered Jingning and Yunhe.',
    'Imperial forces retook Jingning and Yunhe.',
  ],
  s0416: [
    'Hubei troops recovered Yunxi.',
    'Hubei forces retook Yunxi.',
  ],
  s0417: [
    'The Board of Punishments was ordered to clear accumulated prison cases.',
    'The Ministry of Justice was told to clear backlog cases.',
  ],
  s0418: [
    'Earlier, in Guangdong\'s Enping, Yangchun, Xinxing, and other counties, local and migrant communities had fought for nine years without settlement.',
    'Before this, Hakka–local fights in Enping, Yangchun, Xinxing, and other Guangdong counties had lasted nine years.',
  ],
  s0419: [
    'Now they were ordered to instruct Lao Chongguang to stop the fighting and plan follow-up settlement in advance.',
    'The court now told Lao Chongguang to halt the fighting and prepare settlement measures.',
  ],
  s0420: [
    'On day wushen, owing to celestial anomalies an edict sought candid memorials.',
    'On wushen, strange stars brought an edict calling for frank advice.',
  ],
  s0421: [
    'On day gengxu, Lin Fuxiang and Mi Xingchao were executed for abandoning their posts.',
    'On gengxu, Lin Fuxiang and Mi Xingchao were beheaded for deserting their posts.',
  ],
  s0422: [
    'Du Xing\'a was ordered to verify river transit taxes in earnest.',
    'Du Xing\'a was told to audit coastal transit levies honestly.',
  ],
  s0423: [
    'Yunnan Muslim rebels took Yongchang, Longling, and Tengyue.',
    'Yunnan Hui rebels seized Yongchang, Longling, and Tengyue.',
  ],
  s0424: [
    'That month, arrears of reed tax were remitted for Yining and other prefectures and counties in Jiangxi.',
    'That month Jiangxi remitted overdue reed taxes for Yining and other districts.',
  ],
  s0425: [
    'Eighth month, first day xinhai: because Taizhou militia had recovered the prefecture and counties, grain and land taxes for Tongzhi years 1–2 were remitted.',
    'On the xinhai new moon in month 8, Taizhou militia recovery won remission of Tongzhi 1–2 taxes.',
  ],
  s0426: [
    'On day renzi, Li Hongzhang\'s army took Qingpu.',
    'On renzi, Li Hongzhang captured Qingpu.',
  ],
  s0427: [
    'Governors-general and governors were sternly instructed to uproot abuses of levies, transit taxes, and coercion.',
    'Provincial chiefs were sharply warned to end levy, transit-tax, and extortion abuses.',
  ],
  s0428: [
    'On day guichou, reduced official salaries in Beijing were approved for cash payment.',
    'On guichou, Beijing officials were allowed cash for their reduced pay.',
  ],
  s0429: [
    'On day jiayin, Muslim rebels besieged Xianyang and other cities; Sheng Bao was ordered through Tong Pass to supervise suppression.',
    'On jiayin, Hui rebels besieged Xianyang and more; Sheng Bao was sent through Tong Pass to suppress them.',
  ],
  s0430: [
    'On day yimao, Lezheng Hutuktu\'s title and yellow bridle were stripped.',
    'On yimao, Lezheng Hutuktu lost his rank and yellow bridle privilege.',
  ],
  s0431: [
    'As Tibetan affairs were settled, Tibetan troop levies and Sichuan funds were halted.',
    'With Tibet quiet, Tibetan levies and Sichuan subsidies stopped.',
  ],
  s0432: [
    'An edict ordered Zhili to catch locusts.',
    'Zhili was ordered to hunt locusts.',
  ],
  s0433: [
    'On day jiwei, Xu Zhiming asked to block Zhang Liangji from leading troops into Yunnan.',
    'On jiwei, Xu Zhiming tried to keep Zhang Liangji from marching into Yunnan.',
  ],
  s0434: [
    'He was rebuked for being constrained by Muslims and refused.',
    'The court scolded him for Muslim pressure and said no.',
  ],
  s0435: [
    'On day xinyou, strict guard was ordered against Shaanxi rebels colluding with Gansu Muslims.',
    'On xinyou, officials were warned to block Shaanxi rebels from joining Gansu Hui.',
  ],
  s0436: [
    'On day renxu, Sheng Bao was told to detach troops for Shanxi and Ying Gui to arrange Shanxi defenses.',
    'On renxu, Sheng Bao sent men to Shanxi while Ying Gui organized its defense.',
  ],
  s0437: [
    'On day guihai, Sheng Bao was to suppress north of the Wei River, Dolonga south Weinan Muslim rebels, also watching Zhenping.',
    'On guihai, Sheng Bao fought north of Wei, Dolonga south Weinan Hui, and both watched Zhenping.',
  ],
  s0438: [
    'On day jiazi, Lin Ziqing\'s militia were funded to return to Yunnan.',
    'On jiazi, Lin Ziqing’s troops were paid to go back to Yunnan.',
  ],
  s0439: [
    'On day yichou, Shaanxi Muslims besieged Chaoyi.',
    'On yichou, Shaanxi Hui rebels besieged Chaoyi.',
  ],
  s0440: [
    'Tepuqin and others said Hulan settlers were increasing daily and asked for resident vice-prefect posts; approved.',
    'Tepuqin reported more Hulan settlers and won approval for new resident officials.',
  ],
  s0441: [
    'Fu Zhenbang was ordered to assist Tan Tingxiang\'s military affairs.',
    'Fu Zhenbang was assigned to help Tan Tingxiang’s campaign.',
  ],
  s0442: [
    'On day bingyin, all provinces were ordered to investigate persons of dubious status.',
    'On bingyin, every province was told to screen questionable persons.',
  ],
  s0443: [
    'On day dingmao, Li Xuyi was granted leave for mourning; Tang Xunfang temporarily replaced him.',
    'On dingmao, Li Xuyi went home to mourn and Tang Xunfang acted in his place.',
  ],
  s0444: [
    'Fu Qing and Jingwen were ordered to handle Tibetan affairs jointly.',
    'Fu Qing and Jingwen were put in charge of Tibet together.',
  ],
  s0445: [
    'Sengge Rinchen was ordered to command Huai-north armies to suppress and pacify Miao and Nian.',
    'Sengge Rinchen took Huai-north command to fight and pacify Miao and Nian rebels.',
  ],
  s0446: [
    'On day xinwei, Shaanxi Muslims fled west to Tongzhou; the Chaoyi route opened.',
    'On xinwei, Shaanxi Hui fled west to Tongzhou and the road to Chaoyi cleared.',
  ],
  s0447: [
    'Rebel chief Hong Ronghai surrendered to Bao Chao and led his followers to take Guangde.',
    'Hong Ronghai surrendered to Bao Chao and used his men to seize Guangde.',
  ],
  s0448: [
    'On day renshen, the Beixinjing siege was lifted and Shanghai defenses were cleared.',
    'On renshen, Beixinjing was relieved and the Shanghai front quieted.',
  ],
  s0449: [
    'On day guiwei, Gansu Muslims fled into Fengxiang.',
    'On guiwei, Gansu Hui rebels slipped into Fengxiang.',
  ],
  s0450: [
    'Guangdong and Nian rebels jointly invaded Xichuan and took Zhuxi and Zhushan.',
    'Cantonese and Nian rebels together hit Xichuan and captured Zhuxi and Zhushan.',
  ],
  s0451: [
    'On day jiaxu, the princes\' request was granted to halt escort of the burial shift to the mausoleum; near-branch imperial princes were to be discussed to perform the rites.',
    'On jiaxu, the court stopped sending the coffin escort to the mausoleum and would name a close prince to officiate.',
  ],
  s0452: [
    'Zhenjiang established a customs office to collect foreign trade tax.',
    'Zhenjiang opened a customs house for foreign duties.',
  ],
  s0453: [
    'On day bingzi, Sheng Bao was told to order Ma Dezhao\'s army to camp in the Changwu area against Muslims fleeing into Gansu.',
    'On bingzi, Sheng Bao was to post Ma Dezhao at Changwu to block Hui fleeing into Gansu.',
  ],
  s0454: [
    'Lei Zhengwan was promoted Shaanxi provincial commander.',
    'Lei Zhengwan became Shaanxi provincial commander.',
  ],
  s0455: [
    'On day dingchou, Taiwan forces relieved the Jiayi siege.',
    'On dingchou, Taiwan troops lifted the siege of Jiayi.',
  ],
  s0456: [
    'Government troops recovered Chuzhou and Jinyun.',
    'Imperial forces retook Chuzhou and Jinyun.',
  ],
  s0457: [
    'Regional commander Huang Kaibang was ordered to take over Tian Zaitian\'s army.',
    'Huang Kaibang was told to assume command of Tian Zaitian’s troops.',
  ],
  s0458: [
    'On day wuyin, Zhili was allowed to recruit mounted braves against horse bandits.',
    'On wuyin, Zhili could raise cavalry to hunt horse bandits.',
  ],
  s0459: [
    'Government troops recovered Qingxi.',
    'Imperial forces retook Qingxi.',
  ],
  s0460: [
    'Qiling was ordered to devote himself to Zhejiang relief operations.',
    'Qiling was told to focus on aiding Zhejiang.',
  ],
  s0461: [
    'On day jimao, Shandong forces won a great victory over Nian rebels.',
    'On jimao, Shandong troops routed the Nian in a major fight.',
  ],
  s0462: [
    'Sheng Bao reported defeating Muslims at Xiekou, lifting Xi\'an\'s siege; rebels fled north of the Wei.',
    'Sheng Bao beat Hui rebels at Xiekou, freed Xi’an, and drove them north of Wei.',
  ],
  s0463: [
    'He was admonished with discretionary blame.',
    'The court rebuked him but left punishment to his discretion.',
  ],
  s0464: [
    'Lei Zhengwan was ordered to assist Sheng Bao.',
    'Lei Zhengwan was sent to help Sheng Bao.',
  ],
  s0465: [
    'Yuyao in Zhejiang and Yangshuo in Guangxi were recovered.',
    'Zhejiang retook Yuyao and Guangxi retook Yangshuo.',
  ],
  s0466: [
    'As Guangdong rebels fled into Wen township, Zheng Yuanshan\'s army was urged to the Yellow and Luo rivers.',
    'Cantonese rebels entered Wen township, so Zheng Yuanshan was pressed toward the Yellow and Luo.',
  ],
  s0467: [
    'Intercalary eighth month, first day xinsi: Qingduan\'s forces recovered Jinyun.',
    'On the xinsi new moon in intercalary month 8, Qingduan retook Jinyun.',
  ],
  s0468: [
    'On day jiashen, Dolonga\'s army took Jingzi Pass.',
    'On jiashen, Dolonga seized Jingzi Pass.',
  ],
  s0469: [
    'On day yiyou, Hubei troops recovered Zhushan and Zhuxi.',
    'On yiyou, Hubei forces retook Zhushan and Zhuxi.',
  ],
  s0470: [
    'Guizhou troops recovered Tianzhu and Qiongshui.',
    'Guizhou forces retook Tianzhu and Qiongshui.',
  ],
  s0471: [
    'Guangdong rebels fled to Laohekou.',
    'Cantonese rebels slipped to Laohekou.',
  ],
  s0472: [
    'Muslim rebels besieged Jingyang; Lei Zhengwan\'s army was ordered forward.',
    'Hui rebels besieged Jingyang and Lei Zhengwan was told to attack.',
  ],
  s0473: [
    'Xi\'an siege alert was lifted.',
    'Xi’an stood down from emergency alert.',
  ],
  s0474: [
    'On day dinghai, Muslims at Fakumen fought each other; Yuming and others dispersed them.',
    'On dinghai, Fakumen Muslims clashed and Yuming broke them up.',
  ],
  s0475: [
    'Wen Yu and Tan Tingxiang were urged to catch horse bandits on the Zhili-Shandong border.',
    'Wen Yu and Tan Tingxiang were pressed to hunt border horse bandits in Zhili and Shandong.',
  ],
  s0476: [
    'On day wuzi, Muslim rebels again attacked Xi\'an.',
    'On wuzi, Hui rebels struck Xi’an again.',
  ],
  s0477: [
    'Yunnan rebels from Sichuan fled into Zhuanping.',
    'Yunnan bandits coming through Sichuan fled into Zhuanping.',
  ],
  s0478: [
    'Guangdong rebels from Wen township fled into Yongning.',
    'Cantonese rebels left Wen township for Yongning.',
  ],
  s0479: [
    'Henan was allowed to collect Changlu salt transit tax for military funds.',
    'Henan could use Changlu salt levies to fund the army.',
  ],
  s0480: [
    'On day jichou, Hong Ronghai\'s surrendered followers rebelled again and held Guangde.',
    'On jichou, Hong Ronghai’s men mutinied again and seized Guangde.',
  ],
  s0481: [
    'On day xinmao, Dolonga\'s army won a great victory over Nian rebels and relieved Shangnan\'s siege.',
    'On xinmao, Dolonga routed the Nian and lifted the siege of Shangnan.',
  ],
  s0482: [
    'Jilin and Heilongjiang horse detachments stationed at Nan Yuan were transferred to Shanxi.',
    'Nan Yuan’s Jilin and Heilongjiang cavalry were sent to Shanxi.',
  ],
  s0483: [
    'On day renchen, Han Chao and regional commander Jiang Zhongyi were told to manage Guizhou affairs and block Lin Ziqing\'s forces from entering Guizhou.',
    'On renchen, Han Chao and Jiang Zhongyi were to run Guizhou and stop Lin Ziqing from marching in.',
  ],
  s0484: [
    'Li Tangjie was made Grand Councilor.',
    'Li Tangjie joined the Grand Council.',
  ],
  s0485: [
    'Deleke Duoerji and others were to increase troops patrolling river defenses.',
    'Deleke Duoerji and others added men to patrol the river line.',
  ],
  s0486: [
    'On day jiawu, provinces were told to cut excessive county expenses.',
    'On jiawu, every province was ordered to slash wasteful county spending.',
  ],
  s0487: [
    'Beijing appeal cases were assigned exclusively to provincial surveillance commissioners for trial.',
    'Capital appeals would be tried only by provincial surveillance commissioners.',
  ],
  s0488: [
    'On day yiwei, an edict called for recommending talent.',
    'On yiwei, the throne asked for talent nominations.',
  ],
  s0489: [
    'Xue Huan and Li Hongzhang were ordered to handle Prussian treaty renewal.',
    'Xue Huan and Li Hongzhang were put in charge of renewing the Prussian treaty.',
  ],
  s0490: [
    'All provinces were ordered to speed Beijing funds.',
    'Every province was told to hurry payments to the capital.',
  ],
  s0491: [
    'On day bingshen, Woren was made grand secretary.',
    'On bingshen, Woren became a grand secretary.',
  ],
  s0492: [
    'Dolonga was ordered to hold Wuguan Pass.',
    'Dolonga was told to guard Wuguan.',
  ],
  s0493: [
    'On day wuxu, Dolonga won a great victory over Nian rebels fleeing west from Bo and Ying; he was awarded the yellow riding jacket.',
    'On wuxu, Dolonga crushed Nian fleeing west from Bo and Ying and won a yellow jacket.',
  ],
  s0494: [
    'Guangdong rebels again took Cixi; government troops with British and French forces recovered it; Ward died in battle.',
    'Cantonese rebels retook Cixi; allied Chinese, British, and French troops recovered it and Ward fell in battle.',
  ],
  s0495: [
    'On day gengzi, Lao Chongguang and others were told to supply Beijing granaries; Jiangsu and other provinces were to send new tribute grain in kind to the capital.',
    'On gengzi, Lao Chongguang was to feed Beijing granaries and Jiangsu and others were to ship new grain tribute in kind.',
  ],
  s0496: [
    'Zhang Liangji memorialized against Xu Zhiming and Cen Yuying for arrogance.',
    'Zhang Liangji accused Xu Zhiming and Cen Yuying of bullying their offices.',
  ],
  s0497: [
    'French general Lebreton was allowed to remain defending Ningbo.',
    'General Lebreton could stay to defend Ningbo.',
  ],
  s0498: [
    'Pan Duo was ordered to pacify Han and Muslim populations in Yunnan.',
    'Pan Duo was told to reconcile Han and Hui in Yunnan.',
  ],
  s0499: [
    'On day xinchou, Yuan Jiasan\'s home leave was granted; Tang Xunfang was sent to Linhuai to take over military affairs and Ma Xinyi temporarily commanded Yuan\'s army.',
    'On xinchou, Yuan Jiasan went home, Tang Xunfang took Linhuai command, and Ma Xinyi held Yuan’s troops for now.',
  ],
  s0500: [
    'Zeng Guofan asked that a senior minister be appointed to coordinate military affairs; the throne refused but continued to encourage him and sent orders inquiring after troops stricken by epidemic.',
    'Zeng Guofan wanted a grand coordinator; the emperor said no but kept encouraging him and sent regards to sick soldiers.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_021_b05.mjs <translation.json>'
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

