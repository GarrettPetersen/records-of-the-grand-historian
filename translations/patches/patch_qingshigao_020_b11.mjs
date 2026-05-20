#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1001: [
    'On day wuwu, Jiangxi government troops recovered Yudu, Le\'an, Chonghua, and Yihuang.',
    'On wuwu day, Jiangxi forces retook Yudu, Le\'an, Chonghua, and Yihuang.',
  ],
  s1002: [
    'On day xinyou, English and French ships reached the Tientsin passes.',
    'On xinyou day, Anglo-French vessels arrived at the Tientsin barrier.',
  ],
  s1003: [
    'Grand Secretary Guiliang and Minister Huashana were ordered to go handle barbarian affairs.',
    'Guiliang and Huashana were sent to manage foreign affairs.',
  ],
  s1004: [
    'Jiangxi rebels fled into Zhejiang and took Chuzhou and Yongkang.',
    'Jiangxi rebels crossed into Zhejiang and captured Chuzhou and Yongkang.',
  ],
  s1005: [
    'On day renxu, Hubei government troops recovered Jiujiang; Guanwen and Hu Linyi were advanced to Junior Guardian of the Heir Apparent, and Li Xubin was given acting governor rank.',
    'On renxu day, Hubei forces retook Jiujiang; Guanwen and Hu Linyi became Junior Guardians of the Heir Apparent, and Li Xubin received acting governor rank.',
  ],
  s1006: [
    'On day yichou, English and French troops withdrew to San Cha He; Russia and America sent letters requesting that negotiating ministers must have full discretionary authority before talks could open.',
    'On yichou day, Anglo-French forces pulled back to San Cha He; Russian and American letters insisted plenipotentiaries with full discretion were needed before negotiations could begin.',
  ],
  s1007: [
    'Guiliang and others reported it; an edict permitted discretionary authority.',
    'Guiliang reported in and the court authorized discretionary powers.',
  ],
  s1008: [
    'On day bingyin, Sengge Rinchen was ordered to wear the Imperial Commissioner seal and handle defense affairs.',
    'On bingyin day, Sengge Rinchen was given the Imperial Commissioner seal to manage coastal defense.',
  ],
  s1009: [
    'On day wuchen, Sengbao memorialized recovery of Lu\'an.',
    'On wuchen day, Sengbao reported the recapture of Lu\'an.',
  ],
  s1010: [
    'On day yisi, an edict ordered military camps in each province to select and train cavalry.',
    'On yisi day, every provincial camp was told to pick and drill mounted units.',
  ],
  s1011: [
    'On day gengwu, He Chun was ordered concurrently to handle Zhejiang military affairs.',
    'On gengwu day, He Chun was also put in charge of Zhejiang operations.',
  ],
  s1012: [
    'English ships departed from Dagu.',
    'British vessels left Dagu.',
  ],
  s1013: [
    'Guiliang and others memorialized that the English treaty provided for trade at Zhenjiang and Hankou, steam navigation on the Yangtze, consuls at chosen sites, and envoys resident in the capital.',
    'Guiliang reported English terms for Zhenjiang and Hankou trade, Yangtze steamers, consular posts, and ministers resident in Beijing.',
  ],
  s1014: [
    'After a long delay the Emperor assented.',
    'The Emperor finally approved.',
  ],
  s1015: [
    'Fifth month, day bingzi: Anhui bandits took Huang\'an in Hubei.',
    'In the fifth month, on bingzi day, Anhui rebels seized Huang\'an in Hubei.',
  ],
  s1016: [
    'Guiliang and Huashana memorialized that the English envoy pressed hard to conclude a treaty and would not see Qiying.',
    'Guiliang and Huashana reported the English minister insisting on a treaty and refusing to meet Qiying.',
  ],
  s1017: [
    'Qiying requested to return to the capital; an edict forbade it.',
    'Qiying asked to go back to Beijing and was ordered to stay.',
  ],
  s1018: [
    'On day wuyin, Nian bandits took Huaiyuan.',
    'On wuyin day, Nian rebels captured Huaiyuan.',
  ],
  s1019: [
    'On day jimao, Yishan memorialized requesting cession of vacant lands on the left bank of the Heilongjiang to the Russians.',
    'On jimao day, Yishan asked to cede vacant Heilongjiang left-bank lands to Russia.',
  ],
  s1020: [
    'On day jiashen, Guiliang and others memorialized that Russia agreed to mediate; the Russians\' overland passage was granted first.',
    'On jiashen day, Guiliang reported Russian mediation and prior approval of Russian overland travel.',
  ],
  s1021: [
    'On day dinghai, court ministers were ordered to deliberate on peace and war and choose the lesser of two harms.',
    'On dinghai day, ministers were told to weigh peace against war and take the lesser evil.',
  ],
  s1022: [
    'On day wuzi, Guiliang and others memorialized that the English said China was merely delaying and would abandon peace and speak of war.',
    'On wuzi day, Guiliang reported the English warning that delay meant abandoning talks for war.',
  ],
  s1023: [
    'Grand Secretary Yucheng died; the Emperor personally attended to bestow funeral offerings.',
    'Grand Secretary Yucheng died and the Emperor attended the funeral rites in person.',
  ],
  s1024: [
    'On day gengyin, Guiliang and others memorialized presenting the fifty-one-article English-French treaty and asked to conclude Russian and American treaties first.',
    'On gengyin day, Guiliang submitted the fifty-one-clause Anglo-French treaty and urged Russian and American treaties first.',
  ],
  s1025: [
    'On day renchen, Hubei government troops recovered Huang\'an and Macheng.',
    'On renchen day, Hubei forces retook Huang\'an and Macheng.',
  ],
  s1026: [
    'Fujian government troops recovered Guangze.',
    'Fujian forces recaptured Guangze.',
  ],
  s1027: [
    'Guangdong government troops recovered Wuzhou in Guangxi.',
    'Guangdong forces retook Wuzhou in Guangxi.',
  ],
  s1028: [
    'Qiling was ordered by dispatch to mobilize the armies of Xiao Qijiang, Zhang Yunlan, and Wang Kaihua from Qimen to advance in relief of Zhejiang.',
    'Qiling was told to move Xiao Qijiang, Zhang Yunlan, and Wang Kaihua from Qimen to reinforce Zhejiang.',
  ],
  s1029: [
    'On day guisi, Qiying returned to the capital without authorization and was ordered to commit suicide.',
    'On guisi day, Qiying left his post for Beijing without leave and was ordered to take his own life.',
  ],
  s1030: [
    'Grand Tutor Du Kun died; the Emperor personally attended to bestow funeral offerings.',
    'Grand Tutor Du Kun died and the Emperor attended the funeral rites in person.',
  ],
  s1031: [
    'On day yiwei, Zeng Guofan was ordered to handle Zhejiang military affairs.',
    'On yiwei day, Zeng Guofan was put in charge of Zhejiang operations.',
  ],
  s1032: [
    'On day dingyou, Guiliang and Huashana memorialized presenting the treaties of Russia, America, England, and France.',
    'On dingyou day, Guiliang and Huashana submitted the Russian, American, English, and French treaties.',
  ],
  s1033: [
    'Receiving the rescript: "The seals have already been affixed; now the vermillion endorsement approves as deliberated; the four powers should be shown to proceed accordingly.',
    'The rescript read: "Seals are already applied; the vermillion endorsement now approves as discussed; inform all four powers to act accordingly.',
  ],
  s1034: [
    'As for commercial tax schedules, they will be discussed at Shanghai.',
    'Commercial tariffs will be negotiated at Shanghai.',
  ],
  s1035: [
    '"On day gengzi, Jiangbei government troops recovered Jiangpu and Lai\'an.',
    '"On gengzi day, Jiangbei forces retook Jiangpu and Lai\'an.',
  ],
  s1036: [
    'On day jiachen, all barbarian ships withdrew from the inner rivers.',
    'On jiachen day, every foreign vessel left the inland waterways.',
  ],
  s1037: [
    'Vice Minister of Personnel Kuang Yuan and Hanlin Academician Wen Xiang were ordered to serve on the Grand Council.',
    'Kuang Yuan and Wen Xiang were added to the Grand Council.',
  ],
  s1038: [
    'Sixth month, day jiyou: Guiliang, Huashana, Vice Minister Jipu, and Wubeiyuan Director Mingshan were ordered to Jiangsu to confer on commercial tax schedules.',
    'In the sixth month, on jiyou day, Guiliang, Huashana, Jipu, and Mingshan were sent to Jiangsu to negotiate trade tariffs.',
  ],
  s1039: [
    'Jiangxi government troops recovered Xincheng and Jinxi.',
    'Jiangxi forces retook Xincheng and Jinxi.',
  ],
  s1040: [
    'On day guichou, Fujian bandits took Jianning.',
    'On guichou day, Fujian rebels seized Jianning.',
  ],
  s1041: [
    'Fuxing was dismissed; Zhou Tianshou was placed in command of his army to go relieve Fujian.',
    'Fuxing was removed and Zhou Tianshou took his troops to aid Fujian.',
  ],
  s1042: [
    'Sang Chunrong was summoned to the capital; Zhang Liangji was made Yunnan governor.',
    'Sang Chunrong was called to Beijing and Zhang Liangji became Yunnan governor.',
  ],
  s1043: [
    'On day jiayin, Guangxi troops recovered Xiangzhou.',
    'On jiayin day, Guangxi forces retook Xiangzhou.',
  ],
  s1044: [
    'On day dingsi, Zhejiang rebels took Shouchang; government troops soon recovered it.',
    'On dingsi day, Zhejiang rebels captured Shouchang but government forces soon took it back.',
  ],
  s1045: [
    'Fu Ji was stripped of rank and removed for malfeasance.',
    'Fu Ji lost his rank and office for neglect of duty.',
  ],
  s1046: [
    'Weng Tongshu was made Anhui governor.',
    'Weng Tongshu became Anhui governor.',
  ],
  s1047: [
    'On day gengshen, the Tianjin disaster was deliberated; Tan Tingxiang was removed and Commander Zhang Dianyuan was banished.',
    'On gengshen day, the Tianjin debacle was reviewed; Tan Tingxiang was dismissed and Zhang Dianyuan banished.',
  ],
  s1048: [
    'Qing Qi was made Zhili governor-general and Yu Ming was made Mukden general.',
    'Qing Qi took Zhili and Yu Ming became Mukden general.',
  ],
  s1049: [
    'On day dingmao, Fujian circuit intendant Zhao Yinchuan suppressed bandits and died.',
    'On dingmao day, Fujian intendant Zhao Yinchuan died fighting bandits.',
  ],
  s1050: [
    'Zhejiang government troops recovered Changshan and Kaihua.',
    'Zhejiang forces retook Changshan and Kaihua.',
  ],
  s1051: [
    'Jiangxi relief troops recovered Wuyi, Yongkang, and Quzhou in Zhejiang; the siege alert at Shaoxing was lifted.',
    'Jiangxi reinforcements retook Wuyi, Yongkang, and Quzhou and eased the Shaoxing siege.',
  ],
  s1052: [
    'Ruilin requested funds to build Tianjin camps and batteries; the matter was referred to Sengge Rinchen.',
    'Ruilin asked for money to fortify Tianjin and the task went to Sengge Rinchen.',
  ],
  s1053: [
    'On day xinwei, Russians requested halting station sheep levies; an edict told the Kuren minister to refuse citing precedent.',
    'On xinwei day, Russia sought an end to relay-station sheep dues and Kuren was told to refuse on precedent.',
  ],
  s1054: [
    'On day renshen, Vice Director of Punishments Duan Chengshi was granted fifth-rank noble rank to assist in conferring on tax schedules.',
    'On renshen day, Duan Chengshi of the Ministry of Punishments received fifth-rank rank to help negotiate tariffs.',
  ],
  s1055: [
    'Zeng Guofan memorialized landing from Jiujiang to proceed to Zhejiang; an edict praised and encouraged him.',
    'Zeng Guofan reported marching inland from Jiujiang toward Zhejiang and was praised by edict.',
  ],
  s1056: [
    'Zhejiang troops recovered Jinyun.',
    'Zhejiang forces retook Jinyun.',
  ],
  s1057: [
    'Autumn, seventh month, day jiaxu new moon: Yishan and Jingchun memorialized that Russians crossed the Hei River mouth intending to enter the Songhua and were building houses and emplacing guns on the Ussuri.',
    'In autumn, month 7, jiaxu new moon, Yishan and Jingchun reported Russians crossing the Hei estuary toward the Songhua and building fortified posts on the Ussuri.',
  ],
  s1058: [
    'An edict ordered demarcation of Jilin and Heilongjiang borders and reasonable refusal.',
    'The court ordered Jilin and Heilongjiang boundaries surveyed and a justified refusal.',
  ],
  s1059: [
    'On day yihai, Li Mengqun was made acting Anhui governor.',
    'On yihai day, Li Mengqun became acting Anhui governor.',
  ],
  s1060: [
    'On day dingchou, at the French envoy Favier\'s request, the Kashgar commandant was promoted to commissioner.',
    'On dingchou day, Kashgar\'s commandant was raised to commissioner at French envoy Favier\'s request.',
  ],
  s1061: [
    'Zhou Tianshou attacked and recovered Chuzhou in Zhejiang, then moved his army to Fujian.',
    'Zhou Tianshou retook Zhejiang\'s Chuzhou and shifted his army to Fujian.',
  ],
  s1062: [
    'On day guiwei, an edict ordered Zeng Guofan to clear Quzhou and Yanzhou and shift relief to Fujian.',
    'On guiwei day, Zeng Guofan was told to secure Qu and Yan and redirect aid to Fujian.',
  ],
  s1063: [
    'On day yiyou, Yang Zaifu recovered Jiande in Anhui.',
    'On yiyou day, Yang Zaifu retook Jiande in Anhui.',
  ],
  s1064: [
    'On day guisi, Hubei Governor Hu Linyi entered mourning for his mother; an edict permitted mourning in office with leave and silver for the funeral.',
    'On guisi day, Hu Linyi of Hubei began mourning for his mother; the court let him stay in post with leave and funeral funds.',
  ],
  s1065: [
    'On day bingshen, rebels took Luzhou; Li Mengqun was dismissed but kept with the army; Sengbao was made Imperial Commissioner to supervise Anhui military affairs; Yuan Jiasan aided in suppressing Nian bandits in three provinces.',
    'On bingshen day, rebels seized Luzhou; Li Mengqun was demoted but kept in the field; Sengbao became Imperial Commissioner for Anhui; Yuan Jiasan helped fight Nian rebels in three provinces.',
  ],
  s1066: [
    'On day dingyou, Fujian forces recovered Jianyang and Guangze; rebels took Ninghua.',
    'On dingyou day, Fujian retook Jianyang and Guangze while rebels took Ninghua.',
  ],
  s1067: [
    'On day gengzi, Yan Duanshu was summoned to the capital; Hu Xingren was made Zhejiang governor.',
    'On gengzi day, Yan Duanshu was called to Beijing and Hu Xingren became Zhejiang governor.',
  ],
  s1068: [
    'On day renyin, Zhang Fu\'s army recovered Longquan and was granted the peacock feather.',
    'On renyin day, Zhang Fu retook Longquan and received the peacock feather.',
  ],
  s1069: [
    'Eighth month, day guimao new moon: the Tianjin naval division was re-established.',
    'In the eighth month, on guimao new moon, the Tianjin fleet was restored.',
  ],
  s1070: [
    'On day jiachen, Fujian forces recovered Zhenghe and Songxi.',
    'On jiachen day, Fujian retook Zhenghe and Songxi.',
  ],
  s1071: [
    'Sengbao memorialized that the Taiping false King of Ying Chen Yucheng fled to Dianbu and Liangyuan and drove straight at Dingyuan.',
    'Sengbao reported the rebel King of Ying Chen Yucheng at Dianbu and Liangyuan striking toward Dingyuan.',
  ],
  s1072: [
    'On day gengxu, Li Dingtai suppressed bandits at Yushan, defeated them, and lifted the siege.',
    'On gengxu day, Li Dingtai beat rebels at Yushan and raised the siege.',
  ],
  s1073: [
    'On day xinhai, Jiang Yili\'s relief army recovered Qingyuan in Guangxi; he was promoted to surveillance commissioner.',
    'On xinhai day, Jiang Yili\'s reinforcements retook Qingyuan in Guangxi and he became surveillance commissioner.',
  ],
  s1074: [
    'On day bingchen, Zhou Tianshou relieved Fujian, recovered Pucheng, and advanced to recover Ninghua.',
    'On bingchen day, Zhou Tianshou aided Fujian, took Pucheng, and then Ninghua.',
  ],
  s1075: [
    'Nian bandits took Feng county.',
    'Nian rebels captured Feng county.',
  ],
  s1076: [
    'On day xinyou, Nian bandits fled into Shandong and took Shan county.',
    'On xinyou day, Nian rebels crossed into Shandong and seized Shan county.',
  ],
  s1077: [
    'Ying Gui was transferred as Shanxi governor and Hengfu as Henan governor.',
    'Ying Gui went to Shanxi and Hengfu to Henan as governors.',
  ],
  s1078: [
    'On day yichou, government troops recovered Feng county.',
    'On yichou day, government forces retook Feng county.',
  ],
  s1079: [
    'Nian bandits took Cao county but it was soon recovered.',
    'Nian rebels seized Cao county but it was quickly retaken.',
  ],
  s1080: [
    'He Guiqing requested using customs surpluses for army provisions; it was approved.',
    'He Guiqing asked to fund the army from customs surpluses and was allowed.',
  ],
  s1081: [
    'On day renshen, Jiangbei forces were defeated at Pukou; De Xing\'a and Ju Dianhua were stripped of office.',
    'On renshen day, Jiangbei troops lost at Pukou and De Xing\'a and Ju Dianhua were dismissed.',
  ],
  s1082: [
    'He Chun memorialized: "After the Pukou defeat, troops that had been rushed to relieve Zhejiang were redirected straight to Liuhe.',
    'He Chun reported: "After Pukou fell, forces bound for Zhejiang were diverted straight to Liuhe.',
  ],
  s1083: [
    'Scouts report rebels circling back from Fujian will pass through Ningguo and Taiping to aid Jinling; clearly the besieged city garrison, pressed in the siege, is sending detachments to raid everywhere to divide our forces.',
    'Intelligence says Fujian rebels returning through Ning and Tai will relieve Jinling; the trapped garrison is clearly raiding widely to split our armies.',
  ],
  s1084: [
    'I request that each route suppress on its own and not upset the overall disposition."',
    'I ask each front to fight locally and not pull apart the whole plan."',
  ],
  s1085: [
    'The Emperor approved.',
    'The court agreed.',
  ],
  s1086: [
    'Ninth month, day guiyou new moon: Hubei government troops under Duolong\'a recovered Taihu.',
    'In the ninth month, on guiyou new moon, Duolong\'a\'s Hubei forces retook Taihu.',
  ],
  s1087: [
    'On day yihai, an edict said: "Tianchang and Yizheng fell in succession; Liuhe is critical; though Wen Shaoyuan has long had the people\'s hearts, in time he too may not hold.',
    'On yihai day, an edict warned: "Tianchang and Yizheng have fallen; Liuhe is desperate; Wen Shaoyuan is popular but may not last.',
  ],
  s1088: [
    'Zhou Tianpei\'s army is immediately to be divided to relieve Liuhe and De\'an, with one corps to go forward in support."',
    'Split Zhou Tianpei\'s force between Liuhe and De\'an and send another corps to reinforce."',
  ],
  s1089: [
    '"On day xinsi, Guanwen and Hu Linyi memorialized that Li Xubin and Du Xing\'a recovered Tongcheng and Qianshan on separate routes, Duolong\'a advanced on Shipai, and Bao Chao pressed Leigongbu—all with success.',
    '"On xinsi day, Guanwen and Hu Linyi reported Li Xubin and Du Xing\'a retook Tongcheng and Qianshan, Duolong\'a took Shipai, and Bao Chao stormed Leigongbu—all successfully.',
  ],
  s1090: [
    'An edict ordered the navy coordinated to advance on Anqing.',
    'The court ordered the fleet linked for an advance on Anqing.',
  ],
  s1091: [
    'Hunan government troops recovered Ji\'an; Registrar Zeng Guoquan and others were promoted with distinctions.',
    'Hunan forces retook Ji\'an and Zeng Guoquan and others were rewarded with promotions.',
  ],
  s1092: [
    'On day renwu, Ming Yi memorialized the Russian case concluded, credentials exchanged, and trade opened.',
    'On renwu day, Ming Yi reported the Russian settlement done, documents exchanged, and trade begun.',
  ],
  s1093: [
    'Rebels took Yangzhou; De Xing\'a\'s hereditary rank was stripped.',
    'Rebels captured Yangzhou and De Xing\'a lost his hereditary title.',
  ],
  s1094: [
    'Bo Xia and Weng Xincun were made Grand Secretaries; Guanwen and Zhou Zupei assisted as Grand Secretaries.',
    'Bo Xia and Weng Xincun became Grand Secretaries with Guanwen and Zhou Zupei as assistants.',
  ],
  s1095: [
    'Ruilin was transferred as Minister of Revenue, Su Shun as Minister of Rites, Zhu Fengbiao as Minister of Revenue, Chen Fuen as Minister of War, Ruichang as Minister of the Court of Colonial Affairs, and Miansen as Censor-in-Chief of the Left.',
    'Ruilin took Revenue, Su Shun Rites, Zhu Fengbiao Revenue, Chen Fuen War, Ruichang Colonial Affairs, and Miansen Left Censor-in-Chief.',
  ],
  s1096: [
    'Brigade commanders Mao Sanyuan and Cheng Ming were ordered to assist De Xing\'a\'s military affairs.',
    'Mao Sanyuan and Cheng Ming were told to help De Xing\'a command.',
  ],
  s1097: [
    'On day jiawu, Zhang Guoliang captured Yangzhou and subsequently recovered Yizheng.',
    'On jiawu day, Zhang Guoliang took Yangzhou and then Yizheng.',
  ],
  s1098: [
    'Qing Duan memorialized capture of Shaowu and pacification of Fujian province.',
    'Qing Duan reported Shaowu taken and Fujian pacified.',
  ],
  s1099: [
    'On day wuxu, Jingzhou General Mianxun died; Du Xing\'a was transferred as Jingzhou general, He Chun as Jiangning general, and Zhang Guoliang as Jiangnan commander-in-chief.',
    'On wuxu day, Mianxun of Jingzhou died; Du Xing\'a became Jingzhou general, He Chun Jiangning general, and Zhang Guoliang Jiangnan commander-in-chief.',
  ],
  s1100: [
    'On day jihai, rebels took Liuhe; Magistrate Wen Shaoyuan died.',
    'On jihai day, rebels seized Liuhe and Magistrate Wen Shaoyuan was killed.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_020_b11.mjs <translation.json>'
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
