#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'On day guihai, the Emperor visited the hot springs.',
    'On guihai day, the Emperor went to the hot springs.',
  ],
  s0202: [
    'Second month, first day of the month, day yichou: the Emperor returned to the palace.',
    'On the first of the second month, the Emperor returned to the palace.',
  ],
  s0203: [
    'On day guiyou, the Emperor set out on the southern tour to inspect the rivers.',
    'On guiyou day, the southern river inspection tour began.',
  ],
  s0204: [
    'An edict said: "We have paid close attention to river defense, repeatedly going to inspect, and are told of success.',
    'An edict said the Emperor had often inspected the rivers and been told the works had succeeded.',
  ],
  s0205: [
    'Now the Yellow River flows in a broad course; the terrain must still be examined, and We shall then follow the river south downstream.',
    'The Yellow River current had spread wide, so the court would survey conditions and continue south along the river.',
  ],
  s0206: [
    'Where We pass, travel palaces are not to be repaired; whoever levies exactions that burden the people shall be punished by military law.',
    'No travel palaces were to be built along the route, and officials who levied burdens on the people would face military punishment.',
  ],
  s0207: [
    '" On day renwu, the court halted at Jinghai.',
    'The edict ended. On renwu day, the entourage stopped at Jinghai.',
  ],
  s0208: [
    'An officer was sent to offer sacrifice at the tomb of the late Vice Minister Du Ne; the posthumous title Wenke was granted.',
    'An officer sacrificed at Vice Minister Du Ne tomb and granted him the posthumous name Wenke.',
  ],
  s0209: [
    'Third month, day jihai: the Emperor instructed the Shandong governor, saying: "Common people welcoming Us by the roadside number hundreds of thousands each day; counting the days until the imperial return, it will be right when wheat is in ear—each of you must attend to farming and not cause harm to agriculture.',
    'In the third month, the Emperor told the Shandong governor that crowds lining the road must not be kept from the harvest.',
  ],
  s0210: [
    '" On day yisi, the Emperor halted at Yangzhou.',
    'The instruction ended. On yisi day, the Emperor stopped at Yangzhou.',
  ],
  s0211: [
    'Strategic instructions were given to the river official Zhang Penghe.',
    'River commissioner Zhang Penghe received the imperial engineering instructions.',
  ],
  s0212: [
    'On day xinhai, the Emperor halted at Suzhou.',
    'On xinhai day, the entourage stopped at Suzhou.',
  ],
  s0213: [
    'An order was issued to select those skilled in calligraphy among provincial graduates, tribute students, students, and imperial academy students from Jiangnan and Zhejiang to enter the capital to compile books.',
    'Skilled calligraphers from Jiangnan and Zhejiang were chosen to compile books in Beijing.',
  ],
  s0214: [
    'Silver was granted to Gong Fushan, Grand Secretaries Zhang Yushu and Chen Tingjing, retired Grand Secretary Zhang Ying, and Commander-in-chief Aiyintu.',
    'Gong Fushan, Zhang Yushu, Chen Tingjing, Zhang Ying, and Aiyintu received gifts of silver.',
  ],
  s0215: [
    'Grand Secretary Ma Qi and others were granted the "Imperial Carriage" table.',
    'Grand Secretary Ma Qi and colleagues received imperial writing tablets.',
  ],
  s0216: [
    'On day jiwei, the court halted at Songjiang and reviewed archery.',
    'On jiwei day, the Emperor held an archery review at Songjiang.',
  ],
  s0217: [
    'The Emperor wrote and bestowed the plaque "Sacred Traces, Enduring Eminence" on the Kong clan of Qingpu.',
    'The Kong family of Qingpu received an imperial plaque reading "Sacred Traces, Enduring Eminence."',
  ],
  s0218: [
    'The late Vice Minister Gao Shiqi was granted the posthumous title Wenke.',
    'Vice Minister Gao Shiqi received the posthumous name Wenke.',
  ],
  s0219: [
    'Summer, fourth month, day bingyin: the Emperor halted at Hangzhou and reviewed archery.',
    'In the fourth month, the Emperor held an archery review at Hangzhou.',
  ],
  s0220: [
    'On day gengwu, an edict pardoned death sentences by one degree in Shandong, Jiangsu, Zhejiang, and Fujian.',
    'Death sentences in four eastern provinces were reduced one grade.',
  ],
  s0221: [
    "On day wuyin, imperial calligraphy \"Supreme Virtue Without a Name\" was hung at the shrine of Wu Taibo, and plaques for Ji Zha, Dong Zhongshu, Jiao Xian, Zhou Dunyi, Fan Zhongyan, Su Shi, Ouyang Xiu, Hu An'guo, Mi Fu, Zong Ze, and Lu Xiufu were written and hung at their respective shrines.",
    'The Emperor inscribed plaques for Wu Taibo and eleven other worthies and hung them at their shrines.',
  ],
  s0222: [
    'On day yiyou, the Emperor halted at Jiangning.',
    'On yiyou day, the entourage stopped at Jiangning.',
  ],
  s0223: [
    'Intercalary fourth month, day guimao: the Emperor inspected the Gaojia Embankment dike works.',
    'In the intercalary fourth month, the Emperor inspected dikes at Gaojia Embankment.',
  ],
  s0224: [
    'On day xinyou, the Emperor returned to the capital.',
    'On xinyou day, the Emperor returned to Beijing.',
  ],
  s0225: [
    'Fifth month, day wuyin: the Emperor personally tried the case of Director Chen Rubi and pardoned Chen Rubi.',
    'In the fifth month, the Emperor tried Director Chen Rubi in person and pardoned him.',
  ],
  s0226: [
    'Minister of Justice Anbulu and Censor-in-chief of the Left Shu Lu were dismissed from office for losing a case in court.',
    'Anbulu and Shu Lu were removed for mishandling the Chen Rubi trial.',
  ],
  s0227: [
    'On day gengchen, Bei Henuo was made governor-general of Yunnan and Guizhou.',
    'Bei Henuo became governor-general of Yunnan and Guizhou.',
  ],
  s0228: [
    'On day bingxu, the Emperor toured the outer marches.',
    'On bingxu day, the Emperor toured beyond the passes.',
  ],
  s0229: [
    'Sixth month, day jiawu: an order was issued that magistrates selected for promotion who had not served a second term might not be examined for appointment as censor or branch head.',
    'In the sixth month, magistrates without a second term were barred from censorial selection.',
  ],
  s0230: [
    'On day gengxu, mining in Guangdong was halted.',
    'Guangdong mining was suspended.',
  ],
  s0231: [
    'On day bingchen, the Emperor halted at Rehe.',
    'On bingchen day, the entourage stopped at Rehe.',
  ],
  s0232: [
    'Autumn, seventh month, day renshen: the Yellow River broke at Qingshuigou and Hanzhuang; river officials were ordered to inspect resident houses and fields and report.',
    'In the seventh month, the river breached at Qingshuigou and Hanzhuang, and officials were sent to survey the damage.',
  ],
  s0233: [
    'Eighth month, day jiawu: seven hundred thousand taels of silver in banner advances on military pay were remitted.',
    'In the eighth month, 700,000 taels of banner military advances were forgiven.',
  ],
  s0234: [
    'On day wuwu, Yu Chenglong was relieved; Shi Wensheng was made governor-general of Huguang.',
    'Yu Chenglong left office and Shi Wensheng became Huguang governor-general.',
  ],
  s0235: [
    'On day gengshen, the Emperor departed Boluohetun and reviewed the herds.',
    'On gengshen day, the Emperor left Boluohetun to inspect the pastures.',
  ],
  s0236: [
    'Ninth month, day jisi: the court advanced to Zhangjiakou.',
    'In the ninth month, the entourage reached Zhangjiakou.',
  ],
  s0237: [
    'On day bingzi, the Emperor returned to the capital.',
    'On bingzi day, the Emperor returned to Beijing.',
  ],
  s0238: [
    'On day jiashen, Xi Hana was made Censor-in-chief of the Left, and Dajia made general at Jiangning.',
    'Xi Hana became left censor-in-chief and Dajia Jiangning general.',
  ],
  s0239: [
    'Winter, tenth month, first day of the month, day xinmao: reconstruction of the West Peak temple at Huayin was completed, and the Emperor composed the stele inscription.',
    'In the tenth month, the rebuilt Huayin West Peak temple was finished and the Emperor wrote its stele text.',
  ],
  s0240: [
    "On day bingwu, Fu Ning'an was made Han Chinese commander-in-chief.",
    "Fu Ning'an became Han commander-in-chief.",
  ],
  s0241: [
    'Eleventh month, day xinyou: the Mongol prince Danjila was ordered to ready troops to push back the river and observe Tsewang Arabtan.',
    'In the eleventh month, Danjila was told to prepare forces against the river breach and watch Tsewang Arabtan.',
  ],
  s0242: [
    'On day jisi, Li Guangdi was made Grand Secretary, Song Luo Minister of Personnel, and Zhao Hongcan transferred to be governor of Zhili.',
    'Li Guangdi became Grand Secretary; Song Luo and Zhao Hongcan received new posts.',
  ],
  s0243: [
    'On day guiyou, an edict remitted next year land tax quota for Huguang and all previous arrears.',
    'Huguang was granted relief from the next year quota and past tax arrears.',
  ],
  s0244: [
    'On day jiaxu, the Imperial Academy was completed; the Emperor wrote the plaque "Hall of Constant Norms."',
    'The Imperial Academy opened and the Emperor inscribed "Hall of Constant Norms."',
  ],
  s0245: [
    'On day gengchen, Wang Hao was made governor of Henan.',
    'Wang Hao became Henan governor.',
  ],
  s0246: [
    'On day yiyou, the Emperor visited the imperial tombs.',
    'On yiyou day, the Emperor paid respects at the tombs.',
  ],
  s0247: [
    'He toured the near marches.',
    'The Emperor toured the nearby frontier.',
  ],
  s0248: [
    'On day wuzi, school officials were established for Guangnan and Lijiang prefectures in Yunnan, and native people were permitted to take the examinations.',
    'Yunnan Guangnan and Lijiang gained schools so local people could sit for exams.',
  ],
  s0249: [
    'Twelfth month, day renyin: the Emperor attended the burial of Prince Yu Fuquan.',
    'In the twelfth month, the Emperor went to the funeral of Prince Yu Fuquan.',
  ],
  s0250: [
    "Aling'a was concurrently made Minister of the Court of Colonial Affairs.",
    "Aling'a also took charge of the Court of Colonial Affairs.",
  ],
  s0251: [
    'On day jiyou, the Emperor returned to the palace.',
    'On jiyou day, the Emperor returned to the palace.',
  ],
  s0252: [
    'On day bingchen, Zu Liangbi was made general at Fuzhou.',
    'Zu Liangbi became Fuzhou general.',
  ],
  s0253: [
    'This year, disaster land tax for forty-six districts in Zhili, Jiangnan, Huguang, Guangdong, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for disaster areas in forty-six districts across several provinces.',
  ],
  s0254: [
    'Korea and Ryukyu sent tribute.',
    'Korea and Ryukyu paid tribute.',
  ],
  s0255: [
    'Forty-fifth year, spring, first month, day yiyou: Sun Zhaji and Xu Chao were ordered to supervise dredging of the Huai-Yang diversion channels.',
    'In the forty-fifth year, Sun Zhaji and Xu Chao were assigned to dredge the Huai-Yang canals.',
  ],
  s0256: [
    'The Shuntian examination officials, Vice Minister of Revenue Wang Fei and Reader-academician Yao Shiyun, were dismissed from office for unfair selection of candidates.',
    'Wang Fei and Yao Shiyun lost their posts for biased Shuntian examination selections.',
  ],
  s0257: [
    'Second month, day guisi: the Emperor toured the capital region.',
    'In the second month, the Emperor toured the metropolitan district.',
  ],
  s0258: [
    'On day dingwei, the court halted at Jinghai and inspected the Ziya River.',
    'At Jinghai the Emperor inspected the Ziya River.',
  ],
  s0259: [
    'On day renzi, the court returned and halted at the Southern Park.',
    'On renzi day, the entourage returned to the Southern Park.',
  ],
  s0260: [
    'Zhu Man was made general at Jiangning.',
    'Zhu Man became Jiangning general.',
  ],
  s0261: [
    'Wang Ran was made governor of Zhejiang.',
    'Wang Ran became Zhejiang governor.',
  ],
  s0262: [
    'Governor-General Ashan of Jiangnan and Jiangxi impeached Nanjing Prefect Chen Pengnian for disrespect in carrying out imperial instructions; the ministry recommended decapitation.',
    'Governor-General Ashan accused Nanjing prefect Chen Pengnian of disrespect; the ministry urged his execution.',
  ],
  s0263: [
    'Earlier, on the yiyou-year southern tour, Chen Pengnian had obeyed orders not to build travel palaces; Ashan therefore used other charges to impeach him.',
    'Chen Pengnian had refused to build palaces on an earlier tour, so Ashan trumped up other charges.',
  ],
  s0264: [
    'The Emperor ordered him to enter the capital to compile books.',
    'The Emperor spared him and sent him to Beijing to work on the book project.',
  ],
  s0265: [
    'On day wuwu, the Emperor returned to the palace.',
    'On wuwu day, the Emperor returned to the palace.',
  ],
  s0266: [
    'Third month, day gengshen: the Emperor attended the Classics lecture.',
    'In the third month, the Emperor held the Classics lecture.',
  ],
  s0267: [
    'On day xinsi, Shi Yunjin and two hundred eighty-nine others were granted jinshi and other ranks with distinctions.',
    'Shi Yunjin and 289 others received jinshi degrees with graded honors.',
  ],
  s0268: [
    'An edict ordered every province to establish infant-care halls.',
    'Provinces were ordered to build foundling hospitals.',
  ],
  s0269: [
    'Summer, fourth month, first day of the month, day wuzi: there was a solar eclipse.',
    'In the fourth month, a solar eclipse occurred.',
  ],
  s0270: [
    'Guizhou Provincial Commander Li Fangshu was given the additional title Zhenyuan General.',
    'Li Fangshu of Guizhou also received the title Zhenyuan General.',
  ],
  s0271: [
    'On day yimao, Wu Han was dismissed; Mei Juan was made Censor-in-chief of the Left.',
    'Wu Han left office and Mei Juan became left censor-in-chief.',
  ],
  s0272: [
    'Fifth month, day jiwei: Jin Shirong was made Minister of War.',
    'In the fifth month, Jin Shirong became Minister of War.',
  ],
  s0273: [
    'On day jiaxu, an edict remitted tax arrears in Zhili and Shandong.',
    'Zhili and Shandong were granted relief from overdue taxes.',
  ],
  s0274: [
    'On day dingchou, Liang Nai was made governor-general of Fujian and Zhejiang.',
    'Liang Nai became governor-general of Fujian and Zhejiang.',
  ],
  s0275: [
    'On day wuyin, the Emperor toured the outer marches.',
    'On wuyin day, the Emperor again toured beyond the passes.',
  ],
  s0276: [
    'Sixth month, first day of the month, day dinghai: an edict ordered compilation of biographies of meritorious officials.',
    'In the sixth month, the court ordered biographies of founding ministers compiled.',
  ],
  s0277: [
    'On day guisi, Mei Juan and Erge were ordered to investigate the case of Rongmei native official Tian Shunnian.',
    'Mei Juan and Erge were sent to try Rongmei chieftain Tian Shunnian.',
  ],
  s0278: [
    'On day renyin, an order was issued that whenever ministries and courts requisitioned funds and grain not by memorial request, the Ministry of Revenue each month tally the amounts and report.',
    'All off-memorial fund requests by ministries were to be tallied monthly by the Ministry of Revenue.',
  ],
  s0279: [
    'Lan Li was made Fujian land-route provincial commander.',
    'Lan Li became Fujian land-route commander.',
  ],
  s0280: [
    'On day xinhai, Sichuan Governor Neng Tai memorialized that the Anle iron-chain bridge was completed and a thousand-household from the Hualin garrison was moved to garrison it.',
    'Sichuan reported the Anle chain bridge finished and a garrison posted there.',
  ],
  s0281: [
    'Autumn, seventh month, day gengshen: the Emperor halted at Rehe.',
    'In the seventh month, the entourage stopped at Rehe.',
  ],
  s0282: [
    'On day jiazi, Dezhao succeeded as Prince Peng of the Commandery.',
    'Dezhao inherited the title Prince Peng of the Commandery.',
  ],
  s0283: [
    'Eighth month, day renchen: the Gaojia Embankment Cheluo dam and Jianhe river dikes were reported complete.',
    'In the eighth month, dikes at Gaojia Embankment and Jianhe were declared finished.',
  ],
  s0284: [
    'Ninth month, day jihai, the Emperor returned to the capital.',
    'In the ninth month, the Emperor returned to Beijing.',
  ],
  s0285: [
    'Winter, tenth month, first day of the month, day yiyou: Dunbai was dismissed; Wenda was made Minister of Personnel, and Xi Hana Minister of Works.',
    'In the tenth month, Dunbai left office; Wenda and Xi Hana received new ministries.',
  ],
  s0286: [
    'On day gengyin, the military palace examination was held.',
    'On gengyin day, the military jinshi examination took place.',
  ],
  s0287: [
    'An instruction said: "Now the empire has been at peace many years; ministers who have seen battle are already few, and those who know naval warfare are fewer still.',
    'The Emperor warned that long peace had left few generals with battle or naval experience.',
  ],
  s0288: [
    'Someday Taiwan may give cause for concern.',
    'Taiwan might one day become a worry.',
  ],
  s0289: [
    'On Our jiazi southern tour, from Jiangning We boarded a boat; at Huangtiandang great river winds arose; We stood alone on the bow shooting river porpoises, wholly unperturbed.',
    'On the jiazi tour he had stood on the bow in a gale at Huangtiandang, shooting porpoises without fear.',
  ],
  s0290: [
    'Later, when crossing the river, Our heart began to stir.',
    'Later crossings had unsettled him.',
  ],
  s0291: [
    'Last year, when crossing the river, Our heart palpitated.',
    'The year before, crossing the river had left his heart racing.',
  ],
  s0292: [
    'All this is the work of age.',
    'Age alone explained it.',
  ],
  s0293: [
    'Asked veteran generals—they are the same.',
    'Old generals told him they felt the same.',
  ],
  s0294: [
    'Now to make the aged strive bravely to give their lives—how can it be obtained?',
    'How could he expect the elderly to fight as fiercely as before?',
  ],
  s0295: [
    '" On day renyin, Grand Secretary Xi Hana and Vice Ministers Zhang Tingshu and Xiao Yongzao were ordered to reinvestigate the case of native official Tian Shunnian.',
    'The address ended. Xi Hana, Zhang Tingshu, and Xiao Yongzao were ordered to retry Tian Shunnian.',
  ],
  s0296: [
    'On day dingwei, Yatu was made Manchu commander-in-chief.',
    'Yatu became Manchu commander-in-chief.',
  ],
  s0297: [
    'On day jiyou, an edict remitted tax arrears in Shanxi, Shaanxi, Jiangsu, Anhui, Jiangxi, Zhejiang, Fujian, Hubei, Hunan, and Guangdong—ten provinces.',
    'Ten provinces were granted relief from overdue taxes.',
  ],
  s0298: [
    'Eleventh month, day guiyou: Ministers Jin Shirong, Vice Ministers Baxi and Fan Chenglei were ordered to supervise dredging of the Qing River.',
    'In the eleventh month, Jin Shirong, Baxi, and Fan Chenglei were assigned to dredge the Qing River.',
  ],
  s0299: [
    'Banner officers and soldiers were remitted three million nine hundred fifty-six thousand six hundred-odd taels of silver borrowed from government and not yet repaid.',
    'Nearly four million taels of unpaid banner loans were forgiven.',
  ],
  s0300: [
    'On day jiaxu, Ashan was made Minister of Justice.',
    'Ashan became Minister of Justice.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_008_b03.mjs <translation.json>'
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
