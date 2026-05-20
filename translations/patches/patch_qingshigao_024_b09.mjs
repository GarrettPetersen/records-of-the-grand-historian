#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0801: [
    'On dingwei day, an edict ordered discussion of reform; Grand Councilors, Grand Secretaries, the Six Ministries, the Nine Chief Courts, envoys abroad, and provincial governors-general and governors were to weigh Chinese and Western policy essentials and report items in turn.',
    'On dingwei day, reform was ordered debated; top ministers and provincial leaders were to weigh East and West and report.',
  ],
  s0802: [
    'On gengxu day, an edict told officials at all levels in the provinces to protect foreigners; violators would be severely punished.',
    'On gengxu day, provinces were told to protect foreigners; violators faced heavy punishment.',
  ],
  s0803: [
    'A strict ban on forming anti-Christian societies was proclaimed; offenders faced capital trial.',
    'Anti-Christian societies were strictly banned; offenders faced death.',
  ],
  s0804: [
    'On renzi day, Left Censor-in-Chief Zhang Baixi was appointed envoy plenipotentiary to Britain.',
    'On renzi day, Zhang Baixi was made envoy to Britain.',
  ],
  s0805: [
    'On jiayin day, Beijing ministers still in the capital reported that theft was rampant and asked to use severe law temporarily; this was granted.',
    'On jiayin day, capital ministers won permission to use harsh law against rampant theft.',
  ],
  s0806: [
    'On gengshen day, Compiler Zhang Peilun was rewarded and ordered to assist Li Hongzhang in negotiations.',
    'On gengshen day, Zhang Peilun was rewarded and sent to help Li Hongzhang negotiate.',
  ],
  s0807: [
    'On renxu day, an edict restored the offices of unjustly condemned ministers Lishan, Xu Yongyi, Xu Jingcheng, Lian Yuan, and Yuan Chang.',
    'On renxu day, wrongly condemned ministers Lishan, Xu Yongyi, Xu Jingcheng, Lian Yuan, and Yuan Chang were restored.',
  ],
  s0808: [
    'The crimes were again weighed of ministers who let bandits run wild and thereby began the calamity; Zailuan was stripped of title and office and, with Zaiyi, was banished to Xinjiang under guard.',
    'Ministers who unleashed bandits were punished again; Zailuan lost rank and he and Zaiyi were banished to Xinjiang.',
  ],
  s0809: [
    'Gangyi was stripped of office.',
    'Gangyi was dismissed.',
  ],
  s0810: [
    'Yingnian and Zhao Shuqiao were both stripped of office and sentenced to decapitation.',
    'Yingnian and Zhao Shuqiao were dismissed and sentenced to beheading.',
  ],
  s0811: [
    'Posthumously stripped were Xu Tong and Li Bingheng.',
    'Xu Tong and Li Bingheng were posthumously dismissed.',
  ],
  s0812: [
    'Qixiu and Xu Chengyu were stripped of office pending investigation.',
    'Qixiu and Xu Chengyu were dismissed pending trial.',
  ],
  s0813: [
    'Dong Fuxiang was stripped of office and relieved of his post.',
    'Dong Fuxiang was dismissed and removed from command.',
  ],
  s0814: [
    'On guihai day, an edict of self-reproach was issued.',
    'On guihai day, the throne issued a self-blame edict.',
  ],
  s0815: [
    'The painful expedients of the time were shown to all under Heaven.',
    'The court explained its painful compromises to the empire.',
  ],
  s0816: [
    'All officials at home and abroad were also admonished to stir up loyalty, cast off private aims, break accumulated habits, and strive to revive affairs.',
    'Officials were urged to serve loyally, drop private aims, break old habits, and revive the state.',
  ],
  s0817: [
    'In the twenty-seventh year, xinchou, the court was at Xi\'an.',
    'In year 27, xinchou, the court remained at Xi\'an.',
  ],
  s0818: [
    'First month, new moon day wuchen: to relieve military disaster in Zhili, the sale of substantive offices by contribution was opened.',
    'Month 1, new moon wuchen, substantive offices were sold by contribution to aid Zhili.',
  ],
  s0819: [
    'Tribute of sea-dragon and other pelts from Duolunuo\'er was abolished.',
    'Duolunuo\'er tribute pelts were abolished.',
  ],
  s0820: [
    'On gengwu day, Zaiqun was granted suicide.',
    'On gengwu day, Zaiqun was allowed to kill himself.',
  ],
  s0821: [
    'On xinwei day, Yuxian was executed.',
    'On xinwei day, Yuxian was put to death.',
  ],
  s0822: [
    'On guiyou day, Yingnian and Zhao Shuqiao were both granted suicide.',
    'On guiyou day, Yingnian and Zhao Shuqiao were allowed suicide.',
  ],
  s0823: [
    'Gangyi, Xu Tong, and Li Bingheng were all sentenced to decapitation, waived because they had died earlier.',
    'Gangyi, Xu Tong, and Li Bingheng were sentenced to beheading but spared as already dead.',
  ],
  s0824: [
    'On yihai day, Qixiu and Xu Chengyu were executed.',
    'On yihai day, Qixiu and Xu Chengyu were put to death.',
  ],
  s0825: [
    'On gengchen day, grain tax on abandoned land in Renhe and other counties was remitted.',
    'On gengchen day, tax on abandoned land in Renhe and elsewhere was remitted.',
  ],
  s0826: [
    'On xinsi day, the Xinhui tribute of oranges was remitted.',
    'On xinsi day, Xinhui orange tribute was abolished.',
  ],
  s0827: [
    'Second month, day jihai: one million taels from the ministry treasury were allocated for Shanxi famine relief.',
    'Month 2, jihai, one million taels were sent for Shanxi famine relief.',
  ],
  s0828: [
    'On renzi day, Guangdong section member Li Guokang and others presented local products and received promotions of varying degree.',
    'On renzi day, Li Guokang and others presented Guangdong products and were promoted.',
  ],
  s0829: [
    'Third month, day wuchen: grain tax along the imperial route and at disaster counties such as Xianning in Shaanxi was remitted.',
    'Month 3, wuchen, grain tax along the route and at disaster counties was remitted.',
  ],
  s0830: [
    'On jisi day, an edict established the Office for Government Affairs; Yi Kuang, Li Hongzhang, Ronglu, Kungang, Wang Wenshao, and Lu Chuanlin were supervising ministers, with Liu Kunyi and Zhang Zhidong as distant associate planners.',
    'On jisi day, the Government Affairs Office was set up under Yi Kuang, Li Hongzhang, Ronglu, and others, with Liu Kunyi and Zhang Zhidong advising from afar.',
  ],
  s0831: [
    'On jiaxu day, overdue grain tax in Lin\'an and elsewhere in Yunnan was remitted.',
    'On jiaxu day, overdue Yunnan grain tax was remitted.',
  ],
  s0832: [
    'On dingchou day, the crimes of inadequate protection in Boxer anti-Christian violence were weighed; deceased Governor-General Yulu and Tibetan Commissioner Qingshan were posthumously stripped of original rank; Zhejiang Governor Liu Shutang was stripped of office; Provincial Administration Commissioner Rongquan and Vice Censor-in-Chief Jin Chang were stripped and banished to the farthest frontier; Circuit Intendant Zheng Wenqin, Magistrate Bai Chang, and Commander Zhou Zhide were all executed; others were stripped or demoted in varying degrees.',
    'On dingchou day, officials who failed to stop Boxer violence were punished; Yulu and Qingshan were posthumously demoted, Liu Shutang dismissed, several executed or banished, and others demoted.',
  ],
  s0833: [
    'Fifty thousand shi of Shandong tribute grain were allocated to relieve disaster victims in Zhili.',
    'Fifty thousand shi of Shandong grain were sent to relieve Zhili.',
  ],
  s0834: [
    'On renwu day, an edict remitted the suspension of appointments and deduction of seniority for bureau officials who had come from Beijing.',
    'On renwu day, Beijing officials at the traveling court regained appointment and seniority credit.',
  ],
  s0835: [
    'Summer, fourth month, day dingyou: princes, nobles, and officials in the capital received half salary; banner Green Standard troops received one month\'s grain pay.',
    'Month 4, dingyou, capital nobles and officials got half pay and troops one month\'s grain.',
  ],
  s0836: [
    'On xinchou day, Ma Yugun was ordered to suppress remaining bandits near the capital; Qu Hongji was placed above Grand Councilors for study and attachment.',
    'On xinchou day, Ma Yugun was sent against capital bandits; Qu Hongji joined the Grand Council for training.',
  ],
  s0837: [
    'On dingwei day, Qu Hongji was ordered additionally to serve as minister of the Government Affairs Office.',
    'On dingwei day, Qu Hongji was also made a Government Affairs minister.',
  ],
  s0838: [
    'On jiyou day, drought disaster in Zhili was relieved.',
    'On jiyou day, Zhili drought victims were relieved.',
  ],
  s0839: [
    'On renzi day, an edict opened a special economic examination; officials at home and abroad were to recommend qualified candidates.',
    'On renzi day, a special economics exam was opened and officials were told to recommend candidates.',
  ],
  s0840: [
    'Routine tribute from the provinces was remitted, except tea, medicine, and ritual offerings; all food tribute was abolished.',
    'Provincial tribute was cut except tea, medicine, and ritual goods; food tribute ended.',
  ],
  s0841: [
    'On guichou day, Zaifeng was appointed envoy plenipotentiary to Germany.',
    'On guichou day, Zaifeng was made envoy to Germany.',
  ],
  s0842: [
    'On gengshen day, an edict followed the allied powers\' agreement to suspend examinations for five years in Shuntian, Fengtian, Heilongjiang, Zhili, Shanxi, Henan, Shaanxi, Zhejiang, Jiangxi, and Hunan.',
    'On gengshen day, exams were halted five years in ten provinces per allied agreement.',
  ],
  s0843: [
    'On renxu day, Zhang Baixi and others were ordered to repair the imperial route to the capital.',
    'On renxu day, Zhang Baixi and others were told to repair the return route.',
  ],
  s0844: [
    'On guihai day, this year\'s tribute from Jilin was suspended.',
    'On guihai day, Jilin tribute for the year was stopped.',
  ],
  s0845: [
    'Fifth month, day yichou: Natong was appointed envoy plenipotentiary to Japan.',
    'Month 5, yichou, Natong was made envoy to Japan.',
  ],
  s0846: [
    'Shanxi\'s regular and special provincial examinations for this year were postponed.',
    'Shanxi provincial exams for the year were postponed.',
  ],
  s0847: [
    'On guiwei day, Circuit Intendant Cai Jun was granted fourth-rank Beijing post and appointed envoy to Japan.',
    'On guiwei day, Cai Jun was promoted and sent as envoy to Japan.',
  ],
  s0848: [
    'On jiawu day, disaster at Mo\'ergen and elsewhere was relieved.',
    'On jiawu day, Mo\'ergen disaster victims were relieved.',
  ],
  s0849: [
    'Sixth month, day bingshen: Vice Censor-in-Chief Yinchang was appointed envoy to Germany and soon also minister to Holland.',
    'Month 6, bingshen, Yinchang was sent to Germany and soon also to Holland.',
  ],
  s0850: [
    'Prefect Xu Taishun was promoted to circuit intendant and appointed envoy to Korea.',
    'Xu Taishun was promoted and made envoy to Korea.',
  ],
  s0851: [
    'On gengzi day, the longevity festival; court congratulations and banquets were suspended.',
    'On gengzi day, the longevity festival passed without court banquets.',
  ],
  s0852: [
    'On guimao day, an edict established the Ministry of Foreign Affairs, refashioned from the Zongli Yamen; Yi Kuang was made minister; Wang Wenshao associate minister; Qu Hongji minister and associate; Xu Shoupeng and Lian Fang vice ministers.',
    'On guimao day, the Zongli Yamen became the Foreign Ministry under Yi Kuang, Wang Wenshao, Qu Hongji, and two vice ministers.',
  ],
  s0853: [
    'On gengxu day, the allied armies left Beijing.',
    'On gengxu day, allied troops left Beijing.',
  ],
  s0854: [
    'On renzi day, fifty thousand taels from the inner treasury were sent for Jiangxi famine relief.',
    'On renzi day, fifty thousand taels were sent for Jiangxi famine relief.',
  ],
  s0855: [
    'Fire disaster at Qixia was relieved.',
    'Qixia fire victims were relieved.',
  ],
  s0856: [
    'Autumn, seventh month, new moon day jiazi: Deng Zeng was ordered to command all escort forces.',
    'Month 7, new moon jiazi, Deng Zeng took command of the escort armies.',
  ],
  s0857: [
    'Land tax along the imperial route in Shaanxi, Henan, and Zhili was remitted.',
    'Land tax along the route in Shaanxi, Henan, and Zhili was remitted.',
  ],
  s0858: [
    'On yichou day, an edict removed accumulated abuses in grain transport; river and sea transport were both changed to cash levies, with grain purchased and stored in capital granaries.',
    'On yichou day, grain transport abuses were cut; river and sea dues became cash and grain was bought for capital stores.',
  ],
  s0859: [
    'Shiduo left the Grand Council.',
    'Shiduo left the Grand Council.',
  ],
  s0860: [
    'On jisi day, the river broke at Zhangqiu and Huimin.',
    'On jisi day, the Yellow River broke at Zhangqiu and Huimin.',
  ],
  s0861: [
    'On jimao day, an edict reformed the examination system from the next year: eight-legged essays and copying were abolished; candidates were tested on classics, current affairs, and policy questions; military examinations were suspended.',
    'On jimao day, exams were reformed next year: eight-legged essays ended, policy questions added, and military exams halted.',
  ],
  s0862: [
    'Luo Fenglu was granted third-rank Beijing post and appointed envoy to Russia.',
    'Luo Fenglu was promoted and made envoy to Russia.',
  ],
  s0863: [
    'On wuzi day, plenipotentiaries Yi Kuang and Li Hongzhang and ministers of eleven states completed a twelve-article treaty.',
    'On wuzi day, Yi Kuang and Li Hongzhang finished a twelve-article treaty with eleven powers.',
  ],
  s0864: [
    'On jichou day, Shaanxi provincial examinations were postponed to the next year.',
    'On jichou day, Shaanxi provincial exams were moved to next year.',
  ],
  s0865: [
    'On renchen day, an edict permanently abolished the sale of substantive offices by contribution.',
    'On renchen day, sale of offices by contribution was ended for good.',
  ],
  s0866: [
    'Provinces were ordered to establish military training academies.',
    'Provinces were told to build military academies.',
  ],
  s0867: [
    'On guisi day, provinces were ordered to cut troops and train standing, reserve, and police forces.',
    'On guisi day, provinces were told to cut old troops and train standing, reserve, and police forces.',
  ],
  s0868: [
    'Eighth month, new moon day jiawu: with return to the capital near, officials were sent to sacrifice at the Western and Central Sacred Peaks.',
    'Month 8, new moon jiawu, officials were sent to sacrifice at the Western and Central peaks before return.',
  ],
  s0869: [
    'Famous mountains and rivers, ancient imperial tombs, and shrines to former sages and worthy ministers along the route were also to receive sacrifices by officials sent by border governors.',
    'Mountains, rivers, tombs, and sage shrines along the route were also to receive local sacrifices.',
  ],
  s0870: [
    'On yimao day, an edict ordered provinces to establish schools.',
    'On yimao day, provinces were ordered to open schools.',
  ],
  s0871: [
    'On wushen day, memorial reports at inner and outer offices were abolished; except congratulatory memorials, all were changed to memorials.',
    'On wushen day, routine memorial reports were ended; only congratulations stayed, all else became memorials.',
  ],
  s0872: [
    'On renzi day, Sheng Xuanhuai was appointed minister for commercial taxes.',
    'On renzi day, Sheng Xuanhuai was made commercial tax minister.',
  ],
  s0873: [
    'On guichou day, an edict showed the empire the policy of reform for national strength; Liu Kunyi and Zhang Zhidong\'s submitted proposals were ordered to be essential points for each governor to carry out comprehensively.',
    'On guichou day, reform for strength was proclaimed and Liu Kunyi and Zhang Zhidong\'s plans were to guide governors.',
  ],
  s0874: [
    'On dingsi day, the imperial procession left Xi\'an.',
    'On dingsi day, the court left Xi\'an.',
  ],
  s0875: [
    'On jiwei day, Sheng Yun memorialized that Lintong Magistrate Xia Liangcai had failed in provisioning and asked that he be stripped of office.',
    'On jiwei day, Sheng Yun asked dismissal of Lintong magistrate Xia Liangcai for bad provisioning.',
  ],
  s0876: [
    'The empress dowager ordered lenient deliberation.',
    'The empress dowager ordered lenient handling.',
  ],
  s0877: [
    'Sheng Yun asked punishment for himself; this was pardoned.',
    'Sheng Yun asked to be punished; he was pardoned.',
  ],
  s0878: [
    'Ninth month, day jiyou: Li Hongzhang died; posthumously made Grand Tutor and promoted one rank in the first-class marquisate.',
    'Month 9, jiyou, Li Hongzhang died and was posthumously made Grand Tutor and raised one marquis rank.',
  ],
  s0879: [
    'Wang Wenshao was ordered to act as plenipotentiary; Yuan Shikai as acting Zhili governor-general and Beiyang minister.',
    'Wang Wenshao acted as plenipotentiary; Yuan Shikai as acting Zhili governor and Beiyang chief.',
  ],
  s0880: [
    'That autumn, 150,000 taels were issued for disasters in Shaanxi and Anhui; 100,000 taels of transport funds and 60,000 shi of tribute grain were retained for Anhui and Jiangsu relief.',
    'That autumn, 150,000 taels went to Shaanxi and Anhui; 100,000 taels and 60,000 shi grain were held for Anhui and Jiangsu.',
  ],
  s0881: [
    'Floods in Hunan-Hubei, Anhui, and Yunnan and tidal disaster in Jiangsu were also relieved.',
    'Floods in several provinces and Jiangsu tidal damage were also relieved.',
  ],
  s0882: [
    'Winter, tenth month, new moon day guisi: there was a solar eclipse.',
    'Month 10, new moon guisi, a solar eclipse occurred.',
  ],
  s0883: [
    'On jiawu day, the procession reached Kaifeng.',
    'On jiawu day, the court reached Kaifeng.',
  ],
  s0884: [
    'The Huimin breach was closed.',
    'The Huimin river breach was sealed.',
  ],
  s0885: [
    'On bingshen day, Circuit Intendant Zhang Deyi was granted third-rank counselor rank and appointed envoy to Britain; soon also minister to Belgium.',
    'On bingshen day, Zhang Deyi was promoted and sent to Britain, soon also to Belgium.',
  ],
  s0886: [
    'On renyin day, the empress dowager\'s birthday; court congratulations were suspended.',
    'On renyin day, the empress dowager\'s birthday passed without court congratulations.',
  ],
  s0887: [
    'On renzi day, an empress dowager decree revoked Pujun\'s designation as heir apparent.',
    'On renzi day, Pujun was stripped of heir status.',
  ],
  s0888: [
    'On bingchen day, an edict postponed the metropolitan examination to the guimao year.',
    'On bingchen day, the metropolitan exam was moved to guimao year.',
  ],
  s0889: [
    'The next year\'s Shuntian provincial examination and the guimao metropolitan examination were temporarily moved to the Henan examination compound.',
    'Next year\'s Shuntian exam and the guimao metropolitan exam were held at the Henan compound.',
  ],
  s0890: [
    'Eleventh month, day bingzi: the late Grand Secretary Li Hongzhang was specially granted a shrine in the capital.',
    'Month 11, bingzi, Li Hongzhang was granted a capital memorial shrine.',
  ],
  s0891: [
    'On wuzi day, Yigu was ordered to supervise frontier reclamation in Shanxi.',
    'On wuzi day, Yigu was told to oversee Shanxi frontier reclamation.',
  ],
  s0892: [
    'The Zhangqiu breach was closed.',
    'The Zhangqiu river breach was sealed.',
  ],
  s0893: [
    'On gengyin day, the emperor escorted the empress dowager back from Xi\'an.',
    'On gengyin day, the emperor brought the empress dowager back from Xi\'an.',
  ],
  s0894: [
    'On xinmao day, an edict posthumously promoted the late Zhenfei, who had died for the dynasty in the palace the previous year, to Noble Consort.',
    'On xinmao day, Zhenfei, who died in the palace last year, was posthumously made Noble Consort.',
  ],
  s0895: [
    'Hanlin, Censorate, and office officials were ordered to prepare daily for audience.',
    'Hanlin, censor, and office staff were told to stand ready daily for audience.',
  ],
  s0896: [
    'Twelfth month, new moon day guisi: Wang Wenshao was again ordered to supervise railways and mines, with Qu Hongji as deputy; Yuan Shikai to supervise railways inside and outside the pass, with Hu Yifen as associate.',
    'Month 12, new moon guisi, Wang Wenshao led railways and mines with Qu Hongji; Yuan Shikai led railways with Hu Yifen.',
  ],
  s0897: [
    'On bingshen day, an edict again told officials at home and abroad to value foreign relations and settle people through teaching.',
    'On bingshen day, officials were again told to honor foreign ties and govern through education.',
  ],
  s0898: [
    'For siding with bandits and misleading the state and currying favor with powerful officials, Left Vice Censor-in-Chief He Naiying, Lecturing Academician Peng Qingli, Compiler Wang Longwen, and Prefects Lian Wenchong and Zeng Lian were stripped of office.',
    'He Naiying, Peng Qingli, Wang Longwen, Lian Wenchong, and Zeng Lian were dismissed for backing bandits and powerful patrons.',
  ],
  s0899: [
    'On dingyou day, poor people within thirty li along the imperial route were relieved.',
    'On dingyou day, poor along thirty li of the route were relieved.',
  ],
  s0900: [
    'On jihai day, Heaven was sacrificed to at the Circular Mound.',
    'On jihai day, Heaven was sacrificed to at the Circular Mound Altar.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_024_b09.mjs <translation.json>'
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
