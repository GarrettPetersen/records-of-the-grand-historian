#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'On day xinchou, quota rent on banner land occupied by new barracks in Rehe was remitted.',
    'On xinchou day Rehe barracks land rent was forgiven.',
  ],
  s0202: [
    'On day renyin flood victims in Qiantang and ten other counties of Zhejiang were relieved.',
    'On renyin day Zhejiang floods in Qiantang and ten counties were relieved.',
  ],
  s0203: [
    'On day guimao Zhang Xun was removed as Eastern Three Provinces field deputy and ordered to his Gansu provincial commander post.',
    'On guimao day Zhang Xun left Manchuria for Gansu commander.',
  ],
  s0204: [
    'On day jiachen Wu Tingfang and Qian Xun were both ordered to the capital; Acting Foreign Ministry right director Zhang Yintang was made envoy to the United States, Mexico, Peru, and Cuba, and Acting right councillor Wu Zonglian envoy to Italy.',
    'On jiachen day Wu Tingfang and Qian Xun were recalled; Zhang Yintang went to the Americas and Wu Zonglian to Italy.',
  ],
  s0205: [
    'Zhao Erxun memorialized that shallow-water Lolo in Ningyuan, Sichuan, were pacified.',
    'Zhao Erxun reported pacifying shallow-water Lolo in Sichuan\'s Ningyuan.',
  ],
  s0206: [
    'On day yisi cotton-clothing silver was granted to the capital poor; this became regular.',
    'On yisi day the capital poor got winter-clothing silver, later annual.',
  ],
  s0207: [
    'On day bingwu Li Zhun was made Guangdong naval commander.',
    'On bingwu day Li Zhun became Guangdong naval commander.',
  ],
  s0208: [
    'Autumn, seventh month, new moon on day wushen: Hunan garrisons and camps at Changde, Baoqing, Yongshun, Yuezhou, Lizhou, Linwu, Guiyang, Xuanfeng, Yongzhou, Wugang, Yuanzhou, Suijing, Chenzhou, Lingdong, and others, with brigade and provincial deputy and staff posts, were all cut.',
    'Month 7, wushen new moon: Hunan cut many garrisons and staff posts.',
  ],
  s0209: [
    'On day guichou the Liao River was dredged.',
    'On guichou day the Liao River was dredged.',
  ],
  s0210: [
    'On day bingchen the naval planning ministers submitted draft flags and uniforms for naval officers, and the General Staff submitted provisional regulations.',
    'On bingchen day navy insignia drafts and General Staff rules were filed.',
  ],
  s0211: [
    'Flood victims in Pingxiang and other counties of Jiangxi were relieved.',
    'Jiangxi\'s Pingxiang flood victims were fed.',
  ],
  s0212: [
    'On day dingsi autumn executions were suspended.',
    'On dingsi day autumn executions were halted.',
  ],
  s0213: [
    'The Law Ministry submitted supplementary trial regulations for high courts and a draft organization for provincial courts.',
    'The Law Ministry filed high-court trial rules and provincial court outlines.',
  ],
  s0214: [
    'Coal and iron mines at Dragon King Cave, Jiangbei department, Chongqing, Sichuan, were opened.',
    'Sichuan\'s Chongqing Jiangbei Dragon King Cave mines opened.',
  ],
  s0215: [
    'On day wuwu, silver and grain for disaster fields in Ludian and Zhenxiong departments, Yunnan, were remitted.',
    'On wuwu day Ludian and Zhenxiong disaster taxes were forgiven.',
  ],
  s0216: [
    'On day jiashen a southern industry exhibition was planned; Liangjiang Governor Zhang Renjun was made chairman; each province was to organize associations and exhibit goods tax-free.',
    'On jiashen day Zhang Renjun chaired a southern industry fair with tax-free exhibits.',
  ],
  s0217: [
    'On day xinyou the Jing Emperor Dezong\'s coffin was moved to the mountain tomb; banner rent on the route was remitted and seed silver granted.',
    'On xinyou day Dezong\'s coffin went to the tomb with route tax relief and seed silver.',
  ],
  s0218: [
    'On day jiazi the Henan grain-salt circuit was cut and patrol and encouragement-of-industry circuits were added.',
    'On jiazi day Henan cut its grain-salt circuit and added patrol and industry circuits.',
  ],
  s0219: [
    'On day wuchen the provinces were instructed to restore granary reserves.',
    'On wuchen day provinces were told to refill granaries.',
  ],
  s0220: [
    'The eighth-rank Summer Palace garden deputy Yong Lin, who died remonstrating, was posthumously comforted.',
    'Yong Lin, who died remonstrating at the Summer Palace, was posthumously honored.',
  ],
  s0221: [
    'On day gengwu consuls were added on southern islands.',
    'On gengwu day southern-island consuls were added.',
  ],
  s0222: [
    'On day renshen the Education Ministry established a library in the capital.',
    'On renshen day the Education Ministry opened a capital library.',
  ],
  s0223: [
    'Yao Qishan of the Hong River secret society was executed.',
    'Hong River rebel Yao Qishan was executed.',
  ],
  s0224: [
    'On day bingzi Hubei sold grain at fair price.',
    'On bingzi day Hubei sold grain at fair price.',
  ],
  s0225: [
    'Eighth month, new moon on day dingchou: Constitutional Investigation Commissioner Li Jiaju presented books such as his study of Japan\'s judicial system.',
    'Month 8, dingchou new moon: Li Jiaju filed studies including Japan\'s judiciary.',
  ],
  s0226: [
    'On day xinsi coal mines on the Gan River at Mergen, Heilongjiang, were opened.',
    'On xinsi day Heilongjiang\'s Mergen Gan River coal mines opened.',
  ],
  s0227: [
    'On day jiashen Jilin\'s Binjiang circuit became the Northwest Circuit, the West Circuit the Southwest Circuit, and the earlier Northeast and Southeast circuits were all named sub-circuit defense posts.',
    'On jiashen day Jilin circuits were renamed northwest, southwest, northeast, and southeast defense posts.',
  ],
  s0228: [
    'On day yiyou Fuzhou wind disaster and floods in Kailu and Pingquan, Rehe, were relieved.',
    'On yiyou day Fujian wind and Rehe floods were relieved.',
  ],
  s0229: [
    'On day bingxu Tibetan unrest was pacified by Zhao Erfeng.',
    'On bingxu day Zhao Erfeng pacified Tibetan unrest.',
  ],
  s0230: [
    'Candidate Grand Secretariat Bachelor Li Jiaju was ordered to assist the Political Consultative Pavilion.',
    'Li Jiaju was told to assist the Political Consultative Pavilion.',
  ],
  s0231: [
    'On day wuzi the Beijing-Zhangjiakou Railway was completed.',
    'On wuzi day the Beijing-Zhangjiakou Railway opened.',
  ],
  s0232: [
    'Silver and grain for fields ruined digging channels in Zhenhai county, Zhejiang, were remitted.',
    'Zhenhai\'s ruined canal fields were forgiven tax.',
  ],
  s0233: [
    'On day jichou gold mines in Pingjiang, Hunan, antimony in Xinhua, and lead in Changning were opened.',
    'On jichou day Hunan opened Pingjiang gold, Xinhua antimony, and Changning lead mines.',
  ],
  s0234: [
    'On day gengyin Chen Hongwei, a juren of Huangpi, Hubei, who died saving his father, received praise for filial conduct and was recorded in the histories.',
    'On gengyin day filial martyr Chen Hongwei of Huangpi was recorded in the histories.',
  ],
  s0235: [
    'On day dingyou Grand Secretaries Sun Jianai and Zhang Zhidong both asked to retire for illness.',
    'On dingyou day Sun Jianai and Zhang Zhidong both sought sick retirement.',
  ],
  s0236: [
    'An edict urged them to remain.',
    'An edict asked them to stay.',
  ],
  s0237: [
    'On day wuxu the Agriculture, Industry, and Commerce Ministry memorialized on trial issue of industry-promotion bonds.',
    'On wuxu day the ministry trialed industry-promotion bonds.',
  ],
  s0238: [
    'On day jihai Grand Secretary Zhang Zhidong died; he was posthumously made Grand Guardian and entered the Temple of Eminent Statesmen.',
    'On jihai day Zhang Zhidong died and was made Grand Guardian with temple honors.',
  ],
  s0239: [
    'Dai Hongci was ordered to study at the Grand Council.',
    'Dai Hongci was told to learn on the Grand Council.',
  ],
  s0240: [
    'Ting Jie was made Law Minister and Ge Baohua Rites Minister.',
    'Ting Jie became law minister and Ge Baohua rites minister.',
  ],
  s0241: [
    'On day gengzi Cheng Xun was transferred as Rehe Commander-in-Chief and Pu Liang as Chahar Commander-in-Chief.',
    'On gengzi day Cheng Xun took Rehe and Pu Liang Chahar.',
  ],
  s0242: [
    'On day guimao the capital opened porridge kitchens for the poor; over twenty-five hundred shi of grain were issued; institutions already reformed as relief bureaus and craft schools still received grain — this became annual.',
    'On guimao day capital porridge kitchens fed the poor with 2,500+ shi yearly thereafter.',
  ],
  s0243: [
    'On day yisi the statute-revision legal ministers submitted the compiled current penal code; it was sent to the Constitutional Compilation and Review Office.',
    'On yisi day the revised penal code went to the constitutional office.',
  ],
  s0244: [
    'On day bingwu an edict fixed the first day of the ninth month as the date for each province to convene delegates and open session, with special admonition.',
    'On bingwu day the ninth month\'s first day was fixed for provincial assemblies to open.',
  ],
  s0245: [
    'An instruction said: 「Deliberative assembly delegates should frankly state local gains and losses and plan soundly.',
    'The throne said: 「Assembly delegates must speak frankly on local good and harm and plan carefully.',
  ],
  s0246: [
    'Do not let private interest harm the public good, nor temper flare and disorder settled rules, nor treat matters as too easy and speak with undue boldness, nor let unclear authority make laws encroach.',
    'They must not serve private ends, break rules in anger, speak rashly, or exceed legal bounds.',
  ],
  s0247: [
    'Each governor should also listen with an open mind, weigh, and carry out measures, so court and provinces may be of one mind and gradually reach good order.',
    'Governors must heed them and act so court and provinces move together toward order.',
  ],
  s0248: [
    'After sessions open, each governor should especially follow the fixed regulations, truly supervise, and ensure resolved matters do not exceed authority or violate law.',
    'Once assemblies meet, governors must supervise so decisions stay within law and authority.',
  ],
  s0249: [
    'Together offer loyal devotion to seek strength and wealth — We place great hope in this.',
    'Serve loyally for national strength — the throne expects much.',
  ],
  s0250: [
    '" (closing quotation mark in the source.) That month Zaitao and Sa Zhenbing went abroad to inspect the navy.',
    'The instruction closed. That month Zaitao and Sa Zhenbing inspected navies abroad.',
  ],
  s0251: [
    'Ninth month, new moon on day dingwei: orders of nobility insignia were first made and conferred.',
    'Month 9, dingwei new moon: nobility insignia were first issued.',
  ],
  s0252: [
    'On day xinhai the Hague Convention treaty was completed and ratified separately.',
    'On xinhai day the Hague Convention was signed and ratified.',
  ],
  s0253: [
    'On day guichou Zhao Erxun was additionally ordered to act as Chengdu General.',
    'On guichou day Zhao Erxun also acted as Chengdu general.',
  ],
  s0254: [
    'On day yimao the Grand Secretariat jointly memorialized on the great rite of elevating Dezong.',
    'On yimao day the Grand Secretariat reported Dezong\'s temple elevation rites.',
  ],
  s0255: [
    'An edict said the Yi Emperor Muzong and the Jing Emperor Dezong are both temples that must never be displaced; they should stand left and right by zhao-mu sequence, not by zhao-mu rank.',
    'An edict placed Muzong and Dezong as co-eternal temples by left-right zhao-mu, not by rank.',
  ],
  s0256: [
    'Dezong\'s elevation to the Grand Temple central hall was fixed in the western second row, fifth mu chamber.',
    'Dezong would enter the central Grand Temple hall in the western fifth mu chamber.',
  ],
  s0257: [
    'In the front hall, next to the Xian Emperor Wenzong, a seat facing west in the mu position was respectfully set.',
    'A western-facing mu seat was set before the hall beside Wenzong.',
  ],
  s0258: [
    'The Hall of Ancestors followed this.',
    'The Hall of Ancestors followed the same rule.',
  ],
  s0259: [
    'This was fixed as perpetual statute.',
    'The arrangement became permanent law.',
  ],
  s0260: [
    'On day dingsi graduates of the Aristocratic Army Academy such as Zicheng Quan, made imperial bodyguards, received attendant rank and graded promotion.',
    'On dingsi day army academy graduates including Zicheng Quan became guards with graded promotion.',
  ],
  s0261: [
    'On day jiwei the Political Consultative Pavilion submitted election regulations.',
    'On jiwei day the Political Consultative Pavilion filed election rules.',
  ],
  s0262: [
    'On day renxu a German traveling in Yunnan was killed by angry Yi; the killers were seized and executed.',
    'On renxu day Yunnan Yi killed a German traveler; the killers were caught and executed.',
  ],
  s0263: [
    'On day jiazi the Yellow River in Henan ran clear.',
    'On jiazi day the Henan Yellow River ran clear.',
  ],
  s0264: [
    'Floods in Guangzhou and Nanhai counties of Guangdong were relieved.',
    'Guangdong floods in Guangzhou and Nanhai were relieved.',
  ],
  s0265: [
    'On day yichou disaster in Xilin Gol leagues Abag, Abahanar, Haoqit, and Ujimqin; thirty thousand taels were issued.',
    'On yichou day thirty thousand taels aided Xilin Gol league disasters.',
  ],
  s0266: [
    'Floods in Zhenxiong and other prefectures and counties of Yunnan were relieved.',
    'Yunnan floods in Zhenxiong and elsewhere were relieved.',
  ],
  s0267: [
    'On day bingyin the Yellow River ran clear.',
    'On bingyin day the Yellow River ran clear.',
  ],
  s0268: [
    'Lu Chuanlin was made Grand Secretary of the Hall of Literary Glory; Personnel Minister Lu Runxiang joint grand secretary.',
    'Lu Chuanlin became a grand secretary; Lu Runxiang joint grand secretary.',
  ],
  s0269: [
    'Returned students including Xiang Xiang were granted juren rank.',
    'Returned students including Xiang Xiang became juren.',
  ],
  s0270: [
    'On day xinwei Hanlin academicians were raised to fourth rank, readers and lecturers to sub-fourth, drafting secretaries to fifth, compilers and reviewers to sub-fifth.',
    'On xinwei day Hanlin ranks were raised.',
  ],
  s0271: [
    'Plaques for schools overseas Chinese built in Java were issued.',
    'Java overseas Chinese school plaques were issued.',
  ],
  s0272: [
    'On day guiyou the southern Yellow River ran clear.',
    'On guiyou day the southern Yellow River ran clear.',
  ],
  s0273: [
    'That month the Korean An Jung-geun assassinated former Japanese resident-general of Korea Ito Hirobumi at Harbin.',
    'That month Korean An Jung-geun killed Ito Hirobumi at Harbin.',
  ],
  s0274: [
    'Winter, tenth month, new moon on day dingchou: Yi bandits at Erbangfang on the Xichang-Huili border in Sichuan rebelled and were suppressed by government troops.',
    'Month 10, dingchou new moon: Sichuan Yi rebels at Erbangfang were crushed.',
  ],
  s0275: [
    'Chengdu General Ma Liang died.',
    'Ma Liang, Chengdu general, died.',
  ],
  s0276: [
    'On day gengchen the Xiaokin Empress Dowager was buried at Putuo Valley, Ding Eastern Mausoleum; quota tax on the coffin route was remitted and seed silver granted for leveling wheat fields.',
    'On gengchen day the late empress dowager was buried at Putuo Valley with route tax relief.',
  ],
  s0277: [
    'On day yiyou the late empress dowager\'s spirit tablet entered the Grand Temple; the next day an edict was issued to the realm.',
    'On yiyou day her tablet entered the Grand Temple and was announced next day.',
  ],
  s0278: [
    'On day bingxu it was fixed that the Chengdu General need not command Songpan and Jianchang.',
    'On bingxu day the Chengdu general no longer commanded Songpan and Jianchang.',
  ],
  s0279: [
    'Yu Kun was made Chengdu General.',
    'Yu Kun became Chengdu general.',
  ],
  s0280: [
    'On day dinghai Zhili Governor Duan Fang was removed for violating regulations.',
    'On dinghai day Duan Fang lost Zhili for breaking rules.',
  ],
  s0281: [
    'Chen Qilong was transferred as Zhili Governor and trade minister; Rui Cheng acted as Huguang Governor; Bao Fen became Jiangsu Governor.',
    'Chen Qilong took Zhili, Rui Cheng acted in Huguang, Bao Fen took Jiangsu.',
  ],
  s0282: [
    'Sun Baoqi was made Shandong Governor and Ding Baochen Shanxi Governor.',
    'Sun Baoqi became Shandong governor and Ding Baochen Shanxi governor.',
  ],
  s0283: [
    'On day jichou an edict on first- and second-stage constitutional preparation ordered all officials to serve faithfully and the Constitutional Compilation and Review Office to audit results and impeach delay or perfunctory work.',
    'On jichou day constitutional prep was audited and slack officials could be impeached.',
  ],
  s0284: [
    'On day gengyin the Constitutional Compilation and Review Office submitted finalized regulations for provincial chief procurators.',
    'On gengyin day provincial chief-procurator rules were finalized.',
  ],
  s0285: [
    'Gold mines at Harag Langang, Urga, were opened.',
    'Urga\'s Harag Langang gold mines opened.',
  ],
  s0286: [
    'Yan Zhi was removed for illness; Sanduo was ordered to act as Urga Commissioner.',
    'Yan Zhi left for illness; Sanduo acted as Urga commissioner.',
  ],
  s0287: [
    'On day xinmao disasters in Liyang, Jintan, Jingxi, Yixing, Dantu, Danyang, Zhenze, and other counties of Jiangsu; thirty thousand taels were issued.',
    'On xinmao day thirty thousand taels relieved Jiangsu county disasters.',
  ],
  s0288: [
    'On day guisi the Civil Affairs Ministry memorialized to grant rice by precedent, fix each institution\'s real needs, and shelter the poor; an edict followed.',
    'On guisi day the ministry\'s poor-relief rice plan was approved.',
  ],
  s0289: [
    'Floods in Dayao and Wenshan counties, Yunnan, were relieved.',
    'Yunnan floods in Dayao and Wenshan were relieved.',
  ],
  s0290: [
    'On day jiawu Grand Secretary Sun Jianai died; he was posthumously made Grand Tutor, entered the Temple of Eminent Statesmen, and granted silver for the funeral.',
    'On jiawu day Sun Jianai died with Grand Tutor honors and funeral silver.',
  ],
  s0291: [
    'An edict ordered the late fifth-rank Qing title Shanxi candidate magistrate Wang Zongyi, eminent in classical learning, recorded in the histories.',
    'Wang Zongyi, classical scholar, was ordered recorded in the histories.',
  ],
  s0292: [
    'One month\'s stipend was granted idle bannermen and imperial clansmen, half a month\'s to widows and orphans, and half a month\'s to Eight Banner, Green Standard, and Foot Garrison troops — this became annual.',
    'Bannermen, orphans, and troops got annual stipend grants.',
  ],
  s0293: [
    'On day dingyou, silver and grain for flooded fields in Yuanjiang prefecture, Yunnan, were remitted.',
    'On dingyou day Yuanjiang flood taxes were forgiven.',
  ],
  s0294: [
    'On day gengzi the Yellow River at Dongming ran clear.',
    'On gengzi day the Dongming Yellow River ran clear.',
  ],
  s0295: [
    'On day guimao the Guangdong bandit-capture reward was abolished; hereafter any civil or military official who again took such rewards would be treated as bribery.',
    'On guimao day Guangdong capture bonuses ended; taking them became bribery.',
  ],
  s0296: [
    'The former Rites Minister Li Duanfen was restored to his original post.',
    'Li Duanfen regained his old rites post.',
  ],
  s0297: [
    'On day jiachen this year\'s Jilin pearl tribute was stopped.',
    'On jiachen day Jilin\'s pearl tribute was canceled this year.',
  ],
  s0298: [
    'On day yisi Shuntian gentry asked temples for the late Ministers Lishan and Bachelor Lian Yuan; it was permitted.',
    'On yisi day Shuntian was allowed shrines to Lishan and Lian Yuan.',
  ],
  s0299: [
    'Eleventh month, day wushen: quota tax and banner rent in eleven departments and counties of Zhili including Wuqing were remitted, and quota tax in Kaizhou, Dongming, and Changyuan.',
    'Month 11, wushen: Zhili tax and banner rent were cut in eleven districts and three counties.',
  ],
  s0300: [
    'On day jiyou the honorific title for the Empress Dowager who was both line mother was conferred as Empress Dowager Longyu; the next day an edict was issued to the realm.',
    'On jiyou day the dual-line empress dowager received the title Longyu and it was announced next day.',
  ]
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_025_b03.mjs <translation.json>'
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
