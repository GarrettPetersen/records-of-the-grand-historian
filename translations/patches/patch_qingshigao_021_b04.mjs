#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    "On day dingchou, honorific titles were conferred on Empress Dowager Ci'an and Empress Dowager Cixi, and an edict proclaimed differential grace.",
    "On dingchou, Ci'an and Cixi received honorific titles and grace was proclaimed by edict.",
  ],
  s0302: [
    "On day wuyin, Duo Long'a's army took Luzhou; rebel leader Chen Yucheng fled into Shouzhou territory and was lured into capture by Miao Peilin.",
    "On wuyin, Duo Long'a took Luzhou; Chen Yucheng fled to Shouzhou and Miao Peilin trapped him.",
  ],
  s0303: [
    "Miao Peilin was ordered pardoned.",
    "Peilin was pardoned by order.",
  ],
  s0304: [
    "On day jimao, Zhang Yunlan's army recovered Jingde.",
    "On jimao, Zhang Yunlan recovered Jingde.",
  ],
  s0305: [
    "Zeng Zhengan's army recovered Nanling.",
    "Zeng Zhengan recovered Nanling.",
  ],
  s0306: [
    "Salar rebels besieged Bayan Obo; Shen Zhaolin led relief to suppress them.",
    "Salar rebels besieged Bayan Obo and Shen Zhaolin led relief.",
  ],
  s0307: [
    "Shanghai government forces recovered Qingpu.",
    "Shanghai troops recovered Qingpu.",
  ],
  s0308: [
    "On day gengchen, He Guiqing was brought to the capital as a prisoner; grand secretaries were ordered to join the Board of Punishments in trial deliberation.",
    "On gengchen, He Guiqing reached the capital in custody for joint ministerial trial.",
  ],
  s0309: [
    "That month, overdue taxes from flood-hit Anzhou and other districts were remitted.",
    "That month, flood-hit Anzhou and other districts had overdue taxes remitted.",
  ],
  s0310: [
    "Fifth month, renwu new moon: government forces recovered Ningbo and Zhenhai.",
    "Month 5, renwu new moon: Ningbo and Zhenhai were recovered.",
  ],
  s0311: [
    "On day guiwei, Zheng Yuanshan moved his army to Runing.",
    "On guiwei, Zheng Yuanshan moved to Runing.",
  ],
  s0312: [
    "Taiping rebels took Shanyang in western Shaanxi.",
    "Rebels took western Shaanxi's Shanyang.",
  ],
  s0313: [
    "Duo Long'a was ordered to supervise Shaanxi military affairs.",
    "Duo Long'a was ordered to supervise Shaanxi forces.",
  ],
  s0314: [
    "On day jiashen, rain fell.",
    "On jiashen, it rained.",
  ],
  s0315: [
    "Wu Zhenhu was ordered to hurry to Shanxi to assist in defense and suppression.",
    "Wu Zhenhu was sent to Shanxi to help defend and suppress.",
  ],
  s0316: [
    "On day yiyou, Ming Yi was ordered to hurry to Tacheng to survey borders with Russia; Xu Zonggan was to suppress Taiwan bandits.",
    "On yiyou, Ming Yi was sent to Tacheng to survey the Russian border and Xu Zonggan to suppress Taiwan bandits.",
  ],
  s0317: [
    "On day bingxu, Xu Fu and 193 others were granted jinshi degrees with differentiated ranks.",
    "On bingxu, Xu Fu and 193 others received jinshi ranks.",
  ],
  s0318: [
    "On day dinghai, because Zhuji farmer Bao Lishen trained braves and killed bandits, Zuo Zongtang was instructed to employ him as appropriate.",
    "On dinghai, Bao Lishen of Zhuji was praised for killing bandits and Zuo Zongtang was told to use him.",
  ],
  s0319: [
    "Li Shizhong's army intercepted southern Jiang relief rebels with a great victory.",
    "Li Shizhong intercepted Jiang relief rebels with a great victory.",
  ],
  s0320: [
    "On day jichou, Guangxi forces recovered Taiping; Liu Changyou went to Xunzhou to supervise suppression.",
    "On jichou, Guangxi recovered Taiping and Liu Changyou went to Xunzhou to supervise.",
  ],
  s0321: [
    "Taiping rebels took Weinan.",
    "Rebels took Weinan.",
  ],
  s0322: [
    "On day renchen, Wang Lüqian was banished to Xinjiang.",
    "On renchen, Wang Lüqian was banished to Xinjiang.",
  ],
  s0323: [
    "Taiping rebels besieged Wenzhou and Ruian; Qingduan and others were instructed to advance relief, and Zuo Zongtang was also told to attend.",
    "Rebels besieged Wenzhou and Ruian; Qingduan was told to relieve them and Zuo Zongtang to help.",
  ],
  s0324: [
    "Taiping rebels attacked Tong Pass; Shen Zhaolin was instructed to order Ma Dezhao to aid Shaanxi.",
    "Rebels attacked Tong Pass; Shen Zhaolin was told to order Ma Dezhao to aid Shaanxi.",
  ],
  s0325: [
    "On day yiwei, Peng Yulin and Zeng Guoquan's armies recovered Taiping as well as Wuhu city, Jingzhu Pass, and Dongliangshan forts; Li Chengmou was rewarded with a yellow jacket.",
    "On yiwei, Peng Yulin and Zeng Guoquan recovered Taiping, Wuhu, Jingzhu Pass, and Dongliangshan; Li Chengmou won a yellow jacket.",
  ],
  s0326: [
    "Government forces joined British and French troops to take Nanqiao, Zhelin, and Fengxian.",
    "Government, British, and French forces took Nanqiao, Zhelin, and Fengxian.",
  ],
  s0327: [
    "When Nanqiao was taken, French Admiral Protet fell in battle; the throne honored him with mourning sacrifices and rewarded his family with precious gifts.",
    "At Nanqiao, French Admiral Protet fell; the throne mourned him and rewarded his family.",
  ],
  s0328: [
    "On day bingshen, Taiping rebels fled into Shanzhou.",
    "On bingshen, rebels fled into Shanzhou.",
  ],
  s0329: [
    "Because Miao and sectarian bandits raged at Tongren and Shiqian, Mao Hongbin and Han Chao were instructed to suppress jointly.",
    "Miao and sect rebels at Tongren and Shiqian led to joint orders for Mao Hongbin and Han Chao.",
  ],
  s0330: [
    "On day wuxu, Vice President Hengqi was ordered to join Chonghou in managing Portugal trade affairs.",
    "On wuxu, Hengqi was ordered to join Chonghou on Portugal trade.",
  ],
  s0331: [
    "As Britain planned to send Indian troops to assist suppression, Zeng Guofan and others were instructed to take Jinling, Suzhou, and Changzhou swiftly to forestall foreign designs.",
    "Britain planned Indian troops to help fight; Zeng Guofan was told to take Jinling, Suzhou, and Changzhou quickly.",
  ],
  s0332: [
    "On day jihai, Taiping rebels took Xingyi; government forces recovered Huoqiu.",
    "On jihai, rebels took Xingyi and government forces recovered Huoqiu.",
  ],
  s0333: [
    "On day gengzi, former Vice Minister of Rites Li Tangjie memorialized that beyond the tutors' guidance, the gradual rise of close attendants should be forestalled, and the Emperor should study the imperially annotated Comprehensive Mirror and Great Learning; an edict answered him graciously.",
    "On gengzi, Li Tangjie urged forestalling court favorites and studying the Mirror and Great Learning; the throne answered graciously.",
  ],
  s0334: [
    "On day xinchou, government forces recovered six counties of Taizhou prefecture including Xianju and Huangyan.",
    "On xinchou, six Taizhou counties including Xianju and Huangyan were recovered.",
  ],
  s0335: [
    "Rebel chiefs Wu Jianying and others surrendered at Nanhui.",
    "Wu Jianying and other rebel chiefs surrendered at Nanhui.",
  ],
  s0336: [
    "Government forces recovered Chuansha.",
    "Chuansha was recovered.",
  ],
  s0337: [
    "Bandits took Jiading.",
    "Jiading fell to bandits.",
  ],
  s0338: [
    "Overdue banner land rents in Zhili were remitted.",
    "Zhili's overdue banner rents were remitted.",
  ],
  s0339: [
    "On day renyin, government forces attacked Yuhuatai.",
    "On renyin, government forces attacked Yuhuatai.",
  ],
  s0340: [
    "On day jiachen, Zeng Guofan's proposal was approved: Anqing remained provincial seat, a Yangzi naval commander was established at Wuhu.",
    "On jiachen, Anqing stayed the seat, a Yangzi naval commander was set at Wuhu.",
  ],
  s0341: [
    "Hengqi was made plenipotentiary for Portuguese trade.",
    "Hengqi became plenipotentiary for Portuguese trade.",
  ],
  s0342: [
    "The Zongli Yamen reported a French minister's note that Tian Xingxu had maltreated Christians; Luo Bingzhang and Lao Chongguang were ordered to investigate.",
    "The Zongli Yamen reported Tian Xingxu had harmed Christians; Luo Bingzhang and Lao Chongguang were to investigate.",
  ],
  s0343: [
    "On day yisi, Chen Yucheng was sent to the capital under guard; an edict ordered him dismembered en route.",
    "On yisi, Chen Yucheng was sent to the capital and ordered dismembered on the way.",
  ],
  s0344: [
    "Runing militia chief Li Zhan plotted rebellion; government forces destroyed them.",
    "Li Zhan of Runing militia rebelled and government forces wiped them out.",
  ],
  s0345: [
    "On day bingwu, Li Shizhong crossed the river and took rebel fortresses at Longtan and elsewhere, advancing on Jiufuzhou; Zeng Guofan was instructed to direct him.",
    "On bingwu, Li Shizhong took Longtan forts and advanced on Jiufuzhou under Zeng Guofan's direction.",
  ],
  s0346: [
    "Ming Yi was instructed to delimit borders with Russia per treaty maps; Xilin assisted northern border demarcation.",
    "Ming Yi was told to delimit the Russian border by treaty maps; Xilin assisted the north.",
  ],
  s0347: [
    "On day dingwei, government forces recovered Shanyang in western Shaanxi.",
    "On dingwei, western Shaanxi's Shanyang was recovered.",
  ],
  s0348: [
    "On day wushen, rebels holding Shanyang fled into Yuxi.",
    "On wushen, Shanyang rebels fled into Yuxi.",
  ],
  s0349: [
    "Yingyun was banished to Mukden.",
    "Yingyun was banished to Mukden.",
  ],
  s0350: [
    "Sichuan bandits took a Taiping post and raided Dingyuan in Shaanxi.",
    "Sichuan bandits took Taiping and raided Shaanxi's Dingyuan.",
  ],
  s0351: [
    "Zhang Fen went to pacify rebellious Muslims at Lintong County and was seized and killed.",
    "Zhang Fen was seized and killed pacifying Muslims at Lintong.",
  ],
  s0352: [
    "On day xinhai, Peng Yulin and Zeng Guoquan's armies took Muling Pass forts and pressed Jinling.",
    "On xinhai, Peng Yulin and Zeng Guoquan took Muling Pass and pressed Jinling.",
  ],
  s0353: [
    "Taiping rebels took Huzhou; Fujian grain intendant Zhao Jingxian, on leave in the district, died.",
    "Rebels took Huzhou; Zhao Jingxian, Fujian grain intendant on leave, died.",
  ],
  s0354: [
    "Sixth month, renzi new moon: Qiling was stripped of office for delaying Zhejiang relief but kept in post.",
    "Month 6, renzi new moon: Qiling lost office for delaying Zhejiang aid but stayed on.",
  ],
  s0355: [
    "On day yimao, Li Xuyi was instructed to direct Huai-pei Nian suppression and restrain Miao Peilin.",
    "On yimao, Li Xuyi was told to direct Huai-pei Nian fighting and restrain Miao Peilin.",
  ],
  s0356: [
    "On day bingchen, Sengge Rinchen's army took the Jinlou rebel fortress.",
    "On bingchen, Sengge Rinchen took the Jinlou rebel fort.",
  ],
  s0357: [
    "On day wuwu, the Six Boards and Nine Chief Ministers were ordered to deliberate He Guiqing's crime again.",
    "On wuwu, the Six Boards and Nine Ministers were to retry He Guiqing.",
  ],
  s0358: [
    "On day gengshen, Sichuan bandits took Xixiang.",
    "On gengshen, Sichuan bandits took Xixiang.",
  ],
  s0359: [
    "Government forces recovered Dingyuan.",
    "Dingyuan was recovered.",
  ],
  s0360: [
    "Li Hongzhang directed Cheng Xueqi's army against Taiping rebels and routed them.",
    "Li Hongzhang led Cheng Xueqi against rebels and routed them.",
  ],
  s0361: [
    "Han and Muslim communities fought at Xi'an and Tongzhou, burning villages north of the Wei.",
    "Han and Muslims fought at Xi'an and Tongzhou and burned Wei-north villages.",
  ],
  s0362: [
    "An edict ordered distinguishing suppression and pacification by right and wrong, not by Han or Muslim.",
    "An edict said to judge by right and wrong, not Han or Muslim.",
  ],
  s0363: [
    "On day renxu, Sichuan troops recovered Taiping.",
    "On renxu, Sichuan troops recovered Taiping.",
  ],
  s0364: [
    "On day guihai, Taiping rebels took Yuxi.",
    "On guihai, rebels took Yuxi.",
  ],
  s0365: [
    "On day jiazi, He Guiqing was sentenced to decapitation.",
    "On jiazi, He Guiqing was sentenced to death.",
  ],
  s0366: [
    "On day yichou, locusts struck Zhili.",
    "On yichou, locusts hit Zhili.",
  ],
  s0367: [
    "On day bingyin, Taiping rebels fled south through Yi and Luo; Sengbao was ordered to supervise suppression.",
    "On bingyin, rebels fled south through Yi and Luo and Sengbao was ordered to pursue.",
  ],
  s0368: [
    "Shaanxi Muslims attacked Xi'an and Tongzhou; Lei Zhengwan was urged to enter the pass.",
    "Shaanxi Muslims attacked Xi'an and Tongzhou; Lei Zhengwan was urged into the pass.",
  ],
  s0369: [
    "On day wuchen, generals were warned against deceit and reckless recommendations; governors were told to ban counties using disasters to seek tax deferral while privately collecting.",
    "On wuchen, generals were warned against deceit and governors against disaster deferrals used to keep collecting.",
  ],
  s0370: [
    "On day gengwu, bandits took Tianzhu.",
    "On gengwu, bandits took Tianzhu.",
  ],
  s0371: [
    "On day guiyou, Grand Secretary Guiliang died and was posthumously made Grand Preceptor.",
    "On guiyou, Guiliang died and was posthumously made Grand Preceptor.",
  ],
  s0372: [
    "An imperial patent rewarding the King of Nepal was issued.",
    "A patent rewarding Nepal's king was issued.",
  ],
  s0373: [
    "On day jiaxu, refugees who had joined rebels and returned were all pardoned.",
    "On jiaxu, refugees who had joined rebels and returned were pardoned.",
  ],
  s0374: [
    "The law on lost cities was strictly proclaimed.",
    "The law on lost cities was strictly enforced.",
  ],
  s0375: [
    "The Belgian commercial treaty was settled.",
    "The Belgian trade treaty was settled.",
  ],
  s0376: [
    "Changqing and others reported Russians claimed Kazakh Khan Altanshar had submitted to Russia.",
    "Changqing reported Russians claimed Kazakh Khan Altanshar had submitted.",
  ],
  s0377: [
    "Investigation and appropriate handling were ordered; each taiji was told to nominate another to inherit the khanate.",
    "Investigation was ordered and each taiji was told to nominate a new khan.",
  ],
  s0378: [
    "On day yihai, Wenyu and others were sternly ordered to hunt Zhili horse bandits.",
    "On yihai, Wenyu and others were sternly ordered to hunt Zhili horse bandits.",
  ],
  s0379: [
    "Tan Tingxiang was instructed to go to Yan and Yi to supervise suppression of bandits and fleeing Nian.",
    "Tan Tingxiang was sent to Yan and Yi to fight bandits and fleeing Nian.",
  ],
  s0380: [
    "On day bingzi, government forces recovered Qingtian.",
    "On bingzi, Qingtian was recovered.",
  ],
  s0381: [
    "On day dingchou, Sengge Rinchen's request was granted to win over Miao Peilin.",
    "On dingchou, Sengge Rinchen's request to win over Miao Peilin was granted.",
  ],
  s0382: [
    "On day jimao, Shi Dakai fled to Qijiang; government forces routed him and he fled into Gong and Gao counties.",
    "On jimao, Shi Dakai fled to Qijiang, was routed, and fled into Gong and Gao.",
  ],
  s0383: [
    "On day gengchen, Duo Long'a was urged to aid Xi'an against Muslim rebels, not be misled by pacification talks, and still release coerced peaceful Muslims.",
    "On gengchen, Duo Long'a was urged to aid Xi'an, ignore bad peace talks, and free coerced Muslims.",
  ],
  s0384: [
    "That month, overdue levies and miscellaneous grain taxes in Zhili and Henan were remitted.",
    "That month, Zhili and Henan overdue levies and misc grain taxes were remitted.",
  ],
  s0385: [
    "Autumn, seventh month, renwu new moon.",
    "Autumn, month 7, renwu new moon.",
  ],
  s0386: [
    "On day jiashen, Kokand bandit Wali Khan entered Kashgaria and raided border posts; government forces defeated him.",
    "On jiashen, Kokand's Wali Khan raided Kashgar posts and government forces beat him.",
  ],
  s0387: [
    "Kokand fell into disorder and Beg Mir was killed.",
    "Kokand fell into disorder and Beg Mir was killed.",
  ],
  s0388: [
    "On day dinghai, Jingwen was ordered to mobilize Dam Mongol troops and tribal forces of Huo'er for Tibet.",
    "On dinghai, Jingwen was ordered to send Dam Mongols and Huo'er tribes to Tibet.",
  ],
  s0389: [
    "On day jichou, because Shaanxi Muslims had massacred Han civilians, Duo Long'a and others were urged to enter the pass.",
    "On jichou, Shaanxi Muslim massacres of Han urged Duo Long'a and others into the pass.",
  ],
  s0390: [
    "Soon they were rebuked for delay and Sengbao was told to send part of his army to aid Shaanxi.",
    "Soon delay was rebuked and Sengbao was told to send troops to Shaanxi.",
  ],
  s0391: [
    "Yuan Jiasan resigned for illness; Li Xuyi was made Imperial Commissioner to supervise military affairs.",
    "Yuan Jiasan quit for illness and Li Xuyi became Imperial Commissioner for military affairs.",
  ],
  s0392: [
    "On day gengyin, Li Hongzhang's army took Jinshanwei.",
    "On gengyin, Li Hongzhang took Jinshanwei.",
  ],
  s0393: [
    "On day xinmao, Gansu Salar Muslims surrendered.",
    "On xinmao, Gansu Salar Muslims surrendered.",
  ],
  s0394: [
    "Kokand bandits fled beyond the border posts.",
    "Kokand bandits fled beyond the border.",
  ],
  s0395: [
    "Russians claimed Kazakh and Kyrgyz lands; Changqing was ordered to verify, the Zongli Yamen to adjudicate, and Mingxu to join Ming Yi in surveying the western border.",
    "Russia claimed Kazakh and Kyrgyz lands; Changqing was to verify, the Zongli Yamen to judge, and Mingxu to join Ming Yi on the west.",
  ],
  s0396: [
    "On day renchen, Woren was ordered to assist as Grand Secretary.",
    "On renchen, Woren was ordered to assist as Grand Secretary.",
  ],
  s0397: [
    "On day jiawu, Sichuan bandits took Yang County.",
    "On jiawu, Sichuan bandits took Yang County.",
  ],
  s0398: [
    "On day wuxu, Sichuan troops recovered Changning.",
    "On wuxu, Sichuan troops recovered Changning.",
  ],
  s0399: [
    "Airen and Wang Maoyin were ordered to inspect Shaanxi official conduct secretly.",
    "Airen and Wang Maoyin were ordered to inspect Shaanxi officials secretly.",
  ],
  s0400: [
    "Magistrate Qin Jukui was promoted to Dashun Guang Circuit and joined Zhaoketunbu in managing Zhili and eastern defenses.",
    "Qin Jukui was promoted to Dashun Guang Circuit and joined Zhaoketunbu on Zhili and eastern defense.",
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_021_b04.mjs <translation.json>'
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
