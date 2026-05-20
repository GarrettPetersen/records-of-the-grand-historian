#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'On day renxu, Sheng Bao was stripped of office and arrested for inquiry on charges of arrogance and deceit.',
    'On renxu day, Sheng Bao lost his post and was arrested for arrogance and deceit.',
  ],
  s0602: [
    'An edict ordered Zhili to implement the baojia community defense system.',
    'Zhili was ordered to carry out baojia registration.',
  ],
  s0603: [
    'Ruilin was ordered to rigorously arrest bandits in Rehe.',
    'Ruilin was told to suppress Rehe bandits strictly.',
  ],
  s0604: [
    'On day guihai, Qin Jukui died in battle while suppressing bandits in Guan county.',
    'On guihai day, Qin Jukui fell fighting bandits at Guan county.',
  ],
  s0605: [
    'Jiufu Zhou bandits again took Hezhou, Hanshan, and Chaoxian.',
    'Jiufu Zhou rebels retook Hezhou, Hanshan, and Chaoxian.',
  ],
  s0606: [
    'On day yichou, Sheng Bao\'s crimes were proclaimed; his property was confiscated and his troops rewarded.',
    'On yichou day, Sheng Bao\'s guilt was published, his goods seized, and his soldiers rewarded.',
  ],
  s0607: [
    'Duo Long\'a was made Imperial Commissioner and took command of all forces formerly under Sheng Bao.',
    'Duo Long\'a became imperial commissioner over Sheng Bao\'s former armies.',
  ],
  s0608: [
    'On day bingyin, Sichuan bandits took Foping; government troops recovered it.',
    'On bingyin day, Sichuan rebels seized Foping and government troops retook it.',
  ],
  s0609: [
    'Sichuan bandits again took Lueyang.',
    'Lueyang fell again to Sichuan bandits.',
  ],
  s0610: [
    'On day jisi, Guangdong bandits raided into and took Qimen.',
    'On jisi day, Guangdong rebels captured Qimen.',
  ],
  s0611: [
    'Pingluo Muslim rebels revolted.',
    'Muslim rebels rose at Pingluo.',
  ],
  s0612: [
    'On day xinwei, Yan Jingming requested to complete the mourning observance; it was denied.',
    'On xinwei day, Yan Jingming\'s request to finish mourning was refused.',
  ],
  s0613: [
    'On day yihai, surrendered Shandong troops rebelled and took Puzhou.',
    'On yihai day, Shandong defectors mutinied and seized Puzhou.',
  ],
  s0614: [
    'Zhang Liangji was ordered to act as Guizhou governor with governor-general rank and also act as provincial commander; acting Governor Han Chao and acting Commander Tian Xingyu were removed pending investigation.',
    'Zhang Liangji took Guizhou as acting governor and commander; Han Chao and Tian Xingyu were suspended for inquiry.',
  ],
  s0615: [
    'On day bingzi, Shi Dakai took Junlian.',
    'On bingzi day, Shi Dakai captured Junlian.',
  ],
  s0616: [
    'Sichuan bandits took Liangdang and it was soon recovered.',
    'Liangdang fell to Sichuan bandits and was quickly retaken.',
  ],
  s0617: [
    'On day dingchou, the French minister demanded compensation from Tian Xingyu for murdered missionaries; it was refused.',
    'On dingchou day, France demanded indemnity from Tian Xingyu for slain missionaries and was refused.',
  ],
  s0618: [
    'Twelfth month, new moon on wuyin: those coerced by bandits in Jiangsu, Zhejiang, and elsewhere who sincerely submitted, regardless of how long they had followed the rebels, were all permitted to surrender.',
    'At the twelfth-month new moon, coerced Jiangsu and Zhejiang followers who sincerely came in were allowed to surrender.',
  ],
  s0619: [
    'Zeng Guofan and Tang Xunfang were ordered to station troops separately at Zhengyang Pass and Shouzhou.',
    'Zeng Guofan and Tang Xunfang were told to hold Zhengyang Pass and Shouzhou.',
  ],
  s0620: [
    'On day gengchen, Ward had his official rank stripped for crimes and was arrested.',
    'On gengchen day, Ward lost rank for misconduct and was arrested.',
  ],
  s0621: [
    'On day xinsi, Duo Long\'a defeated Muslim rebels at Tongzhou.',
    'On xinsi day, Duo Long\'a beat Muslim rebels at Tongzhou.',
  ],
  s0622: [
    'On day renwu, Sasa Bu, vice commander at Jingzhou, was ordered to suppress bandits in Zhili and Shandong.',
    'On renwu day, Jingzhou Vice Commander Sasa Bu was sent against Zhili and Shandong bandits.',
  ],
  s0623: [
    'On day guiwei, Jiangnan forces recovered Jixi and Qimen.',
    'On guiwei day, Jiangnan troops retook Jixi and Qimen.',
  ],
  s0624: [
    'Bao Chao was in mourning for his mother; he was ordered to serve in an acting capacity and remain at camp.',
    'Bao Chao, mourning his mother, was kept at camp in an acting post.',
  ],
  s0625: [
    'Government troops recovered Puzhou.',
    'Puzhou was retaken by government forces.',
  ],
  s0626: [
    'On day yiyou, Zuo Zongtang\'s army recovered Yanzhou.',
    'On yiyou day, Zuo Zongtang retook Yanzhou.',
  ],
  s0627: [
    'On day bingxu, Lei Zhengchao was ordered to assist Duo Long\'a; General Muteng\'e and Yingqi were to handle provincial capital defense.',
    'On bingxu day, Lei Zhengchao joined Duo Long\'a\'s staff while Muteng\'e and Yingqi defended the capital.',
  ],
  s0628: [
    'On day dinghai, Zuo Zongtang and others were ordered to recommend Hunan-born talent.',
    'On dinghai day, Zuo Zongtang was told to recommend Hunan men of ability.',
  ],
  s0629: [
    'Guangxi bandits took Xining.',
    'Xining fell to Guangxi bandits.',
  ],
  s0630: [
    'On day wuzi, Muslim rebels took Jingyang.',
    'On wuzi day, Muslim rebels captured Jingyang.',
  ],
  s0631: [
    'Song Jingshi rebelled in Shanxi.',
    'Song Jingshi rose in Shanxi.',
  ],
  s0632: [
    'Mongol troops from Alashan and Ordos were summoned to help suppress Pingluo Muslim rebels in Ningxia.',
    'Alashan and Ordos Mongols were called to fight Pingluo rebels in Ningxia.',
  ],
  s0633: [
    'An edict was issued to conduct the xiaolian fangzheng examinations.',
    'The court ordered the xiaolian fangzheng selection.',
  ],
  s0634: [
    'Guangdong bandits raided into Pingli.',
    'Guangdong rebels entered Pingli.',
  ],
  s0635: [
    'Hezhou Muslim rebels raided widely; En Lin suppressed them.',
    'Hezhou Muslim rebels spread disorder and En Lin campaigned against them.',
  ],
  s0636: [
    'Prussia\'s treaty revision was approved.',
    'The court approved Prussia\'s treaty exchange.',
  ],
  s0637: [
    'Yunnan bandits took Jingdong.',
    'Jingdong fell to Yunnan bandits.',
  ],
  s0638: [
    'Xi Baotian\'s army was redirected to aid Jiangxi.',
    'Xi Baotian was ordered to reinforce Jiangxi.',
  ],
  s0639: [
    'Jiang Zhongyi was ordered to command all armies aiding Guangxi.',
    'Jiang Zhongyi took command of forces aiding Guangxi.',
  ],
  s0640: [
    'Shandong raiding bandits harassed Jizhou and Zaoqiang; Wen Yu and others were ordered to suppress them jointly.',
    'Shandong raiders troubled Jizhou and Zaoqiang, and Wen Yu was told to join in suppression.',
  ],
  s0641: [
    'On day jiawu, Guangdong graduate Gui Wencan presented a collected works on classical studies; an edict praised him.',
    'On jiawu day, Gui Wencan of Guangdong presented classical scholarship and received imperial praise.',
  ],
  s0642: [
    'On day bingshen, government troops recovered Xinning and Huoqiu.',
    'On bingshen day, Xinning and Huoqiu were retaken.',
  ],
  s0643: [
    'Shi Dakai again took Gaoxian; it was soon recovered.',
    'Gaoxian fell again to Shi Dakai and was quickly recovered.',
  ],
  s0644: [
    'On day dingyou, Vice Minister Chonghou was ordered to assist Zhili defense and suppression.',
    'On dingyou day, Chonghou was assigned to Zhili defense.',
  ],
  s0645: [
    'Liu Changyou was summoned to the capital; Yan Duanshu and Kunshou were ordered to manage Guangdong military affairs.',
    'Liu Changyou was called to Beijing while Yan Duanshu and Kunshou handled Guangdong forces.',
  ],
  s0646: [
    'On day wuxu, Guangdong bandits fled from Yunyang into Xing\'an; Duo Long\'a and others were ordered to suppress them jointly.',
    'On wuxu day, Guangdong rebels from Yunyang entered Xing\'an, and Duo Long\'a was told to coordinate pursuit.',
  ],
  s0647: [
    'On day gengzi, rebel leaders Luo Guozhong and others surrendered Changshu and Zhaowen.',
    'On gengzi day, Luo Guozhong and other chiefs yielded Changshu and Zhaowen.',
  ],
  s0648: [
    'On day renyin, Muteng\'e and Yingqi were ordered to handle Xi\'an defense; Duo Long\'a was also to watch provincial defense.',
    'On renyin day, Muteng\'e and Yingqi took Xi\'an defense while Duo Long\'a also guarded the province.',
  ],
  s0649: [
    'Gansu bandits raided into and took Longzhou; Magistrate Shao Fu died.',
    'Longzhou fell to Gansu raiders and Magistrate Shao Fu was killed.',
  ],
  s0650: [
    'On day guimao, Xue Huan was summoned to the capital; Li Hongzhang was made acting Commissioner for Trade.',
    'On guimao day, Xue Huan was recalled and Li Hongzhang acted as trade commissioner.',
  ],
  s0651: [
    'On day jiachen, bandits raided Yongnian, Handan, and elsewhere; Wen Yu and Zha\'kedunbu were stripped of office for delay and banished.',
    'On jiachen day, rebels hit Yongnian and Handan; Wen Yu and Zha\'kedunbu were dismissed and exiled for delay.',
  ],
  s0652: [
    'Liu Changyou was made Zhili governor-general; Yan Duanshu acted as Liang-Guang governor-general.',
    'Liu Changyou became Zhili governor-general and Yan Duanshu acted for Liang-Guang.',
  ],
  s0653: [
    'Admiral Baoshan was ordered to take over affairs on the Zhili-Shandong border.',
    'Baoshan was told to manage the Zhili-Shandong frontier.',
  ],
  s0654: [
    'On day yisi, the seasonal offering was made at the Imperial Ancestral Temple.',
    'On yisi day, the court performed the seasonal temple offering.',
  ],
  s0655: [
    'On day bingwu, Guangdong bandits again raided into Ningshan.',
    'On bingwu day, Guangdong rebels again entered Ningshan.',
  ],
  s0656: [
    'On day dingwei, Guangdong bandits besieged Xing\'an and split off toward Hanzhong.',
    'On dingwei day, Guangdong rebels besieged Xing\'an while detachments moved on Hanzhong.',
  ],
  s0657: [
    'That month, levies were remitted for disturbed counties in Sichuan and Fujian, and accumulated rent on Jiangnan lake flats.',
    'That month Sichuan and Fujian taxes were waived and Jiangnan lake-rent arrears forgiven.',
  ],
  s0658: [
    'That year, Korea and Ryukyu sent tribute.',
    'Korea and Ryukyu presented tribute that year.',
  ],
  s0659: [
    'Second year, spring, first month, new moon on wushen: court congratulations were waived.',
    'In spring of year 2, at the first-month new moon, the New Year audience was omitted.',
  ],
  s0660: [
    'Zhang Zhiwan was appointed Henan governor.',
    'Zhang Zhiwan became Henan governor.',
  ],
  s0661: [
    'On day xinhai, generous condolence was granted for the foreign general Labelle-East killed at Shaoxing.',
    'On xinhai day, the court honored Labelle-East, the foreign officer killed at Shaoxing.',
  ],
  s0662: [
    'On day jiayin, an edict ordered Zeng Guofan, Du Xing\'a, and others to recommend candidates fit to command the naval forces.',
    'On jiayin day, Zeng Guofan and Du Xing\'a were told to name able naval commanders.',
  ],
  s0663: [
    'Bandits took Wuyi; government troops soon recovered it.',
    'Wuyi fell to bandits and was quickly retaken.',
  ],
  s0664: [
    'Guangxi forces recovered Liantang.',
    'Liantang was retaken by Guangxi troops.',
  ],
  s0665: [
    'On day wuwu, Guangdong bandits took both the Xing\'an prefectural city and the garrison town.',
    'On wuwu day, Guangdong rebels seized Xing\'an prefecture and its garrison.',
  ],
  s0666: [
    'Shaanxi Muslim rebels raided into Huxian; at Yingqi\'s request, Ma Dezhao was kept for provincial defense.',
    'Muslim rebels entered Huxian; Yingqi kept Ma Dezhao for provincial defense.',
  ],
  s0667: [
    'On day bingyin, Bao Chao\'s army and others recovered Qingyang.',
    'On bingyin day, Bao Chao retook Qingyang.',
  ],
  s0668: [
    'On day wuchen, Li Huan was ordered to Shaanxi to take over Hanzhong military affairs.',
    'On wuchen day, Li Huan went to Shaanxi to command Hanzhong forces.',
  ],
  s0669: [
    'On day gengwu, the Zhandui chief stirred Degengtu native chiefs to harass Batang and Litang.',
    'On gengwu day, Zhandui stirred Degengtu tribes against Batang and Litang.',
  ],
  s0670: [
    'On day xinwei, raiding bandits south of the capital were pacified.',
    'On xinwei day, southern Zhili raiders were pacified.',
  ],
  s0671: [
    'On day jiaxu, because Fengxiang had been besieged half a year, Yingqi was rebuked for delay and Lei Zhengchao was urgently sent to relieve the siege.',
    'On jiaxu day, Fengxiang\'s six-month siege brought rebuke to Yingqi and urgent orders to Lei Zhengchao.',
  ],
  s0672: [
    'Second month, new moon on dingchou: Zuo Zongtang\'s army recovered Jinhua, Tangxi, Longyou, and Lanxi.',
    'At the second-month new moon, Zuo Zongtang retook Jinhua, Tangxi, Longyou, and Lanxi.',
  ],
  s0673: [
    'On day wuyin, following Li Hongzhang\'s memorial, the two Hu provinces were ordered to purchase grain with tribute-cash conversion and ship it to the capital tax-free.',
    'On wuyin day, Li Hongzhang won tax-free grain shipments from the two Hu using converted tribute funds.',
  ],
  s0674: [
    'On day gengchen, Li Xiucheng and others crossed the river north to attack; government troops defeated them.',
    'On gengchen day, Li Xiucheng crossed north and was beaten by government forces.',
  ],
  s0675: [
    'Sichuan troops campaigned against Shi Dakai and defeated him.',
    'Sichuan forces routed Shi Dakai.',
  ],
  s0676: [
    'Guizhou Muslim rebels took Annan and Xingyi.',
    'Annan and Xingyi fell to Guizhou Muslim rebels.',
  ],
  s0677: [
    'On day xinsi, Jilin troops defeated roaming bandits from Chaoyang at Lake Khanka; they were ordered not to flee into Russian territory.',
    'On xinsi day, Jilin beat Chaoyang bandits at Lake Khanka and was warned against crossing into Russia.',
  ],
  s0678: [
    'Duo Long\'a won a great victory suppressing Muslim rebels, storming bandit nests including Qiangbai Town.',
    'Duo Long\'a routed Muslim rebels and took nests including Qiangbai Town.',
  ],
  s0679: [
    'On day renwu, Shaanxi militia recovered Xing\'an.',
    'On renwu day, Shaanxi militia retook Xing\'an.',
  ],
  s0680: [
    'Guangdong bandits raided into Hanyin and Ziyang.',
    'Guangdong rebels entered Hanyin and Ziyang.',
  ],
  s0681: [
    'Li Shizhong asked to be stripped of office to redeem Sheng Bao\'s guilt; it was denied.',
    'Li Shizhong offered his post for Sheng Bao\'s sake and was refused.',
  ],
  s0682: [
    'Guangdong bandits raided into and took Baocheng; it was soon recovered.',
    'Baocheng fell to Guangdong raiders and was quickly retaken.',
  ],
  s0683: [
    'On day guiwei, Yongkang and Wuyi were recovered.',
    'On guiwei day, Yongkang and Wuyi were retaken.',
  ],
  s0684: [
    'On day yiyou, Tan Tingxiang went to Dongchang to suppress bandits.',
    'On yiyou day, Tan Tingxiang was sent to Dongchang against bandits.',
  ],
  s0685: [
    'On day dinghai, Zuo Zongtang shifted his army to Lanxi.',
    'On dinghai day, Zuo Zongtang moved headquarters to Lanxi.',
  ],
  s0686: [
    'Bandits occupying Dongyang, Yiwu, and Pujiang all fled.',
    'Rebels holding Dongyang, Yiwu, and Pujiang all withdrew.',
  ],
  s0687: [
    'On day jichou, Sengge Rinchen\'s army stormed the bandit nest at Zhiheji; Nian leader Zhang Luoxing was executed.',
    'On jichou day, Sengge Rinchen took Zhiheji and executed Nian chief Zhang Luoxing.',
  ],
  s0688: [
    'An edict praised and rewarded him; he still held princely rank with perpetual hereditary succession.',
    'The throne praised him and confirmed his perpetual princely inheritance.',
  ],
  s0689: [
    'Taxes and grain transport levies were waived for two years in Mengcheng, Bozhou, and subordinate districts.',
    'Mengcheng, Bozhou, and their districts received two years\' tax and grain remission.',
  ],
  s0690: [
    'On day gengyin, Pingluo Muslim rebels in Ningxia surrendered.',
    'On gengyin day, Pingluo Muslim rebels in Ningxia submitted.',
  ],
  s0691: [
    'On day xinmao, Qingyun was made Ningxia general.',
    'On xinmao day, Qingyun became Ningxia general.',
  ],
  s0692: [
    'On day guisi, Zhang Xizhu of the southern capital bandits fled into Daming; Chonghou was sharply rebuked for missing the chance and Liu Changyou was urged to reach Zhili.',
    'On guisi day, Zhang Xizhu entered Daming; Chonghou was rebuked and Liu Changyou was hurried to Zhili.',
  ],
  s0693: [
    'Feng Zicai defeated bandits at Zhenjiang.',
    'Feng Zicai beat bandits at Zhenjiang.',
  ],
  s0694: [
    'On day yiwei, Zuo Zongtang\'s army recovered Shaoxing and Tonglu.',
    'On yiwei day, Zuo Zongtang retook Shaoxing and Tonglu.',
  ],
  s0695: [
    'On day bingshen, Man Qing and others campaigned against the rebellious bandits of Zhandui.',
    'On bingshen day, Man Qing was sent against Zhandui rebels.',
  ],
  s0696: [
    'Huang Guorui\'s army stormed the bandit nest at the Great Wall of Tancheng county.',
    'Huang Guorui took the bandit stronghold at Tancheng\'s Great Wall.',
  ],
  s0697: [
    'For delay in pursuit, Chonghou was stripped of office but kept in post.',
    'Chonghou lost rank for slow pursuit yet remained on duty.',
  ],
  s0698: [
    'Eastern bandits raided into Quzhou and Pingxiang.',
    'Eastern rebels entered Quzhou and Pingxiang.',
  ],
  s0699: [
    'On day gengzi, En Lin and others were ordered not to treat Gansu Muslim rebels lightly with mere pacification.',
    'On gengzi day, En Lin was warned against easy pacification of Gansu Muslim rebels.',
  ],
  s0700: [
    'On day renyin, Ping Rui\'s request was approved to reclaim idle pastures around Urumqi and elsewhere, assess land tax to support the army, and allot colonized fields to garrison soldiers.',
    'On renyin day, Ping Rui won approval to open Urumqi pastures, tax reclaimed land for pay, and grant fields to garrison colonists.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_021_b07.mjs <translation.json>'
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
