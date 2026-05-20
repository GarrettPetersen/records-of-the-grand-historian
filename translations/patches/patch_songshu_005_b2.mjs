#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'On jimao of the fifth month, Xiangzhou Inspector Zhang Shao was made Yongzhou Inspector.',
    'In the fifth month, on jimao, Xiangzhou Inspector Zhang Shao was appointed Yongzhou inspector.',
  ],
  s0102: [
    'On gengxu of the sixth month, Grand Commandant Wang Hong was reduced to General Who Guards the Army, Opening Office with the same ceremonial as the Three Excellencies.',
    'On gengxu of the sixth month, Grand Commandant Wang Hong was demoted to General Who Guards the Army with Opening Office equal to the Three Excellencies.',
  ],
  s0103: [
    'The capital suffered great flooding; on yimao, [4] envoys were sent to inspect and grant relief.',
    'After great floods in the capital, on yimao [4] envoys were dispatched to inspect the damage and distribute relief.',
  ],
  s0104: [
    'Jiangxia Interior Administrator Cheng Daohui was made Guangzhou Inspector.',
    'Jiangxia interior administrator Cheng Daohui was appointed Guangzhou inspector.',
  ],
  s0105: [
    'In autumn, on renxu of the eighth month, Special Grand Master and Left Grand Master of the Palace Fan Tai died.',
    'In the eighth month of autumn, on renxu, Special Grand Master and Left Grand Master of the Palace Fan Tai died.',
  ],
  s0106: [
    'In winter, on jiachen of the tenth month, the imperial carriage attended at the Hall for Honoring the Worthy to hear litigation.',
    'In the tenth month of winter, on jiachen, the emperor heard cases at the Hall for Honoring the Worthy.',
  ],
  s0107: [
    'On guimao of the intercalary month, Chief Clerk of the Right Army Liu Dewu was made Yuzhou Inspector.',
    'In the intercalary month, on guimao, Chief Clerk of the Right Army Liu Dewu was made Yuzhou inspector.',
  ],
  s0108: [
    'On xinmao, Chancellor of the Duchy of Anling Zhou Jizhi was made Ningzhou Inspector.',
    'On xinmao, Chancellor of the Duchy of Anling Zhou Jizhi was appointed Ningzhou inspector.',
  ],
  s0109: [
    'On gengyin of the twelfth month, Left Grand Master of the Palace and General of the Palace Guard Zhao Lunzhi died.',
    'On gengyin of the twelfth month, Left Grand Master of the Palace and General of the Palace Guard Zhao Lunzhi died.',
  ],
  s0110: [
    'That year, the state of Tianzhu sent envoys presenting tribute goods.',
    'That year envoys from Tianzhu (India) arrived with tribute.',
  ],
  s0111: [
    'On xinchou of the first month of spring in year 6, the imperial carriage personally performed sacrifice at the southern suburban altar.',
    'On xinchou in the first month of spring, year 6, the emperor personally sacrificed at the southern suburban altar.',
  ],
  s0112: [
    'On guichou, General Who Acts as Commander-in-Chief and Jingzhou Inspector Prince of Pengcheng Yikang was made Grand Commandant, Supervisor of the Masters of Writing, and concurrently General Who Pacifies the North and Southern Xuzhou Inspector.',
    'On guichou, General Who Acts as Commander-in-Chief and Jingzhou Inspector Prince of Pengcheng Yikang became Grand Commandant and Supervisor of the Masters of Writing, while retaining the posts of General Who Pacifies the North and Southern Xuzhou inspector.',
  ],
  s0113: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0114: [
    'On dingsi of the third month, the imperial son Shao was established as crown prince.',
    'On dingsi of the third month, Prince Shao was installed as crown prince.',
  ],
  s0115: [
    'On wuwu, a general amnesty was proclaimed for the empire, and civil and military officials were granted one rank in status.',
    'On wuwu a general amnesty was declared and civil and military officials advanced one rank.',
  ],
  s0116: [
    'On xinyou, General of the Left Guard Yin Jingren was made General of the Central Army.',
    'On xinyou, General of the Left Guard Yin Jingren was appointed General of the Central Army.',
  ],
  s0117: [
    'In summer, on guihai of the fourth month, Left Vice Director of the Masters of Writing Wang Jinghong was made Director of the Masters of Writing; Governor of Danyang and Prince of Linchuan Yiqing was made Left Vice Director of the Masters of Writing; Director of the Ministry of Personnel Jiang Yi was made Right Vice Director of the Masters of Writing.',
    'In the fourth month of summer, on guihai, Left Vice Director Wang Jinghong became Director of the Masters of Writing; Danyang governor Prince of Linchuan Yiqing became Left Vice Director; and Director of Personnel Jiang Yi became Right Vice Director.',
  ],
  s0118: [
    'On renchen, the new moon of the fifth month, there was a solar eclipse.',
    'On renchen, the new moon of the fifth month, there was a solar eclipse.',
  ],
  s0119: [
    'On guisi, the newly appointed Director of the Masters of Writing Wang Jinghong was made Special Grand Master and Left Grand Master of the Palace.',
    'On guisi the newly appointed Director Wang Jinghong was given the additional titles of Special Grand Master and Left Grand Master of the Palace.',
  ],
  s0120: [
    'On jiawu, Chief Clerk of the Pacifying Army Liu Daoji was made Yizhou Inspector.',
    'On jiawu, Chief Clerk of the Pacifying Army Liu Daoji was appointed Yizhou inspector.',
  ],
  s0121: [
    'On yimao, the commandery of Pingyi was established in Yong Province.',
    'On yimao the commandery of Pingyi was established within Yong Province.',
  ],
  s0122: [
    'On jiyou of the seventh month, Left Vice Director of the Masters of Writing Kong Mozhi was made Guangzhou Inspector.',
    'In the seventh month, on jiyou, Left Vice Director Kong Mozhi was made Guangzhou inspector.',
  ],
  s0123: [
    'That month, the king of Baekje sent envoys presenting tribute goods.',
    'That month the king of Baekje sent envoys with tribute.',
  ],
  s0124: [
    'On wuwu of the ninth month, the commanderies of Longxi and Songkang were established in Qin Province.',
    'On wuwu of the ninth month, Longxi and Songkang commanderies were set up in Qin Province.',
  ],
  s0125: [
    'In winter, on renshen of the tenth month, General of the Central Army Yin Jingren left office on account of mourning for his parent.',
    'In the tenth month of winter, on renshen, General of the Central Army Yin Jingren resigned to observe mourning.',
  ],
  s0126: [
    'On jichou, the new moon of the eleventh month, there was a solar eclipse.',
    'On jichou, the new moon of the eleventh month, there was a solar eclipse.',
  ],
  s0127: [
    'On dinghai of the twelfth month, the state of Henan and the King of Hexi sent envoys presenting tribute goods.',
    'On dinghai of the twelfth month, Henan and the King of Hexi sent envoys with tribute.',
  ],
  s0128: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0129: [
    'On guisi of the first month of spring in year 7, Murong Gui of Tuyuhun was made General Who Campaigns in the West and Shazhou Inspector.',
    'On guisi in the first month of spring, year 7, Murong Gui of Tuyuhun was made General Who Campaigns in the West and inspector of Shazhou.',
  ],
  s0130: [
    'That month, the king of Wa sent envoys presenting tribute goods.',
    'That month the king of Wa (Japan) sent envoys with tribute.',
  ],
  s0131: [
    'On wuzi of the third month, General of the Right Dao Yanzhi was sent on a northern campaign; the navy entered the Yellow River.',
    'On wuzi of the third month, General of the Right Dao Yanzhi marched north while the fleet entered the Yellow River.',
  ],
  s0132: [
    'On jiawu, former Chief Clerk for Campaigning against Barbarians Yin Chong was made Sizhou Inspector.',
    'On jiawu, former Chief Clerk for Campaigning against Barbarians Yin Chong was appointed Sizhou inspector.',
  ],
  s0133: [
    '[7] On jiayin, former General of the Central Army Yin Jingren was made General of the Palace Guard.',
    '[7] On jiayin, former General of the Central Army Yin Jingren was restored as General of the Palace Guard.',
  ],
  s0134: [
    'On guiwei of the fourth month of summer, the state of Heluodan sent envoys presenting tribute goods.',
    'In the fourth month of summer, on guiwei, Heluodan sent envoys with tribute.',
  ],
  s0135: [
    'On jimao of the sixth month, General Who Conquers Yang Nachang of the Di was made Qinzhou Inspector.',
    'On jimao of the sixth month, General Who Conquers Yang Nachang of the Di was made Qinzhou inspector.',
  ],
  s0136: [
    'In autumn, on wuzi of the seventh month, the Northern Wei garrison at Quepo abandoned the city and fled.',
    'In the seventh month of autumn, on wuzi, the Northern Wei garrison at Quepo abandoned the city and fled.',
  ],
  s0137: [
    'On bingshen, Pacifying-the-North Staff Officer Zhen Fahu was made Liang and Southern Qin Inspector.',
    'On bingshen, Pacifying-the-North staff officer Zhen Fahu was appointed inspector of Liang and Southern Qin.',
  ],
  s0138: [
    'On wuxu, the Northern Wei garrison at Huatai abandoned the city and fled.',
    'On wuxu the Northern Wei garrison at Huatai abandoned the city and withdrew.',
  ],
  s0139: [
    'On jiayin, the states of Linyi, Heluotuo, and Shizi sent envoys presenting tribute goods.',
    'On jiayin, Linyi, Heluotuo, and Shizi each sent envoys with tribute.',
  ],
  s0140: [
    'On jiayin of the tenth month of winter, Southern Yuzhou was abolished and merged into Yuzhou.',
    'On jiayin of the tenth month of winter, Southern Yuzhou was abolished and absorbed into Yuzhou.',
  ],
  s0141: [
    'General of the Left and Prince of Jingling Yixuan was made Xuzhou Inspector.',
    'General of the Left Prince of Jingling Yixuan was appointed Xuzhou inspector.',
  ],
  s0142: [
    'On wuwu, a mint was established to cast four-zhu coins.',
    'On wuwu a government mint was established to cast four-zhu coins.',
  ],
  s0143: [
    'On wuyin, Jincheng city was taken by the Northern Wei.',
    'On wuyin Jincheng fell to the Northern Wei.',
  ],
  s0144: [
    'On guimao of the eleventh month, Hulao city was again taken by the Northern Wei.',
    'On guimao of the eleventh month, Hulao was lost again to the Northern Wei.',
  ],
  s0145: [
    'On renchen, General Who Campaigns in the South Tan Daoji was sent on a northern punitive expedition, and General of the Right Dao Yanzhi fled in retreat from Huatai.',
    'On renchen General Who Campaigns in the South Tan Daoji marched north on campaign, while General of the Right Dao Yanzhi retreated in disorder from Huatai.',
  ],
  s0146: [
    'On xinyou of the twelfth month, Southern Xuzhou Inspector Prince of Changsha Yixin was made Yuzhou Inspector, and Grand Commandant Staff Officer Ji Han was made Sizhou Inspector.',
    'On xinyou of the twelfth month, Southern Xuzhou inspector Prince of Changsha Yixin became Yuzhou inspector, and Grand Commandant staff officer Ji Han became Sizhou inspector.',
  ],
  s0147: [
    'On yihai, fire broke out in the capital and spread to burn the north wall of the Grand Temple of Soil and Grain.',
    'On yihai a great fire in the capital spread to the north wall of the Grand Temple of Soil and Grain.',
  ],
  s0148: [
    'Yanzhou Inspector Zhu Lingxiu, having committed a crime, was executed.',
    'Yanzhou Inspector Zhu Lingxiu, convicted of a crime, was executed.',
  ],
  s0149: [
    'On gengyin of the first month of spring in year 8, Zhuyai Commandery was re-established in Jiaozhou.',
    'On gengyin in the first month of spring, year 8, Zhuyai Commandery was re-established in Jiaozhou.',
  ],
  s0150: [
    'On guisi, General of the Left Army Shen Xuan was made Yanzhou Inspector.',
    'On guisi, General of the Left Army Shen Xuan was appointed Yanzhou inspector.',
  ],
  s0151: [
    'On dingyou, General Who Campaigns in the South Tan Daoji defeated the Northern Wei at Dongping Shouzhang.',
    'On dingyou General Who Campaigns in the South Tan Daoji defeated the Northern Wei at Dongping Shouzhang.',
  ],
  s0152: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0153: [
    'On yimao of the second month, Chief Clerk of the Pacifying-the-North Army Wei Lang was made Qingzhou Inspector.',
    'On yimao of the second month, Chief Clerk of the Pacifying-the-North Army Wei Lang was made Qingzhou inspector.',
  ],
  s0154: [
    'On wuwu, Right Vice Director of the Masters of Writing Jiang Yi was made Xiangzhou Inspector.',
    'On wuwu, Right Vice Director Jiang Yi was appointed Xiangzhou inspector.',
  ],
  s0155: [
    'On xinyou, Huatai was taken by the Northern Wei.',
    'On xinyou Huatai fell to the Northern Wei.',
  ],
  s0156: [
    'On guiyou, General Who Campaigns in the South Tan Daoji led his army back.',
    'On guiyou General Who Campaigns in the South Tan Daoji withdrew his army.',
  ],
  s0157: [
    'On dingchou, Qingzhou Inspector Xiao Sihua abandoned the city and fled.',
    'On dingchou Qingzhou Inspector Xiao Sihua abandoned his post and fled.',
  ],
  s0158: [
    'Leader of the Right Guard of the Heir Apparent Liu Zunkao was made Southern Xuzhou Inspector.',
    'Leader of the Heir Apparent\u2019s Right Guard Liu Zunkao was appointed Southern Xuzhou inspector.',
  ],
  s0159: [
    'On jiashen of the third month, the imperial carriage attended at the Hall for Honoring the Worthy to hear litigation.',
    'On jiashen of the third month, the emperor again heard cases at the Hall for Honoring the Worthy.',
  ],
  s0160: [
    'On wushen, an edict said: "Recently military service has been frequent and state expenses have increased; resources and stores are insufficient, and the hundred administrations remain burdensome."',
    'On wushen an edict declared: "Military campaigns have lately multiplied and state expenses have grown; stores are insufficient and administration remains heavy."',
  ],
  s0161: [
    'Simplicity should be preserved to meet actual needs.',
    'Let simplicity be preserved to match real needs.',
  ],
  s0162: [
    'Within and without, all may jointly deliberate in detail and strive to achieve frugality."',
    'Within and without the court, let all deliberate together and strive for frugality."',
  ],
  s0163: [
    'On jiayin of the fourth month of summer, Prince of Hengyang Shiyuan Wanling was made Xiangzhou Inspector.',
    'In the fourth month of summer, on jiayin, Prince of Hengyang Shiyuan Wanling was made Xiangzhou inspector.',
  ],
  s0164: [
    'On yimao, Rear Army Staff Officer Xu Zunzhi was made Yanzhou Inspector.',
    'On yimao, Rear Army staff officer Xu Zunzhi was appointed Yanzhou inspector.',
  ],
  s0165: [
    'On yichou of the sixth month, a general amnesty was proclaimed for the empire.',
    'On yichou of the sixth month a general amnesty was proclaimed.',
  ],
  s0166: [
    'On jimao, the region south of the Yangtze and Jingling Commandery of Yang Province were attached to Southern Xuzhou; the region north of the Yangtze was attached to Yan Province.',
    'On jimao lands south of the Yangtze and Jingling Commandery in Yang Province were placed under Southern Xuzhou, while the north bank was placed under Yan Province.',
  ],
  s0167: [
    'Xuzhou Inspector Prince of Jingling Yixuan was made Southern Xuzhou Inspector, and Grand Commandant Staff Officer Ji Han was made Xuzhou Inspector.',
    'Xuzhou inspector Prince of Jingling Yixuan became Southern Xuzhou inspector, and Grand Commandant staff officer Ji Han became Xuzhou inspector.',
  ],
  s0168: [
    'On gengzi of the intercalary month, an edict said: "Recently agriculture and sericulture have grown slack, and those who wander for food are many; wasteland is not opened, and supervision of tax quotas goes unheard."',
    'On gengzi of the intercalary month an edict said: "Agriculture and sericulture have lately grown slack; wanderers are many, wasteland lies unopened, and tax supervision goes unheard."',
  ],
  s0169: [
    'When flood and drought come in a season, destitution follows at once; if we do not deeply preserve the fundamental task, [9] abundance and supply will have no source.',
    'When flood or drought strike in a season, want follows at once; unless the fundamental task is deeply preserved, [9] abundance will have no foundation.',
  ],
  s0170: [
    'Prefects administer government in the capital region; magistrates are the lords who are close to the people—they should think how to encourage and instruct and guide them with good rules.',
    'Prefects govern the capital region; magistrates are masters close to the people—they should encourage and instruct and guide them with sound rules.',
  ],
  s0171: [
    'All are to make them exert their strength so that the land has no unused benefit, and in plowing, sericulture, planting, and cultivation each exhausts his capacity.',
    'Let all be made to exert their strength so the land yields fully, and in plowing, sericulture, planting, and cultivation each gives his utmost.',
  ],
  s0172: [
    'If any have outstanding strength in farming, at year\u2019s end list them by item and report upward."',
    'Those with exceptional success in farming are to be listed in detail and reported upward at year\u2019s end."',
  ],
  s0173: [
    'Yang Province suffered drought.',
    'Yang Province suffered drought.',
  ],
  s0174: [
    'On yisi, attendant censors were sent to review prison cases and adjust corvée labor.',
    'On yisi attendant censors were sent to review prison cases and adjust corvée duties.',
  ],
  s0175: [
    'On bingwu, Pacifying-the-Army Staff Officer Liu Daochan was made Yongzhou Inspector.',
    'On bingwu, Pacifying-the-Army staff officer Liu Daochan was appointed Yongzhou inspector.',
  ],
  s0176: [
    'On jiachen of the eighth month of autumn, Prince of Linchuan Yiqing resigned as Vice Director of the Masters of Writing.',
    'On jiachen of the eighth month, Prince of Linchuan Yiqing resigned as Vice Director of the Masters of Writing.',
  ],
  s0177: [
    'On dingwei, Qin Commandery of Yuzhou was attached to Southern Xuzhou.',
    'On dingwei Qin Commandery in Yuzhou was transferred to Southern Xuzhou.',
  ],
  s0178: [
    'In the twelfth month of winter, Xiang Province was abolished and merged back into Jing Province.',
    'In the twelfth month of winter, Xiang Province was abolished and merged back into Jing Province.',
  ],
  s0179: [
    'On gengxu of the third month of spring in year 9, General Who Guards the Army Wang Hong was promoted to Grand Preceptor and given the additional post of Director of the Palace Library.',
    'On gengxu in the third month of spring, year 9, General Who Guards the Army Wang Hong was promoted to Grand Preceptor with the additional post of Director of the Palace Library.',
  ],
  s0180: [
    'On dingsi, General Who Campaigns in the South and Jiangzhou Inspector Tan Daoji was promoted to Minister of Works.',
    'On dingsi, General Who Campaigns in the South and Jiangzhou Inspector Tan Daoji was promoted to Minister of Works.',
  ],
  s0181: [
    'On yihai of the fourth month of summer, Protector of the Army Yin Mu was made Special Grand Master and Right Grand Master of the Palace; Marquis of Jianchang Dao Yanzhi was made Protector of the Army.',
    'In the fourth month of summer, on yihai, Protector of the Army Yin Mu became Special Grand Master and Right Grand Master of the Palace, and Marquis of Jianchang Dao Yanzhi became Protector of the Army.',
  ],
  s0182: [
    'On renshen of the fifth month, Director of the Palace Library, Supervisor of the Masters of Writing, General Who Guards the Army, and Yangzhou Inspector Wang Hong died.',
    'On renshen of the fifth month, Director of the Palace Library, Supervisor of the Masters of Writing, General Who Guards the Army, and Yangzhou Inspector Wang Hong died.',
  ],
  s0183: [
    'On jiaxu of the sixth month, Pacifying-the-Army Staff Officer Shen Xuan was made Qingzhou Inspector.',
    'On jiaxu, Pacifying-the-Army staff officer Shen Xuan was appointed Qingzhou inspector.',
  ],
  s0184: [
    'Ji Province was established by partitioning Qing Province.',
    'Ji Province was carved out of Qing Province.',
  ],
  s0185: [
    'On wuyin, Grand Commandant and Southern Xuzhou Inspector Prince of Pengcheng Yikang was changed to hold Yangzhou Inspector.',
    'On wuyin, Grand Commandant and Southern Xuzhou Inspector Prince of Pengcheng Yikang took over as Yangzhou inspector.',
  ],
  s0186: [
    'On jimao, Grand Commandant Staff Officer Cui Yin was made Jizhou Inspector.',
    'On jimao, Grand Commandant staff officer Cui Yin was appointed Jizhou inspector.',
  ],
  s0187: [
    'On renwu, Murong Yan of Tuyuhun was made General Who Pacifies the East, [10] Murong Shiqian of Tuyuhun was made General Who Pacifies the North, and Murong Huifa of Tuyuhun was made General Who Guards the Army.',
    'On renwu, Murong Yan of Tuyuhun was made General Who Pacifies the East, [10] Murong Shiqian General Who Pacifies the North, and Murong Huifa General Who Guards the Army.',
  ],
  s0188: [
    '[11] On guimao, an edict said: "Yi, Liang, Jiao, and Guang—their territories are remote and far; governance should suit local conditions, yet many are partial and overbearing."',
    '[11] On guimao an edict said: "Yi, Liang, Jiao, and Guang lie in distant borderlands; governance must suit local conditions, yet many officials rule with partial harshness."',
  ],
  s0189: [
    'Grand envoys may again be dispatched to tour and seek the people\u2019s afflictions."',
    'Grand envoys are again to be sent to tour the regions and investigate the people\u2019s hardships."',
  ],
  s0190: [
    'The offices of General of Strong Archers and General of Powerful Crossbows were established.',
    'The posts of General of Strong Archers and General of Powerful Crossbows were established.',
  ],
  s0191: [
    'On yiwei, General Who Campaigns in the West and Shazhou Inspector Murong Gui of Tuyuhun was made General Who Campaigns in the West Grand Marshal, Inspector of Xi-Qin-He, and King of Longxi.',
    'On yiwei, General Who Campaigns in the West and Shazhou Inspector Murong Gui of Tuyuhun was promoted to Grand Marshal campaigning in the west, made inspector of Xi, Qin, and He, and enfeoffed as King of Longxi.',
  ],
  s0192: [
    'Qinzhou Inspector of the North Yang Nachang of the Di was given the additional title General Who Campaigns in the West.',
    'Northern Qinzhou inspector Yang Nachang of the Di was given the additional title General Who Campaigns in the West.',
  ],
  s0193: [
    'On renyin, Pacifying Army General and Jingzhou Inspector Prince of Jiangxia Yigong was made General Who Campaigns in the North, Opening Office with the same ceremonial as the Three Excellencies, and Southern Xuzhou Inspector; former General Qian Prince of Linchuan Yiqing was made General Who Pacifies the West and Jingzhou Inspector; Southern Xuzhou Inspector Prince of Jingling Yixuan was made Director of the Palace Library and General of the Central Army; General Who Campaigns against Barbarians Prince of Hengyang Yiji was made Southern Xuzhou Inspector.',
    'On renyin, Pacifying Army General and Jingzhou Inspector Prince of Jiangxia Yigong became General Who Campaigns in the North with Opening Office equal to the Three Excellencies and Southern Xuzhou inspector; former General Qian Prince of Linchuan Yiqing became General Who Pacifies the West and Jingzhou inspector; Southern Xuzhou inspector Prince of Jingling Yixuan became Director of the Palace Library and General of the Central Army; and General Who Campaigns against Barbarians Prince of Hengyang Yiji became Southern Xuzhou inspector.',
  ],
  s0194: [
    'On wuchen of the seventh month of autumn, Director of the Masters of Writing Wang Zhongde was made General Who Guards the North and Xuzhou Inspector.',
    'In the seventh month of autumn, on wuchen, Director of the Masters of Writing Wang Zhongde was made General Who Guards the North and Xuzhou inspector.',
  ],
  s0195: [
    'On gengwu, General of the Palace Guard Yin Jingren was made Vice Director of the Masters of Writing, and Tutor of the Heir Apparent Liu Zhan was made General of the Palace Guard.',
    'On gengwu, General of the Palace Guard Yin Jingren became Vice Director of the Masters of Writing, and Tutor of the Heir Apparent Liu Zhan became General of the Palace Guard.',
  ],
  s0196: [
    'On renshen, the state of Henan and the King of Hexi sent envoys presenting tribute goods.',
    'On renshen, Henan and the King of Hexi sent envoys with tribute.',
  ],
  s0197: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0198: [
    'In the ninth month, the demonic bandit Zhao Guang raided Yizhou, overran and captured commanderies and counties, and the provincial government suppressed and pacified him.',
    'In the ninth month the rebel Zhao Guang raided Yizhou, seized commanderies and counties, and was suppressed by the provincial government.',
  ],
  s0199: [
    'On renzi of the eleventh month of winter, Director of the Palace Treasury Zhen Fachong was made Yizhou Inspector.',
    'On renzi of the eleventh month, Director of the Palace Treasury Zhen Fachong was appointed Yizhou inspector.',
  ],
  s0200: [
    'On guichou, Songkang Commandery was established in Guang Province.',
    'On guichou Songkang Commandery was established in Guang Province.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_songshu_005_b2.mjs <translation.json>'
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;

for (const s of data.sentences) {
  const pair = T[s.id];
  if (pair) {
    s.literal = pair[0];
    s.idiomatic = pair[1];
    patched++;
  }
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patch count: ${patched}`);

if (patched !== Object.keys(T).length) {
  process.exitCode = 1;
}
