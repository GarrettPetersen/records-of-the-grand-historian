#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'On day gengchen, the Emperor paid respects at the imperial tombs.',
    'On gengchen day, the Emperor visited the imperial tombs.',
  ],
  s0302: [
    'On day xinsi, Shao Mubu was made governor-general of Jiangnan and Jiangxi.',
    'On xinsi day, Shao Mubu became governor-general of Jiangnan and Jiangxi.',
  ],
  s0303: [
    'On day guiwei, because private coining was widespread in Shandong, permission was given to pay the regular tax in small coins, and officials were charged to transport them to the capital for recoining.',
    'On guiwei day, Shandong was allowed to pay taxes in small coin due to widespread private minting; officials were ordered to send it to Beijing for recoining.',
  ],
  s0304: [
    'On day jiashen, the Emperor toured beyond the passes.',
    'On jiashen day, the Emperor toured the frontier.',
  ],
  s0305: [
    'The Dalai Lama of Tibet died; his subordinate the Depa concealed it and installed a false Dalai Lama.',
    "Tibet's Dalai Lama died; the Depa hid the death and installed a false Dalai Lama.",
  ],
  s0306: [
    'Lhasang Khan killed the Depa and presented the false lama.',
    'Lhasang Khan killed the Depa and delivered the false lama to the court.',
  ],
  s0307: [
    "The Xining lama Shangnan Duo'erji reported it.",
    "The Xining lama Shangnan Duo'erji reported the matter.",
  ],
  s0308: [
    'Twelfth month, day renyin: the Emperor returned to the palace.',
    'In the twelfth month, on renyin day, the Emperor returned to the palace.',
  ],
  s0309: [
    'An edict ordered that prisoners under the delayed-execution procedure for three or four years have their sentence reduced by one degree.',
    'An edict reduced sentences one grade for prisoners awaiting clemency review for three or four years.',
  ],
  s0310: [
    'On day xinhai, Guo Shilong was dismissed; Zhao Hongcan was made governor-general of Guangdong and Guangxi.',
    'Guo Shilong was dismissed and Zhao Hongcan became governor-general of Guangdong and Guangxi.',
  ],
  s0311: [
    'This year, disaster land tax for thirty-two prefectures and counties in Zhili, Jiangnan, Fujian, Jiangxi, Huguang, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for disaster areas in thirty-two districts across several provinces.',
  ],
  s0312: [
    'Korea sent tribute.',
    'Korea paid tribute.',
  ],
  s0313: [
    'Forty-sixth year, spring, first month, day dingmao: an edict said: "On the southern tour to inspect the rivers, going and returning by boat, We shall not lodge in houses.',
    'In the forty-sixth year, on the first day of spring, an edict ordered that on the southern river inspection tour the Emperor would travel by boat and not stay in houses.',
  ],
  s0314: [
    'Where We pass, lavish supplies are forbidden."',
    'No lavish supplies were to be provided along the route."',
  ],
  s0315: [
    'On day dingsi, Mei Yong was dismissed; Xiao Yongzao was made Censor-in-chief of the Left.',
    'On dingsi day, Mei Yong left office and Xiao Yongzao became Left Censor-in-chief.',
  ],
  s0316: [
    'Second month, day wuxu: the court halted at Taizhuang; commoners came to present food.',
    'In the second month, at Taizhuang, locals brought food as gifts.',
  ],
  s0317: [
    'He summoned elders before him, inquired in detail into farming and livelihood, and only after a long while set out again.',
    'He called elders forward, asked at length about farming and livelihood, then moved on.',
  ],
  s0318: [
    'On day guimao, the Emperor inspected the Huai diversion works; he landed at Qingkou and went to Cao Family Temple, saw the terrain joined to hills and could not be dredged open, while the channel route would have cut straight through commoners\' houses and graves—all to be destroyed.',
    'On guimao day, inspecting Huai works, he found dredging at Cao Family Temple would ruin homes and graves on the route.',
  ],
  s0319: [
    'He reprimanded Zhang Pengge and others, then halted the project; residents along the road cheered "Long live the Emperor!"',
    'He rebuked Zhang Pengge and halted the works; roadside residents cheered.',
  ],
  s0320: [
    'He ordered a separate survey of the river channel below the natural barrier.',
    'A separate survey was ordered for the channel below the natural dam.',
  ],
  s0321: [
    'Third month, day jiwei: the Emperor halted at Jiangning.',
    'In the third month, the Emperor stayed at Jiangning.',
  ],
  s0322: [
    'On day yisi, the Emperor halted at Suzhou.',
    'On yisi day, the Emperor stayed at Suzhou.',
  ],
  s0323: [
    'Summer, fourth month, day jiashen: the Emperor halted at Hangzhou.',
    'In the fourth month, the Emperor stayed at Hangzhou.',
  ],
  s0324: [
    'An edict said: "We have lately, because of inspecting the rivers, halted on the Huai.',
    'An edict said the Emperor had halted on the Huai while inspecting the rivers.',
  ],
  s0325: [
    'Officials and people of Jiangsu and Zhejiang begged Us to visit; We reluctantly yielded to the multitude\'s wish and crossed the river southward.',
    'Jiangsu and Zhejiang officials and people begged a visit; the Emperor reluctantly crossed south.',
  ],
  s0326: [
    'Now the second wheat crop is nearly ripe; commoners crowding along the river to watch cannot but trample it.',
    'With the second wheat crop nearly ripe, crowds along the river risked trampling the fields.',
  ],
  s0327: [
    'Order that welcoming and escort cease, to show Our intent of valuing agriculture and loving the people."',
    'Welcoming parties were ordered to cease, to show the Emperor\'s care for farmers."',
  ],
  s0328: [
    "On day wushen, E'kexun was made general at Jiangning and Yin Tai provincial commander of Gansu.",
    'E\'kexun became Jiangning general; Yin Tai became Gansu provincial commander.',
  ],
  s0329: [
    'Fifth month, first day renzi: the court halted at Shanyang; river officials were shown the strategic plan.',
    'On the first of the fifth month, at Shanyang, the Emperor briefed river officials on strategy.',
  ],
  s0330: [
    'On day guiyou, the Emperor returned to the capital.',
    'On guiyou day, the Emperor returned to Beijing.',
  ],
  s0331: [
    'On day bingzi, Minister A Shan was dismissed from office; Zhang Pengge\'s designation as Palace Guardian was stripped.',
    'Minister A Shan was dismissed and Zhang Pengge lost his Palace Guardian title.',
  ],
  s0332: [
    'On day wuyin, the late river-course director-general Jin Fu was posthumously granted Grand Guardian of the Heir Apparent and a hereditary office.',
    'Late director-general Jin Fu received posthumous Grand Guardian rank and a hereditary post.',
  ],
  s0333: [
    'Fujian provincial commander Wu Ying was given the additional title Weilüe General.',
    'Wu Ying, Fujian commander, received the title Weilüe General.',
  ],
  s0334: [
    'Transport Commissioner Gao Tianjue, who died in the line of duty, was granted an official rank and posthumous title Zhonglie.',
    'Gao Tianjue, killed in service, received rank and posthumous name Zhonglie.',
  ],
  s0335: [
    "Da'erzhan was made general at Jingzhou.",
    "Da'erzhan became Jingzhou general.",
  ],
  s0336: [
    'Sixth month, day dinghai: the Emperor toured beyond the passes.',
    'In the sixth month, the Emperor toured the frontier.',
  ],
  s0337: [
    'Chao Ketuo was made Censor-in-chief of the Left; Guo Shilong was recalled as governor-general of Huguang.',
    'Chao Ketuo became Left Censor-in-chief; Guo Shilong was recalled as Huguang governor-general.',
  ],
  s0338: [
    'Seventh month, day renzi: the Emperor halted at Rehe.',
    'In the seventh month, the Emperor stayed at Rehe.',
  ],
  s0339: [
    'On day dingmao, the imperial carriage set out from Karahotun to tour the Mongol tribes.',
    'On dingmao day, the court left Karahotun to tour Mongol tribes.',
  ],
  s0340: [
    'Outer vassals came to court; each was granted robes and silks.',
    'Border vassals came to court and received robes and silks.',
  ],
  s0341: [
    "Eighth month, day jiachen: the court halted at Tao'erbila; Supervisor Sengge Chaq and Dulatu of the Solon who welcomed the carriage, and hunters, were granted silver coins.",
    "At Tao'erbila, Solon leaders and hunters who welcomed the tour received silver.",
  ],
  s0342: [
    'Miao of Sanjiang in Guizhou rebelled; they were suppressed and pacified.',
    'Guizhou Sanjiang Miao rebels were suppressed.',
  ],
  s0343: [
    "Ninth month, day guihai: the Emperor halted at He'erbotu Gacha.",
    "In the ninth month, the Emperor halted at He'erbotu Gacha.",
  ],
  s0344: [
    'On day jiazi, Chakhar and Barhu troops were reviewed in archery.',
    'Chakhar and Barhu troops held an archery review.',
  ],
  s0345: [
    'Winter, tenth month, day xinsi: because Jiangsu and Zhejiang suffered drought, treasury funds were issued to buy grain for price-stabilizing sale, grain transport was diverted for relief, and overdue taxes were remitted.',
    'Drought in Jiangsu and Zhejiang brought treasury grain sales, diverted transport grain for relief, and tax remissions.',
  ],
  s0346: [
    'Outer vassals presented camels and horses; these were declined.',
    'Vassal gifts of camels and horses were refused.',
  ],
  s0347: [
    'On day wuxu, the Emperor returned to the capital.',
    'On wuxu day, the Emperor returned to Beijing.',
  ],
  s0348: [
    'On day jihai, the Ministry of Revenue proposed increasing Yunnan mining tax; the order was to keep the old quota.',
    'A proposal to raise Yunnan mining tax was rejected; the old quota stood.',
  ],
  s0349: [
    'On day gengzi, Jin Shirong was dismissed; Xiao Yongzao was made Minister of War.',
    'Jin Shirong left office; Xiao Yongzao became Minister of War.',
  ],
  s0350: [
    'Eleventh month, first day jiwei: an edict said: "Lately, because of drought disaster in Jiangsu and Zhejiang, We at once ordered tax reduction, remission of arrears, and diversion of transport grain.',
    'An edict noted recent Jiangsu and Zhejiang drought relief: tax cuts, arrears remitted, transport grain diverted.',
  ],
  s0351: [
    'The poll-tax money due next year from both Jiangsu and Zhejiang provinces is entirely remitted.',
    "Next year's poll tax in both provinces was fully remitted.",
  ],
  s0352: [
    'In disaster areas, the regular land tax is also remitted.',
    'Regular land tax was also remitted in affected districts.',
  ],
  s0353: [
    'So that within one year common people never appear at government yamens and may rest at ease—fulfilling Our intent of showing favor and love to the black-haired people."',
    'The aim was for commoners to avoid yamens and rest easy for a year."',
  ],
  s0354: [
    'An edict said that Taiwan sojourners lacking food who wished to return home might cross on official vessels.',
    'Taiwan settlers without food could return home on official ships.',
  ],
  s0355: [
    'Wang Wuli was made Han commander-in-chief.',
    'Wang Wuli became Han commander-in-chief.',
  ],
  s0356: [
    'On day jihai, an edict ordered Jiangsu and Zhejiang prefectures and counties to repair waterworks against drought and flood.',
    'Jiangsu and Zhejiang were ordered to repair waterworks against drought and flood.',
  ],
  s0357: [
    'Twelfth month, day bingxu: Wenda was made Grand Secretary, Ma\'erhan Minister of Personnel, Geng\'e Minister of War, Chao Ketuo Minister of Punishments, and Fu Ning\'an and Wang Jiuling Censors-in-chief of the Left.',
    "Wenda, Ma'erhan, Geng'e, Chao Ketuo, Fu Ning'an, and Wang Jiuling received high appointments.",
  ],
  s0358: [
    'On day bingwu, princes, inner ministers from the rank of prince downward, and guards were granted silver in varying amounts.',
    'Princes, inner ministers, and guards received graded silver gifts.',
  ],
  s0359: [
    'This year, disaster land tax for thirty-two prefectures, counties, and garrisons in Zhili, Jiangnan, Jiangxi, Fujian, Huguang, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for thirty-two disaster districts across several provinces.',
  ],
  s0360: [
    'Korea and Ryukyu sent tribute.',
    'Korea and Ryukyu paid tribute.',
  ],
  s0361: [
    'Forty-seventh year, spring, first month, day gengwu: bandits Zhang Nianyi, Zhu San, and others of Great Lanshan in Zhejiang raided Cixi, Shangyu, and Sheng counties; government troops captured and pacified them.',
    'In the forty-seventh year, Lanshan bandits Zhang Nianyi and Zhu San raided Zhejiang counties and were suppressed.',
  ],
  s0362: [
    'On day xinwei, reconstruction of the Southern Sacred Peak temple was completed; the Emperor composed the stele text.',
    'The Southern Peak temple restoration was finished with an imperial inscription.',
  ],
  s0363: [
    "Aisin Gioro Meng'eluo was made general at Fengtian.",
    "Aisin Gioro Meng'eluo became Fengtian general.",
  ],
  s0364: [
    'On day yihai, an edict ordered that four hundred thousand shi of transport grain from Huguang and Jiangxi be held back and kept in six Jiangnan prefectures for price-stabilizing sale.',
    'Four hundred thousand shi of Huguang and Jiangxi grain were held in six Jiangnan prefectures for relief sales.',
  ],
  s0365: [
    'Second month, day gengyin: the Emperor attended the Classics lecture.',
    'In the second month, the Emperor held the Classics lecture.',
  ],
  s0366: [
    'On day renchen, Vice Minister Mu Dan was sent to investigate the Great Lanshan case; Academician Erge the Red Miao case.',
    'Mu Dan was sent to investigate the Lanshan case; Erge the Red Miao case.',
  ],
  s0367: [
    'On day jiawu, the Emperor toured the capital region.',
    'On jiawu day, the Emperor toured the capital region.',
  ],
  s0368: [
    'On day bingwu, an edict said that Siamese envoys bringing native goods might trade wherever they went, exempt from tax.',
    'Siamese envoys might trade local goods tax-free wherever they traveled.',
  ],
  s0369: [
    'Third month, day bingchen: the Emperor returned and halted at the Shenyang Spring Garden.',
    'In the third month, the Emperor returned to the Shenyang Spring Garden.',
  ],
  s0370: [
    'On day wuwu, Xisiha and Li Shengxun were made Han commanders-in-chief.',
    'Xisiha and Li Shengxun became Han commanders-in-chief.',
  ],
  s0371: [
    'Intercalary third month, first day wuyin: reconstruction of the Northern Peak temple was completed; the Emperor composed the stele text.',
    'The Northern Peak temple restoration was finished with an imperial inscription.',
  ],
  s0372: [
    'On day yiwei, Shi Shibiao was made provincial commander of Guangdong and Xi Zhu general at Xi\'an.',
    'Shi Shibiao became Guangdong commander; Xi Zhu became Xi\'an general.',
  ],
  s0373: [
    'Summer, fourth month, day jiyou: Song Luo was dismissed; Xu Chao was made Minister of Personnel and Qi Shiwu governor-general of Sichuan and Shaanxi.',
    'Song Luo left office; Xu Chao became Minister of Personnel and Qi Shiwu Sichuan-Shaanxi governor-general.',
  ],
  s0374: [
    'On day wuwu, Shandong Governor Zhao Shixian reported capturing Zhu San and his sons; they were sent under escort to Zhejiang.',
    'Shandong reported Zhu San and his sons captured and sent to Zhejiang.',
  ],
  s0375: [
    'The Emperor said: "Zhu San and his sons roam teaching; they lodge and eat at others\' homes.',
    "The Emperor said Zhu San's family were itinerant teachers living on hospitality.",
  ],
  s0376: [
    'If people are seized for this, too many will be implicated by association—transmit this instruction so all know."',
    'He warned against sweeping arrests that would implicate too many innocents."',
  ],
  s0377: [
    'On day xinyou, Huguang provincial commander Yu Yimou secretly requested extermination of the Red Miao.',
    'Yu Yimou secretly asked to exterminate the Red Miao.',
  ],
  s0378: [
    'The Emperor, because the Red Miao had committed no great crime, did not permit it.',
    'The Emperor refused, as the Red Miao had not committed major crimes.',
  ],
  s0379: [
    'Alana was made Mongol commander-in-chief; Li Linsheng Han commander-in-chief.',
    'Alana became Mongol commander-in-chief; Li Linsheng Han commander-in-chief.',
  ],
  s0380: [
    'Inner minister Mingzhu died; the third imperial son Yin Zhi was ordered to offer libations; four horses were granted.',
    'Minister Mingzhu died; Prince Yin Zhi offered libations and four horses were granted.',
  ],
  s0381: [
    'Fifth month, day jiashen: Wang Hongxu was made Minister of Revenue, Fu Ning\'an Minister of Rites, and Mu Helun Censor-in-chief of the Left.',
    'Wang Hongxu, Fu Ning\'an, and Mu Helun received ministerial appointments.',
  ],
  s0382: [
    'On day bingxu, the Emperor toured beyond the passes.',
    'On bingxu day, the Emperor toured the frontier.',
  ],
  s0383: [
    'On day yiwei, an edict remitted the guilt-by-association punishment for Wang Zhaojun of Taicang and his uncles and brothers, associates of the Great Lanshan bandits.',
    "Guilt-by-association for Wang Zhaojun's kin in the Lanshan case was remitted.",
  ],
  s0384: [
    'Sixth month, day dingwei: the Emperor halted at Rehe.',
    'In the sixth month, the Emperor stayed at Rehe.',
  ],
  s0385: [
    'On day dingsi, the Nine Ministers reported on the Great Lanshan case and received the rescript: "Execute the chief culprits; Zhu San and his sons cannot be pardoned; those implicated by association may be changed to exile.',
    'The Lanshan case verdict: execute ringleaders; Zhu San family not pardoned; associates exiled instead.',
  ],
  s0386: [
    'Governor Wang Ran and provincial commander Wang Shichen are both retained in office; wounded officers and soldiers are all to receive commendation in the records."',
    'Governor Wang Ran and Commander Wang Shichen kept their posts; wounded troops were to be honored."',
  ],
  s0387: [
    'On day dingmao, the Manchu literary mirror was completed; the Emperor composed the preface.',
    'The Manchu literary mirror was completed with an imperial preface.',
  ],
  s0388: [
    'Autumn, seventh month, day dingchou: the Ministry of Punishments was instructed that exiles who had been spared death but committed crimes while serving sentence are to be punished according to capital law.',
    'Exiles spared death who reoffended while serving sentence were to face capital punishment.',
  ],
  s0389: [
    'On day guiwei, the strategic account of pacifying the northern deserts was completed; the Emperor personally composed the preface.',
    'The northern desert pacification record was completed with an imperial preface.',
  ],
  s0390: [
    'On day renchen, the Emperor went on the hunting encirclement.',
    'On renchen day, the Emperor went hunting.',
  ],
  s0391: [
    'Erge reported on the Red Miao case: Liao Laozai and others who killed people were beheaded and exposed; Garrison Commander Wang Yingrui, who had sent troops to Miao stockades on his own authority, was sent into exile—these were approved.',
    "Erge's Red Miao verdict: Liao Laozai executed; Commander Wang Yingrui exiled for unauthorized troop deployment.",
  ],
  s0392: [
    'Eighth month, first day jiachen: there was a solar eclipse.',
    'On the first of the eighth month there was a solar eclipse.',
  ],
  s0393: [
    "On day renxu, the Emperor returned from the tour and halted at Yong'an Bai'ang'a.",
    "On renxu day, the Emperor returned and halted at Yong'an Bai'ang'a.",
  ],
  s0394: [
    'Ninth month, day yihai: the Emperor halted at Burha Sutai.',
    'In the ninth month, the Emperor halted at Burha Sutai.',
  ],
  s0395: [
    'On day dingchou, court ministers were summoned to the traveling palace; the crimes of Crown Prince Yinreng were proclaimed; he was ordered seized and sent to the capital for close confinement.',
    "Ministers were summoned; Crown Prince Yinreng's crimes were proclaimed; he was seized and sent to Beijing for confinement.",
  ],
  s0396: [
    'On day jichou, the Emperor returned to the capital.',
    'On jichou day, the Emperor returned to Beijing.',
  ],
  s0397: [
    'On day dingyou, Crown Prince Yinreng was deposed; this was proclaimed throughout the realm.',
    'Crown Prince Yinreng was deposed and the decree published empire-wide.',
  ],
  s0398: [
    'Winter, tenth month, day jiachen: Beile Yin Zhen\'s title was stripped.',
    'In the tenth month, Beile Yin Zhen was stripped of his rank.',
  ],
  s0399: [
    'On day yimao, Wang Yan was made Minister of Works and Zhang Pengge Minister of Punishments.',
    'Wang Yan became Minister of Works; Zhang Pengge Minister of Punishments.',
  ],
  s0400: [
    'On day xinyou, the Emperor went to the Southern Park for the hunting encirclement.',
    'On xinyou day, the Emperor hunted at the Southern Park.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_008_b04.mjs <translation.json>'
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
