#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    "That month, grain taxes on Jiangsu waste land were remitted, and overdue grain taxes from disturbed districts including Tai'an in Shandong and Runing in Henan.",
    "That month Jiangsu waste-land taxes and overdue taxes from Tai'an, Runing, and other disturbed districts were remitted.",
  ],
  s0302: [
    "That year, Korea presented tribute.",
    "Korea paid tribute that year.",
  ],
  s0303: [
    "Eighth year, jisi cycle, spring, first month, guiyou new moon: court banquets were suspended.",
    "Year 8, spring month 1, guiyou new moon: court banquets stopped.",
  ],
  s0304: [
    "On day dingchou, armies of Sichuan, Hunan, Guizhou, and Guangxi jointly suppressed Miao bandits; Guizhou forces recovered Changzhai.",
    "On dingchou, four provinces' armies suppressed Miao bandits and Guizhou recovered Changzhai.",
  ],
  s0305: [
    "On day wuyin, Yunnan forces took Fumin.",
    "On wuyin, Yunnan forces took Fumin.",
  ],
  s0306: [
    "On day jichou, Liu Songshan and others defeated Tu and Hui bandits at Qingjian.",
    "On jichou, Liu Songshan defeated Tu and Hui bandits at Qingjian.",
  ],
  s0307: [
    "Cheng Lu took Suzhou; he and Yang Zhan'ao were both rewarded with yellow jackets.",
    "Cheng Lu took Suzhou; he and Yang Zhan'ao won yellow jackets.",
  ],
  s0308: [
    "On day jiawu, the Rong riverworks were closed.",
    "On jiawu, the Rong riverworks closed.",
  ],
  s0309: [
    "On day bingshen, Liu Songshan's army defeated rebels at Jingbian; Dong Shiyou and others surrendered Zhenjing Fort and Jingbian.",
    "On bingshen, Liu Songshan beat rebels at Jingbian and Dong Shiyou surrendered Jingbian.",
  ],
  s0310: [
    "Western Yunnan Hui attacked Kunming; Cen Yuying and others drove them back.",
    "Western Yunnan Hui hit Kunming and Cen Yuying drove them back.",
  ],
  s0311: [
    "On day xinchou, Lei Zhengguan took Dongjiabao at Jingzhou.",
    "On xinchou, Lei Zhengguan took Jingzhou's Dongjiabao.",
  ],
  s0312: [
    "Second month, day wushen: Yuan Baoheng was ordered to supervise western campaign grain and funds.",
    "Month 2, wushen: Yuan Baoheng supervised western campaign supplies.",
  ],
  s0313: [
    "Third month, guiyou new moon: Lin Ziqing killed the Xingyi magistrate; Provincial Commander Chen Xixiang lured and executed him and was rewarded with a yellow jacket.",
    "Month 3, guiyou new moon: Lin Ziqing killed Xingyi's magistrate; Chen Xixiang executed him and won a yellow jacket.",
  ],
  s0314: [
    "On day jiaxu, Hunan relief forces for Guizhou recovered Zhenyuan prefecture and two district cities.",
    "On jiaxu, Hunan relief for Guizhou recovered Zhenyuan and two districts.",
  ],
  s0315: [
    "On day jimao, Gansu Provincial Commander Gao Liansheng's troops mutinied and killed him; subordinate Zhou Shaolian crushed the mutineers at Tongguan.",
    "On jimao, Gao Liansheng's Gansu troops mutinied and Zhou Shaolian wiped them out at Tongguan.",
  ],
  s0316: [
    "On day yiyou, governors and governors-general were instructed to choose magistrates carefully when recovering prefectures and counties and to comfort displaced people.",
    "On yiyou, recovered districts were told to pick good magistrates and aid refugees.",
  ],
  s0317: [
    "On day gengyin, Hui bandits took Dengkou.",
    "On gengyin, Hui bandits took Dengkou.",
  ],
  s0318: [
    "On day jiawu, Turfan Hui attacked Hami; government troops repeatedly defeated them.",
    "On jiawu, Turfan Hui hit Hami and government troops beat them repeatedly.",
  ],
  s0319: [
    "On day yiwei, Guangxi forces took Pingxiang.",
    "On yiwei, Guangxi forces took Pingxiang.",
  ],
  s0320: [
    "On day jihai, an imperial rescript stated that the grand wedding ceremony must uphold frugality.",
    "On jihai, the throne ordered a frugal grand wedding.",
  ],
  s0321: [
    "That spring, disaster and disturbance taxes were remitted for Shanyang in Jiangsu, Anzhou in Zhili, and other districts; overdue salt-works levies at Fu'an and other Liang-Huai fields were also forgiven.",
    "That spring Jiangsu, Zhili, and Liang-Huai districts had disaster taxes and salt arrears remitted.",
  ],
  s0322: [
    "Summer, fourth month, maoyin new moon: western Yunnan Hui took Yanglin camp; Liu Yuezhao fell back to defend Qujing and was severely rebuked.",
    "Month 4, maoyin new moon: Hui took Yanglin camp and Liu Yuezhao was rebuked for retreating to Qujing.",
  ],
  s0323: [
    "On day yisi, Lin Xing was stripped of office for timidity in office.",
    "On yisi, Lin Xing lost office for cowardice.",
  ],
  s0324: [
    "Fu Ji was made Uriankhai general; Wenshu was made Buruntokhai affairs commissioner.",
    "Fu Ji took Uriankhai and Wenshu took Buruntokhai affairs.",
  ],
  s0325: [
    "On day jiyou, Lei Zhengguan and Huang Ding's armies recovered Zhenyuan and Qingyang.",
    "On jiyou, Lei Zhengguan and Huang Ding recovered Zhenyuan and Qingyang.",
  ],
  s0326: [
    "Sichuan relief for Guizhou recovered Weng'an.",
    "Sichuan relief recovered Weng'an for Guizhou.",
  ],
  s0327: [
    "On day jiwei, Hunan relief for Guizhou jointly recovered Qingjiang.",
    "On jiwei, Hunan relief jointly recovered Qingjiang.",
  ],
  s0328: [
    "On day gengshen, Liu Mingchuan's request to retire for illness was granted.",
    "On gengshen, Liu Mingchuan's sick leave was granted.",
  ],
  s0329: [
    "On day xinyou, Chen Ni's banishment was remitted.",
    "On xinyou, Chen Ni was spared banishment.",
  ],
  s0330: [
    "That month, overdue taxes from Dongchang and other Shandong districts were remitted.",
    "That month Shandong's Dongchang and other districts had overdue taxes remitted.",
  ],
  s0331: [
    "Fifth month, day gengchen: Hunan relief for Guizhou recovered Shibing; advancing on Huang Piao's bandit fort they were defeated; Provincial Judge Huang Runchang, Circuit Intendant Deng Ziyuan, and Provincial Commander Liu Changhuai died.",
    "Month 5, gengchen: relief recovered Shibing but failed attacking Huang Piao's fort; Huang Runchang, Deng Ziyuan, and Liu Changhuai died.",
  ],
  s0332: [
    "On day renwu, Hui bandits took Chengjiang.",
    "On renwu, Hui bandits took Chengjiang.",
  ],
  s0333: [
    "On day jiashen, Degar and others' armies routed rebels at Hanggin Banner.",
    "On jiashen, Degar's armies routed rebels at Hanggin.",
  ],
  s0334: [
    "On day xinmao, Li Hongzhang was sent to Sichuan to investigate the impeachment case of Wu Tang.",
    "On xinmao, Li Hongzhang went to Sichuan on Wu Tang's impeachment.",
  ],
  s0335: [
    "Cen Yuying was admonished for employing militia leaders who trafficked with rebels and for harsh levies on the people.",
    "Cen Yuying was warned for rebel-tied militia leaders and harsh levies.",
  ],
  s0336: [
    "Ma Rulong was made Yunnan provincial commander.",
    "Ma Rulong became Yunnan commander.",
  ],
  s0337: [
    "On day bingshen, government troops won a great victory suppressing bandits at Bao'an; bandit chief Yuan Dakui and others were executed.",
    "On bingshen, troops crushed Bao'an bandits and Yuan Dakui was executed.",
  ],
  s0338: [
    "From the first month of spring until this month there had been no rain; the Emperor prayed repeatedly.",
    "From spring until this month there was drought and the Emperor prayed.",
  ],
  s0339: [
    "On day dingyou, it rained.",
    "On dingyou, rain fell.",
  ],
  s0340: [
    "Sixth month, day xinhai: relief armies jointly took Xundian.",
    "Month 6, xinhai: relief armies took Xundian.",
  ],
  s0341: [
    "On day renzi, Dong Xun and Chonghou were ordered to handle Austria-Hungary treaty revision.",
    "On renzi, Dong Xun and Chonghou handled Austria-Hungary treaty revision.",
  ],
  s0342: [
    "On day jiayin, the Yongding River breached.",
    "On jiayin, the Yongding broke its banks.",
  ],
  s0343: [
    "On day wuwu, hereditary offices of Provincial Commander Rong Weishan, Regional Commander Luo Zhihong, and others who died fighting Huang Piao were raised one grade.",
    "On wuwu, offices of men who died at Huang Piao were raised one grade.",
  ],
  s0344: [
    "On day xinyou, Wuying Hall burned.",
    "On xinyou, Wuying Hall burned.",
  ],
  s0345: [
    "On day guihai, Woren, Xu Tong, and Weng Tonghe urged diligent cultivation of sagely virtue to avert disasters; the Emperor commended and accepted it.",
    "On guihai, Woren, Xu Tong, and Weng Tonghe urged moral self-cultivation and the Emperor accepted.",
  ],
  s0346: [
    "On day bingyin, governors were instructed to examine agriculture and sericulture.",
    "On bingyin, governors were told to inspect farming and silk.",
  ],
  s0347: [
    "On day gengwu, Hui bandits attacked Dingyuan camp in Alashan; Mongol troops were defeated.",
    "On gengwu, Hui hit Alashan's Dingyuan camp and Mongols lost.",
  ],
  s0348: [
    "Autumn, seventh month, xinwei new moon: there was an eclipse of the sun.",
    "Month 7, xinwei new moon: solar eclipse.",
  ],
  s0349: [
    "On day guiyou, Zhang Yao and others' armies defeated Hui rebels at Chahan Nur.",
    "On guiyou, Zhang Yao beat Hui rebels at Chahan Nur.",
  ],
  s0350: [
    "Wu Kunxiu was ordered to go to districts along the river to comfort disaster victims.",
    "Wu Kunxiu was sent to comfort river-district disaster victims.",
  ],
  s0351: [
    "On day jiaxu, Yunnan forces recovered Songming and took Baiyan Well.",
    "On jiaxu, Yunnan recovered Songming and took Baiyan Well.",
  ],
  s0352: [
    "On day jiashen, Guangxi forces with Vietnam's army took Jiuyi, Luoyang, and other passes.",
    "On jiashen, Guangxi and Vietnam took Jiuyi and Luoyang passes.",
  ],
  s0353: [
    "On day yiyou, Xilun was instructed to relieve the Ölöd populace.",
    "On yiyou, Xilun was told to relieve the Ölöd.",
  ],
  s0354: [
    "On day bingxu, Korea requested that north of the Yalu roaming commoners be forbidden to build houses and open fields.",
    "On bingxu, Korea asked to ban Yalu north settlers from building and farming.",
  ],
  s0355: [
    "Duxing'a and others were urged to handle the matter properly.",
    "Duxing'a and others were told to handle it.",
  ],
  s0356: [
    "On day renchen, He Guan's army defeated bandits at Mulei River and elsewhere.",
    "On renchen, He Guan beat bandits at Mulei River.",
  ],
  s0357: [
    "That month, overdue taxes from disturbed Huangzhou were remitted.",
    "That month Huangzhou's disturbed overdue taxes were remitted.",
  ],
  s0358: [
    "Eighth month, gengzi new moon: a Russian merchant ship anchored at the Hulan estuary seeking inland trade in Jilin and Heilongjiang; the Zongli Yamen was instructed to stop it by treaty and private trade by soldiers and civilians was forbidden.",
    "Month 8, gengzi new moon: Russia sought Jilin-Heilongjiang trade and the Yamen stopped it by treaty.",
  ],
  s0359: [
    "On day guimao, eunuch An Dehai left the capital; Ding Baozhen memorialized his execution.",
    "On guimao, An Dehai left Beijing and Ding Baozhen reported his execution.",
  ],
  s0360: [
    "Guizhou bandits again took Duyun.",
    "Guizhou bandits retook Duyun.",
  ],
  s0361: [
    "On day bingwu, Guangxi forces with others recovered Vietnam's Gaoping.",
    "On bingwu, Guangxi forces recovered Gaoping in Vietnam.",
  ],
  s0362: [
    "On day gengxu, an edict again warned restraint of eunuchs.",
    "On gengxu, the throne again warned restraint of eunuchs.",
  ],
  s0363: [
    "On day renzi, government troops suppressed fleeing Hui in Hanggin Banner territory.",
    "On renzi, troops cleared fleeing Hui in Hanggin lands.",
  ],
  s0364: [
    "On day guichou, Ningxia government troops were defeated suppressing bandits; Vice Commander Fang Dashun fell in battle.",
    "On guichou, Ningxia troops lost and Fang Dashun died.",
  ],
  s0365: [
    "On day wuwu, Kungazhala's army recovered Buruntokhai; bandit chief Zhang Ju and others were executed.",
    "On wuwu, Kungazhala recovered Buruntokhai and Zhang Ju was executed.",
  ],
  s0366: [
    "On day jiwei, government troops suppressed fleeing bandits in Dörbet Banner and destroyed them.",
    "On jiwei, troops wiped out bandits in Dörbet Banner.",
  ],
  s0367: [
    "That month, disaster relief was given for floods in Hangzhou and Huzhou in Zhejiang and for Anxiang and other Hunan counties.",
    "That month Zhejiang and Hunan flood districts were relieved.",
  ],
  s0368: [
    "Ninth month, day gengwu: Gaotai braves routed; Cheng Lu was stripped but kept in post.",
    "Month 9, gengwu: Gaotai braves routed and Cheng Lu lost rank but stayed.",
  ],
  s0369: [
    "On day renshen, three hundred thousand taels of Beijing funds were allocated for engineering relief in Wuhan and other districts.",
    "On renshen, 300,000 taels went to Wuhan engineering relief.",
  ],
  s0370: [
    "On day jiaxu, Ma Hualong rebelled again and seized Lingzhou.",
    "On jiaxu, Ma Hualong rebelled again and took Lingzhou.",
  ],
  s0371: [
    "Government troops recovered Weirong Fort and Shuiluo City.",
    "Government troops recovered Weirong Fort and Shuiluo City.",
  ],
  s0372: [
    "On day wuyin, Yunnan forces recovered Yimen.",
    "On wuyin, Yunnan forces recovered Yimen.",
  ],
  s0373: [
    "On day renwu, Siam was forgiven for making up overdue tribute goods from past years.",
    "On renwu, Siam was forgiven overdue tribute arrears.",
  ],
  s0374: [
    "On day gengyin, Ürümqi bandits fled into Hami; He Guan and others defeated them.",
    "On gengyin, Ürümqi bandits fled to Hami and He Guan beat them.",
  ],
  s0375: [
    "On day yiwei, Fujian's first newly built steamship was completed and Chonghou was ordered to inspect it.",
    "On yiwei, Fujian's first steamship was finished and Chonghou inspected it.",
  ],
  s0376: [
    "On day wuxu, Fu Ji and others were instructed that each Ölöd group should settle in its old homes: clergy south of the Altai, laymen on the Qinggeli River.",
    "On wuxu, Ölöd groups were settled: clergy south of Altai, laymen on Qinggeli River.",
  ],
  s0377: [
    "Winter, tenth month, day gengzi: Liu Songshan defeated Hui rebels at Wuzhongbao and elsewhere.",
    "Month 10, gengzi: Liu Songshan beat Hui at Wuzhongbao.",
  ],
  s0378: [
    "On day xinchou, Jin Shun defeated them again at Najiatang.",
    "On xinchou, Jin Shun beat them again at Najiatang.",
  ],
  s0379: [
    "Yang Zhan'ao was ordered to act as Gansu provincial commander and handle Suzhou pacification.",
    "Yang Zhan'ao acted as Gansu commander for Suzhou pacification.",
  ],
  s0380: [
    "French envoy Rochechouart and his naval commander went by warship to Jiangxi, Hubei, and Sichuan to investigate missionary cases; local officials were instructed to receive them per treaty.",
    "France sent warships to Jiangxi, Hubei, and Sichuan on missionary cases under treaty rules.",
  ],
  s0381: [
    "On day yisi, Lei Zhengguan and Huang Ding defeated Hui rebels at Guyuan and Yancha.",
    "On yisi, Lei Zhengguan and Huang Ding beat Hui at Guyuan and Yancha.",
  ],
  s0382: [
    "On day dingwei, Mao Changxi and Shen Guifen were ordered to serve in the Zongli Yamen.",
    "On dingwei, Mao Changxi and Shen Guifen joined the Zongli Yamen.",
  ],
  s0383: [
    "On day xinchou, Wenshu and others were ordered to survey Buruntokhai boundaries; Dong Xun handled American treaty revision.",
    "On xinchou, Wenshu surveyed Buruntokhai boundaries and Dong Xun handled the American treaty.",
  ],
  s0384: [
    "On day jiayin, Yunnan forces recovered Chuxiong, Nan'an, and Dingyuan.",
    "On jiayin, Yunnan recovered Chuxiong, Nan'an, and Dingyuan.",
  ],
  s0385: [
    "Liu Yuezhao moved his army to Kunming.",
    "Liu Yuezhao moved his army to Kunming.",
  ],
  s0386: [
    "On day jiwei, Hami government troops won a great victory suppressing western-route Hui rebels.",
    "On jiwei, Hami troops crushed western-route Hui.",
  ],
  s0387: [
    "On day jiazi, bandit chiefs including Wang Qing of Fenghuangcheng were executed.",
    "On jiazi, Wang Qing of Fenghuangcheng and other chiefs were executed.",
  ],
  s0388: [
    "On day yichou, Liu Songshan's army recovered Lingzhou.",
    "On yichou, Liu Songshan recovered Lingzhou.",
  ],
  s0389: [
    "That month, flood relief was given for Yunnan and drought relief for Zhili.",
    "That month Yunnan floods and Zhili drought were relieved.",
  ],
  s0390: [
    "Eleventh month, day bingzi: Chiping sect bandits Sun Shangwen and others plotted rebellion and were arrested and executed.",
    "Month 11, bingzi: Chiping sect plotters including Sun Shangwen were executed.",
  ],
  s0391: [
    "On day dingchou, the newly established Buruntokhai affairs commissioner was abolished.",
    "On dingchou, the new Buruntokhai commissioner post was abolished.",
  ],
  s0392: [
    "On day gengchen, Jiangning flood victims were relieved.",
    "On gengchen, Jiangning flood victims were relieved.",
  ],
  s0393: [
    "On day guiwei, tribute sable from Kobdo dependencies was remitted.",
    "On guiwei, Kobdo sable tribute was remitted.",
  ],
  s0394: [
    "On day jiashen, Yunnan forces recovered Kunyang.",
    "On jiashen, Yunnan recovered Kunyang.",
  ],
  s0395: [
    "On day bingxu, Gansu forces recovered Jingyuan.",
    "On bingxu, Gansu forces recovered Jingyuan.",
  ],
  s0396: [
    "On day gengyin, the Yongding estuary works were closed.",
    "On gengyin, the Yongding estuary was closed.",
  ],
  s0397: [
    "On day yiwei, Wenshu was summoned to the capital and Kuichang was changed to handle boundary affairs.",
    "On yiwei, Wenshu came to Beijing and Kuichang took boundaries.",
  ],
  s0398: [
    "That month, taxes were remitted for flooded and disturbed Dongming in Zhili and for flood-overdue taxes in Wuwei and other Anhui districts.",
    "That month Zhili Dongming and Anhui Wuwei flood taxes were remitted.",
  ],
  s0399: [
    "Twelfth month, day gengzi: Sichuan relief for Yunnan took Ludian.",
    "Month 12, gengzi: Sichuan relief for Yunnan took Ludian.",
  ],
  s0400: [
    "On day yisi, Liu Songshan's army attacked Jinjibao; Regional Commander Jian Jinglin and others died.",
    "On yisi, Liu Songshan attacked Jinjibao and Jian Jinglin died.",
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_022_b04.mjs <translation.json>'
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

