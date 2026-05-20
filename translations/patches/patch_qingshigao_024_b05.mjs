#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'On day gengwu, for suppressing memorials on reform and being first to violate the edict, Minister of Rites Huaitabu, Xu Yingqi, Vice Ministers Kunxiu, Xu Huifeng, Pu\'e, Zeng Guanghan, and others were stripped of office.',
    'On gengwu day, Huaitabu, Xu Yingqi, Kunxiu, Xu Huifeng, Pu\'e, Zeng Guanghan, and other Rites officials lost their posts for blocking reform memorials.',
  ],
  s0402: [
    'Palace memorial clerk Wang Zhao was rewarded with a fourth-rank metropolitan office.',
    'Wang Zhao, memorial clerk, was given fourth-rank metropolitan rank.',
  ],
  s0403: [
    'On day xinwei, Zeng Guofan\'s county regulations on clearing lawsuits and merit-and-demerit rules were issued to all provinces, with circuit and prefect merit-and-demerit added.',
    'On xinwei day, Zeng Guofan\'s county lawsuit and merit rules went to every province, with added circuit and prefect scoring.',
  ],
  s0404: [
    'An edict ordered dredging of Beijing canals and ditches and leveling the roads.',
    'The throne ordered Beijing waterways dredged and streets leveled.',
  ],
  s0405: [
    'An edict ordered all provinces to implement militia training.',
    'Provinces were told to carry out tuanlian militia.',
  ],
  s0406: [
    'Hanlin Reader Yang Rui, Attendant Secretary Lin Xu, Punishments clerk Liu Guangdi, and Jiangsu prefect Tan Sitong were all given concurrent fourth-rank minister titles to take part in the New Policies.',
    'Yang Rui, Lin Xu, Liu Guangdi, and Tan Sitong received fourth-rank minister titles to join the New Policies.',
  ],
  s0407: [
    'Jianshui flood victims were relieved.',
    'Jianshui flood relief was ordered.',
  ],
  s0408: [
    'On day guiyou, Li Hongzhang was removed from service at the Zongli Yamen.',
    'On guiyou day, Li Hongzhang left the Zongli Yamen.',
  ],
  s0409: [
    'Yulu was made Minister of Rites, serving at the Zongli Yamen.',
    'Yulu became Minister of Rites at the Zongli Yamen.',
  ],
  s0410: [
    'On day yihai, third-, fourth-, and fifth-rank ministers and third- through sixth-rank academicians were established.',
    'On yihai day, new minister and academician ranks were created.',
  ],
  s0411: [
    'On day bingzi, Taihe flood victims were relieved.',
    'On bingzi day, Taihe received flood relief.',
  ],
  s0412: [
    'On day dingchou, Yuan Shikai was summoned to the capital.',
    'On dingchou day, Yuan Shikai was called to Beijing.',
  ],
  s0413: [
    'An edict said: "The state is reviving many policies and also adopting Western methods, truly because governing for the people is the same in China and the West, and Western methods can supply what we lack.',
    'By edict: "The state revives government and adopts Western ways because both East and West govern for the people, and the West can fill our gaps.',
  ],
  s0414: [
    'Today scholars-officials are blind to conditions abroad and readily say that there are no regulations at all in those countries.',
    'Officials ignorant of foreign affairs claim the West has no real institutions.',
  ],
  s0415: [
    'They do not know that Western government has ten thousand branches, most of which aim to open the people\'s wisdom and enrich their households.',
    'Western government is vast, but mostly it enlightens minds and enriches families.',
  ],
  s0416: [
    'At its finest it can refine character and prolong life.',
    'At best it refines character and extends life.',
  ],
  s0417: [
    'Benefit to living men is extended without omission.',
    'Human welfare is pursued to the full.',
  ],
  s0418: [
    'I work diligently day and night, reforming a hundred measures—this is not to esteem novelty for its own sake.',
    'I labor day and night on reform, not from love of novelty.',
  ],
  s0419: [
    'It is because I cherish the people, all bestowed by Heaven and bequeathed by the ancestors; unless I make them all secure, happy, and united, I have not fulfilled my duty.',
    'I cherish the people Heaven and the ancestors gave me; unless they live in peace and unity, I fail my charge.',
  ],
  s0420: [
    'Moreover, every country presses and encroaches upon us; unless we take others\' strengths, we cannot preserve all that is ours.',
    'Nations press on us from every side; we must learn their strengths to keep what is ours.',
  ],
  s0421: [
    'My purpose is extremely painful, yet the common people still do not know it.',
    'My purpose is arduous, yet the people still do not understand.',
  ],
  s0422: [
    'The fault lies with unworthy officials and conservative scholars who cannot broadly proclaim my intent.',
    'Unworthy officials and conservative gentry have failed to explain my intent.',
  ],
  s0423: [
    'So that even clerks stir up loose talk, small folk are shaken with fear, and among mountain villagers leaning on staffs there are those who have not heard of the New Policies—I truly sigh with regret.',
    'Clerks spread rumors, commoners panic, and remote villagers never hear of reform—I grieve at this.',
  ],
  s0424: [
    'Now I will publish the meaning of the reforms throughout the empire, so that the people all understand my heart and together know that their ruler can be relied upon.',
    'I now proclaim reform throughout the realm so all may trust their ruler.',
  ],
  s0425: [
    'Above and below in one mind, to complete the New Policies and strengthen China—this is my earnest hope.',
    'With one heart above and below, we shall finish the New Policies and strengthen China.',
  ],
  s0426: [
    '" Provinces were ordered to abolish courier stations and establish postal service.',
    '" Provinces were told to end courier posts and set up mail.',
  ],
  s0427: [
    'Strict prohibition on exporting grain was enforced.',
    'Grain export was strictly banned.',
  ],
  s0428: [
    'Eighth month, renwu new moon: the Board of Revenue was ordered to compile tables of annual income and expenditure and issue them.',
    'Month 8, renwu new moon: Revenue was to publish annual budget tables.',
  ],
  s0429: [
    'An edict ordered envoys abroad to summon overseas Chinese home for appointment.',
    'Envoys were told to bring overseas Chinese home for service.',
  ],
  s0430: [
    'Yuan Shikai was ordered to await appointment as vice minister, exclusively in charge of troop training.',
    'Yuan Shikai awaited vice-minister rank to train troops exclusively.',
  ],
  s0431: [
    'On day bingxu, the Japanese marquis Ito Hirobumi and Acting Envoy Hayashi Gonsuke were received at the Hall of Diligent Government.',
    'On bingxu day, Ito Hirobumi and Hayashi Gonsuke were received at the Hall of Diligent Government.',
  ],
  s0432: [
    'Shehong and other counties received flood relief; Lueyang and other counties received flood and hail relief.',
    'Shehong and other counties, and Lueyang and other counties, received disaster relief.',
  ],
  s0433: [
    'On day dinghai, the Empress Dowager again held court from behind the curtain at the side hall to instruct in government.',
    'On dinghai day, the Empress Dowager resumed regency from behind the curtain.',
  ],
  s0434: [
    'An edict said Kang Youwei had formed factions for private gain and used wicked words to disorder government; his office was stripped and he and his brother Guangren were both arrested and imprisoned.',
    'Kang Youwei was stripped for faction and sedition; he and Guangren were jailed.',
  ],
  s0435: [
    'Youwei escaped.',
    'Kang Youwei fled.',
  ],
  s0436: [
    'On day wuzi, an edict ordered the arrest of Kang Youwei and Liang Qichao.',
    'On wuzi day, Kang Youwei and Liang Qichao were ordered seized.',
  ],
  s0437: [
    'On day gengyin, Vice Minister of Revenue Zhang Yin-huan, Hanlin Reader Xu Zhijing, Censor Yang Shenxiu, and Yang Rui, Lin Xu, Liu Guangdi, and Tan Sitong were all arrested as Kang Youwei\'s faction and imprisoned.',
    'On gengyin day, Zhang Yin-huan, Xu Zhijing, Yang Shenxiu, Yang Rui, Lin Xu, Liu Guangdi, and Tan Sitong were jailed as Kang\'s party.',
  ],
  s0438: [
    'On day xinmao, the Emperor claimed illness and physicians were summoned from throughout the empire.',
    'On xinmao day, the Emperor feigned illness and doctors were sought empire-wide.',
  ],
  s0439: [
    'Ronglu was summoned to the capital.',
    'Ronglu was called to Beijing.',
  ],
  s0440: [
    'An order was issued to arrest Wen Tingshi and seize Sun Wen.',
    'Wen Tingshi was to be seized and Sun Wen captured.',
  ],
  s0441: [
    'On day renchen, an edict restored the Household of the Heir Apparent, the Office of Transmission, and the Courts of the Censorate, Ceremonial, Imperial Stud, and Imperial Banquets.',
    'On renchen day, the Heir Apparent\'s Household, Transmission Office, and several courts were restored.',
  ],
  s0442: [
    'Officials and commoners were forbidden to submit memorials on their own.',
    'Private submission of memorials was banned.',
  ],
  s0443: [
    'The Current Affairs Gazette was abolished.',
    'The Current Affairs Gazette was shut down.',
  ],
  s0444: [
    'Provincial temples were not to be converted into schools.',
    'Provinces were forbidden to turn temples into schools.',
  ],
  s0445: [
    'Vice Minister of Personnel Xu Yongyi was ordered to serve at the Zongli Yamen.',
    'Xu Yongyi was posted to the Zongli Yamen.',
  ],
  s0446: [
    'On day guisi, eighty thousand shi of Jiangsu tribute grain was diverted to commutation for Xu and Hai relief.',
    'On guisi day, eighty thousand shi of Jiangsu grain was commuted for Xu and Hai relief.',
  ],
  s0447: [
    'Gaozhou flood victims were relieved.',
    'Gaozhou received flood relief.',
  ],
  s0448: [
    'On day jiawu, Yang Shenxiu, Yang Rui, Lin Xu, Liu Guangdi, Tan Sitong, and Kang Guangren were all executed.',
    'On jiawu day, the Six Gentlemen and Kang Guangren were executed.',
  ],
  s0449: [
    'Zhang Yin-huan was banished to Xinjiang.',
    'Zhang Yin-huan was sent to Xinjiang.',
  ],
  s0450: [
    'Xu Zhijing was placed under house arrest.',
    'Xu Zhijing was confined.',
  ],
  s0451: [
    'Ronglu was made Grand Councilor.',
    'Ronglu joined the Grand Council.',
  ],
  s0452: [
    'Yulu was made Governor-General of Zhili and concurrently Beiyang Minister.',
    'Yulu became Zhili governor-general and Beiyang minister.',
  ],
  s0453: [
    'On day yiwei, because Kang Youwei was utterly disloyal and had fomented secret plots, an imperial rescript in vermilion ink was issued to declare this to the officials.',
    'On yiwei day, Kang Youwei was denounced in a vermilion rescript for treason and conspiracy.',
  ],
  s0454: [
    'The tour to Tianjin to review troops was canceled.',
    'The Tianjin troop review tour was called off.',
  ],
  s0455: [
    'Ronglu was ordered to manage Board of War affairs and also command Beiyang forces and Song Qing\'s army.',
    'Ronglu took War Board affairs and command of Beiyang and Song Qing\'s troops.',
  ],
  s0456: [
    'On day dingyou, the property of Kang Youwei and Liang Qichao was confiscated.',
    'On dingyou day, Kang Youwei\'s and Liang Qichao\'s estates were seized.',
  ],
  s0457: [
    'Zhao Shuqiao was ordered to join Wang Wenshao in supervising the General Bureau of Mines and Railways.',
    'Zhao Shuqiao and Wang Wenshao were to run the mines and railways bureau.',
  ],
  s0458: [
    'An edict ordered new Jiangsu and Zhejiang tribute grain transported to the capital; the plan for commutation was dropped.',
    'New Jiangsu and Zhejiang grain was to reach the capital; commutation was abandoned.',
  ],
  s0459: [
    'Shandong\'s new tribute grain was retained for relief.',
    'Shandong new grain was kept for relief.',
  ],
  s0460: [
    'On day wuxu, Yuan Chang was rewarded with third-rank metropolitan office, serving at the Zongli Yamen.',
    'On wuxu day, Yuan Chang received third-rank rank at the Zongli Yamen.',
  ],
  s0461: [
    'On day gengzi, Li Duanfen was stripped for reckless recommendation and banished to Xinjiang.',
    'On gengzi day, Li Duanfen lost office for reckless nomination and went to Xinjiang.',
  ],
  s0462: [
    'Wang Zhao was stripped of office, his property confiscated, and he was arrested.',
    'Wang Zhao was dismissed, his home seized, and he was arrested.',
  ],
  s0463: [
    'On day xinchou, former Censor Wen Ti was rewarded with a prefecture.',
    'On xinchou day, ex-Censor Wen Ti received a prefecture.',
  ],
  s0464: [
    'On day renyin, Huang Zunxian was excused for illness; Li Shengduo was rewarded with fourth-rank metropolitan office as envoy to Japan.',
    'On renyin day, Huang Zunxian retired ill; Li Shengduo became envoy to Japan.',
  ],
  s0465: [
    'Chen Baozhen was stripped of the Hunan governorship for reckless recommendation.',
    'Chen Baozhen lost Hunan for reckless nomination.',
  ],
  s0466: [
    'On day guimao, an edict ordered frontier governors to discipline officials, cultivate talent, open revenue sources, repair armaments, impeach and reward magistrates, and put camp regulations in order.',
    'On guimao day, governors were told to reform officials, talent, revenue, arms, magistrates, and camps.',
  ],
  s0467: [
    'An edict told all officials to point out gains and losses in national policy; those who confused right and wrong and attacked others were to be punished.',
    'Officials might criticize policy, but partisan attacks were criminal.',
  ],
  s0468: [
    'On day yisi, an imperial directive restored the old system of provincial and metropolitan examinations and annual and triennial tests, abolished the special economic examination, and abolished the Agriculture, Industry, and Commerce bureaus.',
    'On yisi day, civil exams and the economic special exam were restored; agriculture and commerce bureaus ended.',
  ],
  s0469: [
    'On day bingwu, Duan Fang presented songs he had compiled to encourage virtue; an edict ordered their distribution.',
    'On bingwu day, Duan Fang\'s moral songs were ordered published.',
  ],
  s0470: [
    'An imperial directive ordered frontier governors to protect the people\'s livelihood, choose upright officials carefully, and put baojia and militia in order.',
    'Governors were to guard livelihoods, pick good magistrates, and organize baojia and militia.',
  ],
  s0471: [
    'Whatever in waterworks, sericulture, manufacture, transport, and sale benefited the people was to be taught in season.',
    'Irrigation, sericulture, manufacture, and trade useful to the people were to be taught in season.',
  ],
  s0472: [
    'The ban on forming societies under joint names was reiterated.',
    'Joint-name societies were again forbidden.',
  ],
  s0473: [
    'Ronglu was appointed Imperial Commissioner.',
    'Ronglu became Imperial Commissioner.',
  ],
  s0474: [
    'On day jiyou, Yulu was ordered to jointly supervise the Lu-Han and other railways.',
    'On jiyou day, Yulu was to oversee the Lu-Han railway and others.',
  ],
  s0475: [
    'Shanghai and Hankou waterworks bureaus were established.',
    'Shanghai and Hankou water bureaus were set up.',
  ],
  s0476: [
    'Ninth month, xinhai new moon: an imperial directive said that all government touching national welfare, whether new or old, was still to be carried forward step by step.',
    'Month 9, xinhai new moon: state policies old and new were still to advance in order.',
  ],
  s0477: [
    'Memorialists were to make their memorials truly benefit the times and not guess at motives.',
    'Memorials had to aid the times, not flatter by guesswork.',
  ],
  s0478: [
    'On day guichou, two hundred thousand taels from the privy purse were issued for Shandong flood relief.',
    'On guichou day, two hundred thousand taels from the privy purse went to Shandong floods.',
  ],
  s0479: [
    'Gansu and Xinjiang were shaken by earthquake.',
    'Earthquakes struck Gansu and Xinjiang.',
  ],
  s0480: [
    'On day dingsi, Guangxi bandits were pacified.',
    'On dingsi day, Guangxi bandits were subdued.',
  ],
  s0481: [
    'On day jiwei, Grand Councilors were ordered to meet with Grand Secretaries and ministry heads to discuss Yellow River policy.',
    'On jiwei day, the council and ministries debated Yellow River policy.',
  ],
  s0482: [
    'At first, in cases of armed robbery, no distinction was made between principal and accomplice.',
    'Armed robbery had once been punished without distinguishing roles.',
  ],
  s0483: [
    'Now the Grand Council and the law offices were ordered to deliberate distinctions in detail.',
    'Now councilors and the law offices were to define distinctions.',
  ],
  s0484: [
    'Daizhou was shaken by earthquake.',
    'Daizhou had an earthquake.',
  ],
  s0485: [
    'On day renxu, overdue taxes were remitted in Xianning and other districts of Shaanxi.',
    'On renxu day, Shaanxi Xianning and other districts had overdue taxes forgiven.',
  ],
  s0486: [
    'On day wuchen, the old military examination system for provincial, metropolitan, and child tests was restored; only military jinshi for camp use and military juren selected by lot were ordered to practice firearms.',
    'On wuchen day, military exams were restored; camp military jinshi and selected juren had to train with guns.',
  ],
  s0487: [
    'Governors of Hubei, Guangdong, and Yunnan and the Director-General of the Hedong waterways were restored.',
    'Hubei, Guangdong, and Yunnan governors and the Hedong waterways director were restored.',
  ],
  s0488: [
    'Abolition of grain intendant and other posts was canceled.',
    'Planned cuts to grain intendant posts were dropped.',
  ],
  s0489: [
    'On day jisi, Xu Jingcheng was ordered to serve at the Zongli Yamen.',
    'On jisi day, Xu Jingcheng joined the Zongli Yamen.',
  ],
  s0490: [
    'On day jiaxu, the old system of capital review of criminal cases was restored; except in military provinces and grave cases, which might still be executed on the spot, the rest were not permitted.',
    'On jiaxu day, capital case review was restored; local execution was limited to military provinces and grave cases.',
  ],
  s0491: [
    'On day bingzi, Hu Yixin was ordered to serve at the Zongli Yamen.',
    'On bingzi day, Hu Yixin joined the Zongli Yamen.',
  ],
  s0492: [
    'On day jimao, manufacture at the Fuzhou Navy Yard was temporarily suspended.',
    'On jimao day, Fuzhou Navy Yard production was halted.',
  ],
  s0493: [
    'On day gengchen, Li Hongzhang was ordered to go inspect the Shandong Yellow River.',
    'On gengchen day, Li Hongzhang was sent to inspect Shandong\'s Yellow River.',
  ],
  s0494: [
    'That month, Zhili, Shaanxi, Sichuan, Hubei, Jiangsu, Yunnan, Shanxi, Xinjiang, and other provinces received disaster relief.',
    'That month, many provinces received disaster relief.',
  ],
  s0495: [
    'Winter, tenth month, xinsi new moon: the Imperial Ancestral Temple was served; Prince Shide acted in proxy; thereafter suburban and temple rites were all delegated until winter of xinchou, when the court returned from Xi\'an to the capital and the Emperor went in person.',
    'Month 10, xinsi new moon: Prince Shide offered at the Ancestral Temple; the Emperor did not attend suburban rites until returning from Xi\'an in xinchou.',
  ],
  s0496: [
    'On day bingxu, Circuit Intendant Zhang Yi was ordered to supervise mining in Zhili and Rehe and establish a company.',
    'On bingxu day, Zhang Yi was to run Zhili and Rehe mines under a company.',
  ],
  s0497: [
    'Shuntian dependencies received disaster relief.',
    'Shuntian received disaster relief.',
  ],
  s0498: [
    'On day bingshen, Hancheng and other counties received disaster relief.',
    'On bingshen day, Hancheng and other counties were relieved.',
  ],
  s0499: [
    'On day jihai, the Board of Revenue was ordered to allocate eighty thousand taels for Anhui relief.',
    'On jihai day, Revenue allocated eighty thousand taels for Anhui.',
  ],
  s0500: [
    'On day xinchou, Weng Tonghe\'s office was posthumously stripped.',
    'On xinchou day, Weng Tonghe was posthumously disgraced.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_024_b05.mjs <translation.json>'
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
