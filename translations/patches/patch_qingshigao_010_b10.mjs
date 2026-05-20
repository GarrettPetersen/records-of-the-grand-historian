#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0901: [
    'On day jihai, Anhui Governor Zhang Kai was summoned to the capital; Karjishan was transferred to replace him.',
    'On jihai day, Zhang Kai was recalled from Anhui and Karjishan took his place.',
  ],
  s0902: [
    'The Emperor ordered leniency toward Ortai\'s faction-shielding of Zhong Yongtan\'s crime.',
    'Ortai\'s party was granted leniency in shielding Zhong Yongtan.',
  ],
  s0903: [
    'Quota land taxes were remitted for three prefectures and counties of Zhili including Jizhou on account of flood damage.',
    'Flood taxes were remitted in three Zhili districts including Jizhou.',
  ],
  s0904: [
    'On day dingwei, grain from the Jilin Wula granary was allocated and transported to relieve drought in Qiqihar and other places.',
    'On dingwei day, Jilin grain was sent to drought-stricken Qiqihar and elsewhere.',
  ],
  s0905: [
    'On day gengxu, famine relief was given in five prefectures and counties of Fengtian including Chengde.',
    'On gengxu day, famine relief reached five Fengtian districts including Chengde.',
  ],
  s0906: [
    'Quota land taxes were remitted for ten prefectures, counties, and guards of Shandong including Jiaozhou on account of flood damage.',
    'Flood taxes were remitted in ten Shandong prefectures, counties, and guards including Jiaozhou.',
  ],
  s0907: [
    'On day xinhai, Wan Yan Wei was transferred to be Director-General of River Conservancy for Hedong; Bai Zhongshan for Jiangnan.',
    'On xinhai day, Wan Yan Wei took Hedong river conservancy and Bai Zhongshan Jiangnan.',
  ],
  s0908: [
    'On day yimao, an edict said: "In Jiangnan\'s flood districts the fields have dried out; planting cannot brook delay.',
    'On yimao day, an edict urged urgent spring planting in Jiangnan\'s flood districts.',
  ],
  s0909: [
    'Frontier officials should urge disaster victims to care for draft oxen, or supply funds to feed them—none may set such matters aside as trifles.',
    'Officials were told to protect or subsidize oxen and not treat the matter lightly.',
  ],
  s0910: [
    '" (closing quotation mark in the source.)',
    'The edict closed.',
  ],
  s0911: [
    'Eighth year, spring, first month, day dingsi: E Rong\'an was exempted from exile to the military courier stations and ordered to continue service in the Upper Study.',
    'In the first month of the eighth year, E Rong\'an was spared the courier-station exile and kept at the Upper Study.',
  ],
  s0912: [
    'Zhong Yongtan died in prison.',
    'Zhong Yongtan died in jail.',
  ],
  s0913: [
    'Sun Jiagan was summoned to the capital.',
    'Sun Jiagan was called to Beijing.',
  ],
  s0914: [
    'A Erse was appointed governor-general of Huguang.',
    'A Erse became Huguang governor-general.',
  ],
  s0915: [
    'On day jiazi, Chen Shilu and others memorialized on repairing river works and water conservancy in Jiangsu\'s Huai, Xu, Yang, and Hai circuits and Anhui\'s Feng, Ying, and Si dependencies; the matter was referred to Grand Secretary Ortai and other ministers for deliberation and implementation.',
    'On jiazi day, Chen Shilu and others proposed Huai-Xu-Yang-Hai and Feng-Ying-Si river repairs; Ortai and colleagues were to decide.',
  ],
  s0916: [
    'On day jimao, Grand Councillors Xu Ben, Bandi, and Nayantai were ordered to accompany the court to Mukden.',
    'On jimao day, Xu Ben, Bandi, and Nayantai were ordered to Mukden with the court.',
  ],
  s0917: [
    'On day xinsi, Advising Ministers Adai and Ta\'erma were recalled to the capital; Labudun and Wulden were put in their places.',
    'On xinsi day, Adai and Ta\'erma returned to Beijing; Labudun and Wulden replaced them.',
  ],
  s0918: [
    'On day renchen, Academician of the Grand Secretariat Li Fu, retiring and taking leave at court, answered "finish as carefully as you began"; the Emperor bestowed a poem in praise.',
    'On renchen day, retiring academician Li Fu answered "end as you began" and received an imperial poem.',
  ],
  s0919: [
    'On day xinmao, in the examination for selection as censor, Hang Shijun\'s policy essay argued "Manchus inside, Han outside," offending the throne; he was stripped of office.',
    'On xinmao day, Hang Shijun lost his post after a censor-selection essay urging Manchu priority.',
  ],
  s0920: [
    'Liu Yuyi was transferred to be Shanxi Governor.',
    'Liu Yuyi became Shanxi governor.',
  ],
  s0921: [
    'Sun Jiagan was ordered to act as Fujian Governor.',
    'Sun Jiagan was told to act as Fujian governor.',
  ],
  s0922: [
    'On day bingshen, Yin Jishan was ordered to act as Governor-General of Liangjiang and, together with Bai Zhongshan, attend to river affairs.',
    'On bingshen day, Yin Jishan acted as Liangjiang governor-general with Bai Zhongshan on river works.',
  ],
  s0923: [
    'On day guimao, Hanlin expositor Deng Shimin and supervising secretary Ni Guolian were made pacification commissioners for Feng, Ying, and Si; compiler Tu Fengzhen and censor Xu Yisheng for Huai, Xu, Yang, and Hai.',
    'On guimao day, Deng Shimin and Ni Guolian were named Feng-Ying-Si commissioners; Tu Fengzhen and Xu Yisheng Huai-Xu-Yang-Hai commissioners.',
  ],
  s0924: [
    'On day yisi, quota land taxes were remitted for eleven prefectures, counties, and guards of Hubei including Hanchuan on account of flood damage.',
    'On yisi day, flood taxes were remitted in eleven Hubei prefectures, counties, and guards including Hanchuan.',
  ],
  s0925: [
    'Zhao Guolin was permitted to return to his native place.',
    'Zhao Guolin was allowed to go home.',
  ],
  s0926: [
    'On day guichou, Prince He Hongzhou was dispatched to offer sacrifice at the Altar of Agriculture in the Emperor\'s stead, using Zhonghe yayue music identical to the Emperor\'s personal rite; this was established as precedent.',
    'On guichou day, Prince He offered the First Farmer sacrifice with full imperial music, setting a precedent.',
  ],
  s0927: [
    'Famine relief was given in six prefectures and counties of Shandong including Tengxian.',
    'Six Shandong districts including Tengxian received famine relief.',
  ],
  s0928: [
    'On day gengwu, Karjishan was transferred to Shandong Governor; Yan Sisheng to Hubei Governor; Fan Can to Anhui Governor.',
    'On gengwu day, Karjishan took Shandong, Yan Sisheng Hubei, and Fan Can Anhui.',
  ],
  s0929: [
    'On day bingzi, the Emperor went to the Palace of Imperial Dowager Shouqi to inquire after her illness.',
    'On bingzi day, the Emperor visited Dowager Shouqi to ask after her health.',
  ],
  s0930: [
    'Summer, fourth month, first day jiashen: Imperial Dowager Shouqi died; court mourning for ten days.',
    'In the fourth month, Dowager Shouqi died and court sat in mourning ten days.',
  ],
  s0931: [
    'The Emperor wished to wear mourning; Prince Zhuang and others begged exemption.',
    'The Emperor wanted full mourning; Prince Zhuang and others begged him off.',
  ],
  s0932: [
    'The Nine Ministers were admonished to be diligent in office.',
    'The Nine Ministers were warned to work diligently.',
  ],
  s0933: [
    'Governors and governors-general were again ordered to report on subordinates\' merit or demerit.',
    'Governors were again told to report on their subordinates.',
  ],
  s0934: [
    'On day yiyou, the Emperor went to offer libations at the palace of Imperial Noble Dowager Shouqi.',
    'On yiyou day, the Emperor offered libations for Noble Dowager Shouqi.',
  ],
  s0935: [
    'On day xinmao, the Imperial Parks Department was ordered to trial the checkerboard-field method.',
    'On xinmao day, the Imperial Parks were told to test checkerboard-field farming.',
  ],
  s0936: [
    'On day dingyou, flood and famine relief was given in six prefectures under Fengyang, Anhui.',
    'On dingyou day, six Fengyang prefectures received flood and famine relief.',
  ],
  s0937: [
    'Quota land taxes were remitted for three counties of Hubei including Xiangyang on account of flood damage.',
    'Flood taxes were remitted in three Hubei counties including Xiangyang.',
  ],
  s0938: [
    'On day gengzi, the Jiangsu Coastal Defense Circuit was abolished; the Huai-Xu-Hai Circuit was established, stationed at Xuzhou Prefecture.',
    'On gengzi day, Jiangsu coastal defense was abolished and Huai-Xu-Hai circuit set at Xuzhou.',
  ],
  s0939: [
    'The Su-Song surveillance circuit was given concurrent charge of embankment works.',
    'Su-Song surveillance also took charge of embankment works.',
  ],
  s0940: [
    'Yangzhou Prefecture was placed under the Chang-Zhen circuit.',
    'Yangzhou was placed under Chang-Zhen circuit.',
  ],
  s0941: [
    'The formerly established Huai-Xu and Huai-Yang circuits had exclusively managed river works.',
    'Huai-Xu and Huai-Yang circuits had formerly handled river works alone.',
  ],
  s0942: [
    'Intercalary fourth month, first day jiayin: Ryukyu presented tribute.',
    'In the intercalary fourth month, Ryukyu sent tribute.',
  ],
  s0943: [
    'On day dingsi, the Emperor examined Hanlin and Household of the Heir officials; Wang Huifen and three others were placed in the first grade; the rest were promoted or demoted with distinctions.',
    'On dingsi day, the Emperor tested Hanlin and Household officials; Wang Huifen and three others topped the list.',
  ],
  s0944: [
    'On day xinyou, this year\'s quota land taxes were remitted for thirteen prefectures and counties of Henan including Zhengzhou on account of flood damage.',
    'On xinyou day, this year\'s flood taxes were remitted in thirteen Henan districts including Zhengzhou.',
  ],
  s0945: [
    'On day jiaxu, quotas for submerged and lost fields and shoals in two counties of Jiangsu including Wujiang were abolished.',
    'On jiaxu day, taxes on lost Jiangsu fields and shoals including Wujiang were removed.',
  ],
  s0946: [
    'Fifth month, first day guimao: an edict on the imperial progress ordered escort guards to restrain themselves strictly and not trample crops.',
    'In the fifth month, an edict told escort guards on tour not to trample crops.',
  ],
  s0947: [
    'On day yiyou, Censor Shen Maohua had been summoned for presenting lectures on the Classics and History but had already left; the Ministries were ordered to deliberate punishment strictly.',
    'On yiyou day, Shen Maohua, summoned for a classics lecture but gone, was referred for strict punishment.',
  ],
  s0948: [
    'On day dinghai, Henan was ordered to suspend collection of grain and money levies from last year\'s flood-stricken areas.',
    'On dinghai day, Henan was told to stop collecting last year\'s levies from flood districts.',
  ],
  s0949: [
    'On day jihai, transit taxes were remitted for thirteen prefectures and counties of Jiangsu including Shanyang.',
    'On jihai day, transit taxes were remitted in thirteen Jiangsu districts including Shanyang.',
  ],
  s0950: [
    'Transit charges on rice-shipping boats and copper compensation levies on merchants at Linqing were remitted.',
    'Linqing boat charges and merchant copper levies were remitted.',
  ],
  s0951: [
    'On day xinchou, famine relief was given in eighteen prefectures, counties, and guards of Shandong including Licheng.',
    'On xinchou day, eighteen Shandong prefectures, counties, and guards including Licheng received famine relief.',
  ],
  s0952: [
    'On day bingwu, Suose was made Henan Governor; Jishan Sichuan Governor.',
    'On bingwu day, Suose took Henan and Jishan Sichuan.',
  ],
  s0953: [
    'On day wushen, Qing Fu was transferred to be Governor-General of Sichuan-Shaanxi.',
    'On wushen day, Qing Fu became Sichuan-Shaanxi governor-general.',
  ],
  s0954: [
    'Maertai was made Governor-General of Liangguang.',
    'Maertai became Liangguang governor-general.',
  ],
  s0955: [
    'Zhang Yunshi was appointed Yunnan Governor-General with concurrent charge of governor affairs.',
    'Zhang Yunshi was made Yunnan governor-general with governorship duties.',
  ],
  s0956: [
    'On day xinyou, the King of Sulu Mamahmodo presented through Liading a memorial asking triennial tribute missions; he was ordered still to follow the five-year precedent.',
    'On xinyou day, Sulu\'s king asked for triennial tribute but was told to keep the five-year schedule.',
  ],
  s0957: [
    'Sixth month, first day renzi: Censor Chen Ren asked that Hanlin and Household examinations use Classics and History rather than poetry; the Emperor praised this.',
    'In the sixth month, Chen Ren urged classics over poetry in Hanlin exams and was praised.',
  ],
  s0958: [
    'On day jiayin, Nanzhang tribute interval was changed to once in ten years.',
    'On jiayin day, Nanzhang tribute was set at once in ten years.',
  ],
  s0959: [
    'On day yimao, land tax on submerged land in Peixian, Jiangsu was abolished.',
    'On yimao day, taxes on submerged Peixian land were removed.',
  ],
  s0960: [
    'On day bingchen, because of drought the Emperor sought memorials and advice.',
    'On bingchen day, drought prompted the Emperor to seek memorials.',
  ],
  s0961: [
    'On day wuwu, Arigge was ordered temporarily to act as Henan Governor.',
    'On wuwu day, Arigge was told to act as Henan governor.',
  ],
  s0962: [
    'On day dingmao, in the case of Censor Hu Ding\'s impeachment of Hunan Governor Xu Rong, it was found that governors had framed him in collusion; rewards and punishments were assigned.',
    'On dingmao day, Hu Ding\'s case against Xu Rong exposed collusive framing by governors; punishments followed.',
  ],
  s0963: [
    'On day renshen, an edict told governors to lead subordinates in valuing agriculture.',
    'On renshen day, governors were told to lead their staffs in honoring farming.',
  ],
  s0964: [
    'Autumn, seventh month, day yiyou: the Emperor went to Imperial Dowager Shunyi\'s palace to inquire after her illness.',
    'In the seventh month, the Emperor visited Dowager Shunyi to ask after her health.',
  ],
  s0965: [
    'On day bingxu, because Annam was unsettled and disturbances reached Yunnan\'s Kaihua Duting silver mine, Zhang Yunshi and others were ordered to guard strictly.',
    'On bingxu day, unrest in Annam reaching Yunnan\'s Kaihua mine led Zhang Yunshi and others to tighten defenses.',
  ],
  s0966: [
    'Kaihua garrison commander Saidou asked to campaign against Annam; this was not permitted.',
    'Saidou\'s request to attack Annam was denied.',
  ],
  s0967: [
    'On day wuzi, the Emperor, escorting the Empress Dowager from Rehe to Mukden to visit the tombs, remitted grain and money levies on districts passed through in Zhili and Fengtian.',
    'On wuzi day, traveling from Rehe to Mukden with the Empress Dowager, the Emperor remitted levies along the route in Zhili and Fengtian.',
  ],
  s0968: [
    'Four hundred thousand shi of grain from the Tong granary were allocated to relieve drought in Zhili.',
    'Four hundred thousand shi from Tong granary were sent to drought-stricken Zhili.',
  ],
  s0969: [
    'On day renchen, quota land taxes were remitted for sixteen prefectures, counties, and guards of Shandong including Licheng on account of drought damage.',
    'On renchen day, drought taxes were remitted in sixteen Shandong districts including Licheng.',
  ],
  s0970: [
    'On day yiwei, this year\'s review executions were suspended.',
    'On yiwei day, this year\'s judicial review executions were halted.',
  ],
  s0971: [
    'The Emperor, escorting the Empress Dowager, halted at the Mountain Villa to Escape the Heat.',
    'The court stopped at the Summer Resort with the Empress Dowager.',
  ],
  s0972: [
    'On day bingshen, land tax on flood-washed land in two counties of Fujian including Lianjiang was abolished.',
    'On bingshen day, taxes on flood-washed Fujian land including Lianjiang were removed.',
  ],
  s0973: [
    'On day jihai, the Emperor, escorting the Empress Dowager, proceeded to Mukden.',
    'On jihai day, the Emperor and Empress Dowager went on to Mukden.',
  ],
  s0974: [
    'On day guimao, the Emperor went hunting at Yong\'anmangka.',
    'On guimao day, the Emperor hunted at Yong\'anmangka.',
  ],
  s0975: [
    'On day yisi, the Emperor went hunting at Aili.',
    'On yisi day, the Emperor hunted at Aili.',
  ],
  s0976: [
    'On day bingwu, the Emperor went hunting at Xilanuohai.',
    'On bingwu day, the Emperor hunted at Xilanuohai.',
  ],
  s0977: [
    'Strict elimination of abuses in districts\' grain-transport warehouse surcharges was ordered.',
    'District abuses in grain-transport warehouse surcharges were ordered ended.',
  ],
  s0978: [
    'On day wushen, quota levies on saltern households in Cangzhou, Zhili, struck by hail, were remitted.',
    'On wushen day, hail-struck Cangzhou saltern quotas were remitted.',
  ],
  s0979: [
    'The Emperor, escorting the Empress Dowager, halted at Mamatala.',
    'The court halted at Mamatala with the Empress Dowager.',
  ],
  s0980: [
    'On day jiyou, the Emperor went hunting; through jimao day it was the same.',
    'From jiyou through jimao the Emperor hunted each day.',
  ],
  s0981: [
    'Strict prohibition on governors leaking confidential memorials was enforced.',
    'Governors were strictly forbidden to leak confidential memorials.',
  ],
  s0982: [
    'Flood relief was given in three prefectures and counties of Hubei including Xingguo, and land-tax quotas were remitted.',
    'Three Hubei districts including Xingguo received flood relief and tax remission.',
  ],
  s0983: [
    'On day guihai, the Longevity Festival; the Emperor went to the Empress Dowager\'s traveling tent to perform rites.',
    'On guihai day, the Longevity Festival, the Emperor performed rites at the Empress Dowager\'s tent.',
  ],
  s0984: [
    'At the traveling tent, accompanying princes, ministers, officials, and Mongol princes offered congratulations.',
    'At the tent, princes, ministers, and Mongol nobles offered congratulations.',
  ],
  s0985: [
    'Banquets were granted to princes, ministers, and Mongol princes.',
    'Banquets were given to princes, ministers, and Mongol nobles.',
  ],
  s0986: [
    'On day jiazi, the Emperor halted at Bayarettatala.',
    'On jiazi day, the court halted at Bayarettatala.',
  ],
  s0987: [
    'On day yichou, the Emperor went hunting.',
    'On yichou day, the Emperor hunted.',
  ],
  s0988: [
    'On day wuchen, the Emperor went hunting.',
    'On wuchen day, the Emperor hunted.',
  ],
  s0989: [
    'On day renshen, the Emperor halted at Yikenuo\'er and went hunting; through bingzi day it was the same.',
    'From renshen through bingzi the Emperor halted at Yikenuo\'er and hunted.',
  ],
  s0990: [
    'On day jiaxu, flood relief was given in Xichang, Sichuan.',
    'On jiaxu day, Xichang received flood relief.',
  ],
  s0991: [
    'Regulations were fixed for relief of drought-stricken prefectures and counties in Zhili.',
    'Zhili drought relief rules were set.',
  ],
  s0992: [
    'Flood relief was given in sixteen prefectures and counties of Guangdong including Shixing.',
    'Sixteen Guangdong districts including Shixing received flood relief.',
  ],
  s0993: [
    'On day jimao, the Emperor hunted at Bayan and personally shot and killed a tiger.',
    'On jimao day, the Emperor killed a tiger with his own bow at Bayan.',
  ],
  s0994: [
    'Ninth month, first day gengchen: the Emperor hunted at Wushihenga and personally shot and killed a tiger.',
    'In the ninth month, the Emperor killed a tiger at Wushihenga.',
  ],
  s0995: [
    'On day xinsi, the Emperor hunted at Weizhun.',
    'On xinsi day, the Emperor hunted at Weizhun.',
  ],
  s0996: [
    'On day renwu, the Emperor hunted at Huangke.',
    'On renwu day, the Emperor hunted at Huangke.',
  ],
  s0997: [
    'On day guiwei, the Emperor hunted at Alan.',
    'On guiwei day, the Emperor hunted at Alan.',
  ],
  s0998: [
    'Because the Jebzundamba Khutukhtu had not reported going to worship at Erdene Juu, and the Tusheet Khan Dundendorji, both were referred to the Court of Colonial Affairs for disposition.',
    'The Jebzundamba Khutukhtu and Tusheet Khan Dundendorji were sent to the Court of Colonial Affairs for failing to report a pilgrimage to Erdene Juu.',
  ],
  s0999: [
    'On day jiashen, flood and famine relief was given in Shangzhou, Shaanxi.',
    'On jiashen day, Shangzhou received flood and famine relief.',
  ],
  s1000: [
    'On day yiyou, the Emperor hunted at Sheli.',
    'On yiyou day, the Emperor hunted at Sheli.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_010_b10.mjs <translation.json>'
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
