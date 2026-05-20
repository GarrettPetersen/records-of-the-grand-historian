#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    "On day gengshen, because Germans entered the Jimo Confucian temple and destroyed images of the sages, the Zongli Yamen was ordered to investigate.",
    "On gengshen day, Germans destroyed sage images at Jimo temple and the Zongli Yamen was told to inquire.",
  ],
  s0302: [
    "On day yichou, the emperor visited Prince Gong's residence to inquire after his illness.",
    "On yichou day, the emperor called at Prince Gong's mansion to see him in illness.",
  ],
  s0303: [
    "On day jiaxu, the emperor attended the empress dowager to the outer Firearms Brigade parade ground, reviewing drills of the Firearms, Vanguard Sharp-shooter, and Divine Engine brigades and the Wusheng new company—for three days.",
    "On jiaxu day, with the empress dowager he reviewed three brigades and the Wusheng company at the outer firearms camp for three days.",
  ],
  s0304: [
    "On day dingchou, because a church was burned at Shashi in Hubei, Zhang Zhidong was ordered to resume his post.",
    "On dingchou day, after Shashi church was burned, Zhang Zhidong was ordered back to his post.",
  ],
  s0305: [
    "Relief for Xu and Hai disasters was continued.",
    "Relief for Xu and Hai disasters continued.",
  ],
  s0306: [
    "On day wuyin, German Prince Henry was received at the Yulan Hall.",
    "On wuyin day, German Prince Henry was received at Yulan Hall.",
  ],
  s0307: [
    "On day jimao, the emperor returned to the palace.",
    "On jimao day, the emperor returned to the palace.",
  ],
  s0308: [
    "The assessed tax quota for Xinxing, stricken by drought, was remitted.",
    "Xinxing drought-stricken quota taxes were remitted.",
  ],
  s0309: [
    "On day gengchen, French minister Bertheson was received in the Hall of Literary Glory.",
    "On gengchen day, French minister Bertheson was received at Wenhua Hall.",
  ],
  s0310: [
    "On day renwu, disasters struck Fengyang, Yingzhou, and Sizhou in Anhui.",
    "On renwu day, Fengyang, Yingzhou, and Sizhou in Anhui suffered disaster.",
  ],
  s0311: [
    "That spring Jiaozhou Bay was leased to Germany and Lüshunkou, Dalian Bay, and the Liaodong Peninsula to Russia.",
    "That spring Jiaozhou went to Germany and Lüshun, Dalian, and Liaodong to Russia.",
  ],
  s0312: [
    "Summer, fourth month, day renchen: Prince Gong Yixin died; court mourning was five days and plain dress fifteen days; the emperor visited the residence to grant funeral offerings.",
    "In summer month 4, renchen, Prince Gong Yixin died; mourning five days; the emperor granted funeral rites at his residence.",
  ],
  s0313: [
    "An edict from the empress dowager gave the special posthumous title Zhong (Loyal).",
    "The empress dowager gave the posthumous title Zhong.",
  ],
  s0314: [
    "For guarding the princely mausoleum, guard households were added; officials managed each sacrifice.",
    "Mausoleum guard households were added; officials managed sacrifices.",
  ],
  s0315: [
    "His grandson, Beile Puyu, succeeded.",
    "His grandson Beile Puyu succeeded.",
  ],
  s0316: [
    "On day jiawu, an imperial edict: Prince Gong the Loyal's merit to the altars of state warranted joint sacrifice in the Imperial Ancestral Temple.",
    "On jiawu day, Prince Gong Loyal was ordered enshrined in the Imperial Ancestral Temple.",
  ],
  s0317: [
    "An edict told officials at court and throughout the empire to take Prince Gong Loyal as their model, each lay forth loyal purpose, and jointly meet the day's hardship.",
    "An edict told all officials to emulate Prince Gong Loyal and serve the state loyally.",
  ],
  s0318: [
    "On day jihai, Ronglu was made Grand Secretary of the Wenyuan Pavilion; Gang Yi, Minister of War, was to assist as Grand Secretary.",
    "On jihai day, Ronglu became Wenyuan Grand Secretary; Gang Yi assisted as Grand Secretary.",
  ],
  s0319: [
    "On day yisi, an edict fixed the national policy, instructing: \"Officials great and small at court and abroad, from princes and dukes down to commoners, should each resolve to exert themselves.",
    "On yisi day, an edict fixed national policy: all ranks should resolve to strive.",
  ],
  s0320: [
    "Plant your roots in the learning of the sages' righteous principles, and also broadly gather Western learning suited to the times, studying it in earnest, to form talent able to grasp change and meet needs.",
    "Root in sage learning and earnestly study timely Western learning to form adaptable talent.",
  ],
  s0321: [
    "The Capital University should lead the provinces and above all be founded first.",
    "The Capital University should lead provinces and be founded first.",
  ],
  s0322: [
    "Grand Councillors and princely ministers should promptly convene, deliberate fitting measures, and memorialize.",
    "Grand Councillors and princes should promptly deliberate and report.",
  ],
  s0323: [
    "\" On day bingwu, an edict ordered each province to establish a Bureau of Commerce.",
    "On bingwu day, each province was ordered to set up a commerce bureau.",
  ],
  s0324: [
    "Xia Tonghe and 341 others were granted jinshi with passing grades in differing ranks.",
    "Xia Tonghe and 341 others received jinshi degrees in varying ranks.",
  ],
  s0325: [
    "On day jiyou, Weng Tonghe was dismissed.",
    "On jiyou day, Weng Tonghe was dismissed.",
  ],
  s0326: [
    "Imperial clansmen and princes were selected to travel abroad.",
    "Imperial princes were chosen to travel abroad.",
  ],
  s0327: [
    "For close collateral kings and beiles, the emperor inspected them personally;",
    "Close-branch kings and beiles were personally inspected by the emperor;",
  ],
  s0328: [
    "for dukes and below and idle personnel, the Imperial Clan Court recommended.",
    "dukes and below and idle clansmen were recommended by the Imperial Clan Court.",
  ],
  s0329: [
    "Wang Wenshao was summoned to the capital.",
    "Wang Wenshao was summoned to the capital.",
  ],
  s0330: [
    "The office for supervising military affairs was abolished.",
    "The military affairs supervision office was abolished.",
  ],
  s0331: [
    "On day gengxu, Kang Youwei, secretary in the Board of Works, was summoned; he was appointed a clerk of the Zongli Yamen.",
    "On gengxu day, Kang Youwei was summoned and made a Zongli Yamen clerk.",
  ],
  s0332: [
    "On day xinhai, the former Dalai Lama of Tibet presented tribute goods.",
    "On xinhai day, the former Dalai Lama presented tribute.",
  ],
  s0333: [
    "Fifth month, guichou new moon: the army was ordered to drill Western tactics; officers who had mastered them would instruct; in the north from the new army, in the south from the Self-Strengthening Army were dispatched.",
    "Month 5, guichou new moon: troops were ordered to drill Western tactics; northern instructors from the new army, southern from the Self-Strengthening Army.",
  ],
  s0334: [
    "Each governor-general had six months to report on merged pay, drilled troops, and garrison posts.",
    "Each governor-general had six months to report on pay, training, and garrisons.",
  ],
  s0335: [
    "For arms and cannon each provincial arsenal should set models and seek fine manufacture.",
    "Each provincial arsenal was to set arms standards and improve manufacture.",
  ],
  s0336: [
    "On day jiayin, Qixia fire victims were relieved.",
    "On jiayin day, Qixia fire victims were relieved.",
  ],
  s0337: [
    "On day dingsi, from the next examination cycle provincial, metropolitan, annual, and biennial tests that had used Eight-legged Essays were changed to policy essays.",
    "On dingsi day, civil exams from the next cycle switched from eight-legged essays to policy essays.",
  ],
  s0338: [
    "Sun Jianai was made assisting Grand Secretary as Minister of Personnel; Wang Wenshao, Minister of Revenue, Grand Councillor and Zongli Yamen commissioner.",
    "Sun Jianai became assisting Grand Secretary; Wang Wenshao became Grand Councillor and Zongli Yamen commissioner.",
  ],
  s0339: [
    "Ronglu was made governor-general of Zhili and concurrently commissioner for the Northern Seas.",
    "Ronglu became Zhili governor-general and Northern Seas commissioner.",
  ],
  s0340: [
    "On day gengshen, Sheng Xuanhuai was urged to start the Lu-Han Railway at once and also open the Yue-Han and Ning-Hu lines.",
    "On gengshen day, Sheng Xuanhuai was urged to start the Lu-Han Railway and open Yue-Han and Ning-Hu lines.",
  ],
  s0341: [
    "On day jiazi, the economic special triennial intake was merged with the regular examination; annual and biennial tests all switched to policy essays without waiting until next year.",
    "On jiazi day, the economic special exam merged with the regular cycle; all tests switched to policy essays at once.",
  ],
  s0342: [
    "On day dingmao, the Capital University was ordered founded; Sun Jianai was placed in charge.",
    "On dingmao day, the Capital University was founded under Sun Jianai.",
  ],
  s0343: [
    "Juren Liang Qichao was given rank six pin and put in charge of the Translation Bureau.",
    "Juren Liang Qichao received sixth rank and headed the Translation Bureau.",
  ],
  s0344: [
    "On day wuchen, agriculture and industry were ordered promoted.",
    "On wuchen day, agriculture and industry were ordered promoted.",
  ],
  s0345: [
    "An instruction said: \"To revive all affairs, first encourage talent.",
    "An instruction said: to revive affairs, first encourage talent.",
  ],
  s0346: [
    "Scholars and commoners in each province who wrote useful new books, devised new methods, or made new devices should receive bounty to encourage them.",
    "Provincial scholars and people with useful books, methods, or devices should receive bounty.",
  ],
  s0347: [
    "Some might be tried in real posts, others granted insignia and robes.",
    "Some might get real posts, others robes and insignia.",
  ],
  s0348: [
    "For devices invented, certificates were given with term-limited exclusive sale.",
    "Inventors received certificates for term-limited exclusive sale.",
  ],
  s0349: [
    "Those who alone founded schools, opened land advantage, or built gun factories would be rewarded by the military merit precedent.",
    "Solo founders of schools, land projects, or gun factories would be rewarded like military merit.",
  ],
  s0350: [
    "\" On day xinwei, flooded-field grain tax in Luquan was remitted.",
    "On xinwei day, Luquan flooded-field grain tax was remitted.",
  ],
  s0351: [
    "On day guiyou, both wings of the Eight Banners were ordered to convert half to Western rifles and wall guns.",
    "On guiyou day, half of each Eight Banner wing was ordered to drill Western rifles and wall guns.",
  ],
  s0352: [
    "Yikuang and others managed the Vanguard Cavalry; Chongli and others the Guard Corps.",
    "Yikuang managed the Vanguard Cavalry; Chongli the Guard Corps.",
  ],
  s0353: [
    "On day jiaxu, provincial academies were made schools teaching Chinese and Western learning: provincial academy as higher, prefectural as middle, district as primary.",
    "On jiaxu day, academies became Chinese-Western schools: provincial higher, prefectural middle, district primary.",
  ],
  s0354: [
    "Local charity and community schools likewise.",
    "Local charity and community schools followed suit.",
  ],
  s0355: [
    "On day yihai, Yulu was made Grand Councillor.",
    "On yihai day, Yulu became Grand Councillor.",
  ],
  s0356: [
    "On day bingzi, provinces were told to protect churches in earnest.",
    "On bingzi day, provinces were told to protect churches earnestly.",
  ],
  s0357: [
    "On day dingchou, capital officials rank three and above and governors and education commissioners were ordered to recommend candidates for the economic special examination.",
    "On dingchou day, senior capital officials and governors were told to recommend economic special exam candidates.",
  ],
  s0358: [
    "Regulations were promulgated for rewards to scholars and people for books, devices, and new policies.",
    "Reward rules were issued for books, devices, and new policies.",
  ],
  s0359: [
    "Court and provinces were ordered to recommend talent in manufacture, navigation, and sound-light-chemistry-electricity.",
    "Court and provinces were told to recommend talent in manufacture, navigation, and science.",
  ],
  s0360: [
    "On day wuyin, provinces were ordered to protect commerce.",
    "On wuyin day, provinces were ordered to protect commerce.",
  ],
  s0361: [
    "Assessed taxes for Haikang and Suixi last year, disaster-stricken, were remitted.",
    "Last year's quota taxes for disaster-hit Haikang and Suixi were remitted.",
  ],
  s0362: [
    "Chang'an and other districts received flood and hail relief.",
    "Chang'an and other districts received flood and hail relief.",
  ],
  s0363: [
    "Sixth month, guiwei new moon: new civil service examination rules were ordered.",
    "Month 6, guiwei new moon: new examination rules were ordered.",
  ],
  s0364: [
    "On day bingxu, Xu and Hai disaster victims were relieved.",
    "On bingxu day, Xu and Hai disaster victims were relieved.",
  ],
  s0365: [
    "On day jichou, Zhang Zhidong's Exhortation to Learning was ordered published in each province.",
    "On jichou day, Zhang Zhidong's Exhortation to Learning was ordered published province-wide.",
  ],
  s0366: [
    "Kang Youwei was ordered to supervise the official gazette.",
    "Kang Youwei was ordered to supervise the official gazette.",
  ],
  s0367: [
    "On day renchen, Ronglu with Zhang Zhidong were ordered to supervise the Lu-Han Railway.",
    "On renchen day, Ronglu and Zhang Zhidong were ordered to supervise the Lu-Han Railway.",
  ],
  s0368: [
    "In Yulin and Wuzhou bandits and secret-society men joined in revolt, seized Rong, Xingye, and Luchuan; government troops suppressed them.",
    "Yulin and Wuzhou bandits and secret societies seized three counties; government troops suppressed them.",
  ],
  s0369: [
    "On day bingshen, Rao Yingqi presented golden tribute from the Muslim west.",
    "On bingshen day, Rao Yingqi presented Muslim-west golden tribute.",
  ],
  s0370: [
    "On day dingyou, Hanlin and censorate officials were ordered to take turns in imperial audience.",
    "On dingyou day, Hanlin and censorate officials were ordered to rotate in audience.",
  ],
  s0371: [
    "Department clerks were to list current affairs; department heads present them.",
    "Department clerks listed current affairs; heads presented them.",
  ],
  s0372: [
    "Scholars and commoners might submit memorials on affairs.",
    "Scholars and commoners might submit memorials.",
  ],
  s0373: [
    "A General Bureau for Mines and Railways was set up in the capital; Wang Wenshao and Zhang Yinhuan managed it.",
    "A mines and railways bureau was set up in the capital under Wang Wenshao and Zhang Yinhuan.",
  ],
  s0374: [
    "On day gengzi, Hunan set up two factories for guns and cannon.",
    "On gengzi day, Hunan set up two gun and cannon factories.",
  ],
  s0375: [
    "On day xinchou, Ningqiang fire and Xunyang flood and hail victims were relieved.",
    "On xinchou day, Ningqiang fire and Xunyang flood and hail victims were relieved.",
  ],
  s0376: [
    "On day guimao, Wu Tingfang was ordered to relieve overseas Chinese in Cuba.",
    "On guimao day, Wu Tingfang was ordered to relieve Chinese in Cuba.",
  ],
  s0377: [
    "On day yisi, an instruction said: \"The situation is hard; self-strengthening policy is urgently needed.",
    "On yisi day, an instruction said: the times are hard and self-strengthening is urgent.",
  ],
  s0378: [
    "Officials cling to old forms; earlier orders to study current affairs and not repeat Song-Ming habits were earnest.",
    "Officials clung to old forms despite earnest orders to study current affairs.",
  ],
  s0379: [
    "Yet renewal is vast in scope with many items; wide counsel and one settled plan are needed.",
    "Yet renewal was vast and needed wide counsel and one settled plan.",
  ],
  s0380: [
    "In matters referred for debate ministers should inquire widely and discuss fully.",
    "Ministers debating referred matters should inquire widely and discuss fully.",
  ],
  s0381: [
    "Do not dress up classics or force ancient parallels; do not cling to fixed views for private ease.",
    "Do not dress up classics or cling to fixed views for private ease.",
  ],
  s0382: [
    "If you agree outwardly but resist inwardly, missing the court's pragmatic aim—that is not what We expect.",
    "Outward agreement with inward resistance was not what the throne expected.",
  ],
  s0383: [
    "We deeply weigh change and endurance; all these creations spring from utmost necessity.",
    "The throne weighed change and endurance; reforms sprang from utmost necessity.",
  ],
  s0384: [
    "We thus repeat this to you: each clarify your heart, remove obstruction, let upper and lower respond in sincerity—then the empire may be settled and governance flourish.",
    "Each should clarify his heart, remove obstruction, and let upper and lower respond in sincerity.",
  ],
  s0385: [
    "\" Ministers of the northern and southern seas were told to plan naval forces and schools for railways and mines.",
    "Northern and southern sea commissioners were told to plan navies and railway-mine schools.",
  ],
  s0386: [
    "Provinces were told to widen treaty ports.",
    "Provinces were told to widen treaty ports.",
  ],
  s0387: [
    "Huang Zunxian, rank-three capital official, was made resident minister in Korea.",
    "Huang Zunxian, a third-rank capital official, became resident minister in Korea.",
  ],
  s0388: [
    "That summer the Kowloon Peninsula in Guangdong and Weihaiwei in Shandong were leased to Britain.",
    "That summer Kowloon and Weihaiwei were leased to Britain.",
  ],
  s0389: [
    "Autumn, seventh month, day jiayin: new jinshi palace examination was halted and poetry and fu format ended.",
    "Autumn month 7, jiayin: new jinshi palace exam stopped and poetry-fu ended.",
  ],
  s0390: [
    "Fengtian districts ravaged by bandits received disaster relief.",
    "Fengtian bandit-stricken districts received disaster relief.",
  ],
  s0391: [
    "On day bingchen, an Agricultural, Industrial, and Commercial General Bureau was set up in the capital; Duanfang, Xu Jianyin, and Wu Maoding supervised it with third-rank noble titles.",
    "On bingchen day, an agricultural-industrial-commercial bureau was set up under Duanfang, Xu Jianyin, and Wu Maoding.",
  ],
  s0392: [
    "Envoys were ordered to establish schools for overseas Chinese in Britain, America, and Japan.",
    "Envoys were ordered to set up schools for overseas Chinese in Britain, America, and Japan.",
  ],
  s0393: [
    "On day dingsi, the Yellow River burst in upper and middle Shandong; six counties including Jiyang flooded together.",
    "On dingsi day, the Yellow River burst in Shandong and six counties including Jiyang flooded.",
  ],
  s0394: [
    "On day jiwei, the empress dowager's inspection of troops at Tianjin on the fifteenth of the ninth month was fixed.",
    "On jiwei day, the empress dowager's Tianjin troop review on the 15th of month 9 was fixed.",
  ],
  s0395: [
    "The Shashi customs superintendent, Jing-Yi circuit intendant, and Jiangling magistrate were all moved to garrison Shashi town.",
    "The Shashi customs chief, Jing-Yi intendant, and Jiangling magistrate all moved to Shashi.",
  ],
  s0396: [
    "On day renxu, Nanyang flood victims were relieved.",
    "On renxu day, Nanyang flood victims were relieved.",
  ],
  s0397: [
    "On day yichou, the Household of the Heir Apparent, the Transmission Office, and the courts of review, rites, revenue, works, and protocol were abolished; their duties merged under the Grand Secretariat and Boards of Rites, War, and Punishments.",
    "On yichou day, the heir-apparent household, transmission office, and several courts were cut and merged into the Grand Secretariat and Rites, War, and Punishments.",
  ],
  s0398: [
    "Governors of Hubei, Guangdong, and Yunnan were cut; governor-generals took charge.",
    "Hubei, Guangdong, and Yunnan governors were cut; governor-generals took over.",
  ],
  s0399: [
    "The eastern Yellow River commissioner was merged into the Henan governor.",
    "The eastern Yellow River commissioner was merged into the Henan governor.",
  ],
  s0400: [
    "Grain and salt intendants in each province were also abolished.",
    "Provincial grain and salt intendants were also abolished.",
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_024_b04.mjs <translation.json>'
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
