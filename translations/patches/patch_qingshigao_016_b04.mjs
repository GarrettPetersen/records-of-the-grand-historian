#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'Delengtai memorialized intercepting teaching-bandits crossing the river, capturing bandit chief Ran Tianyuan; he was advanced to third-class viscount.',
    'Delengtai reported intercepting river-crossing sect rebels and capturing Ran Tianyuan; he was made a third-class viscount.',
  ],
  s0302: [
    'On day renshen, the Emperor went to worship at the Western Tombs.',
    'On renshen day, the Emperor visited the Western Tombs.',
  ],
  s0303: [
    'On day yihai, he returned to the capital.',
    'On yihai day, the Emperor returned to Beijing.',
  ],
  s0304: [
    'On day xinsi, descendants of ministers in the Hall of Worthies were selected and enrolled.',
    'On xinsi day, descendants of Hall of Worthies ministers were enrolled.',
  ],
  s0305: [
    'For allowing bandits to cross the Jialing and again pass the Tong River, Kuilun was stripped of office and arrested for trial.',
    'Kuilun lost office and was arrested for letting rebels cross the Jialing and Tong.',
  ],
  s0306: [
    'Lebao was made acting Sichuan governor-general; Mingliang, a Blue Bordered Banner imperial bodyguard, was called up to follow the army.',
    'Lebao acted as Sichuan governor-general and Mingliang joined the campaign as an imperial bodyguard.',
  ],
  s0307: [
    'Summer, fourth month, new moon on day guiwei: there was a solar eclipse; on day yiyou, Addis was banished to Yili; Delengtai was made Chengdu general.',
    'At the fourth-month new moon, guiwei, there was an eclipse; on yiyou, Addis went to Yili and Delengtai became Chengdu general.',
  ],
  s0308: [
    'On day gengzi, Yunnan\'s Luo Yi were pacified; Shulin was advanced to Grand Guardian of the Heir Apparent.',
    'On gengzi day, Yunnan\'s Luo Yi were pacified and Shulin became Grand Guardian.',
  ],
  s0309: [
    'Intercalary fourth month, day jiayin: the Board of Punishments was ordered to review long-imprisoned official convicts, perpetually confined descendants, and long-exiled men for lenient reduction.',
    'On jiayin in the intercalary fourth month, the Board of Punishments was to review long-held prisoners for leniency.',
  ],
  s0310: [
    'On day bingwu, the Emperor walked in prayer for rain.',
    'On bingwu day, the Emperor prayed on foot for rain.',
  ],
  s0311: [
    'On day yimao, Hong Liangji was released to return home.',
    'On yimao day, Hong Liangji was released to his native place.',
  ],
  s0312: [
    'On day bingchen, Annamese Li Diao and others were released from prison, settled in the Firearms Brigade, and given monthly rations.',
    'On bingchen day, Li Diao and other Annamese prisoners were freed, settled in the Firearms Brigade, and given rations.',
  ],
  s0313: [
    'That day it rained.',
    'Rain fell that day.',
  ],
  s0314: [
    'On day bingyin, hereditary office was granted for Sichuan battle-death Regional Commander Da Santai.',
    'On bingyin day, Da Santai of Sichuan received a hereditary office for dying in battle.',
  ],
  s0315: [
    'On day wuchen, because Nayancheng was unfit for military affairs, he was removed from the Grand Council and recalled to the capital.',
    'On wuchen day, Nayancheng left the Grand Council and was recalled for military incompetence.',
  ],
  s0316: [
    'Fifth month, new moon on day renxu: at the summer solstice, Earth was sacrificed to at the Square Mound, with the Gaozong Chun Emperor as collateral spirit.',
    'At the fifth-month new moon, renxu, the summer solstice Square Mound rite paired the Gaozong Chun Emperor.',
  ],
  s0317: [
    'On day jichou, campaign commander Eledengbao was advanced to third-class viscount for suppressing bandit leaders Liu Yungong and others.',
    'On jichou day, Eledengbao became a third-class viscount for suppressing Liu Yungong and others.',
  ],
  s0318: [
    'On day bingwu, Nayancheng reached the capital; his memorial audience was unsatisfactory; he was demoted to Hanlin bachelor.',
    'On bingwu day, Nayancheng reached Beijing, failed at audience, and was demoted to Hanlin bachelor.',
  ],
  s0319: [
    'Sixth month, day renxu: Eledengbao memorialized capture of bandit chief Yang Kaijia.',
    'In month 6, renxu, Eledengbao reported capturing Yang Kaijia.',
  ],
  s0320: [
    'On day dingmao, Zhang Ruoting was made Minister of Punishments, Wang Chengpei Minister of War, and Feng Guangxiong Censor-in-chief of the Left.',
    'On dingmao day, Zhang Ruoting took punishments, Wang Chengpei war, and Feng Guangxiong the left censorate.',
  ],
  s0321: [
    'On day jiaxu, Kuilun was granted suicide; his son Zhala Fen was banished to Yili.',
    'On jiaxu day, Kuilun was ordered to take his own life and his son Zhala Fen was sent to Yili.',
  ],
  s0322: [
    'Autumn, seventh month, day xinmao: Right Wing regional commander Changling was ordered to lead Jilin and Heilongjiang troops to Hubei to assist in suppressing teaching-bandits.',
    'In month 7, xinmao, Changling was sent with Jilin and Heilongjiang troops to help suppress Hubei sect rebels.',
  ],
  s0323: [
    'Langgan memorialized that Qingmiao Yang Wentai had rebelled; it was suppressed and pacified.',
    'Langgan reported Yang Wentai\'s Qingmiao rebellion suppressed.',
  ],
  s0324: [
    'Ma Huiyu memorialized capture of chief sect teacher Liu Zhixie; he was sent to the capital and executed.',
    'Ma Huiyu sent captured sect chief Liu Zhixie to Beijing for execution.',
  ],
  s0325: [
    'On day bingshen, Minister of Rites Deming died; Dachun was made Minister of Rites.',
    'On bingshen day, Deming died and Dachun took the rites ministry.',
  ],
  s0326: [
    'On day jiyou, Eledengbao memorialized capture of bandit leader Chen Jie.',
    'On jiyou day, Eledengbao reported Chen Jie captured.',
  ],
  s0327: [
    'Eighth month, day bingchen: Guyuan regional commander Wang Wenxiong died in battle suppressing bandits; he was granted third-class viscount.',
    'In month 8, bingchen, Wang Wenxiong died fighting bandits and received a third-class viscountage.',
  ],
  s0328: [
    'Ninth month, day renwu: the Emperor went to worship at the Eastern Tombs.',
    'In month 9, renwu, the Emperor visited the Eastern Tombs.',
  ],
  s0329: [
    'On day wuzi, he returned to the capital.',
    'On wuzi day, the Emperor returned to Beijing.',
  ],
  s0330: [
    'On day dingwei, hereditary office was granted for Sichuan battle-death Vice Commander Li Ximing.',
    'On dingwei day, Li Ximing of Sichuan received a hereditary office for dying in battle.',
  ],
  s0331: [
    'Winter, tenth month, day wuchen: Hu Jitang died; Jiang Sheng was made Zhili governor-general, Shulin Huguang governor-general, and Langgan Yungui governor-general.',
    'In month 10, wuchen, Hu Jitang died; Jiang Sheng took Zhili, Shulin Huguang, and Langgan Yungui.',
  ],
  s0332: [
    'Eleventh month, day yiyou: Prince Rui Chunying died.',
    'In month 11, yiyou, Prince Rui Chunying died.',
  ],
  s0333: [
    'On day jihai, hereditary offices were granted for battle-death dismissed-general Fucheng and others.',
    'On jihai day, Fucheng and other dismissed generals who died in battle received hereditary offices.',
  ],
  s0334: [
    'Twelfth month, day jiayin: Shaanxi teaching-bandit Xu Tiande fled into Hubei, and Hubei teaching-bandit Ran Xuesheng fled into Shaanxi; Delengtai, Lebao, and others were demoted and rebuked.',
    'On jiayin in month 12, Xu Tiande fled into Hubei and Ran Xuesheng into Shaanxi; Delengtai and Lebao were demoted.',
  ],
  s0335: [
    'On day dingsi, Delengtai memorialized capture of teaching-bandits Yang Kaidi and others.',
    'On dingsi day, Delengtai reported Yang Kaidi and other sect rebels captured.',
  ],
  s0336: [
    'On day bingzi, the autumnal ceremony at the Imperial Ancestral Temple was performed.',
    'On bingzi day, the autumnal temple rite was held.',
  ],
  s0337: [
    'This year, disaster land tax was remitted in seventy prefectures, departments, and counties of Shuntian, Jiangsu, Sichuan, Yunnan, Gansu, and elsewhere, and transit and collapsed-field quotas were remitted by degree where troops passed.',
    'This year disaster taxes were forgiven in seventy districts across Shuntian, Jiangsu, Sichuan, Yunnan, and Gansu, with other remissions where troops passed.',
  ],
  s0338: [
    'Korea and Ryukyu sent tribute.',
    'Korea and Ryukyu presented tribute.',
  ],
  s0339: [
    'Sixth year, spring, first month, day renwu: Fusen was made Minister of Revenue and Ming\'an metropolitan banner commander.',
    'In the sixth year, first month, renwu, Fusen took revenue and Ming\'an became metropolitan banner commander.',
  ],
  s0340: [
    'On day xinmao, Junior Minister Woxing\'a and Qiu Xingjian were dispatched to reward the armies of Eledengbao and Delengtai.',
    'On xinmao day, Woxing\'a and Qiu Xingjian were sent to reward Eledengbao\'s and Delengtai\'s armies.',
  ],
  s0341: [
    'On day dingyou, for suppressing teaching-bandits in Shanyang, Delengtai was restored to first-class viscount.',
    'On dingyou day, Delengtai was restored to first-class viscount for suppressing Shanyang sect rebels.',
  ],
  s0342: [
    'On day jiachen, Delengtai memorialized capture of bandit chiefs Gao Er and Wang Ru.',
    'On jiachen day, Delengtai reported Gao Er and Wang Ru captured.',
  ],
  s0343: [
    'On day yisi, Lebao memorialized capture of yellow, blue, and white numbered bandit leaders Xu Wanfu and others.',
    'On yisi day, Lebao reported Xu Wanfu and other yellow, blue, and white bandit leaders captured.',
  ],
  s0344: [
    'Second month, day yimao: Lebao memorialized capture of bandit chief Wang Shihu.',
    'In month 2, yimao, Lebao reported Wang Shihu captured.',
  ],
  s0345: [
    'On day bingchen, Shulin memorialized that Mingliang had captured bandit leader Bu Xing\'ang.',
    'On bingchen day, Shulin reported Mingliang had captured Bu Xing\'ang.',
  ],
  s0346: [
    'On day wuwu, descendants of worthies were granted juren: Minister Wei Xiangqi\'s sixth-generation descendant Yu, Minister Yang Mingshi\'s great-great-grandson Jingzeng, and Provincial Governor Xu Shilin\'s grandson Congxu.',
    'On wuwu day, Yu, Jingzeng, and Congxu of worthy lineages received juren degrees.',
  ],
  s0347: [
    'On day wuchen, the Emperor went to worship at the tombs and performed the spreading-earth rite.',
    'On wuchen day, the Emperor visited the tombs and performed the spreading-earth rite.',
  ],
  s0348: [
    'On day renshen, the Emperor returned to the capital.',
    'On renshen day, the Emperor returned to Beijing.',
  ],
  s0349: [
    'The Huguang regional commander was changed to Hunan regional commander.',
    'The Huguang regional command became the Hunan regional command.',
  ],
  s0350: [
    'A Hubei regional commander was established, stationed at Xiangyang.',
    'A Hubei regional commander was posted at Xiangyang.',
  ],
  s0351: [
    'The Xiangyang garrison regional commander was changed to Yunyang garrison regional commander.',
    'The Xiangyang garrison command became the Yunyang garrison command.',
  ],
  s0352: [
    'On day guiyou, Fusen died; Chengde was made Minister of Revenue and Grand Councilor.',
    'On guiyou day, Fusen died; Chengde took revenue and joined the Grand Council.',
  ],
  s0353: [
    'On day yihai, Eledengbao memorialized capture of bandit chief Wang Tingzhao.',
    'On yihai day, Eledengbao reported Wang Tingzhao captured.',
  ],
  s0354: [
    'Third month, day gengchen, edict: "Many who were coerced by bandits are good commoners; all who surrender shall have death forgiven."',
    'On gengchen in month 3, an edict spared death for coerced followers who surrendered.',
  ],
  s0355: [
    '"Field ministers before the army are to carry out My intent, proclaim it widely, and ensure all know."',
    'Field ministers were to proclaim the edict widely before the army.',
  ],
  s0356: [
    'Hereditary offices were granted for battle-death regional commanders Dorjinzhab, Li Shaozu, and others.',
    'Dorjinzhab, Li Shaozu, and other fallen regional commanders received hereditary offices.',
  ],
  s0357: [
    'On day dingyou, descendants of worthies were granted: juren to Grand Secretary Li Guangdi\'s fourth-generation descendant Weihan and Minister Tang Bin\'s fourth-generation descendant Nianzeng; county magistrate to Provincial Governor Fu Honglie\'s sixth-generation descendant Zhenglong, formerly assistant county magistrate.',
    'On dingyou day, Weihan and Nianzeng received juren and Zhenglong became county magistrate.',
  ],
  s0358: [
    'On day jihai, edict: "I am about to go to worship at the tombs; spring seedlings are sprouting—ministers are ordered to guard the people\'s fields and not permit trampling the grain."',
    'On jihai day, an edict ordered ministers to guard crops during the tomb visit.',
  ],
  s0359: [
    'Merit was recorded for Jiangxi gentry and people who assisted in suppressing teaching-bandit Liu Liandeng; Jiangxi Ningzhou was renamed Yiningzhou.',
    'Jiangxi merit was recorded for helping suppress Liu Liandeng, and Ningzhou was renamed Yiningzhou.',
  ],
  s0360: [
    'On day xinchou, the Emperor went to worship at the tombs.',
    'On xinchou day, the Emperor visited the tombs.',
  ],
  s0361: [
    'On day yisi, the mourning-garment ritual was performed.',
    'On yisi day, the mourning-garment rite was performed.',
  ],
  s0362: [
    'Summer, fourth month, new moon on day dingwei: the Emperor returned to the capital.',
    'At the fourth-month new moon, dingwei, the Emperor returned to Beijing.',
  ],
  s0363: [
    'On day jiwei, because Sichuan people had contributed funds urgently for public service, next year\'s quota tax was remitted for eighty-six prefectures, departments, and counties including Suining.',
    'On jiwei day, eighty-six Sichuan districts including Suining were forgiven next year\'s tax for public contributions.',
  ],
  s0364: [
    'On day xinyou, Empress Niohuru was installed.',
    'On xinyou day, Empress Niohuru was enthroned.',
  ],
  s0365: [
    'On day renxu, Associate Grand Secretary and Huguang Governor-General Shulin died; Wu Xiongguang was made Huguang Governor-General.',
    'On renxu day, Shulin died; Wu Xiongguang took Huguang.',
  ],
  s0366: [
    'Delengtai memorialized capture of bandit chief Zhang Yunshou.',
    'Delengtai reported Zhang Yunshou captured.',
  ],
  s0367: [
    'On day bingyin, for capturing Wang Tingzhao, Gao Er, and Ma Wu, Eledengbao was advanced to second-class viscount and Yang Yuchun Commandant of Cavalry.',
    'On bingyin day, capturing Wang Tingzhao, Gao Er, and Ma Wu brought Eledengbao a second-class viscountage and Yang Yuchun cavalry commandant rank.',
  ],
  s0368: [
    'On day wuchen, Liang-Guang Governor-General Jiqing was made associate grand secretary.',
    'On wuchen day, Jiqing of Liang-Guang became associate grand secretary.',
  ],
  s0369: [
    'On day xinwei, Gu Gao and 275 others were granted jinshi with differences in rank.',
    'On xinwei day, Gu Gao and 275 others received jinshi degrees.',
  ],
  s0370: [
    'Fifth month, day jimao: Wang Xi\'s great-great-grandson Yuan Hong of worthy descendants was granted juren.',
    'In month 5, jimao, Yuan Hong of Wang Xi\'s line received juren.',
  ],
  s0371: [
    'On day jiashen, the Emperor sacrificed at the Wenchang Temple; it was first ordered entered in the sacrificial register.',
    'On jiashen day, the Emperor sacrificed at Wenchang Temple, newly added to the register.',
  ],
  s0372: [
    'On day yiyou, Sichuan battle-death regional commander Zhu Shedou was treated as regional commander in condolences; hereditary office was granted.',
    'On yiyou day, Zhu Shedou of Sichuan was mourned as a regional commander and given a hereditary office.',
  ],
  s0373: [
    'On day bingxu, regional commanders were ordered to attend audience in rotation.',
    'On bingxu day, regional commanders were ordered to rotate capital audiences.',
  ],
  s0374: [
    'The Fengtian prefectural vice prefect served as education intendant, changed every three years.',
    'Fengtian\'s vice prefect served as education intendant on a three-year rotation.',
  ],
  s0375: [
    'On day yisi, Eledengbao was made Minister of the Court of Colonial Affairs.',
    'On yisi day, Eledengbao became minister of colonial affairs.',
  ],
  s0376: [
    'Sixth month, day renzi: heavy rain.',
    'In month 6, renzi, heavy rain fell.',
  ],
  s0377: [
    'The Yongding River burst; ministers were dispatched to comfort flood victims.',
    'The Yongding River broke its banks and ministers were sent to comfort flood victims.',
  ],
  s0378: [
    'Because of flood disaster, the autumn hunt of this year was suspended.',
    'This year\'s autumn hunt was canceled because of flooding.',
  ],
  s0379: [
    'Jiang Sheng was dismissed and sent to serve at the Yongding River works.',
    'Jiang Sheng was dismissed and sent to the Yongding River project.',
  ],
  s0380: [
    'Chen Dawen was called up as acting Zhili governor-general.',
    'Chen Dawen was called up to act as Zhili governor-general.',
  ],
  s0381: [
    'On day bingchen, rain fell again.',
    'On bingchen day, rain fell again.',
  ],
  s0382: [
    'Xi\'an general Heng Rui died.',
    'Heng Rui, Xi\'an general, died.',
  ],
  s0383: [
    'On day xinwei, the Emperor walked in prayer at the Altar of Soil and Grain for clear weather.',
    'On xinwei day, the Emperor prayed on foot at the Altar of Soil and Grain for sun.',
  ],
  s0384: [
    'That day it cleared.',
    'The sky cleared that day.',
  ],
  s0385: [
    'Lebao memorialized that eastern-route green and blue numbered bandits were entirely destroyed.',
    'Lebao reported eastern green and blue bandit bands entirely destroyed.',
  ],
  s0386: [
    'Seventh month, day gengchen: grain rations for one month were specially issued to capital garrison troops.',
    'In month 7, gengchen, capital garrison troops received a special month\'s grain.',
  ],
  s0387: [
    'On day jiashen, Nayanchenbao and Baining\'a were ordered to repair Yongding River works.',
    'On jiashen day, Nayanchenbao and Baining\'a were ordered to repair the Yongding River.',
  ],
  s0388: [
    'Lebao memorialized capture of bandit leaders Xu Tianshou and Wang Denggao.',
    'Lebao reported Xu Tianshou and Wang Denggao captured.',
  ],
  s0389: [
    'On day wuxu, Rehe flood victims were relieved.',
    'On wuxu day, Rehe flood victims received relief.',
  ],
  s0390: [
    'Eighth month, day dingsi: Eledengbao memorialized capture of bandit chiefs Wang Shihu and Ran Tiansi.',
    'In month 8, dingsi, Eledengbao reported Wang Shihu and Ran Tiansi captured.',
  ],
  s0391: [
    'Lebao memorialized that Qishiwu had captured bandit leaders Liu Qingxuan, Tang Buwu, and others.',
    'Lebao reported Qishiwu had captured Liu Qingxuan, Tang Buwu, and others.',
  ],
  s0392: [
    'On day jiazi, Lebao memorialized capture of bandit chief Ran Xuesheng and others; he was enfeoffed as third-class baron.',
    'On jiazi day, Lebao reported Ran Xuesheng captured and was made a third-class baron.',
  ],
  s0393: [
    'Ninth month, day jichou: the Great Qing Collected Statutes were continued in revision.',
    'In month 9, jichou, revision of the Great Qing Collected Statutes continued.',
  ],
  s0394: [
    'Winter, tenth month, day bingwu: the Yongding River was joined and closed.',
    'In month 10, bingwu, the Yongding River closure was completed.',
  ],
  s0395: [
    'On day guichou, Eledengbao memorialized capture of bandit chief Xin Dou.',
    'On guichou day, Eledengbao reported Xin Dou captured.',
  ],
  s0396: [
    'Delengtai memorialized that bandit chief Long Shaozhou was killed.',
    'Delengtai reported Long Shaozhou killed.',
  ],
  s0397: [
    'On day guihai, an edict recorded merit for Sichuan and Shaanxi armies; Eledengbao was advanced to third-class earl, Delengtai to second-class earl, Saichong\'a Commandant of Cavalry, and Wenchun Cloud-Rider Commandant.',
    'On guihai day, Sichuan and Shaanxi merit brought Eledengbao a third-class earldom, Delengtai a second-class earldom, and rewards for Saichong\'a and Wenchun.',
  ],
  s0398: [
    'Eleventh month, day jiashen: Guizhou Governor Yisang\'a was granted death for arrogance, depravity, and deceit.',
    'In month 11, jiashen, Guizhou Governor Yisang\'a was ordered to die for arrogance and deceit.',
  ],
  s0399: [
    'On day guisi, edict: "Military affairs will soon be concluded; settling the local braves is an essential follow-up matter."',
    'On guisi day, an edict said military affairs would soon end and local braves must be settled.',
  ],
  s0400: [
    '"Take comprehensive counsel in detail and report."',
    'Ministers were to plan settlement in detail and report.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_016_b04.mjs <translation.json>'
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
