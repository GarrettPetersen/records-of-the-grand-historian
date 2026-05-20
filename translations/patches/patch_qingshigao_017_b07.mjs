#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'On day bingchen, the Emperor went to offer libation before the coffin palace of Empress Xiaomu.',
    'On bingchen day, the Emperor offered wine before Empress Xiaomu\'s coffin palace.',
  ],
  s0602: [
    'Yilibu was appointed governor of Yunnan.',
    'Yilibu became Yunnan governor.',
  ],
  s0603: [
    'On day wuwu, six-tenths of quota levies were remitted for twenty-two prefectures, departments, and counties of Shaanxi including Huazhou through which troops passed.',
    'On wuwu day, six-tenths of quota levies were remitted for twenty-two Shaanxi districts on the troop route.',
  ],
  s0604: [
    'On day gengshen, the Emperor visited the Eastern Tombs and remitted five-tenths of this year\'s quota levies on places the route passed through.',
    'On gengshen day, the Emperor visited the Eastern Tombs with five-tenths tax relief on the route.',
  ],
  s0605: [
    'On day guihai, he visited Zhaoxiling, Xiaoling, Xiaodongling, Jingling, and Yuling.',
    'On guihai day, he visited Zhaoxiling, Xiaoling, Xiaodongling, Jingling, and Yuling.',
  ],
  s0606: [
    'Changling was summoned; Deying\'a was made Ili General.',
    'Changling was recalled and Deying\'a became Ili general.',
  ],
  s0607: [
    'Dai Junyuan was promoted to Grand Preceptor of the Crown Prince.',
    'Dai Junyuan was made grand preceptor of the crown prince.',
  ],
  s0608: [
    'That day, the imperial procession returned.',
    'That day the Emperor returned to the capital.',
  ],
  s0609: [
    'On day gengwu, Yang Guozhen was made governor of Henan.',
    'On gengwu day, Yang Guozhen became Henan governor.',
  ],
  s0610: [
    'Four-tenths of quota levies for Banner households were remitted at the Shengjing capital and fourteen attached places including Kaiyuan.',
    'Four-tenths of Banner quota levies were remitted at Shengjing and fourteen attached districts.',
  ],
  s0611: [
    'That month, extra relief was given for the flood disaster in Lueyang county, Shaanxi.',
    'That month extra flood relief went to Lueyang in Shaanxi.',
  ],
  s0612: [
    'Winter, tenth month, day gengchen: principal and miscellaneous grain and money arrears owed by the people of each province from the twenty-fifth year of Jiaqing through the fifth year of Daoguang were remitted.',
    'In the tenth winter month, on gengchen day, provincial grain and money arrears from Jiaqing 25 through Daoguang 5 were remitted.',
  ],
  s0613: [
    'On day renwu, the Empress Dowager\'s longevity birthday: by edict of the Empress Dowager, banquets were suspended.',
    'On renwu day, the Empress Dowager\'s birthday; per her edict, feasts were stopped.',
  ],
  s0614: [
    'On day bingxu, Minister of Rites Yao Wentian died; Tang Jinzhuan replaced him.',
    'On bingxu day, Yao Wentian died and Tang Jinzhuan took the Ministry of Rites.',
  ],
  s0615: [
    'Pan Shien was made Left Censor-in-Chief of the Censorate.',
    'Pan Shien became left censor-in-chief.',
  ],
  s0616: [
    'On day gengyin, Babeng\'a was dismissed; Elerjin was made consultant minister at Kobdo.',
    'On gengyin day, Babeng\'a was dismissed and Elerjin became Kobdo consultant minister.',
  ],
  s0617: [
    'On day dingyou, Lunbudu\'erji was made Mongol commissioner at Kulun.',
    'On dingyou day, Lunbudu\'erji became Kulun Mongol commissioner.',
  ],
  s0618: [
    'That month, relief was given for flood disasters in Jiangling and Jianli counties, Hubei, and garrison settlements of each guard.',
    'That month flood relief went to Jiangling, Jianli, and attached garrison settlements in Hubei.',
  ],
  s0619: [
    'Grain was given to station households flooded at Guangning county, Fengtian.',
    'Flood-struck station households at Guangning in Fengtian received grain.',
  ],
  s0620: [
    'Stored grain was loaned for drought and hail disasters in Dingxiang and Lucheng counties, Shanxi, and for short rations at Moergen city, Heilongjiang.',
    'Shanxi drought and hail districts and Moergen in Heilongjiang received loaned grain.',
  ],
  s0621: [
    'Eleventh month, day yisi: Changling was ordered to supervise, together with Yang Fang, the settlement of affairs after the pacification of the Western Regions.',
    'In the eleventh month, on yisi day, Changling and Yang Fang were ordered to settle Xinjiang affairs.',
  ],
  s0622: [
    'On day bingwu, Nayancheng was summoned.',
    'On bingwu day, Nayancheng was summoned to court.',
  ],
  s0623: [
    'On day gengxu, Nayancheng was appointed Imperial Commissioner to join Changling in planning the settlement of affairs after the pacification of the Western Regions.',
    'On gengxu day, Nayancheng became imperial commissioner with Changling for Xinjiang settlement.',
  ],
  s0624: [
    'Tu Zhishen was ordered to act as Zhili governor-general.',
    'Tu Zhishen acted as Zhili governor-general.',
  ],
  s0625: [
    'On day jisi, four-tenths of land-and-service silver levies were remitted for seven prefectures, departments, and counties of Fengtian including Liaoyang.',
    'On jisi day, four-tenths of land tax was remitted for seven Fengtian districts including Liaoyang.',
  ],
  s0626: [
    'That month, relief was given for flood and hail disasters in six prefectures and counties of Gansu including Minzhou.',
    'That month flood and hail relief went to six Gansu districts including Minzhou.',
  ],
  s0627: [
    'Twelfth month: Yande was made general at Uliasutai.',
    'In the twelfth month, Yande became Uliasutai general.',
  ],
  s0628: [
    'That year, Korea, Ryukyu, and Siam presented tribute.',
    'That year tribute came from Korea, Ryukyu, and Siam.',
  ],
  s0629: [
    'Eighth year, spring, first month, day bingwu: Songyun was ordered to act as Rehe commander; Na Qing\'an was ordered to act as Minister of Rites.',
    'In year 8, on first-month bingwu day, Songyun acted at Rehe and Na Qing\'an at the Ministry of Rites.',
  ],
  s0630: [
    'On day wushen, Liu Binshi was appointed governor of Zhejiang.',
    'On wushen day, Liu Binshi became Zhejiang governor.',
  ],
  s0631: [
    'On day renxu, Changling memorialized that Jahangir had been captured.',
    'On renxu day, Changling reported the capture of Jahangir.',
  ],
  s0632: [
    'On day guihai, Changling was enfeoffed as Duke of Weiyong and made an imperial presence minister.',
    'On guihai day, Changling became Duke of Weiyong and an imperial presence minister.',
  ],
  s0633: [
    'Yang Fang was enfeoffed as Marquis of Guoyong.',
    'Yang Fang was made Marquis of Guoyong.',
  ],
  s0634: [
    'Guoqisihuan was transferred to be general at Suiyuan.',
    'Guoqisihuan became Suiyuan general.',
  ],
  s0635: [
    'On day yichou, Cao Zhenyong was promoted to Grand Tutor; Wen Fu to Grand Tutor of the Crown Prince; and Yu Lin to Grand Guardian of the Crown Prince.',
    'On yichou day, Cao Zhenyong became grand tutor, Wen Fu grand tutor of the crown prince, and Yu Lin grand guardian of the crown prince.',
  ],
  s0636: [
    'Mu Zhang\'a was made Junior Guardian of the Crown Prince and also appointed to the Grand Council.',
    'Mu Zhang\'a became junior guardian of the crown prince and joined the Grand Council.',
  ],
  s0637: [
    'Yang Yuchun was appointed Shaanxi-Gansu governor-general.',
    'Yang Yuchun became Shaanxi-Gansu governor-general.',
  ],
  s0638: [
    'On day bingyin, Prince Yonghuai was promoted to Grand Tutor of the Crown Prince.',
    'On bingyin day, Prince Yonghuai became grand tutor of the crown prince.',
  ],
  s0639: [
    'Ying He was restored to Grand Guardian of the Crown Prince.',
    'Ying He was restored as grand guardian of the crown prince.',
  ],
  s0640: [
    'Nayancheng was ordered to proceed still as Imperial Commissioner to Kashgar and, together with Yang Fang, settle the aftermath.',
    'Nayancheng was still sent as imperial commissioner to Kashgar with Yang Fang to settle affairs.',
  ],
  s0641: [
    'On day dingmao, Xi\'en was made Junior Guardian of the Crown Prince.',
    'On dingmao day, Xi\'en became junior guardian of the crown prince.',
  ],
  s0642: [
    'That month, grain rations were given to poor people of Peixian county, Jiangsu.',
    'That month poor people in Jiangsu Peixian received grain.',
  ],
  s0643: [
    'Grain rations were loaned for disaster and shortage in nine prefectures and counties of Zhili including Cangzhou; seed grain was loaned to Jiangling and Jianli counties of Hubei and garrison settlements of each guard; stored grain was loaned in four counties of Shanxi including Dingxiang; and funds were loaned for repairing quarters of garrisons at Jiangning and Jingkou, Jiangsu.',
    'Disaster rations were loaned in Zhili, seed in Hubei garrisons, grain in Shanxi, and repair funds for Jiangsu garrisons.',
  ],
  s0644: [
    'Second month, day yihai: the ministers, because the Western Regions had been pacified again, proposed an honorific title for the Emperor; he declined and ordered discussion of an honorific title for the Empress Dowager.',
    'On second-month yihai day, ministers proposed an imperial honorific for reconquering Xinjiang; the Emperor refused and ordered an empress dowager honorific instead.',
  ],
  s0645: [
    'Left Censor-in-Chief Shi Zhiguang died.',
    'Shi Zhiguang, left censor-in-chief, died.',
  ],
  s0646: [
    'Third month, new moon on day gengzi: there was a solar eclipse.',
    'In the third month on the new moon, gengzi day, there was a solar eclipse.',
  ],
  s0647: [
    'On day yisi, the Emperor went on the enclosure hunt; from yisi through dingwei he did the same each day.',
    'From yisi through dingwei the Emperor hunted in the enclosure each day.',
  ],
  s0648: [
    'On day wushen, the Emperor returned to the palace.',
    'On wushen day, the Emperor returned to the palace.',
  ],
  s0649: [
    'That month, grain rations were loaned to poor people in six prefectures and counties of Zhili including Kaizhou.',
    'That month poor people in six Zhili districts including Kaizhou received loaned grain.',
  ],
  s0650: [
    'Summer, fourth month: Guoqisihuan was transferred to be general at Heilongjiang; Te Yishunbao was made general at Suiyuan.',
    'In the fourth summer month, Guoqisihuan took Heilongjiang and Te Yishunbao took Suiyuan.',
  ],
  s0651: [
    'That month, stored grain was loaned for poor harvest in twenty-four prefectures and counties of Shanxi including Daizhou, for disaster areas of garrison troops in Hubei, and for the grain stores of camps of the Jingzhou naval command.',
    'That month grain was loaned in twenty-four Shanxi districts, Hubei garrison disaster areas, and Jingzhou naval camps.',
  ],
  s0652: [
    'Fifth month, day jiyou: because Jahangir had been captured, officials were dispatched to announce the victory with sacrifices at the Imperial Ancestral Temple and the Altar of Land and Grain, and the captive-presentation rite was performed.',
    'In the fifth month, on jiyou day, Jahangir\'s capture was announced at the ancestral temple and altar with a captive presentation.',
  ],
  s0653: [
    'On day gengxu, the Emperor received the captive at the Meridian Gate.',
    'On gengxu day, the captive was presented at the Meridian Gate.',
  ],
  s0654: [
    'Changling was promoted to Grand Guardian.',
    'Changling was made grand guardian.',
  ],
  s0655: [
    'Yang Fang was promoted to Grand Guardian of the Crown Prince.',
    'Yang Fang was made grand guardian of the crown prince.',
  ],
  s0656: [
    'On day renzi, the Emperor held court to try Jahangir\'s crime; he was dismembered at the market.',
    'On renzi day, Jahangir was tried at court and dismembered in the market.',
  ],
  s0657: [
    'On day dingsi, portraits were ordered painted in the Ziguang Pavilion of the forty meritorious officials who settled the Western Regions and of Grand Councilors Cao Zhenyong, Wen Fu, Wang Ding, and Yu Lin.',
    'On dingsi day, forty Xinjiang meritorious officers and councilors Cao Zhenyong, Wen Fu, Wang Ding, and Yu Lin were painted in Ziguang Pavilion.',
  ],
  s0658: [
    'That month, stored grain was loaned to soldiers of the Huangzhou garrison command in the disaster-struck garrison area of Hubei.',
    'That month Huangzhou garrison soldiers in Hubei disaster areas received loaned grain.',
  ],
  s0659: [
    'Sixth month, day guiyou: Changling, Pacification General and Grand Secretary, returned in triumph; Prince Ulgungga and others were ordered to welcome and reward him.',
    'In the sixth month, on guiyou day, Changling returned victorious and Ulgungga and others were sent to welcome him.',
  ],
  s0660: [
    'On day bingzi, Changling was ordered to manage the Court of Colonial Affairs.',
    'On bingzi day, Changling was put in charge of the Court of Colonial Affairs.',
  ],
  s0661: [
    'Autumn, seventh month, day jiachen: Korean king Li Xi, because the Western Regions had been pacified, sent envoys with a congratulatory memorial and local products.',
    'In the seventh autumn month, on jiachen day, Korea\'s Li Xi congratulated the Xinjiang pacification with envoys and gifts.',
  ],
  s0662: [
    'On day bingwu, Sheng Yin was made Rehe commander; Na Qing\'an was ordered to act as Minister of Rites.',
    'On bingwu day, Sheng Yin became Rehe commander and Na Qing\'an again acted at the Ministry of Rites.',
  ],
  s0663: [
    'Eighth month, day dingchou: on the Longevity Festival, banquets were suspended.',
    'In the eighth month, on dingchou day, the longevity feast was stopped.',
  ],
  s0664: [
    'On day jimao, Chengge was made Rehe commander.',
    'On jimao day, Chengge became Rehe commander.',
  ],
  s0665: [
    'Lu Kun was transferred to be governor of Guangdong.',
    'Lu Kun became Guangdong governor.',
  ],
  s0666: [
    'Xu Xin was made governor of Shanxi.',
    'Xu Xin became Shanxi governor.',
  ],
  s0667: [
    'On day jiashen, Yishao, Tuojin, Fujun, and Chen Ruolin were ordered to remain in the capital to handle affairs.',
    'On jiashen day, Yishao, Tuojin, Fujun, and Chen Ruolin were left in Beijing to manage affairs.',
  ],
  s0668: [
    'That month, grain rations were given for flood disasters in four counties of Zhejiang including Chun\'an.',
    'That month flood victims in four Zhejiang counties including Chun\'an received grain.',
  ],
  s0669: [
    'Working capital was loaned to salt-field households of Changlu drowned by flood.',
    'Changlu flood-struck salt households received loaned working capital.',
  ],
  s0670: [
    'New and old quota levies were remitted and deferred for four counties of Zhejiang including Chun\'an.',
    'New and old levies were remitted or deferred in four Zhejiang counties including Chun\'an.',
  ],
  s0671: [
    'Ninth month, new moon on day wuxu: there was a solar eclipse.',
    'In the ninth month on the new moon, wuxu day, there was a solar eclipse.',
  ],
  s0672: [
    'On day bingwu, the Emperor visited the Eastern Tombs and remitted three-tenths of quota levies on places the route passed through.',
    'On bingwu day, the Emperor visited the Eastern Tombs with three-tenths tax relief on the route.',
  ],
  s0673: [
    'On day dingwei, because the Baohuayu project had been handled carelessly, Ying He was stripped of office and Dai Junyuan was reduced to a third-rank button.',
    'On dingwei day, careless work at Baohuayu cost Ying He his post and Dai Junyuan his second-rank button.',
  ],
  s0674: [
    'On day jiyou, he visited Zhaoxiling, Xiaoling, Xiaodongling, Jingling, and Yuling, and also sacrificed at the mourning palace of Empress Xiaomu.',
    'On jiyou day, he visited the Eastern tombs and sacrificed at Empress Xiaomu\'s mourning palace.',
  ],
  s0675: [
    'Dai Junyuan was stripped of office.',
    'Dai Junyuan lost his post.',
  ],
  s0676: [
    'On day gengxu, he visited Yuling and performed the great feast rite.',
    'On gengxu day, the Emperor visited Yuling and held the great feast rite.',
  ],
  s0677: [
    'On day xinhai, Ying He was imprisoned and his household property was confiscated.',
    'On xinhai day, Ying He was jailed and his property was seized.',
  ],
  s0678: [
    'On day guichou, the Emperor returned to the Old Summer Palace.',
    'On guichou day, the Emperor returned to Yuanmingyuan.',
  ],
  s0679: [
    'On day jiayin, the Emperor visited the Western Tombs and remitted three-tenths of quota levies on places the route passed through.',
    'On jiayin day, the Emperor visited the Western Tombs with three-tenths tax relief on the route.',
  ],
  s0680: [
    'On day dingsi, he visited Tailing, Taodongling, and Changling.',
    'On dingsi day, he visited Tailing, Taodongling, and Changling.',
  ],
  s0681: [
    'On day wuwu, he visited Changling and performed the great feast rite.',
    'On wuwu day, the Emperor visited Changling and held the great feast rite.',
  ],
  s0682: [
    'On day gengshen, Dai Junyuan was arrested and imprisoned, and his household property was confiscated.',
    'On gengshen day, Dai Junyuan was arrested, jailed, and his property seized.',
  ],
  s0683: [
    'On day xinyou, the Emperor returned to the Old Summer Palace.',
    'On xinyou day, the Emperor returned to Yuanmingyuan.',
  ],
  s0684: [
    'Te Yishunbao was transferred to be general at Heilongjiang.',
    'Te Yishunbao became Heilongjiang general.',
  ],
  s0685: [
    'Nayancheng was made general at Suiyuan; Dalin\'a was made consultant minister at Tarbagatai.',
    'Nayancheng took Suiyuan and Dalin\'a became Tarbagatai consultant minister.',
  ],
  s0686: [
    'That month, relief was given for flood disasters at three salt fields of the Liang-Huai region including Zhongzheng in Haizhou prefecture.',
    'That month flood relief went to three Liang-Huai salt fields in Haizhou.',
  ],
  s0687: [
    'Silver for tea prices was loaned to soldiers of the four western cities of the Western Regions.',
    'Soldiers of Xinjiang\'s four western cities received loaned tea-price silver.',
  ],
  s0688: [
    'Winter, tenth month, day gengwu: Ying He was banished in penal service to Heilongjiang.',
    'In the tenth winter month, on gengwu day, Ying He was exiled to Heilongjiang.',
  ],
  s0689: [
    'On day jiawu, Prince Dun Junwang Mian Kai was restored as Prince Dun.',
    'On jiawu day, Prince Dun Junwang Mian Kai was restored as Prince Dun.',
  ],
  s0690: [
    'That month, relief was given for flood disasters in three prefectures, counties, and guards of Jiangsu including Haizhou and in five counties of Zhejiang including Jiande.',
    'That month flood relief went to Haizhou in Jiangsu and five Zhejiang counties including Jiande.',
  ],
  s0691: [
    'One month\'s grain rations were given for flood and drought disasters in nine prefectures and counties of Jiangsu including Gaoyou and in twenty-six counties of Anhui including Sizhou.',
    'One month\'s grain went to nine Jiangsu districts including Gaoyou and twenty-six Anhui districts including Sizhou.',
  ],
  s0692: [
    'Grain rations were loaned to Banner households flooded in Fengtian places including Guangning; grain and stone were given to poor people of Fuyang county, Zhejiang; and silver and grain were loaned to official estates of Banner camps at Qiqiha\'er and other places.',
    'Flooded Fengtian Banner households, Fuyang poor, and Qiqiha\'er garrison estates received loans of grain or silver.',
  ],
  s0693: [
    'New and old quota levies were remitted and deferred for thirty-six prefectures, departments, counties, guards, and departments of Jiangsu including Haizhou, for twenty-six prefectures and counties of Anhui including Sizhou, and for thirteen prefectures and counties of Zhejiang including Haining, stricken by drought and flood.',
    'Levies were remitted or deferred in thirty-six Jiangsu districts, twenty-six Anhui districts, and thirteen Zhejiang districts hit by drought and flood.',
  ],
  s0694: [
    'Eleventh month, day jiachen: the Empress Dowager\'s honorific title was declared to be Empress Dowager Gong Ci An Yu Kang Cheng.',
    'In the eleventh month, on jiachen day, the empress dowager received the honorific Gong Ci An Yu Kang Cheng.',
  ],
  s0695: [
    'On day yisi, because the rites for adding the Empress Dowager\'s honorific title had been completed, an edict was promulgated throughout the empire and grace was extended by degree.',
    'On yisi day, after the empress dowager honorific rites, an empire-wide edict granted graded amnesty.',
  ],
  s0696: [
    'On day jiwei, Dai Junyuan was released.',
    'On jiwei day, Dai Junyuan was released.',
  ],
  s0697: [
    'That month, relief was given for the flood disaster in Fuyang county, Zhejiang.',
    'That month flood relief went to Fuyang in Zhejiang.',
  ],
  s0698: [
    'Grain rations were given for flood disasters at Ningguta and other places in Shengjing.',
    'Flood victims at Ningguta and other Shengjing places received grain.',
  ],
  s0699: [
    'Twelfth month, day xinsi: Nayancheng memorialized that he had won over the surrender of the Etiogene tribe attached to Khoqand.',
    'In the twelfth month, on xinsi day, Nayancheng reported winning the surrender of Khoqand\'s Etiogene tribe.',
  ],
  s0700: [
    'An edict praised this and ordered that they be properly settled and governed.',
    'The court praised the report and ordered proper settlement and control.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_017_b07.mjs <translation.json>'
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
