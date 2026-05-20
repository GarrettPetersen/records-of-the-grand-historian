#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'On day yimao, Bhutan seized various places in Sikkim; Gurkhas and Tibetans grew estranged; Enlin was instructed to guard, maintain order, and guide them.',
    'On yimao, Bhutan occupied Sikkim territory; Nepal and Tibet quarreled; Enlin was told to defend, keep order, and mediate.',
  ],
  s0402: [
    'Bhutan had internal strife; Enlin was also told to explain matters and pacify.',
    'Bhutan fell into civil discord; Enlin was also ordered to explain and reassure.',
  ],
  s0403: [
    'On day dingsi, Vietnamese bandits were pacified.',
    'On dingsi, Vietnam rebels were subdued.',
  ],
  s0404: [
    'Su Fengwen was instructed to enforce border prohibitions strictly.',
    'Su Fengwen was told to tighten border bans.',
  ],
  s0405: [
    'On day guihai, disaster relief was granted in southern Zhili.',
    'On guihai, southern Zhili flood victims were relieved.',
  ],
  s0406: [
    'That year Korea, Vietnam, and Ryukyu sent tribute.',
    'That year Korea, Vietnam, and Ryukyu paid tribute.',
  ],
  s0407: [
    'Year 9, gengwu; spring, month 1, dingmao new moon: banquets were suspended.',
    'In year 9, spring month 1, dingmao new moon: court banquets were halted.',
  ],
  s0408: [
    'On day guiyou, Yunnan troops recovered Lufeng.',
    'On guiyou, Yunnan forces retook Lufeng.',
  ],
  s0409: [
    'On day jiaxu, Gansu troops defeated relief rebels at Wangjiameng.',
    'On jiaxu, Gansu forces beat rebel reinforcements at Wangjiameng.',
  ],
  s0410: [
    'On day jimao, Muslim rebels took Dingbian.',
    'On jimao, Muslim rebels seized Dingbian.',
  ],
  s0411: [
    'On day guiwei, a fire broke out at the Divine Martial Gate timber storehouse; an edict called for self-examination and reform.',
    'On guiwei, the Shenwu Gate lumber depot burned; the throne ordered reflection and reform.',
  ],
  s0412: [
    'On day gengyin, Muslim rebels took Anding.',
    'On gengyin, Muslim rebels seized Anding.',
  ],
  s0413: [
    'Shaanxi troops recovered Dingbian.',
    'Shaanxi forces retook Dingbian.',
  ],
  s0414: [
    'On day jiawu, Ma Dezhao was retained to handle Tongguan defense.',
    'On jiawu, Ma Dezhao stayed on to run Tongguan defenses.',
  ],
  s0415: [
    'Month 2, xinchou: Liu Songshan, directing suppression of Jinji Fort Muslim rebels, was killed by cannon fire.',
    'Month 2, xinchou: Liu Songshan died by cannon while leading the Jinji Fort campaign.',
  ],
  s0416: [
    'Brigade Commander Liu Jintang was awarded third-rank Qing rank and took over his army.',
    'Liu Jintang received third-rank Qing rank and succeeded to his command.',
  ],
  s0417: [
    'Because Russian officials were going to Qiqihar and Jilin on commercial affairs, Fuming\'a and Deying were told to receive them according to treaty and not make concessions.',
    'With Russian officers bound for Qiqihar and Jilin trade, Fuming\'a and Deying were told to treat them by treaty and yield nothing.',
  ],
  s0418: [
    'On day yisi, Muslim rebels scattered into Anbian and Qingjian; Shaanxi troops drove them off.',
    'On yisi, Muslim rebels split into Anbian and Qingjian; Shaanxi forces drove them out.',
  ],
  s0419: [
    'On day bingwu, they again scattered to Huamachi and Yulin; Song Qing\'s army suppressed them.',
    'On bingwu, they fled again to Huamachi and Yulin; Song Qing\'s troops chased them down.',
  ],
  s0420: [
    'On day wushen, government troops defeated rebels fleeing through Mizhi.',
    'On wushen, imperial forces beat rebels routed through Mizhi.',
  ],
  s0421: [
    'On day renzi, Li Hongzhang was ordered to go to Shaanxi to supervise military affairs.',
    'On renzi, Li Hongzhang was sent to Shaanxi to run military affairs.',
  ],
  s0422: [
    'On day jiayin, Muslim rebels fled into Tongguan and Yijun; Shaanxi troops defeated them.',
    'On jiayin, Muslim rebels slipped into Tongguan and Yijun; Shaanxi forces beat them.',
  ],
  s0423: [
    'On day bingchen, the French envoy used the mission case to threaten with troops; all frontier officials and trade commissioners were told to settle negotiations swiftly.',
    'On bingchen, France\'s envoy used the mission affair to threaten force; frontier and trade officers were told to close talks fast.',
  ],
  s0424: [
    'On day xinyou, surrendered Muslims at the various forts in Ningxia rebelled again.',
    'On xinyou, Ningxia fort Muslims who had surrendered rose again.',
  ],
  s0425: [
    'Month 3, dingmao new moon: Muslim rebels fled into the Dzungar banner; Ma Yukun defeated them.',
    'Month 3, dingmao new moon: Muslim rebels entered the Dzungar banner; Ma Yukun drove them back.',
  ],
  s0426: [
    'On day xinsi, Lei Zhengwan was stripped of office for lax defense of the gorge pass but kept with the army.',
    'On xinsi, Lei Zhengwan lost his post for weak gorge defense but remained in camp.',
  ],
  s0427: [
    'Western campaign armies were admonished against greed for merit and reckless advance.',
    'Western armies were warned not to chase glory or rush ahead rashly.',
  ],
  s0428: [
    'On day yiyou, Yunnan troops recovered Midu, Binchuan, Lichuan, and Mianning.',
    'On yiyou, Yunnan forces retook Midu, Binchuan, Lichuan, and Mianning.',
  ],
  s0429: [
    'On day xinmao, Muslim rebels harassed Qi and Feng; Li Huiwu defeated them.',
    'On xinmao, Muslim rebels raided Qi and Feng; Li Huiwu beat them off.',
  ],
  s0430: [
    'Summer, month 4, jiachen: Tan Tingxiang died.',
    'Summer, month 4, jiachen: Tan Tingxiang died.',
  ],
  s0431: [
    'Month 5, gengwu: Chongshi was ordered to Guizhou to investigate the mission case jointly with Zeng Biguang.',
    'Month 5, gengwu: Chongshi was sent to Guizhou with Zeng Biguang to handle the mission case.',
  ],
  s0432: [
    'On day guiyou, Britain was first allowed to lay telegraph lines at the coastal treaty ports.',
    'On guiyou, Britain was first permitted coastal treaty-port telegraph lines.',
  ],
  s0433: [
    'On day jiaxu, Sichuan troops aiding Guizhou took Miao stockades including Huangpiao and Baibao.',
    'On jiaxu, Sichuan relief forces in Guizhou took Huangpiao, Baibao, and other Miao forts.',
  ],
  s0434: [
    'On day gengyin, Tianjin people clashed with Catholics, burned churches, and beat the French consul to death.',
    'On gengyin, Tianjin locals fought Catholics, torched churches, and killed the French consul.',
  ],
  s0435: [
    'Zeng Guofan and Chonghou were ordered to confer on handling the matter.',
    'Zeng Guofan and Chonghou were told to negotiate a settlement.',
  ],
  s0436: [
    'On day yiwei, frontier officials were told to forbid rumor-mongering and protect treaty-trade and mission districts.',
    'On yiwei, frontier officers were told to stop seditious talk and guard trade and mission zones.',
  ],
  s0437: [
    'Li Hongzhang entered the pass to command troops and asked to transfer Guo Baochang\'s army; it was approved.',
    'Li Hongzhang crossed into Shaanxi in command and got Guo Baochang\'s force transferred.',
  ],
  s0438: [
    'Chonghou was appointed minister plenipotentiary to France.',
    'Chonghou was made envoy to France.',
  ],
  s0439: [
    'Cheng Lin was made acting treaty-port trade commissioner.',
    'Cheng Lin acted as treaty-port trade commissioner.',
  ],
  s0440: [
    'That month, overdue taxes in Anzhou and other districts of Zhili were remitted.',
    'That month, back taxes in Anzhou and other Zhili districts were forgiven.',
  ],
  s0441: [
    'Month 6, wuxu: Kuichang went to Tarbagatai to survey and fix boundaries with the Russian envoy.',
    'Month 6, wuxu: Kuichang went to Tarbagatai to demarcate borders with Russia.',
  ],
  s0442: [
    'On day renyin, Mongol troops of the Sain Noyan league failed in suppressing Muslim rebels.',
    'On renyin, Sain Noyan Mongols lost a fight against Muslim rebels.',
  ],
  s0443: [
    'On day dingwei, Yunnan troops recovered Weiyuan.',
    'On dingwei, Yunnan forces retook Weiyuan.',
  ],
  s0444: [
    'On day jiyou, Peng Yulin was ordered to the south to reorganize the Yangtze fleet with river governors.',
    'On jiyou, Peng Yulin went south to overhaul the Yangtze navy with river governors.',
  ],
  s0445: [
    'On day gengxu, Gansu troops defeated Muslim rebels at Gongchang.',
    'On gengxu, Gansu forces beat Muslim rebels at Gongchang.',
  ],
  s0446: [
    'On day yimao, the Yongding River broke its banks.',
    'On yimao, the Yongding River burst.',
  ],
  s0447: [
    'On day gengshen, for lax prevention of the people-mission clash, Tianjin prefect Zhang Guangzao and magistrate Liu Jie were stripped and sent to the Board for punishment.',
    'On gengshen, Zhang Guangzao and Liu Jie lost office for failing to stop the Tianjin clash and faced trial.',
  ],
  s0448: [
    'On day xinyou, Yunnan troops recovered Yaozhou.',
    'On xinyou, Yunnan forces retook Yaozhou.',
  ],
  s0449: [
    'On day guihai, Mao Changxi was ordered to investigate the mission case jointly with Zeng Guofan.',
    'On guihai, Mao Changxi joined Zeng Guofan to handle the mission case.',
  ],
  s0450: [
    'Zeng Guofan said: "To preserve the whole peace settlement well is the way to protect the people.',
    'Zeng Guofan wrote: "Keeping the peace intact protects the people.',
  ],
  s0451: [
    'Guarding against the unexpected is the foundation of establishing the state."',
    'Guarding against surprise is the foundation of the state."',
  ],
  s0452: [
    'An edict praised and encouraged him.',
    'The throne praised him by edict.',
  ],
  s0453: [
    'Ding Richang was ordered to Tianjin to assist in foreign affairs.',
    'Ding Richang was sent to Tianjin to help manage foreign affairs.',
  ],
  s0454: [
    'Autumn, month 7, wuchen: because Hunchun frontier affairs were heavy, vice commandant rank was added to the co-commandant post as a permanent rule.',
    'Autumn, month 7, wuchen: Hunchun\'s heavy frontier duties won the co-commandant a permanent vice commandant rank.',
  ],
  s0455: [
    'On day bingzi, French envoy Rochechouart returned to the capital because Zeng Guofan would not allow prefectural and county officials to be executed in atonement.',
    'On bingzi, Rochechouart left because Zeng Guofan refused to execute prefects and magistrates in atonement.',
  ],
  s0456: [
    'Guofan was told to arrest the original culprits swiftly and conclude the case.',
    'Guofan was told to seize the real killers and close the case quickly.',
  ],
  s0457: [
    'On day dingchou, Chonghou was recalled.',
    'On dingchou, Chonghou was called back.',
  ],
  s0458: [
    'Mao Changxi was made acting treaty-port trade commissioner.',
    'Mao Changxi acted as treaty-port trade commissioner.',
  ],
  s0459: [
    'On day jiashen, Zhou Shengchuan and others dispersed the remaining rebels in the northern hills.',
    'On jiashen, Zhou Shengchuan broke up the last northern-hill rebels.',
  ],
  s0460: [
    'On day bingxu, an edict said: "Coastal fleets differ entirely from river fleets.',
    'On bingxu, an edict said: "Sea fleets are wholly unlike river fleets.',
  ],
  s0461: [
    'To resist foreign insult and seek strength, twenty years are needed before results come easily.',
    'Beating foreign pressure and building strength needs twenty years before results show.',
  ],
  s0462: [
    'Yet if one shrinks from acting because affairs are grave, there will never be a day of strength.',
    'Yet shrinking from hard tasks means strength will never come.',
  ],
  s0463: [
    'In recent years, officials at court and in the provinces panic when crises come.',
    'Lately court and provincial officials only panic in emergencies.',
  ],
  s0464: [
    'When troubles ease slightly, they plan only for temporary peace.',
    'When danger fades, they settle for easy peace.',
  ],
  s0465: [
    'Even battle-and-defense rules are made but not enforced, so court deliberations become empty paper.',
    'Battle rules are drafted but not enforced, so court plans stay on paper.',
  ],
  s0466: [
    'Deep habits of delay—how can anxious worry be dispelled?',
    'Old habits of delay—how can the throne\'s worry lift?',
  ],
  s0467: [
    'Now Fuzhou and Shanghai shipyards have launched steamers; Ma Xinyi, Ding Richang, Ying Gui, and Shen Baozhen will each choose commanders to go to sea and train year-round against contingencies.',
    'Fuzhou and Shanghai yards have launched steamers; Ma Xinyi, Ding Richang, Ying Gui, and Shen Baozhen must pick sea commanders for year-round drill.',
  ],
  s0468: [
    'Guangdong should also prepare steamers; Ruilin and Li Futai must handle this earnestly.',
    'Guangdong must ready steamers too; Ruilin and Li Futai are to act in earnest.',
  ],
  s0469: [
    'Officers skilled in winds, waves, and shoals should be recommended at any time; even men from remote hills who excel at sea fighting should be sought and promoted by talent.',
    'Recommend officers who know winds, tides, and shoals; even hill men skilled at sea war should be found and promoted.',
  ],
  s0470: [
    'All governors-general and governors must coordinate the whole and fulfill their charge."',
    'Every governor-general and governor must plan the whole and meet this charge."',
  ],
  s0471: [
    'On day gengyin, southern-route Gansu troops recovered Weiyuan and Didao.',
    'On gengyin, southern Gansu forces retook Weiyuan and Didao.',
  ],
  s0472: [
    'That month, overdue taxes in Huangzhou disturbed by rebels were remitted.',
    'That month, Huangzhou back taxes lost to rebel raids were forgiven.',
  ],
  s0473: [
    'Month 8, dingyou: Zhang Wenxiang of Ruyang assassinated Ma Xinyi.',
    'Month 8, dingyou: Ruyang\'s Zhang Wenxiang killed Ma Xinyi.',
  ],
  s0474: [
    'Zeng Guofan was made Liangjiang governor-general; Li Hongzhang was transferred to Zhili governor-general; Li Hanzhang became Huguang governor-general.',
    'Zeng Guofan took Liangjiang; Li Hongzhang moved to Zhili; Li Hanzhang became Huguang governor-general.',
  ],
  s0475: [
    'On day wuxu, a Yellow River naval force was established.',
    'On wuxu, a Yellow River flotilla was set up.',
  ],
  s0476: [
    'On day gengzi, northern-hills rebel leader Li Fanjue was executed.',
    'On gengzi, northern-hill chief Li Fanjue was put to death.',
  ],
  s0477: [
    'On day renyin, Zhang Zhiwan was ordered to interrogate Zhang Wenxiang jointly with Kui Yu.',
    'On renyin, Zhang Zhiwan and Kui Yu were to try Zhang Wenxiang.',
  ],
  s0478: [
    'On day jiyou, Mao Changxi was recalled.',
    'On jiyou, Mao Changxi was called back.',
  ],
  s0479: [
    'Li Hongzhang was ordered to investigate the Tianjin mission case with Zeng Guofan.',
    'Li Hongzhang joined Zeng Guofan to handle the Tianjin mission case.',
  ],
  s0480: [
    'On day guichou, Guangxi troops pacified bandits in Ping\'an and Heyang; Liang Tianxi was executed.',
    'On guichou, Guangxi forces cleared Ping\'an and Heyang bandits; Liang Tianxi was executed.',
  ],
  s0481: [
    'Vietnam was allowed to present local products and tame elephants.',
    'Vietnam could send local goods and trained elephants.',
  ],
  s0482: [
    'On day jiwei, Li Chengmou was appointed commander of the newly established steamer fleet.',
    'On jiwei, Li Chengmou commanded the new steamer fleet.',
  ],
  s0483: [
    'Month 9, wuchen: Yunnan troops recovered Xinxing.',
    'Month 9, wuchen: Yunnan forces retook Xinxing.',
  ],
  s0484: [
    'On day gengwu, Chongshi was told to proceed to Zunyi to handle the mission case.',
    'On gengwu, Chongshi was told to go to Zunyi for the mission case.',
  ],
  s0485: [
    'On day jiaxu, penalties for the Tianjin people-mission clash were imposed: Zhang Guangzao and Liu Jie were banished; fifteen men who murdered were executed.',
    'On jiaxu, the Tianjin clash was judged: Zhang Guangzao and Liu Jie were exiled; fifteen killers were executed.',
  ],
  s0486: [
    'That autumn, eastern Sichuan, Jingzhou, and Rehe suffered floods and were relieved.',
    'That fall, eastern Sichuan, Jingzhou, and Rehe were flooded and relieved.',
  ],
  s0487: [
    'Winter, month 10, yiwei: Shen Baozhen entered mourning; after a hundred days he was to resume managing the shipyard.',
    'Winter, month 10, yiwei: Shen Baozhen mourned his father; after a hundred days he would return to the shipyard.',
  ],
  s0488: [
    'On day bingshen, Liu Mingchuan was ordered to supervise Shaanxi military affairs.',
    'On bingshen, Liu Mingchuan was put in charge of Shaanxi military affairs.',
  ],
  s0489: [
    'Sichuan prefectures and counties were strictly forbidden excess levies.',
    'Sichuan officials were strictly barred from harsh extra levies.',
  ],
  s0490: [
    'Funds were allocated for further relief of northern-hills refugees.',
    'More funds went to relieve northern-hill refugees.',
  ],
  s0491: [
    'On day xinchou, because Jiangbei grain boats were grounded in shallows, transport to Linqing went by land.',
    'On xinchou, shallow water blocked Jiangbei grain boats, so grain moved overland to Linqing.',
  ],
  s0492: [
    'On day jiachen, the Tianjin Arsenal was completed.',
    'On jiachen, the Tianjin Arsenal was finished.',
  ],
  s0493: [
    'On day gengxu, Japan asked for a treaty and trade; the Zongli Yamen was allowed to choose officers to negotiate.',
    'On gengxu, Japan sought treaty trade; the Zongli Yamen could pick negotiators.',
  ],
  s0494: [
    'On day xinhai, Kobdo\'s tribute sable was remitted.',
    'On xinhai, Kobdo\'s sable tribute was waived.',
  ],
  s0495: [
    'On day renzi, the treaty-port trade commissioner post was abolished; the Zhili governor-general was to manage it like the Nanyang commissioner, with imperial commissioner seal.',
    'On renzi, the treaty-port commissioner was cut; Zhili\'s governor-general took the role with an imperial seal, as in the south.',
  ],
  s0496: [
    'Frontier officials were sternly warned to conduct negotiations secretly; leaks would mean immediate execution.',
    'Frontier officers were warned to keep talks secret; leakers would be executed at once.',
  ],
  s0497: [
    'On day bingchen, because floods and drought came in succession, an edict called for self-examination.',
    'On bingchen, repeated flood and drought brought an edict of reflection.',
  ],
  s0498: [
    'On day wuwu, Zhou Shengchuan\'s army was moved to guard the capital region.',
    'On wuwu, Zhou Shengchuan\'s troops were shifted to guard the capital approaches.',
  ],
  s0499: [
    'Shaanxi Muslims Yu Shengyan and others fled into Pingfan; government troops were defeated and Regional Commander Zhang Wanmei and others died.',
    'Yu Shengyan\'s Shaanxi Muslims entered Pingfan; imperial troops lost and Commander Zhang Wanmei and others fell.',
  ],
  s0500: [
    'On day gengshen, the Zhili Tianjin Maritime Customs circuit was established.',
    'On gengshen, the Zhili Tianjin Maritime Customs post was created.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_022_b05.mjs <translation.json>'
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
