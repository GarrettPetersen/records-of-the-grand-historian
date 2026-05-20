#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1601: [
    'Sichuan Military Governor Song Qing was ordered to assist in Beiyang military affairs.',
    'Song Qing was told to help run Beiyang military affairs.',
  ],
  s1602: [
    'On day dingmao, Duke Cheng\'en Gui Xiang was ordered to command all cavalry and infantry camps and garrison Shanhaiguan.',
    'On dingmao day, Gui Xiang led horse and foot camps to Shanhaiguan.',
  ],
  s1603: [
    'On day wuchen, Fengtian relief commander, Gaozhou Brigade General Zuo Baogui, fought the Japanese at Pyongyang, was defeated, and died.',
    'On wuchen day, Zuo Baogui fought Japan at Pyongyang, lost, and was killed.',
  ],
  s1604: [
    'On day jisi, Wu Dacheng\'s army was ordered to garrison Leting.',
    'On jisi day, Wu Dacheng was posted at Leting.',
  ],
  s1605: [
    'On day gengwu, an empress dowager edict halted birthday congratulations at the Summer Palace for her sixtieth birthday.',
    'On gengwu day, Cixi stopped Summer Palace birthday rites for her sixtieth year.',
  ],
  s1606: [
    'Thirty thousand piculs of grain from Beijing granaries were allocated to relieve floods in Shuntian jurisdictions.',
    '30,000 piculs of Beijing grain were sent to flood-hit Shuntian districts.',
  ],
  s1607: [
    'Ninth month, new moon on jiaxu: an empress dowager edict recalled Prince Gong Yixin to inner court service, put him in charge of the Zongli Yamen and Navy Yamen, and had him jointly manage military affairs.',
    'In month 9, jiaxu new moon, Yixin returned to court, headed the Zongli and Navy yamens, and shared military planning.',
  ],
  s1608: [
    'On day yihai, Song Qing was ordered to command all armies in Zhili and Fengtian.',
    'On yihai day, Song Qing took command of Zhili and Fengtian forces.',
  ],
  s1609: [
    'Ye Zhichao was removed as supreme commander.',
    'Ye Zhichao was dismissed as supreme commander.',
  ],
  s1610: [
    'On day dingchou, an edict told retired Military Governor Cao Kezhong to raise Tianjin militia and garrison Shanhaiguan.',
    'On dingchou day, Cao Kezhong was told to raise Tianjin volunteers for Shanhaiguan.',
  ],
  s1611: [
    'Wang Wenshao was summoned to the capital.',
    'Wang Wenshao was called to Beijing.',
  ],
  s1612: [
    'Huang Shaochun was transferred to be Yangtze naval commander.',
    'Huang Shaochun became Yangtze naval commander.',
  ],
  s1613: [
    'On day gengchen, Vice Minister of War Wang Wenjin and others were ordered to organize militia training.',
    'On gengchen day, Wang Wenjin and others were told to run militia training.',
  ],
  s1614: [
    'On day xinsi, land tax was remitted for drought-stricken districts such as Xianning in Shaanxi.',
    'On xinsi day, Shaanxi drought districts including Xianning were freed of land tax.',
  ],
  s1615: [
    'On day renwu, Naval Vice Commander Deng Shichang fought the Japanese at Dadonggou and died.',
    'On renwu day, Deng Shichang fought Japan at Dadonggou and was killed.',
  ],
  s1616: [
    'On day guiwei, Zhang Zhidong was summoned to the capital.',
    'On guiwei day, Zhang Zhidong was called to Beijing.',
  ],
  s1617: [
    'On day dinghai, flood victims in Ruichang and other counties were relieved.',
    'On dinghai day, Ruichang and other flooded counties were relieved.',
  ],
  s1618: [
    'On day wuzi, for dispersing before the enemy, Ye Zhichao and Wei Rugui were removed as supreme commanders; Nie Shicheng was made commander of both armies.',
    'On wuzi day, Ye Zhichao and Wei Rugui were sacked for rout; Nie Shicheng took both armies.',
  ],
  s1619: [
    'On day gengzi, Japanese troops crossed the Yalu River.',
    'On gengzi day, Japanese forces crossed the Yalu.',
  ],
  s1620: [
    'On day xinchou, Jiuliancheng fell.',
    'On xinchou day, Jiuliancheng was lost.',
  ],
  s1621: [
    'On day renyin, Chang Shun was ordered to lead Jilin troops to Fengtian to assist suppression; Feng Shen was to command the three provinces\' trained troops to defend the eastern frontier.',
    'On renyin day, Chang Shun took Jilin troops to Fengtian while Feng Shen guarded the eastern frontier with trained troops.',
  ],
  s1622: [
    'Winter, tenth month, new moon on jiachen: Yulu was instructed to ready Jinzhou defenses.',
    'In winter month 10, jiachen new moon, Yulu was told to prepare Jinzhou.',
  ],
  s1623: [
    'On day yisi, Military Governor Tang Renlian was ordered to raise twenty battalions of volunteers and join Ding\'an and Yulu in defense and suppression.',
    'On yisi day, Tang Renlian raised twenty volunteer battalions to join Ding\'an and Yulu.',
  ],
  s1624: [
    'On day dingwei, an edict ordered Shanxi and other provinces to send troops for capital defense.',
    'On dingwei day, Shanxi and other provinces were told to send troops to guard the capital.',
  ],
  s1625: [
    'On day wushen, an edict put Prince Gong in charge of military affairs; all route commanders were to obey him.',
    'On wushen day, Prince Gong took military affairs and all route commanders obeyed him.',
  ],
  s1626: [
    'Grand ministers and others were assigned to patrol defense and militia defense; Guangxi Surveillance Commissioner Hu Yufen was stationed at Tianjin to supervise grain and pay, with permission to memorialize directly.',
    'Grand ministers split patrol and militia duties; Hu Yufen at Tianjin ran grain and pay with direct memorial rights.',
  ],
  s1627: [
    'Liu Kunyi was summoned to the capital; Zhang Zhidong acted as Governor-General of Liangjiang and Southern Ocean Commissioner.',
    'Liu Kunyi was called to Beijing; Zhang Zhidong acted as Liangjiang governor-general and Southern Ocean commissioner.',
  ],
  s1628: [
    'Ningxia Brigade General Wei Rugui was stripped of office and arrested for shrinking before the enemy.',
    'Wei Rugui was dismissed and arrested for retreating before the enemy.',
  ],
  s1629: [
    'On day jiyou, Weng Tonghe, Li Hongzao, and Gang Yi were all appointed Grand Councillors.',
    'On jiyou day, Weng Tonghe, Li Hongzao, and Gang Yi joined the Grand Council.',
  ],
  s1630: [
    'On day renzi, the Japanese took Jinzhou; Vice Commander Lian Shun abandoned the city and fled.',
    'On renzi day, Japan took Jinzhou and Lian Shun fled.',
  ],
  s1631: [
    'Xu Bangdao fought the Japanese and was defeated.',
    'Xu Bangdao fought Japan and lost.',
  ],
  s1632: [
    'On day bingchen, poor people along rivers in Shandong were relieved, with treasury funds allocated for consolation.',
    'On bingchen day, Shandong riverside poor were relieved with treasury funds.',
  ],
  s1633: [
    'On day dingyou, foreign envoys presented credentials congratulating the empress dowager on her sixtieth birthday; the emperor received them at Wenhua Hall.',
    'On dingyou day, envoys congratulated Cixi\'s sixtieth birthday and were received at Wenhua Hall.',
  ],
  s1634: [
    'On day renxu, the Japanese took Xiuyan Prefecture; Feng Sheng\'a and Nie Guilin both abandoned the city and fled.',
    'On renxu day, Japan took Xiuyan; Feng Sheng\'a and Nie Guilin fled.',
  ],
  s1635: [
    'Elehebu and Zhang Zhiwan were removed from the Grand Council.',
    'Elehebu and Zhang Zhiwan left the Grand Council.',
  ],
  s1636: [
    'Ding\'an, for achieving nothing before the enemy, lost his titles of Imperial Commissioner and Han Banner Commander-in-Chief but was temporarily retained to train troops in the three eastern provinces.',
    'Ding\'an lost commissioner and banner commander titles for no battlefield success but stayed to train eastern troops.',
  ],
  s1637: [
    'Yiktanga was stripped of office for timidity in commanding troops and was ordered to redeem himself through merit.',
    'Yiktanga was dismissed for timid command and told to win merit in redemption.',
  ],
  s1638: [
    'On day dingmao, Japanese raided the Lüshun dockyard; chief superintendent Gong Zhaoyu fled to Yantai, followed by Huang Shilin, Zhao Huaiye, and Wei Rucheng; Xu Bangdao with Zhang Guangqian, Jiang Guiti, and Cheng Yunhe fled to Fukzhou and joined Song Qing.',
    'On dingmao day, Japan raided Lüshun docks; Gong Zhaoyu fled to Yantai, then Huang Shilin, Zhao Huaiye, and Wei Rucheng; Xu Bangdao and others fled to Fukzhou to Song Qing.',
  ],
  s1639: [
    'Li Bingheng was instructed to guard Weihai strictly.',
    'Li Bingheng was told to hold Weihai firmly.',
  ],
  s1640: [
    'Wu Dacheng asked to take Shanhaiguan defense himself and, after the armies united, plan recovery of Korea.',
    'Wu Dacheng asked to defend Shanhaiguan and, once armies joined, plan to retake Korea.',
  ],
  s1641: [
    'An edict said: "To be apprehensive in facing affairs is an ancient maxim.',
    'The throne warned: "Face danger with caution, as the ancients taught.',
  ],
  s1642: [
    'Do not treat the matter lightly, lest words and deeds later fail to match."',
    'Never be careless, or words and deeds will not match later."',
  ],
  s1643: [
    'For the loss of Lüshun, Li Hongzhang was blamed for mistaken coordination; his office was stripped but he was retained on duty.',
    'Lüshun\'s fall brought blame on Li Hongzhang\'s coordination; he was demoted but kept at his post.',
  ],
  s1644: [
    'On day renshen, Ding Ruchang was removed as naval commander but temporarily kept in post.',
    'On renshen day, Ding Ruchang lost the naval command but stayed on temporarily.',
  ],
  s1645: [
    'Song Qing asked to be punished but was specially pardoned.',
    'Song Qing asked for punishment but was pardoned.',
  ],
  s1646: [
    'An edict strictly restrained all route commanders, forbidding harassment of civilians; violators would be immediately executed by military law.',
    'Route commanders were strictly forbidden to harass civilians; offenders faced instant military execution.',
  ],
  s1647: [
    'Ye Zhichao was stripped of office.',
    'Ye Zhichao was dismissed.',
  ],
  s1648: [
    'Eleventh month, new moon on guiyou: Gong Zhaoyu was stripped of office and soon arrested for trial.',
    'In month 11, guiyou new moon, Gong Zhaoyu was dismissed and soon arrested.',
  ],
  s1649: [
    'On day jimao, for the fall of Jinzhou, Vice Commander Lian Shun was stripped of office, Cheng Zhiwei was also stripped, and Zhao Huaiye was sent to the capital for punishment.',
    'On jimao day, after Jinzhou fell, Lian Shun and Cheng Zhiwei were dismissed and Zhao Huaiye was sent to Beijing for trial.',
  ],
  s1650: [
    'On day gengchen, an empress dowager edict restored Prince Gong Yixin as Grand Councillor.',
    'On gengchen day, Cixi restored Yixin to the Grand Council.',
  ],
  s1651: [
    'On day xinsi, scheduled tax quotas were remitted for flood-hit districts in Shuntian and Zhili.',
    'On xinsi day, flood-hit Shuntian and Zhili districts were freed of scheduled tax.',
  ],
  s1652: [
    'On day bingxu, Japan took Fukzhou.',
    'On bingxu day, Japan seized Fukzhou.',
  ],
  s1653: [
    'On day wuzi, Japanese troops gathered in Jinzhou and Fukzhou.',
    'On wuzi day, Japanese forces massed at Jinzhou and Fukzhou.',
  ],
  s1654: [
    'Song Qing was instructed to lead all armies in decisive battle.',
    'Song Qing was told to lead a decisive battle.',
  ],
  s1655: [
    'Feng Sheng\'a and Nie Guilin fled from Xiuyan to Ximucheng; on hearing the enemy had arrived the army broke again, and the Japanese took Ximucheng.',
    'Feng Sheng\'a and Nie Guilin fled Xiuyan to Ximucheng; the army routed again when the enemy came, and Japan took Ximucheng.',
  ],
  s1656: [
    'Cheng Wenbing was made land forces commander.',
    'Cheng Wenbing became land forces commander.',
  ],
  s1657: [
    'On day jichou, Song Qing fought the Japanese at Haicheng, was defeated, and fell back to defend Tianzhuangtai.',
    'On jichou day, Song Qing lost to Japan at Haicheng and fell back to Tianzhuangtai.',
  ],
  s1658: [
    'On day gengyin, Yiktanga fought the Japanese at Fenghuangcheng; bodyguard Yongshan died.',
    'On gengyin day, Yiktanga fought Japan at Fenghuangcheng and bodyguard Yongshan was killed.',
  ],
  s1659: [
    'Ronglu was ordered to serve at the Zongli Yamen.',
    'Ronglu was posted to the Zongli Yamen.',
  ],
  s1660: [
    'On day renchen, Feng Sheng\'a and Nie Guilin were arrested for trial.',
    'On renchen day, Feng Sheng\'a and Nie Guilin were arrested.',
  ],
  s1661: [
    'On day guisi, Ye Zhichao and Ding Ruchang were arrested for punishment.',
    'On guisi day, Ye Zhichao and Ding Ruchang were arrested for trial.',
  ],
  s1662: [
    'On day wuxu, commanders Cheng Yunhe, Zhang Guangqian, and Brigade General Jiang Guiti were stripped of office but all retained in camp to serve.',
    'On wuxu day, Cheng Yunhe, Zhang Guangqian, and Jiang Guiti were dismissed but kept in camp.',
  ],
  s1663: [
    'Twelfth month, on guimao: banquets at Ziguang Pavilion and Baohe Hall that month were suspended.',
    'In month 12, guimao, Ziguang and Baohe banquets were halted.',
  ],
  s1664: [
    'Military Governor Wei Rucheng was stripped of office and arrested for trial.',
    'Wei Rucheng was dismissed and arrested.',
  ],
  s1665: [
    'On day jiachen, Censor An Weijun, for criticizing Li Hongzhang, was punished as reckless speech, stripped of office, and sent to garrison duty at the Frontier Service.',
    'On jiachen day, An Weijun was dismissed and exiled to the Frontier Service for criticizing Li Hongzhang.',
  ],
  s1666: [
    'Liu Kunyi was appointed Imperial Commissioner; all armies inside and outside the passes were placed under his command.',
    'Liu Kunyi became imperial commissioner over all armies inside and outside the passes.',
  ],
  s1667: [
    'Military Governor Huang Shilin was stripped of office and arrested for trial.',
    'Huang Shilin was dismissed and arrested.',
  ],
  s1668: [
    'On day renzi, Zhang Yinhuan and Shao Youlian were appointed plenipotentiary ministers to negotiate peace with Japan and were soon recalled.',
    'On renzi day, Zhang Yinhuan and Shao Youlian were sent to Japan to negotiate peace and soon recalled.',
  ],
  s1669: [
    'On day bingchen, 120,000 piculs of Jiangsu tribute grain were allocated for spring relief in Shuntian and Zhili.',
    'On bingchen day, 120,000 piculs of Jiangsu tribute grain were set aside for spring relief in Shuntian and Zhili.',
  ],
  s1670: [
    'On day dingsi, Zhang Gaoyuan fought the Japanese at Gaiping and was defeated.',
    'On dingsi day, Zhang Gaoyuan lost to Japan at Gaiping.',
  ],
  s1671: [
    'Fengtian troops fought again; Military Governor Yang Shoushan died and the city fell.',
    'Fengtian forces fought again; Yang Shoushan was killed and the city fell.',
  ],
  s1672: [
    'On day xinyou, an empress dowager edict stationed Liu Kunyi at Shanhaiguan to plan advances and halts.',
    'On xinyou day, Cixi posted Liu Kunyi at Shanhaiguan to plan operations.',
  ],
  s1673: [
    'Wu Dacheng was hurried to lead his army out of the passes and join Song Qing in advance and suppression.',
    'Wu Dacheng was urged to march out of the passes and join Song Qing.',
  ],
  s1674: [
    'Because grain was dear near the capital, miscellaneous grain from Henan and Shandong was shipped for sale at fair price.',
    'Dear grain near the capital brought Henan and Shandong grain for fair-price sale.',
  ],
  s1675: [
    'On day guihai, Wei Rugui was executed.',
    'On guihai day, Wei Rugui was executed.',
  ],
  s1676: [
    'On day jiazi, Song Qing and Wu Dacheng were ordered to assist Liu Kunyi in military affairs.',
    'On jiazi day, Song Qing and Wu Dacheng were told to assist Liu Kunyi.',
  ],
  s1677: [
    'On day yichou, another 30,000 piculs from Beijing granaries were allocated for spring relief in Shuntian.',
    'On yichou day, another 30,000 piculs of Beijing grain were set aside for Shuntian spring relief.',
  ],
  s1678: [
    'On day jimao, Japan took Rongcheng.',
    'On jimao day, Japan seized Rongcheng.',
  ],
  s1679: [
    'On day gengwu, Wang Wenshao was ordered to assist in Beiyang military affairs.',
    'On gengwu day, Wang Wenshao was told to assist Beiyang military affairs.',
  ],
  s1680: [
    'That year Korea sent tribute.',
    'That year Korea paid tribute.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_023_b17.mjs <translation.json>'
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
