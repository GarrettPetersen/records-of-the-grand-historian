#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0901: [
    'From the eighth month of the wuxu year until this month, [the Emperor] personally performed the rites for the first time.',
    'From wuxu month 8 through this month, the Emperor personally performed the rites for the first time.',
  ],
  s0902: [
    'On day gengzi, sacrifices were offered to the Grand Earth and Grand Grain.',
    'On gengzi day, the Grand Earth and Grand Grain were sacrificed to.',
  ],
  s0903: [
    'Prince Rui Kuibin and others were dispatched to perform announcement sacrifices at the Earth altar, the Sun-rise altar, and the Moon-set altar; Prince Gong Puwei and Beizi Pulun went to the Eastern and Western imperial mausoleums for announcement sacrifices.',
    'Kuibin, Prince Rui, and others announced sacrifices at the Earth, Sun-rise, and Moon-set altars; Puwei, Prince Gong, and Beizi Pulun announced sacrifices at the Eastern and Western tombs.',
  ],
  s0904: [
    'On day renyin, Yuan Shikai was ordered to join the Office for Government Affairs.',
    'On renyin day, Yuan Shikai was told to join the Office for Government Affairs.',
  ],
  s0905: [
    'On day jiachen, Defender of the State Zai Zhen was appointed special envoy to Britain to congratulate the king on his coronation; he was soon promoted to beizi rank.',
    'On jiachen day, Zai Zhen was sent to Britain to congratulate the coronation and soon made a beizi.',
  ],
  s0906: [
    'One-third of the regular tax quota was remitted for the Henan prefectures and counties along the imperial procession route.',
    'Henan counties on the procession route had one-third of their tax quota remitted.',
  ],
  s0907: [
    'Relief was ordered for the Guangxi fire disaster.',
    'Guangxi fire victims were ordered relieved.',
  ],
  s0908: [
    'On day xinhai, the two Dowager Empresses received the foreign ministers at the Palace of Heavenly Purity.',
    'On xinhai day, both dowagers received foreign ministers at the Palace of Heavenly Purity.',
  ],
  s0909: [
    'Accumulated civilian arrears at Yunnan copper mines were remitted.',
    'Long-standing civilian debts at Yunnan copper works were forgiven.',
  ],
  s0910: [
    'On day jiayin, Qu Hongji was made Grand Councilor.',
    'On jiayin day, Qu Hongji joined the Grand Council.',
  ],
  s0911: [
    'Sun Jianai was appointed Grand Secretary of the Hall of Bodies Benevolence.',
    'Sun Jianai was made a Grand Secretary of the Bodies Benevolence Hall.',
  ],
  s0912: [
    'On day yimao, the two Dowager Empresses received the foreign ministers and their wives at the Hall of Cultivating Nature.',
    'On yimao day, both dowagers received foreign ministers and their wives at the Hall of Cultivating Nature.',
  ],
  s0913: [
    'On day dingsi, years of unpaid grain tax and stored grain owed by Shanxi prefectures and counties were remitted.',
    'On dingsi day, Shanxi tax and granary arrears were forgiven.',
  ],
  s0914: [
    'On day gengshen, a combined ancestral sacrifice was held at the Imperial Ancestral Temple.',
    'On gengshen day, a combined sacrifice was held at the Imperial Ancestral Temple.',
  ],
  s0915: [
    'On day xinyou, the Emperor resumed holding banquets in the Hall of Preserving Harmony for Mongol princes and civil and military officials.',
    'On xinyou day, the Emperor again banqueted Mongol princes and officials in the Hall of Preserving Harmony.',
  ],
  s0916: [
    'Land tax on unreclaimed fields was remitted in Renhe, Qiantang, and other Zhejiang counties, and in the Hangyan and Jiahu garrisons.',
    'Unreclaimed-field land tax was waived in Zhejiang counties including Renhe and Qiantang and in the Hangyan and Jiahu garrisons.',
  ],
  s0917: [
    'Twenty-eighth year, renyin, spring, first month, day gengwu: sacrifice was offered at the Imperial Ancestral Temple.',
    'In year 28, renyin, spring month 1, gengwu, the Imperial Ancestral Temple was sacrificed to.',
  ],
  s0918: [
    'On day xinwei, prayers for grain were offered to Heaven.',
    'On xinwei day, grain prayers were offered to Heaven.',
  ],
  s0919: [
    'On day guiyou, Sichuan provincial military commissioner Song Qing died and was posthumously enfeoffed as third-class baron.',
    'On guiyou day, Song Qing, Sichuan commander, died and was posthumously made a third-class baron.',
  ],
  s0920: [
    'On day dingchou, Zhang Yi was ordered to oversee railway and mining affairs overall; Wang Wenshao and Qu Hongji were made supervisors; Lü Haihuan was ordered to confer with Sheng Xuanhuai on commercial treaties.',
    'On dingchou day, Zhang Yi took overall charge of railways and mines; Wang Wenshao and Qu Hongji supervised; Lü Haihuan was to consult Sheng Xuanhuai on trade treaties.',
  ],
  s0921: [
    'On day wuyin, the Governor-General of the Hedong River Circuit was abolished.',
    'On wuyin day, the Hedong River governor-generalship was abolished.',
  ],
  s0922: [
    'Provincial governors were ordered to clarify garrison land holdings, convert military rations to household grain tax, return garrison officials to camps, and abolish garrison households and transport troops.',
    'Provinces were told to sort garrison lands, turn military rations into household tax, return garrison officers to camps, and abolish garrison and transport troops.',
  ],
  s0923: [
    'An edict ordered the provinces to establish agricultural and industrial schools.',
    'The provinces were ordered to set up agricultural and industrial schools.',
  ],
  s0924: [
    'On day wuzi, the Household of the Heir Apparent and the Office of Transmission were abolished.',
    'On wuzi day, the Heir Apparent\'s Household and the Office of Transmission were abolished.',
  ],
  s0925: [
    'Second month, new moon day renchen: Zhang Deyi was appointed special envoy to Spain to congratulate the king on his coronation.',
    'In month 2, new moon renchen, Zhang Deyi was sent to Spain to congratulate the coronation.',
  ],
  s0926: [
    'On day guisi, the provinces were urgently ordered to establish schools and military academies and to open offices for compiling new laws.',
    'On guisi day, provinces were pressed to open schools, military academies, and offices to draft new laws.',
  ],
  s0927: [
    'On day jiawu, Guangxi roving bandits killed a French soldier; they were suppressed.',
    'On jiawu day, Guangxi bandits killed a French soldier and were suppressed.',
  ],
  s0928: [
    'On day dingyou, the sacrifice to the sage teacher was performed.',
    'On dingyou day, the Confucian sacrifice was performed.',
  ],
  s0929: [
    'On day wuxu, sacrifices were offered to the Grand Earth and Grand Grain.',
    'On wuxu day, the Grand Earth and Grand Grain were sacrificed to.',
  ],
  s0930: [
    'On day gengxu, Liu Kunyi requested leave on grounds of illness and was urged to remain in office.',
    'On gengxu day, Liu Kunyi asked to retire ill and was told to stay.',
  ],
  s0931: [
    'Third month, new moon day xinyou: the handover treaty for the three eastern provinces was concluded.',
    'In month 3, new moon xinyou, the three eastern provinces handover treaty was signed.',
  ],
  s0932: [
    'On day jiazi, Italian minister Galignani was received at the Palace of Heavenly Purity.',
    'On jiazi day, Italian minister Galignani was received at the Palace of Heavenly Purity.',
  ],
  s0933: [
    'On day yichou, the Former Agriculture was worshipped and the Emperor personally ploughed the sacred field.',
    'On yichou day, the Former Agriculture rite was held and the Emperor ploughed the sacred field.',
  ],
  s0934: [
    'On day bingyin, the Emperor escorted the Empress Dowager to visit the Eastern mausoleums; one-third of regular taxes was remitted along the procession route.',
    'On bingyin day, the Emperor escorted the empress dowager to the Eastern tombs and remitted one-third of taxes along the route.',
  ],
  s0935: [
    'From day jisi to day gengwu, the imperial tombs were visited.',
    'From jisi through gengwu, the imperial tombs were visited.',
  ],
  s0936: [
    'On day jiaxu, the court went to the Southern Park and halted at the Tuanhe Travelling Palace.',
    'On jiaxu day, the court went to the Southern Park and stayed at Tuanhe Palace.',
  ],
  s0937: [
    'On day renwu, [the court] returned from the Eastern mausoleums.',
    'On renwu day, the court returned from the Eastern tombs.',
  ],
  s0938: [
    'On day guiwei, the Empress performed the rite to the Primordial Silkworm.',
    'On guiwei day, the empress performed the Primordial Silkworm rite.',
  ],
  s0939: [
    'That spring, disaster relief was remitted for the garrison settlements at Xuanwei, Kunming, Qiqihar, and Mergen.',
    'That spring, disaster relief was granted to Xuanwei, Kunming, Qiqihar, and Mergen garrisons.',
  ],
  s0940: [
    'Arrears were remitted at Yulin and elsewhere; two-tenths of autumn grain tax was remitted at Xi\'an and other □ counties.',
    'Yulin arrears were forgiven and Xi\'an and other □ counties had two-tenths of autumn grain tax waived.',
  ],
  s0941: [
    'Summer, fourth month, day renchen: Russian minister Lessar was received at the Palace of Heavenly Purity.',
    'In summer month 4, renchen, Russian minister Lessar was received at the Palace of Heavenly Purity.',
  ],
  s0942: [
    'On day jiawu, the regular summer prayer-for-rain sacrifice to Heaven was performed.',
    'On jiawu day, the regular summer rain prayer to Heaven was held.',
  ],
  s0943: [
    'On day bingshen, Shen Jiaben and Wu Tingfang were ordered to help revise current laws.',
    'On bingshen day, Shen Jiaben and Wu Tingfang were told to help revise current laws.',
  ],
  s0944: [
    'On day wuxu, Li Jingxi was dismissed as Yunnan governor for improper memorial wording and referred to the ministries for deliberation.',
    'On wuxu day, Li Jingxi lost the Yunnan governorship for bad wording and was referred to the ministries.',
  ],
  s0945: [
    'On day renyin, Xu Heng was appointed minister to Italy, Wu Dezhang minister to Austria, and Yang Zhaokun minister to Belgium.',
    'On renyin day, Xu Heng went to Italy, Wu Dezhang to Austria, and Yang Zhaokun to Belgium.',
  ],
  s0946: [
    'On day guimao, the Empress performed the mulberry-picking rite.',
    'On guimao day, the empress performed the mulberry-picking rite.',
  ],
  s0947: [
    'On day jiachen, the silver, silk bolt, and pigment treasuries were abolished and the supervising treasury grandees dismissed.',
    'On jiachen day, the silver, silk, and pigment treasuries were cut and their supervising grandees removed.',
  ],
  s0948: [
    'On day yimao, land tax was remitted for disaster-stricken land in Luanping.',
    'On yimao day, Luanping disaster land tax was forgiven.',
  ],
  s0949: [
    'Fifth month, day renxu: Yuan Shikai was appointed Governor-General of Zhili and concurrently Commissioner for the Northern Seas.',
    'In month 5, renxu, Yuan Shikai became Zhili governor-general and Northern Seas commissioner.',
  ],
  s0950: [
    'Arrears at Shuangcheng were remitted.',
    'Shuangcheng tax arrears were forgiven.',
  ],
  s0951: [
    'On day jiazi, the foreign ministers were received at the Hall of Leshou.',
    'On jiazi day, foreign ministers were received at the Hall of Leshou.',
  ],
  s0952: [
    'On day bingyin, Guangxi bandits seized Gui Chao in Guangnan; Yunnan government troops drove them off and recovered the city.',
    'On bingyin day, Guangxi bandits took Gui Chao in Guangnan; Yunnan troops drove them out and retook the city.',
  ],
  s0953: [
    'On day bingzi, the summer solstice; sacrifice to Earth was performed at the Square Mound.',
    'On bingzi day, the summer solstice; Earth was sacrificed to at the Square Mound.',
  ],
  s0954: [
    'On day wuyin, American minister Conger and others were received at the Palace of Heavenly Purity.',
    'On wuyin day, US minister Conger and others were received at the Palace of Heavenly Purity.',
  ],
  s0955: [
    'Sixth month, new moon day jichou: miscellaneous taxes were remitted for disaster areas in Heqing and Binchuan.',
    'In month 6, new moon jichou, Heqing and Binchuan disaster miscellaneous taxes were waived.',
  ],
  s0956: [
    'On day bingshen, Sun Baoqi was appointed minister to France, Hu Weide minister to Russia, and Liang Cheng minister to the United States, Japan, and Peru.',
    'On bingshen day, Sun Baoqi went to France, Hu Weide to Russia, and Liang Cheng to the United States, Japan, and Peru.',
  ],
  s0957: [
    'On day gengxu, American minister Conger and exposition director Berlek were received at the Palace of Heavenly Purity.',
    'On gengxu day, US minister Conger and exposition director Berlek were received at the Palace of Heavenly Purity.',
  ],
  s0958: [
    'On day xinhai, Zhang Zhidong was appointed Superintendent of Commercial Affairs.',
    'On xinhai day, Zhang Zhidong was made superintendent of commercial affairs.',
  ],
  s0959: [
    'On day guichou, relief was ordered for disasters in Nanchong, Jian, and other districts of Sichuan.',
    'On guichou day, Sichuan districts including Nanchong and Jian were ordered relieved.',
  ],
  s0960: [
    'Autumn, seventh month, day gengwu: school regulations were promulgated.',
    'In autumn month 7, gengwu, school regulations were issued.',
  ],
  s0961: [
    'Eighth month, day jiashen: the Yunnan Tengyue Circuit was moved to Tengyue with concurrent supervision of customs.',
    'In month 8, jiashen, the Yunnan Tengyue circuit was stationed at Tengyue and given customs oversight.',
  ],
  s0962: [
    'On day wuxu, Yuan Shikai requested abolition of irregular fees and addition of public expenses; other provinces were ordered to follow.',
    'On wuxu day, Yuan Shikai asked to cut irregular fees and add public expenses, and other provinces were told to copy him.',
  ],
  s0963: [
    'On day guimao, the Yellow River burst its banks at Lijin, Shouzhang, and elsewhere.',
    'On guimao day, the Yellow River broke at Lijin, Shouzhang, and elsewhere.',
  ],
  s0964: [
    'On day jiyou, German minister Gelos and others were received at the Hall of Benevolent Longevity.',
    'On jiyou day, German minister Gelos and others were received at the Hall of Benevolent Longevity.',
  ],
  s0965: [
    'On day gengxu, the river burst again at Huimin.',
    'On gengxu day, the river broke again at Huimin.',
  ],
  s0966: [
    'Ninth month, day guisi: Liangjiang Governor-General Liu Kunyi died; he was posthumously enfeoffed as first-class baron and given the title Grand Tutor.',
    'In month 9, guisi, Liu Kunyi, Liangjiang governor-general, died and was posthumously made a first-class baron and Grand Tutor.',
  ],
  s0967: [
    'Zhang Zhidong was ordered to serve as acting Liangjiang Governor-General and Commissioner of the Southern Ocean.',
    'Zhang Zhidong was told to act as Liangjiang governor-general and Southern Ocean commissioner.',
  ],
  s0968: [
    'New and old regular taxes for Tianjin areas affected by military disturbances were remitted.',
    'Tianjin war-hit areas had new and old tax quotas remitted.',
  ],
  s0969: [
    'On day dingyou, French minister Gasnier and others were received at the Hall of Benevolent Longevity.',
    'On dingyou day, French minister Gasnier and others were received at the Hall of Benevolent Longevity.',
  ],
  s0970: [
    'On day jiachen, the foreign ministers were received at the Hall of Benevolent Longevity.',
    'On jiachen day, foreign ministers were received at the Hall of Benevolent Longevity.',
  ],
  s0971: [
    'On day renzi, Yuan Shikai was appointed Superintendent of Commercial Affairs with Wu Tingfang as deputy, also to negotiate commercial treaties with various countries.',
    'On renzi day, Yuan Shikai headed commercial affairs with Wu Tingfang as deputy and also negotiated foreign trade treaties.',
  ],
  s0972: [
    'That autumn, 300,000 taels from the treasury were issued, another 120,000 for disaster relief was allocated, and funds were also set aside for relief in Sichuan.',
    'That autumn, 300,000 treasury taels were issued, 120,000 more for relief, and Sichuan relief funds were set aside.',
  ],
  s0973: [
    'Relief was also ordered for flood disasters in Shandong, Guangdong, Yunnan, Fujian, Guizhou, and other regions.',
    'Floods in Shandong, Guangdong, Yunnan, Fujian, Guizhou, and elsewhere were also ordered relieved.',
  ],
  s0974: [
    'Winter, tenth month, day wuzi: the Sino-British commercial treaty was concluded.',
    'In winter month 10, wuzi, the Sino-British commercial treaty was signed.',
  ],
  s0975: [
    'On day jichou, Hunan battalion commander Liu Changru was executed for failing to protect missionaries.',
    'On jichou day, Hunan commander Liu Changru was executed for not protecting missionaries.',
  ],
  s0976: [
    'That month, relief was ordered for disasters in Shanxi and Shaanxi jurisdictions.',
    'That month, Shanxi and Shaanxi disaster areas were ordered relieved.',
  ],
  s0977: [
    'Earthquakes occurred in Jianchuan and Heqing prefectures in Yunnan and in □ counties including Shule in Xinjiang.',
    'Yunnan\'s Jianchuan and Heqing and Xinjiang\'s Shule and other □ counties were all shaken by earthquakes.',
  ],
  s0978: [
    'Eleventh month, day wuwu: an edict decreed that from the next metropolitan examination onward, all appointees as compilers, revisers, converted bachelors, and ministry clerks must study at the Capital University and could only leave the Hanlin Academy or apply to remain after receiving a diploma.',
    'In month 11, wuwu, from the next metropolitan exam all new compilers, revisers, converted bachelors, and ministry clerks had to study at the Capital University and could not leave the Hanlin until they held diplomas.',
  ],
  s0979: [
    'Provincial magistrates were also each to enter training halls for instruction.',
    'Each provincial magistrate was also to study in a training hall.',
  ],
  s0980: [
    'On day jiwei, You Tai was appointed Resident Commissioner in Tibet.',
    'On jiwei day, You Tai was made resident commissioner in Tibet.',
  ],
  s0981: [
    'On day xinyou, 50,000 taels each from the privy purse and ministry treasury were sent to Shandong for disaster relief.',
    'On xinyou day, 50,000 taels each from the privy and ministry treasuries went to Shandong for relief.',
  ],
  s0982: [
    'On day renxu, Wei Guangtao was transferred to be Liangjiang Governor-General and Commissioner of the Southern Ocean.',
    'On renxu day, Wei Guangtao was moved to Liangjiang governor-general and Southern Ocean commissioner.',
  ],
  s0983: [
    'On day bingyin, land tax on flooded land in Lintong was remitted for five years.',
    'On bingyin day, Lintong flooded land tax was waived for five years.',
  ],
  s0984: [
    'On day gengchen, the winter solstice; Heaven was worshipped at the Circular Mound.',
    'On gengchen day, the winter solstice; Heaven was worshipped at the Circular Mound.',
  ],
  s0985: [
    'That month, French minister Beau and American minister Conger were received at the Palace of Heavenly Purity.',
    'That month, French minister Beau and US minister Conger were received at the Palace of Heavenly Purity.',
  ],
  s0986: [
    'Twelfth month, day guimao: Yuan Shikai was appointed Superintendent of Telegraph Affairs.',
    'In month 12, guimao, Yuan Shikai was made superintendent of telegraph affairs.',
  ],
  s0987: [
    'On day xinhai, the filial conduct of Xi Chen, son of the late envoy to Russia Yang Ru who died in a foreign land for his father, was commended.',
    'On xinhai day, Xi Chen, son of envoy Yang Ru who died abroad mourning his father, was rewarded for filial conduct.',
  ],
  s0988: [
    'That month, regular taxes were remitted for □ prefectures, counties, and garrisons in Jiangsu and Zhejiang; rent grain was remitted for flooded Yiliang.',
    'That month, Jiangsu and Zhejiang □ prefectures, counties, and garrisons had tax quotas waived and flooded Yiliang had rent grain remitted.',
  ],
  s0989: [
    'Twenty-ninth year, guimao, spring, first month, on dingsi new moon day: banquets were suspended.',
    'In year 29, guimao, spring month 1, new moon dingsi, banquets were suspended.',
  ],
  s0990: [
    'Because the Empress Dowager would reach her seventieth birthday the next year, an edict opened a celebratory examination list: this year would be the guimao grace-year provincial examination, next year the jiachen grace-year metropolitan examination; the regular provincial and metropolitan examinations would both be held at the next regular cycle.',
    'For the empress dowager\'s seventieth birthday next year, a grace examination was opened: guimao provincial and jiachen metropolitan grace exams this cycle, with regular exams deferred to the next cycle.',
  ],
  s0991: [
    'On day yichou, American minister Conger and others were received at the Palace of Heavenly Purity.',
    'On yichou day, US minister Conger and others were received at the Palace of Heavenly Purity.',
  ],
  s0992: [
    'On day dingmao, Rong Qing was ordered to jointly administer university affairs.',
    'On dingmao day, Rong Qing was told to help run the university.',
  ],
  s0993: [
    'On day jisi, the foreign ministers were received at the Hall of Cultivating Nature.',
    'On jisi day, foreign ministers were received at the Hall of Cultivating Nature.',
  ],
  s0994: [
    'On day dinghai, grain tax was remitted for disaster areas in Zhenxi and Shufu.',
    'On dinghai day, Zhenxi and Shufu disaster grain tax was forgiven.',
  ],
  s0995: [
    'Second month, day renzi: the Huimin breach was closed.',
    'In month 2, renzi, the Huimin river breach was closed.',
  ],
  s0996: [
    'Third month, new moon day bingchen: there was a solar eclipse.',
    'In month 3, new moon bingchen, there was a solar eclipse.',
  ],
  s0997: [
    'On day gengshen, German Prince Henry, minister Gelos, and others were received at the Palace of Heavenly Purity.',
    'On gengshen day, German Prince Henry, minister Gelos, and others were received at the Palace of Heavenly Purity.',
  ],
  s0998: [
    'An edict decreed that the mausoleum visit would use the railway, banned irregular levies of labor service, and exempted escorts from supplying provisions.',
    'The court ordered the tomb visit to go by rail, banned irregular corvée levies, and freed escorts from supplying provisions.',
  ],
  s0999: [
    'On day xinyou, the Manchu and Chinese superintendents and instructors of the Imperial School were abolished.',
    'On xinyou day, the Manchu and Chinese heads and teachers of the Imperial School were cut.',
  ],
  s1000: [
    'On day guihai, the Former Agriculture was worshipped and the Emperor personally ploughed the sacred field.',
    'On guihai day, the Former Agriculture rite was held and the Emperor ploughed the sacred field.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_024_b10.mjs <translation.json>'
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
