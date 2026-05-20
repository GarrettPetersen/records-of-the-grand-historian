#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1001: [
    'On day xinwei, Kazakh envoys including Otorji came to court for audience.',
    'On xinwei day, Kazakh envoys led by Otorji were received at court.',
  ],
  s1002: [
    'Fifth month, day yihai: Khalkha Prince Robzang Dorji was promoted to prince of the first degree.',
    'In the fifth month, Robzang Dorji of the Khalkha was raised to a first-rank prince.',
  ],
  s1003: [
    'On day yiyou, the Emperor went in person to Prince Guo\'s mourning hall for Hongshi and bestowed offerings at Prince Jianqin\'s garden tomb for Qitong\'a.',
    'On yiyou day, the Emperor mourned at Prince Guo\'s hall for Hongshi and offered at Prince Jianqin\'s tomb for Qitong\'a.',
  ],
  s1004: [
    'Because Khotan Resident Minister He Cheng had extorted the Muslims, his office was removed and he was arrested for interrogation.',
    'He Cheng was dismissed and arrested for extorting Muslims while resident minister at Khotan.',
  ],
  s1005: [
    'Yiletu was ordered to proceed to Tarbagatai to conduct affairs.',
    'Yiletu was sent to handle affairs at Tarbagatai.',
  ],
  s1006: [
    'On day xinmao, an earthquake struck the capital.',
    'On xinmao day, the capital was shaken by an earthquake.',
  ],
  s1007: [
    'On day dingyou, quota land taxes were remitted for nineteen prefectures, counties, and guards of Anhui including Huaining for last year\'s flood disaster.',
    'On dingyou day, last year\'s flood taxes were remitted in nineteen Anhui districts including Huaining.',
  ],
  s1008: [
    'On day jiachen, Nashitong and Katahai were executed according to law for mishandling military affairs.',
    'On jiachen day, Nashitong and Katahai were executed for military negligence.',
  ],
  s1009: [
    'Sixth month, day jiyou: Yang Tingzhang was made acting governor-general of Liangguang; Mingshan acted temporarily in office; Dong Bangda acting Minister of Works.',
    'In the sixth month, Yang Tingzhang became acting Liangguang governor-general, Mingshan acted in office, and Dong Bangda acting Works minister.',
  ],
  s1010: [
    'On day yimao, Noble Consort Wei of the Ling rank was promoted to Imperial Noble Consort.',
    'On yimao day, Noble Consort Wei was raised to Imperial Noble Consort.',
  ],
  s1011: [
    'On day jisi, Ming Rui was instructed not to accept the surrender of rebellious Muslims of Ushi.',
    'On jisi day, Ming Rui was told to refuse Ushi rebel submissions.',
  ],
  s1012: [
    'Autumn, seventh month, day xinsi: the Emperor, accompanying the Empress Dowager, went on the autumn hunt to Mulan.',
    'In the seventh month, the court hunted at Mulan with the Empress Dowager.',
  ],
  s1013: [
    'On day wuzi, Guanbao was made Left Censor-in-chief.',
    'On wuzi day, Guanbao became Left Censor-in-chief.',
  ],
  s1014: [
    'On day yiwei, former Khotan Resident Minister He Cheng was executed according to law after greed was proved at trial.',
    'On yiwei day, He Cheng was executed once Khotan graft charges were proved.',
  ],
  s1015: [
    'On day dingyou, the rank of Khalkha Prince Sangzhai Dorji was revoked.',
    'On dingyou day, Sangzhai Dorji of the Khalkha lost his princely rank.',
  ],
  s1016: [
    'Eighth month, new moon on day jiachen: sentences deferred three or more times in court review and autumn review were reduced.',
    'On the eighth-month new moon, thrice-deferred court and autumn sentences were reduced.',
  ],
  s1017: [
    'On day jiwei, the Emperor went to Mulan for the hunting encirclement.',
    'On jiwei day, the Emperor hunted at Mulan.',
  ],
  s1018: [
    'On day gengshen, drought disaster in eleven department districts and counties of Gansu including Jingyuan was relieved.',
    'On gengshen day, drought relief reached eleven Gansu districts including Jingyuan.',
  ],
  s1019: [
    'On day jiazi, earthquake in prefectures and counties of Gansu including Ningyuan; relief was ordered and this year\'s quota land taxes were remitted.',
    'On jiazi day, Gansu earthquake districts including Ningyuan were relieved and this year\'s taxes remitted.',
  ],
  s1020: [
    'Ninth month, day bingzi: flood disaster in twenty-one prefectures and counties of Shandong including Zhangqiu was relieved.',
    'In the ninth month, Shandong floods in twenty-one districts including Zhangqiu were relieved.',
  ],
  s1021: [
    'On day wuyin, Yin Jishan was put in charge of the Ministry of War and Liu Tongxun the Ministry of Justice.',
    'On wuyin day, Yin Jishan took the War Ministry and Liu Tongxun the Justice Ministry.',
  ],
  s1022: [
    'Rebellious Muslims of Ushi surrendered the city.',
    'Ushi rebels handed over the city.',
  ],
  s1023: [
    'On day yiyou, Gao Heng was made Superintendent of the Imperial Household Department.',
    'On yiyou day, Gao Heng became superintendent of the Imperial Household.',
  ],
  s1024: [
    'On day xinmao, because Ming Rui and others had not exterminated the rebels of Ushi but sent them to Ili, the matter was referred to the ministry for severe deliberation.',
    'On xinmao day, Ming Rui and others were severely censured for sending Ushi rebels to Ili instead of killing them.',
  ],
  s1025: [
    'On day xinchou, Li Shiyao was made acting Minister of Works.',
    'On xinchou day, Li Shiyao became acting Works minister.',
  ],
  s1026: [
    'Winter, tenth month, day jiyou: Ming Rui and Agui were stripped of office for errors in handling Ushi affairs but kept at their posts.',
    'In the tenth month, Ming Rui and Agui lost rank over Ushi mistakes but stayed on duty.',
  ],
  s1027: [
    'Flood disaster at three Changlu saltern fields subordinate to Cangzhou was relieved.',
    'Three Cangzhou salterns under Changlu received flood relief.',
  ],
  s1028: [
    'On day jisi, Yang Yingju had an audience at court.',
    'On jisi day, Yang Yingju was received in audience.',
  ],
  s1029: [
    'He Qizhong was ordered acting governor-general of Shaan-Gan; Tang Pin acting governor of Shaanxi.',
    'He Qizhong became acting Shaan-Gan governor-general and Tang Pin acting Shaanxi governor.',
  ],
  s1030: [
    'Eleventh month, day guiyou: quota land taxes were remitted for six prefectures and counties of Jiangsu including Haizhou for this year\'s drought disaster.',
    'In the eleventh month, this year\'s drought taxes were remitted in six Jiangsu districts including Haizhou.',
  ],
  s1031: [
    'On day yiyou, because Minister of Personnel Fusen was old, he was appointed inner grand minister and Tuoenduo was transferred to replace him.',
    'On yiyou day, Fusen became an inner grand minister and Tuoenduo replaced him at Personnel.',
  ],
  s1032: [
    'Tuoyong was made Minister of War.',
    'Tuoyong became Minister of War.',
  ],
  s1033: [
    'Feng Qian was transferred to be Anhui governor.',
    'Feng Qian was sent to Anhui as governor.',
  ],
  s1034: [
    'On day gengyin, Chouda was executed according to law for abetting Sangzhai Dorji in private trade with Russia.',
    'On gengyin day, Chouda was executed for helping Sangzhai Dorji trade secretly with Russia.',
  ],
  s1035: [
    'Ming Rui and others memorialized that all Ushi rebel adherents had been put to death.',
    'Ming Rui reported that every Ushi rebel follower had been killed.',
  ],
  s1036: [
    'On day xinmao, flood in eighteen Shandong prefectures and counties including Zhangqiu and hail and frost disaster in twelve Gansu prefectures and counties including Didao were relieved.',
    'On xinmao day, Shandong floods and Gansu hail and frost damage were relieved.',
  ],
  s1037: [
    'On day jiawu, Agui was made Tarbagatai assistant pacification commissioner, replacing Antai who returned to the capital.',
    'On jiawu day, Agui went to Tarbagatai and Antai returned to Beijing.',
  ],
  s1038: [
    'On day dingwei, Agui was released from the Ministry of Works and Yunzhu replaced him.',
    'On dingwei day, Agui left Works and Yunzhu took his place.',
  ],
  s1039: [
    'Songchun was made general at Suiyuan.',
    'Songchun became Suiyuan general.',
  ],
  s1040: [
    'On day wushen, drought in eleven Gansu department districts and counties including Jingyuan was relieved and quota taxes remitted.',
    'On wushen day, Gansu drought districts including Jingyuan were fed and taxes remitted.',
  ],
  s1041: [
    'On day yimao, flood in fifteen Shandong prefectures and counties including Qihe was relieved.',
    'On yimao day, fifteen Shandong flood counties including Qihe were relieved.',
  ],
  s1042: [
    'On day dingmao, Tuoenduo was ordered additionally to act as Minister of War.',
    'On dingmao day, Tuoenduo was told also to act as War minister.',
  ],
  s1043: [
    'On day renchen, the fifth imperial son Yong Qi was enfeoffed as Prince Rong.',
    'On renchen day, the fifth son Yong Qi became Prince Rong.',
  ],
  s1044: [
    'Twelfth month, day wuwu: because tribute licentiate Zhang Lin of Jingyang county, Shaanxi, had seven generations living together, imperially composed poems and bolts of satin were bestowed.',
    'In the twelfth month, Zhang Lin of Jingyang was rewarded with imperial poems and satin for seven generations under one roof.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_012_b11.mjs <translation.json>'
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
