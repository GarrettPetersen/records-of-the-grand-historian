#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0701: [
    'Coordinating Minister Adai was ordered to garrison at Uliassutai.',
    'Adai was posted as coordinating minister at Uliassutai.',
  ],
  s0702: [
    'Qingtai was made coordinating minister for the Northern Route army camp.',
    'Qingtai became northern-route army coordinating minister.',
  ],
  s0703: [
    'On day wuzi, quota taxes for Bazhou and Xiongxian were remitted.',
    'On wuzi day, Bazhou and Xiongxian quota taxes were waived.',
  ],
  s0704: [
    'On day jiawu, Ban Di was ordered to continue serving at the Grand Council.',
    'On jiawu day, Ban Di kept his post at the Grand Council.',
  ],
  s0705: [
    'Second month: Censor Cong Dong memorialized to suspend the hunting tour temporarily; the Emperor lectured him on the meaning of drilling troops and cherishing distant peoples.',
    'In the second month, Cong Dong asked to pause the hunt; the emperor rebuked him for missing its purpose of training troops and winning the frontier.',
  ],
  s0706: [
    'On day bingwu, Wanyan Wei was made Deputy Director-General of the South River.',
    'On bingwu day, Wanyan Wei became deputy South River director.',
  ],
  s0707: [
    'Quota taxes were remitted for the four Hubei counties of Zhongxiang and others stricken by hail and flood.',
    'Hubei Zhongxiang and three other counties received hail-flood tax relief.',
  ],
  s0708: [
    'On day jiayin, quota taxes were remitted for the three Shaanxi prefectures and counties of Jiazhou and others stricken by hail.',
    'On jiayin day, Jiazhou and two other Shaanxi districts received hail tax relief.',
  ],
  s0709: [
    'On day gengshen, a sub-circuit intendant post was added at Guihuacheng, Shanxi.',
    'On gengshen day, Shanxi\'s Guihuacheng circuit intendant post was created.',
  ],
  s0710: [
    'Third month, day renshen: Vice Minister Yang Sijing was ordered to Shanxi jointly to investigate the case of Shanxi education intendant Kaerqin selling licentiates for bribes.',
    'In the third month, Yang Sijing was sent to Shanxi to try Kaerqin\'s bribery-for-licentiate case.',
  ],
  s0711: [
    'On day jiashen, after Censor Zhong Yongtan impeached E Shan for taking bribes, the Prince of Yi and others were ordered to investigate.',
    'On jiashen day, Prince Yi and others were assigned to try E Shan after Zhong Yongtan\'s bribery charge.',
  ],
  s0712: [
    'E Shan was stripped of office and arrested for questioning.',
    'E Shan was dismissed and taken into custody.',
  ],
  s0713: [
    'On day xinmao, Zhong Yongtan was promoted to Censor-in-Chief.',
    'On xinmao day, Zhong Yongtan rose to censor-in-chief.',
  ],
  s0714: [
    'Summer, fourth month, first day yiwei: Grand Secretary Zhao Guolin asked to retire; it was refused.',
    'In the fourth month, Zhao Guolin\'s retirement request was denied.',
  ],
  s0715: [
    'Water-, insect-, and reed-field taxes were remitted for ten Jiangsu prefectures, counties, and garrisons including Fengxian.',
    'Jiangsu Fengxian and nine other districts received flood, locust, and reed-tax relief.',
  ],
  s0716: [
    'On day jiachen, last year\'s flood quota taxes were remitted for ten Zhili prefectures and counties including Bazhou.',
    'On jiachen day, ten Zhili districts including Bazhou received last year\'s flood tax relief.',
  ],
  s0717: [
    'Qing Fu was made acting Governor-General of Liangguang, and Zhang Yunshi acting Governor-General of Yungui.',
    'Qing Fu took acting charge of Liangguang; Zhang Yunshi of Yungui.',
  ],
  s0718: [
    'On day jiyou, E Shan was granted suicide.',
    'On jiyou day, E Shan was allowed to kill himself.',
  ],
  s0719: [
    'Fifth month, day wuyin: arrears taxes for Taiwan, Fujian were remitted.',
    'In the fifth month, Fujian Taiwan tax arrears were forgiven.',
  ],
  s0720: [
    'Relief was given for floods in Jiangxi Xingguo and other counties and in Guizhou Renhuai and Pingyue.',
    'Flood relief went to Jiangxi Xingguo and other counties and to Guizhou Renhuai and Pingyue.',
  ],
  s0721: [
    'Sixth month, first day jiawu: last year\'s flood quota taxes were remitted for six Shaanxi prefectures and counties including Jiazhou.',
    'In the sixth month, six Shaanxi districts including Jiazhou received last year\'s flood tax relief.',
  ],
  s0722: [
    'On day bingshen, Jiangsu governor Xu Shilin was granted leave to visit his parents; Chen Dashou was ordered to act for him.',
    'On bingshen day, Xu Shilin went on family leave; Chen Dashou acted as Jiangsu governor.',
  ],
  s0723: [
    'Zhang Kai was transferred to be Anhui governor.',
    'Zhang Kai became Anhui governor.',
  ],
  s0724: [
    'On day gengzi, Wang Anguo was ordered to investigate accumulated abuses in Guangdong grain levies for the campaign.',
    'On gengzi day, Wang Anguo was sent to probe Guangdong campaign grain abuses.',
  ],
  s0725: [
    'On day yisi, after Censor Li Gang impeached Gansu for concealing famine, he was ordered jointly with Yin Jishan to investigate.',
    'On yisi day, Li Gang\'s charge of concealed Gansu famine sent him with Yin Jishan to investigate.',
  ],
  s0726: [
    'On day jiyou, Zhejiang governor Lu Chao was removed; Depu and Deputy Banner Commander Wang Zhale were ordered to try him.',
    'On jiyou day, Lu Chao was dismissed; Depu and Wang Zhale were to investigate him.',
  ],
  s0727: [
    'Relief was given for floods in twelve Anhui prefectures and counties including Suzhou and in Jiangsu Shanyang and other districts.',
    'Flood relief went to twelve Anhui districts and to Jiangsu Shanyang and others.',
  ],
  s0728: [
    'Zhao Guolin was demoted for recommending unworthy men.',
    'Zhao Guolin was reduced in rank for bad nominations.',
  ],
  s0729: [
    'Autumn, seventh month: arrears taxes for Suzhou and other Jiangsu prefectures were remitted.',
    'In the seventh month, Jiangsu Suzhou and other districts received arrears tax relief.',
  ],
  s0730: [
    'On day jiazi, Kaerqin was executed.',
    'On jiazi day, Kaerqin was beheaded.',
  ],
  s0731: [
    'On day bingzi, Sahaliang was sentenced to decapitation.',
    'On bingzi day, Sahaliang received the death penalty.',
  ],
  s0732: [
    'On day wuyin, Gansu governor Yuan Zhancheng was removed after impeachment by Censor Hu Ding; Deputy Banner Commander Xinzhu was sent to investigate jointly with Yin Jishan.',
    'On wuyin day, Yuan Zhancheng left office over Hu Ding\'s charge; Xinzhu joined Yin Jishan to try the case.',
  ],
  s0733: [
    'On day guiwei, an edict halted autumn executions for the year.',
    'On guiwei day, autumn executions were suspended.',
  ],
  s0734: [
    'On day wuzi, the Emperor held his first autumn hunt.',
    'On wuzi day, the emperor opened the autumn hunt.',
  ],
  s0735: [
    'Accompanying the Empress Dowager to the Mountain Resort for Summer Retreat, he remitted three-tenths of quota taxes along the route.',
    'Traveling with the empress dowager to the summer retreat, he cut route taxes by thirty percent.',
  ],
  s0736: [
    'Henceforth this was done annually, reducing quota taxes of counties passed during the hunting tour.',
    'Thereafter counties on the hunt route received annual tax reductions.',
  ],
  s0737: [
    'On day xinmao, relief was given for floods in two Jiangxi counties, Wuning and another.',
    'On xinmao day, Jiangxi Wuning and another county received flood relief.',
  ],
  s0738: [
    'On day renchen, the Emperor reached Gubeikou to review troops.',
    'On renchen day, the emperor inspected troops at Gubeikou.',
  ],
  s0739: [
    'Famine relief was given for Yong\'an and Guishan, Guangdong.',
    'Guangdong Yong\'an and Guishan received famine relief.',
  ],
  s0740: [
    'Eighth month, day guisi: relief was given for floods in nineteen Anhui prefectures, counties, and garrisons including Suzhou.',
    'In the eighth month, nineteen Anhui districts including Suzhou received flood relief.',
  ],
  s0741: [
    'On day gengzi, the Emperor halted at Zhangsanying.',
    'On gengzi day, the court halted at Zhangsanying.',
  ],
  s0742: [
    'On day xinchou, the Emperor conducted a hunting encirclement.',
    'On xinchou day, the emperor held a battue hunt.',
  ],
  s0743: [
    'Relief was given for floods in eighteen Jiangsu prefectures and counties and salt pans including Shanyang and Guandu.',
    'Jiangsu Shanyang and seventeen other districts and the Guandu pans received flood relief.',
  ],
  s0744: [
    'On day jiyou, Yang Chaoeng was recalled to the capital.',
    'On jiyou day, Yang Chaoeng was recalled to Beijing.',
  ],
  s0745: [
    'Nasutu was transferred to be Governor-General of Liangjiang, and Sun Jiagan Governor-General of Huguang.',
    'Nasutu became Liangjiang governor-general; Sun Jiagan Huguang governor-general.',
  ],
  s0746: [
    'Gao Bin was made Governor-General of Zhili and Wanyan Wei Director-General of the Jiangnan waterways.',
    'Gao Bin took Zhili; Wanyan Wei took Jiangnan waterways.',
  ],
  s0747: [
    'The Zhili waterways governor-general post was cut; Gao Bin was ordered also to oversee Zhili river works.',
    'Zhili\'s waterworks governor-general was abolished; Gao Bin added Zhili river duties.',
  ],
  s0748: [
    'On day xinhai, Ningguta general Jidang\'a was recalled to the capital; E\'erda replaced him.',
    'On xinhai day, Jidang\'a left Ningguta; E\'erda succeeded him.',
  ],
  s0749: [
    'Ninth month, first day guihai: Chen Hongmou was made Gansu governor.',
    'In the ninth month, Chen Hongmou became Gansu governor.',
  ],
  s0750: [
    'On day yichou, the Emperor accompanied the Empress Dowager back to the Mountain Resort for Summer Retreat.',
    'On yichou day, the emperor returned with the empress dowager to the summer retreat.',
  ],
  s0751: [
    'Famine relief was given for twenty-six Guangdong prefectures, counties, and subprefectures including Nanhai.',
    'Guangdong Nanhai and twenty-five other districts received famine relief.',
  ],
  s0752: [
    'The Emperor accompanied the Empress Dowager on the return journey to the capital.',
    'The emperor escorted the empress dowager back toward the capital.',
  ],
  s0753: [
    'On day renshen, Wang Shu was made Fujian governor and Yang Xizhao Guangxi governor.',
    'On renshen day, Wang Shu took Fujian; Yang Xizhao Guangxi.',
  ],
  s0754: [
    'On day jiaxu, Chen Hongmou was transferred to Jiangxi governor and Huang Tinggui to Gansu governor.',
    'On jiaxu day, Chen Hongmou went to Jiangxi; Huang Tinggui to Gansu.',
  ],
  s0755: [
    'Grain transport taxes for Jiangsu and Anhui from Qianlong years 3-4 that had suffered disaster were remitted.',
    'Jiangsu and Anhui disaster-struck grain transport levies from years 3-4 were waived.',
  ],
  s0756: [
    'On day jimao, Han Guangji was transferred to be Minister of Works.',
    'On jimao day, Han Guangji became minister of works.',
  ],
  s0757: [
    'Liu Wulong was made Minister of Punishments.',
    'Liu Wulong became minister of punishments.',
  ],
  s0758: [
    'On day xinsi, former Jiangsu governor Xu Shilin died.',
    'On xinsi day, former governor Xu Shilin died.',
  ],
  s0759: [
    'Chen Dashou was made Jiangsu governor and Zhang Kai Anhui governor.',
    'Chen Dashou took Jiangsu; Zhang Kai Anhui.',
  ],
  s0760: [
    'Famine relief was given for eight Fujian counties including Fuqing and for garrison posts of Changfu and others.',
    'Fujian Fuqing and seven other counties plus Changfu garrisons received famine relief.',
  ],
  s0761: [
    'On day dinghai, Liu Tongxun was made Left Censor-in-Chief.',
    'On dinghai day, Liu Tongxun became left censor-in-chief.',
  ],
  s0762: [
    'Winter, tenth month, day gengzi: typhoon disaster relief was given for twenty-four Guangdong prefectures and counties including Qiongshan.',
    'In the tenth month, twenty-four Guangdong districts including Qiongshan received typhoon relief.',
  ],
  s0763: [
    'On day dingwei, relief was given for floods in thirty-one Anhui prefectures, counties, and garrisons including Suzhou, and quota and grain-transport taxes were also remitted for three prefectures and counties including Suzhou.',
    'On dingwei day, thirty-one Anhui districts received flood relief; three including Suzhou also got tax and grain remissions.',
  ],
  s0764: [
    'On day jiyou, famine relief was given for Lingzhou and other places in Gansu.',
    'On jiyou day, Gansu Lingzhou and other places received famine relief.',
  ],
  s0765: [
    'On day bingchen, flood relief was given for the four Rehe banner households.',
    'On bingchen day, Rehe\'s four banners received flood relief.',
  ],
  s0766: [
    'Eleventh month, day jiazi: famine relief was given for salt-workers\' households on the Lianghuai coast.',
    'In the eleventh month, Lianghuai salt-workers received famine relief.',
  ],
  s0767: [
    'On day yichou, the king of Nan Zhang sent tribute.',
    'On yichou day, Nan Zhang paid tribute.',
  ],
  s0768: [
    'On day bingyin, hail-flood relief was given for fourteen Gansu prefectures and counties including Pingfan.',
    'On bingyin day, fourteen Gansu districts including Pingfan received hail-flood relief.',
  ],
  s0769: [
    'On day jisi, Censor Li Gang\'s memorial on Gansu famine conditions was judged inaccurate and the ministry recommended dismissal from office.',
    'On jisi day, Li Gang\'s Gansu famine report was found false and the ministry sought his dismissal.',
  ],
  s0770: [
    'The Emperor said: "Rather than punish the censor and open the door to concealing calamities, it is better to be lenient and broaden our eyes and ears.',
    'The emperor said leniency toward censors was better than encouraging disaster concealment.',
  ],
  s0771: [
    '" He ordered Li Gang dismissed from office yet retained in his post.',
    'Li Gang was demoted but kept on duty.',
  ],
  s0772: [
    'On day wuyin, quota taxes were remitted for fifteen Jiangsu prefectures, counties, and garrisons including Shanyang stricken by flood.',
    'On wuyin day, fifteen Jiangsu districts including Shanyang received flood tax relief.',
  ],
  s0773: [
    'Famine relief was given for thirty-four prefectures, counties, and garrisons including Jurong.',
    'Jurong and thirty-three other districts received famine relief.',
  ],
  s0774: [
    'On day bingxu, on the Empress Dowager\'s fiftieth birthday, the Emperor led princes and ministers in congratulations at the Cining Palace.',
    'On bingxu day, the emperor led court congratulations at Cining for the empress dowager\'s fiftieth birthday.',
  ],
  s0775: [
    'Twelfth month, day yiwei: Liu Tongxun asked to halt promotions of Zhang Tingyu\'s close kin and reduce the duties managed by the Neqin clan; the Emperor praised him.',
    'In the twelfth month, Liu Tongxun sought curbs on Zhang Tingyu\'s kin and Neqin offices and won praise.',
  ],
  s0776: [
    'On day bingshen, Grand Secretary Zhang Tingyu asked to be relieved of ministry duties; it was refused.',
    'On bingshen day, Zhang Tingyu\'s request to quit ministry work was denied.',
  ],
  s0777: [
    'On day xinchou, five years of flood quota taxes were remitted for two Gansu counties, Wuwei and another.',
    'On xinchou day, two Gansu counties including Wuwei received five years of flood tax relief.',
  ],
  s0778: [
    'Drought relief was given for Jiangsu prefectures and counties including Jiangpu.',
    'Jiangsu Jiangpu and other districts received drought relief.',
  ],
  s0779: [
    'Flood quota taxes were remitted for two Hunan counties including Xiangxiang.',
    'Hunan Xiangxiang and another county received flood tax relief.',
  ],
  s0780: [
    'On day yisi, this year\'s quota taxes were remitted for nineteen Zhejiang prefectures and counties including Renhe.',
    'On yisi day, nineteen Zhejiang districts including Renhe received this year\'s tax relief.',
  ],
  s0781: [
    'On day dingwei, drought quota taxes were remitted for sixteen Shandong prefectures, counties, and garrisons including Licheng.',
    'On dingwei day, sixteen Shandong districts including Licheng received drought tax relief.',
  ],
  s0782: [
    'On day gengxu, drought quota taxes were remitted for three Gansu counties including Yongchang.',
    'On gengxu day, three Gansu counties including Yongchang received drought tax relief.',
  ],
  s0783: [
    'Ryukyu presented tribute.',
    'Ryukyu sent tribute.',
  ],
  s0784: [
    'Chang An was transferred to Zhejiang governor and Gu Cong to Grain Transport Director-General.',
    'Chang An took Zhejiang; Gu Cong the grain transport command.',
  ],
  s0785: [
    'Liu Tongxun was ordered to go to Zhejiang jointly to survey the seacoast dikes.',
    'Liu Tongxun was sent to Zhejiang to inspect sea dikes.',
  ],
  s0786: [
    'Relief was given for flood and drought in seventeen Zhejiang prefectures and counties including Shengxian and salt pans of Renhe and others.',
    'Zhejiang Shengxian and sixteen other districts plus Renhe pans received flood-drought relief.',
  ],
  s0787: [
    'Seventh year, spring, first month, day renxu: Shi Yizhi was transferred to Minister of Personnel and Ren Lanzhi to Minister of War.',
    'In spring of year 7, Shi Yizhi took personnel; Ren Lanzhi war.',
  ],
  s0788: [
    'Zhao Guolin was made Minister of Rites.',
    'Zhao Guolin became minister of rites.',
  ],
  s0789: [
    'On day gengwu, it was fixed that four thousand troops would be levied jointly from Suiyuan, Youwei, Guihuacheng Tumed, and Chahar, with four thousand five hundred first-rank and six thousand five hundred second-rank banner troops of the Jasak princes to reinforce the Northern Route army camp, and camels and horses were provisioned all along the route to Erdeni Zhao.',
    'On gengwu day, troops and camels were arranged to reinforce the northern camp along the Erdeni Zhao route.',
  ],
  s0790: [
    'On day wuyin, the thirty-nine tribes of the Nakusu were exempted this year\'s quota taxes for preparing camels and horses for Zungar troops entering Tibet.',
    'On wuyin day, thirty-nine Nakusu tribes were tax-exempt for supplying the Tibet campaign.',
  ],
  s0791: [
    'On day jiashen, famine relief was given for the two Anhui prefectures of Fengyang and Yingzhou and Su Prefecture.',
    'On jiashen day, Fengyang, Yingzhou, and Su Prefecture received famine relief.',
  ],
  s0792: [
    'On day gengyin, the Zungars presented tribute.',
    'On gengyin day, the Zungars sent tribute.',
  ],
  s0793: [
    'Second month, first day xinmao: the Emperor went to the Tailing Mausoleum.',
    'In the second month, the emperor set out for Tailing.',
  ],
  s0794: [
    'On day yiwei, the Emperor paid homage at Tailing.',
    'On yiwei day, the emperor worshipped at Tailing.',
  ],
  s0795: [
    'That day the court returned to the capital.',
    'The court returned that same day.',
  ],
  s0796: [
    'On day bingshen, Korea presented tribute.',
    'On bingshen day, Korea sent tribute.',
  ],
  s0797: [
    'On day wuxu, the Emperor went to the Southern Park for a hunting encirclement.',
    'On wuxu day, the emperor hunted at the Southern Park.',
  ],
  s0798: [
    'On day jihai, Ryukyu presented tribute.',
    'On jihai day, Ryukyu sent tribute again.',
  ],
  s0799: [
    'On day jiyou, Minister of Rites Zhao Guolin asked to retire; it was refused.',
    'On jiyou day, Zhao Guolin\'s retirement plea was denied.',
  ],
  s0800: [
    'On day yimao, Jidang\'a was made commander at Guihuacheng.',
    'On yimao day, Jidang\'a became Guihuacheng commander.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_010_b08.mjs <translation.json>'
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

const missingOut = data.sentences.filter((s) => !s.literal || !s.idiomatic);
if (missingOut.length) {
  console.error(`Missing: ${missingOut.map((s) => s.id).join(', ')}`);
  process.exit(1);
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patched ${patched} sentences`);
