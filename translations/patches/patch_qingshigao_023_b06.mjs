#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'On day xinwei, Empress Dowager Ci\'an fell ill; on day renshen she died at the Palace of Gathering Purity.',
    'On xinwei day Empress Dowager Ci\'an took ill; on renshen she died at Zhongcui Palace.',
  ],
  s0502: [
    'On day guiwei, the late empress dowager was given the posthumous title Empress Xiaozhen Ci\'an, magnanimous, celebratory, harmonious, reverent, august Heaven, blessing, and manifest holiness.',
    'On guiwei day the late empress dowager was honored as Empress Xiaozhen Ci\'an Yuqing Hejing Yitian Zuo Shengxian.',
  ],
  s0503: [
    'Fourth month of summer, day guisi: Leibo Yi bandits were pacified.',
    'In summer month 4, guisi, Leibo Yi rebels were pacified.',
  ],
  s0504: [
    'On day jihai, Wu Dacheng was ordered to supervise defense and garrison-farming affairs at Jilin Sanxing, Ningguta, and Hunchun.',
    'On jihai day Wu Dacheng took charge of defense and colonies at Jilin Sanxing, Ningguta, and Hunchun.',
  ],
  s0505: [
    'Arrears of land tax were remitted for sixty-two departments, prefectures, and counties including Xianning in Shaanxi.',
    'Shaanxi\'s Xianning and sixty-one other districts were freed from tax arrears.',
  ],
  s0506: [
    'On day xinchou, the late Empress Xiaozhen\'s testamentary edict was issued to Korea.',
    'On xinchou day Korea received the testamentary edict of late Empress Xiaozhen.',
  ],
  s0507: [
    'On day jiyou, Zeng Jize completed the revised treaty with Russia.',
    'On jiyou day Zeng Jize concluded the revised treaty with Russia.',
  ],
  s0508: [
    'On day bingchen, private guards at the Ming imperial tombs were permanently banned.',
    'On bingchen day private guards at the Ming tombs were forever forbidden.',
  ],
  s0509: [
    'On day jiwei, an imperial rescript ordered Princes Gong and Chun, together with Zuo Zongtang and Li Hongzhang, to deliberate on water conservancy in the metropolitan region.',
    'On jiwei day an edict told Princes Gong and Chun, with Zuo Zongtang and Li Hongzhang, to plan capital-region waterworks.',
  ],
  s0510: [
    'The office of Hunchun vice commander-in-chief was first established.',
    'Hunchun vice commander-in-chief was first created.',
  ],
  s0511: [
    'On day gengshen, relief was given for the Taipei earthquake disaster.',
    'On gengshen day Taipei earthquake victims received relief.',
  ],
  s0512: [
    'Fifth month, first day renshen: there was a solar eclipse.',
    'Month 5, renshen new moon: a solar eclipse occurred.',
  ],
  s0513: [
    'Government troops routed entrenched bandits in Vietnam.',
    'Imperial forces scattered long-standing Vietnamese bandits.',
  ],
  s0514: [
    'On day dingmao, frontier officials were ordered to report monthly on robbery and major cases assigned to them; delay beyond the deadline would be punished.',
    'On dingmao day regional commanders were told to submit monthly registers of major robbery cases or face penalties for lateness.',
  ],
  s0515: [
    'On day wuyin, garrison farming at Uliastai was abolished.',
    'On wuyin day Uliastai military colonies were ended.',
  ],
  s0516: [
    'On day jichou, flood relief was given at Yanyuan.',
    'On jichou day Yanyuan flood victims received aid.',
  ],
  s0517: [
    'Zheng Zaoru was granted third-rank chamberlain status and made minister plenipotentiary to the United States, Japan, and Peru.',
    'Zheng Zaoru was made a third-rank envoy to the United States, Japan, and Peru.',
  ],
  s0518: [
    'Sixth month, day jihai: a comet appeared; an edict called for self-examination and reform.',
    'In month 6, jihai, a comet was seen and the court ordered moral review.',
  ],
  s0519: [
    'On day bingchen, the Longevity Festival; court congratulations were suspended.',
    'On bingchen day, the emperor\'s birthday; formal congratulations were canceled.',
  ],
  s0520: [
    'On day jiwei, Li Hongzao was ordered to assist as Grand Secretary.',
    'On jiwei day Li Hongzao was assigned to assist as Grand Secretary.',
  ],
  s0521: [
    'Seventh month of autumn, day guihai: retired Guangdong magistrate Zhu Ciqi and juren Chen Li, men of pure learning and conduct, were each granted fifth-rank chamberlain rank.',
    'Autumn month 7, guihai: Zhu Ciqi and Chen Li of Guangdong received fifth-rank honors for scholarly virtue.',
  ],
  s0522: [
    'On day wuzi, Liu Kunyi was summoned to the capital; Peng Yulin acted as governor-general of the Two Jiangs and Southern Ocean superintendent.',
    'On wuzi day Liu Kunyi was recalled to Beijing and Peng Yulin took acting charge of the Two Jiangs and the Southern Ocean.',
  ],
  s0523: [
    'Relief was given for earthquake disasters at Jiezhou and elsewhere.',
    'Earthquake relief was sent to Jiezhou and other places.',
  ],
  s0524: [
    'Intercalary seventh month, day renchen: provinces were instructed to audit transit-tax station receipts and expenditures and decide which to abolish or retain.',
    'Intercalary month 7, renchen: provinces were told to review likin stations and decide which to close or keep.',
  ],
  s0525: [
    'On day guisi, relief was given for salt-field disasters in the Two Huai and Taizhou areas.',
    'On guisi day Two Huai and Taizhou salt works received disaster relief.',
  ],
  s0526: [
    'On day jiawu, five years of tax arrears were remitted for Yushe and other counties.',
    'On jiawu day Yushe and other counties were freed from five years\' tax arrears.',
  ],
  s0527: [
    'On day jihai, Jin Shun was ordered to supervise handover of Yili; Xilun was made special commissioner to negotiate commercial affairs with the Russians.',
    'On jihai day Jin Shun took charge of Yili\'s transfer and Xilun negotiated trade with Russia.',
  ],
  s0528: [
    'Soon Sheng Tai was also made a special commissioner.',
    'Sheng Tai was soon added as special commissioner.',
  ],
  s0529: [
    'On day jiachen, Bao Chao was ordered again to reduce his troops.',
    'On jiachen day Bao Chao was told again to cut his forces.',
  ],
  s0530: [
    'On day yisi, the Hulunbuir vice commander-in-chief was first established.',
    'On yisi day the Hulunbuir vice commander post was created.',
  ],
  s0531: [
    'On day gengxu, prefectures and counties were forbidden to conceal serious criminal cases.',
    'On gengxu day local officials were banned from covering up major trials.',
  ],
  s0532: [
    'That month, flood relief was given in Jiangsu, Fujian, and Sichuan, and hail disaster relief in Shaanxi.',
    'That month Jiangsu, Fujian, and Sichuan floods and Shaanxi hail received relief.',
  ],
  s0533: [
    'Eighth month, day jiazi: twenty thousand taels of treasury silver were issued to support Khoshut refugees.',
    'Month 8, jiazi: 20,000 taels were granted for Khoshut refugees.',
  ],
  s0534: [
    'On day xinsi, because the empress dowager had recovered, the Board of Punishments was ordered to suspend autumn executions.',
    'On xinsi day autumn executions were halted as the empress dowager improved.',
  ],
  s0535: [
    'Those whose reprieves had reached three times and those not yet at three times were each reduced in penalty by differentiated amounts.',
    'Reprieved convicts at three terms and those below three were given differing sentence reductions.',
  ],
  s0536: [
    'On day guiwei, the late Empress Xiaozhen was laid to rest; rents and taxes along the route were remitted.',
    'On guiwei day Empress Xiaozhen was interred and transit districts were tax-free.',
  ],
  s0537: [
    'Liu Jintang was made imperial commissioner to supervise Xinjiang military affairs, with Zhang Yao as his deputy.',
    'Liu Jintang was imperial commissioner for Xinjiang and Zhang Yao assisted.',
  ],
  s0538: [
    'On day bingxu, land-tax quotas on sterile soil at Boduna were removed.',
    'On bingxu day Boduna barren-land taxes were abolished.',
  ],
  s0539: [
    'Quan Qing retired.',
    'Quan Qing left office.',
  ],
  s0540: [
    'Ninth month, day jiawu: flood relief at Ninghai and other counties.',
    'Month 9, jiawu: Ninghai and other counties received flood aid.',
  ],
  s0541: [
    'On day yiwei, Peng Yulin\'s resignation was accepted, but he continued to inspect the Yangtze.',
    'On yiwei day Peng Yulin stepped down yet still patrolled the Yangtze.',
  ],
  s0542: [
    'Liu Kunyi was dismissed; Zuo Zongtang became governor-general of the Two Jiangs and Southern Ocean superintendent.',
    'Liu Kunyi left office and Zuo Zongtang took the Two Jiangs and Southern Ocean.',
  ],
  s0543: [
    'On day bingwu, the late Empress Xiaozhen was buried at Dingdongling.',
    'On bingwu day Empress Xiaozhen was buried at Dingdong Mausoleum.',
  ],
  s0544: [
    'On day dingwei, Nian bandits in Runing and Guangzhou were pacified.',
    'On dingwei day Runing and Guangzhou Nian rebels were pacified.',
  ],
  s0545: [
    'On day jiyou, Jintan\'s grain-transport quota was again reduced by one ten-thousandth and four milliares.',
    'On jiyou day Jintan\'s grain tax was cut another 1.04 per 10,000.',
  ],
  s0546: [
    'Eight Tibetan groups living attached in Qinghai were granted over eight hundred shi of highland barley yearly.',
    'Eight Qinghai Tibetan groups received more than 800 shi of barley a year.',
  ],
  s0547: [
    'On day xinwei, the spirit tablet of the late Empress Xiaozhen was enshrined in the Grand Temple.',
    'On xinwei day Empress Xiaozhen\'s tablet entered the Grand Temple.',
  ],
  s0548: [
    'On day bingchen, relief was given for Taiwan typhoon damage.',
    'On bingchen day Taiwan typhoon victims received aid.',
  ],
  s0549: [
    'That month, earthquakes struck Gansu and Taiwan.',
    'That month Gansu and Taiwan had earthquakes.',
  ],
  s0550: [
    'Tenth month of winter, day jisi: the empress dowager\'s birthday; banquets were suspended.',
    'Winter month 10, jisi: the empress dowager\'s birthday feast was canceled.',
  ],
  s0551: [
    'On day gengwu, bandits led by Lu Songshen of Zhaotong rebelled; government troops hunted them down and executed them.',
    'On gengwu day Zhaotong rebels under Lu Songshen were killed by government forces.',
  ],
  s0552: [
    'On day guiyou, Ling Gui was made Grand Secretary of the Citong Hall; Minister of Justice Wen Yu was ordered to assist as Grand Secretary.',
    'On guiyou day Ling Gui joined the Citong Grand Secretariat and Wen Yu assisted.',
  ],
  s0553: [
    'On day jiaxu, French forces held northern Vietnam; Yunnan and Guangdong were instructed jointly to plan how to end the conflict.',
    'On jiaxu day France held northern Vietnam and Yunnan and Guangdong were told to end the trouble.',
  ],
  s0554: [
    'On day jiashen, an edict ordered the inspection cycle to be held without nominations lacking impeachment.',
    'On jiashen day officials were warned not to nominate without impeaching in the inspection round.',
  ],
  s0555: [
    'Flood relief at Taihe and other counties.',
    'Taihe and other counties received flood relief.',
  ],
  s0556: [
    'On day dinghai, dismissed Anhui provincial commander Li Shizhong arbitrarily arrested juren Wu Tingjian and others; Yu Lu reported this and an edict ordered execution.',
    'On dinghai day ex-commander Li Shizhong of Anhui was beheaded for illegally seizing Wu Tingjian and others.',
  ],
  s0557: [
    'Eleventh month, day gengyin: rents were remitted for flooded official estates in Jilin and for land at Boduna.',
    'Month 11, gengyin: Jilin flooded estates and Boduna rents were forgiven.',
  ],
  s0558: [
    'On day bingshen, Shinan secret-society rebel Yang Dengjun was executed.',
    'On bingshen day Yang Dengjun of Shinan was put to death.',
  ],
  s0559: [
    'On day dingyou, silt at Wusong was dredged.',
    'On dingyou day Wusong harbor silt was cleared.',
  ],
  s0560: [
    'On day wuxu, bandit chief Zhao Suqi of Guangxi\'s Guohua native prefecture was executed.',
    'On wuxu day Zhao Suqi of Guangxi was executed.',
  ],
  s0561: [
    'Flood relief at Gui county and elsewhere.',
    'Gui county and other areas received flood relief.',
  ],
  s0562: [
    'On day jiachen, disaster relief for Taiwan and Penghu.',
    'On jiachen day Taiwan and Penghu received disaster aid.',
  ],
  s0563: [
    'Twelfth month, day yihai: Prince Gong\'s son Zaihuang was granted the rank of duke outside the Eight Banners privileges; Prince Chun\'s son Zaihong was made a Feng\'en fuguo gong.',
    'Month 12, yihai: Zaihuang son of Prince Gong became an outer-eight-banner duke; Zaihong son of Prince Chun became Feng\'en fuguo gong.',
  ],
  s0564: [
    'That month, taxes on abandoned and newly cultivated land in Zhejiang prefectures, departments, counties, and guards were remitted, as were salt-field levies at Renhe and elsewhere.',
    'That month Zhejiang abandoned land taxes and Renhe salt levies were remitted.',
  ],
  s0565: [
    'Grain quotas on waterlogged land in Anzhou, Ren county, and Wen\'an were remitted.',
    'Anzhou, Ren, and Wen\'an floodland grain taxes were forgiven.',
  ],
  s0566: [
    'Rents and taxes on wasteland in Jilin were abolished.',
    'Jilin waste land taxes were removed.',
  ],
  s0567: [
    'That winter, snow was repeatedly prayed for.',
    'That winter the court repeatedly prayed for snow.',
  ],
  s0568: [
    'That year, Korea and Vietnam sent tribute missions.',
    'That year Korea and Vietnam paid tribute.',
  ],
  s0569: [
    'Eighth year, spring, first month, day wuzi new moon: court congratulations were excused.',
    'Year 8, spring month 1, wuzi new moon: formal court greeting was waived.',
  ],
  s0570: [
    'On day xinmao, the Dongting West Lake embankment was repaired.',
    'On xinmao day the Dongting West Lake dike was rebuilt.',
  ],
  s0571: [
    'From the eleventh month of the previous year there had been no rain until this month.',
    'No rain had fallen since last month 11 until now.',
  ],
  s0572: [
    'On day jihai, it snowed.',
    'On jihai day snow fell.',
  ],
  s0573: [
    'On day gengxu, the Hutuo New River and Ziya River embankments were repaired.',
    'On gengxu day the Hutuo New River and Ziya River dikes were fixed.',
  ],
  s0574: [
    'Second month, day jiwei: the Jiangsu Confucian temple burned.',
    'Month 2, jiwei: fire destroyed Jiangsu\'s Confucian temple.',
  ],
  s0575: [
    'On day renxu, because Koreans had occupied and cultivated Jilin borderlands for years, they were ordered to take licenses, pay rent, and register as subjects.',
    'On renxu day Koreans farming Jilin borderlands were told to register, pay rent, and take licenses.',
  ],
  s0576: [
    'On day guichou, gate security was strictly enforced and inspection and guard regulations were revised.',
    'On guichou day palace gates were tightened and guard rules revised.',
  ],
  s0577: [
    'On day renwu, private felling of trees at the Ming tombs was again forbidden.',
    'On renwu day cutting Ming tomb trees was again banned.',
  ],
  s0578: [
    'On day yiyou, regarding an earlier doubtful case at Jiangning, Lin Shu and Xue Yunsheng were sent to investigate.',
    'On yiyou day Lin Shu and Xue Yunsheng were sent to review the Jiangning case.',
  ],
  s0579: [
    'By now the inquiry was complete; commissioner Hu Jinzhuan was sentenced to decapitation for torture.',
    'The case was settled and Hu Jinzhuan was beheaded for cruel torture.',
  ],
  s0580: [
    'Frontier officials were instructed to examine major cases carefully and not allow wrongful conviction or excess punishment.',
    'Regional governors were told to review major trials and avoid injustice.',
  ],
  s0581: [
    'Third month, day yiwei: Left Vice Censor-in-Chief Chen Lanbin was assigned to serve in the Zongli Yamen.',
    'Month 3, yiwei: Chen Lanbin was posted to the Zongli Yamen.',
  ],
  s0582: [
    'On day gengxu, Li Hongzhang entered mourning for his mother; he repeatedly memorialized to observe full mourning and was permitted;',
    'On gengxu day Li Hongzhang mourned his mother and was allowed full bereavement leave;',
  ],
  s0583: [
    'he was ordered that after one hundred days he would station at Tianjin to drill troops and still act in charge of commercial affairs.',
    'after 100 days he would train troops at Tianjin and still handle trade affairs.',
  ],
  s0584: [
    'On day xinhai, France and Vietnam went to war; Li Hongzhang, Zuo Zongtang, Zhang Shusheng, and Liu Changyou were instructed to prepare frontier defenses.',
    'On xinhai day war broke out between France and Vietnam and four ministers were told to ready the borders.',
  ],
  s0585: [
    'On day yimao, coastal forts at Zhejiang\'s harbors were built.',
    'On yimao day Zhejiang harbor batteries were constructed.',
  ],
  s0586: [
    'That month, the Russians returned Yili to China.',
    'That month Russia returned Yili.',
  ],
  s0587: [
    'That spring, grain arrears at Yangqu, quota taxes at Dacheng, and years of arrears were remitted.',
    'That spring Yangqu grain arrears, Dacheng quotas, and long tax debts were forgiven.',
  ],
  s0588: [
    'Fourth month of summer, day bingchen new moon: waste-land grain taxes in Shanxi were permanently remitted.',
    'Summer month 4, bingchen new moon: Shanxi waste land grain tax was forever abolished.',
  ],
  s0589: [
    'On day wuwu, Shaanxi\'s tax arrears from prior years were remitted.',
    'On wuwu day Shaanxi\'s old tax arrears were forgiven.',
  ],
  s0590: [
    'On day jisi, French troops entered Tonkin in Vietnam.',
    'On jisi day French forces entered Vietnamese Tonkin.',
  ],
  s0591: [
    'Zeng Guoquan was recalled to act as governor-general of the Two Guangs.',
    'Zeng Guoquan was reappointed acting governor-general of Liangguang.',
  ],
  s0592: [
    'On day jiaxu, Quan Qing died.',
    'On jiaxu day Quan Qing died.',
  ],
  s0593: [
    'On day jiashen, Korea requested to station envoys in the capital; this was not permitted, only trade at already opened ports.',
    'On jiashen day Korea\'s request for resident envoys in Beijing was denied; only open-port trade was allowed.',
  ],
  s0594: [
    'Fifth month, day bingxu new moon: Jin Shun was instructed to plan Yili; Chang Shun would survey the northwest boundary and Shakushirinjab the southwest.',
    'Month 5, bingxu new moon: Jin Shun planned Yili while Chang Shun and Shakushirinjab demarcated borders.',
  ],
  s0595: [
    'On day wuzi, wind disaster relief at Tingzhou.',
    'On wuzi day Tingzhou wind damage victims received aid.',
  ],
  s0596: [
    'On day renchen, Liu Changyou was summoned to the capital; Cen Yuying acted as Yunnan-Guizhou governor-general.',
    'On renchen day Liu Changyou was recalled and Cen Yuying acted in Yunnan-Guizhou.',
  ],
  s0597: [
    'On day yisi, the Jilin circuit intendancy was first established.',
    'On yisi day Jilin\'s circuit intendancy was created.',
  ],
  s0598: [
    'On day gengxu, locusts struck Zhili.',
    'On gengxu day locusts ravaged Zhili.',
  ],
  s0599: [
    'Sixth month, day dingsi: Hanlin Academy reader Wenshaotang memorialized that affairs were difficult and asked the empress dowager to work diligently at government.',
    'Month 6, dingsi: Wenshaotang urged the empress dowager to govern energetically amid hard times.',
  ],
  s0600: [
    'An edict rebuked him, citing that the empress dowager had not yet recovered.',
    'He was rebuked because the empress dowager was still unwell.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_023_b06.mjs <translation.json>'
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
