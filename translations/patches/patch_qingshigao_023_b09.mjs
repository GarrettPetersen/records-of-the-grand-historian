#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0801: [
    'On day gengshen, Mo Mengbi, bandit chief of Si\'en, was executed.',
    'On gengshen day, Si\'en bandit leader Mo Mengbi was executed.',
  ],
  s0802: [
    'On day bingyin, French warships attacked the Fujian coast.',
    'On bingyin day, French ships raided the Fujian coast.',
  ],
  s0803: [
    'On day dingmao, an edict said: "The French envoy delays treaty talks; Courbet\'s demands are unreasonable; our army must hold formation and wait."',
    'On dingmao day, the court ordered strict formation against unreasonable French demands.',
  ],
  s0804: [
    'If they attack us, strike together with full force.',
    'If they attack, hit them with combined force.',
  ],
  s0805: [
    'Whoever dares shrink back shall at once be punished by military law.',
    'Anyone who retreats shall face immediate military justice.',
  ],
  s0806: [
    'On day gengwu, Zeng Guoquan was made plenipotentiary to negotiate a treaty with the French envoy at Shanghai; Chen Baochen was ordered to assist.',
    'On gengwu day, Zeng Guoquan was made plenipotentiary at Shanghai; Chen Baochen was to assist.',
  ],
  s0807: [
    'Sixth month, new moon day guiyou: because the verdict in the Yuxi Yu Qiongfang case was found false, Governor-General Bian Baodi and Governor Peng Zuxian were referred to the ministries for deliberation, and the trial officials were demoted in varying degrees.',
    'In month 6, new moon guiyou, the Yuxi Yu Qiongfang verdict was overturned; Bian Baodi, Peng Zuxian, and trial officials were punished.',
  ],
  s0808: [
    'On day jiaxu, the Yellow River burst its banks at Licheng and other counties.',
    'On jiaxu day, the Yellow River broke at Licheng and other counties.',
  ],
  s0809: [
    'For begging aid to hold the city, Lady Lin, wife of Shen Baozhen, was posthumously granted collateral sacrifice at his Guangxin memorial shrine.',
    'Lady Lin, Shen Baozhen\'s wife, was given collateral sacrifice at his Guangxin shrine for aiding the defense.',
  ],
  s0810: [
    'On day bingzi, Yang Changqing, bandit chief of Jianchang and Duolun, was executed.',
    'On bingzi day, Jianchang and Duolun bandit chief Yang Changqing was executed.',
  ],
  s0811: [
    'On day dingchou, Wu Changqing died; his son Baochu, a secretary, was commended for filial conduct.',
    'On dingchou day, Wu Changqing died; his son Baochu was rewarded for filial piety.',
  ],
  s0812: [
    'On day jimao, an edict ordered the provinces to inspect prefectural and county officials.',
    'On jimao day, provinces were told to inspect prefects and magistrates.',
  ],
  s0813: [
    'On day renchen, the French took Keelung.',
    'On renchen day, the French captured Keelung.',
  ],
  s0814: [
    'An edict summoned court ministers to debate war and peace.',
    'The court was ordered to debate war and peace.',
  ],
  s0815: [
    'On day yiwei, Liu Mingchuan recovered Keelung.',
    'On yiwei day, Liu Mingchuan retook Keelung.',
  ],
  s0816: [
    'On day jihai, an empress dowager decree: the Shenji Camp chose three thousand horse and foot soldiers, and the patrol battalions chose two thousand drilled troops; Commandant Shan Qing was made commander-in-chief and Vanguard Commander Tuolunbu deputy; they were posted to defend eastern Zhili, and Zhili drilled troops were also drawn off to help guard.',
    'On jihai day, 5,000 Shenji and patrol troops under Shan Qing and Tuolunbu were posted to eastern Zhili with Zhili reinforcements.',
  ],
  s0817: [
    'Zeng Guoquan and Chen Baochen were ordered back to Jiangning to arrange coastal defense.',
    'Zeng Guoquan and Chen Baochen were sent back to defend Jiangning.',
  ],
  s0818: [
    'That month, wind disasters at Shunde and Qingpu and flooding at Ye County were relieved.',
    'That month, relief was given for wind at Shunde and Qingpu and flood at Ye.',
  ],
  s0819: [
    'Seventh month, autumn, day yisi: Wu Yuanbing was ordered to survey Shandong river works and coastal defense.',
    'In month 7, yisi, Wu Yuanbing was sent to inspect Shandong rivers and coast.',
  ],
  s0820: [
    'Zhang Zhidong was appointed governor-general of Liang-Guang.',
    'Zhang Zhidong was made Liang-Guang governor-general.',
  ],
  s0821: [
    'On day bingwu, the French raided Mawei batteries and the arsenal; the land force drove them off.',
    'On bingwu day, French raiders hit Mawei; land troops repulsed them.',
  ],
  s0822: [
    'On day wushen, Prince Chun memorialized that Yanshu had impeached Zuo Zongtang, denouncing him as disrespectful, disloyal, reckless, and willfully perverse.',
    'On wushen day, Prince Chun reported Yanshu\'s attack on Zuo Zongtang as slanderous and disloyal.',
  ],
  s0823: [
    'An empress dowager decree punished Yanshu by stripping office but keeping him on duty and fining one year\'s salary.',
    'Yanshu lost office but stayed on duty and was fined a year\'s pay.',
  ],
  s0824: [
    'An edict declared war on France; Yang Changqing went to Fujian to command the army.',
    'War was declared on France; Yang Changqing went to Fujian to command.',
  ],
  s0825: [
    'On day guichou, the French destroyed Changmen batteries.',
    'On guichou day, the French wrecked Changmen batteries.',
  ],
  s0826: [
    'On day dingsi, an edict told Mutushan and Zhang Peilun not to withdraw to the provincial capital.',
    'On dingsi day, Mutushan and Zhang Peilun were told not to fall back to Fuzhou.',
  ],
  s0827: [
    'An edict made Zuo Zongtang imperial commissioner to supervise Fujian military affairs, with Fuzhou General Mutushan and Grain Transport Governor Yang Changqing as deputies; Zhang Peilun was made co-minister and acting superintendent of the shipyard.',
    'Zuo Zongtang was made imperial commissioner for Fujian; Mutushan and Yang Changqing assisted; Zhang Peilun co-managed the shipyard.',
  ],
  s0828: [
    'Zeng Guoquan was appointed governor-general of Liang-Jiang and concurrently Southern Ocean minister.',
    'Zeng Guoquan became Liang-Jiang governor-general and Southern Ocean minister.',
  ],
  s0829: [
    'On day bingyin, guilt for the loss of Bac Ninh was assessed; dismissed circuit intendant Zhao Wo and Grand Commander Chen Chaogang were both sentenced to death.',
    'On bingyin day, Zhao Wo and Chen Chaogang were sentenced to death for losing Bac Ninh.',
  ],
  s0830: [
    'On day wuchen, Yang Changqing was made governor-general of Fujian-Zhejiang.',
    'On wuchen day, Yang Changqing became Fujian-Zhejiang governor-general.',
  ],
  s0831: [
    'Disaster victims at Licheng and other counties were broadly relieved.',
    'Broad relief was given to victims at Licheng and other counties.',
  ],
  s0832: [
    'That month, flooding at Fuliang and at Qihe, Chang\'an, and other places was relieved.',
    'That month, flood relief was given at Fuliang, Qihe, Chang\'an, and elsewhere.',
  ],
  s0833: [
    'Eighth month, day renshen: Deng Chengxu, vice minister of the Court of State Ceremonial, was ordered to serve at the Zongli Yamen.',
    'In month 8, renshen, Deng Chengxu was posted to the Zongli Yamen.',
  ],
  s0834: [
    'Merit and fault in the Mawei battle were assessed: He Jing was stripped of office and Zhang Peilun of his noble rank; both were referred to the ministries; Grand Commander Huang Chaoqun and others were rewarded and promoted in varying degrees.',
    'After Mawei, He Jing and Zhang Peilun were punished; Huang Chaoqun and others were rewarded.',
  ],
  s0835: [
    'Bandit chiefs Zhang Tingyuan and others of Jian and Shao were executed.',
    'Jian and Shao bandit leaders including Zhang Tingyuan were executed.',
  ],
  s0836: [
    'On day jiaxu, the Yellow River burst at Dongming.',
    'On jiaxu day, the Yellow River broke at Dongming.',
  ],
  s0837: [
    'Flood victims in Nanhai and other counties were relieved.',
    'Nanhai and other counties received flood relief.',
  ],
  s0838: [
    'On day bingzi, Li Hongzhang was appointed governor-general of Zhili and Northern Ocean minister.',
    'On bingzi day, Li Hongzhang became Zhili governor-general and Northern Ocean minister.',
  ],
  s0839: [
    'On day wuyin, an empress dowager decree ennobled Prince Chun\'s son Zai Feng as Junior Guardian Prince of the State without the eight privileges.',
    'On wuyin day, Prince Chun\'s son Zai Feng was made junior guardian prince.',
  ],
  s0840: [
    'Wen Yu was dismissed for illness.',
    'Wen Yu retired on grounds of illness.',
  ],
  s0841: [
    'Chonghou, Chongli, Wen Xi, and Wen Qian were ordered to contribute funds for military pay.',
    'Chonghou, Chongli, Wen Xi, and Wen Qian were told to donate to the war chest.',
  ],
  s0842: [
    'On day gengchen, Taiwan wind disaster victims were relieved.',
    'On gengchen day, Taiwan wind victims were relieved.',
  ],
  s0843: [
    'On day dinghai, the French again took Keelung.',
    'On dinghai day, the French recaptured Keelung.',
  ],
  s0844: [
    'On day wuzi, Circuit Intendant Xu Chengzu was made minister to Japan.',
    'On wuzi day, Xu Chengzu was appointed envoy to Japan.',
  ],
  s0845: [
    'On day jichou, an edict suspended this year\'s grave criminal cases and the autumn and court capital review offenders from further investigation.',
    'On jichou day, grave cases and capital review prisoners were spared further review.',
  ],
  s0846: [
    'On day guisi, Su Yuanchun fought the French on land and defeated them.',
    'On guisi day, Su Yuanchun beat the French in a land battle.',
  ],
  s0847: [
    'Yang Yuebin was ordered to assist Zuo Zongtang in military affairs.',
    'Yang Yuebin was assigned to help Zuo Zongtang.',
  ],
  s0848: [
    'Xingzi flood victims were relieved.',
    'Xingzi flood victims received relief.',
  ],
  s0849: [
    'On day wuxu, the French attacked Tamsui; Grand Commander Sun Kaihua defeated them.',
    'On wuxu day, Sun Kaihua repulsed the French at Tamsui.',
  ],
  s0850: [
    'Ninth month, day guimao: Tang Jiong was arrested and tried at court.',
    'In month 9, guimao, Tang Jiong was arrested for court trial.',
  ],
  s0851: [
    'On day yisi, fifty thousand taels from the treasury were granted to Liu Yongfu\'s army.',
    'On yisi day, 50,000 taels were sent to Liu Yongfu\'s army.',
  ],
  s0852: [
    'On day xinhai, a stern edict ordered all Northern and Southern Ocean steamships to aid Taiwan.',
    'On xinhai day, all ocean steamers were ordered to aid Taiwan.',
  ],
  s0853: [
    'On day renzi, Liu Mingchuan was made Fujian governor, stationed in Taiwan to command defense; Su Yuanchun assisted Pan Dingxin; Yang Changqing and others divided defense of Penghu; Zhang Zhaodong and He Ruzhang were both stripped of office.',
    'On renzi day, Liu Mingchuan governed Fujian from Taiwan; Su Yuanchun assisted Pan Dingxin; Zhang Zhaodong and He Ruzhang were dismissed.',
  ],
  s0854: [
    'An edict remitted Yunnan land tax: three years for temporary waste, ten years for permanent waste.',
    'Yunnan land tax was remitted three years for temporary fallow and ten for permanent.',
  ],
  s0855: [
    'On day jiayin, Liu Mingchuan asked to be punished; the edict pardoned him.',
    'On jiayin day, Liu Mingchuan asked punishment and was pardoned.',
  ],
  s0856: [
    'On day wuwu, one hundred thousand piculs of new grain transport were held for Shandong winter relief.',
    'On wuwu day, 100,000 piculs of new grain were kept for Shandong winter relief.',
  ],
  s0857: [
    'On day gengshen, for victory at Tamsui, Major General Sun Kaihua was granted a hereditary rank and ten thousand taels were issued to reward the army.',
    'On gengshen day, Sun Kaihua received a hereditary rank and 10,000 taels for Tamsui.',
  ],
  s0858: [
    'E-lehehebu was appointed Grand Secretary of the Baohe Hall.',
    'E-lehehebu was made Baohe Hall grand secretary.',
  ],
  s0859: [
    'On day yichou, Minister of Justice En Cheng was made acting grand secretary.',
    'On yichou day, En Cheng became acting grand secretary.',
  ],
  s0860: [
    'On day bingyin, Fengcheng flood victims were relieved.',
    'On bingyin day, Fengcheng flood victims were relieved.',
  ],
  s0861: [
    'On day gengwu, government troops again fought the French on land and defeated them; Su Yuanchun was granted a hereditary rank.',
    'On gengwu day, land forces beat the French again; Su Yuanchun received a hereditary rank.',
  ],
  s0862: [
    'On day xinwei, Xinjiang was reorganized as a province, with one governor and one provincial treasurer; the northern and southern route commanders, commissioners, and brigade leaders were abolished.',
    'On xinwei day, Xinjiang became a province and frontier command posts were cut.',
  ],
  s0863: [
    'Tenth month, winter, new moon day renshen: an empress dowager decree promoted Prince Qing Yi Kuang to Prince of Qing and Prince Fu Yi Mo to imperial clan prince.',
    'In month 10, new moon renshen, Yi Kuang became Prince of Qing and Yi Mo an imperial clan prince.',
  ],
  s0864: [
    'On day guiyou, Liu Jintang was made governor of Gansu and Xinjiang.',
    'On guiyou day, Liu Jintang became Gansu-Xinjiang governor.',
  ],
  s0865: [
    'On day wuyin, Jiangbei circuit and other flood and hail victims were relieved.',
    'On wuyin day, Jiangbei and other flood and hail victims were relieved.',
  ],
  s0866: [
    'On day xinsi, for the empress dowager\'s fiftieth birthday, the emperor led princes, civil and military officials, and others to Cining Palace to offer congratulations.',
    'On xinsi day, the court celebrated the empress dowager\'s fiftieth birthday at Cining.',
  ],
  s0867: [
    'On day xinmao, Bao Chao repeatedly missed campaign deadlines and was sharply rebuked.',
    'On xinmao day, Bao Chao was rebuked for missing deadlines.',
  ],
  s0868: [
    'On day guisi, for feigning illness to evade duty, Grand Commander Wang Hongshun was stripped of office.',
    'On guisi day, Wang Hongshun lost his post for sham illness.',
  ],
  s0869: [
    'On day jiawu, Zhang Shusheng died.',
    'On jiawu day, Zhang Shusheng died.',
  ],
  s0870: [
    'On day yiwei, Korea was in turmoil again; Wu Dacheng was sent to investigate, with Xu Chang as deputy.',
    'On yiwei day, Wu Dacheng went to Korea with Xu Chang as deputy.',
  ],
  s0871: [
    'Wen Yu died.',
    'Wen Yu died.',
  ],
  s0872: [
    'On day gengzi, Liu Yongfu fought the French at Thanh Hoa and was defeated.',
    'On gengzi day, Liu Yongfu lost to the French at Thanh Hoa.',
  ],
  s0873: [
    'Eleventh month, day dingwei: Grand Commander Sun Kaihua was ordered to assist in Taiwan military affairs.',
    'In month 11, dingwei, Sun Kaihua was assigned to Taiwan defense.',
  ],
  s0874: [
    'On day wushen, Xu Yanxu was arrested and tried at court.',
    'On wushen day, Xu Yanxu was arrested for court trial.',
  ],
  s0875: [
    'On day renzi, Li Hongzhang mobilized troops and sent them to Korea.',
    'On renzi day, Li Hongzhang sent troops to Korea.',
  ],
  s0876: [
    'On day guichou, Pu\'er was shaken by an earthquake.',
    'On guichou day, Pu\'er suffered an earthquake.',
  ],
  s0877: [
    'On day bingchen, fabrication of disaster reports by prefects and counties was forbidden.',
    'On bingchen day, magistrates were forbidden to falsify disaster reports.',
  ],
  s0878: [
    'On day dingsi, the Dongming breach was closed.',
    'On dingsi day, the Dongming breach was sealed.',
  ],
  s0879: [
    'On day wuwu, Li Bingheng went to Longzhou to deploy defensive troops.',
    'On wuwu day, Li Bingheng deployed troops at Longzhou.',
  ],
  s0880: [
    'On day jiwei, snow was prayed for.',
    'On jiwei day, the court prayed for snow.',
  ],
  s0881: [
    'Yunnan Ba barbarians submitted.',
    'Yunnan Ba tribes submitted.',
  ],
  s0882: [
    'On day wuchen, an edict urged the provinces to store grain.',
    'On wuchen day, provinces were urged to build grain reserves.',
  ],
  s0883: [
    'Twelfth month, day wuyin: government troops defeated the French at Zhizuoshe.',
    'In month 12, wuyin, troops beat the French at Zhizuoshe.',
  ],
  s0884: [
    'On day renwu, Tang Jiong and Xu Yanxu were both sentenced to death.',
    'On renwu day, Tang Jiong and Xu Yanxu were sentenced to death.',
  ],
  s0885: [
    'On day yiyou, government troops recovered the three provinces of Thanh Hoa, Hung Hoa, and Son Tay, Anping Prefecture, and two departments and five districts.',
    'On yiyou day, Thanh Hoa, Hung Hoa, Son Tay, and Anping were recovered.',
  ],
  s0886: [
    'On day renchen, Luquan pacified Yi bandits.',
    'On renchen day, Luquan Yi bandits were pacified.',
  ],
  s0887: [
    'On day bingshen, rain and snow fell.',
    'On bingshen day, rain and snow fell.',
  ],
  s0888: [
    'Zhang Peilun and He Ruzhang were both stripped of office and banished.',
    'Zhang Peilun and He Ruzhang were dismissed and exiled.',
  ],
  s0889: [
    'That year, arrears on waste land in Zhenxi Circuit were remitted, and quota tax on flooded land in four districts of Wen\'an was waived.',
    'That year, Zhenxi waste-land arrears and Wen\'an flood taxes were remitted.',
  ],
  s0890: [
    'Korea sent tribute.',
    'Korea paid tribute.',
  ],
  s0891: [
    'The Vietnamese king Nguyen Ung Dang killed himself; the French installed his younger brother as king.',
    'Vietnamese king Nguyen Ung Dang committed suicide; the French set up his brother.',
  ],
  s0892: [
    'Eleventh year, yiyou, spring, first month, day guimao: Feng Zicai was ordered to assist in Guangxi frontier military affairs.',
    'In year 11, spring month 1, guimao, Feng Zicai was assigned to Guangxi frontier command.',
  ],
  s0893: [
    'On day yisi, the French took Lang Son.',
    'On yisi day, the French captured Lang Son.',
  ],
  s0894: [
    'On day bingwu, government troops besieged Thanh Hoa and recovered Meiliang city.',
    'On bingwu day, troops besieged Thanh Hoa and retook Meiliang.',
  ],
  s0895: [
    'On day jiayin, the French attacked Zhennan Pass; Major General Yang Yuke died in battle.',
    'On jiayin day, the French hit Zhennan Pass; Yang Yuke was killed.',
  ],
  s0896: [
    'On day yimao, condolence money was granted to the British general Gordon.',
    'On yimao day, Gordon was granted condolence funds.',
  ],
  s0897: [
    'On day jiazi, French warships left Taiwan.',
    'On jiazi day, French ships left Taiwan.',
  ],
  s0898: [
    'Zuo Zongtang and others led troops to reinforce Zhejiang.',
    'Zuo Zongtang and others marched to aid Zhejiang.',
  ],
  s0899: [
    'On day yichou, Li Hongzhang was made plenipotentiary to discuss Korean affairs with Wu Dacheng and the Japanese envoy.',
    'On yichou day, Li Hongzhang and Wu Dacheng were to treat with Japan on Korea.',
  ],
  s0900: [
    'On day gengwu, Korean disorder was settled; an envoy came with thanks and was rewarded.',
    'On gengwu day, Korea\'s turmoil ended; its envoy was rewarded.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_023_b09.mjs <translation.json>'
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
