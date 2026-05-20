import fs from 'node:fs';

const path = 'translations/current_translation_beishi.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const T = {
  s0701: [
    'On day jimao he toured north.',
    'On jimao day he toured north.',
  ],
  s0702: [
    'On dinghai day in the fifth month he halted at Canhe and traveled east to favor Daning.',
    'On dinghai day in the fifth month he stopped at Canhe and went east to Daning.',
  ],
  s0703: [
    'On dingwei day he farmed at Four Cape Mountain.',
    'On dingwei day he tilled fields at Four Cape Mountain.',
  ],
  s0704: [
    'On wuwu day in the sixth month he went to Quji Mound to watch the fishing.',
    'On wuwu day in the sixth month he watched the fishing at Quji Mound.',
  ],
  s0705: [
    'On xinyou day he halted at Ruyuan and erected Clam Terrace.',
    'On xinyou day he stopped at Ruyuan and built Clam Terrace.',
  ],
  s0706: [
    'He then shot a white bear on Tui Ox Mountain and took it.',
    'He shot a white bear on Tui Ox Mountain and brought it down.',
  ],
  s0707: [
    'On dingmao day he favored Chicheng, personally received the elders, inquired into the people\'s hardships, and remitted one year\'s land tax.',
    'On dingmao day he went to Chicheng, met the elders in person, asked after the people\'s hardships, and remitted a full year of land tax.',
  ],
  s0708: [
    'He halted south at Shiting, favored Shanggu, inquired of centenarians, sought out worthy talent, and remitted half the field tax.',
    'He stopped south at Shiting, visited Shanggu, questioned centenarians, sought worthy men, and cut the field tax in half.',
  ],
  s0709: [
    'On renshen day he favored Zhuolu, climbed Qiao Mountain, viewed the hot springs, and sent an ox offering to sacrifice at the temples of the Yellow Emperor and Tang Yao.',
    'On renshen day he went to Zhuolu, climbed Qiao Mountain, viewed the hot springs, and had an ox sacrifice offered at the temples of the Yellow Emperor and Tang Yao.',
  ],
  s0710: [
    'On guiyou day he favored Guangning and did as at Shanggu.',
    'On guiyou day he visited Guangning and did as he had at Shanggu.',
  ],
  s0711: [
    'On jimao day he climbed Li Mountain in Guangning, sent an ox offering to sacrifice at Shun\'s temple, and the Emperor personally added ritual honor.',
    'On jimao day he climbed Li Mountain in Guangning, offered an ox at Shun\'s temple, and the Emperor himself performed the rites.',
  ],
  s0712: [
    'On gengchen day he favored Dai.',
    'On gengchen day he went to Dai.',
  ],
  s0713: [
    'On guiwei day in the seventh month of autumn the imperial carriage returned to the palace and remitted half the field tax along the route.',
    'On guiwei day in the seventh month the court returned to the palace and halved the field tax everywhere it had passed.',
  ],
  s0714: [
    'On the last day of the eighth month, gengchen day, there was an eclipse of the sun.',
    'At month\'s end on gengchen day in the eighth month there was a solar eclipse.',
  ],
  s0715: [
    'In the ninth month the capital was hungry; people were permitted to go east to Shandong for food.',
    'In the ninth month famine struck the capital; people were allowed to go east to Shandong to find food.',
  ],
  s0716: [
    'On renzi day in the tenth month of winter Yao Xing\'s envoys presented his Princess of Xiping; the Emperor received her with empress rites.',
    'On renzi day in the tenth month Yao Xing\'s envoys brought his Princess of Xiping; the Emperor welcomed her with the rites due an empress.',
  ],
  s0717: [
    'On xinyou day he traveled to favor Juru City.',
    'On xinyou day he went to Juru City.',
  ],
  s0718: [
    'On guihai day the imperial carriage returned to the palace.',
    'On guihai day the court returned to the palace.',
  ],
  s0719: [
    'On bingyin day an edict stated that because of repeated frost and drought the year\'s grain had failed, and ordered disbursement from stores of cloth, silk, and grain to relieve the poor.',
    'On bingyin day he ruled that repeated frost and drought had ruined the harvest and ordered cloth, silk, and grain from the stores given to the poor.',
  ],
  s0720: [
    'On dingwei day in the second month of spring in the first year of Taichang Yao Xing died.',
    'On dingwei day in the second month of Taichang year one Yao Xing died.',
  ],
  s0721: [
    'On jichou day in the third month Prince Changle Wang Chuwen died.',
    'On jichou day in the third month Prince Changle Wang Chuwen died.',
  ],
  s0722: [
    'On renzi day in the fourth month of summer a general amnesty was proclaimed and the era name changed.',
    'On renzi day in the fourth month he proclaimed a general amnesty and changed the reign title.',
  ],
  s0723: [
    'On gengshen day Prince Hejian Wang Xiu died.',
    'On gengshen day Prince Hejian Wang Xiu died.',
  ],
  s0724: [
    'On jiashen day in the fifth month two comets appeared.',
    'On jiashen day in the fifth month two comets were seen.',
  ],
  s0725: [
    'On dingsi day in the sixth month he toured north.',
    'On dingsi day in the sixth month he toured north.',
  ],
  s0726: [
    'On jiashen day in the seventh month of autumn a great hunt was held at Ox Stream; he climbed Kettle Mountain, overlooked the Yinfan River, and viewed the south from Ninety-Nine Springs.',
    'On jiashen day in the seventh month he held a great hunt at Ox Stream, climbed Kettle Mountain, looked down on the Yinfan River, and gazed south from Ninety-Nine Springs.',
  ],
  s0727: [
    'On wuxu day the imperial carriage returned to the palace.',
    'On wuxu day the court returned to the palace.',
  ],
  s0728: [
    'On the last day, xinhai, there was an eclipse of the sun.',
    'At month\'s end on xinhai day there was a solar eclipse.',
  ],
  s0729: [
    'In the ninth month the Jin general Liu Yu advanced upriver against Yao Hong and sent his subordinate Wang Zhongde by land route to Liangcheng.',
    'In the ninth month Liu Yu of Jin marched upriver against Yao Hong and sent Wang Zhongde by land to Liangcheng.',
  ],
  s0730: [
    'The Yanzhou inspector Wei Jian was cowardly, abandoned his post and fled north across the river; Zhongde then entered Huatai.',
    'Wei Jian, inspector of Yanzhou, lost his nerve, abandoned his post, and fled north across the river; Zhongde then took Huatai.',
  ],
  s0731: [
    'An edict ordered General Shusun Jian and others to cross the river and display might; Wei Jian was beheaded below the walls.',
    'He ordered General Shusun Jian and others to cross the river and show their strength; Wei Jian was beheaded beneath the walls.',
  ],
  s0732: [
    'On wuyin day in the eleventh month of winter Peng Terrace was raised in the northern park.',
    'On wuyin day in the eleventh month he built Peng Terrace in the northern park.',
  ],
  s0733: [
    'In the twelfth month Prince Nanyang Wang Liang died.',
    'In the twelfth month Prince Nanyang Wang Liang died.',
  ],
  s0734: [
    'On the new moon, jiaxu day, of the first month of spring in the second year there was an eclipse of the sun.',
    'On the new moon of the first month in year two there was a solar eclipse.',
  ],
  s0735: [
    'On bingwu day in the second month an edict ordered envoys to tour the realm, observe customs, and inquire into hardships.',
    'On bingwu day in the second month he sent envoys through the realm to observe local customs and hear what troubled the people.',
  ],
  s0736: [
    'That month the Liang Martial-Illustrious King died.',
    'That month the Liang Martial-Illustrious King died.',
  ],
  s0737: [
    'In the fifth month he toured west to Yunzhong, crossed the river, and farmed in the great desert.',
    'In the fifth month he went west to Yunzhong, crossed the river, and tilled fields in the great desert.',
  ],
  s0738: [
    'On yihai day in the seventh month of autumn the imperial carriage returned to the palace.',
    'On yihai day in the seventh month the court returned to the palace.',
  ],
  s0739: [
    'On yiyou day White Terrace was raised south of the city, twenty zhang high.',
    'On yiyou day he built White Terrace south of the city, twenty zhang tall.',
  ],
  s0740: [
    'That month the Jin general Liu Yu destroyed Yao Hong.',
    'That month Liu Yu of Jin destroyed Yao Hong.',
  ],
  s0741: [
    'On guichou day in the tenth month of winter Prince Yuzhang Wang Kui died.',
    'On guichou day in the tenth month Prince Yuzhang Wang Kui died.',
  ],
  s0742: [
    'On jiyou day in the twelfth month an edict ordered purchase in Hedong and Henei of Hong\'s kinsmen scattered among the people.',
    'On jiyou day in the twelfth month he ordered that in Hedong and Henei any of Hong\'s kin still living among the people be sought out and redeemed.',
  ],
  s0743: [
    'In the third month of spring in the third year envoys from Jin came on a friendly mission.',
    'In the third month of year three envoys from Jin came on a friendly mission.',
  ],
  s0744: [
    'On gengxu day he favored the Western Palace.',
    'On gengxu day he went to the Western Palace.',
  ],
  s0745: [
    'Because Bohai and Fanyang commanderies had suffered flood the previous year, their land tax and levies were remitted.',
    'Bohai and Fanyang had flooded the year before; their taxes and levies were remitted.',
  ],
  s0746: [
    'On jisi day in the fourth month of summer the Tuohe people of Ji, Ding, and You provinces were moved to the capital.',
    'On jisi day in the fourth month the Tuohe of Ji, Ding, and You provinces were relocated to the capital.',
  ],
  s0747: [
    'On renzi day in the fifth month he toured east to Ruyuan and Gan Song.',
    'On renzi day in the fifth month he toured east as far as Ruyuan and Gan Song.',
  ],
  s0748: [
    'He sent the eastern campaign general Changsun Daosheng to lead troops against Feng Ba; they reached Longcheng, moved more than ten thousand households of residents, and returned.',
    'He sent Eastern Campaign General Changsun Daosheng against Feng Ba; Daosheng reached Longcheng, resettled more than ten thousand households, and returned.',
  ],
  s0749: [
    'On wuwu day in the seventh month of autumn the imperial carriage reached the capital.',
    'On wuwu day in the seventh month the court reached the capital.',
  ],
  s0750: [
    'In the eighth month Yanmen and Henei had great rain and flood; their taxes were remitted.',
    'In the eighth month Yanmen and Henei were struck by heavy rain and flood; their taxes were remitted.',
  ],
  s0751: [
    'On wuchen day in the tenth month of winter a palace was built in the western park.',
    'On wuchen day in the tenth month he built a palace in the western park.',
  ],
  s0752: [
    'In the eleventh month Helian Quban captured Chang\'an.',
    'In the eleventh month Helian Quban took Chang\'an.',
  ],
  s0753: [
    'In the twelfth month Emperor An of Jin died.',
    'In the twelfth month Emperor An of Jin died.',
  ],
  s0754: [
    'On the new moon, renchen day, of the first month of spring in the fourth year the imperial carriage came to the river and held a great hunt at Calf Ford.',
    'On the new moon of the first month in year four the court came to the river and held a great hunt at Calf Ford.',
  ],
  s0755: [
    'On guimao day he returned to the palace.',
    'On guimao day he returned to the palace.',
  ],
  s0756: [
    'In the third month Helian Quban usurped the title of emperor.',
    'In the third month Helian Quban styled himself emperor.',
  ],
  s0757: [
    'On guichou day a palace was built north of Peng Terrace.',
    'On guichou day he built a palace north of Peng Terrace.',
  ],
  s0758: [
    'On gengchen day in the fourth month of summer he performed sacrifice at the eastern temple; several hundred distant tributary states assisted in the rites.',
    'On gengchen day in the fourth month he sacrificed at the eastern temple, with several hundred distant states joining the rites.',
  ],
  s0759: [
    'On xinsi day he toured south, favored Yanmen, and granted that along the route no one need pay this year\'s land tax and levies.',
    'On xinsi day he toured south to Yanmen and exempted the route from this year\'s land tax and levies.',
  ],
  s0760: [
    'On the new moon, gengyin day, of the fifth month he watched the fishing at Lei River.',
    'On the new moon of the fifth month he watched the fishing at Lei River.',
  ],
  s0761: [
    'On jihai day the imperial carriage returned to the palace.',
    'On jihai day the court returned to the palace.',
  ],
  s0762: [
    'On xinwei day in the eighth month of autumn he toured east and sent envoys to sacrifice at Mount Heng.',
    'On xinwei day in the eighth month he toured east and sent envoys to offer sacrifice at Mount Heng.',
  ],
  s0763: [
    'On jiashen day the imperial carriage returned to the palace and granted that along the route no one need pay this year\'s field tax.',
    'On jiashen day the court returned to the palace and exempted the route from this year\'s field tax.',
  ],
  s0764: [
    'On jiayin day in the ninth month a palace was built on White Ascent Mount.',
    'On jiayin day in the ninth month he built a palace on White Ascent Mount.',
  ],
  s0765: [
    'On the new moon, dinghai day, of the eleventh month of winter there was an eclipse of the sun.',
    'On the new moon of the eleventh month there was a solar eclipse.',
  ],
  s0766: [
    'On guihai day in the twelfth month he toured west to Yunzhong, crossed White Road, and hunted wild horses north at Humiliated Solitary Mountain.',
    'On guihai day in the twelfth month he went west to Yunzhong, crossed White Road, and hunted wild horses north at Humiliated Solitary Mountain.',
  ],
  s0767: [
    'He reached the Yellow River, crossed west from Gentleman Ford, and held a great hunt at Xue Forest Mountain.',
    'He came to the Yellow River, crossed west from Gentleman Ford, and held a great hunt at Xue Forest Mountain.',
  ],
  s0768: [
    'On the new moon, bingxu day, of the first month of spring in the fifth year he returned east from Xue Forest.',
    'On the new moon of the first month in year five he turned east from Xue Forest.',
  ],
  s0769: [
    'At Wudi City he feasted and rewarded the officers and soldiers, held a grand communal drinking for two days, and distributed game in gift.',
    'At Wudi City he feasted and rewarded his officers and men, held two days of public celebration, and gave out game as gifts.',
  ],
  s0770: [
    'On jihai day the imperial carriage returned to the palace.',
    'On jihai day the court returned to the palace.',
  ],
  s0771: [
    'On bingxu day in the third month Prince Nanyang Wang Yiwen died.',
    'On bingxu day in the third month Prince Nanyang Wang Yiwen died.',
  ],
  s0772: [
    'On bingyin day in the fourth month of summer Lei South Palace was begun.',
    'On bingyin day in the fourth month he began Lei South Palace.',
  ],
  s0773: [
    'On yiyou day in the fifth month an edict stated: "Emperor Xuanwu embodied the profound remoteness of obtaining the One, responded to the unadorned subtlety of nature; his great conduct and great name did not fully exhaust his supreme excellence.',
    'On yiyou day in the fifth month he proclaimed: "Emperor Xuanwu grasped the deep mystery of the One and answered to nature\'s plain subtlety; yet his great deeds and great fame did not wholly show his full glory.',
  ],
  s0774: [
    'Now that the celestial pattern has opened, we first behold his honored title; let his posthumous epithet be raised further to Emperor Dao Wu, to manifest how the numinous mandate first arose and how sage virtue matched the mystery."',
    'Now the charts of heaven are revealed and we see his true title at last: let his posthumous name be raised to Emperor Dao Wu, that the first stirring of the sacred mandate and the hidden sameness of sage virtue may be made plain."',
  ],
  s0775: [
    'On gengxu day the Marquis of Huainan Sima Guofan, the Marquis of Chiyang Sima Daoci, and others plotted rebellion and were executed.',
    'On gengxu day Sima Guofan, Marquis of Huainan, Sima Daoci, Marquis of Chiyang, and others plotted rebellion and were put to death.',
  ],
  s0776: [
    'On bingyin day in the sixth month he favored Yiyi Calf Mountain.',
    'On bingyin day in the sixth month he went to Yiyi Calf Mountain.',
  ],
  s0777: [
    'That month Emperor Gong of Jin abdicated to Song.',
    'That month Emperor Gong of Jin abdicated in favor of Song.',
  ],
  s0778: [
    'On dingyou day in the seventh month of autumn he went west to Wuyuan.',
    'On dingyou day in the seventh month he went west to Wuyuan.',
  ],
  s0779: [
    'On dingwei day he favored the Great Hall at Yunzhong and granted his followers a grand communal drinking.',
    'On dingwei day he visited the Great Hall at Yunzhong and gave his followers a great public feast.',
  ],
  s0780: [
    'On guihai day in the eighth month the imperial carriage returned to the palace.',
    'On guihai day in the eighth month the court returned to the palace.',
  ],
  s0781: [
    'On jiawu day in the intercalary month Prince Yinping Wang Lie died.',
    'On jiawu day in the intercalary month Prince Yinping Wang Lie died.',
  ],
  s0782: [
    'That year Western Liang perished.',
    'That year Western Liang fell.',
  ],
  s0783: [
    'On jihai day in the second month of spring in the sixth year an edict ordered that for every twenty households in the realm one war horse and one great ox were to be furnished.',
    'On jihai day in the second month of year six he ordered every twenty households to supply one war horse and one great ox.',
  ],
  s0784: [
    'On jiazi day in the third month Prince Yangping Wang Xi died.',
    'On jiazi day in the third month Prince Yangping Wang Xi died.',
  ],
  s0785: [
    'On yihai day a regulation was set that among the six divisions, households with a hundred sheep or more owed one war horse in levy.',
    'On yihai day he ruled that in the six divisions any household with a hundred sheep or more owed one war horse.',
  ],
  s0786: [
    'More than six thousand men from the capital were sent to build a park, starting from the old park, enclosing White Ascent to the east, more than forty li in circuit.',
    'He sent more than six thousand men from the capital to build a park from the old grounds east around White Ascent, more than forty li around.',
  ],
  s0787: [
    'On yiyou day in the sixth month of summer he toured north to Coiled Goat Mountain.',
    'On yiyou day in the sixth month he toured north to Coiled Goat Mountain.',
  ],
  s0788: [
    'On yimao day in the seventh month of autumn the imperial carriage returned to the palace.',
    'On yimao day in the seventh month the court returned to the palace.',
  ],
  s0789: [
    'On guiyou day he toured west.',
    'On guiyou day he toured west.',
  ],
  s0790: [
    'He hunted at Zuo Mountain, personally shot fierce beasts, and took them.',
    'He hunted at Zuo Mountain, shot fierce beasts himself, and brought them down.',
  ],
  s0791: [
    'He then reached the river.',
    'He then came to the river.',
  ],
  s0792: [
    'On gengzi day in the eighth month a great hunt was held at Calf Ford.',
    'On gengzi day in the eighth month he held a great hunt at Calf Ford.',
  ],
  s0793: [
    'On gengxu day in the ninth month the imperial carriage returned to the palace.',
    'On gengxu day in the ninth month the court returned to the palace.',
  ],
  s0794: [
    'On renshen day envoys from Song came on a friendly mission.',
    'On renshen day envoys from Song came on a friendly mission.',
  ],
  s0795: [
    'On jihai day in the tenth month of winter he traveled to favor Dai.',
    'On jihai day in the tenth month he went to Dai.',
  ],
  s0796: [
    'On bingshen day in the twelfth month he toured west in Yunzhong.',
    'On bingshen day in the twelfth month he toured west through Yunzhong.',
  ],
  s0797: [
    'On the new moon, jiachen day, of the first month of spring in the seventh year he traveled west from Yunzhong to favor Wudi City and granted his followers three days of grand communal drinking.',
    'On the new moon of the first month in year seven he went west from Yunzhong to Wudi City and gave his followers three days of public celebration.',
  ],
  s0798: [
    'On bingxu day in the second month the imperial carriage returned to the palace.',
    'On bingxu day in the second month the court returned to the palace.',
  ],
  s0799: [
    'On yichou day in the third month Prince Henan Wang Yao died.',
    'On yichou day in the third month Prince Henan Wang Yao died.',
  ],
  s0800: [
    'On jiaxu day in the fourth month of summer the imperial son Tao was enfeoffed as Prince of Taiping, appointed Chancellor of State, and promoted to Grand General.',
    'On jiaxu day in the fourth month he made his son Tao Prince of Taiping, Chancellor of State, and Grand General.',
  ],
};

let applied = 0;
for (const s of data.sentences) {
  const pair = T[s.id];
  if (!pair) continue;
  s.literal = pair[0];
  s.idiomatic = pair[1];
  applied++;
}

fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', applied, 'translations to', path);
