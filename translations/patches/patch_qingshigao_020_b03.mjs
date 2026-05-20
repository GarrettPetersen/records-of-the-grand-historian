#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'On day dingsi, the Emperor returned to the capital, respectfully escorting the spirit tablets of the Chengzu Emperor Xuanzong and Empresses Xiaomu, Xiaoshen, and Xiaoquan to joint enshrinement in the Imperial Ancestral Temple, and issued an edict proclaiming grace.',
    'On dingsi, the Emperor returned to Beijing, enshrined Xuanzong and three empresses in the Ancestral Temple, and proclaimed grace.',
  ],
  s0202: [
    'On day gengshen, Zou Minghe memorialized that the entrenched bandits at Yong\'an had all fled east; Wulantai\'s pursuit went badly, and Brigade Generals Chang Rui, Chang Shou, Dong Guangjia, and Shao Heling all died.',
    'On gengshen, Zou Minghe reported Yong\'an bandits had fled east; Wulantai\'s pursuit failed and four brigade generals died.',
  ],
  s0203: [
    'By imperial rescript, Saishang\'a and others were referred to the ministries for deliberation on punishment; Cheng Yucai was ordered to dispatch troops to block in Hunan; hereditary offices were granted to the four brigade generals including Chang Rui, and temples were established.',
    'By rescript, Saishang\'a faced board review, Cheng Yucai was sent to block Hunan, the four generals received hereditary rank, and temples were built.',
  ],
  s0204: [
    'Guangzhou Vice Commander-in-Chief Wulantai died in the army; he was posthumously made Commander-in-Chief and given condolence per the killed-in-action precedent.',
    'Wulantai, Guangzhou vice commander, died in camp; he was posthumously made commander-in-chief with battle-death condolence.',
  ],
  s0205: [
    'On day bingzi, hereditary offices were granted to Guangxi Deputy Brigadier A\'erjing\'a and others who died in service.',
    'On bingzi, hereditary rank was granted to A\'erjing\'a and other Guangxi deputies who died in service.',
  ],
  s0206: [
    'On day gengchen, Grand Secretariat academician Shengbao memorialized: "The sightseeing grounds have been made entirely new.',
    'On gengchen, Shengbao memorialized: "The sightseeing grounds are entirely new.',
  ],
  s0207: [
    'The common people whisper that this tarnishes the ruler\'s virtue.',
    'Common people whisper that this harms the ruler\'s virtue.',
  ],
  s0208: [
    'The Emperor received it leniently.',
    'The Emperor received it leniently.',
  ],
  s0209: [
    'Fourth month of summer, day renwu: routine rain prayer; Heaven was sacrificed to at the Circular Mound; the Chengzu Emperor Xuanzong was respectfully associated in the offering.',
    'In summer month 4, renwu, rain was prayed at the Circular Mound with Xuanzong associated.',
  ],
  s0210: [
    'On day jiashen, metropolitan governor Wang Qingyun memorialized on Hedong salt affairs: permanently banning contract merchants could raise huge sums.',
    'On jiashen, Wang Qingyun said banning contract salt merchants could raise huge revenue.',
  ],
  s0211: [
    'The matter was referred to the ministries for deliberation and implementation.',
    'It was referred to the ministries for deliberation and implementation.',
  ],
  s0212: [
    'On day bingxu, the Emperor visited Mu Mausoleum and performed the mourning-end rites.',
    'On bingxu, the Emperor visited Mu Mausoleum and ended mourning.',
  ],
  s0213: [
    'Xu Guangjin was appointed Imperial Commissioner to take over Guangxi military affairs.',
    'Xu Guangjin became Imperial Commissioner for Guangxi military affairs.',
  ],
  s0214: [
    'On day xinmao, Cheng Yucai reported that bandit Liu Daiwei had raised trouble at Chenzhou; Battalion Commander Jilaming captured and executed him.',
    'On xinmao, Cheng Yucai reported Liu Daiwei\'s Chenzhou revolt; Jilaming captured and killed him.',
  ],
  s0215: [
    'On day guisi, Chang Dachun reported that salt smugglers had resisted arrest and killed Deputy Brigadier Zhang Hui and Magistrate Decheng; after Brigade Commander Shanlu and Prefect Bi Chengzhao sent troops to attack, over a hundred were killed or captured and the rest scattered.',
    'On guisi, Chang Dachun reported salt smugglers killed Zhang Hui and Decheng; Shanlu and Bi Chengzhao killed or captured over a hundred and the rest fled.',
  ],
  s0216: [
    'Hereditary offices were granted to Zhang Hui and Decheng.',
    'Zhang Hui and Decheng received hereditary rank.',
  ],
  s0217: [
    'Junior Vice Minister of the Court of the Imperial Stud Xu Jiyu memorialized that after mourning one should guard against three gradual declines: construction excess, ease and comfort, and blocked counsel.',
    'Xu Jiyu warned that after mourning one should guard against construction, comfort, and blocked counsel.',
  ],
  s0218: [
    'By imperial rescript: "Place this at your right hand and review it constantly.',
    'Rescript: "Place this at your right hand and review it constantly.',
  ],
  s0219: [
    '" On day jihai, the Qianlong-era added nominal-ration soldiers of over sixty-six thousand were reduced.',
    '" On jihai, over sixty-six thousand Qianlong-era added ration soldiers were cut.',
  ],
  s0220: [
    'On day gengzi, Cheng Yucai reported that Hong Xiuquan had assaulted Quanzhou and was advancing on Yongzhou, with detachments raiding Yongfu and Yining; he ordered Brigade Generals Bao Qibao and Liu Changqing to defend separately and notified Saishang\'a to block together.',
    'On gengzi, Cheng Yucai reported Hong Xiuquan took Quanzhou, advanced on Yongzhou, and raided Yongfu and Yining; Bao Qibao and Liu Changqing were ordered to defend and Saishang\'a to block.',
  ],
  s0221: [
    'On day xinchou, Tedeng\'e was dismissed and Gui Liang was made Minister of War.',
    'On xinchou, Tedeng\'e was dismissed and Gui Liang became Minister of War.',
  ],
  s0222: [
    'On day yisi, two hundred thirty-nine men including Zhang Jun were granted metropolitan graduate degrees with differing ranks.',
    'On yisi, Zhang Jun and two hundred thirty-eight others received jinshi degrees with differing ranks.',
  ],
  s0223: [
    'Qishan was banished to Jilin.',
    'Qishan was banished to Jilin.',
  ],
  s0224: [
    'On day bingwu, Zou Minghe was stripped of office for keeping troops to guard the city and not allowing pursuit.',
    'On bingwu, Zou Minghe lost office for holding troops in the city and not pursuing.',
  ],
  s0225: [
    'Lao Chongguang was made Guangxi Governor.',
    'Lao Chongguang became Guangxi governor.',
  ],
  s0226: [
    'On day jiyou, six hundred thousand piculs of tribute grain were ordered held back and split for transport to Jiangsu and Shandong for relief stores.',
    'On jiyou, six hundred thousand piculs of tribute grain were held for Jiangsu and Shandong relief.',
  ],
  s0227: [
    'Fifth month, day xinhai: Buyantai reported four hundred thousand bolts of stored Muslim cloth and requested flexible conversion collection; it was approved.',
    'In month 5, xinhai, Buyantai sought flexible tax conversion on four hundred thousand bolts of stored cloth; approved.',
  ],
  s0228: [
    'On day jiayin, summer solstice; Earth was sacrificed to at the Square Mound; the Chengzu Emperor Xuanzong was respectfully associated in the offering.',
    'On jiayin, at the solstice Earth was sacrificed at the Square Mound with Xuanzong associated.',
  ],
  s0229: [
    'On day gengshen, bandits took Daozhou in Hunan.',
    'On gengshen, bandits took Hunan\'s Daozhou.',
  ],
  s0230: [
    'Saishang\'a remained at Guilin and ordered Jiang Zhongyuan and Zhang Guoliang to move troops to Hunan.',
    'Saishang\'a stayed at Guilin and ordered Jiang Zhongyuan and Zhang Guoliang into Hunan.',
  ],
  s0231: [
    'Sixth month, day jiashen: Shandong relief affairs were investigated.',
    'In month 6, jiashen, Shandong relief was investigated.',
  ],
  s0232: [
    'Du Shoutian and Yiliang memorialized that when grain boats entered Shandong they should unload early to fund distribution.',
    'Du Shoutian and Yiliang said grain boats entering Shandong should unload early for distribution.',
  ],
  s0233: [
    'On day bingxu, Saishang\'a was ordered to Hunan to supervise military affairs; Xu Guangjin took over Guangxi.',
    'On bingxu, Saishang\'a went to Hunan and Xu Guangjin took Guangxi.',
  ],
  s0234: [
    'On day dinghai, Empress Niohuru was formally installed.',
    'On dinghai, Empress Niohuru was installed.',
  ],
  s0235: [
    'On day guisi, Sengge Rinchen impeached Imperial Presence Minister Prince Zheng Duanhua for altering Examination Reader Ba Qing\'s examination papers and refusing to desist when stopped—arrogant and obstinate, hard to work with.',
    'On guisi, Sengge Rinchen impeached Duanhua for altering Ba Qing\'s exam papers and refusing to stop—arrogant and unworkable.',
  ],
  s0236: [
    'An edict removed Duanhua from the Imperial Presence ministers; Ba Qing was stripped of office.',
    'Duanhua left the Imperial Presence ministers and Ba Qing was stripped of office.',
  ],
  s0237: [
    'On day wuxu, Huicheng was made Hedong River Conservancy Governor-General.',
    'On wuxu, Huicheng became Hedong river conservancy governor-general.',
  ],
  s0238: [
    'Seventh month of autumn, day jiwei: the eighteen factions of bandits at Luojing Ling in Guangdong were pacified; the Emperor commended it.',
    'In autumn month 7, jiwei, eighteen Luojing Ling bandit factions in Guangdong were pacified and commended.',
  ],
  s0239: [
    'Wushi commissioner Chunxi reported that Muslim bandit Tiewankuli Huozhuo had raided Wushi; government troops beat them back.',
    'Chunxi reported Tiewankuli Huozhuo raiding Wushi; troops beat them back.',
  ],
  s0240: [
    'An edict ordered the counselor-deliberator to investigate fully and report.',
    'The counselor-deliberator was told to investigate and report.',
  ],
  s0241: [
    'On day jiazi, an edict said that with military affairs unfinished and talent urgently needed, men knowing warfare were to be recommended everywhere for employment.',
    'On jiazi, edict: recommend men who know warfare everywhere for service.',
  ],
  s0242: [
    'An edict ordered the provinces to repair city walls.',
    'Provinces were ordered to repair city walls.',
  ],
  s0243: [
    'On day bingyin, Associate Grand Secretary Du Shoutian died.',
    'On bingyin, Associate Grand Secretary Du Shoutian died.',
  ],
  s0244: [
    'On day dingmao, Luo Zhaodian reported reaching Changsha and hearing that bandits from Daozhou had fled through Jianghua, Yongming, Guiyang, and Jiahe; he feared Hengzhou might fall and that the provincial capital should also be guarded in advance.',
    'On dingmao, Luo Zhaodian reached Changsha, heard bandits from Daozhou had fled through four counties, and feared for Hengzhou and the capital.',
  ],
  s0245: [
    'By imperial rescript: arrange this promptly and properly.',
    'Rescript: arrange this promptly and properly.',
  ],
  s0246: [
    'On day wuchen, Censor Yuan Jiasan impeached Prince Ding Zaiquan, Minister Hengchun, and Vice Minister Shu Yuan; repeated investigation found grounds, and each was censured; those who wrote poems on Zaiquan\'s "Shoulders at Rest" were also referred to the ministries for deliberation.',
    'On wuchen, Yuan Jiasan impeached Zaiquan, Hengchun, and Shu Yuan; all were censured and poem-writers on Zaiquan\'s picture faced board review.',
  ],
  s0247: [
    'On day gengwu, Yishan and Buyantai reported that Muslim leader Wali Khan had mustered Buruts to rush the border posts; government troops repelled them.',
    'On gengwu, Yishan and Buyantai reported Wali Khan and Buruts rushing posts; troops repelled them.',
  ],
  s0248: [
    'On day renshen, Hong Xiuquan took Chenzhou.',
    'On renshen, Hong Xiuquan took Chenzhou.',
  ],
  s0249: [
    'On day jiaxu, Chang Dachun memorialized that Yuezhou should be blocked in advance; an edict ordered Xu Guangjin to send troops there.',
    'On jiaxu, Chang Dachun said Yuezhou should be blocked; Xu Guangjin was told to send troops.',
  ],
  s0250: [
    'Lin Kui was made Minister of Punishments.',
    'Lin Kui became Minister of Punishments.',
  ],
  s0251: [
    'Eighth month, new moon on day jiamao: Xiang Rong was stripped of office for feigning illness to avoid duty and banished to Xinjiang; soon he was kept with the army to redeem himself.',
    'In month 8, jiamao new moon, Xiang Rong lost office for feigning illness, was banished to Xinjiang, then kept with the army.',
  ],
  s0252: [
    'Fuxing was made Guangxi Brigade Commander.',
    'Fuxing became Guangxi brigade commander.',
  ],
  s0253: [
    'On day guiwei, the classics lecture was first held.',
    'On guiwei, the classics lecture began.',
  ],
  s0254: [
    'On day jiashen, an edict to Huguang governors said: "Dongting Lake in Hunan and the great river in Hubei have hundreds or thousands of fishing and trading boats—they must be gathered quickly lest the bandits use them.',
    'On jiashen, Huguang governors were told: "Gather fishing and trading boats on Dongting and the great river lest bandits use them.',
  ],
  s0255: [
    'Their sailors, skilled on wind and waves, could serve as water fighters; recruit them attentively."',
    'Recruit their wind-tested sailors as water fighters."',
  ],
  s0256: [
    '" On day jichou, Luo Zhaodian and Luo Bingzhang reported that bandits had taken Anren and Youxian and were advancing on the provincial capital.',
    '" On jichou, Luo Zhaodian and Luo Bingzhang reported bandits took Anren and Youxian and advanced on the capital.',
  ],
  s0257: [
    'An edict ordered Saishang\'a to raise the siege on the capital quickly.',
    'Saishang\'a was told to lift the capital siege quickly.',
  ],
  s0258: [
    'On day gengyin, court ministers were ordered to meet and plan military funds.',
    'On gengyin, ministers were ordered to plan military funds.',
  ],
  s0259: [
    'Chang Dachun was transferred to Shanxi Governor; Luo Zhaodian was made Hubei Governor; Zhang Fei acted as Jiangxi Governor.',
    'Chang Dachun went to Shanxi, Luo Zhaodian to Hubei, and Zhang Fei acted in Jiangxi.',
  ],
  s0260: [
    'On day jiachen, grain taxes on Sichuan and Jiangxi merchants shipping rice to Hubei were temporarily waived.',
    'On jiachen, rice taxes on Sichuan and Jiangxi grain shipped to Hubei were waived.',
  ],
  s0261: [
    'A thousand Fujian and Zhejiang troops were transferred to block in Jiangxi.',
    'A thousand Fujian and Zhejiang troops went to block Jiangxi.',
  ],
  s0262: [
    'Ninth month, day jiyou: an edict said Saishang\'a had commanded without success and harmed the frontier; he was stripped of office, arrested for trial, and his property confiscated.',
    'In month 9, jiyou, Saishang\'a failed in command, was stripped, arrested, and his property seized.',
  ],
  s0263: [
    'On day xinhai, Zaiquan was made Metropolitan Barracks Commander; Ne\'erjing\'e was made Grand Secretary; Xi\'en was made Associate Grand Secretary.',
    'On xinhai, Zaiquan took the barracks, Ne\'erjing\'e became Grand Secretary, and Xi\'en associate Grand Secretary.',
  ],
  s0264: [
    'On day jiayin, the Xining Tibetan bandit Aligongzhu was captured and executed.',
    'On jiayin, Xining bandit Aligongzhu was captured and executed.',
  ],
  s0265: [
    'Luo Bingzhang was ordered to stay temporarily in Hunan to assist.',
    'Luo Bingzhang was ordered to stay in Hunan to assist.',
  ],
  s0266: [
    'On day wuwu, the Emperor visited the Eastern Tombs.',
    'On wuwu, the Emperor visited the Eastern Tombs.',
  ],
  s0267: [
    'Hereditary offices were granted to Hunan brigade generals including Fucheng who died in battle.',
    'Hereditary rank was granted to Fucheng and other Hunan generals killed in battle.',
  ],
  s0268: [
    'On day jiwei, Chang Dachun reported that the bandits would flee north and that defenses were thin.',
    'On jiwei, Chang Dachun said bandits would flee north and troops were few.',
  ],
  s0269: [
    'Xu Guangjin was ordered to send troops to Yuezhou to help defend.',
    'Xu Guangjin was ordered to send troops to Yuezhou.',
  ],
  s0270: [
    'On day dingmao, the Emperor returned to the capital.',
    'On dingmao, the Emperor returned to the capital.',
  ],
  s0271: [
    'Tenth month of winter, day xinsi: the Emperor visited late Grand Secretary Du Shoutian\'s residence to offer condolences and added his father Du Zeng the title of Minister of Rites.',
    'In winter month 10, xinsi, the Emperor condoled at Du Shoutian\'s house and gave his father Du Zeng a Rites minister title.',
  ],
  s0272: [
    'On day jiashen, Huang Zonghan requested that Zhejiang\'s new tribute grain go by sea transport; it was approved.',
    'On jiashen, Huang Zonghan\'s request for Zhejiang sea transport of new tribute grain was approved.',
  ],
  s0273: [
    'On day renchen, Ji Zhichang was dismissed and Wu Wenrong was made Fujian-Zhejiang Governor-General.',
    'On renchen, Ji Zhichang was dismissed and Wu Wenrong became Fujian-Zhejiang governor-general.',
  ],
  s0274: [
    'Eleventh month, new moon on day dingwei: solar eclipse.',
    'In month 11, dingwei new moon, there was a solar eclipse.',
  ],
  s0275: [
    'On day dingsi, bandits took Yuezhou.',
    'On dingsi, bandits took Yuezhou.',
  ],
  s0276: [
    'On day wuwu, Qishan was recalled to act as Henan Governor.',
    'On wuwu, Qishan was recalled to act as Henan governor.',
  ],
  s0277: [
    'On day xinyou, an edict ordered Xu Guangjin to split forces to defend Wuchang, Hanyang, and Jingzhou; Lu Jianying and Jiang Wenqing were each to hold key points strictly according to terrain.',
    'On xinyou, Xu Guangjin was to defend Wuchang, Hanyang, and Jingzhou; Lu Jianying and Jiang Wenqing were to hold key terrain.',
  ],
  s0278: [
    'On day guihai, as bandits neared Hubei, Qishan was ordered to guard Henan\'s border strictly; Zhang Fei was ordered to guard critical points along the river.',
    'On guihai, with bandits near Hubei, Qishan guarded Henan and Zhang Fei the river passes.',
  ],
  s0279: [
    'On day jiazi, Wenqing was made Minister of Revenue.',
    'On jiazi, Wenqing became Minister of Revenue.',
  ],
  s0280: [
    'On day guiyou, bandits took Hanyang; Lu Jianying was ordered to hurry upstream to block.',
    'On guiyou, bandits took Hanyang; Lu Jianying was sent upstream to block.',
  ],
  s0281: [
    'On day yihai, Xiang Rong\'s brigade commander title was restored.',
    'On yihai, Xiang Rong\'s brigade commander title was restored.',
  ],
  s0282: [
    'An edict ordered retired Vice Minister Zeng Guofan to supervise local militia training.',
    'Zeng Guofan was ordered to supervise home-province militia.',
  ],
  s0283: [
    'Fuzhuhonga was transferred to Jiangnan Brigade Commander.',
    'Fuzhuhonga was transferred to Jiangnan brigade commander.',
  ],
  s0284: [
    'Twelfth month, day dingchou: an edict ordered gentry in their home provinces to organize militia.',
    'In month 12, dingchou, gentry were ordered to organize home-province militia.',
  ],
  s0285: [
    'Fourth-rank capital official Shengbao was ordered to join the army in Henan.',
    'Shengbao was ordered to join the Henan army.',
  ],
  s0286: [
    'On day guisi, bandits took Wuchang; Governor Chang Dachun died there.',
    'On guisi, bandits took Wuchang and Governor Chang Dachun died.',
  ],
  s0287: [
    'The Emperor sharply rebuked military supervisors for not planning the whole field and hoarding troops for self-defense; Xu Guangjin was arrested for punishment.',
    'The Emperor rebuked commanders for narrow planning and hoarding troops; Xu Guangjin was arrested.',
  ],
  s0288: [
    'Xiang Rong was made Imperial Commissioner to supervise military affairs; Zhang Liangji acted as Huguang Governor-General.',
    'Xiang Rong became Imperial Commissioner and Zhang Liangji acted as Huguang governor-general.',
  ],
  s0289: [
    'Ye Mingchen was made Liangguang Governor-General and Bai Gui was made Guangdong Governor.',
    'Ye Mingchen became Liangguang governor-general and Bai Gui Guangdong governor.',
  ],
  s0290: [
    'On day guimao, Xiang Rong reported that bandits had taken Wuhan in succession, built a pontoon bridge, and that many gunboats must be prepared to burn the bridge before advance pursuit could proceed.',
    'On guimao, Xiang Rong said bandits held Wuhan with a pontoon bridge and gunboats were needed to burn it before pursuit.',
  ],
  s0291: [
    'By imperial rescript: "The gunboats brought by Punishments Bureau Director Lu Yingxiang fought bandits at Changsha—send them swiftly to the front."',
    'Rescript: "Send Lu Yingxiang\'s gunboats, which fought at Changsha, swiftly to the front."',
  ],
  s0292: [
    '" On day jiachen, conscripts from Jilin and Heilongjiang reached the capital.',
    '" On jiachen, Jilin and Heilongjiang conscripts reached the capital.',
  ],
  s0293: [
    'By imperial rescript: "Each batch is to start two days apart; commanders must keep discipline and must not demand extra carts or harass relay posts."',
    'Rescript: "Each batch starts two days apart; commanders must keep discipline and not harass relay posts."',
  ],
  s0294: [
    'Joint seasonal sacrifice was performed at the Imperial Ancestral Temple.',
    'Joint seasonal sacrifice was held at the Ancestral Temple.',
  ],
  s0295: [
    'That year, disaster taxes were remitted for forty-two Zhili districts and one Shanxi prefecture; Zhejiang\'s forty-eight districts had silver and grain collection deferred by degree.',
    'That year, disaster taxes were remitted in forty-two Zhili districts and one Shanxi prefecture; forty-eight Zhejiang districts had collection deferred.',
  ],
  s0296: [
    'Korea and Siam sent tribute.',
    'Korea and Siam sent tribute.',
  ],
  s0297: [
    'Third year, spring, first month, day dingwei: Qingzhou Vice Commander Changqing\'s troops were shifted to guard Henan and Huguang.',
    'In year 3, month 1, dingwei, Changqing\'s Qingzhou troops shifted to Henan and Huguang.',
  ],
  s0298: [
    'On day wushen, Zhang Liangji reported that bandit chief Xiao Chaogui had truly been blasted dead outside Changsha; the corpse was recovered, verified, and exposed.',
    'On wushen, Zhang Liangji reported Xiao Chaogui was blasted dead outside Changsha; the corpse was verified and exposed.',
  ],
  s0299: [
    'On day jiyou, Jiang Wenqing reported thin walls and few troops; militia from east and west Liangshan were moved to defend the city.',
    'On jiyou, Jiang Wenqing said walls were thin and troops few; Liangshan militia were moved to the city.',
  ],
  s0300: [
    'On day guichou, Xiang Rong reported that the entrenched bandits at Wuchang were loading cannon onto boats, intending to flee.',
    'On guichou, Xiang Rong said Wuchang bandits were loading cannon on boats to flee.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_020_b03.mjs <translation.json>'
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
