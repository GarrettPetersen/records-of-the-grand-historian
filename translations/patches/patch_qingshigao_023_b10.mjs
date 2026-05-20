#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0901: [
    'Second month, day jiaxu: Zhejiang provincial commander Ouyang Lijian defeated the French at Zhenhai Kou.',
    'In month 2, jiaxu, Zhejiang commander Ouyang Lijian beat the French at Zhenhai Kou.',
  ],
  s0902: [
    'On day wuyin, Pan Dingxin was stripped of office; Li Bingheng was made acting Guangxi governor and Su Yuanchun was put in charge of Guangxi military affairs.',
    'On wuyin day, Pan Dingxin was dismissed; Li Bingheng acted as Guangxi governor and Su Yuanchun took Guangxi command.',
  ],
  s0903: [
    'On day xinsi, Qinzhou had an earthquake.',
    'On xinsi day, Qinzhou was shaken by an earthquake.',
  ],
  s0904: [
    'On day guiwei, Feng Zicai and Wang Xiaoqi routed the French outside Zhennanguan and then recovered Lang Son.',
    'On guiwei day, Feng Zicai and Wang Xiaoqi routed the French at Zhennanguan and retook Lang Son.',
  ],
  s0905: [
    'Hereditary offices were granted to Yang Yukou and others.',
    'Yang Yukou and others received hereditary ranks.',
  ],
  s0906: [
    'On day xinmao, the French requested peace.',
    'On xinmao day, France sought peace.',
  ],
  s0907: [
    'It was granted.',
    'The request was granted.',
  ],
  s0908: [
    'On day renchen, an edict ordered a ceasefire and troop withdrawal.',
    'On renchen day, fighting was halted and troops were withdrawn.',
  ],
  s0909: [
    'Burma bandits were pacified.',
    'Burma bandits were suppressed.',
  ],
  s0910: [
    'On day wuxu, Cen Yuying reported a great government victory at Lintao.',
    'On wuxu day, Cen Yuying reported a major victory at Lintao.',
  ],
  s0911: [
    'Third month, day yisi: Li Hongzhang was appointed plenipotentiary minister to negotiate a treaty with the French envoy; Punishments Minister Xi Zhen and Honglu Secretary Deng Chengxiu went to Tianjin to consult.',
    'In month 3, yisi, Li Hongzhang negotiated with France; Xi Zhen and Deng Chengxiu went to Tianjin.',
  ],
  s0912: [
    'On day bingwu, the Korean treaty was concluded.',
    'On bingwu day, the Korean treaty was signed.',
  ],
  s0913: [
    'On day gengxu, Cen Yuying recovered Mianwang and the stockades of Qingshui and Qingshan; Vietnamese rebel minister Huang Xie and others were captured and executed.',
    'On gengxu day, Cen Yuying retook Mianwang and nearby stockades and executed Huang Xie and other Vietnamese rebels.',
  ],
  s0914: [
    'On day guichou, Wu Dacheng and Yiketanga were ordered jointly to survey the eastern boundary of Jilin.',
    'On guichou day, Wu Dacheng and Yiketanga were told to survey Jilin\'s eastern border.',
  ],
  s0915: [
    'On day bingchen, years of unpaid rents and taxes owed by the people of ten prefectures and departments including Yongping, Zhangjiakou, and Shuntian were remitted.',
    'On bingchen day, long-standing tax arrears in ten prefectures including Yongping and Shuntian were forgiven.',
  ],
  s0916: [
    'On day guihai, Feng Zicai was ordered to supervise defenses at Qinzhou and Lianzhou.',
    'On guihai day, Feng Zicai took charge of Qin-Lian defenses.',
  ],
  s0917: [
    'On day yichou, arrears of grain tax from prior years at Xianning and other places in Shaanxi were remitted.',
    'On yichou day, Shaanxi grain-tax arrears at Xianning and elsewhere were forgiven.',
  ],
  s0918: [
    'Summer, fourth month, day jimao: prayers for rain were offered.',
    'In summer month 4, jimao, rain prayers were held.',
  ],
  s0919: [
    'On day bingxu, Cen Yuying was urgently ordered to withdraw his army and not break the truce by provoking conflict.',
    'On bingxu day, Cen Yuying was pressed to withdraw and not reopen the war.',
  ],
  s0920: [
    'On day xinmao, an edict ordered the removal of longstanding abuses in Jiangxi labor and grain-transport levies.',
    'On xinmao day, Jiangxi transport-levy abuses were ordered abolished.',
  ],
  s0921: [
    'On day renchen, Liu Yongfu was urgently ordered to withdraw his Baosheng army.',
    'On renchen day, Liu Yongfu was told to pull back the Baosheng army.',
  ],
  s0922: [
    'The new Sino-French treaty was concluded at Tianjin.',
    'The new Sino-French treaty was signed at Tianjin.',
  ],
  s0923: [
    'Fifth month, day dingwei: an empress dowager edict ordered survey and repair of north and south sea works.',
    'In month 5, dingwei, the empress dowager ordered the north and south sea projects surveyed and repaired.',
  ],
  s0924: [
    'An edict ordered the navy reorganized and the fleet greatly strengthened; north and south ocean ministers and others were to deliberate.',
    'The navy was ordered reorganized and north–south ministers told to plan it.',
  ],
  s0925: [
    'French troops withdrew from Keelung; Yang Yuebin and others were ordered to arrange all Taiwan affairs.',
    'French troops left Keelung; Yang Yuebin and others were assigned full Taiwan duties.',
  ],
  s0926: [
    'Arrears of Fujian taxes from the early Guangxu years were remitted.',
    'Early Guangxu tax arrears in Fujian were forgiven.',
  ],
  s0927: [
    'On day xinhai, Zhaya was permitted to follow Chab mdo in tribute.',
    'On xinhai day, Zhaya was allowed to come to court with Chab mdo.',
  ],
  s0928: [
    'On day guichou, Su Yuanchun and Feng Zicai were given third-rank Qingche duwei; Wang Xiaoqi and Cen Yuying received Yunqiwei; Wang Debang\'s original office was restored with preferential treatment.',
    'On guichou day, Su Yuanchun and Feng Zicai were made Qingche duwei; Wang Xiaoqi and Cen Yuying Yunqiwei; Wang Debang was restored with honors.',
  ],
  s0929: [
    'On day xinyou, rain prayers were again offered.',
    'On xinyou day, rain prayers were held again.',
  ],
  s0930: [
    'On day renxu, it rained.',
    'On renxu day, rain fell.',
  ],
  s0931: [
    'On day dingmao, Zhang Yao was made Guangxi governor.',
    'On dingmao day, Zhang Yao became Guangxi governor.',
  ],
  s0932: [
    'That month, relief was given for Keelung war damage, Tongcheng and other counties, and the Zhenbi water disaster.',
    'That month, Keelung, Tongcheng, and Zhenbi disaster areas were relieved.',
  ],
  s0933: [
    'Sixth month, day jisi: autumn executions were halted by edict.',
    'In month 6, jisi, autumn executions were suspended.',
  ],
  s0934: [
    'On day gengwu, an empress dowager edict ordered Wen Xin, Chongli, Chonghou, and Wen Xi to build the Three Seas works.',
    'On gengwu day, Wen Xin, Chongli, Chonghou, and Wen Xi were told to build the Three Seas.',
  ],
  s0935: [
    'Xu Jingcheng was also made minister to Belgium.',
    'Xu Jingcheng also became minister to Belgium.',
  ],
  s0936: [
    'On day xinwei, household registers were fixed for Vietnamese subjects who had entered Qing territory.',
    'On xinwei day, registers were set for attached Vietnamese subjects.',
  ],
  s0937: [
    'On day jiaxu, the Yantai treaty negotiated by Zeng Jize was concluded.',
    'On jiaxu day, Zeng Jize concluded the Yantai treaty.',
  ],
  s0938: [
    'On day dingchou, Cen Yuying was instructed to investigate Yunnan copper mines.',
    'On dingchou day, Cen Yuying was told to inspect Yunnan copper mines.',
  ],
  s0939: [
    'A general order told Zeng Guoquan and others to survey mines in the southeast.',
    'Zeng Guoquan and others were generally ordered to survey southeastern mines.',
  ],
  s0940: [
    'Relief was given for the flood disaster at Yuzhou.',
    'Yuzhou flood victims were relieved.',
  ],
  s0941: [
    'On day guiwei, Works Vice Minister Sun Yuwen, Shuntian prefect Shen Bingcheng, and Hunan surveillance commissioner Xu Chang were all ordered to serve at the Zongli Yamen.',
    'On guiwei day, Sun Yuwen, Shen Bingcheng, and Xu Chang joined the Zongli Yamen.',
  ],
  s0942: [
    'Zeng Jize was recalled to the capital; Jiangxi treasurer Liu Ruifen was appointed minister to Britain and Russia, and Zhang Yinhuan minister to America, Japan, and Peru.',
    'Zeng Jize was recalled; Liu Ruifen went to Britain and Russia, Zhang Yinhuan to America, Japan, and Peru.',
  ],
  s0943: [
    'French troops left Penghu.',
    'French troops withdrew from Penghu.',
  ],
  s0944: [
    'Zuo Zongtang and others were ordered to choose officers and dispatch steamships in support.',
    'Zuo Zongtang and others were told to select officers and deploy steamers.',
  ],
  s0945: [
    'On day xinmao, the new Vietnam treaty was concluded and proclaimed at home and abroad.',
    'On xinmao day, the new Vietnam treaty was signed and announced.',
  ],
  s0946: [
    'An edict admonished memorializing officials not to attack others out of private grudges.',
    'Memorialists were warned against partisan attacks.',
  ],
  s0947: [
    'Retrospective review found that censor Wu Xun\'s impeachment of Yan Jingsan and compiler Liang Dingfen\'s impeachment of Li Hongzhang were both slander of high officials; severe discipline was imposed.',
    'Wu Xun\'s attack on Yan Jingsan and Liang Dingfen\'s on Li Hongzhang were ruled slander; both were severely punished.',
  ],
  s0948: [
    'Shortly thereafter both were demoted five ranks.',
    'They were soon each demoted five ranks.',
  ],
  s0949: [
    'On day jiawu, Sun Yuwen was appointed Grand Councilor.',
    'On jiawu day, Sun Yuwen joined the Grand Council.',
  ],
  s0950: [
    'That month, floods in Henan, Guangdong, Guangxi, Jiangnan, Anhui, and Jiangxi were relieved.',
    'That month, flood relief was sent to six provinces.',
  ],
  s0951: [
    'Autumn, seventh month, new moon day dingyou: a telegraph line was set from Nanning in Guangxi to Yunnan.',
    'In autumn month 7, new moon dingyou, a telegraph line opened from Nanning to Yunnan.',
  ],
  s0952: [
    'On day jihai, an empress dowager edict released sixty thousand taels of treasury silver for Guangdong and Guangxi flood relief.',
    'On jihai day, sixty thousand taels were released for Guangdong–Guangxi flood relief.',
  ],
  s0953: [
    'On day gengzi, Zuo Zongtang repeatedly sought sick leave; it was granted.',
    'On gengzi day, Zuo Zongtang\'s repeated sick leave was granted.',
  ],
  s0954: [
    'On day bingchen, Zhou Derun was sent to Yunnan and Deng Chengxiu to Guangxi to join Cen Yuying and Zhang Kaisong in surveying the Sino-Vietnamese border.',
    'On bingchen day, Zhou Derun and Deng Chengxiu joined Cen Yuying and Zhang Kaisong on the Sino-Vietnamese border survey.',
  ],
  s0955: [
    'On day renxu, the Yellow River breached its banks at Changqing in Shandong.',
    'On renxu day, the Yellow River broke out at Shandong\'s Changqing.',
  ],
  s0956: [
    'On day jiazi, copper and iron mines in Sichuan and Yunnan were opened.',
    'On jiazi day, Sichuan and Yunnan copper and iron mines were opened.',
  ],
  s0957: [
    'That month, flood disasters at Qianyang, Xiangtan, Huixian, Qingjiang, Dangtu, Fenyang, and other places were relieved.',
    'That month, floods at Qianyang, Xiangtan, and other towns were relieved.',
  ],
  s0958: [
    'Eighth month, new moon day dingmao: Gansu flood victims were relieved.',
    'In month 8, new moon dingmao, Gansu flood victims were relieved.',
  ],
  s0959: [
    'On day jisi, one hundred thousand shi of tribute grain transport was diverted for Shuntian and Zhili relief needs.',
    'On jisi day, one hundred thousand shi of tribute grain was set aside for Shuntian–Zhili relief.',
  ],
  s0960: [
    'Hail and flood disasters at Gaolan and other places were relieved.',
    'Gaolan and other hail and flood areas were relieved.',
  ],
  s0961: [
    'On day yihai, flood disasters at Changsha and other places were relieved.',
    'On yihai day, Changsha and other flood areas were relieved.',
  ],
  s0962: [
    'On day dingchou, floods at Licheng, Zhangqiu, and other places in Shandong were relieved with fifty thousand taels from the treasury.',
    'On dingchou day, fifty thousand taels were sent for Shandong floods at Licheng and Zhangqiu.',
  ],
  s0963: [
    'Because of the flood disaster, work on the Three Seas was halted.',
    'Three Seas work was halted because of floods.',
  ],
  s0964: [
    'Li Hongzhang negotiated overland trade routes through Yunnan and Guangdong with the French envoy.',
    'Li Hongzhang discussed Yunnan and Guangdong overland trade with France.',
  ],
  s0965: [
    'On day wuyin, Li Zhengying was released to return to Korea.',
    'On wuyin day, Li Zhengying was released to Korea.',
  ],
  s0966: [
    'On day xinsi, Su Yuanchun was ordered to settle and care for Vietnamese refugees who had crossed the border.',
    'On xinsi day, Su Yuanchun was told to settle Vietnamese refugees.',
  ],
  s0967: [
    'The flood disaster at Xiangcheng was relieved.',
    'Xiangcheng flood victims were relieved.',
  ],
  s0968: [
    'On day yiyou, Zuo Zongtang died; he was posthumously made Grand Tutor.',
    'On yiyou day, Zuo Zongtang died and was posthumously made Grand Tutor.',
  ],
  s0969: [
    'On day xinmao, Fujian windstorm victims were relieved.',
    'On xinmao day, Fujian storm victims were relieved.',
  ],
  s0970: [
    'Ninth month, day gengzi: an empress dowager edict made Prince Chun director of naval affairs, with Prince Qing and Li Hongzhang as joint directors, and Banner General Shanqing and War Vice Minister Zeng Jize as assistants.',
    'In month 9, gengzi, Prince Chun directed the navy; Prince Qing and Li Hongzhang assisted; Shanqing and Zeng Jize helped.',
  ],
  s0971: [
    'The Fujian governorship was changed to Taiwan governor; Fujian governorship duties were assigned to the Fujian-Zhejiang governor-general.',
    'Fujian governor became Taiwan governor; Fujian duties went to the Fujian-Zhejiang governor-general.',
  ],
  s0972: [
    'The British minister came to discuss trade between India and Tibet.',
    'The British minister came to discuss India–Tibet trade.',
  ],
  s0973: [
    'Ding Baozhen, Selingge, and others were instructed to guide Tibetans and prevent trouble.',
    'Ding Baozhen, Selingge, and others were told to keep Tibetans from causing trouble.',
  ],
  s0974: [
    'On day renyin, Linggui died.',
    'On renyin day, Linggui died.',
  ],
  s0975: [
    'On day jiachen, the Ili councillor post was abolished and two vice commandants were established instead.',
    'On jiachen day, the Ili councillor was abolished and two vice commandants set up.',
  ],
  s0976: [
    'The Tarbagatai Manchu commandant was abolished, but the Oirat commandant was retained.',
    'Tarbagatai\'s Manchu commandant was cut; the Oirat commandant remained.',
  ],
  s0977: [
    'On day jiayin, hail disasters at Binchuan, En\'an, and other places were relieved.',
    'On jiayin day, Binchuan and En\'an hail victims were relieved.',
  ],
  s0978: [
    'Winter, tenth month, new moon day bingyin: Korean King Yi Hui, because lurking bandits were not yet eliminated, asked for troops to pacify them.',
    'In winter month 10, new moon bingyin, King Yi Hui of Korea asked for help against remaining bandits.',
  ],
  s0979: [
    'Li Hongzhang sent troops to guard and protect him.',
    'Li Hongzhang sent troops to protect Korea.',
  ],
  s0980: [
    'On day wuchen, Chaoyang disaster victims were relieved.',
    'On wuchen day, Chaoyang disaster victims were relieved.',
  ],
  s0981: [
    'On day gengchen, fifty thousand taels of next year\'s Beijing stipend silver was diverted for Shandong winter relief.',
    'On gengchen day, fifty thousand taels of next year\'s Beijing funds went to Shandong winter relief.',
  ],
  s0982: [
    'On day xinsi, Prince Qing and Xu Genshen were ordered to exchange treaties with the French envoy; Liu Ruifen was to exchange the Yantai treaty in London and also negotiate a separate opium clause.',
    'On xinsi day, Prince Qing and Xu Genshen exchanged treaties with France; Liu Ruifen exchanged the Yantai treaty in London and negotiated an opium clause.',
  ],
  s0983: [
    'On day dinghai, Mutushan was made imperial commissioner to train troops jointly with the Three Eastern Provinces generals, with authority over vice commandants and below.',
    'On dinghai day, Mutushan was made commissioner to train troops in the northeast with authority over local commanders.',
  ],
  s0984: [
    'On day jiawu, fifty thousand taels of New Year palace funds were allocated to relieve Shandong disaster areas.',
    'On jiawu day, fifty thousand taels of palace New Year funds went to Shandong.',
  ],
  s0985: [
    'Forbidden City gate security was tightened.',
    'Forbidden City gates were strictly guarded.',
  ],
  s0986: [
    'Eleventh month, day renyin: prayers for snow were offered.',
    'In month 11, renyin, snow prayers were held.',
  ],
  s0987: [
    'On day yisi, Yunnan had an earthquake.',
    'On yisi day, Yunnan was shaken by an earthquake.',
  ],
  s0988: [
    'On day gengshen, Hui officials in the various Xinjiang cities were abolished.',
    'On gengshen day, Hui posts in Xinjiang cities were abolished.',
  ],
  s0989: [
    'On day guihai, an empress dowager edict ordered Eight Banner generals to eliminate abuses in banner camps.',
    'On guihai day, banner generals were told to root out camp abuses.',
  ],
  s0990: [
    'En Cheng was made Grand Secretary of the Tiren Pavilion; Yan Jingsan Grand Secretary of the East Pavilion; Revenue Minister Fukun and Punishments Minister Zhang Zhiwan were made associate grand secretaries.',
    'En Cheng became Tiren Pavilion grand secretary; Yan Jingsan East Pavilion; Fukun and Zhang Zhiwan associate grand secretaries.',
  ],
  s0991: [
    'Because the British had destroyed Burma, Sichuan frontier defenses were tightened.',
    'Sichuan frontier defenses were tightened after Britain took Burma.',
  ],
  s0992: [
    'Twelfth month, day bingyin: land telegraph lines at Sanxing and along the Heilongjiang were continued.',
    'In month 12, bingyin, land telegraph lines at Sanxing and Heilongjiang were extended.',
  ],
  s0993: [
    'On day bingzi, an edict forbade padded accounts and wasteful spending at the Imperial Household Department.',
    'On bingzi day, padded accounts at the Imperial Household were forbidden.',
  ],
  s0994: [
    'On day jimao, the breach at Zhao Zhuang was closed.',
    'On jimao day, the Zhao Zhuang breach was closed.',
  ],
  s0995: [
    'That winter, floods at Chaozhou and Wanxian and Taiwan\'s wind disaster were relieved.',
    'That winter, Chaozhou, Wanxian, and Taiwan disasters were relieved.',
  ],
  s0996: [
    'Poll tax silver for flood-hit Yongning was remitted; wasteland and newly planted land taxes in Zhejiang prefectures, counties, and guards were remitted.',
    'Yongning flood poll tax and Zhejiang wasteland and new-field taxes were forgiven.',
  ],
  s0997: [
    'Grain taxes on lowlands at Wen\'an and Tianjin were reduced.',
    'Wen\'an and Tianjin lowland grain taxes were cut.',
  ],
  s0998: [
    'Silver taxes for flood-hit Xugou and Fenyang were remitted.',
    'Xugou and Fenyang flood silver taxes were forgiven.',
  ],
  s0999: [
    'In the twelfth year, bingxu, spring, first month, new moon day yimao: banquets were suspended.',
    'Year 12, spring 1, new moon yimao: banquets were halted.',
  ],
  s1000: [
    'On day gengzi, Hubei tax arrears were remitted.',
    'On gengzi day, Hubei tax arrears were forgiven.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_023_b10.mjs <translation.json>'
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
