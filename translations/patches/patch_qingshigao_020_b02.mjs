#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'On day jiwei, Vice Minister of Revenue Shuxing\'a was appointed Grand Council member.',
    'On jiwei day, Shuxing\'a became a Grand Council member.',
  ],
  s0102: [
    'On day gengshen, the Emperor held court at the Gate of Heavenly Purity.',
    'On gengshen day, the Emperor heard affairs at the Gate of Heavenly Purity.',
  ],
  s0103: [
    'Hereditary ranks were granted for Vice Commander Qi Qing\'a and others who died in Guangxi\'s midsummer battle.',
    'Qi Qing\'a and other Guangxi midsummer dead received hereditary ranks.',
  ],
  s0104: [
    'An edict severely rebuked Li Xingyuan and others for having no plan and falling into the rebels\' wiles.',
    'Li Xingyuan and others were sharply rebuked for no plan and falling for rebel tricks.',
  ],
  s0105: [
    'Zheng Zuchen was banished to Yili for fostering trouble like a festering sore.',
    'Zheng Zuchen was sent to Yili exile for nursing trouble into disaster.',
  ],
  s0106: [
    'On day bingyin, Zhou Tianjue reported that Hong Xiuquan and his followers were scattered, knew the mountain passes, and would strike when they could; even defeats would not greatly cripple them.',
    'On bingyin day, Zhou Tianjue said Hong Xiuquan\'s men were scattered but knew the hills and would raid when they could, so small defeats would not break them.',
  ],
  s0107: [
    'Forces were insufficient; defense only was ordered.',
    'Troops were too few; only defense was ordered.',
  ],
  s0108: [
    'Only with surplus troops could camp lines press in for joint suppression.',
    'Joint camp pressure required spare troops.',
  ],
  s0109: [
    'Edict received: "You must guard strictly and not let them flee.',
    'The edict said: guard strictly and do not let them escape.',
  ],
  s0110: [
    '" As Saishang\'a\'s army set out, an Ebilun saber was granted; Tianjin Brigade Commander Chang Rui and Liangzhou Brigade Commander Chang Shou were ordered to campaign.',
    'As Saishang\'a marched, he received an Ebilun saber and Chang Rui and Chang Shou were ordered to campaign.',
  ],
  s0111: [
    'On day gengwu, Zhili\'s unpaid grain and money levies of Daoguang 30 were remitted.',
    'On gengwu day, Zhili\'s Daoguang 30 arrears in grain and money were remitted.',
  ],
  s0112: [
    'Zhou Tianjue impeached Youjiang Brigade Commander Hui Qing and Youjiang Circuit Intendant Qing Ji for slack suppression; both were stripped of office.',
    'Zhou Tianjue impeached Hui Qing and Qing Ji for poor suppression and both lost office.',
  ],
  s0113: [
    'On day bingzi, Li Xingyuan reported the Shanglin market secret-society bandits destroyed.',
    'On bingzi day, Li Xingyuan reported the Shanglin market bandits wiped out.',
  ],
  s0114: [
    'On day guiwei, Li Xingyuan died.',
    'On guiwei day, Li Xingyuan died.',
  ],
  s0115: [
    'Wulantai reported that on the third day of the fourth month he reached the Wuxuan army camp.',
    'Wulantai reported reaching the Wuxuan camp on the third of the fourth month.',
  ],
  s0116: [
    'On inquiry, rebel strength was mostly loose rabble.',
    'Rebel forces were mostly loose mobs.',
  ],
  s0117: [
    'But the Wuxuan Dongxiang secret-society had over ten thousand men, cut their hair and changed dress, with bogus kings and officials—a core menace in Guangxi.',
    'But Wuxuan Dongxiang had ten thousand men with hair cut and rebel titles—a core Guangxi threat.',
  ],
  s0118: [
    'Edict received: "The rebels are cunning; you must act with caution.',
    'The edict said the rebels were cunning and required caution.',
  ],
  s0119: [
    '" (closing quotation mark in the source.)',
    'The edict ended."',
  ],
  s0120: [
    'Fifth month, day wuzi: Zhou Tianjue reported that Dongxiang fugitives from Wuxuan had fled into Xiangzhou.',
    'In month 5, wuzi, Zhou Tianjue said Wuxuan Dongxiang fugitives entered Xiangzhou.',
  ],
  s0121: [
    'An edict sharply rebuked them and each received a light censure.',
    'They were sharply rebuked and lightly censured.',
  ],
  s0122: [
    'Hunan Provincial Military Commander Yu Wanqing was ordered to join in blocking and suppressing them.',
    'Yu Wanqing was ordered to help block and suppress them.',
  ],
  s0123: [
    'On day gengyin, Zhuo Bingtian memorialized to implement the policy of strengthening walls and clearing the countryside; Saishang\'a and the governors-general and governors were informed.',
    'On gengyin day, Zhuo Bingtian urged strengthened walls and cleared countryside and Saishang\'a and provincial chiefs were told.',
  ],
  s0124: [
    'On day jiawu, Zhou Tianjue reported pacifying the Sicheng bandit band; Chen Ya and others surrendered and pursuit drove the rebels into Hepu.',
    'On jiawu day, Zhou Tianjue pacified Sicheng bandits; Chen Ya surrendered and pursuit drove rebels into Hepu.',
  ],
  s0125: [
    'On day dingyou, Wulantai reported that on the seventeenth day of the fourth month he hurried to Xiangzhou and blocked the fugitive rebels.',
    'On dingyou day, Wulantai said he reached Xiangzhou on the seventeenth of the fourth month and blocked fugitives.',
  ],
  s0126: [
    'On day jiachen, Shaanxi-Gansu Governor-General Qishan was stripped of office and arrested for arbitrary killing while suppressing tribes.',
    'On jiachen day, Qishan lost office and was arrested for reckless killing in tribal suppression.',
  ],
  s0127: [
    'On day yisi, Ji Zhichang was made Min-Zhe governor-general; Minister of Revenue Yucheng was made associate grand secretary.',
    'On yisi day, Ji Zhichang took Min-Zhe and Yucheng became associate grand secretary.',
  ],
  s0128: [
    'On day jiyou, an edict halted all domestic and foreign construction projects.',
    'On jiyou day, all domestic and foreign works were halted.',
  ],
  s0129: [
    'Vice Minister of Works Peng Yunzhang was appointed Grand Council member.',
    'Peng Yunzhang became a Grand Council member.',
  ],
  s0130: [
    'On day yimao, the Emperor prayed for rain at the Hall of Supreme Harmony.',
    'On yimao day, the Emperor prayed for rain at the Hall of Supreme Harmony.',
  ],
  s0131: [
    'Sixth month, day dingsi: Saishang\'a reported reaching Changsha.',
    'In month 6, dingsi, Saishang\'a reported reaching Changsha.',
  ],
  s0132: [
    'An edict said: "The rebels at Xiangzhou should be heavily encircled.',
    'The edict said Xiangzhou rebels needed heavy encirclement.',
  ],
  s0133: [
    'Rebels split toward Nanning and Taiping should be pursued with divided forces.',
    'Split bands toward Nanning and Taiping should be pursued separately.',
  ],
  s0134: [
    'You should still weigh terrain and talent and coordinate deployment.',
    'Terrain, talent, and coordinated deployment were still required.',
  ],
  s0135: [
    'Grain depots are especially critical and should be placed separately to aid transport.',
    'Grain depots were critical and should be split to aid supply.',
  ],
  s0136: [
    '" On day bingyin, Wulantai reported that on the tenth day of the fifth month rebels took the Guizhou army camp and it was recovered the same day.',
    'On bingyin day, Wulantai said rebels took the Guizhou camp on the tenth of the fifth month and it was retaken that day.',
  ],
  s0137: [
    'Rebels massed on South Mountain were also met and driven south.',
    'South Mountain rebels were also met and driven south.',
  ],
  s0138: [
    'Fifteen officers and over two hundred soldiers died in battle; a list requested condolence grants.',
    'Fifteen officers and over two hundred soldiers died; condolence was requested.',
  ],
  s0139: [
    'Guizhou Deputy Commander Tong Panmei and others who fled first were stripped of office.',
    'Tong Panmei and other first fugitives from Guizhou lost office.',
  ],
  s0140: [
    'On day xinwei, 150,000 taels of Jiang-Hai Customs revenue were allocated for Hubei transit troops.',
    'On xinwei day, 150,000 taels of customs silver were set aside for Hubei transit troops.',
  ],
  s0141: [
    'On day yihai, Saishang\'a reported that on the fourth day of the sixth month he hurried to Guilin to plan the whole campaign.',
    'On yihai day, Saishang\'a reached Guilin on the fourth of the sixth month to plan the campaign.',
  ],
  s0142: [
    'The Emperor praised his measures as all fitting the moment.',
    'The Emperor praised his measures as timely.',
  ],
  s0143: [
    'On day dingchou, Nanyang Nian bandits in Henan raided in four directions; local officials were ordered to capture them.',
    'On dingchou day, Nanyang Nian bandits raided widely in Henan and officials were ordered to seize them.',
  ],
  s0144: [
    'On day xinsi, Xining tribal bandits plundered; Sa Ying\'a was ordered to send generals to suppress them.',
    'On xinsi day, Xining tribes plundered and Sa Ying\'a was ordered to send troops.',
  ],
  s0145: [
    'Autumn, seventh month, day bingxu: Saishang\'a reported rebels had fled from Xiangzhou back to Dongxiang and troops were sent to block them.',
    'In month 7, bingxu, Saishang\'a said rebels fled from Xiangzhou to Dongxiang and blocking troops were sent.',
  ],
  s0146: [
    'On day gengyin, Censor Jiao Youying memorialized that officialdom was slack and name and fact should be jointly verified.',
    'On gengyin day, Jiao Youying said officials were slack and merit should match reality.',
  ],
  s0147: [
    'Edict received: "If prefects and magistrates were well chosen, how could villains gather secretly and breed a great disaster?',
    'The edict asked how villains could gather if local officials were sound.',
  ],
  s0148: [
    'Hereafter when such cases occur, only the governors-general and governors will be held accountable.',
    'Later such cases would hold only governors-general and governors accountable.',
  ],
  s0149: [
    '" On day gengzi, Saishang\'a reported advancing against the Xin\'xu bandits with seven victories in succession.',
    'On gengzi day, Saishang\'a advanced on Xin\'xu bandits with seven straight victories.',
  ],
  s0150: [
    'Wulantai and Qin Dingsan had their peacock feathers restored.',
    'Wulantai and Qin Dingsan regained their peacock feathers.',
  ],
  s0151: [
    'Huguang and Sichuan governors-general and governors were ordered to investigate secret-society and sect rebels strictly.',
    'Huguang and Sichuan chiefs were ordered to investigate secret societies and sect rebels.',
  ],
  s0152: [
    'On day dingwei, the annual Yellow River conservancy works were ordered to take three million taels as the standard.',
    'On dingwei day, annual Yellow River works were set at three million taels.',
  ],
  s0153: [
    'On day jiyou, Saishang\'a reported: "Merit and fault among commanders were investigated. Wulantai won first and lost later because in hot pursuit he fell into an ambush; the rebels dammed the stream and lay in wait, and over a hundred rear troops drowned in the rapids.',
    'On jiyou day, Saishang\'a reported Wulantai\'s later defeat came from pursuit into a stream ambush where over a hundred rear troops drowned.',
  ],
  s0154: [
    'When Xiang Rong first reached Guangxi he won successive victories and each victory brought one tael reward silver per soldier.',
    'Xiang Rong\'s early Guangxi victories brought one tael per soldier.',
  ],
  s0155: [
    'After Li Xingyuan arrived it was cut to three mace.',
    'After Li Xingyuan came, rewards fell to three mace.',
  ],
  s0156: [
    'The troops clamored and swore not to fight.',
    'The troops clamored and refused battle.',
  ],
  s0157: [
    'The unruly have now been weeded out separately; you must still act with caution.',
    'The worst were now removed; caution was still required.',
  ],
  s0158: [
    '" Anhui Governor Jiang Wenqing reported that Shouzhou bandit Cheng Liuma and Hefei Nian bandit Gao Siba had risen in rebellion.',
    'Jiang Wenqing reported Shouzhou\'s Cheng Liuma and Hefei Nian Gao Siba in rebellion.',
  ],
  s0159: [
    'On day gengxu, Bao Qibao was transferred to Hunan provincial military commander; Rong Yucai to Yunnan provincial military commander; Chonglun to Guizhou provincial military commander.',
    'On gengxu day, Bao Qibao took Hunan, Rong Yucai Yunnan, and Chonglun Guizhou.',
  ],
  s0160: [
    'Eighth month, day yimao: Saishang\'a reported advancing on the Xin\'xu rebel nest and seizing Zhu\'xie Gorge and Shuangji Mountain.',
    'In month 8, yimao, Saishang\'a took the Xin\'xu nest and Zhu\'xie Gorge and Shuangji Mountain.',
  ],
  s0161: [
    'Edict received with praise.',
    'The court praised the report.',
  ],
  s0162: [
    'On day yichou, Shandong Governor Chen Qingxie reported that Dengzhou naval ships were captured by bandits and the deputy commander fell into the water.',
    'On yichou day, Chen Qingxie said Dengzhou naval ships were taken and the deputy commander fell overboard.',
  ],
  s0163: [
    'Edict received: "Hurry to pursue and suppress.',
    'The edict ordered swift pursuit.',
  ],
  s0164: [
    '" Yixing and Ne\'erjing\'e were also ordered to guard the sea mouths strictly.',
    'Yixing and Ne\'erjing\'e were also ordered to guard the sea mouths.',
  ],
  s0165: [
    'Minister of Rites Huifeng died.',
    'Minister of Rites Huifeng died.',
  ],
  s0166: [
    'Intercalary eighth month, day jiashen, first day: rebel chief Hong Xiuquan took Yong\'an prefecture, held it, and styled his state the Taiping Heavenly Kingdom.',
    'On intercalary month 8, jiashen, Hong Xiuquan took Yong\'an and proclaimed the Taiping Heavenly Kingdom.',
  ],
  s0167: [
    'Lu Jianying memorialized to ban Catholicism.',
    'Lu Jianying asked to ban Catholicism.',
  ],
  s0168: [
    'Edict received: "In dealing with foreigners, caution is needed from the start.',
    'The edict said foreign dealings required caution from the start.',
  ],
  s0169: [
    'What the original treaties provide should still be followed under the old regulations.',
    'Original treaty terms should still follow old regulations.',
  ],
  s0170: [
    '" On day wuzi, Cheng Yucai reported Yangshan bandits had raided Yizhang and Ruyuan; Brigade Commander Sun Yingzhao was ordered to suppress them.',
    'On wuzi day, Cheng Yucai said Yangshan bandits hit Yizhang and Ruyuan and Sun Yingzhao was sent against them.',
  ],
  s0171: [
    'Guangxi martyr Subprefect Feng Yuanji received a hereditary rank, a shrine, and his son Shupu was granted attached sacrifice.',
    'Martyr Feng Yuanji of Guangxi received hereditary rank, a shrine, and son Shupu attached sacrifice.',
  ],
  s0172: [
    'On day jiawu, the Yellow River burst at Fengbei Third Bastion on the South River.',
    'On jiawu day, the Yellow River broke at Fengbei Third Bastion.',
  ],
  s0173: [
    'On day gengzi, regulations were fixed for examining Grand Council clerks.',
    'On gengzi day, Grand Council clerk examinations were regulated.',
  ],
  s0174: [
    'On day renyin, Saishang\'a reported Xin\'xu rebels had crossed the mountains and taken Yong\'an prefecture.',
    'On renyin day, Saishang\'a said Xin\'xu rebels broke out and took Yong\'an.',
  ],
  s0175: [
    'An edict sharply rebuked him and referred the case to the ministries for disposition.',
    'He was sharply rebuked and referred to the ministries.',
  ],
  s0176: [
    'On day jiyou, Hebei Brigade Commander Dong Guangjia and Yunyang Brigade Commander Shao Heling were ordered to hurry to Guangxi to suppress rebels.',
    'On jiyou day, Dong Guangjia and Shao Heling were rushed to Guangxi.',
  ],
  s0177: [
    'On day gengxu, Chang Dachun reported pirate ships plundered at Shipu and Prefect Luo Yong drove them off.',
    'On gengxu day, Chang Dachun said pirates raided Shipu and Luo Yong drove them off.',
  ],
  s0178: [
    'On day xinhai, Shuxing\'a was made Shaanxi-Gansu governor-general.',
    'On xinhai day, Shuxing\'a became Shaanxi-Gansu governor-general.',
  ],
  s0179: [
    'Ninth month, day gengwu: Saishang\'a reported Ba Qingde and Xiang Rong pleaded illness to shirk duty and delayed advancing.',
    'In month 9, gengwu, Saishang\'a said Ba Qingde and Xiang Rong feigned illness and delayed advance.',
  ],
  s0180: [
    'Edict received: both were stripped of office to redeem themselves by service.',
    'Both lost office and had to redeem themselves in the field.',
  ],
  s0181: [
    'On day bingzi, an edict ordered discussion of joint river and sea grain transport regulations.',
    'On bingzi day, joint river-sea grain transport rules were ordered discussed.',
  ],
  s0182: [
    'Winter, tenth month, day wuxu: dedicated shrines were ordered built for fallen Dinghai Brigade Commander Ge Yunfei and Zheng Guohong.',
    'In month 10, wuxu, shrines were ordered for Ge Yunfei and Zheng Guohong of Dinghai.',
  ],
  s0183: [
    'Eleventh month, day jimao: Ye Mingchen reported Yingde bandits fully suppressed.',
    'In month 11, jimao, Ye Mingchen reported Yingde bandits cleared.',
  ],
  s0184: [
    'He was advanced to Junior Guardian of the Heir Apparent.',
    'He became Junior Guardian of the Heir Apparent.',
  ],
  s0185: [
    'Twelfth month, day dingyou: Saishang\'a reported Xiang Rong had advanced and encamped at Longyantang.',
    'In month 12, dingyou, Saishang\'a said Xiang Rong encamped at Longyantang.',
  ],
  s0186: [
    'On day jiyou, Lu Jianying reported pirate Bu Xingyou had surrendered arms and was assigned to a camp.',
    'On jiyou day, Lu Jianying said Bu Xingyou surrendered arms and was placed in camp.',
  ],
  s0187: [
    'On day gengxu, the joint winter sacrifice was performed at the Imperial Ancestral Temple.',
    'On gengxu day, the winter temple sacrifice was held.',
  ],
  s0188: [
    'That year, grain and money levies owed before Daoguang 30 were broadly remitted.',
    'That year, arrears before Daoguang 30 were broadly remitted.',
  ],
  s0189: [
    'Banner rent arrears in sixty-one Zhili prefectures and counties and supplementary grain and silver in fifty-one Zhejiang prefectures and counties were also remitted.',
    'Zhili banner rent and Zhejiang supplementary levies were also remitted.',
  ],
  s0190: [
    'Disaster levies were also remitted in fifteen Fengtian districts, four Jilin cities, one Heilongjiang city, and seven Hunan districts.',
    'Disaster levies were remitted in Fengtian, Jilin, Heilongjiang, and Hunan districts.',
  ],
  s0191: [
    'Salt-field arrears in Zhejiang and Fujian were also remitted.',
    'Zhejiang and Fujian salt-field arrears were also remitted.',
  ],
  s0192: [
    'Quota levies in eighty-six Guangxi prefectures and counties ravaged by rebels were also remitted.',
    'Quota levies in eighty-six rebel-hit Guangxi districts were also remitted.',
  ],
  s0193: [
    'Korea and Ryukyu paid tribute.',
    'Korea and Ryukyu sent tribute.',
  ],
  s0194: [
    'In the second year, day renzi, spring, first month, day renzi, first day: Prince Yikuang was enfeoffed as a beile and sacrifices were offered to Prince Qing Yonglin.',
    'In year 2, month 1, renzi, Yikuang was made beile and Yonglin received sacrifice.',
  ],
  s0195: [
    'On day yimao, Yucheng was made grand secretary; Ne\'erjing\'e associate grand secretary; Xi\'en Minister of Revenue.',
    'On yimao day, Yucheng became grand secretary, Ne\'erjing\'e associate, and Xi\'en took Revenue.',
  ],
  s0196: [
    'On day renxu, Saishang\'a reported encamping three li from Yong\'an city to direct operations.',
    'On renxu day, Saishang\'a camped three li from Yong\'an to direct battle.',
  ],
  s0197: [
    'On day xinwei, Vice Ministers Quanqing and Vice Banner Commander Longqing were ordered to invest Korea\'s queen.',
    'On xinwei day, Quanqing and Longqing were sent to invest Korea\'s queen.',
  ],
  s0198: [
    'Second month, day dinghai: Chen Qingxie left office on illness; Li Huan was made Shandong governor.',
    'In month 2, dinghai, Chen Qingxie retired ill and Li Huan took Shandong.',
  ],
  s0199: [
    'On day xinchou, the Emperor proceeded to the Western Tombs.',
    'On xinchou day, the Emperor went to the Western Tombs.',
  ],
  s0200: [
    'Third month, day renzi: the late Emperor Xuanzong was buried at Muling.',
    'In month 3, renzi, Emperor Xuanzong was buried at Muling.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_020_b02.mjs <translation.json>'
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
