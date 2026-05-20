#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'On day jichou, Lesser Jinchuan rebels attacked the Dangba official stockade; A Gui sent Dong Tianbi to relieve it.',
    'On jichou day, Lesser Jinchuan struck Dangba and A Gui sent Dong Tianbi to reinforce.',
  ],
  s0502: [
    'Ninth month, day renyin: Wen Fu memorialized that the army had advanced to Mulan Dam; rebels destroyed blockhouses on both northern and southern hills and massed to hold Ludingzong Ridge.',
    'In the ninth month, Wen Fu reported reaching Mulan Dam as rebels wrecked hill blockhouses and held Ludingzong Ridge.',
  ],
  s0503: [
    'An edict ordered strict guarding of the rear route.',
    'The court ordered the rear route strictly guarded.',
  ],
  s0504: [
    'A Gui memorialized that the Chosiakabu chieftain had divided forces to attack Lewu stockade.',
    'A Gui reported Chosiakabu troops advancing on Lewu stockade.',
  ],
  s0505: [
    'The Emperor escorted the Empress Dowager on her return from progress.',
    'The Emperor saw the Empress Dowager home from her journey.',
  ],
  s0506: [
    'On day wushen, the Emperor returned from progress at the Mountain Resort for Summer Retreat.',
    'On wushen day, the Emperor left the Summer Resort for the capital.',
  ],
  s0507: [
    'On day jiayin, the Emperor reported to the Empress Dowager that they had returned to the capital.',
    'On jiayin day, the Emperor announced their return to Beijing to the Empress Dowager.',
  ],
  s0508: [
    'Winter, tenth month, day renshen: Dong Tianbi memorialized the capture of blockhouses including Muyanggang.',
    'In the tenth month, Dong Tianbi reported taking Muyanggang blockhouses.',
  ],
  s0509: [
    'On day renwu, A Gui memorialized the capture of Lesser Jinchuan\'s Jiaermu Ridge.',
    'On renwu day, A Gui reported taking Jiaermu Ridge in Lesser Jinchuan.',
  ],
  s0510: [
    'Eleventh month, day yiwei: Wen Fu and others memorialized the capture of Ludingzong and Khamser stockades.',
    'In the eleventh month, Wen Fu\'s force took Ludingzong and Khamser stockades.',
  ],
  s0511: [
    'On day bingshen, quota tax on collapsed salt wells for thirty-five years was remitted in nine Sichuan prefectures and counties including Leshan.',
    'On bingshen day, thirty-five years of abandoned salt-well tax was forgiven in nine Sichuan districts including Leshan.',
  ],
  s0512: [
    'On day xinchou, Guangzhou General Qin Huang was stripped of office and arrested for taking a maidservant as concubine.',
    'On xinchou day, Qin Huang lost his Guangzhou post over a maidservant scandal.',
  ],
  s0513: [
    'A Liangzhou vice commander-in-chief was established.',
    'Liangzhou gained a new vice commander-in-chief.',
  ],
  s0514: [
    'One Xi\'an vice commander-in-chief was abolished.',
    'One Xi\'an vice commander post was cut.',
  ],
  s0515: [
    'On day bingwu, Wen Fu and others memorialized the capture of stockades including Bo\'ergen Mountain.',
    'On bingwu day, Wen Fu reported taking Bo\'ergen Mountain stockades.',
  ],
  s0516: [
    'On day wushen, A Gui memorialized the capture of stockades including Wenguerlong.',
    'On wushen day, A Gui took Wenguerlong and nearby stockades.',
  ],
  s0517: [
    'On day jiyou, Fulehun was ordered to Sichuan; Chen Huizu was made acting Huguang governor-general.',
    'On jiyou day, Fulehun was sent to Sichuan and Chen Huizu acted at Huguang.',
  ],
  s0518: [
    'On day guichou, A Gui memorialized the capture of stockades including Deli.',
    'On guichou day, A Gui reported taking Deli stockades.',
  ],
  s0519: [
    'On day dingsi, A Gui memorialized the capture of Bangjia, Lazong, and other places; fan of Layue stockades submitted.',
    'On dingsi day, A Gui took Bangjia and Lazong and Layue fan submitted.',
  ],
  s0520: [
    'Twelfth month, day guihai: A Gui memorialized the capture of Sengge stockade.',
    'In the twelfth month, A Gui reported taking Sengge stockade.',
  ],
  s0521: [
    'On day guiyou, Wen Fu was made Pacification General for the Border; A Gui and Fengsheng\'e were both made deputy generals; Shu Chang, Hailancha, and Ha Guoxing were all made participating ministers; Fu Kang\'an was made lead commander; Fuxing and others were lead commanders on Wen Fu\'s route, Xingzhao and others on A Gui\'s route, and Dong Tianbi and others on Fengsheng\'e\'s route.',
    'On guiyou day, Wen Fu became border general with A Gui and Fengsheng\'e as deputies; Shu Chang, Hailancha, and Ha Guoxing coordinated; three columns received lead commanders under Wen Fu, A Gui, and Fengsheng\'e.',
  ],
  s0522: [
    'The Chosiakabu chieftain Gongganuo\'erbu was granted the title-name "Zunduiguidan."',
    'Chosiakabu chieftain Gongganuo\'erbu received the honorific title Zunduiguidan.',
  ],
  s0523: [
    'On day bingzi, Wen Fu memorialized the capture of blockhouses including Mingguozong.',
    'On bingzi day, Wen Fu reported taking Mingguozong blockhouses.',
  ],
  s0524: [
    'On day dingchou, A Gui memorialized the capture of Meinuo stockade.',
    'On dingchou day, A Gui took Meinuo stockade.',
  ],
  s0525: [
    'On day gengchen, Wen Fu memorialized that fan of Penglu\'er and other stockades had come in submission.',
    'On gengchen day, Penglu\'er stockades submitted to Wen Fu.',
  ],
  s0526: [
    'On day xinsi, Wen Fu and others memorialized the capture of Bulangguozong and Dimuda stockades; Zewang submitted and Senggesang fled to Greater Jinchuan.',
    'On xinsi day, Wen Fu took Bulangguozong and Dimuda; Zewang surrendered and Senggesang fled to Greater Jinchuan.',
  ],
  s0527: [
    'On day yiyou, Qin Huang was sentenced to decapitation for covetous corruption.',
    'On yiyou day, Qin Huang was condemned to death for graft.',
  ],
  s0528: [
    'On day bingxu, Sazai was made Jiangsu governor.',
    'On bingxu day, Sazai became Jiangsu governor.',
  ],
  s0529: [
    'On day dinghai, Wenshou was stripped of office for favoritism; Liu Bingqian was made Sichuan governor-general while still supervising supplies, with Fulehun acting.',
    'On dinghai day, Wenshou fell for favoritism; Liu Bingqian took Sichuan with Fulehun acting.',
  ],
  s0530: [
    'Thirty-eighth year, spring, first month, day renchen: Yongde was summoned to the capital; Xiong Xuepeng was transferred to Guangxi governor and Sanbao to Zhejiang governor.',
    'In the thirty-eighth year\'s first month, Yongde was recalled and Xiong Xuepeng and Sanbao were shifted to Guangxi and Zhejiang.',
  ],
  s0531: [
    'Ebao was again appointed Shanxi governor.',
    'Ebao returned as Shanxi governor.',
  ],
  s0532: [
    'Because Lesser Jinchuan was pacified, quota tax for the thirty-eighth year was deferred in fifty-one Sichuan prefectures and counties including Chengdu through which troops passed, and remaining quota tax remitted for the thirty-seventh year in ninety prefectures and counties including Wenjiang that had shared transport labor.',
    'With Lesser Jinchuan pacified, Sichuan tax relief was granted along troop routes and in districts that had borne transport levies.',
  ],
  s0533: [
    'Tribute levies on fan were likewise deferred.',
    'Fan tribute payments were deferred as well.',
  ],
  s0534: [
    'Wen Fu and others advanced against Greater Jinchuan, dividing forces to march by the Kharsar, Kalayi, and Chosiakabu routes.',
    'Wen Fu opened the Greater Jinchuan campaign on three routes through Kharsar, Kalayi, and Chosiakabu.',
  ],
  s0535: [
    'On day jiachen, Kazakh envoy Borote came to audience.',
    'On jiachen day, Kazakh envoy Borote was received in audience.',
  ],
  s0536: [
    'Because Altai was guilty of covetous corruption, he was granted suicide.',
    'Altai was ordered to kill himself for graft.',
  ],
  s0537: [
    'On day wuwu, Yonggui was transferred to act as Minister of Revenue; A Gui was made Minister of Rites.',
    'On wuwu day, Yonggui acted at Revenue and A Gui became Minister of Rites.',
  ],
  s0538: [
    'Second month, first day gengshen: Wen Fu and others were instructed by proclamation to search out and deliver Senggesang bound.',
    'In the second month, Wen Fu was ordered to seize and hand over Senggesang.',
  ],
  s0539: [
    'Third month, first day gengyin: there was a solar eclipse.',
    'At the third-month new moon on gengyin, there was a solar eclipse.',
  ],
  s0540: [
    'On day renchen, the Emperor went to Tailing.',
    'On renchen day, the Emperor visited Tailing.',
  ],
  s0541: [
    'Accompanying the Empress Dowager, the Emperor toured Tianjin; one-tenth of that year\'s land tax was remitted for places passed through and for Tianjin prefecture.',
    'The court toured Tianjin with the Empress Dowager and remitted one-tenth of the year\'s tax along the route.',
  ],
  s0542: [
    'On day guisi, the Emperor inspected the Yongding River embankments.',
    'On guisi day, the Emperor inspected the Yongding River dikes.',
  ],
  s0543: [
    'On day dingyou, the Emperor visited Tailing.',
    'On dingyou day, the Emperor again visited Tailing.',
  ],
  s0544: [
    'On day wuxu, the Emperor ordered Prince Jian Fengneheng to escort the Empress Dowager from Shenyang Spring Garden on her progress, and arrears of registered taxes from the thirty-third through thirty-sixth years were remitted in twenty counties including Wanping along the route and in Tianjin prefecture.',
    'On wuxu day, Fengneheng escorted the Empress Dowager from Shenyang Spring Garden and tax arrears were forgiven along the route.',
  ],
  s0545: [
    'On day jihai, arrears of registered taxes from the thirty-third through thirty-fifth years were remitted in Zhili.',
    'On jihai day, Zhili tax arrears from years thirty-three through thirty-five were forgiven.',
  ],
  s0546: [
    'On day gengzi, the Emperor inspected the Dian River.',
    'On gengzi day, the Emperor inspected the Dian River.',
  ],
  s0547: [
    'On day yisi, the Emperor, accompanying the Empress Dowager, halted the progress at Tianjin.',
    'On yisi day, the court halted at Tianjin with the Empress Dowager.',
  ],
  s0548: [
    'On day jiyou, the Emperor, accompanying the Empress Dowager, returned from progress.',
    'On jiyou day, the court returned from Tianjin with the Empress Dowager.',
  ],
  s0549: [
    'Arrears of registered taxes for the thirty-sixth year were remitted in nine counties including Tongzhou and Baodi.',
    'Thirty-sixth-year tax arrears were forgiven in nine districts including Tongzhou and Baodi.',
  ],
  s0550: [
    'On day renzi, the Emperor inspected the Yongding River.',
    'On renzi day, the Emperor again inspected the Yongding River.',
  ],
  s0551: [
    'On day bingchen, the Emperor, accompanying the Empress Dowager, returned to the capital.',
    'On bingchen day, the court returned to Beijing with the Empress Dowager.',
  ],
  s0552: [
    'Intercalary third month, day jisi: Zhala Feng\'a was made an imperial bodyguard grand minister.',
    'In intercalary month 3, Zhala Feng\'a became an imperial bodyguard minister.',
  ],
  s0553: [
    'Liu Tongxun and others were ordered to serve as chief directors for compiling the Complete Library in Four Sections.',
    'Liu Tongxun and others were appointed chief directors of the Siku Quanshu project.',
  ],
  s0554: [
    'On day yiyou, Suernai acted as Minister of Works.',
    'On yiyou day, Suernai acted as Minister of Works.',
  ],
  s0555: [
    'Summer, fourth month, day wuxu: Zhuoketuo was made participating minister at Ush.',
    'In the fourth month, Zhuoketuo became Ush participating minister.',
  ],
  s0556: [
    'On day gengxu, Suolin was ordered to serve in the Grand Council while acting as Vice Minister of Rites.',
    'On gengxu day, Suolin joined the Grand Council as acting Rites vice minister.',
  ],
  s0557: [
    'On day xinhai, Qinggui was ordered to serve as Yili participating minister as Vice Minister of the Court of Colonial Affairs and vice commander-in-chief.',
    'On xinhai day, Qinggui became Yili participating minister from the Court of Colonial Affairs.',
  ],
  s0558: [
    'On day bingchen, Gao Jin was instructed to relieve flood victims in Qinghe and other districts and in the Dahe and Changhuai guards.',
    'On bingchen day, Gao Jin was told to relieve flood victims on the Huai and in Qinghe districts.',
  ],
  s0559: [
    'On day wuwu, Grand Secretary Wen Fu, Revenue Minister Shuhede, and Works Minister Fulong\'an were advanced to Junior Grand Mentor of the Heir Apparent; Rites Minister Wang Jihua and Works Minister Qiu Yuexiu to Junior Grand Tutor of the Heir Apparent; Rites Minister A Gui, acting War Minister Fengsheng\'e, Zhili Governor-General Zhou Yuanli, Fujian-Zhejiang Governor-General Zhong Yin, and Sichuan Governor-General Liu Bingqian to Junior Grand Protector of the Heir Apparent.',
    'On wuwu day, Wen Fu, Shuhede, and Fulong\'an received heir-apparent mentor ranks and six other ministers received tutor or protector honors.',
  ],
  s0560: [
    'Fifth month, day xinyou: Works Minister Qiu Yuexiu died and Ji Huang replaced him.',
    'In the fifth month, Qiu Yuexiu died and Ji Huang became Minister of Works.',
  ],
  s0561: [
    'On day bingyin, the Emperor, accompanying the Empress Dowager, set out on progress; one-tenth of that year\'s land tax was remitted for places passed through.',
    'On bingyin day, the court left on progress with the Empress Dowager and remitted one-tenth of the year\'s tax along the route.',
  ],
  s0562: [
    'On day renshen, the Emperor, accompanying the Empress Dowager, halted the progress at the Mountain Resort for Summer Retreat.',
    'On renshen day, the court reached the Summer Resort with the Empress Dowager.',
  ],
  s0563: [
    'On day yihai, Shengjing General Zenghai died and Hongshang was transferred to replace him.',
    'On yihai day, Zenghai died and Hongshang became Shengjing general.',
  ],
  s0564: [
    'On day dingchou, the Urumqi participating minister was changed to commander-in-chief, with Sonom Celeng appointed while still under the Yili general\'s command.',
    'On dingchou day, Urumqi\'s post became commander-in-chief under Sonom Celeng and the Yili general.',
  ],
  s0565: [
    'On day jimao, Mengzhe chieftain Baliqi and others came within the pale.',
    'On jimao day, Mengzhe chieftain Baliqi and others submitted.',
  ],
  s0566: [
    'On day guiwei, Chebudengzhab was summoned to the capital; Lawangduo\'erji acted as Uliasutai general.',
    'On guiwei day, Chebudengzhab was recalled and Lawangduo\'erji acted at Uliasutai.',
  ],
  s0567: [
    'On day yisi, A Gui and others memorialized that Greater Jinchuan fan rebels had seized the Lama Temple granary depot and overrun Dimuda and Bulangguozong.',
    'On yisi day, A Gui reported Greater Jinchuan rebels seizing the Lama Temple depot and retaking Dimuda and Bulangguozong.',
  ],
  s0568: [
    'On day jiyou, Ebao memorialized that Greater Jinchuan fan rebels had seized Daban Zhao.',
    'On jiyou day, Ebao reported rebels taking Daban Zhao.',
  ],
  s0569: [
    'On day renzi, Pacification General Wen Fu, Sichuan Provincial Commander Ma Quan, and acting Guizhou Provincial Commander Niu Tianbi were defeated at Muguomu and all died.',
    'On renzi day, Wen Fu, Ma Quan, and Niu Tianbi were killed in defeat at Muguomu.',
  ],
  s0570: [
    'On day guichou, A Gui was made Pacification General for the Border and Wen Fu was posthumously enfeoffed as a first-class earl.',
    'On guichou day, A Gui became border general and Wen Fu was posthumously made a first-class earl.',
  ],
  s0571: [
    'Zewang, father of Lesser Jinchuan chieftain Senggesang, was executed.',
    'Senggesang\'s father Zewang was put to death.',
  ],
  s0572: [
    'Grand Secretary Liu Lun died.',
    'Grand Secretary Liu Lun died.',
  ],
  s0573: [
    'On day jiayin, Fulehun was made Sichuan governor-general and Wenshou was reinstated as Huguang governor-general.',
    'On jiayin day, Fulehun took Sichuan and Wenshou returned to Huguang.',
  ],
  s0574: [
    'On day bingchen, A Gui memorialized the suppression of Lesser Jinchuan fan rebels and the destruction of all stockades; the court praised him.',
    'On bingchen day, A Gui reported clearing Lesser Jinchuan and destroying its stockades, and was praised.',
  ],
  s0575: [
    'Autumn, seventh month, first day wuwu: Shuhede was summoned to the capital; Yiletuo was made Yili general and Qinggui Tarbagatai participating minister.',
    'In the seventh month, Shuhede was recalled; Yiletuo became Yili general and Qinggui went to Tarbagatai.',
  ],
  s0576: [
    'On day jiwei, Greater Jinchuan fan rebels seized Meinuo and Mingguozong; Hailancha withdrew the army to Rilong.',
    'On jiwei day, rebels took Meinuo and Mingguozong and Hailancha fell back to Rilong.',
  ],
  s0577: [
    'A Gui was instructed to withdraw the army by Zhanggu; Fengsheng\'e withdrew to garrison at Balalang and other places.',
    'A Gui was ordered to pull back through Zhanggu and Fengsheng\'e to hold Balalang.',
  ],
  s0578: [
    'On day guihai, Fude was made participating minister to proceed to the army; A Gui was ordered to withdraw troops from Ga\'erla.',
    'On guihai day, Fude went to the front and A Gui was told to lift the Ga\'erla column.',
  ],
  s0579: [
    'On day jiazi, Shuhede was made Grand Secretary of the Hall of Military Glory.',
    'On jiazi day, Shuhede became a Wuyingdian grand secretary.',
  ],
  s0580: [
    'A Gui was transferred to Minister of Revenue and Yonggui to Minister of Rites.',
    'A Gui became Revenue Minister and Yonggui Rites Minister.',
  ],
  s0581: [
    'On day bingyin, locusts struck Qiqihar.',
    'On bingyin day, locusts hit Qiqihar.',
  ],
  s0582: [
    'On day dingmao, because Wen Fu had mishandled affairs and ruined the campaign, his first-class earldom was revoked, though funeral honors were still granted.',
    'On dingmao day, Wen Fu lost his earldom for failure but kept funeral honors.',
  ],
  s0583: [
    'Liu Bingqian was stripped of office.',
    'Liu Bingqian lost his post.',
  ],
  s0584: [
    'Orders were issued to deliberate posthumous honors for Provincial Commander Ma Quan and Niu Tianbi, who died at Muguomu, Vice Commanders-in-Chief Balang and A\'ersuna, Brigadier Zhang Dajing, and all civil and military officers who fell.',
    'The court was told to fix honors for officers killed at Muguomu, including Ma Quan, Niu Tianbi, Balang, A\'ersuna, and Zhang Dajing.',
  ],
  s0585: [
    'On day bingxu, A Gui was instructed first to recover Lesser Jinchuan and then advance against Greater Jinchuan on three routes.',
    'On bingxu day, A Gui was ordered to retake Lesser Jinchuan and attack Greater Jinchuan on three routes.',
  ],
  s0586: [
    'Eighth month, day wuzi: A Gui was made Pacification General for the West.',
    'In the eighth month, A Gui became western pacification general.',
  ],
  s0587: [
    'Yu Minzhong was made Grand Secretary of the Hall of Literary Glory; Shuhede took charge of Punishments and Liu Tongxun solely of Personnel.',
    'Yu Minzhong joined the Wenhua Hall; Shuhede took Punishments and Liu Tongxun Personnel alone.',
  ],
  s0588: [
    'On day jichou, Cheng Jingyi was ordered to assist as grand secretary.',
    'On jichou day, Cheng Jingyi was told to assist as grand secretary.',
  ],
  s0589: [
    'Wang Jihua was transferred to Minister of Revenue, Cai Xin to Minister of Rites, and Ji Huang to Minister of War.',
    'Wang Jihua, Cai Xin, and Ji Huang were shifted to Revenue, Rites, and War.',
  ],
  s0590: [
    'Yan Xunqi was made Minister of Works.',
    'Yan Xunqi became Minister of Works.',
  ],
  s0591: [
    'On day wuxu, Mingliang was made Right Deputy Pacification General for the Border and Fude participating minister.',
    'On wuxu day, Mingliang became right deputy border general and Fude coordinating minister.',
  ],
  s0592: [
    'On day renyin, the Emperor went to Mulan for the hunt enclosure.',
    'On renyin day, the Emperor hunted at Mulan.',
  ],
  s0593: [
    'Ninth month, day renxu: Hailancha was demoted to lead commander.',
    'In the ninth month, Hailancha was reduced to lead commander.',
  ],
  s0594: [
    'On day jiazi, the Emperor returned to lodge at the Mountain Resort for Summer Retreat.',
    'On jiazi day, the Emperor returned to the Summer Resort.',
  ],
  s0595: [
    'On day wuchen, the Emperor escorted the Empress Dowager on her return from progress.',
    'On wuchen day, the Emperor saw the Empress Dowager home from her journey.',
  ],
  s0596: [
    'On day jisi, Sonam took Senggesang back to Greater Jinchuan and sent his elder brother Gangdake to Meinuo.',
    'On jisi day, Sonam brought Senggesang to Greater Jinchuan and sent Gangdake to Meinuo.',
  ],
  s0597: [
    'A Gui was instructed to seize the opportunity to recover lost ground.',
    'A Gui was told to exploit the moment and recover territory.',
  ],
  s0598: [
    'The Ministry of Revenue\'s request to open a military-supply sale-of-offices quota for the Jinchuan campaign was approved.',
    'The court approved a Jinchuan military-supply donation quota.',
  ],
  s0599: [
    'On day renshen, the Emperor returned from progress at the Mountain Resort for Summer Retreat.',
    'On renshen day, the Emperor left the Summer Resort for the capital.',
  ],
  s0600: [
    'On day jiaxu, Duomin was made Kobdo participating minister and Chemuchukezhab Uliasutai participating minister.',
    'On jiaxu day, Duomin went to Kobdo and Chemuchukezhab to Uliasutai.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_013_b06.mjs <translation.json>'
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
