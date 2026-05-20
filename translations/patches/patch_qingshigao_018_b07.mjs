#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'On day dingchou, Zhou Tianjue was transferred to be governor of Henan; Zhu Shu was made Grand Canal transport governor.',
    'On dingchou day, Zhou Tianjue became Henan governor and Zhu Shu canal transport governor.',
  ],
  s0602: [
    'On day wuzi, the Emperor went to the Wanshou Mountain Hall to pray for rain.',
    'On wuzi day, the Emperor prayed for rain at Wanshou Mountain Hall.',
  ],
  s0603: [
    'On day dingyou, because of drought in Zhili, grain transport taxes on rice coming from Fengtian, Shandong, and Henan to Zhili were remitted.',
    'On dingyou day, Zhili drought brought remission of rice transport taxes from Fengtian, Shandong, and Henan.',
  ],
  s0604: [
    'Fifth month, day xinchou: it rained.',
    'In the fifth month, on xinchou day, rain fell.',
  ],
  s0605: [
    'Grand Secretary on leave Lu Yinpu died.',
    'Lu Yinpu, grand secretary on leave, died.',
  ],
  s0606: [
    'That month, quota levies were relieved for earthquake disasters in Langqiong and Dengchuan prefectures and counties, Yunnan.',
    'That month Yunnan Langqiong and Dengchuan received earthquake tax relief.',
  ],
  s0607: [
    'Sixth month, day bingyin: Min-Zhe governor-general Zhong Xiang was dismissed because his seal of office was stolen; Zhou Tianjue replaced him; Niu Jian was made governor of Henan.',
    'In the sixth month, on bingyin day, Zhong Xiang lost the Min-Zhe post over a stolen seal; Zhou Tianjue replaced him and Niu Jian took Henan.',
  ],
  s0608: [
    'On day dinghai, former Liang-Jiang governor-general Tao Zhu, Grand Mentor of the Crown Prince, died.',
    'On dinghai day, Tao Zhu, former Liang-Jiang governor-general and grand mentor of the crown prince, died.',
  ],
  s0609: [
    'On day xinmao, Zhou Tianjue was transferred to be governor-general of Huguang.',
    'On xinmao day, Zhou Tianjue became Huguang governor-general.',
  ],
  s0610: [
    'Autumn, seventh month, day renzi: Lin Zexu was ordered to proclaim by edict to England and to merchants of all nations at Guangdong concerning the ban on opium trafficking.',
    'In the seventh autumn month, on renzi day, Lin Zexu was ordered to notify England and Guangdong foreign merchants of the opium ban.',
  ],
  s0611: [
    'That month, famine rations were given for flood disaster in Huarong county, Hunan.',
    'That month flood victims in Hunan Huarong received famine rations.',
  ],
  s0612: [
    'Eighth month, day gengwu: Jinge\'ebu was transferred to be general at Chengdu; Tuohunbu was made governor of Shandong.',
    'In the eighth month, on gengwu day, Jinge\'ebu became Chengdu general and Tuohunbu Shandong governor.',
  ],
  s0613: [
    'Uliasutai general Baochang was summoned to the capital; Lian Jing replaced him.',
    'Baochang was recalled from Uliasutai and Lian Jing replaced him.',
  ],
  s0614: [
    'That month, famine rations were given to three prefectures and counties including Jiazhou, Shaanxi, stricken by disaster.',
    'That month disaster rations went to three Shaanxi districts including Jiazhou.',
  ],
  s0615: [
    'Ninth month, day gengzi: Tuohunbu was ordered to investigate and handle sea bandits at Dengzhou, Shandong, and reorganize the navy.',
    'In the ninth month, on gengzi day, Tuohunbu was sent to suppress Dengzhou pirates and reform the navy.',
  ],
  s0616: [
    'On day xinchou, the Emperor reviewed the troops of the Jianrui Camp.',
    'On xinchou day, the Emperor reviewed Jianrui Camp troops.',
  ],
  s0617: [
    'On day jiyou, Hafeng\'a was transferred to be general at Guangzhou; Kunchukecele was transferred to be general at Heilongjiang; Dekejinbu was made general at Suiyuan.',
    'On jiyou day, Hafeng\'a went to Guangzhou, Kunchukecele to Heilongjiang, and Dekejinbu became Suiyuan general.',
  ],
  s0618: [
    'Winter, tenth month: Shanxi governor Shen Qixian died; condolence gifts followed the precedent for a minister.',
    'In the tenth winter month, Shanxi governor Shen Qixian died with ministerial mourning honors.',
  ],
  s0619: [
    'Yang Guozhen was made governor of Shanxi.',
    'Yang Guozhen became Shanxi governor.',
  ],
  s0620: [
    'That month, flood relief was given for floods in eleven prefectures and counties of Anhui including Wuwei and garrison settlements of each guard.',
    'That month flood relief went to eleven Anhui districts including Wuwei and attached garrison settlements.',
  ],
  s0621: [
    'Flood-stricken people in three counties of Hubei including Huangmei were relieved.',
    'Flood victims in three Hubei counties including Huangmei were relieved.',
  ],
  s0622: [
    'Famine rations were given for flood and drought disasters in nine prefectures and counties of Hubei including Mianyang, Mengyin county of Shandong, Fugu and Shenmu counties of Shaanxi, and nine prefectures and guards of Hunan including Huarong.',
    'Famine rations went to flood and drought districts in Hubei, Shandong Mengyin, Shaanxi Fugu and Shenmu, and nine Hunan prefectures and guards.',
  ],
  s0623: [
    'New and old quota levies were remitted or deferred for flood disasters in thirty-two prefectures and counties of Anhui including Wuwei, twenty-six in Hubei including Mianyang, twenty-one in Henan including Suizhou, and nine prefectures and guards in Hunan including Lizhou.',
    'Flood tax relief covered thirty-two Anhui, twenty-six Hubei, twenty-one Henan, and nine Hunan districts.',
  ],
  s0624: [
    'Eleventh month, day gengzi: English ships entered Guangdong harbor; Lin Zexu supervised government troops in driving them off and stopped their trade.',
    'In the eleventh month, on gengzi day, English ships entered Guangdong; Lin Zexu drove them off and halted trade.',
  ],
  s0625: [
    'Cheng Maolai was made governor of Anhui.',
    'Cheng Maolai became Anhui governor.',
  ],
  s0626: [
    'On day wushen, Dekejinbu was transferred to be general at Guangzhou; Songpo was made general at Suiyuan; Shulunbao was made general at Heilongjiang.',
    'On wushen day, Dekejinbu went to Guangzhou, Songpo to Suiyuan, and Shulunbao to Heilongjiang.',
  ],
  s0627: [
    'On day gengxu, Jekemete was ordered to proceed to Kulun to meet and escort the Jebtsundamba Khutukhtu to audience.',
    'On gengxu day, Jekemete was sent to Kulun to escort the Jebtsundamba Khutukhtu to court.',
  ],
  s0628: [
    'That month, famine rations were given to disaster victims in seven counties of Jiangxi including Dehua and four prefectures and counties of Shanxi including Yingzhou.',
    'That month disaster rations went to seven Jiangxi counties including Dehua and four Shanxi districts including Yingzhou.',
  ],
  s0629: [
    'New and old quota levies on disaster areas were remitted in twenty-three counties of Jiangxi including Nanchang, eight prefectures and counties of Shanxi including Yingzhou, and five prefectures of Zhili including Anzhou.',
    'Disaster tax remissions covered twenty-three Jiangxi counties, eight Shanxi districts, and five Zhili prefectures.',
  ],
  s0630: [
    'Twelfth month, day guihai: Acting Liang-Jiang governor-general Chen Juan died; Deng Tingzhen was transferred to be Liang-Jiang governor-general; Lin Zexu was made governor-general of Liang-Guang; Yu Qian was made governor of Jiangsu.',
    'On twelfth-month guihai day, Chen Juan died; Deng Tingzhen took Liang-Jiang, Lin Zexu Liang-Guang, and Yu Qian Jiangsu.',
  ],
  s0631: [
    'On day guiyou, the Jebtsundamba Khutukhtu and others had audience.',
    'On guiyou day, the Jebtsundamba Khutukhtu and others were received in audience.',
  ],
  s0632: [
    'Yilibu was transferred to be Liang-Jiang governor-general; Deng Tingzhen was made Yun-Gui governor-general.',
    'Yilibu became Liang-Jiang governor-general and Deng Tingzhen Yun-Gui governor-general.',
  ],
  s0633: [
    'On day guiwei, Long Wen, Minister of Punishments, was ordered to serve on the Grand Council.',
    'On guiwei day, Long Wen of the Ministry of Punishments joined the Grand Council.',
  ],
  s0634: [
    'Deng Tingzhen was transferred to be Min-Zhe governor-general; Gui Liang was made Yun-Gui governor-general.',
    'Deng Tingzhen became Min-Zhe governor-general and Gui Liang Yun-Gui governor-general.',
  ],
  s0635: [
    'On day wuzi, Chen Guanjun was dismissed; Liao Hongquan was made Minister of Works.',
    'On wuzi day, Chen Guanjun was dismissed and Liao Hongquan took the Ministry of Works.',
  ],
  s0636: [
    'Grand Councilor Wen Qing was dismissed.',
    'Wen Qing was dismissed from the Grand Council.',
  ],
  s0637: [
    'That year, Korea and Ryukyu presented tribute.',
    'That year Korea and Ryukyu sent tribute.',
  ],
  s0638: [
    'Twentieth year, spring, first month, renchen new moon: Wang Ding was given the additional office of Grand Guardian of the Heir Apparent.',
    'In year 20, on the first-month renchen new moon, Wang Ding received the additional title grand guardian of the heir apparent.',
  ],
  s0639: [
    'On day wuxu, Alejing\'a was made Rehe commander.',
    'On wuxu day, Alejing\'a became Rehe commander.',
  ],
  s0640: [
    'On day jihai, the Court of Colonial Affairs forbade the Jebtsundamba Khutukhtu from using banner umbrellas; moreover, without prior memorial, Yiji was stripped of imperial presence minister, Minister of Revenue, superintendent of the Imperial Household, and purple bridle, and dismissed from managing the Court of Colonial Affairs.',
    'On jihai day, the Court of Colonial Affairs barred the Khutukhtu\'s banner umbrellas; Yiji lost his court posts and purple bridle for acting without memorial.',
  ],
  s0641: [
    'Saishang\'a was demoted one rank in peacock feather.',
    'Saishang\'a lost one rank of peacock feather.',
  ],
  s0642: [
    'Long Wen was transferred to be Minister of Revenue.',
    'Long Wen became minister of revenue.',
  ],
  s0643: [
    'On day renyin, the Empress Niohuru died.',
    'On renyin day, Empress Niohuru died.',
  ],
  s0644: [
    'On day wushen, the late Empress was given the posthumous title Empress Xiaquan.',
    'On wushen day, the late empress was titled Empress Xiaquan.',
  ],
  s0645: [
    'On day gengxu, Yiji was arrested for interrogation.',
    'On gengxu day, Yiji was arrested for investigation.',
  ],
  s0646: [
    'On day gengshen, because Yiji had accepted silver gifts from the Shabron, he was sent into exile in Heilongjiang; Saishang\'a and others were all referred to the Boards for severe deliberation.',
    'On gengshen day, Yiji was exiled to Heilongjiang for Shabron bribes; Saishang\'a and others faced severe board review.',
  ],
  s0647: [
    'Second month, day guihai: Alejing\'a was made Minister of Punishments; Ne\'erjing\'e was made Rehe commander; Hafeng\'a was made commissioner at Xining.',
    'On second-month guihai day, Alejing\'a took punishments, Ne\'erjing\'e Rehe, and Hafeng\'a Xining.',
  ],
  s0648: [
    'On day dingmao, Minister of Revenue He Linghan died; Zhuo Bingtian replaced him.',
    'On dingmao day, He Linghan died and Zhuo Bingtian took revenue.',
  ],
  s0649: [
    'Qi Junzao was made Minister of War; Shen Qi was made Left Censor-in-chief.',
    'Qi Junzao became minister of war and Shen Qi left censor-in-chief.',
  ],
  s0650: [
    'On day dingchou, Grand Canal-East transport governor Li Yumei died; Wen Chong replaced him.',
    'On dingchou day, Li Yumei died and Wen Chong became canal-east transport governor.',
  ],
  s0651: [
    'That month, famine rations were given to poor people of Tongcheng county, Anhui.',
    'That month poor people in Anhui Tongcheng received famine rations.',
  ],
  s0652: [
    'Stored grain was loaned to soldiers of camps including Hebao, Shanxi.',
    'Shanxi camps including Hebao received loaned grain.',
  ],
  s0653: [
    'Third month: He Rulei was ordered to study while serving on the Grand Council.',
    'In the third month, He Rulei was ordered to study on the Grand Council.',
  ],
  s0654: [
    'Yi Shan was summoned to the capital; Buyantai was made Ili general.',
    'Yi Shan was recalled and Buyantai became Ili general.',
  ],
  s0655: [
    'On day xinhai, Bichang was made Chahar commander.',
    'On xinhai day, Bichang became Chahar commander.',
  ],
  s0656: [
    'That month, stored grain was loaned to nine prefectures and departments of Shanxi including Jizhou.',
    'That month nine Shanxi prefectures and departments including Jizhou received loaned grain.',
  ],
  s0657: [
    'Summer, fourth month, xinyou new moon: posthumous title was conferred on Empress Xiaquan; the day after, an edict was promulgated.',
    'In the fourth summer month, on the xinyou new moon, Empress Xiaquan was given posthumous honors and an edict followed next day.',
  ],
  s0658: [
    'On day jisi, Jinge\'ebu was transferred to be general at Jilin.',
    'On jisi day, Jinge\'ebu became Jilin general.',
  ],
  s0659: [
    'On day bingzi, Xiang Kang was made commissioner at Kulun.',
    'On bingzi day, Xiang Kang became Kulun commissioner.',
  ],
  s0660: [
    'On day wuyin, the Emperor went to Black Dragon Pool to pray for rain.',
    'On wuyin day, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0661: [
    'On day yiyou, Li Chenglin and one hundred eighty others were granted jinshi and other degrees with distinctions.',
    'On yiyou day, Li Chenglin and 180 others received jinshi degrees in varying ranks.',
  ],
  s0662: [
    'On day wuzi, the Emperor went to Guangrun Shrine to pray for rain.',
    'On wuzi day, the Emperor prayed for rain at Guangrun Shrine.',
  ],
  s0663: [
    'That month, stored grain was loaned to troops of Zijinguan and three camps under it including Futuyu, Zhili.',
    'That month Zhili troops at Zijinguan and three subordinate camps received loaned grain.',
  ],
  s0664: [
    'Sixth month, day dingmao: Sekejin\'a was made general at Suiyuan.',
    'In the sixth month, on dingmao day, Sekejin\'a became Suiyuan general.',
  ],
  s0665: [
    'On day dingchou, Lin Zexu and others memorialized that opium-carrying foreign boats had been destroyed.',
    'On dingchou day, Lin Zexu reported destruction of opium boats.',
  ],
  s0666: [
    'On day gengchen, English ships entered Zhejiang waters and besieged Dinghai county seat.',
    'On gengchen day, English ships entered Zhejiang and besieged Dinghai.',
  ],
  s0667: [
    'Yu Buyun was ordered to join Wu\'ergong\'e and others in relief.',
    'Yu Buyun was ordered to reinforce Wu\'ergong\'e at Dinghai.',
  ],
  s0668: [
    'On day jiashen, the English took Dinghai county; Magistrate Yao Huaixiang and others died.',
    'On jiashen day, the English captured Dinghai; Magistrate Yao Huaixiang and others were killed.',
  ],
  s0669: [
    'Wu\'ergong\'e and Zhejiang provincial commander Zhu Tingbiao were stripped of office but retained in post.',
    'Wu\'ergong\'e and Zhejiang commander Zhu Tingbiao were demoted yet kept in place.',
  ],
  s0670: [
    'Husong\'e was transferred to be Rehe commander; Ne\'erjing\'e was made Shaanxi-Gansu governor-general.',
    'Husong\'e became Rehe commander and Ne\'erjing\'e Shaanxi-Gansu governor-general.',
  ],
  s0671: [
    'Autumn, seventh month, day guisi: English ships attacked Zhejiang Zhaopu harbor.',
    'In the seventh autumn month, on guisi day, English ships attacked Zhaopu in Zhejiang.',
  ],
  s0672: [
    'Qi Mingbao was ordered to lead troops in defense.',
    'Qi Mingbao was ordered to lead troops against them.',
  ],
  s0673: [
    'The English fleet attacked Fujian Xiamen batteries; Vice Commander Chen Shengyuan and others drove them off.',
    'English forces attacked Xiamen batteries; Chen Shengyuan and others repulsed them.',
  ],
  s0674: [
    'On day bingshen, Zhejiang governor Wu\'ergong\'e was stripped of office; Liu Yunke replaced him.',
    'On bingshen day, Wu\'ergong\'e lost the Zhejiang governorship and Liu Yunke replaced him.',
  ],
  s0675: [
    'On day dingyou, Yilibu was made Imperial Commissioner to proceed to Zhejiang to suppress and handle affairs.',
    'On dingyou day, Yilibu became imperial commissioner for Zhejiang operations.',
  ],
  s0676: [
    'Yu Qian was ordered to act additionally as Liang-Jiang governor-general.',
    'Yu Qian was ordered to act as Liang-Jiang governor-general as well.',
  ],
  s0677: [
    'Tuanduobu was made Ili councilor; Huashantai was made councilor at Tarbagatai.',
    'Tuanduobu became Ili councilor and Huashantai Tarbagatai councilor.',
  ],
  s0678: [
    'On day jiachen, English ships anchored outside Tianjin; they delivered a letter to Qishan stating grievances.',
    'On jiachen day, English ships lay off Tianjin and sent Qishan a letter of grievance.',
  ],
  s0679: [
    'Qishan was ordered to receive it and still charged them not to enter port.',
    'Qishan was ordered to accept the letter but still forbid entry into port.',
  ],
  s0680: [
    'On day bingwu, Huashantai was transferred to be leading commander at Kashgar; Tuanduobu was transferred to be councilor at Tarbagatai; Fuxing\'a was made Ili councilor.',
    'On bingwu day, Huashantai went to Kashgar, Tuanduobu to Tarbagatai, and Fuxing\'a became Ili councilor.',
  ],
  s0681: [
    'On day gengxu, Lin Zexu and others memorialized further captures of opium traffickers.',
    'On gengxu day, Lin Zexu reported more opium arrests.',
  ],
  s0682: [
    'An edict rebuked them for stalling with empty words.',
    'The court rebuked them for empty excuses.',
  ],
  s0683: [
    'On day yimao, English ships reached Shanhaiguan and other places.',
    'On yimao day, English ships reached Shanhaiguan and elsewhere.',
  ],
  s0684: [
    'On day bingchen, Yilibu and others were ordered: if English presented letters, to accept and memorialize urgently.',
    'On bingchen day, Yilibu and others were told to accept any English letters and memorialize at once.',
  ],
  s0685: [
    'That month, flood relief was given for floods in three prefectures and counties of Hubei including Mianyang.',
    'That month flood relief went to three Hubei districts including Mianyang.',
  ],
  s0686: [
    'Eighth month, day jiazi: Shao Jiaming was ordered to act as governor of Zhejiang.',
    'In the eighth month, on jiazi day, Shao Jiaming acted as Zhejiang governor.',
  ],
  s0687: [
    'On day bingzi, the English again attacked Fujian Xiamen; Regional Commander Chen Jieping and others drove them off.',
    'On bingzi day, the English attacked Xiamen again; Chen Jieping and others drove them off.',
  ],
  s0688: [
    'On day jimao, Qishan was made Imperial Commissioner to proceed to Guangdong to investigate and handle affairs; Yilibu and coastal governors-general and governors were also instructed to defend strategic passes and not to interfere with foreign ships anchored in outer seas.',
    'On jimao day, Qishan was sent to Guangdong as imperial commissioner; coastal officials were told to hold the passes and leave outer-harbor ships alone.',
  ],
  s0689: [
    'Ne\'erjing\'e was transferred to act as Zhili governor-general; Husong\'e was ordered to act as Shaanxi-Gansu governor-general.',
    'Ne\'erjing\'e acted as Zhili governor-general and Husong\'e as Shaanxi-Gansu governor-general.',
  ],
  s0690: [
    'On day gengchen, Lian Jing was transferred to be general at Chengdu; Deleng\'e was made Uliasutai general.',
    'On gengchen day, Lian Jing became Chengdu general and Deleng\'e Uliasutai general.',
  ],
  s0691: [
    'On day xinsi, Yu Qian memorialized that the English had presented their original letter but he dared not report it to the throne.',
    'On xinsi day, Yu Qian admitted he had withheld the English original letter.',
  ],
  s0692: [
    'An edict severely rebuked him.',
    'The court severely rebuked him.',
  ],
  s0693: [
    'That month, famine rations and funds for repairing houses were given for flood disaster in fourteen counties of Jiangsu including Shangyuan.',
    'That month fourteen Jiangsu counties including Shangyuan received flood rations and house-repair funds.',
  ],
  s0694: [
    'Ninth month, day gengyin: Lin Zexu and Deng Tingzhen were ordered referred to the Boards for severe deliberation.',
    'In the ninth month, on gengyin day, Lin Zexu and Deng Tingzhen faced severe board review.',
  ],
  s0695: [
    'Qishan was ordered to act as governor-general of Liang-Guang.',
    'Qishan was ordered to act as Liang-Guang governor-general.',
  ],
  s0696: [
    'On day xinmao, because Tuohunbu memorialized that English ships had sailed south, Qishan and Tuohunbu were ordered to consider withdrawing defensive troops.',
    'On xinmao day, after Tuohunbu reported English ships had gone south, Qishan and Tuohunbu were told to consider reducing defenses.',
  ],
  s0697: [
    'Deng Tingzhen was summoned to the capital; Yan Bozhen was made Min-Zhe governor-general; Zhang Lizhong was made governor of Yunnan.',
    'Deng Tingzhen was recalled; Yan Bozhen took Min-Zhe and Zhang Lizhong Yunnan.',
  ],
  s0698: [
    'On day jiawu, an edict ordered Zhou Tianjue and others to relieve flood disasters in various prefectures and counties of Hubei.',
    'On jiawu day, Zhou Tianjue and others were ordered to relieve Hubei flood disasters.',
  ],
  s0699: [
    'On day yiwei, Lin Zexu and Deng Tingzhen were stripped of office and ordered to proceed to Guangdong to await interrogation.',
    'On yiwei day, Lin Zexu and Deng Tingzhen lost office and were sent to Guangdong for inquiry.',
  ],
  s0700: [
    'On day jihai, English ships entered the inner sea off Cixi and Yuyao counties, Zhejiang; Yilibu and others drove them off.',
    'On jihai day, English ships entered inner waters off Cixi and Yuyao; Yilibu and others drove them away.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_018_b07.mjs <translation.json>'
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
