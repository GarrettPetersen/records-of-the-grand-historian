#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'On day guihai, Han scholar Zhao Qi and Yuan scholar Liu Yin were both granted secondary sacrifice in the Confucian temple.',
    'On guihai day Zhao Qi and Liu Yin entered the Confucian temple.',
  ],
  s0602: [
    'Chinese merchants founded the Datong School at Yokohama, Japan, and were granted a plaque reading 「Cultivate Talent and Broaden Learning」.',
    'Overseas Chinese opened Datong School in Yokohama and received a 「Cultivate Talent and Broaden Learning」 plaque.',
  ],
  s0603: [
    'On day dingmao, revolutionary Huang Xing led his party to burn the governor-general\'s yamen at Guangzhou and drive him out.',
    'On dingmao day Huang Xing\'s revolutionaries burned the Guangzhou governor-general\'s office and routed him.',
  ],
  s0604: [
    'Summer, fourth month, day xinwei: Yang Wending asked to defer cutting Hunan\'s Green Standard and defense forces.',
    'In summer month 4, xinwei, Yang Wending asked to slow Hunan Green Standard and defense cuts.',
  ],
  s0605: [
    'On day jiaxu, returned students Zhong Shiming, Wang Yizhi, and others were rewarded with law and administration jinshi and juren ranks and engineering juren with distinctions.',
    'On jiaxu day overseas graduates Zhong Shiming, Wang Yizhi, and others received law jinshi, juren, and engineering juren ranks.',
  ],
  s0606: [
    'On day bingzi, Zhao Erxun memorialized for discretionary power in appointments and administration; it was approved.',
    'On bingzi day Zhao Erxun won discretionary appointment power.',
  ],
  s0607: [
    'On day dingchou, provincial and garrison command posts in Shandong\'s Green Standard were cut.',
    'On dingchou day Shandong Green Standard provincial and garrison posts were abolished.',
  ],
  s0608: [
    'On day wuyin, an edict ordered establishment of a responsible cabinet.',
    'On wuyin day the throne ordered a responsible cabinet.',
  ],
  s0609: [
    'Cabinet regulations were promulgated.',
    'Cabinet regulations were issued.',
  ],
  s0610: [
    'Prince Qing Yikuang was appointed Prime Minister of the Cabinet; Grand Secretaries Natong and Xu Shichang were both made Associate Prime Ministers.',
    'Prince Qing Yikuang became cabinet prime minister; Natong and Xu Shichang became associate prime ministers.',
  ],
  s0611: [
    'Liang Dunyan was made Minister of Foreign Affairs, Shanqi Minister of Civil Affairs, Zaize Minister of Revenue, Tang Jingchong Minister of Education, Yin Chang Minister of the Army, Zaixun Minister of the Navy, Shaochang Minister of Justice, Pulun Minister of Agriculture, Industry, and Commerce, Sheng Xuanhuai Minister of Posts and Communications, and Shouqi Minister of Dependencies.',
    'Liang Dunyan took foreign affairs, Shanqi civil affairs, Zaize revenue, Tang Jingchong education, Yin Chang army, Zaixun navy, Shaochang justice, Pulun agriculture and industry, Sheng Xuanhuai posts, and Shouqi dependencies.',
  ],
  s0612: [
    'It was further ordered that the Prime Minister and Associate Prime Ministers of the Cabinet should all serve as State Ministers; the Prime Minister and Associate Prime Ministers should all serve as ministers on the Constitutional Drafting Bureau; Prince Qing Yikuang still directed the Ministry of Foreign Affairs.',
    'Cabinet prime and associate ministers also became state ministers and constitutional drafting ministers; Yikuang still ran foreign affairs.',
  ],
  s0613: [
    'The Privy Council was established, with Lu Runxiang as president and Rongqing as vice-president.',
    'The Privy Council was set up under Lu Runxiang with Rongqing as deputy.',
  ],
  s0614: [
    'The old Cabinet, the Grand Council, and the Conference on Government Affairs were abolished.',
    'The old cabinet, Grand Council, and government affairs conference were abolished.',
  ],
  s0615: [
    'Grand Secretaries and Associate Grand Secretaries still ranked after the Hanlin Academy.',
    'Grand and associate grand secretaries still ranked below the Hanlin.',
  ],
  s0616: [
    'Cabinet academicians and lower offices were cut.',
    'Cabinet academicians and subordinate posts were abolished.',
  ],
  s0617: [
    'The General Staff was established, with Princes Zaitao and Yulang both as staff ministers, and it was ordered to draft staff regulations.',
    'The General Staff was created with Princes Zaitao and Yulang as ministers and told to draft its regulations.',
  ],
  s0618: [
    'Zhao Erxun met with Chen Ailong, Zhang Renjun, Ruicheng, and Li Jingxi and constitutional drafting ministers to revise provincial government regulations.',
    'Zhao Erxun met Chen Ailong, Zhang Renjun, Ruicheng, Li Jingxi, and drafting ministers to revise provincial government.',
  ],
  s0619: [
    'On day jimao, Prince Qing Yikuang, Grand Secretary Natong, and Xu Shichang all resigned as Prime Minister and Associate Prime Ministers; resignation was not permitted, and they were urged to take office at once.',
    'On jimao day Yikuang, Natong, and Xu Shichang tried to quit the cabinet and were refused and ordered to serve.',
  ],
  s0620: [
    'The opium prohibition was reaffirmed, and the Ministries of Civil Affairs and Revenue and all provincial governors-general and governors were instructed to ban it by a set date.',
    'Opium prohibition was reaffirmed and civil affairs, revenue, and every province told to end it on schedule.',
  ],
  s0621: [
    'An edict fixed trunk railways as state property.',
    'The throne nationalized trunk railways.',
  ],
  s0622: [
    'Earlier, Censor Shi Changxin had memorialized on the abuses of provincial merchant stock companies building railways: the ministry should fix all national trunk lines as state-owned, while branch lines might be built by provincial gentry stock subscription; the throne approved and referred it to the Ministry of Posts and Communications.',
    'Earlier Censor Shi Changxin said merchant railway companies were corrupting the realm; trunk lines should be state-owned and branches left to gentry stock; the court agreed and sent it to posts.',
  ],
  s0623: [
    'To this it was memorialized: 「China\'s territory is vast and its frontiers remote; there must be trunk railways running in all directions across the realm before administration can benefit and the center be grasped.',
    'The ministry said: 「China is vast and remote—trunk lines must run in every direction before rule and the center hold firm.',
  ],
  s0624: [
    'Former planning was unsound, causing railway policy to fall into confusion and division, with no distinction between trunk and branch lines, no measure of the people\'s strength, and every paper petition promptly approved for merchant operation.',
    'Old planning was bad—trunk and branch were confused, the people\'s strength ignored, and every petition became a merchant line.',
  ],
  s0625: [
    'In the years since, in Guangdong only half the shares were collected and little track was built.',
    'Guangdong raised barely half its shares and built little.',
  ],
  s0626: [
    'In Sichuan debts were enormous and recovery was hopeless.',
    'Sichuan debts ballooned beyond recovery.',
  ],
  s0627: [
    'In Hunan and Hubei companies had been opened for years yet only consumed funds in idleness.',
    'Hunan and Hubei companies sat for years and only burned money.',
  ],
  s0628: [
    'If this continued, days would lengthen, the people\'s burdens deepen, and court and country alike suffer harm.',
    'If this went on, years would pass, burdens deepen, and court and country both suffer.',
  ],
  s0629: [
    'It should be requested that trunk lines all revert to state ownership and branch lines be left to the people.',
    'Trunk lines should be nationalized and branches left to private effort.',
  ],
  s0630: [
    'The people should be clearly informed that trunk lines in each province set up as merchant stock companies before the third year of Xuantong should now be recovered by the state.',
    'Provincial trunk companies formed before Xuantong year 3 must be bought back by the state.',
  ],
  s0631: [
    'Construction should be pressed forward at once, and all previously approved cases voided.」',
    'Build at once and void every earlier approval.」',
  ],
  s0632: [
    '」Hence this edict.',
    'Hence the edict.',
  ],
  s0633: [
    'On day xinwei, Jilin suffered fire; forty thousand taels from the treasury were issued for relief.',
    'On xinwei day Jilin fire relief received 40,000 taels.',
  ],
  s0634: [
    'On day guiwei, posthumous honors were granted Acting Guangzhou General and Vice Commander-in-Chief Fuqi.',
    'On guiwei day Acting Guangzhou General Fuqi was posthumously honored.',
  ],
  s0635: [
    'On day dinghai, the Political Consultative Assembly asked that budget and loan matters be referred to the assembly for deliberation; it was not permitted.',
    'On dinghai day the assembly asked to debate budgets and loans and was refused.',
  ],
  s0636: [
    'On day wuzi, Duanfang was recalled as vice minister on reserve appointment and made Superintendent of the Guang-Han and Chuan-Han Railways.',
    'On wuzi day Duanfang returned as vice minister and took the Guang-Han and Chuan-Han railways.',
  ],
  s0637: [
    'An edict stated that personnel on abolished posts awaiting reassignment must not submit memorials.',
    'Abolished-post personnel awaiting appointment were barred from memorializing.',
  ],
  s0638: [
    'An edict ordered that in autumn of this year the Imperial Guard and nearby garrison armies be assembled at Yongping in Zhili for grand maneuvers.',
    'Autumn maneuvers at Yongping were ordered for the guard and nearby Zhili garrisons.',
  ],
  s0639: [
    'On day jichou, Prince Gong Puwei was excused as opium prohibition minister on grounds of illness; Prince Shuncheng Nelehe replaced him.',
    'On jichou day Prince Gong Puwei quit the opium post for illness and Prince Shuncheng Nelehe replaced him.',
  ],
  s0640: [
    'On day gengyin, Minister of Posts and Communications Sheng Xuanhuai completed loan contracts with banks of Britain, Germany, France, and the United States.',
    'On gengyin day Sheng Xuanhuai finished railway loans with British, German, French, and American banks.',
  ],
  s0641: [
    'On day xinmao, Pang Hongshu was dismissed and Shen Yuqing was made Guizhou governor.',
    'On xinmao day Pang Hongshu left office and Shen Yuqing became Guizhou governor.',
  ],
  s0642: [
    'On day renchen, governors-general and governors were ordered to inform the people that railways were now under official management and that from the date of the edict land and share levies in Sichuan and Hunan were to cease.',
    'On renchen day provinces were told railways were state-run and Sichuan-Hunan levies must stop from the edict date.',
  ],
  s0643: [
    'Funds collected before the fourth month of the third year of Xuantong should be reported jointly by the Ministry of Posts and Communications, the railway superintendent, and the governors-general and governors.',
    'Collections before Xuantong year 3 month 4 must be reported by posts, the railway chief, and provincial governors.',
  ],
  s0644: [
    'Local officials who concealed and failed to report would be punished.',
    'Officials who hid receipts would be punished.',
  ],
  s0645: [
    'Yang Wending memorialized that since Hunan heard the edict nationalizing trunk railways, popular feeling had surged in alarm, with extraordinary uproar and handbills everywhere, fearing incitement.',
    'Yang Wending said Hunan panicked after the nationalization edict, with uproar and handbills that might incite trouble.',
  ],
  s0646: [
    'An edict ordered strict prohibition; if bandits stirred the crowd with intent to rebel, they were to be punished under the statute on rebellious parties and killed on the spot without trial.',
    'The court ordered a crackdown—rebels who stirred crowds were to be killed on sight under the rebel statute.',
  ],
  s0647: [
    'Zhu Jiabao memorialized that the Jiang-Huai junction was a haunt of bandit parties and that in recent years of repeated famine robbery had grown fiercer.',
    'Zhu Jiabao said the Jiang-Huai border bred bandits and famine years had made robbery fiercer.',
  ],
  s0648: [
    'He asked to apply the Hubei and Sichuan regulations for punishing secret-society and mountain bandits, with offenders dealt with by military law.',
    'He asked for Hubei-Sichuan secret-society rules and military-law punishment.',
  ],
  s0649: [
    'On day bingshen, postal service under the Inspector General of Customs was transferred to the Ministry of Posts and Communications.',
    'On bingshen day customs postal service went to posts and communications.',
  ],
  s0650: [
    'Land tax on official fields in Kunming county, Yunnan, was remitted.',
    'Kunming official-field land tax was forgiven.',
  ],
  s0651: [
    'On day dingyou, Teng and Yi counties in Shandong received disaster relief.',
    'On dingyou day Shandong\'s Teng and Yi counties were fed.',
  ],
  s0652: [
    'Fifth month, day gengzi: following the memorial of Beijing official and Acting Dali Vice Minister Wang Shiqi and others, Hunan\'s house tax and rice-salt levies for the railway were stopped.',
    'In month 5, gengzi, Beijing official Wang Shiqi ended Hunan\'s railway house tax and rice-salt levies.',
  ],
  s0653: [
    'On day xinyou, Yang Wending memorialized that the Hunan Consultative Assembly had stated the Hunan railway could be self-managed and they would not borrow; he had relayed the petition and was severely rebuked.',
    'On xinyou day Yang Wending relayed Hunan\'s refusal to borrow for its railway and was sharply rebuked.',
  ],
  s0654: [
    'Silver was granted in condolence for Chinese merchants killed in Mexico.',
    'Silver was sent for Chinese killed in Mexico.',
  ],
  s0655: [
    'On day renyin, Guangxi Green Standard brigade commanders, defenders, and lower officers and cavalry and infantry were cut.',
    'On renyin day Guangxi Green Standard brigade and defender posts and troops were cut.',
  ],
  s0656: [
    'On day guimao, Yan, Yi, and Cao prefectures and Jining subprefecture in Shandong suffered disaster; thirty thousand taels were issued for relief.',
    'On guimao day Shandong\'s Yan, Yi, Cao, and Jining received 30,000 taels.',
  ],
  s0657: [
    'The Sichuan Consultative Assembly, since gentry and people heard the railway nationalization edict, sent letters and telegrams in succession asking to defer takeover and to stop printing the edict text; Wang Renwen relayed the petition.',
    'Sichuan\'s assembly asked to delay takeover and stop printing the edict after nationalization; Wang Renwen relayed it.',
  ],
  s0658: [
    'Wang Renwen reported it; an edict sharply rebuked them and still ordered rapid printing and distribution of the edict text with earnest exhortation.',
    'Wang Renwen reported it; the court rebuked them but still ordered the edict printed and preached.',
  ],
  s0659: [
    'On day yisi, poor bannermen of Hunchun were exempted from payment for wasteland they had taken up.',
    'On yisi day poor Hunchun bannermen owed no wasteland fees.',
  ],
  s0660: [
    'On day wushen, returned-student jinshi Jiang Guhuai and others underwent palace examination and received offices with distinctions.',
    'On wushen day returned-student jinshi Jiang Guhuai and others were examined and posted.',
  ],
  s0661: [
    'On day yimao, Sun Baoqi memorialized that collateral princes should not meddle in government; he was rebuked.',
    'On yimao day Sun Baoqi said princes should not meddle in politics and was rebuked.',
  ],
  s0662: [
    'On day renzi, Natong was recalled to service and again made Grand Secretary of the Wenyuan Pavilion.',
    'On renzi day Natong returned as Wenyuan grand secretary.',
  ],
  s0663: [
    'On day bingchen, Guangdong, over railway recovery, urged refusal of government paper notes and demanded silver for notes.',
    'On bingchen day Guangdong refused government notes over railway recovery and demanded silver.',
  ],
  s0664: [
    'Zhang Mingqi was ordered to guard against it.',
    'Zhang Mingqi was told to guard against it.',
  ],
  s0665: [
    'On day dingsi, the Political Consultative Assembly submitted revised regulations for the Stenography Academy.',
    'On dingsi day the assembly revised stenography academy rules.',
  ],
  s0666: [
    'On day wuwu, the Ministries of Revenue and Posts and Communications jointly memorialized methods for recovering the Chuan, Yue, and Han trunk lines.',
    'On wuwu day revenue and posts reported how to recover Sichuan, Guangdong, and Hankou trunk railways.',
  ],
  s0667: [
    'They asked to recover company stock in Guangdong, Sichuan, Hunan, and Hubei and issue special state railway bonds in exchange.',
    'They asked to swap Guangdong, Sichuan, Hunan, and Hubei stock for state railway bonds.',
  ],
  s0668: [
    'Guangdong stock would be paid at sixty percent.',
    'Guangdong would get sixty percent.',
  ],
  s0669: [
    'Hunan and Hubei stock would be repaid in full.',
    'Hunan and Hubei would be repaid at par.',
  ],
  s0670: [
    'For the Sichuan line, more than four million taels actually spent on labor and materials at Yichang would receive state interest-bearing bonds; the more than seven million taels on hand might remain as shares or go into industry, as holders wished.',
    'Sichuan\'s four million spent at Yichang would become state bonds; seven million on hand could stay invested or enter industry.',
  ],
  s0671: [
    'An edict ordered Duanfang to go swiftly to the three provinces and carry this out with each governor-general and governor.',
    'Duanfang was told to hurry to the three provinces and enforce the plan with each governor.',
  ],
  s0672: [
    'Ding Baochen was excused on grounds of illness; Chen Baochen was made Shanxi governor.',
    'Ding Baochen quit for illness and Chen Baochen became Shanxi governor.',
  ],
  s0673: [
    'On day gengshen, Yu Shimei was made director of the College of Rites.',
    'On gengshen day Yu Shimei took the College of Rites.',
  ],
  s0674: [
    'On day jiazi, the Cabinet submitted regulations for subordinate cabinet offices and for the Legislative Bureau; an edict promulgated them.',
    'On jiazi day the cabinet issued subordinate and legislative bureau regulations.',
  ],
  s0675: [
    'The Cabinet Dispatch Office was established, with Bureaus of Edicts, Appointments, Statistics, and Seals.',
    'A cabinet dispatch office and edict, appointment, statistics, and seal bureaus were set up.',
  ],
  s0676: [
    'Chancellors, directors, and bureau chiefs were appointed.',
    'Chancellors, directors, and bureau chiefs were named.',
  ],
  s0677: [
    'A president of the Cabinet Legislative Bureau was also appointed.',
    'A cabinet legislative bureau president was appointed.',
  ],
  s0678: [
    'The Constitutional Drafting Bureau, Ministry of Personnel, Secretariat of the Grand Secretariat, Office for Investigating Imperial Rescripts, and Drafting Office were abolished and their duties transferred to the Cabinet.',
    'Drafting, personnel, secretariat, rescript investigation, and drafting offices were abolished and merged into the cabinet.',
  ],
  s0679: [
    'The Translation Office was placed under the Hanlin Academy.',
    'The Translation Office went under the Hanlin.',
  ],
  s0680: [
    'The Army Ministry memorialized simplifying military advisers in each province\'s training offices.',
    'The army ministry simplified provincial training-office advisers.',
  ],
  s0681: [
    'On day yichou, the Hanlin Academy presented the Kangxi Political Essentials compiled by Compiler Zhang Jie.',
    'On yichou day the Hanlin presented Zhang Jie\'s Kangxi Political Essentials.',
  ],
  s0682: [
    'Sixth month, day dingmao: the Political Consultative Assembly was ordered to meet with the Cabinet to revise assembly regulations.',
    'In month 6, dingmao, the assembly was told to revise its charter with the cabinet.',
  ],
  s0683: [
    'Flood victims in Wuling, Longyang, and Yiyang counties in Hunan were relieved.',
    'Hunan\'s Wuling, Longyang, and Yiyang flood victims were fed.',
  ],
  s0684: [
    'Powder magazines at the Baoding Army Ordnance Bureau and at the Second Division drill hall in Baoding both caught fire.',
    'Baoding ordnance and Second Division powder magazines burned.',
  ],
  s0685: [
    'On day gengchen, Anhui flooded; dikes at Wuli Tablet and Jiulian in Wuwei subprefecture broke.',
    'On gengchen day Anhui flooded and Wuwei dikes broke at Wuli Tablet and Jiulian.',
  ],
  s0686: [
    'On day xinsi, Rongqing was made president of the Privy Council and Zou Jialai vice-president.',
    'On xinsi day Rongqing headed the Privy Council and Zou Jialai deputized.',
  ],
  s0687: [
    'Lu Runxiang was excused as opium prohibition minister; Chen Baochen was excused as Shanxi governor and placed on vice-minister reserve appointment.',
    'Lu Runxiang left the opium post; Chen Baochen left Shanxi and went on vice-minister reserve.',
  ],
  s0688: [
    'Yiketan was excused as Vice Censor-in-Chief and placed on vice commander-in-chief reserve list.',
    'Yiketan left the censorate and went on vice commander reserve.',
  ],
  s0689: [
    'The concurrent post of Shuntian Metropolitan Prefect was abolished.',
    'The concurrent Shuntian prefect post was cut.',
  ],
  s0690: [
    'On day renwu, Lu Zhongqi was made Shanxi governor.',
    'On renwu day Lu Zhongqi became Shanxi governor.',
  ],
  s0691: [
    'On day guiwei, Zhao Erfeng memorialized that Derong in Batang had been recovered, household people asked to pay grain tax, and more than a thousand monks of Langzhuang Monastery were permitted to return to lay life.',
    'On guiwei day Zhao Erfeng said Batang\'s Derong paid tax and a thousand Langzhuang monks were allowed to leave the robe.',
  ],
  s0692: [
    'He also memorialized that household people at Linka Rock in Batang had submitted and were placed under Sanba subprefecture.',
    'He also said Linka Rock households submitted to Sanba subprefecture.',
  ],
  s0693: [
    'On day yiyou, disaster struck the banner of Jasagh Gushan Beizi Sanjimidub in the Ike Zhaoleague; ten thousand taels were issued for relief.',
    'On yiyou day Ike Zhaoleague\'s Sanjimidub banner received 10,000 taels.',
  ],
  s0694: [
    'On day bingxu, bandits in Dangar subprefecture and Xining county gathered a crowd in revolt; government troops scattered them, and ringleaders Li Wang, Li Tongchun, Li Guanbo, and others were executed.',
    'On bingxu day Dangar and Xining bandits rose, troops scattered them, and Li Wang, Li Tongchun, and Li Guanbo were executed.',
  ],
  s0695: [
    'On day xinmao, the College of Rites was established, with posts of chief grand secretary, associate chief, academician, and direct academician.',
    'On xinmao day the College of Rites was set up with chief, deputy, academician, and direct academician posts.',
  ],
  s0696: [
    'Li Dianlin was made chief academician of the College of Rites and Guo Cengxin associate.',
    'Li Dianlin headed the College of Rites and Guo Cengxin deputized.',
  ],
  s0697: [
    'On day renchen, more than twenty-four hundred Sichuan gentry and people led by Luo Lun, because trunk railways were nationalized and Sheng Xuanhuai and Duanfang with the Revenue Ministry had set methods treating Sichuan people with pure force and no fairness, dared not obey and asked for investigation.',
    'On renchen day 2,400 Sichuan gentry led by Luo Lun said nationalization and Sheng Xuanhuai\'s harsh methods were unfair and asked for review.',
  ],
  s0698: [
    'Wang Renwen reported it; an edict sharply rebuked them for repeated disrespect in memorials.',
    'Wang Renwen relayed it; the court rebuked repeated disrespect.',
  ],
  s0699: [
    'A consul-general for the Netherlands East Indies and consuls at Surabaya and Sumatra were added.',
    'Consuls were added for the Dutch East Indies, Surabaya, and Sumatra.',
  ],
  s0700: [
    'On day jiawu, heavy rain in Changde prefecture, Hunan, overflowed the river and flooded subordinate counties, ruining fields and houses; sixty thousand taels were issued for relief.',
    'On jiawu day Hunan\'s Changde flooded its counties and received 60,000 taels.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_025_b07.mjs <translation.json>'
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
