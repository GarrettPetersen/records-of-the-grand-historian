#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0701: [
    'On day bingshen, renewed opium prohibition terms were concluded with the British minister, the strict ban was reaffirmed, and China and foreign countries were ordered to enforce it in earnest.',
    'On bingshen day Britain renewed opium terms, the ban was reaffirmed, and all were told to enforce it.',
  ],
  s0702: [
    'Intercalary sixth month, day jihai: Baoxi was appointed opium prohibition minister.',
    'In intercalary month 6, jihai, Baoxi became opium prohibition minister.',
  ],
  s0703: [
    'On day gengzi, Enshou was excused on grounds of illness; Yu Chengge was made Shaanxi governor.',
    'On gengzi day Enshou quit for illness and Yu Chengge became Shaanxi governor.',
  ],
  s0704: [
    'On day guimao, heavy rain in Anhui raised the Yangtze tide; flooded counties along the river received fifty thousand taels for relief.',
    'On guimao day Anhui\'s Yangtze flood counties received 50,000 taels.',
  ],
  s0705: [
    'On day gengxu, Yu Chengge was transferred to Hunan governor and Yang Wending to Shaanxi governor.',
    'On gengxu day Yu Chengge went to Hunan and Yang Wending to Shaanxi.',
  ],
  s0706: [
    'On day renzi, an edict ordered that this year\'s assembly of the Imperial Guard and nearby garrison armies at Yongping for grand maneuvers should have Staff Minister Prince Zaitao attend in the regent\'s place to oversee the troops.',
    'On renzi day Yongping maneuvers were ordered with Prince Zaitao overseeing for the regent.',
  ],
  s0707: [
    'On day guichou, Princes Pulun and Zaize were ordered to join the Imperial Clan Court in drafting the imperial house code.',
    'On guichou day Princes Pulun and Zaize joined the clan court to draft the imperial code.',
  ],
  s0708: [
    'On day yimao, revolutionaries struck Guangdong naval commander Li Zhun with an explosive device; he was wounded but survived.',
    'On yimao day revolutionaries bombed Guangdong naval commander Li Zhun, who survived wounded.',
  ],
  s0709: [
    'Former Jilin General Ming\'an died.',
    'Former Jilin General Ming\'an died.',
  ],
  s0710: [
    'On day bingchen, Zai Zhen, Lu Runxiang, Zengqi, Chen Baochen, Ding Zhenduo, Yao Xiguang, Shen Yunpei, Cheng Xun, Qingrui, and Zhu Zumou were all made Privy Council advisers; State Ministers Yikuang, Natong, Xu Shichang, Liang Dunyan, Shanqi, Zaize, Tang Jingchong, Yin Chang, Zaixun, Shaochang, Pulun, Sheng Xuanhuai, and Shouqi, together with Imperial Clan Court Director Shiro, Chief of the Imperial Household Department Kuichun, and Jilu, were all made concurrent Privy Council advisers.',
    'On bingchen day Zai Zhen, Lu Runxiang, and others became privy advisers; Yikuang, Natong, Xu Shichang, and other state ministers also advised the privy council.',
  ],
  s0711: [
    'On day dingsi, Shanqi was transferred to Minister of Dependencies and Gui Chun acted as Minister of Civil Affairs.',
    'On dingsi day Shanqi took dependencies and Gui Chun acted for civil affairs.',
  ],
  s0712: [
    'Fengshan was transferred to Guangzhou general; Shouqi was made Jingzhou general.',
    'Fengshan became Guangzhou general and Shouqi Jingzhou general.',
  ],
  s0713: [
    'Yan Kai and other leaders of the Sichuan Railway Shareholders\' Association memorialized impeaching the Ministry of Posts and Communications; Zhao Erfeng reported it and no response was given.',
    'Sichuan railway shareholders impeached posts through Zhao Erfeng and got no answer.',
  ],
  s0714: [
    'On day xinyou, chief counties of provincial prefectures were cut and local trial courts established.',
    'On xinyou day provincial chief counties were cut and local courts set up.',
  ],
  s0715: [
    'On day yichou, the Cabinet asked to revise regulations.',
    'On yichou day the cabinet asked to revise regulations.',
  ],
  s0716: [
    'Seventh month, day renshen: Zhao Erfeng memorialized that with trunk railways nationalized, Sichuan people still widely misunderstood and pressed demands in groups.',
    'In month 7, renshen, Zhao Erfeng said Sichuan still misunderstood nationalization and pressed demands.',
  ],
  s0717: [
    'The Ministry of Posts and Communications and the railway superintendent were ordered to clear railway shares and make the methods plain to dispel public doubt.',
    'Posts and the railway chief were told to settle shares and explain the plan.',
  ],
  s0718: [
    'On day jiaxu, Ruicheng, Zhang Mingqi, Zhao Erfeng, and Yu Chengge were each ordered to handle railway affairs jointly within their jurisdictions.',
    'On jiaxu day Ruicheng, Zhang Mingqi, Zhao Erfeng, and Yu Chengge were told to handle railways in their provinces.',
  ],
  s0719: [
    'Duanfang was ordered to go to Sichuan to investigate railway affairs.',
    'Duanfang was sent to Sichuan to investigate railways.',
  ],
  s0720: [
    'On day dingchou, because Sichuan popular feeling was unsettled and agitation should be guarded against, Brigade Commander Tian Zhenbang was ordered strictly to restrain his camp and suppress; Duanfang was urged to go swiftly to Sichuan and permitted to bring troops.',
    'On dingchou day Tian Zhenbang was told to hold his troops and Duanfang to hurry to Sichuan with soldiers.',
  ],
  s0721: [
    'Zhao Erfeng and Yukun with brigade commanders and provincial officials memorialized that the Sichuan people\'s railway struggle was fierce and asked the Political Consultative Assembly to decide to return to merchant management; it was not permitted, and Zhao Erfeng was still charged to suppress and disperse them.',
    'Zhao Erfeng and Yukun asked the assembly to restore merchant railways; the court refused and ordered suppression.',
  ],
  s0722: [
    'On day jimao, heavy rain in Jiangsu jurisdictions broke dikes; crops were submerged; forty thousand taels were issued for relief.',
    'On jimao day Jiangsu floods broke dikes and received 40,000 taels.',
  ],
  s0723: [
    'The Yongding River burst its banks.',
    'The Yongding River burst.',
  ],
  s0724: [
    'Duanfang entered Sichuan; new and old land and water forces were placed at his disposal.',
    'Duanfang entered Sichuan with all land and water forces at his call.',
  ],
  s0725: [
    'Lu Zhengxiang was transferred to minister to Russia; Liu Jingren to minister to the Netherlands.',
    'Lu Zhengxiang went to Russia and Liu Jingren to the Netherlands.',
  ],
  s0726: [
    'On day xinsi, Zhongrui was excused; Guifang was made Kobdo Commissioner.',
    'On xinsi day Zhongrui left office and Guifang became Kobdo commissioner.',
  ],
  s0727: [
    'Puyi was excused; Sayintu was made Kobdo Deputy Commissioner.',
    'Puyi left Kobdo and Sayintu became deputy commissioner.',
  ],
  s0728: [
    'On day renwu, disorder broke out in Sichuan; Zhao Erfeng arrested Consultative Assembly Speaker Pu Dianjun, Vice Speaker Luo Lun, Railway Protection League head Deng Xiaoke, Shareholders\' Association head Yan Kai, Zhang Lan, Hu Rong, Jiang Sanheng, Ye Bingcheng, and Wang Mingxin—nine men in all.',
    'On renwu day Sichuan rose; Zhao Erfeng arrested Pu Dianjun, Luo Lun, Deng Xiaoke, Yan Kai, Zhang Lan, and five others.',
  ],
  s0729: [
    'Soon the league gathered a crowd and besieged the governor\'s office; they were driven off only after attack.',
    'Soon the league besieged the governor\'s office and was driven off by force.',
  ],
  s0730: [
    'Disaster relief was given for Hang, Jia, Hu, and Shao prefectures in Zhejiang.',
    'Zhejiang\'s Hang, Jia, Hu, and Shao prefectures were fed.',
  ],
  s0731: [
    'On day guiwei, the Emperor began study; Grand Secretary Lu Runxiang and Vice Minister Chen Baochen taught reading; Vice Commander-in-Chief Yiketan taught Manchu and Qing script.',
    'On guiwei day the Emperor began study under Lu Runxiang, Chen Baochen, and Yiketan for Manchu.',
  ],
  s0732: [
    'Hubei flood victims were relieved.',
    'Hubei flood victims were fed.',
  ],
  s0733: [
    'On day jiashen, dikes in Chenghai county, Guangdong, broke; forty thousand taels were issued for relief.',
    'On jiashen day Guangdong\'s Chenghai dikes broke and received 40,000 taels.',
  ],
  s0734: [
    'Sichuan people in Beijing met over the railway struggle and submitted a petition to the Political Consultative Assembly asking it to memorialize on their behalf.',
    'Sichuan residents in Beijing petitioned the assembly over the railway fight.',
  ],
  s0735: [
    'Representative Liu Shengyuan was ordered arrested and sent back to his native place.',
    'Representative Liu Shengyuan was arrested and sent home.',
  ],
  s0736: [
    'The Ministry of Education was ordered to restrain students from foreign affairs, and officials were charged to forbid mass meetings.',
    'Education was told to keep students out of politics and mass meetings were banned.',
  ],
  s0737: [
    'On day dinghai, Jinan and eastern and western route counties in Shandong suffered flood; the Yellow River upstream levee broke again; fifty thousand taels were issued for relief.',
    'On dinghai day Shandong and the Yellow River upstream flooded and received 50,000 taels.',
  ],
  s0738: [
    'Fujian flood victims were relieved.',
    'Fujian flood victims were fed.',
  ],
  s0739: [
    'On day wuzi, former Liang-Guang Governor-General Cen Chunxuan was sent to Sichuan to join Zhao Erfeng in pacification and suppression.',
    'On wuzi day Cen Chunxuan was sent to Sichuan with Zhao Erfeng to pacify and suppress.',
  ],
  s0740: [
    'On day jichou, the Prince Regent reviewed the Imperial Guard.',
    'On jichou day the Prince Regent reviewed the guard.',
  ],
  s0741: [
    'On day guisi, because of disorder among the Sichuan people, Zhao Erfeng was ordered to command all armies swiftly to scatter them, while distinguishing good from bad in suppression and pacification and pardoning those coerced.',
    'On guisi day Zhao Erfeng was told to scatter Sichuan rebels, spare the coerced, and punish ringleaders.',
  ],
  s0742: [
    'On day jiawu, wild tribes of Bomi submitted.',
    'On jiawu day Bomi tribes submitted.',
  ],
  s0743: [
    'Eighth month, day bingshen: Inspector General of Customs Robert Hart died and was posthumously given the rank of Junior Guardian of the Heir Apparent.',
    'In month 8, bingshen, Inspector General Hart died and received Junior Guardian of the Heir Apparent rank.',
  ],
  s0744: [
    'Former Chengdu General and former Ili General Ma Liang was granted a temple at Ili.',
    'Former Chengdu and Ili General Ma Liang received a temple at Ili.',
  ],
  s0745: [
    'On day renyin, Prince Qing Yikuang again asked to be excused as Prime Minister and director of foreign affairs; it was not permitted.',
    'On renyin day Prince Qing Yikuang tried again to quit the cabinet and foreign affairs and was refused.',
  ],
  s0746: [
    'On day jiachen, Zhili provincial and brigade commands, Tongyong, Tianjin, Zhengding, Daming, and Xuanhua garrison commands, officers, and cavalry and infantry were cut; the brigade commander remained.',
    'On jiachen day Zhili provincial, brigade, and garrison posts and troops were cut but brigade commanders kept.',
  ],
  s0747: [
    'On day bingwu, Jiangnan Brigade Commander Liu Guangcai was excused on grounds of illness; Zhang Xun replaced him; Zhang Huaizhi was made Gansu brigade commander.',
    'On bingwu day Liu Guangcai quit, Zhang Xun took Jiangnan, and Zhang Huaizhi took Gansu.',
  ],
  s0748: [
    'On day dingwei, state music was fixed.',
    'On dingwei day state music was set.',
  ],
  s0749: [
    'On day gengxu, the Salt Administration Bureau was established with ministers and subordinate officers; the Salt Affairs Office was abolished.',
    'On gengxu day the Salt Administration Bureau replaced the Salt Affairs Office.',
  ],
  s0750: [
    'Zaize was ordered to serve concurrently as Salt Administration Minister.',
    'Zaize also took salt administration.',
  ],
  s0751: [
    'On day guichou, Duanfang and Ruicheng memorialized that within Hubei the Guang-Han and Chuan-Han railways were changed to state ownership, merchant companies canceled, and methods for receiving shares set; an edict praised this and rewarded gentry and scholars for grasping the great principle.',
    'On guichou day Duanfang and Ruicheng nationalized Guang-Han and Chuan-Han lines in Hubei and were praised.',
  ],
  s0752: [
    'On day jiazi, revolutionaries plotted disorder at Wuchang; the plot was discovered, thirty-two were arrested, and Liu Ru\'ao and three others were executed.',
    'On jiazi day a Wuchang plot was uncovered, thirty-two arrested, and Liu Ru\'ao and three executed.',
  ],
  s0753: [
    'Ruicheng reported it; an edict praised his quelling trouble at the first sprout and settling disorder in a moment, ordered strict interrogation of those captured, and pursuit of fugitives.',
    'Ruicheng reported it; the court praised early suppression and ordered harsh interrogation and pursuit.',
  ],
  s0754: [
    'On day yimao, Wuchang\'s new army mutinied and joined the revolutionaries; Governor Ruicheng abandoned the city and fled, and Wuchang fell.',
    'On yimao day Wuchang\'s new army mutinied, Ruicheng fled, and the city fell.',
  ],
  s0755: [
    'An edict stripped Ruicheng of office but still ordered him to act as governor and redeem guilt by achievement.',
    'Ruicheng lost his post but stayed as acting governor to redeem himself.',
  ],
  s0756: [
    'Army Minister Yin Chang was ordered to lead troops in suppression; all Hubei forces and reinforcements were placed under his command; Sa Zhenbing led warships and Cheng Yunhe led the navy in support.',
    'Yin Chang was sent to suppress Wuchang with Hubei forces, Sa Zhenbing\'s fleet, and Cheng Yunhe\'s navy.',
  ],
  s0757: [
    'On day bingchen, Zhang Biao, because soldiers and bandits had joined in mutiny, abandoned camp and fled in secret; he was stripped of Hubei brigade command but still charged with suppressing bandits.',
    'On bingchen day Zhang Biao fled a mutiny, lost Hubei command, but still had to fight bandits.',
  ],
  s0758: [
    'The Yongping grand maneuvers were suspended.',
    'Yongping maneuvers were canceled.',
  ],
  s0759: [
    'The ban on grain transport through Shanxi and Henan was lifted.',
    'Shanxi and Henan grain transport bans were lifted.',
  ],
  s0760: [
    'Wuchang\'s soldiers and people installed Colonel Li Yuanhong of the Twenty-first Mixed Brigade as governor and set up a military government.',
    'Wuchang made Li Yuanhong of the Twenty-first Mixed Brigade governor and founded a military government.',
  ],
  s0761: [
    'Thereafter each province seized troops and territory and declared independence; those chosen as leaders were all called governors.',
    'Then provinces seized troops, declared independence, and called their leaders governors.',
  ],
  s0762: [
    'Revolutionary forces took Hanyang, raided the arsenal and ironworks, and held Hankou.',
    'Revolutionaries took Hanyang, seized the arsenal and ironworks, and held Hankou.',
  ],
  s0763: [
    'On day dingsi, Yuan Shikai was recalled as Huguang governor-general and Cen Chunxuan as Sichuan governor-general, both to supervise suppression and pacification.',
    'On dingsi day Yuan Shikai became Huguang governor-general and Cen Chunxuan Sichuan governor-general for suppression.',
  ],
  s0764: [
    'Prince Zaitao was ordered to command the Imperial Guard and nearby armies to guard the capital region.',
    'Prince Zaitao was told to hold the guard and nearby armies around the capital.',
  ],
  s0765: [
    'On day wuwu, Wang Renwen was dismissed; Zhao Erfeng was again made Sichuan-Yunnan Border Affairs Minister.',
    'On wuwu day Wang Renwen left and Zhao Erfeng returned to Sichuan-Yunnan border affairs.',
  ],
  s0766: [
    'Fengtian\'s tribute for this year was suspended.',
    'Fengtian tribute was suspended for the year.',
  ],
  s0767: [
    'On day jiwei, Cen Chunxuan declined Sichuan governor-general; the edict did not permit.',
    'On jiwei day Cen Chunxuan tried to refuse Sichuan and was refused.',
  ],
  s0768: [
    'Liang Dunyan was urged to come to the capital for duty.',
    'Liang Dunyan was summoned to Beijing.',
  ],
  s0769: [
    'The capital opened fair-price grain sales to relieve the people\'s food supply.',
    'Beijing sold grain at fair price.',
  ],
  s0770: [
    'On day renxu, an edict placed all Yangtze land and water forces under Yuan Shikai\'s command.',
    'On renxu day all Yangtze land and water forces went to Yuan Shikai.',
  ],
  s0771: [
    'It was stated that in Sichuan and Huguang military operations, those originally coerced, if they came over of themselves, would not be punished for the past; if they followed the army and proved effective, or captured and presented bandit leaders, they would be richly rewarded.',
    'Sichuan and Huguang coerced men who defected would be spared; those who served or captured rebels would be rewarded.',
  ],
  s0772: [
    'Registers of rebels captured were to be destroyed and no guilt extended by association.',
    'Rebel registers were to be burned and kin left alone.',
  ],
  s0773: [
    'Disturbed places in the two provinces were to be comforted.',
    'War-torn districts in both provinces were to be comforted.',
  ],
  s0774: [
    'The cutting of Green Standard and patrol forces in each province was waived.',
    'Provincial Green Standard and patrol cuts were canceled.',
  ],
  s0775: [
    'Shouqi was excused; Lian Kui was made Jingzhou general.',
    'Shouqi left office and Lian Kui became Jingzhou general.',
  ],
  s0776: [
    'On day guihai, the Empress Dowager\'s benevolent edict issued two hundred thousand taels to relieve Hubei people afflicted by war.',
    'On guihai day the empress dowager sent 200,000 taels for Hubei war victims.',
  ],
  s0777: [
    'Longxi and Nanjing counties in Fujian overflowed and dikes broke; twenty thousand taels were issued for relief.',
    'Fujian\'s Longxi and Nanjing floods received 20,000 taels.',
  ],
  s0778: [
    'Because Hubei was at war, Shandong and Shanxi were ordered to purchase and transport grain to supply the army.',
    'Shandong and Shanxi were told to buy grain for the Hubei army.',
  ],
  s0779: [
    'On day jiazi, Vice Commander-in-Chief Wang Shizhen was ordered to assist in Hubei military affairs.',
    'On jiazi day Wang Shizhen was sent to assist Hubei military affairs.',
  ],
  s0780: [
    'Ninth month, new moon day yichou: there was an eclipse of the sun.',
    'On month 9\'s yichou new moon the sun was eclipsed.',
  ],
  s0781: [
    'The Political Consultative Assembly opened its second session; an edict exhorted the members.',
    'The assembly\'s second session opened under an exhorting edict.',
  ],
  s0782: [
    'Hunan\'s new army mutinied; Governor Yu Chengge fled to a warship; Patrol Commander and former Guangxi Youjiang Brigade Commander Huang Zhonghao died.',
    'Hunan\'s new army mutinied; Yu Chengge fled to a ship and Huang Zhonghao was killed.',
  ],
  s0783: [
    'On day bingyin, Shaanxi\'s new army mutinied; Acting Governor and Provincial Treasurer Qian Nengxun tried suicide and failed, then fled to Tong Pass; Xi\'an General Wen Rui and Vice Commanders-in-Chief Cheng Yan and Keming\'e all died.',
    'On bingyin day Shaanxi mutinied; Qian Nengxun fled to Tong Pass and Wen Rui, Cheng Yan, and Keming\'e died.',
  ],
  s0784: [
    'On day dingmao, the Empress Dowager\'s benevolent edict issued two hundred forty thousand taels from the inner treasury to relieve famine in Zhili, Jilin, Jiangsu, Anhui, Shandong, Zhejiang, Hunan, and Guangdong and established a charitable relief society.',
    'On dingmao day the empress dowager sent 240,000 taels for eight provinces\' famine and founded a relief society.',
  ],
  s0785: [
    'On day wuchen, Zhang Yintang was excused; Shi Zhaoji was made minister to Italy, Mexico, and Peru.',
    'On wuchen day Zhang Yintang left and Shi Zhaoji went to Italy, Mexico, and Peru.',
  ],
  s0786: [
    'Revolutionaries killed Guangzhou General Fengshan with an explosive device.',
    'Revolutionaries bombed and killed Guangzhou General Fengshan.',
  ],
  s0787: [
    'On day jisi, the Empress Dowager contributed from the inner treasury to the charitable relief society.',
    'On jisi day the empress dowager gave to the relief society.',
  ],
  s0788: [
    'The Political Consultative Assembly stated that Minister of Posts and Communications Sheng Xuanhuai had exceeded authority, violated law, deceived the throne, and clung to policy, brewing calamity and disorder, and was in truth the chief culprit who had ruined the state; an edict stripped him of office.',
    'The assembly impeached Sheng Xuanhuai as the ruin of the state and he was dismissed.',
  ],
  s0789: [
    'Duanfang memorialized that on investigation the Sichuan disorder arose from mutual strife between officials and people; he asked release of Consultative Assembly Speaker Pu Dianjun and Deng Xiaoke and eight others, and that Ministry of Justice Director Xiao Xiang detained in Hubei be exempted from prosecution; it was approved.',
    'Duanfang said Sichuan\'s trouble came from official-people strife and won release for Pu Dianjun, Deng Xiaoke, and eight others plus Xiao Xiang.',
  ],
  s0790: [
    'Tang Shaoyi was made Minister of Posts and Communications.',
    'Tang Shaoyi became posts minister.',
  ],
  s0791: [
    'Chen Bangrui was made Jiang-Anhui relief minister.',
    'Chen Bangrui took Jiang-Anhui relief.',
  ],
  s0792: [
    'On day gengwu, the Empress Dowager issued one million taels from the inner treasury to supply the Hubei army.',
    'On gengwu day the empress dowager sent one million taels to the Hubei army.',
  ],
  s0793: [
    'Yin Chang was recalled; Yuan Shikai was made Imperial Commissioner to supervise Hubei suppression and pacification and command all armies.',
    'Yin Chang returned; Yuan Shikai became imperial commissioner for Hubei with full army command.',
  ],
  s0794: [
    'Staff Officer Feng Guozhang was made commander of the First Army and Jiangbei Brigade Commander Duan Qirui commander of the Second Army, both under Yuan Shikai\'s command.',
    'Feng Guozhang took the First Army and Duan Qirui the Second, both under Yuan Shikai.',
  ],
  s0795: [
    'Chunlu was made Guangzhou general.',
    'Chunlu became Guangzhou general.',
  ],
  s0796: [
    'Posthumous honors were granted Guangzhou General Fengshan, who had been killed.',
    'Slain Guangzhou General Fengshan was posthumously honored.',
  ],
  s0797: [
    'Feng Guozhang fought the revolutionaries at Zhangkou; land and water forces jointly struck Hankou and recovered it.',
    'Feng Guozhang fought at Zhangkou and land-water forces retook Hankou.',
  ],
  s0798: [
    'On day renshen, because Ruicheng had lost Wuchang, boarded a warship to escape, and secretly fled the province—living in shame—an edict ordered him seized and sent to the capital for trial by the Ministry of Justice.',
    'On renshen day Ruicheng was arrested for abandoning Wuchang and fleeing on a warship.',
  ],
  s0799: [
    'On day guiyou, an edict confessed fault.',
    'On guiyou day the throne confessed fault.',
  ],
  s0800: [
    'Pulun and Zaize were ordered to draft constitutional articles and report swiftly.',
    'Pulun and Zaize were told to draft the constitution quickly.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_025_b08.mjs <translation.json>'
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
