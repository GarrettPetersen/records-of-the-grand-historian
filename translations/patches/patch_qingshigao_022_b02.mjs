#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'Disaster victims in Xiangyang and other prefectures were given relief.',
    'Xiangyang and other prefectures received disaster relief.',
  ],
  s0102: [
    'Tenth month, day guiwei: an edict told commanders-in-chief on each route and every governor-general and governor to enforce military discipline strictly.',
    'On month 10 guiwei, route commanders and all governors were ordered to tighten military discipline.',
  ],
  s0103: [
    'On day jiashen, Chahar commander-in-chief Se\'ergushan died; Urga commissioner Wensheng replaced him.',
    'On jiashen, Chahar commander Se\'ergushan died and Urga commissioner Wensheng replaced him.',
  ],
  s0104: [
    'On day yiyou, Zhang Tingyue was made Urga commissioner.',
    'On yiyou, Zhang Tingyue became Urga commissioner.',
  ],
  s0105: [
    'On day bingxu, Shaanxi forces recovered Ningtiaoliang and Yijun.',
    'On bingxu, Shaanxi troops retook Ningtiaoliang and Yijun.',
  ],
  s0106: [
    'Xi Baotian\'s army was ordered to Yuanzhou to command Guizhou relief forces.',
    'Xi Baotian was sent to Yuanzhou to command Guizhou relief.',
  ],
  s0107: [
    'On day renchen, Western Yunnan Muslims took Dingyuan and Dayao.',
    'On renchen, Yunnan Muslims took Dingyuan and Dayao.',
  ],
  s0108: [
    'On day guisi, Wang Yuanfang died.',
    'On guisi, Wang Yuanfang died.',
  ],
  s0109: [
    'Shen Guifen was ordered to study and serve on the Grand Council under councilors.',
    'Shen Guifen was assigned to study under Grand Councilors.',
  ],
  s0110: [
    'On day bingshen, Zeng Guoquan was removed for illness; Guo Boyin became Hubei governor and Su Fengwen Guangxi governor.',
    'On bingshen, ill Zeng Guoquan was replaced; Guo Boyin took Hubei and Su Fengwen Guangxi.',
  ],
  s0111: [
    'Flood victims in Shandong were given relief.',
    'Shandong flood victims received relief.',
  ],
  s0112: [
    'On day yisi, former American envoy Anson Burlingame was dispatched to treaty powers to handle Sino-foreign affairs.',
    'On yisi, Burlingame was sent to treaty powers on foreign affairs.',
  ],
  s0113: [
    'On day jiyou, Muslim rebels took Baoji and Zhengning, soon retaken.',
    'On jiyou, Muslims took Baoji and Zhengning but they were soon recovered.',
  ],
  s0114: [
    'Eleventh month, day gengxu, first day: Staff Director Zhi Gang and Director Sun Jiagu were sent to treaty powers as commissioners for foreign affairs.',
    'Month 11, gengxu: Zhi Gang and Sun Jiagu became foreign-affairs commissioners to treaty powers.',
  ],
  s0115: [
    'On day renzi, Liu Mingchuan\'s army routed rebels at Ganyu in a great victory; Ren Zhu was executed.',
    'On renzi, Liu Mingchuan won at Ganyu and executed Ren Zhu.',
  ],
  s0116: [
    'On day guichou, because bandit chiefs were spreading, Liu Changyou was stripped of office but still held to redeem himself.',
    'On guichou, Liu Changyou was dismissed yet kept to redeem himself as bandits spread.',
  ],
  s0117: [
    'Guanwen was ordered to act as Zhili governor-general.',
    'Guanwen was assigned acting Zhili governor-general.',
  ],
  s0118: [
    'On day bingchen, Shaanxi forces fought Nian bandits at Luochuan, met Muslim rebels, were defeated, and Regional Commander Li Xianghe died.',
    'On bingchen, Shaanxi troops lost at Luochuan to Muslims and Nian; Li Xianghe was killed.',
  ],
  s0119: [
    'On day guihai, Zhang Zongyu took Yan\'an and Suide.',
    'On guihai, Zhang Zongyu took Yan\'an and Suide.',
  ],
  s0120: [
    'On day jiazi, a Burultokhai commissioner was added; Li Yunlin was appointed, Mingyao as assistant, and Fu Ji as Kobdo assistant.',
    'On jiazi, Burultokhai got a commissioner: Li Yunlin, with Mingyao and Fu Ji assisting.',
  ],
  s0121: [
    'On day jiayin, Liu Mingchuan\'s army routed rebels at Zhucheng in a great victory.',
    'On jiayin, Liu Mingchuan won a great victory at Zhucheng.',
  ],
  s0122: [
    'On day dingchou, Shaanxi forces recovered Yan\'an and Suide.',
    'On dingchou, Shaanxi troops retook Yan\'an and Suide.',
  ],
  s0123: [
    'Twelfth month, day renwu: Zhang Zongyu fled into Jizhou; Zuo Zongtang and Zhao Changling were both stripped yet kept in office.',
    'Month 12 renwu: Zhang Zongyu fled to Jizhou; Zuo and Zhao were dismissed but kept.',
  ],
  s0124: [
    'Cheng Lu fought Muslim rebels at Suzhou, was defeated, and Brigadier Huang Zujin died.',
    'Cheng Lu lost at Suzhou to Muslims and Huang Zujin was killed.',
  ],
  s0125: [
    'On day guiwei, Chen Guorui was granted First Class Imperial Bodyguard and attached to Zuo Zongtang\'s army.',
    'On guiwei, Chen Guorui became a first-class bodyguard under Zuo Zongtang.',
  ],
  s0126: [
    'Liu Mingchuan and others routed rebels at Shouguang in a great victory.',
    'Liu Mingchuan won a great victory at Shouguang.',
  ],
  s0127: [
    'Western Yunnan Muslims took Lufeng, Guangtong, and Yuanmou.',
    'Yunnan Muslims took Lufeng, Guangtong, and Yuanmou.',
  ],
  s0128: [
    'On day jichou, government troops recovered Jizhou.',
    'On jichou, the army retook Jizhou.',
  ],
  s0129: [
    'On day renchen, Zhili bandit chiefs were pacified.',
    'On renchen, Zhili bandits were pacified.',
  ],
  s0130: [
    'On day jiawu, Liu Changyou was granted third-rank insignia and ordered to lead his troops home.',
    'On jiawu, Liu Changyou gained third rank and was sent home with his troops.',
  ],
  s0131: [
    'The Yongding River dike works were joined.',
    'The Yongding River dike was closed.',
  ],
  s0132: [
    'On day bingshen, Jiang Yizao was ordered to serve as acting surveillance commissioner under Zuo Zongtang and lead Hunan braves home.',
    'On bingshen, Jiang Yizao joined Zuo\'s command as acting intendant and led Hunan troops home.',
  ],
  s0133: [
    'On day dingyou, Luo Bingzhang died.',
    'On dingyou, Luo Bingzhang died.',
  ],
  s0134: [
    'Liu Songshan and others defeated Zhang Zongyu at Hongdong.',
    'Liu Songshan beat Zhang Zongyu at Hongdong.',
  ],
  s0135: [
    'Wu Tang was transferred to Sichuan governor-general; Ma Xinyi became Fujian-Zhejiang governor-general; Li Hanzhang was moved to Zhejiang governor and Ding Richang Jiangsu governor.',
    'Wu Tang went to Sichuan, Ma Xinyi to Fujian-Zhejiang, Li Hanzhang to Zhejiang, and Ding Richang to Jiangsu.',
  ],
  s0136: [
    'On day wuxu, the Huai army routed rebels at Gaoyou in a great victory, captured Lai Wenguang and others, and executed them.',
    'On wuxu, the Huai army won at Gaoyou, captured Lai Wenguang, and executed him.',
  ],
  s0137: [
    'On day xinchou, the eastern Nian were pacified; Li Hongzhang and Zeng Guofan were granted hereditary offices; Liu Mingchuan, Ying Han, Guo Songlin, Yang Dingxun, and Shan Qing received graded hereditary rewards; Zeng Guoquan\'s insignia was restored.',
    'On xinchou, the eastern Nian were pacified; Li and Zeng gained hereditary rank and Liu, Ying, and others graded rewards; Zeng Guoquan\'s insignia returned.',
  ],
  s0138: [
    'On day renyin, because Zuo Zongtang led the army into Shanxi, Kukejitai, Qiao Songnian, and Liu Dian were ordered to supervise Shaanxi military affairs.',
    'On renyin, as Zuo entered Shanxi, Kukejitai, Qiao Songnian, and Liu Dian took Shaanxi command.',
  ],
  s0139: [
    'On day jiachen, Yang Zhan\'ao was ordered to act as Gansu regional commander and take over western-route military affairs.',
    'On jiachen, Yang Zhan\'ao became acting Gansu commander for the western front.',
  ],
  s0140: [
    'On day wushen, Zuo Zongtang ordered Xi Chang and Liu Songshan and others to Cizhou for interception.',
    'On wushen, Zuo sent Xi Chang and Liu Songshan to Cizhou to intercept.',
  ],
  s0141: [
    'Zhang Yao, Liu Mingchuan, and others were edicted to join in suppression.',
    'Zhang Yao, Liu Mingchuan, and others were ordered to suppress jointly.',
  ],
  s0142: [
    'On day jiyou, Zheng Dunjin was sent to Shanxi to investigate affairs.',
    'On jiyou, Zheng Dunjin was sent to investigate in Shanxi.',
  ],
  s0143: [
    'This month, unopened salt-field levies in Zhejiang Renhe and elsewhere and deficient grain quotas in Yunnan Songming and other districts were remitted.',
    'This month, Zhejiang salt levies and Yunnan grain quotas were remitted.',
  ],
  s0144: [
    'This year, Korea and Ryukyu presented tribute.',
    'Korea and Ryukyu sent tribute this year.',
  ],
  s0145: [
    'Seventh year, spring, first month, day gengxu, first day: Nian chief Li Yun and others led their followers to surrender at Xuyi; an edict ordered them executed and the rest dispersed.',
    'Year 7, month 1 gengxu: Li Yun and other Nian chiefs surrendered at Xuyi, were executed, and their men dispersed.',
  ],
  s0146: [
    'Zhu Fengbiao was ordered to assist the Grand Secretariat.',
    'Zhu Fengbiao was assigned to assist grand secretaries.',
  ],
  s0147: [
    'On day yimao, Muslim rebels again took Zhengning.',
    'On yimao, Muslims retook Zhengning.',
  ],
  s0148: [
    'On day bingchen, Xi Chang and others routed Zhang Zongyu inside the Yellow River in a great victory.',
    'On bingchen, Xi Chang routed Zhang Zongyu on the Yellow River.',
  ],
  s0149: [
    'Xining Muslims took Beichuan.',
    'Xining Muslims took Beichuan.',
  ],
  s0150: [
    'Li Yunlin pleaded illness.',
    'Li Yunlin asked leave for illness.',
  ],
  s0151: [
    'It was not granted.',
    'The request was denied.',
  ],
  s0152: [
    'Xilun was made assistant Burultokhai commissioner.',
    'Xilun became assistant Burultokhai commissioner.',
  ],
  s0153: [
    'On day xinyou, Zhang Zongyu fled north to Dingzhou; Baoding was placed on alert; Guanwen and Zuo Zongtang were both stripped yet kept in office.',
    'On xinyou, Zhang Zongyu fled to Dingzhou, Baoding was alerted, and Guanwen and Zuo were dismissed but kept.',
  ],
  s0154: [
    'Yuliang was edicted to command Shenji Camp troops against the rebels.',
    'Yuliang was ordered to lead Shenji Camp troops against rebels.',
  ],
  s0155: [
    'On day renxu, Zhang Zongyu attacked Qingyuan; Liu Songshan, Guo Baochang, and other armies cut ahead of the rebels and were given preferential commendation.',
    'On renxu, Zhang Zongyu hit Qingyuan; Liu Songshan and Guo Baochang cut ahead and were commended.',
  ],
  s0156: [
    'Chen Guorui, Song Qing, and Zhang Yao all reached Baoding with their armies.',
    'Chen Guorui, Song Qing, and Zhang Yao reached Baoding.',
  ],
  s0157: [
    'The Dalai Lama asked pardon for the death sentence of Dongdeng Gongbu, who had offended at Litang; it was granted.',
    'The Dalai Lama\'s plea for Dongdeng Gongbu at Litang was granted.',
  ],
  s0158: [
    'Jia Zhen and others were ordered to establish a general bureau for militia defense.',
    'Jia Zhen and others were told to set up a militia defense bureau.',
  ],
  s0159: [
    'On day guihai, Tianjin foreign-rifle and training battalions were ordered to Hejian to link defenses with Shandong forces.',
    'On guihai, Tianjin rifle and training units were sent to Hejian to join Shandong.',
  ],
  s0160: [
    'On day jiazi, Li Hongzhang sent Zhou Shengbo and other armies north in relief.',
    'On jiazi, Li Hongzhang sent Zhou Shengbo north to relieve.',
  ],
  s0161: [
    'Zuo Zongtang was urged to Baoding to supervise northern suppression.',
    'Zuo Zongtang was urged to Baoding to command the north.',
  ],
  s0162: [
    'Prince Gong was ordered with Shenji Camp princes to manage patrol defense.',
    'Prince Gong and Shenji princes were assigned patrol defense.',
  ],
  s0163: [
    'On day renshen, Ying Han was allowed to enter the capital region in defense; he was ordered to command Niu Shihan\'s army south of the Yellow River.',
    'On renshen, Ying Han entered the capital region and held Niu Shihan\'s army south of the Yellow River.',
  ],
  s0164: [
    'Cheng Wenbing\'s army was ordered to Hejian for joint suppression.',
    'Cheng Wenbing was sent to Hejian for joint operations.',
  ],
  s0165: [
    'On day guiyou, Zhang Zongyu took Raoyang, soon retaken.',
    'On guiyou, Zhang Zongyu took Raoyang but it was soon recovered.',
  ],
  s0166: [
    'Jia Zhen retired for illness.',
    'Jia Zhen retired ill.',
  ],
  s0167: [
    'On day yihai, Zuo Zongtang was ordered to command all government armies on every route.',
    'On yihai, Zuo Zongtang was made supreme commander of all routes.',
  ],
  s0168: [
    'Second month, day xinsi: government troops recovered Weiyuan.',
    'Month 2 xinsi: the army retook Weiyuan.',
  ],
  s0169: [
    'On day guiwei, Prince Gong was ordered to control commanders-in-chief on every route.',
    'On guiwei, Prince Gong was given authority over all route commanders.',
  ],
  s0170: [
    'On day wuzi, Muslim rebels again took Ningtiaoliang.',
    'On wuzi, Muslims retook Ningtiaoliang.',
  ],
  s0171: [
    'On day jichou, Muslim rebels fled to Yikeshaba\'er; government troops beat them back.',
    'On jichou, Muslims fled to Yikeshaba\'er and were driven back.',
  ],
  s0172: [
    'Zhao Changling and Chen Shi were stripped of office and banished.',
    'Zhao Changling and Chen Shi were dismissed and exiled.',
  ],
  s0173: [
    'On day renchen, Shaanxi forces recovered Baoji.',
    'On renchen, Shaanxi troops retook Baoji.',
  ],
  s0174: [
    'On day guisi, Yunnan forces lifted the siege of Zhenxiong.',
    'On guisi, Yunnan troops relieved Zhenxiong.',
  ],
  s0175: [
    'Western Yunnan Muslims took Chuxiong.',
    'Yunnan Muslims took Chuxiong.',
  ],
  s0176: [
    'On day yiwei, Henan and Anhui armies defeated Zhang Zongyu at Shulu.',
    'On yiwei, Henan and Anhui troops beat Zhang Zongyu at Shulu.',
  ],
  s0177: [
    'On day gengzi, Zuo Zongtang, Li Hongzhang, and other armies fought the rebels and repeatedly broke them.',
    'On gengzi, Zuo Zongtang and Li Hongzhang repeatedly defeated the rebels.',
  ],
  s0178: [
    'Muslim rebels took Huaiyuan and Shenmu.',
    'Muslims took Huaiyuan and Shenmu.',
  ],
  s0179: [
    'On day renyin, Baimiao Miao rebels surrendered.',
    'On renyin, Baimiao Miao rebels surrendered.',
  ],
  s0180: [
    'On day yisi, because Korea asked for strict border prohibitions, Yanshu and Yirong were sent to Fengtian with Duxing\'a to survey border extension.',
    'On yisi, Korea\'s border plea sent Yanshu and Yirong to Fengtian with Duxing\'a.',
  ],
  s0181: [
    'Third month, day renzi: Zhang Kaison pleaded illness; an edict rebuked his delay and evasion and stripped him of office.',
    'Month 3 renzi: ill Zhang Kaison was rebuked for delay and dismissed.',
  ],
  s0182: [
    'Muslim rebels took Fuzhou; Liu Dian stationed at Sanyuan to supervise suppression.',
    'Muslims took Fuzhou; Liu Dian held Sanyuan to command suppression.',
  ],
  s0183: [
    'On day guichou, Liu Yuezhao was made Yunnan-Guizhou governor-general and Cen Yuying Yunnan governor.',
    'On guichou, Liu Yuezhao became Yunnan-Guizhou governor-general and Cen Yuying Yunnan governor.',
  ],
  s0184: [
    'On day yimao, Shaanxi forces recovered Fuzhou.',
    'On yimao, Shaanxi troops retook Fuzhou.',
  ],
  s0185: [
    'On day guihai, Hanlin bachelors leaving the Academy were again to be examined in regulated verse and fu.',
    'On guihai, Hanlin graduates were again tested in verse and fu.',
  ],
  s0186: [
    'On day wuchen, Zhang Zongyu fled to Yanjin and Fengqiu; Liu Songshan and Guo Baochang defeated him.',
    'On wuchen, Zhang Zongyu fled to Yanjin and Fengqiu and was beaten by Liu Songshan and Guo Baochang.',
  ],
  s0187: [
    'On day xinwei, Shen Guifen was made Grand Councilor.',
    'On xinwei, Shen Guifen became a Grand Councilor.',
  ],
  s0188: [
    'On day yihai, Zhu Fengbiao was made Grand Secretary.',
    'On yihai, Zhu Fengbiao became Grand Secretary.',
  ],
  s0189: [
    'On day bingzi, Western Yunnan Muslims took Yimen.',
    'On bingzi, Yunnan Muslims took Yimen.',
  ],
  s0190: [
    'On day dingchou, Zhang Zongyu fled to Huaxian and was defeated.',
    'On dingchou, Zhang Zongyu fled to Huaxian and was defeated.',
  ],
  s0191: [
    'This month, overdue levies on flooded land in Zhili Anzhou and other places were remitted.',
    'This month, Zhili flood levies at Anzhou and elsewhere were remitted.',
  ],
  s0192: [
    'Fourth month, summer, day jimao, first day: Hami Muslims took Wubao; government troops beat them back.',
    'Month 4 jimao: Hami Muslims took Wubao but were driven back.',
  ],
  s0193: [
    'On day jiashen, Zhang Zongyu took Nanpi.',
    'On jiashen, Zhang Zongyu took Nanpi.',
  ],
  s0194: [
    'On day dinghai, Zuo Zongtang, Li Hongzhang, Ding Baozhen, and others were edicted to direct all armies in separate east and west routes along the Grand Canal for defense and suppression.',
    'On dinghai, Zuo, Li, and Ding were told to guard and suppress on both sides of the canal.',
  ],
  s0195: [
    'On day jichou, Miao rebel He Zhengguan surrendered.',
    'On jichou, Miao chief He Zhengguan surrendered.',
  ],
  s0196: [
    'On day gengyin, Shaanxi forces fought Muslim rebels at Binzhou, were defeated, and Tan Yulong died.',
    'On gengyin, Shaanxi troops lost at Binzhou to Muslims and Tan Yulong was killed.',
  ],
  s0197: [
    'On day jisi, the Yongding River burst its banks.',
    'On jisi, the Yongding River broke.',
  ],
  s0198: [
    'On day yiwei, Duxing\'a was summoned to the capital.',
    'On yiwei, Duxing\'a was called to the capital.',
  ],
  s0199: [
    'On day wuxu, Liping Miao attacked Huang and Yuan borders; government troops beat them back.',
    'On wuxu, Liping Miao raided Huang and Yuan and were driven back.',
  ],
  s0200: [
    'On day xinchou, Ningtiaoliang Muslims harassed Ordos nomads; Prince Zhanage\'erji drove them back.',
    'On xinchou, Ningtiaoliang Muslims raided Ordos and Prince Zhanage\'erji repulsed them.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_022_b02.mjs <translation.json>'
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
