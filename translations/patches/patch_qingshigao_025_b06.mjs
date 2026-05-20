#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'On day yisi, naval commander Sa Zhenbing was ordered to command the cruiser and Yangtze fleets.',
    'On yisi day Sa Zhenbing took the cruiser and Yangtze fleets.',
  ],
  s0502: [
    'On day bingwu, commoners at Dayao county, Yunnan, rioted, entered the city, raided the prison, and killed people; government troops suppressed them and bandit chiefs Chen Wenpei and Deng Liangchen were both executed.',
    'On bingwu day Dayao, Yunnan, rioters raided the prison; troops suppressed them and chiefs Chen Wenpei and Deng Liangchen were executed.',
  ],
  s0503: [
    'On day jiyou, former Anhui governor Feng Xu was made relief commissioner for Jiangsu and Anhui.',
    'On jiyou day former Anhui governor Feng Xu became Jiangsu-Anhui relief commissioner.',
  ],
  s0504: [
    'On day renzi, the Ministry of Agriculture, Industry, and Commerce presented an edited illustrated treatise on cotton.',
    'On renzi day Agriculture presented an edited cotton treatise.',
  ],
  s0505: [
    'On day dingsi, the Advisory Council said Grand Councilors\' responsibilities were unclear and they could not assist effectively, and requested establishment of a responsible cabinet.',
    'On dingsi day the Advisory Council asked for a responsible cabinet, citing unclear Grand Council duties.',
  ],
  s0506: [
    'An edict said the court had its own balance and this was not for council members to presume upon; they were rebuked.',
    'The throne said the court held its own balance, rebuked the council for overstepping.',
  ],
  s0507: [
    'Lei Zhenchun was dismissed; Duan Qirui was ordered to act as Jiangbei commander.',
    'Lei Zhenchun left and Duan Qirui acted as Jiangbei commander.',
  ],
  s0508: [
    'On day gengshen, Chen Kuilong memorialized that the Shuntian advisory council petitioned to open parliament the next year; an edict said advance preparation was already barely manageable and how could reopening be discussed.',
    'On gengshen day Chen Kuilong reported Shuntian\'s next-year parliament petition; the throne said preparation already strained further change.',
  ],
  s0509: [
    'They were ordered sternly proclaimed and forbidden again to demand or memorialize impertinently.',
    'They were sternly told not to demand or memorialize again.',
  ],
  s0510: [
    'Sixty additional shi of granary rice for the Universal Relief and Nurture Bureau were granted monthly as a permanent allotment.',
    'The Universal Relief Bureau gained sixty shi monthly in perpetuity.',
  ],
  s0511: [
    'On day xinyou, high trial and procuratorate offices were established in each province, with directors and chiefs; Hunan\'s establishment was deferred.',
    'On xinyou day provincial high courts and procuratorates were set; Hunan\'s was deferred.',
  ],
  s0512: [
    'On day guihai, representatives of the three eastern provinces who had petitioned for parliament came to the capital and petitioned to open parliament the next year.',
    'On guihai day three eastern provinces\' parliament petitioners came to the capital.',
  ],
  s0513: [
    'The Grand Council reported.',
    'The Grand Council reported.',
  ],
  s0514: [
    'An edict ordered the Ministry of Civil Affairs and the Metropolitan Garrison to compel them to return to native place and not linger; if others came to the capital or provinces gathered in crowds, they were to be investigated and punished.',
    'Civil Affairs and the Metropolitan Garrison were told to send petitioners home and punish further gatherings.',
  ],
  s0515: [
    'On day jiazi, an edict urged the Constitutional Research Bureau to draft the preparatory checklist, and also to compile and memorialize the cabinet organization.',
    'On jiazi day the Constitutional Research Bureau was urged to draft the preparatory checklist and cabinet organization.',
  ],
  s0516: [
    'A shrine was granted to the late Grand Secretary Zhang Zhidong in Hubei province.',
    'Late Zhang Zhidong received a Hubei shrine.',
  ],
  s0517: [
    'On day yichou, Prince Qing Yikuang requested relief from Grand Councilor and concurrent Minister of Foreign Affairs; a gracious edict urged him to remain.',
    'On yichou day Yikuang asked to leave the Grand Council and Foreign Ministry; the throne urged him to stay.',
  ],
  s0518: [
    'On day jisi, the Advisory Council requested a clear edict on cutting queues and changing dress.',
    'On jisi day the Advisory Council asked for an edict on queue-cutting and dress reform.',
  ],
  s0519: [
    'Twelfth month, day renshen: an edict instructed each province to admonish schools that students must not interfere in politics or gather to make demands; violators would be severely punished.',
    'Month 12, renshen: provinces were told to forbid students\' political interference and mass demands.',
  ],
  s0520: [
    'On day bingzi, Tang Shaoyi was relieved for illness; Sheng Xuanhuai was made Postal Minister.',
    'On bingzi day Tang Shaoyi left for illness and Sheng Xuanhuai became postal minister.',
  ],
  s0521: [
    'On day dingchou, because the four right-wing banners of Chakhar Mongolia suffered disaster, ten thousand taels from the treasury were issued for relief.',
    'On dingchou day ten thousand taels went to Chakhar\'s four right-wing banners.',
  ],
  s0522: [
    'On day jimao, Zhirui requested flexible abolition of the old banner-register system.',
    'On jimao day Zhirui asked to abolish the old banner register flexibly.',
  ],
  s0523: [
    'On day xinsi, Zeng Qi was summoned to audience; Fu Qi was ordered to act as Guangzhou general.',
    'On xinsi day Zeng Qi was summoned and Fu Qi acted as Guangzhou general.',
  ],
  s0524: [
    'On day renwu, Zhao Erfen was summoned to audience.',
    'On renwu day Zhao Erfen was summoned.',
  ],
  s0525: [
    'On day guiwei, the opium ban was reaffirmed; local officials who continued cosmetic enforcement were punishable, and the ministries of civil affairs and revenue were ordered to assess them.',
    'On guiwei day the opium ban was reaffirmed and Civil Affairs and Revenue were to assess officials.',
  ],
  s0526: [
    'Each provincial governor-general was ordered, together with the Constitutional Research Bureau princes, to revise provincial official organization.',
    'Governors-general with Constitutional Research princes were to revise provincial organization.',
  ],
  s0527: [
    'On day yiyou, Suzhou and Kunshan counties in Jiangsu were merged and abolished, and trial offices were established.',
    'On yiyou day Jiangsu merged counties and set trial offices.',
  ],
  s0528: [
    'In Jiangning, Jiangning was merged into Shangyuan; in Suzhou, Changzhou and Yuanhe were merged into Wu; Jiangdu into Ganquan; Zhaowen into Changshu; Xinyang into Kunshan; Zhenze into Wujiang; Lou into Huating; Yanghu into Wujin; Jinqui into Wuxi; Jingxi into Yixing.',
    'Jiangning merged into Shangyuan, Suzhou\'s paired counties into Wu, and eight other Jiangsu county pairs were merged likewise.',
  ],
  s0529: [
    'On day dinghai, the Constitutional Research Bureau submitted a revised checklist of annual preparatory matters.',
    'On dinghai day the Constitutional Research Bureau sent a revised annual preparatory checklist.',
  ],
  s0530: [
    'Jilin naval camp clerks and soldiers were abolished.',
    'Jilin naval camp clerks and soldiers were abolished.',
  ],
  s0531: [
    'On day wuzi, Sichuan bandits seized Qianjiang county as a base; government troops drove them off and recovered the city.',
    'On wuzi day Sichuan bandits held Qianjiang; troops drove them off and recovered the city.',
  ],
  s0532: [
    'On day jichou, constitutional investigation commissioner Li Jiaju presented studies on Japanese tax and accounting systems.',
    'On jichou day Li Jiaju presented Japanese tax and accounting studies.',
  ],
  s0533: [
    'On day guisi, Sichuan bandit chief Wen Chaozhong slipped into Xianfeng county, Hubei, and was captured and executed.',
    'On guisi day Sichuan chief Wen Chaozhong was captured in Hubei Xianfeng and executed.',
  ],
  s0534: [
    'On day yiwei, Prince-rank Bordered Baron Zaizhen was made chief special envoy to congratulate the British king\'s coronation.',
    'On yiwei day Zaizhen became chief envoy to the British coronation.',
  ],
  s0535: [
    'The Advisory Council resolved the general and particular provisions of the new penal code, which was ordered promulgated.',
    'The Advisory Council\'s new penal code general and particular provisions were promulgated.',
  ],
  s0536: [
    'On day bingshen, arrears from the thirty-third year of Guangxu in sixty-four prefectures, departments, and counties including Xianning, Shaanxi, and grain, fodder, and straw in the Guangyou granary were remitted.',
    'On bingshen day sixty-four Shaanxi districts\' Guangxu 33 arrears and Guangyou granary dues were remitted.',
  ],
  s0537: [
    'On day dingyou, the Advisory Council submitted a resolved charter unifying the national treasury.',
    'On dingyou day the Advisory Council sent a unified national-treasury charter.',
  ],
  s0538: [
    'On day wuxu, the Advisory Council memorialized the resolved general budget of revenue and expenditure for the third year of Xuantong.',
    'On wuxu day the Advisory Council memorialized Xuantong 3\'s resolved budget.',
  ],
  s0539: [
    'Ting Jie died; Shaochang was made Minister of Justice.',
    'Ting Jie died and Shaochang became justice minister.',
  ],
  s0540: [
    'On day jihai, the Lanzhou circuit in Gansu was abolished and an industrial promotion circuit was established.',
    'On jihai day Gansu lost its Lanzhou circuit and gained an industrial circuit.',
  ],
  s0541: [
    'That month, on the Jianghuai plain there was famine and people ate one another.',
    'That month Jianghuai famine drove people to cannibalism.',
  ],
  s0542: [
    'Plague struck the three eastern provinces.',
    'Plague struck the three eastern provinces.',
  ],
  s0543: [
    'Xuantong year 3, xinhai, spring, first month, new moon on day gengzi: because of epidemic prevention beyond Shanhaiguan, cold weather, and blocked roads, Chen Kuilong and Xi Liang were instructed to settle workers from each province.',
    'Xuantong 3, spring 1, gengzi new moon: Chen Kuilong and Xi Liang were told to settle provincial workers beyond Shanhaiguan for epidemic prevention.',
  ],
  s0544: [
    'On day bingwu, Feng Xu memorialized on inspecting disaster conditions in Xuzhou and the Huai region.',
    'On bingwu day Feng Xu reported inspecting Xuzhou-Huai disaster.',
  ],
  s0545: [
    'On day jiyou, field and land taxes in forty departments and counties including Changzhou, Jiangsu, were remitted.',
    'On jiyou day forty Jiangsu districts\' field taxes were remitted.',
  ],
  s0546: [
    'On day gengxu, flood victims in Gaoyou, Baoying, Qinghe, Andong, Shanyang, and Funing counties, Jiangsu, were relieved.',
    'On gengxu day six Jiangsu counties\' flood victims were relieved.',
  ],
  s0547: [
    'On day jiayin, the Revenue Board submitted regulations for the national budget.',
    'On jiayin day Revenue sent up national budget regulations.',
  ],
  s0548: [
    'On day bingchen, mourning garments were laid aside.',
    'On bingchen day mourning garments were laid aside.',
  ],
  s0549: [
    'Censor Hu Sijing impeached the Constitutional Research Bureau, saying new offices must not be created recklessly and old offices must not all be abolished;',
    'Censor Hu Sijing attacked the Constitutional Research Bureau for reckless new offices and abolishing all old ones;',
  ],
  s0550: [
    'drafting should employ upright men, and promulgation should adopt public discussion.',
    'drafting needs upright men and promulgation needs public discussion.',
  ],
  s0551: [
    'his memorial was sent to the Government Affairs Office.',
    'his memorial went to the Government Affairs Office.',
  ],
  s0552: [
    'On day gengshen, Zhirui was transferred to Ili general and Guangfu to Hangzhou general.',
    'On gengshen day Zhirui became Ili general and Guangfu Hangzhou general.',
  ],
  s0553: [
    'On day yichou, corporal punishment excepting the death penalty was abolished.',
    'On yichou day corporal punishment short of death was abolished.',
  ],
  s0554: [
    'For crimes of exile and below, torture must not be used.',
    'Exile and lesser crimes could not be tortured.',
  ],
  s0555: [
    'The Ministry of Justice memorialized that the dismissed former Suiyuan garrison general Yi Gu was sentenced to death.',
    'Justice memorialized dismissed Suiyuan general Yi Gu condemned to death.',
  ],
  s0556: [
    'An edict changed this to banishment to Xinjiang to redeem guilt through service.',
    'The throne changed it to Xinjiang banishment for redeeming guilt.',
  ],
  s0557: [
    'On day yisi, Zhou Shumo was ordered to survey the Sino-Russian boundary.',
    'On yisi day Zhou Shumo surveyed the Sino-Russian boundary.',
  ],
  s0558: [
    'That month, plague struck commoners in Zhili and Shandong.',
    'That month plague struck Zhili and Shandong commoners.',
  ],
  s0559: [
    'Second month, new moon on day gengwu: a shrine was granted to the late Grand Secretary and former Hunan governor Wang Wenshao in Hunan province.',
    'Month 2, gengwu new moon: late Wang Wenshao received a Hunan shrine.',
  ],
  s0560: [
    'Feng Xu requested dredging the Sui River.',
    'Feng Xu asked to dredge the Sui River.',
  ],
  s0561: [
    'The Ministry of Civil Affairs submitted a compiled household-registration law.',
    'Civil Affairs sent up a compiled household-registration law.',
  ],
  s0562: [
    'On day renshen, an edict ordered offices in charge of epidemic prevention not to use it as a pretext for harassment, and also ordered the Ministry of Civil Affairs, the Metropolitan Garrison, and Shuntian prefecture to instruct the people in the spirit of protecting livelihood.',
    'On renshen day epidemic offices were forbidden harassment and told to protect livelihood.',
  ],
  s0563: [
    'On day yihai, the three native chieftaincies of Dege, Chunke, and Gaori in Sichuan were converted to direct administration; a northern border circuit, Dengke prefecture, Dehua and Baiyu departments, and Shiqu and Tongpu counties were established.',
    'On yihai day Sichuan\'s Dege, Chunke, and Gaori chieftains became direct rule with new circuit, prefecture, departments, and counties.',
  ],
  s0564: [
    'It was fixed that offenders to be sent to Xinjiang courier stations would instead be sent to Ba and Zang.',
    'Xinjiang courier-station convicts were instead sent to Ba and Zang.',
  ],
  s0565: [
    'On day bingzi, itemized grain and silver taxes on disaster-stricken land in three prefectures and counties including Kunming, Yunnan, were remitted.',
    'On bingzi day three Yunnan districts\' disaster land taxes were remitted.',
  ],
  s0566: [
    'On day dingchou, grain taxes and tribute rice on waste land in thirty counties including Renhe, Zhejiang, and the Hang and Yan garrisons and Qu and Yan stations were remitted.',
    'On dingchou day thirty Zhejiang waste-land taxes and garrison tribute were remitted.',
  ],
  s0567: [
    'On day wuyin, army and navy ministers and vice ministers were changed to chief and deputy commanders-in-chief; Yin Chang, Shou Xun, Zaixun, and Tan Xueheng remained in post.',
    'On wuyin day army and navy ministers became chief and deputy commanders; Yin Chang, Shou Xun, Zaixun, and Tan Xueheng stayed.',
  ],
  s0568: [
    'The British occupied Pianma.',
    'Britain occupied Pianma.',
  ],
  s0569: [
    'On day guiwei, Li Jiaju was ordered to draft lectures and present them in rotation.',
    'On guiwei day Li Jiaju was ordered to draft rotating lectures.',
  ],
  s0570: [
    'On day bingxu, the assistant resident in Tibet was abolished and left and right councillors were established.',
    'On bingxu day Tibet\'s assistant resident was abolished for left and right councillors.',
  ],
  s0571: [
    'On day dinghai, a plaque reading 「Steadfast Heart and Stalwart Resolve」 was issued to Zhejiang\'s Huixing Girls\' School.',
    'On dinghai day Zhejiang\'s Huixing Girls\' School received a 「Steadfast Heart and Stalwart Resolve」 plaque.',
  ],
  s0572: [
    'On day jichou, the Ministry of Foreign Affairs submitted regulations on conferring orders and rewards.',
    'On jichou day Foreign Affairs sent up order-and-reward regulations.',
  ],
  s0573: [
    'Revenue Vice Minister Chen Bangrui, Education Vice Minister Li Jiaju, and Civil Affairs Left Counsellor Wang Rongbao were ordered to assist in compiling the constitution.',
    'Chen Bangrui, Li Jiaju, and Wang Rongbao were ordered to assist compiling the constitution.',
  ],
  s0574: [
    'Cheng Xun was made Guangzhou general and Pu Huang Rehe governor-general.',
    'Cheng Xun became Guangzhou general and Pu Huang Rehe governor-general.',
  ],
  s0575: [
    'Prince Pulun was made Minister of Agriculture, Industry, and Commerce; Shixu was made Advisory Council president and Li Jiaju vice-president; Liu Ruoceng was made revising-law minister.',
    'Prince Pulun headed Agriculture; Shixu chaired the Advisory Council with Li Jiaju vice-chair; Liu Ruoceng revised law.',
  ],
  s0576: [
    'On day renchen, foreign merchants were forbidden to import salt.',
    'On renchen day foreign salt import was forbidden.',
  ],
  s0577: [
    'The consul at British Penang was changed to chief consul.',
    'British Penang\'s consul became chief consul.',
  ],
  s0578: [
    'Third month, day gengzi: Liu Ruiheng was made Yunnan provincial commander.',
    'Month 3, gengzi: Liu Ruiheng became Yunnan commander.',
  ],
  s0579: [
    'The inspection and guard office was abolished and an office managing Vanguard, Guard, and other camps was established; the Three-Banner Guard still came under the Interior Ministry.',
    'The inspection office was abolished for a camp-management office; Three-Banner Guard stayed under Interior.',
  ],
  s0580: [
    'The Army Ministry memorialized that Jiao Dian of the three eastern provinces survey bureau had bribed to sell secret maps and was executed.',
    'The Army Ministry reported Jiao Dian executed for selling secret survey maps.',
  ],
  s0581: [
    'On day xinchou, Chengde and Jin counties in Fengtian were abolished.',
    'On xinchou day Fengtian abolished Chengde and Jin counties.',
  ],
  s0582: [
    'On day renyin, the two regional commanders at northern Sichuan and Chongqing were abolished.',
    'On renyin day Sichuan\'s northern and Chongqing regional commanders were abolished.',
  ],
  s0583: [
    'On day guimao, six injunctions were promulgated for soldiers—utmost loyalty, observance of ritual, valor in war, esteem for faith, plain living, and regard for shame.',
    'On guimao day six soldier injunctions—loyalty, ritual, valor, faith, plain living, shame—were promulgated.',
  ],
  s0584: [
    'On day dingwei, army division, brigade, and regimental commanders including He Zonglian and Li Kuiyuan were granted deputy commander-in-chief and deputy brigade ranks in varying degrees.',
    'On dingwei day He Zonglian, Li Kuiyuan, and other commanders received graded deputy ranks.',
  ],
  s0585: [
    'On day wushen, Jilin dredged the Tumen River route to reach the sea.',
    'On wushen day Jilin opened the Tumen River to the sea.',
  ],
  s0586: [
    'On day jiyou, envoy to Italy Wu Zonglian was made special envoy to congratulate Italy\'s national founding.',
    'On jiyou day Italy envoy Wu Zonglian became special envoy to Italy\'s founding celebration.',
  ],
  s0587: [
    'On day gengxu, revolutionaries killed acting Guangzhou general Fu Qi with explosives.',
    'On gengxu day revolutionaries bombed acting Guangzhou general Fu Qi to death.',
  ],
  s0588: [
    'On day renzi, Sa Zhenbing was made deputy commander-in-chief of the navy.',
    'On renzi day Sa Zhenbing became navy deputy commander-in-chief.',
  ],
  s0589: [
    'Zhao Erfeng memorialized pacifying the Sanyan wild tribes, converting the Kongsa and Mashu native chieftaincies, and establishing direct administration.',
    'Zhao Erfeng reported pacifying Sanyan tribes and converting Kongsa and Mashu to direct rule.',
  ],
  s0590: [
    'On day jiayin, Zhang Mingqi was appointed governor-general of the two Guangs.',
    'On jiayin day Zhang Mingqi became two-Guangs governor-general.',
  ],
  s0591: [
    'On day yimao, Revenue Minister Zaize concluded a loan contract with banks of Britain, the United States, Germany, and France.',
    'On yimao day Zaize concluded a loan with British, American, German, and French banks.',
  ],
  s0592: [
    'On day bingchen, Ili General Zhirui was granted ministerial rank; all civil and military officials in Ili were placed under his command.',
    'On bingchen day Ili General Zhirui received ministerial rank and command over Ili officials.',
  ],
  s0593: [
    'Field and pond taxes for the second year of Xuantong in thirty-seven counties and garrisons including Renhe, Zhejiang, were remitted.',
    'Thirty-seven Zhejiang districts\' Xuantong 2 field taxes were remitted.',
  ],
  s0594: [
    'On day wuwu, because of disaster in Jiangsu, Anhui, and Henan, Feng Xu was ordered to join the three provinces\' governors-general in planning spring relief.',
    'On wuwu day Feng Xu joined three provinces\' governors in spring relief for Jiangsu, Anhui, and Henan.',
  ],
  s0595: [
    'On day jiwei, the Dutch opened an anti-opium congress at The Hague; envoy to Germany Liang Cheng was ordered to attend.',
    'On jiwei day Liang Cheng went to the Hague Dutch anti-opium congress.',
  ],
  s0596: [
    'Disaster among the nomadic Mongols of Zakhachin in Kobdo was relieved.',
    'Kobdo Zakhachin nomads received disaster relief.',
  ],
  s0597: [
    'On day gengshen, Xi Liang was relieved for illness; Zhao Erfen was transferred to governor-general of the three eastern provinces, made imperial commissioner, and also placed in charge of the three provinces\' generals\' affairs.',
    'On gengshen day Xi Liang left for illness; Zhao Erfen became three-eastern-province governor-general and imperial commissioner over generals.',
  ],
  s0598: [
    'The Rehe circuit judicial commissioner in Zhili received an additional title.',
    'Zhili\'s Rehe judicial commissioner gained an additional title.',
  ],
  s0599: [
    'On day xinyou, Zhao Erfeng was ordered to act as Sichuan governor and Wang Renwen was made commissioner for Sichuan-Yunnan border affairs.',
    'On xinyou day Zhao Erfeng acted as Sichuan governor and Wang Renwen took border affairs.',
  ],
  s0600: [
    'The filial conduct of the late former Zhejiang governor Nie Jigui, who died of grief for his parent, was ordered entered in the histories.',
    'Late Zhejiang governor Nie Jigui, who died mourning a parent, entered the histories.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_025_b06.mjs <translation.json>'
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
