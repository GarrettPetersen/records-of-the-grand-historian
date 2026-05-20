#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1301: [
    'On day jisi, Sheng Bao was relieved of Imperial Commissioner rank and assigned solely to suppress bandits in Henan; Yuan Jiasan was assigned solely for Anhui.',
    'On jisi day, Sheng Bao lost commissioner rank for Henan bandit suppression and Yuan Jiasan took Anhui alone.',
  ],
  s1302: [
    'On day dingchou, Ying Qi was demoted for tardy delivery of capital grain funds; Qing Lian was made Henan governor.',
    'On dingchou day, Ying Qi was demoted for late capital grain funds and Qing Lian became Henan governor.',
  ],
  s1303: [
    'On day jichou, Ministry of Punishments clerk He Qiutao presented his eighty-volume compilation Northern Frontier Collected Records; the Emperor praised it, renamed it Shuofang Beicheng, and admitted him to duty in the Maqin Hall.',
    'On jichou day, He Qiutao presented his frontier compilation; the court praised it, renamed it Shuofang Beicheng, and posted him to the Maqin Hall.',
  ],
  s1304: [
    'On day renchen, You Feng was dismissed; Quan Liang was made Chengdu general and Zhan Tai Sichuan provincial commander.',
    'On renchen day, You Feng was dismissed; Quan Liang took Chengdu and Zhan Tai took Sichuan command.',
  ],
  s1305: [
    'On day jiawu, Censor Bai Enyou said Tianjin defense was of great weight and asked that rear routes be planned in advance to ensure complete security.',
    'On jiawu day, Bai Enyou urged advance planning of rear routes for Tianjin defense.',
  ],
  s1306: [
    'An edict replied: "What you memorialized is indeed so, yet quartering troops and raising funds is very difficult.',
    'The court replied that the memorial was sound but garrisoning troops and raising pay would be very hard.',
  ],
  s1307: [
    'Tianjin defenses are now complete; this need not be discussed further.',
    'Tianjin defenses were already complete and the matter need not be pursued.',
  ],
  s1308: [
    '" Te Puqin memorialized to summon Oroqen into military service; it was approved.',
    'Te Puqin\'s request to enlist Oroqen was approved.',
  ],
  s1309: [
    'Zhalafentai memorialized for a joint attack on India with Russia and Nepal.',
    'Zhalafentai proposed a joint Russo-Nepalese attack on India.',
  ],
  s1310: [
    'The Emperor said: "Russia is no true friend.',
    'The Emperor said Russia was no true ally.',
  ],
  s1311: [
    'How could Nepal match Britain?',
    'He asked how Nepal could match Britain.',
  ],
  s1312: [
    '" (closing quotation mark in the source.)',
    'The edict ended."',
  ],
  s1313: [
    'Second month, day dingyou: the Emperor attended the classics lecture.',
    'In the second month, on dingyou day, the Emperor attended the classics lecture.',
  ],
  s1314: [
    'On day gengzi, Liu Yuanhao was made Guizhou governor.',
    'On gengzi day, Liu Yuanhao became Guizhou governor.',
  ],
  s1315: [
    'Yuan Jiasan memorialized the recovery of Fengyang; he was granted a yellow riding jacket.',
    'Yuan Jiasan recovered Fengyang and received a yellow riding jacket.',
  ],
  s1316: [
    'On day xinchou, He Guiqing memorialized that English at Shanghai, after Chinese merchants\' mediation, demanded one million in military expenses.',
    'On xinchou day, He Guiqing reported the English at Shanghai demanded one million in military expenses after merchant mediation.',
  ],
  s1317: [
    'The Tianjin treaty could not be altered; they would enter the capital to exchange ratifications.',
    'They insisted the Tianjin treaty could not change and that ratification must occur in the capital.',
  ],
  s1318: [
    'If not granted, they would sail north at once.',
    'They threatened to sail north if refused.',
  ],
  s1319: [
    'An edict ordered Sengge Rinchen to secure rear routes for Tianjin defense.',
    'The court ordered Sengge Rinchen to secure Tianjin\'s rear defenses.',
  ],
  s1320: [
    'Sea-transport tribute grain was temporarily held from sailing.',
    'Sea-transport tribute grain was temporarily suspended.',
  ],
  s1321: [
    'On day bingwu, Hunan government troops recovered Zhenyuan in Guizhou.',
    'On bingwu day, Hunan troops recovered Guizhou\'s Zhenyuan.',
  ],
  s1322: [
    'On day gengxu, Nian bandits took Taoyuan and fled up the Qing River; Geng Chang withdrew to defend Huai\'an.',
    'On gengxu day, Nian bandits took Taoyuan and fled toward Qing River while Geng Chang fell back to Huai\'an.',
  ],
  s1323: [
    'On day renzi, Hunan troops aiding Guangxi recovered Liuzhou and Liucheng; circuit intendant Liu Kunyi was given vice censor-in-chief rank.',
    'On renzi day, Hunan relief troops recovered Liuzhou and Liucheng and Liu Kunyi gained vice censor rank.',
  ],
  s1324: [
    'On day jiayin, Zhang Fu memorialized that government troops recovered Jiande but bandits took Jing and Jingde and then took Taiping in succession.',
    'On jiayin day, Zhang Fu reported Jiande recovered but Jing, Jingde, and Taiping fell in turn.',
  ],
  s1325: [
    'On day jisi, Woshihabu was made Minister of Rites and Chunyou Rehe military governor.',
    'On jisi day, Woshihabu took rites and Chunyou took Rehe command.',
  ],
  s1326: [
    'On day xinyou, an edict ordered He Chun to divide forces to aid Zhejiang.',
    'On xinyou day, the court ordered He Chun to send troops to aid Zhejiang.',
  ],
  s1327: [
    'Third month, day yichou first of month: Yuan Jiasan memorialized that government troops recovered Qing River.',
    'On the third month\'s yichou new moon, Yuan Jiasan reported Qing River recovered.',
  ],
  s1328: [
    'On day gengzi, Commander Zhang Yuliang was ordered to command troops aiding Zhejiang.',
    'On gengzi day, Zhang Yuliang was ordered to lead the Zhejiang relief force.',
  ],
  s1329: [
    'On day bingzi, bandits took Hangzhou; Governor Luo Zundian died.',
    'On bingzi day, Hangzhou fell and Governor Luo Zundian was killed.',
  ],
  s1330: [
    'Six days later, General Ruichang recovered the city.',
    'Six days later Ruichang recovered the city.',
  ],
  s1331: [
    'Ruichang, Zhang Yuliang, and others were richly rewarded again.',
    'Ruichang, Zhang Yuliang, and others received further rewards.',
  ],
  s1332: [
    'Wang Youling was made Zhejiang governor.',
    'Wang Youling became Zhejiang governor.',
  ],
  s1333: [
    'On day dinghai, the Emperor plowed the sacred field.',
    'On dinghai day, the Emperor plowed the sacred field.',
  ],
  s1334: [
    'On day xinmao, Zhejiang government troops recovered Changxing, Lin\'an, and Xiaofeng.',
    'On xinmao day, Zhejiang troops recovered Changxing, Lin\'an, and Xiaofeng.',
  ],
  s1335: [
    'On day jiawu, He Guiqing memorialized that foreign ships were raiding north.',
    'On jiawu day, He Guiqing reported foreign ships raiding northward.',
  ],
  s1336: [
    'Intercalary third month, day guimao: Sichuan government troops recovered Pujiang; bandits took Mingshan.',
    'On intercalary month 3, guimao, Sichuan troops recovered Pujiang but Mingshan fell.',
  ],
  s1337: [
    'On day bingwu, Cao Shuzhong was ordered to command Sichuan forces; Liu Changyou was made Guangxi governor.',
    'On bingwu day, Cao Shuzhong took Sichuan command and Liu Changyou became Guangxi governor.',
  ],
  s1338: [
    'On day dingwei, bandits took Lishui and then took Jurong in succession.',
    'On dingwei day, bandits took Lishui and then Jurong.',
  ],
  s1339: [
    'Zhang Yuliang was made Guangxi provincial commander but remained in Jiangsu commanding troops; he was soon ordered to turn back to Hangzhou.',
    'Zhang Yuliang was made Guangxi commander but stayed in Jiangsu until ordered back to Hangzhou.',
  ],
  s1340: [
    'On day gengshen, He Chun and others memorialized that Chen Yucheng led a mass assault on the great camp; city bandits came out and joined the attack; government troops could not hold and withdrew to defend Zhenjiang.',
    'On gengshen day, He Chun reported Chen Yucheng\'s assault on the great camp; city rebels joined; government troops withdrew to Zhenjiang.',
  ],
  s1341: [
    'On day renxu, Wang Mengling was made Grand Canal transport governor-general.',
    'On renxu day, Wang Mengling became canal transport governor-general.',
  ],
  s1342: [
    'Summer, fourth month, day bingyin: the Ming Confucian Cao Duan was admitted to the Confucian temple sacrifices.',
    'In summer, month 4, bingyin, the Ming scholar Cao Duan entered the Confucian temple sacrifices.',
  ],
  s1343: [
    'On day guiyou, bandits took Danyang; Zhang Guoliang died; He Chun fled to Changzhou.',
    'On guiyou day, Danyang fell, Zhang Guoliang died, and He Chun fled to Changzhou.',
  ],
  s1344: [
    'On day wuyin, an edict ordered all provinces to organize militia training.',
    'On wuyin day, all provinces were ordered to organize militia.',
  ],
  s1345: [
    'Duxing\'a was ordered to supervise military affairs north of the Yangzi.',
    'Duxing\'a was ordered to supervise Jiangbei military affairs.',
  ],
  s1346: [
    'On day guiwei, an edict said Liang-Jiang Governor-General He Guiqing had repeatedly lost cities; his office was stripped and he was arrested for inquiry.',
    'On guiwei day, He Guiqing was stripped and arrested for repeatedly losing cities.',
  ],
  s1347: [
    'Zeng Guofan was made acting Liang-Jiang governor-general.',
    'Zeng Guofan became acting Liang-Jiang governor-general.',
  ],
  s1348: [
    'Ministry of War director Zuo Zongtang was promoted to fourth-rank capital official and assigned to assist Zeng Guofan\'s military affairs.',
    'Zuo Zongtang was promoted to fourth-rank capital official to assist Zeng Guofan.',
  ],
  s1349: [
    'On day yiyou, bandits attacked Changzhou; He Chun met them in battle, was wounded, and died.',
    'On yiyou day, rebels attacked Changzhou; He Chun was wounded in battle and died.',
  ],
  s1350: [
    'Kuiyu was made acting Jiangning general; he joined Badeng\'a in holding Zhenjiang.',
    'Kuiyu became acting Jiangning general and joined Badeng\'a defending Zhenjiang.',
  ],
  s1351: [
    'On day xinmao, bandits took Jianping; Zhang Yuliang\'s army was routed at Wuxi.',
    'On xinmao day, Jianping fell and Zhang Yuliang\'s army was routed at Wuxi.',
  ],
  s1352: [
    'On day renchen, Zhong Junsheng and one hundred eighty-three others were granted jinshi and other degrees with distinctions.',
    'On renchen day, Zhong Junsheng and 183 others received jinshi degrees.',
  ],
  s1353: [
    'On day guisi, bandits took Suzhou; Governor Xu Youcheng died.',
    'On guisi day, Suzhou fell and Governor Xu Youcheng was killed.',
  ],
  s1354: [
    'Fifth month, day jiawu first of month: Xue Huan was made Jiangsu governor and temporarily acted as governor-general.',
    'On the fifth month\'s jiawu new moon, Xue Huan became Jiangsu governor and acting governor-general.',
  ],
  s1355: [
    'On day jihai, Jiangsu Changshu county magistrate Zhou Murun recruited Sha braves and recovered Jiangyin.',
    'On jihai day, Zhou Murun\'s Sha braves recovered Jiangyin.',
  ],
  s1356: [
    'On day xinchou, bandits took Zhejiang\'s Changxing and besieged Huzhou; Xiao Hanqing went to relieve them, was defeated, and died.',
    'On xinchou day, Changxing fell, Huzhou was besieged, and Xiao Hanqing died relieving it.',
  ],
  s1357: [
    'On day jiachen, Zeng Guofan memorialized a three-route advance to recover Suzhou, protect Zhejiang, and also requested Shen Baozhen\'s dispatch.',
    'On jiachen day, Zeng Guofan proposed a three-route advance on Suzhou and Zhejiang and asked for Shen Baozhen.',
  ],
  s1358: [
    'The Emperor praised and approved it.',
    'The court praised and approved the plan.',
  ],
  s1359: [
    'Dong Chun was made acting Sichuan governor-general.',
    'Dong Chun became acting Sichuan governor-general.',
  ],
  s1360: [
    'On day bingwu, bandits took Wujiang, Kunshan, and Zhejiang\'s Jiaxing.',
    'On bingwu day, Wujiang, Kunshan, and Jiaxing fell.',
  ],
  s1361: [
    'Yuming memorialized that more than sixty foreign ships were anchored at the sea mouths of Jinzhou and Xiuyan, plundering livestock.',
    'Yuming reported over sixty foreign ships at Jinzhou and Xiuyan plundering livestock.',
  ],
  s1362: [
    'On day gengxu, an edict ordered Wang Mengling to supervise Qiao Songnian in opening the Jiangbei grain bureau.',
    'On gengxu day, Wang Mengling was ordered to open the Jiangbei grain bureau with Qiao Songnian.',
  ],
  s1363: [
    'On day xinhai, Vice Minister Dai Xi, who died for the state while at home, was mourned; he was posthumously made Minister, given hereditary office, a special shrine, and the posthumous title Wenjie.',
    'On xinhai day, the martyred Vice Minister Dai Xi was posthumously honored as Minister Wenjie with a shrine and hereditary rank.',
  ],
  s1364: [
    'On day jiayin, Mao Changxi was ordered to organize Henan militia and Du to organize Shandong militia.',
    'On jiayin day, Mao Changxi took Henan militia and Du took Shandong militia.',
  ],
  s1365: [
    'On day wuwu, Li Ruozhu memorialized that Xue Chengliang had submitted and then rebelled; he was captured and executed.',
    'On wuwu day, Li Ruozhu reported Xue Chengliang\'s feigned submission and execution.',
  ],
  s1366: [
    'On day jiwei, Zeng Guofan memorialized that Bao Chao and Zhu Pinlong were being moved to garrison at Qimen and that Hubei troops should not be transferred again.',
    'On jiwei day, Zeng Guofan moved Bao Chao and Zhu Pinlong to Qimen and asked that Hubei troops not be shifted again.',
  ],
  s1367: [
    'It was approved.',
    'The court approved.',
  ],
  s1368: [
    'Yuming memorialized that more than one hundred foreign ships reached the Jinzhou coast; Wen Yu memorialized that British and French troops at Yantai numbered about ten thousand, with reports of an overland advance from Haifeng and Dashan; both were referred to Sengge Rinchen.',
    'Yuming reported over a hundred foreign ships off Jinzhou; Wen Yu reported ten thousand Anglo-French troops at Yantai and a possible overland advance; both reports went to Sengge Rinchen.',
  ],
  s1369: [
    'Sixth month, day guihai first of month: an edict approved Barga Banner men taking examinations on equal terms.',
    'On the sixth month\'s guihai new moon, Barga Banner men were approved for equal examination rights.',
  ],
  s1370: [
    'On day jiazi, English ships entered Beitang.',
    'On jiazi day, English ships entered Beitang.',
  ],
  s1371: [
    'On day bingyin, bandits took Qingpu and Songjiang.',
    'On bingyin day, Qingpu and Songjiang fell.',
  ],
  s1372: [
    'On day jisi, Liu Changyou memorialized the recovery of Qingyuan; Shi Dakai fled south.',
    'On jisi day, Liu Changyou recovered Qingyuan as Shi Dakai fled south.',
  ],
  s1373: [
    'On day gengwu, Ruichang memorialized the recovery of Guangde.',
    'On gengwu day, Ruichang reported Guangde recovered.',
  ],
  s1374: [
    'On day xinwei, the Emperor\'s birthday: he received congratulations in the palace hall.',
    'On xinwei day, the Emperor\'s birthday, he received court congratulations.',
  ],
  s1375: [
    'On day renshen, Grand Secretary Peng Yunzhang ceased Grand Council duty.',
    'On renshen day, Grand Secretary Peng Yunzhang left Grand Council duty.',
  ],
  s1376: [
    'Shao Can, Liu Yi, Yan Duanshu, and Pang Zhonglu were each ordered to organize militia in their home districts.',
    'Shao Can, Liu Yi, Yan Duanshu, and Pang Zhonglu were ordered to organize home-district militia.',
  ],
  s1377: [
    'On day wuyin, Wang Youling memorialized that home-district circuit intendant Zhao Jingxian recovered Huzhou.',
    'On wuyin day, Wang Youling reported Zhao Jingxian\'s recovery of Huzhou.',
  ],
  s1378: [
    'Xue Huan memorialized the recovery of Songjiang.',
    'Xue Huan reported Songjiang recovered.',
  ],
  s1379: [
    'On day gengchen, British and French troops landed and then occupied Beitang.',
    'On gengchen day, Anglo-French troops landed and occupied Beitang.',
  ],
  s1380: [
    'The Southern Canal commissioner and Huai-Hai circuit posts were abolished.',
    'The Southern Canal and Huai-Hai posts were abolished.',
  ],
  s1381: [
    'On day renwu, Sengge Rinchen memorialized that British and French ambitions were great and arrogant and peace talks could hardly be hoped for.',
    'On renwu day, Sengge Rinchen reported Anglo-French arrogance and little hope of peace.',
  ],
  s1382: [
    'An edict charged Hengfu with pacification and told him to consider the larger situation.',
    'The court charged Hengfu with pacification and urged him to consider the larger situation.',
  ],
  s1383: [
    'On day bingxu, Zeng Guofan was made Imperial Commissioner and formally appointed Liang-Jiang governor-general.',
    'On bingxu day, Zeng Guofan became Imperial Commissioner and full Liang-Jiang governor-general.',
  ],
  s1384: [
    'On day jichou, foreigners attacked Xinhe; government troops withdrew to defend Tanggu.',
    'On jichou day, foreigners attacked Xinhe and government troops withdrew to Tanggu.',
  ],
  s1385: [
    'Luo Bingzhang was ordered to hurry to Sichuan to supervise military affairs.',
    'Luo Bingzhang was ordered to hurry to Sichuan to supervise the campaign.',
  ],
  s1386: [
    'On day xinmao, a hand edict to Sengge Rinchen said: "We clasped hands in parting; half a year has swiftly passed.',
    'On xinmao day, a hand edict to Sengge Rinchen said they had parted half a year before.',
  ],
  s1387: [
    'Dagu\'s two banks are critically perilous; surely your heart burns with anxiety.',
    'Dagu\'s banks were critically perilous and his anxiety must have been intense.',
  ],
  s1388: [
    'Yet the empire\'s great foundation lies in the capital, not at the sea mouth.',
    'The court said the empire\'s foundation lay in the capital, not the sea mouth.',
  ],
  s1389: [
    'If there is setback, you must in all cases fall back and hold Tianjin and Tongzhou; you must never stake your life on the forts for your own sake alone.',
    'On any setback he must fall back to Tianjin and Tongzhou and never stake his life on the forts alone.',
  ],
  s1390: [
    'I take up the brush in grief; you must earnestly obey!',
    'The Emperor wrote in grief and urged earnest obedience.',
  ],
  s1391: [
    '" An edict ordered Xiling\'a to hold Tianjin firmly; Ruilin and Yiledong\'a went to Tongzhou to block the route.',
    'Xiling\'a was ordered to hold Tianjin and Ruilin and Yiledong\'a went to block Tongzhou.',
  ],
  s1392: [
    'Autumn, seventh month, day guisi: Badeng\'a was ordered to relieve Jintan.',
    'In autumn, month 7, guisi, Badeng\'a was ordered to relieve Jintan.',
  ],
  s1393: [
    'On day wuxu, the Dagu forts were lost; Commander Le Shan died; he was generously mourned and granted a shrine.',
    'On wuxu day, Dagu fell, Commander Le Shan died, and he received generous mourning and a shrine.',
  ],
  s1394: [
    'On day gengzi, Sengge Rinchen withdrew to defend Tongzhou.',
    'On gengzi day, Sengge Rinchen withdrew to Tongzhou.',
  ],
  s1395: [
    'On day xinchou, the English took Tianjin.',
    'On xinchou day, the English took Tianjin.',
  ],
  s1396: [
    'Zhejiang bandits took Lin\'an and Yuhang.',
    'Zhejiang rebels took Lin\'an and Yuhang.',
  ],
  s1397: [
    'Sichuan bandits took Qiong, Pu, and Xinjin.',
    'Sichuan rebels took Qiong, Pu, and Xinjin.',
  ],
  s1398: [
    'On day jiachen, Jiangsu bandits again took Songjiang.',
    'On jiachen day, Jiangsu rebels again took Songjiang.',
  ],
  s1399: [
    'On day dingwei, Chongshi was made acting Sichuan governor-general.',
    'On dingwei day, Chongshi became acting Sichuan governor-general.',
  ],
  s1400: [
    'On day jiyou, Yurui memorialized that Kokand asked to trade as before; it was permitted.',
    'On jiyou day, Yurui reported Kokand\'s request to resume trade and it was permitted.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_020_b14.mjs <translation.json>'
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
