#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0801: [
    'Political Consultative Assembly President and Grand Secretary Shiro was excused on grounds of illness; Li Jiaju replaced him, with Dashou as vice-president.',
    'Assembly President Shiro quit for illness; Li Jiaju replaced him with Dashou as deputy.',
  ],
  s0802: [
    'Gui Chun returned to grain transport vice minister; Zhao Bingjun acted as Minister of Civil Affairs.',
    'Gui Chun went back to grain transport and Zhao Bingjun acted for civil affairs.',
  ],
  s0803: [
    'Hunan Governor Yu Chengge was stripped of office but still temporarily managed Hunan affairs.',
    'Yu Chengge lost Hunan governorship but still acted there.',
  ],
  s0804: [
    'Shanxi\'s new army mutinied; Governor Lu Zhongqi died.',
    'Shanxi mutinied and Governor Lu Zhongqi was killed.',
  ],
  s0805: [
    'Yunnan\'s new army mutinied; Governor Li Jingxi fled; Provincial Treasurer Shizeng, Brigade Commander Zhong Lintong, Acting Daotai Wang Zhenji, and Transport Camp Commander Fan Zhongyue all died.',
    'Yunnan mutinied; Li Jingxi fled and Shizeng, Zhong Lintong, Wang Zhenji, and Fan Zhongyue died.',
  ],
  s0806: [
    'Tang Shouqian was ordered to direct Zhejiang militia training.',
    'Tang Shouqian took Zhejiang militia training.',
  ],
  s0807: [
    'The ban on political parties was lifted.',
    'Party bans were lifted.',
  ],
  s0808: [
    'Those punished in the 1898 coup, and those earlier suspected of political revolution, together with those coerced in this affair who returned of themselves, were all pardoned.',
    '1898 victims, revolution suspects, and coerced returners were all pardoned.',
  ],
  s0809: [
    'The Political Consultative Assembly stated that the Cabinet should bear responsibility, asked abolition of the present regulations, and implementation of a fully responsible cabinet system without appointment of imperial kinsmen.',
    'The assembly said the cabinet must be fully responsible, without kinsmen, under new rules.',
  ],
  s0810: [
    'An edict approved it.',
    'The court approved.',
  ],
  s0811: [
    'Shuntian sold grain at fair price.',
    'Shuntian sold grain at fair price.',
  ],
  s0812: [
    'On day jiaxu, Jiangxi\'s new army mutinied; Governor Feng Rukui fled to Jiujiang and took poison and died.',
    'On jiaxu day Jiangxi mutinied; Feng Rukui fled to Jiujiang and poisoned himself.',
  ],
  s0813: [
    'Anhui\'s new army attacked the provincial capital and was scattered.',
    'Anhui\'s new army struck the capital and was driven off.',
  ],
  s0814: [
    'On day yihai, Yuan Shikai was appointed Prime Minister of the Cabinet and ordered to organize a fully responsible cabinet.',
    'On yihai day Yuan Shikai became prime minister and was told to form a responsible cabinet.',
  ],
  s0815: [
    'Prince Qing Yikuang was dismissed as Prime Minister and made president of the Privy Council.',
    'Prince Qing Yikuang left the cabinet and headed the Privy Council.',
  ],
  s0816: [
    'Natong and Xu Shichang were dismissed as Associate Prime Ministers; they and Rongqing became Privy Council advisers.',
    'Natong and Xu Shichang left the cabinet and joined Rongqing as privy advisers.',
  ],
  s0817: [
    'State Ministers Shanqi, Zou Jialai, Zaize, Tang Jingchong, Yin Chang, Zaixun, Shaochang, Pulun, Tang Shaoyi, and Shouqi were dismissed and released from ministry duties.',
    'Shanqi, Zaize, Tang Jingchong, Yin Chang, Pulun, Tang Shaoyi, Shouqi, and other state ministers were dismissed.',
  ],
  s0818: [
    'Zaitao was dismissed as staff minister; Yin Chang replaced him.',
    'Zaitao left the General Staff and Yin Chang replaced him.',
  ],
  s0819: [
    'Wei Guangtao was recalled as Huguang governor-general and ordered to go swiftly to Hubei.',
    'Wei Guangtao returned as Huguang governor-general and was rushed to Hubei.',
  ],
  s0820: [
    'All land and sea forces and Yangtze naval forces remained under Yuan Shikai\'s command and disposition.',
    'Land, sea, and Yangtze forces stayed under Yuan Shikai.',
  ],
  s0821: [
    'On day bingzi, Yuan Shikai was summoned to the capital.',
    'On bingzi day Yuan Shikai was summoned to Beijing.',
  ],
  s0822: [
    'Wang Shizhen was ordered to act as Huguang governor-general.',
    'Wang Shizhen acted as Huguang governor-general.',
  ],
  s0823: [
    'Following Zhang Shaozeng\'s memorial, the Political Consultative Assembly was ordered to draft the constitution.',
    'On Zhang Shaozeng\'s advice the assembly was told to draft the constitution.',
  ],
  s0824: [
    'On day dingchou, the Political Consultative Assembly memorialized adoption of constitutional monarchy and submitted nineteen great articles of faith.',
    'On dingchou day the assembly proposed constitutional monarchy and nineteen great articles.',
  ],
  s0825: [
    'One hundred thousand taels from the inner treasury were issued to relieve Sichuan people afflicted by war.',
    'Sichuan war victims received 100,000 inner-treasury taels.',
  ],
  s0826: [
    'On day wuyin, an edict ordered commanders of troops to proclaim to the people the court\'s intent, in renewing relations with the people, not to employ force readily.',
    'On wuyin day commanders were told the court sought renewal with the people and would not rush to arms.',
  ],
  s0827: [
    'Commanders of troops were ordered to declare discipline and forbid disturbing the people.',
    'Commanders were told to keep discipline and spare civilians.',
  ],
  s0828: [
    'Sixth Division Commander Wu Luzhen was ordered to act as Shanxi governor.',
    'Wu Luzhen of the Sixth Division acted as Shanxi governor.',
  ],
  s0829: [
    'Yuan Shikai declined the post of Prime Minister; a warm edict urged him on.',
    'Yuan Shikai tried to refuse the premiership and was warmly pressed to accept.',
  ],
  s0830: [
    'Posthumous honors were granted Shanxi Governor Lu Zhongqi, who died for the state.',
    'Martyr Shanxi Governor Lu Zhongqi was posthumously honored.',
  ],
  s0831: [
    'Guizhou declared independence, chose a governor, and Governor Shen Yuqing fled.',
    'Guizhou declared independence, chose a governor, and Shen Yuqing fled.',
  ],
  s0832: [
    'Revolutionary forces took Shanghai.',
    'Revolutionaries seized Shanghai.',
  ],
  s0833: [
    'Yuan Shikai ordered front-line armies to halt advance.',
    'Yuan Shikai halted the advance.',
  ],
  s0834: [
    'Soon Prefect Liu Chengen and First Adjutant Cai Tinggan were sent to persuade Li Yuanhong to lay down arms; they gained no clear terms and returned.',
    'Soon Liu Chengen and Cai Tinggan failed to persuade Li Yuanhong to disarm.',
  ],
  s0835: [
    'On day jimao, an edict permitted revolutionaries to form political parties under law.',
    'On jimao day revolutionaries were allowed lawful political parties.',
  ],
  s0836: [
    'The Political Consultative Assembly stated that in the Hankou campaign government troops had slaughtered the people and asked an order to cease fighting.',
    'The assembly said Hankou troops had slaughtered civilians and asked for a ceasefire.',
  ],
  s0837: [
    'Yuan Shikai was ordered to punish offending officers by law and have merchant losses compensated by the state.',
    'Yuan Shikai was told to punish officers and pay merchant losses.',
  ],
  s0838: [
    'Wu Luzhen memorialized sending men into enemy lines to advise surrender, ordering a halt to attacks, and going in person to Xiangzikou to comfort revolutionary troops; an edict praised this.',
    'Wu Luzhen asked to parley, halt attacks, and comfort rebels at Xiangzikou and was praised.',
  ],
  s0839: [
    'Guangdong\'s diplomatic commissioner office was abolished.',
    'Guangdong\'s diplomatic commissioner was cut.',
  ],
  s0840: [
    'Jiangsu Governor Cheng Desheng joined the revolutionaries at Suzhou and styled himself governor.',
    'Jiangsu\'s Cheng Desheng joined the revolution at Suzhou as governor.',
  ],
  s0841: [
    'Zhejiang\'s new army mutinied; Governor Zengyun was seized and soon released.',
    'Zhejiang mutinied; Governor Zengyun was seized then released.',
  ],
  s0842: [
    'On day gengchen, Twentieth Division Commander Zhang Shaozeng was given vice-minister rank and ordered to pacify the Yangtze.',
    'On gengchen day Zhang Shaozeng of the Twentieth Division received vice-minister rank to pacify the Yangtze.',
  ],
  s0843: [
    'Zhang Shaozeng pleaded illness and did not go.',
    'Zhang Shaozeng pleaded illness and stayed.',
  ],
  s0844: [
    'Zhang Xun was made concurrent Southern Seas military affairs minister.',
    'Zhang Xun also took Southern Seas military affairs.',
  ],
  s0845: [
    'Zhao Erfeng was excused; Duanfang was ordered to act as Sichuan governor-general.',
    'Zhao Erfeng left and Duanfang acted as Sichuan governor-general.',
  ],
  s0846: [
    'Yuan Shikai was urged to enter the capital.',
    'Yuan Shikai was urged to Beijing.',
  ],
  s0847: [
    'Wang Zhaoming, Huang Fusheng, and Luo Shixun were released from prison as political suspects.',
    'Wang Zhaoming, Huang Fusheng, and Luo Shixun were freed.',
  ],
  s0848: [
    'On day xinsi, Guangxi Governor Shen Bingcheng styled himself governor.',
    'On xinsi day Guangxi\'s Shen Bingcheng declared himself governor.',
  ],
  s0849: [
    'The Cabinet Appointments Bureau caught fire.',
    'The cabinet appointments bureau burned.',
  ],
  s0850: [
    'On day renwu, Jiangning new-army commander Xu Shaozhen mutinied with his troops; General Tie Liang, Governor-General Zhang Renjun, and Brigade Commander Zhang Xun held defense.',
    'On renwu day Xu Shaozhen mutinied at Jiangning while Tie Liang, Zhang Renjun, and Zhang Xun held the city.',
  ],
  s0851: [
    'Zhenjiang fell; Jingkou Vice Commander-in-Chief Zaimu died.',
    'Zhenjiang fell and Vice Commander Zaimu was killed.',
  ],
  s0852: [
    'Anhui\'s new army mutinied and installed Governor Zhu Jiabao as governor.',
    'Anhui mutinied and made Zhu Jiabao governor.',
  ],
  s0853: [
    'On day guiwei, an edict specially appointed Yuan Shikai Prime Minister of the Cabinet.',
    'On guiwei day Yuan Shikai was specially appointed prime minister.',
  ],
  s0854: [
    'Following the Political Consultative Assembly\'s memorial, selection was made under the constitutional articles of faith; hence this appointment.',
    'The assembly\'s constitutional articles of faith led to the appointment.',
  ],
  s0855: [
    'Lu Haihuan asked to extend the charitable relief society by Red Cross rules; it was approved.',
    'Lu Haihuan asked to run relief on Red Cross lines and was approved.',
  ],
  s0856: [
    'Guangdong declared independence, chose a governor, and Governor-General Zhang Mingqi fled.',
    'Guangdong declared independence and Zhang Mingqi fled.',
  ],
  s0857: [
    'Fujian\'s new army mutinied; General Pu Shou and Governor Songshou died.',
    'Fujian mutinied; Pu Shou and Songshou were killed.',
  ],
  s0858: [
    'On day jiashen, the Empress Dowager\'s benevolent edict dismissed Jilu and recalled Shiro as Chief of the Imperial Household Department.',
    'On jiashen day the empress dowager dismissed Jilu and recalled Shiro to the household department.',
  ],
  s0859: [
    'Xiliang was summoned to audience.',
    'Xiliang was summoned to court.',
  ],
  s0860: [
    'Because the court had never discriminated between Manchu-Han bannermen and Han civilians at the outset, commanders of troops were ordered to proclaim this.',
    'Commanders were told the court made no Manchu-Han distinction.',
  ],
  s0861: [
    'On day yiyou, Shandong Governor Sun Baoqi declared independence.',
    'On yiyou day Shandong\'s Sun Baoqi declared independence.',
  ],
  s0862: [
    'Shuntian memorialized establishing a temporary charitable Red Cross society in the capital.',
    'Shuntian set up a temporary capital Red Cross society.',
  ],
  s0863: [
    'Prince Yulang was dismissed as staff minister; Xu Shichang replaced him.',
    'Prince Yulang left the General Staff and Xu Shichang replaced him.',
  ],
  s0864: [
    'On day bingxu, rewards were granted to Jiangning officers and soldiers who fought and held defense.',
    'On bingxu day Jiangning\'s defenders were rewarded.',
  ],
  s0865: [
    'Lu Haihuan was made president of the Chinese Red Cross and charged with charitable relief affairs.',
    'Lu Haihuan headed the Chinese Red Cross and relief work.',
  ],
  s0866: [
    'The Three Eastern Provinces Consultative Assembly and new army demanded independence; Governor-General Zhao Erxun did not agree, shelved the proposal, and still ordered persuasion and dissolution.',
    'Manchuria\'s assembly and new army sought independence; Zhao Erxun refused and ordered persuasion.',
  ],
  s0867: [
    'On day dinghai, all nearby garrison divisions, route armies, and Jiang Guiyi\'s forces were placed under Yuan Shikai\'s command.',
    'On dinghai day nearby garrisons, route armies, and Jiang Guiyi\'s troops went to Yuan Shikai.',
  ],
  s0868: [
    'On day wuzi, condolence commissioners were sent to war-afflicted provinces to gather popular opinion.',
    'On wuzi day commissioners were sent to war provinces to hear the people.',
  ],
  s0869: [
    'Each provincial governor-general and governor was ordered to choose suitable representatives to come to the capital for conference.',
    'Each governor was told to send representatives to Beijing.',
  ],
  s0870: [
    'Zhao Erxun, blaming himself for Sichuan affairs, asked to resign; the edict did not permit.',
    'Zhao Erxun tried to resign over Sichuan and was refused.',
  ],
  s0871: [
    'Wu Luzhen brought troops to Shijiazhuang and was killed by his subordinates.',
    'Wu Luzhen reached Shijiazhuang and was killed by his men.',
  ],
  s0872: [
    'Censor Wen Su impeached Luzhen for harboring evil intent with rebellion already clear.',
    'Censor Wen Su impeached Wu Luzhen for treason.',
  ],
  s0873: [
    'An edict ordered Chen Ailong to investigate.',
    'Chen Ailong was told to investigate.',
  ],
  s0874: [
    'Wang Shizhen was excused on grounds of illness; Duan Zhigui was ordered to act as Huguang governor-general.',
    'Wang Shizhen quit for illness and Duan Zhigui acted for Huguang.',
  ],
  s0875: [
    'The Yongding River works were joined.',
    'The Yongding River was closed.',
  ],
  s0876: [
    'Yuan Shikai came to the capital.',
    'Yuan Shikai reached Beijing.',
  ],
  s0877: [
    'On day jichou, Zhang Xiluan was made Shanxi governor.',
    'On jichou day Zhang Xiluan became Shanxi governor.',
  ],
  s0878: [
    'Puying was excused; Xiliang was made Rehe governor-general.',
    'Puying left Rehe and Xiliang became governor-general.',
  ],
  s0879: [
    'On day gengyin, Yuan Shikai nominated State Ministers.',
    'On gengyin day Yuan Shikai named his cabinet.',
  ],
  s0880: [
    'An edict appointed Liang Dunyan Minister of Foreign Affairs, Zhao Bingjun Minister of Civil Affairs, Yan Xiu Minister of Revenue, Tang Jingchong Minister of Education, Wang Shizhen Minister of the Army, Sa Zhenbing Minister of the Navy, Shen Jiaben Minister of Justice, Zhang Jian Minister of Agriculture, Industry, and Commerce, Yang Shiqi Minister of Posts and Communications, and Dashou Minister of Dependencies, each with a vice-minister to assist.',
    'Yuan Shikai\'s cabinet: Liang Dunyan foreign affairs, Zhao Bingjun civil affairs, Yan Xiu revenue, Tang Jingchong education, Wang Shizhen army, Sa Zhenbing navy, Shen Jiaben justice, Zhang Jian agriculture and industry, Yang Shiqi posts, Dashou dependencies.',
  ],
  s0881: [
    'Yu Shimei and Baoxi were made ministers for revising the code.',
    'Yu Shimei and Baoxi revised the legal code.',
  ],
  s0882: [
    'Shaochang, Lin Shaonian, Chen Bangrui, Wang Qi, Wu Yusheng, and Enshun were all made Privy Council advisers.',
    'Shaochang, Lin Shaonian, Chen Bangrui, Wang Qi, Wu Yusheng, and Enshun became privy advisers.',
  ],
  s0883: [
    'On day xinmao, Duan Qirui was ordered to act as Huguang governor-general.',
    'On xinmao day Duan Qirui acted as Huguang governor-general.',
  ],
  s0884: [
    'Sheng Yun was recalled to act as Shaanxi governor and supervise military affairs.',
    'Sheng Yun returned to act as Shaanxi governor with military charge.',
  ],
  s0885: [
    'On day renchen, Zhejiang Governor Zengyun was stripped of office for leaving his post without authority.',
    'On renchen day Zhejiang\'s Zengyun was dismissed for abandoning his post.',
  ],
  s0886: [
    'On day guisi, because in attacking remaining rebels at Moling Pass the officers and soldiers fought bravely, Zhang Xun was rewarded with hereditary Second Class Light Chariot Commandant.',
    'On guisi day Zhang Xun received hereditary Second Class Light Chariot Commandant for Moling Pass.',
  ],
  s0887: [
    'On day jiawu, the Political Consultative Assembly submitted revised assembly regulations; they were promulgated.',
    'On jiawu day the assembly\'s revised charter was issued.',
  ],
  s0888: [
    'Winter, tenth month, day bingshen: the Cabinet memorialized that under constitutional government certain matters conflicted and audience for memorials was suspended.',
    'In winter month 10, bingshen, the cabinet suspended memorial audiences under constitutional rule.',
  ],
  s0889: [
    'The Privy Council and General Staff were likewise restricted.',
    'The privy council and General Staff were restricted too.',
  ],
  s0890: [
    'Old regulations for daily duty in each yamen were abolished.',
    'Old yamen daily-duty rules were abolished.',
  ],
  s0891: [
    'Shiro was again appointed Grand Secretary of the Wenyuan Pavilion.',
    'Shiro again became Wenyuan grand secretary.',
  ],
  s0892: [
    'On day wuxu, Wu Tingfang, Zhang Jian, Tang Wenzi, and Wen Zongyao urged the Prince Regent to favor a republican polity.',
    'On wuxu day Wu Tingfang, Zhang Jian, Tang Wenzi, and Wen Zongyao urged the regent toward republic.',
  ],
  s0893: [
    'On day gengzi, the nineteen constitutional articles of faith were sworn before the Imperial Ancestral Temple; the Prince Regent performed the rite in the Emperor\'s place.',
    'On gengzi day the nineteen constitutional articles were sworn at the ancestral temple by the regent for the emperor.',
  ],
  s0894: [
    'Lao Naixuan was made superintendent of the Imperial University.',
    'Lao Naixuan took the Imperial University.',
  ],
  s0895: [
    'Puliang was excused; Xuanhua Brigade Commander Huang Maocheng was ordered concurrently to act as Chahar governor-general.',
    'Puliang left Chahar and Huang Maocheng of Xuanhua acted there.',
  ],
  s0896: [
    'On day xinchou, Gansu Brigade Commander Zhang Huaizhi was ordered to assist in Zhili defense.',
    'On xinchou day Zhang Huaizhi of Gansu helped Zhili defense.',
  ],
  s0897: [
    'Chengdu in Sichuan declared independence and chose a governor.',
    'Chengdu declared independence and chose a governor.',
  ],
  s0898: [
    'On day renyin, Railway Superintendent and Vice Minister on Reserve Appointment and Acting Sichuan Governor-General Duanfang led troops into Sichuan, halted at Zizhou, and was killed by his subordinates.',
    'On renyin day Duanfang was killed by his men at Zizhou on the march into Sichuan.',
  ],
  s0899: [
    'His younger brother Duan Jin, who followed him, was also killed.',
    'His brother Duan Jin, who followed him, was also killed.',
  ],
  s0900: [
    'For recovering Hanyang, Feng Guozhang was enfeoffed as Second Class Baron.',
    'Feng Guozhang received Second Class Baron for retaking Hanyang.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_025_b09.mjs <translation.json>'
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
