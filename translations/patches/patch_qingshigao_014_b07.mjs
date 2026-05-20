#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'On day wuwu, instructions were issued to the Court of the Heir Apparent\'s Household to prepare promotion steps for literary officials, and that establishing an heir apparent was absolutely impermissible.',
    'On wuwu day, the court told the Heir Apparent\'s office to rank scholar-officials for promotion and forbade designating an heir.',
  ],
  s0602: [
    'Winter, tenth month, day renxu: famine relief was distributed for drought in eight prefectures and counties including Yulin in Shaanxi.',
    'In the tenth winter month, on renxu day, drought relief reached eight Shaanxi districts including Yulin.',
  ],
  s0603: [
    'On day guihai, the Emperor halted at Wenshuyan Traveling Palace.',
    'On guihai day, the Emperor stayed at Wenshuyan Palace.',
  ],
  s0604: [
    'On day renshen, the Emperor paid respects at Zhaoxiling, Xiaoling, Xiaodongling, and Jingling.',
    'On renshen day, the Emperor worshipped at four imperial tombs.',
  ],
  s0605: [
    'On day yihai, the Emperor returned to the capital.',
    'On yihai day, the Emperor returned to Beijing.',
  ],
  s0606: [
    'Eleventh month, day jihai: Guo Dong was released.',
    'In the eleventh month, on jihai day, Guo Dong was freed.',
  ],
  s0607: [
    'On day gengzi, because Fu Long\'an had not recovered from illness, Fu Kang\'an was ordered jointly to handle affairs as Minister of War.',
    'On gengzi day, Fu Kang\'an shared the war ministry while Fu Long\'an convalesced.',
  ],
  s0608: [
    'On day xinchou, Liu E was ordered to direct nearby prefectures and counties around Yutian to dig out locust nymphs.',
    'On xinchou day, Liu E ordered Yutian-area districts to dig out locust nymphs.',
  ],
  s0609: [
    'On day renyin, Liu E was ordered to investigate and handle the Yihequan heterodox sect in Nan\'gong county.',
    'On renyin day, Liu E was sent to suppress the Yihequan sect in Nan\'gong.',
  ],
  s0610: [
    'On day jiyou, Akedong\'a was made Commissioner Assistant at Uliastai and Na\'erhushan Commissioner Assistant at Tarbagatai.',
    'On jiyou day, Akedong\'a took Uliastai and Na\'erhushan, Tarbagatai.',
  ],
  s0611: [
    'Twelfth month, day bingyin: Fu Kang\'an was ordered to Guangdong to join Yongde in adjudicating the salt-merchant case.',
    'In the twelfth month, on bingyin day, Fu Kang\'an went to Guangdong for the salt-merchant trial with Yongde.',
  ],
  s0612: [
    'Forty-ninth year, spring, first month, day dingwei: the Emperor made a southern tour; grain taxes on the route in Zhili and Shandong were remitted by three-tenths for the current year.',
    'In spring of the forty-ninth year, on dingwei day, the southern tour began with a three-tenths tax cut on the Zhili and Shandong route.',
  ],
  s0613: [
    'On day wushen, accumulated tax arrears were remitted for twelve Zhili prefectures and subordinate units including Shuntian.',
    'On wushen day, back taxes were forgiven in twelve Zhili districts including Shuntian.',
  ],
  s0614: [
    'On day jiayin, Sun Shiyi was transferred to be Guangdong governor and Wu Yuan Guangxi governor.',
    'On jiayin day, Sun Shiyi took Guangdong and Wu Yuan, Guangxi.',
  ],
  s0615: [
    'On day bingchen, accumulated tax arrears were remitted for twenty-one Shandong prefectures, counties, and guards including Lijin.',
    'On bingchen day, back taxes were forgiven in twenty-one Shandong districts including Lijin.',
  ],
  s0616: [
    'Bayansan was summoned to the capital; Shuchang was transferred to be governor-general of the Two Guangs.',
    'Bayansan was called to Beijing; Shuchang became governor-general of the Two Guangs.',
  ],
  s0617: [
    'Techeng\'e was made Huguang governor-general and Baoning General of Chengdu.',
    'Techeng\'e took Huguang; Baoning became Chengdu general.',
  ],
  s0618: [
    'Second month, day renxu: the Emperor visited Tai\'an prefecture and performed rites at Mount Tai temple.',
    'In the second month, on renxu day, the Emperor worshipped at Mount Tai.',
  ],
  s0619: [
    'On day bingyin, the Emperor paid respects at Shaohao\'s tomb.',
    'On bingyin day, the Emperor visited Shaohao\'s tomb.',
  ],
  s0620: [
    'He arrived at Qufu and paid respects at the temple of the First Teacher.',
    'At Qufu the Emperor worshipped at Confucius\' temple.',
  ],
  s0621: [
    'On day dingmao, he offered sacrifice to the First Teacher and poured libation wine at the Kong family grove.',
    'On dingmao day, the Emperor sacrificed to Confucius and offered wine at the Kong grove.',
  ],
  s0622: [
    'He sacrificed at the temple of the Primordial Sage Duke of Zhou.',
    'The Emperor sacrificed at the Duke of Zhou\'s temple.',
  ],
  s0623: [
    'On day renshen, accumulated tax arrears were remitted for subordinate units of Jiangning, Suzhou, and Anhui.',
    'On renshen day, back taxes were forgiven in Jiangning, Suzhou, and Anhui districts.',
  ],
  s0624: [
    'Grain taxes on the route in Jiangnan and Zhejiang were remitted by three-tenths for the current year.',
    'The Jiangnan and Zhejiang route received a three-tenths grain-tax remission.',
  ],
  s0625: [
    'Yongbao was made Guizhou governor.',
    'Yongbao became Guizhou governor.',
  ],
  s0626: [
    'Elderly residents of Jiangnan and Zhejiang were rewarded.',
    'The court rewarded elderly residents of Jiangnan and Zhejiang.',
  ],
  s0627: [
    'On day wuyin, the River God was sacrificed to.',
    'On wuyin day, the Emperor sacrificed to the River God.',
  ],
  s0628: [
    'The Emperor crossed the river.',
    'The Emperor crossed the river.',
  ],
  s0629: [
    'Punishments for military exile and below were reduced in Jiangsu, Anhui, and Zhejiang.',
    'Jiangsu, Anhui, and Zhejiang received sentence reductions below military exile.',
  ],
  s0630: [
    'On day renwu, quota land tax was remitted for prefecture-girdle counties including Jiangning and Suzhou in Jiangnan and Hangzhou in Zhejiang.',
    'On renwu day, prefecture-girdle land tax was remitted in Jiangning, Suzhou, and Hangzhou.',
  ],
  s0631: [
    'On day jiashen, accumulated salt-field levies for the forty-fifth and forty-sixth years were remitted for the Two Huai salt households.',
    'On jiashen day, Two Huai salt-field arrears from years 45–46 were forgiven.',
  ],
  s0632: [
    'Third month, first day bingxu, new moon: the River God was sacrificed to.',
    'At the third-month new moon, the Emperor sacrificed to the River God.',
  ],
  s0633: [
    'The Emperor crossed the river and visited Jinshan.',
    'The Emperor crossed the river and visited Jinshan.',
  ],
  s0634: [
    'On day dinghai, the Emperor visited Jiaoshan.',
    'On dinghai day, the Emperor visited Jiaoshan.',
  ],
  s0635: [
    'Zhou Huang was transferred to be Left Censor-in-Chief.',
    'Zhou Huang became Left Censor-in-Chief.',
  ],
  s0636: [
    'On day jichou, Wang Jie was made Minister of War, to take office after mourning ended.',
    'On jichou day, Wang Jie was named war minister pending the end of mourning.',
  ],
  s0637: [
    'On day xinmao, the Emperor visited Suzhou prefecture.',
    'On xinmao day, the Emperor visited Suzhou.',
  ],
  s0638: [
    'On day renchen, accumulated tax arrears from the thirtieth through forty-fourth years were remitted for twenty-four Hubei prefectures, counties, and guards including Jiangxia.',
    'On renchen day, Hubei back taxes from years 30–44 were forgiven in twenty-four districts including Jiangxia.',
  ],
  s0639: [
    'On day yiwei, the Emperor performed rites at the Confucian temple.',
    'On yiwei day, the Emperor worshipped at the Confucian temple.',
  ],
  s0640: [
    'On day dingyou, quota land tax in subordinate units of Hangzhou, Jiaxing, and Huzhou in Zhejiang was again remitted by three-tenths.',
    'On dingyou day, Hangzhou, Jiaxing, and Huzhou received another three-tenths land-tax cut.',
  ],
  s0641: [
    'On day jihai, the Emperor visited Haining prefecture to sacrifice to the Sea God.',
    'On jihai day, the Emperor sacrificed to the Sea God at Haining.',
  ],
  s0642: [
    'Because the Fujian imperial tribute graduate Guo Zhongyue, aged one hundred four, came to Zhejiang to welcome the imperial procession, he was rewarded with the post of Vice Director of the Directorate of Education.',
    'Guo Zhongyue of Fujian, aged 104, was made vice director of education for greeting the tour in Zhejiang.',
  ],
  s0643: [
    'On day gengzi, the Emperor visited Jianshan to view the tide.',
    'On gengzi day, the Emperor watched the tide at Jianshan.',
  ],
  s0644: [
    'He inspected the seawall works.',
    'The Emperor inspected the seawall.',
  ],
  s0645: [
    'On day xinchou, the Emperor visited Hangzhou prefecture.',
    'On xinchou day, the Emperor visited Hangzhou.',
  ],
  s0646: [
    'On day guimao, the Emperor paid respects at the imperial portrait of the Founding Emperor at Shengyin Temple.',
    'On guimao day, the Emperor worshipped Kangxi\'s portrait at Shengyin Temple.',
  ],
  s0647: [
    'On day wushen, the Emperor reviewed the Fujian naval forces.',
    'On wushen day, the Emperor reviewed Fujian naval troops.',
  ],
  s0648: [
    'On day gengxu, the Emperor returned from Hangzhou.',
    'On gengxu day, the court left Hangzhou.',
  ],
  s0649: [
    'Qinggui was transferred to be General of Fuzhou.',
    'Qinggui became Fuzhou general.',
  ],
  s0650: [
    'Du\'erjia was made General of Jilin.',
    'Du\'erjia became Jilin general.',
  ],
  s0651: [
    'One additional deputy lieutenant-general was added at Xi\'an.',
    'Xi\'an gained an additional deputy lieutenant-general.',
  ],
  s0652: [
    'On day jiayin, the Emperor halted at Suzhou prefecture.',
    'On jiayin day, the Emperor stayed at Suzhou.',
  ],
  s0653: [
    'Bayansan was stripped of office.',
    'Bayansan lost his post.',
  ],
  s0654: [
    'Intercalary third month, first day bingchen, new moon: Minister of War Fu Long\'an died; Fu Kang\'an was made Minister of War and Fu Xing again acted as Minister of Works.',
    'At the intercalary third-month new moon, Fu Long\'an died; Fu Kang\'an took the war ministry and Fu Xing again acted at works.',
  ],
  s0655: [
    'On day renxu, the Emperor visited Jiangning prefecture.',
    'On renxu day, the Emperor visited Jiangning.',
  ],
  s0656: [
    'On day jiazi, the tomb of the Ming founder was sacrificed to.',
    'On jiazi day, the Emperor worshipped at the Ming founder\'s tomb.',
  ],
  s0657: [
    'On day yichou, the Emperor reviewed the garrison troops at Jiangning prefecture.',
    'On yichou day, the Emperor reviewed Jiangning garrison troops.',
  ],
  s0658: [
    'On day wuchen, the Emperor crossed the river.',
    'On wuchen day, the Emperor crossed the river.',
  ],
  s0659: [
    'On day bingzi, the River God was sacrificed to and the river was crossed.',
    'On bingzi day, the Emperor sacrificed to the River God and crossed the river.',
  ],
  s0660: [
    'Yiling\'a was made Director-General of the Imperial Household Department.',
    'Yiling\'a became director-general of the imperial household.',
  ],
  s0661: [
    'That month, quota land tax for last year\'s flood and drought disasters was remitted for eight Jiangsu prefectures, counties, and guards including Shangyuan and ten Anhui prefectures and counties and three guards including Huaining.',
    'That month, prior-year flood and drought land tax was remitted in eight Jiangsu and ten Anhui districts.',
  ],
  s0662: [
    'Summer, fourth month, day bingxu: quota land tax for last year\'s flood was remitted for five Zhili prefectures and counties including Wanping.',
    'In the fourth summer month, on bingxu day, prior-year flood land tax was remitted in five Zhili districts including Wanping.',
  ],
  s0663: [
    'On day gengyin, the Emperor sacrificed at Yu\'s temple.',
    'On gengyin day, the Emperor worshipped at Yu\'s temple.',
  ],
  s0664: [
    'On day renyin, Li Shou was made Jiangxi governor.',
    'On renyin day, Li Shou became Jiangxi governor.',
  ],
  s0665: [
    'On day jiachen, because Weihui and other subordinate units in Henan suffered drought, accumulated tax arrears were remitted for sixteen counties including Ji county.',
    'On jiachen day, drought led to back-tax remission in sixteen Henan counties including Ji.',
  ],
  s0666: [
    'On day yisi, accumulated tax arrears were remitted for seven Zhili prefectures and counties including Daming.',
    'On yisi day, back taxes were forgiven in seven Zhili districts including Daming.',
  ],
  s0667: [
    'On day bingwu, Tian Wu and others of the New Teaching among the Hui of Gansu rose in rebellion; Li Shiyao and Gangta were ordered to suppress them.',
    'On bingwu day, Tian Wu\'s Gansu Hui rebels rose; Li Shiyao and Gangta were sent against them.',
  ],
  s0668: [
    'On day dingwei, the Emperor returned to the capital.',
    'On dingwei day, the Emperor returned to Beijing.',
  ],
  s0669: [
    'Hailu was made Commissioner Assistant at Ush.',
    'Hailu became Ush commissioner assistant.',
  ],
  s0670: [
    'On day gengxu, accumulated tax arrears from the thirty-eighth through forty-sixth years were remitted in Shaanxi and Gansu.',
    'On gengxu day, Shaanxi and Gansu back taxes from years 38–46 were forgiven.',
  ],
  s0671: [
    'On day xinhai, Li Shou was transferred to be Hunan governor and Yixing\'a Jiangxi governor.',
    'On xinhai day, Li Shou took Hunan and Yixing\'a, Jiangxi.',
  ],
  s0672: [
    'On day jiayin, Rufen and one hundred eleven others were granted metropolitan graduate degrees with distinctions in rank.',
    'On jiayin day, Rufen and 111 others received metropolitan degrees with graded honors.',
  ],
  s0673: [
    'That month, quota land tax for last year\'s flood was remitted for four Hubei counties including Huangmei and three guards including Wuchang.',
    'That month, prior-year flood land tax was remitted in four Hubei counties and three guards.',
  ],
  s0674: [
    'Fifth month, day bingchen: Chuoketuo was stripped of office and arrested on account of a related matter; Qinggui was made Minister of Works.',
    'In the fifth month, on bingchen day, Chuoketuo was arrested and Qinggui became works minister.',
  ],
  s0675: [
    'Changqing was transferred to be General of Fuzhou and Yongduo General of Hangzhou.',
    'Changqing took Fuzhou; Yongduo, Hangzhou.',
  ],
  s0676: [
    'On day jiwei, Qinggui was ordered to serve in the Grand Council.',
    'On jiwei day, Qinggui entered the Grand Council.',
  ],
  s0677: [
    'On day renxu, the Emperor went on the autumn hunt to Mulan.',
    'On renxu day, the Emperor hunted at Mulan.',
  ],
  s0678: [
    'On day guihai, accumulated tax arrears were remitted for three Shaanxi prefectures and departments including Yan\'an.',
    'On guihai day, back taxes were forgiven in three Shaanxi districts including Yan\'an.',
  ],
  s0679: [
    'On day wuchen, the Emperor halted at the Mountain Resort for Summer.',
    'On wuchen day, the Emperor stayed at the summer resort.',
  ],
  s0680: [
    'On day jisi, Fu Kang\'an and Hailancha were ordered to Gansu to suppress and capture Hui bandits.',
    'On jisi day, Fu Kang\'an and Hailancha were sent to Gansu against Hui rebels.',
  ],
  s0681: [
    'On day jiaxu, A Gui was ordered to lead Firearms and Vanguard troops to Gansu to suppress rebellious Hui.',
    'On jiaxu day, A Gui took firearms and vanguard troops to Gansu against rebel Hui.',
  ],
  s0682: [
    'A Gui was made general; Fu Kang\'an, Hailancha, and Wudai were all made commissioner assistants.',
    'A Gui became general; Fu Kang\'an, Hailancha, and Wudai became commissioner assistants.',
  ],
  s0683: [
    'On day yihai, Gansu Hui bandits captured Tongwei county but soon recovered it.',
    'On yihai day, Hui rebels briefly took Tongwei and were driven out.',
  ],
  s0684: [
    'Shuliang was made lead commander.',
    'Shuliang became lead commander.',
  ],
  s0685: [
    'On day gengchen, Li Shiyao was stripped of office for negligence; Fu Kang\'an was made Shaanxi-Gansu governor-general.',
    'On gengchen day, Li Shiyao lost his post for negligence and Fu Kang\'an took Shaanxi-Gansu.',
  ],
  s0686: [
    'Gangta was stripped of office and arrested for missing his opportunity.',
    'Gangta was arrested for military failure.',
  ],
  s0687: [
    'On day xinsi, Qinggui was transferred to be Minister of War and Fu Xing again Minister of Works.',
    'On xinsi day, Qinggui took the war ministry and Fu Xing again took works.',
  ],
  s0688: [
    'Ayang\'a was made Left Censor-in-Chief.',
    'Ayang\'a became Left Censor-in-Chief.',
  ],
  s0689: [
    'On day guimao, Jiangnan governor Hao Shuo was arrested for greed.',
    'On guimao day, Jiangnan governor Hao Shuo was arrested for corruption.',
  ],
  s0690: [
    'That month, quota land tax for last year\'s flood was remitted for subordinate units of three Shandong prefectures and departments including Yanzhou.',
    'That month, prior-year flood land tax was remitted in three Shandong prefectures including Yanzhou.',
  ],
  s0691: [
    'Sixth month, day gengyin: quota land tax for the current year was remitted in Gansu.',
    'In the sixth month, on gengyin day, Gansu\'s current-year land tax was remitted.',
  ],
  s0692: [
    'On day jiawu, flood relief was distributed for the flood disaster in Chaling and You counties in Hunan.',
    'On jiawu day, flood relief reached Chaling and You in Hunan.',
  ],
  s0693: [
    'On day renyin, Eastern Lodge Grand Secretary Sanbao died.',
    'On renyin day, Grand Secretary Sanbao died.',
  ],
  s0694: [
    'On day wushen, Shulin was made Anhui governor.',
    'On wushen day, Shulin became Anhui governor.',
  ],
  s0695: [
    'That month, quota land tax for last year\'s flood and drought was remitted for thirteen Anhui prefectures, counties, and guards including Huaining.',
    'That month, prior-year flood and drought land tax was remitted in thirteen Anhui districts.',
  ],
  s0696: [
    'Autumn, seventh month, first day jiayin, new moon: solar eclipse.',
    'At the seventh-month new moon, a solar eclipse occurred.',
  ],
  s0697: [
    'On day dingsi, Minister of Rites Cao Xiuxian died; Yao Chengilie was made Minister of Rites.',
    'On dingsi day, Cao Xiuxian died; Yao Chengilie took the rites ministry.',
  ],
  s0698: [
    'Li Shou was transferred to be Hubei governor and Luzhai Hunan governor.',
    'Li Shou took Hubei; Luzhai, Hunan.',
  ],
  s0699: [
    'On day jiwei, Hao Shuo was granted permission to commit suicide.',
    'On jiwei day, Hao Shuo was allowed to take his own life.',
  ],
  s0700: [
    'On day jiazi, the Gansu Shifengbao Hui bandits were pacified and bandit leaders including Zhang Wenqing were captured.',
    'On jiazi day, Shifengbao rebels in Gansu were crushed and Zhang Wenqing and other leaders were taken.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_014_b07.mjs <translation.json>'
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
