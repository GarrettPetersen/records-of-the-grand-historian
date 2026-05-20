#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'An edict commuted the death penalty to perpetual confinement; Antai was sentenced to strangulation.',
    'Death sentences were commuted to life imprisonment; Antai was condemned to strangulation.',
  ],
  s0602: [
    'Arrears of tax were remitted for eleven prefectures and counties including Yulin in Shaanxi.',
    'Tax arrears were forgiven in eleven Shaanxi prefectures and counties including Yulin.',
  ],
  s0603: [
    'On day guiwei, quota taxes were remitted for forty-four prefectures and counties including Xiangfu in Henan on account of flood damage.',
    'On guiwei day, Henan flood taxes were remitted in forty-four prefectures and counties including Xiangfu.',
  ],
  s0604: [
    'On day yiyou, Beile Poluonai was advanced to prince of a commandery.',
    'On yiyou day, Beile Poluonai was promoted to commandery prince.',
  ],
  s0605: [
    'On day gengyin, quota taxes were remitted for ten prefectures and counties including Shangqiu in Henan on account of flood damage.',
    'On gengyin day, flood taxes were remitted in ten Henan prefectures and counties including Shangqiu.',
  ],
  s0606: [
    'On day renchen, Haliu and others came to court for audience.',
    'On renchen day, Haliu and others presented themselves at court.',
  ],
  s0607: [
    'On day jiawu, the Tsetsen Khan Damalin and others were summoned and granted tea.',
    'On jiawu day, Tsetsen Khan Damalin and others were summoned and given tea.',
  ],
  s0608: [
    'Fifth year, spring, first month, day dingwei: relief was distributed with distinctions to eight prefectures and counties including Suzhou in Anhui, and ten prefectures, counties, and guards including Lujiang, on account of drought.',
    'In the first month of the fifth year, drought relief was given in Anhui and elsewhere with distinctions.',
  ],
  s0609: [
    'On day dingmao, Korea sent tribute.',
    'On dingmao day, Korea presented tribute.',
  ],
  s0610: [
    'On day xinwei, Uhetu and Baling\'a were ordered to escort Dzungars to Tibet to boil tea.',
    'On xinwei day, Uhetu and Baling\'a were ordered to escort Dzungars to Tibet for the tea pilgrimage.',
  ],
  s0611: [
    'Miao in Suining, Hunan, rose in revolt; Feng Guangyu and others were ordered to suppress them.',
    'Suining Miao rebels in Hunan were ordered suppressed under Feng Guangyu.',
  ],
  s0612: [
    'Second month: Ryukyu sent tribute.',
    'In the second month, Ryukyu presented tribute.',
  ],
  s0613: [
    'On day yihai, Imperial Son-in-law Celeng and others were ordered to fix the grazing boundaries of each tribe adjoining Dzungar nomads.',
    'On yihai day, Celeng and others were ordered to delimit tribal borders against Dzungar pastures.',
  ],
  s0614: [
    'Haliu returned; he was summoned, granted tea, and commended because the peace negotiations had succeeded.',
    'Haliu returned, was summoned and rewarded for securing peace.',
  ],
  s0615: [
    'On day xinsi, Ilershen was made general at Suiyuan City.',
    'On xinsi day, Ilershen became Suiyuan City general.',
  ],
  s0616: [
    'On day guiwei, Minister of Works Wei Tingzhen was dismissed.',
    'On guiwei day, Wei Tingzhen was removed as Minister of Works.',
  ],
  s0617: [
    'The Nine Ministers were admonished not to repeat evasive, noncommittal mistakes.',
    'The Nine Ministers were warned against equivocating as before.',
  ],
  s0618: [
    'Quota taxes were remitted for sixty prefectures, counties, and guards including Zhangqiu in Shandong on account of flood damage.',
    'Flood taxes were remitted in sixty Shandong prefectures, counties, and guards including Zhangqiu.',
  ],
  s0619: [
    'On day wuzi, last year\'s quota taxes were remitted for Xiangyang county and guard in Hubei.',
    'On wuzi day, last year\'s Hubei taxes were remitted for Xiangyang.',
  ],
  s0620: [
    'On day renchen, last year\'s quota taxes were remitted for Suzhou in Anhui on account of hail damage, and for five counties including Teng county in Shandong on account of flood damage.',
    'On renchen day, last year\'s taxes were remitted for hail in Suzhou and floods in five Shandong counties.',
  ],
  s0621: [
    'On day wuxu, Han Guangji was made Minister of Works.',
    'On wuxu day, Han Guangji became Minister of Works.',
  ],
  s0622: [
    'On day xinchou, last year\'s quota taxes were remitted for four counties including Hanyang in Hubei on account of drought damage.',
    'On xinchou day, last year\'s drought taxes were remitted in four Hubei counties including Hanyang.',
  ],
  s0623: [
    'Third month, day gengxu: Yin Jishan was made governor-general of Sichuan and Shaanxi, and Eshan acting Minister of Justice.',
    'In the third month, Yin Jishan became Sichuan-Shaanxi governor-general and Eshan acting Minister of Justice.',
  ],
  s0624: [
    'On day renzi, last year\'s quota taxes were remitted for Xiong county in Zhili on account of flood damage.',
    'On renzi day, last year\'s flood taxes were remitted for Xiong county in Zhili.',
  ],
  s0625: [
    'On day jiazi, quota taxes were remitted for saltern districts including Zhanhua in Shandong on account of flood damage.',
    'On jiazi day, flood taxes were remitted at Shandong salterns including Zhanhua.',
  ],
  s0626: [
    'On day gengwu, the Miao bandits at Lilin and Guichong stockades in Hunan were pacified.',
    'On gengwu day, the Lilin and Guichong Miao bandits in Hunan were pacified.',
  ],
  s0627: [
    'Summer, fourth month, day bingxu: relief was distributed for disasters at salterns including Banpu in the two Huai circuits.',
    'In the fourth month, the two Huai salterns including Banpu received disaster relief.',
  ],
  s0628: [
    'On day wuzi, Censor Chu Tai, convicted of taking bribes, was sentenced to decapitation.',
    'On wuzi day, Censor Chu Tai was sentenced to death for bribery.',
  ],
  s0629: [
    'Quota taxes were remitted for Jiazhou and Huaiyuan in Shaanxi on account of drought damage.',
    'Drought taxes were remitted in Shaanxi\'s Jiazhou and Huaiyuan.',
  ],
  s0630: [
    'On day jichou, Nasutu was made Minister of Justice.',
    'On jichou day, Nasutu became Minister of Justice.',
  ],
  s0631: [
    'On day jiawu, because of drought the Nine Ministers were summoned for face-to-face instruction to speak frankly on governmental shortcomings.',
    'On jiawu day, drought led the Emperor to summon the Nine Ministers to report frankly on policy failures.',
  ],
  s0632: [
    'The Shandong river circuit was renamed the Transport river circuit; the Yan-Yi-Cao circuit was made a separate intendant over Yan, Yi, and Cao prefectures to manage river works.',
    'Shandong river offices were reorganized: transport and Yan-Yi-Cao intendant circuits were redefined for river works.',
  ],
  s0633: [
    'On day wuxu, Ren Lanzhi and Court of Imperial Sacrifices director Tao Zhengjing, convicted of factional collusion, were referred for severe deliberation.',
    'On wuxu day, Ren Lanzhi and Tao Zhengjing were sent for severe review for factional collusion.',
  ],
  s0634: [
    'Fifth month, day jiayin: the Emperor went to Black Dragon Pool to pray for rain.',
    'In the fifth month, on jiayin day, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0635: [
    'On day bingchen, the Ministry of Justice was ordered to clear accumulated common-law prisons.',
    'On bingchen day, the Ministry of Justice was ordered to clear backlog cases.',
  ],
  s0636: [
    'On day jiazi, Yang Chaozeng was made acting governor-general of the two Jiangs.',
    'On jiazi day, Yang Chaozeng became acting governor-general of the two Jiangs.',
  ],
  s0637: [
    'On day dingmao, Feng Guangyu and Huguang provincial commander Du Kai were instructed to suppress and capture Yao bandits at Chengbu and Suining.',
    'On dingmao day, Feng Guangyu and Du Kai were ordered to suppress Yao bandits at Chengbu and Suining.',
  ],
  s0638: [
    'Sixth month, day guiyou: Aligun and Zhu Bijie were ordered to survey flood and drought damage in places including Yizhou in Shandong.',
    'In the sixth month, Aligun and Zhu Bijie were sent to inspect Shandong flood and drought damage.',
  ],
  s0639: [
    'On day wuyin, Shandong, Jiangsu, and Anhui were ordered to capture and destroy locust nymphs.',
    'On wuyin day, Shandong, Jiangsu, and Anhui were ordered to eradicate locust nymphs.',
  ],
  s0640: [
    'Zhang Guangsi was summoned to the capital.',
    'Zhang Guangsi was recalled to Beijing.',
  ],
  s0641: [
    'On day renchen, relief was distributed for flood damage at Qinzhou in Gansu.',
    'On renchen day, Gansu\'s Qinzhou received flood relief.',
  ],
  s0642: [
    'On day wuxu, Fuzhou general Longsheng, convicted of accepting gifts, was stripped of office and tried.',
    'On wuxu day, Fuzhou general Longsheng was dismissed and tried for taking gifts.',
  ],
  s0643: [
    'Intercalary sixth month, day jiachen: Miao in Yining, Guangxi, rose in revolt; Ma\'ertai was instructed to proceed to Guilin to direct military affairs.',
    'In the intercalary sixth month, Yining Miao rebels led Ma\'ertai to Guilin to direct troops.',
  ],
  s0644: [
    'On day xinhai, Ka\'erjishan was made governor of Shanxi.',
    'On xinhai day, Ka\'erjishan became Shanxi governor.',
  ],
  s0645: [
    'Du Kai was ordered to lead Hunan troops to the front.',
    'Du Kai was ordered to bring Hunan troops to the front.',
  ],
  s0646: [
    'On day yimao, Zhang Guangsi was ordered to proceed to Hunan to manage military affairs jointly.',
    'On yimao day, Zhang Guangsi was sent to Hunan to direct the campaign jointly.',
  ],
  s0647: [
    'On day jiazi, Dzungar taiji Galdan Tseren sent envoys to present a memorial.',
    'On jiazi day, Galdan Tseren of the Dzungars sent envoys with a memorial.',
  ],
  s0648: [
    'Autumn, seventh month, day guiyou: Zhang Qu was transferred to be governor of Hubei.',
    'In the seventh month, Zhang Qu became Hubei governor.',
  ],
  s0649: [
    'Xu Shilin was made governor of Jiangsu.',
    'Xu Shilin became Jiangsu governor.',
  ],
  s0650: [
    'Fang Xian was transferred to be governor of Guangxi, Shuose governor of Sichuan, and Zhu Dingyuan governor of Shandong.',
    'Fang Xian, Shuose, and Zhu Dingyuan were made governors of Guangxi, Sichuan, and Shandong.',
  ],
  s0651: [
    'On day yihai, an imperial letter was granted to Galdan Tseren, instructing the Dzungar envoy that the Altai Mountains should be the boundary and that people who grazed south of the mountains should remain on their old lands.',
    'On yihai day, Galdan Tseren was told the Altai would be the border and southern grazers could stay where they were.',
  ],
  s0652: [
    'A Gansu Anxi provincial commander-in-chief was established, stationed at Hami.',
    'An Anxi provincial commander was set up in Gansu, based at Hami.',
  ],
  s0653: [
    'On day dingchou, Buxi was made general at Suiyuan City.',
    'On dingchou day, Buxi became Suiyuan City general.',
  ],
  s0654: [
    'On day xinsi, an edict suspended autumn executions for this year.',
    'On xinsi day, autumn executions were suspended for the year.',
  ],
  s0655: [
    'On day jiashen, Zhang Guangsi was retained to handle Hunan aftermath.',
    'On jiashen day, Zhang Guangsi stayed in Hunan for post-campaign affairs.',
  ],
  s0656: [
    'Relief was distributed for famine at Xuancheng guard in Anhui.',
    'Famine relief was given at Anhui\'s Xuancheng guard.',
  ],
  s0657: [
    'On day jichou, quota taxes were remitted for nineteen prefectures, counties, and guards including Fengyang in Anhui on account of flood damage, and for four prefectures and counties including Wuwei on account of drought damage.',
    'On jichou day, flood and drought taxes were remitted across Anhui including Fengyang and Wuwei.',
  ],
  s0658: [
    'On day jiawu, relief was distributed for famine at Xugou in Shanxi.',
    'On jiawu day, Shanxi\'s Xugou received famine relief.',
  ],
  s0659: [
    'On day dingyou, relief was distributed for famine in three counties including Wuwei in Gansu.',
    'On dingyou day, famine relief was given in three Gansu counties including Wuwei.',
  ],
  s0660: [
    'On day wuxu, Bandi memorialized that regional commander Liu Ceming and others had taken in succession the Miao stockades at Changping, capturing the chief instigator of seductive talk, Li Alan, and others.',
    'On wuxu day, Bandi reported Liu Ceming\'s capture of Changping Miao stockades and rebel leader Li Alan.',
  ],
  s0661: [
    'Eighth month, first day of the month on day jihai: the Man bandits in Yishan county, Guangxi, were pacified.',
    'On the new moon of the eighth month, Yishan Man bandits in Guangxi were pacified.',
  ],
  s0662: [
    'On day gengzi, an edict said: "Having reviewed Jiang province\'s annual levy and miscellaneous surcharge items, which derive from the Ming and for which no complete register of duties has been compiled, officials and people alike suffer under them; all are hereby wholly remitted.',
    'On gengzi day, the Emperor ordered full remission of Jiangsu\'s Ming-era miscellaneous levies.',
  ],
  s0663: [
    '" On day gengxu, Bandi memorialized that the Miao bandit stockades at Yanjingkou had all been suppressed.',
    'On gengxu day, Bandi reported the Yanjingkou Miao bandits pacified.',
  ],
  s0664: [
    'On day renxu, the Emperor accompanied the Empress Dowager in residence at the Southern Park.',
    'On renxu day, the Emperor stayed with the Empress Dowager at the Southern Park.',
  ],
  s0665: [
    'Relief was distributed for famine at Yongding in Fujian.',
    'Fujian\'s Yongding received famine relief.',
  ],
  s0666: [
    'Quota taxes were remitted for fourteen prefectures and counties including Zhongmou in Henan on account of flood damage.',
    'Flood taxes were remitted in fourteen Henan prefectures and counties including Zhongmou.',
  ],
  s0667: [
    'On day wuchen, Tan Xingyi memorialized that the people of Annam had enthroned Long Biao as king and usurped the reign title Jingxing.',
    'On wuchen day, Tan Xingyi reported Annam had enthroned Long Biao under the reign title Jingxing.',
  ],
  s0668: [
    'On day guiyou, Yang Chaozeng was transferred to be Minister of Personnel while still acting governor-general of the two Jiangs; Shi Yizhi was made Minister of War; Han Guangji Minister of Justice; and Chen Shiguan Minister of Works.',
    'On guiyou day, Yang Chaozeng, Shi Yizhi, Han Guangji, and Chen Shiguan received new ministry posts.',
  ],
  s0669: [
    'On day xinsi, Associate Grand Secretary and Minister of Rites Santai asked to retire; he was comforted and retained.',
    'On xinsi day, Santai\'s retirement request was declined with encouragement to remain.',
  ],
  s0670: [
    'Relief was distributed for famine at Shanghang in Fujian.',
    'Fujian\'s Shanghang received famine relief.',
  ],
  s0671: [
    'Relief was distributed for flood damage in sixteen prefectures, departments, counties, subprefectures, guards, and posts including Yuhang in Zhejiang.',
    'Flood relief was given in sixteen Zhejiang prefectures and counties including Yuhang.',
  ],
  s0672: [
    'On day bingxu, the Zhu Family Sluice on the Yellow River burst at Suqian county in Jiangsu; an order was issued to build a diversion dam.',
    'On bingxu day, a Jiangsu Yellow River breach at Suqian was ordered dammed.',
  ],
  s0673: [
    'On day dinghai, a stone seawall was built at Wujia Embankment on the coastal dike in Baoshan county, Jiangsu.',
    'On dinghai day, Jiangsu\'s Baoshan coastal dike gained a stone seawall at Wujia Embankment.',
  ],
  s0674: [
    'Relief was distributed for famine in prefectures and counties including Jiazhou in Shaanxi.',
    'Famine relief was given in Shaanxi prefectures and counties including Jiazhou.',
  ],
  s0675: [
    'Wang Anguo was made Left Censor-in-chief.',
    'Wang Anguo became Left Censor-in-chief.',
  ],
  s0676: [
    'The Yongding River returned to its old course.',
    'The Yongding River was restored to its former channel.',
  ],
  s0677: [
    'Winter, tenth month, first day of the month on day wuxu: Chang\'an was made Grain Transport governor-general.',
    'On the new moon of the tenth month, Chang\'an became Grain Transport governor-general.',
  ],
  s0678: [
    'On day renyin, the Emperor visited Tailing.',
    'On renyin day, the Emperor visited Tailing.',
  ],
  s0679: [
    'On day yisi, the Emperor returned to the capital.',
    'On yisi day, the Emperor returned to Beijing.',
  ],
  s0680: [
    'Relief was distributed for flood damage in three counties including Mianzhu in Sichuan.',
    'Flood relief was given in three Sichuan counties including Mianzhu.',
  ],
  s0681: [
    'On day jiayin, this year\'s quota taxes were remitted for Pingluo in Gansu on account of flood damage, and half the levy was still remitted for Ningxia and Ningshuo.',
    'On jiayin day, Gansu flood taxes were remitted at Pingluo and halved at Ningxia and Ningshuo.',
  ],
  s0682: [
    'On day bingchen, Censor-in-chief Liu Zao memorialized asking to halt and reduce construction at the Garden of Perfect Brightness; the Emperor praised and accepted it.',
    'On bingchen day, Liu Zao\'s plea to cut Yuanmingyuan construction was approved.',
  ],
  s0683: [
    'Relief was distributed for wind damage in Taiwan and Zhuluo in Fujian.',
    'Wind-disaster relief was given in Fujian\'s Taiwan and Zhuluo.',
  ],
  s0684: [
    'On day dingmao, Zhang Guangsi memorialized the capture of Miao bandits including Li Xianyu and Yao bandits attached to them including Dai Mingyang, and the recovery of stockades including Pingxi.',
    'On dingmao day, Zhang Guangsi reported capturing Li Xianyu and Dai Mingyang and recovering Pingxi stockades.',
  ],
  s0685: [
    'Eleventh month, day jisi: Nasutu was made acting governor of Huguang.',
    'In the eleventh month, Nasutu became acting Huguang governor.',
  ],
  s0686: [
    'On day gengwu, Laibao was transferred to be Minister of Justice and Hadaha Minister of Works.',
    'On gengwu day, Laibao and Hadaha became Ministers of Justice and Works.',
  ],
  s0687: [
    'On day bingzi, Yang Chaozeng impeached Jiangxi governor Yue Jun; Gao Bin was ordered to go and join in the investigation.',
    'On bingzi day, Yue Jun was impeached and Gao Bin was sent to investigate jointly.',
  ],
  s0688: [
    'On day jimao, Wang Mo was summoned to the capital.',
    'On jimao day, Wang Mo was summoned to Beijing.',
  ],
  s0689: [
    'Wang Anguo was ordered to manage Guangdong governorship affairs as Left Censor-in-chief.',
    'Wang Anguo was ordered to act as Guangdong governor in his post as Left Censor-in-chief.',
  ],
  s0690: [
    'Aligun was ordered to join Gao Bin in investigating and trying Yue Jun.',
    'Aligun was ordered to assist Gao Bin in trying Yue Jun.',
  ],
  s0691: [
    'Liu Wulong was made Left Censor-in-chief.',
    'Liu Wulong became Left Censor-in-chief.',
  ],
  s0692: [
    'On day yiyou, court ministers were ordered each to recommend men they knew, such as Tang Bin, Lu Longqi, Chen Qin, Peng Peng, and the like.',
    'On yiyou day, ministers were told to recommend worthy men such as Tang Bin and Lu Longqi.',
  ],
  s0693: [
    'Relief was distributed for famine in six prefectures and counties including Jiazhou in Shaanxi.',
    'Famine relief was given in six Shaanxi prefectures and counties including Jiazhou.',
  ],
  s0694: [
    'Twelfth month, day renyin: Zhang Guangsi advanced to suppress Chengbu and Suining in Hunan; the Miao and Yao of Yining in Guangxi were all pacified.',
    'In the twelfth month, Zhang Guangsi pacified Hunan and Guangxi Miao and Yao rebels.',
  ],
  s0695: [
    'Quota taxes were remitted for Xuancheng and Xuanzhou counties and guards in Anhui on account of hail damage.',
    'Hail taxes were remitted in Anhui\'s Xuancheng and Xuanzhou.',
  ],
  s0696: [
    'Quota taxes were remitted for hail damage in places including Tokto city.',
    'Hail taxes were remitted at Tokto city and elsewhere.',
  ],
  s0697: [
    'On day renzi, arrears of tax were remitted for Putai in Shandong.',
    'On renzi day, Shandong tax arrears were forgiven at Putai.',
  ],
  s0698: [
    'Sixth year, spring, first month, day jiaxu: the Anxi regional commander was abolished and a provincial commander-in-chief was established.',
    'In the first month of the sixth year, Anxi\'s regional commander was replaced by a provincial commander.',
  ],
  s0699: [
    'On day bingzi, arrears of tax were remitted for five counties including Min county in Fujian.',
    'On bingzi day, tax arrears were forgiven in five Fujian counties including Min.',
  ],
  s0700: [
    'On day jiashen, E\'ertai and Neqin were ordered, together with Sun Jiagan and Gu Cong, to survey Yongding River works.',
    'On jiashen day, E\'ertai, Neqin, Sun Jiagan, and Gu Cong were sent to inspect Yongding River works.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_010_b07.mjs <translation.json>'
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
